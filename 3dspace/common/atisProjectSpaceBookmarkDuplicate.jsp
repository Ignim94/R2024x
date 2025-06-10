<%--  emxMemberListtUtil.jsp

Copyright (c) 1999-2020 Dassault Systemes. 

All Rights Reserved.
This program contains proprietary and trade secret information
of MatrixOne, Inc.  Copyright notice is precautionary only and
does not evidence any actual or intended publication of such program
    
static const char RCSID[] = "$Id: emxMemberListUtil.jsp.rca 1.19 Wed Oct 22 16:18:31 2008 przemek Experimental przemek $";
--%>

<%@ page import="java.util.*"%>
<%@include file = "emxNavigatorTopErrorInclude.inc"%>
<%@ include file = "../emxUICommonAppInclude.inc"%>
<%@ include file = "../components/emxMemberListUtilAppInclude.inc" %>
<%@include file = "enoviaCSRFTokenValidation.inc"%>



<%
	String actionURL="";//For refreshing the Table Page.
	String returnMessage ="";
	String resultMote= "";
	String objectId 	= emxGetParameter(request, "objectId");
	System.out.println("objectId:"+objectId);
	//com.matrixone.apps.common.MemberList memberlist = (com.matrixone.apps.common.MemberList)DomainObject.newInstance(context,PropertyUtil.getSchemaProperty(context,"type_MemberList"));
	String action = request.getParameter("action")==null? "":request.getParameter("action"); //action
	action = XSSUtil.encodeForHTML(context, action);
	boolean isRemoved = false; 
	//For Activating and Deactivating the selected MemberLists
	String alertMessage = EnoviaResourceBundle.getProperty(context, "Framework",
	        						"emxFramework.Alert.WBSBookmartDuplicate", context.getSession().getLanguage());
	        			
	  if(action.equals("Update"))
	  {	    
	    //Get Table Row Id's
	    try
	    {
	    	Map mParam = new HashMap();
	    	mParam.put("objectId", objectId);
	    	
	    	MapList map = JPO.invoke(context, "emxTask", null, "atisgetWBSSubtasks", JPO.packArgs(mParam) , MapList.class);  
	    	//MapList map2 = JPO.invoke(context, "cmgTest", null, "dupFromWBSToFolder", map , MapList.class);  
	    	System.out.println("map:"+map);
	    	
	    	if(!returnMessage.isEmpty()){
         		 throw (new FrameworkException(alertMessage));
         	  }
	    }catch(MatrixException e)
	    {
	      session.setAttribute("error.message", e.getMessage());
	    }
	  }
	  
	  if(action.equals("Remove")){ 
		  String[] objectIds =request.getParameterValues("emxTableRowId");
		  try
		  {
		    //returnMessage = JPO.invoke(context, "decCodeMaster", null, "disconnectCodeDetail", objectIds , String.class);  
	    	 if(!returnMessage.isEmpty()){
      		 	throw (new FrameworkException(returnMessage));
      	  	 }
		  }
		  catch(MatrixException e){
	      	session.setAttribute("error.message", e.getMessage());
	      }	 
	  }
%>

<!-- HTML Section Begin -->

  <script language="javascript" src="../common/scripts/emxUICore.js"></script>
  <script language="javascript" src="../common/scripts/emxUIUtility.js"></script>
  <script language="javascript" src="../common/scripts/emxUIConstants.js"></script>
  <script language="javascript" type="text/javaScript">
    var action = "<%=action%>";
    if(action == "Active" ||action == "Inactive")
    {
    	
    	 var action = "<%=alertMessage%>";
    	 //  const fr = window.parent
    	 //  const fr0 = window.top
		
    	  window.parent.location.reload();
      
    } 
    
    if(action == "Update")
    {
    	
		 alert("active");
    	 //  const fr = window.parent
    	 //  const fr0 = window.top

    	  window.parent.location.reload();
      
    } 
 
    if(action == "Remove")
    {
    	

    	 //  const fr = window.parent
    	 //  const fr0 = window.top

    	  window.parent.location.reload();
      
    } 
    
  </script> 
  <%@include file = "../emxUICommonEndOfPageInclude.inc" %>
  <%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
  

<!-- HTML Section End -->
