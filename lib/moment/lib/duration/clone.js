import { createDuration } from './create';

exports.clone = clone 
function clone () {
    return createDuration(this);
}

