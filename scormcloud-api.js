var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var Configuration = require('./lib/configuration');

/**
 * @constructor
 * 
 * @param {!Configuration} configuration Structure holding service information.
 */
function ScormEngineService(configuration) {

  this.configuration_ = configuration;

  this.serviceRegistry_ = {};

  _.bindAll(this);

  var public_ = {
    getAvailableServices: this.getAvailableServices,
    getService: this.getService,
    getAppId: this.getAppId,
    getSecurityKey: this.getSecurityKey,
    getServiceUrl: this.getServiceUrl,
    getOrgin: this.getOrgin
  }

  this.registerServices_();

  return public_;
}

/**
 * Auto loads and registers services.
 * 
 * @private
 */
ScormEngineService.prototype.registerServices_ = function() {
  var self = this;
  var services = {};

  if(fs.existsSync(ScormEngineService.serviceManifestPath)) {
    services = require(ScormEngineService.serviceManifestPath);
  }
  _.each(services, function(value, key){
    self.serviceRegistry_[key] = require(path.resolve(path.join(ScormEngineService.servicePath, value)));
  });
}

/**
 * Returns a list of registered services.
 * 
 * @return {!Array<String>}
 */
ScormEngineService.prototype.getAvailableServices = function() {
  return _.keys(this.serviceRegistry_);
}

/**
 * Returns a configured service by key.
 * 
 * @param  {!String} service Service key.
 * @return {?Mixed}          A Configured service, or undefined.
 */
ScormEngineService.prototype.getService = function(service) {
  if(this.serviceRegistry_[service]) {
    return new this.serviceRegistry_[service](this.configuration_);
  }
}

/**
 * Returns configuration app id.
 * 
 * @return {!String}
 */
ScormEngineService.prototype.getAppId = function() {
  return this.configuration_.getAppId();
}

/**
 * Returns configuration security key.
 * 
 * @return {!String}
 */
ScormEngineService.prototype.getSecurityKey = function(){
  return this.configuration_.getSecurityKey();
}

/**
 * Returns configuration service url.
 * 
 * @return {!String}
 */
ScormEngineService.prototype.getServiceUrl = function(){
  return this.configuration_.getServiceUrl();
}

/**
 * Returns configuration orgin string.
 * 
 * @return {!String}
 */
ScormEngineService.prototype.getOrgin = function() {
  return this.configuration_.getOrgin();
}

/**
 * Service path. Where services are loaded from.
 *
 * @type {String}
 */
ScormEngineService.servicePath = path.join(__dirname, '/lib/services');

/**
 * Location of service manifest. Services are queried an resolved from this location
 * 
 * @type {String}
 */
ScormEngineService.serviceManifestPath = path.join(ScormEngineService.servicePath, '/services.json');

ScormEngineService.Configuration = Configuration;

module.exports = ScormEngineService;