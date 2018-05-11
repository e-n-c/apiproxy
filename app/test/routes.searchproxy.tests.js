process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../app.js')

describe('GET /api/v1/searchproxy?q=acrobats', () => {
    it('should respond with title and link', (done) => {
      chai.request(server)
      .get('/api/v1/searchproxy?q=acrobats')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the content should have title and link
        res.body.should.include.keys(
          'title', 'link'
        );
        done();
      });
    });

    it('when called without query parameter it should respond with 400 containing message', (done) => {
      chai.request(server)
      .get('/api/v1/searchproxy')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        res.status.should.equal(400);
        res.body.should.include.keys(
          'message'
        );
        done();
      });
    });

    it('when not configured with google key details it should respond with 500 containing message', (done) => {
      var remember_api_key = process.env.google_api_key;
      process.env.google_api_key = 'invalid key';
      chai.request(server)
      .get('/api/v1/searchproxy?q=acrobats')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // the content should have title and link
        res.status.should.equal(500);
        res.body.should.include.keys(
          'message', 'errors', 'query_status'
        );
        process.env.google_api_key = remember_api_key;
        done();
      });
    });

    it('when not configured with google CSE details it should respond with 500 containing message', (done) => {
      var remember_cse_id = process.env.google_cse_id;
      process.env.google_cse_id = 'invalid id';
      chai.request(server)
      .get('/api/v1/searchproxy?q=acrobats')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // the content should have title and link
        res.status.should.equal(500);
        res.body.should.include.keys(
          'message', 'errors', 'query_status'
        );
        process.env.google_cse_id = remember_cse_id;
        done();
      });
    });
  });

describe('GET /api/v1/unknownotherroute?x=y', () => {
    it('should respond with 404 containing message', (done) => {
      chai.request(server)
      .get('/api/v1/unknownotherroute?x=y')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(404);
        done();
      });
    });
  });