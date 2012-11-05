teamwall.instrument.percent = function (configuration) {

    var instrumentConfiguration = configuration;

    this.setValue = function (data) {
        var roundedValue = teamwall.math.round(data.value, 1);
        drawInstrument(roundedValue);
    };

    this.getConfiguration = function () {
        return instrumentConfiguration;
    };

    function drawInstrument(value) {
    }

}