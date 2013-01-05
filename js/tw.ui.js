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

        deleteFromDom();
        teamwall.app.deleteInstrument(id);
    }

    // reload board from server
    $(teamwall.configuration.cssSelectorReloadDashboard).click(function () {
        window.location.reload();
    });

    // show dashboard config
    $(teamwall.configuration.cssSelectorSaveDashboard).click(function () {
        $(teamwall.configuration.cssSelectorNewDashboardConfigDialog).text(teamwall.app.getConfiguration());
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