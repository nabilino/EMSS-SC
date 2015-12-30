/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/users/preferences/preferences.js,v 1.10.2.8.4.10.14.1.2.3 2012/08/08 12:37:27 jomeli Exp $ */
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

var portalWnd=null;
var portalObj=null;
var profile = null;
var oMsgs = null;
var oFeedBack = null;
var strUserPath = "";
var frmDisplayTabs = null;

//-----------------------------------------------------------------------------
function prfInit()
{
	portalWnd=envFindObjectWindow("lawsonPortal");
	portalObj=portalWnd.lawsonPortal;

	// load the script versions
	envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

	// validate user is active in SSO
	if (!portalWnd.portalIsUserSSOActive(true))
	{
		portalWnd.portalLogout();
		return;
	}

	profile = new portalWnd.UserProfile(portalWnd);
	oMsgs = new portalWnd.phraseObj("preferences");
	oFeedBack = new FeedBack(window, portalWnd);

	portalObj.setTitle(portalObj.getPhrase("btnUSEROPTIONS"));
	prfSetFrameworkState();

	frmDisplayTabs = document.getElementById("frmDisplayTabs");
	strUserPath = portalObj.path + "/data/users";

	document.body.style.visibility = "visible";
	portalObj.setMessage("");
	doBuildTabs();
}

//-----------------------------------------------------------------------------
function prfSetFrameworkState()
{
	with (portalObj.toolbar)
	{
		clear();
		target = window;
		createButton(oMsgs.getPhrase("btnOK"), doOK, "ok");
		createButton(oMsgs.getPhrase("btnApply"), doApply, "apply", "disabled");
		createButton(oMsgs.getPhrase("btnCancel"), doCancel, "cancel");
	}
}

//-----------------------------------------------------------------------------
function prfOnBeforeUnload(evt)
{
	// supported only by IE
	if (window.frames[0].tabMgr && window.frames[0].tabMgr.getModified())
		event.returnValue=oMsgs.getPhrase("msgCancelUnload");
}

//-----------------------------------------------------------------------------
function prfOnUnload()
{
	portalWnd.formUnload(true);
}

//-----------------------------------------------------------------------------
function prfOnResize()
{
	if (oFeedBack && typeof(oFeedBack.resize) == "function")
		oFeedBack.resize();
}

//-----------------------------------------------------------------------------
function prfOnKeyDown(evt)
{
    evt = portalWnd.getEventObject(evt,window);
    if (!evt) return false;

	// check with portal for hotkey action
	var action = portalWnd.getFrameworkHotkey(evt,"userprefs");
	if (!action)
	{
		// framework handled the keystroke
		portalWnd.setEventCancel(evt);
		return false;
	}

	// hotkey defined for this keystroke
	if (action != "userprefs")
	{
		cntxtActionHandler(evt,action);
		portalWnd.setEventCancel(evt);
		return false;
	}
}

//-----------------------------------------------------------------------------
function cntxtActionHandler(evt, action)
{
	if (action == null)		// called by the portal
	{
		if (typeof(window.frames[0].cntxtActionHandler) == "function")
			return (window.frames[0].cntxtActionHandler(evt,null));
		action = portalWnd.getFrameworkHotkey(evt, "userprefs");
		if (!action || action == "userprefs")
			return false;
	}

	var bHandled = false;
	switch (action)
	{
	case "doCancel":
        doCancel();
		bHandled = true;
		break;
	case "doSubmit":
        doBuildTabs();
		bHandled = true;
		break;
	case "openNewWindow":
		if (!portalWnd.oPortalConfig.isPortalLessMode())
		{
			var parms="?_URL=users/preferences/index.htm"+document.location.search;
			portalWnd.newPortalWindow(parms);
		}
		bHandled=true;
		break;
	}
	return (bHandled);
}

//-----------------------------------------------------------------------------
function doBuildTabs()
{
	document.body.style.cursor = "wait";
	oFeedBack.show();
	setTimeout("prfDoBuildTabs()", 50);
}

//-----------------------------------------------------------------------------
function prfDoBuildTabs()
{
	oFeedBack.show();
	frmDisplayTabs.style.display = "block";
	frmDisplayTabs.src = portalObj.path + "/objects/tabhost.htm?" +
		portalObj.path + "/users/preferences/preferences.xml";
}

//-----------------------------------------------------------------------------
function doOK()
{
	// validate user is active in SSO
	if (!portalWnd.portalIsUserSSOActive(true))
	{
		// if user did not re-authenticate, all changes lost
		window.frames[0].tabMgr.setModified(false);
		portalWnd.portalLogout();
		return;
	}

	if (!window.frames[0].tabMgr.getModified())
	{
		doCancel();
		return;
	}

	document.body.style.cursor = "wait";
	oFeedBack.show();
	setTimeout("prfDoOK()", 50);
	return;
}

//-----------------------------------------------------------------------------
function prfDoOK()
{
	prfDoApply(false);
	frmDisplayTabs.src = portalObj.path + "/blank.htm";
	frmDisplayTabs.style.display = "none";
	document.body.style.cursor = "auto";
	oFeedBack.hide();
	portalWnd.location.reload();
}

//-----------------------------------------------------------------------------
function doApply()
{
	// validate user is active in SSO
	if (!portalWnd.portalIsUserSSOActive(true))
	{
		// if user did not re-authenticate, all changes lost
		window.frames[0].tabMgr.setModified(false);
		portalWnd.portalLogout();
		return;
	}

	document.body.style.cursor = "wait";
	oFeedBack.show();
	setTimeout("prfDoApply(true)", 50);
}

//-----------------------------------------------------------------------------
function prfDoApply(hide)
{
	// call 'apply' on each tab (default implementation returns true)
	for (var t in window.frames[0].tabMgr.tabs)
		if (!window.frames[0].tabMgr.tabs[t].apply())
		{
			if (!hide) return;
			document.body.style.cursor = "auto";
			oFeedBack.hide();
			return;
		}

	// save the portal object
	if (!profile.save())
	{
		portalWnd.cmnDlg.messageBox(oMsgs.getPhrase("msgSaveError"),"ok","stop",window);
		if (!hide) return;
		document.body.style.cursor = "auto";
		oFeedBack.hide();
		return;
	}

	// now refresh the portal's UserProfile object
	if (!prfUpdatePortalProfile())
	{
		portalWnd.cmnDlg.messageBox(oMsgs.getPhrase("msgSaveError"),"ok","stop",window);
		if (!hide) return;
		document.body.style.cursor = "auto";
		oFeedBack.hide();
		return;
	}

	// reset flag on hotkeys: also resets the tab manager
	window.frames[0].tabMgr.tabs["tabHotkeys"].setModified(null,false);

	// rebuild shortcuts
	portalWnd.buildLeftCustomLinks();

	// reload hotkeys
	if (portalObj.keyMgr)
		portalObj.keyMgr.refresh();

	if (!hide) return;
	document.body.style.cursor = "auto";
	oFeedBack.hide();
}

//-----------------------------------------------------------------------------
function prfUpdatePortalProfile()
{
	// replace the portal's profile user data
 	var userNode = portalObj.profile.getElementsByTagName("PORTAL_USER");
 	userNode = (userNode && userNode.length == 1 ? userNode[0] : null);
	if (!userNode) return false;

	var contentNode=profile.storage.getRootNode();
	if (!contentNode) return false;
	var clNode=contentNode.cloneNode(true);
	userNode.parentNode.replaceChild(clNode,userNode);

	// call load on the
	return (portalWnd.oUserProfile.load());
}

//-----------------------------------------------------------------------------
function doCancel()
{
	// are there pending changes?
	if (window.frames[0].tabMgr.getModified())
	{
		var msg=oMsgs.getPhrase("msgSaveChanges");
		var retVal = portalWnd.cmnDlg.messageBox(msg,"yesno","question",window);
		if (retVal == "yes")
		{
			// validate user is active in SSO
			if (!portalWnd.portalIsUserSSOActive(true))
			{
				// if user did not re-authenticate, all changes lost
				window.frames[0].tabMgr.setModified(false);
				portalWnd.portalLogout();
				return;
			}
			prfDoApply(false);
		}
		else
			// to prevent a second prompt
			window.frames[0].tabMgr.setModified(false);
	}

	portalWnd.location.reload();
	if (!portalWnd.oPortalConfig.isPortalLessMode())
		portalWnd.goHome();
}

//-----------------------------------------------------------------------------
// callback from tabhost when tab construction complete
function tabInitialization()
{
	window.frames[0].tabMgr.tabs["tabHotkeys"].setMode("user");
	if (window.location.search.length > 2)
	{
		// set an initial tab
		var tab = window.location.search.substr(1);
		try {
			var elem = window.frames[0].document.getElementById(tab);
			window.frames[0].tabMgr.switchTab(elem);
		} catch (e) { }
	}
}