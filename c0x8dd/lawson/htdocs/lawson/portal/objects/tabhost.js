/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/objects/tabhost.js,v 1.9.2.8.4.9.14.2.2.3 2012/08/08 12:37:30 jomeli Exp $ */
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

var TABHOSTJS="objects/tabhost.js"		// filename constant for error handler

var portalWnd=null;
var portalObj=null;
var storage=null;

var tabMgr=null;
var tabXML=null;
var tabNodes=null;
var readyCount=0;
var retryCount=0;
var nMaxTabPages=0;			// will reflect number of tab pages
var MAX_RETRIES=20;			// max times to timeout waiting

//-----------------------------------------------------------------------------
function tabInit()
{
	// save reference to portalWnd and portalObj
	// (requires parent hosting this page to declare similar variables)
	portalWnd = parent.portalWnd;
	portalObj = portalWnd.lawsonPortal;
	var errMsg=portalObj.getPhrase("msgErrorLoadTabHost");

	// location search should specify path to xml
	// (assumes that CSS of same name will exist)
	var xmlPath = window.location.search.substr(1);
	if (xmlPath == "")
	{
		tabDisableOKApply();
		tabClearFeedback();
		var msg=errMsg+"\n"+portalObj.getPhrase("msgTabHostRequiresXML");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		return;
	}

	// load the tabs xml
	tabXML = portalWnd.httpRequest(xmlPath);
	if (!tabXML || tabXML.status)
	{
		tabDisableOKApply();
		tabClearFeedback();
		var msg=errMsg+"\n"+portalObj.getPhrase("ERROR_LOAD_XML")+" '"+xmlPath+"'.";
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		return;
	}
	tabXML=new portalWnd.DataStorage(tabXML,portalWnd);
	var tabsNode=tabXML.document.getElementsByTagName("TABS")
	if (tabsNode.length < 1)
	{
		tabDisableOKApply();
		tabClearFeedback();
		var msg=errMsg+"\n"+portalObj.getPhrase("msgTabHostRequiresTabs");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		return;
	}
	tabsNode=tabsNode[0];
	
	// set custom styles href
	var hasCss = tabsNode.getAttribute("hasCss");
	var cssPath=xmlPath.substr(0,xmlPath.length-3)+"css";
	if (hasCss != null && hasCss == "true")
	{
		try {
			document.createStyleSheet(cssPath);		// IE only
		} catch (e){ 
			var link = document.getElementById("CustomStyles");
			if (link) link.href=cssPath;
		}		
	}
	
	// get the folder path
	var iPos=xmlPath.lastIndexOf("/");
	var srcPath = xmlPath.substr(0,iPos+1);

	// create local copy of storage
	var storAttr=tabsNode.getAttribute("storage");
	storage = new portalWnd.DataStorage(eval(storAttr))

	var msgsAttr=tabsNode.getAttribute("msgs");
	var msgs=eval(msgsAttr);

	// instantiate tab page manager
	tabMgr=new TabPageMgr(portalWnd,window,eval(msgsAttr),
			storage,tabOnSwitchTab,tabOnReadyStateChange)

	// set the mode
	if (tabsNode.getAttribute("modal") == "1")
		tabMgr.setModalState();
	if (tabsNode.getAttribute("wizard") == "1")
		tabMgr.setWizardMode();

	// add the tabs
	tabNodes=tabXML.document.getElementsByTagName("TAB");
	if (tabNodes.length < 1)
	{
		tabDisableOKApply();
		tabClearFeedback();
		var msg=errMsg+"\n"+portalObj.getPhrase("msgTabHostRequiresTabs");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		return;
	}
	nMaxTabPages = tabNodes.length;
	var active = -1;
	for (var i = 0; i < nMaxTabPages; i++)
	{
		var src=(tabNodes[i].getAttribute("path")
			? portalObj.path+"/"+tabNodes[i].getAttribute("path")+"/"
			: srcPath);
		var condition=tabNodes[i].getAttribute("condition")
		try {
			if (condition==null || eval(condition))
				tabMgr.addTabPage( tabNodes[i].getAttribute("id"),
					msgs.getPhrase(tabNodes[i].getAttribute("lblid")),
					src+tabNodes[i].getAttribute("objid"),(++active == 0 ? true : false) );
			else
				tabMgr.createTabPageContainer( tabNodes[i].getAttribute("id"),
					src+tabNodes[i].getAttribute("objid"), false );
			
		} catch (e) { 
			portalWnd.oError.displayExceptionMessage(e,TABHOSTJS,"tabInit",window);
			continue;
		}
		
		var hasCss = tabNodes[i].getAttribute("hasCss");
		if (hasCss != null && hasCss == "true")
		{
			try {
		    	document.createStyleSheet(src+tabNodes[i].getAttribute("objid")+".css");
		    } catch (e){ 
			           // netscape
			  	var styleSh=document.createElement("link");
			    styleSh.setAttribute("type","text/css");
			    styleSh.setAttribute("rel","stylesheet");
			    styleSh.setAttribute("href",src+tabNodes[i].getAttribute("objid")+".css");
			    document.body.appendChild(styleSh);
		    }
	    }
	}

	// build the display
	document.body.style.visibility="visible"
	window.setTimeout("tabInitializeTabPages()",500)
}

//-----------------------------------------------------------------------------
// populate the tab pages
function tabInitializeTabPages()
{
	// all the script loaded?
	if (readyCount < nMaxTabPages)
	{
		if (!portalObj.browser.isIE)
			tabCreateTabObject();		// only way for netscrape
										// since it doesn't support readyState
		retryCount++;
		if (retryCount < MAX_RETRIES)
		{
			window.setTimeout("tabInitializeTabPages()",1000)
			return;
		}
		// this should not happen!  ...but at least
		// let's give the user some idea what happened when it does
		var msg=portalObj.getPhrase("msgErrorLoadTabHost") + "\n" +
			portalObj.getPhrase("msgErrorMaxTabPageRetry");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		portalWnd.goHome();
		return;
	}

	// call each tab page object's init method
	for (var t in tabMgr.tabs)
	{
		if (tabMgr.tabs[t] != null 
		&& typeof(tabMgr.tabs[t].init) == "function")
			tabMgr.tabs[t].init();
	}

	// post tab construction initialization
	if (typeof(parent.tabInitialization) == "function")
		parent.tabInitialization();

	// load the script versions
	envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

	// show the document
	tabClearFeedback();
	portalObj.toolbar.changeButtonState("cancel","enabled");
	tabMgr.tabs[tabMgr.activeTab.getAttribute("id")].activate();
}

//-----------------------------------------------------------------------------
function tabDisableOKApply()
{
	portalObj.toolbar.changeButtonState("ok","disabled");
	portalObj.toolbar.changeButtonState("apply","disabled");
}

//-----------------------------------------------------------------------------
function tabClearFeedback()
{
	document.body.style.cursor="auto";
	parent.oFeedBack.hide();
	portalObj.setMessage("")
}

//-----------------------------------------------------------------------------
// ready state change handler for tab page script files
function tabOnReadyStateChange(evt)
{
	evt=portalWnd.getEventObject(evt,window);
	var target=portalWnd.getEventElement(evt)
	if (!target) return;

	if (target.readyState == "loaded"
	|| target.readyState == "complete")
		tabCreateTabObject(target.id)
}

//-----------------------------------------------------------------------------
function tabCreateTabObject(scrId)
{
	if (typeof(scrId) == "undefined" && !portalObj.browser.isIE)
	{
		// only for netscrape which doesn't support readyState
		if (retryCount >= nMaxTabPages)
			return;
		scrId="scr"+tabNodes[retryCount].getAttribute("id");
			
	}
	var id="tab"+scrId.substr(3)
	var tab=tabXML.getNodeByAttributeId("TAB","id",scrId.substr(3));
	try {
		tabMgr.tabs[id]=eval("new " + tab.getAttribute("objid") + "(id,tabMgr)");
	} catch (e) { }

	// don't increment until objects instantiated
	readyCount++;
}

//-----------------------------------------------------------------------------
// onclick handler for tab button
function tabOnSwitchTab(evt)
{
	// tab page wants to kill the switch?
	if (!tabMgr.tabs[tabMgr.activeTab.id].deactivate())
		return;

	evt = portalWnd.getEventObject(evt,window)
	if (!evt) return;

	var obj=portalWnd.getEventElement(evt)
	tabMgr.switchTab(obj)
}

//-----------------------------------------------------------------------------
function tabOnResize(evt)
{
	if (tabMgr)
		tabMgr.sizeTabPages();
}

//-----------------------------------------------------------------------------
function tabOnKeyDown(evt)
{
	evt = portalWnd.getEventObject(evt)
	if (!evt) return false;

	// check with portal for hotkey action
	var bIsModal=tabMgr.getModalState();
	var action = (bIsModal
		? portalObj.keyMgr.getHotkeyAction(evt,"portal")
		: portalWnd.getFrameworkHotkey(evt,"tabpage"));

	if ( action == null && !bIsModal)
	{
		// framework handled the keystroke
		portalWnd.setEventCancel(evt)
		return false;
	}

	// hotkey defined for this keystroke
	if (action && action != "tabpage")
	{
		cntxtActionHandler(evt,action);
		portalWnd.setEventCancel(evt)
		return false;
	}

	// tab page wants to kill the keystroke?
	if (!tabMgr.tabs[tabMgr.activeTab.id].onKeyDown(evt))
		portalWnd.setEventCancel(evt);

	return false;
}

//-----------------------------------------------------------------------------
function cntxtActionHandler(evt,action)
{
	if (action==null)		// called by the portal
	{
		action = portalWnd.getFrameworkHotkey(evt,"tabpage");
		if (!action || action=="tabpage")
			return false;
	}

	var bHandled=false;
	switch (action)
	{
	case "doCancel":
        parent.doCancel()
		bHandled=true
		break;
	case "doSubmit":
        parent.doOK()
		bHandled=true
		break;
	case "doTabPageDn":
		tabMgr.incActiveTab(1)
		bHandled=true
		break;
	case "doTabPageUp":
		tabMgr.incActiveTab(-1)
		bHandled=true
		break;
	case "openNewWindow":
		bHandled=parent.cntxtActionHandler(evt,action);
		break;
	case "posInFirstField":
		tabMgr.tabs[tabMgr.activeTab.id].activate();
		bHandled=true
		break;
	}
	return (bHandled);
}

