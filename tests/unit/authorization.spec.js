const auth = require('../../middlwares/authorization');

describe('authorization', () => {
  let req, res;
  beforeEach(() => {
    req = {
      user: {
        type: 'Standard',
        admin: false
      }
    };
    res = {
      status(status) {
        this.status = status;
        return this
      },
      send(message) {
        this.message = message;
        return this
      }
    };
  });

  test('should return 403 if the account type is Standard', () => {
    const result = auth.isPremium(req, res);
    expect(result.status).toBe(403);
    expect(result.message).toBe(res.message);
  });

  test('should return 403 if the the user is not admin', () => {
    const result = auth.isAdmin(req, res);
    expect(result.status).toBe(403);
    expect(result.message).toBe(res.message);
  });
});
