//XSS_CHECKED
/* global UWA */
/*eslint no-unused-vars: "off"*/
define('DS/ENOXPackageCommonUXInfra/DragAndDrop/DnDInvite/DnDInvite', [
	'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
    'DS/Core/Core',
    'UWA/Controls/Abstract',
    'UWA/Class/Options',
    'UWA/Class/Events',
    'UWA/Utils/Client',
    'DS/UIKIT/Spinner',
    'css!DS/ENOXPackageCommonUXInfra/DragAndDrop/DnDInvite/DnDInvite.css',
    'css!DS/UIKIT/UIKIT.css'
], function (
    NLS,
    WUXCore,
    Abstract,
    Options,
    Events,
    Client,
    Spinner
  ) {
    'use strict';

    var DnDInvite = Abstract.extend(Options, Events, {
        name: 'dnd_invite',
        defaultOptions: {
            mode: 'dynamic',
            invites: {
                drop: {
                    nls: 'drop',
                    icon: 'drag-drop'
                },
                insert: {
                    icon: 'plus',
                    nls: 'insert'
                }
            },
            active_invite: 'drop',
            isTouchActivated: false
        },
        init: function (options) {
            this._parent(options);
            this.options.isTouchActivated = (Client.Features.touchEvents && !Client.Features.pointerEvents);
            if (this.options.isTouchActivated) {
                this.options.invites.drop = {
                    nls: 'drop',
                    icon: 'touch'
                };
            }

            this._createDynamicInvite();
           
        },

        _createDynamicInvite: function () {
            this.elements.container = UWA.createElement('div', {
                'class': this.getClassNames('_container')
            });
            if (this.options.isTouchActivated) {
                var touchCB = function (e) {

                };
                this.elements.container.className += ' touch_look';
                this.elements.container.style.pointerEvents = 'auto';
                this.elements.container.addEventListener('touchend', touchCB);
            }
            var invites_keys = Object.getOwnPropertyNames(this.options.invites);
            for (var idx = 0; idx < invites_keys.length; idx++) {
                var key = invites_keys[idx];
                this.elements.container[key] = UWA.createElement('div', {
                    'class': this.getClassNames('_display ' + key),
                    draggable: false
                });
                if(key==='add_in_context'){

                   new Spinner({className: 'large' }).inject(this.elements.container[key]).show();

                  UWA.createElement('h5', {
                      'class': this.getClassNames('_txt font-3dsregular ' + key),
                      'text': NLS['DropInvit_' + this.options.invites[key].nls]
                  }).inject(this.elements.container[key]);
                }else{
                  UWA.createElement('i', {
                      'class': this.getClassNames('_img wux-ui-3ds wux-ui-3ds-5x wux-ui-3ds-' + this.options.invites[key].icon)
                  }).inject(this.elements.container[key]);
                  UWA.createElement('h5', {
                      'class': this.getClassNames('_txt font-3dsregular ' + key),
                      'text': NLS['DropInvit_' + this.options.invites[key].nls]
                  }).inject(this.elements.container[key]);
                }


                this.elements.container[key].inject(this.elements.container);
                if (this.options.active_invite !== key) {
                    this.elements.container[key].hide();
                }
            }

            if (this.getOption('renderTo')) {
                this.elements.container.inject(this.getOption('renderTo'));
            }
        },
        removeBorder:function() {
          this.elements.container.addClassName("no-border");
        },
        addBorder:function(){
          this.elements.container.removeClassName("no-border");
        },

        show: function (active_view) {
           
            if (this.options.active_invite !== active_view) {
                if (!UWA.is(active_view, 'string')) {
                    this.options.active_invite = 'drop';
                } else {
                    if (this.options.active_invite !== active_view && this.options.active_invite !== '') {
                        this.elements.container[this.options.active_invite].hide();
                    }
                    this.options.active_invite = active_view;
                }
                this.elements.container[this.options.active_invite].show();
                this.elements.container.show();
                this.dispatchEvent('toggleInvite', true);
            }
        },

        hide: function (active_view) {
           
            if (UWA.is(active_view, 'string')) {
                if (this.options.active_invite !== '' && this.options.active_invite === active_view) {
                    this.elements.container[this.options.active_invite].hide();
                    this.elements.container.hide();
                }
            } else if (this.options.active_invite !== '') {
                this.elements.container[this.options.active_invite].hide();
                this.elements.container.hide();
            }
            this.options.active_invite = '';
            this.dispatchEvent('toggleInvite', false);
        }
    });

    return DnDInvite;
});
