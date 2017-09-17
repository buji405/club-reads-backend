const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server.js');
const configuration = require('../knexfile')[process.env.NODE_ENV];
const db = require('knex')(configuration);

chai.use(chaiHttp);

describe('API vote routes', () => {
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

  describe('POST /api/v1/vote', () => {
    it('should create a new user vote', (done) => {
      chai.request(server)
        .post('/api/v1/vote')
        .send({
          id: 6,
          direction: 'up',
          user_id: 4,
          book_id: 1,
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.id.should.equal(6);
          res.body.should.have.property('direction');
          res.body.direction.should.equal('up');
          res.body.should.have.property('user_id');
          res.body.user_id.should.equal(4);
          res.body.should.have.property('book_id');
          res.body.book_id.should.equal(1);
          done();
        });
    });
    it('should return an error if required info Missing', (done) => {
      chai.request(server)
        .post('/api/v1/vote')
        .send({
          id: 6,
          user_id: 4,
          book_id: 1,
        })
        .end((err, res) => {
          res.should.have.status(422);
          res.body.error.should.equal('Missing required direction parameter');
          done();
        });
    });
  });

  describe('DELETE /api/v1/vote/3', () => {
    it('should delete a vote', (done) => {
      chai.request(server)
        .delete('/api/v1/vote/3')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.vote[0].should.have.property('id');
          res.body.vote[0].id.should.equal(3);
          res.body.vote[0].should.have.property('direction');
          res.body.vote[0].direction.should.equal('down');
          res.body.vote[0].should.have.property('user_id');
          res.body.vote[0].user_id.should.equal(1);
          res.body.vote[0].should.have.property('book_id');
          res.body.vote[0].book_id.should.equal(2);
          done();
        });
    });
    it('should return an error if vote does not exist', (done) => {
      chai.request(server)
        .delete('/api/v1/vote/11')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error');
          res.body.error.should.equal('No vote data exists for that id');
          done();
        });
    });
  });

  describe('PATCH /api/v1/vote/:id', () => {
    it('user should be able to edit a vote', (done) => {
      chai.request(server)
        .patch('/api/v1/vote/2')
        .send({
          direction: 'down',
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.vote[0].should.have.property('id');
          res.body.vote[0].id.should.equal(2);
          res.body.vote[0].should.have.property('direction');
          res.body.vote[0].direction.should.equal('down');
          done();
        });
    });
    it('should throw an error if invalid paramaters are given', (done) => {
      chai.request(server)
        .patch('/api/v1/vote/18')
        .send({
          direction: 'up',
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error');
          res.body.error.should.equal('No vote data exists for that id');
          done();
        });
    });
  });
});

