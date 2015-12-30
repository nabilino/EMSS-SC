/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/dialogs/radio.js,v 1.2.6.1.16.2 2012/08/08 12:48:50 jomeli Exp $ */
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
var parentNode=null
var parentWnd=null
var optNode=null
var origId=""
var mode=""

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
	studioWnd = wndArguments[0]
	oFormDef = wndArguments[1]
	origId = wndArguments[2]
	mode = wndArguments[3]
	parentWnd = wndArguments[4]

	if (mode == "new")
	{
		parentNode=oFormDef.selectSingleNode("/form//fld[@id='"+origId+"']")
		origId=""
		var newId="vals"+studioWnd.designStudio.activeDesigner.source.myDoc.getUniqueID("vals","",oFormDef)
		txtOptionId.value=newId
		cbxAddAnother.disabled=false
		lblAddAnother.disabled=false
	}
	else
	{
		optNode=oFormDef.selectSingleNode("/form//vals[@id='"+origId+"']")
		parentNode=optNode.parentNode

		txtOptionId.value=optNode.getAttribute("id")
		txtDataValue.value=optNode.getAttribute("Tran")?optNode.getAttribute("Tran"):""
		txtDisplayValue.value=optNode.text
	}

	document.body.style.visibility="visible"
	if (mode == "new")
		txtDataValue.focus()
	else
		btnOK.focus()
}

//-----------------------------------------------------------------------------
function optOnKeyPress()
{
	var evtCaught=false;

	if (khdlOKCancel(event))
		evtCaught=true;
	else if (event.srcElement.id.substr(0,3) == "txt")
	{
		if (event.keyCode==34)	// double qoute
		{
			event.keyCode=0;
			evtCaught=true;
		}
	}

	if (evtCaught)
	{
		event.cancelBubble=true;
		event.returnValue=false;
	}
	return (evtCaught);	
}

//-----------------------------------------------------------------------------
function optOnOK()
{
	// be sure we have all the required values
	var reqMsg=pageXLT.selectSingleNode("//phrase[@id='msgRequiredValue']").text
	if (txtOptionId.value == "")
	{
	 	txtOptionId.focus()
		studioWnd.cmnDlg.messageBox(reqMsg,"ok","info",window)
		return;
	}
	if (txtDataValue.value == "")
	{
	 	txtDataValue.focus()
		studioWnd.cmnDlg.messageBox(reqMsg,"ok","info",window)
		return;
	}
	if (txtDisplayValue.value == "")
	{
	 	txtDataValue.focus()
		studioWnd.cmnDlg.messageBox(reqMsg,"ok","info",window)
		return;
	}

	// check for a unique id
	if ( origId != txtOptionId.value )
	{
		// check for existing id
		if ( oFormDef.selectSingleNode("/form//vals[@id='"+txtOptionId.value+"']") )
		{
			txtOptionId.focus()
			txtOptionId.select()
			var msg=pageXLT.selectSingleNode("//phrase[@id='msgIdAlreadyAssigned']").text +
				"\n" + pageXLT.selectSingleNode("//phrase[@id='msgDifferentIdReq']").text
			studioWnd.cmnDlg.messageBox(msg,"ok","alert",window)
			return;
		}
	}
	if (mode=="new")
	{
		optNode=oFormDef.createNode("1","vals","")
		parentNode.appendChild(optNode)
	}

	window.returnValue=txtOptionId.value;
	optNode.setAttribute("id", txtOptionId.value)
	optNode.setAttribute("Tran", txtDataValue.value)
	optNode.setAttribute("Disp", txtDataValue.value)
	if (optNode.childNodes.length)
		optNode.replaceChild(oFormDef.createTextNode(txtDisplayValue.value), optNode.childNodes[0])
	else
		optNode.appendChild(oFormDef.createTextNode(txtDisplayValue.value))

	// new mode may stay here for more!
	if (mode!="new" || !cbxAddAnother.checked)
	{
		window.close()
		return;
	}

	// add option to parent window
	var oOption = parentWnd.document.createElement("option")
	oOption.value = txtOptionId.value
	oOption.text = parentWnd.lstGetOptionText(optNode)
	parentWnd.document.all.selOptions.add(oOption)
	parentWnd.document.all.selOptions.selectedIndex=parentWnd.document.all.selOptions.options.length-1

	// set up this window for another
	var newId="vals"+studioWnd.designStudio.activeDesigner.source.myDoc.getUniqueID("vals","",oFormDef)
	txtOptionId.value=newId
	txtDataValue.value=""
	txtDisplayValue.value=""
	txtDataValue.focus()
}
