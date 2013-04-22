scormcloud-api-node
===================

A very rough and simple implementation of the scormcloud api. 

This is work in progress that currently only partially supports 2 of the many services offered. 
I will be adding more services as they are needed by my company. If you need features or changes faster than
i can apply, im happy to make this an open project. 

Using these services are fairly easy;

```javascript
var ScormCloudAPI = require('scormcloud-api');

var config = new ScormCloudAPI.Configuration('http://cloud.scorm.com', 'yourappid', 'yoursecretkey', 'orgin');

var serviceProvider = new ScormCloudAPI(config);
var accountService = serviceProvicer.getService('account');

accountService.getAccountInformation(function(r){
  if(r.isOk()){
    var accountInfo = r.getData();
    console.log(accountInfo.getFirstName() + " " + accountInfo.getLastName());
  } else {
    console.log('Request returned: ' + r.getStatus() + ' with error: ' + r.getError());
  }
});
```
