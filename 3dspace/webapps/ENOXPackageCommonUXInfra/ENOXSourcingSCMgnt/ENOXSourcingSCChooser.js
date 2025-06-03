/* global widget */
/* global UWA */
define('DS/ENOXPackageCommonUXInfra/ENOXSourcingSCMgnt/ENOXSourcingSCChooser', [
  'DS/UIKIT/Input/Select',
	'DS/Windows/ImmersiveFrame',
	'DS/Windows/Dialog',
	'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
	'DS/Controls/Button'
], function(
  Select,
  WUXImmersiveFrame,
  WUXDialog,
  NLS,
  WUXButton
) {
    'use strict';

    function SCChooser(options){
      //var that = this;
      this.SCManager = options.SCManager;
      this.resolve = options.resolve;
      this.reject =  options.reject;

      this.buildView();
    }

    SCChooser.prototype._buildModal  = function(){
    	var that = this;
    	var immersiveFrame = new WUXImmersiveFrame();
		immersiveFrame.inject(widget.body);
		immersiveFrame.addEventListener('removeWindow', function () {
			immersiveFrame.destroy();
		});
		
		this.myContent = UWA.createElement('div', {
			styles: {
				width: '100%',
				height: '100%',
				position: 'relative',
				background: 'white',
				overflow: 'visible',
				padding: '32px'
			}
		});
		
		this.dialog = new WUXDialog({
			title: NLS.chooser_your_credentials,
			content: this.myContent,
			buttons: {
				Ok: new WUXButton({
					id: 'selectok',
					disabled:true,
					label: NLS.ok,
					onClick:function(){
				        var selectedSC = that.selector.getValue()[0];
				        widget.setValue('SC', selectedSC );
				        that.resolve && that.resolve(selectedSC);	
				        immersiveFrame.destroy();
					}
				})
			},
			width: 600,
			height: 200,
			immersiveFrame: immersiveFrame,
			resizableFlag: true,
			modalFlag: true,
			touchMode : true,
			closeButtonFlag:false
		});

		 
      return this.myContent;
    };


    SCChooser.prototype._getModalContent = function(){
      var prefs = this.SCManager.getSCPreference();
      var sc_list = (prefs && Array.isArray(prefs.options)) ? prefs.options  : [];
      var that = this;
      this.selector = new Select({
        placeholder: NLS.list_of_securitycontext,
        options: sc_list,
        events : {
          onChange : that.onChange.bind(that)
        }
        });
      return this.selector;
    };
    SCChooser.prototype.onChange = function(){
      //sconsole.log(this.selector.getValue());
      var selected = this.selector.getValue()[0];
      if(selected.trim().length ===0){
        this.disableValidateBtn();
      }else{
        this.enableValidateBtn();
      }
        
    };

    SCChooser.prototype.disableValidateBtn = function(){
    	this.dialog.buttons.Ok.disabled=true;
    };

    SCChooser.prototype.enableValidateBtn = function(){
    	this.dialog.buttons.Ok.disabled=false;
    };

    SCChooser.prototype.buildView = function(){
     // var that = this;
      this._getModalContent().inject(this._buildModal());

    };

    return SCChooser;

});
