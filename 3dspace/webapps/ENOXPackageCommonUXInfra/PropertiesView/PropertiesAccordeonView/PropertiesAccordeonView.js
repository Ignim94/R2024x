//XSS_CHECKED
/* global UWA */
define('DS/ENOXPackageCommonUXInfra/PropertiesView/PropertiesAccordeonView/PropertiesAccordeonView', [
	'UWA/Class/View',
	
	'DS/Controls/Accordeon',
	
	'DS/ENOXPackageCommonUXInfra/PropertiesView/PropertiesAccordeonView/AccordeonContent',
	'css!DS/ENOXPackageCommonUXInfra/PropertiesView/PropertiesAccordeonView/PropertiesAccordeonView.css'
	
	], function (View,WUXAccordeon,AccordeonContent) {

	'use strict';

	var propertiesAccordeon = View.extend({
		name: 'sourcing-properties-accordeon-view',

		tagName: 'div',

		className: 'sourcing-properties-accordeon',
		
		
		
		setup: function () {
			
		},
		
		init: function (options) {
			var sanitizedOptions = UWA.clone(options, false);

			[   'id',
				'className',
				'tagName',
				'attributes',
				'domEvents'].forEach(function (propToDelete) {
					delete sanitizedOptions[propToDelete];
				});
			this._parent(sanitizedOptions);
			
			this.headerValueAndAccordeonContentMapping={};
			this.wuxAccordeon = new WUXAccordeon({
				items:[],
				style: "simple",
				exclusive:true
			});
		},

		render: function () {
			this.wuxAccordeon.inject(this.container);
			return this.container;
		},
		
		addField:function(fieldData,content){
			let accordeonHeaderValue=fieldData.accordeonHeader.value;
			let accordeonHeaderLabel=fieldData.accordeonHeader.label;
			
			let accordeonContent=this.headerValueAndAccordeonContentMapping[accordeonHeaderValue];
			if(!accordeonContent){
				accordeonContent=new AccordeonContent({headerValue:accordeonHeaderValue});
				let itemID=this.wuxAccordeon.addItem({header:accordeonHeaderLabel,content:accordeonContent.container});
				//expand the item as soon as it is added
				this.expandAccordeonItem(this.wuxAccordeon,itemID);
				this.headerValueAndAccordeonContentMapping[accordeonHeaderValue]=accordeonContent;
			}
			accordeonContent.addField(content);
			
		},
		
		_reset:function(){
			this.container.empty();
			this.headerValueAndAccordeonContentMapping={};
			this.wuxAccordeon = new WUXAccordeon({
				items:[],
				style: "simple",
				exclusive:false
			});
		},

		expandAccordeonItem:function(wuxAccordeon,itemID){
			let itemIndex=wuxAccordeon.getIndexFromId(itemID);
			wuxAccordeon.expandItem(itemIndex);
		}
		
		
	});

	return propertiesAccordeon;
});
