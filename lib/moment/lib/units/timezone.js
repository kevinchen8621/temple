import { addFormatToken } from '../format/format';

// FORMATTING

addFormatToken('z',  0, 0, 'zoneAbbr');
addFormatToken('zz', 0, 0, 'zoneName');

// MOMENTS

exports.getZoneAbbr = getZoneAbbr 
function getZoneAbbr () {
    return this._isUTC ? 'UTC' : '';
}

exports.getZoneName = getZoneName 
function getZoneName () {
    return this._isUTC ? 'Coordinated Universal Time' : '';
}
