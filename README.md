# Mongoose Plugin

@abslibs/mongoose-plugin is simple and lightweight plugin that enables some basic required functionality for mongoose.

This code has some features from [dsanel's](https://github.com/dsanel) plugin [mongoose-delete](https://github.com/dsanel/mongoose-delete).

## Features

- Soft Delete document using **destroy** method.

| Feature                                     | Description                                                       |
| ------------------------------------------- | ----------------------------------------------------------------- |
| [ **destroy()** ](#simple-usage)            | method on document (do not override standard **remove()** method) |
| [ **destroyById()** ](#simple-usage)        | static method                                                     |
| [ **deleted**](#simple-usage)               | (true-false) key on document                                      |
| [ **deletedAt**](#save-time-of-deletion)    | Add key to store time of deletion                                 |
| [ **deletedBy**](#who-has-deleted-the-data) | key to record who deleted document                                |

- Restore deleted documents using **restore** method

| Feature                                                                                | Description                                                        |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [Bulk destroy and restore](#bulk-destroy-and-restore)                                  | Bulk Destroy                                                       |
| [Option to override static methods](#examples-how-to-override-one-or-multiple-methods) | **count, countDocuments, find, findOne, findOneAndUpdate, update** |
| [For overridden methods we have two additional methods](#method-overridden)            | **methodDeleted** and **methodWithDeleted**                        |
| [Disable model validation on destroy](#disable-model-validation-on-destroy)            | Disable Validation                                                 |
| [Option to create index on destroy fields](#create-index-on-fields)                    | **deleted**, **deletedAt**, **deletedBy**                          |

## Installation

Install using [npm](https://npmjs.org)

```
npm install @abslibs/mongoose-plugin
```

## Usage

We can use this plugin with or without options.

### Simple usage

```javascript
var mongoose_plugin = require('@abslibs/mongoose-plugin');

var TestSchema = new Schema({
  name: String
});

TestSchema.plugin(mongoose_plugin);
var Test = mongoose.model('Test', TestSchema);
var test = new Test({ name: 'Test' });
test.save(function() {
  test.destroy(function() {
    // deleted: true
    test.restore(function() {});
    //deleted: false
  });
});

var exampleTestId = mongoose.Types.ObjectId('53da93b16b4a6670076b16bf');

// INFO: Example usage of destroyById static method
Test.destroyById(exampleTestId, function(err, TestDocument) {});
```

### Save time of deletion

```javascript
var mongoose_plugin = require('@abslibs/mongoose-plugin');

var TestSchema = new Schema({
  name: String
});

TestSchema.plugin(mongoose_plugin, { deletedAt: true });

var Test = mongoose.model('Test', TestSchema);

var test = new Test({ name: 'Test' });

test.save(function() {
  // mongodb: { deleted: false, name: 'Test' }

  // note: you should invoke exactly destroy() method instead of standard test.remove()
  test.destroy(function() {
    // mongodb: { deleted: true, name: 'Test', deletedAt: ISODate("2014-08-01T10:34:53.171Z")}

    test.restore(function() {
      // mongodb: { deleted: false, name: 'Test' }
    });
  });
});
```

### Who has deleted the data?

```javascript
var mongoose_plugin = require('@abslibs/mongoose-plugin');

var TestSchema = new Schema({
  name: String
});

TestSchema.plugin(mongoose_plugin, { deletedBy: true });

var Test = mongoose.model('Test', TestSchema);

var test = new Test({ name: 'Test' });

test.save(function() {
  // mongodb: { deleted: false, name: 'Test' }

  var idUser = mongoose.Types.ObjectId('53da93b16b4a6670076b16bf');
  test.destroy(idUser, function() {
    // mongodb: { deleted: true, name: 'Test', deletedBy: ObjectId("53da93b16b4a6670076b16bf")}

    test.restore(function() {
      // mongodb: { deleted: false, name: 'Test' }
    });
  });
});
```

### Bulk destroy and restore

```javascript
var mongoose_plugin  = require('@abslibs/mongoose-plugin');

var TestSchema = new Schema({
    name: String,
    age: Number
});

TestSchema.plugin(mongoose_plugin);

var Test = mongoose.model('Test', TestSchema);

var idUser = mongoose.Types.ObjectId("53da93b16b4a6670076b16bf");

// destroy multiple object, callback
Test.destroy(function (err, result) { ... });
Test.destroy({age:10}, function (err, result) { ... });
Test.destroy({}, idUser, function (err, result) { ... });
Test.destroy({age:10}, idUser, function (err, result) { ... });

// destroy multiple object, promise
Test.destroy().exec(function (err, result) { ... });
Test.destroy({age:10}).exec(function (err, result) { ... });
Test.destroy({}, idUser).exec(function (err, result) { ... });
Test.destroy({age:10}, idUser).exec(function (err, result) { ... });

// Restore multiple object, callback
Test.restore(function (err, result) { ... });
Test.restore({age:10}, function (err, result) { ... });

// Restore multiple object, promise
Test.restore().exec(function (err, result) { ... });
Test.restore({age:10}).exec(function (err, result) { ... });
```

### Method overridden

We have the option to override all standard methods or only specific methods. Overridden methods will exclude deleted documents from results, documents that have `deleted = true`. Every overridden method will have two additional methods, so we will be able to work with deleted documents.

| only not deleted documents | only deleted documents  | all documents               |
| -------------------------- | ----------------------- | --------------------------- |
| count()                    | countDeleted            | countWithDeleted            |
| find()                     | findDeleted             | findWithDeleted             |
| findOne()                  | findOneDeleted          | findOneWithDeleted          |
| findOneAndUpdate()         | findOneAndUpdateDeleted | findOneAndUpdateWithDeleted |
| update()                   | updateDeleted           | updateWithDeleted           |

### Examples how to override one or multiple methods

```javascript
var mongoose_plugin = require('@abslibs/mongoose-plugin');

var TestSchema = new Schema({
  name: String
});

// Override all methods
TestSchema.plugin(mongoose_plugin, { overrideMethods: 'all' });
// or
TestSchema.plugin(mongoose_plugin, { overrideMethods: true });

// Overide only specific methods
TestSchema.plugin(mongoose_plugin, {
  overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update']
});
// or
TestSchema.plugin(mongoose_plugin, {
  overrideMethods: ['count', 'countDocuments', 'find']
});
// or (unrecognized method names will be ignored)
TestSchema.plugin(mongoose_plugin, {
  overrideMethods: ['count', 'find', 'errorXyz']
});

var Test = mongoose.model('Test', TestSchema);

// Example of usage overridden methods

Test.find(function(err, documents) {
  // will return only NOT DELETED documents
});

Test.findDeleted(function(err, documents) {
  // will return only DELETED documents
});

Test.findWithDeleted(function(err, documents) {
  // will return ALL documents
});
```

### Disable model validation on destroy

```javascript
var mongoose_plugin = require('@abslibs/mongoose-plugin');

var TestSchema = new Schema({
  name: { type: String, required: true }
});

// By default, validateBeforeDelete is set to true
TestSchema.plugin(mongoose_plugin);
// the previous line is identical to next line
TestSchema.plugin(mongoose_plugin, { validateBeforeDelete: true });

// To disable model validation on destroy, set validateBeforeDelete option to false
TestSchema.plugin(mongoose_plugin, { validateBeforeDelete: false });

// NOTE: This is based on existing Mongoose validateBeforeSave option
// http://mongoosejs.com/docs/guide.html#validateBeforeSave
```

### Create index on fields

```javascript
var mongoose_plugin = require('@abslibs/mongoose-plugin');

var TestSchema = new Schema({
  name: String
});

// Index all field related to plugin (deleted, deletedAt, deletedBy)
TestSchema.plugin(mongoose_plugin, { indexFields: 'all' });
// or
TestSchema.plugin(mongoose_plugin, { indexFields: true });

// Index only specific fields
TestSchema.plugin(mongoose_plugin, {
  indexFields: ['deleted', 'deletedBy']
});
// or
TestSchema.plugin(mongoose_plugin, { indexFields: ['deletedAt'] });
```
