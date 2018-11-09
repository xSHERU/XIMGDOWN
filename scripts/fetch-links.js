var arrayA = [].slice.apply(document.getElementsByTagName('a'));
var arrayIMG = [].slice.apply(document.getElementsByTagName('img'));
var links = [];
for(var i=0;i<arrayA.length;i++){
    var element = arrayA[i];
    var href = element.href;
    if(href!=""){
        links.push(href);
    }
}
for(var i=0;i<arrayIMG.length;i++){
    var element = arrayIMG[i];
    var src = element.src;
    if(src!=""){
        links.push(src);
    }
}
links.sort();

var extensionStatus=false;
var domainFilterStatus=false;
var replaceRulesStatus=false;
var domainFiltersArray=[];
var replaceRulesArray=[];

chrome.storage.local.get("toggleExtensionStatus", function(resultExtensionStatus){
    extensionStatus=resultExtensionStatus.toggleExtensionStatus;
    chrome.storage.local.get("toggleDomainFilterStatus", function(resultDomainFilterStatus){
        domainFilterStatus=resultDomainFilterStatus.toggleDomainFilterStatus;
        chrome.storage.local.get("toggleReplaceRulesStatus", function(resultReplaceRulesStatus){
            replaceRulesStatus=resultReplaceRulesStatus.toggleReplaceRulesStatus;
            chrome.storage.local.get("domainFilters", function(resultDomainFilters){
                domainFiltersArray = resultDomainFilters.domainFilters;
                chrome.storage.local.get("replaceRules", function(resultReplaceRules){
                    replaceRulesArray = resultReplaceRules.replaceRules;

                    filterLinks();
                });
            });
        });
    });
});

function getExtension(url) {
    return (url = url.substr(1 + url.lastIndexOf("/")).split('?')[0]).split('#')[0].substr(url.lastIndexOf("."))
}

function filterLinks() {
    var linksToSend = [];
    for (var i = 0; i < links.length; i++) {
        var shouldSend=true;
        var currentLink=links[i];

        if(extensionStatus){
            var extensionInner = getExtension(currentLink);
            var extensionOuter = currentLink.substr(1 + currentLink.lastIndexOf("."));
            extensionInner=extensionInner.toUpperCase();
            extensionOuter=extensionOuter.toUpperCase();
            if(extensionInner!=".JPG" && extensionInner!=".JPEG" && extensionInner!=".PNG" && extensionOuter!="JPG" && extensionOuter!="JPEG" && extensionOuter!="PNG"){
                shouldSend=false;
            }
        }
        
        if(shouldSend && domainFilterStatus && domainFiltersArray.length>0){
            var shouldSendInner=false;
            for(var j=0;j<domainFiltersArray.length;j++){
                if(domainFiltersArray[j].status){
                    var allowedLink=domainFiltersArray[j].domain;
                    allowedLink=allowedLink.toLowerCase();
                    var lowerCurrentLink=currentLink.toLowerCase();
                    if(currentLink!='' && allowedLink!=lowerCurrentLink && lowerCurrentLink.includes(allowedLink)==true) {
                        shouldSendInner=true;
                    }
                }
            }
            if(shouldSendInner==false){
                shouldSend=false;
            }
        }

        if(shouldSend && replaceRulesStatus && replaceRulesArray.length>0){
            for(var k=0;k<replaceRulesArray.length;k++){
                if(replaceRulesArray[k].status){
                    var search = replaceRulesArray[k].search;
                    var replace = replaceRulesArray[k].replace;
                    if(currentLink.includes(search)){
                        currentLink = currentLink.replace(search, replace);
                    }
                }
            }
        }
        
        if(shouldSend){
            linksToSend.push(currentLink);
        }
    }
    chrome.extension.sendMessage(linksToSend);
}