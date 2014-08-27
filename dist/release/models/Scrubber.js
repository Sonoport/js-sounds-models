/*javascript-sound-models - v1.2.0 - Tue Aug 26 2014 16:03:48 GMT+0800 (SGT) */ 
console.log("   ____                           __ \n" + "  / _____  ___ ___  ___ ___  ____/ /_\n" + " _\\ \\/ _ \\/ _ / _ \\/ _ / _ \\/ __/ __/\n" + "/___/\\___/_//_\\___/ .__\\___/_/  \\__/ \n" + "                 /_/                 \n" + "Hello Developer!\n" + "Thanks for using Sonoport Dynamic Sound Library v1.2.0.");
define("core/Config",[],function(){function e(){}return e.LOG_ERRORS=!0,e.ZERO=parseFloat("1e-37"),e.MAX_VOICES=8,e.NOMINAL_REFRESH_RATE=60,e.WINDOW_LENGTH=512,e.CHUNK_LENGTH=256,e}),define("core/WebAudioDispatch",[],function(){function e(e,t,n){if(!n)return void console.warn("No AudioContext provided");var o=n.currentTime;o>=t||.005>t-o?e():window.setTimeout(function(){e()},1e3*(t-o))}return e}),define("core/AudioContextMonkeyPatch",[],function(){function e(e){e&&(e.setTargetAtTime||(e.setTargetAtTime=e.setTargetValueAtTime))}window.hasOwnProperty("webkitAudioContext")&&!window.hasOwnProperty("AudioContext")&&(window.AudioContext=webkitAudioContext,AudioContext.prototype.hasOwnProperty("createGain")||(AudioContext.prototype.createGain=AudioContext.prototype.createGainNode),AudioContext.prototype.hasOwnProperty("createDelay")||(AudioContext.prototype.createDelay=AudioContext.prototype.createDelayNode),AudioContext.prototype.hasOwnProperty("createScriptProcessor")||(AudioContext.prototype.createScriptProcessor=AudioContext.prototype.createJavaScriptNode),AudioContext.prototype.internal_createGain=AudioContext.prototype.createGain,AudioContext.prototype.createGain=function(){var t=this.internal_createGain();return e(t.gain),t},AudioContext.prototype.internal_createDelay=AudioContext.prototype.createDelay,AudioContext.prototype.createDelay=function(t){var n=t?this.internal_createDelay(t):this.internal_createDelay();return e(n.delayTime),n},AudioContext.prototype.internal_createBufferSource=AudioContext.prototype.createBufferSource,AudioContext.prototype.createBufferSource=function(){var t=this.internal_createBufferSource();return t.start||(t.start=function(e,t,n){t||n?this.noteGrainOn(e,t,n):this.noteOn(e)}),t.stop||(t.stop=t.noteOff),e(t.playbackRate),t},AudioContext.prototype.internal_createDynamicsCompressor=AudioContext.prototype.createDynamicsCompressor,AudioContext.prototype.createDynamicsCompressor=function(){var t=this.internal_createDynamicsCompressor();return e(t.threshold),e(t.knee),e(t.ratio),e(t.reduction),e(t.attack),e(t.release),t},AudioContext.prototype.internal_createBiquadFilter=AudioContext.prototype.createBiquadFilter,AudioContext.prototype.createBiquadFilter=function(){var t=this.internal_createBiquadFilter();return e(t.frequency),e(t.detune),e(t.Q),e(t.gain),t},AudioContext.prototype.hasOwnProperty("createOscillator")&&(AudioContext.prototype.internal_createOscillator=AudioContext.prototype.createOscillator,AudioContext.prototype.createOscillator=function(){var t=this.internal_createOscillator();return t.start||(t.start=t.noteOn),t.stop||(t.stop=t.noteOff),e(t.frequency),e(t.detune),t}))}),define("core/BaseSound",["core/WebAudioDispatch","core/AudioContextMonkeyPatch"],function(e){function t(e){function t(e){function t(){o.start(0),o.stop(e.currentTime+1e-4),window.liveAudioContexts.push(e),window.removeEventListener("touchstart",t)}var n=/(iPad|iPhone|iPod)/g.test(navigator.userAgent);if(n&&(window.liveAudioContexts||(window.liveAudioContexts=[]),window.liveAudioContexts.indexOf(e)<0)){var o=e.createOscillator(),r=e.createGain();r.gain.value=0,o.connect(r),r.connect(e.destination),window.addEventListener("touchstart",t)}}void 0===e||null===e?(console.log("Making a new AudioContext"),this.audioContext=new AudioContext):this.audioContext=e,t(this.audioContext),this.numberOfInputs=0,Object.defineProperty(this,"numberOfOutputs",{enumerable:!0,configurable:!1,get:function(){return this.releaseGainNode.numberOfOutputs}});var n=0;Object.defineProperty(this,"maxSources",{enumerable:!0,configurable:!1,set:function(e){0>e&&(e=0),n=Math.round(e)},get:function(){return n}});var o=0;Object.defineProperty(this,"minSources",{enumerable:!0,configurable:!1,set:function(e){0>e&&(e=0),o=Math.round(e)},get:function(){return o}}),this.releaseGainNode=this.audioContext.createGain(),this.isPlaying=!1,this.isInitialized=!1,this.inputNode=null,this.modelName="Model",this.onLoadProgress=null,this.onLoadComplete=null,this.onAudioStart=null,this.onAudioEnd=null,this.releaseGainNode.connect(this.audioContext.destination)}return t.prototype.registerParameter=function(e,t){(void 0===t||null===t)&&(t=!1),Object.defineProperty(this,e.name,{enumerable:!0,configurable:t,value:e})},t.prototype.connect=function(e,t,n){e instanceof AudioNode?this.releaseGainNode.connect(e,t,n):e.inputNode instanceof AudioNode?this.releaseGainNode.connect(e.inputNode,t,n):console.error("No Input Connection - Attempts to connect "+typeof t+" to "+typeof this)},t.prototype.disconnect=function(e){this.releaseGainNode.disconnect(e)},t.prototype.start=function(t,n,o,r){("undefined"==typeof t||t<this.audioContext.currentTime)&&(t=this.audioContext.currentTime),this.releaseGainNode.gain.cancelScheduledValues(t),"undefined"!=typeof r?(this.releaseGainNode.gain.setValueAtTime(0,t),this.releaseGainNode.gain.linearRampToValueAtTime(1,t+r)):this.releaseGainNode.gain.setValueAtTime(1,t);var a=this;e(function(){a.isPlaying=!0},t,this.audioContext)},t.prototype.stop=function(t){("undefined"==typeof t||t<this.audioContext.currentTime)&&(t=this.audioContext.currentTime);var n=this;e(function(){n.isPlaying=!1},t,this.audioContext),this.releaseGainNode.gain.cancelScheduledValues(t)},t.prototype.release=function(t,n,o){if(this.isPlaying){var r=.5,a=1/this.audioContext.sampleRate;if(("undefined"==typeof t||t<this.audioContext.currentTime)&&(t=this.audioContext.currentTime),n=n||r,this.releaseGainNode.gain.setValueAtTime(this.releaseGainNode.gain.value,t),this.releaseGainNode.gain.linearRampToValueAtTime(0,t+n),o)this.stop(t+r+a);else{var i=this;e(function(){i.pause()},t+n,this.audioContext)}}},t.prototype.setSources=function(e,t,n){this.isInitialized=!1,"function"==typeof t&&(this.onLoadProgress=t),"function"==typeof n&&(this.onLoadComplete=n)},t.prototype.play=function(){this.start(0)},t.prototype.pause=function(){this.isPlaying=!1},t.prototype.listParams=function(){var e=[];for(var t in this)if(this.hasOwnProperty(t)){var n=this[t];n&&n.hasOwnProperty("value")&&n.hasOwnProperty("minValue")&&n.hasOwnProperty("maxValue")&&e.push(n)}return e},t}),define("core/SPAudioParam",["core/WebAudioDispatch"],function(e){function t(t,n,o,r,a,i,u,s){var c,l=1e-4,f=500,d=0;if(this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="",Object.defineProperty(this,"value",{enumerable:!0,configurable:!1,set:function(e){return typeof e!=typeof r?void console.error("Attempt to set a "+typeof r+" parameter to a "+typeof e+" value"):("number"==typeof e&&(e>o?(console.warn(this.name+" clamping to max"),e=o):n>e&&(console.warn(this.name+" clamping to min"),e=n)),"function"==typeof i&&(e=i(e)),"function"==typeof u&&s?u(a,e,s):a?a instanceof AudioParam?a.value=e:a instanceof Array&&a.forEach(function(t){t.value=e}):window.clearInterval(c),void(d=e))},get:function(){return a?a instanceof AudioParam?a.value:a instanceof Array?a[0].value:d:d}}),a&&(a instanceof AudioParam||a instanceof Array)){var p=a[0]||a;this.defaultValue=p.defaultValue,this.minValue=p.minValue,this.maxValue=p.maxValue,this.value=p.defaultValue,this.name=p.name}t&&(this.name=t),"undefined"!=typeof r&&(this.defaultValue=r,this.value=r),"undefined"!=typeof n&&(this.minValue=n),"undefined"!=typeof o&&(this.maxValue=o),this.setValueAtTime=function(t,n){if("function"==typeof i&&(t=i(t)),a)a instanceof AudioParam?a.setValueAtTime(t,n):a instanceof Array&&a.forEach(function(e){e.setValueAtTime(t,n)});else{var o=this;e(function(){o.value=t},n,s)}},this.setTargetAtTime=function(e,t,n){if("function"==typeof i&&(e=i(e)),a)a instanceof AudioParam?a.setTargetAtTime(e,t,n):a instanceof Array&&a.forEach(function(o){o.setTargetAtTime(e,t,n)});else{var o=this,r=o.value,u=s.currentTime;c=window.setInterval(function(){s.currentTime>=t&&(o.value=e+(r-e)*Math.exp(-(s.currentTime-u)/n),Math.abs(o.value-e)<l&&window.clearInterval(c))},f)}},this.setValueCurveAtTime=function(e,t,n){if("function"==typeof i)for(var o=0;o<e.length;o++)e[o]=i(e[o]);if(a)a instanceof AudioParam?a.setValueCurveAtTime(e,t,n):a instanceof Array&&a.forEach(function(o){o.setValueCurveAtTime(e,t,n)});else{var r=this,u=s.currentTime;c=window.setInterval(function(){if(s.currentTime>=t){var o=Math.floor(e.length*(s.currentTime-u)/n);o<e.length?r.value=e[o]:window.clearInterval(c)}},f)}},this.exponentialRampToValueAtTime=function(e,t){if("function"==typeof i&&(e=i(e)),a)a instanceof AudioParam?a.exponentialRampToValueAtTime(e,t):a instanceof Array&&a.forEach(function(n){n.exponentialRampToValueAtTime(e,t)});else{var n=this,o=n.value,r=s.currentTime;0===o&&(o=.001),c=window.setInterval(function(){var a=(s.currentTime-r)/(t-r);n.value=o*Math.pow(e/o,a),s.currentTime>=t&&window.clearInterval(c)},f)}},this.linearRampToValueAtTime=function(e,t){if("function"==typeof i&&(e=i(e)),a)a instanceof AudioParam?a.linearRampToValueAtTime(e,t):a instanceof Array&&a.forEach(function(n){n.linearRampToValueAtTime(e,t)});else{var n=this,o=n.value,r=s.currentTime;c=window.setInterval(function(){var a=(s.currentTime-r)/(t-r);n.value=o+(e-o)*a,s.currentTime>=t&&window.clearInterval(c)},f)}},this.cancelScheduledValues=function(e){a?a instanceof AudioParam?a.cancelScheduledValues(e):a instanceof Array&&a.forEach(function(t){t.cancelScheduledValues(e)}):window.clearInterval(c)}}return t.createPsuedoParam=function(e,n,o,r,a){return new t(e,n,o,r,null,null,null,a)},t}),define("core/DetectLoopMarkers",[],function(){function e(e){var t=0,n=0,o=!0,r=5e3,a=44100,i=.5,u=2e4,s=.01,c=1024,l=16,f=[],d=0,p=function(e,t){for(var n=0,o=t+l;t+l+c>o;++o)n+=Math.abs(e[o]);return s>n/c},h=function(e){return function(t,n,o){var r;return r=o%2===0?n[e]>i:n[e]<-i,t&&r}},m=function(o){var i=null,s=null;t=0,n=d;for(var c=0;null===i&&d>c&&u>c;){if(o.reduce(h(c),!0)&&(1!==o.length||p(o[0],c))){i=c;break}c++}for(c=d;null===s&&c>0&&u>d-c;){if(o.reduce(h(c),!0)){s=c;break}c--}var l=Math.round(r/2*e.sampleRate/a);return null!==i&&null!==s&&s>i+l?(t=i+l,n=s-l,!0):!1},y=function(e){return function(t,n){return t&&Math.abs(n[e])<s}},v=function(e){var o=!0;for(t=0;u>t&&d>t&&(o=e.reduce(y(t),!0));)t++;for(n=d;u>d-n&&n>0&&(o=e.reduce(y(n),!0));)n--;t>n&&(t=0)};d=e.length;for(var A=0;A<e.numberOfChannels;A++)f.push(new Float32Array(e.getChannelData(A)));return m(f)||(v(f),o=!1),{marked:o,start:t,end:n}}return e}),define("core/FileLoader",["core/DetectLoopMarkers"],function(e){function t(n,o,r,a){function i(){var e=Object.prototype.toString.call(n),t=/[^.]+$/.exec(n);if("[object String]"===e){var o=new XMLHttpRequest;o.open("GET",n,!0),o.responseType="arraybuffer",o.addEventListener("progress",a,!1),o.onload=function(){u(o.response,t)},o.send()}else if("[object File]"===e||"[object Blob]"===e){var r=new FileReader;r.addEventListener("progress",a,!1),r.onload=function(){u(r.result,t)},r.readAsArrayBuffer(n)}}function u(t,a){o.decodeAudioData(t,function(t){if(f=!0,s=t,c=0,l=s.length,"wav"!==a[0]){var n=e(s);n&&(c=n.start,l=n.end)}r&&"function"==typeof r&&r(!0)},function(){console.warn("Error Decoding "+n),r&&"function"==typeof r&&r(!1)})}if(!(this instanceof t))throw new TypeError("FileLoader constructor cannot be called as a function.");var s,c=0,l=0,f=!1,d=function(e){var t=/^[0-9]+$/;return t.test(e)?!0:!1},p=function(e,t){"undefined"==typeof t&&(t=s.length),d(e)?d(t)||(console.warn("Incorrect parameter Type - FileLoader getBuffer end parameter is not an integer"),t=Number.isNan(t)?0:Math.round(Number(t))):(e=Number.isNan(e)?0:Math.round(Number(e)),console.warn("Incorrect parameter Type - FileLoader getBuffer start parameter is not an integer. Coercing it to an Integer - start")),e>t&&(console.error("Incorrect parameter Type - FileLoader getBuffer start parameter "+e+" should be smaller than end parameter "+t+" . Setting them to the same value "+e),t=e),(e>l||c>e)&&(console.error("Incorrect parameter Type - FileLoader getBuffer start parameter should be within the buffer size : 0-"+s.length+" . Setting start to "+c),e=c),(t>l||c>t)&&(console.error("Incorrect parameter Type - FileLoader getBuffer start parameter should be within the buffer size : 0-"+s.length+" . Setting start to "+l),t=l);var n=t-e;if(!s)return console.error("No Buffer Found - Buffer loading has not completed or has failed."),null;for(var r=o.createBuffer(s.numberOfChannels,n,s.sampleRate),a=0;a<s.numberOfChannels;a++){var i=new Float32Array(s.getChannelData(a));r.getChannelData(a).set(i.subarray(e,t))}return r};this.getBuffer=function(e,t){return"undefined"==typeof e&&(e=0),"undefined"==typeof t&&(t=l-c),p(c+e,c+t)},this.getRawBuffer=function(){return f?s:(console.error("No Buffer Found - Buffer loading has not completed or has failed."),null)},this.isLoaded=function(){return f},i()}return t}),define("core/MultiFileLoader",["core/FileLoader"],function(e){function t(t,n,o,r){function a(){var e=Object.prototype.toString.call(t);"[object Array]"===e?t.length>=s.minSources&&t.length<=s.maxSources?(c=t.length,l=new Array(c),t.forEach(function(e,t){i(e,u(t))})):(console.error("Unsupported number of Sources. "+s.modelName+" only supports a minimum of "+s.minSources+" and a maximum of "+s.maxSources+" sources. Trying to load "+t.length+"."),r(!1,l)):t?(c=1,l=new Array(c),i(t,u(0))):(console.log("Setting empty source. No sound may be heard"),r(!1,l))}function i(t,n){var r=Object.prototype.toString.call(t);if("[object String]"===r||"[object File]"===r)var a=new e(t,s.audioContext,function(e){e?n(e,a.getBuffer()):n(e)},function(e){o&&"function"==typeof o&&o(e,t)});else"[object AudioBuffer]"===r?n(!0,t):(console.error("Incorrect Parameter Type - Source is not a URL, File or AudioBuffer"),n(!1,{}))}function u(e){return function(t,n){if(t&&(l[e]=n),c--,0===c){for(var o=!0,a=0;a<l.length;++a)if(!l[a]){o=!1;break}r(o,l)}}}var s=this;this.audioContext=n;var c=0,l=[];a()}return t}),define("models/Scrubber",["core/Config","core/BaseSound","core/SPAudioParam","core/MultiFileLoader"],function(e,t,n,o){function r(a,i,u,s,c,l){function f(t){x&&(x.disconnect(),x=null),o.call(b,t,b.audioContext,b.onLoadProgress,F),h=e.WINDOW_LENGTH,m=h/2,N=0,A=p(h,1);for(var n=0;h>n;n++)A[n]=.25*(1-Math.cos(2*Math.PI*(n+.5)/h));T=new Float32Array(e.CHUNK_LENGTH)}function d(e){if(!b.isPlaying||!b.isInitialized){for(n=0;C>n;n++)e.outputBuffer.getChannelData(n).set(T);return V=0,k=0,void(I&&("function"==typeof b.onAudioEnd&&b.onAudioEnd(),I=!1))}for(var t,n,o=e.outputBuffer.length;o>0;){if(N>0&&o>0){var r=Math.min(o,N);for(n=0;C>n;n++){var a=y[n].subarray(m-N,m-N+r);e.outputBuffer.getChannelData(n).set(a,e.outputBuffer.length-o)}o-=r,N-=r}if(o>0){var i,u=b.playPosition.value;if(Math.abs(O-u)*g>L*w)S=u,i=0;else{var s=E*S+(1-E)*u;i=(s-S)*g/m,S=s}for(O=u,t=0;h-m>t;t++)for(n=0;C>n;n++)y[n][t]=y[n][t+m];for(t=h-m;h>t;t++)for(n=0;C>n;n++)y[n][t]=0;for(t=0;h-m>t;t++)for(n=0;C>n;n++)v[n][t]=v[n][t+m];var c=0,l=0;for(t=0;h-m>t;t++){var f=0;for(n=0;C>n;n++)f+=v[n][t];f>l&&(c=t,l=f)}var d=parseInt(S*(g-h)),p=0,x=0;for(t=0;h>t;t++){var F=0,D=(d+t)%g;for(n=0;C>n;n++)F+=P[n][D];F>x&&(x=F,p=t)}var R=p-c;for(d+=R,t=0;h>t;t++){var _=(d+t)%g;for(0>_&&(_=0),n=0;C>n;n++)v[n][t]=P[n][_]}var j=b.noMotionFade.value,k=1;j&&Math.abs(i)<G&&(k=0),V=B*V+(1-B)*k;var H=b.muteOnReverse.value;for(0>i&&H&&(V=0),I&&(H&&M>V||Math.abs(V)<M)&&(I=!1,"function"==typeof b.onAudioEnd&&b.onAudioEnd()),V>M&&!I&&(I=!0,"function"==typeof b.onAudioStart&&b.onAudioStart()),t=0;h>t;t++)for(n=0;C>n;n++)y[n][t]+=V*A[t]*v[n][t];N=m}}}function p(e,t){var n=[];(void 0===t||null===t)&&(t=1);for(var o=0;t>o;o++)n.push(new Float32Array(e));return n}if(!(this instanceof r))throw new TypeError("Scrubber constructor cannot be called as a function.");t.call(this,a),this.maxSources=1,this.minSources=1,this.modelName="Scrubber",this.onLoadProgress=u,this.onLoadComplete=s,this.onAudioStart=c,this.onAudioEnd=l;var h,m,y,v,A,g,C,w,x,T,b=this,P=[],N=0,O=0,S=0,V=0,L=1,E=.95,G=.05,B=.8,M=1e-4,I=!1,F=function(t,n){if(t){var o=n[0];g=o.length,C=o.numberOfChannels,w=o.sampleRate,P=[];for(var r=0;C>r;r++)P.push(o.getChannelData(r));x=b.audioContext.createScriptProcessor(e.CHUNK_LENGTH,0,C),x.onaudioprocess=d,x.connect(b.releaseGainNode),y=p(h,C),v=p(h,C),b.isInitialized=!0}"function"==typeof b.onLoadComplete&&b.onLoadComplete(t,n)};this.setSources=function(e,n,o){t.prototype.setSources.call(this,e,n,o),f(e)},this.registerParameter(n.createPsuedoParam("playPosition",0,1,0,this.audioContext)),this.registerParameter(n.createPsuedoParam("noMotionFade",!0,!1,!0,this.audioContext)),this.registerParameter(n.createPsuedoParam("muteOnReverse",!0,!1,!0,this.audioContext)),window.setTimeout(function(){f(i)},0)}return r.prototype=Object.create(t.prototype),r});