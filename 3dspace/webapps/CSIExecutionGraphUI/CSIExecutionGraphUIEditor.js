/* eslint-disable dot-notation */
/// <amd-module name='DS/CSIExecutionGraphUI/CSIExecutionGraphUIEditor'/>
define("DS/CSIExecutionGraphUI/CSIExecutionGraphUIEditor", ["require", "exports", "DS/EPSSchematicsUI/EPSSchematicsUIEditor", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "DS/EPSSchematicsCSI/EPSSchematicsCSIExport", "DS/CSIExecutionGraphUI/controllers/CSIEGUIBlockConverterController", "DS/CSIExecutionGraphUI/dialogs/CSIEGUISaveGraphDialog", "DS/EPEventServices/EPEventServices", "DS/EPSSchematicEngine/EPSSchematicsExecutionEvents", "DS/EPSSchematicsCSI/EPSSchematicsCSIImport", "DS/EPSSchematicsCSI/EPSSchematicsCSITypeCastConfig", "DS/CSIExecutionGraphUI/tools/CSIEGUIEvents", "DS/EPSSchematicsCSI/typings/CSICommandBinder/EPSSCSICommandBinder"], function (require, exports, EPSSchematicsUIEditor, UITools, TypeLibrary, CSIExport, CSIEGUIBlockConverterController, CSIEGUISaveGraphDialog, EventServices, ExecutionEvents, CSIImport, CSITypeCastConfig, CSIEGUIEvents, CSI) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines the CSI Execution Graph Editor.
     * @class CSIExecutionGraphUIEditor
     * @alias module:DS/CSIExecutionGraphUI/CSIExecutionGraphUIEditor
     * @extends EPSSchematicsUIEditor
     * @protected
     */
    class CSIExecutionGraphUIEditor extends EPSSchematicsUIEditor {
        /**
         * @constructor
         * @param {IEditorOptions} options - The editor options.
         */
        constructor(options) {
            super(UITools.mergeObject({
                hideOutputLocalDataDrawer: true,
                defaultLibrary: false,
                hideDefaultGraph: true,
                rootInputDataDefaultValueSettable: false,
                enableFramebreaks: false,
                templates: {
                    enableLocalTemplates: false,
                    enableGlobalTemplates: false
                },
                hideGraphToolbarButton: 8 /* UIEnums.FGraphToolbarButton.fGraphAnalyzer */,
                expandGraphToolbarButton: 1 /* UIEnums.FGraphToolbarButton.fLoad */ | 2 /* UIEnums.FGraphToolbarButton.fSave */,
                modules: [
                    'DS/EPSSchematicsCSI/EPSSchematicsCSIGraphBlock',
                    'DS/EPSSchematicsCSI/EPSSchematicsCSIJavaScriptBlock',
                    'DS/EPSSchematicsCSI/EPSSchematicsCSIPythonBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayConcatBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayFilterBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayGetBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayGetIndexBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayInsertBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayIteratorBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayLengthBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayMapBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayPopBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayPushBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayRemoveBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArraySetBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayShiftBlock',
                    'DS/EPSSchematicsCoreLibrary/array/EPSArrayUnshiftBlock',
                    'DS/EPSSchematicsCoreLibrary/flow/EPSIfBlock',
                    'DS/EPSSchematicsCoreLibrary/flow/EPSSyncFlowsBlock',
                    'DS/EPSSchematicsCoreLibrary/flow/EPSJoinAllBlock',
                    'DS/EPSSchematicsCoreLibrary/flow/EPSOnlyOneBlock',
                    'DS/EPSSchematicsCoreLibrary/calculator/EPSAddBlock',
                    'DS/EPSSchematicsCoreLibrary/calculator/EPSDivideBlock',
                    'DS/EPSSchematicsCoreLibrary/calculator/EPSIsEqualBlock',
                    'DS/EPSSchematicsCoreLibrary/calculator/EPSMultiplyBlock',
                    'DS/EPSSchematicsCoreLibrary/calculator/EPSSetValueBlock',
                    'DS/EPSSchematicsCoreLibrary/calculator/EPSSubstractBlock'
                ],
                onSave: () => this.onDefaultSaveButtonClick()
            }, options, false));
            TypeLibrary.registerTypeCastConfig(CSITypeCastConfig);
            CSIEGUIBlockConverterController.registerBlockConverters();
            this._saveGraphDialog = new CSIEGUISaveGraphDialog(this);
        }
        /**
         * Removes the editor.
         * @public
         */
        remove() {
            if (this._saveGraphDialog) {
                this._saveGraphDialog.remove();
                this._saveGraphDialog = undefined;
            }
            this._jsonDescription = undefined;
            this._tempRecordInfo = undefined;
            this._tempProgressesRef = undefined;
            this._poolFromRecord = undefined;
            super.remove();
        }
        /**
         * Gets the editor JSON function.
         * @public
         * @param {boolean} exportUI - True to export the UI part else false.
         * @returns {string} The editor JSON function.
         */
        getJSONFunction(exportUI) {
            let json = CSIExport.generateJSON(this.getGraphModel(), this._getJSONVersion());
            if (this._jsonDescription || exportUI) {
                const parsedJson = JSON.parse(json);
                if (this._jsonDescription) {
                    parsedJson.desc = this._jsonDescription;
                }
                if (exportUI) {
                    parsedJson.implementation.settings.implementation.ui = this.getContent();
                }
                json = JSON.stringify(parsedJson);
            }
            EventServices.dispatchEvent(new ExecutionEvents.TraceStopEvent());
            return json;
        }
        /**
         * Sets the editor JSON function.
         * @public
         * @param {string} content - The editor JSON function.
         * @param {string} [fileName] - The name of the JSON function.
         */
        setJSONFunction(content, fileName) {
            var _a, _b, _c, _d, _e;
            this._jsonDescription = undefined;
            this._tempProgressesRef = undefined;
            this._poolFromRecord = undefined;
            // Loads the json content
            let jsonContent = JSON.parse(content);
            // Importing CSI Record
            let inputs, outputs, expected;
            const jsonRecord = jsonContent;
            if (jsonRecord && jsonRecord['function']) {
                inputs = jsonRecord.inputs;
                outputs = jsonRecord.outputs;
                expected = jsonRecord.expected;
                if (Array.isArray(jsonRecord.progresses) && jsonRecord.progresses.length > 0) {
                    this._tempProgressesRef = [];
                    jsonRecord.progresses.forEach(progress => this._tempProgressesRef.push(CSIExecutionGraphUIEditor._stringifyExportedParameters(progress)));
                }
                if (jsonRecord.poolToSelect) {
                    this._poolFromRecord = jsonRecord.poolToSelect;
                }
                jsonContent = jsonRecord['function'];
                if (fileName) {
                    fileName = fileName.replace('.csirecord', '');
                }
            }
            // Importing CSI function
            const jsonFunction = jsonContent;
            if (jsonFunction && jsonFunction.implementation && jsonFunction.implementation.name === 'executionGraph') {
                this._jsonDescription = jsonFunction.desc;
                let schematicsJSONObject, schematicsJSONString;
                if ((_a = jsonFunction === null || jsonFunction === void 0 ? void 0 : jsonFunction.implementation) === null || _a === void 0 ? void 0 : _a.version) {
                    this._setJSONVersion((_b = jsonFunction === null || jsonFunction === void 0 ? void 0 : jsonFunction.implementation) === null || _b === void 0 ? void 0 : _b.version);
                }
                if ((_e = (_d = (_c = jsonFunction === null || jsonFunction === void 0 ? void 0 : jsonFunction.implementation) === null || _c === void 0 ? void 0 : _c.settings) === null || _d === void 0 ? void 0 : _d.implementation) === null || _e === void 0 ? void 0 : _e.ui) {
                    schematicsJSONObject = JSON.parse(jsonFunction.implementation.settings.implementation.ui);
                    if (schematicsJSONObject.hasOwnProperty('version')) {
                        schematicsJSONString = jsonFunction.implementation.settings.implementation.ui;
                    }
                }
                let hasError = false;
                if (schematicsJSONString === undefined) {
                    CSIImport.buildFromJSONObject(this.getGraphModel(), jsonFunction);
                    if (fileName) {
                        this.getGraphModel().setName(fileName);
                    }
                    if (schematicsJSONObject !== undefined) {
                        try {
                            this.getViewerController().getRootViewer().getMainGraph().fromJSON(schematicsJSONObject);
                        }
                        catch (error) {
                            hasError = true;
                            this.displayNotification({
                                level: 'error',
                                title: 'Import UI error (inconsistent UI and Model):',
                                message: error
                            });
                            // eslint-disable-next-line no-console
                            console.error(error);
                            const importErrorEvent = new CSIEGUIEvents.CSIEGUIImportErrorEvent();
                            importErrorEvent.error = error;
                            this.dispatchEvent(importErrorEvent);
                        }
                    }
                    else {
                        this.getViewerController().getRootViewer().getMainGraph().setDefaultBlocksPosition(); // TODO: Private function!
                    }
                }
                else {
                    this._setContent(schematicsJSONString);
                    if (fileName) {
                        this.getGraphModel().setName(fileName); // fileName vs graphName ?
                    }
                }
                if (!hasError) {
                    if (schematicsJSONString !== undefined) {
                        this._setTestValuesFromDefaultValue();
                    }
                    if (inputs) {
                        const inputsParameters = CSI.createParameters();
                        if (inputsParameters.importFromString(JSON.stringify(inputs))) {
                            const callDataPort = this.getGraphModel().getDataPortByName('Call');
                            callDataPort.setTestValues([inputsParameters.toJSObject()]);
                        }
                    }
                    if (outputs) {
                        const expectedDataPortName = expected.charAt(0).toUpperCase() + expected.slice(1);
                        const outputDataPort = this.getGraphModel().getDataPortByName(expectedDataPortName);
                        const outputsParameters = CSI.createParameters();
                        if (outputsParameters.importFromString(JSON.stringify(outputs))) {
                            let testValue = outputsParameters.toJSObject();
                            if (expected === 'error') {
                                testValue = testValue.data;
                            }
                            outputDataPort.setTestValues([testValue]);
                        }
                    }
                }
            }
            else {
                this._setContent(content);
                this._setTestValuesFromDefaultValue();
            }
        }
        /**
         * The default callback on the save button click.
         * @public
         */
        onDefaultSaveButtonClick() {
            this._saveGraphDialog.open();
        }
        /**
         * Gets the save graph dialog.
         * @public
         * @returns {CSIEGUISaveGraphDialog} The save graph dialog.
         */
        getSaveGraphDialog() {
            return this._saveGraphDialog;
        }
        /**
         * Gets the pool name used by the record.
         * @public
         * @returns {string} The pool name used by the record.
         */
        getPoolFromRecord() {
            return this._poolFromRecord;
        }
        /**
         * (DO NOT USE) Gets the temporary record information.
         * @private
         * @ignore
         * @returns {ITempRecordInfo} The temporary record information.
         */
        _getTempRecordInfo() {
            return this._tempRecordInfo;
        }
        /**
         * (DO NOT USE) Sets the temporary record information.
         * @private
         * @ignore
         * @param {string} poolName - The pool name.
         * @param {string} expectedStatus - The expected status.
         * @param {object} inputs - The inputs test values.
         * @param {object} outputs - The outputs test values.
         * @param {object[]} progresses - The progresses test values.
         */
        _setTempRecordInfo(poolName, expectedStatus, inputs, outputs, progresses) {
            this._tempRecordInfo = {
                poolName: poolName,
                expectedStatus: expectedStatus,
                inputs: inputs,
                outputs: outputs,
                progresses: progresses
            };
        }
        /**
         * (DO NOT USE) Gets the temporary progresses reference.
         * @private
         * @ignore
         * @returns {string[]} The progresses reference.
         */
        _getTempProgressesRef() {
            return this._tempProgressesRef;
        }
        /**
         * (DO NOT USE) Sets the temporary progresses reference.
         * @private
         * @ignore
         * @param {string[]} progressesRef - The progresses reference.
         */
        _setTempProgressesRef(progressesRef) {
            this._tempProgressesRef = progressesRef;
        }
        /**
         * Stringifies the provided exported parameters.
         * @public
         * @static
         * @param {object} parameters - The exported parameters.
         * @returns {string} The stringified CSI parameters.
         */
        static _stringifyExportedParameters(parameters) {
            let result;
            const refParameters = CSI.createParameters();
            if (refParameters.importFromString(JSON.stringify(parameters))) {
                const jsObject = refParameters.toJSObject();
                result = JSON.stringify(jsObject, undefined, 2);
            }
            return result;
        }
        /**
         * Sets test values from default value.
         * @private
         */
        _setTestValuesFromDefaultValue() {
            const callDataPort = this.getGraphModel().getDataPortByName('Call');
            if (callDataPort.isOverride()) { // TMP for old json since new test values
                callDataPort.setTestValues([callDataPort.getDefaultValue()]);
                callDataPort.resetDefaultValue();
            }
        }
        /**
         * Sets the editor content.
         * @private
         * @param {string} content - The JSON string representing the graph content.
         */
        _setContent(content) {
            try {
                super.setContent(content);
            }
            catch (error) {
                this.displayNotification({
                    level: 'error',
                    title: 'Obsolete version',
                    subtitle: 'The file cannot be loaded.',
                    message: 'This version of json file is not valid anymore: you can visit help section for more informations.'
                });
                // eslint-disable-next-line no-console
                console.error(error);
                const errorEvent = new CSIEGUIEvents.CSIEGUIImportErrorEvent();
                errorEvent.error = error;
                this.dispatchEvent(errorEvent);
            }
        }
    }
    return CSIExecutionGraphUIEditor;
});
