/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/dialogs/saveasdlg.js,v 1.5.2.1.16.2.6.2 2012/08/08 12:48:47 jomeli Exp $ */
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

// based on opendlg.js
// usher presents possible destinations
// based on designers available, yet dependent on user restrictions
// returns an object with the necessary information

var arrProv;
var btnOK;
var dirDS;
var ds;
var existingProvId;
var uDesc;
var uExistingProvIconSelect;
var uExistingProvPanel;
var uExistingProvPanel2;
var uExistingProvSelect;
var uExistingProvSelect2;
var uExistingProvSelSpan;

var keys;
var lastFocus=null;
var parentWin;
var saveDoc;
var actId="save"

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
function initSaveAsDlg()
{
	saveDoc=(ds?ds.getItem("doc"):null);
	saveDoc=(saveDoc?saveDoc.value:null);
	dirDS=(ds?ds.getItem("dirDS"):null);
	dirDS=(dirDS?dirDS.value:null);
	keys=parentWin.keys;
	var fileTypes=parentWin.designStudio.fileTypes;
	
	// local
	uExistingProvIconSelect=new IconSelect(document.getElementById("uExistingProvIconSelect"));
	uExistingProvPanel=document.getElementById("uExistingProvPanel");

	uExistingProvSelSpan=document.getElementById("uExistingProvSelSpan");

	var prov=new ProvSelect(document.getElementById("uExistingFileTable"));
	prov.setBack(document.getElementById("uExistingProvBack"));
	prov.setDelete(document.getElementById("uExistingProvDel"));
	prov.setFileList(document.getElementById("uExistingFileList"));
	prov.setPath(document.getElementById("uExistingProvPath"));
	prov.setSelMaple(document.getElementById("uExistingProvSelWorkspaceMaple"));
	prov.setSelName(document.getElementById("uExistingFileName"));
	prov.setSelSpan(document.getElementById("uExistingProvSelSpan"));
	prov.setSelType(document.getElementById("uExistingFileTypeSelect"),fileTypes);
	prov.setSelWorkspace(document.getElementById("uExistingProvSelWorkspaceImg"));
	prov.setUp(document.getElementById("uExistingProvUp"));
	uExistingProvSelect=prov;
	
	// remote
	uExistingProvPanel2=document.getElementById("uExistingProvPanel2");

	prov=new ProvSelect(document.getElementById("uExistingFileTable2"));
	prov.setBack(document.getElementById("uExistingProvBack2"));
	prov.setDelete(document.getElementById("uExistingProvDel2"));
	prov.setFileList(document.getElementById("uExistingFileList2"));
	prov.setPath(document.getElementById("uExistingProvPath2"));
	prov.setSelName(document.getElementById("uExistingFileName2"));
	prov.setSelSpan(document.getElementById("uExistingProvSelSpan2"));
	prov.setSelType(document.getElementById("uExistingFileTypeSelect2"),fileTypes);
	prov.setUp(document.getElementById("uExistingProvUp2"));
	uExistingProvSelect2=prov;
	
	uDesc=new Description(document.getElementById("uDesc"));
	btnOK=document.getElementById("btnOK");
	nodeReplaceText(btnOK,getPhrase("LBL_OK"));
	var btnCancel=document.getElementById("btnCancel");
	nodeReplaceText(btnCancel,getPhrase("LBL_CANCEL"));

	// get array of providers from input data storage, else from design studio
	arrProv=(dirDS?dirDS.getItem("arrProv"):null);
	arrProv=(arrProv?(arrProv.value):(parentWin.designStudio.persist.providers.items()));

	if (arrProv.length > 0)
	{
		var provider = arrProv[0];
		var id = parentWin.designStudio.activeDesigner.id;
		var desStub = parentWin.designStudio.designers.item(id);
		var docStub = desStub.getDoc(saveDoc.docId);
		var maxLen = docStub.getMaxLen();
		if (maxLen && maxLen.length > 0)
		{
			document.getElementById("uExistingFileName").maxLength = maxLen;
			document.getElementById("uExistingFileName2").maxLength = maxLen;
		}
	}

	document.body.style.display="inline";
	updateExistingProvIconSelect();
}

//-----------------------------------------------------------------------------
function clearReturnValue()
{
	window.returnValue=null;
	window.close();
}
function didCloseMaple(evtObj)
{
	var a=evtObj.extraInfo;
	if (a.maple==uExistingProvSelect.selMaple)
		uExistingProvSelect.doCloseSelMaple(a);
	else if (a.maple==uExistingProvSelect2.selMaple)
		uExistingProvSelect2.doCloseSelMaple(a);
	updateOK();
}
function didDblClickFile(evtObj)
{
	var a=evtObj.extraInfo;
	if (a.mouse)
		lastFocus=(a.provSelect?a.provSelect:null);
	if (a.file)
		setReturnValue();
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
	var p=(a.file?a.file.getLocPhrase():"");
	setDesc(p);
	updateOK(true);
}
function didSelectIcon(evtObj)
{
	var a=evtObj.extraInfo;
	if (a.mouse)
		lastFocus=(a.iconSelect?a.iconSelect:null);
	setDesc("");
	if (a.iconSelect==uExistingProvIconSelect)
	{
		var p=(a.icon?a.icon.getTitlePhrase():"");
		setDesc(p);
		var id=(a.icon?a.icon.getId():null);
		if (existingProvId!=id)
		{
			updateExistingProvSelect();
			if (id)
				showExistingPanel(id);
		}
	}
	updateOK();
}
function didSelectDisabledIcon(evtObj)
{
	var a=evtObj.extraInfo;
	if (a.mouse)
		lastFocus=(a.iconSelect?a.iconSelect:null);
	setDesc("");
	if (a.iconSelect==uExistingProvIconSelect)
	{
		var id=(a.icon?a.icon.getId():null);
		var msg=parentWin.designStudio.stringTable.getPhrase("ERR_PROV_DISABLED_"+id);
		var ret=parentWin.cmnDlg.messageBox(msg,"ok","alert",window);
	}
	updateOK();
}
function didSelectMaple(evtObj)
{
	var a=evtObj.extraInfo;
	if (a.mouse)
		lastFocus=(a.maple?a.maple:null);
	setDesc("");
	updateOK();
}
function didSelectProv(evtObj)
{
	var a=evtObj.extraInfo;
	if (a.mouse)
		lastFocus=(a.provSelect?a.provSelect:null);
	setDesc("");
	updateOK();
}
function doCancel()
{
	clearReturnValue();
}
function doOK()
{
	var b=false;
	if (updateOK())
	{
		setReturnValue();
		b=true;
	}
	if (!b)
	{
		if (lastFocus==uExistingProvIconSelect)
			b=uExistingProvIconSelect.doEnter();
		else if (lastFocus==uExistingProvSelect)
			b=uExistingProvSelect.doEnter();
		else if (lastFocus==uExistingProvSelect2)
			b=uExistingProvSelect2.doEnter();
	}
	return b;
}
function getPhrase(p)
{
	return (parentWin.designStudio.stringTable.getPhrase(p));
}
//-----------------------------------------------------------------------------
// currently does not prompt if file already exists.
function getReturnValue(noMsg)
{
	var ret=null;
	var oCheck=false;
	if (existingProvId=="local")
	{
		ret=new Object();
		ret.prov = existingProvId;
		ret.loc = uExistingProvSelect.getCurrentLoc();
		var str_name = uExistingProvSelect.getSelName();
		ret.name = (!str_name) ? null : str_name.toLowerCase();
		if (!ret.loc || !ret.name)
			ret=null;
		else
			ret.oCheck=(uExistingProvSelect.doesFileExist());
	}
	else if (existingProvId=="remote")
	{
		ret=new Object();
		ret.prov = existingProvId;
		ret.loc = uExistingProvSelect2.getCurrentLoc();
		var str_name = uExistingProvSelect2.getSelName();
		ret.name = (!str_name) ? null : str_name.toLowerCase();
		if (!ret.name)
			ret=null;
		else
			ret.oCheck=(uExistingProvSelect2.doesFileExist());
	}

	// check acceptable filename
	if (ret)
	{
		if (!parentWin.top.validFilename(ret.name))
		{
			if (!noMsg)
			{
				var msg=getPhrase("ERR_PROV_FILENAME");
				parentWin.top.cmnDlg.messageBox(msg,"ok","stop",window);
			}
			ret=null;
		}
	}
	return ret;
}

//-----------------------------------------------------------------------------
function handleKeyDown(evt)
{
	if (!evt)
		evt=window.event;
	var b=false;
	var elem=evt.srcElement;
	if (window.captureObj)
		b|=window.captureObj.handleKeyDown(evt);	
	if (!b)
	{
		if (lastFocus==uExistingProvIconSelect)
			b=uExistingProvIconSelect.handleKeyDown(evt);
		else if (lastFocus==uExistingProvSelect)
			b=uExistingProvSelect.handleKeyDown(evt);
		else if (lastFocus==uExistingProvSelect2)
			b=uExistingProvSelect2.handleKeyDown(evt);
		else if (lastFocus==uExistingProvSelSpan)
			b=uExistingProvSelect.handleSpanSelWorkSpace(evt);
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
				else if (updateOK())
				{
					setReturnValue();
					b=true;
				}
				break;
			case keys.ESCAPE:
				clearReturnValue();
				b=true;
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
function nodeReplaceText(node,text)
{
	if (node.hasChildNodes())
	{
		var len=node.childNodes.length
		for (var i=0;i<len;i++)
		{
			if (node.childNodes[i].nodeType == 3)
			{
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
	var ret=getReturnValue();
	if (ret && ret.oCheck)
	{
		var bOverwrite=parentWin.top.cmnDlg.messageBox(getPhrase("MSG_FILE_OVERWRITE"),"okcancel","alert");
		switch (bOverwrite)
		{
			case "cancel":
				return;
				break;
			case "ok":
				break;
		}
	}
	window.returnValue=ret;
	window.close();
}
function showExistingPanel(provid)
{
	existingProvId=provid;
}
function updateExistingProvIconSelect()
{
	// prepare the xml in order to render the maple structures
	// the attributes will be returned as part of a datastorage object
	// in getReturnValue
	
	// providers may not be listed because they are not available on this
	// client computer (filescriptingobject)
	
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
			item.setAttribute("icon", "ico"+name);
			// PT111803
			var enabled = (prov.enabled?"1":"0");
			item.setAttribute("enabled", enabled);
			xml.appendChild(item);
		}
	}
	uExistingProvIconSelect.setXML(xml);
	// select prov
	var provId=null;
	if (dirDS)
	{
		provId=(dirDS?dirDS.getItem("provId"):null);
		provId=(provId?provId.value:null);
	}
	if (provId)
		uExistingProvIconSelect.selectId(provId);
	else
		uExistingProvIconSelect.doFirst();
}
function updateExistingProvSelect()
{
	var icon=uExistingProvIconSelect.getValue();
	var provid=(icon?icon.getId():null);
	var prov=(provid?parentWin.designStudio.persist.providers.item(provid):null);
	if (!prov) return false;
	
	var docName=null;
	if (dirDS)
	{
		prov.setDirDS(dirDS);
		docName=dirDS.getItem("docName");
		docName=(docName?docName.value:null);
	}
	if (provid=="local")
	{
		uExistingProvPanel.className="dsTabPaneActive";
		uExistingProvPanel2.className="dsTabPaneInactive";
		uExistingProvSelect.setProv(prov);
		if (docName) uExistingProvSelect.selectName(docName);
	}
	else if (provid=="remote")
	{
		uExistingProvPanel.className="dsTabPaneInactive";
		uExistingProvPanel2.className="dsTabPaneActive";
		uExistingProvSelect2.setProv(prov);
		prov.highest=dirDS.getItem("topPath") ? dirDS.getItem("topPath").value : prov.root;
		prov.desId=parentWin.designStudio.activeDesigner.id
		prov.desStub=parentWin.designStudio.designers.item(prov.desId);
		prov.docStub=prov.desStub.getDoc(saveDoc.docId);
		if (prov.desId=="uidesigner")		// don't allow remote form XML to be deleted
			document.all.uExistingProvDel2.disabled=true;
		if (docName) uExistingProvSelect2.selectName(docName);
	}
}
function updateOK(noMsg)
{
	var ret=getReturnValue(noMsg);
	btnOK.disabled = ret ? false : true;
	return ret;
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

