process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');

const server = require('../server');
const knex = require('../db/knex');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage', (done) => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.html;
      done();
    });
  });

  it('should return a 404 for a route that does not exist', (done) => {
    chai.request(server)
    .get('/404')
    .end((err, response) => {
      response.should.have.status(404);
      done();
    });
  });
});

describe('API Routes', () => {

  beforeEach((done) => {
    knex.migrate.rollback()
    .then(() => {
      knex.migrate.latest()
      .then(() => {
        knex.seed.run()
        .then(() => {
          done();
        });
      });
    });
  });

  describe('GET /api/v1/folders/', () => {
    it('should return all of the folders', (done) => {
      chai.request(server)
      .get('/api/v1/folders/')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        done();
      });
    });
  });

  describe('GET /api/v1/links/', () => {
    it('should return all of the links', (done) => {
      chai.request(server)
      .get('/api/v1/links/')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(3);
        done();
      });
    });
  });

  describe('GET /api/v1/folders/:id', () => {
    it('should return 1 folder', (done) => {
      chai.request(server)
      .get('/api/v1/folders/1')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        done();
      });
    });

    it('should return no folder', (done) => {
      chai.request(server)
      .get('/api/v1/folders/500')
      .end((err, response) => {
        response.should.have.status(404);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('error');
        response.body.error.should.equal(`Could not find folder with id of 500`);
        done();
      });
    });
  });

  describe('GET /api/v1/folders/:folders_id/links', () => {
    it.skip('should return 2 links ', (done) => {
      chai.request(server)
      .get('/api/v1/folders/1/links')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        done();
      });
    });

    it('should return no links ', (done) => {
      chai.request(server)
      .get('/api/v1/folders/500/links')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('note');
        response.body.note.should.equal('No links exist');
        done();
      });
    });
  });

  describe('GET /click/:short_url', () => {
    it('should return a link ', (done) => {
      chai.request(server)
      .get('/click/google')
      .end((err, response) => {
        response.should.have.status(200);
        response.redirects.should.be.a('array');
        response.redirects.length.should.equal(1);
        response.redirects.should.deep.equal(['https://www.google.com/']);
        done();
      });
    });

    it('should not return a link ', (done) => {
      chai.request(server)
      .get('/click/keji')
      .end((err, response) => {
        response.should.have.status(404);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('error');
        response.body.error.should.equal('Nothing at keji');
        done();
      });
    });
  });

  describe('POST /api/v1/folders', () => {
    it('should create a new folder', (done) => {
      chai.request(server)
      .post('/api/v1/folders')
      .send({
        name: 'google',
      })
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(3);
        chai.request(server)
        .get('/api/v1/folders/')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          done();
        });
      });
    });

    it('should not create a new folder', (done) => {
      chai.request(server)
      .post('/api/v1/folders')
      .send({
        name: '',
      })
      .end((err, response) => {
        response.should.have.status(422);
        response.body.should.be.a('object');
        response.body.should.have.property('error');
        response.body.error.should.equal(`Expected format: { name: <string> }. You are missing a name property`);
        chai.request(server)
        .get('/api/v1/folders/')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          done();
        });
      });
    });
  });

  describe('POST /api/v1/links', () => {
    it('should create a new link', (done) => {
      chai.request(server)
      .post('/api/v1/links')
      .send({
        title: 'turing',
        long_url: 'https://www.turing.io', short_url:'turing',
        folders_id: 2
      })
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(4);
        chai.request(server)
        .get('/api/v1/links/')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(4);
          done();
        });
      });
    });
    it('should not create a new link', (done) => {
      chai.request(server)
      .post('/api/v1/links')
      .send({
        title: 'turing',
        long_url: 'https://www.turing.io', short_url:'turing',
      })
      .end((err, response) => {
        response.should.have.status(422);
        response.body.should.be.a('object');
        response.body.should.have.property('error');
        response.body.error.should.equal(`Expected format: { title: <string>, long_url: <string>, short_url: <string>, folders_id: <integer> }. You are missing a folders_id property`);
        chai.request(server)
        .get('/api/v1/links/')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          done();
        });
      });
    });

  });
});
