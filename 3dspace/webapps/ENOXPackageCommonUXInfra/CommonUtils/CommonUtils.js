/* global widget */
define('DS/ENOXPackageCommonUXInfra/CommonUtils/CommonUtils', ['UWA/Core',
    
    'DS/UIKIT/Tooltip',
    
    'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices'], function (UWA,Tooltip, ENOXSourcingPlatformServices) {

    'use strict';

     var exports = {
        
		escapeHtml: function (unsafe) {
			if(!unsafe)return unsafe;
			return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
		},
        
        getUserImage: function (user) {
        	var swymUrl =ENOXSourcingPlatformServices.getServiceURL("3DSwym");
          return require.toUrl(swymUrl+"/api/user/getpicture/login/"+user+"/format/normal");
        },
        
        getUserImageElement: function (user) {
        	var that = this;
        	var ownerImage ;
        	var iconUrl="" ;
        	that.tooltip=[];

        	try{
				var isOnPremise=ENOXSourcingPlatformServices.getPlatformId() === "OnPremise";
        		var isUserAgent=user.fullName?user.fullName.toLowerCase()==="user agent":user.user==="User Agent";

        		//get URL
        		try{
        			let swymImgURL=that.getUserImage(user.user);
        			iconUrl=swymImgURL?swymImgURL:"";
        		}catch(err){
        			iconUrl="";
        			this.imageRetrieveError=err;
        		}

        		var showSwymImageConditions=iconUrl !== "" && !isOnPremise && !isUserAgent; 

        		var cssClass = showSwymImageConditions? "" :"user-image-avatar";


        		//not blank if swym is installed
        		if(showSwymImageConditions){
        			ownerImage = UWA.createElement('img', {
        				'class': cssClass,
        				src: iconUrl
        			});
        			
        		}else{
        			var fullName = (typeof user.fullName !== "undefined") ? user.fullName : user ;
        			var userDetails = that.getAvatarDetails(fullName);
        			ownerImage = UWA.createElement('span', {
        				'class': cssClass,
        				'styles': { "background" : userDetails.avatarColor},
        				html: userDetails.avatarStr
        			});

        		}
        	}catch(mainError){
        		ownerImage = UWA.createElement('span', {
        			'class': "user-image-avatar",
        			'styles': { "background" : "rgb(170, 75, 178)"},
        			html: ""
        		});
        	}
        	//Add tooltip for image
        	if(ownerImage){
        		let userImgTooltip=new Tooltip({
        			position: 'top',
        			target: ownerImage,
        			body: that.escapeHtml(user.fullName?user.fullName:user.user),
        			trigger: 'touch'
        		});
        		that.tooltip.push(userImgTooltip);
        	}
        	//return 
        	return ownerImage ;
        },
        
        getAvatarDetails: function (name) {
            var options = {};
            var backgroundColors = [
              [7, 139, 250],
              [249, 87, 83],
              [111, 188, 75],
              [158, 132, 106],
              [170, 75, 178],
              [26, 153, 123],
              [245, 100, 163],
              [255, 138, 46]
            ];
            var initials = name.match(/\b\w/g);
            var firstLetter = initials[0].toUpperCase();
            var lastLetter = initials[initials.length - 1].toUpperCase();
    
            var avatarStr = (firstLetter + lastLetter);
    
            var i = Math.ceil((firstLetter.charCodeAt(0) + lastLetter.charCodeAt(0)) % backgroundColors.length);
            var avatarColor = "rgb(" + backgroundColors[i][0] + "," + backgroundColors[i][1] + "," + backgroundColors[i][2] + ")";
    
            options.name = name;
            options.avatarStr = avatarStr;
            options.avatarColor = avatarColor;
    
            return options;
        },
        //commenting as not required for TDP
      /* createTootip : function (element,text) {
    		let tooltipobj=new Tooltip({
                position: 'top',
                target: element,
                body: text,
                trigger: 'touch'
            });
    		return tooltipobj;
    	},*/
		//commenting as not required for TDP
    	/*checkSomeParenthasAClassName:function (element, classname) {
            if (element.className && element.className.split(' ').indexOf(classname)>=0) return true;
        	else if(element.classname && element.className.split(' ').indexOf('xRFQ-application')>=0 ) return false;
        	return element && element.parentNode && this.checkSomeParenthasAClassName(element.parentNode, classname);
        },*/

        getDateStringForDisplay:function(orignalDate, config = {}){
            if(!orignalDate)return orignalDate;
        	try{
        		var dateDisplayObj=orignalDate;
        		if (!(orignalDate instanceof Date)){
        			dateDisplayObj=new Date(orignalDate);
        		}
        		var isValidDate=function(d) {
        			  return d instanceof Date && !isNaN(d);
        		};
        		if(!isValidDate(dateDisplayObj))throw new Error("Invalid Date");
        		let configurations = { 
            			...(config.weekdayShort) && { weekday: 'short'},
            			year: 'numeric', month: 'short', day: 'numeric',hour:'numeric',minute:"numeric"
            		};
        		if(config.removeTime){
        			delete configurations.hour;
        			delete configurations.minute;
        		}
        		return dateDisplayObj.toLocaleString(widget.lang,
        		configurations
        		);
        	}catch(err){
        	    this.errForDate=err;
        		return orignalDate;
        	}
        	
        },
		//commenting as not required for TDP
        /*isGroupedNodePresent:function(selectedNodes){
            let groupedNodeSelected=false;
            if(!selectedNodes) return groupedNodeSelected;

            selectedNodes.forEach(function(selectedNode){
				if(selectedNode.getAttributeValue("grouped")){
                    groupedNodeSelected=true;
				}
			});

			return groupedNodeSelected;
        },*/
		//commenting as not required for TDP
        /*getFileFromURL:function(url,fileNameWithExt){
        	return new Promise(function(resolve){
        		var blob = null;
        		var xhr = new XMLHttpRequest();
        		xhr.open("GET", url);
        		xhr.responseType = "blob";
        		xhr.onload = function() 
        		{
        			blob = xhr.response;
        			let file=new File([blob], fileNameWithExt);
        			resolve(file);
        		};
        		xhr.send();
        	});
        },*/
		//commenting as not required for TDP
		/*isEventInElement:function(event, element)   {
            var rect = element.getBoundingClientRect();
            var x = event.clientX;
            if (x < rect.left || x >= rect.right) return false;
            var y = event.clientY;
            if (y < rect.top || y >= rect.bottom) return false;
            return true;
        },*/

		numberToLocaleString:function(inputNumber){
			let result=inputNumber;
			try{
				result=parseFloat(inputNumber).toLocaleString(widget.lang,{maximumFractionDigits:10,useGrouping:false});
			}catch(err){
				this.err=err;
			}
			return (result).toString();
		}
		//commenting as not required for TDP
		/*removeFromArray:function(arr,item){
			const index = arr.indexOf(item);
			if (index > -1) {
				arr.splice(index, 1);
			}
			return arr;
		},
		removeAllFromArray:function(requiredArray,tobeRemovedEleArray){
			requiredArray = requiredArray.filter( function( el ) {
				  return !tobeRemovedEleArray.includes( el );
			});
			return requiredArray;
		},
		isValidFile:function(file){
			let isValid=true,message="";
			let allowedFileSize=300*1024*1024; //300Mb
			let allowedFileNameLength=255; 
			let notAllowedChars=[";",":",">","<","/","\\",".","*","%","$"];

			let fileName=file.name.split(".").slice(0, -1).join('.');
			
			if(file.size>allowedFileSize){
				isValid=false;
				message=NLS.filesize_exceeded_limt;
			}else if(fileName.length > allowedFileNameLength){
				isValid=false;
				message=NLS.filename_length_exceeds;
			}else{
				notAllowedChars.forEach(function(character){
					if(fileName.contains(character)){
						isValid=false;
						message=NLS.filename_bad_character;
					}
				});
			}
			return {"isValid":isValid, message:message};
		}*/
		
		//commenting as not required for TDP
		/*applyDecimalPrecision:function (value, precision) {
			try{
				let appPrecision=widget.app.SystemExpressions.DefaultDecimalPrecision;
				precision = precision || precision===0?precision:(appPrecision || appPrecision===0?appPrecision:0),
				power = Math.pow(10, precision),
				absValue = Math.abs(Math.round(value * power)),
				result = (value < 0 ? '-' : '') + String(Math.floor(absValue / power));

				if (precision > 0) {
					var fraction = String(absValue % power),
					padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');
					result += '.' + padding + fraction;
				}
				return typeof value==='number'?parseFloat(result):result.toString();
			}catch(error){
				return value;
			}
		}*/
		
    };    

    return exports;
});
