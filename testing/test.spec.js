/**
 *  @jest-environment node
 * */

const request = require('supertest');

const Customer = require('../models/customerModel');
let server, customer;

customer = new Customer({
  name: 'ahmed',
  username: 'a7mddz',
  email: 'ahmed1@domain.com',
  phone: '0101030',
  password: 'asdf123',
  accountType: 'Premium',
  address: {
    street: 'fat',
    country: 'Egypt',
    state: 'kaf',
    city: 'foes',
    postalCode: 202232,
    phone: 1234567
  }
});

describe('/api/customers', () => {
  beforeEach(async () => {
    server = require('../app');
    await customer.save()
  });
  afterEach(async () => {
    await server.close();
    await Customer.deleteMany({});
  });

  // POST api/customers
  describe('POST /', () => {
    const exec = () => {
      return request(server)
        .post('/api/customers')
        .send(customer);
    };

    test('should return 400 if user already exist', async () => {
      // await customer.save();
      const result = await exec();
      expect(result.status).toBe(400);
    });

    test('should return 200 and the saved customer', async () => {
      const result = await exec();
      expect(result.status).toBe(200);
    });

    test('should save the customer', async () => {
      await exec();

      const existingCustomer = await Customer.findOne({username: customer.username});
      expect(existingCustomer).not.toBeNull();
    });

    test.skip('should send the saved customer to the client', async () => {
      const res = await exec();
      expect(res.body).toHaveProperty('username');
    });
  });

  // GET api/customers
  describe('GET /', () => {
    const exec = () => {
      return request(server)
        .get('/api/customers')
    };

    test('should get all customers from db', async () => {
      const res = await exec();
      expect(res.body).not.toBeNull();
    });
  });

  // GET api/customers/id
  describe('GET /id', () => {
    const exec = () => {
      return request(server).get('/api/customers' + customer._id);
    };

    test('should return 404 if the customer is not found', async () => {
      const res = await exec();
      expect(res.status).toBe(404);
    });

    test.skip('should get one customer for a specific id', async () => {
      const res = await exec();
      expect(res.body).toHaveProperty('username', customer.username);
    });
  });

  // PUT api/customers/id
  describe('PUT /id', () => {
    const exec = () => {
      return request(server).get('/api/customers' + customer._id);
    };

    test('should return 404 if customer is not found', async () => {
      await Customer.deleteMany({});
      const res = await exec();
      expect(res.status).toBe(404);
    });

    test.skip('should update the customer if it has been found', async () => {
      customer.name = 'new name';
      const res = await exec();
      expect(res.body).toHaveProperty('name', 'new name');
    });
  });

  // PUT api/customers/id
  describe('DELETE /id', () => {
    const exec = () => {
      return request(server).get('/api/customers' + customer._id);
    };

    test('should return 404 if customer is not found', async () => {
      await Customer.deleteMany({});
      const res = await exec();
      expect(res.status).toBe(404);
    });

    test('should delete customer if it has been found', async () => {
      const res = await exec();
      expect(res.body).toBe('removed');
    });
  });
});
