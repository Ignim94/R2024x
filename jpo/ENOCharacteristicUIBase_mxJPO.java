import static com.dassault_systemes.enovia.characteristic.util.CharacteristicMasterConstants.FIELD_CHOICES;
import static com.dassault_systemes.enovia.characteristic.util.CharacteristicMasterConstants.FIELD_DISPLAY_CHOICES;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import java.util.Vector;

import com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicEnum;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicEnum.CharacteristicAttributes;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicEnum.CharacteristicRelationships;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicFactory;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOICharacteristic;
import com.dassault_systemes.enovia.characteristic.interfaces.ENOICharacteristicsUtil;
import com.dassault_systemes.enovia.characteristic.util.CharacteristicMasterConstants;
import com.dassault_systemes.enovia.characteristic.util.CharacteristicMasterUtil;
import com.dassault_systemes.knowledge_itfs.IKweType;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.framework.ui.UIUtil;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;

public class ENOCharacteristicUIBase_mxJPO extends emxParameterCreation_mxJPO{
	public ENOCharacteristicUIBase_mxJPO(Context context, String[] args) throws Exception {
		super(context,args);
	}
	
	@com.matrixone.apps.framework.ui.ProgramCallable
	public MapList getAssociatedCharacteristics(Context context, String[] args) throws Exception {
		MapList mlChars		= null;
		Map<?,?> requestMap	= JPO.unpackArgs(args);
		String objectId 	= (String) requestMap.get("objectId");
		DomainObject doObj	= DomainObject.newInstance(context,objectId);
		StringList busSelects = StringList.create(DomainObject.SELECT_ID);
		
		mlChars	= doObj.getRelatedObjects (context,
                "ParameterAggregation,ParameterUsage",
                "PlmParameter",
                busSelects,
                null,
                false,
                true,
                (short) 1,
                DomainObject.EMPTY_STRING,
                null,
                0);
		
		return mlChars;
	}
	public MapList getCharacteristicMaster(Context context, String[] args) {
		MapList mlChars	= null;
		
		return mlChars;
	}
	//SRR7: TO BE REMOVED
	public StringList getSequenceOrder (Context context, String[] args) {
//		return getColumnValues(context, args, ENOICharacteristic::getSequenceOrder);
		MapList objList		= getObjectList(args);	
		StringList slResult	= new StringList();
		String objectId		= null;
		String relName		= null;
		Map<?,?> map 		= null;
		
		try {
			for (Iterator<Map<String,Object>> itr = objList.iterator(); itr.hasNext(); ) {
				map				= itr.next();
				objectId		= (String) map.get(DomainObject.SELECT_ID);
				relName			= (String) map.get(DomainObject.KEY_RELATIONSHIP);
//				characteristic	= ENOCharacteristicFactory.getParameterAggregationById(context, objectId);
				DomainObject dObj	= DomainObject.newInstance(context, objectId);
				
				/* EI8: FUN110793 - Support ParameterAggregation as Compositional - IR-905110: Start */
				if(CharacteristicMasterUtil.isCompositional(context, CharacteristicRelationships.PARAMETER_AGGREGATION.getRelationship(context)))
					slResult.add(dObj.getInfo(context, CharacteristicAttributes.SEQUENCE_ORDER.getAttributeSelect(context)));
				else
					slResult.add(dObj.getInfo(context, "to["+relName+"]."+CharacteristicAttributes.SEQUENCE_ORDER.getAttributeSelect(context)));
				/* EI8: FUN110793 - Support ParameterAggregation as Compositional - IR-905110: End */
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return slResult;
	}
	//SRR7: TO BE REMOVED
	public StringList getDimensionColumn(Context context, String[] args) {
		MapList objList		= getObjectList(args);	
		StringList slResult	= new StringList();
		String objectId		= null;
		Map<?,?> map 		= null;
		ENOICharacteristic characteristic	= null;
		
		try {
			for (Iterator<Map<String,Object>> itr = objList.iterator(); itr.hasNext(); ) {
				map				= itr.next();
				objectId		= (String) map.get(DomainObject.SELECT_ID);
				characteristic	= ENOCharacteristicFactory.getCharacteristicById(context, objectId);
				
				slResult.add(characteristic.getCharacteristicDimension(context));
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return slResult;
	}
	//SRR7: TO BE REMOVED
	public StringList getDisplayUnitColumn(Context context, String[] args) {
		MapList objList		= getObjectList(args);
		StringList slResult	= new StringList();
		String objectId		= null;
		Map<?,?> map 		= null;
		ENOICharacteristic characteristic	= null;
		
		try {
			for (Iterator<Map<String,Object>> itr = objList.iterator(); itr.hasNext(); ) {
				map				= itr.next();
				objectId		= (String) map.get(DomainObject.SELECT_ID);
				characteristic	= ENOCharacteristicFactory.getCharacteristicById(context, objectId);
				
				slResult.add(characteristic.getCharacteristicDisplayUnit(context));
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return slResult;
	}
	//SRR7: TO BE REMOVED
	public StringList getMaximalValueColumn(Context context, String[] args) {
		MapList objList		= getObjectList(args);
		StringList slResult	= new StringList();
		String objectId		= null;
		Map<?,?> map 		= null;
		ENOICharacteristic characteristic	= null;
		
		try {
			for (Iterator<Map<String,Object>> itr = objList.iterator(); itr.hasNext(); ) {
				map				= itr.next();
				objectId		= (String) map.get(DomainObject.SELECT_ID);
				characteristic	= ENOCharacteristicFactory.getCharacteristicById(context, objectId);
				
				slResult.add(characteristic.getMaximalValue(context));
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return slResult;
	}
	//SRR7: TO BE REMOVED
	public StringList getMinimalValueColumn(Context context, String[] args) {
		MapList objList		= getObjectList(args);
		StringList slResult	= new StringList();
		String objectId		= null;
		Map<?,?> map 		= null;
		ENOICharacteristic characteristic	= null;
		
		try {
			for (Iterator<Map<String,Object>> itr = objList.iterator(); itr.hasNext(); ) {
				map				= itr.next();
				objectId		= (String) map.get(DomainObject.SELECT_ID);
				characteristic	= ENOCharacteristicFactory.getCharacteristicById(context, objectId);
				
				slResult.add(characteristic.getMinimalValue(context));
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return slResult;
	}
	public StringList getMissedTargetAction(Context context, String[] args) {
		StringList slResult	= null;
		
		return slResult;
	}
	//SRR7: TO BE REMOVED
	public StringList getNominalValueColumn(Context context, String[] args) {
		MapList objList		= getObjectList(args);
		StringList slResult	= new StringList();
		String objectId		= null;
		Map<?,?> map 		= null;
		ENOICharacteristic characteristic	= null;
		
		try {
			for (Iterator<Map<String,Object>> itr = objList.iterator(); itr.hasNext(); ) {
				map				= itr.next();
				objectId		= (String) map.get(DomainObject.SELECT_ID);
				characteristic	= ENOCharacteristicFactory.getCharacteristicById(context, objectId);
				
				slResult.add(characteristic.getNominalValue(context));
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return slResult;
	}
	//SRR7: TO BE REMOVED
	public StringList getNotesColumn(Context context, String[] args) {
		StringList slResult	= null;
		
		return slResult;
	}
	//SRR7: TO BE REMOVED
	public StringList getOriginatedFrom(Context context, String[] args) {
		StringList slResult	= null;
		
		return slResult;
	}
	//SRR7: TO BE REMOVED
	public StringList getPriorityColumn(Context context, String[] args) {
		StringList slResult	= null;
		
		return slResult;
	}
	//SRR7: TO BE REMOVED
	public StringList getRoleColumns(Context context, String[] args) {
		StringList slResult	= null;
		
		return slResult;
	}
	//Need to check the use-case with characteristics which have more than one TM
	public MapList getTestMethodColumn(Context context, String[] args) {
		MapList mlChars	= null;
		
		return mlChars;
	}

	private Map<?,?> unpackArgs(String[] args) {
		try {
			return JPO.unpackArgs(args);
		} catch (Exception e) {
			//TODO change to Characteristic Exception
			e.printStackTrace();
		}
		return new HashMap<>();
	}
	
	private MapList getObjectList(String[] args) {
		return (MapList)unpackArgs(args).get(CharacteristicMasterConstants.OBJECT_LIST);
	}
	
	  public Vector getDimensionUnitPrecision(Context context, String[] args) throws Exception {
		  
		  MapList objectList		= getObjectList(args);
		  Vector returnVector = new Vector();		  
		  String columnValue = null;
		  
		  StringList precisionlessDimension = new StringList();
		  precisionlessDimension.add(EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", context.getLocale(), "emxFramework.Interface.StringParameter"));
		  precisionlessDimension.add(EnoviaResourceBundle.getProperty(context, "enoCharacteristicMasterStringResource", context.getLocale(), "CharacteristicMaster.Attribute.COLOR"));
		  precisionlessDimension.add(EnoviaResourceBundle.getProperty(context, "enoCharacteristicMasterStringResource", context.getLocale(), "CharacteristicMaster.Attribute.SUBJECTIVE"));
		  
		  for(Object objectMap: objectList ) {
			  Map charMap = (Map) objectMap;
			  String objectId = (String) charMap.get(CharacteristicMasterConstants.ID);
			  ENOICharacteristic iCharacteristic = (ENOICharacteristic) ENOCharacteristicFactory.getCharacteristicById(context, objectId);
			  String dimension = iCharacteristic.getCharacteristicDimension(context);
			  
			  String displayUnit = (String)  charMap.get(ENOCharacteristicEnum.CharacteristicAttributes.PLM_PARAM_DISPLAY_UNIT.getAttributeSelect(context));
			  String precision = (String) charMap.get(ENOCharacteristicEnum.CharacteristicAttributes.MEASUREMENT_PRECISION.getAttributeSelect(context));
			  
			  columnValue = dimension.trim();
			  if(UIUtil.isNotNullAndNotEmpty(displayUnit)) {
				  columnValue = columnValue.concat(" - ").concat(displayUnit);
			  }

			  if(!precisionlessDimension.contains(dimension.trim()) && UIUtil.isNotNullAndNotEmpty(precision)) {
				  columnValue = columnValue.concat(" (").concat(precision).concat(")");
			  }
			  returnVector.add(columnValue);
		  }

		  return returnVector;
	  }
	  
	  public Vector getPrecision(Context context, String[] args) throws Exception {
		  
		  MapList objectList  = getObjectList(args);
		  Vector returnVector = new Vector();		  
		  
		  StringList precisionlessDimension = new StringList();
		  precisionlessDimension.add(EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", context.getLocale(), "emxFramework.Interface.StringParameter"));
		  precisionlessDimension.add(EnoviaResourceBundle.getProperty(context, "enoCharacteristicMasterStringResource", context.getLocale(), "CharacteristicMaster.Attribute.COLOR"));
		  precisionlessDimension.add(EnoviaResourceBundle.getProperty(context, "enoCharacteristicMasterStringResource", context.getLocale(), "CharacteristicMaster.Attribute.SUBJECTIVE"));
		  
		  for(Object objectMap: objectList ) {
			  Map charMap = (Map) objectMap;
			  String precision = (String) charMap.get(ENOCharacteristicEnum.CharacteristicAttributes.MEASUREMENT_PRECISION.getAttributeSelect(context));
			  returnVector.add(precision);
		  }

		  return returnVector;
	  }
	  
		public Vector getValueAndUnits(Context context, String[] args) {
			MapList objectList		= getObjectList(args);
			Vector returnVector 	= new Vector();
			String objectId		= null;
			Map<?,?> map 		= null;
			ENOICharacteristic iCharacteristic	= null;
			
			try {
				for (Iterator<Map<String,Object>> itr = objectList.iterator(); itr.hasNext(); ) {
					map				= itr.next();
					objectId		= (String) map.get(DomainObject.SELECT_ID);
					iCharacteristic	= ENOCharacteristicFactory.getCharacteristicById(context, objectId);
					
					String value = iCharacteristic.getNominalValue(context);
					String dimName = iCharacteristic.getCharacteristicDimensionName(context);
					String valType = iCharacteristic.getValuationType(context).toString();
					
					if(CharacteristicMasterConstants.STRING_PARAMETER.equals(dimName) 
							&& CharacteristicMasterConstants.MULTI.equals(valType)) {
						StringList multiValue = iCharacteristic.getMultiValue(context);
						returnVector.add(multiValue);

					}else {
					String units = iCharacteristic.getCharacteristicDisplayUnit(context);// (String)  map.get(ENOCharacteristicEnum.CharacteristicAttributes.PLM_PARAM_DISPLAY_UNIT.getAttributeSelect(context));
					returnVector.add(value.concat(" ").concat(units));
					}

				}
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			return returnVector;
		}
	  
	  public Vector getMinMaxValues(Context context, String[] args) throws Exception {
		  
		  MapList objectList		= getObjectList(args);
		  Vector returnVector = new Vector();		  
		  
		  for(Object objectMap: objectList) {
			Map charMap = (Map) objectMap;
			String objectId		= (String) charMap.get(DomainObject.SELECT_ID);
			ENOICharacteristic iCharacteristic	= ENOCharacteristicFactory.getCharacteristicById(context, objectId);
			
			String min = iCharacteristic.getMinimalValue(context);
			String max = iCharacteristic.getMaximalValue(context);
			
			returnVector.add(min.concat(" - ").concat(max));
		  }
		  
		  return returnVector; 
	  }
	  
	  public Vector getNotesAndTargetAction(Context context, String[] args) {
		  
		  MapList objectList = getObjectList(args);
		  Vector columnValue = new Vector();
		  
		  String language = context.getSession().getLanguage();
		  
		  String notesLabel = EnoviaResourceBundle.getProperty(context, "enoCharacteristicStringResource", new Locale(language), "Characteristic.SpecViewCellLabel.CharacteristicNotes");
		  String targetActionLabel = EnoviaResourceBundle.getProperty(context, "enoCharacteristicStringResource", new Locale(language), "Characteristic.SpecViewCellLabel.MissedTargetActionRequired");
		  
		  for(Object objectMap: objectList ) {

			  Map charMap = (Map) objectMap;

			  String notes = (String) charMap.get(ENOCharacteristicEnum.CharacteristicAttributes.CHARACTERISTIC_NOTES.getAttributeSelect(context));
			  String targetAction = (String) charMap.get(ENOCharacteristicEnum.CharacteristicAttributes.MISSED_TARGET_ACTION.getAttributeSelect(context));

			  String targetActionTranslated = EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", new Locale(language), "emxFramework.Range.Missed_Target_Action_Required.".concat(targetAction).replace(' ', '_'));
			  
			  StringBuffer html = new StringBuffer();
			  
			  if(UIUtil.isNotNullAndNotEmpty(notes)) {
				  html.append("<b>").append(notesLabel).append(':').append("</b>");
				  html.append(' ').append("<i>").append(notes).append("</i>").append("<br/><br/>");
			  }
			  
			  if(UIUtil.isNotNullAndNotEmpty(targetActionTranslated)) {
				  html.append("<b>").append(targetActionLabel).append(':').append("</b>");
				  html.append(' ').append("<i>").append(targetActionTranslated).append("</i>").append("<br/>");
			  }
			  
			  columnValue.add(html.toString());
		  }
		  
		  
		  return columnValue;
	  }
	  
	  public Vector getTitleDescription(Context context, String[] args) throws Exception {
		  
		  MapList objectList		= getObjectList(args);
		  Vector returnVector = new Vector();		 		  
		  
		  for(Object objectMap: objectList ) {
			  StringBuffer html = new StringBuffer();
			  Map charMap = (Map) objectMap;
			  String objectId = (String) charMap.get(CharacteristicMasterConstants.ID);
			  ENOICharacteristic iCharacteristic = (ENOICharacteristic) ENOCharacteristicFactory.getCharacteristicById(context, objectId);
			  String title = iCharacteristic.getTitle(context);
			  String desc = iCharacteristic.getDescription();
			  if(UIUtil.isNotNullAndNotEmpty(title)){
				  String localeTitle = EnoviaResourceBundle.getProperty(context, CharacteristicMasterConstants.CHARACTERISTIC_STRING_RESOURCE, context.getLocale(), "Characteristic.Common.Title");				  
				  html.append("<b>").append(localeTitle).append(':').append("</b>");
				  html.append(' ').append("<i>").append(title).append("</i>").append("<br/><br/>");

			  }
			  if(UIUtil.isNotNullAndNotEmpty(desc)){
				  String localeDesc = EnoviaResourceBundle.getProperty(context, CharacteristicMasterConstants.CHARACTERISTIC_STRING_RESOURCE, context.getLocale(), "Characteristic.Common.Description");
				  html.append("<b>").append(localeDesc).append(':').append("</b>");
				  html.append(' ').append("<i>").append(desc).append("</i>").append("<br/>");
			  }
			  returnVector.add(html.toString());
		  }

		  return returnVector;
	  }
	  
	  public Vector getPriorityAndAppliesTo(Context context, String[] args) throws Exception {
		  
		  MapList objectList  = getObjectList(args);
		  Vector returnVector = new Vector();		  
		  
		  String localeAppliesTo = EnoviaResourceBundle.getProperty(context, CharacteristicMasterConstants.CHARACTERISTIC_STRING_RESOURCE, context.getLocale(), "Characteristic.SpecViewCellData.AppliesTo");
		  String localeAppliesToBulk = EnoviaResourceBundle.getProperty(context, CharacteristicMasterConstants.CHARACTERISTIC_STRING_RESOURCE, context.getLocale(), "Characteristic.SpecViewCellData.AppliesToBulk");	
		  String localeAppliesToFinalPackage = EnoviaResourceBundle.getProperty(context, CharacteristicMasterConstants.CHARACTERISTIC_STRING_RESOURCE, context.getLocale(), "Characteristic.SpecViewCellData.AppliesToFinalPackage");	
		  String localeAppliesToInProcess = EnoviaResourceBundle.getProperty(context, CharacteristicMasterConstants.CHARACTERISTIC_STRING_RESOURCE, context.getLocale(), "Characteristic.SpecViewCellData.AppliesToInProcess");	
		  
		  for(Object objectMap: objectList ) {
			  StringBuffer html = new StringBuffer();
			  Map charMap = (Map) objectMap;
			  String priority = (String) charMap.get(ENOCharacteristicEnum.CharacteristicAttributes.PARAMETER_PRIORITY.getAttributeSelect(context));
			  String appliesToBulk = (String) charMap.get(ENOCharacteristicEnum.CharacteristicAttributes.APPLIES_TO_BULK.getAttributeSelect(context));
			  String appliesToFinalPackage = (String) charMap.get(ENOCharacteristicEnum.CharacteristicAttributes.APPLIES_TO_FINAL_PACKAGE.getAttributeSelect(context));
			  String appliesToInProcess = (String) charMap.get(ENOCharacteristicEnum.CharacteristicAttributes.APPLIES_TO_IN_PROCESS.getAttributeSelect(context));
			  if(UIUtil.isNotNullAndNotEmpty(priority)){
				  String localePriority = EnoviaResourceBundle.getProperty(context, CharacteristicMasterConstants.CHARACTERISTIC_STRING_RESOURCE, context.getLocale(), "Characteristic.Common.Priority");
				  html.append("<b>").append(localePriority).append(':').append("</b>");
				  html.append(' ').append("<i>").append(priority).append("</i>").append("<br/><br/>");

			  }			  			  
			 		
			  boolean appliesToBulkValue = Boolean.parseBoolean(appliesToBulk); 
			  boolean appliesToFinalPackageValue = Boolean.parseBoolean(appliesToFinalPackage); 
			  boolean appliesToInProcessValue = Boolean.parseBoolean(appliesToInProcess); 

			  if(UIUtil.isNotNullAndNotEmpty(appliesToBulk) || UIUtil.isNotNullAndNotEmpty(appliesToFinalPackage) || UIUtil.isNotNullAndNotEmpty(appliesToInProcess) ){
			  
				if(appliesToBulkValue||appliesToFinalPackageValue||appliesToInProcessValue) {
					  html.append("<b>").append(localeAppliesTo).append("</b>").append("<br/>");
				  }
				  
					  if(appliesToBulkValue) {
						  html.append(localeAppliesToBulk).append("<br/><br/>");
					  }
					  if(appliesToFinalPackageValue) {
					      html.append(localeAppliesToFinalPackage).append("<br/><br/>");
					  }
					  if(appliesToInProcessValue) {
						  html.append(localeAppliesToInProcess).append("<br/><br/>");
					  }
			  }

			  returnVector.add(html.toString());
		  }

		  return returnVector;
	  }
	  
	  public Vector getValueDimensionUnitsPrecision(Context context, String[] args) throws Exception {
		  
		  MapList objectList = getObjectList(args);
		  Vector returnVector = new Vector();		 		
		  
		  ENOICharacteristicsUtil charUtil 	= ENOCharacteristicFactory.getCharacteristicUtil(context);
		  HashMap<?,?> dimensionPreferences = charUtil.getDimensions(context);
		  StringList actualValues = (StringList) dimensionPreferences.get(FIELD_CHOICES);
		  StringList displayValues = (StringList) dimensionPreferences.get(FIELD_DISPLAY_CHOICES);
		  
		  for(Object objectMap: objectList ) {
			  StringBuffer html = new StringBuffer();
			  Map charMap = (Map) objectMap;
			  String objectId = (String) charMap.get(CharacteristicMasterConstants.ID);
			  ENOICharacteristic iCharacteristic = (ENOICharacteristic) ENOCharacteristicFactory.getCharacteristicById(context, objectId);

			  IKweType dim= iCharacteristic.getPlmDimension();	
			  String dimension = dim.getName();
			  
			  String dimNLSName="";
			  
			  int index = actualValues.indexOf(dimension);
			  if(index < 0) {
				  dimNLSName = dim.getNLSName(context);
			  }else {
				  dimNLSName = (String) displayValues.get(index);
			  }
			  
			  String value = iCharacteristic.getNominalValue(context);
			  if(CharacteristicMasterConstants.STRING_PARAMETER.equals(dimension) 
						&& CharacteristicMasterConstants.MULTI.equals(iCharacteristic.getValuationType(context).toString())) {
				  StringList sl = iCharacteristic.getMultiValue(context);
				  StringBuffer sb = new StringBuffer();
				  for (String eachVal : sl) {
					if (sb.length() > 0)
						sb.append("<br/>");
					sb.append(eachVal);
				}
				  //value = iCharacteristic.getMultiValue(context).join("<br/>"); -- UI is distorted when this is used
				  value = sb.toString();
			  }
			  String currentUnit = iCharacteristic.getCharacteristicDisplayUnit(context);
			  String precision = iCharacteristic.getMeasurementPrecision();
				
			  if(UIUtil.isNotNullAndNotEmpty(value)){
				  html.append(value).append("<br/><br/>");
			  }else {
				  html.append("&ndash;").append("<br/><br/>");
			  }
			  
			  if(UIUtil.isNotNullAndNotEmpty(precision)){
				  html.append(precision).append("<br/><br/>");
			  }else {
				  html.append("&ndash;").append("<br/><br/>");
			  }
			 
			  if(UIUtil.isNotNullAndNotEmpty(dimension)){
				  html.append(dimNLSName).append("&nbsp;");
				  
				  if(UIUtil.isNotNullAndNotEmpty(currentUnit)) {
					  html.append("&#40;").append(currentUnit).append("&#41;").append("</center>").append("<br/><br/>");

				  }else {
					  html.append("<br/><br/>");
				  }
			  }
			  
			  returnVector.add(html.toString());

			  }

		  return returnVector;
	  }
	  
	  public Vector getLowerTargets(Context context, String[] args) throws Exception {
		  
		  MapList objectList		= getObjectList(args);
		  Vector returnVector = new Vector();		 
		  String localeInclusive = EnoviaResourceBundle.getProperty(context, CharacteristicMasterConstants.CHARACTERISTIC_STRING_RESOURCE, context.getLocale(), "Characteristic.Common.Inclusive");				  
		  
		  for(Object objectMap: objectList ) {
			  StringBuffer html = new StringBuffer();
			  Map charMap = (Map) objectMap;
			  String objectId = (String) charMap.get(CharacteristicMasterConstants.ID);
			  ENOICharacteristic iCharacteristic = (ENOICharacteristic) ENOCharacteristicFactory.getCharacteristicById(context, objectId);
			  IKweType dim= iCharacteristic.getPlmDimension();	
			  String dimension = dim.getName();
			  String lowerTargetIncluded = null;
			  String lowerTarget = iCharacteristic.getMinimalValue(context);
			  if(dimension.contains(CharacteristicMasterConstants.formattedString) || dimension.equalsIgnoreCase(CharacteristicMasterConstants.BOOLEAN_PARAMETER) || 
				 dimension.equalsIgnoreCase(CharacteristicMasterConstants.STRING_PARAMETER)  || dimension.equalsIgnoreCase(CharacteristicMasterConstants.ITF_SUBJECTIVE)) {
				  lowerTargetIncluded = CharacteristicMasterConstants.EMPTY_STRING;
			  }else {
				  lowerTargetIncluded = iCharacteristic.getMinimalIncluded(context);
			  }
			  String lowerSpecificationLimit = iCharacteristic.getLowerSpecificationLimit(context);
			  String lowerRoutineReleaseLimit = iCharacteristic.getLowerRoutineReleaseLimit(context);
			  
			  if(UIUtil.isNotNullAndNotEmpty(lowerTarget)){
				  html.append(' ').append(lowerTarget);
				  if(UIUtil.isNotNullAndNotEmpty(lowerTargetIncluded) && lowerTargetIncluded.equalsIgnoreCase(CharacteristicMasterConstants.INCLUSIVE)){
					  html.append(' ').append("<i>").append("&#40;").append(localeInclusive).append("&#41;").append("</i>");
				  }
			  }else {
				  html.append("&ndash;");
			  }
			  html.append("<br/><br/>");
			  
			  if(UIUtil.isNotNullAndNotEmpty(lowerRoutineReleaseLimit)){
				  html.append(' ').append(lowerRoutineReleaseLimit);
			  }else {
				  html.append("&ndash;");
			  }
			  html.append("<br/><br/>");
			  
			  if(UIUtil.isNotNullAndNotEmpty(lowerSpecificationLimit)){
				  html.append(' ').append(lowerSpecificationLimit);
			  }else {
				  html.append("&ndash;");
			  }
			  html.append("<br/><br/>");
			  
			  returnVector.add(html.toString());
		  }

		  return returnVector;
	  }
	  
	  public Vector getUpperTargets(Context context, String[] args) throws Exception {
		  
		  MapList objectList		= getObjectList(args);
		  Vector returnVector = new Vector();	
		  String localeInclusive = EnoviaResourceBundle.getProperty(context, CharacteristicMasterConstants.CHARACTERISTIC_STRING_RESOURCE, context.getLocale(), "Characteristic.Common.Inclusive");				  
		  
		  for(Object objectMap: objectList ) {
			  StringBuffer html = new StringBuffer();
			  Map charMap = (Map) objectMap;
			  String objectId = (String) charMap.get(CharacteristicMasterConstants.ID);
			  ENOICharacteristic iCharacteristic = (ENOICharacteristic) ENOCharacteristicFactory.getCharacteristicById(context, objectId);
			  IKweType dim= iCharacteristic.getPlmDimension();	
			  String dimension = dim.getName();
			  String upperTargetIncluded = null;
			  if(dimension.contains(CharacteristicMasterConstants.formattedString) || dimension.equalsIgnoreCase(CharacteristicMasterConstants.BOOLEAN_PARAMETER) || 
				 dimension.equalsIgnoreCase(CharacteristicMasterConstants.STRING_PARAMETER) || dimension.equalsIgnoreCase(CharacteristicMasterConstants.ITF_SUBJECTIVE)) {
				  upperTargetIncluded = CharacteristicMasterConstants.EMPTY_STRING;
			  }else {
				  upperTargetIncluded = iCharacteristic.getMaximalIncluded(context);
			  }
			  String upperTarget = iCharacteristic.getMaximalValue(context);
			  String upperSpecificationLimit = iCharacteristic.getUpperSpecificationLimit(context);
			  String upperRoutineReleaseLimit = iCharacteristic.getUpperRoutineReleaseLimit(context);
			  
			  if(UIUtil.isNotNullAndNotEmpty(upperTarget)){
				  html.append(' ').append(upperTarget);
				 if(UIUtil.isNotNullAndNotEmpty(upperTargetIncluded) && upperTargetIncluded.equalsIgnoreCase(CharacteristicMasterConstants.INCLUSIVE)){
					  html.append(' ').append("<i>").append("&#40;").append(localeInclusive).append("&#41;").append("</i>");
				  }
			  }else {
				  html.append("&ndash;");
			  }
			  html.append("<br/><br/>");

			  if(UIUtil.isNotNullAndNotEmpty(upperRoutineReleaseLimit)){
				  html.append(' ').append(upperRoutineReleaseLimit);
			  }else {
				  html.append("&ndash;");
			  }
			  html.append("<br/><br/>");
			  
			  if(UIUtil.isNotNullAndNotEmpty(upperSpecificationLimit)){
				  html.append(' ').append(upperSpecificationLimit);
			  }else {
				  html.append("&ndash;");
			  }
			  html.append("<br/><br/>");
			  
			  returnVector.add(html.toString());
		  }

		  return returnVector;
	  }
	  
	  public Vector getIntExtTestMethod(Context context, String[] args) throws Exception {
		  
		  MapList objectList		= getObjectList(args);
		  Vector returnVector = new Vector();		 		  
		  
		  for(Object objectMap: objectList ) {
			  StringBuffer html = new StringBuffer();
			  Map charMap = (Map) objectMap;
			  String objectId = (String) charMap.get(CharacteristicMasterConstants.ID);
			  ENOICharacteristic iCharacteristic = (ENOICharacteristic) ENOCharacteristicFactory.getCharacteristicById(context, objectId);
			  String extTestMethod = (String) charMap.get(ENOCharacteristicEnum.CharacteristicAttributes.EXTERNAL_TEST_METHOD.getAttributeSelect(context));
			  MapList intTestMethod = iCharacteristic.getConnectedTestMethods(context);
			  StringList connectedTestMethods = new StringList();
			  if(!intTestMethod.isEmpty() && intTestMethod!=null){
				  
					Iterator<?> itr = intTestMethod.iterator();
					while(itr.hasNext()){
						Map<?, ?> mp = (Map<?, ?>) itr.next();
						connectedTestMethods.add((String) mp.get(DomainConstants.SELECT_NAME));
					}
		      }
			  if(!connectedTestMethods.isEmpty() && connectedTestMethods!=null) {
			   		String testMethodsCommaSeparated = String.join(", ", connectedTestMethods);
					  html.append(' ').append("<i>").append(testMethodsCommaSeparated).append("</i>").append("<br/><br/>");	
	 		    }
			  if(UIUtil.isNotNullAndNotEmpty(extTestMethod)){
				  html.append(' ').append("<i>").append(extTestMethod).append("</i>").append("<br/><br/>");

			  }
			  returnVector.add(html.toString());
		  }

		  return returnVector;
	  }
	  
	  
}
