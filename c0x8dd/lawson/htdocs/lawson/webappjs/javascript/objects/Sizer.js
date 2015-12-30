/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/objects/Sizer.js,v 1.13.2.4.2.2 2014/01/10 14:29:55 brentd Exp $ */
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
//		wnd						(optional) the window to get the objects to size
//		traceObj				(optional) reference to a traceObj
//-----------------------------------------------------------------------------
//-- start sizer collection object code
function SizerCollectionObject(wnd, traceObj)
{
	this.traceObj = (traceObj) ? traceObj : null;
  	this.sizerAry = new Array();
	this.wnd = (wnd) ? wnd : window;
	this.oldBodyOverflow = this.wnd.document.body.style.overflow;
}
//-----------------------------------------------------------------------------
SizerCollectionObject.prototype.addSizer = function(sizerObj)
{
	if (!sizerObj)
		return;

	// push a reference of the traceObj down to the sizer itself
	sizerObj.traceObj = this.traceObj;
	this.sizerAry[this.sizerAry.length] = sizerObj;
}
//-----------------------------------------------------------------------------
SizerCollectionObject.prototype.getSizer = function(sizerIdToGet)
{
	for (var i=0; i<this.sizerAry.length; i++)
		if (this.sizerAry[i].id == sizerIdToGet)
			return this.sizerAry[i];

	// didn't find it
	return null;
}
//-----------------------------------------------------------------------------
SizerCollectionObject.prototype.sizeAll = function()
{
 	for (var i=0; i<this.sizerAry.length; i++)
  		this.sizerAry[i].sizeIt();

	this.traceObjectSizes();

	if (!this.traceObj || !this.traceObj.isTraceOn)
	{
		// we will only size the screen so small, then turn on auto overflow
		if (this.oldBodyOverflow != "auto" &&
			(SizerObject.getWidth(this.wnd) < SizerObject.MIN_SCREEN_WIDTH
		  || SizerObject.getHeight(this.wnd) < SizerObject.MIN_SCREEN_HEIGHT))
		{
			this.wnd.document.body.style.overflow = "auto";
		}
		else if (this.wnd.document.body.style.overflow != this.oldBodyOverflow)
		{
			this.wnd.document.body.style.overflow = this.oldBodyOverflow;
		}
	}
}
//-----------------------------------------------------------------------------
SizerCollectionObject.prototype.traceObjectSizes = function()
{
	if (!this.traceObj || !this.traceObj.isTraceOn)
		return;

	var sizeMsg = "SizerObject.getWidth(wnd) = " + SizerObject.getWidth(this.wnd) + "\n"
				+ "SizerObject.getHeight(wnd) = " + SizerObject.getHeight(this.wnd) + "\n\n";

 	for (var i=0; i<this.sizerAry.length; i++)
	{
		var obj = this.sizerAry[i];
		if (!obj.doWidth && !obj.doHeight)
			continue;

		var styleMsg = "";
		if (obj.doWidth)
		{
			styleMsg += obj.id + ".borderObj.left =   \t" + obj.borderObj.left + "\n"
					 +  obj.id + ".borderObj.right =  \t" + obj.borderObj.right + "\n"
					 +  obj.id + ".paddingObj.left =  \t" + obj.paddingObj.left + "\n"
					 +  obj.id + ".paddingObj.right = \t" + obj.paddingObj.right + "\n"
					 +  obj.id + ".subWidth =         \t" + obj.subWidth + "\n";

			sizeMsg += obj.id + ".width = " + obj.currentWidth + "\n";
		}

		if (obj.doHeight)
		{
			styleMsg += obj.id + ".borderObj.top =    \t" + obj.borderObj.top + "\n"
					 +  obj.id + ".borderObj.bottom = \t" + obj.borderObj.bottom + "\n"
					 +  obj.id + ".paddingObj.top =   \t" + obj.paddingObj.top + "\n"
					 +  obj.id + ".paddingObj.bottom =\t" + obj.paddingObj.bottom + "\n"
					 +  obj.id + ".subHeight =        \t" + obj.subHeight + "\n";

			sizeMsg += obj.id + ".height = " + obj.currentHeight + "\n";
		}
		this.traceObj.dump("Sizer Object - " + obj.id, styleMsg);
	}
	this.traceObj.dump("Sizer Collection - Current Sizes", sizeMsg);
}
//-- end sizer collection object code
//-----------------------------------------------------------------------------


//-----------------------------------------------------------------------------
//
//	PARAMETERS:
//		id						id of the object to size
//		parentSizerObject		(optional) size relative to this object
//		maxWidth				(optional) max width to size
//		maxHeight				(optional) max height to size
//		wnd						(optional) wnd where the objects live
//-----------------------------------------------------------------------------
//-- start sizer object code
function SizerObject(id, parentSizerObject, maxWidth, maxHeight, wnd)
{
 	this.id = id;
	this.isActive = true;
	this.wnd = (wnd) ? wnd : window;
 	this.obj = this.wnd.document.getElementById(this.id);
 	this.parentSizerObject = parentSizerObject;
 	this.currentWidth = 0;
 	this.currentHeight = 0;
 	this.widthOffset = 0;
 	this.heightOffset = 0;
 	this.doWidth = true;
 	this.doHeight = true;
	this.traceObj = null;

	// MIN/MAX WIDTH
 	this.minWidth = 0;
	if (maxWidth == null || maxWidth == "")
		maxWidth = "100%";
	this.isMaxWidthPercent = (typeof(maxWidth) == "string" && maxWidth.indexOf("%") != -1);
 	this.maxWidth = parseInt(maxWidth, 10);

	// MIN/MAX HEIGHT
 	this.minHeight = 0;
	if (maxHeight == null || maxHeight == "")
		maxHeight = "100%";
	this.isMaxHeightPercent = (typeof(maxHeight) == "string" && maxHeight.indexOf("%") != -1);
 	this.maxHeight = parseInt(maxHeight, 10);

	// styles stuff
	this.styleObj = null;
	this.borderObj = new Object();
	this.paddingObj = new Object();
	this.subWidth = 0;
	this.subHeight = 0;
}
//-- static variables ---------------------------------------------------------
SizerObject.MIN_SCREEN_WIDTH = 450;
SizerObject.MIN_SCREEN_HEIGHT = 0;
//-- static methods -----------------------------------------------------------
SizerObject.getInstance = function(id, parentSizerObject, maxWidth, maxHeight, wnd)
{
	return new SizerObject(id, parentSizerObject, maxWidth, maxHeight, wnd);
}
//-----------------------------------------------------------------------------
SizerObject.isBrowserIE = function()
{
	return (navigator.appName == "Microsoft Internet Explorer") ? true : false;
}
//-----------------------------------------------------------------------------
SizerObject.getHeight = function(wnd)
{
	if (!wnd)
		wnd = window;

	// NOTE
	// IE doesn't support innerHeight, but all others do
	// IE 6 Strict Mode uses documentElement, and other IE's use body
	if (wnd.self.innerHeight)
		return wnd.self.innerHeight;
	else if (wnd.document.documentElement && wnd.document.documentElement.clientHeight)
		return wnd.document.documentElement.clientHeight;
 	else if (wnd.document.body)
		return wnd.document.body.clientHeight;
}
//-----------------------------------------------------------------------------
SizerObject.getWidth = function(wnd)
{
	if (!wnd)
		wnd = window;

	// NOTE
	// IE doesn't support innerWidth, but all others do
	// IE 6 Strict Mode uses documentElement, and other IE's use body
	if (wnd.self.innerWidth)
		return wnd.self.innerWidth;
	else if (wnd.document.documentElement && wnd.document.documentElement.clientWidth)
		return wnd.document.documentElement.clientWidth;
 	else if (wnd.document.body)
		return wnd.document.body.clientWidth;
}
//-- member methods -----------------------------------------------------------
SizerObject.prototype.calculateStyles = function()
{
	// STYLES ALREADY CALCULATED
	if (this.styleObj)
		return;

	// STYLE OBJECT
 	this.styleObj = (this.wnd.getComputedStyle)
 			? this.wnd.getComputedStyle(this.obj, null)
 			: this.obj.currentStyle;

	// BORDER OBJECT
	this.borderObj.left = this.styleObj.borderLeftWidth;
	this.borderObj.top = this.styleObj.borderTopWidth;
	this.borderObj.bottom = this.styleObj.borderBottomWidth;
	this.borderObj.right = this.styleObj.borderRightWidth;

	// PADDING OBJECT
	this.paddingObj.left = this.styleObj.paddingLeft;
	this.paddingObj.top = this.styleObj.paddingTop;
	this.paddingObj.bottom = this.styleObj.paddingBottom;
	this.paddingObj.right = this.styleObj.paddingRight;

	// SUBWIDTH
	this.subWidth = parseInt(this.borderObj.left, 10)  + parseInt(this.borderObj.right, 10)
				  + parseInt(this.paddingObj.left, 10) + parseInt(this.paddingObj.right, 10);

	// IE defaults to "medium" for border/padding, this prevents JS errors
	if (isNaN(this.subWidth))
	{
		if (this.traceObj && this.traceObj.isTraceOn)
		{
			var msg = "'" + this.id + "' needs explicit styling to prevent 'medium'\n\n"
					+ this.id + ".borderObj.left = " + this.borderObj.left + "\n"
					+ this.id + ".borderObj.right = " + this.borderObj.right + "\n"
					+ this.id + ".paddingObj.left = " + this.paddingObj.left + "\n"
					+ this.id + ".paddingObj.right = " + this.paddingObj.right + "\n";
			this.traceObj.dump("SIZER WARNING", msg);
		}
		this.subWidth = 0;
	}

	// SUBHEIGHT
	this.subHeight = parseInt(this.borderObj.top, 10)  + parseInt(this.borderObj.bottom, 10)
				   + parseInt(this.paddingObj.top, 10) + parseInt(this.paddingObj.bottom, 10);

	// IE defaults to "medium" for border/padding, this prevents JS errors
	if (isNaN(this.subHeight))
	{
		if (this.traceObj && this.traceObj.isTraceOn)
		{
			var msg = "'" + this.id + "' needs explicit styling to prevent 'medium'\n\n"
					+ this.id + ".borderObj.top = " + this.borderObj.top + "\n"
					+ this.id + ".borderObj.bottom = " + this.borderObj.bottom + "\n"
					+ this.id + ".paddingObj.top = " + this.paddingObj.top + "\n"
					+ this.id + ".paddingObj.bottom = " + this.paddingObj.bottom + "\n";
			this.traceObj.dump("SIZER WARNING", msg);
		}
		this.subHeight = 0;
	}
}
//-----------------------------------------------------------------------------
SizerObject.prototype.sizeIt = function()
{
	if (!this.isActive)
		return;
	if (!this.obj)
		return;

	this.calculateStyles();
	this.setWidth();
	this.setHeight();
}
//-----------------------------------------------------------------------------
SizerObject.prototype.setWidth = function()
{
	if (!this.doWidth)
		return;

 	var parentWidth = this.getParentWidth();
 	var newWidth;
 	if (this.isMaxWidthPercent)
 		newWidth = Math.floor(parentWidth * (this.maxWidth/100));
 	else
		newWidth = (parentWidth > this.maxWidth) ? this.maxWidth : parentWidth;

	newWidth = newWidth - (SizerObject.isBrowserIE()?this.getParentSubWidth():this.subWidth) - this.widthOffset;

	if (newWidth < this.minWidth)
		newWidth = this.minWidth;

	this.obj.style.width = newWidth + "px";
	this.currentWidth = newWidth + "px";
}
//-----------------------------------------------------------------------------
SizerObject.prototype.setHeight = function()
{
	if (!this.doHeight)
		return;

 	var parentHeight = this.getParentHeight();
 	var newHeight;
 	if (this.isMaxHeightPercent)
 		newHeight = Math.floor(parentHeight * (this.maxHeight/100));
 	else
		newHeight = (parentHeight > this.maxHeight) ? this.maxHeight : parentHeight;

	newHeight = newHeight - (SizerObject.isBrowserIE()?this.getParentSubHeight():this.subHeight) - this.heightOffset;

	if (newHeight < this.minHeight)
		newHeight = this.minHeight;

	this.obj.style.height = newHeight + "px";
	this.currentHeight = newHeight + "px";
}
//-----------------------------------------------------------------------------
SizerObject.prototype.getParentWidth = function()
{
	// is there a parent sizer?
	if (this.parentSizerObject)
		return parseInt(this.parentSizerObject.currentWidth, 10);

	// sizing to the screen now
	var screenWidth = SizerObject.getWidth(this.wnd);
	if (screenWidth < SizerObject.MIN_SCREEN_WIDTH)
		return SizerObject.MIN_SCREEN_WIDTH;
	else
		return screenWidth;
}
//-----------------------------------------------------------------------------
SizerObject.prototype.getParentHeight = function()
{
	// is there a parent sizer?
	if (this.parentSizerObject)
		return parseInt(this.parentSizerObject.currentHeight, 10);

	// sizing to the screen now
	var screenHeight = SizerObject.getHeight(this.wnd);
	if (screenHeight < SizerObject.MIN_SCREEN_HEIGHT)
		return SizerObject.MIN_SCREEN_HEIGHT;
	else
		return screenHeight;
}
//-----------------------------------------------------------------------------
SizerObject.prototype.getParentSubWidth = function()
{
	return (this.parentSizerObject != null)
			? this.parentSizerObject.subWidth
			: 0;
}
//-----------------------------------------------------------------------------
SizerObject.prototype.getParentSubHeight = function()
{
	return (this.parentSizerObject != null)
			? this.parentSizerObject.subHeight
			: 0;
}
//-- end sizer object code
//-----------------------------------------------------------------------------


//-----------------------------------------------------------------------------
//-- start Position object code
function PositionObject(obj, traceObj)
{
	this.id = obj.id;
	this.obj = obj;
	this.thetop = 0;	// top is a reserved word
	this.left = 0;
	this.bottom = 0;
	this.right = 0;
	this.width = 0;
	this.height = 0;

	this.traceObj = traceObj || null;

	// ****	this method will need to be called again if
	//		the page shifts or is resized in any way!
	this.getCurrentPosition();
}
//-- static method ------------------------------------------------------------
PositionObject.getInstance = function(obj, traceObj)
{
	return new PositionObject(obj, traceObj);
}
//-----------------------------------------------------------------------------
PositionObject.prototype.getCurrentPosition = function()
{
	if (typeof(this.obj.offsetParent) != "object")
		return;

	var tempObj = this.obj;
    var tempDoc = null;
        
    if (tempObj.ownerDocument)
    {
    	tempDoc = tempObj.ownerDocument;
    }
    else if (tempObj.document)
	{
    	tempDoc = tempObj.document;
	}
    // modern Gecko-based browsers
    if (navigator.appName == "Netscape" && tempObj.getBoundingClientRect) 
    {
    	var rect = tempObj.getBoundingClientRect();
        this.left = rect.left;    
    	this.thetop = rect.top;
    }	
	// older Gecko-based browsers
    else if (tempDoc != null && tempDoc.getBoxObjectFor)
	{	
  		var box = tempDoc.getBoxObjectFor(tempObj);
  		var vpBox = tempDoc.getBoxObjectFor(tempDoc.documentElement);
  		this.left = box.screenX - vpBox.screenX;
  		this.thetop = box.screenY - vpBox.screenY;    		
	}
	// IE
	else if (tempObj.offsetParent)
	{	  	
		var htmlObjs = (tempDoc != null) ? tempDoc.getElementsByTagName("html") : null;
		var dir = (htmlObjs != null && htmlObjs.length > 0) ? htmlObjs[0].getAttribute("dir") : "ltr";
		do
		{
			if (tempDoc != null && tempObj != tempDoc.body && tempObj != tempDoc.documentElement)
			{
				this.thetop += tempObj.offsetTop + tempObj.clientTop;
				this.left += tempObj.offsetLeft + tempObj.clientLeft;
			}
			else    
			{
				this.thetop += tempObj.offsetTop;    
				this.left += tempObj.offsetLeft;
			}
			
        	// account for the scroll positions for everything but the body element
        	if (tempDoc != null && tempObj != tempDoc.body && tempObj != tempDoc.documentElement)
        	{	
				this.thetop -= tempObj.scrollTop;
				this.left -= tempObj.scrollLeft;   
				var objWidth = (tempObj.clientWidth) ? tempObj.clientWidth : tempObj.offsetWidth;
        		if (dir == "rtl" && tempObj.scrollWidth && objWidth && ((tempObj.scrollWidth - objWidth) > 0))
        		{
					this.left += (tempObj.scrollWidth - objWidth);
        		}
				// get scroll offsets for standards mode
				if (tempDoc.documentMode >= 8)
				{
					var parObj = tempObj.parentNode;
					while (tempObj.offsetParent != parObj && parObj !== null) 
					{
						this.thetop -= parObj.scrollTop;
						this.left -= parObj.scrollLeft;
						var parWidth = (parObj.clientWidth) ? parObj.clientWidth : parObj.offsetWidth;
						if (dir == "rtl" && parObj.scrollWidth && parWidth && ((parObj.scrollWidth - parWidth) > 0))
						{
							this.left += (parObj.scrollWidth - parWidth);
						}
						parObj = parObj.parentNode;
					}				
				}
			}        	
			tempObj = tempObj.offsetParent;
        }
        while (tempObj);       	
    }		
	
	this.bottom = this.thetop + this.obj.offsetHeight;
	this.right = this.left + this.obj.offsetWidth;
	this.width = this.obj.offsetWidth;
	this.height = this.obj.offsetHeight;

	if (this.traceObj && this.traceObj.isTraceOn)
	{
		this.traceObj.dump("Current position of " + this.id,
							this.id + ".thetop = " + this.thetop + "\n"
						  + this.id + ".left = " + this.left + "\n"
						  + this.id + ".bottom = " + this.bottom + "\n"
						  + this.id + ".right = " + this.right + "\n"
						  + this.id + ".width = " + this.width + "\n"
						  + this.id + ".height = " + this.height + "\n");
	}
}
//-- end Position object code
//-----------------------------------------------------------------------------
