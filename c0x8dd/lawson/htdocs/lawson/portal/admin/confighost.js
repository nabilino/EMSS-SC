/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/admin/Attic/confighost.js,v 1.1.2.10.4.9.8.1.2.3 2012/08/08 12:37:31 jomeli Exp $ */
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
var strTitle="";
var cfgType="";

function onLoadConfig()
{
	portalWnd=envFindObjectWindow("lawsonPortal");
	if (!portalWnd) return
	portalObj = portalWnd.lawsonPortal;

	// load the script versions
	envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

	// load admin messages
	oMsgs = new portalWnd.phraseObj("homepages");

	cfgType = portalWnd.getVarFromString("TYPE",window.location.search)
	cfgInitFramework();

	// check for admin role
	if (!portalWnd.oUserProfile.isPortalAdmin())
	{
		var msg=portalObj.getTitle()+":\n"+
			portalObj.getPhrase("MUST_BE_ADMIN_TO_ACCESS");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		portalWnd.goHome();
		return;
	}

	// load the content
	if (cfgType && cfgType.toLowerCase() == "portal")
		cfgBuildPortalContent();
	else if (cfgType && cfgType.toLowerCase() == "ios")
		cfgBuildIOSContent();
	else
	{
		if (portalWnd.oPortalConfig.getSetting("use_sso_authentication","1") == "1")
			cfgBuildSSOContent();
		else
		{
			var msg="SSO Configuration not available: not using SSO authentication.";
			portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
			portalWnd.goHome();
			return;
		}
	}
	
	portalObj.setTitle(strTitle);
	cfgPositionContent();

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
function cfgInitFramework()
{
	switch (cfgType.toLowerCase())
	{
	case "ios":
		strTitle="System Environment";
		break;
	case "portal":
		strTitle="Portal Configuration";
		break;
	case "sso":
		strTitle="Single Sign-on Configuration";
		break;
	}
	// delay setTitle: may need to append version number

	with (portalObj.toolbar)
	{
		clear();
		target=portalWnd;
		createButton(portalObj.getPhrase("LBL_HOME"),portalWnd.goHome,"home","","","home");
		createButton(portalObj.getPhrase("LBL_PRINTABLE_VIEW"),portalWnd.portalOnPrint,"print");
		changeButtonTitle("print",portalObj.getPhrase("lblShowPrintView"));
	}
}

//------------------------------------------------------------------------------
function cfgPosInFirstField()
{
	try {
		window.focus();
		portalWnd.frmPositionInToolbar();
	} catch (e) { }
}

//------------------------------------------------------------------------------
function cfgClose()
{
	portalObj.setTitle("");
	portalWnd.goBack();
}

//------------------------------------------------------------------------------
function cfgBuildPortalContent()
{
	var root=portalWnd.oPortalConfig.storage.getRootNode();
	if (!root) return;

	strTitle+=(" ("+root.getAttribute("version")+")");
	var strHTML="";
	var chldNods=root.childNodes;
	var len=chldNods.length;
	for (var i = 0; i < len; i++)
	{
		var chld=chldNods[i];
		var dataNodes=chld.childNodes;
		var lenj=dataNodes.length;

		switch (chld.nodeName.toLowerCase())
		{
		case "services":
			strHTML+=cfgGetPortalConfigTblHTML(i);
			strHTML+="<col width='25%' /><col width='25%' /><col width='50%' />\n";
			strHTML+="<tr><td colspan='3' style='background-color:#6699CC;'>";
			strHTML+="<span class='xTNavHead' style='border:0;padding:0;cursor:default;'>Services</span></td></tr>\n";
			strHTML+="<tr><td class='borderTopRightBottom'><label class='xTLabelForm'>Id</label></td>";
			strHTML+="<td class='borderTopRightBottom'><label class='xTLabelForm'>Name</label></td>\n";
			strHTML+="<td class='borderTopBottom'><label class='xTLabelForm'>URL</label></td></tr>\n";
			for (var j = 0; j < lenj; j++)
			{
				if (dataNodes[j].nodeName=="#comment"
				|| dataNodes[j].nodeName=="#text")
					continue;
				strHTML+="<tr>\n";
				var value=dataNodes[j].getAttribute("id");
				strHTML+="<td class='borderTopRight'><label class='xTLabel'>"+(value ? value : "&nbsp;")+"</label></td>";
				value=dataNodes[j].getAttribute("name");
				strHTML+="<td class='borderTopRight'><label class='xTLabel'>"+(value ? value : "&nbsp;")+"</label></td>";
				value=dataNodes[j].getAttribute("url");
				strHTML+="<td class='borderTop'><label class='xTLabel'>"+(value ? value : "&nbsp;")+"</label></td>";
				strHTML+="<tr>\n";
			}
			break;

		case "scripts":
			if (chld.getAttribute("id") != portalWnd.oPortalConfig.getServiceName("userprofile"))
				continue;
			strHTML+=cfgGetPortalConfigTblHTML(i);
			strHTML+="<col width='100%' />\n";
			strHTML+="<tr><td style='background-color:#6699CC;'>";
			strHTML+="<span class='xTNavHead' style='border:0;padding:0;cursor:default;'>Scripts for "+
					chld.getAttribute("id")+"</span></td></tr>\n";
			strHTML+="<tr><td class='borderTopRightBottom'><label class='xTLabelForm'>Src</label></td></tr>\n";
			for (var j = 0; j < lenj; j++)
			{
				if (dataNodes[j].nodeName=="#comment"
				|| dataNodes[j].nodeName=="#text")
					continue;
				strHTML+="<tr>\n";
				var value=dataNodes[j].getAttribute("src");
				strHTML+="<td class='borderTopRight'><label class='xTLabel'>"+(value ? value : "&nbsp;")+"</label></td>";
				strHTML+="<tr>\n";
			}
			break;
			
		case "settings":
			strHTML+=cfgGetPortalConfigTblHTML(i);
			strHTML+="<col width='25%' /><col width='75%' />\n";
			strHTML+="<tr><td colspan='2' style='background-color:#6699CC;'>";
			strHTML+="<span class='xTNavHead' style='border:0;padding:0;cursor:default;'>Settings</span></td></tr>\n";
			strHTML+="<tr><td class='borderTopRightBottom'><label class='xTLabelForm'>Id</label></td>";
			strHTML+="<td class='borderTopBottom'><label class='xTLabelForm'>Value</label></td></tr>\n";
			for (var j = 0; j < lenj; j++)
			{
				if (dataNodes[j].nodeName=="#comment"
				|| dataNodes[j].nodeName=="#text")
					continue;
				strHTML+="<tr>\n";
				var value=dataNodes[j].getAttribute("id");
				strHTML+="<td class='borderTopRight'><label class='xTLabel'>"+(value ? value : "&nbsp;")+"</label></td>";
				value=dataNodes[j].getAttribute("value");
				strHTML+="<td class='borderTop'><label class='xTLabel'>"+(value ? value : "&nbsp;")+"</label></td>";
				strHTML+="<tr>\n";
			}
			break;

		case "roleoptions":
			strHTML+=cfgGetPortalConfigTblHTML(i);
			strHTML+="<col width='25%' /><col width='75%' />\n";
			strHTML+="<tr><td colspan='2' style='background-color:#6699CC;'>";
			strHTML+="<span class='xTNavHead' style='border:0;padding:0;cursor:default;'>Role Options</span></td></tr>\n";
			strHTML+="<tr><td class='borderTopRightBottom'><label class='xTLabelForm'>Id</label></td>";
			strHTML+="<td class='borderTopBottom'><label class='xTLabelForm'>Value</label></td></tr>\n";
			for (var j = 0; j < lenj; j++)
			{
				if (dataNodes[j].nodeName=="#comment"
				|| dataNodes[j].nodeName=="#text")
					continue;
				strHTML+="<tr>\n";
				var value=dataNodes[j].getAttribute("id");
				strHTML+="<td class='borderTopRight'><label class='xTLabel'>"+(value ? value : "&nbsp;")+"</label></td>";
				value=dataNodes[j].getAttribute("value");
				strHTML+="<td class='borderTop'><label class='xTLabel'>"+(value ? value : "&nbsp;")+"</label></td>";
				strHTML+="<tr>\n";
			}
			break;
			
		case "useroptions":
			strHTML+=cfgGetPortalConfigTblHTML(i);
			strHTML+="<col width='25%' /><col width='25%' /><col width='25%' /><col width='25%' />\n";
			strHTML+="<tr><td colspan='4' style='background-color:#6699CC;'>";
			strHTML+="<span class='xTNavHead' style='border:0;padding:0;cursor:default;'>User Options</span></td></tr>\n";
			strHTML+="<tr><td width='25%' class='borderTopRightBottom'><label class='xTLabelForm'>Id</label></td>";
			strHTML+="<td width='25%' class='borderTopRightBottom'><label class='xTLabelForm'>Default Value</label></td>\n";
			strHTML+="<td width='25%' class='borderTopRightBottom'><label class='xTLabelForm'>Required Value</label></td>";
			strHTML+="<td width='25%' class='borderTopBottom'><label class='xTLabelForm'>Disabled</label></td></tr>\n";
			for (var j = 0; j < lenj; j++)
			{
				if (dataNodes[j].nodeName=="#comment"
				|| dataNodes[j].nodeName=="#text")
					continue;
				strHTML+="<tr>\n";
				var value=dataNodes[j].getAttribute("id");
				strHTML+="<td class='borderTopRight'><label class='xTLabel'>"+(value ? value : "&nbsp;")+"</label></td>";
				value=dataNodes[j].getAttribute("defval");
				strHTML+="<td class='borderTopRight'><label class='xTLabel'>"+(value ? value : "&nbsp;")+"</label></td>";
				value=dataNodes[j].getAttribute("reqval");
				strHTML+="<td class='borderTopRight'><label class='xTLabel'>"+(value ? value : "&nbsp;")+"</label></td>";
				value=dataNodes[j].getAttribute("disable");
				strHTML+="<td class='borderTop'><label class='xTLabel'>"+(value ? value : "&nbsp;")+"</label></td>";
				strHTML+="<tr>\n";
			}
			break;
		}
		strHTML+="</table>\n";
	}

	// the task table must be dynamic
	var tableDiv=document.getElementById("tableDiv");
	tableDiv.innerHTML=strHTML;
}

//------------------------------------------------------------------------------
function cfgGetPortalConfigTblHTML(idx)
{
	var strHTML="<table border='0' cellspacing='0' cellpadding='3' ";
	strHTML+="style='table-layout:fixed;width:100%;"
	if (idx != 0)
		strHTML+="margin-top:10px;"
	if (portalObj.browser.isIE)
		strHTML+="margin-bottom:10px;";
	strHTML+="border:1px solid lightgrey;'>\n";
	return strHTML;
}

//------------------------------------------------------------------------------
function cfgBuildIOSContent()
{
	// call the SysEnv servlet
	var iosDoc=portalWnd.httpRequest("/servlet/SysEnv?_OUT=XML",null,"","",false);

	var errPrefix="Error retrieving System Environment information:\n";
	if (portalWnd.oError.isErrorResponse(iosDoc,true,true,false,errPrefix,window))
	{
		cfgClose();
		return;
	}

	// load results in DataStorage object
	var ds=portalWnd.oError.getDSObject();
	var root=ds.getRootNode();

	var strHTML="";
	var chldNods=root.childNodes;
	var len=chldNods.length;
	for (var i = 0; i < len; i++)
	{
		strHTML+="<table border='0' cellspacing='0' cellpadding='3' ";
		strHTML+="style='table-layout:fixed;width:100%;";
		if (i!=0) strHTML+="margin-top:10px;"
		strHTML+="margin-bottom:10px;border:1px solid lightgrey;'>\n";
		strHTML+="<col width='30%' /><col width='70%' />\n";
		var chld=chldNods[i];
		var dataNodes=chld.childNodes;
		var lenj=dataNodes.length;

		strHTML+="<tr><td colspan='2' style='background-color:#6699CC;'>";
		strHTML+="<span class='xTNavHead' style='border:0;padding:0;cursor:default;'>";
		strHTML+=(chld.getAttribute("name") ? chld.getAttribute("name") : chld.getAttribute("NAME"))+"</span></td></tr>\n";
		strHTML+="<tr><td class='borderTopRightBottom'><label class='xTLabelForm'>Name</label></td>";
		strHTML+="<td class='borderTopBottom'><label class='xTLabelForm'>Value</label></td></tr>\n";
		for (var j = 0; j < lenj; j++)
		{
			if (dataNodes[j].nodeName=="#comment")
				continue;
			strHTML+="<tr>\n";
			var value=dataNodes[j].getAttribute("name");
			strHTML+="<td valign='top' class='borderTopRight'style='word-wrap:break-word;'>";
			strHTML+="<label class='xTLabel'>"+(value ? value : "&nbsp;")+"</label></td>";
			value=dataNodes[j].getAttribute("value");
			if (value.length && value.charCodeAt(0) < 32)
				value=transformToHexString(value)+" [string representation]";
			if (value.length && value.length == 1 && value.charCodeAt(0) == 32)		// NS only?
				value="&nbsp;";
			strHTML+="<td valign='top' class='borderTop' style='word-wrap:break-word;'>";
			strHTML+="<label class='xTLabel'>"+(value ? value : "&nbsp;")+"</label></td>";
			strHTML+="<tr>\n";
		}
		strHTML+="</table>\n";
	}

	// the task table must be dynamic
	var tableDiv=document.getElementById("tableDiv");
	tableDiv.innerHTML=strHTML;
}

//------------------------------------------------------------------------------
function cfgBuildSSOContent()
{
	var errPrefix="Error retrieving Single Sign-on configuration information:\n";
	try {
		var ssoAuthObj = new portalWnd.SSOAuthObject();	// get singleton auth object
	} catch (e) { }
	if (!ssoAuthObj)
	{
		var msg=errPrefix+"Unable to retrieve ssoAuthObj.";
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		cfgClose();
		return;
	}
	var ssoDoc=ssoAuthObj.getConfigDom();

	portalWnd.oError.setMessage("");
	var errPrefix="Error retrieving SSO configuration:\n";
	if (portalWnd.oError.isErrorResponse(ssoDoc,true,true,false,errPrefix,window))
	{
		cfgClose();
		return;
	}

	// load results in DataStorage object
	var ds=portalWnd.oError.getDSObject();
	var root=ds.getRootNode();
	var strHTML="";
	var chldNods=root.childNodes;
	var len=chldNods.length;
	for (var i = 0; i < len; i++)
	{
		strHTML+="<table border='0' cellspacing='0' cellpadding='3' ";
		strHTML+="style='width:100%;"
		if (i != 0)
			strHTML+="margin-top:10px;"
		if (portalObj.browser.isIE)
			strHTML+="margin-bottom:10px;";
		strHTML+="border:1px solid lightgrey;'>\n";
		var chld=chldNods[i];
		var dataNodes=chld.childNodes;
		var lenj=dataNodes.length;

		switch (chld.nodeName.toLowerCase())
		{
		case "primaryservice":
			strHTML+="<tr><td colspan='2' style='background-color:#6699CC;'>";
			strHTML+="<span class='xTNavHead' style='border:0;padding:0;cursor:default;'>"
			strHTML+="Primary Service ("+chld.getAttribute("name")+")</span></td></tr>\n";
			strHTML+="<tr><td width='25%' class='borderTopRightBottom'><label class='xTLabelForm'>Property</label></td>";
			strHTML+="<td width='75%' class='borderTopBottom'><label class='xTLabelForm'>Value</label></td></tr>\n";
			for (var j = 0; j < lenj; j++)
			{
				if (dataNodes[j].nodeName=="#comment"
				|| dataNodes[j].nodeName=="#text")
					continue;
				strHTML+="<tr>\n";
				var value=dataNodes[j].getAttribute("name");
				strHTML+="<td class='borderTopRight'><label class='xTLabel'>"+(value ? value : "&nbsp;")+"</label></td>";
				value=dataNodes[j].getAttribute("value");
				strHTML+="<td class='borderTop'><label class='xTLabel'>"+(value ? value : "&nbsp;")+"</label></td>";
				strHTML+="<tr>\n";
			}
			break;

		case "blackboxservices":
			strHTML+="<tr><td colspan='4' style='background-color:#6699CC;'>";
			strHTML+="<span class='xTNavHead' style='border:0;padding:0;cursor:default;'>Blackbox Services</span></td></tr>\n";
			strHTML+="<tr><td width='25%' class='borderTopRightBottom'><label class='xTLabelForm'>Name</label></td>";
			strHTML+="<td width='75%' class='borderTopBottom'><label class='xTLabelForm'>Type</label></td></tr>\n";
			for (var j = 0; j < lenj; j++)
			{
				if (dataNodes[j].nodeName=="#comment"
				|| dataNodes[j].nodeName=="#text")
					continue;
				strHTML+="<tr>\n";
				var value=dataNodes[j].getAttribute("name");
				strHTML+="<td class='borderTopRight'><label class='xTLabel'>"+(value ? value : "&nbsp;")+"</label></td>";
				value=dataNodes[j].getAttribute("type");
				strHTML+="<td class='borderTop'><label class='xTLabel'>"+(value ? value : "&nbsp;")+"</label></td>";
				strHTML+="<tr>\n";

				var urlNodes=dataNodes[j].childNodes;
				var lenk=urlNodes.length;
				for (var k = 0; k < lenk; k++)
				{
					if (urlNodes[k].nodeName=="#comment"
					|| urlNodes[k].nodeName=="#text")
						continue;
					strHTML+="<tr>\n";
					strHTML+="<td class='borderTopRight' align='right'><label class='xTLabel'>url (regex):</label></td>";
					value=urlNodes[k].getAttribute("value");
					strHTML+="<td class='borderTop'><label class='xTLabel'>"+(value ? value : "&nbsp;")+"</label></td>";
					strHTML+="<tr>\n";
				}
			}
			break;
		}
		strHTML+="</table>\n";
	}

	// the task table must be dynamic
	var tableDiv=document.getElementById("tableDiv");
	tableDiv.innerHTML=strHTML;
}

//------------------------------------------------------------------------------
function cfgPositionContent()
{
	var scrollDiv=document.getElementById("scrollDiv");
	var tableDiv=document.getElementById("tableDiv");
	tableDiv.style.width=parseInt(scrollDiv.offsetWidth-18);
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
		bHandeled=true;
		portalWnd.goHome();
		break;
	case "openNewWindow":
		portalWnd.newPortalWindow("?_URL=admin/confighost.htm"+document.location.search);
		bHandled=true;
		break;
	case "posInFirstField":
		bHandeled=true;
		cfgPosInFirstField();
		break;
	}
	return(bHandled)
}

//-----------------------------------------------------------------------------
function cntxtGetPrintContent()
{
	return (document.getElementById("tableDiv").innerHTML);
}

//-----------------------------------------------------------------------------
// functions to convert not printable string to hex string representation
function transformToHexString(s)
{
	var hex="";
	for (var i=0; i < s.length; i++)
		hex += "x"+hexFromDec( s.charCodeAt(i) );
	return hex;
}
function hexFromDec(num)
{
	if (num > 65535) return ("");

	var first = Math.round(num/4096 - .5);
	var temp1 = num - first * 4096;
	var second = Math.round(temp1/256 -.5);
	var temp2 = temp1 - second * 256;
	var third = Math.round(temp2/16 - .5);
	var fourth = temp2 - third * 16;
	return (""+getLetter(third)+getLetter(fourth));
}
function getLetter(num)
{
	if (num < 10)
		return num;
	else
	{
	    if (num == 10) { return "A" }
	    if (num == 11) { return "B" }
	    if (num == 12) { return "C" }
	    if (num == 13) { return "D" }
	    if (num == 14) { return "E" }
	    if (num == 15) { return "F" }
	}
}
