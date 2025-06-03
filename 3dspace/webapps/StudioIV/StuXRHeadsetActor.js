define('DS/StudioIV/StuXRHeadsetActor',
	['DS/StuCore/StuContext', 'DS/EPTaskPlayer/EPTask', 'DS/StuRenderEngine/StuCameraNa', 'DS/StudioIV/StuXRManager', 'DS/EPEventServices/EPEvent', 'DS/EPEventServices/EPEventServices'],
	function (STU, Task, Camera, XRManager, Event, EventServices) {
		'use strict';

		/**
		 * VR Process Transform update TASK.
		 * @class 
		 * @private
		 */
		// We need to create a task to update each frame the pos
		var XRHeadsetUpdateTask = function (actHandler) {
			Task.call(this);
			this.name = "XRHeadsetUpdateTask";
			this.actHandler = actHandler;
		};

		XRHeadsetUpdateTask.prototype = new Task();
		XRHeadsetUpdateTask.prototype.constructor = XRHeadsetUpdateTask;

		/**
		 * Method called each frame by the task manager
		 *
		 * @method
		 * @private
		 * @param  iExeCtx Execution context
		 */
		XRHeadsetUpdateTask.prototype.onExecute = function (iExContext) {
			if (this.actHandler === undefined || this.actHandler === null) {
				return this;
			}
			var actHandler = this.actHandler;

			if (actHandler !== undefined && typeof actHandler.onExecute === "function") {
				actHandler.onExecute(iExContext);
			}
		};


        /**
        * This event is thrown when the headset is taken off the user head
        *
        * @exports XRHeadsetTakenOffEvent
        * @class
        * @constructor
        * @noinstancector
        * @public
        * @extends EP.Event
        * @memberof STU
        */
		var XRHeadsetTakenOffEvent = function () {
			Event.call(this);
		};

		XRHeadsetTakenOffEvent.prototype = new Event();
		XRHeadsetTakenOffEvent.prototype.constructor = XRHeadsetTakenOffEvent;
		XRHeadsetTakenOffEvent.prototype.type = 'XRHeadsetTakenOffEvent';

		// Expose in STU namespace.
		STU.XRHeadsetTakenOffEvent = XRHeadsetTakenOffEvent;
		EventServices.registerEvent(XRHeadsetTakenOffEvent);

        /**
        * This event is thrown when the headset is put on the user head
        *
        * @exports XRHeadsetPutOnEvent
        * @class
        * @constructor
        * @noinstancector
        * @public
        * @extends EP.Event
        * @memberof STU
        */
		var XRHeadsetPutOnEvent = function () {
			Event.call(this);
		};

		XRHeadsetPutOnEvent.prototype = new Event();
		XRHeadsetPutOnEvent.prototype.constructor = XRHeadsetPutOnEvent;
		XRHeadsetPutOnEvent.prototype.type = 'XRHeadsetPutOnEvent';

		// Expose in STU namespace.
		STU.XRHeadsetPutOnEvent = XRHeadsetPutOnEvent;
		EventServices.registerEvent(XRHeadsetPutOnEvent);



        /**
         * Describes a XR Headset Actor.<br/>
         * 
         *
         * @exports XRHeadsetActor
         * @class
         * @constructor
         * @noinstancector
         * @public
         * @extends STU.Camera
         * @memberof STU
         * @alias STU.XRHeadsetActor
         */
		var XRHeadsetActor = function () {
			Camera.call(this);
			this.name = 'XRHeadsetActor';

			//////////////////////////////////////////////////////////////////////////
			// Properties that should NOT be visible in UI
			//////////////////////////////////////////////////////////////////////////

			/**
			 * Private object that hold the button related to headset wornability
			 *
			 * @member
			 * @instance
			 * @name _headsetWornButtonID
			 * @private
			 * @type {Object}
			 * @memberof STU.XRHeadsetActor
			 */
			this._headsetWornButtonID = "bHeadsetWorn"; //this string specific will have to change when changing the input management of XR Device

			/**
			 * Private object that hold the reference to the instance of the XRManager
			 *
			 * @member
			 * @instance
			 * @name _XRMgr
			 * @private
			 * @type {Object}
			 * @memberof STU.XRHeadsetActor
			 */
			this._XRMgr = null;
		};

		XRHeadsetActor.prototype = new Camera();
		XRHeadsetActor.prototype.constructor = XRHeadsetActor;

        /**
		 * Process executed when XRHeadsetActor is activating
         * 
		 * @method
         * @private
         */
		XRHeadsetActor.prototype.onActivate = function (oExceptions) {
			Camera.prototype.onActivate.call(this, oExceptions);

			// Add Listener to get notified : Registers listeners for headset state
			EventServices.addObjectListener(EP.DevicePressEvent, this, '_onDevicePressEvent');
			EventServices.addObjectListener(EP.DeviceReleaseEvent, this, '_onDeviceReleaseEvent');

			// need to create an implicit execute task to the task player as it is not a behavior
			this._XRHeadsetUpdateTask = new XRHeadsetUpdateTask(this);
			EP.TaskPlayer.addTask(this._XRHeadsetUpdateTask, STU.getTaskGroup(STU.ETaskGroups.ePostProcess));

			// XR manager reference
			if (XRManager !== null && XRManager !== undefined && typeof XRManager.getInstance === "function") {
				this._XRMgr = XRManager.getInstance();

				// register the XR Headset actor in XRManager
				this._XRMgr._XRHeadsetActor = this;
			}
		};

        /**
		 * Process executed when XRHeadsetActor is deactivating
         * 
		 * @method
         * @private
         */
		XRHeadsetActor.prototype.onDeactivate = function () {
			// Remove Listener when you don't need it anymore : Unregisters listeners for headset state
			EventServices.removeObjectListener(EP.DevicePressEvent, this, '_onDevicePressEvent');
			EventServices.removeObjectListener(EP.DeviceReleaseEvent, this, '_onDeviceReleaseEvent');

			// remove explicit task to stop the update
			EP.TaskPlayer.removeTask(this._XRHeadsetUpdateTask);
			delete this._XRHeadsetUpdateTask;

			Camera.prototype.onDeactivate.call(this);
		};

		/**
		 * Update method called each frames => actually called by XRHeadsetUpdateTask
		 * @method
		 * @private
		 */
		XRHeadsetActor.prototype.onExecute = function () {
			// The headset transform is relative to the interaction context
			var XRHeadsetTransform = this._XRMgr.getHeadsetTransform();
			this.setTransform(XRHeadsetTransform, this._XRMgr.getInteractionArea());
		};

		/**
		 * Method called as listener is triggered to DevicePressEvent to dispatch XRHeadsetPutOnEvent
		 * @method
		 * @private
		 */
		XRHeadsetActor.prototype._onDevicePressEvent = function (iEvent) {
			if (iEvent.buttonName !== this._headsetWornButtonID) {
				return;
			}
			else {
				this.dispatchEvent(new XRHeadsetPutOnEvent());
			}
		};

		/**
		 * Method called as listener is triggered to DeviceReleaseEvent to dispatch XRHeadsetTakenOffEvent
		 * @method
		 * @private
		 */
		XRHeadsetActor.prototype._onDeviceReleaseEvent = function (iEvent) {
			if (iEvent.buttonName !== this._headsetWornButtonID) {
				return;
			}
			else {
				this.dispatchEvent(new XRHeadsetTakenOffEvent());
			}
		};

		/**
		 * True when the headset is on top of the user head, false otherwise 
		 * 
		 * @public
		 * @return {Boolean}
		 */
		XRHeadsetActor.prototype.isWorn = function () {
			var XRHeadset = this._XRMgr.getXRHeadset();
			if (XRHeadset !== null && XRHeadset !== undefined) {
				return XRHeadset.isButtonNamePressed(this._headsetWornButtonID);
			}
			else {
				return false;
			}
		};

		// Expose in STU namespace.
		STU.XRHeadsetActor = XRHeadsetActor;

		return XRHeadsetActor;
	});
