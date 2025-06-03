define('DS/ENOSpecMultiGrid/attributes/controller/MultiGridAddExtensions',
[
    'UWA/Controls/Abstract',
    'UWA/Core',
    'DS/UIKIT/SuperModal',
    'DS/UIKIT/Autocomplete',
    'DS/UIKIT/Accordion',
    'DS/UIKIT/Form',
	'DS/ENOSpecMultiGrid/attributes/services/MultiGridAttrServiceProvider',
    'DS/UIKIT/Input/Button',
    'DS/XSRCommonComponents/utils/RequestUtil',
    'DS/UIKIT/Scroller',
    'DS/XSRCommonComponents/utils/Notification',
	'i18n!DS/ENOSpecMultiGrid/assets/nls/MultiGridAttribute',
    'i18n!DS/UIKIT/assets/nls/UIKIT'
],

function (Abstract, UWA, SuperModal, Autocomplete, Accordion, Form, AttrServiceProvider, Button,RequestUtil, Scroller,Notification, AddExtNls, i18nUIKIT) {
    'use strict';

    var langCode = "en";

    var setInterfaces = function (payload) {
        this.interfaces = [];
        if(payload !== null) {
            var results = payload["results"];
            if(results.length===1) {
                this.interfaces = results[0]["interfaces"];
            }
            else {
                var temp = results[0]["interfaces"];
                for(var j = 1; j < results.length; j++) {
                    temp = crossInterfaces(temp, results[j]["interfaces"]);
                }
                this.interfaces = temp;
            }
            if(this.allAttachedInterfaces) {
                var i = 0;
                while (i < this.interfaces.length) {
                    for (var j = 0; j < this.allAttachedInterfaces.length; j++) {
                        if(this.allAttachedInterfaces[j]['name']===this.interfaces[i]['name']){
                            this.interfaces.splice(i,1);
                            i--;
                            break;
                        }
                    }
                    i++;
                }
            }
        }
        return this.interfaces;
    };

    var setAttachedInterfaces = function (payload) {
        this.attachedInterfaces = [];
        if(payload !== null) {
            var results = payload["results"];
            if(results.length===1) {
                this.attachedInterfaces = results[0]["interfaces"];
            }
            else {
                var temp = results[0]["interfaces"];
                for(var j = 1; j < results.length; j++) {
                    temp = crossInterfaces(temp, results[j]["interfaces"]);
                }
                this.attachedInterfaces = temp
            }
        }
        return this.attachedInterfaces;
    };

    var setAllAttachedInterfaces = function (payload) {
        this.allAttachedInterfaces = [];
        if(payload !== null) {
            var results = payload["results"];
            if(results.length==1) {
                this.allAttachedInterfaces = results[0]['interfaces'];
            }
            else
            {
                var results = payload["results"];
                for (var i = 0; i < results.length; i++) {
                    var interfaces = results[i]["interfaces"];
                    for(var j = 0; j < interfaces.length; j++) {
                        this.allAttachedInterfaces.push(interfaces[j])
                    }
                }
            }
        }
        return this.allAttachedInterfaces;
    };

    var crossInterfaces = function (list1, list2) {
        var sharedInterfaces = []
        for (var i = 0; i < list1.length; i++) {
            var extension = list1[i]["name"];
            for(var j = 0; j < list2.length; j++) {
                if(extension === list2[j]["name"]) {
                    sharedInterfaces.push(list1[i]);
                    continue;
                }
            }
        }
        return sharedInterfaces;
    };

    var buildUI = function () {
        this._buildUI();
    };

    var myWidget = Abstract.extend({
        context: null,
        onError : function (errorResp) {			
			Notification.displayNotification({
					eventID: 'error',
					msg: (errorResp&& errorResp.message) ||  AddExtNls.Error_Message_LoadingAddExt
				});
		},
        init: function (options,onSuccess,onClose, onFailure) {
            console.log("init"); 
            var context=this;
            langCode = RequestUtil.getLanguage();
            context._parent(options);  
            context.service=new AttrServiceProvider({isChangeControlled : true});
            this.itemId=options.itemId;
            this.itemType=options.itemType;
          
            this.setInterfaces = setInterfaces.bind(this);
            this.setAttachedInterfaces = setAttachedInterfaces.bind(this);
            this.setAllAttachedInterfaces = setAllAttachedInterfaces.bind(this);
            this.buildUI = buildUI.bind(this);

            context.service.getObjectInterfaces([context.itemId]).then(function(response){	
            	 context.attachedInterfaces = context.setAttachedInterfaces(response);
            	 context.allAttachedInterfaces = context.setAllAttachedInterfaces(response);
            	 context.service.getApplicableExtensions([context.itemType]).then(function(resp){
            		 context.interfaces = context.setInterfaces(resp);
            		 context.buildUI();
                     console.log("init:onComplete");
                     context.showDialog(widget,onSuccess,onClose, onFailure);
            	 }).catch(function(error){
            		 onFailure(error);				
      		    });		
			}).catch(function(error){
				var message = AddExtNls['failMessage'] + error.message;
                if (error.data && typeof error.data === 'object' && error.data.error && error.data.error.code==="1002")
                {
                    var myModal = new SuperModal({
                        closable: true,
                        className: 'Modals',
                        events: {
                            onHide: function () {
                                onClose();
                            }
                        }
                    });
                    myModal.alert(AddExtNls.roleNotAllowed);
                }
                else {
                    onFailure(message);
                }			
		   });
            this.context=options.context;	
        },
   
                
        showDialog: function (parent,onSuccess,onClose, onFailure) {
            console.log("MultiGridAddExtensions:showDialog");
            var mySuperModal = new SuperModal({
                closable: true,
                className: 'Modals',
                events: {
                    onHide: function () {
                        onClose();
                    }
                }
            });
            var context=this;
            var ok = AddExtNls['ok'];
            var cancel = AddExtNls['cancel'];
            //var dlgTitle = this.elements.myObject.getComputedTitle();
            var container = this.elements.myContainer;
            mySuperModal.dialog({
                body: container,
                title: AddExtNls['title'],//dlgTitle,                    
                buttons: [
                    {
                        className: 'primary',
                        value: ok,
                        action: function (modal) {
                            var autoComplete = this.autoComplete;
                            var selected = autoComplete.getSelection();
                            var attForm = this.attributesForm;
                            var payload = {},
                            myInterf = {},
                            payload2 = {},
                            values = {};
                            for(var k in attForm) {
                                var form = attForm[k];
                                var changedValues = form.getChangedValues();
                                for(var y in changedValues) {
                                    var valueDB = form.get(y).get("valueDB");
                                    if(form.get(y).get("type")=="boolean")
                                        valueDB = String(valueDB);
                                    values[y] = valueDB;
                                }
                                myInterf[k] = values;
                            }
                            payload['interfaces'] = myInterf;
                            payload['phyIDS'] =[this.itemId];

							 if(selected.length>0) {
								   this.service.addExtensions(payload).then(function(response){	
									 modal.hide();
									 onSuccess(context.itemId);
					            	 }).catch(function(error){
					            		 modal.hide();
					            		 onFailure(error);			
					      		    });	
                                }                              
                           }.bind(this)
                    
                    },
                    {
                        value: cancel,
                        action: function (modal) {
                            modal.hide();
                            onClose();
                        }
                    }
                ]
            });

            if (mySuperModal && mySuperModal.modals && mySuperModal.modals.current
                      && mySuperModal.modals.current.elements) {

                var closeButton = (mySuperModal.modals.current.elements.header) ? mySuperModal.modals.current.elements.header.getElement(".close.fonticon.fonticon-cancel") : null;

                if (closeButton) {
                    closeButton.setText("\u00D7");
                    closeButton.removeClassName("fonticon");
                    closeButton.removeClassName("fonticon-cancel");

                    closeButton.setAttributes({
                        title: i18nUIKIT.close
                    });
                }

                if (mySuperModal.modals.current.elements.closeTooltip && mySuperModal.modals.current.elements.closeTooltip.elements) {
                    mySuperModal.modals.current.elements.closeTooltip.elements.container.addClassName('hideDefaultTooltip');
                }
            }

            this.mySuperModal = mySuperModal;
            var autoCInput = document.getElementsByName("autoCompleteExtensions");
            autoCInput[0].focus();
        },

        _buildUI: function () {
            console.log('buildUI');
            var that = this;
            var Extensions = [];
            var interfaces = this.interfaces;
            var extensionMap = this.attachedInterfaces;
            var allAttachedInterfaces = this.allAttachedInterfaces;
            this.extensionsToDelete = [];

            var container = UWA.createElement('div', {
                styles: {
                    position: 'relative',
                    //height: '300px',
                    //width: '400px',
                    overflow: 'visible'
                }
            });

            //=============================================
            //--Div content table
            //============================================

            var attachedExtDiv = UWA.createElement('div', {
                'id': 'attachedExtDiv'
            });

            var tableDiv = UWA.createElement('div', {
                'id': 'tableDiv',
                styles: {
                    //width: '100%',
                    height: '110px',
                    //overflow: 'auto'
                }
            });

            var tableExtensions = UWA.createElement('table', {
                'class': 'table table-hover',    
                //'id': 'extensions-table',
                'width': '100%'
            }).inject(tableDiv);

            var tbody = UWA.createElement('tbody').inject(tableExtensions);
            var i=0;

            for (var i = 0; i < extensionMap.length; i++) {
                var row = UWA.createElement('tr').inject(tbody);
                var ext = extensionMap[i];
                var p = UWA.createElement('p', {
                    title: ext['name'],
                    text: ext['nameNLS']
                });
                p.inject(UWA.createElement('td', {'align':'left','width':'80%'}).inject(row));
                /*var span = UWA.createElement("span",{styles:{"cursor": "pointer;"},id:ext['name'],title:AddExtNls.get("removeExt")});
                span.className = 'fonticon fonticon-2x fonticon-exchange-delete';
                span.inject(UWA.createElement('td', {'align':'center','width':'20%'}).inject(row));
                span.onclick = function(currElmt){
                    var currSpan = currElmt.target;
                    that.changeClass(currSpan,that.extensionsToDelete)
                };*/
            }

            var myScroller = new Scroller({
                element: tableDiv
            }).inject(attachedExtDiv);
            this.elements.myScroller = myScroller;

            //==========================================
            //--Div content autoComplete
            //==========================================

            var autoCompDiv = UWA.createElement('div', {
                'id': 'autoComplete',
                styles: {
                    //width: '100%',
                    //height: '200px',
                    overflow: 'visible'
                }
            }).inject(container);

            this.interfaces.forEach(function(iInput) {
                Extensions.push({value : iInput['name'], label : iInput['nlsName'], subLabel : iInput['name'], name : iInput['name']});
            });

            var DataSet = {
                'name' : 'extensions',
                'items' : Extensions
            };
            var autoCompleteInput = new Autocomplete({
                //'id': 'my-autoComplete',
                'name': 'autoCompleteExtensions',
                showSuggestsOnFocus: true,
                multiSelect: true,
                placeholder: AddExtNls['autoCompPlaceHolder'],
                'autofocus': 'autofocus',
                events: {
                    onSelect: function(item,poistion) {
                        that.updateAttUI(item,true);
                    },
                    onUnselect: function(item, position, newPosition) {
                        that.updateAttUI(item,false);
                    }
                },
                //autofocus = 'autofocus',
                style: {
                    'width': '100%',
                    overflow: 'visible'
                }//,'width': '100%'
            }).inject(autoCompDiv);

            autoCompleteInput.addDataset(DataSet);
            //========================================
            //--Accordion
            //========================================

            var iAccord = new Accordion({
                    className: 'divided',
                    exclusive: false,
                    items : []
                }).inject(container);
            this.elements.accordion = iAccord;


            var accordionContent = new Accordion({
                className: 'filled',
                exclusive: false,
                items : [{
                    title:AddExtNls.attachedExtension,
                    content: myScroller,
                    name:'atExt'
                }]
            }).inject(container);
            
            var items = autoCompleteInput.getItems();
            var item1 = items[0];
            var item2 = items[1];
            var sug = autoCompleteInput.currentSuggestions;
            var datasets = autoCompleteInput.datasets;
            this.autoComplete = autoCompleteInput;
            this.elements.tableExtensions = tableExtensions;
            this.elements.myContainer = container;
            return container;
        },

        convertDateToStandard: function(date, fromField){
            if (!date) return {
                value: "",
                valueDB: ""
            };
            // Local time is set to 12 pm in order to minimize date change according to local time
            //Finally we take the current time to have the same day than the one chosen by the user

            var currentDate = fromField ? date : new Date();
            
            var Year = date.getUTCFullYear();
            var Month = date.getUTCMonth()+1;
            var Day = date.getUTCDate();
            var Hour = currentDate.getUTCHours();
            var Min = currentDate.getUTCMinutes();
            var Sec = currentDate.getUTCSeconds();
            
            
             /*if (this.isReplayedODT()){
                Hour = 12;
                Min = 0;
                Sec = 0;
                currentDate.setHours(Hour);
                currentDate.setMinutes(Min);
                currentDate.setSeconds(Sec);
            }*/
            
            // value stored in GMT
            if (Month < 10) Month = "0"+Month;
            if (Day < 10) Day = "0"+Day;
            if (Hour < 10) Hour = "0"+Hour;
            if (Min < 10) Min = "0"+Min;
            if (Sec < 10) Sec = "0"+Sec;
            
            currentDate.setYear(Year);
            currentDate.setMonth(date.getMonth());
            currentDate.setDate(Day);                           

            return {
                value: currentDate.toLocaleString(langCode),
                valueDB: Year+"/"+Month+"/"+Day+"@"+Hour+":"+Min+":"+Sec+":GMT"
            }
        },

        updateAttUI: function(item,newAtt) {
            var accordion = this.elements.accordion;
            var interfaces = this.interfaces;
            var that = this;
            //var attTitle = this.elements.attTitle;
            var attributes = [];
            var fromFields = [];
            /*if(!this.attributesForm)
                this.attributesForm = [];*/
            if(!this.attributesForm)
                this.attributesForm = {};
            var attributesForm = this.attributesForm;
            var interfaceName = item['name'];
            var path1 = 'DS/EditPropWidget/facets/Properties/Properties',
            path2 = 'DS/EditPropWidget/models/EditPropAttributeModel',
            path3 = 'DS/EditPropWidget/models/EditPropModel';

            if(newAtt) {
                interfaces.forEach(function(inter) {
                    if(inter['name'] === item['name']) {
                        attributes = inter['attributes'];
                        require([path1,path2,path3],function(PropertiesUI,EditPropAttributeModel,EditPropModel) {
                            var optionsUI = {};
                            optionsUI['editMode']=true;
                            optionsUI['setCloseButton']=false;
                            optionsUI['scroller']=false;
                            var editMode=true;
                            var propUI = new PropertiesUI(optionsUI);
                            var toSet = {};
                            var attr;
                            attributes.forEach(function(attribute) {
                                if(attribute['Primitive']==='Date') {
                                    var milliseconds = attribute['default'];
                                    var defaultDate = new Date(milliseconds*1000);
                                    var computedDate = that.convertDateToStandard(defaultDate,true);
                                    attr = new EditPropAttributeModel({
                                        path: attribute['name'],
                                        label: attribute['nlsName'],
                                        //value: attribute['default'],
                                        valueDB: computedDate.valueDB,
                                        name: attribute['name'],
                                        type: 'timestamp',
                                        readOnly: false
                                    });
                                    toSet[attr.getIdentifier()] = attr;
                                }
                                else if(attribute['Primitive']==='Double') {
                                    attr = new EditPropAttributeModel({
                                        path: attribute['name'],
                                        label: attribute['nlsName'],
                                        //value: attribute['default'],
                                        valueDB: attribute['default'],
                                        name: attribute['name'],
                                        type: 'real',
                                        dimension: attribute['Dimension'],
                                        readOnly: false
                                    });
                                    toSet[attr.getIdentifier()] = attr;
                                }
                                else if(attribute['Primitive'] === 'Integer') {
                                    attr = new EditPropAttributeModel({
                                        path: attribute['name'],
                                        label: attribute['nlsName'],
                                        //value: attribute['default'],
                                        valueDB: attribute['default'],
                                        name: attribute['name'],
                                        type: 'integer',
                                        readOnly: false
                                    });
                                    toSet[attr.getIdentifier()] = attr;
                                }
                                else if(attribute['Primitive'] === 'Boolean') {
                                    attr = new EditPropAttributeModel({
                                        path: attribute['name'],
                                        label: attribute['nlsName'],
                                        //value: attribute['default'],
                                        valueDB: attribute['default'],
                                        name: attribute['name'],
                                        type: 'boolean',
                                        readOnly: false
                                    });
                                    toSet[attr.getIdentifier()] = attr;
                                }
                                else {
                                    attr = new EditPropAttributeModel({
                                        path: attribute['name'],
                                        label: attribute['nlsName'],
                                        //value: attribute['default'],
                                        valueDB: attribute['default'],
                                        name: attribute['name'],
                                        readOnly: false
                                    });
                                    toSet[attr.getIdentifier()] = attr;
                                }
                            });
                            var model = new EditPropModel();
                            
                            model.set(toSet);
                            model.saveInitialValues();
                            propUI.initData([model]);
                            propUI.elements.container.setStyle("height", "100%"); 
                            //propUI._switchEdition(true);

                            attributesForm[interfaceName] = model;
                            accordion.addItem({
                                title: item['label'],
                                content: propUI,
                                selected: true,
                                name: item['name']
                            });
                            //accordion.elements.container.lastElementChild.lastChild.firstChild.setStyle("height", "200px");
                            //accordion.elements.container.lastElementChild.lastChild.firstChild.setStyle("width", "100%");
                        });
                    }
                });
            }
            else {
                accordion.removeItem(item['name']);
                delete this.attributesForm[interfaceName];
            }
            var aSItem = accordion.getSelectedItems();
            var aUItem = accordion.getUnselectedItems();

        }
            
    });
    myWidget.setInterfaces = setInterfaces;
    myWidget.setAttachedInterfaces = setAttachedInterfaces;
    myWidget.setAllAttachedInterfaces = setAllAttachedInterfaces;
    return myWidget;
});

