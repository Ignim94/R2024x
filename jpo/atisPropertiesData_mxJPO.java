
/*
**  emxAEFCollectionBase
**
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
**   This JPO contains the implementation of emxAEFCollectionBase
*/
/*
insert program C:/workspace_test/3dspace_FD02/jpo/${CLASS:decInterfaceDV}.java;
compile prog decInterfaceDV force update;
execute program decInterfaceDV -method getDeliverableStatus;	
execute program decInterfaceDV -method getVendorPrint;
mql -c "set cont user creator;execute program decInterfaceDV -method getDeliverableStatus;"
 */
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Vector;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.apache.ignite.spi.communication.tcp.internal.DisconnectedSessionInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aspose.slides.Collections.Hashtable;
import com.dassault_systemes.enovia.formulation.custom.FormulationPart;
import com.dassault_systemes.enovia.formulation.custom.enumeration.FormulationAttribute;
import com.dassault_systemes.enovia.formulation.custom.enumeration.FormulationRelationship;
import com.dassault_systemes.enovia.formulation.custom.enumeration.FormulationType;
import com.matrixone.apps.cpn.util.BusinessUtil;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.DomainSymbolicConstants;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.domain.util.StringUtil;
import com.matrixone.apps.domain.util.XSSUtil;
import com.matrixone.apps.framework.ui.UIUtil;
import com.matrixone.apps.program.ProgramCentralConstants;
import com.matrixone.apps.program.ProgramCentralUtil;
import com.matrixone.apps.program.Task;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.Pattern;
import matrix.util.StringList;

/**
 * The <code>emxAEFCollectionBase</code> class contains methods for the
 * "Collection" Common Component.
 *
 * @version AEF 10.0.Patch1.0 - Copyright (c) 2003, MatrixOne, Inc.
 */

public class atisPropertiesData_mxJPO {

	private static final String EMX_COMPONENTS_STRING_RESOURCE = "emxComponentsStringResource";
    private static final Logger logger = LoggerFactory.getLogger(atisPropertiesData_mxJPO.class);

    private static final String cMax = "cMax";
    private static final String cMin = "cMin";
    private static final String cOrAbove = "cOrAbove";
    private static final String cOrBelow = "cOrBelow";
    private static final String cAbove = "cAbove";
    private static final String cBelow = "cBelow";
    private static final String cRange = "cRange";
    public MapList findPropertyData(Context context, String[] args) throws Exception {
    	try {
    		HashMap programMap = (HashMap) JPO.unpackArgs(args); 
    		String atisMode = (String) programMap.get("mode");
    		String atisPropertyEvalUnitFilter = (String) programMap.get("atisPropertyEvalUnitFilter");
    		String atisPropertyCompareFilter = (String) programMap.get("atisPropertyCompareFilter");
    		String atisPropertyValueFilter = (String) programMap.get("atisPropertyValueFilter");
    		String objectWhere = "";
    		if("Material".equals(atisMode)) {
    			//	objectWhere = "to[atisRequsetToPropertyData].from.to[atisPartToRequest].from.type == 'Raw Material'";
    		} else if("Product".equals(atisMode)) {
    			//	objectWhere = "to[atisRequsetToPropertyData].from.to[atisPartToRequest].from.type == 'Consumer Unit Part'";
    		}
    		float num1 = 0.0f;
    		float num2 = 0.0f;
    		boolean chkatisPropertyEvalUnitFilter = atisPropertyEvalUnitFilter != null && !"".equals(atisPropertyEvalUnitFilter);
    		boolean chkatisPropertyCompareFilter = atisPropertyCompareFilter != null && !"".equals(atisPropertyCompareFilter);
    		boolean chkatisPropertyValueFilter = atisPropertyValueFilter != null && !"".equals(atisPropertyValueFilter);
    		if(chkatisPropertyEvalUnitFilter) {
    			objectWhere = objectWhere.length()>0 ? (objectWhere + " && ") : objectWhere;
    			objectWhere = objectWhere + "(attribute[atisPropertyEvalUnit] ~= '" + atisPropertyEvalUnitFilter + "*')";
    			if(chkatisPropertyCompareFilter && chkatisPropertyValueFilter) {
    				if(atisPropertyValueFilter.indexOf("~")>-1) {
    					String[] arr = atisPropertyValueFilter.split("~");
    					num1 = Float.parseFloat(arr[0].trim());
    					num2 = Float.parseFloat(arr[1].trim());
    				} else if(atisPropertyValueFilter.indexOf("-")>-1) {
    					String[] arr = atisPropertyValueFilter.split("-");
    					num1 = Float.parseFloat(arr[0].trim());
    					num2 = Float.parseFloat(arr[1].trim());
    				} else if(atisPropertyValueFilter.indexOf(" ")>-1){
    					String[] arr = atisPropertyValueFilter.split(" ");
    					num1 = Float.parseFloat(arr[0].trim());
    					num2 = Float.parseFloat(arr[1].trim());
    				} else {
    					num1 = Float.parseFloat(atisPropertyValueFilter);
    				}
    			}
    		}
    		
    		MapList ml = new MapList();
    		
    		StringList busSelects = new StringList();
    		busSelects.add(DomainConstants.SELECT_ID);
    		busSelects.add("attribute[atisEvalResult]");
    		busSelects.add("to[atisRequsetToPropertyData].from.id");
    		ml = DomainObject.findObjects(context, "atisPropertyData", "*", "*", "*", "*", 
    				objectWhere, null, true, busSelects, (short) 0);
    		
    		if(chkatisPropertyEvalUnitFilter && chkatisPropertyCompareFilter && chkatisPropertyValueFilter) {        			
    			java.util.Iterator iter = ml.iterator();
    			while(iter.hasNext()) {
    				Map m = (Map) iter.next();
    				boolean check = false;
    				String atisEvalResult = (String) m.get("attribute[atisEvalResult]");
    				try {
    					float i1 = 0.0f;
    					float i2 = 0.0f;
    					boolean isRangeResult = false;
    					if(atisEvalResult.indexOf("~")>-1) {
    						String[] arr = atisEvalResult.split("~");
    						i1 = Float.parseFloat(arr[0].trim());
    						i2 = Float.parseFloat(arr[1].trim());
    						isRangeResult = true;
    					} else if(atisEvalResult.indexOf("-")>-1) {
    						String[] arr = atisEvalResult.split("-");
    						i1 = Float.parseFloat(arr[0].trim());
    						i2 = Float.parseFloat(arr[1].trim());
    						isRangeResult = true;
    					} else if(atisEvalResult.indexOf(" ")>-1){
    						String[] arr = atisEvalResult.split(" ");
    						i1 = Float.parseFloat(arr[0].trim());
    						i2 = Float.parseFloat(arr[1].trim());
    						isRangeResult = true;
    					} else {
    						i1 = Float.parseFloat(atisEvalResult);
    					}
    					
    					if(atisPropertyCompareFilter.equals(cMax)) {
    						if(isRangeResult) {
    							check = num1 == i2;
    						} else {
    							check = false;
    						}
    					} else if(atisPropertyCompareFilter.equals(cMin)) {
    						if(isRangeResult) {
    							check = num1 == i1;
    						} else {
    							check = false;
    						}
    					} else if(atisPropertyCompareFilter.equals(cOrAbove)) {
    						check = num1 <= i1;
    					} else if(atisPropertyCompareFilter.equals(cOrBelow)) {
    						check = num1 >= i1;
    					} else if(atisPropertyCompareFilter.equals(cAbove)) {
    						check = num1 < i1;
    					} else if(atisPropertyCompareFilter.equals(cBelow)) {
    						check = num1 > i1;
    					} else if(atisPropertyCompareFilter.equals(cRange)) {
    						if(isRangeResult) {
    							check = num1 <= i1 && num2 >= i2;
    						} else {
    							check = num1 <= i1 && num2 >= i1;
    						}
    					} else {
    						check = false;
    					}
    				} catch(Exception e) {
    					check = false;
    				}
    				if(!check) {
    					iter.remove();
    				}
    			}
    		}
    		System.out.println("ml.size:"+ml.size());
    		java.util.List<String> list = ((java.util.List<Map>) ml).stream().map(m -> (String) m.get("to[atisRequsetToPropertyData].from.id")).distinct().collect(Collectors.toList());
    		ml.clear();
    		System.out.println("list.size:"+list.size());
    		for(int i=0,size=list.size();i<size;i++) {
    			Map map = new HashMap();
    			map.put("id", list.get(i));
    			map.put("level", "1");
    			ml.add(map);
    		}
    		return ml;
    	} catch(Exception ex) {
    		ex.printStackTrace();
    		return new MapList();
    	}
    }
    
    /// 24.12.05 find type atisCUPPropertyData 
    public MapList findCUPPropertyData(Context context, String[] args) throws Exception {
    	try {
    		HashMap programMap = (HashMap) JPO.unpackArgs(args); 
    		String atisPropertyEvalUnitFilter = (String) programMap.get("atisPropertyEvalUnitFilter");
    		String atisPropertyCompareFilter = (String) programMap.get("atisPropertyCompareFilter");
    		String atisPropertyValueFilter = (String) programMap.get("atisPropertyValueFilter");
    		String objectId = (String) programMap.get("objectId");
    		String parentOID = (String) programMap.get("parentOID");
    		String objectWhere = "";
    		if(objectId != null && !"".equals(objectId)) {
    			objectWhere = "to[atisRequsetToPropertyData].from.id == '" + objectId + "'";
    		}
    		float num1 = 0.0f;
    		float num2 = 0.0f;
    		boolean chkatisPropertyEvalUnitFilter = atisPropertyEvalUnitFilter != null && !"".equals(atisPropertyEvalUnitFilter);
    		boolean chkatisPropertyCompareFilter = atisPropertyCompareFilter != null && !"".equals(atisPropertyCompareFilter);
    		boolean chkatisPropertyValueFilter = atisPropertyValueFilter != null && !"".equals(atisPropertyValueFilter);
    		if(chkatisPropertyEvalUnitFilter) {
    			objectWhere = objectWhere.length()>0 ? (objectWhere + " && ") : objectWhere;
    			objectWhere = objectWhere + "(attribute[atisPropertyEvalUnit] ~= '" + atisPropertyEvalUnitFilter + "*')";
    			if(chkatisPropertyCompareFilter && chkatisPropertyValueFilter) {
    				if(atisPropertyValueFilter.indexOf("~")>-1) {
    					String[] arr = atisPropertyValueFilter.split("~");
    					num1 = Float.parseFloat(arr[0].trim());
    					num2 = Float.parseFloat(arr[1].trim());
    				} else if(atisPropertyValueFilter.indexOf("-")>-1) {
    					String[] arr = atisPropertyValueFilter.split("-");
    					num1 = Float.parseFloat(arr[0].trim());
    					num2 = Float.parseFloat(arr[1].trim());
    				} else if(atisPropertyValueFilter.indexOf(" ")>-1){
    					String[] arr = atisPropertyValueFilter.split(" ");
    					num1 = Float.parseFloat(arr[0].trim());
    					num2 = Float.parseFloat(arr[1].trim());
    				} else {
    					num1 = Float.parseFloat(atisPropertyValueFilter);
    				}
    			}
    		}
    		
    		MapList ml = new MapList();
    		
    		StringList busSelects = new StringList();
    		busSelects.add(DomainConstants.SELECT_ID);
    		busSelects.add("attribute[atisEvalResult]");
    		busSelects.add("to[atisPropertiesDataRel].from.id");
    		ml = DomainObject.findObjects(context, "atisCUPPropertyData", "*", "*", "*", "*", 
    				objectWhere, null, true, busSelects, (short) 0);
    		System.out.println("atisPropertyCompareFilter: " + atisPropertyCompareFilter);
    		if(chkatisPropertyEvalUnitFilter && chkatisPropertyCompareFilter && chkatisPropertyValueFilter) {        			
    			java.util.Iterator iter = ml.iterator();
    			while(iter.hasNext()) {
    				Map m = (Map) iter.next();
    				boolean check = false;
    				String atisEvalResult = (String) m.get("attribute[atisEvalResult]");
    				try {
    					float i1 = 0.0f;
    					float i2 = 0.0f;
    					boolean isRangeResult = false;
    					if(atisEvalResult.indexOf("~")>-1) {
    						String[] arr = atisEvalResult.split("~");
    						i1 = Float.parseFloat(arr[0].trim());
    						i2 = Float.parseFloat(arr[1].trim());
    						isRangeResult = true;
    					} else if(atisEvalResult.indexOf("-")>-1) {
    						String[] arr = atisEvalResult.split("-");
    						i1 = Float.parseFloat(arr[0].trim());
    						i2 = Float.parseFloat(arr[1].trim());
    						isRangeResult = true;
    					} else if(atisEvalResult.indexOf(" ")>-1){
    						String[] arr = atisEvalResult.split(" ");
    						i1 = Float.parseFloat(arr[0].trim());
    						i2 = Float.parseFloat(arr[1].trim());
    						isRangeResult = true;
    					} else {
    						i1 = Float.parseFloat(atisEvalResult);
    					}
    					
    					if(atisPropertyCompareFilter.equals(cMax)) {
    						if(isRangeResult) {
    							check = num1 == i2;
    						} else {
    							check = false;
    						}
    					} else if(atisPropertyCompareFilter.equals(cMin)) {
    						if(isRangeResult) {
    							check = num1 == i1;
    						} else {
    							check = false;
    						}
    					} else if(atisPropertyCompareFilter.equals(cOrAbove)) {
    						check = num1 <= i1;
    					} else if(atisPropertyCompareFilter.equals(cOrBelow)) {
    						check = num1 >= i1;
    					} else if(atisPropertyCompareFilter.equals(cAbove)) {
    						check = num1 < i1;
    					} else if(atisPropertyCompareFilter.equals(cBelow)) {
    						check = num1 > i1;
    					} else if(atisPropertyCompareFilter.equals(cRange)) {
    						if(isRangeResult) {
    							check = num1 <= i1 && num2 >= i2;
    						} else {
    							check = num1 <= i1 && num2 >= i1;
    						}
    					} else {
    						check = false;
    					}
    				} catch(Exception e) {
    					check = false;
    				}
    				if(!check) {
    					iter.remove();
    				}
    			}
    		}
    		return ml;
    	} catch(Exception ex) {
    		return new MapList();
    	}
    }
    
    
    public MapList findPropertyMasterData(Context context, String[] args) throws Exception {
    	MapList ml = new MapList();
    	try {
    		HashMap programMap = (HashMap) JPO.unpackArgs(args);
    		String objectId    = (String) programMap.get("objectId");
    		StringList busSelects = new StringList();
    		busSelects.add(DomainConstants.SELECT_ID);
    		busSelects.add(DomainConstants.SELECT_NAME);
    		String objectWhere = "";
    		if(objectId == null || "".equals(objectId)) {
    			//
    		} else {
    			objectWhere = "to[atisRequsetToPropertyData].from.id != '"+objectId+"'";
    		}
    		ml = DomainObject.findObjects(context, "atisPropertyMasterData", "*", objectWhere, busSelects);				
    	} catch(Exception e) {
    		
    	}
    	return ml;
    }
    
    public Map getPropertyType(Context context, String[] args) throws Exception {
    	
    	MapList ml = new MapList();
    	HashMap programMap = (HashMap) JPO.unpackArgs(args); // get data
    	Map rangeMap = new HashMap();
    	StringList busSelects = new StringList();
    	busSelects.add(DomainConstants.SELECT_ID);
    	busSelects.add(DomainConstants.SELECT_NAME);
    	
    	String atisLTAttr = EnoviaResourceBundle.getProperty(context, "Framework",
    			"emxFramework.Range.atisPropertyType.LTType", context.getSession().getLanguage());
    	String atisSTAttr = EnoviaResourceBundle.getProperty(context, "Framework",
    			"emxFramework.Range.atisPropertyType.STType", context.getSession().getLanguage());
    	
    	StringList fieldRangeValue = new StringList();
    	StringList fieldDisplayRangeValue = new StringList();
    	fieldRangeValue.add(atisLTAttr);
    	fieldDisplayRangeValue.add(atisLTAttr);
    	fieldRangeValue.add(atisSTAttr);
    	fieldDisplayRangeValue.add(atisSTAttr);
    	rangeMap.put("field_choices", fieldRangeValue);
    	rangeMap.put("field_display_choices", fieldDisplayRangeValue);
    	return rangeMap;
    	
    }
    
    public Map createPropertyMasterData(Context context, String[] args) throws Exception {
    	
    	Map programMap = JPO.unpackArgs(args);
    	// ContextUtil.startTransaction(context, true);
    	String objectId = (String) programMap.get("objectId");
    	String name = "";
    	String atisPropertyEvalUnit = (String) programMap.get("atisPropertyEvalUnit");
    	String atisPropertyType = (String) programMap.get("atisPropertyType");
    	
    	
    	Map returnMap = new HashMap();
    	//String strObjectGeneratorName = FrameworkUtil.getAliasForAdmin(context, DomainConstants.SELECT_TYPE, "Raw Material", true);
    	
    	try {
    		System.out.println(" [S] create test object ");
    		////
    		ContextUtil.startTransaction(context, true);
    		DomainObject dom = new DomainObject();
    		
    		name = DomainObject.getAutoGeneratedName(context, "type_atisPropertyMasterData", "");
    		// Map resultMap = createCodeMaster(context, programMap);
    		dom.createObject(context, "atisPropertyMasterData", name, "1", "atisPropertyDataPolicy", "eService Production");
    		//dom.setDescription(context, desc);
    		String newObjId = dom.getInfo(context, "id");
    		
    		
    		//DomainRelationship.connect(context, dom, "ContainsAllergen", new DomainObject(ghsArr[i]) );
    		
    		ContextUtil.commitTransaction(context);
    		
    		returnMap.put("id", newObjId);
    		
    		System.out.println(" [E] create test object ");
    	} catch (Exception e) {
    		e.printStackTrace();
    	}
    	
    	return returnMap;
    }
    
    public MapList getPartPropertiesData(Context context, String[] args) throws Exception {
    	
    	MapList ml = new MapList();
    	HashMap programMap = (HashMap)JPO.unpackArgs(args);
    	String partId = (String) programMap.get("objectId");
    	
    	StringList busSelects = new StringList();
    	busSelects.add(DomainConstants.SELECT_ID);
    	busSelects.add(DomainConstants.SELECT_NAME);
    	busSelects.add("attribute[atisPropertyType]");
    	busSelects.add("attribute[atisPropertyEvalUnit]");
    	busSelects.add("attribute[atisEvalResult]");
    	StringList relSelects = new StringList();
    	relSelects.add(DomainRelationship.SELECT_ID); 
    	relSelects.add(DomainRelationship.SELECT_NAME);
    	
    	DomainObject partDom = new DomainObject(partId);
    	MapList propertyDataMap = partDom.getRelatedObjects(context, "atisPropertiesDataRel", "*", busSelects, relSelects,
    			false, true, (short) 1, "", "", 0);
    	propertyDataMap.sortStructure("name", "ascending", "String");
    	// propertyDataMap.addSortKey("attribute[V_Name]", "descending", "String");
    	return propertyDataMap;
    }
    
    public Vector getFileName(Context context, String[] args) throws Exception {
    	
    	Vector fileActionsVector = new Vector();
    	HashMap programMap = (HashMap)JPO.unpackArgs(args);
    	HashMap paramMap = (HashMap) programMap.get("paramList");
    	String partId = (String)paramMap.get("objectId");
    	System.out.println("get File Name");
    	System.out.println("objectId:" + partId);
    	
    	StringList busSelects = new StringList();
    	busSelects.add(DomainConstants.SELECT_ID);
    	busSelects.add(DomainConstants.SELECT_NAME);
    	StringList relSelects = new StringList();
    	relSelects.add(DomainRelationship.SELECT_ID); 
    	relSelects.add(DomainRelationship.SELECT_NAME);
    	DomainObject partDom = new DomainObject(partId);
    	MapList propertyDataMap = partDom.getRelatedObjects(context, "atisPropertiesDataRel", "*", busSelects, relSelects,
    			false, true, (short) 1, "", "", 0);
    	propertyDataMap.sortStructure("name", "ascending", "String");
    	StringList propertiesData = partDom.getInfoList(context, "from[atisPropertiesDataRel].to.id");
    	int listSize = propertiesData.size();
    	StringBuilder sbDeliverableCWPTree = new StringBuilder();
    	String appendStr = "";
    	for(int i = 0 ; i<propertyDataMap.size() ; i++) {
    		Map pdMap = (Map) propertyDataMap.get(i);
    		String pdId = (String) pdMap.get("id");
    		DomainObject pdDom = new DomainObject(pdId);
    		StringList DocumentList = pdDom.getInfoList(context, "from[Reference Document].to.id");
    		
    		for(int j = 0 ; j<DocumentList.size() ; j++) {
    			String docId = DocumentList.get(j);
    			DomainObject docDom = new DomainObject(docId);
    			StringList activeVersionList = docDom.getInfoList(context, "from[Active Version].to.id");
    			
    			for(int k = 0 ; k<activeVersionList.size() ; k++) {
    				String activeVersionId = activeVersionList.get(k);
    				//System.out.println(activeVersionId);
    				DomainObject activeVersionDom = new DomainObject(activeVersionId);
    				String title = activeVersionDom.getAttributeValue(context, "Title");
    				//System.out.println("title:"+title);
    				sbDeliverableCWPTree.append("<a href=\"../common/emxNavigator.jsp?isPopup=false&amp;objectId=");
    				sbDeliverableCWPTree.append(XSSUtil.encodeForHTML(context, activeVersionId));
    				sbDeliverableCWPTree.append("\" target=\"_blank\">");
    				sbDeliverableCWPTree.append(XSSUtil.encodeForHTML(context, title));
    				sbDeliverableCWPTree.append("</a>");
    				sbDeliverableCWPTree.append(", ");
    			}
    		}
    		appendStr = sbDeliverableCWPTree.toString();
    		String str = "";
    		if(appendStr.length()>0) {
    			str = appendStr.substring(0, appendStr.length()-2);
    		}
    		System.out.println("str:"+ str);
    		fileActionsVector.add(str);
    		sbDeliverableCWPTree.setLength(0);
    	}
    	return fileActionsVector;
    }
    
    public MapList findCompareSpecViewPropertiesData(Context context, String[] map) throws Exception {
    	
    	MapList ml = new MapList();
    	
    	HashMap programMap = (HashMap)JPO.unpackArgs(map);
    	MapList returnMap = new MapList();
    	String objectId = (String) programMap.get("id");
    	DomainObject partDom = new DomainObject(objectId);
    	StringList propertiesData = partDom.getInfoList(context, "from[atisPropertiesDataRel].to.id");
    	LinkedHashMap rfMap = new LinkedHashMap();
    	for(int i = 0 ; i<propertiesData.size() ; i++) {
    		String pdId = propertiesData.get(i);
    		DomainObject pdDom = new DomainObject(pdId);
    		String unit = pdDom.getAttributeValue(context, "atisPropertyEvalUnit");
    		String result = pdDom.getAttributeValue(context, "atisEvalResult");
    		rfMap.put("PD-"+unit, result);
    	}
    	ml.add(rfMap);
    	return ml;
    }
    
    
    public StringList getTargetType(Context context, String[] args)throws Exception{
    	StringList returnList = new StringList();
    	Map paramMap 		= JPO.unpackArgs(args);
    	MapList mlLevel 	= (MapList) paramMap.get(BusinessUtil.OBJECT_LIST);
    	String tableName 	= (String)((Map) paramMap.get("paramList")).get("table");
    	Iterator itr = mlLevel.iterator();
    	while(itr.hasNext()){
    		Map objMap = (Map) itr.next();
    		String objID = (String) objMap.get(DomainConstants.SELECT_ID);
    		String formulationType = "";
    		if(objID != null && !"".equals(objID)) {
    			try {
    				DomainObject domObj = new DomainObject(objID);	
    				formulationType = domObj.getInfo(context, "to[atisPropertiesDataRel].from.type");
    				if(formulationType != null && !"".equals(formulationType)) {    					
    					formulationType=EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", context.getLocale(), "emxFramework.Type.".concat(formulationType.replace(' ', '_')));    				
    				}
    			}catch(Exception e) {
    				formulationType = "";
    			}
    		}
    		returnList.add(formulationType);
    	}
    	return returnList;
    }
    
    public Map createPropertyData(Context context, String[] args) throws Exception {
    	
    	Map programMap = JPO.unpackArgs(args);
    	// ContextUtil.startTransaction(context, true);
    	String objectId = (String) programMap.get("objectId");
    	String name = "";
    	String atisPropertyEvalUnit = (String) programMap.get("atisPropertyEvalUnit");
    	String atisPropertyType = (String) programMap.get("atisPropertyType");
    	String atisPropertyMasterOID = (String) programMap.get("atisPropertyMasterOID");
    	String atisFormulationPartOID = (String) programMap.get("atisFormulationPartOID");
    	
    	Map returnMap = new HashMap();
    	//String strObjectGeneratorName = FrameworkUtil.getAliasForAdmin(context, DomainConstants.SELECT_TYPE, "Raw Material", true);
    	
    	try {
    		System.out.println(" [S] create PD- object ");
    		////
    		ContextUtil.startTransaction(context, true);
    		DomainObject dom = new DomainObject();
    		
    		name = DomainObject.getAutoGeneratedName(context, "type_atisPropertyData", "");
    		// Map resultMap = createCodeMaster(context, programMap);
    		dom.createObject(context, "atisPropertyData", name, "1", "atisPropertyDataPolicy", "eService Production");
    		//dom.setDescription(context, desc);
    		String newObjId = dom.getInfo(context, "id");
    		
    		ContextUtil.commitTransaction(context);
    		if(StringUtils.isNotEmpty(atisPropertyMasterOID)) {
    			DomainObject masterDom = new DomainObject(atisPropertyMasterOID);
    			DomainRelationship.connect(context, masterDom, "atisFromMasterToResult",dom );
    			String masterType = masterDom.getAttributeValue(context, "atisPropertyType");
    			String masterEvalUnit = masterDom.getAttributeValue(context, "atisPropertyEvalUnit");
    			dom.setAttributeValue(context, "atisPropertyType", masterType);
    			dom.setAttributeValue(context, "atisPropertyEvalUnit", masterEvalUnit);
    		}
    		if(StringUtils.isNotEmpty(atisFormulationPartOID)) {
    			DomainObject formulaDom = new DomainObject(atisFormulationPartOID);
    			DomainRelationship.connect(context, formulaDom, "atisPropertiesDataRel",
    					new DomainObject(dom));
    		}
    		//DomainRelationship.connect(context, dom, "ContainsAllergen", new DomainObject(ghsArr[i]) );
    		DomainRelationship.connect(context, DomainObject.newInstance(context, objectId), "atisRequsetToPropertyData", dom);
    		
    		
    		returnMap.put("id", newObjId);
    		
    		System.out.println(" [E] create PD- object ");
    	} catch (Exception e) {
    		e.printStackTrace();
    	}
    	
    	return returnMap;
    }
    
    public StringList getTargetName(Context context, String[] args)throws Exception{
    	StringList returnList = new StringList();
    	Map paramMap 		= JPO.unpackArgs(args);
    	MapList mlLevel 	= (MapList) paramMap.get(BusinessUtil.OBJECT_LIST);
    	StringList selectSmts = new StringList();
    	selectSmts.add("type");
    	selectSmts.add("name");
    	selectSmts.add("attribute[Title]");
    	selectSmts.add("attribute[V_Name]");
    	selectSmts.add("attribute[atisGDC_CODE]");
    	selectSmts.add("to[Formulation Propagate].from.attribute[Title]");
    	Iterator itr = mlLevel.iterator();
    	while(itr.hasNext()){
    		Map objMap = (Map) itr.next();
    		String objID = (String) objMap.get(DomainConstants.SELECT_ID);
    		String sb = "";
    		if(objID != null && !"".equals(objID)) {
    			DomainObject domObj = DomainObject.newInstance(context);	
    			try {
    				domObj.setId(objID);
    				MapList maplist = domObj.getRelatedObjects(context, "atisRequsetToPropertyData,atisPartToRequest", "*", selectSmts, null, true, false, (short) 2, "", "", 0);
    				sb = ((java.util.List<Map>) maplist).stream().filter(m -> "2".equals((String) m.get("level"))).map(m -> {
    					String title = "";
    					String type = (String) m.get("type");
    					if("Formulation Part".equals(type)) {
    						title = (String) m.get("to[Formulation Propagate].from.attribute[Title]");
    						title = title + " (" + (String) m.get("name") + ")";
    					} else if("Raw Material".equals(type)) {
    						title = (String) m.get("attribute[V_Name]");
    						String code = (String) m.get("attribute[atisGDC_CODE]");
    						if(code != null && !"".equals(code)) {
    							title = title + " (" + code +")";
    						}
    					} else if("Consumer Unit Part".equals(type)) {
    						title = (String) m.get("attribute[V_Name]");
    					}
    					else {
    						title = (String) m.get("attribute[V_Name]");
    						title = (title == null || "".equals(title)) ? (String) m.get("attribute[Title]") : title;
    						title = (title == null || "".equals(title)) ? (String) m.get("name") : title;
    					}
    					return title;
    				}).collect(Collectors.joining("<BR/>"));
    			}catch(Exception e) {
    				sb = "";
    			}
    		}
    		returnList.add(sb);
    	}
    	return returnList;
    }
    
    public MapList findMasterDataToPropertiesData(Context context, String[] args) throws Exception {
    	
    	MapList returnList = null;
    	HashMap programMap = (HashMap) JPO.unpackArgs(args);
    	String objectId    = (String) programMap.get("objectId");
    	String reportFormat = (String) programMap.get("reportFormat");
    	try {
    		StringList typeSelects = new StringList("id");
    		String objectWhere = "";
    		DomainObject domainObject = DomainObject.newInstance(context, objectId);
    		returnList = domainObject.getRelatedObjects(context, "atisPropertiesDataRel", "atisPropertyData",
    				typeSelects, null, false, true, (short) 0, objectWhere, null, 0);
    		
    	} catch(Exception e) {
    		//e.printStackTrace();
    	}
    	return returnList;
    }
    
    public String getRelMasterData(Context context, String[] args) throws Exception{
    	StringBuffer sbHref  = new StringBuffer();
    	HashMap programMap = (HashMap) JPO.unpackArgs(args);
    	Map requestMap     = (Map) programMap.get("requestMap");
    	String objectId    = (String) requestMap.get("objectId");
    	String reportFormat = (String) requestMap.get("reportFormat");
    	try {
    		DomainObject domainObject = DomainObject.newInstance(context, objectId);
    		StringList select = new StringList();
    		StringList oIdList = domainObject.getInfoList(context,"to[atisPropertiesDataRel].from.id");
    		for(int i = 0; i<oIdList.size(); i++) {
    			String oId = oIdList.get(i);
    			DomainObject domainObject2 = DomainObject.newInstance(context, oId);
    			
    			String name = domainObject2.getName(context);
    			
    			if(StringUtils.isNotEmpty(oId)) {
    				
    				sbHref.append("<A HREF=\"JavaScript:showDetailsPopup('../common/emxTree.jsp?objectId=");
    				sbHref.append(oId);
    				sbHref.append("&mode=replace");
    				sbHref.append("&AppendParameters=true");
    				sbHref.append("&reloadAfterChange=true");
    				sbHref.append("')\"class=\"object\">");
    				sbHref.append("<img border=\"0\" src=\"");
    				sbHref.append("../common/images/iconSmallPart.png");
    				sbHref.append("\"</img>");
    				sbHref.append("</A>");
    				sbHref.append("&nbsp");
    				sbHref.append("<A HREF=\"javascript:showDetailsPopup('../common/emxTree.jsp?objectId=");
    				sbHref.append(oId);
    				sbHref.append("&mode=replace");
    				sbHref.append("&AppendParameters=true");
    				sbHref.append("&reloadAfterChange=true");
    				sbHref.append("')\"class=\"object\">");
    				sbHref.append(name);
    				sbHref.append("</A>");
    				if(!(i==oIdList.size()-1)) {
    					sbHref.append("<br>");
    				}
    			}
    		}
    	} catch(Exception e) {
    		//e.printStackTrace();
    	}
    	return sbHref.toString();
    }
    
    public MapList getPropertyData(Context context, String[] args) throws Exception {
    	MapList ml = new MapList();
    	try {
    		HashMap programMap = (HashMap) JPO.unpackArgs(args); 
    		String objectId = (String) programMap.get("objectId");
    		String objectWhere = "";
    		if(objectId != null && !"".equals(objectId)) {
    			objectWhere = "to[atisPartToRequest].from.id == '" + objectId + "'";
    			StringList busSelects = new StringList();
    			busSelects.add(DomainConstants.SELECT_ID);
    			ml = DomainObject.findObjects(context, "atisPropertyData", "*", "*", "*", "*", 
    					objectWhere, null, true, busSelects, (short) 0);
    		}
    	} catch(Exception ex) {
    		ml = new MapList();
    	}
    	return ml;
    }

}