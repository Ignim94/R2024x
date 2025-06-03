/// <amd-module name='DS/EPSSchematicsUI/constraints/EPSSchematicsUIGraphControlPortBorderCstr'/>
define("DS/EPSSchematicsUI/constraints/EPSSchematicsUIGraphControlPortBorderCstr", ["require", "exports", "DS/EPSSchematicsUI/connectors/views/EPSSchematicsUIGraphControlPortView", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore"], function (require, exports, UIGraphControlPortView, EGraphCore) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a graph control port border constraint.
     * @class UIGraphControlPortBorderCstr
     * @alias module:DS/EPSSchematicsUI/constraints/EPSSchematicsUIGraphControlPortBorderCstr
     * @extends BorderCstr
     * @private
     */
    class UIGraphControlPortBorderCstr extends EGraphCore.BorderCstr {
        /**
         * @constructor
         * @param {UIGraphControlPort} controlPort - The control port.
         */
        constructor(controlPort) {
            super();
            this._controlPort = controlPort;
        }
        /**
         * The callback on the update constraint.
         * @protected
         * @param {EGraphCore.Connector} connector - The connector.
         */
        onupdate(connector) {
            super.onupdate(connector);
            if (this._controlPort.isStartPort()) {
                const portView = this._controlPort.getView();
                if (portView.getElement() !== undefined) {
                    const portBBox = portView.getBoundingBox();
                    const vpt = this._controlPort.getParentGraph().getViewer().getViewpoint();
                    const left = connector.left - (portBBox.width / vpt.scale) + UIGraphControlPortView.kPortLeftOffset;
                    connector.multiset('left', left, 'anormx', 1, 'anormy', 0);
                }
            }
            else {
                connector.multiset('left', connector.left - UIGraphControlPortView.kPortLeftOffset);
            }
        }
    }
    return UIGraphControlPortBorderCstr;
});
