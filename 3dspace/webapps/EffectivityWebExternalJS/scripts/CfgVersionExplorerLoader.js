(function () {})();

define('DS/EffectivityWebExternalJS/scripts/CfgVersionExplorerLoader', [], function (CfgVersionExplorerLoader) {
    'use strict';
    return CfgVersionExplorerLoader;
});
/*
@desc Version explorer creation global method
This method creates the VersionExplorerController.
*/

function VersionExplorerLoaderFactory(iId, iCallBackFn, iTenant, ibaseURL, iSecurityContext, iParent, iSelectedNode, iType, oVEObject) {
    require(['DS/ENOXVersionExplorerController/VersionExplorerController', 'DS/LifecycleServices/LifecycleServicesSettings', 'DS/UWPClientCode/I18n'], function (VersionExplorerController, LifecycleServicesSettings, I18n) {
        const cfgFacet = UWA.createElement('div', {
            styles: {
                height: '100%',
            },
        });
        // set template HTML for facet
        cfgFacet.inject(iParent);

        const versionExplorer =
            //create VE object collect for amd attrbiute filling
            (oVEObject.value = new VersionExplorerController({
                versionGraphContainer: null || cfgFacet,
            }));
        if (!window.widget) {
            window.widget = {};
            window.widget.lang = I18n.getCurrentLanguage();
        }
        const lifecycleSettings = [{ '3DSpace': ibaseURL, platformId: iTenant }];
        LifecycleServicesSettings.setOption('platform_services', lifecycleSettings);
        versionExplorer.setSingleSelectionMode(); //single selection mode
        versionExplorer.disableCommands(); //read only mode ENOXVersionExplorerLoadVersionModel

        versionExplorer.publishEvent('ENOXVersionExplorerLoadVersionModel', {
            id: iId,
            securityContext: iSecurityContext,
            tenantId: iTenant,
            type: iType,
            context: null,
            dataModelType: 6,
            onComplete: function () {
                iCallBackFn();
                console.log(iId);
                if (iSelectedNode && iSelectedNode.id) oVEObject.value.select(iSelectedNode.id);
            },
        });
    });
}
