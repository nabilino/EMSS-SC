/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/portal.js,v 1.72.2.91.4.105.6.25.2.37.2.7 2013/09/11 04:41:08 jquito Exp $ */
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

var PORTALJS="portal.js"		// filename constant for error handler 

//-----------------------------------------------------------------------------
// portal onload handler
function portalOnLoad()
{
	try {
		var ssoAuthObj = new SSOAuthObject();	// get singleton SSOAuthObject
		ssoAuthObj.turnSSOOff();
		ssoAuthObj.logout = portalLogout;

	} catch (e) {
		displayErrorPage(window);
		return;
	}
	//check-in test using VM
	// domain set to true in servenv.js if not IE browser trying to use document.domain
	if (bDomain)
		alert("Cross Domain Error: Cross domain is not supported by this browser.");
		
	if (navigator.appName.indexOf("Microsoft") >= 0)
	{
		objFactory = new SSOObjectFactory("6");	// get singlton SSOObjectFactory
		portalWnd = window;						// save portal window reference
		oBrowser = new SSOBrowser();			// reference browser object (singleton)
		oVersions = new ValueStorage();			// storage for versions
		oError = new ErrorObject(portalWnd);	// error handling object
		cmnDlg = new CommonDialog(portalWnd);	// common dialogs

		// get portal configuration file
		oPortalConfig = new PortalConfig(window);
		if (!oPortalConfig.initialized)
		{
			var msg="The Portal cannot load because it was unable to load the " +
				"global configuration file.%nSystem Administrator: please " +
				"verify that file 'portalconfig.xml' exists.";
			displayErrorPage(window,msg);
			return;
		}

		nbrTimesToLoad = 5;
			
		// load any configured script files
		oPortalConfig.loadScripts();

		// turn SSO authentication on?
		if (oPortalConfig.getSetting("use_sso_authentication","1") == "1")
			ssoAuthObj.turnSSOOn();

		// give the scripts some time to finish loading
		setTimeout("portalFinishLoad()",500);
	}
	else
	{
		var appname = navigator.appName;
			var msg = "The Lawson Portal does not support this browser: " + appname + ".%n";
			msg += "Use the Portal Installation Guide to determine the system requirements needed for running the Lawson Portal."
		displayErrorPage(window, msg);
		return;
	}
}
//-----------------------------------------------------------------------------
function portalFinishLoad()
{
	// instantiate other global objects
	var serviceName = oPortalConfig.getServiceName("userprofile");
	if (serviceName.toLowerCase() == "iosprofile" && !fileMgr)
	{
		try {
			fileMgr = new FileManager(portalWnd);
		} catch(e) {}
		var msg="Please wait - Portal is initializing...";
		nbrTimesToLoad--;
				
		if (!fileMgr)
		{
			if (nbrTimesToLoad < 1)
			{
				window.status = "";
				var msg="The Portal cannot load because it is unable to instantiate a global File Manager Object." +
						"%nSystem Administrator: please verify that portalconfig " +
						"setting 'secs_to_load' is set appropriately."; 
				displayErrorPage(window,msg);
				return;
			}
			else
			{
				var delay = (parseInt(oPortalConfig.getSetting("secs_to_load","10"),10)*1000);
				setTimeout("portalFinishLoad()",delay)
				window.status = msg;
				return;
			}
		}
	}		

	lawsonPortal = new lawPortalObj(portalWnd);
	
	document.body.style.display = "block";

	if (oPortalConfig.getSetting("use_sso_authentication","1") == "1")
	{
		// validate fully qualified URL
		if (!isValidPortalURL()) return;
	}

	// enable debug window?
	var strDebug=getVarFromString("debug",document.location.search);
	if (strDebug && strDebug.toLowerCase() == "true"
	&& oPortalConfig.getSetting("allow_trace","0") == "1")
	{
		if (!loadDebugger())
			alert("Error Loading Trace Utility.")
		lawTraceMsg("Lawson portalFinishLoad()");
	}

	// IE version 6+ is required
	if (oBrowser.isIE && oBrowser.version < 6)
	{
		// but can be overriden in config file
		if (oPortalConfig.getSetting("override_browser_check","1") == "1")
		{	
			//override browser check
			lawTraceMsg( "***** W A R N I N G ***** using an unsupported browser");
		}
		else
		{
			var appname = navigator.appName;
			var msg = "The Lawson Portal does not support this version of " + appname + ".%n";
			msg += "Use the Portal Installation Guide to determine the system requirements needed for running the Lawson Portal."
			displayErrorPage(window,msg);
			return;
		}
	}	
				
	// in preview mode?
	lawsonPortal.previewMode = (document.location.search.indexOf("PREVIEW") != -1) ? true : false;
	if (lawsonPortal.previewMode)
	{
		if (!window.opener)
		{
			var msg="The Portal cannot load because a request for Preview mode " +
				"not initiated by Design Studio was detected.%nPlease " +
				"verify the Portal open request or URL is valid.";
			displayErrorPage(window,msg);
			return;
		}
		if (!window.opener.profileObj)
		{
			// make profile call and check return status
			var iosURL=portalWnd.oPortalConfig.getServiceURL("userprofile");
			if (!iosURL)
			{
				portalWnd.displayErrorPage(portalWnd, "The Portal cannot load because the " +
						"IOS Profile service URL is not specified in portalconfig.xml.");
				return;
			}
			if (iosURL.indexOf("?_PATH=") == iosURL.length-7 )
				iosURL += (lawsonPortal.path + "&_NOCACHE=" + (new Date().getTime()));
			var tmp2 = httpRequest(iosURL,null,"","text/xml",false);
			if (tmp2 == null)
			{
				portalWnd.displayErrorPage(portalWnd, "The Portal cannot load because the " +
						"Profile service returned an invalid xml response.");
				return;
			}

			if (tmp2.status)
			{
				cmnDlg.messageBox(portalWnd.oError.getHttpStatusMsg(tmp2.status),"ok","stop",window);
				return;
			}
			var tmp3=new DataStorage(tmp2)
			try {
				window.opener.profileObj = tmp3.getDataString();
			} catch(e) {
				cmnDlg.messageBox(msgDOMAIN,"ok","stop",window);
				window.close();
				return;
			}
		}
		var tmp=new DataStorage(window.opener.profileObj)
		lawsonPortal.profile=tmp.document
		lawPortalFinishInitialization("previewmode");
	}
	else
	{
		lawsonPortal.contentFrame.style.visibility="visible";
		sizePortalStuff();
		if (oPortalConfig.getSetting("use_sso_authentication","1") == "1")
			portalGoLoginDoneTarget("logondone.htm");
		else
		{
			// PSA local web server without log in
			lawsonPortal.contentFrame.src = "logondone.htm";
		}
	}
}
//-----------------------------------------------------------------------------
function isValidPortalURL()
{
	var msg="";
	var authObj = null;

	// see if the SSO authentication object is initialized
	try {
		authObj = new SSOAuthObject();	// get singleton auth object
	} catch (e) { }
	if (!authObj)
	{
		// display the 'default' message: check servlet container.
		displayErrorPage(window);
		return false;
	}
	if (authObj.getConfigDom() == null)
	{
		// error in initialization
		msg = "The Portal cannot load because of an intialization error in the single sign-on component.";
		msg += "%nThe following servlet call is encountering an exception: "+authObj.configUrl+".";
		displayErrorPage(window,msg);
		return false;
	}

	// if relyingSvcURL is not null, this is not primary service, skip the check
	if (authObj.getRelyingSvcURL()!= null)
		return true;
		
	if (authObj.isPrimaryBox())
		return true;

	msg = "The Single Sign-On service did not recognize '";
	msg += document.location.href;
	msg += "' as an endpoint\nfor which it should handle authentication.";
	msg += " You will be redirected to an endpoint known to Single Sign-On service."
	alert(msg)

	var locObj = new URLObject(document.location.href);
	if (locObj.getHost() == null)
	{
		// error parsing current location (should never happen)
		displayErrorPage(window,"The Portal cannot load because of an error parsing current location." +
			"%nPlease run Portal with a fully qualified server and domain path.");
		return false;
	}
	var idx = locObj.url.indexOf(locObj.getHost()) + locObj.getHost().length;
	var portalPath = locObj.url.substring(idx);

	// authObj.getHTTPUrl() will return a blank string if it cannot find it
	var urlObj = new URLObject(authObj.getHTTPUrl());
	if (urlObj.getProtocol() == null || urlObj.getHost() == null)
	{
		// error getting http url or parsing http url
		displayErrorPage(window,"The Portal cannot load because of an error parsing current location." +
			"%nPlease run Portal with a fully qualified server and domain path.");
		return false;
	}
	// redirect to portalUrl
	var portalUrl = urlObj.getProtocol() + "//" + urlObj.getHost() + portalPath;
	window.location.href=portalUrl;
	return false;
}
//-----------------------------------------------------------------------------
// method called by studio if portal preview window already up
function loadPreviewContent()
{
	if (!lawsonPortal)
	{
		window.focus();
		return;
	}

	lawsonPortal.preview=window.opener.oPreview;
	if (oPortalConfig.getSetting("use_sso_authentication","1") == "1")
		portalGoLoginDoneTarget(lawsonPortal.preview.URL);
	else
		lawsonPortal.contentFrame.src=lawsonPortal.preview.URL;
}
//-----------------------------------------------------------------------------
function portalGoLoginDoneTarget(loginDoneTarget)
{
	var src = null;
	try {
		var ssoAuthObj = new SSOAuthObject();	// get singleton auth object
		src=ssoAuthObj.getRelyingSvcURL();
		if (src == null)
			src=ssoAuthObj.getPrimaryUrl();
		if (src)
			src+="?_ssoOrigUrl="+getFullUrl(loginDoneTarget);
	} catch (e) { }
	if (src != null)
		lawsonPortal.contentFrame.src=src;
	else
		displayErrorPage(window,"The Portal cannot load because it was unable to " +
			"establish communication with the primary security server.%n" +
			"System Administrator: please verify the lsserver is running properly.");
}
//-----------------------------------------------------------------------------
function portalUnload()
{
	try {
		// close any of our referenced windows
		if (aboutWnd && !aboutWnd.closed)
			aboutWnd.close()
		if (helpWnd && !helpWnd.closed)
			helpWnd.close()
		if (hotkeyWnd && !hotkeyWnd.closed)
			hotkeyWnd.close()
		if (srchWnd && !srchWnd.closed)
			srchWnd.close()
		printMgr.closePrintWnd();
	} catch (e) { }

	// in portal-less mode, don't attemp to save preferences
	// and can't save preferences without FileMgr
	if ((oPortalConfig && oPortalConfig.isPortalLessMode())
	|| fileMgr == null)
	{
		lawsonPortal=null;
		return;
	}

	try {
		// save navbar width?
		var nSaveNavState=0;
		if (oUserProfile.getPreference("leftbarstate","0")=="2")
		{
			nSaveNavState=1;
			var leftBar=document.getElementById("leftLinks");
			var width=leftBar.style.width;
			oUserProfile.setPreference("leftbarwidth",width);
			// will be saved below (setPreference sets modified state)
		}

		// save home tab navlet states?
		if (oUserProfile.getPreference("autonavlet","0")=="2")
		{
			var oTab = lawsonPortal.tabArea.tabs["HOME"]
			if (oTab)
			{
				oUserProfile.clearNavletState();
				for (var navObj in oTab.navletObjects)
				{
					if (oTab.navletObjects[navObj] == null)
						continue;
					nSaveNavState=1;
					var oNavlet=oTab.navletObjects[navObj]
					var state=(oNavlet.itemContainer.style.visibility=="hidden" ? "0" : "1");
					oUserProfile.setNavletState(navObj,state);
					// will be saved below (setNavletState sets modified state)
				}
			}
		}

		// indicate saving updates to user profile if timed out
		var doSave="no"; //do not autosave. See LSF-1932
		
		if (oPortalConfig.getSetting("use_sso_authentication","1") == "1"
		&& lawsonPortal && oUserProfile.getModified() && !oUserProfile.hasRequiredAttributes())
		{
			var msg = lawsonPortal.getPhrase("LBL_PORTAL_UNLOADING") + "\n\n";
			msg += (nSaveNavState == 0
				? lawsonPortal.getPhrase("LBL_SAVING_UPDATES")
				: lawsonPortal.getPhrase("LBL_SAVING_UPDATES2"));
			msg += ("\n" + lawsonPortal.getPhrase("LBL_SAVE_SETTINGS") + "\n\n");
			doSave=cmnDlg.messageBox(msg, "yesno", "question", window);
		}

		// save user preferences? LSF-4196 - if profile has required attributes, autosave
		if (doSave == "yes" || oUserProfile.hasRequiredAttributes())
		{
			if (lawsonPortal && oUserProfile.getModified())
				oUserProfile.save();
		}
		else
		{
			oUserProfile.setModified(false); //if user doesn't want to save, cascade to other objects. 
		}
		lawsonPortal=null;

	} catch(e) { }
}
//-----------------------------------------------------------------------------
function portalIsUserSSOActive(bPrompt)
{
	try {
		// method returns true or false to indicate whether user is
		// authenticated.  any caller of this method that recives a false
		// return value should call the portalLogout function and exit

		// probably making the call for portalconfig.xml
		if (!oPortalConfig)
			return true;

		if (oPortalConfig.getSetting("use_sso_authentication","1") != "1")
			return true;

		// validate optional paramater
		bPrompt = (typeof(bPrompt) == "boolean" ? bPrompt : false);
		// 'turn off' the Logout function
		bInSSOCheck=true;
		// get singleton auth object
		var ssoAuthObj = new portalWnd.SSOAuthObject();
		var bRetVal = false;
		if (ssoAuthObj.getRelyingSvcURL() != null)
			bRetVal = ssoAuthObj.ping(true);
		else
			// if bPrompt=true, call login else ping with true to reset timeout
			bRetVal = ( bPrompt ? ssoAuthObj.login() : ssoAuthObj.ping(true) );
		// re-enable the Logout method
		bInSSOCheck=false;
		return bRetVal;

	} catch (e) { }
	return false;
}
//-----------------------------------------------------------------------------
function portalLogout()
{
	var srcRelyingSvcURL = null;
	var urlObj = null;
	try {
		// this flag set only while 'portalIsUserSSOActive' is running;
		// caller of that method should respond to 'false' return
		// by calling portalLogout
		if (bInSSOCheck) return;

		var portalIndex = portalWnd.getFullUrl(lawsonPortal.path+"/index.htm");
		var ssoAuthObj = new portalWnd.SSOAuthObject();	// get singleton auth object
		srcRelyingSvcURL = ssoAuthObj.getRelyingSvcURL();
		if (srcRelyingSvcURL == null)
        	urlObj = new URLObject(ssoAuthObj.getPrimaryUrl());
		if (srcRelyingSvcURL)
			urlObj = new URLObject(srcRelyingSvcURL);

		window.location.replace(urlObj.getProtocol() + "//" + urlObj.getHost() + ssoAuthObj.logoutUrl + "?" + escape(portalIndex));

	} catch (e) {
		oError.displayExceptionMessage(e,PORTALJS,"portalLogout");
	}
}
//-----------------------------------------------------------------------------
function httpRequest(url, pkg, cntType, outType, bShowErrors)
{
	// validate user is active in SSO; only for servlet/cgi calls
	if (url.match(servRE) && !portalIsUserSSOActive(true))
	{
		portalLogout();
		return;
	}

	return SSORequest(url, pkg, cntType, outType, bShowErrors);
}
//-----------------------------------------------------------------------------
function loadDebugger()
{
	try {
		cmnLoadScript("file",lawsonPortal.path+"/lawtrace.js",portalWnd);
		lawTrace.on=true;
		lawTrace.dump("Debug Window Started.");
		lawTraceFunction("window","httpRequest");
		lawTraceObject("window","RequestObject");
		return true;

	} catch(e) {
		try {
			lawTrace.on=false;
			lawTrace.close();
		} catch (e)	{}
		return false;
	}
}
//-----------------------------------------------------------------------------
function lawTraceMsg(msg, data)
{
	try {
		if(typeof(lawTrace)=="object")
		{
			msg="MSG (" + getCurrentTimeString() + ") : " +msg;
			lawTrace.dump(msg,data);
		}
	} catch(e) { }
}
//-----------------------------------------------------------------------------
function sizePortalStuff()
{
	if (lawsonPortal == null) { portalOnLoad(); return;}
	var doc = portalWnd.document;
	var scrWidth = (oBrowser.isIE ? doc.body.offsetWidth : portalWnd.innerWidth);
	var scrHeight = (oBrowser.isIE ? doc.body.offsetHeight : portalWnd.innerHeight);

	if (scrWidth < 157) return;
	if (scrHeight < 170) return;

	var topDiv = doc.getElementById("topDivider");
	var splitBar = doc.getElementById("splitBar");
	var leftBar = doc.getElementById("leftLinks");
	var contentFrame = doc.getElementById("content");
	var drill = doc.getElementById("drlContainer");
	var drillFrame = doc.getElementById("drill");

	var toolbar = doc.getElementById("lawtoolbar");
	var leftGrip = doc.getElementById("leftGrip");
	var rightGrip = doc.getElementById("rightGrip");
	var leftTabs = doc.getElementById("divLeftTabs");
	var leftPaneContainer = doc.getElementById("divLeftPanes");

	var hgt = scrHeight - leftBar.offsetTop;
	if (hgt < 0) return;

	var tabHeight = leftTabs.offsetHeight;
	var shadowOffset = 2;

	splitBar.style.height = hgt - tabHeight - shadowOffset;
	splitBar.style.top = leftBar.offsetTop + tabHeight + shadowOffset;
	splitBar.style.left = leftBar.offsetWidth;

	contentFrame.style.left = (splitBar.style.visibility == "visible")
			? splitBar.offsetLeft + splitBar.offsetWidth
			: 0;

	var width = scrWidth - contentFrame.offsetLeft;
	if (width < 4) return;

	var height = scrHeight - contentFrame.offsetTop;
	if (height < 4) return;

	contentFrame.style.width = (oBrowser.isIE) ? width - 4 : width;
	contentFrame.style.height = (oBrowser.isIE) ? height - 4 : height;

	leftBar.style.height = hgt;

	toolbar.style.width = contentFrame.style.width;
	toolbar.style.left = contentFrame.style.left;
	toolbar.style.top = topDiv.offsetTop + topDiv.offsetHeight + 2;
	toolbar.style.zIndex = "20";

	// reposition the grippers
	var gripHeight = (rightGrip.offsetHeight > 0)
			? rightGrip.offsetHeight
			: leftGrip.offsetHeight;
	var gripCenter = (parseInt(contentFrame.offsetHeight) + 2 * gripHeight) / 2;
	leftGrip.style.top = gripCenter;
	rightGrip.style.top = gripCenter;
	leftGrip.style.left = leftBar.offsetWidth;
	rightGrip.style.left = leftBar.offsetWidth;

	lawsonPortal.toolbar.resize();

	contentFrame.style.top = toolbar.offsetTop + toolbar.offsetHeight + 2;

	drillFrame.style.width = contentFrame.style.width;
	drillFrame.style.height = contentFrame.style.height;
	drill.style.top = contentFrame.style.top;
	drill.style.left = contentFrame.style.left;

	// adjustment for scroll bar
	var adjHeight = (oBrowser.isIE) ? 15 : 11;
	leftPaneContainer.style.height = hgt - leftBar.offsetTop + leftPaneContainer.offsetTop - adjHeight;

	if (splitBar.style.visibility == "visible")
		sizeTabArea();
	else
		leftBar.style.width = 0;

	doc.getElementById("content").style.visibility = "visible";
	doc.body.style.visibility = "visible";
}
//-----------------------------------------------------------------------------
function setInitialFocus()
{
	try {
		// The objective here is to make the search text one tab
		// key away when the we are loaded. The trick below works
		// well for IE and while it doesn't exactly do what we want
		// in Netscape -- it doesn't select anything -- it avoids
		// the problem where Netscape put the focus in an arbitrary
		// spot.  [dko 8/28/03]
		var mElement = portalWnd.document.getElementById("findText");
		if (mElement)
		{
			mElement.focus();
			//mElement.blur(); PT  178867
		}
	} catch(e) {}
}
//-----------------------------------------------------------------------------
function sizeTabArea()
{
	var leftPaneContainer=portalWnd.document.getElementById("divLeftPanes")
	var len=leftPaneContainer.childNodes.length;
	for (var i=0; i < len ; i++)
	{
		if (leftPaneContainer.childNodes[i].nodeType!=1)
			continue;
		var leftPane=leftPaneContainer.childNodes[i]
		leftPane.style.height=leftPaneContainer.offsetHeight;
		leftPane.style.width=leftPaneContainer.offsetWidth;
	}
}
//-----------------------------------------------------------------------------
function formUnload(bLeavePageTab)
{
	bLeavePageTab = (typeof(bLeavePageTab)!="boolean" ? false : bLeavePageTab);
	try {
		if (!bLeavePageTab)
		{
			// if the menu tab has content and the home tab is not active, show menu tab
			if (lawsonPortal.tabArea.tabs["MENU"].htmlTab.parentNode.style.visibility=="visible"
			&& lawsonPortal.tabArea.getActivePaneName() != "HOME")
				lawsonPortal.tabArea.tabs["MENU"].show();
			else
				lawsonPortal.tabArea.tabs["HOME"].show();
			lawsonPortal.tabArea.tabs["PAGE"].hide();
		}
		lawsonPortal.toolbar.clear()
		lawsonPortal.setTitle("")
		lawsonPortal.setMessage("")
		lawsonPortal.tabArea.tabs["PAGE"].clearNavlets()

		lawsonPortal.drill.drillContainer.style.visibility="hidden"
		lawsonPortal.drill.drillContainer.style.display="none"
		lawsonPortal.drill.drillContainer.src=lawsonPortal.path+"/blank.htm"
		lawsonPortal.helpOptions.clearItems()
	} catch(e) {
		//portal is being unloaded
	}
}
//-----------------------------------------------------------------------------
function processMessageString(str)
{
	// test for phrase ids
	var re = new RegExp("\&\&(.*?)\&\&","")
	while(str.match(re))
		str=str.replace(re,lawsonPortal.getPhrase(RegExp.$1))

	// test for attribute names
	re = new RegExp("<<(.*?)>>","")
	while(str.match(re))
	{
		var attName=RegExp.$1;
		attName=attName.toLowerCase();		// attribute name are LC
		var attValue=(attName == "productline"
			? oUserProfile.getAttribute(attName,true,"persistUserPDL")
			: oUserProfile.getAttribute(attName));
		str=str.replace(re,attValue);
	}
	return str
}
//-----------------------------------------------------------------------------
function pageTransfer(file)
{
	switchContents("pages/?FILE=" + file)
}
//-----------------------------------------------------------------------------
function processURLString(strURL,bNewWin)
{
	if (typeof(bNewWin) != "boolean")
		bNewWin=false;

	var frmRE=/^LAWFORM\|/i
	var pgeRE=/^LAWPAGE\|/i
	var ssoRE=/^SSO\|/i
	var dmeRE=/dme\.exe\?/
	var rssRE=/^http\:\/\/news\.xsl\@/

	// ERP form ---------------------------------------------------------------
	if (frmRE.test(strURL))
	{
		var tkn=getParmFromString("TKN",strURL);
		var id=getParmFromString("ID",strURL);
		var pdl=getParmFromString("PDL",strURL);
		var cust=getParmFromString("CUST",strURL);
		if (pdl=="")
			pdl=oUserProfile.getAttribute("productline",true,"persistUserPDL");
		if (!pdl)
		{
			// must have product line to load form
			strURL=lawsonPortal.path+"/blank.htm"
			return strURL
		}
        if (urlMenuRE.test(strURL))
	    {
			strURL = (lawsonPortal.path+"/forms/menuhost.htm?_TKN="+tkn+"&_PDL="+pdl);
	    }
        else
        {
		    if (!bNewWin)
			    strURL = frmBuildXpressCall(tkn, pdl, "notmodal", "", id, cust, null, null);
		    else
			    strURL = (lawsonPortal.path+"/index.htm?_URL="+strURL);
        }
	}

	// portal page ------------------------------------------------------------
	else if (pgeRE.test(strURL))
	{
		var file=getParmFromString("FILE",strURL);
		if (!bNewWin)
			strURL = ("pages/?FILE=" + file);
		else
			strURL = (lawsonPortal.path+"/index.htm?_URL="+strURL);
	}

	// black/grey box: ie. PSAStandalone --------------------------------------
	else if(ssoRE.test(strURL))
	{
		// parse url
		var urlAry = strURL.split("|");
		var svcName = null;
		var bgURL="";
		for (var i=0; i<urlAry.length; i++)
		{
			if (urlAry[i].substring(0,4) == "URL=")
				bgURL = urlAry[i].substring(4);
			else if (urlAry[i].substring(0,12) == "SERVICENAME=")
				svcName = urlAry[i].substring(12);
		}
		if (bgURL == "")
			strURL = "";
		else
		{
			var bgBox = new BBoxObject(bgURL, svcName);
			if (!bgBox.isLoggedIn())
				strURL = ("sso.htm?"+strURL);
			else
				strURL = bgURL;
		}
	}

	// dme request ------------------------------------------------------------
	else if(dmeRE.test(strURL))
	{
		result=dmeRE.exec(strURL);
		strURL = ("content.htm?_TYPE=DME&_URL=" +
				strURL.substring(result.index+8,strURL.length));
	}

	// rss request ------------------------------------------------------------
	else if(rssRE.test(strURL))
	{
		result=rssRE.exec(strURL);
		strURL = ("content.htm?_TYPE=RSS&_URL=" +
				strURL.substring(16,strURL.length));
	}

	// perform token substitution
	strURL=processMessageString(strURL)

	// redirect if empty or recursive
	if ((strURL.length==0) || strURL.substring(0,1)=="?")
		strURL=lawsonPortal.path+"/blank.htm"

	// for psa make url unique to prevent cache
	var psaServer=oUserProfile.getAttribute("psaserv")
	if (psaServer && psaServer.length > 0
	&& strURL.toLowerCase().indexOf(psaServer) != -1)
	{
		// make url unique
		var mDate=new Date()
		strURL+="&" + mDate.valueOf()
	}
	return strURL
}
//-----------------------------------------------------------------------------
function processURLMenu(strURL)
{
	var retVal=false;
	if (strURL && strURL.match(urlMenuRE))
	{
		var mnu=RegExp.$1
		var pdl = getVarFromString("_PDL",strURL)
		if (pdl)
		{
			buildMenu(mnu, pdl)
			retVal=true;
		}
	}
	return retVal;
}
//-----------------------------------------------------------------------------
function switchContents(URL)
{
	window.status="";		// clear any leftover message

	URL=URL.replace(/\&amp\;/gi,"&")
	if (URL != lawsonPortal.contentFrame.src)
		lawsonPortal.backURL=lawsonPortal.contentFrame.src
	if (lawsonPortal.backURL.indexOf("SSOServlet") != -1)
		lawsonPortal.backURL=getHome();

	lawsonPortal.contentFrame.style.visibility="visible"
	lawsonPortal.drill.drillContainer.style.visibility="hidden"
	lawsonPortal.drill.drillContainer.src=lawsonPortal.path+"/blank.htm"
	lawsonPortal.drill.mode="";

	var saveURL=URL
	// URL has to be token parsed
	URL=processURLString(URL)
	if (processURLMenu(URL))
		return

	// could parse it to a valid URL?
	if (URL == lawsonPortal.path+"/blank.htm")
	{
		var msg=lawsonPortal.getPhrase("LBL_URL_PARSE_ERROR")+"\n";
		msg += (saveURL.length < 100
			? saveURL
			: saveURL.substr(0,100)+"\n"+saveURL.substr(100));
		cmnDlg.messageBox(msg,"ok","stop",window);
	}

	// only ERP forms supported in PL mode
	if (oPortalConfig.isPortalLessMode())
	{
	 	if(!isSupportedPortalLess(URL))
		{
			var msg=lawsonPortal.getPhrase("msgErrorURLNotSupported")+": "+URL+"\n";
			if (lawsonPortal.backURL == getHome())
				displayErrorPage(window,msg);
			else
			{
				cmnDlg.messageBox(msg,"ok","stop",window);
				goBack();
			}
			return;
		}
	}

	if (!oBrowser.isIE && URL==lawsonPortal.contentFrame.src)
		lawsonPortal.contentFrame.src=lawsonPortal.path+"/blank.htm"
	lawsonPortal.contentFrame.src=URL

	if (oPortalConfig.isPortalLessMode())
		sizePortalStuff();
}
//-----------------------------------------------------------------------------
function isSupportedPortalLess(URL)
{
	if (URL.indexOf(lawsonPortal.formsDir + "/formhost.htm") != -1)
		return true;
			
	if (URL.indexOf("servlet/Xpress") != -1)
		return true;
		
	if (URL.indexOf("users/preferences") != -1)
		return true;

	if (URL.indexOf("reports/joblist.htm") != -1)
	{
		return (portalWnd.oPortalConfig.getRoleOptionValue("allow_joblist","0")== "1" ? true : false);
	}

	if (URL.indexOf("reports/jobschedule.htm") != -1)
	{
		return (portalWnd.oPortalConfig.getRoleOptionValue("allow_jobschedule","0")== "1" ? true : false);
	}
		
	if (URL.indexOf("reports/printfiles.htm") != -1)
	{
		return (portalWnd.oPortalConfig.getRoleOptionValue("allow_printfiles","0")== "1" ? true : false);
	}

	if (URL.indexOf("reports/jobdef.htm") != -1)
	{
		return (portalWnd.oPortalConfig.getRoleOptionValue("allow_jobdef","0")== "1" ? true : false);
	}
	
	if (URL.indexOf("reports/viewjobs.htm") != -1)
		return true;
		
	if (URL.indexOf("pages/?") != -1)
		return true;
	
	return false;
}
//-----------------------------------------------------------------------------
function openWindow(URL,ht,wd)
{
	URL=processURLString(URL,true)
	if(processURLMenu(URL))
		return
	var height = (typeof(ht) == "undefined" ? null : ht);
	var width = (typeof(wd) == "undefined" ? null : wd);
	var wnd = (!height || !width
		? portalWnd.open(URL)
		: portalWnd.open(URL, null, "height=" + (height ? height : "200")
			+ ",width=" + (width ? width : "400") + ",status=no,resizable=yes"));

	try{
		wnd.focus();
	}catch(e){}
}
//-----------------------------------------------------------------------------
function openBookmarkWindow(key, URL)
{
	URL=processURLString(URL,true);
	if(processURLMenu(URL))
		return;

	var arrParams = bookmarkNewWinParams(key);
	var params = "height=" + (arrParams.height ? arrParams.height : "200")
		+ ",width=" + (arrParams.width ? arrParams.width : "400")
		+ ",status=" + (arrParams.status ? "yes" : "no")
		+ ",menubar=" + (arrParams.menubar ? "yes" : "no")
		+ ",directories=" + (arrParams.directorybar ? "yes" : "no")
		+ ",location=" + (arrParams.locationbar ? "yes" : "no")
		+ ",scrollbars=yes"
		+ ",resizable=yes"
		+ ",toolbar=" + (arrParams.toolbar ? "yes" : "no");

	var wnd=portalWnd.open(URL, key, params);

	try{
		wnd.focus();
	}catch(e){}
}
//-----------------------------------------------------------------------------
function bookmarkNewWinParams(key)
{
	var arrParams = new Object();
	var fields = new DMEFields("WIN-WIDTH","WIN-HEIGHT","MENUBAR","TOOLBAR","DIRECTORYBAR","LOCATIONBAR","STATUSBAR");
	var query = "PROD=LOGAN"
		+ "&FILE=LOBKMARK"
		+ "&FIELD=" + fields.toString()
		+ "&INDEX=LOBSET1"
		+ "&KEY=" + key
		+ "&MAX=1"
		+ "&XCOLS=TRUE&XKEYS=FALSE&XRELS=FALSE&XIDA=FALSE&XNEXT=FALSE"
		+ "&OUT=XML";

	try	{
		var dmeRequest = new DMERequest(window, query);
		var res = dmeRequest.getResponse(true);
		if (res.isValid() && (res.res != null))
		{
			var j = 0;
			j = fields.pos("WIN-WIDTH");
			arrParams.width = parseInt(res.getRecordValue(0,j),10);
			j = fields.pos("WIN-HEIGHT");
			arrParams.height = parseInt(res.getRecordValue(0,j),10);
			j = fields.pos("MENUBAR");
			arrParams.menubar = (res.getRecordValue(0,j)=="Y");
			j = fields.pos("TOOLBAR");
			arrParams.toolbar = (res.getRecordValue(0,j)=="Y");
			j = fields.pos("DIRECTORYBAR");
			arrParams.directorybar = (res.getRecordValue(0,j)=="Y");
			j = fields.pos("LOCATIONBAR");
			arrParams.locationbar = (res.getRecordValue(0,j)=="Y");
			j = fields.pos("STATUSBAR");
			arrParams.status = (res.getRecordValue(0,j)=="Y");
		}
		else
			window.status = res.error;

	} catch (e)	{
		var msg = lawsonPortal.getPhrase("LBL_ERROR") + " - " +
				lawsonPortal.getPhrase("AGSXMLERROR") + " - " +
				lawsonPortal.getPhrase("lbl_BOOKMARKS");
		cmnErrorHandler(e,window,PORTALJS,msg);
	}
	return arrParams;
}
//-----------------------------------------------------------------------------
function contextWindow(URL)
{
	URL=processURLString(URL,true);
	window.open(URL);
}
//-----------------------------------------------------------------------------
function newPortalWindow(parms)
{
	var URL = getFullUrl(lawsonPortal.path + "/index.htm");
	if (typeof(parms) == "string")
		URL+=parms
	if (oPortalConfig.isPortalLessMode() && !isSupportedPortalLess(URL))
	{
		var msg=lawsonPortal.getPhrase("msgErrorURLNotSupported")+": "+URL+"\n";
		cmnDlg.messageBox(msg,"ok","stop",window);
		return;
	}
	window.open(URL);
}
//-----------------------------------------------------------------------------
function prtlOnSearchKeyDown(e)
{
	evt=portalWnd.getEventObject(e);
	if (evt.keyCode==13)
	{
		portalWnd.setEventCancel(evt);
		doFind();
	}
	// want to 'hide' this feature -- no hotkey defined (ctrl+alt+A or ctrl+shft+V)
	else if (evt.altKey && evt.ctrlKey && !evt.shiftKey && evt.keyCode == 65
	|| !evt.altKey && evt.ctrlKey && evt.shiftKey && evt.keyCode == 86)
	{
		portalWnd.setEventCancel(evt);
		portalWnd.switchContents("homedebug.htm");
	}
}
//-----------------------------------------------------------------------------
function prtlOnSearchBlur(evt,srch)
{
	if (trim(srch.value)=="")
	{
		srch.value=lawsonPortal.getPhrase("LBL_SEARCH")+"...";
		srch.style.color="gray";
	}
}
//-----------------------------------------------------------------------------
function prtlOnSearchFocus(evt,srch)
{
	var srchText=lawsonPortal.getPhrase("LBL_SEARCH")
	if (srch.value==srchText+"...")
	{
		srch.value="";
		srch.style.color="black";
		srch.select();
	}

}
//-----------------------------------------------------------------------------
function doFind()
{
	lawsonPortal.searchDoc=null;
	var findText=document.getElementById("findText").value
	var srchText=lawsonPortal.getPhrase("LBL_SEARCH")
	if (findText.substr(0,srchText.length) == srchText)
		findText="";

	var xmlstring="";
	//regular expression to match valid forms of Lawson Tokens
	var httpRE=/^(http(s){0,1}:\/\/)*\S+\.\S+\.\S+$/
	if(findText.match(httpRE))
	{
		// looks like a URL
		if(RegExp.$1=="")
			findText="http://"+findText
		switchContents(findText)
	}
	else if (lawsonPortal.searchAction
		&& lawsonPortal.searchAction=="LAW_SEARCH"
		&& findText.match(/^((?:LAWFORM)|(?:LAWPAGE)|(?:LAWSCRIPT))$/i))
	{
		switchContents("transfer.htm?"+RegExp.$1)
	}
	else
	{
		// no hits, perform search on title
		if(lawsonPortal.searchAction=="LAW_SEARCH")
		{
			if(lawsonPortal.searchApi!="")
				doSearch(lawsonPortal.searchApi + escape(findText), findText)
		}
		else if (lawsonPortal.searchAction=="")
		{
			msg = lawsonPortal.getPhrase("LBL_SEARCH_OPTIONS_ERROR");
			portalWnd.cmnDlg.messageBox(msg,"ok","info",portalWnd);
		}
		else
			switchContents(lawsonPortal.searchApi + escape(findText))
	}
}
//-----------------------------------------------------------------------------
function doSearch(api, findText)
{
	var len=0;
	api=processURLString(api)

	// don't do a LawSearch token search if PDL not supplied
	if (api.indexOf("LawSearch") != -1
	&& api.indexOf("Programs.token") != -1
	&& !getVarFromString("PDL",api))
	{
		msg=lawsonPortal.getPhrase("msgErrorMissingProdline")+"\n"+api;
		cmnDlg.messageBox(msg,"ok","stop",window);
		return;
	}

	// validate user is active in SSO
	if (!portalWnd.portalIsUserSSOActive(true))
	{
		portalWnd.portalLogout();
		return;
	}

	lawsonPortal.searchDoc=null;
	var srchDoc=httpRequest(api);
	var msg=lawsonPortal.getPhrase("msgErrorInvalidResponse")+"\n"+api+"\n";
	if (oError.handleBadResponse(srchDoc,true,msg,portalWnd))
		return;
	lawsonPortal.searchDoc=srchDoc;

	var msg = "";
	var programs=srchDoc.getElementsByTagName("PROGRAM")
	var bookmarks=srchDoc.getElementsByTagName("BOOKMARK")
	var pdl = srchDoc.documentElement
			? srchDoc.documentElement.getAttribute("pdl")
			: "";
			
	// remove notokenxfer tokens from the count
	var nbrPrograms = 0;
	for(var x=0; x<programs.length; x++)
	{
		if (programs[x].getAttribute("notokenxfer") != "1")
			nbrPrograms +=1 ;		
	}
		
	if (programs.length==1 && bookmarks.length < 1)
	{
		// single token match, transfer allowed?
		if (programs[0].getAttribute("notokenxfer") != "1")
			formTransfer(programs[0].getAttribute("tkn"),pdl);
		else
		{
			if (!portalWnd.erpPhrases)
				portalWnd.erpPhrases=new portalWnd.phraseObj("forms");
			msg = programs[0].getAttribute("tkn")+": " +
				portalWnd.erpPhrases.getPhrase("ERR_XFER_NOT_ALLOWED")+".\n\n";
			portalWnd.cmnDlg.messageBox(msg,"ok","info",portalWnd);
		}
		return;
	}
	if (bookmarks.length==1 && nbrPrograms < 1)
	{
		var bNewWin = bookmarks[0].getAttribute("newwin")=="1" ? true : false;
		var url = bookmarks[0].getAttribute("url");
		
		if (bNewWin)
		{
			var bmrkKey = bookmarks[0].getAttribute("key");
			openBookmarkWindow(bmrkKey, url)
		}
		else
			switchContents(url);
		return;
	}

	// open search window
	lawsonPortal.searchText=findText;
	if (bookmarks.length == 0 && nbrPrograms == 0)
	{
		msg = lawsonPortal.getPhrase("LBL_SEARCH_RESULTS")+":\n" +
			lawsonPortal.getPhrase("msgNoSearchHitsFound")+" '"+findText+"'.\n\n";
		portalWnd.cmnDlg.messageBox(msg,"ok","info",portalWnd);
	}
	else if (srchWnd && !srchWnd.closed)
	{
		srchWnd.focus();
		srchWnd.srchRefresh(portalWnd);
	}
	else
	{
		var strFeatures = "top=10,left=10,width=475,height=600," +
			"scrollbars=no,status=no,resizable=yes,";
		srchWnd = portalWnd.open(portalWnd.lawsonPortal.path +
						"/dialogs/searchdlg.htm", "", strFeatures);
	}
}
//-----------------------------------------------------------------------------
function getCorrectMenu(tkn,pdl)
{
	// this function will request MX menu first and if MX does not exist it will
	// retrieve MN menu version. Function will return null on server error
	var msg="";
	var mxmenu=tkn.replace(/(^\D{2})(MN|MN(\.\d+))$/i, "$1MX$3");
	if(!pdl)
		pdl=oUserProfile.getAttribute("productline");
	var menuDoc=null;
	menuDoc=httpRequest("/cgi-lawson/formdef.exe?_PDL="+pdl+"&_TKN="+mxmenu+"&_OUT=XML&_XSL=NONE");
	msg="Error calling formdef service.\n";
	if (oError.handleBadResponse(menuDoc,true,msg,portalWnd))
		return null;

	// check to see if MX menu exists if not then try for MN menu
	if (menuDoc.getElementsByTagName("error").length!=0)
		menuDoc=httpRequest("/cgi-lawson/formdef.exe?_PDL="+pdl+"&_TKN="+tkn+"&_OUT=XML&_XSL=NONE");
	return (oError.handleBadResponse(menuDoc,true,msg,portalWnd) ? null : menuDoc);
}

//-----------------------------------------------------------------------------
function buildMenu(tkn,pdl,parMenu)
{
	if (oPortalConfig.isPortalLessMode() && !lawsonPortal.isPortalPage)
	{
		var msg=lawsonPortal.getPhrase("msgErrorMenuNotSupported")+": "+tkn+"\n";
		if (lawsonPortal.backURL == getHome())
			displayErrorPage(window,msg);
		else
		{
			cmnDlg.messageBox(msg,"ok","stop",window);
			goBack();
		}
		return;
	}
	
	parMenu = (typeof(parMenu) != "string" ? null : parMenu);
	pdl = (!pdl ? oUserProfile.getAttribute("productline",true,"persistUserPDL") : pdl);
	if (!pdl) return;

	lawsonPortal.tabArea.tabs["MENU"].clearNavlets();
	
	var menuDoc=getCorrectMenu(tkn,pdl);
	if (menuDoc==null) return;

	var menus=menuDoc.getElementsByTagName("menu");
    if (!menus || menus.length == 0)
    {
        if (menuDoc.getElementsByTagName("error").length != 0)
        {
            var msg = menuDoc.getElementsByTagName("error")[0].getAttribute("msg");
            lawsonPortal.setMessage(msg);
	        return;
        }
    }

	// add menu navlet
	var menuTitle=menuDoc.documentElement.getAttribute("TITLE");
	var menuTkn=menuDoc.documentElement.getAttribute("TOKEN");
	var navlet=lawsonPortal.tabArea.tabs["MENU"].addNavlet(menuTitle,menuTkn,window);

	// clear breadcrumbs
	if (!parMenu)
		menuCrumbAry = new Array();
	var menuCrumb = (!parMenu ? "" : (!menuCrumbAry[parMenu] ? "" : menuCrumbAry[parMenu]));

	// leave a breadcrumb
	if (parMenu)
	{
		if (!menuCrumbAry[tkn])
			menuCrumbAry[tkn] = parMenu;
		var parTitle=lawsonPortal.getPhrase("lblParentMenu");
		navlet.addItem(parMenu,parTitle,"formTransfer('"+parMenu+"','"+pdl+"','','','','',"+true+",'"+menuCrumb+"')","","","up");
	}

	// now add all the menu items
	var len=(menus && menus.length ? menus.length : 0);
	for (var i=0; i < len; i++)
	{
		var menuItemTkn = menus[i].getAttribute("TOKEN");
		// some menus contain link back to parent: we've already included it!
		if (parMenu && parMenu == menuItemTkn)
			continue;
		var menuItemTitle=menus[i].getAttribute("TITLE");
		// do not use 'PROD' from menu nodes: it will not work with data areas
		if (menus[i].childNodes.length)
			navlet.addItem(menuItemTkn,menuItemTitle,"formTransfer('"+menuItemTkn+"','"+pdl+"','','','','',"+true+",'"+menuTkn+ "')","","","down");
		else
			navlet.addItem(menuItemTkn,menuItemTitle,"formTransfer('"+menuItemTkn+"','"+pdl+"')");
	}

	// set tab title and show it
	lawsonPortal.tabArea.tabs["MENU"].setTitle(menuTitle);
	lawsonPortal.tabArea.tabs["MENU"].show();
}
//-----------------------------------------------------------------------------
function persistUserPDL(pdl)
{
	if (typeof(pdl) != "string")
		return false;
	try {
		// make RMUpdate call
		var response = httpRequest("/servlet/RmUpdate?productline=" + pdl,
				null, null, "text/plain", "text/xml", false);

		var msg = lawsonPortal.getPhrase("msgErrorReportedBy")+" RmUpdate service.";
		return (oError.isErrorResponse(response,true,true,false,msg,portalWnd)
			? false : true);

	} catch (e) {
		cmnErrorHandler(e,portalWnd,PORTALJS);
		return false;
	}
}

//-----------------------------------------------------------------------------
// main portal drag code
function dragStart(event, id)
{
	var el;
	var x, y;

	// if an element id was given, find it, otherwise use the element being clicked on
	if (id)
		dragObj.elNode = document.getElementById(id);
	else
	{
		dragObj.elNode = (oBrowser.isIE
				? window.event.srcElement
				: event.target);

		// If this is a text node, use its parent element.
		if (dragObj.elNode.nodeType == 3)
			dragObj.elNode = dragObj.elNode.parentNode;
	}

	// get cursor position with respect to the page
	if (oBrowser.isIE)
	{
		x = window.event.clientX + document.documentElement.scrollLeft
				+ document.body.scrollLeft;
		y = window.event.clientY + document.documentElement.scrollTop
				+ document.body.scrollTop;
	}
	else
	{
		x = event.clientX + window.scrollX;
		y = event.clientY + window.scrollY;
	}

	// save starting positions of cursor and element
	dragObj.cursorStartX = x;
	dragObj.cursorStartY = y;
	dragObj.elStartLeft  = parseInt(dragObj.elNode.style.left, 10);
	dragObj.elStartTop   = parseInt(dragObj.elNode.style.top,  10);

	if (isNaN(dragObj.elStartLeft)) dragObj.elStartLeft = 0;
	if (isNaN(dragObj.elStartTop))  dragObj.elStartTop  = 0;

	// Update element's z-index.
	dragObj.elNode.style.zIndex = ++dragObj.zIndex;

	// Capture mousemove and mouseup events on the page.
	if (oBrowser.isIE)
	{
		dragObj.elNode.setCapture()
		document.attachEvent("onmousemove", dragGo);
		document.attachEvent("onmouseup",   dragStop);
		window.event.cancelBubble = true;
		window.event.returnValue = false;
	}
	else
	{
		document.addEventListener("mousemove", dragGo,   true);
		document.addEventListener("mouseup",   dragStop, true);
		event.preventDefault();
	}
}
//-----------------------------------------------------------------------------
function dragGo(event)
{
	var x, y;

	// Get cursor position with respect to the page.
	if (oBrowser.isIE)
	{
		x = window.event.clientX + document.documentElement.scrollLeft
			+ document.body.scrollLeft;
		y = window.event.clientY + document.documentElement.scrollTop
			+ document.body.scrollTop;
	}
	else
	{
		x = event.clientX + window.scrollX;
		y = event.clientY + window.scrollY;
	}

	// move drag element by the same amount the cursor has moved
	dragObj.elNode.style.left = (dragObj.elStartLeft + x - dragObj.cursorStartX) + "px";
	try {
		var leftBar=document.getElementById("leftLinks")
		var content=document.getElementById("content")
		var tb=document.getElementById("lawtoolbar")
		if (parseInt(dragObj.elNode.style.left) < 0)
			dragObj.elNode.style.left = "0px";
		if (parseInt(dragObj.elNode.style.left) > 400)
			dragObj.elNode.style.left = "400px";		// max left bar width

		leftBar.style.width=dragObj.elNode.style.left
		sizeTabArea()
		tb.style.left=leftBar.offsetWidth+4;

		lawsonPortal.tabArea.size=leftBar.style.width
		lawsonPortal.contentFrame.style.left=dragObj.elNode.offsetLeft+3
		lawsonPortal.contentFrame.style.width=document.body.offsetWidth-lawsonPortal.contentFrame.offsetLeft-5

		tb.style.width=lawsonPortal.contentFrame.style.width

		var leftGrip=portalWnd.document.getElementById("leftGrip")
		var rightGrip=portalWnd.document.getElementById("rightGrip")
		if (parseInt(dragObj.elNode.style.left) > 0)
		{
			lawsonPortal.tabArea.setVisibleState(true);
			leftGrip.style.display="none";
			rightGrip.style.display="inline";
		}
		else
		{
			lawsonPortal.tabArea.setVisibleState(false);
			leftGrip.style.display="inline";
			rightGrip.style.display="none";
		}
		leftGrip.style.left=leftBar.offsetWidth;
		rightGrip.style.left=leftBar.offsetWidth;

		lawsonPortal.drill.drillContainer.style.left=lawsonPortal.contentFrame.style.left
		lawsonPortal.drill.drillContainer.style.width=lawsonPortal.contentFrame.style.width
		lawsonPortal.drill.drillFrame.style.width=lawsonPortal.drill.drillContainer.style.width
	} catch (e) {}

	if (oBrowser.isIE)
	{
		window.event.cancelBubble = true;
		window.event.returnValue = false;
	}
	else
		event.preventDefault();
}
//-----------------------------------------------------------------------------
function dragStop(event)
{
	// Stop capturing mousemove and mouseup events.
	if (oBrowser.isIE)
	{
		document.detachEvent("onmousemove", dragGo);
		document.detachEvent("onmouseup",   dragStop);
		document.releaseCapture()
	}
	else
	{
		document.removeEventListener("mousemove", dragGo,   true);
		document.removeEventListener("mouseup",   dragStop, true);
	}
}

//-----------------------------------------------------------------------------
function doDrillExecute(drlWind)
{
	if (typeof(drlWind.drlDrillObj) != "undefined" && lawsonPortal.drill.mode != null)
	{
		drlWind.drlDrillObj.mode = lawsonPortal.drill.mode;
		drlWind.drlDrillObj.target = lawsonPortal.drill.target;
		drlWind.drlDrillObj.callback = lawsonPortal.drill.callback;
		drlWind.drlDrillObj.idaCall = lawsonPortal.drill.idaCall;
		drlWind.drlDrillObj.idaPath = lawsonPortal.drill.idaPath;
		drlWind.drlDrillObj.oReqFields = lawsonPortal.drill.oReqFields;
		drlWind.drlDrillObj.makeIda = lawsonPortal.drill.makeIda;
		drlWind.drlDrillObj.formTitle = lawsonPortal.drill.formTitle;
		drlWind.drlDrillObj.listUpdate = lawsonPortal.drill.listUpdate;
		drlWind.drlDrillObj.attachType = lawsonPortal.drill.attachType;
		drlWind.drlDrillObj.nbrRecords = lawsonPortal.drill.nbrRecords;
		drlWind.drlDrillObj.isDrillAllowed = lawsonPortal.drill.isDrillAllowed;	// PT 163346
		drlWind.drlDrillObj.execute();
	}
	else if (lawsonPortal.drill.mode == null)
		portalWnd.goBack();
}

//-----------------------------------------------------------------------------
//-- start drill object code
function Drill(wnd)
{
	this.portalWnd=wnd;
	this.drillFrame = document.getElementById("drill");
	this.drillContainer = document.getElementById("drlContainer");
	this.mode = null;
	this.target = null;
	this.callback = null;
	this.idaCall = null;
	this.idaPath = null;
	this.oReqFields = null;
	this.makeIda = null;
    this.formTitle = null;
	this.listUpdate = null;
	this.attachType = null;
	this.nbrRecords = 22;
	this.retValue = null;
	this.isDrillAllowed = false;	// pt-163346
	this.drillAroundAry = new Array();
}
Drill.prototype.call = function()
{
	try{
	eval("lawsonPortal.drill.target." + lawsonPortal.drill.callback + "(this.retValue)");
	}catch(e){}
	this.callback = null;
}
Drill.prototype.callFormHelp = function()
{
	try {
		eval("lawsonPortal.drill.target.lawformFormHelp()");
	} catch (e) { }
}
Drill.prototype.close = function()
{
	this.mode=null;
}
Drill.prototype.doAttachment = function(target,callback,idaCall,attachType)
{
	this.mode = "attachment";
	this.target = target;
	this.callback = callback;
	this.idaCall = idaCall;
	this.idaPath = null;
	this.oReqFields = null;
	this.makeIda = null;
	this.formTitle = null;
	this.listUpdate = null;
	this.attachType = attachType;
	this.isDrillAllowed = false;			// pt-163346
	this.nbrRecords = this.portalWnd.oUserProfile.getRecords(this.mode);

	if (this.portalWnd.oUserProfile.isOpenWindow(this.mode))
	{
		var args = new Array();
		args[0] = "doDrillExecute(window)";
		args[1] = this.portalWnd.lawsonPortal.getPhrase("LBL_ATTACHMENTS");
		var metrics = this.portalWnd.oUserProfile.getMetrics(this.mode);
		var features = (metrics && metrics.retValue)
				? "dialogTop:" + metrics.top +
					";dialogLeft:" + metrics.left +
					";dialogWidth:" + metrics.width +
					";dialogHeight:" + metrics.height +
					";center:no;"
				: "dialogWidth:800px;dialogHeight:600px;center:yes;";
		features = features + "help:no;scroll:no;status:no;resizable:yes;";
		this.portalWnd.cmnDlg.show("/drill/drill.htm", features, args);
	}
	else
	{
		this.drillFrame.src = "drill/drill.htm?parent.doDrillExecute(window)";
		this.drillContainer.style.visibility = "visible";
		this.drillContainer.style.display = "block";
	}
}
Drill.prototype.doCallback = function(retVal)
{
	this.mode = null;
	this.idaPath = null;
	this.retValue = retVal;
	if (this.callback == null)
		return;
	if (this.portalWnd.lawsonPortal == null)		// portal is unloading
		return;

	var pos = this.callback.indexOf("(");
	if (pos > 0)
		this.callback = this.callback.substring(0, pos);

	this.drillContainer.style.visibility = "hidden";

	if (this.portalWnd.oBrowser.isIE)
		this.drillContainer.style.display = "none";

	this.drillFrame.src = this.portalWnd.lawsonPortal.path+"/blank.htm";
	this.portalWnd.lawsonPortal.contentFrame.style.visibility = "visible";
	var t;
	if (this.callback == "returnPrinterSelect") //don't use time out when doing printer select, dialog window within a dialog window problem
		this.portalWnd.lawsonPortal.drill.call()
	else
		t = setTimeout("this.portalWnd.lawsonPortal.drill.call()",0);
	
}
Drill.prototype.doDrill = function(target,callback,idaCall,idaPath)
{
	if (typeof(idaPath) == "undefined")
		idaPath = this.portalWnd.IDAPath;

	this.mode = "explorer";
	this.target = target;
	this.callback = callback;
	this.idaCall = idaCall;
	this.idaPath = idaPath;
	this.oReqFields = null;
	this.makeIda = null;
	this.formTitle = null;
	this.listUpdate = null;
	this.attachType = null;
	this.isDrillAllowed = false;			// pt-163346
	this.nbrRecords = this.portalWnd.oUserProfile.getRecords(this.mode);

	if (this.portalWnd.oUserProfile.isOpenWindow(this.mode))
	{
		var args = new Array();
		args[0] = "doDrillExecute(window)";
		// registered trademark; do not translate
		args[1] = "Drill Around" + String.fromCharCode(174);
		var metrics = this.portalWnd.oUserProfile.getMetrics(this.mode);
		var features = (metrics && metrics.retValue)
				? "dialogTop:" + metrics.top +
					";dialogLeft:" + metrics.left +
					";dialogWidth:" + metrics.width +
					";dialogHeight:" + metrics.height +
					";center:no;"
				: "dialogWidth:800px;dialogHeight:600px;center:yes;";
		features = features + "help:no;scroll:no;status:no;resizable:yes;";
		this.portalWnd.cmnDlg.show("/drill/drill.htm", features, args);
	}
	else
	{
		this.drillFrame.src = "drill/drill.htm?parent.doDrillExecute(window)";
		this.drillContainer.style.visibility = "visible";
		this.drillContainer.style.display = "block";
	}
}

Drill.prototype.doDrillAround = function(idaCall,idaPath)
{
	this.mode = "explorer";
	this.idaCall = idaCall;
	this.idaPath = idaPath;
	this.oReqFields = null;
	this.makeIda = null;
	this.formTitle = null;
	this.listUpdate = null;
	this.attachType = null;
	this.isDrillAllowed = false;			// pt-163346
	this.nbrRecords = this.portalWnd.oUserProfile.getRecords(this.mode);

	var metrics = this.portalWnd.oUserProfile.getMetrics(this.mode);
	var features = (metrics && metrics.retValue)
		? "dialogTop:" + metrics.top +
			";dialogLeft:" + metrics.left +
			";dialogWidth:" + metrics.width +
			";dialogHeight:" + metrics.height +
			";center:no;"
		: "dialogWidth:800px;dialogHeight:600px;center:yes;";
	features = features + "help:no;scroll:no;status:no;resizable:yes;";

	if (this.portalWnd.oBrowser.isIE)
	{
		var args = new Array();
		args[0] = "doDrillExecute(window)";
		args[1] = "Drill Around" + String.fromCharCode(174);
		args[2] = true;
		this.portalWnd.cmnDlg.show("/drill/drill.htm", features, args);
	}
	else
		oNewWindow = window.open(this.portalWnd.lawsonPortal.path + "/drill/drill.htm?DRILLAROUND","", features)
}

Drill.prototype.doList = function(target,callback,oReqFields,makeIda,formTitle,listUpdate,idaPath)
{
	if (typeof(idaPath) == "undefined")
		idaPath = this.portalWnd.IDAPath;

	this.mode = "list";
	this.target = target;
	this.callback = callback;
	this.idaCall = null;
	this.idaPath = idaPath;
	this.oReqFields = oReqFields;
	this.makeIda = makeIda;
	this.formTitle = formTitle;
	this.listUpdate = listUpdate;
	this.attachType = null;
	this.isDrillAllowed = false;			// pt-163346
	this.nbrRecords = this.portalWnd.oUserProfile.getRecords(this.mode);

	this.drillFrame.src = "drill/drill.htm?parent.doDrillExecute(window)";
	this.drillContainer.style.visibility = "visible";
	this.drillContainer.style.display = "block";
}
Drill.prototype.doSelect = function(target,callback,idaCall,idaPath,isDrillAllowed)	//163346
{
	if (typeof(idaPath) == "undefined")
		idaPath = this.portalWnd.IDAPath;

	this.mode = "select";
	this.target = target;
	this.callback = callback;
	this.idaCall = idaCall;
	this.idaPath = idaPath;
	this.oReqFields = null;
	this.makeIda = null;
	this.formTitle = null;
	this.listUpdate = null;
	this.attachType = null;
	this.isDrillAllowed = isDrillAllowed;	// pt-163346
	this.nbrRecords = this.portalWnd.oUserProfile.getRecords(this.mode);

	if (this.portalWnd.oUserProfile.isOpenWindow(this.mode) || callback == "returnPrinterSelect")
	{
		var args = new Array();
		args[0] = "doDrillExecute(window)";
		// registered trademark; do not translate
		args[1] = "Drill Around" + String.fromCharCode(174);
		var metrics = this.portalWnd.oUserProfile.getMetrics(this.mode);
		var features = (metrics && metrics.retValue)
				? "dialogTop:" + metrics.top +
					";dialogLeft:" + metrics.left +
					";dialogWidth:" + metrics.width +
					";dialogHeight:" + metrics.height +
					";center:no;"
				: "dialogWidth:800px;dialogHeight:600px;center:yes;";
		features = features + "help:no;scroll:no;status:no;resizable:yes;";
		this.portalWnd.cmnDlg.show("/drill/drill.htm", features, args);
	}
	else
	{
		this.drillFrame.src = "drill/drill.htm?parent.doDrillExecute(window)";
		this.drillContainer.style.visibility = "visible";
		this.drillContainer.style.display = "block";
	}
}
//-- end drill object code
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
//-- start data storage object code
function DataStorage(construct,portalWnd)
{
	this.portalWnd = (typeof(portalWnd) == "undefined"
		? envFindObjectWindow("lawsonPortal")
		: portalWnd);

	var parser;
	var typ=typeof(construct);

	switch(typ)
	{
	case "string":
		if (this.portalWnd.oBrowser.isIE)
		{
			this.document=this.portalWnd.objFactory.createInstance("DOM");
			this.document.async=false;
			this.document.loadXML(construct);
		}
		else
		{
			parser=new DOMParser();
			this.document=parser.parseFromString(construct,"text/xml");
		}
		break;
	case "object":
		if (this.portalWnd.oBrowser.isIE)
			this.document=construct;
		else
		{
			if(construct.constructor==Array)
				this.document=document.implementation.createDocument(construct[0],construct[1],construct[2]);
			else
			this.document=construct;
		}
		break;
	default:
		this.document=null;
		break;
	}
}
DataStorage.prototype.getAttributeById=function(nodeName,idName,idVal,attrName)
{
	var nodeList;
	var attr="";

	if (this.portalWnd.oBrowser.isIE)
	{
		var node=this.document.selectSingleNode("//"+nodeName+"[@"+idName+"='"+idVal+"']");
		if (node)
			return (node.getAttribute(attrName));
	}

	nodeList=this.document.getElementsByTagName(nodeName);
	if(!nodeList) return attr;

	for (var i = 0; i < nodeList.length; i++)
	{
		if (!nodeList[i].getAttribute(idName)) continue;
		if (nodeList[i].getAttribute(idName)!=idVal) continue;
		if (!nodeList[i].getAttribute(attrName)) continue;
		attr=nodeList[i].getAttribute(attrName);
		break;
	}
	return attr;
}
DataStorage.prototype.getDataString=function(bFormat)
{
	if (typeof(bFormat) != "boolean")
		bFormat=false;

	if (this.portalWnd.oBrowser.isIE)
	{
		if (!bFormat)
			return(this.document.xml);
		try {
			var str=this.document.xml.replace(/\>\</gi,">\n<")
			var dom=this.portalWnd.objFactory.createInstance("DOM");
			dom.async=false;
			dom.loadXML(str);
			str=dom.xml;
			return str;

		} catch (e) { }
		return(this.document.xml);
	}
	var ser=new XMLSerializer();
	var str=ser.serializeToString(this.document)
	if (bFormat)
	{
		str=str.replace(/\>\</gi,">\n<")
		str=str.replace(/\>\t/g,">\n\t")
	}
	return (str);
}
DataStorage.prototype.getDocument=function()
{
	var doc=null;
	if (this.document)
	{
		if (this.portalWnd.oBrowser.isIE)
			doc=this.document;
		else
			doc=this.document.ownerDocument ? this.document.ownerDocument : this.document;
	}
	return doc;
}
DataStorage.prototype.getElementCDataValue=function(nodeName,index)
{
	var oNode;
	var nodeList = this.document.getElementsByTagName(nodeName);

	if (typeof(index) == "undefined")
		oNode = nodeList[0];
	else
		oNode = nodeList[index];

	if (!oNode) return "";

	if (oNode.hasChildNodes())
	{
		var nodes = oNode.childNodes;
		var len = nodes.length;
		for (var i=0; i<len; i++)
		{
			if (nodes[i].nodeType == 4)
				return nodes[i].nodeValue;
		}
	}
    return "";
}
DataStorage.prototype.getElementValue=function(nodeName,index)
{
	var nodeList;
	var oNode;

	nodeList=this.document.getElementsByTagName(nodeName);
	if(typeof(index)=="undefined")
		oNode=nodeList[0];
	else
		oNode=nodeList[index];

	if(!oNode) return "";

	if(oNode.hasChildNodes())
	{
		var nodes = oNode.childNodes;
		var len = nodes.length;
		for (var i=0; i<len; i++)
		{
			if (nodes[i].nodeType == 3 || nodes[i].nodeType == 4)
				return nodes[i].nodeValue;
		}
	}
    return ("");
}
DataStorage.prototype.setElementValue=function(nodeName,value,index)
{
	var nodeList;
	var oNode;
	var txtNode;

	if(typeof(nodeName)=="undefined" || nodeName=="") return null;

	nodeList=this.document.getElementsByTagName(nodeName);
	if(typeof(index)=="undefined")
		oNode=nodeList[0];
	else
		oNode=nodeList[index];

	if(!oNode) return null;

    var aNode=oNode
	if(oNode.hasChildNodes())
	{
		oNode=oNode.childNodes[0];
		if(oNode.nodeType==3 || oNode.nodeType==4)		 //Validate Node type Text or CData
		 	oNode.nodeValue=value;
		else
			aNode=oNode.appendChild(this.document.createTextNode(value));
	}
	else
    	aNode=oNode.appendChild(this.document.createTextNode(value));
    return (aNode ? aNode : null);
}
DataStorage.prototype.getElementsByTagName=function(tagName)
{
	if (!this.document) return null;
	return (this.document.getElementsByTagName(tagName));
}
DataStorage.prototype.getNodeByAttributeId=function(nodeName,attrName,attrVal)
{
	var node=null;

	if (this.portalWnd.oBrowser.isIE)
	{
		node=this.document.selectSingleNode("//"+nodeName+"[@"+attrName+"='"+attrVal+"']");
		return node;
	}

	var nodeList=this.document.getElementsByTagName(nodeName);
	if(!nodeList) return null;

	for (var i = 0; i < nodeList.length; i++)
	{
		if (!nodeList[i].getAttribute(attrName)) continue;
		if (nodeList[i].getAttribute(attrName)!=attrVal) continue;
		node=nodeList[i];
		break;
	}
	return node;
}
DataStorage.prototype.getNodeByName=function(nodeName,index)
{
	var nodeList=this.document.getElementsByTagName(nodeName);
	if(!nodeList) return null;

    if (typeof(index) == "undefined") index=0
    if (index+1 > nodeList.length) return (null);

	return nodeList[index];
}
DataStorage.prototype.getRootNode=function()
{
	var root=null;
	if (this.document)
	{
		if (this.portalWnd.oBrowser.isIE)
			root=this.document.documentElement;
		else
			root=this.document.documentElement ? this.document.documentElement : this.document;
	}
	return root;
}
DataStorage.prototype.isEmptyDoc=function()
{
	var retVal=true;
	if (!this.document)
		return true;
	return (this.document.documentElement ? false : true);
}
DataStorage.prototype.isErrorDoc=function()
{
	var root=this.getRootNode();
	if (!this.portalWnd || !this.portalWnd.oPortalConfig)
		return (root && root.nodeName == "ERROR" ? true : false);
	return (root && root.nodeName == "ERROR" ? true : false);
}
//-- end data storage object code
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
//-- start toolbar object code
function Toolbar(portalWnd,wnd,tbContainer)
{
	this.portalWnd=portalWnd;
	this.wnd=wnd;
	this.doc=this.wnd.document;
	this.tbar=(typeof(tbContainer) == "undefined"
		? this.doc.getElementById("lawtoolbar")
		: tbContainer);
	this.dropDown=null;
	this.rightSpacer=null;
	this.target=window;
	this.crtHeight=23;
	this.initHeight=23;
	this.spacerWidth=0;
	this.handleOverflow=true;
	this.hasRightBtn=false;
	this.tbar.style.overflow="hidden";
	this.visibleCount=0;
	this.overflowTitle="";			// titles must be loaded after login complete:
	this.spActionsTitle="";			// see finishAuthen.

	// setup show dropdown handler
	var oThis=this;
	this._showDropdownList=function(e) {
		oThis.showDropdownList(e);
	}
	this._dropdownCallback=function(id) {
		oThis.dropdownCallback(id);
	}
}
Toolbar.prototype.addSeparator=function()
{
	var	sepImg=this.doc.createElement("span");
	sepImg.className = "separator"
	this.tbar.appendChild(sepImg);
}
Toolbar.prototype.addDropdownButton=function(id,text,title,action,droptitle,dropaction)
{
	// disable auto overflow handling
	this.handleOverflow = false;
	this.setOverflow(false);

	// create the large button
	var	noBR = this.doc.createElement("NOBR");
	var mButton = this.doc.createElement("button");
	mButton.id="LAWTBBUTTON"+id;
	mButton.className="xTToolBarButton";
	mButton.title=title;
	mButton.onmouseover=this.portalWnd.lawtbOnMouseOver;
	mButton.onmouseout=this.portalWnd.lawtbOnMouseOut;
	mButton.onfocus=this.portalWnd.lawtbOnFocus;
	mButton.onblur=this.portalWnd.lawtbOnBlur;
	mButton.style.marginRight="0px";

	if (this.portalWnd.oBrowser.isIE)
	{
		mButton.style.width="70px";
	    mButton.style.overflow="visible";
	}
	else
	{
		// netscape is so lame!
		mButton.style.width="80px";
	}

    text=this.portalWnd.xmlEncodeString(text);
	mButton.innerHTML=text;

	if(typeof(action)=="function")
		mButton.onclick = action;
	else
	{
		mButton.setAttribute("action",action);
		mButton.onclick=this.portalWnd.lawtbonclick;
	}
	mButton.onselectstart=this.portalWnd.lawtbonselect;

	noBR.appendChild(mButton)

	// now create the dropdown button
	mButton=this.doc.createElement("button");
	mButton.id="LAWDROPBUTTON"+id;
	mButton.className="xTToolBarButton";
	mButton.title=droptitle;
	mButton.onclick=dropaction;
	mButton.onmouseover=this.portalWnd.lawtbOnMouseOver;
	mButton.onmouseout=this.portalWnd.lawtbOnMouseOut;
	mButton.onfocus=this.portalWnd.lawtbOnFocus;
	mButton.onblur=this.portalWnd.lawtbOnBlur;
	mButton.innerHTML="&nbsp;";
	with (mButton.style) {
		position="relative";
		left=-1;
		width="14px";
		marginLeft="0px";
		borderLeft="1px solid #555555";
		backgroundImage="url('"+this.portalWnd.lawsonPortal.path+"/images/ico_arrowdn.gif')";
		backgroundPosition="center";
		backgroundRepeat="no-repeat";
		overflow="visible";		//resolves DPI resolution issue
	}
	noBR.appendChild(mButton);
	this.tbar.appendChild(noBR);
	this.resize()
}
Toolbar.prototype.addDropdownButtonRight=function(id,text,title,action,droptitle,dropaction)
{
	// disable auto overflow handling
	this.handleOverflow = false;
	this.hasRightBtn=true;
	this.setOverflow(true);

	// create the large button
	var	btnDiv = this.doc.createElement("DIV");
	btnDiv.className="buttonBorder";
	btnDiv.style.position="absolute";
	btnDiv.style.right="4px";
	btnDiv.style.top="2px";
	btnDiv.style.height="20px";

	var	noBR = this.doc.createElement("NOBR");

	var mButton = this.doc.createElement("button");
	mButton.id="LAWTBBUTTON"+id;
	mButton.title=title;
	mButton.onmouseover=this.portalWnd.lawtbOnMouseOver;
	mButton.onmouseout=this.portalWnd.lawtbOnMouseOut;
	mButton.style.position="relative";
	mButton.style.top="0px";
	mButton.style.left="0px";
	mButton.style.margin="0px";
	mButton.style.borderRight="0px";

	if (this.portalWnd.oBrowser.isIE)
	{
		mButton.style.width="70px";
	    mButton.style.overflow="visible";
	}
	else
		mButton.style.width="90%";

    text=this.portalWnd.xmlEncodeString(text);
	mButton.innerHTML=text;

	if(typeof(action)=="function")
		mButton.onclick = action;
	else
	{
		mButton.setAttribute("action",action);
		mButton.onclick=this.portalWnd.lawtbonclick;
	}
	mButton.onselectstart=this.portalWnd.lawtbonselect;

	noBR.appendChild(mButton)

	// now create the dropdown button
	mButton=this.doc.createElement("button");
	mButton.id="LAWDROPBUTTON"+id;
	mButton.title=droptitle;
	mButton.onclick=dropaction;
	mButton.tabIndex = -1;
	mButton.onmouseover=this.portalWnd.lawtbOnMouseOver;
	mButton.onmouseout=this.portalWnd.lawtbOnMouseOut;
	mButton.innerHTML="&nbsp;";
	mButton.className = "arrowdn_grey";
	with (mButton.style) {
		position="relative";
		width="14px";
		height="100%";
		padding="0px";
		margin="0px";
		backgroundPosition="center";
		backgroundRepeat="no-repeat";
	}
	noBR.appendChild(mButton);
	btnDiv.appendChild(noBR);
	this.tbar.appendChild(btnDiv);
	this.spacerWidth=btnDiv.offsetWidth+14;
	this.resize()
}
Toolbar.prototype.clear=function(bWrap)
{
	bWrap=(typeof(bWrap) == "boolean" ? bWrap : false);

	var tb=this.tbar
	tb.innerHTML = " ";

	// reset wrapping, handleOverflow flags
	tb.style.overflow=(bWrap ? "visible" : "hidden");
	this.handleOverflow=(bWrap ? false : true);
	this.hasRightBtn=false;

	this.resize()
}
Toolbar.prototype.createButton=function(text,action,id,state,userdata,ico)
{
	var tbButton = this.doc.createElement("button");

	tbButton.setAttribute("icon","");
	if (this.portalWnd.oBrowser.isIE)
	{
		tbButton.style.width="70px";
	    tbButton.style.overflow="visible";
	}
	else
	{
		// netscape is so lame!
		if (text && text.length < 10)
			tbButton.style.width="80px";
	}
	var htmlSpace="&nbsp;";
    text=this.portalWnd.xmlEncodeString(text);
	if (typeof(ico) == "undefined" || ico.length == 0)
		tbButton.innerHTML=htmlSpace+text+htmlSpace;
	else
	{
		// set the icon/text: 0=text,1=icon,2=both
		var btnOption = this.portalWnd.oUserProfile.getPreference("toolbardisplay");

		// if preference does not exist, then default to text
        if (typeof(btnOption) == "undefined" || btnOption.length == 0)
            btnOption = 0;

		// if icon, set button text to empty space
		tbButton.innerHTML = (btnOption == "1") 
			? htmlSpace
			: htmlSpace + text + htmlSpace; 

		if (btnOption == "1" || btnOption == "2")
		{
			tbButton.setAttribute("icon",ico);
			with (tbButton.style) {
				backgroundRepeat="no-repeat";
				backgroundPosition="left";
				paddingLeft="22px";
			}
		}
		if (btnOption == "1")
		{
			tbButton.title=text;
			tbButton.style.width="22px";
			tbButton.style.paddingLeft="";
		}
	}
	tbButton.className="xTToolBarButton" + " " + tbButton.getAttribute("icon");
	tbButton.onblur=this.portalWnd.lawtbOnBlur;
	tbButton.onmouseover=this.portalWnd.lawtbOnMouseOver;
	tbButton.onmouseout=this.portalWnd.lawtbOnMouseOut;

	if(typeof(action)=="function")
	{
		tbButton.onclick = action;
		if (typeof(userdata) != "undefined")
			tbButton.setAttribute("userdata",userdata)
	}
	else
	{
		tbButton.setAttribute("action",action)
		tbButton.onclick=this.portalWnd.lawtbonclick
	}
	tbButton.onselectstart=this.portalWnd.lawtbonselect;
	tbButton.id="LAWTBBUTTON" + id
	if (state=="disabled")
	{
		this.portalWnd.setTbButtonIcon(tbButton,true);
		tbButton.disabled=true
		tbButton.style.cursor="default"
		tbButton.className="xTToolBarButtonDisabled" + " " + tbButton.getAttribute("icon");
	}
	this.tbar.appendChild(tbButton)
	this.resize()
}
Toolbar.prototype.createSpActionButton=function(action)
{
	var tbButton = this.doc.createElement("button");
	tbButton.id="LAWTBBUTTONSpActions";
	tbButton.disabled = true;
	tbButton.className="xTToolBarButtonDisabled sp_actions"
	tbButton.setAttribute("icon","sp_actions");
	with (tbButton.style) {
		width="22px";
		tbButton.style.paddingLeft="";

		backgroundRepeat="no-repeat";
		backgroundPosition="center";
	}

	tbButton.onfocus=this.portalWnd.lawtbOnFocus;
	tbButton.onblur=this.portalWnd.lawtbOnBlur;
	tbButton.onmouseover=this.portalWnd.lawtbOnMouseOver;
	tbButton.onmouseout=this.portalWnd.lawtbOnMouseOut;
	tbButton.onclick = action;
	tbButton.onselectstart=this.portalWnd.lawtbonselect;
	this.tbar.appendChild(tbButton)
	this.resize()
}
Toolbar.prototype.enableSpActionButton=function()
{
	var tbButton = this.doc.getElementById("LAWTBBUTTONSpActions");
	if (tbButton)
	{
		tbButton.disabled=false;
		tbButton.className="xTToolBarButton sp_actions";
		tbButton.setAttribute("title",this.spActionsTitle);
	}
}
Toolbar.prototype.createOverflowButton=function()
{
	var dropBtn = this.doc.createElement("button");
	dropBtn.id="LAWTBBUTTONdropbuttons";
	dropBtn.className="xTToolBarButton";
	dropBtn.title=this.overflowTitle;
	dropBtn.tabIndex="1";
	dropBtn.style.width="24px";
	dropBtn.innerHTML="&nbsp;";

	dropBtn.style.backgroundImage="url('"+portalWnd.getFullUrl(lawsonPortal.path)+"/images/ico_toolbutton_more.gif')";
	dropBtn.style.backgroundPosition="center";
	dropBtn.style.backgroundRepeat="no-repeat";

	dropBtn.onfocus=this.portalWnd.lawtbOnFocus;
	dropBtn.onblur=this.portalWnd.lawtbOnBlur;
	dropBtn.onmouseover=this.portalWnd.lawtbOnMouseOver;
	dropBtn.onmouseout=this.portalWnd.lawtbOnMouseOut;
	dropBtn.onclick=this._showDropdownList;
	dropBtn.onselectstart=this.portalWnd.lawtbonselect;

	try {
		if (this.dropDown)
			this.tbar.removeChild(this.dropDown);
	} catch (e) { }
	this.dropDown=null;
	
	// caution: change these pixel dimensions at great risk ;-)
	// a pixel or 2 in either direction can impact proper
	// placement of the show dropDown button.
	this.visibleCount=0;
	var usedWidth = 0;
	var len=this.tbar.childNodes.length;
	var maxWidth = this.tbar.offsetWidth -
			(parseInt(dropBtn.style.width,10)+2);

	//step 1. determine if button is needed.
	var lastBtn = null;
	
	for (var i = 0; i < len; i++)
	{
		var btn=this.tbar.childNodes[i];
									
		if ((usedWidth + btn.offsetWidth+2) > maxWidth)
		{
			lastBtn = btn;
			break;
		}
		
		btn.tabIndex="1";
		usedWidth += (btn.offsetWidth+2)
		this.visibleCount++;
	}
	
	if(!lastBtn) return;
	
	//step 2. create the button if needed (needs to have at least 1 menu item)
	for (var i = this.visibleCount; i < len; i++)
	{
		var str=this.tbar.childNodes[i].innerHTML;
		if (str && str != ">>" && !this.tbar.childNodes[i].disabled)
		{
			this.dropDown = dropBtn;
			this.tbar.insertBefore(this.dropDown,lastBtn);
			lastBtn.tabIndex="-1"
			break;
		}	
	}	
}
Toolbar.prototype.createRightBtnSpacer=function()
{
	var spaceDiv = this.doc.createElement("SPAN");
	spaceDiv.id="LAWTBBUTTONspacer";
	spaceDiv.style.width=this.spacerWidth;
	spaceDiv.style.margin="1px";
	spaceDiv.innerHTML="&nbsp;";
	spaceDiv.onselectstart=this.portalWnd.lawtbonselect;

	try {
		if (this.dropDown)
			this.tbar.removeChild(this.dropDown);
	} catch (e) { }
	this.dropDown=null;
	try {
		if (this.rightSpacer)
			this.tbar.removeChild(this.rightSpacer);
	} catch (e) { }
	this.rightSpacer=null;

	// caution: change these pixel dimensions at great risk ;-)
	// a pixel or 2 in either direction can impact proper
	// placement of the show dropDown button.
	this.visibleCount=0;
	var usedWidth = 0;
	var len=this.tbar.childNodes.length;
	var maxWidth = this.tbar.offsetWidth -
			(parseInt(spaceDiv.style.width,10)+2);

	for (var i = 0; i < len; i++)
	{
		var btn=this.tbar.childNodes[i];
		if ((usedWidth + btn.offsetWidth+2) > maxWidth)
		{
			this.rightSpacer = spaceDiv;
			this.tbar.insertBefore(this.rightSpacer,this.tbar.childNodes[i]);
			break;
		}
		usedWidth += (btn.offsetWidth+2)
		this.visibleCount++;
	}
}
Toolbar.prototype.changeButtonIcon=function(id,ico)
{
	var btn=this.doc.getElementById("LAWTBBUTTON" + id)
	if (!btn) return;

	if (typeof(ico) != "string")
		return;
	if (!btn.getAttribute("icon"))
		return;

	btn.setAttribute("icon",ico);
	btn.style.backgroundImage="url('"+portalWnd.getFullUrl(lawsonPortal.path)+"/images/ico_toolbutton_"+ico+".gif')";
	this.resize();
}
Toolbar.prototype.changeButtonState=function(id,state)
{
	var btn=this.doc.getElementById("LAWTBBUTTON" + id)
	if (!btn) return;

	switch(state.toLowerCase())
	{
		case "disabled":
			this.portalWnd.setTbButtonIcon(btn,true);
			btn.className="xTToolBarButtonDisabled";
			btn.disabled=true;
			btn.style.cursor="default";
			break;
		case "enabled":
			this.portalWnd.setTbButtonIcon(btn,false);
			btn.className="xTToolBarButton";
			btn.disabled=false;
			if (document.all)
				btn.style.cursor="hand";
			else
				btn.style.cursor="pointer";
			break;
		case "hide":
			btn.style.visibility="hidden";
			btn.style.display="none";
			break;
		case "show":
			btn.style.display="inline";
			btn.style.visibility="visible";
			break;
	}
	this.resize();
}
Toolbar.prototype.changeButtonText=function(id,text)
{
	var btn=this.doc.getElementById("LAWTBBUTTON" + id)
	if (!btn) return;

	btn.innerHTML = this.portalWnd.xmlEncodeString(text);
	this.resize();
}
Toolbar.prototype.changeButtonTitle=function(id,title)
{
	var btn=this.doc.getElementById("LAWTBBUTTON" + id)
	if (!btn) return;

	btn.title = title;
	this.resize();
}
Toolbar.prototype.changeButtonWidth=function(id,width)
{
	var btn=this.doc.getElementById("LAWTBBUTTON" + id)
	if (!btn) return;

	btn.style.width=width;
	this.resize();
}
Toolbar.prototype.removeButton=function(id)
{
	var btn = this.doc.getElementById("LAWTBBUTTON" + id)
	if (!btn) return;

	btn.removeNode(true);
	this.resize();
}
Toolbar.prototype.resize=function()
{
	if (this.tbar.id != "lawtoolbar") return;
	var content=this.portalWnd.document.getElementById("content")
	if ((this.initHeight > this.tbar.offsetHeight)
	&& this.portalWnd.oBrowser.isIE)
	{
		this.tbar.style.height=this.initHeight
	}
	else if (this.tbar.offsetHeight > this.crtHeight
			&& this.tbar.offsetHeight > this.initHeight)
	{
		var diff=this.tbar.offsetHeight-this.crtHeight
		content.style.top=content.offsetTop+diff
		var height = content.offsetHeight-diff;
		if (height > -1)
			content.style.height = height;
		this.crtHeight=this.tbar.offsetHeight
	}
	else if (this.crtHeight > this.tbar.offsetHeight
			&& this.crtHeight > this.initHeight)
	{
		var diff=(this.tbar.offsetHeight==0
				? this.crtHeight-this.initHeight
				: this.crtHeight-this.tbar.offsetHeight);
		content.style.top=content.offsetTop-diff
		content.style.height=content.offsetHeight+diff
		this.crtHeight=(this.tbar.offsetHeight==0
				? this.initHeight
				: this.tbar.offsetHeight);
	}

	// handle overflow and draw button?
	if (this.hasRightBtn)
		this.createRightBtnSpacer();
	else if (this.handleOverflow)
		this.createOverflowButton();
}
Toolbar.prototype.setOverflow=function(bOverflowVisible)
{
	bOverflowVisible = (typeof(bOverflowVisible) == "boolean"
		? bOverflowVisible : true);
	this.tbar.style.overflow = (bOverflowVisible ? "visible" : "hidden");
}
Toolbar.prototype.showDropdownList=function()
{
	this.portalWnd.iWindow.dropObj.clearItems()
	var len=this.tbar.childNodes.length;
	for (var i = this.visibleCount+1; i < len; i++)
	{
		var str=this.tbar.childNodes[i].innerHTML;
		if (!str || str == ">>" || this.tbar.childNodes[i].disabled)
			continue;
			
		str=str.replace(/\&nbsp\;/gi,"");
		this.portalWnd.iWindow.dropObj.addItem(str, null, null,
				this.portalWnd.iWindow.dropObj.trackMenuClick,
				"TOOLBUTTONSELECT", 0, 0, this);
	}
	this.portalWnd.dateSL=this.dropDown;	// mis-named; item to restore focus to
	iWindow.dropObj.showIframe("",this.dropDown,"dropObj.portalWnd.menuCallback")
}
Toolbar.prototype.dropdownCallback=function(dropText)
{
	var idx = -1;
	var len=this.tbar.childNodes.length;
	for (var i = this.visibleCount+1; i < len; i++)
	{
		var btnText = this.tbar.childNodes[i].innerHTML;
		btnText=btnText.replace(/\&nbsp\;/gi,"");
		if (dropText != btnText) continue;

		idx = i;
		break;
	}
	if (idx == -1) return;

	var tbBtn=this.tbar.childNodes[idx];
	if (tbBtn.getAttribute("action"))
		eval("this.target." + tbBtn.getAttribute("action"));
	else
		tbBtn.click();
}

//-----------------------------------------------------------------------------
// toolbar button event handlers
function lawtbonclick(e)
{
	var evt=e?e:window.event;
	evt.cancelBubble=true;
	evt=getEventElement(evt);
	eval("lawsonPortal.toolbar.target." + evt.getAttribute("action"));
}
function lawtbonselect(e)
{
    // don't do a select: it highlights the text
	cmnBlockSelect(e);
}
function lawtbOnFocus(e)
{
	if (this.className != "xTToolBarButtonDisabled")
	{
		this.className="xTToolBarButtonHighlight"
		setTbButtonIcon(this,true);
	}
}
function lawtbOnBlur(e)
{
	if (this.className.slice(0,23) != "xTToolBarButtonDisabled")
	{
		this.className="xTToolBarButton"
		setTbButtonIcon(this,false);
	}
}
function lawtbOnMouseOver(e)
{
	if (this.className == "" || this.className == "buttonOver")
	{
		this.className="buttonOver";
		setTbButtonIcon(this,true);
	}
	else if (this.className.slice(0,23) != "xTToolBarButtonDisabled")
	{
		this.className="xTToolBarButtonHighlight";
		setTbButtonIcon(this,true);
	}
}
function lawtbOnMouseOut(e)
{
	if ( !portalWnd
	|| (portalWnd.document.activeElement
	&& this.id == portalWnd.document.activeElement.id) )
		return;
	if (this.className == "" || this.className == "buttonOver")
	{
		this.className=""
		setTbButtonIcon(this,false);
	}
	else if (this.className.slice(0,23) != "xTToolBarButtonDisabled")
	{
		this.className="xTToolBarButton"
		setTbButtonIcon(this,false);
	}
}
function setTbButtonIcon(btn,bOver)
{
	var ico = btn.getAttribute("icon");
	if (!ico) return;
	btn.className = btn.className + " " + (bOver ? ico+"Over" : ico);
}
//-- end toolbar object code
//-----------------------------------------------------------------------------

function helpOptions()
{
	this.items=new Object()
	this.target=window
}
helpOptions.prototype.addItem=function(id,caption,callback,target)
{
	this.items[id]=new Object()
	this.items[id].caption=caption
	this.items[id].callback=callback
	this.items[id].target=target
}
helpOptions.prototype.clearItems=function()
{
	for(id in this.items)
		this.removeItem(id)
	this.items=new Object()
}
helpOptions.prototype.removeItem=function(id)
{
	this.items[id].target=null
	this.items[id].callback=null
	this.items[id]=null
}

//-----------------------------------------------------------------------------
//-- start guide me cache object code
function GuideMeCache(portalWnd)
{
	this.portalWnd=portalWnd;
	this.items=new Array();
}
GuideMeCache.prototype.addItem=function(id)
{
	this.items[id]=id;
}
GuideMeCache.prototype.createItems=function()
{
	if (!this.portalWnd.fileMgr)
		return;

	var checkFile = this.portalWnd.fileMgr.checkFile("lawson/learning/guideme","*.htm",false);
	
	if(checkFile.documentElement.selectSingleNode("FILECHECK").getAttribute("exists") == "true"){
		
		var oFileList=this.portalWnd.fileMgr.getList("filelist","lawson/learning/guideme","*.htm",false);
		if (oFileList == null)
			return; 
	
		var fNodes=oFileList.selectNodes("//FILE");
		var len = (fNodes ? fNodes.length : 0);
		for (var i=0; i<len; i++)
		{
			var strName=fNodes[i].text;
			strName=strName.replace(/\.htm$/i, "");
			this.addItem(strName);
		}
	}
}	
GuideMeCache.prototype.clearItems=function()
{
	for(id in this.items)
		this.removeItem(id);
	this.items=new Object();
}
GuideMeCache.prototype.removeItem=function(id)
{
	this.items[id]=null;
}
//-- end guide me cache object code
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
//-- start lawsonportal object code
function lawPortalObj(wnd)
{
	this.wnd=wnd
	this.versionNumber="9.0.1"
	this.buildNumber="11.692 2013-12-12 04:00:00"
	this.helpOptions=new helpOptions()

	this.previewMode=false
	this.path=this.wnd.document.location.pathname.substr(0,document.location.pathname.lastIndexOf("/"))
	this.formsDir=this.path+"/forms"
	this.profile=null
	this.keyMgr=null;
	this.keyBuffer=null;
	this.language=null;
	this.browser = new SSOBrowser(); // from sso.js

	this.toolbar=new Toolbar(wnd,wnd);
	
	this.tabArea=new TabObject(wnd)
	this.drill = new Drill(wnd)
	this.guideMeCache = new GuideMeCache(wnd);
	this.xsltSupport=false
	this.backURL=getHome();
	this.searchApi="";
	this.searchAction="";
	this.searchDoc=null;
	this.contentFrame=this.wnd.document.getElementById("content")
	this.isPortalPage = false;

	if (this.browser.isIE)
	{
		xmlVersion=wnd.objFactory.getMSXMLVersion()
		if(xmlVersion=="6.0" || xmlVersion=="4.0" || xmlVersion=="3.0")
			this.xsltSupport=true
	}
}
lawPortalObj.prototype.getMessage=function()
{
	return this.msg
}
lawPortalObj.prototype.setMessage=function(sMsg)
{
	this.msg=sMsg
	window.status=sMsg
}
lawPortalObj.prototype.getTitle=function()
{
	return this.title
}
lawPortalObj.prototype.setTitle=function(sTitle,strTKN,strPDL)
{
	this.title=sTitle
	var titleArea=this.wnd.document.getElementById("formTitle")

	if (strTKN)
	{
		titleArea.innerHTML=sTitle + " (" + strTKN + ")";
		titleArea.setAttribute("title", sTitle +
			(typeof(strPDL) != "undefined" ? " (" + strPDL + " - " + strTKN + ")" : "") );
		this.wnd.document.title= "Lawson Portal - " + sTitle + " (" + strTKN + ")";
	}
	else
	{
		titleArea.innerHTML=sTitle;
		titleArea.setAttribute("title",sTitle);
		this.wnd.document.title= "Lawson Portal - " + sTitle;
	}
}
lawPortalObj.prototype.getLanguage=function()
{
	if (this.language)
		return (this.language);
	var language=null;
	try {
		if (this.browser.isIE)
			language=this.profile.selectSingleNode("//MESSAGES").getAttribute("language");
		else
		{
			var msgs=this.profile.getElementsByTagName("MESSAGES")
			language=msgs[0].getAttribute("language");
		}

	} catch (e) { }
	this.language = (language ? language : "en-us");
	return (this.language);
}
lawPortalObj.prototype.getPhrase=function(ID)
{
	var phNode=null;
	if (this.browser.isIE)
		phNode=this.profile.selectSingleNode("//MESSAGES/*[@id='"+ID+"']");
	else
	{
		phNode=this.profile.getElementById(ID)
		if (!phNode)
		{
			var msgs=this.profile.getElementsByTagName("MESSAGES");
			msgs=msgs[0].childNodes;
			for (var i=0; i < msgs.length; i++)
			{
				if(msgs[i].nodeType==1 && msgs[i].getAttribute("id")==ID)
				{
					phNode=msgs[i];
					break;
				}
			}
		}
	}

	// phrases may have been XML-encoded, need to transform to HTML-encoded
	var ret="";
	if (phNode && phNode.childNodes.length > 0)
		ret = phNode.firstChild.nodeValue.replace(/&amp;/g, "&");
	else
		ret = ID;
	return ret;
}
lawPortalObj.prototype.getUserVariable=function(strElement)
{
// deprecated
	return (this.wnd.oUserProfile.getAttribute(strElement));
}
lawPortalObj.prototype.setUserVariable=function(aName,value)
{
// deprecated
	this.wnd.oUserProfile.setAttribute(aName,value);
}
lawPortalObj.prototype.saveUserFile=function()
{
// deprecated
	this.wnd.oUserProfile.save();
}
lawPortalObj.prototype.setWelcomeMsg=function(msg)
{
	var welcomeDiv=this.wnd.document.getElementById("divWel");
	if (welcomeDiv)
		welcomeDiv.innerHTML=msg;
}
//-- end lawsonportal object code
//-----------------------------------------------------------------------------

function buildPortalFromRole()
{
	try {
		// new user profile or refresh?
		if (oUserProfile)
			oUserProfile.refresh();
		else
			oUserProfile = new UserProfile(window);

		// new form cache or refresh?
		if (oFormCache)
			oFormCache.refresh();
		else
			oFormCache = new FormCache(window);

		// always create new print manager	
		printMgr = new PrintManager(window);

		// initialize guideme cache
		if (lawsonPortal.guideMeCache)
			lawsonPortal.guideMeCache.createItems();

		// profile initialized properly?
		if (!oUserProfile.initialized
		|| !oUserProfile.hasRequiredAttributes(true))
			return;

		// new hotkeys manager or refresh?
		if (lawsonPortal.keyMgr)
			lawsonPortal.keyMgr.refresh();
		else
			lawsonPortal.keyMgr = new HotkeysManager(window);

		// set the initial navlet up/down image
		var initImage=(oUserProfile.getPreference("autonavlet") == "1"
			? "url('"+lawsonPortal.path+"/images/ico_rollup.gif')"
			: "url('"+lawsonPortal.path+"/images/ico_rolldown.gif')");
		for (var id in lawsonPortal.tabArea.tabs)
		{
			lawsonPortal.tabArea.tabs[id].initImage =
					(id=="PAGE" ? "url('"+lawsonPortal.path+"/images/ico_rollup.gif')" : initImage);
		}

		// process the profile return
		var roleDoc=oUserProfile.oRole.storage.getRootNode();
		var len=0;
		var element=null
		var homePage=roleDoc.getElementsByTagName("HOME")
		if (homePage.length > 0)
			lawsonPortal.homePage=homePage[0].firstChild.nodeValue

		// show menubar?
		var menuNode=roleDoc.getElementsByTagName("MENUBAR")
		if (menuNode.length > 0)
		{
			menuNode=menuNode[0]
			var menus=menuNode.getElementsByTagName("MENU")
			len=menus.length;
			for (var i=0; i < len; i++)
			{
				element=document.getElementById(menus[i].getAttribute("id"))
				if(element!=null)
				{
					element.style.display="inline"
					element.style.visibility="visible"
					element.title=lawsonPortal.getPhrase(menus[i].getAttribute("labelid"));
				}
			}
		}

		// show find options
		var bShow=!oPortalConfig.isPortalLessMode();
		if (!bShow) return;

		var findNode=roleDoc.getElementsByTagName("FIND")
		if (findNode.length > 0)
		{
			// setup default search API
			var srchApi="";
			var srchAction="";
			var srchLabelId="";
			var defItem=findNode[0].getElementsByTagName("MENU").item(0).getAttribute("defItem")
			var itemNodes=findNode[0].getElementsByTagName("ITEM")
			if (defItem)
			{
				len = itemNodes.length;
				for (var i = 0; i < len; i++)
				{
					if (itemNodes[i].getAttribute("id") == defItem)
					{
						srchApi=itemNodes[i].getAttribute("href");
						srchAction=itemNodes[i].getAttribute("action");
						srchLabelId=itemNodes[i].getAttribute("labelid");
						break;
					}
				}
			}
			if ((srchApi == "" || srchAction == "") && itemNodes[0])
			{
				srchApi=itemNodes[0].getAttribute("href");
				srchAction=itemNodes[0].getAttribute("action");
				srchLabelId=itemNodes[0].getAttribute("labelid");
			}
			lawsonPortal.searchApi=srchApi;
			lawsonPortal.searchAction=srchAction;

			//set the tooltip of the Search button
			var menuBtn = document.getElementById(findNode[0].getElementsByTagName("MENU").item(0).getAttribute("id"));
			menuBtn.title = lawsonPortal.getPhrase(srchLabelId);
			
			// show search container
			document.getElementById("searchDiv").style.display="inline"
			document.getElementById("searchDiv").style.visibility="visible"
		}

		// process Welcome Message
		var msg=roleDoc.getElementsByTagName("WELCOME")
		msg=(msg && msg.length > 0 ? msg[0] : null);
		if (msg)
		{
			msg=cmnGetNodeCDataValue(msg);
			msg=processMessageString(msg);
			lawsonPortal.setWelcomeMsg(msg);
		}
		buildLeftCustomLinks()
		inbasketLoadTasks()

 	} catch(e) {
		cmnErrorHandler(e,window,PORTALJS);
 	}
}

//-----------------------------------------------------------------------------
function buildLeftBookmarks()
{
	try {
		var topLevel=lawsonPortal.profile.getElementsByTagName("BOOKMARKS")
		topLevel=topLevel[0]

		var userNode=oUserProfile.storage.getRootNode();
		if (!userNode) return;

		var leftBar=userNode.getElementsByTagName("NAVIGATION")
		leftBar=leftBar[0]
		if (!leftBar || !leftBar.hasChildNodes() || !topLevel)
			return;

		// remove duplicate navlets
		var arrRemove=null;
		var len=leftBar.childNodes.length;
		for (var i=0; i < len; i++)
		{
			if(leftBar.childNodes[i].nodeType!=1)
				continue;

			var bkmrk=getBookmark(topLevel,leftBar.childNodes[i].getAttribute("key"))
			if (!bkmrk) continue;

			// check to see if navlet already loaded
			var key=bkmrk.getAttribute("key")
			var prevNavlet=lawsonPortal.tabArea.tabs["HOME"].navletObjects[key]
			if (prevNavlet)
			{
				// remember to remove
				if (!arrRemove)
					arrRemove=new Array();
				arrRemove[arrRemove.length]=leftBar.childNodes[i];
				continue;
			}

			var navCnt = 0;
			var navlet=lawsonPortal.tabArea.tabs["HOME"].addNavlet(bkmrk.getAttribute("nm"),key,window)
			var jlen=bkmrk.childNodes.length;
			for (var j=0; j < jlen; j++)
			{
				var chld=bkmrk.childNodes[j]
				if (chld.nodeType!=1) continue;

				var bkChildren=chld.getElementsByTagName("BOOKMARK")
				key=chld.getAttribute("key")
				var nm=chld.getAttribute("nm")
				var url=chld.getAttribute("url")
				var desc=chld.getAttribute("desc")
				var fcn="";
				if (bkChildren.length > 0)
					fcn="buildChildBookmarkMenu('" + key + "')"
				else if (chld.getAttribute("newwin")=="1")
				{
					if (url.substr(0,6) == "admin/" || url.substr(0,8) == "reports/"
					|| (url.substr(0,8) == "utility/" && url.indexOf("lawterminal.htm") == -1) )
					{
						url = lawsonPortal.path + "?_URL=" + url
					}
					fcn="openBookmarkWindow('" + key + "', '" + url + "')";
				}
				else if (url)
					fcn="switchContents('" + url + "')"
				navlet.addItem(key,nm,fcn,desc,"",(bkChildren.length ? "down" : null));
				navCnt++;
			}

			// If no children, add an unclickable node that says that.
			if (navCnt == 0)
			{
				var key = "";
				var nm = lawsonPortal.getPhrase("LBL_NO_BOOKMARKS");
				var url = "";
				var desc = "";
				var fcn = "";
				navlet.addItem(key,nm,fcn,desc);
			}
		}

		// remove duplicate navlets
		len=(arrRemove ? arrRemove.length : 0);
		for (var i=0; i < len; i++)
			arrRemove[i].parentNode.removeChild(arrRemove[i])

 	} catch(e) {
		cmnErrorHandler(e,window,PORTALJS);
 	}
}

//-----------------------------------------------------------------------------
function buildLeftCustomLinks()
{
	try {
		// if navlet exists clear all the items
		var navlet=lawsonPortal.tabArea.tabs["HOME"].navletObjects["lawshortcuts"]
		if (navlet) navlet.clearItems()

		if (!oUserProfile.oRole.getUseShortcuts())
			return;

		// get the user XML
		var userNode=oUserProfile.storage.getRootNode();
	 	if (!userNode) return;
		var links=userNode.getElementsByTagName("LINK");

		// if the preferences menu is not available, we must stay
		// to build the manage shortcuts link even if no other links
		if ( (!links || links.length < 1)
		&& oUserProfile.oRole.getUsePreferencesMenu() )
			return;

		// add the navlet?
		if (!navlet)
			navlet=lawsonPortal.tabArea.tabs["HOME"].addNavlet(
				lawsonPortal.getPhrase("CUSTOMSHORTCUTS"),"lawshortcuts",window);

		// add the 'manage shortcuts' link?
		if (!oUserProfile.oRole.getUsePreferencesMenu())
		{
			var msg=lawsonPortal.getPhrase("MANAGESHORTCUTS")
			var userPrefsLink="users/preferences/index.htm?tabShortcut";
			navlet.addItem("mngshortcuts", msg, "switchContents('"+userPrefsLink+"')", msg);
		}

		// now we can return
		if (!links || links.length < 1)
			return;

		var len = links.length;
		for (var n = 0; n < len; n++)
		{
			var newWin=links[n].getAttribute("newwin");
			var name=links[n].getAttribute("name");
			var switchTo = cmnGetNodeCDataValue(links[n]);
			switchTo=switchTo.replace(/\\/g,"\\\\");

			if (newWin!="1")
				navlet.addItem("LinkName" + n, name,
					"switchContents('" + switchTo + "')", name);
			else
				navlet.addItem("LinkName" + n, name,
					"openWindow('" + switchTo + "')", name);
		}

 	} catch(e) {
		cmnErrorHandler(e,window,PORTALJS);
 	}
}

//-----------------------------------------------------------------------------
function inbasketLoadTasks()
{
	try {
		if (oUserProfile.getAttribute("wfuser") != "1")
			return;
		var inbasketNode = lawsonPortal.profile.getElementsByTagName("INBASKET");
		inbasketNode = (inbasketNode && inbasketNode.length) ? inbasketNode[0] : null;
		
		if (!inbasketNode) 
			return;

		// check for inbasket error message
		var errorNode = inbasketNode.getElementsByTagName("ERROR");
		errorNode = (errorNode && errorNode.length) ? errorNode[0] : null;
		
		if (errorNode)
		{
			var ds = new DataStorage(inbasketNode, portalWnd);
			oError.displayIOSErrorMessage(ds, true, "", portalWnd);
			return;
		}

		var userTaskNode = inbasketNode.getElementsByTagName("USERTASKS");
		var lpaNode = inbasketNode.getElementsByTagName("LPA");

		userTaskNode = (userTaskNode && userTaskNode.length) ? userTaskNode[0] : null;
		lpaNode = (lpaNode && lpaNode.length) ? lpaNode[0] : null;

		if (!userTaskNode && !lpaNode)
			return;

		var navInbasket;
		var navItemElement;
		var node;
		var nodes;
		var descriptionNode;
		var description;
		var nodesLength;

		// add LSF nav items
		if (userTaskNode)
		{
			// create or clear the navlet
			navInbasket = lawsonPortal.tabArea.tabs["HOME"].navletObjects["inbasket"];
			
			if (navInbasket)
				navInbasket.clearItems();
			else
				navInbasket = lawsonPortal.tabArea.tabs["HOME"].addNavlet("Inbasket ProcessFlow Integrator", "inbasket", window);

			// now load the inbasket navlet and tasks
			var nodes = inbasketNode.getElementsByTagName("TASK");
			nodesLength = (nodes) ? nodes.length : 0;

 			if (nodesLength > 0)
			{
				// add the tasks
				navInbasket.addItem("inbaskettasklbl", lawsonPortal.getPhrase("lblTasks"));

				for (var i=0; i<nodesLength; i++)
				{
					node = nodes[i];

					descriptionNode = node.getElementsByTagName("DESCRIPTION");
					if (!descriptionNode || descriptionNode.length < 1) 
						continue;

					descriptionNode = descriptionNode[0];
					description = cmnGetElementText(descriptionNode);
					if (!description || description.length < 1)
						continue;

					//PT 161782 - Mukesh Upadhyay - 13-Sep-06
					//ProcessFlow Task Description w/special char - not displaying 			
					description = encodeHTML(description);

					if (node.getAttribute("pending") == "true")
						description = description + "*";

				 	navItemElement = navInbasket.addItem("inbaskettask" + i, description,
			 		 	"switchContents('inbasket/inbasket.htm?TASKID=" +
			 		 	node.getAttribute("id") + "&USER=FALSE')", "", 1);

					navItemElement.htmlElement.firstChild.innerHTML = description
				}
			}

			// add the user task; should always be available
			navInbasket.addItem("inbasketworklbl", lawsonPortal.getPhrase("lblUserLevelWork"));

			//PT 161782 - Mukesh Upadhyay - 13-Sep-06
			//ProcessFlow Task Description w/special char - not displaying 
			var userName = encodeHTML(oUserProfile.getAttribute("name"));

			if (userTaskNode.getAttribute("pendingForUser") == "true")
				userName = userName + "*";

			navItemElement = navInbasket.addItem("inbaskettask" + (nodesLength + 1), userName,
				"switchContents('inbasket/inbasket.htm?TASKID=" +
				oUserProfile.getId() + "&USER=TRUE')", "", 1);
	 
			navItemElement.htmlElement.firstChild.innerHTML = userName;
		}

		// add LPA data areas
		if (lpaNode)
		{
			var urlNode;
			var url;
			var dataArea;
				
			nodes = lpaNode.getElementsByTagName("APPLICATION")
			nodesLength = (nodes) ? nodes.length : 0;
			
			if (nodesLength > 0)
			{
				for (var i=0; i<nodesLength; i++)
				{
					node = nodes[i];

					dataArea = node.getAttribute("id");

					descriptionNode = node.getElementsByTagName("DESCRIPTION")			
					if (!descriptionNode || descriptionNode.length < 1) 
						continue;

					descriptionNode = descriptionNode[0];
					description = cmnGetElementText(descriptionNode);
					if (!description || description.length < 1)
						continue;

					description = encodeHTML(description);
					
					// -----------------------------------------------------------
						// create LPA Inbasket item
						// indicate to not display the header and to force the data area to change
					urlNode = node.getElementsByTagName("DETAILURL");

					if (urlNode && urlNode.length > 0) {
						// create or clear the navlet for LPA Inbasket
						navInbasket = lawsonPortal.tabArea.tabs["HOME"].navletObjects["lpainbasket"];
						if (navInbasket) 
						{
							navInbasket.clearItems();
						} else 
						{
							navInbasket = lawsonPortal.tabArea.tabs["HOME"].addNavlet("Inbasket Lawson Process Automation", "lpa", window);
						}
						
						url = cmnGetElementText(urlNode[0]);
						if (!url || url.length < 1)
							continue;
							
						
						navItemElement = navInbasket.addItem("lpainbaskettask" + i, description, 
							"switchContents('" + url + "')", "", 1)

						navItemElement.htmlElement.firstChild.innerHTML = description;
					}

					// -----------------------------------------------------------
					// create LPA Tracking item
				 	urlNode = node.getElementsByTagName("TRACKINGURL");
				 	if (urlNode && urlNode.length > 0)
				 	{
						// create or clear the navlet for LPA Tracking
						var navTracking = lawsonPortal.tabArea.tabs["HOME"].navletObjects["lpatrackinbasket"];
						if (navTracking) 
						{
							navTracking.clearItems();
						} else 
						{
							navTracking = lawsonPortal.tabArea.tabs["HOME"].addNavlet("Tracking Lawson Process Automation", "lpatrack", window);
						}
						
				 		url = cmnGetElementText(urlNode[0]);
				 		if (url && url.length > 0)
				 		{
						 	navItemElement = navTracking.addItem("lpatrackinbaskettask" + i, description, 
						 		"switchContents('" + url + "')", "", 1)
		
							navItemElement.htmlElement.firstChild.innerHTML = description;
				 		}
				 	}
					// -----------------------------------------------------------
					// create LPA Admin item
				 	urlNode = node.getElementsByTagName("ADMINURL");
				 	if (urlNode && urlNode.length > 0)
				 	{
						// create or clear the navlet for LPA Administrator
						var navAdmin = lawsonPortal.tabArea.tabs["HOME"].navletObjects["lpaadmininbasket"];
						if (navAdmin)
						{
							navAdmin.clearItems();
						}
						else
						{
							navAdmin = lawsonPortal.tabArea.tabs["HOME"].addNavlet("Administrator Lawson Process Automation", "lpaadmin", window);
						}
						
				 		url = cmnGetElementText(urlNode[0]);
				 		if (url && url.length > 0)
				 		{
						 	navItemElement = navAdmin.addItem("lpaadmininbaskettask" + i, description, 
						 		"switchContents('" + url + "')", "", 1)
		
							navItemElement.htmlElement.firstChild.innerHTML = description;
				 		}
				 	}
				}
			}
		}
 	} 
 	catch(e) 
 	{
		cmnErrorHandler(e, window, PORTALJS);
 	}
}

//PT 161782 - Mukesh Upadhyay - 13-Sep-06
//ProcessFlow Task Description w/special char - not displaying 

function encodeHTML(str)
{
       
	while(str.indexOf('<')!=-1)
	{
	str = str.replace("<","&lt;")
	}
	
	while(str.indexOf('>')!=-1)
	{
	str = str.replace(">","&gt;")
	}

  return str
}

//-----------------------------------------------------------------------------
function getXpressParm(varName,str)
{
	reStr="(?:\\|\\||^)" + varName + "\\|(.*?)(?:\\|\\||$)"
	var re=new RegExp(reStr,"gi")
	re.exec(str)
	return RegExp.$1
}

//-----------------------------------------------------------------------------
// this method should be called after 'profile' data has been retrieved.
// (any 'build portal from role' requirements should be added here - initially
// there is no difference between ERP environment and PSA standalone, but
// there is a slight difference for Design Studio preview mode.)
function lawPortalFinishInitialization(service)
{
	try {
	
		// load SysEnv configuration
		oEnvConfig = new EnvConfig(window);
		oEnvConfig.makeRequest();
		
		lawPortalLoadVersions();

		if (typeof(service) == "undefined")
			service="iosprofile";
		switch (service.toLowerCase())
		{
		case "iosprofile":
		case "psaprofile":
			lawPortalFinishAuthen();
			lawPortalDefaultContent();
			break;
		case "previewmode":
			loadPreviewContent()
			lawPortalFinishAuthen()
			lawsonPortal.contentFrame.style.visibility="visible"
			break;
		}

		sizePortalStuff();
		
		var leftGrip=portalWnd.document.getElementById("leftGrip")
		var rightGrip=portalWnd.document.getElementById("rightGrip")
		if (oPortalConfig.isPortalLessMode() && !lawsonPortal.isPortalPage)
		{
			lawsonPortal.tabArea.setVisibleState(false);
			return;
		}

		var leftbarState=oUserProfile.getPreference("leftbarstate");
		leftGrip.style.display="inline";
		rightGrip.style.display="none";
		var bShow=(leftbarState == "1" ? false : true);
		lawsonPortal.tabArea.setVisibleState(bShow);
		if (bShow && leftbarState == "2")
		{
			// resize to last session
			var leftBar=document.getElementById("leftLinks");
			var width=oUserProfile.getPreference("leftbarwidth");
			leftBar.style.width=(width ? width : lawsonPortal.tabArea.size);
			if (leftBar.style.width=="0px")
				lawsonPortal.tabArea.setVisibleState(false);
			sizePortalStuff();
		}
		
		if (oPortalConfig.isPortalLessMode() && lawsonPortal.isPortalPage) 
		{
			lawsonPortal.tabArea.tabs["HOME"].hide();
			lawsonPortal.tabArea.tabs["MENU"].hide();
		}

	} catch (e) {
		cmnErrorHandler(e,window,PORTALJS);
		displayErrorPage(window,"A fatal error condition was detected: the Portal is unable to load.");
	}
}

//-----------------------------------------------------------------------------
function lawPortalLoadVersions()
{
	// load version information
	oPortalConfig.setIOSVersion();
	oPortalConfig.setGlobalVars();
	envLoadWindowScriptVersions(portalWnd.oVersions,portalWnd);
}

//-----------------------------------------------------------------------------
function lawPortalFinishAuthen()
{
	try {
		//check if in portal page mode
		var pgeRE=/^LAWPAGE\|/i
		
		if (pgeRE.test(unescape(getVarFromString("_URL",document.location.search))) && oPortalConfig.isPortalLessMode())
			lawsonPortal.isPortalPage = true;
		
		// show portal elements
		var menuBar=portalWnd.document.getElementById("menuBar");
		menuBar.style.display="block";
		
		/*
		 * set the "Search..." text of the search box, translate if necessary
		 */
		var textBox = portalWnd.document.getElementById("findText");
		if (textBox)
		{						
			textBox.value=lawsonPortal.getPhrase("LBL_SEARCH")+"...";			
		}					

		if (!oPortalConfig.isPortalLessMode() ||  lawsonPortal.isPortalPage)
		{
			var divWel=portalWnd.document.getElementById("divWel");
			divWel.style.display="block";
			var splitBar=portalWnd.document.getElementById("splitBar");
			splitBar.style.visibility="visible";
			var navBar=portalWnd.document.getElementById("leftLinks");
			navBar.style.display="block";
		}
		else
		{
			var logoImg=portalWnd.document.getElementById("imgLogo");
			logoImg.style.display="none";
			var srchDiv=portalWnd.document.getElementById("searchDiv");
			srchDiv.style.display="none";
			menuBar.style.width="100px";
		}
		var logoDiv=portalWnd.document.getElementById("divLogo");
		logoDiv.style.display="block";
		var topDivider=portalWnd.document.getElementById("topDivider");
		topDivider.style.display="block";
		var toolBar=portalWnd.document.getElementById("lawtoolbar");
		toolBar.style.display="block";
		var logoutBtn=portalWnd.document.getElementById("btnLogout");
		if ( oPortalConfig.isPortalLessMode() )
			logoutBtn.style.display="none";
		else
		{
			logoutBtn.style.display="block";
			logoutBtn.value="["+lawsonPortal.getPhrase("LOGOUT")+"]";
		}

		if (oPortalConfig.isPortalLessMode() && lawsonPortal.isPortalPage) {
			var logoImg=portalWnd.document.getElementById("imgLogo");
			logoImg.style.display="none";
			var srchDiv=portalWnd.document.getElementById("searchDiv");
			srchDiv.style.display="none";
			menuBar.style.display="none";
		}
		
		// supply titles
		var rightGrip=portalWnd.document.getElementById("rightGrip");
		rightGrip.title=lawsonPortal.getPhrase("COLLAPSE");
		var leftGrip=portalWnd.document.getElementById("leftGrip");
		leftGrip.title=lawsonPortal.getPhrase("EXPAND");
		var imgLogo=portalWnd.document.getElementById("imgLogo");
		imgLogo.title=lawsonPortal.getPhrase("lblClickToGoHome");
		imgLogo.src=oPortalConfig.getSetting("logo_src","images/logo.gif");
		imgLogo.onclick = goHome2;
		
		// supply titles to portal's toolbar object
		lawsonPortal.toolbar.overflowTitle=lawsonPortal.getPhrase("lblClickToShowActions");
		lawsonPortal.toolbar.spActionsTitle=lawsonPortal.getPhrase("lblClickToShowActions");

		lawsonPortal.tabArea.tabs["HOME"].clearNavlets()
		buildPortalFromRole()

		// profile initialized properly?
		if (!oUserProfile.hasRequiredAttributes())
			return false;

		lawsonPortal.tabArea.tabs["HOME"].setTitle(lawsonPortal.getPhrase("LBL_HOME"))
		if (!oPortalConfig.isPortalLessMode())
			lawsonPortal.setTitle(lawsonPortal.getPhrase("LBL_HOME"))
		lawsonPortal.setMessage("")

		buildLeftBookmarks()

		lawsonPortal.tabArea.initializeDisplay();

		if (document.getElementById("searchResults"))
			lawsonPortal.tabArea.tabs["MENU"].setTitle(lawsonPortal.getPhrase("LBL_SEARCH"))

		setInitialFocus();

 	} catch(e) {
		cmnErrorHandler(e,window,PORTALJS);
 	}
}

//-----------------------------------------------------------------------------
function lawPortalDefaultContent()
{
	if (!lawsonPortal.previewMode)
	{
		var srchStr=unescape(document.location.search)
		if (getVarFromString("_TKN",srchStr))
			formTransfer(getVarFromString("_TKN",srchStr),
					getVarFromString("_PDL",srchStr), null,
					getVarFromString("_HK",srchStr),
					getVarFromString("_ID",srchStr))
		else if (getVarFromString("_URL",srchStr))
		{
			var URL = unescape(getVarFromString("_URL",document.location.search));
			var remURL = unescape(cmnRemoveVarFromString("URL",document.location.search));
			if (remURL == "?")
				remURL = "";
			if (remURL) // PT 184801 if URL already contains a ? do not include it anymore in remURL
			{
				if (URL.indexOf("?") >= 0)
					remURL = (remURL.substr(0,1) == "?" ? remURL.substr(1) : remURL);
				else
					remURL = (remURL.substr(0,1) == "&" ? "?" + remURL.substr(1) : remURL);
			}
			switchContents(URL+remURL);
		}
		else
			goHome();
	}
}

//-----------------------------------------------------------------------------
function buildChildBookmarkMenu(key,urlLoaded)
{
	var topLevel=lawsonPortal.profile.getElementsByTagName("BOOKMARKS")
	topLevel=topLevel[0]
	lawsonPortal.tabArea.tabs["MENU"].clearNavlets()
	var bkmrk=getBookmark(topLevel,key)
	if (bkmrk)
	{
		//if the bookmark also has a url go there
		var u=bkmrk.getAttribute("url")
		if(u)
		{
			if(urlLoaded)
				switchContents(u)
			else
			{
				switchContents("loadbmkey.htm?"+key)
				return
			}
		}
		lawsonPortal.tabArea.tabs["MENU"].setTitle(bkmrk.getAttribute("nm"))
		var navlet=lawsonPortal.tabArea.tabs["MENU"].addNavlet(bkmrk.getAttribute("nm"),key,window)

		// add the parent bookmark?
		var parNode=bkmrk.parentNode;
		if (parNode.nodeName == "BOOKMARK")
		{
			var parKey=parNode.getAttribute("key");
			var parTitle=lawsonPortal.getPhrase("lblParentMenu");
			navlet.addItem(parKey,parTitle,"buildChildBookmarkMenu('"+parKey+"')","","","up");
		}

		for (var j=0; j < bkmrk.childNodes.length; j++)
		{
			var chld=bkmrk.childNodes[j]
			if (chld.nodeType==1)
			{
				var chldBkmrks=chld.getElementsByTagName("BOOKMARK")
				var key=chld.getAttribute("key")
				var nm=chld.getAttribute("nm")
				var desc=chld.getAttribute("desc")
				var fcn
				if (chldBkmrks.length > 0)
					fcn="buildChildBookmarkMenu('" + key + "')"
				else
				{
					var url=chld.getAttribute("url")
					if(chld.getAttribute("newwin")=="1")
						fcn="openBookmarkWindow('" + key + "','" + url + "')";
					else
						fcn="switchContents('" + url + "')"
				}
				navlet.addItem(key,nm,fcn,desc,"",(chldBkmrks.length ? "down" : null));
			}
		}
	}
	lawsonPortal.tabArea.tabs["MENU"].show()
}
//-----------------------------------------------------------------------------
function getBookmark(topLevel,key)
{
	var retVal=null
	var bkmrks=topLevel.getElementsByTagName("BOOKMARK")
	for(var j=0;j<bkmrks.length;j++)
	{
		var parentBookmark=bkmrks[j]
		var match=parentBookmark.getAttribute("key")
		if(match==key)
		{
			retVal=parentBookmark
			break;
		}
	}
	return retVal
}

function setSrchButtonIcon(btn,bHover)
{
	var menuId = btn.getAttribute("menuId")
	var strImage="url('images/ico_search";

	var strApi="default";
	var searchApi=lawsonPortal.searchApi.toLowerCase();
	if (searchApi.indexOf("google.com") != -1)
		strApi="google";
	else if (searchApi.indexOf("msn.com") != -1)
		strApi="msn";
	else if (searchApi.indexOf("yahoo.com") != -1)
		strApi="yahoo";
	else if (searchApi.indexOf("knowledgebase") != -1)
		strApi="knowledge-base";
	else if (searchApi.indexOf("bookmarks") != -1
	&& searchApi.indexOf("programs") == -1)	// default also searches bookmarks
		strApi="bookmarks";

	strImage += ("_" + strApi);
	strImage+=((bHover ? "-over" : "") + ".gif')");
	btn.style.backgroundImage=strImage;
}
function srchBtnMouseOver(e)
{
	var evt=e?e:window.event;
	var evtTarget=getEventElement(evt);
	evtTarget.className="xTToolButtonHighlight"
	switch (evtTarget.id)
	{
		case "LAWMENUBTNSEARCH":
		case "LAWMENUBTNSEARCH2":
			var evtComp=evtTarget.id == "LAWMENUBTNSEARCH"
				? portalWnd.document.getElementById("LAWMENUBTNSEARCH2")
				: portalWnd.document.getElementById("LAWMENUBTNSEARCH");
			evtComp.className="xTToolButtonHighlight";
			var theBtn=portalWnd.document.getElementById("LAWMENUBTNSEARCH2");
			setSrchButtonIcon(theBtn,true);
			break;
		case "LAWMENUBTNPREF":
			evtTarget.style.backgroundImage="url('"+lawsonPortal.path+"/images/ico_preferences-over.gif')";
			break;
		case "LAWMENUBTNHELP":
			evtTarget.style.backgroundImage="url('"+lawsonPortal.path+"/images/ico_help-over.gif')";
			break;
	}
}
function srchBtnMouseOut(e)
{
	var evt=e?e:window.event
	var evtTarget=getEventElement(evt)
	evtTarget.className="xTToolButton"
	switch (evtTarget.id)
	{
		case "LAWMENUBTNSEARCH":
		case "LAWMENUBTNSEARCH2":
			var evtCompanion=evtTarget.id == "LAWMENUBTNSEARCH"
				? portalWnd.document.getElementById("LAWMENUBTNSEARCH2")
				: portalWnd.document.getElementById("LAWMENUBTNSEARCH");
			evtCompanion.className="xTToolButton";
			var theBtn=portalWnd.document.getElementById("LAWMENUBTNSEARCH2");
			setSrchButtonIcon(theBtn,false);
			break;
		case "LAWMENUBTNPREF":
			evtTarget.style.backgroundImage="url('"+lawsonPortal.path+"/images/ico_preferences.gif')";
			break;
		case "LAWMENUBTNHELP":
			evtTarget.style.backgroundImage="url('"+lawsonPortal.path+"/images/ico_help.gif')";
			break;
	}
}
function logoutBtnOver(evt,btn)
{
	btn.style.color="blue";
	btn.style.textDecoration="underline";
}
function logoutBtnOut(evt,btn)
{
	btn.style.color="#999999";
	btn.style.textDecoration="none";
}
function navletItemClick(e)
{
	var evt=e?e:window.event
	var evtTarget=getEventElement(evt)
	evt.cancelBubble=true
	var navID=evtTarget.getAttribute("container")
	var tabID=evtTarget.parentNode.parentNode.getAttribute("tabid")
	var action=trim(evtTarget.getAttribute("action")).replace(/\n|\r/g,"")
	if(trim(evtTarget.getAttribute("lawdisabled"))!="true")
		eval("lawsonPortal.tabArea.tabs['"+tabID+"'].navletObjects['"+navID+"'].target." + action)
}
function navletItemFocus(e)
{
	var evt=e?e:window.event
	var evtTarget=getEventElement(evt)
	evtTarget.hideFocus=true
	evtTarget.className="xTNavSelected"
}
function navletItemBlur(e)
{
	var evt=e?e:window.event
	var evtTarget=getEventElement(evt)
	evtTarget.className="xTNavItem"
}
function navletItemMouseOver(e)
{
	var evt=e?e:window.event;
	var evtTarget=getEventElement(evt);
	if (evtTarget.tagName.toLowerCase() == "img")
		evtTarget=evtTarget.parentNode;
	if (evtTarget.className!="xTNavSelected")
		evtTarget.className="xTNavHover";
}
function navletItemMouseOut(e)
{
	var evt=e?e:window.event
	var evtTarget=getEventElement(evt)
	if (evtTarget.tagName.toLowerCase() == "img")
		evtTarget=evtTarget.parentNode;
	if (evtTarget.className!="xTNavSelected")
		evtTarget.className="xTNavItem"
}
function navletItemContextMenu(e)
{
	var evt=e?e:window.event
	var evtTarget=getEventElement(evt)
	var x=evt.clientX;
	var y=evt.clientY;
	setTimeout("showNavletContextMenu('"+evtTarget.id+"','"+x+"','"+y+"')",5);
	setEventCancel(evt);
	return false;
}
function clearNavletContents(containerID)
{
	var oRow=document.getElementById("BODY"+containerID).childNodes[0]
	while(oRow.childNodes.length>0)
		oRow.removeChild(oRow.childNodes[oRow.childNodes.length])
}

//-----------------------------------------------------------------------------
function NavletObject(portalWnd,id)
{
	this.portalWnd=portalWnd;
	this.items=new Object()
	this.tabId=""
	this.id=id
	this.title=""
	this.target=""
	this.htmlElement=null
	this.itemContainer=null
	this.hdrElement=null
	this.NavWrapper=null
	this.dnImage="url('"+this.portalWnd.lawsonPortal.path+"/images/ico_rolldown.gif')";
	this.upImage="url('"+this.portalWnd.lawsonPortal.path+"/images/ico_rollup.gif')";
}
NavletObject.prototype.addFilter=function(id,action)
{
	this.items[id]=new filterObject(this.portalWnd);
	this.items[id].id=id
	this.items[id].action=action
	this.items[id].createFilterContainer(this.itemContainer.childNodes[0])

	var oTable=this.items[id].htmlElement
	oTable.setAttribute("action",action)
	oTable.setAttribute("container",this.id)
	oTable.setAttribute("tabid",this.tabId)

	return this.items[id];
}
NavletObject.prototype.addItem=function(id,name,action,title,intIndent,mnuIcon)
{
	this.items[id]=new Object()
	this.items[id].name=name;
	this.items[id].action=action;
	this.items[id].title=title;
	this.items[id].indent=intIndent;
	this.items[id].id=id;
	this.items[id].menuIcon=(typeof(mnuIcon)!="string" ? "" : mnuIcon);

	var oRow=this.itemContainer.childNodes[0]
	oDiv = this.portalWnd.document.createElement("div");
	this.items[id].htmlElement=oRow.appendChild(oDiv);
 	return this.changeItem(id,name,action,title,intIndent,mnuIcon)
}
NavletObject.prototype.changeItem=function(id,name,action,title,intIndent,mnuIcon)
{
	if (!this.items[id]) return;

	if(typeof(name)=="undefined")
		name=this.items[id].name
	if(typeof(action)=="undefined")
		action=this.items[id].action
	if(typeof(title)=="undefined")
		title=this.items[id].title
	if(typeof(intIndent)=="undefined")
		intIndent=this.items[id].indent
	if(typeof(mnuIcon)=="undefined")
		mnuIcon=this.items[id].mnuIcon;

	var indent=parseInt(intIndent)
	indent = (isNaN(indent) ? 0 : 10*indent);

	var oCell = this.portalWnd.document.createElement("button");
	oCell.id="LAWNAVITEM"+id
	oCell.className="xTNavItem"
	// button text won't left align in NS
	oCell.style.width = (this.portalWnd.oBrowser.isIE ? "98%" : "");

	if ((typeof(action) != "undefined") && (action!=null) && (action!=""))
	{
		oCell.setAttribute("action",action)
		oCell.setAttribute("lawdisabled","false");
		oCell.onclick=this.portalWnd.navletItemClick;
		oCell.onfocus=this.portalWnd.navletItemFocus;
		oCell.onblur=this.portalWnd.navletItemBlur;
		oCell.onmouseover=this.portalWnd.navletItemMouseOver;
		oCell.onmouseout=this.portalWnd.navletItemMouseOut;
		oCell.oncontextmenu=this.portalWnd.navletItemContextMenu;

		try {  oCell.style.cursor="pointer"
		} catch(e) { oCell.style.cursor="hand" }
	}
	else
		oCell.tabIndex="-1";

	if (typeof(title)!="undefined" && title!=null)
		oCell.title=title
	name=this.portalWnd.trim(name)
	if (name.length > 28)
		name=name.substr(0,28)+"&hellip;"
	name=name.replace(/&(?!hellip;)/g, "&amp;")
	var strInner=name+(mnuIcon
		? "<img src='"+this.portalWnd.lawsonPortal.path+"/images/ico_menu_"+mnuIcon+".gif' style='margin-left:2px;'/>"
		: "");
	oCell.innerHTML=strInner;

	oCell.style.marginLeft=indent + "px"
	oCell.setAttribute("container",this.id)
	if (this.items[id].htmlElement.firstChild)
		this.items[id].htmlElement.removeChild(this.items[id].htmlElement.firstChild)
	this.items[id].htmlElement.appendChild(oCell);
	return this.items[id]
}
NavletObject.prototype.changeItemState=function(itemId,state)
{
	if (!this.items[itemId]) return;
	switch (state.toUpperCase())
	{
		case "SELECTED":
			for(id in this.items)
			{
				if (this.items[id] != null)
				   this.items[id].htmlElement.firstChild.style.fontWeight="normal";
			}
			this.items[itemId].htmlElement.firstChild.style.fontWeight="bold";
			break;
		case "DISABLED":
			this.items[itemId].htmlElement.firstChild.style.cursor="default"
			this.items[itemId].htmlElement.firstChild.setAttribute("lawdisabled","true");
			break;
		case "ENABLED":
			try { this.items[itemId].htmlElement.firstChild.style.cursor="pointer"
			} catch(e) { this.items[itemId].htmlElement.firstChild.style.cursor="hand" }
			this.items[itemId].htmlElement.firstChild.setAttribute("lawdisabled","false");
			break;
		case "FOCUS":
			try {
				this.portalWnd.focus()
				this.items[itemId].htmlElement.firstChild.focus()
			} catch (e) {}
		break;
	}
}
NavletObject.prototype.changeItemName=function(id,name)
{
	if (!this.items[id]) return;
	if (this.items[id].name!=name)
	{
		this.items[id].name=name
		this.items[id].title=(this.items[id].title) ? name : this.items[id].title
		this.changeItem(id,name)
	}
}
NavletObject.prototype.clearItems=function()
{
	for(id in this.items)
		this.removeItem(id)

	this.items=null
	this.items=new Object()
}
NavletObject.prototype.collapse=function()
{
	this.itemContainer.style.visibility="hidden"
	this.itemContainer.firstChild.style.display="none"
	this.setHdrMouseover(true);
}
NavletObject.prototype.expand=function()
{
	this.itemContainer.firstChild.style.display="block"
	this.itemContainer.style.visibility="visible"
	this.setHdrMouseover(false);
}
NavletObject.prototype.hide=function()
{
	this.NavWrapper.style.visibility="hidden"
	this.NavWrapper.style.display="none"
}
NavletObject.prototype.selectFirst=function()
{
	for (id in this.items)
	{
		if (this.items[id] == null)
			continue;

		if (this.items[id].type
		&& (this.items[id].type == "FILTER" || this.items[id].type == "FIND"))
		{
			this.items[id].selectFirst()
			break;
		}

		var parentElem=null;
		if (this.portalWnd.oBrowser.isIE)
			parentElem=this.items[id].htmlElement.parentElement.parentElement
		else
			parentElem=this.items[id].htmlElement.parentNode.parentNode
		if (parentElem.style.visibility!="hidden")
		{
			var action = this.items[id].htmlElement.firstChild.getAttribute("action")
			var disabled = this.items[id].htmlElement.firstChild.getAttribute("lawdisabled")
			if (action && (disabled ? disabled != "true" : true))
			{
				this.changeItemState(id,"FOCUS")
				break;	// only want the first!
			}
		}
	}
}
NavletObject.prototype.selectLast=function()
{
	var len=this.items.length
	var i = -1;
	for (id in this.items)
	{
		i++
		if ( i < len-1) continue;
		if (this.items[id] != null)
			this.changeItemState(id,"FOCUS")
	}
}
NavletObject.prototype.selectNext=function(curId)
{
	var next=""
	for (var id in this.items)
	{
		if (next != "")
		{
			var action = this.items[id].htmlElement.firstChild.getAttribute("action")
			var disabled = this.items[id].htmlElement.firstChild.getAttribute("lawdisabled")
			if (action && (disabled ? disabled != "true" : true))
			{
				this.changeItemState(id,"FOCUS")
				return id;
			}
		}
		if (id == curId)
			next = id;
	}
	return null;
}
NavletObject.prototype.selectPrevious=function(curId)
{
	var prev=""
	for (var id in this.items)
	{
		if (id != curId)
		{
			var action = this.items[id].htmlElement.firstChild.getAttribute("action")
			var disabled = this.items[id].htmlElement.firstChild.getAttribute("lawdisabled")
			if (action && (disabled ? disabled != "true" : true))
				prev=id
		}
		if (id == curId)
		{
			if (prev == "") return null;
			this.changeItemState(prev,"FOCUS")
			return prev;
		}
	}
	return null;
}
NavletObject.prototype.removeItem=function(id)
{
	if (!this.items[id]) return;
	try{
		while (this.portalWnd.document.getElementById("LAWNAVITEM"+id))
		{
			var elem=this.portalWnd.document.getElementById("LAWNAVITEM"+id)
			this.itemContainer.childNodes[0].removeChild(elem.parentNode)
		}
		this.itemContainer.childNodes[0].removeChild(this.items[id].htmlElement)
		this.items[id].htmlElement
		this.items[id].htmlElement=null
	}catch(e){}
	this.items[id]=null
}
NavletObject.prototype.setHdrImage=function(on)
{
	this.hdrElement.style.backgroundImage = on ? this.dnImage : this.upImage;
}
NavletObject.prototype.setHdrMouseover=function(on)
{
	// always show hover (dko 8/12/2003)
	this.hdrElement.onmouseover=this.portalWnd.navletMouseOver
	this.hdrElement.style.cursor="hand";
	this.setHdrImage(on);
}
NavletObject.prototype.show=function()
{
	this.NavWrapper.style.display="block"
	this.NavWrapper.style.visibility="visible"
}
//-----------------------------------------------------------------------------
function prtlExpandCollapseNavigation()
{
	if (oPortalConfig.isPortalLessMode() &&! lawsonPortal.isPortalPage) return;
	var bVisible=lawsonPortal.tabArea.getVisibleState();
	lawsonPortal.tabArea.setVisibleState(!bVisible);
}

function navletClick(e)
{
	var evt=e?e:window.event
	var evtTarget=getEventElement(evt)
	var targetObj=null

	if (oBrowser.isIE)
		targetObj=event.srcElement.parentElement.parentElement
	else
		targetObj=e.currentTarget.parentNode.parentNode
	var navletID=targetObj.id
	targetObj=portalWnd.document.getElementById("BODY"+targetObj.id).childNodes[0]
	if (!targetObj) return;

	if (targetObj.style.display=="none")
	{
		// open the closed navlet
		var activeTab=lawsonPortal.tabArea.getActivePaneName();
		targetObj.style.display="block"
		targetObj.parentNode.style.visibility="visible"
		evtTarget.style.cursor="default"
		lawsonPortal.tabArea.tabs[activeTab].navletObjects[navletID].selectFirst()
		lawsonPortal.tabArea.tabs[activeTab].navletObjects[navletID].setHdrImage(false);
	}
	else
	{
		// close the open navlet
		var activeTab=lawsonPortal.tabArea.getActivePaneName();
		targetObj.style.display="none"
		targetObj.parentNode.style.visibility="hidden"
		evtTarget.style.cursor="hand"
		evtTarget.onmouseover=navletMouseOver;
		lawsonPortal.tabArea.tabs[activeTab].navletObjects[navletID].selectFirst()
		lawsonPortal.tabArea.tabs[activeTab].navletObjects[navletID].setHdrImage(true);
	}
}
function navletMouseOver(e)
{
	try {
		var evt=e?e:window.event
		var evtTarget=getEventElement(evt)
		evtTarget.className="xTNavHeadHover"

		var targetObj=null
		if (oBrowser.isIE)
			targetObj=evt.srcElement.parentElement.parentElement
		else
			targetObj=evt.currentTarget.parentNode.parentNode

		var navletID=targetObj.id;
		var activeTab=lawsonPortal.tabArea.getActivePaneName();
		var navWrap = lawsonPortal.tabArea.tabs[activeTab].navletObjects[navletID].NavWrapper;

		var img = portalWnd.document.getElementById("glow"+activeTab);
		img.style.top = navWrap.offsetTop-3;
		img.style.display="inline";

	} catch (e) { }
}
function navletMouseOut(e)
{
	try {
		var evt=e?e:window.event
		var evtTarget=getEventElement(evt)
		evtTarget.className="xTNavHead"

		var targetObj=null
		if (oBrowser.isIE)
			targetObj=evt.srcElement.parentElement.parentElement
		else
			targetObj=evt.currentTarget.parentNode.parentNode

		var navletID=targetObj.id;
		var activeTab=lawsonPortal.tabArea.getActivePaneName();
		var navWrap = lawsonPortal.tabArea.tabs[activeTab].navletObjects[navletID].NavWrapper;

		var img = portalWnd.document.getElementById("glow"+activeTab)
		img.style.display="none";

	} catch (e) { }
}

//-----------------------------------------------------------------------------
function NavTabPage(portalWnd,id,title,name)
{
	this.portalWnd=portalWnd;
	this.collapseState=0
	this.title=title
	this.id=id
	this.name=name
	this.navletObjects=new Object()
	this.htmlTab=this.portalWnd.document.getElementById(id)
	this.htmlPane=this.htmlTab
		? this.portalWnd.document.getElementById(this.htmlTab.getAttribute("pane"))
		: null;
	this.initImage="";
	this.visible=false;
}
NavTabPage.prototype.addNavlet=function(name,id,target,disTrans)
{
	this.navletObjects[id]=new NavletObject(this.portalWnd,id)
	this.navletObjects[id].title=name
	this.navletObjects[id].target=target
	this.navletObjects[id].tabId=this.name
	this.navletObjects[id].id=id;

	var doc=this.portalWnd.document;
	var wrapper = doc.createElement("DIV");
	wrapper.style.visibility="visible"
	wrapper.style.display="block"

	var oTable = doc.createElement("TABLE");
	oTable.setAttribute("navid",id)
	var oTHead = doc.createElement("THEAD");
	var oTBody0 = doc.createElement("TBODY");
	var oRow, oCell;
	var i, j;
	oTable.width="97%"
	oTable.cellSpacing="0"
	oTable.style.margin="0px"
	oTable.style.marginBottom="5px"

	oTable.appendChild(oTHead);
	oTable.appendChild(oTBody0);

	oTable.border=0;

	oRow = doc.createElement("TR");
	oTHead.appendChild(oRow);
	oTHead.id=id

	oCell = doc.createElement("TD");
	this.navletObjects[id].hdrElement=oCell;
	if(typeof(disTrans)!="undefined")
		txt = doc.createTextNode(this.portalWnd.lawsonPortal.getPhrase(disTrans));
	else
		txt = doc.createTextNode(name);
	oCell.className="xTNavHead"
	oCell.style.backgroundImage=this.initImage;
	oCell.style.backgroundPosition="right";
	oCell.style.backgroundRepeat="no-repeat";
	oCell.onclick=this.portalWnd.navletClick;
	oCell.onmouseout=this.portalWnd.navletMouseOut;
	oCell.onmouseover=this.portalWnd.navletMouseOver;
	oCell.onselectstart=this.portalWnd.cmnBlockSelect;
	oCell.appendChild(txt)
	oRow.appendChild(oCell);

	oRow = doc.createElement("TR");
	oTBody0.appendChild(oRow);
	oCell = doc.createElement("TD");
	oCell.className="xTNavBody"
	oCell.id="BODY"+id
	oRow.appendChild(oCell);

	var oCell2 = doc.createElement("div");
	oCell2.setAttribute("tabid",this.name)
	oCell.appendChild(oCell2);

	this.navletObjects[id].itemContainer=oCell

	this.navletObjects[id].htmlElement=oTable
	wrapper.appendChild(oTable)
	this.navletObjects[id].NavWrapper=wrapper
	this.htmlPane.appendChild(wrapper);

	return this.navletObjects[id]
}
NavTabPage.prototype.clearNavlets=function()
{
	var len=this.htmlPane.childNodes.length;
	for (var i=len-1; i > 0; i--)
	{
	  var oChild=this.htmlPane.childNodes[i];
	  this.htmlPane.removeChild(oChild);
	}
	delete this.navletObjects;
	this.navletObjects=new Object()
}
NavTabPage.prototype.collapseNavlets=function()
{
	for(id in this.navletObjects)
	{
		if(this.navletObjects[id]!=null)
			this.navletObjects[id].collapse();
	}
}
NavTabPage.prototype.expand_collapseNavlets=function()
{
	this.collapseState==0
		? this.collapseNavlets()
		: this.expandNavlets();
	this.collapseState==0
		? this.collapseState=1
		: this.collapseState=0;
	try {
		this.portalWnd.document.getElementById("findText").focus();
	} catch(e) { }
}
NavTabPage.prototype.expandNavlets=function()
{
	for(id in this.navletObjects)
	{
		if(this.navletObjects[id]!=null)
			this.navletObjects[id].expand();
	}
}
NavTabPage.prototype.getNavlet=function(id)
{
	return this.navletObjects[id];
}
NavTabPage.prototype.getTitle=function()
{
	return this.htmlTab.title
}
NavTabPage.prototype.setTitle=function(newTitle)
{
	var mTitle=newTitle+""
if (mTitle.length > 8)
		mTitle=mTitle.substring(0,6) + String.fromCharCode(8230)
	this.htmlTab.firstChild.nodeValue=mTitle
	this.htmlTab.title=newTitle
}
NavTabPage.prototype.hide=function()
{
	this.visible = false;
	this.htmlTab.parentNode.style.visibility="hidden";
	this.htmlTab.parentNode.style.display="none";
}
NavTabPage.prototype.selectNext=function(curId)
{
	var next=""
	var curFound=false;
	for (var id in this.navletObjects)
	{
		if (curFound && this.navletObjects[id] != null)
			next=id
		if (id == curId)
			curFound=true;
		if (next != "")
		{
			if (this.navletObjects[next].itemContainer.firstChild.style.display=="none")
				this.navletObjects[next].expand()
			this.navletObjects[next].selectFirst()
			return next;
		}
	}
	return null;
}
NavTabPage.prototype.selectPrevious=function(curId)
{
	var prev=""
	for (var id in this.navletObjects)
	{
		if (id != curId
		&& id.indexOf("lawformdatadir") == -1
		&& this.navletObjects[id] != null)
			prev=id
		if (id == curId)
		{
			if (prev == "") return (null);
			if (this.navletObjects[prev].itemContainer.firstChild.style.display=="none")
				this.navletObjects[prev].expand()
			this.navletObjects[prev].selectLast()
			return prev;
		}
	}
	return null;
}
NavTabPage.prototype.removeNavlet=function(id)
{
	if (!this.navletObjects[id]) return;
	try{
		this.htmlPane.removeChild(this.navletObjects[id].NavWrapper)
		this.navletObjects[id].target=null
		this.navletObjects[id].NavWrapper=null
		this.navletObjects[id].itemContainer=null
		this.navletObjects[id].htmlElement=null
	}catch(e){}
	this.navletObjects[id]=null
}
NavTabPage.prototype.show=function()
{
	this.visible = true;
	this.portalWnd.lawsonPortal.tabArea.switchActiveLeftPaneById(this.id)
}

//-----------------------------------------------------------------------------
//-- start tabobj object code
function TabObject(portalWnd)
{
	this.portalWnd=portalWnd;
	this.loaded=false
	this.tabs=new Object()
	this.tabs["HOME"]=new NavTabPage(portalWnd,"dt1","","HOME")
	this.tabs["MENU"]=new NavTabPage(portalWnd,"dt3","","MENU")
	this.tabs["PAGE"]=new NavTabPage(portalWnd,"dt2","","PAGE")
	this.switchActiveLeftPaneById(this.tabs["HOME"].id)
	this.visible=false;
	this.saveState=this.visible;
	this.size="200px";
	this.loaded=true;
}
TabObject.prototype.collapse=function()
{
	if (!this.visible)
	{
		sizePortalStuff();
		return;
	}
	if (oPortalConfig.isPortalLessMode() && !lawsonPortal.isPortalPage) return;

	var leftBar=this.portalWnd.document.getElementById("leftLinks");
	leftBar.style.width="0px"
	leftBar.style.display="none"
	var leftGrip=portalWnd.document.getElementById("leftGrip")
	var rightGrip=portalWnd.document.getElementById("rightGrip")
	if (leftGrip)
		leftGrip.style.display="inline";
	if (rightGrip)
		rightGrip.style.display="none";
	sizePortalStuff()
	this.visible=false
}
TabObject.prototype.expand=function()
{
	if (this.visible)
	{
		sizePortalStuff();
		return;
	}
	if (oPortalConfig.isPortalLessMode() && !lawsonPortal.isPortalPage) return;

	var leftBar=this.portalWnd.document.getElementById("leftLinks");
	leftBar.style.width=this.size
	leftBar.style.display="block"
	var leftGrip=portalWnd.document.getElementById("leftGrip")
	var rightGrip=portalWnd.document.getElementById("rightGrip")
	if (leftGrip)
		leftGrip.style.display="none";
	if (rightGrip)
		rightGrip.style.display="inline";
	sizePortalStuff()
	this.visible=true
}
TabObject.prototype.getActivePaneName=function()
{
	var tab=1
	var tabName="HOME"
	try {
		tab=parseInt(this.activeTab.getAttribute("id").substr(2))
		switch (tab)
		{
		case 1:
			tabName="HOME"
			break;
		case 2:
			tabName="PAGE"
			break;
		case 3:
			tabName="MENU"
			break;
		}
	} catch (e) { }
	return tabName;
}
TabObject.prototype.getVisibleState=function()
{
	return this.visible;
}
TabObject.prototype.setVisibleState=function(bShow)
{
	if (typeof(bShow) != "boolean")
		bShow=true;
	if (bShow) this.expand();
	else this.collapse();
}
TabObject.prototype.initializeDisplay=function()
{
	// 0=first, 1=all, 2=restore
	var oProfile=this.portalWnd.oUserProfile;
	var navPref=(oProfile ? oProfile.getPreference("autonavlet") : "1");
	if (navPref == "1") return;

	// insure only first navlet open and select its first item
	// (only applies to home page)
	var tabName = this.getActivePaneName();
	if (tabName!="HOME") return;

	var oTab = this.tabs[tabName]
	if (oTab)
	{
		if (navPref == "0")			// open first only
		{
			var firstFound=false;
			for (var navObj in oTab.navletObjects)
			{
				if (!firstFound && oTab.navletObjects[navObj] != null)
				{
					firstFound=true;
					oTab.navletObjects[navObj].expand();
					oTab.navletObjects[navObj].selectFirst()
				}
				else if (oTab.navletObjects[navObj] != null)
					oTab.navletObjects[navObj].collapse()
			}
		}
		else						// restore each navlet
		{
			for (var navObj in oTab.navletObjects)
			{
				if (oTab.navletObjects[navObj] == null)
					continue;
				if (oProfile.getNavletState(navObj) == "1")
					oTab.navletObjects[navObj].expand();
				else
					oTab.navletObjects[navObj].collapse()
			}
		}
	}
}
TabObject.prototype.saveVisibleState=function()
{
	this.saveState=this.getVisibleState();
}
TabObject.prototype.restoreVisibleState=function()
{
	this.setVisibleState(this.saveState);
}
TabObject.prototype.selectFirst=function()
{
	// set focus to first navlet item of active tab
	var tabName = this.getActivePaneName();
	var oTab = this.tabs[tabName]
	if (oTab)
	{
		var bFirstFound=false;
		for (var navObj in oTab.navletObjects)
		{
			if (oTab.navletObjects[navObj] != null
				&& oTab.navletObjects[navObj].itemContainer.style.visibility!="hidden")
			{
				oTab.navletObjects[navObj].selectFirst()
				bFirstFound=true;
				break;
			}
		}
		if (!bFirstFound)
		{
			for (var navObj in oTab.navletObjects)
			{
				if (oTab.navletObjects[navObj] != null)
				{
					oTab.navletObjects[navObj].expand();
					oTab.navletObjects[navObj].selectFirst();
					break;
				}
			}
		}
	}
}
TabObject.prototype.switchActiveLeftPane=function(inc)
{
	var tab=1
	var tabName="HOME"
	try {
		tab=parseInt(this.activeTab.getAttribute("id").substr(2))
	} catch (e) { }

	// tabs not named sequentially
	var div3=this.portalWnd.document.getElementById("divLeftTop3");
	var div2=this.portalWnd.document.getElementById("divLeftTop2");
	if (inc == 1)		// tab page down
	{
		switch (tab)
		{
		case 1:
		 	if (div3.style.visibility != "hidden")
			{
				this.switchActiveLeftPaneById("dt3")
				tabName="MENU"
			}
		 	else if (div2.style.visibility != "hidden")
			{
				this.switchActiveLeftPaneById("dt2")
				tabName="PAGE"
			}
			break;
		case 2:
			// do nothing: always the last tab
			tabName="PAGE"
			break;
		case 3:
		 	if (div2.style.visibility != "hidden")
			{
				this.switchActiveLeftPaneById("dt2")
				tabName="PAGE"
			}
			break;
		}
	}
	else				// tab page up
	{
		switch (tab)
		{
		case 1:
			// do nothing: always the first tab
			break;
		case 2:
		 	if (div3.style.visibility != "hidden")
			{
				this.switchActiveLeftPaneById("dt3")
				tabName="MENU"
			}
		 	else
				this.switchActiveLeftPaneById("dt1")
			break;
		case 3:
			this.switchActiveLeftPaneById("dt1")
			break;
		}
	}
	// set focus to first navlet item
	if (this.activeTab.collapseState != 1)
		this.selectFirst();
}
TabObject.prototype.switchActiveLeftPaneById=function(id)
{
	var tabObj=this.portalWnd.document.getElementById(id)
	if(this.loaded && (this.activeTab==tabObj))
	{
 		this.activeTab.parentNode.style.visibility="visible"
		this.activeTab.parentNode.style.display="inline"
 		return
 	}
	if (this.activeTab)
	{
		this.activeTab.className="ptNavButtonInactive"
		this.activeTab.previousSibling.src="images/edge5lt.gif"
		this.activeTab.nextSibling.src="images/edge5rt.gif"
	}
	if (this.activePane)
	{
		this.activePane.style.visibility="hidden"
		this.activePane.style.display="none"
	}
	this.activeTab=null
	this.activeTab=tabObj
	this.activePane=null
	if (this.activeTab)
	{
		this.activePane=this.portalWnd.document.getElementById(this.activeTab.getAttribute("pane"))

		this.activeTab.parentNode.style.visibility="visible"
		this.activeTab.parentNode.style.display="inline"

		this.activeTab.className="ptNavButtonActive"
		this.activeTab.previousSibling.src="images/edge3lt.gif"
		this.activeTab.nextSibling.src="images/edge3rt.gif"
		this.activePane.style.display="block"
		this.activePane.style.visibility="visible"
	}
	tabObj=null
}
//-- end tabobj object code
//-----------------------------------------------------------------------------


//-----------------------------------------------------------------------------
//-- start phrase object code
function phraseObj(phName,portalWnd)
{
	this.portalWnd=(typeof(portalWnd) == "undefined"
		? envFindObjectWindow("lawsonPortal")
		: portalWnd);
	this.language=oUserProfile.getAttribute("portallanguage");
	this.iosVersion=this.portalWnd.oPortalConfig.getShortIOSVersion();

	try {
		var path=this.portalWnd.lawsonPortal.path+"/data/msgs/"+
				this.language+"/"+phName+".xml"
		if (!this.loadFromAppServer(phName))
		{
			if (!this.loadFromWebServer(path,phName))
				this.displayLoadErrMsg(path);
		}
	} catch(e) {
		this.phraseDoc=null;
		this.portalWnd.oError.displayExceptionMessage(e,PORTALJS,"phraseObj()");
	}
}
phraseObj.prototype.displayLoadErrMsg=function(fileName)
{
	var msg="Error loading phraseObj from path:\n"+fileName+"\n";
	if (this.phraseDoc && fileName.indexOf("httpstatus") == -1)
		msg+=this.portalWnd.oError.getHttpStatusMsg(this.phraseDoc.status)
	this.portalWnd.cmnDlg.messageBox(msg,"ok","alert",this.portalWnd);
	this.phraseDoc=null;
}
phraseObj.prototype.getLanguage=function()
{
	return this.language;
}
phraseObj.prototype.getPhrase=function(ID)
{
	var ret="";
	var phNode=null;
	try {
		if (this.portalWnd.oBrowser.isIE)
			phNode=this.phraseDoc.selectSingleNode("LAWXML/Translate/*[@id='"+ID+"']")
		else
		{
			// non-IE browsers
			phNode=this.phraseDoc.getElementById(ID);
			if (!phNode)
			{
				var msgs=this.phraseDoc.getElementsByTagName("Translate");
				msgs=msgs[0].childNodes;
				for (var i=0; i < msgs.length; i++)
				{
					if (msgs[i].nodeType==1 && msgs[i].getAttribute("id")==ID)
					{
						phNode=msgs[i];
						break
					}
				}
			}
		}

		// phrases may have been XML-encoded, need to transform to HTML-encoded
		if (phNode && phNode.childNodes.length > 0)
			ret = phNode.firstChild.nodeValue.replace(/&amp;/g, "&");
		else
			ret = ID;

	} catch(e) {
		ret = ID;
	}
	return ret;
}
phraseObj.prototype.getXML=function()
{
	if (this.portalWnd.oBrowser.isIE)
		return this.phraseDoc.xml;

	var y=new XMLSerializer
	var str=y.serializeToString(this.phraseDoc)
	return str
}
phraseObj.prototype.loadFromAppServer=function(fileName)
{
	if (!this.portalWnd.fileMgr)
		return false;

	// since FileMgr won't let me prefix a filename with a folder I have to parse
	var folder=this.portalWnd.lawsonPortal.path+"/data/msgs/"+this.language;
	var folderXtra="";
	var file=fileName+".xml";
	var iPos=file.lastIndexOf("/");
	if (iPos != -1)
	{
		folderXtra=("/"+file.substr(0,iPos));
		file=file.substr(iPos+1);
	}

	// now call FileMgr
	var oFile=this.portalWnd.fileMgr.getFile(folder+folderXtra,file,"text/xml",false);
	if (this.language != "en-us")
	{
		if ( (!oFile || oFile.status)
		|| (this.portalWnd.fileMgr.isFileNotFoundStatus(oFile)) )
		{
			// default to english if not found
			folder=this.portalWnd.lawsonPortal.path+"/data/msgs/en-us";
			oFile=this.portalWnd.fileMgr.getFile(folder+folderXtra,file,"text/xml",false);
		}
	}
	if ( (!oFile || oFile.status)
	|| (this.portalWnd.fileMgr.isFileNotFoundStatus(oFile)) )
		return false;

	this.phraseDoc=oFile;
	return true;

}
phraseObj.prototype.loadFromWebServer=function(filePath,fileName)
{
	var path=filePath;
    this.phraseDoc=this.portalWnd.httpRequest(path,null,"","",false);
	if ((this.phraseDoc==null || this.phraseDoc.status) && this.language != "en-us")
	{
		// default to english if not found
		path=this.portalWnd.lawsonPortal.path+"/data/msgs/en-us/"+fileName+".xml"
	    this.phraseDoc=this.portalWnd.httpRequest(path,null,"","",false);
	}
	return (this.phraseDoc==null || this.phraseDoc.status) ? false : true;
}
//-- end phrase object code
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// navlet item context menu
function showNavletContextMenu(navItemId,x,y)
{
	var navElem = portalWnd.document.getElementById(navItemId)
	if (!navElem) return;

	if (trim(navElem.getAttribute("lawdisabled"))=="true")
		return;
	var navID=navElem.getAttribute("container")
	var tabID=navElem.parentNode.parentNode.getAttribute("tabid")
	var action=trim(navElem.getAttribute("action")).replace(/\n|\r/g,"")

	var portalPath=portalWnd.document.location.protocol +
			"//" + portalWnd.document.location.host + lawsonPortal.path;
	iWindow.dropObj.clearItems()
	var bShowOpen=true;
	var bShowNewWin=true;
	var openAction=tabID+"|"+navID+"|"+action
	var newWinAction=action
 	var func="CONTEXT";

	if (action.indexOf("switchContents")==0)
	{
 		func="";
		openAction=action.substr(16);
		openAction=openAction.substr(0,openAction.length-2);
		newWinAction=(openAction.substr(0,4).toLowerCase() == "http"
			? openAction
			: portalPath+"/index.htm?_URL="+openAction);
	}
	else if (action.indexOf("formTransfer")==0)
	{
		var str=action.substr(14);
		str=str.substr(0,str.length-2);
		var args=str.split("','");
		newWinAction=portalPath+"/index.htm?_TKN="+args[0] + "&_PDL="+args[1];
	}
	else if (action.indexOf("lawformDoTransfer")==0)
	{
		newWinAction=action.substr(19);
		newWinAction=newWinAction.substr(0,newWinAction.length-2);
		newWinAction=portalPath+"/index.htm?_TKN="+newWinAction + "&_PDL=" +
				oUserProfile.getAttribute("productline")
	}
	else if (isJobLink(action))
		newWinAction=getJobLink(action);
	else
		bShowNewWin=false;

	if (navID == "lawshortcuts"
	|| navID == "lawformactions"
	|| navID == "lawformpages")
		bShowNewWin=false;

	// add menu item(s)
	var openStr=lawsonPortal.getPhrase("LBL_OPEN");
	var openNewStr=lawsonPortal.getPhrase("LBL_OPEN_IN_NEW_WINDOW")
	if (bShowOpen)
	{
		iWindow.dropObj.addItem(openStr, null,
			func, iWindow.dropObj.trackMenuClick, openAction, 0, 0);
	}
	if (bShowNewWin)
	{
		iWindow.dropObj.addItem(openNewStr, null,
			"CONTEXTWIN", iWindow.dropObj.trackMenuClick, newWinAction, null, null);
	}
	dateSL=navElem
	var initialSelect=(bShowOpen ? openStr : openNewStr);
	iWindow.dropObj.showIframe(initialSelect,navElem,"dropObj.portalWnd.menuCallback",x,y)
}


//-----------------------------------------------------------------------------
// drop down menu logic
function storeWin(win)
{
	iWindow=win
}
function showDrop(mElement)
{
	if (mElement.className == "xTToolButtonHighlight")
		mElement.className = "xTToolButton";
	if (mElement.className == "buttonOver")
		mElement.className = "";

	// fixup the rollover icons
	var evtComp=null;
	switch (mElement.id)
	{
		case "LAWMENUBTNSEARCH":
			evtComp = portalWnd.document.getElementById("LAWMENUBTNSEARCH2");
			evtComp.className = "xTToolButton";
			setSrchButtonIcon(evtComp,false)
			break;

		case "LAWMENUBTNPREF":
			evtComp = portalWnd.document.getElementById("LAWMENUBTNPREF")
			evtComp.style.backgroundImage = "url('"+lawsonPortal.path+"/images/ico_preferences.gif')";
			break;

		case "LAWMENUBTNHELP":
			evtComp = portalWnd.document.getElementById("LAWMENUBTNHELP")
			evtComp.style.backgroundImage = "url('"+lawsonPortal.path+"/images/ico_help.gif')";
			break;

	}

	var menuSelect="";
	iWindow.dropObj.clearItems()
	var roleDoc=portalWnd.oUserProfile.oRole.storage.getRootNode();
	var menuitems=roleDoc.getElementsByTagName("MENU")
	var items=null
	var mLen=menuitems ? menuitems.length : 0;

	for (var i=0; i < mLen; i++)
	{
		if (menuitems[i].getAttribute("id") != mElement.id)
			continue;

		items=menuitems[i].getElementsByTagName("ITEM")
		var iLen = items ? items.length : 0;
		for (var x=0; x < iLen; x++)
		{
			var HTMLParm=""
			if (menuitems[i].getAttribute("type")=="SEARCH")
				HTMLParm=portalWnd.document.getElementById("findText").value
			var menuText = lawsonPortal.getPhrase(items[x].getAttribute("labelid"))
			if (!menuText || menuText == "")
				menuText=items[x].getAttribute("labelid")
			menuAction=items[x].getAttribute("action")
			menuClick=iWindow.dropObj.trackMenuClick
			menuHref=portalWnd.processURLString(items[x].getAttribute("href")) + HTMLParm
			iWindow.dropObj.addItem(menuText, null, menuAction, menuClick, menuHref,
				items[x].getAttribute("height"), items[x].getAttribute("width"))
		}
		if(mElement.id=="LAWMENUBTNHELP")
		{
			for (id in lawsonPortal.helpOptions.items)
			{
				if(!lawsonPortal.helpOptions.items[id])
					continue
				var menuText = lawsonPortal.helpOptions.items[id].caption
				menuAction=lawsonPortal.helpOptions.items[id].callback
				menuClick=iWindow.dropObj.trackMenuClick
				menuHref="CUSTOMHELP"
				iWindow.dropObj.addItem(menuText,null,menuAction,menuClick,menuHref)
			}
		}
		break
	}
	if (!items) return;
	if (!items[0])
		{
			msg = lawsonPortal.getPhrase("LBL_SEARCH_OPTIONS_ERROR");
			portalWnd.cmnDlg.messageBox(msg,"ok","info",portalWnd);
			return;
		}
	if (menuSelect=="")
		menuSelect=lawsonPortal.getPhrase(items[0].getAttribute("labelid"))
	dateSL=mElement
	iWindow.dropObj.showIframe(menuSelect,mElement,"dropObj.portalWnd.menuCallback")
}

function menuCallback()
{
	try {
		dateSL.focus()
	} catch (e) { }
}

//-----------------------------------------------------------------------------
// drill container drag code
function mdragStart(event, id)
{
 	var el;
  	var x, y;

    dragObj.elNode = (oBrowser.isIE ? window.event.srcElement : event.target);
    if (dragObj.elNode.nodeType == 3)
      	dragObj.elNode = dragObj.elNode.parentNode;

	if (oBrowser.isIE)
	{
		x = window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
		y = window.event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
	}
	else
	{
		x = event.clientX + window.scrollX;
		y = event.clientY + window.scrollY;
	}

	if(event.clientY-parseInt(dragObj.elNode.style.top, 10) >parseInt(dragObj.elNode.style.height, 10)-5)
		dragObj.type="resize"
	else
		dragObj.type="move"

	dragObj.cursorStartX = x;
	dragObj.cursorStartY = y;
	dragObj.elStartLeft  = parseInt(dragObj.elNode.style.left, 10);
	dragObj.elStartTop   = parseInt(dragObj.elNode.style.top,  10);
	dragObj.elStartWidth  = parseInt(dragObj.elNode.style.width, 10);
	dragObj.elStartHeight   = parseInt(dragObj.elNode.style.height,  10);

  	if (isNaN(dragObj.elStartLeft)) dragObj.elStartLeft = 0;
  	if (isNaN(dragObj.elStartTop))  dragObj.elStartTop  = 0;

  	if (oBrowser.isIE)
  	{
    	dragObj.elNode.setCapture()
    	document.attachEvent("onmousemove", mdragGo);
    	document.attachEvent("onmouseup",   mdragStop);
    	window.event.cancelBubble = true;
    	window.event.returnValue = false;
  	}
  	else
  	{
    	document.addEventListener("mousemove", mdragGo,   true);
    	document.addEventListener("mouseup",   mdragStop, true);
    	event.preventDefault();
  	}
}

function mdragGo(event)
{
  var x, y;

	// get cursor position
	if (oBrowser.isIE)
	{
		x = window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
		y = window.event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
	}
	else
	{
		x = event.clientX + window.scrollX;
		y = event.clientY + window.scrollY;
	}

	// Move drag element by the same amount the cursor has moved.
	if (dragObj.type=="resize")
	{
		try {
			dragObj.elNode.style.width = (dragObj.elStartWidth + x - dragObj.cursorStartX) + "px";
			dragObj.elNode.style.height = (dragObj.elStartHeight + y - dragObj.cursorStartY) + "px";

			if (parseInt(dragObj.elNode.style.height,10) > 1
			&& parseInt(dragObj.elNode.style.width,10) > 1)
			{
				frm=dragObj.elNode.getElementsByTagName("IFRAME")
				frm=frm[0]
				frm.style.width=parseInt(dragObj.elNode.style.width,10)+"px"
				hgt=parseInt(dragObj.elNode.style.height,10) - frm.offsetTop
				if (hgt>1)
					frm.style.height=hgt+ "px"
			}
		} catch(e) { } // size error
	}
	else
	{
		dragObj.elNode.style.left = (dragObj.elStartLeft + x - dragObj.cursorStartX) + "px";
		dragObj.elNode.style.top = (dragObj.elStartTop + y - dragObj.cursorStartY) + "px";
	}

	if (oBrowser.isIE)
	{
		window.event.cancelBubble = true;
		window.event.returnValue = false;
	}
	else
		event.preventDefault();
}

function mdragStop(event)
{
	// stop capturing mousemove and mouseup events
	if(parseInt(dragObj.elNode.style.top,10)<0)
		dragObj.elNode.style.top="0px"
	if(parseInt(dragObj.elNode.style.left,10)<0)
		dragObj.elNode.style.left="0px"
	if (oBrowser.isIE)
	{
		document.detachEvent("onmousemove", mdragGo);
		document.detachEvent("onmouseup",   mdragStop);
		document.releaseCapture()
	}
	else
	{
		document.removeEventListener("mousemove", mdragGo,   true);
		document.removeEventListener("mouseup",   mdragStop, true);
	}
}

//-----------------------------------------------------------------------------
function getHome()
{
	return (lawsonPortal && lawsonPortal.homePage
		? lawsonPortal.homePage
		: "home.htm");
}
//-----------------------------------------------------------------------------
function goBack()
{
	portalWnd.switchContents(lawsonPortal.backURL);
}
//-----------------------------------------------------------------------------
function goHome()
{
	portalObj = portalWnd.lawsonPortal
	var blockNodes = portalObj.profile.getElementsByTagName("BLOCK");
	if (blockNodes.length == 0)
		portalWnd.switchContents(portalWnd.getHome());
	else
		portalWnd.switchContents("home.htm");
	lawsonPortal.tabArea.tabs["HOME"].show();
}

function goHome2()
{
	URL = getFullUrl(lawsonPortal.path);
	portalWnd.location.reload(URL);
}


//-----------------------------------------------------------------------------
function portalOnPrint(evt,wnd)
{
	// note: event object (evt) for non-IE compatibility.  to use this method
	// from a non-Portal context (ie. a popup window) pass null for evt and a
	// window reference as second parameter.

	// do we have a function to get print content from?
	var contentWnd=(typeof(wnd) == "undefined"
		? (lawsonPortal.drill.mode ? window.frames[1] : window.frames[0]) : wnd);
	if (typeof(contentWnd.cntxtGetPrintContent) == "function")
	{
		var strHTML=contentWnd.cntxtGetPrintContent();
		if (strHTML)
		{
			printMgr.showPrintWnd(strHTML,contentWnd);
			return;
		}
	}

	if (typeof(wnd) == "undefined")
		portalWnd.print();
}
//-----------------------------------------------------------------------------
function portalChangePassword()
{
	try {
		var ssoAuthObj = new portalWnd.SSOAuthObject();	// get singleton auth object
		ssoAuthObj.changePassword();

	} catch (e) {
		oError.displayExceptionMessage(e,PORTALJS,"portalChangePassword");
	}
}
//-----------------------------------------------------------------------------
function portalShowAbout()
{
	try {
		if (aboutWnd && !aboutWnd.closed)
		{
			aboutWnd.focus()	// forces restore if minimized
			return;
		}
	} catch (e) { }

	// prepare to open modal window
	var modWidth = 500;
	var modHeight = 417;
	var modLeft = parseInt((screen.width / 2) - (modWidth / 2), 10);
	var modTop = parseInt((screen.height / 2) - (modHeight / 2), 10);
	if (oBrowser.isIE)
	{
		window.showModalDialog(lawsonPortal.path+"/about.htm", new Array(window),
				"dialogLeft:" + modLeft + "px;dialogTop:" + modTop +
				"px;dialogWidth:" + modWidth + "px;dialogHeight:" + modHeight +
				"px;status:0;help:0;");
	}
	else
	{
		window.open(lawsonPortal.path+"/about.htm", "aboutWindow", "left=" + modLeft +
				",top=" + modTop + ",width=" + modWidth + ",height=" +
				modHeight + ",modal");
	}
}
//-----------------------------------------------------------------------------
function portalShowHotkeyHelp()
{
	try {
		hotkeyWnd.focus()		// forces restore if minimized
		hotkeyWnd.document.getElementById("btnClose").focus()
		return;
	} catch (e) { }

	hotkeyWnd=portalWnd.open(lawsonPortal.path+"/hotkeys.htm", "_blank",
		"height=550,width=480,status=no,resizable=yes")
}
//-----------------------------------------------------------------------------
function portalShowSupport()
{
	portalWnd.open("http://mylawson.lawson.com", "_blank", "");
}
//-----------------------------------------------------------------------------
function portalHelpError()
{
	// New form help was not found: re-route to form frame
	if (helpWnd && !helpWnd.closed)
	{
		helpWnd.close();
		helpWnd = null;
	}
	portalWnd.frames[0].lawformFormHelp(true);
}
//-----------------------------------------------------------------------------
function portalShowUserHelp()
{
	portalShowHelpFile("portal_user_help.xml");
}
//-----------------------------------------------------------------------------
function portalShowAdminHelp()
{
	portalShowHelpFile("portal_admin_help.xml");
}
//-----------------------------------------------------------------------------
function portalShowHelpFile(file)
{
	if(!portalIsUserSSOActive(true))
	{
		portalLogout();
		return false;
	}
	
	var strLang = lawsonPortal.getLanguage();
	var strURL="/servlet/Help?_LANG="+strLang+"&_FILE=portal/"+file +
				"&_PARMS=rootdir|"+lawsonPortal.path+"||onerror|portalAdminUserHelpError||";

	if (helpWnd && !helpWnd.closed && lastHelp==file)
		helpWnd.focus();
	else if (helpWnd && !helpWnd.closed)
	{
		lastHelp=file;
		helpWnd.navigate(strURL);
		helpWnd.focus();
	}
	else
	{
		lastHelp=file;
		helpWnd = portalWnd.open(strURL, "_blank", "top=5,left=" + (screen.width-570) +
				",width=560,height=" + (screen.height-100) +
				",status=no,resizable=yes,scrollbars=no");
	}
}
//-----------------------------------------------------------------------------
function portalAdminUserHelpError()
{
	// admin/user help not found or other error
	helpWnd.close();
	// help window won't close (when we use cmnDlg) without this:
	setTimeout("portalAdminUserHelpError2()",1);
}
function portalAdminUserHelpError2()
{
	portalWnd.focus();		// why should I need to do this? ...but I do!
	var msg=portalWnd.lawsonPortal.getPhrase("msgErrorCallingHelp") + " " + lastHelp;
	cmnDlg.messageBox(msg,"ok","alert",portalWnd);
}

//-----------------------------------------------------------------------------
function knUploadComplete(statusArray)
{
	var msg = "";
	var len = statusArray.length;
	if (lawsonPortal.knPhrase != null)
	{
		for (var i=0; i<len; i++)
		{
			if (statusArray[i].length > 0)
			{
				if (statusArray[i][1] == false)
				{
					var phrase = lawsonPortal.knPhrase.getPhrase(statusArray[i][2]);
					msg += statusArray[i][0] + ": " + phrase + "\n";
				}
			}
		}

		if (msg.length > 0)
			portalWnd.cmnDlg.messageBox(msg);
		else
			portalWnd.cmnDlg.messageBox(lawsonPortal.knPhrase.getPhrase("MSG_KNUPLOADCOMPLETE") +
				"\n\n" + lawsonPortal.knPhrase.getPhrase("MSG_KN_NOTAVAILABLE"));
	}
	switchContents("knowledge/knowledge.htm?mode=upload&standlone=true")
}
