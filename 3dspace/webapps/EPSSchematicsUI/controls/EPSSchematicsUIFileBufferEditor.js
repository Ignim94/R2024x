/// <amd-module name='DS/EPSSchematicsUI/controls/EPSSchematicsUIFileBufferEditor'/>
define("DS/EPSSchematicsUI/controls/EPSSchematicsUIFileBufferEditor", ["require", "exports", "DS/Controls/Abstract", "DS/Core/WebUXComponents", "DS/Controls/Button", "DS/Utilities/Dom", "DS/Controls/TooltipModel", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "css!DS/EPSSchematicsUI/css/controls/EPSSchematicsUIFileBufferEditor"], function (require, exports, WUXAbstract, WebUXComponents, WUXButton, WUXDomUtils, WUXTooltipModel, UIDom, UITools, UIWUXTools, UINLS) {
    "use strict";
    /**
     * This class defines the UI FileBuffer editor WUX control.
     * @private
     * @class UIFileBufferEditor
     * @alias module:DS/EPSSchematicsUI/controls/EPSSchematicsUIFileBufferEditor
     * @extends WUXAbstract
     */
    class UIFileBufferEditor extends WUXAbstract {
        /**
         * @property {Object} publishedProperties - The default control properties.
         * @private
         */
        static get publishedProperties() {
            return {
                value: {
                    defaultValue: undefined,
                    type: 'ArrayBuffer',
                    category: 'Behavior',
                    advancedSetter: false
                }
            };
        }
        _applyProperties(oldValues) {
            super._applyProperties(oldValues);
            if (this.isDirty('value')) {
                this._updateView();
            }
        }
        _applyValue(_oldValue, newValue) {
            this.value = newValue;
            this._updateView();
            if (!this._preventTriggeringChangeEvent) {
                this.fire('change');
            }
        }
        _applyTooltipInfos() {
            if (!this.tooltipInfos) {
                this._properties.tooltipInfos.value = this._defaultTooltipModel;
            }
            super._applyTooltipInfos();
        }
        _updateView() {
            if (this.elements.input) {
                this.elements.input.value = UITools.buildJSONString(this.value);
            }
            this._updateInputTooltip();
        }
        /**
         * Builds the view of the control.
         * @protected
         */
        buildView() {
            this._preventTriggeringChangeEvent = true; // Prevent fire change event during the control build
            UIDom.addClassName(this.elements.container, 'sch-controls-filebuffer-editor');
            this.elements._inputTrigger = UIDom.createElement('input', {
                className: 'sch-controls-filebuffer-input-trigger',
                attributes: {
                    type: 'file',
                    title: ''
                }
            });
            this.elements.leftContainer = UIDom.createElement('div', {
                className: 'sch-controls-filebuffer-editor-left-container',
                parent: this.elements.container
            });
            this.elements.input = UIDom.createElement('input', {
                className: 'sch-controls-filebuffer-input',
                parent: this.elements.leftContainer,
                attributes: {
                    readonly: 'readonly',
                    tabIndex: 0,
                    placeholder: UINLS.get('placeholderSelectAFile')
                }
            });
            this.elements.rightContainer = UIDom.createElement('div', {
                className: 'sch-controls-filebuffer-editor-right-container',
                parent: this.elements.container
            });
            this.elements.button = new WUXButton({
                showLabelFlag: false,
                icon: { iconName: 'upload', iconSize: '1x', fontIconFamily: WUXManagedFontIcons.Font3DS },
                tooltipInfos: UIWUXTools.createTooltip({ shortHelp: UINLS.get('placeholderSelectAFile') })
            });
            UIDom.addClassName(this.elements.button.elements.container, 'sch-controls-filebuffer-button');
            this.elements.button.elements.container.setAttribute('tabindex', -1); // to prevent focus while using tab key
            this.elements.rightContainer.appendChild(this.elements.button.getContent());
            this._updateInputTooltip();
        }
        /**
         * The callback on the control post build view.
         * @public
         */
        _postBuildView() {
            this._preventTriggeringChangeEvent = false; // Restore the change event dispatching
        }
        /**
         * Handles the control events.
         * @public
         */
        handleEvents() {
            WUXDomUtils.addEventOnElement(this, this.elements.button.getContent(), 'buttonclick', event => {
                event.stopPropagation();
                event.preventDefault();
                this.elements._inputTrigger.click();
            });
            WUXDomUtils.addEventOnElement(this, this.elements._inputTrigger, 'change', event => {
                event.stopPropagation();
                const files = this.elements._inputTrigger.files;
                if (files !== undefined && files.length > 0) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const result = e.target.result;
                        /*const array = new Uint8Array(result);
                        const binaryString = String.fromCharCode.apply(null, array as any);
                        console.log(binaryString);*/
                        this.value = result;
                    };
                    reader.readAsArrayBuffer(files[0]);
                }
            });
        }
        _updateInputTooltip() {
            if (!this._defaultTooltipModel) {
                this._defaultTooltipModel = new WUXTooltipModel();
            }
            const isValued = this.value !== undefined;
            const shortHelp = isValued ? 'Buffer(ByteLength)' : UINLS.get('placeholderSelectAFile');
            this._defaultTooltipModel.shortHelp = shortHelp;
        }
    }
    WebUXComponents.addClass(UIFileBufferEditor, 'UIFileBufferEditor');
    return UIFileBufferEditor;
});
