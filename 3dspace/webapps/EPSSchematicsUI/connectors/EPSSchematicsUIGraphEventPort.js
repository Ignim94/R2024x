/// <amd-module name='DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphEventPort'/>
define("DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphEventPort", ["require", "exports", "DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphControlPort", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphEventPortView"], function (require, exports, UIGraphControlPort, UIGraphEventPortView) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a UI graph event port.
     * @class UIGraphEventPort
     * @alias module:DS/EPSSchematicsUI/connectors/EPSSchematicsUIGraphEventPort
     * @extends UIGraphControlPort
     * @private
     */
    class UIGraphEventPort extends UIGraphControlPort {
        /**
         * @constructor
         * @param {UIGraph} parent - The parent UI graph that owns this UI graph port.
         * @param {EventPort} model - The event port model.
         * @param {number} offset - The position of the event port.
         */
        constructor(parent, model, offset) {
            super(parent, model, offset);
        }
        /**
         * Creates the view of the connector.
         * @protected
         * @override
         * @returns {UIGraphEventPortView} The view of the connector.
         */
        _createView() {
            return new UIGraphEventPortView(this);
        }
    }
    return UIGraphEventPort;
});
