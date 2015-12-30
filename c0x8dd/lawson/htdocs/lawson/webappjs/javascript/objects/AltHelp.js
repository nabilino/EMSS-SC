/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/objects/AltHelp.js,v 1.6.2.4.2.3 2014/01/10 14:29:55 brentd Exp $ */
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
//		none
//-----------------------------------------------------------------------------
//
//	PARAMETERS:
//		name		the javascript variable name of your object instance
//		wnd			(optional) the window to run althelp in
//-----------------------------------------------------------------------------
function AltHelpObject()
{
	// only allow one instance per file load
	if (AltHelpObject._singleton)
		return AltHelpObject._singleton;
	else
		AltHelpObject._singleton = this;

	// outer help div
	this.althelpOuter = window.document.createElement("DIV");
	this.althelpOuter.id = "althelpOuter";
	this.althelpOuter.style.position = "absolute";
	this.althelpOuter.style.backgroundColor = "#f2f2f2";
	this.althelpOuter.style.visibility = "hidden";
	this.althelpOuter.style.width = "auto";
	this.althelpOuter.style.height = "auto";
	this.althelpOuter.style.zIndex = "999";
	this.althelpOuter.style.padding = "4px";
	this.althelpOuter.style.margin = "0px";
	this.althelpOuter.style.border = "0px";
	this.althelpOuter.style.overflow = "hidden";
	this.althelpOuter.style.border = "1px solid #000000";
	window.document.body.appendChild(this.althelpOuter);

	// inner help div
	this.althelp = window.document.createElement("DIV");
	this.althelp.id = "althelpInner";
	this.althelp.style.position = "relative";
	this.althelp.style.backgroundColor = "transparent";
	this.althelp.style.color = "#000000";
	this.althelp.style.fontSize = "xx-small";
	this.althelp.style.fontFamily = "Helvetica, Arial, Sans-Serif";
	this.althelp.style.padding = "4px";
	this.althelpOuter.appendChild(this.althelp);

	// other
	this.althelpTimer = null;
}
//-- static variables ---------------------------------------------------------
AltHelpObject._singleton = null;
AltHelpObject.GRACE_TIME = 100;
AltHelpObject.WIDTH = 260;
AltHelpObject.HEIGHT = 50;
AltHelpObject.OPEN_LEFT = "left";
AltHelpObject.OPEN_RIGHT = "right";
AltHelpObject.OPEN_UP = "up";
AltHelpObject.OPEN_UP_LEFT = "upleft";
//-----------------------------------------------------------------------------
AltHelpObject.prototype.open = function(evt, str, direction, obj)
{
	if (!str)
		return;

	// check evt
	evt = evt || window.event;
	if (!evt)
		return;

	// default to right.
	if (!direction)
		direction = AltHelpObject.OPEN_RIGHT;

	this.althelp.innerHTML = str;
	this.althelpOuter.style.visibility = "visible";
	this.althelpOuter.style.height = "auto";
	this.althelpOuter.style.width = AltHelpObject.WIDTH + "px";

	// If the 'obj' param is passed in, the PositionObject will be used to position the althelp window based on the location of the passed in obj.
	if (obj)
		var posObj = new PositionObject(obj);


	switch (direction)
	{
		case AltHelpObject.OPEN_RIGHT:
			if (posObj) {
				this.althelpOuter.style.top = (posObj.thetop + 15) + "px";
				this.althelpOuter.style.left = (posObj.left + 20) + "px";
			}
			else {
			this.althelpOuter.style.top = (evt.clientY + window.document.body.scrollTop + 5) + "px";
			this.althelpOuter.style.left = (evt.clientX + window.document.body.scrollLeft + 10) + "px";
			}
			break;

		case AltHelpObject.OPEN_LEFT:
			this.althelpOuter.style.top = (evt.clientY + window.document.body.scrollTop + 5) + "px";
			this.althelpOuter.style.left = (evt.clientX - AltHelpObject.WIDTH + window.document.body.scrollLeft - 10) + "px";
			break;
			
		case AltHelpObject.OPEN_UP_LEFT:
			this.althelpOuter.style.top = (evt.clientY - AltHelpObject.HEIGHT - window.document.body.scrollTop - 10) + "px";//			;
			this.althelpOuter.style.left = (evt.clientX - AltHelpObject.WIDTH + window.document.body.scrollLeft - 10) + "px";
			break;
			
		case AltHelpObject.OPEN_UP:
			this.althelpOuter.style.top = (evt.clientY - AltHelpObject.HEIGHT - window.document.body.scrollTop - 10) + "px";
			this.althelpOuter.style.left = (evt.clientX + window.document.body.scrollLeft) + "px";
			break;
	}
}
//-----------------------------------------------------------------------------
AltHelpObject.prototype.setTimer = function()
{
	this.althelpTimer = setTimeout("AltHelpObject._singleton.close()", AltHelpObject.GRACE_TIME);
}
//-----------------------------------------------------------------------------
AltHelpObject.prototype.clearTimer = function()
{
	clearTimeout(this.althelpTimer);
	this.althelpTimer = null;
}
//-----------------------------------------------------------------------------
AltHelpObject.prototype.close = function()
{
	this.clearTimer();
	this.althelpOuter.style.visibility = "hidden";
}
