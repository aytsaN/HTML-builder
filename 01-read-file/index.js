const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, '/text.txt');
const readStream = fs.createReadStream(dirPath, 'utf-8');

readStream.on('data', function(chunk) { 
  console.log(chunk);
});