'use strict';

module.exports = {
  find(params, populate) {
    return strapi.query('category').find(params, populate);
  },

  findOne(params, populate) {
    return strapi.query('category').find(params, populate);
  }
};
