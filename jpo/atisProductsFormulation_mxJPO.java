import java.util.Map;

import com.atis.atisFoodSafetyKoreaService;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.XSSUtil;

import matrix.db.Context;
import matrix.util.StringList;


public class atisProductsFormulation_mxJPO {

    public String getFormulationName(Context context, String[] args) throws Exception{
    	
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
        sbHref.append("../common/images/iconMenuMaterialsCompliance.gif");
        sbHref.append("\"</img>");
        sbHref.append("</A>");
        sbHref.append("&nbsp");
        sbHref.append("<A HREF=\"javascript:showDetailsPopup('../common/emxTree.jsp?objectId=");
        sbHref.append("40038.25834.7872.10916");
        sbHref.append("&mode=replace");
        sbHref.append("&AppendParameters=true");
        sbHref.append("&reloadAfterChange=true");
        sbHref.append("')\"class=\"object\">");
        sbHref.append("00001040 C");
        sbHref.append("</A>");
        return sbHref.toString();
        
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
}
