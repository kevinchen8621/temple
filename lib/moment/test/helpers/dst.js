import moment from '../../moment';

exports.isNearSpringDST = isNearSpringDST 
function isNearSpringDST() {
    return moment().subtract(1, 'day').utcOffset() !== moment().add(1, 'day').utcOffset();
}
