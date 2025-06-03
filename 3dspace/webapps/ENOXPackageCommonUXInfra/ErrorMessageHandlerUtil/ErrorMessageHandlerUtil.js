define('DS/ENOXPackageCommonUXInfra/ErrorMessageHandlerUtil/ErrorMessageHandlerUtil',
	[], function(){
		'use strict';
		var ErrorMessageHandlerUtil = {
				getErrorMessage: function(respData, alternateErrMsg){
					var errorMsg = "";
					errorMsg = respData.internalError && ErrorMessageHandlerUtil.checkErrorMessage(respData.internalError) ? respData.internalError : (
							respData.report && respData.report[0].internalError && ErrorMessageHandlerUtil.checkErrorMessage(respData.report[0].internalError) ? 
									respData.report[0].internalError : (respData.error && ErrorMessageHandlerUtil.checkErrorMessage(respData.error) ? respData.error : (
											respData.report && respData.report[0].error && ErrorMessageHandlerUtil.checkErrorMessage(respData.report[0].error) ? respData.report[0].error : 
													alternateErrMsg ? alternateErrMsg : "Error")));
					return errorMsg;
				},
				checkErrorMessage: function(errorMsg) {
					var validMsg = 0;
					["java.lang","emxXRFQ"].forEach(val => {
						if(errorMsg.includes(val))
							validMsg++;
					});
					return (validMsg === 0);
				}
		};
		return ErrorMessageHandlerUtil;
});

