sap.ui.define([
    "sap/ui/core/mvc/Controller",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("wizard.wizardui.controller.MyTaskUI", {
            onInit: async function () {
                debugger
                // var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");

                // var appPath = appId.replaceAll(".", "/");

                // var appModulePath = jQuery.sap.getModulePath(appPath);

                // await $.ajax({
                //     url: appModulePath + '/Northwind_Dest/odata/v4/my/VOB_Screen4',
                //     method: 'GET',
                //     success: function (response) {
                //         debugger
                //         console.log('Success:', response);
                //         // Handle successful response here
                //     },
                //     error: function (xhr, status, error) {
                //         debugger
                //         console.error('Error:', error);
                //         // Handle error here
                //     }
                // });
            }
        });
    });
