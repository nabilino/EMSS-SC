/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/users/preferences/Attic/CacheTab.js,v 1.1.2.2.2.2 2012/08/08 12:37:27 jomeli Exp $ */
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

CacheTab.prototype = new TabPage();
CacheTab.prototype.constructor = CacheTab;
CacheTab.superclass = TabPage.prototype;

function CacheTab(id,pageMgr)
{
	CacheTab.superclass.setId.call(this,id);
	CacheTab.superclass.setManager.call(this,pageMgr);

	this.formCache=null;
}

//-----------------------------------------------------------------------------
CacheTab.prototype.activate = function()
{
	try {
		var elem = this.mgr.document.getElementById("selCacheLevel");
		elem.focus();
		if (elem.selectedIndex == -1 && elem.options.length)
			elem.selectedIndex = 0;

	} catch (e) { }
}

//-----------------------------------------------------------------------------
CacheTab.prototype.deactivate = function()
{
	// todo: test for valid folder?
	return true;
}

//-----------------------------------------------------------------------------
CacheTab.prototype.doBrowse = function()
{
	var txtElem = this.mgr.document.getElementById("txtCachePath");
	var startFolder = txtElem.value;
	if (startFolder == "")
		startFolder = this.mgr.portalWnd.oFormCache.getDefaultCachePath();

	// put up browse for folder dialog
	var newFolder=this.mgr.portalWnd.cmnDlg.folderSelect(startFolder);
	if (newFolder)
	{
		txtElem.value = newFolder
		this.setModified();
		this.loadCacheList();
		this.setButtonsState();
	}
}

//-----------------------------------------------------------------------------
CacheTab.prototype.doClearAll = function()
{
	var selElem = this.mgr.document.getElementById("selCacheList");
	if (selElem.options.length < 1) return;

	// confirm clear the cache request
	var msg = this.mgr.msgs.getPhrase("lblOKToDeleteAllCache");
	var response = this.mgr.portalWnd.cmnDlg.messageBox(msg + "'?",
			"okcancel", "question", this.mgr.wnd);
	if (response != "ok") return;

	// initialize the cache object
	this.mgr.portalWnd.oFormCache.initialize();

	this.loadCacheList();
	this.setButtonsState();
}

//-----------------------------------------------------------------------------
CacheTab.prototype.doDelete = function()
{
	var selElem = this.mgr.document.getElementById("selCacheList");
	var selIndex = selElem.selectedIndex;
	if (selIndex < 0) return;

	// confirm delete of item
	var text = this.mgr.portalWnd.strTrim(selElem.options[selIndex].text);
	var msg = this.mgr.msgs.getPhrase("lblOKToDeleteCacheItem");
	var response = this.mgr.portalWnd.cmnDlg.messageBox(msg + ": " + text + "?",
			"okcancel", "question", this.mgr.wnd);
	if (response != "ok") return;

	// parse out the items
	// (this may have been easier if value had meaning -
	// but we want the text to be sorted when building)
	var value = selElem.options[selIndex].text;
	var parms = value.split(" ");
	var pdl=parms[0];
	var i = 1;
	while (!parms[i])
		i++;
	var tkn=parms[i];
		i++;
	tkn = tkn.toLowerCase();
	while (i < parms.length && !parms[i])
		i++;
	var id=(i < parms.length ? parms[i] : "");

	// find the cache index node
	var frmCache = this.mgr.portalWnd.oFormCache;
//	var oXml = frmCache.getIndex();
//	var pdlNode = oXml.selectSingleNode("/CACHE/PROJECT[@id='" + pdl +"']");
//	if (!pdlNode) return;
//	var formNode = pdlNode.selectSingleNode("FORM[@token='"+tkn+"' and @id='"+id+"']");
//	if (!formNode) return;

	// remove form and select option item
	frmCache.removeForm(pdl,tkn,id);
	selElem.removeChild(selElem.options[selIndex]);
	var idx=selIndex-1;
	if (idx < 0 && selElem.options.length)
		idx=0;
	selElem.selectedIndex=idx;

//	no setModified: this is done realtime
}

//-----------------------------------------------------------------------------
CacheTab.prototype.init = function()
{
	// set the button text (if not English)
	if (this.mgr.portal.getLanguage() != "en-us")
	{
		var phrase = this.mgr.msgs.getPhrase("btnBrowse");
		var btn = this.mgr.document.getElementById("btnCacheBrowse");
		this.mgr.portalWnd.cmnSetElementText(btn, phrase);

		phrase = this.mgr.msgs.getPhrase("btnClearAll");
		btn = this.mgr.document.getElementById("btnCacheClearAll");
		this.mgr.portalWnd.cmnSetElementText(btn, phrase);

		phrase = this.mgr.portal.getPhrase("LBL_DELETE");
		btn = this.mgr.document.getElementById("btnCacheDelete");
		this.mgr.portalWnd.cmnSetElementText(btn, phrase);
	}

	// load options (and set selection)
	this.setLevelOptions();

	// get path
	this.mgr.document.getElementById("txtCachePath").value = 
			this.mgr.wnd.parent.profile.getPreference("cachepath");

	// load cache contents
	this.loadCacheList();

	// set button enable/disable
	this.setButtonsState();

	return true;
}

//-----------------------------------------------------------------------------
CacheTab.prototype.loadCacheList = function()
{
	var cacheDom = this.mgr.portalWnd.oFormCache.getIndex();
	if (!cacheDom) return;

	var selElem = this.mgr.document.getElementById("selCacheList");
	var len = (selElem ? selElem.options.length : 0);
	for (var i = len-1; i > -1 ; i--)
		selElem.removeChild(selElem.options[i]);

	// get all the entries in an array
	var sortArray = new Array();
	var pdlNodes = cacheDom.selectNodes("/CACHE/PROJECT");
	len = (pdlNodes ? pdlNodes.length : 0);
	if (len == 0) return;

	for (var i = 0; i < len; i++)
	{
		var pdl = pdlNodes[i].getAttribute("id");
		var formNodes = pdlNodes[i].selectNodes("FORM");
		var lenj = (formNodes ? formNodes.length : 0);
		for (var j = 0; j < lenj; j++)
		{
			var tkn = formNodes[j].getAttribute("token");
			var id = formNodes[j].getAttribute("id");
			var optionStr = this.mgr.portalWnd.strFillChar(pdl,10,"right"," ");
			optionStr += this.mgr.portalWnd.strFillChar(tkn,8,"right"," ").toUpperCase();
			optionStr += this.mgr.portalWnd.strFillChar(id,20,"right"," ");
			sortArray[sortArray.length] = optionStr;
		}
	}

	// now sort and add to select element
	if (sortArray.length == 0) return;
	sortArray.sort();
	len = sortArray.length;
	for (var i = 0; i < len; i++)
		this.mgr.portalWnd.cmnCreateSelectOption(
				this.mgr.document, selElem, sortArray[i], i);
	selElem.options[0].selected=true;
}

//-----------------------------------------------------------------------------
CacheTab.prototype.onSelectionChange = function(selElem)
{
	var selIndex = selElem.selectedIndex;
	if (selIndex < 0) return;

	var frmCache = this.mgr.portalWnd.oFormCache;
	var item=null;
	switch (selElem.id)
	{
	case "selCacheLevel":
		var value = selElem.options[selIndex].value;
		var folder = this.mgr.document.getElementById("txtCachePath").value;
		switch (parseInt(value,10))
		{
		case frmCache.cacheNone:
			if (frmCache.level != frmCache.cacheNone)
			{
				// confirm clear existing cache
				var msg = this.mgr.msgs.getPhrase("lblOKToDeleteAllCache");
				if ("ok" != this.mgr.portalWnd.cmnDlg.messageBox(msg,"okcancel","question",window))
				{
					selElem.options[frmCache.level].selected = true;
					return;
				}
				frmCache.removeCache();
				frmCache.level = frmCache.cacheNone;
				frmCache.path = "";
			}
			break;
		case frmCache.cacheAlways:
			if (frmCache.level != frmCache.cacheSession
			|| folder == "" || !frmCache.folderExists(folder))
			{
				frmCache.path = frmCache.getDefaultCachePath();
				frmCache.initialize();
			}
			break;
		case frmCache.cacheSession:
			if (folder == "" || !frmCache.folderExists(folder))
			{
				frmCache.path = frmCache.getDefaultCachePath();
				frmCache.initialize();
			}
			break;
		}
		item = this.mgr.storage.getNodeByAttributeId("ITEM", "id", "cachelevel");
		item.setAttribute("value", value);

		this.mgr.document.getElementById("txtCachePath").value = frmCache.path;
		item = this.mgr.storage.getNodeByAttributeId("ITEM", "id", "cachepath");
		item.setAttribute("value", frmCache.path);
		break;
	}

	this.setModified();
	this.loadCacheList();
	this.setButtonsState();
}

//-----------------------------------------------------------------------------
CacheTab.prototype.setButtonsState = function()
{
	var selElem = this.mgr.document.getElementById("selCacheLevel");
	var btn = this.mgr.document.getElementById("btnCacheBrowse");
	btn.disabled = (selElem.selectedIndex < 1 ? true : false);
	btn.className="xTToolBarButton" + (selElem.selectedIndex < 1 ? "Disabled" : "");

	selElem = this.mgr.document.getElementById("selCacheList");
	btn = this.mgr.document.getElementById("btnCacheDelete");
	btn.disabled = (selElem.options.length < 1 ? true : false);
	btn.className="xTToolBarButton" + (selElem.options.length < 1 ? "Disabled" : "");

	btn = this.mgr.document.getElementById("btnCacheClearAll");
	btn.disabled = (selElem.options.length < 1 ? true : false);
	btn.className="xTToolBarButton" + (selElem.options.length < 1 ? "Disabled" : "");
}

//-----------------------------------------------------------------------------
CacheTab.prototype.setLevelOptions = function()
{
	var selElem = this.mgr.document.getElementById("selCacheLevel");
	var frmCache = this.mgr.portalWnd.oFormCache;
	var curLevel = this.mgr.wnd.parent.profile.getPreference("cachelevel");
	curLevel = (curLevel ? parseInt(curLevel,10) : 0);

	var len = frmCache.cacheMax+1;		// max index + 1
	for (var i = 0; i < len; i++)
	{
		var text = this.mgr.msgs.getPhrase("lblCacheLevel_"+i);
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, selElem, text, i);
		if (curLevel == i)
			selElem.options[i].selected = true;
	}
}

//-----------------------------------------------------------------------------
CacheTab.prototype.setModified = function()
{
	this.mgr.setModified();
	this.mgr.wnd.parent.profile.setModified();
}
