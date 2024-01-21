const fs = require('fs').promises;
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

async function processFiles() {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    console.log('Current directory filenames:');

    const filePromises = files.map(async (file) => {
      if (file.isFile()) {
        const fileName = file.name.split('.')[0];
        const ext = path.extname(file.name).split('.')[1];
        const stats = await fs.stat(path.join(dirPath, file.name));
        const size = stats.size;

        console.log(`${fileName} - ${ext} - ${size}`);
      }
    });

    await Promise.all(filePromises);
  } catch (err) {
    console.error(err.message);
  }
}

processFiles();
