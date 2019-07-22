/* eslint-disable no-multi-assign */
exports.parseIndexFields = (options) => {
  const indexFields = {
    deleted: false,
    deletedAt: false,
    deletedBy: false,
  };

  if (!options.indexFields) {
    return indexFields;
  }

  if (
    (typeof options.indexFields === 'string'
      || options.indexFields instanceof String)
    && options.indexFields === 'all'
  ) {
    indexFields.deleted = indexFields.deletedAt = indexFields.deletedBy = true;
  }

  if (
    typeof options.indexFields === 'boolean'
    && options.indexFields === true
  ) {
    indexFields.deleted = indexFields.deletedAt = indexFields.deletedBy = true;
  }

  if (Array.isArray(options.indexFields)) {
    indexFields.deleted = options.indexFields.indexOf('deleted') > -1;
    indexFields.deletedAt = options.indexFields.indexOf('deletedAt') > -1;
    indexFields.deletedBy = options.indexFields.indexOf('deletedBy') > -1;
  }

  return indexFields;
};
