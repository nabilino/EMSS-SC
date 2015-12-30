/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/objects/TableBuilder.js,v 1.17.2.7.2.6 2014/02/18 16:42:33 brentd Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@10.00.05.00.12 Mon Mar 31 10:17:31 Central Daylight Time 2014 */
//***************************************************************
//*                                                             *
//*                           NOTICE                            *
//*                                                             *
//*   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
//*   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
//*   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
//*   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
//*   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
//*   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
//*   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
//*                                                             *
//*   (c) COPYRIGHT 2014 INFOR.  ALL RIGHTS RESERVED.           *
//*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//*                                                             *
//***************************************************************
//
//	NOTE:
//		Your rows/cells MUST use classes (in-line styles WILL NOT WORK!!!)
//-----------------------------------------------------------------------------
//
//	DEPENDENCIES:
//		none
//-----------------------------------------------------------------------------
//
//	GLOBAL VARIABLES:
	var sortColumnIdx;				// used by sorting routines
//-----------------------------------------------------------------------------
//
//	PARAMETERS:
//		table			reference to your html table object
//	    styler			reference to styler info (optional)
//-----------------------------------------------------------------------------
function TableBuilderObject(table, styler)
{
	this.table = table;
	this.modelRow = null;
	this.protectedRows = new Array();
	this.styler = styler;
	this.translationFunc = null;
	
	if (typeof(window.mainWnd) == "object" && typeof(window.mainWnd.getPhrase) == "function") 
			this.translationFunc = window.mainWnd.getPhrase;
}
//-- static variables ---------------------------------------------------------
TableBuilderObject.NO_RECORDS_FOUND = "No records found";
//-- static methods -----------------------------------------------------------
TableBuilderObject.getInnerText = function(elm)
{
	if (typeof(elm) == "string")
		return elm;
	if (typeof(elm) == "undefined")
		return elm;

	// not needed but it is faster
	if (elm.innerText)
		return elm.innerText;

	var str = "";
	var len = elm.childNodes.length;
	for (var i=0; i<len; i++)
	{
		switch (elm.childNodes[i].nodeType)
		{
			// ELEMENT NODE
			case 1:
				str += TableBuilderObject.getInnerText(elm.childNodes[i]);
				break;
			// TEXT NODE
			case 3:
				str += elm.childNodes[i].nodeValue;
				break;
		}
	}
	return str;
}
//-----------------------------------------------------------------------------
TableBuilderObject.preserveHtmlEntities = function(origStr)
{
	// make sure it's a string
	if (typeof(origStr) != "string")
		origStr += "";

	// send the blank string back
	if (origStr == "")
		return "&nbsp;";

	// are there any &'s ?
	if (origStr.indexOf("&") == -1)
		return origStr;

	// & exists... is it an entity or by itself?
	var strAry = origStr.split("&");
	if (strAry[strAry.length-1].indexOf(";") == -1)
	{
		// no ; exists
		// not an entity, encode the & or it will be lost
		strAry[strAry.length-1] = "amp;" + strAry[strAry.length-1];
	}

	return strAry.join("&");
}
//-- member methods ----------------------------------------------------------
TableBuilderObject.prototype.setTranslationFunc = function(func)
{
	if (func)
		this.translationFunc = func;
}
//-----------------------------------------------------------------------------
TableBuilderObject.prototype.getPhrase = function(phrase)
{
	return (this.translationFunc)
	  ? this.translationFunc(phrase)
	  : phrase;
}
//-----------------------------------------------------------------------------
TableBuilderObject.prototype.createNoRecordsRow = function(msg)
{
	
	var row = this.table.insertRow(this.table.rows.length);
	row.className = "emptyMsg";
	var cell = row.insertCell(row.cells.length);
	cell.colSpan = (this.modelRow) ? this.modelRow.cells.length : 1;
	cell.className = "singleCol";
	cell.style.textAlign = "center";
	cell.innerHTML = "<br>" + msg + "<br>&nbsp;";
	return row;
}
//-----------------------------------------------------------------------------
TableBuilderObject.prototype.createRow = function(cellContentAry, rowId, rowKey)
{
	cellContentAry = cellContentAry || new Array("");

	// add row
	var row = (this.table.tBodies.length != 0)
			? this.table.tBodies[0].insertRow(-1)
			: this.table.insertRow(-1);
	if (rowKey)
		row.name = rowKey;

	if (this.modelRow)
	{
		// create this row from the model row
		row.id = rowId || this.modelRow.id
		row.className = this.modelRow.className;

		var modelRowCellCount = this.modelRow.cells.length;
		for (var i=0; i<modelRowCellCount; i++)
		{
			var modelCell = this.modelRow.cells[i];
			var cell = row.insertCell(i);
			cell.id = modelCell.id;
			cell.className = modelCell.className;
			if (modelCell.colSpan != 1)
				cell.colSpan = modelCell.colSpan;
			if (modelCell.scope != "")
				cell.scope = modelCell.scope;
			if (modelCell.rowSpan != 1)
				cell.rowSpan = modelCell.rowSpan;
			var str = (i < cellContentAry.length)
					? (cellContentAry[i] || "")
					: "";
			//if (str == "")
				//cell.setAttribute("aria-hidden", "true");
			cell.innerHTML = TableBuilderObject.preserveHtmlEntities(str);
		}
	}
	else
	{
		// create this row only from the cellContentAry
		if (rowId)
			row.id = rowId;

		for (var i=0; i<cellContentAry.length; i++)
		{
			var cell = row.insertCell(row.cells.length);
			cell.innerHTML = cellContentAry[i];
		}
	}
	return row;
}
//-----------------------------------------------------------------------------
TableBuilderObject.prototype.deleteAllRows = function()
{
	// delete all the rows but the protected ones
	for (var i=this.table.rows.length-1; i>=0; i--)
		if (!this.isRowProtected(this.table.rows[i]))
			this.table.deleteRow(i);
	this.removeSortArrow();
}
//-----------------------------------------------------------------------------
TableBuilderObject.prototype.deleteRowById = function(id)
{
	var idx = this.getRowIdxById(id);
	if (idx != null)
	{
		this.table.deleteRow(idx);
		return true;
	}
	return false;
}
//-----------------------------------------------------------------------------
TableBuilderObject.prototype.deleteRowByName = function(name)
{
	var idx = this.getRowIdxByName(name);
	if (idx != null)
	{
		this.table.deleteRow(idx);
		return true;
	}
	return false;
}
//-----------------------------------------------------------------------------
TableBuilderObject.prototype.deleteRow = function(rowIdx)
{
	if (typeof(rowIdx) == "object")
	{
		// try to convert to a number
		for (var i=0; i<this.table.rows.length; i++)
		{
			if (rowIdx == this.table.rows[i])
			{
				rowIdx = i;
				break;
			}
		}
	}

	if (typeof(rowIdx) == "number" && rowIdx >= 0 && rowIdx < this.table.rows.length)
	{
		this.table.deleteRow(rowIdx);
		return true;
	}

	return false;
}
//-----------------------------------------------------------------------------
TableBuilderObject.prototype.getFirstDataRow = function()
{
	for (var i=0; i<this.table.rows.length; i++)
		if (!this.isRowProtected(this.table.rows[i]))
			return this.table.rows[i];
	return null;
}
//-----------------------------------------------------------------------------
TableBuilderObject.prototype.getRowByName = function(name)
{
	var idx = this.getRowIdxByName(name);
	if (idx != null)
		return this.table.rows[idx];
}
//-----------------------------------------------------------------------------
TableBuilderObject.prototype.getRowIdxByName = function(name)
{
	if (!name)
		return null;

	for (var i=0; i<this.table.rows.length; i++)
		if (this.table.rows[i].name == name)
			return i;
	return null;
}
//-----------------------------------------------------------------------------
TableBuilderObject.prototype.getRowById = function(id)
{
	var idx = this.getRowIdxById(id);
	if (idx != null)
		return this.table.rows[idx];
}
//-----------------------------------------------------------------------------
TableBuilderObject.prototype.getRowIdxById = function(id)
{
	if (!id)
		return false;

	for (var i=0; i<this.table.rows.length; i++)
		if (this.table.rows[i].id == id)
			return i;
	return null;
}
//-----------------------------------------------------------------------------
TableBuilderObject.prototype.isRowProtected = function(row)
{
	for (var j=0; j<this.protectedRows.length; j++)
		if (this.protectedRows[j] == row)
			return true;
	return false;
}
//-----------------------------------------------------------------------------
TableBuilderObject.prototype.protectRow = function(row)
{
	if (!row)
		return;
	this.protectedRows[this.protectedRows.length] = row;
}
//-----------------------------------------------------------------------------
TableBuilderObject.prototype.setModelRow = function(row)
{
	if (!row)
		return;

	// row properties
	this.modelRow = new Object();
	this.modelRow.id = row.id || "";
	this.modelRow.className = row.className || "";

	// cells and their properties
	this.modelRow.cells = new Array();	
	for (var i=0; i<row.cells.length; i++)
	{
		this.modelRow.cells[i] = new Object();
		this.modelRow.cells[i].id = row.cells[i].id || "";
		this.modelRow.cells[i].className = row.cells[i].className || "";
		this.modelRow.cells[i].colSpan = row.cells[i].colSpan || 1;
		this.modelRow.cells[i].rowSpan = row.cells[i].rowSpan || 1;
		this.modelRow.cells[i].scope = row.cells[i].scope || "";
	}
}
//-----------------------------------------------------------------------------
TableBuilderObject.prototype.sort = function(obj)
{
	if (!obj || this.table.rows.length <= 1)
		return;
	var sortHeader = obj;
	// find the cell
	var cell = null;
	while (obj.parentNode)
	{		
		if (obj.parentNode.tagName.toUpperCase() == "TH")
		{
			cell = obj.parentNode;
			break;
		}
		else
			obj = obj.parentNode;
	}

	if (!cell)
		return;

	// now sort the column
	var firstDataRow = this.getFirstDataRow();
	if (!firstDataRow)
		return;
	sortColumnIdx = cell.cellIndex;
	var str = TableBuilderObject.getInnerText(firstDataRow.cells[sortColumnIdx]);
	var sortFunc = this.sortCaseInsensitive;

	if (str.match(/^[-\d\.]/))
		sortFunc = this.sortNumeric;
	if (str.match(/^\d\d[\/-]\d\d[\/-]\d\d\d\d$/))
		sortFunc = this.sortDate;
	if (str.match(/^\d\d[\/-]\d\d[\/-]\d\d$/))
		sortFunc = this.sortDate;
	if (str.match(/^[�$]/))
		sortFunc = this.sortCurrency;
	//if (str.match(/^[\d\.]+$/))
	//	sortFunc = this.sortNumeric;

	var newRows = new Array();
	for (var i=0; i<this.table.rows.length; i++)
	{
		if (this.isRowProtected(this.table.rows[i]))
			continue;
		newRows[newRows.length] = this.table.rows[i];
	}
	newRows.sort(sortFunc);

	// create new sort span
	this.removeSortArrow();
	sortSpan = document.createElement("span");
	sortSpan.id = "sortArrowSpan";
    var titleTxt = "";
	if (cell.getAttribute("sortdir") == "down")
	{
		if (this.styler && (this.styler.showInfor3 || this.styler.showInfor)){
			sortSpan.className="inforSortIndicatorDesc";
		}
		else {
			sortSpan.innerHTML = "&uarr;";
		}
		newRows.reverse();
		cell.setAttribute("sortdir", "up");
		titleTxt = "SortedDescending";
	}
	else
	{
		if (this.styler && (this.styler.showInfor3 || this.styler.showInfor)){
			sortSpan.className="inforSortIndicatorAsc";
		}
		else {
			sortSpan.innerHTML = "&darr;";
		}
		cell.setAttribute("sortdir", "down");
		titleTxt = "SortedAscending";
	}
	var hiddenSpan = sortHeader.getElementsByTagName("span");
	if (hiddenSpan.length == 1) {
		hiddenSpan[0].innerHTML = " - " + this.getPhrase(titleTxt);
		hiddenSpan[0].setAttribute("id", "sortDirSpan");
	}
	sortHeader.setAttribute("title", this.getPhrase(titleTxt));
	sortHeader.setAttribute("name", "sortAnchor");
		// in theme 9 append to the span
	if (this.table.className == "listStyler")
	{
	
		var cell2 = null;
		while (cell.childNodes)
		{
			if (cell.lastChild.tagName.toUpperCase() == "SPAN")
			{
				cell2 = cell.lastChild;
				break;
			}
			else
				cell = cell.lastChild;
		}
		cell2.appendChild(sortSpan);
	}
	else
	{
		cell.appendChild(sortSpan);
	}

	// re-append rows
	for (var i=0; i<newRows.length; i++)
		this.table.tBodies[0].appendChild(newRows[i]);
}

//-----------------------------------------------------------------------------
TableBuilderObject.prototype.sort9 = function(obj)
{
	if (!obj || this.table.rows.length <= 1)
		return;
	// find the cell
	var cell = null;
	while (obj.parentNode)
	{
		if (obj.parentNode.tagName.toUpperCase() == "TH")
		{
			cell = obj.parentNode;
			break;
		}
		else
			obj = obj.parentNode;
	}

	if (!cell)
		return;

	// now sort the column
	var firstDataRow = this.getFirstDataRow();
	if (!firstDataRow)
		return;
	sortColumnIdx = cell.cellIndex;
	var str = TableBuilderObject.getInnerText(firstDataRow.cells[sortColumnIdx]);
	var sortFunc = this.sortCaseInsensitive;

	if (str.match(/^[-\d\.]/))
		sortFunc = this.sortNumeric;
	if (str.match(/^\d\d[\/-]\d\d[\/-]\d\d\d\d$/))
		sortFunc = this.sortDate;
	if (str.match(/^\d\d[\/-]\d\d[\/-]\d\d$/))
		sortFunc = this.sortDate;
	if (str.match(/^[�$]/))
		sortFunc = this.sortCurrency;
	//if (str.match(/^[\d\.]+$/))
	//	sortFunc = this.sortNumeric;

	var newRows = new Array();
	for (var i=0; i<this.table.rows.length; i++)
	{
		if (this.isRowProtected(this.table.rows[i]))
			continue;
		newRows[newRows.length] = this.table.rows[i];
	}
	newRows.sort(sortFunc);

	// create new sort span
	this.removeSortArrow();
	sortSpan = document.createElement("span");
	sortSpan.id = "sortArrowSpan";
	if (cell.getAttribute("sortdir") == "down")
	{
		sortSpan.innerHTML = "&uarr;";
		newRows.reverse();
		cell.setAttribute("sortdir", "up");
	}
	else
	{
		sortSpan.innerHTML = "&darr;";
		cell.setAttribute("sortdir", "down");
	}

	// in theme 9 append to the span
	var cell2 = null;
	while (cell.childNodes)
	{
		if (cell.lastChild.tagName.toUpperCase() == "SPAN")
		{
			cell2 = cell.lastChild;
			break;
		}
		else
			cell = cell.lastChild;
	}

	cell2.appendChild(sortSpan);

	// re-append rows
	for (var i=0; i<newRows.length; i++)
		this.table.tBodies[0].appendChild(newRows[i]);
}

//-----------------------------------------------------------------------------
TableBuilderObject.prototype.removeSortArrow = function()
{
	var sortSpan = document.getElementById("sortArrowSpan");
	if (sortSpan) {
		sortSpan.parentNode.removeChild(sortSpan);
		var anchorTag = document.getElementsByName("sortAnchor");
		if (anchorTag.length == 1) {
			anchorTag[0].setAttribute("title", this.getPhrase("Sort"));
			anchorTag[0].setAttribute("name", "");
			var hiddenSpan = document.getElementById("sortDirSpan");
			if (hiddenSpan) {
				hiddenSpan.innerHTML = " - " + this.getPhrase("Sort");
				hiddenSpan.setAttribute("id", "");
			}
		}
	}
}
//-----------------------------------------------------------------------------
// NOTE: sort methods cannot use "this" reference -----------------------------
TableBuilderObject.prototype.sortDate = function(a, b)
{
	// y2k notes: two digit years less than 50 are treated as 20XX, greater than 50 are treated as 19XX
	var aa = TableBuilderObject.getInnerText(a.cells[sortColumnIdx]);
	var bb = TableBuilderObject.getInnerText(b.cells[sortColumnIdx]);
	var dt1;
	var dt2;
	var yr;

	if (aa.length == 10)
		dt1 = aa.substr(6,4)+aa.substr(0,2)+aa.substr(3,2);
	else
	{
		yr = aa.substr(6,2);
		if (parseInt(yr, 10) < 50)
			yr = "20" + yr;
		else
			yr = "19" + yr;
		dt1 = yr + aa.substr(3,2) + aa.substr(0,2);
	}

	if (bb.length == 10)
		dt2 = bb.substr(6,4)+ bb.substr(0,2) + bb.substr(3,2);
	else
	{
		yr = bb.substr(6,2);
		if (parseInt(yr, 10) < 50)
			yr = "20" + yr;
		else
			yr = "19" + yr;
		dt2 = yr + bb.substr(3,2) + bb.substr(0,2);
	}

	if (dt1 == dt2)
		return 0;
	if (Number(dt1) < Number(dt2))
		return -1;
    return 1;
}
//-----------------------------------------------------------------------------
// NOTE: sort methods cannot use "this" reference -----------------------------
TableBuilderObject.prototype.sortCurrency = function(a, b)
{
	var aa = TableBuilderObject.getInnerText(a.cells[sortColumnIdx]).replace(/[^0-9.]/g,'');
	var bb = TableBuilderObject.getInnerText(b.cells[sortColumnIdx]).replace(/[^0-9.]/g,'');
	return parseFloat(aa) - parseFloat(bb);
}
//-----------------------------------------------------------------------------
// NOTE: sort methods cannot use "this" reference -----------------------------
TableBuilderObject.prototype.sortNumeric = function(a, b)
{
	var aa = parseFloat(TableBuilderObject.getInnerText(a.cells[sortColumnIdx]));
	if (isNaN(aa))
		aa = 0;
	var bb = parseFloat(TableBuilderObject.getInnerText(b.cells[sortColumnIdx]));
	if (isNaN(bb))
		bb = 0;
	return aa-bb;
}
//-----------------------------------------------------------------------------
// NOTE: sort methods cannot use "this" reference -----------------------------
TableBuilderObject.prototype.sortCaseInsensitive = function(a, b)
{
	var aa = TableBuilderObject.getInnerText(a.cells[sortColumnIdx]).toLowerCase();
	var bb = TableBuilderObject.getInnerText(b.cells[sortColumnIdx]).toLowerCase();
	if (aa == bb)
		return 0;
	if (aa < bb)
		return -1;
	return 1;
}
//-----------------------------------------------------------------------------
// NOTE: sort methods cannot use "this" reference -----------------------------
TableBuilderObject.prototype.sortDefault = function(a, b)
{
	var aa = TableBuilderObject.getInnerText(a.cells[sortColumnIdx]);
	var bb = TableBuilderObject.getInnerText(b.cells[sortColumnIdx]);
	if (aa == bb)
		return 0;
	if (aa < bb)
		return -1;
	return 1;
}
