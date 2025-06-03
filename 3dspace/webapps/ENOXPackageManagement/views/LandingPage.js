//XSS_CHECKED
/* global widget */
define('DS/ENOXPackageManagement/views/LandingPage',
		[
			'DS/ENOXPackageManagement/controllers/PackageController',
			'DS/ENOXPackageManagement/controllers/PublicationController',
			'DS/ENOXPackageManagement/controllers/ConfigurationController',
			'css!DS/ENOXPackageManagement/ENOXPackageManagement.css'
			],
			function(PackageController,PublicationController,ConfigurationController){
	'use strict';

	var landingPage = function() {
		this.PackageController = new PackageController();
		this.PublicationController = new PublicationController();
	};

	landingPage.prototype.init = function(options) {
		// var that = this;
		this._container = options._triptychWrapper.getMainPanelContainer();
		this._triptychWrapper = options._triptychWrapper;
		this._applicationChannel = options.applicationChannel;
		this.platformServices = options.platformServices;
		this._storage = options.storage;
		this.router = options.router;
		var route = options.route;
		if (route === 'home.NewPublication') {

			this.PublicationController.createView(options);
		} else if (route === 'home.NewPackage') {
			this.PackageController.createView(options);
		} 
		else if (route === 'home.MyPublications') {

			this.PublicationController.list(options);

		} else if (route === 'home.MyPackages') {
			this._applicationChannel.publish({event:'xsourcing-collectionview-unselected-object-id',data:{'selectedObjectId':null}});
			this.PackageController.list(options);
		} 

		else if (route === 'home.PackageDetails') {
			this.PackageController.open(options);
			let hyperLinkOption = {
    				contextObjId:options.id,
    				callControllerMethod: this.PackageController,
					  infoPanelForPackageDetails:true
    		};

    		widget.app._applicationChannel.publish({event:'xsourcing-collectionview-selected-object-id',
    			data:{
    				selectedObject: true, //to mimic a selected object to cater to current info panel mechanism
    				openDetails: this.PackageController.commonhelper.getObjectDetailsInInfoPanel(hyperLinkOption)
    			}
    		});

		} else if (route === 'home.PublicationDetails') {
			this.PublicationController.open(options);
			let hyperLinkOption = {
    				contextObjId:options.id,
    				callControllerMethod: this.PublicationController,
					infoPanelForPublicationDetails:true
    		};

    		widget.app._applicationChannel.publish({event:'xsourcing-collectionview-selected-object-id',
    			data:{
    				selectedObject: true, //to mimic a selected object to cater to current info panel mechanism
    				openDetails: this.PublicationController.commonhelper.getObjectDetailsInInfoPanel(hyperLinkOption)
    			}
    		});
		}  
		else if(route==='home.Configuration'){
			
			let configurationController = new ConfigurationController(options);
			configurationController.init(options);
		}
	};

	landingPage.prototype._loadRecentlyView = function() {


	};

	return landingPage;
});
