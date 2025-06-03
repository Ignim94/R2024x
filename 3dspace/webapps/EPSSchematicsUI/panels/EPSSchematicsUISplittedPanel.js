/// <amd-module name='DS/EPSSchematicsUI/panels/EPSSchematicsUISplittedPanel'/>
define("DS/EPSSchematicsUI/panels/EPSSchematicsUISplittedPanel", ["require", "exports", "DS/EPSSchematicsUI/panels/EPSSchematicsUIPanel", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "DS/Windows/DockingElementForImmersiveFrame", "DS/Core/WebUXGlobalEnums", "css!DS/EPSSchematicsUI/css/panels/EPSSchematicsUISplittedPanel"], function (require, exports, UIPanel, UIDom, UITools, DockingElementForImmersiveFrame, WebUXGlobalEnums_1) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a UI splitted panel.
     * @class UISplittedPanel
     * @alias module:DS/EPSSchematicsUI/panels/EPSSchematicsUISplittedPanel
     * @extends UIPanel
     * @abstract
     * @private
     */
    class UISplittedPanel extends UIPanel {
        /**
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         * @param {IPanelOptions} options - The panel options.
         */
        constructor(editor, options) {
            super(UITools.mergeObject({ className: ['sch-splitted-panel'] }, options, true));
            this._editor = editor;
        }
        /**
         * Removes the panel.
         * @private
         */
        remove() {
            super.remove(); // Closes the panel!
            this._editor = undefined;
        }
        /**
         * The callback on the panel close event.
         * @protected
         */
        _onClose() {
            this._topDockingElement = undefined;
            this._panelTopContainer = undefined;
            this._panelBottomContainer = undefined;
            super._onClose();
        }
        /**
         * Creates the docking element.
         * @private
         */
        _createDockingElement() {
            const size = (this._editor.getDomElement().clientHeight / 2) - (23 + 6);
            this._panelTopContainer = UIDom.createElement('div', { className: 'sch-panel-topcontainer' });
            this._panelBottomContainer = UIDom.createElement('div', { className: 'sch-panel-bottomcontainer' });
            this._topDockingElement = new DockingElementForImmersiveFrame({
                side: WebUXGlobalEnums_1.WUXDockAreaEnum.TopDockArea,
                dockingZoneContent: this._panelTopContainer,
                freeZoneContent: this._panelBottomContainer,
                collapsibleFlag: false,
                dockingZoneSize: size,
                useBordersFlag: false
            });
            this._topDockingElement.inject(this.getContent());
        }
    }
    return UISplittedPanel;
});
