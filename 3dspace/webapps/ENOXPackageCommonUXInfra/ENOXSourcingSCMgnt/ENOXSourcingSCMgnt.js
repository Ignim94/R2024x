/* eslint block-scoped-var: "off" ,no-redeclare :"off" */
//XSS_CHECKED
define('DS/ENOXPackageCommonUXInfra/ENOXSourcingSCMgnt/ENOXSourcingSCMgnt',  ['DS/WAFData/WAFData'] ,
        function (WAFData) {
    	
	'use strict';
	
	var CREDENTIALS_SEPARATOR = " ● ";
    var exports;
    
	exports =  function (options) {
	    //Local 
	    var _the3DSpaceUrl     = options.url ;	
		var _platformInstance  = options.platforminstance;
		var _theListSC = [] ;
		var _theListSC_NLS = [] ;
		var _SCPreferredDB ;
		var _callback ;
		
		// Function checking if a SC is one among the list coming
		// the backend.
		// Check called when the backend does not contain a preferred SC
		function checkValiditySC( compare ) {
			var find=false ;
			var i = 0 ;
			while ( ( !find  ) && (i < _theListSC.length) ) {
				if ( compare === _theListSC[i] ) {
					find = true ;
				}
				i++ ;
			}
			return find ;
	    } 
		
		function ComputeList (elt) {
		    var NoIssue = false ;
			
			var TheCBPreferred , TheRolePreferred, TheOrgPreferred ;
            var ThePreferredJson=elt.preferredcredentials;
			if ( ThePreferredJson.collabspace && 
			     ThePreferredJson.role && 
				 ThePreferredJson.organization ) {
				var TheCBPreferredJson=ThePreferredJson.collabspace;
				var TheRolePreferredJson=ThePreferredJson.role;
				var TheOrgPreferredJson=ThePreferredJson.organization;
				TheCBPreferred = TheCBPreferredJson.name;
				TheRolePreferred = TheRolePreferredJson.name;
				TheOrgPreferred = TheOrgPreferredJson.name;
				
				_SCPreferredDB = TheRolePreferred +"."+TheOrgPreferred+"."+TheCBPreferred; 
			}
			
		    var TheCollabSpacesArray = elt.collabspaces;
			if ( TheCollabSpacesArray && TheCollabSpacesArray.length > 0 ) {
				//check if multiorgaization
				var bMultiOrgnizationPresent = false;
				var currOrgName = undefined;
				for (var i = 0; i < TheCollabSpacesArray.length; i++) {
					var TheCurrentCSJson = TheCollabSpacesArray[i];
					var TheCouples = TheCurrentCSJson.couples || [];
					for (var j = 0; j < TheCouples.length; j++){
						var couple = TheCouples[j];
						if(currOrgName === undefined)
						currOrgName = couple.organization.name;
						if(currOrgName !== couple.organization.name) {
							bMultiOrgnizationPresent = true;
							break;
						}
					}

					if(bMultiOrgnizationPresent) break; //optimization
				}
				for (var i = 0; i < TheCollabSpacesArray.length; i++) {
					var TheCurrentCSJson = TheCollabSpacesArray[i];
					var TheCurrentCS=TheCurrentCSJson.name;
					var TheCurrentCSNLS=TheCurrentCSJson.title;
					var TheCouples = TheCurrentCSJson.couples;
					for (var j = 0; j < TheCouples.length; j++) {
						var  TheCurrentCoupleJson = TheCouples[j] ;
						var TheOrganization=TheCurrentCoupleJson.organization;
						var TheRole=TheCurrentCoupleJson.role;
						var TheCurrentOrg = TheOrganization.name;
						var TheCurrentRole = TheRole.name;
					    var TheCurrentRoleNLS = TheRole.nls;
						
						
						var SCCurrent=TheCurrentRole+"."+TheCurrentOrg+"."+TheCurrentCS ;
						// var SCCurrent_NLS= TheCurrentOrg+" - "+TheCurrentCS+" - "+TheCurrentRoleNLS ;
						var SCCurrent_NLS=  bMultiOrgnizationPresent ? TheCurrentCSNLS+ CREDENTIALS_SEPARATOR + 
								TheCurrentOrg + CREDENTIALS_SEPARATOR + TheCurrentRoleNLS :  TheCurrentCSNLS+  
								CREDENTIALS_SEPARATOR + TheCurrentRoleNLS  ;
						
						_theListSC.push(SCCurrent);
						_theListSC_NLS.push(SCCurrent_NLS);
						if ( _SCPreferredDB ) {
						    // at least one must be the preferred SC
							if ( (TheOrgPreferred === TheCurrentOrg)  && 
								 (TheRolePreferred === TheCurrentRole)  && 
								 (TheCBPreferred === TheCurrentCS)  ) {
								 NoIssue=true;
							}
						}else NoIssue=true;
					}
				}
			}
			_callback(NoIssue) ;
		}
		
		return {
			//
			// HTTP request to retrieve on 3DSpace the list of SC and its preferred one
			// for the connected user
			//
			RetrieveSCListAndPrefered : function ( option ) {
			    if ( option &&  option.callback ) {
					var pathWS=_the3DSpaceUrl + "/resources/modeler/pno/person?current=true";
                    pathWS += "&select=preferredcredentials&select=collabspaces" ;
                    // pathWS += "&select=collabspaces" ;
					pathWS +="&tenant=" + _platformInstance ;
					
					_callback = option.callback ;
				
					WAFData.authenticatedRequest(pathWS, {
						'method'    :'GET',	
						'type'     : 'json' ,
						'onComplete': ComputeList,	 					
						'onFailure' : function() { 
							_callback(false) ;
						}
					});	
                }					
			},
		
			//
			// Defines the current SC 
			//   The preferred from DB is choosen first ( implementative choice)
			//   otherwise if a previous one exist and still valid it is taken
			//   last choice : no SC, the end user will have to choose one before
			//   starting the application
			getSCPreference  : function ( NlsForPreference ) {
				
				var structure = {
					name: "SC",
					type: "list",
					label : NlsForPreference ,
					options: [] 
				} ;
				
				for ( var i=0 ; i < _theListSC.length ; i++ ) {
					// {value,label} both mandatory
					structure.options.push( { value : _theListSC[i] , label : _theListSC_NLS[i] } );
				}
				
				return structure ; 
			},
			
			//
			// Returns a valid current SC or undefined
			//
			getSCPreferred  : function ( theCurrentSC ) {
			    var returnValue;
				if ( _SCPreferredDB ) {
				    //The value from the db  is the first choice
					returnValue = _SCPreferredDB;
				} else { // no preferred SC in DB
					// is the previous current SC still valid ?
					if ( checkValiditySC(theCurrentSC) ) {
						returnValue = theCurrentSC ;
					}else {
						//console.error("no security context available ! ");
						// returnValue =  _theListSC[0];
						// request to choose a security context
						returnValue = null ;
					}
				}
				return returnValue ;
			}
		};
	} ;
    
    return exports;
});
