/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/dialogs/transaction.js,v 1.2.28.2 2012/08/08 12:48:50 jomeli Exp $ */
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
var oOrigForm=null
var oFormDef=null

//-----------------------------------------------------------------------------
function trnInit()
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
	oOrigForm = wndArguments[2]

	var oTranXSL=studioWnd.xmlFactory.createInstance("DOM");
	var path=studioWnd.studioPath+"/uidesigner/dialogs/transaction.xsl"
	oTranXSL.async=false;
	oTranXSL.load(path)
	if (oTranXSL.parseError.errorCode != 0)
	{
		studioWnd.displayDOMError(oTranXSL.parseError,path)
		return;
	}

	flddiv.innerHTML=oOrigForm.transformNode(oTranXSL)

	var fNodes=oFormDef.selectNodes("//fld[@nbr and (@tp='Text' or @tp='Hidden' or @tp='Select' or @tp='Out')] | //push[@nbr]")
	var len=fNodes.length
	for ( var i=0; i < len; i++)
	{
		var rtn = fNodes[i].getAttribute("rtn")
		if (rtn && rtn=="1")
		{
			var cbx=document.getElementById("cbx"+fNodes[i].getAttribute("nm"))
			if(cbx)
				cbx.checked=true
		}
	}
	
	window.returnValue=false;
	document.body.style.visibility="visible"
	btnOK.focus()
}

//-----------------------------------------------------------------------------
function trnOnKeyPress()
{
	if (khdlOKCancel(event))
	{
		event.cancelBubble=true
		event.returnValue=false
		return true
	}
	return false
}

//-----------------------------------------------------------------------------
function trnOK()
{
	trnClearRtnAttr()

	var count = trnSetRtnAttr()
	if ( count < 1 )
	{
		var msg=pageXLT.selectSingleNode("//phrase[@id='msgSelReq']").text
		studioWnd.cmnDlg.messageBox(msg,"ok","alert",window)
		return
	}

	// all done
	window.returnValue=true;
	window.close()
}

//-----------------------------------------------------------------------------
function trnClearRtnAttr()
{
	// clear the change attribute on all form fields
	var nodes=oFormDef.selectNodes("//fld[@nbr and (@tp='Text' or @tp='Hidden' or @tp='Select' or @tp='Out')] | //push[@nbr]")
	var len=nodes.length
	for ( var i=0; i < len; i++ )
		nodes[i].setAttribute("rtn", "0")
}

//-----------------------------------------------------------------------------
function trnSetRtnAttr()
{
	// set the change attribute on checked from fields
	var cbxs = document.getElementsByName("fldCheckBox")
	var len = cbxs.length
	var frmNode=oFormDef.selectSingleNode("//form")
	var count=0
	for ( var i = 0; i < len; i++ )
	{
		if (cbxs[i].checked)
		{
			count += 1
			var cNode=oFormDef.selectSingleNode("//*[@nbr='"+cbxs[i].nbr+"']")
			if(cNode)
			{
				cNode.setAttribute("rtn", "1")
			}
			else
			{
				if(typeof(cbxs[i].isxlt)!="undefined")
					oNode=oOrigForm.selectSingleNode("//*[@nm='"+cbxs[i].fldname+"' and @isxlt]")
				else
					oNode=oOrigForm.selectSingleNode("//*[@nm='"+cbxs[i].fldname+"' and not(@isxlt)]")
				oNode.setAttribute("rtn","1")
				oNode.setAttribute("tp","Hidden")
				frmNode.appendChild(oNode.cloneNode(true))
			}
		}	
	}
	return count
}
