var _ = require('underscore');

function LearnersReport(obj){
	this.learners_ = obj.learners;
	
	_.bindAll(this);
	
	var public_ = {
			getLearners: this.getLearners
	};
	
	return public_;
}

LearnersReport.prototype.getLearners =  function(){
	return this.learners_;
}

module.exports = LearnersReport;