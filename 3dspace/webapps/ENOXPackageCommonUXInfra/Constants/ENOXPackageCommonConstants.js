//XSS_CHECKED
/* global UWA */
/*eslint no-template-curly-in-string: "off"*/
define('DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
		[
			'UWA/Class/Debug',
	        'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra'
		],
			function(UWADebug, NLS) {

	'use strict';

	var xSourcingConstants = UWA.Class.singleton(UWADebug,{
		
		//App names 
		MY_REQUEST_MANAGEMENT : "Component Request Management",
		REQUEST_MANAGEMENT_ADMINISTRATION : "Component Request Administration",
		SUPPLIER_ITEM_QUALIFICATION : "Supplier Item Qualification",
		QUALIFICATION_MANAGEMENT : "Qualification Management",
		//App Names end	

		//Search Exclude Queries
		EXCLUDE_MEI:"NOT([ds6w:kind]:\"ManufacturerEquivalentItemExtension\")",
		EXCLUDE_OBSOLETE: "NOT current:Obsolete",
		EXCLUDE_COMPLETE: "NOT current:Complete",
		EXCLUDE_ARCHIVE: "NOT current:Archive",
		EXCLUDE_INACTIVE: "NOT current:Inactive",
		EXCLUDE_QUALIFICATION_OBSOLETE : "NOT([ds6w:status]:\"SRC Qualification.Obsolete\")",
		//Search Exclude Queries
		
		//Search Queries
		QUERY_PERSON_OR_GROUP: "(([ds6w:type]:Person AND current:Active) OR [ds6w:type]:Group)",
		QUERY_PERSON_OR_GROUP_CLOUD: "(([ds6w:type]:Person AND current:Active) OR [ds6w:type]:\"foaf:Group\")",
		QUERY_ENG_ITEM_SEARCH: "(flattenedtaxonomies:\"types/VPMReference\" OR \"types/Product Record\") AND NOT([ds6w:kind]:\"ManufacturerEquivalentItemExtension\") AND NOT current:Inactive AND NOT current:Obsolete",
		//Search Queries

		//Extension Names
		MEI_EXTENSION:"ManufacturerEquivalentItemExtension",
		//Extension Names
		
		//Logical Operators
		AND:" AND ",
		OR: " OR ",
		NOT: " NOT ",
		TRUE: "TRUE",
		FALSE: "FALSE",
		//Logical Operators
		
		//Lazy loading chunk size
		lazy_load_chunk_size: 100,
		//Lazy loading chunk size
		
		//Char Limit
		LENGTHY_CHAR_LIMIT: 256,
		//Char Limit
				
		//Error Codes
		SESSSION_EXPIRED: 401,
		UNAUTHORISED_REQUEST: 403,
		//Error Codes

		//Types
		CLASS: "Class",
		LIBRARY: "Library",
		TYPE_PART_SUPPLY_FILE: "PartSupply File",
		TYPE_COMPANY:"Company",
		TYPE_DS6W_PART:"ds6w:Part",
		TYPE_FOAF_GROUP:"foaf:Group",
		TYPE_GENERAL_LIBRARY: "General Library",
		VPMREFERENCE:"VPMReference",
		DELFMIFUNCTIONREFERENCE:"DELFMIFUNCTIONREFERENCE",
		DELFMIFUNCTIONREFERENCE_QUERY:"\"types/CreateAssembly\" OR \"types/CreateKit\" OR \"types/CreateMaterial\" OR \"types/Provide\" OR \"types/ElementaryEndItem\" OR \"types/Fasten\" OR \"types/Installation\" OR \"types/ProcessContinuousCreateMaterial\" OR \"types/ProcessContinuousProvide\"",
		DELFMIFUNCTIONREFERENCE_TYPES: ["CreateAssembly", "CreateKit", "CreateMaterial", "Provide", "ElementaryEndItem", "Fasten", "Installation", "ProcessContinuousCreateMaterial", "ProcessContinuousProvide"],
		DELFMIFUNCTIONREFERENCE_TYPE_ICONS: {"CreateAssembly": "I_InsertCreateAssemblyProcess", "CreateKit": "I_InsertCreateKitProcess", "CreateMaterial": "I_InsertCreateMaterialProcess", "Provide": "I_InsertProvideProcess", "ElementaryEndItem": "I_InsertElementaryEndItemProcess", "Fasten": "I_InsertFastenProcess", "Installation": "I_InsertInstallProcess", "ProcessContinuousCreateMaterial": "I_InsertCreateMaterialProcessContinuous", "ProcessContinuousProvide": "I_InsertProvideProcessContinuous"},
		DELFMIFUNCTIONREFERENCE_PROVIDE_TYPES: ["Provide", "ProcessContinuousProvide"],
		DELFmiFunctionIdentifiedInstance: "DELFmiFunctionIdentifiedInstance",
		TYPE_SRC_ATTRIBUTEGROUP: "type_SRC_AttributeGroup",
		ATTRIBUTE_QUALIFICATION_PREFERRED: "attribute_SRCQUALIFICATION.Preferred",
		ATTRIBUTE_QUALIFICATION_APPROVED: "attribute_SRCQUALIFICATION.Approved",
		ATTRIBUTE_QUALIFICATION_COMMENTS: "attribute_SRCQUALIFICATION.Comments",
		ATTRIBUTE_CONTEXT_RESTRICTIONS: "attribute_SRCQUALIFICATION.Context_Restrictions",
		MEI_PROXY:"SRC Manufacturer Equivalent Item Proxy Item",
		MANUFACTURING_ITEM_PROXY:"SRC Manufacturing Item Proxy Item",
		MEI:"Manufacturer Equivalent Item",
		ENG_ITEM: "Engineering Item",
		ENG_ITEM_PROXY:"SRC Engineering Item Proxy Item",
		DOCUMENT:"Document",
		DOCUMENT_PROXY:"Document Proxy Item",
		TYPE_COMPONENT_REQUEST: "SRCComponentRequest",
		TYPE_PACKAGE_REQUEST: "SRCPackageRequest",
		COMPONENT_REQUEST: "Component Request",
		BOOKMARK: "Workspace",
		BOOKMARK_PROXY: "Project Vault Proxy Item",
		WORKSPACE_VAULT: "Workspace Vault",
		TYPE_PACKAGE: "Collaboration Package",
		TYPE_TDP_PACKAGE: "TDP_CollaborationPackage",
		TYPE_TDP_PUBLICATION: "TDP_PackagePublication",
		TYPE_PUBLICATION: "Package Publication",
		TYPE_REQUEST_TEMPLATE: "SRCRequestTemplate",
		TYPE_COMPONENT_REQUEST_TEMPLATE: "SRCComponentRequestTemplate",
		TYPE_QUALIFICATION: "SRCQUALIFICATION",
		QUALIFICATION: "Qualification",
		TYPE_SRC_GENERAL_QUALIFICATION: "SRC General Qualification",
		TYPE_SUPPLIERLINEITEM: "Supplier Line Item",//vbt1-start
		TYPE_SRC_SUPPLIER_LINE_ITEM: "Supplier Line Item",
		TYPE_RFX: "RFx Header", //Where this is being used?
		TYPE_SOURCE: "Source",
		TYPE_SRC_RFX: "RFx Header", //Where this is being used?
		TYPE_LINEITEM: "Line Item",
		TYPE_SRC_LINE_ITEM: "Line Item",
		TYPE_QUOTATION: "RFx Response Header",
		TYPE_SRC_QUOTATION: "RFx Response Header",//vbt1-end
		TYPE_QUALIFICATION_LIST: ["SRC General Qualification","SRC Engineering Equivalent Qualification","SRC Usage Qualification","SRC Manufacturing Equivalent Qualification"],
		TYPE_PROJECT_SPACE : "Project Space",
		TYPE_PROJECT_SPACE_ITEM_PROXY: "Project Proxy Item",
		TYPE_PLANT_ITEM_PROXY: "Plant Proxy Item",
		TYPE_PLANT:"Plant",
		TYPE_PERSON:"Person",
		TYPE_GROUP:"Group",
		TYPE_GROUP_PROXY:"Group Proxy",
		TYPE_MODEL:"Model",
		TYPE_MODEL_VERSION:"Products",
		TYPE_MODEL_PROXY:"Model Proxy Item",
		TYPE_MODEL_VERSION_PROXY:"Model Version Proxy Item",
		TYPE_QUALIFIED_ITEM_PROXY: "Qualified Item Proxy Item",
		TYPE_ROUTE_TEMPLATE:"Route Template",
		TYPE_CONTEXT_RFX: "SRC_RFx",
		DRAWING: "Drawing",
		REQUIREMENT_SPECIFICATION : "Requirement Specification",
		//Types

        SYMBOLIC_TYPE_SRC_EQUIVALENT_QUALIFICATION: "type_SRCEquivalentQualification",
        SYMBOLIC_TYPE_SRC_MANUFACTURING_EQUIVALENT_QUALIFICATION: "type_SRCManufacturingEquivalentQualification",
        SYMBOLIC_TYPE_SRC_Usage_QUALIFICATION: "type_SRCUsageQualification",
        
		//Lifecycle States
		STATE_IN_DRAFT:"In Draft",
		STATE_IN_WORK: "In Work",
		STATE_SUBMITTED:"Submitted",
		STATE_EVALUATION:"Evaluation",
		STATE_EVALUATION_REVIEW:"Evaluation Review",
		STATE_EVALUATIONREVIEW: "Evaluation Review",
		STATE_IMPLEMENTATION_REVIEW:"Implementation Review",
		STATE_IMPLEMENTATION:"Implementation",
		STATE_NEED_FOR_CLARIFICATION:"Needs Clarification",
		STATE_COMPLETED:"Completed",
		STATE_INWORK:"In Work",
		STATE_ACTIVE:"Active",
		STATE_PREPAREPACKAGE:"Prepare Package",
		STATE_APPROVEPACKAGE:"Approve Package",
		STATE_GENERATEPUBLICATION:"Generate Publication",
		STATE_COMPONENTIDENTIFICATION: "Component Identification",
		STATE_COMPONENTCONFIRMATION: "Component Confirmation",
		STATE_COMPONENTQUALIFICATION: "Component Qualification",
		STATE_IMPACTIDENTIFICATION: "Impact Identification",
		STATE_IMPACTMITIGATIONPROPOSAL: "Impact Mitigation Proposal",
		STATE_FINALREVIEW: "Final Review",
		STATE_IMPACTREVIEW: "Impact Review",
		STATE_CLOSED: "Closed",
		//Lifecycle States
		
		//Generic Items
		PRIVATE_ASSIGNMENT:"<<"+NLS.private_assignment+">>",//If changing the brackets then please change for backend as well for history component
		ONPREMISE:"OnPremise",
		SOURCE_3DSPACE:"3dspace",
		SOURCE_USERGROUPS: "usersgroup",
		SOURCE_3DPLAN:"3dplan",
		DSPLAN_PROJECT : "dsplan:Project",
		//Generic Items
		
		//Platform Services
		SERVICE_3DSPACE:"3DSpace",
		SERVICE_3DNETWORK:"3dnetwork",
		SERVICE_3DDASHBOARD:"3DDashboard",
		SERVICE_PART_SUPPLY:"partsupply",
		//Platform Services
	
		//validations
		DELETE_LIMIT:"100",
		AG_ATTRIBUTES_ADD_LIMIT:"10",//This number to be in sync with what is there in back-end common property file
		AG_ATTRIBUTE_GROUPS_LIMIT:"100",
		//validations
		
		//REGEX
		ALPHA_NUM_UNDSCR_SPACE: /^[a-zA-Z0-9_\s]+$/,
		ALPHA_NUM_UNDSCR_SPACE_HYPHEN: /^[a-zA-Z0-9-_\s]+$/i,
		INVALID_NAME:/^name$/i,
		//REGEX
		
		//Sourcing application APs
		SOURCING_APPLICATIONS_IDs: ["ENXSPIC_AP","ENXCRMC_AP","ENXNCRQ_AP"],
		//Sourcing application APs

		//6W Pre-Defined Tags
		TAGGER_MEI: [
			{
				dataKey : "state",
				displayName : NLS.maturity_state,
				ds6wClass: "what"
			},{
				dataKey : "organization",
				displayName : NLS.manufacturer, 
				ds6wClass: "who"
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
			},{
				dataKey : "isLastVersion",
				displayName : NLS.isLast,
				ds6wClass: "when"
			}
		],
		TAGGER_COMPONENT_REQUEST: [
			{
				dataKey : "maturityStateDisplay",
				displayName : NLS.maturity_state,
				ds6wClass: "what"
			},{
				dataKey : "requestCategory",
				displayName : NLS.request_category,
				ds6wClass: "what"
			},{
				dataKey : "componentCategory",
				displayName : NLS.category_classification,
				ds6wClass: "what"
			},{
				dataKey : "requestTemplate",
				displayName : NLS.request_template,
				ds6wClass: "what"
			},{
				dataKey : "requestAssignee",
				displayName : NLS.request_assignee,
				ds6wClass: "who"
			},{
				dataKey : "dueDateDisplay",
				displayName : NLS.due_date,
				isDate : true,
				ds6wClass: "when"
			},{
				dataKey : "created",
				displayName : NLS.originated,
				isDate : true,
				ds6wClass: "when"
			},{
				dataKey : "modified",
				displayName : NLS.modified,
				isDate : true,
				ds6wClass: "when"
			},{
				dataKey : "islast",
				displayName : NLS.isLast,
				ds6wClass: "when"
			}
		],
		TAGGER_QUALIFICATION: [
			{
				dataKey : "qualificationMaturityDisplay",
				displayName : NLS.maturity_state,
				ds6wClass: "what"
			},{
				dataKey : "manufacturer",
				displayName : NLS.manufacturer,
				ds6wClass: "who"
			},{
				dataKey : "preferredDisplay",
				displayName : NLS.preferred,
				ds6wClass: "what"
			},{
				dataKey : "created",
				displayName : NLS.originated,
				isDate : true,
				ds6wClass: "when"
			},{
				dataKey : "modified",
				displayName : NLS.modified,
				isDate : true,
				ds6wClass: "when"
			}
		],
		TAGGER_ATTRIBUTEGROUP: [
			{
				dataKey : "level",
				displayName : NLS.level,
				ds6wClass: "what"
			}
		],
		//6W Pre-Defined Tags
		//Search selectors
		TEMPLATE_REQUEST_CATEGORY_6W: "[ds6w:templateRequestCategory]",
		ISLASTREVISION: "[ds6w:isLastRevision]",
		TEMPLATE_COMPONENT_CATEGORY_6W: "[ds6w:templateComponentCategory]",
		REQUEST_CATEGORY: "bo.srcRequestTemplate.RequestCategory",
		CURRENT: "current",
		CONTEXT_ITEM: "bo.srcQualification.ENGINEERING_ITEM",
		MEI_ITEM: "bo.srcQualification.MEI",
		PREREQ_ITEM: "bo.srcQualification.PREREQ",
		USAGE_QUALIFICATION_CONTEXT: "bo.srcQualification.USAGE_CONTEXT_ID",
		UTILITY_PREDICATE_SELECTORS: [
				"ds6w:label",
				"physicalid",
				"name",
					"ds6w:description",
				"ds6w:identifier",
				"ds6w:created",
				"ds6w:modified",
				"ds6w:responsible",
				"ds6w:responsibleUid",
				"ds6w:project",
				"ds6w:dataSource",
				"ds6w:community",
				"ds6wg:EnterpriseExtension.V_PartNumber",
				"bo.ManufacturerEquivalentItemExtension.ManufacturerName",
				"ds6wg:ManufacturerEquivalentItemExtension.ManufacturerPartNumber",
				"ds6wg:ManufacturerEquivalentItemExtension.ManufacturerName",
				"ds6wg:ManufacturerEquivalentItemExtension.ManufacturerTitle",
				"ds6wg:revision",
				"ds6w:what/ds6w:status",
				//"EXC_PROTECTION_EXISTS",
				"ds6w:ipSecurityClass",
				"ds6w:status",
				"partnumber",
				"ds6w:type",
				"organization",
				"bo.srcQualification.MEI",
				"bo.srcQualification.ENGINEERING_ITEM",
				"bo.srcQualification.PREREQ",
				"bo.srcQualification.Preferred",
				"bo.srcQualification.Approved",
				"bo.srcQualification.Comments",
				"bo.srcQualification.IsOrderable",
				"bo.srcQualification.USAGE_CONTEXT_ID",
				"owner"
		   ],
		UTILITY_FILE_SELECTORS: [
		 						"icon",
								"thumbnail_2d"
		   ],
		NAVIGATE_QUERY_PAYLOAD: {
			  "label": "Navigate query",
			  "input_physical_ids": [],
			  "fileAttributes": [],
			  "version": 3,
			  "primitives": [
			    {
			      "navigate_to_sr": {
			        "id": 1,
			        "filter": {
			          "role": [
			            "52"
			          ],
			          "category": [
			            "7"
			          ]
			        },
			        "mode": "path"
			      },
			      "navigate_from_sr": {
			        "id": 2,
			        "mode": "ends",
			        "filter": {
			          "role": [
			            "52"
			          ],
			          "category": [
			            "7"
			          ]
			        }
			      }
			    },
			    {
			      "navigate_to_sr": {
			        "id": 3,
			        "filter": {
			          "role": [
			            "51"
			          ],
			          "category": [
			            "5"
			          ]
			        },
			        "mode": "path"
			      },
			      "navigate_from_sr": {
			        "id": 4,
			        "mode": "ends",
			        "filter": {
			          "role": [
			            "51"
			          ],
			          "category": [
			            "5"
			          ]
			        }
			      }
			    },
			    {
			      "navigate_to_sr": {
			        "id": 5,
			        "filter": {
			          "role": [
			            "150"
			          ],
			          "category": [
			            "7"
			          ]
			        },
			        "mode": "path"
			      },
			      "navigate_from_sr": {
			        "id": 6,
			        "mode": "ends",
			        "filter": {
			          "role": [
			            "150"
			          ],
			          "category": [
			            "7"
			          ]
			        }
			      }
			    },
			    {
			      "navigate_to_sr": {
			        "id": 7,
			        "filter": {
			          "role": [
			            "149"
			          ],
			          "category": [
			            "5"
			          ]
			        },
			        "mode": "path"
			      },
			      "navigate_from_sr": {
			        "id": 8,
			        "mode": "ends",
			        "filter": {
			          "role": [
			            "149"
			          ],
			          "category": [
			            "5"
			          ]
			        }
			      }
			    },
			    {
			      "navigate_to_sr": {
			        "id": 9,
			        "filter": {
			          "role": [
			            "447"
			          ],
			          "category": [
			            "9"
			          ]
			        },
			        "mode": "path"
			      },
			      "navigate_from_sr": {
			        "id": 10,
			        "mode": "ends",
			        "filter": {
			          "role": [
			            "447"
			          ],
			          "category": [
			            "9"
			          ]
			        }
			      }
			    },
			    {
			      "navigate_to_sr": {
			        "id": 11,
			        "filter": {
			          "role": [
			            "448"
			          ],
			          "category": [
			            "5"
			          ]
			        },
			        "mode": "path"
			      },
			      "navigate_from_sr": {
			        "id": 12,
			        "mode": "ends",
			        "filter": {
			          "role": [
			            "448"
			          ],
			          "category": [
			            "5"
			          ]
			        }
			      }
			    }
			  ],
			  "patterns": {
			    "scope_pathSR": [
			      {
			        "id": 2
			      },
			      {
			        "id": 3
			      }
			    ],
			    "scopeInverse_pathSR": [
			      {
			        "id": 4
			      },
			      {
			        "id": 1
			      }
			    ],
			    "resulting_pathSR": [
			      {
			        "id": 6
			      },
			      {
			        "id": 7
			      }
			    ],
			    "resultingInverse_pathSR": [
			      {
			        "id": 8
			      },
			      {
			        "id": 5
			      }
			    ]
			  },
			  "patternTypeFilters": {
			    "scope_pathSR": {
			      "typesToNotReturn": [
			        "PLMCoreInstance"
			      ],
			      "filterLinksOn": "elements"
			    },
			    "scopeInverse_pathSR": {
			      "typesToNotReturn": [
			        "PLMCoreInstance"
			      ],
			      "filterLinksOn": "elements"
			    },
			    "resulting_pathSR": {
			      "typesToNotReturn": [
			        "PLMCoreInstance"
			      ],
			      "filterLinksOn": "elements"
			    },
			    "resultingInverse_pathSR": {
			      "typesToNotReturn": [
			        "PLMCoreInstance"
			      ],
			      "filterLinksOn": "elements"
			    }
			  },
			  "attributes": [
			    "ds6w:label",
			    "current",
			    "ds6w:what/ds6w:type",
			    "name",
			    "bo.PLMEntity.V_discipline",
			    "bo.PLMEntity.V_description",
			    "revision",
			    "owner",
			    "physicalid",
			    "type",
			    "ro.plminstance.plm_externalid",
			    "from.physicalid",
			    "to.physicalid",
			    "ro.plminstance.v_treeorder",
			    "pathsr"
			  ]
		},
		CVSERVLET_EXPAND_QUERY: {
			  "label": "Expand Query",
			  "select_bo": [
			    "physicalid",
			    "type",
			    "name",
			    "ds6w:label",
			    "bo.PLMEntity.V_description",
			    "bo.PLMEntity.V_discipline",
			    "current",
			    "revision",
			    "owner",
			    "interface",
			    "organization",
			    "bo.PLMReference.V_isLastVersion",
			    "bo.CreateAssembly.V_NeedDedicatedSystem",
			    "bo.DELAsmProcessCanUseCnx.V_ResourcesQuantity",
			    "ds6w:what/ds6w:type",
			    "ds6w:kind",
			    "ds6w:manufacturable",
			    "bo.enterpriseextension.v_partnumber",
			    "ds6w:created",
			    "ds6w:modified",
			    "ds6w:responsible"
			  ],
			  "select_rel": [
			    "from.physicalid",
			    "to.physicalid"
			  ],
			  "select_ds6w_facet": [],
			  "compute_select_bo": [
				"icon",
				"thumbnail_2d"
			  ],
			  "locale": "us",
			  "lang": "en",
			  "select_unit": {},
			  "multi_root_physicalid": [],//Object ID goes here
			  "expand_iter": "1",
			  "no_type_filter_bo": [
			    "VPMCfgEffectivity"
			  ],
			  "no_type_filter_rel": []
		},
		//Search selectors
		SN_CATEGORY_LIBRARY: "categorylibrary",
		DND_PLATFORM_VALIDATION_EXCLUSIONS: ["X3DPSLY_AP"],
		COMPONENT_REQUEST_DETAILS_ROUTE:"home.ComponentRequestDetails",
		REQUEST_TEMPLATE_DETAILS_ROUTE:"home.RequestTemplateDetails",
		ENG_ITEM_DETAILS_PAGE_ROUTE :"home.OpenEngineeringItem",
		MFG_ITEM_DETAILS_PAGE_ROUTE :"home.OpenManufacturingItem",
		QUALIFICATION_DETAILS_PAGE_ROUTE :"home.OpenQualification",
		MEI_DETAILS_PAGE_ROUTE :"home.MEIDetails",
		SRC_SPECIFICATIOn_DOCMENT:"SRC Specification Document",
		REFERENCE_DOCUMENT:"Reference Document",
		PART_SUPPLY: "Part Supply",
		SRC_SOURCETYPE:"SRC_SourceType",
		COMMENTS :"comments",
		SRC_COMMENTS :"SRCREQUEST.Comments",
		REJECTED :"Rejected",
		CANCELLED :"Cancelled",
		RELEASED: "Released",
		OBSOLETE: "Obsolete",
		INACTIVE: "Inactive",
		REJECT :"reject",
		CANCEL :"cancel",
		APPROVE :"approve",
		CLOSE :"close",
		SUBMIT_CLARIFICATION:"submitClarification",
		MATURITY_STATE :"maturity_state",
		SUBMIT :"submit",
		CLASSIFICATION:"Classification",
		NOTIFY:"Notify",
		SOURCING_FORM_MAX_LIMIT:5,
		SOURCE_INFORMATION:"SRCComponentRequest.Source Information",
		CONTEXT_PROJECT:"SRCREQUEST.Context Project",
		CONTEXT_PROJECT_ID:"SRCREQUEST.Context Project_ID",
		CONTEXT_PRODUCT:"contextProduct",
		CONTEXT_PRODUCT_ID:"contextProduct_ID",
		CONTEXT_PLANT:"contextPlant",
		CONTEXT_PLANT_ID:"contextPlant_ID",
		CONTEXT_RFX:"contextRFx",
		CONTEXT_RFX_ID:"contextRFx_ID",
		COMPONENT_INTRODUCTION_REQUEST:"SRC Component Introduction Request",
		COMPONENT_INTRODUCTION_REQUEST_V1:"SRC Component Introduction Request V1",
		SOURCE_CHANGE_NOTIFICATION:"SRC Source Change Notification",
		SOURCE_CHANGE_NOTIFICATION_V1:"SRC Source Change Notification V1",
		NRESULTS_999 : 999,
		POLICY_DOCUMENT_RELEASE:"Document Release",
		POLICY_SRC_DOCUMENT:"SRC_Document",
		SRC_CLOSURE_COMMENTS :"SRCREQUEST.Closure Comments",
		SRC_COMPLETION_PREVIOUS_STATE:"SRCREQUEST.CompletionPreviousState",
		CONSTANT_ROUTE:"Route",
		SOURCE_EDITABLE_CR_STATES : ["In Draft", "Submitted", "Evaluation", "Implementation", "Needs Clarification", "Impact Identification","Impact Mitigation Proposal","Component Identification","Component Qualification" ],
		TYPE_SRCCOMPONENTREQUEST:"type_SRCComponentRequest",
		SRC_MANUFACTURER:"SRC Manufacturer",
		SRC_SUPPLIER_NAME:"SRC Supplier Name",
		SRC_PART_NUMBER:"SRC Part Number",
		SRC_MANUFACTURER_PART_NUMBER:"SRC Manufacturer Part Number",
		SRC_PART_SOURCE:"SRC Part Source",
		SRC_PART_SOURCE_URL:"SRC Part Source URL",
		Source_Index_Name_ReqTemp:"bo.srcRequestTemplate.Source",
		VALIDATION_LEVEL_SUB_STRING: "QM_Custo_Validation_Level",
		VALIDATION_LEVEL_COLUMN_NAME: "Validation_Level",
		TARGET : "target",
		CONTEXT : "context",
		PREREQ : "prereq",
		Qualification_Context_Allowed_Types: "Qualification_Context_Allowed_Types",
		Qualification_Target_Allowed_Types: "Qualification_Target_Allowed_Types",
		Qualification_Context_Details_View: "home.QualificationContextsDetailsView",
		Qualification_Target_Details_View: "home.QualificationTargetsDetailsView",
		PROXY_TYPE_TO_ACTUAL_MAPPER:{
			"SRC Manufacturer Equivalent Item Proxy Item": "VPMReference",
			"SRC Engineering Item Proxy Item": "VPMReference",
			"Project Proxy Item": "Project Space",
			"Model Proxy Item": "Model",
			"Document Proxy Item": "Document",
			"Project Vault Proxy Item": "Workspace Vault", //Bookmark
			"Project Vault Root Proxy Item": "Workspace"
		},
		SRC_REQUEST_TYPES: {
			TYPE_COMPONENT_REQUEST: "SRCComponentRequest",
			TYPE_PACKAGE_REQUEST: "SRCPackageRequest"
		},
		SRC_APPROVAL_STATES: {
			PACKAGE_REQUEST: "Approve Package",
			COMPONENT_REQUEST: "Evaluation Review"
		},
		QUALIFICATION_EXTENSION_ENDPOINTS: {
			 "ListApplicableExtensions":"/resources/v1/modeler/dssourcing/qualifications/interfaces?$type=${OBJECTTYPE}",
			 "GetAttachedExtensions":"/resources/v1/modeler/dssourcing/qualifications/${OBJECTID}",
			 "ApplyExtension":"/resources/v1/modeler/dssourcing/extensions/${OBJECTID}"
		},
		COMPONENTREQUEST_EXTENSION_ENDPOINTS: {
			 "ListApplicableExtensions":"/resources/v1/modeler/dssourcing/requestCategory?$include=category_attributes&exclude=request_category&type=${OBJECTTYPE}",
			 "GetAttachedExtensions":"/resources/v1/modeler/dssourcing/sourcingrequests/${OBJECTID}?$include=interface-details&exclude=request_category",
			 "ApplyExtension":"/resources/v1/modeler/dssourcing/extensions/${OBJECTID}"
		},
		MEI_EXTENSION_ENDPOINTS: {
			 "GetAttachedExtensions":"/resources/dictionary/object/interfaces?customerOnly=true&isRoleChecked=true",
			 "RemoveExtension":"/resources/dictionary/object/removeInterfaces"
		},
		ENOPAD_ENDPOINTS: {
			 "lwc_expand":"/resources/enopad/lwc/expand"
		},
		CVSERVLET_ENDPOINTS: {
			 "navigate":"/cvservlet/navigate?SecurityContext=${SECURITY_CONTEXT}",
			 "expand":"/cvservlet/expand"
		},
		/*MFG_ENDPOINTS: {
			 "expand":"/resources/dsmfg/private/V0/invoke/getDescendantsAndLinks"
		},*/
		REQUEST_CATEGORIES_ACTUAL:["SRC Component Introduction Request V1", "SRC Component Modification Request", "SRC Source Change Notification V1", "TDP_NewPackageRequest"],
		IN_PROCESS_TYPE_ACTIONS: {
			"GET_CHILDREN": "getChildren",
			"ADD_CHILDREN": "addChildren",
			"REMOVE_CHILDREN": "removeChildren"
		},
		FLATTENEDTAXONOMIES:"flattenedtaxonomies:",
		TYPEMODEL:"types/Model",
		TYPEMODELVERSION:"types/Products",
		GMTTIME : "@06:30:00:GMT",
		PROCUREMENT_INTENT_BUY: "buy",
		PROCUREMENT_INTENT_MAKE: "make",
		PROCUREMENT_INTENT_NONE: "none",
		PROCUREMENT_INTENT_MULTIPLE: "multiple",
		
		//REQUEST TEMPLATE - START
		RT_6W_XML_SERVICE_NAME: 'dssourcing.requestTemplateFields',
		ATTR_RT_REQUEST_CATEGORY: "SRCRequestTemplate.RequestCategory",
		ATTR_RT_IS_IMPACTED_ITEMS_REQUIRED: "SRCRequestTemplate.IsImpactedItemsRequired",
		ATTR_RT_HAS_ANSWER_ITEMS: "SRCRequestTemplate.SupportedAnswerItemTypes",
		ATTR_RT_SOURCE: "SRCRequestTemplate.Source",
		//REQUEST TEMPLATE - END
		
		//REQUEST - START
		REQ_6W_XML_SERVICE_NAME: 'dssourcing:requestFields',
		//REQUEST - END
			
		REQUEST_ADMIN_APPS_TYPES_CONFIG_PATHS: ["DS/ENOXComponentRequestManagement/config", "DS/ENOXPackageRequestManagement/config"],
		REQUEST_ADMIN_APPS_i18Ns: [{
			path: "DS/ENOXComponentRequestManagement/assets/nls/ENOXComponentRequestManagement",
			appName: "ENOXComponentRequestManagement"
		},{
			path: "DS/ENOXPackageRequestManagement/assets/nls/ENOXPackageRequestManagement",
			appName: "ENOXPackageRequestManagement"
		}],
		
		//Supplier Companies lazy load chunk size-start
		SUP_COMPANY_CHUNK_SIZE: 20,
		//Supplier Companies lazy load chunk size-end
		
		//Facets for Dashboard View
		FACETS: {
			current: 'ds6w:how/ds6w:completeness',
			assignee: 'ds6w:who/ds6w:assignee',
			requestCategory: 'ds6w:what/ds6w:requestCategory',
			componentCategory: 'ds6w:why/ds6w:fulfills/ds6w:fulfillsCategory/ds6w:templateComponentCategory',
			requestSubmitDate: 'ds6w:when/ds6w:requestSubmitDate',
			requestCloseDate: 'ds6w:when/ds6w:requestCloseDate'
		},
		
		//Publish event to Load Data in Enovia Properties Widget-start
		PUBLISH_TO_PROPERTY : "DS/PADUtils/PADCommandProxy/select",
		//Publish event to Load Data in Enovia Properties Widget-end
		
		//Qualification On-Cloud 6WTags - Start
		QUALIFICATION_CONTEXT : "_tag_implicit_ds6w:what/ds6w:qualificationContext",
		QUALIFICATION_TARGET : "_tag_implicit_ds6w:what/ds6w:qualificationTarget",
		QUALIFICATION_CONTEXT_TYPE : "_tag_implicit_ds6w:what/ds6w:qualificationContextType",
		QUALIFICATION_TARGET_TYPE : "_tag_implicit_ds6w:what/ds6w:qualificationTargetType"
		//Qualification On-Cloud 6WTags - End
	});

	return xSourcingConstants;
});
