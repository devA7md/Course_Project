const mongoose = require('mongoose');
const Product = require('../../models/productModel');
const Customer = require('../../models/customerModel');
const request = require('supertest');

let server, product, token;

describe('/api/products', () => {
  beforeEach(async () => {
    server = require('../../app');

    product = new Product({
      name: 'samsung galaxy s8',
      price: 859,
      discount: 8,
      productInfo: {
        title: 'new mobile for new generation',
        image: 'http://image.com/image_152',
        description: 'some description for this mobile',
        available: true,
        brand: 'samsung'
      },
      stock: 95
    });

    await product.save();
  });
  afterEach(async () => {
    await Product.deleteMany();
    await server.close();
  });

  describe('GET .../', () => {
    test('should get all products', async () => {
      expect.assertions(1);
      await expect(request(server).get('/api/products')).resolves.toHaveProperty('status', 200);
    });
  });

  describe('GET .../id', () => {
    const doRequest = (url = '/api/products/' + product._id) => {
      return request(server).get(url);
    };

    test('should return 400 if the id is invalid', async () => {
      const result = await doRequest('/api/products/invalidId');

      expect(result.status).toBe(400);
      expect(result.text).toBe('Invalid id');
    }, 30000);

    test('should return 404 if product is not found', async () => {
      await Product.deleteMany();
      const result = await doRequest();

      expect(result.status).toBe(404);
    }, 30000);

    test('should return 200 and get one product', async () => {
      const result = await doRequest();

      expect(result.status).toBe(200);
    }, 30000);

    test('should send the product to client', async () => {
      const result = await doRequest();

      expect(result.body).toHaveProperty('name');
    }, 30000);
  });

  describe('POST .../', () => {
    beforeEach(() => {
      const adminUser = new Customer({isAdmin: true});
      token = adminUser.generateToken();
    });

    const doRequest = ({tok = token, body = product}) => {
      return request(server)
        .post('/api/products')
        .send(body)
        .set('x-auth-token', tok)
    };

    test('should return 401 if the user is not logged in', async () => {
      const result = await doRequest({tok: ''});

      expect(result.status).toBe(401);
      expect(result.text).not.toBeNull();
    }, 30000);

    test('should return 403 if the user is not admin', async () => {
      const result = await doRequest({tok: new Customer().generateToken()});

      expect(result.status).toBe(403);
      expect(result.text).not.toBeNull();
    }, 30000);

    test('should return 400 for invalid data provided', async () => {
      const result = await doRequest({token, body: {}});

      expect(result.status).toBe(400);
      expect(result.text).not.toBeNull();
    }, 30000);

    test('should return 200 and save product', async () => {
      const result = await doRequest({token});

      expect(result.status).toBe(200);
      expect(result.text).not.toBeNull();
    }, 30000);

    test('should return the saved product', async () => {
      const result = await doRequest({token});

      expect(result.body).toHaveProperty('name');
    }, 30000);
  });

  describe('PUT .../update', () => {
    beforeEach(() => {
      const adminUser = new Customer({isAdmin: true});
      token = adminUser.generateToken();
    });

    const doRequest = ({tok = token, body = {}, id = product._id}) => {
      return request(server)
        .put('/api/products/update')
        .query({id: id.toString()})
        .send(body)
        .set('x-auth-token', tok)
    };

    test('should return 401 if the user is not logged in', async () => {
      const result = await doRequest({tok: ''});
      expect(result.status).toBe(401);
    }, 30000);

    test('should return 403 if the user is not admin', async () => {
      const result = await doRequest({tok: new Customer().generateToken()});

      expect(result.status).toBe(403);
      expect(result.text).not.toBeNull();
    }, 30000);

    test('should return 404 if the product is not found', async () => {
      await Product.deleteMany();
      const result = await doRequest({id: mongoose.Types.ObjectId()});

      expect(result.status).toBe(404);
    }, 30000);

    test('should return 200 if the product has been updated', async () => {
      const result = await doRequest({
        body: {
          name: 'new name'
        }
      });

      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty('name', 'new name');
    }, 30000);
  });

  describe('DELETE .../delete', () => {
    beforeEach(() => {
      const adminUser = new Customer({isAdmin: true});
      token = adminUser.generateToken();
    });

    const doRequest = ({tok = token, id = product._id}) => {
      return request(server)
        .delete('/api/products/delete')
        .query({id: id.toString()})
        .set('x-auth-token', tok)
    };

    test('should return 401 if the user is not logged in', async () => {
      const result = await doRequest({tok: ''});
      expect(result.status).toBe(401);
    }, 30000);

    test('should return 403 if the user is not admin', async () => {
      const result = await doRequest({tok: new Customer().generateToken()});

      expect(result.status).toBe(403);
      expect(result.text).not.toBeNull();
    }, 30000);

    test('should return 404 if the product is not found', async () => {
      await Product.deleteMany();
      const result = await doRequest({id: mongoose.Types.ObjectId()});

      expect(result.status).toBe(404);
    }, 30000);

    test('should return 200 if the product has been updated', async () => {
      const result = await doRequest({});

      expect(result.status).toBe(200);
      expect(result.text).toBe('removed');
    }, 30000);
  });
});
