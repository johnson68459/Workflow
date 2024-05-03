sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "wizard/wizardui/model/models",
  ],
  function (UIComponent, Device, models) {
    "use strict";

    return UIComponent.extend(
      "wizard.wizardui.Component",
      {
        metadata: {
          manifest: "json",
        },

        /**
        * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
        * @public
        * @override
        */
        init: function () {
          debugger
          // call the base component's init function
          UIComponent.prototype.init.apply(this, arguments);

          // enable routing
          this.getRouter().initialize();

          // set the device model
          this.setModel(models.createDeviceModel(), "device");

          this.setTaskModels();

          const rejectOutcomeId = "reject";
          this.getInboxAPI().addAction(
            {
              action: rejectOutcomeId,
              label: "Reject",
              type: "reject",
            },
            function () {
              debugger
              this.getModel("context").setSizeLimit(10000);
              this.getModel("context").setProperty("/action_status", '1');
              this.completeTask(false, rejectOutcomeId);
            },
            this
          );
          const approveOutcomeId = "approve";
          this.getInboxAPI().addAction(
            {
              action: approveOutcomeId,
              label: "Approve",
              type: "accept",
            },
            function () {
              debugger
              this.getModel("context").setSizeLimit(10000);

              // this.getModel("context").setProperty("/yoy_lineitem", '"3"');
              this.getModel("context").setProperty("/action_status", '3');

              // Get a reference to your model
              var oModel = this.getModel("context");

              // Retrieve the data from the model
              var oData = oModel.getData();

              // Check if the "raw_data" object exists
              if (oData && oData.raw_data) {
                // Remove the "raw_data" object from the data
                delete oData.raw_data;

                // Set the modified data back to the model
                oModel.setData(oData);
              } else {
                // "raw_data" object not found or already removed
                console.log("The 'raw_data' object does not exist in the model or has already been removed.");
              }


              this.completeTask(true, approveOutcomeId);
            },
            this
          );
        },

        setTaskModels: function () {
          // set the task model
          var startupParameters = this.getComponentData().startupParameters;
          this.setModel(startupParameters.taskModel, "task");

          // set the task context model
          var taskContextModel = new sap.ui.model.json.JSONModel(
            this._getTaskInstancesBaseURL() + "/context"
          );
          this.setModel(taskContextModel, "context");
          this.getModel("context").setSizeLimit(10000);
        },

        _getTaskInstancesBaseURL: function () {
          return (
            this._getWorkflowRuntimeBaseURL() +
            "/task-instances/" +
            this.getTaskInstanceID()
          );
        },

        _getWorkflowRuntimeBaseURL: function () {
          var ui5CloudService = this.getManifestEntry("/sap.cloud/service").replaceAll(".", "");
          var ui5ApplicationName = this.getManifestEntry("/sap.app/id").replaceAll(".", "");
          var appPath = `${ui5CloudService}.${ui5ApplicationName}`;
          return `/${appPath}/api/public/workflow/rest/v1`

        },

        getTaskInstanceID: function () {
          return this.getModel("task").getData().InstanceID;
        },

        getInboxAPI: function () {
          var startupParameters = this.getComponentData().startupParameters;
          return startupParameters.inboxAPI;
        },

        completeTask: function (approvalStatus, outcomeId) {
          this.getModel("context").setProperty("/approved", approvalStatus);
          this._patchTaskInstance(outcomeId);
        },

        _patchTaskInstance: function (outcomeId) {
          const context = this.getModel("context").getData();
          var data = {
            status: "COMPLETED",
            context: { ...context, comment: context.comment || '' },
            decision: outcomeId
          };

          jQuery.ajax({
            url: `${this._getTaskInstancesBaseURL()}`,
            method: "PATCH",
            contentType: "application/json",
            async: true,
            data: JSON.stringify(data),
            headers: {
              "X-CSRF-Token": this._fetchToken(),
            },
          }).done(() => {
            this._refreshTaskList();
          })
        },

        _fetchToken: function () {
          var fetchedToken;

          jQuery.ajax({
            url: this._getWorkflowRuntimeBaseURL() + "/xsrf-token",
            method: "GET",
            async: false,
            headers: {
              "X-CSRF-Token": "Fetch",
            },
            success(result, xhr, data) {
              fetchedToken = data.getResponseHeader("X-CSRF-Token");
            },
          });
          return fetchedToken;
        },

        _refreshTaskList: function () {
          this.getInboxAPI().updateTask("NA", this.getTaskInstanceID());
        },
      }
    );
  }
);
