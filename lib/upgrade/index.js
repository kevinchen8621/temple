const fs = require('fs')
const path = require('path')
const json = require('json')

const rootDir = path.resolve(__dirname, '..', '..')

class Upgrade {
  constructor (username, projectName) {
    this.projectName = projectName
  }

  checkVersion () {
    const self = this
    const localPackage = this.localfile('package.json', true)
    const remotePackage = this.remotefile('package.json', true)
    if (remotePackage.version > localPackage.version) {
      remotePackage.manifest.forEach((item) => {
        if (item.version > localPackage.version) {
          self.download(item.file)
        }
      })
    }
  }

  download (file) {
    if (Array.isArray(file)) {
      file.each((item) => this.download(item))
    } else {
      fs.stat()
    }
    const content = rawfile('package.json')
  }


  localfile (filepath, isJson) {
    const content = fs.readTextFile(path.join(rootDir, filepath))
    return isJson ? json.decode(content) : content
  }

  remotefile (filepath, isJson) {
    const url = `https://raw.githubusercontent.com/${this.username}/${this.projectName}/master/${filepath}?r=${Math.random()}`
    const res = http.get(url)
    const buf = res.readAll()
    const content = buf.toString()
    return isJson ? json.decode(content) : content
  }

}

function 


module.exports = { rawfile }