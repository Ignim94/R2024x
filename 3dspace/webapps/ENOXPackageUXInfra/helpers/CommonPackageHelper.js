/* global widget */
/*eslint no-shadow: "off"*/
define('DS/ENOXPackageUXInfra/helpers/CommonPackageHelper',
    ['i18n!DS/ENOXPackageUXInfra/assets/nls/ENOXPackageUXInfra'],
    function(NLS) {
        'use strict';

        let CommonPackageHelper = function PublicationHelper() {};
		
		CommonPackageHelper.prototype.handleMessage = function(msg) {
			let message = msg.toString();
			return message.length>200? msg.length+" "+NLS.content_small: message;
		};
		
		CommonPackageHelper.prototype.handleAttachContentSuccess = function(response) {
			if(response.data && response.data.length > 0){
				let data = response.data[0];
				let addedContent = data.contentAddedList.map((content) => content.title);
				let alreadyAddedContent = data.alreadyConnectedList.map((content) => content.title);
				let limitExceededContent = data.limitExceededList.map((content) => content.title);
				let typeUnsupportedList = data.typeUnsupportedList.map((content) => content.title);
				if(addedContent.length>0) {
					widget.notificationUtil.showSuccess(this.handleMessage(addedContent)+NLS.content_added_succesfully);
				}
				if(alreadyAddedContent.length>0) {
					widget.notificationUtil.showError(this.handleMessage(alreadyAddedContent)+NLS.content_add_duplicate_error);
				}
				if(limitExceededContent.length>0) {
					widget.notificationUtil.showError(this.handleMessage(limitExceededContent)+NLS.content_add_limit_error);
				}
				if(typeUnsupportedList.length>0) {
					widget.notificationUtil.showError(this.handleMessage(typeUnsupportedList)+" "+NLS.unsupported_type);
				}			
			}
		};
		
		CommonPackageHelper.prototype.handleDetachContentSuccess = function(response) {
			widget.notificationUtil.showSuccess("\"" + response["title"] + "\" "+NLS.content_removed);
		};
		
		CommonPackageHelper.prototype.handleUpdateContentFailure = function(response) {
			widget.notificationUtil.showError(response.internalError?response.internalError:(response.error?response.error:response));
		};

    	return CommonPackageHelper;
    });
