
define('DS/ENOXPackageCommonUXInfra/PropertiesView/PropertiesAccordeonView/AccordeonContent', [
    'UWA/Class/View'
], function (View) {

    'use strict';

    var propertiesAccordeon = View.extend({
        name: 'sourcing-accordeon-content-view',

        tagName: 'div',

        className: 'sourcing-accordeon-content',
		
        setup: function (options) {
        	var that=this;
        	that.container.set('id', "sourcing-accordeon-content-"+options.headerValue);
        },
		
        render: function () {
        	
        },
        
        addField:function(content){
        	var that=this;
        	content.inject(that.container);
        }
    });

    return propertiesAccordeon;
});
