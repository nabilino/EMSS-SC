/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/admin/Attic/cacherefresh.js,v 1.1.2.3.4.10.8.2.2.3 2012/08/08 12:37:31 jomeli Exp $ */
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
var oMsgs=null;
var oFeedBack=null

function onLoadConfig()
{
	portalWnd=envFindObjectWindow("lawsonPortal");
	if (!portalWnd) return
	portalObj = portalWnd.lawsonPortal;

	// load the script versions
	envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

	// load admin messages
	oMsgs = new portalWnd.phraseObj("homepages");

	// create feedback object
	oFeedBack = new FeedBack(window,portalWnd);

	portalObj.setTitle("IOS Cache Refresh");
	with (portalObj.toolbar)
	{
		clear();
		target=window;
		createButton(portalObj.getPhrase("lblSubmit"),cfgSubmit,"submit");
		createButton(portalObj.getPhrase("LBL_HOME"),cfgGoHome,"home","","","home");
		createButton(portalObj.getPhrase("lblInvertSelections"),cfgInvert,"invert");
	}

	// check for admin role
	if (!portalWnd.oUserProfile.isPortalAdmin())
	{
		var msg=portalObj.getTitle()+":\n"+
			portalObj.getPhrase("MUST_BE_ADMIN_TO_ACCESS");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		portalWnd.goHome();
		return;
	}

	if (!cfgBuildRefreshOptions())
	{
		cfgGoHome();
		return;
	}

	document.body.style.visibility="visible";
	cfgPosInFirstField();
}

//------------------------------------------------------------------------------
function onUnloadConfig()
{
	try {
		if (portalWnd.lawsonPortal == null) return;
		portalObj.setTitle("");
		portalObj.toolbar.clear();
	} catch (e) { }
}

//------------------------------------------------------------------------------
function cfgBuildRefreshOptions()
{
	var api="/servlet/IOSCacheRefresh?action=list"
	var oDOM=portalWnd.httpRequest(api,null,"","",false);
	if (portalWnd.oError.isErrorResponse(oDOM,true,true,false,"",window))
		return false;

	var strHTML="<table border=\"0\" cellspacing=\"0\" cellpadding=\"3\" ";
	strHTML+="style=\"table-layout:fixed;width:98%;margin-top:10px;margin-bottom:10px;\">\n";
	strHTML+="<col width=\"30px\" /><col width=\"175px\" /><col width=\"475px\" />\n";
	strHTML+="<tr>\n";
	strHTML+="<td colspan=\"3\" style=\"background-color:#6699CC;\"><span class=\"xTNavHead\" ";
	strHTML+="style=\"border:0;padding:0;cursor:default;\">Select Items to Refresh</span></td>\n";
	strHTML+="</tr>\n";
	strHTML+="<tr><td colspan=\"3\">&nbsp;</td></tr>\n";

	oDOM=portalWnd.oError.getDSObject();
	var cacheNodes=oDOM.getElementsByTagName("CACHE");
	var len=(cacheNodes ? cacheNodes.length : 0);
	for (var i = 0; i < len; i++)
	{
		strHTML+="<tr>\n";
		strHTML+="<td>&nbsp;</td>\n";
		strHTML+="<td>\n";
		strHTML+="<input type=\"checkbox\" id=\"chk_"+i+"\" value=\"" + 
					cacheNodes[i].getAttribute("id")+"\" checked />&nbsp;\n";
		strHTML+="<label for=\"chk_"+i+"\" class=\"xTLabelForm\" style=\"position:relative;\">" + 
					cacheNodes[i].getAttribute("name")+"</label>\n";
		strHTML+="</td>\n";
		strHTML+="<td><label class=\"xTLabelForm\" style=\"position:relative;font-weight:normal;\">" + 
					cacheNodes[i].getAttribute("description")+"</label></td>\n";
		strHTML+="</tr>\n";
	}
	strHTML+="</table>\n";

	var tblDiv=window.document.getElementById("tableDiv");
	tblDiv.innerHTML=strHTML;
	return true;
}

//------------------------------------------------------------------------------
function cfgPosInFirstField()
{
	try {
		window.focus();
		var elem=document.getElementById("chk_0");
		elem.focus();
	} catch (e) { }
}

//------------------------------------------------------------------------------
function cfgGoHome()
{
	portalWnd.goHome();
}

//------------------------------------------------------------------------------
function cfgSubmit()
{
	var chkBox=document.getElementsByTagName("INPUT");
	var len=chkBox.length;
	if (!len) return;

	var strParms="";
	for (var i = 0; i < len; i++)
	{
		if (chkBox[i].checked)
			strParms+=(chkBox[i].value+";");
	}
	if (strParms=="") return;
	var api="/servlet/IOSCacheRefresh?action=refresh&refresh="+strParms;

	// let magic happen!
	oFeedBack.show();
	setTimeout("cfgDoSubmit('"+api+"')", 50);
}

//-----------------------------------------------------------------------------
function cfgDoSubmit(api)
{
	var oDOM=portalWnd.httpRequest(api);

	oFeedBack.hide();
	if (portalWnd.oError.isErrorResponse(oDOM,true,true,false,"",window))
		return;

	// get response as DataStorage object
	oDOM=portalWnd.oError.getDSObject();

	// build up results message
	var prefMsg=""
	var msg=""
	var errNodes=oDOM.getElementsByTagName("ERROR");
	if (!errNodes || errNodes.length < 1)
		msg="IOSCacheRefresh requested completed sucessfully.";
	else
	{
		prefMsg="IOSCacheRefresh engine returned the following errors:\n\n";
		var len=errNodes.length;
		for (var i = 0; i < len; i++)
		{
			msg+=errNodes[i].parentNode.getAttribute("id")+": ";
			var msgNode=errNodes[i].firstChild;
			if (msgNode) msg+=portalWnd.cmnGetNodeCDataValue(msgNode);
			msg+="\n";
		}
		msg+="\n\n";
	}
	portalWnd.cmnDlg.messageBox(prefMsg+msg,"ok",(prefMsg=="" ? "info" : "alert"),window);
	cfgGoHome();
}

//------------------------------------------------------------------------------
function cfgInvert()
{
	var chkBox=document.getElementsByTagName("INPUT");
	var len=chkBox.length;
	if (!len) return;

	for (var i = 0; i < len; i++)
		chkBox[i].checked = !chkBox[i].checked;
}

//------------------------------------------------------------------------------
function cfgOnKeyDown(evt)
{
    evt = portalWnd.getEventObject(evt)
    if (!evt) return false;

	// check with portal for hotkey action
	var action = portalWnd.getFrameworkHotkey(evt,"config");
	if ( !action )
	{
		// framework handled the keystroke
		portalWnd.setEventCancel(evt)
		return
	}

	// hotkey defined for this keystroke
	if (action != "config")
	{
		cntxtActionHandler(evt,action);
		portalWnd.setEventCancel(evt)
		return
	}
}

//-----------------------------------------------------------------------------
function cntxtActionHandler(evt,action)
{
	if (action==null)		// called by the portal
	{
		action = portalWnd.getFrameworkHotkey(evt,"config");
		if (!action || action=="config")
			return false;
	}

	var bHandled=false;
	var mElement=portalWnd.getEventElement(evt)

	switch (action)
	{
	case "doCancel":
		bHandled=true;
		cfgGoHome();
		break;
	case "doSubmit":
		bHandled=true;
		cfgSubmit();
		break;
	case "openNewWindow":
		portalWnd.newPortalWindow("?_URL=admin/cacherefresh.htm");
		bHandled=true;
		break;
	case "posInFirstField":
		bHandled=true;
		cfgPosInFirstField();
		break;
	}
	return(bHandled)
}
