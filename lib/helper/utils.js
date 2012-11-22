var fs = require('fs');
var path =  require('path');


/**
 * Get all files in directory
 * 
 * @param {String} dir dir to find files in
 * @param {Function} filter 
 * 
 * @return {Array} 
 */
function walk(dir, filter, done){
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, filter, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          if(filter(file)){
            results.push(file);
          }
          next();
        }
      });
    })();
  });
}

exports.walk = walk;