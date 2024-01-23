const fs = require('fs').promises;
const path = require('path');

async function createFile() {
  const sourceDirPath = path.join(__dirname, 'styles');
  const destDirPath = path.join(__dirname, 'project-dist');
  const resCss = path.join(destDirPath, 'bundle.css');

  await fs.rm(resCss, { recursive: true, force: true });

  try {
    const files = await fs.readdir(sourceDirPath, { withFileTypes: true });

    await Promise.all(
      files.map(async (file) => {
        if (path.extname(file.name).split('.')[1] === 'css') {
          const sourceFilePath = path.join(sourceDirPath, file.name);
          const data = await fs.readFile(sourceFilePath, 'utf-8');
          await fs.writeFile(resCss, data, { flag: 'a' });
        }
      }),
    );
  } catch (err) {
    console.error(err.message);
  }
}

createFile();
