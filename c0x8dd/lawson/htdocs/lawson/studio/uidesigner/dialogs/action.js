/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/dialogs/action.js,v 1.2.28.2 2012/08/08 12:48:50 jomeli Exp $ */
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
var toolbarNode=null
var actionNode=null
var workflowNode=null
var origId=""
var origVal=""

//-----------------------------------------------------------------------------
function paInit()
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
	origId = wndArguments[2]		// really is value coming in!
	
	toolbarNode=oFormDef.selectSingleNode("/form/toolbar")

	actionNode=oFormDef.selectSingleNode("/form/toolbar/button[@value='"+origId+"']")
	origId=actionNode.getAttribute("id")
	txtActionId.value=origId
	txtPhrase.value=actionNode.getAttribute("nm")
	origVal=actionNode.getAttribute("value")
	txtActionValue.value=origVal
	workflowNode=oFormDef.selectSingleNode("/form/workflows/workflow[@value='"+origVal+"']")
	if (workflowNode)
	{
		workflowNode=workflowNode.cloneNode(true) // clone for cancel
		txtWorkflowValue.value=workflowNode.getAttribute("id")
	}
	else
	{
		btnClearWorkflow.disabled=true;
		txtWorkflowValue.value="";
	}
	cbxVisible.checked = (actionNode.getAttribute("visible") == "1" ? true : false);
	cbxVisible.disabled = 
		studioWnd.designStudio.activeDesigner.source.myDoc.isStandardAction(origVal);

	document.body.style.visibility="visible"
	btnOK.focus()
}

//-----------------------------------------------------------------------------
function paOnKeyPress()
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
function paOnOK()
{
	// confirm required entries
	var msgReq=pageXLT.selectSingleNode("//phrase[@id='msgEnterRequred']").text
	if (txtActionId.value == "")
	{
		txtActionId.focus()
		studioWnd.cmnDlg.messageBox(msgReq,"ok","info",window)
		return;
	}
	if (txtPhrase.value == "")
	{
		btnSelPhrase.focus()
		studioWnd.cmnDlg.messageBox(msgReq,"ok","info",window)
		return;
	}
	if (txtActionValue.value == "")
	{
		txtActionValue.focus()
		studioWnd.cmnDlg.messageBox(msgReq,"ok","info",window)
		return;
	}

	if ( origId != txtActionId.value )
	{
		// check for existing id
		if ( oFormDef.selectSingleNode("/form/toolbar/button[@id='"+txtActionId.value+"']") )
		{
			txtActionId.focus()
			txtActionId.select()
			var msg=pageXLT.selectSingleNode("//phrase[@id='msgIdAlreadyAssigned']").text +
				"\n" + pageXLT.selectSingleNode("//phrase[@id='msgDifferentIdReq']").text
			studioWnd.cmnDlg.messageBox(msg,"ok","info",window)
			return;
		}
	}

	window.returnValue=txtActionValue.value;
	actionNode.setAttribute("id", txtActionId.value)
	actionNode.setAttribute("nm", txtPhrase.value)
	actionNode.setAttribute("value", txtActionValue.value)
	actionNode.setAttribute("visible", cbxVisible.checked ? "1" : "0")

	// add workflows node if does not exist
	var workflowsNode=oFormDef.selectSingleNode("/form/workflows")
	if (!workflowsNode)
	{
		workflowsNode=oFormDef.createElement("workflows")
		var formNode=oFormDef.selectSingleNode("/form")
		formNode.appendChild(workflowsNode)
	}

	// detach old workflow
	var oldWorkflowNode=oFormDef.selectSingleNode("/form/workflows/workflow[@value='"+origVal+"']")
	if (oldWorkflowNode)
		workflowsNode.removeChild(oldWorkflowNode)
	
	// add workflows/workflow
	if (workflowNode)
	{
		workflowNode.setAttribute("value",txtActionValue.value)
		workflowsNode.appendChild(workflowNode)
	}
	
	window.close()
}

//-----------------------------------------------------------------------------
function paWorkflowClear()
{
	// confirm delete is ok
	var msg=pageXLT.selectSingleNode("//phrase[@id='msgOkToDeleteWorkflow']").text
	if ( studioWnd.cmnDlg.messageBox(msg,"okcancel","question",window) == "ok" )
	{
		workflowNode=null
		txtWorkflowValue.value=""
		btnOK.focus()
		btnClearWorkflow.disabled=true;
	}
}

//-----------------------------------------------------------------------------
function paWorkflowOpen()
{
 	var frmArgs = new Array()
 	frmArgs[0]=studioWnd
 	frmArgs[1]=oFormDef
 	frmArgs[2]=workflowNode

	var htmPath=studioWnd.studioPath+"/uidesigner/dialogs/workflow.htm"
	var strFeatures="dialogHeight:640px;dialogWidth:680px;center:yes;help:no;scroll:no;status:no;"
	var retNode = showModalDialog(htmPath, frmArgs, strFeatures)
	if (typeof(retNode) != "undefined")
	{
		btnClearWorkflow.disabled=false;
		txtWorkflowValue.value=retNode.getAttribute("id")
		workflowNode=retNode
	}
	else
	{
		btnClearWorkflow.disabled=true;
		txtWorkflowValue.value="";
	}
}
