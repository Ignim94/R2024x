/**
* @name DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DCameraViewer
* @implements {DS/StudioUIActorModelWeb/interfaces/CATI3DXUIRep}
* @constructor
*
* @description
* CATI3DXUIRep implementation for CXP2DCameraViewer_Spec
*/
define('DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DCameraViewer',
[
	'UWA/Core',
    'DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DUIActor',
    'DS/StudioUIActorModelWeb/controls/CXPCameraViewerControl'
],
function (UWA, CATE3DXUIRep2DUIActor, CXPCameraViewerControl) {
	'use strict';

	var CATE3DXUIRep2DCameraViewer = CATE3DXUIRep2DUIActor.extend(
	/** @lends DS/StudioUIActorModelWeb/extensions/CATE3DXUIRep2DCameraViewer.prototype **/
	{

        _Fill: function(iContainer) {
            this._parent(iContainer);

            this._cameraViewer = new CXPCameraViewerControl().inject(iContainer);

            let cameraViewerEO = this.QueryInterface('CATI3DExperienceObject');

            this._SetCamera(cameraViewerEO.GetValueByName('camera'));
            this._ListenVariableChanges(cameraViewerEO, 'camera');

            this._SetLiveUpdate(cameraViewerEO.GetValueByName('liveUpdate'));
            this._ListenVariableChanges(cameraViewerEO, 'liveUpdate');

            this._SetEnabled(cameraViewerEO.GetValueByName('enabled'));
            this._ListenVariableChanges(cameraViewerEO, 'enabled');
        },

        _UpdateProperty: function(iProps) {
            let iVariableName = iProps[0];
            let cameraViewerEO = this.QueryInterface('CATI3DExperienceObject');
            if (iVariableName === 'camera') {
                this._SetCamera(cameraViewerEO.GetValueByName('camera'));
            }  else if (iVariableName === 'liveUpdate') {
                this._SetLiveUpdate(cameraViewerEO.GetValueByName('liveUpdate'));
            } else if (iVariableName === 'enabled') {
                this._SetEnabled(cameraViewerEO.GetValueByName('enabled'));
            } else {
                this._parent(iProps);
            }
        },

        RegisterPlayEvents: function(iSDKObject) {
			this._parent(iSDKObject);

            this._cameraViewer.onClick = function() {iSDKObject.doUIDispatchEvent('UIClickEvent');};
            this._cameraViewer.onDoubleClick = function() {iSDKObject.doUIDispatchEvent('UIDoubleClickEvent');};
            this._cameraViewer.onRightClick = function() {iSDKObject.doUIDispatchEvent('UIRightClickEvent');};
            this._cameraViewer.onEnter = function() {iSDKObject.doUIDispatchEvent('UIEnterEvent');};
            this._cameraViewer.onExit = function() {iSDKObject.doUIDispatchEvent('UIExitEvent');};
            this._cameraViewer.onHover = function() {iSDKObject.doUIDispatchEvent('UIHoverEvent');};
            this._cameraViewer.onPress = function() {iSDKObject.doUIDispatchEvent('UIPressEvent');};
            this._cameraViewer.onRelease = function() {iSDKObject.doUIDispatchEvent('UIReleaseEvent');};
		},

		ReleasePlayEvents: function() {
			this._parent();

            this._cameraViewer.onClick = null;
            this._cameraViewer.onDoubleClick = null;
            this._cameraViewer.onRightClick = null;
            this._cameraViewer.onEnter = null;
            this._cameraViewer.onExit = null;
            this._cameraViewer.onHover = null;
            this._cameraViewer.onPress = null;
            this._cameraViewer.onRelease = null;
		},

        _SetCamera: function(iCamera) {
            this._cameraViewer.camera = iCamera;
        },

        _SetLiveUpdate: function(iLiveUpdate) {
            this._cameraViewer.liveUpdate = iLiveUpdate;
        },

        _SetEnabled: function(iEnabled) {
            this._cameraViewer.disabled = !iEnabled;
        }

	});
	return CATE3DXUIRep2DCameraViewer;
});
