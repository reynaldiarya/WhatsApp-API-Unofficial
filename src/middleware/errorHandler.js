function errorHandler(err, req, res, next) {
  const logger = req.log || console;
  logger.error({
    msg: 'API Error',
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });

  res.status(err.status || 500).json({
    status: false,
    message: 'Error',
    meta: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
}

module.exports = errorHandler;
