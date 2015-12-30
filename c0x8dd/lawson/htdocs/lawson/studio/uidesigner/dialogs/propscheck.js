/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/dialogs/propscheck.js,v 1.2.6.2.16.2 2012/08/08 12:48:50 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// propscheck.js
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

var parentWnd=null
var sourceWnd=null
var mFormElem=null
var ctlNode=null
var checkedNode=null
var uncheckedNode=null
var propBag=null
var oFormDef=null
var oOrigDef=null
var origId=""
var bModified=false;

//-----------------------------------------------------------------------------
function chkInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	// save dialog arguments
	parentWnd = wndArguments[0]
	propBag = wndArguments[1]
	sourceWnd = wndArguments[2]
	oOrigDef = sourceWnd.myDoc.origDoc

	// make a local copy of the UI xml
	oFormDef=parentWnd.xmlFactory.createInstance("DOM");
	oFormDef.async=false;
	oFormDef.loadXML(sourceWnd.myDoc.xmlDoc.xml)

	mFormElem=wndArguments[3]
	origId=mFormElem.getAttribute("id")
	ctlNode=oFormDef.selectSingleNode("/form//fld[@id='"+origId+"']")

	// set the active tab
	ppgActiveTab = tabGeneral

	// initialize values
	txtCheckId.innerText=origId
	var label=ctlNode.getAttribute("label")
	txtCheckText.innerText=label ? label : "New Checkbox" ;

	var bDefaults=false
	if (!ctlNode.selectSingleNode("./vals"))
		bDefaults=chkGetOriginalOptions()

	checkedNode=ctlNode.selectSingleNode("./vals[@checked='1']")
	if (checkedNode)
		txtCheckedValue.value = checkedNode.getAttribute("Tran") ? 
				checkedNode.getAttribute("Tran") : checkedNode.getAttribute("Disp");

	uncheckedNode=ctlNode.selectSingleNode("./vals[@checked='0']")
	if (uncheckedNode)
		txtUncheckedValue.value = uncheckedNode.getAttribute("Tran") ? 
				uncheckedNode.getAttribute("Tran") : checkedNode.getAttribute("Disp");

	// show the document
	document.body.style.visibility="visible"
	document.body.style.cursor="auto"
	txtCheckedValue.focus()
	txtCheckedValue.select()

	if (bDefaults)
	{
		var msg=pageXLT.selectSingleNode("//phrase[@id='msgDefaultsApplied']").text
		studioWnd.cmnDlg.messageBox(msg,"ok","info",window)
	}
}

//-----------------------------------------------------------------------------
function chkGetOriginalOptions()
{
	var nm=ctlNode.getAttribute("nm")
	if (!nm || nm == "") return (false);

	var lstNode=oOrigDef.selectSingleNode("//fld[@nm='"+nm+"']")
	if (!lstNode) return (false);
	
	if (lstNode.getAttribute("defval"))
		ctlNode.setAttribute("defval",lstNode.getAttribute("defval"))

	var valsNodes=lstNode.selectNodes("./vals")
	var len = valsNodes.length
	if (!len) return (false);

	var val0=""
	var val1=""

	if (valsNodes[0].getAttribute("Tran"))
		val0 = valsNodes[0].getAttribute("Tran")
	else if (valsNodes[0].getAttribute("Disp")) 
		val0 = valsNodes[0].getAttribute("Disp")

	if (valsNodes[1].getAttribute("Tran"))
		val1 = valsNodes[1].getAttribute("Tran")
	else if (valsNodes[1].getAttribute("Disp"))
		val1 = valsNodes[1].getAttribute("Disp")

	if ((val0=="N" && val1=="Y") || (val0=="Y" && val1=="N"))
	{
		// yes will be checked, no will be unchecked
		var cloneNode=chkCloneNode(valsNodes[0])
		cloneNode.setAttribute("checked", val0=="N" ? "0" : "1")
		cloneNode=chkCloneNode(valsNodes[1])
		cloneNode.setAttribute("checked", val1=="Y" ? "1" : "0")
	}

	else if ((val0=="A" && val1=="I") || (val0=="I" && val1=="A"))
	{
		// active will be checked, inactive unchecked 
		var cloneNode=chkCloneNode(valsNodes[0])
		cloneNode.setAttribute("checked", val0=="I" ? "0" : "1")
		cloneNode=chkCloneNode(valsNodes[1])
		cloneNode.setAttribute("checked", val1=="A" ? "1" : "0")
	}
	else
		return (false);

	ppgEnableApply()
	return (true);
}

//-----------------------------------------------------------------------------
function chkCloneNode(node)
{
	var cloneNode=node.cloneNode(true)
	cloneNode.setAttribute("id",
		"vals"+sourceWnd.myDoc.getUniqueID("vals","",oFormDef))
	sourceWnd.myDoc.labelCnt++
	cloneNode.setAttribute("nbr","_l" + sourceWnd.myDoc.labelCnt)
	if (!cloneNode.getAttribute("Tran"))
		cloneNode.setAttribute("Tran",cloneNode.getAttribute("Disp"))
	ctlNode.appendChild(cloneNode)
	return (cloneNode);
}

//-----------------------------------------------------------------------------
function chkOnKeyDown()
{
	var bEvtCaught=false;
	switch(event.keyCode)
	{
	case parentWnd.keys.ESCAPE:
		var mElement=event.srcElement
		// need to check for dropped select box
		if (mElement.tagName.toLowerCase() == "select"
		&& mElement.getAttribute("size") == "0")
		{
		}
		bEvtCaught=true
		window.close()
		break;
	case parentWnd.keys.ENTER:
		break;
	case parentWnd.keys.PAGE_UP:		// previous tab
		if( !event.altKey && event.ctrlKey && !event.shiftKey )
		{
			chkActivateTab(-1)
			bEvtCaught=true
		}
		break;
	case parentWnd.keys.PAGE_DOWN:		// next tab
		if( !event.altKey && event.ctrlKey && !event.shiftKey )
		{
			chkActivateTab(1)
			bEvtCaught=true
		}
		break;
	case parentWnd.keys.QUOTE:
		if( !event.altKey && !event.ctrlKey && event.shiftKey )	// double quote
		{
			if (event.srcElement.id.substr(0,3) == "txt")
				bEvtCaught=true
		}
		break;
	}

	// any character in data value fields enables apply button (not tab, shift, ctrl, alt)
	if (!bEvtCaught)
	{
		if (event.keyCode!=9 && event.keyCode!=16 && event.keyCode!=17 && event.keyCode!=18)
		{
			if ( event.srcElement.id == "txtCheckedValue"
			|| event.srcElement.id == "txtUncheckedValue" )
				ppgEnableApply();
		}
	}

	if (bEvtCaught)
		parentWnd.setEventCancel(event)
	return (!bEvtCaught)
}

//-----------------------------------------------------------------------------
function chkActivateTab(inc)
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
function chkSwitchTab(objTab)
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
			txtCheckedValue.focus()
			txtCheckedValue.select()
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
function chkReturn()
{
	window.returnValue=bModified
	window.close()
}

//-----------------------------------------------------------------------------
function chkOK()
{
	if (!btnApply.disabled)
	{
		if (!chkUpdate()) return;
	}
	chkReturn()
}

//-----------------------------------------------------------------------------
function chkUpdate()
{
	ppgEnableApply(false)
	btnCancel.focus()

	// apply xml to parent window's xml
	if ( !oFormDef ) return (false);

	if (!checkedNode)
	{
		checkedNode=oFormDef.createNode(1, "vals","")
		checkedNode.setAttribute("checked","1")
		ctlNode.appendChild(checkedNode)
	}
	checkedNode.setAttribute("Tran",txtCheckedValue.value)
	checkedNode.setAttribute("Disp",txtCheckedValue.value)

	if (!uncheckedNode)
	{
		uncheckedNode=oFormDef.createNode(1, "vals","")
		uncheckedNode.setAttribute("checked","0")
		ctlNode.appendChild(uncheckedNode)
	}
	uncheckedNode.setAttribute("Tran",txtUncheckedValue.value)
	uncheckedNode.setAttribute("Disp",txtUncheckedValue.value)

	// apply the form XML
	sourceWnd.myDoc.xmlDoc.loadXML(oFormDef.xml)
	sourceWnd.myDoc.setModifiedFlag(true,false)
	bModified=true;
	return (true);
}

