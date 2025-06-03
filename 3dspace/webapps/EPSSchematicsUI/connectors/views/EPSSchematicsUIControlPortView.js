/// <amd-module name='DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIControlPortView'/>
define("DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIControlPortView", ["require", "exports", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIPortView"], function (require, exports, UIPortView) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a UI control port view.
     * @class UIControlPortView
     * @alias module:DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIControlPortView
     * @extends UIPortView
     * @private
     */
    class UIControlPortView extends UIPortView {
        /**
         * @constructor
         * @param {UIControlPort} port - The UI control port.
         */
        constructor(port) {
            super(port);
        }
    }
    return UIControlPortView;
});
