//EXAMPLE JS 

define('DS/MePreferencesUIBuilder/MePreferencesCategoryView',
    ["UWA/Core", "DS/TreeModel/TreeDocument",
        "DS/TreeModel/TreeNodeModel", "DS/DataGridView/DataGridView",
        "i18n!DS/MePreferencesUIBuilder/assets/nls/translation",
        "text!DS/MePreferencesUIBuilder/assets/CategoryTree.json",
        "DS/DataGridView/DataGridViewLayout",
        "DS/WebappsUtils/WebappsUtils",
        "DS/PlatformAPI/PlatformAPI",
        "DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices",
        'DS/WAFData/WAFData'],
    function (UWA, TreeDocument, TreeNodeModel, DataGridView, mePrefUITranslation, CategoryJson, DataGridViewLayout, WebappsUtils, PlatformAPI,
        i3DXCompassPlatformServices, WAFData) {
        "use strict";

        var mePreferencesCategoryViewObj = function () { };
        var dataGridView = null;
        var model = null;
        var serviceURL = null;
        var GET_APP_NODES_ENDPOINT = "/api/v1/preferences_panel/apps";
        var appInfoArray = null;
        var appsResp = null;

        mePreferencesCategoryViewObj.prototype.createCategoryUI = async function () {

            var DGVDiv = new UWA.Element("div", {
                'class': 'category-content-div'
            });

            var baseURL = WebappsUtils.getWebappsBaseUrl();
            var appendUrl = "MePreferencesUIBuilder/assets/icons/";
            var iconSuffix = "_AppIcon24.png";
            var appPrefix = "3DSApp.";

            var iconObj = {
                iconName: "cog",
                fontIconSize: '20px'
            };

            function getNameFromNLS(appId) {
                return mePrefUITranslation[appId];
            }


            return await isServiceAvailable.call(this).then(async function (RC) {

                if (RC) {
                    if (serviceURL) {
                        var completeURL = serviceURL + GET_APP_NODES_ENDPOINT;
                        await callRestAPIforAppList.call(this, completeURL, 'GET').then((appListResponse) => {
                            appsResp = appListResponse;

                        }).catch((errorInfo) => {
                            return null;
                        });
                        var appRespParsed = JSON.parse(appsResp);
                        var appsList = appRespParsed['appList'];
                        appInfoArray = new Array();
                        appsList.forEach(function (app) {

                            if (app == "3DSApp.TECMEPA_AP") {
                                var commonObj = {
                                    "title": "Common",
                                    "icon": iconObj,
                                    "appId": "3DSApp.TECMEPA_AP"
                                }
                                appInfoArray.push(commonObj);
                            }
                        })


                        if (appsList != null) {
                            for (let i = 0; i < appsList.length; i++) {
                                if (!(appsList[i].contains("SWXXDWI")) && !(appsList[i].contains("CATXDES")) && !(appsList[i].contains("TECMEPA_AP"))) {
                                    
                                  
                                    await getAppInfo.call(this, appsList[i]).then((appInfo) => {
                                        appInfo.appId = appsList[i];
                                        appInfoArray.push(appInfo);
                                    }).catch((errorInfo) => {
                                        return null;
                                    });
                                }
                            }
                        }

                        if (appInfoArray != null) {
                            appInfoArray.sort((appNode1, appNode2) => {
                                let appName1 = appNode1.title.toUpperCase();
                                let appName2 = appNode2.title.toUpperCase();
                                if (appName1 != "COMMON" && appName2 != "COMMON") {
                                    if (appName1 < appName2)
                                        return -1;
                                    else
                                        return 1;
                                }
                            });


                            var cols = [{
                                dataIndex: "tree",
                                typeRepresentation: "string",
                                editionPolicy: "EditionOnClick",
                                getCellSemantics: function (cellInfos) {
                                    if (cellInfos.nodeModel && cellInfos.nodeModel.getAttributeValue("icon")) {
                                        var iconValue = cellInfos.nodeModel.getAttributeValue("icon");
                                        return {
                                            icon: iconValue
                                        };
                                    } else {
                                        var Icon = cellInfos.nodeModel.getAttributeValue("icon");
                                        return {
                                            icon: Icon
                                        }
                                    }
                                },
                                getCellClassName: function (cellInfos) {
                                    if (cellInfos.nodeModel && cellInfos.nodeModel.getAttributeValue("appId")) {
                                        var className = "mep-admin-widget-node-appID-" + cellInfos.nodeModel.getAttributeValue("appId");
                                        return className;
                                    }
                                }
                            }];

                            model = new TreeDocument();




                            let layoutOptions = {
                                columnsHeader: false,
                                rowsHeader: false
                            }

                            model.prepareUpdate();

                            appInfoArray.forEach(function (dataInfo) {

                                var node = new TreeNodeModel({
                                    label: dataInfo.title,
                                    grid: dataInfo,
                                    appId: dataInfo.appId,
                                    icon: dataInfo.icon
                                });
                                model.addRoot(node);

                            });

                            model.pushUpdate();

                            dataGridView = new DataGridView({
                                treeDocument: model,
                                columns: cols,
                                cellSelection: 'none',
                                rowSelection: 'single',
                                selectionStyle: 'lightSelectionEdging',
                                showSelectionCheckBoxesFlag: false,
                                showRowIndexFlag: false,
                                showAlternateBackgroundFlag: false,
                                showRowHeaderBackgroundFlag: false,
                                showRowBorderFlag: false,
                                showColumnBorderFlag: false,
                                columnsHeader: false,
                                layout: new DataGridViewLayout(layoutOptions)
                            });

                            dataGridView.selectionBehavior.unselectAllOnEmptyArea = false;

                            const nodeSelectionChangeEvent = new Event("nodeSelectionChange");
                            nodeSelectionChangeEvent.detail = {};

                            function sendEvent(data) {
                                nodeSelectionChangeEvent.detail = data;
                                document.dispatchEvent(nodeSelectionChangeEvent);
                            }

                            var nodesXSO = dataGridView.getNodesXSO();
                            nodesXSO.onPostAdd(function (rowClicked) {
                                rowClicked.forEach(function (xsoElement) {
                                    xsoElement.addEventListener("buttonclick", xsoElement._options.appId);
                                    sendEvent(xsoElement._options.appId);
                                })
                            });

                            dataGridView.inject(DGVDiv);

                            return DGVDiv;
                        }
                        return null;

                    }

                }

            })

        }


        async function getAppInfo(appId) {
            appId = appId.split(".")[1];
            var newProm = new Promise(function (resolve, reject) {
                i3DXCompassPlatformServices.getAppInfo({
                    appId: appId,
                    onComplete: function (AppData) {
                       if (AppData != undefined){
                            var plat = AppData["platformId"];
                           // if (plat != undefined) {
                                var appDataObj = {
                                    "title": AppData.title,
                                    "icon": AppData.icon,
                                    "appId": AppData.id
                                }
                                resolve(appDataObj);
                        //     }
                        //    else
                        //         reject(null);
                        }
                        else
                            reject(null);  
                    }
                })
            });
            return newProm;
        }
        function callRestAPIforAppList(completeURL, methodType) {
            var dataInfo;
            var headersInfo;
            var typeInfo;
            var newProm = new Promise(function (resolve, reject) {
                WAFData.authenticatedRequest(completeURL, {
                    method: methodType,
                    type: typeInfo,
                    data: dataInfo,
                    headers: headersInfo,
                    onComplete: function (responseObject) {
                        resolve(responseObject);
                    },
                    onFailure: function (errorObject) {
                        reject(errorObject);
                    }
                });
            });
            return newProm;
        }

        async function isServiceAvailable() {
            var me = this;
            var tenantID = await getTenant();

            var newProm = new Promise(function (resolve, reject) {
                loadServiceURL.call(me, tenantID).then((urlData) => {
                    serviceURL = urlData;
                    resolve(true);
                }).catch((errorInfo) => {
                    reject(false);
                });
            });
            return newProm;
        }

        async function getTenant() {
            let tenantID = null;
            try {
                tenantID = PlatformAPI.getWidgetTenant();
            }
            catch (e) {
                tenantID = PlatformAPI.getTenant();
            }
            return tenantID;

        }

        function loadServiceURL(platformId) {
            var me = this;
            var prom = new Promise(function (resolve, reject) {
                i3DXCompassPlatformServices.getServiceUrl({
                    serviceName: 'mepreferences',
                    platformId: platformId,
                    onComplete: function (urlData) {
                        resolve(urlData);
                    },
                    onFailure: function (errorInfo) {
                        reject(errorInfo);
                    }
                });
            });
            return prom;
        }

        mePreferencesCategoryViewObj.prototype.selectAppNode = function (appID) {
            let selectedNode = null;
            model.search({
                match: function (cellInfos) {
                    if (cellInfos.nodeModel.getAttributeValue("appId") === appID) {
                        selectedNode = cellInfos.nodeModel;
                        dataGridView.selectNodeModel(selectedNode);
                    }
                }
            });

        }


        return mePreferencesCategoryViewObj;
    });
