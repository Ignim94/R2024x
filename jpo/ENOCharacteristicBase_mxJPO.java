import static com.dassault_systemes.enovia.characteristic.util.CharacteristicMasterConstants.ID;
import static com.matrixone.apps.domain.DomainConstants.SELECT_LAST_ID;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import matrix.db.Context;

import com.dassault_systemes.enovia.characteristic.impl.CharacteristicServices;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicEnum;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicEnum.CharacteristicAttributes;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicEnum.CharacteristicRelationships;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicEnum.CharacteristicType;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicServices;
import com.dassault_systemes.enovia.characteristic.util.CharacteristicMasterConstants;
import com.dassault_systemes.enovia.characteristic.util.CharacteristicMasterUtil;
import com.dassault_systemes.enovia.criteria.interfaces.ENOCriteriaEnum;
import com.dassault_systemes.enovia.criteria.interfaces.ENOCriteriaServices;
import com.dassault_systemes.enovia.criteria.util.CriteriaConstants;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.framework.ui.UIUtil;

/**
 * @author b1r
 *
 */
public class ENOCharacteristicBase_mxJPO {
	
	/**
	 * 
	 */
	public ENOCharacteristicBase_mxJPO() {
		// TODO Auto-generated constructor stub
	}
	
/************************* Below are the trigger methods added for the New Characteristic Mangagement highlight to support any Item (Part, Manufacturing Item)  ****************************************/ 	
 	
 	
 	/**
     * This method updates the Characteristics on the Part based on the Revise or Copy Action 
     *
     * @param context The ematrix context of the request.
     * @param args holds context object id,new clone name,new close revision,vault
     * @return nothing
     * @since AppsCommon
     */
	/*public void updateCharacteristics(Context context, String[] args) throws FrameworkException {
		try {
            String action = args[0];
            String newObjectId = args[1];
			String fromObjecId = args[2];

            if(UIUtil.isNullOrEmpty(action) || UIUtil.isNullOrEmpty(newObjectId) || UIUtil.isNullOrEmpty(fromObjecId))
            	return;
            
            if(CriteriaUtil.isKindOf(context, newObjectId, ENOCharacteristicEnum.CharacteristicType.CHARACTERISTIC_MASTER.getType(context)))
            	return;
            
            if(CriteriaConstants.REVISE.equalsIgnoreCase(action)) {
            	
            	ENOCharacteristicServices.updateCharacteristicBasedOnPreviousRevision(context, newObjectId);
            	
            } else if (CriteriaConstants.CLONE.equalsIgnoreCase(action)) {
            	
				ENOCharacteristicServices.updateCharacteristicBasedOnItemCopiedFrom(context, newObjectId, fromObjecId);
			}
        }
        catch(Exception ex) {
            throw new FrameworkException(ex.getMessage());
        }
    }*/
	

	/**
	 * This method updates the Characteristics on the Part based on the Revise or Copy Action 
	 *
	 * @param context The ematrix context of the request.
	 * @param args holds context object id,new clone name,new close revision,vault
	 * @return nothing
	 * @since AppsCommon
	 */
	/*public void updateCharacteristics(Context context, String[] args) throws FrameworkException {
		try {
			String action = args[0];
			String prevObjecId = args[1];
			
			if(UIUtil.isNullOrEmpty(action) || UIUtil.isNullOrEmpty(prevObjecId))
				return;
			
			if(CriteriaUtil.isKindOf(context, prevObjecId, ENOCharacteristicEnum.CharacteristicType.CHARACTERISTIC_MASTER.getType(context)))
				return;
			
			if(CriteriaConstants.REVISE.equalsIgnoreCase(action)) {				
				DomainObject techSpecObj = DomainObject.newInstance(context, prevObjecId);
				BusinessObject revisedObject = techSpecObj.getNextRevision(context);
				
				ENOCharacteristicServices.updateCharacteristicBasedOnPreviousRevision(context, revisedObject.getObjectId(context));
				
			} else if (CriteriaConstants.CLONE.equalsIgnoreCase(action)) {
				String typeName = args[2];
				String newName = args[3];
				String newRev = args[4];
				String vault = args[5];
				if(UIUtil.isNullOrEmpty(typeName) || UIUtil.isNullOrEmpty(newName) || UIUtil.isNullOrEmpty(newRev))
					return;
				BusinessObject clonedObject = new BusinessObject(typeName, newName, newRev, vault);
				if(clonedObject.exists(context)) {
					ENOCharacteristicServices.updateCharacteristicBasedOnItemCopiedFrom(context, prevObjecId, clonedObject.getObjectId(context));
				}
				//ENOCharacteristicServices.updateCharacteristicBasedOnItemCopiedFrom(context, prevObjecId, fromObjecId);
			}
		}
		catch(Exception ex) {
			throw new FrameworkException(ex.getMessage());
		}
	}*/

	/*public int applyCharacteristicAggregationInterface(Context context, String[] args) throws Exception {
		
		String action = args[0];
        String newObjectId = args[1];
		String fromObjecId = args[2];
		String toObjectId = args[3];
		String relId = args[4];
		
		boolean reviseEvent = false, cloneEvent = false;
		
		String eventType = args[0];
		
		if (CriteriaConstants.REVISE.equalsIgnoreCase(action))
			reviseEvent = true;
		else if (CriteriaConstants.CLONE.equalsIgnoreCase(eventType))
			cloneEvent = true;
		try {
			if( reviseEvent || cloneEvent ) {	
				ENOIParameterAggregation iParAggr = CharacteristicServices.getParameterAggregationById(context, relId);
				String mandCharFlag = iParAggr.getMandatoryCharacteristic();
				String overrideOnChildFlag = iParAggr.getOverWriteAllowedOnChild();
				
				String newToObjectId = DomainObject.newInstance(context, toObjectId).getNextRevision(context).getObjectId(context);
				String newRelId = RelationshipAbstractIMPL.getConnectionId(context, newObjectId, newToObjectId, ENOCharacteristicEnum.CharacteristicRelationships.PARAMETER_AGGREGATION.getRelationship(context));
				ENOIParameterAggregation newIParAggr = CharacteristicServices.getParameterAggregationById(context, newRelId);
				newIParAggr.applyInterface(context, ENOCharacteristicEnum.CharacteristicInterfaces.CHARACTERISTIC_AGGREGATION.getInterface(context));
				newIParAggr.setMandatoryCharacteristic(mandCharFlag);
				newIParAggr.setOverWriteAllowedOnChild(overrideOnChildFlag);
				newIParAggr.commit(context);
			}
		} catch(Exception ex) {
			throw new FrameworkException(ex.getMessage());
		}
		return 0;
	}*/

	/**
     * This method updates the Characteristics on the Part based on the Copy or Revise Action 
     *
     * @param context The ematrix context of the request.
     * @param args holds context object id,new clone name,new close revision,vault
     * @return nothing
     * @since AppsCommon
     */
	public int checkMandCharacteristicsOnPartVsCriteria(Context context, String[] args) throws FrameworkException {
		try {
			String objectId = args[0];
			boolean successFlag = true;
			Set<String> latestMandatoryCMList = new HashSet<String>();
			Set<String> existingMandatoryCMList = new HashSet<String>();

			List<Map<String, String>> criteriaOutPutList = ENOCriteriaServices.getApplicableCriteriaOutput(context, objectId);
			for (Map<String, String> outputMap : criteriaOutPutList){
				if(CriteriaConstants.YES.equalsIgnoreCase(outputMap.get(ENOCriteriaEnum.Attribute.MANDATORY_CHARACTERISTIC.get(context)))) {
					latestMandatoryCMList.add(outputMap.get(CriteriaConstants.KEY_CRITERIA_OUTPUT_ID));
				}
			}
			
			String selectToDerivedCharCMId	= CharacteristicRelationships.DERIVED_CHARACTERISTIC.getRelSelect(context, false, ID);
			String selectToDerivedCharCMLastId	= CharacteristicRelationships.DERIVED_CHARACTERISTIC.getRelSelect(context, false, SELECT_LAST_ID);
			String selectToDerivedCharCMLastCurrentState	= CharacteristicRelationships.DERIVED_CHARACTERISTIC.getRelSelect(context, false, CharacteristicMasterConstants.SELECT_LAST_CURRENT);
			String selectMandAttr				= CharacteristicAttributes.MANDATORY_CHARACTERISTIC.getAttributeSelect(context);
			String typeCharMaster				= CharacteristicType.CHARACTERISTIC_MASTER.getType(context);
			List<String> lstSelects				= new ArrayList<String>();
			
			lstSelects.add(selectToDerivedCharCMId);
			lstSelects.add(selectToDerivedCharCMLastId);
			lstSelects.add(selectToDerivedCharCMLastCurrentState);
			
			MapList allCharsOnItemMapList		= ENOCharacteristicServices.getAssociatedCharacteristicsOnItem(context, objectId, lstSelects, false);

			Map<?,?> map;
			String charMasterId;
			String charMasterLastId;
			String charMasterLastCurrent;
			String mandCharacteristic;
			boolean isCharMasterOnCharacteristicLatest = true;
						
			for (Object objMap : allCharsOnItemMapList) {
				map				= (Map<?, ?>) objMap;
				mandCharacteristic			= (String) map.get(selectMandAttr);
				charMasterId		= (String) map.get(selectToDerivedCharCMId);
				charMasterLastId	= (String) map.get(selectToDerivedCharCMLastId);
				charMasterLastCurrent	= (String) map.get(selectToDerivedCharCMLastCurrentState);

				// checks if Characteristic was added directly on the Item from CM OR is a derivation from another Characteristic
				if (UIUtil.isNotNullAndNotEmpty(charMasterId) && CharacteristicMasterUtil.isKindOfType(context, charMasterId, typeCharMaster)) {
					/* Adding all the mandatory characteristics */					
					if(CriteriaConstants.YES.equalsIgnoreCase(mandCharacteristic)) {
						existingMandatoryCMList.add(charMasterId);
					}
				
					isCharMasterOnCharacteristicLatest	= charMasterId.equals(charMasterLastId);
					/* Checking if the latest Characteristic Master is in release state or not */
					if((!isCharMasterOnCharacteristicLatest) && !charMasterLastCurrent.equals(ENOCharacteristicEnum.CharacteristicStates.CHARACTERISTIC_MASTER_RELEASE.getState(context, ENOCharacteristicEnum.CharacteristicPolicy.CHARACTERISTIC_MASTER.getPolicy(context)))){
						isCharMasterOnCharacteristicLatest = true;
					}
					
					if(!isCharMasterOnCharacteristicLatest)
						break;
				}
			}
			
			/* Check criteria evaluated or not*/
			//if(!criteriaOutPutList.isEmpty())
			
			/* Characteristic Masters out of sync */
			if(!isCharMasterOnCharacteristicLatest){
				successFlag = false;
			}
			
			
			if(successFlag && !(latestMandatoryCMList.isEmpty() && existingMandatoryCMList.isEmpty())){
				if(!(latestMandatoryCMList.containsAll(existingMandatoryCMList) && existingMandatoryCMList.containsAll(latestMandatoryCMList)))
					successFlag = false;
			}
			
			if(!successFlag) {
				emxContextUtil_mxJPO.mqlNotice(context, CharacteristicMasterUtil.getProperty(context, "Characteristic.CriteriaEvaluation.OutOfSync"));
				return 1;
			}
			
			return 0;
			
		} catch(Exception ex) {
            ex.printStackTrace();
            throw new FrameworkException(ex.getMessage());
	    }
	}
	
	/**
	 * This trigger is invoked on delete of Characteristic, but before deleting it floats all the derivations to its parent.
	 * @param context eMatrix <code>Context</code> object
	 * @param jpoArgs
	 * @return
	 * @throws FrameworkException
	 */	
	public void floatDerivedCharacteristics(Context context, String [] args) throws FrameworkException {
		String objectId = args[0];
		if(UIUtil.isNullOrEmpty(objectId)) {
			throw new FrameworkException(CharacteristicMasterUtil.getProperty(context, "Characteristic.Mandatory.Characteristic.ErrorMsg"));
		}
		
		try {
			CharacteristicServices.floatDerivedCharacteristicToParent(context, objectId);
		} catch (Exception ex) {
			throw new FrameworkException(ex.getMessage());
		}
	}
 	
	/************************* New Characteristic Mangagement highlight Ends ****************************************/ 	 	
 	

}

