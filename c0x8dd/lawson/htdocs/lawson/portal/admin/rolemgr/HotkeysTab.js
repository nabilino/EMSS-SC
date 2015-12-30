/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/admin/rolemgr/HotkeysTab.js,v 1.17.2.10.4.5.8.1.2.6 2012/08/08 12:37:29 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
//-----------------------------------------------------------------------------
//		***************************************************************
//		*                                                             *                          
//		*                           NOTICE                            *
//		*                                                             *
//		*   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
//		*   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
//		*   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
//		*   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
//		*   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
//		*   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
//		*   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
//		*                                                             *
//		*   (c) COPYRIGHT 2012 INFOR.  ALL RIGHTS RESERVED.           *
//		*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//		*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//		*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//		*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//		*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//		*                                                             *
//		*************************************************************** 
//-----------------------------------------------------------------------------
HotkeysTab.prototype = new TabPage();
HotkeysTab.prototype.constructor = HotkeysTab;
HotkeysTab.superclass = TabPage.prototype;

function HotkeysTab(id,pageMgr)
{
	HotkeysTab.superclass.setId.call(this,id);
	HotkeysTab.superclass.setManager.call(this,pageMgr);
	this.mode="";
	this.role="";
	this.modified=false;
	this.currentKey=null;
	this.currentIsBound=false;
	this.keyboardElem=null;
	this.alt=false;
	this.ctrl=false;
	this.shift=false;
	this.curType="";
	this.strNone="";
	this.strCurrentlyAssigned="";
	this.recording=false;
	this.flags=new Array();
	this.msgObjects=new Array();
	this.keyStorage=new Array();

	this.saveOnContextMenu=null;	// save function pointers during recording
	this.saveOnKeyDown=null;
	this.saveOnHelp=null;
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.activate=function()
{
	try {
		var elem=this.mgr.document.getElementById("selHotkeySet");
		elem.focus();
	} catch (e) { }
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.apply=function()
{
	if (!this.modified)
		return true;

	switch (this.mode)
	{
	case "user":
		if (!this.flags["user"])
			return true;
		var userNode=this.mgr.storage.getRootNode();
		var hkNode=this.mgr.storage.getDocument().getElementsByTagName("HOTKEYS");
		hkNode = (hkNode && hkNode.length == 1 ? hkNode[0] : null);
		if (!this.keyStorage["user"])
		{
			if (userNode && hkNode)
				userNode.removeChild(hkNode)
		}
		else
		{
			var myHkNode=this.keyStorage["user"].getDocument().getElementsByTagName("HOTKEYS");
			myHkNode=myHkNode[0];
			if (hkNode)
			{
				var clone = myHkNode.cloneNode(true);
				hkNode.parentNode.replaceChild(clone,hkNode);
			}
			else if (userNode)
			{
				var clone = myHkNode.cloneNode(true);
				userNode.appendChild(clone);
			}
		}
		this.flags["user"]=false;
		break;

	default:
		for (var t in this.keyStorage)
		{
			if (!this.flags[t]) continue;
			if (t=="portal")
			{
				var myEvtsNode=this.keyStorage[t].getDocument().getElementsByTagName("EVENTS");
				myEvtsNode=(myEvtsNode && myEvtsNode.length == 1 ? myEvtsNode[0] : null);
				var evtsNode=this.mgr.storage.getDocument().getElementsByTagName("EVENTS");
				evtsNode=(evtsNode && evtsNode.length == 1 ? evtsNode[0] : null);
				if (myEvtsNode && evtsNode)
					evtsNode.parentNode.replaceChild(myEvtsNode,evtsNode);
			}
			else
			{
				var strXML=this.keyStorage[t].getDataString(true);
				this.mgr.portalWnd.fileMgr.save(this.mgr.portal.path+"/data/"+t,
						this.role, strXML, "text/xml");
			}
			this.flags[t]=false;
		}
		break;
	}
	return true;
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.deactivate=function()
{
	return true;
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.getMode=function()
{
	return this.mode;
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.getTypeDescription=function(typ)
{
	typ = (typeof(typ) == "undefined" ? this.curType : typ);
	var strTypeDesc=typ;
	var sel=this.mgr.document.getElementById("selHotkeySet");
	var len=sel.options.length;
	for (var i = 0; i < len; i++)
	{
		if (typ == sel.options[i].value)
		{
			strTypeDesc=sel.options[i].text;
			break;
		}
	}
	return strTypeDesc;
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.setMode=function(mode)
{
	this.mode=mode.toLowerCase();

	this.role = (this.mode=="admin"
		? this.mgr.wnd.parent.oPortalRole.getId()
		: this.mgr.wnd.parent.profile.oRole.getId());

	// load the user hotkeys first
	if (this.mode == "user")
	{
		var ds=this.loadKeySet("user");
		this.keyStorage["user"]=ds;
	}

	// load a DataStorage object for each key set
	var sel=this.mgr.document.getElementById("selHotkeySet");
	var len = sel.options.length;
	for (var i = 0; i < len; i++)
	{
		var value=sel.options[i].value;
		this.flags[value]=false;
		var ds=this.loadKeySet(value);
		this.keyStorage[sel.options[i].value]=ds;
	}

	this.curType="portal";
	this.loadKeyList(this.curType);

	return true;
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.init=function()
{
	// set the button labels (if not English)
	if (this.mgr.portal.getLanguage() != "en-us")
	{
		var btn=this.mgr.document.getElementById("btnBindNewHotkey");
		this.mgr.portalWnd.cmnSetElementText(btn,this.mgr.msgs.getPhrase("lblAssign"));
		btn=this.mgr.document.getElementById("btnClearNewHotkey");
		this.mgr.portalWnd.cmnSetElementText(btn,this.mgr.msgs.getPhrase("lblClear"));
		btn=this.mgr.document.getElementById("btnRestoreHotkeys");
		this.mgr.portalWnd.cmnSetElementText(btn,this.mgr.msgs.getPhrase("lblDefaults"));
		btn=this.mgr.document.getElementById("btnRecordNewHotkey");
		this.mgr.portalWnd.cmnSetElementText(btn,this.mgr.msgs.getPhrase("lblRecord"));
		btn=this.mgr.document.getElementById("txtRecording");
		this.mgr.portalWnd.cmnSetElementText(btn,this.mgr.msgs.getPhrase("lblRecording"));
	}
	
	if (this.mgr.portalWnd.oPortalConfig.getSetting("allow_enter_hotkey") == 1) 
	{
		var enterKey = this.mgr.document.getElementById("Enter");
		enterKey.disabled = false;
		enterKey.className = "keyButton";
	}
	
	// these phrases used alot
	this.strNone=this.mgr.msgs.getPhrase("lblNone");
	this.strCurrentlyAssigned=this.mgr.msgs.getPhrase("lblNewHotkeyBinding");
	helpDiv=this.mgr.document.getElementById("lblHotkeyHelpOr");
	helpDiv.innerHTML="&nbsp;&nbsp&nbsp-&nbsp;"+this.mgr.msgs.getPhrase("lblHotkeyHelp3")+"&nbsp;-";

	// display appropriate keyboard
	var keyboardID="USkeyboard_"+(this.mgr.portal.browser.isIE ? "IE" : "NS");
	this.keyboardElem=this.mgr.document.getElementById(keyboardID);
	this.keyboardElem.style.display="block";
	this.keyboardElem.style.visibility="visible";

	// now remove the other keyboard
	keyboardID="USkeyboard_"+(this.mgr.portal.browser.isIE ? "NS" : "IE");
	var keyboardElem=this.mgr.document.getElementById(keyboardID);
	keyboardElem.parentNode.removeChild(keyboardElem);

	// hide record button, customize text if not IE
	if (!this.mgr.portal.browser.isIE)
	{
		btn=this.mgr.document.getElementById("btnRecordNewHotkey");
		btn.style.display="none";
		var helpDiv=this.mgr.document.getElementById("lblHotkeyHelp2");
		helpDiv.style.display="none";
		helpDiv=this.mgr.document.getElementById("lblHotkeyHelpOr");
		helpDiv.style.display="none";
	}
	return true;
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.isUserAssignedAction=function(type,node)
{
	var ds = this.keyStorage["user"];
	if (!ds || !ds.document) return false;

	if (this.mgr.portal.browser.isIE)
	{
		var keyNode = ds.document.selectSingleNode("//EVENT[@action='"+
			node.getAttribute("action")+"']")
		return (keyNode ? true : false);
	}

	// netscrape:
	var evtsNode = ds.getNodeByAttributeId("EVENTS","context",type);
	if (!evtsNode) return false;

	var evtNodes=evtsNode.getElementsByTagName("EVENT");	
	var len=evtNodes.length
	var strAction=node.getAttribute("action");
	for (var i = 0; i < len; i++)
	{
		if (evtNodes[i].getAttribute("action") == strAction)
			return true;
	}
	return false;
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.isSingletonKey=function()
{
	var bIsSingleton=false;
	if (!this.alt && !this.ctrl)
	{
		// A-Z, 0-9 must have either alt or ctrl
		if (this.currentKey)
		{
			var nCode = parseInt(this.currentKey.getAttribute("keycode"),10);
			if ((nCode > 64 && nCode < 91)
			|| (nCode > 47 && nCode < 58))
				bIsSingleton=true;
		}
	}
	return bIsSingleton;
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.loadKeyList=function(type)
{
	// clear the list
	var sel = this.mgr.document.getElementById("selHotkeyActions");
	var len = sel.options.length;
	for (var i=len-1; i > -1; i--)
	{
		var aChild = (this.mgr.portal.browser.isIE
			? sel.children(i) : sel.childNodes[i]);
		sel.removeChild(aChild);
	}
	var inp = this.mgr.document.getElementById("txtHotkey");
	if (inp) inp.innerHTML = "&nbsp;";
	this.startVal="";

	if (!this.keyStorage[type])
		return;		// shouldn't be!

	var events = this.keyStorage[type].document.getElementsByTagName("EVENT");
	len = events.length;
	for (var i = 0; i < len; i++)
	{
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, sel, 
				this.msgObjects[type].getPhrase(events[i].getAttribute("labelid")),
				events[i].getAttribute("action"));
	}
	if (len)
	{
		sel.selectedIndex = 0;
		this.onKeySelectionChange();
	}

	// set the set help text
	var lblId="lbl"+type.substr(0,1).toUpperCase()+type.substr(1)+"Help";
	var helpText=this.mgr.msgs.getPhrase(lblId);
	var textArea = this.mgr.document.getElementById("txtHotkeySet");
	textArea.innerHTML=helpText;

	return true;
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.loadKeySet=function(type)
{
	var ds=null;
	var path="";
	switch (type)
	{
	case "portal":
		var evtsNode=null;
		if (this.mode == "admin")
		{
			evtsNode=this.mgr.storage.getDocument().getElementsByTagName("EVENTS");
			evtsNode=(evtsNode && evtsNode.length > 0 ? evtsNode[0] : null);
		}
		else		// doc == user profile
		{
			var ds = this.mgr.portal.keyMgr.getPortalHotkeys();
			evtsNode=ds.getRootNode();
		}
		if (evtsNode)
		{
			if (this.mgr.portal.browser.isIE)
				ds = new this.mgr.portalWnd.DataStorage(evtsNode.xml,this.mgr.portalWnd);
			else
				ds = new this.mgr.portalWnd.DataStorage(evtsNode,this.mgr.portalWnd);
		}
		this.msgObjects[type]=new this.mgr.portalWnd.phraseObj(type)
		break;

	case "user":
		var hkNode=this.mgr.storage.getDocument().getElementsByTagName("HOTKEYS");
		if (hkNode && hkNode.length == 1)
		{
			hkNode=hkNode[0];
			if (this.mgr.portal.browser.isIE)
				ds = new this.mgr.portalWnd.DataStorage(hkNode.xml,this.mgr.portalWnd);
			else
				ds = new this.mgr.portalWnd.DataStorage(hkNode,this.mgr.portalWnd);
		}
		break;

	default:		// forms, reports
		var file = (this.role == "default.xml" ? "hotkeys.xml" : this.role);
		ds = this.mgr.portalWnd.fileMgr.getFile(this.mgr.portal.path+"/data/"+type,
				file,"text/xml",false);

		var errObj=this.mgr.portalWnd.oError;
		errObj.setMessage("");
		if (errObj.isErrorResponse(ds,true,false,false))
			ds=null;
		if (ds)
		{
			ds=errObj.getDSObject();
			if (this.mgr.portalWnd.fileMgr.getStatus(ds) != "0")
				ds=null;
		}
		if (!ds)
			ds=this.loadKeySetDefaults(type);
		this.msgObjects[type]=new this.mgr.portalWnd.phraseObj(type)
		break;
	}
	return ds;
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.loadKeySetDefaults=function(type)
{
	var ds=null;
	try {
		switch (type)
		{
		case "portal":
			// should only be for admin mode
			var oResponse = this.mgr.portalWnd.fileMgr.getFile(this.mgr.portal.path+"/data/roles",
						"default.xml","text/xml",false);
			if (!oResponse || oResponse.status)
				// shouldn't happen?
				return null;
			var evtsNode=oResponse.getElementsByTagName("EVENTS");
			if (evtsNode && evtsNode.length == 1)
			{
				evtsNode=evtsNode[0];
				if (this.mgr.portal.browser.isIE)
					ds = new this.mgr.portalWnd.DataStorage(evtsNode.xml,this.mgr.portalWnd);
				else
					ds = new this.mgr.portalWnd.DataStorage(evtsNode,this.mgr.portalWnd);
			}
			break;

		default:		// forms, reports
			path=this.mgr.portal.path+"/data/"+type+"/hotkeys.xml";
			ds = this.mgr.portalWnd.fileMgr.getFile(this.mgr.portal.path+"/data/"+type,
						"hotkeys.xml","text/xml",false);
			ds = (ds && typeof(ds.status) == "undefined" 
				? new this.mgr.portalWnd.DataStorage(ds,this.mgr.portalWnd) 
				: null);
			if (ds && ds.document && (ds.document.status))
				ds=null;
			break;
		}
		
	} catch (e) {
		this.mgr.portalWnd.displayExceptionMessage(e,"admin/rolemgr/HotkeysTab.js","loadKeySetDefaults") 
		ds=null;
	}
	return ds;
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.onAssignKey=function()
{
	var sel = this.mgr.document.getElementById("selHotkeyActions");
	var selIndex = sel.selectedIndex;
	if (selIndex < 0) return;

	var strAction=sel.options[selIndex].value;
	var keyNode=null;
	if (this.mode == "admin")
		keyNode = this.keyStorage[this.curType].getNodeByAttributeId("EVENT","action",strAction);
	else // if (this.mode == "user")
	{
		if (this.keyStorage["user"] == null)
		{
			var strXML="<HOTKEYS>\n" +
				"<EVENTS context='portal'></EVENTS>\n" +
				"<EVENTS context='forms'></EVENTS>\n" +
				"<EVENTS context='reports'></EVENTS>\n" +
				"</HOTKEYS>"
			this.keyStorage["user"]= new this.mgr.portalWnd.DataStorage(strXML,this.mgr.portalWnd);
		}
		keyNode = this.keyStorage["user"].getNodeByAttributeId("EVENT","action",sel.options[selIndex].value);
		if (!keyNode)
		{
			baseNode = this.keyStorage[this.curType].getNodeByAttributeId("EVENT","action",strAction);
			var typeNode = this.keyStorage["user"].getNodeByAttributeId("EVENTS","context",this.curType)
			keyNode = this.keyStorage["user"].getDocument().createElement("EVENT");
			keyNode.setAttribute("action",strAction);
			keyNode.setAttribute("labelid",baseNode.getAttribute("labelid"));
			keyNode.setAttribute("incontext",baseNode.getAttribute("incontext"));
			typeNode.appendChild(keyNode);
		}
	}

	if (keyNode)
	{
		keyNode.setAttribute("code", this.currentKey.getAttribute("keycode"));
		keyNode.setAttribute("alt", this.alt ? "1" : "0");
		keyNode.setAttribute("ctrl", this.ctrl ? "1" : "0");
		keyNode.setAttribute("shift", this.shift ? "1" : "0");
		this.setModified(this.mode == "user" ? "user" : this.curType);
	}
	
	this.onClearKey();
	this.onKeySelectionChange();
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.onBeforeUnload=function()
{
	// yuck! ...but apparently the only way to trap Alt+LeftArrow during record
	event.returnValue="Your record key combination is resulting in an attempt "+
		"to navigate away from this page.\nPlease press cancel to resume recording."
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.onClearKey=function(evt,key)
{
	if (this.currentKey)
		this.currentKey.className="keyButton"
	this.currentKey=null;

	var keyRight=null;
	var keyLeft=null;
	this.alt=false;
	keyRight=this.mgr.document.getElementById("altRight");
	keyRight.className = "keyButton";
	keyLeft=this.mgr.document.getElementById("altLeft");
	keyLeft.className = "keyButton";
	this.ctrl=false;
	keyRight=this.mgr.document.getElementById("ctrlRight");
	keyRight.className = "keyButton";
	keyLeft=this.mgr.document.getElementById("ctrlLeft");
	keyLeft.className = "keyButton";
	this.shift=false;
	keyRight=this.mgr.document.getElementById("shiftRight");
	keyRight.className = "keyButton";
	keyLeft=this.mgr.document.getElementById("shiftLeft");
	keyLeft.className = "keyButton";

	var btn=this.mgr.document.getElementById("btnClearNewHotkey");
	btn.disabled=true;
	btn.className="xTToolBarButtonDisabled";
	this.updateDisplay();
	this.activate();		// move focus to select list
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.onClickKey=function(evt,key)
{
	if (key.getAttribute("isModifier"))
	{
		var mod=key.getAttribute("isModifier");
		var keyRight=this.mgr.document.getElementById(mod+"Right");
		keyRight.className = (keyRight.className=="keyButton" ? "keyButtonDown" : "keyButton");
		var keyLeft=this.mgr.document.getElementById(mod+"Left");
		keyLeft.className = (keyLeft.className=="keyButton" ? "keyButtonDown" : "keyButton");
		var value=(keyLeft.className=="keyButton" ? "false" : "true");
		eval("this."+mod+"="+value+";");
	}
	else
	{
		if (this.currentKey)
			this.currentKey.className="keyButton";
		this.currentKey=key;
		key.className="keyButtonDown";
	}
	var btn=this.mgr.document.getElementById("btnClearNewHotkey");
	btn.disabled=false;
	btn.className="xTToolBarButton";
	this.updateDisplay();
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.cancelEvent=function(evt)
{
	// only IE fires this (during recording) and we want to cancel
	var evt=window.event;
	var mgr=this.document.parentWindow.tabMgr;
	mgr.portalWnd.setEventCancel(evt)
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.onKeyDown=function(evt)
{
	return true;
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.onKeySelectionChange=function()
{
	var sel = this.mgr.document.getElementById("selHotkeyActions");
	var selIndex = sel.selectedIndex;
	if (selIndex < 0) return;

	var inp = this.mgr.document.getElementById("txtHotkey");
	if (!inp) return;

	var evtNode=null;
	if (this.mode == "user" && this.keyStorage["user"] != null)
		evtNode = this.keyStorage["user"].getNodeByAttributeId("EVENT","action",sel.options[selIndex].value);
	if (!evtNode)	
		evtNode = this.keyStorage[this.curType].getNodeByAttributeId("EVENT","action",sel.options[selIndex].value);
	if (!evtNode) return;

	var keyStr=""
	if (evtNode.getAttribute("ctrl") == "1")
		keyStr+="Ctrl+"
	if (evtNode.getAttribute("alt") == "1")
		keyStr+="Alt+"
	if (evtNode.getAttribute("shift") == "1")
		keyStr+="Shift+"
	keyStr+=this.mgr.portal.keyMgr.getKeyCodeString(evtNode.getAttribute("code"));
	inp.innerHTML = keyStr;
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.onRecordKey=function()
{
	this.onClearKey();
	this.recording=true;
	this.keyboardElem.style.visibility="hidden";

	// show recording message	
	var elem=this.mgr.document.getElementById("txtRecording");
	elem.style.display="inline";
	elem=this.mgr.document.getElementById("lblHotkeyHelp1");
	elem.style.visibility="hidden";		// need this to occupy space
	elem=this.mgr.document.getElementById("lblHotkeyHelp2");
	elem.style.visibility="hidden";		// need this to occupy space
	elem=this.mgr.document.getElementById("lblHotkeyHelpOr");
	elem.style.display="none";
	elem=this.mgr.document.getElementById("lblHotkeyHelp4");
	elem.style.display="none";

	// disable input elements
	elem=this.mgr.document.getElementById("btnRecordNewHotkey");
	elem.disabled=true;
	elem.className="xTToolBarButtonDisabled";

	elem=this.mgr.document.getElementById("btnRestoreHotkeys");
	elem.className="xTToolBarButtonDisabled";
	elem.disabled=true;
	
	elem=this.mgr.document.getElementById("selHotkeySet");
	elem.disabled=true;
	elem=this.mgr.document.getElementById("selHotkeyActions");
	elem.disabled=true;

	// set capture and new event handlers
	window.document.body.setCapture();
	this.saveOnContextMenu=window.document.body.oncontextmenu;
	window.document.body.oncontextmenu=this.mgr.tabs[tabMgr.activeTab.id].cancelEvent;
	this.saveOnHelp=window.document.body.onhelp;
	window.document.body.onhelp=this.mgr.tabs[tabMgr.activeTab.id].cancelEvent;
	window.document.body.onbeforeunload=this.mgr.tabs[tabMgr.activeTab.id].onBeforeUnload;
	this.saveOnKeyDown=window.document.body.onkeydown;
	window.document.body.onkeydown=this.mgr.tabs[tabMgr.activeTab.id].onRecordKeyDown;
	window.focus();
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.onRecordDone=function()
{
	// release capture and restore event handlers
	window.document.body.releaseCapture();
	window.document.body.oncontextmenu=this.saveOnContextMenu;
	window.document.body.onhelp=this.saveOnHelp;
	window.document.body.onkeydown=this.saveOnKeyDown;
	window.document.body.onbeforeunload="";

	// re-enable buttons
	var elem=this.mgr.document.getElementById("selHotkeyActions");
	elem.disabled=false;
	elem=this.mgr.document.getElementById("selHotkeySet");
	elem.disabled=false;

	elem=this.mgr.document.getElementById("btnRestoreHotkeys");
	elem.className="xTToolBarButton";
	elem.disabled=false;
	elem=this.mgr.document.getElementById("btnRecordNewHotkey");
	elem.className="xTToolBarButton";
	elem.disabled=false;
	elem.focus();

	// show instructions, hide recording text
	var elem=this.mgr.document.getElementById("txtRecording");
	elem.style.display="none";
	elem=this.mgr.document.getElementById("lblHotkeyHelp1");
	elem.style.visibility="visible";
	elem=this.mgr.document.getElementById("lblHotkeyHelp2");
	elem.style.visibility="visible";
	elem=this.mgr.document.getElementById("lblHotkeyHelpOr");
	elem.style.display="inline";
	elem=this.mgr.document.getElementById("lblHotkeyHelp4");
	elem.style.display="inline";

	this.keyboardElem.style.visibility="visible";
	this.updateKeyboard();
	this.recording=false;
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.onRecordKeyDown=function()
{
	// recording supported by IE only
	var evt = window.event;
	var mgr=this.document.parentWindow.tabMgr;
	var hotkeysTab=mgr.tabs[mgr.activeTab.id];

	// escape key stops the recording
	if (evt.keyCode == 27)
	{
		if (!evt.altKey && !evt.ctrlKey && !evt.shiftKey)
		{
			hotkeysTab.onRecordDone();
			return true;
		}
	}
	hotkeysTab.alt=evt.altKey;
	hotkeysTab.ctrl=evt.ctrlKey;
	hotkeysTab.shift=evt.shiftKey;

	if ((evt.keyCode > 32 && evt.keyCode < 124) || (evt.keyCode == 13 && mgr.portalWnd.oPortalConfig.getSetting("allow_enter_hotkey") == 1))
	{
		var btns=mgr.document.getElementsByTagName("button");
		var len = (btns ? btns.length : 0);
		for (var i = 0; i < len; i++)
		{
			if (parseInt(btns[i].getAttribute("keycode"),10) != evt.keyCode)
				continue;
			hotkeysTab.currentKey=btns[i];
			break;
		}
	}
	hotkeysTab.updateDisplay();
	mgr.portalWnd.setEventCancel(evt);
	return false;
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.onRestoreKeys=function(evt,selElem)
{
	// confirmation prompt
	var msg=this.mgr.msgs.getPhrase("msgOkToRestoreKeys") + " '" +
				this.getTypeDescription() + "?'";
	var retVal = this.mgr.portalWnd.cmnDlg.messageBox(msg,
			"okcancel","question",this.mgr.wnd);
	if (retVal == "cancel") return;

	if (this.mode == "user")
	{
		var ds=this.keyStorage["user"];
		var keysNode=ds.getElementsByTagName("EVENTS");
		if (!keysNode || keysNode.length < 1) return;
		var len=keysNode.length;
		var keyNode=null;
		for (var i = 0; i < len; i++)
		{
			if (keysNode[i].getAttribute("context") == this.curType)
			{
				keyNode=keysNode[i];
				break;
			}
		}
		if (!keyNode) return;
		len=keyNode.childNodes.length;
		for (var i = len-1; i > -1; i--)
		{
			var aChild=keyNode.childNodes[i];
			keyNode.removeChild(aChild);
		}
		this.setModified("user");
	}
	else
	{
		var typ=this.curType;
		this.keyStorage[typ]=null;
		this.keyStorage[typ]=this.loadKeySetDefaults(typ);
		this.setModified(typ);
	}

	this.onClearKey();
	this.onKeySelectionChange();
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.onSetChange=function(evt,selElem)
{
	this.curType=selElem.options[selElem.selectedIndex].value;
	this.loadKeyList(this.curType);
	return true;
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.setModified=function(type,modified)
{
	if (typeof(modified) != "boolean")
		modified=true;
	this.modified=modified;
	if (this.modified)
		this.flags[type]=true;
	else
	{
		for (var t in this.flags)
			this.flags[t]=false;
	}
	this.mgr.setModified(this.modified);
	if (type == "user" && modified)
		this.mgr.wnd.parent.profile.setModified();
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.updateDisplay=function()
{
	var hotkeyValue=(this.ctrl ? "Ctrl" : "");
	if (hotkeyValue) 
		hotkeyValue += "+";
	hotkeyValue += (this.alt ? "Alt" : "");
	if (hotkeyValue && hotkeyValue.substr(hotkeyValue.length-1) != "+")
		hotkeyValue += "+";
	hotkeyValue += (this.shift ? "Shift" : "");
	if (hotkeyValue && hotkeyValue.substr(hotkeyValue.length-1) != "+")
		hotkeyValue += "+";
	hotkeyValue += (this.currentKey ? this.currentKey.id : "");

	// enable/disable keys that require modifier
	var bIsModified=(this.ctrl || this.alt || this.shift);
	var bIsModified2=(this.ctrl && this.alt && !this.shift);
	//var specKeys = new Array ("A","Esc","Enter","Tab");
	var specKeys = new Array ("A","Esc","Tab");
	var len=specKeys.length;
	for (var i = 0; i < len; i++)
	{
		var key=this.mgr.document.getElementById(specKeys[i]);
		if (!key) continue;		// should never be!

		// A is special case: don't ever allow assignment to Ctrl+Alt+A (debug access)
		key.disabled = ( i == 0
			? (bIsModified2 ? true : false)
			: (bIsModified ? false : true));

		if (!key.disabled)
		{
			if (key.className=="keyButtonDisabled")
				key.className="keyButton";
		}
		else
		{
			key.className="keyButtonDisabled";
			if (this.currentKey && this.currentKey.id == key.id)
			{
				hotkeyValue="&nbsp;";
				this.currentKey=null;
			}
		}
	}

	var textBox=this.mgr.document.getElementById("txtNewHotkey")
	textBox.innerHTML = (hotkeyValue ? hotkeyValue : "&nbsp;");
	var lblBinding=this.mgr.document.getElementById("lblNewHotkeyBinding");
	lblBinding.innerHTML = "&nbsp;";

	textBox=this.mgr.document.getElementById("txtNewHotkeyBinding");
	var assignBtn=this.mgr.document.getElementById("btnBindNewHotkey");
	var strType="";
	var strBinding="";

	// get the current hotkey action
	var sel = this.mgr.document.getElementById("selHotkeyActions");
	var selIndex = sel.selectedIndex;
	var strAction = (selIndex < 0 ? this.strNone : sel.options[selIndex].value);

	this.currentIsBound=false;
	if (!this.currentKey || this.isSingletonKey())
	{
		textBox.innerHTML="&nbsp;";
		assignBtn.disabled=true;
		assignBtn.className="xTToolBarButtonDisabled";
		return;
	}

	// assumes user storage is first in the list
	for (var t in this.keyStorage)
	{
		strType=t
		var ds = this.keyStorage[t];
		if (!ds || !ds.document) continue;
		var evtNodes = ds.document.getElementsByTagName("EVENT");
		if (!evtNodes) continue;
		var len=evtNodes.length
		for (var i = 0; i < len; i++)
		{
			var evtNode=evtNodes[i];
			if (evtNode.getAttribute("action") == strAction && strType == "user" )
			{
				strBinding=this.strNone;
				break;
			}
			if (evtNode.getAttribute("code") != this.currentKey.getAttribute("keycode"))
				continue
			if (evtNode.getAttribute("ctrl") != (this.ctrl ? "1" : "0"))
				continue;
			if (evtNode.getAttribute("alt") != (this.alt ? "1" : "0"))
				continue;
			if (evtNode.getAttribute("shift") != (this.shift ? "1" : "0"))
				continue;

			if (strType == "user")
				strBinding=this.msgObjects[evtNode.parentNode.getAttribute("context")].getPhrase(
						evtNode.getAttribute("labelid"));
			else
			{
				if (this.mode == "user" 
				&& this.isUserAssignedAction(strType,evtNode))
					strBinding=this.strNone;
				else
					strBinding=this.msgObjects[strType].getPhrase(evtNode.getAttribute("labelid"));
			}
			break;
		}
		if (strBinding) break;
	}

	this.currentIsBound=(strBinding && strBinding != this.strNone ? true : false);
	if (this.currentIsBound)
		strType=this.getTypeDescription(strType);
	textBox.innerHTML=(this.currentIsBound ? strType+"/"+strBinding : this.strNone);
	textBox.style.color=(this.currentIsBound ? "red" : "black");
	lblBinding.innerHTML=this.strCurrentlyAssigned;
	if (!this.recording)
	{
		assignBtn.disabled=this.currentIsBound;
		assignBtn.className="xTToolBarButton"+(this.currentIsBound ? "Disabled" : "");
	}
}

//-----------------------------------------------------------------------------
HotkeysTab.prototype.updateKeyboard=function()
{
	// called after done recording
	var btn=null;
	var key=this.mgr.document.getElementById("altRight");
	key.className = (this.alt ? "keyButtonDown" : "keyButton");
	key=this.mgr.document.getElementById("altLeft");
	key.className = (this.alt ? "keyButtonDown" : "keyButton");

	key=this.mgr.document.getElementById("ctrlRight");
	key.className = (this.ctrl ? "keyButtonDown" : "keyButton");
	key=this.mgr.document.getElementById("ctrlLeft");
	key.className = (this.ctrl ? "keyButtonDown" : "keyButton");

	key=this.mgr.document.getElementById("shiftRight");
	key.className = (this.shift ? "keyButtonDown" : "keyButton");
	key=this.mgr.document.getElementById("shiftLeft");
	key.className = (this.shift ? "keyButtonDown" : "keyButton");

	if (this.currentKey)
	{
		this.currentKey.className="keyButtonDown";
		if (!this.currentIsBound && !this.isSingletonKey())
		{
			btn=this.mgr.document.getElementById("btnBindNewHotkey");
			btn.disabled=false;
			btn.className="xTToolBarButton";
		}
	}
	if (this.alt || this.ctrl || this.shift || this.currentKey)
	{
		btn=this.mgr.document.getElementById("btnClearNewHotkey");
		btn.disabled=false;
		btn.className="xTToolBarButton";
	}
}
