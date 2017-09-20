/* eslint-disable padded-blocks */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');
const configuration = require('../knexfile')[process.env.NODE_ENV];
const db = require('knex')(configuration);

const should = chai.should(); // eslint-disable-line

chai.use(chaiHttp);

describe('API club routes', () => {
  before((done) => {
    db.migrate.latest()
      .then(() => done())
      .catch(error => console.log(error));
  });

  beforeEach((done) => {
    db.seed.run()
      .then(() => done())
      .catch(error => console.log(error));
  });

  describe('GET /api/v1/club', () => {

    it('should get all of the clubs in the database', (done) => {
      chai.request(server)
        .get('/api/v1/club')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.forEach((club) => {
            club.should.be.a('object');
            club.should.have.property('id');
            club.should.have.property('name');
          });
          done();
        });
    });

    it('should get a single club from the database', (done) => {
      chai.request(server)
        .get('/api/v1/club/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.have.length(1);
          res.body[0].name.should.eql('Club of Books');
          done();
        });
    });

    it('should return an error if no club is found', (done) => {
      const clubId = 3;

      chai.request(server)
        .get(`/api/v1/club/${clubId}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error');
          res.body.error.should.eql(`A book club with the id ${clubId} was not found.`);
          done();
        });
    });

  });

  describe('POST /api/v1/club', () => {

    it('should create a new user club', (done) => {
      chai.request(server)
        .post('/api/v1/club')
        .send({
          id: 3,
          name: 'best book club ever!',
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.name.should.equal('best book club ever!');
          done();
        });
    });

    it('should return an error if missing a required parameter', (done) => {
      chai.request(server)
        .post('/api/v1/club')
        .send({
          name: null,
        })
        .end((err, res) => {
          res.should.have.status(422);
          res.body.error.should.equal('Missing required name parameter');
          done();
        });
    });

  });
});
