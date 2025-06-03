/* global widget */
define('DS/ENOXPackageManagement/views/Configuration/SettingsView',
		[
			'DS/ENOXPackageCommonUXInfra/PropertiesView/PropertiesView',
			'UWA/Core',
			'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
			'DS/ENOXPackageManagement/Constants/ENOXTDPConstants'
		 ],
		 function(PropertiesView,UWA, NLS,ENOXTDPConstants) {
	'use strict';

	let settingsView = function SettingsView(options) {
		this.options=options;
	};
	
	settingsView.prototype.render=function(options){
		let that = this;
		let fields = this.addPropertiesFields(options);
		fields = [...fields];
		
		let propertiesModel = new UWA.Class.Model({
			modifyAccess:'TRUE',
    		stateAccess:true,
    		fields:fields,
    		save:function(properties){
    			
				if(properties.requireProductFiles.selectedItems.length>0) {
					let postData = {
						data:{
							'PublicationFileRemovalDays':properties.PublicationFileRemovalDays.value+'',
							'autoFileRemoval':properties.autoFileRemoval.checkFlag+'',
							'packageContentLimit':properties.packageContentLimit.value+'',
							'TDP_ContentFileTypes': properties.requireProductFiles.selectedItems.map((item) => item.value).toString()
						}
	    			};
	    			options.controller.updateSettings(postData);
					that.propertiesView=undefined;
				}
				else {
					widget.notificationUtil.showError(NLS.configuration_file_types_mandatory_error);
				}
    		}
    	});
		
		let propertiesView = new PropertiesView({
			model:propertiesModel
		});
		that.propertiesView = propertiesView;
		return propertiesView.render();
	};
	
	settingsView.prototype.addPropertiesFields = function(options){
		
		let contentFileTypesData = [];
		let contentFileTypesRange = options.settingData.contentFileTypesRange.split(ENOXTDPConstants.COMMA);
		let selectedContentFileTypes = options.settingData.TDP_ContentFileTypes.split(ENOXTDPConstants.COMMA);
		contentFileTypesRange.forEach((item) => {
				contentFileTypesData.push({"value": item,"label": NLS[item]});
		});
		
		selectedContentFileTypes.forEach((selectedItem) => {
			contentFileTypesData.forEach((item) => {
				if(item.value === selectedItem)
				    item.selected = true;
			});
		});
   
		let fields = [
			{
				type: 'checkbox',
				name: 'autoFileRemoval',
				id:'checkbox',
            	label:NLS.Publication_File_Removal_Check,
				helperText: NLS.Auto_File_Removal_Helper_Text,
				checked:options.settingData.autoFileRemoval?options.settingData.autoFileRemoval.toLowerCase() === 'true':true
			},
			{
                type: 'integer',
                label: NLS.Publication_File_Removal_Days,
                name:'PublicationFileRemovalDays',
				helperText: NLS.File_Removal_Days_Helper_Text,
                disable:true,
                value:options.settingData.PublicationFileRemovalDays,
				displayStyle: "lite",
			    minValue: 30,
			    maxValue:90
			},
			{
                type: 'integer',
                label: NLS.Package_Content_Limit,
                name:'packageContentLimit',
				helperText: NLS.Content_Limit_Helper_Text,
                disable:true,
                value:options.settingData.packageContentLimit,
				displayStyle: "lite",
			    minValue: 1,
			    maxValue:20
			},
			{
                type: 'autocomplete',
                className: "src-multi-select-autocomplete",
                label: NLS.configuration_settings_product_required_files,
                name: 'requireProductFiles',
                multiSelect : true,
                showSuggestsOnFocus : true,
                floatingSuggestions : false,
                allowFreeInput : false,
				required: true,
                dataSet : {
        			'name' : 'Content Files Required Dataset',
        			'items' : contentFileTypesData
            	},
                placeholder: NLS.configuration_file_types_placeholder,
                disable: true,
                value: selectedContentFileTypes.sort()   
            }
			
		];
		return fields;
	};
	
	return settingsView;
});
