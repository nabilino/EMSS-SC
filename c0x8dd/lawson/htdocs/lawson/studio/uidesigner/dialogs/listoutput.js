/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/dialogs/Attic/listoutput.js,v 1.1.4.1.22.2 2012/08/08 12:48:50 jomeli Exp $ */
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

var studioWnd=null;
var oFormDef=null;
var xltNode=null;
var ctlNode=null;
var parNode=null;
var bModified=false;

//-----------------------------------------------------------------------------
function lstInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	// save dialog arguments
	studioWnd = wndArguments[0];
	oFormDef=wndArguments[1];

	var tempNode = wndArguments[2];
	if (tempNode.nodeName=="form")
		parNode=oFormDef.selectSingleNode("/form");
	else
		parNode=oFormDef.selectSingleNode("/form//*[@id='"+tempNode.getAttribute("id")+"']");
	ctlNode = wndArguments[3];
	xltNode = wndArguments[4];
	if (xltNode)
		btnClear.disabled=false;

	// initialize values
	if (!lstBuildFieldList())
	{
		var msg=pageXLT.selectSingleNode("//phrase[@id='msgNoInputFields']").text
		studioWnd.cmnDlg.messageBox(msg,"ok","stop",window)
		window.close()
		return;
	}
	if (selFields.selectedIndex == -1)
		selFields.selectedIndex=0;

	// prime return value for no update
	window.returnValue=false

	// show the document
	document.body.style.visibility="visible"
	document.body.style.cursor="auto"
	selFields.focus()
}

//-----------------------------------------------------------------------------
function lstOnKeyDown()
{
	var bEvtCaught=false;
	switch(event.keyCode)
	{
	case studioWnd.keys.ESCAPE:
		bEvtCaught=true
		lstReturn()
		break;
	}

	if (bEvtCaught)
		studioWnd.setEventCancel(event)
	return (!bEvtCaught)
}

//-----------------------------------------------------------------------------
function lstReturn()
{
	window.returnValue=bModified
	window.close()
}

//-----------------------------------------------------------------------------
function lstClear()
{
	bModified=true;
	xltNode.removeAttribute("isxlt");
	lstReturn();
}

//-----------------------------------------------------------------------------
function lstUpdate()
{
	// apply the form XML
	var selIndex=selFields.selectedIndex;
	if (selIndex == -1) return;		// shouldn't happen

	var selId = selFields.options[selIndex].value;
	if (!xltNode || selId != xltNode.getAttribute("id"))
	{
		bModified=true;
		if (xltNode)
			xltNode.removeAttribute("isxlt");
		xltNode=parNode.selectSingleNode("./fld[@id='"+selId+"']");
		if (xltNode)
			xltNode.setAttribute("isxlt",ctlNode.getAttribute("nbr"));
	}
	lstReturn();
}

//-----------------------------------------------------------------------------
function lstBuildFieldList()
{
	if ( !oFormDef ) return (false);

	var len=parNode.childNodes.length;
	if (!len) return (false);

	for (var i=0; i < len; i++ )
	{
		var node=parNode.childNodes[i];
		if (node.nodeName != "fld")
			continue;
		var tp=node.getAttribute("tp")
		if (!tp || (tp.toLowerCase()!="text" && tp.toLowerCase()!="out"))
			continue;

		var oOption = document.createElement("option");
		oOption.value = node.getAttribute("id");
		oOption.text = node.getAttribute("id") +
			(node.getAttribute("nm") ? "/" + node.getAttribute("nm") : "");
		if (xltNode && xltNode.getAttribute("id") == oOption.value)
			oOption.selected=true;
		selFields.add(oOption);
	}
	return (selFields.options.length > 0 ? true : false);
}
