export var defaultOrdinal = '%d';
export var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

exports.ordinal = ordinal 
function ordinal (number) {
    return this._ordinal.replace('%d', number);
}

