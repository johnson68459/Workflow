sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "wizard/wizardui/model/models",
  ],
  function (UIComponent, Device, models) {
    "use strict";
    // var mainServiceUrl = `https://2890861ctrial-dev-mahindravob-srv.cfapps.us10-001.hana.ondemand.com`;
    var mainServiceUrl = `https://3ebeb48ctrial-dev-mahindra-srv.cfapps.us10-001.hana.ondemand.com`;
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
            async function () {//Reject call
              debugger
              var vobid = this.getModel("context").getData().vobid;
              var usersdata;
              //getting current level
              var currlevel = this.getModel("context").getData().currlevel;

              var commentsData = this.getModel("device").getData().commentsval;
              if (commentsData) {


                var commentKeyValue;
                commentsData = JSON.parse(commentsData);

                var entry = [];
                for (var key in commentsData) {
                  if (key == 'approvalflow' || key == 'app_rej_by' || key == 'filesData') {
                    console.log("Not added to comments table", key);
                    continue;
                  }
                  commentKeyValue = `${key} : ${commentsData[key]}`;
                  entry.push({
                    id: `${vobid}`,
                    comment: `${commentKeyValue}`,
                    createdBy: `${commentsData["app_rej_by"]}`

                  })
                  console.log("Entry for Comment:", entry);

                }
                var settings = {
                  "url": `${mainServiceUrl}/odata/v4/my/comment?$filter=id eq ${vobid}`,
                  "method": "GET"
                };
                var previouscomment = [];

                await $.ajax(settings).done(function (response) {
                  console.log(response);
                  previouscomment = response.value;

                });

                var finalcommetns = previouscomment.concat(entry);

                if (entry.length) {
                  var commentPatchBody = {
                    "IsActiveEntity": true,
                    "vob_comments": finalcommetns
                  }
                  console.log("Inside comment insert statement");

                  await $.ajax({
                    url: `${mainServiceUrl}/odata/v4/my/VOB_Screen4(id=${vobid},IsActiveEntity=true)`,
                    method: 'PATCH',
                    contentType: 'application/json',
                    data: JSON.stringify(commentPatchBody),
                    success: function (response) {
                      debugger
                      // oData = response.value[0]
                      console.log('Success:', response);
                      // Handle successful response here
                    },
                    error: function (xhr, status, error) {
                      debugger
                      console.error('Error:', error);
                      // Handle error here
                    }
                  });
                  // await INSERT.into(comment).entries(entry);
                  entry = [];
                  console.log("Comment insert statement is completed");
                }
              }

              await $.ajax({
                url: `${mainServiceUrl}/odata/v4/my/workflowfun(vob_id='${vobid}',level='${currlevel}',app_rej_by='${new sap.ushell.services.UserInfo().getEmail()}',status='Rejected')`,
                method: 'GET',
                success: function (response) {
                  debugger
                  usersdata = response.value;

                  // Handle successful response here
                },
                error: function (xhr, status, error) {
                  debugger
                  console.error('Error:', error);
                  // Handle error here
                }
              });

              var decrementedlevel = `${(parseFloat(currlevel) - 1).toFixed(1)}`;
              if (usersdata == 'No level') {
                this.getModel("context").setProperty("/levelvalue", "None");
                this.getModel("context").setProperty("/nextusers", "");
              }
              else {
                this.getModel("context").setProperty("/levelvalue", decrementedlevel);

                this.getModel("context").setProperty("/nextusers", usersdata);
              }



              this.getModel("context").setSizeLimit(10000);
              // this.getModel("context").setProperty("/action_status", '1');
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
            async function () {//onApprove
              debugger
              var vobid = this.getModel("context").getData().vobid;
              var usersdata;
              //getting current level
              var currlevel = this.getModel("context").getData().currlevel;

              var commentsData = this.getModel("device").getData().commentsval;
              if (commentsData) {


                var commentKeyValue;
                commentsData = JSON.parse(commentsData);

                var entry = [];
                for (var key in commentsData) {
                  if (key == 'approvalflow' || key == 'app_rej_by' || key == 'filesData') {
                    console.log("Not added to comments table", key);
                    continue;
                  }
                  commentKeyValue = `${key} : ${commentsData[key]}`;
                  entry.push({
                    id: `${vobid}`,
                    comment: `${commentKeyValue}`,
                    createdBy: `${commentsData["app_rej_by"]}`

                  })
                  console.log("Entry for Comment:", entry);

                }
                var settings = {
                  "url": `${mainServiceUrl}/odata/v4/my/comment?$filter=id eq ${vobid}`,
                  "method": "GET"
                };
                var previouscomment = [];

                await $.ajax(settings).done(function (response) {
                  console.log(response);
                  previouscomment = response.value;

                });

                var finalcommetns = previouscomment.concat(entry);

                if (entry.length) {
                  var commentPatchBody = {
                    "IsActiveEntity": true,
                    "vob_comments": finalcommetns
                  }
                  console.log("Inside comment insert statement");

                  await $.ajax({
                    url: `${mainServiceUrl}/odata/v4/my/VOB_Screen4(id=${vobid},IsActiveEntity=true)`,
                    method: 'PATCH',
                    contentType: 'application/json',
                    data: JSON.stringify(commentPatchBody),
                    success: function (response) {
                      debugger
                      // oData = response.value[0]
                      console.log('Success:', response);
                      // Handle successful response here
                    },
                    error: function (xhr, status, error) {
                      debugger
                      console.error('Error:', error);
                      // Handle error here
                    }
                  });
                  // await INSERT.into(comment).entries(entry);
                  entry = [];
                  console.log("Comment insert statement is completed");
                }
              }

              var approvallineitem = this.getModel("device").getData().yoy_lineitem;
              if (approvallineitem) {
                debugger
                var settings = {
                  "url": `${mainServiceUrl}/odata/v4/my/lineItemApproval(yoyitem=${approvallineitem})`,
                  "method": "GET"
                };


                await $.ajax(settings)
                  .done(function (response) {
                    debugger
                    console.log(response);
                  })
                  .fail(function (jqXHR, textStatus, errorThrown) {
                    debugger
                    console.error("Error:", textStatus, errorThrown);
                    // Handle the error here
                  });


              }

              this.getModel("context").setSizeLimit(10000);

              var incrementedlevel = `${(parseFloat(currlevel) + 1).toFixed(1)}`;

              //making an workflow approve call 

              await $.ajax({
                url: `${mainServiceUrl}/odata/v4/my/workflowfun(vob_id='${vobid}',level='${currlevel}',app_rej_by='${new sap.ushell.services.UserInfo().getEmail()}',status='Approved')`,
                method: 'GET',
                success: function (response) {
                  debugger
                  console.log('Success:', response);
                  usersdata = response.value;
                  // Handle successful response here
                },
                error: function (xhr, status, error) {
                  debugger
                  console.error('Error:', error);
                  // Handle error here
                }
              });

              // console.log(dfsdfds);

              if (usersdata == 'No level') {
                this.getModel("context").setProperty("/levelvalue", "None");
                this.getModel("context").setProperty("/nextusers", "");
              }
              else {
                this.getModel("context").setProperty("/levelvalue", incrementedlevel);

                this.getModel("context").setProperty("/nextusers", usersdata);
              }

              //updating to next level it is approved
              // this.getModel("context").setProperty("/action_status", '3');
              // this.getModel("context").setProperty("/levelvalue", incrementedlevel);

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
