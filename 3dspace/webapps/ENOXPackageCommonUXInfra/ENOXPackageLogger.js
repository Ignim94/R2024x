//XSS_CHECKED
/* global widget */

define('DS/ENOXPackageCommonUXInfra/ENOXPackageLogger',
[
    'DS/Logger/Logger'
], function(Logger) {
    'use strict';

    let ENOXPackageLogger = function(app) {
        this.master_logger = Logger.getLogger(app.logname);

        let logger_level = 'off';

        widget.addPreference({
            name: "debug",
            type: "hidden",
            label: app.i18NProvider.enable_debugging,
            defaultValue: false
        });

        logger_level = widget.getValue('debug')?ENOXPackageLogger.LEVEL.DEBUG:ENOXPackageLogger.LEVEL.ERROR;

        this.master_logger.setLevel(logger_level);

        return this.master_logger;
    };
    ENOXPackageLogger.LEVEL = {};
    ENOXPackageLogger.LEVEL.DEBUG = 'debug';
    ENOXPackageLogger.LEVEL.ERROR = 'error';
    ENOXPackageLogger.LEVEL.OFF = 'off';

    return ENOXPackageLogger;
});
