const { stdout, stdin } = process;
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

stdout.write('Write text:\n');

stdin.on('data', (data) => {
  const input = data.toString();
  if (input.trim() === 'exit') {
    stdout.write('Exit, bye');
    process.exit();
  }
  fs.appendFile(filePath, input, (error) => {
    if (error) console.error(error.message);
  });
});

process.on('SIGINT', () => {
  stdout.write('\nExit, bye');
  process.exit();
});
