var linksArray = [];
var domainFiltersArray = [];
var replaceRulesArray = [];

chrome.extension.onMessage.addListener(function (links) {
    for (var index in links) {
        linksArray.push(links[index]);
    }
    linksArray.sort();
    showLinks();
});

/* display searched links in list */
function showLinks() {
    $("#table-links").html("");
    if(linksArray.length > 0){
        $("#sp-link-count").html(linksArray.length);
    }
    for (var i=0;i<linksArray.length;i++) {
        var htmlToAppend='<tr><td><input type="checkbox" class="cb-link" id="cb-link-'+i+'" checked></td><td><small class="sp-link" style="white-space:nowrap;">'+linksArray[i]+'</small></td></tr>';
        $("#table-links").append(htmlToAppend);
    }
}

/* display domain filters list */
function showDomainFilter() {
    $("#table-domain-filters").html("");
    var activeCounter=0;
    for (var i=0;i<domainFiltersArray.length;i++){
        var activeStatus='';
        if(domainFiltersArray[i].status){
            activeCounter++;
            activeStatus=' checked';
        }
        var htmlToAppend='<tr><td><input type="checkbox" class="cb-domain-filters" id="cb-domain-filters-'+i+'" data-index="'+i+'"'+activeStatus+'></td><td class="col-span"><small class="sp-domain-filters" style="white-space:nowrap;">'+domainFiltersArray[i].domain+'</small></td><td><small class="sp-delete sp-delete-domain-filters" data-index="'+i+'">X</small></td></tr>';
        $("#table-domain-filters").append(htmlToAppend);
    }
    $("#sp-domain-filters-count").html(activeCounter);

    $(".cb-domain-filters").on('click',function(){
        var index=Number($(this).attr("data-index"));
        var activeStatus=false;
        if($(this).is(":checked")){
            activeStatus=true;
        }
        domainFiltersArray[index].status=activeStatus;
        chrome.storage.local.set({domainFilters:domainFiltersArray});

        $("#sp-domain-filters-count").html($('.cb-domain-filters:checked').length);
    });
    $(".sp-delete-domain-filters").on('click',function(){
        var index=Number($(this).attr("data-index"));
        domainFiltersArray.splice(index,1);
        chrome.storage.local.set({domainFilters:domainFiltersArray});
        
        showDomainFilter();
    });
}

/* display replace rules list */
function showReplaceRules() {
    $("#table-replace-rules").html("");
    var activeCounter=0;
    for (var i=0;i<replaceRulesArray.length;i++){
        var activeStatus='';
        if(replaceRulesArray[i].status){
            activeCounter++;
            activeStatus=' checked';
        }
        var htmlToAppend='<tr><td><input type="checkbox" class="cb-replace-rule" id="cb-replace-rule-'+i+'" data-index="'+i+'"'+activeStatus+'></td><td class="col-span"><small class="sp-replace-rule sp-replace-rule-search" style="white-space:nowrap;">'+replaceRulesArray[i].search+'</small><small style="white-space:nowrap;"> => </small><small class="sp-replace-rule sp-replace-rule-replace" style="white-space:nowrap;">'+replaceRulesArray[i].replace+'</small></td><td><small class="sp-delete sp-delete-replace-rule" data-index="'+i+'">X</small></td></tr>';
        $("#table-replace-rules").append(htmlToAppend);
    }
    $("#sp-replace-rules-count").html(activeCounter);

    $(".cb-replace-rule").on('click',function(){
        var index=Number($(this).attr("data-index"));
        var activeStatus=false;
        if($(this).is(":checked")){
            activeStatus=true;
        }
        replaceRulesArray[index].status=activeStatus;
        chrome.storage.local.set({replaceRules:replaceRulesArray});

        $("#sp-replace-rules-count").html($('.cb-replace-rule:checked').length);
    });
    $(".sp-delete-replace-rule").on('click',function(){
        var index=Number($(this).attr("data-index"));
        replaceRulesArray.splice(index,1);
        chrome.storage.local.set({replaceRules:replaceRulesArray});
        
        showReplaceRules();
    });
}

window.onload = function () {
    chrome.storage.local.get("toggleExtensionStatus", function(result){
        $("#cb-toggle-extensions").prop("checked", result.toggleExtensionStatus);
    });
    chrome.storage.local.get("toggleDomainFilterStatus", function(result){
        $("#cb-toggle-domain-filters").prop("checked", result.toggleDomainFilterStatus);
    });
    chrome.storage.local.get("toggleReplaceRulesStatus", function(result){
        $("#cb-toggle-replace-rules").prop("checked", result.toggleReplaceRulesStatus);
    });
    chrome.storage.local.get("domainFilters", function(result){
        domainFiltersArray = result.domainFilters;
        showDomainFilter();
    });
    chrome.storage.local.get("replaceRules", function(result){
        replaceRulesArray = result.replaceRules;
        showReplaceRules();
    });
    $("#inp-domain-filters").on('keyup',function(){
        $("#sp-error-domain-filters").hide();
    });
    $("#inp-search, #inp-replace").on('keyup',function(){
        $("#sp-error-replace-rules").hide();
    });
    $("#cb-toggle-all").on('change',function(){
        var isChecked = $("#cb-toggle-all").is(":checked");
        $(".cb-link").each(function(){
            $(this).prop("checked",isChecked);
        });
    });
    $("#cb-toggle-extensions").on('change',function(){
        var toggleExtension = $("#cb-toggle-extensions").is(":checked");
        chrome.storage.local.set({toggleExtensionStatus:toggleExtension});
    });
    $("#cb-toggle-domain-filters").on('change',function(){
        var toggleDomainFilter = $("#cb-toggle-domain-filters").is(":checked");
        chrome.storage.local.set({toggleDomainFilterStatus:toggleDomainFilter});
    });
    $("#cb-toggle-replace-rules").on('change',function(){
        var toggleReplaceRules = $("#cb-toggle-replace-rules").is(":checked");
        chrome.storage.local.set({toggleReplaceRulesStatus:toggleReplaceRules});
    });
    $("#btn-toggle-advance").on('click',function(){
        if($("#div-advance-settings").is(":visible")){
            $("#div-advance-settings").hide();
        }else{
            $("#div-advance-settings").show();
        }
    });
    $("#btn-add-domain-filter").on('click',function(){
        var inputValue=$("#inp-domain-filters").val();
        if(inputValue!=""){
            var newDomainFilter = {
                status:true,
                domain:inputValue
            };
            domainFiltersArray.push(newDomainFilter);
            chrome.storage.local.set({domainFilters:domainFiltersArray});
    
            showDomainFilter();
            $("#inp-domain-filters").val("");
        }else{
            $("#sp-error-domain-filters").show();
        }
    });
    $("#btn-add-replace-rule").on('click',function(){
        var searchValue=$("#inp-search").val();
        var replaceValue=$("#inp-replace").val();
        if(searchValue!="" && replaceValue!=""){
            var newReplaceRule = {
                status:true,
                search:searchValue,
                replace:replaceValue,
            };
            replaceRulesArray.push(newReplaceRule);
            chrome.storage.local.set({replaceRules:replaceRulesArray});
    
            showReplaceRules();

            $("#inp-search").val("");
            $("#inp-replace").val("");
        }else{
            $("#sp-error-replace-rule").show();
        }
    });
    $("#btn-search").on('click',function(){
        linksArray=[];
        chrome.windows.getCurrent(function (currentWindow) {
            chrome.tabs.query({
                active: true,
                windowId: currentWindow.id
            },
            function (activeTabs) {
                chrome.tabs.executeScript(activeTabs[0].id, {
                    file: 'scripts/fetch-links.js',
                    allFrames: true
                });
            });
        });
    });
    $("#btn-download").on('click',function(){
        for (var i = 0; i < linksArray.length; ++i) {
            if ($("#cb-link-"+i).is(":checked")) {
                chrome.downloads.download({
                    url: linksArray[i]
                },
                function (id) {});
            }
        }
    });
};