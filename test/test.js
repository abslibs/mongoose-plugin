/*
 * @Author: Arpit Yadav
 * @Date: 2019-07-23 21:04:02
 * @Last Modified by: Arpit Yadav
 * @Last Modified time: 2019-07-23 22:31:15
 */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
// const should = require('chai').should();
// const { expect } = require('chai');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const mongoose_delete = require('../');

before((done) => {
  mongoose.connect(process.env.MONGOOSE_TEST_URI || 'mongodb://localhost/mongoose_plugin', { useNewUrlParser: true });
  done();
});

after((done) => {
  mongoose.disconnect();
  done();
});


describe('mongoose_delete delete method without callback function', () => {
  const Test1Schema = new Schema({ name: String });
  Test1Schema.plugin(mongoose_delete, {
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  const Test0 = mongoose.model('Test0', Test1Schema);

  before((done) => {
    const puffy = new Test0({ name: 'Puffy' });

    puffy.save(() => {
      done();
    });
  });

  it('should create database.', () => {

  });
});
