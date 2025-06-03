define('DS/DELPXPFoundationsLegacy/DELPXPFoundations', [
  'DS/ExperienceKernel/ExperienceKernel',
  'DS/Logger/Logger',
  'DS/WAFData/WAFData',
  'DS/DELPXPFoundationsLegacy/PXPUtils',
  'DS/DELPXPFoundationsLegacy/PXPEventTransport',
], function (EK, Logger, WAFData, PXPUtils, Event) {
  'use strict';

  var PXP = {};
  var _logger = Logger.getLogger(PXP);
  _logger.setLevel('ALL');

  var _mapSession = new Map();

  var _passportURL;
  
  var Auth= {};

  async function generateTGT(passportURL) {
    let passport = passportURL || _passportURL;
    if (passport) {
      let tgt = new Promise((resolve, reject) => {
        var urlTGT = passport + '/api/authenticated/cas/transient';
        WAFData.authenticatedRequest(urlTGT, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          onComplete: function (response /*, headers*/) {
            let serviceTicket = JSON.parse(response).access_token;
            resolve(serviceTicket);
          }, 
          onFailure: function (error /*, response, headers*/) {
            _logger.info('Authentication- GenerateTGT failed:' + error);
            reject(new Error('GenerateTGT failed (' + error + ')'));
          },
          onPassportError: function (error/*, response, header*/) {
            _logger.info('Authentication- GenerateTGT failed:' + error);
            reject(new Error('GenerateTGT failed (' + error + ')'));
          }
    
        });
      });
      return tgt;
    } else
      throw new Error("GenerateTGT failed (no passport configured)");
  }

  Auth.Default = function (granting, onSuccess, onError) {
    var validateUrl = granting.passportURL + '/login?service=' + EK.defaultServiceURL;

    WAFData.authenticatedRequest(validateUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      onComplete: function (response /*, headers*/) {
        var serviceTicket = JSON.parse(response).access_token;
        //_logger.info('Authentication success: serviceURL=' + serviceURL + ' - serviceTicket=' + serviceTicket );
        onSuccess(EK.defaultServiceURL, serviceTicket);
      },
      onFailure: function (error /*, response, headers*/) {
        _logger.info('Authentication error :' + error);
        onError(error);
      },
      onPassportError: function (error/*, response, header*/) {
        _logger.info('Authentication Passport error :' + error);
        onError(error);
      }
    });
  };


  // Auth.ServiceWithTGT = function (service) {
  //   let myService = service;
  //   return function (granting, onSuccess, onError) {
  //     let genericService = myService || (granting.passportURL+'/api/login/cas/transient');
  //     let passportURL = granting.passportURL;

  //     var _fctLoginService = function (tgt) {
  //       var url = passportURL + '/login?service=' + encodeURIComponent(genericService);
  //       WAFData.authenticatedRequest(url, {
  //         method: 'GET',
  //         headers: { Accept: 'application/json' },
  //         onComplete: function (response /*, headers*/) {
  //           var serviceTicket = JSON.parse(response).access_token;
  //           var serviceURL = genericService + '?tgt=' + tgt;
  //           //_logger.info('Authentication success: serviceURL=' + serviceURL + ' - serviceTicket=' + serviceTicket );
  //           onSuccess(serviceURL, serviceTicket);
  //         },
  //         onFailure: function (error /*, response, headers*/) {
  //           _logger.info('Authentication error :' + error);
  //           onError(error);
  //         },
  //         onPassportError: function (error/*, response, header*/) {
  //           _logger.info('Authentication Passport error :' + error);
  //           onError(error);
  //         }
  //       });
  //     };
  
  //     //-- Generate TGT
  //     var urlTGT = passportURL + '/api/authenticated/cas/transient';
  //     WAFData.authenticatedRequest(urlTGT, {
  //       method: 'GET',
  //       headers: { Accept: 'application/json' },
  //       onComplete: function (response /*, headers*/) {
  //         let serviceTicket = JSON.parse(response).access_token;
  //         _fctLoginService(serviceTicket);
  //       },
  //       onFailure: function (error /*, response, headers*/) {
  //         _logger.info('Authentication error :' + error);
  //         onError(error);
  //       },
  //       onPassportError: function (error/*, response, header*/) {
  //         _logger.info('Authentication Passport error :' + error);
  //         onError(error);
  //       }
  //     });
  //   };
  // };

  Auth.ServiceWithTGT = function (options) {
    let optService;
    let optPassport;
    
    if ( options ) {
      if ( PXPUtils.isString(options) ) {
        optService= options;
      }
      if ( PXPUtils.isObject(options) ) {
        optService= options.service;
        optPassport= options.passport;
      }
    }

    return function (granting, onSuccess, onError) {
      let passportURL = optPassport || granting.passportURL;
      let genericService = optService || (passportURL+'/api/login/cas/transient');

      var _fctLoginService = function (tgt) {
        var url = passportURL + '/login?service=' + encodeURIComponent(genericService);
        WAFData.authenticatedRequest(url, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          onComplete: function (response /*, headers*/) {
            var serviceTicket = JSON.parse(response).access_token;
            var serviceURL = genericService + '?tgt=' + tgt;
            //_logger.info('Authentication success: serviceURL=' + serviceURL + ' - serviceTicket=' + serviceTicket );
            onSuccess(serviceURL, serviceTicket);
          },
          onFailure: function (error /*, response, headers*/) {
            _logger.info('Authentication error :' + error);
            onError(error);
          },
          onPassportError: function (error/*, response, header*/) {
            _logger.info('Authentication Passport error :' + error);
            onError(error);
          }
        });
      };
  
      //-- Generate TGT
      var urlTGT = passportURL + '/api/authenticated/cas/transient';
      WAFData.authenticatedRequest(urlTGT, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        onComplete: function (response /*, headers*/) {
          let serviceTicket = JSON.parse(response).access_token;
          _fctLoginService(serviceTicket);
        },
        onFailure: function (error /*, response, headers*/) {
          _logger.info('Authentication error :' + error);
          onError(error);
        },
        onPassportError: function (error/*, response, header*/) {
          _logger.info('Authentication Passport error :' + error);
          onError(error);
        }
      });
    };
  };
  

  PXP.ReconnectPolicies = Object.freeze({
    no: 0, // No auto reconnection
    onlyNetwork: 1, // Reconnect but reuse an existant node (do not create a NEW node)
    all: 2, // Reconnect and create Node if not exist...
  });

  ///--- Default parameters
  PXP.defaultsBusOptions = Object.freeze({
    newClient: false,
    serverUrl: 'ws://127.0.0.1:2097/',
    clientName: undefined,
    onStatusChange: function (name, status) {
      //_logger.info(name + ' : ' + status.toString());
    },
    onMessage: function (event) {
      //_logger.info(event.toString());
    },
    onInterceptSendMessage: function (event) {
      return true;
    },
    onInterceptReceptMessage: function (event) {
      return true;
    },

    // Authentication par défaut
    authentication: Auth.Default,

    // Protocol JSONv2
    protocol: Event.Protocol.JSONv2,
  });

  const BusStatus = {
    Connected: 'connected',
    Disconnected: 'disconnected',
    Error: 'error',
  };

  /// Check URI
  var isUri = function (uri) {
    if (PXPUtils.isString(uri)) return uri.length > 2 && uri[0] === '/';
    return false;
  };

  ///-- EndpointClient
  var EndpointClient = function (busSession, nodePool, nodeId, myIdentifier) {
    this._busSession = busSession;
    this._nodePool = nodePool;
    this._nodeId = nodeId;
    this._identifier = myIdentifier;
    this._autoConnect = PXP.ReconnectPolicies.onlyNetwork;
    this._timeoutReconnect = 30;
    this._lastStatus = EK.Status.disconnected;

    //-- Attach onChange (Timeout, auto-reconnect)
    this._onNodeStatusChange = function (from, pool) {
      var status = from.getStatus();
      if (this._lastStatus === status) return;

      this._lastStatus = status;
      switch (status) {
        case EK.Status.connected:
          _logger.info("EnpointClient '" + pool + "'- connected");
          break;
        case EK.Status.pending:
          _logger.info("EnpointClient '" + pool + "'- pending");
          break;
        case EK.Status.disconnected:
          if (PXP.ReconnectPolicies.no !== this._autoConnect) {
            _logger.info("EnpointClient '" + pool + "'- disconnected - Try to reconnect...");
            this.reconnect();
          } else {
            _logger.info("EnpointClient '" + pool + "'- disconnected");
          }
          break;
      }
    }.bind(this);
    this._nodeId.onStatusChange(this._onNodeStatusChange); // auto-reconnect...
    this.onStatusChange(this._busSession._onStatusChange); // global event...

    // hello
    var event = new Event.Transport().withHeaders({ 'clientName': this._busSession._clientName });
    var p;
    if (false) {
      p = generateTGT().then((tgt) => {
        event.withHeaders({ 'tgt': tgt });
        return Promise.resolve();
      });
    } else {
      p = Promise.resolve();
    }
    p.then(() => { return this.request('/pxpsrv/v1/hello', event); }).then((response) => {
      if (response && !response.isStatusError()) {
        _logger.info('webclient identified as ' + response.content + ' by server...');
      }
    }).catch((err) => {
      _logger.warn('webclient hello failed: ' + err);
    });
  };
  EndpointClient.prototype = {
    send: function (message) {
      return this._busSession.send(this._nodeId, message);
    },
    sendRequest: function (options) {
      return this._busSession.sendRequest(this._nodeId, options);
    },
    request: async function (uri, options) {
      return this._busSession.request(this._nodeId, uri, options);
    },
    onStatusChange: function (onChange) {
      this._nodeId.onStatusChange(function (from, pool) {
        let status = from.getStatus();
        if (status === EK.Status.connected) onChange(pool, BusStatus.Connected);
        else {
          onChange(pool, BusStatus.Disconnected);
        }
      });
    },
    isConnected: function () {
      if (this._nodeId) return this._nodeId.isConnected();
      return false;
    },
    reconnect: function () {
      //var myTHIS = this;
      if (this._nodeId.isConnected()) {
        return;
      }
      // Save Handler onStatusChange
      var saveOnStatusChange = this._nodeId.impl.onStatusChange; // PAS top Propre mais j'ai pas mieux !

      // Try to reetablish link beetween node...
      let criterion;
      if (PXPUtils.isNull(this._identifier)) criterion = EK.Criterion.timeout(this._timeoutReconnect);
      else criterion = EK.Criterion.identifier(this._identifier).withTimeout(this._timeoutReconnect);
      if (PXP.ReconnectPolicies.onlyNetwork === this._autoConnect) criterion.withoutProcessCreation();

      this._nodeId = this._nodePool.select(criterion);

      // Restore handler onStatusChange...
      this._nodeId.impl.onStatusChange = saveOnStatusChange;

      //waitForConnection(this._nodeId, 10,
      //    function () {
      //        _logger.info("Endpoint '" + myTHIS._nodePool.pool + "': connected");
      //    },
      //    function () {
      //        _logger.error(new Error("Endpoint '" + myTHIS._nodePool.pool + "': failed to connect. (timeout)"));
      //    },
      //    function () {
      //        _logger.info("Endpoint '" + myTHIS._nodePool.pool + "': wait for connection...");
      //    }
      //);
    },
    subscribeTopics: async function( topic ) 
    {
      return this.request('/pxpsrv/v1/topics/subscribe/' + topic);
    },
    unsubscribeTopics: async function( topic ) 
    {
      return this.request('/pxpsrv/v1/topics/unsubscribe/' + topic);
    },
    subscribeSignal: async function ()
    {
      return this.request('/pxpsrv/v1/signal/on' );
    },
    unsubscribeSignal: async function ()
    {
      return this.request('/pxpsrv/v1/signal/off' );
    },
    close: function () {
      this._autoConnect = PXP.ReconnectPolicies.no;
      this._nodeId.close();
    },
  };

  ///--- EK Implementation...
  var BusSessionEK = function (name, options, onDisconnect, resolve, reject) {
    options = options || {};
    for (var optionsKey in options)
      if (!PXP.defaultsBusOptions.hasOwnProperty(optionsKey))
        reject(
          new Error("Unknown PXP.BusSession option named '" + optionsKey + "'. Valid options are: " + JSON.stringify(Object.keys(PXP.defaultsBusOptions)))
        );

    let merge = {};
    for (var key in PXP.defaultsBusOptions) {
      if (PXP.defaultsBusOptions.hasOwnProperty(key)) {
        merge[key] = key in options ? options[key] : PXP.defaultsBusOptions[key];
      }
    }

    if (PXPUtils.isNill(merge.serverUrl)) reject(new Error("PXP.BusSession: 'serverUrl' is mandatory"));

    this._status = undefined;
    this._requestMap = new Map();
    this._serverUrl = merge.serverUrl.toString();
    this._clientName = merge.clientName === undefined ? name : merge.clientName;
    this._onStatusChange = merge.onStatusChange;
    this._onAuthentification = merge.authentication;

    this._onInterceptSendMessage = merge.onInterceptSendMessage; // Intercept message before send
    this._onInterceptReceptMessage = merge.onInterceptReceptMessage; // Intercept message before recept

    this._onMessage = merge.onMessage;
    this._protocol = merge.protocol;

    // Create Node Client
    //_logger.info("Create EK.Node '" + this._clientName + "'" );
    
    this._clientNode = new EK.Node({
      hypervisorUrl: this._serverUrl,
      pool: this._clientName,
      authentication: function (granting, onSuccess, onError) {
        _logger.info("Authentication '" + granting.forWho + "' -- PassportURL: " + granting.passportURL);
        _passportURL = granting.passportURL; //save URL provide by EK...
        if (this._onAuthentification) {
          this._onAuthentification(granting, onSuccess, onError);
        }
      }.bind(this),
      onText: function (input /*, origin*/) {
        let event = this._protocol.decode(input);
        if (PXPUtils.isUndefined(event)) {
          // ignore or error ?
          return false;
        }
        //...pseudo server...
        if (event.isRequest()) {
          if (event.isInternalCmd()) {
            _logger.info('Recept request: InternalCmd ' + event.getContent());
          }
        }
        // ...intercept...
        if (this._onInterceptReceptMessage && !this._onInterceptReceptMessage(event)) {
          return true;
        }
        if (event.isResponse() && event.hasCorrelationID()) {
          let msgoptions = this._requestMap.get(event.getCorrelationID());
          if (PXPUtils.isDefined(msgoptions)) {
            return this.handleResponse(event, msgoptions);
          }
        }
        this._onMessage(event);
        return true;
      }.bind(this),
      onHypervisorConnect: function () {
        //_logger.info("Hypervisor connected..." );
        if (this._status === undefined) {
          this._status = BusStatus.Connected;
          resolve(this);
        } else {
          this._status = BusStatus.Connected;
          this._onStatusChange('hypervisor', this._status);
        }
      }.bind(this),
      onHypervisorDisconnect: function (wasConnected) {
        if (wasConnected) {
          this._status = BusStatus.Disconnected;
          this._onStatusChange('hypervisor', this._status);
          if (PXPUtils.isDefined(onDisconnect)) {
            onDisconnect();
          }
        }
        // comment because uses onError(...)
        //else {
        //reject(new Error("connection to '" + this._serverUrl + "' failed."));
        //}
      }.bind(this),
      //onDisconnect: function (id, pool) {
      //  _logger.info("disconnect: id=" + id + "; pool=" + pool);
      //}.bind(this),
      onError: function (msg) {
        _logger.error(msg);
        if (PXPUtils.isNill(this._status)) {
          reject(new Error(msg));
        }
      }.bind(this),
    });
  };
  BusSessionEK.prototype = {
    isConnected: function () {
      return this._status === BusStatus.Connected;
    },
    send: function (nodeId, message) {
      try {
        if (this._onInterceptSendMessage && !this._onInterceptSendMessage(message)) {
          return false;
        }
        let stringify;
        if (message instanceof Event.Transport) {
          stringify = Event.Protocol.JSONv2.encode(message);
        } else {
          stringify = JSON.stringify(message);
        }
        this._clientNode.sendText(nodeId, stringify);
        return true;
      } catch (err) {
        _logger.error('Fail to send message. ' + err);
      }
      return false;
    },
    /*
            options is an object like :
            {
                uri: String [mandatory],
                msg : Any [optional], 
                onResponse : function[optional], 
                onSuccess : function[optional], 
                onFail : function[optional] 
            }
            */
    sendRequest: function (nodeId, options) {
      if (!PXPUtils.isObject(options)) throw new Error('options is not a valid object');
      if (!isUri(options.uri)) throw new Error('not a valid Request URI');
      if (PXPUtils.isUndefined(options.onResponse) && (PXPUtils.isUndefined(options.onSuccess) || PXPUtils.isUndefined(options.onFail)))
        throw new Error('no valid callback combination. if onResponse is omitted, onSuccess and onFail must both be set.');
      try {
        let msg;
        if (options.msg instanceof Event.Transport) {
          msg = options.msg;
        } else {
          msg = Event.Transport.create(options.msg);
        }
        msg.getHeaders()[Event.HeaderKey.URI] = options.uri;
        let cid = msg.addCorrelationID();
        this._requestMap.set(cid, options);
        msg.flagAsRequest();

        if (this._onInterceptSendMessage && !this._onInterceptSendMessage(msg)) {
          return false;
        }
        this._clientNode.sendText(nodeId, Event.Protocol.JSONv2.encode(msg));
        return true;
      } catch (err) {
        if (options.uri) _logger.error('sendRequest(' + options.uri + ') failed:' + err);
      }
      return false;
    },
    // version Promise
    request: async function (nodeId, uri, options) {
      if (!isUri(uri)) throw new Error("request syntax error: uri is not valid -- Uses request('/myUri', options)");
      if (PXPUtils.isDefined(options)) {
        if (!PXPUtils.isObject(options)) throw new Error('request syntax error: options is not a valid object');
        if (PXPUtils.isDefined(options.onResponse) || PXPUtils.isDefined(options.onSuccess) || PXPUtils.isDefined(options.onFail))
          throw new Error(
            "request syntax error: callback 'onResponse, onSuccess or onFail' not expected with Promise version of request ! Uses request('/myUri').then(...).catch(...) or sendRequest( { uri:'/myUri', onResponse: <callback>, ...'"
          );
      }
      return new Promise((resolve, reject) => {
        try {
          var bufferMsg = [];

          var myMsg;
          if (options) {
            if (options.msg) {
              if (options.msg instanceof Event.Transport) {
                myMsg = options.msg;
              } else {
                myMsg = Event.Transport.create(options.msg);
              }
            } else {
              if (options instanceof Event.Transport) {
                myMsg = options;
              } else {
                myMsg = Event.Transport.create(options);
              }
            }
          } else
            myMsg = Event.Transport.create();

          myMsg.onSuccess = (msg) => {
            // continue ?
            if (Event.EventStatus.Continue === msg.getStatus()) {
              bufferMsg.push(msg);
            } else {
              if (bufferMsg.length) {
                bufferMsg.push(msg);
                resolve(bufferMsg);
              } else resolve(msg);
            }
          };
          myMsg.onFail = (msg) => {
            if (msg instanceof Event.Transport) {
              if (msg.isError()) {
                reject(msg.getContent().toNativeError());
                return;
              }
            } else if (msg instanceof Error) {
              reject(msg);
              return;
            }
            reject(new Error('' + msg));
          };

          myMsg.getHeaders()[Event.HeaderKey.URI] = uri;
          let cid = myMsg.addCorrelationID();
          this._requestMap.set(cid, myMsg);
          myMsg.flagAsRequest();

          if (this._onInterceptSendMessage && !this._onInterceptSendMessage(myMsg)) {
            return reject(new Error('request("' + uri + '") intercepted'));
          }
          this._clientNode.sendText(nodeId, Event.Protocol.JSONv2.encode(myMsg));
        } catch (err) {
          reject(new Error('request("' + uri + '") failed: ' + err));
        }
      });
    },
    handleResponse: function (message, options) {
      let success = !message.isError();
      if (success && options.onSuccess) {
        options.onSuccess(message);
      } else if (!success && options.onFail) {
        options.onFail(message);
      } else {
        options.onResponse(message);
      }

      // cleanup
      if (message.getStatus() !== Event.EventStatus.Continue) {
        this._requestMap.delete(message.getCorrelationID());
      }
      return success;
    },
    ConnectToEndpoint: function (endpointAddress /*, onMessage*/) {
      var myEndpoint;
      var myIdentifier = null;
      if (PXPUtils.isString(endpointAddress)) {
        let s = endpointAddress.split('|', 2);
        myEndpoint = s[0];
        myIdentifier = s.length > 1 ? s[1] : null;
      } else {
        myEndpoint = '' + endpointAddress;
      }
      _logger.debug("Try to connect to Endpoint '" + myEndpoint + "' - Identifier:" + (PXPUtils.isNull(myIdentifier) ? '<no>' : myIdentifier));

      var myTHIS = this;
      return new Promise(function (resolve, reject) {
        let nodeId;
        if (!myTHIS.isConnected()) {
          reject(new Error("Endpoint '" + myEndpoint + "': failed to connect. (Hypervisor is disconnected)"));
        } else if (0 === myEndpoint.length) {
          reject(new Error('Endpoint is empty !: nothing to connect.'));
        } else {
          let nodePool = myTHIS._clientNode.connect(myEndpoint);

          if (PXPUtils.isNull(myIdentifier)) nodeId = nodePool.select(EK.Criterion.timeout(10));
          else nodeId = nodePool.select(EK.Criterion.identifier(myIdentifier).withTimeout(10));

          nodeId.onStatusChange(function (from, pool) {
            var status = from.getStatus();
            switch (status) {
              case EK.Status.connected: {
                _logger.info("EnpointClient '" + pool + "'- started !");
                let endpoint = new EndpointClient(myTHIS, nodePool, nodeId, myIdentifier);
                resolve(endpoint);
                break;
              }
              case EK.Status.pending: {
                _logger.info("EnpointClient '" + pool + "'- status change: pending");
                break;
              }
              case EK.Status.disconnected: {
                _logger.info("EnpointClient '" + pool + "'- Timeout");
                reject(new Error("Endpoint '" + myEndpoint + "': failed to connect. (timeout)"));
                break;
              }
            }
          });
        }
      });
    },
  };

  function _PromiseCreateSessionEK(name, options, onDisconnect) {
    return new Promise(function (resolve, reject) {
      var BusEK = new BusSessionEK(name, options, onDisconnect, resolve, reject);
    });
  }

  return {
    AuthProfile: Auth,
    BusStatus: BusStatus,
    Event: Event,
    Transport: Event.Transport,
    ConnectToBusEK: function (name, options, force) {
      return new Promise(function (resolve, reject) {
        if (options && options.newClient) {
          _mapSession.delete(name);
        }
        var session = _mapSession.get(name);
        if (PXPUtils.isNill(session)) {
          _logger.debug("Create Session '" + name + "'");

          _PromiseCreateSessionEK(name, options, () => {
            _logger.debug("Delete Session '" + name + "'");
            _mapSession.delete(name);
          }).then(
            (Bus) => {
              _mapSession.set(name, Bus);
              resolve(Bus);
            },
            (ErrorMsg) => {
              reject(ErrorMsg);
            }
          );
        } else {
          _logger.debug("Uses Session '" + name + "'");
          resolve(session);
        }
      });
    },
    GetSecurityCtxList: function (iUrl, iTenant) {
      let oReturnValue;
      if (iUrl && iTenant) {
        oReturnValue = new Promise(function (resolveCB, rejectCB) {
          let pathWS = iUrl + '/resources/modeler/pno/person?current=true';
          pathWS += '&select=preferredcredentials&select=collabspaces';
          pathWS += '&tenant=' + iTenant;

          WAFData.authenticatedRequest(pathWS, {
            method: 'GET',
            type: 'json',
            onComplete: resolveCB,
            onFailure: rejectCB,
          });
        });
      }
      return oReturnValue;
    },
  };
});
