/* global IWUXControlAbstract */
/// <amd-module name='DS/EPSSchematicsUI/controls/EPSSchematicsUIValueTypeCombo'/>
define("DS/EPSSchematicsUI/controls/EPSSchematicsUIValueTypeCombo", ["require", "exports", "DS/Controls/Abstract", "DS/Utilities/Dom", "DS/Core/WebUXComponents", "DS/Controls/Button", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/data/EPSSchematicsUIKeyboard", "DS/EPSSchematicsUI/tools/EPSSchematicsUIEvents", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSEditorCore/QuickSearchScorer", "css!DS/EPSSchematicsUI/css/controls/EPSSchematicsUIValueTypeCombo"], function (require, exports, WUXAbstract, WUXDomUtils, WebUXComponents, WUXButton, UIDom, UIFontIcon, UIKeyboard, UIEvents, UINLS, QuickSearchScorer) {
    "use strict";
    /**
     * This class defines the UI value type combobox WUX control.
     * @class UIValueTypeCombo
     * @alias DS/EPSSchematicsUI/controls/EPSSchematicsUIValueTypeCombo
     * @extends WUXAbstract
     * @private
     */
    class UIValueTypeCombo extends WUXAbstract {
        constructor() {
            super(...arguments);
            this.onWindowMousedownCB = this.onWindowMousedown.bind(this);
            this.onMouseenterCB = this.onMouseenter.bind(this);
            this.onMouseleaveCB = this.onMouseleave.bind(this);
            this.onMousemoveCB = this.onMousemove.bind(this);
            this.currentLength = 0;
            this.mouseFrozen = false;
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
                possibleValues: {
                    defaultValue: [],
                    type: 'array',
                    category: 'Model'
                },
                editor: {
                    defaultValue: undefined,
                    type: 'object',
                    category: 'Behavior'
                },
                dataPort: {
                    defaultValue: undefined,
                    type: 'object',
                    category: 'Behavior'
                },
                showCreateUserTypeButton: {
                    defaultValue: false,
                    type: 'boolean',
                    category: 'Behavior'
                },
                showTypeLibraryButton: {
                    defaultValue: false,
                    type: 'boolean',
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
            this.removeList();
            return super.remove();
        }
        /**
         * Applies the value property.
         * @public
         * @param {string} _oldValue - The old value property.
         * @param {string} newValue - The new value property.
         */
        _applyValue(_oldValue, newValue) {
            this.elements.searchInput.value = newValue;
            if (!this.preventTriggeringChangeEvent) {
                this.fire('change');
            }
        }
        /**
         * Applies the show type library button property.
         * @public
         * @param {boolean} _oldValue - The old value property.
         * @param {boolean} _newValue - The new value property.
         */
        _applyShowTypeLibraryButton(_oldValue, _newValue) {
            if (this.showTypeLibraryButton) {
                this.elements.typeLibraryButton = UIDom.createElement('button', {
                    className: ['sch-controls-valuetypecombo-button', 'sch-controls-valuetypecombo-button-typelibrary'],
                    parent: this.elements.container,
                    insertBefore: this.elements.button,
                    tooltipInfos: {
                        title: UINLS.get('openTypeLibraryTitle'),
                        shortHelp: UINLS.get('openTypeLibraryShortHelp'),
                        initialDelay: 500
                    },
                    children: [UIFontIcon.create3DSFontIcon('text')],
                    attributes: { type: 'button' },
                    onclick: (event) => {
                        const typeLibraryPanel = this.editor.getTypeLibraryPanel();
                        typeLibraryPanel.selectType(this.value);
                        const closeEvent = new UIEvents.UIDialogCloseEvent(); // Send a dialog close event
                        this.editor.dispatchEvent(closeEvent);
                        event.stopPropagation();
                    }
                });
            }
            else if (this.elements.typeLibraryButton) {
                this.elements.container.removeChild(this.elements.typeLibraryButton);
                this.elements.typeLibraryButton = undefined;
            }
        }
        /**
         * Builds the view of the control.
         * @protected
         */
        buildView() {
            this.preventTriggeringChangeEvent = true; // Prevent fire change event during the control build
            UIDom.addClassName(this.elements.container, 'sch-controls-valuetypecombo');
            this.elements.searchInput = UIDom.createElement('input', {
                className: 'sch-controls-valuetypecombo-input',
                parent: this.elements.container,
                attributes: { type: 'text', spellcheck: false }
            });
            this.elements.button = UIDom.createElement('button', {
                className: ['sch-controls-valuetypecombo-button', 'sch-controls-valuetypecombo-button-expand'],
                parent: this.elements.container,
                children: [UIFontIcon.create3DSFontIcon('expand-down')]
            });
            this.elements.searchInput.value = this.value;
        }
        /**
         * The callback on the control post build view.
         * @public
         */
        _postBuildView() {
            this.preventTriggeringChangeEvent = false; // Restore the change event dispatching
        }
        /**
         * Handles the control events.
         * @public
         */
        handleEvents() {
            WUXDomUtils.addEventOnElement(this, this.elements.button, 'click', () => {
                if (this.elements.searchList !== undefined) {
                    this.removeList();
                }
                else {
                    this.createList(this.value);
                }
                this.elements.searchInput.focus();
                this.elements.searchInput.select();
            });
            WUXDomUtils.addEventOnElement(this, this.elements.searchInput, 'blur', () => {
                window.getSelection().removeAllRanges();
            });
            WUXDomUtils.addEventOnElement(this, this.elements.searchInput, 'keydown', ((event) => {
                if (UIKeyboard.isKeyPressed(event, UIKeyboard.eArrowUp)) {
                    if (this.elements.searchList !== undefined) {
                        this.changeSelectedIndex(-1);
                    }
                    else {
                        this.createList(this.value);
                        this.changeSelectedIndex(this.currentLength - this.selectedIndex - 1);
                    }
                }
                else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eArrowDown)) {
                    if (this.elements.searchList !== undefined) {
                        this.changeSelectedIndex(1);
                    }
                    else {
                        this.createList(this.value);
                        this.changeSelectedIndex(-this.selectedIndex);
                    }
                }
                else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eHome)) {
                    if (this.elements.searchList !== undefined) {
                        this.changeSelectedIndex(-this.selectedIndex);
                    }
                }
                else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eEnd)) {
                    if (this.elements.searchList !== undefined) {
                        this.changeSelectedIndex(this.currentLength - this.selectedIndex - 1);
                    }
                }
                else if (UIKeyboard.isKeyPressed(event, UIKeyboard.ePageUp)) {
                    if (this.elements.searchList !== undefined) {
                        this.changeSelectedIndex(-1 * this.screenAmount() + 1);
                    }
                }
                else if (UIKeyboard.isKeyPressed(event, UIKeyboard.ePageDown)) {
                    if (this.elements.searchList !== undefined) {
                        this.changeSelectedIndex(this.screenAmount() - 1);
                    }
                }
                else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eEscape)) {
                    this.removeList();
                }
                else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eEnter)) {
                    this.callMethodFromUIInteraction('pick');
                }
                event.stopPropagation();
            }));
            WUXDomUtils.addEventOnElement(this, this.elements.searchInput, 'input', () => {
                clearTimeout(this.timeoutId);
                this.timeoutId = setTimeout(() => {
                    this.removeList();
                    this.createList(this.elements.searchInput.value);
                }, 100);
            });
        }
        /**
         * Creates the search list view of the comboBox, based on the filter given as parameter.
         * The list view is an absolute div appended on the body's page.
         * @private
         * @param {string} filter - The string used to filter the result list.
         */
        createList(filter) {
            const elements = this.getElementList(filter);
            this.currentLength = elements.length;
            if (elements.length > 0) {
                elements.sort((a, b) => b.score - a.score);
                elements.forEach((element, index) => {
                    element.localId = index;
                    WUXDomUtils.addEventOnElement(this, element, 'click', event => {
                        const elt = event.target;
                        if (elt !== undefined && elt.localId !== undefined) {
                            this.changeSelectedIndex(elt.localId - this.selectedIndex);
                            this.callMethodFromUIInteraction('pick');
                        }
                    });
                    element.onmouseenter = this.onMouseenterCB;
                    element.onmouseleave = this.onMouseleaveCB;
                    element.onmousemove = this.onMousemoveCB;
                    element.onmousedown = (event) => event.preventDefault(); // Prevent input focus lost!
                });
                this.elements.searchListContainer = UIDom.createElement('div', { className: 'sch-controls-valuetypecombo-list-container' });
                this.elements.searchList = UIDom.createElement('ul', {
                    children: elements,
                    className: 'sch-controls-valuetypecombo-list',
                    parent: this.elements.searchListContainer
                });
                if (this.showCreateUserTypeButton) {
                    this.elements.createTypeContainer = UIDom.createElement('div', {
                        className: 'sch-controls-valuetypecombo-createtype-container',
                        parent: this.elements.searchListContainer
                    });
                    this.elements.createTypeButton = new WUXButton({
                        label: UINLS.get('shortHelpHistoryCreateCustomType'),
                        emphasize: 'primary',
                        icon: UIFontIcon.getWUXFAIconDefinition('plus'),
                        onClick: () => {
                            this.removeList();
                            const typeLibraryPanel = this.editor.getTypeLibraryPanel();
                            const event = new UIEvents.UIDialogCloseEvent(); // Send a dialog close event
                            this.editor.dispatchEvent(event);
                            typeLibraryPanel.open();
                            typeLibraryPanel.openCreateTypeDialog(this.dataPort);
                        }
                    }).inject(this.elements.createTypeContainer);
                }
                //this.elements.onmousedown = (event: MouseEvent) => event.preventDefault(); // Prevent input focus lost!
                this.selectListElement(0);
                window.addEventListener('mousedown', this.onWindowMousedownCB, true);
                const bbox = this.elements.container.getBoundingClientRect();
                this.elements.searchListContainer.style.left = bbox.left + 'px';
                this.elements.searchListContainer.style.top = bbox.top + bbox.height + 'px';
                this.elements.searchListContainer.style.width = bbox.width + 'px';
                document.body.appendChild(this.elements.searchListContainer);
            }
        }
        /**
         * Removes the search list.
         * @private
         */
        removeList() {
            if (this.elements.searchListContainer !== undefined) {
                window.removeEventListener('mousedown', this.onWindowMousedownCB, true);
                document.body.removeChild(this.elements.searchListContainer);
                this.elements.searchListContainer = undefined;
                this.elements.searchList = undefined;
            }
        }
        /**
         * Picks the active item on the list and removes the list.
         * @private
         */
        pick() {
            if (this.elements.searchList !== undefined) {
                const childNode = this.elements.searchList.childNodes[this.selectedIndex];
                const index = childNode.globalId;
                const value = this.possibleValues[index];
                this.elements.searchInput.focus();
                this.removeList();
                this.value = value;
                this.elements.searchInput.value = this.value;
            }
        }
        /**
         * The callback on the window mouse down event.
         * Ignores interaction with comboBox (input and button).
         * Check if an element is clicked or if search list must be closed.
         * @private
         * @param {MouseEvent} event - The window mouse down event.
         */
        onWindowMousedown(event) {
            clearTimeout(this.timeoutId);
            const element = event.target;
            if (element !== this.elements.searchInput &&
                element !== this.elements.button &&
                element !== this.elements.searchList &&
                element.parentNode !== this.elements.searchList &&
                element !== (this.elements.createTypeButton ? this.elements.createTypeButton.getContent() : undefined)) {
                if (this.elements.searchList !== undefined && this.elements.searchInput !== undefined) {
                    const childNode = this.elements.searchList.childNodes[this.selectedIndex];
                    const index = childNode.globalId;
                    this.value = this.elements.searchInput.value === this.possibleValues[index].toLowerCase() ? this.possibleValues[index] : this.value;
                    this.elements.searchInput.value = this.value;
                }
                this.removeList();
            }
        }
        /**
         * Gets the elements of the list.
         * @private
         * @param {string} filter - The string used to filter the result list.
         * @returns {IValueTypeElement[]} The elements of the list.
         */
        getElementList(filter) {
            const reg = QuickSearchScorer.filterRegex(filter);
            const elements = [];
            const nonMatchingElements = [];
            let createSeparator = true;
            this.possibleValues.forEach((value, valueIndex) => {
                const divName = UIDom.createElement('div', { textContent: value });
                const listElement = UIDom.createElement('li', {
                    className: 'sch-controls-valuetypecombo-list-element',
                    children: [divName]
                });
                listElement.globalId = valueIndex;
                const indexes = [];
                const ranges = [];
                let score = 0;
                if (filter === undefined || value.match(reg)) {
                    if (filter !== undefined) {
                        score = new QuickSearchScorer(filter).score(value, indexes);
                        indexes.forEach(index => ranges.push({ offset: index, length: 1 }));
                    }
                    QuickSearchScorer.highlightRangesWithStyleClass(divName, ranges, 'highlighted');
                    listElement.score = score;
                    elements.push(listElement);
                }
                else {
                    UIDom.addClassName(listElement, 'nonmatching');
                    if (createSeparator) {
                        UIDom.addClassName(listElement, 'separator');
                        createSeparator = false;
                    }
                    listElement.score = score;
                    nonMatchingElements.push(listElement);
                }
            });
            Array.prototype.push.apply(elements, nonMatchingElements); // Faster than array concat because modify the existing array!
            return elements;
        }
        /**
         * The callback on the list element mouse enter event.
         * @private
         * @param {MouseEvent} event - The mouse enter event.
         */
        onMouseenter(event) {
            const element = event.target;
            if (element !== undefined) {
                this.preselectListElement(element.localId);
            }
        }
        /**
         * The callback on the list element mouse leave event.
         * @private
         * @param {MouseEvent} event - The mouse leave event.
         */
        onMouseleave(event) {
            const element = event.target;
            if (element !== undefined) {
                this.unpreselectListElement(element.localId);
            }
        }
        /**
         * The callback on the list element mouse move event.
         * @private
         * @param {MouseEvent} event - The mouse move event.
         */
        onMousemove(event) {
            this.mouseFrozen = false;
            const element = event.target;
            if (element !== undefined) {
                this.preselectListElement(element.localId);
            }
        }
        /**
         * Selects the list element at given index.
         * @private
         * @param {number} index - The index of the element in the list.
         * @returns {IValueTypeElement} The selected HTML element.
         */
        selectListElement(index) {
            let element;
            if (typeof index === 'number' && index > -1) {
                this.unselectListElement(this.selectedIndex);
                element = this.elements.searchList.childNodes[index];
                UIDom.addClassName(element, 'selected');
                this.selectedIndex = index;
            }
            return element;
        }
        /**
         * Unselects the list element at given index.
         * @private
         * @param {number} index - The index of the element in the list.
         */
        unselectListElement(index) {
            if (typeof index === 'number' && index > -1) {
                UIDom.removeClassName(this.elements.searchList.childNodes[index], 'selected');
            }
        }
        /**
         * Preselects the list element at given index.
         * @private
         * @param {number} index - The index of the element in the list.
         */
        preselectListElement(index) {
            if (!this.mouseFrozen && typeof index === 'number' && index > -1) {
                const element = this.elements.searchList.childNodes[index];
                UIDom.addClassName(element, 'preselected');
                this.preselectedIndex = index;
            }
        }
        /**
         * Unpreselects the list element at given index.
         * @private
         * @param {number} index - The index of the element in the list.
         */
        unpreselectListElement(index) {
            if (typeof index === 'number' && index > -1) {
                UIDom.removeClassName(this.elements.searchList.childNodes[index], 'preselected');
            }
        }
        /**
         * Changes the selected element on the list.
         * @private
         * @param {number} index - The index of the current selected element.
         */
        changeSelectedIndex(index) {
            if (this.elements.searchList !== undefined) {
                index += this.selectedIndex;
                index = index >= this.currentLength ? 0 : (index < 0 ? this.currentLength - 1 : index);
                if (this.selectedIndex !== index) {
                    this.unpreselectListElement(this.preselectedIndex);
                    this.mouseFrozen = true;
                    const node = this.selectListElement(index);
                    if (node.offsetTop < this.elements.searchList.scrollTop) {
                        this.elements.searchList.scrollTop = node.offsetTop - node.clientHeight;
                    }
                    else if (node.offsetTop + node.offsetHeight > this.elements.searchList.scrollTop + this.elements.searchList.clientHeight) {
                        this.elements.searchList.scrollTop = node.offsetTop + node.offsetHeight - this.elements.searchList.clientHeight + node.clientHeight;
                    }
                }
            }
        }
        /**
         * Helper function to retrieve the list height on screen.
         * @private
         * @returns {number} The list height.
         */
        screenAmount() {
            return Math.floor(this.elements.searchList.clientHeight / this.elements.searchList.firstChild.offsetHeight) || 1;
        }
    }
    WebUXComponents.addClass(UIValueTypeCombo, 'UIValueTypeCombo');
    return UIValueTypeCombo;
});
