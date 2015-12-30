/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/objects/ActivityDialog.js,v 1.4.2.8.2.17 2014/03/04 17:54:42 brentd Exp $ */
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
//		Sizer.js
//		OpaqueCover.js
//		activityDialog.css
//		titleBar.css
//-----------------------------------------------------------------------------
//
//	PARAMETERS:
//		wnd			(optional) the window to create the opaque div cover
//-----------------------------------------------------------------------------
function ActivityDialogObject(wnd, dialogText, showOpaqueCover, webappjsDir, styler)
{
	// only allow one instance per file load
	if (ActivityDialogObject._singleton)
		return ActivityDialogObject._singleton;
	else
		ActivityDialogObject._singleton = this;

	this.wnd = wnd || window;
	this.oDiv = null;
	this.controlElm = null; // HTML5 control instance
	this.text = (dialogText && typeof(dialogText) == "string") ? dialogText : "Processing...";
	this.opaqueCover = null;
	this.showOpaqueCover = showOpaqueCover || ActivityDialogObject.OPAQUE_COVER_FALSE;
	this.webappjsDir = (webappjsDir) ? webappjsDir : "/lawson/webappjs/";
	this.styler = styler;
	if (this.showOpaqueCover && (!this.styler || !this.styler.showInfor3))
	{
		this.initOpaqueCover(this.wnd);
	}

	this.method = null;
	this.isInUse = false;
	this.ariaLiveElm = null;
}
//-- static variables ---------------------------------------------------------
ActivityDialogObject._singleton = null;
ActivityDialogObject.OPAQUE_COVER_TRUE = true;
ActivityDialogObject.OPAQUE_COVER_FALSE = false;

//-----------------------------------------------------------------------------
ActivityDialogObject.prototype.initOpaqueCover = function(wnd)
{
	if (!wnd)
	{
		wnd = window;
	}

	if (this.opaqueCover != null || (this.styler && this.styler.showInfor3))
	{
		return;
	}
	
	this.opaqueCover = new OpaqueCoverObject(wnd);
	this.opaqueCover.createCover();
}

//-----------------------------------------------------------------------------
ActivityDialogObject.prototype.sizeDialog = function(w, h)
{
	if (!this.oDiv)
	{	
		return;
	}
	
	if (this.styler && this.styler.showInfor3)
	{
		this.oDiv.style.height = SizerObject.getHeight(this.wnd) + "px";
		this.oDiv.style.width = SizerObject.getWidth(this.wnd) + "px";		
	}
	else if (this.styler && this.styler.showInfor)
	{
		this.oDiv.style.width = (typeof(w) != "undefined" && !isNaN(Number(w))) ? w + "px" : "535px";
		this.oDiv.style.height = (typeof(h) != "undefined" && !isNaN(Number(h))) ? h + "px" : "225px";

		var newWidth;
		var newHeight;		
		var msgContent = this.wnd.document.getElementById("activityDialogMsgContent");
		msgContent.style.height = "auto";
		msgContent.style.width = "auto";
		
		if (typeof(w) != "undefined" && !isNaN(Number(w)))
		{	
			newWidth = w;
		}
		else
		{	
			var txtWidth = (msgContent.clientWidth && msgContent.clientWidth > 245) ? msgContent.clientWidth : 245;
			newWidth = txtWidth + 50;
			newWidth = (newWidth > 535) ? 535 : newWidth;			
			this.oDiv.style.width = parseInt(newWidth, 10) + "px";
		}
		
		if (typeof(h) != "undefined" && !isNaN(Number(h)))
		{	
			newHeight = h;
		}
		else
		{	
			var txtHeight = (msgContent.clientHeight && msgContent.clientHeight > 95) ? msgContent.clientHeight : 95;
			newHeight = txtHeight + 125;			
			this.oDiv.style.height = parseInt(newHeight, 10) + "px";
		}
		
		var msgBg = this.wnd.document.getElementById("activityDialogMsgBg");
		msgBg.style.left = "24px";
		msgBg.style.top = "54px";
		msgBg.style.width = (parseInt(newWidth, 10) - 48) + "px";
		msgBg.style.height = (parseInt(newHeight, 10) - 108) + "px";
		msgBg.style.display = "block";
	
		msgContent.style.height = (parseInt(newHeight, 10) - 128) + "px";
		msgContent.style.width = (parseInt(newWidth, 10) - 92) + "px";
		
		var leftBorder = this.wnd.document.getElementById("activityDialogLeftBorder");
		var rightBorder = this.wnd.document.getElementById("activityDialogRightBorder");
		if ((navigator.userAgent.indexOf("MSIE") >= 0) && (!document.documentMode || document.documentMode < 8))
		{
			leftBorder.style.height = "100%";
			rightBorder.style.height = "100%";		
		}
		else if ((newHeight - 108) >= 0)
		{
			leftBorder.style.height = (newHeight - 108) + "px";
			rightBorder.style.height = (newHeight - 108) + "px";
		}
	}
}

//-----------------------------------------------------------------------------
ActivityDialogObject.prototype.createInfor3Dialog = function()
{
	this.oDiv = this.wnd.document.createElement("div");
	this.oDiv.setAttribute("id", "activityDialogDiv");
	this.oDiv.style.position = "absolute";
	this.oDiv.style.top = "0px";
	this.oDiv.style.left = "0px";
	this.wnd.document.body.appendChild(this.oDiv);
	this.sizeDialog();		
}

//-----------------------------------------------------------------------------
ActivityDialogObject.prototype.createInforDialog = function()
{
	this.oDiv = this.wnd.document.createElement("div");
	this.oDiv.setAttribute("id", "activityDialogDiv");
	this.oDiv.className = "inforActivityDialog";
	this.oDiv.style.visibility = "hidden";
	
	var msgBg = this.wnd.document.createElement("div");
	msgBg.setAttribute("id", "activityDialogMsgBg");
	msgBg.style.position = "absolute";
	msgBg.style.backgroundColor = "#ffffff";
	msgBg.style.zIndex = "-1";
	msgBg.style.display = "none";
	this.oDiv.appendChild(msgBg);
	
	var leftBorder = this.wnd.document.createElement("div");
	leftBorder.setAttribute("id", "activityDialogLeftBorder");
	leftBorder.className = "inforDialogLeftBorder";
	var left = this.wnd.document.createElement("div");
	left.className = "inforDialogLeft";
	leftBorder.appendChild(left);
	this.oDiv.appendChild(leftBorder);
	
	var rightBorder = this.wnd.document.createElement("div");
	rightBorder.setAttribute("id", "activityDialogRightBorder");
	rightBorder.className = "inforDialogRightBorder";
	var right = this.wnd.document.createElement("div");
	right.className = "inforDialogRight";
	rightBorder.appendChild(right);
	this.oDiv.appendChild(rightBorder);	

	var msgContent = this.wnd.document.createElement("div");
	msgContent.setAttribute("id", "activityDialogMsgContent");
	msgContent.className = "inforDialogContent";
		
	var tDiv = this.wnd.document.createElement("div");
	tDiv.setAttribute("id", "activityDialogText");
	tDiv.className = "inforDialogText";
	tDiv.appendChild(this.wnd.document.createTextNode(this.text));	
	
	var aDiv = this.wnd.document.createElement("div");
	aDiv.className = "inforActivityDialogIcon";
	aDiv.appendChild(this.wnd.document.createTextNode("\u00a0"));	

	msgContent.appendChild(tDiv);	
	msgContent.appendChild(aDiv);
	this.oDiv.appendChild(msgContent);
	
	var topLeft = this.wnd.document.createElement("div");
	topLeft.className = "inforDialogTopLeft";	
	
	var topRight = this.wnd.document.createElement("div");
	topRight.className = "inforDialogTopRight";	

	var topCenter = this.wnd.document.createElement("div");
	topCenter.className = "inforDialogTopCenter";
	var top = this.wnd.document.createElement("div");
	top.className = "inforDialogTop";
	var title = this.wnd.document.createElement("div");
	title.setAttribute("id", "activityDialogTitle");
	title.className = "inforDialogTitleBar";
	title.appendChild(this.wnd.document.createTextNode("\u00a0"));
	top.appendChild(title);
	topCenter.appendChild(top);
			
	var botLeft = this.wnd.document.createElement("div");
	botLeft.className = "inforDialogBottomLeft";	
	if (this.styler && this.styler.textDir == "rtl" && (navigator.userAgent.indexOf("MSIE") >= 0)
	&& (!document.documentMode || (document.documentMode < 8)))
	{
		botLeft.style.marginLeft = "0px";
		botLeft.style.marginRight = "3px";
	}
	var botCenter = this.wnd.document.createElement("div");
	botCenter.className = "inforDialogBottomCenter";
	var bot = this.wnd.document.createElement("div");
	bot.className = "inforDialogBottom";
	bot.appendChild(this.wnd.document.createTextNode("\u00a0"));
	botCenter.appendChild(bot);
	botLeft.appendChild(botCenter);

	var botRight = this.wnd.document.createElement("div");
	botRight.className = "inforDialogBottomRight";
	if (this.styler && this.styler.textDir == "rtl" && (navigator.userAgent.indexOf("MSIE") >= 0)
	&& (!document.documentMode || (document.documentMode < 8)))
	{
		botRight.style.marginLeft = "0px";
		botRight.style.marginRight = "-3px";
	}	
	
	topLeft.appendChild(topRight);
	topLeft.appendChild(topCenter);
	topLeft.appendChild(botLeft);
	topLeft.appendChild(botRight);
	this.oDiv.appendChild(topLeft);	
	
	this.wnd.document.body.appendChild(this.oDiv);
	this.sizeDialog();		
}

//-----------------------------------------------------------------------------
ActivityDialogObject.prototype.createLDSDialog = function()
{
	this.oDiv = this.wnd.document.createElement("div");
	this.oDiv.setAttribute("id", "activityDialogDiv");
	this.oDiv.className = "dialogStyler";
	this.oDiv.style.visibility = "hidden";
	
	// title bar background
	var iDiv = this.wnd.document.createElement("img");
	iDiv.className = "dialogTitleBarIconStyler";
	iDiv.src = this.webappjsDir + "lds/images/01_title_bar_base.png";

	var tDiv = this.wnd.document.createElement("div");
	tDiv.className = "dialogTitleBarStyler";
	tDiv.appendChild(iDiv);
	this.oDiv.appendChild(tDiv);
	
	// title bar gloss effect
	iDiv = this.wnd.document.createElement("img");
	iDiv.className = "dialogTitleBarIconStyler";
	iDiv.src = this.webappjsDir + "lds/images/01_title_bar_gloss.png";
	
	tDiv = this.wnd.document.createElement("div");
	tDiv.className = "dialogTitleBarPanelStyler";
	tDiv.appendChild(iDiv);
	this.oDiv.appendChild(tDiv);
	
	// title bar horizontal rule
	iDiv = this.wnd.document.createElement("img");
	iDiv.className = "dialogTitleBarRuleIconStyler";
	iDiv.src = this.webappjsDir + "lds/images/01_title_bar_rule.png";
	
	tDiv = this.wnd.document.createElement("div");
	tDiv.className = "dialogTitleBarRuleStyler";
	tDiv.appendChild(iDiv);
	this.oDiv.appendChild(tDiv);	
	
	// dialog content
	var tDiv = this.wnd.document.createElement("div");
	tDiv.setAttribute("id", "activityDialogText");
	tDiv.className = "dialogTextStyler";
	tDiv.appendChild(this.wnd.document.createTextNode(this.text));
	
	var aDiv = this.wnd.document.createElement("div");
	aDiv.className = "dialogActivityIconStyler";
	aDiv.appendChild(this.wnd.document.createTextNode("\u00a0"));	
	
	var cDiv = this.wnd.document.createElement("div");
	cDiv.className = "dialogContentStyler";
	cDiv.appendChild(tDiv);
	cDiv.appendChild(aDiv);
	this.oDiv.appendChild(cDiv);
	
	this.wnd.document.body.appendChild(this.oDiv);
}

//-----------------------------------------------------------------------------
ActivityDialogObject.prototype.createDialog = function()
{	
	if (this.oDiv)
	{
		return;
	}
	
	if (this.styler && this.styler.showInfor3)
	{
		this.createInfor3Dialog();
	}	
	else if (this.styler && this.styler.showInfor)
	{
		this.createInforDialog();
	}
	else if (this.styler && this.styler.showLDS)
	{
		this.createLDSDialog();
	}
}

//-----------------------------------------------------------------------------
ActivityDialogObject.prototype.createAriaLiveElm = function()
{
	if (this.wnd.document.getElementById("ariaLiveElm"))
		this.ariaLiveElm = this.wnd.document.getElementById("ariaLiveElm");
	else
	{	
		this.ariaLiveElm = this.wnd.document.createElement("span");
		this.wnd.document.body.appendChild(this.ariaLiveElm);
	}	
	this.ariaLiveElm.setAttribute("id", "ariaLiveElm");
	this.ariaLiveElm.setAttribute("aria-live", "polite");
	this.ariaLiveElm.setAttribute("aria-atomic", "true");
	this.ariaLiveElm.style.position = "absolute";
	this.ariaLiveElm.style.left = "-9999px";
}

//-----------------------------------------------------------------------------
ActivityDialogObject.prototype.setAriaLiveMsg = function(msg)
{
	if (!this.ariaLiveElm)
	{
		this.createAriaLiveElm();
	}
	
	this.ariaLiveElm.innerHTML = (typeof(msg) == "string") ? msg : "";
}

//-----------------------------------------------------------------------------
ActivityDialogObject.prototype.showDialog = function(dialogText, method)
{	
	if (!this.oDiv)
	{
		this.createDialog();
	}

	this.setAriaLiveMsg("");
	
	if (this.styler && this.styler.showInfor3)
	{
		if (this.controlElm)
			this.hideDialog();
		this.sizeDialog();
		this.oDiv.style.visibility = "visible";
		var opts = {delay:0, modal:this.showOpaqueCover};
		if (typeof(dialogText) == "string")
			opts.text = dialogText;
		this.controlElm = this.wnd.$(this.oDiv, this.wnd.document).inforBusyIndicator(opts);
	}
	else
	{
		if (typeof(dialogText) == "string")
		{
			this.wnd.document.getElementById("activityDialogText").innerHTML = dialogText;
		}
		
		if (this.showOpaqueCover)
		{
			var coverColor = (this.styler && this.styler.showInfor) ? "black" : "gray";
			this.opaqueCover.showCover(null, coverColor, 35);
		}
		
		var windowWidth = 0;
		var windowHeight = 0;
		if (this.wnd.innerWidth) 
		{
			// non-IE browsers
			windowWidth = window.innerWidth;
			windowHeight = window.innerHeight;
		} 
		else if (this.wnd.document.documentElement && this.wnd.document.documentElement.clientWidth)
		{
			// IE 6+ in "standards compliant mode"
			windowWidth = this.wnd.document.documentElement.clientWidth;
			windowHeight = this.wnd.document.documentElement.clientHeight;
		} 
		else if (this.wnd.document.body && this.wnd.document.body.clientWidth)
		{
			// IE 6 in "quirks mode"
			windowWidth = this.wnd.document.body.clientWidth;
			windowHeight = this.wnd.document.body.clientHeight;
		}
		
		this.sizeDialog();
		var newWidth = this.oDiv.clientWidth;
		var newHeight = this.oDiv.clientHeight;
		var topPos = parseInt(windowHeight*.30, 10);
		var leftPos = parseInt((windowWidth/2) - (this.oDiv.clientWidth/2), 10);
		if (leftPos < 0)
			leftPos = 5;
		if ((newWidth + leftPos) >= windowWidth)
		{
			leftPos = 5;
			newWidth = windowWidth - 10;
		}	
		
		if ((newHeight + topPos) >= windowHeight)
		{
			topPos = 5;
			newHeight = windowHeight - 10;
		}	
	
		this.oDiv.style.width = newWidth + "px";
		this.oDiv.style.height = newHeight + "px";
		if (newWidth > 0 || newHeight > 0)
			this.sizeDialog(newWidth, newHeight);
		this.oDiv.style.top = topPos + "px";
		this.oDiv.style.left = leftPos + "px";
		this.oDiv.style.zIndex = "999999999";
		this.oDiv.style.visibility = "visible";
	}

	if (method)
	{
		this.method = method;
		this.isInUse = true;
		var callbackMethod = this.method;
		setTimeout(callbackMethod, 50);
	}
}

//-----------------------------------------------------------------------------
ActivityDialogObject.prototype.hideDialog = function(msg)
{	
	if (!this.oDiv)
	{
		return;
	}

	this.oDiv.style.visibility = "hidden";
	
	if (this.styler && this.styler.showInfor3)
	{
		this.wnd.$(this.oDiv, this.wnd.document).inforBusyIndicator("close");	
	}	
	else if (this.showOpaqueCover)
	{	
		this.opaqueCover.hideCover();
	}

	this.reset();
	
	if (msg)
		this.setAriaLiveMsg(msg);	
}

//-----------------------------------------------------------------------------
ActivityDialogObject.prototype.isDialogVisible = function()
{	
	if (!this.oDiv)
	{
		return false;
	}
	
	return (this.oDiv.style.visibility == "visible");
}

// -----------------------------------------------------------------------------
ActivityDialogObject.prototype.inUse = function()
{
	return this.isInUse;
}

// -----------------------------------------------------------------------------
ActivityDialogObject.prototype.reset = function()
{
	this.isInUse = false;
	this.method = null;
}

// -----------------------------------------------------------------------------
ActivityDialogObject.prototype.callback = function()
{
	if (!this.method)
		return;

	this.method.call();
}