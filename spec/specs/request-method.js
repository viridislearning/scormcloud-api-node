var assert = require("assert");
var querystring = require('querystring');
var _ = require("underscore");

var RequestMethod = require('../../lib/request/request-method');
var Configuration = require('../../lib/configuration');

describe("RequestMethod", function(){
  var configuration = new Configuration("", "", "taco", "");
  var requestMethod;
  var parameters;

  beforeEach(function(){
    requestMethod = new RequestMethod(configuration);
    parameters = {'z': 1,'y': 2};
  });

  describe("#RequestMethod", function(){
    it("should create an instance of RequestMethod with 1 parameter if no parameters are given", function(){
      var requestMethod = new RequestMethod(configuration);
      var blob = querystring.parse(requestMethod.getMethod());

      assert.equal(Object.keys(blob).length, 1);
      assert.equal(Object.keys(blob)[0], 'sig');
    });

    it("should create an instance of RequestMethod with n+1 parameters if n parameters are given", function(){
      
      var requestMethod = new RequestMethod(configuration, parameters);
      var blob = querystring.parse(requestMethod.getMethod()); 

      assert.equal(Object.keys(blob).length - 1, Object.keys(parameters).length);
    });
  });

  describe("#setParameters", function(){
    it("should remove all parameters and replace with argument.", function(){
      requestMethod.setParameters({'x': 1});
      requestMethod.setParameters(parameters);

      var methodParameters = _.omit(querystring.parse(requestMethod.getMethod()), 'sig');

      assert.deepEqual(methodParameters, parameters);
    });
  });

  describe("#addParameters", function(){
    it("should merge parameters with those already provided.", function(){
      requestMethod.setParameters(parameters);
      requestMethod.addParameters({'x': 3});

      var expected = _.extend({}, {'x': 3}, parameters);
      var methodParameters = _.omit(querystring.parse(requestMethod.getMethod()), 'sig');
      
      assert.deepEqual(methodParameters, expected);
    });
  });

  describe("#getMethod", function(){
    it("should return a formatted and signed method string containing all parameters.", function(){
      requestMethod.setParameters(parameters);
      requestMethod.addParameters({'x': 3});

      // should be md5 of tacox3y2z1 = 8ce7baa8ea7dc3cc8e61f554d0855b43
      assert.equal(querystring.parse(requestMethod.getMethod()).sig, '8ce7baa8ea7dc3cc8e61f554d0855b43');
    });
  });
});