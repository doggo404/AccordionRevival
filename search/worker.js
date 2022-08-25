var index,data,base_path="function"==typeof importScripts?".":"/search/",allowSearch=!1,documents={},lang=["en"];function getScript(n,e){console.log("Loading script: "+n),$.getScript(base_path+n).done((function(){e()})).fail((function(n,e,a){console.log("Error: "+a)}))}function getScriptsInOrder(n,e){0!==n.length?getScript(n[0],(function(){getScriptsInOrder(n.slice(1),e)})):e()}function loadScripts(n,e){"function"==typeof importScripts?(importScripts.apply(null,n),e()):getScriptsInOrder(n,e)}function onJSONLoaded(){var n=["lunr.js"];if((data=JSON.parse(this.responseText)).config&&data.config.lang&&data.config.lang.length&&(lang=data.config.lang),lang.length>1||"en"!==lang[0]){n.push("lunr.stemmer.support.js"),lang.length>1&&n.push("lunr.multi.js"),(lang.includes("ja")||lang.includes("jp"))&&n.push("tinyseg.js");for(var e=0;e<lang.length;e++)"en"!=lang[e]&&n.push(["lunr",lang[e],"js"].join("."))}loadScripts(n,onScriptsLoaded)}function onScriptsLoaded(){console.log("All search scripts loaded, building Lunr index..."),data.config&&data.config.separator&&data.config.separator.length&&(lunr.tokenizer.separator=new RegExp(data.config.separator)),data.index?(index=lunr.Index.load(data.index),data.docs.forEach((function(n){documents[n.location]=n})),console.log("Lunr pre-built index loaded, search ready")):(index=lunr((function(){1===lang.length&&"en"!==lang[0]&&lunr[lang[0]]?this.use(lunr[lang[0]]):lang.length>1&&this.use(lunr.multiLanguage.apply(null,lang)),this.field("title"),this.field("text"),this.ref("location");for(var n=0;n<data.docs.length;n++){var e=data.docs[n];this.add(e),documents[e.location]=e}})),console.log("Lunr index built, search ready")),allowSearch=!0,postMessage({config:data.config}),postMessage({allowSearch:allowSearch})}function init(){var n=new XMLHttpRequest;n.addEventListener("load",onJSONLoaded);var e=base_path+"/search_index.json";"function"==typeof importScripts&&(e="search_index.json"),n.open("GET",e),n.send()}function search(n){if(allowSearch){for(var e=[],a=index.search(n),t=0;t<a.length;t++){var o=a[t];doc=documents[o.ref],doc.summary=doc.text.substring(0,200),e.push(doc)}return e}console.error("Assets for search still loading")}"function"==typeof importScripts&&(onmessage=function(n){n.data.init?init():n.data.query?postMessage({results:search(n.data.query)}):console.error("Worker - Unrecognized message: "+n)});
