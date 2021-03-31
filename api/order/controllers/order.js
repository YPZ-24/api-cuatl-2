'use strict';
const { sanitizeEntity } = require('strapi-utils');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Given a MXN amount, return the amount in cents.
 * @param {number} number
 */
const fromDecimalToInt = (number) => parseInt(number * 100);

/**
 * Given a product with id and quantity create an stock event to update the
 * inventory system when an order is confirmed.
 *
 * Return the event id to establish the relationship between order and events.
 * @param {any} product
 */
const createEvent = async (product) => {
  const event = await strapi.services.event.create({
    type: 'salida',
    quantity: product.quantity,
    variant: product.id
  });

  return event.id;
};

/**
 * Given a collection of products return a promise of all the resolved
 * promises when creating a batch of stock events.
 * @param [object] products
 */
const getEvents = async (products) => {
  return Promise.all(products.map((product) => createEvent(product)));
};

/**
 * Given a product from bag, confirm the existence of the product an return it.
 * @param {any} product
 */
const getRealProduct = async (product) => {
  return await strapi.services.variant.findOne({ id: product.id });
};

/**
 * Given a collection of products return a promise of all the resolved
 * promises when verifying a bunch of products. This is done in order to
 * avoid that malicious users inject fake products into a checkout session.
 * @param [object] products
 */
const verifyProducts = async (order) => {
  return Promise.all(order.map((orderItem) => getRealProduct(orderItem.product)));
};

module.exports = {
  /**
   * Only returns orders that belongs to the logged in user.
   * @param {any} ctx
   */
  async find(ctx) {
    const { user } = ctx.state;

    let entities;

    if (ctx.query._q) {
      entities = await strapi.services.order.search({ ...ctx.query, user: user.id });
    } else {
      entities = await strapi.services.order.find({ ...ctx.query, user: user.id });
    }

    return entities.map(entity => sanitizeEntity(entity, {
      model: strapi.models.order
    }));
  },

  /**
   * Returns one order as long as it belongs to the user.
   * @param {any} ctx
   */
  async findOne(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;
    const entity = await strapi.services.order.findOne({ id, user: user.id });

    return sanitizeEntity(entity, { model: strapi.models.order });
  },

  /**
   * Creates an order and sets up the Stripe Checkout session for the front end.
   * @param {any} ctx
   */
  async create(ctx) {
    const { order } = ctx.request.body;

    if (order.length === 0) {
      return ctx.throw(400, '¡Aún no tienes productos en la bolsa, añade algunos!');
    }

    const realProducts = await verifyProducts(order);
    if (realProducts.length !== order.length) {
      return ctx.throw(404, '¡Parece que uno o más de los productos que buscas no existe!');
    }

    const { user } = ctx.state;
    const BASE_URL = ctx.request.header.origin || 'http://localhost:3000';

    //: Format products to be sent to Stripe.
    const items = order.map((orderItem) => {
      return {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: orderItem.product.name
          },
          unit_amount: fromDecimalToInt(orderItem.product.price),
        },
        quantity: orderItem.quantity
      };
    });

    //: Create check out session.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email,
      mode: 'payment',
      success_url: `${BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: BASE_URL,
      line_items: items
    });

    //: Calculate totals
    let totals = { subtotal: 0, delivery_price: 0, total: 0 };
    for (let i = 0; i < order.length; i++) {
      totals.subtotal += order[i].product.price * order[i].quantity;
    }
    totals.total = totals.subtotal + totals.delivery_price;

    /*: Create inventory events.
    const events = order.map((orderItem) => {
      return strapi.services.event.create({
        type: 'salida',
        quantity: orderItem.quantity,
        variant: orderItem.variant.id
      });
    });*/

    //: Create the order.
    const newOrder = strapi.services.order.create({
      status: 'no pagada',
      total: totals.total,
      checkout_session: session.id,
      subtotal: totals.subtotal,
      delivery_price: totals.deliveryPrice,
      delivery_status: 'en camino',
      tracking_number: '',
      user: user.id,
      variants: order.map((orderItem) => orderItem.variant.id),
      events: events
    });

    return { id: session.id }
  },

  /**
   * Given a checkout_session, verifies payment and update the order.
   * Also create the necessary stock events to update product variants stock.
   *
   * Remember! Because of ID is the only supported way to update data, you need
   * to pass the order ID in the request.
   * @param {any} ctx
   */
  async confirm(ctx) {
    const { checkout_session } = ctx.request.body;

    const session = await stripe.checkout.sessions.retrieve(checkout_session);

    if (session.payment_status === 'paid') {
      //: Create stock events.
      let order = await strapi.services.order.findOne({ checkout_session });
      let events = await getEvents(order.variants);

      //: Update order.
      const updatedOrder = await strapi.services.order.update(
        {
          id: order.id,
          checkout_session: checkout_session
        },
        { status: 'pagada', events }
      );

      return sanitizeEntity(updatedOrder, { model: strapi.models.order });
    } else {
      ctx.throw(404, 'Hubo un problema al procesar el pago, por favor ponte en contacto con nuestro equipo de soporte');
    }
  }
};
