
define('DS/ENOXPackageCommonUXInfra/ObjectHistory/views/Row', [
    'UWA/Class/Promise',
    'UWA/Class/View',
    'UWA/Core',

    'DS/UIKIT/Tooltip',

    'DS/ENOXPackageCommonUXInfra/CommonUtils/CommonUtils',
    'css!DS/ENOXPackageCommonUXInfra/ObjectHistory/SourcingTimeline.css',
    'css!DS/ENOXPackageCommonUXInfra/ObjectHistory/views/Row.css'
], function (Promise, View, UWA, Tooltip,Utils) {

    'use strict';

    var Row = View.extend({
        name: 'DS/ENOXPackageCommonUXInfra/ObjectHistory/views/Row',

        tagName: 'div',

        className: 'timeline-row',

        // The logger
        _logger: null,

        // The parent view
        parent: null,

        // To know if we are a sub row or not
        isSubRow: false,

        // Data fetched dynamically about the row, to highlight some information
        data: {},

        // This row might have sub entries encapsulated
        subRows: [],

        // Elements of the row
        elements: {
            icon: null,
            expander: null,
            panel: null
        },

        // To know if the row has been expanded or not
        isExpanded: false,

        // To know if the sub rows have been rendered at least once
        _isSubRowsRendered: false,

        // To destroy the tooltips at the end
        _tooltips: [],

        /**
         * See UWA documentation.
         * @inheritDoc
         */
        setup: function (options) {
            var that = this;

            // Set the container id
            that.container.set('id', 'row_' + that.model.get('id'));

            // The parent view
            that.parent = options.parent;

            // Flag to know if we are a sub row or not
            that.isSubRow = options.isSubRow === true;

            // The data fetched about this row, not related to the model
            that.data = {};

            // The sub rows
            that.subRows = [];

            // The elements
            that.elements = {
                icon: null,
                expander: null,
                panel: null
            };

            // Flag for the expand status
            that.isExpanded = false;

            // Flag to know if we need to render the sub rows during an expand
            that._isSubRowsRendered = false;

            // To keep the tooltips
            that._tooltips = [];

            //var subEntries = that.model.get('subEntries');
            /*if (subEntries !== null && subEntries.length > 0) {
                subEntries.forEach(function (subEntry) {
                    var subRow = new Row({
                        model: subEntry,
                        parent: that.parent,
                        isSubRow: true
                    });

                    that.subRows.push(subRow);
                });
            }*/

            return that;
        },

        /**
         * See UWA documentation.
         * @inheritDoc
         */
        render: function () {
            var that = this;

            var userImage=null, header = null, panel = null, expander = null;

            // Special CSS if we are a sub row
            /*if (that.isSubRow === true) {
                that.container.addClassName('sub');
            }*/
            
            var userImgHTML=Utils.getUserImageElement(that.model.get('author'));
            
            that.elements.userImage=userImage=UWA.createElement('div', {
                'class': 'timeline-row-header-user-image',
                html:userImgHTML 
            });
            
            that.elements.header = header = UWA.createElement('div', {
                'class': 'timeline-row-header',
                html: [UWA.createElement('span', {
                    'class': 'timeline-row-header-user',
                    html: [ UWA.createElement('span', {
                        'class': 'timeline-row-header-user-name',
                        html: Utils.escapeHtml(that.model.get('author').fullName)
                    })]
                }), UWA.createElement('span', {
                    'class': 'timeline-row-header-date',
                    html: that.model.get('date')
                })]
            });


            // Show the expander if we have encapsulated sub rows
            /*if (that.subRows.length > 0) {
                that.elements.expander = expander = UWA.createElement('div', {
                    'class': 'expander',
                    html: NLS.history_showdetails?NLS.history_showdetails:"Show details"
                });
            }*/
           var panelHTML= that.model.get("isDummyRow")?[expander !== null ? expander : '']:[userImage,header, UWA.createElement('div', {
                    'class': 'panel-body',
                    html: that.model.get('content')
                }), expander !== null ? expander : ''];
            that.elements.panel = panel = UWA.createElement('div', {
                'class': 'timeline-panel timeline-content',
                html:panelHTML 
            });

            // Set the content of the row
            that.container.setContent([{
                html: [panel] // [rowTime, rowIcon, rowPanel]
            }]);

            // If we have authoring operations, we can show a tooltip to add more information
            var modifiedOperations = UWA.Element.getElements.call(that.container, '.timeline-operations-tooltip');
            modifiedOperations.forEach(function (mod) {
                that._tooltips.push(new Tooltip({
                    position: 'top',
                    target: mod,
                    body: '<ul class="mod-Panel" >' + mod.dataset.list + '</ul>',
                    trigger: 'touch'
                }));
            });

            // Fetch dynamic content if necessary
            that._fetchContentData();

            // Hear hear
            //that._subscribers();

            return that;
        }/*,
        
        *//**
         * To show the current row.
         *//*
        show: function () {
            var that = this;
            that.container.setStyle('display', 'inherit');

            // Dispatch a scroll event to add the active class to the visible rows
            that.parent.dispatchEvent('onScroll', {
                height: that.parent.container.offsetHeight,
                position: that.parent._position
            });
        }*//*,

        *//**
         * To hide the current row.
         *//*
        hide: function () {
            var that = this;
            that.container.setStyle('display', 'none');

            that.container.removeClassName('active');
        }*//*,

        *//**
         * Expands this row by rendering OR showing the sub rows (if already rendered).
         *//*
        expand: function () {
            var that = this;

            // We need to render the rows
            if (that._isSubRowsRendered === false) {
                that._isSubRowsRendered = true;
                for (var i = 0; i < that.subRows.length; i++) {
                	let subrow=that.subRows[i];
                    that.container.parentNode.insertBefore(subrow.render().container, that.container);
                    
                    // Add the row to the parent view too, to benefit from the scroller animation
                    that.parent.addRow(subrow);

                    if (!subrow.container.hasClassName('active')) {
                    	subrow.container.addClassName('active');
					}
                }
            } else { // We can show the rows
                for (var j = 0; j < that.subRows.length; j++) {
                    that.subRows[j].show();
                }
            }
        }*//*,

        *//**
         * Collapses all the sub rows by hiding them.
         *//*
        collapse: function () {
            var that = this;

            for (var i = 0; i < that.subRows.length; i++) {
                that.subRows[i].hide();
            }
        }*/,

        /**
         * Fetch dynamic data related to the content, for example data related to an ENOVIA object.
         * @private
         */
        _fetchContentData: function () {
            // NO OP
        }/*,

        *//**
         * Hear hear.
         * @private
         *//*
        _subscribers: function () {
            var that = this;
            that.expand();
            if (that.elements.expander !== null) {
                that.elements.expander.addEventListener('click', function (event) {
                    if (that.isExpanded === false) {
                        that.isExpanded = true;
                        let label=NLS.history_hidedetails?NLS.history_hidedetails:"Hide details";
                        that.elements.expander.setContent(label);
                        that.expand();
                    } else {
                        that.isExpanded = false;
                        let label=NLS.history_showdetails?NLS.history_showdetails:"Show details";
                        that.elements.expander.setContent(label);
                        that.collapse();
                    }
                });
            }
        }*/
    });

    return Row;
});
