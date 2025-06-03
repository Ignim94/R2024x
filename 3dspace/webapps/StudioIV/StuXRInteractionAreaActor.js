define('DS/StudioIV/StuXRInteractionAreaActor',
	['DS/StuCore/StuContext', 'DS/EPTaskPlayer/EPTask', 'DS/StuRenderEngine/StuActor3D', 'DS/StudioIV/StuXRManager'],
	function (STU, Task, Actor3D, XRManager) {
		'use strict';

		/**
		 * VR Process HANDLER TASK.
		 * @class 
		 * @private
		 */
		// In order to improve performances we want to cache picking results done in a same frame 
		// To do that we need a post process task to clean the cache after all the behavioral execution.
		var XRInterAreaPostProcessTask = function (behHandler) {
			Task.call(this);
			this.name = "XRInterAreaPostProcessTask";
			this.behHandler = behHandler;
		};

		XRInterAreaPostProcessTask.prototype = new Task();
		XRInterAreaPostProcessTask.prototype.constructor = XRInterAreaPostProcessTask;

		/**
		 * Method called each frame by the task manager
		 *
		 * @method
		 * @private
		 * @param  iExeCtx Execution context
		 */
		XRInterAreaPostProcessTask.prototype.onExecute = function (iExContext) {
			if (this.behHandler === undefined || this.behHandler === null) {
				return this;
			}
			var behHandler = this.behHandler;

			if (behHandler !== undefined && typeof behHandler.postExecute === "function") {
				behHandler.postExecute(iExContext);
			}
		};

		/**
		 * Describes a XR interaction area.<br/>
		 *
		 * @exports XRInteractionAreaActor
		 * @class
		 * @constructor
		 * @noinstancector
		 * @public
		 * @extends STU.Actor3D
		 * @memberof STU
		 * @alias STU.XRInteractionAreaActor
		 */
		var XRInteractionAreaActor = function () {
			Actor3D.call(this);
			this.name = 'XRInteractionAreaActor';

			/**
			 * Private object that hold the cache containing the picked transforms 
			 *
			 * @member
			 * @instance
			 * @name _pickingTransforms
			 * @private
			 * @type {Array.<STU.Intersection>}
			 * @memberof STU.XRInteractionAreaActor
			 */
			this._pickingTransforms = {};
		};

		XRInteractionAreaActor.prototype = new Actor3D();
		XRInteractionAreaActor.prototype.constructor = XRInteractionAreaActor;

		/**
		 * Process to execute when this STU.XRInteractionAreaActor is initializing.
		 *
		 * @method
		 * @private
		 * @see STU.XRInteractionAreaActor#onDispose
		 */
		XRInteractionAreaActor.prototype.onActivate = function (oExceptions) {
			// XR Manager is instantiated by the XRInteractionAreaActor
			// this is done to avoid XR manager creation when there is no XR device in the experience
			STU.registerManager(XRManager);

			var XRMgrInstance = XRManager.getInstance();

			if (XRMgrInstance.initialized !== true) {
				XRMgrInstance.initialize(oExceptions);
				XRMgrInstance._interactionAreaActor = this;
			}
			else {
				console.error("There should be only one XRInteractionAreaActor");
			}

			// LBN9 - IR-754777 - Activate actors after register manager, because start function of Actor3D call STU.XRManager.getInstance(). 
			Actor3D.prototype.onActivate.call(this, oExceptions);

			// Add the post process task to the task player 
			this._XRInterAreaPostProcessTask = new XRInterAreaPostProcessTask(this);
			EP.TaskPlayer.addTask(this._XRInterAreaPostProcessTask, STU.getTaskGroup(STU.ETaskGroups.ePostProcess));

			// Disable picking each frames 
			var clickableMgr = STU.ClickableManager.getInstance();
			EP.EventServices.removeListener(EP.MouseMoveEvent, clickableMgr.mouseMoveCb);

			// Disable main viewer refresh if needed
			if (XRMgrInstance._XRHeadsetActor !== undefined && XRMgrInstance._XRHeadsetActor !== null) {
				if (XRMgrInstance._XRHeadsetActor.refreshMainViewer) {
					XRMgrInstance.activateMainViewerRefresh();
				}
				else {
					XRMgrInstance.deactivateMainViewerRefresh();
				}
			}
			else {
				console.warn("No XR Headset actor detected, enabling main viewer refresh by default.")
				XRMgrInstance.activateMainViewerRefresh(); //if there is no headset we have to activate the main viewer refresh to see something move
			}

			// Ask the vive engine to actually start 
			XRMgrInstance.startXRViewer();
		};


		/**
		 * Process executed when XRInteractionAreaActor is deactivating
		 *
		 * @method
		 * @private
		 */
		XRInteractionAreaActor.prototype.onDeactivate = function () {
			// remove explicit task to stop the update
			EP.TaskPlayer.removeTask(this._XRInterAreaPostProcessTask);
			delete this._XRInterAreaPostProcessTask;

			Actor3D.prototype.onDeactivate.call(this);
		};

		/**
		 * Process to execute each frame
		 *
		 * @method
		 * @private
		 */
		XRInteractionAreaActor.postExecute = function () {
			// Cleaning of the cache containing picking results
			var _pickingTransforms = STU.XRManager._pickingTransforms;
			for (var prop in _pickingTransforms) {
				if (_pickingTransforms.hasOwnProperty(prop)) {
					delete _pickingTransforms[prop];
				}
			}
		};

		/**
		 * Set the Interaction Area transform of the XR engine
		 *
		 * @method
		 * @private
		 * 
		 * @param {DSMath.Transformation} iTransform New transform of the interaction area
		 * @param {STU.Actor3D} iRef STU.Actor3D corresponding to the referential.
		 */
		XRInteractionAreaActor.prototype.setTransform = function (iTransform, iRef) {
			Actor3D.prototype.setTransform.call(this, iTransform, iRef);

			var newTransform = Actor3D.prototype.getTransform.call(this, "Visu");
			STU.XRManager.getInstance().setInteractionAreaTransform(newTransform);
		};

		// Expose in STU namespace.
		STU.XRInteractionAreaActor = XRInteractionAreaActor;

		return XRInteractionAreaActor;
	});

define('StudioIV/StuXRInteractionAreaActor', ['DS/StudioIV/StuXRInteractionAreaActor'], function (XRInteractionAreaActor) {
	'use strict';

	return XRInteractionAreaActor;
});
