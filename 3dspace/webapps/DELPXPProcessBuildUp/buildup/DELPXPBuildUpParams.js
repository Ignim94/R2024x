define(["require", "exports", "./DELPXPBuildUpEnums"], function (require, exports, DELPXPBuildUpEnums) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DELPXPBuildUpParams = void 0;
    /**
     * Class representing all the init parameters to use the Buildup solver
     */
    class DELPXPBuildUpParams {
        constructor() {
            /** the parameter to activate the position solver, deactivated by default */
            this._positionSolver = false;
            /** the parameter to activate the difference operator, deactivated by default */
            this._differenceOperator = false;
            /** the parameter to change the selection gate, i.e. if the result is expected at the Start or End of the selected operation(s) */
            this._selectionGate = DELPXPBuildUpEnums.SelectionMode.SelectionMode_Start;
            /** the parameter used to initialize the difference operator, for the first selection, do we compute the difference with all the objects visible or hidden. All visible by default */
            this._initAllvisible = true;
            //private _resetresultafterselect = false;
            /** the parameter is set to work in R/I/R paths if set to true, or I/I paths. true by default */
            this._refinstexpression = true;
        }
        setSelectionGate(selectGate) {
            this._selectionGate = selectGate;
        }
        setPositionSolver(posSolver) {
            this._positionSolver = posSolver;
        }
        setDiffOperator(diffOperator) {
            this._differenceOperator = diffOperator;
        }
        setInitAllVisible(initAllVisible) {
            this._initAllvisible = initAllVisible;
        }
        // public setResetResultAfterSelect(resetresultafterselect: boolean) {
        //     this._resetresultafterselect = resetresultafterselect;
        // }
        setRefInstExpression(refInstExpression) {
            this._refinstexpression = refInstExpression;
        }
        getSelectionGate() {
            return this._selectionGate;
        }
        getIsInitAllVisible() {
            return this._initAllvisible;
        }
        getIsPositionSolverActivated() {
            return this._positionSolver;
        }
        getIsDiffOperationActivated() {
            return this._differenceOperator;
        }
        // public getIsResetResultAfterSelect(): boolean {
        //     return this._resetresultafterselect;
        // }
        getIsRefInstExpression() {
            return this._refinstexpression;
        }
    }
    exports.DELPXPBuildUpParams = DELPXPBuildUpParams;
});
