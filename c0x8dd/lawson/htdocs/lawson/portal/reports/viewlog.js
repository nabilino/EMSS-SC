/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/reports/Attic/viewlog.js,v 1.1.2.6.4.7.8.1.2.3 2012/08/08 12:37:18 jomeli Exp $ */
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

var portalWnd = null;
var portalObj = null;
var viewPath = "/cgi-lawson/xviewlog.exe?";

function initJobView()
{
	portalWnd=envFindObjectWindow("lawsonPortal");
	if (!portalWnd)return;

	// load the script versions
	envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);
	
	portalObj=portalWnd.lawsonPortal;
	portalObj.setMessage("");
	var parms=unescape(window.location.search).substring(1).split("&");
	portalObj.setTitle(portalObj.getPhrase("LBL_JOB_LOG")+" "+parms[0]);

	with (portalObj.toolbar)
	{
		clear();
		target = window;
		createButton(portalObj.getPhrase("LBL_BACK"), "portalWnd.hideDrillFrame()","close","","","back");
		createButton(portalObj.getPhrase("LBL_PRINTABLE_VIEW"),portalWnd.portalOnPrint,"print");
		changeButtonTitle("print",portalObj.getPhrase("LBL_PRINT_THIS_PAGE"));
	}

	renderLogFile();
	portalWnd.frmPositionInToolbar();
}
//-----------------------------------------------------------------------------
function onUnloadJobView()
{
	try {
		portalWnd.hideDrillFrame();
	} catch (e) { }
}

//-----------------------------------------------------------------------------
function renderLogFile()
{
	var api=viewPath + unescape(window.location.search).substring(1) +
			"&NOCACHE=" + new Date().getTime()

	var oXml = portalWnd.httpRequest(api,null,null,null,false);

	var msg = portalObj.getPhrase("msgErrorReportedBy")+ " '" + viewPath +
				unescape(window.location.search).substring(1) + "'\n\n";
	if (portalWnd.oError.isErrorResponse(oXml,true,true,false,msg,window))
	{	
		portalWnd.hideDrillFrame();
		return;
	}
	
	var oDS = portalWnd.oError.getDSObject();
	var oDescrNode = oDS.getNodeByName("description");
	var logFileText = oDescrNode.firstChild.nodeValue;
	var re=/\n\n/gm
	logFileText=logFileText.replace(re, "\n")

	if(portalObj.browser.isIE)
	{
		var htm = "<pre id=\"jobInfo\" class=\"ptFixed\">" + logFileText + "</pre>"
		document.getElementById("jobInfo").outerHTML=htm;	
	}
	else
		document.getElementById("jobInfo").innerHTML = logFileText;
}
//-----------------------------------------------------------------------------
function handleKeyDown(evt)
{
	var evtCaught = false;

	evt = portalWnd.getEventObject(evt);
	if (!evt) return false;

	// check with portal for hotkey action
	var action = portalWnd.getFrameworkHotkey(evt,"erpReporting");
	if ( !action )
	{
		// framework handled the keystroke
		portalWnd.setEventCancel(evt)
		return false;
	}

	// hotkey defined for this keystroke
	if (action != "erpReporting")
	{
		evtCaught=cntxtActionHandler(evt,action);
		portalWnd.setEventCancel(evt);
		return false;

	}
	return evtCaught;
}
//-----------------------------------------------------------------------------
function cntxtActionHandler(evt,action)
{
	if (action==null)		// called by the portal
	{
		action = portalWnd.getFrameworkHotkey(evt,"erpReporting");
		if (!action || action=="erpReporting")
			return false;
	}

	var bHandled=false;

	switch(action)
	{
	case "doCancel":
		portalWnd.hideDrillFrame();
		bHandled=true;
		break;
	case "posInFirstField":
		portalWnd.frmPositionInToolbar();
		bHandled=true;
		break;
	}

	return (bHandled);
}
//-----------------------------------------------------------------------------
function cntxtGetPrintContent()
{
	return (document.getElementById("logDiv").innerHTML);
}
