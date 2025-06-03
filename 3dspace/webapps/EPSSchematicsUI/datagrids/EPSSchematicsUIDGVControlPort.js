/// <amd-module name='DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVControlPort'/>
define("DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVControlPort", ["require", "exports", "DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVAbstractModelItem", "DS/EPSSchematicsUI/tools/EPSSchematicsUINLSTools", "i18n!DS/EPSSchematicsUI/assets/nls/EPSSchematicsUINLS", "DS/EPSSchematicsModelWeb/EPSSchematicsEvents", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXTreeNodeModel", "DS/EPSSchematicsModelWeb/EPSSchematicsDynamicBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsEventPort", "css!DS/EPSSchematicsUI/css/datagrids/EPSSchematicsUIDGVControlPort"], function (require, exports, UIDGVAbstractModelItem, UINLSTools, UINLS, Events, ModelEnums, WUXTreeNodeModel, DynamicBlock, EventPort) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines the UI data grid view control port.
     * @private
     * @class UIDGVControlPort
     * @alias module:DS/EPSSchematicsUI/datagrids/EPSSchematicsUIDGVControlPort
     * @extends UIDGVAbstractModelItem
     */
    class UIDGVControlPort extends UIDGVAbstractModelItem {
        /**
         * @public
         * @constructor
         * @param {UIEditor} editor - The editor.
         * @param {Block} blockModel - The block model.
         */
        constructor(editor, blockModel) {
            super({ className: 'sch-datagridview-controlport' }, editor, blockModel);
            this._onControlPortAddCB = this._onControlPortAdd.bind(this);
            this._onControlPortRemoveCB = this._onControlPortRemove.bind(this);
            this._updateContent();
            this._blockModel.addListener(Events.ControlPortAddEvent, this._onControlPortAddCB);
            this._blockModel.addListener(Events.ControlPortRemoveEvent, this._onControlPortRemoveCB);
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
            this._blockModel.removeListener(Events.ControlPortAddEvent, this._onControlPortAddCB);
            this._blockModel.removeListener(Events.ControlPortRemoveEvent, this._onControlPortRemoveCB);
            super.remove(); // Parent class removes the tree document and triggers some callbacks!
            this._icpNodeModel = undefined;
            this._ocpNodeModel = undefined;
            this._iepNodeModel = undefined;
            this._oepNodeModel = undefined;
            this._onControlPortAddCB = undefined;
            this._onControlPortRemoveCB = undefined;
        }
        /**
         * Gets the section node model from the provided control port type.
         * @public
         * @param {ModelEnums.EControlPortType} portType - The control port type.
         * @returns {WUXTreeNodeModel} The corresponding section node model.
         */
        getSectionNodeModelFromPortType(portType) {
            let nodeModel;
            if (portType === ModelEnums.EControlPortType.eInput) {
                nodeModel = this._icpNodeModel;
            }
            else if (portType === ModelEnums.EControlPortType.eOutput) {
                nodeModel = this._ocpNodeModel;
            }
            else if (portType === ModelEnums.EControlPortType.eInputEvent) {
                nodeModel = this._iepNodeModel;
            }
            else if (portType === ModelEnums.EControlPortType.eOutputEvent) {
                nodeModel = this._oepNodeModel;
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
         * Defines the data grid view columns.
         * @protected
         * @override
         */
        _defineColumns() {
            this._defineNameColumn();
            this._defineEventTypeColumn();
            this._defineActionsColumn();
        }
        /**
         * Gets the name cell editable state.
         * @protected
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @returns {boolean} - The name cell editable state.
         */
        _getNameCellEditableState(cellInfos) {
            const controlPort = this._getControlPortFromCellInfos(cellInfos);
            const isEditable = controlPort && controlPort.isNameSettable() && !this._editor.getTraceController().getPlayingState();
            return isEditable;
        }
        /**
         * Sets the name cell value.
         * @protected
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @param {string} newName - The new name.
         */
        _setNameCellValue(cellInfos, newName) {
            const controlPort = this._getControlPortFromCellInfos(cellInfos);
            if (controlPort) {
                const previousName = cellInfos.nodeModel.getLabel();
                const result = controlPort.setName(newName);
                const name = result ? newName : previousName;
                cellInfos.nodeModel.setLabel(name);
            }
        }
        /**
         * Gets the action cell semantics.
         * @protected
         * @param {IWUXCellInfos} cellInfos - The cell infos.
         * @returns {object} The action cell semantics.
         */
        _getActionCellSemantics(cellInfos) {
            let result = {};
            if (cellInfos === null || cellInfos === void 0 ? void 0 : cellInfos.nodeModel) {
                const isSection = cellInfos.nodeModel.getAttributeValue('isSection');
                const portType = cellInfos.nodeModel.getAttributeValue('portType');
                const tooltipInfos = UIDGVControlPort._getTooltipInfosFromPortType(portType, isSection);
                if (isSection) {
                    result = {
                        addButtonDefinition: {
                            display: this._blockModel.isControlPortTypeAddable(portType),
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
                    const controlPort = cellInfos.nodeModel.getAttributeValue('controlPort');
                    const isControlPortRemovable = this._blockModel.isControlPortRemovable(controlPort);
                    result = {
                        removeButtonDefinition: {
                            display: isControlPortRemovable,
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
        _onActionButtonClick(cellInfos, value) {
            if ((cellInfos === null || cellInfos === void 0 ? void 0 : cellInfos.nodeModel) && value) {
                if (value === 'eAddAction') {
                    if (this._blockModel instanceof DynamicBlock) {
                        const portType = cellInfos.nodeModel.getAttributeValue('portType');
                        this._blockModel.createDynamicControlPort(portType);
                    }
                }
                else if (value === 'eRemoveAction') {
                    const controlPort = cellInfos.nodeModel.getAttributeValue('controlPort');
                    if (this._blockModel.isControlPortRemovable(controlPort)) {
                        this._blockModel.removeControlPort(controlPort);
                    }
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
         * Defines the data grid view event type column.
         * @private
         */
        _defineEventTypeColumn() {
            this._columns.push({
                dataIndex: 'eventType',
                text: UINLS.get('treeListColomnEventType'),
                typeRepresentation: 'string',
                editionPolicy: 'EditionOnOver',
                visibleFlag: true,
                getCellClassName: cellInfos => { var _a; return ((_a = cellInfos.nodeModel) === null || _a === void 0 ? void 0 : _a.isRoot()) ? 'sch-dgv-node-root' : ''; },
                getCellSemantics: cellInfos => {
                    let cellSemantics = {};
                    const controlPort = this._getControlPortFromCellInfos(cellInfos);
                    if (controlPort instanceof EventPort && controlPort.isEventTypeSettable()) {
                        cellSemantics = { possibleValues: controlPort.getAllowedEventTypes() }; // TODO: Migrate on valueTypeCombo!
                    }
                    return cellSemantics;
                },
                getCellEditableState: cellInfos => {
                    const controlPort = this._getControlPortFromCellInfos(cellInfos);
                    const isEditable = controlPort instanceof EventPort && controlPort.isEventTypeSettable() && !this._editor.getTraceController().getPlayingState();
                    return isEditable;
                },
                setCellValue: (cellInfos, newEventType) => {
                    const controlPort = this._getControlPortFromCellInfos(cellInfos);
                    if (controlPort instanceof EventPort && controlPort.isEventTypeSettable()) {
                        const previousEventType = cellInfos.nodeModel.getAttributeValue('eventType');
                        const result = controlPort.setEventType(newEventType);
                        const eventType = result ? newEventType : previousEventType;
                        cellInfos.nodeModel.updateOptions({ grid: { eventType: eventType } });
                    }
                }
            });
        }
        /**
         * Gets the control port from the provided WUX cell infos.
         * @private
         * @param {IWUXCellInfos} cellInfos - The WUX cell infos.
         * @returns {ControlPort} The control port.
         */
        _getControlPortFromCellInfos(cellInfos) {
            let controlPort;
            if (cellInfos.nodeModel && !cellInfos.nodeModel.isRoot()) {
                const portName = cellInfos.nodeModel.getLabel();
                controlPort = this._blockModel.getControlPortByName(portName);
            }
            return controlPort;
        }
        /**
         * Creates a section node model and adds it to the tree document.
         * @private
         * @param {ModelEnums.EControlPortType} portType - The control port type.
         * @returns {WUXTreeNodeModel} The created section node model.
         */
        _createSectionNodeModel(portType) {
            const nodeModel = new WUXTreeNodeModel({
                label: UINLSTools.getControlPortsNLSName(portType) + ' (0)',
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
         * Creates a control port node model.
         * @private
         * @param {ControlPort} controlPort - The control port model.
         * @returns {WUXTreeNodeModel} The created control node model.
         */
        _createControlPortNodeModel(controlPort) {
            const portType = controlPort.getType();
            const nodeModel = new WUXTreeNodeModel({
                label: controlPort.getName(),
                grid: {
                    controlPort: controlPort,
                    portType: portType,
                    actions: {},
                    ...(controlPort instanceof EventPort && { eventType: controlPort.getEventType() })
                }
            });
            const sectionNodeModel = this.getSectionNodeModelFromPortType(portType);
            sectionNodeModel.addChild(nodeModel);
            sectionNodeModel.expand();
            this._updateSectionNodeModelLabel(portType);
            return nodeModel;
        }
        /**
         * Updates the section node model label.
         * @private
         * @param {ModelEnums.EControlPortType} portType - The control port type.
         */
        _updateSectionNodeModelLabel(portType) {
            var _a;
            const sectionNodeModel = this.getSectionNodeModelFromPortType(portType);
            const label = UINLSTools.getControlPortsNLSName(portType) + ' (' + (((_a = sectionNodeModel.getChildren()) === null || _a === void 0 ? void 0 : _a.length) || 0) + ')';
            sectionNodeModel.setLabel(label);
        }
        /**
         * Updates the data grid view content.
         * @private
         */
        _updateContent() {
            this._icpNodeModel = this._createSectionNodeModel(ModelEnums.EControlPortType.eInput);
            this._ocpNodeModel = this._createSectionNodeModel(ModelEnums.EControlPortType.eOutput);
            this._iepNodeModel = this._createSectionNodeModel(ModelEnums.EControlPortType.eInputEvent);
            this._oepNodeModel = this._createSectionNodeModel(ModelEnums.EControlPortType.eOutputEvent);
            const inputControlPorts = this._blockModel.getControlPorts(ModelEnums.EControlPortType.eInput);
            inputControlPorts.forEach(icp => this._createControlPortNodeModel(icp));
            const outputControlPorts = this._blockModel.getControlPorts(ModelEnums.EControlPortType.eOutput);
            outputControlPorts.forEach(ocp => this._createControlPortNodeModel(ocp));
            const inputEventPorts = this._blockModel.getControlPorts(ModelEnums.EControlPortType.eInputEvent);
            inputEventPorts.forEach(iep => this._createControlPortNodeModel(iep));
            const outputEventPorts = this._blockModel.getControlPorts(ModelEnums.EControlPortType.eOutputEvent);
            outputEventPorts.forEach(oep => this._createControlPortNodeModel(oep));
            this._icpNodeModel.expand();
            this._ocpNodeModel.expand();
            this._iepNodeModel.expand();
            this._oepNodeModel.expand();
        }
        /**
          * The callback on the model control port add event.
          * @private
          * @param {Events.ControlPortAddEvent} event - The model control port add event.
          */
        _onControlPortAdd(event) {
            const controlPort = event.getControlPort();
            this._createControlPortNodeModel(controlPort);
        }
        /**
         * The callback on the model control port remove event.
         * @private
         * @param {Events.ControlPortRemoveEvent} event - The model control port remove event.
         */
        _onControlPortRemove(event) {
            const controlPort = event.getControlPort();
            const portType = controlPort.getType();
            const sectionNodeModel = this.getSectionNodeModelFromPortType(portType);
            if (sectionNodeModel) {
                const portNodeModel = sectionNodeModel.getChildren().find(node => node.getAttributeValue('controlPort') === controlPort);
                if (portNodeModel) {
                    sectionNodeModel.removeChild(portNodeModel);
                }
                this._updateSectionNodeModelLabel(portType);
            }
        }
        /**
         * Gets the tooltip infos from the control port type.
         * @private
         * @static
         * @param {ModelEnums.EControlPortType} portType - The control port type.
         * @param {boolean} doCreate - True for create action, false for delete action.
         * @returns {IWUXTooltipModel} The tooltip infos
         */
        static _getTooltipInfosFromPortType(portType, doCreate) {
            const tooltipInfos = {};
            if (portType === ModelEnums.EControlPortType.eInput) {
                tooltipInfos.title = UINLS.get(doCreate ? 'createInputControlPortTitle' : 'removeInputControlPortTitle');
                tooltipInfos.shortHelp = UINLS.get(doCreate ? 'createInputControlPortShortHelp' : 'removeInputControlPortShortHelp');
            }
            else if (portType === ModelEnums.EControlPortType.eOutput) {
                tooltipInfos.title = UINLS.get(doCreate ? 'createOutputControlPortTitle' : 'removeOutputControlPortTitle');
                tooltipInfos.shortHelp = UINLS.get(doCreate ? 'createOutputControlPortShortHelp' : 'removeOutputControlPortShortHelp');
            }
            else if (portType === ModelEnums.EControlPortType.eInputEvent) {
                tooltipInfos.title = UINLS.get(doCreate ? 'createInputEventPortTitle' : 'removeInputEventPortTitle');
                tooltipInfos.shortHelp = UINLS.get(doCreate ? 'createInputEventPortShortHelp' : 'removeInputEventPortShortHelp');
            }
            else if (portType === ModelEnums.EControlPortType.eOutputEvent) {
                tooltipInfos.title = UINLS.get(doCreate ? 'createOutputEventPortTitle' : 'removeOutputEventPortTitle');
                tooltipInfos.shortHelp = UINLS.get(doCreate ? 'createOutputEventPortShortHelp' : 'removeOutputEventPortShortHelp');
            }
            return tooltipInfos;
        }
    }
    return UIDGVControlPort;
});
