//XSS_CHECKED
/* global widget */
/* global UWA */
define(
'DS/ENOXPackageManagement/components/Triptych/TriptychWrapper',
[
    'DS/ENOXTriptych/js/ENOXTriptych',
    'css!DS/ENOXPackageManagement/components/Triptych/TriptychWrapper.css'
],
function (
    ENOXTriptych
  ) {
    'use strict';

    var TriptychWrapper = function () { };

    TriptychWrapper.prototype.init = function (applicationChannel, parentContainer) { // left, main, right
        this._left = UWA.createElement('div');
        this._left.classList.add('xTDP-triptych-wrapper-left');
        this._main = UWA.createElement('div');
        this._main.classList.add('xTDP-triptych-wrapper-middle');
        this._right = UWA.createElement('div');
        this._right.classList.add('xTDP-triptych-wrapper-right');

        this._applicationChannel = applicationChannel;
        this._triptych = new ENOXTriptych();
        var leftState = widget.body.offsetWidth < 550 ? 'close' : 'open';
        var triptychOptions = {
            left: {
                resizable: false,//false,
                originalSize: 350,
                originalState: leftState, // 'open' for open, 'close' for close
                overMobile: true
            },
            right: {
                resizable: true,
                originalSize: 450,
                originalState: 'close', // 'open' for open, 'close' for close
                withClose: true,
                overMobile: true,
				minWidth:406
            },
            borderRight : true,
            borderLeft : true,
            container: parentContainer,
            withtransition: true,
            modelEvents: this._applicationChannel
        };
     //   this._triptych.init(triptychOptions, this._left, this._main, this._right, this._left);
        this._triptych.init(triptychOptions, this._left, this._main, this._right);
    };

    TriptychWrapper.prototype.inject = function (container) {
        this._triptych.inject(container);
    };

    // expose Triptych API if need be..
    TriptychWrapper.prototype._getTriptych = function () {
        return this._triptych;
    };

    TriptychWrapper.prototype.getLeftPanelContainer = function () {
        return this._left;
    };

    TriptychWrapper.prototype.getRightPanelContainer = function () {
        return this._right;
    };

    TriptychWrapper.prototype.getMainPanelContainer = function () {
        return this._main;
    };

    return TriptychWrapper;
});
