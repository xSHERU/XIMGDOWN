chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        chrome.storage.local.set({toggleExtensionStatus:false});
        chrome.storage.local.set({toggleDomainFilterStatus:false});
        chrome.storage.local.set({toggleReplaceRulesStatus:false});
        chrome.storage.local.set({domainFilters:[]});
        chrome.storage.local.set({replaceRules:[]});
    }
});