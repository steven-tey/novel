(function(){"use strict";var e={876:function(e,t){Object.defineProperty(t,"__esModule",{value:true});0&&0;function _export(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:true,get:t[r]})}_export(t,{hydrationErrorWarning:function(){return r},hydrationErrorComponentStack:function(){return n},patchConsoleError:function(){return patchConsoleError}});let r;let n;const a=new Set(['Warning: Text content did not match. Server: "%s" Client: "%s"%s',"Warning: Expected server HTML to contain a matching <%s> in <%s>.%s",'Warning: Expected server HTML to contain a matching text node for "%s" in <%s>.%s',"Warning: Did not expect server HTML to contain a <%s> in <%s>.%s",'Warning: Did not expect server HTML to contain the text node "%s" in <%s>.%s']);function patchConsoleError(){const e=console.error;console.error=function(t,o,i,l){if(a.has(t)){r=t.replace("%s",o).replace("%s",i).replace("%s","");n=l}e.apply(console,arguments)}}if((typeof t.default==="function"||typeof t.default==="object"&&t.default!==null)&&typeof t.default.__esModule==="undefined"){Object.defineProperty(t.default,"__esModule",{value:true});Object.assign(t.default,t);e.exports=t.default}},659:function(e,t){Object.defineProperty(t,"__esModule",{value:true});Object.defineProperty(t,"parseComponentStack",{enumerable:true,get:function(){return parseComponentStack}});function parseComponentStack(e){const t=[];for(const n of e.trim().split("\n")){const e=/at ([^ ]+)( \((.*)\))?/.exec(n);if(e==null?void 0:e[1]){const n=e[1];const a=e[3];if(a==null?void 0:a.includes("next/dist")){break}const o=a==null?void 0:a.replace(/^(webpack-internal:\/\/\/|file:\/\/)(\(.*\)\/)?/,"");var r;const[i,l,s]=(r=o==null?void 0:o.split(":"))!=null?r:[];t.push({component:n,file:i,lineNumber:l?Number(l):undefined,column:s?Number(s):undefined})}}return t}if((typeof t.default==="function"||typeof t.default==="object"&&t.default!==null)&&typeof t.default.__esModule==="undefined"){Object.defineProperty(t.default,"__esModule",{value:true});Object.assign(t.default,t);e.exports=t.default}}};var t={};function __nccwpck_require__(r){var n=t[r];if(n!==undefined){return n.exports}var a=t[r]={exports:{}};var o=true;try{e[r](a,a.exports,__nccwpck_require__);o=false}finally{if(o)delete t[r]}return a.exports}!function(){__nccwpck_require__.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};__nccwpck_require__.d(t,{a:t});return t}}();!function(){__nccwpck_require__.d=function(e,t){for(var r in t){if(__nccwpck_require__.o(t,r)&&!__nccwpck_require__.o(e,r)){Object.defineProperty(e,r,{enumerable:true,get:t[r]})}}}}();!function(){__nccwpck_require__.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}();!function(){__nccwpck_require__.r=function(e){if(typeof Symbol!=="undefined"&&Symbol.toStringTag){Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}Object.defineProperty(e,"__esModule",{value:true})}}();if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var r={};!function(){__nccwpck_require__.r(r);__nccwpck_require__.d(r,{ReactDevOverlay:function(){return Zt},getErrorByType:function(){return getErrorByType},getServerError:function(){return getServerError},onBeforeRefresh:function(){return onBeforeRefresh},onBuildError:function(){return onBuildError},onBuildOk:function(){return onBuildOk},onRefresh:function(){return onRefresh},register:function(){return register},unregister:function(){return unregister}});const e="build-ok";const t="build-error";const n="fast-refresh";const a="before-fast-refresh";const o="unhandled-error";const i="unhandled-rejection";let l=new Set;let s=[];function drain(){setTimeout((function(){while(Boolean(s.length)&&Boolean(l.size)){const e=s.shift();l.forEach((t=>t(e)))}}),1)}function emit(e){s.push(Object.freeze({...e}));drain()}function on(e){if(l.has(e)){return false}l.add(e);drain();return true}function off(e){if(l.has(e)){l.delete(e);return true}return false}var u=require("next/dist/compiled/stacktrace-parser");const c=/\/_next(\/static\/.+)/g;function parseStack(e){const t=(0,u.parse)(e);return t.map((e=>{try{const t=new URL(e.file);const r=c.exec(t.pathname);if(r){const t=process.env.__NEXT_DIST_DIR?.replace(/\\/g,"/")?.replace(/\/$/,"");if(t){e.file="file://"+t.concat(r.pop())}}}catch{}return e}))}var d=__nccwpck_require__(659);var f=__nccwpck_require__(876);function getFilesystemFrame(e){const t={...e};if(typeof t.file==="string"){if(t.file.startsWith("/")||/^[a-z]:\\/i.test(t.file)||t.file.startsWith("\\\\")){t.file=`file://${t.file}`}}return t}const m=Symbol("NextjsError");function getErrorSource(e){return e[m]||null}function decorateServerError(e,t){Object.defineProperty(e,m,{writable:false,enumerable:false,configurable:false,value:t})}function getServerError(e,t){let r;try{throw new Error(e.message)}catch(e){r=e}r.name=e.name;try{r.stack=`${r.toString()}\n${(0,u.parse)(e.stack).map(getFilesystemFrame).map((e=>{let t=`    at ${e.methodName}`;if(e.file){let r=e.file;if(e.lineNumber){r+=`:${e.lineNumber}`;if(e.column){r+=`:${e.column}`}}t+=` (${r})`}return t})).join("\n")}`}catch{r.stack=e.stack}decorateServerError(r,t);return r}function getOriginalStackFrame(e,t,r){async function _getOriginalStackFrame(){const n=new URLSearchParams;n.append("isServer",String(t==="server"));n.append("isEdgeServer",String(t==="edge-server"));n.append("errorMessage",r);for(const t in e){n.append(t,(e[t]??"").toString())}const a=new AbortController;const o=setTimeout((()=>a.abort()),3e3);const i=await self.fetch(`${process.env.__NEXT_ROUTER_BASEPATH||""}/__nextjs_original-stack-frame?${n.toString()}`,{signal:a.signal}).finally((()=>{clearTimeout(o)}));if(!i.ok||i.status===204){return Promise.reject(new Error(await i.text()))}const l=await i.json();return{error:false,reason:null,external:false,expanded:!Boolean((e.file?.includes("node_modules")||l.originalStackFrame?.file?.includes("node_modules"))??true),sourceStackFrame:e,originalStackFrame:l.originalStackFrame,originalCodeFrame:l.originalCodeFrame||null}}if(!(e.file?.startsWith("webpack-internal:")||e.file?.startsWith("file:"))){return Promise.resolve({error:false,reason:null,external:true,expanded:false,sourceStackFrame:e,originalStackFrame:null,originalCodeFrame:null})}return _getOriginalStackFrame().catch((t=>({error:true,reason:t?.message??t?.toString()??"Unknown Error",external:false,expanded:false,sourceStackFrame:e,originalStackFrame:null,originalCodeFrame:null})))}function getOriginalStackFrames(e,t,r){return Promise.all(e.map((e=>getOriginalStackFrame(e,t,r))))}function getFrameSource(e){let t="";try{const r=new URL(e.file);if(typeof globalThis!=="undefined"&&globalThis.location?.origin!==r.origin){if(r.origin==="null"){t+=r.protocol}else{t+=r.origin}}t+=r.pathname;t+=" "}catch{t+=(e.file||"(unknown)")+" "}if(e.lineNumber!=null){if(e.column!=null){t+=`(${e.lineNumber}:${e.column}) `}else{t+=`(${e.lineNumber}) `}}return t.slice(0,-1)}async function getErrorByType(e){const{id:t,event:r}=e;switch(r.type){case o:case i:{const e={id:t,runtime:true,error:r.reason,frames:await getOriginalStackFrames(r.frames,getErrorSource(r.reason),r.reason.toString())};if(r.type===o){e.componentStack=r.componentStack}return e}default:{break}}const n=r;throw new Error("type system invariant violation")}var p=require("react");var b=__nccwpck_require__.n(p);var g=require("react-dom");const v=function Portal({children:e,globalOverlay:t}){let r=p.useRef(null);let n=p.useRef(null);let a=p.useRef(null);let[,o]=p.useState();p.useLayoutEffect((()=>{const e=t?document:r.current.ownerDocument;n.current=e.createElement("nextjs-portal");a.current=n.current.attachShadow({mode:"open"});e.body.appendChild(n.current);o({});return()=>{if(n.current&&n.current.ownerDocument){n.current.ownerDocument.body.removeChild(n.current)}}}),[t]);return a.current?(0,g.createPortal)(e,a.current):t?null:p.createElement("span",{ref:r})};function useOnClickOutside(e,t){p.useEffect((()=>{if(e==null||t==null){return}const listener=r=>{if(!e||e.contains(r.target)){return}t(r)};const r=e.getRootNode();r.addEventListener("mousedown",listener);r.addEventListener("touchstart",listener);return function(){r.removeEventListener("mousedown",listener);r.removeEventListener("touchstart",listener)}}),[t,e])}const h=function Dialog({children:e,type:t,onClose:r,...n}){const[a,o]=p.useState(null);const i=p.useCallback((e=>{o(e)}),[]);useOnClickOutside(a,r);p.useEffect((()=>{if(a==null){return}const e=a.getRootNode();if(!(e instanceof ShadowRoot)){return}const t=e;function handler(e){const r=t.activeElement;if(e.key==="Enter"&&r instanceof HTMLElement&&r.getAttribute("role")==="link"){e.preventDefault();e.stopPropagation();r.click()}}t.addEventListener("keydown",handler);return()=>t.removeEventListener("keydown",handler)}),[a]);return p.createElement("div",{ref:i,"data-nextjs-dialog":true,tabIndex:-1,role:"dialog","aria-labelledby":n["aria-labelledby"],"aria-describedby":n["aria-describedby"],"aria-modal":"true"},p.createElement("div",{"data-nextjs-dialog-banner":true,className:`banner-${t}`}),e)};const x=function DialogBody({children:e,className:t}){return p.createElement("div",{"data-nextjs-dialog-body":true,className:t},e)};const y=function DialogContent({children:e,className:t}){return p.createElement("div",{"data-nextjs-dialog-content":true,className:t},e)};const E=function DialogHeader({children:e,className:t}){return p.createElement("div",{"data-nextjs-dialog-header":true,className:t},e)};function noop(e,...t){const r=e.length-1;return e.slice(0,r).reduce(((e,r,n)=>e+r+t[n]),"")+e[r]}const w=noop`
  [data-nextjs-dialog] {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    outline: none;
    background: var(--color-background);
    border-radius: var(--size-gap);
    box-shadow: 0 var(--size-gap-half) var(--size-gap-double)
      rgba(0, 0, 0, 0.25);
    max-height: calc(100% - 56px);
    overflow-y: hidden;
  }

  @media (max-height: 812px) {
    [data-nextjs-dialog-overlay] {
      max-height: calc(100% - 15px);
    }
  }

  @media (min-width: 576px) {
    [data-nextjs-dialog] {
      max-width: 540px;
      box-shadow: 0 var(--size-gap) var(--size-gap-quad) rgba(0, 0, 0, 0.25);
    }
  }

  @media (min-width: 768px) {
    [data-nextjs-dialog] {
      max-width: 720px;
    }
  }

  @media (min-width: 992px) {
    [data-nextjs-dialog] {
      max-width: 960px;
    }
  }

  [data-nextjs-dialog-banner] {
    position: relative;
  }
  [data-nextjs-dialog-banner].banner-warning {
    border-color: var(--color-ansi-yellow);
  }
  [data-nextjs-dialog-banner].banner-error {
    border-color: var(--color-ansi-red);
  }

  [data-nextjs-dialog-banner]::after {
    z-index: 2;
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    /* banner width: */
    border-top-width: var(--size-gap-half);
    border-bottom-width: 0;
    border-top-style: solid;
    border-bottom-style: solid;
    border-top-color: inherit;
    border-bottom-color: transparent;
  }

  [data-nextjs-dialog-content] {
    overflow-y: auto;
    border: none;
    margin: 0;
    /* calc(padding + banner width offset) */
    padding: calc(var(--size-gap-double) + var(--size-gap-half))
      var(--size-gap-double);
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  [data-nextjs-dialog-content] > [data-nextjs-dialog-header] {
    flex-shrink: 0;
    margin-bottom: var(--size-gap-double);
  }
  [data-nextjs-dialog-content] > [data-nextjs-dialog-body] {
    position: relative;
    flex: 1 1 auto;
  }
`;var k=require("next/dist/compiled/platform");var S=__nccwpck_require__.n(k);var _=require("next/dist/compiled/css.escape");var T=__nccwpck_require__.n(_);function nodeArray(e){if(!e){return[]}if(Array.isArray(e)){return e}if(e.nodeType!==undefined){return[e]}if(typeof e==="string"){e=document.querySelectorAll(e)}if(e.length!==undefined){return[].slice.call(e,0)}throw new TypeError("unexpected input "+String(e))}function contextToElement(e){var t=e.context,r=e.label,n=r===undefined?"context-to-element":r,a=e.resolveDocument,o=e.defaultToDocument;var i=nodeArray(t)[0];if(a&&i&&i.nodeType===Node.DOCUMENT_NODE){i=i.documentElement}if(!i&&o){return document.documentElement}if(!i){throw new TypeError(n+" requires valid options.context")}if(i.nodeType!==Node.ELEMENT_NODE&&i.nodeType!==Node.DOCUMENT_FRAGMENT_NODE){throw new TypeError(n+" requires options.context to be an Element")}return i}function getShadowHost(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{},t=e.context;var r=contextToElement({label:"get/shadow-host",context:t});var n=null;while(r){n=r;r=r.parentNode}if(n.nodeType===n.DOCUMENT_FRAGMENT_NODE&&n.host){return n.host}return null}function getDocument(e){if(!e){return document}if(e.nodeType===Node.DOCUMENT_NODE){return e}return e.ownerDocument||document}function isActiveElement(e){var t=contextToElement({label:"is/active-element",resolveDocument:true,context:e});var r=getDocument(t);if(r.activeElement===t){return true}var n=getShadowHost({context:t});if(n&&n.shadowRoot.activeElement===t){return true}return false}function getParents(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{},t=e.context;var r=[];var n=contextToElement({label:"get/parents",context:t});while(n){r.push(n);n=n.parentNode;if(n&&n.nodeType!==Node.ELEMENT_NODE){n=null}}return r}var C=["matches","webkitMatchesSelector","mozMatchesSelector","msMatchesSelector"];var j=null;function findMethodName(e){C.some((function(t){if(!e[t]){return false}j=t;return true}))}function elementMatches(e,t){if(!j){findMethodName(e)}return e[j](t)}var A=JSON.parse(JSON.stringify(S()));var O=A.os.family||"";var N=O==="Android";var I=O.slice(0,7)==="Windows";var L=O==="OS X";var F=O==="iOS";var D=A.layout==="Blink";var M=A.layout==="Gecko";var R=A.layout==="Trident";var z=A.layout==="EdgeHTML";var B=A.layout==="WebKit";var H=parseFloat(A.version);var q=Math.floor(H);A.majorVersion=q;A.is={ANDROID:N,WINDOWS:I,OSX:L,IOS:F,BLINK:D,GECKO:M,TRIDENT:R,EDGE:z,WEBKIT:B,IE9:R&&q===9,IE10:R&&q===10,IE11:R&&q===11};function before(){var e={activeElement:document.activeElement,windowScrollTop:window.scrollTop,windowScrollLeft:window.scrollLeft,bodyScrollTop:document.body.scrollTop,bodyScrollLeft:document.body.scrollLeft};var t=document.createElement("iframe");t.setAttribute("style","position:absolute; position:fixed; top:0; left:-2px; width:1px; height:1px; overflow:hidden;");t.setAttribute("aria-live","off");t.setAttribute("aria-busy","true");t.setAttribute("aria-hidden","true");document.body.appendChild(t);var r=t.contentWindow;var n=r.document;n.open();n.close();var a=n.createElement("div");n.body.appendChild(a);e.iframe=t;e.wrapper=a;e.window=r;e.document=n;return e}function test(e,t){e.wrapper.innerHTML="";var r=typeof t.element==="string"?e.document.createElement(t.element):t.element(e.wrapper,e.document);var n=t.mutate&&t.mutate(r,e.wrapper,e.document);if(!n&&n!==false){n=r}!r.parentNode&&e.wrapper.appendChild(r);n&&n.focus&&n.focus();return t.validate?t.validate(r,n,e.document):e.document.activeElement===n}function after(e){if(e.activeElement===document.body){document.activeElement&&document.activeElement.blur&&document.activeElement.blur();if(A.is.IE10){document.body.focus()}}else{e.activeElement&&e.activeElement.focus&&e.activeElement.focus()}document.body.removeChild(e.iframe);window.scrollTop=e.windowScrollTop;window.scrollLeft=e.windowScrollLeft;document.body.scrollTop=e.bodyScrollTop;document.body.scrollLeft=e.bodyScrollLeft}function detectFocus(e){var t=before();var r={};Object.keys(e).map((function(n){r[n]=test(t,e[n])}));after(t);return r}var P="1.4.1";function readLocalStorage(e){var t=void 0;try{t=window.localStorage&&window.localStorage.getItem(e);t=t?JSON.parse(t):{}}catch(e){t={}}return t}function writeLocalStorage(e,t){if(!document.hasFocus()){try{window.localStorage&&window.localStorage.removeItem(e)}catch(e){}return}try{window.localStorage&&window.localStorage.setItem(e,JSON.stringify(t))}catch(e){}}var W=typeof window!=="undefined"&&window.navigator.userAgent||"";var V="ally-supports-cache";var $=readLocalStorage(V);if($.userAgent!==W||$.version!==P){$={}}$.userAgent=W;$.version=P;var K={get:function get(){return $},set:function set(e){Object.keys(e).forEach((function(t){$[t]=e[t]}));$.time=(new Date).toISOString();writeLocalStorage(V,$)}};function cssShadowPiercingDeepCombinator(){var e=void 0;try{document.querySelector("html >>> :first-child");e=">>>"}catch(t){try{document.querySelector("html /deep/ :first-child");e="/deep/"}catch(t){e=""}}return e}var Z="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";var U={element:"div",mutate:function mutate(e){e.innerHTML='<map name="image-map-tabindex-test">'+'<area shape="rect" coords="63,19,144,45"></map>'+'<img usemap="#image-map-tabindex-test" tabindex="-1" alt="" src="'+Z+'">';return e.querySelector("area")}};var G={element:"div",mutate:function mutate(e){e.innerHTML='<map name="image-map-tabindex-test">'+'<area href="#void" tabindex="-1" shape="rect" coords="63,19,144,45"></map>'+'<img usemap="#image-map-tabindex-test" alt="" src="'+Z+'">';return false},validate:function validate(e,t,r){if(A.is.GECKO){return true}var n=e.querySelector("area");n.focus();return r.activeElement===n}};var X={element:"div",mutate:function mutate(e){e.innerHTML='<map name="image-map-area-href-test">'+'<area shape="rect" coords="63,19,144,45"></map>'+'<img usemap="#image-map-area-href-test" alt="" src="'+Z+'">';return e.querySelector("area")},validate:function validate(e,t,r){if(A.is.GECKO){return true}return r.activeElement===t}};var J={name:"can-focus-audio-without-controls",element:"audio",mutate:function mutate(e){try{e.setAttribute("src",Z)}catch(e){}}};var Q="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ";var Y={element:"div",mutate:function mutate(e){e.innerHTML='<map name="broken-image-map-test"><area href="#void" shape="rect" coords="63,19,144,45"></map>'+'<img usemap="#broken-image-map-test" alt="" src="'+Q+'">';return e.querySelector("area")}};var ee={element:"div",mutate:function mutate(e){e.setAttribute("tabindex","-1");e.setAttribute("style","display: -webkit-flex; display: -ms-flexbox; display: flex;");e.innerHTML='<span style="display: block;">hello</span>';return e.querySelector("span")}};var te={element:"fieldset",mutate:function mutate(e){e.setAttribute("tabindex",0);e.setAttribute("disabled","disabled")}};var re={element:"fieldset",mutate:function mutate(e){e.innerHTML="<legend>legend</legend><p>content</p>"}};var ne={element:"span",mutate:function mutate(e){e.setAttribute("style","display: -webkit-flex; display: -ms-flexbox; display: flex;");e.innerHTML='<span style="display: block;">hello</span>'}};var ae={element:"form",mutate:function mutate(e){e.setAttribute("tabindex",0);e.setAttribute("disabled","disabled")}};var oe={element:"a",mutate:function mutate(e){e.href="#void";e.innerHTML='<img ismap src="'+Z+'" alt="">';return e.querySelector("img")}};var ie={element:"div",mutate:function mutate(e){e.innerHTML='<map name="image-map-tabindex-test"><area href="#void" shape="rect" coords="63,19,144,45"></map>'+'<img usemap="#image-map-tabindex-test" tabindex="-1" alt="" '+'src="'+Z+'">';return e.querySelector("img")}};var le={element:function element(e,t){var r=t.createElement("iframe");e.appendChild(r);var n=r.contentWindow.document;n.open();n.close();return r},mutate:function mutate(e){e.style.visibility="hidden";var t=e.contentWindow.document;var r=t.createElement("input");t.body.appendChild(r);return r},validate:function validate(e){var t=e.contentWindow.document;var r=t.querySelector("input");return t.activeElement===r}};var se=!A.is.WEBKIT;function focusInZeroDimensionObject(){return se}var ue={element:"div",mutate:function mutate(e){e.setAttribute("tabindex","invalid-value")}};var ce={element:"label",mutate:function mutate(e){e.setAttribute("tabindex","-1")},validate:function validate(e,t,r){var n=e.offsetHeight;e.focus();return r.activeElement===e}};var de="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtb"+"G5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBpZD0ic3ZnIj48dGV4dCB4PSIxMCIgeT0iMjAiIGlkPSJ"+"zdmctbGluay10ZXh0Ij50ZXh0PC90ZXh0Pjwvc3ZnPg==";var fe={element:"object",mutate:function mutate(e){e.setAttribute("type","image/svg+xml");e.setAttribute("data",de);e.setAttribute("width","200");e.setAttribute("height","50");e.style.visibility="hidden"}};var me={name:"can-focus-object-svg",element:"object",mutate:function mutate(e){e.setAttribute("type","image/svg+xml");e.setAttribute("data",de);e.setAttribute("width","200");e.setAttribute("height","50")},validate:function validate(e,t,r){if(A.is.GECKO){return true}return r.activeElement===e}};var pe=!A.is.IE9;function focusObjectSwf(){return pe}var be={element:"div",mutate:function mutate(e){e.innerHTML='<map name="focus-redirect-img-usemap"><area href="#void" shape="rect" coords="63,19,144,45"></map>'+'<img usemap="#focus-redirect-img-usemap" alt="" '+'src="'+Z+'">';return e.querySelector("img")},validate:function validate(e,t,r){var n=e.querySelector("area");return r.activeElement===n}};var ge={element:"fieldset",mutate:function mutate(e){e.innerHTML='<legend>legend</legend><input tabindex="-1"><input tabindex="0">';return false},validate:function validate(e,t,r){var n=e.querySelector('input[tabindex="-1"]');var a=e.querySelector('input[tabindex="0"]');e.focus();e.querySelector("legend").focus();return r.activeElement===n&&"focusable"||r.activeElement===a&&"tabbable"||""}};var ve={element:"div",mutate:function mutate(e){e.setAttribute("style","width: 100px; height: 50px; overflow: auto;");e.innerHTML='<div style="width: 500px; height: 40px;">scrollable content</div>';return e.querySelector("div")}};var he={element:"div",mutate:function mutate(e){e.setAttribute("style","width: 100px; height: 50px;");e.innerHTML='<div style="width: 500px; height: 40px;">scrollable content</div>'}};var xe={element:"div",mutate:function mutate(e){e.setAttribute("style","width: 100px; height: 50px; overflow: auto;");e.innerHTML='<div style="width: 500px; height: 40px;">scrollable content</div>'}};var ye={element:"details",mutate:function mutate(e){e.innerHTML="<summary>foo</summary><p>content</p>";return e.firstElementChild}};function makeFocusableForeignObject(){var e=document.createElementNS("http://www.w3.org/2000/svg","foreignObject");e.width.baseVal.value=30;e.height.baseVal.value=30;e.appendChild(document.createElement("input"));e.lastChild.type="text";return e}function focusSvgForeignObjectHack(e){var t=e.ownerSVGElement||e.nodeName.toLowerCase()==="svg";if(!t){return false}var r=makeFocusableForeignObject();e.appendChild(r);var n=r.querySelector("input");n.focus();n.disabled=true;e.removeChild(r);return true}function generate(e){return'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'+e+"</svg>"}function maintain_tab_focus_focus(e){if(e.focus){return}try{HTMLElement.prototype.focus.call(e)}catch(t){focusSvgForeignObjectHack(e)}}function validate(e,t,r){maintain_tab_focus_focus(t);return r.activeElement===t}var Ee={element:"div",mutate:function mutate(e){e.innerHTML=generate('<text focusable="true">a</text>');return e.querySelector("text")},validate:validate};var we={element:"div",mutate:function mutate(e){e.innerHTML=generate('<text tabindex="0">a</text>');return e.querySelector("text")},validate:validate};var ke={element:"div",mutate:function mutate(e){e.innerHTML=generate('<text tabindex="-1">a</text>');return e.querySelector("text")},validate:validate};var Se={element:"div",mutate:function mutate(e){e.innerHTML=generate(['<g id="ally-test-target"><a xlink:href="#void"><text>link</text></a></g>','<use xlink:href="#ally-test-target" x="0" y="0" tabindex="-1" />'].join(""));return e.querySelector("use")},validate:validate};var _e={element:"div",mutate:function mutate(e){e.innerHTML=generate('<foreignObject tabindex="-1"><input type="text" /></foreignObject>');return e.querySelector("foreignObject")||e.getElementsByTagName("foreignObject")[0]},validate:validate};var Te=Boolean(A.is.GECKO&&typeof SVGElement!=="undefined"&&SVGElement.prototype.focus);function focusSvgInIframe(){return Te}var Ce={element:"div",mutate:function mutate(e){e.innerHTML=generate("");return e.firstChild},validate:validate};var je={element:"div",mutate:function mutate(e){e.setAttribute("tabindex","3x")}};var Ae={element:"table",mutate:function mutate(e,t,r){var n=r.createDocumentFragment();n.innerHTML="<tr><td>cell</td></tr>";e.appendChild(n)}};var Oe={element:"video",mutate:function mutate(e){try{e.setAttribute("src",Z)}catch(e){}}};var Ne=A.is.GECKO||A.is.TRIDENT||A.is.EDGE;function tabsequenceAreaAtImgPosition(){return Ne}var Ie={cssShadowPiercingDeepCombinator:cssShadowPiercingDeepCombinator,focusInZeroDimensionObject:focusInZeroDimensionObject,focusObjectSwf:focusObjectSwf,focusSvgInIframe:focusSvgInIframe,tabsequenceAreaAtImgPosition:tabsequenceAreaAtImgPosition};var Le={focusAreaImgTabindex:U,focusAreaTabindex:G,focusAreaWithoutHref:X,focusAudioWithoutControls:J,focusBrokenImageMap:Y,focusChildrenOfFocusableFlexbox:ee,focusFieldsetDisabled:te,focusFieldset:re,focusFlexboxContainer:ne,focusFormDisabled:ae,focusImgIsmap:oe,focusImgUsemapTabindex:ie,focusInHiddenIframe:le,focusInvalidTabindex:ue,focusLabelTabindex:ce,focusObjectSvg:me,focusObjectSvgHidden:fe,focusRedirectImgUsemap:be,focusRedirectLegend:ge,focusScrollBody:ve,focusScrollContainerWithoutOverflow:he,focusScrollContainer:xe,focusSummary:ye,focusSvgFocusableAttribute:Ee,focusSvgTabindexAttribute:we,focusSvgNegativeTabindexAttribute:ke,focusSvgUseTabindex:Se,focusSvgForeignobjectTabindex:_e,focusSvg:Ce,focusTabindexTrailingCharacters:je,focusTable:Ae,focusVideoWithoutControls:Oe};function executeTests(){var e=detectFocus(Le);Object.keys(Ie).forEach((function(t){e[t]=Ie[t]()}));return e}var Fe=null;function _supports(){if(Fe){return Fe}Fe=K.get();if(!Fe.time){K.set(executeTests());Fe=K.get()}return Fe}var De=void 0;var Me=/^\s*(-|\+)?[0-9]+\s*$/;var Re=/^\s*(-|\+)?[0-9]+.*$/;function isValidTabindex(e){if(!De){De=_supports()}var t=De.focusTabindexTrailingCharacters?Re:Me;var r=contextToElement({label:"is/valid-tabindex",resolveDocument:true,context:e});var n=r.hasAttribute("tabindex");var a=r.hasAttribute("tabIndex");if(!n&&!a){return false}var o=r.ownerSVGElement||r.nodeName.toLowerCase()==="svg";if(o&&!De.focusSvgTabindexAttribute){return false}if(De.focusInvalidTabindex){return true}var i=r.getAttribute(n?"tabindex":"tabIndex");if(i==="-32768"){return false}return Boolean(i&&t.test(i))}function tabindexValue(e){if(!isValidTabindex(e)){return null}var t=e.hasAttribute("tabindex");var r=t?"tabindex":"tabIndex";var n=parseInt(e.getAttribute(r),10);return isNaN(n)?-1:n}function isUserModifyWritable(e){var t=e.webkitUserModify||"";return Boolean(t&&t.indexOf("write")!==-1)}function hasCssOverflowScroll(e){return[e.getPropertyValue("overflow"),e.getPropertyValue("overflow-x"),e.getPropertyValue("overflow-y")].some((function(e){return e==="auto"||e==="scroll"}))}function hasCssDisplayFlex(e){return e.display.indexOf("flex")>-1}function isScrollableContainer(e,t,r,n){if(t!=="div"&&t!=="span"){return false}if(r&&r!=="div"&&r!=="span"&&!hasCssOverflowScroll(n)){return false}return e.offsetHeight<e.scrollHeight||e.offsetWidth<e.scrollWidth}var ze=void 0;function isFocusRelevantRules(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{},t=e.context,r=e.except,n=r===undefined?{flexbox:false,scrollable:false,shadow:false}:r;if(!ze){ze=_supports()}var a=contextToElement({label:"is/focus-relevant",resolveDocument:true,context:t});if(!n.shadow&&a.shadowRoot){return true}var o=a.nodeName.toLowerCase();if(o==="input"&&a.type==="hidden"){return false}if(o==="input"||o==="select"||o==="button"||o==="textarea"){return true}if(o==="legend"&&ze.focusRedirectLegend){return true}if(o==="label"){return true}if(o==="area"){return true}if(o==="a"&&a.hasAttribute("href")){return true}if(o==="object"&&a.hasAttribute("usemap")){return false}if(o==="object"){var i=a.getAttribute("type");if(!ze.focusObjectSvg&&i==="image/svg+xml"){return false}else if(!ze.focusObjectSwf&&i==="application/x-shockwave-flash"){return false}}if(o==="iframe"||o==="object"){return true}if(o==="embed"||o==="keygen"){return true}if(a.hasAttribute("contenteditable")){return true}if(o==="audio"&&(ze.focusAudioWithoutControls||a.hasAttribute("controls"))){return true}if(o==="video"&&(ze.focusVideoWithoutControls||a.hasAttribute("controls"))){return true}if(ze.focusSummary&&o==="summary"){return true}var l=isValidTabindex(a);if(o==="img"&&a.hasAttribute("usemap")){return l&&ze.focusImgUsemapTabindex||ze.focusRedirectImgUsemap}if(ze.focusTable&&(o==="table"||o==="td")){return true}if(ze.focusFieldset&&o==="fieldset"){return true}var s=o==="svg";var u=a.ownerSVGElement;var c=a.getAttribute("focusable");var d=tabindexValue(a);if(o==="use"&&d!==null&&!ze.focusSvgUseTabindex){return false}if(o==="foreignobject"){return d!==null&&ze.focusSvgForeignobjectTabindex}if(elementMatches(a,"svg a")&&a.hasAttribute("xlink:href")){return true}if((s||u)&&a.focus&&!ze.focusSvgNegativeTabindexAttribute&&d<0){return false}if(s){return l||ze.focusSvg||ze.focusSvgInIframe||Boolean(ze.focusSvgFocusableAttribute&&c&&c==="true")}if(u){if(ze.focusSvgTabindexAttribute&&l){return true}if(ze.focusSvgFocusableAttribute){return c==="true"}}if(l){return true}var f=window.getComputedStyle(a,null);if(isUserModifyWritable(f)){return true}if(ze.focusImgIsmap&&o==="img"&&a.hasAttribute("ismap")){var m=getParents({context:a}).some((function(e){return e.nodeName.toLowerCase()==="a"&&e.hasAttribute("href")}));if(m){return true}}if(!n.scrollable&&ze.focusScrollContainer){if(ze.focusScrollContainerWithoutOverflow){if(isScrollableContainer(a,o)){return true}}else if(hasCssOverflowScroll(f)){return true}}if(!n.flexbox&&ze.focusFlexboxContainer&&hasCssDisplayFlex(f)){return true}var p=a.parentElement;if(!n.scrollable&&p){var b=p.nodeName.toLowerCase();var g=window.getComputedStyle(p,null);if(ze.focusScrollBody&&isScrollableContainer(p,o,b,g)){return true}if(ze.focusChildrenOfFocusableFlexbox){if(hasCssDisplayFlex(g)){return true}}}return false}isFocusRelevantRules.except=function(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var t=function isFocusRelevant(t){return isFocusRelevantRules({context:t,except:e})};t.rules=isFocusRelevantRules;return t};var Be=isFocusRelevantRules.except({});function findIndex(e,t){if(e.findIndex){return e.findIndex(t)}var r=e.length;if(r===0){return-1}for(var n=0;n<r;n++){if(t(e[n],n,e)){return n}}return-1}function getContentDocument(e){try{return e.contentDocument||e.contentWindow&&e.contentWindow.document||e.getSVGDocument&&e.getSVGDocument()||null}catch(e){return null}}function getWindow(e){var t=getDocument(e);return t.defaultView||window}var He=void 0;function selectInShadows(e){if(typeof He!=="string"){var t=cssShadowPiercingDeepCombinator();if(t){He=", html "+t+" "}}if(!He){return e}return e+He+e.replace(/\s*,\s*/g,",").split(",").join(He)}var qe=void 0;function findDocumentHostElement(e){if(!qe){qe=selectInShadows("object, iframe")}if(e._frameElement!==undefined){return e._frameElement}e._frameElement=null;var t=e.parent.document.querySelectorAll(qe);[].some.call(t,(function(t){var r=getContentDocument(t);if(r!==e.document){return false}e._frameElement=t;return true}));return e._frameElement}function getFrameElement(e){var t=getWindow(e);if(!t.parent||t.parent===t){return null}try{return t.frameElement||findDocumentHostElement(t)}catch(e){return null}}var Pe=/^(area)$/;function computedStyle(e,t){return window.getComputedStyle(e,null).getPropertyValue(t)}function notDisplayed(e){return e.some((function(e){return computedStyle(e,"display")==="none"}))}function notVisible(e){var t=findIndex(e,(function(e){var t=computedStyle(e,"visibility");return t==="hidden"||t==="collapse"}));if(t===-1){return false}var r=findIndex(e,(function(e){return computedStyle(e,"visibility")==="visible"}));if(r===-1){return true}if(t<r){return true}return false}function collapsedParent(e){var t=1;if(e[0].nodeName.toLowerCase()==="summary"){t=2}return e.slice(t).some((function(e){return e.nodeName.toLowerCase()==="details"&&e.open===false}))}function isVisibleRules(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{},t=e.context,r=e.except,n=r===undefined?{notRendered:false,cssDisplay:false,cssVisibility:false,detailsElement:false,browsingContext:false}:r;var a=contextToElement({label:"is/visible",resolveDocument:true,context:t});var o=a.nodeName.toLowerCase();if(!n.notRendered&&Pe.test(o)){return true}var i=getParents({context:a});var l=o==="audio"&&!a.hasAttribute("controls");if(!n.cssDisplay&&notDisplayed(l?i.slice(1):i)){return false}if(!n.cssVisibility&&notVisible(i)){return false}if(!n.detailsElement&&collapsedParent(i)){return false}if(!n.browsingContext){var s=getFrameElement(a);var u=isVisibleRules.except(n);if(s&&!u(s)){return false}}return true}isVisibleRules.except=function(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var t=function isVisible(t){return isVisibleRules({context:t,except:e})};t.rules=isVisibleRules;return t};var We=isVisibleRules.except({});function getMapByName(e,t){var r=t.querySelector('map[name="'+T()(e)+'"]');return r||null}function getImageOfArea(e){var t=e.parentElement;if(!t.name||t.nodeName.toLowerCase()!=="map"){return null}var r=getDocument(e);return r.querySelector('img[usemap="#'+T()(t.name)+'"]')||null}var Ve=void 0;function isValidArea(e){if(!Ve){Ve=_supports()}var t=contextToElement({label:"is/valid-area",context:e});var r=t.nodeName.toLowerCase();if(r!=="area"){return false}var n=t.hasAttribute("tabindex");if(!Ve.focusAreaTabindex&&n){return false}var a=getImageOfArea(t);if(!a||!We(a)){return false}if(!Ve.focusBrokenImageMap&&(!a.complete||!a.naturalHeight||a.offsetWidth<=0||a.offsetHeight<=0)){return false}if(!Ve.focusAreaWithoutHref&&!t.href){return Ve.focusAreaTabindex&&n||Ve.focusAreaImgTabindex&&a.hasAttribute("tabindex")}var o=getParents({context:a}).slice(1).some((function(e){var t=e.nodeName.toLowerCase();return t==="button"||t==="a"}));if(o){return false}return true}var $e=void 0;var Ke=void 0;var Ze={input:true,select:true,textarea:true,button:true,fieldset:true,form:true};function isNativeDisabledSupported(e){if(!$e){$e=_supports();if($e.focusFieldsetDisabled){delete Ze.fieldset}if($e.focusFormDisabled){delete Ze.form}Ke=new RegExp("^("+Object.keys(Ze).join("|")+")$")}var t=contextToElement({label:"is/native-disabled-supported",context:e});var r=t.nodeName.toLowerCase();return Boolean(Ke.test(r))}var Ue=void 0;function isDisabledFieldset(e){var t=e.nodeName.toLowerCase();return t==="fieldset"&&e.disabled}function isDisabledForm(e){var t=e.nodeName.toLowerCase();return t==="form"&&e.disabled}function isDisabled(e){if(!Ue){Ue=_supports()}var t=contextToElement({label:"is/disabled",context:e});if(t.hasAttribute("data-ally-disabled")){return true}if(!isNativeDisabledSupported(t)){return false}if(t.disabled){return true}var r=getParents({context:t});if(r.some(isDisabledFieldset)){return true}if(!Ue.focusFormDisabled&&r.some(isDisabledForm)){return true}return false}function isOnlyTabbableRules(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{},t=e.context,r=e.except,n=r===undefined?{onlyFocusableBrowsingContext:false,visible:false}:r;var a=contextToElement({label:"is/only-tabbable",resolveDocument:true,context:t});if(!n.visible&&!We(a)){return false}if(!n.onlyFocusableBrowsingContext&&(A.is.GECKO||A.is.TRIDENT||A.is.EDGE)){var o=getFrameElement(a);if(o){if(tabindexValue(o)<0){return false}}}var i=a.nodeName.toLowerCase();var l=tabindexValue(a);if(i==="label"&&A.is.GECKO){return l!==null&&l>=0}if(A.is.GECKO&&a.ownerSVGElement&&!a.focus){if(i==="a"&&a.hasAttribute("xlink:href")){if(A.is.GECKO){return true}}}return false}isOnlyTabbableRules.except=function(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var t=function isOnlyTabbable(t){return isOnlyTabbableRules({context:t,except:e})};t.rules=isOnlyTabbableRules;return t};var Ge=isOnlyTabbableRules.except({});var Xe=void 0;function isOnlyFocusRelevant(e){var t=e.nodeName.toLowerCase();if(t==="embed"||t==="keygen"){return true}var r=tabindexValue(e);if(e.shadowRoot&&r===null){return true}if(t==="label"){return!Xe.focusLabelTabindex||r===null}if(t==="legend"){return r===null}if(Xe.focusSvgFocusableAttribute&&(e.ownerSVGElement||t==="svg")){var n=e.getAttribute("focusable");return n&&n==="false"}if(t==="img"&&e.hasAttribute("usemap")){return r===null||!Xe.focusImgUsemapTabindex}if(t==="area"){return!isValidArea(e)}return false}function isFocusableRules(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{},t=e.context,r=e.except,n=r===undefined?{disabled:false,visible:false,onlyTabbable:false}:r;if(!Xe){Xe=_supports()}var a=Ge.rules.except({onlyFocusableBrowsingContext:true,visible:n.visible});var o=contextToElement({label:"is/focusable",resolveDocument:true,context:t});var i=Be.rules({context:o,except:n});if(!i||isOnlyFocusRelevant(o)){return false}if(!n.disabled&&isDisabled(o)){return false}if(!n.onlyTabbable&&a(o)){return false}if(!n.visible){var l={context:o,except:{}};if(Xe.focusInHiddenIframe){l.except.browsingContext=true}if(Xe.focusObjectSvgHidden){var s=o.nodeName.toLowerCase();if(s==="object"){l.except.cssVisibility=true}}if(!We.rules(l)){return false}}var u=getFrameElement(o);if(u){var c=u.nodeName.toLowerCase();if(c==="object"&&!Xe.focusInZeroDimensionObject){if(!u.offsetWidth||!u.offsetHeight){return false}}}var d=o.nodeName.toLowerCase();if(d==="svg"&&Xe.focusSvgInIframe&&!u&&o.getAttribute("tabindex")===null){return false}return true}isFocusableRules.except=function(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var t=function isFocusable(t){return isFocusableRules({context:t,except:e})};t.rules=isFocusableRules;return t};var Je=isFocusableRules.except({});function createFilter(e){var t=function filter(t){if(t.shadowRoot){return NodeFilter.FILTER_ACCEPT}if(e(t)){return NodeFilter.FILTER_ACCEPT}return NodeFilter.FILTER_SKIP};t.acceptNode=t;return t}var Qe=createFilter(Be);function queryFocusableStrict(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{},t=e.context,r=e.includeContext,n=e.includeOnlyTabbable,a=e.strategy;if(!t){t=document.documentElement}var o=Je.rules.except({onlyTabbable:n});var i=getDocument(t);var l=i.createTreeWalker(t,NodeFilter.SHOW_ELEMENT,a==="all"?Qe:createFilter(o),false);var s=[];while(l.nextNode()){if(l.currentNode.shadowRoot){if(o(l.currentNode)){s.push(l.currentNode)}s=s.concat(queryFocusableStrict({context:l.currentNode.shadowRoot,includeOnlyTabbable:n,strategy:a}))}else{s.push(l.currentNode)}}if(r){if(a==="all"){if(Be(t)){s.unshift(t)}}else if(o(t)){s.unshift(t)}}return s}var Ye=void 0;var et=void 0;function selector$2(){if(!Ye){Ye=_supports()}if(typeof et==="string"){return et}et=""+(Ye.focusTable?"table, td,":"")+(Ye.focusFieldset?"fieldset,":"")+"svg a,"+"a[href],"+"area[href],"+"input, select, textarea, button,"+"iframe, object, embed,"+"keygen,"+(Ye.focusAudioWithoutControls?"audio,":"audio[controls],")+(Ye.focusVideoWithoutControls?"video,":"video[controls],")+(Ye.focusSummary?"summary,":"")+"[tabindex],"+"[contenteditable]";et=selectInShadows(et);return et}function queryFocusableQuick(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{},t=e.context,r=e.includeContext,n=e.includeOnlyTabbable;var a=selector$2();var o=t.querySelectorAll(a);var i=Je.rules.except({onlyTabbable:n});var l=[].filter.call(o,i);if(r&&i(t)){l.unshift(t)}return l}function queryFocusable(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{},t=e.context,r=e.includeContext,n=e.includeOnlyTabbable,a=e.strategy,o=a===undefined?"quick":a;var i=contextToElement({label:"query/focusable",resolveDocument:true,defaultToDocument:true,context:t});var l={context:i,includeContext:r,includeOnlyTabbable:n,strategy:o};if(o==="quick"){return queryFocusableQuick(l)}else if(o==="strict"||o==="all"){return queryFocusableStrict(l)}throw new TypeError('query/focusable requires option.strategy to be one of ["quick", "strict", "all"]')}var tt=void 0;var rt=/^(fieldset|table|td|body)$/;function isTabbableRules(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{},t=e.context,r=e.except,n=r===undefined?{flexbox:false,scrollable:false,shadow:false,visible:false,onlyTabbable:false}:r;if(!tt){tt=_supports()}var a=contextToElement({label:"is/tabbable",resolveDocument:true,context:t});if(A.is.BLINK&&A.is.ANDROID&&A.majorVersion>42){return false}var o=getFrameElement(a);if(o){if(A.is.WEBKIT&&A.is.IOS){return false}if(tabindexValue(o)<0){return false}if(!n.visible&&(A.is.BLINK||A.is.WEBKIT)&&!We(o)){return false}var i=o.nodeName.toLowerCase();if(i==="object"){var l=A.name==="Chrome"&&A.majorVersion>=54||A.name==="Opera"&&A.majorVersion>=41;if(A.is.WEBKIT||A.is.BLINK&&!l){return false}}}var s=a.nodeName.toLowerCase();var u=tabindexValue(a);var c=u===null?null:u>=0;if(A.is.EDGE&&A.majorVersion>=14&&o&&a.ownerSVGElement&&u<0){return true}var d=c!==false;var f=u!==null&&u>=0;if(a.hasAttribute("contenteditable")){return d}if(rt.test(s)&&c!==true){return false}if(A.is.WEBKIT&&A.is.IOS){var m=s==="input"&&a.type==="text"||a.type==="password"||s==="select"||s==="textarea"||a.hasAttribute("contenteditable");if(!m){var p=window.getComputedStyle(a,null);m=isUserModifyWritable(p)}if(!m){return false}}if(s==="use"&&u!==null){if(A.is.BLINK||A.is.WEBKIT&&A.majorVersion===9){return true}}if(elementMatches(a,"svg a")&&a.hasAttribute("xlink:href")){if(d){return true}if(a.focus&&!tt.focusSvgNegativeTabindexAttribute){return true}}if(s==="svg"&&tt.focusSvgInIframe&&d){return true}if(A.is.TRIDENT||A.is.EDGE){if(s==="svg"){if(tt.focusSvg){return true}return a.hasAttribute("focusable")||f}if(a.ownerSVGElement){if(tt.focusSvgTabindexAttribute&&f){return true}return a.hasAttribute("focusable")}}if(a.tabIndex===undefined){return Boolean(n.onlyTabbable)}if(s==="audio"){if(!a.hasAttribute("controls")){return false}else if(A.is.BLINK){return true}}if(s==="video"){if(!a.hasAttribute("controls")){if(A.is.TRIDENT||A.is.EDGE){return false}}else if(A.is.BLINK||A.is.GECKO){return true}}if(s==="object"){if(A.is.BLINK||A.is.WEBKIT){return false}}if(s==="iframe"){return false}if(!n.scrollable&&A.is.GECKO){var b=window.getComputedStyle(a,null);if(hasCssOverflowScroll(b)){return d}}if(A.is.TRIDENT||A.is.EDGE){if(s==="area"){var g=getImageOfArea(a);if(g&&tabindexValue(g)<0){return false}}var v=window.getComputedStyle(a,null);if(isUserModifyWritable(v)){return a.tabIndex>=0}if(!n.flexbox&&hasCssDisplayFlex(v)){if(u!==null){return f}return nt(a)&&at(a)}if(isScrollableContainer(a,s)){return false}var h=a.parentElement;if(h){var x=h.nodeName.toLowerCase();var y=window.getComputedStyle(h,null);if(isScrollableContainer(h,s,x,y)){return false}if(hasCssDisplayFlex(y)){return f}}}return a.tabIndex>=0}isTabbableRules.except=function(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var t=function isTabbable(t){return isTabbableRules({context:t,except:e})};t.rules=isTabbableRules;return t};var nt=Be.rules.except({flexbox:true});var at=isTabbableRules.except({flexbox:true});var ot=isTabbableRules.except({});function queryTabbable(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{},t=e.context,r=e.includeContext,n=e.includeOnlyTabbable,a=e.strategy;var o=ot.rules.except({onlyTabbable:n});return queryFocusable({context:t,includeContext:r,includeOnlyTabbable:n,strategy:a}).filter(o)}function compareDomPosition(e,t){return e.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1}function sortDomOrder(e){return e.sort(compareDomPosition)}function getFirstSuccessorOffset(e,t){return findIndex(e,(function(e){return t.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_FOLLOWING}))}function findInsertionOffsets(e,t,r){var n=[];t.forEach((function(t){var a=true;var o=e.indexOf(t);if(o===-1){o=getFirstSuccessorOffset(e,t);a=false}if(o===-1){o=e.length}var i=nodeArray(r?r(t):t);if(!i.length){return}n.push({offset:o,replace:a,elements:i})}));return n}function insertElementsAtOffsets(e,t){var r=0;t.sort((function(e,t){return e.offset-t.offset}));t.forEach((function(t){var n=t.replace?1:0;var a=[t.offset+r,n].concat(t.elements);e.splice.apply(e,a);r+=t.elements.length-n}))}function mergeInDomOrder(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{},t=e.list,r=e.elements,n=e.resolveElement;var a=t.slice(0);var o=nodeArray(r).slice(0);sortDomOrder(o);var i=findInsertionOffsets(a,o,n);insertElementsAtOffsets(a,i);return a}var it=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||false;n.configurable=true;if("value"in n)n.writable=true;Object.defineProperty(e,n.key,n)}}return function(e,t,r){if(t)defineProperties(e.prototype,t);if(r)defineProperties(e,r);return e}}();function _classCallCheck(e,t){if(!(e instanceof t)){throw new TypeError("Cannot call a class as a function")}}var lt=function(){function Maps(e){_classCallCheck(this,Maps);this._document=getDocument(e);this.maps={}}it(Maps,[{key:"getAreasFor",value:function getAreasFor(e){if(!this.maps[e]){this.addMapByName(e)}return this.maps[e]}},{key:"addMapByName",value:function addMapByName(e){var t=getMapByName(e,this._document);if(!t){return}this.maps[t.name]=queryTabbable({context:t})}},{key:"extractAreasFromList",value:function extractAreasFromList(e){return e.filter((function(e){var t=e.nodeName.toLowerCase();if(t!=="area"){return true}var r=e.parentNode;if(!this.maps[r.name]){this.maps[r.name]=[]}this.maps[r.name].push(e);return false}),this)}}]);return Maps}();function sortArea(e,t){var r=t.querySelectorAll("img[usemap]");var n=new lt(t);var a=n.extractAreasFromList(e);if(!r.length){return a}return mergeInDomOrder({list:a,elements:r,resolveElement:function resolveElement(e){var t=e.getAttribute("usemap").slice(1);return n.getAreasFor(t)}})}var st=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||false;n.configurable=true;if("value"in n)n.writable=true;Object.defineProperty(e,n.key,n)}}return function(e,t,r){if(t)defineProperties(e.prototype,t);if(r)defineProperties(e,r);return e}}();function _classCallCheck$1(e,t){if(!(e instanceof t)){throw new TypeError("Cannot call a class as a function")}}var ut=function(){function Shadows(e,t){_classCallCheck$1(this,Shadows);this.context=e;this.sortElements=t;this.hostCounter=1;this.inHost={};this.inDocument=[];this.hosts={};this.elements={}}st(Shadows,[{key:"_registerHost",value:function _registerHost(e){if(e._sortingId){return}e._sortingId="shadow-"+this.hostCounter++;this.hosts[e._sortingId]=e;var t=getShadowHost({context:e});if(t){this._registerHost(t);this._registerHostParent(e,t)}else{this.inDocument.push(e)}}},{key:"_registerHostParent",value:function _registerHostParent(e,t){if(!this.inHost[t._sortingId]){this.inHost[t._sortingId]=[]}this.inHost[t._sortingId].push(e)}},{key:"_registerElement",value:function _registerElement(e,t){if(!this.elements[t._sortingId]){this.elements[t._sortingId]=[]}this.elements[t._sortingId].push(e)}},{key:"extractElements",value:function extractElements(e){return e.filter((function(e){var t=getShadowHost({context:e});if(!t){return true}this._registerHost(t);this._registerElement(e,t);return false}),this)}},{key:"sort",value:function sort(e){var t=this._injectHosts(e);t=this._replaceHosts(t);this._cleanup();return t}},{key:"_injectHosts",value:function _injectHosts(e){Object.keys(this.hosts).forEach((function(e){var t=this.elements[e];var r=this.inHost[e];var n=this.hosts[e].shadowRoot;this.elements[e]=this._merge(t,r,n)}),this);return this._merge(e,this.inDocument,this.context)}},{key:"_merge",value:function _merge(e,t,r){var n=mergeInDomOrder({list:e,elements:t});return this.sortElements(n,r)}},{key:"_replaceHosts",value:function _replaceHosts(e){return mergeInDomOrder({list:e,elements:this.inDocument,resolveElement:this._resolveHostElement.bind(this)})}},{key:"_resolveHostElement",value:function _resolveHostElement(e){var t=mergeInDomOrder({list:this.elements[e._sortingId],elements:this.inHost[e._sortingId],resolveElement:this._resolveHostElement.bind(this)});var r=tabindexValue(e);if(r!==null&&r>-1){return[e].concat(t)}return t}},{key:"_cleanup",value:function _cleanup(){Object.keys(this.hosts).forEach((function(e){delete this.hosts[e]._sortingId}),this)}}]);return Shadows}();function sortShadowed(e,t,r){var n=new ut(t,r);var a=n.extractElements(e);if(a.length===e.length){return r(e)}return n.sort(a)}function sortTabindex(e){var t={};var r=[];var n=e.filter((function(e){var n=e.tabIndex;if(n===undefined){n=tabindexValue(e)}if(n<=0||n===null||n===undefined){return true}if(!t[n]){t[n]=[];r.push(n)}t[n].push(e);return false}));var a=r.sort().map((function(e){return t[e]})).reduceRight((function(e,t){return t.concat(e)}),n);return a}var ct=void 0;function moveContextToBeginning(e,t){var r=e.indexOf(t);if(r>0){var n=e.splice(r,1);return n.concat(e)}return e}function sortElements(e,t){if(ct.tabsequenceAreaAtImgPosition){e=sortArea(e,t)}e=sortTabindex(e);return e}function queryTabsequence(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{},t=e.context,r=e.includeContext,n=e.includeOnlyTabbable,a=e.strategy;if(!ct){ct=_supports()}var o=nodeArray(t)[0]||document.documentElement;var i=queryTabbable({context:o,includeContext:r,includeOnlyTabbable:n,strategy:a});if(document.body.createShadowRoot&&A.is.BLINK){i=sortShadowed(i,o,sortElements)}else{i=sortElements(i,o)}if(r){i=moveContextToBeginning(i,o)}return i}var dt={tab:9,left:37,up:38,right:39,down:40,pageUp:33,"page-up":33,pageDown:34,"page-down":34,end:35,home:36,enter:13,escape:27,space:32,shift:16,capsLock:20,"caps-lock":20,ctrl:17,alt:18,meta:91,pause:19,insert:45,delete:46,backspace:8,_alias:{91:[92,93,224]}};for(var ft=1;ft<26;ft++){dt["f"+ft]=ft+111}for(var mt=0;mt<10;mt++){var pt=mt+48;var bt=mt+96;dt[mt]=pt;dt["num-"+mt]=bt;dt._alias[pt]=[bt]}for(var gt=0;gt<26;gt++){var vt=gt+65;var ht=String.fromCharCode(vt).toLowerCase();dt[ht]=vt}var xt={alt:"altKey",ctrl:"ctrlKey",meta:"metaKey",shift:"shiftKey"};var yt=Object.keys(xt).map((function(e){return xt[e]}));function createExpectedModifiers(e){var t=e?null:false;return{altKey:t,ctrlKey:t,metaKey:t,shiftKey:t}}function resolveModifiers(e){var t=e.indexOf("*")!==-1;var r=createExpectedModifiers(t);e.forEach((function(e){if(e==="*"){return}var t=true;var n=e.slice(0,1);if(n==="?"){t=null}else if(n==="!"){t=false}if(t!==true){e=e.slice(1)}var a=xt[e];if(!a){throw new TypeError('Unknown modifier "'+e+'"')}r[a]=t}));return r}function resolveKey(e){var t=dt[e]||parseInt(e,10);if(!t||typeof t!=="number"||isNaN(t)){throw new TypeError('Unknown key "'+e+'"')}return[t].concat(dt._alias[t]||[])}function matchModifiers(e,t){return!yt.some((function(r){return typeof e[r]==="boolean"&&Boolean(t[r])!==e[r]}))}function keyBinding(e){return e.split(/\s+/).map((function(e){var t=e.split("+");var r=resolveModifiers(t.slice(0,-1));var n=resolveKey(t.slice(-1));return{keyCodes:n,modifiers:r,matchModifiers:matchModifiers.bind(null,r)}}))}function getParentComparator(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{},t=e.parent,r=e.element,n=e.includeSelf;if(t){return function isChildOf(e){return Boolean(n&&e===t||t.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_CONTAINED_BY)}}else if(r){return function isParentOf(e){return Boolean(n&&r===e||e.compareDocumentPosition(r)&Node.DOCUMENT_POSITION_CONTAINED_BY)}}throw new TypeError("util/compare-position#getParentComparator required either options.parent or options.element")}function whenKey(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var t={};var r=nodeArray(e.context)[0]||document.documentElement;delete e.context;var n=nodeArray(e.filter);delete e.filter;var a=Object.keys(e);if(!a.length){throw new TypeError("when/key requires at least one option key")}var o=function registerBinding(e){e.keyCodes.forEach((function(r){if(!t[r]){t[r]=[]}t[r].push(e)}))};a.forEach((function(t){if(typeof e[t]!=="function"){throw new TypeError('when/key requires option["'+t+'"] to be a function')}var r=function addCallback(r){r.callback=e[t];return r};keyBinding(t).map(r).forEach(o)}));var i=function handleKeyDown(e){if(e.defaultPrevented){return}if(n.length){var a=getParentComparator({element:e.target,includeSelf:true});if(n.some(a)){return}}var o=e.keyCode||e.which;if(!t[o]){return}t[o].forEach((function(t){if(!t.matchModifiers(e)){return}t.callback.call(r,e,l)}))};r.addEventListener("keydown",i,false);var l=function disengage(){r.removeEventListener("keydown",i,false)};return{disengage:l}}function maintain_tab_focus({context:e}={}){if(!e){e=document.documentElement}queryTabsequence();return whenKey({"?alt+?shift+tab":function altShiftTab(t){t.preventDefault();var r=queryTabsequence({context:e});var n=t.shiftKey;var a=r[0];var o=r[r.length-1];var i=n?a:o;var l=n?o:a;if(isActiveElement(i)){l.focus();return}var s=void 0;var u=r.some((function(e,t){if(!isActiveElement(e)){return false}s=t;return true}));if(!u){a.focus();return}var c=n?-1:1;r[s+c].focus()}})}let Et;let wt;let kt=0;function lock(){setTimeout((()=>{if(kt++>0){return}const e=window.innerWidth-document.documentElement.clientWidth;if(e>0){Et=document.body.style.paddingRight;document.body.style.paddingRight=`${e}px`}wt=document.body.style.overflow;document.body.style.overflow="hidden"}))}function unlock(){setTimeout((()=>{if(kt===0||--kt!==0){return}if(Et!==undefined){document.body.style.paddingRight=Et;Et=undefined}if(wt!==undefined){document.body.style.overflow=wt;wt=undefined}}))}const St=function Overlay({className:e,children:t,fixed:r}){p.useEffect((()=>{lock();return()=>{unlock()}}),[]);const[n,a]=p.useState(null);const o=p.useCallback((e=>{a(e)}),[]);p.useEffect((()=>{if(n==null){return}const e=maintain_tab_focus({context:n});return()=>{e.disengage()}}),[n]);return p.createElement("div",{"data-nextjs-dialog-overlay":true,className:e,ref:o},p.createElement("div",{"data-nextjs-dialog-backdrop":true,"data-nextjs-dialog-backdrop-fixed":r?true:undefined}),t)};var _t=require("next/dist/compiled/anser");var Tt=__nccwpck_require__.n(_t);const Ct=function Terminal({content:e}){const t=p.useMemo((()=>Tt().ansiToJson(e,{json:true,use_classes:true,remove_empty:true})),[e]);return p.createElement("div",{"data-nextjs-terminal":true},p.createElement("pre",null,t.map(((e,t)=>p.createElement("span",{key:`terminal-entry-${t}`,style:{color:e.fg?`var(--color-${e.fg})`:undefined,...e.decoration==="bold"?{fontWeight:800}:e.decoration==="italic"?{fontStyle:"italic"}:undefined}},e.content)))))};const jt=function BuildError({message:e}){const t=p.useCallback((()=>{}),[]);return p.createElement(St,{fixed:true},p.createElement(h,{type:"error","aria-labelledby":"nextjs__container_build_error_label","aria-describedby":"nextjs__container_build_error_desc",onClose:t},p.createElement(y,null,p.createElement(E,{className:"nextjs-container-build-error-header"},p.createElement("h4",{id:"nextjs__container_build_error_label"},"Failed to compile")),p.createElement(x,{className:"nextjs-container-build-error-body"},p.createElement(Ct,{content:e}),p.createElement("footer",null,p.createElement("p",{id:"nextjs__container_build_error_desc"},p.createElement("small",null,"This error occurred during the build process and can only be dismissed by fixing the error.")))))))};const At=noop`
  .nextjs-container-build-error-header > h4 {
    line-height: 1.5;
    margin: 0;
    padding: 0;
  }

  .nextjs-container-build-error-body footer {
    margin-top: var(--size-gap);
  }
  .nextjs-container-build-error-body footer p {
    margin: 0;
  }

  .nextjs-container-build-error-body small {
    color: var(--color-font);
  }
`;const CloseIcon=()=>p.createElement("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg"},p.createElement("path",{d:"M18 6L6 18",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"}),p.createElement("path",{d:"M6 6L18 18",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"}));const Ot=function LeftRightDialogHeader({children:e,className:t,previous:r,next:n,close:a}){const o=p.useRef(null);const i=p.useRef(null);const l=p.useRef(null);const[s,u]=p.useState(null);const c=p.useCallback((e=>{u(e)}),[]);p.useEffect((()=>{if(s==null){return}const e=s.getRootNode();const t=self.document;function handler(t){if(t.key==="ArrowLeft"){t.stopPropagation();if(o.current){o.current.focus()}r&&r()}else if(t.key==="ArrowRight"){t.stopPropagation();if(i.current){i.current.focus()}n&&n()}else if(t.key==="Escape"){t.stopPropagation();if(e instanceof ShadowRoot){const t=e.activeElement;if(t&&t!==l.current&&t instanceof HTMLElement){t.blur();return}}if(a){a()}}}e.addEventListener("keydown",handler);if(e!==t){t.addEventListener("keydown",handler)}return function(){e.removeEventListener("keydown",handler);if(e!==t){t.removeEventListener("keydown",handler)}}}),[a,s,n,r]);p.useEffect((()=>{if(s==null){return}const e=s.getRootNode();if(e instanceof ShadowRoot){const t=e.activeElement;if(r==null){if(o.current&&t===o.current){o.current.blur()}}else if(n==null){if(i.current&&t===i.current){i.current.blur()}}}}),[s,n,r]);return p.createElement("div",{"data-nextjs-dialog-left-right":true,className:t},p.createElement("nav",{ref:c},p.createElement("button",{ref:o,type:"button",disabled:r==null?true:undefined,"aria-disabled":r==null?true:undefined,onClick:r??undefined},p.createElement("svg",{viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},p.createElement("title",null,"previous"),p.createElement("path",{d:"M6.99996 1.16666L1.16663 6.99999L6.99996 12.8333M12.8333 6.99999H1.99996H12.8333Z",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"}))),p.createElement("button",{ref:i,type:"button",disabled:n==null?true:undefined,"aria-disabled":n==null?true:undefined,onClick:n??undefined},p.createElement("svg",{viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},p.createElement("title",null,"next"),p.createElement("path",{d:"M6.99996 1.16666L12.8333 6.99999L6.99996 12.8333M1.16663 6.99999H12H1.16663Z",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})))," ",e),a?p.createElement("button",{"data-nextjs-errors-dialog-left-right-close-button":true,ref:l,type:"button",onClick:a,"aria-label":"Close"},p.createElement("span",{"aria-hidden":"true"},p.createElement(CloseIcon,null))):null)};const Nt=noop`
  [data-nextjs-dialog-left-right] {
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
    justify-content: space-between;
  }
  [data-nextjs-dialog-left-right] > nav > button {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: calc(var(--size-gap-double) + var(--size-gap));
    height: calc(var(--size-gap-double) + var(--size-gap));
    font-size: 0;
    border: none;
    background-color: rgba(255, 85, 85, 0.1);
    color: var(--color-ansi-red);
    cursor: pointer;
    transition: background-color 0.25s ease;
  }
  [data-nextjs-dialog-left-right] > nav > button > svg {
    width: auto;
    height: calc(var(--size-gap) + var(--size-gap-half));
  }
  [data-nextjs-dialog-left-right] > nav > button:hover {
    background-color: rgba(255, 85, 85, 0.2);
  }
  [data-nextjs-dialog-left-right] > nav > button:disabled {
    background-color: rgba(255, 85, 85, 0.1);
    color: rgba(255, 85, 85, 0.4);
    cursor: not-allowed;
  }

  [data-nextjs-dialog-left-right] > nav > button:first-of-type {
    border-radius: var(--size-gap-half) 0 0 var(--size-gap-half);
    margin-right: 1px;
  }
  [data-nextjs-dialog-left-right] > nav > button:last-of-type {
    border-radius: 0 var(--size-gap-half) var(--size-gap-half) 0;
  }

  [data-nextjs-dialog-left-right] > button:last-of-type {
    border: 0;
    padding: 0;

    background-color: transparent;
    appearance: none;

    opacity: 0.4;
    transition: opacity 0.25s ease;

    color: var(--color-font);
  }
  [data-nextjs-dialog-left-right] > button:last-of-type:hover {
    opacity: 0.7;
  }
`;const It=noop`
  [data-nextjs-toast] {
    position: fixed;
    bottom: var(--size-gap-double);
    left: var(--size-gap-double);
    max-width: 420px;
    z-index: 9000;
  }

  @media (max-width: 440px) {
    [data-nextjs-toast] {
      max-width: 90vw;
      left: 5vw;
    }
  }

  [data-nextjs-toast-wrapper] {
    padding: 16px;
    border-radius: var(--size-gap-half);
    font-weight: 500;
    color: var(--color-ansi-bright-white);
    background-color: var(--color-ansi-red);
    box-shadow: 0px var(--size-gap-double) var(--size-gap-quad)
      rgba(0, 0, 0, 0.25);
  }
`;const Lt=function Toast({onClick:e,children:t,className:r}){return p.createElement("div",{"data-nextjs-toast":true,onClick:e,className:r},p.createElement("div",{"data-nextjs-toast-wrapper":true},t))};var Ft=require("next/dist/compiled/strip-ansi");var Dt=__nccwpck_require__.n(Ft);const Mt=function CodeFrame({stackFrame:e,codeFrame:t}){const r=p.useMemo((()=>{const e=t.split(/\r?\n/g);const r=e.map((e=>/^>? +\d+ +\| [ ]+/.exec(Dt()(e))===null?null:/^>? +\d+ +\| ( *)/.exec(Dt()(e)))).filter(Boolean).map((e=>e.pop())).reduce(((e,t)=>isNaN(e)?t.length:Math.min(e,t.length)),NaN);if(r>1){const t=" ".repeat(r);return e.map(((e,r)=>~(r=e.indexOf("|"))?e.substring(0,r)+e.substring(r).replace(t,""):e)).join("\n")}return e.join("\n")}),[t]);const n=p.useMemo((()=>Tt().ansiToJson(r,{json:true,use_classes:true,remove_empty:true})),[r]);const a=p.useCallback((()=>{const t=new URLSearchParams;for(const r in e){t.append(r,(e[r]??"").toString())}self.fetch(`${process.env.__NEXT_ROUTER_BASEPATH||""}/__nextjs_launch-editor?${t.toString()}`).then((()=>{}),(()=>{console.error("There was an issue opening this code in your editor.")}))}),[e]);return p.createElement("div",{"data-nextjs-codeframe":true},p.createElement("div",null,p.createElement("p",{role:"link",onClick:a,tabIndex:1,title:"Click to open in your editor"},p.createElement("span",null,getFrameSource(e)," @ ",e.methodName),p.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},p.createElement("path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}),p.createElement("polyline",{points:"15 3 21 3 21 9"}),p.createElement("line",{x1:"10",y1:"14",x2:"21",y2:"3"})))),p.createElement("pre",null,n.map(((e,t)=>p.createElement("span",{key:`frame-${t}`,style:{color:e.fg?`var(--color-${e.fg})`:undefined,...e.decoration==="bold"?{fontWeight:800}:e.decoration==="italic"?{fontStyle:"italic"}:undefined}},e.content)))))};const Rt=function CallStackFrame({frame:e}){const t=e.originalStackFrame??e.sourceStackFrame;const r=Boolean(e.originalCodeFrame);const n=p.useCallback((()=>{if(!r)return;const e=new URLSearchParams;for(const r in t){e.append(r,(t[r]??"").toString())}self.fetch(`${process.env.__NEXT_ROUTER_BASEPATH||""}/__nextjs_launch-editor?${e.toString()}`).then((()=>{}),(()=>{console.error("There was an issue opening this code in your editor.")}))}),[r,t]);return p.createElement("div",{"data-nextjs-call-stack-frame":true},p.createElement("h3",{"data-nextjs-frame-expanded":Boolean(e.expanded)},t.methodName),p.createElement("div",{"data-has-source":r?"true":undefined,tabIndex:r?10:undefined,role:r?"link":undefined,onClick:n,title:r?"Click to open in your editor":undefined},p.createElement("span",null,getFrameSource(t)),p.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},p.createElement("path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}),p.createElement("polyline",{points:"15 3 21 3 21 9"}),p.createElement("line",{x1:"10",y1:"14",x2:"21",y2:"3"}))))};const zt=function RuntimeError({error:e}){const t=p.useMemo((()=>e.frames.findIndex((e=>e.expanded&&Boolean(e.originalCodeFrame)&&Boolean(e.originalStackFrame)))),[e.frames]);const r=p.useMemo((()=>e.frames[t]??null),[e.frames,t]);const n=p.useMemo((()=>t<0?[]:e.frames.slice(0,t)),[e.frames,t]);const[a,o]=p.useState(r==null);const i=p.useCallback((()=>{o((e=>!e))}),[]);const l=p.useMemo((()=>n.filter((e=>e.expanded||a))),[a,n]);const s=p.useMemo((()=>e.frames.slice(t+1)),[e.frames,t]);const u=p.useMemo((()=>s.filter((e=>e.expanded||a))),[a,s]);const c=p.useMemo((()=>s.length!==u.length||a&&r!=null),[a,s.length,r,u.length]);return p.createElement(p.Fragment,null,r?p.createElement(p.Fragment,null,p.createElement("h2",null,"Source"),l.map(((e,t)=>p.createElement(Rt,{key:`leading-frame-${t}-${a}`,frame:e}))),p.createElement(Mt,{stackFrame:r.originalStackFrame,codeFrame:r.originalCodeFrame})):undefined,e.componentStack?p.createElement(p.Fragment,null,p.createElement("h2",null,"Component Stack"),e.componentStack.map(((e,t)=>p.createElement("div",{key:t,"data-nextjs-component-stack-frame":true},p.createElement("h3",null,e))))):null,u.length?p.createElement(p.Fragment,null,p.createElement("h2",null,"Call Stack"),u.map(((e,t)=>p.createElement(Rt,{key:`call-stack-${t}-${a}`,frame:e})))):undefined,c?p.createElement(p.Fragment,null,p.createElement("button",{tabIndex:10,"data-nextjs-data-runtime-error-collapsed-action":true,type:"button",onClick:i},a?"Hide":"Show"," collapsed frames")):undefined)};const Bt=noop`
  button[data-nextjs-data-runtime-error-collapsed-action] {
    background: none;
    border: none;
    padding: 0;
    font-size: var(--size-font-small);
    line-height: var(--size-font-bigger);
    color: var(--color-accents-3);
  }

  [data-nextjs-call-stack-frame]:not(:last-child),
  [data-nextjs-component-stack-frame]:not(:last-child) {
    margin-bottom: var(--size-gap-double);
  }

  [data-nextjs-call-stack-frame] > h3,
  [data-nextjs-component-stack-frame] > h3 {
    margin-top: 0;
    margin-bottom: var(--size-gap);
    font-family: var(--font-stack-monospace);
    color: var(--color-stack-h6);
  }
  [data-nextjs-call-stack-frame] > h3[data-nextjs-frame-expanded='false'] {
    color: var(--color-stack-headline);
  }
  [data-nextjs-call-stack-frame] > div {
    display: flex;
    align-items: center;
    padding-left: calc(var(--size-gap) + var(--size-gap-half));
    font-size: var(--size-font-small);
    color: var(--color-stack-subline);
  }
  [data-nextjs-call-stack-frame] > div > svg {
    width: auto;
    height: var(--size-font-small);
    margin-left: var(--size-gap);

    display: none;
  }

  [data-nextjs-call-stack-frame] > div[data-has-source] {
    cursor: pointer;
  }
  [data-nextjs-call-stack-frame] > div[data-has-source]:hover {
    text-decoration: underline dotted;
  }
  [data-nextjs-call-stack-frame] > div[data-has-source] > svg {
    display: unset;
  }
`;function getErrorSignature(e){const{event:t}=e;switch(t.type){case o:case i:{return`${t.reason.name}::${t.reason.message}::${t.reason.stack}`}default:{}}const r=t;return""}const Ht=function HotlinkedText(e){const{text:t}=e;const r=/https?:\/\/[^\s/$.?#].[^\s)'"]*/i;return p.createElement(p.Fragment,null,r.test(t)?t.split(" ").map(((e,t,n)=>{if(r.test(e)){const a=r.exec(e);return p.createElement(p.Fragment,{key:`link-${t}`},a&&p.createElement("a",{href:a[0],target:"_blank",rel:"noreferrer noopener"},e),t===n.length-1?"":" ")}return t===n.length-1?p.createElement(p.Fragment,{key:`text-${t}`},e):p.createElement(p.Fragment,{key:`text-${t}`},e," ")})):t)};const qt=function Errors({errors:e}){const[t,r]=p.useState({});const[n,a]=p.useMemo((()=>{let r=[];let n=null;for(let a=0;a<e.length;++a){const o=e[a];const{id:i}=o;if(i in t){r.push(t[i]);continue}if(a>0){const t=e[a-1];if(getErrorSignature(t)===getErrorSignature(o)){continue}}n=o;break}return[r,n]}),[e,t]);const o=p.useMemo((()=>n.length<1&&Boolean(e.length)),[e.length,n.length]);p.useEffect((()=>{if(a==null){return}let e=true;getErrorByType(a).then((t=>{if(e){r((e=>({...e,[t.id]:t})))}}),(()=>{}));return()=>{e=false}}),[a]);const[i,l]=p.useState("fullscreen");const[s,u]=p.useState(0);const c=p.useCallback((e=>{e?.preventDefault();u((e=>Math.max(0,e-1)))}),[]);const d=p.useCallback((e=>{e?.preventDefault();u((e=>Math.max(0,Math.min(n.length-1,e+1))))}),[n.length]);const f=p.useMemo((()=>n[s]??null),[s,n]);p.useEffect((()=>{if(e.length<1){r({});l("hidden");u(0)}}),[e.length]);const m=p.useCallback((e=>{e?.preventDefault();l("minimized")}),[]);const b=p.useCallback((e=>{e?.preventDefault();l("hidden")}),[]);const g=p.useCallback((e=>{e?.preventDefault();l("fullscreen")}),[]);if(e.length<1||f==null){return null}if(o){return p.createElement(St,null)}if(i==="hidden"){return null}if(i==="minimized"){return p.createElement(Lt,{className:"nextjs-toast-errors-parent",onClick:g},p.createElement("div",{className:"nextjs-toast-errors"},p.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},p.createElement("circle",{cx:"12",cy:"12",r:"10"}),p.createElement("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),p.createElement("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})),p.createElement("span",null,n.length," error",n.length>1?"s":""),p.createElement("button",{"data-nextjs-toast-errors-hide-button":true,className:"nextjs-toast-errors-hide-button",type:"button",onClick:e=>{e.stopPropagation();b()},"aria-label":"Hide Errors"},p.createElement(CloseIcon,null))))}const v=["server","edge-server"].includes(getErrorSource(f.error)||"");return p.createElement(St,null,p.createElement(h,{type:"error","aria-labelledby":"nextjs__container_errors_label","aria-describedby":"nextjs__container_errors_desc",onClose:v?undefined:m},p.createElement(y,null,p.createElement(E,{className:"nextjs-container-errors-header"},p.createElement(Ot,{previous:s>0?c:null,next:s<n.length-1?d:null,close:v?undefined:m},p.createElement("small",null,p.createElement("span",null,s+1)," of"," ",p.createElement("span",null,n.length)," unhandled error",n.length<2?"":"s")),p.createElement("h1",{id:"nextjs__container_errors_label"},v?"Server Error":"Unhandled Runtime Error"),p.createElement("p",{id:"nextjs__container_errors_desc"},f.error.name,":"," ",p.createElement(Ht,{text:f.error.message})),v?p.createElement("div",null,p.createElement("small",null,"This error happened while generating the page. Any console logs will be displayed in the terminal window.")):undefined),p.createElement(x,{className:"nextjs-container-errors-body"},p.createElement(zt,{key:f.id.toString(),error:f})))))};const Pt=noop`
  .nextjs-container-errors-header > h1 {
    font-size: var(--size-font-big);
    line-height: var(--size-font-bigger);
    font-weight: bold;
    margin: 0;
    margin-top: calc(var(--size-gap-double) + var(--size-gap-half));
  }
  .nextjs-container-errors-header small {
    font-size: var(--size-font-small);
    color: var(--color-accents-1);
    margin-left: var(--size-gap-double);
  }
  .nextjs-container-errors-header small > span {
    font-family: var(--font-stack-monospace);
  }
  .nextjs-container-errors-header > p {
    font-family: var(--font-stack-monospace);
    font-size: var(--size-font-small);
    line-height: var(--size-font-big);
    font-weight: bold;
    margin: 0;
    margin-top: var(--size-gap-half);
    color: var(--color-ansi-red);
    white-space: pre-wrap;
  }
  .nextjs-container-errors-header > div > small {
    margin: 0;
    margin-top: var(--size-gap-half);
  }
  .nextjs-container-errors-header > p > a {
    color: var(--color-ansi-red);
  }

  .nextjs-container-errors-body > h2:not(:first-child) {
    margin-top: calc(var(--size-gap-double) + var(--size-gap));
  }
  .nextjs-container-errors-body > h2 {
    margin-bottom: var(--size-gap);
    font-size: var(--size-font-big);
  }

  .nextjs-toast-errors-parent {
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  .nextjs-toast-errors-parent:hover {
    transform: scale(1.1);
  }
  .nextjs-toast-errors {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .nextjs-toast-errors > svg {
    margin-right: var(--size-gap);
  }
  .nextjs-toast-errors-hide-button {
    margin-left: var(--size-gap-triple);
    border: none;
    background: none;
    color: var(--color-ansi-bright-white);
    padding: 0;
    transition: opacity 0.25s ease;
    opacity: 0.7;
  }
  .nextjs-toast-errors-hide-button:hover {
    opacity: 1;
  }
`;class ErrorBoundary extends b().PureComponent{constructor(){super(...arguments);this.state={error:null}}static getDerivedStateFromError(e){return{error:e}}componentDidCatch(e,t){this.props.onError(e,t?.componentStack||null);if(!this.props.globalOverlay){this.setState({error:e})}}render(){return this.state.error||this.props.globalOverlay&&this.props.isMounted?this.props.globalOverlay?b().createElement("html",null,b().createElement("head",null),b().createElement("body",null)):null:this.props.children}}function Base(){return p.createElement("style",null,noop`
        :host {
          --size-gap-half: 4px;
          --size-gap: 8px;
          --size-gap-double: 16px;
          --size-gap-triple: 24px;
          --size-gap-quad: 32px;

          --size-font-small: 14px;
          --size-font: 16px;
          --size-font-big: 20px;
          --size-font-bigger: 24px;

          --color-background: white;
          --color-font: #757575;
          --color-backdrop: rgba(17, 17, 17, 0.2);

          --color-stack-h6: #222;
          --color-stack-headline: #666;
          --color-stack-subline: #999;

          --color-accents-1: #808080;
          --color-accents-2: #222222;
          --color-accents-3: #404040;

          --font-stack-monospace: 'SFMono-Regular', Consolas, 'Liberation Mono',
            Menlo, Courier, monospace;

          --color-ansi-selection: rgba(95, 126, 151, 0.48);
          --color-ansi-bg: #111111;
          --color-ansi-fg: #cccccc;

          --color-ansi-white: #777777;
          --color-ansi-black: #141414;
          --color-ansi-blue: #00aaff;
          --color-ansi-cyan: #88ddff;
          --color-ansi-green: #98ec65;
          --color-ansi-magenta: #aa88ff;
          --color-ansi-red: #ff5555;
          --color-ansi-yellow: #ffcc33;
          --color-ansi-bright-white: #ffffff;
          --color-ansi-bright-black: #777777;
          --color-ansi-bright-blue: #33bbff;
          --color-ansi-bright-cyan: #bbecff;
          --color-ansi-bright-green: #b6f292;
          --color-ansi-bright-magenta: #cebbff;
          --color-ansi-bright-red: #ff8888;
          --color-ansi-bright-yellow: #ffd966;
        }

        @media (prefers-color-scheme: dark) {
          :host {
            --color-background: rgb(28, 28, 30);
            --color-font: white;
            --color-backdrop: rgb(44, 44, 46);

            --color-stack-h6: rgb(200, 200, 204);
            --color-stack-headline: rgb(99, 99, 102);
            --color-stack-subline: rgba(142, 142, 147);

            --color-accents-3: rgb(118, 118, 118);
          }
        }

        .mono {
          font-family: var(--font-stack-monospace);
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          margin-bottom: var(--size-gap);
          font-weight: 500;
          line-height: 1.5;
        }
      `)}const Wt=noop`
  [data-nextjs-codeframe] {
    overflow: auto;
    border-radius: var(--size-gap-half);
    background-color: var(--color-ansi-bg);
    color: var(--color-ansi-fg);
  }
  [data-nextjs-codeframe]::selection,
  [data-nextjs-codeframe] *::selection {
    background-color: var(--color-ansi-selection);
  }
  [data-nextjs-codeframe] * {
    color: inherit;
    background-color: transparent;
    font-family: var(--font-stack-monospace);
  }

  [data-nextjs-codeframe] > * {
    margin: 0;
    padding: calc(var(--size-gap) + var(--size-gap-half))
      calc(var(--size-gap-double) + var(--size-gap-half));
  }
  [data-nextjs-codeframe] > div {
    display: inline-block;
    width: auto;
    min-width: 100%;
    border-bottom: 1px solid var(--color-ansi-bright-black);
  }
  [data-nextjs-codeframe] > div > p {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    margin: 0;
  }
  [data-nextjs-codeframe] > div > p:hover {
    text-decoration: underline dotted;
  }
  [data-nextjs-codeframe] div > p > svg {
    width: auto;
    height: 1em;
    margin-left: 8px;
  }
  [data-nextjs-codeframe] div > pre {
    overflow: hidden;
    display: inline-block;
  }
`;const Vt=noop`
  [data-nextjs-dialog-overlay] {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    z-index: 9000;

    display: flex;
    align-content: center;
    align-items: center;
    flex-direction: column;
    padding: 10vh 15px 0;
  }

  @media (max-height: 812px) {
    [data-nextjs-dialog-overlay] {
      padding: 15px 15px 0;
    }
  }

  [data-nextjs-dialog-backdrop] {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--color-backdrop);
    pointer-events: all;
    z-index: -1;
  }

  [data-nextjs-dialog-backdrop-fixed] {
    cursor: not-allowed;
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
  }
`;const $t=noop`
  [data-nextjs-terminal] {
    border-radius: var(--size-gap-half);
    background-color: var(--color-ansi-bg);
    color: var(--color-ansi-fg);
  }
  [data-nextjs-terminal]::selection,
  [data-nextjs-terminal] *::selection {
    background-color: var(--color-ansi-selection);
  }
  [data-nextjs-terminal] * {
    color: inherit;
    background-color: transparent;
    font-family: var(--font-stack-monospace);
  }
  [data-nextjs-terminal] > * {
    margin: 0;
    padding: calc(var(--size-gap) + var(--size-gap-half))
      calc(var(--size-gap-double) + var(--size-gap-half));
  }

  [data-nextjs-terminal] pre {
    white-space: pre-wrap;
    word-break: break-word;
  }
`;function ComponentStyles(){return p.createElement("style",null,noop`
        ${Vt}
        ${It}
        ${w}
        ${Nt}
        ${Wt}
        ${$t}
        
        ${At}
        ${Pt}
        ${Bt}
      `)}function CssReset(){return p.createElement("style",null,noop`
        :host {
          all: initial;

          /* the direction property is not reset by 'all' */
          direction: ltr;
        }

        /*!
         * Bootstrap Reboot v4.4.1 (https://getbootstrap.com/)
         * Copyright 2011-2019 The Bootstrap Authors
         * Copyright 2011-2019 Twitter, Inc.
         * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
         * Forked from Normalize.css, licensed MIT (https://github.com/necolas/normalize.css/blob/master/LICENSE.md)
         */
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        :host {
          font-family: sans-serif;
          line-height: 1.15;
          -webkit-text-size-adjust: 100%;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }

        article,
        aside,
        figcaption,
        figure,
        footer,
        header,
        hgroup,
        main,
        nav,
        section {
          display: block;
        }

        :host {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
            'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
            'Noto Color Emoji';
          font-size: 16px;
          font-weight: 400;
          line-height: 1.5;
          color: var(--color-font);
          text-align: left;
          background-color: #fff;
        }

        [tabindex='-1']:focus:not(:focus-visible) {
          outline: 0 !important;
        }

        hr {
          box-sizing: content-box;
          height: 0;
          overflow: visible;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          margin-top: 0;
          margin-bottom: 8px;
        }

        p {
          margin-top: 0;
          margin-bottom: 16px;
        }

        abbr[title],
        abbr[data-original-title] {
          text-decoration: underline;
          -webkit-text-decoration: underline dotted;
          text-decoration: underline dotted;
          cursor: help;
          border-bottom: 0;
          -webkit-text-decoration-skip-ink: none;
          text-decoration-skip-ink: none;
        }

        address {
          margin-bottom: 16px;
          font-style: normal;
          line-height: inherit;
        }

        ol,
        ul,
        dl {
          margin-top: 0;
          margin-bottom: 16px;
        }

        ol ol,
        ul ul,
        ol ul,
        ul ol {
          margin-bottom: 0;
        }

        dt {
          font-weight: 700;
        }

        dd {
          margin-bottom: 8px;
          margin-left: 0;
        }

        blockquote {
          margin: 0 0 16px;
        }

        b,
        strong {
          font-weight: bolder;
        }

        small {
          font-size: 80%;
        }

        sub,
        sup {
          position: relative;
          font-size: 75%;
          line-height: 0;
          vertical-align: baseline;
        }

        sub {
          bottom: -0.25em;
        }

        sup {
          top: -0.5em;
        }

        a {
          color: #007bff;
          text-decoration: none;
          background-color: transparent;
        }

        a:hover {
          color: #0056b3;
          text-decoration: underline;
        }

        a:not([href]) {
          color: inherit;
          text-decoration: none;
        }

        a:not([href]):hover {
          color: inherit;
          text-decoration: none;
        }

        pre,
        code,
        kbd,
        samp {
          font-family: SFMono-Regular, Menlo, Monaco, Consolas,
            'Liberation Mono', 'Courier New', monospace;
          font-size: 1em;
        }

        pre {
          margin-top: 0;
          margin-bottom: 16px;
          overflow: auto;
        }

        figure {
          margin: 0 0 16px;
        }

        img {
          vertical-align: middle;
          border-style: none;
        }

        svg {
          overflow: hidden;
          vertical-align: middle;
        }

        table {
          border-collapse: collapse;
        }

        caption {
          padding-top: 12px;
          padding-bottom: 12px;
          color: #6c757d;
          text-align: left;
          caption-side: bottom;
        }

        th {
          text-align: inherit;
        }

        label {
          display: inline-block;
          margin-bottom: 8px;
        }

        button {
          border-radius: 0;
        }

        button:focus {
          outline: 1px dotted;
          outline: 5px auto -webkit-focus-ring-color;
        }

        input,
        button,
        select,
        optgroup,
        textarea {
          margin: 0;
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
        }

        button,
        input {
          overflow: visible;
        }

        button,
        select {
          text-transform: none;
        }

        select {
          word-wrap: normal;
        }

        button,
        [type='button'],
        [type='reset'],
        [type='submit'] {
          -webkit-appearance: button;
        }

        button:not(:disabled),
        [type='button']:not(:disabled),
        [type='reset']:not(:disabled),
        [type='submit']:not(:disabled) {
          cursor: pointer;
        }

        button::-moz-focus-inner,
        [type='button']::-moz-focus-inner,
        [type='reset']::-moz-focus-inner,
        [type='submit']::-moz-focus-inner {
          padding: 0;
          border-style: none;
        }

        input[type='radio'],
        input[type='checkbox'] {
          box-sizing: border-box;
          padding: 0;
        }

        input[type='date'],
        input[type='time'],
        input[type='datetime-local'],
        input[type='month'] {
          -webkit-appearance: listbox;
        }

        textarea {
          overflow: auto;
          resize: vertical;
        }

        fieldset {
          min-width: 0;
          padding: 0;
          margin: 0;
          border: 0;
        }

        legend {
          display: block;
          width: 100%;
          max-width: 100%;
          padding: 0;
          margin-bottom: 8px;
          font-size: 24px;
          line-height: inherit;
          color: inherit;
          white-space: normal;
        }

        progress {
          vertical-align: baseline;
        }

        [type='number']::-webkit-inner-spin-button,
        [type='number']::-webkit-outer-spin-button {
          height: auto;
        }

        [type='search'] {
          outline-offset: -2px;
          -webkit-appearance: none;
        }

        [type='search']::-webkit-search-decoration {
          -webkit-appearance: none;
        }

        ::-webkit-file-upload-button {
          font: inherit;
          -webkit-appearance: button;
        }

        output {
          display: inline-block;
        }

        summary {
          display: list-item;
          cursor: pointer;
        }

        template {
          display: none;
        }

        [hidden] {
          display: none !important;
        }
      `)}function pushErrorFilterDuplicates(e,t){return[...e.filter((e=>e.event.reason!==t.event.reason)),t]}function reducer(r,l){switch(l.type){case e:{return{...r,buildError:null}}case t:{return{...r,buildError:l.message}}case a:{return{...r,refreshState:{type:"pending",errors:[]}}}case n:{return{...r,buildError:null,errors:r.refreshState.type==="pending"?r.refreshState.errors:[],refreshState:{type:"idle"}}}case o:case i:{switch(r.refreshState.type){case"idle":{return{...r,nextId:r.nextId+1,errors:pushErrorFilterDuplicates(r.errors,{id:r.nextId,event:l})}}case"pending":{return{...r,nextId:r.nextId+1,refreshState:{...r.refreshState,errors:pushErrorFilterDuplicates(r.refreshState.errors,{id:r.nextId,event:l})}}}default:const e=r.refreshState;return r}}default:{const e=l;return r}}}const shouldPreventDisplay=(e,t)=>{if(!t||!e){return false}return t.includes(e)};const Kt=function ReactDevOverlay({children:e,preventDisplay:t,globalOverlay:r}){const[n,a]=p.useReducer(reducer,{nextId:1,buildError:null,errors:[],refreshState:{type:"idle"}});p.useEffect((()=>{on(a);return function(){off(a)}}),[a]);const o=p.useCallback(((e,t)=>{}),[]);const i=n.buildError!=null;const l=Boolean(n.errors.length);const s=i?"build":l?"runtime":null;const u=s!==null;return p.createElement(p.Fragment,null,p.createElement(ErrorBoundary,{globalOverlay:r,isMounted:u,onError:o},e??null),u?p.createElement(v,{globalOverlay:r},p.createElement(CssReset,null),p.createElement(Base,null),p.createElement(ComponentStyles,null),shouldPreventDisplay(s,t)?null:i?p.createElement(jt,{message:n.buildError}):l?p.createElement(qt,{errors:n.errors}):undefined):undefined)};var Zt=Kt;(0,f.patchConsoleError)();let Ut=false;let Gt=undefined;function onUnhandledError(e){const t=e?.error;if(!t||!(t instanceof Error)||typeof t.stack!=="string"){return}if(t.message.match(/(hydration|content does not match|did not match)/i)){if(f.hydrationErrorWarning){t.message+="\n\n"+f.hydrationErrorWarning}t.message+=`\n\nSee more info here: https://nextjs.org/docs/messages/react-hydration-error`}const r=t;const n=typeof f.hydrationErrorComponentStack==="string"?(0,d.parseComponentStack)(f.hydrationErrorComponentStack).map((e=>e.component)):undefined;emit({type:o,reason:t,frames:parseStack(r.stack),componentStack:n})}function onUnhandledRejection(e){const t=e?.reason;if(!t||!(t instanceof Error)||typeof t.stack!=="string"){return}const r=t;emit({type:i,reason:t,frames:parseStack(r.stack)})}function register(){if(Ut){return}Ut=true;try{const e=Error.stackTraceLimit;Error.stackTraceLimit=50;Gt=e}catch{}window.addEventListener("error",onUnhandledError);window.addEventListener("unhandledrejection",onUnhandledRejection)}function unregister(){if(!Ut){return}Ut=false;if(Gt!==undefined){try{Error.stackTraceLimit=Gt}catch{}Gt=undefined}window.removeEventListener("error",onUnhandledError);window.removeEventListener("unhandledrejection",onUnhandledRejection)}function onBuildOk(){emit({type:e})}function onBuildError(e){emit({type:t,message:e})}function onRefresh(){emit({type:n})}function onBeforeRefresh(){emit({type:a})}}();module.exports=r})();