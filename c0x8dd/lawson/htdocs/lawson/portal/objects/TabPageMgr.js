/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/objects/TabPageMgr.js,v 1.3.2.4.4.10.14.1.2.2 2012/08/08 12:37:30 jomeli Exp $ */
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

//-----------------------------------------------------------------------------
// constructor
function TabPageMgr(portalWnd,wnd,msgs,storage,switchHandler,readyState)
{
	this.portalWnd=portalWnd;			// reference to portal window
	this.portal=portalWnd.lawsonPortal;	// reference to portal object
	this.wnd=wnd;						// reference to tab window
	this.document=wnd.document;			// reference to tab window document
	this.msgs=msgs;						// phrase object
	this.storage=storage				// data storage object
	this.switchHandler=switchHandler;	// switch tab event handler (onclick)
	this.readyState=readyState;			// script ready state event handler (onreadystatechange)
	this.tabArray = new Array();		// array of tab button ids ('tab'+id)
	this.tabs=new Array()				// array to hold tab page objects
	this.maxTabIndex=-1;				// max tab array index
	this.activeTab=null;				// active tab button
	this.keyCallback=null;				// function to call if key down not handled
	this.modified=false;				// modified flag
	this.nTabWidth=70;					// tab button width (pixels)
	this.isModal=false;
	this.mode=this.standardMode			// 0=show tabs, 1=wizard (don't show tabs)

	// create a document wrapper
	var divBody = this.document.createElement("div");
	divBody.className="scrollDiv";
	with (divBody.style) {
		position="absolute";
		top="0px";
		left="0px";
		height="98%";
		width="98%";
	}
	// create the tab button container
	var divTabs = this.document.createElement("div");
	divTabs.id="divTabs";
	divTabs.className="tabContainer";
	with (divTabs.style) {
		position="absolute";
		top="10px";
		left="10px";
		height="25px";
		width="98%";
	}
	this.tabContainer=divBody.appendChild(divTabs);

	var imgBottom=this.document.createElement("img");
	imgBottom.id="imgTabBottom";
	imgBottom.src=this.portal.path+"/images/ico_tab_bottom_active.gif";
	with (imgBottom.style) {
		display="inline";
		position="absolute";
		top="35px";
		left="11px";
		width="75px";
		height="1px";
		zIndex="50";
	}
	this.tabBottom=divBody.appendChild(imgBottom);

	// create the tab pane container
	var divPanes = this.document.createElement("div");
	divPanes.id="divPanes";
	divPanes.className="";
	with (divPanes.style) {
		position="absolute";
		top="35px";
		left="10px";
		width="98%"
	}
	this.tabPanes=divBody.appendChild(divPanes);

	this.document.body.appendChild(divBody);
}

// constants
TabPageMgr.prototype.standardMode=Number(0);
TabPageMgr.prototype.wizardMode=Number(1);

//-----------------------------------------------------------------------------
TabPageMgr.prototype.addTabPage=function(id,text,src,active)
{
	// get the tabs container
	var nbrTabs = this.tabArray.length;

	var newTab = this.document.createElement("div");
	newTab.id = "tab"+id;
	newTab.className = (active ? "activeTab" : "");
	newTab.onselectstart=this.portalWnd.cmnBlockSelect;
	if (this.mode == this.wizardMode)
		newTab.style.display = "none";
	newTab.onclick = this.switchHandler;

	var newBtn=this.document.createElement("button");
	newBtn.appendChild(this.document.createTextNode(text));
	newTab.appendChild(newBtn);
	this.tabContainer.appendChild(newTab);
	newTab.setAttribute("tabind",nbrTabs);

	this.tabArray[this.tabArray.length]="tab"+id;
	this.maxTabIndex++;
	if (active)
	{
		this.activeTab=this.document.getElementById("tab"+id);
		if (this.mode != this.wizardMode)
		{
			this.tabBottom.style.left = this.activeTab.offsetLeft+11;
			this.tabBottom.style.width = this.activeTab.offsetWidth-2;
		}
	}

	this.createTabPageContainer(id,src,active);
}

//-----------------------------------------------------------------------------
TabPageMgr.prototype.createTabPageContainer=function(id,src,active)
{
	// create a div to host the script and htm for tab
	var tabDiv = this.document.createElement("div")
	tabDiv.id="div"+id;
	tabDiv.className = "ptTabPane" + (active ? "Active" : "Inactive");
	tabDiv.style.position="absolute";
	tabDiv.style.top="0px";
	tabDiv.style.left="0px";
	tabDiv.style.display=(active ? "block" : "none");

	this.tabPanes.appendChild(tabDiv);
	this.sizeTabPages();

	// load the HTM source for the tab page
	var tabHTM = this.portalWnd.httpRequest(src+".htm","","text/html","text/html");
	if (!tabHTM || tabHTM.status) return;
	tabDiv.innerHTML=tabHTM;

	// create a script element in the main document
	var tabScript=this.document.createElement("script")
	tabScript.id="scr"+id;
	tabScript.src=src+".js"
	tabScript.onreadystatechange=this.readyState;
	this.document.body.appendChild(tabScript);
}

//-----------------------------------------------------------------------------
TabPageMgr.prototype.getModified=function()
{
	return this.modified;
}

TabPageMgr.prototype.setModified=function(modified)
{
	if (typeof(modified) != "boolean")
		modified=true
	this.modified=modified
	this.portal.toolbar.changeButtonState("apply", modified ? "enabled" : "disabled")
}

//-----------------------------------------------------------------------------
// move active tab +/- 1
TabPageMgr.prototype.incActiveTab=function(inc)
{
	// check if deactivate ok with current tab	
	if (!this.tabs[this.activeTab.id].deactivate())
		return;

	var curIndex = parseInt(this.activeTab.getAttribute("tabind"))
	var tabIndex = curIndex + inc

	if (tabIndex < 0)
		tabIndex = 0
	else if (tabIndex > this.maxTabIndex)
		tabIndex = this.maxTabIndex

	if (curIndex != tabIndex)
	{
		var obj = this.document.getElementById(this.tabArray[tabIndex])
		this.switchTab(obj);
	}
}

//-----------------------------------------------------------------------------
TabPageMgr.prototype.insertTabPage=function(id,text,beforeId)
{
	// get the before element
	var beforeBtn = this.document.getElementById("tab"+beforeId)
	if (!beforeBtn) return false;

	// insert array member
	var idx = parseInt(beforeBtn.getAttribute("tabind"), 10);
	this.tabArray.splice(idx,1,"tab"+id,"tab"+beforeId);
	this.maxTabIndex++;

	// add the tab element
	var newTab = this.document.createElement("div");
	newTab.id = "tab"+id;
	newTab.className = "";
	newTab.onselectstart=this.portalWnd.cmnBlockSelect;
	if (this.mode == this.wizardMode)
		newTab.style.display = "none";
	newTab.onclick = this.switchHandler;

	var newBtn=this.document.createElement("button");
	newBtn.appendChild(this.document.createTextNode(text));

	newTab.appendChild(newBtn);
	this.tabContainer.insertBefore(newTab,beforeBtn)
	newTab.setAttribute("tabind",idx);

	// reposition and reset tabindex on rest of the tabs
	for (var i = idx+1; i < this.maxTabIndex+1; i++)
	{
		var tabBtn = this.document.getElementById(this.tabArray[i])
		if (!tabBtn) continue;
		tabBtn.setAttribute("tabind",i);
	}
}

//-----------------------------------------------------------------------------
TabPageMgr.prototype.removeNode=function(node,selElement,nIndex)
{
	var parentNode=node.parentNode
	parentNode.removeChild(node);

	if (typeof(selElement) != "undefined")
	{
		selElement.removeChild(selElement.options[nIndex])
		var idx=nIndex-1
		if (idx < 0 && selElement.options.length)
			idx=0
		selElement.selectedIndex=idx;
	}
	this.setModified()
}

//-----------------------------------------------------------------------------
TabPageMgr.prototype.removeTabPage=function(id)
{
	// get the element
	var tabBtn = this.document.getElementById("tab"+id)
	if (!tabBtn) return false;

	// remove array member
	var idx = tabBtn.getAttribute("tabind");
	this.tabArray.splice(idx,1);
	this.maxTabIndex = this.maxTabIndex-1;

	// remove the element
	var savActiveId = this.activeTab.id
	this.tabContainer.removeChild(tabBtn)

	// reset tabindex on rest of the tabs
	for (var i = idx; i < this.maxTabIndex+1; i++)
	{
		tabBtn = this.document.getElementById(this.tabArray[i])
		if (!tabBtn) continue;
		tabBtn.setAttribute("tabind",i);
	}

	// set new active tab?
	if (savActiveId == "tab"+id)
	{
		idx = idx != 0 ? idx-- : 0;
		this.switchTab(this.document.getElementById(this.tabArray[idx]))
	}
}
//-----------------------------------------------------------------------------
TabPageMgr.prototype.setModalState=function(bModal)
{
	if (typeof(bModal) != "boolean")
		bModal=true
	this.isModal=bModal;
}
//-----------------------------------------------------------------------------
TabPageMgr.prototype.getModalState=function()
{
	return this.isModal;
}
//-----------------------------------------------------------------------------
TabPageMgr.prototype.getMode=function()
{
	return this.mode;
}
//-----------------------------------------------------------------------------
TabPageMgr.prototype.setWizardMode=function(bMode)
{
	if (typeof(bMode) != "boolean")
		bMode=true;
	this.mode = (bMode ? this.wizardMode : this.standardMode)

	if (this.mode == this.wizardMode)
	{
		if (this.isModal)
		{
			this.document.body.style.margin = "0px";
			this.tabPanes.style.left = "2%";
		}

		this.tabContainer.style.display="none";
		this.tabBottom.style.display="none";
		this.tabPanes.style.top = "10px";
	}
}
//-----------------------------------------------------------------------------
TabPageMgr.prototype.sizeTabPages=function()
{
	var winHeight = (this.portal.browser.isIE 
		? document.body.clientHeight-2 : window.innerHeight);
	var winWidth = (this.portal.browser.isIE
		? document.body.clientWidth-2 : window.innerWidth);
	if (this.mode == this.wizardMode)
		winHeight -= 10;
	else
		winHeight -= 35;

	var divPanesH = winHeight - parseInt(this.tabPanes.style.top,10);
	this.tabPanes.style.height = divPanesH + "px";
	this.tabPanes.style.width = (this.mode == this.wizardMode
			? this.tabPanes.style.width
			: this.tabContainer.offsetWidth + "px");

	if (this.activeTab)
	{
		var divPage = this.document.getElementById("div" + this.activeTab.id.substr(3));
		if (!divPage) return;
		divPage.style.height = divPanesH - parseInt(divPage.style.top, 10) + "px";

		// give the active tab a chance to size things
		try {
			this.tabs[this.activeTab.id].onResize();
		} catch (e) { }
	}
}
//-----------------------------------------------------------------------------
TabPageMgr.prototype.switchTab=function(objTab)
{
	if (objTab.tagName.toLowerCase() == "button")
		objTab=objTab.parentNode;
	if (objTab.id == this.activeTab.id) return;

	// make the previously active tab inactive (may have been deleted)
	try {
		var divTab = this.document.getElementById("div" + this.activeTab.id.substr(3))
		divTab.className = "ptTabPaneInactive";
		divTab.style.display = "none";
		this.activeTab.className = "";
	} catch (e) { }

	divTab = this.document.getElementById("div" + objTab.id.substr(3))
	divTab.className = "ptTabPaneActive";
	divTab.style.display = "block";
	objTab.className = "activeTab";

	// make this tab as active tab & size it
	this.activeTab = objTab
	this.sizeTabPages();
	if (this.mode != this.wizardMode)
	{
		this.tabBottom.style.left = objTab.offsetLeft+11;
		this.tabBottom.style.width = objTab.offsetWidth-2;
	}

	// do activate callback
	if (typeof(this.tabs[objTab.id]) != "undefined"
	&& typeof(this.tabs[objTab.id].activate == "function"))
	{
		this.tabs[objTab.id].activate();
	}
}

//-----------------------------------------------------------------------------
function TabPage()
{
	this.mgr=null;
	this.id="";
	this.startVal="";
}
TabPage.prototype.activate=function()
{
}
TabPage.prototype.apply=function()
{
	return true;
}
TabPage.prototype.deactivate=function()
{
	return true;
}
TabPage.prototype.init=function()
{
	return true;
}
TabPage.prototype.setId=function(id)
{
	this.id=id;
}
TabPage.prototype.setManager=function(mgr)
{
	this.mgr=mgr;
}
TabPage.prototype.onKeyDown=function(evt)
{
	return true;
}
TabPage.prototype.onResize=function()
{
}
TabPage.prototype.onTextFocus=function(evt,txtBox)
{
	txtBox.className="xTTextBoxHighlight";
	this.startVal=txtBox.value;
}
TabPage.prototype.onTextBlur=function(evt,txtBox)
{
	txtBox.className="xTTextBox";
	if (txtBox.value != this.startVal)
		this.mgr.setModified();
}
