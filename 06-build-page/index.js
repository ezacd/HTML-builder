const fs = require('fs').promises;
const path = require('path');

async function createHtml() {
  const projectDist = path.join(__dirname, 'project-dist');
  const projectDistHtml = path.join(projectDist, 'index.html');
  const htmlTemplate = path.join(__dirname, 'template.html');

  fs.mkdir(projectDist, { recursive: true });

  let html = await fs.readFile(htmlTemplate, 'utf-8');

  const regex = /\{([^{}]+)\}/g;
  const templates = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    templates.push(match[1]);
  }

  for (let template of templates) {
    html = html.replace(`{{${template}}}`, await replaceTemplate(template));
    await fs.writeFile(projectDistHtml, html);
  }
}

async function replaceTemplate(template) {
  try {
    const pathToTemplate = path.join(
      __dirname,
      'components',
      template + '.html',
    );
    const html = await fs.readFile(pathToTemplate, 'utf-8');
    return html;
  } catch (err) {
    return `{{${template}}}`;
  }
}

async function createCss() {
  const sourceDirPath = path.join(__dirname, 'styles');
  const destDirPath = path.join(__dirname, 'project-dist');
  const resCss = path.join(destDirPath, 'style.css');

  try {
    await fs.unlink(resCss);
    create(sourceDirPath, resCss);
  } catch (err) {
    create(sourceDirPath, resCss);
  }
}

async function create(sourceDirPath, resCss) {
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

async function copyDir(sourceDirPath, destDirPath) {
  try {
    await fs.mkdir(destDirPath, { recursive: true });

    const files = await fs.readdir(sourceDirPath, { withFileTypes: true });

    const filePromises = files.map(async (file) => {
      const sourceFilePath = path.join(sourceDirPath, file.name);
      const destinationFilePath = path.join(destDirPath, file.name);

      if (file.isDirectory()) {
        await copyDir(sourceFilePath, destinationFilePath);
      } else {
        await fs.copyFile(sourceFilePath, destinationFilePath);
      }
    });

    await Promise.all(filePromises);
  } catch (err) {
    console.error(err.message);
  }
}

function comp() {
  const sourceDirPath = path.join(__dirname, 'assets');
  const destDirPath = path.join(__dirname, 'project-dist', 'assets');

  copyDir(sourceDirPath, destDirPath);
  createHtml();
  createCss();
}

comp();
