teamwall.ui.init = function init() {

    // show/hide config ui
    $(teamwall.configuration.cssSelectorConfigButton).click(function () {
        teamwall.app.configUiActive = !teamwall.app.configUiActive;
        $("." + teamwall.configuration.cssClassInstrument).draggable("option", "disabled", !teamwall.app.configUiActive);
        jQuery("." + teamwall.configuration.cssClassInstrument).toggleClass(teamwall.configuration.cssClassDraggable);
        $(teamwall.configuration.cssSelectorConfigUi).toggle();
        if (!teamwall.app.configUiActive) {
            $('.ui-state-disabled').removeClass('ui-state-disabled');
        }
    });

    // drop to trash
    $(teamwall.configuration.cssSelectorTrashCan).droppable({
        hoverClass: teamwall.configuration.cssClassAboutToBeDeleted,
        drop: function (event, ui) {
            deleteInstrument(ui.draggable.attr('id'));
        }});

    // delete instruments
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
            for (var count = 0; count < teamwall.app.canvases.length; count++) {
                if (jQuery(teamwall.app.canvases[count]).attr('id') == id) {
                    indexOfElement = count;
                }
            }
            if (indexOfElement > -1) {
                teamwall.app.canvases.splice(indexOfElement, 1);
            }
        }

        function deleteFromInstrumentArray() {
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

        deleteFromDom();
        deleteFromCanvasArray();
        deleteFromInstrumentArray();

    }

    // reload board from server
    $(teamwall.configuration.cssSelectorReloadDashboard).click(function () {
        window.location.reload();
    });

    // show dashboard config
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
    });


};