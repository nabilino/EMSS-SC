/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/dialogs/provselect.js,v 1.4.2.2.26.2 2012/08/08 12:48:48 jomeli Exp $ */
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
var ON_BLUR="ON_BLUR";
var ON_DELETE_FILE="ON_DELETE_FILE";
var ON_FOCUS="ON_FOCUS";
var ON_DBLCLICK_FILE="ON_DBLCLICK_FILE";
var ON_SELECT_FILE="ON_SELECT_FILE";
var ON_SELECT_PROV="ON_SELECT_PROV";

//-----------------------------------------------------------------------------
function alphaNameSort(a,b)
{
	// sorts folders alphabetically by name
	// used by ProvSelect.render
	var aText=a.xml.firstChild.text.toLowerCase()
	var bText=b.xml.firstChild.text.toLowerCase()
	if (aText < bText) return (-1);
	if (aText == bText) return (0);
	if (aText > bText) return (1);
}
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
function provBackClick(evt)
{
	evt=(evt?evt:window.event);
	var elem=(evt?evt.srcElement:null);
	var provSelect=(elem?elem.provSelect:null);
	if (provSelect)
		provSelect.doProvBack();
}
function provDeleteClick(evt)
{
	evt=(evt?evt:window.event);
	var elem=(evt?evt.srcElement:null);
	var provSelect=(elem?elem.provSelect:null);
	if (provSelect)
		provSelect.doDelete();
}
function provFocus(evt)
{
	evt=(evt?evt:window.event);
	var elem=(evt?evt.srcElement:null);
	var provSelect=(elem?elem.provSelect:null);
	if (provSelect)
		provSelect.focusElem(elem);
}
function provListBlur(evt)
{
	evt=(evt?evt:window.event);
	var elem=(evt?evt.srcElement:null);
	var provSelect=(elem?elem.provSelect:null);
	if (provSelect)
		provSelect.blur();
}
function provListFocus(evt)
{
	evt=(evt?evt:window.event);
	var elem=(evt?evt.srcElement:null);
	var provSelect=(elem?elem.provSelect:null);
	if (provSelect)
		provSelect.focus();
}
function provTextFocus(evt)
{
	evt=(evt?evt:window.event);
	var elem=(evt?evt.srcElement:null);
	var provSelect=(elem?elem.provSelect:null);
	if (provSelect)
		provSelect.focusTextElem(elem);
}
function provSelWorkspaceFocus(evt)
{
	evt=(evt?evt:window.event);
	var elem=(evt?evt.srcElement:null);
	var provSelect=(elem?elem.provSelect:null);
	if (provSelect)
		provSelect.focusSelWorkspace(elem);
}
function provUpClick(evt)
{
	evt=(evt?evt:window.event);
	var elem=(evt?evt.srcElement:null);
	var provSelect=(elem?elem.provSelect:null);
	if (provSelect)
		provSelect.doProvUp();
}
function provSelNameKeydown(evt)
{
	evt=(evt?evt:window.event);
	var elem=(evt?evt.srcElement:null);
	var provSelect=(elem?elem.provSelect:null);
	if (provSelect)
		provSelect.doSelNameKeydown();
}
function provSelType(evt)
{
	evt=(evt?evt:window.event);
	var elem=(evt?evt.srcElement:null);
	var provSelect=(elem?elem.provSelect:null);
	if (provSelect)
		provSelect.doSelType();
}
function provSelWorkspace(evt)
{
	evt=(evt?evt:window.event);
	var elem=(evt?evt.srcElement:null);
	var provSelect=(elem?elem.provSelect:null);
	if (provSelect)
		provSelect.doSelWorkspace();
}
function provSelectClick(evt)
{
	evt=(evt?evt:window.event);
	var elem=(evt?evt.srcElement:null);
	var provSelect=(elem?elem.provSelect:null);
	if (provSelect)
		provSelect.clickElem(elem,true);
}
function provSelectDblClick(evt)
{
	evt=(evt?evt:window.event);
	var elem=(evt?evt.srcElement:null);
	var provSelect=(elem?elem.provSelect:null);
	if (provSelect)
		provSelect.dblClickElem(elem,true);
}
function quickStr(s,len,space)
{
	var ret=s+"";
	while (ret.length<len)
		ret=space+ret;
	return ret;
}

//-----------------------------------------------------------------------------
function ProvSelect(table,prov)
{
	this.arrFiles=null;
	this.arrTypes=null;
	this.backElem=null;
	this.deleteElem=null;
	this.childrenIcon="folderclosed";
	this.currentLoc="";
	this.currentProv=null;
	this.fileList=null;
	this.fileType=null;
	this.focused=false;
	this.lastLoc=null;
	this.lastProv=null;
	this.noChildrenIcon="file.gif";
	this.pageAmt=7;
	this.pathElem=null;
	this.prov=prov;
	this.selFile=null;
	this.selMaple=null;
	this.selName=null;
	this.selSpan=null;
	this.selType=null;
	this.selWorkspace=null;
	this.upElem=null;

	// add click events to the table element
	this.table=table;
	this.table.provSelect=this;
	this.table.onclick=provSelectClick;
	this.table.ondblclick=provSelectDblClick;
}
ProvSelect.prototype.clickElem=function(elem,mouse)
{
	this.deselect(mouse);
	var ep=(elem?elem.provFile:null);
	if (ep && (ep.isFolder() || ep.isFile()))
	{
		setDesc(elem.id);
		ep.clickText(mouse);
	}
}
ProvSelect.prototype.cd=function(name)
{
	this.table.style.visibility="hidden";
	window.lastProvSelect=this;
	window.setTimeout("window.lastProvSelect.cd2(" + (name?"'"+name+"'":"") + ")",10);
}
ProvSelect.prototype.cd2=function(name)
{
	var path=((name && this.prov) ? this.prov.cd(name) : null);
	window.lastProvSelect=null;
	this.table.style.visibility="visible";
	if (path && this.prov)
	{
		// if designer selected and it has a wizard for
		// this action, get out now.
		if (name == this.prov.desId)
		{
			this.prov.docStub=this.prov.desStub.docs.item(this.prov.docId)
			if (this.prov.docStub)
			{
				var wizard=this.prov.docStub.wizards.item(actId)
				if (wizard)
				{
					// fake the return into thinking we selected a file
					this.selName.value=name;
					setReturnValue();
					return path;
				}
			}
		}
		this.update();
		return path;
	}
	else
	{
		// try cd to dir, then file
		if (this.prov && this.prov.enabled)
		{
			var t=this.prov.getTrail();
			var i=(t?name.lastIndexOf(t):null);
			if (i>-1)
			{
				path=name.substring(0,i);
				var filename=name.substring(i+t.length);
				path=this.cd(path);
				if (path && filename)
				{
					// file in current list
					var file=this.getFileName(filename);
					if (file && file.isFile())
					{
						file.select();
						window.doOK();
						return;
					}
				}
				return path;
			}
		}
	}
	return path;
}
ProvSelect.prototype.dblClickElem=function(elem,mouse)
{
	if (elem && elem.provFile)
	{
		if (elem.provFile.isFolder())
		{
			elem.provFile.clickText(true);
			var name=elem.provFile.getName();
			this.cd(name);
		}
		else if (elem.provFile.isFile())
		{
			elem.provFile.clickText(true);

			// prepare event data - maple and leafXML
			var a=new Array();
			a.provSelect=this;
			a.file=this.selFile;
			a.mouse=mouse;

			// fire event
			var evtObj=window.createEventObject(ON_DBLCLICK_FILE, null, null, a);
			window.processEvent(evtObj);
		}
	}
}
ProvSelect.prototype.deselect=function(mouse)
{
	if (this.selFile)
	{
		this.selFile.deselect();
		this.selFile=null;
		//if (this.selName)
		//	this.selName.value=((this.selFile && this.selFile.isFile())?this.selFile.getName():"");
	}

	// prepare event data - maple and leafXML
	var a=new Array();
	a.provSelect=this;
	a.file=null;
	a.mouse=mouse;

	// fire event
	var evtObj=window.createEventObject(ON_SELECT_PROV, null, null, a);
	window.processEvent(evtObj);
}
ProvSelect.prototype.doCloseSelMaple=function(a)
{
	// user selected a new provider workspace
	if (this.selMaple)
	{
		this.selMaple.elem.tabIndex="0";
		this.selMaple.elem.style.visibility="hidden";
	}
	var provid=((a.leaf && a.chg)?a.leaf.getId():null);
	if (provid)
	{
		window.lastProvSelect=this;
		this.table.style.visibility="hidden"
		window.setTimeout("window.lastProvSelect.doCloseSelMaple2('"+provid+"')",10);
	}
}
ProvSelect.prototype.doCloseSelMaple2=function(provid)
{
	var newLoc=this.prov.setWorkspace(provid);
	if (newLoc)
		this.update();
	else
		parentWin.cmnDlg.messageBox(this.getPhrase("ERR_PROV_WORKSPACE"),"ok","stop");
	this.table.style.visibility="visible"
	this.selSpan.focus();
	window.lastProvSelect=null;
}
ProvSelect.prototype.doDelete=function(noPrompt)
{
	if (!this.selFile || !this.selFile.isFile())
		return (false);
	// no remote form deletes allowed
	if (this.prov.id=="remote" && this.prov.desId=="uidesigner")
		return (false);

	// prompt to confirm deletion of file
	var fn=this.selFile.getName();
	var msg=this.getPhrase("MSG_DELETE_FILE") + "\n" + fn + "\n";
	var ret=(noPrompt?"yes":parentWin.cmnDlg.messageBox(msg,"yesno","trash",window));
	switch (ret)
	{
		case "no":
			return false
			break;
		case "yes":
			this.deselect();
			var ds=new parentWin.DataStorage();
			ds.add("docName",fn);
			if (this.prov.del(ds))
			{
				this.update();
				// prepare event data - maple and leafXML
				var a=new Array();
				a.provSelect=this;
				a.file=this.selFile;
				// fire event
				var evtObj=window.createEventObject(ON_DELETE_FILE, null, null, a);
				window.processEvent(evtObj);
			}
			break;
	}
}
ProvSelect.prototype.doDown=function(mouse,delta)
{
	var i=this.getPos();
	i+=(delta?delta:1);
	var lenFiles=(this.arrFiles?this.arrFiles.length:0);
	i=Math.min(i,lenFiles-1)
	var elem=(i<lenFiles?this.arrFiles[i]:null);
	if (elem)
		elem.clickText(mouse);
}
ProvSelect.prototype.doEnter=function()
{
	if (this.selFile)
	{
		var elem=new Object();
		elem.provFile=this.selFile;
		this.dblClickElem(elem);
	}
}
ProvSelect.prototype.doEnterFileName=function()
{
	// called from window's handleKeyDown - user pressed enter
	var name=this.getSelName();
	if (!name)
		return;
	
	// file in current list
	var file=this.getFileName(name);
	if (file && file.isFile())
	{
		window.setReturnValue();
		return;
	}
	// folder in current list
	if (file && file.isFolder())
	{
		this.cd(name);
		return;
	}
	// des folder in current list
	file=this.getFilePhrase(name);
	if (file && file.isFolder())
	{
		this.cd(file.getName());
		return;
	}
	if (true)
	{
		this.cd(name);
	}
}
ProvSelect.prototype.doesFileExist=function(n)
{
	n=(n?n:this.getSelName());
	var lenFiles=(this.arrFiles?this.arrFiles.length:0);
	var f;
	for (var i=0;i<lenFiles;i++)
	{
		f=(this.arrFiles[i]);
		if (f.getName()==n)
			return true;
	}
	return false;
}
ProvSelect.prototype.doFirst=function(mouse)
{
	var lenFiles=(this.arrFiles?this.arrFiles.length:0);
	if (lenFiles)
		this.arrFiles[0].clickText(mouse);
}
ProvSelect.prototype.doLast=function(mouse)
{
	var lenFiles=(this.arrFiles?this.arrFiles.length:0);
	if (lenFiles)
		this.arrFiles[lenFiles-1].clickText(mouse);
}
ProvSelect.prototype.doPageDown=function(mouse)
{
	this.doDown(mouse,this.pageAmt);
}
ProvSelect.prototype.doPageUp=function(mouse)
{
	this.doUp(mouse,this.pageAmt);
}
ProvSelect.prototype.doProvBack=function()
{
	if (this.lastLoc && (this.lastProv==this.prov))
	{
		window.lastProvSelect=this
		window.setTimeout("window.lastProvSelect.doProvBack2()",10)
	}
}
ProvSelect.prototype.doProvBack2=function()
{
	var newLoc=((this.prov && this.prov.enabled)?this.prov.cd(this.lastLoc):null);
	if (newLoc)
		this.update();
	this.table.style.visibility="visible"
	window.lastProvSelect=null
}
ProvSelect.prototype.doProvUp=function()
{
	this.table.style.visibility="hidden"
	window.lastProvSelect=this
	window.setTimeout("window.lastProvSelect.doProvUp2()",10)
}
ProvSelect.prototype.doProvUp2=function()
{
	var newLoc=((this.prov && this.prov.enabled)?this.prov.up(actId):null);
	if (newLoc)
		this.update();
	this.table.style.visibility="visible"
	window.lastProvSelect=null
}
ProvSelect.prototype.doSelNameKeydown=function()
{
	// prepare event data - maple and leafXML
	var a=new Array();
	a.provSelect=this;
	a.file=null;
	a.mouse=false;

	// fire event
	var evtObj=window.createEventObject(ON_SELECT_FILE, null, null, a);
	window.processEvent(evtObj);
}
ProvSelect.prototype.doSelType=function()
{
	var i=this.selType.selectedIndex;
	if (i>-1)
	{
		this.fileType=this.arrTypes[i];
		this.render();
	}
}
ProvSelect.prototype.doSelWorkspace=function()
{
	// prepare the xml in order to render the maple structures
	// the attributes will be returned as part of a data storage object
	// in getReturnValue
	if (!this.prov || !this.prov.enabled || !this.prov.fso || !this.prov.fso.drives)
		return;

	var xmlDOM=parentWin.xmlFactory.createInstance("DOM");
	var mapleXML=xmlDOM.createElement("Maple");

    // enumerate the drives collection
	var en=new Enumerator(this.prov.fso.drives);
	for ( ; !en.atEnd(); en.moveNext())
	{
		var typ=xmlDOM.createElement("ITEM");
		var drive=en.item();
		var icoName=parentWin.getDriveTypeIcon(drive.DriveType)
		typ.setAttribute("id", drive.DriveLetter);
		typ.setAttribute("icon", icoName);
		mapleXML.appendChild(typ);
	}

	// sets maple's xml root node and renders it
	this.selMaple.setXML(mapleXML);
	
	//position and show maple
	if (this.selSpan)
	{
		parentWin.detCoords(this.selSpan);
		this.selMaple.elem.tabIndex="1";
		with (this.selMaple.elem.style)
		{
			left=this.selSpan.detLeft+"px";
			top=this.selSpan.detTop+"px";
			width=this.selSpan.detWidth+"px";
			visibility="visible";
		}
		
		var leafId=this.prov.wksp.drive;
		var leaf=this.selMaple.getLeafId(leafId);
		if (leaf)
			leaf.select();
		this.selMaple.doSetCapture();
	}
}
ProvSelect.prototype.doUp=function(mouse,delta)
{
	var i=this.getPos();
	i-=(delta?delta:1);
	i=Math.max(i,0);
	var lenFiles=(this.arrFiles?this.arrFiles.length:0);
	var elem=(i<lenFiles?this.arrFiles[i]:null);
	if (elem)
		elem.clickText(mouse);
}
ProvSelect.prototype.blur=function()
{
	this.focused=false;
	if (this.selFile)
		this.selFile.blur();
		
	// fire event
	var evtObj=window.createEventObject(ON_FOCUS, null, null, this);
	window.processEvent(evtObj);
}
ProvSelect.prototype.focus=function()
{
	this.focused=true;
	if (this.selFile)
		this.selFile.blur();

	try
	{
		var pos=this.getPos();
		if (pos>-1)
			this.arrFiles[pos].clickText();
		//else
		//	this.doFirst();
	}
	catch (e) {};

	// fire event
	var evtObj=window.createEventObject(ON_FOCUS, null, null, this);
	window.processEvent(evtObj);
}
ProvSelect.prototype.focusElem=function(elem)
{
	this.focused=true;
	if (this.selFile)
		this.selFile.blur();
	
	// fire event
	var evtObj=window.createEventObject(ON_FOCUS, null, null, this);
	window.processEvent(evtObj);
}
ProvSelect.prototype.focusSelWorkspace=function(elem)
{
	this.focused=false;
	if (this.selFile)
		this.selFile.blur();

	// fire event
	var evtObj=window.createEventObject(ON_FOCUS, null, null, elem);
	window.processEvent(evtObj);
}
ProvSelect.prototype.focusTextElem=function(elem)
{
	this.focused=false;
	if (this.selFile)
		this.selFile.blur();
		
	// fire event
	var evtObj=window.createEventObject(ON_FOCUS, null, null, null);
	window.processEvent(evtObj);
}
ProvSelect.prototype.getIconImg=function(children)
{
	var ico=(children?this.childrenIcon:this.noChildrenIcon)
	if (ico.indexOf(".gif") == -1) ico+=".gif"
	return ("../images/"+ico);
}
ProvSelect.prototype.getCurrentLoc=function()
{
	return (this.currentLoc);
}
ProvSelect.prototype.getFileName=function(n)
{
	var lenFiles=(this.arrFiles?this.arrFiles.length:0);
	for (var i=0;i<lenFiles;i++)
		if (this.arrFiles[i].getName()==n)
			return this.arrFiles[i];
	return null;
}
ProvSelect.prototype.getFilePhrase=function(p)
{
	var lenFiles=(this.arrFiles?this.arrFiles.length:0);
	for (var i=0;i<lenFiles;i++)
		if (this.arrFiles[i].getPhrase()==p)
			return this.arrFiles[i];
	return null;
}
ProvSelect.prototype.getLocPhrase=function(id)
{
	var loc=this.currentLoc;
	if (this.prov.trail)
	{
		// remote provider
		var desStub=this.prov.studio.designers.item(id)
		if (desStub)
		{
			this.prov.desId=id
			this.prov.desStub=this.prov.studio.designers.item(id)
			return (this.prov.root+this.prov.trail+this.prov.desStub.getProvDir());
		}
		else
			return this.prov.buildFullPath(loc,id);
	}
	else
		return this.prov.buildFullPath(loc,id);
}
ProvSelect.prototype.getPhrase=function(id)
{
	var ret=(parent.getPhrase(id));
	if (!ret || (ret==id))
	{
		var temp=(parent.getPhrase("LBL_"+id));
		ret=((temp!="LBL_"+id)?temp:ret);
	}
	return ret;
}
ProvSelect.prototype.getPos=function()
{
	// returns selected position in arrFiles array
	return (this.selFile?this.selFile.i:-1);
}
ProvSelect.prototype.getTitlePhrase=function(id)
{
	var ret=id;
	var temp=(parent.getPhrase("TITLE_"+id));
	ret=((temp!="TITLE_"+id)?temp:ret);
	return ret;
}
ProvSelect.prototype.getSelFile=function()
{
	return (this.selFile);
}
ProvSelect.prototype.getSelName=function()
{
	// returns the value of the current string in selname
	return (this.selName?this.selName.value:null);
}
ProvSelect.prototype.getValue=function()
{
	// returns obj with obj.path, obj.id
	var obj=new Object();
	obj.path=this.getCurrentLoc();
	obj.id=this.getSelName();
	return obj;
}
ProvSelect.prototype.handleKeyDown=function(evt)
{
	if (!evt)
		evt=window.event;
	var b=false;
	if (!event.altKey && !event.ctrlKey && !event.shiftKey)
	{
		switch (evt.keyCode)
		{
			case keys.DELETE:
				this.doDelete(event.shiftKey);
				b=true;
				break;
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
	return b;
}
ProvSelect.prototype.handleSpanSelWorkSpace=function(evt)
{
	if (!evt)
		evt=window.event;
	var b=false;
	if (!event.altKey && !event.ctrlKey && !event.shiftKey)
	{
		switch (evt.keyCode)
		{
			case keys.ENTER:
			case keys.DOWN_ARROW:
			case keys.RIGHT_ARROW:
				this.doSelWorkspace();
				b=true;
				break;
		}
	}
	return b;
}
ProvSelect.prototype.navFirstLetter=function(k)
{
	// slow typing behavior
	var lcn=k.toLowerCase();
	var lenFiles=(this.arrFiles?this.arrFiles.length:0);
	var iStart=(this.getPos()+1);
	for (var i=iStart;i<lenFiles;i++)
	{
		if (this.arrFiles[i].getName().substring(0,1).toLowerCase()==lcn)
		{
			this.arrFiles[i].clickText();
			return true;
		}
	}
	for (var i=0;i<iStart && i<lenFiles;i++)
	{
		if (this.arrFiles[i].getName().substring(0,1).toLowerCase()==lcn)
		{
			this.arrFiles[i].clickText();
			return true;
		}
	}
	return false;
}
ProvSelect.prototype.render=function()
{
	// LocalProvider.prototype.dir has XML definition

	// set path
	if (this.pathElem)
	{
		this.pathElem.value=this.currentLoc;
		this.pathElem.title=this.currentLoc;
	}

	// clear old rows
	var lenRows=(this.table.rows?this.table.rows.length:0);
	for (var i=lenRows-1;i>=0;i--)
		this.table.deleteRow(i);

	// sorted folders, files
	this.arrFiles=new Array();

	if (this.xml)
	{
		// get folders
		var arrFolders=this.xml.getElementsByTagName("FOLDER");
		var arrFolderCells=null;
		var lenFolders=(arrFolders?arrFolders.length:0);
		if (lenFolders)
		{
			arrFolderCells=new Array();
			for (var i=0;i<lenFolders;i++)
			{
				var pf=new ProvFile(this,arrFolders[i],true);
				// only show/add if phrase exists for it
				if (pf.getPhrase())
					arrFolderCells.push(pf);
			}
			lenFolders=(arrFolderCells?arrFolderCells.length:0);
			if (lenFolders)
			{
				arrFolderCells.sort(alphaNameSort);
				for (var i=0;i<lenFolders;i++)
				{
					arrFolderCells[i].render(this.table);
					this.arrFiles.push(arrFolderCells[i]);
				}
			}
		}

		// get files
		var arrFiles=this.xml.getElementsByTagName("FILE");
		var arrFileCells=null;
		var lenFiles=(arrFiles?arrFiles.length:0);
		if (lenFiles)
		{
			arrFileCells=new Array();
			for (var i=0;i<lenFiles;i++)
			{
				var pf=new ProvFile(this,arrFiles[i],false);
				// only show/add if extension accepted and phrase exists for it
				if (!this.fileType || this.fileType.accept(pf) && pf.getPhrase())
					arrFileCells.push(pf);
			}
			lenFiles=(arrFileCells?arrFileCells.length:0);
			if (lenFiles)
			{
				arrFileCells.sort(alphaNameSort);
				for (var i=0;i<lenFiles;i++)
				{
					arrFileCells[i].render(this.table);
					this.arrFiles.push(arrFileCells[i]);
				}
			}
		}
	}
	this.focus();
}
ProvSelect.prototype.selOK=function()
{
	return (this.selName && this.selFile);
}
ProvSelect.prototype.selectName=function(n)
{
	var file=this.getFileName(n);
	if (file)
		file.select(false);

	if (this.selName)
		this.selName.value=n;
}
ProvSelect.prototype.setBack=function(elem)
{
	this.backElem=elem;
	elem.provSelect=this;
	elem.onclick=provBackClick;
}
ProvSelect.prototype.setDelete=function(elem)
{
	this.deleteElem=elem;
	elem.provSelect=this;
	elem.onclick=provDeleteClick;
}
ProvSelect.prototype.setFileList=function(elem)
{
	this.fileList=elem;
	elem.provSelect=this;
	elem.onblur=provListBlur;
	elem.onfocus=provListFocus;
}
ProvSelect.prototype.setPath=function(elem)
{
	this.pathElem=elem;
	elem.provSelect=this;
	elem.onclick=provSelWorkspace;
}
ProvSelect.prototype.setProv=function(p)
{
	this.prov=p;
	this.update();
}
ProvSelect.prototype.setSelEnabled=function(b)
{
	if (this.selSpan)
		this.selSpan.disabled=!b;
	if (this.selWorkspace)
		this.selWorkspace.disabled=!b;
}
ProvSelect.prototype.setSelFile=function(file,mouse)
{
	this.deselect(mouse);
	this.selFile=file;

	//if (this.selName)
	//	this.selName.value=((this.selFile && this.selFile.isFile())?this.selFile.getName():"");
	if (this.selName && (this.selFile && this.selFile.isFile()) )
		this.selName.value=this.selFile.getName();

	// prepare event data - provSelect and iconXML
	var a=new Array();
	a.provSelect=this;
	a.file=file;
	a.mouse=mouse;

	// fire event
	var evtObj=window.createEventObject(ON_SELECT_FILE, null, null, a);
	window.processEvent(evtObj);
}
ProvSelect.prototype.setSelMaple=function(elem)
{
	this.selMaple=new Maple(elem);
	this.selMaple.useLBL=false;
	this.selMaple.useTITLE=false;
	this.selMaple.elem.provSelect=this;
}
ProvSelect.prototype.setSelName=function(elem)
{
	this.selName=elem;
	elem.provSelect=this;
	elem.onkeydown=provSelNameKeydown;
	elem.onfocus=provTextFocus;
}
ProvSelect.prototype.setSelSpan=function(elem)
{
	this.selSpan=elem;
	elem.provSelect=this;
	elem.onclick=provSelWorkspace;
	elem.onfocus=provSelWorkspaceFocus;
}
ProvSelect.prototype.setSelType=function(elem,types)
{
	this.selType=elem;
	elem.provSelect=this;
	elem.onchange=provSelType;
	this.updateTypes(types);
}
ProvSelect.prototype.setSelWorkspace=function(elem)
{
	// this is the img next to selSpan
	this.selWorkspace=elem;
	elem.provSelect=this;
	elem.onclick=provSelWorkspace;
}
ProvSelect.prototype.setUp=function(elem)
{
	this.upElem=elem;
	elem.provSelect=this;
	elem.onclick=provUpClick;
}
ProvSelect.prototype.setXML=function(xml)
{
	this.xml=xml;
	this.render();
}
ProvSelect.prototype.update = function()
{
	// updates new xml from prov and then renders
	this.deselect();
	var xml=((this.prov && this.prov.enabled)?this.prov.dir():null);
	this.setXML(xml);
	if (this.currentLoc && this.currentProv && (this.currentProv==this.prov))
	{
		this.lastLoc=this.currentLoc;
		this.lastProv=this.currentProv;
	}
	else
	{
		this.lastLoc=null;
		this.lastProv=null;
	}
	try
	{
		this.currentLoc=this.prov.pwd();
		this.currentProv=this.prov;
	}
	catch (e)
	{
		this.currentLoc="";
		this.currentProv=null;
	}
	var ws=((this.prov && this.prov.enabled)?(typeof(this.prov.wksp)!="undefined"):false);
	this.setSelEnabled(ws);
	this.render();
}
ProvSelect.prototype.updateTypes=function(types)
{
	this.arrTypes=new Array();
	var len=this.selType.length;
	for (var i=0;i<len;i++)
	{
		this.selType.options[i].text="";
		this.selType.options[i].value="";
	}
	len=(types?types.count:0);
	for(var i=0;i<len;i++)
	{
		var id=types.hash[i];
		var filter=types.item(id);
		var text=getPhrase("LBL_"+id);
		this.arrTypes[i]=new FileType(id,filter,text);
		this.selType.options[i]=new Option();
		this.selType.options[i].value=id;
		this.selType.options[i].text=text;
	}
	if (len)
	{
		this.selType.selectedIndex=0;
		this.fileType=this.arrTypes[0];
	}
}

//-----------------------------------------------------------------------------
function FileType(id,filter,text)
{
	this.id=id;
	this.filter=filter;
	this.text=text;
	this.ext=this.filter.substring(2,this.filter.length);
	this.lenExt=this.ext.length;
}
FileType.prototype.accept=function(provFile)
{
	if (this.ext=="*")
		return true;
	var name=(provFile?provFile.getName():null);
	if (name)
	{
		var extname=name.substring(name.length-this.lenExt,name.length);
		return (extname==this.ext);
	}
	return false;
}

//-----------------------------------------------------------------------------
function ProvFile(provSelect,xml,children)
{
	this.children=children
	this.provSelect=provSelect;
	this.selText=false;
	this.row=null;
	this.setXML(xml);
}
ProvFile.prototype.blur=function()
{
	this.row.className=this.getTextClass();
}
ProvFile.prototype.clickText=function(mouse)
{
	this.select(mouse);
}
ProvFile.prototype.deselect=function()
{
	this.selText=false;
	this.row.className=this.getTextClass();
}
ProvFile.prototype.getImg=function()
{
	return this.provSelect.getIconImg(this.children);
}
ProvFile.prototype.getName=function()
{
	var s=this.xml.firstChild.text;
	s=(s?s:"");
	return s;
}
ProvFile.prototype.getLocPhrase=function()
{
	return (this.provSelect.getLocPhrase(this.getName()));
}
ProvFile.prototype.getPhrase=function()
{
	return (this.provSelect.getPhrase(this.getName()));
}
ProvFile.prototype.getProvSelect=function()
{
	return (this.provSelect);
}
ProvFile.prototype.getTextClass=function()
{
	if (this.provSelect.focused)
		return (this.selText?"dsListTextHighlight":"dsListText");
	else
		return (this.selText?"dsListTextBlur":"dsListText");	
}
ProvFile.prototype.getTitlePhrase=function()
{
	return (this.provSelect.getTitlePhrase(this.getName()));
}
ProvFile.prototype.getXML=function()
{
	return (this.xml);
}
ProvFile.prototype.isFile=function()
{
	return (!this.children);
}
ProvFile.prototype.isFolder=function()
{
	return (this.children);
}
ProvFile.prototype.render=function(table)
{
	this.table=table;
	var t=this.getTitlePhrase();
	var s=this.getPhrase();
	this.i=this.table.rows.length;

	this.row=this.table.insertRow(this.i);
	this.row.className=this.getTextClass();

	// folder/file img
	var c0=this.row.insertCell(0);
	c0.className="uFileList0";
	
	this.fImg=document.createElement("img")
	this.fImg.src=this.getImg();
	this.fImg.provFile=this;
	this.fImg.provSelect=this.provSelect;
	this.fImg.className="uImgFileList";
	this.fImg.title=s;
	c0.appendChild(this.fImg);

	// name
	var c1=this.row.insertCell(1);
	c1.className="uFileList1";
	c1.provFile=this;
	c1.provSelect=this.provSelect;
	c1.title=(this.provSelect.prov?this.provSelect.prov.buildFullPath(null,s):s); // auto path
	if (s.length>30)
		s=s.substring(0,27)+"...";
	c1.appendChild(document.createTextNode(s));

	// date
	var c2=this.row.insertCell(2);
	c2.className="uFileList2";
	c2.provFile=this;
	c2.provSelect=this.provSelect;

	var dt=this.xml.getAttribute("timestamp");
	dt=(dt?dt:"");
	if (dt && !isNaN(dt))
	{
		date=new Date();
		date.setTime(parseInt(dt,10));
		dt=parentWin.edSetUserDateFormat(date);
	}
	c2.title=dt;
	if (s.length>35)
		s=s.substring(0,32)+"...";
	c2.appendChild(document.createTextNode(dt));
}
ProvFile.prototype.select=function(mouse)
{
	if (mouse)
	{
		try
		{
			this.provSelect.selFile.focus();
		} catch (e) {};
		this.provSelect.focused=true;
	}
	
	this.provSelect.setSelFile(this,mouse);
	this.selText=true;
	this.row.className=this.getTextClass();
	//this.row.focus();

	// scroll into view
	var n=this.fImg;
	var div=this.provSelect.table.parentNode;
	detCoords(n,div);
	div=this.provSelect.table.parentNode;
	detCoords(this.provSelect.table);
	detCoords(div);
	detCoords(this.row);
	if  ((n.detTop+this.row.detHeight) > (div.scrollTop+div.detHeight))
		div.scrollTop=Math.max((n.detTop + this.row.detHeight) - div.detHeight,0);
	else if (n.detTop < div.scrollTop)
		div.scrollTop=n.detTop;
}
ProvFile.prototype.setXML=function(xml)
{
	this.xml=xml;
}
