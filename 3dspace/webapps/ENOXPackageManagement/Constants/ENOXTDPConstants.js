/* global UWA */
define('DS/ENOXPackageManagement/Constants/ENOXTDPConstants',
		[
			'UWA/Class/Debug'
			],
		function(UWADebug) {
	'use strict';
	
	var ENOXTDPConstants = UWA.Class.singleton(UWADebug,{
		key_true:"TRUE",
		key_false:"FALSE",
		key_on: "on",
		key_yes: "Yes",
		key_no: "No",
		NOT_APPLICABLE: "Not Applicable",
		Not_Accessible: "Not  Accessible",
		  
		state_inWork: "In Work",
		state_inDraft: "In Draft",
		state_frozen: "Frozen",
		state_released: "Released",
		state_obsolete: "Obsolete",
		
		//File source
		DerivedOutput:"DerivedOutput",
	//6W Pre-Defined Tags
		
	//Comparison Constants
		EMPTY_LIST: "[]",
		EMPTY_STRING:"",
		generate_publication: "generate_publication",
		revise:"revise",
		Attachment: "Attachment",
		Specification: "Specification",
		download_publication_zip: "download_publication_zip",
		Type_Package: "TDP_CollaborationPackage",
		Type_Publication: "TDP_PackagePublication",
		Type_SRC_Attachment: "SRC Attachment",
		Format_Worksheet: "TDP_WorkSheet",
		
		COMMA:",",
		SPACE: " ",
		SUBSCRIBE:"Subscribe",
		UNSUBSCRIBE:"Unsubscribe",
		EDIT_SUBSCRIPTION:"EditSubscription",
		CONCEPTUAL_LEVEL:"Conceptual Level",
		DEVELOPMENTAL_LEVEL:"Developmental Level",
		PRODUCT_LEVEL:"Product Level",
		COMMERCIAL_LEVEL:"Commercial Level",
		
	//IP and IP Export Control Selectors
		IP_PROTECTION_LIBRARY:"IP Protection Library",
		IP_EXPORT_CONTROL_LIBRARY:"IP Export Control Library",
		IP_CLASS: "IP Control Class",
		SECURITY_CLASS: "Security Control Class",
		EXPORT_CLASS: "Export Control Class",
		
		
	//package content types
		VPMREFERENCE:"VPMReference",
		DOCUMENT:"Document",
		DRAWING: "Drawing",
		REQUIREMENT_SPECIFICATION: "Requirement Specification",
	//constants for old data
		DOT: ".",
		UNDERSCORE: "_",
		PHYSICAL_PRODUCT: "Physical Product",
		DOCUMENT_POLICY: "Document Release",
		ENGINEERING_ITEM_POLICY: "VPLM_SMB_Definition_MajorRev",
		ENGINEERING_ITEM_DRAFT: "Draft",
		ENGINEERING_ITEM_PRIVATE: "Private",
	
	// Admin context
		ADMIN_CONTEXT: "VPLMAdmin",
		
	// Attributes
		ATTRIBUTE_EFFECTIVITY_END_DATE: "Effectivity End Date",
		ATTRIBUTE_FILE_REMOVAL_DATE: "File Removal Date",
		ATTRIBUTE_EXPORT_FORMATS: "Export Formats",
		ATTRIBUTE_TDP_PACKAGE: "TDP Package",
		ATTRIBUTE_IS_PASSWORD_PROTECTED: "isPasswordProtected",
		ATTRIBUTE_CONTAINS_IP_DATA: "containsIPData",
		
	// Publication File removal limits
		PUBLICATION_FILE_REMOVAL_MIN_LIMIT: 31,
		PUBLICATION_FILE_REMOVAL_MAX_LIMIT: 90,
		
	//limits
		PUBLICATION_SIZE_LIMIT: 3221225472, // this is 3GB publication limit in bytes	
		
	// Services
	
		XCAD_PROCESSOR_SERVICE: "xcaddataprocessor",
		EVENT_PUBLISHING_SERVICE: "eventpublishing"
	});
	return ENOXTDPConstants;
});
