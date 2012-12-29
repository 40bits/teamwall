/*
 {
 "instrument":"buildchain",
 "id":"buildchain",
 "url":"data/buildchain.json"
 }
 */
teamwall.instrument.buildChain = function (configuration) {


    function BuildChainInstrument(configuration) {

        var instrumentConfiguration = configuration;

        this.getConfiguration = function () {
            return instrumentConfiguration;
        };

        this.setValue = function (newValue) {
            drawInstrument(newValue);
        };

        function drawInstrument(value) {

            var canvas = document.getElementById(instrumentConfiguration.id);
            var context = canvas.getContext("2d");
            context.font = teamwall.render.fontForHeader(canvas);
            context.textBaseline = "middle";
            context.textAlign = "center";

            context.clearRect(0, 0, canvas.width, canvas.height);

            var lengthOfBuildChain = value.length;
            if (lengthOfBuildChain > 0) {
                var heightOfOneBlock = canvas.height / lengthOfBuildChain;
                var part = 0;
                jQuery.each(value, function () {
                    var buildChainPart = this;
                    if ("SUCCESS" == buildChainPart.status) {
                        context.fillStyle = teamwall.configuration.colorOk;
                    }
                    else {
                        context.fillStyle = teamwall.configuration.colorFailure;
                    }
                    context.fillRect(0, part * heightOfOneBlock, canvas.width, heightOfOneBlock);
                    context.fillStyle = teamwall.configuration.colorText;
                    context.fillText(buildChainPart.name, canvas.width / 2, part * heightOfOneBlock + (heightOfOneBlock / 2), canvas.width);
                    part++;

                });

            }
            else {
                console.log("Can not display BuildChain <=0 ");
            }
        }
    }

    return new BuildChainInstrument(configuration)
};