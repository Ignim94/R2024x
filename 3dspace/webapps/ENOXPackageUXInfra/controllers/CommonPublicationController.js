//XSS_CHECKED
// global widget 
/*eslint no-shadow: "off"*/
/*eslint guard-for-in: "off"*/
define('DS/ENOXPackageUXInfra/controllers/CommonPublicationController',
    [
    	/*'DS/UIKIT/Mask',
    	'DS/ENOXPackageUXInfra/models/CommonPublication',
		'DS/ENOXPackageUXInfra/views/Publication/openPublication',
    	'DS/ENOXPackageUXInfra/helpers/CommonPublicationHelper',
    	'i18n!DS/ENOXPackageUXInfra/assets/nls/ENOXPackageUXInfra',
		'DS/ENOXPackageUXInfra/helpers/TDPCommonHelper'*/
    ],
    function(/*UIMask, PublicationModel,OpenPublication,PublicationHelper,NLS,TDPCommonHelper*/) {
        'use strict';
	/*
        let CommonPublicationController = function PublicationController() {
            this.model = new PublicationModel(this);
            this.helper = new PublicationHelper();
            this.commonhelper = new TDPCommonHelper();
		};

		 CommonPublicationController.prototype.open = function(options) {
    		let that = this;
			if(options.forInfo)
				UIMask.mask(options.detailsContainer, "opening publication");
    		else 
				UIMask.mask(widget.body,"opening publication");
    		options.id = options.data.params.id;
    		that.model.getPublication(options).then(function(respData){
    			
    		let pubRespData = that.helper.processData(respData.data[0]);
    				options.data.respParams = pubRespData.grid;

    		that.model.getContentReport(options).then((data) => {
							let view = new OpenPublication(that);
							options.contentReportData = data;
							view.render(options);
						});						
			}, function(){//respData - need logger integration to show error in logs
    			widget.notificationUtil.showError(NLS.error_getting_publication_details);
    		}).catch(function(){//error - need logger integration to show error in logs
    			widget.notificationUtil.showError(NLS.error_getting_publication_details);
    		}).finally(function(){
				if(options.forInfo)
					UIMask.unmask(options.detailsContainer, NLS.opening_publication);
    			else
					 UIMask.unmask(widget.body);
    		});
    	};
		
		return CommonPublicationController;*/

    });
