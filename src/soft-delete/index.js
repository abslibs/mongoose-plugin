/*
 * @Author: Arpit Yadav
 * @Date: 2019-07-23 21:04:33
 * @Last Modified by: Arpit Yadav
 * @Last Modified time: 2019-07-23 21:11:12
 */
const parseIndexFields = require('./index-field-parser');
const createSchemaObject = require('./create-schema-object');
const parseUpdateArguments = require('./parse-update-args');
const softDelete = require('./soft-delete-main');

module.exports = {
  parseIndexFields,
  createSchemaObject,
  parseUpdateArguments,
  softDelete,
};
