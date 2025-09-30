// create standardized error helpers
function httpError(status, message, details) {
  const err = new Error(message || 'error');
  err.status = status;
  if (details) err.details = details;
  return err;
}

module.exports = { httpError };
