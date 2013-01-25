/*
 {
 "instrument":"buildalert",
 "id":"buildalert",
 "url":"data/buildalert.json"
 }
 */
teamwall.instrument.buildAlert = function (configuration) {

    function BuildAlertInstrument(configuration) {

        var instrumentConfiguration = configuration;
        var lastTimeAlertSoundWasPlayed = 0;
        var lastBuildChainStatus = "SUCCESS";

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
            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;

            context.clearRect(0, 0, canvas.width, canvas.height);
            var failedBuilds = [];

            var numberOfBuildChains = value.length;
            if (0 < numberOfBuildChains) {
                jQuery.each(value, function () {
                    var buildChain = this;
                    jQuery.each(buildChain.chain, function () {
                        var buildChainPart = this;
                        if (buildChainPart.status != "SUCCESS") {
                            failedBuilds.push({"chain": buildChain, "part": buildChainPart});
                        }
                    });

                });
                teamwall.render.writeText(context, "Builds", centerX, teamwall.render.yPointForDrawingHeading(canvas), teamwall.render.fontForHeader(canvas), teamwall.configuration.colorText);

                if (0 < failedBuilds.length) {
                    context.fillStyle = teamwall.configuration.colorFailure;
                    context.fillRect(0, 0, canvas.width, canvas.height);
                    context.fillStyle = teamwall.configuration.colorText;
                    var heightOfOneBlock = canvas.height / failedBuilds.length;
                    var part = 0;
                    jQuery.each(failedBuilds, function () {
                        var failedBuild = this;
                        context.fillText(failedBuild.chain.name + " " + failedBuild.part.name, centerX, part * heightOfOneBlock + (heightOfOneBlock / 2), canvas.width);
                        part++;
                    });

                    if (instrumentConfiguration.sounds) {
                        var now = new Date().getTime()
                        if (now > lastTimeAlertSoundWasPlayed + instrumentConfiguration.sounds.failureInterval * 1000) {
                            var sound = new Audio(instrumentConfiguration.sounds.failureSound);
                            sound.play();
                            lastTimeAlertSoundWasPlayed = now;
                        }
                    }

                    lastBuildChainStatus = "FAILURE";

                }
                else {
                    if (lastBuildChainStatus == "FAILURE") {
                        lastBuildChainStatus = "SUCCESS";
                        if (instrumentConfiguration.sounds && instrumentConfiguration.sounds.successSound) {
                            var sound = new Audio(instrumentConfiguration.sounds.successSound);
                            sound.play();
                        }
                    }

                    context.fillStyle = teamwall.configuration.colorOk;
                    context.fillRect(0, 0, canvas.width, canvas.height);
                    context.fillStyle = teamwall.configuration.colorText;
                    var allGoodText = "We're good";
                    if (instrumentConfiguration.noAlertText) {
                        allGoodText = instrumentConfiguration.noAlertText;
                    }
                    context.fillText(allGoodText, centerX, centerY, canvas.width);
                }
            }
            else {
                console.log("Can not display BuildChain <=0 ");
            }
        }
    }

    return new BuildAlertInstrument(configuration)
};