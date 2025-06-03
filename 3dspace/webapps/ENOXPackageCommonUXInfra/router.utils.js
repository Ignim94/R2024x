define('DS/ENOXPackageCommonUXInfra/router.utils',[
    'DS/Router5/js/Router5',
    'DS/Router5/js/Router5BrowserPlugin',
    'DS/Router5/js/Router5ListenersPlugin',
    'DS/Router5/js/Router5Helpers'
], function (router5, browserPlugin, listenersPlugin, helpers) {
	 'use strict';

    return {
        createRouter: function (routes, options, withListenerPlugin, withBrowserPlugin) {
            var router = router5.createRouter(routes, options);

            if (withListenerPlugin) {
                router.usePlugin(listenersPlugin());
                //Used for add listeners to router so that we can manage Activating and Deactivating Nodes
            }
            if (withBrowserPlugin) {
                // router.usePlugin(browserPlugin({
                //     useHash: true
                // }));
            	//Used for updating Browser URL
            }

            return router;
        },
      //Activating and Deactivating Nodes based on FromState and ToState
        listenToRouterStateChanges: function (router) {
            router.addListener(function (toState, fromState) {
            	//transitionPath To identify which routes are to be deactivated and which are to be activated
                var transitionPath = helpers.transitionPath(toState, fromState);

                transitionPath.toDeactivate.forEach(function (state) {
                    if (router.routerMethods[state] !== undefined) {
                        var deactivationMethod = router.routerMethods[state].deactivate;
                        //
                        router.previousRoute = fromState.name;
                        router.previousRoutePath=fromState.path;
                        //
                        if (deactivationMethod !== undefined) {
                            deactivationMethod.call(router.routerMethods[state], toState, fromState);
                        }
                    }
                });

                transitionPath.toActivate.forEach(function (state) {
                    // If activating toState, early exit if noactivate is true (activation is handled by module)
                    if (state === toState.name && toState.params.noactivate) { return; }

                    if (router.routerMethods[state] !== undefined) {
                        var activationMethod = router.routerMethods[state].activate;

                        if (activationMethod !== undefined) {
                            activationMethod.call(router.routerMethods[state], toState, fromState);
                        }
                    }

                });
            });
        }
    };
});
