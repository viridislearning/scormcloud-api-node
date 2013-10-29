var _ = require('underscore');

function RegistrationReport(obj){
	this.registrations_ = obj.registrations;
	this.learners_ = obj.learners;
	this.passed_ = obj.passed;
	this.failed_ = obj.failed;
	this.hours_ = obj.hours;
	this.minutes_ = obj.minutes;
	this.seconds_ = obj.seconds;
	
	_.bindAll(this);
	
	var public_ = {
			getRegistrations: this.getRegistrations,
			getLearners: this.getLearners,
			getPassed: this.getPassed,
			getFailed: this.getFailed,
			getTimeStr: this.getTimeStr,
			getHours: this.getHours,
			getMinutes: this.getMinutes,
			getSeconds: this.getSeconds
	};
	
	return public_;
}

RegistrationService.prototype.getRegistrations = function(){
	return this.registrations_;
};

RegistrationService.prototype.getLearners = function(){
	return this.learners_
};

RegistrationService.prototype.getPassed = function(){
	return this.passed_;
};

RegistrationService.prototype.getFailed = function(){
	return this.failed_
};

RegistrationService.prototype.getTimeStr = function(){
	return this.hours_ + ' hours ' + this.minutes_ + ' minutes';
};

RegistrationService.prototype.getHours = function(){
	return this.hours_;
};

RegistrationService.prototype.getMinutes = function(){
	return this.minutes_;
};

RegistrationService.prototype.getSeconds = function(){
	return this.secodns_;
};

module.exports = RegistrationReport;