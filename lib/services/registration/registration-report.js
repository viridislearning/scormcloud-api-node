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

RegistrationReport.prototype.getRegistrations = function(){
	return this.registrations_;
};

RegistrationReport.prototype.getLearners = function(){
	return this.learners_
};

RegistrationReport.prototype.getPassed = function(){
	return this.passed_;
};

RegistrationReport.prototype.getFailed = function(){
	return this.failed_
};

RegistrationReport.prototype.getTimeStr = function(){
	return this.hours_ + ' hours ' + this.minutes_ + ' minutes';
};

RegistrationReport.prototype.getHours = function(){
	return this.hours_;
};

RegistrationReport.prototype.getMinutes = function(){
	return this.minutes_;
};

RegistrationReport.prototype.getSeconds = function(){
	return this.secodns_;
};

module.exports = RegistrationReport;