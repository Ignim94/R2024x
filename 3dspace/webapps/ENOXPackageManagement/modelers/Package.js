//XSS_CHECKED
/* global UWA */
define('DS/ENOXPackageManagement/modelers/Package',
    ['DS/ENOXPackageCommonUXInfra/service/ENOXTDPService'],
    function (ENOXSourcingService) {
        'use strict';

        //var _app = undefined;
        //var NLS = undefined;   --> commenting because this will be useful when we expand use of this modeler
        var Package = UWA.Class.singleton({
            init: function (options) {
                //_app = options.dataProvider.app;
                this.source = 'sourcing';
                //NLS = _app.i18nProvider;
                options.dataProvider.Package = this; //attach to dataProvider
                this._parent(options);
            },
            list: function (options) {
                options.source = this.source;
                options.endpoint = "/resources/v1/modeler/dstdp/packages";
                return ENOXSourcingService.getDataPromise(options);
            }
        });
        return Package;
    });
