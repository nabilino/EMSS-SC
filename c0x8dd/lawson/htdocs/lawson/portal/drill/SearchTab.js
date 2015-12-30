/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/drill/Attic/SearchTab.js,v 1.1.2.2.14.1.2.2 2012/08/08 12:37:23 jomeli Exp $ */
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
	this.oTable = null;
	this.isModified = false;
}

//-----------------------------------------------------------------------------
SearchTab.prototype.getModified = function()
{
	return this.isModified;
}
SearchTab.prototype.setModified = function(value)
{
	if (typeof(value) == "boolean")
		this.isModified = value;
	return this.isModified;
}

//-----------------------------------------------------------------------------
SearchTab.prototype.activate = function()
{
	try {
		this.mgr.search.setActiveTab("tabSearch");
		var elem = this.mgr.document.getElementById("srchField0");
		if (elem) 
			elem.focus();
	} catch(e) { }
}

//-----------------------------------------------------------------------------
SearchTab.prototype.createField = function(row, value)
{
	var strHTML = "<label id=\"srchField" + row + "\" class=\"xTLabelForm\" ";
	strHTML += "for=\"srchValue" + row + "\" ";
	strHTML += "row=\"" + row + "\" >";
	strHTML += value + "</label>"; 
	return strHTML;
}

//-----------------------------------------------------------------------------
SearchTab.prototype.createRow = function(row, node, fldProps, labelValue)
{
	var rowCnt = parseInt(this.oTable.getAttribute("rowCnt"), 10);
	rowCnt++;		// unique row id 
	this.oTable.setAttribute("rowCnt", rowCnt.toString());

	var oRows = this.oTable.getElementsByTagName("TR");
	var len = oRows.length;

	for (var x=0; x<len; x++)
	{
		if (oRows[x].id == "srchAdvRow" + row)
		{
			row = x+1;
			break;
		} 
	}

	// Add row
	var cellValue = "";
	var oRow = this.oTable.insertRow(row);
	row = rowCnt;
	oRow.id = "srchRow" + row;
	oRow.setAttribute("row", row);
	oRow.height = "25px";

	// field cell
	oCell = oRow.insertCell(oRow.cells.length);
	oCell.colSpan = "2";
	oCell.width = "225px";
	oCell.vAlign = "center";
	oCell.align = "right";
	oCell.className = "xTLabel";
	oCell.innerHTML = this.createField(row, labelValue);

	// comparators cell
	oCell = oRow.insertCell(oRow.cells.length);
	oCell.width = "20px";
	oCell.vAlign = "center";
	oCell.align = "center";
	oCell.className = "xTLabelForm";
	oCell.innerHTML = " = ";

	// value cell
	oCell = oRow.insertCell(oRow.cells.length);
	oCell.width = "262px";
	oCell.vAlign = "bottom";
	oCell.align = "left";
	oCell.className = "xTLabel";
	cellValue = (node) ? this.mgr.storage.getElementValue("FIELD", row) : "";
	oCell.innerHTML = this.createValue(row, cellValue, fldProps);
	this.setValue(row, cellValue, fldProps);

	// blank cell
	oCell = oRow.insertCell(oRow.cells.length);
	oCell.innerHTML = "&nbsp;";

	return oRow;
}

//-----------------------------------------------------------------------------
SearchTab.prototype.createValue = function(row, value, fldProps)
{
	var aryVals = fldProps.split("#|#");
	var strHTML = "";

	if (aryVals[2] == "LIST")
	{
		strHTML += "<select id=\"srchValue" + row + "\" ";
		strHTML += "style=\"width:20px;\" ";
		strHTML += "class=\"xTTextBox\" row=\"" + row + "\" ";
		strHTML += "fldprops=\"" + fldProps + "\"></select>";
	}
	else
	{
		strHTML = " <input id=\"srchValue" + row + "\" class=\"xTTextBox\" ";
		strHTML += "maxlength=\"0\" row=\"" + row + "\" "; 
		strHTML += "value=\"" + value + "\" "; 
		strHTML += "onfocus=\"window.tabMgr.tabs['tabSearch'].onFocus(event,this)\" "; 
		strHTML += "onblur=\"window.tabMgr.tabs['tabSearch'].onBlur(event,this)\" "; 
		strHTML += "onkeyup=\"window.tabMgr.tabs['tabSearch'].onKeyUpValue(this)\" "; 
		strHTML += "style=\"width:20px;\" fldprops=\"" + fldProps + "\"></input> "; 
	}
	return strHTML;
}

//-----------------------------------------------------------------------------
SearchTab.prototype.deactivate = function()
{
	// if no changes, allow user to switch
	if (!this.getModified()) 
		return true;
	if (!this.saveFields())
		return false;
	this.mgr.search.setOutput("");
	return true;
}

//-----------------------------------------------------------------------------
SearchTab.prototype.init = function()
{
	// set the labels text (if not English)
	if (this.mgr.portal.getLanguage() != "en-us")
	{
		var lbl = this.mgr.document.getElementById("lblSrchField");
		var phrase = this.mgr.msgs.getPhrase("lblFindField");
		this.mgr.portalWnd.cmnSetElementText(lbl, phrase);

		lbl = this.mgr.document.getElementById("lblSrchValue");
		phrase = this.mgr.msgs.getPhrase("lblFindValue");
		this.mgr.portalWnd.cmnSetElementText(lbl, phrase);
	}

	this.oTable = this.mgr.document.getElementById("srchDet");
	return true;
}

//-----------------------------------------------------------------------------
SearchTab.prototype.initComplete = function()
{
	// populate with previous entry if available
	var fields = this.mgr.storage.getElementsByTagName("FIELD");
	var len = fields ? fields.length : 0;
	
	var labelValue = "";
	var nodeName = "FINDFLD";
	var findfields = this.mgr.storage.document.getElementsByTagName(nodeName);
	var len = findfields ? findfields.length : 0;

	if (len == 0)
	{
		nodeName = "COLUMN";
		fields = this.mgr.storage.document.getElementsByTagName(nodeName);
		len = findfields ? findfields.length : 0;
	}

	for (var i=0; i<len; i++)
	{
        if (findfields[i].getAttribute("header"))
            labelValue = findfields[i].getAttribute("header");
        else
			labelValue = this.mgr.storage.getElementCDataValue(nodeName, i);

		var listVals = findfields[i].getElementsByTagName("VAL");
		var type = (listVals.length == 0) ? findfields[i].getAttribute("type") : "LIST";
		var fldProps = findfields[i].getAttribute("name") + "#|#" +
				findfields[i].getAttribute("size") + "#|#" + type;
 
		this.createRow(i, findfields[i], fldProps, labelValue);
	}

	this.oTable.style.tableLayout = "fixed";

	try {
		var elem = this.mgr.document.getElementById("srchValue0");
		if (elem) 
			elem.focus();
	} catch (e) { }
}

//-----------------------------------------------------------------------------
SearchTab.prototype.onBlur = function(evt, elem)
{
	this.mgr.portalWnd.cmnOnTextboxBlur(evt, elem);
}

//-----------------------------------------------------------------------------
SearchTab.prototype.onFocus = function(evt, elem)
{
	this.mgr.portalWnd.cmnOnTextboxFocus(evt, elem);
}

//-----------------------------------------------------------------------------
SearchTab.prototype.onKeyDown = function(evt)
{
	return true;
}

//-----------------------------------------------------------------------------
SearchTab.prototype.onKeyUpValue = function(elem)
{
	this.setModified(true);
	return true;
}

//-----------------------------------------------------------------------------
SearchTab.prototype.saveFields = function()
{
	this.mgr.search.clearFields();

	var oRows = this.oTable.getElementsByTagName("TR");
	var len = oRows.length;

	for (var x=0; x<len; x++)
	{
		var row = parseInt(oRows[x].getAttribute("row"),10);
		var aryFields = new Array();

		// id
		aryFields[0] = x;

		// field name
		var elem = this.mgr.document.getElementById("srchValue" + row);
		var fldprops = elem.getAttribute("fldprops");
		var aryVals = fldprops.split("#|#");
		aryFields[1] = aryVals[0];

		// ignore case
		aryFields[2] = "";

		// comparator
		aryFields[3] = "=";

		// value
		aryFields[4] = (aryVals[2] == "LIST")
				? elem.options[elem.selectedIndex].value
				: elem.value;
		
		// conjunction
		aryFields[5] = "";

		this.mgr.search.createFieldEntry(aryFields);
	}
	return true;
}

//-----------------------------------------------------------------------------
SearchTab.prototype.setValue = function(row, value)
{
	if (typeof(value) == "undefined")
		value = ""

	var valueElem = this.mgr.document.getElementById("srchValue" + row);
	var fldprops = valueElem.getAttribute("fldprops");
	var aryVals = fldprops.split("#|#");
	var name = aryVals[0];
	var size = aryVals[1];
	var type = aryVals[2];

	if (type == "LIST")
	{
		valueElem.length = 0;
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, valueElem, "", "");
		var field = this.mgr.search.getFindField(name);
		var vals = field.getElementsByTagName("VAL");
		var len = vals.length;
		for (var x=0; x < len; x++)
		{
			var text = this.mgr.portalWnd.cmnGetNodeCDataValue(vals[x]);
			var optValue = vals[x].getAttribute("value");
			this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, valueElem, text, optValue);
			if (optValue == value)
				valueElem.options[valueElem.options.length - 1].selected = true;
		}
		var width = ((parseInt(size) + 3) * 8);
	}
	else
	{
		var width = ((parseInt(size) + 1) * 8);
		valueElem.maxLength = size;
		valueElem.value = value;
	}

	if (width > 249) width = 249;
	valueElem.style.width = width + "px";
	valueElem.style.display = "block";
	valueElem.style.visibility = "visible";
}