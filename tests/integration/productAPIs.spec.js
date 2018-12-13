const Product = require('../../models/productModel');
const request = require('supertest');

let server, product;

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

describe('/api/products', () => {
  beforeEach(() => {
    server = require('../../app');
  });
  afterEach(async () => {
    await Product.deleteMany();
    await server.close();
  });

  describe.skip('GET /', () => {
    test('should get all products', async () => {
      await product.save();
      const result = await request(server).get('/api/products');
      expect(result.status).toBe(200);
      expect(result.body.length).toBe(1);
    });
  });

  describe('GET /id', () => {
    const exec = () => {
      return request(server).get('/api/products/' + product._id);
    };
    test('should return 404 if product is not found', async () => {
      const result = await exec();
      expect(result.status).toBe(404);
    });

    test('should return 200 and get one product', async () => {
      await product.save();
      const result = await exec();
      expect(result.status).toBe(200);
    });
  });

});
