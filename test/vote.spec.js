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
          id: 3,
          direction: 'up',
          user_id: 1,
          book_id: 1,
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.id.should.equal(3);
          res.body.should.have.property('direction');
          res.body.direction.should.equal('up');
          res.body.should.have.property('user_id');
          res.body.user_id.should.equal(1);
          res.body.should.have.property('book_id');
          res.body.book_id.should.equal(1);
          done();
        })
    })
  })
})
