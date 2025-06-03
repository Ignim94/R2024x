/**
 @extends UWA/Class/View

 @requires UWA/Class/View
 @requires UWA/Core

 @requires DS/UIKIT/Input/Toggle
 @requires DS/UIKIT/Tooltip

 @requires @sub DS/ENOXPackageCommonUXInfra/ObjectHistory/views/Rows

 @requires css!DS/ENOXPackageCommonUXInfra/ObjectHistory/SourcingTimeline.css
 **/
define('DS/ENOXPackageCommonUXInfra/ObjectHistory/SourcingTimeline', [
    'UWA/Class/View',
    'UWA/Core',

    'DS/UIKIT/Input/Toggle',
    'DS/UIKIT/Tooltip',
    
    'DS/ENOXPackageCommonUXInfra/Mediator',
    'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
    'DS/ENOXPackageCommonUXInfra/ObjectHistory/views/Rows',

    'css!DS/ENOXPackageCommonUXInfra/ObjectHistory/SourcingTimeline.css'
], function (View, UWA, Toggle, Tooltip, ENOXMediator, NLSInfra, Rows) {

    'use strict';

    var Timeline = View.extend({
        name: 'DS/ENOXPackageCommonUXInfra/ObjectHistory/SourcingTimeline',

        tagName: 'div',

        className: 'timeline-component',

        defaultOptions: {
            parser: ''
        },

        // The actual view
        view: null,

        // We keep the subscribers to destroy them later
        _subscriberTokens: [],

        /**
         * See UWA documentation.
         * @inheritDoc
         */
        setup: function (options) {
            var that = this;

            options = UWA.merge(options || {}, that.defaultOptions);
            that._parent(options);

            that._subscribers();
        },

        /**
         * See UWA documentation.
         * @inheritDoc
         */
        render: function () {
            var that = this;
            that.container.empty();
            var view = that.view = new Rows({
                physicalId: that.getOption('physicalId'),
                objectTitle: that.getOption("objectTitle"),
                activityMappingObject:that.getOption("activityMappingObject"),
                parser: that.getOption('parser'),
                parent: that
            });
            that.container.setContent(view.render().container);
            var historyContainer=that.getOption("historyContainer");
            if(historyContainer){
                that.container.inject(historyContainer);
            }
            return that;
        },

        /**
         * See UWA documentation.
         * @inheritDoc
         */
        reset: function () {
            var that = this;
            
           /* // Stop listening
            that._subscriberTokens.forEach(function (token) {
                
            });*/

            // Destroys the view
            that.view.destroy();
        },
        
        /**
         * Hear hear.
         * @private
         */
        _subscribers: function () {
        	var that=this;
        	 var _mediator = new ENOXMediator();
             var _applicationChannel = _mediator.createNewChannel();
        	_applicationChannel.subscribe({ event: 'reload-history-content' }, function () {
        		that.render();
            });
        	that.historyApplicationChannel=_applicationChannel;
        },
        
        initHistoryTab:function(options,tabsComponent){
        	var that=this;
    		var tabSelected=options.selectedTab==="Activity";
    		var historycontainer =  UWA.createElement('div',{
    			styles:{
    				height:"100%",
    				width:"100%"
    			}
    		});
    		var historyTab =  {
    				label :NLSInfra.activity,
    				content:historycontainer,
    				icon : {iconName: 'navigation-history', fontIconFamily: 1},
    				isSelected:tabSelected,
    				index : 100,
    				value : 'Activity'
    		};
    		tabsComponent.add(historyTab);
    		
    		var renderHistory=function(historyContainer){
    			historyContainer.empty();
    			that.render().inject(historyContainer);
    		};
    		
    		tabsComponent.addEventListener('tabButtonClick', function(){
    			let selectedTab=tabsComponent.value[0];
    			if(selectedTab==="Activity"){
    				renderHistory(historycontainer);
    			}
    		});
    		
    		if(tabSelected){
    			renderHistory(historycontainer);
    		}
        }
    });

    return Timeline;
});
