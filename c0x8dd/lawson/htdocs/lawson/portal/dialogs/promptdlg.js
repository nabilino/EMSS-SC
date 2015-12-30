/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/dialogs/promptdlg.js,v 1.2.2.1.18.1.2.2 2012/08/08 12:37:24 jomeli Exp $NoKeywords: $ */
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

// dynamic window title
window.document.title=wndArguments ? wndArguments[1] : window.document.title;

function phInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	txtPhrase.value = wndArguments[0];
	lblPrompt.innerText=wndArguments[2]+":";

	document.body.style.visibility="visible";
	document.body.style.cursor="auto";
	txtPhrase.focus()
	txtPhrase.select()
}

//-----------------------------------------------------------------------------
function phOnKeyDown()
{
	var bEvtCaught=false;
	var mElement;
	switch(event.keyCode)
	{
		case 27:				// escape
			bEvtCaught=true
			window.close()
			break;
		case 13:				// Enter
			if (event.srcElement.id == "txtPhrase")
			{
				bEvtCaught=true
				btnOK.click()
			}
			break;
	}
	if (bEvtCaught)
	{
		event.cancelBubble=true
		event.returnValue=false
	}
	return (!bEvtCaught)
}

//-----------------------------------------------------------------------------
function phOnOK()
{
	window.returnValue = txtPhrase.value;
	window.close();
}

