//XSS_CHECKED
/* global UWA */
define('DS/ENOXSourcingSearchActions/constants/ENOXSourcingSearchActionsConstants',
		['UWA/Class/Debug'],function(UWADebug) {

	'use strict';
	let xSourcingSearchActionsConstants = UWA.Class.singleton(UWADebug,{

		//type TDP_Publication
		TYPE_TDP_PUBLICATION : "TDP_Publication",
		TDP_PUBLICATION_SOURCEJS : "DS/TDPSearchActions/PublicationSearchActions"
		});

	return xSourcingSearchActionsConstants;
});
