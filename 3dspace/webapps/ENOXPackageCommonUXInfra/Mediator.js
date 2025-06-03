/**
 * @license Copyright 2017 Dassault Systemes. All rights reserved.
 *
 * @overview : Mediator Component - handling communication between components
 *
 */

define('DS/ENOXPackageCommonUXInfra/Mediator',
   [
      'DS/CoreEvents/ModelEvents' 
   ],

   function (
    ModelEvents) {
        'use strict';
        var _eventBroker = null;
        var mediator = function () {
            // Private variables
            _eventBroker= new ModelEvents();
        };

        /**
        * publish a topic on given channels in param, additional data may go along with the topic published
        * @param {string} eventTopic the topic to publish
        * @param {JSON} data a set of additional data (no data will be passed if null passed in param)
        */
        mediator.prototype.publish = function (eventTopic,data) {
              _eventBroker.publish({ event: eventTopic, data: data }); // publish from ModelEvent
        };

        /**
        *
        * Subscribe to a topic
        * @param {string} eventTopic the topic to subcribe to
        * @param {function} listener the function to be called when the event fires
        * @return {ModelEventsToken}             a token to use when you want to unsubscribe
        */
        mediator.prototype.subscribe = function (eventTopic, listener) {
            return _eventBroker.subscribe({ event: eventTopic },listener);

        };

        /**
        * Unsubscribe to a topic
        * @param  {ModelEventsToken} token  the token returned by the subscribe method.
        */
        mediator.prototype.unsubscribe = function (token) {
            _eventBroker.unsubscribe(token);
        };

        /**
        * Create a new channel in the mediator. Ensures that the created channel is unique
        * @return {integer/string} channelId the id that identifies the channel created
        */
        mediator.prototype.createNewChannel = function () {
            return new ModelEvents();
        };

        mediator.prototype.getApplicationBroker = function(){
          return _eventBroker;
        };

        mediator.prototype.destroy = function(){
          _eventBroker.destroy();
        };



       return mediator;
   });
