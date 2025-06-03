/**
 @requires UWA/Class/Promise
 @requires UWA/Core

 @requires DS/WAFData/WAFData

 @requires i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra
 **/
define('DS/ENOXPackageCommonUXInfra/ObjectHistory/utils/Parser', [
	'UWA/Class/Promise',
	'UWA/Core',

	'DS/WAFData/WAFData',
	
	'DS/ENOXPackageCommonUXInfra/CommonUtils/CommonUtils',

	'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra'
	], function (Promise, UWA, WAFData,Utils, NLS) {

	'use strict';

	var _CONSTANTS = {

			// Internal variables for the 5 Actions performed
			ACTIONS: {
				CREATE: 'create',
				CONNECT: 'connect',
				DISCONNECT: 'disconnect',
				PROMOTE: 'promote',
				DEMOTE: 'demote',
				MODIFY: 'modify'
				//MODIFY_STATE:'modifystate'
			}
	};

	var exports = {
        
			/**
			 * Takes in entry raw data from the REST Service, and returns data ready to be rendered by the timeline.
			 * @param {Array} data - Raw data.
			 * @param {Object} options - Options from the fetch.
			 * @return {Promise} - New data to be rendered.
			 */
			parse: function (data, options) {
				var that = this;
				return new Promise(function(resolve){

					that.objectTitle=options.objectTitle;
					that.activityMappingObject=options.activityMappingObject;

					var parsed = [];
					var tempSubEntries = [];

					// Here we want to parse the data to make them look better
					//Parse from newest to latest.
					for (var i = data.length - 1; i > -1; i--) {

						var entry = data[i];
						if (that.validEntryByAttribute(entry)) {
							var date = new Date(entry.date);

							// This represents one line in the timeline
							var line = {};
							line.date = that.getDay(date);
							line.action = entry.action;
							line.description = entry.description;
							line.state = entry.state;

							line.author = {
									user: entry.author.user,
									fullName: entry.author.fullName
							};

							line.content = entry.description;
							line.title = '';
							line.subEntries = [];

							let obj=that.checkForEvents(i,entry,line,tempSubEntries,parsed,data);
							i=obj.i; entry=obj.entry; line=obj.line; tempSubEntries=obj.tempSubEntries; parsed=obj.parsed; data=obj.data;
							
							if(i===0 && ![_CONSTANTS.ACTIONS.CREATE,_CONSTANTS.ACTIONS.PROMOTE,_CONSTANTS.ACTIONS.DEMOTE].includes(entry.action)){
								var lineDummy = {};
								lineDummy.isDummyRow =true;
								lineDummy.subEntries =tempSubEntries;
								parsed.unshift(lineDummy); 
							}
						}
					}
					resolve(parsed);
				});
			},

			checkForEvents: function (i,entry,line,tempSubEntries,parsed,data) {
				var that=this;
				switch (entry.action) {
				case _CONSTANTS.ACTIONS.CREATE:
				case _CONSTANTS.ACTIONS.PROMOTE:
				case _CONSTANTS.ACTIONS.DEMOTE:
				//case _CONSTANTS.ACTIONS.MODIFY_STATE:
					line.content = that[entry.action](entry);
					line.subEntries = tempSubEntries;
					tempSubEntries = [];
					parsed.unshift(line);
					break;
				case _CONSTANTS.ACTIONS.MODIFY:

					// Returned is  table with the sub cells content in 0
					// and the index we stop combining in 1
					var returned = that[entry.action](entry,data, i);
					i = returned[1];
					line.content = returned[0];
					if (line.content && line.content.length && line.content.length > 0) {
						tempSubEntries.push(line);
					}
					break;
				case _CONSTANTS.ACTIONS.CONNECT:
				case _CONSTANTS.ACTIONS.DISCONNECT:

					// Returned is  table with the sub cells content in 0
					// and the index we stop combining in 1
					returned = that[entry.action](entry,data, i);
					i = returned[1];
					line.content = returned[0];
					if (line.content && line.content.length && line.content.length > 0) {
						tempSubEntries.push(line);
					}
					break;
				default:
					line.content=Utils.escapeHtml(entry.description);
					tempSubEntries.push(line);
				}
			},
			/**
			 * Function to create the timeline row of action 'create'.
			 * @return {String} - Text for the creation of the object.
			 */
			create: function () {
				var that=this;
				let createdLabel=NLS.history_created?NLS.history_created:"is created";
				let createLogDescriptionDiv=UWA.createElement('div', {});
				createLogDescriptionDiv.innerText=that.objectTitle+" "+createdLabel;
				return createLogDescriptionDiv;
			},

			/*modifystate: function (entry) {
				let modifyStateDescriptionDiv=UWA.createElement('div', {});
				modifyStateDescriptionDiv.innerText=entry.description;
				return modifyStateDescriptionDiv;
			},*/

			/**
			 * Function to create the timeline row of action 'promote'.
			 * @param {Object} entry - Current entry being parsed.
			 * @return {String} - Text for promoting an object.
			 */
			promote: function (entry) {
				var that=this;
				var clientSideDescription="";
				if(NLS.history_promoted){
				    clientSideDescription=that.objectTitle+" "+NLS.replace(NLS.history_promoted, {
					    state: entry.state.bold()
				    });
				}
				var description=entry.description?entry.description:clientSideDescription;
				let promoteLogDescriptionDiv=UWA.createElement('div', {});
				promoteLogDescriptionDiv.innerText=description;
				return promoteLogDescriptionDiv;

			},

			/**
			 * Function to create the timeline row of action 'demote'.
			 * @param {Object} entry - Current entry being parsed.
			 * @return {String} - Text for demoting an object.
			 */
			demote: function (entry) {
				var that=this;
				var clientSideDescription=that.objectTitle+" "+NLS.replace(NLS.history_demoted, {
					state: entry.state.bold()
				});
				var description=entry.description?entry.description:clientSideDescription;
				let demoteLogDescriptionDiv=UWA.createElement('div', {});
				demoteLogDescriptionDiv.innerText=description;
				return demoteLogDescriptionDiv;
			},

			/**
			 * Function to create the timeline row of action 'connect' or 'disconnect'.
			 * @param {[null]} entry - The entry to be parsed.
			 * @param {[null]} data - The list of all the data being parsed.
			 * @param {int} i - The index of the current entry being parsed in data.
			 * @returns {[Array, number]} Returns the array of string and the last index check.
			 */
			connect: function (entry, data, i) {
				var that = this,
				j = i,
				createDisplayList = [];

				// Set the entry date
				var date = new Date(data[j].date),
				timestamp = date.getTime();
				var date2 = date,
				tempTime = timestamp,
				tempUser = data[j].author.user;

				// List of Modification combine
				var connectList = [];

				// Time combining data time 1min
				var delay = 60 * 1000;

				// Check while same user & date delay
				while (tempTime > timestamp - delay && (tempUser === data[i].author.user) &&
						j > -1 && (data[j].action === _CONSTANTS.ACTIONS.CONNECT || data[j].action === _CONSTANTS.ACTIONS.DISCONNECT)) {
					// Add modify value to the modify list
					if (data[j].description) {
						connectList.push('<li class= mod-li>' +that.getConnectContentMessage(data[j].additionalParameters,data[j].description,data[j].action) + '</li>');	//check for XSS nikhil
					}
					j--;

					// Check for the next value
					if (j > -1) {
						date2 = new Date(data[j].date);
						tempTime = date2.getTime();
						tempUser = data[j].author.user;
					}
				}
				// Check if there is modification in the list and add a message
				// and store list into data-list to be reveal on mouse over
				if (connectList.length > 0) {
					var descriptionElements="";
					var listStyle=connectList.length>1?"timeline-description-list-style":"";
					connectList.forEach(function(item){
						descriptionElements+=item;
					});
					var con='<span class="timeline-modified-operations '+listStyle+'">'+descriptionElements+'</span>';
					createDisplayList.push(con);
				}
				return ([createDisplayList, j + 1]);
			},

			getConnectContentMessage:function(additionalParameters,description,action){
				var that=this;
				var relationshipName="";
				var returnString="";
				var returnStringFunction="";
				var attributesMap=additionalParameters;
				
				relationshipName=attributesMap["relName"]?attributesMap["relName"]:"";
				try{
					returnStringFunction=that.activityMappingObject[action][relationshipName];
					if(typeof returnStringFunction==='function'){
						returnString=returnStringFunction(attributesMap);
					}
					if(!returnString)returnString="";
					returnString=returnString.replace("{title}",attributesMap["title"]);
					returnString=returnString.replace("{contextTitle}",that.objectTitle);
					if(!returnString || returnString==="")returnString=description;
				}catch(err){
					this.err=err;
					if(!returnString || returnString==="")returnString=description;
				}finally{
					if(!returnString)returnString=NLS.history_datamissing;
				}
				let escapedReturnString=Utils.escapeHtml(returnString);
				return escapedReturnString;
			},

			/**
			 * Function to create the timeline row of action 'connect' or 'disconnect'.
			 * @param {[null]} entry - The entry to be parsed.
			 * @param {[null]} data - list of all the data being parsed.
			 * @param {int} i - index of the current entry being parsed in data.
			 * @returns {[null,null]} - Return the array of string and the last index check.
			 */
			disconnect: function (entry, data, i) {
				var that = this;
				return (that.connect(entry, data, i));
			},

			/**
			 * Function to create the timeline row of action 'modify'.
			 * @param {[null]} entry - The entry to be parsed.
			 * @param {[null]} data - list of all the data being parsed.
			 * @param {int} i - index of the current entry being parsed in data.
			 * @param {object} attribute - All attributs used in the properties.
			 * @returns {[null,null]} - Return the array of string and the last index check.
			 */
			modify: function (entry, data, i) {
				var that = this,
				j = i,
				createDisplayList = [];

				// Set the entry date
				var date = new Date(data[j].date),
				timestamp = date.getTime();
				var date2 = date,
				tempTime = timestamp,
				tempUser = data[j].author.user;

				// List of Modification combine
				var modifyList = [];

				// Time combining data time 1min
				var delay = 60 * 1000;

				// Check while same user & date delay
				while (tempTime > timestamp - delay && (tempUser === data[i].author.user) &&
						j > -1 && data[j].action === _CONSTANTS.ACTIONS.MODIFY) {

					// Add modify value to the modify list
					if (data[j].description) {
						var getModify = that._getModify(data[j].description);
						if (getModify) {
							modifyList.push(Utils.escapeHtml('<li class= mod-li>' + getModify.join('') + '</li>'));
						}
					}
					j--;

					// Check for the next value
					if (j > -1) {
						date2 = new Date(data[j].date);
						tempTime = date2.getTime();
						tempUser = data[j].author.user;
					}
				}
				// Check if there is modification in the list and add a message
				// and store list into data-list to be reveal on mouse over
				if (modifyList.length > 0) {
					let isLabel=NLS.history_is?NLS.history_is:"is";
					let updatedLebel=NLS.history_updated?NLS.history_updated:"updated";

					var mod = Utils.escapeHtml(that.objectTitle)+" "+ isLabel + '<span class="timeline-modified-operations timeline-operations-tooltip" ' +
					'data-list="' + modifyList.join('') + '">' + updatedLebel + '</span>';
					createDisplayList.push(mod);
				}
				return [createDisplayList, j + 1];

			},

			/**
			 * Get the Modify field and value, delete the 'was' message.
			 * @param {String} description -  The modification message  you want to get the information from.
			 * @param {*} attribute - All the attribute field and they current nls that can be used.
			 * @returns {[String,String]} end - Return the field name + the field content.
			 * @private
			 */
			_getModify: function (description) {
				var mod = description.indexOf(':'),
				was = description.indexOf('was:'), //description as no was so we need to check.
				gmt = description.indexOf(':GMT'), //if it's a date
				field = '',
				end = ['Field', ' '];
				
				field = description.slice(0, mod).trim();
				
				if (was > -1) {
					// Check if it's a date
					if (gmt > -1) {
						end[0] = '<b>' + Utils.escapeHtml(field) + '</b>';
						end[1] = Utils.escapeHtml(description.slice(mod, gmt - 9).trim()) + '</br>';
					} else {
						end[0] = '<b>' + Utils.escapeHtml(field) + '</b>';
						end[1] = Utils.escapeHtml(description.slice(mod, was).trim()) + '</br>';
					}
				}
				if (field === 'description') {
					end[0] = '<b>'+NLS.history_description+'</b>';
					end[1] = Utils.escapeHtml(description.slice(mod, description.length).trim()) + '</br>';
				} 
				
				return end;
			},

			/*commonMethodforGrouping:function (entry,data,i,makeBoldArray,actionsToGroup,delayTime) {
							var j = i,
							createDisplayList = [];
			
							var actionDescriptionList = [];
			
							// Set the entry date
							var date = new Date(data[j].date),
							timestamp = date.getTime();
							var date2 = date,
							tempTime = timestamp,
							tempUser = data[j].author.user;
							var delay =delayTime?delayTime: 60 * 1000;
			
							while (tempTime > timestamp - delay && (tempUser === data[i].author.user) &&
									j > -1 && actionsToGroup.includes(data[j].action)) {
								if(data[j].description){
									let desc=Utils.escapeHtml(data[j].description);
									let additionalParameters=data[j].additionalParameters;
									makeBoldArray.forEach(function(parameter){
										let parameterValue=Utils.escapeHtml(additionalParameters?additionalParameters[parameter]:"");
										desc=desc.replaceAll(parameterValue,'<b>'+parameterValue+'</b>');
									});
									actionDescriptionList.push('<li class= mod-li>' +desc+ '</li>');
								}
								j--;
			
								// Check for the next value
								if (j > -1) {
									date2 = new Date(data[j].date);
									tempTime = date2.getTime();
									tempUser = data[j].author.user;
								}
							}
			
							if (actionDescriptionList.length > 0) {
								var descriptionElements="";
								var listStyle=actionDescriptionList.length>1?"timeline-description-list-style":"";
								actionDescriptionList.forEach(function(item){
									descriptionElements+=item;
								});
								var con='<span class="timeline-modified-operations '+listStyle+'">'+descriptionElements+'</span>';
								createDisplayList.push(con);
							}
			
							return ([createDisplayList, j + 1]);
						},*/


			/**
			 * Function to verify that the entry fetch from history have valid, not corrupt attributes.
			 * @param {Object} entry - Current entry being verified.
			 * @return {boolean} Returns true if all the attributes of the entry are valid.
			 */
			validEntryByAttribute: function (entry) {
				if (!entry) {
					return false;
				}

				if (!entry.hasOwnProperty('date') || UWA.is(entry.date, null) || !UWA.is(entry.date, 'string')) {
					return false;
				}

				if (!entry.hasOwnProperty('description')) {
					return false;
				}

				if (!entry.hasOwnProperty('action') || UWA.is(entry.action, null) || !UWA.is(entry.action, 'string')) {
					return false;
				}

				if (!entry.hasOwnProperty('state') || UWA.is(entry.state, null) || !UWA.is(entry.state, 'string')) {
					return false;
				}

				if (!entry.hasOwnProperty('author') || UWA.is(entry.state, null) || !UWA.is(entry.author, 'object')) {
					return false;
				}

				if (!entry.author.hasOwnProperty('user') || UWA.is(entry.author.user, null) ||
						!UWA.is(entry.author.user, 'string')) {
					return false;
				}

				if (!entry.author.hasOwnProperty('fullName') || UWA.is(entry.author.fullName, null) ||
						!UWA.is(entry.author.fullName, 'string')) {
					return false;
				}

				return true;
			},

			/**
			 * Get the current date.
			 * @param {Object} date - The date object.
			 * @return {string} Returns the locale date string.
			 */
			getDay: function (date) {
				return Utils.getDateStringForDisplay(date);
			}
	};
   exports._CONSTANTS=_CONSTANTS;
	return exports;
});
