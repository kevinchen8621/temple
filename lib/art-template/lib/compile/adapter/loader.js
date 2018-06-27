'use strict';
var fs = require('fs');

/**
 * 读取模板内容（同步方法）
 * @param   {string}    filename   模板名
 * @param   {?Object}   options
 * @return  {string}
 */
var loader = function loader(filename /*, options*/) {  
  return fs.readFile(filename, 'utf8');
};

module.exports = loader;