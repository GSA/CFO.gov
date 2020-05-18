/**
 * 
 * Copyright 2007
 * 
 * Paulius Uza
 * http://www.uza.lt
 * 
 * Dan Florio
 * http://www.polygeek.com
 * 
 * Project website:
 * http://code.google.com/p/custom-context-menu/
 * 
 * --
 * RightClick for Flash Player. 
 * Version 0.6.2
 * 
 */

var RightClick = {
	/**
	 *  Constructor
	 */ 
	init: function () { 
		this.FlashObjectID = "Captivate";
		this.FlashContainerID = "CaptivateContent";
		this.Cache = this.FlashObjectID;
		if(window.addEventListener){
			 window.addEventListener("mousedown", this.onGeckoMouse(), true);
		} else {
			document.getElementById(this.FlashContainerID).onmouseup = function() { document.getElementById(RightClick.FlashContainerID).releaseCapture(); }
			document.oncontextmenu = function(){ if(window.event.srcElement.id == RightClick.FlashObjectID) { return false; } else { RightClick.Cache = "nan"; }}
			document.getElementById(this.FlashContainerID).onmousedown = RightClick.onIEMouse;
		}
	},
	/**
	 * GECKO / WEBKIT event overkill
	 * @param {Object} eventObject
	 */
	killEvents: function(eventObject) {
		if(eventObject) {
			if (eventObject.stopPropagation) eventObject.stopPropagation();
			if (eventObject.preventDefault) eventObject.preventDefault();
			if (eventObject.preventCapture) eventObject.preventCapture();
	   		if (eventObject.preventBubble) eventObject.preventBubble();
		}
	},
	/**
	 * GECKO / WEBKIT call right click
	 * @param {Object} ev
	 */
	onGeckoMouse: function(ev) {
	  	return function(ev) {
	    if (ev.button == 2) {
			RightClick.killEvents(ev);
			if(ev.target.id == RightClick.FlashObjectID && RightClick.Cache == RightClick.FlashObjectID) {
	    		RightClick.call();
			}
			RightClick.Cache = ev.target.id;
		}
	  }
	},
	/**
	 * IE call right click
	 * @param {Object} ev
	 */
	onIEMouse: function() {
	  	if (event.button == 2) {
			if(window.event.srcElement.id == RightClick.FlashObjectID && RightClick.Cache == RightClick.FlashObjectID) {
				RightClick.call(); 
			}
			document.getElementById(RightClick.FlashContainerID).setCapture();
			if(window.event.srcElement.id)
			RightClick.Cache = window.event.srcElement.id;
		}
	},
	/**
	 * Main call to Flash External Interface
	 */
	call: function() {
		document.getElementById(this.FlashObjectID).rightClick();
	}
}

/**
 * SWFObject v1.5: Flash Player detection and embed - http://blog.deconcept.com/swfobject/
 *
 * SWFObject is (c) 2007 Geoff Stearns and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

/*!    SWFObject v2.3.20130521 <http://github.com/swfobject/swfobject>
 *     is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 *     */
var swfobject=function(){var D="undefined",r="object",T="Shockwave Flash",Z="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",S="SWFObjectExprInst",x="onreadystatechange",Q=window,h=document,t=navigator,V=false,X=[],o=[],P=[],K=[],I,p,E,B,L=false,a=false,m,G,j=true,l=false,O=function(){var ad=typeof h.getElementById!=D&&typeof h.getElementsByTagName!=D&&typeof h.createElement!=D,ak=t.userAgent.toLowerCase(),ab=t.platform.toLowerCase(),ah=ab?/win/.test(ab):/win/.test(ak),af=ab?/mac/.test(ab):/mac/.test(ak),ai=/webkit/.test(ak)?parseFloat(ak.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,aa=t.appName==="Microsoft Internet Explorer",aj=[0,0,0],ae=null;if(typeof t.plugins!=D&&typeof t.plugins[T]==r){ae=t.plugins[T].description;if(ae&&(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&t.mimeTypes[q].enabledPlugin)){V=true;aa=false;ae=ae.replace(/^.*\s+(\S+\s+\S+$)/,"$1");aj[0]=n(ae.replace(/^(.*)\..*$/,"$1"));aj[1]=n(ae.replace(/^.*\.(.*)\s.*$/,"$1"));aj[2]=/[a-zA-Z]/.test(ae)?n(ae.replace(/^.*[a-zA-Z]+(.*)$/,"$1")):0}}else{if(typeof Q.ActiveXObject!=D){try{var ag=new ActiveXObject(Z);if(ag){ae=ag.GetVariable("$version");if(ae){aa=true;ae=ae.split(" ")[1].split(",");aj=[n(ae[0]),n(ae[1]),n(ae[2])]}}}catch(ac){}}}return{w3:ad,pv:aj,wk:ai,ie:aa,win:ah,mac:af}}(),i=function(){if(!O.w3){return}if((typeof h.readyState!=D&&(h.readyState==="complete"||h.readyState==="interactive"))||(typeof h.readyState==D&&(h.getElementsByTagName("body")[0]||h.body))){f()}if(!L){if(typeof h.addEventListener!=D){h.addEventListener("DOMContentLoaded",f,false)}if(O.ie){h.attachEvent(x,function aa(){if(h.readyState=="complete"){h.detachEvent(x,aa);f()}});if(Q==top){(function ac(){if(L){return}try{h.documentElement.doScroll("left")}catch(ad){setTimeout(ac,0);return}f()}())}}if(O.wk){(function ab(){if(L){return}if(!/loaded|complete/.test(h.readyState)){setTimeout(ab,0);return}f()}())}}}();function f(){if(L||!document.getElementsByTagName("body")[0]){return}try{var ac,ad=C("span");ad.style.display="none";ac=h.getElementsByTagName("body")[0].appendChild(ad);ac.parentNode.removeChild(ac);ac=null;ad=null}catch(ae){return}L=true;var aa=X.length;for(var ab=0;ab<aa;ab++){X[ab]()}}function M(aa){if(L){aa()}else{X[X.length]=aa}}function s(ab){if(typeof Q.addEventListener!=D){Q.addEventListener("load",ab,false)}else{if(typeof h.addEventListener!=D){h.addEventListener("load",ab,false)}else{if(typeof Q.attachEvent!=D){g(Q,"onload",ab)}else{if(typeof Q.onload=="function"){var aa=Q.onload;Q.onload=function(){aa();ab()}}else{Q.onload=ab}}}}}function Y(){var aa=h.getElementsByTagName("body")[0];var ae=C(r);ae.setAttribute("style","visibility: hidden;");ae.setAttribute("type",q);var ad=aa.appendChild(ae);if(ad){var ac=0;(function ab(){if(typeof ad.GetVariable!=D){try{var ag=ad.GetVariable("$version");if(ag){ag=ag.split(" ")[1].split(",");O.pv=[n(ag[0]),n(ag[1]),n(ag[2])]}}catch(af){O.pv=[8,0,0]}}else{if(ac<10){ac++;setTimeout(ab,10);return}}aa.removeChild(ae);ad=null;H()}())}else{H()}}function H(){var aj=o.length;if(aj>0){for(var ai=0;ai<aj;ai++){var ab=o[ai].id;var ae=o[ai].callbackFn;var ad={success:false,id:ab};if(O.pv[0]>0){var ah=c(ab);if(ah){if(F(o[ai].swfVersion)&&!(O.wk&&O.wk<312)){w(ab,true);if(ae){ad.success=true;ad.ref=z(ab);ad.id=ab;ae(ad)}}else{if(o[ai].expressInstall&&A()){var al={};al.data=o[ai].expressInstall;al.width=ah.getAttribute("width")||"0";al.height=ah.getAttribute("height")||"0";if(ah.getAttribute("class")){al.styleclass=ah.getAttribute("class")}if(ah.getAttribute("align")){al.align=ah.getAttribute("align")}var ak={};var aa=ah.getElementsByTagName("param");var af=aa.length;for(var ag=0;ag<af;ag++){if(aa[ag].getAttribute("name").toLowerCase()!="movie"){ak[aa[ag].getAttribute("name")]=aa[ag].getAttribute("value")}}R(al,ak,ab,ae)}else{b(ah);if(ae){ae(ad)}}}}}else{w(ab,true);if(ae){var ac=z(ab);if(ac&&typeof ac.SetVariable!=D){ad.success=true;ad.ref=ac;ad.id=ac.id}ae(ad)}}}}}X[0]=function(){if(V){Y()}else{H()}};function z(ac){var aa=null,ab=c(ac);if(ab&&ab.nodeName.toUpperCase()==="OBJECT"){if(typeof ab.SetVariable!==D){aa=ab}else{aa=ab.getElementsByTagName(r)[0]||ab}}return aa}function A(){return !a&&F("6.0.65")&&(O.win||O.mac)&&!(O.wk&&O.wk<312)}function R(ad,ae,aa,ac){var ah=c(aa);aa=W(aa);a=true;E=ac||null;B={success:false,id:aa};if(ah){if(ah.nodeName.toUpperCase()=="OBJECT"){I=J(ah);p=null}else{I=ah;p=aa}ad.id=S;if(typeof ad.width==D||(!/%$/.test(ad.width)&&n(ad.width)<310)){ad.width="310"}if(typeof ad.height==D||(!/%$/.test(ad.height)&&n(ad.height)<137)){ad.height="137"}var ag=O.ie?"ActiveX":"PlugIn",af="MMredirectURL="+encodeURIComponent(Q.location.toString().replace(/&/g,"%26"))+"&MMplayerType="+ag+"&MMdoctitle="+encodeURIComponent(h.title.slice(0,47)+" - Flash Player Installation");if(typeof ae.flashvars!=D){ae.flashvars+="&"+af}else{ae.flashvars=af}if(O.ie&&ah.readyState!=4){var ab=C("div");
aa+="SWFObjectNew";ab.setAttribute("id",aa);ah.parentNode.insertBefore(ab,ah);ah.style.display="none";y(ah)}u(ad,ae,aa)}}function b(ab){if(O.ie&&ab.readyState!=4){ab.style.display="none";var aa=C("div");ab.parentNode.insertBefore(aa,ab);aa.parentNode.replaceChild(J(ab),aa);y(ab)}else{ab.parentNode.replaceChild(J(ab),ab)}}function J(af){var ae=C("div");if(O.win&&O.ie){ae.innerHTML=af.innerHTML}else{var ab=af.getElementsByTagName(r)[0];if(ab){var ag=ab.childNodes;if(ag){var aa=ag.length;for(var ad=0;ad<aa;ad++){if(!(ag[ad].nodeType==1&&ag[ad].nodeName=="PARAM")&&!(ag[ad].nodeType==8)){ae.appendChild(ag[ad].cloneNode(true))}}}}}return ae}function k(aa,ab){var ac=C("div");ac.innerHTML="<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'><param name='movie' value='"+aa+"'>"+ab+"</object>";return ac.firstChild}function u(ai,ag,ab){var aa,ad=c(ab);ab=W(ab);if(O.wk&&O.wk<312){return aa}if(ad){var ac=(O.ie)?C("div"):C(r),af,ah,ae;if(typeof ai.id==D){ai.id=ab}for(ae in ag){if(ag.hasOwnProperty(ae)&&ae.toLowerCase()!=="movie"){e(ac,ae,ag[ae])}}if(O.ie){ac=k(ai.data,ac.innerHTML)}for(af in ai){if(ai.hasOwnProperty(af)){ah=af.toLowerCase();if(ah==="styleclass"){ac.setAttribute("class",ai[af])}else{if(ah!=="classid"&&ah!=="data"){ac.setAttribute(af,ai[af])}}}}if(O.ie){P[P.length]=ai.id}else{ac.setAttribute("type",q);ac.setAttribute("data",ai.data)}ad.parentNode.replaceChild(ac,ad);aa=ac}return aa}function e(ac,aa,ab){var ad=C("param");ad.setAttribute("name",aa);ad.setAttribute("value",ab);ac.appendChild(ad)}function y(ac){var ab=c(ac);if(ab&&ab.nodeName.toUpperCase()=="OBJECT"){if(O.ie){ab.style.display="none";(function aa(){if(ab.readyState==4){for(var ad in ab){if(typeof ab[ad]=="function"){ab[ad]=null}}ab.parentNode.removeChild(ab)}else{setTimeout(aa,10)}}())}else{ab.parentNode.removeChild(ab)}}}function U(aa){return(aa&&aa.nodeType&&aa.nodeType===1)}function W(aa){return(U(aa))?aa.id:aa}function c(ac){if(U(ac)){return ac}var aa=null;try{aa=h.getElementById(ac)}catch(ab){}return aa}function C(aa){return h.createElement(aa)}function n(aa){return parseInt(aa,10)}function g(ac,aa,ab){ac.attachEvent(aa,ab);K[K.length]=[ac,aa,ab]}function F(ac){ac+="";var ab=O.pv,aa=ac.split(".");aa[0]=n(aa[0]);aa[1]=n(aa[1])||0;aa[2]=n(aa[2])||0;return(ab[0]>aa[0]||(ab[0]==aa[0]&&ab[1]>aa[1])||(ab[0]==aa[0]&&ab[1]==aa[1]&&ab[2]>=aa[2]))?true:false}function v(af,ab,ag,ae){var ad=h.getElementsByTagName("head")[0];if(!ad){return}var aa=(typeof ag=="string")?ag:"screen";if(ae){m=null;G=null}if(!m||G!=aa){var ac=C("style");ac.setAttribute("type","text/css");ac.setAttribute("media",aa);m=ad.appendChild(ac);if(O.ie&&typeof h.styleSheets!=D&&h.styleSheets.length>0){m=h.styleSheets[h.styleSheets.length-1]}G=aa}if(m){if(typeof m.addRule!=D){m.addRule(af,ab)}else{if(typeof h.createTextNode!=D){m.appendChild(h.createTextNode(af+" {"+ab+"}"))}}}}function w(ad,aa){if(!j){return}var ab=aa?"visible":"hidden",ac=c(ad);if(L&&ac){ac.style.visibility=ab}else{if(typeof ad==="string"){v("#"+ad,"visibility:"+ab)}}}function N(ab){var ac=/[\\\"<>\.;]/;var aa=ac.exec(ab)!=null;return aa&&typeof encodeURIComponent!=D?encodeURIComponent(ab):ab}var d=function(){if(O.ie){window.attachEvent("onunload",function(){var af=K.length;for(var ae=0;ae<af;ae++){K[ae][0].detachEvent(K[ae][1],K[ae][2])}var ac=P.length;for(var ad=0;ad<ac;ad++){y(P[ad])}for(var ab in O){O[ab]=null}O=null;for(var aa in swfobject){swfobject[aa]=null}swfobject=null})}}();return{registerObject:function(ae,aa,ad,ac){if(O.w3&&ae&&aa){var ab={};ab.id=ae;ab.swfVersion=aa;ab.expressInstall=ad;ab.callbackFn=ac;o[o.length]=ab;w(ae,false)}else{if(ac){ac({success:false,id:ae})}}},getObjectById:function(aa){if(O.w3){return z(aa)}},embedSWF:function(af,al,ai,ak,ab,ae,ad,ah,aj,ag){var ac=W(al),aa={success:false,id:ac};if(O.w3&&!(O.wk&&O.wk<312)&&af&&al&&ai&&ak&&ab){w(ac,false);M(function(){ai+="";ak+="";var an={};if(aj&&typeof aj===r){for(var aq in aj){an[aq]=aj[aq]}}an.data=af;an.width=ai;an.height=ak;var ar={};if(ah&&typeof ah===r){for(var ao in ah){ar[ao]=ah[ao]}}if(ad&&typeof ad===r){for(var am in ad){if(ad.hasOwnProperty(am)){var ap=(l)?encodeURIComponent(am):am,at=(l)?encodeURIComponent(ad[am]):ad[am];if(typeof ar.flashvars!=D){ar.flashvars+="&"+ap+"="+at}else{ar.flashvars=ap+"="+at}}}}if(F(ab)){var au=u(an,ar,al);if(an.id==ac){w(ac,true)}aa.success=true;aa.ref=au;aa.id=au.id}else{if(ae&&A()){an.data=ae;R(an,ar,al,ag);return}else{w(ac,true)}}if(ag){ag(aa)}})}else{if(ag){ag(aa)}}},switchOffAutoHideShow:function(){j=false},enableUriEncoding:function(aa){l=(typeof aa===D)?true:aa},ua:O,getFlashPlayerVersion:function(){return{major:O.pv[0],minor:O.pv[1],release:O.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(ac,ab,aa){if(O.w3){return u(ac,ab,aa)}else{return undefined}},showExpressInstall:function(ac,ad,aa,ab){if(O.w3&&A()){R(ac,ad,aa,ab)}},removeSWF:function(aa){if(O.w3){y(aa)}},createCSS:function(ad,ac,ab,aa){if(O.w3){v(ad,ac,ab,aa)}},addDomLoadEvent:M,addLoadEvent:s,getQueryParamValue:function(ad){var ac=h.location.search||h.location.hash;
if(ac){if(/\?/.test(ac)){ac=ac.split("?")[1]}if(ad==null){return N(ac)}var ab=ac.split("&");for(var aa=0;aa<ab.length;aa++){if(ab[aa].substring(0,ab[aa].indexOf("="))==ad){return N(ab[aa].substring((ab[aa].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var aa=c(S);if(aa&&I){aa.parentNode.replaceChild(I,aa);if(p){w(p,true);if(O.ie){I.style.display="block"}}if(E){E(B)}}a=false}},version:"2.3"}}();



//Copyright 2006 Adobe Systems, Inc. All rights reserved.
//
//This is the base class for implementing an Active Content extension -- a piece of code that knows how to rewrite OBJECT tags so that they comply to the Eolas patent without making the browser display the "Press OK to continue loading the content of this page" message box.
//
// When the user hovers the mouse over an ActiveX control in Internet Explorer 6 updated with (April 2006) Cumulative Security Update (912812) or Internet Explorer 7, the following message is displayed:
// “Press Spacebar or Enter to activate and use this control.”
// The user can now click the mouse anywhere inside the ActiveX control area, or press the Spacebar or Enter key to activate the control.
// The standard.js file has been introduced to retain the earlier behavior where the control remains interactive from the first click to the last.

function writeDocument(s){document.write(s);}

//These two variables should be present on the window object so that this interface is available for Execute JS workflow also.
window.cpAPIInterface = undefined;
window.cpAPIEventEmitter = undefined;

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function emitEvent(iEvent)
{
    if(!cpAPIInterface)
    {
    	cpAPIInterface = new CPAPIInterfaceClass();
    	if(!cpAPIEventEmitter)
    		cpAPIEventEmitter = cpAPIInterface.getEventEmitter();

    	if(iEvent.Name == "moduleReadyEvent" && 
    		document.createEvent)
		{
			var evt = document.createEvent("Events");
			evt.initEvent(iEvent.Name, true, true, null );

			var lEventHandlerWin = window.parent;
			evt.Data = cpAPIInterface;
			
			if(strURLParams && strURLParams.length > 0)
			{			
				var lParamPairs = strURLParams.split("&");
				for(var i = 0; i < lParamPairs.length; ++i)
				{
					var lParamPair = lParamPairs[i];
					if(lParamPair.length > 0)
					{
						var lParamPairArr = lParamPair.split("=");
						cpAPIInterface.setVariableValue(lParamPairArr[0],lParamPairArr[1]);
					}
				}
			}
			
			if(lEventHandlerWin)
				lEventHandlerWin.dispatchEvent(evt);
		}
    }    
    
    cpAPIEventEmitter.trigger(iEvent);
}

var EventEmitterClass = function()
{
	this.callbackFns = {};
}

EventEmitterClass.prototype.getGenericEventName = function(eventName)
{
	var leftRegExp = new RegExp("^CP");
	var rightRegExp = new RegExp("EVENT$");

	eventName = eventName.toUpperCase();
	
	eventName = eventName.replace(leftRegExp,"");
	eventName = eventName.replace(rightRegExp,"");

	return eventName;
}

EventEmitterClass.prototype.getCPEventName = function(eventName)
{
	var leftRegExp = new RegExp("^CPAPI_");
	
	eventName = eventName.replace(leftRegExp,"CP");
	
	eventName += "EVENT";

	return eventName.toUpperCase();
}

EventEmitterClass.prototype.addEventListener = function(eventName,fn,varName)
{
	var key = eventName;
	if(eventName == undefined)
	{
		eventName = "Default";	
	}
	else
		eventName = this.getCPEventName(eventName);
	
	var lCallbacks = [];
	if(key == "CPAPI_VARIABLEVALUECHANGED")
	{
		document.Captivate.cpEIJSAddEventListener(eventName,varName);
		if(this.callbackFns[key] == undefined)
			this.callbackFns[key] = new Object();
		if(this.callbackFns[key][varName] == undefined)
			this.callbackFns[key][varName] = new Array();

		lCallbacks = this.callbackFns[key][varName];
	}
	else
	{
		document.Captivate.cpEIJSAddEventListener(eventName);
		if(this.callbackFns[key] == undefined)
			this.callbackFns[key] = new Array();

		lCallbacks = this.callbackFns[key];
	}

	var index = lCallbacks.indexOf(fn);
	if( index < 0)
		lCallbacks.push(fn);
}

EventEmitterClass.prototype.removeEventListener = function(eventName,fn,varName)
{
	var key = eventName;
	if(eventName == undefined)
	{
		eventName = "Default";	
	}
	else
		eventName = this.getCPEventName(eventName);

	var lCallbacks = [];
	if(key == "CPAPI_VARIABLEVALUECHANGED")
	{
		document.Captivate.cpEIJSRemoveEventListener(eventName,varName);
		if(this.callbackFns[key] == undefined)
			return;
		if(this.callbackFns[key][varName] == undefined)
			return;
		lCallbacks = this.callbackFns[key][varName];
	}
	else
	{
		document.Captivate.cpEIJSRemoveEventListener(eventName);	
		if(this.callbackFns[key] == undefined)
			return;
		lCallbacks = this.callbackFns[key];
	}
	
	var index = lCallbacks.indexOf(fn);
	if( index > -1){
		lCallbacks.splice(index, 1);
	}
}

EventEmitterClass.prototype.trigger = function(event)
{	
	var lEvent = Object(event);
	lEvent.Name = "CPAPI_" + this.getGenericEventName(lEvent.Name);
	var lCallbacks = this.callbackFns[lEvent.Name.toUpperCase()];
	if(lEvent.Name == "CPAPI_VARIABLEVALUECHANGED")
	{
		if(!lCallbacks)
			return;
		var lVarName = lEvent.Data.varName;
		lCallbacks = lCallbacks[lVarName];
	}
	
	if(!lCallbacks)
		return;
	for (var i = 0; i < lCallbacks.length; i++) {
		lCallbacks[i](lEvent);
	}
}

var CPAPIInterfaceClass = function()
{
	this.m_eventEmitter = undefined;
	this.objCP = document.Captivate;
}

CPAPIInterfaceClass.prototype = 
{
	play : function()
	{
	    this.setVariableValue("cpCmndResume", 1);
	},
	pause : function()
	{
	    this.setVariableValue("cpCmndPause", 1);
	},
	rewind : function()
	{
	    this.setVariableValue("rdcmndRewindAndPlay", true);
	},
	next : function()
	{
	    this.setVariableValue("cpCmndNext", true);
	},
	previous :function()
	{
	    this.setVariableValue("cpCmndPrevious", true);
	},
	fastFoward :function()
	{
	    this.setVariableValue("cpCmndFastForward", true);
	},
	getPlaySpeed : function()
	{
	    return this.getVariableValue("cpInfoFPS");
	},
	getDurationInFrames : function()
	{
	    return this.getVariableValue("cpInfoFrameCount");
	},
	getDurationInSeconds : function()
	{	
		return this.getDurationInFrames() / this.getPlaySpeed();
	},
	getVolume : function()
	{
	    return this.getVariableValue("cpCmndVolume");
	},		
	setVolume : function(vol)
	{
	    this.setVariableValue("cpCmndVolume", vol);
	},
	navigateToTime : function(timeinmilliseconds)
	{
		//convert time to frame and 
	    var frame = timeinmilliseconds * this.getPlaySpeed() / 1000;
		this.setVariableValue("cpCmndGotoFrameAndResume",frame);
	},
	canNavigateToTime : function(timeinmilliseconds)
	{
	    var frame = timeinmilliseconds * this.getPlaySpeed() / 1000;	
		return this.objCP.cpEIJSAllowedToGoToTime(frame);
	},
	getCurrentFrame : function()
	{
	    return this.getVariableValue("cpInfoCurrentFrame");
	},
	getCurrentSlideIndex : function()
	{
	    return this.getVariableValue("cpInfoCurrentSlide");
	},
	getVariableValue: function(varName)
	{
		var retValue = this.objCP.cpEIGetValue("m_VarHandle." + varName);
		if(isNumber(retValue))
			return parseFloat(retValue);
		else
			return retValue;
	},
	setVariableValue: function(varName,val)
	{
		this.objCP.cpEISetValue("m_VarHandle." + varName,val);
	},
	gotoSlide: function(val)
	{
		this.setVariableValue("cpCmndGotoSlide",val);
	},
	getEventEmitter : function()
	{
		if(this.m_eventEmitter == undefined)
			this.m_eventEmitter = new EventEmitterClass();
		return this.m_eventEmitter;
	},
	isSWFOrHTMLContent: function()
	{
		return 'swf';
	}
};
