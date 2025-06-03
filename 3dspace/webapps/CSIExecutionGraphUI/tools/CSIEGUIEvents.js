/// <amd-module name='DS/CSIExecutionGraphUI/tools/CSIEGUIEvents'/>
define("DS/CSIExecutionGraphUI/tools/CSIEGUIEvents", ["require", "exports", "DS/EPEventServices/EPEvent", "DS/EPEventServices/EPEventServices"], function (require, exports, EPEvent, EventServices) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CSIEGUIImportErrorEvent = exports.CSIEGUIImportSuccessEvent = void 0;
    /**
     * This class defines a CSIEGUI import success event.
     * @class CSIEGUIImportSuccessEvent
     * @extends EPEvent
     * @private
     */
    class CSIEGUIImportSuccessEvent extends EPEvent {
        /**
         * @constructor
         */
        constructor() {
            super();
        }
    }
    CSIEGUIImportSuccessEvent.type = 'CSIEGUIImportSuccessEvent';
    exports.CSIEGUIImportSuccessEvent = CSIEGUIImportSuccessEvent;
    EventServices.registerEvent(CSIEGUIImportSuccessEvent);
    /**
     * This class defines a CSIEGUI import error event.
     * @class CSIEGUIImportErrorEvent
     * @extends EPEvent
     * @private
     */
    class CSIEGUIImportErrorEvent extends EPEvent {
        /**
         * @constructor
         */
        constructor() {
            super();
        }
        /**
         * Gets the error message.
         * @public
         * @returns {sring} The error message.
         */
        getError() {
            return this.error;
        }
    }
    CSIEGUIImportErrorEvent.type = 'CSIEGUIImportErrorEvent';
    exports.CSIEGUIImportErrorEvent = CSIEGUIImportErrorEvent;
    EventServices.registerEvent(CSIEGUIImportErrorEvent);
});
