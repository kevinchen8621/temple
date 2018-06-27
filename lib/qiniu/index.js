
module.exports = {
  'qiniu/create': create
}

function qiniu(options) {
  if (!options || !options.accessKey || !options.secretKey || !options.bucket) {
    throw new TypeError("must have accessKey,secretKey,bucket");
  }
  this.options = options;
}

function create(options) {
  return new qiniu(options);
};

['/upload.js', '/download.js'].map(function (name) {
  var proto = require('.' + name);
  for (var k in proto) {
    qiniu.prototype[k] = proto[k];
  }
});

