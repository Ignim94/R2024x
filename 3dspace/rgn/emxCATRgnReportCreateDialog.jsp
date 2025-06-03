
<%@page import="com.dassault_systemes.catrgn.pervasive.server.RequestNfo"%>
<%@page import="com.dassault_systemes.catrgn.i18n.*"%>
<%@ page import="java.io.PrintWriter"%>
<%@ page import="com.matrixone.apps.domain.DomainObject"%>
<%@ page import = "com.dassault_systemes.catrgn.api.report.configuration_filter.ConfigurationContext" %>
<%@ page import = "com.dassault_systemes.catrgn.api.report.configuration_filter.ConfigurationContext.FilterView" %>
<%@ page import = "com.dassault_systemes.catrgn.factory.*" %>
<%@ page import = "com.dassault_systemes.catrgn.reportNav.services.jpo.ReportDataContainer" %>
<%@ page import = "com.dassault_systemes.catrgn.reportNav.services.jpo.ReportInfoSupplier" %>
<%@ page import = "com.dassault_systemes.catrgn.reportNav.services.jpo.ReportInfo" %>
<%@ page import = "com.dassault_systemes.catrgn.reportNav.services.jpo.UnreachableReportInfo" %>
<%@ page import = "com.dassault_systemes.catrgn.reportNav.services.jpo.ObjectNotFoundException" %>
<%@ page import = "com.dassault_systemes.catrgn.reportNav.services.jpo.BusObject" %>
<%@ page import = "com.dassault_systemes.catrgn.engine.report.generation.util.RGNUtil" %>
<%@ page import = "com.dassault_systemes.catrgn.reportNav.services.interfaces.*" %>
<%@ page import = "com.dassault_systemes.catrgn.services.util.nls.*" %>
<%@ page import = "com.dassault_systemes.catrgn.pervasive.log.Logger"%>

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
<script type="text/javascript" src="../webapps/AmdLoader/AmdLoader.js"></script>
<script type="text/javascript" src="./scripts/emxRGNScript.js"></script>


<%
	
	//Start NLS
	

	String lang = request.getHeader("Accept-Language");
	RequestNfo reqInfo = RequestNfoFactory.newInstance().createRequest(context, request, lang);
	I18nContext i18nCtx = new I18nServerContext(reqInfo);
	String autoNameLabel = I18nUtil.STR_AUTO_NAME.get(i18nCtx);
	String requiredNoticeNLS = I18nUtil.STR_REQUIRED_NOTICE.get(i18nCtx);
	String nameLabel = I18nUtil.STR_NAME.get(i18nCtx);
	String titleLabel = I18nUtil.STR_TITLE.get(i18nCtx);
	String descrLabel = I18nUtil.STR_DESCRIPTION.get(i18nCtx);
	String reportRevisionLabel = I18nUtil.STR_REVISION.get(i18nCtx);
	String reportPolicyLabel = I18nUtil.STR_POLICY.get(i18nCtx);
	String reportTypeLabel = I18nUtil.STR_TYPE.get(i18nCtx);
	String reportModelLabel = I18nUtil.STR_REPORT_MODEL.get(i18nCtx);
	String reportTemplateLabel = I18nUtil.STR_REPORT_TEMPLATE.get(i18nCtx);
	String targetDocumentLabel = I18nUtil.STR_TARGET_DOCUMENT.get(i18nCtx);
	String enterReportNameAlert = I18nUtil.STR_ENTER_REPORT_NAME.get(i18nCtx);
	String fillReportModelAlert = I18nUtil.STR_FILL_REPORT_MODEL.get(i18nCtx);
	String fillReportTemplateAlert = I18nUtil.STR_FILL_REPORT_TEMPLATE.get(i18nCtx);
	String newReportAlert = I18nUtil.STR_NEW_REPORT.get(i18nCtx);
	String tooManyCharactersInNameAlert = I18nUtil.FSTR_TOO_MANY_CHARACTERS(I18nUtil.STR_NAME, 100).get(i18nCtx);
	String tooManyCharactersInTitleAlert = I18nUtil.FSTR_TOO_MANY_CHARACTERS(I18nUtil.STR_TITLE, 100).get(i18nCtx);
	String invalidNameAlert = I18nUtil.STR_INVALID_NAME.get(i18nCtx);
	String clearNLS = I18nUtil.STR_CLEAR.get(i18nCtx);
	String cancelNLS= I18nUtil.STR_CANCEL.get(i18nCtx);
	String searchI18n = I18nUtil.STR_SEARCH.get(i18nCtx);
	String invalidCharacters = I18nUtil.STR_INVALID_SEARCH.get(i18nCtx);
	// End NLS
	
	// Get Input Parameters	
	String targetLocation = emxGetParameter(request, "targetLocation");
	String mode = emxGetParameter(request, "mode");
	String objectId = emxGetParameter(request, RGNUtil.REPORT_ID);
	// End Input Parameters

	//SQL Injection protection
	if (targetLocation != null && !targetLocation.matches("(?i)(slidein|dialog)"))
		throw new RuntimeException("invalid parameter: targetLocation");
	if (mode != null && !mode.equals("edit"))
		throw new RuntimeException("invalid parameter: mode");
	if (objectId != null && !objectId.matches("^[\\w\\.]+$"))
		throw new RuntimeException("invalid parameter: objectId");
	for (String arg : Arrays.asList("contentPageIsDialog", "usepg", "warn", "portalMode", "launched")) {
		if (!emxGetParameter(request, arg).matches("(?i)(true|false)"))
			throw new RuntimeException("invalid parameter: " + arg);
	}
	if (!"emxRGNStringResource".equalsIgnoreCase(emxGetParameter(request, "strfile")))
		throw new RuntimeException("invalid parameter: stfile");
	//End SQL Injection

	String checkAutoName = "";
	boolean isSlideIn = "slidein".equalsIgnoreCase(targetLocation); 
	String openNewRow = isSlideIn ? "</TR><TR>" : "";
	boolean isEditMode = "edit".equalsIgnoreCase(mode);
	ReportDataContainer reportDataContainer = null;
	String reportType = null;
	String reportName = null;
	String reportRevision = null;
	String reportPolicy = null;
	String reportTitle = null;
	String reportDescription = null;
	String reportError = null;
	String reportTemplateID = null;
	String reportTemplateDisplay = null;
	String reportOutputFormatID = null;
	String reportOutputFormatDisplay = null;
	String configId = null;
	String filterView = null;
	String targetDocumentID = null;
	String targetDocumentDisplay = null;
	Map<String, String> inputValues = Collections.emptyMap();

	if (isEditMode && objectId != null) {
		if (!DomainObject.newInstance(context, objectId).checkAccess(context, (short) AccessConstants.cModify)) {
			reportError = I18nUtil.STR_NO_MODIFY_ACCESS.get(i18nCtx); //IR-729793-3DEXPERIENCER2020x
		};
		//Fix IR-324070-3DEXPERIENCER2015x
		if (objectId.startsWith("|")) objectId = objectId.substring(1, objectId.indexOf("|", 1));
        Map<Object, Object> requestMap = UINavigatorUtil.getRequestParameterMap(pageContext);
		String role = (String) context.getRole();
		if (role != null && (!role.equals("null") || !role.equals("")|| !role.equals(" "))) {
			try{
				reportDataContainer = new ReportDataContainer(reqInfo, new String[] { objectId });
				ReportInfoSupplier reportSupplier = reportDataContainer.getReports().stream().findFirst().orElse(null);
				if (reportSupplier != null && reportSupplier instanceof ReportInfo) {
					ReportInfo report = (ReportInfo) reportSupplier;
					reportType = report.getType(i18nCtx);
					reportName = report.name;
					reportRevision = report.revision;
					reportPolicy = report.getPolicy(i18nCtx);
					reportTitle = report.title;
					reportDescription = report.description;
					BusObject template = reportDataContainer.getBus(report.templateId);
					reportTemplateID = template.getId();
					reportTemplateDisplay = template.getDisplayWithType(i18nCtx);
					BusObject outputFormat = reportDataContainer.getBus(report.outputFormatId);
					reportOutputFormatID = outputFormat.getId();
					reportOutputFormatDisplay = outputFormat.getDisplayWithType(i18nCtx);
					configId = report.configId;
					filterView = report.filterView.name();
					targetDocumentID = report.targetDocumentId;
					if (targetDocumentID != null) {
						BusObject targetDocument = reportDataContainer.getBus(targetDocumentID);
						targetDocumentDisplay = targetDocument.getDisplayWithType(i18nCtx);
					}
					inputValues = report.getInputsValues();
				} else {
					String message = (reportSupplier != null && reportSupplier instanceof UnreachableReportInfo)
							? ((UnreachableReportInfo)reportSupplier).message
									: ReportDataContainer.REPORT_NOT_FOUND_I18N.get(i18nCtx);
					reportError = reportDataContainer.getUnreachableReportMessage(message, i18nCtx);
				}
			} catch (Exception e) {
				reportError = e.getMessage();
			}

		}
	} 
	

%>

<script language="Javascript">
	function cancelForm() {
	    if (<%=XSSUtil.encodeForJavaScript(context, String.valueOf(isSlideIn))%>)
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
		var autonameChecked = document.editForm.checkAutoName.checked;
		var nameValue = document.editForm.reportNameField.value;
		var titleValue = document.editForm.reportTitleField.value;
		var reportModelOID = document.editForm.reportmodelOID.value;
		var reportTemplateOID = document.editForm.reporttemplateOID.value;
		//is nameValue empty?
		if (!autonameChecked && trimWhitespace(nameValue).length == 0) {
			alert("<%=XSSUtil.encodeForJavaScript(context,  enterReportNameAlert )%>");
			return;
		}

		var nameCheckValue = checkForNameBadChars(nameValue, false);
		var descCheckValue = checkForBadChars(document.editForm.reportDescriptionField);

		//validate that all required fields are entered
		if (!autonameChecked && (nameValue == null || nameValue == "")) {
			alert("<%=XSSUtil.encodeForJavaScript(context,  newReportAlert )%>");
			document.editForm.reportNameField.focus();
			return;
		} else if (!autonameChecked && nameValue != null && nameValue.length > 100) {
			alert("<%=XSSUtil.encodeForJavaScript(context,  tooManyCharactersInNameAlert )%>");
			document.editForm.reportNameField.focus();
			return;
		} else if ( titleValue != null && titleValue.length > 100) {
			alert("<%=XSSUtil.encodeForJavaScript(context,  tooManyCharactersInTitleAlert )%>");
			document.editForm.reportTitleField.focus();
			return;
		} else if (charExists(nameValue, '"') || charExists(nameValue, '#')
				|| (nameCheckValue == false)) {
			alert("<%=XSSUtil.encodeForJavaScript(context,  invalidNameAlert )%>");
			document.editForm.reportNameField.focus();
			return;
		} else if (descCheckValue.length != 0) {
			alert("<%=XSSUtil.encodeForJavaScript(context,  invalidCharacters )%>"
					+ descCheckValue
					+ "<emxUtil:i18nScript localize='i18nId'>emxFramework.Common.AlertRemoveInValidChars</emxUtil:i18nScript>");
			document.editForm.reportDescriptionField.focus();
			return;
		} else if (reportModelOID == null || reportModelOID == "") {
			alert("<%=XSSUtil.encodeForJavaScript(context,  fillReportModelAlert )%>");
			return;
		} else if (reportTemplateOID == null || reportTemplateOID == "") {
			alert("<%=XSSUtil.encodeForJavaScript(context,  fillReportTemplateAlert )%>");
			return;
		} else {
			findFrame(getTopWindow(),"slideInFrame").document.getElementById("divPageFoot").getElementsByClassName("btn-primary")[0].setAttribute("disabled", "true");
			document.editForm.submit();
		}
	}
	
	function takeFocus() {
		var nameDisabled = document.editForm.reportNameField.disabled;
		if (nameDisabled) {
			document.editForm.reportDescriptionField.focus();
		} else {
			document.editForm.reportNameField.focus();
		}
	}
	
	function switchAutoName() {
		var autonameChecked = document.editForm.checkAutoName.checked;
		if (autonameChecked) {
			document.editForm.reportNameField.value = "";
			document.editForm.reportNameField.disabled = true;
		} else {
			document.editForm.reportNameField.disabled = false;
			document.editForm.reportNameField.focus();
		}
	}

</script>

<%@include file="../emxUICommonHeaderEndInclude.inc"%>


<BODY OnLoad="takeFocus();rgnUpdateCreateForm();" class="slide-in-panel" style="overflow-y: auto !important;">
	<form name="editForm" method="post"
		onsubmit="submitForm(); return false"
		action="emxCATRgnReportCreate.jsp">
		<%@include file = "../common/enoviaCSRFTokenInjection.inc"%>
		<input type="hidden" name="fromDialog" value="CreateDialog">
<% if (reportError ==null) { %>
	<% if (isSlideIn){ %>	
		<input name="targetLocation" value="<%=XSSUtil.encodeForHTMLAttribute(context, targetLocation)%>" type="hidden"/>
	<% } %>
	<% if (isEditMode){ %>	
		<input name="mode" value="<%=XSSUtil.encodeForHTMLAttribute(context, mode)%>" type="hidden"/>
		<%
		int inputIndice = 0;
		int nbTemplateParams;
		for(String name : inputValues.keySet()) {
			String inputFormOID = RGNUtil.InputId(inputIndice);
			String inputFormValue = RGNUtil.InputValue(inputIndice);
			String value = (String)inputValues.get(name);
			StringBuilder display = new StringBuilder();
			if ( value != null ) {
				value = value.replaceAll("<", "&lt;"); //html tag like structures are removed by emxGetParameter, so need protect opening character
				for (String id : RGNUtil.PIPE_SPLITTER.split(value)) {
					try{
						display.append(reportDataContainer.getBus(id).getDisplayWithType(i18nCtx)).append("\n");
					} catch (ObjectNotFoundException ignored) {
						display.append(id);
					}
				}
	%>
	<input name="<%=XSSUtil.encodeForHTMLAttribute(context, inputFormOID)%>" value="<%=XSSUtil.encodeForHTMLAttribute(context, value)%>" type="hidden"/>
	<input name="<%=XSSUtil.encodeForHTMLAttribute(context, inputFormValue)%>" value="<%=XSSUtil.encodeForHTMLAttribute(context, display.toString())%>" type="hidden"/>
<% 			} %>
<% 	 		inputIndice++; %>	
<% 		}
		try{
			nbTemplateParams = reportDataContainer.getTemplate(reportTemplateID).getParameters(reqInfo).length;
		} catch (ObjectNotFoundException e) {
			Logger.error(e.getMessage(), e);
			nbTemplateParams = inputIndice;
		}

%>	
		<input name="nbInputs" value="<%=XSSUtil.encodeForHTMLAttribute(context, String.valueOf(inputIndice))%>" type="hidden"/>
	<% } %>	
	<% if (objectId != null){ %>	
		<input name="objectId" value="<%=XSSUtil.encodeForHTMLAttribute(context, objectId)%>" type="hidden"/>
	<% } %>
	<% if (configId != null){ %>
		<input name="configId" value="<%=XSSUtil.encodeForHTMLAttribute(context, configId)%>" type="hidden"/>
	<% } %>
	<% if (filterView != null){ %>
		<input name="filterView" value="<%=XSSUtil.encodeForHTMLAttribute(context, filterView)%>" type="hidden"/>
	<% } %>
		<table class="form">
			<tbody>
				<tr><td class="createRequiredNotice"><%=XSSUtil.encodeForHTML(context, requiredNoticeNLS)%></td></tr>
				<tr>
					<td class="createLabelRequired">
						<label for="reportNameField"><%=XSSUtil.encodeForHTML(context,  nameLabel )%></label>
					</td>
				</tr>
				<tr>
					<td class="inputField">
						<input type="text" id="reportNameField" name="reportNameField" value="<% if (reportName != null) { %><%=XSSUtil.encodeForHTMLAttribute(context, reportName)%><% }; %>"
							size="25" onFocus="this.select()"/>	
					<% if (checkAutoName.equals("on")) {%>
						<input <% if (isEditMode) { %>type="hidden"<% } else { %>type="checkbox"<%} %> name="checkAutoName" onClick="switchAutoName()" checked />
					<%} else {%>
						<input <% if (isEditMode) { %>type="hidden"<% } else { %>type="checkbox"<%} %> name="checkAutoName" onClick="switchAutoName()" />
					<%}%>
					<% if (!isEditMode) { %>
						<label><%=XSSUtil.encodeForHTML(context,  autoNameLabel )%></label>
					<% } %>		
					</td>
				</tr>
				<% if (isEditMode) { %>
					<!--Revision Field -->
					<tr>
						<td class="label" width="150" align="left">
							<%=XSSUtil.encodeForHTML(context, reportRevisionLabel)%>
						</td>
					</tr>
					<tr>
						<td  class="inputField">
							<% if(reportRevision != null){ %><%=XSSUtil.encodeForHTML(context, reportRevision)%><% }; %>
						</td>
					</tr>
					<!--Type Field -->
					<tr>
						<td class="label" width="150" align="left">
							<%=XSSUtil.encodeForHTML(context, reportTypeLabel)%>
						</td>
					</tr>
					<tr>
						<td  class="inputField">
							<% if(reportType != null){ %><%=XSSUtil.encodeForHTML(context, reportType)%><% }; %>
						</td>
					</tr>
					<!--Policy Field -->
					<tr>
						<td class="label" width="150" align="left">
							<%=XSSUtil.encodeForHTML(context, reportPolicyLabel)%>
						</td>
					</tr>
					<tr>
						<td  class="inputField">
							<% if(reportType != null){ %><%=XSSUtil.encodeForHTML(context, reportPolicy)%><% }; %>
						</td>
					</tr>
					<% } %>
					<!--Title Field -->
				<tr>
					<td class="label">
						<label  for="reportTitleField"><%=XSSUtil.encodeForHTML(context,  titleLabel )%></label>
					</td>
				</tr>
				<tr>
					<td  class="field">
						<input type="text" id="reportTitleField" name="reportTitleField" size="20" value="<% if (reportTitle != null){ %><%=XSSUtil.encodeForHTMLAttribute(context, reportTitle)%><% }; %>"/>
					</td>
				</tr>
				<!--Description Field -->
				<tr>
					<td class="label">
						<label for="reportDescriptionField"><%=XSSUtil.encodeForHTML(context,  descrLabel )%></label>
					</td>
				</tr>
				<tr>
					<td class="field">
						<textarea cols="25" rows="5" id="reportDescriptionField" name="reportDescriptionField" onFocus="this.select()"><% if (reportDescription != null){ %><%=XSSUtil.encodeForHTML(context, reportDescription)%><% }; %></textarea>
					</td>
				</tr>
				<tr>
					<td class="labelRequired">
						<label for="reportmodel"><%=XSSUtil.encodeForHTML(context, reportModelLabel)%></label>
					</td>
				</tr>
				<tr>
					<td class="field">
						<input id="reportmodel" name="reportmodel" type="hidden" value="" />
						<input id="reportmodelDisplay" name="reportmodelDisplay" size="25" type="text"
							placeholder="<%=XSSUtil.encodeForHTMLAttribute(context, searchI18n)%>" 
							value="<%if (reportTemplateDisplay != null)%><%=XSSUtil.encodeForHTMLAttribute(context, reportTemplateDisplay)%>"
							title="<%if (reportTemplateDisplay != null)%><%=XSSUtil.encodeForHTMLAttribute(context, reportTemplateDisplay)%>"
							/>
						<input id="reportmodelOID" name="reportmodelOID" type="hidden"
							value="<%if (reportTemplateID != null) %><%=XSSUtil.encodeForHTMLAttribute(context, reportTemplateID)%>"/>
						<input id="reportmodelBtn" name="reportmodelBtn" type="button"
							onclick="rgnFullSearch('RGNReportModelSearchList', 'type_ReportModel', '*', '<%=XSSUtil.encodeForJavaScript(context, cancelNLS)%>', 'reportmodel', '<%=XSSUtil.encodeForJavaScript(context, invalidCharacters)%>')"
							value="..."/>
						<a onclick="clearField('reportmodel')"><%=XSSUtil.encodeForHTML(context, clearNLS)%></a>
					</td>
				</tr>
				<tr>
					<td class="labelRequired">
						<label for="reporttemplate"><%=XSSUtil.encodeForHTML(context, reportTemplateLabel)%></label>
					</td>
				</tr>
				<tr>
					<td class="field">
						<input id="reporttemplate" name="reporttemplate" type="hidden" value="" />
						<input id="reporttemplateDisplay" name="reporttemplateDisplay" size="25" type="text" placeholder="<%=XSSUtil.encodeForHTMLAttribute(context, searchI18n)%>" 
							value="<%if (reportOutputFormatDisplay != null) %><%=XSSUtil.encodeForHTMLAttribute(context, reportOutputFormatDisplay)%>"
							title="<%if (reportOutputFormatDisplay != null) %><%=XSSUtil.encodeForHTMLAttribute(context, reportOutputFormatDisplay)%>"
							/>
					<input id="reporttemplateOID" name="reporttemplateOID" type="hidden"
							value="<%if (reportOutputFormatID != null) %><%=XSSUtil.encodeForHTMLAttribute(context, reportOutputFormatID)%>"/>
						<input id="reporttemplateBtn" name="reporttemplateBtn" type="button"
							onclick="rgnFullSearch('RGNReportTemplateSearchList', 'type_ReportTemplate', '*', '<%=XSSUtil.encodeForJavaScript(context, cancelNLS)%>', 'reporttemplate', '<%=XSSUtil.encodeForJavaScript(context, invalidCharacters)%>')"
							value="..."/>
						<a onclick="clearField('reporttemplate')"><%=XSSUtil.encodeForHTML(context, clearNLS)%></a>
					</td>
				</tr>
				<tr>
					<td class="label">
						<label for="targetDocument"><%=XSSUtil.encodeForHTML(context, targetDocumentLabel)%></label>
					</td>
				</tr>
				<tr>
					<td class="field">
						<input id="targetDocument" name="targetDocument" type="hidden" value="" />
						<input id="targetDocumentDisplay" name="targetDocumentDisplay" size="25" type="text" placeholder="<%=XSSUtil.encodeForHTMLAttribute(context, searchI18n)%>" 
							value="<%if (targetDocumentDisplay != null) %><%=XSSUtil.encodeForHTMLAttribute(context, targetDocumentDisplay)%>"
							title="<%if (targetDocumentDisplay != null) %><%=XSSUtil.encodeForHTMLAttribute(context, targetDocumentDisplay)%>"
							/>
					<input id="targetDocumentOID" name="targetDocumentOID" type="hidden"
							value="<%if (targetDocumentID != null) %><%=XSSUtil.encodeForHTMLAttribute(context, targetDocumentID)%>"/>
						<input id="targetDocumentBtn" name="targetDocumentBtn" type="button"
							onclick="rgnFullSearch('AEFGeneralSearchResults', 'type_DOCUMENTS', '*', '<%=XSSUtil.encodeForJavaScript(context, cancelNLS)%>', 'targetDocument', '<%=XSSUtil.encodeForJavaScript(context, invalidCharacters)%>')"
							value="..."/>
						<a onclick="clearField('targetDocument')"><%=XSSUtil.encodeForHTML(context, clearNLS)%></a>
					</td>
				</tr>
			</tbody>
		</table>
<% } else { %>
	<%=XSSUtil.encodeForHTML(context,  reportError )%>
<% } %>
	</form>
</Body>

<%@include file="../emxUICommonEndOfPageInclude.inc"%>
