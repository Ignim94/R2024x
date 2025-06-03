/// <amd-module name='DS/EPSSchematicsUI/panels/EPSSchematicsUIWatchPanel'/>
define("DS/EPSSchematicsUI/panels/EPSSchematicsUIWatchPanel", ["require", "exports", "DS/EPSSchematicsUI/panels/EPSSchematicsUIPanel", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVWatch", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/Core/WebUXGlobalEnums", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS"], function (require, exports, UIPanel, UIDGVWatch, UIFontIcon, WebUXGlobalEnums_1, UINLS) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a UI watch panel.
     * @private
     * @class UIWatchPanel
     * @alias module:DS/EPSSchematicsUI/panels/EPSSchematicsUIWatchPanel
     * @extends UIPanel
     */
    class UIWatchPanel extends UIPanel {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         */
        constructor(editor) {
            super({
                immersiveFrame: editor.getImmersiveFrame(),
                title: UINLS.get('panelTitleWatch'),
                maximizeButtonFlag: false,
                closeButtonFlag: false,
                currentDockArea: editor.getOptions().watchPanel.dockArea || WebUXGlobalEnums_1.WUXDockAreaEnum.RightDockArea,
                horizontallyStretchableFlag: false,
                verticallyStretchableFlag: false,
                className: ['sch-watch-panel'],
                icon: UIFontIcon.getWUX3DSIconDefinition('eye'),
                width: UIWatchPanel._width,
                minHeight: 300,
                height: 300
            });
            this._editor = editor;
        }
        /**
         * Removes the panel.
         * @public
         */
        remove() {
            super.remove(); // Closes the panel!
            this._editor = undefined;
            this._dataGridView = undefined;
        }
        /**
         * Add the data port to the user scope.
         * @public
         * @param {string} path - The data port path.
         */
        addDataPortToUserScope(path) {
            this._dataGridView.addDataPortToUserScope(path);
        }
        /**
         * Gets the watch data grid view UI.
         * @public
         * @returns {UIDGVWatch} The watch data grid view UI.
         */
        getDataGridView() {
            return this._dataGridView;
        }
        /**
         * The callback on the panel open event.
         * @protected
         */
        _onOpen() {
            super._onOpen();
            const currentDockArea = this._panel.currentDockArea;
            const dockingElt = this._panel.immersiveFrame.getDockingElement(currentDockArea);
            dockingElt.dockingZoneSize = UIWatchPanel._width;
        }
        /**
         * The callback on the panel close event.
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
         * Creates the panel content.
         * @protected
         */
        _createContent() {
            this._dataGridView = new UIDGVWatch(this._editor);
            this.getContent().appendChild(this._dataGridView.getElement());
        }
    }
    UIWatchPanel._width = 400;
    return UIWatchPanel;
});
