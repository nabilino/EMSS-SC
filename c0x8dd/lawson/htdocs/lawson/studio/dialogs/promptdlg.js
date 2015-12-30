/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/dialogs/promptdlg.js,v 1.2.2.1.4.2.16.2 2012/08/08 12:48:48 jomeli Exp $NoKeywords: $ */
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
window.document.title=wndArguments ? wndArguments[2] + " Entry" : window.document.title;
var studioWnd=null;

function phInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	studioWnd = wndArguments[0];
	txtPhrase.value = wndArguments[1];
	lblPrompt.innerText="Please enter "+wndArguments[2]+":";
	var maxLen = wndArguments[3];
	if (maxLen && maxLen.length > 0)
		txtPhrase.maxLength = maxLen;

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
		case studioWnd.keys.ESCAPE:
			bEvtCaught=true
			window.close()
			break;
		case studioWnd.keys.ENTER:
			if (event.srcElement.id == "txtPhrase")
			{
				bEvtCaught=true
				btnOK.click()
			}
			break;
		case studioWnd.keys.QUOTE:
			if( !event.altKey && !event.ctrlKey && event.shiftKey )	// double quote
			{
				if (event.srcElement.id == "txtPhrase")
					bEvtCaught=true
			}
			break;			
	}
	if (bEvtCaught)
		studioWnd.setEventCancel(event)
	return (!bEvtCaught)
}

//-----------------------------------------------------------------------------
function phOnOK()
{
	window.returnValue = txtPhrase.value;
	window.close();
}

