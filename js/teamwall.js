function TeamwallApp() {

    this.loadDashboard = function loadDashboard(dashboardConfigurationFile) {

        $.ajax({
            url: dashboardConfigurationFile,
            dataType: 'json',
            cache: false,
            success: function configureDashboard(config) {
                teamwall.app.instruments = teamwall.instruments.createInstruments(config.instruments);
                teamwall.app.canvases = teamwall.instruments.createInstrumentCanvases(teamwall.app.instruments, config.layouts);
                teamwall.render.drawCanvases(teamwall.app.canvases);
                makeItDraggable();
                teamwall.instruments.updateInstruments();
            },
            statusCode: {
                404: error404
            }
        });

        function error404() {
            alert("Please add a " + dashboardConfigurationFile + " file to the installation.");
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

    window.setInterval(teamwall.instruments.updateInstruments, teamwall.configuration.instrumentUpdateInterval);
}
