/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/admin/rolemgr/GeneralTab.js,v 1.6.2.7.4.6.6.2.2.2 2012/08/08 12:37:29 jomeli Exp $ */
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

GeneralTab.prototype = new TabPage();
GeneralTab.prototype.constructor = GeneralTab;
GeneralTab.superclass = TabPage.prototype;

function GeneralTab(id,pageMgr)
{
	GeneralTab.superclass.setId.call(this,id);
	GeneralTab.superclass.setManager.call(this,pageMgr);
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.activate=function()
{
	try {
		var elem=this.mgr.document.getElementById("txtWelcomeMessage");
		elem.focus();
		elem.select();
	} catch (e) { }
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.deactivate=function()
{
	return true;
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.init=function()
{
	// set the labels text (if not English)
	var len=0;
	if (this.mgr.portal.getLanguage() != "en-us")
	{
	//NOTE: this will set the labels and titles for all tabs
		var lblElems=this.mgr.document.getElementsByTagName("LABEL");
		var len = lblElems.length;
		for (var i = 0; i < len; i++)
		{
			var lbl = lblElems[i];
			try {
				var ph=this.mgr.msgs.getPhrase(lbl.id);
				if (ph!=lbl.id)
					this.mgr.portalWnd.cmnSetElementText(lbl,ph);
			} catch (e) { }
		}

		// set button titles
		lblElems=this.mgr.document.getElementsByTagName("BUTTON");
		len = lblElems.length;
		for (var i = 0; i < len; i++)
		{
			var btn = lblElems[i];
			phId="lbl"+btn.id.substr(3);
			var ph=this.mgr.msgs.getPhrase(phId);
			if (ph != phId)
				btn.setAttribute("title",ph);
		}
	}

	// set background image of insert button
	var inp=this.mgr.document.getElementById("btnInsertAttr");
	if (inp)
	{
		// insert button available only in IE
		if (!this.mgr.portalWnd.oBrowser.isIE)
			inp.style.display="none";
		else
			inp.style.backgroundImage="url('"+this.mgr.portal.path+"/images/ico_form_dropmenu.gif')";
	}

	// welcome message
	inp = this.mgr.document.getElementById("txtWelcomeMessage");
	var valNode = this.mgr.storage.getElementsByTagName("WELCOME");
	if (valNode && valNode.length > 0)
		// stored in CDATA
		inp.value = portalWnd.cmnGetNodeCDataValue(valNode[0]);

	// home page
	inp = this.mgr.document.getElementById("txtHomePage");
	valNode = this.mgr.storage.getElementsByTagName("HOME");
	if (valNode && valNode.length > 0)
		inp.value=valNode[0].childNodes[0].nodeValue;
	
	// allow search?
	inp = this.mgr.document.getElementById("cbxAllowSrch");
	inp.checked = this.mgr.wnd.parent.oPortalRole.getUseFind()
	
	// allow menus?
	inp = this.mgr.document.getElementById("cbxAllowMenus");
	inp.checked = this.mgr.wnd.parent.oPortalRole.getUseMenus()
	
	// allow favorites (shortcuts)?
	inp = this.mgr.document.getElementById("cbxAllowFavorites");
	inp.checked = this.mgr.wnd.parent.oPortalRole.getUseShortcuts()
	
	// allow keyboard customization?
	inp = this.mgr.document.getElementById("cbxAllowKeyboard");
	inp.checked = this.mgr.wnd.parent.oPortalRole.getAllowHotkeys()

	// role base options?
	if (!this.mgr.portalWnd.oPortalConfig.isRoleBased())
		return true;

	// show role options table
	inp=this.mgr.document.getElementById("tblRoleOptions");
	inp.style.visibility="visible";

	// use compact transactions?
	inp = this.mgr.document.getElementById("cbxUseCompactTransaction");
	inp.checked = this.mgr.wnd.parent.oPortalRole.getRoleOptionValue(
		"use_compact_transaction","0")=="1" ? true : false;

	// use form cache?
	inp = this.mgr.document.getElementById("cbxUseFormCache");
	inp.checked = this.mgr.wnd.parent.oPortalRole.getRoleOptionValue(
		"use_form_cache","0")=="1" ? true : false;

	// get jobs,reports access flags		
	var jobsArray=new Array("JobDef","JobList","JobSchedule","PrintFiles","JobPolling");
	len = jobsArray.length;
	
	for (var i = 0; i < len; i++)
	{
		inp = this.mgr.document.getElementById("cbxAllow"+jobsArray[i]);
		inp.checked=this.mgr.storage.getAttributeById("ROLEOPTION","id",
				"allow_"+jobsArray[i].toLowerCase(),"value") == "1"	? true : false;
	}

	this.onResize();
	return true;
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.insertDefaultData=function(typ)
{
	if (typ != "menus" && typ != "search")
		return;

	var oRole=this.mgr.wnd.parent.oPortalRole;
	var oDefault=this.mgr.wnd.parent.oDefaultRole;

	var roleNode = oRole.storage.getRootNode();
	if (!roleNode) return;

	var tagName = (typ == "menus" ? "MENUBAR" : "FIND");
	var node=oDefault.storage.document.getElementsByTagName(tagName);
	node = (node && node.length > 0 ? node[0] : null);
	if (!node) return;

	var clone = node.cloneNode(true);
	roleNode.appendChild(clone);
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.onKeyDown=function(evt)
{
	return true;
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.onResize=function()
{

	var tbl=this.mgr.document.getElementById("generalTbl");
	if (!tbl) return;
	var paneElem=tbl.parentNode;
	var newWidth = (parseInt(paneElem.offsetWidth,10) > 700 
		? "700px" 
		: (parseInt(paneElem.offsetWidth,10) < 400 
				? "400px" 
				: parseInt(paneElem.offsetWidth,10)-30+"px"));
	tbl.style.width=newWidth;

	tbl=this.mgr.document.getElementById("tblRoleOptions");
	if (!tbl) return;
	tbl.style.width=newWidth;

}

//-----------------------------------------------------------------------------
GeneralTab.prototype.onTextBlur=function(evt,txtBox)
{
	txtBox.className="xTTextBox";

	// has the text box value changed?
	if (txtBox.value == "")
		txtBox.value=this.startVal;
	if (txtBox.value == this.startVal)
		return;

	// save the change locally
	var elemName = (txtBox.id == "txtHomePage" ? "HOME" : "WELCOME");
	this.mgr.storage.setElementValue(elemName,txtBox.value)
	this.mgr.setModified();
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.onClickAttributes=function(evt,btn)
{
	if (!this.mgr.wnd.oDropDown)
		this.mgr.wnd.oDropDown=new this.mgr.wnd.Dropdown()
	this.mgr.wnd.oDropDown.clearItems()

	var selItem="";
	var attrs=this.mgr.portalWnd.oUserProfile.attStorage.getElementsByTagName("ATTR");
	var len=attrs.length;
	for (var i = 0; i < len; i++)
	{
		if (attrs[i].getAttribute("value") == "")
			continue;

		var id = attrs[i].getAttribute("name");
		this.mgr.wnd.oDropDown.addItem(id,id);
		if (selItem=="") selItem=id;
	}
	this.mgr.wnd.oDropDown.show(selItem, btn, 
		"tabMgr.tabs['tabGeneral'].attributeSelected");
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.attributeSelected=function(attName)
{
	if (!attName)
	{
		this.mgr.document.getElementById("btnInsertAttr").focus();
		return;
	}

	var docRange=null;
	var docSel=this.mgr.document.selection;
	if (docSel!=null)
		docRange=docSel.createRange();
	var elemMsg=this.mgr.document.getElementById("txtWelcomeMessage");
	var msgRange = elemMsg.createTextRange();

	if (docRange && docRange.text && msgRange.findText(docRange.text))
	{
		elemMsg.focus();
		docRange.text="<<"+attName+">>"
		docRange.select();
	}
	else
	{
		msgRange.move("textedit");
		msgRange.text="<<"+attName+">>";
		msgRange.select();
		elemMsg.focus();
	}
	var txtBox = this.mgr.document.getElementById("txtWelcomeMessage");
	this.mgr.storage.setElementValue("WELCOME",txtBox.value)
	this.mgr.setModified();
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.onClickCbx=function(evt,cbx)
{
	this.mgr.setModified();
	switch (cbx.id)
	{
	case "cbxAllowFavorites":
		this.mgr.wnd.parent.oPortalRole.setUseShortcuts(cbx.checked);
		break;
	case "cbxAllowKeyboard":
		this.mgr.wnd.parent.oPortalRole.setAllowHotkeys(cbx.checked);
		break;
	case "cbxAllowMenus":
		this.mgr.wnd.parent.oPortalRole.setUseMenus(cbx.checked);
		if (cbx.checked)
		{
			this.mgr.insertTabPage("Menus",this.mgr.msgs.getPhrase("lblMenus"),"Hotkeys");
			this.insertDefaultData("menus");
		}
		else
			this.mgr.removeTabPage("Menus");
		break;
	case "cbxAllowSrch":
		this.mgr.wnd.parent.oPortalRole.setUseFind(cbx.checked);
		if (cbx.checked)
		{
			var before=this.mgr.wnd.parent.oPortalRole.getUseMenus()
				? "Menus"
				: "Hotkeys" ;
			this.mgr.insertTabPage("Search",this.mgr.msgs.getPhrase("lblSearch"),before);
			this.insertDefaultData("search");
		}
		else
			this.mgr.removeTabPage("Search");
		break;
	case "cbxAllowJobDef":
	case "cbxAllowJobList":
	case "cbxAllowJobSchedule":
	case "cbxAllowPrintFiles":
	case "cbxAllowJobPolling":
		this.mgr.wnd.parent.oPortalRole.setRoleOption("allow_" + 
			cbx.id.substr(8).toLowerCase(), cbx.checked ? "1" : "0");
		break;
	case "cbxUseCompactTransaction":
		this.mgr.wnd.parent.oPortalRole.setRoleOption("use_compact_transaction", 
				cbx.checked ? "1" : "0");
		break;
	case "cbxUseFormCache":
		this.mgr.wnd.parent.oPortalRole.setRoleOption("use_form_cache", 
				cbx.checked ? "1" : "0");
		break;
	}
}
