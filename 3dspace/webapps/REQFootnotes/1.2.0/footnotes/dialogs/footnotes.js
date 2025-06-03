/**
* The footnotes dialog definition.
*
* Version 1.0.9
* https://github.com/andykirk/CKEditorFootnotes
* @quickreview UW9 VAI1 31 May 2024 : IR-1242258 - Paste operation using ctrl+v prevented inside 'Manage Footnotes' dialog editor
* @quickreview UW9 VAI1 07 Mar 2024 : IR-1255571 - Handled edition of existing footnotes
* @quickreview UW9 VAI1 07 Mar 2024 : IR-1239651 - Handled issues related to footnote_editor.destroy()
* @quickreview UW9 VAI1 23 Feb 2024 : IR-1235730 - NLS support for Footnotes
* @quickreview UW9 VAI1 07 Feb 2024 : FUN138526 - Customized ckeditor toolbar commands in Manage Footnotes panel
*/

(function () {
    "use strict";

    // Dialog definition.
    CKEDITOR.dialog.add('footnotesDialog', function (editor) {

        return {
            editor_name: false,
            footnotes_editor: false,
            dialog_dom_id: false,
            // Basic properties of the dialog window: title, minimum size.
            title: CKEDITOR.footnotesNls.footnotesPanelTitle,
            minWidth: 400,
            minHeight: 200,

            // Dialog window contents definition.
            contents: [
                {
                    // Definition of the Basic Settings dialog tab (page).
                    id: 'tab-basic',
                    label: 'Basic Settings',

                    // The tab contents.
                    elements: [
                        {
                            // Text input field for the footnotes text.
                            type: 'textarea',
                            id: 'new_footnote',
                            'class': 'footnote_text',
                            label: CKEDITOR.footnotesNls.newFootnote,
                            inputStyle: 'height: 100px',
                        },
                        {
                            // Text input field for the footnotes title (explanation).
                            type: 'text',
                            id: 'footnote_id',
                            name: 'footnote_id',
                            label: CKEDITOR.footnotesNls.noExistingFootnote,

                            // Called by the main setupContent call on dialog initialization.
                            setup: function (element) {

                                var dialog = this.getDialog(),
                                    editor = dialog.getParentEditor(),
                                    el = dialog.getElement().findOne('#' + this.domId),
                                    footnotes = editor.editable().findOne('.footnotes ol');

                                dialog.dialog_dom_id = this.domId;
                                if (dialog.footnotes_editor)
                                    dialog.footnotes_editor.destroy();

                                if (footnotes !== null) {

                                    if (el.findOne('p') === null) {
                                        el.appendHtml('<p style="margin-bottom: 10px;">' + CKEDITOR.footnotesNls.chooseFromExistingFootnote + '</p><ol class="footnotes_list"></ol>');
                                    } else {
                                        el.findOne('ol').getChildren().toArray().forEach(function (item) {
                                            item.remove();
                                        });
                                    }

                                    var radios = '';

                                    footnotes.find('li').toArray().forEach(function (item) {

                                        var footnote_id = item.getAttribute('data-footnote-id');
                                        var cite_text = item.findOne('cite').getText();

                                        radios += '<li style="margin-left: 15px;"><input type="radio" name="footnote_id" value="' + footnote_id + '" id="fn_' + footnote_id + '" /> <label for="fn_' + footnote_id + '" style="white-space: normal; display: inline-block; padding: 0 25px 0 5px; vertical-align: top; margin-bottom: 10px;">' + cite_text + '</label></li>';
                                    });

                                    el.find('label,div').toArray().forEach(function (item) {
                                        item.setStyle('display', 'none');
                                    });
                                    el.findOne('ol').appendHtml(radios);

                                    el.find('input[type="radio"]').toArray().forEach(function (item) {
                                        item.on('change', function () {

                                            // Set the hidden input with the radio ident for the
                                            // footnote links to use:
                                            el.findOne('input[type="text"]').setValue(item.getValue());

                                            // Also clear the editor to avoid any confusion:
                                            dialog.footnotes_editor.setData('');
                                        });
                                    });

                                } else {
                                    el.find('div').toArray().forEach(function (item) {
                                        item.setStyle('display', 'none');
                                    });
                                }
                            }
                        }
                    ]
                },
            ],

            // Invoked when the dialog is loaded.
            onShow: function () {
                this.setupContent();

                var dialog = this;
                CKEDITOR.on('instanceLoaded', function (evt) {
                    dialog.editor_name = evt.editor.name;
                    dialog.footnotes_editor = evt.editor;
                });

                CKEDITOR.on('instanceReady', function (evt) {
                    if(editor.element.findOne('.cke_widget_selected')){
                        if(CKEDITOR.instances[dialog.editor_name])
                            CKEDITOR.instances[dialog.editor_name].setData(editor.footnotes_store[editor.element.findOne('.cke_widget_selected').findOne('.cke_widget_element').$.dataset.footnoteId]);
                    }
                });                
                
                // Allow page to scroll with dialog to allow for many/long footnotes
                // (https://github.com/andykirk/CKEditorFootnotes/issues/12)
                /*this.getElement().findOne('.cke_dialog').setStyles({
                    'position': 'absolute',
                    'top': '2%'
                });*/
                // Note that it seems core CKEditor Dialog CSS now solves this for me so I don't
                // need the above code. I'll keep it here for reference for now though.

                var current_editor_id = dialog.getParentEditor().id;

                CKEDITOR.replaceAll(function (textarea, config) {
                    // Make sure the textarea has the correct class:
                    if (!textarea.className.match(/footnote_text/)) {
                        return false;
                    }

                    // Make sure we only instantiate the relevant editor:
                    var el = textarea;
                    while ((el = el.parentElement) && !el.classList.contains(current_editor_id));
                    if (!el) {
                        return false;
                    }

                    //Customized ckeditor toolbar commands in Manage Footnotes panel
                    config.toolbar = [
                        { name: 'clipboard', items: ['Undo', 'Redo', '-', 'Cut', 'Copy'] },
                        { name: 'editing', items: ['SelectAll'] },
                        { name: 'basicstyles', items: ['Bold', 'Italic', '-', 'CopyFormatting', 'RemoveFormat'] }//,
                        //{ name: 'links', items: ['Link'] }
                    ];
                    config.removePlugins = 'image,forms,elementspath';
                    config.language = editor.langCode;
                    config.allowedContent = 'br em strong; a[!href]';
                    config.enterMode = CKEDITOR.ENTER_BR;
                    config.autoParagraph = false;
                    config.height = 80;
                    config.resize_enabled = false;
                    config.autoGrow_minHeight = 80;

                    var extra_config = editor.config.footnotesDialogEditorExtraConfig;
                    if (extra_config) {
                        for (var attribute in extra_config) {
                            config[attribute] = extra_config[attribute];
                        }
                    }

                    // If we focus on the dialog editor we should clear the radios to avoid any
                    // confusion. Similarly, if we focus on a radio, we should clear the editor
                    // (see setup above for radio change event handler for that)
                    config.on = {
                        focus: function (evt) {
                            var form_row = evt.editor.element.getAscendant('tr').getNext();
                            form_row.find('input[type="radio"]').toArray().forEach(function (item) {
                                item.$.checked = false;
                            });
                            form_row.findOne('input[type="text"]').setValue('');
                        },
                        key: function(evt) {
                            if(event.keyCode == 86 && event.ctrlKey == true){
                                evt.cancel();
                            }
                        }
                    };
                    return true;
                });

            },

            // This method is invoked once a user clicks the OK button, confirming the dialog.
            onOk: function () {
                var dialog = this;
                var footnote_editor = CKEDITOR.instances[dialog.editor_name];
                var footnote_id = dialog.getValueOf('tab-basic', 'footnote_id');
                var footnote_data = footnote_editor.getData();


                if (footnote_id == '') {
                    // No existing id selected, check for new footnote:
                    if (footnote_data == '') {
                        // Nothing entered, so quit:
                        footnote_editor.destroy();
                        return;
                    } else {
                        // Insert new footnote:
                        editor.plugins.footnotes.build(footnote_data, true, editor);
                        editor.footnoteCreated = true;
                    }
                } else {
                    // Insert existing footnote:
                    editor.plugins.footnotes.build(footnote_id, false, editor);
                    editor.footnoteCreated = true;
                }
                // Destroy the editor so it's rebuilt properly next time:
                footnote_editor.destroy();
                // Destroy the list of footnotes so it's rebuilt properly next time:
                var list = dialog.getElement().findOne('#' + dialog.dialog_dom_id).findOne('ol');
                if (list) {
                    list.getChildren().toArray().forEach(function (item) {
                        item.remove();
                    });
                }
                return;
            },

            onCancel: function () {
                var dialog = this;
                var footnote_editor = CKEDITOR.instances[dialog.editor_name];
                footnote_editor.setData('');
                //footnote_editor.destroy();
            }            
        };
    });
}());
