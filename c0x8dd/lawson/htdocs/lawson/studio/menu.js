/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/menu.js,v 1.10.34.2 2012/08/08 12:48:50 jomeli Exp $ */
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
//
// menu manager - manages all menubars
// menubar - manages all menus
// menu - has menuitems
// menuitem has caption, image, may have menuitems
//
// for accessibility, menuitems which are command
// constants should not be renamed,
// something such as a page element could be renamed.
// dynlist is a list menu which monitors for a change to a set of array elements.

var hDisabled=true; // highlight disabled?

var pxRow=18;
var pxBreakRow=10;
var pxEdge=4;
var pxWidth=120;

var imagesURL="images/";
var barURL=imagesURL+"bar.gif";
var checkedURL=imagesURL+"checked.gif";
var checkedDimURL=imagesURL+"checked_dim.gif";
var spacerURL=imagesURL+"spacer.gif";
var submenuURL=imagesURL+"submenu.gif";
var submenuHiURL=imagesURL+"submenu_hi.gif";

//-----------------------------------------------------------------------------
function ContextMenuItem(cell,menuFcn,type)
{
	this.cell=cell;
	this.menu=null;
	this.menuFcn=menuFcn;
	this.menuItems=null;
	this.menuPop=null;
	this.oXML=null;
	this.parentMenus=null;
	this.popped=false;
	this.type=type;
}
ContextMenuItem.prototype.arrowItem = function(m,incr)
{
	var arr=(this.hasDynlist()?this.menuItemHTCs:this.menuItems);
	var len=(arr?arr.length:0);
	var index=-1;
	for (var i=0;i<len && (index==-1);i++)
		if (arr[i]==m)
			index=i;
	if (index!=-1)
	{
		// check to make sure the next item is not a break
		var twice=false;
		var menu;
		while (!twice)
		{
			index+=incr;
			
			// bounds check
			if (index<0)
				index=(len-1);
			if (index>(len-1))
				index=0;
			
			// if menu is unique and not a break, select it
			if (arr[index]!=m) 
			{
				if (!arr[index].isBreak())
				{
					(this.getMenuBar()).setActiveMenu(arr[index],true);
					return;
				}
			}
			else
				twice=true; // stop iterating through, reached the start node
		}
	}	
}
ContextMenuItem.prototype.arrowDown = function(m)
{
	if (m)
		this.arrowItem(m,1);
	else
	{
		this.pop()
		this.first();
	}
}
ContextMenuItem.prototype.arrowUp = function(m)
{
	if (m)
		this.arrowItem(m,-1);
	else
	{
		var arr=(this.hasDynlist()?this.menuItemHTCs:this.menuItems);
		var len=(arr?arr.length:0);
		if (len)
		{
			this.pop();
			(this.getMenuBar()).setActiveMenu(arr[len-1],true);
		}
	}
}
ContextMenuItem.prototype.first = function()
{
	var arr=(this.hasDynlist()?this.menuItemHTCs:this.menuItems);
	var len=(arr?arr.length:0);
	if (len)
		(this.getMenuBar()).setActiveMenu(arr[0],true);
}
ContextMenuItem.prototype.getMenuBar = function()
{
	return (designStudio.menuBar);
}
ContextMenuItem.prototype.getMenuItems=function()
{
	if (this.type!="static" || !this.menuItems)
	{	
		var dl=this.menuFcn();
		this.menuItems=(dl?dl.childNodes:null);
	}
	return (this.menuItems);
}
ContextMenuItem.prototype.getMenuMan = function()
{
	return (designStudio.menuMan);
}
ContextMenuItem.prototype.getTopMenu = function()
{
	return null;
}
ContextMenuItem.prototype.getVisBreakCount=function()
{
	var oMenuItems=this.getMenuItems();
	var len = (oMenuItems?oMenuItems.length:0);
	var c=0;
	for (var i=0;i<len;i++)
	{
		if (menus.detVisible(oMenuItems[i]) && menus.isBreak(oMenuItems[i]))
			c++;
	}
	return c;
}
ContextMenuItem.prototype.getVisCount=function()
{
	var oMenuItems=this.getMenuItems();
	var len=(oMenuItems?oMenuItems.length:0);
	var c=0;
	for (var i=0;i<len;i++)
	{
		if (menus.detVisible(oMenuItems[i]))
			c++;
	}
	return c;
}
ContextMenuItem.prototype.hasDynlist = function()
{
	return true;
}
ContextMenuItem.prototype.hide = function()
{
	// need to do this first to set popped
	// show mouse out popped = false
	if (this.popped)
		this.menuPop.hide();
	this.showMouseOut();
}
ContextMenuItem.prototype.pop = function()
{
	var c=this.getVisCount();
	if (!c)
		return;

	if (this.hasDynlist())
	{
		if (this.menuPop) {
			this.menuPop.hide(); // sets this.popped to false
			this.menuPop.span=null;
			this.menuPop=null;
		}
		this.menuItemHTCs=null;
	}

	if (!this.popped)
	{
		// Create the pop-up menu
		if (!this.menuPop)
			this.menuPop=new MenuPop(this.getMenuMan(),this);
		//else
		this.prepare();
		this.menuPop.display(menus.DIR_EAST);
	}
	this.first();
}
ContextMenuItem.prototype.prepare = function()
{
	var len=(this.menuItemHTCs?this.menuItemHTCs.length:0);
	for(var i=0;i<len;i++)
		this.menuItemHTCs[i].prepare();
}
ContextMenuItem.prototype.showMouseOut = function()
{
}
ContextMenuItem.prototype.showMouseOver = function()
{
}
ContextMenuItem.prototype.unpop = function()
{
	//this.hide();
	(this.getMenuBar()).setActiveMenu(null);
}

//-----------------------------------------------------------------------------
function MenuItem(m,n)
{
	this.cell=null;
	this.menu=m;
	this.menuItems=null;
	this.menuPop=null;
	this.oXML=n;
	this.popped=false;
	this.parentMenus=null;
	this.detParentMenus();
	this.load();
}
MenuItem.prototype.arrowItem = function(m,incr)
{
	var arr=(this.hasDynlist()?this.menuItemHTCs:this.menuItems);
	var len=(arr?arr.length:0);
	var index=-1;
	for (var i=0;i<len && (index==-1);i++)
		if (arr[i]==m)
			index=i;
	if (index!=-1)
	{
		// check to make sure the next item is not a break
		var twice=false;
		var menu;
		while (!twice)
		{
			index+=incr;
			
			// bounds check
			if (index<0)
				index=(len-1);
			if (index>(len-1))
				index=0;
			
			// if menu is unique and not a break, select it
			if (arr[index]!=m) 
			{
				if (!arr[index].isBreak())
				{
					(this.getMenuBar()).setActiveMenu(arr[index],true);
					return;
				}
			}
			else
				twice=true; // stop iterating through, reached the start node
		}
	}	
}
MenuItem.prototype.arrowDown = function(m)
{
	if (m)
		this.arrowItem(m,1);
	else
	{
		this.pop()
		this.first();
	}
}
MenuItem.prototype.arrowUp = function(m)
{
	if (m)
		this.arrowItem(m,-1);
	else
	{
		var arr=(this.hasDynlist()?this.menuItemHTCs:this.menuItems);
		var len=(arr?arr.length:0);
		if (len)
		{
			this.pop();
			(this.getMenuBar()).setActiveMenu(arr[len-1],true);
		}
	}
}
MenuItem.prototype.click = function()
{
	// behavior - when not enabled, a click will keep the menu open.
	if (!this.getEnabled())
		return;
	if (this.menuItems || this.hasDynlist())
	{
		this.pop();
		this.showMouseOver(true);
	}
	else
		this.perform();
}
MenuItem.prototype.detParentMenus = function()
{
	// parents of menu, from bottom to top
	this.parentMenus=new Array();
	this.parentMenus.push(this);
	var tempM=this;
	while (tempM && tempM.menu)
	{
		this.parentMenus.push(tempM.menu);
		tempM=tempM.menu;
	}
}
MenuItem.prototype.disable = function()
{
	this.oXML.setAttribute(menus.ATTR_ENABLED,"0");
	this.hide();
	if (this.cell)
		this.cell.className="dsMenuDisabled";
}
MenuItem.prototype.display = function(table)
{
	var v=this.getVisible();
	if (!v)
		return;
	var r=table.insertRow(table.rows.length);
	var enabled=this.getEnabled();
	r.className=(enabled?"dsMenu":"dsMenuDisabled");
	r.onclick=menuItemClick;
	r.onmouseout=menuItemMouseOut;
	r.onmouseover=menuItemMouseOver;
	r.onselectstart=blockSelect;
	this.cell=r;
	this.cell.menuObj=this;
	// c0 - is this a break line, imgNode, check box or spacer
	this.c0=r.insertCell(0);
	this.c0.row=r;
	this.c0.menuObj=this;
	this.c0.style.whiteSpace="nowrap";
	var caption=this.getCaption();
	//if (caption==menus.TAG_BREAK)
	if (this.isBreak())
	{
		this.c0.colSpan=4;
		this.c0.style.overflowY="hidden";
		this.hrspan=document.createElement("span");
		this.hrspan.row=r;
		this.hrspan.style.position="relative";
		this.hrspan.style.top="-4px";
		this.hrspan.style.height=pxBreakRow+"px";
		this.hrspan.style.overflowY="hidden";
		this.hr=document.createElement("hr");
		this.hr.row=r;
		this.hrspan.appendChild(this.hr);
		this.c0.appendChild(this.hrspan);
	}
	else
	{
		var img=this.getImg();
		var checked=this.getChecked();
		if (img || checked)
		{
			this.imgNode=document.createElement("img");
			this.imgNode.className="dsImage";
			// checked overrides img
			if (checked)
				this.imgNode.src=(enabled?checkedURL:checkedDimURL);
			else
				this.imgNode.src=img;
			this.imgNode.row=r;
			this.c0.appendChild(this.imgNode);
		} else {
			this.imgNode=document.createElement("img");
			this.imgNode.className="dsImage";
			//this.imgNode.src=spacerURL;
			this.imgNode.style.visibility="hidden";
			this.imgNode.row=r;
			this.c0.appendChild(this.imgNode);
		}
		with (this.imgNode.style)
		{
			height="10px";
			width="10px";
		}
		// c1 - captionNode
		this.c1=r.insertCell(1);
		this.c1.row=r;
		this.c1.menuObj=this;
		this.c1.style.whiteSpace="nowrap";
		this.captionNode=document.createTextNode(caption+(this.getEllipses()?"...":""));
		this.c1.appendChild(this.captionNode);
		// c2 - shortcutNode
		this.c2=r.insertCell(2);
		this.c2.row=r;
		this.c2.menuObj=this;
		this.c2.style.textAlign="right";
		this.c2.style.whiteSpace="nowrap";
		var shortcut=this.getShortcut();
		if (shortcut)
		{
			this.shortcutNode=document.createTextNode(shortcut);
			this.c2.appendChild(this.shortcutNode);
		} else {
			img=document.createElement("img");
			img.className="dsImage";
			img.src=spacerURL;
			img.style.visibility="hidden";
			img.row=r;
			this.c2.appendChild(img);
		}
		// c3 - submenuNode
		this.c3=r.insertCell(3);
		this.c3.row=r;
		this.c3.menuObj=this;
		this.c3.style.textAlign="center";
		this.c3.style.whiteSpace="nowrap";
		this.c3.style.width="16px";
		this.submenuNode=document.createElement("img");
		this.submenuNode.className="dsImage";
		this.submenuNode.row=r;
		var visCount=this.getVisCount();
		var dynlist=this.hasDynlist();
		this.submenu=(visCount || dynlist);
		if (this.submenu)
		{
			this.submenuNode.src=submenuURL;
			with (this.submenuNode.style)
			{
				height="10px";
				width="10px";
			}
		} else {
			//this.submenuNode.src=spacerURL;
			this.submenuNode.style.visibility="hidden";
		}
		this.c3.appendChild(this.submenuNode);
	}
}
MenuItem.prototype.enable = function()
{
	this.oXML.setAttribute(menus.ATTR_ENABLED,"1");
	if (this.cell)
		this.cell.className="dsMenu";
}
// findMenuObj - find a menu object (menu or menuitem)
// mid is the menu id to find
MenuItem.prototype.findMenuObj = function(mid)
{
	var ret=null;
	if (this.id==mid)
		return this;
	var arr=(this.hasDynlist()?this.menuItemHTCs:this.menuItems);
	var len=(arr?arr.length:0);
	for (var i=0;i<len && !ret;i++)
		ret=arr.findMenuObj(mid);
	return ret;
}
MenuItem.prototype.first = function()
{
	var arr=(this.hasDynlist()?this.menuItemHTCs:this.menuItems);
	var len=(arr?arr.length:0);
	if (len)
		(this.getMenuBar()).setActiveMenu(arr[0],true);
}
MenuItem.prototype.getCaption = function()
{
	return menus.detCaption(this.oXML, this.getMenuMan());
}
MenuItem.prototype.getChecked = function()
{
	return menus.detChecked(this.oXML);
}
MenuItem.prototype.getDynlist = function()
{
	return menus.detDynlist(this.oXML);
}
MenuItem.prototype.getEllipses = function()
{
	return menus.detEllipses(this.oXML);
}
MenuItem.prototype.getEnabled = function()
{
	return menus.detEnabled(this.oXML);
}
MenuItem.prototype.getId = function()
{
	return menus.detId(this.oXML);
}
MenuItem.prototype.getImg = function()
{
	return menus.detImg(this.oXML);
}
MenuItem.prototype.getImgAny = function()
{
	var i=this.getImg();
	if (!i)
		i=spacerURL;
	return i;
}
MenuItem.prototype.getMenuBar = function()
{
	return (this.menu.getMenuBar());
}
MenuItem.prototype.getMenuItems = function()
{
	var ret;
	if (this.hasDynlist())
	{
		var dl=this.getDynlist();
		ret=(dl?dl.childNodes:null);
	}
	else
		ret=this.oXML.childNodes;
	return ret;
}
MenuItem.prototype.getMenuMan = function()
{
	var m=this.menu;
	if (m)
		return m.getMenuMan();
	else
		return null;
}
MenuItem.prototype.getShortcut = function()
{
	return menus.detShortcut(this.oXML);
}
MenuItem.prototype.getTitle = function()
{
	return menus.detTitle(this.oXML,this.getMenuMan());
}
MenuItem.prototype.getTopMenu = function()
{
	return (this.menu.getTopMenu());
}
MenuItem.prototype.getVisBreakCount = function()
{
	var oMenuItems=this.getMenuItems();
	var len = (oMenuItems?oMenuItems.length:0);
	var c=0;
	for (var i=0;i<len;i++)
	{
		if (menus.detVisible(oMenuItems[i]) && menus.isBreak(oMenuItems[i]))
			c++;
	}
	return c;
}
MenuItem.prototype.getVisCount = function()
{
	var oMenuItems=this.getMenuItems();
	var len=(oMenuItems?oMenuItems.length:0);
	var c=0;
	for (var i=0;i<len;i++)
	{
		if (menus.detVisible(oMenuItems[i]))
			c++;
	}
	return c;
}
MenuItem.prototype.getVisible = function()
{
	return menus.detVisible(this.oXML);
}
MenuItem.prototype.hasDynlist = function()
{
	return menus.hasDynlist(this.oXML);
}
MenuItem.prototype.hide = function()
{
	// need to do this first to set popped
	// show mouse out popped = false
	if (this.popped)
		this.menuPop.hide();
	this.showMouseOut();
}
MenuItem.prototype.isBreak = function()
{
	return menus.isBreak(this.oXML);
}
MenuItem.prototype.last = function()
{
	var arr=(this.hasDynlist()?this.menuItemHTCs:this.menuItems);
	var len=(arr?arr.length:0);
	if (len)
		(this.getMenuBar()).setActiveMenu(arr[len-1],true);
}
MenuItem.prototype.load = function(n)
{
	if (n)
		this.oXML=n;
	var id=this.oXML.getAttribute(menus.ATTR_ID);
	if (!id)
		id=document.uniqueID;
	this.id=id;
	this.loadChildren();
}
MenuItem.prototype.loadChildren = function(n)
{
	if (!n)
		n=this.oXML.childNodes;
	this.menuItems=null;
	var len = (n?n.length:0);
	if (len)
	{
		this.menuItems=new Array();
		var m_i;
		var n_i;
		for(var i=0;i<len;i++)
		{
			n_i=this.oXML.childNodes[i];
			if (n_i.tagName==menus.TAG_ITEM)
			{
				m_i=new MenuItem(this,n_i);
				this.menuItems.push(m_i);
			}
		}
	}
}
MenuItem.prototype.mouseOver = function()
{
	var mb=this.getMenuBar();
	if (mb)
		mb.setActiveMenu(this);
	this.showMouseOver(true);
}
MenuItem.prototype.mouseOut = function()
{
	this.showMouseOut(false);
}
MenuItem.prototype.onKeyDown = function(evt)
{
	var b=false;
	if (!evt)
		evt=window.event;
	if (!b)
	{
		var mb=this.getMenuBar();
		if (mb && (mb.isActiveMenuById(this)))
		{
			switch (evt.keyCode)
			{
				case keys.ENTER:
					if (this.menuItems || this.hasDynlist())
					{
						this.pop();
						this.first();
					}
					else
						this.click();
					b=true;
					break;
				case keys.ESCAPE:
					this.unpop();
					b=true;
					break;
				case keys.END:
					this.menu.last();
					b=true;
					break;
				case keys.HOME:
					this.menu.first();
					b=true;
					break;
				case keys.LEFT_ARROW:
					this.unpop();
					var mb=this.getMenuBar();
					if (mb)
						mb.arrowLeft(this.menu);
					b=true;
					break;
				case keys.UP_ARROW:
					if (this.popped)
						this.arrowUp();
					else
						this.menu.arrowUp(this);
					b=true;
					break;
				case keys.RIGHT_ARROW:
					//if (this.popped)
					//{
					//	this.arrowDown();
					//}
					//else
					if (this.menuItems || (this.hasDynlist() && !this.popped))
					{
						this.pop();
						this.first();
					}
					else
					{
						var mb=this.getMenuBar();
						if (mb)
							mb.arrowRight(this.getTopMenu());
					}
					b=true;
					break;
				case keys.DOWN_ARROW:
					if (this.popped)
						this.arrowDown();
					else
						this.menu.arrowDown(this);
					b=true;
					break;
				// in visual studio, pageup and page down ignored if active menu exists
				case keys.PAGE_UP:
				case keys.PAGE_DOWN:
					b=true;
					break;
				default:
					break;
			}
		}
	}
	return b;
}
MenuItem.prototype.perform = function()
{
	this.hide();
	var mb=this.getMenuBar();
	if (mb)
		mb.setActiveMenu(null);
	window.setTimeout("window.menus.perform('"+this.id+"')",50);
}
MenuItem.prototype.pop = function()
{
	var c=this.getVisCount();
	if (!c)
		return;

	if (this.hasDynlist())
	{
		if (this.menuPop) {
			this.menuPop.hide(); // sets this.popped to false
			this.menuPop.span=null;
			this.menuPop=null;
		}
		this.menuItemHTCs=null;
	}

	if (!this.popped)
	{
		// Create the pop-up menu
		if (!this.menuPop)
			this.menuPop=new MenuPop(this.getMenuMan(),this);
		//else
		this.prepare();
		this.menuPop.display(menus.DIR_EAST);
	}
}
MenuItem.prototype.prepare = function()
{
	var en=this.getEnabled();
	if (this.cell)
		this.cell.className=(en?"dsMenu":"dsMenuDisabled");;
	if (this.imgNode)
	{
		if (this.getChecked())
		{
			this.imgNode.src=(en?checkedURL:checkedDimURL);
			this.imgNode.style.visibility="inherit";
		}
		else
			this.imgNode.src=this.getImgAny();
	}
	var len=(this.menuItemHTCs?this.menuItemHTCs.length:0);
	for(var i=0;i<len;i++)
		this.menuItemHTCs[i].prepare();
}
MenuItem.prototype.setEnabled = function(en)
{
	if (en)
		this.enable();
	else
		this.disable();
}
MenuItem.prototype.setChecked = function(ch)
{
	this.oXML.setAttribute(menus.ATTR_CHECKED,(ch?"1":"0"));
	if (this.imgNode)
	{
		if (ch)
			this.imgNode.src=((this.getEnabled())?checkedURL:checkedDimURL);
		else
			this.imgNode.src=this.getImgAny();
		this.imgNode.style.visibility=(ch?"inherit":"hidden");
	}
}
MenuItem.prototype.setImage = function(img)
{
	if (img)
	{
		this.oXML.setAttribute(menus.ATTR_IMG,img);
		if (this.imgNode)
		{
			this.imgNode.src=this.img;
			this.imgNode.style.visibility="inherit";
		}
	} else {
		if (this.imgNode)
		{
			this.imgNode.src=spacerURL;
			this.imgNode.style.visibility="hidden";
		}
	}
}
MenuItem.prototype.showMouseOut = function()
{
	if (this.popped)
		return;
	// unhighlight parent menus
	this.menu.showMouseOut();
	var en=this.getEnabled();
	if (this.cell)
		this.cell.className=(en?"dsMenu":"dsMenuDisabled");
	if (this.submenu && this.submenuNode)
		this.submenuNode.src=submenuURL;
}
MenuItem.prototype.showMouseOver = function(isMouse)
{
	// highlight parent menus
	this.menu.showMouseOver();
	var en=this.getEnabled();
	if (this.cell)
		this.cell.className=(en?"dsMenuItemMouseOver":(isMouse?"dsMenuDisabled":"dsMenuItemMouseOverDisabled"));
	if (this.submenu && this.submenuNode)
		this.submenuNode.src=submenuHiURL;
}
MenuItem.prototype.unpop = function()
{
	// if popped, hide pop
	// otherwise, unpop parent menu
	var p=this.popped;
	this.hide();
	if (p)
		(this.getMenuBar()).setActiveMenu(this,true);
	else
		this.menu.unpop();
}
//
// MenuItem event routines
//
function menuItemMouseOver()
{
	var t=window.event.srcElement;
	if (t && t.menuObj)
		t.menuObj.mouseOver();
}
function menuItemMouseOut()
{
	var t=window.event.srcElement;
	if (t && t.menuObj)
		t.menuObj.mouseOut();
}
function menuItemClick()
{
	var t=window.event.srcElement;
	if (t && t.menuObj)
		t.menuObj.click();
}

//-----------------------------------------------------------------------------
function MenuManager(b)
{
	this.menuBars=new Array();
	this.menuPops=new Array();
	this.bounds=b;
	this.span=null;
}
MenuManager.prototype.addMenuBar = function(mb)
{
	this.menuBars.push(mb);
}
MenuManager.prototype.addMenuPop = function(mp)
{
	var len=(this.menuPops?this.menuPops.length:0);
	for (var i=0;i<len;i++)
	{
		if (this.menuPops[i]==mp)
			return;
	}
	this.menuPops.push(mp);
}
// findMenuObj - find a menu object (menu or menuitem)
// mid is the menu id to find
MenuManager.prototype.findMenuObj = function(mid)
{
	var ret=null;
	var len=(this.menuBars?this.menuBars.length:0);
	for (var i=0;i<len && !ret;i++)
		ret=this.menuBars[i].findMenuObj(mid);
	return ret;
}
MenuManager.prototype.hideMenuBars = function()
{
	var len=(this.menuBars?this.menuBars.length:0);
	for (var i=0;i<len;i++)
		this.menuBars[i].setActiveMenu(null);
}
MenuManager.prototype.hideMenuBarsExcept = function(mb)
{
	var len=(this.menuBars?this.menuBars.length:0);
	for (var i=0;i<len;i++)
	{
		if (this.menuBars[i]!=mb)
			this.menuBars[i].visible=false;
	}
}
MenuManager.prototype.hideMenuPops = function()
{
	// hide menu pops, starting first with outermost
	var len=(this.menuPops?this.menuPops.length:0);
	for (var i=len-1;i>=0;i--)
		this.menuPops[i].hide();
	this.menuPops=new Array()
}
MenuManager.prototype.getPhrase = function (pid)
{
	var p=null;
	if(window.designStudio.activeDesigner && window.designStudio.activeDesigner.stringTable)
		p=window.designStudio.activeDesigner.stringTable.getPhrase(pid);
	if (!p || (p==pid))
		p=window.designStudio.stringTable.getPhrase(pid);
	return p;
}
// renamed for consistency with studio.js
// used to be onkeydown
MenuManager.prototype.handleKeyboardEvent = function(evt)
{
	if (!evt)
		evt=window.event;
	var b=false;
	var len=(this.menuBars?this.menuBars.length:0);
	for (var i=0;i<len && !b;i++)
		b|=this.menuBars[i].onKeyDown(evt);
	return b;
}
// setChecked
// mid is the menu id to check
// ch is the state, checked/unchecked
// returns the found menu object or null if not found
MenuManager.prototype.setChecked = function(mid,ch)
{
	var mObj=this.findMenuObj(mid);
	if (mObj && mObj.setChecked)
	{
		mObj.setChecked(ch);
		return mObj;
	}
	else
		return null;
}
// setEnabled
// mid is the menu id to check
// en is the state, enabled/disabled
// returns the found menu object or null if not found
MenuManager.prototype.setEnabled = function(mid,en)
{
	var mObj=this.findMenuObj(mid);
	if (mObj && mObj.setEnabled)
	{
		mObj.setEnabled(en);
		return mObj;
	}
	else
		return null;
}

//-----------------------------------------------------------------------------
function MenuPop(menuMan,menu)
{
	this.menuMan=menuMan;
	this.menu=menu;
	this.span=null;
}
// pos is a dir wrt parent element
MenuPop.prototype.display = function(pos)
{
	if (!this.span)
	{
		this.span=window.document.createElement("span");
		this.span.style.position="absolute";
		this.span.className="dsMenuPop";
		this.span.style.zIndex="999";
		this.span.style.visibility="hidden";
		window.document.body.appendChild(this.span);

		// popup contents
		var table=document.createElement("table");
		table.width="100%";
		table.cellPadding="2";
		table.cellSpacing="0";
		table.style.zIndex="999";

		// if menuitems have not been created, and are to be visible, create them
		// also if has a dynamic list, be sure to try to update them again.
		if (!this.menu.menuItemHTCs || this.menu.hasDynList())
		{
			var arrMenuItems=this.menu.getMenuItems();
			var len=(arrMenuItems?arrMenuItems.length:0);
			var mis=new Array();
			var omi;
			for(var i=0;i<len;i++)
			{
				omi=new window.MenuItem(this.menu,arrMenuItems[i]);
				mis.push(omi);
			}
			this.menu.menuItemHTCs = mis;
		}

		// display visible menu items
		var items=this.menu.menuItemHTCs;
		var lenHTCs=(items?items.length:0);
		for(var i=0;i<lenHTCs;i++)
			items[i].display(table);
		this.span.appendChild(table);
	}
	if (!this.menu)
		return;
	// popup coordinates
	var cell=this.menu.cell;
	detCoords(cell);
	var ix;
	var iy;
	var ih;
	var iw;
	var count=this.menu.getVisCount();
	var breakCount=this.menu.getVisBreakCount();
	if (pos==menus.DIR_SOUTH)
	{
		ix=cell.detLeft;
		iy=cell.detBottom;
		ih=(pxRow*(count-breakCount)+pxBreakRow*breakCount)+pxEdge;
		iw=pxWidth;
	}
	else if (pos==menus.DIR_EAST)
	{
		ix=cell.detRight-pxEdge;
		iy=cell.detTop;
		ih=pxRow*count+pxEdge;
		iw=pxWidth;
	}
	else
		alert("pos not known");
	with (this.span.style)
	{
		left=ix+"px";
		top=iy+"px";
		height=ih+"px";
		width=iw+"px";
		visibility="visible";
	}
	this.menu.popped=true;
	this.menuMan.addMenuPop(this);
}
MenuPop.prototype.hide = function()
{
	if (this.span)
		this.span.style.visibility="hidden";
	this.menu.popped=false;
}
//-----------------------------------------------------------------------------
function Menus()
{
}
Menus.prototype.ATTR_CAPTION = "caption";
Menus.prototype.ATTR_CAPTIONID = "captionid";
Menus.prototype.ATTR_CHECKED = "checked";
Menus.prototype.ATTR_ELLIPSES = "ellipses";
Menus.prototype.ATTR_ENABLED = "enabled";
Menus.prototype.ATTR_ID = "id";
Menus.prototype.ATTR_IMG = "img";
Menus.prototype.ATTR_SCRIPT = "script";
Menus.prototype.ATTR_SHORTCUT = "shortcut";
Menus.prototype.ATTR_TITLE = "title";
Menus.prototype.ATTR_TITLEID = "titleid";
Menus.prototype.ATTR_VISIBLE = "visible";
Menus.prototype.ATTR_DYNLIST = "dynlist";
Menus.prototype.DIR_EAST = 6;
Menus.prototype.DIR_NORTH = 2;
Menus.prototype.DIR_SOUTH = 8;
Menus.prototype.DIR_WEST = 4;
Menus.prototype.TAG_BREAK = "-";
Menus.prototype.TAG_EVAL = "eval_";
Menus.prototype.TAG_EVAL_LEN = 5;
Menus.prototype.TAG_ITEM = "ITEM";
Menus.prototype.TAG_MENU = "MENU";
Menus.prototype.TAG_MENUBAR = "MENUBAR";
//
Menus.prototype.detCaption = function(n,menuMan)
{
	if (!n)
		return "";
	var cid=n.getAttribute(this.ATTR_CAPTIONID);
	if (cid && menuMan)
		return menuMan.getPhrase(cid);
	else
	{
		var c=n.getAttribute(this.ATTR_CAPTION);
		if (c && c.indexOf(this.TAG_EVAL)>-1)
		{
			try
			{
				c=(eval(c.substring(this.TAG_EVAL_LEN)));
			}
			catch (e) {
				c="";
			}
		}
	}
	return (c?c:"");
}
Menus.prototype.detChecked = function(n)
{
	if (!n)
		return false;
	return this.detStandard(n,this.ATTR_CHECKED);
}
Menus.prototype.detDynlist = function(n)
{
	if (!n)
		return false;
	return this.detStandard(n,this.ATTR_DYNLIST);
}
Menus.prototype.detEllipses = function(n)
{
	if (!n)
		return false;
	return this.detStandard(n,this.ATTR_ELLIPSES);
}
Menus.prototype.detEnabled = function(n)
{
	if (!n)
		return false;
	if (this.isBreak(n))
		return false;
	// not standard - assume enabled if not mentioned
	var c=n.getAttribute(this.ATTR_ENABLED);
	if (c && (c.indexOf(this.TAG_EVAL)>-1))
	{
		try
		{
			return (eval(c.substring(this.TAG_EVAL_LEN)));
		}
		catch(e)
		{
			return false;
		}
	}
	else if (c)
		return (c=="1");
	else
		return true; // by default assume an object is enabled
}
Menus.prototype.detId = function(n)
{
	if (!n)
		return "";
	// not standard - assume unique id if not given
	var c=n.getAttribute(this.ATTR_ID);
	if (c && (c.indexOf(this.TAG_EVAL)>-1))
	{
		try
		{
			c=(eval(c.substring(this.TAG_EVAL_LEN)));
		}
		catch(e)
		{
			c="";
		}
	}
	else if (!c)
		c=document.uniqueID;
	return (c?c:"");
}
Menus.prototype.detImg = function(n)
{
	if (!n)
		return "";
	return this.detStandard(n,this.ATTR_IMG);
}
Menus.prototype.detStandard = function(n,t)
{
	if (!n)
		return false;
	var c=n.getAttribute(t);
	if (c && (c.indexOf(this.TAG_EVAL)>-1))
		try
		{
			return (eval(c.substring(this.TAG_EVAL_LEN)));
		}
		catch(e)
		{
			return false;
		}
	else
		return (c=="1");
}
Menus.prototype.detShortcut = function(n)
{
	if (!n)
		return "";
	var c=n.getAttribute(this.ATTR_SHORTCUT);
	if (c && (c.indexOf(this.TAG_EVAL)>-1))
	{
		try
		{
			c=(eval(c.substring(this.TAG_EVAL_LEN)));
		}
		catch(e)
		{
			c="";
		}
	}
	return (c?c:"");
}
Menus.prototype.detTitle = function(n,menuMan)
{
	if (!n)
		return "";
	var cid=n.getAttribute(this.ATTR_TITLEID);
	if (cid)
		c=menuMan.getPhrase(cid);
	else
	{
		var c=n.getAttribute(this.ATTR_TITLE);
		if (c && (c.indexOf(this.TAG_EVAL)>-1))
		{
			try
			{
				c=(eval(c.substring(this.TAG_EVAL_LEN)));
			}
			catch(e)
			{
				c="";
			}
		}
	}
	return (c?c:"");
}
Menus.prototype.detVisible = function(n)
{
	if (!n)
		return false;
	// not standard - assume visible if not mentioned
	var c=n.getAttribute(this.ATTR_VISIBLE);
	if (c && (c.indexOf(this.TAG_EVAL)>-1))
		try
		{
			return (eval(c.substring(this.TAG_EVAL_LEN)));
		}
		catch(e)
		{
			return true; // by default assume an object is visible
		}
	else if (c)
		return (c=="1");
	else
		return true; // by default assume an object is visible
}
Menus.prototype.hasDynlist = function(n)
{
	if (!n)
		return false;
	var c=n.getAttribute(this.ATTR_DYNLIST);
	var ret=(c && (c!="0"));
	return ret;
}
Menus.prototype.isBreak = function(n)
{
	var caption=this.detCaption(n);
	return (caption==this.TAG_BREAK);
}
Menus.prototype.perform = function(id)
{
	var h=null;

	// fcn(AKILA CODE)
	// fire the event and if it is handled, exit
	if(id == "ID_WINDOW_CLOSEALL" || id == "ID_FILE_CLOSE")
		h = designStudio.commandHandler;
	else
	{
		var des=designStudio.activeDesigner;
		if(des && des.commandHandler && des.readyState=="complete")
			h=des.commandHandler;
		else
			h=designStudio.commandHandler;
	}
	if (h)
		h.execute(id);
}
var menus=new Menus();

//-----------------------------------------------------------------------------
function detCoords(t)
{
	if (!t)
		return;
	// loop upwards, adding coordinates
 	var oTmp=t;
	var iTop=0;
	var iLeft=0;
	if (typeof(oTmp.offsetParent) != "object")
		return;
	while(oTmp.offsetParent)
	{
		iTop+=oTmp.offsetTop;
		iLeft+=oTmp.offsetLeft;
		oTmp=oTmp.offsetParent;
	}
	t.detLeft=iLeft;
	t.detTop=iTop;
	t.detWidth=parseInt(t.offsetWidth,10);
	t.detHeight=parseInt(t.offsetHeight,10);
	t.detRight=t.detLeft+t.detWidth;
	t.detBottom=t.detTop+t.detHeight;
}
function detTarget(e)
{
	if (e)
	{ 	// NS
		return (getEventElement(e));
	} else if (window.event)
	{ 	// IE
		return (getEventElement(window.event));
	}
	return null;
}
function getEventElement(evt)
{
    var elem
    if (evt.target)
        elem=((evt.target.nodeType == 3) ? evt.target.parentNode : evt.target);
    else
        elem=evt.srcElement;
    return elem;
}
function blockSelect()
{
	return false;
}
