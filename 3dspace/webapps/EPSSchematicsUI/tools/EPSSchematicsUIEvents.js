/// <amd-module name='DS/EPSSchematicsUI/tools/EPSSchematicsUIEvents'/>
define("DS/EPSSchematicsUI/tools/EPSSchematicsUIEvents", ["require", "exports", "DS/EPEventServices/EPEvent", "DS/EPEventServices/EPEventServices", "DS/EPSSchematicsModelWeb/EPSSchematicsTools"], function (require, exports, EPEvent, EventServices, Tools) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UIJSONVersionChangeEvent = exports.UIApplicationPrintEvent = exports.UIDialogExpandEvent = exports.UIDialogCloseEvent = exports.UIHistoryControllerUpdateEvent = exports.UIViewerChangeEvent = void 0;
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a UI viewer change event.
     * @class UIViewerChangeEvent
     * @extends EPEvent
     * @private
     */
    class UIViewerChangeEvent extends EPEvent {
        /**
         * @constructor
         */
        constructor() {
            super();
        }
        /**
         * Gets the viewer.
         * @public
         * @returns {UIViewer} The viewer.
         */
        getViewer() {
            return this.viewer;
        }
        /**
         * Gets the viewer change opening state.
         * @public
         * @returns {boolean} True for opening, false for closing.
         */
        getOpeningState() {
            return this.isOpening;
        }
    }
    UIViewerChangeEvent.type = 'UIViewerChangeEvent';
    exports.UIViewerChangeEvent = UIViewerChangeEvent;
    UIViewerChangeEvent.prototype.type = 'UIViewerChangeEvent';
    EventServices.registerEvent(UIViewerChangeEvent);
    /**
     * This class defines a UI history controller update event.
     * @class UIHistoryControllerUpdateEvent
     * @extends EPEvent
     * @private
     */
    class UIHistoryControllerUpdateEvent extends EPEvent {
        /**
         * @constructor
         */
        constructor() {
            super();
        }
    }
    UIHistoryControllerUpdateEvent.type = 'UIHistoryControllerUpdateEvent';
    exports.UIHistoryControllerUpdateEvent = UIHistoryControllerUpdateEvent;
    EventServices.registerEvent(UIHistoryControllerUpdateEvent);
    /**
     * This class defines a UI dialog close event.
     * @class UIDialogCloseEvent
     * @extends EPEvent
     * @private
     */
    class UIDialogCloseEvent extends EPEvent {
        /**
         * @constructor
         */
        constructor() {
            super();
        }
    }
    UIDialogCloseEvent.type = 'UIDialogCloseEvent';
    exports.UIDialogCloseEvent = UIDialogCloseEvent;
    EventServices.registerEvent(UIDialogCloseEvent);
    /**
     * This class defines a UI dialog expand event.
     * @class UIDialogExpandEvent
     * @extends EPEvent
     * @private
     */
    class UIDialogExpandEvent extends EPEvent {
        /**
         * @constructor
         */
        constructor() {
            super();
        }
    }
    UIDialogExpandEvent.type = 'UIDialogExpandEvent';
    exports.UIDialogExpandEvent = UIDialogExpandEvent;
    EventServices.registerEvent(UIDialogExpandEvent);
    /**
     * This class defines a UI dialog close event.
     * @class UIDialogCloseEvent
     * @extends EPEvent
     * @private
     */
    class UIApplicationPrintEvent extends EPEvent {
        /**
         * @constructor
         */
        constructor() {
            super();
            this.showNotification = true;
        }
        /**
         * Gets the path of the event.
         * @public
         * @returns {string} The path of the event.
         */
        getPath() {
            return this.path;
        }
        /**
         * Gets the severity of the event.
         * @public
         * @returns {ModelEnums.ESeverity} The severity of the event.
         */
        getSeverity() {
            return this.severity;
        }
        /**
         * Gets the content of the event.
         * @public
         * @returns {*} The content of the event.
         */
        getContent() {
            if (this.jsonContent !== undefined) {
                this.content = Tools.jsonParse(this.jsonContent);
                this.jsonContent = undefined;
            }
            return this.content;
        }
        /**
         * Gets the show notification state.
         * @public
         * @returns {boolean} The show notification state.
         */
        getShowNotificationState() {
            return this.showNotification;
        }
    }
    UIApplicationPrintEvent.type = 'UIApplicationPrintEvent';
    exports.UIApplicationPrintEvent = UIApplicationPrintEvent;
    EventServices.registerEvent(UIApplicationPrintEvent);
    /**
     * This class defines a UI JSON Version change event.
     * @class UIJSONVersionChangeEvent
     * @extends EPEvent
     * @private
     */
    class UIJSONVersionChangeEvent extends EPEvent {
        /**
         * @constructor
         */
        constructor() {
            super();
        }
    }
    UIJSONVersionChangeEvent.type = 'UIJSONVersionChangeEvent';
    exports.UIJSONVersionChangeEvent = UIJSONVersionChangeEvent;
    EventServices.registerEvent(UIJSONVersionChangeEvent);
});
