# Mongoose Plugin

@abslibs/mongoose-plugin is simple and lightweight plugin that enables some basic required functionality for mongoose.

This code has some features from [dsanel's](https://github.com/dsanel) plugin [mongoose-delete](https://github.com/dsanel/mongoose-delete).

## Features

- Soft Delete document using **destroy** method.

| Methods and Fields                          | Description                                                       |
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
| [Disable model validation on destroy](#disable-model-validation-on-destroy)            | Disable Validation                                                 |
| [Option to create index on destroy fields](#create-index-on-fields)                    | **deleted**, **deletedAt**, **deletedBy**                          |

## Installation

Install using [npm](https://npmjs.org)

```
npm install @abslibs/mongoose-plugin
```

## Usage

We can use this plugin with or without options.

### Setup

```javascript
const mongoose_plugin = require('@abslibs/mongoose-plugin');

const TestSchema = new Schema({
  name: String
});

// Apply on specific model.
// Can apply globally : eg: mongoose.plugin(mongoose_plugin, {})
TestSchema.plugin(mongoose_plugin, {
  paranoid: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

const Test = mongoose.model('Test', TestSchema);
```

### Options

**paranoid** : it needs to be true for soft deletion.

**timestamps** : it will add [createdAt & updatedAt] in schema.

**createdAt** : can replace createdAt by given string. eg: _createdAt: 'created_at'_

**updatedAt** : can replace updatedAt by given string. eg: _updatedAt: 'created_at'_

### Simple usage

```javascript
const test = new Test({ name: 'Test' });
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

### Get sot soft deleted data.

```javascript
// pass *{ paranoid: false }* as option.
// This will return response including deleted documents.
test.find({ name: 'Arpit' }, null, { paranoid: false }, (err, user) => {});
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
    test.restore(function() {});
  });
});
```

### Bulk destroy and restore

```javascript

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

### Create index on fields

```javascript
TestSchema.plugin(mongoose_plugin, { indexFields: true });

// Index only specific fields
TestSchema.plugin(mongoose_plugin, {
  indexFields: ['deleted', 'deletedBy']
});
// or
TestSchema.plugin(mongoose_plugin, { indexFields: ['deletedAt'] });
```

### Method overridden

We have the option to override all standard methods or only specific methods. Overridden methods will exclude deleted documents from results, documents that have `deleted = true`. Every overridden method will have two additional methods, so we will be able to work with deleted documents.
**NOTE :** Method will be overridden if **paranoid is true**

| only not deleted documents |
| -------------------------- |
| count()                    |
| find()                     |
| findOne()                  |
| findOneAndUpdate()         |
| update()                   |
