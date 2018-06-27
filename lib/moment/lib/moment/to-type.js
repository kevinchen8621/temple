exports.valueOf = valueOf 
function valueOf () {
    return this._d.valueOf() - ((this._offset || 0) * 60000);
}

exports.unix = unix 
function unix () {
    return Math.floor(this.valueOf() / 1000);
}

exports.toDate = toDate 
function toDate () {
    return new Date(this.valueOf());
}

exports.toArray = toArray 
function toArray () {
    var m = this;
    return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
}

exports.toObject = toObject 
function toObject () {
    var m = this;
    return {
        years: m.year(),
        months: m.month(),
        date: m.date(),
        hours: m.hours(),
        minutes: m.minutes(),
        seconds: m.seconds(),
        milliseconds: m.milliseconds()
    };
}

exports.toJSON = toJSON 
function toJSON () {
    // new Date(NaN).toJSON() === null
    return this.isValid() ? this.toISOString() : null;
}
