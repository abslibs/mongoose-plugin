/*
 * @Author: Arpit Yadav
 * @Date: 2019-07-23 21:09:45
 * @Last Modified by: Arpit Yadav
 * @Last Modified time: 2019-07-23 21:10:27
 */
const softDelete = require('./soft-delete');
const timestamps = require('./timestamps');

module.exports = {
  ...softDelete,
  ...timestamps,
};
