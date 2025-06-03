import matrix.db.Context;
import matrix.db.JPO;
import matrix.db.MatrixWriter;
import matrix.util.StringList;

import java.io.BufferedWriter;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.matrixone.apps.common.CommonDocument;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.jsystem.util.ExceptionUtils;

public class cmgSearch_mxJPO {
	public String getProjectSubtaskCount (Context context, String []args) throws Exception {
		String returnValue="";
		
		try {
			String sOid = args[0];
			
			String prjAccessListId = new DomainObject(sOid).getInfo(context, "to[Project Access List].from.id");
			MapList taskMap = new DomainObject(prjAccessListId).getRelatedObjects(context, "Project Access Key", "*",
					null, null,
					false, true, (short) 1, "", "", 0);
			returnValue = String.valueOf(taskMap.size());
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return returnValue;
	}
	
	// do
	public String getProjectCurrentPhase (Context context, String []args) throws Exception {
		String returnValue="";
		
		try {
			String sOid = args[0];
			String[] arrJPOArguments = new String[3];
            HashMap programMap = new HashMap();
            programMap.put("objectId", sOid);
            programMap.put("ExpandLevel", "0");
            programMap.put("ScheduleEffortView", "true");
            
            MapList mapList = new MapList();
            arrJPOArguments = JPO.packArgs(programMap);
            mapList = (MapList)JPO.invoke(context,
                    "emxEffortManagementBase", null, "getProjectTaskList",
                    arrJPOArguments, MapList.class);
            //System.out.println("Map");
            
            StringList selectList= new StringList();
            selectList.add("attribute[Task Actual Start Date]");
            selectList.add("attribute[Task Actual Finish Date]");
            String startDate  ="";
            String finishDate ="";
            SimpleDateFormat dateFormat = new SimpleDateFormat("M/d/yyyy h:mm:ss a");
            String currentDateStr = dateFormat.format(new Date());
            Date currentDate = dateFormat.parse(currentDateStr);
            for(Object o : mapList) {
				Map m = (Map) o;
				String id = (String) m.get("id");
				DomainObject dom = new DomainObject(id);
				String type = dom.getType(context);
				String name = dom.getName(context);
				if("Phase".equals(type)) {
					Map map = dom.getInfo(context, selectList);
					startDate  = (String)map.get("attribute[Task Actual Start Date]");
					finishDate = (String)map.get("attribute[Task Actual Finish Date]");
					if(StringUtils.isNotEmpty(startDate)) {
						 Date sDate = dateFormat.parse(startDate);
						 if (sDate.before(currentDate)) {
				               // System.out.println("before true.");
				                returnValue = name;
						 }
					}else {
						//System.out.println("no start date");
					}
					// Date sDate = dateFormat.parse(startDate);
					
					//System.out.println("name: "+name+", sd :"+startDate+", fd :"+finishDate);
				}
			}
            //System.out.println("current phase:"+returnValue);
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return returnValue;
	}
	
	///Assigned Tasks
	public String getTaskAssignee (Context context, String []args) throws Exception {
		String returnValue="";
		
		try {
			String sOid = args[0];
			StringList busSelects = new StringList();
			busSelects.add(DomainConstants.SELECT_ID);
			busSelects.add(DomainConstants.SELECT_NAME);
			MapList assigneeMap = new DomainObject(sOid).getRelatedObjects(context, "Assigned Tasks", "*",
					busSelects, null,
					true, false, (short) 1, "", "", 0);
			String str = "";
			for(Object o : assigneeMap) {
				Map m = (Map) o;
				String name = (String) m.get("name");
				//String connectionId = (String) m.get("id[connection]");
				str += name;
				//System.out.println("name:"+name);
				str += ", ";
				//DomainRelationship.disconnect(context, connectionId);
			}
			if(assigneeMap.size()>0) {
				str = str.substring(0, str.length()-2);
				//System.out.println("task assignee:"+str);
			}
			returnValue =str;
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return returnValue;
	}
	/// Person
	
	public String getPersonFullName (Context context, String []args) throws Exception {
		String returnValue="";
		
		try {
			String sOid = args[0];
			
			StringList infoList = new StringList();
			infoList.add("attribute[First Name]");
			infoList.add("attribute[Last Name]");
			System.out.println(sOid);
			Map nameMap = new DomainObject(sOid).getInfo(context, infoList);
			String fName = (String) nameMap.get("attribute[First Name]");
			String lName = (String) nameMap.get("attribute[Last Name]");
			
			returnValue = fName+lName;
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return returnValue;
	}
	
	public String getPersonWorkingTask (Context context, String []args) throws Exception {
		String returnValue="";
		
		try {
			String sOid = args[0];

			
			MapList taskMap = new DomainObject(sOid).getRelatedObjects(context, "Assigned Tasks", "*",
					null, null,
					false, true, (short) 1, "", "", 0);
			
			returnValue = String.valueOf(taskMap.size());
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return returnValue;
	}
	
	//do
	public String getPersonLicense (Context context, String []args) throws Exception {
		String returnValue="";
		
		try {
			String sOid = args[0];
			String sName = args[1];
			System.out.println("parameter sName:"+sName);
			String product = MqlUtil.mqlCommand(context,
	  				"print person $1 select $2 dump",
	  				sName,
					"product");
			
			//MapList taskMap = new DomainObject(sOid).getInfo(context,DomainConstants.product			
			//returnValue = String.valueOf(taskMap.size());
			returnValue = product;
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return returnValue;
	}
	
	// Document
	public String getDocumentIsRock (Context context, String []args) throws Exception {
		String returnValue="";
		
		try {
			String sOid = args[0];

			returnValue = new DomainObject(sOid).getInfo(context,CommonDocument.SELECT_LOCKED);
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return returnValue;
	}
	
	public String getDocumentFileName (Context context, String []args) throws Exception {
		String returnValue="";
		
		try {
			String sOid = args[0];
			
			StringList busSelects = new StringList();
			busSelects.add(DomainConstants.SELECT_ID);
			busSelects.add(DomainConstants.SELECT_ORIGINATED);
			busSelects.add(DomainConstants.SELECT_ATTRIBUTE_TITLE);
			MapList fileMap = new DomainObject(sOid).getRelatedObjects(context, "Active Version", "*",
					busSelects, null,
					false, true, (short) 1, "", "", 0);
			SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/YYYY HH:mm:ss"); 
			Date returnDate = null;
			for(Object o : fileMap) {
        		Map m = (Map) o;
        		String originatedDate = (String)m.get("originated");
        		Date date1 = formatter.parse(originatedDate);
        		if(returnDate==null || returnDate.after(date1)) {
        			returnDate = date1;
        			String title = (String)m.get("attribute[Title]");
        			returnValue = title;
        		}
        		
        		//System.out.println("returnDate:"+returnDate);
        		//System.out.println("date1:"+date1);
			}
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return returnValue;
	}
	
	public String getDocumentFileCount (Context context, String []args) throws Exception {
		String returnValue="";
		
		try {
			String sOid = args[0];

			
			MapList fileMap = new DomainObject(sOid).getRelatedObjects(context, "Active Version", "Document",
					null, null,
					false, true, (short) 1, "", "", 0);
			
			returnValue = String.valueOf(fileMap.size());
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return returnValue;
	}
	
	public String getDocumentWhereUsed (Context context, String []args) throws Exception {
		String returnValue="";
		
		try {
			String sOid = args[0];

			
			MapList rdMap = new DomainObject(sOid).getRelatedObjects(context, "Reference Document", "*",
					null, null,
					true, false, (short) 1, "", "", 0);
			
			returnValue = String.valueOf(rdMap.size());
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return returnValue;
	}
	
	
	
	
	
	public int triggerCheckVNameDuplication(Context context, String[] args) throws Exception
    {
        String type      = args[0];
        String objectId  = args[1];
        String logicalId = args[2];
        String attName   = args[3];
        String oldValue  = args[4];
        String newValue  = args[5];

        System.err.println("triggerCheckVNameDuplication (type="+type+")(id="+objectId+")(value="+newValue+")");
        
        if (!"PLMEntity.V_Name".equals(attName))
            return 0;

        boolean pushContext = false;
        try
        {
            ContextUtil.pushContext(context);
            pushContext = true;

            System.out.println("---------triggerCheckVNameDuplication--------> " + context.getSession().getSessionId());

            /// mod by choimingi 250410 [B]
            String checkFlag = "";
            if("VPMReference".equals(type)) {
            	DomainObject vpmObj = new DomainObject(objectId);
            	
                StringList selectList= new StringList();
                selectList.add("from[VPMRepInstance]");           
                selectList.add("from[XCADAssemblyRepInstance]");
                
				Map mVpm = vpmObj.getInfo(context, selectList);
				String sPart  = (String) mVpm.get("from[VPMRepInstance]");
				String sAsm = (String) mVpm.get("from[XCADAssemblyRepInstance]");
				
				if("TRUE".equals(sAsm)) {
					checkFlag = " && from[XCADAssemblyRepInstance]==\"TRUE\"";
				}else if ("TRUE".equals(sPart)) {
					checkFlag = " && from[VPMRepInstance]==\"TRUE\"";
				}
            }
            /// mod by choimingi 250410 [E]
            String[] params = new String[]{
                    type,
                    DomainConstants.QUERY_WILDCARD,
                    DomainConstants.QUERY_WILDCARD,
                    "1",
                    //"attribute[PLMEntity.V_Name]==\"" + newValue + "\" && logicalid != \"" + logicalId + "\"",
                    "attribute[PLMEntity.V_Name]==\"" + newValue + "\" && logicalid != \"" + logicalId + "\"" + checkFlag,
                    "attribute[PLMEntity.V_Name]",
                    "\b"
            };

            String mqlScript = "temp query bus $1 $2 $3 limit $4 where $5 select $6 dump $7";
            String result    = MqlUtil.mqlCommand(context, mqlScript, params);

            if (StringUtils.isNotEmpty(result))
            {
                String errorMessage = EnoviaResourceBundle.getProperty(context,
                                                                       "emxEngineeringCentralStringResource",
                                                                       context.getLocale(),
                                                                       "emxEngineeringCentral.Message.VNameDuplication");
                mqlScript = "error $1";
                MqlUtil.mqlCommand(context, mqlScript, new String[] {"duplicate file name :"+ result});
                System.out.println("duplicate file name :"+ result);
                System.err.println("duplicate file name :"+ result);
                //return 1;

                com.matrixone.MCADIntegration.server.MCADServerException.createManagedException("duplicate file name :"+ result,"duplicate file name :"+ result, null);
            }
        }
        catch (Exception e) 
        {
            e.printStackTrace();
            throw e;
        }
        finally
        {
            if (pushContext)
                ContextUtil.popContext(context);
        }
        return 0;
    }
}
