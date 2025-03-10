/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/dialogs/msgdlg.js,v 1.2.28.2 2012/08/08 12:48:48 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// msgdlg.js
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

var studioPath="";

//-----------------------------------------------------------------------------
function initMsgDlg()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	studioPath=wndArguments[0];

	// prime the return value
	window.returnValue="cancel"

	// set the buttons	
	switch (wndArguments[1])
	{
	case "ok":
		btnYes.value="OK"
		btnNo.style.display="none"
		btnCancel.style.display="none"
		window.returnValue="ok"
		break;
	case "okcancel":
		btnYes.value="OK"
		btnNo.style.display="none"
		break;
	case "yesno":
		btnCancel.style.display="none"
		window.returnValue="no"
		break;
	case "yesnocancel":
		// this is default
		break;
	case "stopcontinue":
		btnYes.value="Stop"
		btnNo.value="Continue"
		btnCancel.style.display="none"
		window.returnValue="continue"
		break;
	}		

	// set the icon
	imgGraphic.src=studioPath+"/images/ico"+wndArguments[2]+".gif";

	// set the message	
	lblPrompt.innerText=wndArguments[3];

	// show the print button?
	if (wndArguments[4])
		btnPrint.style.display="inline"

	// set the new dialog height/width
	var tblHeight=msgTable.clientHeight
	var tblWidth=msgTable.clientWidth

	var newHeight=((tblHeight+70) < 120 ? 120 : (tblHeight+70))+"px";
	window.dialogHeight=newHeight;
	var newWidth=tblWidth+50+"px";
	window.dialogWidth=newWidth;

	// set the new dialog top/left
	var oldTop=parseInt(window.dialogTop)
	var newTop=oldTop-((tblHeight-80)/2)-20
	window.dialogTop=newTop+"px";
	var oldLeft=parseInt(window.dialogLeft)
	var newLeft=oldLeft-((tblWidth-500)/2)+20
	window.dialogLeft=newLeft+"px";

	document.body.style.visibility="visible";
	btnYes.focus();
}

//-----------------------------------------------------------------------------
function msgOnKeyDown()
{
	var evtCaught=false;
	switch (event.keyCode)
	{
	case 27:		// escape
		window.close()
		evtCaught=true;
		break;
	}
	
	if (evtCaught)
	{
		event.cancelBubble=true
		event.returnValue=false
	}
	return (!evtCaught);
}

//-----------------------------------------------------------------------------
function onClick(btn)
{
	if (btn.value=="Print")
		window.print()
	else
		doReturn(btn.value.toLowerCase());
}

//-----------------------------------------------------------------------------
function doReturn(type)
{
	window.returnValue=type;
	window.close();
}

//-----------------------------------------------------------------------------
function window.onbeforeprint()
{
	// hide all buttons
	var inpColl=window.document.getElementsByTagName("INPUT")
	var len=inpColl ? inpColl.length : 0;
	for (var i = 0; i < len; i++)
	{
		inpColl[i].setAttribute("washidden","0")
		if (inpColl[i].style.display!="none")
		{
			inpColl[i].setAttribute("washidden","1")
			inpColl[i].style.display="none";
		}
	}
}

//-----------------------------------------------------------------------------
function window.onafterprint()
{
	// restore the buttons
	var inpColl=window.document.getElementsByTagName("INPUT")
	var len=inpColl ? inpColl.length : 0;
	for (var i = 0; i < len; i++)
	{
		if (inpColl[i].getAttribute("washidden") == "1")
			inpColl[i].style.display="inline";
	}
}
