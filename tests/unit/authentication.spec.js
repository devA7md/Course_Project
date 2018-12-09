const auth = require('../../middlwares/authentication');
const Customer = require('../../models/customerModel');

describe('authorization', () => {
  let req, res, token, next;

  token = new Customer().generateToken();
  req = {
    header: jest.fn().mockReturnValue(token)
  };
  res = {};
  next = jest.fn();

  test('should set user to req object', () => {
    auth.loggedIn(req, res, next);
    expect(req['user']).toBeDefined();
  });
});
