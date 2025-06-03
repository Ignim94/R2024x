/// <amd-module name='DS/CSIExecutionGraphUI/dialogs/CSIEGUISaveRecordAdvancedDialog'/>
define("DS/CSIExecutionGraphUI/dialogs/CSIEGUISaveRecordAdvancedDialog", ["require", "exports", "DS/CSIExecutionGraphUI/dialogs/CSIEGUIAbstractSaveRecordDialog", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/Controls/Button", "DS/Controls/Toggle", "DS/EPSSchematicsUI/typings/WebUX/controls/EPSWUXComboBox", "DS/Controls/LineEditor", "DS/CSIExecutionGraphUI/datagrids/CSIEGUINodesConfigurationDataGridView", "css!DS/CSIExecutionGraphUI/sass/dialogs/CSIEGUISaveRecordAdvancedDialog"], function (require, exports, CSIEGUIAbstractSaveRecordDialog, UIDom, WUXButton, WUXToggle, WUXComboBox, WUXLineEditor, CSIEGUINodesConfigurationDataGridView) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a CSI Execution Graph UI save record advanced dialog.
     * @class CSIEGUISaveRecordAdvancedDialog
     * @alias module:DS/CSIExecutionGraphUI/dialogs/CSIEGUISaveRecordAdvancedDialog
     * @extends CSIEGUIAbstractSaveRecordDialog
     * @private
     */
    class CSIEGUISaveRecordAdvancedDialog extends CSIEGUIAbstractSaveRecordDialog {
        /**
         * @constructor
         * @param {CSIExecutionGraphUIEditor} editor - The CSI Execution Graph UI editor.
         * @param {CSIEGUISaveGraphDialog} saveCSIGraphDialog - The save graph dialog.
         */
        constructor(editor, saveCSIGraphDialog) {
            super({
                title: 'Save CSI Record (advanced)',
                className: 'csiegui-save-record-advanced-dialog',
                icon: 'floppy',
                immersiveFrame: editor.getImmersiveFrame(),
                modalFlag: true,
                width: 500,
                height: 420
            }, editor, saveCSIGraphDialog);
            this._options.buttonsDefinition.Save = {
                label: 'Advanced Save',
                onClick: this._onAdvancedSaveButtonClick.bind(this)
            };
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                             ____  _   _ ____  _     ___ ____                                   //
        //                            |  _ \| | | | __ )| |   |_ _/ ___|                                  //
        //                            | |_) | | | |  _ \| |    | | |                                      //
        //                            |  __/| |_| | |_) | |___ | | |___                                   //
        //                            |_|    \___/|____/|_____|___\____|                                  //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Removes the dialog.
         * @public
         */
        remove() {
            super.remove();
            this._declarativeFunctionToggle = undefined;
            this._testInputsToggle = undefined;
            this._poolToSelectToggle = undefined;
            this._poolToSelectLineEditor = undefined;
            this._expectedStatusToggle = undefined;
            this._expectedStatusComboBox = undefined;
            this._expectedOutputRefToggle = undefined;
            this._expectedProgressesToggle = undefined;
            this._nodesConfigurationToggle = undefined;
            if (this._dataGridView !== undefined) {
                this._dataGridView.remove();
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                      ____  ____   ___ _____ _____ ____ _____ _____ ____                        //
        //                     |  _ \|  _ \ / _ \_   _| ____/ ___|_   _| ____|  _ \                       //
        //                     | |_) | |_) | | | || | |  _|| |     | | |  _| | | | |                      //
        //                     |  __/|  _ <| |_| || | | |__| |___  | | | |___| |_| |                      //
        //                     |_|   |_| \_\\___/ |_| |_____\____| |_| |_____|____/                       //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Creates the dialog content.
         * @protected
         */
        _onCreateContent() {
            UIDom.createElement('div', {
                className: 'csiegui-content-title',
                textContent: 'Edit the advanced setting of your unit test',
                parent: this._content
            });
            this._declarativeFunctionToggle = new WUXToggle({
                type: 'checkbox', label: 'CSI Declarative Function', value: 0, checkFlag: true, disabled: false
            }).inject(this._content);
            this._testInputsToggle = new WUXToggle({
                type: 'checkbox', label: 'Test Inputs CSI Parameters', value: 1, checkFlag: true, disabled: false
            }).inject(this._content);
            const tmpRecordInfo = this._editor._getTempRecordInfo();
            const poolName = tmpRecordInfo.poolName;
            const poolToSelectElt = UIDom.createElement('div', {
                className: 'csiegui-pool-to-select',
                parent: this._content
            });
            this._poolToSelectToggle = new WUXToggle({
                type: 'checkbox', label: 'Pool to select', value: 2, checkFlag: true, disabled: false
            }).inject(poolToSelectElt);
            this._poolToSelectToggle.addEventListener('change', () => { this._poolToSelectLineEditor.disabled = !this._poolToSelectLineEditor.disabled; });
            this._poolToSelectLineEditor = new WUXLineEditor({
                placeholder: 'Enter the name of the pool to select',
                value: poolName
            }).inject(poolToSelectElt);
            const expectedStatus = this._getExpectedStatus();
            const expectedStatusElt = UIDom.createElement('div', {
                className: 'csiegui-expected-status',
                parent: this._content
            });
            this._expectedStatusToggle = new WUXToggle({
                type: 'checkbox', label: 'Expected status of the Graph', value: 3, checkFlag: true, disabled: false
            }).inject(expectedStatusElt);
            this._expectedStatusToggle.addEventListener('change', () => { this._expectedStatusComboBox.disabled = !this._expectedStatusComboBox.disabled; });
            this._expectedStatusComboBox = new WUXComboBox({
                enableSearchFlag: false,
                elementsList: ['success', 'error'],
                value: expectedStatus
            }).inject(expectedStatusElt);
            this._expectedOutputRefToggle = new WUXToggle({
                type: 'checkbox', label: 'Expected Outputs reference CSI Parameters', value: 4, checkFlag: true, disabled: false
            }).inject(this._content);
            this._expectedProgressesToggle = new WUXToggle({
                type: 'checkbox', label: 'Expected Progresses reference CSI Parameters array', value: 5, checkFlag: false, disabled: false
            }).inject(this._content);
            this._nodesConfigurationToggle = new WUXToggle({
                type: 'checkbox', label: 'CSI Nodes configuration (commands to launch for local replay)', value: 5, checkFlag: true, disabled: false
            }).inject(this._content);
            this._nodesConfigurationToggle.addEventListener('change', () => this._dataGridView.toggleDisabledState());
            this._dataGridView = new CSIEGUINodesConfigurationDataGridView(this._getNodesConfig());
            this._content.appendChild(this._dataGridView.getElement());
            const backButton = new WUXButton({
                label: 'Back',
                emphasize: 'secondary',
                onClick: this._onBackButtonClick.bind(this)
            });
            const footer = this._dialog.getContent().querySelector('.wux-windows-dialog-buttons');
            footer.appendChild(backButton.getContent());
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                           ____  ____  _____     ___  _____ _____                               //
        //                          |  _ \|  _ \|_ _\ \   / / \|_   _| ____|                              //
        //                          | |_) | |_) || | \ \ / / _ \ | | |  _|                                //
        //                          |  __/|  _ < | |  \ V / ___ \| | | |___                               //
        //                          |_|   |_| \_\___|  \_/_/   \_\_| |_____|                              //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * The callback on the back button click event.
         * @private
         */
        _onBackButtonClick() {
            const saveCSIRecordBasicDialog = this._saveCSIGraphDialog.getSaveRecordBasicDialog();
            saveCSIRecordBasicDialog.setVisibleFlag(true);
            this.setVisibleFlag(false);
        }
        /**
         * The callback on the advanced save button click event.
         * @private
         */
        _onAdvancedSaveButtonClick() {
            this._exportJSONRecordToFile({
                'function': this._declarativeFunctionToggle.checkFlag,
                inputs: this._testInputsToggle.checkFlag,
                poolToSelect: this._poolToSelectToggle.checkFlag,
                poolToSelectOverload: this._poolToSelectLineEditor.value,
                expectedStatus: this._expectedStatusToggle.checkFlag,
                expectedStatusOverload: this._expectedStatusComboBox.value,
                outputs: this._expectedOutputRefToggle.checkFlag,
                progresses: this._expectedProgressesToggle.checkFlag,
                nodesConfig: this._nodesConfigurationToggle.checkFlag,
                nodesConfigOverload: this._dataGridView.getNodesConfig()
            });
            this._saveCSIGraphDialog.close();
        }
    }
    return CSIEGUISaveRecordAdvancedDialog;
});
