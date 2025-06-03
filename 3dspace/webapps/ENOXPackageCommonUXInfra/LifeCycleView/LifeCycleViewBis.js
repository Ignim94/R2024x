//XSS_CHECKED
/* global UWA */
/* global widget */
/*eslint no-new: "off",no-loop-func: "off" */
define('DS/ENOXPackageCommonUXInfra/LifeCycleView/LifeCycleViewBis',
		[ 
			'DS/Windows/ImmersiveFrame',
			'DS/Windows/Dialog',
			'DS/Controls/Button',
			'DS/UIKIT/Mask',
			'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
			'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices',
			'DS/ENOXPackageCommonUXInfra/service/ENOXTDPService',
			'DS/LifecycleCmd/MaturityCmd',
			'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
			'DS/ENOXPackageCommonUXInfra/Search/SearchUtility',
			'css!DS/ChangeMaturityWidget/ChangeMaturityWidget',
			'css!DS/ENOXPackageCommonUXInfra/LifeCycleView/LifeCycleViewBis.css'
			],function(WUXImmersiveFrame,WUXDialog,WUXButton,UIMask,NLS,ENOXSourcingPlatformServices,ENOXSourcingService, MaturityCmd,ENOXSourcingConstants, SearchUtility){ 

	'use strict';
	var _name = 'lifecycle-view';
	var subscribeTokens = [{},{}];
	var LifeCycleView = UWA.Class.View.extend({
		name : _name,
		tagName : "div",
		template : function() {
			return "<div class=\"" + this.getClassNames('-subcontainer') + "\"></div>";
		},
		domEvents : {},

		init : function(options) {
			//var that = this;
			this.model=options.model;
			[ 'container', 'template', 'tagName', 'domEvents' ].forEach(function(propToDelete) {
				delete options[propToDelete];
			});
			
			if(this.model.get("subscribeLifeCycleModification")){
				this.searchUtil = new SearchUtility();
				this.destroyCleanUpSubscribe = this.model.get("applicationChannel").subscribe({event:"cleanup-lifecycleModification-subscribe"}, this.cleanUpSubscribe.bind(this));
				this.setupSubscribers();
			}

			this._parent(this, options);
		},

		setup : function() { //options
			this.listenTo(this.model, "onChange", this.buildMaturityBadge);
			this.container.addClassName(this.getClassNames('-container'));            
		},
		render : function() {
			var that=this;
			this.container.empty();
		        	var optsOP = {};
		        	optsOP.context = {getSecurityContext:function(){
						return {SecurityContext:ENOXSourcingService.getSecurityContext()};
					}};
		        	var cmdOP = new MaturityCmd(optsOP);
		        	cmdOP.executeAsync([{"physicalid":that.model.get("id")}])
					.then(function(){
						if(that.model.get("callBackForExecuteCmd")){
							that.model.get("callBackForExecuteCmd")();
						}
						//alert("promotion Done");
					});
			return this.container;
		},
		onDestroy : function() {

			return this._parent.apply(this, arguments);
		},
		//this code is for maturity state compact view
		buildMaturityBadge: function () {
				var that = this;
				var parentDiv, maturityContainerCollapsed, maturityContainerExpanded;
				let source = that.model.get("source") ? that.model.get("source") : ENOXSourcingConstants.SERVICE_3DSPACE;
				var mIDCardContainer = that.model.get("maturityContainer");
				let maturityAttr = mIDCardContainer ? mIDCardContainer._idCardModel.get("attributes").filter((attr) => attr.id === "maturityState")[0] : undefined;

				if (maturityAttr) {
					let maturityDisplayWhenMinified = maturityAttr.displayWhenMinified;
					if (maturityDisplayWhenMinified) {
						maturityContainerCollapsed = mIDCardContainer._container.querySelectorAll("#maturityState")[0];
						maturityContainerExpanded = mIDCardContainer._container.querySelectorAll("#maturityState")[1];
					} else {
						maturityContainerExpanded = mIDCardContainer._container.querySelectorAll("#maturityState")[0];
					}

					let minifiedIDCardContainer = mIDCardContainer._container.querySelector(".xapp-id-card-container");
					if (minifiedIDCardContainer && minifiedIDCardContainer.hasClassName("minified")) {
						parentDiv = maturityContainerCollapsed;
					} else {
						parentDiv = maturityContainerExpanded;
					}
				}

				if (parentDiv) {
					parentDiv.innerHTML = '';
					var cmd = new MaturityCmd();
					let maturityOptions = {
						SecurityContext: ENOXSourcingService.getSecurityContext(source),
						serviceurl: ENOXSourcingPlatformServices.getServiceURL(source) + "/resources/lifecycle/maturity/"
					};

					cmd.executeCompactViewAsync(widget, parentDiv, maturityOptions, that.model.get("id"));
				}
		},
		setupSubscribers: function () {
				var that = this;

				if (that.model.get("forInfoPanel")) {
					if (subscribeTokens[1].id) {
						that.searchUtil.getPlatfromAPIObj().unsubscribe(subscribeTokens[1].token);
						subscribeTokens[1] = {};
					}
					if (!subscribeTokens[0].id || (subscribeTokens[0].id !== that.model.get("id"))) {
						subscribeTokens[1].id = that.model.get("id");
						subscribeTokens[1].token = that.searchUtil.getPlatfromAPIObj().subscribe('Lifecycle.Modification', function (e) {
							if (that.model.get("id") === JSON.parse(e).Refresh.modified[0].physicalid) {
								if (that.model.get("callBackForExecuteCmd")) {
									that.model.get("callBackForExecuteCmd")();
								}
							}
						});
					}
				} else {
					if (subscribeTokens[0].id) {
						that.searchUtil.getPlatfromAPIObj().unsubscribe(subscribeTokens[0].token);
						subscribeTokens[0] = {};
					}
					if (subscribeTokens[1].id && (subscribeTokens[1].id === that.model.get("id"))) {
						that.searchUtil.getPlatfromAPIObj().unsubscribe(subscribeTokens[1].token);
						subscribeTokens[1] = {};
					}
					subscribeTokens[0].id = that.model.get("id");
					subscribeTokens[0].token = that.searchUtil.getPlatfromAPIObj().subscribe('Lifecycle.Modification', function (e) {
						if (that.model.get("id") === JSON.parse(e).Refresh.modified[0].physicalid) {
							if (that.model.get("callBackForExecuteCmd")) {
								that.model.get("callBackForExecuteCmd")();
							}
						}
					});
				}

		},
		cleanUpSubscribe: function () {
				var that = this;
				if (subscribeTokens[0].id) {
					that.searchUtil.getPlatfromAPIObj().unsubscribe(subscribeTokens[0].token);
					subscribeTokens[0] = {};
				}
				if (subscribeTokens[1].id) {
					that.searchUtil.getPlatfromAPIObj().unsubscribe(subscribeTokens[1].token);
					subscribeTokens[1] = {};
				}
				that.model.get("applicationChannel").unsubscribe(that.destroyCleanUpSubscribe);
		}
	});	

	return LifeCycleView;
});
