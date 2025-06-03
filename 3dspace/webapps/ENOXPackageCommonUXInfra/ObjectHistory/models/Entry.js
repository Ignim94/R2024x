/**
 @extends UWA/Class/Model

 @requires UWA/Class/Model

 @requires @sub DS/ENOXPackageCommonUXInfra/ObjectHistory/collections/Entries
 **/
define('DS/ENOXPackageCommonUXInfra/ObjectHistory/models/Entry', [
    'UWA/Class/Model'
], function (Model) {

    'use strict';


    // To set the id for each model
    var _count = 0;

    var Entry = Model.extend({
        name: 'DS/ENOXPackageCommonUXInfra/ObjectHistory/models/Entry',

        // Default attributes for the timeline entry
        defaults: {

            // Attributes
            id: '',
            physicalId: '',
            date: '',
            title: '',
            action: '',
            state: '',
            author: {
                user: '',
                fullName: ''
            },
            content: '',
            timestamp: 0,

            // If any sub entries
            subEntries: null,

            // Computed here for the UX
            icon: 'fonticon-info',
            className: 'primary'
        },


        /**
         * See UWA documentation.
         * @inheritDoc
         */
        setup: function () {
            var that = this;

            // The id
            that.set('id', _count += 1);

            // Convert the date to timestamp
            that.set({
                timestamp: new Date(that.get('date')).getTime()
            });

            // If we have any sub entries, we create a new collection inside our entry
            // WARNING: Used to avoid circular reference
            var EntriesModule = require('DS/ENOXPackageCommonUXInfra/ObjectHistory/collections/Entries');
            if (that.get('subEntries') && Array.isArray(that.get('subEntries')) && that.get('subEntries').length > 0) {
                that.set('subEntries', new EntriesModule(that.get('subEntries')));
            } else {
                that.set('subEntries', null);
            }
            
        }
    });

    return Entry;
});
