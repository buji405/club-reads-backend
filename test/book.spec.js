const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');
const configuration = require('../knexfile')[process.env.NODE_ENV];
const db = require('knex')(configuration);

const should = chai.should();

chai.use(chaiHttp);

describe('API book routes', () => {
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

  describe('GET /api/v1/book', () => {
    it('should return all books', (done) => {
      chai.request(server)
        .get('/api/v1/book')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(2);
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('title');
          res.body[0].should.have.property('author');
          res.body[0].should.have.property('ISBN');
          res.body[0].should.have.property('description');
          res.body[0].should.have.property('image');
          res.body[0].should.have.property('upvotes');
          res.body[0].should.have.property('downvotes');
          res.body[0].should.have.property('status');
          res.body[0].should.have.property('user_id');
          res.body[0].should.have.property('created_at');
          res.body[0].should.have.property('updated_at');
          res.body[0].id.should.equal(1);
          res.body[0].title.should.equal('Fantasy Book');
          res.body[0].author.should.equal('Weird Guy');
          res.body[0].ISBN.should.equal('12345');
          res.body[0].description.should.equal('It\'s an ok book');
          res.body[0].image.should.equal('http://image.com');
          res.body[0].upvotes.should.equal(5);
          res.body[0].downvotes.should.equal(2);
          res.body[0].status.should.equal('reading');
          res.body[0].user_id.should.equal(1);
          done();
        });
    });
  });

  describe('POST /api/v1/book', () => {
    it('should add and return a new book', (done) => {
      chai.request(server)
        .post('/api/v1/book')
        .send({
          id: 3,
          title: 'All The Things Again',
          author: 'Fancy',
          ISBN: 23456,
          description: 'It\'s about that one thing',
          image: 'http://image.com',
          upvotes: 2,
          downvotes: 50,
          status: 'suggested',
          user_id: 1,
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('title');
          res.body.should.have.property('author');
          res.body.should.have.property('ISBN');
          res.body.should.have.property('description');
          res.body.should.have.property('image');
          res.body.should.have.property('upvotes');
          res.body.should.have.property('downvotes');
          res.body.should.have.property('status');
          res.body.should.have.property('user_id');
          res.body.should.have.property('created_at');
          res.body.should.have.property('updated_at');
          res.body.id.should.equal(3);
          res.body.title.should.equal('All The Things Again');
          res.body.author.should.equal('Fancy');
          res.body.ISBN.should.equal('23456');
          res.body.description.should.equal('It\'s about that one thing');
          res.body.image.should.equal('http://image.com');
          res.body.upvotes.should.equal(2);
          res.body.downvotes.should.equal(50);
          res.body.status.should.equal('suggested');
          res.body.user_id.should.equal(1);
          done();
        });
    });

    it('should return an error if missing parameters', (done) => {
      chai.request(server)
        .post('/api/v1/book')
        .send({
          id: 3,
          title: 'All The Things Again',
          upvotes: 2,
          downvotes: 50,
          status: 'suggested',
          user_id: 1,
        })
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.equal('Missing required author parameter');
          done();
        });
    });

    it('should return an error if foreign key is not found', (done) => {
      chai.request(server)
        .post('/api/v1/book')
        .send({
          id: 3,
          title: 'All The Things Again',
          author: 'Fancy',
          ISBN: 23456,
          description: 'It\'s about that one thing',
          image: 'http://image.com',
          upvotes: 2,
          downvotes: 50,
          status: 'suggested',
          user_id: 3,
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.code.should.equal('23503');
          res.body.error.detail.should.equal('Key (user_id)=(3) is not present in table "user".');
          done();
        });
    });
  });
});
