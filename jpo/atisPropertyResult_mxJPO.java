import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import java.util.Vector;
import java.util.stream.Collectors;

import com.atis.atisFoodSafetyKoreaService;
import com.dassault_systemes.enovia.changeaction.interfaces.IChangeAction;
import com.dassault_systemes.enovia.enterprisechangemgt.common.ChangeAction;
import com.dassault_systemes.enovia.formulation.custom.enumeration.FormulationRelationship;
import com.dassault_systemes.enovia.formulation.custom.enumeration.FormulationType;
import com.matrixone.apps.cpn.util.BusinessUtil;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.PersonUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.domain.util.XSSUtil;
import com.matrixone.apps.domain.util.mxType;
import com.matrixone.apps.framework.ui.UIUtil;
import com.matrixone.apps.productline.ProductLineCommon;
import com.matrixone.apps.program.ProgramCentralUtil;
import com.matrixone.apps.program.ProjectSpace;
import com.matrixone.apps.common.Route;
import com.matrixone.apps.awl.util.RouteUtil;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.List;
import matrix.util.StringList;


public class atisPropertyResult_mxJPO {

	public String getProductsName(Context context, String[] args) throws Exception{
    	StringBuffer sbHref  = new StringBuffer();
    	HashMap programMap = (HashMap) JPO.unpackArgs(args);
        Map requestMap     = (Map) programMap.get("requestMap");
        String objectId    = (String) requestMap.get("objectId");
		try {
			DomainObject domainObject = DomainObject.newInstance(context, objectId);
			StringList select = new StringList();
			select.add("to[atisPartToRequest].from.id");
			select.add("to[atisPartToRequest].from.name");
			Map infoMap = domainObject.getInfo(context, select);
			if(infoMap!=null) {
				String partId = (String) infoMap.get("to[atisPartToRequest].from.id");
				String partName = (String) infoMap.get("to[atisPartToRequest].from.name");
				
				if(partId != null && !"".equals(partId)) {
			        sbHref.append("<a href=\"javascript:showDetailsPopup('../common/emxTree.jsp?objectId=");
			        sbHref.append(partId);
			        sbHref.append("&mode=replace");
			        sbHref.append("&AppendParameters=true");
			        sbHref.append("&reloadAfterChange=true");
			        sbHref.append("')\"class=\"object\">");
			        sbHref.append(partName);
			        sbHref.append("</a>");
				}
			}
		} catch(Exception e) {
			//e.printStackTrace();
		}
        return sbHref.toString();
    }
	
	public String getFormulationPartList(Context context, String[] args) throws Exception{
    	StringBuffer sbHref  = new StringBuffer();
    	HashMap programMap = (HashMap) JPO.unpackArgs(args);
        Map requestMap     = (Map) programMap.get("requestMap");
        String objectId    = (String) requestMap.get("objectId");
		try {
			DomainObject domainObject = DomainObject.newInstance(context, objectId);
			StringList select = new StringList();
			select.add("to[atisPartToRequest].from.id");
			select.add("to[atisPartToRequest].from.name");
			Map infoMap = domainObject.getInfo(context, select);
			if(infoMap!=null) {
				String partId = (String) infoMap.get("to[atisPartToRequest].from.id");
				String partName = (String) infoMap.get("to[atisPartToRequest].from.name");
				
				if(partId != null && !"".equals(partId)) {
			        sbHref.append("<a href=\"javascript:showDetailsPopup('../common/emxTree.jsp?objectId=");
			        sbHref.append(partId);
			        sbHref.append("&mode=replace");
			        sbHref.append("&AppendParameters=true");
			        sbHref.append("&reloadAfterChange=true");
			        sbHref.append("')\"class=\"object\">");
			        sbHref.append(partName);
			        sbHref.append("</a>");
				}
			}
		} catch(Exception e) {
			//e.printStackTrace();
		}
        return sbHref.toString();
    }
	
	public String getPropertyData(Context context, String[] args) throws Exception {
		StringBuffer sbHref  = new StringBuffer();
		HashMap programMap = (HashMap) JPO.unpackArgs(args);
        Map requestMap     = (Map) programMap.get("requestMap");
        String objectId    = (String) requestMap.get("objectId");
		try {
			DomainObject domainObject = DomainObject.newInstance(context, objectId);
			
			StringList busSelects = new StringList();
			busSelects.add("attribute[atisPropertyType]");
			busSelects.add("attribute[atisPropertyEvalUnit]");
			busSelects.add("attribute[atisEvalResult]");
			MapList maplist = domainObject.getRelatedObjects(context, "atisRequsetToPropertyData", "atisPropertyData", 
					busSelects, null, false, true, (short) 1, "", "", 0);
			StringList select = new StringList();
			select.add("to[atisPartToRequest].from.id");
			select.add("to[atisPartToRequest].from.name");
			Map infoMap = domainObject.getInfo(context, select);
			if(infoMap!=null) {
				String partId = (String) infoMap.get("to[atisPartToRequest].from.id");
				String partName = (String) infoMap.get("to[atisPartToRequest].from.name");
				
				if(partId != null && !"".equals(partId)) {
			        sbHref.append("<a href=\"javascript:showDetailsPopup('../common/emxTree.jsp?objectId=");
			        sbHref.append(partId);
			        sbHref.append("&mode=replace");
			        sbHref.append("&AppendParameters=true");
			        sbHref.append("&reloadAfterChange=true");
			        sbHref.append("')\"class=\"object\">");
			        sbHref.append(partName);
			        sbHref.append("</a>");
				}
			}
		} catch(Exception e) {
			
		}
		return sbHref.toString();
	}
	
	public String getFormulationPartListFromPropertyRequest(Context context, String[] args) throws Exception{
    	StringBuffer sbHref  = new StringBuffer();
    	HashMap programMap = (HashMap) JPO.unpackArgs(args);
        Map requestMap     = (Map) programMap.get("requestMap");
        String objectId    = (String) requestMap.get("objectId");
		try {
			DomainObject domainObject = DomainObject.newInstance(context, objectId);
			StringList select = new StringList();
			select.add("to[atisPartToRequest].from.to[atisProductsToPart].from.from[Formulation Propagate].to.id");
			Map infoMap = domainObject.getInfo(context, select, select);
			if(infoMap!=null) {
				StringList partIds = (StringList) infoMap.get("to[atisPartToRequest].from.to[atisProductsToPart].from.from[Formulation Propagate].to.id");
				
				if(partIds != null) {
					for(int i=0,size=partIds.size();i<size;i++) {
						sbHref.append("<a href=\"javascript:showDetailsPopup('../common/emxTree.jsp?objectId=");
				        sbHref.append(partIds.get(i));
				        sbHref.append("&mode=replace");
				        sbHref.append("&AppendParameters=true");
				        sbHref.append("&reloadAfterChange=true");
				        sbHref.append("')\"class=\"object\">");
				        sbHref.append("<img border=\"0\" src=\"");
				        sbHref.append("../common/images/iconMenuMaterialsCompliance.gif");
				        sbHref.append("\"</img>");
				        sbHref.append("</a>");
					}
				}
			}
		} catch(Exception e) {
			//e.printStackTrace();
		}
        return sbHref.toString();
    }
	
	public String getDocuments(Context context, String[] args) throws Exception{
    	StringBuffer sbHref  = new StringBuffer();
    	HashMap programMap = (HashMap) JPO.unpackArgs(args);
        Map requestMap     = (Map) programMap.get("requestMap");
        String objectId    = (String) requestMap.get("objectId");
		try {
			DomainObject domainObject = DomainObject.newInstance(context, objectId);
			StringList select = new StringList();
			select.add("from[Reference Document].to.id");
			select.add("from[Reference Document].to.attirbute[Title]");
			Map infoMap = domainObject.getInfo(context, select, select);
			if(infoMap!=null) {
				StringList documentIds = (StringList) infoMap.get("from[Reference Document].to.id");
				StringList documentTitles = (StringList) infoMap.get("from[Reference Document].to.attirbute[Title]");
				if(documentIds != null) {
					for(int i=0,size=documentIds.size();i<size;i++) {
						sbHref.append("<a href=\"javascript:showDetailsPopup('../common/emxTree.jsp?objectId=");
				        sbHref.append(documentIds.get(i));
				        sbHref.append("&mode=replace");
				        sbHref.append("&AppendParameters=true");
				        sbHref.append("&reloadAfterChange=true");
				        sbHref.append("')\"class=\"object\">");
				        sbHref.append("<img border=\"0\" src=\"");
				        sbHref.append("../common/images/iconSmallDocument.gif");
				        sbHref.append("\"</img>");
				        sbHref.append(documentTitles.get(i));
				        sbHref.append("</a>");
					}
				}
			}
		} catch(Exception e) {
			//e.printStackTrace();
		}
        return sbHref.toString();
    }
	
	public String getPropertyDataFromRequest(Context context, String[] args)throws Exception{
		StringBuffer sbHref  = new StringBuffer();
    	HashMap programMap = (HashMap) JPO.unpackArgs(args);
        Map requestMap     = (Map) programMap.get("requestMap");
        String objectId    = (String) requestMap.get("objectId");
        sbHref.append("<table>");
        try {
        	StringList selectSmts = new StringList();
        	selectSmts.add("attribute[atisPropertyEvalUnit]");
        	selectSmts.add("attribute[atisEvalResult]");
        	selectSmts.add("attribute[atisPropertyType]");
        	DomainObject domObj = new DomainObject(objectId);
        	
        	MapList maplist = domObj.getRelatedObjects(context, "atisRequsetToPropertyData", "atisPropertyData", 
        			selectSmts, null, false, true, (short) 1, "", "", 0);
        	maplist.sortStructure("attribute[atisPropertyType]", "ascending", "string");
        	for(int i=0,size=maplist.size();i<size;i++) {		
        		Map map = (Map) maplist.get(i);
        		String type = (String) map.get("attribute[atisPropertyType]");
        		String unit = (String) map.get("attribute[atisPropertyEvalUnit]");
        		unit = unit == null ? "" : unit;
        		String result = (String) map.get("attribute[atisEvalResult]");
        		result = result == null ? "" : result;
        		sbHref.append("<tr><td style='padding: 5px;width: 100px;'>");
        		sbHref.append(type);
        		sbHref.append("<td style='padding: 5px;width: 180px;'>");
        		sbHref.append(unit);
        		sbHref.append("</td><td style='padding: 5px;'>");
        		sbHref.append(result);
        		sbHref.append("</td></tr>");
        	}
        }catch(Exception e) {
        	
        }
        sbHref.append("</table>");
    	return sbHref.toString();
    }
	
	public String getEBOMListFromPropertyRequest(Context context, String[] args)throws Exception{
		StringBuffer sbHref  = new StringBuffer();
    	HashMap programMap = (HashMap) JPO.unpackArgs(args);
        Map requestMap     = (Map) programMap.get("requestMap");
        String objectId    = (String) requestMap.get("objectId");
        sbHref.append("<table>");
        try {
        	StringList selectSmts = new StringList();
        	selectSmts.add("attribute[V_Name]");
        	selectSmts.add("attribute[atisGDC_CODE]");
        	StringList selectRmts = new StringList();
        	selectRmts.add("attribute[Quantity]");
        	DomainObject domObj = new DomainObject(objectId);
        	String meterialId = domObj.getInfo(context, "to[atisPartToRequest].from.id");
        	domObj.setId(meterialId);
        	MapList maplist = domObj.getRelatedObjects(context, "EBOM", "Raw Material", 
        			selectSmts, selectRmts, false, true, (short) 1, "", "", 0);
        	
        	for(int i=0,size=maplist.size();i<size;i++) {		
        		Map map = (Map) maplist.get(i);
        		String title = (String) map.get("attribute[V_Name]");
        		String code = (String) map.get("attribute[atisGDC_CODE]");
        		code = code == null ? "" : ("("+code+")");
        		String qty = (String) map.get("attribute[Quantity]");
        		qty = qty == null ? "" : qty;
        		sbHref.append("<tr><td style='padding: 5px;width: 180px;'>");
        		sbHref.append(title).append(code);
        		sbHref.append("</td><td style='padding: 5px;'>");
        		sbHref.append(qty);
        		sbHref.append("</td></tr>");
        	}
        }catch(Exception e) {
        	
        }
        sbHref.append("</table>");
    	return sbHref.toString();
    }
	
    public MapList getPropertyMaterialList(Context context, String[] args) throws Exception{
    	MapList returnList = null;
    	HashMap programMap = (HashMap) JPO.unpackArgs(args);
        String objectId    = (String) programMap.get("objectId");
        String reportFormat = (String) programMap.get("reportFormat");
        String mode    = (String) programMap.get("mode");
		try {
			StringList typeSelects = new StringList("id");
			String objectWhere = "";
			if("Material".equals(mode)) {
				objectWhere = "to[atisPartToRequest].from.type == 'Raw Material'";
			} else if("Part".equals(mode)) {
				objectWhere = "to[atisPartToRequest].from.type == 'Consumer Unit Part'";
			}
			returnList = DomainObject.findObjects(context, "atisPropertyRequest", "*", "*", "*", "*", 
					objectWhere, null, true, typeSelects, (short) 0);
		} catch(Exception e) {
			//e.printStackTrace();
		}
		return returnList;
    }
}