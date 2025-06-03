/// <amd-module name='DS/EPSSchematicsUI/edges/views/EPSSchematicsUIEdgeView'/>
define("DS/EPSSchematicsUI/edges/views/EPSSchematicsUIEdgeView", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphViews"], function (require, exports, EGraphViews) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a UI edge view.
     * @class UIEdgeView
     * @alias module:DS/EPSSchematicsUI/edges/views/EPSSchematicsUIEdgeView
     * @extends SVGEdgeView
     * @abstract
     * @private
     */
    class UIEdgeView extends EGraphViews.SVGEdgeView {
        /**
         * @constructor
         * @param {string} className - The name of the CSS class to use for displaying the edge.
         */
        constructor(className) {
            super(className);
        }
        /**
         * Gets the link SVG element.
         * @public
         * @returns {SVGElement} The SVG element representing the link.
         */
        getElement() {
            return this.structure.root;
        }
        /**
         * Gets the link SVG path element.
         * @public
         * @returns {SVGPathElement} The link SVG path element.
         */
        getPath() {
            return this.display.elt;
        }
        /**
         * Removes the link view.
         * @protected
         * @param {EGraphCore.Element} elt - The element using this view.
         * @param {EGraphCore.GraphView} grView - The graph view that called this callback.
         */
        ondestroyDisplay(elt, grView) {
            super.ondestroyDisplay(elt, grView);
        }
        /**
         * Creates the edge view.
         * @protected
         * @param {EGraphCore.Element} elt - The element using this view.
         * @param {EGraphCore.GraphView} grView - The graph view that called this callback.
         */
        oncreateDisplay(elt, grView) {
            super.oncreateDisplay(elt, grView);
        }
        /**
         * The callback to apply modified properties to the display.
         * @protected
         * @param {EGraphCore.Element} elt - The element using this view.
         * @param {EGraphCore.PathSetTrie} changes - Set of paths of modified properties.
         * @param {EGraphCore.GraphView} grView - The graph view that called this callback.
         */
        onmodifyDisplay(elt, changes, grView) {
            super.onmodifyDisplay(elt, changes, grView);
        }
    }
    return UIEdgeView;
});
