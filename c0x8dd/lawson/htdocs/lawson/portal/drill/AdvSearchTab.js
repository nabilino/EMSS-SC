/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/drill/Attic/AdvSearchTab.js,v 1.1.2.3.4.4.6.3.2.4 2012/08/08 12:37:23 jomeli Exp $ */
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

AdvSearchTab.prototype = new TabPage();
AdvSearchTab.prototype.constructor = AdvSearchTab;
AdvSearchTab.superclass = TabPage.prototype;

function AdvSearchTab(id,pageMgr)
{
	AdvSearchTab.superclass.setId.call(this,id);
	AdvSearchTab.superclass.setManager.call(this,pageMgr);
	this.oTable = null;
	this.isModified = false;
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.getModified = function()
{
	return this.isModified;
}
AdvSearchTab.prototype.setModified = function(value)
{
	if (typeof(value) == "boolean")
		this.isModified = value;
	return this.isModified;
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.activate = function()
{
	try {
		this.mgr.search.setActiveTab("tabAdvSearch");
		var elem = this.mgr.document.getElementById("srchAdvField0");
		if (elem) 
			elem.focus();
	} catch(e) { }
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.createComparators = function(row)
{
	var strHTML = "<select id=\"srchAdvComparator" + row + "\" ";
	strHTML += "style=\"width:70px;\" ";
	strHTML += "onchange=\"window.tabMgr.tabs['tabAdvSearch'].onComparatorChange(this)\" ";
	strHTML += "class=\"xTTextBox\" row=\"" + row + "\"> ";
	strHTML += "</select>";
	return strHTML; 
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.createConjunctions = function(row, value)
{
	var checked = "checked";
	var orChecked = (value == "|") ? checked : "";
	var andChecked = (orChecked.length > 0) ? "" : checked;

	var strHTML = "&nbsp;<input type=\"radio\" id=\"srchAdvConjunctionAnd" + row + "\" ";
	strHTML += "row=\"" + row + "\" ";
	strHTML += "name=\"radio" + row + "\" tp=\"AND\" " + andChecked + "></input>";
	strHTML += "&nbsp;<input type=\"radio\" id=\"srchAdvConjunctionOr" + row + "\" ";
	strHTML += "row=\"" + row + "\" ";
	strHTML += "name=\"radio" + row + "\" tp=\"OR\" " + orChecked + "></input>";
	return strHTML;
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.createField = function(row, value)
{
	var strHTML = "<select id=\"srchAdvField" + row + "\" "; 
	strHTML += "style=\"width:120px;\" ";
	strHTML += "onchange=\"window.tabMgr.tabs['tabAdvSearch'].onFieldChange(this)\" ";
	strHTML += "class=\"xTTextBox\" row=\"" + row + "\">";
	strHTML += this.mgr.search.buildFieldSelect(value);
	strHTML += "</select>";
	return strHTML; 
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.createInsertButton = function(row)
{
	var strHTML = "<button \id=\"srchAdvInsert" + row + "\" ";
	strHTML += "class=\"xTToolBarButton\" row=\"" + row + "\" ";
	strHTML += "style=\"width:22px;height:20px;padding:0px;margin:0px;";
	strHTML += "background-image:url('" + this.mgr.portal.path + 
			"/images/ico_toolbutton_add.gif');";
	strHTML += "background-repeat:no-repeat;";
	strHTML += "background-position-x:left;";
	strHTML += "background-position-y:top;\" ";
	strHTML += "onclick=\"window.tabMgr.tabs['tabAdvSearch'].onInsertRow(this)\""
	strHTML += "></button>";
	return strHTML;
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.createRemoveButton = function(row)
{
	var strHTML = "";
	if (row != 0)
	{
		strHTML += "<button \id=\"srchAdvRemove" + row + "\" ";
		strHTML += "class=\"xTToolBarButton\" row=\"" + row + "\" ";
		strHTML += "style=\"width:22px;height:20px;padding:0px;margin:0px;";
		strHTML += "background-image:url('" + this.mgr.portal.path + 
				"/images/ico_toolbutton_del.gif');";
		strHTML += "background-repeat:no-repeat;";
		strHTML += "background-position-x:left;";
		strHTML += "background-position-y:top;\" ";
		strHTML += "onclick=\"window.tabMgr.tabs['tabAdvSearch'].onRemoveRow(this)\""
		strHTML += "></button>";
	}
	else
		strHTML += "<nobr>&nbsp;</nobr>";
	return strHTML;
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.createRow = function(row, node)
{
	var rowCnt = parseInt(this.oTable.getAttribute("rowCnt"), 10);
	rowCnt++;		// unique row id 
	this.oTable.setAttribute("rowCnt", rowCnt.toString());

	// get row index in table
	if (typeof(row) == "undefined")
		row = 0;
	else
	{
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
	}

	// Add row
	var cellValue = "";
	var checkedValue = "";
	var oRow = this.oTable.insertRow(row);
	row = rowCnt;
	oRow.id = "srchAdvRow" + row;
	oRow.setAttribute("row", row);
	oRow.height = "23px";
		
	// conjunctions cell
	oCell = oRow.insertCell(oRow.cells.length);
	oCell.align = "left";
	oCell.className = "xTLabel";
	oCell.width = "50px";
	oCell.vAlign = "top";
	cellValue = (node) ? node.getAttribute("conjunction") : "";

	if (row == 0)
		oCell.innerHTML = "&nbsp;";
	else
		oCell.innerHTML = "<nobr>" + this.createConjunctions(row, cellValue) + "</nobr>";

	// field cell
	oCell = oRow.insertCell(oRow.cells.length);
	oCell.align = "left";
	oCell.className = "xTLabel";
	oCell.width = "122px";
	oCell.vAlign = "top";
 	cellValue = (node) ? node.getAttribute("fldname") : "";
	oCell.innerHTML = this.createField(row, cellValue);

	// comparators cell
	oCell = oRow.insertCell(oRow.cells.length);
	oCell.align = "left";
	oCell.className = "xTLabel";
	oCell.width = "72px";
	oCell.vAlign = "top";
	oCell.innerHTML = this.createComparators(row);
	cellValue = (node) ? node.getAttribute("comparator") : "";
	this.setComparators(row, cellValue);

	// value cell
	oCell = oRow.insertCell(oRow.cells.length);
	oCell.align = "left";
	oCell.className = "xTLabel";
	oCell.width = "252px";
	oCell.vAlign = "top";
	cellValue = (node) ? this.mgr.storage.getElementValue("FIELD", row)	: "";
	checkedValue = (node) ? node.getAttribute("ignoreCase") : "";
	oCell.innerHTML = this.createValue(row, cellValue, checkedValue);
	this.setValue(row, cellValue);

	// insert button cell
	oCell = oRow.insertCell(oRow.cells.length);
	oCell.align = "left";
	oCell.className = "xTLabel";
	oCell.width = "24px";
	oCell.vAlign = "top";
	oCell.innerHTML = this.createInsertButton(row);

	// remove button cell
	oCell = oRow.insertCell(oRow.cells.length);
	oCell.align = "left";
	oCell.className = "xTLabel";
	oCell.width = "24px";
	oCell.vAlign = "top";
	oCell.innerHTML = this.createRemoveButton(row);

	try {
		var elem = this.mgr.document.getElementById("srchAdvField" + row);
		if (elem) 
			elem.focus();
	} catch(e) { }
	return row;
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.createValue = function(row, value, checkedValue)
{
	var strHTML = "";
	var checked = (checkedValue == "") ? "checked" : "";

	strHTML += "<input id=\"srchAdvValue" + row + "\" class=\"xTTextBox\" ";
	strHTML += "maxlength=\"0\" row=\"" + row + "\" "; 
	strHTML += "value=\"" + value + "\" "; 
	strHTML += "onfocus=\"window.tabMgr.tabs['tabAdvSearch'].onFocus(event,this)\" "; 
	strHTML += "onblur=\"window.tabMgr.tabs['tabAdvSearch'].onBlur(event,this)\" "; 
	strHTML += "onkeyup=\"window.tabMgr.tabs['tabAdvSearch'].onKeyUpValue(this)\" "; 
	strHTML += "style=\"width:20px;margin-top:-1px;padding:0px;\"></input>";
	
	// See the Search Rules comment concerning the Case Sensitive checkbox
	// div, case sensitive checkbox and label for key fields
	strHTML += "<div id=\"srchAdvDivIgnore" + row + "\" ";
	strHTML += "style=\"display:none;visibility:hidden;height:0px;\" >";
	strHTML += "<input id=\"srchAdvIgnore" + row + "\" ";
	strHTML += "type=\"checkbox\" " +  checked + " value=\"^\" ";
	strHTML += "style=\"margin-left:-4px;margin-top:-3px;\"></input>";
	strHTML += "<label id=\"srchAdvIgnoreLabel" + row + "\" ";
	strHTML += "class=\"xTLabel\" for=\"srchAdvIgnore" + row + "\" ";
	strHTML += "style=\"\">";
	strHTML += this.mgr.msgs.getPhrase("lblCaseSensitive");
	strHTML += "</label></div>";

	// select element for value lists
	strHTML += "<select id=\"srchAdvValueList" + row + "\" ";
	strHTML += "style=\"width:20px;\" ";
	strHTML += "class=\"xTTextBox\" row=\"" + row + "\"> ";
	return strHTML;
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.deactivate = function()
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
AdvSearchTab.prototype.init = function()
{
	// set the labels text (if not English)
	if (this.mgr.portal.getLanguage() != "en-us")
	{
		var lbl = this.mgr.document.getElementById("lblAnd");
		var phrase = this.mgr.msgs.getPhrase("lblAnd");
		this.mgr.portalWnd.cmnSetElementText(lbl, phrase);

		lbl = this.mgr.document.getElementById("lblOr");
		phrase = this.mgr.msgs.getPhrase("lblOr");
		this.mgr.portalWnd.cmnSetElementText(lbl, phrase);
	}

	this.oTable = this.mgr.document.getElementById("srchAdvDet");
	return true;
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.initComplete = function()
{
	// populate with previous entry if available
	var fields = this.mgr.storage.getElementsByTagName("FIELD");
	var len = fields ? fields.length : 0;
	
	// append first row
	if (len == 0)
		this.createRow();
	else
	{
		for (var x=0; x<len; x++)
			this.createRow(x, fields[x]);
	}
	this.oTable.style.tableLayout = "fixed";
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.onBlur = function(evt, elem)
{
	this.mgr.portalWnd.cmnOnTextboxBlur(evt, elem);
	if (elem.id.indexOf("srchAdvValue") > -1)
	{
		this.validateComparator(elem);
		if (!this.validateNumeric(elem) && elem.value != "")
		{
			alert("Field only allows numeric values");
			try {
				elem.focus();
				elem.select();
			} catch(e) { }
			return false;
		}
	}
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.onComparatorChange = function(elem)
{
	var row = elem.getAttribute("row");
	elem = this.mgr.document.getElementById("srchAdvValue" + row);
	this.validateComparator(elem);
	this.setModified(true);
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.onFieldChange = function(elem)
{
	var selected = elem.options[elem.selectedIndex].value;
	var row = elem.getAttribute("row");
	this.setModified(true);
	this.setComparators(row);
	this.validateComparator(this.mgr.document.getElementById("srchAdvValue" + row));
	this.setValue(row);
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.onFocus = function(evt, elem)
{
	this.mgr.portalWnd.cmnOnTextboxFocus(evt, elem);
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.onInsertRow = function(elem)
{
	var row = elem.getAttribute("row");
	if (!row)
		return false;
	if (!this.saveFields())
		return false;
	if (this.mgr.search.checkUrlLength() == 0)
		return false;
	this.createRow(row);
	this.setModified(true);
	return true;
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.onKeyDown = function(evt)
{
	return true;
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.onKeyUpValue = function(elem)
{
	this.validateComparator(elem);
	this.setModified(true);
	return true;
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.onRemoveRow = function(elem)
{
	var row = elem.getAttribute("row");
	var oRows = this.oTable.getElementsByTagName("TR");
	var len = oRows.length;

	for (var x=1; x<len; x++)
	{
		if (oRows[x].getAttribute("row") == row)
		{
			this.oTable.deleteRow(x);
			this.setModified(true);

			var loc = (x-1 < 0) ? 0 : x-1;
			var newRow = oRows[loc].getAttribute("row");
			try {
				this.mgr.document.getElementById("srchAdvField" + newRow).focus();
			} catch(e) { }
			return true;
		} 
	}
	return false;
}

//-----------------------------------------------------------------------------
// Search Rules
//
//	Displaying the Case Sensitive checkbox:
//		If the selected field is a key field and its type is ALPHALC (mixed case),
//			then display the Case Sensitive checkbox
//
//	Obtaining the entered search criteria:
//		If the selected field type is NUMERIC or BCD (numeric/signed) or has a value list,
//			then send an empty string as the ignore case character
//
//		If the selected field is the key field and the checkbox is checked,
//			then send an empty string as the ignore case character;
//			otherwise, send the ignore case character 
//
//		If the selected field type is ALPHA or ALPHARIGHT (upper case),
//			then change the search value to upper case;
//			otherwise, leave as typed
//
//	Note regarding the Case Sensitive checkbox:
//		The checkbox is labeled Case Sensitive, meaning when it is checked, the
//		ignore case value is an empty string (means do not ignore the case of the
//		search value; use it as typed). When the checkbox is not checked, the 
//		ignore case value is a caret (^) (means ignore the case of the search value).
//
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.saveFields = function()
{
	if (!this.validate())
		return false;

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
		var elem = this.mgr.document.getElementById("srchAdvField" + row);
		var value = elem.options[elem.selectedIndex].value;
		var aryVals = value.split("#|#");
		aryFields[1] = aryVals[0];

		var isList = (aryVals[3] == "LIST");
		var isKey = (aryVals[4] == "KEY");
		var isNumeric = (aryVals[2] == "NUMERIC" || aryVals[2] == "BCD");
		var isAlphaUpper = (aryVals[2] == "ALPHA" || aryVals[2] == "ALPHARIGHT");

		// ignore case; see Search Rules comment
		elem = (isKey)
				? this.mgr.document.getElementById("srchAdvIgnore" + row)
				: null;

		aryFields[2] = (isNumeric || isList) 
				? "" 
				: (isKey && elem && elem.checked) 
						? ""
						: "^";

		// comparator
		elem = (isList)
				? this.mgr.document.getElementById("srchAdvValueList" + row)
				: this.mgr.document.getElementById("srchAdvValue" + row);

		aryFields[3] = this.validateComparator(elem);

		// value
		var bAllowWildcard = (aryFields[3] == "~" || aryFields[3] == "!~") ? true : false;
		var re = /\*$/;
		
		aryFields[4] = (isList)
				? elem.options[elem.selectedIndex].value
				: (isAlphaUpper)
						? elem.value.toUpperCase()
						: (bAllowWildcard)
								? elem.value
								: elem.value.replace(re,"");
		
		// conjunction
		value = "";
		if (row > 0)
		{
			elem = this.mgr.document.getElementById("srchAdvConjunctionAnd" + row);
			value = (elem.checked) ? "%26" : "|";
		}
		aryFields[5] = value;

		this.mgr.search.createFieldEntry(aryFields);
	}
	return true;
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.setComparators = function(row, value)
{
	if (typeof(value) == "undefined")
		value = "";

	var fldElem = this.mgr.document.getElementById("srchAdvField" + row);
	var selected = fldElem.options[fldElem.selectedIndex].value;
	var aryVals = selected.split("#|#");
	var isList = (aryVals[3] == "LIST");
	var isNumeric = (aryVals[2] == "NUMERIC" || aryVals[2] == "BCD");
	var isDateTime = (aryVals[2] == "YYYYMMDD" || aryVals[2] == "YYYYMM" || aryVals[2] == "MMDD" || aryVals[2] ==  "TIME");

	var elem = this.mgr.document.getElementById("srchAdvComparator" + row);
	elem.options.length = 0;

	// what is displayed
	var aryText = new Array("=", 
			this.mgr.msgs.getPhrase("lblNotEqual"),
			this.mgr.msgs.getPhrase("lblLike"),
			this.mgr.msgs.getPhrase("lblNotLike"),
			"<", ">", "<=", ">=");

	var aryValue = new Array("=", "!=", "~", "!~", "<",">", "<=", ">=");
	var aryAlpha = new Array("1", "1", "1", "1", "0", "0", "0", "0");
	var aryNumeric = new Array("1", "1", "0", "0", "1", "1", "1", "1");
	var aryList = new Array("1", "1", "0", "0", "0", "0", "0", "0");
	var aryDateTime = new Array("1", "1", "0", "0", "1", "1", "1", "1");
	var len = aryValue.length;
	var index;

	for (var x=0; x<len; x++)
	{
		index = elem.options.length;
		
		if ((isList && aryList[x] == "1")
				|| (isNumeric && aryNumeric[x] == "1")
				|| (isDateTime && aryDateTime[x] == "1")
				|| (!isNumeric && !isList && !isDateTime && aryAlpha[x] == "1"))
		{
			elem.options[index] = new Option(aryText[x], aryValue[x]);
			if	(value == elem.options[index].value)
				elem.options[index].selected = true;
		}
	}
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.setValue = function(row, value)
{
	if (typeof(value) == "undefined")
		value = ""

	var fldElem = this.mgr.document.getElementById("srchAdvField" + row);
	var selected = fldElem.options[fldElem.selectedIndex].value;
	var aryVals = selected.split("#|#");
	var name = aryVals[0];
	var size = aryVals[1];
	var isCaseSensitive = (aryVals[4] == "KEY" && aryVals[2] == "ALPHALC");
	var isList = (aryVals[3] == "LIST");

	var rowElem = this.mgr.document.getElementById("srchAdvRow" + row);
	var valueElem = this.mgr.document.getElementById("srchAdvValue" + row);
	var valueListElem = this.mgr.document.getElementById("srchAdvValueList" + row);
	var valueDiv = this.mgr.document.getElementById("srchAdvDivValue" + row);

	var width = (isList) 
			? ((parseInt(size) + 3) * 8)
			: ((parseInt(size) + 1) * 8);
	if (width > 249) width = 249;
	var height = "23px";

	if (isList)
	{
		valueListElem.length = 0;
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, valueListElem, "", "");
		var field = this.mgr.search.getFindField(name);
		var vals = field.getElementsByTagName("VAL");
		var len = vals.length;
		for (var x=0; x < len; x++)
		{
			var text = this.mgr.portalWnd.cmnGetNodeCDataValue(vals[x]);
			var optValue = vals[x].getAttribute("value");
			this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, valueListElem, text, optValue);
			if (optValue == value)
				valueListElem.options[valueListElem.options.length - 1].selected = true;
		}

		valueListElem.style.width = width + "px";
		this.toggleValue(isList, valueElem, valueListElem);
		this.toggleIgnore(false, row);
		rowElem.style.height = height;
	}
	else
	{
		valueElem.style.width = width + "px";
		valueElem.maxLength = size;
		valueElem.value = value;
		this.toggleValue(isList, valueElem, valueListElem);
		this.toggleIgnore(isCaseSensitive, row);
		rowElem.style.height = (isCaseSensitive) ? "37px" : height;
	}
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.toggleIgnore = function(isShow, row)
{
	var elem = this.mgr.document.getElementById("srchAdvDivIgnore" + row);
	if (isShow)
	{
		elem.style.display = "block";
		elem.style.visibility = "visible";
		elem.style.height = "20px";
	}
	else
	{
		elem.style.visibility = "hidden";
		elem.style.display = "none";
		elem.style.height = "0px";
	}
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.toggleValue = function(isList, valueElem, listElem)
{
	if (isList)
	{
		listElem.style.display = "block";
		listElem.style.visibility = "visible";
		valueElem.style.visibility = "hidden";
		valueElem.style.display = "none";
	}
	else
	{
		valueElem.style.display = "block";
		valueElem.style.visibility = "visible";
		listElem.style.visibility = "hidden";
		listElem.style.display = "none";
	}
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.validate = function()
{
	var elems = this.oTable.getElementsByTagName("*");
	var len = elems ? elems.length : 0;

	for (var x=0; x<len; x++)
	{
		if (elems[x].id.indexOf("srchAdvValue") > -1 && elems[x].style.visibility == "visible")
		{
			if (elems[x].nodeName == "INPUT" && elems[x].value.length > 0)
				continue;
			if (elems[x].nodeName == "SELECT" && elems[x].selectedIndex > 0)
				continue;

			var msg = this.mgr.msgs.getPhrase("msgPleaseEnterValue");
			this.mgr.portalWnd.cmnDlg.messageBox(msg, "ok", "stop");
			try {
				elems[x].focus();
			} catch(e) { }
			return false;
		}
	}
	return true;
}

//-----------------------------------------------------------------------------
AdvSearchTab.prototype.validateComparator = function(valueElem)
{
	var row = valueElem.getAttribute("row");
	var compElem = this.mgr.document.getElementById("srchAdvComparator" + row);
	var compValue = compElem.options[compElem.selectedIndex].value;

	if (valueElem.value.indexOf("*") == -1)
		return compValue;

	if (compValue.indexOf("~") == -1)
	{
		var len = compElem ? compElem.options.length : 0;
		for (var x=0; x<len; x++)
		{
			if (compElem.options[x].value.indexOf("~") > -1)
			{
				compElem.selectedIndex = x;
				break;				
			}
		}
	}
	return compElem.options[compElem.selectedIndex].value;
}

//----------------------------------------------------------------------------
AdvSearchTab.prototype.validateNumeric = function(valueElem)
{
	var row = valueElem.getAttribute("row");
	var fieldElem = this.mgr.document.getElementById("srchAdvField" + row);
	var fieldValue = fieldElem.options[fieldElem.selectedIndex].value;

	var aryVals = fieldValue.split("#|#");
	var isNumeric = (aryVals[2] == "NUMERIC" || aryVals[2] == "BCD");
	
	if (isNumeric)
	{
		if (aryVals[2] == "NUMERIC" && !/^-?\d+$/.test(valueElem.value))
		{
			return false;
		}
		else if (aryVals[2] == "BCD" && isNaN(valueElem.value))
		{
			return false;
		}
		else
		{
			return true;
		}
	}
	else
	{
		return true;
	}
		
}
