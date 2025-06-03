/*
**   ${CLASSNAME}.java
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


import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Vector;
import java.util.stream.Collectors;

import com.dassault_systemes.enovia.characteristic.impl.CharacteristicServices;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicEnum;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicEnum.CharacteristicAttributes;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicEnum.CharacteristicInterfaces;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicEnum.CharacteristicPolicy;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicEnum.CharacteristicRelationships;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicEnum.CharacteristicStates;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicFactory;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicServices;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOICharacteristic;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOICharacteristicMaster;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOICharacteristicsUtil;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOIParameterAggregation;
import com.dassault_systemes.enovia.characteristic.util.CharacteristicMasterConstants;
import com.dassault_systemes.enovia.characteristic.util.CharacteristicMasterUtil;
import com.dassault_systemes.enovia.criteria.interfaces.ENOCriteriaEnum;
import com.dassault_systemes.enovia.criteria.interfaces.ENOCriteriaFactory;
import com.dassault_systemes.enovia.criteria.interfaces.ENOICriteria;
import com.dassault_systemes.enovia.criteria.ui.CriteriaUI;
import com.dassault_systemes.enovia.criteria.util.CriteriaConstants;
import com.dassault_systemes.enovia.criteria.util.CriteriaUtil;
import com.dassault_systemes.knowledge_itfs.IKweDictionary;
import com.dassault_systemes.knowledge_itfs.KweInterfacesServices;
import com.dassault_systemes.parameter_interfaces.IPlmParameterUtilities;
import com.dassault_systemes.parameter_interfaces.ParameterInterfacesServices;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.domain.util.XSSUtil;
import com.matrixone.apps.framework.ui.UIUtil;

import matrix.db.AttributeType;
import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;


public class ENOCharacteristicMasterUIBase_mxJPO
{

    /**
     *
     * @param context the eMatrix <code>Context</code> object
     * @param args holds no arguments
     * @throws Exception if the operation fails
     * @version Common 10.5.1.2
     * @grade 0
     */
    public ENOCharacteristicMasterUIBase_mxJPO (Context context, String[] args)
        throws Exception
    {
    }
    	
    final static String UNCHECKED = "unchecked";
    final static String RAWTYPES = "rawtypes";
    private static final String serviceClass = "com.dassault_systemes.enovia.characteristic.impl.CharacteristicServices";

	public HashMap<String, StringList> getParameterDimension(Context context, String[] args) throws Exception
	{
		HashMap<String, StringList> returnMap  = new HashMap<String, StringList>();
		
		try {
			ENOICharacteristicsUtil charUtil = ENOCharacteristicFactory.getCharacteristicUtil(context);
			returnMap =  charUtil.getDimensions(context);			
		}
		catch (Exception e) {
			throw e;
		}
		
		return returnMap;
	}
	

	public HashMap<String, StringList> getMeasurementPrecisionRanges(Context context, String[] args) throws Exception
	{
		HashMap<String, StringList> returnMap  = new HashMap<String, StringList>();
		
		try {
			AttributeType attributeType = new AttributeType(CharacteristicAttributes.MEASUREMENT_PRECISION.getAttribute(context));
	         attributeType.open(context);
	         StringList attributeRangeChoices = attributeType.getChoices();
	         attributeType.close(context);
	         	         
			returnMap.put(CharacteristicMasterConstants.FIELD_CHOICES,attributeRangeChoices);
			returnMap.put(CharacteristicMasterConstants.FIELD_DISPLAY_CHOICES,attributeRangeChoices);
		}
		catch (Exception e) {
			throw e;
		}
		
		return returnMap;
	}
	
	public HashMap<String, StringList> getMandatoryCharacteristcRanges(Context context, String[] args) throws Exception
	{
		HashMap<String, StringList> returnMap  = new HashMap<String, StringList>();
		
		try {
			String attrName = CharacteristicAttributes.MANDATORY_CHARACTERISTIC.getAttribute(context);
			AttributeType attributeType = new AttributeType(attrName);
	         attributeType.open(context);
	         StringList attributeRangeChoices = attributeType.getChoices();
	         attributeType.close(context);
	         	         
			returnMap.put(CharacteristicMasterConstants.FIELD_CHOICES,attributeRangeChoices);
			returnMap.put(CharacteristicMasterConstants.FIELD_DISPLAY_CHOICES,EnoviaResourceBundle.getAttrRangeI18NStringList(context, 
					attrName, attributeRangeChoices, context.getSession().getLanguage()));
		}
		catch (Exception e) {
			throw e;
		}
		
		return returnMap;
	}
	
	public void setMandatoryCharacteristic(Context context, String args[]) throws Exception{
		HashMap<?, ?> programMap	= (HashMap<?, ?>)JPO.unpackArgs(args);
		HashMap<?, ?> paramMap 		= (HashMap<?, ?>) programMap.get(CharacteristicMasterConstants.PARAM_MAP);
		String newValue				= (String) paramMap.get(CharacteristicMasterConstants.NEW_VALUE);
		String cmOID				= (String)paramMap.get(CharacteristicMasterConstants.REL_ID);
		
		DomainRelationship.setAttributeValue(context, cmOID, CharacteristicAttributes.MANDATORY_CHARACTERISTIC.getAttribute(context), newValue);
	}

	public HashMap<String, StringList> getMissedTargetActionRanges(Context context, String[] args) throws Exception
	{
		HashMap<String, StringList> returnMap  = new HashMap<String, StringList>();
		
		try {
			StringList attrDisplayChoices = new StringList();
			AttributeType attributeType = new AttributeType(CharacteristicAttributes.MISSED_TARGET_ACTION.getAttribute(context));
	         attributeType.open(context);
	         StringList attributeRangeChoices = attributeType.getChoices();
	         attributeType.close(context);
	         String language = context.getSession().getLanguage();
	         
	         Object[] choices = attributeRangeChoices.toArray();
	 		
	     	for( Object choice : choices){
	     		String range = (String)choice;
	     		range = range.replace(" ", "");
	     		attrDisplayChoices.addElement(EnoviaResourceBundle.getProperty(context, CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE, new Locale(language),"CharacteristicMaster.Range.".concat(range)));
	     	}
	         
			returnMap.put(CharacteristicMasterConstants.FIELD_CHOICES,attributeRangeChoices);
			returnMap.put(CharacteristicMasterConstants.FIELD_DISPLAY_CHOICES,attrDisplayChoices);
		}
		catch (Exception e) {
			throw e;
		}
		
		return returnMap;
	}
	
  public HashMap<String, StringList> getValuationType(Context context, String[] args) throws Exception{
	  	HashMap<String, StringList> returnMap  = new HashMap<String, StringList>();
    	StringList strDisplayChoices = new StringList();
    	String strValType =  EnoviaResourceBundle.getProperty(context,"CharacteristicMaster.ValuationType");
    	String[] valTypeArray  = strValType.split(",");
    	StringList valTypeChoices = new StringList();
    	String language = context.getSession().getLanguage();
		
    	for( String valType: valTypeArray){
    		valTypeChoices.addElement(valType);
    		strDisplayChoices.addElement(EnoviaResourceBundle.getProperty(context, CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE, new Locale(language),"CharacteristicMaster.ValuationType.".concat(valType)));
    	}
    	

		returnMap.put(CharacteristicMasterConstants.FIELD_CHOICES,valTypeChoices);
		returnMap.put(CharacteristicMasterConstants.FIELD_DISPLAY_CHOICES,strDisplayChoices);
    	
    	return returnMap;    	
    }
	 
    
  public HashMap<String, StringList> getDisplayUnit(Context context, String[] args) throws Exception{
	  HashMap<String, StringList> returnMap = new HashMap<String, StringList>();
	   try {
			IKweDictionary kweDico = KweInterfacesServices.getKweDictionary();
			
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			HashMap requestMap = (HashMap) programMap.get(CharacteristicMasterConstants.REQUEST_MAP);
			String dimension;
			
			String mode = (String) requestMap.get(CharacteristicMasterConstants.MODE);
			
			
			StringList strItfList =  CharacteristicMasterUtil.getDefaultMagnitude(context); //Gets default PLMParameter magnitudes
			//strItfList.add(CharacteristicMasterConstants.COLOR_PARAMETER);
			//strItfList.add(CharacteristicMasterConstants.SUBJECTIVE_PARAMETER);
			Object[] itfList  = strItfList.toArray();
			
			dimension = kweDico.findType(context, String.valueOf(itfList[0])).getName();
			if(UIUtil.isNotNullAndNotEmpty(mode) && mode.equals(CharacteristicMasterConstants.EDIT)){
				String charMasterId = (String)requestMap.get(CharacteristicMasterConstants.OBJECT_ID);
				ENOICharacteristic iChar =ENOCharacteristicFactory.getCharacteristicMasterById(context, charMasterId).getCharacteristic();
				/*if(iChar.isInterfaceApplied(context, CharacteristicInterfaces.COLOR_CHARACTERISTIC.getInterface(context))){
					dimension = CharacteristicMasterConstants.COLOR_PARAMETER;
				}else{*/
					dimension = iChar.getDimension(context).getName();
				
				//}				
			}
						
			/*IKweUnit prefUnit = ParameterInterfacesServices.getPreferredUnit(context, dim);
			if (prefUnit != null)
			{
				currentDisplayUnit = prefUnit.getSymbol();
			}*/

			ENOICharacteristicsUtil charUtil = ENOCharacteristicFactory.getCharacteristicUtil(context);
			Map values = (Map) charUtil.getDisplayUnitsForDimension(context,dimension);
			StringList actualValues = (StringList) values.get(CharacteristicMasterConstants.ACTUAL_VALUE);
			StringList displayValues = (StringList) values.get(CharacteristicMasterConstants.DISPLAY_VALUE);
			if(actualValues.isEmpty()){
				  actualValues.add(CharacteristicMasterConstants.EMPTY_STRING);
				  displayValues.add(CharacteristicMasterConstants.EMPTY_STRING);
			 }
			returnMap.put(CharacteristicMasterConstants.FIELD_CHOICES,actualValues);
			returnMap.put(CharacteristicMasterConstants.FIELD_DISPLAY_CHOICES,displayValues);

	  }
		catch (Exception e) {
			throw e;
		}
		
	  return returnMap;
  }
  
  @SuppressWarnings(RAWTYPES)
  @com.matrixone.apps.framework.ui.ProgramCallable
public HashMap reloadDisplayUnit(Context context, String[] args) throws Exception {
	  HashMap<String, StringList> returnMap = new HashMap<String, StringList>();
	  try{
		  String dimSelected;
		  HashMap programMap = (HashMap)JPO.unpackArgs(args);
		  HashMap requestMap = (HashMap) programMap.get(CharacteristicMasterConstants.REQUEST_MAP);
		  String mode=(String) requestMap.get(CharacteristicMasterConstants.MODE);
		  if(CharacteristicMasterConstants.EDIT.equals(mode)){			  
			 HashMap fieldValues = (HashMap) programMap.get(CharacteristicMasterConstants.FIELD_VALUES);
			 dimSelected = (String) fieldValues.get(CharacteristicMasterConstants.DIMENSION_HIDDEN);			 
		  }else{
			  HashMap fieldMap = (HashMap) programMap.get(CharacteristicMasterConstants.FIELD_VALUES);
			  dimSelected = (String) fieldMap.get(CharacteristicMasterConstants.DIMENSION);
		  }
		 
		  ENOICharacteristicsUtil charUtil = ENOCharacteristicFactory.getCharacteristicUtil(context);
		  Map values = (Map) charUtil.getDisplayUnitsForDimension(context, dimSelected);
		  StringList actualValues = (StringList) values.get(CharacteristicMasterConstants.ACTUAL_VALUE);
		  StringList displayValues = (StringList) values.get(CharacteristicMasterConstants.DISPLAY_VALUE);
		  if(actualValues.isEmpty()){
			  actualValues.add(CharacteristicMasterConstants.EMPTY_STRING);
			  displayValues.add(CharacteristicMasterConstants.EMPTY_STRING);
		 }
		  returnMap.put(CharacteristicMasterConstants.RANGE_VALUES,actualValues);
		  returnMap.put(CharacteristicMasterConstants.RANGE_DISPLAY_VALUES,displayValues);

	  }
	  catch (Exception e) {
		  throw e;
	  }
	  return returnMap;
  }
  public void updateValue(Context context, String[] args) throws FrameworkException {
	}
  
  private String getObjectId(Map programMap){
		Map paramMap		=(Map)programMap.get(CharacteristicMasterConstants.PARAM_MAP);
		String objectId 	= (String)paramMap.get(CharacteristicMasterConstants.OBJECT_ID);
		if(UIUtil.isNullOrEmpty(objectId)){
			Map requestMap		=(Map)programMap.get(CharacteristicMasterConstants.REQUEST_MAP);
			objectId 	= (String)requestMap.get(CharacteristicMasterConstants.OBJECT_ID);
		}
		return objectId;
  }
	  
  @SuppressWarnings({ RAWTYPES, UNCHECKED })
public HashMap<String, StringList> getBooleanCombo(Context context, String[] args) throws Exception{
	  	HashMap<String, StringList> returnMap  = new HashMap<String, StringList>();
	  	StringList strChoices = new StringList();
	  	strChoices.addElement(CharacteristicMasterConstants.TRUE);
	  	strChoices.addElement(CharacteristicMasterConstants.FALSE);
    	StringList strDisplayChoices = new StringList();
    	
    	String language = context.getSession().getLanguage();
    	
    	Object[] choices = strChoices.toArray();
    	for(Object choice: choices){
    		strDisplayChoices.addElement(EnoviaResourceBundle.getProperty(context, CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE, new Locale(language),"CharacteristicMaster.Boolean.".concat(String.valueOf(choice))));
    	}    	
		returnMap.put(CharacteristicMasterConstants.FIELD_CHOICES,strChoices);
		returnMap.put(CharacteristicMasterConstants.FIELD_DISPLAY_CHOICES,strDisplayChoices);
    	
    	return returnMap;    	
    }

  @com.matrixone.apps.framework.ui.ProgramCallable
  public static MapList getDerivedCharacteristics(Context context, String[] args) throws Exception {

	  Map<?, ?> programMap = JPO.unpackArgs(args);
	  String objectId = (String) programMap.get(CharacteristicMasterConstants.OBJECT_ID);

	  ENOICharacteristicMaster icharacteristicMaster = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId);
	  MapList returnList = icharacteristicMaster.getWhereUsedData(context);
	  
	  return returnList;
  }
  

  	@SuppressWarnings("unchecked")
	@com.matrixone.apps.framework.ui.ProgramCallable
  	public static MapList getMyDeskCharacteristicMasters(Context context, String[] args) throws Exception {
  		MapList mpReturnList = new MapList();
  		MapList mpCharacteristicMasters= new MapList();
  		Map<?, ?> programMap = (HashMap<?, ?>)JPO.unpackArgs(args);
	  	String objectId  = (String)programMap.get(CharacteristicMasterConstants.OBJECT_ID);

	  	String whereExpression =  CharacteristicMasterConstants.EMPTY_STRING;
	  	StringList objSelects = new StringList(DomainConstants.SELECT_ID);
	  	objSelects.add(CharacteristicMasterConstants.MASTER_TO_CHARACTERISTIC_SELECTABLE+CharacteristicMasterConstants.SELECT_ID);
	  	objSelects.add(CriteriaUtil.stringConcat(CharacteristicMasterConstants.MASTER_TO_CHARACTERISTIC_SELECTABLE, "interface[", ENOCharacteristicEnum.CharacteristicInterfaces.OBSCURE_CHARACTERISTIC.getInterface(context), "]"));
	  	objSelects.add(CriteriaUtil.stringConcat(CharacteristicMasterConstants.MASTER_TO_CHARACTERISTIC_SELECTABLE, DomainConstants.SELECT_TYPE));
	  	objSelects.add(CriteriaUtil.stringConcat(CharacteristicMasterConstants.MASTER_TO_CHARACTERISTIC_SELECTABLE, ENOCharacteristicEnum.CharacteristicAttributes.OBSCURE_UNIT_OF_MEASURE.getAttributeSelect(context)));
	  	objSelects.add(CharacteristicMasterConstants.MASTER_TO_CHARACTERISTIC_SELECTABLE+CharacteristicAttributes.LOWER_SPECIFICATION_LIMIT.getAttributeSelect(context));
	  	objSelects.add(CharacteristicMasterConstants.MASTER_TO_CHARACTERISTIC_SELECTABLE+CharacteristicAttributes.UPPER_SPECIFICATION_LIMIT.getAttributeSelect(context));
	  	objSelects.add(CharacteristicMasterConstants.MASTER_TO_CHARACTERISTIC_SELECTABLE+CharacteristicAttributes.LOWER_ROUTINE_RELEASE_LIMIT.getAttributeSelect(context));
	  	objSelects.add(CharacteristicMasterConstants.MASTER_TO_CHARACTERISTIC_SELECTABLE+CharacteristicAttributes.UPPER_ROUTINE_RELEASE_LIMIT.getAttributeSelect(context));
	  	objSelects.add(CharacteristicMasterConstants.MASTER_TO_CHARACTERISTIC_SELECTABLE+ENOCharacteristicEnum.CharacteristicType.CHARACTERISTIC.getSelectableForType(context));
	  	
	  	//String  person = PersonUtil.getDefaultSecurityContext(context);
	  	if(UIUtil.isNotNullAndNotEmpty(objectId)){
			ENOICriteria iCriteria = ENOCriteriaFactory.getCriteriaById(context, objectId);
			mpCharacteristicMasters = iCriteria.getCriteriaOutput(context, objSelects, whereExpression);
			CriteriaUI.updateCustomStyleForIsMandatoryField(context, mpCharacteristicMasters);
		} else {
			String filter = (String) programMap.get(CharacteristicMasterConstants.MY_DESK_CM_CUSTOM_FILTER);
			String contextUser= context.getUser();
			/*Show only Masters owned by current user.*/
			StringBuilder sb= new StringBuilder(CharacteristicMasterConstants.OWNER);
		  	sb.append(CharacteristicMasterConstants.IS_EQUAL)
		  	.append(CharacteristicMasterConstants.SINGLE_QUOTE_REGEX)
	  		.append(contextUser)
	  		.append(CharacteristicMasterConstants.SINGLE_QUOTE_REGEX);
		  	/*Show only active Masters with the "Active" filter*/
		  	if (!filter.equals(CharacteristicMasterConstants.ALL)){
		  		sb.append(CharacteristicMasterConstants.AND)
		  		.append(CharacteristicMasterConstants.CURRENT)
		  		.append(CharacteristicMasterConstants.IS_NOT_EQUAL)
		  		.append(CharacteristicStates.CHARACTERISTIC_MASTER_OBSOLETE.getState(context, CharacteristicPolicy.CHARACTERISTIC_MASTER.getPolicy(context)))
		  		.append(CharacteristicMasterConstants.AND)
		  		.append(CharacteristicMasterConstants.CURRENT)
		  		.append(CharacteristicMasterConstants.IS_NOT_EQUAL)
		  		.append(CharacteristicStates.CHARACTERISTIC_MASTER_RELEASE.getState(context, CharacteristicPolicy.CHARACTERISTIC_MASTER.getPolicy(context)));
		  	}
		whereExpression = sb.toString();
		  	ENOICharacteristicsUtil charUtil = ENOCharacteristicFactory.getCharacteristicUtil(context);
		  	StringList multiSelects = new StringList();
		  	multiSelects.add("to[".concat(ENOCriteriaEnum.Relationship.CRITERIA_OUTPUT.get(context).concat("].from.").concat(DomainConstants.SELECT_NAME)));
		  	multiSelects.add("to[".concat(ENOCriteriaEnum.Relationship.CRITERIA_OUTPUT.get(context).concat("].from.").concat(DomainConstants.SELECT_ID)));
		  	StringList objectSelects= StringList.create(CharacteristicMasterConstants.SELECT_ID, 
					CharacteristicAttributes.CHARACTERISTIC_TITLE.getAttributeSelect(context),//"attribute[Title]", 
		  			CharacteristicMasterConstants.SELECT_NAME, 
		  			CharacteristicMasterConstants.SELECT_REVISION, 
		  			CharacteristicMasterConstants.SELECT_CURRENT, 
		  			CharacteristicMasterConstants.SELECT_DESCRIPTION,
		  			"to[".concat(ENOCriteriaEnum.Relationship.CRITERIA_OUTPUT.get(context).concat("].from.").concat(DomainConstants.SELECT_NAME)),
		  			"to[".concat(ENOCriteriaEnum.Relationship.CRITERIA_OUTPUT.get(context).concat("].from.").concat(DomainConstants.SELECT_ID)),
		  			CharacteristicMasterConstants.MASTER_TO_CHARACTERISTIC_SELECTABLE+CharacteristicMasterConstants.SELECT_ID,//"from[ParameterAggregation].to.id",
		  			CharacteristicMasterConstants.MASTER_TO_CHARACTERISTIC_SELECTABLE+CharacteristicAttributes.TITLE.getAttributeSelect(context),//"from[ParameterAggregation].to.attribute[Title]",
		  			"from[ParameterAggregation].to.attribute[Characteristic Category]");
		  	objSelects.addAll(objectSelects);
		  	mpCharacteristicMasters = charUtil.findCharacteristicMasters(context, objSelects, multiSelects, whereExpression);
		}
	  	List<String> slCharacteristicMasterIds= new ArrayList();
	  	//Collect all the Ids from the found objects into a StringList to do a getInfo.
	  	slCharacteristicMasterIds=  (List<String>) mpCharacteristicMasters.parallelStream().map(m->((Map) m).get("id")).collect(Collectors.toList());
	  	String[] arrayCharacteristicMasterIds= new String[slCharacteristicMasterIds.size()];
	  	arrayCharacteristicMasterIds= slCharacteristicMasterIds.toArray(arrayCharacteristicMasterIds);
	  	//mlCharacteristicMasterDetails= DomainObject.getInfo(context, arrayCharacteristicMasterIds, objectSelects);
	  	List<Map<String, Object>> mlParamValues= new ArrayList<Map<String, Object>>();
	  	StringList slCharacteristicIds= StringList.create();
	  	mpCharacteristicMasters.stream().map(m->{
	  		String characteristicId= (String) ((Map<String, Object>) m).get(CharacteristicMasterConstants.MASTER_TO_CHARACTERISTIC_SELECTABLE+CharacteristicMasterConstants.SELECT_ID);
	  		return characteristicId;
	  	}).forEach(s->slCharacteristicIds.add((String) s));;
	  	if(slCharacteristicIds.size()>0){
			IPlmParameterUtilities services = ParameterInterfacesServices.getPlmParameterUtilities();
			mlParamValues=  services.getParametersWithAllAttributes(context, slCharacteristicIds);
		}
	  	Map<String, Object> consolidatedMap= new HashMap();
	  	for(Map<String, Object> paramMap:mlParamValues){
	  		String id= (String) paramMap.get(CharacteristicMasterConstants.SELECT_ID);
	  		consolidatedMap= paramMap;
	  		Map<String, Object> mapCharacteristicDetails= new HashMap();
	  		Iterator mlIter= mpCharacteristicMasters.iterator();
	  		while(mlIter.hasNext()){
	  			Map<String, Object> mpCharacteristicMaster= (Map<String, Object>) mlIter.next();
	  			if(mpCharacteristicMaster.get(CharacteristicMasterConstants.MASTER_TO_CHARACTERISTIC_SELECTABLE+CharacteristicMasterConstants.SELECT_ID).equals(id)){
	  				consolidatedMap.putAll(mpCharacteristicMaster);
	  				mapCharacteristicDetails= CharacteristicMasterUtil.getCharacteristicDetailsFromMaster(mpCharacteristicMaster);
	  				break;
	  			}
	  			
	  		}
  			ENOICharacteristic iCharacteristic= CharacteristicServices.getCharacteristicByDetails(context, mapCharacteristicDetails, paramMap);
  			//paramMap.put("Max Status", iCharacteristic.getMaximalIncluded(context));
  			//paramMap.put("Min Status", iCharacteristic.getMinimalIncluded(context));
  			consolidatedMap.put(CharacteristicMasterConstants.PARAM_VALUE, iCharacteristic.getNominalValue(context));
  			consolidatedMap.put(CharacteristicMasterConstants.PARAM_MIN_VALUE, iCharacteristic.getMinimalValue(context));
  			consolidatedMap.put(CharacteristicMasterConstants.PARAM_MAX_VALUE, iCharacteristic.getMaximalValue(context));
  			consolidatedMap.put(CharacteristicMasterConstants.PARAM_AUTHORIZED_VALUES, iCharacteristic.getMultiValue(context));
  			consolidatedMap.put(CharacteristicMasterConstants.PARAM_DISPLAY_UNIT, iCharacteristic.getDisplayUnit());
  			consolidatedMap.put(CharacteristicMasterConstants.DIMENSION, iCharacteristic.getCharacteristicDimension(context));
  			
  			consolidatedMap.put(CriteriaUtil.stringConcat(CharacteristicMasterConstants.MASTER_TO_CHARACTERISTIC_SELECTABLE, CharacteristicAttributes.LOWER_SPECIFICATION_LIMIT.getAttributeSelect(context)), iCharacteristic.getLowerSpecificationLimit(context));
  			consolidatedMap.put(CriteriaUtil.stringConcat(CharacteristicMasterConstants.MASTER_TO_CHARACTERISTIC_SELECTABLE, CharacteristicAttributes.UPPER_SPECIFICATION_LIMIT.getAttributeSelect(context)), iCharacteristic.getUpperSpecificationLimit(context));
  			consolidatedMap.put(CriteriaUtil.stringConcat(CharacteristicMasterConstants.MASTER_TO_CHARACTERISTIC_SELECTABLE, CharacteristicAttributes.LOWER_ROUTINE_RELEASE_LIMIT.getAttributeSelect(context)), iCharacteristic.getLowerRoutineReleaseLimit(context));
  			consolidatedMap.put(CriteriaUtil.stringConcat(CharacteristicMasterConstants.MASTER_TO_CHARACTERISTIC_SELECTABLE, CharacteristicAttributes.UPPER_ROUTINE_RELEASE_LIMIT.getAttributeSelect(context)), iCharacteristic.getUpperRoutineReleaseLimit(context));
  			
  			mpReturnList.add(consolidatedMap);
	  	
	  	
	  	}
		 
	  	
	  
	  	return mpReturnList;
  	}
    
  	
  	// @com.matrixone.apps.framework.ui.ProgramCallable
  	// public static MapList getCriteriaCharacteristicMasters(Context context, String[] args) throws Exception {
  		// MapList mpReturnList = new MapList();
  		// Map<?, ?> programMap = (HashMap<?, ?>)JPO.unpackArgs(args);
	  	// String objectId  = (String)programMap.get(CharacteristicMasterConstants.OBJECT_ID);

	  	// StringList objSelects = new StringList(DomainConstants.SELECT_ID);
  		// objSelects.add(CriteriaConstants.SELECT_MODIFY_ACCESS);
	  	// if(UIUtil.isNotNullAndNotEmpty(objectId)){
	  		// /* Below code is to show Characteristic Masters on the Criteria page, 
	  		 // * if the context user deos not have modify access on the CM object, then that row will not be editable */
			// ENOICriteria iCriteria = ENOCriteriaFactory.getCriteriaById(context, objectId);
			// mpReturnList = iCriteria.getCriteriaOutput(context, objSelects, CharacteristicMasterConstants.EMPTY_STRING);
			// Map dataMap = null;
			// String hasModifyAccess = null;
			// for(Object mapObj : mpReturnList){
				// dataMap = (Map) mapObj;
				// hasModifyAccess = (String) dataMap.get(CriteriaConstants.SELECT_MODIFY_ACCESS);
				// if (CriteriaConstants.FALSE.equalsIgnoreCase(hasModifyAccess)) {
					// dataMap.put(CriteriaConstants.ROW_EDITABLE, CriteriaConstants.READONLY);
				// }
			// }
		// }
	  	// return mpReturnList;
  	// }

	public  String getOwner(Context context,String args[]) throws FrameworkException
	{
		return getSelectableValue(context, args, DomainConstants.SELECT_OWNER);
	}
	
	public String getDescription(Context context, String[] args) throws FrameworkException {
		return getSelectableValue(context, args, DomainConstants.SELECT_DESCRIPTION);
	}
	
	public String getName(Context context, String[] args) throws FrameworkException {
		return getSelectableValue(context, args, DomainConstants.SELECT_NAME);
	}
	
	public String getTitle(Context context, String[] args) throws FrameworkException {
		return getSelectableValue(context, args, CharacteristicMasterConstants.SELECT_ATTRIBUTE_TITLE);
	}
	
	private String getSelectableValue(Context context, String[] args, String strSelectable) throws FrameworkException {
		
		String strName 	= CharacteristicMasterConstants.EMPTY_STRING;
		try {
			Map programMap 		= JPO.unpackArgs(args);
			String objectId = getObjectId(programMap);
			
			DomainObject domObj = DomainObject.newInstance(context, objectId);
			strName 		= (String)domObj.getInfo(context, strSelectable);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return strName;
	}
	
	public void updateTitle(Context context, String [] args){
		
	}
	
	public void updateDescription(Context context, String [] args){
		
	}
	
	public String getPlmParameterTitle(Context context, String[] args) throws FrameworkException {
		return getPlmParameterAttributeValues(context, args, CharacteristicAttributes.TITLE.getAttributeSelect(context),CharacteristicMasterConstants.EMPTY_STRING);
	}
	
	/*EI8: Characteristic Description: Start*/
	public String getPlmParameterDescription(Context context, String[] args) throws Exception {

		Map programMap = JPO.unpackArgs(args);
		String objectId = getObjectId(programMap);
		
		ENOICharacteristicMaster iCharacteristicMaster = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId);
		String characteristicDescription = iCharacteristicMaster.getCharacteristicDescription(context);
		
		return characteristicDescription;
	}
	/*EI8: Characteristic Description: End*/
		
	public String getPlmParameterRole(Context context, String[] args) throws FrameworkException {
		return getPlmParameterAttributeValues(context, args, CharacteristicAttributes.PLM_PARAM_ROLE.getAttributeSelect(context),CharacteristicMasterConstants.EMPTY_STRING);
	}
	
	public String getPlmParameterDimension(Context context, String[] args) throws Exception {
		Map programMap 		= JPO.unpackArgs(args);
		String objectId = getObjectId(programMap);
		
		ENOICharacteristicMaster charMaster = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId);
		String val  = charMaster.getDimension(context);
		
		return val;
	}
			
	public String getDimensionInterfaceName(Context context, String[] args) throws Exception {
		Map programMap 		= JPO.unpackArgs(args);
		String objectId = getObjectId(programMap);
		
		ENOICharacteristicMaster charMaster = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId);
		String val  = charMaster.getDimensionName(context);
		
		return val;
	}
	
	
	public String getPlmParameterDisplayUnit(Context context, String[] args) throws FrameworkException {
		return getPlmParameterAttributeValues(context, args, CharacteristicAttributes.PLM_PARAM_DISPLAY_UNIT.getAttributeSelect(context),CharacteristicMasterConstants.EMPTY_STRING);
	}
	
	public String getPlmParameterPriority(Context context, String[] args) throws FrameworkException {
		return getPlmParameterAttributeValues(context, args, CharacteristicAttributes.PARAMETER_PRIORITY.getAttributeSelect(context),CharacteristicMasterConstants.EMPTY_STRING);
	}
	
	public String getPlmParameterValuationType(Context context, String[] args) throws FrameworkException {
    	String language = context.getSession().getLanguage();
		String valuationType = getPlmParameterAttributeValues(context, args, CharacteristicAttributes.PLM_PARAM_VALUATION_TYPE.getAttributeSelect(context),CharacteristicMasterConstants.EMPTY_STRING);
		return EnoviaResourceBundle.getProperty(context, CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE, new Locale(language),"CharacteristicMaster.ValuationType.".concat(valuationType));
	}
	
	public String getPlmParameterMaxValue(Context context, String[] args) throws Exception{
		Map programMap 		= JPO.unpackArgs(args);
		String objectId = getObjectId(programMap);
		
		ENOICharacteristicMaster charMaster = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId);
		String val  = charMaster.getMaximalValue(context);
		
		return val;
	}
	
	public String getPlmParameterMinValue(Context context, String[] args) throws Exception {
		Map programMap 		= JPO.unpackArgs(args);
		String objectId = getObjectId(programMap);
		
		ENOICharacteristicMaster charMaster = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId);
		String val  = charMaster.getMinimalValue(context);
		
		return val;
	}
	
	public String getPlmParameterNominalValue(Context context, String[] args) throws Exception {
		Map programMap 		= JPO.unpackArgs(args);
		String objectId = getObjectId(programMap);
		
		ENOICharacteristicMaster charMaster = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId);
		String val  = charMaster.getNominalValue(context);
		return val;
	}
	
	public String getLowerSpecificationLimit(Context context, String[] args) throws Exception {
		
		Map programMap 		= JPO.unpackArgs(args);
		String objectId = getObjectId(programMap);
		
		ENOICharacteristicMaster charMaster = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId);
		ENOICharacteristic characteristic = charMaster.getCharacteristic();
		
		return characteristic.getLowerSpecificationLimit(context);
	}
	
	public String getLowerRoutineReleaseLimit(Context context, String[] args) throws Exception {
		
		Map programMap 		= JPO.unpackArgs(args);
		String objectId = getObjectId(programMap);
		
		ENOICharacteristicMaster charMaster = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId);
		ENOICharacteristic characteristic = charMaster.getCharacteristic();
		
		return characteristic.getLowerRoutineReleaseLimit(context);
	}
	
	public String getUpperSpecificationLimit(Context context, String[] args) throws Exception {
		
		Map programMap 		= JPO.unpackArgs(args);
		String objectId = getObjectId(programMap);
		
		ENOICharacteristicMaster charMaster = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId);
		ENOICharacteristic characteristic = charMaster.getCharacteristic();
		
		return characteristic.getUpperSpecificationLimit(context);
	}
	
	public String getUpperRoutineReleaseLimit(Context context, String[] args) throws Exception {
		
		Map programMap 		= JPO.unpackArgs(args);
		String objectId = getObjectId(programMap);
		
		ENOICharacteristicMaster charMaster = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId);
		ENOICharacteristic characteristic = charMaster.getCharacteristic();
		
		return characteristic.getUpperRoutineReleaseLimit(context);
	}
	
	public String getExternalTestMethod(Context context, String[] args) throws Exception {
		
		Map programMap 		= JPO.unpackArgs(args);
		String objectId = getObjectId(programMap);
		
		ENOICharacteristicMaster charMaster = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId);
		ENOICharacteristic characteristic = charMaster.getCharacteristic();
		
		return characteristic.getExternalTestMethod(context);
	}
	
	public String getPlmParameterMultiValueString(Context context, String[] args) throws Exception{
		Map programMap 		= JPO.unpackArgs(args);
		String objectId = getObjectId(programMap);
		
		StringList multiValues = new StringList();
		ENOICharacteristicMaster charMaster = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId);
		multiValues = charMaster.getMultiValue(context);
		StringBuilder sb = new StringBuilder(CharacteristicMasterConstants.EMPTY_STRING);
		for(Object str : multiValues){
			sb.append("|");
			sb.append((String)str);
		}
		return sb.toString();
	}
	
	public String getPlmParameterMultiValue(Context context, String[] args) throws Exception {
		Map programMap 		= JPO.unpackArgs(args);
		String objectId = getObjectId(programMap);
		HashMap requestMap  = (HashMap) programMap.get(CharacteristicMasterConstants.REQUEST_MAP);
		String mode			= (String) requestMap.get(CharacteristicMasterConstants.MODE);
		
		StringList multiValues = new StringList();
		StringBuffer html = new StringBuffer();
		
		ENOICharacteristicMaster charMaster = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId);
		multiValues = charMaster.getMultiValue(context);
				
		if(multiValues.isEmpty()) {
			return CharacteristicMasterConstants.EMPTY_STRING;
		}
		if (CharacteristicMasterConstants.EDIT.equals(mode)) {
		String name= "multiColList";
		html.append("<SELECT id='" + name + "' name='" + name + "'"+">");
		for (Object value : multiValues.toArray())
		{    			
			html.append("<OPTION value='"+ (String)value +"' "+">"+ (String) value +"</OPTION>");
		}
		html.append("</SELECT>");
		} else {
			html.append(multiValues.join(" | "));
		}
		
		return html.toString();
	}

	public String getCharactersticCategory(Context context, String[] args) throws Exception {

		/*EI8: Characteristic Category Ranges: Start*/
		//return getPlmParameterAttributeValues(context, args, CharacteristicAttributes.CHARACTERISTIC_CATEGORY.getAttributeSelect(context),CharacteristicMasterConstants.EMPTY_STRING);

		String category = getPlmParameterAttributeValues(context, args, CharacteristicAttributes.CHARACTERISTIC_CATEGORY.getAttributeSelect(context),CharacteristicMasterConstants.EMPTY_STRING);
		HashMap programMap = (HashMap) JPO.unpackArgs(args);
		HashMap fieldMap = (HashMap) programMap.get(CharacteristicMasterConstants.FIELD_MAP);
		String fieldName = (String) fieldMap.get("name");
		
		HashMap requestMap  = (HashMap) programMap.get(CharacteristicMasterConstants.REQUEST_MAP);
		String mode			= (String) requestMap.get(CharacteristicMasterConstants.MODE);
		
		String attribute = CharacteristicAttributes.CHARACTERISTIC_CATEGORY.getAttribute(context);
		StringList ranges = CharacteristicMasterUtil.getAttributeRanges(context, attribute);
		
		StringList translatedRanges = CharacteristicMasterUtil.getCharacteristicCategoryRangesFromPage(context, false);
				
		for(int i=0; i<ranges.size(); i++) {
			
			if(category.equals(ranges.get(i)))
				return translatedRanges.get(i);
		}

		return category;
		
	}
	/*EI8: Characteristic Category Ranges: End*/
	
	public String getCharacteristicNotes(Context context, String[] args) throws FrameworkException {
		return getPlmParameterAttributeValues(context, args, CharacteristicAttributes.CHARACTERISTIC_NOTES.getAttributeSelect(context),CharacteristicMasterConstants.EMPTY_STRING);
	}
	

	public String getMeasurementPrecision(Context context, String[] args) throws FrameworkException {
		return getPlmParameterAttributeValues(context, args, CharacteristicAttributes.MEASUREMENT_PRECISION.getAttributeSelect(context),CharacteristicMasterConstants.EMPTY_STRING);
	}
	
	/**
	 * @param context
	 * @param args
	 * @return The translated value of the attribute 'MissedTargetAction' for UI
	 * @throws FrameworkException 
	 */
	public String getMissedTargetAction(Context context, String[] args) throws FrameworkException {
		String language = context.getSession().getLanguage();
		String actualValue= getPlmParameterAttributeValues(context, args, CharacteristicAttributes.MISSED_TARGET_ACTION.getAttributeSelect(context),CharacteristicMasterConstants.EMPTY_STRING);
		return EnoviaResourceBundle.getProperty(context, CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE, new Locale(language),"CharacteristicMaster.Range.".concat(actualValue.replace(" ", "")));
		
	}
	
	/**
	 * 
	 * @param context
	 * @param args
	 * @return The translated value of the attribute 'AppliesToInProcess' for UI
	 * @throws FrameworkException 
	 */
	public String getAppliesToInProcess(Context context, String[] args) throws FrameworkException {
		String language = context.getSession().getLanguage();
		String actualValue= getPlmParameterAttributeValues(context, args, CharacteristicAttributes.APPLIES_TO_IN_PROCESS.getAttributeSelect(context),CharacteristicMasterConstants.EMPTY_STRING);
		return EnoviaResourceBundle.getProperty(context, CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE, new Locale(language),"CharacteristicMaster.Boolean.".concat(actualValue.toLowerCase()));
	}
	
	/**
	 * 
	 * @param context
	 * @param args
	 * @return The translated value of the attribute 'AppliesToBulk' for UI
	 * @throws FrameworkException 
	 */
	public String getAppliesToBulk(Context context, String[] args) throws FrameworkException {
		String language = context.getSession().getLanguage();
		String actualValue=  getPlmParameterAttributeValues(context, args, CharacteristicAttributes.APPLIES_TO_BULK.getAttributeSelect(context),CharacteristicMasterConstants.EMPTY_STRING);
		return  EnoviaResourceBundle.getProperty(context, CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE, new Locale(language),"CharacteristicMaster.Boolean.".concat(actualValue.toLowerCase()));
	}
	/**
	 * 
	 * @param context
	 * @param args
	 * @return The translated value of the attribute 'AppliesToFinalPackage' for UI
	 * @throws FrameworkException 
	 */

	public String getAppliesToFinalPackage(Context context, String[] args) throws FrameworkException {
		String language = context.getSession().getLanguage();
		String actualValue= getPlmParameterAttributeValues(context, args, CharacteristicAttributes.APPLIES_TO_FINAL_PACKAGE.getAttributeSelect(context),CharacteristicMasterConstants.EMPTY_STRING);
		return  EnoviaResourceBundle.getProperty(context, CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE, new Locale(language),"CharacteristicMaster.Boolean.".concat(actualValue.toLowerCase()));
		
	}
	
	/*EI8: Overwrite Allowed On Child: Start*/
	/**
	 * 
	 * @param context
	 * @param args
	 * @return The translated value of the attribute 'Overwrite Allowed On Child' for UI
	 * @throws Exception 
	 */
	public String getOverwriteAllowedOnChild(Context context, String[] args) throws Exception {
		Map programMap 		= JPO.unpackArgs(args);
		Map requestMap		= (Map) programMap.get(CharacteristicMasterConstants.REQUEST_MAP);
		String objectId 	= (String)requestMap.get(CharacteristicMasterConstants.OBJECT_ID);
		
		ENOICharacteristicMaster iCharacteristicMaster = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId);
		
		ENOIParameterAggregation iParameterAggregation = iCharacteristicMaster.getParameterAggregation(context);
		
		String overwriteAllowedOnChild = iParameterAggregation.getOverWriteAllowedOnChild();
		
		String language = context.getSession().getLanguage();
		String actualValue= overwriteAllowedOnChild;
		return EnoviaResourceBundle.getProperty(context, CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE, new Locale(language),"CharacteristicMaster.Boolean.".concat(actualValue.toLowerCase()));
		
		
	}
	/*EI8: Overwrite Allowed On Child: End*/
	
	@SuppressWarnings(RAWTYPES)
	@com.matrixone.apps.framework.ui.ProgramCallable
	public  static MapList getConnectedTestMethods(Context context, String[] args) throws Exception {
		Map programMap 		= JPO.unpackArgs(args);
		String objectId 	= (String)programMap.get(CharacteristicMasterConstants.OBJECT_ID);
		
		ENOICharacteristicMaster charMaster = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId);
		MapList returnList  = charMaster.getConnectedTestMethods(context);
		return returnList;
	}	
	
	public String getConnectedTestMethodsByName(Context context, String[] args) throws Exception {
		HashMap programMap = (HashMap) JPO.unpackArgs(args);
		HashMap requestMap = (HashMap) programMap.get("requestMap");
        String objectId = (String) requestMap.get("objectId");	
		ENOICharacteristicMaster charMaster = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId);
		MapList returnList  = charMaster.getConnectedTestMethods(context);
		String testMethodNames = null;
		String testMethodOIDs = null;
		Iterator<?> itr = returnList.iterator();
		while(itr.hasNext()){
			Map map = (Map) itr.next();
	    	String tmID = (String) map.get(CharacteristicMasterConstants.SELECT_ID);	
	    	String tmName = (String) map.get(CharacteristicMasterConstants.SELECT_NAME);	
	    	String tmStateName = (String) map.get(CharacteristicMasterConstants.SELECT_CURRENT);
		   	if(!ENOCharacteristicEnum.CharacteristicStates.CHARACTERISTIC_MASTER_OBSOLETE.getState(context, ENOCharacteristicEnum.CharacteristicPolicy.CHARACTERISTIC_MASTER.getPolicy(context)).equals(tmStateName)) {
		   		if(UIUtil.isNotNullAndNotEmpty(tmID) && testMethodNames==null){
		    		testMethodOIDs= tmID;
	   	    		testMethodNames=tmName;	
				}else if(UIUtil.isNotNullAndNotEmpty(tmID)) {
					testMethodNames=testMethodNames.concat("|").concat(tmName);
	   				testMethodOIDs=testMethodOIDs.concat("|").concat(tmID);
				}
		   	}    	
		}
		if(testMethodNames!=null){
		StringBuilder strBuilder = new StringBuilder(100);
		strBuilder.append(testMethodNames).append("||").append(testMethodOIDs);
		return strBuilder.toString();
		}
		return null;
	}
	
	
	
	@SuppressWarnings(RAWTYPES)
	@com.matrixone.apps.framework.ui.ProgramCallable
	public  static MapList getRelatedCriterias(Context context, String[] args) throws Exception {
		MapList returnList = new MapList();
    	try {
	    	Map<?, ?> programMap = (HashMap<?, ?>)JPO.unpackArgs(args);
	    	String filter  = (String)programMap.get("MyDeskCriteriaCustomFilter");
	    	String objectId 	= (String)programMap.get(CharacteristicMasterConstants.OBJECT_ID);
	        String whereExpr =  CriteriaConstants.EMPTY_STRING;
	        if(!CriteriaConstants.ALL.equalsIgnoreCase(filter)) {
	        	whereExpr = CriteriaUtil.stringConcat(CriteriaConstants.SELECT_CURRENT, "!=", ENOCriteriaEnum.State.OBSOLETE.get(context, ENOCriteriaEnum.Policy.CRITERIA));
	        }
	        ENOICharacteristicMaster charMaster = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId);
	        StringList selectStmts = new StringList(CriteriaConstants.SELECT_ID);
	        selectStmts.add(ENOCriteriaEnum.Attribute.APPLICABLE_TYPE.getSelect(context));
			selectStmts.add(ENOCriteriaEnum.Attribute.CRITERIA_EXPRESSION.getSelect(context));
	        returnList  = charMaster.getRelatedCriteria(context, selectStmts, whereExpr);
	        CriteriaUI.updateCustomStyleForIsMandatoryField(context, returnList);
    	} catch (Exception e) {
			e.printStackTrace();
		}
    	return returnList;
	}
	
	@SuppressWarnings(RAWTYPES)
	private String getPlmParameterAttributeValues(Context context, String args [] ,String selectable, String objectId) throws FrameworkException{
		String returnString 	= CharacteristicMasterConstants.EMPTY_STRING;
		try {
			if(args != null && args.length>=0){
				Map programMap 		= JPO.unpackArgs(args);
				Map paramMap		=(Map)programMap.get(CharacteristicMasterConstants.PARAM_MAP);
				Map requestMap		=(Map)programMap.get(CharacteristicMasterConstants.REQUEST_MAP);

				if (UIUtil.isNullOrEmpty(objectId) && (paramMap != null && !paramMap.isEmpty())){ 
					objectId 	= (String)paramMap.get(CharacteristicMasterConstants.OBJECT_ID);
				}

				if (UIUtil.isNullOrEmpty(objectId) && (requestMap != null && !requestMap.isEmpty() )){
					objectId		=(String)requestMap.get(CharacteristicMasterConstants.OBJECT_ID);
				}
			}
			
			/* EI8: FUN110793 - Support ParameterAggregation as Compositional - IR-905110: Start */
			DomainObject charMasterObj = DomainObject.newInstance(context, objectId);
			
			if(!selectable.equals(CharacteristicAttributes.PLM_PARAM_DISPLAY_UNIT.getAttributeSelect(context))){
				
				StringList busSelects = new StringList();
				busSelects.add(selectable);

				StringList relSelects = new StringList();
				if(selectable.equals(CharacteristicAttributes.OVERWRITE_ALLOWED_ON_CHILD.getAttributeSelect(context))
						&& !CharacteristicMasterUtil.isCompositional(context, CharacteristicRelationships.PARAMETER_AGGREGATION.getRelationship(context))) {
					
					busSelects.remove(selectable);
					relSelects.add(selectable);
				}
				
				Map parameterMap = charMasterObj.getRelatedObject(context, CharacteristicRelationships.PARAMETER_AGGREGATION.getRelationship(context), true, busSelects, relSelects);
				if(parameterMap.containsKey(selectable))
					returnString =(String) parameterMap.get(selectable);
				
			}else{
				ENOICharacteristicMaster iCharMaster = ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId);
				returnString = iCharMaster.getCharacteristic().getCharacteristicDisplayUnit(context);
			}
			/* EI8: FUN110793 - Support ParameterAggregation as Compositional - IR-905110: End */
		}catch (Exception e) {
			e.printStackTrace();
		}
		return returnString;
	}
	
	@SuppressWarnings({ UNCHECKED, RAWTYPES })
	private Vector getCharacteristicMasterColumns(Context context, String args [], String selectable) throws Exception{
		Map programMap = JPO.unpackArgs(args);
		MapList objectList = (MapList) programMap.get(CharacteristicMasterConstants.OBJECT_LIST);
		Vector columnValues = new Vector(objectList.size());
		try{
			
			for(int i =0; i<objectList.size();i++){
				Map object_i = (Map) objectList.get(i);
				String object_id= (String) object_i.get(CharacteristicMasterConstants.ID);
				String value = getPlmParameterAttributeValues(context, args, selectable, object_id);
				if(UIUtil.isNullOrEmpty(value))
					value = CharacteristicMasterConstants.EMPTY_STRING;
				columnValues.add(value);
			}
			
		}catch(Exception e){
			e.printStackTrace();			
		}
		
		return columnValues;		
	}
	
	private Vector getColumnData(Context context,String[] args, String selectable) throws Exception{
		Map programMap = JPO.unpackArgs(args);
		MapList objectList = (MapList) programMap.get(CharacteristicMasterConstants.OBJECT_LIST);
		Vector columnValues = new Vector(objectList.size());
		try{
			
			for(int i =0; i<objectList.size();i++){
				Map object_i = (Map) objectList.get(i);
				columnValues.add(object_i.get(selectable));
			}
			
		}catch(Exception e){
			e.printStackTrace();			
		}
		
		return columnValues;		
	}

	
	@SuppressWarnings(UNCHECKED)
	public Vector<?> getCMCharTitleColumns(Context context, String args[]){
		Vector<String> columnValues = new Vector();
		try{
			columnValues = (Vector<String>) getCharacteristicMasterColumns(context, args, CharacteristicAttributes.TITLE.getAttributeSelect(context));		
			
		}catch(Exception e){
			e.printStackTrace();			
		}
		
		return columnValues;		
	}
	
	
	/*@SuppressWarnings(UNCHECKED)
	public Vector<?> getCMRoleColumns(Context context, String args[]){
		Vector<String> columnValues = new Vector();
		try{
			columnValues = (Vector<String>) getCharacteristicMasterColumns(context, args, CharacteristicAttributes.PLM_PARAM_ROLE.getAttributeSelect(context));		
			
		}catch(Exception e){
			e.printStackTrace();			
		}
		
		return columnValues;		
	}*/
	
	@SuppressWarnings(UNCHECKED)
	public Vector<?> getCMCharacteristicCategoryColumns(Context context, String args[]){
		Vector<String> columnValues = new Vector();
		Vector<String> translatedColumnValues = new Vector();
		try{
			columnValues = (Vector<String>) getCharacteristicMasterColumns(context, args, CharacteristicAttributes.CHARACTERISTIC_CATEGORY.getAttributeSelect(context));
			
			StringList ranges = CharacteristicMasterUtil.getAttributeRanges(context, CharacteristicAttributes.CHARACTERISTIC_CATEGORY.getAttribute(context));
			
			for(String columnValue: columnValues) {
			
				StringList translatedRanges = CharacteristicMasterUtil.getCharacteristicCategoryRangesFromPage(context, false);
				
				int i;
				for(i=0; i<ranges.size(); i++) {
					
					if(columnValue.equals(ranges.get(i))) {
						translatedColumnValues.add(translatedRanges.get(i));
						break;
					}
				}

				if(i == ranges.size()) {
					translatedColumnValues.add(columnValue);
				}
			}

		}catch(Exception e){
			e.printStackTrace();			
		}
		
		//return columnValues;
		return translatedColumnValues;
	}

	@SuppressWarnings(UNCHECKED)
	public Vector<?> getPlmParameterCharacteristicCategoryColumns(Context context, String args[]){

		Vector<String> translatedColumnValues = new Vector();
		try{

			Map programMap = JPO.unpackArgs(args);
			MapList objectList = (MapList)programMap.get("objectList");
			
			
			for(int j=0; j<objectList.size(); j++) {
				
				Map objectMap = (Map) objectList.get(j);
				String category = (String) objectMap.get(ENOCharacteristicEnum.CharacteristicAttributes.CHARACTERISTIC_CATEGORY.getAttributeSelect(context));
			
				StringList ranges = CharacteristicMasterUtil.getAttributeRanges(context, CharacteristicAttributes.CHARACTERISTIC_CATEGORY.getAttribute(context));
				
				StringList translatedRanges = CharacteristicMasterUtil.getCharacteristicCategoryRangesFromPage(context, false);
				
				int i;
				for(i=0; i<ranges.size(); i++) {
					
					if(category.equals(ranges.get(i))) {
						translatedColumnValues.add(translatedRanges.get(i));
						break;
					}
				}

				if(i == ranges.size()) {
					translatedColumnValues.add(category);
				}

			}

		}catch(Exception e){
			e.printStackTrace();			
		}
		return translatedColumnValues;
	}
	
	@SuppressWarnings(UNCHECKED)
	public Vector<?> getCMPriorityColumns(Context context, String args[]){
		Vector<String> columnValues = new Vector();
		try{
			columnValues = (Vector<String>) getCharacteristicMasterColumns(context, args, CharacteristicAttributes.PARAMETER_PRIORITY.getAttributeSelect(context));		
		}
		catch(Exception e){
			e.printStackTrace();
		}
		return columnValues;		
	}
	
	@SuppressWarnings(UNCHECKED)
	public Vector<?> getCMOverwriteAllowedOnChildColumns(Context context, String args[] ) {
		
		Vector<String> columnValues = null ;
		try {
			columnValues = (Vector<String>) getCharacteristicMasterColumns(context, args, CharacteristicAttributes.OVERWRITE_ALLOWED_ON_CHILD.getAttributeSelect(context));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return columnValues;
	}
	
	@SuppressWarnings({ UNCHECKED, RAWTYPES })
	public Vector<?> getCMDimensionColumns(Context context, String args[]){
		Vector<String> columnValues = null;
		try{
			columnValues= getColumnData(context, args, "Dimension");
		}
		catch(Exception e){
			e.printStackTrace();
		}
		return columnValues;		
	}
	
	@SuppressWarnings({ UNCHECKED, RAWTYPES })
	public Vector<?> getCMDisplayUnitColumns(Context context, String args[]){
		Vector<String> columnValues = null;
		try{
			columnValues= getColumnData(context, args, "Display Unit");
		}
		catch(Exception e){
			e.printStackTrace();
		}
		return columnValues;		
	}

	@SuppressWarnings(UNCHECKED)
	public Vector<?> getCMNominalValueColumns(Context context, String args[]){
		Vector<String> columnValues = null;
		try{
			columnValues= getColumnData(context, args, "Value");
		}
		catch(Exception e){
			e.printStackTrace();
		}
		return columnValues;		
	}
	
	@SuppressWarnings(UNCHECKED)
	public Vector<?> getCMMinimalValueColumns(Context context, String args[]){
		Vector<String> columnValues = null;
		try{
			columnValues= getColumnData(context, args, "Min Value");
		}
		catch(Exception e){
			e.printStackTrace();
		}
		return columnValues;		
	}
	
	@SuppressWarnings({ UNCHECKED, RAWTYPES })
	public Vector<?> getCMMaximalValueColumns(Context context, String args[]){
		Vector<String> columnValues = null;
		try{
			columnValues= getColumnData(context, args, "Max Value");
		}
		catch(Exception e){
			e.printStackTrace();
		}
		return columnValues;		
	}
	
	@SuppressWarnings({ UNCHECKED, RAWTYPES })
	public Vector<?> getCMLowerSpecificationLimitColumns(Context context, String args[]){
		Vector<String> columnValues = null;
		try{
			columnValues= getColumnData(context, args, CriteriaUtil.stringConcat(CharacteristicMasterConstants.MASTER_TO_CHARACTERISTIC_SELECTABLE, CharacteristicAttributes.LOWER_SPECIFICATION_LIMIT.getAttributeSelect(context)));
		}
		catch(Exception e){
			e.printStackTrace();
		}
		return columnValues;		
	}
	
	@SuppressWarnings({ UNCHECKED, RAWTYPES })
	public Vector<?> getCMUpperSpecificationLimitColumns(Context context, String args[]){
		Vector<String> columnValues = null;
		try{
			columnValues= getColumnData(context, args, CriteriaUtil.stringConcat(CharacteristicMasterConstants.MASTER_TO_CHARACTERISTIC_SELECTABLE, CharacteristicAttributes.UPPER_SPECIFICATION_LIMIT.getAttributeSelect(context)));
		}
		catch(Exception e){
			e.printStackTrace();
		}
		return columnValues;		
	}
	
	@SuppressWarnings({ UNCHECKED, RAWTYPES })
	public Vector<?> getCMLowerRoutineReleaseLimitColumns(Context context, String args[]){
		Vector<String> columnValues = null;
		try{
			columnValues= getColumnData(context, args, CriteriaUtil.stringConcat(CharacteristicMasterConstants.MASTER_TO_CHARACTERISTIC_SELECTABLE, CharacteristicAttributes.LOWER_ROUTINE_RELEASE_LIMIT.getAttributeSelect(context)));
		}
		catch(Exception e){
			e.printStackTrace();
		}
		return columnValues;		
	}
	
	@SuppressWarnings({ UNCHECKED, RAWTYPES })
	public Vector<?> getCMUpperRoutineReleaseLimitColumns(Context context, String args[]){
		Vector<String> columnValues = null;
		try{
			columnValues= getColumnData(context, args, CriteriaUtil.stringConcat(CharacteristicMasterConstants.MASTER_TO_CHARACTERISTIC_SELECTABLE, CharacteristicAttributes.UPPER_ROUTINE_RELEASE_LIMIT.getAttributeSelect(context)));
		}
		catch(Exception e){
			e.printStackTrace();
		}
		return columnValues;		
	}
	
	@SuppressWarnings({ UNCHECKED, RAWTYPES })
	public StringList getCMMultiValueColumns(Context context, String args[]){
		StringList columnValues = null;
		try{
			Map programMap = JPO.unpackArgs(args);
			MapList objectList = (MapList) programMap.get(CharacteristicMasterConstants.OBJECT_LIST);
			columnValues = new StringList();
			
			for(int i =0; i<objectList.size();i++){
				Map object_i = (Map) objectList.get(i);
				StringList multiValues =(StringList) object_i.get("Authorized Values");
				if(!multiValues.isEmpty()){
					/*StringBuffer html = new StringBuffer();
					String name= "multiColList";
					html.append("<SELECT id='").append(name).append("' name='").append(name).append("'").append(">");
					for (Object value : multiValues.toArray())
					{    			
						html.append("<OPTION value='").append((String)value).append("' ").append(">").append((String) value).append("</OPTION>");
					}
					html.append("</SELECT>");	   
					columnValues.add(html.toString());*/
					columnValues.add(multiValues.join(" | "));
				}else
					columnValues.add(CharacteristicMasterConstants.EMPTY_STRING);
				
			}
		}catch(Exception e){
			e.printStackTrace();			
		}

		return columnValues;	
	}
	
	public Map<String, StringList> getCustomFilterRanges(Context context, String args[]){
		Map<String, StringList> returnMap = new HashMap<String, StringList>();
		StringList choices = new StringList();
		choices.addElement(CharacteristicMasterConstants.ACTIVE);
		choices.addElement(CharacteristicMasterConstants.ALL);
		StringList choiceDisplay = new StringList();
		choiceDisplay.addElement(EnoviaResourceBundle.getProperty(context, CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE, context.getLocale(), "CharacteristicMaster.Common.Active"));
		choiceDisplay.addElement(EnoviaResourceBundle.getProperty(context, CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE, context.getLocale(), "CharacteristicMaster.Common.All"));
		returnMap.put(CharacteristicMasterConstants.FIELD_CHOICES, choices);
		returnMap.put(CharacteristicMasterConstants.FIELD_DISPLAY_CHOICES, choiceDisplay);
		return returnMap;
	}
	
	
	@SuppressWarnings("unused")
	public void setCharacteristicMasterTitle(Context context, String args[]) throws Exception{
		HashMap<?, ?> programMap	= (HashMap<?, ?>)JPO.unpackArgs(args);
		HashMap<?, ?> paramMap 		= (HashMap<?, ?>) programMap.get(CharacteristicMasterConstants.PARAM_MAP);
		String newValue				= (String) paramMap.get(CharacteristicMasterConstants.NEW_VALUE);
		String cmOID				= (String)paramMap.get(CharacteristicMasterConstants.OBJECT_ID);
		
		ENOICharacteristicMaster charMasterObj = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context,cmOID);
		charMasterObj.setCharacteristicMasterTitle(context,newValue);
		charMasterObj.commit(context);
	}
	
	
	@SuppressWarnings("unused")
	public void setCharacteristicMasterDesc(Context context, String args[]) throws Exception{
		HashMap<?, ?> programMap	= (HashMap<?, ?>)JPO.unpackArgs(args);
		HashMap<?, ?> paramMap 		= (HashMap<?, ?>) programMap.get(CharacteristicMasterConstants.PARAM_MAP);
		String newValue				= (String) paramMap.get(CharacteristicMasterConstants.NEW_VALUE);
		String cmOID				= (String)paramMap.get(CharacteristicMasterConstants.OBJECT_ID);
		
		ENOICharacteristicMaster charMasterObj = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context,cmOID);
		charMasterObj.setCharacteristicMasterDescription(newValue);
		charMasterObj.commit(context);
	}
		
	
	
	@SuppressWarnings("unused")
	public void setCharacteristicMasterCharTitle(Context context, String args[]) throws Exception{
		HashMap<?, ?> programMap	= (HashMap<?, ?>)JPO.unpackArgs(args);
		HashMap<?, ?> paramMap 		= (HashMap<?, ?>) programMap.get(CharacteristicMasterConstants.PARAM_MAP);
		String newValue				= (String) paramMap.get(CharacteristicMasterConstants.NEW_VALUE);
		String cmOID				= (String)paramMap.get(CharacteristicMasterConstants.OBJECT_ID);
		
		ENOICharacteristicMaster charMasterObj = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context,cmOID);
		charMasterObj.setCharacteristicTitle(context,newValue);
		charMasterObj.commit(context);
	}
	
	@SuppressWarnings("unused")
	public void setCharacteristicMasterRole(Context context, String args[]) throws Exception{
		HashMap<?, ?> programMap	= (HashMap<?, ?>)JPO.unpackArgs(args);
		HashMap<?, ?> paramMap 		= (HashMap<?, ?>) programMap.get(CharacteristicMasterConstants.PARAM_MAP);
		String newValue				= (String) paramMap.get(CharacteristicMasterConstants.NEW_VALUE);
		String cmOID				= (String)paramMap.get(CharacteristicMasterConstants.OBJECT_ID);
		
		ENOICharacteristicMaster charMasterObj = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context,cmOID);
		charMasterObj.setRole(context,newValue);
		charMasterObj.commit(context);
	}
	
	
	@SuppressWarnings("unused")
	public void setCharacteristicMasterPriority(Context context, String args[]) throws Exception{
		HashMap<?, ?> programMap	= (HashMap<?, ?>)JPO.unpackArgs(args);
		HashMap<?, ?> paramMap 		= (HashMap<?, ?>) programMap.get(CharacteristicMasterConstants.PARAM_MAP);
		String newValue				= (String) paramMap.get(CharacteristicMasterConstants.NEW_VALUE);
		String cmOID				= (String)paramMap.get(CharacteristicMasterConstants.OBJECT_ID);
		
		ENOICharacteristicMaster charMasterObj = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context,cmOID);
		charMasterObj.setPriority(context,newValue);
		charMasterObj.commit(context);
	}
	
	@SuppressWarnings("unused")
	public void setCharacteristicMasterNominalValue(Context context, String args[]) throws Exception{
		HashMap<?, ?> programMap	= (HashMap<?, ?>)JPO.unpackArgs(args);
		HashMap<?, ?> paramMap 		= (HashMap<?, ?>) programMap.get(CharacteristicMasterConstants.PARAM_MAP);
		String newValue				= (String) paramMap.get(CharacteristicMasterConstants.NEW_VALUE);
		String cmOID				= (String)paramMap.get(CharacteristicMasterConstants.OBJECT_ID);
		
		ENOICharacteristicMaster charMasterObj = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context,cmOID);
		String minValue			= charMasterObj.getMinimalValue(context);
		String maxValue			= charMasterObj.getMaximalValue(context);
		Object[] multivalueArray = (charMasterObj.getMultiValue(context)).toArray();
		StringList multiValueList = new StringList();
		for(Object multi : multivalueArray){
			multiValueList.add((String)multi);
		}
		
		charMasterObj.setCharacteristicValues(newValue, minValue, maxValue, true, true, multiValueList);
		charMasterObj.commit(context);
	}
	
	@SuppressWarnings("unused")
	public void setCharacteristicMasterMinValue(Context context, String args[]) throws Exception{
		HashMap<?, ?> programMap	= (HashMap<?, ?>)JPO.unpackArgs(args);
		HashMap<?, ?> paramMap 		= (HashMap<?, ?>) programMap.get(CharacteristicMasterConstants.PARAM_MAP);
		String newValue				= (String) paramMap.get(CharacteristicMasterConstants.NEW_VALUE);
		String cmOID				= (String)paramMap.get(CharacteristicMasterConstants.OBJECT_ID);
		
		ENOICharacteristicMaster charMasterObj = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context,cmOID);
		String nominalValue			= charMasterObj.getNominalValue(context);
		String maxValue			= charMasterObj.getMaximalValue(context);
		Object[] multivalueArray = (charMasterObj.getMultiValue(context)).toArray();
		StringList multiValueList = new StringList();
		for(Object multi : multivalueArray){
			multiValueList.add((String)multi);
		}
		
		charMasterObj.setCharacteristicValues(nominalValue, newValue, maxValue, true, true, multiValueList);
		charMasterObj.commit(context);
	}
	
	@SuppressWarnings("unused")
	public void setCharacteristicMasterMaxValue(Context context, String args[]) throws Exception{
		HashMap<?, ?> programMap	= (HashMap<?, ?>)JPO.unpackArgs(args);
		HashMap<?, ?> paramMap 		= (HashMap<?, ?>) programMap.get(CharacteristicMasterConstants.PARAM_MAP);
		String newValue				= (String) paramMap.get(CharacteristicMasterConstants.NEW_VALUE);
		String cmOID				= (String)paramMap.get(CharacteristicMasterConstants.OBJECT_ID);
		
		ENOICharacteristicMaster charMasterObj = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context,cmOID);
		String nominalValue			= charMasterObj.getNominalValue(context);
		String minValue			= charMasterObj.getMinimalValue(context);
		Object[] multivalueArray = (charMasterObj.getMultiValue(context)).toArray();
		StringList multiValueList = new StringList();
		for(Object multi : multivalueArray){
			multiValueList.add((String)multi);
		}
		
		charMasterObj.setCharacteristicValues(nominalValue, minValue, newValue, true, true, multiValueList);
		charMasterObj.commit(context);
	}
	
	public boolean isVisible(Context context, String args[]) throws Exception{
		HashMap<?, ?> programMap	= (HashMap<?, ?>)JPO.unpackArgs(args);
		String mode 		= (String) programMap.get(CharacteristicMasterConstants.MODE);
		/*SRR7:  IR-458495- Export returns nothing as this method throws a nullpointer exception.*/
		//if(mode.equals(CharacteristicMasterConstants.EDIT))
		if(CharacteristicMasterConstants.EDIT.equals(mode))
			return true;
		return false;
	}
	
	public String getValuationTypeForEdit(Context context, String[] args) throws FrameworkException {
		String valuationType = getPlmParameterAttributeValues(context, args, CharacteristicAttributes.PLM_PARAM_VALUATION_TYPE.getAttributeSelect(context),CharacteristicMasterConstants.EMPTY_STRING);
		return valuationType;
	}
	
	public String getMinMaxIncludedForEdit(Context context, String[] args) throws FrameworkException {
		String minIncluded = getPlmParameterAttributeValues(context, args, CharacteristicAttributes.MIN_RANGE_PROPERTY.getAttributeSelect(context),CharacteristicMasterConstants.EMPTY_STRING);
		String maxIncluded = getPlmParameterAttributeValues(context, args, CharacteristicAttributes.MAX_RANGE_PROPERTY.getAttributeSelect(context),CharacteristicMasterConstants.EMPTY_STRING);
		return minIncluded.concat(CharacteristicMasterConstants.PIPELINE).concat(maxIncluded);
	}
	
	@com.matrixone.apps.framework.ui.ExcludeOIDProgramCallable
	public StringList excludeAlreadyConnectedObjects (Context context, String[] args)throws FrameworkException {
		
		try {
			HashMap<?, ?> programMap = (HashMap<?, ?>) JPO.unpackArgs(args);
			String strObjectId = (String)programMap.get(CharacteristicMasterConstants.OBJECT_ID);
			StringList slExcludedIds = new StringList();
			MapList mlTestMethods =  new MapList();
			if (UIUtil.isNotNullAndNotEmpty(strObjectId)) {
				DomainObject dObject = new DomainObject(strObjectId);
				if(dObject.isKindOf(context, ENOCharacteristicEnum.CharacteristicType.CHARACTERISTIC_MASTER.getType(context))){
				ENOICharacteristicMaster charMaster = ENOCharacteristicFactory.getCharacteristicMasterById(context, strObjectId);
				mlTestMethods = charMaster.getConnectedTestMethods(context);
				}else if(dObject.isKindOf(context, ENOCharacteristicEnum.CharacteristicType.CHARACTERISTIC.getType(context))){
					ENOICharacteristic   characteristic = ENOCharacteristicFactory.getCharacteristicById(context, strObjectId);
					mlTestMethods = characteristic.getConnectedTestMethods(context);
				}
				Iterator itr = mlTestMethods.iterator();
				while(itr.hasNext()){
					Map mp = (Map) itr.next();
					slExcludedIds.add((String)mp.get(DomainConstants.SELECT_ID));
				}
			}
			return slExcludedIds;
		}
		catch (Exception e){
			throw new FrameworkException(e.getLocalizedMessage());
		}
	}
	
	/**Method to get Characteristic Unified Typing attributes on Characteristic Master properties page.  
	 * @author j2j
	 * @param context
	 * @param args
	 * @throws FrameworkException
	 */    
	public MapList getCharacteristicUTAttributesOnPropertyPage(Context context,String args [])throws FrameworkException
	{
		try {
			HashMap programMap 		= (HashMap) JPO.unpackArgs(args);
			Map requestMap  = (Map) programMap.get(CharacteristicMasterConstants.REQUEST_MAP);
			MapList fieldMapList 		= new MapList();
			String objId 			= (String)requestMap.get(CharacteristicMasterConstants.OBJECT_ID);			
			
			ENOICharacteristicMaster iCharMaster = ENOCharacteristicFactory.getCharacteristicMasterById(context, objId);
			String charOID =  iCharMaster.getCharacteristic().getId(context);
			Object []arg = {context, charOID};
			Class<?> []argClass = {matrix.db.Context.class, String.class};
			
			/*Class<?> cmServiceClass = ${CLASSNAME}.class.getClassLoader().loadClass("com.dassault_systemes.enovia.characteristic.impl.CharacteristicServices");
			fieldMapList = (MapList) cmServiceClass.getMethod("getCharacteristicUTAttributes", argClass).invoke(null, arg);*/
			Class<?> cmServiceClass = ENOCharacteristicMasterUIBase_mxJPO.class.getClassLoader().loadClass(serviceClass);
			fieldMapList = (MapList)cmServiceClass.getMethod("getCharacteristicUTAttributes", argClass).invoke(null, arg);
			return fieldMapList;
		} catch (Exception e) {
			e.printStackTrace();
			throw new FrameworkException(e.getLocalizedMessage());
		}
	}
	
	/**Method to get Characteristic Unified Typing attribute ranges.  
	 * @author j2j
	 * @param context
	 * @param args
	 * @return Map
	 * @throws FrameworkException
	 */
	public Map getUTAttributeRanges(Context context, String args[]) throws FrameworkException{
		Map returnMap = new HashMap();
		StringList attrList = new StringList();
		try {
			Map programMap  	   	= JPO.unpackArgs(args);
			Map fieldMap   	   	= (Map) programMap.get(CharacteristicMasterConstants.FIELD_MAP);
			String strFiledName	= (String) fieldMap.get(CharacteristicMasterConstants.SELECT_NAME);

			Map settingsMap		= (Map) fieldMap.get(CharacteristicMasterConstants.SETTINGS);
			String attrName		= (String) settingsMap.get(CharacteristicMasterConstants.ADMIN_TYPE);

			if(UIUtil.isNullOrEmpty(attrName)) {
				attrName = FrameworkUtil.getAliasForAdmin(context, CharacteristicMasterConstants.TAG_ATTRIBUTE, strFiledName, true);
			}
			attrName = PropertyUtil.getSchemaProperty(context, attrName);
			AttributeType attType = new AttributeType(attrName);

			attType.open (context);

			StringList attChoiceList  = attType.getChoices (context);
			if((attChoiceList == null || attChoiceList.isEmpty())&& CharacteristicMasterConstants.BOOLEAN.equalsIgnoreCase(attType.getDataType(context))){
				StringList booleanList = new StringList(2);
				booleanList.add(CharacteristicMasterUtil.getProperty(context, "CharacteristicMaster.Boolean.true"));
				booleanList.add(CharacteristicMasterUtil.getProperty(context, "CharacteristicMaster.Boolean.false"));
				attChoiceList  = booleanList;
				attrList = booleanList;
			}else{
				attrList = EnoviaResourceBundle.getAttrRangeI18NStringList(context, attrName, attChoiceList, context.getSession().getLanguage());
			}
			attType.close(context);
			returnMap.put(CharacteristicMasterConstants.FIELD_CHOICES, attChoiceList);
			returnMap.put(CharacteristicMasterConstants.FIELD_DISPLAY_CHOICES, attrList);
		} catch (Exception e) {
			e.printStackTrace();
			throw new FrameworkException(e.getLocalizedMessage());
		}
		return returnMap;		
	}
	
	/**Method to get Characteristic Unified Typing attribute value on Characteristic Master properties page.  
	 * @author j2j
	 * @param context
	 * @param args
	 * @return String
	 * @throws FrameworkException
	 */
	public String getCharacteristicUTAttributeValue(Context context, String args[]) throws FrameworkException{
		String returnValue = null;
		try{
			HashMap programMap 		= (HashMap) JPO.unpackArgs(args);
			
			Map requestMap  = (Map) programMap.get(CharacteristicMasterConstants.REQUEST_MAP);
			String objId 	= (String)requestMap.get(CharacteristicMasterConstants.OBJECT_ID);

			Map fieldMap	= (Map) programMap.get(CharacteristicMasterConstants.FIELD_MAP);
			String attrName	= (String) fieldMap.get(CharacteristicMasterConstants.SELECT_NAME);
		
			ENOICharacteristicMaster iCharMaster = ENOCharacteristicFactory.getCharacteristicMasterById(context, objId);
			String charOID =  iCharMaster.getCharacteristic().getId(context);
			Object []arg = {context, charOID, attrName};
			Class<?> []argClass = {matrix.db.Context.class, String.class, String.class};
			Class<?> cmServiceClass = ENOCharacteristicMasterUIBase_mxJPO.class.getClassLoader().loadClass(serviceClass);
			returnValue = (String)cmServiceClass.getMethod("getCharacteristicUTAttributeValue", argClass).invoke(null, arg);
			
		}catch(Exception e){
			e.printStackTrace();
			throw new FrameworkException(e.getLocalizedMessage());
		}
		return returnValue;
	}
	
	/**Method to update Characteristic Unified Typing attributes on edit.  
	 * @author j2j
	 * @param context
	 * @param args
	 * @return void
	 * @throws FrameworkException
	 */
	public void updateCharacteristicUTAttributeValue(Context context, String args[]) throws FrameworkException{
		try{
			HashMap programMap 		= (HashMap) JPO.unpackArgs(args);
			Map paramMap  = (Map) programMap.get(CharacteristicMasterConstants.PARAM_MAP);
			String objId 			= (String)paramMap.get(CharacteristicMasterConstants.OBJECT_ID);
			String attrNewValue = (String)paramMap.get(CharacteristicMasterConstants.NEW_VALUE);
			
			Map fieldMap	= (Map) programMap.get(CharacteristicMasterConstants.FIELD_MAP);
			String attrName	= (String) fieldMap.get(CharacteristicMasterConstants.SELECT_NAME);
			
			ENOICharacteristicMaster iCharMaster = ENOCharacteristicFactory.getCharacteristicMasterById(context, objId);
			String charOID =  iCharMaster.getCharacteristic().getId(context);
			Object []arg = {context, charOID, attrName, attrNewValue};
			Class<?> []argClass = {matrix.db.Context.class, String.class, String.class, String.class};
			Class<?> cmServiceClass = ENOCharacteristicMasterUIBase_mxJPO.class.getClassLoader().loadClass(serviceClass);
			cmServiceClass.getMethod("updateCharacteristicUTAttributeValue", argClass).invoke(null, arg);
			
		}catch(Exception e){
			e.printStackTrace();
			throw new FrameworkException(e.getLocalizedMessage());
			
		}
	}

	/**
	 * This method will check whether the IsMandatoryCharacteristic column should be displayed or not.
	 * @param context the eMatrix <code>Context</code> object
	 * @param String [] args Argument List to the method.
	 * @return boolean true or false based on the page context
	 * @throws Exception if the operation fails
	 * @since Criteria 2016x.FD03
	 * 
	 */
	
	public boolean showIsMandatoryColumn(Context context, String[] args) throws Exception {
		boolean disaplyfield = true;
		HashMap paramMap = (HashMap)JPO.unpackArgs(args);
		String contexPage = (String)paramMap.get(CriteriaConstants.MODE);
		if(CharacteristicMasterConstants.ADD_EXISTING_MANDATORY_CM.equalsIgnoreCase(contexPage) ||
				CharacteristicMasterConstants.ADD_EXISTING_OPTIONAL_CM.equalsIgnoreCase(contexPage)) {
			disaplyfield = false;
		}
		return disaplyfield;
	}
	
	/*EI8: IR-478650-3DEXPERIENCER2017x: Start*/
	public String displayAppropriateInputField(Context context, String[] args) throws Exception {
		
		HashMap paramMap = (HashMap) JPO.unpackArgs(args);
		HashMap fieldMap = (HashMap) paramMap.get(CharacteristicMasterConstants.FIELD_MAP);
		String fieldName = (String) fieldMap.get("name");
		
		HashMap settingsMap = (HashMap) fieldMap.get(CharacteristicMasterConstants.SETTINGS);
		String symbolicName = (String) settingsMap.get(CharacteristicMasterConstants.ADMIN_TYPE);
		
		String actualName = PropertyUtil.getSchemaProperty(context, symbolicName);
		
		StringList ranges = CharacteristicMasterUtil.getAttributeRanges(context, actualName);
		
		return CharacteristicMasterUtil.getInputHTML(context, fieldName, actualName, ranges, null);
	}
	/*EI8: IR-478650-3DEXPERIENCER2017x: End*/
	
	public HashMap<String, StringList> getCharacteristicCategoryRanges(Context context, String[] args) throws Exception {
		HashMap<String, StringList> returnMap = new HashMap<String, StringList>();
		HashMap paramMap = (HashMap) JPO.unpackArgs(args);
		HashMap fieldMap = (HashMap) paramMap.get(CharacteristicMasterConstants.FIELD_MAP);
		HashMap settingsMap = (HashMap) fieldMap.get(CharacteristicMasterConstants.SETTINGS);
		String symbolicName = (String) settingsMap.get(CharacteristicMasterConstants.ADMIN_TYPE);
		String actualName = PropertyUtil.getSchemaProperty(context, symbolicName);
		StringList actualRanges = CharacteristicMasterUtil.getAttributeRanges(context, actualName);
		
		StringList translatedRanges = CharacteristicMasterUtil.getCharacteristicCategoryRangesFromPage(context, false);
		
		Map sortedRangeMap = CharacteristicMasterUtil.sortRanges(actualRanges, translatedRanges);
		
		returnMap.put(CharacteristicMasterConstants.FIELD_CHOICES, (StringList) sortedRangeMap.get("SortedActualRanges"));
		returnMap.put(CharacteristicMasterConstants.FIELD_DISPLAY_CHOICES, (StringList) sortedRangeMap.get("SortedTranslatedRanges"));
		return returnMap;
	}

	/*EI8: Test Methods Management: Start*/
	public String getTMSearchQuery(Context context, String[] args) {
		
		String allowedTypes = EnoviaResourceBundle.getProperty(context, "enoCharacteristicMaster", context.getLocale(), "Characteristic.Preferences.ValidTestMethodList");
		
		String searchQuery = "TYPES=".concat(allowedTypes)
				.concat(":POLICY=policy_IPMSpecification,policy_Document,policy_ServiceDefinitionContent,policy_ServiceImplementationContent")
				.concat(":CURRENT=policy_IPMSpecification.state_Release,policy_Document.state_RELEASED,policy_ServiceDefinitionContent.state_Exists,policy_ServiceImplementationContent.state_Exists")
				.concat(":LATESTREVISION=true");
		
		return searchQuery;
	}
	/*EI8: Test Methods Management: End*/
	
	public StringList getCharacteristicMasterOutputChooser(Context context, String[] args) throws Exception {
    	StringList vector = new StringList();
		Map programMap 		= JPO.unpackArgs(args);
		MapList objectList = (MapList)programMap.get(CharacteristicMasterConstants.OBJECT_LIST);
		String objectId = CharacteristicMasterConstants.EMPTY_STRING;
		for(Object map : objectList) {
			Map characteristic = (Map) map;
			objectId = (String)characteristic.get(CriteriaConstants.SELECT_ID);	
			
			StringList criteriaIDList = (StringList)characteristic.get(CriteriaUtil.stringConcat("to[", ENOCriteriaEnum.Relationship.CRITERIA_OUTPUT.get(context), "].from.id"));
			if(criteriaIDList==null || criteriaIDList.isEmpty()){
				vector.add("");
				continue;
			}
			StringList critNameList = (StringList)characteristic.get(CriteriaUtil.stringConcat("to[", ENOCriteriaEnum.Relationship.CRITERIA_OUTPUT.get(context), "].from.name"));
			
			StringBuffer sbChooser = null;
			if(critNameList.size()>1){
				sbChooser = new StringBuffer();
				sbChooser.append("<a href=\"javascript:showModalDialog('");
				sbChooser.append("../common/emxIndentedTable.jsp?table=CharacteristicMasterCharacteristics&amp;program=ENOCharacteristicMasterUI:getCharacteristicMasterOutputs&amp;Export=true&amp;massPromoteDemote=true&amp;showRMB=false");
				sbChooser.append("&amp;objectId=").append(XSSUtil.encodeForJavaScript(context, objectId));
				sbChooser.append("',575,350)\"><input type=\"button\" value=\"...\" name=\"btnCriteriaOutput\" /></a>");
				vector.add(sbChooser.toString());
			} else {
				sbChooser = new StringBuffer();
				sbChooser.append("<a href=\"javascript:showModalDialog('");
				sbChooser.append("../common/emxTree.jsp?mode=insert&amp;")
						.append("objectId=").append(XSSUtil.encodeForJavaScript(context, criteriaIDList.get(0).toString()))
						.append("',575,350)\" title='")
						.append(critNameList.get(0))
						.append("'>")
						.append(critNameList.get(0))
						.append("</a>");
				vector.add(sbChooser.toString());
				
			}			
		}
		
    	return vector;
    }
	
	@com.matrixone.apps.framework.ui.ProgramCallable
  	public static MapList getCharacteristicMasterOutputs(Context context, String[] args) throws Exception {
  		MapList mpReturnList = new MapList();
  		Map<?, ?> programMap = (HashMap<?, ?>)JPO.unpackArgs(args);
	  	String objectId  = (String)programMap.get(CharacteristicMasterConstants.OBJECT_ID);

	  	StringList objSelects = new StringList(CharacteristicMasterConstants.SELECT_ID);
	  	if(UIUtil.isNotNullAndNotEmpty(objectId)){
			
			ENOICharacteristicMaster iMaster = ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId);
			mpReturnList = iMaster.getRelatedCriteria(context, objSelects, CharacteristicMasterConstants.EMPTY_STRING );
			CriteriaUI.updateCustomStyleForIsMandatoryField(context, mpReturnList);
		}
	  	return mpReturnList;
  	}
	
	/*NPA3: IR-542694 - Method to hide minimum and maximum value fields on characteristic master properties page for string,boolean and subjectivity dimension.*/
	public boolean isVisibleMinMax(Context context, String args[]) throws Exception{
		HashMap<?, ?> programMap	= (HashMap<?, ?>)JPO.unpackArgs(args);
		String objectId = (String)programMap.get(CharacteristicMasterConstants.PARENT_OID);
		if(UIUtil.isNullOrEmpty(objectId)){
			objectId= (String) programMap.get(CharacteristicMasterConstants.OBJECT_ID);
		}
		ENOICharacteristicMaster charMaster = (ENOICharacteristicMaster) ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId);
		String val  = charMaster.getDimension(context);
		if(val.equalsIgnoreCase(CharacteristicMasterConstants.SUBJECTIVITY)||val.equalsIgnoreCase(CharacteristicMasterConstants.STRING)||val.equalsIgnoreCase(CharacteristicMasterConstants.BOOLEAN)) {
			return false;
		}
		return true;
	}
	
	  public static Vector getNameAndRevision(Context context, String[] args) throws Exception {

		  Map<?, ?> programMap = JPO.unpackArgs(args);
		  MapList objectList = (MapList) programMap.get(CharacteristicMasterConstants.OBJECT_LIST);
		  Vector displayValues = new Vector<Object>();
		  
		  Map<?,?> objectListMap = null;
		  
		  Iterator<Map<String,Object>> objectListItr = objectList.iterator();
		  while(objectListItr.hasNext()) {
			  objectListMap = objectListItr.next();
			  
			  String name = (String) objectListMap.get(CharacteristicMasterConstants.NAME.toLowerCase());
			  String revision = (String) objectListMap.get(CharacteristicMasterConstants.REVISION);
			  String relationship = (String) objectListMap.get(CharacteristicMasterConstants.RELATIONSHIP.toLowerCase());
			  
			  if(ENOCharacteristicEnum.CharacteristicRelationships.DERIVED_CHARACTERISTIC.getRelationship(context).equals(relationship)) {
				  displayValues.add(name.concat(" - ").concat(revision));
			  }
			  
		  }
		  return displayValues;
	  }
	  
	  public static Vector getParameterPartBasics(Context context, String[] args) throws Exception {

		  Map<?,?> programMap = JPO.unpackArgs(args);
		  String relationship = null;
		  String columnValue = null;

		  Map<?,?> objectListMap = null;
		  Vector<Object> returnVector = new Vector<Object>();
		  
		  Map columnMap = (Map) programMap.get(CharacteristicMasterConstants.COLUMN_MAP);
		  String columnName = (String) columnMap.get(CharacteristicMasterConstants.NAME.toLowerCase());
		  
		  MapList objectList = (MapList) programMap.get(CharacteristicMasterConstants.OBJECT_LIST);
		  Iterator<Map<String,Object>> itr = objectList.iterator();
		  while (itr.hasNext()) {
			  objectListMap = itr.next();
			  
			  relationship = (String) objectListMap.get(CharacteristicMasterConstants.RELATIONSHIP.toLowerCase());
			  
			  if(ENOCharacteristicEnum.CharacteristicRelationships.DERIVED_CHARACTERISTIC.getRelationship(context).equals(relationship)) {
				  columnValue = (String) objectListMap.get("to[".
						  concat(ENOCharacteristicEnum.CharacteristicRelationships.PARAMETER_AGGREGATION.getRelationship(context))
						  .concat("].from.").concat(columnName.toLowerCase()));
				  String policyValue = (String)objectListMap.get("to[".concat(ENOCharacteristicEnum.CharacteristicRelationships.PARAMETER_AGGREGATION.getRelationship(context)).concat("].from.").concat(DomainConstants.SELECT_POLICY));
				  String typeValue = (String)objectListMap.get("to[".concat(ENOCharacteristicEnum.CharacteristicRelationships.PARAMETER_AGGREGATION.getRelationship(context)).concat("].from.").concat(DomainConstants.SELECT_TYPE));

				  if(columnName.equalsIgnoreCase(DomainConstants.SELECT_CURRENT)){
					  columnValue = EnoviaResourceBundle.getStateI18NString(context, policyValue, columnValue, context.getLocale().getLanguage());
			      }else if(columnName.equalsIgnoreCase(DomainConstants.SELECT_TYPE)){
					  columnValue = EnoviaResourceBundle.getTypeI18NString(context, typeValue, context.getLocale().getLanguage());

			     }
				} else {
				  columnValue = (String) objectListMap.get(columnName.toLowerCase());
			  }
			  
			  returnVector.add(columnValue);
		  
		  }

		  return returnVector;
	  }


	  public static Vector getParameterPartAttributes(Context context, String[] args) throws Exception {

		  Map<?, ?> programMap = JPO.unpackArgs(args);
		  String relationship = null;
		  String columnValue = null;

		  Vector<String> returnVector = new Vector<String>();
		  
		  Map<?,?> columnMap = (Map<?, ?>) programMap.get(CharacteristicMasterConstants.COLUMN_MAP);
		  String columnName = (String) columnMap.get(CharacteristicMasterConstants.NAME.toLowerCase());
		  
		  MapList objectList = (MapList) programMap.get(CharacteristicMasterConstants.OBJECT_LIST);
		  Iterator<Map<String,Object>> itr = objectList.iterator();
		  while (itr.hasNext()) {
			  Map objectListMap = itr.next();
			  
			  relationship = (String) objectListMap.get(CharacteristicMasterConstants.RELATIONSHIP.toLowerCase());
			  
			  if(ENOCharacteristicEnum.CharacteristicRelationships.DERIVED_CHARACTERISTIC.getRelationship(context).equals(relationship)) {
				  columnValue = (String) objectListMap.get("to[".
						  concat(ENOCharacteristicEnum.CharacteristicRelationships.PARAMETER_AGGREGATION.getRelationship(context))
						  .concat("].from.attribute[").concat(columnName).concat("]"));
			  } else {
				  columnValue = (String) objectListMap.get("attribute[".concat(columnName).concat("]"));
			  }

			  returnVector.add(columnValue);
			  
		  }

		  return returnVector;
	  }
	  
	  @com.matrixone.apps.framework.ui.ProgramCallable
		public MapList getParameterUsageParts(Context context, String[] args)
				throws Exception {
			
			Map<?, ?> programMap = JPO.unpackArgs(args);
			MapList usageParts = new MapList();
			String objectId = (String) programMap.get(CharacteristicMasterConstants.OBJECT_ID);
			
			StringList objectSelects = StringList.create(DomainConstants.SELECT_ID,
														 DomainConstants.SELECT_TYPE,
														 DomainConstants.SELECT_NAME,
														 DomainConstants.SELECT_REVISION,
														 ENOCharacteristicEnum.CharacteristicAttributes.TITLE.getAttributeSelect(context),
														 DomainConstants.SELECT_DESCRIPTION,
														 DomainConstants.SELECT_CURRENT);
			
			DomainObject domObj = DomainObject.newInstance(context, objectId);
			String type = (String)domObj.getInfo(context, DomainConstants.SELECT_TYPE);
			if(ENOCharacteristicEnum.CharacteristicType.CHARACTERISTIC.getType(context).equals(type)) {
				ENOICharacteristic iCharacteristic = (ENOICharacteristic) ENOCharacteristicFactory.getCharacteristicById(context, objectId);
				usageParts = iCharacteristic.getParameterUsageParts(context, objectSelects, DomainConstants.EMPTY_STRING);
			}
			return usageParts;
		}


}


