/*javascript-sound-models - v1.2.1-1 - Mon Sep 29 2014 14:57:35 GMT+0800 (SGT) */ 
console.log("   ____                           __ \n" + "  / _____  ___ ___  ___ ___  ____/ /_\n" + " _\\ \\/ _ \\/ _ / _ \\/ _ / _ \\/ __/ __/\n" + "/___/\\___/_//_\\___/ .__\\___/_/  \\__/ \n" + "                 /_/                 \n" + "Hello Developer!\n" + "Thanks for using Sonoport Dynamic Sound Library v1.2.1-1.");
define("core/Config",[],function(){function e(){}return e.LOG_ERRORS=!0,e.ZERO=parseFloat("1e-37"),e.MAX_VOICES=8,e.NOMINAL_REFRESH_RATE=60,e.WINDOW_LENGTH=512,e.CHUNK_LENGTH=256,e}),define("core/WebAudioDispatch",[],function(){function e(e,t,n){if(!n)return void console.warn("No AudioContext provided");var o=n.currentTime;o>=t||.005>t-o?e():window.setTimeout(function(){e()},1e3*(t-o))}return e}),define("core/AudioContextMonkeyPatch",[],function(){function e(e){e&&(e.setTargetAtTime||(e.setTargetAtTime=e.setTargetValueAtTime))}window.hasOwnProperty("webkitAudioContext")&&!window.hasOwnProperty("AudioContext")&&(window.AudioContext=webkitAudioContext,AudioContext.prototype.hasOwnProperty("createGain")||(AudioContext.prototype.createGain=AudioContext.prototype.createGainNode),AudioContext.prototype.hasOwnProperty("createDelay")||(AudioContext.prototype.createDelay=AudioContext.prototype.createDelayNode),AudioContext.prototype.hasOwnProperty("createScriptProcessor")||(AudioContext.prototype.createScriptProcessor=AudioContext.prototype.createJavaScriptNode),AudioContext.prototype.internal_createGain=AudioContext.prototype.createGain,AudioContext.prototype.createGain=function(){var t=this.internal_createGain();return e(t.gain),t},AudioContext.prototype.internal_createDelay=AudioContext.prototype.createDelay,AudioContext.prototype.createDelay=function(t){var n=t?this.internal_createDelay(t):this.internal_createDelay();return e(n.delayTime),n},AudioContext.prototype.internal_createBufferSource=AudioContext.prototype.createBufferSource,AudioContext.prototype.createBufferSource=function(){var t=this.internal_createBufferSource();return t.start||(t.start=function(e,t,n){t||n?this.noteGrainOn(e,t,n):this.noteOn(e)}),t.stop||(t.stop=t.noteOff),e(t.playbackRate),t},AudioContext.prototype.internal_createDynamicsCompressor=AudioContext.prototype.createDynamicsCompressor,AudioContext.prototype.createDynamicsCompressor=function(){var t=this.internal_createDynamicsCompressor();return e(t.threshold),e(t.knee),e(t.ratio),e(t.reduction),e(t.attack),e(t.release),t},AudioContext.prototype.internal_createBiquadFilter=AudioContext.prototype.createBiquadFilter,AudioContext.prototype.createBiquadFilter=function(){var t=this.internal_createBiquadFilter();return e(t.frequency),e(t.detune),e(t.Q),e(t.gain),t},AudioContext.prototype.hasOwnProperty("createOscillator")&&(AudioContext.prototype.internal_createOscillator=AudioContext.prototype.createOscillator,AudioContext.prototype.createOscillator=function(){var t=this.internal_createOscillator();return t.start||(t.start=t.noteOn),t.stop||(t.stop=t.noteOff),e(t.frequency),e(t.detune),t}))}),define("core/BaseSound",["core/WebAudioDispatch","core/AudioContextMonkeyPatch"],function(e){function t(e){function t(e){function t(){o.start(0),o.stop(e.currentTime+1e-4),window.liveAudioContexts.push(e),window.removeEventListener("touchstart",t)}var n=/(iPad|iPhone|iPod)/g.test(navigator.userAgent);if(n&&(window.liveAudioContexts||(window.liveAudioContexts=[]),window.liveAudioContexts.indexOf(e)<0)){var o=e.createOscillator(),i=e.createGain();i.gain.value=0,o.connect(i),i.connect(e.destination),window.addEventListener("touchstart",t)}}void 0===e||null===e?(console.log("Making a new AudioContext"),this.audioContext=new AudioContext):this.audioContext=e,t(this.audioContext),this.numberOfInputs=0,Object.defineProperty(this,"numberOfOutputs",{enumerable:!0,configurable:!1,get:function(){return this.releaseGainNode.numberOfOutputs}});var n=0;Object.defineProperty(this,"maxSources",{enumerable:!0,configurable:!1,set:function(e){0>e&&(e=0),n=Math.round(e)},get:function(){return n}});var o=0;Object.defineProperty(this,"minSources",{enumerable:!0,configurable:!1,set:function(e){0>e&&(e=0),o=Math.round(e)},get:function(){return o}}),this.releaseGainNode=this.audioContext.createGain(),this.isPlaying=!1,this.isInitialized=!1,this.inputNode=null,this.destinations=[],this.modelName="Model",this.onLoadProgress=null,this.onLoadComplete=null,this.onAudioStart=null,this.onAudioEnd=null,this.releaseGainNode.connect(this.audioContext.destination)}return t.prototype.registerParameter=function(e,t){(void 0===t||null===t)&&(t=!1),Object.defineProperty(this,e.name,{enumerable:!0,configurable:t,value:e})},t.prototype.connect=function(e,t,n){e instanceof AudioNode?(this.releaseGainNode.connect(e,t,n),this.destinations.push({destination:e,output:t,input:n})):e.inputNode instanceof AudioNode?(this.releaseGainNode.connect(e.inputNode,t,n),this.destinations.push({destination:e.inputNode,output:t,input:n})):console.error("No Input Connection - Attempts to connect "+typeof t+" to "+typeof this)},t.prototype.disconnect=function(e){this.releaseGainNode.disconnect(e),this.destinations=[]},t.prototype.start=function(t,n,o,i){("undefined"==typeof t||t<this.audioContext.currentTime)&&(t=this.audioContext.currentTime),this.releaseGainNode.gain.cancelScheduledValues(t),"undefined"!=typeof i?(this.releaseGainNode.gain.setValueAtTime(0,t),this.releaseGainNode.gain.linearRampToValueAtTime(1,t+i)):this.releaseGainNode.gain.setValueAtTime(1,t);var a=this;e(function(){a.isPlaying=!0},t,this.audioContext)},t.prototype.stop=function(t){("undefined"==typeof t||t<this.audioContext.currentTime)&&(t=this.audioContext.currentTime);var n=this;e(function(){n.isPlaying=!1},t,this.audioContext),this.releaseGainNode.gain.cancelScheduledValues(t)},t.prototype.release=function(t,n,o){if(this.isPlaying){var i=.5;if(("undefined"==typeof t||t<this.audioContext.currentTime)&&(t=this.audioContext.currentTime),n=n||i,this.releaseGainNode.gain.setValueAtTime(this.releaseGainNode.gain.value,t),this.releaseGainNode.gain.linearRampToValueAtTime(0,t+n),!o){var a=this;e(function(){a.pause()},t+n,this.audioContext)}}},t.prototype.setSources=function(e,t,n){this.isInitialized=!1,"function"==typeof t&&(this.onLoadProgress=t),"function"==typeof n&&(this.onLoadComplete=n)},t.prototype.play=function(){this.start(0)},t.prototype.pause=function(){this.isPlaying=!1},t.prototype.listParams=function(){var e=[];for(var t in this)if(this.hasOwnProperty(t)){var n=this[t];(n&&n.hasOwnProperty("value")&&n.hasOwnProperty("minValue")&&n.hasOwnProperty("maxValue")||n instanceof Array&&n[0].hasOwnProperty("value")&&n[0].hasOwnProperty("minValue")&&n[0].hasOwnProperty("maxValue"))&&e.push(n)}return e},t}),define("core/SPAudioParam",["core/WebAudioDispatch"],function(e){function t(t,n,o,i,a,r,u,s){var c,l=1e-4,f=500,d=0;if(this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="",Object.defineProperty(this,"value",{enumerable:!0,configurable:!1,set:function(e){return typeof e!=typeof i?void console.error("Attempt to set a "+typeof i+" parameter to a "+typeof e+" value"):("number"==typeof e&&(e>o?(console.warn(this.name+" clamping to max"),e=o):n>e&&(console.warn(this.name+" clamping to min"),e=n)),"function"==typeof r&&(e=r(e)),"function"==typeof u&&s?u(a,e,s):a?a instanceof AudioParam?a.value=e:a instanceof Array&&a.forEach(function(t){t.value=e}):window.clearInterval(c),void(d=e))},get:function(){return a?a instanceof AudioParam?a.value:a instanceof Array?a[0].value:d:d}}),a&&(a instanceof AudioParam||a instanceof Array)){var p=a[0]||a;this.defaultValue=p.defaultValue,this.minValue=p.minValue,this.maxValue=p.maxValue,this.value=p.defaultValue,this.name=p.name}t&&(this.name=t),"undefined"!=typeof i&&(this.defaultValue=i,this.value=i),"undefined"!=typeof n&&(this.minValue=n),"undefined"!=typeof o&&(this.maxValue=o),this.setValueAtTime=function(t,n){if("function"==typeof r&&(t=r(t)),a)a instanceof AudioParam?a.setValueAtTime(t,n):a instanceof Array&&a.forEach(function(e){e.setValueAtTime(t,n)});else{var o=this;e(function(){o.value=t},n,s)}},this.setTargetAtTime=function(e,t,n){if("function"==typeof r&&(e=r(e)),a)a instanceof AudioParam?a.setTargetAtTime(e,t,n):a instanceof Array&&a.forEach(function(o){o.setTargetAtTime(e,t,n)});else{var o=this,i=o.value,u=s.currentTime;c=window.setInterval(function(){s.currentTime>=t&&(o.value=e+(i-e)*Math.exp(-(s.currentTime-u)/n),Math.abs(o.value-e)<l&&window.clearInterval(c))},f)}},this.setValueCurveAtTime=function(e,t,n){if("function"==typeof r)for(var o=0;o<e.length;o++)e[o]=r(e[o]);if(a)a instanceof AudioParam?a.setValueCurveAtTime(e,t,n):a instanceof Array&&a.forEach(function(o){o.setValueCurveAtTime(e,t,n)});else{var i=this,u=s.currentTime;c=window.setInterval(function(){if(s.currentTime>=t){var o=Math.floor(e.length*(s.currentTime-u)/n);o<e.length?i.value=e[o]:window.clearInterval(c)}},f)}},this.exponentialRampToValueAtTime=function(e,t){if("function"==typeof r&&(e=r(e)),a)a instanceof AudioParam?a.exponentialRampToValueAtTime(e,t):a instanceof Array&&a.forEach(function(n){n.exponentialRampToValueAtTime(e,t)});else{var n=this,o=n.value,i=s.currentTime;0===o&&(o=.001),c=window.setInterval(function(){var a=(s.currentTime-i)/(t-i);n.value=o*Math.pow(e/o,a),s.currentTime>=t&&window.clearInterval(c)},f)}},this.linearRampToValueAtTime=function(e,t){if("function"==typeof r&&(e=r(e)),a)a instanceof AudioParam?a.linearRampToValueAtTime(e,t):a instanceof Array&&a.forEach(function(n){n.linearRampToValueAtTime(e,t)});else{var n=this,o=n.value,i=s.currentTime;c=window.setInterval(function(){var a=(s.currentTime-i)/(t-i);n.value=o+(e-o)*a,s.currentTime>=t&&window.clearInterval(c)},f)}},this.cancelScheduledValues=function(e){a?a instanceof AudioParam?a.cancelScheduledValues(e):a instanceof Array&&a.forEach(function(t){t.cancelScheduledValues(e)}):window.clearInterval(c)}}return t.createPsuedoParam=function(e,n,o,i,a){return new t(e,n,o,i,null,null,null,a)},t}),define("core/SPPlaybackRateParam",[],function(){function e(e,t){this.defaultValue=e.defaultValue,this.maxValue=e.maxValue,this.minValue=e.minValue,this.name=e.name,this.units=e.units,Object.defineProperty(this,"value",{enumerable:!0,configurable:!1,set:function(n){e.value=n,t.value=n},get:function(){return e.value}}),this.linearRampToValueAtTime=function(n,o){e.linearRampToValueAtTime(n,o),t.linearRampToValueAtTime(n,o)},this.exponentialRampToValueAtTime=function(n,o){e.exponentialRampToValueAtTime(n,o),t.exponentialRampToValueAtTime(n,o)},this.setValueCurveAtTime=function(n,o,i){e.setValueCurveAtTime(n,o,i),t.setValueCurveAtTime(n,o,i)},this.setTargetAtTime=function(n,o,i){e.setTargetAtTime(n,o,i),t.setTargetAtTime(n,o,i)},this.setValueAtTime=function(n,o){e.setValueAtTime(n,o),t.setValueAtTime(n,o)},this.cancelScheduledValues=function(n){e.cancelScheduledValues(n),t.cancelScheduledValues(n)}}return e}),define("core/SPAudioBufferSourceNode",["core/SPPlaybackRateParam","core/WebAudioDispatch"],function(e,t){function n(n){function o(e){for(var t=new Float32Array(e.length),o=n.createBuffer(1,e.length,44100),i=0;i<e.length;i++)t[i]=i;return o.getChannelData(0).set(t),o}function i(){s.connect(c),u.connect(l),c.connect(l),c.onaudioprocess=a}function a(e){var t=e.inputBuffer.getChannelData(0);f=t[t.length-1]||0}function r(e,t){return function(n){e.playbackState=e.FINISHED_STATE,"function"==typeof t&&t(n)}}var u=n.createBufferSource(),s=n.createBufferSource(),c=n.createScriptProcessor(256,1,1),l=n.createGain(),f=0;this.audioContext=n,this.channelCount=u.channelCount,this.channelCountMode=u.channelCountMode,this.channelInterpretation=u.channelInterpretation,this.numberOfInputs=u.numberOfInputs,this.numberOfOutputs=u.numberOfOutputs,this.playbackState=0,this.UNSCHEDULED_STATE=0,this.SCHEDULED_STATE=1,this.PLAYING_STATE=2,this.FINISHED_STATE=3,this.playbackRate=new e(u.playbackRate,s.playbackRate),Object.defineProperty(this,"loopEnd",{enumerable:!0,configurable:!1,set:function(e){u.loopEnd=e,s.loopEnd=e},get:function(){return u.loopEnd}}),Object.defineProperty(this,"loopStart",{enumerable:!0,configurable:!1,set:function(e){u.loopStart=e,s.loopStart=e},get:function(){return u.loopStart}}),Object.defineProperty(this,"onended",{enumerable:!0,configurable:!1,set:function(e){u.onended=r(this,e)},get:function(){return u.onended}}),Object.defineProperty(this,"loop",{enumerable:!0,configurable:!1,set:function(e){u.loop=e,s.loop=e},get:function(){return u.loop}}),Object.defineProperty(this,"playbackPosition",{enumerable:!0,configurable:!1,get:function(){return f}}),Object.defineProperty(this,"buffer",{enumerable:!0,configurable:!1,set:function(e){u.buffer=e,s.buffer=o(e)},get:function(){return u.buffer}}),Object.defineProperty(this,"gain",{enumerable:!0,configurable:!1,get:function(){return l.gain}}),this.connect=function(e,t,n){l.connect(e,t,n)},this.disconnect=function(e){l.disconnect(e)},this.start=function(e,n,o){"undefined"==typeof o&&(o=u.buffer.duration),this.playbackState===this.UNSCHEDULED_STATE&&(u.start(e,n,o),s.start(e,n,o),this.playbackState=this.SCHEDULED_STATE);var i=this;t(function(){i.playbackState=i.PLAYING_STATE},e,this.audioContext)},this.stop=function(e){(this.playbackState===this.PLAYING_STATE||this.playbackState===this.SCHEDULED_STATE)&&(u.stop(e),s.stop(e))},this.resetBufferSource=function(o,i){var a=this;t(function(){c.disconnect();var t=a.audioContext.createGain();t.gain.value=l.gain.value,l=t;var o=a.audioContext.createBufferSource();o.buffer=u.buffer,o.loopStart=u.loopStart,o.loopEnd=u.loopEnd,o.onended=r(a,u.onended),u.onended=null,s.disconnect();var f=n.createBufferSource();f.buffer=s.buffer,u=o,s=f;var d=a.playbackRate.value;a.playbackRate=new e(u.playbackRate,s.playbackRate),a.playbackRate.setValueAtTime(d,0),s.connect(c),u.connect(l),c.connect(l),a.connect(i),a.playbackState=a.UNSCHEDULED_STATE},o,this.audioContext)},i()}return n}),define("core/DetectLoopMarkers",[],function(){function e(e){var t=0,n=0,o=!0,i=5e3,a=44100,r=.5,u=2e4,s=.01,c=1024,l=16,f=[],d=0,p=function(e,t){for(var n=0,o=t+l;t+l+c>o;++o)n+=Math.abs(e[o]);return s>n/c},h=function(e){return function(t,n,o){var i;return i=o%2===0?n[e]>r:n[e]<-r,t&&i}},m=function(o){var r=null,s=null;t=0,n=d;for(var c=0;null===r&&d>c&&u>c;){if(o.reduce(h(c),!0)&&(1!==o.length||p(o[0],c))){r=c;break}c++}for(c=d;null===s&&c>0&&u>d-c;){if(o.reduce(h(c),!0)){s=c;break}c--}var l=Math.round(i/2*e.sampleRate/a);return null!==r&&null!==s&&s>r+l?(t=r+l,n=s-l,!0):!1},y=function(e){return function(t,n){return t&&Math.abs(n[e])<s}},A=function(e){var o=!0;for(t=0;u>t&&d>t&&(o=e.reduce(y(t),!0));)t++;for(n=d;u>d-n&&n>0&&(o=e.reduce(y(n),!0));)n--;t>n&&(t=0)};d=e.length;for(var v=0;v<e.numberOfChannels;v++)f.push(new Float32Array(e.getChannelData(v)));return m(f)||(A(f),o=!1),{marked:o,start:t,end:n}}return e}),define("core/FileLoader",["core/DetectLoopMarkers"],function(e){function t(n,o,i,a){function r(){var e=Object.prototype.toString.call(n),t=/[^.]+$/.exec(n);if("[object String]"===e){var o=new XMLHttpRequest;o.open("GET",n,!0),o.responseType="arraybuffer",o.addEventListener("progress",a,!1),o.onload=function(){u(o.response,t)},o.send()}else if("[object File]"===e||"[object Blob]"===e){var i=new FileReader;i.addEventListener("progress",a,!1),i.onload=function(){u(i.result,t)},i.readAsArrayBuffer(n)}}function u(t,a){o.decodeAudioData(t,function(t){if(f=!0,s=t,c=0,l=s.length,"wav"!==a[0]){var n=e(s);n&&(c=n.start,l=n.end)}i&&"function"==typeof i&&i(!0)},function(){console.warn("Error Decoding "+n),i&&"function"==typeof i&&i(!1)})}if(!(this instanceof t))throw new TypeError("FileLoader constructor cannot be called as a function.");var s,c=0,l=0,f=!1,d=function(e){var t=/^[0-9]+$/;return t.test(e)?!0:!1},p=function(e,t){"undefined"==typeof t&&(t=s.length),d(e)?d(t)||(console.warn("Incorrect parameter Type - FileLoader getBuffer end parameter is not an integer"),t=Number.isNan(t)?0:Math.round(Number(t))):(e=Number.isNan(e)?0:Math.round(Number(e)),console.warn("Incorrect parameter Type - FileLoader getBuffer start parameter is not an integer. Coercing it to an Integer - start")),e>t&&(console.error("Incorrect parameter Type - FileLoader getBuffer start parameter "+e+" should be smaller than end parameter "+t+" . Setting them to the same value "+e),t=e),(e>l||c>e)&&(console.error("Incorrect parameter Type - FileLoader getBuffer start parameter should be within the buffer size : 0-"+s.length+" . Setting start to "+c),e=c),(t>l||c>t)&&(console.error("Incorrect parameter Type - FileLoader getBuffer start parameter should be within the buffer size : 0-"+s.length+" . Setting start to "+l),t=l);var n=t-e;if(!s)return console.error("No Buffer Found - Buffer loading has not completed or has failed."),null;for(var i=o.createBuffer(s.numberOfChannels,n,s.sampleRate),a=0;a<s.numberOfChannels;a++){var r=new Float32Array(s.getChannelData(a));i.getChannelData(a).set(r.subarray(e,t))}return i};this.getBuffer=function(e,t){return"undefined"==typeof e&&(e=0),"undefined"==typeof t&&(t=l-c),p(c+e,c+t)},this.getRawBuffer=function(){return f?s:(console.error("No Buffer Found - Buffer loading has not completed or has failed."),null)},this.isLoaded=function(){return f},r()}return t}),define("core/MultiFileLoader",["core/FileLoader"],function(e){function t(t,n,o,i){function a(){var e=Object.prototype.toString.call(t);"[object Array]"===e?t.length>=s.minSources&&t.length<=s.maxSources?(c=t.length,l=new Array(c),t.forEach(function(e,t){r(e,u(t))})):(console.error("Unsupported number of Sources. "+s.modelName+" only supports a minimum of "+s.minSources+" and a maximum of "+s.maxSources+" sources. Trying to load "+t.length+"."),i(!1,l)):t?(c=1,l=new Array(c),r(t,u(0))):(console.log("Setting empty source. No sound may be heard"),i(!1,l))}function r(t,n){var i=Object.prototype.toString.call(t);if("[object String]"===i||"[object File]"===i)var a=new e(t,s.audioContext,function(e){e?n(e,a.getBuffer()):n(e)},function(e){o&&"function"==typeof o&&o(e,t)});else"[object AudioBuffer]"===i?n(!0,t):(console.error("Incorrect Parameter Type - Source is not a URL, File or AudioBuffer"),n(!1,{}))}function u(e){return function(t,n){if(t&&(l[e]=n),c--,0===c){for(var o=!0,a=0;a<l.length;++a)if(!l[a]){o=!1;break}i(o,l)}}}var s=this;this.audioContext=n;var c=0,l=[];a()}return t}),define("models/Looper",["core/Config","core/BaseSound","core/SPAudioParam","core/SPAudioBufferSourceNode","core/MultiFileLoader","core/WebAudioDispatch"],function(e,t,n,o,i,a){function r(u,s,c,l,f,d,p){function h(e){v=[],y.forEach(function(e){e.disconnect()}),i.call(m,e,m.audioContext,m.onLoadProgress,g)}if(!(this instanceof r))throw new TypeError("Looper constructor cannot be called as a function.");t.call(this,u),this.maxSources=e.MAX_VOICES,this.minSources=1,this.modelName="Looper",this.onLoadProgress=c,this.onLoadComplete=l,this.onAudioStart=f,this.onAudioEnd=d;var m=this,y=[],A=[],v=[],g=function(e,t){m.multiTrackGain.length=t.length,t.forEach(function(e,t){A.push(0),T(e,t)}),v&&v.length>0&&m.registerParameter(new n("playSpeed",0,10,1,v,null,C,m.audioContext),!0),e&&(m.isInitialized=!0),"function"==typeof m.onLoadComplete&&m.onLoadComplete(e,t)},T=function(e,t){var i;i=y[t]?y[t]:new o(m.audioContext),i.buffer=e,i.loopEnd=e.duration,i.onended=function(e){b(e,t,i)};var a=new n("gain-"+t,0,1,1,i.gain,null,null,m.audioContext);m.multiTrackGain.splice(t,1,a),i.connect(m.releaseGainNode),y.splice(t,1,i),v.push(i.playbackRate)},b=function(e,t,o){var i=m.audioContext.currentTime;o.resetBufferSource(i,m.releaseGainNode);var a=new n("gain-"+t,0,1,1,o.gain,null,null,m.audioContext);m.multiTrackGain.splice(t,1,a),"function"==typeof m.onTrackEnd&&p(m,t);var r=y.reduce(function(e,t){return e&&(t.playbackState===t.FINISHED_STATE||t.playbackState===t.UNSCHEDULED_STATE)},!0);r&&m.isPlaying&&(m.isPlaying=!1,"function"==typeof m.onAudioEnd&&m.onAudioEnd())},C=function(e,t,n){if(m.isInitialized){var o=6.90776,i=y[0]?y[0].playbackRate.value:1;t>i?y.forEach(function(e){e.playbackRate.cancelScheduledValues(n.currentTime),e.playbackRate.setTargetAtTime(t,n.currentTime,m.riseTime.value/o)}):i>t&&y.forEach(function(e){e.playbackRate.cancelScheduledValues(n.currentTime),e.playbackRate.setTargetAtTime(t,n.currentTime,m.decayTime.value/o)})}},S=function(e,t){y.forEach(function(e){e.loopStart=t*e.buffer.duration})};this.onTrackEnd=p,this.registerParameter(new n("playSpeed",0,10,1,null,null,C,m.audioContext),!0),this.registerParameter(n.createPsuedoParam("riseTime",.05,10,.05,this.audioContext)),this.registerParameter(n.createPsuedoParam("decayTime",.05,10,.05,this.audioContext)),this.registerParameter(new n("startPoint",0,.99,0,null,null,S,this.audioContext)),Object.defineProperty(this,"multiTrackGain",{enumerable:!0,configurable:!1,value:[]}),this.registerParameter(n.createPsuedoParam("maxLoops",-1,1,-1,this.audioContext)),this.setSources=function(e,n,o){t.prototype.setSources.call(this,e,n,o),h(e)},this.play=function(){if(!this.isInitialized)throw new Error(this.modelName,"hasn't finished Initializing yet. Please wait before calling start/play");var e=this.audioContext.currentTime;this.isPlaying||(y.forEach(function(t,n){var o=A&&A[n]?A[n]:m.startPoint.value*t.buffer.duration;t.loop=1!==m.maxLoops.value,t.start(e,o)}),t.prototype.start.call(this,e),a(function(){"function"==typeof m.onAudioStart&&m.onAudioStart()},e,this.audioContext))},this.start=function(e,n,o,i){return this.isInitialized?void(this.isPlaying||(y.forEach(function(t){("undefined"==typeof n||null===n)&&(n=m.startPoint.value*t.buffer.duration),("undefined"==typeof o||null===o)&&(o=t.buffer.duration),t.loop=1!==m.maxLoops.value,t.start(e,n,o)}),t.prototype.start.call(this,e,n,o,i),a(function(){"function"==typeof m.onAudioStart&&m.onAudioStart()},e,this.audioContext))):void console.error(this.modelName," hasn't finished Initializing yet. Please wait before calling start/play")},this.stop=function(e){m.isPlaying&&(y.forEach(function(t,n){t.stop(e),A[n]=0}),t.prototype.stop.call(this,e),a(function(){"function"==typeof m.onAudioEnd&&m.isPlaying===!1&&m.onAudioEnd()},e,this.audioContext))},this.pause=function(){m.isPlaying&&(y.forEach(function(e,t){e.stop(0),A[t]=e.playbackPosition/e.buffer.sampleRate}),t.prototype.stop.call(this,0),a(function(){"function"==typeof m.onAudioEnd&&m.onAudioEnd()},0,this.audioContext))},this.release=function(e,o,i){t.prototype.release.call(this,e,o,i),i&&(this.releaseGainNode=this.audioContext.createGain(),this.destinations.forEach(function(e){this.releaseGainNode.connect(e.destination,e.output,e.input)}),y.forEach(function(t,i){t.stop(e+o),A[i]=0,t.resetBufferSource(e,this.releaseGainNode);var a=new n("gain-"+i,0,1,1,t.gain,null,null,m.audioContext);m.multiTrackGain.splice(i,1,a)}),this.isPlaying=!1,a(function(){"function"==typeof m.onAudioEnd&&m.isPlaying===!1&&m.onAudioEnd()},e+o,this.audioContext))},window.setTimeout(function(){h(s)},0)}return r.prototype=Object.create(t.prototype),r}),define("core/webAudioDispatch",[],function(){function e(e,t,n){if(!n)return void console.warn("No AudioContext provided");var o=n.currentTime;o>=t||.005>t-o?e():window.setTimeout(function(){e()},1e3*(t-o))}return e}),define("models/Activity",["core/Config","core/BaseSound","models/Looper","core/SPAudioParam","core/webAudioDispatch"],function(e,t,n,o,i){function a(r,u,s,c,l,f){function d(t,n){T.playSpeed.setValueAtTime(e.ZERO,x.audioContext.currentTime),t&&(x.isInitialized=!0),w=0,b=0,C=0,"function"==typeof x.onLoadComplete&&x.onLoadComplete(t,n)}function p(e){T=new n(x.audioContext,e,x.onLoadProgress,d,x.onAudioStart,x.onAudioEnd),T.riseTime.value=x.riseTime.value,T.decayTime.value=x.decayTime.value}function h(e,t,n){if(x.isInitialized){var o=t,i=n.currentTime,a=Math.abs(o-w),r=i-b;if(r>0){var u=Math.log(O),s=Math.log(V),c=Math.exp(u+x.sensitivity.value*(s-u));C=C>L?.5*C+.5*r:r;var l=x.maxSpeed.value,f=l*c*a/C;f=Math.min(Math.abs(f),N*l),T.playSpeed.value=f,f>0&&!E&&(E=!0,x.play()),S&&window.clearTimeout(S),S=window.setTimeout(function(){T.playSpeed.value=0},1e3*Math.min(10*r,I)),P&&window.clearTimeout(P),P=window.setTimeout(function(){E&&(E=!1,x.release())},1e3*T.decayTime.value)}w=o,b=i}}function m(e,t){x.isInitialized&&(T.riseTime.value=t)}function y(e,t){x.isInitialized&&(T.decayTime.value=t)}function A(e,t){x.isInitialized&&(T.startPoint.value=t)}if(!(this instanceof a))throw new TypeError("Activity constructor cannot be called as a function.");t.call(this,r),this.maxSources=e.MAX_VOICES,this.minSources=1,this.modelName="Activity",this.onLoadProgress=s,this.onLoadComplete=c;var v=l,g=f;Object.defineProperty(this,"onAudioStart",{enumerable:!0,configurable:!1,set:function(e){T&&(v=e,T.onAudioStart=e)},get:function(){return v}}),Object.defineProperty(this,"onAudioEnd",{enumerable:!0,configurable:!1,set:function(e){g=e,T&&(T.onAudioEnd=e)},get:function(){return g}});var T,b,C,S,P,x=this,w=0,E=!1,O=.1,V=100,N=1.2,I=.1,L=.001;this.registerParameter(o.createPsuedoParam("maxSpeed",.05,8,1,this.audioContext)),this.registerParameter(new o("action",0,1,0,null,null,h,this.audioContext)),this.registerParameter(o.createPsuedoParam("sensitivity",0,1,.5,this.audioContext)),this.registerParameter(new o("riseTime",.05,10,1,null,null,m,this.audioContext)),this.registerParameter(new o("decayTime",.05,10,1,null,null,y,this.audioContext)),this.registerParameter(new o("startPoint",0,.99,0,null,null,A,this.audioContext)),this.setSources=function(e,n,o){t.prototype.setSources.call(this,e,n,o),T.setSources(e,n,d)},this.play=function(e){return this.isInitialized?(T.play(e),void t.prototype.play.call(this,e)):void console.error(this.modelName," hasn't finished Initializing yet. Please wait before calling start/play")},this.start=function(e,n,o,i){return this.isInitialized?(T.start(e,n,o),void t.prototype.start.call(this,e,n,o,i)):void console.error(this.modelName," hasn't finished Initializing yet. Please wait before calling start/play")},this.stop=function(e){T.stop(e),t.prototype.stop.call(this,e)},this.pause=function(){T.pause(),t.prototype.pause.call(this)},this.release=function(e,t){T.release(e,t);var n=this;i(function(){n.isPlaying=!1},e+t,this.audioContext)},this.disconnect=function(e){T.disconnect(e)},this.connect=function(e,t,n){T.connect(e,t,n)},window.setTimeout(function(){p(u)},0)}return a.prototype=Object.create(t.prototype),a});