const template = require('./lib/index')
const extension = require('./lib/extension')
const moment = require('../moment')
const path = require('path')

template.extension = extension

template.defaults.imports.dateFormat = (date, format) => {
  return moment(date).format(format)
}

module.exports = template