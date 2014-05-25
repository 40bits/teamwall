teamwall.instrument.lineChart = function (configuration) {

    function LineChartInstrument(configuration) {

        var instrumentConfiguration = configuration;

        this.setValue = function (data) {
            drawInstrument(data);
        };

        this.getConfiguration = function () {
            return instrumentConfiguration;
        };

        this.getInstrumentDrawType = function () {
            return "canvas";
        }

        function drawInstrument(data) {
            var canvas = document.getElementById(instrumentConfiguration.id);
            var context = canvas.getContext("2d");
            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;
            var highestValuesInGraph, lowestValueInGraph = undefined;


            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = teamwall.configuration.instrumentBackground;
            context.fillRect(0, 0, canvas.width, canvas.height);
            teamwall.render.writeText(context, instrumentConfiguration.title, centerX, teamwall.render.yPointForDrawingHeading(canvas), teamwall.render.fontForHeader(canvas), teamwall.configuration.colorText);

            context.beginPath();

            fontYAxisHeight = 50;
            fontXAxisHeight = 50;

            var spaceForHeading = canvas.height * 0.1;
            context.moveTo(fontXAxisHeight, spaceForHeading);
            context.lineTo(fontXAxisHeight, canvas.height - fontYAxisHeight);
            context.lineTo(canvas.width - spaceForHeading, canvas.height - fontYAxisHeight);

            context.lineCap = "round";
            context.lineWidth = 1;
            context.strokeStyle = "white";
            context.fillStyle = "white";
            context.stroke();

            console.log("Number of values: " + data.values.length)

            data.values.forEach(function (entry) {
                if (entry > highestValuesInGraph || highestValuesInGraph == undefined) {
                    highestValuesInGraph = entry;
                }
                if (entry < lowestValueInGraph || lowestValueInGraph == undefined) {
                    lowestValueInGraph = entry;
                }
            });

            var lengthYAxis = canvas.height - 10 - fontYAxisHeight;
            var lengthXAxis = canvas.width - 10 - fontXAxisHeight;
            var ySteps = Math.floor(lengthYAxis / highestValuesInGraph);
            var xSteps = Math.floor(lengthXAxis / data.values.length);
            var virtualYZero = canvas.height - fontYAxisHeight;
            ;
            var virtualXZero = fontYAxisHeight;

            console.log("Highest Value is " + highestValuesInGraph);
            console.log("Lowest Value is " + lowestValueInGraph);
            console.log("X-Axis is " + lengthXAxis + "pixel");
            console.log("Y-Axis is " + lengthYAxis + "pixel");
            console.log("ySteps is " + ySteps + "pixel");
            console.log("xSteps is " + xSteps + "pixel");
            console.log("Virtual X Zero is at " + virtualXZero)
            console.log("Virtual Y Zero is at " + virtualYZero)


            context.beginPath();
            context.moveTo(virtualXZero, virtualYZero);
            var counter = 0;
            data.values.forEach(function (entry) {
                var yPoint = virtualYZero - (entry * ySteps);
                var xPoint = virtualXZero + (counter * xSteps);
                context.lineTo(xPoint, yPoint);
                counter++;
                console.log("Line to X: " + xPoint + "Y:" + yPoint+" Value "+entry);


            });

            context.lineCap = "round";
            context.lineWidth = 1;
            context.strokeStyle = "white";
            context.fillStyle = "white";
            context.stroke();


        }

    }

    return new LineChartInstrument(configuration)
};