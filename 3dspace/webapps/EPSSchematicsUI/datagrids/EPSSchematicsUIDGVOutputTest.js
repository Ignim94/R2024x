/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVOutputTest'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVOutputTest", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVIOTestAbstract"], function (require, exports, UIDGVIOTestAbstract) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines the UI data grid view output test.
     * @class UIDGVInputTest
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVInputTest
     * @extends UIDGVIOTestAbstract
     * @private
     */
    class UIDGVOutputTest extends UIDGVIOTestAbstract {
        /**
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         */
        constructor(editor) {
            super(editor, 'sch-datagridview-outputtest');
        }
        /**
         * Initializes the data grid view.
         * @protected
         */
        _initialize() {
            this._dataPorts = this._graph.getOutputDataDrawer().getModelDataPorts();
            super._initialize();
        }
    }
    return UIDGVOutputTest;
});
