/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/menu.js,v 1.21.2.6.4.7.12.2.2.4 2012/08/08 12:37:20 jomeli Exp $ */
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

var dropDiv=null;
var dropObj;
var rgMN=new Array(12);
var rgWK=new Array(7);
var myDate=new Date();
var g_dI=-1;
var g_mI=-1;
var g_yI=-1;

//-----------------------------------------------------------------------------
// constructor for dropdown object
function Dropdown(portalWnd)
{
	dropObj=this;
	dropObj.win=null;
	dropObj.portalWnd=portalWnd;
	dropObj.menu=null;
	dropObj.type=null;
	dropObj.obj=null;
	dropObj.selected=null;
	dropObj.callback=null;
	dropObj.mouseX=null;
	dropObj.mouseY=null;
	dropObj.cnt=0;
	dropObj.blurCount=0;
	dropObj.iframe=window.frameElement;
	dropObj.items=new Object()
}
//-----------------------------------------------------------------------------
Dropdown.prototype.addItem=function(id,listObj,mAction,mClick,mHref,height,width,refObj)
{
	this.items[id]=new Object();
	this.items[id].id=id;
	this.items[id].obj=listObj;
	this.items[id].action=mAction;
	this.items[id].onclick=mClick;
	this.items[id].ahref=mHref;
	this.items[id].height=(typeof(height)!="undefined" ? height : 0);
	this.items[id].width=(typeof(width)!="undefined" ? width : 0);
	this.items[id].refObj=(typeof(refObj)!="undefined" ? refObj : null);
}
//-----------------------------------------------------------------------------
Dropdown.prototype.buildMenuItem=function()
{
	dropObj.menuInit();
}
//-----------------------------------------------------------------------------
Dropdown.prototype.buildCalItem=function ()
{
	var myDate=new Date();

	// create array of ids for month translation XMLDOM
	for (var i=0;i<rgMN.length;i++)
		rgMN[i]=dropObj.portalWnd.lawsonPortal.getPhrase(i);
	
	// create array of ids for day translation XMLDOM
	rgWK[0]=dropObj.portalWnd.lawsonPortal.getPhrase("Sun");
	rgWK[1]=dropObj.portalWnd.lawsonPortal.getPhrase("Mon");
	rgWK[2]=dropObj.portalWnd.lawsonPortal.getPhrase("Tue");
	rgWK[3]=dropObj.portalWnd.lawsonPortal.getPhrase("Wed");
	rgWK[4]=dropObj.portalWnd.lawsonPortal.getPhrase("Thu");
	rgWK[5]=dropObj.portalWnd.lawsonPortal.getPhrase("Fri");
	rgWK[6]=dropObj.portalWnd.lawsonPortal.getPhrase("Sat");

	if (!dropObj.obj.value=="")
	{
		var dt=dropObj.portalWnd.edSetUserDateFormat(dropObj.date);
		dt=dropObj.portalWnd.edGetDateObject(dt);
		if (!dt || isNaN(dt)) dt=new Date();
		dropObj.calInit(dt.getFullYear(),dt.getMonth(),dt.getDate());
	}
	else
	{
		var year=myDate.getYear();
		if (!dropObj.portalWnd.lawsonPortal.browser.isIE)
			year=1900+year;
		var month=myDate.getMonth();
		var day=myDate.getDate();
		dropObj.calInit(year,month,day);
	} 
}
//-----------------------------------------------------------------------------
Dropdown.prototype.clearItems=function()
{
	this.items=new Object();
}
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
	if (!dropDiv) return;

	var evnt=(dropObj.portalWnd.lawsonPortal.browser.isIE ? window.event : evt);
	var evntCaught=false;

	switch (evnt.keyCode)
	{
		case 13:		//enter
			var srcEvnt=dropObj.portalWnd.getEventElement(evnt);
			dropObj.calClickVal(evnt);
			evntCaught=true;
			break;
		case 27:		//escape
			dt=null;
			eval(dropObj.callback+"(dt)");
			dropObj.closeMenu(evnt);
			break;
		case 33:		//pageup
			if (dropDiv.style.visibility=="visible")
			{
				if( !evnt.altKey && evnt.ctrlKey && !evnt.shiftKey )
					dropObj.ChangeYear(-1);
				else
					dropObj.ChangeMonth(-1);
				evntCaught=true;
			}
			break;
		case 34:		//pagedown
			if (dropDiv.style.visibility=="visible")
			{
				if ( !evnt.altKey && evnt.ctrlKey && !evnt.shiftKey )
					dropObj.ChangeYear(1);
				else
					dropObj.ChangeMonth(1);
				evntCaught=true;
			}
			break;
		case 37:		//left arrow
			if(dropDiv.style.visibility == "visible")
			{
				dropObj.ChangeDay(-1);
				evntCaught=true;
			}
			break;
		case 38:		//up arrow
			if(dropDiv.style.visibility == "visible")
			{
				dropObj.ChangeWeek(-1);
				evntCaught=true;
			}
			break;
		case 39:		//right arrow
			if(dropDiv.style.visibility == "visible")
			{
				dropObj.ChangeDay(1);
				evntCaught=true;
			}
			break;
		case 40:		//down arrow
			if(dropDiv.style.visibility == "visible")
			{
				dropObj.ChangeWeek(1);
				evntCaught=true;
			}
			break;
	}
	if(evntCaught==true)
		dropObj.portalWnd.setEventCancel(evnt);
	return evntCaught;
}
//-----------------------------------------------------------------------------
Dropdown.prototype.ChangeDay=function(iStep)
{
	var abClick=Math.abs(iStep);
	if (iStep < 0)
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
	if (iStep < 0)
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
			var diff = iMax-g_dI;
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
	if (iStep < 0)
	{
		if (g_mI==0) dropObj.calInit(g_yI-1,11,-1);
		else dropObj.calInit(g_yI,g_mI-1,-1);
	}
	else
	{
		if (g_mI==11) dropObj.calInit(g_yI+1,0,-1);
		else dropObj.calInit(g_yI,g_mI+1,-1);
	}
}
//-----------------------------------------------------------------------------
Dropdown.prototype.ChangeYear=function (iStep)
{
	if (iStep < 0) dropObj.calInit(g_yI-1,g_mI,-1);
	else dropObj.calInit(g_yI+1,g_mI,-1);
}
//-----------------------------------------------------------------------------
Dropdown.prototype.DC=function(src)
{
	var iDay = src;
	var dt=new Date(g_yI,g_mI,iDay);

	if (!src) return;
	var non=eval(dropObj.callback+"(dt)");
	if(dropDiv)
	{
		dropObj.iframe.style.visibility="hidden";
		dropDiv.parentNode.removeChild(dropDiv);
		dropDiv=null;
		if (dropObj.portalWnd.lawsonPortal.browser.isIE)
			document.releaseCapture();
		else
			window.releaseEvents(Event.CLICK);
	}
}
//-----------------------------------------------------------------------------
Dropdown.prototype.calHighlightDay=function(newDay)
{
	if (g_dI == newDay)
		return;

	if (!dropObj.portalWnd.lawsonPortal.browser.isIE)
		window.onblur = null;

	var calTable = window.document.getElementById("calBody");
	if (calTable == null)
		return;

	var blurredOldDate = false;
	var highlightedNewDate = false;
	for (var i=0; i<calTable.rows.length; i++)
	{
		if (blurredOldDate && highlightedNewDate)
			break;

		var currRow = calTable.rows[i];
		for (var j=0; j < currRow.cells.length; j++)
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

	if (!dropObj.portalWnd.lawsonPortal.browser.isIE)
		window.onblur = this.noContextMenu;
}
//-----------------------------------------------------------------------------
Dropdown.prototype.trackMenuClick=function(e) 
{
	if (dropObj.portalWnd.lawsonPortal.browser.isIE)
	{
		e=window.event;
		if (e.clientX < dropDiv.offsetLeft 
		 || e.clientX > dropDiv.offsetLeft+dropDiv.offsetWidth 
		 || e.clientY < dropDiv.offsetTop
		 || e.clientY > dropDiv.offsetTop+dropDiv.offsetHeight)
		{
			dropObj.iframe.style.visibility="hidden";
			dropDiv.parentNode.removeChild(dropDiv);
			dropDiv=null;
			document.releaseCapture();
			return;
		}
	}
	else
	{
		if (e.target)
		{
			if (!dropDiv) return;

			// this event gets fired several times, one of the first 
			// two is the one we want... netcrap
			if (e.type != "click")
			{
				if (++dropObj.cnt < 2)
					return;
				else
				{
					dropObj.iframe.style.visibility="hidden";
					dropDiv.parentNode.removeChild(dropDiv);
					dropDiv=null;
					window.releaseEvents(Event.CLICK);
					return;
				}
			}
		}
	}
	dropObj.getVal(e);
}
//-----------------------------------------------------------------------------
Dropdown.prototype.GetDOW=function(month,year)
{
	var dt=new Date(year,month,1);
	return (dt.getDay());
}
//-----------------------------------------------------------------------------
Dropdown.prototype.GetMonthCount=function(month,year)
{
	var dt=new Date(year,month,1);
	dt.setDate(dt.getDate()-1);
	return (dt.getDate());
}
//-----------------------------------------------------------------------------
Dropdown.prototype.getVal=function (e)
{
	var menuEvent=dropObj.portalWnd.getEventElement(e);
	var menuItem = (menuEvent.tagName=="A"
		? menuEvent
		: (menuEvent.childNodes[0].tagName=="A" ? menuEvent.childNodes[0] : null));
	if (menuItem)
		dropObj.menuAct(menuItem);
	dropObj.closeMenu(e);
}
//-----------------------------------------------------------------------------
Dropdown.prototype.menuAct=function(menuItem)
{
	if(menuItem.getAttribute("ahref")=="CUSTOMHELP")
	{
		eval("dropObj.portalWnd.lawsonPortal.helpOptions.items[menuItem.id].target." + 
				menuItem.getAttribute("action"));
	}
	else if(menuItem.getAttribute("ahref")=="FORMFCCHANGE")
	{
		eval("dropObj.portalWnd.frames[0].lawformDefaultFCChange('" + 
				menuItem.getAttribute("action") + "')");
	}
	else if(menuItem.getAttribute("ahref")=="SPECIALACTION")
	{
		eval("dropObj.portalWnd.frames[0].lawformInitiateSpecialAction('" + 
				menuItem.getAttribute("action") + "')");
	}
	else if(menuItem.getAttribute("ahref")=="LINKCHANGE")
	{
		eval("dropObj.portalWnd.frames[0].transferSelect('" + 
				menuItem.getAttribute("action") + "')");
	}
	else if(menuItem.getAttribute("ahref")=="TOOLBUTTONSELECT")
	{
		menuItem.refObj._dropdownCallback(menuItem.id);
	}
	else
	{
		var action = menuItem.getAttribute("action") 
				? menuItem.getAttribute("action").toUpperCase() 
				: "";
		var href=menuItem.getAttribute("ahref");
		switch (action)
		{
			case "WEB_SEARCH" :
			case "LAW_SEARCH" :
				var srchValue = dropObj.portalWnd.document.getElementById("findText").value;
				var srchButton = dropObj.portalWnd.document.getElementById("LAWMENUBTNSEARCH2");
				if (href.substr(href.length-srchValue.length)==srchValue)
					href=href.substr(0,href.length-srchValue.length);
				dropObj.portalWnd.lawsonPortal.searchApi = href;
				dropObj.portalWnd.lawsonPortal.searchAction = action;

				// change title and image of search button
				var menuId=menuItem.getAttribute("id");
				srchButton.title = dropObj.portalWnd.lawsonPortal.getPhrase("LBL_SEARCH") + " "+menuId;
				srchButton.setAttribute("menuId",menuId);
				dropObj.portalWnd.setSrchButtonIcon(srchButton,false);
				eval("dropObj.portalWnd.doFind()");
				break;

			case "NEWWIN" :
				eval("dropObj.portalWnd.openWindow('" + href +"','"+
					menuItem.getAttribute("height")+"','"+menuItem.getAttribute("width")+"')");
				break;
			case "FUNCTION" :
				if (typeof(eval("dropObj.portalWnd." + href))=="function")
					setTimeout("dropObj.portalWnd." + href +"()",10);
				break;
			case "CONTEXT" :
				var args=href.split("|");
				var action=args[2];
				if (args.length > 3)
				{
					for (var i = 3; i < args.length; i++)
						action+=("|"+args[i]);
				}
				eval("dropObj.portalWnd.lawsonPortal.tabArea.tabs['"+args[0]+
							"'].navletObjects['"+args[1]+"'].target." + action);
				break;
			case "CONTEXTWIN" :
				eval("dropObj.portalWnd.contextWindow('" + href +"')");
				break;
			default:
				eval("dropObj.portalWnd.switchContents('" + href +"')");
				break;
		}
	}
}
//-----------------------------------------------------------------------------
Dropdown.prototype.menuInit=function()
{
	if (dropDiv != null) return;

	if (document.getElementById("menuTab"))
	{
		var remCal=document.getElementById("divCal");
		remCal.parentNode.removeChild(remCal);
		remCal=null;
	}

	dropDiv=document.createElement("DIV");
	dropDiv.id="divCal";
	menuTable=document.createElement("table");
	menuTable.id="menuTab";
	menuTable.className="dropDownMenu";
	menuTable.width=100;

	var selItem;
	var count=0;
	for (id in dropObj.items)
	{
		if(this.items[id]==null)
			continue;
		var menuRow = menuTable.insertRow(menuTable.rows.length);
		menuRow.id = "row"+count;
		var menuCell = menuRow.insertCell(menuRow.cells.length);
		menuCell.id = "cell"+count;
		count++;
		menuCell.noWrap=true;
		menuCell.className="dropDownMenuItem";
		menuCell.style.position="relative";
		
		menuAnchor=document.createElement("A");
		menuAnchor.id=id;
		menuAnchor.setAttribute("ahref",dropObj.items[id].ahref);
		menuAnchor.setAttribute("action",dropObj.items[id].action);
		if (dropObj.items[id].height);
			menuAnchor.setAttribute("height",dropObj.items[id].height);
		if (dropObj.items[id].width);
			menuAnchor.setAttribute("width",dropObj.items[id].width);
		if (!dropObj.portalWnd.lawsonPortal.browser.isIE);
			menuRow.onclick=dropObj.items[id].onclick;
		menuAnchor.refObj=dropObj.items[id].refObj;

		var menu=document.createTextNode(id);
		menuAnchor.appendChild(menu);
		menuCell.appendChild(menuAnchor);
	}

	dropDiv.appendChild(menuTable);
	var oTmp= dropObj.obj;
	var tp=0;
	var lft=0;

	if (typeof(dropObj.mouseX) == "undefined")
	{
		while(oTmp.offsetParent)
		{
			tp+=parseInt(oTmp.offsetTop);
			lft+=parseInt(oTmp.offsetLeft);
			oTmp=oTmp.offsetParent;
		}
		tp+=dropObj.obj.offsetHeight;
	}
	else
	{
		lft=dropObj.mouseX;
		tp=dropObj.mouseY;
	}
	dropDiv.className="dropDownMenu";
	dropObj.iframe.style.left=lft;
	dropObj.iframe.style.top=tp;

	window.document.body.appendChild(dropDiv);
	if (menuTable.offsetHeight >= window.screen.availHeight)
	{
		dropObj.iframe.style.height = window.screen.availHeight - window.screenTop - 62;	
	}
	else
		dropObj.iframe.style.height=menuTable.offsetHeight;
		
	dropObj.iframe.style.width=menuTable.offsetWidth;

	with(dropDiv.style)
	{
		position="absolute";
		visibility="visible";
		display="block";
		top=0;
		left=0;
		height=menuTable.offsetHeight;
		width=menuTable.offsetWidth;
		zIndex=99;
	}

	var portalObj=dropObj.portalWnd.lawsonPortal;	
	var oL = dropObj.iframe.offsetLeft;
	var oW = dropObj.iframe.offsetWidth;
	var cFoL = portalObj.contentFrame.offsetLeft;
	var cFoW = portalObj.contentFrame.offsetWidth;

	if((oL + oW) > (cFoL + cFoW))
		dropObj.iframe.style.left = oL - ((oL + oW) - (cFoL + cFoW)) - 1;

	dropObj.iframe.style.display="block";
	dropObj.iframe.style.visibility="visible";

	var itemFocus=menuTable.getElementsByTagName("A");
	if (!dropObj.type)
	{
		dropObj.selected=itemFocus[0].parentNode;
		itemFocus[0].parentNode.className="dropDownMenuItemHighlight";
		if (dropObj.portalWnd.lawsonPortal.browser.isIE)
		{
			itemFocus[0].parentNode.focus();
			itemFocus[0].parentNode.onselectstart=dropObj.selStart;
		}
		else
		{
			itemFocus[0].focus();
			itemFocus[0].onselectstart=dropObj.selStart;
		}
	}
	else
	{
		for (var i=0;i < itemFocus.length; i++)
		{
			if (dropObj.type==itemFocus[i].childNodes[0].nodeValue)
			{
				dropObj.selected=itemFocus[i].parentNode;
				itemFocus[i].parentNode.className="dropDownMenuItemHighlight";
				if (dropObj.portalWnd.lawsonPortal.browser.isIE)
				{
					itemFocus[i].parentNode.focus();
					itemFocus[i].parentNode.onselectstart=dropObj.selStart;
				}
				else
				{
					itemFocus[i].focus();
					itemFocus[i].onselectstart=dropObj.selStart;
				}
			}
		}
	}	
	
	if (dropObj.portalWnd.lawsonPortal.browser.isIE)
	{
		window.onblur=dropObj.noContextMenu;
		dropDiv.onclick=dropObj.trackMenuClick;
		dropDiv.setCapture();
	}
	else
	{
		window.onblur=dropObj.trackMenuClick;
		dropObj.portalWnd.captureEvents(Event.CLICK);
	}

	dropDiv.onmousemove=dropObj.onMouseMove;
	dropDiv.onkeydown=dropObj.menuCalKeyDown;
	dropDiv.oncontextmenu=dropObj.noContextMenu;
}
//-----------------------------------------------------------------------------
Dropdown.prototype.onMouseMove=function(evt)
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

	if (!srcElem.className || srcElem.className.substr(0,16) != "dropDownMenuItem")
		return;
	if (dropObj.selected.id == srcElem.id)
		return;

	// if you don't take away the blur event, it will fire when resetting focus
	if (!dropObj.portalWnd.lawsonPortal.browser.isIE)
		window.onblur=null;

	// switch classNames to highlight the new item
	dropObj.selected.className = "dropDownMenuItem";
	dropObj.selected.onselectstart = null;

	srcElem.className = "dropDownMenuItemHighlight";
	srcElem.onselectstart = dropObj.selStart;

	// focus on the new item
	if (dropObj.portalWnd.lawsonPortal.browser.isIE)
		srcElem.focus();
	else
		srcElem.childNodes[0].focus();

	dropObj.type = srcElem.childNodes[0].childNodes[0].nodeValue;
	dropObj.selected = srcElem;

	// re-activate the blur event
	if (!dropObj.portalWnd.lawsonPortal.browser.isIE)
		window.onblur=dropObj.trackMenuClick;
}
//-----------------------------------------------------------------------------
Dropdown.prototype.menuCalKeyDown=function(evt)
{
	var evnt=(dropObj.portalWnd.lawsonPortal.browser.isIE ? window.event : evt);
	var evntCaught=false;

	if (dropDiv)
	{
		switch (evnt.keyCode)
		{
			case 13:		//enter
				dropObj.cnt=1;
				dropObj.getVal(evnt);
				break;
			case 27:		//escape
				if(dropDiv.style.visibility=="visible")
				{
					dropObj.closeMenu(evnt);
					eval(dropObj.callback+"()");
				}
				break;
			case 38:		//up arrow
				if(dropDiv.style.visibility == "visible")
				{
					var srcEvnt=dropObj.portalWnd.getEventElement(evnt);
					dropObj.changeUp(srcEvnt);
					evntCaught=true;
				}
				break;
			case 40:		//down arrow
				if(dropDiv.style.visibility == "visible")
				{
					var srcEvnt=dropObj.portalWnd.getEventElement(evnt);
					dropObj.changeDown(srcEvnt);
					evntCaught=true;
				}
				break;
		}
	}
	if (evntCaught==true)
		dropObj.portalWnd.setEventCancel(evnt);
	return evntCaught;
}
//-----------------------------------------------------------------------------
Dropdown.prototype.changeDown=function(item)
{
	if (!item) return;

	if (!dropObj.portalWnd.lawsonPortal.browser.isIE)
		item = item.parentNode;

	if (!item.parentNode.nextSibling)
		return;

	// if you don't take away the blur event, it will fire when resetting focus
	if (!dropObj.portalWnd.lawsonPortal.browser.isIE)
		window.onblur=null;

	// switch classNames to highlight the new item
	item.className = "dropDownMenuItem";
	item.onselectstart = null;

	var nextItem = item.parentNode.nextSibling.childNodes[0];
	nextItem.className = "dropDownMenuItemHighlight";
	nextItem.onselectstart = dropObj.selStart;

	// focus on the new item
	if (dropObj.portalWnd.lawsonPortal.browser.isIE)
		nextItem.focus();
	else
		nextItem.childNodes[0].focus();

	dropObj.type = item.parentNode.nextSibling.childNodes[0].childNodes[0].childNodes[0].nodeValue;
	dropObj.selected = nextItem;

	// re-activate the blur event
	if (!dropObj.portalWnd.lawsonPortal.browser.isIE)
		window.onblur=dropObj.trackMenuClick;
}
//-----------------------------------------------------------------------------
Dropdown.prototype.changeUp=function(item)
{
	if (!item) return;

	if (!dropObj.portalWnd.lawsonPortal.browser.isIE)
		item = item.parentNode;

	if (!item.parentNode.previousSibling)
		return;

	// if you don't take away the blur event, it will fire when resetting focus
	if (!dropObj.portalWnd.lawsonPortal.browser.isIE)
		window.onblur=null;

	// switch classNames to highlight the new item
	item.className = "dropDownMenuItem";
	item.onselectstart = null;

	var previousItem = item.parentNode.previousSibling.childNodes[0];
	previousItem.className = "dropDownMenuItemHighlight";
	previousItem.onselectstart = dropObj.selStart;

	// focus on the new item
	if (dropObj.portalWnd.lawsonPortal.browser.isIE)
		previousItem.focus();
	else
		previousItem.childNodes[0].focus();

	dropObj.type = item.parentNode.previousSibling.childNodes[0].childNodes[0].childNodes[0].nodeValue;
	dropObj.selected = previousItem;

	// re-activate the blur event
	if (!dropObj.portalWnd.lawsonPortal.browser.isIE)
		window.onblur=dropObj.trackMenuClick;
}
//-----------------------------------------------------------------------------
Dropdown.prototype.noContextMenu=function(e)
{
	if (!dropDiv) return;

	if (!dropObj.portalWnd.lawsonPortal.browser.isIE)
	{
		// this event gets fired several times, one of the first two is the one we want... netcrap
		if (e.type == "blur" && ++dropObj.blurCount < 2)
			return;
	}

	dropObj.iframe.style.visibility="hidden";
	dropDiv.parentNode.removeChild(dropDiv);
	dropDiv=null;
	if (dropObj.portalWnd.lawsonPortal.browser.isIE)
		document.releaseCapture();
	else
		window.releaseEvents(Event.CLICK);
}
//-----------------------------------------------------------------------------
Dropdown.prototype.closeMenu=function(e)
{
	if (!dropDiv) return;

	try {
		dropObj.cnt=0;
		dropObj.iframe.style.visibility="hidden";
		dropDiv.parentNode.removeChild(dropDiv);
		dropObj.portalWnd.setEventCancel(e);
		dropDiv=null;
		
	} catch (e) { }
}
//-----------------------------------------------------------------------------
Dropdown.prototype.selStart=function(e)
{
	if (dropObj.portalWnd.lawsonPortal.browser.isIE)
		e=window.event;
	var evnt=dropObj.portalWnd.getEventObject(e);
	dropObj.portalWnd.setEventCancel(evnt);
}
//-----------------------------------------------------------------------------
Dropdown.prototype.calInit=function(year,month,day)
{
	dropObj.cnt=0;
	dropObj.blurCount=0;
	dropDiv=document.createElement("DIV");
	dropDiv.id="divCal";

	var formPath=dropObj.portalWnd.lawsonPortal.path;
	var calTitle=document.getElementById("CalTitle");

	var iMoCnt=dropObj.GetMonthCount(month+1,year);
	var iMin=dropObj.GetDOW(month,year);
	var iMax=iMoCnt+iMin;

	g_yI=year;
	g_mI=month;
        
	if(day!=-1) 
		g_dI=day;
	if (g_dI > iMoCnt)
		g_dI = iMoCnt;

 	var digit=1;
	var curCell=1;

	var oDropCal = document.createElement("DIV");
	oDropCal.id = "dropCal1";
	oDropCal.align = "center";
	oDropCal.className = "Calendar";

	var calTitle = document.createElement("DIV");
	calTitle.id = "CalTitle";
	calTitle.align = "center";
	calTitle.className = "CalHead";

	var calLeft = document.createElement("img");
	calLeft.id="PrevMonth";
	calLeft.className="CalButton";
	calLeft.src=formPath+"/images/calleft.gif";
	if (!dropObj.portalWnd.lawsonPortal.browser.isIE)
		calLeft.onclick=dropObj.calClickVal;
	calTitle.appendChild(calLeft);

	var calMonth = document.createElement("span");
	calMonth.className="CalMonth";
	calMonth.type="nodate";
	var monthTitle=document.createTextNode(rgMN[month]);
	calMonth.appendChild(monthTitle);
	calTitle.appendChild(calMonth);

	var calRight = document.createElement("img");
	calRight.id="NextMonth";
	calRight.className="CalButton";
	calRight.src=formPath+"/images/calright.gif";
	if (!dropObj.portalWnd.lawsonPortal.browser.isIE)
		calRight.onclick=dropObj.calClickVal;
	calTitle.appendChild(calRight);

	//create year title
	var calLeft = document.createElement("img");
	calLeft.id="PrevYear";
	calLeft.className="CalButton";
	calLeft.src=formPath+"/images/calleft.gif";
	if (!dropObj.portalWnd.lawsonPortal.browser.isIE)
		calLeft.onclick=dropObj.calClickVal;
	calTitle.appendChild(calLeft);

	var calYear = document.createElement("span");
	calYear.className="CalYear";
	calYear.type="nodate";
	var yearTitle=document.createTextNode(year);
	calYear.appendChild(yearTitle);
	calTitle.appendChild(calYear);

	var calRight = document.createElement("img");
	calRight.id="NextYear";
	calRight.className="CalButton";
	calRight.src=formPath+"/images/calright.gif";
	if (!dropObj.portalWnd.lawsonPortal.browser.isIE)
		calRight.onclick=dropObj.calClickVal;
	calTitle.appendChild(calRight);
	oDropCal.appendChild(calTitle);      
	dropDiv.appendChild(oDropCal);

	//create calendar dates
	if(document.getElementById("calBody"))
	{
		var remCal=document.getElementById("divCal");
		remCal.parentNode.removeChild(remCal);
		remCal=null;
	}
	var calTable = document.createElement("TABLE");
	calTable.id="calBody";
	calTable.className="CalBody";
	calTable.cellSpacing=0;
	calTable.cellPadding=0;
	if (!dropObj.portalWnd.lawsonPortal.browser.isIE)
		calTable.onclick=dropObj.calClickVal;

	var calWeekRow = calTable.insertRow(calTable.rows.length);
	calWeekRow.className="CalWeek";
	for (var z=0;z<rgWK.length;z++)
	{
		var calWeekData =calWeekRow.insertCell(calWeekRow.cells.length);
		calWeekData.className="NoDate";
		calWeekData.type="nodate";
		var wkday=document.createTextNode(rgWK[z]);
		calWeekData.appendChild(wkday);
	}

    for (var row = 1; row <= 7; row++) 
    {
		var calRow = calTable.insertRow(calTable.rows.length);
		for (var col = 1; col <= 7;col++)
		{
			if (digit>iMoCnt)
				break;
			if (curCell <= iMin) 
			{     
				var calData = calRow.insertCell(calRow.cells.length);
				calData.className="NoDate";
				var date=document.createTextNode("");
				calData.appendChild(date);
				curCell++;
			}
			else 
			{
				if (digit == g_dI) 
				{ 
					// current cell represent today's date
					var calData = calRow.insertCell(calRow.cells.length);
					calData.obj=digit;
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
						var calData = calRow.insertCell(calRow.cells.length);
						calData.className="NoDate";
						var date=document.createTextNode("");
						calData.appendChild(date);
					}
					else
					{
						var calData = calRow.insertCell(calRow.cells.length);
						calData.obj=digit;
						var calAnchor = document.createElement("A");
						calAnchor.id="date"+digit;
						calData.className="Date";
						var date=document.createTextNode(digit);
				      	calAnchor.appendChild(date);
						calData.appendChild(calAnchor);
					}
				}
				digit++;
			}
		}
	}
    oDropCal.appendChild(calTable);    
 	var oTmp=dropObj.obj;
	var tp=0;
	var lft=0;
	while(oTmp.offsetParent)
	{
		tp+=parseInt(oTmp.offsetTop);
		lft+=parseInt(oTmp.offsetLeft);
		oTmp=oTmp.offsetParent;
	}
	dropDiv.appendChild(oDropCal);
	window.document.body.appendChild(dropDiv);
	
	with(dropDiv.style)
	{
		position="absolute";
		visibility="visible";
		display="block";
		top=0;
		left=0;
		height=oDropCal.offsetHeight;
		width=oDropCal.offsetWidth;
		zIndex=99;
	}
	
	with(dropObj.iframe.style)
	{
		height=oDropCal.offsetHeight;
		width=oDropCal.offsetWidth;
		display="block";
		visibility="visible";
		top=tp+dropObj.obj.offsetHeight;
		left=lft;
	}
	
	if (dropObj.portalWnd.lawsonPortal.browser.isIE)
	{
		selAnchor.parentNode.focus();
		selAnchor.parentNode.onselectstart=dropObj.selStart;
		dropDiv.onclick=dropObj.trackCalDrop;
		dropDiv.setCapture();
	}
	else
	{
		selAnchor.focus();
		selAnchor.onselectstart=dropObj.selStart;
		window.onblur=dropObj.trackCalDrop;
		dropObj.portalWnd.captureEvents(Event.CLICK);
    }
	dropDiv.onkeydown=dropObj.doCalKeyDown;
	dropDiv.oncontextmenu=dropObj.noContextMenu;
	dropDiv.onmousemove=dropObj.calMouseMove;
}
//-----------------------------------------------------------------------------
Dropdown.prototype.clickDate=function(e) 
{
	var menuEvent=dropObj.portalWnd.getEventElement(e);
	dropObj.closeMenu(e);
}
//-----------------------------------------------------------------------------
Dropdown.prototype.trackCalDrop=function(e)
{
	if (dropObj.portalWnd.lawsonPortal.browser.isIE)
	{
		e=window.event;
		if (e.clientX < dropDiv.offsetLeft 
		|| e.clientX > dropDiv.offsetLeft+dropDiv.offsetWidth 
		|| e.clientY < dropDiv.offsetTop
		|| e.clientY > dropDiv.offsetTop+dropDiv.offsetHeight)
		{
			dropObj.iframe.style.visibility="hidden";
			dropDiv.parentNode.removeChild(dropDiv);
			dropDiv=null;
			document.releaseCapture();
			return;
		}
		dropObj.calClickVal(e);
	}
	else
	{
		if (e.target)
		{
			dropObj.cnt++;
			if (dropObj.cnt==1 || !dropDiv)
				return;
		}
		dropObj.closeMenu(e)
	}
}
//-----------------------------------------------------------------------------
Dropdown.prototype.calClickVal=function(e)
{
	var evt = dropObj.portalWnd.getEventElement(e);
	var daySel = "";
	var evntTarget = null;
	if (evt.obj)
	{
		// ie6 - clicked on date
		evntTarget=evt;
		// event obj points to the wrong one, use current day instead
		// is this b/c of anchors instead of buttons?  :-)
		// daySel=evt.obj;
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
		dropObj.closeMenu(e);

	switch(evntTarget.className)
	{
		case "CalButton":
		{
			switch(evntTarget.id)
			{
				case "PrevMonth":
					dropObj.ChangeMonth(-1);
					break;
				case "NextMonth":
					dropObj.ChangeMonth(1);
					break;
				case "PrevYear":
					dropObj.ChangeYear(-1);
					break;
				case "NextYear":
					dropObj.ChangeYear(1);
					break;
			}
			break;
		}
		case "SelDate":
		case "Date":
			dropObj.DC(daySel);
			break;
		case "NoDate":
			break;
	}
}
//-----------------------------------------------------------------------------
Dropdown.prototype.showIframe=function(obj,fldObj,callback,mouseX,mouseY)
{
	dropObj.cnt=0;
	dropObj.type=obj;
	dropObj.obj=fldObj;
	dropObj.date=obj;
	dropObj.callback=callback;
	dropObj.mouseX=mouseX;
	dropObj.mouseY=mouseY;

	// load the script versions
	// (note: portal object doesn't exist onload of the script file)
	envLoadWindowScriptVersions(dropObj.portalWnd.oVersions,window,dropObj.portalWnd);

	if (typeof(obj) == "string")
		dropObj.menuInit();
	else
		dropObj.buildCalItem();
}
