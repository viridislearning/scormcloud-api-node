var _ = require('underscore');

function RegistrationReport(obj){
	this.registrations_ = obj.registrations;
	this.activeLearners_ = obj.activeLearners;
	this.totalLearners_ = obj.totalLearners;
	this.passed_ = obj.passed;
	this.failed_ = obj.failed;
	this.hours_ = obj.hours;
	this.minutes_ = obj.minutes;
	this.seconds_ = obj.seconds;
	this.courses_ = obj.courses;
	
	_.bindAll(this);
	
	var public_ = {
			getRegistrations: this.getRegistrations,
			getActiveLearners: this.getActiveLearners,
			getTotalLearners: this.getTotalLearners,
			getPassed: this.getPassed,
			getFailed: this.getFailed,
			getTimeStr: this.getTimeStr,
			getHours: this.getHours,
			getMinutes: this.getMinutes,
			getSeconds: this.getSeconds,
			getCourses: this.getCourses
	};
	
	return public_;
}

RegistrationReport.prototype.getRegistrations = function(){
	return this.registrations_;
};

RegistrationReport.prototype.getActiveLearners = function(){
	return this.activeLearners_
};

RegistrationReport.prototype.getTotalLearners = function(){
	return this.totalLearners_
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

RegistrationReport.prototype.getCourses = function(){
	return this.courses_;
};

module.exports = RegistrationReport;