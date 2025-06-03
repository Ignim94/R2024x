/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUIEditorSettingsDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUIEditorSettingsDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIValidationDialog", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVEditorSettings", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "css!DS/EPSSchematicsUI/css/dialogs/EPSSchematicsUIEditorSettingsDialog"], function (require, exports, UIValidationDialog, UIDGVEditorSettings, UINLS) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a UI editor settings dialog.
     * @class UIEditorSettingsDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUIEditorSettingsDialog
     * @extends UIValidationDialog
     * @private
     */
    class UIEditorSettingsDialog extends UIValidationDialog {
        /**
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         */
        constructor(editor) {
            super(editor, {
                title: UINLS.get('dialogTitleEditorSettings'),
                className: 'sch-dialog-editor-settings',
                immersiveFrame: editor.getImmersiveFrame(),
                width: 400,
                height: 200,
                icon: 'tools'
            });
        }
        /**
         * Removes the dialog.
         * @public
         */
        remove() {
            super.remove();
        }
        /**
         * Gets the data grid view.
         * @public
         * @returns {UIDGVEditorSettings} The data grid view.
         */
        getDataGridView() {
            return this._dataGridView;
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
            this._dataGridView = new UIDGVEditorSettings(this._editor);
            this.getContent().appendChild(this._dataGridView.getElement());
        }
        /**
         * The callback on the dialog Ok button click event.
         * @protected
         */
        _onOk() {
            this._dataGridView.writeSettingValues();
            super._onOk();
        }
    }
    return UIEditorSettingsDialog;
});
