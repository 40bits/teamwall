teamwall.math.round = function (value, decimalPlace) {
    if (decimalPlace == 0) {
        return value;
    }
    if (decimalPlace < 1 || decimalPlace > 14) {
        return false;
    }
    var e = Math.pow(10, decimalPlace);
    var k = (Math.round(value * e) / e).toString();
    if (k.indexOf('.') == -1) {
        k += '.';
    }
    k += e.toString().substring(1);
    return k.substring(0, k.indexOf('.') + decimalPlace + 1);
};