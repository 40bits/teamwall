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

        this.getInstrumentDrawType = function () {
            return "canvas";
        }

        function drawInstrument(value) {

            var canvas = document.getElementById(instrumentConfiguration.id);
            var context = canvas.getContext("2d");
            context.font = teamwall.render.fontForHeader(canvas);
            context.textBaseline = "middle";
            context.textAlign = "center";

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = teamwall.configuration.instrumentBackground;
            context.fillRect(0, 0, canvas.width, canvas.height);

            var headingOffSet = canvas.height,
                buildChainStartOffSet = 0;

            if (instrumentConfiguration.title) {
                teamwall.render.writeText(context, instrumentConfiguration.title, canvas.width/2, teamwall.render.yPointForDrawingHeading(canvas), teamwall.render.fontForHeader(canvas), teamwall.configuration.colorText);
                headingOffSet = canvas.height * 0.9;
                buildChainStartOffSet = canvas.height * 0.1;
            }

            var lengthOfBuildChain = value.length;
            if (lengthOfBuildChain > 0) {

                var heightOfOneBlock = headingOffSet / lengthOfBuildChain;
                var part = 0;
                jQuery.each(value, function () {
                    var buildChainPart = this;
                    if ("SUCCESS" == buildChainPart.status) {
                        context.fillStyle = teamwall.configuration.colorOk;
                    }
                    else {
                        context.fillStyle = teamwall.configuration.colorFailure;
                    }
                    context.fillRect(0, (part * heightOfOneBlock) + buildChainStartOffSet, canvas.width, heightOfOneBlock);
                    context.fillStyle = teamwall.configuration.colorText;
                    context.fillText(buildChainPart.name, canvas.width / 2, part * heightOfOneBlock + (heightOfOneBlock / 2) + buildChainStartOffSet, canvas.width);
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