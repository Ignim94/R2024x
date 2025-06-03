<%@include file="../emxUIFramesetUtil.inc" %>
<% 
	String sc = context.getRole();
	String platformId = context.getTenant();
	if (platformId==null || platformId.isEmpty())
		platformId="OnPremise" ;
%>
<!doctype html>
<html>

	<head>
		<title>Documentation Editor</title>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<link type="text/css" rel="stylesheet" href="../webapps/CATRgnTemplateEditor/assets/reportmodeller/style.css">
		<script type="text/javascript"
			src="../webapps/CATRgnTemplateEditor/assets/reportmodeller/reportmodeller.nocache.js"></script>
		<script language="JavaScript" src="../webapps/AmdLoader/AmdLoader.js"></script>
		<link type="text/css" rel="stylesheet" href="styles/emxRGNStyle.css" />
		<link rel="stylesheet" type="text/css" href="../webapps/CodeMirror/lib/codemirror.css">
		<link rel="stylesheet" type="text/css" href="../webapps/UIKIT/UIKIT.css">
	</head>

	<body>
		<iframe src="javascript:''" id="__gwt_historyFrame" tabIndex='-1' style="position:absolute;width:0;height:0;border:0"></iframe>
		<noscript>
			<div
				style="width: 22em; position: absolute; left: 50%; margin-left: -11em; color: red; background-color: white; border: 1px solid red; padding: 4px; font-family: sans-serif">
				Your web browser must have JavaScript enabled
				in order for this application to display correctly.
			</div>
		</noscript>
		<div id="rgnI18nLoading" style="text-align: center">
			<img src="../webapps/CATRgnTemplateEditor/assets/reportmodeller/images/I_RGN_loading.gif"/>
		</div>
		<div id="layout-header">
			<div id="layout-toolbar" class="elorn-controlbar">
			</div>
		</div>
		<div id="layout-content">
		</div>
		<script>
			require(
				['DS/CATRgdApp/UI/LegacyEntryPoints'],
				function (LegacyEntryPoints) {
						//need to use Promise.catch and Promise.finally because require doesn't handle async/await Apis
						LegacyEntryPoints.launchTemplateEditor(
							'<%=XSSUtil.encodeForJavaScript(context, request.getParameter("objectId"))%>',
							'<%=XSSUtil.encodeForJavaScript(context, platformId)%>',
							'<%=XSSUtil.encodeForJavaScript(context, sc)%>')
								.catch((error) => Alert.error(error.message))
								.finally(() => document.getElementById("rgnI18nLoading").remove());
				},
				function (err) {
	                console.error('ERROR : ', err.requireType);
	                console.error('MODULES : ', err.requireModules);
	            }
			);
		</script>
		<script type="text/javascript" src="scripts/emxRGNScript.js"></script>
		<script type="text/javascript" src="../webapps/CodeMirror/lib/codemirror.js"></script>
		<script type="text/javascript" src="../webapps/CodeMirror/addon/mode/simple.js"></script>
		<script type="text/javascript" src="../webapps/CodeMirror/addon/display/autorefresh.js"></script>
		<script type="text/javascript" src="../webapps/CodeMirror/addon/display/placeholder.js"></script>
		<script type="text/javascript" src="../webapps/CATRgnOTScript/assets/scripts/emxRGNOTSCodeMirror.js"></script>
	</body>
</html>
