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

        function drawInstrument(data) {
            var canvas = document.getElementById(instrumentConfiguration.id),
                context = canvas.getContext("2d"),
                centerY = canvas.height / 2,
                text = data.value;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = teamwall.configuration.background;
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.textBaseline = 'middle';

            var textWidth = (function me(fontSizes, min, max) {
                var index = Math.floor((min + max) / 2);
                context.font = fontSizes[index] + 'px Arial';
                var textWidth = context.measureText(text).width;
                if (min > max) {
                    return textWidth;
                }
                if (textWidth > canvas.width) {
                    return me(fontSizes, min, index - 1);
                } else {
                    return me(fontSizes, index + 1, max);
                }
            })(fontSizes, 0, fontSizes.length - 1);

            context.fillStyle = teamwall.configuration.colorText;
            context.fillText(text, (canvas.width - textWidth) / 2, centerY);
        }

    }

    return new TextAreaInstrument(configuration)
};