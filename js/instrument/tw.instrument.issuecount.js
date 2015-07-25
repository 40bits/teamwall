teamwall.instrument.issueCount = function (configuration) {


    function IssueCountInstrument(configuration) {

        var instrumentConfiguration = configuration;

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
            context.font = teamwall.render.fontForHeader(canvas);
            context.textBaseline = "middle";
            context.textAlign = "center";

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = teamwall.configuration.instrumentBackground;
            context.fillRect(0, 0, canvas.width, canvas.height);

            var headerHeight = 0;
            var contentHeight = canvas.height;
            if (instrumentConfiguration.title) {
                headerHeight = canvas.height * 0.1;
                contentHeight = canvas.height * 0.9;

                var totalIssueCount = 0;
                jQuery.each(value.issueCountsOrderedByPrio, function () {
                    totalIssueCount += this;
                });

                teamwall.render.writeText(context, totalIssueCount + " " + instrumentConfiguration.title, canvas.width/2, teamwall.render.yPointForDrawingHeading(canvas), teamwall.render.fontForHeader(canvas), teamwall.configuration.colorText);
            }

            var issueCounts = value.issueCountsOrderedByPrio.length;
            if (issueCounts > 0) {
                var heightOfOneBlock = contentHeight / issueCounts;
                jQuery.each(value.issueCountsOrderedByPrio, function (index) {
                    var issueCount = this;
                    if (issueCount > 0) {
                        context.fillStyle = instrumentConfiguration.priorityColors[index];
                    }
                    else {
                        context.fillStyle = teamwall.configuration.colorOk;
                    }
                    context.fillRect(0, (index * heightOfOneBlock) + headerHeight, canvas.width, heightOfOneBlock);
                    context.fillStyle = teamwall.configuration.colorText;
                    context.font = teamwall.render.font(canvas, 25);
                    context.fillText(issueCount, canvas.width / 2, index * heightOfOneBlock + (heightOfOneBlock / 2) + headerHeight, canvas.width);
                });

            }
            else {
                console.log("Can not display IssueCount");
            }
        }
    }

    return new IssueCountInstrument(configuration)
};