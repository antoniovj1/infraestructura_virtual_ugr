const config = require('../../config');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const User = require('../../backend/models/user');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { token } = config;

jest.setTimeout(30000);

describe('Users (/api/users/)', () => {
  let server;
  const user = new User({ auth0id: 'ex', name: 'Antonio' });

  beforeAll(async () => {
    server = require('../../server');
    await User.remove({});
    await user.save();
  });

  afterAll(async () => {
    try {
      await User.remove({});
      await mongoose.disconnect();
      await server.shutdown();
    } catch (error) {
      console.log(` ${error} `);
      throw error;
    }
  });

  describe('/GET', () => {
    test('GET all the users', done => {
      chai
        .request(server)
        .get('/api/users')
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body).toHaveLength(1);
          done();
        });
    });

    test('GET user by ID', done => {
      chai
        .request(server)
        .get('/api/user/ex')
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('name', 'Antonio');
          done();
        });
    });
  });
});
