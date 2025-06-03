var params = proc.declareParameters(
    [{ name: "PRD", type: "NavigationSet" }],
    [{ name: "ConfigurationsVal", type: "Filters" }]
);
var PRDPrimitive = Java.type("com.dassault_systemes.vdrpcompletion.primitives.CATVDRPSessionPrimitive");
var DebugTimer = Java.type("com.dassault_systemes.completionServices.base.DebugTimer");
var System = Java.type("java.lang.System");
var navSets = [PRD];

mql.startTransaction(false);

CompletionProcedure.runFunction(ConfigurationsVal, navSets, function (context, outputData) {

  var ScopeMfgItemCompletionID = "PRDOpenSession";
  var UserDefCompletionStop = System.getenv().get("UserDefCompletionStop");
  var completionID = "";
  var primitiveName = "";
  if (UserDefCompletionStop != null) {
    var UserDefCompletionStopTab = UserDefCompletionStop.split("|");
    completionID = UserDefCompletionStopTab[0];
    primitiveName = UserDefCompletionStopTab[1];
  }
  while (true) {
    if (PRD != null) {
      var expandedVPMExtPosResult = PRDPrimitive.expandVPMExtPos(context, PRD);
      if (expandedVPMExtPosResult != null) {
        PRD = PRD.merge(expandedVPMExtPosResult);
        var expandedVPMExtPosRelations = PRDPrimitive.expandVPMExtPosRelations(context, expandedVPMExtPosResult);
        if (expandedVPMExtPosRelations != null) {
          PRD = PRD.merge(expandedVPMExtPosRelations);
        }
      }
    }
    break;
  }

  // Open(PRD)
  outputData.add("Product", PRD);
});
mql.abortTransaction();
