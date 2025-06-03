
<%@page import="com.dassault_systemes.catrgn.i18n.I18nUtil"%>
<%@page import="com.dassault_systemes.catrgn.i18n.I18nContext"%>
<%@ page import="java.io.PrintWriter"%>
<%@ page import="java.io.*" %>
<%@ page import="java.io.File" %>
<%@ page import="java.lang.Exception" %>
<%@ page import="jakarta.servlet.*" %>	
<%@ page import="jakarta.servlet.http.*" %>

<%@ page import="com.dassault_systemes.catrgn.pervasive.server.*" %>
<%@ page import="com.dassault_systemes.catrgn.reportNav.services.CATRgnReportServices" %>
<%@ page import="com.dassault_systemes.catrgn.reportNav.services.interfaces.*" %>
<%@ page import="com.dassault_systemes.catrgn.literals.*" %>
<%@ page import="com.dassault_systemes.catrgn.engine.report.generation.util.RGNUtil" %>
<%@ page import="com.dassault_systemes.catrgn.services.util.misc.RequestInfo" %>
<%@ page import = "com.dassault_systemes.catrgn.services.util.nls.*" %>
<%@ page import = "com.dassault_systemes.catrgn.factory.RequestNfoFactory" %>

<%@include file="../emxUIFramesetUtil.inc"%>
<%@include file="../common/emxCompCommonUtilAppInclude.inc"%>
<%@include file="../emxJSValidation.inc"%>
<%@include file="../emxUICommonHeaderBeginInclude.inc"%>

<script language="JavaScript" src="../common/scripts/emxUIFormUtil.js"></script>
<script language="JavaScript" src="../common/scripts/emxUITableUtil.js"></script>
<script language="JavaScript" src="../common/scripts/jquery-latest.js"></script>
<script language="JavaScript" src="../common/scripts/emxUICore.js"></script> 
<script language="JavaScript" src="../webapps/AmdLoader/AmdLoader.js"></script>
<!-- <script language="javascript" src="../webapps/c/UWA/js/UWA_Standalone_Alone.js"></script> -->
<script language="JavaScript" src="../webapps/WebappsUtils/WebappsUtils.js"></script>
<script language="javascript" src="../webapps/UIKIT/UIKIT.js"></script>

<link rel="stylesheet" type="text/css" href="../webapps/c/UWA/assets/css/standalone.css" />
<link rel="stylesheet" type="text/css" href="../webapps/UIKIT/UIKIT.css"/>

<%
//NLS
RequestNfo reqInfo = RequestNfoFactory.newInstance().createRequest(context, request);
I18nContext i18nCtx = new I18nServerContext(reqInfo);
String lang = request.getHeader("Accept-Language");
String requiredNoticeNLS = I18nUtil.STR_REQUIRED_NOTICE.get(i18nCtx);
String platformId = context.getTenant();
if (platformId == null || platformId.isEmpty())
	platformId = "OnPremise";

String sc = context.getRole();

%>

<html>
<head> 
	<link rel="stylesheet" type="text/css" href="../webapps/RGNServices/RGN.css">
</head>
<body>
	<div id="importForm">
		<table class="form dnd">
			<tbody>
				<tr>
					<td></td>
					<td class="createRequiredNotice"><%=XSSUtil.encodeForHTML(context, requiredNoticeNLS)%></td>
				</tr>
			</tbody>
		</table>
	</div>
</body>

<script type="text/javascript" language="javascript">

	let importUI = null;

	function cancelForm() {
		getTopWindow().closeSlideInDialog();
		var contentFrame = findFrame(getTopWindow(), "content");
		contentFrame.refreshSBTable(contentFrame.configuredTableName);
	};

	function submitForm() {
		require([
			 'DS/CATRgdImportExport/Import',
			 'DS/CATRgdImportExport/ImportUI',
			 'DS/CATRgnWidgetCommons/interfaces/Facade'
		],
		function (Import, ImportUI, WebClientFacade) {
			var importData = importUI.getImportData();
			if (importData) {
				Import.process(importData, importUI.getGlobalOptions(),  new WebClientFacade.WebClientFactory('<%=sc%>', '<%=platformId%>')).then(function (response) {
					importUI.processResults(response, importData.importSettings).then(function () {
						getTopWindow().closeSlideInDialog();
						var contentFrame = findFrame(getTopWindow(), "content");
						contentFrame.refreshSBTable(contentFrame.configuredTableName);
					}, function () {
						//when rejected we stay on the page
					});
				}, function (error) {
					var errorZone = document.querySelector('.errorZone');
					errorZone.classList.remove('hidden');
					errorZone.querySelector('#errorMessage').innerHTML = (error && error.message) || error;
				});
			}
		})();
	};

	require(['DS/CATRgdImportExport/ImportUI'], function (ImportUI) {
		importUI = new ImportUI();
		importUI.buildUI(document.getElementById('importForm'));
	})();

	</script>

</html>
