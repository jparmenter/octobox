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
      email: 'testinbox@octoboxapp.com',
      password: 'password',
      passwordConfirmation: 'password'
    });

    // Store user to log in later
    user.save(done);
  });
  describe('Authorize User;', function() {
    it('should be able to log user in', function(done) {
      request(app)
      .post('/api/users/session')
      .send({ email: 'test@octoboxapp.com', password:'password' })
      .end(function(err,res){
        cookie = res.headers['set-cookie'];
        done();
      });
    });
  });
  describe('Routes Inbox:', function() {
    describe('/api/content/inbox', function() {
      it('GET - should return \'401\' when trying to access unauthorized', function(done) {
        request(app)
          .get('/api/content/inbox')
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
    describe('/api/content/inbox/files', function() {
      it('GET - should return \'401\' when trying to access unauthorized', function(done) {
        request(app)
          .get('/api/content/inbox/files')
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
