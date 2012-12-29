/*
 Template for an instrument

 - needs to be registered in js/tw.namespace.js under instrument to match the defined namespace here
 - to be used, needs to be added in teamwall.js
 - this.setValue and this.getConfiguration are required and will be called, without them this
   is most likely going to fail
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

        function drawInstrument(data) {
            // draw something
        }

    }

    return new TemplateInstrument(configuration)
};