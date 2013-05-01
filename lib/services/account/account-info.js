var _ = require('underscore');

function AccountInfo(obj) {
  this.email_ = obj.email;

  this.firstName_ = obj.firstName;

  this.lastName_ = obj.lastName;

  this.company_ = obj.company;

  this.accountType_ = obj.accountType;

  this.regLimit_ = obj.regLimit;

  this.strictLimit_ = obj.strictLimit;

  this.createDate_ = obj.createDate;

  this.usage_ = obj.usage || {};

  _.bindAll(this);

  var pubic_ = {
    getEmail: this.getEmail,
    getFirstName: this.getFirstName,
    getLastName: this.getLastName,
    getCompany: this.getCompany,
    getAccountType: this.getAccountType,
    getRegLimit: this.getRegLimit,
    isStrictLimit: this.isStrictLimit,
    getCreateDate: this.getCreateDate,
    getUsage: this.getUsage,
    getRemainingRegistrations: this.getRemainingRegistrations
  }

  return pubic_;
}

AccountInfo.prototype.getEmail = function() {
  return this.email_;
}

AccountInfo.prototype.getFirstName = function() {
  return this.firstName_;
}

AccountInfo.prototype.getLastName = function() {
  return this.lastName_;
}

AccountInfo.prototype.getCompany = function() {
  return this.company_;
}

AccountInfo.prototype.getAccountType = function() {
  return this.accountType_;
}

AccountInfo.prototype.getRegLimit = function() {
  return this.regLimit_;
}

AccountInfo.prototype.isStrictLimit = function() {
  return this.strictLimit_;
}

AccountInfo.prototype.getCreateDate = function() {
  return this.createDate_;
}

AccountInfo.prototype.getUsage = function() {
  return this.usage_;
}

AccountInfo.prototype.getRemainingRegistrations = function() {
  var usage = this.getUsage();
  var regLimit = this.getRegLimit();

  if(_.isNumber(regLimit) && _.isNumber(usage.totalRegistration)) {
    return regLimit - usage.totalRegistration;
  }
}

module.exports = AccountInfo;