
var _ = require('underscore');

/**
 * Scorm cloud configuration used by services.
 * 
 * @param {!String} serviceUrl    Url to service API.
 * @param {!String} appId         ID from registration with scorm cloud engine.
 * @param {!String} securityKey   Key linked to appID.
 * @param {!String} orgin         What is using this app?
 */
function Configuration(serviceUrl, appId, securityKey, orgin) {

  this.serviceUrl_ = serviceUrl || "";
 
  this.appId_ = appId || "";

  this.securityKey_ = securityKey || "";

  this.orgin_ = orgin || "";

  _.bindAll(this);

  var public_ = {
    getAppId: this.getAppId,
    getSecurityKey: this.getSecurityKey,
    getServiceUrl: this.getServiceUrl,
    getOrgin: this.getOrgin
  }

  return public_;
}

/**
 * Returns instance app id.
 * 
 * @return {!String}
 */
Configuration.prototype.getAppId = function(){
  return this.appId_;
}

/**
 * Returns instance security key.
 * 
 * @return {!String}
 */
Configuration.prototype.getSecurityKey = function(){
  return this.securityKey_;
}

/**
 * Returns instance service url.
 * 
 * @return {!String}
 */
Configuration.prototype.getServiceUrl = function(){
  return this.serviceUrl_;
}

/**
 * Returns instance orgin string.
 * 
 * @return {!String}
 */
Configuration.prototype.getOrgin = function() {
  return this.orgin_;
}

module.exports = Configuration;
