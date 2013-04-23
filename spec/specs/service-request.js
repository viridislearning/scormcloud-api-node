var _ = require('underscore');
var queryString = require('querystring');
var url = require('url');
var assert = require('assert');
var nock = require('nock');

var ServiceRequest = require('../../lib/request/service-request');
var RequestMethod = require('../../lib/request/request-method');
var Configuration = require('../../lib/configuration');

describe("ServiceRequest", function(){

  var serviceRequest;
  var mockGateway;
  var apiHost = "http://cloud.scorm.com";
  var configuration = new Configuration(apiHost, "appId", "secretKey", "nock");

  beforeEach(function(){
    mockGateway = nock(apiHost)
      .filteringPath(function(path){
        return '/';
      })
      .get('/');

    serviceRequest = new ServiceRequest(configuration);
  });

  describe('#ServiceRequest', function(){
    it('Should create a service request with no user parameters.', function(){
      var expectedParameters = ['appid', 'origin', 'ts', 'applib', 'sig'].sort();
      var parameters = Object.keys(queryString.parse(url.parse(serviceRequest.getRequestUrl()).query)).sort();
      
      assert.deepEqual(parameters, expectedParameters);
    });

    it('Should create a service request with user supplied parameters.', function(){
      var expectedParameters = ['appid', 'origin', 'ts', 'applib', 'sig'].concat(['test', 'anotherTest']).sort();
      var request = new ServiceRequest(configuration, new RequestMethod(configuration, {
        test: 'something',
        anotherTest: 'somethingElse'
      }));
      var parameters = Object.keys(queryString.parse(url.parse(request.getRequestUrl()).query)).sort();

      assert.deepEqual(parameters, expectedParameters);
    });
  });
});