/// <amd-module name='DS/EPSSchematicsCoreLibrary/flow/EPSJoinAllBlock'/>
define("DS/EPSSchematicsCoreLibrary/flow/EPSJoinAllBlock", ["require", "exports", "DS/EPSSchematicsModelWeb/EPSSchematicsDynamicBlock", "DS/EPSSchematicsModelWeb/EPSSchematicsControlPortDefinitions", "DS/EPSSchematicsModelWeb/EPSSchematicsTools", "DS/EPSSchematicsCoreLibrary/flow/EPSSchematicsCoreLibraryFlowCategory", "DS/EPSSchematicsModelWeb/EPSSchematicsBlockLibrary"], function (require, exports, DynamicBlock, ControlPortDefinitions, Tools, FlowCategory, BlockLibrary) {
    "use strict";
    class JoinAllBlock extends DynamicBlock {
        constructor() {
            super();
            this.createControlPorts([
                new ControlPortDefinitions.Input('In'),
                new ControlPortDefinitions.Output('Out')
            ]);
        }
    }
    JoinAllBlock.prototype.uid = Tools.JoinAllBlockUid;
    JoinAllBlock.prototype.name = 'Join All';
    JoinAllBlock.prototype.category = FlowCategory;
    JoinAllBlock.prototype.documentation = 'i18n!DS/EPSSchematicsCoreLibrary/assets/nls/EPSJoinAllBlockDoc';
    BlockLibrary.registerBlock(JoinAllBlock);
    return JoinAllBlock;
});
