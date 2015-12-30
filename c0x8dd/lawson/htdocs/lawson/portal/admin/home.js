/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/admin/Attic/home.js,v 1.1.2.9.4.9.14.2.2.4 2012/08/08 12:37:31 jomeli Exp $ */
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

var adminLinks=new Array();
adminLinks[0]="admin/rolemgr/index.htm";
adminLinks[1]="admin/officemanager/index.htm";
adminLinks[2]="utility/bldindex.htm";
adminLinks[3]="utility/formpdl.htm";
adminLinks[4]="utility/formdel.htm";
adminLinks[5]="admin/cacherefresh.htm";
adminLinks[6]="http://knowledgebase.lawson.com";
adminLinks[7]="admin/confighost.htm?TYPE=PORTAL";
adminLinks[8]="admin/confighost.htm?TYPE=IOS";
adminLinks[9]="admin/confighost.htm?TYPE=SSO";
adminLinks[10]="homedebug.htm";

function onLoadHome()
{
	portalWnd=envFindObjectWindow("lawsonPortal");
	if (!portalWnd) return
	portalObj = portalWnd.lawsonPortal;

	// load the script versions
	envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

	// load admin messages
	oMsgs = new portalWnd.phraseObj("homepages");

	// check for admin role
	if (!portalWnd.oUserProfile.isPortalAdmin())
	{
		var msg=oMsgs.getPhrase("lblTitlePortalAdmin")+":\n"+
			portalObj.getPhrase("MUST_BE_ADMIN_TO_ACCESS");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		portalWnd.goHome();
		return;
	}

	if (oMsgs.getLanguage() != "en-us")
		homLoadTranslatePhrases();
	if (portalObj.browser.isIE)
		homSizeButtons();

	// resolve full path to images
	var imgs=document.getElementsByTagName("img");
	var len=imgs.length
	for (var i = 0; i < len; i++)
		imgs[i].src=portalObj.path+"/images/"+imgs[i].id+".gif";

	// show KnowledgeBase link?
	if (!portalWnd.oUserProfile.oRole.getAccessKnowledgeBase())
	{
		var knowledgeRow=document.getElementById("knowledgeRow");
		if (knowledgeRow)
			knowledgeRow.style.display="none";
	}

	// show SSO link?
	if (portalWnd.oPortalConfig.getSetting("use_sso_authentication","1") != "1")
	{
		var ssoRow=document.getElementById("ssoRow");
		if (ssoRow)
			ssoRow.style.display="none";
	}

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
	portalObj.setTitle(oMsgs.getPhrase("lblTitlePortalAdmin"))
	homPosInFirstField();
}

//------------------------------------------------------------------------------
function homPosInFirstField()
{
	try {
		window.focus();
		var elem=document.getElementById("btnManageRoles").focus();
		portalWnd.setInitialFocus(); //PT  178867
	} catch (e) { }
}

//------------------------------------------------------------------------------
function homLoadTranslatePhrases()
{
	// set header labels
	var phId="lblCommonTasks";
	var elem=document.getElementById(phId);
	elem.innerHTML=oMsgs.getPhrase(phId);
	phId="lblUsefulInfo";
	elem=document.getElementById(phId);
	elem.innerHTML=oMsgs.getPhrase(phId);

	// now loop through buttons and related labels
	var btns=document.getElementsByTagName("button");
	var len=btns.length;
	for (var i = 0; i < len; i++)
	{
		elem=btns[i];
		elem.innerHTML=oMsgs.getPhrase(elem.id);
	}
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
	var action = portalWnd.getFrameworkHotkey(evt,"adminhome");
	if ( !action )
	{
		// framework handled the keystroke
		portalWnd.setEventCancel(evt)
		return false;
	}

	// hotkey defined for this keystroke
	if (action != "adminhome")
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
		action = portalWnd.getFrameworkHotkey(evt,"adminhome");
		if (!action || action=="adminhome")
			return false;
	}

	var bHandled=false;
	var mElement=portalWnd.getEventElement(evt)

	switch (action)
	{
	case "openNewWindow":
		portalWnd.newPortalWindow("?_URL=admin/home.htm");
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
	btn.className = "anchorFocus"
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
	portalWnd.switchContents(adminLinks[parseInt(option)]);
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

	if (parDiv.id == "divUsefulInfo")
		return;

	homSizeHelpText();
}

//-----------------------------------------------------------------------------
function homResetHelpText()
{
	var divHelpText=document.getElementById("divHelpText");
	divHelpText.style.visiblity="hidden";
}
