var path = require('path');
var fs = require('fs');

var specPath = path.join(__dirname, 'specs');

((function(files){
  for(var index = 0; index < files.length; index++) {
    var fileName = (function(file){
      var extPos = file.lastIndexOf('.');

      if(extPos > 0 && file.substr(extPos).toLowerCase() == '.js') {
        return file.substr(0, extPos);
      } 
    })(files[index]);

    if(fileName) {
      global[fileName] = require(path.join(specPath, fileName));
    }
  }
})(fs.readdirSync(specPath)));