/// <amd-module name='DS/EPSSchematicsUI/connectors/views/EPSSchematicsUISubDataPortView'/>
define("DS/EPSSchematicsUI/connectors/views/EPSSchematicsUISubDataPortView", ["require", "exports", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIDataPortView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom", "DS/EPSSchematicsUI/data/EPSSchematicsUIShapes"], function (require, exports, UIDataPortView, UIDom, UIShapes) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defined a UI sub data port view.
     * @class UISubDataPortView
     * @alias module:DS/EPSSchematicsUI/connectors/views/EPSSchematicsUISubDataPortView
     * @extends UIDataPortView
     * @abstract
     * @private
     */
    class UISubDataPortView extends UIDataPortView {
        /**
         * @constructor
         * @param {UISubDataPort} port - The UI sub data port.
         */
        constructor(port) {
            super(port);
        }
        /**
         * Updates the connector width.
         * @public
         */
        // eslint-disable-next-line class-methods-use-this
        updateConnectorWidth() { }
        /**
         * Builds the connector SVG element.
         * @protected
         * @override
         * @param {EGraphCore.Connector} connector - The UI connector.
         * @returns {SVGElement} The connector SVG element.
         */
        buildConnElement(connector) {
            super.buildConnElement(connector);
            UIDom.addClassName(this.structure.root, 'sch-subdata-port');
            this.setVisibility(this._port.isVisible());
            return this._element;
        }
        /**
         * Creates an input connector.
         * @param {EGraphCore.Connector} connector - The connector.
         * @protected
         */
        _createInputConnector(connector) {
            this._polygon = UIDom.createSVGPolygon({
                className: 'sch-subdata-port-polygon',
                parent: this._element,
                attributes: { points: UIShapes.inputSubDataPortPolygonPoints }
            });
            connector.multiset(['cstr', 'aoffy'], -6);
            this._setRerouteHandlerPosition(2, -2);
        }
        /**
         * Creates an output connector.
         * @param {EGraphCore.Connector} connector - The connector.
         * @protected
         */
        _createOutputConnector(connector) {
            this._polygon = UIDom.createSVGPolygon({
                className: 'sch-subdata-port-polygon',
                parent: this._element,
                attributes: { points: UIShapes.outputSubDataPortPolygonPoints }
            });
            connector.multiset(['cstr', 'aoffy'], -10);
            this._setRerouteHandlerPosition(7, -2);
        }
    }
    return UISubDataPortView;
});
