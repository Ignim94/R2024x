
define('DS/StuModel/StuVariant', [
    'DS/StuCore/StuContext',
    'DS/StuModel/StuInstance',
    'DS/StuModel/StuVariantsManager'
], function (STU, Instance, StuVariantsManager) {
    'use strict';

    /**
     * Describe an Object representing an Experience Variant
     * The variants customize the appearance of a product.
     * They can be imported from an enovia variance dictionary or created by the user
     *
     * @exports Variant
     * @class
     * @constructor
     * @noinstancector
     * @public
     * @extends STU.Instance
     * @alias STU.Variant
     */
    var Variant = function () {
        Instance.call(this);
        this.name = 'Variant';

        /**
         * native object CATI3DExpVariant2
         *
         * @member
         * @private
         * @type {Object}
         */
        this.CATI3DExpVariant2 = null; // valued by CATEVariantSet_StuIBuilder::Build



        /**
         * Variant display name
         * this is the name that appears in the Model definition application UI
         * this name may not be unique (several variants can have the same display name)
         *
         * @member
         * @instance
         * @name displayName
         * @public
         * @type {string}
         * @memberof STU.Variant
         */
        Object.defineProperty(this, "displayName", {
            enumerable: true,
            configurable: true,
            get: function () {
                return this.getDisplayName();
            },
            set: function (iOpacity) {
                // read only
            }
        });

        /**
         * Variant type, see STU.Variant.EVariantType
         *
         * @member
         * @instance
         * @name type
         * @public
         * @type {STU.Variant.EVariantType}
         * @memberof STU.Variant
         */
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            get: function () {
                return this.getType();
            },
            set: function (iOpacity) {
                // read only
            }
        });

    };

    Variant.prototype = new Instance();
    Variant.prototype.constructor = Variant;

        /**
        * Returns the values of this Variant
        *
        * @method
        * @public
        * @return {STU.VariantValue[]} the values of this variant
        */
        Variant.prototype.getValues = function () {
            return this['values'];
        };

    /**
    * returns a value identified by its name
    *
    * @method
    * @public
    * @param {string} iName Name of the value to retrieve.
    * @return {?STU.VariantValue} the variant value
    */
    Variant.prototype.getValueByName = function (iName) {
        for (const value of this.values) {
            if (value.name === iName) {
                return value;
            }
        }
        return null;
    };

    /**
    * returns a value identified by its display name
    * WARNING: if display name is not unique, first value found is used
    * 
    * @method
    * @public
    * @param {string} iName Name of the value to retrieve.
    * @return {?STU.VariantValue} the variant value
    */
    Variant.prototype.getValueByDisplayName = function (iDisplayName) {
        for (const value of this.values) {
            if (value.displayName === iDisplayName) {
                return value;
            }
        }
        return null;
    };

    /**
    * values a Variant to a given Value, identified by its name
    * @method
    * @public
    * @param {string} iName Name of the value used to value this Variant.
    */
    Variant.prototype.setCurrentValueByName = function (iName) {
        var myVariantsManager = StuVariantsManager.get();
        myVariantsManager.setCurrentValueByName(this.CATI3DExpVariant2, iName);
    };


    /**
    * values the Variant to a given Value, identified by its display name
    * WARNING: if display name is not unique, first value found is used
    * @method
    * @public
    * @param {string} iDisplayName display name of the value used to value this Variant.
    */
    Variant.prototype.setCurrentValueByDisplayName = function (iDisplayName) {
        var myVariantsManager = StuVariantsManager.get();
        myVariantsManager.setCurrentValueByDisplayName(this.CATI3DExpVariant2, iDisplayName);
    };

    /**
    *  values the Variant to a given Value
    *
    * @method
    * @public
    * @param {STU.VariantValue} iValue value used to value this Variant.
    */
    Variant.prototype.setCurrentValue = function (iValue) {

        var myVariantsManager = StuVariantsManager.get();
        if (null === iValue) {
            myVariantsManager.unsetCurrentValue(this.CATI3DExpVariant2);
        }
        else {
            myVariantsManager.setCurrentValue(this.CATI3DExpVariant2, iValue.CATI3DExpVariantValue);
        }
    };

    /**
    *  unvalues a Variant 
    * 
    * @method
    * @public
    */
    Variant.prototype.unsetCurrentValue = function () {
        var myVariantsManager = StuVariantsManager.get();
        myVariantsManager.unsetCurrentValue(this.CATI3DExpVariant2);
    };


    /**
     * tests if the Variant is currently set to a given Value
     * @method
     * @public
     * @param {STU.VariantValue} iValue value used to compare to the current value
     * @return {Boolean}
     */
    Variant.prototype.isValueCurrent = function (iValue) {
        var myVariantsManager = StuVariantsManager.get();
        if (myVariantsManager.isValueCurrent(this.CATI3DExpVariant2, iValue.CATI3DExpVariantValue) == 1) {
            return true;
        }
        else {
            return false;
        }
    };

    /**
     * tests if the Variant is currently set to any Value 
     *
     * @method
     * @public
     * @return {Boolean}
     */
    Variant.prototype.isNoValueCurrent = function () {
        var myVariantsManager = StuVariantsManager.get();
        if (myVariantsManager.isNoValueCurrent(this.CATI3DExpVariant2) == 1) {
            return true;
        }
        else {
            return false;
        }
    };


    /**
    * Returns the value at which this Variant is currently valued
    *
    * @method
    * @public
    * @return {STU.VariantValue} the variant at which this Variant is valued.
    */
    Variant.prototype.getCurrentValue = function () {
        var myVariantsManager = StuVariantsManager.get();
        return myVariantsManager.getCurrentValue(this.CATI3DExpVariant2);
    };


    /**
    * Returns the type of this variant
    *
    * @method
    * @public
    * @return {STU.Variant.EVariantType} the type of this variant
    */
    Variant.prototype.getType = function () {
        var myVariantsManager = StuVariantsManager.get();
        var myType = myVariantsManager.getVariantType(this.CATI3DExpVariant2);
        var key = Object.keys(Variant.EVariantType)[myType];
        var value = Object.values(Variant.EVariantType)[myType];
        return value;
    };
    /**
    * Returns the display Name of this variant
    *
    * @method
    * @public
    * @return {string} the display name of this variant
    */
    Variant.prototype.getDisplayName = function () {
        return this['Alternative Name'];
    };



        /**
            * useful to dispatch events from c++
            *
            * @private
        */
        Variant.prototype.doDispatchEvent = function (iEventName, iValue) {

            if (iEventName == "ValueModified") {
                if (iValue === undefined || iValue === null) {
                    var e = new STU.VariantUnvaluedEvent();
                    this.dispatchEvent(e);
                }
                else {
                    var e = new STU.VariantValuedEvent();
                    e.value = iValue;
                    this.dispatchEvent(e);
                }
            }

            // ! DEPREQ !
            if (iEventName == "OptionSet") {
                var e = new STU.VariantOptionSetEvent();
                e.option = iValue;
                this.dispatchEvent(e);
            }

            if (iEventName == "OptionUnset") {
                var e = new STU.VariantOptionUnsetEvent();
                e.option = iValue;
                this.dispatchEvent(e);
            }
            // ! DEPREQ !
        };



    /**
    * Enumeration of possible variant types.
    * see VariantType in CAT3DExpVariantDefs
    * eAll : the combination of all types
    * eUndefined: type is not defined
    * eMaterial: a variant driving the appearance of a material
    * eVivibility: a variant driving the visibility of a product part, through a conditional variant
    * eConditional: a variant resulting from the conversion of an effectivity
    * eEnoviaDictionary: a variant resulting from the conversion of an enovia dictionary variant
    * eOptionGroup: a variant resulting from the conversion of an enovia dictionary option group ! DEPREQ !
    * ePackage: a variant created by the user to drive the state of other variants
    * @enum {number}
    * @public
    */
    Variant.EVariantType = {
        eAll: 0,
        eUndefined: 1,
        eMaterial: 2,
        eVisibility: 3,
        ePackage: 4,
        eConditional: 5,
        eEnoviaDictionary: 6,
        eOptionGroup: 7
    };



    // Expose in STU namespace.
    STU.Variant = Variant;
    return Variant;
});

define('StuModel/StuVariant', ['DS/StuModel/StuVariant'], function (Variant) {
    'use strict';

    return Variant;
});

