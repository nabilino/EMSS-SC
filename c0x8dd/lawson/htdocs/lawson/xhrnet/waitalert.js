// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/waitalert.js,v 1.10.2.18 2014/02/13 22:48:37 brentd Exp $
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
// This function displays a processing message in a frame or window.
// Arguments:   A message to display, an optional callback function 
function showWaitAlert(msg, callback)
{	
	if (!msg)
		msg = "Please wait...";
	var wnd = window;
	var docObj = wnd.document;	
	callback = callback || null;
	removeWaitAlert();
	if (wnd.styler && (wnd.styler.showLDS || wnd.styler.showInfor || wnd.styler.showInfor3))
	{
		var dlgWnd = wnd;
		if (wnd.activityDialog == null)
		{
			if (typeof(wnd["ActivityDialogObject"]) != "function" && typeof(wnd["findObjWnd"]) == "function")
			{		
				dlgWnd = wnd.findObjWnd("ActivityDialogObject", false);
				if (!dlgWnd) dlgWnd = wnd;
			}
			if (typeof(dlgWnd["ActivityDialogObject"]) == "function")
				wnd.activityDialog = new dlgWnd.ActivityDialogObject(wnd, null, true, "/lawson/webappjs/", wnd.styler);
		}
		if (wnd.activityDialog)
			wnd.activityDialog.showDialog(msg, callback);
		else if (callback)	
			setTimeout(function(){callback.call();}, 50);	
	}
	else
	{
		try 
		{    	
			var cssDocs = docObj.getElementsByTagName("LINK");
			var foundCss = false;
			for (var i=0; i<cssDocs.length; i++) 
			{
				if (cssDocs[i].href == "/lawson/xhrnet/ui/ui.css") 
				{
					foundCss = true;
					cssDocs[i].disabled = false;
					break;
				}
			}
			if (foundCss == false) 
			{
				var cssElm = docObj.createElement("LINK");
				cssElm.rel = "stylesheet";
				cssElm.type = "text/css";
				cssElm.href = "/lawson/xhrnet/ui/ui.css";
				docObj.body.appendChild(cssElm);
			}
			if (docObj.getElementById("progressLayer")) 
			{
				var processingObj = docObj.getElementById("progressLayer");
				var parentObj = processingObj.parentNode;
				parentObj.removeChild(processingObj);
			}
			docObj.body.appendChild(processingLayer(msg));
		}
		catch(e) {}
		if (callback)
			setTimeout(function(){callback.call();}, 50);		
	}	
}

// This function removes the processing message from the display.
function removeWaitAlert(msg)
{
	var wnd = window; 
	var docObj = wnd.document;
	if (wnd.styler && (wnd.styler.showLDS || wnd.styler.showInfor || wnd.styler.showInfor3))
	{
		if (wnd.activityDialog)
			wnd.activityDialog.hideDialog(msg);
	}
	else
	{
		try 
		{
			docObj.getElementById("progressMsg").style.visibility = "hidden";
			docObj.getElementById("progressBar").style.visibility = "hidden";
			docObj.getElementById("progressLayer").style.visibility = "hidden";
		}
		catch(e) {}
	}
}

function processingLayer(msg)
{
	// main processing DIV tag
	var oProcess = document.createElement("DIV");
	oProcess.id = "progressLayer";
	oProcess.style.backgroundColor = "#ffffff";
	if (!document.all) 
	{
		oProcess.style.paddingLeft = "3px";
		oProcess.style.paddingTop = "3px"
	}
	oProcess.style.position = "absolute";
	oProcess.style.height = "30px";
	try 
	{
		if (typeof(window.innerWidth) == "number")
			oProcess.style.left = parseInt(window.innerWidth*.35,10)+"px";
		else if (document.documentElement && document.documentElement.clientWidth)
			oProcess.style.left = parseInt(document.documentElement.clientWidth*.35,10)+"px";	
		else if (document.body && document.body.clientWidth)
			oProcess.style.left = parseInt(document.body.clientWidth*.35,10)+"px";
		else
			oProcess.style.left = "300px";
	}
	catch(e) 
	{
		oProcess.style.left = "300px";
	}	
	oProcess.style.top = "0px";
	oProcess.style.zIndex = "100";
	oProcess.style.visibility = "visible";
	// TABLE tag to house the processing message and image	
	var oTbl = document.createElement("TABLE");
	oTbl.setAttribute("border","0");
	oTbl.setAttribute("cellspacing","0");
	oTbl.setAttribute("cellpadding","0");
	var oRow = oTbl.insertRow(0);	
	var cell0 = oRow.insertCell(0);
	cell0.setAttribute("valign","top");
	// message DIV tag	
	var oTmp = document.createElement("NOBR");
	var oMsg = document.createElement("DIV");
	oMsg.id = "progressMsg";
	oMsg.className = "progressmsg";
	oMsg.style.paddingLeft = "0px";
	oMsg.style.visibility = "visible";
	var oChild = document.createTextNode(msg);
	oMsg.appendChild(oChild);
	oTmp.appendChild(oMsg);
	// barber pole image DIV tag 	
	var oBar = document.createElement("DIV");
	oBar.id = "progressBar";
	oBar.className = "progressbar";
	oBar.style.marginLeft = "0px";
	oBar.style.height = "14px";
	oBar.style.overflow = "hidden";
	oBar.style.visibility = "visible";
	cell0.appendChild(oTmp);
	cell0.appendChild(oBar);
	oProcess.appendChild(oTbl);
	return oProcess;
}
