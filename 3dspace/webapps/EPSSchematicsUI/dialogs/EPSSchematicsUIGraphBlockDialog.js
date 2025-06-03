/// <amd-module name='DS/EPSSchematicsUI/dialogs/EPSSchematicsUIGraphBlockDialog'/>
define("DS/EPSSchematicsUI/dialogs/EPSSchematicsUIGraphBlockDialog", ["require", "exports", "DS/EPSSchematicsUI/dialogs/EPSSchematicsUIBlockDialog"], function (require, exports, UIBlockDialog) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a UI graph block dialog.
     * @class UIGraphBlockDialog
     * @alias module:DS/EPSSchematicsUI/dialogs/EPSSchematicsUIGraphBlockDialog
     * @extends UIBlockDialog
     * @private
     */
    class UIGraphBlockDialog extends UIBlockDialog {
        /**
         * @constructor
         * @param {UIGraph} graph - The UI graph.
         */
        constructor(graph) {
            super(graph);
        }
    }
    return UIGraphBlockDialog;
});
