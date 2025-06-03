/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUIOutputTestDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUIOutputTestDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIValidationDialog", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVOutputTestDataPorts", "DS/Controls/Button", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "css!DS/EPSSchematicsUI/css/dialogs/EPSSchematicsUIIOTestDialog"], function (require, exports, UIValidationDialog, UIFontIcon, UIWUXTools, UIDGVOutputTestDataPorts, WUXButton, UIDom) {
    "use strict";
    /* eslint-enable no-unused-vars */
    // TODO: NLS to be done!
    /**
     * This class defines a UI output test dialog.
     * @private
     * @class UIOutputTestDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUIOutputTestDialog
     * @extends UIValidationDialog
     */
    class UIOutputTestDialog extends UIValidationDialog {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         * @param {boolean} readOnly - True if read only, false otherwise.
         */
        constructor(editor, readOnly) {
            super(editor, {
                title: 'Test outputs reference editor',
                className: ['sch-dialog-iotest', 'sch-dialog-outputtest'],
                immersiveFrame: editor.getImmersiveFrame(),
                width: 600,
                height: 400
            });
            this._readOnly = readOnly;
        }
        /**
         * Removes the dialog.
         * @override
         * @public
         */
        remove() {
            this._importButton = undefined;
            this._exportButton = undefined;
            this._dataGridView = undefined;
            this._readOnly = undefined;
            super.remove();
        }
        /**
         * Gets the data grid view.
         * @public
         * @returns {UIDGVOutputTestDataPorts} The data grid view.
         */
        getDataGridView() {
            return this._dataGridView;
        }
        /**
         * Gets the open button.
         * @public
         * @returns {WUXButton} The open button.
         */
        getOpenButton() {
            return this._importButton;
        }
        /**
         * Gets the save button.
         * @public
         * @returns {WUXButton} The save button.
         */
        getSaveButton() {
            return this._exportButton;
        }
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
            this._importButton = undefined;
            this._exportButton = undefined;
            super._onClose();
        }
        /**
         * Creates the dialog content.
         * @protected
         */
        _onCreateContent() {
            super._onCreateContent();
            const topContainer = UIDom.createElement('div', { className: 'sch-top-container', parent: this.getContent() });
            const bottomContainer = UIDom.createElement('div', { className: 'sch-bottom-container', parent: this.getContent() });
            const testEditor = this._editor.getOptions().tabViewMode.testEditor;
            if (testEditor.onOpenOutputTest !== undefined) {
                this._importButton = new WUXButton({
                    label: 'Open',
                    emphasize: 'primary',
                    icon: UIFontIcon.getWUXFAIconDefinition('folder-open'),
                    tooltipInfos: UIWUXTools.createTooltip({ shortHelp: 'Open output reference file' }),
                    onClick: () => testEditor.onOpenOutputTest()
                }).inject(topContainer);
            }
            if (testEditor.onSaveOutputTest !== undefined) {
                this._exportButton = new WUXButton({
                    label: 'Save',
                    emphasize: 'primary',
                    icon: UIFontIcon.getWUXFAIconDefinition('floppy-o'),
                    tooltipInfos: UIWUXTools.createTooltip({ shortHelp: 'Save output reference file' }),
                    onClick: () => testEditor.onSaveOutputTest()
                }).inject(topContainer);
            }
            /*this.updateButton = new WUXButton({
                label: 'Update',
                emphasize: 'primary',
                disabled: true,
                icon: UIFontIcon.getWUXFAIconDefinition('download'),
                tooltipInfos: UIWUXTools.createTooltip({ shortHelp: 'Update from play result' }),
                onClick: () => {}
            }).inject(topContainer) as WUXButton;*/
            const blockModel = this._editor.getGraphModel();
            this._dataGridView = new UIDGVOutputTestDataPorts(this._editor, blockModel, this._readOnly);
            bottomContainer.appendChild(this._dataGridView.getElement());
        }
    }
    return UIOutputTestDialog;
});
