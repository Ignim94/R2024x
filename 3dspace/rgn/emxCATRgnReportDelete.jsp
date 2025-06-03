
<%--  emxGenericDeleteProcess.jsp
   Copyright (c) 1992-2011 Dassault Systemes.
   All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,Inc.
   Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program

   static const char RCSID[] = $Id: emxGenericDeleteProcess.jsp.rca 1.7.3.3 Tue Oct 28 22:59:38 2008 przemek Experimental przemek $
--%>
<%@ page import = "com.dassault_systemes.catrgn.reportNav.services.CATRgnReportServices" %>
<%@ page import = "com.dassault_systemes.vplm.modeler.exception.PLMxModelerException" %>
<%@ page import="com.dassault_systemes.catrgn.services.util.nls.*"%>
<%@ page import="com.dassault_systemes.catrgn.i18n.*"%>

<%@include file = "../common/emxNavigatorInclude.inc"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>
<%@include file = "../common/enoviaCSRFTokenValidation.inc"%>

<%
boolean isFromSearch = false;
try
{
	String lang = request.getHeader("Accept-Language");
	String memberIds[] = emxGetParameterValues(request,"emxTableRowId");
	Map requestMap = UINavigatorUtil.getRequestParameterMap(request);
	String toolbarName = (String)requestMap.get("toolbar");
	isFromSearch = toolbarName != null && toolbarName.contains("Search");
	for (int i = 0; i < memberIds.length; i++) {
		if (memberIds[i].startsWith("|")) memberIds[i] = memberIds[i].substring(1, memberIds[i].indexOf("|", 1));
	}
	HashSet<String> toDeleteReports = new HashSet<>();
	HashSet<String> undeletedReports = new HashSet<>();
	for (String reportId : memberIds) {
		if (DomainObject.newInstance(context, reportId).checkAccess(context, (short) AccessConstants.cModify)) {
			toDeleteReports.add(reportId);	
		} else {
			undeletedReports.add(reportId);
		};
	}
	int nbToDelete = toDeleteReports.size();
	if (nbToDelete > 0) {
		String[] toDeleteIds = new String[nbToDelete];
		CATRgnReportServices services = new CATRgnReportServices(context, lang);
		services.deleteReports(toDeleteReports.toArray(toDeleteIds));
	}
	if (!undeletedReports.isEmpty()) { //IR-729793-3DEXPERIENCER2020x
		I18nServerContext i18nCtx = new I18nServerContext(context, request.getHeader("Accept-Language"));
		StringBuilder strbuf = new StringBuilder();
		StringList select = new StringList();
		select.add(DomainConstants.SELECT_NAME);
		String[] ids = new String[undeletedReports.size()];
		BusinessObjectWithSelectList selectList = BusinessObject.getSelectBusinessObjectData(context, undeletedReports.toArray(ids), select);
		strbuf.append(I18nUtil.STR_CANNOT_DELETE_DUE_TO_INSUFFICIENT_RIGHTS.get(i18nCtx));
		for (int i = 0; i < selectList.size(); i++) {
			BusinessObjectWithSelect bus = selectList.get(i);
			strbuf.append("- ").append(bus.getSelectData(DomainConstants.SELECT_NAME)).append("\n");
		}
		emxNavErrorObject.addMessage(strbuf.toString());
	}
	
} catch (Exception ex) {   
   	emxNavErrorObject.addMessage(ex.getMessage().trim());			
}

%>

<html>
<head> 
<script language="JavaScript" src="scripts/emxUICore.js"></script> 

<script type="text/javascript" language="javascript">
	if (<%=XSSUtil.encodeForJavaScript(context, String.valueOf(isFromSearch))%>) {
		findFrame(getTopWindow(),"windowShadeFrame").document.getElementById("full_search_hidden").submit();
	} else {
		var contentFrame = findFrame(getTopWindow(), "content");
		contentFrame.refreshSBTable(contentFrame.configuredTableName);
	}
</script>

</head>
<body>
</body>
<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
</html>
