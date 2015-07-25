/*
 {
 "instrument":"percent",
 "id":"codecoverage",
 "title":"Code Coverage",
 "url":"data/codecoverage.json",
 "threshold_value":"80",
 "higher_is_better": true,
 "show_trend":true
 }
 */

teamwall.instrument.percent = function (configuration) {

    function PercentInstrument(configuration) {

        var instrumentConfiguration = configuration;
        var currentValue = 0;
        var animation_loop, targetValue, targetData;

        this.setValue = function (data) {
            targetValue = teamwall.math.round(data.value, 1);

            var difference = targetValue - currentValue;
            if (typeof animation_loop != undefined) clearInterval(animation_loop);
            targetData = data;
            animation_loop = window.setInterval(animateTo, 1000 / Math.abs(difference));
        };

        this.getInstrumentDrawType = function () {
            return "canvas";
        };

        this.getConfiguration = function () {
            return instrumentConfiguration;
        };


        function animateTo() {
            var paintValue = currentValue;
            if (Math.floor(currentValue) == Math.floor(targetValue)) {
                clearInterval(animation_loop);
                drawInstrument(targetValue, targetData.threshold_value, targetData.trend);
            } else {

                if (currentValue < targetValue)
                    paintValue++;
                if (currentValue > targetValue)
                    paintValue--;

                drawInstrument(paintValue, targetData.threshold_value, targetData.trend);
            }
        }

        function drawInstrument(value, threshold, trend) {
            var canvas = document.getElementById(instrumentConfiguration.id),
                context = canvas.getContext("2d"),
                centerX = canvas.width / 2,
                centerY = canvas.height / 2,
                masterScaleFactor = canvas.width;
            if (canvas.width > canvas.height) {
                masterScaleFactor = canvas.height;
            }
            var radius = masterScaleFactor / 3.2;
            var lineWidth = masterScaleFactor / 9;

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = teamwall.configuration.instrumentBackground;
            context.fillRect(0, 0, canvas.width, canvas.height);

            if (threshold) {
                instrumentConfiguration.threshold_value = threshold;
            }

            var degree360 = 2 * Math.PI;
            var oneDegree = degree360 / 360;
            var zeroPercentAngle = degree360 - 90 * oneDegree;
            var valueEndAngle = (degree360 / 100 * value) - 90 * oneDegree;
            var valueColor = defineValueColor(value);

            drawThresholdMarker(lineWidth, centerX, centerY, radius, context, value);

            drawArcClockwise(context, centerX, centerY, radius, 0, degree360, teamwall.configuration.colorBackground, lineWidth);
            drawArcClockwise(context, centerX, centerY, radius, zeroPercentAngle, valueEndAngle, valueColor, lineWidth * 0.8);
            if (!instrumentConfiguration.higher_is_better) {
                drawArcCounterClockwise(context, centerX, centerY, radius, zeroPercentAngle, valueEndAngle, teamwall.configuration.colorOk, lineWidth * 0.8);
            }

            teamwall.render.writeText(context, teamwall.math.round(value, 1), centerX, centerY, teamwall.render.font(canvas, 13), teamwall.configuration.colorText);
            teamwall.render.writeText(context, "%", canvas.width * 0.72, canvas.height * 0.47, teamwall.render.font(canvas, 4), teamwall.configuration.colorText);
            teamwall.render.writeText(context, instrumentConfiguration.title, centerX, teamwall.render.yPointForDrawingHeading(canvas), teamwall.render.fontForHeader(canvas), teamwall.configuration.colorText);
            drawTrend(context, canvas, trend);
            currentValue = value;
        }

        function defineValueColor(value) {
            var valueColor = teamwall.configuration.colorOk;
            if (instrumentConfiguration.higher_is_better) {
                if (value < instrumentConfiguration.threshold_value) {
                    valueColor = teamwall.configuration.colorFailure;
                }
            }
            else {
                if (value > instrumentConfiguration.threshold_value) {
                    valueColor = teamwall.configuration.colorFailure;
                }
                else {
                    valueColor = teamwall.configuration.colorWarning;
                }
            }
            return valueColor;
        }

        function drawTrend(context, canvas, trend) {
            if (instrumentConfiguration.show_trend) {
                var TREND_UP = "1",
                    TREND_DOWN = "-1";

                if (trend == TREND_UP) {
                    var color = instrumentConfiguration.higher_is_better ? teamwall.configuration.colorOk : teamwall.configuration.colorFailure;
                    drawTrendArrow(context, canvas, true, color);
                }
                if (trend == TREND_DOWN) {
                    var color = instrumentConfiguration.higher_is_better ? teamwall.configuration.colorFailure : teamwall.configuration.colorOk;
                    drawTrendArrow(context, canvas, false, color);
                }
            }

        }

        function drawTrendArrow(context, canvas, upArrow, color) {
            //    B
            //   / \
            //  A---C

            var pointB_X = canvas.width / 2,
                pointA_X = canvas.width / 2 - (canvas.width / 25),
                pointC_X = canvas.width / 2 + (canvas.width / 25),
                pointB_Y, pointA_Y , pointC_Y,
                arrowBaseLine_Y, arrowPeak_Y;

            if (upArrow) {
                arrowBaseLine_Y = 0.35 * canvas.height;
                arrowPeak_Y = 0.30 * canvas.height;
            } else {
                arrowBaseLine_Y = 0.65 * canvas.height;
                arrowPeak_Y = 0.7 * canvas.height;
            }

            pointB_Y = arrowPeak_Y;
            pointA_Y = arrowBaseLine_Y;
            pointC_Y = arrowBaseLine_Y;

            context.beginPath();
            context.moveTo(pointA_X, pointA_Y);
            context.lineTo(pointB_X, pointB_Y);
            context.lineTo(pointC_X, pointC_Y);
            context.lineTo(pointA_X, pointA_Y);
            context.closePath();
            context.lineWidth = 1;
            context.strokeStyle = color;
            context.fillStyle = color;
            context.fill();
            context.stroke();

        }

        function drawThresholdMarker(lineWidth, centerX, centerY, radius, context, value) {
            var valueColor = teamwall.configuration.colorBackground,
                degree360 = 2 * Math.PI,
                oneDegree = degree360 / 360,
                thresholdAngle = (degree360 / 100 * instrumentConfiguration.threshold_value) - 90 * oneDegree,
                thresholdLineLength = (lineWidth * 0.4),
                thresholdOutsideX = centerX + (radius + thresholdLineLength * 2) * Math.cos(thresholdAngle),
                thresholdOutsideY = centerY + (radius + thresholdLineLength * 2) * Math.sin(thresholdAngle),
                thresholdInsideX = centerX + (radius - thresholdLineLength * 2) * Math.cos(thresholdAngle),
                thresholdInsideY = centerY + (radius - thresholdLineLength * 2) * Math.sin(thresholdAngle);
            context.beginPath();
            context.moveTo(thresholdOutsideX, thresholdOutsideY);
            context.lineTo(thresholdInsideX, thresholdInsideY);
            context.strokeStyle = valueColor;
            context.lineWidth = lineWidth / 10;
            context.stroke();
            context.closePath();
        }

        function drawArcClockwise(context, x, y, radius, startAngle, endAngle, color, lineWidth) {
            drawArc(context, x, y, radius, startAngle, endAngle, color, lineWidth, false)
        }

        function drawArcCounterClockwise(context, x, y, radius, startAngle, endAngle, color, lineWidth) {
            drawArc(context, x, y, radius, startAngle, endAngle, color, lineWidth, true)
        }

        function drawArc(context, x, y, radius, startAngle, endAngle, color, lineWidth, counterClockwise) {
            context.beginPath();
            context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
            context.lineWidth = lineWidth;
            context.strokeStyle = color;
            context.stroke();
            context.closePath();
        }

    }

    return new PercentInstrument(configuration)
};