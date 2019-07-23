/*
 * @Author: Arpit Yadav
 * @Date: 2019-07-23 21:04:14
 * @Last Modified by: Arpit Yadav
 * @Last Modified time: 2019-07-23 21:11:15
 */
/* eslint-disable no-param-reassign */
/**
 * This code is taken from official mongoose repository
 * https://github.com/Automattic/mongoose/blob/master/lib/query.js#L1996-L2018
 */
/* istanbul ignore next */
function parseUpdateArguments(conditions, doc, options, callback) {
  if (typeof options === 'function') {
    // .update(conditions, doc, callback)
    callback = options;
    options = null;
  } else if (typeof doc === 'function') {
    // .update(doc, callback);
    callback = doc;
    doc = conditions;
    conditions = {};
    options = null;
  } else if (typeof conditions === 'function') {
    // .update(callback)
    callback = conditions;
    conditions = undefined;
    doc = undefined;
    options = undefined;
  } else if (typeof conditions === 'object' && !doc && !options && !callback) {
    // .update(doc)
    doc = conditions;
    conditions = undefined;
    options = undefined;
    callback = undefined;
  }

  const args = [];

  if (conditions) args.push(conditions);
  if (doc) args.push(doc);
  if (options) args.push(options);
  if (callback) args.push(callback);

  return args;
}
module.exports = parseUpdateArguments;
