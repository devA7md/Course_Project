const request = require('supertest');

const Customer = require('../../models/customerModel');
let server, customer, token;

describe('/api/customers', () => {

  beforeEach(async () => {
    server = require('../../app');

    customer = new Customer({
      name: 'ahmed',
      username: 'ahmed_a7m',
      email: 'ahmed1@domain.com',
      phone: 123456,
      password: 'ahmed123',
      accountType: 'Premium',
      address: {
        country: 'Egypt'
      }
    });
    token = customer.generateToken();
  });

  afterEach(async () => {
    await Customer.deleteMany();
    await server.close();
  });

  afterAll(() => {
    process.exit();
  });

  // POST api/customers
  describe('POST /signup', () => {
    const exec = () => {
      return request(server)
        .post('/api/customers/signup')
        .send(customer);
    };

    test('should return 400 if invalid data are passed', async () => {
      const result = await request(server)
        .post('/api/customers/signup')
        .send({});
      expect(result.status).toBe(400);
    });

    test('should return 400 if user already exist', async () => {
      await customer.save();
      const result = await exec();
      expect(result.status).toBe(400);
    });
  });

});
