define('DS/SpecRawMaterial/tweakers/UsageDimensionTweaker',

    [
        'DS/WidgetServicesUI/infra/TweakerBase',
        'DS/XSRCommonComponents/components/XPLMNew/tweakers/UsageDimRMTweakerView'
    ],

    function (TweakerBase, UsageDimRMTweakerView) {
        'use strict';

        var tweaker = TweakerBase.extend({
            init: function (options) {
                this._parent(options);
            },

            _build: function (options, callback) {
                //calls only in insert case

               var element = new UsageDimRMTweakerView({tweakerCtx : this})._build();

                

                

                callback.call(this, element);
            },


        });

        return tweaker;
    });
