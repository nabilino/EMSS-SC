/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/admin/rolemgr/MenusTab.js,v 1.5.2.6.4.4.14.1.2.4 2012/08/08 12:37:29 jomeli Exp $ */
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

MenusTab.prototype = new TabPage();
MenusTab.prototype.constructor = MenusTab;
MenusTab.superclass = TabPage.prototype;

function MenusTab(id,pageMgr)
{
	MenusTab.superclass.setId.call(this,id);
	MenusTab.superclass.setManager.call(this,pageMgr);
	this.initialized=false;
}

//-----------------------------------------------------------------------------
MenusTab.prototype.activate=function()
{
	try {
		if (!this.initialized)
			this.init();
		var elem=this.mgr.document.getElementById("selPrefsList");
		elem.focus();
		if (elem.selectedIndex == -1 && elem.options.length)
			elem.selectedIndex=0;
	} catch (e) { }
}

//-----------------------------------------------------------------------------
MenusTab.prototype.deactivate=function()
{
	return true;
}

//-----------------------------------------------------------------------------
MenusTab.prototype.doDelete=function(evt,btn)
{
	var isHelpDelete = (btn.id == "btnHelpDelete" ? true : false);	
	var sel = isHelpDelete
		? this.mgr.document.getElementById("selHelpList")
		: this.mgr.document.getElementById("selPrefsList");
	var selIndex = sel.selectedIndex;
	if (selIndex < 0) return;

	var text=sel.options[selIndex].text;
	var msg=this.mgr.msgs.getPhrase("lblOKToDelete");
	var retVal = this.mgr.portalWnd.cmnDlg.messageBox(msg+" '"+text+
					"'?","okcancel","question",this.mgr.wnd);
	if (retVal == "cancel") return;

	var node=this.mgr.storage.getNodeByAttributeId("ITEM","id",sel.options[selIndex].value)
	this.mgr.removeNode(node,sel,selIndex);

	if (sel.options.length==0)
	{
		var textBox = isHelpDelete
			? this.mgr.document.getElementById("txtHelp")
			: this.mgr.document.getElementById("txtPreferences");
		textBox.value="";
	}
	sel.focus()
	if (isHelpDelete)
		this.onHelpSelectionChange();
	else
		this.onPrefsSelectionChange();
	this.mgr.setModified();
}

//-----------------------------------------------------------------------------
MenusTab.prototype.doNewHelp=function()
{
	// get the new item text
	var strTitle=this.mgr.msgs.getPhrase("lblNewHelpItem");
	var strPrompt=this.mgr.msgs.getPhrase("lblHelpPromptText");
	var newText=this.mgr.portalWnd.cmnDlg.prompt(strTitle,strTitle,strPrompt,this.mgr.wnd);
	if (!newText) return;

	// get the new item url
	strPrompt=this.mgr.msgs.getPhrase("lblHelpPromptURL");
	var newURL=this.mgr.portalWnd.cmnDlg.prompt("",strTitle,strPrompt,this.mgr.wnd);
	if (!newURL) return;

	var sel = this.mgr.document.getElementById("selHelpList");
	var newId=this.getUniqueId("help")

	// append the option element
	this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, sel, newText, newId);
	sel.selectedIndex=sel.options.length-1;
	
	// update the storage
	var doc=this.mgr.storage.getDocument();
	var menu = this.mgr.storage.getNodeByAttributeId("MENU","id","LAWMENUBTNHELP");
	if (!menu)
	{
		var menuBar=this.getMenuBarNode();
		menu = doc.createElement("MENU");
		menu.setAttribute("id","LAWMENUBTNHELP");
		menu.setAttribute("labelid","LBL_HELP");
		menuBar.appendChild(menu)
	}
	var newItem = doc.createElement("ITEM");
	newItem.setAttribute("id",newId);
	newItem.setAttribute("labelid",newText);
	newItem.setAttribute("action","");
	newItem.setAttribute("href",newURL);
	menu.appendChild(newItem)

	this.onHelpSelectionChange();
	this.mgr.setModified();
}

//-----------------------------------------------------------------------------
MenusTab.prototype.doNewPrefs=function()
{
	// get the new item text
	var strTitle=this.mgr.msgs.getPhrase("lblNewPrefsItem");
	var strPrompt=this.mgr.msgs.getPhrase("lblPrefsPromptText");
	var newText=this.mgr.portalWnd.cmnDlg.prompt(strTitle,strTitle,strPrompt,this.mgr.wnd);
	if (!newText) return;

	// get the new item url
	strPrompt=this.mgr.msgs.getPhrase("lblPrefsPromptURL");
	var newURL=this.mgr.portalWnd.cmnDlg.prompt("",strTitle,strPrompt,this.mgr.wnd);
	if (!newURL) return;

	var sel = this.mgr.document.getElementById("selPrefsList");
	var newId=this.getUniqueId("pref")

	// append the option element
	this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, sel, newText, newId);
	sel.selectedIndex=sel.options.length-1;
	
	// update the storage
	var doc=this.mgr.storage.getDocument();
	var menu = this.mgr.storage.getNodeByAttributeId("MENU","id","LAWMENUBTNPREF");
	if (!menu)
	{
		var menuBar=this.getMenuBarNode();
		menu = doc.createElement("MENU");
		menu.setAttribute("id","LAWMENUBTNPREF");
		menu.setAttribute("labelid","LBL_HELP");
		menuBar.appendChild(menu)
	}
	var newItem = doc.createElement("ITEM");
	newItem.setAttribute("id",newId);
	newItem.setAttribute("labelid",newText);
	newItem.setAttribute("action","");
	newItem.setAttribute("href",newURL);
	menu.appendChild(newItem)

	this.onPrefsSelectionChange();
	this.mgr.setModified();
}

//-----------------------------------------------------------------------------
MenusTab.prototype.doRenameHelp = function()
{
	var sel = this.mgr.document.getElementById("selHelpList");
	var selIndex = sel.selectedIndex;
	if (selIndex < 0) return;

	var node=this.mgr.storage.getNodeByAttributeId("ITEM","id",sel.options[selIndex].value)
	if (!node) return;

	var text = sel.options[selIndex].text;
	var bTransPrompt=(node.getAttribute("labelid") == text ? false : true);

	// alert admin that rename pre-empts ability to translate
	if (bTransPrompt)
	{
		var msg=this.mgr.msgs.getPhrase("msgOkToRenameItem") + "\n" +
			this.mgr.msgs.getPhrase("msgOkToContinue") + "\n\n";
		if ("ok" != this.mgr.portalWnd.cmnDlg.messageBox(msg, "okcancel", "question",this.mgr.wnd))
			return;
	}

	// get the new item text
	var strTitle=this.mgr.msgs.getPhrase("lblRenameHelpItem");
	var strPrompt=this.mgr.msgs.getPhrase("lblHelpPromptText2");
	var newText = this.mgr.portalWnd.cmnDlg.prompt(text, strTitle, strPrompt, this.mgr.wnd); 
	newText = this.mgr.portalWnd.trim(newText);
	if (!newText) return;

	node.setAttribute("labelid",newText);		// pre-empts translation
	sel.options[selIndex].text=newText;

	this.mgr.setModified();
}

//-----------------------------------------------------------------------------
MenusTab.prototype.doRenamePrefs = function()
{
	var sel = this.mgr.document.getElementById("selPrefsList");
	var selIndex = sel.selectedIndex;
	if (selIndex < 0) return;

	var node=this.mgr.storage.getNodeByAttributeId("ITEM","id",sel.options[selIndex].value)
	if (!node) return;

	var text = sel.options[selIndex].text;
	var bTransPrompt=(node.getAttribute("labelid") == text ? false : true);

	// alert admin that rename pre-empts ability to translate
	if (bTransPrompt)
	{
		var msg=this.mgr.msgs.getPhrase("msgOkToRenameItem") + "\n" +
			this.mgr.msgs.getPhrase("msgOkToContinue") + "\n\n";
		if ("ok" != this.mgr.portalWnd.cmnDlg.messageBox(msg, "okcancel", "question",this.mgr.wnd))
			return;
	}

	// get the new item text
	var strTitle=this.mgr.msgs.getPhrase("lblRenamePrefsItem");
	var strPrompt=this.mgr.msgs.getPhrase("lblPrefsPromptText2");
	var newText = this.mgr.portalWnd.cmnDlg.prompt(text, strTitle, strPrompt, this.mgr.wnd); 
	newText = this.mgr.portalWnd.trim(newText);
	if (!newText) return;

	node.setAttribute("labelid",newText);		// pre-empts translation
	sel.options[selIndex].text=newText;

	this.mgr.setModified();
}

//-----------------------------------------------------------------------------
MenusTab.prototype.getMenuBarNode=function()
{
	var menuBar = this.mgr.storage.document.getElementsByTagName("MENUBAR");
	if (menuBar && menuBar.length > 0)
		menuBar=menuBar[0]
	else
	{
		var doc=this.mgr.storage.getDocument();
		menuBar = doc.createElement("MENUBAR");
		var roleNode = this.mgr.storage.document.getElementsByTagName("ROLE");
		roleNode[0].appendChild(menuBar);
	}
	return menuBar;
}

//-----------------------------------------------------------------------------
MenusTab.prototype.getUniqueId=function(type)
{
	var newId="";
	var prefix="item";
	var bDone=false;
	var i=1;
	while (!bDone)
	{
		newId=type+prefix+i;
		i++;
		var node = this.mgr.storage.getNodeByAttributeId("ITEM","id",newId);
		if (!node) bDone=true;
	}
	return newId;
}

//-----------------------------------------------------------------------------
MenusTab.prototype.init=function()
{
	// set the button labels (if not English)
	if (this.mgr.portal.getLanguage() != "en-us")
	{
		var text=this.mgr.msgs.getPhrase("btnNew");
		var btn = this.mgr.document.getElementById("btnPrefsNew");
		btn.value=text;
		btn = this.mgr.document.getElementById("btnHelpNew");
		btn.value=text;

		text=this.mgr.msgs.getPhrase("btnRename");
		btn = this.mgr.document.getElementById("btnPrefsRename");
		btn.value=text;
		btn = this.mgr.document.getElementById("btnHelpRename");
		btn.value=text;

		text=this.mgr.msgs.getPhrase("btnDelete");
		btn = this.mgr.document.getElementById("btnPrefsDelete");
		btn.value=text;
		btn = this.mgr.document.getElementById("btnHelpDelete");
		btn.value=text;

		text=this.mgr.msgs.getPhrase("btnUp");
		btn = this.mgr.document.getElementById("btnPrefsUp");
		btn.value=text;
		btn = this.mgr.document.getElementById("btnHelpUp");
		btn.value=text;

		text=this.mgr.msgs.getPhrase("btnDown");
		btn = this.mgr.document.getElementById("btnPrefsDown");
		btn.value=text;
		btn = this.mgr.document.getElementById("btnHelpDown");
		btn.value=text;
	}

	// clear the preferences list
	var sel = this.mgr.document.getElementById("selPrefsList");
	var len = sel.options.length;
	for (var i=len-1; i > -1; i--)
		sel.removeChild(sel.children(i));
	var inp = this.mgr.document.getElementById("txtPreferences");

	var prefsMenu = this.mgr.storage.getNodeByAttributeId("MENU","id","LAWMENUBTNPREF");
	if (!prefsMenu) return;

	var items=prefsMenu.getElementsByTagName("ITEM");
	len = items.length;
	for (var i = 0; i < len; i++)
	{
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, sel, 
				this.mgr.portal.getPhrase(items[i].getAttribute("labelid")),
				items[i].getAttribute("id"));
	}
	if (len)
	{
		sel.selectedIndex = 0;
		this.onPrefsSelectionChange();
	}

	// clear the list help list
	sel = this.mgr.document.getElementById("selHelpList");
	len = sel.options.length;
	for (var i=len-1; i > -1; i--)
		sel.removeChild(sel.children(i));
	inp = this.mgr.document.getElementById("txtHelp");

	var helpMenu = this.mgr.storage.getNodeByAttributeId("MENU","id","LAWMENUBTNHELP");
	items = helpMenu.getElementsByTagName("ITEM");
	len = items.length;
	for (var i = 0; i < len; i++)
	{
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, sel, 
				this.mgr.portal.getPhrase(items[i].getAttribute("labelid")),
				items[i].getAttribute("id"));
	}
	if (len)
	{
		sel.selectedIndex = 0;
		this.onHelpSelectionChange();
	}
	this.initialized=true;
	return true;
}

//-----------------------------------------------------------------------------
MenusTab.prototype.moveHelpUpDown=function(dir)
{
	var sel = this.mgr.document.getElementById("selHelpList");
	var selIndex = sel.selectedIndex;
	if (selIndex < 0) return;

	var helpMenu = this.mgr.storage.getNodeByAttributeId("MENU","id","LAWMENUBTNHELP");

	switch (dir)
	{
	case "up" :
		var dnVal = sel.options[selIndex].value
		var dnText = sel.options[selIndex].text
		var upVal = sel.options[selIndex-1].value
		var upText = sel.options[selIndex-1].text

		var oUpNode=this.mgr.storage.getNodeByAttributeId("ITEM","id",upVal)
		var oDnNode=this.mgr.storage.getNodeByAttributeId("ITEM","id",dnVal)

		helpMenu.insertBefore(oDnNode, oUpNode)
			
		sel.options[selIndex-1].value = dnVal
		sel.options[selIndex-1].text = dnText
		sel.options[selIndex].value = upVal
		sel.options[selIndex].text = upText
		sel.selectedIndex=selIndex-1
		break;

	case "down" :
		var upVal = sel.options[selIndex].value
		var upText = sel.options[selIndex].text
		var dnVal = sel.options[selIndex+1].value
		var dnText = sel.options[selIndex+1].text

		var oUpNode=this.mgr.storage.getNodeByAttributeId("ITEM","id",upVal)
		var oDnNode=this.mgr.storage.getNodeByAttributeId("ITEM","id",dnVal)

		helpMenu.insertBefore(oDnNode, oUpNode)

		sel.options[selIndex+1].value = upVal
		sel.options[selIndex+1].text = upText
		sel.options[selIndex].value = dnVal
		sel.options[selIndex].text = dnText
		
		sel.selectedIndex=selIndex+1
		break;
	}
	this.onHelpSelectionChange();
	this.mgr.setModified();
}

//-----------------------------------------------------------------------------
MenusTab.prototype.movePrefsUpDown=function(dir)
{
	var sel = this.mgr.document.getElementById("selPrefsList");
	var selIndex = sel.selectedIndex;
	if (selIndex < 0) return;

	var prefsMenu = this.mgr.storage.getNodeByAttributeId("MENU","id","LAWMENUBTNPREF");

	switch (dir)
	{
	case "up" :
		var dnVal = sel.options[selIndex].value
		var dnText = sel.options[selIndex].text
		var upVal = sel.options[selIndex-1].value
		var upText = sel.options[selIndex-1].text

		var oUpNode=this.mgr.storage.getNodeByAttributeId("ITEM","id",upVal)
		var oDnNode=this.mgr.storage.getNodeByAttributeId("ITEM","id",dnVal)

		prefsMenu.insertBefore(oDnNode, oUpNode)
			
		sel.options[selIndex-1].value = dnVal
		sel.options[selIndex-1].text = dnText
		sel.options[selIndex].value = upVal
		sel.options[selIndex].text = upText
		sel.selectedIndex=selIndex-1
		break;

	case "down" :
		var upVal = sel.options[selIndex].value
		var upText = sel.options[selIndex].text
		var dnVal = sel.options[selIndex+1].value
		var dnText = sel.options[selIndex+1].text

		var oUpNode=this.mgr.storage.getNodeByAttributeId("ITEM","id",upVal)
		var oDnNode=this.mgr.storage.getNodeByAttributeId("ITEM","id",dnVal)

		prefsMenu.insertBefore(oDnNode, oUpNode)

		sel.options[selIndex+1].value = upVal
		sel.options[selIndex+1].text = upText
		sel.options[selIndex].value = dnVal
		sel.options[selIndex].text = dnText
		
		sel.selectedIndex=selIndex+1
		break;
	}
	this.onPrefsSelectionChange();
	this.mgr.setModified();
}

//-----------------------------------------------------------------------------
MenusTab.prototype.onHelpSelectionChange=function()
{
	var sel = this.mgr.document.getElementById("selHelpList");
	var selIndex = sel.selectedIndex;
	this.setInputState("Help",selIndex,sel.options.length-1);
	if (selIndex < 0) return;

	this.startVal="";
	var inp = this.mgr.document.getElementById("txtHelp");
	if (!inp) return;

	var prefsMenu = this.mgr.storage.getNodeByAttributeId("MENU","id","LAWMENUBTNHELP");
	var items=prefsMenu.getElementsByTagName("ITEM");
	var len = items.length;
	for (var i = 0; i < len; i++)
	{
		if (sel.options[selIndex].value == items[i].getAttribute("id"))
		{
			inp.value = items[i].getAttribute("href");
			this.startVal = inp.value;
			break;
		}
	}
	sel = this.mgr.document.getElementById("selHelpAction");
	sel.selectedIndex = items[i].getAttribute("action") == "function" ? 1 : 0;
}

//-----------------------------------------------------------------------------
MenusTab.prototype.onKeyDown=function(evt)
{
	return true;
}

//-----------------------------------------------------------------------------
MenusTab.prototype.onPrefsSelectionChange=function()
{
	var sel = this.mgr.document.getElementById("selPrefsList");
	var selIndex = sel.selectedIndex;
	this.setInputState("Prefs",selIndex,sel.options.length-1);
	if (selIndex < 0) return;

	this.startVal="";
	var inp = this.mgr.document.getElementById("txtPreferences");
	if (!inp) return;

	var prefsMenu = this.mgr.storage.getNodeByAttributeId("MENU","id","LAWMENUBTNPREF");
	var items=prefsMenu.getElementsByTagName("ITEM");
	var len = items.length;
	for (var i = 0; i < len; i++)
	{
		if (sel.options[selIndex].value == items[i].getAttribute("id"))
		{
			inp.value = items[i].getAttribute("href");
			this.startVal = inp.value;
			break;
		}
	}
	sel = this.mgr.document.getElementById("selPrefsAction");
	sel.selectedIndex = items[i].getAttribute("action") == "function" ? 1 : 0;
}

//-----------------------------------------------------------------------------
MenusTab.prototype.onTextBlur=function(evt,txtBox)
{
	txtBox.className="xTTextBox";

	// has the text box value changed?
	if (txtBox.value == "")
		txtBox.value=this.startVal;
	if (txtBox.value == this.startVal)
		return;

	var sel = (txtBox.id == "txtHelp"
		? this.mgr.document.getElementById("selHelpList")
		: this.mgr.document.getElementById("selPrefsList"));
	var selIndex = sel.selectedIndex;
	if (selIndex < 0) return;

	// save the change locally
	var oNode=this.mgr.storage.getNodeByAttributeId("ITEM","id",sel.options[selIndex].value)
	oNode.setAttribute("href",txtBox.value)
	this.mgr.setModified();
}

//-----------------------------------------------------------------------------
MenusTab.prototype.setInputState=function(type,selIndex,max)
{
	// enable/disable buttons (new always enabled)
	var btn = this.mgr.document.getElementById("btn"+type+"Delete");
	btn.disabled = selIndex < 0 ? true : false;
	btn.className = "xTToolBarButton" + (btn.disabled ? "Disabled" : "");
	btn = this.mgr.document.getElementById("btn"+type+"Up");
	btn.disabled = selIndex < 1 ? true : false;
	btn.className = "xTToolBarButton" + (btn.disabled ? "Disabled" : "");
	btn = this.mgr.document.getElementById("btn"+type+"Down");
	btn.disabled = selIndex < max ? false : true;
	btn.className = "xTToolBarButton" + (btn.disabled ? "Disabled" : "");
}

MenusTab.prototype.onSelChange=function(evt, selBox)
{
	//var oNode=this.mgr.storage.getNodeByAttributeId("ITEM","id",sel.options[selIndex].value)
	
	var sel = (selBox.id == "selHelpAction" 
		? this.mgr.document.getElementById("selHelpList")
		: this.mgr.document.getElementById("selPrefsList"));
		
	var selIndex = sel.selectedIndex;
	
	if (selIndex < 0) return;
	
	var oNode=this.mgr.storage.getNodeByAttributeId("ITEM","id",sel.options[selIndex].value)
	oNode.setAttribute("action",selBox.value)	
	this.mgr.setModified();
}
