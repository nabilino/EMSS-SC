/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/messageDialogError.js,v 1.5.2.3.2.3 2014/01/10 14:29:59 brentd Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@10.00.05.00.12 Mon Mar 31 10:17:31 Central Daylight Time 2014 */
//***************************************************************
//*                                                             *
//*                           NOTICE                            *
//*                                                             *
//*   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
//*   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
//*   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
//*   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
//*   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
//*   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
//*   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
//*                                                             *
//*   (c) COPYRIGHT 2014 INFOR.  ALL RIGHTS RESERVED.           *
//*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//*                                                             *
//***************************************************************

var path = "";
var dialogObj = null;
var bDetails = false;
var accessKeyToBtn = new Array();

//-----------------------------------------------------------------------------
function initMsgDlg()
{
	dialogObj = window.dialogArguments[0];
	path = dialogObj.webappjsDir;

	// translations
	dialogObj.translateButton("btnOK", "OK", window);
	dialogObj.translateButton("btnDetails", "ShowDetails", window);
	dialogObj.translateButton("btnPrint", "Print", window);

	var errorDom = window.dialogArguments[1];
	imgGraphic.src = path + "images/ico_" + window.dialogArguments[2] + ".gif";

	// set the message	
	var strArg = "" + window.dialogArguments[3];
	lblPrompt.innerText = (strArg.length > 256)
						? strArg.substr(0,256) + "\n\n"
						: strArg;

	// set the access keys for the buttons
	setAccessKey("btnOK");
	setAccessKey("btnDetails");
	setAccessKey("btnPrint");

	// set the details top position and text
	detailsDiv.style.top = msgTable.offsetHeight + 10;
	var msg = "";
	var dtlNode = errorDom.getElementsByTagName("DETAILS");
	dtlNode = (dtlNode && dtlNode.length > 0) ? dtlNode[0] : null;
	if (dtlNode && dtlNode.firstChild)
		msg += dtlNode.firstChild.nodeValue;
	if (!msg && strArg.length > 256)
		msg = strArg;
	else if (!msg)
	{
		var btnDetails = document.getElementById("btnDetails");
		btnDetails.style.visibility = "hidden";
		btnDetails.style.display = "none";
	}
	msg += "\n\n";
	txtDetails.innerText = msg;

	// set the top position once
	window.dialogTop = "300px";
	window.dialogWidth = "550px";

	var tblWidth = (msgTable.clientWidth > detailsDiv.clientWidth)
				 ? msgTable.clientWidth
				 : detailsDiv.clientWidth;

	// must set button table width to 100% (to get
	// buttons centered) after determining which table is wider
	btnTable.style.width = "100%";

	// set the new dialog top/left
	var newLeft = ((screen.availWidth-(tblWidth+20))/2)+10;
	window.dialogLeft = newLeft + "px";

	msgSetDlgHeight();

	document.body.style.visibility = "visible";
	btnOK.focus();
}

//-----------------------------------------------------------------------------
function setAccessKey(btnName)
{
	var btn = document.getElementById(btnName);
	if (btn.style.display != "none")
	{
		var value = btn.value;
		for (var i=0; i<value.length; i++)
		{
			var key = value.substring(i,i+1).toLowerCase();
			if (!accessKeyToBtn[key] && key >= "a" && key <= "z")
			{
				accessKeyToBtn[key] = btn;
				btn.accessKey = key;
				btn.value = value.substring(0,i) + "<u>" + value.substring(i,i+1) + "</u>" + value.substring(i+1);
				break;
			}
		}
	}
}

//-----------------------------------------------------------------------------
function msgSetDlgHeight()
{
	// set the new dialog height/width
	var tblHeight = msgTable.clientHeight;

	detailsDiv.style.display = (bDetails) ? "block" : "none";
	if (bDetails)
		tblHeight = msgTable.clientHeight + detailsDiv.clientHeight;

	var newHeight = ((tblHeight+100) < 120 ? 120 : (tblHeight+100))+"px";
	window.dialogHeight = newHeight;
}

//-----------------------------------------------------------------------------
function msgOnKeyDown()
{
	var evtCaught = false;
	switch (event.keyCode)
	{
		// escape
		case 27:
			window.close();
			evtCaught = true;
			break;
	}

	// check for access keys... a-z
	if (event.keyCode >= 65 && event.keyCode <= 90)
	{
		var accessKey = String.fromCharCode(event.keyCode).toLowerCase();
		var btn = accessKeyToBtn[accessKey];
		if (btn)
		{
			btn.click();
			evtCaught = true;
		}
	}

	if (evtCaught)
	{
		event.cancelBubble = true;
		event.returnValue = false;
	}

	return !evtCaught;
}

//-----------------------------------------------------------------------------
function onClick(btn)
{
	switch (btn.name)
	{
		case "print":
			window.print();
			break;
		case "showdetails":
			bDetails = true;
			dialogObj.translateButton(btn, "HideDetails", window);
			btn.name = "hidedetails";
			msgSetDlgHeight();
			break;
		case "hidedetails":
			bDetails = false;
			dialogObj.translateButton(btn, "ShowDetails", window);
			btn.name = "showdetails";
			msgSetDlgHeight();
			break;
		default:
			window.close();
			break;
	}
}

//-----------------------------------------------------------------------------
window.onbeforeprint = function()
{
	// hide all buttons
	var inpColl = window.document.getElementsByTagName("INPUT")
	var len = inpColl ? inpColl.length : 0;
	for (var i=0; i<len; i++)
	{
		inpColl[i].setAttribute("washidden", "0");
		if (inpColl[i].style.display != "none")
		{
			inpColl[i].setAttribute("washidden", "1");
			inpColl[i].style.display = "none";
		}
	}

	// reset textarea size
	detailsDiv.style.height = "820px";
	txtDetails.style.height = "800px";
}

//-----------------------------------------------------------------------------
window.onafterprint = function()
{
	// restore the buttons
	var inpColl = window.document.getElementsByTagName("INPUT")
	var len=inpColl ? inpColl.length : 0;
	for (var i=0; i<len; i++)
	{
		if (inpColl[i].getAttribute("washidden") == "1")
			inpColl[i].style.display = "inline";
	}

	// reset textarea size
	detailsDiv.style.height = "320px";
	txtDetails.style.height = "300px";
}
