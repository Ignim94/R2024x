/// <amd-module name='DS/EPSSchematicsUI/constraints/EPSSchematicsUIBlockDataPortBorderCstr'/>
define("DS/EPSSchematicsUI/constraints/EPSSchematicsUIBlockDataPortBorderCstr", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsModelEnums", "DS/EPSSchematicsUI/typings/WebUX/EPSWUXEGraphCore"], function (require, exports, ModelEnums, EGraphCore) {
    "use strict";
    /* eslint-enable no-unused-vars */
    /**
     * This class defines a block data port border constraint.
     * @class UIBlockDataPortBorderCstr
     * @alias module:DS/EPSSchematicsUI/constraints/EPSSchematicsUIBlockDataPortBorderCstr
     * @extends BorderCstr
     * @private
     */
    class UIBlockDataPortBorderCstr extends EGraphCore.BorderCstr {
        /**
         * @constructor
         * @param {UIBlockDataPort} dataPort - The block data port.
         */
        constructor(dataPort) {
            super();
            this._dataPort = dataPort;
        }
        /**
         * The callback on the update constraint.
         * @protected
         * @param {EGraphCore.Connector} connector - The connector.
         */
        onupdate(connector) {
            super.onupdate(connector);
            const halfBorderWidth = 0.5 / 2;
            const isInput = this._dataPort.getModel().getType() === ModelEnums.EDataPortType.eInput;
            const top = isInput ? connector.top - halfBorderWidth : connector.top + halfBorderWidth;
            connector.multiset('top', top);
        }
    }
    return UIBlockDataPortBorderCstr;
});
