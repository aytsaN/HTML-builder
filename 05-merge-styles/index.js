const { readdir, open, writeFile } = require('fs/promises')
const path = require('path')

const sourcePath = path.join(__dirname, '/styles')
const bundlePath = path.join(__dirname, '/project-dist/bundle.css')

const getFileContent = async (filePath) => {
  const fd = await open(filePath)
  const content = await fd.readFile('utf-8')
  await fd.close()
  return content + '\n'
}

const createBundle = async (scrDir, srcBundle) => {
  const contentDir = await readdir(scrDir, {withFileTypes: true})
  let bundleContent = ''

  for await (const file of contentDir) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const fileContent = await getFileContent(path.join(scrDir, file.name))
      bundleContent += fileContent
    }
  }
  await writeFile(srcBundle, bundleContent)
}

createBundle(sourcePath, bundlePath)