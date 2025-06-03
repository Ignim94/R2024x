
import matrix.db.Context;
import com.dassault_systemes.EKLEngine.completion.CompletionJPOEvaluator;


/**
 * ${CLASSNAME}
 */
public final class InstructionTemplateExport_mxJPO extends CompletionJPOEvaluator {

	/**
	 * Attributes
	 */
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_0__EngineeringInstructio = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("EngineeringInstructions");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_1__InstructionTemplateEx = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("InstructionTemplateExport_AddStandardResources");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_2__PRODUCTCFG_div_VPMRef = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("PRODUCTCFG/VPMReference");
	private final static com.dassault_systemes.EKLEngine.common.lib.implementation.StringType _STRING_3__VPMEditor_GetAllRepre = new com.dassault_systemes.EKLEngine.common.lib.implementation.StringType("VPMEditor_GetAllRepresentations");

	/**
	 * evaluate
	 * @param iContext
	 * @param iPLMIDSet
	 * @param oPLMIDSet
	 */
	public final void evaluate(matrix.db.Context iContext, com.dassault_systemes.EKLEngine.common.lib.PLMIDSet iPLMIDSet, com.dassault_systemes.EKLEngine.common.lib.PLMIDSet oPLMIDSet)	
			throws Exception {
		com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet InstTemplateRefResourcesSet = new com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet InstTemplateRefResourcesIDSet = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet InstTemplateRefProductsIDSet = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		com.dassault_systemes.EKLEngine.common.lib.PLMIDSet PLMIDSetProductStructure = new com.dassault_systemes.EKLEngine.common.lib.PLMIDSet();
		InstTemplateRefResourcesSet.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMFunction( iContext , _STRING_0__EngineeringInstructio, _STRING_1__InstructionTemplateEx, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { iPLMIDSet } ) );
		InstTemplateRefResourcesIDSet.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMRouteSet.Ids( InstTemplateRefResourcesSet ) );
		InstTemplateRefProductsIDSet.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.Restrict( iContext , InstTemplateRefResourcesIDSet, _STRING_2__PRODUCTCFG_div_VPMRef ) );
		PLMIDSetProductStructure.setValue( com.dassault_systemes.EKLEngine.completion.lib.Completion.ExecutePLMProcedure( iContext , _STRING_3__VPMEditor_GetAllRepre, new com.dassault_systemes.EKLEngine.common.lib.implementation.ObjectType[] { InstTemplateRefProductsIDSet } ) );
		oPLMIDSet.setValue( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( com.dassault_systemes.EKLEngine.common.lib.PLMIDSet.plus( iPLMIDSet, InstTemplateRefResourcesIDSet ), PLMIDSetProductStructure ) );
	}
}
