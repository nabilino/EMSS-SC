/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/drill/Attic/GenSearchTab.js,v 1.1.2.2.4.1.14.1.2.3 2012/08/08 12:37:23 jomeli Exp $ */
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

GenSearchTab.prototype = new TabPage();
GenSearchTab.prototype.constructor = GenSearchTab;
GenSearchTab.superclass = TabPage.prototype;

function GenSearchTab(id,pageMgr)
{
	GenSearchTab.superclass.setId.call(this,id);
	GenSearchTab.superclass.setManager.call(this,pageMgr);
}

//-----------------------------------------------------------------------------
GenSearchTab.prototype.activate = function()
{
	try {
		this.mgr.search.setActiveTab("tabGenSearch");
		var elem = this.mgr.document.getElementById("selFindField");
		elem.focus();
		if (elem.selectedIndex == -1 && elem.options.length)
			elem.selectedIndex = 0;
	} catch(e) { }
}

//-----------------------------------------------------------------------------
GenSearchTab.prototype.createField = function(row, value)
{
	var elem = this.mgr.document.getElementById("genSelect");
	var strHTML = "<select id=\"selFindField\" "; 
	strHTML += "style=\"width:120px;\" ";
	strHTML += "onchange=\"window.tabMgr.tabs['tabGenSearch'].onSelectionChange(this)\" ";
	strHTML += "class=\"xTTextBox\" row=\"" + row + "\">";
	strHTML += this.mgr.search.buildFieldSelect(value);
	strHTML += "</select>";
	elem.innerHTML = strHTML; 
}

//-----------------------------------------------------------------------------
GenSearchTab.prototype.deactivate = function()
{
	return true;
}

//-----------------------------------------------------------------------------
GenSearchTab.prototype.init = function()
{
	// set the labels text (if not English)
	if (this.mgr.portal.getLanguage() != "en-us")
	{
		var lbl = this.mgr.document.getElementById("lblFindField");
		var phrase = this.mgr.msgs.getPhrase("lblFindField");
		this.mgr.portalWnd.cmnSetElementText(lbl, phrase);

		lbl = this.mgr.document.getElementById("lblFindValue");
		phrase = this.mgr.msgs.getPhrase("lblFindValue");
		this.mgr.portalWnd.cmnSetElementText(lbl, phrase);
	}
	return true;
}

//-----------------------------------------------------------------------------
GenSearchTab.prototype.initComplete = function()
{
	// populate with previous entry if available
	var field = this.mgr.storage.getElementsByTagName("FIELD");
	var fldName = (field[0]) ? fldName = field[0].getAttribute("fldname") : "";
	var fldValue = (field[0]) ? this.mgr.storage.getElementValue("FIELD", 0) : "";

	this.createField(0, fldName);
	this.setValue(fldValue);
}

//-----------------------------------------------------------------------------
GenSearchTab.prototype.onBlur = function(evt, elem)
{
	this.mgr.portalWnd.cmnOnTextboxBlur(evt, elem);
}

//-----------------------------------------------------------------------------
GenSearchTab.prototype.onFocus = function(evt, elem)
{
	this.mgr.portalWnd.cmnOnTextboxFocus(evt, elem);
}

//-----------------------------------------------------------------------------
GenSearchTab.prototype.onKeyDown = function(evt)
{
	return true;
}

//-----------------------------------------------------------------------------
GenSearchTab.prototype.onSelectionChange = function(elem)
{
	this.setValue();
}

//-----------------------------------------------------------------------------
GenSearchTab.prototype.saveFields = function()
{
	if (!this.validate())
		return false;

	this.mgr.search.clearFields();
	var aryFields = new Array();

	var fldElem = this.mgr.document.getElementById("selFindField");
	var selected = fldElem.options[fldElem.selectedIndex].value;
	var aryVals = selected.split("#|#");
	var valElem = this.mgr.document.getElementById("txtFindValue");

	// id
	aryFields[0] = 0;

	// field name
	aryFields[1] = aryVals[0];

	// ignore case
	aryFields[2] = "";

	// comparator
	aryFields[3] = "=";

	// value
	aryFields[4] = valElem.value;

	// conjunction not used
	aryFields[5] = "";
	this.mgr.search.createFieldEntry(aryFields);
	return true;
}

//-----------------------------------------------------------------------------
GenSearchTab.prototype.setValue = function(value)
{
	if (typeof(value) == "undefined")
		value = ""

	var fldElem = this.mgr.document.getElementById("selFindField");
	var selected = fldElem.options[fldElem.selectedIndex].value;
	var aryVals = selected.split("#|#");
	var size = aryVals[1];
	var elem = this.mgr.document.getElementById("txtFindValue");
	var width = ((parseInt(size) + 1) * 8);
	if (width > 249) width = 249;
	elem.style.width = width + "px";
	elem.maxLength = size;
	elem.value = value;
}

//-----------------------------------------------------------------------------
GenSearchTab.prototype.validate = function()
{
	var elem = this.mgr.document.getElementById("txtFindValue");
	if (elem.value.length == 0)
	{
		var msg = this.mgr.msgs.getPhrase("msgPleaseEnterValue");
		this.mgr.portalWnd.cmnDlg.messageBox(msg, "ok", "stop");
		try {
			elem.focus();
		} catch(e) { }
		return false;
	}
	return true;
}