/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/users/preferences/ShortcutTab.js,v 1.9.2.7.4.5.14.1.2.2 2012/08/08 12:37:27 jomeli Exp $ */
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

ShortcutTab.prototype = new TabPage();
ShortcutTab.prototype.constructor = ShortcutTab;
ShortcutTab.superclass = TabPage.prototype;

function ShortcutTab(id,pageMgr)
{
	ShortcutTab.superclass.setId.call(this,id);
	ShortcutTab.superclass.setManager.call(this,pageMgr);
	this.doc = null;
}

//-----------------------------------------------------------------------------
ShortcutTab.prototype.activate = function()
{
	try 
	{
		var elem = this.mgr.document.getElementById("selShrtList");
		elem.focus();
		if (elem.selectedIndex == -1 && elem.options.length)
			elem.selectedIndex = 0;
	} catch (e) { }
}

//-----------------------------------------------------------------------------
ShortcutTab.prototype.deactivate = function()
{
	return true;
}

//-----------------------------------------------------------------------------
ShortcutTab.prototype.doDelete = function()
{
	var sel = this.mgr.document.getElementById("selShrtList");
	var selIndex = sel.selectedIndex;
	if (selIndex < 0) return;

	var text = sel.options[selIndex].text;
	var msg = this.mgr.msgs.getPhrase("lblOKToDelete");
	var response = this.mgr.portalWnd.cmnDlg.messageBox(msg + " '" + text + "'?",
			"okcancel", "question", this.mgr.wnd);
	if (response != "ok") return;

	var node = this.mgr.storage.getNodeByAttributeId("LINK", "id", sel.options[selIndex].value);
	this.mgr.removeNode(node, sel, selIndex);
	this.onSelectionChange();
	this.setModified();
}

//-----------------------------------------------------------------------------
ShortcutTab.prototype.doNew = function()
{
	// get the new item text
	var strTitle = this.mgr.msgs.getPhrase("lblNewShortcutItem");
	var strPrompt = this.mgr.msgs.getPhrase("lblShortcutPromptText");
	var newText = this.mgr.portalWnd.cmnDlg.prompt(strTitle, strTitle, strPrompt, this.mgr.wnd); 
	newText = this.mgr.portalWnd.trim(newText);
	if (!newText) return;

	// check for duplicates
	var nodes = this.doc.getElementsByTagName("LINK");
	var len = nodes.length;
	for (var i=0; i<len; i++)
	{
		if (newText == nodes[i].getAttribute("name"))
		{
			var msg = this.mgr.msgs.getPhrase("msgFileExists");
			this.mgr.portalWnd.cmnDlg.messageBox(msg, "ok", "stop", this.mgr.wnd);
			return;
		}
	}

	// get the new item url
	strPrompt = this.mgr.msgs.getPhrase("lblShortcutPromptURL");
	var newURL = this.mgr.portalWnd.cmnDlg.prompt("", strTitle, strPrompt, this.mgr.wnd); 
	newURL = this.mgr.portalWnd.formatURL(this.mgr.portalWnd.trim(newURL));
	if (!newURL) return;

	// update list
	var sel = this.mgr.document.getElementById("selShrtList");
	var index = sel.options.length;
	var newId = this.mgr.portalWnd.oUserProfile.getUniqueId(this.mgr.storage, "LINK", "id", "shortcut");
	this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, sel, newText, newId);

	// add link to storage
	var nodes = this.doc.getElementsByTagName("LINKS");
	var link = this.doc.createElement("LINK");
	nodes[0].appendChild(link);
	link.setAttribute("id", newId);
	link.setAttribute("name", newText);
	link.setAttribute("newwin", "0");
	link.appendChild(this.doc.createCDATASection(newURL));

	sel.selectedIndex = index;
	this.onSelectionChange();
	this.setModified();
}

//-----------------------------------------------------------------------------
ShortcutTab.prototype.doRename = function()
{
	var sel = this.mgr.document.getElementById("selShrtList");
	var selIndex = sel.selectedIndex;
	if (selIndex < 0) return;

	// get the new item text
	var text = sel.options[selIndex].text;
	var strTitle = this.mgr.msgs.getPhrase("lblRenameShortcutItem");
	var strPrompt = this.mgr.msgs.getPhrase("lblShortcutPromptText2");
	var newText = this.mgr.portalWnd.cmnDlg.prompt(text, strTitle, strPrompt, this.mgr.wnd); 
	newText = this.mgr.portalWnd.trim(newText);
	if (!newText) return;

	var node = this.mgr.storage.getNodeByAttributeId("LINK", "id", sel.options[selIndex].value);
	if (!node) return;

	node.setAttribute("name",newText);
	sel.options[selIndex].text=newText;
	this.setModified();
}

//-----------------------------------------------------------------------------
ShortcutTab.prototype.getCbxValue = function(obj, bIsNode)
{
	if (bIsNode)
		return (obj.getAttribute("newwin") == "1") ? true : false;
	else
		return (obj.checked) ? "1" : "0";
}

//-----------------------------------------------------------------------------
ShortcutTab.prototype.init = function()
{
	// set the button labels (if not English)
	if (this.mgr.portal.getLanguage() != "en-us")
	{
		var btn = this.mgr.document.getElementById("btnShrtNew");
		btn.value = this.mgr.msgs.getPhrase("btnNew");

		btn = this.mgr.document.getElementById("btnShrtRename");
		btn.value = this.mgr.msgs.getPhrase("btnRename");

		btn = this.mgr.document.getElementById("btnShrtDelete");
		btn.value = this.mgr.msgs.getPhrase("btnDelete");

		btn = this.mgr.document.getElementById("btnShrtUp");
		btn.value = this.mgr.msgs.getPhrase("btnUp");

		btn = this.mgr.document.getElementById("btnShrtDown");
		btn.value = this.mgr.msgs.getPhrase("btnDown");
	}

	// clear the list
	var sel = this.mgr.document.getElementById("selShrtList");
	var len = sel.options.length;

	for (var i=len-1; i > -1; i--)
		sel.removeChild(sel.children(i));
	var inp = this.mgr.document.getElementById("txtShrtText");
	if (inp) inp.value = "";
	this.startVal = "";
	this.doc = this.mgr.storage.getDocument();

	var nodes = this.doc.getElementsByTagName("LINKS");
	if (nodes.length < 1) return true;

	var items = nodes[0].getElementsByTagName("LINK");
	len = items.length;

	for (var i=0; i<len; i++)
	{
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, sel, 
				items[i].getAttribute("name"), items[i].getAttribute("id"));
	}

	sel.selectedIndex = 0;
	this.onSelectionChange();
	return true;
}

//-----------------------------------------------------------------------------
ShortcutTab.prototype.moveUpDown = function(dir)
{
	var sel = this.mgr.document.getElementById("selShrtList");
	var selIndex = sel.selectedIndex;
	if (selIndex < 0) return;

	var nodes = this.doc.getElementsByTagName("LINKS");
	if (nodes.length < 1) return;
	link = nodes[0];

	switch (dir)
	{
		case "up" :
			var dnVal = sel.options[selIndex].value;
			var dnText = sel.options[selIndex].text;
			var upVal = sel.options[selIndex-1].value;
			var upText = sel.options[selIndex-1].text;

			var oUpNode = this.mgr.storage.getNodeByAttributeId("LINK", "id", upVal);
			var oDnNode = this.mgr.storage.getNodeByAttributeId("LINK", "id", dnVal);

			link.insertBefore(oDnNode, oUpNode);
				
			sel.options[selIndex-1].value = dnVal;
			sel.options[selIndex-1].text = dnText;
			sel.options[selIndex].value = upVal;
			sel.options[selIndex].text = upText;
			sel.selectedIndex = selIndex - 1;
			break;

		case "down" :
			var upVal = sel.options[selIndex].value;
			var upText = sel.options[selIndex].text;
			var dnVal = sel.options[selIndex+1].value;
			var dnText = sel.options[selIndex+1].text;

			var oUpNode = this.mgr.storage.getNodeByAttributeId("LINK", "id", upVal);
			var oDnNode = this.mgr.storage.getNodeByAttributeId("LINK", "id", dnVal);

			link.insertBefore(oDnNode, oUpNode);

			sel.options[selIndex+1].value = upVal;
			sel.options[selIndex+1].text = upText;
			sel.options[selIndex].value = dnVal;
			sel.options[selIndex].text = dnText;
			
			sel.selectedIndex = selIndex + 1;
			break;
	}
	this.onSelectionChange();
	this.setModified();
}

//-----------------------------------------------------------------------------
ShortcutTab.prototype.onClickCbx = function(evt, cbx)
{
	if (cbx.checked != this.startCbx)
	{
		var sel = this.mgr.document.getElementById("selShrtList");
		var selIndex = sel.selectedIndex;
		if (selIndex < 0) return;

		// save the change locally
		var oNode = this.mgr.storage.getNodeByAttributeId("LINK", "id", sel.options[selIndex].value);
		oNode.setAttribute("newwin") = this.getCbxValue(cbx, false);
		this.setModified();
	}
}

//-----------------------------------------------------------------------------
ShortcutTab.prototype.onSelectionChange = function()
{
	var sel = this.mgr.document.getElementById("selShrtList");
	var selIndex = sel.selectedIndex;

	this.startVal = "";
	this.startCbx = false;

	this.setInputState(sel, sel.options.length-1);
	if (selIndex < 0) return;

	var nodes = this.doc.getElementsByTagName("LINKS");
	if (nodes.length < 1) return;

	var inp = this.mgr.document.getElementById("txtShrtText");
	var cbx = this.mgr.document.getElementById("cbxShrtNewWindow");
	var items = nodes[0].getElementsByTagName("LINK");
	var len = items.length;

	for (var i=0; i<len; i++)
	{
		if (sel.options[selIndex].value == items[i].getAttribute("id"))
		{
			cbx.disabled = false;
			cbx.checked = this.getCbxValue(items[i], true);
			this.startCbx = cbx.checked;

			inp.disabled = false;
			inp.className = "xtTextBox";
			inp.value = this.mgr.portalWnd.cmnGetNodeCDataValue(items[i]);
			this.startVal = inp.value;
			break;
		}
	}
}

//-----------------------------------------------------------------------------
ShortcutTab.prototype.onTextBlur = function(evt,txtBox)
{
	txtBox.className="xTTextBox";
	txtBox.value = this.mgr.portalWnd.formatURL(this.mgr.portalWnd.trim(txtBox.value));

	if (txtBox.value.length == 0)
	{
		txtBox.value = this.startVal;
		return false;
	}

	if (txtBox.value != this.startVal)
	{
		var sel = this.mgr.document.getElementById("selShrtList");
		var selIndex = sel.selectedIndex;
		if (selIndex < 0) return;

		// save the change locally
		var oNode = this.mgr.storage.getNodeByAttributeId("LINK", "id", sel.options[selIndex].value);
		oNode.removeChild(oNode.firstChild);
	 	var txtNode = this.doc.createCDATASection(txtBox.value);
		oNode.appendChild(txtNode);
		this.setModified();
	}
}

//-----------------------------------------------------------------------------
ShortcutTab.prototype.setInputState = function(selElem, max)
{
	var selIndex = selElem.selectedIndex;

	// enable/disable buttons (new always enabled)
	var btn = this.mgr.document.getElementById("btnShrtDelete");
	btn.disabled = selIndex < 0 ? true : false;
	btn.className = "xTToolBarButton" + (btn.disabled ? "Disabled" : "");

	btn = this.mgr.document.getElementById("btnShrtUp");
	btn.disabled = selIndex <= 0 ? true : false;
	btn.className = "xTToolBarButton" + (btn.disabled ? "Disabled" : "");

	btn = this.mgr.document.getElementById("btnShrtDown");
	btn.disabled = selIndex < max ? false : true;
	btn.className = "xTToolBarButton" + (btn.disabled ? "Disabled" : "");

	if (selIndex < 0) 
	{
		var cbx = this.mgr.document.getElementById("cbxShrtNewWindow");
		cbx.checked = false;
		cbx.disabled = true;

		var inp = this.mgr.document.getElementById("txtShrtText");
		inp.value = "";
		inp.className = "xtTextBoxDisabled";
		inp.disabled = true;
		
		selElem.className = "xTTextBoxDisabled";
		selElem.disabled = true;

		try {
			this.mgr.document.getElementById("btnShrtNew").focus();
		} catch (e) { }
		return;
	}
	else if (selElem.disabled)
	{
		selElem.disabled = false;
		selElem.className = "xTListText";
	}
}

//-----------------------------------------------------------------------------
ShortcutTab.prototype.setModified = function()
{
	this.mgr.setModified();
	this.mgr.wnd.parent.profile.setModified();
}