/*
 * @Author: Arpit Yadav
 * @Date: 2019-07-23 20:48:42
 * @Last Modified by: Arpit Yadav
 * @Last Modified time: 2019-07-23 21:57:12
 */
/* eslint-disable func-names */
const { softDelete, timestamps } = require('./src');

module.exports = function (schema, options) {
  if (options.paranoid) {
    // deletedAt should be default.
    softDelete(schema, options);
  }
  if (options.createdAt || options.updatedAt || options.timestamps) {
    timestamps(schema, options);
  }
};
