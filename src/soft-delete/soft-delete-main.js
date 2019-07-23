/* eslint-disable prefer-rest-params */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
/*
 * @Author: Arpit Yadav
 * @Date: 2019-07-22 22:48:23
 * @Last Modified by: Arpit Yadav
 * @Last Modified time: 2019-07-24 00:38:39
 */

const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Model } = mongoose;


const parseIndexFields = require('./index-field-parser');
const createSchemaObject = require('./create-schema-object');
const parseUpdateArguments = require('./parse-update-args');


function softDelete(schema, options) {
  options = options || {};

  const indexFields = parseIndexFields(options);

  const { typeKey } = schema.options;

  schema.add({
    deleted: createSchemaObject(typeKey, Boolean, {
      default: false,
      index: indexFields.deleted,
    }),
    deletedAt: createSchemaObject(typeKey, Date, {
      default: null,
      index: indexFields.deletedAt,
    }),
  });


  if (options.deletedBy === true) {
    schema.add({
      deletedBy: createSchemaObject(
        typeKey,
        options.deletedByType || Schema.Types.ObjectId,
        { index: indexFields.deletedBy },
      ),
    });
  }

  schema.pre('save', function (next) {
    if (!this.deleted) {
      this.deleted = false;
    }
    next();
  });

  if (options.paranoid) {
    const overrideItems = options.overrideMethods;
    const overridableMethods = [
      'count',
      'countDocuments',
      'find',
      'findOne',
      'findOneAndUpdate',
      'update',
    ];
    let finalList = [];

    if (
      (typeof overrideItems === 'string' || overrideItems instanceof String)
      && overrideItems === 'all'
    ) {
      finalList = overridableMethods;
    }

    if (typeof overrideItems === 'boolean' && overrideItems === true) {
      finalList = overridableMethods;
    }

    if (Array.isArray(overrideItems)) {
      overrideItems.forEach((method) => {
        if (overridableMethods.indexOf(method) > -1) {
          finalList.push(method);
        }
      });
    }

    finalList.forEach((method) => {
      if (['count', 'countDocuments', 'find', 'findOne'].indexOf(method) > -1) {
        let modelMethodName = method;

        // countDocuments do not exist in Mongoose v4
        /* istanbul ignore next */
        if (
          method === 'countDocuments'
          && typeof Model.countDocuments !== 'function'
        ) {
          modelMethodName = 'count';
        }

        schema.statics[method] = function () {
          const fn = Model[modelMethodName].apply(this, arguments);
          if (fn.options.paranoid !== false) {
            const modelFn = Model[modelMethodName]
              .apply(this, arguments)
              .where('deleted')
              .ne(true);
            return modelFn;
          }
          return fn;
        };
      } else {
        schema.statics[method] = function () {
          // const args = parseUpdateArguments.apply(undefined, arguments);
          const args = parseUpdateArguments(...arguments);

          if (Object.keys(args[1]) !== 'paranoid') {
            args[0].deleted = { $ne: true };
          }

          return Model[method].apply(this, args);
        };
      }
    });
  }

  schema.methods.destroy = function (deletedBy, cb) {
    if (typeof deletedBy === 'function') {
      cb = deletedBy;
      deletedBy = null;
    }

    this.deleted = true;

    if (schema.path('deletedAt')) {
      this.deletedAt = new Date();
    }

    if (schema.path('deletedBy')) {
      this.deletedBy = deletedBy;
    }

    if (options.validateBeforeDelete === false) {
      return this.save({ validateBeforeSave: false }, cb);
    }

    return this.save(cb);
  };

  schema.statics.destroy = function (conditions, deletedBy, callback) {
    if (typeof deletedBy === 'function') {
      callback = deletedBy;
      // eslint-disable-next-line no-self-assign
      conditions = conditions;
      deletedBy = null;
    } else if (typeof conditions === 'function') {
      callback = conditions;
      conditions = {};
      deletedBy = null;
    }

    const doc = {
      deleted: true,
    };

    if (schema.path('deletedAt')) {
      doc.deletedAt = new Date();
    }

    if (schema.path('deletedBy')) {
      doc.deletedBy = deletedBy;
    }

    return this.update(conditions, doc, { multi: true }, callback);
  };

  schema.statics.destroyById = function (id, deletedBy, callback) {
    if (arguments.length === 0 || typeof id === 'function') {
      const msg = 'First argument is mandatory and must not be a function.';
      throw new TypeError(msg);
    }

    const conditions = {
      _id: id,
    };

    return this.destroy(conditions, deletedBy, callback);
  };

  schema.methods.restore = function (callback) {
    this.deleted = false;
    this.deletedAt = undefined;
    this.deletedBy = undefined;
    return this.save(callback);
  };

  schema.statics.restore = function (conditions, callback) {
    if (typeof conditions === 'function') {
      callback = conditions;
      conditions = {};
    }

    const doc = {
      deleted: false,
      deletedAt: undefined,
      deletedBy: undefined,
    };


    return this.update(conditions, doc, { multi: true }, callback);
  };
}

module.exports = softDelete;
