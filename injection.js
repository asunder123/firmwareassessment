var hasAlreadyTriedToInject = false;
var jsagentScript = null;
var pageInjected = false;

log = function(msg) {
	chrome.runtime.sendMessage({type:'log', message: msg});
};


inject = function(head) {	
	if(document.URL) {
		try {
			var parser = new DOMParser();
			var DOM = parser.parseFromString(jsagentScript, 'text/html');
			var tempScript = DOM.head.firstChild;
			if (!tempScript || tempScript.nodeName != "SCRIPT") {
				log("jsagent script is invalid. did not inject.");
				return;
			}
			
			var script = document.createElement('script');
			var attributes = tempScript.attributes;
			for (var i = 0; i < attributes.length; i++) {
				script.setAttribute(attributes[i].name, attributes[i].value);
			}
			if (!script.crossOrigin) {
				script.setAttribute("crossorigin" , "anonymous");
			}
			if (!script.src) {
				log("jsagent script missing key attributes. did not inject.");
				return;
			}
			if (!script.getAttribute("data-dtconfig")) {
				script.src = tempScript.src + '?' + encodeURIComponent(document.URL);
				script.src = script.src.replace("_bs.js", "_complete.js");
				script.src = script.src.replace("_bs_dbg.js", "_complete_dbg.js");
			}

			if (isDebugAgentEnabled() && script.src.indexOf("dbg") === -1) {
				script.src = script.src.replace("_complete.js", "_complete_dbg.js");
                script.src = script.src.replace("ruxitagent_", "ruxitagentdbg_");
			}

			if (removeOverride) {
				removeOverride(head);
			}

			var renderingModuleScript = buildRenderingModuleScript();
			if (renderingModuleScript) {
				injectScriptElementIntoDOM(head, renderingModuleScript);
			}
            injectScriptElementIntoDOM(head, script);

			log("injection successful");
			pageInjected = true;
			if (isMainPageAndActive()) { // inform the extension that injected succeeded
				chrome.runtime.sendMessage({type: INJECTION_INFO_MT, item: {injected: true, hostname: window.location.hostname}});
			}
		} catch(e){
			log(e);
		}
	}
};

// use mutation observer to inject js-agent tag
var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		if (hasAlreadyTriedToInject) {
			return;
		}
		if (mutation.addedNodes) {
			for (var i=0;i<mutation.addedNodes.length;i++) {
				var node = mutation.addedNodes[i];
				if (node.nodeName.toLowerCase() == 'head') {					
					log("mutation observer found head element");	
					inject(node);
					
					hasAlreadyTriedToInject = true;
					
					observer.disconnect();
					return;
				}
				else if(node.nodeName.toLowerCase() == 'body') {
					log("found body before head, injecting into body...");	
					inject(node);
					
					hasAlreadyTriedToInject = true;
					
					observer.disconnect();
					return;
				}
			}
		}    
	});	   
});

function isMainPageAndActive() {
	return window.location == window.parent.location && !document.hidden;
}

function replaceLastModification(script) {
    var find = script.indexOf("lastModification=");
    if (find !== -1) {
        var end = script.indexOf("|", find);
        if (end === -1) {
            end = script.indexOf("\"", find);
        }
        var lastModification = script.substring(find, end);
        script = script.replace(lastModification, "lastModification=9999999999999");
    }
    return script;
}

function isDebugAgentEnabled() {
	return document.cookie.indexOf('dtUseDebugAgent=true') !== -1;
}

// check if it is safe to inject on this page
chrome.runtime.sendMessage({type: SHOULD_INJECT_MT, url: document.URL}, function(response) {
	var config = { attributes: true, childList: true, subtree: true };
	if (response) {
		if (response.shouldInject) {
			if (response.userId) {
				sessionStorage.setItem("rxVisitor", response.userId);
			}
			jsagentScript = replaceLastModification(response.jsagentScript);
			if(document.head) {
				log("document head already available at document_start, no need for using the mutation observer");
				inject(document.head);
			}
			else {
				observer.observe(document, config);
			}
		} else if (isMainPageAndActive()) { // inform the extension that injection failed
			chrome.runtime.sendMessage({type: INJECTION_INFO_MT, item: {injected: false, hostname: window.location.hostname}});
		}
	}
});

// manage communication for the extension
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		if (request.type === GET_INJECTION_INFO_MT)  {
			if (isMainPageAndActive()) { 
				var response = {type: INJECTION_INFO_MT, item: {injected: pageInjected, hostname: window.location.hostname}};
				chrome.runtime.sendMessage(response); // send to background page to update the icon
				sendResponse(response); // send back to the options page to update the details
			}
		}

		return true;
	}
);
