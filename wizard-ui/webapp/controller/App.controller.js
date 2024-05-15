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
    var fileName;
    var item;
    // var mainServiceUrl = "https://2890861ctrial-dev-mahindravob-srv.cfapps.us10-001.hana.ondemand.com";
    var mainServiceUrl = `https://3ebeb48ctrial-dev-mahindra-srv.cfapps.us10-001.hana.ondemand.com`;
    return BaseController.extend("wizard.wizardui.controller.App", {
      async onInit() {

        await new Promise(resolve => setTimeout(resolve, 500));
        if (this.getView().getModel("context").getData().baseurl) {
          mainServiceUrl = this.getView().getModel("context").getData().baseurl;
        }
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
        await new Promise(resolve => setTimeout(resolve, 500));
        if (this.getView().getModel("context").getData().baseurl) {
          mainServiceUrl = this.getView().getModel("context").getData().baseurl;
        }
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
        await new Promise(resolve => setTimeout(resolve, 500));
        if (this.getView().getModel("context").getData().baseurl) {
          mainServiceUrl = this.getView().getModel("context").getData().baseurl;
        }
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
      onAfterItemAddedorg: async function (oEvent) {
        debugger
        try {
          var item = oEvent.getParameter("item");
          var fileName = item.getFileName();
          var fileType = item.getFileObject().type;
          var vobid = this.getView().getModel("context").getData().vobid;
          var folders = [];
          var that = this;


          function generateUniqueId() {
            // Generate a random number and convert it to base 36 (0-9a-z)
            const randomPart = Math.random().toString(36).substr(2, 9);

            // Get the current timestamp and convert it to base 36
            const timestampPart = Date.now().toString(36);

            // Concatenate the random part and timestamp part
            const uniqueId = randomPart + timestampPart;

            return uniqueId;
          }
          var dialogOpen;
          // Open dialog only if it's not already open

          if (!dialogOpen) {
            dialogOpen = true;

            // Create the dialog
            var cdialog = new sap.m.Dialog(`dialog${generateUniqueId()}`, {
              title: "Folders",
              contentWidth: "40%",
              endButton: new sap.m.Button({
                text: "Cancel",
                press: function (oEvent) {
                  debugger
                  cdialog.close();
                  // var incomplete_items = sap.ui.getCore().byId("vobscreen3::VOB_Screen3ObjectPage--fe::CustomSubSection::Attachments--11").destroyIncompleteItems();
                  this.byId("uploadSet").destroyIncompleteItems();
                  cdialog.destroyContent();
                  dialogOpen = false; // Reset the flag when dialog is closed
                },


              }),
              beginButton: new sap.m.Button({
                text: "Ok",
                press: function (oEvent) {
                  // var currentUrl = window.location.href;
                  // var uuidRegex = /id=([0-9a-fA-F-]+),/;
                  // var id = currentUrl.match(uuidRegex)[1];
                  var foldername = oEvent.getSource().getParent().mAggregations.content[1].mAggregations.items[0].mProperties.footerText;
                  if (foldername == "Click on the folder to select path") {
                    var oMessageBox = sap.m.MessageBox.warning("No folder selected.", {
                      title: "Warning",
                      onClose: function () {
                        oMessageBox.close();
                        debugger;
                      }
                    });
                  }
                  else {
                    debugger
                    var _createEntity = function (item) {
                      var data = {
                        mediaType: item.getMediaType(),
                        fileName: item.getFileName(),
                        // size: item.getFileObject().size,
                        Folder: foldername,
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

                      // await $.ajax({
                      //   url: `${mainServiceUrl}/odata/v4/my/Files(ID=${id})`,
                      //   method: 'PATCH',
                      //   contentType: 'application/json',
                      //   data: JSON.stringify({
                      //     url: url,
                      //     createdBy: `${new sap.ushell.services.UserInfo().getEmail()}`
                      //   }),
                      //   success: function (response) {
                      //     debugger
                      //     // oData = response.value[0]
                      //     console.log('Success:', response);
                      //     // var oUploadSet = that.byId("uploadSet");
                      //     // oUploadSet.setHttpRequestMethod("PUT");
                      //     // oUploadSet.removeAllIncompleteItems();
                      //     // oUploadSet.getBinding("items").refresh();
                      //     // cdialog.close();
                      //     // cdialog.destroyContent();
                      //     // dialogOpen = false;
                      //     // Handle successful response here
                      //   },
                      //   error: function (xhr, status, error) {
                      //     debugger
                      //     console.error('Error:', error);
                      //   }
                      // })
                      cdialog.close();
                      cdialog.destroyContent();
                      dialogOpen = false;
                      var oUploadSet = item.getParent();
                      oUploadSet.setHttpRequestMethod("PUT");
                      oUploadSet.removeAllIncompleteItems();
                      oUploadSet.getBinding("items").refresh();

                      // var oUploadSet = this.byId("uploadSet");
                      // oUploadSet.setHttpRequestMethod("PUT");
                      // oUploadSet.uploadItem(item);

                    }).catch((err) => {
                      debugger
                      console.log(err);
                    })



                    debugger
                  }
                }
              })


            });

            // Add VBox for content
            var contentVBox = new sap.m.VBox({
              width: "100%",
              height: "100%"
            });

            contentVBox.addStyleClass("vboxclass");

            // Add PDF icon and name to an HBox for alignment
            var pdfHBox = new sap.m.HBox();
            // var pdfIcon = new sap.ui.core.Icon({
            //   src: fileType,
            //   size: "2rem", // Adjust the size as needed
            //   marginRight: "0.5rem" // Add some space between the icon and text
            // });
            debugger;
            var pdfName = new sap.m.Text({
              text: fileName
            });
            // pdfIcon.addStyleClass("icon")
            pdfName.addStyleClass("name");
            // pdfHBox.addItem(pdfIcon);
            // pdfHBox.addItem(pdfName);
            contentVBox.addItem(pdfHBox);



            var vb1 = new sap.m.VBox("vb1");
            vb1.addItem(
              new sap.ui.webc.main.Tree("tree", {
                itemClick: async function (params) {
                  debugger;
                  let selectedItem = params.mParameters.item;
                  let path = '';
                  let currentFolder = selectedItem;

                  // Traverse up the hierarchy and construct the path
                  while (currentFolder && currentFolder.getId() !== 'tree') {
                    // Get the icon and name of the current folder
                    // let icon = currentFolder.getIcon();
                    let name = currentFolder.getText();

                    // Construct the path by adding the icon and name
                    path = `${name} / ${path}`;

                    // Move to the parent folder
                    currentFolder = currentFolder.getParent();
                  }

                  // Set the footer text with the constructed path
                  sap.ui.getCore().byId("tree").setFooterText(path);
                },
                footerText: "Click on the folder to select path",
                // title: "Folders",
                items: [
                  new sap.ui.webc.main.TreeItem(`fold1${generateUniqueId()}`, {
                    icon: "sap-icon://folder-full",
                    text: "Part No",

                    //=======================Vendor 1========================
                    items: [
                      new sap.ui.webc.main.TreeItem(`fold2${generateUniqueId()}`, {
                        icon: "sap-icon://folder-full",
                        text: "Vendor 1",
                      })]
                  })]
              })
            )
            debugger

            cdialog.addContent(contentVBox);
            cdialog.addContent(vb1);


            var mail = new sap.ushell.services.UserInfo().getEmail();
            var folders = [];

            await $.ajax({
              url: `${mainServiceUrl}/odata/v4/my/Data?$filter=Data eq '${new sap.ushell.services.UserInfo().getEmail()}'`,
              method: 'GET',
              success: function (response) {
                debugger
                folders = response.value
                // Handle successful response here
              },
              error: function (xhr, status, error) {
                debugger
                console.error('Error:', error);
                // Handle error here
              }
            });

            debugger
            var child = vb1.mAggregations.items[0].mAggregations.items[0].mAggregations.items[0];
            for (let a = 0; a < folders.length; a++) {
              child.addItem(
                new sap.ui.webc.main.TreeItem(`fold1.3${generateUniqueId()}`, {
                  icon: "sap-icon://folder-full",
                  text: folders[a].id,
                })
              )
            }

            cdialog.open();

          }

          this.byId("uploadSet").getBinding("items").refresh();
          cdialog.close();


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
                url: url,
                createdBy: `${new sap.ushell.services.UserInfo().getEmail()}`
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
        }
        catch (err) {
          debugger
          console.log(err);
        }

      },
      onAfterItemAdded: async function (oEvent) {
        debugger
        var test = true;
        async function processFiles() {
          try {
            debugger
            item = oEvent.getParameter("item");
            var fileName = item.getFileName();
            var fileType = item.getFileObject().type;
            var vobid = this.getView().getModel("context").getData().vobid;
            var folders = [];
            var that = this;


            // cdialog.close();

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
                  "Content-type": "application/json",
                },
                data: JSON.stringify(data),
              };

              return new Promise(async (resolve, reject) => {
                await $.ajax(settings)
                  .done((results, textStatus, request) => {
                    debugger;
                    resolve(results.ID);
                  })
                  .fail((err) => {
                    debugger;
                    reject(err);
                  });
              });
            };

            _createEntity(item)
              .then(async (id) => {
                debugger;
                var url = `${mainServiceUrl}/odata/v4/my/Files(ID=${id})/content`;
                item.setUploadUrl(url);
                item.setUrl(url);
                item.setVisibleEdit(false);
                item.attachOpenPressed((oEvent) => {
                  debugger;
                });
                item.attachRemovePressed(async (oEvent) => {
                  debugger;
                  oEvent.preventDefault()
                  var url = oEvent.getSource().getUploadUrl()

                  var fileID;
                  // Regular expression to extract the ID
                  var idRegex = /ID=([\w-]+)/;
                  var match = url.match(idRegex);

                  // Check if a match is found and get the ID
                  if (match && match.length > 1) {
                    fileID = match[1];
                    console.log("Extracted ID:", fileID);
                  } else {
                    console.log("ID not found in the URL");
                  }
                  var settings = {
                    url: `${mainServiceUrl}/odata/v4/my/Files(ID=${fileID})`,
                    method: "DELETE",
                  };

                  await $.ajax(settings).done(function (response) {
                    debugger
                    oUploadSet.getBinding("items").refresh();
                    console.log(response);
                  }).fail(function (xhr, status, error) {
                    debugger;
                    console.log("AJAX request failed:", error);
                    // Handle failure here
                  });

                  oUploadSet.removeItem(oEvent.getSource());

                });
                await $.ajax({
                  url: `${mainServiceUrl}/odata/v4/my/Files(ID=${id})`,
                  method: "PATCH",
                  contentType: "application/json",
                  data: JSON.stringify({
                    url: url,
                    createdBy: `${new sap.ushell.services.UserInfo().getEmail()}`,
                  }),
                  success: function (response) {
                    debugger;
                    // oData = response.value[0]
                    console.log("Success:", response);
                    // Handle successful response here
                  },
                  error: function (xhr, status, error) {
                    debugger;
                    console.error("Error:", error);
                  },
                });

                var oUploadSet = this.byId("uploadSet");
                oUploadSet.setHttpRequestMethod("PUT");
                oUploadSet.uploadItem(item);
              })
              .catch((err) => {
                debugger;
                console.log(err);
              });
          } catch (err) {
            debugger;
            console.log(err);
          }
        }

        // Call the function
        await processFiles.bind(this)()
          .then(() => {
            // Proceed with subsequent operations
            console.log("Process completed successfully");
          })
          .catch((error) => {
            // Handle the error
            console.error("An error occurred during processing:", error);
          });
        debugger


        console.log("Process completed successfully");

      },
      onUploadCompleted: async function (oEvent) {
        debugger

        var oUploadSet = this.byId("uploadSet");
        oUploadSet.setHttpRequestMethod("PUT");
        oUploadSet.removeAllIncompleteItems();
        oUploadSet.getBinding("items").refresh();


        var fileName = item.getFileName();
        var fileType = item.getFileObject().type;
        var vobid = this.getView().getModel("context").getData().vobid;
        var folders = [];
        var that = this;

        function generateUniqueId() {
          // Generate a random number and convert it to base 36 (0-9a-z)
          const randomPart = Math.random().toString(36).substr(2, 9);

          // Get the current timestamp and convert it to base 36
          const timestampPart = Date.now().toString(36);

          // Concatenate the random part and timestamp part
          const uniqueId = randomPart + timestampPart;

          return uniqueId;
        }

        var dialogOpen;
        // Open dialog only if it's not already open

        if (!dialogOpen) {
          dialogOpen = true;

          // Create the dialog
          var cdialog = new sap.m.Dialog(`dialog${generateUniqueId()}`, {
            title: "Folders",
            contentWidth: "40%",
            endButton: new sap.m.Button({
              text: "Cancel",
              press: async function (oEvent) {

                debugger

                var url = item.getUploadUrl()
                var fileID;
                // Regular expression to extract the ID
                var idRegex = /ID=([\w-]+)/;
                var match = url.match(idRegex);

                // Check if a match is found and get the ID
                if (match && match.length > 1) {
                  fileID = match[1];
                  console.log("Extracted ID:", fileID);
                } else {
                  console.log("ID not found in the URL");
                }
                var settings = {
                  url: `${mainServiceUrl}/odata/v4/my/Files(ID=${fileID})`,
                  method: "DELETE",
                };

                await $.ajax(settings).done(function (response) {
                  debugger
                  oUploadSet.getBinding("items").refresh();
                  console.log(response);
                }).fail(function (xhr, status, error) {
                  debugger;
                  console.log("AJAX request failed:", error);
                  // Handle failure here
                });
                cdialog.close();
                // var incomplete_items = sap.ui.getCore().byId("vobscreen3::VOB_Screen3ObjectPage--fe::CustomSubSection::Attachments--11").destroyIncompleteItems();
                // this.byId("uploadSet").destroyIncompleteItems();
                cdialog.destroyContent();
                // test = false;
                dialogOpen = false; // Reset the flag when dialog is closed
                oUploadSet.getBinding("items").refresh();
                oUploadSet.removeItem(item);
              },
            }),
            beginButton: new sap.m.Button({
              text: "Ok",
              press: function (oEvent) {
                // var currentUrl = window.location.href;
                // var uuidRegex = /id=([0-9a-fA-F-]+),/;
                // var id = currentUrl.match(uuidRegex)[1];
                var foldername = oEvent.getSource().getParent().mAggregations.content[1].mAggregations.items[0].mProperties.footerText;
                if (foldername == "Click on the folder to select path") {
                  var oMessageBox = sap.m.MessageBox.warning("No folder selected.", {
                    title: "Warning",
                    onClose: function () {
                      oMessageBox.close();
                      debugger;
                    },
                  });
                } else {
                  debugger
                  var _createEntity = function (item) {
                    var data = {

                      Folder: foldername,

                    };
                    var url = item.getUploadUrl()
                    var fileID;
                    // Regular expression to extract the ID
                    var idRegex = /ID=([\w-]+)/;
                    var match = url.match(idRegex);

                    // Check if a match is found and get the ID
                    if (match && match.length > 1) {
                      fileID = match[1];
                      console.log("Extracted ID:", fileID);
                    } else {
                      console.log("ID not found in the URL");
                    }

                    var settings = {
                      url: `${mainServiceUrl}/odata/v4/my/Files(ID=${fileID})`,
                      method: "PATCH",
                      headers: {
                        "Content-type": "application/json",
                      },
                      data: JSON.stringify(data),
                    };

                    return new Promise(async (resolve, reject) => {
                      await $.ajax(settings)
                        .done((results, textStatus, request) => {
                          debugger
                          oUploadSet.getBinding("items").refresh();
                          resolve(results.ID);
                        })
                        .fail((err) => {
                          debugger
                          reject(err);
                        });
                    });
                  };

                  _createEntity(item).then(async (id) => {
                    debugger
                    // var url = `${mainServiceUrl}/odata/v4/my/Files(ID=${id})/content`;
                    // item.setUploadUrl(url);
                    // item.setUrl(url);
                    // item.setVisibleEdit(false);
                    // item.attachOpenPressed((oEvent) => {
                    //   debugger;
                    // });
                    // item.attachRemovePressed((oEvent) => {
                    //   debugger;
                    // });

                    cdialog.close();
                    cdialog.destroyContent();
                    dialogOpen = false;
                    // var oUploadSet = item.getParent();
                    // oUploadSet.setHttpRequestMethod("PUT");
                    // oUploadSet.removeAllIncompleteItems();
                    // oUploadSet.getBinding("items").refresh();
                  }).catch((err) => {
                    debugger;
                    console.log(err);
                  });

                  debugger;
                }
                oUploadSet.getBinding("items").refresh();
                // test = false;
              },
            }),
          });

          // Add VBox for content
          var contentVBox = new sap.m.VBox({
            width: "100%",
            height: "100%",
          });

          contentVBox.addStyleClass("vboxclass");

          // Add PDF icon and name to an HBox for alignment
          var pdfHBox = new sap.m.HBox();
          // var pdfIcon = new sap.ui.core.Icon({
          //   src: fileType,
          //   size: "2rem", // Adjust the size as needed
          //   marginRight: "0.5rem" // Add some space between the icon and text
          // });
          debugger;
          var pdfName = new sap.m.Text({
            text: fileName,
          });
          // pdfIcon.addStyleClass("icon")
          pdfName.addStyleClass("name");
          // pdfHBox.addItem(pdfIcon);
          // pdfHBox.addItem(pdfName);
          contentVBox.addItem(pdfHBox);

          var vb1 = new sap.m.VBox("vb1");
          vb1.addItem(
            new sap.ui.webc.main.Tree("tree", {
              itemClick: async function (params) {
                debugger;
                let selectedItem = params.mParameters.item;
                let path = "";
                let currentFolder = selectedItem;

                // Traverse up the hierarchy and construct the path
                while (currentFolder && currentFolder.getId() !== "tree") {
                  // Get the icon and name of the current folder
                  // let icon = currentFolder.getIcon();
                  let name = currentFolder.getText();

                  // Construct the path by adding the icon and name
                  path = `${name} / ${path}`;

                  // Move to the parent folder
                  currentFolder = currentFolder.getParent();
                }

                // Set the footer text with the constructed path
                sap.ui.getCore().byId("tree").setFooterText(path);
              },
              footerText: "Click on the folder to select path",
              // title: "Folders",
              items: [
                new sap.ui.webc.main.TreeItem(`fold1${generateUniqueId()}`, {
                  icon: "sap-icon://folder-full",
                  text: "Part No",

                  //=======================Vendor 1========================
                  items: [
                    new sap.ui.webc.main.TreeItem(`fold2${generateUniqueId()}`, {
                      icon: "sap-icon://folder-full",
                      text: "Vendor 1",
                    }),
                  ],
                }),
              ],
            })
          );
          debugger;

          cdialog.addContent(contentVBox);
          cdialog.addContent(vb1);

          var mail = new sap.ushell.services.UserInfo().getEmail();
          var folders = [];

          await $.ajax({
            url: `${mainServiceUrl}/odata/v4/my/Data?$filter=Data eq '${new sap.ushell.services.UserInfo().getEmail()}'`,
            method: "GET",
            success: function (response) {
              debugger;
              folders = response.value;
              // Handle successful response here
            },
            error: function (xhr, status, error) {
              debugger;
              console.error("Error:", error);
              // Handle error here
            },
          });

          debugger;
          var child = vb1.mAggregations.items[0].mAggregations.items[0].mAggregations.items[0];
          for (let a = 0; a < folders.length; a++) {
            child.addItem(
              new sap.ui.webc.main.TreeItem(`fold1.3${generateUniqueId()}`, {
                icon: "sap-icon://folder-full",
                text: folders[a].id,
              })
            );
          }

          cdialog.open();
        }

        this.byId("uploadSet").getBinding("items").refresh();

      },
      onRemovePressed: async function (oEvent) {
        debugger
      }
    });
  }
);
