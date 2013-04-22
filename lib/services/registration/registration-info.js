var _ = require('underscore');

function RegistrationInfo(obj) {
  this.format_ = obj.format;

  this.registrationId_ = obj.registrationId;

  this.instanceId_ = obj.instanceId;

  this.complete_ = obj.complete;

  this.success_ = obj.success;

  this.totalTime_ = obj.totalTime;

  this.score_ = obj.score;

  _.bindAll(this);

  var public_ = {
    getFormat: this.getFormat,
    getRegistrationId: this.getRegistrationId,
    getInstanceId: this.getInstanceId,
    getComplete: this.getComplete,
    getSuccess: this.getSuccess,
    getTotalTime: this.getTotalTime,
    getScore: this.getScore
  }

  return public_;
}

RegistrationInfo.prototype.getFormat = function() {
  return this.format_;
}

RegistrationInfo.prototype.getRegistrationId = function() {
  return this.registrationId_;
}

RegistrationInfo.prototype.getInstanceId = function() {
  return this.instanceId_;
}

RegistrationInfo.prototype.getComplete = function() {
  return this.complete_;
}

RegistrationInfo.prototype.getSuccess = function() {
  return this.success_;
}

RegistrationInfo.prototype.getTotalTime = function() {
  return this.totalTime_;
}

RegistrationInfo.prototype.getScore = function() {
  return this.score_;
}

module.exports = RegistrationInfo;