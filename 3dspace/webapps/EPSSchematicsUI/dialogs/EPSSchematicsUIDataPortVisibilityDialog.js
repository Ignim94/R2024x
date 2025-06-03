/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUIDataPortVisibilityDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUIDataPortVisibilityDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIFadeOutDialog", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVOptionalDataPorts", "css!DS/EPSSchematicsUI/css/dialogs/EPSSchematicsUIDataPortVisibilityDialog"], function (require, exports, UIFadeOutDialog, UINLS, UIDGVOptionalDataPorts) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a UI data port visibility dialog.
     * @class UIDataPortVisibilityDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUIDataPortVisibilityDialog
     * @extends UIFadeOutDialog
     * @private
     */
    class UIDataPortVisibilityDialog extends UIFadeOutDialog {
        /**
         * @constructor
         * @public
         * @param {UIEditor} editor - The UI editor.
         * @param {UIBlock} blockUI - The UI block.
         */
        constructor(editor, blockUI) {
            super({
                title: UINLS.get('dialogTitleDataPortVisibilityEditor'),
                className: 'sch-dialog-visibility-dataport',
                immersiveFrame: editor.getImmersiveFrame(),
                resizableFlag: true,
                width: 300,
                minWidth: 300,
                height: 200
            });
            this._blockUI = blockUI;
        }
        /**
         * Removes the dialog.
         * @public
         */
        remove() {
            this._blockUI = undefined;
            super.remove();
        }
        /**
         * Gets the data grid view.
         * @public
         * @returns {UIDGVOptionalDataPorts} The data grid view.
         */
        getDataGridView() {
            return this._dataGridView;
        }
        /**
         * The callback on the dialog close event.
         * @protected
         */
        _onClose() {
            this._dataGridView.remove();
            this._dataGridView = undefined;
            super._onClose();
        }
        /**
         * Creates the dialog content.
         * @protected
         */
        _onCreateContent() {
            this._dataGridView = new UIDGVOptionalDataPorts(this._blockUI);
            this._content.appendChild(this._dataGridView.getElement());
            super._onCreateContent();
        }
    }
    return UIDataPortVisibilityDialog;
});
