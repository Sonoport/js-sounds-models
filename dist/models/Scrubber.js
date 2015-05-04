/*soundmodels - v2.5.5 - Mon May 04 2015 11:37:57 GMT+0800 (SGT) */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Scrubber = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";function Scrubber(o,e,r,t,a,n){function i(o){P&&(P.disconnect(),P=null),multiFileLoader.call(S,o,S.audioContext,S.onLoadProgress,q),f=Config.WINDOW_LENGTH,l=f/2,y=0,h=s(f,1);for(var e=0;f>e;e++)h[e]=.25*(1-Math.cos(2*Math.PI*(e+.5)/f));g=new Float32Array(Config.CHUNK_LENGTH)}function u(o){if(!S.isPlaying||!S.isInitialized){for(r=0;v>r;r++)o.outputBuffer.getChannelData(r).set(g);return L=0,K=0,void(w&&("function"==typeof S.onAudioEnd&&S.onAudioEnd(),w=!1))}for(var e,r,t=o.outputBuffer.length;t>0;){if(y>0&&t>0){var a=Math.min(t,y),n=l-y;for(r=0;v>r;r++){var i=d[r].subarray(n,n+a);o.outputBuffer.getChannelData(r).set(i,o.outputBuffer.length-t)}t-=a,y-=a}if(t>0){var u,s=S.playPosition.value;if(Math.abs(C-s)*p>B*m)A=s,u=0;else{var P=E*A+(1-E)*s;u=(P-A)*p/l,A=P}for(C=s,e=0;f-l>e;e++)for(r=0;v>r;r++)d[r][e]=d[r][e+l];for(e=f-l;f>e;e++)for(r=0;v>r;r++)d[r][e]=0;var q=0,H=0;for(e=l;f>e;e++){var I=0;for(r=0;v>r;r++)I+=c[r][e];I>H&&(q=e-l,H=I)}var O=parseInt(A*(p-f)),T=0,x=0;for(e=0;f>e;e++){var D=0,G=(O+e)%p;for(r=0;v>r;r++)D+=b[r][G];D>x&&(x=D,T=e)}var R=T-q;for(O+=R,e=0;f>e;e++){var _=(O+e)%p;for(0>_&&(_=0),r=0;v>r;r++)c[r][e]=b[r][_]}var z=S.noMotionFade.value,K=1;z&&Math.abs(u)<M&&(K=0),L=N*L+(1-N)*K;var U=S.muteOnReverse.value;for(0>u&&U&&(L=0),w&&(U&&F>L||Math.abs(L)<F)&&(log.debug("stopping..."),w=!1,"function"==typeof S.onAudioEnd&&S.onAudioEnd()),L>F&&!w&&(log.debug("playing..."),w=!0,"function"==typeof S.onAudioStart&&S.onAudioStart()),e=0;f>e;e++)for(r=0;v>r;r++)d[r][e]+=L*h[e]*c[r][e];y=l}}}function s(o,e){var r=[];(void 0===e||null===e)&&(e=1);for(var t=0;e>t;t++)r.push(new Float32Array(o));return r}if(!(this instanceof Scrubber))throw new TypeError("Scrubber constructor cannot be called as a function.");BaseSound.call(this,o),this.maxSources=1,this.minSources=1,this.modelName="Scrubber",this.onLoadProgress=r,this.onLoadComplete=t,this.onAudioStart=a,this.onAudioEnd=n;var f,l,d,c,h,p,v,m,P,g,S=this,b=[],y=0,C=0,A=0,L=0,B=1,E=.95,M=.1,N=.93,F=1e-4,w=!1,q=function(o,e){if(o){var r=e[0];p=r.length,v=r.numberOfChannels,m=r.sampleRate,b=[];for(var t=0;v>t;t++)b.push(r.getChannelData(t));P=S.audioContext.createScriptProcessor(Config.CHUNK_LENGTH,0,v),P.onaudioprocess=u,P.connect(S.releaseGainNode),d=s(f,v),c=s(f,v),A=S.playPosition.value,S.isInitialized=!0}"function"==typeof S.onLoadComplete&&window.setTimeout(function(){"function"==typeof S.onLoadComplete&&S.onLoadComplete(o,e)},0)};this.setSources=function(o,e,r){BaseSound.prototype.setSources.call(this,o,e,r),i(o)},this.registerParameter(SPAudioParam.createPsuedoParam(this,"playPosition",0,1,0)),this.registerParameter(SPAudioParam.createPsuedoParam(this,"noMotionFade",!0,!1,!0)),this.registerParameter(SPAudioParam.createPsuedoParam(this,"muteOnReverse",!0,!1,!0)),i(e)}var Config=_dereq_("../core/Config"),BaseSound=_dereq_("../core/BaseSound"),SPAudioParam=_dereq_("../core/SPAudioParam"),multiFileLoader=_dereq_("../core/MultiFileLoader"),log=_dereq_("loglevel");Scrubber.prototype=Object.create(BaseSound.prototype),module.exports=Scrubber;
},{"../core/BaseSound":4,"../core/Config":5,"../core/MultiFileLoader":8,"../core/SPAudioParam":10,"loglevel":2}],2:[function(_dereq_,module,exports){
!function(e,o){"object"==typeof module&&module.exports&&"function"==typeof _dereq_?module.exports=o():"function"==typeof define&&"object"==typeof define.amd?define(o):e.log=o()}(this,function(){function e(e){return typeof console===f?!1:void 0!==console[e]?o(console,e):void 0!==console.log?o(console,"log"):c}function o(e,o){var n=e[o];if("function"==typeof n.bind)return n.bind(e);try{return Function.prototype.bind.call(n,e)}catch(t){return function(){return Function.prototype.apply.apply(n,[e,arguments])}}}function n(e,o){return function(){typeof console!==f&&(t(o),r[e].apply(r,arguments))}}function t(e){for(var o=0;o<u.length;o++){var n=u[o];r[n]=e>o?c:r.methodFactory(n,e)}}function l(e){var o=(u[e]||"silent").toUpperCase();try{return void(window.localStorage.loglevel=o)}catch(n){}try{window.document.cookie="loglevel="+o+";"}catch(n){}}function i(){var e;try{e=window.localStorage.loglevel}catch(o){}if(typeof e===f)try{e=/loglevel=([^;]+)/.exec(window.document.cookie)[1]}catch(o){}void 0===r.levels[e]&&(e="WARN"),r.setLevel(r.levels[e])}var r={},c=function(){},f="undefined",u=["trace","debug","info","warn","error"];r.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},r.methodFactory=function(o,t){return e(o)||n(o,t)},r.setLevel=function(e){if("string"==typeof e&&void 0!==r.levels[e.toUpperCase()]&&(e=r.levels[e.toUpperCase()]),!("number"==typeof e&&e>=0&&e<=r.levels.SILENT))throw"log.setLevel() called with invalid level: "+e;return l(e),t(e),typeof console===f&&e<r.levels.SILENT?"No console available for logging":void 0},r.enableAll=function(){r.setLevel(r.levels.TRACE)},r.disableAll=function(){r.setLevel(r.levels.SILENT)};var a=typeof window!==f?window.log:void 0;return r.noConflict=function(){return typeof window!==f&&window.log===r&&(window.log=a),r},i(),r});


},{}],3:[function(_dereq_,module,exports){
"use strict";function AudioContextMonkeyPatch(){window.AudioContext=window.AudioContext||window.webkitAudioContext}module.exports=AudioContextMonkeyPatch;


},{}],4:[function(_dereq_,module,exports){
"use strict";function BaseSound(e){function t(e){function t(){log.debug("Booting ",e),n.start(0),n.stop(e.currentTime+1e-4),window.liveAudioContexts.push(e),window.removeEventListener("touchstart",t)}var i=/(iPad|iPhone|iPod)/g.test(navigator.userAgent);if(i&&(window.liveAudioContexts||(window.liveAudioContexts=[]),window.liveAudioContexts.indexOf(e)<0)){var n=e.createOscillator(),o=e.createGain();o.gain.value=0,n.connect(o),o.connect(e.destination),window.addEventListener("touchstart",t)}}void 0===e||null===e?(log.debug("Making a new AudioContext"),this.audioContext=new AudioContext):this.audioContext=e,t(this.audioContext),this.numberOfInputs=0,Object.defineProperty(this,"numberOfOutputs",{enumerable:!0,configurable:!1,get:function(){return this.releaseGainNode.numberOfOutputs}});var i=0;Object.defineProperty(this,"maxSources",{enumerable:!0,configurable:!1,set:function(e){0>e&&(e=0),i=Math.round(e)},get:function(){return i}});var n=0;Object.defineProperty(this,"minSources",{enumerable:!0,configurable:!1,set:function(e){0>e&&(e=0),n=Math.round(e)},get:function(){return n}}),this.releaseGainNode=this.audioContext.createGain(),this.isPlaying=!1,this.isInitialized=!1,this.inputNode=null,this.destinations=[],this.modelName="Model",this.onLoadProgress=null,this.onLoadComplete=null,this.onAudioStart=null,this.onAudioEnd=null,this.isBaseSound=!0,this.parameterList_=[],this.connect(this.audioContext.destination)}_dereq_("../core/AudioContextMonkeyPatch")();var webAudioDispatch=_dereq_("../core/WebAudioDispatch"),log=_dereq_("loglevel");BaseSound.prototype.connect=function(e,t,i){e instanceof AudioNode?(this.releaseGainNode.connect(e,t,i),this.destinations.push({destination:e,output:t,input:i})):e.inputNode instanceof AudioNode?(this.releaseGainNode.connect(e.inputNode,t,i),this.destinations.push({destination:e.inputNode,output:t,input:i})):log.error("No Input Connection - Attempts to connect "+typeof e+" to "+typeof this)},BaseSound.prototype.disconnect=function(e){this.releaseGainNode.disconnect(e),this.destinations=[]},BaseSound.prototype.start=function(e,t,i,n){("undefined"==typeof e||e<this.audioContext.currentTime)&&(e=this.audioContext.currentTime),this.releaseGainNode.gain.cancelScheduledValues(e),"undefined"!=typeof n?(log.debug("Ramping from "+t+"  in "+n),this.releaseGainNode.gain.setValueAtTime(0,e),this.releaseGainNode.gain.linearRampToValueAtTime(1,e+n)):this.releaseGainNode.gain.setValueAtTime(1,e);var o=this;webAudioDispatch(function(){o.isPlaying=!0},e,this.audioContext)},BaseSound.prototype.stop=function(e){("undefined"==typeof e||e<this.audioContext.currentTime)&&(e=this.audioContext.currentTime);var t=this;webAudioDispatch(function(){t.isPlaying=!1},e,this.audioContext),this.releaseGainNode.gain.cancelScheduledValues(e)},BaseSound.prototype.release=function(e,t,i){if(this.isPlaying){var n=.5;if(("undefined"==typeof e||e<this.audioContext.currentTime)&&(e=this.audioContext.currentTime),t=t||n,this.releaseGainNode.gain.setValueAtTime(this.releaseGainNode.gain.value,e),this.releaseGainNode.gain.linearRampToValueAtTime(0,e+t),!i){var o=this;webAudioDispatch(function(){o.pause()},e+t,this.audioContext)}}},BaseSound.prototype.setSources=function(e,t,i){this.isInitialized=!1,"function"==typeof t&&(this.onLoadProgress=t),"function"==typeof i&&(this.onLoadComplete=i)},BaseSound.prototype.play=function(){this.start(0)},BaseSound.prototype.pause=function(){this.isPlaying=!1},BaseSound.prototype.registerParameter=function(e,t){(void 0===t||null===t)&&(t=!1),Object.defineProperty(this,e.name,{enumerable:!0,configurable:t,value:e});var i=this,n=!1;this.parameterList_.forEach(function(t,o){t.name===e.name&&(i.parameterList_.splice(o,1,e),n=!0)}),n||this.parameterList_.push(e)},BaseSound.prototype.listParams=function(){return this.parameterList_},BaseSound.prototype.setOutputEffect=function(e){this.disconnect(),this.connect(e),e.connect(this.audioContext.destination)},module.exports=BaseSound;


},{"../core/AudioContextMonkeyPatch":3,"../core/WebAudioDispatch":11,"loglevel":2}],5:[function(_dereq_,module,exports){
"use strict";function Config(){}Config.LOG_ERRORS=!0,Config.ZERO=parseFloat("1e-37"),Config.MAX_VOICES=8,Config.NOMINAL_REFRESH_RATE=60,Config.WINDOW_LENGTH=512,Config.CHUNK_LENGTH=2048,Config.DEFAULT_SMOOTHING_CONSTANT=.05,module.exports=Config;


},{}],6:[function(_dereq_,module,exports){
"use strict";function DetectLoopMarkers(e){var r=0,n=0,o=!0,u=5e3,t=44100,a=.5,l=2e4,f=.01,c=1024,d=16,g=[],i=0,s=function(e,r){log.debug("Checking for loop marks at "+r);for(var n=0,o=r+d;r+d+c>o;++o)n+=Math.abs(e[o]);return f>n/c},b=function(e){return function(r,n,o){var u;return u=o%2===0?n[e]>a:n[e]<-a,r&&u}},v=function(o){var a=null,f=null;r=0,n=i;for(var c=0;null===a&&i>c&&l>c;){if(o.reduce(b(c),!0)&&(1!==o.length||s(o[0],c))){a=c;break}c++}for(c=i;null===f&&c>0&&l>i-c;){if(o.reduce(b(c),!0)){f=c;break}c--}var d=Math.round(u/2*e.sampleRate/t);return null!==a&&null!==f&&f>a+d?(r=a+d,n=f-d,log.debug("Found loop between "+r+" - "+n),log.debug("Spikes at  "+a+" - "+f),!0):(log.debug("No loop found"),!1)},h=function(e){return function(r,n){return r&&Math.abs(n[e])<f}},p=function(e){var o=!0;for(r=0;l>r&&i>r&&(o=e.reduce(h(r),!0));)r++;for(n=i;l>i-n&&n>0&&(o=e.reduce(h(n),!0));)n--;r>n&&(r=0)};i=e.length;for(var k=0;k<e.numberOfChannels;k++)g.push(new Float32Array(e.getChannelData(k)));return v(g)||(p(g),o=!1),{marked:o,start:r,end:n}}var log=_dereq_("loglevel");module.exports=DetectLoopMarkers;


},{"loglevel":2}],7:[function(_dereq_,module,exports){
"use strict";function FileLoader(e,r,t,n){function a(){var r=Object.prototype.toString.call(e),t=/[^.]+$/.exec(e);if("[object String]"===r){var a=new XMLHttpRequest;a.open("GET",e,!0),a.responseType="arraybuffer",a.addEventListener("progress",n,!1),a.onload=function(){o(a.response,t)},a.send()}else if("[object File]"===r||"[object Blob]"===r){var i=new FileReader;i.addEventListener("progress",n,!1),i.onload=function(){o(i.result,t)},i.readAsArrayBuffer(e)}}function o(n,a){r.decodeAudioData(n,function(e){if(l=!0,i=e,u=0,f=i.length,"wav"!==a[0]){var r=detectLoopMarkers(i);r&&(u=r.start,f=r.end)}t&&"function"==typeof t&&t(!0)},function(){log.error("Error Decoding "+e),t&&"function"==typeof t&&t(!1)})}if(!(this instanceof FileLoader))throw new TypeError("FileLoader constructor cannot be called as a function.");var i,u=0,f=0,l=!1,s=function(e){var r=/^[0-9]+$/;return r.test(e)?!0:!1},d=function(e,t){"undefined"==typeof t&&(t=i.length),s(e)?s(t)||(log.debug("Incorrect parameter Type - FileLoader getBuffer end parameter is not an integer"),t=Number.isNan(t)?0:Math.round(Number(t))):(e=Number.isNan(e)?0:Math.round(Number(e)),log.debug("Incorrect parameter Type - FileLoader getBuffer start parameter is not an integer. Coercing it to an Integer - start")),e>t&&(log.warn("Incorrect parameter Type - FileLoader getBuffer start parameter "+e+" should be smaller than end parameter "+t+" . Setting them to the same value "+e),t=e),(e>f||u>e)&&(log.warn("Incorrect parameter Type - FileLoader getBuffer start parameter should be within the buffer size : 0-"+i.length+" . Setting start to "+u),e=u),(t>f||u>t)&&(log.warn("Incorrect parameter Type - FileLoader getBuffer start parameter should be within the buffer size : 0-"+i.length+" . Setting start to "+f),t=f);var n=t-e;if(!i)return log.error("No Buffer Found - Buffer loading has not completed or has failed."),null;for(var a=r.createBuffer(i.numberOfChannels,n,i.sampleRate),o=0;o<i.numberOfChannels;o++){var l=new Float32Array(i.getChannelData(o));a.getChannelData(o).set(l.subarray(e,t))}return a};this.getBuffer=function(e,r){return"undefined"==typeof e&&(e=0),"undefined"==typeof r&&(r=f-u),d(u+e,u+r)},this.getRawBuffer=function(){return l?i:(log.error("No Buffer Found - Buffer loading has not completed or has failed."),null)},this.isLoaded=function(){return l},a()}var detectLoopMarkers=_dereq_("../core/DetectLoopMarkers"),log=_dereq_("loglevel");module.exports=FileLoader;


},{"../core/DetectLoopMarkers":6,"loglevel":2}],8:[function(_dereq_,module,exports){
"use strict";function MultiFileLoader(e,o,r,u){function i(){if(!e)return log.debug("Setting empty source. No sound may be heard"),void u(!1,c);if(!(e instanceof Array)){var o=[];o.push(e),e=o}return e.length<f.minSources||e.length>f.maxSources?(log.error("Unsupported number of Sources. "+f.modelName+" only supports a minimum of "+f.minSources+" and a maximum of "+f.maxSources+" sources. Trying to load "+e.length+"."),void u(!1,c)):(a=e.length,c=new Array(a),void e.forEach(function(e,o){t(e,n(o))}))}function t(e,o){var u,i=Object.prototype.toString.call(e);if("[object AudioBuffer]"===i)u=new SPAudioBuffer(f.audioContext,e),o(!0,u);else if(e.isSPAudioBuffer&&e.buffer)o(!0,e);else if("[object String]"===i||"[object File]"===i||e.isSPAudioBuffer&&e.sourceURL){var t;e.isSPAudioBuffer&&e.sourceURL?(t=e.sourceURL,u=e):(t=e,u=new SPAudioBuffer(f.audioContext,t));var n=new FileLoader(t,f.audioContext,function(e){e?(u.buffer=n.getBuffer(),o(e,u)):o(e)},function(e){r&&"function"==typeof r&&r(e,u)})}else log.error("Incorrect Parameter Type - Source is not a URL, File or AudioBuffer or doesn't have sourceURL or buffer"),o(!1,{})}function n(e){return function(o,r){if(o&&(log.debug("Loaded track",e,"successfully"),c[e]=r),a--,0===a){for(var i=!0,t=0;t<c.length;++t)if(!c[t]){i=!1;break}u(i,c)}}}var f=this;this.audioContext=o;var a=0,c=[];i()}var FileLoader=_dereq_("../core/FileLoader"),SPAudioBuffer=_dereq_("../core/SPAudioBuffer"),log=_dereq_("loglevel");module.exports=MultiFileLoader;


},{"../core/FileLoader":7,"../core/SPAudioBuffer":9,"loglevel":2}],9:[function(_dereq_,module,exports){
"use strict";function SPAudioBuffer(e,t,r,n,o){if(!(e instanceof AudioContext))return void log.error("First argument to SPAudioBuffer must be a valid AudioContext");var i,a,u,f;this.audioContext=e,this.duration=null,Object.defineProperty(this,"numberOfChannels",{get:function(){return this.buffer?this.buffer.numberOfChannels:0}}),Object.defineProperty(this,"sampleRate",{get:function(){return this.buffer?this.buffer.sampleRate:0}}),this.getChannelData=function(e){return this.buffer?this.buffer.getChannelData(e):null},this.isSPAudioBuffer=!0,Object.defineProperty(this,"buffer",{set:function(e){if(null===u)this.startPoint=0;else if(u>e.length/e.sampleRate)return void log.error("SPAudioBuffer : startPoint cannot be greater than buffer length");if(null===f)this.endPoint=this.rawBuffer_.length;else if(f>e.length/e.sampleRate)return void log.error("SPAudioBuffer : endPoint cannot be greater than buffer length");a=e,this.updateBuffer()}.bind(this),get:function(){return i}}),this.sourceURL=null,Object.defineProperty(this,"startPoint",{set:function(e){return void 0!==f&&e>=f?void log.error("SPAudioBuffer : startPoint cannot be greater than endPoint"):a&&e*a.sampleRate>=a.length?void log.error("SPAudioBuffer : startPoint cannot be greater than or equal to buffer length"):(u=e,void this.updateBuffer())}.bind(this),get:function(){return u}}),Object.defineProperty(this,"endPoint",{set:function(e){return void 0!==u&&u>=e?void log.error("SPAudioBuffer : endPoint cannot be lesser than startPoint"):a&&e*a.sampleRate>=a.length?void log.error("SPAudioBuffer : endPoint cannot be greater than buffer or equal to length"):(f=e,void this.updateBuffer())}.bind(this),get:function(){return f}}),this.updateBuffer=function(){if(a){if((null===u||void 0===u)&&(u=0),(null===f||void 0===f)&&(f=a.duration),this.duration=f-u,this.length=Math.ceil(a.sampleRate*this.duration)+1,this.length>0){i&&i.length==this.length&&i.numberOfChannels==a.numberOfChannels&&i.sampleRate==a.sampleRate||(i=this.audioContext.createBuffer(a.numberOfChannels,this.length,a.sampleRate));for(var e=Math.floor(u*a.sampleRate),t=Math.ceil(f*a.sampleRate),r=0;r<a.numberOfChannels;r++){var n=new Float32Array(a.getChannelData(r));i.getChannelData(r).set(n.subarray(e,t))}}}else this.duration=0};var l=Object.prototype.toString.call(t),s=Object.prototype.toString.call(r),h=Object.prototype.toString.call(n),d=Object.prototype.toString.call(o);"[object String]"===l||"[object File]"===l?this.sourceURL=t:"[object AudioBuffer]"===l?this.buffer=t:log.error("Incorrect Parameter Type. url can only be a String, File or an AudioBuffer"),"[object Number]"===s?this.startPoint=parseFloat(r):"[object Undefined]"!==s&&log.warn("Incorrect Parameter Type. startPoint should be a Number. Setting startPoint to 0"),"[object Number]"===h?this.endPoint=parseFloat(n):"[object Undefined]"!==s&&log.warn("Incorrect Parameter Type. endPoint should be a Number. Setting endPoint to end of dile"),"[object AudioBuffer]"!==d||this.buffer||(this.buffer=o)}var log=_dereq_("loglevel");module.exports=SPAudioBuffer;


},{"loglevel":2}],10:[function(_dereq_,module,exports){
"use strict";function SPAudioParam(e,t,a,i,n,o,u,r){var l,f=1e-4,c=500,s=0,m=!1;if(this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="",this.isSPAudioParam=!0,Object.defineProperty(this,"value",{enumerable:!0,configurable:!1,set:function(f){if(log.debug("Setting param",t,"value to",f),typeof f!=typeof n)return void log.error("Attempt to set a",typeof n,"parameter to a",typeof f,"value");if("number"==typeof f&&(f>i?(log.debug(this.name,"clamping to max"),f=i):a>f&&(log.debug(this.name+" clamping to min"),f=a)),s=f,"function"==typeof u&&(f=u(f)),m||(log.debug("Clearing Automation for",t),window.clearInterval(l)),m=!1,"function"==typeof r&&e.audioContext)r(o,f,e.audioContext);else if(o){if(o instanceof AudioParam){var c=[];c.push(o),o=c}o.forEach(function(a){e.isPlaying?a.setTargetAtTime(f,e.audioContext.currentTime,Config.DEFAULT_SMOOTHING_CONSTANT):(log.debug("Setting param",t,"through setter"),a.setValueAtTime(f,e.audioContext.currentTime))})}},get:function(){return s}}),o&&(o instanceof AudioParam||o instanceof Array))var d=o[0]||o;t?this.name=t:d&&(this.name=d.name),"undefined"!=typeof n?(this.defaultValue=n,this.value=n):d&&(this.defaultValue=d.defaultValue,this.value=d.defaultValue),"undefined"!=typeof a?this.minValue=a:d&&(this.minValue=d.minValue),"undefined"!=typeof i?this.maxValue=i:d&&(this.maxValue=d.maxValue),this.setValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.setValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.setValueAtTime(t,a)});else{var i=this;webAudioDispatch(function(){i.value=t},a,e.audioContext)}},this.setTargetAtTime=function(t,a,i){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.setTargetAtTime(t,a,i):o instanceof Array&&o.forEach(function(e){e.setTargetAtTime(t,a,i)});else{var n=this,r=n.value,s=e.audioContext.currentTime;log.debug("starting automation"),l=window.setInterval(function(){e.audioContext.currentTime>=a&&(m=!0,n.value=t+(r-t)*Math.exp(-(e.audioContext.currentTime-s)/i),Math.abs(n.value-t)<f&&window.clearInterval(l))},c)}},this.setValueCurveAtTime=function(t,a,i){if(o){if("function"==typeof u)for(var n=0;n<t.length;n++)t[n]=u(t[n]);o instanceof AudioParam?o.setValueCurveAtTime(t,a,i):o instanceof Array&&o.forEach(function(e){e.setValueCurveAtTime(t,a,i)})}else{var r=this,f=e.audioContext.currentTime;l=window.setInterval(function(){if(e.audioContext.currentTime>=a){var n=Math.floor(t.length*(e.audioContext.currentTime-f)/i);n<t.length?(m=!0,r.value=t[n]):window.clearInterval(l)}},c)}},this.exponentialRampToValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.exponentialRampToValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.exponentialRampToValueAtTime(t,a)});else{var i=this,n=i.value,r=e.audioContext.currentTime;0===n&&(n=.001),l=window.setInterval(function(){var o=(e.audioContext.currentTime-r)/(a-r);m=!0,i.value=n*Math.pow(t/n,o),e.audioContext.currentTime>=a&&window.clearInterval(l)},c)}},this.linearRampToValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.linearRampToValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.linearRampToValueAtTime(t,a)});else{var i=this,n=i.value,r=e.audioContext.currentTime;l=window.setInterval(function(){var o=(e.audioContext.currentTime-r)/(a-r);m=!0,i.value=n+(t-n)*o,e.audioContext.currentTime>=a&&window.clearInterval(l)},c)}},this.cancelScheduledValues=function(e){o?o instanceof AudioParam?o.cancelScheduledValues(e):o instanceof Array&&o.forEach(function(t){t.cancelScheduledValues(e)}):window.clearInterval(l)}}var webAudioDispatch=_dereq_("../core/WebAudioDispatch"),Config=_dereq_("../core/Config"),log=_dereq_("loglevel");SPAudioParam.createPsuedoParam=function(e,t,a,i,n){return new SPAudioParam(e,t,a,i,n,null,null,null)},module.exports=SPAudioParam;


},{"../core/Config":5,"../core/WebAudioDispatch":11,"loglevel":2}],11:[function(_dereq_,module,exports){
"use strict";function WebAudioDispatch(e,i,o){if(!o)return void log.error("No AudioContext provided");var t=o.currentTime;t>=i||.005>i-t?(log.debug("Dispatching now"),e()):(log.debug("Dispatching in",1e3*(i-t),"ms"),window.setTimeout(function(){log.debug("Diff at dispatch",1e3*(i-o.currentTime),"ms"),e()},1e3*(i-t)))}var log=_dereq_("loglevel");module.exports=WebAudioDispatch;


},{"loglevel":2}]},{},[1])(1)
});