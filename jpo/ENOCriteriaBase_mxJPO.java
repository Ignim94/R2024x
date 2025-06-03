import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import com.dassault_systemes.enovia.criteria.interfaces.ENOCriteriaFactory;
import com.dassault_systemes.enovia.criteria.interfaces.ENOCriteriaServices;
import com.dassault_systemes.enovia.criteria.interfaces.ENOICriteria;
import com.dassault_systemes.enovia.criteria.util.CriteriaConstants;
import com.dassault_systemes.enovia.criteria.util.CriteriaUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MessageUtil;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PersonUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.framework.ui.UIUtil;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.MatrixException;
import matrix.util.StringList;

/**
 * @author b1r
 *
 */
public class ENOCriteriaBase_mxJPO {

	/**
	 * 
	 */
	public ENOCriteriaBase_mxJPO() {
		// TODO Auto-generated constructor stub
	}

	/**This is crete JPO method and we are creating Product Data in this method
	  * @param context is the matrix context
	  * @param args has the required information
	  * @return HashMap
	  * @throws Exception
	  */
	@com.matrixone.apps.framework.ui.CreateProcessCallable
	public Map<?, ?> createCriteria(Context context, String[] args) throws Exception {		
	 	HashMap<String, String> returnMap = new HashMap<String, String>();
		try {
			Map<?, ?> programMap = (Map<?, ?>) JPO.unpackArgs(args);
			Map<?, ?> requestValuesMap = (Map<?, ?>) programMap.get("RequestValuesMap");
			String applicableType	= arrayToString(requestValuesMap.get(CriteriaConstants.APPLICABLE_TYPE));
			String name				= arrayToString(requestValuesMap.get(CriteriaConstants.NAME));
			String title 			= arrayToString(requestValuesMap.get("CriteriaTitle"));
			String description 		= arrayToString(requestValuesMap.get("Description"));
			String applicableOrgStr 	= arrayToString(requestValuesMap.get("ApplicableOrganization"));
			String applicableCollabSpaceStr 	= arrayToString(requestValuesMap.get("ApplicableCollabSpace"));
		 	
			StringList applicableOrg = FrameworkUtil.split(applicableOrgStr, "|");
			CriteriaUtil.ifValidOrg(context, applicableOrg, false);
			
			StringList applicableCollabSpace = FrameworkUtil.split(applicableCollabSpaceStr, "|");
			Map<String, StringList> criteriaAttributes = new LinkedHashMap<String, StringList>();
		 	StringList critAttributes = CriteriaUtil.getCriteriaAttributesConfigured(context, applicableType);
			for(Object cAttr : critAttributes) {
				String attributeName = PropertyUtil.getSchemaProperty(context, (String)cAttr);
				StringList multiValues = getMultiValueAttrFromForm(context, programMap, attributeName);
				criteriaAttributes.put(attributeName, multiValues);
			}

			String objectId = ENOCriteriaServices.createCriteria(context, name, title, description, applicableType, applicableOrg, applicableCollabSpace, criteriaAttributes);
			returnMap.put(CriteriaConstants.SELECT_ID, objectId);
		} catch (Exception ex) {
			ex.printStackTrace();
			throw new FrameworkException(ex.getMessage());
		}
	 	return returnMap;
	}
	
	/**This is crete JPO method and we are creating Product Data in this method
	  * @param context is the matrix context
	  * @param args has the required information
	  * @return HashMap
	  * @throws Exception
	  */
	@com.matrixone.apps.framework.ui.CreateProcessCallable
	public Map<?, ?> cloneCriteria(Context context, String[] args) throws Exception {		
	 	HashMap<String, String> returnMap = new HashMap<String, String>();
		try {
			Map<?, ?> programMap = (Map<?, ?>) JPO.unpackArgs(args);
			Map<?, ?> requestValuesMap = (Map<?, ?>) programMap.get("RequestValuesMap");
			String criteriaId 				= (String)programMap.get("parentOID");
			String name				= arrayToString(requestValuesMap.get("Name"));
			String title 			= arrayToString(requestValuesMap.get("CriteriaTitle"));
			String description 		= arrayToString(requestValuesMap.get("Description"));
			String applicableType	= arrayToString(requestValuesMap.get("ApplicableType"));
			String applicableTypeSymbolicName = applicableType.startsWith(CriteriaConstants.TYPE_) ? applicableType : CriteriaUtil.getSymbolicName(context, CriteriaConstants.TYPE, applicableType);
			if(applicableTypeSymbolicName== null) {
				ENOICriteria iCriteria= ENOCriteriaFactory.getCriteriaById(context, criteriaId);
				applicableType= iCriteria.getApplicableType(context);
			}
			String applicableOrgStr 	= arrayToString(requestValuesMap.get("ApplicableOrganization"));
			String applicableOrgOID 	= arrayToString(requestValuesMap.get("ApplicableOrganizationOID"));
			String applicableCollabSpaceStr 	= arrayToString(requestValuesMap.get("ApplicableCollabSpace"));
			String CopyCriteriaOutputStr 	= arrayToString(requestValuesMap.get("CopyCriteriaOutput"));
		 	boolean copyCriteriaOutput = CriteriaConstants.YES.equalsIgnoreCase(CopyCriteriaOutputStr) ? true : false;
			StringList applicableOrg = FrameworkUtil.split(applicableOrgStr, "|");
			CriteriaUtil.ifValidOrg(context, applicableOrg, UIUtil.isNullOrEmpty(applicableOrgOID));
			
			StringList applicableCollabSpace = FrameworkUtil.split(applicableCollabSpaceStr, "|");
			Map<String, StringList> criteriaAttributes = new LinkedHashMap<String, StringList>();
		 	StringList critAttributes = CriteriaUtil.getCriteriaAttributesConfigured(context, applicableType);
			for(Object cAttr : critAttributes) {
				String attributeName = PropertyUtil.getSchemaProperty(context, (String)cAttr);
				StringList multiValues = getMultiValueAttrFromForm(context, programMap, attributeName);
				criteriaAttributes.put(attributeName, multiValues);
			}

			if (UIUtil.isNullOrEmpty(applicableOrgOID)) {
				StringList slOrgName = new StringList(applicableOrg.size());
				for (String orgTitle : applicableOrg) {
					slOrgName.add(PersonUtil.getCompanyNameFromTitle(context,orgTitle));
				}
				applicableOrg = slOrgName;
			}
			String objectId = ENOCriteriaServices.cloneCriteria(context, criteriaId, name, title, description, applicableType, applicableOrg, applicableCollabSpace, criteriaAttributes, copyCriteriaOutput);
			returnMap.put(CriteriaConstants.SELECT_ID, objectId);

		} catch (Exception ex) {
			ex.printStackTrace();
			throw new Exception(ex.getLocalizedMessage());
		}
	 	return returnMap;
	}
	
	/**
	 * Method to Revise the Criteria
     * @param context
     * @param args
     * @return revised TemplateId
     * @throws Exception
     */
	//SRR7: TO BE REMOVED
	public String reviseCriteria(Context context, String[] args)throws Exception {		
		String criteriaId = args [0];
		if(UIUtil.isNullOrEmpty(criteriaId))
			throw new Exception(CriteriaUtil.getProperty(context, "Criteria.Alert.EmptyObjectId"));
		String revisedObjId = CriteriaConstants.EMPTY_STRING;
		try {
			revisedObjId = ENOCriteriaServices.reviseCriteria(context, criteriaId);	        
		}
		catch(Exception ex) {
			ex.printStackTrace();
			throw new Exception(ex.getMessage());
		}
		return revisedObjId;
	 }
	
	public String arrayToString(Object strArray) {
		String [] array = (String[])strArray;
		if(array != null && array.length > 0)
			return array[0].trim();
		return CriteriaConstants.EMPTY_STRING;
	}
  
   /**This method is post process method which is executed after the Criteria object is created. we connect some related objects and update few attributes in this method
    * @param context is the matrix context
    * @param args has the required information
    * @return
    * @throws Exception
    */
   @com.matrixone.apps.framework.ui.PostProcessCallable
   public void editCriteriaPostProcess(Context context,String args[])throws Exception{
	   
	   Map<?, ?> programMap 		= JPO.unpackArgs(args); 	
	   Map<?, ?> requestMap 		= (Map<?, ?>)programMap.get(CriteriaConstants.REQUEST_MAP);
	   Map<?, ?> paramMap 			= (Map<?, ?>)programMap.get(CriteriaConstants.PARAM_MAP);
	   
	   String criteriaId 				= (String)paramMap.get("objectId");
	   String title 				= (String)requestMap.get("CriteriaTitle");
	   String description 			= (String)requestMap.get("Description");
	   String applicableOrgStr 		= (String)requestMap.get("ApplicableOrganization");
	   String applicableCollabSpaceStr = (String)requestMap.get("ApplicableCollabSpace");
	   
	   if(UIUtil.isNullOrEmpty(criteriaId)){
		   criteriaId 				= (String)paramMap.get("parentOID");
	   }
	   
	   ENOICriteria iCriteria = ENOCriteriaFactory.getCriteriaById(context, criteriaId);
	   
	   StringList applicableOrg = FrameworkUtil.split(applicableOrgStr, "|");
	   CriteriaUtil.ifValidOrg(context, applicableOrg, false);
	   
	   StringList applicableCollabSpace = FrameworkUtil.split(applicableCollabSpaceStr, "|");
	   Map<String, StringList> criteriaAttributes = new LinkedHashMap<String, StringList>();

	   /*SRR7: Currently, for edit, the values are read from the object. 
	   But the approach is to read the configuration and compare with the attributes available on the object.
	   If any attribute is missing, it has to be conveyed to the user and removed from the criteria.
	   New attributes should be able to be added.
	   */
	   StringList critAttributes = CriteriaUtil.getCriteriaAttributesConfigured(context, iCriteria.getApplicableType(context));
	   for(Object cAttr : critAttributes) {
		   String attributeName = PropertyUtil.getSchemaProperty(context, (String)cAttr);
		   StringList multiValues = getMultiValueAttrFromForm(context, requestMap, attributeName);
		   criteriaAttributes.put(attributeName, multiValues);
	   }

	   ENOCriteriaServices.updateCriteria(context, criteriaId, title, description, applicableOrg, applicableCollabSpace, criteriaAttributes);
   }
   
   /*
    * Below method should be used when the criteria attributes are displayed using dynamic fields and if the form is opened using emxCreate.jsp.
    * In 16cx.FD02 Criteria Attributes are displayed using programHTMLOutupt hence use the getMultiValueAttrFromForm() method instead of this one.
    */
   /*public StringList getMultiValueAttrFromCreateForm(Context context, Map<?, ?> requestMap, String fieldName) throws Exception {
	   StringList crit_Attr_Value = new StringList();
	   String crit_Attr_List	 	= arrayToString(requestMap.get(CriteriaUtil.stringConcat(fieldName, "_mva")));
	   if(UIUtil.isNotNullAndNotEmpty(crit_Attr_List)) {
		   StringList crit_Attr_StringList = FrameworkUtil.split(crit_Attr_List, ":");//Title:Title_mva_1:Title_mva_2:Title_mva_4:
		   for(Object name : crit_Attr_StringList) {
			   if(UIUtil.isNotNullAndNotEmpty((String)name)) {
				   String value = arrayToString(requestMap.get(name));
				   if(UIUtil.isNotNullAndNotEmpty(value))
				   		crit_Attr_Value.add(value);
			   }
		   }
	   }
	   return crit_Attr_Value;
   }*/
   
   public StringList getMultiValueAttrFromForm(Context context, Map<?, ?> requestMap, String fieldName) throws Exception {
	   StringList crit_Attr_Value = new StringList();
	   String crit_Attr_List	  = (String)requestMap.get(CriteriaUtil.stringConcat(fieldName, "_mva"));
	   if(UIUtil.isNotNullAndNotEmpty(crit_Attr_List)){
		   StringList crit_Attr_StringList = FrameworkUtil.split(crit_Attr_List, ":");//Title:Title_mva_1:Title_mva_2:Title_mva_4:
		   for(Object name : crit_Attr_StringList) {
			   if(UIUtil.isNotNullAndNotEmpty((String)name)) {
				   String value = (String)requestMap.get(name);
				   if(UIUtil.isNotNullAndNotEmpty(value))
					   crit_Attr_Value.add(value);
			   }
		   }
	   }
	   return crit_Attr_Value;
   }
   
   /**
    * Update method for Claimed Data on Template
    * @param context the matrix context
    * @throws Exception if operation fails
    */

   public void dummyUpdateFunction(Context context, String[] args) throws FrameworkException {
	   
   }
   
   /**
	 * This method is to make previous revision of Template in Obsolete state if latest revision is Released
	 * @param context eMatrix <code>Context</code> object
	 * @param jpoArgs
	 * @throws Exception
	 */
	public void obsoletePreviousRevision(Context context, String[] jpoArgs) throws MatrixException {
		try {
			Object []args = {context, jpoArgs[0]};
			Class<?> []argClass = {matrix.db.Context.class, String.class};
			
			Class<?> critServiceClass = ENOCriteriaBase_mxJPO.class.getClassLoader().loadClass("com.dassault_systemes.enovia.criteria.impl.CriteriaServices");
			critServiceClass.getMethod("obsoletePreviousRevision", argClass).invoke(null, args);
		} catch (Exception ex) {
			throw new FrameworkException(ex.getMessage());
		}
	}
	
	public void replicateOutputOnRevise(Context context, String[] jpoArgs) throws Exception {
		try {
			Object []args = {context, jpoArgs[0]};
			Class<?> []argClass = {matrix.db.Context.class, String.class};
			
			Class<?> critServiceClass = ENOCriteriaBase_mxJPO.class.getClassLoader().loadClass("com.dassault_systemes.enovia.criteria.impl.CriteriaServices");
			critServiceClass.getMethod("replicateCriteriaOutput", argClass).invoke(null, args);
		} catch (Exception ex) {
			throw new FrameworkException(ex.getMessage());
		}
	}
	
	/**
	 * This trigger is to check whether at least one output is connected to the Criteria
	 * @param context eMatrix <code>Context</code> object
	 * @param args
	 * @return
	 * @throws Exception
	 */
	public int checkForMandatoryOutput(Context context, String [] jpoArgs) throws FrameworkException { 
		
		try {
			Object []args = {context, jpoArgs[0]};
			Class<?> []argClass = {matrix.db.Context.class, String.class};
			
			Class<?> critServiceClass = ENOCriteriaBase_mxJPO.class.getClassLoader().loadClass("com.dassault_systemes.enovia.criteria.impl.CriteriaServices");
			boolean successFlag = (Boolean) critServiceClass.getMethod("checkForMandatoryOutput", argClass).invoke(null, args);
			
			if(successFlag)
				return 0;
			
			String alertMessage  = CriteriaUtil.getProperty(context, "Criteria.Notice.MandatoryOutput");
            MqlUtil.mqlCommand(context, "notice $1", alertMessage);

		} catch (Exception e) {
			e.printStackTrace();
		}
		return 1;
	}
	
	/**
	 * This trigger is to check whether at least one revision of the output is in released state.
	 * @param context eMatrix <code>Context</code> object
	 * @param args
	 * @return
	 * @throws Exception
	 */
	public int checkForNonReleasedOutput(Context context, String [] jpoArgs) throws FrameworkException { 
		
		try {
			Object []args = {context, jpoArgs[0]};
			Class<?> []argClass = {matrix.db.Context.class, String.class};
			
			Class<?> critServiceClass = ENOCriteriaBase_mxJPO.class.getClassLoader().loadClass("com.dassault_systemes.enovia.criteria.impl.CriteriaServices");
			StringList outputList = (StringList) critServiceClass.getMethod("checkForNonReleasedOutput", argClass).invoke(null, args);
			
			if(outputList.isEmpty())
				return 0;
			
			String[] nonReleasedList = new String []{outputList.toString()};
			String alertMessage = MessageUtil.getMessage(context, null, "Criteria.Notice.CheckForNonReleasedOutput", nonReleasedList, null, context.getLocale(), CriteriaConstants.CRITERIA_STRING_RESOURCE);
			//String alertMessage  = CriteriaUtil.getProperty(context, "Criteria.Notice.CheckForNonReleasedOutput");
			MqlUtil.mqlCommand(context, "notice $1", alertMessage);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return 1;
	}

	public boolean evaluateCriteria(Context context, String [] args) throws FrameworkException { 
		String criteriaId = args[0];
		String itemId = args[1];
		return CriteriaUtil.evaluateCriteria(context, criteriaId, itemId);
	}
}
