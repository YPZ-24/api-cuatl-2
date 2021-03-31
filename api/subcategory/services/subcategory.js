'use strict';

module.exports = {
  find(params, populate) {
    return strapi.query('subcategory').find(params, populate);
  },

  findOne(params, populate) {
    return strapi.query('subcategory').find(params, populate);
  }
};
