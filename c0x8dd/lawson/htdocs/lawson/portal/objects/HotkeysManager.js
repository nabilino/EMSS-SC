/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/objects/HotkeysManager.js,v 1.7.2.7.4.3.14.4.2.3 2012/08/08 12:37:30 jomeli Exp $ */
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

// constructor
function HotkeysManager(portalWnd)
{
	try {
		this.bInitialized=false;
		this.portalWnd=portalWnd;
		this.portalObj=portalWnd.lawsonPortal;
		this.portalRole="default.xml";
		this.storage=new Array();
		this.paths=new Array();
		this.loadMsg="";
		if (this.refresh())
			return;
		
	} catch (e) { }
	var msg=this.portalObj.getPhrase("msgErrorInitHotkeys") + this.loadMsg;
	this.portalWnd.cmnDlg.messageBox(msg,"ok","alert");
}

//-----------------------------------------------------------------------------
// method to add module hotskeys:
//	a) cntxtName	- module name, used to lookup hotkey
//	b) cntxtFolder	- server path (folder) of XML hotkeys definition
//	c) oPhraseTbl	- reference to phrase table for label lookup
//	d) bDispErr		- optional, boolean indicating errors should be alerted
// returns true/false success of loading the hotkeys xml
//-----------------------------------------------------------------------------
HotkeysManager.prototype.addHotkeySet=function(cntxtName,cntxtFolder,oPhraseTbl,bDispErr)
{
	if (!this.bInitialized) return false;

	// context already loaded?
	if (typeof(this.storage[cntxtName.toLowerCase()]) != "undefined"
	&& this.storage[cntxtName.toLowerCase()] != null)
		return true;

	// temp placeholder to prevent repeated attempts to load on failure
	this.storage[cntxtName.toLowerCase()]="1";		

	// validate display errors flag
	if (typeof(bDispErr) != "boolean") bDispErr=true;

	// validate phrase table parm
	if (typeof(oPhraseTbl) != "object") oPhraseTbl=null;

	// load the context xml -------------------------------
	// look for:	<cntxtFolder>/<portal role>
	// else:		<cntxtFolder>/hotkeys.xml

	var strPath="";
	try	{
		// if role assigned, look for file on app server with role name
		var ds=null;
		var oResponse=null;
		if (this.portalRole != "default.xml")
		{
			strPath=this.portalObj.path+"/data/"+cntxtFolder+"/"+this.portalRole;
			oResponse=this.getHotkeyFile(this.portalObj.path+"/data/"+cntxtFolder,this.portalRole);
			if (oResponse)
			{
				ds = new this.portalWnd.DataStorage(
					(this.portalObj.browser.isIE ? oResponse.xml : oResponse), this.portalWnd);
			}
		}

		// if role file not found, load default
		if (!ds)
		{
			strPath=this.portalObj.path+"/data/"+cntxtFolder+"/hotkeys.xml";
			oResponse=this.getHotkeyFile(this.portalObj.path+"/data/"+cntxtFolder,"hotkeys.xml");

			var msg=this.portalObj.getPhrase("msgErrorLoadHotkeys")+": "+cntxtName+".\n"+
						this.portalObj.getPhrase("msgErrorRetrievingFile")+" "+strPath+"."
			if (this.portalWnd.oError.handleBadResponse(oResponse,bDispErr,msg,window))
				return false;
		}
		// load response in data storage object
		ds = new this.portalWnd.DataStorage(
				(this.portalObj.browser.isIE ? oResponse.xml : oResponse), this.portalWnd);
		if (ds.document)
		{
			// validate the XML format
			var evtNode=ds.document.getElementsByTagName("EVENTS")
			if (!evtNode)
			{
				if (bDispErr)
				{
					var msg=this.portalObj.getPhrase("msgInvalidXMLFormat")+" "+strPath;
					this.portalWnd.cmnDlg.messageBox(msg,"ok","alert");
				}
				return false;
			}

			if (oPhraseTbl)
				ds=this.convertLabels(ds,oPhraseTbl)
			this.storage[cntxtName.toLowerCase()]=ds;
			this.paths[cntxtName.toLowerCase()]=strPath;
			this.loadUserHotkeys(cntxtName.toLowerCase());
			return (true);
		}

	} catch(e) { }
	
	var msg=this.portalObj.getPhrase("ERROR_LOAD_XML")+": "+strPath;
	this.portalWnd.cmnDlg.messageBox(msg,"ok","alert");
	return false;
}

//-----------------------------------------------------------------------------
// 'non-public' method to convert lableid attribute from id to phrase
HotkeysManager.prototype.convertLabels=function(ds,phrases)
{
	try {
		var retDS=null;
		var evtNodes=null;
		var retNodes=null;
		if (this.portalObj.xsltSupport)
		{
			retDS=new this.portalWnd.DataStorage(ds.document.xml,this.portalWnd);
			var labelid=ds.document.documentElement.getAttribute("labelid")
			if (labelid)
				retDS.document.documentElement.setAttribute("labelid", phrases.getPhrase(labelid) )
			var evtNodes=ds.document.selectNodes("//EVENT")
			var retNodes=retDS.document.selectNodes("//EVENT")
		}
		else
		{
			// down-level browsers
			retDS=new this.portalWnd.DataStorage(ds.getDataString(true),this.portalWnd);
			var root=retDS.getNodeByName("EVENTS")
			var labelid=root.getAttribute("labelid")
			if (labelid)
				root.setAttribute("labelid", phrases.getPhrase(labelid) )
			var evtNodes=ds.document.getElementsByTagName("EVENT")
			var retNodes=retDS.document.getElementsByTagName("EVENT")
		}
		var len=evtNodes ? evtNodes.length : 0;
		for (var i = 0; i < len; i++)
		{
			labelid=evtNodes[i].getAttribute("labelid")
			if (!labelid) continue;
			var phrase=phrases.getPhrase(labelid)
			retNodes[i].setAttribute("labelid",phrase)
		}
		return (retDS);
		
	} catch (e) { return ds }
}

//-----------------------------------------------------------------------------
// 'public' method to determine if help key should be cancelled
HotkeysManager.prototype.cancelHelpKey=function(evt,cntxtName)
{
	if (!this.bInitialized) return (false);
	if (!this.portalObj.xsltSupport)
		return (false);		// only IE fires onhelp

	var alt=(evt.altKey ? "1" : "0");
	var ctrl=(evt.ctrlKey ? "1" : "0");
	var shift=(evt.shiftKey ? "1" : "0");
	var keyCode="112"		// IE supplies a keycode of 0?

	// look for hotkey defined for portal or cntxtName
	for (ds in this.storage)
	{
		if (ds != "portal" && ds != cntxtName)
			continue;
		var set=this.storage[ds]
		var keyNode = set.document.selectSingleNode("//EVENT[@code='"+keyCode+
			"' and @alt='"+alt+"' and @ctrl='"+ctrl+"' and @shift='"+shift+"']")
		if (keyNode) return true;
	}
	return (false);
}

//-----------------------------------------------------------------------------
HotkeysManager.prototype.refresh=function()
{
	// get the portal role
	try {
		this.portalRole=this.portalWnd.oUserProfile.oRole.getId();
	} catch (e) { this.portalRole="default.xml"; }

	// initialize storage
	this.loadMsg="";
	for (var ds in this.storage)
		this.storage[ds]=null;
	this.storage=new Array();
	for (var s in this.paths)
		this.storage[s]=null;
	this.paths=new Array();

	// load the portal hotkeys
	var ds=this.getPortalHotkeys()
	if (!ds.document)
	{
		this.loadMsg=("\n"+this.portalObj.getPhrase("msgErrorLoadHotkeys")+": portal.");
		return false;
	}

	ds=this.convertLabels(ds,this.portalObj)
	this.storage["portal"]=ds;
	if (typeof(this.paths["portal"]) == "undefined")
		this.paths["portal"]=this.portalObj.path+"/data/roles/"+this.portalRole;
	this.bInitialized=true;
	this.loadUserHotkeys("portal");
	return true;
}

//-----------------------------------------------------------------------------
// method to lookup hotkey action for specified context
//	a) evt			- event object from keydown handler
//	b) cntxtName	- module name used to add hotkey set
// returns string action attribute or null if not found
//-----------------------------------------------------------------------------
HotkeysManager.prototype.getHotkeyAction=function(evt,cntxtName)
{
	if (!this.bInitialized) return (null);
	if (typeof(this.storage[cntxtName.toLowerCase()]) != "object")
		return (null);

	var ds=this.storage[cntxtName.toLowerCase()]
	var alt=(evt.altKey ? "1" : "0");
	var ctrl=(evt.ctrlKey ? "1" : "0");
	var shift=(evt.shiftKey ? "1" : "0");
	var keyCode=(!this.portalObj.browser.isIE ? evt.charCode : evt.keyCode);
	if (!keyCode) keyCode = evt.keyCode		// netscrape required massage

	// IE with XSLT support ---------------------------------------------------
	if (this.portalObj.xsltSupport)
	{
		var keyNode = ds.document.selectSingleNode("//EVENT[@code='"+keyCode+
			"' and @alt='"+alt+"' and @ctrl='"+ctrl+"' and @shift='"+shift+"']")
		return (keyNode ? keyNode.getAttribute("action") : null);
	}

	// netscrape, down levels of IE -------------------------------------------
	var tmpDS=new this.portalWnd.DataStorage(ds.getDataString(true),this.portalWnd);
	var keyNodes = tmpDS.document.getElementsByTagName("EVENT")
	if (!keyNodes || keyNodes.length == 0)
		return (null);

	var len=keyNodes.length
	for (var i = 0; i < len; i++)
	{
		var node=keyNodes[i]
		if (node.nodeName == "#text" || node.nodeName == "#comment")
			continue;
		if (node.getAttribute("code") != keyCode) continue;
		if (node.getAttribute("alt") != alt) continue;
		if (node.getAttribute("ctrl") != ctrl) continue;
		if (node.getAttribute("shift") != shift) continue;
		return (node.getAttribute("action"));
	}
	return (null);
}

//-----------------------------------------------------------------------------
HotkeysManager.prototype.getHotkeyFile=function(folder,name)
{
	var oFile = null;
	var profileService=this.portalWnd.oPortalConfig.getServiceName("userprofile");

	// found a service name
	switch (profileService.toLowerCase())
	{
	case "iosprofile":
		oFile = this.portalWnd.fileMgr.getFile(folder,name,"text/xml",false);
		if ( !oFile || oFile.status || this.portalWnd.fileMgr.getStatus(oFile) != "0")
			oFile=null;
		break;
	default:
		oFile = this.portalWnd.httpRequest(folder+"/"+name,null,"","text/xml",false);
		if (!oFile || oFile.status)
			oFile=null;
		break;
	}
	return oFile;
}

//-----------------------------------------------------------------------------
// 'public' method to convert a keycode to string (based on US keyboard)
HotkeysManager.prototype.getKeyCodeString=function(code)
{
	var retVal=code
	switch (parseInt(code))
	{
	case 9:		retVal="Tab";	break;
	case 13:	retVal="Enter";	break;
	case 27:	retVal="Esc";	break;
	case 32:	retVal="Space";	break;
	case 33:	retVal="PageUp";break;
	case 34:	retVal="PageDn";break;
	case 35:	retVal="End";	break;
	case 36:	retVal="Home";	break;
	case 37:	retVal="Left Arrow";	break;
	case 38:	retVal="Up Arrow";		break;
	case 39:	retVal="Right Arrow";	break;
	case 40:	retVal="Down Arrow";	break;
	case 45:	retVal="Ins";	break;
	case 46:	retVal="Del";	break;
	case 65:	retVal="A";		break;
	case 66:	retVal="B";		break;
	case 67:	retVal="C";		break;
	case 68:	retVal="D";		break;
	case 69:	retVal="E";		break;
	case 70:	retVal="F";		break;
	case 71:	retVal="G";		break;
	case 72:	retVal="H";		break;
	case 73:	retVal="I";		break;
	case 74:	retVal="J";		break;
	case 75:	retVal="K";		break;
	case 76:	retVal="L";		break;
	case 77:	retVal="M";		break;
	case 78:	retVal="N";		break;
	case 79:	retVal="O";		break;
	case 80:	retVal="P";		break;
	case 81:	retVal="Q";		break;
	case 82:	retVal="R";		break;
	case 83:	retVal="S";		break;
	case 84:	retVal="T";		break;
	case 85:	retVal="U";		break;
	case 86:	retVal="V";		break;
	case 87:	retVal="W";		break;
	case 88:	retVal="X";		break;
	case 89:	retVal="Y";		break;
	case 90:	retVal="Z";		break;
	case 112:	retVal="F1";	break;
	case 113:	retVal="F2";	break;
	case 114:	retVal="F3";	break;
	case 115:	retVal="F4";	break;
	case 116:	retVal="F5";	break;
	case 117:	retVal="F6";	break;
	case 118:	retVal="F7";	break;
	case 119:	retVal="F8";	break;
	case 120:	retVal="F9";	break;
	case 121:	retVal="F10";	break;
	case 122:	retVal="F11";	break;
	case 123:	retVal="F12";	break;
	}
	return (retVal);
}

//-----------------------------------------------------------------------------
HotkeysManager.prototype.getPortalHotkeys=function()
{
	var ds=null;
	strPath="";
	try {
		// IE with XSLT support
		if (this.portalObj.xsltSupport)
		{
			strPath=this.portalObj.path+"/data/roles/"+this.portalRole;
			var hkNode=this.portalWnd.oUserProfile.oRole.storage.document.selectSingleNode("//ROLE/EVENTS")
			if (!hkNode)
			{
				// not in role file, try to load from file
				strPath=this.portalObj.path+"/data/hotkeys.xml";
				var oFile=this.getHotkeyFile(this.portalObj.path+"/data","hotkeys.xml");
				if (oFile)
					hkNode=oFile.selectSingleNode("/EVENTS");
			}
			if (hkNode)
			{
				this.paths["portal"]=strPath;
				ds = new this.portalWnd.DataStorage(hkNode.xml,this.portalWnd);
			}
			return ds;
		}

		// down-level browsers
		var	hkDoc=this.portalWnd.oUserProfile.oRole.storage.getElementsByTagName("EVENTS");
		if (hkDoc && hkDoc.length > 0)
		{
			hkDoc=hkDoc[0];
			ds = new this.portalWnd.DataStorage(hkDoc,this.portalWnd);
			return ds;
		}

		// not in role file, try to load from file
		strPath=this.portalObj.path+"/data/hotkeys.xml";
		var oFile=this.getHotkeyFile(this.portalObj.path+"/data","hotkeys.xml");
		if (oFile)
		{
		 	this.paths["portal"]=strPath;
			ds = new this.portalWnd.DataStorage(oFile,this.portalWnd);
		}

	} catch (e) { }
	return ds;
}

//-----------------------------------------------------------------------------
// method to check keystroke is hotkey valid outside of context
// returns:
//		true - may be routed from another ('portal') context
//		false - only valid from within context
//-----------------------------------------------------------------------------
HotkeysManager.prototype.isContextFreeHotkey=function(evt)
{
	if (!this.bInitialized) return (null);

	var alt=(evt.altKey ? "1" : "0");
	var ctrl=(evt.ctrlKey ? "1" : "0");
	var shift=(evt.shiftKey ? "1" : "0");
	var keyCode=(!this.portalObj.browser.isIE ? evt.charCode : evt.keyCode);
	if (!keyCode) keyCode = evt.keyCode		// netscrape required massage

	// IE with XSLT support ---------------------------------------------------
	if (this.portalObj.xsltSupport)
	{
		for (ds in this.storage)
		{
			var set=this.storage[ds]
			var keyNode = set.document.selectSingleNode("//EVENT[@code='"+keyCode+
				"' and @alt='"+alt+"' and @ctrl='"+ctrl+"' and @shift='"+shift+"']")
			if (keyNode && keyNode.getAttribute("incontext") == "0")
				return true;
		}
		return (false);
	}

	// netscrape, down levels of IE -------------------------------------------
	for (ds in this.storage)
	{
		var tmpDS=new this.portalWnd.DataStorage(
				this.storage[ds].getDataString(true),this.portalWnd);
		var keyNodes = tmpDS.document.getElementsByTagName("EVENT")
		if (!keyNodes || keyNodes.length == 0)
			continue;

		var len=keyNodes.length
		for (var i = 0; i < len; i++)
		{
			var node=keyNodes[i]
			if (node.nodeName == "#text" || node.nodeName == "#comment")
				continue;
			if (node.getAttribute("code") != keyCode) continue;
			if (node.getAttribute("alt") != alt) continue;
			if (node.getAttribute("ctrl") != ctrl) continue;
			if (node.getAttribute("shift") != shift) continue;
			if (node.getAttribute("incontext")== "0")
				return (true);
			break;
		}
	}
	return (false);
}

//-----------------------------------------------------------------------------
HotkeysManager.prototype.isHotkeySetLoaded=function(cntxtName)
{
	if (!this.bInitialized) return (false);

	// context already loaded?
	return ( typeof(this.storage[cntxtName.toLowerCase()]) != "undefined"
				? true : false );
}

//-----------------------------------------------------------------------------
HotkeysManager.prototype.loadUserHotkeys=function(cntxtName)
{
	try {
		if (!this.isHotkeySetLoaded(cntxtName))
			return;

		var evntsNode=this.portalWnd.oUserProfile.storage.getNodeByAttributeId("EVENTS","context",cntxtName);
		if (!evntsNode) return;
		var userEvents=evntsNode.getElementsByTagName("EVENT");
		if (!userEvents || userEvents.length == 0)
			return;
		var len=userEvents.length
		for (var i = 0; i < len; i++)
		{
			var mgrNode=this.storage[cntxtName].getNodeByAttributeId(
						"EVENT","action",userEvents[i].getAttribute("action"));
			if (mgrNode)
			{
				mgrNode.setAttribute("code",userEvents[i].getAttribute("code"));
				mgrNode.setAttribute("alt",userEvents[i].getAttribute("alt"));
				mgrNode.setAttribute("ctrl",userEvents[i].getAttribute("ctrl"));
				mgrNode.setAttribute("shift",userEvents[i].getAttribute("shift"));
			}
		}
		
	} catch (e) { }
}
