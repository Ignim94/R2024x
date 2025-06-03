define('DS/StuVirtualObjects/StuPathActor', ['DS/StuCore/StuContext', 'DS/MathematicsES/MathsDef', 'DS/StuRenderEngine/StuActor3D'], function (STU, DSMath, Actor3D) {
	'use strict';

    /**
    * Describe a path object.
    *
    * @exports PathActor
    * @class
    * @constructor
	* @noinstancector
    * @public
    * @extends STU.Actor3D
    * @memberof STU
    * @alias STU.PathActor
    */
	var PathActor = function () {
		Actor3D.call(this);

		this.VIAIIxpVirtualPath;


		//
		// A path has no color
		// This Object.defineProperty is intended to overwrite Actor3D.color
		//
		Object.defineProperty(this, 'color', {
			enumerable: true,
			configurable: true,
			get: function () {
				return new STU.Color(0, 0, 0);
			},
			set: function () { }
		});
	};

	//////////////////////////////////////////////////////////////////////////////
	//                           Prototype definitions                          //
	//////////////////////////////////////////////////////////////////////////////
	PathActor.prototype = new Actor3D();
	PathActor.prototype.constructor = PathActor;


	/**
	 * Returns the length of this STU.PathActor.
	 *
	 * @method
	 * @public
	 * @return {number} The length value in model unit (mm)
	 */
	// todo: add iRef param like R427
	// * @param {STU.Referential} [iRef] Referential in which to interpret the output length
	PathActor.prototype.getLength = function () {
		//var PathTransfo = this.getTransform(iRef);
		return this.VIAIIxpVirtualPath.GetLength();// * PathTransfo.getScaling().scale;
	};

	// todo: remove and add iRef param in getLength like R427
	/**
	* Returns the length of this STU.PathActor in a given referential
	*
	* @method
	* @private
    * @param {STU.Referential} [iRef] Referential in which to interpret the output length
	* @return {number} The length value in model unit (mm)
	*/
	PathActor.prototype.getLengthInReferential = function (iRef) {
		var PathTransfo = this.getTransform(iRef);
		return this.VIAIIxpVirtualPath.GetLength()* PathTransfo.getScaling().scale;
	};


	/**
	 * Returns the point's coordinate of this STU.PathActor corresponding to the given length ratio.
	 * If you want the point at the curvilinear distance d from the start of the path, you must enter as parameter value:
	 *   iRatio = d/L where L = total length of path given by getLength function
	 * @method
	 * @public
	 * @param {number} iRatio curvilinear distance from start of Path express in ratio of length within the range [0,1]
	 * @param {STU.Referential} [iRef] Referential in which to interpret the output position
	 * @return {DSMath.Vector3D} instance representing the {X,Y,Z} coordinates in model unit (mm)
	 */
	PathActor.prototype.getValue = function (iRatio, iRef) {

		var oCoordinates = new DSMath.Vector3D();
		oCoordinates.x = 0;
		oCoordinates.y = 0;
		oCoordinates.z = 0;

		if (iRatio > 1 || iRatio < 0) {
			console.log('[STU.PathActor.getValue] ratio of length not within the range [0,1]');
			throw new TypeError('iRatio argument is not within the range [0,1]');
		}

		this.VIAIIxpVirtualPath.GetValue(iRatio, this.CATIMovable, oCoordinates);

		var PathPoint = new DSMath.Point(oCoordinates.x, oCoordinates.y, oCoordinates.z);
		var PathTransfo_Ref = this.getTransform(iRef);
		PathPoint.applyTransformation(PathTransfo_Ref);
		oCoordinates.x = PathPoint.x;
		oCoordinates.y = PathPoint.y;
		oCoordinates.z = PathPoint.z;

		return oCoordinates;
	};

/**
 * Returns an array of point corresponding to the discretization of this STU.PathActor
 * iRatio is the distance separating 2 contiguous points, expressed as a ratio of the Length of the path given by getLength function
 * @method
 * @public
 * @param {number} iRatio curvilinear distance increment between 2 Points express in ratio of path's length within the range [0,1]
 * @param {STU.Referential} [iRef] Referential in which to interpret the output positions
 * @return {Array.<DSMath.Vector3D>} array of DSMath.Vector3D corresponding to the discretization Point (coordinates in model unit (mm))
 */
	PathActor.prototype.getDiscretization = function (iRatio, iRef) {
		var oPoints = [];

		if (iRatio > 1 || iRatio < 0) {
			console.log('[STU.PathActor.getDiscretization] lenght ratio increment not within the range [0,1]');
			throw new TypeError('iRatio argument is not within the range [0,1]');
		}

		this.VIAIIxpVirtualPath.GetDiscretization(iRatio, null, oPoints);

		var PathTransfo_Ref = this.getTransform(iRef);
		var PathTransfo = this.getTransform();
		var invPathTransfo = PathTransfo.getInverse();
		var TransfoOutputToReferential = DSMath.Transformation.multiply(invPathTransfo, PathTransfo_Ref);

		oPoints.forEach(function (iPt) {
			var PathPoint = new DSMath.Point(iPt.x, iPt.y, iPt.z);
			PathPoint.applyTransformation(TransfoOutputToReferential);
			iPt.x = PathPoint.x;
			iPt.y = PathPoint.y;
			iPt.z = PathPoint.z;
		}, this);
		return oPoints;
	};


    /**
	 * Process to execute when this STU.PathActor is activating.
	 *
	 * @method
	 * @private
	 */
	PathActor.prototype.onActivate = function (oExceptions) {
		Actor3D.prototype.onActivate.call(this, oExceptions);
		this.VIAIIxpVirtualPath.SetCacheActivation(true);
	};

    /**
	 * Process to execute when this STU.PathActor is deactivating.
	 *
	 * @method
	 * @private
	 */
	PathActor.prototype.onDeactivate = function () {
		this.VIAIIxpVirtualPath.SetCacheActivation(false);
		Actor3D.prototype.onDeactivate.call(this);
	};


	//////////////////////////////////////////////////////////////////////////////
	//                            STU expositions.                              //
	//////////////////////////////////////////////////////////////////////////////

	// Expose only those entities in STU namespace.
	STU.PathActor = PathActor;

	return PathActor;
});

define('StuVirtualObjects/StuPathActor', ['DS/StuVirtualObjects/StuPathActor'], function (PathActor) {
	'use strict';

	return PathActor;
});
