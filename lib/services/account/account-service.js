var _ = require('underscore');

var AccountInfo = require('./account-info');

var ServiceRequest = require('../../request/service-request');
var Response = ServiceRequest.Response;

/**
 * @constructor
 * @param {!Configuration} configuration
 */
function AccountService(configuration) {
  this.configuration_ = configuration;

  _.bindAll(this);

  var public_ = {
    getAccountInformation: this.getAccountInformation
  }

  return public_;
}

/**
 * Fetches a collection of account based attributes.
 * 
 * @param  {Function} callback Method to invoke with response.
 */
AccountService.prototype.getAccountInformation = function(callback){
  var method = new ServiceRequest.RequestMethod(this.configuration_, {
    method: AccountService.serviceMethods.getAccountInformation
  });

  var request = new ServiceRequest(this.configuration_, method);

  request.submit(function(r){
    var data = new AccountInfo({});

    if(r.isOk()){
      var account = r.getData().account[0]
      
      data = new AccountInfo({
        email: account.email[0],
        firstName: account.firstname[0],
        lastName: account.lastname[0],
        company: account.company[0],
        accountType: account.accounttype[0],
        regLimit: parseInt(account.reglimit[0]),
        strictLimit: account.strictlimit[0] == 'true',
        createDate: account.createdate[0],
        usage: {
          regCount: parseInt(account.usage[0].regcount[0]),
          totalRegistration: parseInt(account.usage[0].totalregistrations[0]),
          totalCourses: parseInt(account.usage[0].totalcourses[0])
        }
      });
    }

    callback(new Response({
      data: data,
      status: r.getStatus(),
      error: r.getError()
    }));
  });
}

/**
 * Service methods supported by this object.
 * 
 * @type {Object}
 */
AccountService.serviceMethods = {
  getAccountInformation : 'rustici.reporting.getAccountInfo'
}

module.exports = AccountService;