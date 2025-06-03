/// <amd-module name='DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphSubDataPortView'/>
define("DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphSubDataPortView", ["require", "exports", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUISubDataPortView", "DS/EPSSchematicsUI/tools/EPSSchematicsUIDom"], function (require, exports, UISubDataPortView, UIDom) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defined a UI graph sub data port view.
     * @class UIGraphSubDataPortView
     * @alias module:DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphSubDataPortView
     * @extends UISubDataPortView
     * @private
     */
    class UIGraphSubDataPortView extends UISubDataPortView {
        /**
         * @constructor
         * @param {UIGraphSubDataPort} port - The UI graph sub data port.
         */
        constructor(port) {
            super(port);
        }
        /**
         * Builds the connector SVG element.
         * @protected
         * @override
         * @param {EGraphCore.Connector} connector - The UI connector.
         * @returns {SVGElement} The connector SVG element.
         */
        buildConnElement(connector) {
            super.buildConnElement(connector);
            UIDom.addClassName(this.structure.root, 'sch-graph-subdata-port');
            this._createConnector(connector);
            return this._element;
        }
        /**
         * Creates the connector.
         * @protected
         * @param {module:egraph/core.Connector} connector - The connector.
         */
        _createConnector(connector) {
            if (this._port.isStartPort()) {
                this._createOutputConnector(connector);
            }
            else {
                this._createInputConnector(connector);
            }
        }
    }
    return UIGraphSubDataPortView;
});
