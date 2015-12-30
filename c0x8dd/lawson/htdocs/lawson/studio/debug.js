/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/debug.js,v 1.2.28.2 2012/08/08 12:48:50 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// debug.js
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

var designStudio=null;
var studioWnd=null;

var profileViewText=""
var globalsViewText=""
var userViewText=""

var textloc=null

//-----------------------------------------------------------------------------
function initAbout()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	studioWnd = wndArguments[0]
	designStudio = wndArguments[1]
	loadView("globals")
}

//-----------------------------------------------------------------------------
function onTextFocus()
{
	if (textloc)
		textloc.select()
	else
	{
		textloc = textWindow.createTextRange();
		textloc.collapse()
		textloc.select()
		textloc.moveStart("textedit")
	}
}

//-----------------------------------------------------------------------------
function onTextSelect()
{
	textloc = document.selection.createRange()
}

//-----------------------------------------------------------------------------
function dlgOnKeyDown()
{
	var bEvtCaught=false;
	switch(event.keyCode)
	{
	case studioWnd.keys.ESCAPE:
		bEvtCaught=true
		window.close()
		break;
	}
	if (bEvtCaught)
	{
		event.cancelBubble=true;
		event.returnValue=true;
	}
	return (bEvtCaught)
}

//-----------------------------------------------------------------------------
function loadView(view)
{
	document.body.style.cursor="wait"
	setTimeout("switchView('"+view+"')",10)
}

//-----------------------------------------------------------------------------
function switchView(view)
{
	var textValue=""
	cmdProfile.disabled=false
	cmdGlobals.disabled=false
	cmdUser.disabled=false

	switch(view)
	{
		case "globals":
			cmdGlobals.disabled=true
			textValue=getGlobalsViewText()
			break
		case "user":
			cmdUser.disabled=true
			textValue=getUserViewText()
			break
		case "profile":
			cmdProfile.disabled=true
			textValue=getProfileViewText()
			break
	}
	closeBtn.focus()
	textWindow.value=textValue
	document.body.style.cursor="auto"
	textloc=null
}

//-----------------------------------------------------------------------------
function getProfileViewText()
{
	if (profileViewText != "")
		return (profileViewText);

	profileViewText="Profile data\n"
	profileViewText+="--------------------------------------------------------------------------------\n"
	profileViewText+=designStudio.profile.xml
	return (profileViewText);
}

//-----------------------------------------------------------------------------
function getGlobalsViewText()
{
	if (globalsViewText != "")
		return (globalsViewText);

	globalsViewText="Global variables\n"
	globalsViewText+="--------------------------------------------------------------------------------\n"
	globalsViewText+="portalPath\t\t"+studioWnd.portalPath+"\n";
	globalsViewText+="studioPath\t\t"+studioWnd.studioPath+"\n";
	globalsViewText+="contentPath\t\t"+studioWnd.contentPath+"\n";
	globalsViewText+="servicesPath\t\t"+studioWnd.servicesPath+"\n";
	globalsViewText+="cgiPath\t\t\t"+studioWnd.cgiPath+"\n\n";

	globalsViewText+="XML Factory\n"
	globalsViewText+="--------------------------------------------------------------------------------\n"
	globalsViewText+="xml version\t\t"+studioWnd.xmlFactory.xmlVersion+"\n";
	globalsViewText+="DOM Document\t\t"+studioWnd.xmlFactory.xmlDOMProgId+"\n";
	globalsViewText+="XMLHTTP object\t\t"+studioWnd.xmlFactory.xmlHTTPProgId+"\n";
	globalsViewText+="FreeThreaded DOM\t"+studioWnd.xmlFactory.xmlFTDOMProgId+"\n";
	globalsViewText+="XSL Template object\t"+studioWnd.xmlFactory.xmlXSLTProgId+"\n";

	return (globalsViewText);
}

//-----------------------------------------------------------------------------
function getUserViewText()
{
	if (userViewText != "")
		return (userViewText);

	userViewText="User Data\n"
	userViewText+="--------------------------------------------------------------------------------\n"
	var userNode=designStudio.profile.selectSingleNode("//PORTAL_USER")
	if (userNode)
	{
		var tmpDOM=studioWnd.xmlFactory.createInstance("DOM");
		tmpDOM.async=false;
		tmpDOM.loadXML(userNode.xml.replace(/\>\</g, ">\n<"))
		userViewText+=tmpDOM.xml
		tmpDOM=null
	}
	return (userViewText);
}
