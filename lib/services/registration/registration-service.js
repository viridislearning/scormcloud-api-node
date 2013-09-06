var _ = require('underscore');

var RegistrationInfo = require('./registration-info');

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
    	
      report = new RegistrationInfo({
        format : data[0].$.format,
        registrationId : data[0].$.regid,
        instanceId : data[0].$.instanceid,
        complete : data[0].activity[0].completed[0],
        progress_measure : data[0].activity[0].children[0].activity[0].runtime[0].progress_measure[0],
        totalTime : data[0].activity[0].children[0].activity[0].runtime[0].total_time[0]
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
  launch  : 'rustici.registration.launch'
};

module.exports = RegistrationService;