/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/dialogs/options.js,v 1.2.28.2 2012/08/08 12:48:47 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// options.js
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

var tabArray = new Array()
tabArray[0] = "tabGeneral"
var maxTabIndex=0
var ppgActiveTab=null;

var studioWnd=null;
var bModified=false;

//-----------------------------------------------------------------------------
function optInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	// save dialog arguments
	studioWnd = wndArguments[0]

	// set the active tab
	ppgActiveTab = tabGeneral

	// initialize values
	txtPortal.value=studioWnd.designStudio.getUserPreference("PORTAL","/lawson/portal")
	txtPortal.title=txtPortal.value
	txtWorkspace.value=studioWnd.designStudio.getUserPreference("LOCALWORKSPACE","c:\\")
	txtWorkspace.title=txtWorkspace.value
	txtRecentMax.value=studioWnd.designStudio.getUserPreference("RECENTMAX","4")
	cbxOpenRecent.checked =
		studioWnd.designStudio.getUserPreference("OPENRECENT","0") == "1"
		? true : false;

	var width=studioWnd.designStudio.getUserPreference("LEFTBARWIDTH","15")
	var len=selLeftBar.options.length
	var selIndex = -1;
	for (var i = 0; i < len; i++)
	{
		if (selLeftBar.options[i].value==width)
		{
			selIndex=i;
			break;
		}
	}
	selLeftBar.options[selIndex == -1 ? 0 : selIndex].selected=true;

	width=studioWnd.designStudio.getUserPreference("RIGHTBARWIDTH","15")
	len=selRightBar.options.length
	selIndex = -1;
	for (var i = 0; i < len; i++)
	{
		if (selRightBar.options[i].value==width)
		{
			selIndex=i;
			break;
		}
	}
	selRightBar.options[selIndex == -1 ? 0 : selIndex].selected=true;

	// show the document
	document.body.style.visibility="visible"
	document.body.style.cursor="auto"
	txtPortal.focus()
	txtPortal.select()
}


//-----------------------------------------------------------------------------
function optNbrKeyPress()
{
	// only digits allowed (1-9)
	if ((event.keyCode<49)||(event.keyCode>57))
	{
		event.cancelBubble=true
		event.returnValue=false
		return true
	}
	return false
}

//-----------------------------------------------------------------------------
function optOnKeyDown()
{
	var bEvtCaught=false;
	switch(event.keyCode)
	{
	case studioWnd.keys.ESCAPE:
		btnCancel.click()
		bEvtCaught=true
		break;
	case studioWnd.keys.ENTER:
		break;
	case studioWnd.keys.PAGE_UP:		// previous tab
		if( !event.altKey && event.ctrlKey && !event.shiftKey )
		{
			grpActivateTab(-1)
			bEvtCaught=true
		}
		break;
	case studioWnd.keys.PAGE_DOWN:		// next tab
		if( !event.altKey && event.ctrlKey && !event.shiftKey )
		{
			grpActivateTab(1)
			bEvtCaught=true
		}
		break;
	}

	if (bEvtCaught)
		studioWnd.setEventCancel(event)
	return (!bEvtCaught)
}

//-----------------------------------------------------------------------------
function optActivateTab(inc)
{
	var curIndex = parseInt(ppgActiveTab.tabind)
	var tabIndex = curIndex + inc

	if(tabIndex < 0)
		tabIndex = 0
	else if (tabIndex > maxTabIndex)
		tabIndex = maxTabIndex

	if (curIndex != tabIndex)
	{
		var obj = document.getElementById(tabArray[tabIndex])
		obj.fireEvent("onclick")
	}
}

//-----------------------------------------------------------------------------
function optSwitchTab(objTab)
{
	if(objTab.id == ppgActiveTab.id) return;

	// make the previously active tab inactive
	ppgActiveTab.className = "dsTabButtonInactive"
	document.all["div" + ppgActiveTab.id.substr(3)].style.display = "none"

	objTab.className = "dsTabButtonActive"
	switch(objTab.id)
	{
		case "tabGeneral":
			divGeneral.style.display = "block"
			selGroups.focus()
			break;
	}

	// Make this tab as active tab
	ppgActiveTab = objTab
}

//-----------------------------------------------------------------------------
function ppgEnableApply(bEnable)
{
	if (typeof(bEnable) != "boolean")
		bEnable=true;
	btnApply.disabled=!bEnable
}

//-----------------------------------------------------------------------------
function optOK()
{
	if (!btnApply.disabled)
	{
		if (!optApply()) return;
	}
	window.close()
}

//-----------------------------------------------------------------------------
function optCancel()
{
	window.returnValue=bModified
	window.close()
}

//-----------------------------------------------------------------------------
function optApply()
{
	// perform validation
	if (txtPortal.value == "")
	{
//		optSwitchTab(tabGeneral)
		txtPortal.focus()
		studioWnd.cmnDlg.messageBox(
			pageXLT.selectSingleNode("//phrase[@id='msgPleaseEnterReq']").text,"ok","alert",window)
		return false;
	}

	if (txtWorkspace.value == "")
	{
//		optSwitchTab(tabGeneral)
		txtWorkspace.focus()
		studioWnd.cmnDlg.messageBox(
			pageXLT.selectSingleNode("//phrase[@id='msgPleaseEnterReq']").text,"ok","alert",window)
		return false;
	}

	if (txtRecentMax.value == "")
		txtRecentMax.value = "4"

	ppgEnableApply(false)
	btnCancel.focus()

	studioWnd.designStudio.setUserPreference("PORTAL",txtPortal.value)

	studioWnd.designStudio.setUserPreference("LOCALWORKSPACE",txtWorkspace.value)

	studioWnd.designStudio.setUserPreference("RECENTMAX",txtRecentMax.value)
	studioWnd.designStudio.setUserPreference("OPENRECENT",
		cbxOpenRecent.checked ? "1" : "0")

	var bRedraw=false;
	var leftWidth=selLeftBar.options[selLeftBar.selectedIndex].value
	var curWidth=studioWnd.designStudio.getUserPreference("LEFTBARWIDTH")
	if (leftWidth != curWidth)
	{
		bRedraw=true;
		studioWnd.designStudio.setUserPreference("LEFTBARWIDTH",leftWidth)
	}

	var rightWidth=selRightBar.options[selRightBar.selectedIndex].value
	curWidth=studioWnd.designStudio.getUserPreference("RIGHTBARWIDTH")
	if (rightWidth != curWidth)
	{
		bRedraw=true;
		studioWnd.designStudio.setUserPreference("RIGHTBARWIDTH",rightWidth)
	}

	studioWnd.designStudio.saveUserPrefs(true)

	if (bRedraw)
	{
		with(studioWnd.designStudio)
		{
			if (ui.leftBar.style.display == "block")
				ui.leftBar.style.width = leftWidth+"%";
			if (ui.rightBar.style.display == "block")
				ui.rightBar.style.width = rightWidth+"%";
			var wkspWidth = (100 -
				(parseInt((ui.leftBar.style.display == "block")?ui.leftBar.style.width:0) +
				parseInt((ui.rightBar.style.display == "block")?ui.rightBar.style.width:0)))+"%";
			ui.workSpace.style.width = wkspWidth;
		}
	}
	return (true);
}

//-----------------------------------------------------------------------------
function optPortalChange()
{
	var val=txtPortal.value
	if (val.substring(val.length-1)=="/")
		txtPortal.value=val.substring(0,val.length-1)
	ppgEnableApply()
}

//-----------------------------------------------------------------------------
function optWkspChange()
{
	var val=txtWorkspace.value
	if (val.length != 3 && val.substring(val.length-1)=="\\")
		txtWorkspace.value=val.substring(0,val.length-1)

	txtWorkspace.title=txtWorkspace.value
	ppgEnableApply()
}

//-----------------------------------------------------------------------------
function optWkspBrowse()
{
	// browse for workspace folder
	var root=txtWorkspace.value.substr(0,3)
	var init=txtWorkspace.value.substr(3)
	var folder=studioWnd.cmnDlg.selectFolder(root, "", init, "local", window)
	if (folder && folder != txtWorkspace.value)
	{
		txtWorkspace.value=folder
		txtWorkspace.title=folder
		txtWorkspace.focus()
		txtWorkspace.select()
		ppgEnableApply()
	}
}

