/*
 Template for an instrument

 - needs to be registered in js/tw.namespace.js under instrument to match the defined namespace here
 - to be used, needs to be added in teamwall.js
 - this.setValue and this.getConfiguration are required and will be called, without them this
 is most likely going to fail
 - add the new instrument to the javascript imports into index.html
 - have fun
 */

teamwall.instrument.template = function (configuration) {

    function TemplateInstrument(configuration) {

        var instrumentConfiguration = configuration;

        // required
        this.setValue = function (data) {
            drawInstrument(data);
        };

        // required
        this.getConfiguration = function () {
            return instrumentConfiguration;
        };

        // required
        this.getInstrumentDrawType = function () {
            return "canvas";
        }

        function drawInstrument(data) {
            var canvas = document.getElementById(instrumentConfiguration.id);
            var context = canvas.getContext("2d");
            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = teamwall.configuration.instrumentBackground;
            context.fillRect(0, 0, canvas.width, canvas.height);

            // and now do something
        }

    }

    return new TemplateInstrument(configuration)
};