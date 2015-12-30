/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/dialogs/multisavedlg.js,v 1.2.28.2 2012/08/08 12:48:47 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// multisavedlg.js
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

var arrFiles=null;
var parentWnd=null;

function initSaveDlg()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	parentWnd=wndArguments[0];
	arrFiles=wndArguments[1];
	
	window.returnValue=null;	// prime return value for 'save none'

	loadSaveCheckList();
	doSelectAll();				// select all files initially
	
	document.body.style.display="inline";
	btnSave.focus();
}

//-----------------------------------------------------------------------------
function loadSaveCheckList()
{
	if (!arrFiles) return;

	var selFiles=document.getElementById("selFiles")
	for (var i = 0; i < arrFiles.length; i++)
	{
		var oOption = document.createElement("option")
		oOption.text = arrFiles[i].title;
		oOption.value = arrFiles[i].name;
		selFiles.add(oOption)
	}
}

//-----------------------------------------------------------------------------
function doInvert()
{
	var len=selFiles.options.length
	for (var i = 0; i < len; i++)
		selFiles.options[i].selected=!selFiles.options[i].selected;
}

//-----------------------------------------------------------------------------
function doSelectAll()
{
	var len=selFiles.options.length
	for (var i = 0; i < len; i++)
		selFiles.options[i].selected=true;
}

//-----------------------------------------------------------------------------
function doSave()
{
	arrFiles=new Array()
	var len=selFiles.options.length
	for (var i = 0; i < len; i++)
	{
		var j=arrFiles.length;
		if (selFiles.options[i].selected)
		{
			arrFiles[j]=selFiles.options[i].value
		}
	}
	window.returnValue=arrFiles;
	window.close();
}

//-----------------------------------------------------------------------------
function doNone()
{
	window.close();
}

//-----------------------------------------------------------------------------
function handleKeyDown(evt)
{
	if (!evt)
		evt=window.event;
	var b=false;
	switch (evt.keyCode)
	{
	case parentWnd.keys.ESCAPE:
		doNone();
		b=true;
		break;
	}
	
	if (b)
	{
		evt.cancelBubble=true
		evt.returnValue=false
	}
	return (!b);
}
