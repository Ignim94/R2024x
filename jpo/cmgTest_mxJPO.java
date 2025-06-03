
/*
**  emxAEFCollectionBase
**
**  Copyright (c) 1992-2020 Dassault Systemes.
**  All Rights Reserved.
**  This program contains proprietary and trade secret information of MatrixOne,
**  Inc.  Copyright notice is precautionary only
**  and does not evidence any actual or intended publication of such program
**
**   This JPO contains the implementation of emxAEFCollectionBase
*/
/*
insert program C:/workspace_test/3dspace_FD02/jpo/decInterfaceDV_mxJPO.java;
compile prog decInterfaceDV force update;
execute program decInterfaceDV -method getDeliverableStatus;	
execute program decInterfaceDV -method getVendorPrint;
mql -c "set cont user creator;execute program decInterfaceDV -method getDeliverableStatus;"
 */
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.Vector;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dassault_systemes.delmia.tools.DELLifeCycleCouplingCommonConstants;
import com.matrixone.apps.common.CommonDocument;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.DebugUtil;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.FrameworkLicenseUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PersonUtil;
import com.matrixone.apps.domain.util.XSSUtil;
import com.matrixone.apps.domain.util.eMatrixDateFormat;
import com.matrixone.apps.framework.ui.UITableCustom;
import com.matrixone.apps.framework.ui.UIUtil;
import com.matrixone.apps.program.ProgramCentralConstants;
import com.matrixone.apps.program.ProgramCentralUtil;
import com.matrixone.apps.program.mycalendar.MyCalendarUtil;


import matrix.db.BusinessObjectWithSelect;
import matrix.db.BusinessObjectWithSelectList;
import matrix.db.Context;
import matrix.db.JPO;
import matrix.db.MQLCommand;
import matrix.db.User;
import matrix.util.MatrixException;
import matrix.util.StringList;

/**
 * The <code>emxAEFCollectionBase</code> class contains methods for the
 * "Collection" Common Component.
 *
 * @version AEF 10.0.Patch1.0 - Copyright (c) 2003, MatrixOne, Inc.
 */

public class cmgTest_mxJPO {

	private static final String EMX_COMPONENTS_STRING_RESOURCE = "emxComponentsStringResource";
	private static final Logger logger = LoggerFactory.getLogger(cmgTest_mxJPO.class);
	
		public MapList findTestObject(Context context, String[] args) throws Exception {
		
			MapList ml = new MapList();
			
			StringList busSelects = new StringList();
			System.out.println("");
			busSelects.add(DomainConstants.SELECT_ID);
			busSelects.add(DomainConstants.SELECT_NAME);
			busSelects.add(DomainConstants.SELECT_ORIGINATED);
			busSelects.add(DomainConstants.SELECT_ATTRIBUTE_TITLE);
			busSelects.add(CommonDocument.SELECT_LOCKED);
			
			String returnValue ="";
			String Id = MqlUtil.mqlCommand(context,
	  				"print person $1 select $2 dump",
	  				"admin_platform",
					"product");
			System.out.println("Id");
			
			String prjId = "29679.38581.1380.33449";
			
            String[] arrJPOArguments = new String[3];
            HashMap programMap = new HashMap();
            programMap.put("objectId", prjId);
            programMap.put("ExpandLevel", "0");
            programMap.put("ScheduleEffortView", "true");
            
            MapList mapList = new MapList();
            arrJPOArguments = JPO.packArgs(programMap);
            mapList = (MapList)JPO.invoke(context,
                    "emxEffortManagementBase", null, "getProjectTaskList",
                    arrJPOArguments, MapList.class);
            System.out.println("Map");
            
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
				                System.out.println("시작 날짜는 현재 날짜보다 이전입니다.");
				                returnValue = name;
						 }
					}else {
						System.out.println("시작날짜없음");
					}
					// Date sDate = dateFormat.parse(startDate);
					
					System.out.println("name: "+name+", sd :"+startDate+", fd :"+finishDate);
				}
			}
            System.out.println("현재단계:"+returnValue);
//			String fildId = "29679.38581.1380.32994";
//			MapList fileMap = new DomainObject(fildId).getRelatedObjects(context, "Active Version", "Document",
//					null, null,
//					false, true, (short) 1, "", "", 0);
//			
//			returnValue = String.valueOf(fileMap.size());
//			ml = DomainObject.findObjects(context, "Document", "*", "", busSelects);
//			 // 날짜 포맷 정의
//			 String falseRock = "29679.38581.59806.7031";
//					 String trueRock = "29679.38581.1380.36207";
//						String f = new DomainObject(falseRock).getInfo(context,CommonDocument.SELECT_LOCKED);
//			 String t = new DomainObject(trueRock).getInfo(context,CommonDocument.SELECT_LOCKED);
//				
//			String sOid =  "29679.38581.1380.33449";
//			String prjAccessListId = new DomainObject(sOid).getInfo(context, "to[Project Access List].from.id");
//			MapList taskMap = new DomainObject(prjAccessListId).getRelatedObjects(context, "Project Access Key", "*",
//					busSelects, null,
//					false, true, (short) 1, "", "", 0);
//			returnValue = String.valueOf(taskMap.size());
//			String taskId = "29679.38581.1380.35347";
//			MapList assigneeMap = new DomainObject(taskId).getRelatedObjects(context, "Assigned Tasks", "*",
//					busSelects, null,
//					true, false, (short) 1, "", "", 0);
//			String str = "";
//			for(Object o : assigneeMap) {
//				Map m = (Map) o;
//				String name = (String) m.get("name");
//				//String connectionId = (String) m.get("id[connection]");
//				str += name;
//				System.out.println("name:"+name);
//				str += ", ";
//				//DomainRelationship.disconnect(context, connectionId);
//			}
//			str = str.substring(0, str.length()-2);
//			System.out.println("str:"+str);
			//returnValue = String.valueOf(taskMap.size());
			//ml = DomainObject.findObjects(context, "cmgTest", "*", "",busSelects);
			
			
			return ml;
		
		}
	
		
		public Map createCmgTest(Context context, String[] args) throws Exception {
		
			
			Map programMap = JPO.unpackArgs(args);
			//ContextUtil.startTransaction(context, true);
			String objectId = (String) programMap.get("objectId");
			String name = (String) programMap.get("Name");
			String desc = (String) programMap.get("description");
			String attr1 = (String) programMap.get("attr1");
			Map returnMap = new HashMap();
			
			try {
				System.out.println(" [S] create test object ");		
				ContextUtil.startTransaction(context, true);
				DomainObject dom = new DomainObject();
				//Map resultMap = createCodeMaster(context, programMap);
				//dom.createObject(context, "cmgTest", name, 1, "cmgTestPolicy", "eService Production");
				dom.createObject(context, "cmgTest", name, "1", "cmgTestPolicy", "eService Production");
				dom.setDescription(context, desc);
				
				System.out.println(" [M] create test object ");
				
				dom.setAttributeValue(context, "cmgTestAttr1", attr1);
				ContextUtil.commitTransaction(context);
				String newObjId = dom.getInfo(context, "id");
				returnMap.put("id", newObjId);
				
				System.out.println(" [E] create test object ");
				
				
			}catch(Exception e) {
				e.printStackTrace();
			}
			
			return returnMap;
		}
	
	
}