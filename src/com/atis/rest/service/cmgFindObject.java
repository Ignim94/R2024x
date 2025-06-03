package com.atis.rest.service;

import com.matrixone.apps.common.CommonDocument;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.json.JSONObject;

import java.util.Map;

import com.dassault_systemes.platform.restServices.RestService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import matrix.util.MatrixException;
import matrix.util.StringList;

@Path("/findObject")
public class cmgFindObject extends RestService {

	@GET
	public Response getMsg(@Context HttpServletRequest request) throws Exception{
		 //status code를 같이 보내줘야한다.
		JSONObject responseData = new JSONObject();
		// domainobject 쓰는 방법.
		matrix.db.Context context = null;
		try {
			
//			JSONArray dataList = new JSONArray();
//			for() {
//				JSONObject data = new JSONObject();
//				dataList.put(data);
//			}
//			responseData.put("name", "mingi");
//			responseData.put("company", "atis");
//			responseData.put("id", "cmg");
//			responseData.put("msg", "ok");
			/*
			 * Project Space 컬럼
				프로젝트 명, OID, 생성일, 수정일, 작성자
			   Document 컬럼
				문서코드, 문서명, OID, 생성일, 수정일, 작성자, 잠금여부
			 */
			context = authenticate(request);
			String getType = request.getParameter("findType");
			String getState = request.getParameter("setState");
			
			System.out.println("getType:"+getType);
			boolean isDoc = false;
			String sWhere ="";
			if(!("ALL".equals(getState))) {
				sWhere = "current=="+getState;
			}
			System.out.println("sWhere:"+sWhere);
			
			StringList busSelects = new StringList();
			if("Project Space".equals(getType)) {
		    	busSelects.add(DomainConstants.SELECT_ID);
		    	busSelects.add(DomainConstants.SELECT_NAME);
		    	busSelects.add(DomainConstants.SELECT_MODIFIED);
		    	busSelects.add(DomainConstants.SELECT_ORIGINATED);
		    	busSelects.add(DomainConstants.SELECT_ORIGINATOR);
		    	
			}else if("Document".equals(getType)) {
				busSelects.add(CommonDocument.SELECT_NAME);
		    	busSelects.add(CommonDocument.SELECT_TITLE);
		    	busSelects.add(CommonDocument.SELECT_ID);
		    	busSelects.add(CommonDocument.SELECT_MODIFIED);
		    	busSelects.add(CommonDocument.SELECT_ORIGINATED);
		    	busSelects.add(CommonDocument.SELECT_ORIGINATOR);
		    	busSelects.add(CommonDocument.SELECT_LOCKED);
		    	sWhere = "policy=='Document Release'";
		    	isDoc = true;
			}
		

				
				
				
			MapList ml = DomainObject.findObjects(context, getType, "*", sWhere, busSelects);
			System.out.println("ml count:"+ml.size());
			
			/*
			 * {name=PRJ-1, modified=1/21/2025 11:36:11 AM,
			 *  attribute[Originator]=admin_platform, id=29679.38581.1380.27062,
			 *   type=Project Space, originated=1/17/2025 8:44:40 AM}
			 */
			////
			/* {name=DOC-0000001, modified=1/10/2025 2:32:47 PM,
			 *  attribute[Originator]=atis_cmg, id=29679.38581.59806.7031,
			 *   locked=FALSE, type=Document, attribute[Title]=DOC-0000001,
			 *    originated=1/10/2025 2:32:46 PM}
			 */
			StringBuilder bName = new StringBuilder();
	        StringBuilder bId = new StringBuilder();
	        StringBuilder bOriginator = new StringBuilder();
	        StringBuilder bModified = new StringBuilder();
	        StringBuilder bOriginated = new StringBuilder();
	       
	        StringBuilder bTitle = new StringBuilder();
	        StringBuilder bLocked = new StringBuilder();
	        
	        for (Object o : ml) {
	        	Map m = (Map) o;
	            if (bName.length() > 0) {
	            	bName.append(",");
	            }
	            if (bId.length() > 0) {
	            	bId.append(",");
	            }
	            if (bOriginator.length() > 0) {
	            	bOriginator.append(",");
	            }
	            if (bModified.length() > 0) {
	            	bModified.append(",");
	            }
	            if (bOriginated.length() > 0) {
	            	bOriginated.append(",");
	            }
//	            if(isDoc && bTitle.length() > 0) {
//	            	bTitle.append(",");
//	            }
//	            if(isDoc && bLocked.length() > 0) {
//	            	bLocked.append(",");
//	            }
	            bName.append(m.get("name"));
	            bId.append(m.get("id"));
	            bOriginator.append(m.get("attribute[Originator]"));
	            bModified.append(m.get("modified"));
	            bOriginated.append(m.get("originated"));
	            if(isDoc) {
	            	System.out.println("isDoc");
	            	if(bTitle.length() > 0) {
	 	            	bTitle.append(",");
	 	            }
	 	            if(bLocked.length() > 0) {
	 	            	bLocked.append(",");
	 	            }
	            	bTitle.append(m.get("attribute[Title]"));
	            	bLocked.append(m.get("locked"));
	            	 String sTitle 	 	 = bTitle.toString();
				     String sLocked	 = bLocked.toString();
					responseData.put("title",sTitle);
					responseData.put("locked", sLocked);
	            }
	        }

	        String sName 		 = bName.toString();
	        String sID 			 = bId.toString();
	        String sOriginator   = bOriginator.toString();
	        String sModified 	 = bModified.toString();
	        String sOriginated	 = bOriginated.toString();
			
			
//			if(isDoc){
//				 String sTitle 	 	 = bTitle.toString();
//			     String sLocked	 = bLocked.toString();
//				responseData.put("title",sTitle);
//				responseData.put("locked", sLocked);
//			}
			responseData.put("name", sName);
			responseData.put("id", sID);
			responseData.put("originator", sOriginator);
			responseData.put("modifiedDate",sModified);
			responseData.put("createdDate", sOriginated);
			
			System.out.println("cmgfindobject - java finish");
		}catch(MatrixException e) {
				e.printStackTrace();
			
		}catch(Exception e) { // exception을 목적에 맞게 여러가지로 쓰는게 좋긴 함
			responseData.put("msg", e.getMessage());
			e.printStackTrace();
			return Response.status(HttpServletResponse.SC_INTERNAL_SERVER_ERROR).entity(responseData.toString()).build();
		}
		
		return Response.status(HttpServletResponse.SC_OK).entity(responseData.toString()).build();
	}
}
