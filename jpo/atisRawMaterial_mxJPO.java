import com.atis.atisFoodSafetyKoreaService;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.*;
import com.matrixone.fcs.common.ImageRequestData;
import matrix.db.BusinessObjectProxy;
import matrix.db.Context;
import matrix.db.FileList;
import matrix.db.JPO;
import matrix.util.SelectList;
import matrix.util.StringList;

import java.util.*;
import java.util.stream.Collectors;

public class atisRawMaterial_mxJPO {

    /***
     *  Descriptions : Get Raw Material List
     * @return MapList
     * @throws FrameworkException
     */
    public MapList getRawMaterialList(Context context, String args[]) throws Exception {
    	MapList returnRawMaterialList = new MapList();
    	MapList rawMaterialList = new MapList();
        MapList rawMaterialList2 = new MapList();
        try {

            String sWhere = "(revision==last)&&(current!=Obsolete)";

            StringList busSelects = new StringList();
            busSelects.add("id");
            busSelects.add("name");
            busSelects.add("current");
            busSelects.add("owner");
            busSelects.add("modified");
            
            // mod by cmg 08/20/2024[S]
            busSelects.add("attribute[V_Name]");
            busSelects.add("attribute[atis_GHSType]");
            busSelects.add("attribute[atisTCSYNclassification]");
            busSelects.add("relationship[Image Holder].id");
            // mod by cmg 08/20/2024[E]
            rawMaterialList = DomainObject.findObjects(context
                    , "Raw Material"                            // typePattern
                    , "RM-4*"                                       // namePattern
                    , "*"                                       // revisionPattern
                    , "*"                                       // ownerPatten
                    , "*"                                       // vaultPatten
                    , sWhere                                    // whereExpValue
                    , false                                     // expendsType
                    , busSelects                                // objectSelect
            );
            //sWhere = sWhere + " && (name ~= 'RM-01*' || name ~= 'RM-021*' || name ~= 'RM-022*' || name ~= 'RM-023*' || name ~= 'RM-024*' || name ~= 'RM-025*')";
            rawMaterialList2 = DomainObject.findObjects(context // eMatrix context
                    , "Raw Material"                            // typePattern
                    , "RM-0*"                                   // namePattern
                    , "*"                                       // revisionPattern
                    , "*"                                       // ownerPatten
                    , "*"                                       // vaultPatten
                    , sWhere                                    // whereExpValue
                    , null                                      // queryName
                    , false                                     // expendsType
                    , busSelects                                // objectSelect
                    , (short) 7245                              // object Limit
            ); // 8/30/24: 신규생성 원료 안보이는 현상 있음
            
            //rawMaterialList.addSortKey("type", "ascending", "String");
            //rawMaterialList2.sort("modified", "descending", "date");
            
            rawMaterialList.sortStructure("name", "descending", "String");
            rawMaterialList2.addSortKey("attribute[V_Name]", "descending", "String");
            rawMaterialList2.addSortKey("attribute[atis_GHSType]", "descending", "String");
            rawMaterialList2.addSortKey("relationship[Image Holder].id", "descending", "String");
            rawMaterialList2.addSortKey("attribute[atisTCSYNclassification]", "descending", "String");
            rawMaterialList2.sort();
            returnRawMaterialList.addAll(rawMaterialList);
            returnRawMaterialList.addAll(rawMaterialList2);
           
        } catch (Exception e) {
            throw e;
        }
        return returnRawMaterialList;
    }

    public MapList getMaterialToSpec(Context context, String args[]) {
        MapList resultList = new MapList();
        try {
            Map programMap = (Map) JPO.unpackArgs(args);
            Map requestMap = (Map) programMap.get("requestMap");
            /* Parameter */
            String objectId = (String) programMap.get("objectId");
            DomainObject domRoot = DomainObject.newInstance(context, objectId);
            /* WHERE */
            String objWhere = "";
            String relWhere = "";
            /* WHERE */
            //BusinessObject Select
            SelectList sList = new SelectList();
            sList.addId();
            sList.addName();
            sList.addType();
            sList.addRevision();
            sList.addCurrentState();
            sList.add("originated");
            sList.add("attribute[lpsDivision]");
            sList.add("from[Reference Document].to.id");
            //Relationship Select
            SelectList rList = new SelectList();
            rList.add(DomainRelationship.SELECT_LEVEL);
            rList.add("id[connection]");
            rList.add("attribute[Quantity]");
            rList.add("attribute[Sequence Order]");

            /* MapList*/
            MapList rootChildList = domRoot.getRelatedObjects(context,
                    "ParameterAggregation", // relationship pattern
                    "PlmParameter",
                    sList,
                    rList,
                    false,
                    true,
                    (short) 0,
                    objWhere,
                    relWhere,
                    0);
            rootChildList.sortStructure("attribute[Sequence Order]", "ascending", "integer");
            for (int i = 0; i < rootChildList.size(); i++) {
                Map rootMap = (Map) rootChildList.get(i);
                String objId = (String) rootMap.get("id");
                String relId = (String) rootMap.get("id[connection]");

                resultList.add(rootMap);
            }
        } catch (Exception e) {
            throw e;
        } finally {
            return resultList;
        }
    }

    public Vector getImage(Context context, String[] args) throws Exception {
        Vector vector = new Vector();
        StringList sList = new StringList();
        HashMap programMap = (HashMap) JPO.unpackArgs(args);
        Map paramList = (Map) programMap.get("paramList");
        Map fieldMap = (Map) programMap.get("columnMap");
        String columnName = (String) fieldMap.get("name");
        MapList objectList = (MapList) programMap.get("objectList");
        Iterator objectListItr = objectList.iterator();
        try {
            int seqNo = 1;
            while (objectListItr.hasNext()) {
                StringBuffer stringBuffer = new StringBuffer();
                Map objectMap = (Map) objectListItr.next();
                String strValue = "";
                try {
                    String objId = (String) objectMap.get("id");
                    String strDocId = (String) objectMap.get("from[Reference Document].to.id");

                    if (atisFoodSafetyKoreaService.isNotEmpty(strDocId)) {
                        DomainObject domImage = new DomainObject(strDocId);
                        FileList fileName = domImage.getFiles(context);
                        String workspace = context.createWorkspace();
                        ArrayList arraylist = new ArrayList();
                        BusinessObjectProxy businessobjectproxy = new BusinessObjectProxy(strDocId, "generic", String.valueOf(fileName.get(0)), false, false);
                        arraylist.add(businessobjectproxy);
                        String[] strImageURLs = new String[1];
                        strImageURLs = ImageRequestData.getImageURLS(context, "", arraylist);
                        String imageURL = strImageURLs[0];
                        imageURL = imageURL.replace("fcs/servlet", "internal/servlet");
                        String strImage = "<img border='0'  width='150px' height='auto'  max-height='100px' object-fit='cover' background-size='cover'  src='" + XSSUtil.encodeForHTMLAttribute(context, imageURL) + "'/>";
                        vector.add(strImage);
                    } else {
                        vector.add("");
                    }
                } catch (Exception e) {
                    vector.add("Error Value");
                }
            }
        } catch (Exception e) {
            throw  e;
        }
        return vector;
    }

    /***
     *  Descriptions : Get Discarded Raw Material List
     * @return MapList
     * @throws FrameworkException
     */
    public MapList getDiscardedRawMaterialList(Context context, String args[]) throws Exception {
        MapList rawMaterialList = new MapList();
        try {

            String sWhere = "current==Obsolete";

            StringList busSelects = new StringList();
            busSelects.add("id");
            busSelects.add("name");
            busSelects.add("current");
            busSelects.add("owner");
            busSelects.add("originated");
            busSelects.add("attribute[Material Number]");
            busSelects.add("attribute[lpsRawReleasePhase]");

            rawMaterialList = DomainObject.findObjects(context
                    , "Raw Material"                            // typePattern
                    , "*"                                       // namePattern
                    , "*"                                       // revisionPattern
                    , "*"                                       // ownerPatten
                    , "*"                                       // vaultPatten
                    , sWhere                                    // whereExpValue
                    , false                                     // expendsType
                    , busSelects                                // objectSelect
            );

        } catch (Exception e) {
            throw e;
        }

        return rawMaterialList;
    }
    
    public MapList getGHS(Context context, String[] args) throws Exception{
    	MapList getGHSList = new MapList();
    	StringBuffer sb = new StringBuffer();
        try {
        	HashMap paramMap = JPO.unpackArgs(args);
        	HashMap requestMap = (HashMap) paramMap.get("requestMap");
        	String parentOID = (String) paramMap.get("parentOID");
        	if(parentOID == null || "".equals(parentOID)) {
        		parentOID = (String) requestMap.get("objectId");
        	}
        	MqlUtil.mqlCommand(context, "notice $1", "parentOID: " + parentOID);
        	DomainObject domainObject = DomainObject.newInstance(context, parentOID);
        	String getGHS = domainObject.getInfo(context, "attribute[atis_GHSType]");
        	MqlUtil.mqlCommand(context, "notice $1", "getGHS: " + getGHS);
        	if(getGHS != null && !"".equals(getGHS)) {
        		String sWhere = "name matchlist '" + getGHS + "' '|'";

                StringList busSelects = new StringList();
                busSelects.add("id");
                busSelects.add("name");

                getGHSList = DomainObject.findObjects(context
                        , "Substance Classification"                // typePattern
                        , "*"                                       // namePattern
                        , "*"                                       // revisionPattern
                        , "*"                                       // ownerPatten
                        , "*"                                       // vaultPatten
                        , sWhere                                    // whereExpValue
                        , false                                     // expendsType
                        , busSelects                                // objectSelect
                );
                getGHSList.sort("name", "descending", "string");
        	}
        } catch (Exception e) {
        	e.printStackTrace();
        	throw new FrameworkException(sb.toString());
        }
        return getGHSList;
    }

    public MapList getTCS(Context context, String[] args) throws Exception{
    	MapList getTCSList = new MapList();
        try {
        	HashMap paramMap = JPO.unpackArgs(args);
        	HashMap requestMap = (HashMap) paramMap.get("requestMap");
        	String parentOID = (String) paramMap.get("parentOID");
        	if(parentOID == null || "".equals(parentOID)) {
        		parentOID = (String) requestMap.get("objectId");
        	}
        	MqlUtil.mqlCommand(context, "notice $1", "parentOID: " + parentOID);
        	DomainObject domainObject = DomainObject.newInstance(context, parentOID);
        	String getTCS = domainObject.getInfo(context, "attribute[atisTCSYNclassification]");
        	if(getTCS != null && !"".equals(getTCS)) {
        		String sWhere = "name matchlist '" + getTCS + "' '|'";

                StringList busSelects = new StringList();
                busSelects.add("id");
                busSelects.add("name");

                getTCSList = DomainObject.findObjects(context
                        , "Substance Classification"                // typePattern
                        , "*"                                       // namePattern
                        , "*"                                       // revisionPattern
                        , "*"                                       // ownerPatten
                        , "*"                                       // vaultPatten
                        , sWhere                                    // whereExpValue
                        , false                                     // expendsType
                        , busSelects                                // objectSelect
                );
                getTCSList.sort("name", "descending", "string");
        	}
        } catch (Exception e) {
            throw e;
        }
        return getTCSList;
    }
    
    public MapList getFormulations(Context context, String[] args) throws Exception{
    	MapList consumerUnitPartList = new MapList();
        try {
        	HashMap paramMap = JPO.unpackArgs(args);
        	HashMap requestMap = (HashMap) paramMap.get("requestMap");
        	String objectId = (String) requestMap.get("objectId");
      System.out.println("objectId:"+objectId);  	
        	DomainObject domainObject = DomainObject.newInstance(context, objectId);
        	
            String sWhere = "";
            StringList busSelects = new StringList();
            busSelects.add("to[Planned For].from.to[Formulation Propagate].from.id");
            busSelects.add("type");

            consumerUnitPartList = domainObject.getRelatedObjects(context,
                    "FBOM,EBOM", // relationship pattern
                    "*",
                    busSelects,
                    null,
                    true,
                    false,
                    (short) 0,
                    "",
                    "",
                    0);
            
            if("true".equalsIgnoreCase(domainObject.getInfo(context, "islast"))) {
            	String prevId = domainObject.getInfo(context, "previous.id");
            	int cnt = 0;
            	while(cnt < 10 && prevId != null && !"".equals(prevId)) {
            		domainObject.setId(prevId);
                	consumerUnitPartList.addAll(domainObject.getRelatedObjects(context,
                            "FBOM,EBOM", // relationship pattern
                            "*",
                            busSelects,
                            null,
                            true,
                            false,
                            (short) 0,
                            "",
                            "",
                            0));
                	prevId = domainObject.getInfo(context, "previous.id");
                	cnt++;
            	}
            	
            }
            java.util.List<String> list = ((java.util.List<Map>) consumerUnitPartList).stream().map(m -> {
            	String type = (String) m.get("type");
            	String id = "";
            	if("Formulation Process".equals(type)) {
            		id = (String) m.get("to[Planned For].from.to[Formulation Propagate].from.id");
            	}
            	return id;
            }).filter(s -> s != null && !"".equals(s)).distinct().collect(Collectors.toList());
            
            consumerUnitPartList.clear();
            for(int i=0,size=list.size();i<size;i++) {
            	Map map = new HashMap();
            	map.put("level", "1");
            	map.put("id", list.get((i)));
            }
        } catch (Exception e) {
            //throw e;
        	consumerUnitPartList = new MapList();
        }
        return consumerUnitPartList;
    }
}


