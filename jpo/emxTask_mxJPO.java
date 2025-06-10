/* emxTask.java

   Copyright (c) 1992-2020 Dassault Systemes.
   All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,
   Inc.  Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program

   static const char RCSID[] = $Id: emxTask.java.rca 1.6 Wed Oct 22 16:21:23 2008 przemek Experimental przemek $
*/

import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;

import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.CacheUtil;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.DebugUtil;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.framework.ui.UIUtil;
import com.matrixone.apps.program.ProgramCentralConstants;
import com.matrixone.apps.program.ProgramCentralUtil;
import com.matrixone.apps.program.Task;

import matrix.db.*;
import matrix.util.StringList;

/**
 * The <code>emxTask</code> class represents the Task JPO
 * functionality for the AEF type.
 *
 * @version AEF 10.0.SP4 - Copyright (c) 2002, MatrixOne, Inc.
 */
public class emxTask_mxJPO extends emxTaskBase_mxJPO
{

    /**
     *
     * @param context the eMatrix <code>Context</code> object
     * @param args holds no arguments
     * @throws Exception if the operation fails
     * @since AEF 10.0.SP4
     * @grade 0
     */
    public emxTask_mxJPO (Context context, String[] args)
        throws Exception
    {
      super(context, args);
    }
    
    
    @com.matrixone.apps.framework.ui.ProgramCallable
    public MapList atisgetWBSSubtasks(Context context, String[] args) throws Exception
    {
        HashMap arguMap         = (HashMap)JPO.unpackArgs(args);
        String strObjectId      = (String) arguMap.get("objectId");
        String strExpandLevel   = "0";
        String selectedProgram  = (String) arguMap.get("selectedProgram");
        String selectedTable    = (String) arguMap.get("selectedTable");
        String effortFilter     = (String) arguMap.get("PMCWBSEffortFilter");
        invokeFromODTFile       = (String) arguMap.get("invokeFrom"); //Added for OTD

        MapList mapList = new MapList();

        short nExpandLevel =  ProgramCentralUtil.getExpandLevel(strExpandLevel);
        if("PMCProjectTaskEffort".equalsIgnoreCase(selectedTable)){
            String[] arrJPOArguments = new String[3];
            HashMap programMap = new HashMap();
            programMap.put("objectId", strObjectId);
            programMap.put("ExpandLevel", strExpandLevel);
            programMap.put("ScheduleEffortView", "true");

            if(!"null".equals(effortFilter) && null!= effortFilter && !"".equals(effortFilter)) {
                programMap.put("effortFilter", effortFilter);
            }
            arrJPOArguments = JPO.packArgs(programMap);
            mapList = (MapList)JPO.invoke(context,
                    "emxEffortManagementBase", null, "getProjectTaskList",
                    arrJPOArguments, MapList.class);

            Iterator itr;
            Map map;
            int size = mapList.size();
            for(int j = 0; j < size; j++){
                map = (Map) mapList.get(j);
                if("TRUE".equalsIgnoreCase((String)map.get(ProgramCentralConstants.SELECT_KINDOF_PROJECT_SPACE))){
                    map.put("hasChildren","true");
                    mapList.set(j, map);
                }
            }
        }else{
            mapList = (MapList) getWBSTasks(context,strObjectId,DomainConstants.RELATIONSHIP_SUBTASK,nExpandLevel);
        }

        HashMap hmTemp = new HashMap();
        hmTemp.put("expandMultiLevelsJPO","true");
        mapList.add(hmTemp);

        //Need to ask f1m -- is it really required in DPM code base?
        boolean isAnDInstalled = FrameworkUtil.isSuiteRegistered(context,"appVersionAerospaceProgramManagementAccelerator",false,null,null);
        if(isAnDInstalled){
            boolean isLocked = Task.isParentProjectLocked(context, strObjectId);
            if(isLocked){
                for(Object tempMap : mapList){
                    ((Map)tempMap).put("disableSelection", "true");
                    ((Map)tempMap).put("RowEditable", "readonly");
                }
            }
        }
        for(Object o : mapList) {
        	Map m = (Map) o;
        	m.put("projectid",strObjectId);      	
        }
        String str = atisWBSFolder_mxJPO.dupFromWBSToFolder(context,mapList);
        System.out.println("str : *** "+ str);
        return mapList;
    
    }
    
}
