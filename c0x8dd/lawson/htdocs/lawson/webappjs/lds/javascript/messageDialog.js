/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/lds/javascript/messageDialog.js,v 1.12.2.10.2.8 2014/04/14 21:10:31 brentd Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@10.00.05.00.27 Tue Aug 19 11:23:12 Central Daylight Time 2014 */
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
var styler = null;

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
		document.getElementById("lblTitleBar").innerHTML = window.dialogArguments[9];
	}
	
	path = "../";

	// translations
	dialogObj.translateButton("btnYes", "Yes", window);
	dialogObj.translateButton("btnNo", "No", window);
	dialogObj.translateButton("btnCancel", "Cancel", window);
	dialogObj.translateButton("btnPrint", "Print", window);

	// prime the return value
	window.returnValue = "cancel";

	// set the buttons
	var btnYes = document.getElementById("btnYes");
	var btnNo = document.getElementById("btnNo");
	var btnCancel = document.getElementById("btnCancel");
	
	switch (window.dialogArguments[1])
	{
		case "ok":
			dialogObj.translateButton(btnYes, "OK", window);
			btnYes.setAttribute("name", "ok");
			btnNo.style.display = "none";
			btnCancel.style.display = "none";
			window.returnValue = "ok";
			break;
		case "okcancel":
			dialogObj.translateButton(btnYes, "OK", window);
			btnYes.setAttribute("name", "ok");
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
			btnYes.setAttribute("name", "stop");
			dialogObj.translateButton(btnNo, "Continue", window);
			btnNo.setAttribute("name", "continue");
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
			imgGraphic.src = path + "images/32px-warning.png";
			break;
		case "question":
			imgGraphic.src = path + "images/32px-question.png";
			break;
		case "alert":
		case "info":
			imgGraphic.src = path + "images/32px-attention.png";
			break;
		case "none":
			imgGraphic.parentNode.style.display = "none";	
			break;			
	}

	// set the message	
	var lblPrompt = document.getElementById("lblPrompt");
	var lblSecondaryPrompt = document.getElementById("lblSecondaryPrompt");
	
	lblPrompt.innerHTML = window.dialogArguments[3];
	
	if (window.dialogArguments[5])
	{
		lblSecondaryPrompt.innerHTML = window.dialogArguments[5];	
	}
	
	// show the print button?
	var btnPrint = document.getElementById("btnPrint");
	
	if (window.dialogArguments[4])
	{
		btnPrint.style.display = "inline";
	}
	
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
	dialogObj.styleDialog(window);

	// get the new dialog height/width
	var msgTable = document.getElementById("msgTable");
	var btnTable = document.getElementById("btnTable");
	
	var tblHeight = msgTable.clientHeight;
	var tblWidth = msgTable.clientWidth;

	var oldHeight = 0;
	var oldWidth = 0;
	var oldTop = 0;
	var oldLeft = 0;

    if (window.dialogHeight)
    {
    	oldHeight = parseInt(window.dialogHeight, 10);
    	oldWidth = parseInt(window.dialogWidth, 10);
    	oldTop = parseInt(window.dialogTop, 10);
    	oldLeft = parseInt(window.dialogLeft, 10);
    }
    else if (window.innerHeight) 
    {
        // non-IE browsers
        oldHeight = window.innerHeight;
    	oldWidth = window.innerWidth;	
    } 
    else if (document.documentElement && document.documentElement.clientHeight)
    {
        // IE 6+ in "standards compliant mode"
        oldHeight = document.documentElement.clientHeight;
        oldWidth = document.documentElement.clientWidth;
    } 
    else if (document.body && document.body.clientHeight)
    {
        // IE 6 in "quirks mode"
        oldHeight = document.body.clientHeight;
        oldWidth = document.body.clientWidth;
    }
	
	var newHeight = ((tblHeight+100) < 120) ? 120 : (tblHeight+100);
	var newWidth = ((tblWidth+50) < 300) ? 300 : (tblWidth+50);
	if (dialogObj.minHeight && !isNaN(Number(dialogObj.minHeight)) && newHeight < dialogObj.minHeight)
		newHeight = dialogObj.minHeight;
	if (dialogObj.minWidth && !isNaN(Number(dialogObj.minWidth)))
	{
		if (newWidth < dialogObj.minWidth)
			newWidth = dialogObj.minWidth;
	}	
	else
		newWidth = (newWidth > 535) ? 535 : newWidth;

	if (dialogObj.browser.isFirefox && dialogObj.browser.isWIN)
		newHeight += 50;
	if (dialogObj.pinned)
		newHeight -= 50;	

	newHeight += btnTable.clientHeight;

	// must set button table width to 100% (to get
	// buttons centered) after determining which table is wider
	btnTable.style.width = "100%";

	// now set them all... order matters!
	if (window.dialogHeight)
	{
		// get the new dialog top/left	
		var newTop = (oldHeight/2) + oldTop - (newHeight/2);
		var newLeft = (oldWidth/2) + oldLeft - (newWidth/2);
	
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
					window.frameElement.style.width = parseInt(newWidth, 10) + "px";
					window.frameElement.style.height = (parseInt(newHeight, 10) + 40) + "px";
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

	window.onresize = dialogWindowOnResize;

	//wait 200 ms before resize because styling could take a while
	setTimeout(dialogWindowOnResize, 200);

	document.body.style.visibility = "visible";
	if (dialogObj.pinned)
		try { window.frameElement.style.visibility = "visible"; } catch(e) {}	
	//if the dialog closes before this is run, suppress the focus error
	try
	{
		btnYes.focus();
		switch (window.dialogArguments[7]) 
		{
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
	catch(e) {}
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
function msgOnKeyDown(evt)
{
	evt = (evt) ? evt : ((window.event) ? window.event : "");
	var evtCaught = false;
	switch (evt.keyCode)
	{
		// escape
		case 27:
			window.close();
			evtCaught = true;
			break;
	}

	// check for access keys... a-z
	if (evt.keyCode >= 65 && evt.keyCode <= 90)
	{
		var accessKey = String.fromCharCode(evt.keyCode).toLowerCase();
		var btn = accessKeyToBtn[accessKey];
		if (btn)
		{
			btn.click();
			evtCaught = true;
		}
	}

	if (evtCaught)
	{
		evt.cancelBubble = true;
		evt.returnValue = false;
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
window.onbeforeprint = function()
{
	// hide all buttons
	if (dialogObj.styler == null)
	{
		dialogObj.styler = new window.StylerBase();
		dialogObj.styler.showLDS = true;
		dialogObj.styler.showInfor = false;
		if (dialogObj.pinned && typeof(parent["SSORequest"]) != "undefined")
			dialogObj.styler.httpRequest = parent.SSORequest;
		else if (typeof(window["SSORequest"]) != "undefined")
			dialogObj.styler.httpRequest = window.SSORequest;	
	}

	var elms = dialogObj.styler.getLikeElements(window, "button", "", "");	
	var len = elms ? elms.length : 0;
	
	for (var i=0; i<len; i++)
	{
		elms[i].setAttribute("washidden", "0");
		if (elms[i].style.display != "none")
		{
			elms[i].setAttribute("washidden", "1");
			elms[i].style.display = "none";
		}
  }
}

//-----------------------------------------------------------------------------
window.onafterprint = function()
{
	// restore the buttons
	if (dialogObj.styler == null)
	{
		dialogObj.styler = new window.StylerBase();
		dialogObj.styler.showLDS = true;
		dialogObj.styler.showInfor = false;
		if (dialogObj.pinned && typeof(parent["SSORequest"]) != "undefined")
			dialogObj.styler.httpRequest = parent.SSORequest;
		else if (typeof(window["SSORequest"]) != "undefined")
			dialogObj.styler.httpRequest = window.SSORequest;	
	}
	
	var elms = dialogObj.styler.getLikeElements(window, "button", "", "");
	
	var len = elms ? elms.length : 0;
	for (var i=0; i<len; i++)
	{
		if (elms[i].getAttribute("washidden") == "1")
		{
			elms[i].style.display = "inline";
			elms[i].setAttribute("washidden", "0");
		}
  }
}

function dialogWindowOnResize()
{
	var btnPanel = document.getElementById("btnPanel");
	var windowHeight = 0;
	
	if (window.innerHeight)
	{
		windowHeight = window.innerHeight;
	}
	else if (document.documentElement && document.documentElement.clientHeight)
	{
		windowHeight = document.documentElement.clientHeight;
	}
	else
	{
		windowHeight = document.body.clientHeight;
	}
	
	var msgTable = document.getElementById("msgTable");
	var top = 0;
	
	if (dialogObj.browser.isIE || dialogObj.browser.isSafari)
	{
		btnPanel.style.position = "absolute";
		top = windowHeight - btnPanel.clientHeight - 25;
	}
	else
	{
		btnPanel.style.position = "fixed";
		btnPanel.style.paddingBottom = "10px";
		if ((windowHeight - btnPanel.clientHeight) > (msgTable.clientHeight + msgTable.offsetTop))
		{
			top = windowHeight - btnPanel.clientHeight;
		}
		else
		{
			top = msgTable.clientHeight + msgTable.offsetTop;
		}
	}
	btnPanel.style.top = top + "px";
	btnPanel.style.left = "0px";	
}