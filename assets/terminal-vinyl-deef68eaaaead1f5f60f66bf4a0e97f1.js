"use strict"
define("terminal-vinyl/app",["exports","terminal-vinyl/resolver","ember-load-initializers","terminal-vinyl/config/environment"],function(e,t,n,i){Object.defineProperty(e,"__esModule",{value:!0})
var a=Ember.Application.extend({modulePrefix:i.default.modulePrefix,podModulePrefix:i.default.podModulePrefix,Resolver:t.default});(0,n.default)(a,i.default.modulePrefix),e.default=a}),define("terminal-vinyl/components/demo-one",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0})
e.default=Ember.Component.extend({classNames:["demo-one"],attributeBindings:["tabindex"],maxNumberOfTonesCreated:Ember.computed.gte("numOfTones",4),noTones:Ember.computed.equal("tones.length",0),numOfTones:Ember.computed.reads("tones.length"),init:function(){this._super.apply(this,arguments),this.set("audioCtx",new(window.AudioContext||window.webkitAudioContext)),this.set("gainNode",this.get("audioCtx").createGain()),this.get("gainNode").gain.setValueAtTime(.2,this.get("audioCtx").currentTime),this.set("tones",[])},didInsertElement:function(){this._super.apply(this,arguments),this._loadMyMic(),this.element.focus()},_loadBg:function(){var e=this.get("audioCtx"),t=this.get("gainNode");[340,510].forEach(function(n){var i=e.createOscillator()
i.type="triangle",i.frequency.setValueAtTime(n,e.currentTime),i.detune.setValueAtTime(100,e.currentTime),i.connect(t),t.connect(e.destination),i.start()})},_loadMyMic:function(){var e=this.get("audioCtx"),t=e.createAnalyser(),n=e.createWaveShaper(),i=e.createGain(),a=e.createBiquadFilter()
function r(e){n.oversample="24x"
var t=e
if("distortion"==t)n.curve=function(e){for(var t,n="number"==typeof e?e:50,i=new Float32Array(44100),a=Math.PI/180,r=0;r<44100;++r)t=2*r/44100-1,i[r]=(3+n)*t*20*a/(Math.PI+n*Math.abs(t))
return i}(4200)
else if("biquad"==t)a.type="lowshelf",a.frequency.value=1e3,a.gain.value=25
else if("off"==t)return}navigator.mediaDevices.getUserMedia({audio:!0}).then(function(o){e.createMediaStreamSource(o).connect(t),t.connect(n),n.connect(a),a.connect(i),i.connect(e.destination),r("distortion")}).catch(function(e){console.log("The following gUM error occured: "+e)})},_loadTrack:function(){if(this.get("noTones")||!this.get("maxNumberOfTonesCreated")){var e=this.get("numOfTones")+1,t=this.get("audioCtx"),n=this.get("gainNode"),i=t.createOscillator()
i.type="triangle",i.frequency.setValueAtTime(2*e*85,t.currentTime),i.detune.setValueAtTime(100,t.currentTime),i.connect(n),n.connect(t.destination),i.start(),this.get("tones").pushObject(i)}else console.log({len:this.get("tones.length")}),console.log("max number of tones")},createTone:function(e){var t=this.get("audioCtx"),n=this.get("gainNode"),i=t.createOscillator()
i.type="sawtooth",i.frequency.setValueAtTime(e,t.currentTime),i.detune.setValueAtTime(100,t.currentTime),i.connect(n),n.connect(t.destination),i.start(),this.set("tone",i)},createCustomTone:function(e){var t=new Float32Array([0,0,0,0,0,1]),n=new Float32Array([1,1,.5,2,1,-1]),i=this.get("audioCtx"),a=this.get("gainNode"),r=i.createOscillator(),o=i.createPeriodicWave(t,n)
r.setPeriodicWave(o),r.frequency.setValueAtTime(e,i.currentTime),r.connect(a),a.connect(i.destination),r.start(),this.set("tone",r)},keyUp:function(e){var t=this.get("tone")
t&&t.stop(),this.set("tone",null)},keyDown:function(e){if(this.get("tone"));else{var t=e.keyCode?110*e.keyCode/50:240
this.createTone(t)}}})}),define("terminal-vinyl/helpers/app-version",["exports","terminal-vinyl/config/environment","ember-cli-app-version/utils/regexp"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.appVersion=a
var i=t.default.APP.version
function a(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}
return t.hideSha?i.match(n.versionRegExp)[0]:t.hideVersion?i.match(n.shaRegExp)[0]:i}e.default=Ember.Helper.helper(a)}),define("terminal-vinyl/helpers/pluralize",["exports","ember-inflector/lib/helpers/pluralize"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("terminal-vinyl/helpers/singularize",["exports","ember-inflector/lib/helpers/singularize"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("terminal-vinyl/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","terminal-vinyl/config/environment"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0})
var i=void 0,a=void 0
n.default.APP&&(i=n.default.APP.name,a=n.default.APP.version),e.default={name:"App Version",initialize:(0,t.default)(i,a)}}),define("terminal-vinyl/initializers/container-debug-adapter",["exports","ember-resolver/resolvers/classic/container-debug-adapter"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"container-debug-adapter",initialize:function(){var e=arguments[1]||arguments[0]
e.register("container-debug-adapter:main",t.default),e.inject("container-debug-adapter:main","namespace","application:main")}}}),define("terminal-vinyl/initializers/ember-data",["exports","ember-data/setup-container","ember-data"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"ember-data",initialize:t.default}}),define("terminal-vinyl/initializers/export-application-global",["exports","terminal-vinyl/config/environment"],function(e,t){function n(){var e=arguments[1]||arguments[0]
if(!1!==t.default.exportApplicationGlobal){var n
if("undefined"!=typeof window)n=window
else if("undefined"!=typeof global)n=global
else{if("undefined"==typeof self)return
n=self}var i,a=t.default.exportApplicationGlobal
i="string"==typeof a?a:Ember.String.classify(t.default.modulePrefix),n[i]||(n[i]=e,e.reopen({willDestroy:function(){this._super.apply(this,arguments),delete n[i]}}))}}Object.defineProperty(e,"__esModule",{value:!0}),e.initialize=n,e.default={name:"export-application-global",initialize:n}}),define("terminal-vinyl/instance-initializers/ember-data",["exports","ember-data/initialize-store-service"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"ember-data",initialize:t.default}}),define("terminal-vinyl/resolver",["exports","ember-resolver"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("terminal-vinyl/router",["exports","terminal-vinyl/config/environment"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0})
var n=Ember.Router.extend({location:t.default.locationType,rootURL:t.default.rootURL})
n.map(function(){}),e.default=n}),define("terminal-vinyl/services/ajax",["exports","ember-ajax/services/ajax"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("terminal-vinyl/templates/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"G/py4gDV",block:'{"symbols":[],"statements":[[1,[18,"welcome-page"],false],[0,"\\n"],[1,[25,"demo-one",null,[["tabindex"],["0"]]],false],[0,"\\n"],[1,[18,"outlet"],false],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"terminal-vinyl/templates/application.hbs"}})}),define("terminal-vinyl/templates/components/demo-one",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"yl1L2E4S",block:'{"symbols":["&default"],"statements":[[11,1]],"hasEval":false}',meta:{moduleName:"terminal-vinyl/templates/components/demo-one.hbs"}})}),define("terminal-vinyl/config/environment",[],function(){try{var e="terminal-vinyl/config/environment",t=document.querySelector('meta[name="'+e+'"]').getAttribute("content"),n={default:JSON.parse(unescape(t))}
return Object.defineProperty(n,"__esModule",{value:!0}),n}catch(t){throw new Error('Could not read config from meta tag with name "'+e+'".')}}),runningTests||require("terminal-vinyl/app").default.create({name:"terminal-vinyl",version:"0.0.0+40e91ca8"})
