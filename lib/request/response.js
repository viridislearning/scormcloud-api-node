var _ = require('underscore');

/**
 * @constructor
 * @param {!Object} obj 
 */
function Response(obj) {
  this.error_ = obj.error || Response.default.error;

  this.status_ = obj.status || Response.default.status;

  this.data_ = !_.isUndefined(obj.data) ? obj.data : Response.default.data;

  _.bindAll(this);

  var public_ = {
    getError: this.getError,
    getStatus: this.getStatus,
    getData: this.getData,
    isOk: this.isOk
  }

  return public_;
}

/**
 * Returns any errors in responses
 * 
 * @return {!String}
 */
Response.prototype.getError = function() {
  return this.error_;
}

/**
 * Returns the current status of instance.
 * 
 * @return {!String}
 */
Response.prototype.getStatus = function() {
  return this.status_;
}

/**
 * Get any data blobs.
 * 
 * @return {!*}
 */
Response.prototype.getData = function() {
  return this.data_;
}

/**
 * Checks current status of response.
 * 
 * @return {!Boolean} True if status is OK, false otherwise.
 */
Response.prototype.isOk = function() {
  return this.status_ == Response.status.OK;
}

Response.status = {
  OK: 'OK',
  FAILED: 'FAILED'
}

Response.default = {
  error: "",
  status: Response.status.OK,
  data: {}
}

module.exports = Response;