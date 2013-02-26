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
        };

        function drawInstrument(value) {
            var canvas = document.getElementById(instrumentConfiguration.id);
            var context = canvas.getContext("2d");

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = teamwall.configuration.instrumentBackground;
            context.fillRect(0, 0, canvas.width, canvas.height);

            var centerX = canvas.width / 2;
            var headerHeight = 0;
            var contentHeight = canvas.height;

            var failedBuilds = findFailedBuilds();
            if (instrumentConfiguration.title) {
                headerHeight = canvas.height * 0.1;
                contentHeight = canvas.height * 0.9;

                var buildAlertTitleWithCount = ((failedBuilds.builds.length > 0) ? failedBuilds.builds.length + " " : "No ") + instrumentConfiguration.title;
                var buildAlertTitle = (instrumentConfiguration.showCount == true) ? buildAlertTitleWithCount : instrumentConfiguration.title;
                teamwall.render.writeText(context, buildAlertTitle, centerX, teamwall.render.yPointForDrawingHeading(canvas), teamwall.render.fontForHeader(canvas), teamwall.configuration.colorText);
            }

            context.textBaseline = "middle";
            context.textAlign = "center";
            teamwall.render.perfectFont(context, failedBuilds.longestText, canvas.width * 0.9);

            var numberOfBuildChains = value.length;
            if (0 < numberOfBuildChains) {
                if (0 < failedBuilds.builds.length) {
                    context.fillStyle = teamwall.configuration.colorFailure;
                    context.fillRect(0, 0 + headerHeight, canvas.width, contentHeight);
                    context.fillStyle = teamwall.configuration.colorText;
                    var heightOfOneBlock = contentHeight / failedBuilds.builds.length;
                    var part = 0;
                    jQuery.each(failedBuilds.builds, function () {
                        var brokenBuildName = this;
                        context.fillText(brokenBuildName, centerX, part * heightOfOneBlock + (heightOfOneBlock / 2) + headerHeight, canvas.width); // * 0.9);
                        part++;
                    });

                    if (instrumentConfiguration.sounds) {
                        var now = new Date().getTime();
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
                    context.fillRect(0, 0 + headerHeight, canvas.width, contentHeight);
                    context.fillStyle = teamwall.configuration.colorText;
                    var allGoodText = "We're good";
                    if (instrumentConfiguration.noAlertText) {
                        allGoodText = instrumentConfiguration.noAlertText;
                    }
                    var centerY = contentHeight / 2;
                    context.fillText(allGoodText, centerX, centerY+ headerHeight, canvas.width * 0.9);
                }
            }
            else {
                console.log("Can not display BuildChain <= 0 ");
            }

            function findFailedBuilds() {
                var failedBuilds = {"longestText": "", builds: []};
                jQuery.each(value, function () {
                    var buildChain = this;
                    jQuery.each(buildChain.chain, function () {
                        var buildChainPart = this;
                        if (buildChainPart.status != "SUCCESS") {
                            var brokenBuildName = buildChain.name + " " + buildChainPart.name;
                            if (brokenBuildName.length > failedBuilds.longestText.length) {
                                failedBuilds.longestText = brokenBuildName;
                            }
                            failedBuilds.builds.push(brokenBuildName);
                        }
                    });
                });
                return failedBuilds;
            }
        }
    }

    return new BuildAlertInstrument(configuration)
};