define('DS/ENOXPackageCommonUXInfra/ObjectHistory/utils/TDPParser', [

	'DS/ENOXPackageCommonUXInfra/ObjectHistory/utils/Parser',
	'DS/ENOXPackageCommonUXInfra/CommonUtils/CommonUtils',
	'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra'

	], function (Parser,Utils,NLS) {

	'use strict';

	let exports = Parser;

	let _CONSTANTS=exports._CONSTANTS;

	exports.checkForEvents=function(i,entry,line,tempSubEntries,parsed,data){

		let that=this;
		let returnObj={};
		switch (entry.action) {
		case _CONSTANTS.ACTIONS.CREATE:
		case _CONSTANTS.ACTIONS.PROMOTE:
		case _CONSTANTS.ACTIONS.DEMOTE:
		case _CONSTANTS.ACTIONS.MODIFY_STATE:
			returnObj=that.commonExecutionforMainRows(entry.action,data,i,line,tempSubEntries,entry,parsed);
			break;
		case _CONSTANTS.ACTIONS.MODIFY:
		case _CONSTANTS.ACTIONS.CONNECT:
		case _CONSTANTS.ACTIONS.DISCONNECT:
		returnObj=that.commonExecutionforMainRows(entry.action,data,i,line,tempSubEntries,entry,parsed);
			break;
		case "checkout":
			returnObj=that.commonExecutionforMainRows("checkout",data,i,line,tempSubEntries,entry,parsed);
			break;
		case "AllowToPublish":
			returnObj=that.commonExecutionforMainRows("AllowToPublish",data,i,line,tempSubEntries,entry,parsed);
			break;
		case "AutoSystemSetAllowToPublish":
			returnObj=that.commonExecutionforMainRows("AutoSystemSetAllowToPublish",data,i,line,tempSubEntries,entry,parsed);
			break;			
		case "contentReportModified":
		case "PublicationFileCreating":
		case "PublicationFileCreated":
		case "PublicationFileCreationFailed":
		returnObj=that.commonExecutionforMainRows("publicationUpdate",data,i,line,tempSubEntries,entry,parsed);
			break;
		default:
			line.content=Utils.escapeHtml(entry.description);
		tempSubEntries.push(line);
		returnObj= {i:i,entry:entry,line:line,tempSubEntries:tempSubEntries,parsed:parsed,data:data};
		}
		return returnObj;
	};

	exports.commonExecutionforMainRows=function (methodName,data,i,line,tempSubEntries,entry,parsed) {
		let that=this;
		line.content = that[methodName](entry, data, i);
		if(line.content[1]){
			i = line.content[1];
			line.content.splice(1, 1);	
		}
		line.subEntries = tempSubEntries;
		tempSubEntries = [];
		parsed.unshift(line);
		return {i:i,entry:entry,line:line,tempSubEntries:tempSubEntries,parsed:parsed,data:data};
	};
	exports.checkout=function (entry,data,i) {
		//let description=Utils.escapeHtml(data[i].description);
		let fileName =data[i].additionalParameters["fileName"];
		let downloadLabel=NLS.Downloaded?NLS.Downloaded:"Downloaded";
		let isLabel=NLS.history_is?NLS.history_is:"is";
		
		let mod = Utils.escapeHtml(fileName)+" "+ isLabel +" "+ '<span class="timeline-modified-operations">' + downloadLabel + '</span>';

		return [[mod],i];
	
	};
	exports.AllowToPublish=function (entry,data,i) {
		let description=Utils.escapeHtml(data[i].description);
		let alloToPublish=NLS.AllowToPublish?NLS.AllowToPublish:"Allow To Publish";
		let mod = Utils.escapeHtml(description)+" "+ '<span class="timeline-modified-operations">' + alloToPublish + '</span>';

		return [[mod],i];
	
	};
	exports.AutoSystemSetAllowToPublish=function (entry,data,i) {
		let description=Utils.escapeHtml(data[i].description);
		let mod = Utils.escapeHtml(description);
		return [[mod],i];
	};	
	exports.publicationUpdate=function (entry,data,i) {
		let description=Utils.escapeHtml(data[i].description);
		description=description.replaceAll("\n","<br>");
		return [[description],i];
	
	};

	return exports;
});
