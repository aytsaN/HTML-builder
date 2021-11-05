const { readdir, stat } = require('fs/promises')
const path = require('path')
const secretFolderPath = path.join(__dirname, '/secret-folder')

readdir(secretFolderPath, {withFileTypes: true})
    .then(files => {
        for (let file of files) {
          if (file.isFile()) {
            stat(path.join(secretFolderPath, file.name))
            .then(data => {
              const fileExt = path.extname(file.name)
              const fileName = path.basename(file.name, fileExt)
              const fileSize = data.size
              
              console.log(`${fileName} - ${fileExt.slice(1)} - ${fileSize/1000}kb`)
            })
          } 
        }
    })
    .catch(err => {
        console.log(err)
    })