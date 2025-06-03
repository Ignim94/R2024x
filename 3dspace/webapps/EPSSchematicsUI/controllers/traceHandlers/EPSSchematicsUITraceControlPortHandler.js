/// <amd-module name='DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITraceControlPortHandler'/>
define("DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITraceControlPortHandler", ["require", "exports", "DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITraceHandler", "DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITracePortHandler"], function (require, exports, UITraceHandler, UITracePortHandler) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a UI trace control port handler.
     * It provides enabling and disabling trace capacities.
     * @class UITraceControlPortHandler
     * @alias module:DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITraceControlPortHandler
     * @extends UITracePortHandler
     * @private
     */
    class UITraceControlPortHandler extends UITracePortHandler {
        /**
         * @constructor
         * @param {UITraceController} controller - The UI trace controller.
         * @param {UIGraph} graph - The UI graph.
         * @param {string} path - The path of the port to trace.
         */
        constructor(controller, graph, path) {
            super(controller, graph, path);
        }
        /**
         * Enables the trace capacity.
         * @public
         * @param {boolean} skipAnimation - True to skip the trace animation.
         */
        enable(skipAnimation) {
            if (this._outsideHandler === undefined) {
                this._outsideElementUI = this._graph.getOutsideControlPortFromPath(this._path);
                if (this._outsideElementUI !== undefined) {
                    this._outsideHandler = new UITraceHandler(this._controller, this._outsideElementUI);
                }
            }
            if (this._insideHandler === undefined) {
                const elementUI = this._graph.getInsideControlPortFromPath(this._path);
                if (elementUI !== undefined) {
                    this._insideHandler = new UITraceHandler(this._controller, elementUI);
                }
            }
            super.enable(skipAnimation);
        }
    }
    return UITraceControlPortHandler;
});
