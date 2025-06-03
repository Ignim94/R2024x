/// <amd-module name='DS/EPSSchematicsUI/tweakers/EPSSchematicsUIJSONTweaker'/>
define("DS/EPSSchematicsUI/tweakers/EPSSchematicsUIJSONTweaker", ["require", "exports", "DS/Tweakers/TweakerBase", "DS/Utilities/Utils", "DS/Core/WebUXComponents", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "css!DS/EPSSchematicsUI/css/tweakers/EPSSchematicsUIJSONTweaker"], function (require, exports, WUXTweakerBase, WUXUtils, WebUXComponents, UIDom, UITools) {
    "use strict";
    const BaseViewModuleTweakerBase = WUXTweakerBase.prototype.baseViewModule;
    /**
     * This class defines the UI JSON WUX tweaker.
     * @private
     * @class UIJSONTweaker
     * @alias module:DS/EPSSchematicsUI/tweakers/EPSSchematicsUIJSONTweaker
     * @extends WUXTweakerBase
     */
    class UIJSONTweaker extends WUXTweakerBase {
        /**
         * @property {Object} publishedProperties - The default control properties.
         * @private
         */
        static get publishedProperties() {
            return {
                value: {
                    defaultValue: undefined,
                    type: 'object',
                    category: 'Behavior',
                    advancedSetter: false
                }
            };
        }
        _applyValue(oldValue, newValue) {
            if (this.elements._viewModule) {
                this.elements._viewModule.setValue(newValue, oldValue);
            }
            super._applyValue(oldValue, newValue);
        }
    }
    const BaseViewModuleUIJSONTweaker = function (tweaker, options) {
        BaseViewModuleTweakerBase.call(this, tweaker, options);
    };
    WUXUtils.applyMixin(BaseViewModuleUIJSONTweaker, BaseViewModuleTweakerBase);
    BaseViewModuleUIJSONTweaker.prototype.buildView = function () {
        if (this._tweaker.elements.container) {
            UIDom.addClassName(this._tweaker.elements.container, 'sch-tweakers-json');
            this._tweaker.elements.container.textContent = UITools.buildJSONString(this._tweaker.value);
        }
    };
    BaseViewModuleUIJSONTweaker.prototype.destroy = function () {
        if (this._tweaker.elements.container) {
            UIDom.removeClassName(this._tweaker.elements.container, 'sch-tweakers-json');
            this._tweaker.elements.container.textContent = '';
        }
        BaseViewModuleTweakerBase.prototype.destroy.call(this);
    };
    BaseViewModuleUIJSONTweaker.prototype.setValue = function (newValue, _oldValue) {
        this._tweaker.elements.container.textContent = UITools.buildJSONString(newValue);
    };
    UIJSONTweaker.prototype.baseViewModule = BaseViewModuleUIJSONTweaker;
    UIJSONTweaker.prototype.VIEW_MODULES = {
        edition: { classObject: BaseViewModuleUIJSONTweaker },
        readOnly: { classObject: BaseViewModuleUIJSONTweaker }
    };
    WebUXComponents.addClass(UIJSONTweaker, 'UIJSONTweaker');
    return UIJSONTweaker;
});
