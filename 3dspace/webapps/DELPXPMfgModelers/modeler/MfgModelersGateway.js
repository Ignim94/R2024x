define(["require", "exports", "DS/DELPXPSessionManager/DELPXPContextType"], function (require, exports, DELPXPContextType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MfgModelersGateway = void 0;
    /**
     * Declaration of the implementation of the interface
     */
    class MfgModelersGateway {
        constructor(iSession) {
            this._context = iSession;
        }
        ;
        /**
         * Creates the condition objects necessary to the load command
         * @param iDataModelToLoad
         * @param iMappingIdsToInstPath
         * @returns a condition object
         */
        createConditionObject(iDataModelToLoad, iMappingIdsToInstPath) {
            var condition = [];
            if (iDataModelToLoad.length > 0) {
                condition = [
                    {
                        type: 's',
                        data: this._context.getInstanceID()
                    }, {
                        type: 's',
                        data: iDataModelToLoad
                    }
                ];
            }
            if (iMappingIdsToInstPath !== undefined && iMappingIdsToInstPath.length > 0) {
                condition.push({
                    type: '',
                    data: iMappingIdsToInstPath
                });
            }
            return condition;
        }
        /**
         * Method creating the command object based on the data model to load and the facultative mapping
         * @param iDataModelToLoad
         * @param iMappingIdsToInstPath
         * @returns a request object
         */
        createCommandObject(iDataModelToLoad, iMappingIdsToInstPath) {
            var condition = this.createConditionObject(iDataModelToLoad, iMappingIdsToInstPath);
            let commandObj = {
                "Command~1": {
                    "commandName": "ComponentBuildUp_InitInstance",
                    "parameters": condition
                }
            };
            return commandObj;
        }
        //for first impl, the input is the full json as a string
        /**
         * Method provided to the user, this method allows the user to push the data set and its mapping to the server
         * @param iDataModelToLoad , has to be compliant to the format for input data sets
         * @param iMappingIdsToInstPath ,has to be compliant to the mapping format
         * @returns an error status if in error, otherwise, returns nothing, only gives back control to the user
         */
        async load(iDataModelToLoad, iMappingIdsToInstPath) {
            const that = this;
            let commandObject = that.createCommandObject(iDataModelToLoad, iMappingIdsToInstPath);
            return new Promise((iFctResolved, iFctReject) => {
                //send R/R creation instance
                that._context.request(DELPXPContextType_1.RequestType.RequestType_Command, commandObject).then(msg => {
                    iFctResolved(); //return a "success msg" ?
                }).catch(err => {
                    iFctReject(err);
                });
            });
        }
        ;
    }
    exports.MfgModelersGateway = MfgModelersGateway;
});
