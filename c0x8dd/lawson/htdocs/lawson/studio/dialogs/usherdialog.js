/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/dialogs/usherdialog.js,v 1.4.28.2 2012/08/08 12:48:47 jomeli Exp $ */
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

// based on studio/colorpick.js
// usher presents possible destinations
// based on designers available, yet dependent on user restrictions
// returns an object with the necessary information

var arrProv;
var arrTabs;
var btnOK;
var currentPanel=0;
var currentProv=null;
var dirDS;
var ds=null;
var retContent=null;
var uNewMaple;
var uNewDocIconSelect;
var uDesc;
var uExistingProvSelect;
var uExistingProvIconSelect;
var uExistingProvSelSpan;
var uRecentMaple;

var actId="";
var keys;
var lastPanel=2;
var lastFocus=null;
var parentWin;

tab=new Array();
tab.NEW="tab0";
tab.EXISTING="tab1";
tab.RECENT="tab2";

function preload()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	// user can override the standard dialog title
	var paramArray=new Array();
	paramArray=wndArguments;
	parentWin=paramArray[0];
	ds=paramArray[1];

	// win title must be set here
	var winTitle=(ds?ds.getItem("winTitle"):null);
	winTitle=(winTitle?(winTitle.value):null);
	if (winTitle) document.title=winTitle;
}
preload();

//-----------------------------------------------------------------------------
function initUsher()
{
	dirDS=(ds?ds.getItem("dirDS"):null);
	dirDS=(dirDS?dirDS.value:null);
	keys=parentWin.keys;
	var fileTypes=parentWin.designStudio.fileTypes;

	// new
	uNewMaple=new Maple(document.getElementById("uNewMaple"));
	uNewDocIconSelect=new IconSelect(document.getElementById("uNewDocIconSelect"));

	// existing
	uExistingProvIconSelect=new IconSelect(document.getElementById("uExistingProvIconSelect"));

	// local, existing
	uExistingProvSelSpan=document.getElementById("uExistingProvSelSpan");
	
	var prov=new ProvSelect(document.getElementById("uExistingFileTable"));
	prov.setBack(document.getElementById("uExistingProvBack"));
	prov.setDelete(document.getElementById("uExistingProvDel"));
	prov.setFileList(document.getElementById("uExistingFileList"));
	prov.setPath(document.getElementById("uExistingProvPath"));
	prov.setSelMaple(document.getElementById("uExistingProvSelWorkspaceMaple"));
	prov.setSelName(document.getElementById("uExistingFileName"));
	prov.setSelSpan(uExistingProvSelSpan);
	prov.setSelType(document.getElementById("uExistingFileTypeSelect"),fileTypes);
	prov.setSelWorkspace(document.getElementById("uExistingProvSelWorkspaceImg"));
	prov.setUp(document.getElementById("uExistingProvUp"));
	prov.pageAmt=5;
	uExistingProvSelect=prov

	// recent
	uRecentMaple=new Maple(document.getElementById("uRecentMaple"));
	uRecentMaple.useLBL=false;
	uRecentMaple.useTITLE=false;

	uDesc=new Description(document.getElementById("uDesc"));
	btnOK=document.getElementById("btnOK");
	nodeReplaceText(btnOK,getPhrase("LBL_OK"));
	var btnCancel=document.getElementById("btnCancel");
	nodeReplaceText(btnCancel,getPhrase("LBL_CANCEL"));

	// get array of acceptable tabs from input data storage
	arrTabs=(ds?ds.getItem("arrTabs"):null);
	arrTabs=(arrTabs?(arrTabs.value):(new Array("new","existing","recent")));

	var initPanel=-1; // NEW
	
	//try to set initial tab by input
	actId=(ds?ds.getItem("actId"):null);
	actId=(actId?actId.value:null);
	switch (actId)
	{
		case "new":
			initPanel=(acceptTab(0)?0:-1);
			break;
		case "existing":
			initPanel=(acceptTab(1)?1:-1);
			break;
		case "recent":
			initPanel=(acceptTab(2)?2:-1);
			break;
	}
	
	//try to set initial tab by first acceptable
	for (var i=0;(i<=2) && (initPanel==-1);i++)
		initPanel=(acceptTab(i)?i:-1);

	var label0=document.getElementById("label0");
	nodeReplaceText(label0,getPhrase("LBL_NEW"));
	label0.style.display=(acceptTab(0)?"block":"none");
	var label1=document.getElementById("label1");
	nodeReplaceText(label1,getPhrase("LBL_EXISTING"));
	label1.style.display=(acceptTab(1)?"block":"none");
	var label2=document.getElementById("label2");
	nodeReplaceText(label2,getPhrase("LBL_RECENT"));
	label2.style.display=(acceptTab(2)?"block":"none");

	var tab0=document.getElementById(tab.NEW);
	tab0.onfocus=tabFocus;
	tab0.isTab=true;
	tab0.style.display=(acceptTab(0)?"block":"none");
	var tab1=document.getElementById(tab.EXISTING);
	tab1.onfocus=tabFocus;
	tab1.isTab=true;
	tab1.style.display=(acceptTab(1)?"block":"none");
	var tab2=document.getElementById(tab.RECENT);
	tab2.onfocus=tabFocus;
	tab2.isTab=true;
	tab2.style.display=(acceptTab(2)?"block":"none");

	// shift tabs if missing
	if (!acceptTab(0))
	{
		tab1.style.left=(parseInt(tab1.style.left,0)-75)+"px";
		tab2.style.left=(parseInt(tab2.style.left,0)-75)+"px";
	}
	if (!acceptTab(1))
	{
		tab2.style.left=(parseInt(tab2.style.left,0)-75)+"px";
	}

	// get array of providers from input data storage, else from design studio
	arrProv=(ds?ds.getItem("arrProv"):null);
	arrProv=(arrProv?(arrProv.value):(parentWin.designStudio.persist.providers.items()));

	// should return content? (boolean), true by default
	retContent=(ds?ds.getItem("retContent"):null);
	retContent=(retContent?retContent.value:true);

	document.body.style.display="inline";
	if (initPanel > -1)
	{
		showPanel(initPanel);	// renders panel, but focuses on corresponding tab
		focusPanel(initPanel);	// focus on guts of panel
	}
	else
		clearReturnValue();
}

//-----------------------------------------------------------------------------
function acceptTab(i)
{
	switch (i)
	{
		case 0:
			return arrayContains(arrTabs,"new");
		case 1:
			return arrayContains(arrTabs,"existing");
		case 2:
			return arrayContains(arrTabs,"recent");
	}
	return false;
}
function acceptPrevTab(i)
{
	i--;
	if (i<0)
		i=lastPanel;
	if (acceptTab(i))
		return i;
	else
		return acceptPrevTab(i);
}
function acceptNextTab(i)
{
	i++;
	if (i>lastPanel)
		i=0;
	if (acceptTab(i))
		return i;
	else
		return acceptNextTab(i);
}

//-----------------------------------------------------------------------------
// for an integer-indexed array a, determine if s is in
function arrayContains(a,s)
{
	if (!a)
		return false;
	for(var i=0;i<a.length;i++)
		if(a[i]==s)
			return true;
	return false;
}
function clearReturnValue()
{
	window.returnValue=null;
	window.close();
}

//-----------------------------------------------------------------------------
function didCloseMaple(evtObj)
{
	var a=evtObj.extraInfo;
	switch (currentPanel)
	{
		case 0:
			break;
		case 1:
			if (a.maple==uExistingProvSelect.selMaple)
				uExistingProvSelect.doCloseSelMaple(a);
			break;
		case 2:
			break;
	}
	updateOK();
}
function didDblClickFile(evtObj)
{
	var a=evtObj.extraInfo;
	if (a.mouse)
		lastFocus=(a.provSelect?a.provSelect:null);
	setDesc("");
	switch (currentPanel)
	{
		case 0:
			break;
		case 1:
			if (a.provSelect==uExistingProvSelect)
			{
				if (a.file)
					setReturnValue();
			}
			break;
		case 2:
			break;
	}
	updateOK();
}
function didDblClickIcon(evtObj)
{
	var a=evtObj.extraInfo;
	if (a.mouse)
		lastFocus=(a.iconSelect?a.iconSelect:null);
	setDesc("");
	switch (currentPanel)
	{
		case 0:
			if (a.iconSelect)
				setReturnValue();
			break;
		case 1:
			break;
		case 2:
			break;
	}
	updateOK();
}
function didDblClickLeaf(evtObj)
{
	var a=evtObj.extraInfo;
	if (a.mouse)
		lastFocus=(a.iconSelect?a.iconSelect:null);
	setDesc("");
	switch (currentPanel)
	{
		case 0:
			break;
		case 1:
			break;
		case 2:
			if (a.leaf)
				setReturnValue();
			break;
	}
	updateOK();
}
function didFocus(evtObj)
{
	lastFocus=(evtObj?evtObj.extraInfo:null);
}
function didSelectFile(evtObj)
{
	var a=evtObj.extraInfo;
	if (a.mouse)
		lastFocus=(a.provSelect?a.provSelect:null);
	setDesc("");
	switch (currentPanel)
	{
		case 0:
			break;
		case 1:
			if (a.provSelect==uExistingProvSelect)
			{
				var p=(a.file?a.file.getLocPhrase():"");
				setDesc(p);
			}
			break;
		case 2:
			break;
	}
	updateOK();
}
function didSelectIcon(evtObj)
{
	var a=evtObj.extraInfo;
	if (a.mouse)
		lastFocus=(a.iconSelect?a.iconSelect:null);
	setDesc("");
	switch (currentPanel)
	{
		case 0:
			if (a.iconSelect==uNewDocIconSelect)
			{
				var p=(a.icon?a.icon.getTitlePhrase():"");
				setDesc(p);
			}
			break;
		case 1:
			if (a.iconSelect==uExistingProvIconSelect)
			{
				var p=(a.icon?a.icon.getTitlePhrase():"");
				setDesc(p);
				var id=(a.icon?a.icon.getId():null);
				if (!currentProv || (currentProv.getId()!=id))
				{
					currentProv=(id?parentWin.designStudio.persist.providers.item(id):null);
					updateExistingProvSelect();
				}
			}
			break;
		case 2:
			break;
	}
	updateOK();
}
function didSelectDisabledIcon(evtObj)
{
	var a=evtObj.extraInfo;
	if (a.mouse)
		lastFocus=(a.iconSelect?a.iconSelect:null);
	setDesc("");
	switch (currentPanel)
	{
		case 0:
			break;
		case 1:
			if (a.iconSelect==uExistingProvIconSelect)
			{
				var id=(a.icon?a.icon.getId():null);
				var msg=parentWin.designStudio.stringTable.getPhrase("ERR_PROV_DISABLED_"+id);
				var ret=parentWin.cmnDlg.messageBox(msg,"ok","alert",window);
			}
			break;
		case 2:
			break;
	}
	updateOK();
}
function didSelectMaple(evtObj)
{
	var a=evtObj.extraInfo;
	if (a.mouse)
		lastFocus=(a.maple?a.maple:null);
	setDesc("");
	switch (currentPanel)
	{
		case 0:
			if (a.maple==uNewMaple)
			{
				var p=(a.leaf?a.leaf.getTitlePhrase():"");
				setDesc(p);
				updateNewTypeIconSelect();
			}
			break;
		case 1:
			break;
		case 2:
			if (a.maple==uRecentMaple)
			{
				var p=(a.leaf?a.leaf.getTitlePhrase():"");
				
				// attempt to show params.id if exists
				var arrDS=parentWin.designStudio.getRecentArrDS();
				var lenDS=(arrDS?arrDS.length:0);
				for (var i=0;i<lenDS;i++)
				{
					// compare full path
					if (p==fileDSFullPath(arrDS[i]))
					{
						var params=arrDS[i].getItem("params");
						var id=(params?params.value.getItem("id"):null);
						p+=(id?"\n["+id.value+"]":"");
						break;
					}
				}
				setDesc(p);
			}
			break;
	}
	updateOK();
}
function didSelectProv(evtObj)
{
	var a=evtObj.extraInfo;
	if (a.mouse)
		lastFocus=(a.provSelect?a.provSelect:null);
	setDesc("");
	switch (currentPanel)
	{
		case 0:
			break;
		case 1:
			break;
		case 2:
			break;
	}
	updateOK();
}
function doCancel()
{
	clearReturnValue();
}
function doOK()
{
	var p=currentPanel;
	var b=false;
	if (!b)
	{
		switch (p)
		{
			case 0:
				b=uNewDocIconSelect.doEnter();
				break;
			case 1:
				b=uExistingProvSelect.doEnter();
				break;
			case 2:
				uRecentMaple.doEnter();
				break;
		}
	}
}
function fileDSFullPath(f)
{
	var docPath=f.getItem("docPath");
	docPath=(docPath?docPath.value:"");
	var docName=f.getItem("docName");
	docName=(docName?docName.value:"");
	var provId=f.getItem("provId");
	provId=(provId?provId.value:"");

	var prov=parentWin.designStudio.persist.getProv(provId);
	return (prov?prov.buildFullPath(docPath,docName).replace(/\\/g,'/'):"");
}
function focusPanel(p)
{
	switch (p)
	{
		case 0:
			uNewMaple.focus();
			break;
		case 1:
			uExistingProvIconSelect.focus();
			break;
		case 2:
			uRecentMaple.focus();
			break;
	}
}
function getDesignerId(id)
{
	return parentWin.designStudio.designers.item(id);
}
function getPhrase(p)
{
	return (parentWin.designStudio.stringTable.getPhrase(p));
}
function getReturnValue()
{
	var ret=null;
	switch (currentPanel)
	{
		case 0:
			var subLeaf=uNewMaple.getValue();
			var docIcon=uNewDocIconSelect.getValue();
			ret=new Object();
			ret.id=(subLeaf?subLeaf.getId():null);
			ret.docId=(docIcon?docIcon.getId():null);
			ret.actId="new";
			if (!ret.id || !ret.docId)
				ret=null;
			break;
		case 1:
			ret=uExistingProvSelect.getValue(); // returns obj with obj.path, obj.id
			if (!ret.path || !ret.id)
				ret=null;
			else if (currentProv)
			{
				ret.actId="existing";
				var dsIn=new parentWin.DataStorage();
				dsIn.add("docName",ret.id);
				dsIn.add("docPath",ret.path);

				var dsObject=currentProv.get(dsIn,retContent);
				if (dsObject)
				{
					var id=(dsObject.getItem("id")?dsObject.getItem("id").value:null);
					var docId=(dsObject.getItem("docId")?dsObject.getItem("docId").value:null);
					var docName=(dsObject.getItem("docName")?dsObject.getItem("docName").value:null);
					var docPath=(dsObject.getItem("docPath")?dsObject.getItem("docPath").value:null);
					var provId=currentProv.getId();

					if (id) ret.id=id;
					if (docId) ret.docId=docId;
					if (docName) ret.docName=docName;
					if (docPath) ret.docPath=docPath;
					if (provId) ret.provId=provId;

					if (retContent)
					{
						var contents=(dsObject.getItem("contents")?dsObject.getItem("contents").value:null);
						if (contents) ret.contents=contents;
					}
				}
				else
					ret=null;
			}
			break;
		case 2:
			ret=new Object();
			var leaf=uRecentMaple.getValue();
			ret.id=(leaf?leaf.getId():null);
			
			var xmlDOM = parentWin.xmlFactory.createInstance("DOM");
			var mapleXML=null;
			var arrDS=parentWin.designStudio.getRecentArrDS();
			var lenDS=(arrDS?arrDS.length:0);
			var fileDS=null;
			for (var i=0;i<lenDS && !fileDS;i++)
			{
				fileDS=arrDS[i];
				var full=fileDSFullPath(fileDS);
				if (full && (full!=ret.id))
					fileDS=null;
			}
			// same as openRecent
			if (fileDS)
			{
				for (var j=0;j<fileDS.length;j++)
				{
					// fileDS
					var n=fileDS.items[j].name;
					var v=fileDS.items[j].value;
					ret[n]=v;
				}
			}
			else
				ret=null;
			break;
	}
	return ret;
}
//-----------------------------------------------------------------------------
function handleKeyDown(evt)
{
	evt=(evt?evt:window.event);
	var b=false;
	var p=currentPanel;
	var elem=evt.srcElement;
	var tab=isTab(elem)&&(lastFocus==elem);
	if (window.captureObj)
		b|=window.captureObj.handleKeyDown(evt);
	if (!b) {
		switch (p)
		{
			case 0:
				if (lastFocus==uNewMaple)
					b=uNewMaple.handleKeyDown(evt);
				else if (lastFocus==uNewDocIconSelect)
					b=uNewDocIconSelect.handleKeyDown(evt);
				break;
			case 1:
				if (lastFocus==uExistingProvIconSelect)
					b=uExistingProvIconSelect.handleKeyDown(evt);
				else if (lastFocus==uExistingProvSelect)
					b=uExistingProvSelect.handleKeyDown(evt);
				else if (lastFocus==uExistingProvSelSpan)
					b=uExistingProvSelect.handleSpanSelWorkSpace(evt);
				break;
			case 2:
				if (lastFocus==uRecentMaple)
					b=uRecentMaple.handleKeyDown(evt);
				break;
		}
	}
	if (!b)
	{
		switch (evt.keyCode)
		{
			case keys.ENTER:
				if (elem && (elem.tagName && (elem.tagName.toLowerCase()=="input")) && (elem.type && (elem.type.toLowerCase()=="button")))
				{
					elem.click();
					b=true;
				}
				if (!b)
				{
					switch (p)
					{
						case 0:
							b=uNewDocIconSelect.doEnter();
							break;
						case 1:
							b=uExistingProvSelect.doEnterFileName();
							break;
						case 2:
							break;
					}
				}
				break;
			case keys.PAGE_UP:
				if (evt.ctrlKey)
				{
					showPanel(acceptPrevTab(p));
					b=true;
				}
				break;
			case keys.LEFT_ARROW:
				if (tab) {
					showPanel(acceptPrevTab(p));
					b=true;
				}
				break;
			case keys.PAGE_DOWN:
				if (evt.ctrlKey)
				{
					showPanel(acceptNextTab(p));
					b=true;
				}
				break;
			case keys.RIGHT_ARROW:
				if (tab) {
					showPanel(acceptNextTab(p));
					b=true;
				}
				break;
			case keys.ESCAPE:
				clearReturnValue();
				b=true;
				break;
		}
	}
	if (!b)
	{
		switch (evt.keyCode)
		{
			case keys.TAB:
				//  new focus should set.
				lastFocus=null;
				break;
		}
	}
	if (b)
	{
		evt.cancelBubble=true
		evt.returnValue=false
	}
	return (!b);
}
function hideCurrentPanel()
{
	var p=currentPanel;

	var panel=document.getElementById("panel" + p);
	var tab=document.getElementById("tab" + p);
	panel.className = "dsTabPaneInactive";
	tab.className = "dsTabButtonInactive";
	tab.tabIndex = "0";
	//tab.disabled=true;

	// disable panes
	switch (p)
	{
		case 0:
			uNewMaple.elem.tabIndex = "0";
			uNewDocIconSelect.elem.tabIndex = "0";
			//uNewMaple.elem.disabled=true;
			//uNewDocIconSelect.elem.disabled=true;
			break;
		case 1:
			uExistingProvIconSelect.elem.tabIndex = "0";
			//uExistingProvIconSelect.elem.disabled=true;
			break;
		case 2:
			uRecentMaple.elem.tabIndex = "0";
			//uRecentMaple.elem.disabled=true;
			break;
	}
}
function isTab(elem)
{
	return (elem && (elem.isTab) && (elem.id.substring(0,3)=="tab"));
}
function loadExistingPanel()
{
	updateExistingProvIconSelect();
	updateExistingProvSelect();
	document.getElementById("panel1").status="loaded";
}
function loadNewPanel()
{
	updateNewMaple();
	updateNewTypeIconSelect();
	document.getElementById("panel0").status="loaded";
}
function loadPanel(p)
{
	switch (p)
	{
		case 0:
			loadNewPanel();
			break;
		case 1:
			loadExistingPanel();
			break;
		case 2:
			loadRecentPanel();
			break;
	}
}
function loadRecentPanel()
{
	updateRecentMaple();
	document.getElementById("panel2").status="loaded";
}
function nodeReplaceText(node,text) {
	if (node.hasChildNodes()) {
		var len=node.childNodes.length
		for (var i=0;i<len;i++) {
			if (node.childNodes[i].nodeType == 3) {
				node.childNodes[i].nodeValue = text
			}
		}
	}
}
function setDesc(d)
{
	uDesc.set(d);
}
function setReturnValue()
{
	window.returnValue=getReturnValue();
	window.close();
}

//-----------------------------------------------------------------------------
// p is integer of current panel; p=0 for panel0;
function showPanel(p)
{
	setDesc("");

	if (!acceptTab(p))
		return;

	if (p!=currentPanel)
		hideCurrentPanel();

	// make new panel current panel
	currentPanel = p;

	// load panel if not already loaded
	if (document.getElementById("panel" + p).status!="loaded")
		loadPanel(p);

	// show new panel
	panel=document.getElementById("panel" + p);
	tab=document.getElementById("tab" + p);
	panel.className = "dsTabPaneActive";
	tab.className = "dsTabButtonActive";
	tab.tabIndex = "1";
	tab.focus();

	// enable panes
	switch (p)
	{
		case 0:
			actId="new";
			uNewMaple.elem.tabIndex = "1";
			uNewDocIconSelect.elem.tabIndex = "1";
			break;
		case 1:
			actId="existing";
			uExistingProvIconSelect.elem.tabIndex = "1";
			break;
		case 2:
			actId="recent";
			uRecentMaple.elem.tabIndex = "1";
			break;
	}
	updateOK();
}
function tabFocus(evt)
{
	evt=(evt?evt:window.event);
	var elem=(evt?evt.srcElement:null);
	if (!elem)
		return;

	var currentTabId=("tab" + currentPanel);
	var currentTab=document.getElementById(currentTabId);
	var tabId=elem.id;

	if (tabId!=currentTabId)
		currentTab.focus();
	lastFocus=currentTab;
}
function updateExistingProvSelect()
{
	var docName=null;
	if (dirDS)
	{
		if (currentProv) currentProv.setDirDS(dirDS);
		docName=dirDS.getItem("docName");
		docName=(docName?docName.value:null);
		if (docName) uExistingProvSelect.selectName(docName);
	}
	uExistingProvSelect.setProv(currentProv);
}
function updateExistingProvIconSelect()
{
	// prepare the xml in order to render the maple structures
	// the attributes will be returned as part of a datastorage object
	// in getReturnValue
	var lenProv=(arrProv?arrProv.length:0);
	var xml=null;
	if (lenProv)
	{
		var xmlDOM = parentWin.xmlFactory.createInstance("DOM");
		var xml = xmlDOM.createElement("IconSelect");
		for (var i=0;i<lenProv;i++)
		{
			var prov=arrProv[i];
			var name=prov.xml.getAttribute("id");
			var item = xmlDOM.createElement("ITEM");
			item.setAttribute("id", name);
			// PT111803
			var enabled = (prov.enabled?"1":"0");
			item.setAttribute("enabled", enabled);
			item.setAttribute("icon", "ico" + name);
			xml.appendChild(item);
		}
	}
	uExistingProvIconSelect.setXML(xml);
	var provId=(dirDS?dirDS.getItem("provId"):null);
	provId=(provId?provId.value:null);
	if (provId)
		uExistingProvIconSelect.selectId(provId);
	else
		uExistingProvIconSelect.doFirst();
}
function updateNewMaple()
{
	// prepare the xml in order to render the maple and iconselect structures
	// the attributes will be returned as part of a datastorage object
	// in getReturnValue
	var xmlDOM = parentWin.xmlFactory.createInstance("DOM");
	var mapleXML=null;

	var arrDes=parentWin.designStudio.designers.items();
	var lenDes=(arrDes?arrDes.length:0);
	if (lenDes)
	{
		mapleXML = xmlDOM.createElement("Maple");
		for (var i=0;i<lenDes;i++)
		{
			var typ = xmlDOM.createElement("ITEM");
			typ.setAttribute("id", arrDes[i].getId());
			typ.setAttribute("icon", "folderclosed");
			mapleXML.appendChild(typ);
		}
	}

	// sets maple's xml root node and renders it
	uNewMaple.setXML(mapleXML);
	uNewMaple.focus();
}
function updateNewTypeIconSelect()
{
	// update the icon select by giving it a new xml root node
	var v=uNewMaple.getValue();
	var desId=(v?v.getId():null);
	var desObj=(desId?(parentWin.designStudio.designers.item(desId)):null);
	var arrDocs=(desObj?desObj.getDocs().items():null);
	var lenDocs=(arrDocs?arrDocs.length:0);
	var xml=null;
	if (lenDocs)
	{
		xmlDOM = parentWin.xmlFactory.createInstance("DOM");
		xml = xmlDOM.createElement("IconSelect");
		for (var j=0;j<lenDocs;j++)
		{
			var id=arrDocs[j].getId();
			var item = xmlDOM.createElement("ITEM");
			item.setAttribute("id", id);
			//item.setAttribute("icon", "icoproj");
			item.setAttribute("icon", "ico" + id + "32");
			xml.appendChild(item);
		}
	}

	// sets icon select's xml root node and renders it
	uNewDocIconSelect.setXML(xml);
	uNewDocIconSelect.doFirst();
}
function updateOK()
{
	var d=true;
	switch (currentPanel)
	{
		case 0:
			var subLeaf=uNewMaple.getValue();
			var docIcon=uNewDocIconSelect.getValue();
			d = (subLeaf && docIcon) ? false : true;
			break;
		case 1:
			d=uExistingProvSelect.selOK() ? false : true;
			break;
		case 2:
			var subLeaf=uRecentMaple.getValue();
			d = (subLeaf) ? false : true;
			break;
	}
	btnOK.disabled=d;
}
function updateRecentMaple()
{
	// builds maple XML string based on array of recent data storages
	// arrDS - array of data storages.  each element is a fileDS.
	// fileDS - file data storage, actId,id,docId,docName,docPath,provId.
	var xmlDOM = parentWin.xmlFactory.createInstance("DOM");
	var mapleXML=null;
	var arrDS=parentWin.designStudio.getRecentArrDS();
	var lenDS=(arrDS?arrDS.length:0);
	if (lenDS)
	{
		mapleXML = xmlDOM.createElement("Maple");
		for (var i=0;i<lenDS;i++)
		{
			var fileDS=arrDS[i];
			var full=fileDSFullPath(arrDS[i]);
			if (full)
			{
				var docId = arrDS[i].getItem("docId").value;
				var icon=(docId?"ico" + docId + "16":"icoprojsm");
				var typ = xmlDOM.createElement("ITEM");
				typ.setAttribute("id", full);
				typ.setAttribute("title", full);
				typ.setAttribute("icon", icon);
				mapleXML.appendChild(typ);
			}
		}
	}
	// sets maple's xml root node and renders it
	uRecentMaple.setXML(mapleXML);
	uRecentMaple.focus();
}

//-----------------------------------------------------------------------------
function EventObject()
{
	this.eventId = "";
	this.windowEvent = null;
	this.cmdHistoryId = "";
	this.extraInfo = null;
}

//-----------------------------------------------------------------------------
window.createEventObject=function(eventId, windowEvent, cmdHistoryId, extraInfo)
{
	var evtObj = new EventObject();
	evtObj.eventId = eventId;
	evtObj.windowEvent = windowEvent;
	evtObj.cmdHistoryId = cmdHistoryId;
	evtObj.extraInfo = extraInfo
	return evtObj;
}

window.processEvent=function(evtObj)
{
	switch(evtObj.eventId)
	{
		case ON_CLOSE_MAPLE:
			didCloseMaple(evtObj);
			break;
		case ON_DBLCLICK_FILE:
			didDblClickFile(evtObj);
			break;
		case ON_DBLCLICK_ICON:
			didDblClickIcon(evtObj);
			break;
		case ON_DBLCLICK_LEAF:
			didDblClickLeaf(evtObj);
			break;
		case ON_FOCUS:
			didFocus(evtObj);
			break;
		case ON_SELECT_DISABLED_ICON:
			didSelectDisabledIcon(evtObj);
			break;
		case ON_SELECT_FILE:
			didSelectFile(evtObj);
			break;
		case ON_SELECT_ICON:
			didSelectIcon(evtObj);
			break;
		case ON_SELECT_LEAF:
			didSelectMaple(evtObj);
			break;
		case ON_SELECT_PROV:
			didSelectProv(evtObj);
			break;
	}
}

//-----------------------------------------------------------------------------
function Description(elem)
{
	this.elem=elem;
}
Description.prototype.set=function(s)
{
	nodeReplaceText(this.elem,s);
}
Description.prototype.setTitle=function(s)
{
	this.elem.title=s;
}

