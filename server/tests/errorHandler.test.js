const { errorHandler } = require('../src/middleware/errorHandler');

describe('Error Handler Middleware', () => {
  it('should return 500 and hide message in production', () => {
    const err = new Error('Secret DB Error');
    const req = { id: 'request-1' };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const next = vi.fn();

    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
      requestId: 'request-1',
    });

    process.env.NODE_ENV = originalEnv;
  });

  it('should return err.statusCode and expose message if not 500', () => {
    const err = new Error('Bad Request');
    err.statusCode = 400;
    const req = { id: 'request-2' };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const next = vi.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Bad Request' }));
  });
});
