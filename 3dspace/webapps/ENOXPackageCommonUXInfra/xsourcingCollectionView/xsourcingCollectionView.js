/* global widget */
/**
 * 
 */
define('DS/ENOXPackageCommonUXInfra/xsourcingCollectionView/xsourcingCollectionView',
		[ 'UWA/Class',
			'DS/TreeModel/TreeNodeModel',
			'DS/TreeModel/DataModelSet',
			'DS/TreeModel/TreeDocument',
			'DS/ENOXPackageCommonUXInfra/xsourcingCollectionView/xsourcingCollectionViewUI'],
			function(Class, TreeNodeModel, DataModelSet, TreeDocument,XsourcingCollectionViewUI){
	'use strict';

	var xsourcingCollectionView = function(){
		this._xsourcingCollectionViewUI = new XsourcingCollectionViewUI();
	};
	/*	options.data should contain attribute searchQuery for all members to enable 6WTagger for RDF objects. 
	 */	
	xsourcingCollectionView.prototype.init = function(options){
		this.options = options;

		this._data = this.options.data;
		this._dataModelSet =  new DataModelSet();
		this._model = new TreeDocument({
			dataModelSet: this._dataModelSet,
			useAsyncPreExpand: options.useAsyncPreExpand
		});
		this._gridModel = new TreeDocument();
		options.gridModel = this._gridModel;
		options.model = this._model;

		this.collectionViewEvents = options.collectionViewEvents;
		if(!this.collectionViewEvents)
			this.collectionViewEvents = widget.app._mediator.createNewChannel();
		options.collectionViewEvents = this.collectionViewEvents;
		
		this._xsourcingCollectionViewUI.init(options);

		this._setData(this.options.data);
		
		
		this.subscribeToEvents(options);
	};

	xsourcingCollectionView.prototype.subscribeToEvents=function(options){
		var that = this;
		
		//subscribing the events at application channel
		if(this.options.applicationChannelEvents){
			this.options.applicationChannelEvents.forEach(function(evntObj){
				that.options.applicationChannel.subscribe({event:evntObj.eventName},function(data){
					data.contextualMenu = [""];
					if(data.tooltip)
						data.customTooltip = that._getCustomToolTip(data.tooltip);
					var root = new TreeNodeModel(data);				
					that._gridModel.addRoot(root,0);
					that._xsourcingCollectionViewUI._updateCount();
			});
			});
		}
		this.options.collectionViewEvents.subscribe({event:"add-model"},function(data){
			data.contextualMenu = [""];
			if(data.tooltip)
				data.customTooltip = that._getCustomToolTip(data.tooltip);
			var root = new TreeNodeModel(data);				
			that._gridModel.addRoot(root,0);
			that._xsourcingCollectionViewUI._updateCount();
		});
		
		if(this.options.applicationChannel){
			this.options.applicationChannel.subscribe({ event: 'search-in-current-dashboard' }, function (searchQuery) {
				that._handlefilterData(searchQuery);
			});
		}		

		if(options.rowSelectCallback){
			this._gridModel.addEventListener("select",function(e){
				options.rowSelectCallback(e.data.nodeModel.options.grid);
			});
		}
		if(options.rowUnSelectCallback){
			this._gridModel.addEventListener("unselect",function(e){
				options.rowUnSelectCallback(e.data.nodeModel.options.grid);
			});
		}
		if(options.useAsyncPreExpand){
			let model=this._gridModel;
			model.onPreExpand(function (modelEvent) {
				if(options.onPreExpand && typeof options.onPreExpand==='function')
					options.onPreExpand(modelEvent,model);
			});
		}
		
		//Subscribe for filter functionality in toolbar
		options.collectionViewEvents.subscribe({event:'filter-on-search'},function(data){
			that._handlefilterData(data);
		});
		
		options.collectionViewEvents.subscribe({event:'d6w-tagger-filter-action'},function(data){
			that._handleTaggerFilter(data);
		});

	};	
	
	xsourcingCollectionView.prototype._setData = function(data){
		var that = this;
		this._model.empty();
		this._gridModel.empty();
		this._model.prepareUpdate();
		this._gridModel.prepareUpdate();
		
		var recursiveAddChildNode = function(node, gridData) {
			if (gridData && gridData.children && gridData.children.length > 0) {
				gridData.children.forEach(function(dataInfoChild) {
					  let child = new TreeNodeModel({
						label: dataInfoChild.title,
						grid: dataInfoChild,
						...(dataInfoChild.children !== undefined)?{children:[]} : {}
					  });
					  node.addChild(child);
					  recursiveAddChildNode(child, dataInfoChild);
				});
			}
		}; 

		for(var i=0;i<data.length;i++){
			var dataHolder = data[i];
			dataHolder.contextualMenu = data[i].disableContextualMenu?false:[""];
			if(dataHolder.tooltip)
				dataHolder.customTooltip = that._getCustomToolTip(dataHolder.tooltip);
			var node = TreeNodeModel.createTreeNodeDataModel(this._dataModelSet, data[i]);
			this._model.addChild(node);
			var root = new TreeNodeModel(data[i]);
			this._gridModel.addRoot(root);
			recursiveAddChildNode(root, data[i].grid);
		}
		
		if(this.options.expandChildren) {
			this._gridModel.expandAll();			
		} else if(this.options.expandChildrenLevel) {
			this._gridModel.expandNLevels(this.options.expandChildrenLevel);			
		}

		if(this.options.onPreExpand && typeof this.options.onPreExpand === 'function') {
			this._gridModel.onPreExpand(this.options.onPreExpand);
		}
		
		this._gridModel.pushUpdate();
		this._model.pushUpdate();
		this._xsourcingCollectionViewUI.setModel(this._gridModel);

	};
	
	
	xsourcingCollectionView.prototype._getCustomToolTip = function(tooltipData){
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
	
	xsourcingCollectionView.prototype._handleTaggerFilter = function(dataToFilter) {
		var filteredModel=new TreeDocument();
		for(var i=0;i<dataToFilter.length;i++){
			var root = new TreeNodeModel(dataToFilter[i]);
			filteredModel.addRoot(root);
		}
		this._xsourcingCollectionViewUI.setModel(filteredModel);
	};

	//Method for handling  filter functionality in toolbar
	xsourcingCollectionView.prototype._handlefilterData = function(searchQuery) {
		let that = this;
		var OriginalGridModel=this._gridModel;	
		var roots=OriginalGridModel.getRoots();
		OriginalGridModel.prepareUpdate();
		roots.forEach((rootNode)=>{
			xsourcingCollectionView.prototype._hideShowRow(searchQuery, rootNode, this.options);
		});
		that._xsourcingCollectionViewUI._updateCount();
		OriginalGridModel.pushUpdate();
	};

	xsourcingCollectionView.prototype._hideShowRow = function(searchQuery, rootNode, opt) {
		if(searchQuery){
			let regExp = new RegExp(searchQuery,"i");//case insensitive
			let regExpResult=false;

			let isChildShown=false;
			let childArray = rootNode.options.children;
			if(childArray)
				childArray.forEach((childNode)=>{
					let temp=xsourcingCollectionView.prototype._hideShowRow(searchQuery, childNode, opt);
					if(!isChildShown)isChildShown=temp;
				});

			if(opt.columnToSearch){
				opt.columnToSearch.forEach((objectKey) => {
					regExpResult=regExpResult||regExp.test(rootNode.options.grid[objectKey]?rootNode.options.grid[objectKey].toString():undefined);
				});
			}else{
				let objectKeys=Object.keys(rootNode.options.grid);
				objectKeys.forEach((objectKey) => {
					regExpResult=regExpResult||regExp.test(rootNode.options.grid[objectKey]?rootNode.options.grid[objectKey].toString():undefined);
				});
			}
			if(regExpResult || isChildShown){
				rootNode.show();
				return true;
			}
			rootNode.hide();
			return false;

		}
		rootNode.show();
		let childArray = rootNode.options.children;
		if(childArray)
			childArray.forEach((childNode)=>{
				childNode.show();
				xsourcingCollectionView.prototype._hideShowRow(searchQuery, childNode, opt);
			});

	};

	xsourcingCollectionView.prototype.switchView = function(view) {
		return this._xsourcingCollectionViewUI.switchView(view);
	};

	xsourcingCollectionView.prototype.getNewNode = function(data) {
		return new TreeNodeModel(data);
	};

	return xsourcingCollectionView;
});
