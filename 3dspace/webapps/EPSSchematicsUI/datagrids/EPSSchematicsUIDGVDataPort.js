/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVDataPort'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVDataPort", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractDataItem", "DS/EPSSchematicsUI/tools/EPSSchematicsUINLSTools", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVTools", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeNodeModel", "css!DS/EPSSchematicsUI/css/datagrids/EPSSchematicsUIDGVDataPort"], function (require, exports, UIDGVAbstractDataItem, UINLSTools, UIDGVTools, UINLS, Events, ModelEnums, WUXTreeNodeModel) {
    "use strict";
    /**
     * This class defines the UI data grid view data port.
     * @private
     * @class UIDGVDataPort
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVDataPort
     * @extends UIDGVAbstractDataItem
     */
    class UIDGVDataPort extends UIDGVAbstractDataItem {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The editor.
         * @param {Block} blockModel - The block model.
         * @param {EDataPortType} [portTypeSection] - The data port type section to display.
         */
        constructor(editor, blockModel, portTypeSection) {
            super({ className: 'sch-datagridview-dataport' }, editor, blockModel);
            this._onDataPortAddCB = this._onDataPortAdd.bind(this);
            this._onDataPortRemoveCB = this._onDataPortRemove.bind(this);
            this._onDataPortDefaultValueChangeCB = this._onDataPortDefaultValueChange.bind(this);
            this._onDataPortOverrideChangeCB = this._onDataPortOverrideChange.bind(this);
            this._portTypeSection = portTypeSection;
            this._updateContent();
            this._blockModel.addListener(Events.DataPortAddEvent, this._onDataPortAddCB);
            this._blockModel.addListener(Events.DataPortRemoveEvent, this._onDataPortRemoveCB);
            // Update Default value column title
            if (this._editor.getTraceController().getPlayingState()) {
                const defaultValueColumn = this._dataGridView.columns.find(column => column.dataIndex === 'defaultValue');
                defaultValueColumn.text = UINLS.get('treeListColumnPlayValue');
            }
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
            this._blockModel.removeListener(Events.DataPortAddEvent, this._onDataPortAddCB);
            this._blockModel.removeListener(Events.DataPortRemoveEvent, this._onDataPortRemoveCB);
            this._blockModel.getDataPorts().forEach(dp => {
                dp.removeListener(Events.DataPortDefaultValueChangeEvent, this._onDataPortDefaultValueChangeCB);
                dp.removeListener(Events.DataPortOverrideChangeEvent, this._onDataPortOverrideChangeCB);
            });
            super.remove(); // Parent class removes the tree document and triggers some callbacks!
            this._portTypeSection = undefined;
            this._idpSectionNodeModel = undefined;
            this._odpSectionNodeModel = undefined;
            this._ldpSectionNodeModel = undefined;
            this._onDataPortAddCB = undefined;
            this._onDataPortRemoveCB = undefined;
            this._onDataPortDefaultValueChangeCB = undefined;
            this._onDataPortOverrideChangeCB = undefined;
        }
        /**
         * Gets the section node model from the provided data port type.
         * @public
         * @param {ModelEnums.EDataPortType} portType - The data port type.
         * @returns {WUXTreeNodeModel} The corresponding section node model.
         */
        getSectionNodeModelFromPortType(portType) {
            let nodeModel;
            if (portType === ModelEnums.EDataPortType.eInput) {
                nodeModel = this._idpSectionNodeModel;
            }
            else if (portType === ModelEnums.EDataPortType.eOutput) {
                nodeModel = this._odpSectionNodeModel;
            }
            else if (portType === ModelEnums.EDataPortType.eLocal) {
                nodeModel = this._ldpSectionNodeModel;
            }
            return nodeModel;
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
         * Gets the name cell editable state.
         * @protected
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @returns {boolean} - The name cell editable state.
         */
        _getNameCellEditableState(cellInfos) {
            const dataPort = this._getDataPortFromCellInfos(cellInfos);
            return UIDGVTools.getDataItemNameCellEditableState(this._editor, cellInfos, dataPort);
        }
        /**
         * Sets the name cell value.
         * @protected
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {string} newName - The new name.
         */
        _setNameCellValue(cellInfos, newName) {
            const dataPort = this._getDataPortFromCellInfos(cellInfos);
            UIDGVTools.setDataItemNameCellValue(cellInfos, dataPort, newName);
        }
        /**
         * Gets the value type cell semantics.
         * @protected
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @returns {Object} The value type cell semantics.
         */
        _getValueTypeSemantics(cellInfos) {
            const dataPort = this._getDataPortFromCellInfos(cellInfos);
            return UIDGVTools.getDataItemValueTypeSemantics(this._editor, cellInfos, dataPort);
        }
        /**
         * Gets the value type cell editable state.
         * @protected
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @returns {boolean} - The value type cell editable state.
         */
        _getValueTypeCellEditableState(cellInfos) {
            const dataPort = this._getDataPortFromCellInfos(cellInfos);
            return UIDGVTools.getDataItemValueTypeCellEditableState(this._editor, cellInfos, dataPort);
        }
        /**
         * Sets the value type cell value.
         * @protected
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {string} newValueType - The new value type.
         */
        _setValueTypeCellValue(cellInfos, newValueType) {
            const dataPort = this._getDataPortFromCellInfos(cellInfos);
            UIDGVTools.setDataItemValueTypeCellValue(cellInfos, dataPort, newValueType);
        }
        /**
         * Gets the default value cell type representation.
         * @protected
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @returns {string} - The default value cell type representation.
         */
        // eslint-disable-next-line class-methods-use-this
        _getDefaultValueCellTypeRepresentation(cellInfos) {
            return UIDGVTools.getDataItemDefaultValueCellTypeRepresentation(cellInfos);
        }
        /**
         * Gets the default value cell class name.
         * @protected
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @returns {string} The default value cell class name.
         */
        _getDefaultValueCellClassName(cellInfos) {
            const dataPort = this._getDataPortFromCellInfos(cellInfos);
            return UIDGVTools.getDataPortDefaultValueCellClassName(this._editor, cellInfos, dataPort);
        }
        /**
         * Gets the default value cell editable state.
         * @protected
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @returns {boolean} - The default value cell editable state.
         */
        _getDefaultValueCellEditableState(cellInfos) {
            const dataPort = this._getDataPortFromCellInfos(cellInfos);
            return UIDGVTools.getDataItemDefaultValueCellEditableState(this._editor, cellInfos, dataPort);
        }
        /**
         * Gets the default value cell value.
         * @protected
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @returns {any} - The default value cell value.
         */
        _getDefaultValueCellValue(cellInfos) {
            const dataPort = this._getDataPortFromCellInfos(cellInfos);
            return UIDGVTools.getDataItemDefaultValueCellValue(this._editor, cellInfos, dataPort);
        }
        /**
         * Sets the default value cell value.
         * @protected
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {*} newDefaultValue - The new default value.
         */
        _setDefaultValueCellValue(cellInfos, newDefaultValue) {
            const dataPort = this._getDataPortFromCellInfos(cellInfos);
            UIDGVTools.setDataItemDefaultValueCellValue(this._editor, cellInfos, dataPort, newDefaultValue);
        }
        /**
         * Gets the action cell semantics.
         * @protected
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @returns {IActionsTweakerSemantics} The action cell semantics.
         */
        _getActionCellSemantics(cellInfos) {
            let result = {};
            if (cellInfos === null || cellInfos === void 0 ? void 0 : cellInfos.nodeModel) {
                const isSection = cellInfos.nodeModel.getAttributeValue('isSection');
                const portType = cellInfos.nodeModel.getAttributeValue('portType');
                const tooltipInfos = UIDGVDataPort._getTooltipInfosFromPortType(portType, isSection);
                if (isSection) {
                    result = {
                        addButtonDefinition: {
                            display: this._blockModel.isDataPortTypeAddable(portType),
                            index: 2,
                            disabled: false,
                            tooltipOptions: {
                                title: tooltipInfos.title,
                                shortHelp: tooltipInfos.shortHelp
                            }
                        }
                    };
                }
                else {
                    const dataPort = this._getDataPortFromCellInfos(cellInfos);
                    const isOutputPort = dataPort.getType() === ModelEnums.EDataPortType.eOutput;
                    const isSubDataPort = dataPort.dataPort !== undefined;
                    const isInputPortAndNotSubDataPort = !isOutputPort && !isSubDataPort;
                    const isPlaying = this._editor.getTraceController().getPlayingState();
                    const isValueSettable = dataPort.isDefaultValueSettable();
                    const disableResetButton = !dataPort.isOverride() || !isValueSettable || isPlaying;
                    const disableUndefinedButton = dataPort.getDefaultValue() === undefined;
                    const isDataPortRemovable = this._blockModel.isDataPortRemovable(dataPort);
                    result = {
                        resetButtonDefinition: {
                            display: isInputPortAndNotSubDataPort,
                            index: 0,
                            disabled: disableResetButton
                        },
                        undefinedButtonDefinition: {
                            display: isInputPortAndNotSubDataPort,
                            index: 1,
                            disabled: disableUndefinedButton
                        },
                        removeButtonDefinition: {
                            display: isDataPortRemovable,
                            index: 2,
                            disabled: false,
                            tooltipOptions: {
                                title: tooltipInfos.title,
                                shortHelp: tooltipInfos.shortHelp
                            }
                        }
                    };
                }
            }
            return result;
        }
        /**
         * The callback on the action button click event.
         * @protected
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {string} value - The name of the action.
         */
        // eslint-disable-next-line class-methods-use-this
        _onActionButtonClick(cellInfos, value) {
            if ((cellInfos === null || cellInfos === void 0 ? void 0 : cellInfos.nodeModel) && value) {
                if (value === 'eAddAction') {
                    const block = cellInfos.nodeModel.getAttributeValue('block');
                    const portType = cellInfos.nodeModel.getAttributeValue('portType');
                    block.createDynamicDataPort(portType);
                }
                else if (value === 'eRemoveAction') {
                    const dataPort = cellInfos.nodeModel.getAttributeValue('dataPort');
                    if (dataPort.block.isDataPortRemovable(dataPort)) {
                        dataPort.block.removeDataPort(dataPort);
                    }
                }
                else if (value === 'eUndefinedAction') {
                    const dataPort = cellInfos.nodeModel.getAttributeValue('dataPort');
                    if (dataPort.isDefaultValueSettable()) {
                        dataPort.setDefaultValue(undefined);
                        cellInfos.nodeModel.setAttribute('defaultValue', undefined);
                    }
                }
                else if (value === 'eResetAction') {
                    const dataPort = cellInfos.nodeModel.getAttributeValue('dataPort');
                    dataPort.resetDefaultValue();
                    cellInfos.nodeModel.setAttribute('defaultValue', dataPort.getDefaultValue());
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
        /**
         * Updates the data grid view content.
         * @private
         */
        _updateContent() {
            if (this._portTypeSection === undefined || this._portTypeSection === ModelEnums.EDataPortType.eInput) {
                this._idpSectionNodeModel = this._createSectionNodeModel(ModelEnums.EDataPortType.eInput);
                const inputDataPorts = this._blockModel.getDataPorts(ModelEnums.EDataPortType.eInput);
                inputDataPorts.forEach(idp => this._createDataPortNodeModel(idp));
                this._idpSectionNodeModel.expand();
            }
            if (this._portTypeSection === undefined || this._portTypeSection === ModelEnums.EDataPortType.eOutput) {
                this._odpSectionNodeModel = this._createSectionNodeModel(ModelEnums.EDataPortType.eOutput);
                const outputDataPorts = this._blockModel.getDataPorts(ModelEnums.EDataPortType.eOutput);
                outputDataPorts.forEach(odp => this._createDataPortNodeModel(odp));
                this._odpSectionNodeModel.expand();
            }
            if (this._portTypeSection === undefined || this._portTypeSection === ModelEnums.EDataPortType.eLocal) {
                this._ldpSectionNodeModel = this._createSectionNodeModel(ModelEnums.EDataPortType.eLocal);
                const localDataPorts = this._blockModel.getDataPorts(ModelEnums.EDataPortType.eLocal);
                localDataPorts.forEach(ldp => this._createDataPortNodeModel(ldp));
                this._ldpSectionNodeModel.expand();
            }
            // Hide columns for output data port type only
            if (this._portTypeSection === ModelEnums.EDataPortType.eOutput) {
                this._dataGridView.layout.setColumnVisibleFlag('defaultValue', false);
            }
            // Rename default value column header for CSI case
            if (this._portTypeSection === ModelEnums.EDataPortType.eInput && UIDGVTools.isReadOnlyRoot(this._editor, this._blockModel.getDataPorts(ModelEnums.EDataPortType.eInput)[0])) {
                const defaultValueColumn = this._dataGridView.columns.find(column => column.dataIndex === 'defaultValue');
                defaultValueColumn.text = UINLS.get('treeListColumnCSIDefaultValue');
            }
        }
        /**
         * Creates a section node model and adds it to the tree document.
         * @private
         * @param {ModelEnums.EDataPortType} portType - The data port type.
         * @returns {WUXTreeNodeModel} The created section node model.
         */
        _createSectionNodeModel(portType) {
            const nodeModel = new WUXTreeNodeModel({
                label: UINLSTools.getDataPortsNLSName(portType) + ' (0)',
                grid: {
                    isSection: true,
                    block: this._blockModel,
                    portType: portType,
                    actions: {}
                }
            });
            this._treeDocument.addRoot(nodeModel);
            return nodeModel;
        }
        /**
         * Creates a data port node model.
         * @private
         * @param {DataPort} dataPort - The data port model.
         * @returns {WUXTreeNodeModel} The created data node model.
         */
        _createDataPortNodeModel(dataPort) {
            const portType = dataPort.getType();
            const nodeModel = new WUXTreeNodeModel({
                label: dataPort.getName(),
                grid: {
                    dataPort: dataPort,
                    portType: portType,
                    valueType: dataPort.getValueType(),
                    defaultValue: dataPort.getDefaultValue(),
                    fromDebug: false,
                    actions: {}
                }
            });
            const sectionNodeModel = this.getSectionNodeModelFromPortType(portType);
            sectionNodeModel.addChild(nodeModel);
            sectionNodeModel.expand();
            this._updateSectionNodeModelLabel(portType);
            dataPort.addListener(Events.DataPortDefaultValueChangeEvent, this._onDataPortDefaultValueChangeCB);
            dataPort.addListener(Events.DataPortOverrideChangeEvent, this._onDataPortOverrideChangeCB);
            return nodeModel;
        }
        /**
         * Updates the section node model label.
         * @private
         * @param {ModelEnums.EDataPortType} portType - The data port type.
         */
        _updateSectionNodeModelLabel(portType) {
            var _a;
            const sectionNodeModel = this.getSectionNodeModelFromPortType(portType);
            const label = UINLSTools.getDataPortsNLSName(portType) + ' (' + (((_a = sectionNodeModel.getChildren()) === null || _a === void 0 ? void 0 : _a.length) || 0) + ')';
            sectionNodeModel.setLabel(label);
        }
        /**
         * Gets the data port from the provided WUX cell infos.
         * @private
         * @param {IWUXCellInfos} cellInfos - The WUX cell infos.
         * @returns {DataPort} The data port.
         */
        _getDataPortFromCellInfos(cellInfos) {
            let dataPort;
            if (cellInfos.nodeModel && !cellInfos.nodeModel.isRoot()) {
                const portName = cellInfos.nodeModel.getLabel();
                dataPort = this._blockModel.getDataPortByName(portName);
            }
            return dataPort;
        }
        /**
         * Gets the node model from the given data port model.
         * @private
         * @param {DataPort} dataPort - The data port model.
         * @returns {WUXTreeNodeModel} The corresponding node model.
         */
        _getNodeModelFromDataPortModel(dataPort) {
            let nodeModel;
            let sectionNodeModel;
            const portType = dataPort.getType();
            if (portType === ModelEnums.EDataPortType.eInput) {
                sectionNodeModel = this._idpSectionNodeModel;
            }
            else if (portType === ModelEnums.EDataPortType.eOutput) {
                sectionNodeModel = this._odpSectionNodeModel;
            }
            else if (portType === ModelEnums.EDataPortType.eLocal) {
                sectionNodeModel = this._ldpSectionNodeModel;
            }
            if (sectionNodeModel) {
                nodeModel = (sectionNodeModel.getChildren() || []).find(child => child.getAttributeValue('dataPort') === dataPort);
            }
            return nodeModel;
        }
        /**
          * The callback on the model data port add event.
          * @private
          * @param {Events.DataPortAddEvent} event - The model data port add event.
          */
        _onDataPortAdd(event) {
            const dataPort = event.getDataPort();
            this._createDataPortNodeModel(dataPort);
        }
        /**
         * The callback on the model data port remove event.
         * @private
         * @param {Events.DataPortRemoveEvent} event - The model data port remove event.
         */
        _onDataPortRemove(event) {
            const dataPort = event.getDataPort();
            dataPort.removeListener(Events.DataPortDefaultValueChangeEvent, this._onDataPortDefaultValueChangeCB);
            dataPort.removeListener(Events.DataPortOverrideChangeEvent, this._onDataPortOverrideChangeCB);
            const portType = dataPort.getType();
            const sectionNodeModel = this.getSectionNodeModelFromPortType(portType);
            if (sectionNodeModel) {
                const childrenNodeModel = sectionNodeModel.getChildren() || [];
                const portNodeModel = childrenNodeModel.find(node => node.getAttributeValue('dataPort') === dataPort);
                if (portNodeModel) {
                    sectionNodeModel.removeChild(portNodeModel);
                }
                this._updateSectionNodeModelLabel(portType);
            }
        }
        /**
         * The callback on the model data port default value change event.
         * @private
         * @param {Events.DataPortDefaultValueChangeEvent} event - The model data port default value change event.
         */
        _onDataPortDefaultValueChange(event) {
            const dataPort = event.getDataPort();
            const nodeModel = this._getNodeModelFromDataPortModel(dataPort);
            if (nodeModel) {
                const valueType = dataPort.getValueType();
                nodeModel.setAttribute('valueType', valueType);
                const defaultValue = dataPort.getDefaultValue();
                nodeModel.setAttribute('defaultValue', defaultValue);
            }
        }
        /**
         * The callback on the model data port override change event.
         * @private
         * @param {Events.DataPortOverrideChangeEvent} event - The model data port override change event.
         */
        _onDataPortOverrideChange(event) {
            const dataPort = event.getDataPort();
            const nodeModel = this._getNodeModelFromDataPortModel(dataPort);
            if (nodeModel) {
                nodeModel.updateOptions({ grid: { actions: {} } });
            }
        }
        /**
         * Gets the tooltip infos from the data port type.
         * @private
         * @static
         * @param {ModelEnums.EDataPortType} portType - The data port type.
         * @param {boolean} doCreate - True for create action, false for remove action.
         * @returns {ITooltipInfos} The tooltip infos
         */
        static _getTooltipInfosFromPortType(portType, doCreate) {
            const tooltipInfos = {};
            if (portType === ModelEnums.EDataPortType.eInput) {
                tooltipInfos.title = UINLS.get(doCreate ? 'createInputDataPortTitle' : 'removeInputDataPortTitle');
                tooltipInfos.shortHelp = UINLS.get(doCreate ? 'createInputDataPortShortHelp' : 'removeInputDataPortShortHelp');
            }
            else if (portType === ModelEnums.EDataPortType.eOutput) {
                tooltipInfos.title = UINLS.get(doCreate ? 'createOutputDataPortTitle' : 'removeOutputDataPortTitle');
                tooltipInfos.shortHelp = UINLS.get(doCreate ? 'createOutputDataPortShortHelp' : 'removeOutputDataPortShortHelp');
            }
            else if (portType === ModelEnums.EDataPortType.eLocal) {
                tooltipInfos.title = UINLS.get(doCreate ? 'createLocalDataPortTitle' : 'removeLocalDataPortTitle');
                tooltipInfos.shortHelp = UINLS.get(doCreate ? 'createLocalDataPortShortHelp' : 'removeLocalDataPortShortHelp');
            }
            return tooltipInfos;
        }
    }
    return UIDGVDataPort;
});
