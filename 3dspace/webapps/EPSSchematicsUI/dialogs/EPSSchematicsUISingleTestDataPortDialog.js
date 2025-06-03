/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUISingleTestDataPortDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUISingleTestDataPortDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIValidationDialog", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVSingleTestDataPort", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums"], function (require, exports, UIValidationDialog, UIDGVSingleTestDataPort, UINLS, ModelEnums) {
    "use strict";
    /**
     * This class defines a UI single test data port dialog.
     * @private
     * @class UISingleTestDataPortDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUISingleTestDataPortDialog
     * @extends UIValidationDialog
     */
    class UISingleTestDataPortDialog extends UIValidationDialog {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         * @param {DataPort} dataPort - The single data port.
         * @param {boolean} readOnly - True if read only, false otherwise.
         */
        constructor(editor, dataPort, readOnly) {
            const portType = dataPort.getType();
            const isInputType = portType === ModelEnums.EDataPortType.eInput;
            const nlsKey = isInputType ? 'TestInputsEditorDialogTitle' : 'TestOutputsReferenceEditorDialogTitle';
            const title = UINLS.get(nlsKey) + ' (' + dataPort.getName() + ')';
            super(editor, {
                title: title,
                className: ['sch-dialog-iotest', isInputType ? 'sch-dialog-inputtest' : 'sch-dialog-outputtest'],
                immersiveFrame: editor.getImmersiveFrame(),
                width: 600,
                height: 400
            });
            this._dataPort = dataPort;
            this._readOnly = readOnly;
        }
        /**
         * Removes the dialog.
         * @override
         * @public
         */
        remove() {
            this._dataGridView = undefined;
            this._dataPort = undefined;
            this._readOnly = undefined;
            super.remove();
        }
        /**
         * Gets the data grid view.
         * @public
         * @returns {UIDGVSingleTestDataPort} The data grid view.
         */
        getDataGridView() {
            return this._dataGridView;
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
         * The callback on the dialog Ok button click event.
         * @protected
         */
        _onOk() {
            this._dataGridView.applyTestValues();
            super._onOk();
        }
        /**
         * The callback on the dialog close event.
         * @protected
         */
        _onClose() {
            if (this._dataGridView !== undefined) {
                this._dataGridView.remove();
                this._dataGridView = undefined;
            }
            super._onClose();
        }
        /**
         * Creates the dialog content.
         * @protected
         */
        _onCreateContent() {
            super._onCreateContent();
            const blockModel = this._dataPort.block;
            this._dataGridView = new UIDGVSingleTestDataPort(this._editor, blockModel, this._readOnly, this._dataPort);
            this._content.appendChild(this._dataGridView.getElement());
        }
    }
    return UISingleTestDataPortDialog;
});
