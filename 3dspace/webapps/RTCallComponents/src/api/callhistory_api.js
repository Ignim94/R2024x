import { RTC_URL, PASSPORT_URL, TENANT_ID, DS_BASE_URL } from '../modules/global-var'
import { requirejs } from '../modules/require'
import { PlatformListeners } from './callhistory_response_handlers'
import { useRTCStore } from '../stores/RTCStore';

export const initDevEnv = async () => {
  const [InstantMessaging] = await requirejs(['DS/InstantMessaging/InstantMessaging'])
  InstantMessaging.init({
    devEnv3diM: true,
    platformId: TENANT_ID,
    appName: "devenv",
    url: RTC_URL,
    passportUrl: PASSPORT_URL,
    ODTMode: false,
    ressources: {
      swym: [{
        id: TENANT_ID,
        displayName: TENANT_ID,
        url: DS_BASE_URL
      }],
      instantMessaging: [
        {
          displayName: TENANT_ID,
          enabled: true,
          id: TENANT_ID,
          url: DS_BASE_URL,
        },
      ],
    }
  },
    function (ctrl) {
      document.IMctrl = ctrl;
      document.connectedLogin = document.RTCManager.login;
    }
  );
  document.connectedLogin = UWA.Utils.getQueryString(document.URL, 'login3DIM');
}

export const getRTCStatus = async () => {
  const [PublicAPI] = await requirejs(['DS/UWPClientCode/PublicAPI']);
  const rtcStore = useRTCStore();
  const uwpVar = PublicAPI.getApplicationConfiguration('app.swymfeature.activateRTC');
  rtcStore.rtConvEnable = typeof uwpVar === 'string' ? uwpVar === 'true' : uwpVar;
  return uwpVar;
}

const getRTInterface = async () => {
  const [RTInterface] = await requirejs(['DS/RTInterface/RTInterface']);
  return RTInterface;
}

export const initCallHistoryApi = async () => {
  const [RTProxyDriver] = await requirejs(['DS/RTProxyDriver/RTProxyDriver']);
  // Events for Ongoing Calls
  RTProxyDriver.addEvent('inviteSent', function(data) {
    data.evenement = 'inviteSent';
    PlatformListeners(data);
  });
  RTProxyDriver.addEvent('callAccepted', function(data) {
    data.evenement = 'callAccepted';
    PlatformListeners(data);
  });
  RTProxyDriver.addEvent('callEnded', function(data) {
    data.evenement = 'callEnded';
    PlatformListeners(data);
  });
  RTProxyDriver.addEvent('inviteToCall', function(data) {
    data.evenement = 'inviteToCall';
    PlatformListeners(data);
  });

  const RTInterface = await getRTInterface();
  RTInterface.send({ evenement: 'GETLOGINOKDATA' }, 'fromwidgetim.ds.com');
  RTInterface.addCallback(PlatformListeners, null, 'towidgetim.ds.com');
  RTInterface.addCallback(PlatformListeners, null, 'im.ds.com'); // TODO: check if this is required
}

export const fetchCallHistory = async (limit, leftDateOffset, rightDateOffset) => {
  const RTInterface = await getRTInterface();
  RTInterface.send({ action: 'getCallHistory', count: limit, dateOffset: leftDateOffset, dateOffset_left: rightDateOffset }, 'callToRTC.im.ds.com');
}

export const fetchCallFavorites = async () => {
  const RTInterface = await getRTInterface();
  RTInterface.send({ action: 'getCallFavorites' }, 'callToRTC.im.ds.com');
}

export const setCallFavorite = async (data) => {
  const RTInterface = await getRTInterface();
  RTInterface.send({ "action": 'setCallFavorite', "data": data }, 'callToRTC.im.ds.com');
}

export const startCall = async (data) => {
  const [RTAudioVideoAPI] = await requirejs(['DS/RTAudioVideoAPI/RTAudioVideoAPI']);
  const rtcStore = useRTCStore();
  RTAudioVideoAPI.startCall({
    topic: data.topic || "",
    type: data.type,
    logins: data.logins,
    dmId: data.dmId,
    callId: data.callId,
    dbConvId : data.dbConvId,
    rtconvEnable : !!rtcStore.rtConvEnable
  })
}

export const searchContact = async (pattern) => {
  const RTInterface = await getRTInterface();
  RTInterface.send({
    evenement: 'SEARCHCONTACT',
    data: pattern,
  }, 'fromwidgetim.ds.com');
}

export const fetchConversations = async (tenantId) => {
  const RTInterface = await getRTInterface();
  RTInterface.addCallback(PlatformListeners, tenantId, null, 'conversation');
  RTInterface.send({ action: 'getConversations',data: {all:true} });
}
export const removeFromHistory = async (callId) => {
  const RTInterface = await getRTInterface();
  let data ={};
  if (callId instanceof Array)
    data = { action: 'deleteCallHistory',callIds : callId };
  else 
    data= { action: 'deleteCallHistory',callId : callId }
  RTInterface.send(data, 'callToRTC.im.ds.com'); 
  // fetchCallHistory(10);
}
export const clearHistory = async (lastCallDate) => {
  const RTInterface = await getRTInterface();
  RTInterface.send({ action: 'cleanCallHistory',lastCallDate : lastCallDate }, 'callToRTC.im.ds.com'); 
}