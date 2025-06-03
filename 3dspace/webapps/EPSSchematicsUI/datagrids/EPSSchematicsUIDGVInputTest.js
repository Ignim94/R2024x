/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVInputTest'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVInputTest", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVIOTestAbstract"], function (require, exports, UIDGVIOTestAbstract) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines the UI data grid view input test.
     * @class UIDGVInputTest
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVInputTest
     * @extends UIDGVIOTestAbstract
     * @private
     */
    class UIDGVInputTest extends UIDGVIOTestAbstract {
        /**
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         */
        constructor(editor) {
            super(editor, 'sch-datagridview-inputtest');
        }
        /**
         * Initializes the data grid view.
         * @protected
         */
        _initialize() {
            this._dataPorts = this._graph.getInputDataDrawer().getModelDataPorts();
            super._initialize();
        }
    }
    return UIDGVInputTest;
});
