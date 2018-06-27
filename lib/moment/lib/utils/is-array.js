module.exports = isArray 

function isArray(input) {
    return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
}
