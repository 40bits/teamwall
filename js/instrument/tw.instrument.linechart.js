teamwall.instrument.lineChart = function (configuration) {


    function LineChartInstrument(configuration) {

        var instrumentConfiguration = configuration;
        var fontYAxisHeight, fontXAxisHeight = undefined;


        this.setValue = function (data) {
            drawInstrument(data);
        };

        this.getConfiguration = function () {
            return instrumentConfiguration;
        };

        this.getInstrumentDrawType = function () {
            return "canvas";
        }


        function drawAxis(context, canvas) {
            context.beginPath();

            var spaceForHeading = canvas.height * 0.1;
            context.moveTo(fontXAxisHeight, spaceForHeading);
            context.lineTo(fontXAxisHeight, canvas.height - fontYAxisHeight);
            context.lineTo(canvas.width - spaceForHeading, canvas.height - fontYAxisHeight);

            context.lineCap = "round";
            context.lineWidth = 3;
            context.strokeStyle = "white";
            context.fillStyle = "white";
            context.stroke();


        }


        function drawDataLines(data, context, virtualXZero, virtualYZero, ySteps, xSteps) {
            data.charts.forEach(function (chart) {
                var counter = 0;
                context.beginPath();
                context.moveTo(virtualXZero, virtualYZero);
                chart.values.forEach(function (entry) {
                    var yPoint = virtualYZero - (entry * ySteps);
                    var xPoint = virtualXZero + (counter * xSteps);
                    context.lineTo(xPoint, yPoint);
                    counter++;
                });
                context.lineCap = "round";
                context.lineWidth = 2;
                context.strokeStyle = chart.color;
                context.stroke();
            });
        }

        function drawHelperYLines(lengthYAxis, highestValuesInGraph, data, context, virtualXZero, virtualYZero, lengthXAxis, canvas) {
            var oneUnitIsPixel = lengthYAxis / highestValuesInGraph;
            console.log("One Unit is " + oneUnitIsPixel + " Pixel");
            var yNumber = 0;
            for (var yValue = ((data.yscale) * oneUnitIsPixel); yValue < lengthYAxis; yValue = yValue + ((data.yscale) * oneUnitIsPixel)) {
                console.log("yValue : " + yValue);
                context.beginPath();
                context.moveTo(virtualXZero, virtualYZero - yValue);
                context.lineTo(virtualXZero + lengthXAxis, virtualYZero - yValue);
                context.lineCap = "round";
                context.lineWidth = 1;
                context.setLineDash([4, 20]);
                context.strokeStyle = "grey";
                context.stroke();

                yNumber = yNumber + data.yscale;
                teamwall.render.writeText(context, yNumber, virtualXZero - 20, virtualYZero - yValue, teamwall.render.fontFor2ndHeader(canvas), teamwall.configuration.colorText);
            }
            context.setLineDash([0]);
        }

        function drawInstrument(data) {
            var canvas = document.getElementById(instrumentConfiguration.id);
            var context = canvas.getContext("2d");
            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;
            var highestValuesInGraph = undefined, lowestValueInGraph = undefined;
            fontYAxisHeight = 50;
            fontXAxisHeight = 50;


            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = teamwall.configuration.instrumentBackground;
            context.fillRect(0, 0, canvas.width, canvas.height);
            teamwall.render.writeText(context, instrumentConfiguration.title, centerX, teamwall.render.yPointForDrawingHeading(canvas), teamwall.render.fontForHeader(canvas), teamwall.configuration.colorText);
            console.log("Number of values: " + data.labels.length)

            data.charts.forEach(function (chart) {
                chart.values.forEach(function (entry) {
                    if (entry > highestValuesInGraph || highestValuesInGraph == undefined) {
                        highestValuesInGraph = entry;
                    }
                    if (entry < lowestValueInGraph || lowestValueInGraph == undefined) {
                        lowestValueInGraph = entry;
                    }
                });
            });

            var lengthYAxis = canvas.height - 10 - fontYAxisHeight;
            var lengthXAxis = canvas.width - 10 - fontXAxisHeight;
            var ySteps = lengthYAxis / highestValuesInGraph;
            var xSteps = lengthXAxis / data.labels.length;
            var virtualYZero = canvas.height - fontYAxisHeight;
            var virtualXZero = fontYAxisHeight;

            console.log("Highest Value is " + highestValuesInGraph);
            console.log("Lowest Value is " + lowestValueInGraph);
            console.log("X-Axis is " + lengthXAxis + "pixel");
            console.log("Y-Axis is " + lengthYAxis + "pixel");
            console.log("ySteps is " + ySteps + "pixel");
            console.log("xSteps is " + xSteps + "pixel");
            console.log("Virtual X Zero is at " + virtualXZero);
            console.log("Virtual Y Zero is at " + virtualYZero);

            drawHelperYLines(lengthYAxis, highestValuesInGraph, data, context, virtualXZero, virtualYZero, lengthXAxis, canvas);

            var counter = 0;
            var labelCounter = 0;
            var yPoint = virtualYZero + 20;
            data.labels.forEach(function (label) {
                var xPoint = virtualXZero + (counter * xSteps);
                if (labelCounter >= data.labelsEvery || labelCounter == 0) {
                    teamwall.render.writeText(context, label, xPoint, yPoint, teamwall.render.fontFor2ndHeader(canvas), teamwall.configuration.colorText);
                    labelCounter = 0;
                }
                labelCounter++;
                counter++;
            });


            drawDataLines(data, context, virtualXZero, virtualYZero, ySteps, xSteps);
            drawAxis(context, canvas);

        }

    }

    return new LineChartInstrument(configuration)
};