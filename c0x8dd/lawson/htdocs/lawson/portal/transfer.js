/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/transfer.js,v 1.10.2.3.4.5.12.1.2.2 2012/08/08 12:37:20 jomeli Exp $ */
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
var scrType="";

function initTrans()
{
	portalWnd=envFindObjectWindow("lawsonPortal");
	if (!portalWnd) return;

	// load the script versions
	envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);
	
	portalObj=portalWnd.lawsonPortal;
	portalObj.setTitle(portalObj.getPhrase("LBL_TRANSFER"));
	with (portalObj.toolbar)
	{
		target=window;
		clear();
		createButton(portalObj.getPhrase("LBL_BACK"),portalWnd.goBack,"back","","","back");
		createButton(portalObj.getPhrase("lblEval"),decideTrans);
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
	
	document.getElementById("lblForm").innerHTML=portalObj.getPhrase("LBL_FORM")
	document.getElementById("lblToken").innerHTML=portalObj.getPhrase("lblToken")
	document.getElementById("lblData").innerHTML=portalObj.getPhrase("lblData")
	document.getElementById("lblId").innerHTML=portalObj.getPhrase("lblId")
	document.getElementById("lblFile").innerHTML=portalObj.getPhrase("lblFile")
	document.getElementById("lblScript").innerHTML=portalObj.getPhrase("lblScript")

	scrType=document.location.search.substr(1).toUpperCase()
	switch(scrType)
	{
	case "LAWFORM":
		showForm()
		break;				
	case "LAWPAGE":
		showPage()
		break;			
	case "LAWSCRIPT":
		scriptField()
		break;	
	}
	posInFirstField()
}

//-----------------------------------------------------------------------------
function posInFirstField()
{
	switch(scrType)
	{
	case "LAWFORM":
		var token=document.getElementById("texToken");
		token.focus()
		token.select()
		break;				
	case "LAWPAGE":
		var pageFile=document.getElementById("pageFile");
		pageFile.focus()
		pageFile.select()
		break;			
	case "LAWSCRIPT":
		var scriptBox=document.getElementById("scriptBox");
		scriptBox.focus()
		scriptBox.select()
		break;	
	}
}

//-----------------------------------------------------------------------------
function pageTrans()
{
	var mElement=document.getElementById("pageFile")
	var file=mElement.value
	if(file=="")
		mElement.focus()
	else
	{
		portalWnd.cmnSetCookie("page",file)
 		portalWnd.pageTransfer(file)
	}
}

//-----------------------------------------------------------------------------
function formTrans()
{
	var texToken=document.getElementById("texToken").value
	var texData=document.getElementById("texData").value
	var texId=document.getElementById("texId").value

	portalWnd.cmnSetCookie("form",escape(texToken)+"|"+escape(texData)+"|"+escape(texId))

	portalWnd.formTransfer(texToken,texData,null,null,texId)
}

//-----------------------------------------------------------------------------
function showForm()
{
	var form=document.getElementById("formDiv");
	var pageDiv=document.getElementById("pageDiv");
	var scriptDiv=document.getElementById("scriptDiv");
	form.style.visibility="visible"
	pageDiv.style.visibility="hidden"
	scriptDiv.style.visibility="hidden"

	var cookie=portalWnd.cmnGetCookie("form")
	if (cookie)
	{
		var arr=cookie.split("|")
		document.getElementById("texToken").value=unescape(arr[0])
		document.getElementById("texData").value=unescape(arr[1])
		document.getElementById("texId").value=unescape(arr[2])
	}
}

//-----------------------------------------------------------------------------
function scriptField()
{
	var form=document.getElementById("formDiv");
	var pageDiv=document.getElementById("pageDiv");
	var scriptDiv=document.getElementById("scriptDiv");
	scriptDiv.style.visibility="visible"
	pageDiv.style.visibility="hidden"
	form.style.visibility="hidden"

	var cookie=portalWnd.cmnGetCookie("script")
	if (cookie)
		document.getElementById("scriptBox").value=unescape(cookie)
}

//-----------------------------------------------------------------------------
function showPage()
{
	var form=document.getElementById("formDiv");
	var pageDiv=document.getElementById("pageDiv");
	var scriptDiv=document.getElementById("scriptDiv");
	pageDiv.style.visibility="visible"
	form.style.visibility="hidden"
	scriptDiv.style.visibility="hidden"

	var cookie=portalWnd.cmnGetCookie("page")
	if (cookie)
		document.getElementById("pageFile").value=unescape(cookie)
}

//-----------------------------------------------------------------------------
function decideTrans()
{
	switch(scrType)
	{
	case "LAWFORM":
		formTrans()
		break;			
	case "LAWPAGE":
		pageTrans()
		break;	
	case "LAWSCRIPT":
		getEvalStr()
		break;										
	}		
}

//-----------------------------------------------------------------------------
function getEvalStr()
{
	var mElement=document.getElementById("scriptBox")
	var str=mElement.value;
	if(str=="")
		mElement.focus()
	else
	{
		eval(str)
		portalWnd.cmnSetCookie("script",escape(str))
	}
}

//-----------------------------------------------------------------------------
function transOnKeyDown(evt)
{
    evt = portalWnd.getEventObject(evt)
    if (!evt) return false;

	// check with portal for hotkey action
	var action = portalWnd.getFrameworkHotkey(evt,"transfers");
	if ( !action )
	{
		// framework handled the keystroke
		portalWnd.setEventCancel(evt)
		return false;
	}

	// hotkey defined for this keystroke
	if (action != "transfers")
	{
		cntxtActionHandler(evt,action);
		portalWnd.setEventCancel(evt)
		return false;
	}

	var evtCaught=false
	var keyVal = portalObj.browser.isIE ? evt.keyCode : evt.charCode;
	if (keyVal==0)		// netscrape only
		keyVal=evt.keyCode

	if (keyVal==13)		// enter key
	{
		var mElement=portalWnd.getEventElement(evt)
		switch (mElement.id)
		{
		case "texToken":
		case "texData":
		case "texId":
		case "pageFile":
			decideTrans();
			evtCaught=true;
			break;
		case "scriptBox":
			getEvalStr();
			evtCaught=true;
			break;
		}
	}
	if(evtCaught)
		portalWnd.setEventCancel(evt)
	return evtCaught

}

//-----------------------------------------------------------------------------
function cntxtActionHandler(evt,action)
{
	if (action==null)		// called by the portal
	{
		action = portalWnd.getFrameworkHotkey(evt,"transfers");
		if (!action || action=="transfers")
			return false;
	}

	var bHandled=false;
	switch (action)
	{
	case "doSubmit":
		decideTrans()
		bHandled=true
		break;
	case "doCancel":
		portalWnd.goBack();
		bHandled=true
		break;
	case "openNewWindow":
		portalWnd.newPortalWindow("?_URL=transfer.htm"+document.location.search);
		bHandled=true;
		break;
	case "posInFirstField":
        posInFirstField()
		bHandled=true
		break;
	}
	return (bHandled);
}


