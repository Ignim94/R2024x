/// <amd-module name='DS/EPSSchematicsUI/controllers/EPSSchematicsUILocalStorageController'/>
define("DS/EPSSchematicsUI/controllers/EPSSchematicsUILocalStorageController", ["require", "exports", "DS/EPSSchematicsUI/controllers/EPSSchematicsUIAbstractStorageController"], function (require, exports, UIAbstractStorageController) {
    "use strict";
    /**
     * This class defines the UI local storage controller.
     * @class UILocalStorageController
     * @alias module:DS/EPSSchematicsUI/controllers/EPSSchematicsUILocalStorageController
     * @extends UIAbstractStorageController
     * @private
     */
    class UILocalStorageController extends UIAbstractStorageController {
        /**
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         */
        constructor(editor) {
            super({
                applicatioName: UILocalStorageController._getApplicationName(),
                storageContainer: window.localStorage,
                defaultStorage: {
                    settings: {
                        maxSplitDataPortCount: 10,
                        alwaysMinimizeDataLinks: false
                    },
                    blockLibrary: {
                        favorites: []
                    }
                },
                onError: e => {
                    this._editor.displayNotification({
                        level: 'error',
                        subtitle: 'Error while writing to local storage!',
                        message: e.stack
                    });
                }
            });
            this._editor = editor;
        }
        /**
         * Removes the controller.
         * @public
         */
        remove() {
            this._editor = undefined;
            super.remove();
        }
        /**
         * Gets the maxSplitDataPortCount editor settings value.
         * @public
         * @returns {number} The maxSplitDataPortCount editor settings value.
         */
        getMaxSplitDataPortCountEditorSetting() {
            return this._currentStorage.settings.maxSplitDataPortCount;
        }
        /**
         * Sets the maxSplitDataPortCount editor settings value.
         * @public
         * @param {number} value - The maxSplitDataPortCount editor settings value.
         */
        setMaxSplitDataPortCountEditorSetting(value) {
            this._currentStorage.settings.maxSplitDataPortCount = value;
            this._writeStorage();
        }
        /**
         * Gets the alwaysMinimizeDataLinks editor settings value.
         * @public
         * @returns {boolean} The alwaysMinimizeDataLinks editor settings value.
         */
        getAlwaysMinimizeDataLinksSetting() {
            return this._currentStorage.settings.alwaysMinimizeDataLinks;
        }
        /**
         * Sets the alwaysMinimizeDataLinks editor settings value.
         * @public
         * @param {boolean} value - The alwaysMinimizeDataLinks editor settings value
         */
        setAlwaysMinimizeDataLinksSetting(value) {
            this._currentStorage.settings.alwaysMinimizeDataLinks = value;
            this._writeStorage();
            // Update opened graphs
            const viewers = this._editor.getViewerController().getRootViewerWithAllViewers();
            viewers.forEach(viewer => viewer.getMainGraph().setDataLinksMinimizerState(value));
        }
        /**
         * Gets the block library favorites value.
         * @public
         * @returns {string[]} value - The block library favorites value.
         */
        getBlockLibraryFavorites() {
            return this._currentStorage.blockLibrary.favorites;
        }
        /**
         * Sets the block library favorites value.
         * @public
         * @param {string[]} value - The block library favorites value.
         */
        setBlockLibraryFavorites(value) {
            this._currentStorage.blockLibrary.favorites = value;
            this._writeStorage();
        }
    }
    return UILocalStorageController;
});
