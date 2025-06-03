define(["require", "exports", "DS/ExperienceKernel/ExperienceKernel", "DS/DELPXPFoundations/PXPUtils", "DS/Logger/Logger", "../event/Transport", "../protocol/ProtocolJSONv2", "./BusType"], function (require, exports, EK, Utils, Logger, Transport_1, ProtocolJSONv2_1, BusType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ClientNodeBase = void 0;
    var _logger = Logger.getLogger('PXP.SYS');
    function createBaseMessage(content) {
        if (content == null) {
            return Transport_1.Transport.create(null);
        }
        if (content instanceof Transport_1.Transport) {
            return content;
        }
        return Transport_1.Transport.create(content);
    }
    function isUri(uri) {
        if (Utils.isString(uri))
            return uri.length > 2 && uri[0] === '/';
        return false;
    }
    class ClientNodeEK {
        constructor(name, serverUrl, handlers) {
            this.clientName = name;
            this._onError = handlers.onError
                ? handlers.onError
                : (msg) => {
                    _logger.error('Node ' + this.clientName + ': ' + msg);
                };
            this._onHypervisorConnect = handlers.onHypervisorConnect ? handlers.onHypervisorConnect : () => { };
            this._onHypervisorDisconnect = handlers.onHypervisorDisconnect ? handlers.onHypervisorDisconnect : () => { };
            let canDisconnectFromHypervisor = handlers.onHypervisorConnect === undefined && handlers.onHypervisorDisconnect === undefined;
            let config /*: EKType.NodeOptionsUrl*/ = {
                hypervisorUrl: serverUrl.toString(),
                pool: this.clientName,
                onText: (input, origin) => {
                    return this.onText(input, origin);
                },
                onBinary: (input, origin) => {
                    return this.onBinary(input, origin);
                },
                onError: this._onError.bind(this),
                ...(handlers.onAuth && {
                    authentication: (credentials, onSuccess, onError) => {
                        _logger.info('Authentication "' + credentials.forWho + '" -- PassportURL: ' + credentials.passportURL);
                        this.passportUrl = credentials.passportURL; //save URL provide by EK...
                        if (handlers.onAuth)
                            handlers.onAuth(credentials, onSuccess, onError);
                    },
                }),
                ...(handlers.onDisconnect && { onDisconnect: handlers.onDisconnect }),
                ...(!canDisconnectFromHypervisor && {
                    canDisconnectFromHypervisor: canDisconnectFromHypervisor,
                    onHypervisorConnect: this._bindHypervisorConnect.bind(this),
                    onHypervisorDisconnect: this._bindHypervisorDisconnect.bind(this),
                }),
            };
            this._node = new EK.Node(config);
        }
        _bindHypervisorConnect() {
            this._onHypervisorConnect();
        }
        _bindHypervisorDisconnect() {
            this._onHypervisorDisconnect();
        }
        onText(input, origin) {
            return false;
        }
        onBinary(input, origin) {
            return false;
        }
        assignOnError(onError) {
            if (onError === null) {
                this._onError = (reason) => {
                    _logger.error('Node ' + this.clientName + ': ' + reason);
                };
            }
            else {
                this._onError = onError;
            }
        }
        //public assignOnHypervisorConnect(onConnect: () => void | null) {
        //  this._onHypervisorConnect = onConnect
        //}
        //public assignOnHypervisorDisconnect(onDisconnect: () => void | null) {
        //  this._onHypervisorDisconnect = onDisconnect
        //}
        connect(address, timeoutConnection, onlyNetwork = false) {
            let onChangeAtStart;
            return new Promise((resolve, reject) => {
                let nodeId;
                let nodePool = this._node.connect(address.endpoint);
                let criterion;
                if (address.identifier == null) {
                    criterion = EK.Criterion.timeout(timeoutConnection);
                }
                else {
                    criterion = EK.Criterion.identifier(address.identifier).withTimeout(timeoutConnection);
                }
                if (onlyNetwork)
                    criterion.withoutProcessCreation();
                nodeId = nodePool.select(criterion);
                let _firstConnect = true;
                onChangeAtStart = (from, pool) => {
                    let status = from.getStatus();
                    switch (status) {
                        case EK.Status.connected: {
                            if (_firstConnect) {
                                _logger.debug("Node '" + this.clientName + "'@'" + pool + "'- started !");
                                resolve(nodeId);
                                _firstConnect = false;
                            }
                            else {
                                _logger.info("Node '" + this.clientName + "'@'" + pool + "'- Connected");
                            }
                            break;
                        }
                        case EK.Status.pending: {
                            _logger.info("Node '" + this.clientName + "'@'" + pool + "'- status change: pending");
                            break;
                        }
                        case EK.Status.disconnected: {
                            if (_firstConnect) {
                                _logger.info("Node '" + this.clientName + "'@'" + pool + "'- Timeout");
                                reject(new Error("Endpoint Client '" +
                                    this.clientName +
                                    "'@'" +
                                    (address.identifier ? address.endpoint + '|' + address.identifier : address.endpoint) +
                                    "': failed to connect. (timeout)"));
                            }
                            else {
                                _logger.info("Node '" + this.clientName + "'@'" + pool + "'- Disconnected");
                            }
                            break;
                        }
                    }
                };
                nodeId.onStatusChange(onChangeAtStart);
            }).then((nodeId) => {
                //@ts-ignore - EK Missing signature on 'NodeId'
                nodeId.unregisterStatusChange(onChangeAtStart);
                //nodeId.onStatusChange(this._onEKChange);
                return nodeId;
            });
        }
    }
    function MessageAsError(msg) {
        if (msg && msg instanceof Transport_1.Transport) {
            if (msg.isError()) {
                return new Error(msg.asError().toString());
            }
            else if (msg.isStatusError()) {
                return new Error('Status: ' + msg.getStatus());
            }
        }
        return new Error('undefined error');
    }
    // handler for 'request'
    class RequestHandlerPromiseImpl {
        constructor(resolve, reject, errorPolicies) {
            this.resolve = resolve;
            this.reject = reject;
            this._response_cpt = 0;
            if (errorPolicies == undefined) {
                errorPolicies = BusType_1.enErrorPolicies.catchMessageError;
            }
            switch (errorPolicies) {
                case BusType_1.enErrorPolicies.asFetch:
                    this._onCheckSuccess = (msg) => msg instanceof Transport_1.Transport;
                    break;
                case BusType_1.enErrorPolicies.catchMessageErrorStatus:
                    this._onCheckSuccess = (msg) => !msg.isStatusError();
                    break;
                case BusType_1.enErrorPolicies.catchAll:
                    this._onCheckSuccess = (msg) => !(msg.isStatusError() || msg.isError());
                    break;
                default:
                case BusType_1.enErrorPolicies.catchMessageError:
                    this._onCheckSuccess = (msg) => !msg.isError();
                    break;
            }
        }
        onSuccess(msg) {
            if (++this._response_cpt == 1) {
                if (Transport_1.EventStatus.Continue == msg.getStatus()) {
                    this.reject(new Error('request(' + msg.getUri() + ") failed: API 'request' does not support 'continue' type messages, uses API 'requestAsBuffered'"), msg);
                }
                else
                    this.resolve(msg);
            }
            //else if (this.onContinue !== undefined) this.onContinue(msg)
        }
        onFail(msg) {
            if (++this._response_cpt == 1) {
                this.reject(MessageAsError(msg), msg);
            }
            //else if (this.onContinue !== undefined) this.onContinue(msg)
        }
        onCheckSuccess(message) {
            return this._onCheckSuccess(message);
        }
    }
    //  handler for 'bufferedrequest'
    class BufferedRequestHandlerPromiseImpl {
        constructor(resolve, reject, onMessage) {
            this.resolve = resolve;
            this.reject = reject;
            this.onMessage = onMessage;
            this._bufferMsg = [];
        }
        onSuccess(msg) {
            if (this.onMessage)
                this.onMessage(msg);
            this._bufferMsg.push(msg);
            if (Transport_1.EventStatus.Continue === msg.getStatus())
                return;
            this.resolve(this._bufferMsg);
        }
        onFail(msg) {
            this.reject(MessageAsError(msg), msg);
        }
        onCheckSuccess(message) {
            return message instanceof Transport_1.Transport;
        }
    }
    // handler for 'sendRequest'
    class RequestHandlerCallback {
        constructor(options) {
            this._onCheckSuccess = (msg) => {
                return !msg.isError();
            };
            if (options.onSuccess)
                this._onSuccess = options.onSuccess;
            else
                this._onSuccess = options.onResponse;
            if (options.onFail)
                this._onFail = options.onFail;
            else
                this._onFail = options.onResponse;
            if (options.onCheckSuccess)
                this._onCheckSuccess = options.onCheckSuccess;
        }
        onSuccess(msg) {
            this._onSuccess(msg);
        }
        onFail(msg) {
            this._onFail(msg);
        }
        onCheckSuccess(message) {
            return this._onCheckSuccess(message);
        }
    }
    function defaultOnRequest(message, origin) {
        var _a;
        _logger.warn("Receive message REQUEST, it's not supported ! (uri:'" + ((_a = message.getUri()) !== null && _a !== void 0 ? _a : '?') + "'");
        return false;
    }
    class ClientNodeBase extends ClientNodeEK {
        constructor(name, serverUrl, handlers) {
            super(name, serverUrl, handlers);
            this._protocol = ProtocolJSONv2_1.JSONv2.Protocol;
            this._requestMap = new Map(); // CorrelationID / RequestHandler;
            this._onInterceptSendMessage = handlers.onInterceptSendMessage;
            this._onInterceptReceptMessage = handlers.onInterceptReceptMessage;
            this._handleMessage =
                handlers.onMessage != null
                    ? handlers.onMessage
                    : (message) => {
                        _logger.debug('receive message ' + message.toString());
                    };
            this._handleRequest = handlers.onRequest != null ? handlers.onRequest : defaultOnRequest;
        }
        //-------------------------
        //--- RECEPT MESSAGE TEXT
        //-------------------------
        onText(input, origin) {
            if (!this._protocol.isText) {
                _logger.warn("Protocol is 'binary' but recept message as 'text'");
            }
            // DECODE
            let message = this._protocol.decode(input);
            if (message !== undefined) {
                // DECODE => YES
                // INTERCEPT
                if (this._onInterceptReceptMessage) {
                    if (this._onInterceptReceptMessage(message) == BusType_1.enInterceptResult.Intercept)
                        return true;
                }
                // RESPONSE
                if (message.isResponse()) {
                    if (this._handleResponse(message))
                        return true;
                }
                // REQUEST
                else if (message.isRequest()) {
                    if (this._handleRequest(message, origin))
                        return true;
                }
                else {
                    // SIMPLE MESSAGE
                    this._handleMessage(message);
                    return true;
                }
            }
            // INVALID MESSAGE
            this._handleTrapTextMessage(message, input);
            return true;
        }
        _handleResponse(message) {
            let correlationID = message.getCorrelationID();
            if (correlationID === undefined)
                return false;
            let requestHandler = this._requestMap.get(correlationID);
            if (requestHandler === undefined)
                return false;
            let success = requestHandler.onCheckSuccess ? requestHandler.onCheckSuccess(message) : message instanceof Transport_1.Transport;
            if (success && requestHandler.onSuccess) {
                requestHandler.onSuccess(message);
            }
            else if (!success && requestHandler.onFail) {
                requestHandler.onFail(message);
            }
            else if (requestHandler.onResponse) {
                requestHandler.onResponse(message);
            }
            // cleanup
            if (message.getStatus() !== Transport_1.EventStatus.Continue) {
                this._requestMap.delete(correlationID);
            }
            return true;
        }
        _handleTrapTextMessage(message, input) {
            _logger.warn('Node.onText- message trap... Not supported message !');
        }
        //-----------------------
        //--- SEND LOCAL MESSAGE
        //-----------------------
        directSend(message) {
            let msg = createBaseMessage(message);
            if (this._onInterceptSendMessage) {
                if (BusType_1.enInterceptResult.Intercept == this._onInterceptSendMessage(msg)) {
                    _logger.log('send warning: message ' + msg + ' intercepted !');
                    return false; //OR TRUE ?
                }
            }
            // SIMPLE MESSAGE
            this._handleMessage(msg);
            return true;
        }
        //--------------------------------------
        //--- SEND MESSAGE (synchrone version)
        //--------------------------------------
        send(nodeId, message) {
            let msg = createBaseMessage(message);
            try {
                if (this._onInterceptSendMessage) {
                    if (BusType_1.enInterceptResult.Intercept == this._onInterceptSendMessage(msg)) {
                        _logger.log('send warning: message ' + msg + ' intercepted !');
                        return false; //OR TRUE ?
                    }
                }
                let stringify = this._protocol.encode(msg);
                if (stringify !== undefined) {
                    //if ( this._protocol.isText )
                    this._node.sendText(nodeId, stringify);
                    return true;
                }
                _logger.error('Failed to send message (encode failed)');
            }
            catch (err) {
                _logger.error('Failed to send message. ' + err);
            }
            return false;
        }
        publish(nodeId, message) {
            return new Promise((resolve, reject) => {
                let msg = createBaseMessage(message);
                try {
                    if (this._onInterceptSendMessage) {
                        if (BusType_1.enInterceptResult.Intercept == this._onInterceptSendMessage(msg)) {
                            reject('Message ' + msg + ' intercept !');
                            return;
                        }
                    }
                    let stringify = this._protocol.encode(msg);
                    if (stringify !== undefined) {
                        this._node.sendText(nodeId, stringify);
                        resolve();
                        return;
                    }
                    reject("failed to publish message '" + message + "' (encoding error).");
                }
                catch (err) {
                    reject("failed to send message '" + message + "' :" + err);
                }
            });
        }
        sendRequest(nodeId, options) {
            if (!isUri(options.uri))
                throw new Error('sendRequest syntax error: uri is not valid. (\'options.uri="/myUri"\'');
            if (Utils.isUndefined(options.onResponse) && (Utils.isUndefined(options.onSuccess) || Utils.isUndefined(options.onFail)))
                throw new Error('sendRequest syntax error: no valid callback combination. if onResponse is omitted, onSuccess and onFail must both be set.');
            try {
                let myMsg = createBaseMessage(options.msg);
                let cid = myMsg.withHeader(Transport_1.HeaderKey.URI, options.uri).withCorrelationID().flagAsRequest().getCorrelationID();
                if (this._onInterceptSendMessage) {
                    if (BusType_1.enInterceptResult.Intercept == this._onInterceptSendMessage(myMsg)) {
                        _logger.log('send warning: request "' + myMsg.getUri() + '" intercepted');
                        return false; //OR TRUE ?
                    }
                }
                // store response callback
                let handler = new RequestHandlerCallback(options);
                this._requestMap.set(cid, handler);
                let stringify = this._protocol.encode(myMsg);
                if (stringify !== undefined) {
                    this._node.sendText(nodeId, stringify);
                }
                else {
                    _logger.log('sendRequest failed: request "' + myMsg.getUri() + '" encode error !');
                    return false;
                }
                return true;
            }
            catch (err) {
                if (options.uri)
                    _logger.error('sendRequest(' + options.uri + ') failed:' + err);
            }
            return false;
        }
        request(nodeId, uri, message, errorPolicies) {
            if (!isUri(uri))
                throw new Error("request syntax error: uri is not valid -- Uses request('/myUri', message?)");
            return new Promise((resolve, reject) => {
                try {
                    let myMsg = createBaseMessage(message);
                    let cid = myMsg.withHeader(Transport_1.HeaderKey.URI, uri).withCorrelationID().flagAsRequest().getCorrelationID();
                    if (this._onInterceptSendMessage) {
                        if (BusType_1.enInterceptResult.Intercept == this._onInterceptSendMessage(myMsg)) {
                            return reject(new Error('request("' + uri + '") failed: blocked by sendMessage interceptor'));
                        }
                    }
                    let handler = new RequestHandlerPromiseImpl(resolve, reject, errorPolicies);
                    this._requestMap.set(cid, handler);
                    let stringify = this._protocol.encode(myMsg);
                    if (stringify !== undefined) {
                        this._node.sendText(nodeId, stringify);
                    }
                    else {
                        reject(new Error('request("' + uri + '") failed: can not encode message'));
                    }
                }
                catch (err) {
                    reject(new Error('request("' + uri + '") failed: ' + err));
                }
            });
        }
        bufferedRequest(nodeId, uri, message, onMessage) {
            if (!isUri(uri))
                throw new Error("request syntax error: uri is not valid -- Uses bufferedRequest('/myUri', message?)");
            return new Promise((resolve, reject) => {
                try {
                    let myMsg = createBaseMessage(message);
                    let cid = myMsg.withHeader(Transport_1.HeaderKey.URI, uri).withCorrelationID().flagAsRequest().getCorrelationID();
                    if (this._onInterceptSendMessage) {
                        if (BusType_1.enInterceptResult.Intercept == this._onInterceptSendMessage(myMsg)) {
                            return reject(new Error('bufferedrequest("' + uri + '") failed: blocked by sendMessage interceptor'));
                        }
                    }
                    let handler = new BufferedRequestHandlerPromiseImpl(resolve, reject, onMessage);
                    this._requestMap.set(cid, handler);
                    let stringify = this._protocol.encode(myMsg);
                    if (stringify !== undefined) {
                        this._node.sendText(nodeId, stringify);
                    }
                    else {
                        reject(new Error('bufferedRequest("' + uri + '") failed: can not encode message'));
                    }
                }
                catch (err) {
                    reject(new Error('bufferedrequest("' + uri + '") failed: ' + err));
                }
            });
        }
    }
    exports.ClientNodeBase = ClientNodeBase;
});
