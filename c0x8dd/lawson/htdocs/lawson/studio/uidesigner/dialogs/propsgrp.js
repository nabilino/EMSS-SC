/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/dialogs/propsgrp.js,v 1.2.2.1.4.5.22.2 2012/08/08 12:48:50 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// propsgrp.js
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
var ppgActiveTab=null

var studioWnd=null
var sourceWnd=null
var mFormElem=null
var ctlNode=null
var propBag=null
var tool=null
var origId=""
var origGrpId=""
var bModified=false;

//-----------------------------------------------------------------------------
function grpInit()
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
	propBag = wndArguments[1]
	sourceWnd = wndArguments[2]

	// make a local copy of the UI xml
	oFormDef=studioWnd.xmlFactory.createInstance("DOM");
	oFormDef.async=false;
	oFormDef.loadXML(sourceWnd.myDoc.xmlDoc.xml)

	mFormElem=wndArguments[3]
	origId=mFormElem.getAttribute("id")
	ctlNode=oFormDef.selectSingleNode("/form//tabregion[@id='"+origId+"']")
	origGrpId=ctlNode.getAttribute("grp")

	// set the active tab
	ppgActiveTab = tabGeneral

	// initialize values
	txtGroupId.innerText=origId
	if (grpBuildGroupList())
		selGroups.selectedIndex=0
	grpOnGroupChange()

	// show the document
	document.body.style.visibility="visible"
	document.body.style.cursor="auto"
	window.returnValue=false;
	selGroups.focus()
}

//-----------------------------------------------------------------------------
function grpOnKeyDown()
{
	var bEvtCaught=false;
	switch(event.keyCode)
	{
	case studioWnd.keys.ESCAPE:
		bEvtCaught=true
		window.close()
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
function grpActivateTab(inc)
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
function grpSwitchTab(objTab)
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
function grpReturn()
{
	window.returnValue=bModified;
	window.close()
}

//-----------------------------------------------------------------------------
function grpOK()
{
	if (!btnApply.disabled)
	{
		if (!grpUpdate()) return;
	}
	grpReturn()
}

//-----------------------------------------------------------------------------
function grpUpdate()
{
	ppgEnableApply(false);
	btnCancel.focus();

	if ( !oFormDef ) return false;

	// apply the form XML
	sourceWnd.myDoc.xmlDoc.loadXML(oFormDef.xml)
	sourceWnd.myDoc.setModifiedFlag(true,false)
	bModified=true;

	// update control instance?
	var grpId=ctlNode.getAttribute("grp")
	var tabNode=oFormDef.selectSingleNode("/form//tab[@id='"+grpId+"' and @tp!='Hidden']")
	if (!tabNode)
		grpId=ctlNode.selectSingleNode("./tab[not(@tp) or @tp!='Hidden']").getAttribute("id")
	if (grpId != origGrpId)
	{
		propBag.setElement("grp",grpId)
		origGrpId=grpId
	}
	return true;
}

//-----------------------------------------------------------------------------
function grpBuildGroupList()
{
	if ( !oFormDef ) return false;

	var grpNodes = ctlNode.selectNodes("./tab")
	if (!grpNodes.length) return false;

	for (var i=0; i < grpNodes.length; i++ )
	{
		if (grpNodes[i].getAttribute("tp") == "Hidden")
			continue;
				
		var oOption = document.createElement("option")
		oOption.value = grpNodes[i].getAttribute("id")
		oOption.text = grpGetGroupText(grpNodes[i],oOption.value)
		selGroups.add(oOption)
	}
	return (selGroups.options.length ? true : false);
}

//-----------------------------------------------------------------------------
function grpGetGroupText(node,defval)
{
	if (node.getAttribute("nm"))
		return (node.getAttribute("nm")+" ("+defval+")")

	return (defval);
}

//-----------------------------------------------------------------------------
function grpOnGroupChange()
{
	// enable/disable buttons
	btnGroupProps.disabled=false;
	btnNewGroup.disabled=false;
	btnDeleteGroup.disabled=false;
	btnUpGroup.disabled=false;
	btnDownGroup.disabled=false;
	if (!selGroups.options.length)
	{
		btnGroupProps.disabled=true;
		btnDeleteGroup.disabled=true;
	}
	if (selGroups.selectedIndex < 1)
		btnUpGroup.disabled=true;
	if (selGroups.selectedIndex+1 == selGroups.options.length)
		btnDownGroup.disabled=true;
	// can't delete the only tab
	if (selGroups.options.length==1)
		btnDeleteGroup.disabled=true;
}

//-----------------------------------------------------------------------------
function grpGroupProperty(mode)
{
	var selIndex=selGroups.selectedIndex
	if (selIndex == -1 && mode != "new") return;

	var bUpdateGrp=false
 	var frmArgs = new Array()
 	frmArgs[0]=studioWnd
 	frmArgs[1]=oFormDef
	if (mode=="new")
	 	frmArgs[2]=ctlNode.getAttribute("id")
	else
	{
	 	frmArgs[2]=selGroups.options[selIndex].value
		bUpdateGrp = ctlNode.getAttribute("grp") == frmArgs[2] ? true : false;
	}
 	frmArgs[3]=mode

	var htmPath=studioWnd.studioPath+"/uidesigner/dialogs/group.htm"
	var strFeatures="dialogHeight:180px;dialogWidth:340px;center:yes;help:no;scroll:no;status:no;"

	var grpId = showModalDialog(htmPath, frmArgs, strFeatures)
	if (typeof(grpId) != "undefined")
	{
		if (bUpdateGrp)
			ctlNode.setAttribute("grp",grpId)
 		var chNode=oFormDef.selectSingleNode("/form//tab[@id='"+grpId+"']")
		if (mode=="new")
		{
			var oOption = document.createElement("option")
			oOption.value = chNode.getAttribute("id")
			oOption.text = grpGetGroupText(chNode,oOption.value)
			selGroups.add(oOption)
			selGroups.selectedIndex=selGroups.options.length-1
		}
		else
		{
	 		if ( selGroups.options[selIndex].value != grpId
	 		|| 	selGroups.options[selIndex].text != grpGetGroupText(chNode,grpId) )
	 		{
	 			selGroups.options[selIndex].value=grpId
	 			selGroups.options[selIndex].text=grpGetGroupText(chNode,grpId)
	 		}
		}
		grpOnGroupChange()
		ppgEnableApply()
	}
}

//-----------------------------------------------------------------------------
function grpDeleteGroup()
{
	var selIndex=selGroups.selectedIndex
	if (selIndex == -1) return;

	var msg=pageXLT.selectSingleNode("//phrase[@id='msgSelectedGroup']").text;
	msg+= " tab page ";
	msg+=selGroups.options[selIndex].text+".\n\n";
	msg+=pageXLT.selectSingleNode("//phrase[@id='msgAppliedNow']").text+"\n";
	msg+=(!btnApply.disabled
		? pageXLT.selectSingleNode("//phrase[@id='msgOtherChanges']").text+"\n\n"
		: "\n");
	msg+=pageXLT.selectSingleNode("//phrase[@id='msgOkToDelete']").text+"\n\n";

	var ret=studioWnd.cmnDlg.messageBox(msg,"okcancel","question",window);
	if (ret != "ok") return;

	var grpId = selGroups.options[selIndex].value;
	grpRemoveNodeContent(grpId,selGroups,selIndex);
	grpOnGroupChange();

	// was this the active tab?
	if (grpId == ctlNode.getAttribute("grp"))
	{
		selIndex=selGroups.selectedIndex;
		grpId=selGroups.options[selIndex].value;
		ctlNode.setAttribute("grp",grpId);
	}

	// we apply the update immediately
	grpUpdate();
}

//-----------------------------------------------------------------------------
function grpRemoveNodeContent(nodeId,selElement,nIndex)
{
 	for (var i=0; i < ctlNode.childNodes.length; i++)
 	{
 		var child=ctlNode.childNodes.item(i)
 		if (child.getAttribute("id") == nodeId)
 		{
			sourceWnd.myDoc.removeContent(child);
			ctlNode.appendChild(child);
 			break;
 		}
 	}

	if (typeof(selElement) != "undefined")
	{
		selElement.removeChild(selElement.children(nIndex))
		var idx=nIndex-1
		if (idx < 0 && selElement.options.length)
			idx=0
		selElement.selectedIndex=idx;
	}
}

//-----------------------------------------------------------------------------
function grpMoveGroup(direction)
{
	// must have a selection
	var selIndex = selGroups.selectedIndex
	if (selIndex == -1) return

	var aChild = selGroups.children(selIndex)
	var oOption = document.createElement("option")

	switch (direction)
	{
	case "up" :
		// any where to go?
		if (selIndex < 1) return

		var dnVal = selGroups.options[selIndex].value
		var dnText = selGroups.options[selIndex].text
		var upVal = selGroups.options[selIndex-1].value
		var upText = selGroups.options[selIndex-1].text

		var oUpNode=oFormDef.selectSingleNode("/form//tab[@id='"+upVal+"']")
		var oDnNode=oFormDef.selectSingleNode("/form//tab[@id='"+dnVal+"']")

		ctlNode.insertBefore(oDnNode, oUpNode)
			
		selGroups.options[selIndex-1].value = dnVal
		selGroups.options[selIndex-1].text = dnText
		selGroups.options[selIndex].value = upVal
		selGroups.options[selIndex].text = upText
		selGroups.selectedIndex=selIndex-1
		break;

	case "dn" :
		// any where to go?
		if (selIndex > selGroups.options.length-2)
			return

		var upVal = selGroups.options[selIndex].value
		var upText = selGroups.options[selIndex].text
		var dnVal = selGroups.options[selIndex+1].value
		var dnText = selGroups.options[selIndex+1].text

		var oUpNode=oFormDef.selectSingleNode("/form//tab[@id='"+upVal+"']")
		var oDnNode=oFormDef.selectSingleNode("/form//tab[@id='"+dnVal+"']")

		ctlNode.insertBefore(oDnNode, oUpNode)

		selGroups.options[selIndex+1].value = upVal
		selGroups.options[selIndex+1].text = upText
		selGroups.options[selIndex].value = dnVal
		selGroups.options[selIndex].text = dnText
		
		selGroups.selectedIndex=selIndex+1
		break;
	}
	grpOnGroupChange()
	ppgEnableApply()
}
