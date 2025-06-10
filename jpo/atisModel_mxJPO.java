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


public class atisModel_mxJPO {
    public Map createModel(Context context, String[] args) throws Exception {
    	Map returnMap = new HashMap();
    	String id = null;
    	StringBuffer text = new StringBuffer();
    	try {
    		Map paramMap = JPO.unpackArgs(args);
    		
    		String atisProcessCondition = (String) paramMap.get("V_Name");
    		String atisGDC_CODE = (String) paramMap.get("atisGDC_CODE");
    		String atisRectTemperature = (String) paramMap.get("atisRectTemperature");
    		String atisRectTime = (String) paramMap.get("atisRectTime");
    		String atisDecompDegree = (String) paramMap.get("atisDecompDegree");
    		String atisDesalinationVolume = (String) paramMap.get("atisDesalinationVolume");
    		String atisPH = (String) paramMap.get("atisPH");
    		String atisSignificant = (String) paramMap.get("atisSignificant");
    		String desc = (String) paramMap.get("atisProcessCondition");
    		
    		DomainObject domainObject = new DomainObject();
    		//domainObject.createObject(context, "Model", name, "A", "Processing Information", "eService Production");
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
			
    		returnMap.put("id", domainObject.getInfo(context, "id"));
    	} catch(Exception ex) {
    		ex.printStackTrace();
    		throw new Exception("Create Model Failed.\nPlease contact to Administrator");
    	}
    	return returnMap;
    }
}
