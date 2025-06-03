define('DS/MePreferencesUIBuilder/MePreferencesSelectionModel',
    [
        "DS/TreeModel/TreeDocument",
        "DS/TreeModel/TreeNodeModel",
        "DS/MePreferencesUIBuilder/MePreferencesAdminTableBuilder"
    ],
    function (TreeDocument, TreeNodeModel, MEPAdminTableBuilder) {

        var selectionModel = new TreeDocument();

        var mepAdminTableBuilderObj = new MEPAdminTableBuilder();

        var mePreferencesSelectionModelObj = {

            getSelectionModel: function () {
                return selectionModel;
            }

        };

        document.addEventListener("ModelDataUpdated", (e) => {
            updateSelectionModel(e.detail[0], e.detail[1], e.detail[2]);
        });

        function updateSelectionModel(identifier, selectedvalue, type) {
            var EnumMap = mepAdminTableBuilderObj.getEnumMap();
            selectionModel.prepareUpdate();

            if (type === "enum") {
                for (let [key, value] of EnumMap.entries()) {
                    if (key === identifier) {
                        let enumValueMap = value;
                        for (let [key1, value1] of enumValueMap.entries()) {
                            if (key1 === selectedvalue) {
                                selectedvalue = value1;
                            }
                        }
                    }
                }
            }

            if (type != "lock") {
                let prefItemTreeNodeModel = new TreeNodeModel({
                    label: identifier,
                    grid: {
                        value: selectedvalue,
                        preferencetype: type,
                        lockState: undefined
                    }
                });
                let rootExist = false;
                selectionModel.search({
                    match: function (cellInfos) {
                        if (cellInfos.nodeModel.getAttributeValue("label") === identifier) {
                            if (cellInfos.nodeModel.getAttributeValue("value") != selectedvalue) {
                                cellInfos.nodeModel._options.grid["value"] = selectedvalue;
                                cellInfos.nodeModel._options.grid["preferencetype"] = type;
                            }
                            rootExist = true;
                        }
                    }
                });

                if (!rootExist)
                    selectionModel.addRoot(prefItemTreeNodeModel);
            }
            else {
                let tempIdentifier = identifier.split(".");
                tempIdentifier.pop(); // to remove .lock from key
                identifier = tempIdentifier[0] + "." + tempIdentifier[1];

                let prefItemTreeNodeModel = new TreeNodeModel({
                    label: identifier,
                    grid: {
                        value: undefined,
                        preferencetype: undefined,
                        lockState: selectedvalue
                    }
                });

                let rootExist = false;
                selectionModel.search({
                    match: function (cellInfos) {
                        if (cellInfos.nodeModel.getAttributeValue("label") === identifier) {
                            cellInfos.nodeModel._options.grid["lockState"] = selectedvalue;
                            rootExist = true;
                        }
                    }
                });

                if (!rootExist)
                    selectionModel.addRoot(prefItemTreeNodeModel);
            }

            selectionModel.pushUpdate();
        }

        return mePreferencesSelectionModelObj;
    });
