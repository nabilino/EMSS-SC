/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/dialogs/maple.js,v 1.2.34.2 2012/08/08 12:48:48 jomeli Exp $ */
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

//-----------------------------------------------------------------------------
// basic tree object - node clustering like a maple leaf
//-----------------------------------------------------------------------------

var TAG_ITEM="ITEM";
var ON_BLUR="ON_BLUR";
var ON_CLOSE_MAPLE="ON_CLOSE_MAPLE";
var ON_DBLCLICK_LEAF="ON_DBLCLICK_LEAF";
var ON_FOCUS="ON_FOCUS";
var ON_SELECT_LEAF="ON_SELECT_LEAF";

var arrLeaves=new Array();

//-----------------------------------------------------------------------------
function Maple(elem)
{
	this.arrLeaves=null;
	this.arrRows=null;
	this.capture=false; // is this element set to receive all events?
	this.elem=elem;
	this.focused=false;
	this.hSpacing=20; // indent amt in px
	this.opened=true;
	this.selLeaf=null;
	this.sort=true; // sort nodes alphabetically?
	this.status="loading";
	this.useLBL=true; // add LBL to id for getting phrases
	this.useTITLE=true; // add TITLE to id for getting phrases
	
	// gfx - change for different look
	this.imgFolder="../images";
	this.folderClosedImg="../images/folderclosed.gif";
	this.folderOpenImg="../images/folderopen.gif";
	this.minusImg="../images/minus.gif";
	this.plusImg="../images/plus.gif";
	this.spacerImg="../images/spacer.gif";
	
	// functions
	this.complete=null;

	// elem events
	this.elem.maple=this;
	this.elem.onclick=mapleClick;
	this.elem.ondblclick=mapleDblClick;
	this.elem.onblur=mapleBlur;
	this.elem.onfocus=mapleFocus;
}

//-----------------------------------------------------------------------------
Maple.prototype.blurElem=function(elem)
{
	this.focused=false;
	
	if (this.selLeaf)
		this.selLeaf.blur();
		
	// prepare event data - maple and leaf
	var a=new Array();
	a.maple=this;
	a.leaf=null;

	// fire event
	var evtObj=window.createEventObject(ON_BLUR, null, null, a);
	window.processEvent(evtObj);

	if (this.capture)
	{
		// prepare event data - maple and leaf
		var a=new Array();
		a.maple=this;
		a.leaf=null;
	
		// fire event
		var evtObj=window.createEventObject(ON_CLOSE_MAPLE, null, null, a);
		window.processEvent(evtObj);
	}
}

//-----------------------------------------------------------------------------
Maple.prototype.clearTables=function()
{
	var lenTables=(this.arrTables?this.arrTables.length:0);
	for (var i=lenTables-1;i>=0;i--)
		this.elem.removeChild(this.arrTables[i]);
}

//-----------------------------------------------------------------------------
Maple.prototype.clickElem=function(elem)
{
	var b=false;
	if (elem)
	{
		if (elem.isPlus)
		{
			elem.leaf.clickPlusMinus(true);
			b=true;
		}
		else if (elem.isFolder)
		{
			elem.leaf.clickText(true);
			b=true;
		}
		else if (elem.isText)
		{
			elem.leaf.clickText(true);
			b=true;
		}
	}
}

//-----------------------------------------------------------------------------
Maple.prototype.collapseAll = function()
{
	var lenLeaves=(this.arrLeaves?this.arrLeaves.length:0);
	for (var i=0;i<lenLeaves;i++)
		this.arrLeaves[i].collapse();
}

//-----------------------------------------------------------------------------
Maple.prototype.dblClickElem=function(elem)
{
	var b=false;
	if (!this.status=="complete")
		return;
	if (elem)
	{
		if (elem.isPlus)
		{
			elem.leaf.clickPlusMinus(true);
			b=true;
		}
		else if (elem.isFolder && elem.leaf.children)
		{
			elem.leaf.clickPlusMinus(true);
			b=true;
		}
		else if (elem.isText && elem.leaf.children)
		{
			elem.leaf.clickPlusMinus(true);
			b=true;
		}
		else
		{
			if (elem.leaf)
			{
				elem.leaf.dblClickText(true);
				if (this.capture)
				{
					this.doUnsetCapture(true);
					b=true;
				}
			}
		}
	}
	
	if (!b && this.capture)
		this.blurElem();
}

//-----------------------------------------------------------------------------
Maple.prototype.dblClickLeaf=function(elem,mouse)
{
	// prepare event data - maple and leaf
	var a=new Array();
	a.maple=this;
	a.leaf=elem;
	a.mouse=mouse;

	// fire event
	var evtObj=window.createEventObject(ON_DBLCLICK_LEAF, null, null, a);
	window.processEvent(evtObj);
}

//-----------------------------------------------------------------------------
Maple.prototype.deselect=function(mouse)
{
	if (this.selLeaf)
	{
		this.selLeaf.deselect(mouse);
		this.selLeaf=null;
	}

	// prepare event data - maple and leaf
	var a=new Array();
	a.maple=this;
	a.leaf=null;
	a.mouse=mouse;

	// fire event
	var evtObj=window.createEventObject(ON_SELECT_LEAF, null, null, a);
	window.processEvent(evtObj);
}

//-----------------------------------------------------------------------------
Maple.prototype.doEnter=function(mouse)
{
	if (this.selLeaf)
		this.selLeaf.dblClickText();
}

//-----------------------------------------------------------------------------
Maple.prototype.doFirst=function(mouse)
{
	var lenTables=(this.arrTables?this.arrTables.length:0);
	for (var i=0;i<lenTables;i++)
	{
		var elem=this.arrTables[i].elem;
		if (elem.parentLeaf.opened)
		{
			elem.clickText(mouse);
			return;
		}
	}
}

//-----------------------------------------------------------------------------
Maple.prototype.doLast=function(mouse)
{
	var lenTables=(this.arrTables?this.arrTables.length:0);
	for (var i=lenTables-1;i>=0;i--)
	{
		var elem=this.arrTables[i].elem;
		if (elem.parentLeaf.opened)
		{
			elem.clickText(mouse);
			return;
		}
	}
}

//-----------------------------------------------------------------------------
Maple.prototype.doLeft=function()
{
	if (this.selLeaf)
	{
		var op=this.selLeaf.isOpened();
		var par=this.selLeaf.isParent();
		if (!par)
			this.selLeaf.parentLeaf.select();
		else if (op)
			this.selLeaf.togglePlus();
		else
			this.doUp();
	}
	return false;
}

//-----------------------------------------------------------------------------
Maple.prototype.doDown=function(mouse,delta)
{
	var pos=this.getPos();
	if (pos<0)
	{
		this.doLast(mouse);
		return;
	}
	delta=(delta?delta:1);
	var lenTables=(this.arrTables?this.arrTables.length:0);
	for (var i=pos+delta;i<lenTables;i++)
	{
		var elem=this.arrTables[i].elem;
		if (elem.parentLeaf.opened)
		{
			elem.clickText(mouse);
			return;
		}
	}
	this.doLast(mouse);
}

//-----------------------------------------------------------------------------
Maple.prototype.doPageDown=function(mouse)
{
	this.doDown(mouse,7);
}

//-----------------------------------------------------------------------------
Maple.prototype.doPageUp=function(mouse)
{
	this.doUp(mouse,7);
}

//-----------------------------------------------------------------------------
Maple.prototype.doRight=function()
{
	if (this.selLeaf)
	{
		var op=this.selLeaf.isOpened();
		var par=this.selLeaf.isParent();
		if (par)
		{
			if (!op)
				this.selLeaf.togglePlus();
			if (op)
			{
				// select first under the selected leaf
				var lenTables=(this.arrTables?this.arrTables.length:0);
				var pos=this.getPos();
				if (pos+1<lenTables)
				{
					var elem=this.arrTables[pos+1].elem;
					elem.clickText();
				}
			}
		}
	}
	return false;
}

//-----------------------------------------------------------------------------
Maple.prototype.doSetCapture=function()
{
	if (!this.capture)
	{
		this.capture=true;
		// need to have this order
		this.elem.setCapture();
		window.focus(); // req'd for the scrollbar to be clickable
		this.elem.focus();
		window.captureObj=this;
	}
}

//-----------------------------------------------------------------------------
Maple.prototype.doUnsetCapture=function(chg)
{
	if (this.capture)
	{
		this.capture=false;
		this.elem.releaseCapture();
		window.captureObj=null;

		// prepare event data - maple and leaf
		var a=new Array();
		a.maple=this;
		a.leaf=this.selLeaf;
		a.chg=chg;
	
		// fire event
		var evtObj=window.createEventObject(ON_CLOSE_MAPLE, null, null, a);
		window.processEvent(evtObj);
	}
}

//-----------------------------------------------------------------------------
Maple.prototype.doUp=function(mouse,delta)
{
	var pos=this.getPos();
	if (pos<0)
	{
		this.doFirst(mouse);
		return;
	}
	delta=(delta?delta:1);
	for (var i=pos-delta;i>=0;i--)
	{
		var elem=this.arrTables[i].elem;
		if (elem.parentLeaf.opened)
		{
			elem.clickText(mouse);
			return;
		}
	}
	this.doFirst(mouse);
}

//-----------------------------------------------------------------------------
Maple.prototype.expandAll = function()
{
	var lenLeaves=(this.arrLeaves?this.arrLeaves.length:0);
	for (var i=0;i<lenLeaves;i++)
		this.arrLeaves[i].expand();
}

//-----------------------------------------------------------------------------
Maple.prototype.focus=function()
{
	this.focused=true;
	if (this.selLeaf)
		this.selLeaf.blur();
		
	this.doFirst();
	try
	{
		this.elem.focus();
	}
	catch (e)
	{
	}
}

//-----------------------------------------------------------------------------
Maple.prototype.focusElem=function(elem)
{
	this.focused=true;
	if (this.selLeaf)
		this.selLeaf.blur();
		
	// fire event
	var evtObj=window.createEventObject(ON_FOCUS, null, null, this);
	window.processEvent(evtObj);
}

//-----------------------------------------------------------------------------
Maple.prototype.getId=function()
{
	return "";
}

//-----------------------------------------------------------------------------
Maple.prototype.getLeafId=function(id)
{
	var lenLeaves=(this.arrLeaves?this.arrLeaves.length:0);
	for (var i=0;i<lenLeaves;i++)
	{
		if (this.arrLeaves[i].getId()==id)
			return this.arrLeaves[i];
		else
		{
			var ret=this.arrLeaves[i].getLeafId(id);
			if (ret) return ret;
		}
	}
	return null;
}

//-----------------------------------------------------------------------------
Maple.prototype.getLeafPos=function(leaf)
{
	var lenLeaves=(this.arrLeaves?this.arrLeaves.length:0);
	for (var i=0;i<lenLeaves;i++)
	{
		if (this.arrLeaves[i]==leaf)
			return i;
	}
	return -1;
}

//-----------------------------------------------------------------------------
Maple.prototype.getLeafTitle=function(title)
{
	var lenLeaves=(this.arrLeaves?this.arrLeaves.length:0);
	for (var i=0;i<lenLeaves;i++)
	{
		if (this.arrLeaves[i].getTitlePhrase()==title)
			return this.arrLeaves[i];
		else
		{
			var ret=this.arrLeaves[i].getLeafTitle(title);
			if (ret) return ret;
		}
	}
	return null;
}

//-----------------------------------------------------------------------------
Maple.prototype.getMaple=function()
{
	// used by leaf to iterate to root node
	return this;
}

//-----------------------------------------------------------------------------
Maple.prototype.getPos=function()
{
	// returns selected position in arrTables array
	if (!this.selLeaf)
		return -1;
	var lenTables=(this.arrTables?this.arrTables.length:0);
	for (var i=0;i<lenTables;i++)
	{
		if (this.selLeaf==this.arrTables[i].elem)
			return i;
	}
	return -1;
}

//-----------------------------------------------------------------------------
Maple.prototype.getPhrase=function(id)
{
	if (!parent.getPhrase)
		return id;
	var ret=(parent.getPhrase(id));
	if ((this.useLBL) && (!ret || (ret==id)))
		ret=(parent.getPhrase("LBL_"+id));
	return ret;
}

//-----------------------------------------------------------------------------
Maple.prototype.getSelLeaf=function()
{
	return (this.selLeaf);
}

//-----------------------------------------------------------------------------
Maple.prototype.getTitlePhrase=function(id)
{
	var ret=id;
	if (parent.getPhrase && this.useTITLE)
		ret=parent.getPhrase("TITLE_"+id);
	return ret;
}

//-----------------------------------------------------------------------------
Maple.prototype.getValue=function()
{
	return (this.selLeaf);
}

//-----------------------------------------------------------------------------
Maple.prototype.handleKeyDown=function(evt)
{
	evt=(evt?evt:window.event);
	var b=false;
	var f=false;
	if (!evt.altKey && !evt.ctrlKey && !evt.shiftKey)
	{	
		switch (evt.keyCode)
		{
			case keys.DOWN_ARROW:
				this.doDown(true);
				b=true;
				f=true;
				break;
			case keys.END:
				this.doLast(true);
				b=true;
				f=true;
				break;
			case keys.ENTER:
				if (this.capture)
				{
					this.doUnsetCapture(true);
					b=true;
					f=false;
				}
				if (this.selLeaf)
					this.selLeaf.dblClickText(false);
				break;
			case keys.ESCAPE:
				if (this.capture)
				{
					this.doUnsetCapture(false);
					b=true;
					f=false;
				}
				break;
			case keys.HOME:
				this.doFirst(true);
				b=true;
				f=true;
				break;
			case keys.KEYPAD_PLUS:
				if (this.selLeaf)
					this.selLeaf.clickPlus(true);
				b=true;
				f=true;
				break;
			case keys.KEYPAD_MINUS:
				if (this.selLeaf)
					this.selLeaf.clickMinus(true);
				b=true;
				f=true;
				break;
			case keys.LEFT_ARROW:
				b=this.doLeft();
				f=b;
				break;
			case keys.PAGE_UP:
				this.doPageUp();
				b=true;
				break;
			case keys.PAGE_DOWN:
				this.doPageDown();
				b=true;
				break;
			case keys.RIGHT_ARROW:
				b=this.doRight();
				f=b;
				break;
			case keys.UP_ARROW:
				this.doUp(true);
				b=true;
				f=true;
				break;
		}
		if (!b)
		{
			var k=String.fromCharCode(evt.keyCode);
			var isLetter=((k >= "A") && (k <= "Z"));
			var isNumber=((k >= "1") && (k <= "0"));
			if (isLetter || isNumber)
			{
				b=this.navFirstLetter(k);
				if (b)
					f=true;
			}
		}
	}
	try
	{
		if (f)
			this.elem.focus();
	}
	catch(e){}
	return b;
}

//-----------------------------------------------------------------------------
Maple.prototype.isInside=function(x,y)
{
	detCoords(this.elem);
	var bh=((x>=this.elem.detLeft) && (x<=this.elem.detRight));
	var bv=((y>=this.elem.detTop) && (y<=this.elem.detBottom));
	return (bh && bv);
}

//-----------------------------------------------------------------------------
Maple.prototype.navFirstLetter=function(k)
{
	// slow typing behavior
	var lcn=k.toLowerCase();
	var lenLeaves=(this.arrLeaves?this.arrLeaves.length:0);
	
	var pos=-1;
	if (this.selLeaf)
	{
		var par=this.selLeaf;
		while(par.parentLeaf && !par.parentLeaf==this)
			par=par.parentLeaf;
		pos=this.getLeafPos(par);
	}
	var iStart=(pos+1);
	for (var i=iStart;i<lenLeaves;i++)
	{
		if (this.arrLeaves[i].getPhrase().substring(0,1).toLowerCase()==lcn)
		{
			this.arrLeaves[i].clickText();
			return true;
		}
	}
	for (var i=0;i<iStart && i<lenLeaves;i++)
	{
		if (this.arrLeaves[i].getPhrase().substring(0,1).toLowerCase()==lcn)
		{
			this.arrLeaves[i].clickText();
			return true;
		}
	}
	return false;
}

//-----------------------------------------------------------------------------
Maple.prototype.openToId = function(ctlId)
{
	var len = (this.arrLeaves?this.arrLeaves.length:0);
	for (var i=0;i<len;i++)
	   	this.arrLeaves[i].openToId(ctlId);
}

//-----------------------------------------------------------------------------
Maple.prototype.render=function()
{
	this.clearTables();
	this.arrTables=new Array();
	var lenLeaves=(this.arrLeaves?this.arrLeaves.length:0);
	if (lenLeaves)
	{
		var leaf=null;
		for (var i=0;i<lenLeaves;i++)
		{
			leaf=this.arrLeaves[i];
			//leaf.renderTable(this.elem,0,false);
			//leaf.renderTable(this.elem,0,leaf.opened);
			leaf.renderTable(this.elem,0,this.opened || leaf.opened);
		}
	}
	//this.doFirst(false);
	this.status="complete";
}

//-----------------------------------------------------------------------------
Maple.prototype.setSelLeaf=function(leaf,mouse)
{
	this.deselect(mouse);
	this.selLeaf=leaf;

	// prepare event data - maple and leaf
	var a=new Array();
	a.maple=this;
	a.leaf=leaf;
	a.mouse=mouse;
	
	// fire event
	var evtObj=window.createEventObject(ON_SELECT_LEAF, null, null, a);
	window.processEvent(evtObj);
}

//-----------------------------------------------------------------------------
Maple.prototype.setXML=function(xml)
{
	// set XML prepares the background object structure
	this.selLeaf=null;
	this.xml=xml;
	this.setXMLLeaves();
	this.render();
}

//-----------------------------------------------------------------------------
Maple.prototype.setXMLLeaves=function()
{
	// prepates this.arrLeaves based on this.xml
	this.arrLeaves=null;
	if (this.xml)
	{	
		var n=this.xml.childNodes;
		var len=(n?n.length:0);
		if (len)
		{
			this.arrLeaves=new Array();
			var m_i;
			var n_i;
			for(var i=0;i<len;i++)
			{
				n_i=this.xml.childNodes[i];
				if (n_i.tagName==TAG_ITEM)
				{
					m_i=new Leaf(this,n_i,false);
					this.arrLeaves.push(m_i);
				}
			}
			if (this.sort)
				this.arrLeaves.sort(alphaLeafSort);
		}
	}
}

//-----------------------------------------------------------------------------
function alphaLeafSort(a,b)
{
	var aText=a.getPhrase().toLowerCase();
	var bText=b.getPhrase().toLowerCase();
	if (aText < bText) return (-1);
	if (aText == bText) return (0);
	if (aText > bText) return (1);
}

//-----------------------------------------------------------------------------
function detCoords(t,restrict)
{
	if (!t)
		return;
	// loop upwards, adding coordinates
 	var oTmp=t;
	var iTop=0;
	var iLeft=0;
	if (typeof(oTmp.offsetParent) != "object")
		return;
	while(oTmp.offsetParent && (!restrict || (restrict!=oTmp.offsetParent)))
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
	t.detCoords=true;
}

//-----------------------------------------------------------------------------
function mapleBlur(evt)
{
	evt=(evt?evt:window.event);
	var elem=(evt?evt.srcElement:null);
	var maple=(elem?elem.maple:null);
	if (maple && !maple.isInside(evt.x,evt.y))
		maple.blurElem(elem);
}

//-----------------------------------------------------------------------------
function mapleClick(evt)
{
	evt=(evt?evt:window.event);
	var elem=(evt?evt.srcElement:null);
	if (elem)
	{	
		var maple=elem.maple;
		if (maple)
			maple.clickElem(elem);
	} else {
		if (window.captureObj)
			window.captureObj.clickElem(null);
	}
	if (window.captureObj && (!window.captureObj.isInside(evt.x,evt.y)))
		window.captureObj.clickElem(null);
}

//-----------------------------------------------------------------------------
function mapleDblClick(evt)
{
	evt=(evt?evt:window.event);
	var elem=(evt?evt.srcElement:null);
	var maple=(elem?elem.maple:null);
	if (maple)
		maple.dblClickElem(elem);
}

//-----------------------------------------------------------------------------
function mapleFocus(evt)
{
	evt=(evt?evt:window.event);
	var elem=(evt?evt.srcElement:null);
	var maple=(elem?elem.maple:null);
	if (maple)
		maple.focusElem(elem);
}

//-----------------------------------------------------------------------------
// basic leaf object - node consists of HTML space, image, text
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
function Leaf(parentLeaf,xml)
{
	this.folderImg=null;
	this.folderTitle=null;
	this.getHtmDoc();
	this.leafCount=0;
	this.maple=null;
	this.opened=false;
	this.parentLeaf=parentLeaf;
	this.selText=false;
	
	this.maple=this.getMaple();
	this.setXML(xml);

	this.leafCount=arrLeaves.length;
	arrLeaves[this.leafCount]=this;
}

//-----------------------------------------------------------------------------
Leaf.prototype.blur=function()
{
	this.textSpan.className=this.getTextClass();
}

//-----------------------------------------------------------------------------
Leaf.prototype.childSelected=function()
{
	// determine if a child is selected
	var lenLeaves=(this.arrLeaves?this.arrLeaves.length:0);
	for (var i=0;i<lenLeaves;i++)
		if (this.arrLeaves[i].isSel())
			return true;
	return false;
}

//-----------------------------------------------------------------------------
Leaf.prototype.clickMinus=function(mouse)
{
	if (!this.children)
		return;
	if (this.opened)
		this.togglePlus(mouse);
}

//-----------------------------------------------------------------------------
Leaf.prototype.clickPlus=function(mouse)
{
	if (!this.children)
		return;
	if (!this.opened)
		this.togglePlus(mouse);
}

//-----------------------------------------------------------------------------
Leaf.prototype.clickPlusMinus=function(mouse)
{
	if (!this.children)
		return;
	this.togglePlus(mouse);
}

//-----------------------------------------------------------------------------
Leaf.prototype.clickText=function(mouse)
{
	this.select(mouse);
}

//-----------------------------------------------------------------------------
Leaf.prototype.collapse = function()
{
	this.opened=false;
	this.updateElem();
}

//-----------------------------------------------------------------------------
Leaf.prototype.containsControlById = function(ctlId)
{
	// searches for ctlId in myself and my children
	var ret=false;
	if (this.hasId(ctlId))
		ret=true;
	if (!ret)
	{
		var len = (this.arrLeaves ? this.arrLeaves.length:0);
		for (var i=0;i<len && !ret;i++)
		   	ret|=this.arrLeaves[i].containsControlById(ctlId);
	}
	return ret;
}

//-----------------------------------------------------------------------------
Leaf.prototype.dblClickText=function(mouse)
{
	this.select(mouse);
	this.maple.dblClickLeaf(this,mouse);
}

//-----------------------------------------------------------------------------
Leaf.prototype.deselect=function(mouse)
{
	this.selText=false;
	this.textSpan.className=this.getTextClass();
}

//-----------------------------------------------------------------------------
Leaf.prototype.detCoords=function(t)
{
	//from menu.js
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
	t.detCoords=true;
}

//-----------------------------------------------------------------------------
Leaf.prototype.expand = function()
{
	this.opened=true;
	this.updateElem();
	var lenLeaves=(this.arrLeaves?this.arrLeaves.length:0);
	for (var i=0;i<lenLeaves;i++)
		this.lenLeaves[i].expand();
}

//-----------------------------------------------------------------------------
Leaf.prototype.getHtmDoc = function()
{
	if (!this.htmDoc)
		this.htmDoc=document;
	return (this.htmDoc);
}

//-----------------------------------------------------------------------------
Leaf.prototype.getFolderImg=function()
{
	/*
	if (this.folderImg)
		return (this.folderImg);
	else
		return (this.children?(this.opened?this.maple.folderOpenImg:this.maple.folderClosedImg):this.getIcon());
	*/
	if (this.folderImg)
		return (this.folderImg)
	else
		return (this.children?(this.selText?this.maple.folderOpenImg:this.maple.folderClosedImg):this.getIcon());
}

//-----------------------------------------------------------------------------
Leaf.prototype.getFolderTitle=function()
{
	return (this.folderTitle?this.folderTitle:"");
}

//-----------------------------------------------------------------------------
Leaf.prototype.getIcon=function()
{
	var icon=this.xml.getAttribute("icon");
	if (icon.indexOf("/") > -1)
		return icon;

	icon="../images/"+icon;
	if (icon.indexOf(".gif") == -1) icon+=".gif"
	return icon
}

//-----------------------------------------------------------------------------
Leaf.prototype.getId=function()
{
	return (this.xml.getAttribute("id"));
}

//-----------------------------------------------------------------------------
Leaf.prototype.getLeafId=function(id)
{
	var lenLeaves=(this.arrLeaves?this.arrLeaves.length:0);
	for (var i=0;i<lenLeaves;i++)
	{
		if (this.arrLeaves[i].getId()==id)
			return this.arrLeaves[i];
		else {
			var ret=this.arrLeaves[i].getLeafId(id);
			if (ret) return ret;
		}
	}
	return null;
}

//-----------------------------------------------------------------------------
Leaf.prototype.getLeafTitle=function(title)
{
	var lenLeaves=(this.arrLeaves?this.arrLeaves.length:0);
	for (var i=0;i<lenLeaves;i++)
	{
		if (this.arrLeaves[i].getTitlePhrase()==title)
			return this.arrLeaves[i];
		else {
			var ret=this.arrLeaves[i].getLeafTitle(title);
			if (ret) return ret;
		}
	}
	return null;
}

//-----------------------------------------------------------------------------
Leaf.prototype.getMaple=function()
{
	return (this.parentLeaf?this.parentLeaf.getMaple():null);
}

//-----------------------------------------------------------------------------
Leaf.prototype.getParentId=function()
{
	return (this.parentLeaf?this.parentLeaf.getId():null);
}

//-----------------------------------------------------------------------------
Leaf.prototype.getPhrase=function()
{
	return (this.getMaple().getPhrase(this.getId()));
}

//-----------------------------------------------------------------------------
Leaf.prototype.getPlusImg=function()
{
	return (this.children?(this.opened?this.maple.minusImg:this.maple.plusImg):this.maple.spacerImg);
}

//-----------------------------------------------------------------------------
Leaf.prototype.getSpacerImg=function()
{
	return "../images/spacer.gif";
}

//-----------------------------------------------------------------------------
Leaf.prototype.getTextClass=function()
{
	if (this.getMaple().focused)
		return (this.selText?"dsListTextHighlight":"dsListText");
	else
		return (this.selText?"dsListTextBlur":"dsListText");
}

//-----------------------------------------------------------------------------
Leaf.prototype.getTitlePhrase=function()
{
	var title=(this.xml.getAttribute("title"));
	if (title)
		return this.getMaple().getTitlePhrase(title);
	else
		return (this.getMaple().getTitlePhrase(this.getId()));
}

//-----------------------------------------------------------------------------
Leaf.prototype.getXML=function()
{
	return (this.xml);
}

//-----------------------------------------------------------------------------
Leaf.prototype.hasId = function(ctlId)
{
	return (ctlId == this.xml.getAttribute("id"));
}

//-----------------------------------------------------------------------------
Leaf.prototype.isOpened=function()
{
	return (this.opened);
}

//-----------------------------------------------------------------------------
Leaf.prototype.isParent=function()
{
	return (this.parentLeaf==this.maple);
}

//-----------------------------------------------------------------------------
Leaf.prototype.isSel=function()
{
	return (this.selText);
}

//-----------------------------------------------------------------------------
Leaf.prototype.openToId = function(ctlId)
{
	// go deep first
	if (this.containsControlById(ctlId))
	{
		this.opened=true;
		
		var len = (this.arrLeaves ? this.arrLeaves.length:0);
		for (var i=0;i<len;i++)
		   	this.arrLeaves[i].openToId(ctlId);
			
		if (this.hasId(ctlId))
			this.select();
		else
			this.updateElem();
	}
}

//-----------------------------------------------------------------------------
Leaf.prototype.renderRow=function(elem, table, indent, opened)
{
	if (!this.xml)
		return;

	if (!this.maple)
		return;

	this.opened=opened;

	// build row
	this.row=table.insertRow(table.rows.length);

	// indent, plus/minus img
	var c0=this.row.insertCell(0);
	c0.style.textAlign="right";
	c0.style.verticalAlign="middle";
	c0.style.width=((indent*this.maple.hSpacing+(indent+1)*9)+"px");
	c0.style.whiteSpace="nowrap";
	c0.title=this.getTitlePhrase();
	
	// indent img
	if (indent)
		c0.innerHTML+="<image id='img_indent_"+this.leafCount+"' src='"+this.getSpacerImg()+"' style='width:"+(indent*16)+"px;height:9px;' onload='leafImgLoad(this)' align='right' />"
	
	// plus/minus img
	c0.innerHTML+="<image id='img_plus_"+this.leafCount+"' src='"+this.getPlusImg()+"' alt='Toggle open/closed.' style='width:9px;height:9px;' onload='leafImgLoad(this)' align='right' />"

	// folder/file img
	var c1=this.row.insertCell(1);
	c1.style.textAlign="right";
	c1.style.verticalAlign="middle";
	c1.style.width="16px";
	c1.style.whiteSpace="nowrap";
	c1.innerHTML+="<image id='img_folder_"+this.leafCount+"' src='"+this.getFolderImg()+"' alt='"+this.getFolderTitle()+"' style='width:16px;height:16px;' onload='leafImgLoad(this)' align='absmiddle' />"

	// tree text
	var c2=this.row.insertCell(2);
	c2.style.textAlign="right";
	c2.style.verticalAlign="middle";
	c2.style.whiteSpace="nowrap";
	this.textSpan=this.htmDoc.createElement("span")
	this.textSpan.className=this.getTextClass();
	this.textSpan.leaf=this;
	this.textSpan.maple=this.maple;
	this.textSpan.isText=true;
	this.textSpan.appendChild(this.htmDoc.createTextNode(this.getPhrase()));
	this.textSpan.title=this.getTitlePhrase();
	c2.appendChild(this.textSpan);
}

//-----------------------------------------------------------------------------
Leaf.prototype.renderTable=function(elem, indent, opened)
{
	this.table=this.htmDoc.createElement("table");
	this.table.cellSpacing="0";
	this.table.style.display=(this.parentLeaf.opened?"block":"none");
	this.table.elem=this;
	this.renderRow(elem, this.table, indent, opened);
	elem.appendChild(this.table);
	this.maple.arrTables.push(this.table);

	// render child leaves as separate tables beneath this.table
	var lenLeaves=(this.arrLeaves?this.arrLeaves.length:0);
	for (var i=0;i<lenLeaves;i++)
		this.arrLeaves[i].renderTable(elem,indent+1,this.arrLeaves[i].opened);
}

//-----------------------------------------------------------------------------
Leaf.prototype.select=function(mouse)
{
	if (mouse)
	{
		try{
			this.maple.elem.focus();
		} catch (e) {};
		this.maple.focused=true;
	}
	
	this.maple.setSelLeaf(this,mouse);
	this.selText=true;
	this.textSpan.className=this.getTextClass();
	
	// scroll into view
	var n=this.fImg;
	if (n)
	{
		var div=this.maple.elem;
		this.detCoords(n);
		this.detCoords(div);
		this.detCoords(this.table);
		if ((n.detTop+this.table.detHeight) > (div.detTop+div.scrollTop+div.detHeight))
			div.scrollTop=Math.max((n.detTop+this.table.detHeight) - (div.detHeight+div.detTop-1),0);
		else if (n.detTop < (div.detTop+div.scrollTop))
			div.scrollTop=Math.max((n.detTop-div.detTop-1),0);
	}
}

//-----------------------------------------------------------------------------
Leaf.prototype.setFolderImg=function(img)
{
	this.folderImg=img;
	if (this.fImg)
		this.fImg.src=img;
}

//-----------------------------------------------------------------------------
Leaf.prototype.setFolderTitle=function(title)
{
	if (this.fImg)
		this.fImg.title=title;
}

//-----------------------------------------------------------------------------
Leaf.prototype.setXML=function(xml)
{
	this.xml=xml;
	if (!this.xml)
		return;
	var opened=xml.getAttribute("open");
	this.opened=(opened && (opened=="1"));

	var folderImg=xml.getAttribute("folderImg");
	this.folderImg=(folderImg?folderImg:null);

	var folderTitle=xml.getAttribute("folderTitle");
	this.folderTitle=(folderTitle?folderTitle:null);

	var n=this.xml.childNodes;
	this.arrLeaves=null;
	var len=(n?n.length:0);
	this.children=len;
	if (len)
	{
		this.arrLeaves=new Array();
		for(var i=0;i<len;i++)
		{
			var n_i=this.xml.childNodes[i];
			if (n_i.tagName==TAG_ITEM)
			{
				this.arrLeaves.push(new Leaf(this,n_i));
			}
		}
	}
}

//-----------------------------------------------------------------------------
Leaf.prototype.togglePlus=function(mouse)
{
	this.opened=(this.parentLeaf.opened?(!this.opened):false);
	this.updateElem();
}

//-----------------------------------------------------------------------------
Leaf.prototype.updateElem=function()
{
	if (!this.parentLeaf.opened)
		this.opened=false;
	if (this.table)
		this.table.style.display=(this.parentLeaf.opened?"block":"none");
	if (this.plusImg)
		this.plusImg.src=this.getPlusImg();
	if (this.fImg)
		this.fImg.src=this.getFolderImg();

	// render child leaves beneath this	
	var lenLeaves=(this.arrLeaves?this.arrLeaves.length:0);
	for (var i=0;i<lenLeaves;i++)
		this.arrLeaves[i].updateElem();
}

//-----------------------------------------------------------------------------
function leafImgLoad(img)
{
	var id=img.id;
	var splitid=id.split("_");
	if (splitid && (splitid.length==3))
	{
		var leafId=parseInt(splitid[2],10);
		var leaf=arrLeaves[leafId];
		if (leaf)
		{
			img.leaf=leaf;
			img.maple=leaf.getMaple();
			switch (splitid[1])
			{
				case "folder":
					img.isFolder=true;
					leaf.fImg=img;
					break;
				case "indent":
					break;
				case "plus":
					leaf.plusImg=img;
					img.isPlus=leaf.children;
					break;
			}
		}
	}
}

