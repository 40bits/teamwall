function TeamwallApp() {

    this.loadDashboard = function loadDashboard(dashboardConfigurationFile) {

        $.ajax({
            url: dashboardConfigurationFile,
            dataType: 'json',
            cache: false,
            success: function configureDashboard(config) {
                teamwall.app.instruments = createInstruments(config.instruments);
                teamwall.app.canvases = createInstrumentCanvases(teamwall.app.instruments, config.layouts);
                drawCanvases(teamwall.app.canvases);
                makeItDraggable();

            },
            statusCode: {
                404: error404
            }
        });

        function drawCanvases(canvases) {
            jQuery.each(canvases, function () {
                document.body.appendChild(this);
            })
        }

        function error404() {
            alert("Please add a " + dashboardConfigurationFile + " file to the installation.");
        }

        function createInstruments(instrumentConfigurations) {
            var instruments = [];
            jQuery.each(instrumentConfigurations, function () {
                var instrument;
                var instrumentConfiguration = this;

                switch (instrumentConfiguration.instrument) {
                    case "percent" :
                        instrument = teamwall.instrument.percent(instrumentConfiguration);
                        break;
                    case "buildchain" :
                        instrument = teamwall.instrument.buildChain(instrumentConfiguration);
                        break;
                    case "number" :
                        instrument = teamwall.instrument.number(instrumentConfiguration);
                        break;
                    case "buildalert" :
                        instrument = teamwall.instrument.buildAlert(instrumentConfiguration);
                        break;
                    case "textarea" :
                        instrument = teamwall.instrument.textArea(instrumentConfiguration);
                        break;
                    default:
                        break;
                }
                if (instrument) {
                    instruments.push(instrument);
                }
            });
            return instruments;
        }

        function createInstrumentCanvases(instruments, layoutConfiguration) {
            var DEFAULT_WIDTH = 300;
            var DEFAULT_HEIGHT = 300;
            var canvases = [];

            for (var i = 0; i < instruments.length; i++) {
                var instrument = instruments[i];
                for (var j = 0; j < layoutConfiguration.length; j++) {
                    var layout = layoutConfiguration[j];
                    if (layout.id == instrument.getConfiguration().id) {
                        var typeToDraw = instrument.getInstrumentDrawType();
                        var canvas = document.createElement(typeToDraw);
                        canvas.id = layout.id;
                        canvas.width = layout.width ? layout.width : DEFAULT_WIDTH;
                        canvas.height = layout.height ? layout.height : DEFAULT_HEIGHT;
                        var position = typeToDraw == 'canvas' ? 'absolute' : 'relative';
                        $(canvas).css({
                            position: position,
                            top: layout.top,
                            left: layout.left,
                            width: canvas.width,
                            height: canvas.height
                        });
                        $(canvas).addClass(teamwall.configuration.cssClassInstrument);
                        canvas.style.zIndex = 1;
                        canvases.push(canvas);
                    }
                }
            }
            return canvases;
        }

        function makeItDraggable() {
            $("." + teamwall.configuration.cssClassInstrument).draggable({
                grid: [ 10, 10 ],
                disabled: true,
                start: startDragging,
                stop: stopDragging
            });

            function stopDragging() {
                var canvas = this;
                canvas.style.zIndex = 1;
            }

            function startDragging() {
                var canvas = this;
                canvas.style.zIndex = 10;
            }
        }

    };

    function updateInstruments() {
        jQuery.each(teamwall.app.instruments, function () {
            var instrument = this;
            $.ajax({
                url: instrument.getConfiguration().url,
                dataType: 'json',
                cache: false,
                success: updateInstrumentValue
            });

            function updateInstrumentValue(data) {
                instrument.setValue(data);
            }
        });
    }

    window.setInterval(updateInstruments, teamwall.configuration.instrumentUpdateInterval);

}
