define('DS/CfgEffectivityCommands/commands/CfgExtendEvolutionEffectivityCmd', [
    'DS/CfgBaseUX/scripts/CfgController',
    'DS/CfgTracker/CfgTracker',
    'DS/CfgTracker/CfgDimension',
    'DS/CfgTracker/CfgValue',
    'DS/CfgBaseUX/scripts/CfgUtility',
    'DS/CfgBaseUX/scripts/CfgData',
    'i18n!DS/CfgWebAppEffectivityUX/assets/nls/CfgEffectivityNLS',
    'DS/CfgEffectivityCommands/commands/CfgEffCmd',
    'DS/CfgAuthoringContextUX/scripts/CfgAuthoringContext',
    'DS/PlatformAPI/PlatformAPI',
], function (CfgController, CfgTracker, CfgDimension, CfgValue, CfgUtility, CfgData, EffectivityNLS, CfgEffCmd, CfgAuthoringContext, PlatformAPI) {
    'use strict';
    var availableEvolutionList = [];
    var CfgExtendEvolutionEffectivityCmd = CfgEffCmd.extend({
        /**
         * Override base class CfgEffCmd function for selectedNodes.length >= 1 because Extend Effectivity functionality is supported for multuiple products
         */
        _checkSelection: function () {
            //-- Init the selection
            this._SelectedID = '';

            var data = this.getData();
            if (data.selectedNodes.length >= 1) {
                this._SelectedID = data.selectedNodes[0].id || '';
                this._SelectedAlias = data.selectedNodes[0].alias || '?';
                this.isRoot = data.selectedNodes[0].isRoot;
            }

            //-- State of the command
            this._setStateCmd();
        },

        /**
         * Used to get empty Evolution Effectivity check before Extend Evolution Effectivity operation. For PCS improvement lightweight _getAvailableDemainDetails is used.
         */
        _getAvailableDemainDetails: function (instanceList) {
            var returnedPromise = new Promise(function (resolve, reject) {
                var success = function (response) {
                    for (var key in response) {
                        if (response.hasOwnProperty(key)) {
                            if (response[key].length == 2 || (response[key].length == 1 && response[key].toString() == 'Evolution')) availableEvolutionList.push(key);
                        }
                    }
                    resolve(response);
                };
                var failure = function (response) {
                    reject(response);
                };
                var inputjson = ' ';
                inputjson = {
                    version: '1.0',
                    pidList: instanceList,
                };

                var url = '/resources/modeler/configuration/expressionServices/getAvailableDomains';
                var inputjsonTxt = JSON.stringify(inputjson);

                CfgUtility.makeWSCall(url, 'POST', 'enovia', 'json', inputjsonTxt, success, failure, true);
            });
            return returnedPromise;
        },

        /**
         * Function used to send infromation to Tracker for Extend Evolution Effectivity operation.
         */
        sendExtendEvolutionTrackerEvent: function (options) {
            try {
                CfgTracker.createEventBuilder({
                    category: CfgTracker.Category['USAGE'],
                    action: CfgTracker.Events['CLICK'],
                    tenant: widget.getValue('x3dPlatformId'),
                })
                    .setLabel(CfgTracker.Labels['EXTEND_EVOLUTION_EFFECTIVITY'])
                    .setAppId(widget.data.appId || 'NO_APP_ID')
                    .addDimension(CfgDimension.EXTEND_EVOLUTION_EFFECTIVITY.EXTEND_EVOLUTION_EFFECTIVITY_WIDGET, widget.data.title || widget.options.title || 'ODT Environment')
                    .addDimension(CfgDimension.EXTEND_EVOLUTION_EFFECTIVITY.EXTEND_EVOLUTION_EFFECTIVITY_WORK_UNDER, options.authoringMode)
                    .addDimension(CfgDimension.EXTEND_EVOLUTION_EFFECTIVITY.EXTEND_EVOLUTION_EFFECTIVITY_OPERATION_STATUS, options.operationStatus)
                    .addDimension(CfgDimension.EXTEND_EVOLUTION_EFFECTIVITY.EXTEND_EVOLUTION_EFFECTIVITY_EXTEND_TYPE, options.extendType)
                    .addPersonalValue(CfgValue.EXTEND_EVOLUTION_EFFECTIVITY.EXTEND_EVOLUTION_EFFECTIVITY_SELECTED_REFERENCES, options.selectedNodesLength)
                    .addPersonalValue(CfgValue.EXTEND_EVOLUTION_EFFECTIVITY.EXTEND_EVOLUTION_EFFECTIVITY_AVAILABLE_EVOLUTION, options.availableEvolutionLength)
                    .send();
            } catch (e) {
                console.error(e);
            }
        },

        /**
         * Used to perform Extend Evolution Effectivity operation.
         */
        _processExtendEffectivityOperation: function (options) {
            var that = this;
            var data = options.data;
            var authHeaders = options.authHeaders;

            //Called after tennant and security context details are fetched.
            var getExtendEvolutionEffectivity_callback = function () {
                var instanceList = [];
                for (var i = 0; i < data.selectedNodes.length; i++) {
                    //[IR-1145388 02-Aug-2023] added unique instances as instanceList length check fails with availableEvolutionList length for duplidate instnaces.
                    let instanceId = data.selectedNodes[i].id;
                    if (instanceList.indexOf(instanceId) == -1) instanceList.push(instanceId);
                }

                var wsOptions = {
                    operationheader: {
                        key: authHeaders[0].key,
                        value: authHeaders[0].value,
                    },
                };

                //Evolution criteria enabled check is performed in method getMultipleConfigurationContextInfo for parent of all selected instances.
                let uniqueParentIDs = [];
                for (let count = 0; count < data.selectedNodes.length; count++) {
                    let parentId = data.selectedNodes[count].parentID;
                    if (uniqueParentIDs.indexOf(parentId) == -1) uniqueParentIDs.push(parentId);
                }

                //[TSK10220343 23-Oct-2023] Passed multiple unique parent ids of selected products.
                let options = { referenceIds: uniqueParentIDs, version: '1.1', xRevisionContent: true };
                CfgUtility.getMultipleConfigurationContextInfo(options).then(
                    async function (criteriaResponse) {
                        let contextResponseModelType = true;
                        if (criteriaResponse.xRevisionContent && criteriaResponse.xRevisionContent.length > 0) {
                            contextResponseModelType = false;
                        }

                        if (contextResponseModelType) {
                            if (criteriaResponse.referencesInfo != undefined) {
                                for (let counter = 0; counter < criteriaResponse.referencesInfo.length; counter++) {
                                    if (criteriaResponse.referencesInfo[counter] != undefined && criteriaResponse.referencesInfo[counter].hasConfigContext == 'NO') {
                                        //error message for context not attached to parent reference.
                                        CfgUtility.showNotifs('error', EffectivityNLS.CFG_Extend_Failure_Header, EffectivityNLS.CFG_Extend_No_Context_SubTitle, EffectivityNLS.CFG_Extend_No_Context_Message);
                                        that.enable();
                                        return;
                                    }
                                }

                                let extendCriteria = [];
                                if (criteriaResponse.enabledCriteria && criteriaResponse.enabledCriteria.length > 0) {
                                    for (let counter = 0; counter < criteriaResponse.enabledCriteria.length; counter++) {
                                        if (criteriaResponse.enabledCriteria[counter].criteriaName != 'feature') {
                                            extendCriteria.push(criteriaResponse.enabledCriteria[counter].criteriaName);
                                        }
                                    }
                                }

                                CfgData.extendEvolutionCriteria = extendCriteria;

                                if (CfgData.extendEvolutionCriteria != undefined && CfgData.extendEvolutionCriteria.length > 0) {
                                    availableEvolutionList = [];
                                    // For PCS improvement lightweight _getAvailableDemainDetails is used to check Evolution Effectivity is present or not.
                                    await that._getAvailableDemainDetails(instanceList);
                                } else {
                                    //error message for No Evolution criteria selected.
                                    CfgUtility.showwarning(EffectivityNLS.CFG_Extend_No_Criteria, 'error');
                                    that.enable();
                                }
                            }
                        }

                        //All products should have Evolution Effectivity then only passed for Extend operation.
                        if (availableEvolutionList.length == instanceList.length || contextResponseModelType == false) {
                            var returnedPromiseEff = new Promise(function (resolve, reject) {
                                let jsonData = {
                                    version: '1.0',
                                    resources: instanceList,
                                };

                                let url = '/resources/modeler/configuration/authoringServices/extendEffectivities';
                                let postdata = JSON.stringify(jsonData);
                                //[IR-951371 02-Jun-2022] show modeler error message
                                let failure = function (jsonresponse1, error) {
                                    var jsonresponse = error ? error : jsonresponse1;
                                    reject(jsonresponse);
                                };
                                let onCompleteCallBack = function (extendEffectivitiesResponse) {
                                    resolve(extendEffectivitiesResponse);
                                };
                                CfgUtility.makeWSCall(url, 'POST', 'enovia', 'application/json', postdata, onCompleteCallBack, failure, true, wsOptions);
                            });

                            //After Extend Evolution Effectiviy operation, Effectivity modification event is published to refresh update Effectivity column values.
                            returnedPromiseEff.then(
                                function (response) {
                                    that.enable();
                                    if (response.globalStatus != undefined) {
                                        let authoringMode = wsOptions.operationheader.key;
                                        let operationStatus = response.globalStatus;
                                        let selectedNodesLength = availableEvolutionList.length;
                                        let availableEvolutionLength = instanceList.length;
                                        let extendType = 'Model';
                                        if (contextResponseModelType == false) {
                                            extendType = 'xRevision';
                                        }
                                        let probesOptions = { authoringMode: authoringMode, operationStatus: operationStatus, selectedNodesLength: selectedNodesLength, availableEvolutionLength: availableEvolutionLength, extendType: extendType };

                                        if (response.globalStatus != undefined && response.globalStatus != 'ERROR') {
                                            //Publish Effectivity modification event for Extend Effectivity details
                                            var refreshEventMessage = {
                                                commandName: 'cfgExtendEvolutionEffectivity',
                                                widgetId: widget.id,
                                                response: response,
                                                data: {},
                                            };

                                            CfgUtility.publishPostProcessingEventForApplications(refreshEventMessage);
                                        }

                                        if (response.globalStatus == 'SUCCESS') {
                                            CfgUtility.showwarning(EffectivityNLS.CFG_Extend_Successful, 'success');
                                        } else if (response.globalStatus == 'ERROR') {
                                            CfgUtility.showwarning(EffectivityNLS.CFG_Extend_Failure, 'error');
                                        } else if (response.globalStatus == 'ATLEAST_ONEFAILURE') {
                                            CfgUtility.showwarning(EffectivityNLS.CFG_Extend_PartialSuccessful, 'info');
                                        }

                                        that.sendExtendEvolutionTrackerEvent(probesOptions);

                                        //[Magic cloud probes]
                                        let magicAppId = 'defaultAppID';
                                        let magicAppName = 'ODT Environment';
                                        if (widget && widget.data && widget.data.appId) {
                                            magicAppId = widget.data.appId;
                                        }
                                        if (widget && widget.options && widget.options.title) {
                                            magicAppName = widget.options.title;
                                        }

                                        let mProbesOptions = {
                                            AppId: magicAppId,
                                            AppName: magicAppName,
                                            CommandName: CfgTracker.Labels['EXTEND_EVOLUTION_EFFECTIVITY'],
                                            CommandOperation: 'Extend_Evolution_Effectivity_Operation',
                                            ConfigMode: CfgTracker.ConfigMode['CONTEXTUAL'],
                                            ApplicationMode: CfgTracker.ApplicationMode['DASHBOARD'],
                                        };
                                        CfgUtility.sendConfgurationCommandsClickEventForMagicProbes(mProbesOptions);
                                    }
                                },
                                function (errorResponse) {
                                    if (errorResponse && errorResponse.errorMessage) {
                                        CfgUtility.showwarning(errorResponse.errorMessage, 'error'); //[IR-951371 02-Jun-2022] show error message from modeler
                                    }
                                    that.enable();
                                }
                            );
                        } else {
                            //error message for empty Evolution Effectivity is shown.
                            CfgUtility.showNotifs('error', EffectivityNLS.CFG_Extend_Failure_Header, EffectivityNLS.CFG_Extend_No_Evolution_SubTitle, EffectivityNLS.CFG_Extend_No_Evolution_Message);
                            that.enable();
                        }
                    },
                    function () {
                        that.enable();
                        CfgUtility.showwarning(EffectivityNLS.CFG_Service_Fail, 'error');
                    }
                );
            };

            CfgController.init();

            if (widget.getValue('x3dPlatformId')) enoviaServerFilterWidget.tenant = widget.getValue('x3dPlatformId');
            else enoviaServerFilterWidget.tenant = 'OnPremise';

            CfgUtility.populate3DSpaceURL().then(function () {
                CfgUtility.populateSecurityContext().then(function () {
                    getExtendEvolutionEffectivity_callback();
                });
            });
        },
        /*
         * Don't overload it. Method execute is called when user clicks Extend Evolution Effectivity command
         */
        execute: function () {
            var that = this;
            that.disable();
            //User selection for Extend Evolution Effectivity operation.
            var data = that.getData();

            //For valid single / multiple child selection Extend Evolution Effectivity operation is supported.
            if (data.selectedNodes && data.selectedNodes.length > 0) {
                //Check work under authoring context details for Extend Evolution Effectivity operation.
                var authHeaders = [];
                var cfg = CfgAuthoringContext.get();
                if (cfg && cfg.AuthoringContextHeader) {
                    for (var key in cfg.AuthoringContextHeader) {
                        authHeaders.push({
                            key: key,
                            value: cfg.AuthoringContextHeader[key],
                        });
                    }
                }

                if (authHeaders.length == 0) {
                    that.enable();
                    CfgUtility.showwarning(EffectivityNLS.CFG_Extend_With_Session_Allowed, 'error');
                    return;
                }

                var options = { data: data, authHeaders: authHeaders };
                that._processExtendEffectivityOperation(options);
            }
        },
    });

    return CfgExtendEvolutionEffectivityCmd;
});
