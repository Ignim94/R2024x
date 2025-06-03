//XSS_CHECKED
/* global widget */
define('DS/ENOXPackageCommonUXInfra/NotificationsUtil/NotificationsUtil',
	[
	'DS/UIKIT/Mask',
	'UWA/Class',
	'DS/Notifications/NotificationsManagerUXMessages',
	'DS/Notifications/NotificationsManagerViewOnScreen'
	], function(UIMask, UWAClass, NotificationsManagerUXMessages, NotificationsManagerViewOnScreen) {
    	'use strict';
	    var xSRCNotificationsUtil = UWAClass.singleton({
	        _notificationsMgr : {},
	        _defaultLevel : 'info',
	        _msgLevels : {
	            INFO : 'info',
	            WARNING : 'warning',
	            ERROR : 'error',
	            SUCCESS : 'success'
	        },

	        init : function() {
	            this._notificationsMgr =NotificationsManagerUXMessages;
	            NotificationsManagerViewOnScreen.setNotificationManager(this._notificationsMgr);
	        },

	        showMessage : function(options){
	            if(options && options.subtitle) {
	              return this._notificationsMgr.addNotif({
	                	category : options.category,
	                    level : options.level ? options.level : this._defaultLevel,
	                    subtitle : options.subtitle,
	                    sticky : options.isSticky ? options.isSticky : false,
	                    allowUnsafeHTML : options.allowUnsafeHTML ? options.allowUnsafeHTML : false
	                });
	            }
	            
	        },

	        showError : function(errMessage) {
	            if(errMessage && errMessage !== ''){
					 if(widget.app && widget.app.logger){
							widget.app.logger.error(errMessage);
					 }
		            return this.showMessage({
		                    level : this._msgLevels.ERROR,
		                    subtitle : errMessage
		            });
	            }
	            UIMask.unmask(widget.body);
	        },

	        showInfo : function(infoMessage) {
	            if(infoMessage && infoMessage !== '') {
	                this.showMessage({
	                    level : this._msgLevels.INFO,
	                    subtitle : infoMessage
	                });
	            }
	        },

	        showSuccess : function(okMessage) {
	            if(okMessage && okMessage !== '') {
	                this.showMessage({
	                    level : this._msgLevels.SUCCESS,
	                    subtitle : okMessage
	                });
	            }
	        },
	        
	        showWarning : function(warningMessage) {
	            if(warningMessage && warningMessage !== '') {
	                this.showMessage({
	                    level : this._msgLevels.WARNING,
	                    subtitle : warningMessage
	                });
	            }
	        }
	        
			//commenting as not required by TDP
	        /*removeNotificationFromCategory : function (category) {
	        	NotificationsManagerViewOnScreen.removeNotifications(category,null);
	        },
	        
	        removeNotificationById : function (notifId) {
	        	NotificationsManagerViewOnScreen.removeNotification(notifId);
	        },
	        
	        setStackingPolicy : function (policy) {
	        	NotificationsManagerViewOnScreen.setStackingPolicy(policy?policy:3);
	        }*/
	    });
	    xSRCNotificationsUtil.init();
	    return xSRCNotificationsUtil;
	});
