var path = require('path');
var fs = require('fs');

((function(files){
  for(var index = 0; index < files.length; index++) {
    var fileName = (function(file){
      var extPos = file.lastIndexOf('.');

      if(extPos > 0 && file.substr(extPos).toLowerCase() == '.js') {
        return file.substr(0, extPos);
      } 
    })(files[index]);

    if(fileName) {
      global[fileName] = require(path.join(__dirname, 'specs', fileName));
    }
  }
})(fs.readdirSync('./specs')));