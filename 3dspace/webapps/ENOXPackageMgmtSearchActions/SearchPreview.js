let loadmodules = ['ENOXPackageMgmtSearchActions'];

let regexprResult = /(^.*\/webapps\/)ENOXPackageMgmtSearchActions/.exec(require.toUrl('DS/ENOXPackageMgmtSearchActions'));
let baseUrl;
if (regexprResult && regexprResult.length === 2) {
    baseUrl = regexprResult[1];
    let configPath = {};
    loadmodules.forEach(function(module) {
        'use strict';
       	let lURL = require.toUrl('DS/' + module); 
        if (lURL.indexOf('sourcing/webapps') === -1) {
            configPath['DS/' + module] = baseUrl + module;
        }
    });
	require.config({
        paths: configPath
    });
}

define('DS/ENOXPackageMgmtSearchActions/SearchPreview', [
	'UWA/Core',
  	'DS/SNInfraUX/SearchPreviewContainer',
	'DS/ENOXPackageMgmtSearchActions/constants/SearchActionsConstants'
],
  	function (
	UWACore,
    SearchPreviewContainer,
	SearchActionsConstants
	) {

    'use strict';

    let PackageMgmtPreviewContainer = SearchPreviewContainer.extend({
            /**
             * Get the primary content to display in search preview (html elements)
             * @param {Object|Element} [options] - Options used to set some properties
             * @param {Object|searchmodel} [options.searchmodel] selected search model object
             * @param {String|widget_id} [options.widget_id] Search widget id
             * @param {Object|parentContainer} [options.parentContainer] container where the content was added
             * @param {Function|onComplete} [options.onComplete] function to call when succedded
             * @param {Function|onFailure} [options.onFailure] function to call when failed, if failed the default preview is managed by Search Team
             * @param {Function|onCusto} [options.onCusto] function to call when you want to manage layout
             *   informationUser = hide to hide user information
             *   layout = vertical to display vertically the zone defaut value
             *            horizontal to display horizontally the zone
             *   nopreview = visible to display the no preview available(20%)
             */
        getPrimaryContent: function (options) {

	        if (!UWACore.is(options) || !UWACore.is(options.searchmodel)) {
	          return;
	        }
	
			if(options.searchmodel.get("ds6w:type_value") && SearchActionsConstants.SEARCH_PREVIEW_MAPPER[options.searchmodel.get("ds6w:type_value")]){
				if (UWACore.is(options.onCusto, 'function')) {
		          let setting = { layout: 'horizontal' };
		          options.onCusto.call(null, setting);
		        }
				let requireModule = SearchActionsConstants.SEARCH_PREVIEW_MAPPER[options.searchmodel.get("ds6w:type_value")];	
				require([requireModule], function(searchPreviewHandler) {
					searchPreviewHandler(options);
				});	
			} 
			else{
				options.onFailure.call();
			}
		},
            /**
             * Dispose the preview and clean preview handles
             * @param {Object} options the options to used to dispose
             * @returns {void}
             */
         dispose: function() {
         }
	});
    return PackageMgmtPreviewContainer;
  }
);
