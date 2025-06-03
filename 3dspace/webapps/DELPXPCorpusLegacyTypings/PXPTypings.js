/// <amd-module name="DS/DELPXPCorpusLegacyTypings/PXPTypings"/>
define("DS/DELPXPCorpusLegacyTypings/PXPTypings", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
// export interface Issue {
//     "@class": string;
//     physicalId: string;
//     externalId: string;
//     lifeCycleStatus: string;
//     geometry: string;
//     id: string;
//     scheduleStartDate: string;
//     scheduledEndDate: string;
//     actualStartDate: string;
//     actualEndDate: string;
//     classificationValue: string;
//     severityValue: string;
//     label: string;
//     status: string;
//     resourceId?: string | null;
// }
// export type SerializedOperation = {
//     physicalId: string;
//     externalId: string;
//     lifeCycleStatus: string;
//     geometry: string;
//     id: string;
//     serialOfOpOccurrence: string;
//     operationInstanceID: string;
//     outOperands?: any[] | null;
//     inOperands?: any[] | null;
//     dueDate: string;
//     earliestStartDate: string;
//     scheduledStartDate: string;
//     scheduledEndDate: string;
//     actualStartDate: string;
//     actualEndDate: string;
//     status: string;
//     displayName: string;
//     color?: string;
//     prevSerializedOperations?: (string)[] | null;
//     sequenceNumber: number;
//     _scheduledRscAssignment: (ScheduledRscAssignmentEntityOrActualRscAssignmentEntity)[];
//     _actualRscAssignment: (ScheduledRscAssignmentEntityOrActualRscAssignmentEntity)[];
//     scheduledWCAssignment: string;
//     actualWCAssignment: string;
//     duration?: number | null;
//     woOwner: string;
//     icon: string;
//     defaultColor: DefaultColor;
//     childrenOperations: Array<string>;
//     isOnHold: boolean;
//     onHoldComment: string;
// }
// export interface ScheduledRscAssignmentEntityOrActualRscAssignmentEntity {
//     "@class": string;
//     startDate: string;
//     endDate: string;
//     mfgRscRequ?: null;
//     assignedSRsc: string;
//     assignedSRscGroup?: null;
// }
// export interface DefaultColor {
//     "@class": string;
//     isDefined: boolean;
//     red: number;
//     green: number;
//     blue: number;
// }
// export type PlayerStatus = "Play_Status_Live" | "Play_Status_Pause" | "Play_Status_Stop" | "Play_Status_Forward";
// export type WorkOrder = {
//     physicalId: string;
//     externalId: string;
//     lifeCycleStatus: string;
//     geometry: string;
//     id: string;
//     _serializedOf?: null;
//     type?: string;
//     calendarId?: null;
//     status: string;
//     displayName: string;
//     serialOf: string;
//     scheduledStartDate: string;
//     scheduledEndDate: string;
//     actualStartDate: string;
//     actualEndDate: string;
//     productConfiguration?: null;
//     woFather?: null;
//     itemToProduceId?: null;
//     op: string[];
//     outOperands: object[];
//     color: any;
//     vectPredecessorWorkOrder?: [];
//     uidSetWorkOrderPredecessors?: [];
//     processHeaderID?: null;
//     headerSerializedItemId?: string;
//     isLastWO: boolean;
//     inOperands: [];
//     dueDate: string;
//     earliestStartDate: string;
//     //mtbf?: null;
//     //geoLoc: GeoLoc;
//     inputSRscs?: (null)[] | null;
//     //equipmentClass: string;
//     icon: string;
//     fatherOrganization?: string;
//     fatherWorkCenter?: string;
//     tags?: null;
//     engineeringItemOcc?: string;
// }
