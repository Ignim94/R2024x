/// <amd-module name='DS/EPSSchematicsUI/connectors/EPSSchematicsUIPersistentLabelConnector'/>
define("DS/EPSSchematicsUI/connectors/EPSSchematicsUIPersistentLabelConnector", ["require", "exports", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIConnector", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIPersistentLabelConnectorView", "DS/EPSSchematicsUI/constraints/EPSSchematicsUIConnectorMiddleCstr"], function (require, exports, UIConnector, UIPersistentLabelConnectorView, UIConnectorMiddleCstr) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a UI persistent label connector.
     * @class UIConnector
     * @alias module:DS/EPSSchematicsUI/connectors/EPSSchematicsUIPersistentLabelConnector
     * @extends UIConnector
     * @private
     */
    class UIPersistentLabelConnector extends UIConnector {
        /**
         * @constructor
         * @param {UIPersistentLabel} label - The persistent label.
         */
        constructor(label) {
            super();
            this._label = label;
            /*this._setBorderConstraint({
                cstr: new UIConnectorMiddleCstr(this._label.getDisplay())
            });*/
            this._display.multiset('cstr', new UIConnectorMiddleCstr(this._label.getDisplay())); // TODO: Rework the setBorderConstraint API to accept class not deriving from BorderCtr
        }
        /**
         * Removes the connector.
         * @public
         */
        remove() {
            this._label = undefined;
            super.remove();
        }
        /**
         * Creates the view of the connector.
         * @protected
         * @returns {UIPersistentLabelConnectorView} The view of the connector.
         */
        _createView() {
            return new UIPersistentLabelConnectorView(this);
        }
    }
    return UIPersistentLabelConnector;
});
