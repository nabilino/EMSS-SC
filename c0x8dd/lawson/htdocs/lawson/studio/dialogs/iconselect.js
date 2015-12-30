/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/dialogs/iconselect.js,v 1.2.28.2 2012/08/08 12:48:48 jomeli Exp $ */
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
var TAG_ITEM="ITEM";
var ON_BLUR="ON_BLUR";
var ON_FOCUS="ON_FOCUS";
var ON_DBLCLICK_ICON="ON_DBLCLICK_ICON";
var ON_SELECT_ICON="ON_SELECT_ICON";
var ON_SELECT_DISABLED_ICON="ON_SELECT_DISABLED_ICON";
//-----------------------------------------------------------------------------
/*
----------------------
	vMargin/2
----------------------
010  |          | 202
101  |          | 020
010  | h margin | 202
     |          |
one  |          | two
----------------------
	vMargin
----------------------
*/
function IconSelect(elem)
{
	this.arrIcons=null;
	this.arrRows=null;
	this.arrCols=null;
	this.cellWidth=100;
	this.elem=elem;
	this.hMargin=22;
	this.vMargin=12;
	this.hMax=3;
	this.focused=false;
	this.iconHeight=32;
	this.iconWidth=32;
	this.selIcon=null;
	this.useLBL=true; // add LBL to id for getting phrases
	this.useTITLE=true; // add TITLE to id for getting phrases

	this.updateWidth();
	
	// add click events to its element	
	this.elem.iconSelect=this;
	this.elem.onblur=iconSelectBlur;
	this.elem.onclick=iconSelectClick;
	this.elem.ondblclick=iconSelectDblClick;
	this.elem.onfocus=iconSelectFocus;
}
IconSelect.prototype.blurElem = function(elem)
{
	this.focused=false;
	if (this.selIcon)
		this.selIcon.blur();
		
	// fire event
	var evtObj = window.createEventObject(ON_BLUR, null, null, this);
	window.processEvent(evtObj);
}
IconSelect.prototype.clickElem = function(elem,mouse)
{
	if (elem.isIcon || elem.isText)
		elem.iconObj.clickText(mouse);
	else
		this.deselect(mouse);
}
IconSelect.prototype.dblClickElem = function(elem,mouse)
{
	// prepare event data
	var a=new Array();
	a.iconSelect=this;
	a.icon=elem.iconObj;
	a.mouse=mouse;
			
	// fire event
	var evtObj = window.createEventObject(ON_DBLCLICK_ICON, null, null, a);
	window.processEvent(evtObj);
}
IconSelect.prototype.deselect = function(mouse)
{
	if (this.selIcon)
	{
		this.selIcon.deselect();
		this.selIcon=null;
	}
	
	// prepare event data
	var a=null;
	a=new Array();
	a.iconSelect=this;
	a.icon=null;
	a.mouse=mouse;

	// fire event
	var evtObj = window.createEventObject(ON_SELECT_ICON, null, null, a);
	window.processEvent(evtObj);
}
IconSelect.prototype.doDown=function (mouse)
{
	if (!this.selIcon)
		return -1;
	var col_i=this.selIcon.col_i;
	var row_i=this.selIcon.row_i;
	row_i++;
	if (this.arrCols[col_i].length<row_i)
		row_i=0;
	var elem=(this.arrCols[col_i])[row_i];
	if (elem)
		elem.clickText(mouse);
}
IconSelect.prototype.doEnter=function ()
{
	if (this.selIcon)
		this.dblClickElem(this.selIcon);
}
IconSelect.prototype.doFirst=function (mouse)
{
	var lenIcons=(this.arrIcons?this.arrIcons.length:0);
	if (!lenIcons)
		return;
	this.arrIcons[0].clickText(mouse);
}
IconSelect.prototype.doLast=function (mouse)
{
	var lenIcons=(this.arrIcons?this.arrIcons.length:0);
	if (!lenIcons)
		return;
	this.arrIcons[lenIcons-1].clickText(mouse);
}
IconSelect.prototype.doLeft=function (mouse)
{
	var pos=this.getPos();
	if (pos<0)
	{
		this.doFirst(mouse);
		return;
	}
	var i=pos-1;
	if (i>=0)
		this.arrIcons[i].clickText(mouse);
	else
		this.doFirst(mouse);
}
IconSelect.prototype.doPageDown=function (mouse)
{
	if (!this.selIcon)
		return -1;
	var col_i=this.selIcon.col_i;
	var row_i=(this.arrCols[col_i].length-1);
	var elem=(this.arrCols[col_i])[row_i];
	if (elem)
		elem.clickText(mouse);
}
IconSelect.prototype.doPageUp=function (mouse)
{
	if (!this.selIcon)
		return -1;
	var col_i=this.selIcon.col_i;
	var row_i=0;
	var elem=(this.arrCols[col_i])[row_i];
	if (elem)
		elem.clickText(mouse);
}
IconSelect.prototype.doRight=function (mouse)
{
	var pos=this.getPos();
	if (pos<0)
	{
		this.doLast();
		return;
	}
	var i=pos+1;
	var lenIcons=(this.arrIcons?this.arrIcons.length:0);
	if (i<lenIcons)
		this.arrIcons[i].clickText(mouse);
	else
		this.doLast(mouse);
}
IconSelect.prototype.doUp=function (mouse)
{
	if (!this.selIcon)
		return -1;
	var col_i=this.selIcon.col_i;
	var row_i=this.selIcon.row_i;
	row_i--;
	row_i=Math.max(row_i,0);
	var elem=(this.arrCols[col_i])[row_i];
	if (elem)
		elem.clickText(mouse);
}
IconSelect.prototype.focus = function()
{
	this.focused=true;
	if (this.selIcon)
		this.selIcon.blur();

	// this fixes when in usher you tab between the maple on the left and the
	// icon select on the right
	// fire event
	var evtObj = window.createEventObject(ON_FOCUS, null, null, this);
	window.processEvent(evtObj);
}
IconSelect.prototype.focusElem = function(elem)
{
	this.focused=true;
	if (this.selIcon)
		this.selIcon.blur();
	
	// fire event
	var evtObj = window.createEventObject(ON_FOCUS, null, null, this);
	window.processEvent(evtObj);
}
IconSelect.prototype.getIconId=function(id)
{
	var lenIcons=(this.arrIcons?this.arrIcons.length:0);
	for (var i=0;i<lenIcons;i++)
		if (this.arrIcons[i].getId()==id)
			return this.arrIcons[i];
	return null;
}
// provides a way for dialog to deliver phrase
IconSelect.prototype.getPhrase = function(id)
{
	var ret=(parent.getPhrase(id));
	if ((this.useLBL) && (!ret || (ret==id)))
		ret=(parent.getPhrase("LBL_"+id));
	return ret;
}
// returns selected position in arrIcons array
IconSelect.prototype.getPos = function()
{
	if (!this.selIcon)
		return -1;
	var lenIcons=(this.arrIcons?this.arrIcons.length:0);
	for (var i=0;i<lenIcons;i++)
	{
		if (this.selIcon==this.arrIcons[i])
			return i;
	}
	return -1;
}
// provides a way for dialog to deliver phrase
IconSelect.prototype.getTitlePhrase = function(id)
{
	if (this.useTITLE)
		return (parent.getPhrase("TITLE_"+id));
	else
		return id;
}
IconSelect.prototype.getValue = function()
{
	return (this.selIcon);
}
IconSelect.prototype.handleKeyDown = function(evt)
{
	if (!evt)
		evt=window.event;
	var b=false;
	if (!event.altKey && !event.ctrlKey && !event.shiftKey)
	{
		switch (evt.keyCode)
		{
			case keys.END:
				this.doLast();
				b=true;
				break;
			case keys.ENTER:
				this.doEnter();
				b=true;
				break;
			case keys.HOME:
				this.doFirst();
				b=true;
				break;
			case keys.RIGHT_ARROW:
				this.doRight();
				b=true;
				break;
			case keys.LEFT_ARROW:
				this.doLeft();
				b=true;
				break;
			case keys.UP_ARROW:
				this.doUp();
				b=true;
				break;
			case keys.DOWN_ARROW:
				this.doDown();
				b=true;
				break;
			case keys.PAGE_UP:
				this.doPageUp();
				b=true;
				break;
			case keys.PAGE_DOWN:
				this.doPageDown();
				b=true;
				break;
		}
	}
	if (!b)
	{
		var k=String.fromCharCode(evt.keyCode);
		var isLetter=((k >= "A") && (k <= "Z"));
		var isNumber=((k >= "1") && (k <= "0"));
		if (isLetter || isNumber)
			b=this.navFirstLetter(k);
	}
	if (b)
		this.elem.focus();
	return b;
}
IconSelect.prototype.navFirstLetter=function(k)
{
	// slow typing behavior
	var lcn=k.toLowerCase();
	var lenIcons=(this.arrIcons?this.arrIcons.length:0);
	var iStart=(this.getPos()+1);
	for (var i=iStart;i<lenIcons;i++)
	{
		if (this.arrIcons[i].getPhrase().substring(0,1).toLowerCase()==lcn)
		{
			this.arrIcons[i].clickText();
			return true;
		}
	}
	for (var i=0;i<iStart && i<lenIcons;i++)
	{
		if (this.arrIcons[i].getPhrase().substring(0,1).toLowerCase()==lcn)
		{
			this.arrIcons[i].clickText();
			return true;
		}
	}
	return false;
}
IconSelect.prototype.render=function ()
{
	if (this.table)
	{
		this.elem.removeChild(this.table);
		this.table=null;
	}

	var lenIcons=(this.arrIcons?this.arrIcons.length:0);
	if (lenIcons)
	{
		this.arrRows=new Array();
		this.arrCols=new Array();
	
		this.table=document.createElement("table");
		this.table.cellSpacing="0";
		this.table.elem=this;
	
		var row=this.table.insertRow(0);
		var totrow_i=0;
		var row_i=0;
		var col_i=0;
		var cell;
		var icon;
		for (var i=0;i<lenIcons;i++)
		{
			if (col_i>=this.hMax)
			{
				// spacer row
				totrow_i++;
				row=this.table.insertRow(totrow_i);
				cell=row.insertCell(0);
				icon=document.createElement("img");
				icon.style.height=this.vMargin+"px";
				icon.style.visibility="hidden";
				cell.appendChild(icon);
								
				// build new row
				col_i=0;
				row_i++;
				totrow_i++;
				row=this.table.insertRow(totrow_i);
				this.arrRows.push(row);
			}
			else if (totrow_i==0)
			{
				// 1/2 spacer row
				totrow_i++;
				row=this.table.insertRow(totrow_i);
				cell=row.insertCell(0);
				icon=document.createElement("img");
				icon.style.height=parseInt(this.vMargin/2,10)+"px";
				icon.style.visibility="hidden";
				cell.appendChild(icon);
								
				// build new row
				col_i=0;
				row_i++;
				totrow_i++;
				row=this.table.insertRow(totrow_i);
				this.arrRows.push(row);
			}			
			cell=row.insertCell(col_i);
			cell.style.textAlign="center";
			cell.style.width=this.cellWidth+"px";
			icon=this.arrIcons[i];
			icon.render(cell);
			if (this.arrRows.length<row_i+1)
				this.arrRows[row_i]=new Array();
			if (this.arrCols.length<col_i+1)
				this.arrCols[col_i]=new Array();
			(this.arrCols[col_i])[row_i]=icon;
			(this.arrRows[row_i])[col_i]=icon;
			icon.col_i=col_i;
			icon.row_i=row_i;
			col_i++;
		}	
		this.elem.appendChild(this.table);
		//this.doFirst(false);
	}
}
IconSelect.prototype.selectId=function(id)
{
	var iconId=this.getIconId(id);
	if (iconId)
		iconId.clickText(false);
}
IconSelect.prototype.setSelIcon = function(icon,mouse)
{
	this.deselect(mouse);
	this.selIcon=icon;

	// prepare event data - iconSelect and iconXML
	var a=new Array();
	a.iconSelect=this;
	a.icon=icon;
	a.mouse=mouse;
	
	// fire event
	var evtObj = window.createEventObject(ON_SELECT_ICON, null, null, a);
	window.processEvent(evtObj);
}
// set XML prepares the background object structure
IconSelect.prototype.setXML = function(xml)
{
	this.arrIcons=null;
	this.selIcon=null;
	this.xml=xml;
	if (this.xml)
	{		
		var n=this.xml.childNodes;
		var len = (n?n.length:0);
		if (len)
		{
			this.arrIcons=new Array();
			var m_i;
			var n_i;
			for(var i=0;i<len;i++)
			{	
				n_i=this.xml.childNodes[i];
				if (n_i.tagName==TAG_ITEM)
				{
					m_i=new Icon(this,n_i);
					this.arrIcons.push(m_i);
				}
			}
		}
	}
	this.render();
}
IconSelect.prototype.updateWidth = function()
{
	var welem=parseInt(this.elem.style.width,0);
	this.hMax=(welem-this.hMargin)/(this.cellWidth+this.hMargin);
	this.hMax=Math.max(this.hMax,1);
}

// -----

function iconSelectClick(evt)
{
	if (!evt)
		evt=window.event;
	var elem=evt.srcElement;
	var iconSelect=(elem?elem.iconSelect:null);
	if (!iconSelect)
		return;

	iconSelect.clickElem(elem,true);
}
function iconSelectDblClick(evt)
{
	if (!evt)
		evt=window.event;
	
	var elem=evt.srcElement;
	var iconSelect=(elem?elem.iconSelect:null);
	if (!iconSelect)
		return;

	iconSelect.dblClickElem(elem,true);
}
function iconSelectBlur(evt)
{
	if (!evt)
		evt=window.event;
	
	var elem=evt.srcElement;
	if (!elem)
		return;
		
	var iconSelect=elem.iconSelect;
	if (!iconSelect)
		return;

	iconSelect.blurElem(elem,true);
}
function iconSelectFocus(evt)
{
	if (!evt)
		evt=window.event;
	
	var elem=evt.srcElement;
	if (!elem)
		return;
		
	var iconSelect=elem.iconSelect;
	if (!iconSelect)
		return;

	iconSelect.focusElem(elem,true);
}

// -----

function Icon(iconSelect,xml)
{
	this.iconSelect=iconSelect;
	this.selText=false;
	this.textSpan=null;
	this.vSpacing=2;
	this.setXML(xml);
}
Icon.prototype.blur=function()
{
	this.textSpan.className=this.getTextClass();
}
Icon.prototype.clickText = function(mouse)
{
	this.select(mouse);
}
Icon.prototype.deselect = function()
{
	this.selText=false;
	this.textSpan.className=this.getTextClass();
}
Icon.prototype.enabled = function()
{
	var att=this.xml.getAttribute("enabled");
	return (att ? (att == "1" ? true : false) : true);
}
Icon.prototype.getIconSelect = function()
{
	return (this.iconSelect);
}
Icon.prototype.getPhrase = function()
{
	return (this.getIconSelect().getPhrase(this.getId()));
}
Icon.prototype.getTextClass = function()
{
	if (this.iconSelect.focused)
		return (this.selText?"dsListTextHighlight":"dsListText");
	else
		return (this.selText?"dsListTextBlur":"dsListText");
}
Icon.prototype.getTitlePhrase = function()
{
	return (this.getIconSelect().getTitlePhrase(this.getId()));
}
Icon.prototype.getId = function()
{
	return this.xml.getAttribute("id");
}
Icon.prototype.getIcon = function()
{
	return "../images/"+this.xml.getAttribute("icon")+".gif";
}
Icon.prototype.getXML = function()
{
	return this.xml;
}
Icon.prototype.render = function(cell)
{
	var s=this.getPhrase();
	var t=this.getTitlePhrase();

	//this.icon
	this.icon=document.createElement("img");
	this.icon.isIcon=true;
	this.icon.iconObj=this;
	this.icon.iconSelect=this.iconSelect;
	this.icon.src=this.getIcon();
	this.icon.title=t;
	with (this.icon.style)
	{
		width = this.iconSelect.iconWidth + "px";
		height = this.iconSelect.iconHeight + "px";
		align = "absmiddle";
	}
	cell.appendChild(this.icon);
	cell.appendChild(document.createElement("br"));
	
	//sImg
	var sImg=document.createElement("img");
	sImg.src = "../images/spacer.gif";
	with (sImg.style)
	{
		width = this.iconSelect.iconWidth + "px";
		height = this.vSpacing + "px";
		align = "absmiddle";
	}
	cell.appendChild(sImg);
	cell.appendChild(document.createElement("br"));
	
	//this.textSpan	
	this.textSpan=document.createElement("span");
	this.textSpan.className=this.getTextClass();
	this.textSpan.iconObj=this;
	this.textSpan.isText=true;
	this.textSpan.title=t;
	this.textSpan.appendChild(document.createTextNode(s));
	cell.appendChild(this.textSpan);
	
	return (this.icon);
}
Icon.prototype.select = function(mouse)
{
	if (mouse)
	{
		try
		{
			this.iconSelect.elem.focus();
		}
		catch (e) {};
		this.iconSelect.focused=true;
	}
	if (!this.enabled())
	{
		// fire could not select event
		var a=new Array();
		a.iconSelect=this.iconSelect;
		a.icon=this;
		a.mouse=mouse;
	
		var evtObj = window.createEventObject(ON_SELECT_DISABLED_ICON, null, null, a);
		window.processEvent(evtObj);
		return;
	}
	if (this.iconSelect.selIcon!=this)
	{
		this.iconSelect.setSelIcon(this,mouse);
		this.selText=true;
		this.textSpan.className=this.getTextClass();
	}
}
Icon.prototype.setXML = function(xml)
{
	this.xml=xml;
}
