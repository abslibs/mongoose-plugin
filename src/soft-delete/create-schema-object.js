/*
 * @Author: Arpit Yadav
 * @Date: 2019-07-23 21:04:24
 * @Last Modified by: Arpit Yadav
 * @Last Modified time: 2019-07-23 21:11:08
 */
function createSchemaObject(typeKey, typeValue, options) {
  // eslint-disable-next-line no-param-reassign
  options[typeKey] = typeValue;
  return options;
}

module.exports = createSchemaObject;
