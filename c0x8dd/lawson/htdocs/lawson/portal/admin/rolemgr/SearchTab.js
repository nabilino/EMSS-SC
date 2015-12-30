/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/admin/rolemgr/SearchTab.js,v 1.6.2.6.4.4.14.1.2.2 2012/08/08 12:37:29 jomeli Exp $ */
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
SearchTab.prototype = new TabPage();
SearchTab.prototype.constructor = SearchTab;
SearchTab.superclass = TabPage.prototype;

function SearchTab(id,pageMgr)
{
	SearchTab.superclass.setId.call(this,id);
	SearchTab.superclass.setManager.call(this,pageMgr);
	this.initialized=false;
}

//-----------------------------------------------------------------------------
SearchTab.prototype.activate=function()
{
	try {
		if (!this.initialized)
			this.init();
		var elem=this.mgr.document.getElementById("selSrchList");
		elem.focus();
		if (elem.selectedIndex == -1 && elem.options.length)
			elem.selectedIndex=0;
	} catch (e) { }
}

//-----------------------------------------------------------------------------
SearchTab.prototype.deactivate=function()
{
	return true;
}

//-----------------------------------------------------------------------------
SearchTab.prototype.doDelete=function()
{
	var sel = this.mgr.document.getElementById("selSrchList");
	var selIndex = sel.selectedIndex;
	if (selIndex < 0) return;

	var text=sel.options[selIndex].text;
	var msg=this.mgr.msgs.getPhrase("lblOKToDelete");
	var retVal = this.mgr.portalWnd.cmnDlg.messageBox(msg+" '"+text
					+"'?","okcancel","question",this.mgr.wnd);
	if (retVal == "cancel") return;

	var node=this.mgr.storage.getNodeByAttributeId("ITEM","id",sel.options[selIndex].value)
	this.mgr.removeNode(node,sel,selIndex);

	if (sel.options.length==0)
	{
		var textBox = this.mgr.document.getElementById("txtSearch");
		textBox.value="";
	}
	sel.focus()
	this.onSelectionChange();
	this.mgr.setModified();
}

//-----------------------------------------------------------------------------
SearchTab.prototype.doNew=function()
{
	// get the new item text
	var strTitle=this.mgr.msgs.getPhrase("lblNewSearchItem");
	var strPrompt=this.mgr.msgs.getPhrase("lblSearchPromptText");
	var newText=this.mgr.portalWnd.cmnDlg.prompt(strTitle,strTitle,strPrompt,this.mgr.wnd);
	if (!newText) return;

	// get the new item url
	strPrompt=this.mgr.msgs.getPhrase("lblSearchPromptURL");
	var newURL=this.mgr.portalWnd.cmnDlg.prompt("",strTitle,strPrompt,this.mgr.wnd);
	if (!newURL) return;

	var sel = this.mgr.document.getElementById("selSrchList");
	var newId=this.getUniqueId("find");

	// append the option element
	this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, sel, newText, newId);
	sel.selectedIndex=sel.options.length-1;
	
	// update the storage
	var doc=this.mgr.storage.getDocument();
	var findNode = this.getFindNode();
	var menu = findNode.getElementsByTagName("MENU");
	if (menu && menu.length > 0)
		menu=menu[0];
	else
	{
		menu = doc.createElement("MENU");
		menu.setAttribute("id","LAWMENUBTNSEARCH");
		menu.setAttribute("type","SEARCH");
		findNode.appendChild(menu)
	}
	var newItem = doc.createElement("ITEM");
	newItem.setAttribute("id",newId);
	newItem.setAttribute("labelid",newText);
	newItem.setAttribute("action","WEB_SEARCH");
	newItem.setAttribute("href",newURL);
	menu.appendChild(newItem)

	this.onSelectionChange();
	this.mgr.setModified();
}

//-----------------------------------------------------------------------------
SearchTab.prototype.doRename = function()
{
	var sel = this.mgr.document.getElementById("selSrchList");
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
	var strTitle=this.mgr.msgs.getPhrase("lblRenameSearchItem");
	var strPrompt=this.mgr.msgs.getPhrase("lblSearchPromptText2");
	var newText = this.mgr.portalWnd.cmnDlg.prompt(text, strTitle, strPrompt, this.mgr.wnd); 
	newText = this.mgr.portalWnd.trim(newText);
	if (!newText) return;

	node.setAttribute("labelid",newText);		// pre-empts translation
	sel.options[selIndex].text=newText;

	this.mgr.setModified();
}

//-----------------------------------------------------------------------------
SearchTab.prototype.getFindNode=function()
{
	var findNode = this.mgr.storage.document.getElementsByTagName("FIND");
	if (findNode && findNode.length > 0)
		findNode=findNode[0]
	else
	{
		var doc=this.mgr.storage.getDocument();
		findNode = doc.createElement("FIND");
		var roleNode = this.mgr.storage.document.getElementsByTagName("ROLE");
		roleNode[0].appendChild(findNode);
	}
	return findNode;
}

//-----------------------------------------------------------------------------
SearchTab.prototype.getUniqueId=function(type)
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
SearchTab.prototype.init=function()
{
	// set the button labels (if not English)
	if (this.mgr.portal.getLanguage() != "en-us")
	{
		var btn = this.mgr.document.getElementById("btnSrchNew");
		btn.value=this.mgr.msgs.getPhrase("btnNew");

		btn = this.mgr.document.getElementById("btnSrchRename");
		btn.value=this.mgr.msgs.getPhrase("btnRename");

		btn = this.mgr.document.getElementById("btnSrchDelete");
		btn.value=this.mgr.msgs.getPhrase("btnDelete");

		btn = this.mgr.document.getElementById("btnSrchUp");
		btn.value=this.mgr.msgs.getPhrase("btnUp");

		btn = this.mgr.document.getElementById("btnSrchDown");
		btn.value=this.mgr.msgs.getPhrase("btnDown");
	}

	// clear the list
	var sel = this.mgr.document.getElementById("selSrchList");
	var len = sel.options.length;
	for (var i=len-1; i > -1; i--)
		sel.removeChild(sel.children(i));
	var inp = this.mgr.document.getElementById("txtSearch");
	if (inp) inp.value = "";
	this.startVal="";

	var findNodes = this.mgr.storage.document.getElementsByTagName("FIND");
	if (findNodes.length < 1)
		return true;
	var items = findNodes[0].getElementsByTagName("ITEM");
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
		this.onSelectionChange();
	}
	this.initialized=true;
	return true;
}

//-----------------------------------------------------------------------------
SearchTab.prototype.moveUpDown=function(dir)
{
	var sel = this.mgr.document.getElementById("selSrchList");
	var selIndex = sel.selectedIndex;
	if (selIndex < 0) return;

	var findNode = this.getFindNode();
	var menu = findNode.getElementsByTagName("MENU");
	if (menu.length < 1) return;
	menu = menu[0];

	switch (dir)
	{
	case "up" :
		var dnVal = sel.options[selIndex].value
		var dnText = sel.options[selIndex].text
		var upVal = sel.options[selIndex-1].value
		var upText = sel.options[selIndex-1].text

		var oUpNode=this.mgr.storage.getNodeByAttributeId("ITEM","id",upVal)
		var oDnNode=this.mgr.storage.getNodeByAttributeId("ITEM","id",dnVal)

		menu.insertBefore(oDnNode, oUpNode)
			
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

		menu.insertBefore(oDnNode, oUpNode)

		sel.options[selIndex+1].value = upVal
		sel.options[selIndex+1].text = upText
		sel.options[selIndex].value = dnVal
		sel.options[selIndex].text = dnText
		
		sel.selectedIndex=selIndex+1
		break;
	}
	this.onSelectionChange();
	this.mgr.setModified();
}

//-----------------------------------------------------------------------------
SearchTab.prototype.onSelectionChange=function()
{
	var sel = this.mgr.document.getElementById("selSrchList");
	var selIndex = sel.selectedIndex;
	this.setInputState(selIndex,sel.options.length-1);
	if (selIndex < 0) return;

	this.startVal="";
	var inp = this.mgr.document.getElementById("txtSearch");
	if (!inp) return;

	var findNode = this.getFindNode();
	var items = findNode.getElementsByTagName("ITEM");
	len = items.length;
	for (var i = 0; i < len; i++)
	{
		if (sel.options[selIndex].value == items[i].getAttribute("id"))
		{
			inp.value = items[i].getAttribute("href");
			this.startVal = inp.value;
			break;
		}
	}
	sel = this.mgr.document.getElementById("selSrchType");
	sel.selectedIndex = items[i].getAttribute("action") == "WEB_SEARCH" ? 1 : 0;
}

//-----------------------------------------------------------------------------
SearchTab.prototype.onTextBlur=function(evt,txtBox)
{
	txtBox.className="xTTextBox";
	if (txtBox.value == "")
		txtBox.value=this.startVal;
	if (txtBox.value == this.startVal)
		return;

	var sel = this.mgr.document.getElementById("selSrchList");
	var selIndex = sel.selectedIndex;
	if (selIndex < 0) return;

	// save the change locally
	var oNode=this.mgr.storage.getNodeByAttributeId("ITEM","id",sel.options[selIndex].value)
	oNode.setAttribute("href",txtBox.value)
	this.mgr.setModified();
}

//-----------------------------------------------------------------------------
SearchTab.prototype.onTypeChange=function(evt,selType)
{
	if (selType.selectedIndex < 0) return;		// should never happen!

	var selList = this.mgr.document.getElementById("selSrchList");
	var selListIndex = selList.selectedIndex;
	if (selListIndex < 0) return;
	var listVal = selList.options[selListIndex].value

	var oNode=this.mgr.storage.getNodeByAttributeId("ITEM","id",listVal)
	oNode.setAttribute("action",selType.options[selType.selectedIndex].value);

	this.mgr.setModified();
}

//-----------------------------------------------------------------------------
SearchTab.prototype.setInputState=function(selIndex,max)
{
	// enable/disable buttons (new always enabled)
	var btn = this.mgr.document.getElementById("btnSrchDelete");
	btn.disabled = selIndex < 0 ? true : false;
	btn.className = "xTToolBarButton" + (btn.disabled ? "Disabled" : "");
	btn = this.mgr.document.getElementById("btnSrchUp");
	btn.disabled = selIndex < 1 ? true : false;
	btn.className = "xTToolBarButton" + (btn.disabled ? "Disabled" : "");
	btn = this.mgr.document.getElementById("btnSrchDown");
	btn.disabled = selIndex > -1 && selIndex < max ? false : true;
	btn.className = "xTToolBarButton" + (btn.disabled ? "Disabled" : "");

	var inp = this.mgr.document.getElementById("txtSearch");
	inp.disabled = selIndex < 0 ? true : false;
	inp.className = (inp.disabled ? "xTTextBoxDisabled" : "xTTextBox");

	inp = this.mgr.document.getElementById("selSrchType");
	inp.disabled = selIndex < 0 ? true : false;
	inp.className = (inp.disabled ? "xTTextBoxDisabled" : "xTTextBox");
}
