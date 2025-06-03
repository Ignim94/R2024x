/// <amd-module name='DS/EPSSchematicsUI/tools/EPSSchematicsUIFileLoader'/>
define("DS/EPSSchematicsUI/tools/EPSSchematicsUIFileLoader", ["require", "exports", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom"], function (require, exports, UIDom) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * A file loader class allowing to load files.
     * @class UIFileLoader
     * @alias module:DS/EPSSchematicsUI/tools/EPSSchematicsUIFileLoader
     * @private
     */
    class UIFileLoader {
        /**
         * @constructor
         * @param {UIViewer} viewer - The graph viewer.
         */
        constructor(viewer) {
            this._onFileChangeCB = this.onFileChange.bind(this);
            this._viewer = viewer;
            this._inputElement = UIDom.createElement('input');
            this._inputElement.setAttribute('type', 'file');
            this._inputElement.setAttribute('accept', '.json');
            this._inputElement.addEventListener('change', this._onFileChangeCB, false);
            this._inputElement.style.display = 'none';
            this._viewer.getContainer().appendChild(this._inputElement);
        }
        /**
         * Removes the file loader.
         * @public
         */
        remove() {
            this._viewer.getContainer().removeChild(this._inputElement);
            this._inputElement.removeEventListener('change', this._onFileChangeCB, false);
            this._viewer = undefined;
            this._inputElement = undefined;
            this._onFileChangeCB = undefined;
        }
        /**
         * Gets the file loader input element.
         * @public
         * @returns {HTMLInputElement} The file loader input element.
         */
        getInput() {
            return this._inputElement;
        }
        /**
         * Sets the file loader input element.
         * @public
         * @param {HTMLInputElement} input - The file loader input element.
         */
        setInput(input) {
            this._inputElement = input;
        }
        /**
         * Loads a file.
         * @public
         */
        loadFile() {
            this._inputElement.value = '';
            this._inputElement.click();
        }
        /**
         * The callback on the file change event.
         * @public
         * @param {Event} event - The file change event.
         */
        onFileChange(event) {
            const file = event.target.files[0];
            if (file !== null && file !== undefined) {
                const reader = new FileReader();
                reader.onload = this.onReaderLoad.bind(this);
                reader.readAsText(file);
            }
        }
        /**
         * The callback on the reader load event.
         * @public
         * @param {Event} event - The reader load event.
         */
        onReaderLoad(event) {
            const result = event.target.result;
            if (result !== undefined) {
                const editor = this._viewer.getEditor();
                if (this._viewer === editor.getViewerController().getRootViewer()) {
                    editor.setContent(result);
                }
                else {
                    this._viewer.load(result);
                    editor.onChange();
                }
            }
        }
    }
    return UIFileLoader;
});
