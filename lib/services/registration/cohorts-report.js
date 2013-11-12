var _ = require('underscore');

function CohortsReport(obj){
	this.cohorts_ = obj.cohorts;
	
	_.bindAll(this);
	
	var public_ = {
			getCohorts: this.getCohorts
	};
	
	return public_;
}

CohortsReport.prototype.getCohorts =  function(){
	return this.cohorts_;
}

module.exports = CohortsReport;