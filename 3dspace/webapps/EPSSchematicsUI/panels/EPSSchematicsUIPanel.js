/// <amd-module name='DS/EPSSchematicsUI/panels/EPSSchematicsUIPanel'/>
define("DS/EPSSchematicsUI/panels/EPSSchematicsUIPanel", ["require", "exports", "DS/Windows/Panel", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "DS/Core/WebUXGlobalEnums", "css!DS/EPSSchematicsUI/css/panels/EPSSchematicsUIPanel"], function (require, exports, Panel, UIDom, UITools, WebUXGlobalEnums_1) {
    "use strict";
    /**
     * This class defines a UI panel.
     * @class UIPanel
     * @alias module:DS/EPSSchematicsUI/panels/EPSSchematicsUIPanel
     * @abstract
     * @private
     */
    class UIPanel {
        /**
         * @constructor
         * @param {IPanelOptions} options - The panel options.
         */
        constructor(options) {
            this._openState = false;
            this._onCloseCB = this._onClose.bind(this);
            this._onContentVisibleStateChangeCB = this._onContentVisibleStateChange.bind(this);
            this._options = options;
            this._initializeOptions();
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                             ____  _   _ ____  _     ___ ____                                   //
        //                            |  _ \| | | | __ )| |   |_ _/ ___|                                  //
        //                            | |_) | | | |  _ \| |    | | |                                      //
        //                            |  __/| |_| | |_) | |___ | | |___                                   //
        //                            |_|    \___/|____/|_____|___\____|                                  //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Removes the panel.
         * @private
         */
        remove() {
            this.close();
            this._panel = undefined;
            this._options = undefined;
            this._openState = undefined;
            this._content = undefined;
            this._onCloseCB = undefined;
            this._onOpenCB = undefined;
            this._onContentVisibleStateChangeCB = undefined;
            this._initialDockingArea = undefined;
        }
        /**
         * Gets the panel open state.
         * @public
         * @returns {boolean} True if the panel is open else false.
         */
        isOpen() {
            return this._openState && this._panel !== undefined && (this._panel.visibleFlag || this._panel.expandedFlag);
        }
        /**
         * Opens the panel.
         * @public
         * @param {function} [callback] - The function to call once the panel is opened.
         */
        open(callback) {
            this._onOpenCB = callback;
            if (this._openState === false) {
                this._createPanel();
            }
            if (this._options.stackInWindowGroup === true) {
                this._stackInWindowGroup();
            }
            this._panel.ensureVisible();
            this._onOpen();
        }
        /**
         * Closes the panel.
         * @private
         */
        close() {
            if (this._openState) {
                this._panel.close();
            }
        }
        /**
         * Ensures the panel visibility.
         * @public
         */
        ensureVisible() {
            if (this._panel !== undefined) {
                this._panel.ensureVisible();
            }
        }
        /**
         * Switches the visibility of the panel.
         * @public
         */
        switchVisibility() {
            if (this.isOpen() && this._panel.getContentVisibleState()) {
                this.close();
            }
            else {
                this.open();
            }
        }
        /**
         * Gets the panel content.
         * @public
         * @returns {HTMLDivElement} The panel content.
         */
        getContent() {
            return this._content;
        }
        /**
         * Gets the WUX panel.
         * @public
         * @returns {Panel} The WUX panel.
         */
        getWUXPanel() {
            return this._panel;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                      ____  ____   ___ _____ _____ ____ _____ _____ ____                        //
        //                     |  _ \|  _ \ / _ \_   _| ____/ ___|_   _| ____|  _ \                       //
        //                     | |_) | |_) | | | || | |  _|| |     | | |  _| | | | |                      //
        //                     |  __/|  _ <| |_| || | | |__| |___  | | | |___| |_| |                      //
        //                     |_|   |_| \_\\___/ |_| |_____\____| |_| |_____|____/                       //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * The callback on the panel open event.
         * @protected
         */
        _onOpen() {
            this._openState = true;
            if (this._onOpenCB !== undefined) {
                this._onOpenCB();
            }
        }
        /**
         * The callback on the panel close event.
         * @protected
         */
        _onClose() {
            if (this._panel !== undefined) {
                this._panel.removeEventListener('close', this._onCloseCB, false);
                this._panel.removeEventListener('contentVisibleStateChange', this._onContentVisibleStateChangeCB, false);
                this._panel = undefined;
            }
            this._content = undefined;
            this._openState = false;
        }
        /**
         * The callback on the panel content visible state change event.
         * @protected
         * @param {WUXEvent} _event = the panel content visible state change event.
         */
        // eslint-disable-next-line class-methods-use-this
        _onContentVisibleStateChange(_event) { }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                           ____  ____  _____     ___  _____ _____                               //
        //                          |  _ \|  _ \|_ _\ \   / / \|_   _| ____|                              //
        //                          | |_) | |_) || | \ \ / / _ \ | | |  _|                                //
        //                          |  __/|  _ < | |  \ V / ___ \| | | |___                               //
        //                          |_|   |_| \_\___|  \_/_/   \_\_| |_____|                              //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Initializes the panel options.
         * @private
         */
        _initializeOptions() {
            this._options = this._options || {};
            this._options.resizableFlag = UITools.getOptionValue(this._options.resizableFlag, true);
            this._options.allowMaximizeFlag = UITools.getOptionValue(this._options.allowMaximizeFlag, true);
            this._options.maximizeButtonFlag = UITools.getOptionValue(this._options.maximizeButtonFlag, true);
            this._options.closeButtonFlag = UITools.getOptionValue(this._options.closeButtonFlag, true);
            this._options.horizontallyStretchableFlag = UITools.getOptionValue(this._options.horizontallyStretchableFlag, true);
            this._options.verticallyStretchableFlag = UITools.getOptionValue(this._options.verticallyStretchableFlag, true);
            this._options.ensureHeightDefinitionOnHierarchy = UITools.getOptionValue(this._options.ensureHeightDefinitionOnHierarchy, true);
            // WUX bugfix: To resolve WUX issue where width option is not applied when panel is docked -> Set the dock area after panel creation!
            this._initialDockingArea = this._options.currentDockArea;
            delete this._options.currentDockArea;
        }
        /**
         * Creates the panel.
         * @private
         */
        _createPanel() {
            this._content = this._options.content = UIDom.createElement('div', { className: 'sch-panel-content' });
            this._panel = new Panel(this._options);
            UIDom.addClassName(this._panel.getContent(), ['sch-panel', this._options.className].flat());
            this._panel.currentDockArea = this._initialDockingArea; // WUX bugfix!
            this._panel.allowedDockAreas = WebUXGlobalEnums_1.WUXDockAreaEnum.BottomDockArea | WebUXGlobalEnums_1.WUXDockAreaEnum.LeftDockArea | WebUXGlobalEnums_1.WUXDockAreaEnum.RightDockArea;
            this._panel.addEventListener('close', this._onCloseCB, false);
            this._panel.addEventListener('contentVisibleStateChange', this._onContentVisibleStateChangeCB, false);
            this._createContent();
        }
        /**
         * Stacks panels together in the same docking area and creates a window group.
         * @private
         */
        _stackInWindowGroup() {
            const currentDockArea = this._panel.currentDockArea;
            if (currentDockArea !== undefined && currentDockArea !== WebUXGlobalEnums_1.WUXDockAreaEnum.NoneDockArea) {
                const dockingElement = this._panel.immersiveFrame.getDockingElement(currentDockArea);
                const windows = dockingElement.getContainedVisibleWindows();
                if (windows.length > 0 && windows[0] !== this._panel) {
                    this._panel.attachToWindow(windows[0], WUXSnapAreaEnum.InsideArea);
                }
            }
        }
    }
    return UIPanel;
});
