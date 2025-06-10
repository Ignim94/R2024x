import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import com.dassault_systemes.enovia.bom.modeler.util.BOMMgtUtil;

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


public class atisFilter_mxJPO {
	@SuppressWarnings("rawtypes")
    @com.matrixone.apps.framework.ui.ProgramCallable
	public Map <String, StringList> getPropertyMasterEvalUnitRangeValues(Context context, String [] args) throws Exception {
    	Map programMap = JPO.unpackArgs(args);
    	
    	Map settingsMap = (Map) ( (Map) programMap.get("columnMap") ).get("settings");
    	
    	String typePattern = "atisPropertyMasterData";
    	String whereClause = "";
    	StringList typeSelects = new StringList();
    	typeSelects.add("attribute[atisPropertyEvalUnit]");
    	MapList returnList = DomainObject.findObjects(context,
    			typePattern,
                com.matrixone.apps.program.ProgramCentralConstants.QUERY_WILDCARD,
                com.matrixone.apps.program.ProgramCentralConstants.QUERY_WILDCARD,
                com.matrixone.apps.program.ProgramCentralConstants.QUERY_WILDCARD,
                com.matrixone.apps.program.ProgramCentralConstants.QUERY_WILDCARD,
                whereClause,
                false,
                typeSelects);
    	
    	java.util.List<String> actualList = ((java.util.List<Map>) returnList).stream().filter(m -> (m.get("attribute[atisPropertyEvalUnit]") != null && !"".equals((String) m.get("attribute[atisPropertyEvalUnit]")))).map(m -> (String) m.get("attribute[atisPropertyEvalUnit]")).distinct().collect(Collectors.toList());
    	
    	actualList.add(0, "");
    	HashMap<String, StringList> hashMap = new HashMap<String, StringList>(2);
		hashMap.put("field_choices", StringList.create(actualList));
		hashMap.put("field_display_choices", StringList.create(actualList));
		return hashMap;
    }
	
	private static final String cMax = "MAX";
    private static final String cMin = "MIN";
    private static final String cOrAbove = "이상";
    private static final String cOrBelow = "이하";
    private static final String cAbove = "초과";
    private static final String cBelow = "미만";
    private static final String cRange = "범위";
	@SuppressWarnings("rawtypes")
    @com.matrixone.apps.framework.ui.ProgramCallable
	public Map <String, StringList> getPropertyDataCompareRangeValues(Context context, String [] args) throws Exception {
    	Map programMap = JPO.unpackArgs(args);
    	
    	java.util.List<String> actualList = new java.util.ArrayList<String>();
    	actualList.add("cMax");
    	actualList.add("cMin");
    	actualList.add("cOrAbove");
    	actualList.add("cOrBelow");
    	actualList.add("cAbove");
    	actualList.add("cBelow");
    	actualList.add("cRange");
    	java.util.List<String> displayList = new java.util.ArrayList<String>();
    	displayList.add(cMax);
    	displayList.add(cMin);
    	displayList.add(cOrAbove);
    	displayList.add(cOrBelow);
    	displayList.add(cAbove);
    	displayList.add(cBelow);
    	displayList.add(cRange);
    	HashMap<String, StringList> hashMap = new HashMap<String, StringList>(2);
		hashMap.put("field_choices", StringList.create(actualList));
		hashMap.put("field_display_choices", StringList.create(displayList));
		return hashMap;
    }
}
