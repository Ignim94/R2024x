/*   ${CLASS:ENOCharacteristicMasterUIBase}.java
**
**   Copyright (c) 2003-2020 Dassault Systemes.
**   All Rights Reserved.
**   This program contains proprietary and trade secret information of MatrixOne,
**   Inc.  Copyright notice is precautionary only
**   and does not evidence any actual or intended publication of such program
**
**   This JPO contains the implementation of emxBusinessSkill
**
*/


import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import com.dassault_systemes.enovia.characteristic.impl.CharacteristicIMPL;
import com.dassault_systemes.enovia.characteristic.impl.CharacteristicMasterIMPL;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicEnum;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicEnum.CharacteristicInterfaces;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicFactory;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicServices;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOICharacteristic;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOICharacteristicMaster;
import com.dassault_systemes.enovia.characteristic.util.CharacteristicMasterConstants;
import com.dassault_systemes.enovia.characteristic.util.CharacteristicMasterUtil;
import com.dassault_systemes.enovia.criteria.interfaces.ENOCriteriaEnum;
import com.dassault_systemes.enovia.criteria.interfaces.ENOCriteriaFactory;
import com.dassault_systemes.enovia.criteria.interfaces.ENOICriteria;
import com.dassault_systemes.enovia.criteria.util.CriteriaUtil;
import com.dassault_systemes.knowledge_itfs.IKweDictionary;
import com.dassault_systemes.knowledge_itfs.IKweType;
import com.dassault_systemes.knowledge_itfs.KweInterfacesServices;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MessageUtil;
import com.matrixone.apps.framework.ui.UIUtil;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;


public class ENOCharacteristicMasterBase_mxJPO
{
	
	private static final String serviceClass = "com.dassault_systemes.enovia.characteristic.impl.CharacteristicServices";

    /**
     *
     * @param context the eMatrix <code>Context</code> object
     * @param args holds no arguments
     * @throws Exception if the operation fails
     * @version Common 10.5.1.2
     * @grade 0
     */
    public ENOCharacteristicMasterBase_mxJPO (Context context, String[] args)
        throws Exception
    {
    }
    
    @com.matrixone.apps.framework.ui.CreateProcessCallable
    public HashMap<String, String> createCharacteristicMaster(Context context, String[] args) throws Exception{
    	HashMap<?, ?> programMap = (HashMap<?, ?>)JPO.unpackArgs(args);
    	Map<?, ?> requestValuesMap = (Map<?, ?>) programMap.get(CharacteristicMasterConstants.REQUEST_VALUES_MAP);    	
    	String paretOID			= (String) programMap.get(CharacteristicMasterConstants.OBJECT_ID);
    	String name				= (String) programMap.get(CharacteristicMasterConstants.NAME);
    	String description 		= (String) programMap.get(CharacteristicMasterConstants.DESCRIPTION);
    	String title 			= (String) programMap.get(DomainConstants.ATTRIBUTE_TITLE);
		/*if(UIUtil.isNullOrEmpty(displayUnit))
			displayUnit 		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get("DisplayUnitTextId"));*/
		String dimension		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.DIMENSION));
    	String displayUnit 		= null;
		IKweDictionary localIKweDictionary = KweInterfacesServices.getKweDictionary();		
		IKweType dimensionIKweType = localIKweDictionary.findType(context,dimension);
    	if(CharacteristicMasterUtil.isObscureCharacteristic(context, dimensionIKweType))
			displayUnit 		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.DISPLAY_UNIT_TEXT_ID));
    	else
    		displayUnit 		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.DISPLAY_UNIT));
		String charTitle		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.CHARACTERISTIC_TITLE));
		String valuationType 	= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.VALUATION_TYPE));
		if("BooleanParameter".equals(dimension) || CharacteristicMasterConstants.ITF_SUBJECTIVE.equals(dimension) 
				|| dimension.contains(CharacteristicMasterConstants.formattedString)){
			valuationType="1";
		}
		String charCategory		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.CHARACTERISTIC_CATEGORY));
		String role 			= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.ROLE));
		String priority 		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.PRIORITY));
		String nominalValue 	= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.NOMINAL_VALUE));
		String minimalIncludedId= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.MINIMAL_INCLUDED_ID));
		String maximalIncludedId= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.MAXIMAL_INCLUDED_ID));
		String minValue 		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.MINIMAL_VALUE));
		String maxValue 		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.MAXIMAL_VALUE));
		String multivalueStr 		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.HIDDEN_MULTI_VALUE));
		String charNotes 		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.CHARACTERISTIC_NOTES));
		String measurementPrecision 	= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.MEASUREMENT_PRECISION));
		String missedTargetAction 		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.MISSED_TARGET_ACTION));
		String appliesToInProcess 		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.APPLIES_TO_INPROCESS));
		String appliesToBulk 			= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.APPLIES_TO_BULK));
		String appliesToFinalPackage 	= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.APPLIES_TO_FINALPACKAGE));
		
		/*EI8: OverwriteAllowedOnChild & Characteristic Description: Start*/
		String overwriteAllowedOnChild  = CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.OVERWRITE_ALLOWED_ON_CHILD));
		String characteristicDescription  = CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.CHARACTERISTIC_DESCRIPTION));
		/*EI8: OverwriteAllowedOnChild & Characteristic Description: End*/
		
		String characteristicsLowerSpecificationLimit  = CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.LOWER_SPECIFICATION_LIMIT));
		String characteristicsUpperSpecificationLimit  = CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.UPPER_SPECIFICATION_LIMIT));
		String characteristicsLowerRoutineReleaseLimit  = CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.LOWER_ROUTINE_RELEASE_LIMIT));
		String characteristicsUpperRoutineReleaseLimit  = CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.UPPER_ROUTINE_RELEASE_LIMIT));
		String externalTestMethod  = CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.EXTERNAL_TEST_METHOD ));
		
		String testMethod 		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.TEST_METHOD_OID));
		StringList testMethodIds = new StringList();
		if(UIUtil.isNotNullAndNotEmpty(testMethod)){
			String[] tmArray = testMethod.split(CharacteristicMasterConstants.PIPELINE_REQEXP);
			for(String str: tmArray)
				testMethodIds.add(str);
		}
		StringList multivalues = new StringList();
		if(UIUtil.isNotNullAndNotEmpty(multivalueStr)){
			String[] multiValueArray = multivalueStr.split(CharacteristicMasterConstants.PIPELINE_REQEXP);
			for(String str: multiValueArray){
				if(!str.equals(CharacteristicMasterConstants.SPACE_STRING) && !str.equals(CharacteristicMasterConstants.EMPTY_STRING))
					multivalues.add(str);
			}
		}
		boolean minIncluded = (UIUtil.isNotNullAndNotEmpty(minimalIncludedId) && minimalIncludedId.equals(CharacteristicMasterConstants.ON))?true:false;
		boolean maxIncluded = (UIUtil.isNotNullAndNotEmpty(maximalIncludedId) && maximalIncludedId.equals(CharacteristicMasterConstants.ON))?true:false;
    			
		//For color parameter
		/*if(CharacteristicMasterConstants.COLOR_PARAMETER.equals(dimension)
				&& displayUnit.equalsIgnoreCase(CharacteristicMasterConstants.RGB)){
			String redNominalValue		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.RED_NOMINAL_VALUE));
			String greenNominalValue	= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.GREEN_NOMINAL_VALUE));
			String blueNominalValue		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.BLUE_NOMINAL_VALUE));
			String redMinimalValue		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.RED_MINIMAL_VALUE));
			String greenMinimalValue	= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.GREEN_MINIMAL_VALUE));
			String blueMinimalValue		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.BLUE_MINIMAL_VALUE));
			String redMaximalValue		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.RED_MAXIMAL_VALUE));
			String greenMaximalValue	= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.GREEN_MAXIMAL_VALUE));
			String blueMaximalValue		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.BLUE_MAXIMAL_VALUE));	
							
			nominalValue = redNominalValue.concat(CharacteristicMasterConstants.COMMA).concat(greenNominalValue).concat(CharacteristicMasterConstants.COMMA).concat(blueNominalValue);
			minValue = redMinimalValue.concat(CharacteristicMasterConstants.COMMA).concat(greenMinimalValue).concat(CharacteristicMasterConstants.COMMA).concat(blueMinimalValue);
			maxValue = redMaximalValue.concat(CharacteristicMasterConstants.COMMA).concat(greenMaximalValue).concat(CharacteristicMasterConstants.COMMA).concat(blueMaximalValue);			
		}*/
		
    	if(UIUtil.isNullOrEmpty(name))
    		name = CharacteristicMasterConstants.EMPTY_STRING;
    			
    	String newCharMasterOID = ENOCharacteristicServices.createCharacteristicMaster(context, name, title, description, 
    			charTitle, dimension, displayUnit, valuationType, charCategory, role, priority,
    			nominalValue, minValue, maxValue, minIncluded, maxIncluded, multivalues, 
    			charNotes, measurementPrecision, missedTargetAction, 
    			Boolean.valueOf(appliesToInProcess), Boolean.valueOf(appliesToBulk), Boolean.valueOf(appliesToFinalPackage),
    			Boolean.valueOf(overwriteAllowedOnChild), characteristicDescription, testMethodIds);			// EI8: OverwriteAllowedOnChild & Characteristic Description
    	
    	
    	ENOICharacteristicMaster newCharMar = ENOCharacteristicFactory.getCharacteristicMasterById(context, newCharMasterOID);
		ENOICharacteristic newCharObj = newCharMar.getCharacteristic();
		
		newCharObj.setSpecificationLimits(characteristicsLowerSpecificationLimit, characteristicsUpperSpecificationLimit);
		newCharObj.setRoutineReleaseLimits(characteristicsLowerRoutineReleaseLimit, characteristicsUpperRoutineReleaseLimit);
		newCharObj.setExternalTestMethod(externalTestMethod);
		newCharObj.commit(context);
	 	
	 	HashMap<String, String> returnMap = new HashMap<String, String>();
	 	returnMap.put(DomainConstants.SELECT_ID, newCharMasterOID);
	 	StringList CharMasterOID = StringList.create(newCharMasterOID);
	 	
	 	/* B1R: Connecting Characteristic Master and Criteria, this code will execute only if you are creating CM under Criteria */
	 	if(UIUtil.isNotNullAndNotEmpty(paretOID) && CriteriaUtil.isKindOf(context, paretOID, ENOCriteriaEnum.Type.CRITERIA.get(context))) {
	 		ENOICriteria iCriteria = ENOCriteriaFactory.getCriteriaById(context, paretOID);
	 		iCriteria.addCriteriaOutput(context, CharMasterOID, false);
	 	}
	 	/* B1R: Connecting Characteristic Master and Criteria Ends*/
	 	return returnMap;
    	
    }

	@com.matrixone.apps.framework.ui.PostProcessCallable
	public void editCharacteristicMaster(Context context, String[] args) throws Exception {
		HashMap<?, ?> programMap = (HashMap<?, ?>)JPO.unpackArgs(args);
    	Map<?, ?> requestMap = (Map<?, ?>) programMap.get(CharacteristicMasterConstants.REQUEST_MAP);
    	
    	String objectId 		= (String) requestMap.get(CharacteristicMasterConstants.OBJECT_ID);
    	ENOICharacteristic charac = ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId).getCharacteristic();
    	IKweType dim = charac.getDimension(context);
    	    	
    	String desc 			= (String) requestMap.get(CharacteristicMasterConstants.DESCRIPTION);
    	String title 			= (String) requestMap.get(DomainConstants.ATTRIBUTE_TITLE);
    	String displayUnit 		= null;
    	if(CharacteristicMasterUtil.isObscureCharacteristic(context,dim))
			displayUnit 		= (String)requestMap.get(CharacteristicMasterConstants.DISPLAY_UNIT_TEXT_ID);
    	else
    		displayUnit 		= (String)requestMap.get(CharacteristicMasterConstants.DISPLAY_UNIT);
		/*if(UIUtil.isNullOrEmpty(displayUnit))
			displayUnit 		= (String)requestMap.get("DisplayUnitTextId");*/
		String charTitle		= (String) requestMap.get(CharacteristicMasterConstants.CHARACTERISTIC_TITLE);
		String charCategory 	= (String) requestMap.get(CharacteristicMasterConstants.CHARACTERISTIC_CATEGORY);
		String priority 		= (String) requestMap.get(CharacteristicMasterConstants.PRIORITY);
		String nominalValue 	= (String) requestMap.get(CharacteristicMasterConstants.NOMINAL_VALUE);
		String minimalIncludedId= (String) requestMap.get(CharacteristicMasterConstants.MINIMAL_INCLUDED_ID);
		String maximalIncludedId= (String) requestMap.get(CharacteristicMasterConstants.MAXIMAL_INCLUDED_ID);
		String minimalValue 	= (String) requestMap.get(CharacteristicMasterConstants.MINIMAL_VALUE);
		String maximalValue 	= (String) requestMap.get(CharacteristicMasterConstants.MAXIMAL_VALUE);
		String multivalueStr 		= (String) requestMap.get(CharacteristicMasterConstants.HIDDEN_MULTI_VALUE);
		String charNotes 		= (String) requestMap.get(CharacteristicMasterConstants.CHARACTERISTIC_NOTES);
		String measurementPrecision 	= (String) requestMap.get(CharacteristicMasterConstants.MEASUREMENT_PRECISION);
		String missedTargetAction 		= (String) requestMap.get(CharacteristicMasterConstants.MISSED_TARGET_ACTION);
		String appliesToInProcess 		= (String) requestMap.get(CharacteristicMasterConstants.APPLIES_TO_INPROCESS);
		String appliesToBulk 			= (String) requestMap.get(CharacteristicMasterConstants.APPLIES_TO_BULK);
		String appliesToFinalPackage 	= (String) requestMap.get(CharacteristicMasterConstants.APPLIES_TO_FINALPACKAGE);
		
		/*EI8: Overwrite Allowed On Child & Characteristic Description: Start*/
		String overwriteAllowedOnChild	= (String) requestMap.get(CharacteristicMasterConstants.OVERWRITE_ALLOWED_ON_CHILD);
		String characteristicDescription = (String) requestMap.get(CharacteristicMasterConstants.CHARACTERISTIC_DESCRIPTION);
		/*EI8: Overwrite Allowed On Child & Characteristic Description: End*/
		
		String lowerSpecificationLimit = (String) requestMap.get(CharacteristicMasterConstants.LOWER_SPECIFICATION_LIMIT);
		String upperSpecificationLimit = (String) requestMap.get(CharacteristicMasterConstants.UPPER_SPECIFICATION_LIMIT);
		String lowerRoutineReleaseLimit = (String) requestMap.get(CharacteristicMasterConstants.LOWER_ROUTINE_RELEASE_LIMIT);
		String upperRoutineReleaseLimit = (String) requestMap.get(CharacteristicMasterConstants.UPPER_ROUTINE_RELEASE_LIMIT);
		String externalTestMethod = (String) requestMap.get(CharacteristicMasterConstants.EXTERNAL_TEST_METHOD);
		
		String testMethod 		= (String) requestMap.get(CharacteristicMasterConstants.TEST_METHOD_OID);
		StringList testMethodIds = new StringList();
		if(UIUtil.isNotNullAndNotEmpty(testMethod)){
			String[] tmArray = testMethod.split(CharacteristicMasterConstants.PIPELINE_REQEXP);
			for(String str: tmArray)
				testMethodIds.add(str);
		}
		StringList multivalues = new StringList();
		if(UIUtil.isNotNullAndNotEmpty(multivalueStr)){
			String[] multiValueArray = multivalueStr.split(CharacteristicMasterConstants.PIPELINE_REQEXP);
			for(String str: multiValueArray){
				if(!str.equals(CharacteristicMasterConstants.SPACE_STRING) && !str.equals(CharacteristicMasterConstants.EMPTY_STRING))
					multivalues.add(str);
			}
		}
		boolean minIncluded = (UIUtil.isNotNullAndNotEmpty(minimalIncludedId) && minimalIncludedId.equals(CharacteristicMasterConstants.ON))?true:false;
		boolean maxIncluded = (UIUtil.isNotNullAndNotEmpty(maximalIncludedId) && maximalIncludedId.equals(CharacteristicMasterConstants.ON))?true:false;
    			
		//For color parameter
		/*if(charac.isInterfaceApplied(context, CharacteristicInterfaces.COLOR_CHARACTERISTIC.getInterface(context)) 
				&& displayUnit.equalsIgnoreCase(CharacteristicMasterConstants.RGB)){
			String redNominalValue		=(String) requestMap.get(CharacteristicMasterConstants.RED_NOMINAL_VALUE);
			String greenNominalValue	=(String) requestMap.get(CharacteristicMasterConstants.GREEN_NOMINAL_VALUE);
			String blueNominalValue		=(String) requestMap.get(CharacteristicMasterConstants.BLUE_NOMINAL_VALUE);
			String redMinimalValue		=(String) requestMap.get(CharacteristicMasterConstants.RED_MINIMAL_VALUE);
			String greenMinimalValue	=(String) requestMap.get(CharacteristicMasterConstants.GREEN_MINIMAL_VALUE);
			String blueMinimalValue		=(String) requestMap.get(CharacteristicMasterConstants.BLUE_MINIMAL_VALUE);
			String redMaximalValue		=(String) requestMap.get(CharacteristicMasterConstants.RED_MAXIMAL_VALUE);
			String greenMaximalValue	=(String) requestMap.get(CharacteristicMasterConstants.GREEN_MAXIMAL_VALUE);
			String blueMaximalValue		=(String) requestMap.get(CharacteristicMasterConstants.BLUE_MAXIMAL_VALUE);	
							
			nominalValue = redNominalValue.concat(CharacteristicMasterConstants.COMMA).concat(greenNominalValue).concat(CharacteristicMasterConstants.COMMA).concat(blueNominalValue);
			minimalValue = redMinimalValue.concat(CharacteristicMasterConstants.COMMA).concat(greenMinimalValue).concat(CharacteristicMasterConstants.COMMA).concat(blueMinimalValue);
			maximalValue = redMaximalValue.concat(CharacteristicMasterConstants.COMMA).concat(greenMaximalValue).concat(CharacteristicMasterConstants.COMMA).concat(blueMaximalValue);			
		}*/
		
		Map additionalAttributeDetails = new HashMap<String, String>();
        
		additionalAttributeDetails.put(ENOCharacteristicEnum.CharacteristicAttributes.LOWER_SPECIFICATION_LIMIT.getAttribute(context), lowerSpecificationLimit);
        additionalAttributeDetails.put(ENOCharacteristicEnum.CharacteristicAttributes.UPPER_SPECIFICATION_LIMIT.getAttribute(context), upperSpecificationLimit);
        additionalAttributeDetails.put(ENOCharacteristicEnum.CharacteristicAttributes.LOWER_ROUTINE_RELEASE_LIMIT.getAttribute(context), lowerRoutineReleaseLimit);
        additionalAttributeDetails.put(ENOCharacteristicEnum.CharacteristicAttributes.UPPER_ROUTINE_RELEASE_LIMIT.getAttribute(context), upperRoutineReleaseLimit);
        additionalAttributeDetails.put(ENOCharacteristicEnum.CharacteristicAttributes.EXTERNAL_TEST_METHOD.getAttribute(context), externalTestMethod);
		
		/*ENOCharacteristicServices.updateCharacteristicMaster(context,objectId, title, desc, charTitle, displayUnit, charCategory, null, priority, 
				nominalValue, minimalValue, maximalValue, minIncluded, maxIncluded, multivalues,
				charNotes, measurementPrecision, missedTargetAction, 
				Boolean.valueOf(appliesToInProcess), Boolean.valueOf(appliesToBulk), Boolean.valueOf(appliesToFinalPackage),
				Boolean.valueOf(overwriteAllowedOnChild), characteristicDescription, testMethodIds);*/			// EI8: Overwrite Allowed On Child & Characteristic Description
		
		// calling new update API to save attributes along with newly added attributes on edit Characteristic Master.
		ENOCharacteristicServices.updateCharacteristicMaster(context, objectId, title, desc, charTitle, displayUnit, charCategory, null, priority, 
				nominalValue, minimalValue, maximalValue, minIncluded, maxIncluded, multivalues, charNotes, measurementPrecision, missedTargetAction, 
				Boolean.valueOf(appliesToInProcess), Boolean.valueOf(appliesToBulk), Boolean.valueOf(appliesToFinalPackage),
				Boolean.valueOf(overwriteAllowedOnChild), characteristicDescription, testMethodIds, additionalAttributeDetails);
	   
	}
	
	@com.matrixone.apps.framework.ui.CreateProcessCallable
    public HashMap<String, String> copyCharacteristicMaster(Context context, String[] args) throws Exception{
		HashMap<?, ?> programMap = (HashMap<?, ?>)JPO.unpackArgs(args);
		Map<?, ?> requestValuesMap = (Map<?, ?>) programMap.get(CharacteristicMasterConstants.REQUEST_VALUES_MAP);    	
    	String paretOID			= (String) programMap.get(CharacteristicMasterConstants.OBJECT_ID);
    	String name				= (String) programMap.get(CharacteristicMasterConstants.NAME);
    	String description 		= (String) programMap.get(CharacteristicMasterConstants.DESCRIPTION);
    	String title 			= (String) programMap.get(DomainConstants.ATTRIBUTE_TITLE);
    	ENOICharacteristic charac = ENOCharacteristicFactory.getCharacteristicMasterById(context, paretOID).getCharacteristic();
		String dimension = charac.getDimension();
		String displayUnit 		= null;    	
    	if(CharacteristicMasterUtil.isObscureCharacteristic(context,charac.getDimension(context)))
    		displayUnit 		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.DISPLAY_UNIT_TEXT_ID));
    	else
    		displayUnit 		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.DISPLAY_UNIT));
		/*if(UIUtil.isNullOrEmpty(displayUnit))
			displayUnit 		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get("DisplayUnitTextId"));*/
		String charTitle		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.CHARACTERISTIC_TITLE));
		String charCategory		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.CHARACTERISTIC_CATEGORY));
		String role 			= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.ROLE));
		String priority 		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.PRIORITY));
		String nominalValue 	= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.NOMINAL_VALUE));
		String minimalIncludedId= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.MINIMAL_INCLUDED_ID));
		String maximalIncludedId= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.MAXIMAL_INCLUDED_ID));
		String minValue 		= CharacteristicMasterUtil.getSecondValueFromArray(requestValuesMap.get(CharacteristicMasterConstants.MINIMAL_VALUE));
		String maxValue 		= CharacteristicMasterUtil.getSecondValueFromArray(requestValuesMap.get(CharacteristicMasterConstants.MAXIMAL_VALUE));
		String multivalueStr		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.HIDDEN_MULTI_VALUE));
		String charNotes 		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.CHARACTERISTIC_NOTES));
		String measurementPrecision 	= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.MEASUREMENT_PRECISION));
		String missedTargetAction 		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.MISSED_TARGET_ACTION));
		String appliesToInProcess 		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.APPLIES_TO_INPROCESS));
		String appliesToBulk 			= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.APPLIES_TO_BULK));
		String appliesToFinalPackage 	= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.APPLIES_TO_FINALPACKAGE));
		
		/*EI8: Overwrite Allowed On Child & Characteristic Description: Start*/
		String overwriteAllowedOnChild  = CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.OVERWRITE_ALLOWED_ON_CHILD));
		String characteristicDescription  = CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.CHARACTERISTIC_DESCRIPTION));
		/*EI8: Overwrite Allowed On Child & Characteristic Description: End*/
		
		String characteristicsLowerSpecificationLimit  = CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.LOWER_SPECIFICATION_LIMIT));
		String characteristicsUpperSpecificationLimit  = CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.UPPER_SPECIFICATION_LIMIT));
		String characteristicsLowerRoutineReleaseLimit  = CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.LOWER_ROUTINE_RELEASE_LIMIT));
		String characteristicsUpperRoutineReleaseLimit  = CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.UPPER_ROUTINE_RELEASE_LIMIT));
		String externalTestMethod  = CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.EXTERNAL_TEST_METHOD ));
		
		String testMethod 		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.TEST_METHOD_OID));
		StringList testMethodIds = new StringList();
		if(UIUtil.isNotNullAndNotEmpty(testMethod)){
			String[] tmArray = testMethod.split(CharacteristicMasterConstants.PIPELINE_REQEXP);
			for(String str: tmArray)
				testMethodIds.add(str);
		}
		
		StringList multivalues = new StringList();
		if(UIUtil.isNotNullAndNotEmpty(multivalueStr)){
			String[] multiValueArray = multivalueStr.split(CharacteristicMasterConstants.PIPELINE_REQEXP);
			for(String str: multiValueArray){
				if(!str.equals(CharacteristicMasterConstants.SPACE_STRING) && !str.equals(CharacteristicMasterConstants.EMPTY_STRING))
					multivalues.add(str);
			}
		}
		
		boolean minIncluded = (UIUtil.isNotNullAndNotEmpty(minimalIncludedId) && minimalIncludedId.equals(CharacteristicMasterConstants.ON))?true:false;
		boolean maxIncluded = (UIUtil.isNotNullAndNotEmpty(maximalIncludedId) && maximalIncludedId.equals(CharacteristicMasterConstants.ON))?true:false;
    		

		String valuationType = charac.getCharacteristicValuationType();
		//For color parameter
		/*if(charac.isInterfaceApplied(context, CharacteristicInterfaces.COLOR_CHARACTERISTIC.getInterface(context))
				&& displayUnit.equalsIgnoreCase(CharacteristicMasterConstants.RGB)){
			String redNominalValue		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.RED_NOMINAL_VALUE));
			String greenNominalValue	= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.GREEN_NOMINAL_VALUE));
			String blueNominalValue		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.BLUE_NOMINAL_VALUE));
			String redMinimalValue		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.RED_MINIMAL_VALUE));
			String greenMinimalValue	= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.GREEN_MINIMAL_VALUE));
			String blueMinimalValue		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.BLUE_MINIMAL_VALUE));
			String redMaximalValue		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.RED_MAXIMAL_VALUE));
			String greenMaximalValue	= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.GREEN_MAXIMAL_VALUE));
			String blueMaximalValue		= CharacteristicMasterUtil.arrayToString(requestValuesMap.get(CharacteristicMasterConstants.BLUE_MAXIMAL_VALUE));	
							
			nominalValue = redNominalValue.concat(CharacteristicMasterConstants.COMMA).concat(greenNominalValue).concat(CharacteristicMasterConstants.COMMA).concat(blueNominalValue);
			minValue = redMinimalValue.concat(CharacteristicMasterConstants.COMMA).concat(greenMinimalValue).concat(CharacteristicMasterConstants.COMMA).concat(blueMinimalValue);
			maxValue = redMaximalValue.concat(CharacteristicMasterConstants.COMMA).concat(greenMaximalValue).concat(CharacteristicMasterConstants.COMMA).concat(blueMaximalValue);			
		}*/
		
    	if(UIUtil.isNullOrEmpty(name))
    		name = CharacteristicMasterConstants.EMPTY_STRING;
				
    	//String newCharMasterOID = ENOCharacteristicServices.copyCharacteristicMaster(context, paretOID);
    	String newCharMasterOID = ENOCharacteristicServices.createCharacteristicMaster(context, name, title, description, charTitle, 
    							dimension, displayUnit, valuationType, charCategory, role, priority, 
    							nominalValue, minValue, maxValue, minIncluded, maxIncluded, multivalues, 
    							charNotes, measurementPrecision, missedTargetAction, 
    							Boolean.valueOf(appliesToInProcess), Boolean.valueOf(appliesToBulk), Boolean.valueOf(appliesToFinalPackage),
                                Boolean.parseBoolean(overwriteAllowedOnChild), characteristicDescription, testMethodIds);		// EI8: Overwrite Allowed On Child & Characteristic Description
    	    	
    	
    /*	ENOICharacteristicMaster charMaster= ENOCharacteristicFactory.getCharacteristicMasterById(context, newCharMasterOID);
    	
    	charMaster.setEditMode(true);

    	if(UIUtil.isNotNullAndNotEmpty(name))
    		charMaster.setName(context, name);
		charMaster.setCharacteristicMasterTitle(context,title)
		.setCharacteristicMasterDescription(description)
		.setCharacteristicTitle(context,charTitle)
		.setDisplayUnit(context,displayUnit)
		.setRole(context,role)
		.setPriority(context,priority)
		.setCharacteristicValues(nominalValue, minValue, maxValue, minIncluded, maxIncluded,multivalues)
		.setCharacteristicNotes(charNotes)
		.setMissedTargetAction(missedTargetAction)
		.setMeasurementPrecision(measurementPrecision)
		.setAppliesToInProcess(Boolean.valueOf(appliesToInProcess))
		.setAppliesToBulk(Boolean.valueOf(appliesToBulk))
		.setAppliesToFinalPackage(Boolean.valueOf(appliesToFinalPackage))
		.commit(context);
		
		charMaster.connectTestMethod(context, testMethodIds);*/
    	
    	ENOICharacteristicMaster newCharMar = ENOCharacteristicFactory.getCharacteristicMasterById(context, newCharMasterOID);
		ENOICharacteristic newCharObj = newCharMar.getCharacteristic();
		
		newCharObj.setSpecificationLimits(characteristicsLowerSpecificationLimit, characteristicsUpperSpecificationLimit);
		newCharObj.setRoutineReleaseLimits(characteristicsLowerRoutineReleaseLimit, characteristicsUpperRoutineReleaseLimit);
		newCharObj.setExternalTestMethod(externalTestMethod);
		newCharObj.commit(context);
    	
	 	HashMap<String, String> returnMap = new HashMap<String, String>();
	 	returnMap.put(DomainConstants.SELECT_ID, newCharMasterOID);
	 	return returnMap;
	}
	/**
	 * This trigger is invoked on delete of Characteristic Master to delete Characteristic associated with it.
	 * @param context eMatrix <code>Context</code> object
	 * @param jpoArgs
	 * @return
	 * @throws Exception
	 */	
	public void deleteAssociatedCharacteristic(Context context, String [] jpoArgs) throws Exception{
		try {
			Object []args = {context, jpoArgs[0]};
			Class<?> []argClass = {matrix.db.Context.class, String.class};
			
			Class<?> cmServiceClass = ENOCharacteristicMasterBase_mxJPO.class.getClassLoader().loadClass(serviceClass);
			cmServiceClass.getMethod("deleteAssociatedCharacteristic", argClass).invoke(null, args);
		} catch (Exception ex) {
			throw new FrameworkException(ex.getLocalizedMessage());
		}
	}	 
		
   /**
	 * This method is to Obsolete the previous revision of Characteristic Master when the current revision is Released
	 * @param context eMatrix <code>Context</code> object
	 * @param jpoArgs
	 * @throws Exception
	 */
	public void obsoletePreviousRevision(Context context, String[] jpoArgs) throws Exception {
		try {
			Object []args = {context, jpoArgs[0]};
			Class<?> []argClass = {matrix.db.Context.class, String.class};
			
			Class<?> cmServiceClass = ENOCharacteristicMasterBase_mxJPO.class.getClassLoader().loadClass(serviceClass);
			cmServiceClass.getMethod("obsoletePreviousRevision", argClass).invoke(null, args);
		} catch (Exception e) {
			throw new FrameworkException(e.getMessage());
		}
	}
	
   /**
	 * This method is to replicate the Criteia Output Relationship when we revise the Characteristic Master only if criteria is not in Obsolete state.
	 * @param context eMatrix <code>Context</code> object
	 * @param jpoArgs
	 * @throws Exception
	 */
	public void replicateCriteiaOutputRelationshipOnRevise(Context context, String[] jpoArgs) throws Exception {
		try {
			Object []args = {context, jpoArgs[0]};
			Class<?> []argClass = {matrix.db.Context.class, String.class};
			
			Class<?> critServiceClass = ENOCharacteristicMasterBase_mxJPO.class.getClassLoader().loadClass(serviceClass);
			critServiceClass.getMethod("replicateCriteiaOutputRelationshipOnRevise", argClass).invoke(null, args);
		} catch (Exception ex) {
			throw new FrameworkException(ex.getMessage());
		}
	}
	
	public int checkForObsoleteTestMethod(Context context, String[] args) throws Exception {
		try {
			String cmId = args[0];		
			
			ENOICharacteristicMaster charMaster = new CharacteristicMasterIMPL(context, cmId);
			ENOICharacteristic charObj = charMaster.getCharacteristic();
			String plmparaID = charObj.getId(context);
		
			ENOICharacteristic characteristic = new CharacteristicIMPL(context,plmparaID, true);
			MapList relatedObjects = characteristic.getConnectedTestMethods(context);
						
			Iterator<?> itr = relatedObjects.iterator();
			while(itr.hasNext()){
				Map map = (Map) itr.next();
		   
		    	String tmStateName = (String) map.get(CharacteristicMasterConstants.SELECT_CURRENT);
		    		    
		    	if(ENOCharacteristicEnum.CharacteristicStates.CHARACTERISTIC_MASTER_OBSOLETE.getState(context, ENOCharacteristicEnum.CharacteristicPolicy.CHARACTERISTIC_MASTER.getPolicy(context)).equals(tmStateName)) {

					String[] typeNameRev = new String []{(String) map.get(DomainConstants.SELECT_TYPE),(String) map.get(DomainConstants.SELECT_NAME),(String) map.get(DomainConstants.SELECT_REVISION)};  		
		    		String waringmsg = MessageUtil.getMessage(context, null, "CharacteristicMaster.Alert.ObsoleteTestMethod", typeNameRev, null, context.getLocale(), CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE);
		    		
		    		emxContextUtilBase_mxJPO.mqlNotice(context, waringmsg);
		    		return 1;
		    	}			    	
			}
			
		} catch(Exception ex) {
			throw new FrameworkException(ex.getMessage());
		}
		return 0;
	}
	 
}

