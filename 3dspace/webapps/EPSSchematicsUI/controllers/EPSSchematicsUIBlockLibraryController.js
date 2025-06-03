/// <amd-module name='DS/EPSSchematicsUI/controllers/EPSSchematicsUIBlockLibraryController'/>
define("DS/EPSSchematicsUI/controllers/EPSSchematicsUIBlockLibraryController", ["require", "exports", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeDocument", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeNodeModel", "DS/EPSSchematicsUI/tools/EPSSchematicsUITools", "DS/EPSSchematicsUI/tools/EPSSchematicsUIFontIcon", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary"], function (require, exports, WUXTreeDocument, WUXTreeNodeModel, UITools, UIFontIcon, BlockLibrary) {
    "use strict";
    // TODO: Move tree document used in the tree list view of the block library here!
    // TODO: Try to merge the model from UISmartSearch on this tree document? (adapted to QuickSearchScorer?)
    /**
     * This class defines a UI block library controller.
     * @class UIBlockLibraryController
     * @alias module:DS/EPSSchematicsUI/controllers/EPSSchematicsUIBlockLibraryController
     * @private
     */
    class UIBlockLibraryController {
        //private _onBlockLibraryRegisterCategoryEventCB: Function = this._onBlockLibraryRegisterCategoryEvent.bind(this);
        /**
         * @constructor
         * @param {UIEditor} editor - The editor.
         */
        constructor(editor) {
            this._treeDocument = new WUXTreeDocument({ useAsyncPreExpand: true });
            this._isInitialized = false;
            this._favoriteIconCB = { module: 'DS/EPSSchematicsUI/controllers/EPSSchematicsUIBlockLibraryController', func: '_switchFavorite' };
            this._editor = editor;
            this._favoriteIconCB.argument = { editor: editor };
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
         * Remove the controller.
         * @public
         */
        remove() {
            //BlockLibrary.removeListener(Events.BlockLibraryRegisterCategoryEvent, this._onBlockLibraryRegisterCategoryEventCB);
            if (this._treeDocument) {
                this._treeDocument.empty();
            }
            this._editor = undefined;
            this._treeDocument = undefined;
            this._isInitialized = undefined;
            //this._onBlockLibraryRegisterCategoryEventCB = undefined;
        }
        /**
         * Gets the tree document.
         * @public
         * @returns {TreeDocument} The tree document.
         */
        getTreeDocument() {
            return this._treeDocument;
        }
        /**
         * Initializes the controller.
         * To be called once the documentation is loaded.
         * @public
         */
        initializeController() {
            if (!this._isInitialized) {
                const fullCategoryNames = BlockLibrary.searchCategoryByName(RegExp('.*')).sort();
                fullCategoryNames.forEach(fullCategoryName => {
                    if (fullCategoryName && fullCategoryName !== '') { // Create categories (even if no blocks inside it ie: Core)
                        this._createCategoriesModel(fullCategoryName);
                    }
                    this._createBlocksModel(fullCategoryName);
                });
                //BlockLibrary.addListener(Events.BlockLibraryRegisterCategoryEvent, this._onBlockLibraryRegisterCategoryEventCB);
                //BlockLibrary.addListener(Events.BlockLibraryRegisterBlockEvent, this.onBlockLibraryRegisterCB);
                this._loadFavorites();
                this._isInitialized = true;
            }
        }
        /**
         * Matches the search result for blocks or categories.
         * @public
         * @param {Block[]} blocks - The list of blocks to match.
         * @param {boolean} highlightBlock - True to highlight block name else false.
         * @param {boolean} highlightCategory - True to highlight category name else false.
         */
        match(blocks, highlightBlock, highlightCategory) {
            this._treeDocument.prepareUpdate();
            this._treeDocument.collapseAll();
            this._treeDocument.search({
                match: nodeInfos => {
                    const node = nodeInfos.nodeModel;
                    const label = node.getLabel();
                    const blockFound = blocks.find(block => block.getName() === label);
                    if (blockFound) {
                        if (highlightBlock) {
                            node.matchSearch();
                        }
                        if (node.isRoot()) {
                            node.collapse();
                        }
                        else {
                            node.reverseExpand();
                            let parentNode = node;
                            do {
                                if (highlightCategory && parentNode.hasChildren()) {
                                    parentNode.matchSearch();
                                }
                                parentNode = parentNode.getParent();
                                parentNode.show();
                            } while (!parentNode.isRoot());
                            if (highlightCategory) {
                                parentNode.matchSearch();
                            }
                        }
                        node.show();
                    }
                    else {
                        node.unmatchSearch();
                        node.hide();
                    }
                }
            });
            this._treeDocument.pushUpdate();
        }
        /**
         * Unmatches the search result for blocks.
         * @public
         */
        unmatch() {
            this._treeDocument.prepareUpdate();
            this._treeDocument.collapseAll();
            this._treeDocument.search({
                match: nodeInfos => {
                    const node = nodeInfos.nodeModel;
                    node.unmatchSearch();
                    node.show();
                }
            });
            this._treeDocument.pushUpdate();
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                      ____  ____   ___ _____ _____ ____ _____ _____ ____                        //
        //                     |  _ \|  _ \ / _ \_   _| ____/ ___|_   _| ____|  _ \                       //
        //                     | |_) | |_) | | | || | |  _|| |     | | |  _| | | | |                      //
        //                     |  __/|  _ <| |_| || | | |__| |___  | | | |___| |_| |                      //
        //                     |_|   |_| \_\\___/ |_| |_____\____| |_| |_____|____/                       //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Switches favorite state on the selected block.
         * @protected
         * @static
         * @param {IFunctionIconArguments} args - The function icon arguments.
         */
        static _switchFavorite(args) {
            const nodeModel = args.context.nodeModel;
            if (nodeModel) {
                const blockUid = nodeModel.getAttributeValue('value');
                const isFavorite = nodeModel.getAttributeValue('isFavorite');
                const newFavoriteState = !isFavorite;
                nodeModel.setAttribute('isFavorite', newFavoriteState);
                const editor = args.editor;
                const localStorageController = editor.getLocalStorageController();
                const favorites = localStorageController.getBlockLibraryFavorites();
                const index = favorites.indexOf(blockUid);
                let updateLocalStorage = false;
                if (newFavoriteState && index === -1) {
                    favorites.push(blockUid);
                    updateLocalStorage = true;
                }
                else if (!newFavoriteState && index !== -1) {
                    favorites.splice(index, 1);
                    updateLocalStorage = true;
                }
                if (updateLocalStorage) {
                    localStorageController.setBlockLibraryFavorites(favorites);
                }
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //                           ____  ____  _____     ___  _____ _____                               //
        //                          |  _ \|  _ \|_ _\ \   / / \|_   _| ____|                              //
        //                          | |_) | |_) || | \ \ / / _ \ | | |  _|                                //
        //                          |  __/|  _ < | |  \ V / ___ \| | | |___                               //
        //                          |_|   |_| \_\___|  \_/_/   \_\_| |_____|                              //
        //                                                                                                //
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // TODO: Hide the category by default and make it visible when a block is added!!!
        // TODO: Check if an options exist in the WUX model to show/hide tree when no child!!!
        /**
         * Creates the categories model.
         * @private
         * @param {string} fullCategoryName - The full category name.
         */
        _createCategoriesModel(fullCategoryName) {
            const categoryNames = fullCategoryName.split('/');
            let parentNodeModel = this._treeDocument;
            let currentCategoryPath = '';
            categoryNames.forEach(categoryName => {
                currentCategoryPath += currentCategoryPath !== '' ? '/' + categoryName : categoryName;
                let categoryNodeModel = UIBlockLibraryController._getCategoryNodeModelFromPath(categoryName, parentNodeModel);
                if (!categoryNodeModel) {
                    let displayName = categoryName;
                    const categoryDoc = BlockLibrary.getCategoryDocumentation(currentCategoryPath);
                    if (categoryDoc) {
                        const name = categoryDoc.getName();
                        displayName = name && name !== '' ? name : displayName;
                    }
                    categoryNodeModel = new WUXTreeNodeModel({
                        label: displayName,
                        icons: [UIFontIcon.getWUXIconFromBlockCategory(currentCategoryPath)],
                        grid: { isBlock: false, value: currentCategoryPath }
                    });
                    parentNodeModel.addChild(categoryNodeModel);
                }
                parentNodeModel = categoryNodeModel;
            });
        }
        /**
         * Creates the blocks model.
         * @private
         * @param {string} fullCategoryName - The full category name.
         */
        _createBlocksModel(fullCategoryName) {
            const parentNodeModel = UIBlockLibraryController._getCategoryNodeModelFromPath(fullCategoryName, this._treeDocument);
            if (parentNodeModel) {
                const hideDefaultGraph = this._editor.getOptions().hideDefaultGraph;
                const blocks = UITools.getSortedBlockByCategory(fullCategoryName, hideDefaultGraph);
                blocks.forEach(block => {
                    parentNodeModel.addChild(new WUXTreeNodeModel({
                        label: block.getName(),
                        icons: [{ iconName: '3d-object' }],
                        grid: {
                            isBlock: true,
                            value: block.getUid(),
                            favoriteIcon: this._favoriteIconCB,
                            isFavorite: false
                        }
                    }));
                });
            }
        }
        /**
         * Gets the category node model from the given path.
         * @private
         * @static
         * @param {string} fullCategoryName - The full category name.
         * @param {WUXTreeNodeModel|WUXTreeDocument} relativeNodeModel - The relative node model.
         * @returns {WUXTreeNodeModel|WUXTreeDocument} The category node model.
         */
        static _getCategoryNodeModelFromPath(fullCategoryName, relativeNodeModel) {
            let categoryNodeModel = relativeNodeModel;
            if (fullCategoryName && fullCategoryName !== '') {
                const getCategoryNodeModel = function (parent, path) {
                    return (parent.getChildren() || []).find(cn => cn.getAttributeValue('value') === path);
                };
                const categoryNames = fullCategoryName.split('/');
                let currentCategoryPath = '';
                while (categoryNames.length > 0 && categoryNodeModel) {
                    const categoryName = categoryNames.shift();
                    currentCategoryPath += currentCategoryPath !== '' ? '/' + categoryName : categoryName;
                    categoryNodeModel = getCategoryNodeModel(categoryNodeModel, currentCategoryPath);
                }
            }
            return categoryNodeModel;
        }
        /**
         * Loads the favorites blocks from the local storage to the treeDocument.
         * @private
         */
        _loadFavorites() {
            const localStorageController = this._editor.getLocalStorageController();
            const favorites = localStorageController.getBlockLibraryFavorites();
            this._setFavorites(favorites);
        }
        /**
         * Sets as favorites the provided list of block uids.
         * @private
         * @param {string[]} favorites - The list of block uids.
         */
        _setFavorites(favorites) {
            if (favorites.length > 0) {
                const childNodes = this._treeDocument.getAllDescendants() || [];
                if (childNodes.length > 0) {
                    favorites.forEach(blockUid => {
                        const childNode = childNodes.find(node => node.getAttributeValue('value') === blockUid);
                        if (childNode) {
                            childNode.setAttribute('isFavorite', true);
                        }
                    });
                }
            }
        }
    }
    return UIBlockLibraryController;
});
