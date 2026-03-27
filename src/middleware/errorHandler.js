/**
 * Global error handling middleware for Express.
 */
function errorHandler(err, req, res, next) {
  const logger = req.log || console;

  logger.error({
    msg: 'Unhandled error',
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    url: req.url,
    method: req.method,
  });

  const statusCode = err.status || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;

  res.status(statusCode).json({
    status: false,
    message: 'Error',
    meta: message,
  });
}

module.exports = errorHandler;
