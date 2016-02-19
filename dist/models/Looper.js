/*soundmodels - v2.6.3 - Fri Feb 19 2016 15:30:29 GMT+0800 (SGT) */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Looper = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
!function(e,o){"use strict";"object"==typeof module&&module.exports&&"function"==typeof _dereq_?module.exports=o():"function"==typeof define&&"object"==typeof define.amd?define(o):e.log=o()}(this,function(){"use strict";function e(e){return typeof console===c?!1:void 0!==console[e]?o(console,e):void 0!==console.log?o(console,"log"):i}function o(e,o){var t=e[o];if("function"==typeof t.bind)return t.bind(e);try{return Function.prototype.bind.call(t,e)}catch(n){return function(){return Function.prototype.apply.apply(t,[e,arguments])}}}function t(e,o,t){return function(){typeof console!==c&&(n.call(this,o,t),this[e].apply(this,arguments))}}function n(e,o){for(var t=0;t<u.length;t++){var n=u[t];this[n]=e>t?i:this.methodFactory(n,e,o)}}function l(o,n,l){return e(o)||t.apply(this,arguments)}function r(e,o,t){function r(e){var o=(u[e]||"silent").toUpperCase();try{return void(window.localStorage[s]=o)}catch(t){}try{window.document.cookie=encodeURIComponent(s)+"="+o+";"}catch(t){}}function i(){var e;try{e=window.localStorage[s]}catch(o){}if(typeof e===c)try{var t=window.document.cookie,n=t.indexOf(encodeURIComponent(s)+"=");n&&(e=/^([^;]+)/.exec(t.slice(n))[1])}catch(o){}return void 0===f.levels[e]&&(e=void 0),e}var a,f=this,s="loglevel";e&&(s+=":"+e),f.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},f.methodFactory=t||l,f.getLevel=function(){return a},f.setLevel=function(o,t){if("string"==typeof o&&void 0!==f.levels[o.toUpperCase()]&&(o=f.levels[o.toUpperCase()]),!("number"==typeof o&&o>=0&&o<=f.levels.SILENT))throw"log.setLevel() called with invalid level: "+o;return a=o,t!==!1&&r(o),n.call(f,o,e),typeof console===c&&o<f.levels.SILENT?"No console available for logging":void 0},f.setDefaultLevel=function(e){i()||f.setLevel(e,!1)},f.enableAll=function(e){f.setLevel(f.levels.TRACE,e)},f.disableAll=function(e){f.setLevel(f.levels.SILENT,e)};var d=i();null==d&&(d=null==o?"WARN":o),f.setLevel(d,!1)}var i=function(){},c="undefined",u=["trace","debug","info","warn","error"],a=new r,f={};a.getLogger=function(e){if("string"!=typeof e||""===e)throw new TypeError("You must supply a name when creating a logger.");var o=f[e];return o||(o=f[e]=new r(e,a.getLevel(),a.methodFactory)),o};var s=typeof window!==c?window.log:void 0;return a.noConflict=function(){return typeof window!==c&&window.log===a&&(window.log=s),a},a});

},{}],2:[function(_dereq_,module,exports){
"use strict";function AudioContextMonkeyPatch(){window.AudioContext=window.AudioContext||window.webkitAudioContext}module.exports=AudioContextMonkeyPatch;

},{}],3:[function(_dereq_,module,exports){
"use strict";function BaseSound(e){function t(e){function t(){var i=e.createBuffer(1,1,a),n=e.createBufferSource();n.buffer=i,n.connect(e.destination),n.start(0),n.disconnect(),e.state&&"suspended"===e.state&&e.resume(),log.debug("currentTime & state ",e.currentTime,e.state),setTimeout(function(){e.state&&"running"===e.state&&(log.debug("context state",e.state),document.body.removeEventListener("touchend",t))},0)}var i=/(iPad|iPhone|iPod)/g.test(navigator.userAgent),n=/Safari/.test(navigator.userAgent)&&/Apple Computer/.test(navigator.vendor),a="number"==typeof a?a:44100;n&&e.state&&"suspended"===e.state&&e.resume(),(i||n)&&(window.liveAudioContexts||(window.liveAudioContexts=[]),window.liveAudioContexts.indexOf(e)<0&&(log.debug("audio context created"),document.body.addEventListener("touchend",t),window.liveAudioContexts.push(e)))}void 0===e||null===e?(log.debug("Making a new AudioContext"),this.audioContext=new SafeAudioContext):this.audioContext=e,t(this.audioContext),this.numberOfInputs=0,Object.defineProperty(this,"numberOfOutputs",{enumerable:!0,configurable:!1,get:function(){return this.releaseGainNode.numberOfOutputs}});var i=0;Object.defineProperty(this,"maxSources",{enumerable:!0,configurable:!1,set:function(e){0>e&&(e=0),i=Math.round(e)},get:function(){return i}});var n=0;Object.defineProperty(this,"minSources",{enumerable:!0,configurable:!1,set:function(e){0>e&&(e=0),n=Math.round(e)},get:function(){return n}}),this.releaseGainNode=this.audioContext.createGain(),this.releaseGainNode.gain.prevEndTime=0,this.isPlaying=!1,this.isInitialized=!1,this.inputNode=null,this.destinations=[],this.modelName="Model",this.onLoadProgress=null,this.onLoadComplete=null,this.onAudioStart=null,this.onAudioEnd=null,this.isBaseSound=!0,this.dispatches_=[],this.parameterList_=[],this.connect(this.audioContext.destination)}var SafeAudioContext=_dereq_("../core/SafeAudioContext"),webAudioDispatch=_dereq_("../core/WebAudioDispatch"),log=_dereq_("loglevel");BaseSound.prototype.connect=function(e,t,i){e instanceof AudioNode?(this.releaseGainNode.connect(e,t,i),this.destinations.push({destination:e,output:t,input:i})):e.inputNode instanceof AudioNode?(this.releaseGainNode.connect(e.inputNode,t,i),this.destinations.push({destination:e.inputNode,output:t,input:i})):log.error("No Input Connection - Attempts to connect "+typeof e+" to "+typeof this)},BaseSound.prototype.disconnect=function(e){this.releaseGainNode.disconnect(e),this.destinations=[]},BaseSound.prototype.start=function(e,t,i,n){("undefined"==typeof e||e<this.audioContext.currentTime)&&(e=this.audioContext.currentTime);var a=1;this.releaseGainNode.gain.prevEndTime>e&&(a=this.releaseGainNode.gain.prevStartValue+(this.releaseGainNode.gain.prevTargetValue-this.releaseGainNode.gain.prevStartValue)*((e-this.releaseGainNode.gain.prevStartTime)/(this.releaseGainNode.gain.prevEndTime-this.releaseGainNode.gain.prevStartTime))),this.releaseGainNode.gain.cancelScheduledValues(e),"undefined"!=typeof n?(log.debug("Ramping from "+t+"  in "+n),this.releaseGainNode.gain.setValueAtTime(a,e),this.releaseGainNode.gain.linearRampToValueAtTime(1,e+n),this.releaseGainNode.gain.prevStartTime=e,this.releaseGainNode.gain.prevStartValue=a,this.releaseGainNode.gain.prevTargetValue=1,this.releaseGainNode.gain.prevEndTime=e+n):(this.releaseGainNode.gain.setValueAtTime(1,e),this.releaseGainNode.gain.prevStartTime=e,this.releaseGainNode.gain.prevStartValue=1,this.releaseGainNode.gain.prevTargetValue=1,this.releaseGainNode.gain.prevEndTime=e);var o=this;this.dispatch(function(){o.isPlaying=!0},e)},BaseSound.prototype.stop=function(e){("undefined"==typeof e||e<this.audioContext.currentTime)&&(e=this.audioContext.currentTime);var t=this;this.dispatch(function(){t.isPlaying=!1,t.clearDispatches()},e)},BaseSound.prototype.release=function(e,t,i){if(this.isPlaying){var n=.5;("undefined"==typeof e||e<this.audioContext.currentTime)&&(e=this.audioContext.currentTime),t=t||n;var a=1;if(this.releaseGainNode.gain.prevEndTime>e&&(a=this.releaseGainNode.gain.prevStartValue+(this.releaseGainNode.gain.prevTargetValue-this.releaseGainNode.gain.prevStartValue)*((e-this.releaseGainNode.gain.prevStartTime)/(this.releaseGainNode.gain.prevEndTime-this.releaseGainNode.gain.prevStartTime))),this.releaseGainNode.gain.cancelScheduledValues(e),this.releaseGainNode.gain.setValueAtTime(a,e),this.releaseGainNode.gain.linearRampToValueAtTime(0,e+t),this.releaseGainNode.gain.prevStartTime=e,this.releaseGainNode.gain.prevStartValue=a,this.releaseGainNode.gain.prevTargetValue=0,this.releaseGainNode.gain.prevEndTime=e+t,!i){var o=this;this.dispatch(function(){o.pause()},e+t)}}},BaseSound.prototype.setSources=function(e,t,i){this.isInitialized=!1,"function"==typeof t&&(this.onLoadProgress=t),"function"==typeof i&&(this.onLoadComplete=i)},BaseSound.prototype.play=function(){this.start(0)},BaseSound.prototype.pause=function(){this.isPlaying=!1},BaseSound.prototype.registerParameter=function(e,t){(void 0===t||null===t)&&(t=!1),Object.defineProperty(this,e.name,{enumerable:!0,configurable:t,value:e});var i=this,n=!1;this.parameterList_.forEach(function(t,a){t.name===e.name&&(i.parameterList_.splice(a,1,e),n=!0)}),n||this.parameterList_.push(e)},BaseSound.prototype.listParams=function(){return this.parameterList_},BaseSound.prototype.setOutputEffect=function(e){this.disconnect(),this.connect(e),e.connect(this.audioContext.destination)},BaseSound.prototype.dispatch=function(e,t){var i=webAudioDispatch(function(){if("undefined"!=typeof i){var t=this.dispatches_.indexOf(i);t>-1?this.dispatches_.splice(t,1):log.warn("Can't find ID",i,"in the list of dispatches")}e()}.bind(this),t,this.audioContext);null!==i&&this.dispatches_.push(i)},BaseSound.prototype.clearDispatches=function(){this.dispatches_.forEach(function(e){log.debug("Clearing timeout for",e),window.clearInterval(e)}),this.dispatches_=[]},module.exports=BaseSound;

},{"../core/SafeAudioContext":12,"../core/WebAudioDispatch":13,"loglevel":1}],4:[function(_dereq_,module,exports){
"use strict";function Config(){}Config.LOG_ERRORS=!0,Config.ZERO=parseFloat("1e-37"),Config.MAX_VOICES=8,Config.NOMINAL_REFRESH_RATE=60,Config.WINDOW_LENGTH=512,Config.CHUNK_LENGTH=2048,Config.DEFAULT_SMOOTHING_CONSTANT=.05,module.exports=Config;

},{}],5:[function(_dereq_,module,exports){
"use strict";function DetectLoopMarkers(e){var r=0,n=0,o=!0,u=5e3,t=44100,a=.5,l=2e4,f=.01,c=1024,d=16,g=[],i=0,s=function(e,r){log.debug("Checking for loop marks at "+r);for(var n=0,o=r+d;r+d+c>o;++o)n+=Math.abs(e[o]);return f>n/c},b=function(e){return function(r,n,o){var u;return u=o%2===0?n[e]>a:n[e]<-a,r&&u}},v=function(o){var a=null,f=null;r=0,n=i;for(var c=0;null===a&&i>c&&l>c;){if(o.reduce(b(c),!0)&&(1!==o.length||s(o[0],c))){a=c;break}c++}for(c=i;null===f&&c>0&&l>i-c;){if(o.reduce(b(c),!0)){f=c;break}c--}var d=Math.round(u/2*e.sampleRate/t);return null!==a&&null!==f&&f>a+d?(r=a+d,n=f-d,log.debug("Found loop between "+r+" - "+n),log.debug("Spikes at  "+a+" - "+f),!0):(log.debug("No loop found"),!1)},h=function(e){return function(r,n){return r&&Math.abs(n[e])<f}},p=function(e){var o=!0;for(r=0;l>r&&i>r&&(o=e.reduce(h(r),!0));)r++;for(n=i;l>i-n&&n>0&&(o=e.reduce(h(n),!0));)n--;r>n&&(r=0)};i=e.length;for(var k=0;k<e.numberOfChannels;k++)g.push(new Float32Array(e.getChannelData(k)));return v(g)||(p(g),o=!1),{marked:o,start:r,end:n}}var log=_dereq_("loglevel");module.exports=DetectLoopMarkers;

},{"loglevel":1}],6:[function(_dereq_,module,exports){
"use strict";function FileLoader(e,r,t,n){function a(){var r=Object.prototype.toString.call(e),t=/[^.]+$/.exec(e);if("[object String]"===r){var a=new XMLHttpRequest;a.open("GET",e,!0),a.responseType="arraybuffer",a.addEventListener("progress",n,!1),a.onload=function(){o(a.response,t)},a.send()}else if("[object File]"===r||"[object Blob]"===r){var i=new FileReader;i.addEventListener("progress",n,!1),i.onload=function(){o(i.result,t)},i.readAsArrayBuffer(e)}}function o(n,a){r.decodeAudioData(n,function(e){if(l=!0,i=e,u=0,f=i.length,"wav"!==a[0]){var r=detectLoopMarkers(i);r&&(u=r.start,f=r.end)}t&&"function"==typeof t&&t(!0)},function(){log.error("Error Decoding "+e),t&&"function"==typeof t&&t(!1)})}if(!(this instanceof FileLoader))throw new TypeError("FileLoader constructor cannot be called as a function.");var i,u=0,f=0,l=!1,s=function(e){var r=/^[0-9]+$/;return r.test(e)?!0:!1},d=function(e,t){"undefined"==typeof t&&(t=i.length),s(e)?s(t)||(log.debug("Incorrect parameter Type - FileLoader getBuffer end parameter is not an integer"),t=Number.isNan(t)?0:Math.round(Number(t))):(e=Number.isNan(e)?0:Math.round(Number(e)),log.debug("Incorrect parameter Type - FileLoader getBuffer start parameter is not an integer. Coercing it to an Integer - start")),e>t&&(log.warn("Incorrect parameter Type - FileLoader getBuffer start parameter "+e+" should be smaller than end parameter "+t+" . Setting them to the same value "+e),t=e),(e>f||u>e)&&(log.warn("Incorrect parameter Type - FileLoader getBuffer start parameter should be within the buffer size : 0-"+i.length+" . Setting start to "+u),e=u),(t>f||u>t)&&(log.warn("Incorrect parameter Type - FileLoader getBuffer start parameter should be within the buffer size : 0-"+i.length+" . Setting start to "+f),t=f);var n=t-e;if(!i)return log.error("No Buffer Found - Buffer loading has not completed or has failed."),null;for(var a=r.createBuffer(i.numberOfChannels,n,i.sampleRate),o=0;o<i.numberOfChannels;o++){var l=new Float32Array(i.getChannelData(o));a.getChannelData(o).set(l.subarray(e,t))}return a};this.getBuffer=function(e,r){return"undefined"==typeof e&&(e=0),"undefined"==typeof r&&(r=f-u),d(u+e,u+r)},this.getRawBuffer=function(){return l?i:(log.error("No Buffer Found - Buffer loading has not completed or has failed."),null)},this.isLoaded=function(){return l},a()}var detectLoopMarkers=_dereq_("../core/DetectLoopMarkers"),log=_dereq_("loglevel");module.exports=FileLoader;

},{"../core/DetectLoopMarkers":5,"loglevel":1}],7:[function(_dereq_,module,exports){
"use strict";function MultiFileLoader(e,o,r,u){function i(){if(!e)return log.debug("Setting empty source. No sound may be heard"),void u(!1,c);if(!(e instanceof Array)){var o=[];o.push(e),e=o}return e.length<f.minSources||e.length>f.maxSources?(log.error("Unsupported number of Sources. "+f.modelName+" only supports a minimum of "+f.minSources+" and a maximum of "+f.maxSources+" sources. Trying to load "+e.length+"."),void u(!1,c)):(a=e.length,c=new Array(a),void e.forEach(function(e,o){t(e,n(o))}))}function t(e,o){var u,i=Object.prototype.toString.call(e);if("[object AudioBuffer]"===i)u=new SPAudioBuffer(f.audioContext,e),o(!0,u);else if(e&&e.isSPAudioBuffer&&e.buffer)o(!0,e);else if("[object String]"===i||"[object File]"===i||e.isSPAudioBuffer&&e.sourceURL){var t;e.isSPAudioBuffer&&e.sourceURL?(t=e.sourceURL,u=e):(t=e,u=new SPAudioBuffer(f.audioContext,t));var n=new FileLoader(t,f.audioContext,function(e){e?(u.buffer=n.getBuffer(),o(e,u)):o(e)},function(e){r&&"function"==typeof r&&r(e,u)})}else log.error("Incorrect Parameter Type - Source is not a URL, File or AudioBuffer or doesn't have sourceURL or buffer"),o(!1,{})}function n(e){return function(o,r){if(o&&(log.debug("Loaded track",e,"successfully"),c[e]=r),a--,0===a){for(var i=!0,t=0;t<c.length;++t)if(!c[t]){i=!1;break}u(i,c)}}}var f=this;this.audioContext=o;var a=0,c=[];i()}var FileLoader=_dereq_("../core/FileLoader"),SPAudioBuffer=_dereq_("../core/SPAudioBuffer"),log=_dereq_("loglevel");module.exports=MultiFileLoader;

},{"../core/FileLoader":6,"../core/SPAudioBuffer":8,"loglevel":1}],8:[function(_dereq_,module,exports){
"use strict";function SPAudioBuffer(e,t,r,n,o){if(!(e instanceof AudioContext))return void log.error("First argument to SPAudioBuffer must be a valid AudioContext");var i,a,u,f;this.audioContext=e,this.duration=null,Object.defineProperty(this,"numberOfChannels",{get:function(){return this.buffer?this.buffer.numberOfChannels:0}}),Object.defineProperty(this,"sampleRate",{get:function(){return this.buffer?this.buffer.sampleRate:0}}),this.getChannelData=function(e){return this.buffer?this.buffer.getChannelData(e):null},this.isSPAudioBuffer=!0,Object.defineProperty(this,"buffer",{set:function(e){if(null===u)this.startPoint=0;else if(u>e.length/e.sampleRate)return void log.error("SPAudioBuffer : startPoint cannot be greater than buffer length");if(null===f)this.endPoint=this.rawBuffer_.length;else if(f>e.length/e.sampleRate)return void log.error("SPAudioBuffer : endPoint cannot be greater than buffer length");a=e,this.updateBuffer()}.bind(this),get:function(){return i}}),this.sourceURL=null,Object.defineProperty(this,"startPoint",{set:function(e){return void 0!==f&&e>=f?void log.error("SPAudioBuffer : startPoint cannot be greater than endPoint"):a&&e*a.sampleRate>=a.length?void log.error("SPAudioBuffer : startPoint cannot be greater than or equal to buffer length"):(u=e,void this.updateBuffer())}.bind(this),get:function(){return u}}),Object.defineProperty(this,"endPoint",{set:function(e){return void 0!==u&&u>=e?void log.error("SPAudioBuffer : endPoint cannot be lesser than startPoint"):a&&e*a.sampleRate>=a.length?void log.error("SPAudioBuffer : endPoint cannot be greater than buffer or equal to length"):(f=e,void this.updateBuffer())}.bind(this),get:function(){return f}}),this.updateBuffer=function(){if(a){if((null===u||void 0===u)&&(u=0),(null===f||void 0===f)&&(f=a.duration),this.duration=f-u,this.length=Math.ceil(a.sampleRate*this.duration)+1,this.length>0){i&&i.length==this.length&&i.numberOfChannels==a.numberOfChannels&&i.sampleRate==a.sampleRate||(i=this.audioContext.createBuffer(a.numberOfChannels,this.length,a.sampleRate));for(var e=Math.floor(u*a.sampleRate),t=Math.ceil(f*a.sampleRate),r=0;r<a.numberOfChannels;r++){var n=new Float32Array(a.getChannelData(r));i.getChannelData(r).set(n.subarray(e,t))}}}else this.duration=0};var l=Object.prototype.toString.call(t),s=Object.prototype.toString.call(r),h=Object.prototype.toString.call(n),d=Object.prototype.toString.call(o);"[object String]"===l||"[object File]"===l?this.sourceURL=t:"[object AudioBuffer]"===l?this.buffer=t:log.error("Incorrect Parameter Type. url can only be a String, File or an AudioBuffer"),"[object Number]"===s?this.startPoint=parseFloat(r):"[object Undefined]"!==s&&log.warn("Incorrect Parameter Type. startPoint should be a Number. Setting startPoint to 0"),"[object Number]"===h?this.endPoint=parseFloat(n):"[object Undefined]"!==s&&log.warn("Incorrect Parameter Type. endPoint should be a Number. Setting endPoint to end of dile"),"[object AudioBuffer]"!==d||this.buffer||(this.buffer=o)}var log=_dereq_("loglevel");module.exports=SPAudioBuffer;

},{"loglevel":1}],9:[function(_dereq_,module,exports){
"use strict";function SPAudioBufferSourceNode(e){function t(t){for(var n=new Float32Array(t.length),a=e.createBuffer(1,t.length,44100),o=0;o<t.length;o++)n[o]=o;return a.getChannelData(0).set(n),a}function n(){c.connect(i),c.onaudioprocess=a}function a(e){var t=e.inputBuffer.getChannelData(0);f=t[t.length-1]||0}function o(e,t){return function(n){e.playbackState=e.FINISHED_STATE,"function"==typeof t&&t(n)}}var r,u=e.createBufferSource(),c=e.createScriptProcessor(256,1,1),i=e.createGain(),f=0;this.audioContext=e,this.playbackState=0,this.channelCount=null,this.channelCountMode=null,this.channelInterpretation=null,this.numberOfInputs=null,this.numberOfOutputs=null,this.UNSCHEDULED_STATE=0,this.SCHEDULED_STATE=1,this.PLAYING_STATE=2,this.FINISHED_STATE=3,this.playbackRate=null,Object.defineProperty(this,"loopEnd",{enumerable:!0,configurable:!1,set:function(e){u.loopEnd=e,r.loopEnd=e},get:function(){return u.loopEnd}}),Object.defineProperty(this,"loopStart",{enumerable:!0,configurable:!1,set:function(e){u.loopStart=e,r.loopStart=e},get:function(){return u.loopStart}}),Object.defineProperty(this,"onended",{enumerable:!0,configurable:!1,set:function(e){u.onended=o(this,e)},get:function(){return u.onended}}),Object.defineProperty(this,"loop",{enumerable:!0,configurable:!1,set:function(e){u.loop=e,r.loop=e},get:function(){return u.loop}}),Object.defineProperty(this,"playbackPosition",{enumerable:!0,configurable:!1,get:function(){return f}}),Object.defineProperty(this,"buffer",{enumerable:!0,configurable:!1,set:function(n){u&&u.disconnect(),r&&r.disconnect(),u=e.createBufferSource(),r=e.createBufferSource(),n.isSPAudioBuffer?(u.buffer=n.buffer,r.buffer=t(n.buffer)):n instanceof AudioBuffer&&(u.buffer=n,r.buffer=t(n)),r.connect(c),u.connect(i),this.channelCount=u.channelCount,this.channelCountMode=u.channelCountMode,this.channelInterpretation=u.channelInterpretation,this.numberOfInputs=u.numberOfInputs,this.numberOfOutputs=u.numberOfOutputs,this.playbackRate=new SPPlaybackRateParam(this,u.playbackRate,r.playbackRate)},get:function(){return u.buffer}}),Object.defineProperty(this,"gain",{enumerable:!0,configurable:!1,get:function(){return i.gain}}),this.connect=function(e,t,n){i.connect(e,t,n)},this.disconnect=function(e){i.disconnect(e)},this.start=function(e,t,n){this.playbackState===this.UNSCHEDULED_STATE&&(void 0===n||null===n?(u.start(e,t),r.start(e,t)):(u.start(e,t,n),r.start(e,t,n)),this.playbackState=this.SCHEDULED_STATE);var a=this;webAudioDispatch(function(){a.playbackState=a.PLAYING_STATE},e,this.audioContext)},this.stop=function(e){(this.playbackState===this.PLAYING_STATE||this.playbackState===this.SCHEDULED_STATE)&&(u.stop(e),r.stop(e))},this.resetBufferSource=function(t,n){var a=this;webAudioDispatch(function(){log.debug("Resetting BufferSource",a.buffer.length),c.disconnect();var t=a.audioContext.createGain();t.gain.value=i.gain.value,i=t;var f=a.audioContext.createBufferSource();f.buffer=u.buffer,f.loopStart=u.loopStart,f.loopEnd=u.loopEnd,f.onended=o(a,u.onended),u.onended=null,r.disconnect();var l=e.createBufferSource();l.buffer=r.buffer,u=f,r=l;var s=a.playbackRate.value;a.playbackRate=new SPPlaybackRateParam(a,u.playbackRate,r.playbackRate),a.playbackRate.setValueAtTime(s,0),r.connect(c),u.connect(i),c.connect(i),a.connect(n),a.playbackState=a.UNSCHEDULED_STATE},t,this.audioContext)},n()}var SPPlaybackRateParam=_dereq_("../core/SPPlaybackRateParam"),webAudioDispatch=_dereq_("../core/WebAudioDispatch"),log=_dereq_("loglevel");module.exports=SPAudioBufferSourceNode;

},{"../core/SPPlaybackRateParam":11,"../core/WebAudioDispatch":13,"loglevel":1}],10:[function(_dereq_,module,exports){
"use strict";function SPAudioParam(e,t,a,i,n,o,u,r){var l,f=1e-4,c=500,s=0,m=!1;if(this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="",this.isSPAudioParam=!0,Object.defineProperty(this,"value",{enumerable:!0,configurable:!1,set:function(f){if(log.debug("Setting param",t,"value to",f),typeof f!=typeof n)return void log.error("Attempt to set a",typeof n,"parameter to a",typeof f,"value");if("number"==typeof f&&(f>i?(log.debug(this.name,"clamping to max"),f=i):a>f&&(log.debug(this.name+" clamping to min"),f=a)),s=f,"function"==typeof u&&(f=u(f)),m||(log.debug("Clearing Automation for",t),window.clearInterval(l)),m=!1,"function"==typeof r&&e.audioContext)r(o,f,e.audioContext);else if(o){if(o instanceof AudioParam){var c=[];c.push(o),o=c}o.forEach(function(a){e.isPlaying?a.setTargetAtTime(f,e.audioContext.currentTime,Config.DEFAULT_SMOOTHING_CONSTANT):(log.debug("Setting param",t,"through setter"),a.setValueAtTime(f,e.audioContext.currentTime))})}},get:function(){return s}}),o&&(o instanceof AudioParam||o instanceof Array))var d=o[0]||o;t?this.name=t:d&&(this.name=d.name),"undefined"!=typeof n?(this.defaultValue=n,this.value=n):d&&(this.defaultValue=d.defaultValue,this.value=d.defaultValue),"undefined"!=typeof a?this.minValue=a:d&&(this.minValue=d.minValue),"undefined"!=typeof i?this.maxValue=i:d&&(this.maxValue=d.maxValue),this.setValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.setValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.setValueAtTime(t,a)});else{var i=this;webAudioDispatch(function(){i.value=t},a,e.audioContext)}},this.setTargetAtTime=function(t,a,i){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.setTargetAtTime(t,a,i):o instanceof Array&&o.forEach(function(e){e.setTargetAtTime(t,a,i)});else{var n=this,r=n.value,s=e.audioContext.currentTime;log.debug("starting automation"),l=window.setInterval(function(){e.audioContext.currentTime>=a&&(m=!0,n.value=t+(r-t)*Math.exp(-(e.audioContext.currentTime-s)/i),Math.abs(n.value-t)<f&&window.clearInterval(l))},c)}},this.setValueCurveAtTime=function(t,a,i){if(o){if("function"==typeof u)for(var n=0;n<t.length;n++)t[n]=u(t[n]);o instanceof AudioParam?o.setValueCurveAtTime(t,a,i):o instanceof Array&&o.forEach(function(e){e.setValueCurveAtTime(t,a,i)})}else{var r=this,f=e.audioContext.currentTime;l=window.setInterval(function(){if(e.audioContext.currentTime>=a){var n=Math.floor(t.length*(e.audioContext.currentTime-f)/i);n<t.length?(m=!0,r.value=t[n]):window.clearInterval(l)}},c)}},this.exponentialRampToValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.exponentialRampToValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.exponentialRampToValueAtTime(t,a)});else{var i=this,n=i.value,r=e.audioContext.currentTime;0===n&&(n=.001),l=window.setInterval(function(){var o=(e.audioContext.currentTime-r)/(a-r);m=!0,i.value=n*Math.pow(t/n,o),e.audioContext.currentTime>=a&&window.clearInterval(l)},c)}},this.linearRampToValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.linearRampToValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.linearRampToValueAtTime(t,a)});else{var i=this,n=i.value,r=e.audioContext.currentTime;l=window.setInterval(function(){var o=(e.audioContext.currentTime-r)/(a-r);m=!0,i.value=n+(t-n)*o,e.audioContext.currentTime>=a&&window.clearInterval(l)},c)}},this.cancelScheduledValues=function(e){o?o instanceof AudioParam?o.cancelScheduledValues(e):o instanceof Array&&o.forEach(function(t){t.cancelScheduledValues(e)}):window.clearInterval(l)}}var webAudioDispatch=_dereq_("../core/WebAudioDispatch"),Config=_dereq_("../core/Config"),log=_dereq_("loglevel");SPAudioParam.createPsuedoParam=function(e,t,a,i,n){return new SPAudioParam(e,t,a,i,n,null,null,null)},module.exports=SPAudioParam;

},{"../core/Config":4,"../core/WebAudioDispatch":13,"loglevel":1}],11:[function(_dereq_,module,exports){
"use strict";function SPPlaybackRateParam(e,t,a){this.defaultValue=t.defaultValue,this.maxValue=t.maxValue,this.minValue=t.minValue,this.name=t.name,this.units=t.units,this.isSPPlaybackRateParam=!0,Object.defineProperty(this,"value",{enumerable:!0,configurable:!1,set:function(i){e.playbackState===e.PLAYING_STATE?(t.setTargetAtTime(i,e.audioContext.currentTime,Config.DEFAULT_SMOOTHING_CONSTANT),a.setTargetAtTime(i,e.audioContext.currentTime,Config.DEFAULT_SMOOTHING_CONSTANT)):(t.setValueAtTime(i,e.audioContext.currentTime),a.setValueAtTime(i,e.audioContext.currentTime))},get:function(){return t.value}}),t.value=t.value,a.value=t.value,this.linearRampToValueAtTime=function(e,i){t.linearRampToValueAtTime(e,i),a.linearRampToValueAtTime(e,i)},this.exponentialRampToValueAtTime=function(e,i){t.exponentialRampToValueAtTime(e,i),a.exponentialRampToValueAtTime(e,i)},this.setValueCurveAtTime=function(e,i,u){t.setValueCurveAtTime(e,i,u),a.setValueCurveAtTime(e,i,u)},this.setTargetAtTime=function(e,i,u){t.setTargetAtTime(e,i,u),a.setTargetAtTime(e,i,u)},this.setValueAtTime=function(e,i){t.setValueAtTime(e,i),a.setValueAtTime(e,i)},this.cancelScheduledValues=function(e){t.cancelScheduledValues(e),a.cancelScheduledValues(e)}}var Config=_dereq_("../core/Config");module.exports=SPPlaybackRateParam;

},{"../core/Config":4}],12:[function(_dereq_,module,exports){
"use strict";function SafeAudioContext(){var e="number"==typeof e?e:44100;log.debug("desiredSampleRate",e);var t=new AudioContext,o=/(iPad|iPhone|iPod)/g.test(navigator.userAgent);return o&&t.sampleRate!==e&&(log.debug("bad sample rate",t.sampleRate),t.close(),t=new AudioContext),t}_dereq_("../core/AudioContextMonkeyPatch")();var log=_dereq_("loglevel");module.exports=SafeAudioContext;

},{"../core/AudioContextMonkeyPatch":2,"loglevel":1}],13:[function(_dereq_,module,exports){
"use strict";function WebAudioDispatch(e,i,o){if(!o)return void log.error("No AudioContext provided");var t=o.currentTime;return t>=i||.005>i-t?(log.debug("Dispatching now"),e(),null):(log.debug("Dispatching in",1e3*(i-t),"ms"),window.setTimeout(function(){log.debug("Diff at dispatch",1e3*(i-o.currentTime),"ms"),e()},1e3*(i-t)))}var log=_dereq_("loglevel");module.exports=WebAudioDispatch;

},{"loglevel":1}],14:[function(_dereq_,module,exports){
"use strict";function Looper(e,t,o,i,a,n,r){function u(e){l=[],c.forEach(function(e){e.disconnect()}),s.multiTrackGain.length=0,multiFileLoader.call(s,e,s.audioContext,s.onLoadProgress,d)}if(!(this instanceof Looper))throw new TypeError("Looper constructor cannot be called as a function.");BaseSound.call(this,e),this.maxSources=Config.MAX_VOICES,this.minSources=1,this.modelName="Looper",this.onLoadProgress=o,this.onLoadComplete=i,this.onAudioStart=a,this.onAudioEnd=n;var s=this,c=[],l=[],d=function(e,t){s.multiTrackGain.length=t.length,t.forEach(function(e,o){f(e,o,t.length)}),l&&l.length>0&&s.registerParameter(new SPAudioParam(s,"playSpeed",0,10,1,l,null,h),!0),e&&(s.isInitialized=!0),"function"==typeof s.onLoadComplete&&window.setTimeout(function(){"function"==typeof s.onLoadComplete&&s.onLoadComplete(e,t)},0)},f=function(e,t,o){var i;if(i=c[t]instanceof SPAudioBufferSourceNode?c[t]:new SPAudioBufferSourceNode(s.audioContext),i.buffer=e,i.loopEnd=e.duration,i.lastStopPosition_=0,i.onended=function(e){p(e,t,i)},o>1){var a=new SPAudioParam(s,"track-"+t+"-gain",0,1,1,i.gain,null,null);s.multiTrackGain.splice(t,1,a)}i.connect(s.releaseGainNode),c.splice(t,1,i),l.push(i.playbackRate)},p=function(e,t,o){var i=s.audioContext.currentTime;if(o.resetBufferSource(i,s.releaseGainNode),s.multiTrackGain.length>1){var a=new SPAudioParam(s,"track-"+t+"-gain"+t,0,1,1,o.gain,null,null);s.multiTrackGain.splice(t,1,a)}"function"==typeof s.onTrackEnd&&r(s,t);var n=c.reduce(function(e,t){return e&&(t.playbackState===t.FINISHED_STATE||t.playbackState===t.UNSCHEDULED_STATE)},!0);n&&s.isPlaying&&(s.isPlaying=!1,"function"==typeof s.onAudioEnd&&s.onAudioEnd())},h=function(e,t,o){if(s.isInitialized){var i=6.90776,a=c[0]?c[0].playbackRate.value:1;s.isPlaying?(log.debug("easingIn/Out"),t>a?c.forEach(function(e){e.playbackRate.cancelScheduledValues(o.currentTime),e.playbackRate.setTargetAtTime(t,o.currentTime,s.easeIn.value/i)}):a>t&&c.forEach(function(e){e.playbackRate.cancelScheduledValues(o.currentTime),e.playbackRate.setTargetAtTime(t,o.currentTime,s.easeOut.value/i)})):(log.debug("changing directly"),c.forEach(function(e){e.playbackRate.cancelScheduledValues(o.currentTime),e.playbackRate.setValueAtTime(t,o.currentTime)}))}};this.onTrackEnd=r,this.registerParameter(new SPAudioParam(this,"playSpeed",0,10,1.005,null,null,h),!0),this.registerParameter(SPAudioParam.createPsuedoParam(this,"easeIn",.05,10,.05)),this.registerParameter(SPAudioParam.createPsuedoParam(this,"easeOut",.05,10,.05));var m=[];m.name="multiTrackGain",this.registerParameter(m,!1),this.registerParameter(SPAudioParam.createPsuedoParam(this,"maxLoops",-1,1,-1)),this.setSources=function(e,t,o){BaseSound.prototype.setSources.call(this,e,t,o),u(e)},this.play=function(){if(!this.isInitialized)throw new Error(this.modelName,"hasn't finished Initializing yet. Please wait before calling start/play");var e=this.audioContext.currentTime;this.isPlaying||(c.forEach(function(t){var o=t.lastStopPosition_||t.loopStart;t.loop=1!==s.maxLoops.value,t.start(e,o)}),BaseSound.prototype.start.call(this,e),webAudioDispatch(function(){"function"==typeof s.onAudioStart&&s.onAudioStart()},e,this.audioContext))},this.start=function(e,t,o,i){return this.isInitialized?void(this.isPlaying||(c.forEach(function(i){t=i.loopStart+parseFloat(t)||0,i.loop=1!==s.maxLoops.value,i.start(e,t,o)}),BaseSound.prototype.start.call(this,e,t,o,i),webAudioDispatch(function(){"function"==typeof s.onAudioStart&&s.onAudioStart()},e,this.audioContext))):void log.warn(this.modelName," hasn't finished Initializing yet. Please wait before calling start/play")},this.stop=function(e){s.isPlaying&&(c.forEach(function(t){t.stop(e),t.lastStopPosition_=0}),BaseSound.prototype.stop.call(this,e),webAudioDispatch(function(){"function"==typeof s.onAudioEnd&&s.isPlaying===!1&&s.onAudioEnd()},e,this.audioContext))},this.pause=function(){s.isPlaying&&(c.forEach(function(e){e.stop(0),e.lastStopPosition_=e.playbackPosition/e.buffer.sampleRate}),BaseSound.prototype.stop.call(this,0),webAudioDispatch(function(){"function"==typeof s.onAudioEnd&&s.onAudioEnd()},0,this.audioContext))},this.release=function(e,t,o){("undefined"==typeof e||e<this.audioContext.currentTime)&&(e=this.audioContext.currentTime);var i=.5;t=t||i,BaseSound.prototype.release.call(this,e,t,o),o&&(this.releaseGainNode=this.audioContext.createGain(),this.destinations.forEach(function(e){s.releaseGainNode.connect(e.destination,e.output,e.input)}),c.forEach(function(o,i){o.stop(e+t),o.lastStopPosition_=0,o.resetBufferSource(e,s.releaseGainNode);var a=new SPAudioParam(s,"gain-"+i,0,1,1,o.gain,null,null);s.multiTrackGain.splice(i,1,a)}),this.isPlaying=!1,webAudioDispatch(function(){"function"==typeof s.onAudioEnd&&s.isPlaying===!1&&s.onAudioEnd()},e+t,this.audioContext))},u(t)}var Config=_dereq_("../core/Config"),BaseSound=_dereq_("../core/BaseSound"),SPAudioParam=_dereq_("../core/SPAudioParam"),SPAudioBufferSourceNode=_dereq_("../core/SPAudioBufferSourceNode"),multiFileLoader=_dereq_("../core/MultiFileLoader"),webAudioDispatch=_dereq_("../core/WebAudioDispatch"),log=_dereq_("loglevel");Looper.prototype=Object.create(BaseSound.prototype),module.exports=Looper;
},{"../core/BaseSound":3,"../core/Config":4,"../core/MultiFileLoader":7,"../core/SPAudioBufferSourceNode":9,"../core/SPAudioParam":10,"../core/WebAudioDispatch":13,"loglevel":1}]},{},[14])(14)
});