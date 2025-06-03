/// <amd-module name='DS/EPSSchematicsUI/controls/EPSSchematicsUIDGVActionBar'/>
define("DS/EPSSchematicsUI/controls/EPSSchematicsUIDGVActionBar", ["require", "exports", "DS/Controls/Abstract", "DS/Core/WebUXComponents", "DS/Controls/Button", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIWUXTools", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "css!DS/EPSSchematicsUI/css/controls/EPSSchematicsUIDGVActionBar"], function (require, exports, WUXAbstract, WebUXComponents, WUXButton, UIDom, UIWUXTools, UINLS) {
    "use strict";
    /**
     * This class defines the UI data grid view action bar WUX control.
     * @private
     * @class UIDGVActionBar
     * @alias DS/EPSSchematicsUI/controls/EPSSchematicsUIDGVActionBar
     * @extends WUXAbstract
     */
    class UIDGVActionBar extends WUXAbstract {
        /**
         * @public
         * @constructor
         */
        constructor(...args) {
            super(...args);
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
                count: {
                    defaultValue: undefined,
                    type: 'number',
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
                resetButtonDefinition: {
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
        buildView() {
            super.buildView();
            UIDom.addClassName(this.elements.container, 'sch-controls-dgvactionbar');
        }
        _applyProperties(oldValues) {
            super._applyProperties(oldValues);
            if (this.isDirty('count')) {
                this._clearContainer();
                this._fillContainer();
            }
            if (this.isDirty('addButtonDefinition')) {
                if (this.addButtonDefinition !== undefined) {
                    this._applyButtonDefinition(this.addButtonDefinition, {
                        name: 'addButton',
                        icon: {
                            iconName: 'plus',
                            fontIconFamily: WUXManagedFontIcons.FontAwesome
                        },
                        actionName: 'eAddAction',
                        tooltipOptions: this.addButtonDefinition?.tooltipOptions
                    });
                }
                else {
                    UIDGVActionBar._removeButton(this.elements.addButton);
                }
            }
            if (this.isDirty('removeButtonDefinition')) {
                if (this.removeButtonDefinition !== undefined) {
                    this._applyButtonDefinition(this.removeButtonDefinition, {
                        name: 'removeButton',
                        icon: {
                            iconName: 'trash',
                            fontIconFamily: WUXManagedFontIcons.Font3DS
                        },
                        actionName: 'eRemoveAction',
                        tooltipOptions: this.removeButtonDefinition?.tooltipOptions
                    });
                }
                else {
                    UIDGVActionBar._removeButton(this.elements.removeButton);
                }
            }
            if (this.isDirty('resetButtonDefinition')) {
                if (this.resetButtonDefinition !== undefined) {
                    this._applyButtonDefinition(this.resetButtonDefinition, {
                        name: 'resetButton',
                        icon: {
                            iconName: 'reset',
                            fontIconFamily: WUXManagedFontIcons.Font3DS
                        },
                        actionName: 'eResetAction',
                        tooltipOptions: UIDGVActionBar._createTooltip({
                            title: UINLS.get('resetDefaultValueTitle'),
                            shortHelp: UINLS.get('resetDefaultValueShortHelp')
                        })
                    });
                }
                else {
                    UIDGVActionBar._removeButton(this.elements.resetButton);
                }
            }
            if (this.isDirty('undefinedButtonDefinition')) {
                if (this.undefinedButtonDefinition !== undefined) {
                    this._applyButtonDefinition(this.undefinedButtonDefinition, {
                        name: 'undefinedButton',
                        icon: {
                            iconName: 'math-null-sign',
                            fontIconFamily: WUXManagedFontIcons.Font3DS
                        },
                        actionName: 'eUndefinedAction',
                        tooltipOptions: UIDGVActionBar._createTooltip({
                            title: UINLS.get('setDefaultValueToUndefinedTitle'),
                            shortHelp: UINLS.get('setDefaultValueToUndefinedShortHelp')
                        })
                    });
                }
                else {
                    UIDGVActionBar._removeButton(this.elements.undefinedButton);
                }
            }
            if (this.isDirty('emptyArrayButtonDefinition')) {
                if (this.emptyArrayButtonDefinition !== undefined) {
                    this._applyButtonDefinition(this.emptyArrayButtonDefinition, {
                        name: 'emptyArrayButton',
                        label: '[ ]',
                        className: 'sch-controls-button-emptyarray',
                        actionName: 'eEmptyArrayAction',
                        tooltipOptions: UIDGVActionBar._createTooltip({
                            title: UINLS.get('setDefaultValueToEmptyArrayTitle'),
                            shortHelp: UINLS.get('setDefaultValueToEmptyArrayShortHelp')
                        })
                    });
                }
                else {
                    UIDGVActionBar._removeButton(this.elements.emptyArrayButton);
                }
            }
            if (this.isDirty('emptyObjectButtonDefinition')) {
                if (this.emptyObjectButtonDefinition !== undefined) {
                    this._applyButtonDefinition(this.emptyObjectButtonDefinition, {
                        name: 'emptyObjectButton',
                        label: '{ }',
                        className: 'sch-controls-button-emptyobject',
                        actionName: 'eEmptyObjectAction',
                        tooltipOptions: UIDGVActionBar._createTooltip({
                            title: UINLS.get('setDefaultValueToEmptyObjectTitle'),
                            shortHelp: UINLS.get('setDefaultValueToEmptyObjectShortHelp')
                        })
                    });
                }
                else {
                    UIDGVActionBar._removeButton(this.elements.emptyObjectButton);
                }
            }
        }
        _clearContainer() {
            if (this.elements.container) {
                while (this.elements.container.lastChild) {
                    this.elements.container.removeChild(this.elements.container.lastChild);
                }
            }
        }
        _fillContainer() {
            if (this.elements.container) {
                for (let i = 0; i < this.count; i++) {
                    UIDom.createElement('div', { className: 'sch-controls-dgvactionbar-button', parent: this.elements.container });
                }
            }
        }
        /**
         * Removes the provided button.
         * @private
         * @param {WUXButton} button - The button to remove.
         */
        static _removeButton(button) {
            if (button) {
                const content = button.getContent();
                const parent = content.getParent();
                if (parent) {
                    parent.removeChild(content);
                }
            }
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
        _applyButtonDefinition(buttonDefinition, buttonSpec) {
            if (buttonDefinition && buttonDefinition.display) {
                if (this.elements[buttonSpec.name] !== undefined) {
                    UIDGVActionBar._removeButton(this.elements[buttonSpec.name]);
                    this.elements[buttonSpec.name] = undefined;
                }
                const container = this._getContainer(buttonDefinition.index);
                if (container) {
                    this.elements[buttonSpec.name] = new WUXButton({
                        emphasize: 'secondary',
                        displayStyle: 'smartIcon',
                        icon: buttonSpec.icon,
                        label: buttonSpec.label,
                        allowUnsafeHTMLLabel: false,
                        tooltipInfos: buttonSpec.tooltipOptions,
                        onClick: () => {
                            this.value = buttonSpec.actionName;
                            this.value = '';
                        }
                    }).inject(container);
                    if (buttonSpec.className) {
                        UIDom.addClassName(this.elements[buttonSpec.name].getContent(), buttonSpec.className);
                    }
                    if (buttonDefinition.disabled !== undefined) {
                        this.elements[buttonSpec.name].disabled = buttonDefinition.disabled;
                    }
                }
                else {
                    console.log('_applyButtonDefinition:' + buttonSpec.name + ': container is undefined!!! this.count: ' + this.count + ' index: ' + buttonDefinition.index);
                }
            }
            else if (this.elements[buttonSpec.name]) {
                UIDGVActionBar._removeButton(this.elements[buttonSpec.name]);
                this.elements[buttonSpec.name] = undefined;
            }
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
                title: options?.title,
                shortHelp: options?.shortHelp,
                initialDelay: typeof options?.initialDelay === 'number' ? options?.initialDelay : 200
            });
        }
    }
    WebUXComponents.addClass(UIDGVActionBar, 'UIDGVActionBar');
    return UIDGVActionBar;
});
