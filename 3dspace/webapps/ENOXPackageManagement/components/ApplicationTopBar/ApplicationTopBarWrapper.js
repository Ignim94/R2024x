//XSS_CHECKED
/* global widget */ 
// global UWA 
define(
'DS/ENOXPackageManagement/components/ApplicationTopBar/ApplicationTopBarWrapper',
[
    'DS/ENOXPageToolBar/js/PageToolBar',
    'DS/ENOXBreadcrumb/js/Breadcrumb',
    'DS/ENOXPackageCommonUXInfra/InformationPanel/InformationPanelUI',
    'DS/UIKIT/Mask',
    'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement'
],
function (
    PageToolBar,
    Breadcrumb,
    InformationPanelUI,
    UIMask,
    NLS
  ) {
    'use strict';

    var ApplicationTopBarWrapper = function () { };

    ApplicationTopBarWrapper.prototype.init = function (applicationChannel, xCSRouterparam, parentContainer_param) {

        this.xTDPRouter = xCSRouterparam;
        this._applicationChannel = applicationChannel;

        // init toolbar
        var topbarOptions = {
            withInformationButton: true,
            withWelcomePanelButton: true,
            modelEvents: this._applicationChannel,
            parentContainer: parentContainer_param
        };
        var myPageToolBar = new PageToolBar(topbarOptions);
        myPageToolBar.render().inject(parentContainer_param);

        // init breadcrumb
/*        var breadcrumbContainer = myPageToolBar.getBodyContent();
        //var that = this;
        
        this._tileContent = UWA.createElement('div', { styles : { display : 'none', padding : '10px 0 0' } ,html : ''});
        this._tileContent.inject(breadcrumbContainer);
        
        this._breadcrumb = new Breadcrumb({
            rootID: 'home',
            rootText: '',
            rootIcon: 'home',
            toolTip: true,
            toolTipText : NLS.my_packages,
            modelEvents: this._applicationChannel
        });
        this._breadcrumb.render().inject(breadcrumbContainer);
        
     
        this._breadcrumb.hide();
        this._tileContent.show();*/
        
        this._subscribeToEvents();
    };

    ApplicationTopBarWrapper.prototype._subscribeToEvents = function () {
        var that = this;
        
      /*  var chartReflow=function(time){
        	if(that.xTDPRouter.getRouter().getState().name==="home"){
        	setTimeout(function(){
        		if(BarChart.chart){
              	BarChart.chart.reflow();
        		}
        		if(PieChart.chart){
               	PieChart.chart.reflow();
        		}
               },time);
        	}
        };*/
       
        var orientationEvent = "onorientationchange" in window ? "orientationchange" : "resize";
        window.addEventListener(orientationEvent, function() {
        	//chartReflow(800);
      	}, false);
        // when trying to reduce the welcome panel container (click on the little arrow in the TopToolBar)
        this._applicationChannel.subscribe({ event: 'welcome-panel-collapse' }, function () {
            that._applicationChannel.publish({ event: 'triptych-set-size', data: { size: 40, side: 'left' } });
            that._applicationChannel.publish({ event: 'triptych-show-panel', data: 'left' });
           // chartReflow(500);
        });


        // same for expand of the welcome panel
        this._applicationChannel.subscribe({ event: 'welcome-panel-expand' }, function () {
        	that._applicationChannel.publish({ event: 'show-welcomepanel-icon'});
            that._applicationChannel.publish({ event: 'triptych-set-size', data: { size: 350, side: 'left' } });
            that._applicationChannel.publish({ event: 'triptych-show-panel', data: 'left' });
           // chartReflow(500);
        });
        
        this._applicationChannel.subscribe({ event: 'welcome-panel-hide' }, function () {
        	that._applicationChannel.publish({ event: 'hide-welcomepanel-icon'});
        	that._applicationChannel.publish({ event: 'welcome-panel-collapse'});
        	that._applicationChannel.publish({ event: 'triptych-hide-panel', data: 'left' });
        	//that._applicationChannel.publish({ event: 'information-panel-close' });
        });

        // when clicking on the 'I' of Information while it's opened
        this._applicationChannel.subscribe({ event: 'information-panel-close' }, function () {
        	that.isRightPaneOpen = false;
			widget.setValue("isInfoPanelOpen",false);
            that._applicationChannel.publish({ event: 'triptych-hide-panel', data: 'right' });
            var rightPanel = widget.getElement(".xTDP-triptych-wrapper-right");
            rightPanel.innerHTML="";
           // chartReflow(500);
        });

        // when clicking on the 'I' of Information while it's closed
        this._applicationChannel.subscribe({ event: 'information-panel-open' }, function (panelData) {
        	that.isRightPaneOpen = true;
			widget.setValue("isInfoPanelOpen",true);
            that._applicationChannel.publish({ event: 'triptych-show-panel', data: 'right' });
            that._applicationChannel.publish({ event: 'information-panel-visible', data: null });
            that._applicationChannel.publish({ event: 'information-panel-add-content', data: panelData === 'right'? that.selectedObject: panelData});
          //  chartReflow(500);
        });


        // if something closed the right panel, update the 'I' color
        this._applicationChannel.subscribe({ event: 'triptych-panel-hidden' }, function (data) {
			let informationIcon = document.querySelector('.information-icon');
            if (data === 'right') {
                that._applicationChannel.publish({ event: 'information-panel-hidden', data: null });
                var rightPanel = widget.getElement(".xTDP-triptych-wrapper-right");
                rightPanel.innerHTML="";
               if(informationIcon && informationIcon.className.contains('active'))
	            	informationIcon.classList.remove('active');
				that.isRightPaneOpen=false;
				widget.setValue("isInfoPanelOpen",false);
				widget.setValue("LastSelectedTabInfoPanel", undefined);
            }
			var infoIcon = widget.getElement('#sourcinginfoicon');
            if(infoIcon){
                var iconContainer = infoIcon.getChildren()[0];
                if(iconContainer.className.contains('enox-collection-toolbar-filter-activated'))
                    iconContainer.removeClassName('enox-collection-toolbar-filter-activated');
            }
			that.isRightPaneOpen && informationIcon.classList.add('active');		
        });
        
        this._applicationChannel.subscribe({ event: 'xsourcing-collectionview-selected-object-id' }, function (data) {
            if (data.selectedObject) {
                that.selectedObject = data;
                if(that.isRightPaneOpen) {
					widget.setValue("isInfoPanelOpen",true);
					that._applicationChannel.publish({ event: 'information-panel-add-content', data:data});
				}
				else {
					widget.setValue("isInfoPanelOpen",false);
				}
            }
        });
        this._applicationChannel.subscribe({ event: 'xsourcing-collectionview-unselected-object-id' }, function () {
        	that.selectedObject = null;
        });
        
        this._applicationChannel.subscribe({ event: 'information-panel-add-content' }, function (data) {
        		var rightPanel = widget.getElement(".xTDP-triptych-wrapper-right");
                rightPanel.innerHTML="";
                if(data && data.selectedObject==='multipleSelected'){
                	rightPanel.appendChild( document.createTextNode(NLS.select_only_one_item));	
                }
                else if(data && data.openDetails){
                    data.openDetails();
                }
              else if(data && data.selectedObject){
        		var informationPanelUI = new InformationPanelUI(data.selectedObject);
            	informationPanelUI.init(data.selectedObject);
              }
			  else if(data && data.selectedNode){
				data.packageOptions.that.controller.updateContentFiles(data, rightPanel);
              }
        	  else{
            	var content = document.createTextNode(NLS.no_valid_item_selected);
            	rightPanel.appendChild(content);
              }

        	if(rightPanel)
        		UIMask.unmask(rightPanel);
        });

/*       // concerning click on breadcrumb
        this._applicationChannel.subscribe({ event: 'breadcrumb-link-clicked' }, function (link) {
            if (link.linkID === 'home') {
                that.xTDPRouter.navigate('home');
				widget.setValue('xpflLastVisitedRoute',JSON.stringify({route:'home', objectId:'' }));
            }
            else if (link.linkID === 'home.Portfolios') {
                that.xPortfolioRouter.navigate('home.Portfolios', { data: 'from breadcrumb' }); // should not re-trigger the 'activate'
            }*/
/*            else {
                var additionalData = null;
                var i = 0;
                for (i = 0; i < that._breadcrumb.collection.length; i += 1) {
                    if (that._breadcrumb.collection.at(i).id === link.linkID) {
                        additionalData = that._breadcrumb.collection.at(i).get('additionalData');
                        break;
                    }
                }
                additionalData ? that.xTDPRouter.navigate(link.linkID, additionalData) : that.xTDPRouter.navigate(link.linkID);
            }
        });
        
        this._applicationChannel.subscribe({ event: 'tdp-breadcrumb-add-link' }, function (data) {
            if(that._breadcrumb.collection.length === 3){
                that._applicationChannel.publish({
                        event: 'breadcrumb-reset',
                        data: null
                    });
            }
       	    that._applicationChannel.publish({
				event: 'breadcrumb-add-link',
				data: data
			});
       });
        
        this._applicationChannel.subscribe({ event: 'topbar-show-title' }, function (data) {
       	 that._tileContent.setContent(data);
           that._breadcrumb.hide();
           that._tileContent.show();
       });

       this._applicationChannel.subscribe({ event: 'topbar-hide-title' }, function () {
         that._tileContent.hide();
         that._breadcrumb.show();
       });*/
        
    };

    return ApplicationTopBarWrapper;
});
