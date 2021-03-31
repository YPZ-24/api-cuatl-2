/***
 * This configuration applies for the default mode of Strapi which is
 * the development mode. The configuration for production mode is in the
 * ./env/production/server.js file.
 */

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'bb686a48ad8dbc8f546aae3c78204bfc'),
    },
  }
  //url: env('SERVER_URL', '0.0.0.0')
});
