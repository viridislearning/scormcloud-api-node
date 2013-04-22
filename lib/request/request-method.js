var queryString = require('querystring');
var _ = require('underscore');

var common = require('../common');
var requestSigner = require('./request-signer');

/**
 * @constructor
 * @param {!Configuration} configuration Instance need
 * @param {Object=} parameters  Optional parameters to initialize the object with.
 */
function RequestMethod(configuration, parameters) {

  this.configuration_ = configuration;

  this.parameters_ = {};

  if(_.isObject(parameters)) {
    this.setParameters(parameters);
  }

  _.bindAll(this);

  var public_ = {
    setParameters: this.setParameters,
    addParameters: this.addParameters,
    clearParameters: this.clearParameters,
    getMethod: this.getMethod
  }

  return public_;
}

/**
 * Sets method parameters. Destructive replace.
 * 
 * @param {!Object} parameters
 */
RequestMethod.prototype.setParameters = function(parameters) {
  if(_.isObject(parameters)) {
    this.parameters_ = _.extend({}, parameters);
  }
}

/**
 * Appends parameters.
 * 
 * @param {!Object} parameters
 */
RequestMethod.prototype.addParameters = function(parameters) {
  if(_.isObject(parameters)) {
    _.extend(this.parameters_, parameters);
  }
}

/**
 * Removes all parameters.
 */
RequestMethod.prototype.clearParameters = function() {
  this.parameters_ = {};
}

/**
 * Returns a signed compiled string describing a service method.
 * 
 * @return {!String}
 */
RequestMethod.prototype.getMethod = function() {
  var self = this;
  var parameters = Object.sortByKeys(_.clone(this.parameters_));
  var filtered = {};

  _.each(parameters, function(value,key){
    if(value) {
      filtered[key] = value;
    }
  })

  _.extend(filtered, {
    sig: requestSigner.generateSignature(self.configuration_.getSecurityKey(), filtered)
  });

  return queryString.stringify(filtered);
}

module.exports = RequestMethod;