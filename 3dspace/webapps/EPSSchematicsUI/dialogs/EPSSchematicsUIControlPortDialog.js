/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUIControlPortDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUIControlPortDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIValidationDialog", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVSingleControlPort", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums"], function (require, exports, UIValidationDialog, UIDGVSingleControlPort, UINLS, ModelEnums) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a control port dialog.
     * @class UIControlPortDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUIControlPortDialog
     * @extends UIValidationDialog
     * @private
     */
    class UIControlPortDialog extends UIValidationDialog {
        /**
         * @constructor
         * @param {UIControlPort} controlPort - The UI control port.
         */
        constructor(controlPort) {
            super(controlPort.getEditor(), {
                title: UIControlPortDialog._getTitle(controlPort.getModel().getType()),
                className: 'sch-dialog-controlport',
                immersiveFrame: controlPort.getParentGraph().getEditor().getImmersiveFrame(),
                width: 400,
                height: 120
            });
            this._controlPort = controlPort;
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
            this._controlPort = undefined;
            this._tmpBlockModel = undefined;
            this._dataGridView = undefined;
            super.remove();
        }
        /**
         * Closes the dialog.
         * @public
         */
        close() {
            if (this._dataGridView) {
                this._dataGridView.remove();
            }
            this._tmpBlockModel = undefined;
            this._dataGridView = undefined;
            super.close();
        }
        /**
         * Gets the single control port data grid view.
         * @public
         * @returns {UIDGVSingleControlPort} THe single control port data grid view.
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
         * Creates the dialog content.
         * @protected
         */
        _onCreateContent() {
            super._onCreateContent();
            this._tmpBlockModel = this._controlPort.getParent().getModel().clone();
            this._dataGridView = new UIDGVSingleControlPort(this._editor, this._tmpBlockModel, this._controlPort.getName(), false);
            this._content.appendChild(this._dataGridView.getElement());
        }
        /**
         * The callback on the dialog Ok button click event.
         * @protected
         */
        _onOk() {
            const controlPort = this._controlPort;
            const editor = this._editor;
            let jsonBlock = {};
            this._tmpBlockModel.toJSON(jsonBlock);
            super._onOk();
            controlPort.getParent().getModel().fromJSON(jsonBlock); // Triggers the deletion of the dialog!
            editor.getHistoryController().registerEditAction(controlPort);
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
         * Gets the dialog title.
         * @private
         * @static
         * @param {ModelEnums.EControlPortType} portType - The control port type.
         * @returns {string} The title of the dialog.
         */
        static _getTitle(portType) {
            let title;
            if (portType === ModelEnums.EControlPortType.eInput) {
                title = UINLS.get('dialogTitleInputControlPortEditor');
            }
            else if (portType === ModelEnums.EControlPortType.eOutput) {
                title = UINLS.get('dialogTitleOutputControlPortEditor');
            }
            else if (portType === ModelEnums.EControlPortType.eInputEvent) {
                title = UINLS.get('dialogTitleInputEventPortEditor');
            }
            else if (portType === ModelEnums.EControlPortType.eOutputEvent) {
                title = UINLS.get('dialogTitleOutputEventPortEditor');
            }
            return title;
        }
    }
    return UIControlPortDialog;
});
