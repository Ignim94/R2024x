import java.util.HashMap;
import java.util.Map;
import java.util.Vector;

import matrix.db.AttributeType;
import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.MatrixException;
import matrix.util.StringList;

import com.dassault_systemes.enovia.criteria.impl.CriteriaException;
import com.dassault_systemes.enovia.criteria.interfaces.ENOCriteriaEnum;
import com.dassault_systemes.enovia.criteria.interfaces.ENOCriteriaFactory;
import com.dassault_systemes.enovia.criteria.interfaces.ENOICriteria;
import com.dassault_systemes.enovia.criteria.ui.CriteriaUI;
import com.dassault_systemes.enovia.criteria.util.CriteriaConstants;
import com.dassault_systemes.enovia.criteria.util.CriteriaUtil;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.PersonUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.domain.util.XSSUtil;
import com.matrixone.apps.framework.ui.UIUtil;

/**
 * 
 */

/**
 * @author b1r
 *
 */
public class ENOCriteriaUIBase_mxJPO {

	/**
	 * 
	 */
	public ENOCriteriaUIBase_mxJPO() {
		// TODO Auto-generated constructor stub
	}
	
	/**
     * This method gets all the criteria objects
     * @param context the enovia <code>Context</code> object
     * @param args packed input arguments
     * @return a list of criteria(s) id in a MapList
     * @throws Exception if operation fails
     * @author b1r
     */
    @com.matrixone.apps.framework.ui.ProgramCallable
    public MapList getMyDeskCriterias(Context context, String[] args) throws Exception {
    	MapList returnList = new MapList();
    	try {
	    	Map<?, ?> programMap = (HashMap<?, ?>)JPO.unpackArgs(args);
	    	String filter  = (String)programMap.get("MyDeskCriteriaCustomFilter");
	        String whereExpr =  CriteriaConstants.EMPTY_STRING;
	        if(!CriteriaConstants.ALL.equalsIgnoreCase(filter)) {
	        	whereExpr = CriteriaUtil.stringConcat(CriteriaConstants.SELECT_CURRENT, CriteriaConstants.NOTEQUAL, ENOCriteriaEnum.State.OBSOLETE.get(context, ENOCriteriaEnum.Policy.CRITERIA));
	        }
			StringList selectStmts = StringList.create(CriteriaConstants.SELECT_ID, ENOCriteriaEnum.Attribute.APPLICABLE_TYPE.getSelect(context),ENOCriteriaEnum.Attribute.APPLICABLE_ORGANIZATION.getSelect(context),
													   ENOCriteriaEnum.Attribute.CRITERIA_EXPRESSION.getSelect(context));
			StringList multiSelets = StringList.create(ENOCriteriaEnum.Attribute.APPLICABLE_ORGANIZATION.getSelect(context));
			returnList = CriteriaUtil.findCriterias(context, whereExpr, selectStmts, multiSelets);
    	} catch (Exception e) {
			e.printStackTrace();
		}
    	return returnList;
    }
    
    /**
     * This method to gets the Criteria attribute fields dynamically for building the Criteria Definition
     * @param context
     * @param args
     * @return MapList
     * @throws Exception
     */
    public String getCriteriaAttributesHTML(Context context, String[] args) throws CriteriaException {
    	
    	String htmlString = CriteriaConstants.EMPTY_STRING;
    	try {    		
    		Map<?, ?> programMap  = JPO.unpackArgs(args);
    		Map<?, ?> requestMap  = (Map<?, ?>) programMap.get(CriteriaConstants.REQUEST_MAP);
			Map<?, ?> fieldValues = (Map<?, ?>) programMap.get(CriteriaConstants.FIELD_VALUES);
    		String mode = (String)requestMap.get(CriteriaConstants.MODE);
    		String applicableType = fieldValues != null ? (String)fieldValues.get(CriteriaConstants.APPLICABLE_TYPE) : CriteriaConstants.EMPTY_STRING;
    		
    		if(CriteriaConstants.CREATE.equalsIgnoreCase(mode)) {
    			htmlString = CriteriaUI.getCriteriaAttributesHTML(context, null, applicableType, mode);
    		} else {
				String objectId = (String)requestMap.get(CriteriaConstants.OBJECT_ID);				
		    	if(UIUtil.isNullOrEmpty(applicableType))
		    		applicableType = ENOCriteriaFactory.getCriteriaById(context, objectId).getApplicableType(context);
		    	
	    		htmlString = CriteriaConstants.EDIT.equalsIgnoreCase(mode) || CriteriaConstants.COPY.equalsIgnoreCase(mode) ? CriteriaUI.getCriteriaAttributesHTML(context, objectId, applicableType, mode) 
	    				: CriteriaUI.displayCriteriaAttributesHTML(context, objectId, applicableType);
    		}

    	} catch (Exception ex) {
    		ex.printStackTrace();
    		throw new CriteriaException(ex);
    	}
    	return htmlString;
    }
    
    /**
     * This method to gets the Criteria attribute fields dynamically for building the Criteria Definition
     * @param context
     * @param args
     * @return MapList
     * @throws Exception
     */
     @com.matrixone.apps.framework.ui.ProgramCallable
    public Map<String, String> reloadCriteriaAttributesHTML(Context context, String[] args) throws CriteriaException {    	
    	Map<String, String> reloadMap = new HashMap<String, String>();
    	reloadMap.put("SelectedValues", getCriteriaAttributesHTML(context, args));
    	return reloadMap;
    }
    
    /**
     * Method to get the ranges for the claimed attributes
     * @param context
     * @param args
     * @return 
     * @throws Exception
     */
    //SRR7: TO BE REMOVED
    public Map<String, StringList> getAttributeRanges(Context context, String[] args)throws MatrixException {
    	
    	Map<String, StringList> attrRanges = new HashMap<String, StringList>();
    	try {
    		 Map programMap  	   = JPO.unpackArgs(args);
    		 Map fieldMap   	   = (Map) programMap.get(CriteriaConstants.FIELD_MAP);

    		 Map settingsMap = (Map) fieldMap.get(CriteriaConstants.SETTINGS);
    		 String attrName = (String) settingsMap.get(CriteriaConstants.CRITERIA_ATTR_NAME);
    		 AttributeType attType = new AttributeType(attrName);
    		 attType.open (context);
    		 StringList attrRangeDisplay = StringList.create("");
    		 /*B1R: Changed R418 : Sometime Boolean type attribute can have ranges */
    		 StringList attrRange  = attType.getChoices (context);
    		 if(attrRange == null && CriteriaConstants.BOOLEAN.equalsIgnoreCase(attType.getDataType(context))){
    			 StringList booleanList = StringList.create("TRUE", "FALSE");
    				attrRange  = booleanList;
    				attrRangeDisplay.addAll(booleanList);
    		 }else{
    			 attrRangeDisplay.addAll(EnoviaResourceBundle.getAttrRangeI18NStringList(context, attrName, attrRange, context.getSession().getLanguage()));
    		 }
    		 attType.close(context);
    		 StringList attrRangeActual = StringList.create("");
    		 attrRangeActual.addAll(attrRange);
    		 attrRanges.put(CriteriaConstants.FIELD_CHOICES, attrRangeActual);
    		 attrRanges.put(CriteriaConstants.FIELD_DISPLAY_CHOICES, attrRangeDisplay);
    	} catch (Exception e) {
    		e.printStackTrace();
    	}
        return  attrRanges;
    }

    /**
     * Method to get the custom filter options in My Desk - Templates page
     * @param context
     * @param args
     * @return
     * @throws FrameworkException
     */
    public Map<String, StringList> getMyDeskCriteriaFilterRanges(Context context, String[] args) throws FrameworkException {
    	Map<String, StringList> returnMap = new HashMap<String, StringList>();
    	StringList choices = StringList.create(CriteriaConstants.ACTIVE_AND_INWORK, CriteriaConstants.ALL);
    	StringList choiceDisplay = StringList.create(CriteriaUtil.getProperty(context, "Criteria.Filter.ActiveAndInWork"),
    												 CriteriaUtil.getProperty(context, "Criteria.Filter.All"));
    	returnMap.put(CriteriaConstants.FIELD_CHOICES, choices);
        returnMap.put(CriteriaConstants.FIELD_DISPLAY_CHOICES, choiceDisplay);
    	return returnMap;
    }
    
    /**
     * Method to get the message, if there is not section connected to Template
     * @param context
     * @param args
     * @return 
     * @throws Exception
     */

    public StringList getCriteriaOutputChooser(Context context, String[] args) throws Exception {
    	StringList vector = new StringList();
		Map programMap 		= JPO.unpackArgs(args);
		MapList objectList = (MapList)programMap.get(CriteriaConstants.OBJECT_LIST);
		String objectId = CriteriaConstants.EMPTY_STRING;
		for(Object map : objectList) {
			Map criteria = (Map) map;
			objectId = (String)criteria.get(CriteriaConstants.SELECT_ID);
			StringBuffer sbChooser = new StringBuffer();			
			sbChooser.append("<input type=\"button\" value=\"...\" style=\"height:20px; width:25px;\" name=\"btnCriteriaOutput\" onclick=\"javascript:showNonModalDialog('../common/emxIndentedTable.jsp?table=CriteriaCharacteristicMaster");
			sbChooser.append("&amp;program=ENOCharacteristicMasterUI:getMyDeskCharacteristicMasters&amp;Export=true&amp;massPromoteDemote=true&amp;showRMB=false&amp;objectId=");
			sbChooser.append(XSSUtil.encodeForJavaScript(context, objectId));
			sbChooser.append("')\"/>");
			vector.add(sbChooser.toString());
		}

    	return vector;
    }
    
    public String getDescription(Context context, String[] args) throws FrameworkException {
		ENOICriteria iCriteria = getCriteria(context, args);
    	return iCriteria.getDescription();
	}

	public String getTitle(Context context, String[] args) throws FrameworkException {
		ENOICriteria iCriteria = getCriteria(context, args);
    	return iCriteria.getTitle();
	}
	
	public String getApplicableType(Context context, String[] args) throws MatrixException {
		ENOICriteria iCriteria = getCriteria(context, args);
    	return EnoviaResourceBundle.getTypeI18NString(context, iCriteria.getApplicableType(context), context.getLocale().getLanguage());
	}
	
	public String getApplicableTypeForDisplay(Context context, String[] args) throws MatrixException {
		ENOICriteria iCriteria = getCriteria(context, args);
		return EnoviaResourceBundle.getTypeI18NString(context, iCriteria.getApplicableType(context), context.getLocale().getLanguage());
	}
	
	public Vector<String> getApplicableTypeForTable(Context context, String[] args) throws Exception {
		Vector<String> vector = new Vector<String>();
		Map programMap 		= JPO.unpackArgs(args);
		MapList objectList = (MapList)programMap.get(CriteriaConstants.OBJECT_LIST);
		for(Object map : objectList) {
			Map criteria = (Map) map;	      
			String acturalName = PropertyUtil.getSchemaProperty(context, (String)criteria.get(ENOCriteriaEnum.Attribute.APPLICABLE_TYPE.getSelect(context)));
			vector.add(EnoviaResourceBundle.getTypeI18NString(context, acturalName, context.getLocale().getLanguage()));
		}
		return vector;
	}
	
	public Vector<String> getCriteriaExpressionForTable(Context context, String[] args) throws Exception {
		Vector<String> vector = new Vector<String>();
		Map programMap 		= JPO.unpackArgs(args);
		MapList objectList = (MapList)programMap.get(CriteriaConstants.OBJECT_LIST);
		for(Object map : objectList) {
			Map criteria = (Map) map;	      
			String criteriaExpression = (String)criteria.get(ENOCriteriaEnum.Attribute.CRITERIA_EXPRESSION.getSelect(context));
			vector.add(CriteriaUtil.getActualCriteriaExpressionWithNLS(context, criteriaExpression));
		}
		return vector;
	}
	
    public Vector<String> getApplicableOrganizationsForTable(Context context, String[] args) throws Exception {
        Vector<String> vector = new Vector<String>();
        Map programMap  = JPO.unpackArgs(args);
        MapList objectList = (MapList)programMap.get(CriteriaConstants.OBJECT_LIST);
        for(Object map : objectList) {
            Map criteria = (Map) map;
            StringList orgTitles = new StringList();
            StringList appOrgName = (StringList)criteria.get(ENOCriteriaEnum.Attribute.APPLICABLE_ORGANIZATION.getSelect(context));
            if (appOrgName != null) {
                for (String orgName : appOrgName) {
                        if (UIUtil.isNotNullAndNotEmpty(orgName))
                        orgTitles.add(PersonUtil.getCompanyTitleFromName(context, orgName));
                    }
            }
            vector.add(orgTitles.isEmpty() ? "" : orgTitles.join(CriteriaConstants.PIPE));
        }
        return vector;
    }

	public String getApplicableOrganization(Context context, String[] args) throws FrameworkException {
		ENOICriteria iCriteria = getCriteria(context, args);
		StringList orgList = iCriteria.getApplicableOrganization();
		StringList orgTitles = new StringList();
		for (String orgName : orgList) {
			try {
				orgTitles.add(PersonUtil.getCompanyTitleFromName(context, orgName));
			} catch (Exception e) {
				throw new FrameworkException(e.getLocalizedMessage());
			}
		}
		return orgTitles.join(CriteriaConstants.PIPE);
	}	
	
	public String getApplicableCollaSpace(Context context, String[] args) throws FrameworkException {
		ENOICriteria iCriteria = getCriteria(context, args);
		return iCriteria.getApplicableCollabSpace().join(CriteriaConstants.PIPE);
	}
	
	private ENOICriteria getCriteria(Context context, String[] args) throws FrameworkException {
		ENOICriteria iCriteria = null;
		try {
			Map programMap 		= JPO.unpackArgs(args);
			Map paramMap		=(Map)programMap.get(CriteriaConstants.PARAM_MAP);
			String objectId 	= (String)paramMap.get(CriteriaConstants.OBJECT_ID);
			if (UIUtil.isNullOrEmpty(objectId)) {
				objectId		=(String)((Map)programMap.get(CriteriaConstants.REQUEST_MAP)).get(CriteriaConstants.OBJECT_ID);
			}
			
			iCriteria = ENOCriteriaFactory.getCriteriaById(context, objectId);
			
		} catch (Exception e) {
			e.printStackTrace();
			throw new FrameworkException(e.getLocalizedMessage());
		}
		return iCriteria;
	}
	
	/**
     * Method to get the rageges for the claimed attributes
     * @param context
     * @param args
     * @return 
     * @throws Exception
     */
	public Map<String, StringList> getCriteriaOutputRanges(Context context, String[] args)throws MatrixException {
		
    	Map<String, StringList> attrRanges = new HashMap<String, StringList>();
    	StringList actualRange = new StringList();
    	StringList displayRange = new StringList();
    	try {
    		actualRange.add(CriteriaConstants.YES);
    		actualRange.add(CriteriaConstants.NO);
    		displayRange.add(CriteriaUtil.getProperty(context, "Criteria.Display.CopyCriteriaOutput.Yes"));
    		displayRange.add(CriteriaUtil.getProperty(context, "Criteria.Display.CopyCriteriaOutput.No"));
    		attrRanges.put(CriteriaConstants.FIELD_CHOICES, actualRange);
    		attrRanges.put(CriteriaConstants.FIELD_DISPLAY_CHOICES, displayRange);
    	} catch (Exception e) {
    		e.printStackTrace();
    		throw new MatrixException(e.getLocalizedMessage());
    	}
        return  attrRanges;
    }
	
	@com.matrixone.apps.framework.ui.ExcludeOIDProgramCallable
	public StringList getCriteriaOutputIds (Context context, String[] args)throws FrameworkException {
		try {
			HashMap<?, ?> programMap = (HashMap<?, ?>) JPO.unpackArgs(args);
			String strObjectId = (String)programMap.get(CriteriaConstants.OBJECT_ID);
			StringList outputIds = new StringList();
			StringList selectID = StringList.create(CriteriaConstants.SELECT_ID);
			if (UIUtil.isNotNullAndNotEmpty(strObjectId)) {
				MapList mapList = CriteriaUI.getCriteriaOutputs(context, strObjectId, selectID, CriteriaConstants.EMPTY_STRING);
				outputIds = CriteriaUtil.toStringList(mapList, CriteriaConstants.SELECT_ID);
			}
			return outputIds;
		}
		catch (Exception e){
			throw new FrameworkException(e.getLocalizedMessage());
		}
	}
	
  	@com.matrixone.apps.framework.ui.ProgramCallable
  	public static MapList getCriteriaOutputs(Context context, String[] args) throws Exception {
  		MapList mpReturnList = new MapList();
  		Map<?, ?> programMap = (HashMap<?, ?>)JPO.unpackArgs(args);
	  	String objectId  = (String)programMap.get(CriteriaConstants.OBJECT_ID);

	  	StringList objSelects = StringList.create(CriteriaConstants.SELECT_ID);
  		//objSelects.add(CriteriaConstants.SELECT_MODIFY_ACCESS);
	  	if(UIUtil.isNotNullAndNotEmpty(objectId)){
	  		/* Below code is to show Characteristic Masters on the Criteria page, 
	  		 * if the added Characteristic Masters is mandatory, then row should be highlighted */
			ENOICriteria iCriteria = ENOCriteriaFactory.getCriteriaById(context, objectId);
			mpReturnList = iCriteria.getCriteriaOutput(context, objSelects, CriteriaConstants.EMPTY_STRING);
			CriteriaUI.updateCustomStyleForIsMandatoryField(context, mpReturnList);
		}
	  	return mpReturnList;
  	}
  	
	 /**
	 * This method will check whether the IsMandatoryCharacteristic option should be displayed or not.
	 * @param context the eMatrix <code>Context</code> object
	 * @param String [] args Argument List to the method.
	 * @return boolean true if the PDMode is copy, false if not
	 * @throws Exception if the operation fails
	 * @since Criteria 2016x.FD02
	 * 
	 */
	
	public boolean showIsMandatoryField(Context context, String[] args) throws Exception {
		boolean disaplyfield = true;
		HashMap paramMap = (HashMap)JPO.unpackArgs(args);
		String contexPage = (String)paramMap.get("contexPage");
		if("MyDesk".equalsIgnoreCase(contexPage)) {
			disaplyfield = false;
		}
		return disaplyfield;
	}
	
	
	/*EI8: IR-463429-3DEXPERIENCER2016x: Start*/
	/**
	 * This method enables/disables the UI elements related to Characteristics Management based on the configuration.
	 * @param context the eMatrix <code>Context</code> object
	 * @param args input arguments
	 * @return the value of the key 'Criteria.EnableCharacteristicsManagement' from the file 'enoCriteria.properties'
	 * @throws FrameworkException if operation fails
	 * @since R418.FD05
	 */
	public boolean isCharacteristicsManagementEnabled(Context context, String[] args) throws FrameworkException {
		
		boolean returnValue = false;
		try {
			returnValue = "true".equals(EnoviaResourceBundle.getProperty(context, "Criteria.EnableCharacteristicsManagement"));
		} catch (FrameworkException fr) {
			returnValue = false;
		}
		return returnValue;
	}
	/*EI8: IR-463429-3DEXPERIENCER2016x: End*/
	
}
