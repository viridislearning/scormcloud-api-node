var _ = require('underscore');
var moment = require('moment');

var RegistrationInfo = require('./registration-info');
var RegistrationReport = require('./registration-report');
var LearnersReport = require('./learners-report');

var ServiceRequest = require('../../request/service-request');
var Response = ServiceRequest.Response;
var RequestMethod = ServiceRequest.RequestMethod;

/**
 * @constructor
 * @param {!Configuration} configuration A configuration to be applied to all service calls of instance.
 */
function RegistrationService(configuration) {
  this.configuration_ = configuration;
}

/**
 * Enrollments a learner.
 * 
 * @param  {!Object}   opts     Describe Enrollment.
 * @param  {Function} callback  Callback to recieve response.
 */
RegistrationService.prototype.createRegistration = function(opts, callback){
  var method = new RequestMethod(this.configuration_, {
    method: RegistrationService.serviceMethods.createRegistration,
    courseid: opts.courseId,
    regid: opts.registrationId,
    learnerid : opts.learnerId,
    fname: opts.firstName,
    lname: opts.lastName,
    postbackurl: opts.postBackUrl
  });

  var request = new ServiceRequest(this.configuration_, method);

  request.submit(function(r) {
    callback(new Response({
      data: r.getData().success ? true : false, 
      error: r.getError(),
      status: r.getStatus()
    }));
  })
}

/**
 * Tests to see if a registration already exists.
 * 
 * @param  {!String} registrationId
 * @param  {!Function} callback
 */
RegistrationService.prototype.registrationExists = function(registrationId, callback) {
  var method = new RequestMethod(this.configuration_, {
    method: RegistrationService.serviceMethods.registrationExists,
    regid: registrationId
  });

  var request = new ServiceRequest(this.configuration_, method);

  request.submit(function(r) {
    callback(new Response({
      data: _.isEmpty(r.getData().result) ? null : r.getData().result == 'true',
      error: r.getError(),
      status: r.getStatus()
    }));
  });
}

/**
 * Deletes an enrollment
 * 
 * @param  {!Object}   opts
 * @param  {!Function} callback
 */
RegistrationService.prototype.deleteRegistration = function(opts, callback) {
  var method = new RequestMethod(this.configuration_, {
    method: RegistrationService.serviceMethods.deleteRegistration,
    regid: opts.registrationId,
    instanceid: opts.instanceOnly ? 'latest' : undefined
  });

  var request = new ServiceRequest(this.configuration_, method);

  request.submit(function(r) {
    callback(new Response({
      data: r.getData().success ? true : false,
      error: r.getError(),
      status: r.getStatus()
    }));
  });
}

/**
 * Fetches registration info.
 * 
 * @param  {!String}   registrationId 
 * @param  {!Function} callback
 */
RegistrationService.prototype.getRegistrationInfo = function(registrationId, callback) {
  var method = new RequestMethod(this.configuration_, {
    method: RegistrationService.serviceMethods.getRegistrationResult,
    regid: registrationId,
    resultsformat: 'course',
    dataformat: 'xml'
  })

  var request = new ServiceRequest(this.configuration_, method);

  request.submit(function(r) {
    var data = r.getData().registrationreport;
    var report = new RegistrationInfo({});

    if(r.isOk()) {
      report = new RegistrationInfo({
        format : data[0].$.format,
        registrationId : data[0].$.regid,
        instanceId : data[0].$.instanceid,
        complete : data[0].complete[0],
        success : data[0].success[0],
        totalTime : data[0].totaltime[0],
        score : data[0].score[0]
      });
    }
    
    callback(new Response({
      data: report,
      error: r.getError(),
      status: r.getStatus()
    }));
  });
}

/**
 * Fetches FULL registration info.
 * 
 * @param  {!String}   registrationId 
 * @param  {!Function} callback
 */
RegistrationService.prototype.getFullRegistrationInfo = function(registrationId, callback) {
  var method = new RequestMethod(this.configuration_, {
    method: RegistrationService.serviceMethods.getRegistrationResult,
    regid: registrationId,
    resultsformat: 'full',
    dataformat: 'xml'
  })

  var request = new ServiceRequest(this.configuration_, method);

  request.submit(function(r) {
    var data = r.getData().registrationreport;
    var report = new RegistrationInfo({});

    if(r.isOk()) {
    	var modules = data[0].activity[0].children[0].activity[0].children[0].activity;
    	var progress = 0.0;
    	var totalProgress = 0.0;
    	var totalTime = {
    			hours: 0,
    			minutes: 0,
    			seconds: 0,
    			miliseconds: 0
    	};
    	_.each(modules, function(module){
    		//if(parseFloat(module.runtime[0].progress_measure[0]) > progress){
    		//	progress = parseFloat(module.runtime[0].progress_measure[0]);    			
    		//}
    		
    		totalProgress += parseFloat(module.runtime[0].progress_measure[0]) || 0;
    		
    		var timeArray = module.runtime[0].total_time[0].replace('.', ':').split(':');
    		
    		timeArray[3] = timeArray[3] || 0;
    		
    		totalTime.hours += parseInt(timeArray[0]);
    		totalTime.minutes += parseInt(timeArray[1]);
    		totalTime.seconds += parseInt(timeArray[2]);
    		totalTime.miliseconds += parseInt(timeArray[3]);
    		    		
    	});
    	
    	progress = totalProgress/modules.length;
    	
    	//Properly sets the time values
		// miliseconds
		var addedSeconds = parseInt(totalTime.miliseconds/100);
		var reminderMiliseconds = (totalTime.miliseconds/100) % 1; 
		totalTime.miliseconds = reminderMiliseconds * 100;
		
		// seconds
		totalTime.seconds += addedSeconds;
		var addedMinutes = parseInt(totalTime.seconds/60);
		var reminderSeconds = (totalTime.seconds/60) % 1;
		totalTime.seconds = reminderSeconds * 60;
		
		// minutes
		totalTime.minutes += addedMinutes;
		var addedHours = parseInt(totalTime.minutes/60);
		var reminderMinutes = (totalTime.minutes/60) % 1;
		totalTime.minutes = reminderMinutes * 60;
		
		totalTime.hours += addedHours;
		
    	report = new RegistrationInfo({
    		format : data[0].$.format,
    		registrationId : data[0].$.regid,
    		instanceId : data[0].$.instanceid,
    		complete : data[0].activity[0].completed[0],
    		progress_measure : progress,
    		totalTime : totalTime.hours + ':' + totalTime.minutes + ':' + totalTime.seconds + '.' + totalTime.miliseconds
    	});
    }
    
    callback(new Response({
      data: report,
      error: r.getError(),
      status: r.getStatus()
    }));
  });
}

/**
 * Returns a learner course report.
 * If a learner Id is provided, only the registrations for that specific learner are returned, otherwise set learnerId as null
 * 
 * @param {!Object} courseId Course id to filter the list.
 * @param {!Function} callback Callback function.
 * 
 */

RegistrationService.prototype.getFullRegistrationListResults = function(learnerId, callback){
	var method = new RequestMethod(this.configuration_, {
	    method: RegistrationService.serviceMethods.getRegistrationListResults,	    
	    resultsformat: 'full',
	    dataformat: 'xml'
	  });
	
	var request = new ServiceRequest(this.configuration_, method);
	
	request.submit(function(r){
		if(r.isOk()){
			var data = r.getData().registrationlist
			// filter results by learnerId
			if(learnerId != null){
				data[0].registration = _.filter(data[0].registration, function(reg){
					return reg.learnerId[0] == learnerId; 
				});
			}
			
			var learners = {};
			
			_.each(data[0].registration, function(reg){
				if(learners[reg.learnerId[0]] === undefined){
					// Initialize learner
					learners[reg.learnerId[0]] = {
							courses: {}
					};
				}
				
				if(learners[reg.learnerId[0]].courses[reg.courseId[0]] === undefined){
					// initialize learner course
					learners[reg.learnerId[0]].courses[reg.courseId[0]] = {
							courseName: reg.courseTitle[0],
							enrolledTime: moment(reg.createDate[0]).fromNow(),
							attempts: reg.registrationreport[0].activity[0].attempts[0],
							modules: {}
					}
					
					// add the course modules
					_.each(reg.registrationreport[0].activity[0].children[0].activity[0].children[0].activity, function(module){
						learners[reg.learnerId[0]].courses[reg.courseId[0]].modules[module.$.id] = {
								title: module.title[0],
								progress: parseFloat(module.runtime[0].progress_measure[0]) || 0,
								score: parseFloat(module.runtime[0].score_scaled[0]) || 0,
								hours: parseInt(module.runtime[0].total_time[0].split('.')[0].split(':')[0]) || 0,
								minutes: parseInt(module.runtime[0].total_time[0].split('.')[0].split(':')[1]) || 0,
								seconds: parseInt(module.runtime[0].total_time[0].split('.')[0].split(':')[2]) || 0
						}
					});
				}
			});
			
			report = new LearnersReport({
				learners: learners
			});
		}
		
		callback(new Response({
			data: report,
			error: r.getError(),
			status: r.getStatus()
	    }));
	});
}

/**
 * Returns a registrations report.
 * If a course Id is provided, only the registrations for that specific course are returned, otherwise set courseId as null
 * 
 * @param {!Object} courseId Course id to filter the list.
 * @param {!Function} callback Callback function.
 * 
 */

RegistrationService.prototype.getRegistrationListResults = function(courseId, callback){
	var method = new RequestMethod(this.configuration_, {
	    method: RegistrationService.serviceMethods.getRegistrationListResults,
	    coursefilter: courseId != null ? courseId : '.*',
	    resultsformat: 'course',
	    dataformat: 'xml'
	  });
	
	var request = new ServiceRequest(this.configuration_, method);
	
	request.submit(function(r){
		if(r.isOk()){
			var data = r.getData().registrationlist
			var totalRegistrations = data[0].registration.length;
			var uniqueActiveLearners = [];
			var uniqueLearners = [];
			var totalLearners = 0
			var totalActiveLearners = 0;
			var totalPass = 0;
			var totalFail = 0;
			var totalTime = 0;
			
			var courses = {};
			
			_.each(data[0].registration, function(reg){
				if(reg.lastAccessDate[0] != ""){
					// Get report data only if the course has been launched at least once
					var lastAccessDate = moment(reg.lastAccessDate[0]);
					if(moment().diff(lastAccessDate, 'days') <= 30){
						// Only count active learners once
						if(!_.contains(uniqueActiveLearners, reg.learnerId[0])){
							// The user accessed the course within the last 30 days
							totalActiveLearners += 1;
							uniqueActiveLearners.push(reg.learnerId[0]);
						}						
					}
					
					if(!_.contains(uniqueLearners, reg.learnerId[0])){
						totalLearners += 1;
						uniqueLearners.push(reg.learnerId[0]);
					}
					
					if(reg.registrationreport[0].complete[0] == "complete" && reg.registrationreport[0].success[0] == "passed"){
						// Registration passed
						totalPass += 1;						
					}
					
					if(reg.registrationreport[0].complete[0] == "complete" && reg.registrationreport[0].success[0] == "failed"){
						// Registration passed
						totalFail += 1;						
					}
					
					totalTime += parseInt(reg.registrationreport[0].totaltime[0]);
					
					var score =  isNaN(parseFloat(reg.registrationreport[0].score[0])) ? 0 : parseFloat(reg.registrationreport[0].score[0]);
					score = score > 1 ? score / 100 : score;
					
					if(courses[reg.courseId[0]] === undefined){						
						courses[reg.courseId[0]] = {
								courseTitle: reg.courseTitle[0],
								totalRegistrations: 1,
								learners: [reg.learnerId[0]],
								activeLearners: [],
								scoreCount: score == 0 ? 0 : 1,
								scoreAvg: score,
								totalTime: parseInt(reg.registrationreport[0].totaltime[0]),
								hours: 0,
								minutes: 0,
								seconds: 0,
								timeStr: ''
						}
						
						if(moment().diff(lastAccessDate, 'days') <= 30){							
							courses[reg.courseId[0]].activeLearners.push(reg.learnerId[0]);							
						}
					}
					else{
						courses[reg.courseId[0]].totalRegistrations += 1;
						courses[reg.courseId[0]].scoreCount += score == 0 ? 0 : 1;
						courses[reg.courseId[0]].scoreAvg += score;
						courses[reg.courseId[0]].totalTime += parseInt(reg.registrationreport[0].totaltime[0]);
						
						var courseHours = (courses[reg.courseId[0]].totalTime/60)/60;
						courses[reg.courseId[0]].hours = parseInt(courseHours);
						
						var courseMinutes = (courseHours - courses[reg.courseId[0]].hours) * 60;
						courses[reg.courseId[0]].minutes = parseInt(courseMinutes);
						
						var courseSeconds = (courseMinutes - courses[reg.courseId[0]].minutes) * 60;
						courses[reg.courseId[0]].seconds = parseInt(courseSeconds);
						
						courses[reg.courseId[0]].timeStr = courses[reg.courseId[0]].hours + ' hours ' + courses[reg.courseId[0]].minutes + ' minutes'; 
						
						if(!_.contains(courses[reg.courseId[0]].learners, reg.learnerId[0])){
							courses[reg.courseId[0]].learners.push(reg.learnerId[0]);
						}
						
						if(moment().diff(lastAccessDate, 'days') <= 30){
							if(!_.contains(courses[reg.courseId[0]].activeLearners, reg.learnerId[0])){
								courses[reg.courseId[0]].activeLearners.push(reg.learnerId[0]);
							}
						}
					}
				}				
			});
			
			// calculates each course score avg
			_.each(courses, function(course){
				course.scoreAvg = course.scoreAvg / course.scoreCount; 
			});
			
			var hours = (totalTime/60)/60;
			var totalHours = parseInt(hours);
			
			var minutes = (hours - totalHours)  * 60;
			var totalMinutes = parseInt(minutes);
			
			var seconds = (minutes - totalMinutes) * 60;
			var totalSeconds = parseInt(seconds);
			
			report = new RegistrationReport({
				registrations: totalRegistrations,
				activeLearners: totalActiveLearners,
				totalLearners: totalLearners,
				passed: totalPass,
				failed: totalFail,
				hours: totalHours,
				minutes: totalMinutes,
				seconds: totalSeconds,
				courses: courses
			});
			
			callback(new Response({
				data: report,
				error: r.getError(),
				status: r.getStatus()
			}));
		}
	});
}

/**
 * Returns a registrations report for a specific set of users.
 * 
 * @param {!Object} users Users IDs to filter the list.
 * @param {!Function} callback Callback function.
 * 
 */

RegistrationService.prototype.getOrganizationListResults = function(users, callback){
	var method = new RequestMethod(this.configuration_, {
	    method: RegistrationService.serviceMethods.getRegistrationListResults,	    
	    resultsformat: 'course',
	    dataformat: 'xml'
	  });
	
	var request = new ServiceRequest(this.configuration_, method);
	
	request.submit(function(r){
		if(r.isOk()){
			var data = r.getData().registrationlist
			var totalRegistrations = 0;
			var uniqueActiveLearners = [];
			var uniqueLearners = [];
			var totalLearners = 0
			var totalActiveLearners = 0;
			var totalPass = 0;
			var totalFail = 0;
			var totalTime = 0;
			
			var courses = {};
			
			_.each(data[0].registration, function(reg){
				if(users[reg.learnerId[0]] != undefined){
					totalRegistrations += 1;
					if(reg.lastAccessDate[0] != ""){
						// Get report data only if the course has been launched at least once
						var lastAccessDate = moment(reg.lastAccessDate[0]);
						if(moment().diff(lastAccessDate, 'days') <= 30){
							// Only count active learners once
							if(!_.contains(uniqueActiveLearners, reg.learnerId[0])){
								// The user accessed the course within the last 30 days
								totalActiveLearners += 1;
								uniqueActiveLearners.push(reg.learnerId[0]);
							}						
						}
						
						if(!_.contains(uniqueLearners, reg.learnerId[0])){
							totalLearners += 1;
							uniqueLearners.push(reg.learnerId[0]);
						}
						
						if(reg.registrationreport[0].complete[0] == "complete" && reg.registrationreport[0].success[0] == "passed"){
							// Registration passed
							totalPass += 1;						
						}
						
						if(reg.registrationreport[0].complete[0] == "complete" && reg.registrationreport[0].success[0] == "failed"){
							// Registration passed
							totalFail += 1;						
						}
						
						totalTime += parseInt(reg.registrationreport[0].totaltime[0]);
						
						var score =  isNaN(parseFloat(reg.registrationreport[0].score[0])) ? 0 : parseFloat(reg.registrationreport[0].score[0]);
						score = score > 1 ? score / 100 : score;
						
						if(courses[reg.courseId[0]] === undefined){						
							courses[reg.courseId[0]] = {
									courseTitle: reg.courseTitle[0],
									totalRegistrations: 1,
									learners: [reg.learnerId[0]],
									activeLearners: [],
									scoreCount: score == 0 ? 0 : 1,
									scoreAvg: score,
									totalTime: parseInt(reg.registrationreport[0].totaltime[0]),
									hours: 0,
									minutes: 0,
									seconds: 0,
									timeStr: ''
							}
							
							if(moment().diff(lastAccessDate, 'days') <= 30){							
								courses[reg.courseId[0]].activeLearners.push(reg.learnerId[0]);							
							}
						}
						else{
							courses[reg.courseId[0]].totalRegistrations += 1;
							courses[reg.courseId[0]].scoreCount += score == 0 ? 0 : 1;
							courses[reg.courseId[0]].scoreAvg += score;
							courses[reg.courseId[0]].totalTime += parseInt(reg.registrationreport[0].totaltime[0]);
							
							var courseHours = (courses[reg.courseId[0]].totalTime/60)/60;
							courses[reg.courseId[0]].hours = parseInt(courseHours);
							
							var courseMinutes = (courseHours - courses[reg.courseId[0]].hours) * 60;
							courses[reg.courseId[0]].minutes = parseInt(courseMinutes);
							
							var courseSeconds = (courseMinutes - courses[reg.courseId[0]].minutes) * 60;
							courses[reg.courseId[0]].seconds = parseInt(courseSeconds);
							
							courses[reg.courseId[0]].timeStr = courses[reg.courseId[0]].hours + ' hours ' + courses[reg.courseId[0]].minutes + ' minutes'; 
							
							if(!_.contains(courses[reg.courseId[0]].learners, reg.learnerId[0])){
								courses[reg.courseId[0]].learners.push(reg.learnerId[0]);
							}
							
							if(moment().diff(lastAccessDate, 'days') <= 30){
								if(!_.contains(courses[reg.courseId[0]].activeLearners, reg.learnerId[0])){
									courses[reg.courseId[0]].activeLearners.push(reg.learnerId[0]);
								}
							}
						}
					}
				}
			});
			
			// calculates each course score avg
			_.each(courses, function(course){
				course.scoreAvg = course.scoreAvg / course.scoreCount; 
			});
			
			var hours = (totalTime/60)/60;
			var totalHours = parseInt(hours);
			
			var minutes = (hours - totalHours)  * 60;
			var totalMinutes = parseInt(minutes);
			
			var seconds = (minutes - totalMinutes) * 60;
			var totalSeconds = parseInt(seconds);
			
			report = new RegistrationReport({
				registrations: totalRegistrations,
				activeLearners: totalActiveLearners,
				totalLearners: totalLearners,
				passed: totalPass,
				failed: totalFail,
				hours: totalHours,
				minutes: totalMinutes,
				seconds: totalSeconds,
				courses: courses
			});
			
			callback(new Response({
				data: report,
				error: r.getError(),
				status: r.getStatus()
			}));
		}
	});
}

/**
 * Returns a url needed to launch the course.
 * 
 * @param {!Object} opts Launch url configuration.
 * @return {!String}
 */
RegistrationService.prototype.launch = function(opts) {
  var method = new RequestMethod(this.configuration_, {
    method: RegistrationService.serviceMethods.launch,
    regid: opts.registrationId,
    redirecturl: opts.redirectOnExitUrl ? opts.redirectOnExitUrl : '/',
    cssurl: opts.cssUrl,
    saveDebugLogPointerUrl: opts.debugLogPointerUrl,
    courseTags: opts.courseTags,
    learnerTags: opts.learnerTags,
    registrationTags: opts.registrationTags
  });

  var request = new ServiceRequest(this.configuration_, method);

  return request.getRequestUrl();
}

/**
 * Method that support this object.
 * 
 * @type {Object}
 */
RegistrationService.serviceMethods = {
  createRegistration : 'rustici.registration.createRegistration',
  registrationExists : 'rustici.registration.exists',
  deleteRegistration : 'rustici.registration.deleteRegistration',
  getRegistrationResult : 'rustici.registration.getRegistrationResult',
  getRegistrationListResults : 'rustici.registration.getRegistrationListResults',
  launch  : 'rustici.registration.launch'
};

module.exports = RegistrationService;