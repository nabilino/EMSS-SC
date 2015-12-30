/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/users/preferences/DrillTab.js,v 1.5.2.7.4.1.14.1.2.4 2012/08/08 12:37:27 jomeli Exp $ */
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

DrillTab.prototype = new TabPage();
DrillTab.prototype.constructor = DrillTab;
DrillTab.superclass = TabPage.prototype;

function DrillTab(id,pageMgr)
{
	DrillTab.superclass.setId.call(this,id);
	DrillTab.superclass.setManager.call(this,pageMgr);
}

//-----------------------------------------------------------------------------
DrillTab.prototype.activate = function()
{
	try {
		var elem = this.mgr.document.getElementById("selExplorerRecs");
		elem.focus();
		if (elem.selectedIndex == -1 && elem.options.length)
			elem.selectedIndex = 0;
	} catch (e) { }
}

//-----------------------------------------------------------------------------
DrillTab.prototype.deactivate = function()
{
	return true;
}

//-----------------------------------------------------------------------------
DrillTab.prototype.getCbxValue = function(obj, bIsNode)
{
	if (bIsNode)
		return (obj.getAttribute("newwin") == "1") ? true : false;
	else
		return (obj.checked) ? "1" : "0";
}

//-----------------------------------------------------------------------------
DrillTab.prototype.getDisabledState = function(typ)
{
	var optNode=this.mgr.portalWnd.oPortalConfig.getUserOption(typ);
	return (optNode && optNode.getAttribute("disable") == "1"
		 ? true : false);
}

//-----------------------------------------------------------------------------
DrillTab.prototype.init = function()
{
	// set the labels text (if not English)
	if (this.mgr.portal.getLanguage() != "en-us")
	{
		var phrase = this.mgr.msgs.getPhrase("lblDrillExplorer");
		var lbl = this.mgr.document.getElementById("lblDrillExplorer2");
		this.mgr.portalWnd.cmnSetElementText(lbl, phrase);

		lbl = this.mgr.document.getElementById("lblSelect2");
		this.mgr.portalWnd.cmnSetElementText(lbl, phrase);
	}

	// populate display
	var elem = this.mgr.document.getElementById("selExplorerRecs");
	var item = this.mgr.storage.getNodeByAttributeId("ITEM", "id", "explorer");
	this.setSelectOptions(elem, item.getAttribute("recstoget")); 

	elem = this.mgr.document.getElementById("cbxDrillOpen");
	if (!this.mgr.portal.browser.isIE)
		elem.disabled = true;
	else
		elem.checked = this.getCbxValue(item, true);

	elem = this.mgr.document.getElementById("selSelectRecs");
	item = this.mgr.storage.getNodeByAttributeId("ITEM", "id", "select");
	this.setSelectOptions(elem, item.getAttribute("recstoget")); 

	elem = this.mgr.document.getElementById("cbxSelectOpen");
	if (!this.mgr.portal.browser.isIE)
		elem.disabled = true;
	else
		elem.checked = this.getCbxValue(item, true);

	elem = this.mgr.document.getElementById("cbxAttachOpen");
	item = this.mgr.storage.getNodeByAttributeId("ITEM", "id", "attachment");
	if (!this.mgr.portal.browser.isIE)
		elem.disabled = true;
	else
		elem.checked = this.getCbxValue(item, true);

	elem = this.mgr.document.getElementById("selListRecs");
	item = this.mgr.storage.getNodeByAttributeId("ITEM", "id", "list");
	this.setSelectOptions(elem, item.getAttribute("recstoget")); 

	elem = this.mgr.document.getElementById("selOtherOptions");
	item = this.mgr.storage.getNodeByAttributeId("ITEM", "id", "otheroptions");
	this.setOtherOptions(elem, item.getAttribute("value")); 

	return true;
}

//-----------------------------------------------------------------------------
DrillTab.prototype.onClickCbx = function(evt,cbx)
{
	var item;
	this.setModified();

	switch (cbx.id)
	{
		case "cbxDrillOpen":
			item = this.mgr.storage.getNodeByAttributeId("ITEM", "id", "explorer");
			item.setAttribute("newwin", this.getCbxValue(cbx, false));
			break;

		case "cbxSelectOpen":
			item = this.mgr.storage.getNodeByAttributeId("ITEM", "id", "select");
			item.setAttribute("newwin", this.getCbxValue(cbx, false));
			break;

		case "cbxAttachOpen":
			item = this.mgr.storage.getNodeByAttributeId("ITEM", "id", "attachment");
			item.setAttribute("newwin", this.getCbxValue(cbx, false));
			break;
	}
}

//-----------------------------------------------------------------------------
DrillTab.prototype.onKeyDown = function(evt)
{
	return true;
}

//-----------------------------------------------------------------------------
DrillTab.prototype.onSelectionChange = function(elem)
{
	var item;
	var selIndex = elem.selectedIndex;
	if (selIndex < 0) return;

	this.setModified();

	switch (elem.id)
	{
		case "selExplorerRecs":
			item = this.mgr.storage.getNodeByAttributeId("ITEM", "id", "explorer");
			item.setAttribute("recstoget", elem.options[selIndex].value);
			break;

		case "selSelectRecs":
			item = this.mgr.storage.getNodeByAttributeId("ITEM", "id", "select");
			item.setAttribute("recstoget", elem.options[selIndex].value);
			break;

		case "selListRecs":
			item = this.mgr.storage.getNodeByAttributeId("ITEM", "id", "list");
			item.setAttribute("recstoget", elem.options[selIndex].value);
			break;

		case "selOtherOptions":
			item = this.mgr.storage.getNodeByAttributeId("ITEM", "id", "otheroptions");
			item.setAttribute("value", elem.options[selIndex].value);
			break;
	}
}

//-----------------------------------------------------------------------------
DrillTab.prototype.setModified = function()
{
	this.mgr.setModified();
	this.mgr.wnd.parent.profile.setModified();
}

//-----------------------------------------------------------------------------
DrillTab.prototype.setSelectOptions = function(elem, strCurrent)
{
	var index;
	var aryLabel = this.mgr.portalWnd.oPortalConfig.arrValues;
	var len = aryLabel.length;

	var typeName=elem.id.substr(3).toLowerCase();
	typeName = typeName.substr(0,typeName.length-4);
	elem.disabled=this.getDisabledState(typeName);

	for (var i=0; i < len; i++)
	{
		index = elem.options.length;
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elem, 
				aryLabel[i], aryLabel[i]);
		if	(strCurrent == elem.options[index].value)
			elem.options[index].selected = true;
	}
}

//-----------------------------------------------------------------------------
DrillTab.prototype.setOtherOptions = function(elem, strCurrent)
{
	var index;
	var aryLabel = Array("Find","Filter");
	var len = aryLabel.length;

	var typeName=elem.id.substr(3).toLowerCase();
	elem.disabled=this.getDisabledState(typeName);

	for (var i=0; i < len; i++)
	{
		index = elem.options.length;
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elem, 
				aryLabel[i], i);
		if	(strCurrent == elem.options[index].value)
			elem.options[index].selected = true;
	}
}
