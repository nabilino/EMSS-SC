/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/drill/drsearch.js,v 1.4.2.5.4.3.14.3.2.6 2012/08/08 12:37:23 jomeli Exp $NoKeywords: $ */
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

// if IE must update title now, for NS during initialization
window.document.title = wndArguments ? wndArguments[0] : ""

var portalWnd = null;
var portal = null;
var oDrlSearch = null;			// drill Find object
var oSearch = null;				// local object
var oMsgs = null;
var oFeedBack = null;
var frmDisplayTabs = null;

//-----------------------------------------------------------------------------
function init()
{
	if (wndArguments)
	{
		oDrlSearch = wndArguments[1];
		portalWnd = oDrlSearch.portalWnd;
	}
	else
	{
		oDrlSearch = window.opener.nsrchObj;
		portalWnd = window.opener.nsrchObj.portalWnd;
	}

	oSearch = new Search();
	oSearch.storage = new portalWnd.DataStorage(oDrlSearch.storage.getDataString());
	oSearch.setMode(oDrlSearch.mode);
	oSearch.url = oDrlSearch.url;

	portal = portalWnd.lawsonPortal;
	oMsgs = new portalWnd.phraseObj("drsearch");
	oFeedBack = new FeedBack(window, portalWnd);

	// set the labels text (if not English)
	if (portal.getLanguage() != "en-us")
	{
		portalWnd.cmnSetElementText(document.getElementById("btnFind"),
				oMsgs.getPhrase("lblFind"));
		portalWnd.cmnSetElementText(document.getElementById("btnCancel"),
				oMsgs.getPhrase("lblCancel"));
		portalWnd.cmnSetElementText(document.getElementById("lblFind"),
				oMsgs.getPhrase("lblFind"));
		portalWnd.cmnSetElementText(document.getElementById("lblFilter"),
				oMsgs.getPhrase("lblFilter"));
		portalWnd.cmnSetElementText(document.getElementById("txt1"),
				oMsgs.getPhrase("msgSelectFindFilter1"));
		portalWnd.cmnSetElementText(document.getElementById("txt2"),
				oMsgs.getPhrase("msgSelectFindFilter2"));
	}

	oSearch.initFilter();

	frmDisplayTabs = document.getElementById("frmDisplayTabs");
	doBuildTabs();
}

//-----------------------------------------------------------------------------
function doBuildTabs()
{
	document.body.style.cursor = "wait";
	oFeedBack.show();
	setTimeout("buildTabs()", 50);
}

//-----------------------------------------------------------------------------
function buildTabs()
{
	oFeedBack.show();
	frmDisplayTabs.style.display = "block";
	frmDisplayTabs.src = portal.path + "/objects/tabhost.htm?" +
			portal.path + "/drill/drsearch.xml";
}

//-----------------------------------------------------------------------------
function srchKeyDown(evt)
{
    evt = portalWnd.getEventObject(evt,window);
    if (!evt) return false;

	// tab or shift+tab
	if (evt.keyCode == 9 || evt.keyCode == 16)
		return true;
	
	// get portal hotkey action
	var action = portal.keyMgr.getHotkeyAction(evt, "portal");

	// hotkey defined for this keystroke
	if (action != "portal")
	{
		cntxtActionHandler(evt, action)
		portalWnd.setEventCancel(evt);
		return false;
	}
}

//-----------------------------------------------------------------------------
function cntxtActionHandler(evt, action)
{
	var bHandled = false;
	switch (action)
	{
		case "doCancel":
	        doCancel();
			bHandled = true;
			break;

		case "doSubmit":
			bHandled = oSearch.doOK();
			break;

		case "posInFirstField":
			window.frames[0].tabMgr.tabs[oSearch.getActiveTab()].activate();
			bHandled = true;
			break;
	}
	return bHandled;
}

//-----------------------------------------------------------------------------
// callback from tabhost when tab construction complete
function tabInitialization()
{
	// called from tabhost
	window.frames[0].tabMgr.search = oSearch;
	for (var t in window.frames[0].tabMgr.tabs)
	{
		if (window.frames[0].tabMgr.tabs[t] != null 
		&& typeof(window.frames[0].tabMgr.tabs[t].initComplete) == "function")
			window.frames[0].tabMgr.tabs[t].initComplete();
	}

	// display tab that was displayed for query last time
	var node = oSearch.storage.getNodeByAttributeId("FIELDS", "id", "drill");
	var tab = node.getAttribute("tab");

	if (tab.length > 0)
	{
		try {
			var elem = window.frames[0].document.getElementById(tab);
			window.frames[0].tabMgr.switchTab(elem);
		} catch (e) { }
	}

	document.body.style.cursor = "auto";
}

//-----------------------------------------------------------------------------
function doOK()
{
	// called from tabhost
	oSearch.doOK();
}

//-----------------------------------------------------------------------------
function doCancel()
{
	// called from tabhost
	window.close();
}

//-----------------------------------------------------------------------------
function Search()
{
	this.storage = null;
	this.url = "";
	this.mode = null;
	this.activeTab = "";
	this.modified = false;
}

//-----------------------------------------------------------------------------
Search.prototype.getActiveTab = function()
{
	return this.activeTab;
}

Search.prototype.setActiveTab = function(value)
{
	this.activeTab = value;
	var node = this.storage.getNodeByAttributeId("FIELDS", "id", "drill");
	node.setAttribute("tab", this.activeTab);
	return this.activeTab;
}

//-----------------------------------------------------------------------------
Search.prototype.getFilter = function()
{
	var node = this.storage.getNodeByAttributeId("FIELDS", "id", "drill");
	return node.getAttribute("filter");
}

Search.prototype.setFilter = function()
{
	var filter = document.getElementById("rbFind").checked ? "0" : "1";
	var node = this.storage.getNodeByAttributeId("FIELDS", "id", "drill");
	node.setAttribute("filter", filter);
}

//-----------------------------------------------------------------------------
Search.prototype.getOutput = function()
{
	return this.storage.getElementValue("OUTPUT", 0);
}

Search.prototype.setOutput = function(value)
{
	this.storage.setElementValue("OUTPUT", value, 0);
}

//-----------------------------------------------------------------------------
Search.prototype.getMode = function()
{
	return this.mode;
}

Search.prototype.setMode = function(value)
{
	this.mode = value;
	return this.mode;
}

//-----------------------------------------------------------------------------
Search.prototype.buildFieldSelect = function(value)
{
	var aryOptions = new Array();
	var header = "";
	var index = -1;
	var fieldName = "";
	var keyFindField = "";
	var listVals = "";

	// Look for FINDFLD	nodes first
	var nodeName = "FINDFLD";
	var fields = this.storage.document.getElementsByTagName(nodeName);
	var len = fields ? fields.length : 0;

	// Use COLUMN nodes if FINDFLD nodes cannot be found
	if (len == 0)
	{
		nodeName = "COLUMN";
		fields = this.storage.document.getElementsByTagName(nodeName);
		len = fields ? fields.length : 0;
	}

    var keyFindNodes = this.storage.document.getElementsByTagName("KEYFIND"); 
    var keyFindName = (keyFindNodes && keyFindNodes.length > 0 && len > 0) 
    		? keyFindNodes[0].getAttribute("fieldname") : ""; 

	for (var x=0; x<len; x++)
	{
		fieldName = fields[x].getAttribute("name");
		index = (keyFindName == fieldName && index == -1) ? x : index;
		header = (fields[x].getAttribute("header")) 
				? fields[x].getAttribute("header")
				: this.storage.getElementCDataValue(nodeName, x);	
		listVals = fields[x].getElementsByTagName("VAL");

		// aryOption 0          #|# 1    #|# 2    #|# 3    #|# 4
		//           field name #|# size #|# type #|# list #|# key field							 
		aryOptions[x] = "<option value=\"" + fieldName +
 				"#|#" + fields[x].getAttribute("size") + 
 				"#|#" + fields[x].getAttribute("type") + 
 				"#|#" + ((listVals && listVals.length == 0) ? "" : "LIST") + 
 				"#|#" + ((keyFindName == fieldName) ? "KEY" : "") + 
 				"\" " + 
 				((fieldName == value) ? " selected " : "") + 
 				">" + ((keyFindName == fieldName) ? "* " : "") + header + "</option>"; 
	}
	// move keyfind selection to be first in list
	if (index > 0)
	{ 
		keyFindField = aryOptions.splice(index, 1); 
		aryOptions.splice(0, 0, keyFindField[0]); 
	} 
	return aryOptions.join("");
}

//-----------------------------------------------------------------------------
Search.prototype.changeFilter = function(elem)
{
	var btnFind = document.getElementById("btnFind");
	if (elem.id == "rbFind")
		btnFind.firstChild.nodeValue = oMsgs.getPhrase("lblFind");
	else
		btnFind.firstChild.nodeValue = oMsgs.getPhrase("lblFilter");
}

//-----------------------------------------------------------------------------
Search.prototype.checkUrlLength = function()
{
	var url = this.toString();
	if (url.length > 1900)
	{
		var msg = oMsgs.getPhrase("msgQueryTooLong") + " [" + url.length + "]";
		portalWnd.cmnDlg.messageBox(msg, "ok", "stop");
		window.frames[0].tabMgr.tabs[this.activeTab].activate();
		return "";
	}
	return url;
}

//-----------------------------------------------------------------------------
Search.prototype.clearFields = function()
{
	var field = this.storage.document.getElementsByTagName("FIELD");
	var len = field ? field.length : 0;
	for	(var i=len-1; 0<=i; i--)
	{
		var parentNode = field[i].parentNode;
		parentNode.removeChild(field[i]);
	}
}

//-----------------------------------------------------------------------------
Search.prototype.createFieldEntry = function(aryFields)
{
	var fieldRoot = this.storage.document.getElementsByTagName("FIELDS");
	fieldRoot = fieldRoot[0];
	var item = this.storage.document.createElement("FIELD");
	item.setAttribute("id", aryFields[0]);
	item.setAttribute("fldname", aryFields[1]);
	item.setAttribute("ignoreCase", aryFields[2]);
	item.setAttribute("comparator", aryFields[3]);
	item.appendChild(this.storage.document.createCDATASection(aryFields[4]));
	item.setAttribute("conjunction", aryFields[5]);
	fieldRoot.appendChild(item);
}

//-----------------------------------------------------------------------------
Search.prototype.doOK = function()
{
	var retVal = this.saveFields();
	if (!retVal)
		return;

	var url = this.checkUrlLength();
	if (url.length == 0)
		return;
	this.setOutput(url);

	if (portal.browser.isIE)
	{
		oDrlSearch.storage = this.storage;
		window.returnValue = true;
	}
	else
	{
		window.opener.nsrchObj.storage = this.storage;
		eval(window.opener.nsrchObj.callback);
	}
	window.close();
}

//-----------------------------------------------------------------------------
Search.prototype.getFindField = function(name)
{
	var findField = null;
	var fields = this.storage.document.getElementsByTagName("FINDFLD");
	var len = fields.length;
	for (var i=0; i<len; i++)
	{
		if (fields[i].getAttribute("name") == name)
		{
			findField = fields[i];
			break;
		}
	}
	return findField;
}

//-----------------------------------------------------------------------------
Search.prototype.initFilter = function()
{
	if (this.getFilter() == "1")
		var elem = document.getElementById("rbFilter");
	else
		var elem = document.getElementById("rbFind");
	elem.checked = true;
	this.changeFilter(elem);
}

//-----------------------------------------------------------------------------
Search.prototype.isAdvSearch = function()
{
	return ((this.mode != "genlist" || (this.mode == "genlist" && this.url.indexOf("@pt") > -1)) && !this.is803())			
			? true : false;
}

//-----------------------------------------------------------------------------
Search.prototype.isGenSearch = function()
{
	return (this.mode == "genlist" && this.url.indexOf("@pt") < 0) ? true : false;
}

//-----------------------------------------------------------------------------
Search.prototype.isSearch = function()
{
	return (this.mode != "genlist" && this.is803())			
			? true : false;
}

//-----------------------------------------------------------------------------
Search.prototype.is803 = function()
{
	return (portalWnd.oPortalConfig.getShortIOSVersion() == "8.0.3")			
			? true : false;
}

//-----------------------------------------------------------------------------
Search.prototype.onClickRadio = function(elem)
{
	this.setFilter();
	this.changeFilter(elem);
}

//-----------------------------------------------------------------------------
Search.prototype.saveFields = function()
{
	this.setFilter();
	return window.frames[0].tabMgr.tabs[this.activeTab].saveFields();
}

//-----------------------------------------------------------------------------
Search.prototype.toString = function()
{
	var url = this.url;
	var fields = this.storage.document.getElementsByTagName("FIELD");
	var len = fields ? fields.length : 0;

	url += "&_FL=" + this.getFilter() + "&_FF=";

	if (this.is803())
	{
		var value = "";
		for (var i=0; i<len; i++)
		{
			value = this.storage.getElementValue("FIELD", i);
			var hasParenthesis = (value.search(/\(|\)/) == -1) ? false : true;
			if (value.length > 0)
			{
				value = escape(this.storage.getElementValue("FIELD", i)).replace(/\+/g,"%2B");
				url += fields[i].getAttribute("fldname").replace("*","") + 
						fields[i].getAttribute("comparator") +
						(hasParenthesis ? "%22" + value + "%22" + "," : value + ","); 
			}
		}
	}
	else
	{
		for (var i=0; i<len; i++)
		{
			var value = escape(this.storage.getElementValue("FIELD", i)).replace(/\+/g,"%2B");
			var hasParenthesis = (value.search(/%28|%29/) == -1) ? false : true;
			url += fields[i].getAttribute("conjunction") + 
					fields[i].getAttribute("fldname") + 
					fields[i].getAttribute("ignoreCase") + 
					fields[i].getAttribute("comparator") +
					(hasParenthesis ? "%22" + value + "%22" : value); 
		}
	}

	// protect ourselves from IDA 'opportunities':
	url = url.replace("\n","")
	url = portalWnd.cmnRemoveVarFromString("USR", url);
	return url;
}
