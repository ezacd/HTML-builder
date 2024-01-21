const fs = require('fs');
const path = require('path');

const data = fs.ReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

data.on('data', (data) => {
  console.log(data);
});
