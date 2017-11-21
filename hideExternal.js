if(typeof(dojo) != "undefined") {
    require(["dojo/domReady!"], function(){
        try {
            var waitFor = function(callback, elXpath, elXpathRoot, maxInter, waitTime) {
                if(!elXpathRoot) {
                    var elXpathRoot = dojo.body();
                }
                if(!maxInter) {
                    var maxInter = 10000;  // number of intervals before expiring
                }
                if(!waitTime) {
                    var waitTime = 1;  // 1000=1 second
                }
                if(!elXpath) {
                    return;
                }
                var waitInter = 0;  // current interval
                var intId = setInterval( function(){
                    if( ++waitInter<maxInter && !dojo.query(elXpath,elXpathRoot).length) {
                        return;
                    }

                    clearInterval(intId);
                    if( waitInter >= maxInter) {
                        console.log("**** WAITFOR ["+elXpath+"] WATCH EXPIRED!!! interval "+waitInter+" (max:"+maxInter+")");
                    } else {
                        console.log("**** WAITFOR ["+elXpath+"] WATCH TRIPPED AT interval "+waitInter+" (max:"+maxInter+")");
                        callback();
                    }
                }, waitTime);
            };

            var uncheckDijitRadioButton = function(idPrefix, idSpecifier) {
                //console.log("uncheckDijitRadioButton", idPrefix, idSpecifier)
                var radioButtonList = [];
                // get all input elements with id starting with given prefix
                var inputElementList = dojo.query('input[id^="' + idPrefix + '"]');
                // since the dijit dialogbox id changes incrementally, we need to query for it
                if (inputElementList && inputElementList.length > 0) {
                    for (var i = 0; i < inputElementList.length; i++) {
                        var _elem = inputElementList[i];
                        if (_elem && _elem.id && _elem.id.indexOf('setExt') > 0) {
                            radioButtonList.push(_elem);
                        }
                    }
                }
                for (var i = 0; i < radioButtonList.length; i++) {
                    //console.log("uncheck:", radioButtonList[i]);
                    radioButtonList[i].checked = false;
                }
            };

            var removePreviousDialogs = function(idPrefix) {
                // get all dialog elements with id starting with given prefix
                var divElementList = dojo.query('div[id^="' + idPrefix + '"]');
                if (divElementList && divElementList.length > 0) {
                    for (var i = 0; i < divElementList.length; i++) {
                        // remove content
                        divElementList[i].innerHTML = "";
                        // remove classes
                        divElementList[i].setAttribute("class", "");
                    }
                }
            }

            waitFor( function() {
                // uncheck the 'Allow people from outside of my organization to become members of this community' option in 'communitycreate' dialog
                var communityAllowExternalRadioButton = dojo.byId("allowExternal");
                if (communityAllowExternalRadioButton) {
                    communityAllowExternalRadioButton.checked = false;
                }

                // uncheck external options for item creation
                // need to inject method calls into button clicks since they are wrapped in dijit dialogs
                var createItemButton = dojo.byId('lconn_files_action_createitem_0');
                if (!createItemButton) {
                    return;
                }
                createItemButton.addEventListener("click", function() {
                    // give the dialog some time to render
                    setTimeout(function() {
                        // uncheck the 'Files can be shared with people external to my organization' option in 'Upload Files' dialog
                        // since the dialog needs time to render, use waitFor loop
                        var filesUploadAction = dojo.byId('lconn_files_action_uploadfile_0_text');
                        filesUploadAction.addEventListener("click", function() {
                            // remove dialogs since otherwise the waitFor will find old dialog containers
                            removePreviousDialogs('lconn_share_widget_Dialog_');
                            waitFor(function() {
                                uncheckDijitRadioButton('lconn_files_widget_UploadFile_', 'setExt')
                            }, "div.dijitDialog input.lotusCheckbox");
                        });

                        // uncheck the 'Folder can be shared with people external to my organization' option in 'New Folder' dialog
                        // since the dialog needs time to render, use waitFor loop
                        var foldersUploadAction = dojo.byId('lconn_files_action_createcollection_0_text');
                        foldersUploadAction.addEventListener("click", function() {
                            // remove dialogs since otherwise the waitFor will find old dialog containers
                            removePreviousDialogs('lconn_share_widget_Dialog_');
                            waitFor(function() {
                                uncheckDijitRadioButton('lconn_share_widget_Dialog_', 'setExt')
                            }, "div.dijitDialog input.lotusCheckbox");
                        });
                    }, 1);
                });
            }, ".lotusContent");
      } catch(e) {
          alert("Exception occurred in uncheckExternal: " + e);
      }
   });
}
