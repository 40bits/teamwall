function TeamwallApp() {

    var instruments = [];

    this.loadDashboard = function (dashboardFile) {

        $.ajax({
            url: dashboardFile,
            dataType: 'json',
            cache: false,
            success: configureDashboard,
            statusCode: {
                404: error404
            }
        });

        function error404() {
            alert("Please add a " + dashboardFile + " file to the installation.");
        }

        function configureDashboard(data) {

            function createInstruments() {
                jQuery.each(data.instruments, function () {
                    var instrument;
                    var instrumentConfig = this;

                    switch (instrumentConfig.instrument) {
                        case "percent" :
                            instrument = teamwall.instrument.percent(instrumentConfig);
                            break;
                        case "buildchain" :
                            instrument = teamwall.instrument.buildChain(instrumentConfig);
                            break;
                        case "number" :
                            instrument = teamwall.instrument.number(instrumentConfig);
                            break;
                        case "buildalert" :
                            instrument = teamwall.instrument.buildAlert(instrumentConfig);
                            break;
                        default:
                            break;
                    }
                    instruments.push(instrument);
                });
            }

            function positionInstruments() {
                for (var i = 0; i < instruments.length; i++) {
                    var instrument = instruments[i];
                    for (var j = 0; j < data.layouts.length; j++) {
                        var layout = data.layouts[j];
                        if (layout.id == instrument.getConfiguration().id) {
                            var canvas = document.createElement("canvas");
                            canvas.id = layout.id;
                            canvas.width = layout.width;
                            canvas.height = layout.height;
                            document.body.appendChild(canvas);
                            $(canvas).css({
                                position: "absolute",
                                top: layout.top,
                                left: layout.left
                            }).appendTo('body');
                        }
                    }
                }
            }

            createInstruments();
            positionInstruments();
        }

        window.setInterval(updateInstruments, 1000);
    };

    function updateInstruments() {
        jQuery.each(instruments, function () {
            var instrument = this;
            $.ajax({
                url: instrument.getConfiguration().url,
                dataType: 'json',
                cache: false,
                success: function (data) {
                    instrument.setValue(data);
                }
            });
        });
    }
}
