/**
 @requires UWA/Class/View
 @requires UWA/Core

 @requires DS/UIKIT/Mask
 @requires DS/UIKIT/Scroller

 @requires DS/Logger/Logger

 @requires DS/ENOXPackageCommonUXInfra/ObjectHistory/collections/Entries
 @requires DS/ENOXPackageCommonUXInfra/ObjectHistory/views/Row

 @requires i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra
 @requires css!DS/ENOXPackageCommonUXInfra/ObjectHistory/SourcingTimeline.css
 **/
define('DS/ENOXPackageCommonUXInfra/ObjectHistory/views/Rows', [
	'UWA/Class/Promise',
	'UWA/Class/View',
	'UWA/Core',

	'DS/UIKIT/Mask',
	'DS/UIKIT/Scroller',

	'DS/ENOXPackageCommonUXInfra/ObjectHistory/collections/Entries',
	'DS/ENOXPackageCommonUXInfra/ObjectHistory/views/Row',

	'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
	'css!DS/ENOXPackageCommonUXInfra/ObjectHistory/SourcingTimeline.css',
	'css!DS/ENOXPackageCommonUXInfra/ObjectHistory/views/Rows.css'
	], function (Promise, View, UWA, Mask, Scroller, Entries, Row, NLS /*, CSS*/) {

	'use strict';

	var _CONSTANTS = {

			// The limit width to switch to alternate view
			FLAT_LIMIT: 9999
	};

	var Rows = View.extend({
		name: 'DS/ENOXPackageCommonUXInfra/ObjectHistory/views/Rows',

		tagName: 'div',

		className: 'timeline-default flat animated',

		// Default options
		defaultOptions: {
			parser: '',
			flat: _CONSTANTS.FLAT_LIMIT
		},

		// A reference to the timeline class
		parent: null,

		// The object to get history from
		physicalId: '',

		// The logger
		_logger: null,

		// The scroller
		_scroller: null,

		// The current position in the scroller
		_position: 0,

		// The rows
		_rows: [],

		/**
		 * See UWA documentation.
		 * @inheritDoc
		 */
		setup: function (options) {
			var that = this;

			options = UWA.merge(options || {}, that.defaultOptions);
			that._parent(options);

			// The parent view
			that.parent = options.parent;

			// The object to get history from
			that.physicalId = options.physicalId;
			that.objectTitle = options.objectTitle;

			// We get the history from the root id, the current object
			var entries = that.collection = new Entries([], {
				physicalId: that.physicalId,
				objectTitle: that.objectTitle
			});

			// Hear hear
			that.listenTo(entries, 'onReset', that._onReset);
			that.listenTo(that, 'onScroll', that._onScroll);

			// Fetch all the entries from the current object
			entries.fetch({
				reset: true,
				parser: null,
				onComplete: function () {
					// NO OP
				},
				activityMappingObject:options.activityMappingObject
			});

			// Information to keep for the scroller
			that._scroller = null;
			that._position = 0;
			that._rows = [];

			return that;
		},

		/**
		 * See UWA documentation.
		 * @inheritDoc
		 */
		render: function () {
			var that = this;

			// First thing first, set the height for the scroller
			that.container.setAttribute('id', 'timeline-top');

			// The main container
			var main = UWA.createElement('div', {
				'class': 'timeline-main'
			});

			// Inject the scroller
			that._scroller = new Scroller({
				element: that.container
			}).inject(main);

			// On scroll function
			var onScroll = function (/*event*/) {
				var currentPosition = that._position = that._scroller._infos.y.scrollPosition;
				that.dispatchEvent('onScroll', {
					height: that.container.offsetHeight,
					position: currentPosition
				});
			};

			// Bind the scroll event
			var elementEvents = {
					scroll: onScroll.bind(this)
			};

			that._scroller.elements.content.addEvents(elementEvents);

			// Loading
			Mask.mask(that.container);

			return that;
		},

		/**
		 * See UWA documentation.
		 * @inheritDoc
		 */
		_onReset: function (collection, options) {
			var that = this;

			var scrollerContent = that._scroller.getInnerElement();

			// We display from the newest to the oldest
			if (collection.length > 0) {

				that.container.addClassName('timeline');

				collection.forEach(function (model) {

					var row = new Row({
						model: model,
						parent: that,
						options: options
					}).render();

					// Keep the row for the scroller
					that.addRow(row);

					// Insert the row inside the scroller
					scrollerContent.insertBefore(row.container, scrollerContent.firstChild);
				});

				Mask.unmask(that.container);

				// We dispatch an scroll event at the beginning to active visible rows
				that.dispatchEvent('onScroll', {
					height: that.container.offsetHeight,
					position: 0
				});
			} else {

				that.container.removeClassName('timeline');

				// To display message here
				var errorMessage = UWA.createElement('div', {
					'class': 'timeline-error',
					html: NLS.history_norecords
				});

				scrollerContent.insertBefore(errorMessage, scrollerContent.firstChild);
				Mask.unmask(that.container);

				that.dispatchEvent('onScroll', {
					height: that.container.offsetHeight,
					position: 0
				});
			}
		},

		/**
		 * Adds a row to our list.
		 * @param {Row} row - The row to add.
		 */
		addRow: function (row) {
			var that = this;
			that._rows.push(row);
		},

		/**
		 * Event called for every scroll.
		 * @param {Object} options - Options related to the scroller.
		 * @private
		 */
		_onScroll: function (options) {
			var that = this;

			var height = options.height;

			var data = that._rows;
			for (var i = 0; i < data.length; i++) {
				var row = data[i].container;
				var bottomOfObject = (row.getBoundingClientRect().top - that.container.getBoundingClientRect().top) +
				row.offsetHeight;

				if (height > bottomOfObject) {

					// If not already active
					if (!row.hasClassName('active')) {
						row.addClassName('active');
					}
				}
			}
		}
	});

	return Rows;
});
