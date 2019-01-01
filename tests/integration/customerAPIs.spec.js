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

  // POST api/customers
  describe('POST /signup', () => {
    const exec = () => {
      return request(server)
        .post('/api/customers/signup')
        .send(customer);
    };

    test('should return 400 if invalid data are passed', async () => {
      try {
        const result = await request(server)
          .post('/api/customers/signup')
          .send({});
        expect(result.status).toBe(400);
      } catch (e) {
        console.log(e.message);
      }
    });

    test('should return 400 if user already exist', async () => {
      await customer.save();
      const result = await exec();
      expect(result.status).toBe(400);
    });

    test('should return 200 when saved', async () => {
      const result = await exec();
      expect(result.status).toBe(200);
    });

    test('should save the customer in db', async () => {
      await exec();

      const existingCustomer = await Customer.findOne({username: customer.username});
      expect(existingCustomer).not.toBeNull();
    });

    test('should send the saved customer to the client', async () => {
      const res = await exec();
      expect(res.header).toHaveProperty('x-auth-token');
      expect(res.body).toHaveProperty('token');
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
      return request(server)
        .get('/api/customers/' + customer._id)
        .set('x-auth-token', token)
    };

    test('should return 401 if the customer is not logged in', async () => {
      const res = await request(server)
        .get('/api/customers/' + customer._id);
      expect(res.status).toBe(401);
    });

    test('should return 404 if the customer is not found', async () => {
      const res = await exec();
      expect(res.status).toBe(404);
    });

    test('should get one customer for a specific id', async () => {
      await customer.save();
      const res = await exec();
      expect(res.body).toHaveProperty('username');
    });
  });

  // PUT api/customers/update
  describe('PUT /update', () => {
    const exec = () => {
      return request(server)
        .put('/api/customers/update')
        .set('x-auth-token', token)
        .send({name: 'new name'});
    };

    test('should return 401 if customer is not logged in', async () => {
      const res = await request(server)
        .put('/api/customers/update')
        .send({});
      expect(res.status).toBe(401);
    });

    test('should return 404 if customer is not found', async () => {
      await Customer.deleteMany({});
      const res = await exec();
      expect(res.status).toBe(404);
    });

    test('should save the updated customer', async () => {
      await customer.save();
      await exec();
      const updatedCustomer = await Customer.findById(customer._id);
      expect(updatedCustomer).toHaveProperty('name', 'new name');
    });

    test('should return the updated customer', async () => {
      await customer.save();
      const res = await exec();
      expect(res.body).toHaveProperty('name', 'new name');
    });
  });

  // PUT api/customers/delete
  describe('DELETE /delete', () => {
    const exec = () => {
      return request(server)
        .delete('/api/customers/delete')
        .set('x-auth-token', token);
    };

    test('should return 401 if customer is not logged in', async () => {
      const res = await request(server)
        .delete('/api/customers/delete');
      expect(res.status).toBe(401);
    });

    test('should return 403 if account type is Standard', async () => {
      customer.accountType = 'Standard';
      token = customer.generateToken();
      const res = await request(server)
        .delete('/api/customers/delete')
        .set('x-auth-token', token);
      expect(res.status).toBe(403);
    });

    test('should return 404 if customer is not found', async () => {
      const res = await exec();
      expect(res.status).toBe(404);
    });

    test('should delete customer if it has been found', async () => {
      // await customer.save();
      await exec();
      const deletedCustomer = await Customer.findById(customer._id);
      expect(deletedCustomer).toBeNull();
    });

    test('should return 200 and send "deleted"', async () => {
      await customer.save();
      const res = await exec();
      expect(res.body).toHaveProperty('message', 'deleted');
    });
  });
});
