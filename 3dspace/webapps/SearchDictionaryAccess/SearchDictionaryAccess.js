'use strict';

define('DS/SearchDictionaryAccess/SearchRequestUtils',
      ['DS/WAFData/WAFData'],
function (WAFData){

  var requestUtils = {

    sendRequest: function(iURL, iOptions, iWithoutAuth){
      if (!iURL){
        return;
      }
      if (!iOptions){
        iOptions = {};
      }
      if (iWithoutAuth){
        WAFData.proxifiedRequest(iURL, iOptions);
      }
      else {
        WAFData.authenticatedRequest(iURL, iOptions);
      }
    }
  };
  return requestUtils;
});

'use strict';

/*global Promise console widget sessionStorage window*/
/*jslint plusplus: true*/
define('DS/SearchDictionaryAccess/SearchDicoUtils',
  ['UWA/Core',
   'DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices',
   'text!DS/SearchDictionaryAccess/assets/SearchDicoSettings.json'],

  function (Core, PlatformServices, DicoSettings) {


    // private data
    var _3DExpPatformServices = [];
    var _RDFPilar = '';
    var _RDFPPVersion = 'v0';
    var _hardcodedURL = '';
    var _myAppsConfig = {};
    var _dicoSettings = {};

    var dicoUtils = {

      /* getPlatformServices() Returns:
       [{ "platformId": "R1132100081733",
        "displayName": " R1132100081733-US-West",
        "3DSpace": "https://R1132100081733-eu1-417nbl0718-3dspace.3dexperience.3ds.com/3DSpace",
        "3DPassport": "https://iam.ppd.3ds.com",
        "usersgroup": "https://R1132100081733-eu1-417nbl0718-usersgroup.3dexperience.3ds.com"
        }, ... ]
       */
      dicoElemsBaseKey: 'dicoElements_',

      dicoPropValuesBaseKey: 'dicoPropValues_',

      dicoPropRootsBaseKey: 'dicoPropRoots',

      dicoExtensionsBaseKey: 'dicoExtensions',

      initSrvRequest: function () {
        _dicoSettings = JSON.parse(DicoSettings);
        var ontoService = _dicoSettings.CloudOntologyService;
        _RDFPilar = _dicoSettings.RDFPilar;
        _RDFPPVersion = _dicoSettings.RDFPPVersion;
        _hardcodedURL = _dicoSettings.RDFServerURL;

        if (!_RDFPilar){
          _RDFPilar = '3drdfpersist';
        }
        if (!_RDFPPVersion){
          _RDFPPVersion = 'v0';
        }
        PlatformServices.getPlatformServices(
          {
            config: _myAppsConfig,
            onComplete: function (data) {
              // dicoUtils.setPatformServices(data); //
              _3DExpPatformServices = data;
              if (data && data.length === 1 && data[0].platformId === 'OnPremise' && !_hardcodedURL) {
                ontoService = '3DSpace';
              }
            },

            onFailure: function () {
              //console.error('Call to PlatformServices.getPlatformServices failed : ' + data);
            }
          });
        return ontoService;
      },

      setMyAppsConfig: function(options){
        _myAppsConfig = {};
        _myAppsConfig.myAppsBaseUrl = options.myAppsBaseUrl;
        _myAppsConfig.userId = options.userId;
        _myAppsConfig.lang = options.lang;
      },

      isWithoutAuth: function(){
        var dicoSettings = JSON.parse(DicoSettings);
        if (dicoSettings.isRDFWithAuth && dicoSettings.isRDFWithAuth === 'false'){
          return true;
        }
        return false;
      },

      isRDFOnER: function (options) {
        if (options.tenantId === 'OnPremise' && options.OnPremiseWith3DRDF === 'true'){
          //console.log('*** INFO: E4All Environment: RDF on RDFKernel!');
          return false;
        }

        if (options.tenantId && options.tenantId.startsWith('ODTService@') && options.OnPremiseWith3DRDF === 'true'){
          //console.log('*** INFO: ODT Environment: RDF on RDFKernel!');
          return false;
        }

        // SGA5: Separate activation of RDF usage for RDF-apps and for 3DSearch
        if (options.serviceName && this.isRDFService(options.serviceName)){
          //console.log('*** INFO: Forced RDF-based service usage: RDF on RDFKernel!');
          return false;
        }

        if (_dicoSettings.RDFFedVocabulariesOn3DSpace === 'true' || options.tenantId === 'OnPremise') {
            //console.log('*** INFO: RDF on 3DSpace.');
            return true;
        }
        return false;
      },

      getServiceBaseURLPromise: function(service, tenantId, option, pillar) {
        var that = this;
        return new Promise(function(resolve, reject){
          var url;
          if (option && option.startsWith('ODTService@')) {
            if (service === '3DSpace'){
              resolve(option.substring(11) + '/resources/6WVocab/access/');
            } else {
              resolve(option.substring(11) + 'v0/invoke/');
            }
          }
          else if (!_3DExpPatformServices || _3DExpPatformServices.length === 0){
            PlatformServices.getPlatformServices(
              {
                config: _myAppsConfig,

                onComplete: function (data) {
                  _3DExpPatformServices = data;
                  if (_3DExpPatformServices !== undefined){
                    url = that.getServiceBaseURL(service, tenantId, option, pillar);
                    if (typeof url === 'undefined'){
                      console.error('URL cannot be computed');
                      return reject(new Error('URL cannot be computed'));
                    }
                    return resolve(url);
                  } else {
                    console.error(new Error('PlatformServices.getPlatformServices returned an empty result'));
                    return reject(data);
                  }
                },

                onFailure: function (data) {
                  console.error(new Error('Call to PlatformServices.getPlatformServices failed: ' + data));
                  return reject(data);
                }
              });
          } else {
            url = that.getServiceBaseURL(service, tenantId, option, pillar);
            if (typeof url !== 'undefined'){
              return resolve(url);
            } else {
              return reject(new Error('Cannot find URL from MyApps and no hardcoded URL neither'));
            }
          }
        });
      },

      getServiceBaseURL: function (service, tenantId, option, pillar) {
        if (tenantId === null){
          console.warn('*** Warning: tenant id not specified by caller!');
        }
        var srvURL;
        // for 3DSwym service reroute web service calls to 3DSpace, as federated vocabularies are not stored in 3DSwym
        if (service==='3DSwym') {
          service = '3DSpace';
        }
        for (var i = 0; i < _3DExpPatformServices.length; i++) {
          if (_3DExpPatformServices[i].platformId === tenantId) {
            srvURL = _3DExpPatformServices[i][service];
            if (typeof srvURL === 'undefined' && service === '3DSpace') {
              console.warn('*** Warning: Service 3DSpace not available, consider 6WTag for BI.');
              // if 3DSpace URL not returned, on cloud use 3DDrive and onpremise 6WTags
              if (tenantId === 'OnPremise'){
                srvURL = _3DExpPatformServices[i]['6WTags'];
              }
              else {
                srvURL = _3DExpPatformServices[i]['3DDrive'];
              }
            }
            // SGA5: check if RDF service, in this case return srvURL with pilar
            else if (typeof srvURL !== 'undefined' && tenantId !== 'OnPremise' && this.isRDFService(service)){
              if (!pillar){
                pillar = _RDFPilar;
                if (service === '3dplan'){
                  pillar = '';
                }
              }
              var pillarString = '';
              if (pillar !== undefined && pillar !== ''){
                pillarString = '/' + pillar;
              }

              return srvURL + pillarString + '/' + _RDFPPVersion + '/invoke/';
            }
            if (typeof srvURL === 'undefined'){
              console.warn('*** Warning: Service not available: ' + service);
            }
            break;
          }
        }
        if (srvURL === null || (typeof srvURL === 'undefined')) {
          console.warn('*** Warning: Tenant or service not recognized by 3DCompass: ' + tenantId + '|' + service);
          // Workaround for OnPremise (E4A env.)
          for (var p in _3DExpPatformServices) {
            if (_3DExpPatformServices[p].platformId === 'OnPremise') {
              if (option) {
                srvURL = option;
                _3DExpPatformServices[p][service] = option;
              }
              else if (_hardcodedURL){
                srvURL = _hardcodedURL;
                _3DExpPatformServices[p][service] = _hardcodedURL;
              }
              // 3DSpace URL should be retrieved
              else if (service !== '3DSpace') {
                srvURL = _3DExpPatformServices[p]['3DSpace'];
                _3DExpPatformServices[p][service] = srvURL;
              }
              break;
            }
          }
        }
        if (typeof srvURL !== 'undefined' && !this.isRDFService(service)){
          srvURL = srvURL + '/resources/6WVocab/access/';
        }
        return srvURL;
      },

      isRDFService: function (service){
        var serviceSettings = _dicoSettings.Services[service];
        if (!serviceSettings){
          // service is not defined, by default all calls should be redirected to federated service (3DSpace)
          return false;
        }
        if (serviceSettings.persistency === 'RDF'){
          return true;
        }
        return false;
      },

      getServiceToSearchIn: function(services, options){
        // default value for any source
        var source = '3DSpace';
        if (!this.isRDFOnER(options)) {
          source = DicoSettings.CloudOntologyService;
        }
        var servicesSettings = _dicoSettings.Services;
        var service, serviceSettings, federatedSource;
        var allRDF = true, i;

        // nominal case
        if (services.length === 1){
          service = services[0];
          serviceSettings = servicesSettings[service];
          if (!serviceSettings || serviceSettings.federatedOn === 'FEDERATED_SERVICE'){
            // service is not defined, by default all calls should be redirected to federated service (3DSpace)
            return source;
          }
          federatedSource = serviceSettings.federatedOn;
          if (!federatedSource){
            // by default search in the same service
            if (serviceSettings.serviceName){
              return serviceSettings.serviceName;
            }
            return service;
          }
          // if set, search in federated source as defined in the settings.
          return federatedSource;
        }

        // strange case: need to retrieve 1 service to search in for a list of services
        for (i=0; i<service.length; i++){
          // at least one of the sources is the federated one (e.g. 3DSpace) --> search in default service
          federatedSource = servicesSettings[service].federatedOn;
          if (servicesSettings[service] && ( federatedSource === source || federatedSource === 'FEDERATED_SERVICE')){
            return source;
          }
          if (allRDF && !this.isRDFService(service[i])){
            allRDF = false;
          }
        }
        // if only RDF services --> pick the first one
        if (allRDF){
          return service[i];
        }
        // if heterogeous services --> search in default one
        else {
          return source;
        }
      },

      formatRDFResponse : function (arrayToFormat) {
        if (arrayToFormat.member){
          return arrayToFormat.member;
        }
        return arrayToFormat;
      },

      formatRDFInput : function(stringToFormat, toArray) {
        try {
          stringToFormat = JSON.parse(stringToFormat);
          if (toArray){
            return JSON.stringify([stringToFormat]);
          }
          return JSON.stringify(stringToFormat);
        }
        catch (e) {
          var inArray = stringToFormat.split(',');
          if (toArray){
            return JSON.stringify([inArray]);
          }
          return JSON.stringify(inArray);
        }
      },

      getLanguage : function(cbFuncs){
        var language = '';
        if (Core.is(cbFuncs.lang, 'string')){
          language = cbFuncs.lang;
        }
        else {
          language = widget.lang;
        }
        return language;
      },

      isPredicateWithFedValues: function(prop){
        var predicates = _dicoSettings.PredicatesWithFederatedValues;
        if (predicates.indexOf(prop) > -1){
          return true;
        }
        return false;
      },

      addServiceSettings: function(service, serviceSettings){
        _dicoSettings.Services[service] = serviceSettings;
      },

      addPropValuesToCache: function(storageName, properties, source){
        if (!window.sessionStorage){
          return;
        }
        var localValues = {};
        var allLocalValues = sessionStorage.getItem(storageName);

        if (!allLocalValues){
          allLocalValues = {};
        }
        else {
          allLocalValues = JSON.parse(allLocalValues);
          if (source){
            if (allLocalValues[source]){
              localValues = allLocalValues[source];
            }
          } else {
            localValues = JSON.parse(allLocalValues);
          }
        }
        localValues = this.mergePropValues(localValues, properties);
        var toCache = {};
        if (source){
          toCache[source]=localValues;
          // add caches of other sources
          for (var s in allLocalValues){
            if (s === source){
              continue;
            }
            toCache[s] = allLocalValues[s];
          }
        } else {
          toCache = localValues;
        }
        sessionStorage.setItem(storageName, JSON.stringify(toCache));
      },

      mergePropValues: function (toBeMergedTo, toMerge){
        if (toMerge && Object.keys(toMerge)){
          for (var propId in toMerge) {
            for (var v in toMerge[propId]) {
              if (!toBeMergedTo.hasOwnProperty(propId)){
                toBeMergedTo[propId] = toMerge[propId];
              }
              toBeMergedTo[propId][v] = toMerge[propId][v];
            }
          }
        }
        return toBeMergedTo;
      },

      /************************************************************
      *   Below are conversion functions for backward compatibility
      ************************************************************/
      /*
       * From
       * { "vocabularyElementNLSInfo":[
        { "uri":"ds6w:classification",
        "type":"Predicate",
        "nlsName":"Classification",
        "lang":"en",
        "dataType":"string"
        },
         ]
        }
       */
        convertToR420ElementsNls: function (data) {
          var retData = { vocabularyElementNLSInfo: null };
          if (data === null){
             return retData;
          }
          var elemInfoList = [], elemInfo;
          for (var i = 0; i < data.length; i++) {
            elemInfo = {
              uri: data[i].curi,
              type: data[i].metaType,
              nlsName: data[i].label
              //description: data[i].description
            };
            if (data[i].metaType === 'Property' || data[i].metaType === 'Predicate'){
              elemInfo.type = 'Predicate';
              elemInfo.dataType = data[i].dataType;
            }
            elemInfoList.push(elemInfo);
          }
          retData.vocabularyElementNLSInfo = elemInfoList;
          return retData;
        },
  
  
  



    };

    return dicoUtils;
  });

/*global sessionStorage Promise console*/

'use strict';

define('DS/SearchDictionaryAccess/SearchDictionaryAccess3DSpace',
  ['UWA/Core',
    'DS/SearchDictionaryAccess/SearchDicoUtils',
    'DS/SearchDictionaryAccess/SearchRequestUtils'],

  function (Core, DicoUtils, RequestUtils) {

    var dicoReadAPI = {

      defaultERService: '3DSpace',

      getElementsNLSNames: function (cbFuncs, iElements, has6WPredicates) {
        if (cbFuncs.RDFServiceURL && cbFuncs.RDFServiceURL.startsWith('ODTService@')){
          cbFuncs.tenantId = 'ODTService@' + cbFuncs.tenantId;
        }
        var webservice = 'TermsNls';
        if (has6WPredicates){
          webservice = 'ElementsNLSNames';
        }
        var ERService = this.defaultERService;
        if (cbFuncs.serviceName && !DicoUtils.isRDFService(cbFuncs.serviceName)){
          ERService = cbFuncs.serviceName;
        }
        return new Promise(function(resolve, reject){
          DicoUtils.getServiceBaseURLPromise(ERService, cbFuncs.tenantId).then(function(url){
            var fullURL = url + webservice + '?tenant=' + cbFuncs.tenantId;
            var headers = {};
            headers['Accept-Language'] = cbFuncs.lang;
            headers['Content-Type'] = 'text/plain';
            headers.Accept = 'application/json';

            var language = cbFuncs.lang;
            var storageName = DicoUtils.dicoElemsBaseKey + language;

            var localValues = sessionStorage.getItem(storageName);
            if (!localValues){
              localValues = {};
            }
            else {
              localValues = JSON.parse(localValues);
            }

            var result = [];
            RequestUtils.sendRequest(fullURL, {
              method: 'POST',
              headers: headers,
              timeout: 30000,
              data: iElements.toString(),
              onComplete: function (response) {
                try {
                  var responseParse = JSON.parse(response);
                  var i = 0, elt, termInfo;
                  for (; responseParse.vocabularyElementNLSInfo[i];) {
                    elt = responseParse.vocabularyElementNLSInfo[i];
                    // convert in new format
                    termInfo = {
                      curi: elt.uri,
                      label: elt.nlsName,
                      metaType: elt.type
                    };
                    if (elt.type === 'Predicate'){
                      termInfo.dataType = elt.dataType;
                    }
                    localValues[elt.uri] = termInfo;
                    // feed result based on new format
                    result.push(termInfo);
                    i++;
                  }
                  sessionStorage.setItem(storageName, JSON.stringify(localValues));
                  if (cbFuncs.apiVersion !== 'R2019x'){
                    result = DicoUtils.convertToR420ElementsNls(result);
                  }
                  resolve(result);
                }
                catch (e) {
                  //console.warn('*** Warning: server returned empty result ***');
                  resolve();
                }
              },
              onFailure: function (data) {
                reject(data);
              }
            });
        },
        function(errMessage){
          reject(errMessage);
        });
      });
      },


      getAttributesNlsValues: function (cbFuncs, iElements, has6WPredicates) {
        var ERService = this.defaultERService;
        if (cbFuncs.serviceName && !DicoUtils.isRDFService(cbFuncs.serviceName)){
          ERService = cbFuncs.serviceName;
        }
        return new Promise(function(resolve, reject){
          var language = 'en';
          var result = {};
          if (Core.is(cbFuncs.lang, 'string')){
            language = cbFuncs.lang;
          }

          var storageName = DicoUtils.dicoPropValuesBaseKey + language;
          if (cbFuncs.RDFServiceURL && cbFuncs.RDFServiceURL.startsWith('ODTService@')){
            cbFuncs.tenantId = 'ODTService@' + cbFuncs.tenantId;
          }

          DicoUtils.getServiceBaseURLPromise(ERService, cbFuncs.tenantId).then(function(url){
            var fullURL = '';

            if (has6WPredicates) {
              fullURL = url + 'PredicateValue?tenant=' + cbFuncs.tenantId;
            }
            else {
              fullURL = url + 'AttributeNlsValues?tenant=' + cbFuncs.tenantId;
            }
            var headers = {};
            headers['Accept-Language'] = language;
            headers['Content-Type'] = 'application/json';

            /*var localValues = sessionStorage.getItem(storageName);
            if (!localValues){
              localValues = {};
            }
            else {
              localValues = JSON.parse(localValues);
            }*/

            RequestUtils.sendRequest(fullURL, {
              method: 'POST',
              headers: headers,
              timeout: 30000,
              data: JSON.stringify(iElements),
              onComplete: function (response) {
                var jsResponse;
                try {
                  jsResponse = JSON.parse(response);
                  var respKeys = Object.keys(jsResponse);
                  var i = 0, uri;
                  for (i = 0; i < respKeys.length; i++) {
                    uri = respKeys[i];
                    /*if (localValues[uri]){
                      localValues[uri] = Object.assign(localValues[uri],jsResponse[uri]);
                    } else {
                      localValues[uri] = jsResponse[uri];
                    }*/
                    result[uri] = jsResponse[uri];
                  }
                  //sessionStorage.setItem(storageName, JSON.stringify(localValues));
                  DicoUtils.addPropValuesToCache(storageName, result, ERService); // add to cache
                  resolve(result);
                }
                catch (e) {
                  //console.warn('*** Warning: server returned empty result *** ' + e);
                  resolve(jsResponse);
                }
              },
              onFailure: function (data) {
                reject(data);
              }
            });
          },
          function(errMessage){
            reject(errMessage);
          });
        });
      }
    };


    return dicoReadAPI;
  });

/*global sessionStorage Promise console widget*/

'use strict';

define('DS/SearchDictionaryAccess/SearchDictionaryAccessRDF',
  ['UWA/Core',
    'DS/SearchDictionaryAccess/SearchDicoUtils',
    'DS/SearchDictionaryAccess/SearchRequestUtils'], 

  function (Core, DicoUtils, RequestUtils) {

    var dicoReadAPI = {

      // this code is meaningless. Because even if 6w goes to ontology service, code will have to change
      getResourcesInfo: function(iService, cbFuncs, iElements){
        return new Promise(function(resolve, reject){
          var rdfService = iService;
          if (cbFuncs.serviceName){
            rdfService = cbFuncs.serviceName;
          }
          DicoUtils.getServiceBaseURLPromise(rdfService, cbFuncs.tenantId, cbFuncs.RDFServiceURL, cbFuncs.RDFStorage).then(function(url){
            var fullURL = url +  'dsbase:getResourcesInfo?tenantId=' + cbFuncs.tenantId;
            var headers = {};
            headers.Accept = 'application/json';
            headers['Accept-Language'] = cbFuncs.lang;
            headers['Content-Type'] = 'application/json';
            headers['X-Requested-With'] = 'XMLHttpRequest';

            var language = 'en';
            if (Core.is(cbFuncs.lang, 'string')){
               language = cbFuncs.lang;
            }
            var storageName = DicoUtils.dicoElemsBaseKey + language;
            var localValues = sessionStorage.getItem(storageName);
            if (!localValues){
              localValues = {};
            }
            else {
              localValues = JSON.parse(localValues);
            }

            RequestUtils.sendRequest(fullURL, {
              method: 'POST',
              headers: headers,
              timeout: 40000,
              data: DicoUtils.formatRDFInput(iElements.toString(), true),
              onComplete: function (response) {
                try {
                  var jsResp = JSON.parse(response);
                  var result = jsResp['@result'].member;
                  var i = 0;
                  for (; result[i];) {
                    localValues[result[i].curi] = result[i];
                    i++;
                  }
                  i = 0;

                  sessionStorage.setItem(storageName, JSON.stringify(localValues));

                  if (cbFuncs.apiVersion !== 'R2019x'){
                    result = DicoUtils.convertToR420ElementsNls(result);
                  }

                  resolve(result);

                }
                catch (e) {
                  console.warn('*** Warning: server returned empty result ***');
                  resolve();
                }
              },
              onFailure: function (data) {
                reject(data);
              }
            }, DicoUtils.isWithoutAuth());
          },
          function(errMessage){
            reject(errMessage);
          });
        });
      },



      // This service is called to fetch values within RDF service
      getNlsOfPropertyValues: function (iService, cbFuncs, iElements) {
        return new Promise(function(resolve, reject){
          var language = 'en';
          if (Core.is(cbFuncs.lang, 'string')){
            language = cbFuncs.lang;
          }
          else if (widget){
            language = widget.lang;
          }

          var rdfService = iService;
          if (cbFuncs.serviceName){
            rdfService = cbFuncs.serviceName;
          }
          DicoUtils.getServiceBaseURLPromise(rdfService, cbFuncs.tenantId, cbFuncs.RDFServiceURL, cbFuncs.RDFStorage).then(function(url){
            var fullURL = url +  'dsbase:getNlsOfPropertyValues?tenantId=' + cbFuncs.tenantId;
            var headers = {};
            headers.Accept = 'application/json';
            headers['Content-Type'] = 'application/json';
            headers['Accept-Language'] = language;
            headers['X-Requested-With'] = 'XMLHttpRequest';

            var input = JSON.stringify(iElements);
            RequestUtils.sendRequest(fullURL,
            {
              method: 'POST',
              headers: headers,
              timeout: 30000,
              data: JSON.stringify([input]),
              onComplete: function (response) {
                var jsRes;
                try {
                  jsRes = JSON.parse(response);
                }
                catch (e){
                  console.warn('*** Warning: server returned empty result ***');
                  return resolve();
                }
                var result = jsRes['@result'];
                if (window.sessionStorage){
                  var storageName = DicoUtils.dicoPropValuesBaseKey + DicoUtils.getLanguage(cbFuncs);
                  DicoUtils.addPropValuesToCache(storageName, result, iService); // add to cache
                }
                return resolve(result);
              },
              onFailure: function (data) {
                return reject(data);
              }
            }, DicoUtils.isWithoutAuth());
          },
          function(errMessage){
            reject(errMessage);
          });
        });
      }
    };
    return dicoReadAPI;

});

/**
 * @overview Provide services for applications to translate 6W properties and values retrieved from federated search
 * @file SearchDictionaryAccessAPI.js provides 2 functions: get6wResourcesInfo & getNlsOfSearchValuesBySource
 * @licence Copyright 2017 Dassault Systemes company. All rights reserved.
 * @version 1.0.
 */

/*global widget, window, sessionStorage, Promise*/
/*jslint plusplus: true*/
'use strict';

define('DS/SearchDictionaryAccess/SearchDictionaryAccessAPI',
  ['UWA/Core',
    'UWA/Class/Promise',
    'DS/SearchDictionaryAccess/SearchDicoUtils',
    'DS/SearchDictionaryAccess/SearchDictionaryAccess3DSpace',
    'DS/SearchDictionaryAccess/SearchDictionaryAccessRDF'],

  /**
   * <p>
   * This module aims at providing APIs for user experience of apps, to translate 6W properties and values
   * <p>
   * The exposed APIs return their output asynchronously as data may
   * require a back-end request to be retrieved.
   * </p>
   *
   */
  function (Core, UWAPromise, DicoUtils, SearchDictionaryAccess3DSpace, SearchDictionaryAccessRDF) {

    var _OntoService = DicoUtils.initSrvRequest();

    var retrievePropValuesFromCache = function (source, propValsElems, cbFuncs) {
      // NLS are now cached by source
      var jsPropValues = propValsElems;

      if (typeof propValsElems === 'string' || propValsElems instanceof String){
        // parse to json only if needed
        jsPropValues = JSON.parse(propValsElems);
      }

      var to_dwnld = {}, propValsCached = {}, cacheMissVals = [];
      var propId, propVals, vals = [];
      if (!jsPropValues){
        return;
      }

      //SGA5: if error, still return array of 2
      if (!window.sessionStorage) {
        cacheMissVals[0] = {};
        cacheMissVals[1] = jsPropValues;
        return cacheMissVals;
      }

      //SGA5: if error, still return array of 2
      if (!Core.is(cbFuncs, 'object')) {
        cacheMissVals[0] = {};
        cacheMissVals[1] = jsPropValues;
        return cacheMissVals;
      }

      var language = DicoUtils.getLanguage(cbFuncs);

      var storageName = DicoUtils.dicoPropValuesBaseKey + language;

      var localValues = sessionStorage.getItem(storageName);
      //SGA5: if no NLS found, still return array of 2
      try {
        if (!localValues || !JSON.parse(localValues)[source]) {
          cacheMissVals[0] = {};
          cacheMissVals[1] = jsPropValues;
          return cacheMissVals;
        } else {
          localValues = JSON.parse(localValues)[source];
        }
      } catch (e){ // issue when parsing to JSON
        cacheMissVals[0] = {};
        cacheMissVals[1] = jsPropValues;
        return cacheMissVals;
      }

      var propIds = Object.keys(jsPropValues);

      for (var i = 0; i < propIds.length; i++) {
        vals = [];
        propId = propIds[i];
        // console.log("*** retrieve propId.: " + propId);
        propVals = localValues[propId];
        if (!propVals) {
          /*
           * console.log(" > Property not retrieved from cache, hence need to call WS: " + propId);
           */
          to_dwnld[propId] = jsPropValues[propId];
        } else {
          // console.log(" > Property found in cache: " + propId);
          var searchedVals = jsPropValues[propId];
          var nbSearchedVals = searchedVals.length;
          var objVals = {};
          for (var j = 0; j < nbSearchedVals; j++) {
            var v = searchedVals[j];
            // console.log("looking for value: " + v);
            if (propVals[v]) {
              // console.log(" > Found local value: " + nlsV);
              objVals[v] = propVals[v];
            } else {
              // console.log(" > Value not found in cache: " + v + " adding it to to_dwnld");
              vals.push(searchedVals[j]);
            }
          }
          if (Object.keys(objVals).length > 0){
            propValsCached[propId] = objVals;
          }
          if (vals.length) {
            to_dwnld[propId] = vals;
          }
        }
      }
      cacheMissVals[0] = propValsCached;
      cacheMissVals[1] = to_dwnld;
      return cacheMissVals;
    };

    var needsToBeTranslated = function(iPropUri, iPropValue){
      var predicatesEnum = ['ds6w:what', 'ds6w:when', 'ds6w:who', 'ds6w:where', 'ds6w:why', 'ds6w:how',
      'ds6w:originator', 'ds6w:responsible', 'ds6w:lastModifiedBy', 'ds6w:reservedBy', 'ds6w:assignee', 'ds6w:docExtension',
      'ds6w:before', 'ds6w:starts', 'ds6w:actualStart', 'ds6w:plannedStart',
      'ds6w:created', 'ds6w:modified', 'ds6w:ends', 'ds6w:actualEnd',
      'ds6w:plannedEnd', 'ds6w:dueDate', 'ds6w:estimatedCompletionDate', 'ds6w:history',
      'ds6w:publishedDate', 'ds6w:sent', 'ds6w:received', 'ds6w:targetLaunchDate',
      'ds6w:laborRate',   'ds6w:distance',   'ds6w:surface',
      'ds6w:declaredSurface', 'ds6w:diameter', 'ds6w:radius', 'ds6w:length',
      'ds6w:height',   'ds6w:width',   'ds6w:thickness', 'ds6w:volume',
      'ds6w:declaredVolume', 'ds6w:min', 'ds6w:max', 'ds6w:typical',
      'ds6w:weight', 'ds6w:declaredWeight', 'ds6w:lasts', 'ds6w:estimatedDuration',
      'ds6w:actualDuration', 'ds6w:fulfillsQuantity'];

      if (predicatesEnum.indexOf(iPropUri)>-1 || iPropUri.indexOf('cost')> -1 /*|| iPropUri.indexOf('ds6wg:')> -1*/){
        return false;
      }

      // date values should be ignored. E.g. "2021-02-16T06:20:24Z"
      var regExp  = new RegExp('^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$');
      if (regExp.test(iPropValue)){
        // is a date
        return false;
      }

      return true;
    };

    /**
     * @exports DS/SearchDictionaryAccess/SearchDictionaryAccessAPI Module
     *          for dictionary read API. This file is to be used by
     *          App's which need to access dictionary information
     *          from any data-source.
     *
     */
    var dicoReadAPI = {

      /**
       * Sets myApps config object that contains myAppsBaseUrl, userId and lang
       * Required for use cases where the compass is not initiated: in web pop-ups and in web-in-win
       * @param {object} config - JSON Object containing:
       *                           myAppsBaseUrl: myApps url that can be retrieved from myAppsURL global variable in web (if compass is initiated)
       *                                          or dscef.getMyAppsURL() in web-in-win
       *                           userId: connected user's Id
       *                           lang: connected user's language
       *
       */
      setConfigForMyApps: function(config) {
        DicoUtils.setMyAppsConfig(config);
      },

      /**
       * For custom services add its MyApps-format name to redirect web service calls to this service
       * This service will need to expose same endpoints for web services as 3DSpace
       * @param {string} service - service name as returned by federated search
       * @param {object} serviceSettings - JSON of with service settings:
       *                                   serviceSettings.persistency: type of persistency: "RDF", "ER", other
       *                                   serviceSettings.serviceName: service name in MyApps format
       *                                   [serviceSettings.federatedOn]: optionnal. Service on which all the information should be searched: service name in MyApps format or FEDERATED_SERVICE
       */
      addServiceSettings: function(service, serviceSettings) {
        if (!service || !serviceSettings || !serviceSettings.persistency || !serviceSettings.serviceName){
          console.error('addServiceSettings: wrong or missing parameters.');
          return;
        }
        DicoUtils.addServiceSettings(service, serviceSettings);
      },

      /**
       * Function Get6wResourcesInfo To get the NLS translation of a set of vocabularies elements
       *
       * @param {string} elemNames: URI's of required elements, separated by a comma.
       * @param  {object} cbFuncs: - JSON Object containing:
       *                           onComplete: function called on complete. The result of the query is passed as a parameter.
       *                           onFailure: function called on failure. The error message is passed as a parameter.
       *                           apiVersion: format of the output. Supported formats: R2019x, R2018x
       *                           lang: user's language
       *                           serviceName: [optional] RDF service name if the default behavior needs to be overriden.
       *                                To be used by apps that want force the redirection to a specific RDF service.
       *                           RDFStorage: [optional] RDF pilar if the default behavior needs to be overriden.
       *
       */
      get6wResourcesInfo: function (elemNames, cbFuncs) {
        if (!elemNames || !cbFuncs){
          cbFuncs.onFailure('get6wResourcesInfo: missing input');
          return;
        }

        var language = '';
        if (Core.is(cbFuncs.lang, 'string') && cbFuncs.lang.length > 0){
          language = cbFuncs.lang;
        }
        else {
          language = widget.lang;
        }

        var storageName = DicoUtils.dicoElemsBaseKey + language;
        var localValues = sessionStorage.getItem(storageName);
        if (!localValues){
          localValues = {};
        }
        else {
          localValues = JSON.parse(localValues);
        }

        var reqElts = elemNames.split(',');
        var missingVals = [];
        var locRes = [];
        // get local values that are jsReqElems, if any
        var uri, i;
        if (localValues && Object.keys(localValues).length > 0) {
          for (i = 0; i < reqElts.length; i++) {
            uri = reqElts[i];
            if (localValues[uri]){
              locRes.push(localValues[uri]);
            }
            else {
              missingVals.push(uri);
            }
          }
        }
        else {
          missingVals = reqElts;
          sessionStorage.setItem(storageName, '');
        }

        if (missingVals.length > 0) {
          var result;
          if (cbFuncs.apiVersion === 'R2019x') {
            result = [];
            if (locRes.length > 0){
              result = locRes;
            }
          }
          else {
            result = {vocabularyElementNLSInfo: []};
            if (locRes.length > 0){
              result = DicoUtils.convertToR420ElementsNls(locRes);
            }
          }
          // now, load missing elements from data-sources
          if (DicoUtils.isRDFOnER(cbFuncs)) {
            // load all from 3DSpace because 6W are stored in 3DSpace
            SearchDictionaryAccess3DSpace.getElementsNLSNames(cbFuncs, missingVals, true).then(function(data){
              if (cbFuncs.apiVersion === 'R2019x') {
                result = result.concat(data);
              }
              else if (data.vocabularyElementNLSInfo){
                result.vocabularyElementNLSInfo = result.vocabularyElementNLSInfo.concat(data.vocabularyElementNLSInfo);
              }
              cbFuncs.onComplete(result);
            }).catch(function(data){
              if (cbFuncs.onFailure) {
                cbFuncs.onFailure(result);
              }
            });
          }
          else {
            // doesn't happen right now: which means that this code is useless
            //var cspaceElems = [], rdfElems = [];
            var rdfElems = [];
            var promises = [];
            for (i = 0; i < missingVals.length; i++) {
              uri = missingVals[i];
              // In any case, we should nit care about ds6wg
              //if (uri.startsWith('ds6wg:')) {
              //  cspaceElems.push(uri);
              //}
              //else {
                rdfElems.push(uri);
              //}
            }
            if (rdfElems.length > 0) {
              // Call WS for RDF elements
              promises.push(SearchDictionaryAccessRDF.getResourcesInfo(_OntoService, cbFuncs, rdfElems));
            }
          //  if (cspaceElems.length > 0) {
              // Call WS for 3DSpace elements
            //  promises.push(SearchDictionaryAccess3DSpace.getElementsNLSNames(cbFuncs, cspaceElems));
            //}
            // wait till both calls are finished
            Promise.all(promises).then(function(data){
              data.forEach(function(element){
                if (cbFuncs.apiVersion === 'R2019x') {
                  result = result.concat(element);
                }
                else if (element.vocabularyElementNLSInfo){
                  result.vocabularyElementNLSInfo = result.vocabularyElementNLSInfo.concat(element.vocabularyElementNLSInfo);
                }
              });
              cbFuncs.onComplete(result);
            }).catch(function(data){
              if (cbFuncs.onFailure){
                cbFuncs.onFailure(result);
              }
            });
          }
        } else {
          if (cbFuncs.apiVersion !== 'R2019x'){
            locRes = DicoUtils.convertToR420ElementsNls(locRes);
          }
          cbFuncs.onComplete(locRes);
        }
      },


      /**
       * Function getNlsOfSearchValuesBySource To get the NLS translation of a list of property values retrieved from different data sources
       *
       * @param {object} propValsElems - JSON object with keys as property URI and value as array of objects containing a data source and a value to translate.
       *                                 Data source should be a valid data source in a format recognized by MyApps.
       * @param {object} cbFuncs - JSON Object containing:
       *                           onComplete: function called on complete. The result of the query is passed as a parameter.
       *                           onFailure: function called on failure. The error message is passed as a parameter.
       *                           apiVersion: format of the output. Supported formats: R2019x, R2018x
       *                           lang: user's language
       *                           RDFStorage: [optional] RDF pilar if the default behavior needs to be overriden.
       */
      getNlsOfSearchValuesBySource: function (propValsElems, cbFuncs){
        // example of the call:
        // { "ds6w:jobStatus": [{value: "swym_media_non_processed", source: ["3DSwym"]}],
        //   "ds6w:type": [{value: "VPMReference", source: ["3DSpace"]}, {value: "foaf:Group", source: ["usersgroup"]}]
        //}

        if (!Core.is(cbFuncs, 'object') || !Core.is(cbFuncs.onComplete, 'function')){
          return;
        }
        if (!propValsElems) {
          cbFuncs.onFailure('getNlsOfSearchValuesBySource: no propValsElems');
          return;
        }

        var prop, val, val_source, sources, source;
        var callsPerSource = {}, service, promises = [];
        var result = {};

        // e.g. {"3DSpace": {"ds6w:type": ["VPMReference", "Part"]}
        for (prop in propValsElems){ // e.g. prop = "ds6w:type"
          for (var i=0; i<propValsElems[prop].length; i++){
            val_source = propValsElems[prop][i]; // e.g. val_source = {value: "foaf:Group", source: ["usersgroup"]}
            val = val_source.value; // e.g. val = "foaf:Group"
            sources = val_source.source; // e.g. sources = ["usersgroup"]

            // for predicates with federated values, always search in Service that stores 6W predicates (3DSpace)
            if (DicoUtils.isPredicateWithFedValues(prop)){
              if (DicoUtils.isRDFOnER(cbFuncs)) {
                source = '3DSpace';
              }
              else {
                source = _OntoService;
              }
            } else {
              // source count should normally be 1 as the values are not federated
              source = DicoUtils.getServiceToSearchIn(sources, cbFuncs);
            }

            if (!callsPerSource[source]) {
              callsPerSource[source] = {};
            }
            if (!callsPerSource[source][prop]){
              callsPerSource[source][prop] = [];
            }
            callsPerSource[source][prop].push(val);
          }
        }

        for (service in callsPerSource){
          var propValsPerSource = callsPerSource[service];

          // first get values from cache per source
          var cacheMissValues = retrievePropValuesFromCache(service, propValsPerSource, cbFuncs);
          if (cacheMissValues && cacheMissValues.length === 2) {
            var cachedValues = cacheMissValues[0];
            var missingValues = cacheMissValues[1];
            var valuesWithoutNLS = {}; // get some predicates and values as-is

            // then check is all properties values need to be translated
            for (var p in missingValues){
              for (i=0; i<missingValues[p].length; i++){
                var v = missingValues[p][i];
                if (!needsToBeTranslated(p, v)){
                  if (!valuesWithoutNLS[p]){
                    valuesWithoutNLS[p]={};
                  }
                  valuesWithoutNLS[p][v] = v;
                  if (missingValues[p]){
                    delete missingValues[p][i];
                  }
                }
              }
              var countNull = 0;
              for (var j=0; j<missingValues[p].length; j++){
                if (missingValues[p][j] === undefined || missingValues[p][j] === null){
                  countNull ++;
                }
              }
              if (countNull === missingValues[p].length){
                delete missingValues[p];
              }
            }
            var cachedResult = Object.assign(cachedValues, valuesWithoutNLS);

            // add to result
            result = DicoUtils.mergePropValues(result, cachedResult);

            // nothing's missing
            if (Object.keys(missingValues).length === 0) {
              continue;
            }
            // for RDF data sources
            if (DicoUtils.isRDFService(service)){
              promises.push(SearchDictionaryAccessRDF.getNlsOfPropertyValues(service, cbFuncs, missingValues));
            }
            // for E/R data source (3DSpace)
            else {
              var cbFuncsPerService = Object.assign({}, cbFuncs);
              cbFuncsPerService.serviceName = service;
              promises.push(SearchDictionaryAccess3DSpace.getAttributesNlsValues(cbFuncsPerService, missingValues, true));
            }
          }
        }

        if (promises.length>0){
          var isFullfilled = false;

          // wait till all calls are finished
          UWAPromise.allSettled(promises).then(function(data){
            for (var k =0; k<data.length; k++){
              var element = data[k];
              if (element === undefined || element === null){
                continue;
              }
              var status = element.state;
              if (status === 'fullfilled'){
                isFullfilled = true;
                var values = element.value;
                result = DicoUtils.mergePropValues(result, values);

                /*if (values && Object.keys(values)){
                  for (var propId in values) {
                    for (var v in values[propId]) {
                      if (!result.hasOwnProperty(propId)){
                        result[propId] = values[propId];
                      }
                      result[propId][v] = values[propId][v];
                    }
                  }
                } */
              }
            }

            if (isFullfilled === true){
              cbFuncs.onComplete(result);
            } else {
              if (cbFuncs.onFailure){
                cbFuncs.onFailure('getNlsOfSearchValuesBySource: Calls to all sources failed');
              }
            }

          }).catch(function(data){
            if (cbFuncs.onFailure){
              cbFuncs.onFailure(data);
            }
          });
        }
        else {
          // nothing should be retrieved from services: values are cached or/and non-translatable
          cbFuncs.onComplete(result);
        }
      }
    };

    return dicoReadAPI;
  });

