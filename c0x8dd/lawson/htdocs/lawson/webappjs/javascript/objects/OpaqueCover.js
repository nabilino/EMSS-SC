/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/objects/OpaqueCover.js,v 1.6.2.4.2.4 2014/01/10 14:29:55 brentd Exp $ */
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
//-----------------------------------------------------------------------------
//
//	PARAMETERS:
//		wnd			(optional) the window to create the opaque div cover
//-----------------------------------------------------------------------------
function OpaqueCoverObject(wnd)
{
	// only allow one instance per file load
	if (OpaqueCoverObject._singleton)
		return OpaqueCoverObject._singleton;
	else
		OpaqueCoverObject._singleton = this;

	this.wnd = wnd || window;
	this.oDiv = null;
}
//-- static variables ---------------------------------------------------------
OpaqueCoverObject._singleton = null;
OpaqueCoverObject.BACKGROUND_COLOR = "#CCCCCC";
OpaqueCoverObject.OPACITY = 20;
//-----------------------------------------------------------------------------
OpaqueCoverObject.prototype.init = function(wnd)
{
	this.wnd = wnd || window;
	this.oDiv = null;	
}
//-----------------------------------------------------------------------------
OpaqueCoverObject.prototype.createCover = function()
{
	if (this.oDiv)
		return;

	if (this.wnd.document.getElementById("opaqueCoverDiv"))
	{
		this.oDiv = this.wnd.document.getElementById("opaqueCoverDiv");
		this.oDiv.style.height = SizerObject.getHeight(this.wnd) + "px";
		this.oDiv.style.width = SizerObject.getWidth(this.wnd) + "px";		
	}
	else
	{	
		this.oDiv = this.wnd.document.createElement("DIV");
		this.oDiv.id = "opaqueCoverDiv";
		this.oDiv.style.backgroundColor = OpaqueCoverObject.BACKGROUND_COLOR;
		this.oDiv.style.filter = "alpha(opacity=" + OpaqueCoverObject.OPACITY + ")";
		this.oDiv.style.mozOpacity = "." + OpaqueCoverObject.OPACITY;
		this.oDiv.style.opacity = "." + OpaqueCoverObject.OPACITY;
		this.oDiv.style.border = "0px";
		this.oDiv.style.cursor = "wait";
		this.oDiv.style.position = "absolute";
		this.oDiv.style.visibility = "hidden";
		this.oDiv.style.overflow = "hidden";
		this.oDiv.style.top = "0px";
		this.oDiv.style.left = "0px";
		this.oDiv.style.height = SizerObject.getHeight(this.wnd) + "px";
		this.oDiv.style.width = SizerObject.getWidth(this.wnd) + "px";
		this.oDiv.style.zIndex = "999";				
		this.wnd.document.body.appendChild(this.oDiv);
	}	
}
//-----------------------------------------------------------------------------
OpaqueCoverObject.prototype.showCover = function(iHtml, bgColor, opacity)
{
	if (!this.oDiv)
	{
		this.createCover();
	}	 	

	if (typeof(iHtml) == "string")
		this.oDiv.innerHTML = iHtml;

	if (bgColor)
		this.oDiv.style.backgroundColor = bgColor;

	if (typeof(opacity) == "number")
	{
		this.oDiv.style.filter = "alpha(opacity=" + opacity + ")";
		this.oDiv.style.mozOpacity = "." + opacity;
		this.oDiv.style.opacity = "." + opacity;
	}

	this.resizeCover();
	this.oDiv.style.visibility = "visible";

	// resize the opaque cover when the window is resized
	if (this.wnd.addEventListener)
		this.wnd.addEventListener("resize", OpaqueCoverObject.resizeHandler, false);
	else if (this.wnd.attachEvent)
		this.wnd.attachEvent("onresize", OpaqueCoverObject.resizeHandler);	
}
//-----------------------------------------------------------------------------
OpaqueCoverObject.prototype.hideCover = function()
{
	if (!this.oDiv)
		return;

	this.oDiv.style.visibility = "hidden";
	
	// remove resize events
	if (this.wnd.removeEventListener)
		this.wnd.removeEventListener("resize", OpaqueCoverObject.resizeHandler, false);
	else if (this.wnd.dettachEvent)
		this.wnd.attachEvent("onresize", OpaqueCoverObject.resizeHandler);	
}
//-----------------------------------------------------------------------------
OpaqueCoverObject.prototype.isCoverVisible = function()
{
	if (!this.oDiv)
		return false;

	return (this.oDiv.style.visibility == "visible");
}
//-----------------------------------------------------------------------------
OpaqueCoverObject.prototype.resizeCover = function()
{
	if (!this.oDiv)
		return false;

	this.oDiv.style.height = SizerObject.getHeight(this.wnd) + "px";
	this.oDiv.style.width = SizerObject.getWidth(this.wnd) + "px";
}
//-----------------------------------------------------------------------------
OpaqueCoverObject.resizeHandler = function()
{
	if (OpaqueCoverObject._singleton)
		OpaqueCoverObject._singleton.resizeCover();
}