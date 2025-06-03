
<%--  emxGenericDeleteProcess.jsp
   Copyright (c) 1992-2011 Dassault Systemes.
   All Rights Reserved.
   This program contains proprietary and trade secret information of MatrixOne,Inc.
   Copyright notice is precautionary only
   and does not evidence any actual or intended publication of such program

   static const char RCSID[] = $Id: emxGenericDeleteProcess.jsp.rca 1.7.3.3 Tue Oct 28 22:59:38 2008 przemek Experimental przemek $
--%>
<%@ page import="com.matrixone.apps.common.util.ComponentsUtil"%>
<%@ page import="matrix.util.MatrixException"%>
<%@ page import="com.matrixone.apps.domain.util.FrameworkException"%>
<%@ page import="com.matrixone.apps.domain.DomainObject"%>
<%@ page import="com.dassault_systemes.catrgn.reportNav.services.ObjectUsedInReportException" %>
<%@ page import="com.dassault_systemes.catrgn.reportNav.services.CATRgnReportServices" %>
<%@ page import="com.dassault_systemes.vplm.modeler.exception.PLMxModelerException" %>
<%@ page import="com.dassault_systemes.catrgn.engine.report.generation.util.*" %>
<%@ page import="com.dassault_systemes.catrgn.services.util.nls.*"%>
<%@ page import="com.dassault_systemes.catrgn.i18n.*"%>
<%@ page import="com.dassault_systemes.catrgn.constants.RgnConstants" %>
<%@ page import="com.dassault_systemes.catrgn.reportNav.services.interfaces.*" %>

<%@include file = "../common/emxNavigatorInclude.inc"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>
<%@include file = "../common/enoviaCSRFTokenValidation.inc"%>

<%
String errorMessage = null;
boolean isFromSearch = false;
try {
	Map requestMap = UINavigatorUtil.getRequestParameterMap(request);
	String toolbarName = (String)requestMap.get("toolbar");
	isFromSearch = toolbarName != null && toolbarName.contains("Search");
	String memberIds[] = emxGetParameterValues(request,"emxTableRowId");
	for (int i = 0; i < memberIds.length; i++) {
		if (memberIds[i].startsWith("|")) memberIds[i] = memberIds[i].substring(1, memberIds[i].indexOf("|", 1));
	}
	HashSet<String> ungeneratedReports = new HashSet<>();
	for (String reportId : memberIds) {
		if (DomainObject.newInstance(context, reportId).checkAccess(context, (short) AccessConstants.cModify)) {
			// Init one reqInfo and connector config per launch
			CATRgnReportServices services = new CATRgnReportServices(context, request); // IR-542541
			services.generateReport(services.getReportWithInputs(reportId), true, true, "true".equalsIgnoreCase((String)requestMap.get("withChanges")));
		} else {
			ungeneratedReports.add(reportId);
		};
	}
	if (!ungeneratedReports.isEmpty()) { //IR-729793-3DEXPERIENCER2020x
		I18nServerContext i18nCtx = new I18nServerContext(context, request.getHeader("Accept-Language"));
		StringBuilder strbuf = new StringBuilder();
		StringList select = new StringList();
		select.add(DomainConstants.SELECT_NAME);
		String[] ids = new String[ungeneratedReports.size()];
		BusinessObjectWithSelectList selectList = BusinessObject.getSelectBusinessObjectData(context,	ungeneratedReports.toArray(ids), select);
		strbuf.append(I18nUtil.STR_CANNOT_GENERATE_DUE_TO_INSUFFICIENT_RIGHTS.get(i18nCtx));
		for (int i = 0; i < selectList.size(); i++) {
			BusinessObjectWithSelect bus = selectList.get(i);
			strbuf.append("- ").append(bus.getSelectData(DomainConstants.SELECT_NAME)).append("\n");
		}
		errorMessage = strbuf.toString();
	}
} catch (MatrixException e) {
	errorMessage = e.toString();
	if (RgnConstants.IS_DEBUG)
		e.printStackTrace();
}
%>

<html>
<head> 
<script language="JavaScript" src="../common/scripts/emxUICore.js"></script> 

<script type="text/javascript" language="javascript">
	<% if( errorMessage != null) { %>
		alert("<%=XSSUtil.encodeForJavaScript(context, errorMessage)%>");
	<% }; %>
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
