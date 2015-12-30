/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/dialogs/taborder.js,v 1.7.2.1.4.1.12.1.8.2 2012/08/08 12:48:50 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// taborder.js
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

var studioWnd=null
var sourceWnd=null
var parNode=null
var bModified=false;
var bInVisualMode=false;
var saveWidth="";
var saveTop="";
var saveLeft="";
var saveHeight="";

//-----------------------------------------------------------------------------
function tabInit()
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
	sourceWnd = wndArguments[1]

	// make a local copy of the UI xml
	oFormDef=studioWnd.xmlFactory.createInstance("DOM");
	oFormDef.async=false;
	oFormDef.loadXML(sourceWnd.myDoc.xmlDoc.xml)

	var tempNode = wndArguments[2]
	if (tempNode.nodeName=="form")
		parNode=oFormDef.selectSingleNode("/form")
	else
		parNode=oFormDef.selectSingleNode("/form//*[@id='"+tempNode.getAttribute("id")+"']")
	
	// initialize values
	if (!tabBuildFieldList())
	{
		var msg=pageXLT.selectSingleNode("//phrase[@id='msgNoInputFields']").text
		studioWnd.cmnDlg.messageBox(msg,"ok","stop",window)
		window.close()
		return;
	}
	selFields.selectedIndex=0
	tabOnFieldChange()

	// prime return value for no update
	window.returnValue=false

	// show the document
	document.body.style.visibility="visible"
	document.body.style.cursor="auto"
	selFields.focus()
}

//-----------------------------------------------------------------------------
function tabUnload()
{
	if (bInVisualMode)
		tabRemoveVisualizations();
}

//-----------------------------------------------------------------------------
function tabOnKeyDown()
{
	var bEvtCaught=false;
	switch(event.keyCode)
	{
	case studioWnd.keys.ESCAPE:
		bEvtCaught=true
		tabReturn()
		break;
	}

	if (bEvtCaught)
		studioWnd.setEventCancel(event)
	return (!bEvtCaught)
}
//-----------------------------------------------------------------------------
function ppgEnableApply(bEnable)
{
	if (typeof(bEnable) != "boolean")
		bEnable=true;
	btnOK.disabled=!bEnable
}

//-----------------------------------------------------------------------------
function tabReturn()
{
	window.returnValue=bModified
	window.close()
}

//-----------------------------------------------------------------------------
function tabUpdate()
{
	ppgEnableApply(false)
	btnCancel.focus()

	// apply the form XML
	if ( !oFormDef ) return;
	sourceWnd.myDoc.xmlDoc.loadXML(oFormDef.xml)
	bModified=true;
	tabReturn();
}

//-----------------------------------------------------------------------------
function tabBuildFieldList()
{
	if ( !oFormDef ) return (false);

	var len=parNode.childNodes.length
	if (!len) return (false);

	for (var i=0; i < len; i++ )
	{
		var node=parNode.childNodes[i]
		if (!tabIsInputNode(node)) continue;

		var oOption = document.createElement("option")
		oOption.value = node.getAttribute("id")
		oOption.text = node.getAttribute("id")
		selFields.add(oOption)
	}
	return (selFields.options.length > 0 ? true : false);
}

//-----------------------------------------------------------------------------
function tabIsInputNode(node)
{
	var bReturn=true;
	var nodeName=node.nodeName.toLowerCase()
	switch (nodeName)
	{
	case "transfers":	case "toolbar":		case "path":
	case "row":			case "vals":		case "xscript":
	case "include":		case "#text":		case "workflows":
	case "image":		case "line":		case "msgbar":
	case "path":		case "#comment":
		// ignore all of these
		bReturn=false
		break;
	case "detail":
		var tp=node.getAttribute("tp")
		if (!tp || tp.toLowerCase()=="hidden")
			bReturn=false
		break;
	case "fld":
		var tp=node.getAttribute("tp")
		if (!tp || tp.toLowerCase()=="hidden" || tp.toLowerCase()=="sp"
				|| tp.toLowerCase()=="label" || tp.toLowerCase()=="out" 
				|| tp.toLowerCase()=="tab" || tp.toLowerCase()=="rect" || tp.toLowerCase()=="tabhidden")
			bReturn=false
		break;
	case "push":
		var tp=node.getAttribute("tp")
		if (tp && tp.toLowerCase()=="hidden")
			bReturn=false
		break;		
	default:
		bReturn=true;
		break;
	}
	return (bReturn);
}

//-----------------------------------------------------------------------------
function tabOnFieldChange()
{
	// enable/disable buttons
	btnUp.disabled=false;
	btnDown.disabled=false;
	if (selFields.selectedIndex < 1)
		btnUp.disabled=true;
	if (selFields.selectedIndex+1 == selFields.options.length)
		btnDown.disabled=true;
}

//-----------------------------------------------------------------------------
function tabMoveField(direction)
{
	// must have a selection
	var selIndex = selFields.selectedIndex
	if (selIndex == -1) return

	var aChild = selFields.children(selIndex)

	switch (direction)
	{
	case "up" :
		// any where to go?
		if (selIndex < 1) return

		var dnVal = selFields.options[selIndex].value
		var dnText = selFields.options[selIndex].text
		var upVal = selFields.options[selIndex-1].value
		var upText = selFields.options[selIndex-1].text

		var oUpNode=parNode.selectSingleNode("./*[@id='"+upVal+"']")
		var oDnNode=parNode.selectSingleNode("./*[@id='"+dnVal+"']")

		parNode.insertBefore(oDnNode, oUpNode)
			
		selFields.options[selIndex-1].value = dnVal
		selFields.options[selIndex-1].text = dnText
		selFields.options[selIndex].value = upVal
		selFields.options[selIndex].text = upText
		selFields.selectedIndex=selIndex-1
		break;

	case "dn" :
		// any where to go?
		if (selIndex > selFields.options.length-2)
			return

		var upVal = selFields.options[selIndex].value
		var upText = selFields.options[selIndex].text
		var dnVal = selFields.options[selIndex+1].value
		var dnText = selFields.options[selIndex+1].text

		var oUpNode=parNode.selectSingleNode("./*[@id='"+upVal+"']")
		var oDnNode=parNode.selectSingleNode("./*[@id='"+dnVal+"']")

		parNode.insertBefore(oDnNode, oUpNode)

		selFields.options[selIndex+1].value = upVal
		selFields.options[selIndex+1].text = upText
		selFields.options[selIndex].value = dnVal
		selFields.options[selIndex].text = dnText
		
		selFields.selectedIndex=selIndex+1
		break;
	}
	tabOnFieldChange()
	ppgEnableApply()
}

//-----------------------------------------------------------------------------
function tabVisualizeStart()
{
	bInVisualMode=true;
	saveWidth=window.dialogWidth;
	saveTop=window.dialogTop;
	saveLeft=window.dialogLeft;
	saveHeight=window.dialogHeight;

	divButtons.style.visibility="hidden";
	btnRestore.style.visibility="visible";
	btnRestore.focus();
	selFields.disabled=true;
	btnUp.style.visibility="hidden";
	btnDown.style.visibility="hidden";
	btnVisual.style.visibility="hidden";

	window.dialogWidth="160px";
	window.dialogTop="0px";
	window.dialogLeft=parseInt(screen.availWidth-160)+"px";
	window.dialogHeight="340px";

	var editor = sourceWnd.myDesign.active
			? sourceWnd.myDesign.editor
			: sourceWnd.myObject.editor;
	var objBody = sourceWnd.myDesign.active
			? editor.cwDoc.body
			: editor.cwDoc.getElementById(sourceWnd.myObject.getTargetElement());
	var len=selFields.options.length;
	for (var i = 0; i < len; i++)
	{
		var elem=editor.cwDoc.getElementById(selFields.options[i].value);
		if (!elem)
			continue;
		var label=editor.cwDoc.createElement("LABEL");
		label.id = "TabLbl"+elem.id;
		label.style.position="absolute";
		label.style.top=(parseInt(elem.style.top)-4)+"px";
		label.style.left=elem.style.left;
		label.style.color="red";
		label.className = "uiLabel";
		label.innerText = i+1+"";
		objBody.appendChild(label);
	}
}

//-----------------------------------------------------------------------------
function tabVisualizeEnd()
{
	tabRemoveVisualizations();
	bInVisualMode=false;

	selFields.disabled=false;
	btnUp.style.visibility="visible";
	btnDown.style.visibility="visible";
	btnVisual.style.visibility="visible";
	btnVisual.focus();
	btnRestore.style.visibility="hidden";
	divButtons.style.visibility="visible";

	window.dialogWidth=saveWidth;
	window.dialogTop=saveTop;
	window.dialogLeft=saveLeft;
	window.dialogHeight=saveHeight;
}

//-----------------------------------------------------------------------------
function tabRemoveVisualizations()
{
	var editor = sourceWnd.myDesign.active
			? sourceWnd.myDesign.editor
			: sourceWnd.myObject.editor;
	var objBody = sourceWnd.myDesign.active
			? editor.cwDoc.body
			: editor.cwDoc.getElementById(sourceWnd.myObject.getTargetElement());
	var len=selFields.options.length;
	for (var i = 0; i < len; i++)
	{
		var elem=editor.cwDoc.getElementById(selFields.options[i].value);
		if (!elem)
			continue;		
		var label=editor.cwDoc.getElementById("TabLbl"+elem.id);
		if (label)
			objBody.removeChild(label);
	}
}
