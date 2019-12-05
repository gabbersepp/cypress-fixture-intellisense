var ncp = require('ncp').ncp;
 
ncp("./src/test/test-files/", "./out/test/test-files", function (err) {
 if (err) {
   return console.error(err);
 }
 console.log('done!');
});