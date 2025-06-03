//XSS_CHECKED
/* global UWA */
/* global widget */
define('DS/ENOXPackageCommonUXInfra/InfiniteScrolling/InfiniteScrollingImpl',
		[ 'DS/TreeModel/TreeNodeModel',
			'DS/UIKIT/Mask',
			'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
			'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
			'DS/ENOXPackageCommonUXInfra/Utilities/Utility'
			],function(TreeNodeModel,UIMask, ENOXSourcingConstants, NLS,Utility){

	'use strict';

	var InfiniteScrollingImpl = function(options){
		var that=this;
		that.options=options;
		that.utility = new Utility();
		that.activeRoute = widget.app.router._router.getState().name;
		that.options.controller.options.top=ENOXSourcingConstants.lazy_load_chunk_size;		//Sets the number of object to load		
		that.options.controller.options.skip=0;			//for first time skip will be 0
		that.options.view.collectionView._xsourcingCollectionViewUI._tilecollectionView.onInfiniteScroll(function() {
			that.initTileandThumbnailLoader();
			that.infiniteScrollAction(that.options);
		});
		that.options.view.collectionView._xsourcingCollectionViewUI._thumbnailCollectionView.onInfiniteScroll(function() {
			that.initTileandThumbnailLoader();
			that.infiniteScrollAction(that.options);
		});
		that.options.view.collectionView._xsourcingCollectionViewUI._dataGridView.onInfiniteScroll(function(opts) {
			//if(opts.reachBottom === false || (opts.reachBottom === true && dataGridView.model.length === itemCount)){
			if(opts.reachBottom === false){
				that.options.controller.view.collectionView._xsourcingCollectionViewUI._dataGridView.infiniteScrollProcessDone();
				return ;
			}
			that.infiniteScrollAction(that.options);
		});

	};

	InfiniteScrollingImpl.prototype.infiniteScrollAction=function(options){
		//otherwise continue calling the list method
		options.controller.options.skip+=options.controller.options.top; 
		options.controller.options.isLazyLoading=true;
		options.controller.list(options.controller.options);
	};

	InfiniteScrollingImpl.prototype.processReloadData = function(respData) {
		var that=this;
		if(that.activeRoute !== widget.app.router._router.getState().name) return;//to check if user has navigated
		that.lastFetchedCount=respData.length; //we capture recently fetched object count
		var _noObjectAvailableDiv=that.options.controller.view.collectionView._xsourcingCollectionViewUI._noObjectAvailableDiv;
		if(respData.length>0 && _noObjectAvailableDiv) _noObjectAvailableDiv.destroy(); //remove no data available text
		that.destroyLoader();
		//below code adds data to current view
		that.options.controller.view.collectionView._gridModel.prepareUpdate();
		for(var i=0;i<respData.length;i++){
			respData[i].contextualMenu = [""];
			if(respData[i].tooltip) 
				respData[i].customTooltip = that._getCustomToolTip(respData[i].tooltip);
			var node = new TreeNodeModel(respData[i]);
			that.options.controller.view.collectionView._gridModel.addRoot(node);
		}
		that.options.controller.view.collectionView._xsourcingCollectionViewUI._tilecollectionView.onPostUpdateView(function(){
            		UIMask.unmask(widget.body);
		});
		that.options.controller.view.collectionView._xsourcingCollectionViewUI._thumbnailCollectionView.onPostUpdateView(function(){
		            UIMask.unmask(widget.body);
		});
		that.options.controller.view.collectionView._xsourcingCollectionViewUI._dataGridView.onPostUpdateView(function(){
		            UIMask.unmask(widget.body);
		});
    
		that.options.controller.view.collectionView._gridModel.pushUpdate();
		var tileViewCount=that.options.controller.view.collectionView._xsourcingCollectionViewUI._tilecollectionView.model.length;
		that.options.controller.view.collectionView._xsourcingCollectionViewUI._toolbarChannel.publish({
			event : 'enox-collection-toolbar-items-count-update',
			data : tileViewCount
		});
		//complete the infinite scrolling process
		that.options.controller.view.collectionView._xsourcingCollectionViewUI._tilecollectionView.infiniteScrollProcessDone();
		that.options.controller.view.collectionView._xsourcingCollectionViewUI._thumbnailCollectionView.infiniteScrollProcessDone();
		that.options.controller.view.collectionView._xsourcingCollectionViewUI._dataGridView.infiniteScrollProcessDone();
		
		//Set the custom view explicitly to make the changes visible
		if(respData.length!==0)
			that.utility.setCustomView(that.options.controller.view.collectionView._xsourcingCollectionViewUI._dataGridView);
	};

	InfiniteScrollingImpl.prototype._getCustomToolTip = function(tooltipData){
		var content = "";
		tooltipData.forEach(function (item){
			if(item.data !== "" && item.data !== undefined){
				if (content !== "")
					content = content + "\n";
		    	content = content + item.label + ": " + item.data;
			}
		});
		return content;
	};

	InfiniteScrollingImpl.prototype.initResizePage=function(options){
		var that=this;
		that.options=options;
		that.options.view.collectionView._xsourcingCollectionViewUI._tilecollectionView.onEndResizeOrOnReadyModelRequest(function (context) {
			var optionsToPass={};
			optionsToPass.controller=that.options.controller;
			optionsToPass.context=context;
			that.resizePageAction(optionsToPass);
		});
		that.options.view.collectionView._xsourcingCollectionViewUI._tilecollectionView.onEndResizeOrOnReadyModelRequest(function (context) {
			var optionsToPass={};
			optionsToPass.controller=that.options.controller;
			optionsToPass.context=context;
			that.resizePageAction(optionsToPass);
		});
		that.options.view.collectionView._xsourcingCollectionViewUI._tilecollectionView.onEndResizeOrOnReadyModelRequest(function (context) {

			var optionsToPass={};
			optionsToPass.controller=that.options.controller;
			optionsToPass.context=context;
			that.resizePageAction(optionsToPass);
		});


	};


	InfiniteScrollingImpl.prototype.resizePageAction=function(options1){
		var that=this;
		that.resizePage =function(options){
			var pageSize=(options.context.RowMaxNumber) * (options.context.ColumnsMaxNumber);

			if(pageSize>options.controller.top){
				var objectsToFill=pageSize-options.controller.top;
				options.controller.top=objectsToFill+options.controller.top;
				that.ViewportCompleteAction(options);
				options.controller.view.collectionView._xsourcingCollectionViewUI._tilecollectionView.EndResizeOrOnReadyModelRequestDone();
			}
		};

		that.ViewportCompleteAction =function(options){
			options.controller.options.skip=0;
			options.controller.options.top=options.controller.top;
			options.controller.options.isLazyActivated=true;
			options.controller.list(options.controller.options);
		};
		that.resizePage(options1);
	};

	InfiniteScrollingImpl.prototype.initTileandThumbnailLoader = function(){
		var that=this;
		if(that.loaderContainer)that.loaderContainer.destroy();
		//create the container for loader
		that.loaderContainer=UWA.createElement('div', {
			'class': 'loader-container',
			'id':'loaderContainer',
			'styles':{
				'margin':'auto',
				'height':'30px'
			}
		});
		//For tile and Thumbnail View only
		var ele=that.options.view.collectionView._xsourcingCollectionViewUI.viewContainer.getElementsByClassName('wux-scroller wux-ui-is-rendered')[0];
		if(ele)
			ele.appendChild(that.loaderContainer); //add the mask container to end of current view
		if(that.loaderContainer)UIMask.mask(that.loaderContainer,NLS.loading);

	};

	InfiniteScrollingImpl.prototype.destroyLoader = function(){
		var that=this;
		if(that.loaderContainer)that.loaderContainer.destroy();

	};
	return InfiniteScrollingImpl;
});
