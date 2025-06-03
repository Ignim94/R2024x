/* global define , StuVisuServices , StuViewer , StuGeomPrimitive_ISOManager , stu__GlobeServices*/
define('DS/StuWebPlayer/StuWebPlayerNA', ['DS/StuWebPlayer/StuWebPlayer'], function (WebPlayer) {
    'use strict';

    WebPlayer.prototype.sendMessage = function () {
        console.error('Web only method. Not supported on Native Stack.');
    };

    return WebPlayer;
});

define('DS/StuWebPlayer/StuWebPlayerNA', ['DS/StuWebPlayer/StuWebPlayerNA'], function (WebPlayer) {
    'use strict';

    return WebPlayer;
});
