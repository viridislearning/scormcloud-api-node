var _ = require('underscore');

function RegistrationInfo(obj) {
  this.id_ = obj.id;

  this.courseId_ = obj.courseId;

  this.appId_ = obj.appId;

  this.registrationId_ = obj.registrationId;

  this.courseTitle_ = obj.courseTitle;

  this.lastCourseVersionLaunched_ = obj.lastCourseVersionLaunched;

  this.learnerId_ = obj.learnerId;

  this.learnerFirstName_ = obj.learnerFirstName;

  this.learnerLastName_ = obj.learnerLastName;

  this.email_ = obj.email;

  this.createDate_ = obj.createDate;

  this.firstAccessDate_ = obj.firstAccessDate;

  this.lastAccessDate_ = obj.lastAccessDate;

  this.completedDate_ = obj.completedDate;

  this.tinCanRegistrationId_ = obj.tinCanRegistrationId;

  this.instances_ = obj.instances;

  _.bindAll(this);

  var public_ = {
    getId: this.getId,
    getCourseId: this.getCourseId,
    getAppId: this.getAppId,
    getRegistrationId: this.getRegistrationId,
    getCourseTitle: this.getCourseTitle,
    getLastCourseVersionLaunched: this.getLastCourseVersionLaunched,
    getLearnerId: this.getLearnerId,
    getFirstName: this.getFirstName,
    getLastName: this.getLastName,
    getEmail: this.getEmail,
    getCreateDate: this.getCreateDate,
    getFirstAccessDate: this.getFirstAccessDate,
    getLastAccessDate: this.getLastAccessDate,
    getCompletedDate: this.getCompletedDate,
    getTinCanRegistrationId: this.getTinCanRegistrationId,
    getInstances: this.getInstances
  }

  return public_;
}

RegistrationInfo.prototype.getId = function() {
  return this.id_;
}

RegistrationInfo.prototype.getCourseId = function() {
  return this.courseId_;
}

RegistrationInfo.prototype.getAppId = function() {
  return this.appId_;
}

RegistrationInfo.prototype.getRegistrationId = function() {
  return this.registrationId_;
}

RegistrationInfo.prototype.getCourseTitle = function() {
  return this.courseTitle_;
}

RegistrationInfo.prototype.getLastCourseVersionLaunched = function() {
  return this.lastCourseVersionLaunched_;
}

RegistrationInfo.prototype.getLearnerId = function() {
  return this.learnerId_;
}

RegistrationInfo.prototype.getFirstName = function() {
  return this.learnerFirstName_;
}

RegistrationInfo.prototype.getLastName = function() {
  return this.learnerLastName_;
}

RegistrationInfo.prototype.getEmail = function() {
  return this.email_;
}

RegistrationInfo.prototype.getCreateDate = function() {
  return this.createDate_;
}

RegistrationInfo.prototype.getFirstAccessDate = function() {
  return this.firstAccessDate_;
}

RegistrationInfo.prototype.getLastAccessDate = function() {
  return this.lastAccessDate_;
}

RegistrationInfo.prototype.getCompletedDate = function() {
  return this.completedDate_;
}

RegistrationInfo.prototype.getTinCanRegistrationId = function() {
  return this.tinCanRegistrationId_;
}

RegistrationInfo.prototype.getInstances = function() {
  return this.instances_;
}

module.exports = RegistrationInfo;