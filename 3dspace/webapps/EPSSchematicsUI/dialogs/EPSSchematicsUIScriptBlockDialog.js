/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUIScriptBlockDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUIScriptBlockDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIBlockDialog", "DS/Windows/DockingElementForImmersiveFrame", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "DS/Core/WebUXGlobalEnums", "css!DS/EPSSchematicsUI/css/dialogs/EPSSchematicsUIScriptBlockDialog"], function (require, exports, UIBlockDialog, DockingElementForImmersiveFrame, UIDom, UITools, WebUXGlobalEnums_1) {
    "use strict";
    /* eslint-enable no-unused-vars */
    // TODO: Move codeMirror instatiation here?!
    /**
     * This class defines a UI script block dialog.
     * @class UIScriptBlockDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUIScriptBlockDialog
     * @extends UIBlockDialog
     * @private
     */
    class UIScriptBlockDialog extends UIBlockDialog {
        /**
         * @constructor
         * @param {UIScriptBlock} block - The UI script block.
         * @param {IWUXDialogOptions} [options] - The dialog options.
         */
        constructor(block, options) {
            super(block, UITools.mergeObject({
                className: ['sch-script-block-dialog'],
                width: 1000
            }, options, true));
            this._isEditableScript = false;
        }
        /**
         * Removes the dialog.
         * @public
         */
        remove() {
            super.remove(); // Closes the dialog!
            this._isEditableScript = undefined;
        }
        /**
         * Gets the UI block of the dialog.
         * @public
         * @returns {UIBlock} The UI block of the dialog.
         */
        getUIBlock() {
            return this._block;
        }
        /**
         * The callback on the dialog close event.
         * @protected
         */
        _onClose() {
            if (this._isEditableScript) {
                this._block.removeScriptEditor();
            }
            super._onClose();
        }
        /**
         * The callback on the dialog Ok button click event.
         * @protected
         */
        _onOk() {
            if (this._isEditableScript) {
                const script = this._block.getCodeMirrorScript();
                if (script) {
                    this._tmpModel.setScriptContent(UITools.formatToSingleQuotes(script));
                }
            }
            super._onOk();
        }
        /**
         * Creates the dialog content.
         * @protected
         */
        _onCreateContent() {
            super._onCreateContent();
            this._isEditableScript = !this._block.getModel().isTemplate();
            if (this._isEditableScript) {
                const tempParent = UIDom.createElement('div', { className: 'sch-dialog-content' });
                while (this._content.childNodes.length > 0) {
                    tempParent.appendChild(this._content.childNodes[0]);
                }
                const leftDockingElement = new DockingElementForImmersiveFrame({
                    side: WebUXGlobalEnums_1.WUXDockAreaEnum.LeftDockArea,
                    dockingZoneContent: tempParent,
                    dockingZoneSize: 490,
                    collapsibleFlag: true,
                    resizableFlag: true
                });
                leftDockingElement.freeZoneContent = this._block.createScriptEditor();
                this._content.appendChild(leftDockingElement.getContent());
                this._block.refreshScriptEditor();
                this._dialog.addEventListener('visibilityChange', () => {
                    this._block.refreshScriptEditor();
                });
            }
        }
    }
    return UIScriptBlockDialog;
});
