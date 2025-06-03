//XSS_CHECKED
/* global UWA */
define('DS/ENOXPackageManagement/components/xPackageManagementRouter/xPackageManagementRouter',
['UWA/Class',
 'DS/ENOXPackageCommonUXInfra/router.utils'],
function (Class, RouterUtils) {
	'use strict';

  var packageManagementRouter = Class.singleton({
    initialize : function () {
      var routes = [{ name: 'home', path: '/home' }];
      this._router = RouterUtils.createRouter(routes, {
          defaultRoute: 'home.MyPackages',
          defaultParams: {},
          trailingSlash: false,
          useTrailingSlash: undefined,
          autoCleanUp: false,
          strictQueryParams: true,
          allowNotFound: false
      }, true, true);

      RouterUtils.listenToRouterStateChanges(this._router);
    },

    addRoute : function (route) {
      this._router.add(route);
    },

    addRouteMethods : function (state, methods) {
      if(!this._router.routerMethods) {
        this._router.routerMethods = {};
      }
      if(UWA.is(methods, 'object')) {
        this._router.routerMethods[state] = methods;
      }
    },

    start : function (path) {
      this._router.start(path);
    },

    navigate : function () {
      this._router.navigate.apply(this._router, arguments);
    },

    getRouter : function () {
      return this._router;
    },

    setDependency : function (name, value) {
      this._router.setDependency(name, value);
    },

    getDependency : function (name) {
      return this._router.getDependencies()[name];
    },

    isActive : function(routeName) {
    	return this._router.isActive(routeName);
    }
  });

  return packageManagementRouter;
});
