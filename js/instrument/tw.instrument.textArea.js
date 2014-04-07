teamwall.instrument.textArea = function (configuration) {

    function TextAreaInstrument(configuration) {

        var instrumentConfiguration = configuration,
            fontSizes = [];

        for (var i = 1; i <= 500; i += 5) {
            fontSizes.push(i);
        }

        this.setValue = function (data) {
            drawInstrument(data);
        };

        this.getConfiguration = function () {
            return instrumentConfiguration;
        };

        this.getInstrumentDrawType = function () {
            return "div";
        }

        function drawInstrument(data) {
            var divElement = document.getElementById(instrumentConfiguration.id),
                text = data.value;

            $(divElement).text(text);
            $(divElement).css({
                'font-size': instrumentConfiguration.fontSize
            });
            if (instrumentConfiguration.color) {
                $(divElement).css({
                    'color': instrumentConfiguration.color
                });
            }
            if (instrumentConfiguration.backgroundColor) {
                $(divElement).css({
                    'backgroundColor': instrumentConfiguration.backgroundColor
                });
            }
        }
    }

    return new TextAreaInstrument(configuration)
};