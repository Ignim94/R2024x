define('DS/ENOXPackageCommonUXInfra/components/IDCardInfo/IDCardInfo', [
		 'UWA/Class/View',
		 'DS/Handlebars/Handlebars',
		 'text!DS/ENOXPackageCommonUXInfra/components/IDCardInfo/html/InfoSection.html',
		 'text!DS/ENOXPackageCommonUXInfra/components/IDCardInfo/html/AttributesPartial.html',
		 'css!DS/ENOXPackageCommonUXInfra/components/IDCardInfo/css/IDCardInfo.css'],
		function(View,Handlebars, InfoSection, AttributesPartial) {
    'use strict';

    var IDCardInfo = View.extend({
        className: 'id-card-info',

        setup: function(options) {
            this.template = Handlebars.compile(InfoSection);
          	Handlebars.registerPartial('ExtraAttributes', AttributesPartial);
            this.attributes = options.infoAttributes;
        },

        render: function() {
            var view = this.template({attributes: this.attributes});
            this.container.setHTML(view);
            return this.container;
        }
    });

    return IDCardInfo;
});
