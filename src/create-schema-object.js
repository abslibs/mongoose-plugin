function createSchemaObject(typeKey, typeValue, options) {
  // eslint-disable-next-line no-param-reassign
  options[typeKey] = typeValue;
  return options;
}

module.exports = createSchemaObject;
