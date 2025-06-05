import java.util.HashMap;
import java.util.Map;

import com.atis.atisFoodSafetyKoreaService;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.domain.util.XSSUtil;
import com.matrixone.apps.productline.ProductLineCommon;
import com.matrixone.apps.productline.ProductLineConstants;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;


public class atisCommonUtil_mxJPO {

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

    public String getType(Context context, String[] args) throws Exception{
    	//XSSOK
    	HashMap programMap = (HashMap)JPO.unpackArgs(args);
    	HashMap requestMap = (HashMap) programMap.get("requestMap");
    	
    	String strType = (String)requestMap.get("type");
    	if(requestMap.get("altType") != null) {
    		strType = (String)requestMap.get("altType");
    	}
    	StringBuffer sb = new StringBuffer();
    	if(strType!=null && !"".equals(strType) ){
    		strType = PropertyUtil.getSchemaProperty(context, strType);
    		
    		String strTemp = "<a TITLE=";
    		String strEndHrefTitle = ">";
    		String strEndHref = "</a>";
    		sb =  sb.append(strTemp);
    		String strTypeIcon= ProductLineCommon.getTypeIconProperty(context, strType);
    		
    		sb =  sb.append("\"\"")
    				.append(strEndHrefTitle)
    				.append("<img border=\'0\' src=\'../common/images/"+strTypeIcon+"\'/>")
    				.append( strEndHref)
    				.append(" ");
    		if("Formulation Phase".equals(strType)) {
    			//strType = EnoviaResourceBundle.getProperty(context, "emxFramework.Common.atisFormulationPhaseCommand");
    			strType = "\uc81c\uc870\uacf5\uc815";
    		} else if("Processing Instruction".equals(strType)) {
    			strType = "\uacf5\uc815\uc870\uac74";
    		} else if("Consumer Unit Part".equals(strType)) {
    			strType = "\uc81c\ud488";
    		} else if("Handling Unit Part".equals(strType)) {
    			strType = "\uc7a5\ube44";
    		} else {
    			strType = EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", context.getLocale(), "emxFramework.Type."+strType.replaceAll("\\s","_"));
    		}
    		
    		//strType = EnoviaResourceBundle.getProperty(context, "emxFrameworkStringResource", "emxFramework.Common.atisFormulationPhaseCommand", context.getLocale());
    		sb =  sb.append(XSSUtil.encodeForXML(context,strType));
    		
    	}
    	return sb.toString();
    }
}
