const { copyFile, mkdir, rmdir, readdir, readFile, writeFile, lstat } = require('fs/promises')
const path = require('path')

const projectDirPath = path.join(__dirname, '/project-dist')
const templatePath = path.join(__dirname, '/template.html') 
const srcComponentsDirPath = path.join(__dirname, '/components') 
const srcStyleDirPath = path.join(__dirname, '/styles') 
const srcAssetDirPath = path.join(__dirname, '/assets')

const getFileContent = async (filePath) => {
  const stat = await lstat(filePath)
  if(!stat.isFile()) return
  return await readFile(filePath, 'utf-8', err => {if (err) console.log(err)})
}

const buildFromTemplate = async (templatePath, componentsDirPath, destPath) => {
  let template = await getFileContent(templatePath)
  const re = /{{([^}]+)}}/g
  while (templateTagObj = re.exec(template)) {
    const templateTag = templateTagObj[0]
    const componentName = templateTagObj[1]
    const component = await getFileContent(path.join(componentsDirPath, `${componentName}.html`))
    template = template.replace(templateTag, component)
  }
  await writeFile(destPath, template)
}

const createBundle = async (scrDirPath, destBundlePath) => {
  const contentDir = await readdir(scrDirPath, {withFileTypes: true})
  let bundleContent = ''

  for await (const file of contentDir) {
    if (path.extname(file.name) === '.css') {
      const fileContent = await getFileContent(path.join(scrDirPath, file.name))
      bundleContent += `${fileContent}\n`
    }
  }
  await writeFile(destBundlePath, bundleContent)
}

const copyDir = async function (srcDir, destDir) {
  try {
    await mkdir(destDir)

    const contentDir = await readdir(srcDir, {withFileTypes: true})

    contentDir.forEach(async el => {
      const srcElPath = path.join(srcDir, el.name)
      const destElPath = path.join(destDir, el.name)

      await el.isDirectory() ?
        copyDir(srcElPath, destElPath) :
        copyFile(srcElPath, destElPath)
    })
  } catch(err) {
    console.info(err);
  }
}

const buildPage = async (templatePath, componentsDirPath, styleDirPath, assetDirPath, destDirPath) => {
  await rmdir(destDirPath, { recursive: true })
  await mkdir(destDirPath)

  const destHtmlPath = path.join(destDirPath, 'index.html')
  await buildFromTemplate(templatePath, componentsDirPath, destHtmlPath)

  const destCssPath = path.join(destDirPath, 'style.css')
  await createBundle(styleDirPath, destCssPath)

  const destAssetDirPath = path.join(destDirPath, 'assets')
  await copyDir(assetDirPath, destAssetDirPath)
}


buildPage(templatePath, srcComponentsDirPath, srcStyleDirPath, srcAssetDirPath, projectDirPath)