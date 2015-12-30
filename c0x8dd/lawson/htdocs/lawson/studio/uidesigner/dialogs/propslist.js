/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/dialogs/propslist.js,v 1.2.8.1.22.2 2012/08/08 12:48:50 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// propslist.js
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
var bDefaultsApplied=false;
var bModified=false;

var studioWnd=null		// initialized in htm
var sourceWnd=null
var ctlNode=null
var propBag=null
var oFormDef=null;
var oOrigDef=null;
var origId=""

var xltNode=null;

//-----------------------------------------------------------------------------
function lstInit()
{
	// Note: additional initialization in body element of HTM

	// set the active tab
	ppgActiveTab = tabGeneral;

	// initialize values
	txtListId.innerText=origId;
	if (lstBuildOptionsList())
		selOptions.selectedIndex=0;
	lstOnOptionChange();
	lstSetOutputField();

	// show the document
	document.body.style.visibility="visible";
	document.body.style.cursor="auto";
	selOptions.focus();

	if (bDefaultsApplied)
	{
		var msg=pageXLT.selectSingleNode("//phrase[@id='msgDefaultsApplied']").text;
		studioWnd.cmnDlg.messageBox(msg,"ok","info",window);
	}
}

//-----------------------------------------------------------------------------
function lstOnKeyDown()
{
	var bEvtCaught=false;
	switch(event.keyCode)
	{
	case studioWnd.keys.ESCAPE:
		var mElement=event.srcElement
		// need to check for dropped select box
		if (mElement.tagName.toLowerCase() == "select"
		&& mElement.getAttribute("size") == "0")
		{
		}
		bEvtCaught=true
		window.close()
		break;
	case studioWnd.keys.ENTER:
		if (event.srcElement.id == "selOptions")
		{
			btnOptionProps.click()
			bEvtCaught=true
		}
		break;
	case studioWnd.keys.PAGE_UP:		// previous tab
		if( !event.altKey && event.ctrlKey && !event.shiftKey )
		{
			lstActivateTab(-1)
			bEvtCaught=true
		}
		break;
	case studioWnd.keys.PAGE_DOWN:		// next tab
		if( !event.altKey && event.ctrlKey && !event.shiftKey )
		{
			lstActivateTab(1)
			bEvtCaught=true
		}
		break;
	}

	if (bEvtCaught)
		studioWnd.setEventCancel(event)
	return (!bEvtCaught)
}

//-----------------------------------------------------------------------------
function lstActivateTab(inc)
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
function lstSwitchTab(objTab)
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
			selOptions.focus()
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
function lstReturn()
{
	window.returnValue=bModified
	window.close()
}

//-----------------------------------------------------------------------------
function lstOK()
{
	if (!btnApply.disabled)
	{
		if (!lstUpdate()) return;
	}
	lstReturn()
}

//-----------------------------------------------------------------------------
function lstUpdate()
{
	ppgEnableApply(false)
	btnCancel.focus()

	// apply xml to parent window's xml
	if ( !oFormDef ) return (false);

	// apply the form XML
	sourceWnd.myDoc.xmlDoc.loadXML(oFormDef.xml)
	sourceWnd.myDoc.setModifiedFlag(true,false)
	bModified=true;
	return (true);
}

//-----------------------------------------------------------------------------
function lstBuildOptionsList()
{
	if ( !oFormDef ) return (false);

	var optNodes = ctlNode.selectNodes("./vals")
	if (!optNodes.length)
	{
		bDefaultsApplied=lstGetOriginalList()
		if (!bDefaultsApplied) return (false);
		optNodes = ctlNode.selectNodes("./vals")
	}

	for (var i=0; i < optNodes.length; i++ )
	{
		var oOption = document.createElement("option")
		oOption.value = optNodes[i].getAttribute("id")
		oOption.text = lstGetOptionText(optNodes[i])
		selOptions.add(oOption)
	}
	return (true);
}

//-----------------------------------------------------------------------------
function lstGetOriginalList()
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
	for (var i = 0; i < len; i++)
	{
		var cloneNode=valsNodes[i].cloneNode(true)
		cloneNode.setAttribute("id",
			"vals"+sourceWnd.myDoc.getUniqueID("vals","",oFormDef))
		sourceWnd.myDoc.labelCnt++
		cloneNode.setAttribute("nbr","_l" + sourceWnd.myDoc.labelCnt)
		if (!cloneNode.getAttribute("Tran"))
			cloneNode.setAttribute("Tran",cloneNode.getAttribute("Disp"))
		ctlNode.appendChild(cloneNode)
	}

	ppgEnableApply()
	return (true);
}

//-----------------------------------------------------------------------------
function lstGetOptionText(node)
{
	var tran = node.getAttribute("Tran") ? 
			node.getAttribute("Tran") : node.getAttribute("Disp");
	return (node.text+" ("+tran+")")
}

//-----------------------------------------------------------------------------
function lstOnOptionChange()
{
	// enable/disable buttons
	btnOptionProps.disabled=false;
	btnNewOption.disabled=false;
	btnDeleteOption.disabled=false;
	btnUpOption.disabled=false;
	btnDownOption.disabled=false;
	if (!selOptions.options.length)
	{
		btnOptionProps.disabled=true;
		btnDeleteOption.disabled=true;
	}
	if (selOptions.selectedIndex < 1)
		btnUpOption.disabled=true;
	if (selOptions.selectedIndex+1 == selOptions.options.length)
		btnDownOption.disabled=true;
}

//-----------------------------------------------------------------------------
function lstOptionProperty(mode)
{
	var selIndex=selOptions.selectedIndex
	if (selIndex == -1 && mode != "new") return;

 	var frmArgs = new Array()
 	frmArgs[0]=studioWnd
 	frmArgs[1]=oFormDef
	if (mode=="new")
	 	frmArgs[2]=ctlNode.getAttribute("id")
	else
	 	frmArgs[2]=selOptions.options[selIndex].value
 	frmArgs[3]=mode
 	frmArgs[4]=window

	var htmPath=ctlNode.getAttribute("seltype")=="radio" ?
			studioWnd.studioPath+"/uidesigner/dialogs/radio.htm" :
			studioWnd.studioPath+"/uidesigner/dialogs/option.htm"
	var strFeatures="center:yes;help:no;scroll:no;status:no;dialogWidth:460px;dialogHeight:"
	strFeatures+= ctlNode.getAttribute("seltype")=="radio" ? "220px;" : "260px;" ;

	var optId = showModalDialog(htmPath, frmArgs, strFeatures)
	if (typeof(optId) != "undefined" && optId != null)
	{
 		var chNode=oFormDef.selectSingleNode("/form//vals[@id='"+optId+"']")
		if (mode=="new")
		{
			var oOption = document.createElement("option")
			oOption.value = chNode.getAttribute("id")
			oOption.text = lstGetOptionText(chNode)
			selOptions.add(oOption)
			selOptions.selectedIndex=selOptions.options.length-1
		}
		else
		{
	 		if ( selOptions.options[selIndex].value != optId
	 		|| 	selOptions.options[selIndex].text != lstGetOptionText(chNode) )
	 		{
	 			selOptions.options[selIndex].value=optId
	 			selOptions.options[selIndex].text=lstGetOptionText(chNode)
	 		}
		}
		lstOnOptionChange()
		ppgEnableApply()
	}
}

//-----------------------------------------------------------------------------
function lstDeleteOption()
{
	var selIndex=selOptions.selectedIndex
	if (selIndex == -1) return;

	var msg=pageXLT.selectSingleNode("//phrase[@id='msgSelectedOption']").text
	msg+=" "+selOptions.options[selIndex].text+".\n"
	msg+=pageXLT.selectSingleNode("//phrase[@id='msgOkToDelete']").text

	var ret=studioWnd.cmnDlg.messageBox(msg,"okcancel","question",window)
	if (ret != "ok") return;

	var grpId = selOptions.options[selIndex].value
	lstDeleteNode(grpId,selOptions,selIndex)
	lstOnOptionChange()
}

//-----------------------------------------------------------------------------
function lstDeleteNode(nodeId,selElement,nIndex)
{
 	for (var i=0; i < ctlNode.childNodes.length; i++)
 	{
 		var child=ctlNode.childNodes.item(i)
 		if (child.getAttribute("id") == nodeId)
 		{
 			ctlNode.removeChild(child);
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
	ppgEnableApply()
}

//-----------------------------------------------------------------------------
function lstMoveOption(direction)
{
	// must have a selection
	var selIndex = selOptions.selectedIndex
	if (selIndex == -1) return

	var aChild = selOptions.children(selIndex)
	var oOption = document.createElement("option")

	switch (direction)
	{
	case "up" :
		// any where to go?
		if (selIndex < 1) return

		var dnVal = selOptions.options[selIndex].value
		var dnText = selOptions.options[selIndex].text
		var upVal = selOptions.options[selIndex-1].value
		var upText = selOptions.options[selIndex-1].text

		var oUpNode=oFormDef.selectSingleNode("/form//vals[@id='"+upVal+"']")
		var oDnNode=oFormDef.selectSingleNode("/form//vals[@id='"+dnVal+"']")

		ctlNode.insertBefore(oDnNode, oUpNode)
			
		selOptions.options[selIndex-1].value = dnVal
		selOptions.options[selIndex-1].text = dnText
		selOptions.options[selIndex].value = upVal
		selOptions.options[selIndex].text = upText
		selOptions.selectedIndex=selIndex-1
		break;

	case "dn" :
		// any where to go?
		if (selIndex > selOptions.options.length-2)
			return

		var upVal = selOptions.options[selIndex].value
		var upText = selOptions.options[selIndex].text
		var dnVal = selOptions.options[selIndex+1].value
		var dnText = selOptions.options[selIndex+1].text

		var oUpNode=oFormDef.selectSingleNode("/form//vals[@id='"+upVal+"']")
		var oDnNode=oFormDef.selectSingleNode("/form//vals[@id='"+dnVal+"']")

		ctlNode.insertBefore(oDnNode, oUpNode)

		selOptions.options[selIndex+1].value = upVal
		selOptions.options[selIndex+1].text = upText
		selOptions.options[selIndex].value = dnVal
		selOptions.options[selIndex].text = dnText
		
		selOptions.selectedIndex=selIndex+1
		break;
	}
	lstOnOptionChange()
	ppgEnableApply()
}

//-----------------------------------------------------------------------------
function lstSetOutputField()
{
	var txtField = window.document.getElementById("txtOutputField");
	xltNode=ctlNode.parentNode.selectSingleNode("./fld[@isxlt='"+ctlNode.getAttribute("nbr")+"']");
	txtField.innerText = ( xltNode
		? xltNode.getAttribute("id") + (xltNode.getAttribute("nm") ? "/" + xltNode.getAttribute("nm") : "")
		: "None" );
}

//-----------------------------------------------------------------------------
function lstOutputBrowse()
{
 	var frmArgs = new Array()
 	frmArgs[0]=studioWnd;
 	frmArgs[1]=oFormDef;
	if (sourceWnd.myObject.active)
	 	frmArgs[2]=sourceWnd.myDoc.xmlDoc.selectSingleNode("/form//*[@id='"+
	 			sourceWnd.myObject.getTargetElement()+"']")
	else
	 	frmArgs[2]=sourceWnd.myDoc.xmlDoc.selectSingleNode("/form")
 	frmArgs[3]=ctlNode;
 	frmArgs[4]=xltNode;

	var bMod = showModalDialog(studioWnd.studioPath+"/uidesigner/dialogs/listoutput.htm", frmArgs,
		"dialogHeight:340px;dialogWidth:260px;center:yes;help:no;scroll:no;status:no;")
	if (bMod)
	{
		ppgEnableApply();
		lstSetOutputField();
	}
}
