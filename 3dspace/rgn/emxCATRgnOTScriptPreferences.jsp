<%@page contentType="text/html; charset=UTF-8"%> 
<%@page import="java.net.URLDecoder, com.dassault_systemes.catrgn.connector.interfaces.*,
		com.dassault_systemes.catrgn.connector.configuration.interfaces.*,
		com.dassault_systemes.catrgn.report.datamodel.*,
		com.dassault_systemes.catrgn.pervasive.server.*,
		com.dassault_systemes.catrgn.literals.OtsI18N,
		com.dassault_systemes.catrgn.literals.OtsI18N.Provider,
		com.dassault_systemes.catrgn.engine.report.generation.otscript.OtsI18nFactory,
        com.dassault_systemes.catrgn.engine.report.generation.otscript.OTScriptUtil,
        com.dassault_systemes.catrgn.engine.report.generation.otscript.OTScriptDataModel,
		com.dassault_systemes.catrgn.engine.report.generation.util.RGNUtil,
		com.dassault_systemes.catrgn.engine.report.generation.Generation,
		com.dassault_systemes.catrgn.engine.report.generation.Generation.OTScriptContext,
		com.dassault_systemes.catrgn.engine.report.generation.Generation.CustomOTScript,
		com.dassault_systemes.catrgn.otscript.startup.OtsStartup,
        com.dassault_systemes.catrgn.reportNav.services.CATRgnReportServices,
        com.dassault_systemes.catrgn.services.util.misc.RequestInfo,
        com.dassault_systemes.catrgn.services.util.preferences.PreferenceUtil,
        com.dassault_systemes.catrgn.services.util.nls.I18nServerContext,
        com.dassault_systemes.catrgn.pervasive.json.JsonUtil,
        com.dassault_systemes.catrgn.i18n.*,
        com.dassault_systemes.catrgn.pervasive.log.Logger"%>
    
    
<%@include file="../common/emxUIConstantsInclude.inc"%>
<%@include file="../emxUIFramesetUtil.inc"%>
<%@include file="../common/emxNavigatorTopErrorInclude.inc" %>
    
<%
    String lang = request.getHeader("Accept-Language");
    RequestNfo reqInfo = RequestInfo.newInstance(context, request, lang);
    I18nContext i18nCtx = new I18nServerContext(reqInfo);
    String filesLabel = I18nUtil.STR_FILES.get(i18nCtx);
    String dropFileHere = I18nUtil.STR_DROP_FILE_HERE.get(i18nCtx);
    String nameLabel = I18nUtil.STR_NAME.get(i18nCtx);
    String newLabel = I18nUtil.STR_NEW.get(i18nCtx);
    String saveLabel = I18nUtil.STR_SAVE.get(i18nCtx);
    String exportLabel = I18nUtil.STR_EXPORT.get(i18nCtx);
    String checkFilesLabel = I18nUtil.STR_CHECK_FILES.get(i18nCtx);
    String newMethodLabel = I18nUtil.STR_NEW_OTS_METHOD.get(i18nCtx);
    String checkingOTScript = I18nUtil.STR_CHECKING_OTSCRIPT.get(i18nCtx);
    String savingOTScript = I18nUtil.STR_SAVING_OTSCRIPT.get(i18nCtx);
    String nonAppropriateContextMessage =  I18nUtil.STR_NON_APPROPRIATE_CONTEXT.get(i18nCtx);
    String codePlaceholder = "METHOD <Type>.<Name> -doc : {\n\t//Code\n} CATEGORY \"<methodCategory>\"\nLABEL \"<methodDisplay>\"\nHELPTEXT \"<Tooltip information>\";";

    PreferenceUtil prefUtil = new PreferenceUtil(reqInfo);
    boolean isAdmin = prefUtil.isAdminRole;
    String saveRequest = emxGetParameter(request, "process");

    String otScriptPage = OTScriptUtil.RGN_OTSCRIPT;
    StringBuilder otscriptFilesBuilder = new StringBuilder();
    StringBuilder errorsBuilder = new StringBuilder();
    Map<String, String> fileMap = new LinkedHashMap();
    String jFileMap = "";
    if (isAdmin) {
        try {
            Map<String, String> map = OTScriptUtil.getOTScriptConfigurationFromPage(context, otScriptPage);
            int i = 0;
            for (String fileName : map.keySet()) {
                if (i++ > 0)
                    otscriptFilesBuilder.append(',');
                otscriptFilesBuilder.append(fileName);
                fileMap.put(
                    fileName.replaceAll("<","&#" + (int)'<' + ";").replaceAll(">","&#" + (int)'>' + ";"), 
                    map.get(fileName).replaceAll("'","&#" + (int)'\'' + ";"));
            }
            jFileMap = JsonUtil.getJson(fileMap);
        } catch (Throwable e) {
            errorsBuilder.append(e.getMessage());
            Logger.printStackTrace(e);
        }
    }
%>
    
<html>
    <head>
        <meta http-equiv="pragma" content="no-cache" />
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta charset="UTF-8">
	    <script language="javaScript" src="../common/scripts/emxUIConstants.js" type="text/javascript"></script>
        <link rel="stylesheet" type="text/css" href="./styles/emxRGNStyle.css">
        <link rel="stylesheet" type="text/css" href="../webapps/CodeMirror/lib/codemirror.css">
    </head>
	<body onload="turnOffProgress(); checkRole(<%=XSSUtil.encodeForJavaScript(context, String.valueOf(isAdmin))%>);initFileList('<%=XSSUtil.encodeForJavaScript(context, String.valueOf(jFileMap))%>', 'true'===<%=XSSUtil.encodeForJavaScript(context, saveRequest)%>)" onbeforeunload="turnOffProgress(); if (checkUnload()) return true; false;">
        <div id="pageHeadDiv" class="pageHead">
           <div id="nonAppropriateContext" style="display: none">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <p style="color: #CE0000; padding: 10px; font-style: italic"><%=XSSUtil.encodeForHTML(context, nonAppropriateContextMessage)%></p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div id="otsForm" style="display: none" >
               <form method="post" onsubmit="return false;" action="emxCATRgnOTScriptPreferences.jsp?process=true">
                    <%@include file = "../common/enoviaCSRFTokenInjection.inc"%>
                    <span class="ots-hidden" id="checkingOTScript"><%=XSSUtil.encodeForHTML(context, checkingOTScript)%></span>
                    <span class="ots-hidden" id="savingOTScript"><%=XSSUtil.encodeForHTML(context, savingOTScript)%></span>
                    <div class="ots-toolbar">
                        <input type="image" id="newLibrary" onclick="newOtsLibrary()" src="../common/images/iconActionCreate.png" title="<%=XSSUtil.encodeForHTMLAttribute(context, newLabel)%>"/>
                        <input type="image" id="saveLibrary" onclick="saveLibraries()" src="../webapps/CATRgnTemplateEditor/assets/reportmodeller/images/I_RGN_Save.png" disabled="true" title="<%=XSSUtil.encodeForHTMLAttribute(context, saveLabel)%>"/>
                        <input type="image" id="checkLibrary" onclick="checkLibraries()" src="../common/images/iconActionValidate.png" disabled="true" title="<%=XSSUtil.encodeForHTMLAttribute(context, checkFilesLabel)%>"/>
                    </div>
                    <div class="ots-toolbar ots-right">
                        <input type="image" id="exportSelection" onclick="exportSelection()" src="../common/images/iconActionCheckOut.png" disabled="true"  title="<%=XSSUtil.encodeForHTMLAttribute(context, exportLabel)%>"/>
                        <input type="image" id="methodPattern" onclick="insertPattern('method')" src="../common/images/iconActionAppend.png" disabled="true"  title="<%=XSSUtil.encodeForHTMLAttribute(context, newMethodLabel)%>"/>
                    </div>
                    <div style="height: 90%">
                        <div class="ots-main-layout">
                            <div class="ots-file-layout">
                                <ul id="fileList">
								</ul>
								<div class="ots-drop-zone">
									<%=XSSUtil.encodeForHTML(context, dropFileHere)%>
								</div>
                            </div>
                            <div class="ots-code-layout" id="codeLayout">
                            </div>
                        </div>
                        <div style="height: 10%">
                            <img id="waitingLoop" src="../webapps/CATRgnTemplateEditor/assets/reportmodeller/images/I_RGN_loading.gif" class="ots-hidden"/>
                            <div id="errorDisplay"></div>
                            <div class="invalid-drop-format ots-nok ots-hidden">
                            	Invalid drop format
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <script type="text/javascript" src="./scripts/emxRGNScript.js"></script>
        <script type="text/javascript" src="./scripts/emxRGNOTSPreferences.js"></script>
        <script type="text/javascript" src="../webapps/CodeMirror/lib/codemirror.js"></script>
        <script type="text/javascript" src="../webapps/CodeMirror/addon/mode/simple.js"></script>
        <script type="text/javascript" src="../webapps/CodeMirror/addon/display/placeholder.js"></script>
        <script type="text/javascript">
            var editor;
            // Define syntax (to put in a JS file)
            CodeMirror.defineSimpleMode("otscript", {
            start: [
                {regex: /"(?:[^"]|"["rlt])*"/, token: "string"},
                {regex: /`(?:[^`]|``)*`/, token: "variable-3"},
                {regex: /\b(?:CLASS|ATTRIBUTE|METHOD|TMP|THIS|EACH|IF|CATCH|RAISE|NEW|LABEL|HELPTEXT|CATEGORY|I18N)\b/, token: "keyword"},
                {regex: /-(?:doc)\b/, token: "meta"},
                {regex: /\b(?:TRUE|FALSE|VOID)\b/, token: "atom"},
                {regex: /[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i, token: "number"},
                {regex: /\/\/.*/, token: "comment"},
                {regex: /\/\*/, token: "comment", next: "comment"},
                {regex: /[-+\/*=<>:$]+/, token: "operator"},
                {regex: /[\{\[\(]/, indent: true},
                {regex: /[\}\]\)]/, dedent: true},
                {regex: /[a-z$][\w$]*/i, token: "variable-2"},
            ],
            // The multi-line comment state.
            comment: [
                {regex: /.*?\*\//, token: "comment", next: "start"},
                {regex: /.*/, token: "comment"}
            ],
            meta: {
                dontIndentStates: ["comment"],
                lineComment: "//"
            }
            });
            window.addEventListener('unload', function() {
                updateApplyDoneButtons(true);
            });
        </script>
	</body>
</html>


<%@include file = "../common/emxNavigatorBottomErrorInclude.inc"%>
