const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
  const sourceDirPath = path.join(__dirname, 'files');
  const destDirPath = path.join(__dirname, 'files-copy');

  try {
    await fs.mkdir(destDirPath, { recursive: true });

    const files = await fs.readdir(sourceDirPath, { withFileTypes: true });

    const filePromises = files.map(async (file) => {
      const sourceFilePath = path.join(sourceDirPath, file.name);
      const destinationFilePath = path.join(destDirPath, file.name);

      await fs.copyFile(sourceFilePath, destinationFilePath);
    });

    await Promise.all(filePromises);
  } catch (err) {
    console.error(err.message);
  }
}

copyDir();
