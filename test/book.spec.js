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
        .get('/api/v1/book?club_id=1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(2);
          res.body.forEach((book) => {
            book.should.have.property('id');
            book.should.have.property('title');
            book.should.have.property('author');
            book.should.have.property('goodreads_id');
            book.should.have.property('avg_rating');
            book.should.have.property('ratings_count');
            book.should.have.property('image');
            book.should.have.property('upvotes');
            book.should.have.property('downvotes');
            book.should.have.property('status');
            book.should.have.property('user_id');
            book.should.have.property('club_id');
            book.should.have.property('created_at');
            book.should.have.property('updated_at');
          });
          res.body[0].id.should.equal(1);
          res.body[0].title.should.equal('Fantasy Book');
          res.body[0].author.should.equal('George R.R. Martin');
          res.body[0].goodreads_id.should.equal('12345');
          res.body[0].avg_rating.should.equal('3.86');
          res.body[0].ratings_count.should.equal('1000');
          res.body[0].image.should.equal('https://images.gr-assets.com/books/1436732693l/13496.jpg');
          res.body[0].upvotes.should.equal(1);
          res.body[0].downvotes.should.equal(1);
          res.body[0].status.should.equal('suggested');
          res.body[0].user_id.should.equal(1);
          res.body[0].club_id.should.equal(1);
          done();
        });
    });
  });

  describe('POST /api/v1/book', () => {
    it('should add and return a new book', (done) => {
      chai.request(server)
        .post('/api/v1/book')
        .send({
          id: 4,
          title: 'All The Things Again',
          author: 'Fancy',
          goodreads_id: 23456,
          avg_rating: 1.11,
          ratings_count: 2000,
          image: 'http://image.com',
          user_id: 2,
          club_id: 1,
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('title');
          res.body.should.have.property('author');
          res.body.should.have.property('goodreads_id');
          res.body.should.have.property('avg_rating');
          res.body.should.have.property('ratings_count');
          res.body.should.have.property('image');
          res.body.should.have.property('upvotes');
          res.body.should.have.property('downvotes');
          res.body.should.have.property('status');
          res.body.should.have.property('user_id');
          res.body.should.have.property('club_id');
          res.body.should.have.property('created_at');
          res.body.should.have.property('updated_at');
          res.body.id.should.equal(4);
          res.body.title.should.equal('All The Things Again');
          res.body.author.should.equal('Fancy');
          res.body.goodreads_id.should.equal('23456');
          res.body.avg_rating.should.equal('1.11');
          res.body.ratings_count.should.equal('2000');
          res.body.image.should.equal('http://image.com');
          res.body.upvotes.should.equal(0);
          res.body.downvotes.should.equal(0);
          res.body.status.should.equal('suggested');
          res.body.user_id.should.equal(2);
          res.body.club_id.should.equal(1);
          done();
        });
    });

    it('should return an error if missing parameters', (done) => {
      chai.request(server)
        .post('/api/v1/book')
        .send({
          id: 3,
          title: 'All The Things Again',
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
          id: 5,
          title: 'All The Things Again',
          author: 'Fancy',
          goodreads_id: 23456,
          image: 'http://image.com',
          user_id: 6,
          club_id: 1,
          avg_rating: 1.11,
          ratings_count: 2000,
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.code.should.equal('23503');
          res.body.error.detail.should.equal('Key (user_id)=(6) is not present in table "user".');
          done();
        });
    });
  });

  describe('PATCH /api/v1/book', () => {
    it('should increment the up votes column', (done) => {
      chai.request(server)
        .patch('/api/v1/book?id=1')
        .send({
          direction: 'up',
        })
        .end((err, res) => {
          res.should.have.status(204);
          res.body.should.deep.equal({});
          done();
        });
    });
    it('should have a server error if update fails', (done) => {
      chai.request(server)
        .patch('/api/v1/book?id=1')
        .send({
          direction: '',
        })
        .end((err, res) => {
          res.status.should.equal(500);
          done();
        });
    });
    it('should change the books status', (done) => {
      chai.request(server)
        .patch('/api/v1/book?id=1')
        .send({
          newStatus: 'suggested',
        })
        .end((err, res) => {
          res.should.have.status(204);
          res.body.should.deep.equal({});
          done();
        });
    });
    it('should have a server error if update fails', (done) => {
      chai.request(server)
        .patch('/api/v1/book?id=1')
        .send({
          status: '',
        })
        .end((err, res) => {
          res.status.should.equal(500);
          done();
        });
    });

    it('should increment the down votes column', (done) => {
      chai.request(server)
        .patch('/api/v1/book?id=1')
        .send({
          direction: 'down',
        })
        .end((err, res) => {
          res.should.have.status(204);
          res.body.should.deep.equal({});
          done();
        });
    });

    it('should return an error if foreign key is not found', (done) => {
      chai.request(server)
        .patch('/api/v1/book?id=1000')
        .send({
          direction: 'down',
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.equal('Update failed, check request body');
          done();
        });
    });
  });
});
