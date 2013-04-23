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
    it('should create a service request with no user parameters.', function(){
      var expectedParameters = ['appid', 'origin', 'ts', 'applib', 'sig'].sort();
      var parameters = Object.keys(queryString.parse(url.parse(serviceRequest.getRequestUrl()).query)).sort();
      
      assert.deepEqual(parameters, expectedParameters);
    });

    it('should create a service request with user supplied parameters.', function(){
      var expectedParameters = ['appid', 'origin', 'ts', 'applib', 'sig'].concat(['test', 'anotherTest']).sort();
      var request = new ServiceRequest(configuration, new RequestMethod(configuration, {
        test: 'something',
        anotherTest: 'somethingElse'
      }));
      var parameters = Object.keys(queryString.parse(url.parse(request.getRequestUrl()).query)).sort();

      assert.deepEqual(parameters, expectedParameters);
    });
  });

  describe('#addListener', function(){
    it('should allow for event binding of InvalidResponse', function(){
      var dispatched = false;

      mockGateway.reply(200, "");

      serviceRequest.addListener(ServiceRequest.events.InvalidResponse, function(e){
        dispatched = true;
      })

      serviceRequest.submit(function(){
        assert.equal(dispatched, true);
      });
    })
  });

  describe('#removeListener', function(){
    it('should release an event bound on InvalidResponse', function(){
      var dispatched = false;

      mockGateway.reply(200, "");

      var listener = function(){
        dispatched = true;
      }

      serviceRequest.addListener(ServiceRequest.events.InvalidResponse, listener);
      serviceRequest.removeListener(ServiceRequest.events.InvalidResponse, listener);

      serviceRequest.submit(function(){
        assert.equal(dispatched, false);
      })
    })
  })

  describe('#submit', function(){
    it('should handle invalid xml responses.', function(){
      mockGateway.reply(200, "taco");

      serviceRequest.submit(function(r){
        assert.equal(r.getError(), ServiceRequest.error.InvalidXml);
      });
    });

    it('should handle empty responses.', function(){
      mockGateway.reply(200, "");

      serviceRequest.submit(function(r){
        assert.equal(r.getError(), ServiceRequest.error.EmptyResponse);
      });
    });

    it('should handle malformed responses.', function(){
      mockGateway.reply(200, "<a></a>");

      serviceRequest.submit(function(r){
        assert.equal(r.getError(), ServiceRequest.error.MalformedResponse);
      });
    });

     it('should handle and parse valid responses.', function(){
      mockGateway.reply(200, '<?xml version="1.0" encoding="utf-8" ?><rsp stat="ok"></rsp>');

      serviceRequest.submit(function(r){
        assert.equal(r.getData().$.stat, 'ok');
      })
    });
  });
});