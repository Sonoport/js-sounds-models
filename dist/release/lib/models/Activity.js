/*javascript-sound-models - v1.0.1 - 2014-06-25 */ 
console.log("   ____                           __ \n" + "  / _____  ___ ___  ___ ___  ____/ /_\n" + " _\\ \\/ _ \\/ _ / _ \\/ _ / _ \\/ __/ __/\n" + "/___/\\___/_//_\\___/ .__\\___/_/  \\__/ \n" + "                 /_/                 \n" + "Hello Developer!\n" + "Thanks for using Sonoport Dynamic Sound Library.");

define("core/Config",[],function(){function e(){}return e.ZERO=parseFloat("1e-37"),e.MAX_VOICES=8,e.NOMINAL_REFRESH_RATE=60,e.WINDOW_LENGTH=512,e}),define("core/AudioContextMonkeyPatch",[],function(){function e(e){e&&(e.setTargetAtTime||(e.setTargetAtTime=e.setTargetValueAtTime))}window.hasOwnProperty("webkitAudioContext")&&!window.hasOwnProperty("AudioContext")&&(window.AudioContext=webkitAudioContext,AudioContext.prototype.hasOwnProperty("createGain")||(AudioContext.prototype.createGain=AudioContext.prototype.createGainNode),AudioContext.prototype.hasOwnProperty("createDelay")||(AudioContext.prototype.createDelay=AudioContext.prototype.createDelayNode),AudioContext.prototype.hasOwnProperty("createScriptProcessor")||(AudioContext.prototype.createScriptProcessor=AudioContext.prototype.createJavaScriptNode),AudioContext.prototype.internal_createGain=AudioContext.prototype.createGain,AudioContext.prototype.createGain=function(){var t=this.internal_createGain();return e(t.gain),t},AudioContext.prototype.internal_createDelay=AudioContext.prototype.createDelay,AudioContext.prototype.createDelay=function(t){var n=t?this.internal_createDelay(t):this.internal_createDelay();return e(n.delayTime),n},AudioContext.prototype.internal_createBufferSource=AudioContext.prototype.createBufferSource,AudioContext.prototype.createBufferSource=function(){var t=this.internal_createBufferSource();return t.start||(t.start=function(e,t,n){t||n?this.noteGrainOn(e,t,n):this.noteOn(e)}),t.stop||(t.stop=t.noteOff),e(t.playbackRate),t},AudioContext.prototype.internal_createDynamicsCompressor=AudioContext.prototype.createDynamicsCompressor,AudioContext.prototype.createDynamicsCompressor=function(){var t=this.internal_createDynamicsCompressor();return e(t.threshold),e(t.knee),e(t.ratio),e(t.reduction),e(t.attack),e(t.release),t},AudioContext.prototype.internal_createBiquadFilter=AudioContext.prototype.createBiquadFilter,AudioContext.prototype.createBiquadFilter=function(){var t=this.internal_createBiquadFilter();return e(t.frequency),e(t.detune),e(t.Q),e(t.gain),t},AudioContext.prototype.hasOwnProperty("createOscillator")&&(AudioContext.prototype.internal_createOscillator=AudioContext.prototype.createOscillator,AudioContext.prototype.createOscillator=function(){var t=this.internal_createOscillator();return t.start||(t.start=t.noteOn),t.stop||(t.stop=t.noteOff),e(t.frequency),e(t.detune),t}))}),define("core/BaseSound",["core/AudioContextMonkeyPatch"],function(){function e(e){void 0===e||null===e?(console.log("Making a new AudioContext"),this.audioContext=new AudioContext):this.audioContext=e,this.numberOfInputs=0,Object.defineProperty(this,"numberOfOutputs",{enumerable:!0,get:function(){return this.releaseGainNode.numberOfOutputs}});var t=0;Object.defineProperty(this,"maxSources",{enumerable:!0,set:function(e){0>e&&(e=0),t=Math.round(e)},get:function(){return t}}),this.releaseGainNode=this.audioContext.createGain(),this.isPlaying=!1,this.isInitialized=!1,this.inputNode=null,this.modelName="Model",this.releaseGainNode.connect(this.audioContext.destination)}return e.prototype.connect=function(e,t,n){if(e instanceof AudioNode)this.releaseGainNode.connect(e,t,n);else{if(!(e.inputNode instanceof AudioNode))throw new Error("No Input Connection - Attempts to connect "+typeof t+" to "+typeof this);this.releaseGainNode.connect(e.inputNode,t,n)}},e.prototype.disconnect=function(e){this.releaseGainNode.disconnect(e)},e.prototype.start=function(){this.isPlaying=!0},e.prototype.stop=function(e){var t=1/this.audioContext.sampleRate;this.isPlaying=!1,"undefined"==typeof e&&(e=0),this.releaseGainNode.gain.cancelScheduledValues(e),this.releaseGainNode.gain.setValueAtTime(1,e+t)},e.prototype.release=function(e,t){if(this.isPlaying){var n=.5,o=1/this.audioContext.sampleRate;"undefined"==typeof e&&(e=this.audioContext.currentTime),t=t||n,this.releaseGainNode.gain.setValueAtTime(this.releaseGainNode.gain.value,e),this.releaseGainNode.gain.linearRampToValueAtTime(0,e+t),this.stop(e+t+o)}},e.prototype.play=function(){this.start(0)},e.prototype.pause=function(){this.isPlaying=!1},e.prototype.listParams=function(){var e=[];for(var t in this){var n=this[t];n&&n.hasOwnProperty("value")&&n.hasOwnProperty("minValue")&&n.hasOwnProperty("maxValue")&&e.push(n)}return e},e}),define("core/WebAudioDispatch",[],function(){function e(e,t,n){if(n){var o=n.currentTime;o>=t||.005>t-o?e():(console.log("Dispatching in ",1e3*(t-o)),window.setTimeout(function(){e()},1e3*(t-o)))}}return e}),define("core/SPAudioParam",["core/WebAudioDispatch"],function(e){function t(t,n,o,i,a,r,u,c){var s,l=1e-4,f=500,d=0;if(this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="",Object.defineProperty(this,"value",{enumerable:!0,set:function(e){if(typeof e!=typeof i)throw new Error("Attempt to set a "+typeof i+" parameter to a "+typeof e+" value");"number"==typeof e&&(e>o?(console.log(this.name+" clamping to max"),e=o):n>e&&(console.log(this.name+" clamping to min"),e=n)),"function"==typeof r&&(e=r(e)),"function"==typeof u&&c?u(a,e,c):a?a instanceof AudioParam?a.value=e:a instanceof Array&&a.forEach(function(t){t.value=e}):window.clearInterval(s),d=e},get:function(){if(a){if(a instanceof AudioParam)return a.value;if(a instanceof Array)return a[0].value}return d}}),a&&(a instanceof AudioParam||a instanceof Array)){var p=a[0]||a;this.defaultValue=p.defaultValue,this.minValue=p.minValue,this.maxValue=p.maxValue,this.value=p.defaultValue,this.name=p.name}t&&(this.name=t),"undefined"!=typeof i&&(this.defaultValue=i,this.value=i),"undefined"!=typeof n&&(this.minValue=n),"undefined"!=typeof o&&(this.maxValue=o),this.setValueAtTime=function(t,n){if("function"==typeof r&&(t=r(t)),a)a instanceof AudioParam?a.setValueAtTime(t,n):a instanceof Array&&a.forEach(function(e){e.setValueAtTime(t,n)});else{var o=this;e(function(){o.value=t},n,c)}},this.setTargetAtTime=function(e,t,n){if("function"==typeof r&&(e=r(e)),a)a instanceof AudioParam?a.setTargetAtTime(e,t,n):a instanceof Array&&a.forEach(function(o){o.setTargetAtTime(e,t,n)});else{var o=this,i=o.value,u=c.currentTime;s=window.setInterval(function(){c.currentTime>=t&&(o.value=e+(i-e)*Math.exp(-(c.currentTime-u)/n),Math.abs(o.value-e)<l&&window.clearInterval(s))},f)}},this.setValueCurveAtTime=function(e,t,n){if("function"==typeof r)for(var o=0;o<e.length;o++)e[o]=r(e[o]);if(a)a instanceof AudioParam?a.setValueCurveAtTime(e,t,n):a instanceof Array&&a.forEach(function(o){o.setValueCurveAtTime(e,t,n)});else{var i=this,u=c.currentTime;s=window.setInterval(function(){if(c.currentTime>=t){var o=Math.floor(e.length*(c.currentTime-u)/n);o<e.length?i.value=e[o]:window.clearInterval(s)}},f)}},this.exponentialRampToValueAtTime=function(e,t){if("function"==typeof r&&(e=r(e)),a)a instanceof AudioParam?a.exponentialRampToValueAtTime(e,t):a instanceof Array&&a.forEach(function(n){n.exponentialRampToValueAtTime(e,t)});else{var n=this,o=n.value,i=c.currentTime;0===o&&(o=.001),s=window.setInterval(function(){var a=(c.currentTime-i)/(t-i);n.value=o*Math.pow(e/o,a),c.currentTime>=t&&window.clearInterval(s)},f)}},this.linearRampToValueAtTime=function(e,t){if("function"==typeof r&&(e=r(e)),a)a instanceof AudioParam?a.linearRampToValueAtTime(e,t):a instanceof Array&&a.forEach(function(n){n.linearRampToValueAtTime(e,t)});else{var n=this,o=n.value,i=c.currentTime;s=window.setInterval(function(){var a=(c.currentTime-i)/(t-i);n.value=o+(e-o)*a,c.currentTime>=t&&window.clearInterval(s)},f)}},this.cancelScheduledValues=function(e){a?a instanceof AudioParam?a.cancelScheduledValues(e):a instanceof Array&&a.forEach(function(t){t.cancelScheduledValues(e)}):window.clearInterval(s)}}return t.createPsuedoParam=function(e,n,o,i,a){return new t(e,n,o,i,null,null,null,a)},t}),define("core/SPPlaybackRateParam",[],function(){function e(e,t){this.defaultValue=e.defaultValue,this.maxValue=e.maxValue,this.minValue=e.minValue,this.name=e.name,this.units=e.units,Object.defineProperty(this,"value",{enumerable:!0,set:function(n){e.value=n,t.value=n},get:function(){return e.value}}),this.linearRampToValueAtTime=function(n,o){e.linearRampToValueAtTime(n,o),t.linearRampToValueAtTime(n,o)},this.exponentialRampToValueAtTime=function(n,o){e.exponentialRampToValueAtTime(n,o),t.exponentialRampToValueAtTime(n,o)},this.setValueCurveAtTime=function(n,o,i){e.setValueCurveAtTime(n,o,i),t.setValueCurveAtTime(n,o,i)},this.setTargetAtTime=function(n,o,i){e.setTargetAtTime(n,o,i),t.setTargetAtTime(n,o,i)},this.setValueAtTime=function(n,o){e.setValueAtTime(n,o),t.setValueAtTime(n,o)},this.cancelScheduledValues=function(n){e.cancelScheduledValues(n),t.cancelScheduledValues(n)}}return e}),define("core/SPAudioBufferSourceNode",["core/SPPlaybackRateParam","core/WebAudioDispatch"],function(e,t){function n(n){function o(e){for(var t=new Float32Array(e.length),o=n.createBuffer(1,e.length,44100),i=0;i<e.length;i++)t[i]=i;return o.getChannelData(0).set(t),o}function i(){u.connect(c),c.onaudioprocess=a}function a(e){var t=e.inputBuffer.getChannelData(0);s=t[t.length-1]||0}var r=n.createBufferSource(),u=n.createBufferSource(),c=n.createScriptProcessor(256,1,1),s=0;this.audioContext=n,this.channelCount=r.channelCount,this.channelCountMode=r.channelCountMode,this.channelInterpretation=r.channelInterpretation,this.numberOfInputs=r.numberOfInputs,this.numberOfOutputs=r.numberOfOutputs,this.playbackState=r.playbackState,this.playbackRate=new e(r.playbackRate,u.playbackRate),Object.defineProperty(this,"loopEnd",{enumerable:!0,set:function(e){r.loopEnd=e,u.loopEnd=e},get:function(){return r.loopEnd}}),Object.defineProperty(this,"loopStart",{enumerable:!0,set:function(e){r.loopStart=e,u.loopStart=e},get:function(){return r.loopStart}}),Object.defineProperty(this,"onended",{enumerable:!0,set:function(e){r.onended=e},get:function(){return r.onended}}),Object.defineProperty(this,"loop",{enumerable:!0,set:function(e){r.loop=e,u.loop=e},get:function(){return r.loop}}),Object.defineProperty(this,"playbackPosition",{enumerable:!0,get:function(){return s}}),Object.defineProperty(this,"buffer",{enumerable:!0,set:function(e){r.buffer=e,u.buffer=o(e)},get:function(){return r.buffer}}),this.connect=function(e,t,n){r.connect(e,t,n),c.connect(e,t,n)},this.disconnect=function(e){r.disconnect(e),c.disconnect(e)},this.start=function(e,t,n){"undefined"==typeof n&&(n=r.buffer.duration),r.start(e,t,n),u.start(e,t,n)},this.stop=function(e){var t=r.playbackState;void 0!==t&&t===r.PLAYING_STATE&&r.stop(e),t=u.playbackState,void 0!==t&&t===r.PLAYING_STATE&&u.stop(e)},this.resetBufferSource=function(o,i){var a=this;t(function(){a.disconnect(i);var t=a.audioContext.createBufferSource();t.buffer=r.buffer,t.loopStart=r.loopStart,t.loopEnd=r.loopEnd,t.onended=r.onended,r=t;var o=n.createBufferSource();o.buffer=u.buffer,o.connect(c),u=o;var s=a.playbackRate.value;a.playbackRate=new e(r.playbackRate,u.playbackRate),a.playbackRate.setValueAtTime(s,0),a.connect(i)},o,this.audioContext)},i()}return n}),define("core/DetectLoopMarkers",[],function(){function e(e){var t=0,n=0,o=!0,i=5e3,a=.5,r=2e4,u=.01,c=1024,s=16,l=[],f=0,d=function(e,t){for(var n=0,o=t+s;t+s+c>o;++o)n+=Math.abs(e[o]);return u>n/c},p=function(e){return function(t,n,o){var i;return i=o%2===0?n[e]>a:n[e]<-a,t&&i}},h=function(e){var o=null,a=null;t=0,n=f;for(var u=0;null===o&&f>u&&r>u;){if(e.reduce(p(u),!0)&&(1!==e.length||d(e[0],u))){o=u;break}u++}for(u=f;null===a&&u>0&&r>f-u;){if(e.reduce(p(u),!0)){a=u;break}u--}return null!==o&&null!==a&&a>o+i?(t=o+i/2,n=a-i/2,!0):!1},m=function(e){return function(t,n){return t&&Math.abs(n[e])<u}},y=function(e){var o=!0;for(t=0;r>t&&f>t&&(o=e.reduce(m(t),!0));)t++;for(n=f;r>f-n&&n>0&&(o=e.reduce(m(n),!0));)n--;t>n&&(t=0)};f=e.length;for(var v=0;v<e.numberOfChannels;v++)l.push(new Float32Array(e.getChannelData(v)));return h(l)||(y(l),o=!1),{marked:o,start:t,end:n}}return e}),define("core/FileLoader",["core/DetectLoopMarkers"],function(e){function t(n,o,i,a){function r(){var e=Object.prototype.toString.call(n),t=/[^.]+$/.exec(n);if("[object String]"===e){var o=new XMLHttpRequest;o.open("GET",n,!0),o.responseType="arraybuffer",o.addEventListener("progress",a,!1),o.onload=function(){u(o.response,t)},o.send()}else if("[object File]"===e||"[object Blob]"===e){var i=new FileReader;i.addEventListener("progress",a,!1),i.onload=function(){u(i.result,t)},i.readAsArrayBuffer(n)}}function u(t,a){o.decodeAudioData(t,function(t){if(f=!0,c=t,s=0,l=c.length,"wav"!==a[0]){var n=e(c);n&&(s=n.start,l=n.end)}i&&"function"==typeof i&&i(!0)},function(){console.warn("Error Decoding "+n),i&&"function"==typeof i&&i(!1)})}if(!(this instanceof t))throw new TypeError("FileLoader constructor cannot be called as a function.");var c,s=0,l=0,f=!1,d=function(e){var t=/^[0-9]+$/;return t.test(e)?!0:!1},p=function(e,t){if("undefined"==typeof t&&(t=c.length),!d(e))throw new Error("Incorrect parameter Type - FileLoader getBuffer start parameter is not an integer");if(!d(t))throw new Error("Incorrect parameter Type - FileLoader getBuffer end parameter is not an integer");if(e>t)throw new Error("Incorrect parameter Type - FileLoader getBuffer start parameter should be smaller than end parameter");if(e>l||s>e)throw new Error("Incorrect parameter Type - FileLoader getBuffer start parameter should be within the buffer size : 0-"+c.length);if(t>l||s>t)throw new Error("Incorrect parameter Type - FileLoader getBuffer end parameter should be within the buffer size : 0-"+c.length);var n=t-e;if(!c)throw new Error("No Buffer Found - Buffer loading has not completed or has failed.");for(var i=o.createBuffer(c.numberOfChannels,n,c.sampleRate),a=0;a<c.numberOfChannels;a++){var r=new Float32Array(c.getChannelData(a));i.getChannelData(a).set(r.subarray(e,t))}return i};this.getBuffer=function(e,t){return"undefined"==typeof e&&(e=0),"undefined"==typeof t&&(t=l-s),p(s+e,s+t)},this.getRawBuffer=function(){if(!f)throw new Error("No Buffer Found - Buffer loading has not completed or has failed.");return c},this.isLoaded=function(){return f},r()}return t}),define("core/MultiFileLoader",["core/FileLoader"],function(e){function t(t,n,o,i){function a(){var e=Object.prototype.toString.call(t);"[object Array]"===e?(s=t.length,t.forEach(function(e){r(e,u)})):void 0!==t&&null!==t&&(s=1,r(t,u))}function r(t,n){var o=Object.prototype.toString.call(t);if("[object String]"===o||"[object File]"===o)var a=new e(t,c.audioContext,function(e){e?n(e,a.getBuffer()):n(e)},function(e){i&&"function"==typeof i&&i(e,t)});else{if("[object AudioBuffer]"!==o)throw new Error("Incorrect Parameter Type - Source is not a URL or AudioBuffer");n(!0,t)}}function u(e,n){e&&l.push(n),s--,0===s&&o(l.length===t.length,l)}var c=this;this.audioContext=n;var s=0,l=[];a()}return t}),define("models/Looper",["core/Config","core/BaseSound","core/SPAudioParam","core/SPAudioBufferSourceNode","core/MultiFileLoader"],function(e,t,n,o,i){function a(r,u,c,s,l){function f(e){var t=Object.prototype.toString.call(e);if(y=[],p.forEach(function(e){e.disconnect()}),p=[],"[object Array]"===t&&e.length>d.maxSources)throw new Error("Unsupported number of Sources - Looper sound only supports a maximum of "+d.maxSources+" Sources.");"[object AudioBuffer]"===t?A(!0,[e]):i.call(d,e,d.audioContext,A,s)}if(!(this instanceof a))throw new TypeError("Looper constructor cannot be called as a function.");t.call(this,u),this.maxSources=e.MAX_VOICES,this.modelName="Looper";var d=this,p=[],h=[],m=[],y=[],v=c,A=function(e,t){t.forEach(function(e,t){m.push(0),b(e,t)}),d.playSpeed=new n("playSpeed",0,10,1,y,null,w,d.audioContext),d.isInitialized=!0,"function"==typeof v&&v(e)},T=function(e,t,n){d.isPlaying=!1;var o=d.audioContext.currentTime;n.resetBufferSource(o,h[t]),"function"==typeof l&&l(d,t)},b=function(e,t){var i=new o(d.audioContext);i.buffer=e,i.loopEnd=e.duration,i.onended=function(e){T(e,t,i)};var a;if(h[t])a=h[t];else{a=d.audioContext.createGain(),h[t]=a;var r=new n("gain",0,1,1,a.gain,null,null,d.audioContext);d.multiTrackGain.push[t]=r}i.connect(a),a.connect(d.releaseGainNode),p.push(i),y.push(i.playbackRate)},w=function(e,t,n){if(d.isInitialized){var o=6.90776,i=p[0]?p[0].playbackRate.value:1;t>i?p.forEach(function(e){e.playbackRate.cancelScheduledValues(n.currentTime),e.playbackRate.setTargetAtTime(t,n.currentTime,d.riseTime.value/o)}):i>t&&p.forEach(function(e){e.playbackRate.cancelScheduledValues(n.currentTime),e.playbackRate.setTargetAtTime(t,n.currentTime,d.decayTime.value/o)})}},g=function(e,t){p.forEach(function(e){e.loopStart=t*e.buffer.duration})};this.playSpeed=null,this.riseTime=n.createPsuedoParam("riseTime",.05,10,.05,this.audioContext),this.decayTime=n.createPsuedoParam("decayTime",.05,10,.05,this.audioContext),this.startPoint=new n("startPoint",0,.99,0,null,null,g,this.audioContext),this.multiTrackGain=[],this.maxLoops=n.createPsuedoParam("maxLoops",-1,1,-1,this.audioContext),this.setSources=function(e,t){this.isInitialized=!1,v=t,f(e)},this.play=function(){if(!this.isInitialized)throw new Error(this.modelName," hasn't finished Initializing yet. Please wait before calling start/play");this.isPlaying||p.forEach(function(e,t){var n=m&&m[t]?m[t]:d.startPoint.value*e.buffer.duration;e.loop=1!==d.maxLoops.value,e.start(0,n)}),t.prototype.start.call(this,0)},this.start=function(e,n,o,i){if(!this.isInitialized)throw new Error(this.modelName," hasn't finished Initializing yet. Please wait before calling start/play");this.isPlaying||p.forEach(function(t){if(("undefined"==typeof n||null===n)&&(n=d.startPoint.value*t.buffer.duration),("undefined"==typeof o||null===o)&&(o=t.buffer.duration),t.loop=1!==d.maxLoops.value,"undefined"!=typeof i){var a=d.audioContext.currentTime;d.releaseGainNode.gain.cancelScheduledValues(a),d.releaseGainNode.gain.setValueAtTime(0,a),d.releaseGainNode.gain.linearRampToValueAtTime(1,a+i)}else d.releaseGainNode.gain.setValueAtTime(1,d.audioContext.currentTime);t.start(e,n,o)}),t.prototype.start.call(this,e,n,o)},this.stop=function(e){p.forEach(function(t,n){d.isPlaying&&t.stop(e),m[n]=0}),t.prototype.stop.call(this,e)},this.pause=function(){p.forEach(function(e,t){d.isPlaying&&e.stop(0),m[t]=e.playbackPosition/e.buffer.sampleRate}),t.prototype.stop.call(this,0)},r&&f(r)}return a.prototype=Object.create(t.prototype),a}),define("models/Activity",["core/Config","core/BaseSound","models/Looper","core/SPAudioParam"],function(e,t,n,o){function i(a,r,u,c){function s(t){m.playSpeed.setValueAtTime(e.ZERO,T.audioContext.currentTime),T.isInitialized=!0,b=0,y=0,v=0,"function"==typeof w&&w(t)}function l(e){m=new n(e,T.audioContext,s,c,null)}function f(e,t,n){if(T.isInitialized){var o=t,i=n.currentTime,a=Math.abs(o-b),r=i-y;if(r>0){var u=Math.log(g),c=Math.log(x),s=Math.exp(u+T.sensitivity.value*(c-u));v=v>S?.5*v+.5*r:r;var l=T.maxRate.value,f=l*s*a/v;f=Math.min(Math.abs(f),C*l),m.playSpeed.value=f,A&&window.clearTimeout(A),A=window.setTimeout(function(){m.playSpeed.value=0},1e3*Math.min(10*r,P))}b=o,y=i}}function d(e,t){T.isInitialized&&(m.riseTime.value=t)}function p(e,t){T.isInitialized&&(m.decayTime.value=t)}function h(e,t){T.isInitialized&&(m.startPoint.value=t)}if(!(this instanceof i))throw new TypeError("Activity constructor cannot be called as a function.");t.call(this,r),this.maxSources=e.MAX_VOICES,this.modelName="Activity";var m,y,v,A,T=this,b=0,w=u,g=.1,x=100,C=1.2,P=.1,S=.001;this.maxRate=o.createPsuedoParam("maxRate",.05,8,1,this.audioContext),this.action=new o("action",0,1,0,null,null,f,this.audioContext),this.sensitivity=o.createPsuedoParam("sensitivity",0,1,.5,this.audioContext),this.riseTime=new o("riseTime",.05,10,1,null,null,d,this.audioContext),this.decayTime=new o("decayTime",.05,10,1,null,null,p,this.audioContext),this.startPoint=new o("startPoint",0,.99,0,null,null,h,this.audioContext),this.setSources=function(e,t){this.isInitialized=!1,w=t,m.setSources(e,s)},this.play=function(e){if(!this.isInitialized)throw new Error(this.modelName," hasn't finished Initializing yet. Please wait before calling start/play");m.play(e),t.prototype.play.call(this,e)},this.start=function(e,n,o){if(!this.isInitialized)throw new Error(this.modelName," hasn't finished Initializing yet. Please wait before calling start/play");m.start(e,n,o),t.prototype.start.call(this,e,n,o)},this.stop=function(e){m.stop(e),t.prototype.stop.call(this,e)},this.pause=function(){m.pause(),t.prototype.pause.call(this)},this.release=function(e,n){m.release(e,n),t.prototype.release.call(this,e,n)},this.disconnect=function(e){m.disconnect(e)},this.connect=function(e,t,n){m.connect(e,t,n)},a&&l(a)}return i.prototype=Object.create(t.prototype),i});