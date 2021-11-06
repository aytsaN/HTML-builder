const { copyFile, mkdir, rmdir, readdir } = require('fs/promises')
const path = require('path')

const sourcePath = path.join(__dirname, '/files')
const destinationPath = path.join(__dirname, '/files-copy')

const createDir = async function(path) {
  await rmdir(path, { recursive: true })
  await mkdir(path)
}

const copyDir = async function (srcDir, destDir) {
  try {
    await createDir(destDir)

    const contentDir = await readdir(srcDir, {withFileTypes: true})

    contentDir.forEach(async el => {
      const srcElPath = path.join(srcDir, el.name)
      const destElPath = path.join(destDir, el.name)

      await el.isDirectory() ?
        copyDir(srcElPath, destElPath) :
        copyFile(srcElPath, destElPath)
    })
  } catch(err) {
    console.error(err);
  }
}

copyDir(sourcePath, destinationPath)
