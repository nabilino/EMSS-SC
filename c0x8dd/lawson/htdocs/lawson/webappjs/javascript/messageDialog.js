/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/messageDialog.js,v 1.8.2.4.2.6 2014/01/10 14:29:59 brentd Exp $ */
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
var accessKeyToBtn = new Array();

//-----------------------------------------------------------------------------
function initMsgDlg()
{
	if (!window.dialogArguments)
	{
		if (opener && opener.DialogObject)
		{
			window.dialogArguments = opener.DialogObject._arguments;
			dialogObj = opener.DialogObject._arguments[0];
		}
		else if (parent && parent.DialogObject)
		{
			window.dialogArguments = parent.DialogObject._arguments;
			dialogObj = parent.DialogObject._arguments[0];		
		}
	}
	else
	{
		dialogObj = window.dialogArguments[0];
	}
	
	if (window.dialogArguments && window.dialogArguments[9])
	{	
		document.title = window.dialogArguments[9];
		if (dialogObj.pinned)
		{	
			var lblTitleBar = document.getElementById("lblTitleBar"); 
			lblTitleBar.innerHTML = window.dialogArguments[9];
			lblTitleBar.style.display = "block";
		}	
	}
	
	path = dialogObj.webappjsDir;

	// translations
	dialogObj.translateButton("btnYes", "Yes", window);
	dialogObj.translateButton("btnNo", "No", window);
	dialogObj.translateButton("btnCancel", "Cancel", window);
	dialogObj.translateButton("btnPrint", "Print", window);

	// prime the return value
	window.returnValue = "cancel";

	// set the buttons	
	switch (window.dialogArguments[1])
	{
		case "ok":
			dialogObj.translateButton(btnYes, "OK", window);
			btnYes.name = "ok";
			btnNo.style.display = "none";
			btnCancel.style.display = "none";
			window.returnValue = "ok";
			break;
		case "okcancel":
			dialogObj.translateButton(btnYes, "OK", window);
			btnYes.name = "ok";
			btnNo.style.display = "none";
			break;
		case "yesno":
			btnCancel.style.display = "none";
			window.returnValue = "no";
			break;
		case "yesnocancel":
			// this is default
			break;
		case "stopcontinue":
			dialogObj.translateButton(btnYes, "Stop", window);
			btnYes.name = "stop";
			dialogObj.translateButton(btnNo, "Continue", window);
			btnNo.name = "continue";
			btnCancel.style.display = "none";
			window.returnValue = "stop";
			break;
		case "cancelcontinue":
			dialogObj.translateButton(btnYes, "Cancel", window);
			btnYes.name = "cancel";
			dialogObj.translateButton(btnNo, "Continue", window);
			btnNo.name = "continue";
			btnCancel.style.display = "none";
			window.returnValue = "cancel";
			break;
	}		

	// set the icon
	var imgGraphic = document.getElementById("imgGraphic");
	var icon = window.dialogArguments[2];
	
	switch(icon)
	{
		case "stop":
		case "question":
		case "alert":
		case "info":
			imgGraphic.src = path + "images/ico_" + window.dialogArguments[2] + ".gif";
			break;
		case "none":
			imgGraphic.parentNode.style.display = "none";	
			break;			
	}

	// Replace all occurances of  '/n' with '<br>' 
	window.dialogArguments[3] = unescape(window.dialogArguments[3]).replace(/\n/g,"<br/>");

	// set the message	
	lblPrompt.innerHTML = window.dialogArguments[3];

	// show the print button?
	if (window.dialogArguments[4])
		btnPrint.style.display = "inline";

	// set the access keys for the buttons
	setAccessKey("btnYes");
	setAccessKey("btnNo");
	setAccessKey("btnCancel");
	setAccessKey("btnPrint");
	
	dialogObj.closeDialog = function()
	{
		try { doReturn("close"); } catch(e) {}
	};	
	dialogObj.initDialog(window);
	
	// get the new dialog height/width
	var tblHeight = msgTable.clientHeight;
	var tblWidth = msgTable.clientWidth;

	var oldHeight = parseInt(window.dialogHeight, 10);
	var newHeight = ((tblHeight+100) < 120 ? 120 : (tblHeight+100));
	var oldWidth = parseInt(window.dialogWidth, 10);
	var newWidth = (tblWidth+50 < 300 ? 300 : tblWidth+50);
	newWidth = (btnTable.clientWidth+50 > newWidth ? btnTable.clientWidth+50 : newWidth);

	// must set button table width to 100% (to get
	// buttons centered) after determining which table is wider
	btnTable.style.width = "100%";

	if (window.dialogHeight)
	{	
		// get the new dialog top/left
		var oldTop = parseInt(window.dialogTop);
		var newTop = (oldHeight/2) + oldTop - (newHeight/2);
		var oldLeft = parseInt(window.dialogLeft);
		var newLeft = (oldWidth/2) + oldLeft - (newWidth/2);
	
		// now set them all... order matters!
		window.dialogLeft = newLeft + "px";
		window.dialogWidth = newWidth + "px";
		window.dialogTop = newTop + "px";
		window.dialogHeight = newHeight + "px";
	}
	else
	{
		var windowWidth = 0;
		var windowHeight = 0;
		if (parent.innerWidth) 
		{
			// non-IE browsers
			windowWidth = parent.innerWidth;
			windowHeight = parent.innerHeight;
		} 
		else if (parent.document.documentElement && parent.document.documentElement.clientWidth)
		{
			// IE 6+ in "standards compliant mode"
			windowWidth = parent.document.documentElement.clientWidth;
			windowHeight = parent.document.documentElement.clientHeight;
		} 
		else if (parent.document.body && parent.document.body.clientWidth)
		{
			// IE 6 in "quirks mode"
			windowWidth = parent.document.body.clientWidth;
			windowHeight = parent.document.body.clientHeight;
		}
		
		// center the new dialog in the window	
		var newTop = (windowHeight - newHeight)/4;
		var newLeft = (windowWidth - newWidth)/2;		
		
		if (dialogObj.pinned)
		{
			try
			{
				if (window.frameElement)
				{		
					newHeight += 40;						
					window.frameElement.style.width = parseInt(newWidth, 10) + "px";
					window.frameElement.style.height = parseInt(newHeight, 10) + "px";	
					window.frameElement.style.left = parseInt(newLeft, 10) + "px";
					window.frameElement.style.top = parseInt(newTop, 10) + "px";

					if (dialogObj.allowPopups)
					{
						var leftPos = window.frameElement.offsetLeft;
						var widthIsOK = (newWidth + leftPos) <= windowWidth;
	
						if (!widthIsOK)
						{	
							leftPos = window.frameElement.offsetLeft;
							if (leftPos > parseInt(windowWidth*.15, 10))
								leftPos = parseInt(windowWidth*.15, 10);						
							if (newWidth >= windowWidth)
								leftPos = 0;
							else if ((windowWidth - newWidth) < parseInt(windowWidth*.30, 10))
								leftPos = parseInt((Math.abs(windowWidth - newWidth))/2, 10);
							if (leftPos != window.frameElement.offsetLeft)
								window.frameElement.style.left = leftPos + "px";
							widthIsOK = (newWidth + leftPos) <= windowWidth;
						}
						
						var topPos = window.frameElement.offsetTop;
						var heightIsOK = (newHeight + topPos) <= windowHeight;	
						
						if (!heightIsOK)
						{	
							if (topPos > parseInt(windowHeight*.15, 10))
								topPos = parseInt(windowHeight*.15, 10)					
							if (newHeight >= windowHeight)
								topPos = 0;
							else if ((windowHeight - newHeight) < parseInt(windowHeight*.30, 10))
								topPos = parseInt((Math.abs(windowHeight - newHeight))/2, 10);
							if (topPos != window.frameElement.offsetTop)
								window.frameElement.style.top = topPos + "px";					
							heightIsOK = (newHeight + topPos) <= windowHeight;
						}				
						
						//launch in a new window if not enough space
						if (dialogObj && (!widthIsOK || !heightIsOK))
						{
							window.frameElement.style.visibility = "hidden";
							dialogObj.pinned = false;
							//force IE to fire the callback func if this is a confirm dialog
							var icon = (dialogObj.browser.isIE && window.dialogArguments[2] == "question") ? "alert" : window.dialogArguments[2];
							dialogObj.messageBox(window.dialogArguments[3], window.dialogArguments[1], icon, parent, 
									window.dialogArguments[4], window.dialogArguments[5], window.dialogArguments[6], window.dialogArguments[7]);	
							return;
						}
					}
					
					var msgBg = document.getElementById("msgBg");
					msgBg.style.left = "24px";
					msgBg.style.top = "54px";
					msgBg.style.width = (parseInt(newWidth, 10) - 48) + "px";
					msgBg.style.height = (parseInt(newHeight, 10) - 108) + "px";
					msgBg.style.display = "block";
				}	
			}
			catch(e) {}
		}
		else
		{
			window.resizeTo(parseInt(newWidth, 10), parseInt(newHeight, 10) + 40);
			window.moveTo(parseInt(newLeft, 10), parseInt(newTop, 10));		
		}		
	}
	
	document.body.style.visibility = "visible";
	btnYes.focus();
	
	switch (window.dialogArguments[7]) {
		case "stop":
			btnYes.focus();
			break;
		case "continue":
			btnNo.focus();
			break;
		case "yes":
			btnYes.focus();
			break;
		case "no":
			btnNo.focus();
			break;
		case "ok":
			btnYes.focus();
			break;
		case "cancel":
			btnCancel.focus();
			break;
		case "print":
			btnPrint.focus();
			break;
	}
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
	if (btn.getAttribute("name") == "print")
	{
		dialogObj.hideCover();
		window.print();
	}
	else if (btn.getAttribute("name") == "close")
	{
		window.returnValue = "close";
		if (window.frameElement)
		{
			var retVal = fireCloseFunc();
			if (typeof(retVal) == "undefined" || retVal != false)
			{
				dialogObj.hideCover();			
				window.frameElement.style.visibility = "hidden";
			}	
		}	
		else
		{
			onUnload();
		}
	}
	else
	{
		doReturn(btn.getAttribute("name"));
	}
}

//-----------------------------------------------------------------------------
function fireCloseFunc()
{
	if (window.dialogArguments && window.dialogArguments[6] && typeof(window.dialogArguments[6].apply) != "undefined")
	{
		return window.dialogArguments[6].apply(this, new Array(window));
	}
}

//-----------------------------------------------------------------------------
function onUnload()
{
	if (!window.frameElement)
	{
		dialogObj.hideCover();
		fireCloseFunc();
	}
}

//-----------------------------------------------------------------------------
function doReturn(type)
{
	window.returnValue = type;
	if (window.frameElement)
	{
		dialogObj.doReturn(window);
		var retVal = fireCloseFunc();
		if (typeof(retVal) == "undefined" || retVal != false)
		{
			dialogObj.hideCover();
			window.frameElement.style.visibility = "hidden";
		}
	}	
	else
	{
		dialogObj.hideCover();
		dialogObj.doReturn(window);
		window.close();
	}
}

//-----------------------------------------------------------------------------
function onbeforeprint()
{
	// hide all buttons
	var inpColl = window.document.getElementsByTagName("INPUT");
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
}

//-----------------------------------------------------------------------------
function onafterprint()
{
	// restore the buttons
	var inpColl = window.document.getElementsByTagName("INPUT");
	var len = inpColl ? inpColl.length : 0;
	for (var i=0; i<len; i++)
	{
		if (inpColl[i].getAttribute("washidden") == "1")
			inpColl[i].style.display = "inline";
	}
}
