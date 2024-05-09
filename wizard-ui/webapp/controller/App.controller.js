sap.ui.define(
  [
    "sap/ui/core/mvc/Controller"
  ],
  function (BaseController) {
    "use strict";
    var commentsval = {
      "approvalflow": "true"
    };
    var yoyLineItem = {};
    var files = {};
    var oData;
    // var mainServiceUrl = "https://2890861ctrial-dev-mahindravob-srv.cfapps.us10-001.hana.ondemand.com";
    var mainServiceUrl = `https://3ebeb48ctrial-dev-mahindra-srv.cfapps.us10-001.hana.ondemand.com`;
    return BaseController.extend("wizard.wizardui.controller.App", {
      async onInit() {

        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
          if (!oData) {
            var vobid = this.getOwnerComponent().oModels.context.oData.vobid
            await $.ajax({
              url: `${mainServiceUrl}/odata/v4/my/VOB_Screen4?$filter=id eq ${vobid}&$expand=vob_yoy_scr4,vob_suplier4($expand=*),vob_comments,vob_files,vob_to_Workflow_History`,
              method: 'GET',
              success: function (response) {
                debugger
                oData = response.value[0]
                console.log('Success:', response);
                // Handle successful response here
              },
              error: function (xhr, status, error) {
                debugger
                console.error('Error:', error);
                // Handle error here
              }
            });


            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(oData);
            this.getView().setModel(oModel, "oCapData");
            this.byId("uploadSet").setMode("None");
            // this.byId("uploadSet").setUploadButtonInvisible(true);

          }
        } catch (error) {
          console.log("ERROR:", error)
        }

      },
      onBeforeRendering: async function (oEvent) {
        debugger
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
          if (!this.getView().getModel("oCapData")) {
            var vobid = this.getOwnerComponent().oModels.context.oData.vobid
            await $.ajax({
              url: `${mainServiceUrl}/odata/v4/my/VOB_Screen4?$filter=id eq ${vobid}&$expand=vob_yoy_scr4,vob_suplier4($expand=*),vob_comments,vob_files,vob_to_Workflow_History`,
              method: 'GET',
              success: function (response) {
                debugger
                oData = response.value[0]
                console.log('Success:', response);
                // Handle successful response here
              },
              error: function (xhr, status, error) {
                debugger
                console.error('Error:', error);
                // Handle error here
              }
            });


            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(oData);
            this.getView().setModel(oModel, "oCapData");
            this.byId("uploadSet").setMode("None");
            // this.byId("uploadSet").setUploadButtonInvisible(true);

          }

          const vob_yoy_scr4 = oData.vob_yoy_scr4;
          var vob_suplier4 = oData.vob_suplier4;

          var mainHBox = this.byId("righthbox");
          mainHBox.destroyItems();

          const labelArray = [
            "Total Landed Investment - Settled (Rs. lacs)",
            "Total Business value (Rs. Lac) 1st 12months",
            "Amount to be paid to M/s RKR (Lac) 1st 12 months",
            "Amount to be paid to M/s RKR (Lac) 2nd + 3rd Year",
            "YOY Reduction for 3 yrs (After SOP + 1 year)",
            "FX Base Rate",
            "Finished Weight of Part / System (kg)",
            "DTB Packaging Cost Rs",
            "Inco Terms",
            "Payment Terms",
            "Transport Cost",
            "Tooling / Dies / Moulds / Fixtures",
            "Inspection Gauges",
            "Testing / Validation",
            "Engg Fees",
            "Proto Tooling",
            "Logistics Trollies",
            "Total Landed Investment Settled"
          ];

          // Define getSupplierDetailsByKey function outside of the loop
          var getSupplierDetailsByKey = function (key, potential_suplier_scr4_to_supplierdetails) {
            for (const supplier of potential_suplier_scr4_to_supplierdetails) {
              if (supplier.value_key === key) {
                return supplier.value; // Found the supplier details
              }
            }
            return null; // Supplier details not found for the given key
          };

          for (let i = 0; i < vob_suplier4.length; i++) {
            var rightVbox = new sap.m.VBox().addStyleClass("rightVBox");
            rightVbox.addItem(new sap.m.Label({ text: vob_suplier4[i].suplier, design: "Bold" }));

            var potential_suplier_scr4_to_supplierdetails = vob_suplier4[i]?.potential_suplier_scr4_to_supplierdetails ?? '';

            var tablevbox = new sap.m.VBox().addStyleClass("tablevbox");;
            for (let k = 0; k < vob_yoy_scr4.length; k++) {
              var keyToSearch = vob_yoy_scr4[k].id;
              var supplierDetails;
              if (potential_suplier_scr4_to_supplierdetails) {
                supplierDetails = getSupplierDetailsByKey(keyToSearch, potential_suplier_scr4_to_supplierdetails);
              }


              if (supplierDetails) {
                console.log("Supplier details found:", supplierDetails);
                tablevbox.addItem(new sap.m.Text({ text: supplierDetails }));
              } else {
                console.log("Supplier details not found for key:", keyToSearch);
                tablevbox.addItem(new sap.m.Text({ text: "" }));
              }
            }

            var aftertablevbox = new sap.m.VBox().addStyleClass("aftertablevbox");;
            for (let j = 0; j < labelArray.length; j++) {
              var keyToSearch = labelArray[j];
              var supplierDetails;
              if (potential_suplier_scr4_to_supplierdetails) {
                supplierDetails = getSupplierDetailsByKey(keyToSearch, potential_suplier_scr4_to_supplierdetails);
              }
              if (supplierDetails) {
                console.log("Supplier details found:", supplierDetails);
                aftertablevbox.addItem(new sap.m.Text({ text: supplierDetails }));
              } else {
                console.log("Supplier details not found for key:", keyToSearch);
                aftertablevbox.addItem(new sap.m.Text({ text: "" }));//test
              }
            }
            rightVbox.addItem(tablevbox);
            rightVbox.addItem(aftertablevbox);


            mainHBox.addItem(rightVbox);
          }


        } catch (error) {
          console.log("ERROR:", error)
        }
      },
      onAfterRendering: async function (oEvent) {
        debugger
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {


          if (!this.getView().getModel("oCapData")) {
            var vobid = this.getOwnerComponent().oModels.context.oData.vobid
            await $.ajax({
              url: `${mainServiceUrl}/odata/v4/my/VOB_Screen4?$filter=id eq ${vobid}&$expand=vob_yoy_scr4,vob_suplier4($expand=*),vob_comments,vob_files,vob_to_Workflow_History`,
              method: 'GET',
              success: function (response) {
                debugger
                oData = response.value[0]
                console.log('Success:', response);
                // Handle successful response here
              },
              error: function (xhr, status, error) {
                debugger
                console.error('Error:', error);
                // Handle error here
              }
            });


            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(oData);
            this.getView().setModel(oModel, "oCapData");
            this.byId("uploadSet").setMode("None");
            // this.byId("uploadSet").setUploadButtonInvisible(true);

          }

          var workflowhistoryarray = oData.vob_to_Workflow_History;
          var vBox = this.byId("v1");
          vBox.destroyItems();
          var groupedData = {};
          vBox.addStyleClass("scrollvbox");

          workflowhistoryarray.sort(function (a, b) {
            var levelA = parseFloat(a.level);
            var levelB = parseFloat(b.level);

            if (levelA < levelB) {
              return -1;
            } else if (levelA > levelB) {
              return 1;
            } else {
              return 0;
            }
          });

          //grouping based on level
          workflowhistoryarray.forEach(function (item) {
            if (!groupedData[item.level]) {
              groupedData[item.level] = [];
            }
            groupedData[item.level].push(item);
          });


          Object.keys(groupedData).forEach(function (level) {
            var levelData = groupedData[level];

            // Create a VBox for each level
            var oVBox = new sap.m.VBox();

            var parsedLevel = parseInt(level)
            // Set the title dynamically
            var oTitle = new sap.m.Title({ text: "Level " + parsedLevel });
            oVBox.addItem(oTitle);

            // Create a ScrollContainer
            // var oScrollContainer = new sap.m.ScrollContainer({
            // 	height: "100%",
            // 	width: "100%"
            // });

            // Create a Table
            var oTable = new sap.m.Table({
              fixedLayout: false,
              width: "110vw"
            });
            oTable.addStyleClass("tableWithBorder");


            // Define Table columns dynamically based on the first data item
            var firstItem = levelData[0];
            // Object.keys(firstItem).forEach(function(key) {
            //   var oColumn = new sap.m.Column({ header: new sap.m.Text({ text: key }) });
            // //   oColumn.addStyleClass("colClass")
            //   oTable.addColumn(oColumn);
            // });
            var oColumn1 = new sap.m.Column({ header: new sap.m.Text({ text: "Level" }), styleClass: "colClass" })
            var oColumn2 = new sap.m.Column({ header: new sap.m.Text({ text: "Title" }), styleClass: "colClass" });
            var oColumn3 = new sap.m.Column({ header: new sap.m.Text({ text: "Employee ID" }), styleClass: "colClass" });
            var oColumn9 = new sap.m.Column({ header: new sap.m.Text({ text: "Employee Name" }), styleClass: "colClass" });
            var oColumn4 = new sap.m.Column({ header: new sap.m.Text({ text: "Status" }), styleClass: "colClass" });
            var oColumn5 = new sap.m.Column({ header: new sap.m.Text({ text: "Begin Date" }), styleClass: "colClass" });
            var oColumn6 = new sap.m.Column({ header: new sap.m.Text({ text: "End Date" }), styleClass: "colClass" });
            var oColumn7 = new sap.m.Column({ header: new sap.m.Text({ text: "Days Taken" }), styleClass: "colClass" });
            var oColumn8 = new sap.m.Column({ header: new sap.m.Text({ text: "Action Taken By" }), styleClass: "colClass" });
            oTable.addColumn(oColumn1);
            oTable.addColumn(oColumn2);
            oTable.addColumn(oColumn3);
            oTable.addColumn(oColumn9);
            oTable.addColumn(oColumn4);
            oTable.addColumn(oColumn5);
            oTable.addColumn(oColumn6);
            oTable.addColumn(oColumn7);
            oTable.addColumn(oColumn8);

            // Iterate over the data for this level and add table rows
            levelData.forEach(function (item) {
              var oRow = new sap.m.ColumnListItem();
              oRow.addCell(new sap.m.Text({ text: `${parseInt(item.level)}` }));
              oRow.addCell(new sap.m.Text({ text: item.title }));
              oRow.addCell(new sap.m.Text({ text: item.employee_id }));
              oRow.addCell(new sap.m.Text({ text: item.employee_Name }));
              oRow.addCell(new sap.m.Text({ text: item.status }));
              oRow.addCell(new sap.m.Text({ text: item.begin_Date_Time }));
              oRow.addCell(new sap.m.Text({ text: item.end_Date_Time }));
              oRow.addCell(new sap.m.Text({ text: item.days_Taken }));
              oRow.addCell(new sap.m.Text({ text: item.approved_By }));

              // Object.keys(item).forEach(function (key) {
              // 	oRow.addCell(new sap.m.Text({ text: item[key] }));
              // });
              oTable.addItem(oRow);
            });

            // Add the Table to the ScrollContainer
            // oScrollContainer.addContent(oTable);

            // Add the ScrollContainer to the VBox
            oVBox.addItem(oTable);

            // Add the VBox to the main VBox container
            vBox.addItem(oVBox);
          });
        } catch (error) {
          console.log(error);
        }


      },
      onFilePressed: function (oEvent) {
        debugger
        // oEvent.preventDefault();
        // var currData = oEvent.getSource().getBindingContext("oCapData").getObject();

        // var base64String = currData.contentString;
        // var contentType = currData.mediaType;

        // var newWindow = window.open();
        // newWindow.document.write('<iframe width="100%" height="100%" src="data:' + contentType + ';base64,' + base64String + '"></iframe>');



      },
      onLineItemChange: function (oEvent) {
        var oModel = this.getView().getModel("oCapData");
        var oSwitch = oEvent.getSource();
        var bState = oSwitch.getState();

        // Update the model data directly without triggering the change event again
        oModel.setProperty(oSwitch.getBindingContext("oCapData").getPath() + "/state", bState);

        const isAtLeastOneSwitchTrue = function () {
          debugger
          var aItems = oModel.getProperty("/vob_yoy_scr4");

          for (var i = 0; i < aItems.length; i++) {
            if (aItems[i].state) {
              return true;
            }
          }

          return false;
        };

        var bAtLeastOneSwitchTrue = isAtLeastOneSwitchTrue();
        if (!bAtLeastOneSwitchTrue) {
          // Reverse the state change if at least one switch is not true
          oSwitch.setState(!bState);

          // Show message toast
          sap.m.MessageToast.show("At least one item should be Approved");
        } else {
          // Your logic when at least one switch is true
          // For example, updating another model
          var yoyLineItem = this.getView().getModel("device").getProperty("/yoy_lineitem");
          var yoydata = oSwitch.getBindingContext("oCapData").getObject();
          yoyLineItem[yoydata.id] = yoydata.state;
          this.getView().getModel("device").setProperty("/yoy_lineitem", JSON.stringify(yoyLineItem));
        }
      },

      onCommentsChange: function (oEvent) {
        debugger;
        let sid = oEvent.mParameters.id;
        let currValue = oEvent.mParameters.value;
        let deviceModel = this.getView().getModel("device");
        let commentsval = deviceModel.getProperty("/commentsval"); // Get the commentsval from device model

        if (!commentsval) {
          // If commentsval does not exist, create it as an empty object
          commentsval = {
            'app_rej_by': new sap.ushell.services.UserInfo().getEmail()
          };
        } else {
          // If commentsval exists but as a string, parse it into an object
          commentsval = JSON.parse(commentsval);
        }

        if (sid.includes('App--comment1')) {
          commentsval['Team Recommendation with Rationale'] = currValue;
        }
        if (sid.includes('App--comment2')) {
          commentsval['Decision and MOM of Forum'] = currValue;
        }
        if (sid.includes('App--comment3')) {
          commentsval['Development Supply Agreement Whether Signed ? (If no- LoBA will share after DSA agreement.)'] = currValue;
        }
        if (sid.includes('App--comment4')) {
          commentsval['Tooling Agreement signed? (If applicable)'] = currValue;
        }
        if (sid.includes('App--comment5')) {
          commentsval['Supplier Code of Conduct declaration if submitted ?'] = currValue;
        }

        // Convert commentsval back to string before setting it in the model
        deviceModel.setProperty("/commentsval", JSON.stringify(commentsval));
      },
      onCommentPress: function (oEvent) {
        debugger
        var cdialog = new sap.m.Dialog({
          title: "Comments",
          endButton: new sap.m.Button({
            text: "Close",
            press: function () {
              cdialog.close();
            },
            layoutData: new sap.m.FlexItemData({
              // Add layoutData for flexible item behavior
              growFactor: 5,
              alignSelf: "End" // Align the button to the end (right)
            })
          })
        });
        cdialog.addContent(new sap.m.VBox({
          width: "60vw"
        }));

        function generateUniqueId() {
          // Generate a random number
          var randomNumber = Math.floor(Math.random() * 1000000);

          // Get the current timestamp
          var timestamp = new Date().getTime();

          // Combine timestamp and random number to create a unique ID
          var uniqueId = timestamp + '-' + randomNumber;

          return uniqueId;
        }
        debugger

        var comments = oData.vob_comments;
        if (comments.length) {
          comments.forEach(function (entry) {
            var oTimelineItem = new sap.suite.ui.commons.TimelineItem(("thisuniqid1" + generateUniqueId()), {
              dateTime: entry.createdAt,
              // title: "demo title1",
              userNameClickable: false,
              // userNameClicked: "onUserNameClick",
              // select: "onPressItems",
              // userPicture: "Photo",
              text: entry.comment,
              // title: 'Title',
              userName: entry.createdBy
            });
            cdialog.addContent(oTimelineItem);
            debugger

          });
        }

        cdialog.open(); // Open the dialog
        debugger
      },
      onFileLoaderPressed: function () {
        debugger
        var that = this;
        if (!this.oDefaultDialog) {
          var tempfilevar = [];
          this.oDefaultDialog = new sap.m.Dialog({
            title: "Upload File",
            content: new sap.ui.unified.FileUploader({
              uploadComplete: function (oEvent) {
                debugger
              },
              change: function (oEvent) {
                debugger
                var file = oEvent.mParameters.files[0];
                var reader = new FileReader();

                var uploadSet = this.getParent().getParent().byId("uploadSet");

                tempfilevar = [];

                reader.onload = function (event) {
                  var base64String = event.target.result.split(",")[1];
                  var contentType = oEvent.mParameters.files[0].type;
                  console.log(that);

                  tempfilevar.push({
                    name: file.name,
                    type: file.type,
                    contentString: base64String
                  })
                  debugger
                  // Get a reference to the UploadSet control
                  // var uploadSet = that.byId("uploadSet");

                  // Create a new UploadSetItem with the visibleEdit property set to true
                  // var newItem = new sap.m.upload.UploadSetItem({
                  //   fileName: "New File",
                  //   mediaType: "Type",
                  //   url: "URL",
                  //   visibleEdit: true
                  // });

                  // Add the new UploadSetItem to the UploadSet
                  // uploadSet.addItem(newItem);

                  // // Add the new item data to the model
                  // var aItems = uploadSet.getModel("oCapData").getProperty("/vob_files")
                  // aItems.push({
                  //   contentString: base64String,
                  //   fileName: newItem.getFileName(),
                  //   mediaType: newItem.getMediaType(),
                  //   url: newItem.getUrl()
                  // });
                  // uploadSet.getModel("oCapData").setProperty("/items", aItems);

                  // Open a new window with the PDF content
                  // var newWindow = window.open();
                  // newWindow.document.write('<iframe width="100%" height="100%" src="data:' + contentType + ';base64,' + base64String + '"></iframe>');
                };


                reader.readAsDataURL(file);


              }
            }),
            beginButton: new sap.m.Button({
              // type: ButtonType.Emphasized,
              text: "OK",
              press: function () {
                debugger

                var uploadSet = this.byId("uploadSet");

                for (let i = 0; i < tempfilevar.length; i++) {

                  var newItem = new sap.m.upload.UploadSetItem({
                    fileName: `${tempfilevar[i].name}`,
                    mediaType: `${tempfilevar[i].type}`,
                    url: `${tempfilevar[i].name}`,
                    visibleEdit: false,
                    openPressed: function (oEvent) {
                      debugger
                      oEvent.preventDefault();
                      var currData = oEvent.getSource().getBindingContext("oCapData").getObject();

                      var base64String = currData.contentString;
                      var contentType = currData.mediaType;

                      var newWindow = window.open();
                      newWindow.document.write('<iframe width="100%" height="100%" src="data:' + contentType + ';base64,' + base64String + '"></iframe>');
                    },
                    removePressed: function (oEvent) {
                      debugger
                      oEvent.preventDefault()
                      let filename = oEvent.mParameters.item.mProperties.fileName
                    }
                  });

                  // Add the new UploadSetItem to the UploadSet
                  uploadSet.addItem(newItem);

                  // Add the new item data to the model
                  var aItems = uploadSet.getModel("oCapData").getProperty("/vob_files")
                  aItems.push({
                    contentString: tempfilevar[i].contentString,
                    fileName: `${tempfilevar[i].name}`,
                    mediaType: `${tempfilevar[i].type}`,
                    url: `${tempfilevar[i].name}`
                  });
                  uploadSet.getModel("oCapData").setProperty("/vob_files", aItems);

                  files[`${tempfilevar[i].name}`] =
                  {
                    contentString: `${tempfilevar[i].contentString}`,
                    fileName: `${tempfilevar[i].name}`,
                    mediaType: `${tempfilevar[i].type}`,
                    url: `${tempfilevar[i].name}`
                  }

                }

                commentsval = JSON.parse(commentsval);

                commentsval["filesData"] = JSON.stringify(files);

                commentsval = JSON.stringify(commentsval);

                this.getView().getModel("context").setProperty("/comment", commentsval);

                uploadSet.mBindingInfos.items.binding.refresh();

                this.oDefaultDialog.close();
              }.bind(this)
            }),
            endButton: new sap.m.Button({
              text: "Close",
              press: function () {
                this.oDefaultDialog.close();
              }.bind(this)
            })
          });

          // to get access to the controller's model
          this.getView().addDependent(this.oDefaultDialog);
        }

        this.oDefaultDialog.open();
      },
      onAfterItemAdded: async function (oEvent) {
        debugger
        var item = oEvent.getParameter("item");
        var vobid = this.getView().getModel("context").getData().vobid
        var _createEntity = function (item) {
          var data = {
            mediaType: item.getMediaType(),
            fileName: item.getFileName(),
            // size: item.getFileObject().size,
            vob_id: vobid,
          };

          var settings = {
            url: `${mainServiceUrl}/odata/v4/my/Files`,
            method: "POST",
            headers: {
              "Content-type": "application/json"
            },
            data: JSON.stringify(data)
          };

          return new Promise(async (resolve, reject) => {
            await $.ajax(settings)
              .done((results, textStatus, request) => {
                debugger
                resolve(results.ID);
              })
              .fail((err) => {
                debugger
                reject(err);
              })
          });

        }

        _createEntity(item).then(async (id) => {
          debugger
          var url = `${mainServiceUrl}/odata/v4/my/Files(ID=${id})/content`;
          item.setUploadUrl(url);
          item.setUrl(url);
          item.setVisibleEdit(false);
          item.attachOpenPressed((oEvent) => {
            debugger
          })
          item.attachRemovePressed((oEvent) => {
            debugger
          })
          await $.ajax({
            url: `${mainServiceUrl}/odata/v4/my/Files(ID=${id})`,
            method: 'PATCH',
            contentType: 'application/json',
            data: JSON.stringify({
              url: url
            }),
            success: function (response) {
              debugger
              // oData = response.value[0]
              console.log('Success:', response);
              // Handle successful response here
            },
            error: function (xhr, status, error) {
              debugger
              console.error('Error:', error);
            }
          })
          var oUploadSet = this.byId("uploadSet");
          oUploadSet.setHttpRequestMethod("PUT");
          oUploadSet.uploadItem(item);

        }).catch((err) => {
          debugger
          console.log(err);
        })

      },
      onUploadCompleted: async function (oEvent) {
        debugger


        var oUploadSet = this.byId("uploadSet");
        oUploadSet.removeAllIncompleteItems();
        oUploadSet.getBinding("items").refresh();
      },
      onRemovePressed: async function (oEvent) {
        debugger
      }
    });
  }
);
