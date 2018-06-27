import { Moment } from './constructor';

exports.clone = clone 
function clone () {
    return new Moment(this);
}
