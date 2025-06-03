/* global IWUXControlAbstract, TooltipModel */
/// <amd-module name='DS/EPSSchematicsUI/controls/EPSSchematicsUIObjectEditorAction'/>
define("DS/EPSSchematicsUI/controls/EPSSchematicsUIObjectEditorAction", ["require", "exports", "DS/Controls/Abstract", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/Core/WebUXComponents", "DS/Controls/Button", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "css!DS/EPSSchematicsUI/css/controls/EPSSchematicsUIObjectEditorAction"], function (require, exports, WUXAbstract, UIDom, WebUXComponents, WUXButton, UIFontIcon, UIWUXTools, UINLS) {
    "use strict";
    /**
     * This class defines the UI object editor action WUX control.
     * @private
     * @class UIObjectEditorAction
     * @alias DS/EPSSchematicsUI/controls/EPSSchematicsUIObjectEditorAction
     * @extends WUXAbstract
     */
    class UIObjectEditorAction extends WUXAbstract {
        /**
         * @public
         * @constructor
         */
        constructor() {
            super();
        }
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
        /**
         * Removes the control.
         * @public
         * @returns {IWUXControlAbstract} The removed control.
         */
        remove() {
            return super.remove();
        }
        _applyValue(_oldValue, newValue) {
            this.value = newValue;
            this.fire('change');
        }
        _applyAddButtonDefinition(_oldValue, _newValue) {
            if (this.addButtonDefinition && this.addButtonDefinition.display) {
                if (this.elements.addButton === undefined) {
                    this.elements.addButton = new WUXButton({
                        emphasize: 'secondary',
                        displayStyle: 'smartIcon',
                        icon: UIFontIcon.getWUXFAIconDefinition('plus'),
                        allowUnsafeHTMLLabel: false,
                        tooltipInfos: UIObjectEditorAction._createTooltip(this.addButtonDefinition.tooltipOptions),
                        onClick: () => {
                            this.value = 'eAddAction';
                            this.value = '';
                        }
                    }).inject(this._getContainer(this.addButtonDefinition.index));
                }
            }
            else if (this.elements.addButton) {
                UIObjectEditorAction._removeButton(this.elements.addButton);
                this.elements.addButton = undefined;
            }
        }
        _applyRemoveButtonDefinition(_oldValue, _newValue) {
            if (this.removeButtonDefinition && this.removeButtonDefinition.display) {
                if (this.elements.removeButton === undefined) {
                    this.elements.removeButton = new WUXButton({
                        emphasize: 'secondary',
                        displayStyle: 'smartIcon',
                        icon: UIFontIcon.getWUX3DSIconDefinition('trash'),
                        allowUnsafeHTMLLabel: false,
                        tooltipInfos: UIObjectEditorAction._createTooltip(this.removeButtonDefinition.tooltipOptions),
                        onClick: () => {
                            this.value = 'eRemoveAction';
                            this.value = '';
                        }
                    }).inject(this._getContainer(this.removeButtonDefinition.index));
                }
            }
            else if (this.elements.removeButton) {
                UIObjectEditorAction._removeButton(this.elements.removeButton);
                this.elements.removeButton = undefined;
            }
        }
        _applyUndefinedButtonDefinition(_oldValue, _newValue) {
            if (this.undefinedButtonDefinition && this.undefinedButtonDefinition.display) {
                if (this.elements.undefinedButton === undefined) {
                    this.elements.undefinedButton = new WUXButton({
                        emphasize: 'secondary',
                        displayStyle: 'smartIcon',
                        icon: UIFontIcon.getWUX3DSIconDefinition('math-null-sign'),
                        allowUnsafeHTMLLabel: false,
                        tooltipInfos: UIObjectEditorAction._createTooltip({
                            title: UINLS.get('setDefaultValueToUndefinedTitle'),
                            shortHelp: UINLS.get('setDefaultValueToUndefinedShortHelp')
                        }),
                        onClick: () => {
                            this.value = 'eUndefinedAction';
                            this.value = '';
                        }
                    }).inject(this._getContainer(this.undefinedButtonDefinition.index));
                }
                if (this.undefinedButtonDefinition.disabled !== undefined) {
                    this.elements.undefinedButton.disabled = this.undefinedButtonDefinition.disabled;
                }
            }
            else if (this.elements.undefinedButton) {
                UIObjectEditorAction._removeButton(this.elements.undefinedButton);
                this.elements.undefinedButton = undefined;
            }
        }
        _applyEmptyArrayButtonDefinition(_oldValue, _newValue) {
            if (this.emptyArrayButtonDefinition && this.emptyArrayButtonDefinition.display) {
                if (this.elements.emptyArrayButton === undefined) {
                    this.elements.emptyArrayButton = new WUXButton({
                        emphasize: 'secondary',
                        displayStyle: 'smartIcon',
                        label: '[ ]',
                        allowUnsafeHTMLLabel: false,
                        tooltipInfos: UIObjectEditorAction._createTooltip({
                            title: UINLS.get('setDefaultValueToEmptyArrayTitle'),
                            shortHelp: UINLS.get('setDefaultValueToEmptyArrayShortHelp')
                        }),
                        onClick: () => {
                            this.value = 'eEmptyArrayAction';
                            this.value = '';
                        }
                    }).inject(this.elements.middleContainer);
                    UIDom.addClassName(this.elements.emptyArrayButton.getContent(), 'sch-controls-button-emptyarray');
                }
                if (this.emptyArrayButtonDefinition.disabled !== undefined) {
                    this.elements.emptyArrayButton.disabled = this.emptyArrayButtonDefinition.disabled;
                }
            }
            else if (this.elements.emptyArrayButton) {
                UIObjectEditorAction._removeButton(this.elements.emptyArrayButton);
                this.elements.emptyArrayButton = undefined;
            }
        }
        _applyEmptyObjectButtonDefinition(_oldValue, _newValue) {
            if (this.emptyObjectButtonDefinition && this.emptyObjectButtonDefinition.display) {
                if (this.elements.emptyObjectButton === undefined) {
                    this.elements.emptyObjectButton = new WUXButton({
                        emphasize: 'secondary',
                        displayStyle: 'smartIcon',
                        label: '{ }',
                        allowUnsafeHTMLLabel: false,
                        tooltipInfos: UIObjectEditorAction._createTooltip({
                            title: UINLS.get('setDefaultValueToEmptyObjectTitle'),
                            shortHelp: UINLS.get('setDefaultValueToEmptyObjectShortHelp')
                        }),
                        onClick: () => {
                            this.value = 'eEmptyObjectAction';
                            this.value = '';
                        }
                    }).inject(this.elements.middleContainer);
                    UIDom.addClassName(this.elements.emptyObjectButton.getContent(), 'sch-controls-button-emptyobject');
                }
                if (this.emptyObjectButtonDefinition.disabled !== undefined) {
                    this.elements.emptyObjectButton.disabled = this.emptyObjectButtonDefinition.disabled;
                }
            }
            else if (this.elements.emptyObjectButton) {
                UIObjectEditorAction._removeButton(this.elements.emptyObjectButton);
                this.elements.emptyObjectButton = undefined;
            }
        }
        _applyResetButtonDefinition(_oldValue, _newValue) {
            if (this.resetButtonDefinition && this.resetButtonDefinition.display) {
                if (this.elements.resetButton === undefined) {
                    this.elements.resetButton = new WUXButton({
                        emphasize: 'secondary',
                        displayStyle: 'smartIcon',
                        icon: UIFontIcon.getWUX3DSIconDefinition('reset'),
                        allowUnsafeHTMLLabel: false,
                        tooltipInfos: UIObjectEditorAction._createTooltip({
                            title: UINLS.get('resetDefaultValueTitle'),
                            shortHelp: UINLS.get('resetDefaultValueShortHelp')
                        }),
                        onClick: () => {
                            this.value = 'eResetAction';
                            this.value = '';
                        }
                    }).inject(this._getContainer(this.resetButtonDefinition.index));
                    UIDom.addClassName(this.elements.resetButton.getContent(), 'sch-controls-button-reset');
                }
                if (this.resetButtonDefinition.disabled !== undefined) {
                    this.elements.resetButton.disabled = this.resetButtonDefinition.disabled;
                }
            }
            else if (this.elements.resetButton) {
                UIObjectEditorAction._removeButton(this.elements.resetButton);
                this.elements.resetButton = undefined;
            }
        }
        /**
         * Builds the view of the control.
         * @protected
         */
        buildView() {
            UIDom.addClassName(this.elements.container, 'sch-controls-objecteditoraction');
            this.elements.leftContainer = UIDom.createElement('div', { className: 'sch-controls-objecteditoraction-button', parent: this.elements.container });
            this.elements.middleContainer = UIDom.createElement('div', { className: 'sch-controls-objecteditoraction-button', parent: this.elements.container });
            this.elements.rightContainer = UIDom.createElement('div', { className: 'sch-controls-objecteditoraction-button', parent: this.elements.container });
        }
        /**
         * Removes the provided button.
         * @private
         * @param {WUXButton} button - The button to remove.
         */
        static _removeButton(button) {
            const content = button.getContent();
            content.getParent().removeChild(content);
        }
        /**
         * Gets the container corresponding to the provided index.
         * @private
         * @param {number} index - The container index.
         * @returns {HTMLDivElement} The container corresponding to the provided index.
         */
        _getContainer(index) {
            return this.elements.container.children[index];
        }
        /**
         * Creates a tooltip model.
         * @private
         * @static
         * @param {ITooltipOptions} options - The tooltip options.
         * @returns {TooltipModel} The tooltip model.
         */
        static _createTooltip(options) {
            return UIWUXTools.createTooltip({
                title: options === null || options === void 0 ? void 0 : options.title,
                shortHelp: options === null || options === void 0 ? void 0 : options.shortHelp,
                initialDelay: typeof (options === null || options === void 0 ? void 0 : options.initialDelay) === 'number' ? options === null || options === void 0 ? void 0 : options.initialDelay : 200
            });
        }
    }
    WebUXComponents.addClass(UIObjectEditorAction, 'UIObjectEditorAction');
    return UIObjectEditorAction;
});
