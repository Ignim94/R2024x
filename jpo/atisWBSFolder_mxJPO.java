
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
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aspose.slides.Collections.Hashtable;

import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.DomainSymbolicConstants;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.domain.util.StringUtil;
import com.matrixone.apps.framework.ui.UIUtil;
import com.matrixone.apps.program.ProgramCentralConstants;
import com.matrixone.apps.program.ProgramCentralUtil;
import com.matrixone.apps.program.Task;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.Pattern;
import matrix.util.StringList;

/**
 * The <code>emxAEFCollectionBase</code> class contains methods for the
 * "Collection" Common Component.
 *
 * @version AEF 10.0.Patch1.0 - Copyright (c) 2003, MatrixOne, Inc.
 */

public class atisWBSFolder_mxJPO {

	private static final String EMX_COMPONENTS_STRING_RESOURCE = "emxComponentsStringResource";
	private static final Logger logger = LoggerFactory.getLogger(atisWBSFolder_mxJPO.class);

	@com.matrixone.apps.framework.ui.ProgramCallable
    public static String dupFromWBSToFolder(Context context, MapList map) throws Exception
    {
  		com.dassault_systemes.enovia.workspace.modeler.WorkspaceVault workspaceVault =
				(com.dassault_systemes.enovia.workspace.modeler.WorkspaceVault) DomainObject.newInstance(context,
						DomainConstants.TYPE_WORKSPACE_VAULT, DomainConstants.WORKSPACEMDL);
  		// {expandMultiLevelsJPO=true} << last map key
  		// 북마크 -> 북마크 : "Sub Vaults"
  		// 프로젝트 -> 북마크 : "Data Vaults"
  		// 북마크 -> 문서 : "Vaulted Objects" 
        MapList mapList = map;
        int level1 = 1;
        String title ="";
        String level ="";
        String seqId ="";
        String id ="";
        String projectid ="";
        String hasChildren ="";
        String expandMultiLevelsJPO ="";

      /// All Delete [S]
        String expandMultiLevelsJPO2 ="";
    	StringList busSelects = new StringList();
    	busSelects.add(DomainConstants.SELECT_ID);
    	busSelects.add(DomainConstants.SELECT_NAME);
    	busSelects.add(DomainConstants.SELECT_TYPE);
    	busSelects.add(DomainConstants.SELECT_ATTRIBUTE_TITLE);
    	busSelects.add(DomainConstants.SELECT_DESCRIPTION);
		StringList relSelects = new StringList();
		relSelects.add(DomainRelationship.SELECT_ID); 
		relSelects.add(DomainRelationship.SELECT_NAME);
		
		MapList folderList = new MapList();
		StringList descriptionList = new StringList();
		
        for(Object x : map) {
        	Map xMap = (Map) x;
        	expandMultiLevelsJPO2 = (String) xMap.get("expandMultiLevelsJPO");
        	if("true".equals(expandMultiLevelsJPO2)) {
        		break;
        	}
        	projectid = (String) xMap.get("projectid");
        	 break;
        }
        DomainObject projectDom = new DomainObject(projectid);
        folderList = projectDom.getRelatedObjects(context, "Data Vaults,Sub Vaults", "*",
    			busSelects, relSelects, false, true, (short) 0, "", "", 0);
        String gDescription ="";
        
        
        	/// object delete [S]
        StringList folderIdList = new StringList();
        for(Object x2 : folderList) {
   		  Map xMap2 = (Map) x2;
   		  String orgId = (String) xMap2.get("id");
   	  	  String relId = (String) xMap2.get("id[connection]");
   	  	  folderIdList.add(orgId);
   	  	  System.out.println("커넥션id:"+relId);
   		  StringList docList = new DomainObject(orgId).getInfoList(context, "from[Vaulted Objects].id");
   		 	for(int i = 0 ; i<docList.size(); i++) {
   		 		String fileRelId = docList.get(i);
   		 	    //new DomainObject(fileRelId).deleteObject(context);
   		 	    DomainRelationship.disconnect(context, fileRelId);
   		 	}
   		  DomainRelationship.disconnect(context, relId);
        }
        for(int i = 0 ; i<folderIdList.size(); i++) {
		 		String folderId = folderIdList.get(i);
		 	    new DomainObject(folderId).deleteObject(context);
		}
           /// object delete [E]
        
        /// All Delete [E]
        
        String desListStr = descriptionList.toString();
        
        Boolean promoteToInWork = true;


		
		String selectedType = "Workspace Vault";
		String selectedPolicy = "Workspace";
		String strDescription ="";
		String strFolderName ="";
		Map attributes = new HashMap();
		
		int bookmarkNumber = 1;
		int subBookmarkNumber = 1;
		int mapIndex = 0;
		Map parentsMap = new HashMap();
        for(Object o : map) {
        	Map m = (Map) o;
        	expandMultiLevelsJPO = (String) m.get("expandMultiLevelsJPO");
        	if("true".equals(expandMultiLevelsJPO)) {
        		break;
        	}
        	title = (String) m.get("name");
        	if(desListStr.contains(title)) {
        		break;
        	}
        	level = (String) m.get("level");	        	
        	seqId = (String) m.get("seqId");
        	projectid = (String) m.get("projectid");
        	strDescription = title;
        	
        	// find document
        	id = (String) m.get("id");
        	DomainObject wbsDom = new DomainObject(id);
    		StringList docList = wbsDom.getInfoList(context,"from[Task Deliverable].to.id");
    		System.out.println("docList:"+docList.toString()+"size:"+docList.size());
    		
        	
        	
        	hasChildren = (String) m.get("hasChildren");
        	String connectionId = (String) m.get("id[connection]");
        	DomainRelationship rDom = new DomainRelationship(connectionId);
        	
        	attributes.clear();
        	if("1".equals(level)) {
        		
        		parentsMap.clear();
        		subBookmarkNumber = 1;
        		DomainObject dom = new DomainObject(projectid);
        		title = "0"+ String.valueOf(bookmarkNumber) +". "+title;
        		attributes.put("Title",title);
        		attributes.put("Access Type","Inherited");
        		
        		ContextUtil.startTransaction(context, true);
				workspaceVault.create(context,selectedType,strFolderName,selectedPolicy,dom,attributes,strDescription,promoteToInWork);
				String sFolderId = workspaceVault.getObjectId();
				ContextUtil.commitTransaction(context);
        		System.out.println("seqId: "+seqId+", parent:"+projectid+", level: "+level+", title: "+ title);
        		if(!docList.isEmpty()) {
	        		for(int i = 0; i<docList.size(); i++) {
	        			String docId = docList.get(i);
	        			  DomainRelationship.connect(context,
	        		        		new DomainObject(sFolderId),
	        		        		"Vaulted Objects",
	        		        		new DomainObject(docId));
	        		}
        		}
        		
        		
        		
        		if("true".equals(hasChildren)) {
        			parentsMap.put(level, sFolderId);
        		}
        		bookmarkNumber++;
        	}else {
        		
        		int getLevel = Integer.parseInt(level)-1;
        		String strLevel = String.valueOf(getLevel);
        		String parentId = (String) parentsMap.get(strLevel);
        		DomainObject dom = new DomainObject(parentId);
        		MapList parentMap = dom.getRelatedObjects(context, "Sub Vaults", "*",
		    			busSelects, relSelects, false, true, (short) 1, "", "", 0);
        		int size = parentMap.size()+1;

        		title = "0"+size +". "+title;
        		attributes.put("Title",title);
        		attributes.put("Access Type","Inherited");
        		ContextUtil.startTransaction(context, true);
        		workspaceVault.setId(dom.getObjectId());
 				workspaceVault = workspaceVault.createSubVault(context, selectedType, strFolderName, selectedPolicy, attributes, strDescription, promoteToInWork);				
 				ContextUtil.commitTransaction(context);
        		String sFolderId = workspaceVault.getObjectId();
        		
        		if(!docList.isEmpty()) {
	        		for(int i = 0; i<docList.size(); i++) {
	        			String docId = docList.get(i);
	        			  DomainRelationship.connect(context,
	        		        		new DomainObject(sFolderId),
	        		        		"Vaulted Objects",
	        		        		new DomainObject(docId));
	        		}
        		}
        		
        		
        		System.out.println("seqId: "+seqId+", parent:"+parentId+", level: "+level+", title: "+ title);
 				if("true".equals(hasChildren)) {
        			parentsMap.put(level, sFolderId);
        			subBookmarkNumber=1;
        		}else {
        			subBookmarkNumber++;
        		}
        	}

        }
        String str = " WBS ----> Folder Duplicate ";
        return str;
    }

	
}