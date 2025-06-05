import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import com.atis.atisFoodSafetyKoreaService;
import com.dassault_systemes.enovia.formulation.custom.enumeration.FormulationType;
import com.matrixone.apps.cpn.util.BusinessUtil;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.XSSUtil;

import antlr.collections.List;
import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;


public class atisFormulation_mxJPO {
	
    public String getReleasePhaseName(Context context, String[] args) throws Exception{
    	String releasePhase = "";
    	HashMap programMap = (HashMap) JPO.unpackArgs(args);
        Map requestMap     = (Map) programMap.get("requestMap");
        String objectId    = (String) requestMap.get("objectId");
        String reportFormat = (String) requestMap.get("reportFormat");
		try {
			DomainObject domainObject = DomainObject.newInstance(context, objectId);
			StringList select = new StringList();
			select.add("attribute[Release Phase]");
			releasePhase = domainObject.getInfo(context, "attribute[Release Phase]");
			if(releasePhase != null) {
				EnoviaResourceBundle.getProperty(context, "emxCPNStringResource", context.getLocale(), "emxFramework.Range.Release_Phase."+releasePhase);
			} else {
				releasePhase = "";
			}
		} catch(Exception e) {
			releasePhase = "";
			//e.printStackTrace();
		}
        return releasePhase;
    }
    
	/**
  	 * Select the Target Field
  	 * @param Context context
  	 * @param args holds information about object.
  	 * @return Target Field.
  	 * @throws Exception if operation fails.
  	 */
	@com.matrixone.apps.framework.ui.ProgramCallable
	public String selectTargetList(Context context,String[] args) throws Exception {
		StringBuilder sb = new StringBuilder();
		HashMap programMap = (HashMap) JPO.unpackArgs(args);
		HashMap requestMap = (HashMap) programMap.get("requestMap");
		String strMode = (String) requestMap.get("mode");
		String objectId = (String) requestMap.get("objectId");
		
		// For export to CSV
		String exportFormat = null;
		boolean exportToExcel = false;
		if(requestMap!=null && requestMap.containsKey("reportFormat")){
			exportFormat = (String)requestMap.get("reportFormat");
		}
		if("CSV".equals(exportFormat)){
			exportToExcel = true;
		}
		
		StringList selectSmts = new StringList();
		selectSmts.add("id");
    	selectSmts.add("type");
    	selectSmts.add("name");
    	selectSmts.add("attribite[Title]");
    	selectSmts.add("attribite[V_Name]");
    	selectSmts.add("to[Formulation Propagate].from.attribute[Title]");
		String targets = "";
		if(objectId != null && !"".equals(objectId)) {			
			DomainObject domObj = DomainObject.newInstance(context,objectId);
			if("Formulation Part".contentEquals(domObj.getInfo(context, "type"))) {
				domObj.setId(domObj.getInfo(context, "to[Formulation Propagate].from.id"));
			}
			targets = domObj.getInfo(context, "attribute[atisPreSelectRawMaterials]");
			targets = targets == null ? "" : targets;
		}
		if("edit".equalsIgnoreCase(strMode) || "create".equalsIgnoreCase(strMode)) {
			String add= EnoviaResourceBundle.getProperty(context, "Framework", "emxFramework.Label.atisAddMaterial", context.getSession().getLanguage());
			String remove = EnoviaResourceBundle.getProperty(context, "Framework", "emxFramework.Label.atisRemoveMaterial", context.getSession().getLanguage());
			//XSSOK
			sb.append("<input type=\"hidden\" name=\"IsTargetFieldModified\" id=\"IsTargetFieldModified\" value=\"false\" readonly=\"readonly\" />"); 
			//XSSOK
			sb.append("<input type=\"hidden\" name=\"TargetHidden\" id=\"TargetHidden\" value=\""+targets+"\" readonly=\"readonly\" />");
			
			sb.append("<table>");
			sb.append("<tr>");
			sb.append("<th rowspan=\"2\">");
			sb.append("<select name=\"Target\" style=\"width:200px\" multiple=\"multiple\">");
			
			StringList targetList = FrameworkUtil.split(targets, ",");
			DomainObject domObj = DomainObject.newInstance(context);	
			for(int k=0,size=targetList.size();k<size;k++) {
				domObj.setId(targetList.get(k));
				String title = domObj.getInfo(context, "attribute[V_Name]");
				title = (title == null || "".equals(title)) ? domObj.getInfo(context, "name") : title;
				
				sb.append("<option value=\"").append(targetList.get(k)).append("\" >").append(title).append("</option>");
			}

			sb.append("</select>");
			sb.append("</th>");
			sb.append("<td>");
			sb.append("<img src=\"../common/images/iconStatusAdded.gif\" width=\"12\" height=\"12\" border=\"0\" />");
			sb.append("<a href=\"javascript:addMaterialTarget()\">");
			//XSSOK
			sb.append(add);
			sb.append("</a>");
			//sb.append("</div>");
			sb.append("</td>");
			sb.append("</tr>");
			sb.append("<tr>");
			sb.append("<td>");
			sb.append("<img src=\"../common/images/iconStatusRemoved.gif\" width=\"12\" height=\"12\" border=\"0\" />");
			sb.append("<a href=\"javascript:removeMaterialTarget()\">");
			//XSSOK
			sb.append(remove);
			sb.append("</a>");
			sb.append("</td>");
			sb.append("</tr>");
			sb.append("</table>");
		} else {
			//XSSOK
			sb.append("<input type=\"hidden\" name=\"TargetHidden\" id=\"TargetHidden\" value=\""+targets+"\" readonly=\"readonly\" />");
			
			String targetName = "";
			String trtn = "\n";
			if(!exportToExcel) {
				trtn = "<br>";
			} 
			StringList targetList = FrameworkUtil.split(targets, ",");
			DomainObject domObj = DomainObject.newInstance(context);	
			for(int k=0,size=targetList.size();k<size;k++) {
				domObj.setId(targetList.get(k));
				String title = domObj.getInfo(context, "attribute[V_Name]");
				String id = domObj.getInfo(context, "id");
				title = (title == null || "".equals(title)) ? domObj.getInfo(context, "name") : title;
				sb.append("<input type=\"hidden\" name=\"").append(title).append("\" value=\"").append(targetList.get(k)).append("\" />");
				//sb.append("<p>").append(title).append("</p>");
				sb.append("<a href=\"../common/emxNavigator.jsp?isPopup=false&amp;objectId=");
				sb.append(XSSUtil.encodeForHTML(context, id));
				sb.append("\" target=\"_blank\">");
				sb.append(title).append("</a>");
				
				if(k==(size-1)) {
					
				}else {
					sb.append(",");
				}
			}
		}
		return sb.toString();
	}
	
    public void updateatisPreSelectRawMaterials(Context context, String[] args) throws FrameworkException {
    	try {
    		HashMap programMap = (HashMap) JPO.unpackArgs(args);
        	HashMap requestMap = (HashMap) programMap.get("requestMap");
        	HashMap paramMap = (HashMap) programMap.get("paramMap");
        	String parentId = (String) requestMap.get("parentOID");
        	String objectId = (String) paramMap.get("objectId");
        	String relId = (String) paramMap.get("relId");
        	String newValue = (String) paramMap.get("New Value");
        	String[] targetHiddens = (String[]) requestMap.get("TargetHidden");
        	newValue = newValue == null ? "" : newValue;
        	String targetHidden = targetHiddens == null ? "" : targetHiddens[0];
        	DomainObject domainObject = new DomainObject();
        	domainObject.setId(objectId);
        	domainObject.setAttributeValue(context, "atisPreSelectRawMaterials", targetHidden);
    	} catch(Exception e) {
    		e.printStackTrace();
    		throw new FrameworkException("Update Process Failed.\nPlease contact to Administrator");
    	}
    }
    
    @com.matrixone.apps.framework.ui.IncludeOIDProgramCallable
	public StringList includeRawMaterial(Context context, String args[]) {
		StringList slRawMaterial = new StringList();
		try {
			HashMap programMap = (HashMap) JPO.unpackArgs(args);
		    String strObjectId = (String)  programMap.get("objectId");
		    DomainObject prodObj = new DomainObject(strObjectId);
		    String sRawMaterial = prodObj.getInfo(context, "to[Planned For].from.to[Formulation Propagate].from.attribute[atisPreSelectRawMaterials]");
		    sRawMaterial = sRawMaterial == null ? "" : sRawMaterial;
		    slRawMaterial = FrameworkUtil.split(sRawMaterial, ",");
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		
		return slRawMaterial;
	}


    public MapList getCompareReport(Context context, String[] args) throws Exception{
    	
    	MapList programMap = (MapList) JPO.unpackArgs(args);
    	StringBuffer buffer = new StringBuffer();
    	
    	
    	MapList m = new MapList();
    	String[] arr = (String[]) programMap.get(1);
    	MapList mapList = (MapList) programMap.get(0);
    	
    	// Calculate the length of mapList and generate indices
    	ArrayList<Integer> evenIndices = new ArrayList();
        for (int i = 0; i < mapList.size(); i++) {
            if (i % 2 == 0) { // 짝수 인덱스만 추가
                evenIndices.add(i);
            }
        }
        StringBuilder startBuilder = new StringBuilder();
        startBuilder.append("비교 보고서");
        startBuilder.append("\n");
        startBuilder.append("\n");
        startBuilder.append("\n");
        // Add the constructed string to the buffer
        buffer.append(startBuilder.toString());
    	// Loop through the keys in arr
       // for (String key : arr) {
        for (int i = 4; i < arr.length; i++) {
        	StringBuilder strBuilder = new StringBuilder();
        	String key = arr[i];
        	if (key.matches("[1-9]") || key.equals("atisExpData")) {
                continue;
            }else if(key.contains("atis")) {
            	String atisKey = EnoviaResourceBundle.getProperty(context, "Framework",
            			"emxFramework.Attribute."+key, context.getSession().getLanguage());
            	strBuilder.append(atisKey).append(",");
            }else if("name".equals(key)){
            	strBuilder.append(EnoviaResourceBundle.getProperty(context, "Framework",
            			"emxFramework.Common.Name", context.getSession().getLanguage())).append(",");
            }else if("type".equals(key)){
            	strBuilder.append(EnoviaResourceBundle.getProperty(context, "Framework",
            			"emxFramework.Common.Type", context.getSession().getLanguage())).append(",");
            }else if("revision".equals(key)){
            	strBuilder.append(EnoviaResourceBundle.getProperty(context, "Framework",
            			"emxFramework.Common.Rev", context.getSession().getLanguage())).append(",");
            }
        	
        	
            else {
            	strBuilder.append(key).append(",");
            }
            
            // Access only even indices of mapList
            for (int index : evenIndices) {
            	String value = "";
                Map<String, String> map = (Map) mapList.get(index);
                if("atis_equivalent".equals(key) ||
                		"atis_yield".equals(key) ||
                		"atis_viscosity_cps75".equals(key) ||
                		"atis_viscosity_cps100".equals(key) ||
                		"atis_HyCl".equals(key) ||
                		"atis_GPC".equals(key) ||
                		"atis_residual_ECH_content".equals(key) ||
                		"atis_residual_solvent_content".equals(key) ||
                		"atis_remark".equals(key)) {
                	value = map.getOrDefault("attribute["+key+"]", "");
                }else {
                	value = map.getOrDefault(key, "");
                }
                if (!value.equals("")) {
                    strBuilder.append("\"").append(value).append("\",");
                }else {
                	strBuilder.append("\"").append("").append("\",");
                }
               
            }
            strBuilder.append("\n");
            // Add the constructed string to the buffer
            buffer.append(strBuilder.toString());
        }
    	m.add(buffer);
    	System.out.println(m);	
    	System.out.println("test");	
    //	return exportReport;
    	//return m;
    	
		return m;
    }
}
