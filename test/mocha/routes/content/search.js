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
  // before(function(done) {
  //   user = new User({
  //     name: 'Full name',
  //     email: 'testsearch@octoboxapp.com',
  //     password: 'password',
  //     passwordConfirmation: 'password'
  //   });
  //
  //   // Store user to log in later
  //   user.save(done);
  // });
  describe('Routes Search:', function() {
    describe('/api/content/search', function() {
      it('GET - should return \'401\' when trying to access search unauthorized', function(done) {
        request(app)
          .get('/api/content/search')
          .expect(401)
          .expect(function(res) {
            return !_.isEmpty(res.body);
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
