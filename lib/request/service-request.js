var url = require('url');
var http = require('http');
var xml2js = require('xml2js');
var _ = require('underscore');

var RequestMethod = require('./request-method');
var Response = require('./response');
var requestError = require('./request-error');
var common = require('../common');


/**
 * @constructor
 * @param {!Configuration} configuration
 * @param {RequestMethod=} parameters
 */
function ServiceRequest(configuration, parameters) {

  this.configuration_ = configuration;

  this.method_ = parameters || new RequestMethod(this.configuration_);

  this.serviceHost_ = url.parse(this.configuration_.getServiceUrl()).host;

  this.eventTarget_ = new (require('events')).EventEmitter();
  
  _.bindAll(this);

  var public_ = {
    addListener: this.addListener,
    removeListener: this.removeListener,
    submit: this.submit,
    getRequestUrl: this.getRequestUrl
  }     

  return public_;
}

/**
 * binds listener to an event.
 * 
 * @param  {!events} event Event to bind to.
 * @param  {!Function} listener Listener to bind event to.
 */
ServiceRequest.prototype.addListener = function(event, listener) {
  if(_.isFunction(listener) && ServiceRequest.events[event]) {
    this.eventTarget_.on(event, listener);
  }
}

/**
 * remove listener from event target.
 * 
 * @param  {!events} event Event to remove.
 * @param  {!Function} listener Listener to remove.
 */
ServiceRequest.prototype.removeListener = function(event, listener) {
  this.eventTarget_.removeListener(event, listener);
}

ServiceRequest.prototype.parse = function(buffer, callback){
  var self = this;
  var callback_ = callback || function() {};
  var status;
  var data;
  var error;
  
  xml2js.parseString(buffer, function(err, result){
    if(err) {
      self.eventTarget_.emit(ServiceRequest.events.InvalidResponse);

      callback_(new Response({
        status: Response.status.FAILED,
        error: requestError.InvalidXml,
        data: buffer
      }));
    } else {
      if(!self.assertNoError_(result)) {
        self.eventTarget_.emit(ServiceRequest.events.InvalidResponse);
        status = Response.status.FAILED;

        if(result) {
          data = result.rsp;

          try {
            error = result.rsp.err[0].$.msg;
          } catch(e) {
            error = requestError.MalformedResponse;
          }
        } else {
          error = requestError.EmptyResponse;
        }
      } else {
        data = result.rsp;
      } 

      callback_(new Response({
        status: status,
        data: data,
        buffer: buffer,
        error: error
      }));
    }
  });
}

/**
 * Submits this request.
 * 
 * @param  {Function(err, response)=} callback A method to call on response.
 */
ServiceRequest.prototype.submit = function(callback) {
  var buffer = '';
  var self = this;
  var callback_ = callback || function() {};
  var status;
  var data;
  var error;
 
  http.request({
    host: this.serviceHost_,
    port: '80',
    path: this.buildRequest_(),
    method: 'GET',
  }, function(res){
    res.on('data', function(chunk){
      buffer += chunk;
    });

    res.on('end', function(){
      xml2js.parseString(buffer, function(err, result){
        if(err) {
          self.eventTarget_.emit(ServiceRequest.events.InvalidResponse);

          callback_(new Response({
            status: Response.status.FAILED,
            error: requestError.InvalidXml,
            data: buffer
          }));
        } else {
          if(!self.assertNoError_(result)) {
            self.eventTarget_.emit(ServiceRequest.events.InvalidResponse);
            status = Response.status.FAILED;

            if(result) {
              data = result.rsp;

              try {
                error = result.rsp.err[0].$.msg;
              } catch(e) {
                error = requestError.MalformedResponse;
              }
            } else {
              error = requestError.EmptyResponse;
            }
          } else {
            data = result.rsp;
          } 

          callback_(new Response({
            status: status,
            data: data,
            buffer: buffer,
            error: error
          }));
        }
      });
    });
  }).end();
}

/**
 * Returns entire service request url.
 * 
 * @return {!String}
 */
ServiceRequest.prototype.getRequestUrl = function() {
  return this.configuration_.getServiceUrl() + this.buildRequest_();
}

/**
 * Validates response as a valid response.
 * 
 * @param  {!Object} obj response Object
 * @return {!Boolean}    True if response exists without errors.
 */
ServiceRequest.prototype.assertNoError_ = function(obj) {
  return obj && obj.rsp && !obj.rsp.err;
}

/**
 * Buids request path.
 * 
 * @return {!String} [description]
 */
ServiceRequest.prototype.buildRequest_ = function() {
  return ServiceRequest.apiPath + '?' + this.buildRequestMethod_();
}

/**
 * Builds the method by adding required params and mixing in user provided inputs.
 * 
 * @return {!String}
 */
ServiceRequest.prototype.buildRequestMethod_ = function() {
  this.method_.addParameters({
    'appid': this.configuration_.getAppId(),
    'origin': this.configuration_.getOrgin(),
    'ts': common.UTCDateString(),
    'applib': ServiceRequest.applib});

  return this.method_.getMethod();
}

/**
 * Events supported by this object.
 * 
 * @type {Object}
 */
ServiceRequest.events = {
  InvalidResponse : 'InvalidResponse'
}

/**
 * Library to use on service requests.
 * 
 * @type {String}
 */
ServiceRequest.applib = 'net';

/**
 * Path of api.
 * 
 * @type {String}
 */
ServiceRequest.apiPath = '/api';

ServiceRequest.RequestMethod = RequestMethod;

ServiceRequest.Response = Response;

ServiceRequest.error = requestError;

module.exports = ServiceRequest;