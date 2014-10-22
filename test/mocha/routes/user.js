'use strict';

/**
 * Module dependencies.
 */
var request = require('supertest'),
		should = require('should'),
		// assert = require('assert'),
		app = require('../../../server'),
		mongoose = require('mongoose'),
		User = mongoose.model('User'),
		_ = require('lodash');


// Globals
var user, req, cookie;

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
	describe('Routes User:', function() {
		describe('/api/users/:userId', function() {
			it('POST - should return \'401\' when trying to change details unauthorized', function(done) {
				request(app)
					.put('/api/users/' + user._id)
					.send({
						'name': 'nacho'
					})
					.expect(401)
					.end(function(err) {
						if (err) {
							return done(err);
						}

						done();
					});
			});

			it('POST - should be able to change user details when authorized', function(done) {
				req = request(app)
					.put('/api/users/' + user._id)
					.set('cookie', cookie)
					.send({
						'name': 'nacho'
					})
					.expect(200)
					.end(function(err) {
						if (err) return done(err);
						done();
					});
			});
		});
		describe('/api/users/me', function() {

			it('GET - should retrieve empty response when not logged in', function(done) {
				req = request(app)
					.get('/api/users/me')
					.set('Accept', 'application/json')
					.expect(200)
					.expect(function(res) {
						// Should return false, otherwise is an error!
						return !_.isEmpty(res.body);
					})
					.end(function(err){
						if (err) return done(err);
						done();
					});
			});

			it('GET - should be able to retrieve user details, when authorized', function(done) {
				req = request(app)
					.get('/api/users/me')
					.set('cookie', cookie)
					.expect(200)
					.expect(function(res) {
						// This time 'true' is expected
						return _.isEmpty(res.body);
					})
					.end(function(err){
						if (err) return done(err);
						done();
					});
			});
		});
		describe('/api/users/:userId/betastatus', function() {
			it('POST - should return \'401\' when trying to retrieve beta status unauthorized', function(done) {
				req = request(app)
					.put('/api/users/' + user._id + '/betastatus')
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
			it('POST - should retrieve beta status', function(done) {
				req = request(app)
					.put('/api/users/' + user._id + '/betastatus')
					.set('cookie', cookie)
					.expect(200)
					.expect(function(res) {
						return _.isEmpty(res.body);
					})
					.end(function(err) {
						if (err) {
							return done(err);
						}
						done();
					});
			});
		});
		describe('/api/content/favourites/add', function() {
			it('POST - should return \'404\' when trying to add a favorite unauthorized', function(done) {
				req = request(app)
					.put('/api/content/favorites/add')
					.expect(404)
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
		describe('/api/content/favourites/remove', function() {
			it('POST - should return \'404\' when trying to remove a favorite unauthorized', function(done) {
				req = request(app)
					.put('/api/content/favorites/remove')
					.expect(404)
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
		describe('/api/users', function() {
			// TODO Check if this is working =
			// it('POST - should be able to create user', function(done) {
			// 	req = request(app)
			// 		.post('/api/users')
			// 		.send({ name: 'new user', email: 'new@octoboxapp.com', password: 'password', passwordConfirmation: 'password' })
			// 		.expect(302)
			// 		.expect(function(res) {
			// 			// No errors
			// 			return !_.isEmpty(res.body);
			// 		})
			// 		.end(function(err) {
			// 			if (err) {
			// 				return done(err);
			// 			}
			// 			done();
			// 		});
			// });
			it('DELETE - should return \'401\' when not remove user when unauthorized', function(done) {
				request(app)
					.del('/api/users')
					.expect(401)
					.end(function(err) {
						if (err) {
							return done(err);
						}
						done();
					});
			});
			it('DELETE - should remove user when authorized', function(done) {
				request(app)
					.del('/api/users')
					.set('cookie', cookie)
					.expect(200)
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
