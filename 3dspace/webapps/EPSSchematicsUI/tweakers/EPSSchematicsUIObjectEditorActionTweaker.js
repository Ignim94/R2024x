/// <amd-module name='DS/EPSSchematicsUI/tweakers/EPSSchematicsUIObjectEditorActionTweaker'/>
define("DS/EPSSchematicsUI/tweakers/EPSSchematicsUIObjectEditorActionTweaker", ["require", "exports", "DS/Tweakers/TweakerBase", "DS/Utilities/Utils", "DS/Core/WebUXComponents", "DS/EPSSchematicsUI/controls/EPSSchematicsUIObjectEditorAction", "DS/Utilities/Dom"], function (require, exports, WUXTweakerBase, WUXUtils, WebUXComponents, UIObjectEditorAction, WUXDomUtils) {
    "use strict";
    /**
     * This class defines the UI object editor action WUX tweaker.
     * @private
     * @class UIObjectEditorActionTweaker
     * @alias DS/EPSSchematicsUI/tweakers/EPSSchematicsUIObjectEditorActionTweaker
     * @extends WUXTweakerBase
     */
    class UIObjectEditorActionTweaker extends WUXTweakerBase {
        /**
         * @property {Object} publishedProperties - The default control properties.
         * @private
         */
        static get publishedProperties() {
            return {
                value: {
                    defaultValue: '',
                    type: 'string',
                    category: 'Behavior'
                },
                displayStyle: {
                    defaultValue: 'myStyle',
                    type: 'string'
                },
                addButtonDefinition: {
                    defaultValue: undefined,
                    type: 'object',
                    category: 'Behavior'
                },
                removeButtonDefinition: {
                    defaultValue: undefined,
                    type: 'object',
                    category: 'Behavior'
                },
                undefinedButtonDefinition: {
                    defaultValue: undefined,
                    type: 'object',
                    category: 'Behavior'
                },
                emptyArrayButtonDefinition: {
                    defaultValue: undefined,
                    type: 'object',
                    category: 'Behavior'
                },
                emptyObjectButtonDefinition: {
                    defaultValue: undefined,
                    type: 'object',
                    category: 'Behavior'
                },
                resetButtonDefinition: {
                    defaultValue: undefined,
                    type: 'object',
                    category: 'Behavior'
                }
            };
        }
        _applyProperties(oldValues) {
            super._applyProperties(oldValues);
            if (this.isDirty('addButtonDefinition')) {
                this._applyAddButtonDefinition(oldValues.addButtonDefinition, this.addButtonDefinition);
            }
            if (this.isDirty('removeButtonDefinition')) {
                this._applyRemoveButtonDefinition(oldValues.removeButtonDefinition, this.removeButtonDefinition);
            }
            if (this.isDirty('undefinedButtonDefinition')) {
                this._applyUndefinedButtonDefinition(oldValues.undefinedButtonDefinition, this.undefinedButtonDefinition);
            }
            if (this.isDirty('resetButtonDefinition')) {
                this._applyResetButtonDefinition(oldValues.resetButtonDefinition, this.resetButtonDefinition);
            }
            if (this.isDirty('emptyArrayButtonDefinition')) {
                this._applyEmptyArrayButtonDefinition(oldValues.emptyArrayButtonDefinition, this.emptyArrayButtonDefinition);
            }
            if (this.isDirty('emptyObjectButtonDefinition')) {
                this._applyEmptyObjectButtonDefinition(oldValues.emptyObjectButtonDefinition, this.emptyObjectButtonDefinition);
            }
        }
        _applyAddButtonDefinition(oldValue, newValue) {
            if (this.elements._viewModule && !this.readOnly) {
                this.elements._viewModule.setAddButtonDefinition(newValue, oldValue);
            }
        }
        _applyRemoveButtonDefinition(oldValue, newValue) {
            if (this.elements._viewModule && !this.readOnly) {
                this.elements._viewModule.setRemoveButtonDefinition(newValue, oldValue);
            }
        }
        _applyUndefinedButtonDefinition(oldValue, newValue) {
            if (this.elements._viewModule && !this.readOnly) {
                this.elements._viewModule.setUndefinedButtonDefinition(newValue, oldValue);
            }
        }
        _applyResetButtonDefinition(oldValue, newValue) {
            if (this.elements._viewModule && !this.readOnly) {
                this.elements._viewModule.setResetButtonDefinition(newValue, oldValue);
            }
        }
        _applyEmptyArrayButtonDefinition(oldValue, newValue) {
            if (this.elements._viewModule && !this.readOnly) {
                this.elements._viewModule.setEmptyArrayButtonDefinition(newValue, oldValue);
            }
        }
        _applyEmptyObjectButtonDefinition(oldValue, newValue) {
            if (this.elements._viewModule && !this.readOnly) {
                this.elements._viewModule.setEmptyObjectButtonDefinition(newValue, oldValue);
            }
        }
    }
    const BaseViewModuleObjectEditorActionTweaker = function (tweaker, options) {
        WUXTweakerBase.prototype.baseViewModule.call(this, tweaker, options);
    };
    WUXUtils.applyMixin(BaseViewModuleObjectEditorActionTweaker, WUXTweakerBase.prototype.baseViewModule);
    BaseViewModuleObjectEditorActionTweaker.prototype.buildView = function () {
        if (this._tweaker.elements.container) {
            this._view = new UIObjectEditorAction();
            this.setValue(this._tweaker.value);
            this._view.addButtonDefinition = this._tweaker.addButtonDefinition;
            this._view.removeButtonDefinition = this._tweaker.removeButtonDefinition;
            this._view.undefinedButtonDefinition = this._tweaker.undefinedButtonDefinition;
            this._view.resetButtonDefinition = this._tweaker.resetButtonDefinition;
            this._view.emptyArrayButtonDefinition = this._tweaker.emptyArrayButtonDefinition;
            this._view.emptyObjectButtonDefinition = this._tweaker.emptyObjectButtonDefinition;
        }
    };
    BaseViewModuleObjectEditorActionTweaker.prototype.setValue = function (newValue /*, oldValue: any*/) {
        this._view.value = newValue;
    };
    BaseViewModuleObjectEditorActionTweaker.prototype.setAddButtonDefinition = function (newValue /*, oldValue: any*/) {
        this._view.addButtonDefinition = newValue;
    };
    BaseViewModuleObjectEditorActionTweaker.prototype.setRemoveButtonDefinition = function (newValue /*, oldValue: any*/) {
        this._view.removeButtonDefinition = newValue;
    };
    BaseViewModuleObjectEditorActionTweaker.prototype.setUndefinedButtonDefinition = function (newValue /*, oldValue: any*/) {
        this._view.undefinedButtonDefinition = newValue;
    };
    BaseViewModuleObjectEditorActionTweaker.prototype.setResetButtonDefinition = function (newValue /*, oldValue: any*/) {
        this._view.resetButtonDefinition = newValue;
    };
    BaseViewModuleObjectEditorActionTweaker.prototype.setEmptyArrayButtonDefinition = function (newValue /*, oldValue: any*/) {
        this._view.emptyArrayButtonDefinition = newValue;
    };
    BaseViewModuleObjectEditorActionTweaker.prototype.setEmptyObjectButtonDefinition = function (newValue /*, oldValue: any*/) {
        this._view.emptyObjectButtonDefinition = newValue;
    };
    BaseViewModuleObjectEditorActionTweaker.prototype.handleEvents = function () {
        WUXDomUtils.addEventOnElement(this._tweaker, this._view, 'change', event => {
            event.stopPropagation();
            this.setTweakerValue(this._view.value);
        });
    };
    UIObjectEditorActionTweaker.prototype.baseViewModule = BaseViewModuleObjectEditorActionTweaker;
    UIObjectEditorActionTweaker.prototype.VIEW_MODULES = {
        myStyle: { classObject: BaseViewModuleObjectEditorActionTweaker, options: { viewOptions: { displayStyle: 'myStyle' } } }
    };
    WebUXComponents.addClass(UIObjectEditorActionTweaker, 'UIObjectEditorActionTweaker');
    return UIObjectEditorActionTweaker;
});
