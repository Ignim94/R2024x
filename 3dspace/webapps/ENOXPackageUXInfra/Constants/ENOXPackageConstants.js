//XSS_CHECKED
/* global UWA */
define('DS/ENOXPackageUXInfra/Constants/ENOXPackageConstants',
		[
			'UWA/Class/Debug',
	        'i18n!DS/ENOXPackageUXInfra/assets/nls/ENOXPackageUXInfra'
		],
			function(UWADebug, NLS) {

	'use strict';

	let xPackageConstants = UWA.Class.singleton(UWADebug,{

		//Logical Operators
		AND:" AND ",
		OR: " OR ",
		NOT: " NOT ",
		//Logical Operators
		
		//Lazy loading chunk size
		lazy_load_chunk_size: 100,
		//Lazy loading chunk size
				
		//Error Codes
		SESSSION_EXPIRED: 401,
		UNAUTHORISED_REQUEST: 403,
		//Error Codes

		//Types
		VPMREFERENCE:"VPMReference",
		MEI_PROXY:"SRC Manufacturer Equivalent Item Proxy Item",
		MEI:"Manufacturer Equivalent Item",
		ENG_ITEM: "Engineering Item",
		ENG_ITEM_PROXY:"SRC Engineering Item Proxy Item",
		DOCUMENT:"Document",
		DOCUMENT_PROXY:"Document Proxy Item",
		TYPE_PERSON:"Person",
		TYPE_GROUP:"Group",
		TYPE_GROUP_PROXY:"Group Proxy",
		TYPE_EXPORT_CONTROL_CLASS:"Export Control Class",
		TDP_Publication : "TDP_PackagePublication",
		
		//Types

        
		//Lifecycle States
		
		//Lifecycle States
		
		//Generic Items
		PRIVATE_ASSIGNMENT:"<<"+NLS.private_assignment+">>",//If changing the brackets then please change for backend as well for history component
		ONPREMISE:"OnPremise",
		SOURCE_3DSPACE:"3dspace",
		SOURCE_USERGROUPS: "usersgroup",
		SOURCE_3DPLAN:"3dplan",
		DSPLAN_PROJECT : "dsplan:Project",
		Package_Request_Management : "Package Request Management",
		//Generic Items
		
		//Platform Services
		SERVICE_3DSPACE:"3DSpace",
		SERVICE_3DDASHBOARD:"3DDashboard",
		SERVICE_PART_SUPPLY:"partsupply",
		//Platform Services
	
		//validations
		DELETE_LIMIT:"100",
		AG_ATTRIBUTES_ADD_LIMIT:"50",//This number to be in sync with what is there in back-end common property file
		//validations
		
		//REGEX
		ALPHA_NUM_UNDSCR_SPACE: /^[a-zA-Z0-9_\s]+$/,
		ALPHA_NUM_UNDSCR_SPACE_HYPHEN: /^[a-zA-Z0-9-_\s]+$/i,
		//REGEX
		
		
		//6W Pre-Defined Tags
		TAGGER_TDP_PACKAGE: [
			{
				dataKey : "state",
				displayName : NLS.maturity_state,
				ds6wClass: "what"
			},{
				dataKey : "owner",
				displayName : NLS.owner,
				ds6wClass: "who"
			},{
				dataKey : "collabspace",
				displayName : NLS.collabspace,
				ds6wClass: "where"
			},{
				dataKey : "created",
				displayName : NLS.created,
				isDate : true,
				ds6wClass: "when"
			},{
				dataKey : "modified",
				displayName : NLS.modified,
				isDate : true,
				ds6wClass: "when"
			}
		],
		//6W Pre-Defined Tags
		//Search selectors
		FULFILLS_CATEGORY_6W: "[ds6w:fulfillsCategory]",
		CATEGORY_6W: "[ds6w:category]",
		CURRENT: "current",
		/*UTILITY_PREDICATE_SELECTORS: [
				"ds6w:label",
				"physicalid",
				"name",
				"ds6w:identifier",
				"ds6w:created",
				"ds6w:modified",
				"ds6w:responsible",
				"ds6w:responsibleUid",
				"ds6w:project",
				"ds6w:dataSource",
				"ds6w:community",
				"ds6wg:revision",
				"ds6w:what/ds6w:status",
				"ds6w:status",
				"partnumber",
				"ds6w:type",
				"organization",
				"owner"
		   ],
		UTILITY_FILE_SELECTORS: [
		 						"icon",
								"thumbnail_2d"
		   ],*/
		//Search selectors
		DND_PLATFORM_VALIDATION_EXCLUSIONS: ["X3DPSLY_AP"],
		REFERENCE_DOCUMENT:"Reference Document",
		PART_SUPPLY: "Part Supply",
		COMMENTS :"comments",
		REJECTED :"Rejected",
		CANCELLED :"Cancelled",
		RELEASED: "Released",
		OBSOLETE: "Obsolete",
		REJECT :"reject",
		CANCEL :"cancel",
		MATURITY_STATE :"maturity_state",
		SUBMIT :"submit",
		CLASSIFICATION:"Classification",
		NOTIFY:"Notify",
		SOURCING_FORM_MAX_LIMIT:5,
		NRESULTS_999 : 999,
		POLICY_DOCUMENT_RELEASE:"Document Release",
		download_publication_zip: "download_publication_zip",
		//IP and IP Export Control Selectors
		IP_PROTECTION_LIBRARY:"IP Protection Library",
		IP_EXPORT_CONTROL_LIBRARY:"IP Export Control Library",
		CONCEPTUAL_LEVEL:"Conceptual Level",
		DEVELOPMENTAL_LEVEL:"Developmental Level",
		PRODUCT_LEVEL:"Product Level",
		COMMERCIAL_LEVEL:"Commercial Level",
		COMMA:",",
		SPACE: " ",
		EMPTY_STRING:"",
		state_released: "Released",
		state_obsolete: "Obsolete"
		
	});

	return xPackageConstants;
});
