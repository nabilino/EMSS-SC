/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/objects/Dialog.js,v 1.21.2.14.2.35 2014/02/18 16:42:33 brentd Exp $ */
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
//
//	DEPENDENCIES:
//		commonHTTP.js
//-----------------------------------------------------------------------------
//
//	PARAMETERS:
//		webappjsDir				(optional) the location of the webappjs code 
//								(i.e. /lawson/webappjs/ is the default)
//		traceObj				(optional) a reference to your trace object
//-----------------------------------------------------------------------------
function DialogObject(webappjsDir, traceObj, styler, showOpaqueCover)
{
	this.browser = new SEABrowser();
	this.webappjsDir = (webappjsDir) ? webappjsDir : "/lawson/webappjs/";
	if (this.webappjsDir.substring(this.webappjsDir.length-1) != "/")
		this.webappjsDir += "/";
	this.traceObj = (traceObj) ? traceObj : null;
	this.translationFunc = null;
	this.styler = styler;
	// Only default to pinned for Theme 9. Theme 8 does not work in pinned mode.
	if (this.styler && this.styler.showLDS)
		this.pinned = true;
	else
		this.pinned = false;
	this.minHeight = null;
	this.minWidth = null;	
	this.allowPopups = true; // allow pinned dialog to launch as a popup if it will be clipped by the window 
	this.oFrame = null;
	this.oFrameID = DialogObject.DEFAULT_FRAME_ID;
	this.opaqueCover = null;
	this.showOpaqueCover = showOpaqueCover || DialogObject.OPAQUE_COVER_FALSE;
	this.addedButtons = null;
	this.customButtons = null;
}
DialogObject._arguments = null;
DialogObject.OPAQUE_COVER_TRUE = true;
DialogObject.OPAQUE_COVER_FALSE = false;
DialogObject.DEFAULT_FRAME_ID = "dialogobjectiframe";
//-----------------------------------------------------------------------------
// function to initialize dialog
// this is fired when the dialog window loads - override this
// 		wnd - the dialog window
DialogObject.prototype.initDialog = function(wnd)
{
	wnd = wnd || window;
	// do your logic here
}
//-----------------------------------------------------------------------------
//function to programmatically close dialog
//this gets set in messageDialog.js
DialogObject.prototype.closeDialog = function()
{
}
//-----------------------------------------------------------------------------
DialogObject.prototype.initOpaqueCover = function(wnd)
{
	if (!wnd)
		wnd = window;
	
	if (typeof(window["OpaqueCoverObject"]) == "undefined")
		return;
	
	if (!this.opaqueCover)
		this.opaqueCover = new OpaqueCoverObject(wnd);
	
	this.opaqueCover.init(wnd);
	this.opaqueCover.createCover();	
}
//-----------------------------------------------------------------------------
DialogObject.prototype.showCover = function(wnd)
{
	if (this.showOpaqueCover)
	{
		this.initOpaqueCover(wnd);
		if (this.opaqueCover != null)
		{
			var coverColor = (this.styler && this.styler.showInfor) ? "black" : "gray";		
			this.opaqueCover.showCover(null, coverColor, 35);
		}	
	}
}
//-----------------------------------------------------------------------------
DialogObject.prototype.hideCover = function(wnd)
{
	if (this.showOpaqueCover && this.opaqueCover != null)
		this.opaqueCover.hideCover();
}
//-----------------------------------------------------------------------------
DialogObject.prototype.getWinSize = function(wnd)
{
	wnd = wnd || window;
	var w = 0;
	var h = 0;
	if (wnd.innerWidth) 
	{
        // non-IE browsers
        w = wnd.innerWidth;
        h = wnd.innerHeight;
    } 
    else if (wnd.document.documentElement && wnd.document.documentElement.clientWidth)
    {
        // IE 6+ in "standards compliant mode"
        w = wnd.document.documentElement.clientWidth;
        h = wnd.document.documentElement.clientHeight;
    } 
    else if (wnd.document.body && wnd.document.body.clientWidth)
    {
        // IE 6 in "quirks mode"
        w = wnd.document.body.clientWidth;
        h = wnd.document.body.clientHeight;
    }
	return [w, h];	
}
//-----------------------------------------------------------------------------
DialogObject.prototype.setTranslationFunc = function(func)
{
	if (!func)
		return;
	this.getPhrase = func;
}
//-----------------------------------------------------------------------------
DialogObject.prototype.getPhrase = function(phrase)
{
	return (this.translationFunc) ? this.translationFunc(phrase) : phrase;
}
//-----------------------------------------------------------------------------
DialogObject.prototype.addButton = function(btnId, btnName, btnTxt, wnd, clickFunc)
{
	wnd = wnd || window;
	clickFunc = clickFunc || null;
	
	if (this.styler != null && this.styler.showInfor3)
	{
		if (this.addedButtons == null)
			this.addedButtons = new Array();
		this.addedButtons[this.addedButtons.length] = { id:btnId, name:btnName, text:btnTxt, click:clickFunc };
		return this.addedButtons[this.addedButtons.length-1]; 
	}
	else
	{	
		var btn = wnd.document.getElementById(btnId);
		if (btn || !btnTxt)
			return;
		if (this.addedButtons == null)
			this.addedButtons = new Array();		
		btn = wnd.document.createElement("button");
		btn.setAttribute("id", String(btnId));
		btn.setAttribute("name", String(btnName));
		btn.setAttribute("styler", "pushbutton");
		btn.innerHTML = btnTxt;
		if (clickFunc)
			btn.onclick = clickFunc;
		else	
		{	
			btn.onclick = function()
			{
				wnd.onClick(this);
			};
		}		
		btn.className = "dlgButton";
		btn.style.width = "75px";
		if (this.styler && this.styler.showInfor && this.styler.textDir == "rtl")
			btn.style.margin = "0px 5px 0px 0px";
		else
			btn.style.margin = "0px 0px 0px 5px";
		btn.style.padding = "0px";
		this.addedButtons[this.addedButtons.length] = btn;
		var btnCancel = wnd.document.getElementById("btnCancel");
		btnCancel.parentNode.insertBefore(btn, btnCancel);
		return btn;
	}
}
//-----------------------------------------------------------------------------
DialogObject.prototype.setButtons = function(btnAry, wnd)
{
	wnd = wnd || window;
	if (!btnAry || btnAry.length == 0)
		return;
	
	this.customButtons = btnAry;
	
	if (this.styler == null || !this.styler.showInfor3)
	{
		var btnTable = wnd.document.getElementById("btnTable");
		var dftBtns = btnTable.getElementsByTagName("button");
		for (var i=0; i<btnAry.length; i++)
		{	
			// reuse the default buttons
			if (dftBtns.length > i)
			{
				dftBtns[i].setAttribute("id", String(btnAry[i].id));
				dftBtns[i].setAttribute("name", String(btnAry[i].name));
				if (btnAry[i].text)
					dftBtns[i].innerHTML = btnAry[i].text;
				if (btnAry[i].click)
					dftBtns[i].onclick = btnAry[i].click;
			}
			else
			{
				btn = wnd.document.createElement("button");
				btn.setAttribute("id", String(btnAry[i].id));
				btn.setAttribute("name", String(btnAry[i].name));
				btn.setAttribute("styler", "pushbutton");
				if (btnAry[i].text)
					btn.innerHTML = btnAry[i].text;
				if (btnAry[i].click)
					btn.onclick = btnAry[i].click;
				else
				{	
					btn.onclick = function()
					{
						wnd.onClick(this);
					};
				}
				btn.style.width = "auto";
				if (this.styler && this.styler.showInfor && this.styler.textDir == "rtl")
					btn.style.margin = "0px 5px 0px 0px";
				else
					btn.style.margin = "0px 0px 0px 5px";
				btn.style.padding = "0px";
				var btnCancel = wnd.document.getElementById("btnCancel");
				btnCancel.parentNode.insertBefore(btn, btnCancel);				
			}
		}
		// hide unused buttons
		for (var j=btnAry.length; j<dtfBtns.length; j++)
			dftBtns[j].style.display = "none";
	}
}
//-----------------------------------------------------------------------------
DialogObject.prototype.translateButton = function(btn, phrase, wnd)
{
	wnd = wnd || window;
	if (typeof(btn) == "string")
		btn = wnd.document.getElementById(btn);
	if (!btn || !phrase)
		return;

	btn.value = this.getPhrase(phrase);
	if (btn.innerText)
		btn.innerText = btn.value;
	else if (btn.textContent)
		btn.textContent = btn.value;
	else
		btn.innerHTML = btn.value;
}
//-----------------------------------------------------------------------------
// function to get dialog window for references to custom objects
// this is fired when the user clicks a button from the dialog window (override this)
// 		wnd - the dialog window
// Example:
// var myDlg = DialogObject();
// myDlg.doReturn = function(wnd)
// {
//	 var optionsFrm = wnd.document.forms["optionsFrm"];
//	 if (optionsFrm.elements["radioPrint"][0].checked)
//		 window.print();	
// }
DialogObject.prototype.doReturn = function(wnd)
{
	wnd = wnd || window;
	
	// do your logic here
}
//-----------------------------------------------------------------------------
// function to find the window where the StylerBase library is loaded
DialogObject.prototype.findStyler = function(searchOpener, wnd)
{
	if (!wnd)
		wnd = window;
	try
	{
		if (typeof(wnd["StylerBase"]) != "undefined" && wnd["StylerBase"] != null)
			return wnd;
		else if (wnd != wnd.parent)
			return findStyler("StylerBase", searchOpener, wnd.parent);
	}
	catch(e) {}
	try
	{
		if (searchOpener && wnd.opener)
		{
			if (typeof(wnd.opener["StylerBase"]) != "undefined" && wnd.opener["StylerBase"] != null)
				return wnd.opener;
			else
				return findStyler("StylerBase", searchOpener, wnd.opener);
		}
	}
	catch(e) {}
	return null;
}
//-----------------------------------------------------------------------------
// function to customize styling
// this is fired as the dialog window is loading (override this)
// 		wnd - the dialog window
DialogObject.prototype.styleDialog = function(wnd)
{
	wnd = wnd || window;
	
	var stylerWnd = wnd;
	if (typeof(wnd["StylerBase"]) == "undefined")
		stylerWnd = this.findStyler(false, wnd);
	
	// Not sure when the styler would ever be 'null'	
	if (this.styler == null)
	{
		this.styler = new stylerWnd.StylerBase();
		this.styler.showLDS = false;
		this.styler.showInfor = true;
		stylerWnd.StylerBase.webappjsURL = "../..";		

		if (this.pinned && typeof(parent["SSORequest"]) != "undefined")
			this.styler.httpRequest = parent.SSORequest;
		else if (typeof(wnd["SSORequest"]) != "undefined")
			this.styler.httpRequest = wnd.SSORequest;	
	}
	
	wnd.styler = this.styler;
	wnd.StylerBase = stylerWnd.StylerBase;
	if ((this.styler.showInfor || this.styler.showInfor3) && this.styler.textDir == "rtl") 
	{
		var htmlObjs = this.styler.getLikeElements(wnd, "html");
		for (var i=0; i<htmlObjs.length; i++) 
		{
		    htmlObjs[i].setAttribute("dir", this.styler.textDir);
		}
		var subDir = (this.styler.showInfor3) ? "/infor3" : "/infor";
		this.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + subDir + "/css/base/inforRTL.css");
		if (this.styler.showInfor && (navigator.userAgent.indexOf("MSIE") >= 0) && (!document.documentMode || (document.documentMode < 8)))
		{
			var botLeft = wnd.document.getElementById("bottomLeft");
			var botRight = wnd.document.getElementById("bottomRight");
			botLeft.style.marginLeft = "0px";
			botLeft.style.marginRight = "3px";
			botRight.style.marginLeft = "0px";
			botRight.style.marginRight = "-3px";			
		}	
	}
	
	if (typeof(this.styler.modifyDOM) == "undefined" && typeof(this.styler.loadLibrary) != "undefined")
	{
		this.styler.loadLibrary(wnd, this.styler.httpRequest);
	}	
	this.styler.modifyDOM(wnd);
}
//-----------------------------------------------------------------------------
// function to display error message with option to display stack trace
// 		msg  - the message to display, required
//		errorDom  - a dom object with IOS standard error format, required
//		icon - the image to display, optional : 'info' (default), 'alert', 'stop'
//		wnd  - the window owning the dialog, optional
// there is no return value from this method
//-----------------------------------------------------------------------------
DialogObject.prototype.errorMessageBox = function(msg, errorDom, icon, wnd)
{
	if (!msg || !errorDom)
		return;

	// translate if possible
	msg = this.getPhrase(msg);

	if (this.traceObj)
		this.traceObj.dump(msg, (new SEAObjectFactory().formatXML(errorDom)));

	if (!wnd)
		wnd = window;

	// errorMessageBox supported only in IE: else use alert
	if (!this.browser.isIE)
	{
		var dtlText = "";
		var dtlNode = errorDom.getElementsByTagName("DETAILS");
		dtlNode = (dtlNode && dtlNode.length > 0 ? dtlNode[0] : null);
		if (dtlNode)
			dtlText += dtlNode.firstChild.nodeValue;
		msg += ("\n" + this.getPhrase("Details") + ":\n" + dtlText.substr(0,1000) + "\n\n");
		wnd.alert(msg);
		return;
	}

	// validate icon
	if (typeof(icon) == "undefined" || icon == null)
		icon = "info";
	else if (icon != "info" && icon != "alert" && icon != "stop" && icon != "none")
		icon = "info";

	var dlgArgs = new Array();
	dlgArgs[0] = this;
	dlgArgs[1] = errorDom;
	dlgArgs[2] = icon;
	dlgArgs[3] = msg;
	var strDlgPath = this.webappjsDir + "html/messageDialogError.htm"
 	var strFeatures = "dialogWidth:600px;dialogHeight:120px;center:yes;help:no;scroll:no;status:no;";
	wnd.showModalDialog(strDlgPath, dlgArgs, strFeatures);
}
//-----------------------------------------------------------------------------
// function to display message and return a button selection
// 		msg  - the message to display, required
//		type - the set of buttons to display, optional
//			'ok' (default), 'okcancel', 'yesno', 'yesnocancel', 'stopcontinue', 'cancelcontinue'
//		icon - the image to display, optional
//			'info' (default), 'alert', 'question', 'stop'
//		wnd  - the window owning the dialog, optional
// the dialog will always return one the lowercase values (string) of the buttons
//-----------------------------------------------------------------------------
DialogObject.prototype.messageBox = function(msg, type, icon, wnd, showPrint, secondaryMsg, callbackFunc, focusBtn, submitOnEnter, title)
{
	if (!msg)
		return;

	// translate if possible
	msg = this.getPhrase(msg);

	if (this.traceObj)
		this.traceObj.dump(msg);

	if (!wnd)
		wnd = window;

	// messageBox supported only when styler is found
	if (!this.styler)
	{
		if (icon == "question")
		{
			// question may use: 'okcancel', 'yesno', 'stopcontinue'
			var strNo = (type=="okcancel" ? "cancel" : (type=="stopcontinue" ? "continue" : (type=="cancelcontinue" ? "continue" : "no")));
			var strYes = (type=="okcancel" ? "ok" : (type=="stopcontinue" ? "stop" : (type=="cancelcontinue" ? "cancel" : "yes")));
			var ret = wnd.confirm(msg);
			return (ret ? strYes : strNo);
		}
		else
		{
			wnd.alert(msg);
			return null;
		}
	}

	// validate icon
	if (typeof(icon) == "undefined" || icon == null)
		icon = "info";
	else if (this.styler && this.styler.showInfor3)
	{
		var iconList = "addNew,alert,book,campaign,calendar,channel,chart,check,communication,compensation,countdown,development,disk,email,error,event,exclusion,find,findUser,folder,goal,group,help,info,lock,mail,manager,notes,ok,opportunity,outputFiles,profile,question,rule,save,schedule,search,settings,time,todo,tools,user,wizard";
		if (icon != "none" && iconList.indexOf(icon) == -1)
			icon = "info";
	}	
	else if (icon != "info" && icon != "alert" && icon != "question" && icon != "stop" && icon != "trash" && icon != "none")
		icon = "info";

	// validate type and possibly override icon
	if (typeof(type) == "undefined" || type == null)
		type = "ok";
	switch (type)
	{
		case "ok":
		case "okcancel":
			break;
		case "yesno":
		case "yesnocancel":
		case "stopcontinue":
			if (icon == "info")
				icon="question";
			break;
		case "cancelcontinue":
			if (icon == "info")
				icon="question";
			break;
		default:
			type = "ok";
			break;
	}

	// validate focusBtn
	if (typeof(focusBtn) == "undefined" || focusBtn == null)
		focusBtn = "";
	else if (focusBtn != "ok" && focusBtn != "cancel" && focusBtn != "yes" && focusBtn != "no" 
		  && focusBtn != "stop" && focusBtn != "continue" && focusBtn != "print")
		focusBtn = "";

	// IE will block until the user responds, so the callback function is not needed for a confirm dialog
	if (this.browser.isIE && this.pinned == false && icon == "question")
	{
		callbackFunc = null;
	}

	secondaryMsg = (secondaryMsg) ? secondaryMsg.replace(/\n/g, " ") : "";
	submitOnEnter = (typeof(submitOnEnter) == "boolean") ? submitOnEnter : true;
	
	var dlgArgs = new Array();
	dlgArgs[0] = this;
	dlgArgs[1] = type;
	dlgArgs[2] = icon;
	dlgArgs[3] = msg;
	dlgArgs[4] = typeof(showPrint) == "boolean" ? showPrint : false;
	dlgArgs[5] = secondaryMsg;
	dlgArgs[6] = callbackFunc;
	dlgArgs[7] = focusBtn;
	dlgArgs[8] = submitOnEnter;
	dlgArgs[9] = title;

	DialogObject._arguments = dlgArgs;
	if (wnd != window && !wnd.DialogObject)
	{
		wnd.DialogObject = DialogObject;
	}

	// hide the Activity Dialog - will prevent it from overlaying the message box.
	if (typeof(wnd.ActivityDialogObject) != "undefined" && wnd.ActivityDialogObject._singleton)
		wnd.ActivityDialogObject._singleton.hideDialog();		

	if (this.styler && this.styler.showInfor3)
	{	
		this.initDialog(wnd);
		wnd.focus();
		var dialogObj = this;
		var btnObj = function(wnd, id, txt, dft, clk) {
			dft = (dft) ? true : false;
			if (!clk)
			{
				clk = function() {
					if (submitOnEnter == false)
					{
						var evt = wnd.event || null;
						if (evt && evt.keyCode == 13)
							return;
					}	
					if (callbackFunc && typeof(callbackFunc.apply) != "undefined")
					{
						wnd.returnValue = id;
						dialogObj.doReturn(wnd);
						var retVal = callbackFunc.apply(this, new Array(wnd));
						if (typeof(retVal) != "undefined" && retVal == false)
							return;
					}	
					$(this).inforDialog("close");
				}					
			}	
			return {
				text: txt,
				click: clk,
				isDefault: dft
			};
		}
		
		var dlgLbls = { "Ok":"OK",	"Cancel":"Cancel", "Yes":"Yes", "No":"No", "Stop":"Stop", "Continue":"Continue", "Dialog":"Dialog"};
		var btnAry = [];		
		if (this.customButtons != null)
		{
			for (var i=0; i<this.customButtons.length; i++)	
				btnAry[btnAry.length] = btnObj(wnd, this.customButtons[i].id, this.customButtons[i].text, (i==0), this.customButtons[i].click);
		}	
		else
		{
			if (this.styler.getLanguage() && typeof(wnd["Globalize"]) != "undefined")
			{
				this.styler.translateCulture(wnd, this.styler.getTranslationFunc(), wnd.Globalize.culture());
				dlgLbls = { "Ok":wnd.Globalize.localize("Ok"),	"Cancel":wnd.Globalize.localize("Cancel"), "Yes":wnd.Globalize.localize("Yes"), "No":wnd.Globalize.localize("No"), "Stop":wnd.Globalize.localize("Stop"), "Continue":wnd.Globalize.localize("Continue"), "Dialog":wnd.Globalize.localize("Dialog")};
			}	
			btnAry = [btnObj(wnd, "ok", dlgLbls["Ok"], true, null)];
			switch (type)
			{
				case "okcancel":
					btnAry = [ 
					        btnObj(wnd, "ok", dlgLbls["Ok"], true, null),
					        btnObj(wnd, "cancel", dlgLbls["Cancel"], false, null)
					];				
					break;
				case "yesno":
					btnAry = [ 
					        btnObj(wnd, "yes", dlgLbls["Yes"], true, null),
					        btnObj(wnd, "no", dlgLbls["No"], false, null)
					];
					break;
				case "yesnocancel":
					btnAry = [ 
					        btnObj(wnd, "yes", dlgLbls["Yes"], true, null),
					        btnObj(wnd, "no", dlgLbls["No"], false, null),
					        btnObj(wnd, "cancel", dlgLbls["Cancel"], false, null)
					];				
					break;
				case "stopcontinue":
					btnAry = [ 
					        btnObj(wnd, "stop", dlgLbls["Stop"], true, null),
					        btnObj(wnd, "continue", dlgLbls["Continue"], false, null)
					];
					break;
				case "cancelcontinue":
					btnAry = [ 
					        btnObj(wnd, "cancel", dlgLbls["Cancel"], true, null),
					        btnObj(wnd, "continue", dlgLbls["Continue"], false, null)
					];				
					break;
			}
			if (this.addedButtons != null)
			{
				for (var i=0; i<this.addedButtons.length; i++)
					btnAry[btnAry.length] = btnObj(wnd, this.addedButtons[i].id, this.addedButtons[i].text, false, this.addedButtons[i].click);				
			}	
		}
		var inforDialogType = "Information";
		var inforDialogIcon = "info";
		switch (icon)
		{
			case "alert": inforDialogType = "Alert"; inforDialogIcon = "alert"; break;
			case "stop":
			case "trash": inforDialogType = "Error"; inforDialogIcon = "error"; break;
			case "help":
			case "question": inforDialogType = "Confirmation"; inforDialogIcon = "help"; break;
			case "none": inforDialogType = "Information"; inforDialogIcon = "info"; break;
			default: inforDialogType = null; inforDialogIcon = icon; break;
		}
		msg = msg.replace(/^\s+|\s+$/g, "");
		var isHtml = (typeof(msg) == "string" && msg.match(/<[^<]+>/)) ? true : false;
		var closeIcon = null;
		var uiDialog = null;
		if (isHtml)
		{
			var contentHtml = '<div>' + msg + '</div><div>' + secondaryMsg + '</div>';
			if (wnd.$('#seaCustomDialog', wnd.document).length == 0)
				wnd.$("body", wnd.document).append('<div id="seaCustomDialog" class="inforDialogContent" style="display:none">'+contentHtml+'</div>');
			else
				wnd.$('#seaCustomDialog', wnd.document).html(contentHtml);
			uiDialog = wnd.$('#seaCustomDialog', wnd.document).inforMessageDialog({
				title: title || dlgLbls["Dialog"],
				dialogType: "General",
				width: "auto",
				height: "auto",
				icon: inforDialogIcon,
				modal: true,
				close: function(event, ui) {
					wnd.$('#seaCustomDialog', wnd.document).remove();					
				},
				buttons: btnAry
			});
			closeIcon = uiDialog.prevAll().find(".inforCloseButton");
			this.styleDialog(wnd);
		}	
		else
		{	
			if (wnd.$('.inforOverlay', wnd.document).length > 0)
				wnd.$('.inforOverlay', wnd.document).remove();
			uiDialog = wnd.$('body', wnd.document).inforMessageDialog({
				title: title || dlgLbls["Dialog"],
				shortMessage: msg,
				detailedMessage: secondaryMsg,
				dialogType: inforDialogType,
				icon: inforDialogIcon,
				modal: true,
				buttons: btnAry
			});
			closeIcon = uiDialog.find(".inforCloseButton");
		}
		if (closeIcon)
		{	
			closeIcon.one("click", function (event) {
				if (callbackFunc && typeof(callbackFunc.apply) != "undefined")
				{
					wnd.returnValue = "close";
					dialogObj.doReturn(wnd);
					callbackFunc.apply(this, new Array(wnd));
				}					
				return false;
			});	
		}
		this.closeDialog = function()
		{
			try { wnd.$(uiDialog, wnd.document).inforDialog("close"); } catch(e) {}
		};
		return;
	}	
	
	this.showCover(wnd);	
	
	var strDlgPath;	
	if (this.styler && this.styler.showInfor)
	{
		strDlgPath = this.webappjsDir + "infor/html/messageDialog.htm";
	}
	else if (this.styler && this.styler.showLDS)
	{
		strDlgPath = this.webappjsDir + "lds/html/messageDialog.htm";
	}	
	else
	{
		strDlgPath = this.webappjsDir + "html/messageDialog.htm"
	}

	if (this.pinned)
	{
		this.openPinnedDialog(wnd, strDlgPath);
	}
	else if (this.browser.isIE)
	{
		var strFeatures = "dialogWidth:600px;dialogHeight:120px;center:yes;help:no;scroll:no;status:no;resizable:yes";
		return wnd.showModalDialog(strDlgPath, dlgArgs, strFeatures);	
	}
	else
	{
		var strFeatures = "width=600,height=145,chrome,centerscreen,dependent=yes,dialog=yes,modal=yes,resizable=yes,scrollbars=no,location=no,status=no,menubar=no,toolbar=no"
		+ ",left=" + ((screen.width/2) - 300) + ",top=" + ((screen.height/2) - 90);
		setTimeout(function() { var dlgWin = wnd.open(strDlgPath, "dialogWin", strFeatures); dlgWin.focus(); }, 5);
	}
}
//-----------------------------------------------------------------------------
// function to display dialog box pinned to the window
//		wnd  - the window owning the dialog
//		dlgArgs - array of dialog arguments
// there is no return value from this method
//-----------------------------------------------------------------------------
DialogObject.prototype.openPinnedDialog = function(wnd, strDlgPath)
{
	if (!wnd)
	{
		wnd = window;
	}

	if (!this.oFrame)
	{
		if (wnd.document.getElementById(this.oFrameID))
		{
			this.oFrame = wnd.document.getElementById(this.oFrameID);
		}
		else
		{
			this.oFrame = wnd.document.createElement("iframe");
			this.oFrame.setAttribute("frameborder", "no");
			this.oFrame.setAttribute("frameBorder", "no");
			this.oFrame.setAttribute("marginwidth", "0");
			this.oFrame.setAttribute("marginheight", "0");
			this.oFrame.setAttribute("scrolling", "no");
			this.oFrame.setAttribute("name", this.oFrameID);
			this.oFrame.setAttribute("id", this.oFrameID);
			wnd.document.body.appendChild(this.oFrame);			
		}	
	}
    
	var wndObj = this.getWinSize(wnd);
	var windowWidth = wndObj[0];
	var windowHeight = wndObj[1];
	
	if (this.styler && this.styler.showInfor)
	{
		this.oFrame.style.border = "none";
		this.oFrame.setAttribute("allowtransparency", "true");
		this.oFrame.allowTransparency = true;
		this.oFrame.style.backgroundColor = "transparent";
	}	
	else
	{
		this.oFrame.style.border = "1px solid #707070";
		this.oFrame.style.backgroundColor = "#ffffff";
	}    	
	
	var dlgHeight = 120;
	var dlgWidth = 400;
	var topPos = parseInt(windowHeight*.15, 10);
	var leftPos = parseInt(windowWidth/2, 10) - parseInt(dlgWidth/2, 10);
	if (leftPos < parseInt(windowWidth*.15, 10))
		dlgWidth = windowWidth - (parseInt(windowWidth*.15, 10) * 2);
	else if ((leftPos + dlgWidth + 15) > windowWidth)	
		dlgWidth = windowWidth - (leftPos*2);
	leftPos = parseInt(windowWidth/2, 10) - parseInt(dlgWidth/2, 10);
	if ((topPos + dlgHeight + 15) > windowHeight)
		dlgHeight = windowHeight - (topPos*2);
	this.oFrame.style.position = "absolute";
	if (this.styler && this.styler.showInfor && this.styler.textDir == "rtl")
		this.oFrame.style.right = (leftPos < parseInt(windowWidth*.15, 10)) ? "15%" : leftPos + "px";
	else
		this.oFrame.style.left = (leftPos < parseInt(windowWidth*.15, 10)) ? "15%" : leftPos + "px";
	this.oFrame.style.top = "15%";
	this.oFrame.style.width = dlgWidth + "px";
	this.oFrame.style.height = dlgHeight + "px";
	// default message dialogs should display above custom dialogs
	if (this.oFrameID != DialogObject.DEFAULT_FRAME_ID)
		this.oFrame.style.zIndex = "999";
	else
		this.oFrame.style.zIndex = "9999";
	this.oFrame.src = strDlgPath; 
	this.oFrame.style.visibility = "visible";
	
	// center the dialog when the window is resized
	var dlgInstance = this;
	DialogObject.resizeHandler = function()
	{
		if (!dlgInstance.oFrame || !dlgInstance.pinned)
			return false;
		var wndObj = dlgInstance.getWinSize();
		var windowWidth = wndObj[0];
		var windowHeight = wndObj[1];
		var dlgWidth = Number(dlgInstance.oFrame.style.width.replace("px",""));
		var dlgHeight = Number(dlgInstance.oFrame.style.height.replace("px",""));
		var newLeft = Number(dlgInstance.oFrame.style.width.replace("px",""));
		var newTop = (windowHeight - dlgHeight)/4;
		var newLeft = (windowWidth - dlgWidth)/2;
		dlgInstance.oFrame.style.left = parseInt(newLeft, 10) + "px";
		dlgInstance.oFrame.style.top = parseInt(newTop, 10) + "px";		
	};
	if (wnd.addEventListener)
		wnd.addEventListener("resize", DialogObject.resizeHandler, false);
	else if (wnd.attachEvent)
		wnd.attachEvent("onresize", DialogObject.resizeHandler);	
}
//-----------------------------------------------------------------------------
DialogObject.resizeHandler = function()
{
}