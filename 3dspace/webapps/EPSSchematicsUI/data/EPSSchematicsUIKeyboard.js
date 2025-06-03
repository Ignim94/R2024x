/// <amd-module name='DS/EPSSchematicsUI/data/EPSSchematicsUIKeyboard'/>
define("DS/EPSSchematicsUI/data/EPSSchematicsUIKeyboard", ["require", "exports", "text!DS/EPSSchematicsUI/assets/EPSSchematicsUIKeyboard.json"], function (require, exports, UIKeyboardJSON) {
    "use strict";
    /* eslint-enable no-unused-vars */
    const JSONKeyboard = JSON.parse(UIKeyboardJSON);
    /**
     * The class defines the UI keyboard.
     * @class UIKeyboard
     * @alias module:DS/EPSSchematicsUI/data/EPSSchematicsUIKeyboard
     * @private
     */
    class UIKeyboard {
        /**
         * @constructor
         * @param {IKeyDefinition} key - The key definition.
         */
        constructor(key) {
            this._key = key;
        }
        /**
         * Gets the code of the key.
         * @public
         * @returns {string} The code of the key.
         */
        getCode() {
            return this._key.code;
        }
        /**
         * Gets the key code of the key.
         * @public
         * @returns {number} The key code of the key.
         */
        getKeyCode() {
            return this._key.keyCode;
        }
        /**
         * Checks if the key is pressed.
         * @private
         * @param {KeyboardEvent} event - The keyboard event.
         * @param {UIKeyboard} key - The key definition.
         * @returns {boolean} True if the key is pressed else false.
         */
        static isKeyPressed(event, key) {
            return event.code === key.getCode() || event.keyCode === key.getKeyCode();
        }
    }
    UIKeyboard.eBackspace = new UIKeyboard(JSONKeyboard.eBackspace);
    UIKeyboard.eEnter = new UIKeyboard(JSONKeyboard.eEnter);
    UIKeyboard.eControl = new UIKeyboard(JSONKeyboard.eControl);
    UIKeyboard.eEscape = new UIKeyboard(JSONKeyboard.eEscape);
    UIKeyboard.eSpace = new UIKeyboard(JSONKeyboard.eSpace);
    UIKeyboard.ePageUp = new UIKeyboard(JSONKeyboard.ePageUp);
    UIKeyboard.ePageDown = new UIKeyboard(JSONKeyboard.ePageDown);
    UIKeyboard.eEnd = new UIKeyboard(JSONKeyboard.eEnd);
    UIKeyboard.eHome = new UIKeyboard(JSONKeyboard.eHome);
    UIKeyboard.eArrowLeft = new UIKeyboard(JSONKeyboard.eArrowLeft);
    UIKeyboard.eArrowUp = new UIKeyboard(JSONKeyboard.eArrowUp);
    UIKeyboard.eArrowRight = new UIKeyboard(JSONKeyboard.eArrowRight);
    UIKeyboard.eArrowDown = new UIKeyboard(JSONKeyboard.eArrowDown);
    UIKeyboard.eDelete = new UIKeyboard(JSONKeyboard.eDelete);
    UIKeyboard.eKeyC = new UIKeyboard(JSONKeyboard.eKeyC);
    UIKeyboard.eKeyE = new UIKeyboard(JSONKeyboard.eKeyE);
    UIKeyboard.eKeyF = new UIKeyboard(JSONKeyboard.eKeyF);
    UIKeyboard.eKeyG = new UIKeyboard(JSONKeyboard.eKeyG);
    UIKeyboard.eKeyK = new UIKeyboard(JSONKeyboard.eKeyK);
    UIKeyboard.eKeyL = new UIKeyboard(JSONKeyboard.eKeyL);
    UIKeyboard.eKeyO = new UIKeyboard(JSONKeyboard.eKeyO);
    UIKeyboard.eKeyP = new UIKeyboard(JSONKeyboard.eKeyP);
    UIKeyboard.eKeyS = new UIKeyboard(JSONKeyboard.eKeyS);
    UIKeyboard.eKeyT = new UIKeyboard(JSONKeyboard.eKeyT);
    UIKeyboard.eKeyY = new UIKeyboard(JSONKeyboard.eKeyY);
    UIKeyboard.eKeyZ = new UIKeyboard(JSONKeyboard.eKeyZ);
    UIKeyboard.eNumpad0 = new UIKeyboard(JSONKeyboard.eNumpad0);
    UIKeyboard.eNumpad1 = new UIKeyboard(JSONKeyboard.eNumpad1);
    UIKeyboard.eNumpad2 = new UIKeyboard(JSONKeyboard.eNumpad2);
    UIKeyboard.eNumpad3 = new UIKeyboard(JSONKeyboard.eNumpad3);
    UIKeyboard.eNumpad4 = new UIKeyboard(JSONKeyboard.eNumpad4);
    UIKeyboard.eNumpad5 = new UIKeyboard(JSONKeyboard.eNumpad5);
    UIKeyboard.eNumpad6 = new UIKeyboard(JSONKeyboard.eNumpad6);
    UIKeyboard.eNumpad7 = new UIKeyboard(JSONKeyboard.eNumpad7);
    UIKeyboard.eNumpad8 = new UIKeyboard(JSONKeyboard.eNumpad8);
    UIKeyboard.eNumpad9 = new UIKeyboard(JSONKeyboard.eNumpad9);
    UIKeyboard.eF8 = new UIKeyboard(JSONKeyboard.eF8);
    UIKeyboard.eF9 = new UIKeyboard(JSONKeyboard.eF9);
    UIKeyboard.eF10 = new UIKeyboard(JSONKeyboard.eF10);
    UIKeyboard.eF11 = new UIKeyboard(JSONKeyboard.eF11);
    return UIKeyboard;
});
