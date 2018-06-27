module.exports = isDate 

function isDate(input) {
    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
}
