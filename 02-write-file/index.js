const fs = require('fs');
const { stdin: input, stdout: output } = require('process');
const readline = require('readline');
const path = require('path');
const dirPath = path.join(__dirname, '/text.txt');

const writeStream = fs.createWriteStream(dirPath, { encoding: 'utf8' });

const rl = readline.createInterface({ input, output });

const exit = () => {
  output.write('----- EXIT -----');
  writeStream.end();
  rl.close();
}

output.write('----- Please enter your text. To close, enter "exit" or press Ctrl+C -----\n');

rl.on('line', (input) => {
  if (input.trim() === 'exit') {
    exit();
  } else {
    writeStream.write(`${input}\n`);
  }
});

rl.on('SIGINT', () => {
  exit();
});