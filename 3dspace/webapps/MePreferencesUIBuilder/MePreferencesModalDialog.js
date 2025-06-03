define('DS/MePreferencesUIBuilder/MePreferencesModalDialog',
    ["DS/Windows/ImmersiveFrame",
        "DS/Windows/Dialog",
        'DS/Notifications/NotificationsManagerUXMessages',
        'DS/Notifications/NotificationsManagerViewOnScreen',
        'DS/WAFData/WAFData',
        'DS/MePreferencesUIBuilder/MePreferencesUIBuilder',
        "DS/MePreferencesUIBuilder/MePreferencesModel",
        'DS/Controls/Button',
        'i18n!DS/MePreferencesUIBuilder/assets/nls/translation',
        'DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices',
        'DS/WebappsUtils/WebappsUtils',
        "DS/MePreferencesUIBuilder/MePreferencesPageView",
        "DS/PlatformAPI/PlatformAPI",
        "DS/Utilities/Dom"
    ],
    function (WUXImmersiveFrame, WUXDialog, NotificationsManagerUXMessages, WUXNotificationsManagerViewOnScreen, WAFData, MePreferencesUIBuilder, MePreferencesModel, WUXButton, mePrefUITranslation, i3DXCompassPlatformServices, WebappsUtils, MePreferencesPageView, PlatformAPI, Dom) {

        var WRITE_PREFERENCE_ENDPOINT = "/api/v1/preferences";
        var serviceurl = null;

        window.notifs = NotificationsManagerUXMessages;
        WUXNotificationsManagerViewOnScreen.setNotificationManager(window.notifs);
        WUXNotificationsManagerViewOnScreen.setStackingPolicy(1);

        var mePreferencesPageViewObj = new MePreferencesPageView();
        var mePreferenceUIBuilderObj = new MePreferencesUIBuilder();
        var mePreferencesModelObj = new MePreferencesModel();
        var immersiveFrame = null;
        var UIModalDialog = null;
        var prefUpdateSubInst = null;
        var adminProfUpdateSubInst = null;

        const removeImmEvent = new Event("ImmFrameRemoved");

        var MePreferenceModalDialog = {
            getMePreferenceDialog: async function (appID) {


                immersiveFrame = new WUXImmersiveFrame({
                    identifier: "me-preference-dialog-immersive-frame"
                });

                return isServiceAvailable().then(async () => {

                    // Creates UIDialog using createUI method from MePrefernceUIBuilder.js

                    var dialogDiv = new UWA.Element("div", {
                        styles: {
                            width: "100%",
                            height: "100%"
                        }
                    });


                    UIModalDialog = new WUXDialog({
                        width: 400,
                        immersiveFrame: immersiveFrame,
                        title: mePrefUITranslation["Preferences.Title"],
                        content: dialogDiv,
                        activeFlag: false,
                        modalFlag: true,
                        resizableFlag: true,
                        position: {
                            my: "center",
                            at: "center",
                            of: immersiveFrame
                        },
                        identifier: "me-preference-dialog-" + appID,
                        buttons: {
                            Close: new WUXButton({
                                onClick: function (e) {
                                    prefUpdateSubInst.unsubscribe();
                                    adminProfUpdateSubInst.unsubscribe();
                                    mePreferenceUIBuilderObj.reset();
                                    UIModalDialog.close();
                                    UIModalDialog.destroy();
                                    UIModalDialog = null;
                                    removeImmersiveFrame();
                                }
                            }),
                            Save: new WUXButton({
                                onClick: function (e) {
                                    prefUpdateSubInst.unsubscribe();
                                    adminProfUpdateSubInst.unsubscribe();
                                    savePreferences();
                                    saveTablePreferences();
                                    UIModalDialog.close();
                                    UIModalDialog.destroy();
                                    UIModalDialog = null;
                                    removeImmersiveFrame();
                                }
                            })
                        }

                        //In production dispatch the event, and save it.
                        //modalDialog.close();
                    });
                    //Admin Notification
                    adminProfUpdateSubInst = PlatformAPI.subscribe("com.ds.mep:onAdminProfUpdate", function (data) {
                        let element = "tenantId";
                        let tenantID = null;

                        data.forEach(Obj => {
                            if (Obj.hasOwnProperty(element)) {
                                tenantID = Obj[element];
                            }

                        });
                        if (tenantID == (PlatformAPI.getWidgetTenant())) {
                            createAdminWarningDialog();
                        } else if (tenantID == (PlatformAPI.getTenant())) {
                            createAdminWarningDialog();
                        }
                    });

                    var adminWarningDialog = null;
                    var userWarningDialog = null;

                    var baseURL = WebappsUtils.getWebappsBaseUrl();
                    var adminMsgDialogIcon = Dom.generateIcon({
                        iconPath: baseURL + "MePreferencesUIBuilder/assets/icons/warningIcn.png",
                        iconSize: {
                            height: "26px",
                            width: "26px"
                        }
                    });

                    var adminMessageContentDiv = new UWA.createElement("div", {
                        class: "admin-message-div",
                        styles: {
                            display: "flex"
                        }
                    });

                    function createAdminWarningDialog() {
                        if (!adminWarningDialog) {
                            var adminMessage = new UWA.Element("span", {
                                class: "adminMessageSpanClass",
                                text: mePrefUITranslation["adminUserNotification.Title"],
                                styles: {
                                    align_self: "center",
                                    padding_left: "5px"
                                }
                            })
                            adminMsgDialogIcon.inject(adminMessageContentDiv);
                            adminMessage.inject(adminMessageContentDiv);

                            adminWarningDialog = new WUXDialog({
                                width: 350,
                                immersiveFrame: immersiveFrame,
                                identifier: "mep-admin-message-dialog",
                                content: adminMessageContentDiv,
                                activeFlag: false,
                                modalFlag: true,
                                position: {
                                    my: "center",
                                    at: "center",
                                    of: immersiveFrame
                                },
                                buttons: {
                                    Close: new WUXButton({
                                        domId: "mep-admin-message-cancel",
                                        onClick: function (e) {

                                            adminWarningDialog.destroy();
                                            adminWarningDialog = null;
                                        }
                                    })
                                }
                            })
                            adminWarningDialog.addEventListener("close", function () {
                                adminWarningDialog.destroy();
                                adminWarningDialog = null;
                            })

                            immersiveFrame.inject(document.body);
                        };
                    }
                    //User Notification
                    prefUpdateSubInst = PlatformAPI.subscribe("com.ds.mep:onPrefUpdate", function (data) {
                        let element = "tenantId";
                        let tenantID = null;

                        data.forEach(Obj => {
                            if (Obj.hasOwnProperty(element)) {
                                tenantID = Obj[element];
                            }

                        });

                        if (tenantID == (PlatformAPI.getWidgetTenant())) {
                            createUserWarningDialog();
                        } else if (tenantID == (PlatformAPI.getTenant())) {
                            createUserWarningDialog();
                        }

                    });

                    function createUserWarningDialog() {
                        if (!userWarningDialog) {
                            var userMessage = new UWA.Element("span", {
                                class: "userMessageSpanClass",
                                text: mePrefUITranslation["userNotification.Title"],
                                styles: {
                                    align_self: "center",
                                    padding_left: "5px"
                                }
                            })

                            adminMsgDialogIcon.inject(adminMessageContentDiv);
                            userMessage.inject(adminMessageContentDiv);

                            userWarningDialog = new WUXDialog({
                                width: 350,
                                immersiveFrame: immersiveFrame,
                                identifier: "mep-user-message-dialog",
                                content: adminMessageContentDiv,
                                activeFlag: false,
                                modalFlag: true,
                                position: {
                                    my: "center",
                                    at: "center",
                                    of: immersiveFrame
                                },
                                buttons: {
                                    Close: new WUXButton({
                                        domId: "mep-user-message-cancel",
                                        onClick: function (e) {
                                            userWarningDialog.destroy();
                                            userWarningDialog = null;
                                        }
                                    })
                                }
                            })
                            userWarningDialog.addEventListener("close", function () {
                                userWarningDialog.destroy();
                                userWarningDialog = null;
                            })
                            immersiveFrame.inject(document.body);
                        }
                    }


                    UIModalDialog.getContent().setAttribute("data-me-preferences-po-use-only-dialog-id", "me-preference-dialog-" + appID);
                    let isAdminView = false;
                    await mePreferencesPageViewObj.getMePreferencePageView(serviceurl, appID, dialogDiv, isAdminView);

                    if (UIModalDialog) {
                        var mePrefDialogCloseButton = UIModalDialog.elements._closeButton;
                        mePrefDialogCloseButton.addEventListener('click', function () {
                            prefUpdateSubInst.unsubscribe();
                            adminProfUpdateSubInst.unsubscribe();
                            mePreferenceUIBuilderObj.reset();
                            UIModalDialog.close();
                            UIModalDialog.destroy();
                            UIModalDialog = null;
                            removeImmersiveFrame();
                        });
                    }
                    //Load CSS
                    loadCSS();

                    return immersiveFrame;
                });
            }
        }

        //function to load css
        function loadCSS() {
            var path = WebappsUtils.getWebappsBaseUrl() + "MePreferencesUIBuilder/MePreferencesUIDialog.css";
            var linkElem = new UWA.createElement('link', {
                'rel': 'stylesheet',
                'type': 'text/css',
                'href': path
            });
            document.getElementsByTagName('head')[0].appendChild(linkElem);
        }

        function removeImmersiveFrame() {
            //Get all immersive frames present in the application.
            var immFramesList = document.getElementsByClassName('wux-windows-immersive-frame');
            for (let it = 0; it < immFramesList.length; it++) {
                let immFrame = immFramesList[it];
                //Remove the immersive frame added for MePreferenceDialog 
                if (immFrame.dsModel.identifier == "me-preference-dialog-immersive-frame") {
                    immFrame.remove();
                    break;
                }
            }
            immersiveFrame = null;
            document.dispatchEvent(removeImmEvent);
        }

        async function savePreferences() {
            var savedModel = mePreferencesModelObj.getUpdatedPreferences();
            var repoArray = new Array();

            if ((savedModel) && (savedModel.length != 0)) {
                for (var i = 0; i < Object.keys(savedModel).length; i++) {
                    var tempArray = new Array();
                    var tempObj = {};
                    tempObj["name"] = savedModel[i].preferenceNames;
                    tempObj["value"] = (savedModel[i].preferenceValue).toString();
                    tempArray.push(tempObj);

                    var repoObject = {};
                    repoObject["name"] = savedModel[i].repository;
                    repoObject["preferences"] = tempArray;

                    repoArray.push(repoObject);
                }
                var repoObj = { "repositories": repoArray };

                await writepreferences(repoObj);
            }
            else {
                return null;
            }
        }

        async function saveTablePreferences() {

            var savedTableModel = mePreferenceUIBuilderObj.getUpdatedTablePreferences();
            var repoArray = new Array();
            if ((savedTableModel) && (savedTableModel.length != 0)) {
                for (var i = 0; i < Object.keys(savedTableModel).length; i++) {
                    var tempArray = new Array();
                    var tempObj = {};
                    tempObj["name"] = savedTableModel[i].preferenceNames;
                    tempObj["value"] = (savedTableModel[i].preferenceValue).toString();
                    tempArray.push(tempObj);

                    var repoObject = {};
                    repoObject["name"] = savedTableModel[i].repository;
                    repoObject["preferences"] = tempArray;

                    repoArray.push(repoObject);
                }
                var repoObj = { "repositories": repoArray };


                await writepreferences(repoObj);
                mePreferenceUIBuilderObj.reset();
            }
            else {
                mePreferenceUIBuilderObj.reset();
                return null;
            }
        }

        function retrievePlatformId() {
            return widget.data['x3dPlatformId'];
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

        function isServiceAvailable() {
            var me = this;
            var newProm = new Promise(function (resolve, reject) {
                loadServiceURL.call(me, retrievePlatformId()).then((urlData) => {
                    serviceurl = urlData;
                    resolve(true);
                }).catch((errorInfo) => {
                    reject(false);
                });
            });
            return newProm;
        }

        async function writepreferences(requestBody) {
            var completeURL = "";

            completeURL = serviceurl + WRITE_PREFERENCE_ENDPOINT;
            callRestAPI.call(this, requestBody, completeURL, 'PUT').then((data) => {
                return data;
            }).catch((errorInfo) => {
                return null;
            });
        }

        function callRestAPI(requestBody, completeURL, methodType) {
            //To do in future: pass entire options object
            var dataInfo;
            var headersInfo;
            var typeInfo;
            if (requestBody) {
                dataInfo = JSON.stringify(requestBody);
                headersInfo = {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip, deflate, br'
                };
                typeInfo = 'json';
            }
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

        document.addEventListener("ModelDataUpdated", (e) => {
            mePreferencesModelObj.update(e.detail[0], e.detail[1], e.detail[2]);
        });

        return MePreferenceModalDialog;
    }
);




