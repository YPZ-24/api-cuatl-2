'use strict';

module.exports = {
  lifecycles: {
    /**
     * Update the product variant stock after creating a stock event entry.
     * @param {any} result
     */
    afterCreate: async (result) => {
      if (result.type === 'entrada') {
        const _ = await strapi.services.variant.update(
          { id: result.variant.id },
          { stock: result.variant.stock + result.quantity });
      } else {
        if (result.variant.stock >= result.quantity) {
          const _ = await strapi.services.variant.update(
            { id: result.variant.id },
            { stock: result.variant.stock - result.quantity });
        }
      }
    },

    /**
     * Update the product variant stock after deleting a stock event entry.
     * @param {any} result
     */
    afterDelete: async (result) => {
      if (result.type === 'entrada') {
        const _ = await strapi.services.variant.update(
          { id: result.variant.id },
          { stock: result.variant.stock - result.quantity });
      } else {
        if (result.variant.stock >= result.quantity) {
          const _ = await strapi.services.variant.update(
            { id: result.variant.id },
            { stock: result.variant.stock + result.quantity });
        }
      }
    }
  }
};
