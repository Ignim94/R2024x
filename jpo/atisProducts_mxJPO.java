import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;


import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.XSSUtil;
import com.matrixone.apps.domain.util.mxType;
import com.matrixone.apps.framework.ui.UIUtil;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.List;
import matrix.util.StringList;


public class atisProducts_mxJPO {

    public String getConsumerUnitPartName(Context context, String[] args) throws Exception{
    	StringBuffer sbHref  = new StringBuffer();
    	HashMap programMap = (HashMap) JPO.unpackArgs(args);
        Map requestMap     = (Map) programMap.get("requestMap");
        String objectId    = (String) requestMap.get("objectId");
        String reportFormat = (String) requestMap.get("reportFormat");
		try {
			DomainObject domainObject = DomainObject.newInstance(context, objectId);
			StringList select = new StringList();
			select.add("from[atisProductsToPart].to.id");
			select.add("from[atisProductsToPart].to.name");
			Map infoMap = domainObject.getInfo(context, select);
			if(infoMap!=null) {
				String partId = (String) infoMap.get("from[atisProductsToPart].to.id");
				String partName = (String) infoMap.get("from[atisProductsToPart].to.name");
				
				if(partId != null && !"".equals(partId)) {
					sbHref.append("<A HREF=\"JavaScript:showDetailsPopup('../common/emxTree.jsp?objectId=");
			        sbHref.append(partId);
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
			        sbHref.append(partId);
			        sbHref.append("&mode=replace");
			        sbHref.append("&AppendParameters=true");
			        sbHref.append("&reloadAfterChange=true");
			        sbHref.append("')\"class=\"object\">");
			        sbHref.append(partName);
			        sbHref.append("</A>");
				}
			}
		} catch(Exception e) {
			//e.printStackTrace();
		}
        return sbHref.toString();
    }
    
    public String getFormulationName(Context context, String[] args) throws Exception{
    	StringBuffer sbHref  = new StringBuffer();
    	HashMap programMap = (HashMap) JPO.unpackArgs(args);
        Map requestMap     = (Map) programMap.get("requestMap");
        String objectId    = (String) requestMap.get("objectId");
        String reportFormat = (String) requestMap.get("reportFormat");
		try {
			DomainObject domainObject = DomainObject.newInstance(context, objectId);
			StringList select = new StringList();
			select.add("from[atisProductsToPart].to.from[EBOM].to.id");
			select.add("from[atisProductsToPart].to.from[EBOM].to.name");
			Map infoMap = domainObject.getInfo(context, select, select);
			if(infoMap!=null) {
				StringList partIdList = (StringList) infoMap.get("from[atisProductsToPart].to.from[EBOM].to.id");
				StringList partNameList = (StringList) infoMap.get("from[atisProductsToPart].to.from[EBOM].to.name");
				
				if(partIdList != null && partIdList.size()>0) {
					String partId = partIdList.get(0);
					String partName = partNameList.get(0);
					
					sbHref.append("<A HREF=\"JavaScript:showDetailsPopup('../common/emxTree.jsp?objectId=");
			        sbHref.append(partId);
			        sbHref.append("&mode=replace");
			        sbHref.append("&AppendParameters=true");
			        sbHref.append("&reloadAfterChange=true");
			        sbHref.append("')\"class=\"object\">");
			        sbHref.append("<img border=\"0\" src=\"");
			        sbHref.append("../common/images/iconMenuMaterialsCompliance.png");
			        sbHref.append("\"</img>");
			        sbHref.append("</A>");
			        sbHref.append("&nbsp");
			        sbHref.append("<A HREF=\"javascript:showDetailsPopup('../common/emxTree.jsp?objectId=");
			        sbHref.append(partId);
			        sbHref.append("&mode=replace");
			        sbHref.append("&AppendParameters=true");
			        sbHref.append("&reloadAfterChange=true");
			        sbHref.append("')\"class=\"object\">");
			        sbHref.append(partName);
			        sbHref.append("</A>");
				}
			}
		} catch(Exception e) {
			//e.printStackTrace();
		}
        return sbHref.toString();
    }
    
    public Map createProducts(Context context, String[] args) throws Exception {
    	Map returnMap = new HashMap();
    	String id = null;
    	StringBuffer text = new StringBuffer();
    	try {
    		ContextUtil.startTransaction(context, true);
    		
    		Map paramMap = JPO.unpackArgs(args);
    		
    		String atisProcessCondition = (String) paramMap.get("atisProcessCondition");
    		String atisGDC_CODE = (String) paramMap.get("atisGDC_CODE");
    		String atisRectTemperature = (String) paramMap.get("atisRectTemperature");
    		String atisRectTime = (String) paramMap.get("atisRectTime");
    		String atisDecompDegree = (String) paramMap.get("atisDecompDegree");
    		String atisDesalinationVolume = (String) paramMap.get("atisDesalinationVolume");
    		String atisPH = (String) paramMap.get("atisPH");
    		String atisSignificant = (String) paramMap.get("atisSignificant");
    		String desc = (String) paramMap.get("atisProcessCondition");
    		
    		java.util.Set<String> keySet = paramMap.keySet();
    		java.util.Iterator<String> keyIter = keySet.iterator();
    		while(keyIter.hasNext()) {
    			String key = keyIter.next();
    			Object obj = paramMap.get(key);
    			if(obj instanceof String) {
    				text.append(key).append(": ").append((String)obj).append("\n");
    			} else {
    				text.append(key).append(": ").append("\n");
    			}
    		}
    		
    		DomainObject domainObject = new DomainObject();
    		String name = domainObject.getAutoGeneratedName(context, "type_ProcessingInstruction", null);
    		domainObject.createObject(context, "Processing Instruction", name, "A", "Processing Information", "eService Production");
    		domainObject.setDescription(context, desc);

    		Map attrMap = new HashMap();
    		attrMap.put("atisProcessCondition", atisProcessCondition);
    		attrMap.put("atisGDC_CODE", atisGDC_CODE);
    		attrMap.put("atisRectTemperature", atisRectTemperature);
    		attrMap.put("atisRectTime", atisRectTime);
    		attrMap.put("atisDecompDegree", atisDecompDegree);
    		attrMap.put("atisDesalinationVolume", atisDesalinationVolume);
    		attrMap.put("atisPH", atisPH);
    		attrMap.put("atisSignificant", atisSignificant);
    		domainObject.setAttributeValues(context, attrMap);
			
    		ContextUtil.commitTransaction(context);
    		returnMap.put("id", domainObject.getInfo(context, "id"));
    	} catch(Exception ex) {
    		ContextUtil.abortTransaction(context);
    		ex.printStackTrace();
    		throw new Exception("Create Process Failed.\nPlease contact to Administrator");
    	}
    	return returnMap;
    }
}
