var assert = require('assert');
var _ = require('underscore');

var requestSigner = require('../../lib/request/request-signer');

describe('requestSigner', function(){
  describe('#generateSignature', function(){
    it('should sign an object with a key', function() {
      var key = 'taco';
      var method = {
        "z": '1',
        "x": '2',
        "y": '3'
      };

      //should sign as tacoz1x2y3 = 1524f0f6528d1f483acbde07621d5efc via http://www.adamek.biz/md5-generator.php
      assert.equal(requestSigner.generateSignature(key, method), '1524f0f6528d1f483acbde07621d5efc');
    });

    it('should filter reserved keywords', function(){
      var key = 'taco';
      var method = {
        "z": '1',
        "x": '2',
        "y": '3',
        "sig": 'sig'
      };

      assert.equal(requestSigner.generateSignature(key, method), '1524f0f6528d1f483acbde07621d5efc');
    });
  });
});