import java.util.Map;
import java.util.HashMap;

import com.atis.atisFoodSafetyKoreaService;
import com.dassault_systemes.enovia.formulation.custom.enumeration.FormulationType;
import com.matrixone.apps.cpn.util.BusinessUtil;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.XSSUtil;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;


public class atisProcessingInstruction_mxJPO {

    public MapList getProcessingInstruction(Context context, String[] args) throws Exception{
    	MapList processingInstructionList = new MapList();
        try {

            String sWhere = "";
            sWhere = "(revision==last)";

            StringList busSelects = new StringList();
            busSelects.add("id");
            busSelects.add("name");
            busSelects.add("current");
            busSelects.add("owner");
            busSelects.add("modified");

            processingInstructionList = DomainObject.findObjects(context
                    , "Processing Instruction"                  // typePattern
                    , "*"                                       // namePattern
                    , "*"                                       // revisionPattern
                    , "*"                                       // ownerPatten
                    , "*"                                       // vaultPatten
                    , sWhere                                    // whereExpValue
                    , false                                     // expendsType
                    , busSelects                                // objectSelect
            );
            processingInstructionList.sort("modified", "descending", "date");

        } catch (Exception e) {
            throw e;
        }
        return processingInstructionList;
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
    
    public Map createProcessingInstruction(Context context, String[] args) throws Exception {
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
    		attrMap.put("atisIsMastr", "TRUE");
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
    
    @com.matrixone.apps.framework.ui.IncludeOIDProgramCallable
	public StringList includeMasterProcessingInstruction(Context context, String args[]) {
		StringList slProcessingInstruction = new StringList();
		StringList resultSelects 		= StringList.create("id");
		StringBuilder sbWhere 			= new StringBuilder(32);
		
		sbWhere.append("attribute[atisIsMaster] == 'TRUE'");
		
		try {
			MapList mlProcessingInstruction = DomainObject.findObjects(
								        context,
								        FormulationType.PROCESSING_INSTRUCTION.getType(context),		
								        "*",	// Name
								        "*", // Revision
								        "*", //owner
								        null, //vault
								        sbWhere.toString(),
								        true,
								        resultSelects);
			
			slProcessingInstruction	= BusinessUtil.getIdList(mlProcessingInstruction);
		} catch (FrameworkException e) {
			e.printStackTrace();
		}
		
		return slProcessingInstruction;
	}
}
