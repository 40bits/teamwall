teamwall.ui.init = function init() {

    $(teamwall.configuration.cssSelectorConfigButton).click(showOrHideConfigGui());

    $(teamwall.configuration.cssSelectorSaveDashboard).click(saveDashboard());

    $(teamwall.configuration.cssSelectorReloadDashboard).click(reloadDashboardFromServer());

    $(teamwall.configuration.cssSelectorTrashCan).droppable({
        hoverClass: teamwall.configuration.cssClassAboutToBeDeleted,
        drop: function (event, ui) {
            deleteInstrument(ui.draggable.attr('id'));
        }});

    // do it

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


    function reloadDashboardFromServer() {
        window.location.reload();
    }

    function showOrHideConfigGui() {
        teamwall.app.configUiActive = !teamwall.app.configUiActive;
        $("." + teamwall.configuration.cssClassInstrument).draggable("option", "disabled", !teamwall.app.configUiActive);
        jQuery("." + teamwall.configuration.cssClassInstrument).toggleClass(teamwall.configuration.cssClassDraggable);
        $(teamwall.configuration.cssSelectorConfigUi).toggle();
        if (!teamwall.app.configUiActive) {
            $('.ui-state-disabled').removeClass('ui-state-disabled');
        }
    }

    function saveDashboard() {
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
    }

};