
<%@page import="com.matrixone.apps.common.util.ComponentsUtil"%>
<%@page import="matrix.util.MatrixException"%>
			  
<%@include file = "../common/emxNavigatorInclude.inc"%>
<%@include file = "../common/emxNavigatorTopErrorInclude.inc"%>
<%@include file = "../emxUICommonHeaderBeginInclude.inc" %>
<%@include file = "../common/enoviaCSRFTokenValidation.inc"%>

<%
String objectIsStillUsed = null;
String errorMessage = null;
boolean isFromSearch = false;
String memberIds[] = emxGetParameterValues(request,"emxTableRowId");
try
{
 String lang = request.getHeader("Accept-Language");
 for (int i = 0; i < memberIds.length; i++) {
	 if (memberIds[i].startsWith("|")) memberIds[i] = memberIds[i].substring(1, memberIds[i].indexOf("|", 1));
 }
} catch (Exception e3) {   
 String message = e3.getMessage();
  if (e3.toString() != null && (e3.toString().trim()).length() > 0) {
	 errorMessage = e3.toString().trim();			
 } else {
	 throw new MatrixException(e3);
 }
}
String platformId = context.getTenant();
if (platformId == null || platformId.isEmpty())
	platformId = "OnPremise";

String sc = context.getRole();


%>

<html>
<head> 
<script language="JavaScript" src="../common/scripts/emxUICore.js"></script> 
<script src="../webapps/AmdLoader/AmdLoader.js"></script>
<script src="../webapps/WebappsUtils/WebappsUtils.js"></script>
<script type="text/javascript" language="javascript">
require([
 'DS/CATRgdImportExport/Export',
 'DS/CATRgnWidgetCommons/interfaces/Facade'
],
function (Export, WebClientFacade) {
 <% if( errorMessage != null) { %>
	alert("<%=XSSUtil.encodeForJavaScript(context, errorMessage)%>");
 <% }; %>
	var ids = [];
 <% for (int i = 0; i < memberIds.length; i++) { %>
		ids.push('<%=XSSUtil.encodeForJavaScript(context, memberIds[i])%>');
 <% } %>
	Export.download(ids, new WebClientFacade.WebClientFactory('<%=sc%>', '<%=platformId%>')).catch(function (error) {
		alert((error && error.message) || error);
	})

})();
</script>

</head>
<body>
</body>
<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
</html>
