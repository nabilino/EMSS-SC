/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/dialogs/keyhandlers.js,v 1.1.34.2 2012/08/08 12:48:49 jomeli Exp $ */
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


//-----------------------------------------------------------------------------
// handle number key validation; navigation type keys go to keydown event
// (only printables and ESC, spacebar and enter fire this event)
function khdlNbrKeyPress()
{
	// only digits allowed
	if ((event.keyCode<48)||(event.keyCode>57))
	{
		event.cancelBubble=true
		event.returnValue=false
		return true
	}
	return false
}

//-----------------------------------------------------------------------------
// handle hex number key validation; navigation type keys go to keydown event
// (only printables and ESC, spacebar and enter fire this event)
function khdlHexKeyPress()
{
	// only hex digits allowed
	if ((event.keyCode>47)&&(event.keyCode<58)) return false	// 0-9
	if ((event.keyCode>64)&&(event.keyCode<71)) return false	// A-F
	if (event.keyCode==35) return false							// # char

	event.cancelBubble=true
	event.returnValue=false
	return true
}

//-----------------------------------------------------------------------------
// handle dialog btnOK and btnCancel keys (call from keypress event):
// enter fires btnOK; ESC fires btnCancel
function khdlOKCancel(evt)
{
	if (evt.keyCode==13)		// enter
	{
		if (document.activeElement.id == "btnCancel") return false
		if (document.activeElement.id != "btnOK"
		&& document.activeElement.id.substr(0,3) == "btn")
			return false
		document.all.btnOK.click()
		return true
	}
	else if (evt.keyCode==27)	// ESC
	{
		document.all.btnCancel.click()
		return true
	}
	return false
}
