import { isValid as _isValid } from '../create/valid';
import extend from '../utils/extend';
import getParsingFlags from '../create/parsing-flags';

exports.isValid = isValid 
function isValid () {
    return _isValid(this);
}

exports.parsingFlags = parsingFlags 
function parsingFlags () {
    return extend({}, getParsingFlags(this));
}

exports.invalidAt = invalidAt 
function invalidAt () {
    return getParsingFlags(this).overflow;
}
