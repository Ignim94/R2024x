//-----------------------------------------------------------------------------
// Copyright Dassault Systemes 2024
//-----------------------------------------------------------------------------
/**
 * @quickReview GCS10 LVA   : 24.04.24 : Reimplement JPO on top of ReqCoverageLinkAuthoring (FUN143685)
 * @quickReview GCS10 LVA   : 23.03.21 : This JPO does not check emxRequirement.contextUser.UserAgent anymore. It always work in user-agent mode
 * @quickReview GVC   ZUD   : 21.03.09 : IR-829869 Error mgnt when creation/deletion of derivation link fails
 */

/*
  Change History:
  Date       Change By  Release   Bug/Functionality        Details
  -----------------------------------------------------------------------------------------------------------------------------
  30-AUG-22  AGT11 GVC  V6R2023x  IR-915918-3DEXPERIENCER2023x : Suppress UserAgent execution
  17-May-23  HAT1 ZUD   V6R2018x  TSK3278161              ENOVIA GOV TRM Deprecation of functionalities to clean up
  17-Jun-06  HAT1 ZUD   V6R2018x  IR-526839-3DEXPERIENCER2018x: ENOVIA GOV TRM Deprecation of functionalities to clean up
*/
import com.dassault_systemes.requirements.ReqCoverageLinkHelpers.ReqCoverageLinkStatus;
import com.dassault_systemes.requirements.reqOperations.ReqCoverageLinkAuthoring;
import com.dassault_systemes.requirements.reqOperations.interfaces.ReqCoverageLinkException;
import com.matrixone.apps.domain.util.FrameworkException;
import com.dassault_systemes.requirements.ReqCoverageLinkNls;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;

/**
 * ${CLASSNAME}
 *
 * :WARNING: ${CLASS:emxRMTConnect}, which inherits from ${CLASSNAME}
 * is used by client code that needs to be migrated to
 * ReqCoverageLinkAuthoring:
 *
 * - ENORequirementsManagementBase/ENORMTrequirements.mj/src/com/matrixone/apps/requirements/SpecificationStructure.java
 * - ENORequirementsManagementBase/ENORMTJPO.mj/src/${CLASS:emxRMTCommonBase}.java
 * - ENORequirementsManagementBase/ENORMTJSP.mj/src/webroot/requirements/SpecificationStructureUtil.jsp
 * - CATSmmAccessEnovia/CATSmmVPLMClientImpl.mj/src/com/dassault_systemes/system_cockpit/connector/enovia/i3dx/EvalVPLM.java
 *
 * In the meantime, ${CLASSNAME} is implemented on top of
 * ReqCoverageLinkAuthoring but maintain the expected signatures
 */
public class emxRMTConnectBase_mxJPO extends emxDomainObject_mxJPO {

  /**
   * Constructor
   */
  public emxRMTConnectBase_mxJPO(Context context, String[] args)
    throws Exception {
    super(context, args);
  }

  /**
   * Create a derivation link between two DomainObject
   *
   * @param context
   * @param args
   * @return A StringList with the ID of the Derived Requirement relationship just created
   * @throws Exception
   */
  public static StringList createDerivationLinks(Context ctx, String[] args) throws Exception {

    //
    String fromPid = null;
    String toPid   = null;
    {
      String[] unpacked = (String[])JPO.unpackArgs(args);

      fromPid = unpacked[0];
      toPid   = unpacked[1];
    }

    //
    String relPid = null;
    try {
      relPid = ReqCoverageLinkAuthoring.create(ctx, fromPid, toPid);
    }
    catch (ReqCoverageLinkException exc) {
      throw new FrameworkException(ReqCoverageLinkNls.buildCoverageLinkErrorNls(ctx, exc));
    }
    
    return new StringList(relPid);
  }

  /**
   * Delete a derivation link
   *
   * Method
   * @param context           the eMatrix <code>Context</code> object
   * @param args              Derived Requirement relationship id.
   * @return Message if the relationship object is deleted.
   * @throws Throwable
   * @throws Exception if the operation fails
   * @since RequirementsManagement V6R2018x
   */
  public static String deleteDerivationLinks(Context ctx, String[] args) throws Exception {

    //
    String relPid = null;
    {
      String[] unpacked = (String[])JPO.unpackArgs(args);
      relPid = unpacked[0];
    }

    //
    try {
      ReqCoverageLinkAuthoring.delete(ctx, relPid);
    }
    catch (ReqCoverageLinkException exc) {
      throw new FrameworkException(ReqCoverageLinkNls.buildCoverageLinkErrorNls(ctx, exc));
    }
    
    return "Derivation link is removed.";
  }

  /**
   * Allow the change of the derivation link status
   *
   * Method
   * @param ctx           the eMatrix <code>Context</code> object
   * @param args              Derived Requirement relationship id, AttributeName, New value of attribute.
   * @return void.
   * @throws Throwable
   * @throws Exception if the operation fails
   * @since RequirementsManagement V6R2018x
   */
  public static void modifyLinkStatusValue(Context ctx, String[] args) throws Exception {

    //
    String relPid = null;
    ReqCoverageLinkStatus status = null;
    {
      String[] unpacked = (String[])JPO.unpackArgs(args);
      if(unpacked.length < 3)
        return;

      relPid = unpacked[0];
      status  = ReqCoverageLinkStatus.valueOf(unpacked[2]);
    }

    //
    try {
      ReqCoverageLinkAuthoring.setLinkStatus(ctx, relPid, status);
    }
    catch (ReqCoverageLinkException exc) {
      throw new FrameworkException(ReqCoverageLinkNls.buildCoverageLinkErrorNls(ctx, exc));
    }
  }
}
