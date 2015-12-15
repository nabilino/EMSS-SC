/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/homedebug.js,v 1.23.2.15.4.13.8.2.2.3.2.1 2013/08/27 00:05:33 jquito Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.692 2013-12-12 04:00:00 */
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

var portalWnd=null;
var portalObj=null;
var bNormalClose=false;

var textloc;
var lastView=""
var dashStr="---------------------------------------------------------------\n"

//-----------------------------------------------------------------------------
function aboutInit()
{
	portalWnd=parent.portalWnd;
	if (!portalWnd) return;
	portalObj=portalWnd.lawsonPortal;

	with (portalObj.toolbar)
	{
		target=window
		clear()
		createButton(portalObj.getPhrase("LBL_CLOSE"), aboutClose);
	}
	portalObj.setTitle("Portal Internals")
	lastView="Profile";
	aboutOnResize();
	switchView(lastView);
	if (portalWnd.oPortalConfig.isPortalLessMode())
		aboutOnResize();
}

//-----------------------------------------------------------------------------
function aboutClose()
{
	bNormalClose=true;
	portalWnd.goHome();
}

//-----------------------------------------------------------------------------
function aboutFormat(str)
{
	var strNew=str.replace( /(\<[^!\?])/g ,"\n$1")
	return (strNew)
}

//-----------------------------------------------------------------------------
function aboutOnBeforeUnload()
{
	// this will catch the use of browser 'back' whether from
	// mouse or keyboard and do the close action
	if (!bNormalClose)
		aboutClose();
}

//-----------------------------------------------------------------------------
function aboutUnload()
{
	portalWnd.formUnload();
}

//-----------------------------------------------------------------------------
function textKeyDown(evt)
{
    evt = portalWnd.getEventObject(evt)
    if (!evt) return false;

	if (evt.keyCode == 27) return;		// allow escape

	if ( evt.keyCode < 65 )
		portalWnd.cancelEventBubble(evt)
	else if ( evt.keyCode < 90 && !evt.altKey && !evt.ctrlKey && !evt.shiftKey)
		portalWnd.cancelEventBubble(evt)
}

//-----------------------------------------------------------------------------
function aboutKeyDown(evt)
{
    evt = portalWnd.getEventObject(evt)
    if (!evt) return false;

	// check with portal for hotkey action
	var action = portalWnd.getFrameworkHotkey(evt,"homedebug");
	if ( !action )
	{
		// framework handled the keystroke
		portalWnd.setEventCancel(evt)
		return false;
	}

	// hotkey defined for this keystroke
	if (action != "homedebug")
	{
		cntxtActionHandler(evt,action);
		portalWnd.setEventCancel(evt)
		return false;
	}

	var evtCaught=false
	var keyVal = portalObj.browser.isIE ? evt.keyCode : evt.charCode;
	if (keyVal==0)		// netscape only
		keyVal=evt.keyCode
   	switch(keyVal)
	{
	case 37:	// arrow left
		if( evt.altKey && !evt.ctrlKey && !evt.shiftKey )
		{
			// kill the browser 'back' key combo
			evtCaught=true
		}
		break;
	}
	if(evtCaught==true)
		portalWnd.setEventCancel(evt)
	return evtCaught
}

//-----------------------------------------------------------------------------
function cntxtActionHandler(evt,action)
{
	if (action==null)
	{
		// called by the portal
		action = portalWnd.getFrameworkHotkey(evt,"homedebug");
		if (!action || action=="homedebug")
			return false;
	}
	var bHandled=false
	switch (action)
	{
	case "doCancel":
		aboutClose()
		bHandled=true
		break;
	case "posInFirstField":
		textWindow.focus()
		bHandled=true
		break;
	}
	return (bHandled);
}
//-----------------------------------------------------------------------------
function aboutOnResize(evt)
{
	var scrWidth=(portalObj.browser.isIE
		? document.body.offsetWidth
		: window.innerWidth-2);
	var scrHeight=(portalObj.browser.isIE
		? document.body.offsetHeight
		: window.innerHeight-2);
	if (scrWidth < 157) return;
	if (scrHeight < 170) return;

	var btnDiv=document.getElementById("btnDiv")
	if (!btnDiv) return;

	btnDiv.style.left=6;
	btnDiv.style.width=scrWidth-12;

	var textWindow=document.getElementById("textWindow")
	if (!textWindow) return;

	textWindow.style.top=btnDiv.offsetHeight+4;
	textWindow.style.left=6;
	textWindow.style.width=scrWidth-12;
	textWindow.style.height=scrHeight-(btnDiv.offsetHeight+20);
}

//-----------------------------------------------------------------------------
function padSpaces(s,n)
{
	var ret=s+""
	while (ret.length<n)
		ret+=" "
	return ret
}

//-----------------------------------------------------------------------------
function formatXML(str)
{
	var strNew=str.replace( /\>\</gm ,">\n<")
	return (strNew);
}
//-----------------------------------------------------------------------------
function showPortalVersion()
{
	var aboutText="Portal Version: ";
	aboutText+=(portalWnd.oPortalConfig.getPortalVersion()+"\n\n");
	aboutText+="Source file\t\tVersion\n"+dashStr;

	var itemNames=new Array();

	var obj=portalWnd.oVersions;
	for (var i = 0; i < obj.length; i++)
	{
		var item=obj.children(i);
		var name=item.name;
		if (name.substr(0,1) == "/" || name.indexOf("/") == -1)
			name="/"+name;		// for sort purposes
		itemNames[itemNames.length]=name;
	}

	itemNames=itemNames.sort();

	for (var i = 0; i < obj.length; i++)
	{
		var name=itemNames[i];
		if (name.substr(0,1) == "/")
			name=name.substr(1);
		var item=obj.getItem(name);
		aboutText+=item.name+"\t";
		if (item.name.length < 19)
			aboutText+="\t";
		if (item.name.length < 10)
			aboutText+="\t";
		aboutText+=item.value+"\n";
	}

	aboutText+="\n\nIOS Version: ";
	var iosVer=portalWnd.oPortalConfig.getIOSVersion().substr(0,5);
	aboutText+=(portalWnd.oPortalConfig.getIOSVersion()+"\n\n");
	aboutText+="Servlet\t\tVersion\n"+dashStr;

	try {
		// must request them indiviually to get them sorted
		// (or else make 2 passes at the returned XML - but then
		// 'services' like Data contain lots of classes)
		var api="/servlet/What"
			api += "?_SERVLET="+
			"com.lawson.servlet.Cgilawson;"+
			"com.lawson.servlet.FileMgr;"+
			"com.lawson.servlet.gettrav;"+
			"com.lawson.servlet.Help;"+
			"com.lawson.servlet.IOSCacheRefresh;"+
			"com.lawson.servlet.JobServer;"+
			"com.lawson.servlet.LawSearch;"+
			"com.lawson.servlet.LawTerminal;"+
			"com.lawson.servlet.LsnInfo;"+
			"com.lawson.servlet.PassThrough;"+
			"com.lawson.servlet.Profile;"+
			"com.lawson.servlet.Report;"+
			"com.lawson.ios.servlet.RmUpdate;"+
			"com.lawson.ios.servlet.Router;"+
			"com.lawson.servlet.SysEnv;"+
			"com.lawson.servlet.Transform;"+
			"com.lawson.servlet.Translate;"+
			"com.lawson.servlet.What;"+
			"com.lawson.servlet.Xpress"

		var oXML=portalWnd.httpRequest(api,null,"","text/xml",false)
		if (!oXML || oXML.status)
			aboutText+="\n\nError retrieving servlet/What info.\n"
		else
		{
			var iPos=0;
			var items=oXML.getElementsByTagName("CLASS")
			for (var i = 0; i < items.length; i++)
			{
				var name=items[i].getAttribute("name")
				iPos=name.indexOf("servlet.");
				if (iPos == -1)
					continue;
				if (iPos != -1)
					name=name.substr(iPos+8);
				aboutText+=name
				var verText="";
				try {
					var whatNode=items[i].getElementsByTagName("WHATSTR");
					whatNode = (whatNode && whatNode.length ? whatNode[0] : null);
					verText=portalWnd.cmnGetNodeCDataValue(whatNode);
					var iPos=verText.indexOf("java,v")
					if (iPos!=-1)
						verText=verText.substr(iPos+7)
					iPos=verText.indexOf("Exp $");
					if (iPos != -1)
						verText=verText.substr(0,iPos-1);
					iPos=verText.lastIndexOf(" ");		// strip developer name
					if (iPos != -1)
						verText=verText.substr(0,iPos);

					if (name.length < 16 ) aboutText+="\t"
					if (name.length < 11 ) aboutText+="\t"
					aboutText+=verText
					if (verText.substr(verText.length-1)!="\n") aboutText+="\n"
					
				} catch (e) { 
					if (name.length < 16 ) aboutText+="\t"
					if (name.length < 11 ) aboutText+="\t"
					aboutText+="unknown\n";
				}

			}
		}
	} catch (e) { 
		aboutText+="\n\nError retrieving servlet/What info.\n"
	}

	document.getElementById("textWindow").value=aboutText
}


//-----------------------------------------------------------------------------
function showUserProfile()
{
	var obj = portalWnd.oUserProfile;
	var aboutText="User Profile data:\n"+dashStr;
	aboutText+="id\t\t"+obj.id+"\n";
	aboutText+="fileName\t\t"+obj.fileName+"\n";
	aboutText+="portalAdmin\t"+obj.portalAdmin+"\n";
	aboutText+="allowHotKeys\t"+obj.allowHotKeys+"\n";
	aboutText+="allowShortcuts\t"+obj.allowShortcuts+"\n";
	aboutText+="\n";

	aboutText+="User Profile storage:\n"+dashStr;

	if (portalObj.xsltSupport)
	{
		// jump through hoops to get nice format ;-)
		var str=obj.storage.getDataString(true);
		str=formatXML(str);
		var dom=portalWnd.objFactory.createInstance("DOM");
		dom.async=false;
		dom.loadXML(str);
		aboutText+=dom.xml;
	}
	else
		aboutText+=obj.storage.getDataString(true);
	aboutText+="\n";

	aboutText+="User Profile attributes:\n"+dashStr;
	aboutText+=obj.attStorage.getDataString(true);
	aboutText+="\n";

	obj = portalWnd.oUserProfile.oRole;
	aboutText+="User Profile Role data:\n"+dashStr;
	aboutText+="id\t\t"+obj.id+"\n";
	aboutText+="allowHotkeys\t"+obj.allowHotkeys+"\n";
	aboutText+="useFind\t\t"+obj.useFind+"\n";
	aboutText+="useInbasket\t"+obj.useInbasket+"\n";
	aboutText+="useMenus\t\t"+obj.useMenus+"\n";
	aboutText+="usePreferenesMenu\t"+obj.usePreferencesMenu+"\n";
	aboutText+="useContentMenu\t"+obj.useContentMenu+"\n";
	aboutText+="useShortcuts\t"+obj.useShortcuts+"\n";
	aboutText+="ver\t\t"+obj.ver+"\n";
	aboutText+="\n";

	aboutText+="User Profile Role storage:\n"+dashStr;
	aboutText+=obj.storage.getDataString(true);

	aboutText+="\n\nIOS Profile data:\n"+dashStr;
	var ds = (portalObj.xsltSupport
		? new portalWnd.DataStorage(portalObj.profile.xml,portalWnd)
		: new portalWnd.DataStorage(portalObj.profile,portalWnd));
	var str=ds.getDataString(true);
	aboutText+=str;

	document.getElementById("textWindow").value=aboutText
}

//-----------------------------------------------------------------------------
function showPortalConfig()
{
	var obj = portalWnd.oPortalConfig.storage;
	var aboutText="";

	if (portalObj.xsltSupport)
	{
		// jump through hoops to get nice format ;-)
		var str=obj.getDataString(true);
		str=formatXML(str);
		var dom=portalWnd.objFactory.createInstance("DOM");
		dom.async=false;
		dom.loadXML(str);
		aboutText+=dom.xml;
	}
	else
		aboutText+=obj.getDataString(true);
	aboutText+="\n";

	document.getElementById("textWindow").value=aboutText
}

//-----------------------------------------------------------------------------
function showGlobalVars()
{
	var aboutText="Global variables:\n"+dashStr;
	aboutText+="AGSPath\t\t"+portalWnd.AGSPath+"\n"
	aboutText+="DMEPath\t\t"+portalWnd.DMEPath+"\n"
	aboutText+="IDAPath\t\t"+portalWnd.IDAPath+"\n"

	var obj=portalObj;
	aboutText+="\nPortal object\n"+dashStr;
	aboutText+="xsltSupport\t"+obj.xsltSupport+"\n"
	aboutText+="versionNumber\t"+obj.versionNumber+"\n"
	aboutText+="buildNumber\t"+obj.buildNumber+"\n"
	aboutText+="path\t\t"+obj.path+"\n"
	aboutText+="formsDir\t\t"+obj.formsDir+"\n"

	obj=portalObj.browser;
	aboutText+="\nBrowser object\n"+dashStr;
	aboutText+="isIE\t\t"+obj.isIE+"\n";
	aboutText+="isNS\t\t"+obj.isNS+"\n";
	aboutText+="isMAC\t\t"+obj.isMAC+"\n";
	aboutText+="isWIN\t\t"+obj.isIE+"\n";
	aboutText+="isXP\t\t"+obj.isXP+"\n";
	aboutText+="cookies\t\t"+obj.cookies+"\n";
	aboutText+="version\t\t"+obj.version+"\n";
	aboutText+="osVersion\t\t"+obj.osVersion+"\n";
	aboutText+="language\t\t"+obj.language+"\n";

	obj=portalWnd.objFactory;
	aboutText+="\nSSO Object factory\n"+dashStr;
	aboutText+="xmlVersion\t"+obj.xmlVersion+"\n"
	aboutText+="xmlDOMProgId\t"+obj.xmlDOMProgId+"\n"
	aboutText+="xmlHTTPProgId\t"+obj.xmlHTTPProgId+"\n"
	aboutText+="xmlFTDOMProgId\t"+obj.xmlFTDOMProgId+"\n"
	aboutText+="xmlXSLTProgId\t"+obj.xmlXSLTProgId+"\n"

	document.getElementById("textWindow").value=aboutText
}

//-----------------------------------------------------------------------------
function showSearchResults()
{
	var aboutText="Search variables:\n"+dashStr;
	var obj=portalObj;
	aboutText+="searchApi\t\t"+obj.searchApi+"\n"
	aboutText+="searchAction\t"+obj.searchAction+"\n"

	aboutText+="\nSearch XML doc\n"+dashStr;

	if (portalObj.searchDoc)
	{
		obj=portalObj.searchDoc;
		if (portalObj.xsltSupport)
		{
			// jump through hoops to get nice format ;-)
			var str=obj.xml;
			str=formatXML(str);
			var dom=portalWnd.objFactory.createInstance("DOM");
			dom.async=false;
			dom.loadXML(str);
			aboutText+=dom.xml;
		}
		else
			aboutText+=obj.getDataString(true);
	}
	aboutText+="\n";

	document.getElementById("textWindow").value=aboutText
}

//-----------------------------------------------------------------------------
function showHotkeys()
{
	var aboutText=""
	var obj=portalObj.keyMgr
	if (obj)
	{
		for (ds in obj.storage)
		{
			var set=obj.storage[ds]
			aboutText+="-------------------------------------------------------------------------------\n"
			var de = null;
			if (portalObj.xsltSupport)
			{
				de = set.document.documentElement
				aboutText += de.getAttribute("labelid")
			}
			else
			{
				de = new portalWnd.DataStorage(set.document.documentElement,portalWnd);
				aboutText += de.getAttributeById("labelid")
			}
			
			aboutText+=" ("+obj.paths[ds]+"):\n"
			aboutText+=padSpaces("Action",20) + padSpaces("Key Code",25) + 
					padSpaces("Description",20)+"\n"+dashStr;
			var keyNodes=null
			if (portalObj.xsltSupport)
				keyNodes=de.selectNodes("//EVENT")
			else
				keyNodes=de.document.getElementsByTagName("EVENT")
			for (var i = 0; i < keyNodes.length; i++)
			{
				aboutText+=padSpaces(keyNodes[i].getAttribute("action"),20)
				var keyStr=""
				if (keyNodes[i].getAttribute("ctrl") == "1")
					keyStr+="Ctrl+"
				if (keyNodes[i].getAttribute("alt") == "1")
					keyStr+="Alt+"
				if (keyNodes[i].getAttribute("shift") == "1")
					keyStr+="Shift+"
				var code=keyNodes[i].getAttribute("code")
				aboutText+=padSpaces(keyStr+obj.getKeyCodeString(code)+" ("+code+")",25)
				+padSpaces(keyNodes[i].getAttribute("labelid"),20)+"\n"
			}
			aboutText+="\n"
		}
	}
	document.getElementById("textWindow").value=aboutText
}

//-----------------------------------------------------------------------------
function showBookmarks()
{
	// display str
	var aboutText=""
	
	// analyze profile
	var profile=portalObj.profile
	var	objPortalUser=(profile ? profile.getElementsByTagName("PORTAL_USER") : null)
	objPortalUser=(objPortalUser ? objPortalUser[0] : null)
	
	// requested bookmarks
	var reqBookmarks=null
	var objReqBookmarks=(objPortalUser ? objPortalUser.getElementsByTagName("BOOKMARKS") : null)
	objReqBookmarks=(objReqBookmarks ? objReqBookmarks[0] : null)
	arr=(objReqBookmarks ? objReqBookmarks.getElementsByTagName("BOOKMARK") : null)
	len=(arr ? arr.length : 0)
	if (len)
	{
		reqBookmarks=new Array()
		for (var q=0; q < len; q++)
			reqBookmarks[q]=arr[q].getAttribute("key")
	}
	var lenReqBookmarks=(reqBookmarks ? reqBookmarks.length : 0)
			
	// provided bookmarks
	var provBookmarks=null
	var objBookmarks=(profile ? profile.getElementsByTagName("BOOKMARKS") : null)
	objBookmarks=(objBookmarks ? objBookmarks[0] : null)
	var arr=(objBookmarks ? objBookmarks.getElementsByTagName("BOOKMARK") : null)
	var len=(arr ? arr.length : 0)
	if (len)
	{
		provBookmarks=new Array()
		for (var p=0; p < len; p++)
			provBookmarks[p]=arr[p].getAttribute("key")
	}
	var lenProvBookmarks=(provBookmarks ? provBookmarks.length : 0)
		
	aboutText+="Bookmark Key    \tProvided\tNot Provided\n"+dashStr;

	var notBookmarks=new Array()
	var reqkey;
	for (var q=0; q < lenReqBookmarks; q++)
	{
		reqkey=reqBookmarks[q]
		var prov=false	
		for (var p=0; p < lenProvBookmarks && !prov; p++)
		{
			prov|=(reqkey==provBookmarks[p])
		}
		if (!prov)
			notBookmarks[notBookmarks.length]=reqkey
		aboutText+=reqkey + "\t" + (prov ? "X" : "") + "\t" + (prov ? "" : "X") + "\n"
	}
	var lenNotBookmarks=(notBookmarks ? notBookmarks.length : 0)
	aboutText+=dashStr;
	+"               \t"+(lenReqBookmarks-lenNotBookmarks)+"\t"+(lenNotBookmarks)+"\n"

	aboutText+="\n\nUnsubscribed Bookmark Keys\n"+dashStr;
	var len=(portalWnd.arrUnsub ? portalWnd.arrUnsub.length : 0)
	for (var i=0; i < len; i++)
		aboutText+=parseInt(portalWnd.arrUnsub[i],10)+"\n"
	aboutText += "\n";

	document.getElementById("textWindow").value=aboutText
}

//-----------------------------------------------------------------------------
function showSSOUser()
{
	var ssoText = "SSO User Details\n" + dashStr;

	// are we using SSO authentication?
	if (portalWnd.oPortalConfig.getSetting("use_sso_authentication","1") != "1")
	{
		ssoText+="Not using SSO authentication.\n";
		document.getElementById("textWindow").value=ssoText;
		return;
	}

	// get the user details
	var ssoDom = portalWnd.httpRequest("/sso/SSOServlet?_action=PING");
	var ds = (portalObj.xsltSupport
		? new portalWnd.DataStorage(ssoDom.xml,portalWnd)
		: portalWnd.DataStorage(ssoDom,portalWnd));
	ssoText += ds.getDataString();
	ssoText += "\n";

	// black box info
	var authObj = new portalWnd.SSOAuthObject();
	ssoText += "Authenticated Blackboxes: " + authObj.bBoxAry.length + "\n";
	ssoText += dashStr;
	for (var i=0; i < authObj.bBoxAry.length; i++)
		ssoText += "\tService Name: " + authObj.bBoxAry[i] + "\n";

	ssoText+="\nSSO Auth Obj Info\n"+dashStr;

	// get auth object member variables and config DOM
	var ssoAuthObj = new portalWnd.SSOAuthObject();
	ssoText+="configUrl\t\t"+ssoAuthObj.configUrl+"\n";
	ssoText+="logoutUrl\t\t"+ssoAuthObj.logoutUrl+"\n";
	ssoText+="primaryUrl\t"+ssoAuthObj.primaryUrl+"\n";
	ssoText+="HTTPUrl\t\t"+ssoAuthObj.HTTPUrl+"\n";
	ssoText+="timeoutVal\t"+ssoAuthObj.timeoutVal+"\n";
	ssoText+="isPrimary\t\t"+ssoAuthObj.isPrimary+"\n";
	ssoText+="canChgPwd\t\t"+ssoAuthObj.canChgPwd+"\n";
	ssoText+="language\t\t"+ssoAuthObj.language+"\n";

	// msxml version supported
	var ssoObjFactory = new portalWnd.SSOObjectFactory("6");
	ssoText += "\nMSXML Version: " + ssoObjFactory.getMSXMLVersion() + "\n";
	ssoText += dashStr;
	
	// config dom info
	ssoText+="\nSSO Config DOM\n"+dashStr;

	if (portalObj.xsltSupport)
	{
		ssoText+=ssoAuthObj.configDom.xml;
	}
	else
	{
		var configDomDS = new portalWnd.DataStorage(ssoAuthObj.configDom, portalWnd);
		ssoText += configDomDS.getDataString();
	}

	// get version info
	ssoText += "\nSSO Versions: \n";
	ssoText+="Servlet\t\tVersion\n"+dashStr;

	try {
		var api="/servlet/What?_CLASS="+
			"com.lawson.lawsec.authen.LawsonWebAuthentication;" +
			"com.lawson.lawsec.authen.SSOConfig;" +
			"com.lawson.lawsec.authen.SSOManager;" +
			"com.lawson.lawsec.authen.SSOServlet;"

		var oXML=portalWnd.httpRequest(api,null,"","text/xml",false)
		if (!oXML || oXML.status)
			ssoText+="\n\nError retrieving servlet/What info.\n"
		else
		{
			var iPos=0;
			var items=oXML.getElementsByTagName("CLASS")
			for (var i = 0; i < items.length; i++)
			{
				var name=items[i].getAttribute("name")
				iPos=name.indexOf("authen");
				if (iPos == -1) continue
				name=name.substr(iPos+7);
				ssoText+=name
				var verText="";
				try {
					var whatNode=items[i].getElementsByTagName("WHATSTR");
					whatNode = (whatNode && whatNode.length ? whatNode[0] : null);
					verText=portalWnd.cmnGetNodeCDataValue(whatNode);
					var iPos=verText.indexOf("java,v")
					if (iPos!=-1)
						verText=verText.substr(iPos+7)

					if (name.length > 20 ) ssoText+=" "
					if (name.length < 16 ) ssoText+="\t"
					if (name.length < 10 ) ssoText+="\t"
					ssoText+=verText
					if (verText.substr(verText.length-1)!="\n") ssoText+="\n"
					
				} catch (e) { 
					if (name.length < 16 ) ssoText+="\t"
					if (name.length < 11 ) ssoText+="\t"
					ssoText+="unknown\n";
				}

			}
		}
	} catch (e) { 
		ssoText+="\n\nError retrieving servlet/What info.\n"
	}

	document.getElementById("textWindow").value = ssoText;

}

//-----------------------------------------------------------------------------
function switchView(view)
{
	try {
		// a browser 'back' can be a problem!
		var btn=document.getElementById(lastView);
		btn.className="anchorActive";

		var btn=document.getElementById(view);
		btn.className="anchorHover";
		lastView=view;

		switch(view)
		{
		case "Profile":
			showUserProfile();
			break;
		case "Hotkeys":
			showHotkeys();
			break;
		case "Search":
			showSearchResults();
			break;
		case "PortalConfig":
			showPortalConfig();
			break;
		case "GlobalVars":
			showGlobalVars();
			break;
		case "Versions":
			showPortalVersion();
			break;
		case "Bookmarks":
			showBookmarks();
			break;
		case "ssoUser":
			showSSOUser();
			break;
		}
		document.getElementById("textWindow").focus()

	} catch (e) { }
}
