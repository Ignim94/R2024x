/* global widget */
define('DS/ENOXPackageManagement/controllers/ConfigurationController',
    [
    	'DS/ENOXPackageManagement/models/Configuration',
		'DS/ENOXPackageManagement/views/Configuration/ConfigurationDetailsView',
		'DS/ENOXPackageManagement/helpers/ConfigurationHelper',
		'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement'
    ],
    function(ConfigurationModel,ConfigurationDetailsView,ConfigurationHelper,NLS) {
        'use strict';

        var ConfigurationController = function ConfigurationController(options) {
            this.model = new ConfigurationModel(this);
            this.view = new ConfigurationDetailsView();
			this.ConfigurationHelper = new ConfigurationHelper();
			this.options=options;
        };

	ConfigurationController.prototype.init =  async function(){
		let that = this;
		that.options.setting="configSettings";
		that.options.settingData = await that.model.getSettings({...that.options});
		that.options.attributeRanges = await that.model.getElementsRequired(that.options);
		that.view.render({'controller':that,...that.options});
	};
	ConfigurationController.prototype.updateSettings = function(data){
		var that = this;
		this.model.updateSettings({...this.options, 'addData':data}).then(function(){
			widget.notificationUtil.showSuccess(NLS.Setting_Updated);
			that.options.data=[];
			that.options.data.isRefresh=true;
			that.options.router.navigate('home.Configuration',that.options,{reload:true});
        });
	};
        return ConfigurationController;

    });
