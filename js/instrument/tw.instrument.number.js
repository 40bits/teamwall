/*
 {
 "instrument":"number",
 "id":"violations",
 "title":"Code Violations",
 "url":"data/codeviolations.json",
 "threshold_value":"5",
 "decimal_places":"0",
 "higher_is_better":false,
 "unit":"#",
 "show_trend": true
 }
 */

teamwall.instrument.number = function (configuration) {

    function NumberInstrument(configuration) {

        var helpLines = false;
        var instrumentConfiguration = configuration;

        this.setValue = function (data) {
            var value = data.value;
            if (data.decimal_places && data.decimal_places > 0) {
                value = teamwall.math.round(data.value, 1);
            }
            drawInstrument(value, data.threshold_value, data.trend, data.date);
        };

        this.getConfiguration = function () {
            return instrumentConfiguration;
        };

        function drawInstrument(value, threshold, trend, date) {
            var canvas = document.getElementById(instrumentConfiguration.id);
            var context = canvas.getContext("2d");
            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = teamwall.configuration.background;
            context.fillRect(0, 0, canvas.width, canvas.height);

            teamwall.render.writeText(context, instrumentConfiguration.title, centerX, teamwall.render.yPointForDrawingHeading(canvas), teamwall.render.fontForHeader(canvas), teamwall.configuration.colorText);
            showThreshold(value, threshold, context, centerX, canvas);
            var valueToBeDisplayed = teamwall.math.round(value, instrumentConfiguration.decimal_places);
            teamwall.render.writeText(context, valueToBeDisplayed, centerX, centerY, getFontWithRightSize(canvas, context, valueToBeDisplayed), teamwall.configuration.colorText);
            showTrend(trend, context, canvas);
            if (helpLines) {
                drawHelpLines(canvas, context);
            }

            if (instrumentConfiguration.show_age && date != undefined) {
                teamwall.render.writeText(context, "5 h ago", centerX, teamwall.render.yPointForDrawing2ndHeading(canvas), teamwall.render.fontFor2ndHeader(canvas), teamwall.configuration.colorBackground);
            }

        }

        function showThreshold(value, threshold, context, centerX, canvas) {
            if (threshold) {
                instrumentConfiguration.threshold_value = threshold;
            }
            if (instrumentConfiguration.threshold_value != undefined) {
                var thresholdColor = teamwall.configuration.colorOk;
                var thresholdToActualDifference = teamwall.math.round(value - instrumentConfiguration.threshold_value, instrumentConfiguration.decimal_places);
                if ((value < instrumentConfiguration.threshold_value && instrumentConfiguration.higher_is_better) ||
                    (value > instrumentConfiguration.threshold_value && !instrumentConfiguration.higher_is_better)) {
                    thresholdColor = teamwall.configuration.colorFailure;
                }
                if (thresholdToActualDifference > 0) {
                    thresholdToActualDifference = "+" + thresholdToActualDifference;
                }

                context.fillStyle = thresholdColor;
                context.fillRect(0, 0.9 * canvas.height, canvas.width, 0.9 * canvas.height);
                teamwall.render.writeText(context, thresholdToActualDifference, centerX, teamwall.render.yPointForDrawingFooter(canvas), teamwall.render.fontForHeader(canvas), teamwall.configuration.colorText);
            }
        }

        function showTrend(trend, context, canvas) {
            if (instrumentConfiguration.show_trend) {
                var TREND_UP = "1";
                var TREND_DOWN = "-1";
                var TREND_SAME = "0";

                if (trend == TREND_UP) {
                    var color = instrumentConfiguration.higher_is_better ? teamwall.configuration.colorOk : teamwall.configuration.colorFailure;
                    drawTrendArrow(context, canvas, true, color);
                }
                if (trend == TREND_DOWN) {
                    var color = instrumentConfiguration.higher_is_better ? teamwall.configuration.colorFailure : teamwall.configuration.colorOk;
                    drawTrendArrow(context, canvas, false, color);
                }
                if (trend == TREND_SAME) {
                    drawTrendSame(context, canvas, teamwall.configuration.colorText);
                }
            }

        }

        function getFontWithRightSize(canvas, context, value) {
            var maxWidth = canvas.width * 0.8;
            var fontFactor = 0.6;
            var font = canvas.height * fontFactor + "pt " + teamwall.configuration.font;
            context.font = font;
            var dimension = context.measureText(value);

            while (dimension.width > maxWidth) {
                font = canvas.height * fontFactor + "pt " + teamwall.configuration.font;
                context.font = font;
                dimension = context.measureText(value);
                fontFactor = fontFactor - 0.1;
            }
            return font;
        }

        function drawHelpLines(canvas, context) {
            var height = canvas.height;
            var tenPercentHeight = height / 10;
            console.log("10 Percent Height : " + tenPercentHeight);
            context.moveTo(0, tenPercentHeight);
            context.lineTo(canvas.width, tenPercentHeight);

            context.moveTo(0, 2 * tenPercentHeight);
            context.lineTo(canvas.width, 2 * tenPercentHeight);

            context.moveTo(0, 9 * tenPercentHeight);
            context.lineTo(canvas.width, 9 * tenPercentHeight);

            context.moveTo(0.85 * canvas.width, 0);
            context.lineTo(0.85 * canvas.width, canvas.height);
            context.moveTo(0.15 * canvas.width, 0);
            context.lineTo(0.15 * canvas.width, canvas.height);

            context.lineWidth = 1;
            context.strokeStyle = "white";
            context.stroke();

        }

        function drawTrendSame(context, canvas, color) {

            var circleY = canvas.height / 2;
            var circleX = canvas.width * 0.92;

            var startPoint = (Math.PI / 180) * 0;
            var endPoint = (Math.PI / 180) * 360;
            context.beginPath();
            context.arc(circleX, circleY, canvas.width / 60, startPoint, endPoint, true);
            context.fillStyle = color;
            context.fill();
            context.closePath();
        }

        function drawTrendArrow(context, canvas, upArrow, color) {
            context.beginPath();

            //    B
            //   / \
            //  A---C

            var pointAC_YLine = canvas.height / 2,
                distanceToCenter = (canvas.height / 20);
            if (upArrow) {
                pointAC_YLine = pointAC_YLine - distanceToCenter;
            }
            else {
                pointAC_YLine = pointAC_YLine + distanceToCenter;
            }

            var pointA_X = canvas.width * 0.85,
                pointB_X = canvas.width * 0.90,
                pointC_X = canvas.width * 0.95,
                pointA_Y = pointAC_YLine,
                pointB_Y = pointAC_YLine + (canvas.height / 20);

            if (upArrow) {
                pointB_Y = pointAC_YLine - (canvas.height / 20);
            }
            var pointC_Y = pointAC_YLine;

            context.moveTo(pointA_X, pointA_Y);
            context.lineTo(pointB_X, pointB_Y);
            context.lineTo(pointC_X, pointC_Y);
            context.lineTo(pointA_X, pointA_Y);
            context.closePath();
            context.lineCap = "round";
            context.lineWidth = 1;
            context.strokeStyle = color;
            context.fillStyle = color;
            context.fill();
            context.stroke();

        }
    }

    return new NumberInstrument(configuration)
};
