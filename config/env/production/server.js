/***
 * Strapi is deployed in an Amazon EC2 t2.small instance.
 */

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    path: '/dashboard',
  },
  url: 'https://api.cuatl.shop',
});
