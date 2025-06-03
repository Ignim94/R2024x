package com.atis.rest.service;

import com.matrixone.apps.common.CommonDocument;
import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.DateUtil;
import com.matrixone.apps.domain.util.DebugUtil;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.eMatrixDateFormat;
import com.matrixone.apps.framework.ui.UIUtil;
import com.matrixone.apps.program.ProgramCentralConstants;
import com.matrixone.apps.program.ProgramCentralUtil;
import com.matrixone.apps.program.Task;
import com.matrixone.apps.program.fiscal.Helper;
import com.matrixone.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.Map;
import java.util.Vector;

import org.json.JSONArray;

import com.dassault_systemes.platform.restServices.RestService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import matrix.db.BusinessObjectWithSelect;
import matrix.db.BusinessObjectWithSelectList;
import matrix.db.JPO;
import matrix.util.MatrixException;
import matrix.util.StringList;

@Path("/findProjectObject")
public class cmgProjectList extends RestService {

	@GET
	public Response getMsg(@Context HttpServletRequest request) throws Exception{
		 //status code를 같이 보내줘야한다.
		JSONObject responseData = new JSONObject();
		// domainobject 쓰는 방법.
		matrix.db.Context context = null;
		try {
			

			context = authenticate(request);
			String getType = request.getParameter("findType");
			String getState = request.getParameter("setState");
			
			//System.out.println("getType:"+getType);
			boolean isDoc = false;
			String sWhere ="";
			if(!("ALL".equals(getState))) {
				sWhere = "current=="+getState;
			}
			System.out.println("sWhere:"+sWhere);
			
			StringList busSelects = new StringList();
			busSelects.add(DomainConstants.SELECT_ID);
	    	busSelects.add(DomainConstants.SELECT_NAME);
	    	//상태
	    	busSelects.add(DomainConstants.SELECT_CURRENT);
	    	busSelects.add(ProgramCentralConstants.SELECT_OWNER);
	    	busSelects.add(ProgramCentralConstants.SELECT_ATTRIBUTE_TASK_ESTIMATED_FINISH_DATE);
	    	busSelects.add(ProgramCentralConstants.SELECT_ATTRIBUTE_TASK_ACTUAL_FINISH_DATE);
	    	busSelects.add(DomainConstants.SELECT_ORIGINATED);
	    	busSelects.add("to[Program Project].from.name");
	    	busSelects.add(DomainConstants.SELECT_DESCRIPTION);
			// add status
	        busSelects.add(ProgramCentralConstants.SELECT_ATTRIBUTE_PERCENT_COMPLETE);
	        busSelects.add(ProgramCentralConstants.SELECT_ATTRIBUTE_TASK_ACTUAL_START_DATE);

	        
		    long start2 = System.currentTimeMillis();
		    MapList ml = DomainObject.findObjects(context, getType, "*", "*", "*","eService Production", sWhere, false, busSelects);
		    long finish2 = System.currentTimeMillis();
		    System.out.println("ml2 count:"+ml.size());
			
		    float sec2 = (finish2 - start2) / 1000f;
		    System.out.println("시간2:"+sec2);
	        


		    String pProjectName =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.ProjectName");
		    String pStatus =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Tooltip.Status");
		    String pCurrentPhase =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		    		"emxProgramCentral.Common.CurrentTollgate");
		    String pState =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.State");
		    String pOwner =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.Owner");
		    String pEstimatedFinishDate =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.EstimatedFinishDate");
		    String pActualFinishDate =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.ActualFinishDate");
		    String pOriginated =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.Originated");
		    String pProgramSearch =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.ProgramSearch");
		    String pDescription =  EnoviaResourceBundle.getProperty(context, "emxProgramCentralStringResource_ko", context.getLocale(),
		 			"emxProgramCentral.Common.Description");			
		    String[] bcolumnName 	= {pStatus,pCurrentPhase,pState,pOwner,pEstimatedFinishDate,pActualFinishDate,pOriginated,pProgramSearch,pDescription};
		    String[] bcolumnName_en 	= {"ProjectStatus","currentPhase","Status","Owner","Est Finish","Act Finish","Created Date","Program","Description"};
			//StringBuilder bId			 = new StringBuilder();
			//StringBuilder bName 	     = new StringBuilder();
	        //StringBuilder bStatus        = new StringBuilder();
	        //StringBuilder bPhase	     = new StringBuilder();
	        //StringBuilder bCurrent       = new StringBuilder();
	        //StringBuilder bOwner	     = new StringBuilder();
	        //StringBuilder bEstFinishDate = new StringBuilder();
	        //StringBuilder bActFinishDate = new StringBuilder();
	        //StringBuilder bOriginated    = new StringBuilder();
	        //StringBuilder bProgram 	     = new StringBuilder();
	        //StringBuilder bDescription 	 = new StringBuilder();
	        
	        String[] bId			= new String[ml.size()];         
	        String[] bName 	        = new String[ml.size()];   
	        String[] bStatus        = new String[ml.size()];
	        String[] bStatusTitle   = new String[ml.size()];
	        String[] bPhase	        = new String[ml.size()];   
	        String[] bCurrent       = new String[ml.size()];
	        String[] bOwner	        = new String[ml.size()];   
	        String[] bEstFinishDate = new String[ml.size()];
	        String[] bActFinishDate = new String[ml.size()];
	        String[] bOriginated    = new String[ml.size()];
	        String[] bProgram 	    = new String[ml.size()];
	        String[] bDescription 	= new String[ml.size()];
	        
	        
	        int i = 0;
	        for (Object o : ml) {
	        	
	        	Map m = (Map) o;
	        	String id = (String) m.get("id");
				String[] args = {id};
				String getPhase = JPO.invoke(context,
	                    "cmgSearch", null, "getProjectCurrentPhase",
	                    args, String.class);
				if("".equals(getPhase)) {
					getPhase = " ";
				}
				String[] getStatus = getStatusIcon(context, m);					           
	            
	            bId[i]= (String) (m.get("id"));
	            bName[i]= (String) (m.get("name"));
	            bStatus[i]= (String) (getStatus[0]);      
	            bStatusTitle[i]= (String) (getStatus[1]);      
	            bPhase[i]= (String) (getPhase);	   
	            bCurrent[i]= (String) (m.get("current"));     
	            bOwner[i]= (String) (m.get("owner"));	   
	            bEstFinishDate[i]= (String) (m.get("attribute[Task Estimated Finish Date]"));
	            bActFinishDate[i]= (String) (m.get("attribute[Task Actual Finish Date]"));
	            bOriginated[i]= (String) (m.get("originated"));  
	            bProgram[i]= (String) (m.get("to[Program Project].from.name")); 	   
	            bDescription[i]= (String) (m.get("description"));
	            
	            i++;
	        }	        
			
	        responseData.put("OID", new JSONArray(bId));
	        responseData.put("name", new JSONArray(bName));
	        responseData.put("Status", new JSONArray(bStatus));
	        responseData.put("StatusTitle", new JSONArray(bStatusTitle)); // 중복 키 수정
	        responseData.put("Phase", new JSONArray(bPhase));
	        responseData.put("Current", new JSONArray(bCurrent));
	        responseData.put("Owner", new JSONArray(bOwner));
	        responseData.put("EstFinishDate", new JSONArray(bEstFinishDate));
	        responseData.put("ActFinishDate", new JSONArray(bActFinishDate));
	        responseData.put("Originated", new JSONArray(bOriginated));
	        responseData.put("Program", new JSONArray(bProgram));
	        responseData.put("Description", new JSONArray(bDescription));

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
	
	
	public String[] getStatusIcon(matrix.db.Context context, Map m) throws Exception
    {
        long start = System.currentTimeMillis();


        String ctxLang = context.getLocale().getLanguage();
        SimpleDateFormat sdf = new SimpleDateFormat(eMatrixDateFormat.getEMatrixDateFormat(), Locale.US);

        Calendar calendar = Calendar.getInstance();
        Date systemDate = calendar.getTime();
        systemDate = Helper.cleanTime(systemDate);

        String onTime = EnoviaResourceBundle.getProperty(context, "ProgramCentral", "emxProgramCentral.Common.OnTime", ctxLang);
        String late = EnoviaResourceBundle.getProperty(context, "ProgramCentral", "emxProgramCentral.Common.Late", ctxLang);
        String behindSchedule = EnoviaResourceBundle.getProperty(context, "ProgramCentral", "emxProgramCentral.Common.Legend.BehindSchedule", ctxLang);
        int yellowRedThreshold = Integer.parseInt(EnoviaResourceBundle.getProperty(context, "eServiceApplicationProgramCentral.SlipThresholdYellowRed"));

        String showIcon = "";
        
            String percentComplete      = (String) m.get(Task.SELECT_PERCENT_COMPLETE);
            String estimatedFinishDate  = (String) m.get(ProgramCentralConstants.SELECT_ATTRIBUTE_TASK_ESTIMATED_FINISH_DATE);
            String actualFinishDate     = (String) m.get(ProgramCentralConstants.SELECT_ATTRIBUTE_TASK_ACTUAL_FINISH_DATE);
            String actualStartDate      = (String) m.get(Task.SELECT_TASK_ACTUAL_START_DATE);

            String value = DomainObject.EMPTY_STRING;
            String display = DomainObject.EMPTY_STRING;
            try {
                Date estimatedFinish    = sdf.parse(estimatedFinishDate);
                if ("100.0".equals(percentComplete)) {
                    if(UIUtil.isNotNullAndNotEmpty(actualFinishDate)){
                        Date actualFinish = sdf.parse(actualFinishDate);

                        if(actualFinish.before(estimatedFinish) || actualFinish.equals(estimatedFinish))  {
                            display = onTime;
                            value = ProgramCentralConstants.TASK_STATUS_ON_TIME;
                        } else {
                            display = late;
                            value = ProgramCentralConstants.TASK_STATUS_COMPLETED_LATE;
                        }
                    } else if(UIUtil.isNotNullAndNotEmpty(actualStartDate)){
                        Date actStartDate = sdf.parse(actualStartDate);
                        if(actStartDate.before(estimatedFinish)) {
                            display = onTime;
                            value = ProgramCentralConstants.TASK_STATUS_ON_TIME;
                        } else {
                            display = late;
                            value = ProgramCentralConstants.TASK_STATUS_COMPLETED_LATE;
                        }
                    }
                } else {
                    if (systemDate.after(estimatedFinish)) {
                        display = late;
                        value = ProgramCentralConstants.TASK_STATUS_LATE;
                    } else if(DateUtil.computeDuration (systemDate, estimatedFinish) <= yellowRedThreshold) {
                        display = behindSchedule;
                        value = ProgramCentralConstants.TASK_STATUS_BEHIND_SCHEDULE;
                    }
                }

            } catch (ParseException e) {
                //e.printStackTrace(); 
                DebugUtil.debug("getStatusIcon "+ e.getMessage());
            }

//            if(ProgramCentralUtil.isNotNullString(exportFormat)) {
//                showIcon.add(display);
//            } else 
//            if(ProgramCentralConstants.TASK_STATUS_ON_TIME.equals(value)){
//                showIcon.add("<div style=\"background:#6FBC4B;width:11px;height:11px;border-radius:50px;margin:auto;\" title=\"" + display + "\"> </div>");
//            } else if (ProgramCentralConstants.TASK_STATUS_COMPLETED_LATE.equals(value)){
//                showIcon.add("<div style=\"background:#6FBC4B;width:11px;height:11px;border-radius:50px;margin:auto;\" title=\"" + display + "\"> </div>");
//            } else if (ProgramCentralConstants.TASK_STATUS_BEHIND_SCHEDULE.equals(value)){
//                showIcon.add("<div style=\"background: #FEE000;width:11px;height:11px;border: none;-webkit-box-sizing: content-box;-moz-box-sizing: content-box;box-sizing: content-box;font: normal 100%/normal Arial, Helvetica, sans-serif;color: rgba(0, 0, 0, 1);-o-text-overflow: clip;text-overflow: clip;-webkit-transform: rotateZ(-45deg);transform: rotateZ(-45deg);-webkit-transform-origin: 0 100% 0deg;transform-origin: 0 100% 0deg;;margin:auto;\" title=\"" + display + "\"> </div>");
//            } else if (ProgramCentralConstants.TASK_STATUS_LATE.equals(value)){
//                showIcon.add("<div style=\"background:#CC092F;width:11px;height:11px;margin:auto;\" title=\"" + display + "\"> </div>");
//            }else{
//                showIcon.add(" ");
//            }
            
            if(ProgramCentralConstants.TASK_STATUS_ON_TIME.equals(value)){
                showIcon= "background:#6FBC4B;width:11px;height:11px;border-radius:50px;margin:auto;";
            } else if (ProgramCentralConstants.TASK_STATUS_COMPLETED_LATE.equals(value)){
            	showIcon= "background:#6FBC4B;width:11px;height:11px;border-radius:50px;margin:auto;";
            } else if (ProgramCentralConstants.TASK_STATUS_BEHIND_SCHEDULE.equals(value)){
                showIcon= "background: #FEE000;width:11px;height:11px;border: none;-webkit-box-sizing: content-box;-moz-box-sizing: content-box;box-sizing: content-box;font: normal 100%/normal Arial, Helvetica, sans-serif;color: rgba(0, 0, 0, 1);-o-text-overflow: clip;text-overflow: clip;-webkit-transform: rotateZ(-45deg);transform: rotateZ(-45deg);-webkit-transform-origin: 0 100% 0deg;transform-origin: 0 100% 0deg;;margin:auto;";
            } else if (ProgramCentralConstants.TASK_STATUS_LATE.equals(value)){
            	showIcon= "background:#CC092F;width:11px;height:11px;margin:auto;";
            }else{
            	showIcon= " ";
            }

        DebugUtil.debug("Total time taken by getStatusIcon(programHTMLOutPut)::"+(System.currentTimeMillis()-start));
        
        String[] returnArr = {showIcon, display};
        		
        return returnArr;
    }
}
