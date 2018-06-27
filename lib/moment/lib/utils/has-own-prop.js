module.exports = hasOwnProp 

function hasOwnProp(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
}
