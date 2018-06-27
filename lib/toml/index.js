const fs = require('fs')
const parser = require('./parser');
const compiler = require('./compiler');

module.exports = {
  parse: (input) => {
    let nodes = parser.parse(input.toString());
    return compiler.compile(nodes);
  },
  parseFile: (fname) => {
    let str = fs.readTextFile(fname)
    str = checkBOM(str)
    let nodes = parser.parse(str);
    return compiler.compile(nodes);
  }
};

//如果用windows自带的文本编辑器编辑过文件，就会自动添加上BOM头，很难发现零宽字符\ufeff ，去掉BOM头 
function checkBOM(str){
  return str.charCodeAt(0) === 0xFEFF ? str.slice(1) : str
}