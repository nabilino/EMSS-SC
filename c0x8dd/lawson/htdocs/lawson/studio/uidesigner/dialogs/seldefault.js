/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/dialogs/seldefault.js,v 1.2.28.2 2012/08/08 12:48:50 jomeli Exp $ */
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

var studioWnd=null
var oFormDef=null
var ctlNode=null
var strCurValue

//-----------------------------------------------------------------------------
function defInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	studioWnd = wndArguments[0]
	strCurValue = wndArguments[1]
	sourceWnd = wndArguments[2]
	oFormDef=sourceWnd.myDoc.xmlDoc
	ctlNode=oFormDef.selectSingleNode("//fld[@id='"+wndArguments[3].id+"']")

	oWdgtXML = wndArguments[6]

	// load the select options
	defLoadAssigned()
	
	document.body.style.visibility="visible"
	btnOK.focus()
}

//-----------------------------------------------------------------------------
function dlgOnKeyPress()
{
	if (khdlOKCancel(event))
	{
		event.cancelBubble=true
		event.returnValue=false
		return true
	}
	return(false)
}

//-----------------------------------------------------------------------------
function defLoadAssigned()
{
	if (ctlNode == null) return;

	var nodeName=ctlNode.nodeName.toLowerCase()
	var nodes = ctlNode.childNodes

	for (var i=0; i<nodes.length; i++ )
	{
		var oOption = document.createElement("option")
		var value=""
		var nm=""
		value=nodes[i].getAttribute("Tran") ? nodes[i].getAttribute("Tran") : nodes[i].getAttribute("Disp")
		nm=nodes[i].text
		oOption.text=value+"="+nm
		oOption.value=value
		if (strCurValue!="" && value==strCurValue)
			oOption.selected=true
		selassigned.add(oOption)
	}
}

//-----------------------------------------------------------------------------
function defSelect()
{
	if (selassigned.selectedIndex==-1) return

	// set the return value
	window.returnValue=selassigned.options[selassigned.selectedIndex].value

	// all done
	window.close()
}

//-----------------------------------------------------------------------------
function defOnKeyPress()
{
	if (khdlOKCancel(event))
	{
		event.cancelBubble=true
		event.returnValue=false
		return true
	}
	return false
}
