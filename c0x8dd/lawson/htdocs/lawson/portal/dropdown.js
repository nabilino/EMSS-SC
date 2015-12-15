/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/dropdown.js,v 1.24.2.10.4.8.8.1.2.12 2012/08/08 12:37:20 jomeli Exp $ */
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

var dropDiv = null;
var dropObj = null;
var oDropCal = null;
var scrollDown = 0;
var theCalDocument = "";
var g_dI = -1;
var g_mI = -1;
var g_yI = -1;
var rgMN = new Array(12);
var rgWK = new Array(7);

//-----------------------------------------------------------------------------
function Dropdown(portalWnd)
{
	this.type = null;		// selected value to display in list
	this.obj = null;	  	// values/information for selection to pass
	this.callback = null;	// function to return to
	this.frame = null;	  	// html element used to position dropdown object
	this.mouseX = null;		// mouseX of original click event
	this.mouseY = null;		// mouseY of original click event
	this.clickCount = 0;
	this.focusCount = 0;
	this.scrolling = false; //to enable scrolling on mousedown event 'dragging'
	this.items = new Object();
	this.portalWnd = (typeof(portalWnd) == "undefined" 
		? envFindObjectWindow("lawsonPortal")
		: portalWnd);
	this.portal = this.portalWnd.lawsonPortal;
	this.isIE = this.portal.browser.isIE;
	this.isVisible = false;
	this.dropDownClick = 0;
}
//-----------------------------------------------------------------------------
Dropdown.prototype.addItem = function(id, listObj)
{
	// The id is not necessarily unique, but listObj should be unique.
	var o = new Object();
	o.id = id;
	o.obj = listObj;
	this.items[listObj] = o;
}
//-----------------------------------------------------------------------------
Dropdown.prototype.clearItems = function()
{
	this.items = new Object();
}
//-----------------------------------------------------------------------------
Dropdown.prototype.getMove = function()
{
	var s = dropDiv.componentFromPoint(event.clientX, event.clientY);
	dropDiv.doScroll(s);
}
//-----------------------------------------------------------------------------
Dropdown.prototype.getScroll = function(s)
{
	if (s == "scrollbarVThumb")
		dropDiv.attachEvent("onmousemove", this.getMove);
	else
	{
		dropDiv.detachEvent("onmousemove", this.getMove);
		dropDiv.doScroll(s);
	}
}
//-----------------------------------------------------------------------------
Dropdown.prototype.getScrollClick = function()
{
	// possible values: http://msdn.microsoft.com/library/default.asp?url=/workshop/browser/mshtml/reference/ifaces/element2/doscroll.asp
	var s = dropDiv.componentFromPoint(event.clientX,event.clientY)
	dropObj.getScroll(s)
}
//-----------------------------------------------------------------------------
Dropdown.prototype.hide = function()
{
	this.isVisible = false;
	
	if (dropDiv)
	{
		dropDiv.parentNode.removeChild(dropDiv);
		this.dropDownClick = 0;
		dropDiv = null;
	}
}
//-----------------------------------------------------------------------------
Dropdown.prototype.getNextIconWidth = function()
{
	// finds the width of icon following a textbox
	var iconWidth = 0;
	var nextObj = this.obj.nextSibling;
	if (nextObj && (this.obj.getAttribute("hsel") == 1 
		|| this.obj.getAttribute("tp") == "select" 
		|| this.obj.getAttribute("edit") == "date"))
	{
		if ((nextObj.id.indexOf(this.obj.id) != - 1))
			iconWidth = nextObj.width ? nextObj.width : 12;				
	}
	return iconWidth;
}
//-----------------------------------------------------------------------------
Dropdown.prototype.isCalendar = function()
{
	return (typeof(this.type) != "string");
}
//-----------------------------------------------------------------------------
Dropdown.prototype.winFocus = function(e)
{
	if (!dropDiv)
		return;

	// this event gets fired several times, one of the first two is the one we want... netcrap
	if (!dropObj.isIE && e.type == "focus" && ++dropObj.focusCount < 2)
		return;

	dropObj.hide();
	eval(dropObj.callback + "()");
	dropObj.release();
}
//-----------------------------------------------------------------------------
Dropdown.prototype.noContextMenu = function(e)
{
	if (!dropDiv)
		return;

	dropObj.hide();
	eval(dropObj.callback + "()");
	dropObj.release();
}
//-----------------------------------------------------------------------------
Dropdown.prototype.release = function()
{
	if (dropObj.isIE)
		document.releaseCapture();
	else
	{
		window.onfocus = null;
		window.onclick = "";
		window.releaseEvents(Event.CLICK);
		dropObj.portalWnd.onclick = "";
		dropObj.portalWnd.releaseEvents(Event.CLICK);
	}
}
//-----------------------------------------------------------------------------
Dropdown.prototype.releaseScrollClick = function()
{
	dropDiv.detachEvent("onmousemove", dropObj.getMove)
}
//-----------------------------------------------------------------------------
Dropdown.prototype.show = function(type, obj, callback, frame, mouseX, mouseY)
{
	this.type = type;
	this.obj = obj;
	this.callback = callback;
	this.frame = frame;
	this.mouseX = mouseX;
	this.mouseY = mouseY;
	this.clickCount = 0;
	this.focusCount = 0;
	this.isVisible = true;

	window.dropObj = this;

	if (this.isCalendar())
		this.calenInit();
	else if (dropDiv)
		{
			dropObj.hide();
			eval(dropObj.callback + "()");
			dropObj.release();
		}
	else
		this.menuInit();
}
// Dropdown/Context menu methods
//-----------------------------------------------------------------------------
Dropdown.prototype.menuClick = function(evt)
{
	if (dropObj.isIE)
		evt = window.event;

	var elem;
	var oTmp = this;

	var offsetTop = 0;
	var mainDiv = document.getElementById("mainDiv");
	
	var scrollLeft = 0;
	var scrollTop = 0;
	
	// calculate scrolled widths
	while (oTmp.offsetParent)
	{
		scrollLeft += parseInt(oTmp.scrollLeft);
		scrollTop += parseInt(oTmp.scrollTop);
		oTmp = oTmp.offsetParent;
	}
	
	
	if (!mainDiv){
		//if not part of an app form ignore all scrollTop's, follow body instead
		scrollTop = document.body.scrollTop;
	}
	else {
		// adjust top because of changes in menuInit
		offsetTop = mainDiv.offsetTop;
	}
		
		
	
	var xLeft = evt.clientX + scrollLeft;
	var yTop = evt.clientY + scrollTop - offsetTop;
	var leftWidth = dropDiv.offsetLeft + dropDiv.offsetWidth;
	var topHeight = dropDiv.offsetTop + dropDiv.offsetHeight;	
	
	
	// check to see if clicked in scrollbar
	if (dropObj.isIE)
	{
		elem = evt.srcElement;
		if (dropDiv.style.overflowY == "scroll")
		{
			// vertical scrollbar; move the entries
			if (xLeft > leftWidth - 16 && xLeft < leftWidth
				&& yTop > dropDiv.offsetTop && yTop < topHeight)
			{
				dropObj.getScrollClick();
				dropObj.releaseScrollClick();
				return false;
			}
		}
	}
	else
	{
		// Netscape seems to require this
		if (++dropObj.clickCount == 1)
			return;
		if (dropDiv == null)
			return;
		elem = evt.target;
	}

	// check to see if clicked outside of dropdown
	if (xLeft < dropDiv.offsetLeft || xLeft > leftWidth
		|| yTop < dropDiv.offsetTop || yTop > topHeight)
	{
		dropObj.hide();
		eval(dropObj.callback + "()");
		dropObj.release();
	}
	// since capture is on dropDiv, need to process click event for button here
	else if (dropObj.isIE && elem.tagName == "BUTTON")
		dropObj.menuVal(elem);
}
//-----------------------------------------------------------------------------
Dropdown.prototype.menuDown = function(elem, increment)
{
	//increment: 1 by default
	var index = parseInt(elem.getAttribute("index"), 10);
	var menuTable = document.getElementById("menuTab");
	var buttons = menuTable.getElementsByTagName("BUTTON");
	var len = buttons.length-1;
	increment = (increment != null) ? increment : 1;
	var row = (index + increment > len) 
			? len 
			: index + increment; 
	dropObj.menuHighlight(buttons[row]);
}
//-----------------------------------------------------------------------------
Dropdown.prototype.menuEnd = function()
{
	var menuTable = document.getElementById("menuTab");
	var buttons = menuTable.getElementsByTagName("BUTTON");
	var len = buttons.length-1;
	dropObj.menuHighlight(buttons[len]);
}
//-----------------------------------------------------------------------------
Dropdown.prototype.menuHighlight = function(btnElem)
{
	var menuTable = document.getElementById("menuTab");
	var elements = menuTable.getElementsByTagName("TD");
	var len = elements.length;

	// detect if the highlighted item is already correct
	if (btnElem.className.indexOf("contextItemHighlight") == 0)
		return;

	// change background on all table cells
	for (var i=0; i<len; i++)
		elements[i].className = "contextRow";

	// set active table cell background color
	var elemId = btnElem.id.replace("ddContextItem", "ddContextRow");
	var elem = document.getElementById(elemId);
	elem.className = "contextRowHighlight";
	
	elements = menuTable.getElementsByTagName("BUTTON");
	len = elements.length;

	// change button text color on all buttons
	var browser = (dropObj.isIE) ? "IE" : "NS";
	for (var i=0; i<len; i++)
		elements[i].className = "contextItem" + browser;

	// set active button text color
	btnElem.className = "contextItemHighlight" + browser;
	if (!dropObj.isIE)
		window.onfocus = null;
	btnElem.focus();
	if (!dropObj.isIE)
		window.onfocus = this.winFocus;
}
//-----------------------------------------------------------------------------
Dropdown.prototype.menuHome = function()
{
	var menuTable = document.getElementById("menuTab");
	var buttons = menuTable.getElementsByTagName("BUTTON");
	dropObj.menuHighlight(buttons[0]);
}
//-----------------------------------------------------------------------------
Dropdown.prototype.menuInit = function()
{
	var index = -1;
	var dropTable = new dropObj.portalWnd.StringBuilder();
	var browser = (dropObj.isIE) ? "IE" : "NS";

	dropDiv = document.createElement("div");
	dropDiv.id = "divCal";
	dropDiv.className = "contextMenuContainer";

	if (dropObj.isIE)
		dropDiv.onmousemove = dropObj.menuMouseMove;
		
	if (window.document.getElementById("mainDiv"))
		window.document.getElementById("mainDiv").appendChild(dropDiv);
	else
		window.document.body.appendChild(dropDiv);

	for (listObj in this.items)
	{
		if ((this.items[listObj] == null) || (this.items[listObj].id == null))
			continue;

		dropTable.append("<tr><td id=\"ddContextRow" + ++index + "\"" 
			+ " class=\"contextRow\" align=\"left\"");

		dropTable.append("><button id=\"ddContextItem" + index + "\""
			+ " hideFocus onclick=\"dropObj.menuVal(this)\""
			+ " index=\"" + index + "\"");

		dropTable.append(" class=\"contextItem" + browser + "\"");

		if (!dropObj.isIE)
			dropTable.append(" onmousemove=\"dropObj.menuHighlight(this)\"");

		// Netscape doesn't like the obj expando property, so it uses the value property
		// IE truncates the value propery on the | char, so it uses the obj expando property
		dropTable.append(" obj=\"" + this.items[listObj].obj + "\" " 
			+ "value=\"" + this.items[listObj].obj + "\">" 
			+ this.items[listObj].id + "</button></td></tr>");
	}

	dropDiv.innerHTML = "<table id=\"menuTab\" border=\"0\" cellpadding=\"0\" cellspacing=\"2\""
		+ " class=\"contextMenu\"><tbody>" + dropTable.toString() + "</tbody></table>";

	var menuTable = document.getElementById("menuTab");
	var oTmp = this.obj;
	var tp = 0;
	var lft = 0;

	var topScroll = 0;
	var leftScroll = 0;

	while (oTmp.offsetParent && oTmp.id != "mainDiv")
	{
		tp += parseInt(oTmp.offsetTop);
		lft += parseInt(oTmp.offsetLeft);
		topScroll += parseInt(oTmp.scrollTop);
		leftScroll += parseInt(oTmp.scrollLeft);
		oTmp = oTmp.offsetParent;
	}

	if (typeof(this.mouseX) != "undefined")
	{
		tp = this.mouseY;
		lft = this.mouseX;
	}

	dropDiv.style.top = tp + this.obj.offsetHeight;
	dropDiv.style.left = lft;
	dropDiv.style.height = menuTable.offsetHeight;
	dropDiv.style.width = menuTable.offsetWidth;
	
	var formDiv = document.getElementById("formDiv");
	var formScrollDown = (formDiv ? formDiv.scrollTop : 0);
	var horzBarSize = (leftScroll > 0) ? 16 : 0;
	var vertBarSize = (topScroll > 0) ? 16 : 0;
	
	if (dropObj.isIE)
	{
		var win = (dropObj.frame) ? dropObj.frame : document.body;
		var bodyTop = win.offsetTop;
		var bodyHeight = win.offsetHeight - dropObj.obj.offsetHeight;
		var bodyWidth = win.offsetWidth;
		var scrollDown = win.scrollTop + topScroll;
		var scrollLeft = win.scrollLeft + leftScroll;
	}
	else
	{
		var bodyTop = dropObj.portal.contentFrame.offsetTop;
		var bodyHeight = dropObj.portal.contentFrame.offsetHeight - 24;
		var bodyWidth = dropObj.portal.contentFrame.offsetWidth;
		var scrollDown = window.scrollY + formScrollDown;
	}
		
	// add scrollbar
	if (menuTable.offsetHeight > 240)
	{
		if (dropObj.isIE)
		{
			dropDiv.style.overflowX = "hidden";
			dropDiv.style.overflowY = "scroll";
		}
		else
			dropDiv.style.overflow = "auto";

		dropDiv.style.height = 177;
		dropDiv.style.width = parseInt(menuTable.offsetWidth) + 16;
	}

	var bottom = tp - scrollDown + parseInt(dropDiv.style.height);
	if (bodyHeight - horzBarSize > bottom)
	{
		// default postion: just below field
		if (typeof(this.mouseX) == "undefined")
			tp = tp + dropObj.obj.offsetHeight;
	}
	else if ((tp - scrollDown - dropDiv.offsetHeight) >= 0)
	{
		// didn't fit below: position above field
		if ((tp - dropDiv.offsetHeight) > scrollDown)
			tp = tp - dropDiv.offsetHeight + 3;
		else
			tp = tp - dropDiv.offsetHeight;
	}
	else if (lft + dropObj.obj.offsetWidth + dropDiv.offsetWidth - scrollLeft < bodyWidth)
	{
		// didn't fit above or below: position at top of screen to right of field
		var iconWidth = dropObj.getNextIconWidth();
		lft = lft + dropObj.obj.offsetWidth + iconWidth;
		tp = scrollDown;
	}
	else
		tp = scrollDown;

	// determine if the proposed left position will overflow right edge.
	if ((lft - scrollLeft + dropDiv.offsetWidth + 4) > bodyWidth - vertBarSize)
	{
		// set left to 1 if the menu fills the window, otherwise set it to align with right edge.
		if ((dropDiv.offsetWidth + 3) > bodyWidth)
			lft = 1 + scrollLeft;
		else
			lft = bodyWidth + scrollLeft - vertBarSize - dropDiv.offsetWidth - 3;
	}

	dropDiv.style.top = tp;
	dropDiv.style.left = lft;
	dropDiv.style.visibility = "visible";
	dropObj.menuSetHighlight();

	if (dropObj.isIE)
	{
		//setCapture and componentFromPoint is not functioning properly when inside an iframe.
		//work-around by removing setCapture when in forms, and simulate clicking outside by putting
		//onclick on body of form then.
		if (this.callback != "lawformDropSel")
		{
			dropDiv.onclick = dropObj.menuClick;
			//dropDiv.onmousedown = dropObj.menuMouseDown; //remove mousedown and mouseup events
			//dropDiv.onmouseup = dropObj.menuMouseUp;
			// setCapture is needed to capture the click outside of the dropdown
			dropDiv.setCapture();
		}
		window.onblur = this.noContextMenu;
	}
	else
	{
		window.onclick = dropObj.menuClick;
		window.captureEvents(Event.CLICK);
		dropObj.portalWnd.captureEvents(Event.CLICK);
		dropObj.portalWnd.onclick = dropObj.menuClick;
		window.onfocus = this.winFocus;
	}

	dropDiv.oncontextmenu = dropObj.noContextMenu;
	dropDiv.onkeydown = dropObj.menuKeyDown;
}

//-----------------------------------------------------------------------------
Dropdown.prototype.menuMouseDown = function(evt)
{
	dropObj.scrolling = true;
}

Dropdown.prototype.menuMouseUp = function(evt)
{
	dropObj.scrolling = false;
}

//-----------------------------------------------------------------------------
Dropdown.prototype.menuKeyDown = function(evt)
{
	if (dropObj.isIE)
		evt = window.event;

	var elem = dropObj.portalWnd.getEventElement(evt);
	var vis = (dropDiv.style.visibility == "visible");

	if (vis)
	{
		switch (evt.keyCode)
		{
			// enter
			case 13:
				dropObj.menuVal(elem);
				break;

			// escape
			case 27:
				dropObj.hide();
				eval(dropObj.callback + "()");
				dropObj.release();
				break;

			// page up
			case 33:
				dropObj.menuUp(elem, 8);
				break;

			// page down
			case 34:
				dropObj.menuDown(elem, 8);
				break;

			// end
			case 35:
				dropObj.menuEnd();
				break;

			// home
			case 36:
				dropObj.menuHome();
				break;

			//up arrow
			case 38:
				dropObj.menuUp(elem);
				break;

			//down arrow
			case 40:
				dropObj.menuDown(elem);
				break;
		}
	}
	dropObj.portalWnd.setEventCancel(evt);
	return true;
}



//-----------------------------------------------------------------------------
Dropdown.prototype.menuMouseMove = function()
{
	if (dropObj.isIE)
	{
		var evt = window.event;
		if (evt.srcElement.id.indexOf("ddContextItem") > -1)
		{
			dropObj.menuHighlight(evt.srcElement);
			return true;
		}
	}
	return false;
}
//-----------------------------------------------------------------------------
Dropdown.prototype.menuSetHighlight = function()
{
	var menuTable = document.getElementById("menuTab");
	var buttons = menuTable.getElementsByTagName("BUTTON");
	var len = buttons.length;
	if (!len) return;

	if (dropObj.type && dropObj.type.length > 0)
	{
		for (var i=0; i<len; i++)
		{
			var select = (dropObj.isIE) ? buttons[i].obj : buttons[i].value;
			if (dropObj.type == select)
			{
				buttons[i].focus();
				dropObj.menuHighlight(buttons[i]);
				return;
				break;
			}
		}
	}

	buttons[0].focus();
	dropObj.menuHighlight(buttons[0]);
}
//-----------------------------------------------------------------------------
Dropdown.prototype.menuUp = function(elem, increment)
{
	//increment: 1 by default
	var index = parseInt(elem.getAttribute("index"), 10);
	var menuTable = document.getElementById("menuTab");
	var buttons = menuTable.getElementsByTagName("BUTTON");
	var len = buttons.length-1;
	increment = (increment != null) ? increment : 1;
	var row = (index - increment < 0) 
			? 0 
			: index - increment; 
	dropObj.menuHighlight(buttons[row]);
}
//-----------------------------------------------------------------------------
Dropdown.prototype.menuVal = function(elem)
{
	var select = (dropObj.isIE) ? elem.obj : elem.value;
	dropObj.hide();
	dropObj.release();
	window.setTimeout(dropObj.callback + "(\"" + select + "\")" ,100);
}
// Calendar methods
//-----------------------------------------------------------------------------
// handle calendar 'navigation'
Dropdown.prototype.calMouseMove=function(evt)
{
	var evnt=null;
	var srcElem=null;
	if (dropObj.portalWnd.lawsonPortal.browser.isIE)
	{
		evnt=window.event;
		srcElem=evnt.srcElement;
	}
	else
	{
		evnt=evt;
		srcElem=evnt.target;
	}

	if (srcElem.className == "Date")
	{
		var newDay = parseInt(srcElem.childNodes[0].childNodes[0].nodeValue, 10);
		if (isNaN(newDay))
			return;
		dropObj.ChangeDay(newDay-g_dI);
	}
}
//-----------------------------------------------------------------------------
Dropdown.prototype.doCalKeyDown=function(evt)
{
	var evnt = (dropObj.isIE) ? window.event : evt;
	var caught = false;
	var vis = (dropDiv.style.visibility == "visible");

	switch (evnt.keyCode)
	{
		case 13:		//enter
			var srcEvnt=dropObj.portalWnd.getEventElement(evnt)
			dropObj.clickVal(srcEvnt)
			caught=true
			break
		case 27:		//escape
			if(vis)
			{
				var non=eval(dropObj.callback+"()");
				dropObj.hide();
				dropObj.release();
				caught=true
			}
			break
		case 33:		//page up
			if (vis)
			{
				if( !evnt.altKey && evnt.ctrlKey && !evnt.shiftKey )
					dropObj.ChangeYear(-1)
				else
					dropObj.ChangeMonth(-1)
				caught=true
			}
			break
		case 34:		//page down
			if (vis)
			{
				if ( !evnt.altKey && evnt.ctrlKey && !evnt.shiftKey )
					dropObj.ChangeYear(1)
				else
					dropObj.ChangeMonth(1)
				caught=true
			}
			break
		case 37:		//left arrow
			if(vis)
			{
				dropObj.ChangeDay(-1)
				caught=true
			}
			break
		case 38:		//up arrow
			if(vis)
			{
				dropObj.ChangeWeek(-1)
				caught=true
			}
			break
		case 39:		//right arrow
			if(vis)
			{
				dropObj.ChangeDay(1)
				caught=true
			}
			break
		case 40:		//down arrow
			if(vis)
			{
				dropObj.ChangeWeek(1)
				caught=true
			}
			break
	}
	if (caught)
		dropObj.portalWnd.setEventCancel(evnt)
	return caught
}
//-----------------------------------------------------------------------------
Dropdown.prototype.trackCalDrop=function(e)
{
	var evt
	if (dropObj.isIE)
	{
		e=window.event
		evt=e.srcElement
	}
	else
	{
		evt=e.target
		// with NS, 1 click event is fired by the opening of the calendar
		if(++dropObj.clickCount==1)
			return
		if(!dropDiv)
			return
	}

	if(!evt)
		return

	if(e.clientX < dropDiv.offsetLeft
	|| e.clientX > dropDiv.offsetLeft+oDropCal.offsetWidth
	|| e.clientY + scrollDown < dropDiv.offsetTop
	|| e.clientY + scrollDown > dropDiv.offsetTop + oDropCal.offsetHeight)
	{
		dropObj.hide();
		eval(dropObj.callback + "()");
		dropObj.release();
	}
	else
		dropObj.clickVal(evt)
}
//-----------------------------------------------------------------------------
Dropdown.prototype.clickVal=function(evt)
{
	if(evt.type || evt.parentNode.type)
		return;
	var daySel = "";
	var evntTarget = null;
	if (evt.obj)
	{
		// ie6 - clicked on date
		evntTarget=evt;
		// *** event obj points to the wrong one, use current day instead
		// *** is this b/c of anchors instead of buttons?  :-)
		//daySel=evt.obj;
		daySel=g_dI;
	}
	else if (evt.parentNode.obj)
	{
		// ns6 - clicked on date
		evntTarget=evt.parentNode;
		daySel=evt.parentNode.obj;
	}
	else if (evt.id)
	{
		// ie6, ns6 - clicked on arrow
		evntTarget=evt;
		daySel=evt.id;
	}

	if (!daySel)
		return;

	switch(evntTarget.className)
	{
		case "CalButton":
		{
			switch(evntTarget.id)
			{
				case "PrevMonth":
				{
					dropObj.ChangeMonth(-1);
					break;
				}
				case "NextMonth":
				{
					dropObj.ChangeMonth(1);
					break;
				}
				case "PrevYear":
				{
					dropObj.ChangeYear(-1);
					break;
				}
				case "NextYear":
				{
					dropObj.ChangeYear(1);
					break;
				}
			}
			break;
		}
		case "SelDate":
		case "Date":
		{
			dropObj.DC(daySel);
			break;
		}
	}
}
//-----------------------------------------------------------------------------
Dropdown.prototype.DC=function(src)
{
	if(!src)
		return
	var dt=new Date(g_yI,g_mI,src);
	var non=eval(dropObj.callback+"(dt)")
	dropObj.hide();
	dropObj.release();
}
//-----------------------------------------------------------------------------
Dropdown.prototype.calHighlightDay=function(newDay)
{
	if (g_dI == newDay)
		return;

	if (!dropObj.isIE)
		window.onfocus = null;

	var calTable = null;
	if (dropObj.isIE)
		calTable = oDropCal.document.getElementById("calBody");
	else
	{
		for (var i=0; i<oDropCal.childNodes.length; i++)
			if (oDropCal.childNodes[i].id == "calBody")
				calTable = oDropCal.childNodes[i];
	}
	if (calTable == null)
		return;

	var blurredOldDate = false;
	var highlightedNewDate = false;
	for (var i=0; i<calTable.rows.length; i++)
	{
		if (blurredOldDate && highlightedNewDate)
			break;

		var currRow = calTable.rows[i];
		for (var j=0; j<currRow.cells.length; j++)
		{
			var currCell = calTable.rows[i].cells[j];
			if (!blurredOldDate && currCell.childNodes[0].id == "date"+g_dI)
			{
				currCell.onselectstart = null;
				currCell.className = "Date"
				blurredOldDate = true;
				continue;
			}

			if (!highlightedNewDate && currCell.childNodes[0].id == "date"+newDay)
			{
				currCell.className = "SelDate";
				currCell.onselectstart = dropObj.selStart;
				currCell.childNodes[0].focus();
				highlightedNewDate = true;
			}

			if (blurredOldDate && highlightedNewDate)
				break;
		}
	}			
	g_dI = newDay;

	if (!dropObj.isIE)
		window.onfocus = this.winFocus;
}
//-----------------------------------------------------------------------------
Dropdown.prototype.ChangeDay=function(iStep)
{
	var abClick=Math.abs(iStep)
	if(iStep<0)
	{
		if (g_dI==1)
		{
			g_dI=31;
			dropObj.ChangeMonth(-1);
		}
		else
			dropObj.calHighlightDay(g_dI-abClick);
	}
	else
	{
		var iMax=31;
		if ( g_mI != 11 )
			iMax = dropObj.GetMonthCount(g_mI+1,g_yI);

		if ( g_dI == iMax )
		{
			g_dI=1;
			dropObj.ChangeMonth(1);
		}
		else
			dropObj.calHighlightDay(g_dI+abClick);
	}
}
//-----------------------------------------------------------------------------
Dropdown.prototype.ChangeWeek=function(iStep)
{
	var iMax=31;
	if(iStep<0)
	{
		if ( g_mI != 0 )
			iMax = dropObj.GetMonthCount(g_mI,g_yI);
		if ( (g_dI-7) < 1 )
		{
			g_dI=g_dI+(iMax-7);
			dropObj.ChangeMonth(-1);
		}
		else
			dropObj.calHighlightDay(g_dI-7);
	}
	else
	{
		if ( g_mI != 11 )
			iMax = dropObj.GetMonthCount(g_mI+1,g_yI);
		if ((g_dI+7) > iMax )
		{
			var diff = iMax-g_dI
			g_dI=7-diff;
			dropObj.ChangeMonth(1);
		}
		else
			dropObj.calHighlightDay(g_dI+7);
	}
}
//-----------------------------------------------------------------------------
Dropdown.prototype.ChangeMonth=function(iStep)
{
	if(iStep<0)
	{
		if(g_mI==0) dropObj.CalInit(g_yI-1,11,-1);
		else dropObj.CalInit(g_yI,g_mI-1,-1);
	}
	else
	{
		if(g_mI==11) dropObj.CalInit(g_yI+1,0,-1);
		else dropObj.CalInit(g_yI,g_mI+1,-1);
	}
}
//-----------------------------------------------------------------------------
Dropdown.prototype.ChangeYear=function(iStep)
{
	if(iStep<0) dropObj.CalInit(g_yI-1,g_mI,-1);
	else dropObj.CalInit(g_yI+1,g_mI,-1);
}

//-----------------------------------------------------------------------------
Dropdown.prototype.CalInit=function(year,month,day)
{
	if (!dropObj.isIE && dropDiv)
		window.onfocus = null;
	else
		dropObj.clickCount = 0;

	dropObj.focusCount = 0;
	dropDiv = document.createElement("DIV");
	dropDiv.id = "divCal";

	var formPath=dropObj.portal.path
	var calTitle=document.getElementById("CalTitle")

	var iMoCnt=dropObj.GetMonthCount(month+1,year)
	var iMin=dropObj.GetDOW(month,year);
	var iMax=iMoCnt+iMin;

	g_yI=year;
	g_mI=month;

	if(day!=-1)
		g_dI=day;
	if (g_dI > iMoCnt)
		g_dI = iMoCnt;

 	var digit = 1
	var curCell = 1

	oDropCal = document.createElement("DIV")
	oDropCal.id = "dropCal1"
	oDropCal.align="center"
	oDropCal.className = "Calendar"

	// if long day names, then use auto width
	var lenDay = 0;
	for (var z=0;z<rgWK.length;z++)
	{
		lenDay = Math.max(lenDay, rgWK[z].length);
	}
	if (lenDay>3)
	{
		if (dropObj.isIE)
			oDropCal.style.width = "auto";
		else
			oDropCal.style.width = parseInt(230 * lenDay / 3, 10) + "px";
	}

	var calTitle = document.createElement("DIV")
	calTitle.id = "CalTitle"
	calTitle.align="center"
	calTitle.className = "CalHead"

	var calLeft = document.createElement("img")
	calLeft.id="PrevMonth"
	calLeft.className="CalButton"
	calLeft.src=formPath+"/images/calleft.gif"
	calTitle.appendChild(calLeft);

	var calMonth = document.createElement("span")
	calMonth.className="CalMonth"
	calMonth.type="nodate"
	var monthTitle=document.createTextNode(rgMN[month]);
	calMonth.appendChild(monthTitle)
	calTitle.appendChild(calMonth)

	var calRight = document.createElement("img")
	calRight.id="NextMonth"
	calRight.className="CalButton"
	calRight.src=formPath+"/images/calright.gif"
	calTitle.appendChild(calRight)

	//create year title
	var calLeft = document.createElement("img")
	calLeft.id="PrevYear"
	calLeft.className="CalButton"
	calLeft.src=formPath+"/images/calleft.gif"
	calTitle.appendChild(calLeft);

	var calYear = document.createElement("span")
	calYear.className="CalYear"
	calYear.type="nodate"
	var yearTitle=document.createTextNode(year);
	calYear.appendChild(yearTitle)
	calTitle.appendChild(calYear)

	var calRight = document.createElement("img")
	calRight.id="NextYear"
	calRight.className="CalButton"
	calRight.src=formPath+"/images/calright.gif"
	calTitle.appendChild(calRight)
	oDropCal.appendChild(calTitle);
	dropDiv.appendChild(oDropCal);

	//create calendar dates
	if (document.getElementById("calBody"))
	{
		var remCal=document.getElementById("divCal")
		remCal.parentNode.removeChild(remCal)
		remCal=null
	}
	var calTable = document.createElement("TABLE")
	calTable.id="calBody"
	calTable.className="CalBody"
	calTable.cellSpacing=0
	calTable.cellPadding=0

	var calWeekRow = calTable.insertRow(calTable.rows.length)
	calWeekRow.className="CalWeek"
	for (var z=0;z<rgWK.length;z++)
	{
		var calWeekData =calWeekRow.insertCell(calWeekRow.cells.length)
		calWeekData.className="NoDate"
		calWeekData.type="nodate"
		var wkday=document.createTextNode(rgWK[z]);
		calWeekData.appendChild(wkday)
	}

    for (var row = 1; row <= 7; row++)
    {
		var calRow = calTable.insertRow(calTable.rows.length)
		for (var col = 1; col <= 7;col++)
		{
			if (digit>iMoCnt)
				break
			if (curCell <= iMin)
			{
				var calData = calRow.insertCell(calRow.cells.length)
				calData.className="NoDate"
				var date=document.createTextNode("");
				calData.appendChild(date)
				curCell++
			}
			else
			{
				if (digit == g_dI)
				{
					// current cell represent today's date
					var calData = calRow.insertCell(calRow.cells.length);
					calData.obj=digit; //#102609 date use obj
					var selAnchor = document.createElement("A");
					selAnchor.id="date"+digit;
                    calData.className="SelDate";
                    var date=document.createTextNode(digit);
			      	selAnchor.appendChild(date);
                    calData.appendChild(selAnchor);
				}
				else
				{
					if(digit>iMoCnt)
					{
						var calData = calRow.insertCell(calRow.cells.length)
						calData.className="NoDate"
						var date=document.createTextNode("");
						calData.appendChild(date)
					}
					else
					{
						var calData = calRow.insertCell(calRow.cells.length);
						calData.obj=digit; //#102609 date use obj
						var anchor = document.createElement("A");
						anchor.id="date"+digit;
						calData.className="Date";
						var date=document.createTextNode(digit);
				      	anchor.appendChild(date);
						calData.appendChild(anchor);
					}
				}
				digit++
			}
		}
	}
    oDropCal.appendChild(calTable);

 	var oTmp= dropObj.obj;
	var tp = 0;
	var lft = 0;
	var topScroll = 0;
	var leftScroll = 0;

	while(oTmp.offsetParent)
	{
		tp+=parseInt(oTmp.offsetTop);
		lft+=parseInt(oTmp.offsetLeft);
		topScroll += parseInt(oTmp.scrollTop);
		leftScroll += parseInt(oTmp.scrollLeft);
		oTmp=oTmp.offsetParent;
	}

	if (window.document.getElementById("mainDiv"))
		window.document.getElementById("mainDiv").appendChild(dropDiv);
	else
		window.document.body.appendChild(dropDiv);

	with(dropDiv.style)
	{
		cursor="hand"
		position="absolute"
		visibility="visible"
		display="block"
		top = tp
		left = lft
		height=oDropCal.offsetHeight
		width=oDropCal.offsetWidth
		zIndex=99
	}

	var formDiv = document.getElementById("formDiv");
	var formScrollDown = (formDiv ? formDiv.scrollTop : 0);
	var horzBarSize = (leftScroll > 0) ? 16 : 0;
	var vertBarSize = (topScroll > 0) ? 16 : 0;

	if (dropObj.isIE)
	{
		var win = (dropObj.frame) ? dropObj.frame : document.body;
		var bodyTop = win.offsetTop;
		var bodyHeight = win.offsetHeight;
		var bodyWidth = win.offsetWidth;
		var scrollDown = win.scrollTop + formScrollDown + topScroll;
		var scrollLeft = win.scrollLeft + leftScroll;
	}
	else
	{
		bodyTop = dropObj.portal.contentFrame.offsetTop;
		bodyHeight = dropObj.portal.contentFrame.offsetHeight - 24;
		bodyWidth = dropObj.portal.contentFrame.offsetWidth;
		scrollDown = window.scrollY + formScrollDown;
	}

	var bottom = tp + parseInt(dropDiv.style.height) + dropObj.obj.offsetHeight + 3 - scrollDown;
	if (bodyHeight - horzBarSize > bottom)
	{
		// default position: just below field
		tp=(tp + dropObj.obj.offsetHeight)
	}
	else if ((tp - scrollDown - dropDiv.offsetHeight) >= 0)
	{
		// didn't fit below: position above field
		if ((tp - dropDiv.offsetHeight) > scrollDown)
			tp= tp - dropDiv.offsetHeight + 3;
		else
			tp = tp - dropDiv.offsetHeight;		
	}
	else if (lft + dropObj.obj.offsetWidth + dropDiv.offsetWidth - scrollLeft < bodyWidth)
	{
		// didn't fit above or below: position at top of screen to right of field
		var iconWidth = dropObj.getNextIconWidth();
		lft = lft + dropObj.obj.offsetWidth + iconWidth;
		tp = topScroll;
	}
	else
		tp = topScroll;

	// determine if the proposed left position will overflow right edge.
	if ((lft - scrollLeft + dropDiv.offsetWidth + 4) > bodyWidth - vertBarSize)
	{
		// Set left to 1 if the menu fills the window, otherwise set it to align with right edge.
		if (dropDiv.offsetWidth + 3 > bodyWidth)
			lft = 1 + scrollLeft;
		else
			lft = bodyWidth + scrollLeft - vertBarSize - dropDiv.offsetWidth;
	}

	dropDiv.style.top = tp;
	dropDiv.style.left = lft;

	if (dropObj.portal.browser.isIE)
	{
		selAnchor.style.textDecoration="none";
		selAnchor.parentNode.focus();
		selAnchor.parentNode.onselectstart=dropObj.selStart;
		dropDiv.onclick=dropObj.trackCalDrop;
		dropDiv.setCapture();
		window.onblur = this.noContextMenu;
    }
	else
	{
		selAnchor.style.textDecoration="none";
		selAnchor.focus();
		selAnchor.onselectstart=dropObj.selStart;
		dropObj.portalWnd.window.onclick=dropObj.trackCalDrop;
		window.onclick=dropObj.trackCalDrop;
		dropObj.portalWnd.window.captureEvents(Event.CLICK);
		window.onfocus = this.winFocus;
	}
	dropDiv.onkeydown = dropObj.doCalKeyDown;
	dropDiv.oncontextmenu = dropObj.noContextMenu;
	dropDiv.onmousemove=dropObj.calMouseMove;
}
//-----------------------------------------------------------------------------
Dropdown.prototype.selStart=function(e)
{
	if (dropObj.isIE)
		e=window.event
	var evnt=dropObj.portalWnd.getEventObject(e)
	dropObj.portalWnd.setEventCancel(evnt)
}
//-----------------------------------------------------------------------------
Dropdown.prototype.GetMonthCount=function(month,year)
{
	var dt=new Date(year,month,1);
	dt.setDate(dt.getDate()-1);
	return (dt.getDate());
}
//-----------------------------------------------------------------------------
Dropdown.prototype.GetDOW=function(month,year)
{
	var dt=new Date(year,month,1);
	return (dt.getDay());
}
//-----------------------------------------------------------------------------
Dropdown.prototype.calenInit=function(type,obj)
{
	var myDate=new Date()

	// create array of ids for month translation XMLDOM
	for (var i=0; i < rgMN.length; i++)
		rgMN[i]=dropObj.portal.getPhrase(i)

	// create array of ids for day translation
	rgWK[0]=dropObj.portal.getPhrase("Sun");
	rgWK[1]=dropObj.portal.getPhrase("Mon");
	rgWK[2]=dropObj.portal.getPhrase("Tue");
	rgWK[3]=dropObj.portal.getPhrase("Wed");
	rgWK[4]=dropObj.portal.getPhrase("Thu");
	rgWK[5]=dropObj.portal.getPhrase("Fri");
	rgWK[6]=dropObj.portal.getPhrase("Sat");

	if(dropObj.obj.value!="")
	{
		var dt=dropObj.portalWnd.edSetUserDateFormat(dropObj.type)
		dt=dropObj.portalWnd.edGetDateObject(dt);
		if (!dt || isNaN(dt)) dt=new Date();
		dropObj.CalInit(dt.getFullYear(),dt.getMonth(),dt.getDate());
	}
	else
	{
		var year=myDate.getYear()
		if (!dropObj.portal.browser.isIE)
			year=1900+year;
		var month=myDate.getMonth()
		var day=myDate.getDate()
		dropObj.CalInit(year,month,day)
	}
}
