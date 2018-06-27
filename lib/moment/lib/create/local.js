import { createLocalOrUTC } from './from-anything';

exports.createLocal = createLocal 
function createLocal (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, false);
}
