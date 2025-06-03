/// <amd-module name='DS/EPSSchematicsUI/viewers/EPSSchematicsUIEGraphViewer'/>
define("DS/EPSSchematicsUI/viewers/EPSSchematicsUIEGraphViewer", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphViews"], function (require, exports, EGraphCore, EGraphViews) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class define the UI EGraph base element.
     * @private
     * @abstract
     * @class UIEGraphViewer
     * @alias module:DS/EPSSchematicsUI/viewers/EPSSchematicsUIEGraphViewer
     */
    class UIEGraphViewer {
        /**
         * @public
         * @constructor
         * @param {HTMLElement} container - The HTML parent container that will hold the graph viewer.
         * @param {UIEditor} editor - The editor.
         */
        constructor(container, editor) {
            this._container = container;
            this._editor = editor;
            this._display = new EGraphCore.EGraph();
            this._display.addView('main', new EGraphViews.HTMLGraphView(this._container));
            this._display.data = { uiElement: this };
        }
        /**
         * Removes the EGraph base element.
         * @public
         */
        remove() {
            this._container.parentNode.removeChild(this._container);
            this._container = undefined;
            this._editor = undefined;
            this._display = undefined;
        }
        /**
         * Gets the viewer display.
         * @public
         * @returns {EGraphCore.EGraph} The viewer display.
         */
        getDisplay() {
            return this._display;
        }
        /**
         * Gets the main view of the EGraph viewer.
         * @public
         * @returns {EGraphViews.HTMLGraphView} The main view of the EGraph viewer.
         */
        getView() {
            return this._display.views.main;
        }
        /**
         * Gets the editor.
         * @public
         * @returns {UIEditor} The editor.
         */
        getEditor() {
            return this._editor;
        }
        /**
         * Gets the viewer container.
         * @public
         * @returns {HTMLElement} The viewer container.
         */
        getContainer() {
            return this._container;
        }
        /**
         * Gets the client height of the viewer.
         * @public
         * @returns {number} The client height of the viewer.
         */
        getHeight() {
            return this._container.clientHeight;
        }
        /**
        * Gets the client width of the viewer.
        * @public
        * @returns {number} The client width of the viewer.
        */
        getWidth() {
            return this._container.clientWidth;
        }
        /**
         * Get the bounding box of the current  viewer.
         * @public
         * @returns {IDOMRect} The bounding box of the current  viewer.
         */
        getClientRect() {
            return this._container.getClientRects()[0];
        }
        /**
         * Gets the current viewpoint of the viewer.
         * @public
         * @returns {IViewpoint} The current viewpoint.
         */
        getViewpoint() {
            return {
                translationX: this._display.views.main.vpt[0],
                translationY: this._display.views.main.vpt[1],
                scale: this._display.views.main.vpt[2]
            };
        }
        /**
         * Sets the viewpoint of the  viewer.
         * @public
         * @param {IViewpoint} vpt - The viewpoint to set.
         */
        setViewpoint(vpt) {
            this._display.views.main.setViewpoint([vpt.translationX, vpt.translationY, vpt.scale]);
        }
        /**
         * Computes the coordinates relative to the viewpoint from clientX, clientY mouse coordinates.
         * @public
         * @param {number} clientX - The mouse event clientX property.
         * @param {number} clientY - The mouse event clientY property.
         * @returns {[number, number]} An array of two numbers [x,y] expressed in viewpoint coordinate system.
         */
        clientToViewpoint(clientX, clientY) {
            return this._display.views.main.clientToViewpoint(clientX, clientY);
        }
        /**
         * Gets the middle viewpoint position.
         * @public
         * @returns {IDomPosition} The left and top middle viewpoint position.
         */
        getMiddleViewpointPosition() {
            //const viewerSize = this.display.views.main.getSize(); EGraph issue: getSize()/height/width are invalid because not refreshed while resizing the browser!
            //const position = this.clientToViewpoint(viewerSize[0] /2, viewerSize[1] / 2);
            const bbox = this._display.views.main.domRoot.getBoundingClientRect();
            const position = this.clientToViewpoint(bbox.width / 2, bbox.height / 2);
            return { left: position[0], top: position[1] };
        }
    }
    return UIEGraphViewer;
});
