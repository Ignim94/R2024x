/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVIOTestAbstract'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVIOTestAbstract", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDataGridView", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVTools", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsModelWeb/EPSSchematicsTypeLibrary", "css!DS/EPSSchematicsUI/css/datagrids/EPSSchematicsUIDGVIOTestAbstract"], function (require, exports, UIDataGridView, UIDGVTools, ModelEnums, TypeLibrary) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines the an abstract UI data grid view IO test.
     * @class UIDGVIOTestAbstract
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVIOTestAbstract
     * @extends UIDataGridView
     * @private
     */
    class UIDGVIOTestAbstract extends UIDataGridView {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The UI editor.
         * @param {string} className - The specialized class name.
         */
        constructor(editor, className) {
            super({
                className: ['sch-datagridview-iotest', className],
                rowsHeader: false,
                showAlternateBackgroundFlag: false,
                showRowBorderFlag: true,
                cellSelection: 'none',
                rowSelection: 'single',
                showCellActivationFlag: false,
                cellActivationFeedback: 'none',
                placeholder: ''
            });
            this._typeCategory = ModelEnums.FTypeCategory.fObject | ModelEnums.FTypeCategory.fClass | ModelEnums.FTypeCategory.fEvent;
            this._editor = editor;
            this._graph = this._editor._getViewer().getMainGraph();
            this._graphContext = this._graph.getModel().getGraphContext();
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
         * Removes the data grid view.
         * @public
         */
        remove() {
            this._editor = undefined;
            this._graph = undefined;
            this._graphContext = undefined;
            this._dataPorts = undefined;
            super.remove();
        }
        /**
         * Applies the test values defines on the data grid view to the model.
         * @public
         */
        applyTestValues() {
            const treeDocument = this.getTreeDocument();
            treeDocument.getRoots().forEach(root => {
                const value = root.getAttributeValue('testValue');
                const dataPort = root.getAttributeValue('dataPort');
                dataPort.setTestValues([value]);
            });
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
         * Initializes the data grid view.
         * @protected
         */
        _initialize() {
            const treeDocument = this.getTreeDocument();
            treeDocument.onPreExpand(this._onPreExpand.bind(this));
            this._dataPorts.forEach(dataPort => {
                const valueTypeName = dataPort.getValueType();
                const canExpand = TypeLibrary.hasType(this._graphContext, valueTypeName, this._typeCategory) && dataPort.isTestValuesSettable();
                this._addTreeNodeModel({
                    label: dataPort.getName(),
                    grid: {
                        dataPort: dataPort,
                        type: valueTypeName,
                        testValue: dataPort.getTestValues()[0]
                    },
                    children: canExpand ? [] : undefined
                });
            });
        }
        /**
         * Defines the data grid view columns.
         * @protected
         * @override
         */
        _defineColumns() {
            this._columns.push({
                dataIndex: 'tree',
                text: 'Name',
                visibleFlag: true,
                getCellClassName: UIDGVIOTestAbstract._getDisabledClassName
            });
            this._defineTypeColumn();
            this._defineTestValueColumn();
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
         * The callback on the pre-expand event.
         * @private
         * @param {IWUXModelEvent} modelEvent - The pre-exapand model event.
         */
        _onPreExpand(modelEvent) {
            const nodeModel = modelEvent.target;
            const parentTestValue = nodeModel.getAttributeValue('testValue') || {};
            nodeModel.setAttribute('testValue', parentTestValue);
            nodeModel.getModelEvents().subscribe({ event: 'nodeModelUpdate' }, this._onNodeModelUpdate.bind(this));
            const valueTypeName = nodeModel.getAttributeValue('type');
            const valueType = TypeLibrary.getType(this._graphContext, valueTypeName);
            if (valueType !== undefined) {
                let children = [];
                Object.keys(valueType).forEach(propertyName => {
                    const pValueTypeName = valueType[propertyName].type;
                    const canExpand = TypeLibrary.hasType(this._graphContext, pValueTypeName, this._typeCategory);
                    children.push({
                        label: propertyName,
                        grid: {
                            type: pValueTypeName,
                            testValue: parentTestValue[propertyName]
                        },
                        children: canExpand ? [] : undefined
                    });
                });
                nodeModel.removeChildren();
                nodeModel.addChild(children);
                nodeModel.getChildren().forEach(child => {
                    child.getModelEvents().subscribe({ event: 'nodeModelUpdate' }, this._onNodeModelUpdate.bind(this));
                });
            }
            nodeModel.preExpandDone();
        }
        /**
         * Gets the cell disabled class name.
         * @private
         * @static
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @returns {string} - The disabled class name.
         */
        static _getDisabledClassName(cellInfos) {
            let cellClassName = '';
            if (cellInfos.nodeModel && cellInfos.nodeModel.isRoot()) {
                const dataPort = cellInfos.nodeModel.getAttributeValue('dataPort');
                cellClassName = !dataPort.isTestValuesSettable() ? 'sch-cell-disabled' : '';
            }
            return cellClassName;
        }
        /**
         * Defines the type column.
         * @private
         */
        _defineTypeColumn() {
            this._columns.push({
                dataIndex: 'type',
                text: 'Type',
                getCellClassName: UIDGVIOTestAbstract._getDisabledClassName
            });
        }
        /**
         * Defines the test value column.
         * @private
         */
        _defineTestValueColumn() {
            this._columns.push({
                dataIndex: 'testValue',
                text: 'Value',
                editableFlag: false,
                alignment: 'near',
                editionPolicy: 'EditionOnOver',
                getCellTypeRepresentation: cellInfos => {
                    let typeRepresentation = 'string';
                    if (cellInfos.nodeModel) {
                        const valueTypeName = cellInfos.nodeModel.getAttributeValue('type');
                        const customType = TypeLibrary.getType(this._graphContext, valueTypeName);
                        typeRepresentation = customType ? 'string' : valueTypeName;
                    }
                    return typeRepresentation;
                },
                getCellSemantics: cellInfos => UIDGVTools.getDataItemDefaultValueCellSemantics(this._editor, cellInfos, 'type', 'testValue'),
                getCellEditableState: cellInfos => {
                    let editableState = false;
                    if (cellInfos.nodeModel) {
                        const valueTypeName = cellInfos.nodeModel.getAttributeValue('type');
                        const customType = TypeLibrary.getType(this._graphContext, valueTypeName);
                        editableState = customType === undefined;
                    }
                    return editableState;
                },
                getCellClassName: cellInfos => {
                    let cellClassName = '';
                    if (cellInfos.nodeModel) {
                        const valueTypeName = cellInfos.nodeModel.getAttributeValue('type');
                        const customType = TypeLibrary.getType(this._graphContext, valueTypeName);
                        cellClassName = customType !== undefined ? 'sch-cell-disabled' : '';
                    }
                    return cellClassName;
                },
                //getCellValue
                setCellValue: (cellInfos, value) => {
                    const nodeModel = cellInfos.nodeModel;
                    nodeModel.setAttribute('testValue', value);
                }
            });
        }
        /**
         * The callback on the node model update.
         * @private
         * @param {IWUXModelEvent} event - The node model event.
         */
        // eslint-disable-next-line class-methods-use-this
        _onNodeModelUpdate(event) {
            const nodeModel = event.target;
            if (nodeModel && !nodeModel.isRoot()) {
                const testValue = nodeModel.getAttributeValue('testValue');
                const parentNodeModel = nodeModel.getParent();
                const parentTestValue = parentNodeModel.getAttributeValue('testValue');
                parentTestValue[nodeModel.getLabel()] = testValue;
                parentNodeModel.updateOptions({ grid: { testValue: parentTestValue } });
            }
        }
    }
    return UIDGVIOTestAbstract;
});
