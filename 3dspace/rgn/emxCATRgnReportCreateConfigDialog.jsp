
<%@ page import="java.io.PrintWriter"%>
<%@ page import = "java.util.List" %>

<%@include file="../emxUIFramesetUtil.inc"%>
<%@include file="../common/emxCompCommonUtilAppInclude.inc"%>
<%@include file="../emxJSValidation.inc"%>
<%@include file="../emxUICommonHeaderBeginInclude.inc"%>


<script type="text/javascript" language="JavaScript" src="../common/scripts/emxUIFormUtil.js"></script>
<script type="text/javascript" src="../common/emxFormConstantsJavascriptInclude.jsp"></script>
<script type="text/javascript" src="../common/emxJSValidation.jsp"></script>
<script type="text/javascript" src="../common/scripts/emxJSValidationUtil.js"></script>
<script type="text/javascript" src="../common/scripts/emxUIModal.js"></script>
<script type="text/javascript" src="../common/scripts/emxUICore.js"></script>
<script type="text/javascript" src="../common/scripts/emxUICoreMenu.js"></script>
<script type="text/javascript" src="../common/scripts/emxUIToolbar.js"></script>
<script type="text/javascript" src="../common/scripts/emxNavigatorHelp.js"></script>
<script type="text/javascript" src="../common/scripts/emxUIPopups.js"></script>
<script type="text/javascript" src="../common/scripts/emxUICreate.js"></script>
<script type="text/javascript" src="../common/scripts/emxUIFormUtil.js"></script>
<script type="text/javascript" src="../common/scripts/emxTypeAhead.js"></script>
<script type="text/javascript" src="../common/scripts/emxUIJson.js"></script>
<script type="text/javascript" src="../common/scripts/emxQuery.js"></script>
<script type="text/javascript" src="../common/scripts/emxUIFormHandler.js"></script>

<%@ page import = "com.matrixone.apps.framework.ui.UINavigatorUtil"%>
<%@ page import = "matrix.db.*" %>
<%@ page import = "com.matrixone.apps.domain.*" %>
<%@ page import = "com.dassault_systemes.catrgn.factory.*" %>
<%@ page import = "com.dassault_systemes.catrgn.pervasive.server.RequestNfo"%>
<%@ page import = "com.dassault_systemes.catrgn.i18n.I18nContext"%>
<%@ page import = "com.dassault_systemes.catrgn.reportNav.services.jpo.ConfigurationDataContainer" %>
<%@ page import = "com.dassault_systemes.catrgn.reportNav.services.jpo.BusObject" %>
<%@ page import = "com.dassault_systemes.catrgn.reportNav.services.CATRgnReportServices" %>
<%@ page import = "com.dassault_systemes.catrgn.engine.report.generation.util.RGNUtil" %>
<%@ page import = "com.dassault_systemes.catrgn.services.util.nls.*"%>
<%@ page import = "com.dassault_systemes.catrgn.i18n.*"%>

<%
	String lang = request.getHeader("Accept-Language");

	//NLS
	RequestNfo reqInfo = RequestNfoFactory.newInstance().createRequest(context, request, lang);
	I18nContext i18nCtx = new I18nServerContext(reqInfo);
	String requiredNoticeNLS = I18nUtil.STR_REQUIRED_NOTICE.get(i18nCtx);
	String noConfigurationRequiredMessage =  new I18nString("emxRGN.Label.NoConfigurationsRequired").get(i18nCtx);
	String noConfigurationFilterLabel =  new I18nString("emxRGN.Label.NoConfigurationFilter").get(i18nCtx);
	String configurationFiltersLabel =  new I18nString("emxRGN.Label.ConfigurationFilters").get(i18nCtx);
	String filterViewLabel =  new I18nString("emxRGN.Label.ConfigurationFilterView").get(i18nCtx);
	String filterOfficialViewLabel =  new I18nString("emxRGN.Label.ConfigurationFilterOfficialView").get(i18nCtx);
	String filterProjectedViewLabel =  new I18nString("emxRGN.Label.ConfigurationFilterProjectedView").get(i18nCtx);
	//End NLS

	//SQL Injection protection
	for (String arg : Arrays.asList("contentPageIsDialog", "usepg", "warn", "portalMode", "launched")) {
		if (!emxGetParameter(request, arg).matches("(?i)(true|false)"))
			throw new RuntimeException("invalid parameter: " + arg);
	}
	if (!"emxRGNStringResource".equalsIgnoreCase(emxGetParameter(request, "strfile")))
		throw new RuntimeException("invalid parameter: stfile");
	//End SQL Injection
	
	HashMap<String,String> hiddenFields = new HashMap<String,String>();
	hiddenFields.put("action","none");
	String targetLocation = emxGetParameter(request, "targetLocation");
	if (targetLocation != null && !targetLocation.matches("(?i)(slidein|dialog)"))
		throw new RuntimeException("invalid parameter: targetLocation");
	hiddenFields.put("targetLocation", targetLocation);
	
	String mode = emxGetParameter(request, "mode");
	if (mode != null && !mode.equals("edit"))
		throw new RuntimeException("invalid parameter: mode");
	hiddenFields.put("mode", mode);

	boolean isSlideIn = "slidein".equalsIgnoreCase(targetLocation); 
	String openNewRow = isSlideIn ? "</TR><TR>" : "";
	boolean isEditMode = "edit".equalsIgnoreCase(mode); 

	String objectId = emxGetParameter(request, RGNUtil.REPORT_ID);
	if (objectId != null && !objectId.matches("^[\\w\\.]+$"))
		throw new RuntimeException("invalid parameter: objectId");
	hiddenFields.put(RGNUtil.REPORT_ID, objectId);

	String reportGenerationName = emxGetParameter(request, RGNUtil.REPORT_NAME);
	hiddenFields.put(RGNUtil.REPORT_NAME, reportGenerationName);

	String reportGenerationTitle = emxGetParameter(request, RGNUtil.REPORT_TITLE);
	if(reportGenerationTitle == null) reportGenerationTitle = "";
	hiddenFields.put(RGNUtil.REPORT_TITLE, reportGenerationTitle);

	String reportGenerationDescription = emxGetParameter(request, RGNUtil.REPORT_DESCR);
	if(reportGenerationDescription == null) reportGenerationDescription = "";
	hiddenFields.put(RGNUtil.REPORT_DESCR, reportGenerationDescription);

	String reportModelId = emxGetParameter(request,RGNUtil.REPORT_MODEL_ID);
	hiddenFields.put(RGNUtil.REPORT_MODEL_ID, reportModelId);

	String reportTemplateId = emxGetParameter(request,RGNUtil.REPORT_TEMPLATE_ID);
	hiddenFields.put(RGNUtil.REPORT_TEMPLATE_ID, reportTemplateId);

	String targetDocumentId = emxGetParameter(request,"targetDocumentOID");
	hiddenFields.put("targetDocumentOID", targetDocumentId);
	
	String nbInputsStr = emxGetParameter(request,RGNUtil.REPORT_NB_INPUTS);
	Integer nbInputs = 0;	
	if(nbInputsStr != null) nbInputs = Integer.valueOf(nbInputsStr);

	HashSet<String> inputOIDSet = new HashSet<String>();
	for(int i = 0; i < nbInputs; i++) {
		String oid = emxGetParameter(request,RGNUtil.InputId(i));
		String value = emxGetParameter(request,RGNUtil.InputValue(i));
		if (oid != null && !oid.isEmpty()) inputOIDSet.addAll(Arrays.asList(oid.split("\\|")));
		hiddenFields.put(RGNUtil.InputId(i), oid);
		hiddenFields.put(RGNUtil.InputValue(i), value);
		hiddenFields.put(RGNUtil.InputType(i), emxGetParameter(request, RGNUtil.InputType(i)));
		hiddenFields.put(RGNUtil.InputName(i), emxGetParameter(request,RGNUtil.InputName(i)));
	}
	
	String[] inputOIDs = new String[inputOIDSet.size()];
	inputOIDSet.toArray(inputOIDs);
	String configInitValue = null;
	Map requestMap = UINavigatorUtil.getRequestParameterMap(pageContext);
	String role = (String) context.getRole();
	List<String> configurations = null;
	if (role != null && (!role.equals("null") || !role.equals("")|| !role.equals(" "))) {
		configurations = CATRgnReportServices.getConfigurationsOfInput(context, inputOIDs);
	};
	Map<String, BusObject> configObjectsMap = new ConfigurationDataContainer(reqInfo, new HashSet(configurations)).getAllBusObjects();
	hiddenFields.put(RGNUtil.REPORT_NB_INPUTS, String.valueOf(nbInputs));
	String configId = emxGetParameter(request,"configId");
	String filterView = emxGetParameter(request,"filterView");
	boolean isProjected = "projected".equals(filterView);

%>

<script language="Javascript">
	function cancelForm() {
	    if(<%=XSSUtil.encodeForJavaScript(context, String.valueOf(isSlideIn))%>)
		{
	    	getTopWindow().closeSlideInDialog();
			var contentFrame = findFrame(getTopWindow(), "content");
			contentFrame.refreshSBTable(contentFrame.configuredTableName);
		}
	    else	
		{
			parent.window.opener.document.location = parent.window.opener.document.location;
			parent.window.close();
		}
	}

	function submitForm() {
		findFrame(getTopWindow(),"slideInFrame").document.getElementById("divPageFoot").getElementsByClassName("btn-primary")[0].setAttribute("disabled", "true");
		document.editForm.action.value = "terminate";
		document.editForm.submit();
	}

	function updateViewState() {
		const viewSelect = document.getElementById("filterView");
		viewSelect.disabled = document.getElementById("configId").value === "none";
	}


</script>

<%@include file="../emxUICommonHeaderEndInclude.inc"%>


<BODY class="slide-in-panel" style="overflow-y: auto !important;">
	<form name="editForm" method="post"
		onsubmit="submitForm(); return false"
		action="emxCATRgnReportCreate.jsp">
		<%@include file = "../common/enoviaCSRFTokenInjection.inc"%>
		<% for (String key : hiddenFields.keySet()) { %>
			<input type="hidden" name="<%=XSSUtil.encodeForHTMLAttribute(context, key)%>" value="<%=XSSUtil.encodeForHTMLAttribute(context, hiddenFields.get(key))%>"/>
		<% } %>
		<table class="form">
			<tbody>
			<tr><td class="createRequiredNotice"><%=XSSUtil.encodeForHTML(context, requiredNoticeNLS)%></td></tr>
			<% if (configObjectsMap.isEmpty()) { %>
				<tr><td><%=XSSUtil.encodeForHTML(context, noConfigurationRequiredMessage)%></td></tr>
			<% } else { %>
				<tr>
					<td class="label">
						<label for="configId"><%=XSSUtil.encodeForHTML(context, configurationFiltersLabel)%></label>
					</td>
				</tr>
				<tr>
					<td class="field">
						<select id="configId" name="configId" style="width:100%;" onchange="updateViewState()">
							<option value="none"
								<% if(null==configId) { %>
									selected
								<% } %>
							><%=XSSUtil.encodeForHTML(context, noConfigurationFilterLabel)%></option>
							<%			            for(String aConfigID : configObjectsMap.keySet()) { 
								String display = configObjectsMap.get(aConfigID).getDisplayWithType(i18nCtx);
	%>
								<option	value="<%=XSSUtil.encodeForHTMLAttribute(context, aConfigID)%>" title="<%=XSSUtil.encodeForHTMLAttribute(context, display)%>" 
									<% if (aConfigID.equalsIgnoreCase(configId)) { %>
										selected
									<% } %>
									><%=XSSUtil.encodeForHTML(context, display)%></option>
	<%			            } %>
						</select>
					</td>
				</tr>
				<tr>
					<td class="label">
						<label for="filterView"><%=XSSUtil.encodeForHTML(context, filterViewLabel)%></label>
					</td>
				</tr>
				<tr>
					<td class="field">
						<select id="filterView" name="filterView" <% if(null == configId) { %> disabled <% } %>>
							<option value="official" title="<%=XSSUtil.encodeForHTMLAttribute(context, filterOfficialViewLabel)%>"
								<% if (!isProjected && null != configId) { %>
									selected
								<% } %>
							><%=XSSUtil.encodeForHTML(context, filterOfficialViewLabel)%></option>
							<option value="projected" title="<%=XSSUtil.encodeForHTMLAttribute(context, filterProjectedViewLabel)%>"
								<% if (isProjected && null != configId) { %>
									selected
								<% } %>
							><%=XSSUtil.encodeForHTML(context, filterProjectedViewLabel)%></option>
						</select>
					</td>
				</tr>
			<%
			}; 
			%>
			</tbody>
		</table>
	</form>
</Body>

<%@include file="../emxUICommonEndOfPageInclude.inc"%>
