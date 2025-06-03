<%-- CharacteristicMasterFormValidation.jsp

  Copyright (c) 1999-2020 Dassault Systemes.
  All Rights Reserved.
  This program contains proprietary and trade secret information
  of MatrixOne, Inc.  Copyright notice is precautionary only and
  does not evidence any actual or intended publication of such program
static const char RCSID[] = "$Id: ENOCriteriaUtil.jsp.rca 1.60 Wed Apr  2 16:23:14 2008 przemek Experimental przemek $";
--%>
<!-- @QuickReview : B1R -->
<%@page import="com.dassault_systemes.enovia.characteristic.util.CharacteristicMasterConstants"%>

<%@page import ="com.matrixone.apps.domain.util.EnoviaResourceBundle"%>

<%@include file="../common/emxNavigatorNoDocTypeInclude.inc"%>

<%@ page import = "com.matrixone.apps.framework.ui.UINavigatorUtil" %>
<%@page import="com.matrixone.apps.framework.ui.UIUtil"%>
<%@page import="com.dassault_systemes.enovia.criteria.util.CriteriaConstants"%>
<%@page	import="com.dassault_systemes.enovia.characteristic.interfaces.ENOCharacteristicFactory"%>
<%@page	import="com.dassault_systemes.enovia.characteristic.interfaces.ENOICharacteristicMaster"%>
<%@page import="com.matrixone.apps.domain.util.XSSUtil"%>

<%
    String objectId  = emxGetParameter(request, CriteriaConstants.OBJECT_ID);
    String mode = emxGetParameter(request, CriteriaConstants.MODE);
    String strDisplayUnit = "";
    if(CriteriaConstants.EDIT.equalsIgnoreCase(mode) && UIUtil.isNotNullAndNotEmpty(objectId)) {
        try {
            ENOICharacteristicMaster charMasterObj = ENOCharacteristicFactory.getCharacteristicMasterById(context, objectId);
            strDisplayUnit = charMasterObj.getDisplayUnit(context);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
%>
<script language="javascript" type="text/javascript">
	<!-- this file gets all the constants from enoCharacteristicMasterStringResource to be used by the validation methods-->
	<!-- XSSOK -->
	var notNumeric = "<%=EnoviaResourceBundle.getProperty(context,CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE,context.getLocale(),"CharacteristicMaster.Alert.NotNumeric")%>";
	<!-- XSSOK -->
	var nominalLesserThan = "<%=EnoviaResourceBundle.getProperty(context,CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE,context.getLocale(),"CharacteristicMaster.Alert.NominalLesserThan")%>";
	<!-- XSSOK -->
	var nominalGreaterThan = "<%=EnoviaResourceBundle.getProperty(context,CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE,context.getLocale(),"CharacteristicMaster.Alert.NominalGreaterThan")%>";
	<!-- XSSOK -->
	var minGreaterThanMax = "<%=EnoviaResourceBundle.getProperty(context,CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE,context.getLocale(),"CharacteristicMaster.Alert.MinGreaterThanMax")%>";
	<!-- XSSOK -->
	var minEqualToMax = "<%=EnoviaResourceBundle.getProperty(context,CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE,context.getLocale(),"CharacteristicMaster.Alert.MinEqualToMax")%>";
	<!-- XSSOK -->
	var nominalNotSet = "<%=EnoviaResourceBundle.getProperty(context,CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE,context.getLocale(),"CharacteristicMaster.Alert.NominalNotSet")%>";
	<!-- XSSOK -->
	var nominalNotPresentInAuth = "<%=EnoviaResourceBundle.getProperty(context,CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE,context.getLocale(),"CharacteristicMaster.Alert.NominalNotPresentInAuth")%>";
	<!-- XSSOK -->
	var authOutOfLimit = "<%=EnoviaResourceBundle.getProperty(context,CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE,context.getLocale(),"CharacteristicMaster.Alert.AuthOutOfLimit")%>";
	<!-- XSSOK -->
	var notNumeric="<%=EnoviaResourceBundle.getProperty(context,CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE,context.getLocale(),"CharacteristicMaster.Alert.NotNumeric")%>";
	<!-- XSSOK -->
	var MultiValNullAlert = "<%=EnoviaResourceBundle.getProperty(context,CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE,context.getLocale(),"CharacteristicMaster.Alert.MultiValNullAlert")%>";
	<!-- XSSOK -->
	var MultiValDuplicateAlert ="<%=EnoviaResourceBundle.getProperty(context,CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE,context.getLocale(),"CharacteristicMaster.Alert.MultiValDuplicateAlert")%>";
	<!-- XSSOK -->
	var LowerUpperLimitOutOfRangeAlert ="<%=EnoviaResourceBundle.getProperty(context,CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE,context.getLocale(),"CharacteristicMaster.Alert.LowerUpperLimitsOutOfRange")%>";
	<!-- XSSOK -->
	var included ="<%=EnoviaResourceBundle.getProperty(context,CharacteristicMasterConstants.CHARACTERISTIC_MASTER_STRING_RESOURCE,context.getLocale(),"CharacteristicMaster.Label.Included")%>";
    
    <!-- XSSOK -->
    var displayUnit_CM = "<%=strDisplayUnit%>";
    var mode_CM = "<%=XSSUtil.encodeForJavaScript(context,mode)%>";

<%@include file="scripts\CharacteristicMasterFormValidation.js"%>
</script>
