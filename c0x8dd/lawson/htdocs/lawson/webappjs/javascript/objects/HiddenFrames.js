/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/objects/HiddenFrames.js,v 1.5.2.3.2.2 2014/01/10 14:29:55 brentd Exp $ */
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
//		javascript/objects/Sizer.js
//-----------------------------------------------------------------------------
//
//	PARAMETERS:
//		hiddenFrameClassName	the class name assigned to your iframes to
//								make them hidden
//		mainWnd					(optional) reference to your products main window
//								(i.e. where your iframes exist)
//-----------------------------------------------------------------------------
function HiddenFramesObject(hiddenFrameClassName, mainWnd)
{
	this.frmAry = new Array();
	this.border = 3;
	this.size = 150;
	this.z = 5000;
	this.framesAlreadyShown = false;
	this.framesVisible = false;
	this.hiddenFrameClassName = hiddenFrameClassName;	
	this.mainWnd = (mainWnd) ? mainWnd : window;
	this.oldBodyOverflow = this.mainWnd.document.body.style.overflow;
}
//-----------------------------------------------------------------------------
HiddenFramesObject.prototype.buildFramesArray = function()
{
	this.frmAry = new Array();
	var iframes = this.mainWnd.document.getElementsByTagName("iframe");
	for (var i=0; i<iframes.length; i++)
		if (iframes[i].className == this.hiddenFrameClassName)
			this.frmAry[this.frmAry.length] = iframes[i].id;
}
//-----------------------------------------------------------------------------
HiddenFramesObject.prototype.configure = function()
{
	if (this.mainWnd.location.search.toLowerCase().indexOf("debug=true") != -1)
		this.toggle();
}
//-----------------------------------------------------------------------------
HiddenFramesObject.prototype.toggle = function()
{
	if (this.framesVisible)
		this.hideFrames();
	else
	{
		this.showFrames();
		this.moveFrames();
	}
}
//-----------------------------------------------------------------------------
HiddenFramesObject.prototype.showFrames = function()
{
	this.buildFramesArray();
	if (this.frmAry.length == 0)
		return;

	for (var i=0; i<this.frmAry.length; i++)
	{
		var frm = this.mainWnd.document.getElementById(this.frmAry[i]);
		if (frm == null)
			continue;

		if (!this.framesAlreadyShown)
		{
			var bg = "" + this.getRandomColor() + this.getRandomColor()
						+ this.getRandomColor() + this.getRandomColor()
						+ this.getRandomColor() + this.getRandomColor();
			var txt = this.fontBright(bg);
			frm.style.position = "absolute";
			frm.style.border = this.border + "px solid #" + bg;
		}
		frm.style.visibility = "visible";
		frm.style.display = "block";

		var labelDiv = this.mainWnd.document.getElementById("label_" + this.frmAry[i]);
		if (!labelDiv)
		{
			labelDiv = this.mainWnd.document.createElement("div");
			labelDiv.appendChild(this.mainWnd.document.createTextNode(this.frmAry[i]));
			labelDiv.id = "label_" + this.frmAry[i];
			labelDiv.style.position = "absolute";
			labelDiv.style.backgroundColor = bg;
			labelDiv.style.color = txt;
			labelDiv.style.textAlign = "center";
			labelDiv.style.fontSize = "10px";
			this.mainWnd.document.body.appendChild(labelDiv);
		}
		labelDiv.style.visibility = "visible";
		labelDiv.style.display = "block";
	}

	this.framesAlreadyShown = true;
	this.framesVisible = true;
	if (this.oldBodyOverflow != "auto")
		this.mainWnd.document.body.style.overflow = "auto";
}
//-----------------------------------------------------------------------------
HiddenFramesObject.prototype.hideFrames = function()
{
	if (this.frmAry.length == 0)
		return;

	for (var i=0; i<this.frmAry.length; i++)
	{
		var frm = this.mainWnd.document.getElementById(this.frmAry[i]);
		if (frm == null)
			continue;
	
		frm.style.visibility = "hidden";
		frm.style.display = "none";

		var labelDiv = this.mainWnd.document.getElementById("label_" + this.frmAry[i]);
		labelDiv.style.visibility = "hidden";
		labelDiv.style.display = "none";
	}

	this.framesVisible = false;
	if (this.oldBodyOverflow != this.mainWnd.document.body.style.overflow)
		this.mainWnd.document.body.style.overflow = this.oldBodyOverflow;
}
//-----------------------------------------------------------------------------
HiddenFramesObject.prototype.moveFrames = function()
{
	if (!this.framesVisible || this.frmAry.length == 0)
		return;

	var left = 0;
	var thetop = (SizerObject.getHeight(window) < SizerObject.MIN_SCREEN_HEIGHT)
			   ? SizerObject.MIN_SCREEN_HEIGHT + (this.border*15)
			   : SizerObject.getHeight() + (this.border*4);

	for (var i=0; i<this.frmAry.length; i++)
	{
		var frm = this.mainWnd.document.getElementById(this.frmAry[i]);
		if (frm == null)
			continue;
	
		frm.style.height = this.size + "px";
		frm.style.width = this.size + "px";
		frm.style.zIndex = this.z++;
		frm.style.left = left + "px";
		frm.style.top = thetop + "px";

		var labelDiv = this.mainWnd.document.getElementById("label_" + this.frmAry[i]);
		labelDiv.style.height = (this.border*3) + "px";
		labelDiv.style.width = (this.size + (this.border*2)) + "px";
		labelDiv.style.zIndex = this.z++;
		labelDiv.style.top = (parseInt(frm.style.top, 10) - parseInt(labelDiv.style.height, 10)) + "px";
		labelDiv.style.left = left + "px";

		left += this.size + (this.border*2);
		if ((left + this.size + (this.border*2)) > SizerObject.getWidth(window))
		{
			thetop += this.size + (this.border*5);
			left = 0;
		}
	}
}
//-----------------------------------------------------------------------------
HiddenFramesObject.prototype.getRandomColor = function()
{
	var nbr = Math.round(Math.random()*15);
	switch (nbr)
	{
		case 10:
			nbr = "A";
			break;
		case 11:
			nbr = "B";
			break;
		case 12:
			nbr = "C";
			break;
		case 13:
			nbr = "D";
			break;
		case 14:
			nbr = "E";
			break;
		case 15:
			nbr = "F";
			break;
	}
	return "" + nbr;
}
//-----------------------------------------------------------------------------
HiddenFramesObject.prototype.fontBright = function(color)
{
	var drd = parseInt(color.substring(0,2),16);
	var dgr = parseInt(color.substring(2,4),16);
	var dbl = parseInt(color.substring(4,6),16);
	var brightness = eval(0.212671 * drd + 0.715160 * dgr + 0.072169 * dbl);
	return (brightness >= 128) ? "#000000" : "#FFFFFF";
}
