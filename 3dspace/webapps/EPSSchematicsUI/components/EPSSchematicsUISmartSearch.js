/* global WUXIconDefinition, WUXManagedFontIcons */
/// <amd-module name='DS/EPSSchematicsUI/components/EPSSchematicsUISmartSearch'/>
define("DS/EPSSchematicsUI/components/EPSSchematicsUISmartSearch", ["require", "exports", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsUI/data/EPSSchematicsUIKeyboard", "DS/EPSSchematicsUI/libraries/EPSSchematicsUITemplateLibrary", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSEditorCore/QuickSearchScorer", "css!DS/EPSSchematicsUI/css/components/EPSSchematicsUISmartSearch"], function (require, exports, UIDom, UITools, UIFontIcon, UIKeyboard, UITemplateLibrary, BlockLibrary, UINLS, Scorer) {
    "use strict";
    /**
     * This class defines a UI smart search.
     * @private
     * @class UISmartSearch
     * @alias module:DS/EPSSchematicsUI/components/EPSSchematicsUISmartSearch
     */
    class UISmartSearch {
        /**
         * @public
         * @constructor
         * @param {UIGraph} graph - The graph on which the building block must be added.
         * @param {number} left - The left position of the smart combobox.
         * @param {number} top - The top position of the smart combobox.
         * @param {number} blockLeft - The left position of the block.
         * @param {number} blockTop - The top position of the block.
         */
        constructor(graph, left, top, blockLeft, blockTop) {
            this._mouseFrozen = false;
            this._isRemoved = false;
            this._graph = graph;
            this._left = left;
            this._top = top;
            this._blockLeft = blockLeft;
            this._blockTop = blockTop;
            this._viewerContent = this._graph.getViewer().getContainer();
            this._initialize();
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                             ____  _   _ ____  _     ___ ____                                   //
        //                            |  _ \| | | | __ )| |   |_ _/ ___|                                  //
        //                            | |_) | | | |  _ \| |    | | |                                      //
        //                            |  __/| |_| | |_) | |___ | | |___                                   //
        //                            |_|    \___/|____/|_____|___\____|                                  //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Removes the component.
         * @public
         */
        remove() {
            if (this._isRemoved === false) {
                this._isRemoved = true;
                clearTimeout(this._timeoutId);
                if (this?._container?.parentElement) {
                    this._container.parentElement.removeChild(this._container);
                }
            }
            this._graph = undefined;
            this._left = undefined;
            this._top = undefined;
            this._blockLeft = undefined;
            this._blockTop = undefined;
            this._viewerContent = undefined;
            this._container = undefined;
            this._inputContainer = undefined;
            this._searchInput = undefined;
            this._searchCount = undefined;
            this._searchList = undefined;
            this._currentLength = undefined;
            this._selectedIndex = undefined;
            this._preselectedIndex = undefined;
            this._timeoutId = undefined;
            this._mouseFrozen = undefined;
            this._isRemoved = undefined;
        }
        /**
         * Gets the smart search container.
         * @public
         * @returns {HTMLDivElement} The smart search container.
         */
        getContainer() {
            return this._container;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                           ____  ____  _____     ___  _____ _____                               //
        //                          |  _ \|  _ \|_ _\ \   / / \|_   _| ____|                              //
        //                          | |_) | |_) || | \ \ / / _ \ | | |  _|                                //
        //                          |  __/|  _ < | |  \ V / ___ \| | | |___                               //
        //                          |_|   |_| \_\___|  \_/_/   \_\_| |_____|                              //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Initializes the component.
         * @private
         */
        _initialize() {
            // Creates the model
            this._model = [];
            Array.prototype.push.apply(this._model, this._getTemplateLibraryModel(true));
            Array.prototype.push.apply(this._model, this._getTemplateLibraryModel(false));
            Array.prototype.push.apply(this._model, this._getBlockLibraryModel());
            // Creates the interface
            this._container = UIDom.createElement('div', { className: 'sch-components-smartsearch' });
            this._inputContainer = UIDom.createElement('div', { className: 'sch-components-smartsearch-input-container', parent: this._container });
            this._searchInput = UIDom.createElement('input', {
                className: 'sch-components-smartsearch-input', parent: this._inputContainer, attributes: {
                    type: 'text', spellcheck: false, placeholder: UINLS.get('smartSearchPlaceHolder')
                }
            });
            this._searchInput.ondblclick = e => e.stopPropagation();
            this._searchInput.oninput = this._onInput.bind(this);
            this._searchInput.onkeydown = this._onKeydown.bind(this);
            this._searchInput.onblur = () => {
                if (this._graph) {
                    this._graph.removeSmartSearch();
                }
            };
            this._viewerContent.appendChild(this._container);
            this._container.setAttribute('style', 'left:' + this._left + 'px; top:' + this._top + 'px;');
            this._searchCount = UIDom.createElement('span', { className: 'sch-components-smartsearch-count', parent: this._inputContainer });
            this._createList();
            this._searchInput.focus();
        }
        /**
         * Creates the list view of the comboBox, based on the filter given as parameter.
         * The list view is an absolute div appended on the body's page.
         * @private
         * @param {string} filter - The string used to filter the result list.
         */
        _createList(filter) {
            const elements = this._getElementList(filter);
            this._currentLength = elements.length;
            if (elements.length > 0) {
                elements.sort((a, b) => b.score - a.score);
                elements.forEach((element, index) => {
                    element.localId = index;
                    element.onclick = this._onClick.bind(this);
                    element.onmouseenter = this._onMouseenter.bind(this);
                    element.onmouseleave = this._onMouseleave.bind(this);
                    element.onmousemove = this._onMousemove.bind(this);
                    element.onmousedown = e => e.preventDefault(); // Prevent input focus lost!
                });
                this._searchList = UIDom.createElement('ul', { children: elements, className: 'sch-components-smartsearch-list' });
                this._searchList.onmousedown = e => e.preventDefault(); // Prevent input focus lost!
                this._selectListElement(0);
            }
            if (this._searchList) {
                this._container.appendChild(this._searchList);
            }
            const hasManyBlocks = this._currentLength > 1;
            const txtCount = this._currentLength + ' ' + UINLS.get('categoryBlock') + (hasManyBlocks ? 's' : '');
            this._searchCount.textContent = txtCount;
        }
        /**
         * Removes the search list.
         * @private
         */
        _removeList() {
            if (this._container && this._searchList) {
                this._container.removeChild(this._searchList);
                this._searchList = undefined;
            }
        }
        /**
         * Gets the elements of the list.
         * @private
         * @param {string} filter - The string used to filter the result list.
         * @returns {HTMLLIElement[]} The elements of the list.
         */
        _getElementList(filter) {
            const elements = [];
            const reg = Scorer.filterRegex(filter);
            this._model.forEach((block, globalId) => {
                const indexes = [];
                const ranges = [];
                const additionalInfos = block.categoryName + '/' + block.name;
                if (filter === undefined || additionalInfos.match(reg)) {
                    let score;
                    if (filter !== undefined) {
                        score = new Scorer(filter).score(additionalInfos, indexes);
                        indexes.forEach(index => ranges.push({ offset: index, length: 1 }));
                    }
                    const fileNameIndex = additionalInfos.lastIndexOf('/');
                    const isFont3DS = block.icon.fontIconFamily === WUXManagedFontIcons.Font3DS;
                    const divName = UIDom.createElement('div', { textContent: block.name });
                    const divAdditionalInfos = UIDom.createElement('div', { textContent: additionalInfos });
                    const spanIcon = isFont3DS ? UIFontIcon.create3DSFontIcon(block.icon.iconName) : UIFontIcon.createFAFontIcon(block.icon.iconName);
                    if (indexes[0] > fileNameIndex) {
                        ranges.forEach(range => { range.offset -= fileNameIndex + 1; });
                        Scorer.highlightRangesWithStyleClass(divName, ranges, 'highlighted');
                    }
                    else {
                        Scorer.highlightRangesWithStyleClass(divAdditionalInfos, ranges, 'highlighted');
                    }
                    const element = UIDom.createElement('li', {
                        className: 'sch-components-smartsearch-list-element',
                        children: [spanIcon, UIDom.createElement('div', {
                                className: 'inlineBlockElement',
                                children: [divName, divAdditionalInfos]
                            })]
                    });
                    element.score = score;
                    element.globalId = globalId;
                    elements.push(element);
                }
            });
            return elements;
        }
        /**
         * Gets the template library model.
         * @private
         * @param {boolean} isLocalTemplate - True for local template library, false for global template.
         * @returns {ISmartSearchModel[]} The local or global template library model.
         */
        _getTemplateLibraryModel(isLocalTemplate) {
            const model = [];
            const templateLibrary = isLocalTemplate ? this._graph.getLocalTemplateLibrary() : UITemplateLibrary;
            const templateUidList = templateLibrary.getGraphUidList().concat(templateLibrary.getScriptUidList());
            templateUidList.forEach(templateUid => {
                const templateName = templateLibrary.getNameByUid(templateUid);
                model.push({
                    name: templateName, uid: templateUid, score: 0, icon: UISmartSearch._getCategoryIcon(),
                    categoryName: isLocalTemplate ? UINLS.get('smartSearchLocalTemplateCategory') : UINLS.get('smartSearchGlobalTemplateCategory')
                });
            });
            return model;
        }
        /**
         * Gets the block library model.
         * @private
         * @returns {ISmartSearchModel[]} The block library model.
         */
        _getBlockLibraryModel() {
            const model = [];
            const hideDefaultGraph = this._graph.getViewer().getEditor().getOptions().hideDefaultGraph;
            const categories = BlockLibrary.searchCategoryByName(RegExp('.*')).sort();
            categories.forEach(categoryName => {
                const icon = UISmartSearch._getCategoryIcon(categoryName);
                const blocks = UITools.getSortedBlockByCategory(categoryName, hideDefaultGraph);
                blocks.forEach(block => {
                    const categoryDoc = BlockLibrary.getCategoryDocumentation(categoryName);
                    const fullCategoryName = categoryDoc !== undefined ? categoryDoc.getFullName() : '';
                    model.push({ name: block.getName(), uid: block.uid, categoryName: fullCategoryName, icon: icon, score: 0 });
                });
            });
            return model;
        }
        /**
         * Gets the category icon.
         * @private
         * @static
         * @param {string} [categoryName] - The name of the category;
         * @returns {WUXIconDefinition} The WUX category icon.
         */
        static _getCategoryIcon(categoryName) {
            const icon = { iconName: '3d-object', fontIconFamily: WUXManagedFontIcons.Font3DS };
            if (categoryName) {
                const categoryDoc = BlockLibrary.getCategoryDocumentation(categoryName);
                const catIcon = categoryDoc?.getIcon();
                if (catIcon) {
                    icon.iconName = catIcon.name;
                    icon.fontIconFamily = UIFontIcon.convertToWUXFontFamily(catIcon.fontFamily);
                }
            }
            return icon;
        }
        /**
         * Selects the list element at given index.
         * @private
         * @param {number} index - The index of the element in the list.
         * @returns {HTMLLIElement} The selected HTML element.
         */
        _selectListElement(index) {
            let element;
            if (typeof index === 'number' && index > -1) {
                this._unselectListElement(this._selectedIndex);
                element = this._searchList.childNodes[index];
                UIDom.addClassName(element, 'selected');
                this._selectedIndex = index;
            }
            return element;
        }
        /**
         * Unselects the list element at given index.
         * @private
         * @param {number} index - The index of the element in the list.
         */
        _unselectListElement(index) {
            if (typeof index === 'number' && index > -1) {
                UIDom.removeClassName(this._searchList.childNodes[index], 'selected');
            }
        }
        /**
         * Preselects the list element at given index.
         * @private
         * @param {number} index - The index of the element in the list.
         */
        _preselectListElement(index) {
            if (!this._mouseFrozen && typeof index === 'number' && index > -1) {
                const element = this._searchList.childNodes[index];
                UIDom.addClassName(element, 'preselected');
                this._preselectedIndex = index;
            }
        }
        /**
         * Unpreselects the list element at given index.
         * @private
         * @param {number} index - The index of the element in the list.
         */
        _unpreselectListElement(index) {
            if (typeof index === 'number' && index > -1) {
                UIDom.removeClassName(this._searchList.childNodes[index], 'preselected');
            }
        }
        /**
         * The callback on the input event.
         * @private
         */
        _onInput() {
            clearTimeout(this._timeoutId);
            this._timeoutId = setTimeout(() => {
                this._removeList();
                this._createList(this._searchInput.value);
            }, 100);
        }
        /**
         * The callback on the list click event.
         * @private
         * @param {MouseEvent} event - The mouse click event.
         */
        _onClick(event) {
            const element = event.target;
            if (element?.localId !== undefined) {
                this._changeSelectedIndex(element.localId - this._selectedIndex);
                this._pick();
            }
        }
        /**
         * The callback on the list element mouse enter event.
         * @private
         * @param {MouseEvent} event - The mouse enter event.
         */
        _onMouseenter(event) {
            const element = event.target;
            if (element) {
                this._preselectListElement(element.localId);
            }
        }
        /**
         * The callback on the list element mouse leave event.
         * @private
         * @param {MouseEvent} event - The mouse leave event.
         */
        _onMouseleave(event) {
            const element = event.target;
            if (element) {
                this._unpreselectListElement(element.localId);
            }
        }
        /**
         * The callback on the list element mouse move event.
         * @private
         * @param {MouseEvent} event - The mouse move event.
         */
        _onMousemove(event) {
            this._mouseFrozen = false;
            const element = event.target;
            if (element) {
                this._preselectListElement(element.localId);
            }
        }
        /**
         * The callback on the keydown event.
         * @private
         * @param {KeyboardEvent} event - The keydown event.
         */
        _onKeydown(event) {
            if (UIKeyboard.isKeyPressed(event, UIKeyboard.eEnter)) {
                this._pick();
            }
            else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eEscape)) {
                if (this._graph) {
                    this._graph.removeSmartSearch();
                }
            }
            else if (UIKeyboard.isKeyPressed(event, UIKeyboard.ePageUp)) {
                if (this._searchList !== undefined) {
                    this._changeSelectedIndex(-1 * this._screenAmount() + 1);
                }
            }
            else if (UIKeyboard.isKeyPressed(event, UIKeyboard.ePageDown)) {
                if (this._searchList !== undefined) {
                    this._changeSelectedIndex(this._screenAmount() - 1);
                }
            }
            else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eEnd)) {
                if (this._searchList !== undefined) {
                    this._changeSelectedIndex(this._currentLength - this._selectedIndex - 1);
                }
            }
            else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eHome)) {
                if (this._searchList !== undefined) {
                    this._changeSelectedIndex(-this._selectedIndex);
                }
            }
            else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eArrowUp)) {
                if (this._searchList !== undefined) {
                    this._changeSelectedIndex(-1);
                }
                else {
                    this._createList(this._searchInput.value);
                    this._changeSelectedIndex(this._currentLength - this._selectedIndex - 1);
                }
            }
            else if (UIKeyboard.isKeyPressed(event, UIKeyboard.eArrowDown)) {
                if (this._searchList !== undefined) {
                    this._changeSelectedIndex(1);
                }
                else {
                    this._createList(this._searchInput.value);
                    this._changeSelectedIndex(-this._selectedIndex);
                }
            }
            event.stopPropagation();
        }
        /**
         * Helper to retrieve the list height on screen.
         * @private
         * @returns {number} The list height.
         */
        _screenAmount() {
            return Math.floor(this._searchList.clientHeight / this._searchList.firstChild.offsetHeight) || 1;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                      ___  ____ _____                                           //
        //                                     / _ \|  _ \_   _|                                          //
        //                                    | | | | | | || |                                            //
        //                                    | |_| | |_| || |                                            //
        //                                     \___/|____/ |_|                                            //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Picks the active item on the list and removes the control.
         * @private
         * @ignore
         */
        _pick() {
            if (this._searchList) {
                const index = this._searchList.childNodes[this._selectedIndex].globalId;
                const block = this._model[index];
                const blockUI = this._graph.createBlock(block.uid, this._blockLeft, this._blockTop);
                blockUI.automaticExpandDataPorts();
                if (this._graph) {
                    this._graph.removeSmartSearch();
                }
            }
        }
        /**
         * Changes the selected element on the list.
         * @private
         * @ignore
         * @param {number} index - The index of the current selected element.
         */
        _changeSelectedIndex(index) {
            if (this._searchList !== undefined) {
                index += this._selectedIndex;
                index = index >= this._currentLength ? 0 : (index < 0 ? this._currentLength - 1 : index);
                if (this._selectedIndex !== index) {
                    this._unpreselectListElement(this._preselectedIndex);
                    this._mouseFrozen = true;
                    const node = this._selectListElement(index);
                    if (node.offsetTop < this._searchList.scrollTop) {
                        this._searchList.scrollTop = node.offsetTop - node.clientHeight;
                    }
                    else if (node.offsetTop + node.offsetHeight > this._searchList.scrollTop + this._searchList.clientHeight) {
                        this._searchList.scrollTop = node.offsetTop + node.offsetHeight - this._searchList.clientHeight + node.clientHeight;
                    }
                }
            }
        }
        /**
         * Gets the smart search model.
         * @private
         * @ignore
         * @returns {ISmartSearchModel[]} The smart search model.
         */
        _getModel() {
            return this._model;
        }
        /**
         * Gets the search input element.
         * @private
         * @ignore
         * @returns {HTMLInputElement} The search input element.
         */
        _getSearchInput() {
            return this._searchInput;
        }
        /**
         * Gets the search list element.
         * @private
         * @ignore
         * @returns {HTMLUListElement} The search list element.
         */
        _getSearchList() {
            return this._searchList;
        }
        /**
         * Gets the selected index.
         * @private
         * @ignore
         * @returns {number} The selected index.
         */
        _getSelectedIndex() {
            return this._selectedIndex;
        }
    }
    return UISmartSearch;
});
