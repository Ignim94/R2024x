/// <amd-module name='DS/EPSSchematicsUI/groups/EPSSchematicsUIThumbnailGraph'/>
define("DS/EPSSchematicsUI/groups/EPSSchematicsUIThumbnailGraph", ["require", "exports", "DS/EPSSchematicsUI/groups/EPSSchematicsUIGroup"], function (require, exports, UIGroup) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a UI thumbnail graph.
     * @class UIThumbnailGraph
     * @alias module:DS/EPSSchematicsUI/groups/EPSSchematicsUIThumbnailGraph
     * @extends UIGroup
     * @private
     */
    class UIThumbnailGraph extends UIGroup {
        /**
         * @constructor
         * @param {UIThumbnailViewer} viewer - The thumbnail viewer.
         * @param {GraphBlock} model - The graph block model.
         */
        constructor(viewer, model) {
            super(viewer);
            this.model = model;
        }
        /**
         * Gets the graph block model.
         * @public
         * @returns {GraphBlock} The graph block model.
         */
        getModel() {
            return this.model;
        }
        /**
         * The callback on the UI change event.
         * @public
         */
        // eslint-disable-next-line class-methods-use-this
        onUIChange() { }
    }
    return UIThumbnailGraph;
});
