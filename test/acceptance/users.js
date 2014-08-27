/* global describe, before, beforeEach, it */

'use strict';

process.env.DB   = 'template-test';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'),
    cookie  = null,
    request = require('supertest');

describe('users', function(){
  this.timeout(10000);
  before(function(done){
    request(app).get('/').end(done);
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      request(app)
      .post('/login')
      .send('email=bob@aol.com')
      .send('password=1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'][0];
        done();
      });
    });
  });

  describe('get /profile/edit', function(){
    it('should show the edit profile page', function(done){
      request(app)
      .get('/profile/edit')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Email');
        expect(res.text).to.include('Phone');
        done();
      });
    });
  });
  describe('put /profile', function(){
    it('should the edit profile page', function(done){
      request(app)
      .get('/profile')
      .set('cookie', cookie)
      .send('_method=put&email=bob%40aol.com&phone=1234567891&photo=&tagline=asas&facebook=me&twitter=me')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });
  describe('get /users', function(){
    it('should show all users', function(done){
      request(app)
      .get('/users')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('bob');
        expect(res.text).to.not.include('Sue');
        done();
      });
    });
  });

  describe('post /message/3', function(){
    it('should the edit profile page', function(done){
      request(app)
      .post('/messages/000000000000000000000001')
      .set('cookie', cookie)
      .end(function(err, res){
      .send('mtype=text&message=hi')
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/users/bob@aol.com');
        done();
      });
    });
  });
});

