package com.atis.rest.service;

import com.matrixone.apps.common.CommonDocument;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.program.ProgramCentralConstants;
import com.matrixone.json.JSONObject;

import java.util.LinkedHashMap;
import java.util.Map;

import com.dassault_systemes.platform.restServices.RestService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import matrix.util.MatrixException;
import matrix.util.StringList;

@Path("/ObjectInfo")
public class cmgObjectInfo extends RestService {

	@GET
	public Response getMsg(@Context HttpServletRequest request) throws Exception{
		 //status code를 같이 보내줘야한다.
		JSONObject responseData = new JSONObject();
		// domainobject 쓰는 방법.
		matrix.db.Context context = null;
		Map<String, Object> orderedMap = new LinkedHashMap<>();
		 String strJson = "";
		try {
			
			context = authenticate(request);
			String oid = request.getParameter("oid");
			
			DomainObject dom = new DomainObject(oid);
			
			System.out.println("objectId:"+oid);
			String sWhere ="";
			

			StringList busSelects = new StringList();
				busSelects.add(DomainConstants.SELECT_TYPE);
		    	busSelects.add(DomainConstants.SELECT_NAME);
		    	busSelects.add(DomainConstants.SELECT_POLICY);
		    	busSelects.add(ProgramCentralConstants.SELECT_OWNER);
		    	busSelects.add(DomainConstants.SELECT_ORGANIZATION);
		    	busSelects.add(DomainConstants.SELECT_DESCRIPTION);
		    	busSelects.add(ProgramCentralConstants.SELECT_ATTRIBUTE_CURRENCY);
		    	busSelects.add(DomainConstants.SELECT_CURRENT);
		    	busSelects.add(DomainConstants.SELECT_ORIGINATED);
		    	
		    	busSelects.add("to[Company Project].from.attribute[Title]");
		    	//단위
		    	//프로그램
		    	busSelects.add(ProgramCentralConstants.SELECT_ATTRIBUTE_SCHEDULED_FROM);
		    	busSelects.add(ProgramCentralConstants.SELECT_ATTRIBUTE_CONSTRAINT_DATE);
		    	busSelects.add(ProgramCentralConstants.SELECT_ATTRIBUTE_TASK_ESTIMATED_START_DATE);
		    	busSelects.add(ProgramCentralConstants.SELECT_ATTRIBUTE_TASK_ESTIMATED_FINISH_DATE);
		    	busSelects.add(ProgramCentralConstants.SELECT_ATTRIBUTE_TASK_ESTIMATED_DURATION);
		    	busSelects.add(ProgramCentralConstants.SELECT_DEFAULT_CONSTRAINT_TYPE);
		    

		    	
			Map<String,String> ml = dom.getInfo(context, busSelects);
			String getK ="";
			String getV ="";
			String getPrt = ""; 
			String pClassificationPaths =  EnoviaResourceBundle.getProperty(context, "emxComponentsStringResource_ko", context.getLocale(),
		 			"emxComponents.Properties.ClassificationPaths");
			String pProjectName =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.ProjectName");
			String pType =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.Type");
			String pPolicy =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.Policy");
			String pProjectOwner =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.ProjectOwner");
			String pProjectTeam =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.SecurityContext.OrgTeam");
			
			String pDescription =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.Description");
			String pCurrency =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.Currency");
			String pProjectStatus =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.ProjectStatus");
			String pCreationDate =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.CreationDate");
			String pCompanyName =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.CompanyName");
			String pBusinessUnit =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.BusinessUnit");
			String pProgram =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.Program");
			
			String pScheduleFrom =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.ScheduleFrom");
			String pProjectDate =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.ProjectDate");
			String pTaskEstimatedStartDate =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.TaskEstimatedStartDate");
			String pTaskEstimatedFinishDate =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.TaskEstimatedFinishDate");
			String pTaskEstimatedDuration =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.TaskEstimatedDuration");
			String pDefaultConstriantType =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.TaskConstriant.DefaultConstriant");

			
			


			orderedMap.put("ClassificationPaths", pClassificationPaths + ", ");
			orderedMap.put("name", pProjectName + "," + ml.get("name"));
			orderedMap.put("type",  pType + "," + ml.get("type"));
			orderedMap.put("policy",  pPolicy + "," + ml.get("policy"));
			orderedMap.put("owner",  pProjectOwner + "," + ml.get("owner"));
			orderedMap.put("organization",  pProjectTeam + "," + ml.get("organization"));
			
			orderedMap.put("description",  pDescription + "," + ml.get("description"));
			orderedMap.put("currency",  pCurrency + "," + ml.get("attribute[Currency]"));
			orderedMap.put("current",  pProjectStatus + "," + ml.get("current"));
			orderedMap.put("originated",  pCreationDate + "," + ml.get("originated"));
			orderedMap.put("CompanyName",  pCompanyName + "," + ml.get("to[Company Project].from.attribute[Title]"));
			orderedMap.put("BusinessUnit",  pBusinessUnit + ", ");
			orderedMap.put("Program",  pProgram + ", ");
			
			orderedMap.put("ScheduleFrom",  pScheduleFrom + "," + ml.get("attribute[ScheduleFrom]"));
			orderedMap.put("ProjectDate", pProjectDate + "," +  ml.get("attribute[Task Constraint Date]"));
			orderedMap.put("TaskEstimatedStartDate",  pTaskEstimatedStartDate + "," + ml.get("attribute[Task Estimated Start Date]"));
			orderedMap.put("TaskEstimatedFinishDate",  pTaskEstimatedFinishDate + "," + ml.get("attribute[Task Estimated Finish Date]"));
			orderedMap.put("TaskEstimatedDuration",  pTaskEstimatedDuration + "," + ml.get("attribute[Task Estimated Duration]"));
			orderedMap.put("DefaultConstriantType",  pDefaultConstriantType + "," + ml.get("attribute[Default Constraint Type]"));
			
			responseData = new JSONObject(orderedMap);
			//Gson gson = new GsonBuilder().create();
		    //strJson = gson.toJson(responseData);
			
			System.out.println("cmgObjectInfo - java finish");
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
