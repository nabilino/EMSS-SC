/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/wzdesigner/dialogs/history.js,v 1.3.28.2 2012/08/08 12:48:52 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// datafld.js
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
var myDoc=null;

//-----------------------------------------------------------------------------
function hInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	studioWnd = wndArguments[0];
	myDoc = wndArguments[1];

	hRefresh();

	document.body.style.visibility="visible";
	btnOK.focus();
}

//-----------------------------------------------------------------------------
function hRefresh()
{
	// clear the list
	var len = selHistory.length;
	for (var i=len-1; i > -1; i--)
		selHistory.removeChild(selHistory.children(i))

	var arr=myDoc.commandHistory.commands.items();
	len=(arr?arr.length:0);
	for (var i=0; i < len; i++ )
	{
		var wzCommand = arr[i].item(arr[i].hash[0]);
		if (wzCommand)
		{
			var oOption = document.createElement("option");
			var title = wzCommand.getTitle?wzCommand.getTitle():"";
			var initiator = wzCommand.initiator?wzCommand.initiator:"";
			var type = wzCommand.type?wzCommand.type:"";
			var date = wzCommand.date?wzCommand.date:"";
			var nm=padSpaces(i,2) + "   " + padSpaces(initiator,5) + "   " + padSpaces(type,10) + "   " + padSpaces(date,20) + "   " + title;
			var value=i;
			oOption.text=nm;
			oOption.value=value;
			selHistory.add(oOption);
		}
	}
	return;
}

//-----------------------------------------------------------------------------
function hCancel()
{
	// user pressed cancel button
	window.close();
}

//-----------------------------------------------------------------------------
function hOK()
{
	// user pressed ok button
	var i=selHistory.selectedIndex;
	if (i == -1) return;
	
	window.returnValue=selHistory.options[i].value;
	window.close();
}

//-----------------------------------------------------------------------------
function hOnBodyKeyPress()
{
	var evtCaught=false;
	if (event.keyCode == 27)
	{
		hCancel();
		return;
	}
	else if (event.srcElement == selHistory)
	{
		if ( event.keyCode == 13 || event.keyCode == 32 )
		{
			evtCaught=true;
			if ( event.keyCode == 13 )
				hOK();
		}
	}
	if (evtCaught)
	{
		event.cancelBubble=true;
		event.returnValue=false;
	}
	return (!evtCaught);
}

//-----------------------------------------------------------------------------
function padSpaces(s,n)
{
	var ret=s+""
	while (ret.length<n)
		ret+=" "
	return ret
}
