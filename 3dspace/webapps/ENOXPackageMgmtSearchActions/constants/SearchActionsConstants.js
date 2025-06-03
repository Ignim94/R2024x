//XSS_CHECKED
/* global UWA */
define('DS/ENOXPackageMgmtSearchActions/constants/SearchActionsConstants',
		['UWA/Class/Debug'],function(UWADebug) {

	'use strict';
	let xPackageMgmtSearchActionsConstants = UWA.Class.singleton(UWADebug,{

			DOWNLOAD : "download",
			BACKGROUND_JOB_COMPLETED : "Completed",
			BACKGROUND_JOB_STARTED : "Started",
			MESSAGE_LEVEL_INFO : "info",
			MESSAGE_LEVEL_ERROR : "error",
			COMMA : ",",
			SPACE : " ",
			SEARCH_PREVIEW_MAPPER : {
				"TDP_PackagePublication":"DS/ENOXPackageMgmtSearchActions/facets/PublicationContentReport"
			},
			//constants for old data
			DOT: ".",
			UNDERSCORE: "_",
			PHYSICAL_PRODUCT: "Physical Product",
			DOCUMENT_POLICY: "Document Release",
			ENGINEERING_ITEM_POLICY: "VPLM_SMB_Definition_MajorRev",
			VPMREFERENCE:"VPMReference",
			ENGINEERING_ITEM_DRAFT: "Draft",
			ENGINEERING_ITEM_PRIVATE: "Private"
		});
	return xPackageMgmtSearchActionsConstants;
});
