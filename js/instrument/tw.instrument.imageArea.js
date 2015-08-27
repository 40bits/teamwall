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
        };

        function drawInstrument(data) {
            var imgElement = document.getElementById(instrumentConfiguration.id);
            imgElement.src = data.image_url + "?" + Date.now();
        }

    }

    return new ImageAreaInstrument(configuration)
};
