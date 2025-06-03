define('DS/ENOSpecMultiGrid/attributes/model/MultiGridAttrColumn',[
	'UWA/Core',
	'UWA/Class/Model',
	'DS/XSRCommonComponents/utils/Constants',
	'DS/ENOSpecMultiGridCommon/utils/SpecMultiGridUtil',
	'DS/ENOSpecMultiGridCommon/utils/SpecMultiGridBusinessUtil',
	'i18n!DS/ENOSpecMultiGrid/assets/nls/MultiGridAttribute', 
],function(UWA,
		Model,
		Constants,
		Utils,
		BusinessUtil,
		NLS){
	'use strict';
	
	
	var columns = Model.extend({
		getAttributeDefColDef:function(){;
	    	let nlsAttrHeader=NLS["label_Attribute"];	    	
	    	let attributeColDef= {
				"dataIndex": "tree",
				"text": nlsAttrHeader,
				"typeRepresentation": "textBlock",
				"pinned": "left",
				"width": 170,
				"editableFlag": false,
				"forbiddenCheck" : false,
				"allowUnsafeHTMLContent" : false,
				"autoRowHeightFlag" : false,
				"exportFlag" : true,
				"visibleFlag" : true
			}
	    	
	    	return attributeColDef;
        },
        getExtensionColumnConfig:function(){
        	let nlsExtHeader=NLS["label_Extension"];	    	
	    	let extensionColDef= {
				"dataIndex": "extensionDispName",
				"text": nlsExtHeader,
				"typeRepresentation": "string",
				"pinned": "left",
				"width": 130,
				"editableFlag": false,
				"forbiddenCheck" : false,
				"allowUnsafeHTMLContent" : false,
				"autoRowHeightFlag" : false,
				"exportFlag" : true,
				"visibleFlag" : false
			}
	    	return extensionColDef;
        },
        getDefaultColumnsConfig:function(){
        	let ctx=this;
        	let columnConfig=[];
            let attrDefColumnConfig=ctx.getAttributeDefColDef();
            columnConfig.push(attrDefColumnConfig);        	
            let extensionColumnConfig=ctx.getExtensionColumnConfig();
            columnConfig.push(extensionColumnConfig);
            return columnConfig;
        },
		getDynamicColumnConfig:function(itemModel){
			let ctx=this;
			let objDetails={
					id:itemModel.getID(),
					partNumber:itemModel.getPartNumber(),
					title:itemModel.getTitle(),
					revision:itemModel.getRevision(),
					state:itemModel.getCurrent()
			};
			let textToDisplay=itemModel.getPartNumber()?itemModel.getPartNumber():"";			   
			    textToDisplay=textToDisplay?(textToDisplay+" "+itemModel.getTitle()):itemModel.getTitle();
			    textToDisplay=textToDisplay+","+itemModel.getRevision()+" ("+itemModel.getCurrent()+" )";
           		textToDisplay=Utils.decode_entities(textToDisplay);	    
			let columnConfig={
				"dataIndex":itemModel.getID(),
				"text": textToDisplay,
				"objectDetails":objDetails,
				//"width": 100,
				"editableFlag": true,
				"forbiddenCheck" : false,
				"typeRepresentation": "textBlock",
				"allowUnsafeHTMLContent" : true,
				//"autoRowHeightFlag" : false,
				"exportFlag" : true,
				"visibleFlag" : true,
				"sortableFlag": false,
				"groupableFlag": false,  
				"massUpdateAllowedFlag":false
			}
			return columnConfig;
		},			
		setColumnText:function(objectDetails){
			let ctx=this;
			let textToDisplay=objectDetails.partNumber?objectDetails.partNumber:"";			   
		    textToDisplay=textToDisplay?(textToDisplay+" "+objectDetails.title):objectDetails.title;
		    textToDisplay=textToDisplay+","+objectDetails.revision+" ("+objectDetails.state+" )";
			textToDisplay=Utils.decode_entities(textToDisplay);
		    return textToDisplay;
		},
		process :function(columns){
			var that = this;
			
			if(columns) {
				columns.forEach(function(c){
					c.text = c.text;
					
					if(c.exportFlag !== false){
						that.exportableColumns.push(c.dataIndex);
					}
					
					if(c.editableFlag){
						c.getCellEditableState = function(cellInfos){
							let nodeModel = cellInfos.nodeModel;
							let colObjID=c.dataIndex;
							if(nodeModel&&colObjID){
								let attrReadOnlyKey=colObjID+"_readOnly";
								let objModifiableKey=colObjID+"_modifyAccess";
								let attrName=nodeModel.getName();								
								let isMultiValue=nodeModel.getDynamicColumnValue("multivalue"); 
								let nonEditableFields=attrName==Constants.ATTR_OWNER||attrName==Constants.ATTR_MATURITYSTATE||isMultiValue&&isMultiValue==true;
								let isattrReadOnly=nodeModel.getDynamicColumnValue(attrReadOnlyKey);
								let isColModifiable=nodeModel.getDynamicColumnValue(objModifiableKey);
								
								if(nonEditableFields){
									return false;
								}else if(!isattrReadOnly&&isColModifiable){
									return true;
								}else{
									return false;
								}								
							}

						};
					}
					c.getCellTooltip  = function(cellInfos){
                   		let rowIndex=cellInfos.rowID;
                   		let columnIndex=cellInfos.columnID;
                   		let nodeModel = cellInfos.nodeModel;
						let colObjID=c.dataIndex;
						let type=nodeModel?nodeModel.getType():undefined;
                   		 if(rowIndex==-1&&columnIndex>=2){
                   			return that.multiDataGrid.getCellDefaultTooltip(cellInfos);
                   		 }else if(rowIndex==-1&&columnIndex<2){
                   			 return  {shortHelp:c.text};
                   		 }else{
							if(nodeModel === undefined)
								return {shortHelp: ""};
 							let cellValue=nodeModel.getDynamicColumnValue(c.dataIndex);
                   			let isDateValue=BusinessUtil.isDateValue(c.dataIndex,nodeModel);
                   			let attrReadOnlyKey=nodeModel.getDynamicColumnValue(c.dataIndex+"_readOnly");
		    	            if(isDateValue){
		    	            	  return {shortHelp:Utils.getDataGridformatedDate(cellValue)};
		    	            }else if(type&&type=="boolean"&&cellValue&&cellValue.toUpperCase){
		    	            	if(cellValue.toUpperCase()=="TRUE"){
		    	            		return  {shortHelp:NLS.label_TRUE};
		    	            	}else if(cellValue.toUpperCase()=="FALSE"){
		    	            		return  {shortHelp:NLS.label_FALSE};
		    	            	}else{
										return {shortHelp:cellValue};
								}  
		    	            }else{
                   			 return {shortHelp:cellValue};
                   		    }
                   		 } 
                   	    };
					if("tree"!=c.dataIndex&&"extensionDispName"!=c.dataIndex){
						c.getCellTypeRepresentation = function(
								cellInfos) {
							var nodeModel = cellInfos.nodeModel;
							if (nodeModel) {
								return nodeModel.getTypeRepresentation(c.dataIndex);
							}
						};
						c.getCellSemantics = function(
								cellInfos) {
							var nodeModel = cellInfos.nodeModel;
							let cellValue=nodeModel.getDynamicColumnValue(c.dataIndex);
							let isDateValue=BusinessUtil.isDateValue(c.dataIndex,nodeModel);
		    	            if(isDateValue || (nodeModel.getTypeRepresentation(c.dataIndex)=='datetime')){//IR-1239986 - added or condition for date reset operation in multiedit
		    	            	return {
		    	         			"timePickerPrecision": "sec",
									"allowResetToUndefinedByUIFlag": "true"     //IR-1239986 - added for date reset operation in multiedit  
		    	         		  }
		    	            }
		    	            let rangeValues=nodeModel.getDynamicColumnValue("range");
		    	    		let rangeNLSValues=nodeModel.getDynamicColumnValue("rangeNLS");
		    	    		if(rangeValues){
		    	    		if(!rangeNLSValues){
		    	    			 return {possibleValues:rangeValues,value:cellValue,valueType:'enumString'};	
		    	    		}else{
		    	    			var customComboValues={};
		    	    			for(let i=0;i<rangeValues.length;i++){
		    	    				customComboValues[rangeNLSValues[i]]=rangeValues[i];
		    	    			}
		    	    			 return {possibleValues:customComboValues,value:customComboValues[cellValue],valueType:'enumCustom'};	                 
		    	    		 }
		    	    		}  
						}
						c.getCellValueForExport=function(cellInfos){
							var nodeModel = cellInfos.nodeModel;
							if (nodeModel) {      
								let cellValue=nodeModel.getDynamicColumnValue(c.dataIndex);
								let type=nodeModel?nodeModel.getType():undefined;
								let isDateValue=BusinessUtil.isDateValue(c.dataIndex,nodeModel);
								let attrReadOnlyKey=nodeModel.getDynamicColumnValue(c.dataIndex+"_readOnly");
			    	            if(isDateValue){
			    	            	  return Utils.getDataGridformatedDate(cellValue);
			    	            }else if(type&&type=="boolean"&&cellValue){
			    	            	if(cellValue.toUpperCase()=="TRUE"){
			    	            		return NLS.label_TRUE;
			    	            	}else if(cellValue.toUpperCase()=="FALSE"){
			    	            		return NLS.label_FALSE;
			    	            	}else{
										return cellValue;
									}	
			    	            }
			    	            else{
			    	            	  return cellValue;
			    	              }
							}
						}
						/*c.getCellTooltip  = function(cellInfos){
                   		let rowIndex=cellInfos.rowID;
                   		let columnIndex=cellInfos.columnID;
                   		let nodeModel = cellInfos.nodeModel;
						let colObjID=c.dataIndex;
						//let value=nodeModel.getDynamicColumnValue(colObjID);
                   		let columnConfig=that.multiDataGrid.getColumnOrGroup(cellInfos.columnID);
                   		let objDetails=columnConfig.objectDetails?columnConfig.objectDetails:undefined;
                   		 if(rowIndex==-1&&columnIndex>=1){
                   			 if(objDetails){
                   				let tooltip=objDetails.partNumber?objDetails.partNumber:"";
                   			    tooltip=tooltip?(tooltip+" "+objDetails.title):objDetails.title;
                 			    tooltip=tooltip+"\n"+objDetails.revision+" ("+objDetails.state+" )";
                 			    return  {shortHelp:tooltip};
                   			 }
                   		 }else if(rowIndex==-1&&columnIndex<1){
                   			 return  {shortHelp:c.text};
                   		 }else{
                   			 let value=nodeModel.getDynamicColumnValue(colObjID);
                   			 return {shortHelp:value};
                   		 }
                   	    };
						c.getCellValue = function(cellInfos){
							var nodeModel = cellInfos.nodeModel;
							if (nodeModel) {      
								let cellValue=nodeModel.getDynamicColumnValue(c.dataIndex);
								let type=nodeModel.getType();
								let cellValueType= typeof cellValue;
			    	            let isGMTDate=(cellValueType=="string")&&cellValue.endsWith(":GMT")&&(cellValue.indexOf("@")>-1);			    	          
								let isNotaNumber=isNaN(cellValue);
			    	              if(isGMTDate&&type=="string" && isNotaNumber && !isNaN(Date.parse(cellValue))){
			    	            	  return Utils.formatDate(cellValue,true);
			    	              }else{
			    	            	  return cellValue;
			    	              }
							}
						};*/
					}
				});
			}
		}
          
		
	});
	return columns;
});
