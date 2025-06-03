/*global define */
/**
 * Contains definition of PXPEvent.Transport the type used to package
 *
 * @module   DS/DELPXPFoundations/PXPEventTransport
 *
 */
define('DS/DELPXPFoundationsLegacy/PXPEventTransport', ['DS/DELPXPFoundationsLegacy/PXPError', 'DS/Logger/Logger', 'DS/DELPXPFoundationsLegacy/PXPUtils'], function (
  PXPError,
  Logger,
  Utils
) {
  'use strict';

  var PXPEvent = {};
  var _logger = Logger.getLogger(PXPEvent);

  PXPEvent.HeaderKey = Object.freeze({
    URI: '#URI',
    CorrelationID: '#CID',
    MessageID: '#MID',
    Status: '#STS',
    Topics: '#TPC',
    ContentType: '#TYP',
  });

  PXPEvent.EventStatus = Object.freeze({
    Undefined: 0,
    Continue: 100,
    Ok: 200,
    Created: 201,
    NoContent: 204,
    BadRequest: 400,
    UnAuthorized: 401,
    NotFound: 404,
    TimeOut: 408,
    TooManyRequest: 429,
    ServerError: 500,
    NotImplemented: 501,
    Unavailable: 503,
  });

  PXPEvent.EventType = Object.freeze({
    empty: '0',
    text: 'T',
    json: 'J',
    error: '!',
    //binary: 'B',
    bool: 'L',
    object: 'O',
    bagobjects: 'G',
    uid: 'X',
    uint64: 'U',
    int64: 'I',
    double: 'F',
    cmd: '#',
  });

  PXPEvent.EventFlag = Object.freeze({
    message: '-',
    request: '>',
    response: '<',
  });

  ///--- Protocol
  PXPEvent.Protocol = {};

  PXPEvent.Protocol.JSONv2 = Object.freeze({
    decode: function (message) {
      // JSON ?
      if (Utils.isString(message)) {
        let input = message.trim();
        if (input[0] === '[' && input[input.length - 1] === ']') {
          try {
            let obj = JSON.parse(input);
            // Check is PXPJSONv2
            if (Array.isArray(obj)) {
              if (obj.length === 4) {
                if (obj[0] === 'PXPv2') {
                  let evt = null;
                  let contentType = obj[2];
                  let content = obj[3];
                  let cType;
                  let cFlag;
                  if (!contentType) {
                    cType = PXPEvent.EventType.empty;
                    cFlag = PXPEvent.EventFlag.message;
                  } else if (contentType.length === 1) {
                    cType = contentType[0];
                    cFlag = PXPEvent.EventFlag.message;
                  } else if (contentType.length === 2) {
                    cType = contentType[0];
                    cFlag = contentType[1];
                  } else {
                    cType = PXPEvent.EventType.empty;
                    cFlag = PXPEvent.EventFlag.message;
                  }

                  switch (cType) {
                    case PXPEvent.EventType.empty:
                      evt = new PXPEvent.Transport();
                      break;
                    case PXPEvent.EventType.text:
                      evt = PXPEvent.Transport.createText(content);
                      break;
                    case PXPEvent.EventType.json:
                      evt = PXPEvent.Transport.createJson(content);
                      break;
                    case PXPEvent.EventType.error: {
                      let err = PXPError.CreateFromJSON(content);
                      evt = PXPEvent.Transport.createError(err);
                      break;
                    }
                    //case PXPEvent.EventType.binary:
                    //    break;
                    case PXPEvent.EventType.bool:
                      evt = PXPEvent.Transport.createBool(content);
                      break;
                    case PXPEvent.EventType.object:
                      evt = PXPEvent.Transport.createPXP_Object(content);
                      break;
                    case PXPEvent.EventType.bagobjects:
                      evt = PXPEvent.Transport.createPXP_BagObjects(content);
                      break;
                    case PXPEvent.EventType.uid:
                      evt = PXPEvent.Transport.createPXP_Uid(content);
                      break;
                    case PXPEvent.EventType.uint64:
                      evt = PXPEvent.Transport.createUint64(content);
                      break;
                    case PXPEvent.EventType.int64:
                      evt = PXPEvent.Transport.createInt64(content);
                      break;
                    case PXPEvent.EventType.double:
                      evt = PXPEvent.Transport.createDouble(content);
                      break;
                    case PXPEvent.EventType.cmd:
                      evt = PXPEvent.Transport.createInternalCmd(content);
                      break;
                    default:
                      _logger.warn('PXPJSONv2- Unknown type !');
                      break;
                  }
                  if (Utils.isNull(evt)) evt = new PXPEvent.Transport();

                  switch (cFlag) {
                    case PXPEvent.EventFlag.request:
                      evt.flagAsRequest();
                      break;
                    case PXPEvent.EventFlag.response:
                      evt.flagAsResponse();
                      break;
                    case PXPEvent.EventFlag.message:
                      break;
                  }
                  if (Utils.isObject(obj[1])) {
                    // headers
                    evt.withHeaders(obj[1]);
                  }
                  return evt;
                }
              }
            }
          } catch (e) {
            _logger.warn("PXPJSONv2-'" + input + "' => Not a valid JSON type ! (" + e + ')');
          }
        }
        return PXPEvent.Transport.createText(message); // envoie comme texte...
      }
      _logger.warn('PXPJSONv2- Not a valid message type ! (not a string)');
      return undefined;
    },
    encode: function (message) {
      if (message instanceof PXPEvent.Transport) {
        let cType = message.getType();
        if (!message.isSimpleMessage()) {
          cType += message.isRequest() ? PXPEvent.EventFlag.request : message.isResponse() ? PXPEvent.EventFlag.response : PXPEvent.EventFlag.message;
        }
        if (message.hasHeaders()) {
          return JSON.stringify(['PXPv2', message.getHeaders(), cType, message.getContent()]);
        }
        return JSON.stringify(['PXPv2', null, cType, message.getContent()]);
      }
      return '["PXPv2",null,"T","' + message.toString() + '"]';
    },
  });

  /**
   * Create a PXPEvent.Transport object.
   *
   * @example
   * new PXPEvent.Transport( PXPEvent.EventType.text, "My message", {"user":"tom"});
   * // will create a message text with a headers.
   *
   * @param {EventType} type - Type du message
   * @param {any} content - Message content. depends of type of message
   * @param {Object} headers - Represents Key/value of headers.
   */
  PXPEvent.Transport = function (type, content, headers) {
    if (Utils.isNill(type) || Utils.isNill(content)) type = PXPEvent.EventType.empty;
    this.flag = PXPEvent.EventFlag.message;

    switch (type) {
      case PXPEvent.EventType.empty: {
        this.type = PXPEvent.EventType.empty;
        this.content = null;
        break;
      }
      case PXPEvent.EventType.text: {
        this.type = PXPEvent.EventType.text;
        this.content = Utils.convertToString(content);
        break;
      }
      case PXPEvent.EventType.json: {
        this.type = PXPEvent.EventType.json;
        this.content = content;
        break;
      }
      case PXPEvent.EventType.error: {
        this.type = PXPEvent.EventType.error;
        if (content instanceof PXPError) {
          this.content = content;
        } else if (Utils.isString(content)) {
          this.content = new PXPError(content, PXPError.stdCode.GenericError, PXPError.enTypeError.user);
        } else {
          this.content = PXPError.CreateFromJSON(content);
        }
        break;
      }
      //case PXPEvent.EventType.binary:
      //    this.type = PXPEvent.EventType.empty;
      //    break;
      case PXPEvent.EventType.bool: {
        this.type = PXPEvent.EventType.bool;
        this.content = Utils.isBool(content) ? content : false;
        break;
      }
      case PXPEvent.EventType.object: {
        this.type = PXPEvent.EventType.object;
        this.content = Utils.isObject(content) ? content : {};
        break;
      }
      case PXPEvent.EventType.bagobjects: {
        this.type = PXPEvent.EventType.bagobjects;
        this.content = Utils.isObject(content) ? content : {};
        break;
      }
      case PXPEvent.EventType.uid: {
        this.type = PXPEvent.EventType.uid;
        this.content = content.toString(); // or Object UID ?
        break;
      }
      case PXPEvent.EventType.uint64: {
        this.type = PXPEvent.EventType.uint64;
        this.content = Utils.isUint64(content) ? content : Number.NaN;
        break;
      }
      case PXPEvent.EventType.int64: {
        this.type = PXPEvent.EventType.int64;
        this.content = Utils.isInt64(content) ? content : Number.NaN;
        break;
      }
      case PXPEvent.EventType.double: {
        this.type = PXPEvent.EventType.double;
        this.content = Utils.isDouble(content) ? content : Number.NaN;
        break;
      }
      case PXPEvent.EventType.cmd: {
        this.type = PXPEvent.EventType.cmd;
        this.content = Utils.isUint64(content) ? content : Number.NaN;
        break;
      }
      default: {
        this.type = PXPEvent.EventType.empty;
        _logger.warn('EventTransport- Unknown type !');
        break;
      }
    }
    this.headers = Utils.isObject(headers) ? headers : {};
  };

  /**
   * Returns the message content as a string.
   *
   * @returns {string} message content
   */
  PXPEvent.Transport.prototype.toString = function () {
    return '' + (Utils.isObject(this.content) ? JSON.stringify(this.content) : this.content);
  };

  /**
   * returns true, if the message has no content.
   *
   * @returns {boolean} true, if empty message
   */
  PXPEvent.Transport.prototype.isEmpty = function () {
    return this.type === PXPEvent.EventType.empty;
  };

  /**
   * returns true, if the message contains text
   *
   * @returns {boolean} true, if text message
   */
  PXPEvent.Transport.prototype.isText = function () {
    return this.type === PXPEvent.EventType.text;
  };

  /**
   * returns true, if the message contains number (uint or int).
   *
   * @returns {boolean} true, if number message
   */
  PXPEvent.Transport.prototype.isNumber = function () {
    return this.type === PXPEvent.EventType.uint64 || this.type === PXPEvent.EventType.int64 || this.type === PXPEvent.EventType.double;
  };

  /**
   * returns true, if the message contains boolean.
   *
   * @returns {boolean} true, if boolean message
   */
  PXPEvent.Transport.prototype.isBool = function () {
    return this.type === PXPEvent.EventType.bool;
  };

  /**
   * returns true, if the message contains json, JS Object.
   *
   * @returns {boolean} true, if json message
   */
  PXPEvent.Transport.prototype.isJson = function () {
    return this.type === PXPEvent.EventType.json;
  };

  /**
   * returns true, if the message contains a javascript object (error, PXPObject, PXPBagObjects, json).
   *
   * @returns {boolean} true, if message contains compatible javascript object.
   */
  PXPEvent.Transport.prototype.isJSObject = function () {
    switch (this.type) {
      case PXPEvent.EventType.error:
      case PXPEvent.EventType.object:
      case PXPEvent.EventType.bagobjects:
      case PXPEvent.EventType.json:
        return true;
    }
    return false;
  };

  /**
   * returns true, if the message contains a PXPType (PXPObject, PXPBagObject).
   *
   * @returns {boolean} true, if message contains PXP type.
   */
  PXPEvent.Transport.prototype.isPXPType = function () {
    switch (this.type) {
      case PXPEvent.EventType.uid:
      case PXPEvent.EventType.object:
      case PXPEvent.EventType.bagobjects:
        return true;
    }
    return false;
  };

  /**
   * returns true, if the message contains a PXPObject.
   *
   * @returns {boolean} true, if message contains PXPObject.
   */
  PXPEvent.Transport.prototype.isPXP_Object = function () {
    return this.type === PXPEvent.EventType.object;
  };

  /**
   * returns true, if the message contains a PXPBagObjects.
   *
   * @returns {boolean} true, if message contains PXPBagObjects.
   */
  PXPEvent.Transport.prototype.isPXP_BagObjects = function () {
    return this.type === PXPEvent.EventType.bagobjects;
  };

  /**
   * returns true, if the message contains a PXPUID (eq C++ PortableUID).
   *
   * @returns {boolean} true, if message contains PXPUID.
   */
  PXPEvent.Transport.prototype.isPXP_Uid = function () {
    return this.type === PXPEvent.EventType.uid;
  };

  /**
   * returns true, if the message contains a internalcmd [RESERVED].
   *
   * @returns {boolean} true, if internalCommand message.
   */
  PXPEvent.Transport.prototype.isInternalCmd = function () {
    return this.type === PXPEvent.EventType.cmd;
  };

  /**
   * returns true, if the message represents a error.
   *
   * @returns {boolean} true, if message contains PXPError.
   */
  PXPEvent.Transport.prototype.isError = function () {
    return this.type === PXPEvent.EventType.error;
  };

  /**
   * returns true, if the message is a simple message (not a request, not a response).
   *
   * @returns {boolean} true, if a simple message.
   */
  PXPEvent.Transport.prototype.isSimpleMessage = function () {
    return this.flag === PXPEvent.EventFlag.message;
  };

  /**
   * returns true, if the message is a request.
   *
   * @returns {boolean} true, if a request message.
   */
  PXPEvent.Transport.prototype.isRequest = function () {
    return this.flag === PXPEvent.EventFlag.request;
  };

  /**
   * returns true, if the message is a response.
   *
   * @returns {boolean} true, if a response message.
   */
  PXPEvent.Transport.prototype.isResponse = function () {
    return this.flag === PXPEvent.EventFlag.response;
  };

  /**
   * Tag this message as a request. [INTERNAL USES]
   */
  PXPEvent.Transport.prototype.flagAsRequest = function () {
    this.flag = PXPEvent.EventFlag.request;
  };

  /**
   * Tag this message as a response. [INTERNAL USES]
   */
  PXPEvent.Transport.prototype.flagAsResponse = function () {
    this.flag = PXPEvent.EventFlag.response;
  };

  /**
   * creates a transport object that represents a text message.
   *
   * @param {any} content - text.
   * @return {EventTransport} A new EventTransport.
   */
  PXPEvent.Transport.createText = function (content) {
    return new PXPEvent.Transport(PXPEvent.EventType.text, content);
  };

  /**
   * creates a transport object that represents a boolean message.
   *
   * @param {any} content - bool.
   * @return {EventTransport} A new EventTransport.
   */
  PXPEvent.Transport.createBool = function (content) {
    return new PXPEvent.Transport(PXPEvent.EventType.bool, content);
  };

  /**
   * creates a transport object that represents a json message.
   *
   * @param {any} content - string json or javascript objet.
   * @return {EventTransport} A new EventTransport.
   */
  PXPEvent.Transport.createJson = function (content) {
    return new PXPEvent.Transport(PXPEvent.EventType.json, content);
  };

  PXPEvent.Transport.createError = function (content) {
    return new PXPEvent.Transport(PXPEvent.EventType.error, content);
  };

  /**
   * creates a transport object that represents a PXPObject message. [INTERNAL USES]
   *
   * @param {any} content - serialized PXPObject.
   * @return {EventTransport} A new EventTransport.
   */
  PXPEvent.Transport.createPXP_Object = function (content) {
    return new PXPEvent.Transport(PXPEvent.EventType.object, content);
  };

  /**
   * creates a transport object that represents a PXPBagObject message. [INTERNAL USES]
   *
   * @param {any} content - serialized PXPBagobject.
   * @return {EventTransport} A new EventTransport.
   */
  PXPEvent.Transport.createPXP_BagObjects = function (content) {
    return new PXPEvent.Transport(PXPEvent.EventType.bagobjects, content);
  };

  /**
   * creates a transport object that represents a PortableUID message. (Format: <ClassName>#uid ) [INTERNAL USES]
   *
   * @param {any} content - UID.
   * @return {EventTransport} A new EventTransport.
   */
  PXPEvent.Transport.createPXP_Uid = function (content) {
    return new PXPEvent.Transport(PXPEvent.EventType.uid, content);
  };

  /**
   * creates a transport object that represents a positive number.
   *
   * @param {Integer} content - Number.
   * @return {EventTransport} A new EventTransport.
   */
  PXPEvent.Transport.createUint64 = function (content) {
    return new PXPEvent.Transport(PXPEvent.EventType.uint64, content);
  };

  /**
   * creates a transport object that represents a number.
   *
   * @param {Integer} content - Number.
   * @return {EventTransport} A new EventTransport.
   */
  PXPEvent.Transport.createInt64 = function (content) {
    return new PXPEvent.Transport(PXPEvent.EventType.int64, content);
  };

  /**
   * creates a transport object that represents a positive number.
   *
   * @param {Double} content - Number.
   * @return {EventTransport} A new EventTransport.
   */
   PXPEvent.Transport.createDouble = function (content) {
    return new PXPEvent.Transport(PXPEvent.EventType.double, content);
  };


  /**
   * creates a transport object that represents a internal commmand. [RESERVED]
   *
   * @param {Integer} content - Internal Command
   * @return {EventTransport} A new EventTransport.
   */
  PXPEvent.Transport.createInternalCmd = function (content) {
    return new PXPEvent.Transport(PXPEvent.EventType.cmd, content);
  };

  /**
   * creates a transport object with a JS Object { type: PXPType, content: ..., headers: { key: value, ... }}
   *
   * @param {object} object - JS Object
   * @return {EventTransport} A new EventTransport.
   */
  PXPEvent.Transport.createFromObject = function (object) {
    return new PXPEvent.Transport(object.type, object.content, object.headers);
  };

  /**
   * creates a transport object. Depending on the content, the most suitable type will be used.
   *
   * @param {any} content - message content
   * @return {EventTransport} A new EventTransport.
   */
  PXPEvent.Transport.create = function (content) {
    if (Utils.isDefined(content)) {
      if (Utils.isUint64(content)) {
        return new PXPEvent.Transport.createUint64(Number(content));
      }
      if (Utils.isInt64(content)) {
        return new PXPEvent.Transport.createInt64(Number(content));
      }
      if (Utils.isDouble(content)) {
        return new PXPEvent.Transport.createDouble(Number(content));
      }
      if (Utils.isString(content)) {
        return new PXPEvent.Transport.createText(content);
      }
      if (Utils.isBool(content)) {
        return new PXPEvent.Transport.createBool(content);
      }
      if (Utils.isObject(content)) {
        return new PXPEvent.Transport.createJSON('' + JSON.stringify(content));
      }
      return new PXPEvent.Transport.createText('' + content);
    }
    return new PXPEvent.Transport();
  };

  PXPEvent.Transport.DisplayType = function (type) {
    switch (type) {
      case PXPEvent.EventType.empty:
        return 'empty';
      case PXPEvent.EventType.text:
        return 'text';
      case PXPEvent.EventType.bool:
        return 'bool';
      case PXPEvent.EventType.json:
        return 'json';
      case PXPEvent.EventType.error:
        return 'error';
      //case PXPEvent.EventType.binary:
      //    return "binary";
      case PXPEvent.EventType.object:
        return 'PXP Object';
      case PXPEvent.EventType.bagobjects:
        return 'PXP BagObjects';
      case PXPEvent.EventType.uid:
        return 'PXP UID';
      case PXPEvent.EventType.uint64:
        return 'Uint64';
      case PXPEvent.EventType.int64:
        return 'Int64';
      case PXPEvent.EventType.double:
          return 'Int64';
      case PXPEvent.EventType.cmd:
        return 'Cmd';
      default:
        return 'Unknown';
    }
  };

  /**
   * returns 'EventType' of this message.
   *
   * @return {EventType} Type of message content.
   */
  PXPEvent.Transport.prototype.getType = function () {
    return this.type;
  };

  /**
   * returns 'content' of this message.
   *
   * @return {any} message content.
   */
  PXPEvent.Transport.prototype.getContent = function () {
    return this.content;
  };

  /**
   * returns 'headers' of this message.
   *
   * @return {object} message headers.
   */
  PXPEvent.Transport.prototype.getHeaders = function () {
    return this.headers;
  };

  /**
   * Check if 'headers' is empty.
   *
   * @return {bool} returns true if message headers have information, else 'false'.
   */
  PXPEvent.Transport.prototype.hasHeaders = function () {
    return Utils.isDefined(this.headers) && Object.entries(this.headers).length !== 0;
  };

  /**
   * Check if message has a CorrelationID.
   *
   * @return {bool} returns true if message headers contains 'CorrelationID', else 'false'.
   */
  PXPEvent.Transport.prototype.hasCorrelationID = function () {
    return this.headers.hasOwnProperty(PXPEvent.HeaderKey.CorrelationID);
  };

  /**
   * add a 'CorrelationID'.
   *
   * @param {string} correlationID - stores the 'correlationID', if this value is undefined, the 'CorrelationID' is auto generated. It's the better solution !
   * @return {object} This Object
   */
  PXPEvent.Transport.prototype.withCorrelationID = function (correlationID) {
    if (Utils.isEmpty(correlationID)) correlationID = Utils.UUIDv4();

    this.headers[PXPEvent.HeaderKey.CorrelationID] = correlationID;
    return this;
  };

  /**
   * add a 'CorrelationID'.
   * @deprecated Replace by withCorrelationID !
   *
   * @param {string} correlationID - stores the 'correlationID', if this value is undefined, the 'CorrelationID' is auto generated. It's the better solution !
   * @return {string} returns correlationID.
   */
  PXPEvent.Transport.prototype.addCorrelationID = function (correlationID) {
    return this.withCorrelationID(correlationID).getCorrelationID();
  };

  /**
   * returns current 'CorrelationID'.
   *
   * @return { string } correlationID - if 'Correlation' does not exist returns undefined.
   */
  PXPEvent.Transport.prototype.getCorrelationID = function () {
    return this.headers[PXPEvent.HeaderKey.CorrelationID];
  };

  /**
   * Check if message has a MessageID.
   *
   * @return {bool} returns true if message headers contains 'MessageID', else 'false'.
   */
  PXPEvent.Transport.prototype.hasMessageID = function () {
    return this.headers.hasOwnProperty(PXPEvent.HeaderKey.MessageID);
  };

  /**
   * add a 'MessageID'.
   *
   * @param {string} messageID - stores the 'messageID', if this value is undefined, the 'MessageID' is auto generated. It's the better solution !
   * @return {object} This Object
   */
  PXPEvent.Transport.prototype.withMessageID = function (messageID) {
    if (Utils.isEmpty(messageID)) messageID = Utils.UUIDv4();

    this.headers[PXPEvent.HeaderKey.MessageID] = messageID;
    return this;
  };

  /**
   * add a 'MessageID'.
   * @deprecated Replace by withMessageID !
   *
   * @param {string} messageID - stores the 'messageID', if this value is undefined, the 'MessageID' is auto generated. It's the better solution !
   * @return { string } messageID
   */
  PXPEvent.Transport.prototype.addMessageID = function (messageID) {
    return this.withMessageID(messageID).getMessageID();
  };

  /**
   * returns current 'MessageID'.
   *
   * @return { string } messageID - if 'messageID' does not exist returns undefined.
   */
  PXPEvent.Transport.prototype.getMessageID = function () {
    return this.headers[PXPEvent.HeaderKey.MessageID];
  };

  /**
   * returns current 'Uri'.
   *
   * @return { string } Uri - if 'Uri' does not exist returns undefined.
   */
  PXPEvent.Transport.prototype.getUri = function () {
    return this.headers[PXPEvent.HeaderKey.URI];
  };


  /**
   * Check if message has a ContentType information
   *
   * @return {bool} returns true if message headers contains 'ContentType', else 'false'.
   */
  PXPEvent.Transport.prototype.hasContentType = function () {
    return this.headers.hasOwnProperty(PXPEvent.HeaderKey.ContentType);
  };

  /**
   * add a 'ContentType'.
   *
   * @param {string} contentType - stores 'ContentType' information -- It's an specific entry to qualified the message
   * @return {object} This Object
   */
  PXPEvent.Transport.prototype.withContentType = function (contentType) {
    this.headers[PXPEvent.HeaderKey.ContentType] = contentType;
    return this;
  };

  /**
   * add a 'ContentType'.
   * @deprecated Replace by withContentType !
   *
   * @param {string} contentType - stores 'ContentType' information -- It's an specific entry to qualified the message
   * @return {string} returns contentType
   */
  PXPEvent.Transport.prototype.addContentType = function (contentType) {
    return this.withContentType(contentType).getContentType();
  };

  /**
   * returns current 'ContentType'.
   *
   * @return {string} ContentType - if 'ContentType' does not exist returns undefined.
   */
  PXPEvent.Transport.prototype.getContentType = function () {
    return this.headers[PXPEvent.HeaderKey.ContentType];
  };

  /**
   * sets the 'Status' Header.
   *
   * @param {int} status - stores 'status' information
   * @return {object} This Object
   */
  PXPEvent.Transport.prototype.withStatus = function (status) {
    this.headers[PXPEvent.HeaderKey.Status] = status;
    return this;
  };

  /**
   * sets the 'Status' Header.
   * @deprecated Replace by withStatus !
   *
   * @param {int} status - stores 'status' information
   */
  PXPEvent.Transport.prototype.setStatus = function (status) {
    this.withStatus(status);
  };

  /**
   * returns current 'Status' (asNumber).
   *
   * @return {int} Status - if 'Status' does not exist returns PXPEvent.EventStatus.Undefined.
   */
  PXPEvent.Transport.prototype.getStatus = function () {
    var status = this.headers[PXPEvent.HeaderKey.Status];
    if (!Utils.isNill(status)) {
      var vStatus = parseInt(status);
      if (!isNaN(vStatus)) return vStatus;
    }
    return PXPEvent.EventStatus.Undefined;
  };

  /**
   *
   * @returns {bool} Status - return false if Status is error (err >400), and return true otherwise (if status ok or status missing)
   */
  PXPEvent.Transport.prototype.isStatusError = function () {
    let status = this.getStatus();
    if (status === PXPEvent.EventStatus.Undefined) return false;

    return status >= 400;
  };

  /**
   * returns topics origin.
   *
   * @return {string} Topics - if 'Topics' does not exist returns undefined.
   */
  PXPEvent.Transport.prototype.getTopic = function () {
    return this.headers[PXPEvent.HeaderKey.Topics];
  };

  /**
   * sets topics Target. When you send a message with a topic information, the server/gateway publish these message on this topic.
   *
   * @param {string} topic - destination topic where to send the message
   * @return {object} This Object
   */
  PXPEvent.Transport.prototype.toTopic = function (topic) {
    this.headers[PXPEvent.HeaderKey.Topics] = topic;
    return this;
  };

  /**
   * Update headers.
   *
   * @param {object} headers
   * @return {object} This Object
   */
  PXPEvent.Transport.prototype.withHeaders = function (headers) {
    if (Utils.isObject(headers)) {
      for (var k in headers) {
        if (headers.hasOwnProperty(k)) {
          this.headers[k] = headers[k];
        }
      }
    }
    return this;
  };

  return PXPEvent;
});
