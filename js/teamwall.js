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
                        var canvas = document.createElement("canvas");
                        canvas.id = layout.id;
                        canvas.width = layout.width ? layout.width : DEFAULT_WIDTH;
                        canvas.height = layout.height ? layout.height : DEFAULT_HEIGHT;
                        $(canvas).css({
                            position: "absolute",
                            top: layout.top,
                            left: layout.left
                        });
                        $(canvas).addClass(teamwall.configuration.cssClassInstrument);
                        canvas.style.zIndex = 1;
                        canvases.push(canvas);
                    }
                }
            }
            return canvases;
        }
    };

    this.activateConfigUI = function activateConfigUI() {
        $(teamwall.configuration.domIdConfigButton).click(function () {
            teamwall.app.configUiActive = !teamwall.app.configUiActive;
            $("." + teamwall.configuration.cssClassInstrument).draggable("option", "disabled", !teamwall.app.configUiActive);
            jQuery("." + teamwall.configuration.cssClassInstrument).toggleClass(teamwall.configuration.cssClassDraggable);
            $(teamwall.configuration.cssClassConfigUi).toggle();
            if (!teamwall.app.configUiActive) {
                $('.ui-state-disabled').removeClass('ui-state-disabled');
            }
        });

        $(teamwall.configuration.cssSelectorTrashCan).droppable({
            hoverClass: teamwall.configuration.cssClassAboutToBeDeleted,
            drop: function (event, ui) {
                deleteInstrument(ui.draggable.attr('id'));
            }});

        $(teamwall.configuration.cssSelectorReloadDashboard).click(function () {
            window.location.reload();
        });

        $(teamwall.configuration.cssSelectorSaveDashboard).click(function () {
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

            $(teamwall.configuration.cssSelectorNewDashboardConfigDialog).text(JSON.stringify(teamwallConfiguration));

            $(teamwall.configuration.cssSelectorNewDashboardConfigDialog).dialog({
                modal: false,
                minWidth: 600,
                resizable: false,
                buttons: {
                    Close: function () {
                        $(this).dialog("close");
                    }
                }
            });
        })
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

    function deleteInstrument(id) {
        function deleteFromDom() {
            jQuery.each(teamwall.app.canvases, function () {
                if (jQuery(this).attr('id') == id) {
                    document.body.removeChild(this);
                }
            })
        }

        function deleteFromCanvasArray() {
            var indexOfElement = -1;
            for (var count = 0; count < teamwall.app.canvases.length ; count++) {
                if (jQuery(teamwall.app.canvases[count]).attr('id') == id) {
                    indexOfElement = count;
                }
            }
            if (indexOfElement > -1 ) {
                teamwall.app.canvases.splice(indexOfElement, 1);
            }
        }

        function deleteFromInstrumentArray() {
            var indexOfElement = -1;
            for (var count = 0; count < teamwall.app.instruments.length ; count++) {
                if (teamwall.app.instruments[count].getConfiguration().id == id) {
                    indexOfElement = count;
                }
            }
            if (indexOfElement > -1 ) {
                teamwall.app.instruments.splice(indexOfElement, 1);
            }
        }

        deleteFromDom();
        deleteFromCanvasArray();
        deleteFromInstrumentArray();

    }

    window.setInterval(updateInstruments, teamwall.configuration.instrumentUpdateInterval);

}
