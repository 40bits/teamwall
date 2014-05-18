teamwall.app = {
    instruments: [], // all live instruments
    canvases: [], // canvases rendering the instruments
    configUiActive: false // is the dashboard in config mode
};

teamwall.app.deleteInstrument = function deleteInstrument(instrumentId) {


    function deleteFromCanvasArray(id) {
        var indexOfElement = -1;
        for (var count = 0; count < teamwall.app.canvases.length; count++) {
            if (jQuery(teamwall.app.canvases[count]).attr('id') == id) {
                indexOfElement = count;
            }
        }
        if (indexOfElement > -1) {
            teamwall.app.canvases.splice(indexOfElement, 1);
        }
    }

    function deleteFromInstrumentArray(id) {
        var indexOfElement = -1;
        for (var count = 0; count < teamwall.app.instruments.length; count++) {
            if (teamwall.app.instruments[count].getConfiguration().id == id) {
                indexOfElement = count;
            }
        }
        if (indexOfElement > -1) {
            teamwall.app.instruments.splice(indexOfElement, 1);
        }
    }

    deleteFromCanvasArray(instrumentId);
    deleteFromInstrumentArray(instrumentId);

};

teamwall.app.addInstrument = function addInstrument(id) {

    function addToCanvasArray(id) {

    }

    function addToInstrumentArray(id) {

    }

    addToCanvasArray(id);
    addToInstrumentArray(id);

}

teamwall.app.getConfiguration = function getConfiguration() {
    var layouts = [];
    jQuery.each(teamwall.app.canvases, function () {
        var canvas = this;
        var layout = {};
        layout.id = canvas.id;
        layout.top = canvas.offsetTop;
        layout.left = canvas.offsetLeft;
        layout.width = canvas.width;
        layout.height = canvas.height;
        layouts.push(layout);
    });

    var instrumentConfigurations = [];
    jQuery.each(teamwall.app.instruments, function () {
        instrumentConfigurations.push(this.getConfiguration())
    });

    var teamwallConfiguration = {};
    teamwallConfiguration.layouts = layouts;
    teamwallConfiguration.instruments = instrumentConfigurations;

    return JSON.stringify(teamwallConfiguration);

};