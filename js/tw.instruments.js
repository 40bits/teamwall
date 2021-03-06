teamwall.instruments.createInstrumentCanvases = function (instruments, layoutConfiguration) {
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
                $(canvas).css({
                    position: 'absolute',
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
};

teamwall.instruments.createInstruments = function (instrumentConfigurations) {
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
            case "issuecount" :
                instrument = teamwall.instrument.issueCount(instrumentConfiguration);
                break;
            case "gauge" :
                instrument = teamwall.instrument.gauge(instrumentConfiguration);
                break;
            case "linechart" :
                instrument = teamwall.instrument.lineChart(instrumentConfiguration);
                break;
            case "imagearea" :
                instrument = teamwall.instrument.imageArea(instrumentConfiguration);
                break;
            default:
                break;
        }
        if (instrument) {
            instruments.push(instrument);
        }
    });
    return instruments;
};

teamwall.instruments.updateInstruments = function () {
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
};
