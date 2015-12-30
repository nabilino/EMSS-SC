/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/users/Attic/home.js,v 1.1.2.5.4.6.14.2.2.2 2012/08/08 12:37:21 jomeli Exp $ */
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

var userLinks=new Array();
userLinks[0]="users/subscriptions/index.htm";
userLinks[1]="users/preferences/index.htm";
userLinks[2]="http://knowledgebase.lawson.com";

function onLoadHome()
{
	portalWnd=envFindObjectWindow("lawsonPortal");
	if (!portalWnd) return
	portalObj = portalWnd.lawsonPortal;
	portalObj.toolbar.clear();

	// load the script versions
	envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

	// load admin messages
	oMsgs = new portalWnd.phraseObj("homepages");

	homBuildContent();

	if (portalObj.browser.isIE)
		homSizeButtons();

	// resolve full path to logo image
	var img=document.getElementById("imgLogo");
	if (img)
		img.src=portalObj.path+"/images/ico_portal_logo.gif";

	document.body.style.visibility="visible";
	homInitFramework();
}

//------------------------------------------------------------------------------
function onUnloadHome()
{
	try {
		portalObj.setTitle("")
	} catch (e) { }
}

//------------------------------------------------------------------------------
function homInitFramework()
{
	portalObj.setTitle(oMsgs.getPhrase("lblTitlePortalUser"))
	homPosInFirstField();
}

//------------------------------------------------------------------------------
function homPosInFirstField()
{
	try {
		window.focus();
		var elem=document.getElementById("btnManageContent").focus();
	} catch (e) { }
}

//------------------------------------------------------------------------------
function homBuildContent()
{
	// set header labels
	var phId="lblCommonTasks";
	var elem=document.getElementById(phId);
	elem.innerHTML=oMsgs.getPhrase(phId);
	phId="lblUsefulInfo";
	elem=document.getElementById(phId);
	elem.innerHTML=oMsgs.getPhrase(phId);

	// the task table must be dynamic
	var taskDiv=document.getElementById("taskDiv");
	var strHTML="<table id='taskTbl' border='0' cellspacing='0' cellpadding='2' ";
	strHTML+="style='width:100%;margin-top:10px;margin-bottom:10px;'>";

	if (portalWnd.oUserProfile.oRole.getUseContentMenu())
		strHTML+=homGetRowHTML("ManageContent",0);

	if (portalWnd.oUserProfile.oRole.getUsePreferencesMenu())
		strHTML+=homGetRowHTML("ManageOptions",1);

	try {
		var ssoAuthObj = new portalWnd.SSOAuthObject();	// get singleton auth object
		if (ssoAuthObj.canChangePwd())
			strHTML+=homGetRowHTML("ChangePassword","portalWnd.portalChangePassword()");
	} catch (e) { }

	strHTML+="</table>";
	taskDiv.innerHTML=strHTML;

	// the info table is dynamic also
	var infoDiv=document.getElementById("infoDiv");
	strHTML="<table id='infoTbl' border='0' cellspacing='0' cellpadding='2' ";
	strHTML+="style='width:100%;margin-top:10px;margin-bottom:10px;'>";

	strHTML+=homGetRowHTML("UserHelp","portalWnd.portalShowUserHelp()");
	if (portalWnd.oUserProfile.oRole.getAccessKnowledgeBase())
		strHTML+=homGetRowHTML("ViewKnowledge",2);
	strHTML+=homGetRowHTML("ViewHotkeys","portalWnd.portalShowHotkeyHelp()");

	strHTML+="</table>";
	infoDiv.innerHTML=strHTML;
}

//------------------------------------------------------------------------------
function homGetRowHTML(id,option)
{
	var strHTML="<tr>\n";
	strHTML+="<td width='20px' valign='top' align='right'>";
	strHTML+="<img src='"+portalObj.path+"/images/calright.gif' />";
	strHTML+="</td>\n";
	strHTML+="<td width='170px' valign='top'>";
	strHTML+="<button id='btn"+id+"' class='anchorActive' style='position:relative;text-align:left;' ";
	strHTML+="onclick='";
	strHTML+=(typeof(option) == "number" ? "homOnButtonClick(\""+option+"\")" : option);
	strHTML+="' onfocus='homOnButtonFocus(this)' onblur='homOnButtonBlur(this)' ";
	strHTML+="onmouseover='homOnButtonMouseOver(this)' onmouseout='homOnButtonMouseOut(this)'>\n";
	strHTML+=oMsgs.getPhrase("btn"+id);
	strHTML+="</button>\n";
	strHTML+="</td>\n";
	strHTML+="</tr>\n";
	return strHTML;
}

//------------------------------------------------------------------------------
function homSizeHelpText()
{
	var divHelpText=document.getElementById("divHelpText");
	divHelpText.style.visibility="visible";
	var lblHelpText=document.getElementById("lblHelpText");
	divHelpText.style.height=lblHelpText.offsetHeight+28;
}

//------------------------------------------------------------------------------
function homSizeButtons()
{
	var btns=document.getElementsByTagName("button");
	var len=btns.length;
	for (var i = 0; i < len; i++)
		btns[i].style.width="160px";
}

//------------------------------------------------------------------------------
function homOnKeyDown(evt)
{
    evt = portalWnd.getEventObject(evt)
    if (!evt) return false;

	// check with portal for hotkey action
	var action = portalWnd.getFrameworkHotkey(evt,"userhome");
	if ( !action )
	{
		// framework handled the keystroke
		portalWnd.setEventCancel(evt)
		return false;
	}

	// hotkey defined for this keystroke
	if (action != "userhome")
	{
		cntxtActionHandler(evt,action);
		portalWnd.setEventCancel(evt)
		return false;
	}

	// want to 'hide' this feature -- no hotkey defined (ctrl+alt+A or ctrl+shft+V)
	if (evt.altKey && evt.ctrlKey && !evt.shiftKey && evt.keyCode == 65
	|| !evt.altKey && evt.ctrlKey && evt.shiftKey && evt.keyCode == 86)
	{
		portalWnd.switchContents("homedebug.htm");
		portalWnd.setEventCancel(evt);
		return false;
	}
	return true;
}

//-----------------------------------------------------------------------------
function cntxtActionHandler(evt,action)
{
	if (action==null)		// called by the portal
	{
		action = portalWnd.getFrameworkHotkey(evt,"userhome");
		if (!action || action=="userhome")
			return false;
	}

	var bHandled=false;
	var mElement=portalWnd.getEventElement(evt)

	switch (action)
	{
	case "openNewWindow":
		portalWnd.newPortalWindow("?_URL=users/home.htm");
		bHandled=true;
		break;
	case "posInFirstField":
		bHandeled=true;
		homPosInFirstField();
		break;
	}
	return(bHandled)
}

//-----------------------------------------------------------------------------
function homOnButtonFocus(btn)
{
	btn.className = "anchorFocus";
	homSetHelpText(btn);
}

//-----------------------------------------------------------------------------
function homOnButtonBlur(btn)
{
	btn.className = "anchorActive";
}
//-----------------------------------------------------------------------------
function homOnButtonMouseOut(btn)
{
	if (btn.className == "anchorHover")
		btn.className="anchorActive" 
	homResetHelpText();
}

//-----------------------------------------------------------------------------
function homOnButtonMouseOver(btn)
{
	if (btn.className == "anchorActive")
		btn.className = "anchorHover"
	homSetHelpText(btn);
}

//-----------------------------------------------------------------------------
function homOnButtonClick(option)
{
	portalWnd.switchContents(userLinks[parseInt(option)]);
}

//-----------------------------------------------------------------------------
function homSetHelpText(btn)
{
	var phId="lbl"+btn.id.substr(3);
	var lblHelpText=document.getElementById("lblHelpText");
	lblHelpText.innerHTML=oMsgs.getPhrase(phId);

	var parDiv=(portalObj.browser.isIE
		? btn.parentElement.parentElement.parentElement.parentElement.parentElement
		: btn.parentNode.parentNode.parentNode.parentNode.parentNode);

	var divHelpText=document.getElementById("divHelpText");
	divHelpText.style.top=btn.offsetTop+parDiv.offsetTop;
	divHelpText.style.visibility="hidden";

	if (parDiv.id == "infoDiv")
		return;

	homSizeHelpText();
}

//-----------------------------------------------------------------------------
function homResetHelpText()
{
	var divHelpText=document.getElementById("divHelpText");
	divHelpText.style.visiblity="hidden";
}
