/// <amd-module name='DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITraceBlockHandler'/>
define("DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITraceBlockHandler", ["require", "exports", "DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITraceHandler", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsUI/groups/EPSSchematicsUIGraph"], function (require, exports, UITraceHandler, UIDom, ModelEnums, UIGraph) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a UI trace block handler.
     * @class UITraceBlockHandler
     * @alias module:DS/EPSSchematicsUI/controllers/traceHandlers/EPSSchematicsUITraceBlockHandler
     * @extends UITraceHandler
     * @private
     */
    class UITraceBlockHandler extends UITraceHandler {
        /**
         * @constructor
         * @param {UITraceController} controller - The UI trace controller.
         * @param {UIBlock|UIGraph} elementUI - The UI block element.
         */
        constructor(controller, elementUI) {
            const blockElementUI = elementUI instanceof UIGraph ? elementUI.getBlockView() : elementUI;
            super(controller, blockElementUI);
        }
        /**
         * Enables the trace capacity.
         * @public
         * @param {boolean} skipAnimation - True to skip the trace animation.
         * @param {ITraceOptions} [options] - The trace options
         */
        enable(skipAnimation, options) {
            if (options !== undefined && options.executionResult !== undefined) {
                if (options.executionResult === ModelEnums.EExecutionResult.eExecutionPending) {
                    UIDom.addClassName(this._element, 'sch-trace-pending');
                }
                else if (options.executionResult === ModelEnums.EExecutionResult.eExecutionWorker) {
                    UIDom.addClassName(this._element, 'sch-trace-worker');
                }
                else {
                    if (options.executionResult === ModelEnums.EExecutionResult.eExecutionError) {
                        UIDom.addClassName(this._element, 'sch-trace-error');
                        this.displayError(options);
                    }
                    else if (options.executionResult === ModelEnums.EExecutionResult.eExecutionWarning) {
                        UIDom.addClassName(this._element, 'sch-trace-warning');
                    }
                    UIDom.removeClassName(this._element, ['sch-trace-pending', 'sch-trace-worker']);
                }
            }
            super.enable(skipAnimation);
        }
        /**
         * Disables the trace capacity.
         * @private
         */
        disable() {
            UIDom.removeClassName(this._element, [
                'sch-trace-error', 'sch-trace-warning',
                'sch-trace-pending', 'sch-trace-worker'
            ]);
            super.disable();
        }
    }
    return UITraceBlockHandler;
});
