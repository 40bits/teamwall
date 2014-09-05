teamwall.instrument.imageArea = function (configuration) {

    function ImageAreaInstrument(configuration) {

        var instrumentConfiguration = configuration;

        this.setValue = function (data) {
            drawInstrument(data);
        };

        this.getConfiguration = function () {
            return instrumentConfiguration;
        };

        this.getInstrumentDrawType = function () {
            return "img";
        }

        function drawInstrument(data) {
               var imgElement = document.getElementById(instrumentConfiguration.id);
               imgElement.src = instrumentConfiguration.image_url + "?" + new Date().getTime();;
        }

    }

    return new ImageAreaInstrument(configuration)
};
