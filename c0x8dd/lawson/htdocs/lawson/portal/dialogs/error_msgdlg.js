/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/dialogs/Attic/error_msgdlg.js,v 1.1.2.6.14.1.2.2 2012/08/08 12:37:24 jomeli Exp $ */
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

var portalPath="";
var bDetails=false;

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
	portalPath=wndArguments[0];

	// the data storage object
	var ds=wndArguments[1];

	// set the icon
	imgGraphic.src=portalPath+"/images/ico"+wndArguments[2]+".gif";

	// set the message	
	var strArg=""+wndArguments[3];
	lblPrompt.innerText=(strArg.length > 256 
		? strArg.substr(0,256)+"\n\n" : strArg);

	// set the details top position and text
	detailsDiv.style.top=msgTable.offsetHeight+10;
	var msg="";
	var dtlNode=ds.getElementsByTagName("DETAILS");
	dtlNode=(dtlNode && dtlNode.length > 0 ? dtlNode[0] : null);
	if (dtlNode && dtlNode.firstChild)
		msg+=dtlNode.firstChild.nodeValue;
	if (!msg && strArg.length > 256)
		msg=strArg;
	else if (!msg)
	{
		var btnDetails = document.getElementById("btnDetails");
		btnDetails.style.visibility = "hidden";
		btnDetails.style.display = "none";
	}
	msg+="\n\n";
	txtDetails.innerText=msg;

	// set the top position once
	window.dialogTop="300px";
	window.dialogWidth="550px";

	var tblWidth=(msgTable.clientWidth > detailsDiv.clientWidth
				? msgTable.clientWidth : detailsDiv.clientWidth);

	// must set button table width to 100% (to get
	// buttons centered) after determining which table is wider
	btnTable.style.width="100%";

	// set the new dialog top/left
	var newLeft=((screen.availWidth-(tblWidth+20))/2)+10;
	window.dialogLeft=newLeft+"px";

	msgSetDlgHeight();

	document.body.style.visibility="visible";
	btnOK.focus();
}

//-----------------------------------------------------------------------------
function msgSetDlgHeight()
{
	// set the new dialog height/width
	var tblHeight=msgTable.clientHeight;

	detailsDiv.style.display=(bDetails ? "block" : "none");
	if (bDetails)
		tblHeight=msgTable.clientHeight+detailsDiv.clientHeight;	

	var newHeight=((tblHeight+70) < 120 ? 120 : (tblHeight+70))+"px";
	window.dialogHeight=newHeight;
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
	switch (btn.value)
	{
	case "Print":
		window.print();
		break;
	case "Show Details":
		bDetails=true;
		btn.value="Hide Details";
		msgSetDlgHeight();
		break;
	case "Hide Details":
		bDetails=false;
		btn.value="Show Details";
		msgSetDlgHeight();
		break;
	default:
		window.close();
		break;
	}
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

	// reset textarea size
	detailsDiv.style.height="820px";
	txtDetails.style.height="800px";
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

	// reset textarea size
	detailsDiv.style.height="320px";
	txtDetails.style.height="300px";
}
