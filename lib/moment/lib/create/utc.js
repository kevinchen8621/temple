import { createLocalOrUTC } from './from-anything';

exports.createUTC = createUTC 
function createUTC (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, true).utc();
}
