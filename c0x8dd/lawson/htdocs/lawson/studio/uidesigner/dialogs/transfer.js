/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/dialogs/transfer.js,v 1.3.6.2.22.2 2012/08/08 12:48:50 jomeli Exp $ */
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
var transNode=null
var tranNode=null
var origId=""
var mode=""

//-----------------------------------------------------------------------------
function dsInit()
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
	transNode=oFormDef.selectSingleNode("/form/transfers")

	if (mode == "new")
	{
		// construct id for new transfer
		var newId="frm_trans"+studioWnd.designStudio.activeDesigner.source.myDoc.getUniqueID("frm_trans","",oFormDef)
		txtTransId.value=newId
	}
	else
	{
		tranNode=oFormDef.selectSingleNode("/form/transfers/frm_trans[@id='"+origId+"']")
		txtTransId.value=tranNode.getAttribute("id")
		txtPhrase.value=tranNode.getAttribute("TITLE")
		var token=tranNode.getAttribute("TOKEN")
		if (token.indexOf("::") != -1)
		{
			var parms=token.split("::")
			txtURI.value=parms[0]
			txtCustomId.value=parms[1]
		}
		else
			txtURI.value=token
	}

	document.body.style.visibility="visible"
	btnOK.focus()
}

//-----------------------------------------------------------------------------
function dsOnKeyPress()
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
function dsOnOK()
{
	// check for required values
	if (txtTransId.value == "")
	{
		txtTransId.focus()
		var msg=pageXLT.selectSingleNode("//phrase[@id='msgPleaseEnterReq']").text
		studioWnd.cmnDlg.messageBox(msg,"ok","alert",window)
		return;
	}
	if (txtURI.value == "")
	{
		txtURIId.focus()
		var msg=pageXLT.selectSingleNode("//phrase[@id='msgPleaseEnterReq']").text
		studioWnd.cmnDlg.messageBox(msg,"ok","alert",window)
		return;
	}
	if (txtPhrase.value == "")
	{
		txtPhrase.focus()
		var msg=pageXLT.selectSingleNode("//phrase[@id='msgPleaseEnterReq']").text
		studioWnd.cmnDlg.messageBox(msg,"ok","alert",window)
		return;
	}

	// check that the id is not already assigned
	if ( (mode == "new")
	|| (mode=="assigned" && origId != txtTransId.value) )
	{
		// check for existing id
		if ( oFormDef.selectSingleNode("/form/transfers/frm_trans[@id='"+txtTransId.value+"']") )
		{
			txtTransId.focus()
			txtTransId.select()
			var msg=pageXLT.selectSingleNode("//phrase[@id='msgIdAlreadyAssigned']").text +
				"\n" + pageXLT.selectSingleNode("//phrase[@id='msgDifferentIdReq']").text
			studioWnd.cmnDlg.messageBox(msg,"ok","alert",window)
			return;
		}
	}

	var token=txtURI.value
	// append custom form id to token (not if URI is an URL)
	if (txtCustomId.value != "" && token.substr(0,4).toLowerCase() != "http")
		token+="::"+txtCustomId.value.toUpperCase()

	if (mode == "new")
	{
		if (!transNode)
		{
			transNode=oFormDef.createNode("1", "transfers", "")
			studioWnd.designStudio.activeDesigner.source.myDoc.labelCnt++
			transNode.setAttribute("nbr", "_l"+studioWnd.designStudio.activeDesigner.source.myDoc.labelCnt)
			var newId="transfers"+studioWnd.designStudio.activeDesigner.source.myDoc.getUniqueID("transfers","",oFormDef)
			transNode.setAttribute("id", newId)
			var formNode=oFormDef.selectSingleNode("/form")
			formNode.appendChild(transNode)
		}
		var newNode=oFormDef.createNode("1", "frm_trans", "")
		newNode.setAttribute("PROD", studioWnd.designStudio.getUserVariable("ProductLine"))
		newNode.setAttribute("TOKEN", token)
		newNode.setAttribute("TITLE", txtPhrase.value)
		studioWnd.designStudio.activeDesigner.source.myDoc.labelCnt++
		newNode.setAttribute("nbr", "_l"+studioWnd.designStudio.activeDesigner.source.myDoc.labelCnt)
		newNode.setAttribute("id", txtTransId.value)
		transNode.appendChild(newNode)
	}
	else
	{
		tranNode.setAttribute("id", txtTransId.value)
		tranNode.setAttribute("TOKEN", token)
		tranNode.setAttribute("TITLE", txtPhrase.value)
	}
	window.returnValue=txtTransId.value;
	window.close()
}
