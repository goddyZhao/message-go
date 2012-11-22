var fs = require('fs');
var path = require('path');
var Step = require('step');
var LineStream = require('linestream');
var clc = require('cli-color');
var utils = require('./helper/utils');
var log = require('./helper/log');


/**
 * Let messages go from FROM to TO
 * @param {String} from directory or file the messages come from
 * @param {String} to file the message go to
 */
function go(from, to){
  var toStream;

  Step(
    function checkParams(){
      _checkParams(from, to, this)
    },

    function(err, checkResult){
      var checkResultOfFrom;
      var checkResultOfTo;

      if(err){ 
        log.error('invalid options');
        throw err;
        return;
      }

      checkResultOfFrom =  checkResult.from;
      checkResultOfTo = checkResult.to;

      if(!checkResultOfTo.isFile){
        throw new Error('-t should specify a file but not a directory');
      }

      Step(
        function resolveFrom(){
          if(checkResultOfFrom.isFile){
            return [checkResultOfFrom.path];
          }else if(checkResultOfFrom.isDirectory){
            utils.walk(checkResultOfFrom.path, function(file){
              return path.extname(file) === '.js';
            }, this);
          }
        },

        function action(err, files){
          var group;
          if(err){ throw err; }
          
          group = this.group();
          toStream = fs.createWriteStream(to, {flags: 'a'});

          for(var i = 0, l = files.length; i < l; i++){
            goByFile(files[i], toStream, group());
          }
        },

        function showStats(err, numbers){
          var totally = 0;
          if(err){
            throw err;
          }

          toStream.end();

          numbers.forEach(function(number){
            totally = totally + number;
          });

          if(totally > 0){
            console.log('--------');
            console.log('Totally ' + clc.red(totally) + ' messages have gone to ' +
                clc.green(to));
          }else{
            console.log(clc.red('No') + ' messages found in ' + clc.cyan(from));
          }

        }
      );

    }
  )
}

function _checkParams(from, to, callback){
  var checkResult = {
    from: {},
    to: {}
  };


  Step(
    function stat(){
      fs.stat(from, this.parallel());
      fs.stat(to, this.parallel());
    },

    function(err, fromStats, toStats){
      if(err){
        return callback(err);
      }

      checkResult.from.path = from;
      checkResult.from.isFile = fromStats.isFile();
      checkResult.from.isDirectory = fromStats.isDirectory();

      checkResult.to.path = to;
      checkResult.to.isFile = toStats.isFile();
      checkResult.to.isDirectory = toStats.isDirectory();

      callback(null, checkResult);
    }
  );
}


/**
 * @param {String} from file path
 * @param {WriteableStream} toStream stream of destination file
 */
function goByFile(from, toStream, callback){
  var pattern = /\s*MSGS\.(\w*)\s*=\s*['"](.*)['"]/g;
  var m;
  var stream = LineStream.create(from, {bufferSize: 300});
  var findNumber = 0;
  var contentInFromFile = [];
  var lineBreak = '\n';
  var hasMessages = false;

  stream.on('data', function(line, isEnd) {
    var hint = false;
    while((m = pattern.exec(line)) !== null){
      findNumber++;
      hint = true;
      hasMessages = true;
      toStream.write(m[1] + '=' + m[2] + lineBreak, 'utf-8');
    }

    if(!hint){
      contentInFromFile.push(line);
    }
  });

  stream.on('end', function() { // emitted at the end of file

    if(findNumber !== 0){
      console.log('Find ' + clc.red(findNumber) + ' messages in ' +
          clc.cyan(from));
      //Write the content with messages cleared
      fs.writeFile(from, contentInFromFile.join(''), 'utf-8');
    }

    callback(null, findNumber);
  });

  stream.on('error', function(e) { // emitted when an error occurred
    throw e;
  });
}

exports.go = go;

process.on('uncaughtException', function(err){
  log.error(err.message);
});