/// <amd-module name='DS/EPSSchematicsUI/edges/views/EPSSchematicsUIPersistentLabelEdgeView'/>
define("DS/EPSSchematicsUI/edges/views/EPSSchematicsUIPersistentLabelEdgeView", ["require", "exports", "DS/EPSSchematicsUI/edges/views/EPSSchematicsUIEdgeView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "css!DS/EPSSchematicsUI/css/edges/EPSSchematicsUIPersistentLabelEdge"], function (require, exports, UIEdgeView, UIDom) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a UI permanent label edge view.
     * @class UIPersistentLabelEdgeView
     * @alias module:DS/EPSSchematicsUI/edges/views/EPSSchematicsUIPersistentLabelEdgeView
     * @abstract
     * @private
     */
    class UIPersistentLabelEdgeView extends UIEdgeView {
        /**
         * @constructor
         */
        constructor() {
            super('sch-edge-persistent-label-path');
        }
        /**
         * Creates the edge view.
         * @protected
         * @param {EGraphCore.Element} elt - The element using this view.
         * @param {EGraphCore.GraphView} grView - The graph view that called this callback.
         */
        oncreateDisplay(elt, grView) {
            super.oncreateDisplay(elt, grView);
            UIDom.addClassName(this.structure.root, 'sch-edge-persistent-label');
        }
    }
    return UIPersistentLabelEdgeView;
});
