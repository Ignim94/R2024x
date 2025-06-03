//-----------------------------------------------------------------------------
// COPYRIGHT DASSAULT SYSTEMES 2024
//-----------------------------------------------------------------------------
/**
 * @fullReview GCS10 LVA : 24.04.08 : Introduce ${CLASSNAME} and move Coverage Link logic implementation from ${CLASS:emxRMTCoverageLinkLogic}
 */
import com.dassault_systemes.requirements.ReqCoverageLinkLogic;

import matrix.db.Context;

/**
 * ${CLASSNAME}
 */
public class emxRMTCoverageLinkLogicBase_mxJPO extends emxDomainObject_mxJPO {


//#############################################################################

  /**
   * Constructor
   */
  public emxRMTCoverageLinkLogicBase_mxJPO(Context ctx, String[] args) throws Exception {
    super(ctx, args);
  }

//#############################################################################

  /**
   * Check whether the creation of a "Derived Connection" is allowed.
   * <br>
   * In this case, <b>force-grant fromconnect</b> access on Upstream
   * Requirement, disregarding Baseline clauses
   *<p>
   * This method called by create/check trigger for the "Derived Requirement"
   * relationship
   *<p>
   * See the emxTriggerManager Business Object paramater:
   * <pre> "eService Trigger Program Parameters" RelationshipDerivedRequirementCreateCheck A </pre>
   *
   * @param ctx  The MatrixOne context
   * @param args The Upstream Requirement and Downstream Requirement physicalids
   * @return 0 if creation is allowed, 1 otherwise
   */
  public int checkCoverageLinkCreate(Context ctx, String[] args) throws Exception {

    //:NOTE: potential macros for check/create triggers (must be
    // passed explicitely through "eService Program Argument <N>" attributes
    // on the parameter BO)
    //
    // (RELID/PHYSICALID           : rel oid/pid  : *NOT* available)
    //
    // FROMOBJECTID/FROMPHYSICALID : from oid/pid
    // FROMOBJECT                  : from tnr
    // FROMTYPE                    : from type
    //
    // TOOBJECTID/TOPHYSICALID     : to oid/pid
    // TOOBJECT                    : to tnr
    // TOTYPE                      : to type

    String fromPid = args[0]; // ${FROMPHYSICALID} mql trigger macro
    String toPid   = args[1]; // ${TOPHYSICALID} mql trigger macro

    //:NOTE: fromtype and totype are already restricted by the "Derived
    // Requirement" Relationship schema definition

    return ReqCoverageLinkLogic.checkCoverageLinkCreate(ctx, fromPid, toPid);
  }


  /**
   * Check whether the destruction of a "Derived Connection" is allowed.
   * <br>
   * In this case, <b>force-grant fromdisconnect</b> access on Upstream
   * Requirement, disregarding Baseline clauses
   *<p>
   * This method called by delete/check trigger for the "Derived Requirement"
   * relationship
   *<p>
   * See the emxTriggerManager Business Object paramater:
   * <pre> "eService Trigger Program Parameters" RelationshipDerivedRequirementDeleteCheck A </pre>
   *
   * @param ctx  The MatrixOne context
   * @param args The Upstream Requirement, the Downstream Requirement, and the "Derived Requirement" connection physicalids
   * @return 0 if destruction is allowed, 1 otherwise
   */
  public int checkCoverageLinkDelete(Context ctx, String[] args) throws Exception {

    //:NOTE: potential macros for check/delete triggers (must be
    // passed explicitely through "eService Program Argument <N>" attributes
    // on the parameter BO)
    //
    // RELID/PHYSICALID            : rel oid/pid
    //
    // FROMOBJECTID/FROMPHYSICALID : from oid/pid
    // FROMOBJECT                  : from tnr
    // FROMTYPE                    : from type
    //
    // TOOBJECTID/TOPHYSICALID     : to oid/pid
    // TOOBJECT                    : to tnr
    // TOTYPE                      : to type

    //
    String fromPid = args[0]; // ${FROMPHYSICALID} mql trigger macro
    String toPid   = args[1]; // ${TOPHYSICALID} mql trigger macro
    String relPid  = args[2]; // ${PHYSICALID} mql trigger macro

    return ReqCoverageLinkLogic.checkCoverageLinkDelete(ctx, fromPid, toPid, relPid);
  }

  /**
   * Check whether the modification of a "Derived Connection" attribute is allowed.
   *<p>
   * This method called by modifyattribute/check trigger for the "Derived Requirement"
   * relationship
   *<p>
   * See the emxTriggerManager Business Object paramater:
   * <pre> "eService Trigger Program Parameters" RelationshipDerivedRequirementModifyAttributeCheck A </pre>
   *
   * @param ctx  The MatrixOne context
   * @param args The Upstream Requirement and the Downstream Requirement physicalids
   * @return 0 if destruction is allowed, 1 otherwise
   */
  public int checkCoverageLinkModifyAttribute(Context ctx, String[] args) throws Exception {

    //:NOTE: potential macros for check/modifyattribute triggers (must be
    // passed explicitely through "eService Program Argument <N>" attributes
    // on the parameter BO)
    //
    // RELID/PHYSICALID            : rel oid/pid
    //
    // FROMOBJECTID/FROMPHYSICALID : from oid/pid
    // FROMOBJECT                  : from tnr
    // FROMTYPE                    : from type
    //
    // TOOBJECTID/TOPHYSICALID     : to oid/pid
    // TOOBJECT                    : to tnr
    // TOTYPE                      : to type
    //
    // ATTRNAME                    : attribute name

    //
    String fromPid = args[0]; // ${FROMPHYSICALID} mql trigger macro
    String toPid   = args[1]; // ${TOPHYSICALID} mql trigger macro
    String relPid  = args[2]; // ${PHYSICALID} mql trigger macro. Not used for now

    return ReqCoverageLinkLogic.checkCoverageLinkModifyAttribute(ctx, fromPid, toPid, relPid);
  }
}
