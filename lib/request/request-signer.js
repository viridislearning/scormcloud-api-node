var crypto = require('crypto');
var _ = require('underscore')

var requestSigner = {

  /**
   * Anything in this array will be ignored on signing.
   * 
   * @type {Array<String>}
   */
  ignoredParams : ['sig', 'filedata'],

  /**
   * Generates a signitature needed to verify requests.
   * 
   * @param  {!String} securityKey Key to mix with the signature. Used the prove identity.
   * @param  {!Object<string, string>} parameters Request parameters.
   * @return {!String} Request digest.
   */
  generateSignature : function(securityKey, parameters){
    var toSign = '';
    
    var keys = _.keys(parameters).filter(function(value) {
      return requestSigner.ignoredParams.indexOf(value) == -1;     
    });

    _.each(keys, function(value){
      toSign += value + parameters[value];
    });
    
    return crypto.createHash('md5').update(securityKey + toSign).digest('hex');
  }
};

module.exports = requestSigner;