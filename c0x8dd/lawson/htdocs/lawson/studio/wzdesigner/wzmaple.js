/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/wzdesigner/wzmaple.js,v 1.4.34.2 2012/08/08 12:48:49 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// wztree.js
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
// tailored maple object - copy of studio/dialogs/maple.js
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
	// override
	this.arrLeaves=null;
	this.arrRows=null;
	this.capture=false; // is this element set to receive all events?
	this.elem=elem;
	this.focused=false;
	this.hSpacing=20; // indent amt in px
	this.opened=true;
	this.selLeaf=null;
	this.sort=false; // sort nodes alphabetically?
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
Maple.prototype.buildTreeFromXML=function(xml)
{
	// added
   	this.arrLeaves=null;
   	this.selLeaf=null;
   	this.xml=xml;
   	if (this.xml)
   	{	
		var wizardsRoot = this.xml.selectSingleNode("//WIZARDS");
   		var len = (wizardsRoot && wizardsRoot.childNodes?wizardsRoot.childNodes.length:0);
   		if (len)
   		{
   			this.arrLeaves=new Array();
   			for(var i=0;i<len;i++)
   			{
   				var n_i=wizardsRoot.childNodes[i];
   				var deleted = n_i.getAttribute("deleted");
   				if (!deleted || deleted=="0")
   				{
	   				switch (n_i.tagName)
					{
					case WIZARD_TAG:
						this.arrLeaves.push(new Leaf(this,n_i,true));
						break;
					case STEP_TAG:
					case BRANCH_TAG:
						this.arrLeaves.push(new Leaf(this,n_i,false));
						break;
					}
				}
   			}
   		}
   	}
   	this.render();
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
	// override
	var wdw=getParentWindow();
	evt=(evt?evt:wdw.event);
	var elem=(evt?evt.srcElement:null);
	var maple=(elem?elem.maple:null);
	if (maple)
		maple.blurElem(elem);
}

//-----------------------------------------------------------------------------
function mapleClick(evt)
{
	// override
	var wdw = getParentWindow();
 	evt=(evt?evt:wdw.event);
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
 	//if (window.captureObj && (!window.captureObj.isInside(evt.x,evt.y)))
	//	window.captureObj.clickElem(null);
}

//-----------------------------------------------------------------------------
function mapleDblClick(evt)
{
	// override
	var wdw=getParentWindow();
	evt=(evt?evt:wdw.event);
	var elem=(evt?evt.srcElement:null);
	var maple=(elem?elem.maple:null);
	if (maple)
		maple.dblClickElem(elem);
}

//-----------------------------------------------------------------------------
function mapleFocus(evt)
{
	// override
	var wdw=getParentWindow();
	evt=(evt?evt:wdw.event);
	var elem=(evt?evt.srcElement:null);
	var maple=(elem?elem.maple:null);
	if (maple)
		maple.focusElem(elem);
}

//-----------------------------------------------------------------------------
// tailored leaf object - copy of studio/dialogs/maple.js
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
Leaf.prototype.assignBranchName=function(node)
{
	// added
	return node.getAttribute("test");
}

//-----------------------------------------------------------------------------
Leaf.prototype.assignStepName=function(node)
{
	// added
	// wizard (start and end) steps are steps without fld
	var retVal = "";
	var curStepName = node.getAttribute("fld");
	if (curStepName)
		retVal = curStepName;	
	else
	{
		// check to see if there are previous sibling nodes
		var lbl = node.previousSibling ? "lblEndWz":"lblStartWz";
		retVal = myDesigner.stringTable.getPhrase(lbl);
	}
	return(retVal);
}

//-----------------------------------------------------------------------------
Leaf.prototype.assignWizardName=function(node)
{
	// added
 	return node.getAttribute("name");
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
		this.arrLeaves[i].expand();
}

//-----------------------------------------------------------------------------
Leaf.prototype.getHtmDoc = function()
{
	if (!this.htmDoc)
		this.htmDoc=document;
	return (this.htmDoc);
}

//-----------------------------------------------------------------------------
Leaf.prototype.getFolderImg = function()
{
	// override
	// return folder only if this is a wizardnode
	var retVal = "";
	switch (this.xml.nodeName)
	{
	case WIZARD_TAG:
		retVal = (this.children?
			(this.opened?"../images/folderopen.gif":"../images/folderclosed.gif")
			:this.getIcon());
		break;
	case STEP_TAG:
	case BRANCH_TAG:
	default:
		retVal = this.getIcon();
		break;
	}
	return retVal;
}

//-----------------------------------------------------------------------------
Leaf.prototype.getFolderTitle = function()
{
	// override
	// return folder only if this is a wizardnode
	var retVal = "";
	switch (this.xml.nodeName)
	{
	case WIZARD_TAG:
		retVal = myDesigner.stringTable.getPhrase("lblWzCtl");
		break;
	case STEP_TAG:
	case BRANCH_TAG:
	default:
		retVal = this.getIconTitle();
		break;
	}
	return retVal;
}

//-----------------------------------------------------------------------------
Leaf.prototype.getHelpText = function()
{
	// added
	var retVal = "";
	switch (this.xml.nodeName)
	{
	case STEP_TAG:
	case WIZARD_TAG:
		var infoNode = this.xml.selectSingleNode("INFO");
		retVal = (infoNode?infoNode.text:"");
		break;
	case BRANCH_TAG:
		break;
	}
	return retVal;
}

//-----------------------------------------------------------------------------
Leaf.prototype.getHtmDoc = function()
{
	// added
	if (!this.htmDoc)
	{
	  	this.editor=top.designStudio.activeDesigner.workSpace.editors.item(DESIGN_VIEW);
  		this.htmDoc = this.editor.cwDoc;
	}
	return (this.htmDoc);
}

//-----------------------------------------------------------------------------
Leaf.prototype.getIcon = function()
{
	// override
	var icon = "images/";
	switch (this.xml.nodeName)
	{
	case WIZARD_TAG:
		icon += "wizard.gif";
		break;
	case STEP_TAG:
		var curStepName = this.xml.getAttribute("fld");
		if (curStepName)
			icon += "step.gif";
		else
			icon += this.xml.previousSibling ? "stepend.gif" : "stepstart.gif";
		break;
	case BRANCH_TAG:
		icon += "branch.gif";
		break;
	default:
		icon += "wizard.gif";
		break;
	}
	return(icon);
}

//-----------------------------------------------------------------------------
Leaf.prototype.getIconTitle = function()
{
	// added
	var retVal = "";
	switch (this.xml.nodeName)
	{
	case WIZARD_TAG:
		retVal = myDesigner.stringTable.getPhrase("lblWzCtl");
		break;
	case STEP_TAG:
		var curStepName = this.xml.getAttribute("fld");
		if (curStepName)
			retVal = myDesigner.stringTable.getPhrase("lblStep");
		else
		{
			// check to see if there are previous sibling nodes
			var lbl = this.xml.previousSibling ? "lblEndWz":"lblStartWz";
			retVal = myDesigner.stringTable.getPhrase(lbl);
		}
		break;
	case BRANCH_TAG:
		retVal = myDesigner.stringTable.getPhrase("lblBranch");
		break;
	}
	return(retVal);
}

//-----------------------------------------------------------------------------
Leaf.prototype.getId = function()
{
	// override
	var retVal = "";
	switch (this.xml.nodeName)
	{
	case WIZARD_TAG:
		retVal = this.assignWizardName(this.xml);
		break;
	case STEP_TAG:
		retVal = this.assignStepName(this.xml);
		break;
	case BRANCH_TAG:
		retVal = this.assignBranchName(this.xml);
		break;
	}
	return(retVal);
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
Leaf.prototype.getSpaceImg = function()
{
	// added
	return "../images/spacer.gif";
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
Leaf.prototype.hasBranch = function()
{
	// added
	return (this.xml.selectSingleNode(BRANCH_TAG) ? true : false);
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
Leaf.prototype.renderRow = function (elem, table, indent, opened)
{
	// override
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
	if (indent) {
		var sImg = this.htmDoc.createElement("img");
   		sImg.src = this.getSpaceImg();
		sImg.leaf = this;
		sImg.maple = this.maple;
		with (sImg.style) {
			width = (indent*16)+"px";
			height = "9px";
			align = "right";
		}
		c0.appendChild(sImg);
	}
	
	// plus/minus img
	this.plusImg = this.htmDoc.createElement("img")
	this.plusImg.src = this.getPlusImg();
	this.plusImg.leaf = this;
	this.plusImg.maple = this.maple;
	this.plusImg.isPlus = (this.children);
	with (this.plusImg.style) {
		width = "9px";
		height = "9px";
		align = "right";
	}
	c0.appendChild(this.plusImg);

	// folder/file img
	var c1=this.row.insertCell(1);
	c1.style.textAlign="right";
	c1.style.verticalAlign="middle";
	c1.style.width="16px";
	c1.style.whiteSpace="nowrap";
	this.fImg = this.htmDoc.createElement("img")
	this.fImg.src = this.getFolderImg();
	this.fImg.leaf=this;
	this.fImg.maple=this.maple;
	this.fImg.title=this.getFolderTitle();
	this.fImg.isFolder=true;
	with (this.fImg.style) {
		width = "16px"
		height = "16px"
		align = "absmiddle"
	}
	c1.appendChild(this.fImg);

	// tree text
	var c2=this.row.insertCell(2);
	c2.className="wzTreeText"
	this.textSpan = this.htmDoc.createElement("span")
	this.textSpan.className=this.getTextClass();
	this.textSpan.leaf=this;
	this.textSpan.maple=this.maple;
	this.textSpan.isText=true;
	this.textSpan.onselectstart=top.blockSelect;
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
Leaf.prototype.setXML = function(xml)
{
	// override
	this.xml=xml;
	if (!this.xml)
		return;
		
	var n=this.xml.childNodes;
	this.arrLeaves=null;
	var len = (n?n.length:0);
	var bBranch = true;
	if (xml.nodeName == STEP_TAG)
		bBranch = this.hasBranch();
	if (bBranch)
	{
    	this.children=len;
    	if (len)
    	{
    		this.arrLeaves=new Array();
    		for(var i=0;i<len;i++)
    		{
    			var n_i=this.xml.childNodes[i];
    			var deleted = n_i.getAttribute("deleted");
   				if (!deleted || deleted=="0")
   				{
					switch (n_i.tagName)
					{
						case BRANCH_TAG:
						case STEP_TAG:
						case WIZARD_TAG:
		    				this.arrLeaves.push(new Leaf(this,n_i));
							break;
					}
				}
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
// Methods which help the wzdesigner work with a maple object.
//-----------------------------------------------------------------------------
function EventObject()
{
	// added for wzdesigner
	this.eventId = "";
	this.windowEvent = null;
	this.cmdHistoryId = "";
	this.extraInfo = null;
}

//-----------------------------------------------------------------------------
function createEventObject(eventId, windowEvent, cmdHistoryId, extraInfo)
{
	// added for wzdesigner
	// called within maple.js
	var evtObj = new EventObject();
	evtObj.eventId = eventId;
	evtObj.windowEvent = windowEvent;
	evtObj.cmdHistoryId = cmdHistoryId;
	evtObj.extraInfo = extraInfo
	return evtObj;
}

//-----------------------------------------------------------------------------
function getParentWindow()
{
	// added for wzdesigner
	return(top.designStudio.activeDesigner.workSpace.editors.item("design").cwDoc.parentWindow);
}

//-----------------------------------------------------------------------------
function processEvent(evtObj)
{
	// added for wzdesigner
	// Note these calls need to be directed back to
	// the document class.
	var myDesigner=top.designStudio.activeDesigner;
   	var myDoc=myDesigner.activeDocument;
	switch(evtObj.eventId)
	{
	case ON_FOCUS:
		myDoc.lastFocus = evtObj.extraInfo;
		break;
	case ON_SELECT_LEAF:
		myDoc.didSelectLeaf(evtObj.extraInfo.leaf);
		if (evtObj.extraInfo.leaf)
			myDoc.lastFocus = evtObj.extraInfo.leaf.getMaple();
		break;
	}
}
