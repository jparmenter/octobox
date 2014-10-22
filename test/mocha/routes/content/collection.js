'use strict';

/**
 * Module dependencies.
 */
var request = require('supertest'),
    should = require('should'),
    // assert = require('assert'),
    app = require('../../../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Collection = mongoose.model('Collection'),
    _ = require('lodash');


// Globals
var user, req, cookie, collection;

// Tests
describe('<Unit Test>', function() {
  before(function(done) {
    user = new User({
      name: 'Full name',
      email: 'test@octoboxapp.com',
      password: 'password',
      passwordConfirmation: 'password'
    });

    // Store user to log in later
    user.save(done);

    collection = new Collection({

    })
  });
  describe('Authorize User;', function() {
    it('should be able to log user in', function(done) {
      request(app)
      .post('/api/users/session')
      .send({ email: 'testcollection@octoboxapp.com', password:'password' })
      .end(function(err,res){
        cookie = res.headers['set-cookie'];
        done();
      });
    });
  });
  describe('Routes Collection:', function() {
    // describe('/api/content/collection', function() {
    //   it('GET - should return \'404\' when trying to find collection unauthorized', function(done) {
    //     request(app)
    //       .get('/api/content/collection')
    //       .expect(200)
    //       .expect(function(res) {
    //         should(res.body).equal('No collections exist or user is not authorized.');
    //       })
    //       .end(function(err) {
    //         if (err) {
    //           return done(err);
    //         }
    //         done();
    //       });
    //   });
    // });
    describe('/api/content/collection/:collection', function() {
      it('show - should return \'404\' when trying to find collection unauthorized', function(done) {
        req = request(app)
          .get('/api/content/collection/1')
          .expect(404)
          .expect(function(res) {
            should(res.body).equal('Collection could not be found or user is not authorized.');
          })
          .end(function(err) {
            if (err) {
              return done(err);
            }
            done();
          });
      });
    });
    after(function(done) {
      User.remove().exec();
      done();
    });
  });
});
