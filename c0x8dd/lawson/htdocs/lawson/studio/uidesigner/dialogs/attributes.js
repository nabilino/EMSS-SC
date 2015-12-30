/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/dialogs/attributes.js,v 1.2.28.2 2012/08/08 12:48:49 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// attributes.js
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
tabArray[0] = "tabProperties"
var maxTabIndex=0
var ppgActiveTab=null

var studioWnd=null
var xmlNode=null

//-----------------------------------------------------------------------------
function ppgInit()
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
	xmlNode = wndArguments[1]

	// set the active tab
	ppgActiveTab = tabProperties

	// initialize values
	ppgBuildPropertiesTable()

	// show the document
	document.body.style.visibility="visible"
	document.body.style.cursor="auto"
	btnOK.focus()
}

//-----------------------------------------------------------------------------
function ppgOnKeyDown()
{
	var bEvtCaught=false;
	switch(event.keyCode)
	{
	case studioWnd.keys.ESCAPE:
		bEvtCaught=true
		window.close()
		break;
	case studioWnd.keys.ENTER:
		bEvtCaught=true
		btnOK.click()
		break;
	case studioWnd.keys.PAGE_UP:		// previous tab
		if( !event.altKey && event.ctrlKey && !event.shiftKey )
		{
			ppgActivateTab(-1)
			bEvtCaught=true
		}
		break;
	case studioWnd.keys.PAGE_DOWN:		// next tab
		if( !event.altKey && event.ctrlKey && !event.shiftKey )
		{
			ppgActivateTab(1)
			bEvtCaught=true
		}
		break;
	}
	if (bEvtCaught)
		studioWnd.setEventCancel(event)
	return (!bEvtCaught)
}

//-----------------------------------------------------------------------------
function ppgActivateTab(inc)
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
function ppgSwitchTab(objTab)
{
	if(objTab.id == ppgActiveTab.id) return;

	// make the previously active tab inactive
	ppgActiveTab.className = "dsTabButtonInactive"
	document.all["div" + ppgActiveTab.id.substr(3)].style.display = "none"

	objTab.className = "dsTabButtonActive"
	switch(objTab.id)
	{
		case "tabProperties":
			divBehaviors.style.display = "block"
			btnOK.focus()
			break;
	}

	// Make this tab as active tab
	ppgActiveTab = objTab
}

//-----------------------------------------------------------------------------
function ppgBuildPropertiesTable()
{
	var oTable = document.getElementById("tblProperties");
	var len = xmlNode ? xmlNode.attributes.length : 0;
	for (var i = 0; i < len; i++)
	{
		var oAttr=xmlNode.attributes.item(i)

		row = oTable.insertRow();
		row.style.height = "20px";

		cell = row.insertCell(0);
		cell.width="40%";
		cell.className = "dsProperty";
		cell.style.paddingLeft = "4px";
		cell.innerText = oAttr.nodeName;

		cell = row.insertCell(1);
		cell.width="60%";
		cell.className = "dsProperty";
		cell.style.paddingLeft = "4px";
		cell.innerText = oAttr.nodeValue;
	}
}
