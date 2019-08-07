/*
 * @Author: Arpit Yadav
 * @Date: 2019-07-23 21:04:02
 * @Last Modified by: Arpit Yadav
 * @Last Modified time: 2019-07-28 17:33:20
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
  mongoose.set('debug', true);

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
  let puffy = {};
  before((done) => {
    puffy = new Test0({ name: 'Puffy' });
    puffy.save(() => {
      done();
    });
  });

  it('should create database.', () => {
    // puffy.destroy();
    console.log('================================');
    const a = Test0.find({ _id: '5d3d8d7452180a584bcae113' }, (err, puffy) => {
      console.log(err);
      console.log(puffy);
    });
  });
});
