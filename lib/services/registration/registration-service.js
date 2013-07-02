var _ = require('underscore');

var RegistrationInfo = require('./registration-info');
var RegistrationDetail = require('./registration-detail');

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
 * Fetches registration info. Currently provides the 'Big Four':
 * Completion, success, total time, & score
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
    var report = null;

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
 * Fetches registration detail. 
 * This provides general details regarding the registration (leaner names, course title, etc),
 * not completion data. Use 'getRegistrationInfo' to obtain completion and activity information
 * 
 * @param  {!String}   registrationId 
 * @param  {!Function} callback
 */
RegistrationService.prototype.getRegistrationDetail = function(registrationId, callback) {
  var method = new RequestMethod(this.configuration_, {
    method: RegistrationService.serviceMethods.getRegistrationDetail,
    regid: registrationId
  })

  var request = new ServiceRequest(this.configuration_, method);

  request.submit(function(r) {
    var data = r.getData().registration;
    var report = null;

    if(r.isOk()) {       
      report = new RegistrationDetail({
        id : data[0].$.id,
        courseId : data[0].$.courseid,
        appId : data[0].appId[0],
        registrationId : data[0].registrationId[0],
        courseTitle : data[0].courseTitle[0],
        lastCourseVersionLaunched : data[0].lastCourseVersionLaunched[0],
        learnerId : data[0].learnerId[0],
        learnerFirstName : data[0].learnerFirstName[0],
        learnerLastName : data[0].learnerLastName[0],
        email : data[0].email[0],
        createDate : data[0].createDate[0],
        firstAccessDate : data[0].firstAccessDate[0],
        lastAccessDate : data[0].lastAccessDate[0],
        completedDate : data[0].completedDate[0],
        tinCanRegistrationId : data[0].tinCanRegistrationId[0],
        instances : data[0].instances[0]
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
  getRegistrationDetail : 'rustici.registration.getRegistrationDetail',
  launch  : 'rustici.registration.launch'
};

module.exports = RegistrationService;