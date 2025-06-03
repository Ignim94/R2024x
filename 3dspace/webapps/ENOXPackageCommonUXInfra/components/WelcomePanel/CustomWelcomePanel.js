//XSS_CHECKED
/* eslint-disable no-new */
/* global widget */
/* eslint no-console: "off" */
/*eslint no-else-return: "off"*/
/*eslint no-useless-return: "off"*/
/* global UWA */
/**
 * @license Copyright 2017 Dassault Systemes. All rights reserved.
 *
 * @overview Custom Welcome Panel Functionality
 */
define('DS/ENOXPackageCommonUXInfra/components/WelcomePanel/CustomWelcomePanel',
		[
		 'DS/ENOXWelcomePanel/js/ENOXWelcomePanel',
		 'text!DS/ENOXPackageCommonUXInfra/assets/html/UserAssitance.html',
		 'text!DS/ENOXPackageCommonUXInfra/assets/html/ENOXWelcomePanelCustom.html',
		 'DS/Handlebars/Handlebars4',
		 'DS/UIKIT/Tooltip',
		 'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
		 'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices',
		 'css!DS/ENOXPackageCommonUXInfra/assets/styles/WelcomePanelWrapper'
		 ],
		 function(ENOXWelcomePanel,UserAssistance,template,Handlebars,Tooltip,NLS,ENOXTDPPlatformServices){
	'use strict';

	var CustomWelcomePanel = function(){};

	CustomWelcomePanel.prototype.injectCustomHTML = function(options){

		this.welcomePanelContainer = UWA.createElement('div',{
			'class': 'welcomePanelSection'
		});

		var welcomePanelFirstDiv = UWA.createElement('div', {
			id : 'welcomePanelFirstDiv',
			'class': 'welcomePanelFirstDiv'
		}).inject(this.welcomePanelContainer);

		var panelTemplate = Handlebars.compile(template);
		this.welcomePanelContainer.inject(options.parentContainer);

		welcomePanelFirstDiv.setHTML(panelTemplate(options));

        this.welcomePanelSection = welcomePanelFirstDiv.getElement(".welcome-panel-section");
		var activityelement=widget.getElement(".custom-activity-section");
		
		options.activities[0].actions.map(obj => { obj.tooltip = obj.text; });

		var welcomePanelOptions = {
				collapsed: false,
				title: options.title,
				notifications: [],
				activities: options.activities,
				parentContainer: activityelement?activityelement:options.parentContainer,
				description:options.description,
				modelEvents: widget.app._applicationChannel
		};

		this.applicationChannel = widget.app._applicationChannel;
		this._wp = new ENOXWelcomePanel(welcomePanelOptions);
		this._wp.render();

		var footerPanelTemplate = Handlebars.compile(UserAssistance);
		var footerelment=widget.getElement(".custom-footer-section");
		if(footerelment!==null && footerelment!==undefined){
			footerelment.setHTML(footerPanelTemplate({
				USER_ASSISTANCE:NLS.user_assistance,
				CONTENT_KNOWLEDGE:NLS.content_knowledge,
				TRAINING:NLS.training
			}));
			
			var  userAssitanceTooltip= footerelment.getElements('.user-assistance .link-item')[0];
			this._trainingTooltip = new Tooltip({
 			target: userAssitanceTooltip,
			 body:  NLS.user_assistance,
			 position: 'right'
			});

			var  userAssitance= footerelment.getElement(".user-assistance .link-anchor");
			userAssitance.addEvent("click", this._launchUserAssistanceWindow.bind(this,options));

			//To Be enabled once training links are available
			/*var  training= footerelment.getElement(".user_assistance .link-anchor training");
			 training.addEvent("click", this._launchTrainingWindow.bind(this,options));*/
		}
		this._subscribeToEvents();
	};

	CustomWelcomePanel.prototype._subscribeToEvents = function() {
		let that = this;
		this.applicationChannel.subscribe({ event: 'welcome-panel-collapse' }, function () {
			that.welcomePanelSection.addClassName('collapsed');
			that.welcomePanelSection.removeClassName('expanded');
        });
        // same for expand of the welcome panel
        this.applicationChannel.subscribe({ event: 'welcome-panel-expand' }, function () {
        	that.welcomePanelSection.addClassName('expanded');
			that.welcomePanelSection.removeClassName('collapsed');
        });
	};

	CustomWelcomePanel.prototype.getWelcomePanel = function() {
		return this._wp;
	};

	CustomWelcomePanel.prototype._launchUserAssistanceWindow=function(options) {
		var finalUrl=this._getHelpRootPath(options);
		window.open(finalUrl, "_blank");
	};

	CustomWelcomePanel.prototype._launchTrainingWindow=function(options) {
		var baseUrl="https://dsua.dsone.3ds.com/";
		var language=options.trainingLink;
		var finalUrl=baseUrl.concat(language);
		window.open(finalUrl, "_blank");
	};
	
	CustomWelcomePanel.prototype._getHelpRootPath=function(options) { // eslint-disable-line
        var helpURL = options.userAssistnceLink;
        
        // Language
        var mylanguage = widget.lang || 'English';
        // if (typeof language !== 'undefined') {
        //     mylanguage = language;
        // }
        var urllanguage;
        if (mylanguage.match('fr')) {
            urllanguage = 'French';
        } else if (mylanguage.match('de')) {
            urllanguage = 'German';
        } else if (mylanguage.match('ja')) {
            urllanguage = 'Japanese';
        } else if (mylanguage.match('zh')) {
            urllanguage = 'Simplified_Chinese';
        } else if (mylanguage.match('it')) {
            urllanguage = 'Italian';
        } else if (mylanguage.match('es')) {
            urllanguage = 'Spanish';
        } else if (mylanguage.match('ru')) {
            urllanguage = 'Russian';
        } else {
            urllanguage = 'English'; // default
        }

        var path = 'http://help.3ds.com/HelpDS.aspx?P=11';
		
        if(ENOXTDPPlatformServices.getPlatformId() === "OnPremise")
			path=path.concat('&contextscope=onpremise');
        // Add language
        path = path.concat('&L=');
        path = path.concat(urllanguage);

        // Add fallback option if expected language not found
        path = path.concat('&E=1'); // As a fallback, the current English documentation is accessed (TODO P2 Get option)
        
        // Add File (can contain internal anchor since this is the last parameter)
        path = path.concat('&F=');
        path = path.concat(helpURL);
        //console.log(path);
        return path;
    };

	return CustomWelcomePanel;
});
