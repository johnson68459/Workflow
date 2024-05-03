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
    return BaseController.extend("wizard.wizardui.controller.App", {
      async onInit() {

        await new Promise(resolve => setTimeout(resolve, 1000));

        // const requestOptions = {
        //   method: "GET",
        //   redirect: "follow"
        // };

        // fetch("https://reqres.in/api/users?page=2", requestOptions)
        //   .then((response) => response.text())
        //   .then((result) => console.log(result))
        //   .catch((error) => console.error(error));

        await $.ajax({
          url: 'https://2890861ctrial-dev-mahindravob-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/my/VOB_Screen4',
          method: 'GET',
          success: function (response) {
            debugger
            console.log('Success:', response);
            // Handle successful response here
          },
          error: function (xhr, status, error) {
            debugger
            console.error('Error:', error);
            // Handle error here
          }
        });


        try {
          commentsval = {
            "approvalflow": "true"
          };
          // let userinfo = new sap.ushell.services.UserInfo().getEmail();
          // commentsval = JSON.parse(commentsval);
          if (new sap.ushell.services.UserInfo().getEmail() && !commentsval.hasOwnProperty("app_rej_by")) {
            commentsval["app_rej_by"] = `${new sap.ushell.services.UserInfo().getEmail()}`;
          }
          else {
            commentsval["app_rej_by"] = 'bpa Inbox user';
          }

          var oData = this.getOwnerComponent().oModels.context.oData.raw_data[0];
          var oModel = new sap.ui.model.json.JSONModel();
          oModel.setData(oData);
          this.getView().setModel(oModel, "oCapData");
          this.byId("uploadSet").setMode("None")

          ////////////////////////////////////////////////////////////////////

          commentsval = JSON.stringify(commentsval);

          this.getView().getModel("context").setProperty("/comment", commentsval);

        } catch (error) {
          console.log("ERROR:", error)
        }
        debugger


      },
      onBeforeRendering: async function (oEvent) {

        // if (!this.getView().getModel("oCapData")) {
        //   var oData = this.getOwnerComponent().oModels.context.oData.raw_data[0].vob_files;
        //   var oModel = new sap.ui.model.json.JSONModel();
        //   oModel.setData(oData);
        //   this.getView().setModel(oModel, "oCapData");
        // }

        await new Promise(resolve => setTimeout(resolve, 1000));
        this.byId("uploadSet").setUploadButtonInvisible(true);
        files = {};
        debugger
        try {
          if (typeof (commentsval) != 'string') {
            commentsval = {
              "approvalflow": "true"
            };
            if (new sap.ushell.services.UserInfo().getEmail() && !commentsval.hasOwnProperty("app_rej_by")) {
              commentsval["app_rej_by"] = `${new sap.ushell.services.UserInfo().getEmail()}`;
            }
            else {
              commentsval["app_rej_by"] = 'bpa Inbox user';
            }
            commentsval = JSON.stringify(commentsval);
          }



          this.getView().getModel("context").setProperty("/comment", commentsval);

          if (!this.getView().getModel("oCapData")) {
            var oData = this.getOwnerComponent().oModels.context.oData.raw_data[0].vob_files;
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(oData);
            this.getView().setModel(oModel, "oCapData");
          }

          const vob_yoy_scr4 = this.getOwnerComponent().oModels.context.oData.raw_data[0].vob_yoy_scr4;
          var vob_suplier4 = this.getOwnerComponent().oModels.context.oData.raw_data[0].vob_suplier4;

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
            // if (this.byId("mainHBox").getItems()[1]) {
            //   this.byId("mainHBox").removeItem(this.byId("mainHBox").getItems()[1]);
            // }

            mainHBox.addItem(rightVbox);
          }


          // var filesData = this.getOwnerComponent().oModels.context.oData.raw_data[0].vob_files;
          // var uploadSet = this.byId("uploadSet");
          // uploadSet.destroyItems();


          // for (let i = 0; i < filesData.length; i++) {
          //   uploadSet.addItem(new sap.m.upload.UploadSetItem({
          //     visibleEdit: false,
          //     visibleRemove: false,
          //     enabledRemove: false,
          //     enabledEdit: false,
          //     url: "oCapData>url}",
          //     fileName: `${filesData[i].fileName}`,
          //     mediaType: `${filesData[i].mediaType}`,
          //     openPressed: function (oEvent) {
          //       debugger
          //       oEvent.preventDefault();
          //       // var currData = oEvent.getSource().getBindingContext("oCapData").getObject();
          //     }
          //   }))

          // }


        } catch (error) {
          console.log('Error:', error);
        }



      },
      onAfterRendering: async function (oEvent) {
        debugger
        await new Promise(resolve => setTimeout(resolve, 1000));
        // const delay = () => new Promise(resolve => setTimeout(resolve, 3000));
        // await delay();


        if (typeof (commentsval) != 'string') {

          commentsval = JSON.stringify(commentsval);

          this.getView().getModel("context").setProperty("/comment", commentsval);
        }

        //
        var workflowhistoryarray = this.getOwnerComponent().oModels.context.oData.raw_data[0].vob_to_Workflow_History;
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

        ////////////////////////////////////////////////////////////////////////////////////








      },
      onFilePressed: function (oEvent) {
        debugger
        oEvent.preventDefault();
        var currData = oEvent.getSource().getBindingContext("oCapData").getObject();

        var base64String = currData.contentString;
        var contentType = currData.mediaType;

        var newWindow = window.open();
        newWindow.document.write('<iframe width="100%" height="100%" src="data:' + contentType + ';base64,' + base64String + '"></iframe>');



      },
      onLineItemChange: function (oEvent) {
        debugger
        if (typeof (yoyLineItem) == 'string') {
          yoyLineItem = JSON.parse(yoyLineItem);
        }
        var yoydata = oEvent.getSource().getParent().getBindingContext("oCapData").getObject();
        yoyLineItem[`${yoydata.id}`] = `${yoydata.state}`
        yoyLineItem = JSON.stringify(yoyLineItem);

        this.getView().getModel("context").setProperty("/yoy_lineitem", yoyLineItem);

      },
      stringToBoolean: function (sValue) {
        debugger
        if (sValue == 'Approved') {
          return true;
        }
        else {
          return false;
        }
      },
      onCommentsChange: function (oEvent) {
        debugger
        let sid = oEvent.mParameters.id;
        let currValue = oEvent.mParameters.value;
        if (typeof (commentsval) == 'string') {
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

        commentsval = JSON.stringify(commentsval);

        this.getView().getModel("context").setProperty("/comment", commentsval);

      },
      onOpenPressed: function (oEvent) {
        debugger
        // Get the array of vob_files from your model

        window.open('https://3ebeb48ctrial-dev-mahindra-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/my/Files(13199331-c67c-4026-86cb-0ff103adb95c)/content')
        // var vobFiles = this.getOwnerComponent().oModels.context.oData.raw_data[0].vob_files;

        // // Loop through each file
        // vobFiles.forEach(function (file) {
        //   // Get the blob content of the current file
        //   var blobContent = file / content;

        //   // Create a Blob object from the blob content with MIME type 'application/pdf'
        //   var blob = new Blob([blobContent], { type: 'application/pdf' });

        //   // Create a URL for the Blob
        //   var blobUrl = URL.createObjectURL(blob);

        //   // Open the Blob URL in a new browser window
        //   window.open(blobUrl);
        // });


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

        var comments = this.getOwnerComponent().oModels.context.oData.raw_data[0].vob_comments;
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
    });
  }
);
