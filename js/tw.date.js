// from http://n8v.enteuxis.org/2010/12/parsing-iso-8601-dates-in-javascript/

teamwall.date.parseDate = function (dateString) {

    // parenthese matches:
    // year month day    hours minutes seconds
    // dotmilliseconds
    // tzstring plusminus hours minutes
    var re = /(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(\.\d+)?(Z|([+-])(\d\d)(\d\d))/;

    var date = [];
    date = dateString.match(re);

    // "2010-12-07T11:00:00.000-09:00" parses to:
    //  ["2010-12-07T11:00:00.000-09:00", "2010", "12", "07", "11",
    //     "00", "00", ".000", "-09:00", "-", "09", "00"]
    // "2010-12-07T11:00:00.000Z" parses to:
    //  ["2010-12-07T11:00:00.000Z",      "2010", "12", "07", "11",
    //     "00", "00", ".000", "Z", undefined, undefined, undefined]

    // 2012-07-24T09:44:41+0200

    if (!date) {
        throw "Couldn't parse date string '" + dateString + "'";
    }

    // parse strings, leading zeros into proper ints
    var a = [1, 2, 3, 4, 5, 6, 10, 11];
    for (var i in a) {
        date[a[i]] = parseInt(date[a[i]], 10);
    }
    date[7] = parseFloat(date[7]);

    // Date.UTC(year, month[, date[, hrs[, min[, sec[, ms]]]]])
    // note that month is 0-11, not 1-12
    // see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/UTC
    var ms = Date.UTC(date[1], date[2] - 1, date[3], date[4], date[5], date[6]);

    // if there are milliseconds, add them
    if (date[7] > 0) {
        ms += Math.round(date[7] * 1000);
    }

    // if there'dateString a timezone, calculate it
    if (date[8] != "Z" && date[10]) {
        var offset = date[10] * 60 * 60 * 1000;
        if (date[11]) {
            offset += date[11] * 60 * 1000;
        }
        if (date[9] == "-") {
            ms -= offset;
        }
        else {
            ms += offset;
        }
    }

    return new Date(ms);
};