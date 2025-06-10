import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;

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


public class atisConsumerUnitPart_mxJPO {

    public MapList getConsumerUnitPart(Context context, String[] args) throws Exception{
    	MapList consumerUnitPartList = new MapList();
        try {

            String sWhere = "(revision==last)&&(current!=Obsolete)";

            StringList busSelects = new StringList();
            busSelects.add("id");
            busSelects.add("name");
            busSelects.add("current");
            busSelects.add("owner");
            busSelects.add("modified");
            busSelects.add("attribute[atisTCSYNclassification]");
            busSelects.add("to[atisProductsToPart].from.id");
            busSelects.add("to[atisProductsToPart].from.name");

            consumerUnitPartList = DomainObject.findObjects(context
                    , "Consumer Unit Part"                      // typePattern
                    , "*"                                       // namePattern
                    , "*"                                       // revisionPattern
                    , "*"                                       // ownerPatten
                    , "*"                                       // vaultPatten
                    , sWhere                                    // whereExpValue
                    , false                                     // expendsType
                    , busSelects                                // objectSelect
            );
            consumerUnitPartList.sort("modified", "descending", "date");

        } catch (Exception e) {
            throw e;
        }
        return consumerUnitPartList;
    }

    public String getCunitName(Context context, String[] args) throws Exception{
    	
        String ret = "omg";
        System.out.println("no such methods");
        
        
        StringBuffer sbHref  = new StringBuffer();
        StringBuffer sbBuffer  = new StringBuffer();
        
        sbHref.append("<A HREF=\"JavaScript:showDetailsPopup('../common/emxTree.jsp?objectId=");
        sbHref.append("40038.25834.7872.10916");
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
        sbHref.append("40038.25834.56749.55854");
        sbHref.append("&mode=replace");
        sbHref.append("&AppendParameters=true");
        sbHref.append("&reloadAfterChange=true");
        sbHref.append("')\"class=\"object\">");
        sbHref.append("CUNIT-00001");
        sbHref.append("</A>");
        return sbHref.toString();
        
    }
    
    public void deleteRawMaterial(Context context, String[] args) throws Exception {
    	try
    	{
    	  
    		MapList ml = new MapList();
    		String mOid ="";
    		StringList busSelects = new StringList();
    		busSelects.add(DomainConstants.SELECT_ID);
    		busSelects.add(DomainConstants.SELECT_NAME);
    		
    		ml = DomainObject.findObjects(context, "Raw Material", "*", "",busSelects);
    		
    		System.out.println("ml find finish. size : "+ml.size());
    		int i = 0;
    		for(Object o : ml) {
    			Map mO = (Map) o;
				mOid = (String) mO.get("id");
				DomainObject dom = new DomainObject(mOid);
				dom.deleteObject(context);
				i++;
				System.out.println("delete :"+ i + ", remain size : "+ml.size());
    			
    		}
    	}catch(Exception e){
    		e.printStackTrace();
    	}
    }
    
    public Map createConsumerUnitPart(Context context, String[] args) throws Exception {
    	Map returnMap = new HashMap();
    	String id = null;
    	StringBuffer text = new StringBuffer();
    	try {
    		ContextUtil.startTransaction(context, true);
    		
    		Map paramMap = JPO.unpackArgs(args);
    		
    		String vName = (String) paramMap.get("V_Name");
    		String atisGDC_CODE = (String) paramMap.get("atisGDC_CODE");
    		//
    		String atisProductLine = (String) paramMap.get("atisProductLine");
    		String atisProductLineDisplay = (String) paramMap.get("atisProductLineDisplay");
    		String atisProductLineOID = (String) paramMap.get("atisProductLineOID");
    		//
    		String atisTCSYN = (String) paramMap.get("atisTCSYN");
    		//
    		String atisTCSYNclassification = (String) paramMap.get("atisTCSYNclassification");
    		String atisTCSYNclassificationDisplay = (String) paramMap.get("atisTCSYNclassificationDisplay");
    		String atisTCSYNclassificationOID = (String) paramMap.get("atisTCSYNclassificationOID");
    		//
    		String atis_equivalent = (String) paramMap.get("atis_equivalent");
    		String atis_viscosity_cps25 = (String) paramMap.get("atis_viscosity_cps25");
    		String atis_Gardner = (String) paramMap.get("atis_Gardner");
    		String atis_weight = (String) paramMap.get("atis_weight");
    		String atis_chlorine = (String) paramMap.get("atis_chlorine");
    		String atis_yield = (String) paramMap.get("atis_yield");
    		String atis_viscosity_cps75 = (String) paramMap.get("atis_viscosity_cps75");
    		String atis_viscosity_cps100 = (String) paramMap.get("atis_viscosity_cps100");
    		String atis_HyCl = (String) paramMap.get("atis_HyCl");
    		String atis_GPC = (String) paramMap.get("atis_GPC");
    		String atis_residual_solvent_content = (String) paramMap.get("atis_residual_solvent_content");
    		String atis_residual_ECH_content = (String) paramMap.get("atis_residual_ECH_content");
    		String atis_remark = (String) paramMap.get("atis_remark");
    		
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
    		String name = domainObject.getAutoGeneratedName(context, "type_ConsumerUnitPart", "A");
    		domainObject.createObject(context, "Consumer Unit Part", name, "A", "EC Part", "eService Production");
    		domainObject.setDescription(context, "");

    		Map attrMap = new HashMap();
    		attrMap.put("V_Name", vName);
    		attrMap.put("atisGDC_CODE", atisGDC_CODE);
    		attrMap.put("atisTCSYNclassification", atisTCSYNclassificationDisplay);
    		attrMap.put("atis_equivalent", atis_equivalent);
    		attrMap.put("atis_viscosity_cps25", atis_viscosity_cps25);
    		attrMap.put("atis_Gardner", atis_Gardner);
    		attrMap.put("atis_weight", atis_weight);
    		attrMap.put("atis_chlorine", atis_chlorine);
    		attrMap.put("atis_yield", atis_yield);
    		attrMap.put("atis_viscosity_cps75", atis_viscosity_cps75);
    		attrMap.put("atis_viscosity_cps100", atis_viscosity_cps100);
    		attrMap.put("atis_HyCl", atis_HyCl);
    		attrMap.put("atis_GPC", atis_GPC);
    		attrMap.put("atis_residual_solvent_content", atis_residual_solvent_content);
    		attrMap.put("atis_residual_ECH_content", atis_residual_ECH_content);
    		attrMap.put("atis_remark", atis_remark);
    		attrMap.put("Unit of Measure", "Drum");
    		domainObject.setAttributeValues(context, attrMap);
    		
    		if(atisProductLineOID != null) {
    			DomainObject fromObject = new DomainObject();
    			fromObject.setId(atisProductLineOID);
    			DomainRelationship.connect(context, fromObject, "atisProductLineToPart", domainObject);
    			
    			
    			
    		}
			
    		ContextUtil.commitTransaction(context);
    		returnMap.put("id", domainObject.getInfo(context, "id"));
    	} catch(Exception ex) {
    		ContextUtil.abortTransaction(context);
    		ex.printStackTrace();
    		throw ex;
    		//throw new Exception("Create Process Failed.\nPlease contact to Administrator");
    	}
    	return returnMap;
    }
    
    public StringList getTCS(Context context, String[] args) throws Exception {
    	StringList tcsList = new StringList();
    	HashMap programMap 		= (HashMap)JPO.unpackArgs(args);
    	MapList objectList      = (MapList)programMap.get("objectList");		
    	HashMap paramList 	    = (HashMap)programMap.get("paramList");      
    	String reportFormat     = (String)paramList.get("reportFormat");
    	String isIndentedView   = (String)paramList.get("isIndentedView");        
    	try {
    		java.util.List<String> list = ((java.util.List<Map>) objectList).stream().map(info -> (String) info.get("attribute[atisTCSYNclassification]")).collect(Collectors.toList());
    		for(String tcs : list) {    		
    			if(tcs != null && !"".equals(tcs)) {
    				StringList stringlist = FrameworkUtil.split(tcs, ",");
//        			for(int i=0; i<stringlist.size(); i++) {
//        				stringlist.set(i, EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", "emxFramework.Label." + list.get(i), context.getLocale()));
//        				//stringlist.set(i, EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", "emxFramework.Label." + list.get(i), context.getLocale()));
//
//        			}
//        			tcsList.add(stringlist.join(","));
        			tcsList.add(tcs);
    			} else {
    				tcsList.add("");
    			}
    		}
    	} catch(Exception e) {
    		
    	}
		return tcsList;
    }
    
    public String getProductsName(Context context, String[] args) throws Exception{
    	StringBuffer sbHref  = new StringBuffer();
    	HashMap programMap = (HashMap) JPO.unpackArgs(args);
        Map requestMap     = (Map) programMap.get("requestMap");
        String objectId    = (String) requestMap.get("objectId");
        String reportFormat = (String) requestMap.get("reportFormat");
		try {
			DomainObject domainObject = DomainObject.newInstance(context, objectId);
			StringList select = new StringList();
			select.add("to[atisProductsToPart].from.id");
			select.add("to[atisProductsToPart].from.name");
			Map infoMap = domainObject.getInfo(context, select);
			if(infoMap!=null) {
				String partId = (String) infoMap.get("to[atisProductsToPart].from.id");
				String partName = (String) infoMap.get("to[atisProductsToPart].from.name");
				
				if(partId != null && !"".equals(partId)) {
//					sbHref.append("<A HREF=\"JavaScript:showDetailsPopup('../common/emxTree.jsp?objectId=");
//			        sbHref.append(partId);
//			        sbHref.append("&mode=replace");
//			        sbHref.append("&AppendParameters=true");
//			        sbHref.append("&reloadAfterChange=true");
//			        sbHref.append("')\"class=\"object\">");
//			        sbHref.append("<img border=\"0\" src=\"");
//			        sbHref.append("../common/images/iconSmallCPGProduct.gif");
//			        sbHref.append("\"</img>");
//			        sbHref.append("</A>");
//			        sbHref.append("&nbsp");
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
    
    public StringList getProductsNameForTable(Context context, String[] args) throws Exception {
    	StringList getProductList = new StringList();
    	HashMap programMap 		= (HashMap)JPO.unpackArgs(args);
    	MapList objectList      = (MapList)programMap.get("objectList");		
    	HashMap paramList 	    = (HashMap)programMap.get("paramList");      
    	String reportFormat     = (String)paramList.get("reportFormat");
    	String isIndentedView   = (String)paramList.get("isIndentedView");     
    	try {
    		java.util.List<String> list = ((java.util.List<Map>) objectList).stream().map(info -> (String) info.get("to[atisProductsToPart].from.name")).collect(Collectors.toList());
    		getProductList.addAll(list);
    	} catch(Exception e) {
    		
    	}
    	return getProductList;
    }
    
    public MapList getFormulations(Context context, String[] args) throws Exception{
    	MapList consumerUnitPartList = new MapList();
        try {
        	HashMap paramMap = JPO.unpackArgs(args);
        	HashMap requestMap = (HashMap) paramMap.get("requestMap");
        	String parentOID = (String) paramMap.get("parentOID");
        	if(parentOID == null || "".equals(parentOID)) {
        		parentOID = (String) requestMap.get("objectId");
        	}
        	
        	DomainObject domainObject = DomainObject.newInstance(context, parentOID);
        	
        	if("atisCUPProposal".equals(domainObject.getInfo(context, "type"))) {
        		parentOID = domainObject.getInfo(context, "to[atisCUPToCUPProposal].from.id");
        		domainObject.setId(parentOID);
        	}
        	
            String sWhere = "";

            StringList busSelects = new StringList();
            busSelects.add("id");
            busSelects.add("name");

            consumerUnitPartList = domainObject.getRelatedObjects(context,
                    "atisProductsToPart", // relationship pattern
                    "*",
                    busSelects,
                    null,
                    true,
                    false,
                    (short) 1,
                    "",
                    "",
                    0);

        } catch (Exception e) {
            //throw e;
        	consumerUnitPartList = new MapList();
        }
        return consumerUnitPartList;
    }
    
    public StringList moveToERN(Context context, String[] args) throws Exception 
    {
    	HashMap programMap = JPO.unpackArgs(args);
    	StringList returnList = new StringList();
    	MapList ml = (MapList) programMap.get("objectList");
    	String href = "test";
    	for(int i = 0; i<ml.size(); i++) {
    		Map m = (Map) ml.get(i);
    		String oId = (String) m.get("id");
    		DomainObject dom = new DomainObject(oId);
    		String getType = dom.getTypeName(context);
    		String getTitle = dom.getAttributeValue(context, "Title");
    		if("Document".equals(getType)) {
    			String url = dom.getAttributeValue(context, "Link URL");
    			if(StringUtils.isNotEmpty(url)) {
    				String appendStr = "";
    				StringBuilder sLink = new StringBuilder();	
    				if(url.contains("https")||url.contains("http")) {
    					sLink.append("<a href=\"Javascript:openDynamicURLWindow(\'");
    				}else {
    					sLink.append("<a href=\"Javascript:openDynamicURLWindow(\'http://");
    				}
    				
    				sLink.append(url);
    				sLink.append("')\" target=\"_blank\">");
    				//sLink.append("')\">");
    				
    				//sLink.append("\" target=\"_blank\">");
    				sLink.append(XSSUtil.encodeForHTML(context, getTitle));
    				sLink.append("</a>");
    				//sLink.append("");
    				appendStr = sLink.toString(); 
    				returnList.add(appendStr);
    			}else {
    				returnList.add(getTitle);
    			}
    		}else {
    			returnList.add(getTitle);
    		}
    		System.out.println(dom.getTypeName(context));
    	}
    	
    	return returnList;
    }	
    
}
