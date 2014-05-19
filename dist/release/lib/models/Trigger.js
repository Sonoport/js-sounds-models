/*javascript-sound-models - v0.4.0 - 2014-05-19 */ 
console.log("   ____                           __ \n" + "  / _____  ___ ___  ___ ___  ____/ /_\n" + " _\\ \\/ _ \\/ _ / _ \\/ _ / _ \\/ __/ __/\n" + "/___/\\___/_//_\\___/ .__\\___/_/  \\__/ \n" + "                 /_/                 \n" + "Hello Developer!\n" + "Thanks for using Sonoport Dynamic Sound Library.");

define("core/Config",[],function(){function e(){}return e.MAX_VOICES=8,e.NOMINAL_REFRESH_RATE=60,e.WINDOW_LENGTH=512,e}),define("core/AudioContextMonkeyPatch",[],function(){function e(e){e&&(e.setTargetAtTime||(e.setTargetAtTime=e.setTargetValueAtTime))}window.hasOwnProperty("webkitAudioContext")&&!window.hasOwnProperty("AudioContext")&&(window.AudioContext=webkitAudioContext,AudioContext.prototype.hasOwnProperty("createGain")||(AudioContext.prototype.createGain=AudioContext.prototype.createGainNode),AudioContext.prototype.hasOwnProperty("createDelay")||(AudioContext.prototype.createDelay=AudioContext.prototype.createDelayNode),AudioContext.prototype.hasOwnProperty("createScriptProcessor")||(AudioContext.prototype.createScriptProcessor=AudioContext.prototype.createJavaScriptNode),AudioContext.prototype.internal_createGain=AudioContext.prototype.createGain,AudioContext.prototype.createGain=function(){var t=this.internal_createGain();return e(t.gain),t},AudioContext.prototype.internal_createDelay=AudioContext.prototype.createDelay,AudioContext.prototype.createDelay=function(t){var n=t?this.internal_createDelay(t):this.internal_createDelay();return e(n.delayTime),n},AudioContext.prototype.internal_createBufferSource=AudioContext.prototype.createBufferSource,AudioContext.prototype.createBufferSource=function(){var t=this.internal_createBufferSource();return t.start||(t.start=function(e,t,n){t||n?this.noteGrainOn(e,t,n):this.noteOn(e)}),t.stop||(t.stop=t.noteOff),e(t.playbackRate),t},AudioContext.prototype.internal_createDynamicsCompressor=AudioContext.prototype.createDynamicsCompressor,AudioContext.prototype.createDynamicsCompressor=function(){var t=this.internal_createDynamicsCompressor();return e(t.threshold),e(t.knee),e(t.ratio),e(t.reduction),e(t.attack),e(t.release),t},AudioContext.prototype.internal_createBiquadFilter=AudioContext.prototype.createBiquadFilter,AudioContext.prototype.createBiquadFilter=function(){var t=this.internal_createBiquadFilter();return e(t.frequency),e(t.detune),e(t.Q),e(t.gain),t},AudioContext.prototype.hasOwnProperty("createOscillator")&&(AudioContext.prototype.internal_createOscillator=AudioContext.prototype.createOscillator,AudioContext.prototype.createOscillator=function(){var t=this.internal_createOscillator();return t.start||(t.start=t.noteOn),t.stop||(t.stop=t.noteOff),e(t.frequency),e(t.detune),t}))}),define("core/BaseSound",["core/AudioContextMonkeyPatch"],function(){function e(e){void 0===e||null===e?(console.log("Making a new AudioContext"),this.audioContext=new AudioContext):this.audioContext=e,this.numberOfInputs=0,this.numberOfOutputs=0,this.maxSources=0,this.releaseGainNode=this.audioContext.createGain(),this.isPlaying=!1,this.isInitialized=!1,this.inputNode=null,this.modelName="Model"}return e.prototype.connect=function(e,t,n){if(e instanceof AudioNode)this.releaseGainNode.connect(e,t,n);else{if(!(e.inputNode instanceof AudioNode))throw{name:"No Input Connection Exception",message:"Attempts to connect "+typeof t+" to "+typeof this,toString:function(){return this.name+": "+this.message}};this.releaseGainNode.connect(e.inputNode,t,n)}},e.prototype.disconnect=function(e){this.releaseGainNode.disconnect(e)},e.prototype.start=function(){this.isPlaying=!0},e.prototype.stop=function(e){this.isPlaying=!1,"undefined"==typeof e&&(e=0),this.releaseGainNode.gain.cancelScheduledValues(e)},e.prototype.release=function(e,t){if(this.isPlaying){var n=.5,o=1/this.audioContext.sampleRate;"undefined"==typeof e&&(e=this.audioContext.currentTime),t=t||n,this.releaseGainNode.gain.setValueAtTime(this.releaseGainNode.gain.value,e),this.releaseGainNode.gain.linearRampToValueAtTime(0,e+t),this.stop(e+t+o)}},e.prototype.play=function(){this.start(0)},e.prototype.pause=function(){this.isPlaying=!1},e.prototype.listParams=function(){var e=[];for(var t in this){var n=this[t];n&&n.hasOwnProperty("value")&&n.hasOwnProperty("minValue")&&n.hasOwnProperty("maxValue")&&e.push(n)}return e},e}),define("core/SPAudioParam",[],function(){function e(e,t,n,o,i,a,r,u){var c,s=1e-4,f=500,l=0;if(this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="",Object.defineProperty(this,"value",{enumerable:!0,set:function(e){if(typeof e!=typeof o)throw{name:"Incorrect value type Exception",message:"Attempt to set a "+typeof o+" parameter to a "+typeof e+" value",toString:function(){return this.name+": "+this.message}};"number"==typeof e&&(e>n?(console.log(this.name+" clamping to max"),e=n):t>e&&(console.log(this.name+" clamping to min"),e=t)),"function"==typeof a&&(e=a(e)),"function"==typeof r&&u?r(i,e,u):i?i instanceof AudioParam?i.value=e:i instanceof Array&&i.forEach(function(t){t.value=e}):window.clearInterval(c),l=e},get:function(){if(i){if(i instanceof AudioParam)return i.value;if(i instanceof Array)return i[0].value}return l}}),i&&(i instanceof AudioParam||i instanceof Array)){var p=i[0]||i;this.defaultValue=p.defaultValue,this.minValue=p.minValue,this.maxValue=p.maxValue,this.value=p.defaultValue,this.name=p.name}e&&(this.name=e),"undefined"!=typeof o&&(this.defaultValue=o,this.value=o),"undefined"!=typeof t&&(this.minValue=t),"undefined"!=typeof n&&(this.maxValue=n),this.setValueAtTime=function(e,t){if("function"==typeof a&&(e=a(e)),i)i instanceof AudioParam?i.setValueAtTime(e,t):i instanceof Array&&i.forEach(function(n){n.setValueAtTime(e,t)});else{var n=this,o=t-u.currentTime;window.setTimeout(function(){n.value=e},1e3*o)}},this.setTargetAtTime=function(e,t,n){if("function"==typeof a&&(e=a(e)),i)i instanceof AudioParam?i.setTargetAtTime(e,t,n):i instanceof Array&&i.forEach(function(o){o.setTargetAtTime(e,t,n)});else{var o=this,r=o.value,l=u.currentTime;c=window.setInterval(function(){u.currentTime>=t&&(o.value=e+(r-e)*Math.exp(-(u.currentTime-l)/n),Math.abs(o.value-e)<s&&window.clearInterval(c))},f)}},this.setValueCurveAtTime=function(e,t,n){if("function"==typeof a)for(var o=0;o<e.length;o++)e[o]=a(e[o]);if(i)i instanceof AudioParam?i.setValueCurveAtTime(e,t,n):i instanceof Array&&i.forEach(function(o){o.setValueCurveAtTime(e,t,n)});else{var r=this,s=u.currentTime;c=window.setInterval(function(){if(u.currentTime>=t){var o=Math.floor(e.length*(u.currentTime-s)/n);o<e.length?r.value=e[o]:window.clearInterval(c)}},f)}},this.exponentialRampToValueAtTime=function(e,t){if("function"==typeof a&&(e=a(e)),i)i instanceof AudioParam?i.exponentialRampToValueAtTime(e,t):i instanceof Array&&i.forEach(function(n){n.exponentialRampToValueAtTime(e,t)});else{var n=this,o=n.value,r=u.currentTime;0===o&&(o=.001),c=window.setInterval(function(){var i=(u.currentTime-r)/(t-r);n.value=o*Math.pow(e/o,i),u.currentTime>=t&&window.clearInterval(c)},f)}},this.linearRampToValueAtTime=function(e,t){if("function"==typeof a&&(e=a(e)),i)i instanceof AudioParam?i.linearRampToValueAtTime(e,t):i instanceof Array&&i.forEach(function(n){n.linearRampToValueAtTime(e,t)});else{var n=this,o=n.value,r=u.currentTime;c=window.setInterval(function(){var i=(u.currentTime-r)/(t-r);n.value=o+(e-o)*i,u.currentTime>=t&&window.clearInterval(c)},f)}},this.cancelScheduledValues=function(e){i?i instanceof AudioParam?i.cancelScheduledValues(e):i instanceof Array&&i.forEach(function(t){t.cancelScheduledValues(e)}):window.clearInterval(c)}}return e.createPsuedoParam=function(t,n,o,i,a){return new e(t,n,o,i,null,null,null,a)},e}),define("core/SPPlaybackRateParam",[],function(){function e(e,t){this.defaultValue=e.defaultValue,this.maxValue=e.maxValue,this.minValue=e.minValue,this.name=e.name,this.units=e.units,Object.defineProperty(this,"value",{enumerable:!0,set:function(n){e.value=n,t.value=n},get:function(){return e.value}}),this.linearRampToValueAtTime=function(n,o){e.linearRampToValueAtTime(n,o),t.linearRampToValueAtTime(n,o)},this.exponentialRampToValueAtTime=function(n,o){e.exponentialRampToValueAtTime(n,o),t.exponentialRampToValueAtTime(n,o)},this.setValueCurveAtTime=function(n,o,i){e.setValueCurveAtTime(n,o,i),t.setValueCurveAtTime(n,o,i)},this.setTargetAtTime=function(n,o,i){e.setTargetAtTime(n,o,i),t.setTargetAtTime(n,o,i)},this.setValueAtTime=function(n,o){e.setValueAtTime(n,o),t.setValueAtTime(n,o)},this.cancelScheduledValues=function(n){e.cancelScheduledValues(n),t.cancelScheduledValues(n)}}return e}),define("core/SPAudioBufferSourceNode",["core/SPPlaybackRateParam"],function(e){function t(t){function n(e){for(var n=new Float32Array(e.length),o=t.createBuffer(1,e.length,44100),i=0;i<e.length;i++)n[i]=i;return o.getChannelData(0).set(n),o}function o(){r.connect(u),u.onaudioprocess=i}function i(e){var t=e.inputBuffer.getChannelData(0);c=t[t.length-1]||0}var a=t.createBufferSource(),r=t.createBufferSource(),u=t.createScriptProcessor(256,1,0),c=0;this.channelCount=a.channelCount,this.channelCountMode=a.channelCountMode,this.channelInterpretation=a.channelInterpretation,this.numberOfInputs=a.numberOfInputs,this.numberOfOutputs=a.numberOfOutputs,this.playbackState=a.playbackState,this.playbackRate=new e(a.playbackRate,r.playbackRate),Object.defineProperty(this,"loopEnd",{enumerable:!0,set:function(e){a.loopEnd=e,r.loopEnd=e},get:function(){return a.loopEnd}}),Object.defineProperty(this,"loopStart",{enumerable:!0,set:function(e){a.loopStart=e,r.loopStart=e},get:function(){return a.loopStart}}),Object.defineProperty(this,"onended",{enumerable:!0,set:function(e){a.onended=e},get:function(){return a.onended}}),Object.defineProperty(this,"loop",{enumerable:!0,set:function(e){a.loop=e,r.loop=e},get:function(){return a.loop}}),Object.defineProperty(this,"playbackPosition",{enumerable:!0,get:function(){return c}}),Object.defineProperty(this,"buffer",{enumerable:!0,set:function(e){a.buffer=e,r.buffer=n(e)},get:function(){return a.buffer}}),this.connect=function(e,t,n){a.connect(e,t,n),u.connect(e,t,n)},this.disconnect=function(e){a.disconnect(e),u.disconnect(e)},this.start=function(e,t,n){"undefined"==typeof n&&(n=a.buffer.duration),a.start(e,t,n),r.start(e,t,n)},this.stop=function(e){a.stop(e),r.stop(e)},o()}return t}),define("core/DetectLoopMarkers",[],function(){function e(e){var t=0,n=0,o=5e3,i=.5,a=2e4,r=.01,u=1024,c=16,s=[],f=0,l=function(e,t){for(var n=0,o=t+c;t+c+u>o;++o)n+=Math.abs(e[o]);return r>n/u},p=function(e){return function(t,n,o){var a;return a=o%2===0?n[e]>i:n[e]<-i,t&&a}},d=function(e){var i=null,r=null;t=0,n=f;for(var u=0;null===i&&f>u&&a>u;){if(e.reduce(p(u),!0)&&(1!==e.length||l(e[0],u))){i=u;break}u++}for(u=f;null===r&&u>0&&a>f-u;){if(e.reduce(p(u),!0)){r=u;break}u--}return null!==i&&null!==r&&r>i?(t=i+o/2,n=r-o/2,!0):!1},h=function(e){return function(t,n){return t&&Math.abs(n[e])<r}},m=function(e){var o=!0;for(t=0;a>t&&f>t&&(o=e.reduce(h(t),!0));)t++;for(n=f;a>f-n&&n>0&&(o=e.reduce(h(n),!0));)n--;t>n&&(t=0,nLoopLength_=f)};f=e.length;for(var y=0;y<e.numberOfChannels;y++)s.push(new Float32Array(e.getChannelData(y)));return d(s)||m(s),{start:t,end:n}}return e}),define("core/FileLoader",["core/DetectLoopMarkers"],function(e){function t(n,o,i,a){function r(){var e=Object.prototype.toString.call(n),t=/[^.]+$/.exec(n);if("[object String]"===e){var o=new XMLHttpRequest;o.open("GET",n,!0),o.responseType="arraybuffer",o.addEventListener("progress",a,!1),o.onload=function(){u(o.response,t)},o.send()}else if("[object File]"===e){var i=new FileReader;i.addEventListener("progress",a,!1),i.onload=function(){u(i.result,t)},i.readAsArrayBuffer(n)}}function u(t,a){o.decodeAudioData(t,function(t){if(l=!0,c=t,s=0,f=c.length,"wav"!==a[0]){var n=e(c);n&&(s=n.start,f=n.end)}i&&"function"==typeof i&&i(!0)},function(){console.log("Error Decoding "+n),i&&"function"==typeof i&&i(!1)})}if(!(this instanceof t))throw new TypeError("FileLoader constructor cannot be called as a function.");var c,s=0,f=0,l=!1,p=function(e){var t=/^[0-9]+$/;return t.test(e)?!0:!1},d=function(e,t){if("undefined"==typeof t&&(t=c.length),!p(e))throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer start parameter is not an integer",toString:function(){return this.name+": "+this.message}};if(!p(t))throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer end parameter is not an integer",toString:function(){return this.name+": "+this.message}};if(e>t)throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer start parameter should be smaller than end parameter",toString:function(){return this.name+": "+this.message}};if(e>f||s>e)throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer start parameter should be within the buffer size : 0-"+c.length,toString:function(){return this.name+": "+this.message}};if(t>f||s>t)throw{name:"Incorrect parameter type Exception",message:"FileLoader getBuffer end parameter should be within the buffer size : 0-"+c.length,toString:function(){return this.name+": "+this.message}};for(var n=t-e,i=o.createBuffer(c.numberOfChannels,n,c.sampleRate),a=0;a<c.numberOfChannels;a++){var r=new Float32Array(c.getChannelData(a));i.getChannelData(a).set(r.subarray(e,t))}return i};this.getBuffer=function(e,t){return"undefined"==typeof e&&(e=0),"undefined"==typeof t&&(t=f-s),d(s+e,s+t)},this.getRawBuffer=function(){return c},this.isLoaded=function(){return l},r()}return t}),define("core/MultiFileLoader",["core/FileLoader"],function(e){function t(t,n,o,i){function a(){var e=Object.prototype.toString.call(t);"[object Array]"===e?(s=t.length,t.forEach(function(e){r(e,u)})):void 0!==t&&null!==t&&(s=1,r(t,u))}function r(t,n){var o=Object.prototype.toString.call(t);if("[object String]"===o||"[object File]"===o)var a=new e(t,c.audioContext,function(e){e&&n(e,a.getBuffer())},function(e){i&&"function"==typeof i&&i(e,t)});else{if("[object AudioBuffer]"!==o)throw{name:"Incorrect Parameter type Exception",message:"Looper argument is not a URL or AudioBuffer",toString:function(){return this.name+": "+this.message}};n(!0,t)}}function u(e,t){s--,f.push(t),0===s&&o(e,f)}var c=this,s=0,f=[];a()}return t}),define("models/Looper",["core/Config","core/BaseSound","core/SPAudioParam","core/SPAudioBufferSourceNode","core/MultiFileLoader"],function(e,t,n,o,i){function a(r,u,c,s,f){function l(e){var t=Object.prototype.toString.call(e);if("[object Array]"===t&&e.length>p.maxSources)throw{name:"Unsupported number of sources",message:"This sound only supports a maximum of "+p.maxSources+" sources.",toString:function(){return this.name+": "+this.message}};y=[],d=[],h=[],p.multiTrackGain=[],i.call(p,e,u,g,s),p.releaseGainNode.connect(p.audioContext.destination)}if(!(this instanceof a))throw new TypeError("Looper constructor cannot be called as a function.");t.call(this,u),this.maxSources=e.MAX_VOICES,this.numberOfInputs=1,this.numberOfOutputs=1,this.modelName="Looper";var p=this,d=[],h=[],m=[],y=[],v=c,g=function(e,t){t.forEach(function(e,t){m.push(0),T(e,t)}),p.playSpeed=new n("playSpeed",0,10,1,y,null,S,p.audioContext),p.isInitialized=!0,"function"==typeof v&&v(e)},A=function(e,t){p.isPlaying=!1,"function"==typeof f&&f(p,t)},T=function(e,t){var i=new o(p.audioContext),a=p.audioContext.createGain();i.buffer=e,i.loopEnd=e.duration,i.onended=function(e){A(e,t)},i.connect(a),a.connect(p.releaseGainNode);var r=new n("gainNode",0,1,1,a.gain,null,null,p.audioContext);d.push(i),h.push(a),p.multiTrackGain.push(r),y.push(i.playbackRate)},S=function(e,t,n){if(p.isInitialized){var o=6.90776,i=d[0]?d[0].playbackRate.value:1;t>i?d.forEach(function(e){e.playbackRate.cancelScheduledValues(n.currentTime),e.playbackRate.setTargetAtTime(t,n.currentTime,p.riseTime.value/o)}):i>t&&d.forEach(function(e){e.playbackRate.cancelScheduledValues(n.currentTime),e.playbackRate.setTargetAtTime(t,n.currentTime,p.decayTime.value/o)})}},w=function(e,t){d.forEach(function(e){e.loopStart=t*e.buffer.duration})};this.riseTime=n.createPsuedoParam("riseTime",.05,10,1,this.audioContext),this.decayTime=n.createPsuedoParam("decayTime",.05,10,1,this.audioContext),this.startPoint=new n("startPoint",0,.99,0,null,null,w,this.audioContext),this.playSpeed=null,this.multiTrackGain=[],this.maxLoops=n.createPsuedoParam("maxLoops",-1,1,-1,this.audioContext),this.setSources=function(e,t){this.isInitialized=!1,v=t,l(e)},this.play=function(){this.isPlaying||d.forEach(function(e,t){var n=m&&m[t]?m[t]:p.startPoint.value*e.buffer.duration;e.loop=1!==p.maxLoops.value,e.start(0,n)}),t.prototype.start.call(this,0)},this.start=function(e,n,o,i){this.isPlaying||d.forEach(function(t){if(("undefined"==typeof n||null===n)&&(n=p.startPoint.value*t.buffer.duration),("undefined"==typeof o||null===o)&&(o=t.buffer.duration),t.loop=1!==p.maxLoops.value,"undefined"!=typeof i){var a=p.audioContext.currentTime;p.releaseGainNode.gain.cancelScheduledValues(a),p.releaseGainNode.gain.setValueAtTime(0,a),p.releaseGainNode.gain.linearRampToValueAtTime(1,a+i)}else p.releaseGainNode.gain.setValueAtTime(1,p.audioContext.currentTime);t.start(e,n,o)}),t.prototype.start.call(this,e,n,o)},this.stop=function(e){this.isPlaying&&(d=d.map(function(t,n){t.stop(e),m[n]=0;var i=new o(p.audioContext);return i.buffer=t.buffer,i.loopStart=i.buffer.duration*p.startPoint.value,i.loopEnd=i.buffer.duration,i.connect(h[n]),i.onended=function(e){A(e,n)},i})),t.prototype.stop.call(this,e)},this.pause=function(){this.isPlaying&&(d=d.map(function(e,t){e.stop(0),m[t]=e.playbackPosition/e.buffer.sampleRate,e.disconnect();var n=new o(p.audioContext);return n.buffer=e.buffer,n.loopStart=n.buffer.duration*p.startPoint.value,n.loopEnd=n.buffer.duration,n.connect(h[t]),n.onended=function(e){A(e,t)},n})),t.prototype.stop.call(this,0)},r&&l(r)}return a.prototype=Object.create(t.prototype),a}),define("core/SPEvent",[],function(){function e(t,n,o,i,a,r){if(!(this instanceof e))throw new TypeError("SPEvents constructor cannot be called as a function.");var u=["QENONE","QESTOP","QESTART","QESETPARAM","QESETSRC","QERELEASE"];if("undefined"==typeof n||0>n)throw{name:"Incorrect Parameter Type Exception",message:"SPEvent argument timeStamp is not a positive number",toString:function(){return this.name+": "+this.message}};if("undefined"==typeof o||0>o)throw{name:"Incorrect Parameter Type Exception",message:"SPEvent argument eventID is not a positive number",toString:function(){return this.name+": "+this.message}};if(void 0!==i&&null!==i&&void 0!==r)throw{name:"Incorrect Parameter Type Exception",message:"SPEvent can either have Parameter Information or AudioBuffer defined ",toString:function(){return this.name+": "+this.message}};if(u.indexOf(t)<0)throw{name:"Incorrect Parameter Type Exception",message:"SPEvent has unknown type",toString:function(){return this.name+": "+this.message}};this.type=t,this.time=n,this.eventID=o,this.paramName=i,this.paramValue=a,this.audioBuffer=r}return e}),define("core/SoundQueue",["core/Config","models/Looper","core/FileLoader","core/SPEvent"],function(e,t,n,o){function i(n,a){function r(){d(n.currentTime+1/e.NOMINAL_REFRESH_RATE),window.requestAnimationFrame(r)}function u(){for(var e=0;a>e;e++)v[e]=new t(null,n,null,c),v[e].maxLoops.value=1;window.requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,window.requestAnimationFrame(r)}function c(e){v.push(e),y.splice(y.indexOf(e),1)}function s(e){for(h=0;h<y.length;h++)if(y[h].eventID==e)return y[h];return null}function f(e){for(var t=0;t<m.length;t++){var n=m[t];n.eventID===e&&(m.splice(t,1),t--)}}function l(e,t){var o;return v.length<1?(console.warn("No free voices left. Stealing the oldest"),o=y.shift(),f(o.eventID),o.eventID=e,o.release(n.currentTime,t-n.currentTime),y.push(o)):(o=v.shift(),o.eventID=e,y.push(o)),o}function p(e){var t=s(e.eventID);if("QESTART"!=e.type&&"QESETPARAM"!=e.type&&"QESETSRC"!=e.type||null!==t||(t=l(e.eventID,e.time)),t)if("QESTART"==e.type)t.start(e.time,null,null,e.paramValue);else if("QESETPARAM"==e.type)t[e.paramName]&&t[e.paramName].setValueAtTime(e.paramValue,e.time);else if("QESETSRC"==e.type){var o=function(e,t){e.setSources(t.audioBuffer)};window.setTimeout(o(t,e),e.time-n.currentTime)}else if("QERELEASE"==e.type)t.release(e.time,e.paramValue);else if("QESTOP"==e.type){var i=function(e){v.push(e),y.splice(y.indexOf(e),1)};t.pause(e.time),window.setTimeout(i(t),e.time-n.currentTime)}else console.warn("Unknown Event Type : "+e)}function d(e){for(var t=0;t<m.length;t++){var n=m[t];n.time<=e&&(p(n),m.splice(t,1),t--)}}if(!(this instanceof i))throw new TypeError("SoundQueue constructor cannot be called as a function.");"undefined"==typeof a&&(a=e.MAX_VOICES);var h,m=[],y=[],v=[];this.queueStart=function(e,t,n){m.push(new o("QESTART",e,t,"attackDur",n))},this.queueRelease=function(e,t,n){m.push(new o("QERELEASE",e,t,"releaseDur",n))},this.queueStop=function(e,t){m.push(new o("QESTOP",e,t))},this.queueSetParameter=function(e,t,n,i){m.push(new o("QESETPARAM",e,t,n,i))},this.queueSetSource=function(e,t,n){m.push(new o("QESETSRC",e,t,null,null,n))},this.queueUpdate=function(e,t,n,o){for(var i=0;i<m.length;i++){var a=m[i];a.type!==e||t&&a.eventID!=t||a.paramName===n&&(a.paramValue=o)}},this.connect=function(e,t,n){v.forEach(function(o){o.connect(e,t,n)}),y.forEach(function(o){o.connect(e,t,n)})},this.disconnect=function(e){v.forEach(function(t){t.disconnect(e)}),y.forEach(function(t){t.disconnect(e)})},u()}return i}),define("core/Converter",[],function(){function e(){}return e.semitonesToRatio=function(e){return Math.pow(2,e/12)},e}),define("models/Trigger",["core/Config","core/BaseSound","core/SoundQueue","core/SPAudioParam","core/MultiFileLoader","core/Converter"],function(e,t,n,o,i,a){function r(u,c,s,f){function l(e){p=new n(h.audioContext),i.call(h,e,h.audioContext,A,f),d=e}if(!(this instanceof r))throw new TypeError("Trigger constructor cannot be called as a function.");t.call(this,c),this.maxSources=e.MAX_VOICES,this.numberOfInputs=1,this.numberOfOutputs=1,this.modelName="Trigger";var p,d,h=this,m=[],y=0,v=0,g=s,A=function(e,t){m=t,p.connect(h.releaseGainNode),h.isInitialized=!0,"function"==typeof g&&g(e)};this.pitchShift=o.createPsuedoParam("pitchShift",-60,60,0,this.audioContext),this.pitchRand=o.createPsuedoParam("pitchRand",0,24,0,this.audioContext),this.eventRand=o.createPsuedoParam("eventRand",!0,!1,!1,this.audioContext),this.setSources=function(e,t){this.isInitialized=!1,g=t,l(e)},this.play=function(e){("undefined"==typeof e||e<this.audioContext.currentTime)&&(e=this.audioContext.currentTime);var n=1;"[object Array]"===Object.prototype.toString.call(d)&&(n=d.length),v=this.eventRand.value?n>2?(v+1+Math.floor(Math.random()*(n-1)))%n:Math.floor(Math.random()*(n-1)):(v+1)%n;var o=e,i=a.semitonesToRatio(this.pitchShift.value+Math.random()*this.pitchRand.value);p.queueSetSource(o,y,m[v]),p.queueSetParameter(o,y,"playSpeed",i),p.queueStart(o,y),y++,t.prototype.start.call(this,0)},u&&l(u)}return r.prototype=Object.create(t.prototype),r});