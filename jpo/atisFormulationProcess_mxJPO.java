import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import com.atis.atisFoodSafetyKoreaService;
import com.dassault_systemes.enovia.formulation.custom.enumeration.FormulationRelationship;
import com.dassault_systemes.enovia.formulation.custom.enumeration.FormulationType;
import com.matrixone.apps.cpn.util.BusinessUtil;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.XSSUtil;
import com.matrixone.apps.engineering.EngineeringConstants;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;


public class atisFormulationProcess_mxJPO {
	
	@com.matrixone.apps.framework.ui.IncludeOIDProgramCallable
	public StringList includeMasterFormulationPhase(Context context, String args[]) {
		StringList slFormulationPhase = new StringList();
		StringList resultSelects 		= StringList.create("id");
		StringBuilder sbWhere 			= new StringBuilder(32);
		
		sbWhere.append("attribute[atisIsMaster] == 'TRUE'");
		
		try {
			MapList mlFormulationPhase = DomainObject.findObjects(
								        context,
								        FormulationType.FORMULATION_PHASE.getType(context),		
								        "*",	// Name
								        "*", // Revision
								        "*", //owner
								        null, //vault
								        sbWhere.toString(),
								        true,
								        resultSelects);
			
			slFormulationPhase	= BusinessUtil.getIdList(mlFormulationPhase);
		} catch (FrameworkException e) {
			e.printStackTrace();
		}
		
		return slFormulationPhase;
	}
	
	public MapList getFormulaData(Context context, String[] args) throws Exception {
    	System.err.println("atisFormulationProcess:getFormulaDat");
    	MapList propertyDataMap = new MapList();
    	try {
    		HashMap programMap = (HashMap)JPO.unpackArgs(args);
        	String partId = (String) programMap.get("objectId");
        	System.err.println(">>> objectId: " + partId);
        	StringList busSelects = new StringList();
        	busSelects.add(DomainConstants.SELECT_ID);
        	busSelects.add(DomainConstants.SELECT_NAME);
        	busSelects.add("attribute[V_Name]");
        	StringList relSelects = new StringList();
        	relSelects.add(DomainRelationship.SELECT_ID); 
        	relSelects.add(DomainRelationship.SELECT_NAME);
        	
        	DomainObject partDom = new DomainObject(partId);
        	partId = partDom.getInfo(context, "from[Planned For].to.id");
        	partDom.setId(partId);
        	propertyDataMap = partDom.getRelatedObjects(context, "FBOM", "*", busSelects, relSelects, false, true, (short) 1, "", "", 0);
        	propertyDataMap.sortStructure("name", "ascending", "String");
        	propertyDataMap.addSortKey("attribute[V_Name]", "descending", "String");
    	}catch(Exception e) {
    		e.printStackTrace();
    	}
    	return propertyDataMap;
    }
	
	public String getFormulaHTMLData(Context context, String[] args) {
		StringBuffer sb = new StringBuffer();
		StringBuffer sb2 = new StringBuffer();
		sb.append("<table style='border-collapse: collapse;float: left;margin: 0 4em 0 0;'>");
		sb2.append("<table style='border-collapse: collapse;float: left;margin: 0 4em 0 0;'>");
		try {
			sb.append("<thead style='border-bottom: 3px solid #b5b5b5;'>");
			sb.append("<tr>");
			sb.append("<th style='padding: 5px;width: 100px;'>");
			sb.append(EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", context.getLocale(), "emxFramework.Label.RawMaterial"));
			sb.append("</th>");
			sb.append("<th style='padding: 5px;width: 80px;'>");
			sb.append(EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", context.getLocale(), "emxFramework.Label.atisFormulaRelAttr1"));
			sb.append("</th>");
			sb.append("<th style='padding: 5px;width: 100px;'>");
			sb.append(EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", context.getLocale(), "emxFramework.Label.atisFormulaRelAttr2"));
			sb.append("</th>");
			sb.append("<th style='padding: 5px;width: 110px;'>");
			sb.append(EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", context.getLocale(), "emxFramework.Label.atisFormulaRelAttr3"));
			sb.append("</th>");
			sb.append("<th style='padding: 5px;width: 100px;'>");
			sb.append(EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", context.getLocale(), "emxFramework.Label.atisFormulaRelAttr4"));
			sb.append("</th>");
			sb.append("</tr>");
			sb.append("</thead>");
			sb.append("<tbody>");
			sb2.append("<thead style='border-bottom: 3px solid #b5b5b5;'>");
			sb2.append("<tr>");
			sb2.append("<th style='padding: 5px;width: 100px;'>");
			sb2.append(EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", context.getLocale(), "emxFramework.Label.RawMaterial"));
			sb2.append("</th>");
			sb2.append("<th style='padding: 5px;width: 80px;'>");
			sb2.append(EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", context.getLocale(), "emxFramework.Label.atisFormulaRelAttr1"));
			sb2.append("</th>");
			sb2.append("<th style='padding: 5px;width: 100px;'>");
			sb2.append(EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", context.getLocale(), "emxFramework.Label.atisFormulaRelAttr2"));
			sb2.append("</th>");
			sb2.append("<th style='padding: 5px;width: 110px;'>");
			sb2.append(EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", context.getLocale(), "emxFramework.Label.atisFormulaRelAttr3"));
			sb2.append("</th>");
			sb2.append("<th style='padding: 5px;width: 100px;'>");
			sb2.append(EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", context.getLocale(), "emxFramework.Label.atisFormulaRelAttr4"));
			sb2.append("</th>");
			sb2.append("</tr>");
			sb2.append("</thead>");
			sb2.append("<tbody>");
			
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			Map paramMap = (Map) programMap.get("paramMap");
        	String partId = (String) paramMap.get("objectId");
        	StringList busSelects = new StringList();
        	busSelects.add(DomainConstants.SELECT_ID);
        	busSelects.add(DomainConstants.SELECT_NAME);
        	busSelects.add(DomainConstants.SELECT_TYPE);
        	busSelects.add("attribute[V_Name]");
        	busSelects.add("attribute[atis_molecular_formula]");
        	StringList relSelects = new StringList();
        	relSelects.add(DomainRelationship.SELECT_ID); 
        	relSelects.add(DomainRelationship.SELECT_NAME);
        	relSelects.add("attribute[atisFormulaRelAttr1]");
        	relSelects.add("attribute[atisFormulaRelAttr2]");
        	relSelects.add("attribute[atisFormulaRelAttr3]");
        	relSelects.add("attribute[atisFormulaRelAttr4]");
        	
        	DomainObject partDom = new DomainObject(partId);
        	partId = partDom.getInfo(context, "from[Planned For].to.id");
        	System.out.println(">>> PARTID: " + partId);
        	partDom.setId(partId);
        	MapList list = partDom.getRelatedObjects(context, "FBOM", "*", busSelects, relSelects, false, true, (short) 2, "", "", 0);
        	list.sortStructure("name", "ascending", "String");
        	list.addSortKey("attribute[V_Name]", "descending", "String");
        	StringList compares = new StringList();
        	list = new MapList();
        	Map map = new HashMap();
        	map.put("type", "custom");
        	map.put("level", "1");
        	map.put("attribute[atis_molecular_formula]", "BPA1");
        	map.put("attribute[V_Name]", "BPA1");
        	map.put("attribute[atisFormulaRelAttr1]", "1");
        	map.put("attribute[atisFormulaRelAttr2]", "43");
        	map.put("attribute[atisFormulaRelAttr3]", "14");
        	map.put("attribute[atisFormulaRelAttr4]", "10");
        	list.add(map);
        	map = new HashMap();
        	map.put("type", "custom");
        	map.put("level", "1");
        	map.put("attribute[atis_molecular_formula]", "ECH1");
        	map.put("attribute[V_Name]", "ECH1");
        	map.put("attribute[atisFormulaRelAttr1]", "6");
        	map.put("attribute[atisFormulaRelAttr2]", "90");
        	map.put("attribute[atisFormulaRelAttr3]", "15");
        	map.put("attribute[atisFormulaRelAttr4]", "20");
        	list.add(map);
        	map = new HashMap();
        	map.put("type", "custom");
        	map.put("level", "1");
        	map.put("attribute[atis_molecular_formula]", "NaOH 50%");
        	map.put("attribute[V_Name]", "ECH1");
        	map.put("attribute[atisFormulaRelAttr1]", "6");
        	map.put("attribute[atisFormulaRelAttr2]", "78");
        	map.put("attribute[atisFormulaRelAttr3]", "522");
        	map.put("attribute[atisFormulaRelAttr4]", "10");
        	list.add(map);
        	for(Iterator itr = list.listIterator();itr!=null && itr.hasNext();){
				Map m = (Map)itr.next();
				String type = (String) m.get("type");
				String level = (String) m.get("level");
				String name = (String) m.get("attribute[atis_molecular_formula]");
				if(name == null || "".equals(name)) {
					name = (String) m.get("attribute[V_Name]");
				}
				String attr1 = (String) m.get("attribute[atisFormulaRelAttr1]");
				attr1 = attr1 == null ? "" : attr1;
				String attr2 = (String) m.get("attribute[atisFormulaRelAttr2]");
				attr2 = attr2 == null ? "" : attr2;
				String attr3 = (String) m.get("attribute[atisFormulaRelAttr3]");
				attr3 = attr3 == null ? "" : attr3;
				String attr4 = (String) m.get("attribute[atisFormulaRelAttr4]");
				attr4 = attr4 == null ? "" : attr4;
				if("Raw Material".equals(type)) {
					if(!compares.contains(name)) {
						sb2.append("<tr>");
						sb2.append("<td style='padding: 5px;width: 100px;'>").append(name).append("</td>");
						sb2.append("<td style='padding: 5px;width: 80px;'>").append(attr1).append("</td>");
						sb2.append("<td style='padding: 5px;width: 100px;'>").append(attr2).append("</td>");
						sb2.append("<td style='padding: 5px;width: 110px;'>").append(attr3).append("</td>");
						sb2.append("<td style='padding: 5px;width: 100px;'>").append(attr4).append("</td>");
						sb2.append("</tr>");
						compares.add(name);
					}
				} else if("1".equals(level)){
					sb.append("<tr>");
					sb.append("<td style='padding: 5px;width: 100px;'>").append(name).append("</td>");
					sb.append("<td style='padding: 5px;width: 80px;'>").append(attr1).append("</td>");
					sb.append("<td style='padding: 5px;width: 100px;'>").append(attr2).append("</td>");
					sb.append("<td style='padding: 5px;width: 110px;'>").append(attr3).append("</td>");
					sb.append("<td style='padding: 5px;width: 100px;'>").append(attr4).append("</td>");
					sb.append("</tr>");
				}
			}
		} catch(Exception e) {
			e.printStackTrace();
		} 
		sb.append("</tbody>");
		sb.append("</table>");
		sb2.append("</tbody>");
		sb2.append("</table>");
		return sb.toString();
	}
	
	public Boolean updateRelAttrTable(Context context, String[] args) throws Exception {
        HashMap programMap = (HashMap)JPO.unpackArgs(args);
        HashMap paramMap = (HashMap)programMap.get("paramMap");
        java.util.Set<String> keySet = programMap.keySet();
        java.util.Iterator<String> keyIter = keySet.iterator();
        while(keyIter.hasNext()) {
        	String key = keyIter.next();
        	System.out.println(key);
        }
        String relId  = (String)paramMap.get("relId");
        String newValue = (String)paramMap.get("New Value");
        DomainRelationship domRel = new DomainRelationship(relId);
        //domRel.setAttributeValue(context, DomainConstants.ATTRIBUTE_FIND_NUMBER, newValue);
        return Boolean.TRUE;
    }
	
	public String getPropertyData(Context context, String[] args) {
		StringBuffer sb = new StringBuffer();
		sb.append("<table style='border-collapse: collapse;float: left;margin: 0 0 2em;'>");
		try {
			sb.append("<thead style='border-bottom: 3px solid #b5b5b5;'>");
			sb.append("<tr>");
			sb.append("<th style='padding: 5px;width: 60px;'>");
			sb.append(EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", context.getLocale(), "emxFramework.Common.Name"));
			sb.append("</th>");
			sb.append("<th style='padding: 5px;width: 100px;'>");
			sb.append(EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", context.getLocale(), "emxFramework.Attribute.AtisPropertyType"));
			sb.append("</th>");
			sb.append("<th style='padding: 5px;width: 180px;'>");
			sb.append(EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", context.getLocale(), "emxFramework.Attribute.AtisPropertyEvalUnit"));
			sb.append("</th>");
			sb.append("<th style='padding: 5px;'>");
			sb.append(EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", context.getLocale(), "emxFramework.Attribute.AtisEvalResult"));
			sb.append("</th>");
			sb.append("</tr>");
			sb.append("</thead>");
			sb.append("<tbody>");
			
			HashMap programMap = (HashMap)JPO.unpackArgs(args);
			Map paramMap = (Map) programMap.get("paramMap");
        	String partId = (String) paramMap.get("objectId");
        	DomainObject partDom = new DomainObject(partId);
        	StringList busSelects = new StringList();
        	busSelects.add("name");
        	busSelects.add("attribute[atisPropertyType]");
        	busSelects.add("attribute[atisPropertyEvalUnit]");
        	busSelects.add("attribute[atisEvalResult]");
        	MapList list = partDom.getRelatedObjects(context, "atisPropertiesDataRel", "*", busSelects, null, false, true, (short) 1, "", "", 0);
        	for(Iterator itr = list.listIterator();itr!=null && itr.hasNext();){
				Map m = (Map)itr.next();
				String name = (String) m.get("name");
				String attr1 = (String) m.get("attribute[atisPropertyType]");
				attr1 = attr1 == null ? "" : attr1;
				String attr2 = (String) m.get("attribute[atisPropertyEvalUnit]");
				attr2 = attr2 == null ? "" : attr2;
				String attr3 = (String) m.get("attribute[atisEvalResult]");
				attr3 = attr3 == null ? "" : attr3;
				sb.append("<tr>");
				sb.append("<td style='padding: 5px;width: 100px;'>").append(name).append("</td>");
				sb.append("<td style='padding: 5px;width: 100px;'>").append(attr1).append("</td>");
				sb.append("<td style='padding: 5px;width: 180px;'>").append(attr2).append("</td>");
				sb.append("<td style='padding: 5px;'>").append(attr3).append("</td>");
				sb.append("</tr>");
			}
		} catch(Exception e) {
			e.printStackTrace();
		} 
		sb.append("</tbody>");
		sb.append("</table>");
		return sb.toString();
	}
	
	
}
