/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/objects/table.js,v 1.14.2.10.4.3.14.1.2.4 2012/08/08 12:37:30 jomeli Exp $ */
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

function Table(htmDoc, parent, reference, xmlSource)
{
	this.htmDoc = htmDoc;
	this.parent = parent;
	this.reference = reference;
	this.oBrowser = this.getBrowser();
	this.oColumns = new Array();
	this.oColumnsSorted = new Array();
	this.currentRowIndex = -1;
	this.oRows = new Array();
	this.oRowsSorted = new Array();	
	this.checkedRows = 0;
	this.title = "";
	this.height = 200;
	this.isMultipleSelect = false;	
	this.rowSelectChange = "";
	this.userAttributes = new Array();
	
	/* CLASSNAMES   MAKE SURE ALL THESE ARE USED WITHIN THE TABLE,column or ROw OBJECT*/
	this.title_className = "TABLE_TITLE";
	this.header_className = "TABLE_HEADER_TABLE";
	this.content_className = "TABLE_CONTENT_TABLE";
	this.checkBoxShow_className = "TABLE_CHECKBOX_SHOW";
	this.checkBoxHide_className = "TABLE_CHECKBOX_HIDE"
	this.data_className = "TABLE_DATA";
	this.dataHighlight_className = "TABLE_DATA_HIGHLIGHT";
	this.row_className = "TABLE_ROW";
	this.rowHighlight_className = "TABLE_ROW_HIGHLIGHT";
	this.rowSelected_className = "TABLE_ROW_SELECTED";
	this.rowHide_className = "TABLE_ROW_HIDE";
	this.cell_className = "TABLE_CELL";
	this.label_className = "TABLE_LABEL";
	this.resizeCell_className = "TABLE_SPLITBAR";
	this.cellHide_className = "TABLE_CELL_HIDE";
	this.hide_className = "TABLE_HIDE";
	this.contentshell_className =  "TABLE_CONTENT";
	
	if(!this.isValidArguments())
		return null;
	
	this.initialize(xmlSource);	
	return this
}
/**********************  PRIVATE METHODS **********************/
Table.prototype.isValidArguments=function()
{
	if(typeof(this.htmDoc) != "object")
		return false;
		
	if(typeof(this.parent) != "object")
		return false;
		
	if(typeof(this.reference) != "string")
		return false;
	
	return true;
}
/*============================================================*/
Table.prototype.initialize=function(xmlSource)
{
	this.initializeAttributes(xmlSource);
	this.buildShell();	
	this.buildTable(xmlSource);
}
/*============================================================*/
Table.prototype.initializeAttributes=function(xmlSource)
{
	try{
		var attributes = xmlSource.getElementsByTagName("TABLE")[0].attributes;
		
	}catch(e){return}
	
	
	if(!attributes)
		return;
		
	var loop = attributes.length;
	var name = null;
	var value = null;
	
	for(var i=0;i<loop;i++)
	{
		name = attributes[i].nodeName.toLowerCase();
		value = attributes[i].nodeValue;
		
		switch (name)
		{
			case "title":
				this.title = value;
				break;
			case "height":
				value = parseFloat(value);
				if(!isNaN(value) && value > 0)
					this.height = parseFloat(value);
				break;
			case "width":
				if(!isNaN(value) && value > 0)
					this.width = parseFloat(value);
				break;
			case "ismultipleselect":
				if(value == "true")
					this.isMultipleSelect = true;
				break;
			case "rowselectchange":
				this.rowSelectChange = value;
			default:
				this.userAttributes[name] = value;				
		}	
	}
}
/*============================================================*/
Table.prototype.buildShell=function()
{
	var shell = null;
	var titleShell = null;
	var title = "";
	var txt = null;
	var headerShell = null;
	var headerTbl = null;
	var contentShell = null;	
	var contentTbl = null;
	
	this.removeShell();
	
	shell = this.htmDoc.createElement("div");
	shell.id = this.reference + "_shell";
		
	titleShell = this.htmDoc.createElement("div");
	titleShell.id = this.reference + "_title";
	titleShell.className = this.title_className;
	title = this.getTitle();
	txt = this.htmDoc.createTextNode(title);
		
	headerShell = this.htmDoc.createElement("div");
	headerShell.id = this.reference + "_header";
	headerTbl = this.buildHeaderTbl();
	
	contentShell = this.htmDoc.createElement("div");
	contentShell.id = this.reference + "_content";
	contentShell.style.height = this.getHeight(); 
	contentShell.style.overflow = "auto";
	contentShell.className = this.contentshell_className;	
	contentTbl = this.buildContentTbl();

	this.parent.appendChild(shell);	
	shell.appendChild(titleShell);
	titleShell.appendChild(txt);
	shell.appendChild(headerShell);
	shell.appendChild(contentShell);
	headerShell.appendChild(headerTbl);
	contentShell.appendChild(contentTbl);
}
/*============================================================*/
Table.prototype.buildHeaderTbl=function()
{
	var tbl = null;
	var tblBody = null;
	var row = null;
	var cell = null;
	
	tbl = this.htmDoc.createElement("table");
	tbl.id = this.reference + "_headerTable";
	tbl.className = this.header_className;
	tbl.cellPadding = "0";
	tbl.cellSpacing = "0";
	tbl.border = "0";
	tbl.style.tableLayout = "fixed";
	tblBody = this.htmDoc.createElement("tbody");
	tblBody.id =  this.reference + "_headerBody";
	row = this.htmDoc.createElement("tr");
	row.id = this.reference + "_headerTableRow";
	/* CHECKBOX COLUMN */
	cell = this.htmDoc.createElement("td");
	cell.id = this.reference + "_cbox_cell"
	cell.setAttribute("name",this.reference + "_cbox_cell");
	cell.width = "20px";		
	input = this.htmDoc.createElement("input");
	input.id = this.reference +"_checkBoxToggle";
	input.name = this.reference +"_checkBoxToggle";
	input.type = "checkbox";
	input.value = "EMMA";
	input.tblRef = this.reference;
	input.className = this.isMultipleSelect ? this.checkBoxShow_className : this.checkBoxHide_className;
	input.onclick = this.toggleSelect;

	tbl.appendChild(tblBody);
	tblBody.appendChild(row);
	row.appendChild(cell);	
	cell.appendChild(input);

	return tbl;
}
/*============================================================*/
Table.prototype.buildContentTbl=function()
{
	var tbl = null;
	
	tbl = this.htmDoc.createElement("table");
	tbl.id = this.reference + "_contentTable";
	tbl.className = this.content_className;
	tbl.cellPadding = "0";
	tbl.cellSpacing = "0";
	tbl.border = "0";
	tbl.style.tableLayout = "fixed";
	tbl.onkeydown = this.keyHandler;
	tbl.tblRef = this.reference;	
	tblBody = this.htmDoc.createElement("tbody");
	tblBody.id =  this.reference + "_contentBody";

	tbl.appendChild(tblBody);
	return tbl;
}
/*============================================================*/
Table.prototype.buildTable=function(xmlSource)
{
	var columnNodes = null;
	var colLoop = 0;
	var rowNodes = null;
	var rowLoop = 0;

	columnNodes = xmlSource.getElementsByTagName("COLUMN");
	
	if(!columnNodes)
		return;
	
	colLoop = columnNodes.length
	
	for(var i=0;i<colLoop;i++)
		this.addColumn(columnNodes[i]);
	
	rowNodes = xmlSource.getElementsByTagName("ROW");
	
	if(!rowNodes)
		return;
		
	rowLoop = rowNodes.length;
	
	for(var i=0;i<rowLoop;i++)
		this.addRow(rowNodes[i]);
}
/*============================================================*/
Table.prototype.getBrowser=function()
{
	var oBrowser = new Object;	
	var ua, an, s, i;
	oBrowser.isIE    = false;
	oBrowser.isNS    = false;
	oBrowser.isMAC   = false;
	oBrowser.isWIN   = false;
	oBrowser.version = null;

	ua = navigator.userAgent;
	an = navigator.appName;

	if (ua.indexOf("Windows") >= 0)
		oBrowser.isWIN = true;
	else if (ua.indexOf("Macintosh") >= 0)
		oBrowser.isMAC = true;

	if (an == "Microsoft Internet Explorer")
	{
		s = "MSIE";
		i = ua.indexOf(s)
		oBrowser.isIE = true;
		oBrowser.version = parseFloat(ua.substr(i + s.length));
	}

	if (an == "Netscape")
	{
		oBrowser.isNS = true;
		oBrowser.version = parseFloat(navigator.vendorSub);
	}
	
	return oBrowser;
}
/*============================================================*/
/**********************  PUBLIC METHODS ***********************/
Table.prototype.getRowById=function(id)
{
	if(typeof(id) != "number" || id < 0 || id > this.oRows.length)
		return null;
	
	return this.oRows[id];	
}
/*============================================================*/
Table.prototype.getCurrentRow=function()
{
	if(this.currentRowIndex == -1)
		return null;
		
	var rowId = this.oRowsSorted[this.currentRowIndex];
	return this.oRows[rowId];
}
/*============================================================*/
Table.prototype.getFirstRow=function()
{
	var id = null;
	var oRow = null;
	var loop = this.oRowsSorted.length;
	
	for(var i=0;i<loop;i++)
	{
		id = this.oRowsSorted[i];
		oRow = this.oRows[id];
		
		if(oRow.isVisible)
			return oRow;	
	}

	return null;	
}
/*============================================================*/
Table.prototype.getLastRow=function()
{
	var id = null;
	var oRow = null;
	var end = (this.oRowsSorted.length - 1);
	
	for(var i=end;i>0;i--)
	{
		id = this.oRowsSorted[i];
		oRow = this.oRows[id];
		
		if(oRow.isVisible)
			return oRow;	
	}
	
	return null;	
}
/*============================================================*/
Table.prototype.getNextRow=function()
{
	var start = (this.currentRowIndex + 1);
	var id = null;
	var oRow = null;
	var loop = this.oRowsSorted.length;
	
	for(var i=start;i<loop;i++)
	{
		id = this.oRowsSorted[i];
		oRow = this.oRows[id];
		
		if(oRow.isVisible)
			return oRow;	
	}
	
	return null;	
}
/*============================================================*/
Table.prototype.getPreviousRow=function()
{
	var id = null;
	var oRow = null;
	var start = (this.currentRowIndex - 1);
	
	for(var i=start;i>-1;i--)
	{
		id = this.oRowsSorted[i];
		oRow = this.oRows[id];
		
		if(oRow.isVisible)
			return oRow;	
	}
	
	return null;	
}
/*============================================================*/
Table.prototype.setCurrentRow=function(oNewRow)
{
	var oTable = this;
	var oOldRow = null;
	var identity = null;
	var cell = null;
	var div = null;
	var input = null;
	var anchor = null;

	/* TRIGGERED BY AN EVENT - row.onclick */
	if((typeof(oNewRow)=="undefined") || 
		(typeof(oNewRow) == "object" && typeof(oNewRow.tblId) == "undefined"))
	{
		var rowId = this.r;
		oTable = eval(this.tblRef);
		oNewRow = oTable.getRowById(rowId);
	}

	if(!oNewRow)
	{
		eval(oTable.rowSelectChange)
		return false;
	}

	oOldRow = oTable.getCurrentRow();

	if(oOldRow)
		oOldRow.highlight(false);
		
	oNewRow.highlight(true);
	
	oTable.currentRowIndex = (oTable.getRowPosition(oNewRow.id) - 1);	

	identity = oNewRow.htmId + "_cbox";
	div = oTable.htmDoc.getElementById(identity);
	input = div.firstChild;
			
	if(oTable.isMultipleSelect && !input.disabled)
	{
		try{input.focus();}catch(e){}
		eval(oTable.rowSelectChange)
		return true;
	}

	try{
		identity = oNewRow.htmId + "_anchor";
		anchor = oTable.htmDoc.getElementById(identity);;
		anchor.focus();
	
	}catch(e){};
	
	eval(oTable.rowSelectChange);
	return true;
}
Table.prototype.setOnRowSelect=function(func)
{
	this.rowSelectChange = func;
}
/*============================================================*/
Table.prototype.getSelectedRows=function()
{
	if(!this.isMultipleSelect)
		return false;
		
	var identity = this.reference + "_checkBox";
	var index = 0;
	var returnAry = new Array();
	var rowId = null;
	var inputs = this.htmDoc.getElementsByName(identity);
	var loop = inputs.length;
			
	for (var i=0; i<loop; i++)
	{
		if(inputs[i].checked)
		{
			rowId = inputs[i].r;
			returnAry[index] = this.getRowById(rowId);;
			index ++;
		}
	}
	return returnAry;
}
/*============================================================*/
Table.prototype.enableMultipleSelect=function(enable)
{
	if((typeof(enable) != "boolean") || (enable == this.isMulipleSelect))
		return false;

	var identity = this.reference + "_checkBox"; 		
	var inputs = this.htmDoc.getElementsByName(identity);
	var loop = inputs.length;
		
	for (var i=0; i<loop; i++)
	{
		inputs[i].checked = false;
		inputs[i].className = enable ? this.checkBoxShow_className : this.checkBoxHide_className;
	}
	
	this.isMultipleSelect = enable;
}
/*============================================================*/
Table.prototype.getUnselectedRows=function()
{
	if(!this.isMultipleSelect)
		return false;
		
	var identity = this.reference + "_checkBox";
	var index = 0;
	var returnAry = new Array();
	var rowId = null;
	var inputs = this.htmDoc.getElementsByName(identity);
	var loop = inputs.length;
			
	for (var i=0;i<loop;i++)
	{
		if(!inputs[i].checked)
		{
			rowId = inputs[i].r;
			returnAry[index] = this.getRowById(rowId);
			index ++;
		}
	}
	return returnAry;
}
/*============================================================*/
Table.prototype.checkSelectAll=function(checked)
{
	checked = (typeof(checked) != "boolean" ? true : checked);

	var toggleSelectElm = this.htmDoc.getElementById(this.reference +"_checkBoxToggle");
	
	if(!toggleSelectElm)
		return false;
	
	toggleSelectElm.checked = checked;
		
	return true;
}
/*============================================================*/
Table.prototype.toggleSelect=function()
{
	var oTable = eval(this.tblRef);
	var toggleSelectElm = oTable.htmDoc.getElementById(oTable.reference +"_checkBoxToggle");
	
	if(!toggleSelectElm)
		return false;
	
	if(toggleSelectElm.checked)
		oTable.selectAll();
	else
		oTable.unSelectAll();
		
	return true;
}
/*============================================================*/
Table.prototype.selectAll=function()
{
	if(!this.isMultipleSelect)
		return false;
		
	var identity = this.reference + "_checkBox";	
	var inputs = this.htmDoc.getElementsByName(identity);
	var loop = inputs.length;
			
	for (var i=0; i<loop; i++)
	{
		if(inputs[i].disabled)
			continue;
			
		inputs[i].checked=true;
		this.checkedRows ++;
	}
	
	eval(this.rowSelectChange);
}
/*============================================================*/
Table.prototype.unSelectAll=function()
{
	if(!this.isMultipleSelect)
		return false;
		
	var identity = this.reference + "_checkBox";	
	var inputs = this.htmDoc.getElementsByName(identity);
	var loop = inputs.length;
			
	for (var i=0; i<loop; i++)
	{
		if(inputs[i].disabled)
			continue;
			
		inputs[i].checked=false;
		this.checkedRows --;
	}
	
	eval(this.rowSelectChange);
}
/*============================================================*/
Table.prototype.invertSelections=function()
{
	if(!this.isMultipleSelect)
		return;
		
	var identity = this.reference + "_checkBox";	
	var inputs = this.htmDoc.getElementsByName(identity);
	var loop = inputs.length;
			
	for (var i=0; i<loop; i++)
	{
		if(inputs[i].disabled)
			continue;
			
		inputs[i].checked = (inputs[i].checked ? false : true)	
	}
	
	eval(this.rowSelectChange);
}
/*============================================================*/
Table.prototype.getTitle=function()
{
	return this.title;
}
/*============================================================*/
Table.prototype.setTitle=function(title)
{
	if(typeof(title) != "string")
		return false;

	var titleShell = this.htmDoc.getElementById(this.reference + "_title");
	
	if(titleShell.firstChild) 
		titleShell.firstChild.nodeValue=title;
	
	this.title = title;	
	return true;
}
/*============================================================*/
Table.prototype.showTitle=function(show)
{
	if(typeof(show) != "boolean")
		return false

	var titleShell = this.htmDoc.getElementById(this.reference + "_title");
	
	if(titleShell)
	{
		titleShell.style.visibility = (show ? "visible" :"hidden");
		titleShell.style.display = (show ? "block" :"none");
		return true;
	}
	
	return false;
}
/*============================================================*/
Table.prototype.showHeader=function(show)
{
	if(typeof(show) != "boolean")
		return false
		
	var headerShell = this.htmDoc.getElementById(this.reference + "_header");
	
	if(headerShell)
	{
		headerShell.style.visibility = (show ? "visible" :"hidden");
		headerShell.style.display = (show ? "block" :"none");
		return true;
	}

	return false;
}
/*============================================================*/
Table.prototype.showTable=function(show)
{
	if(typeof(show) != "boolean")
		return false
		
	var contentShell = this.htmDoc.getElementById(this.reference + "_content");
	
	if(contentShell)
	{
		contentShell.style.visibility = (show ? "visible" :"hidden");
		contentShell.style.display = (show ? "block" :"none");
		return true;
	}

	return false;
}
/*============================================================*/
Table.prototype.clearTable=function()
{
	var table = this.htmDoc.getElementById(this.reference + "_contentTable");
	table.rows.length;
	
	for(var i=table.rows.length; i>0; i--)
		table.deleteRow(i-1);
		
	this.oRows.length = 0;
	this.oRowsSorted.length = 0;
	this.currentRowIndex = -1;
	this.checkedRows = 0
	
	if(this.isMultipleSelect)
		this.checkSelectAll(false);

	return true;

}
/*============================================================*/
Table.prototype.getUserAttribute=function(attribute)
{
	if(typeof(attribute) != "string")
		return null;
		
	attribute = attribute.toLowerCase();	
	return this.userAttributes[attribute];
}
/*============================================================*/
Table.prototype.setUserAttribute=function(attribute, value)
{
	if(typeof(attribute) != "string" || typeof(value) == "undefined")
		return false;
		
	attribute = attribute.toLowerCase();
	this.userAttributes[attribute] = value;	
	return true;
}
/*============================================================*/
Table.prototype.getHeight=function()
{
	return this.height;
}
/*============================================================*/
Table.prototype.setHeight=function(height)
{
	height = parseFloat(height);

	if(isNaN(height))
		return false;
	
	if(height < 1)
		return false;
		
	var contentShell = this.htmDoc.getElementById(this.reference + "_content");
	contentShell.style.height = height; 	
	this.height = height;
	return true;
}
/*============================================================*/
Table.prototype.removeShell=function()
{
	var shell = this.parent.firstChild;
	
	if(!shell)
		return false;
		
	this.parent.removeChild(shell);
	return true;
}
/*============================================================*/
Table.prototype.addColumn=function(columnNode)
{
	if(typeof(columnNode) != "object")
		return null;
	
	var columnIndex = this.oColumnsSorted.length;
	var row = null;
	var loop = this.oRowsSorted.length;
	var value = "";	
	var oColumn = new Column(this, columnNode);

	for(var i=0;i<loop;i++)
	{
		row = this.htmDoc.getElementById(this.oRows[i].htmId);
		this.oRows[i].addCell(row, oColumn, value);
	}
	
	this.oColumns[oColumn.id] = oColumn;
	this.oColumnsSorted[columnIndex] = oColumn.id;
	return oColumn;
}
/*============================================================*/
Table.prototype.addRow=function(rowNode, title)
{
	if(typeof(rowNode) != "object")
		return null;

	var rowIndex = this.oRowsSorted.length;
	var oRow = new Row(this, rowNode, title);
	
	this.oRows[oRow.id] = oRow;
	this.oRowsSorted[rowIndex] = oRow.id;

	return oRow;
}
/*============================================================*/
Table.prototype.editCellText=function(rowId, colId, value)
{
	if((typeof(rowId) != "number") || (typeof(colId) != "number") || (typeof(value) != "string"))
		return false;
		
	var cell = this.htmDoc.getElementById(this.reference + "_r"+ rowId + "c"+ colId);
	
	if(!cell)
		return false;
	
	var div = cell.firstChild;
	var txt = div.firstChild;
	
	div.title = value;
	txt.nodeValue = value;

	return true;
}
/*============================================================*/
Table.prototype.getColumnPosition=function(id)
{
	var loop = this.oColumnsSorted.length;
	
	for(var i=0;i<loop;i++)
	{
		if(id == this.oColumnsSorted[i])
			return (i + 1);
	}
	
	return -1;
}
/*============================================================*/
Table.prototype.getColumnById=function(id)
{
	if((typeof(id) != "number") || (id < 0) || (id > this.oColumns.length))
		return null;
	
	return this.oColumns[id];	
}
/*============================================================*/
Table.prototype.getColumnByPosition=function(pos)
{
	if((typeof(pos) != "number") || (pos < 1) || (pos > this.oColumnsSorted.length))
		return null;
	
	var id = this.oColumnsSorted[pos - 1];
	return this.oColumns[id];
}
/*============================================================*/
Table.prototype.getRowPosition=function(id)
{
	var loop = this.oRowsSorted.length;
	
	for(var i=0;i<loop;i++)
	{
		if(id == this.oRowsSorted[i])
			return (i + 1);
	}
	
	return null;
}
/*============================================================*/
Table.prototype.getRowByKey=function(key)
{
	if(typeof(key) == "undefined")
		return null;
	
	var loop = this.oRows.length;
	
	for(var i=0;i<loop;i++)
	{
		if(this.oRows[i].key == key)
			return this.oRows[i]	
	}
	
	return null;	
}
/*============================================================*/
Table.prototype.getRowByPosition=function(pos)
{
	if((typeof(pos) != "number") || (pos < 1) || (pos > this.oRowsSorted.length))
		return null;
	
	var id = this.oRowsSorted[pos - 1];
	return this.oRows[id];
}
/*============================================================*/
Table.prototype.getCurrentRowNbr=function()
{
	return (this.currentRowIndex + 1);
}
/*============================================================*/
Table.prototype.highlightCell=function(rowId, colId, highlight)
{
	if((typeof(rowId) != "number") || (typeof(colId) != "number") || (typeof(highlight) != "boolean"))
		return false;
	
	var cell = this.htmDoc.getElementById(this.reference + "_r"+ rowId + "c"+ colId);
	
	if(!cell.firstChild)
		return false;
		
	cell.firstChild.className = highlight ? this.dataHighlight_className : this.data_className;
	return true;
}
/*============================================================*/
Table.prototype.showRow=function(oRow, show)
{
	if(typeof(oRow) != "object")
		return false;
	
	if((typeof(show) != "boolean") || (oRow.isVisible == show))
		return false;
		
	var row = this.htmDoc.getElementById(oRow.htmId);
	var div = null;
	var id = this.oRowsSorted[this.currentRowIndex];
	
	if(!row)
		return false;

	row.className = show ? this.row_className : this.rowHide_className;
	oRow.isVisible = show;

	div = this.htmDoc.getElementById(oRow.htmId + "_cbox");
	
	if(div && div.firstChild)
		div.firstChild.checked = false;

	if(!show && id == oRow.id)
		this.currentRowIndex = -1;

	return true;
}
/*============================================================*/
Table.prototype.removeRow=function(oRow)
{
	if((typeof(oRow) != "object") || (oRow == null))
		return false;
		
	var tbl = this.htmDoc.getElementById(this.reference + "_contentTable");
	var row = this.htmDoc.getElementById(oRow.htmId);
	var pos = this.getRowPosition(oRow.id);
	
	if(!tbl || !row || (pos == null))
		return false;
		
	var currentRowId = this.oRowsSorted[this.currentRowIndex];
	var rowIndex = (pos - 1);
		
	tbl.firstChild.removeChild(row);
	this.oRows[oRow.id] = null;
	this.oRowsSorted.splice((rowIndex),1);
	
	if(currentRowId == oRow.id)
		this.currentRowIndex = -1;

	return true
}
/*============================================================*/
Table.prototype.showColumn=function(oColumn, show)
{
	if(typeof(oColumn) != "object")
		return false;
		
	if((typeof(show) != "boolean") || (oColumn.isVisible == show))
		return false;

	var divs = this.htmDoc.getElementsByName(oColumn.htmId + "_div");
	var loop = divs.length;
	var cell = null;

	for(var i=0;i<loop;i++)
	{
		divs[i].style.visibility = (show ? "visible" :"hidden");
		divs[i].style.display = (show ? "block" :"none");
		cell = divs[i].parentNode;
		cell.style.visibility = (show ? "visible" :"hidden");
		cell.style.display = (show ? "block" :"none");
	}	

	oColumn.isVisible = show;
	this.resizeTable();
	return true;		
}
/*============================================================*/
Table.prototype.removeColumn=function(oColumn)
{
	if((typeof(oColumn) != "object") || (oColumn==null))
		return false;	

	var position = this.getColumnPosition(oColumn.id);
	var colIndex = (position - 1)
	var divs = this.htmDoc.getElementsByName(oColumn.htmId + "_div");
	var start = (divs.length - 1);
	var row = null;
	var cell = null;

	for(var i=start;i>-1;i--)
	{
		cell = divs[i].parentNode;
		row = cell.parentNode;
		row.removeChild(cell);
	}

	this.oColumns[this.id] = null;
	this.oColumnsSorted.splice((colIndex),1)	
	this.resizeTable();
	return true
}
/*============================================================*/
Table.prototype.resizeTable=function(height)
{
	var loop = this.oColumnsSorted.length;
	var id = null;
	var oColumn = null;
	var width = 0;
	var shell = this.htmDoc.getElementById(this.reference + "_shell");
	var contentShell = this.htmDoc.getElementById(this.reference + "_content");
	
	for(var i=0;i<loop;i++)
	{
		id = this.oColumnsSorted[i];
		oColumn = this.oColumns[id];
		width += (oColumn.isVisible ? oColumn.width : 0 )
	}
	
	shell.style.width = width + 20;
	
	if(typeof(height) == "number" && height > 0 )
	{
		this.height = height;
		contentShell.style.height = height;
	}
	
}
/*============================================================*/
Table.prototype.keyHandler=function(evt)
{
	var oTable = eval(this.tblRef);
	var evtCaught = false;
	var keyVal = null;
	
	if (oTable.oBrowser.isIE)
		evt = window.event;
	if (!evt) return false;
	
	keyVal = (oTable.oBrowser.isIE ? evt.keyCode : evt.charCode);

    if (evt && evt.target)
        var elem = (evt.target.nodeType == 3) ? evt.target.parentNode : evt.target;
    else if (evt)
        var elem = evt.srcElement;
	
	/* NETSCAPE ONLY */
	if (keyVal == 0)
		keyVal = evt.keyCode;

	if(((keyVal>=65 && keyVal<=90)|| (keyVal>=48 && keyVal<=57))&&
		(!evt.altKey && !evt.ctrlKey && !evt.shiftKey))
	{
		oTable.findRowByCharacter(String.fromCharCode(keyVal));
		
		if (oTable.oBrowser.isIE)
		{
			evt.cancelBubble=true;
			evt.returnValue=false;
			evt.keyCode = 0
		}
		else
		{
			evt.cancelBubble=true;
			evt.preventDefault();
			evt.stopPropagation();
		}
		return;
	}

	switch(keyVal)
	{
		case 13: //ENTER
			if(!evt.altKey && !evt.ctrlKey && !evt.shiftKey)
			{
				var oRow = oTable.getRowById(elem.r);
				oTable.setCurrentRow(oRow);
				var row = oTable.htmDoc.getElementById(oRow.htmId)
				row.ondblclick(oRow);
				evtCaught = true;
			}
			break;	
		case 33://PAGE UP
			if(!evt.altKey && !evt.ctrlKey && !evt.shiftKey)
			{
				oTable.pageUp();
				evtCaught = true;
			}
			break;
		case 34://PAGE DOWN
			if(!evt.altKey && !evt.ctrlKey && !evt.shiftKey)
			{
				oTable.pageDown();
				evtCaught = true;
			}
			break				
		case 35://END OF LIST (end)
			if(!evt.altKey && !evt.ctrlKey && !evt.shiftKey)
			{
				var oRow = oTable.getLastRow();
				if(oRow)
					oTable.setCurrentRow(oRow)
				evtCaught = true;
			}
			break;			
		case 36://BEGINNING OF LIST (home)
			if(!evt.altKey && !evt.ctrlKey && !evt.shiftKey)
			{
				var oRow = oTable.getFirstRow();
				if(oRow)
					oTable.setCurrentRow(oRow)
				evtCaught = true;
			}
			break;		
		case 38://PREVIOUS ROW (up arrow)
			if(!evt.altKey && !evt.ctrlKey && !evt.shiftKey)
			{
				var oRow = oTable.getPreviousRow()
				if(oRow)
					oTable.setCurrentRow(oRow);
				evtCaught = true;
			}
			break;	
		case 40://NEXT ROW (down arrow)
			if(!evt.altKey && !evt.ctrlKey && !evt.shiftKey)
			{
				var oRow = oTable.getNextRow()
				if(oRow)
					oTable.setCurrentRow(oRow);
				evtCaught = true;
			}
			break;	
		case 65://SELECT ALL
			if(!evt.altKey && evt.ctrlKey && !evt.shiftKey)
			{
				oTable.selectAll();
				evtCaught = true;
			}
			break;
	}
		
	if (evtCaught)
	{
		if (oTable.oBrowser.isIE)
		{
			evt.cancelBubble=true;
			evt.returnValue=false;
			evt.keyCode = 0
		}
		else
		{
			evt.cancelBubble=true;
			evt.preventDefault();
			evt.stopPropagation();
		}
	}
}
Table.prototype.pageUp=function()
{
	var contentShell = this.htmDoc.getElementById(this.reference + "_content");
	var oRow = null;
	var rowsPerPage = 0;
	
	if(contentShell.scrollHeight < this.height)
		return true;
		
	try{
		rowsPerPage = Math.round(this.height/20);
	}catch(e){}
	
	oRow = this.getRowByPosition(this.currentRowIndex - (rowsPerPage - 2));
	
	if(oRow)
	{
		this.setCurrentRow(oRow);
		contentShell.scrollTop = this.currentRowIndex * 20;
	}
	else
	{
		oRow = this.getFirstRow();
		this.setCurrentRow(oRow);
	}
	
	return true;
}
Table.prototype.pageDown=function()
{
	var contentShell = this.htmDoc.getElementById(this.reference + "_content");
	var oRow = null;
	var rowsPerPage = 0;
	
	if(contentShell.scrollHeight < this.height)
		return true;
	
	try{
		rowsPerPage = Math.round(this.height/20);
	}catch(e){}
	
	oRow = this.getRowByPosition(this.currentRowIndex + rowsPerPage);
	
	if(oRow)
	{
		this.setCurrentRow(oRow);
		contentShell.scrollTop = this.currentRowIndex * 20;
	}
	else
	{
		oRow = this.getLastRow();
		this.setCurrentRow(oRow);
	}
	
	return true;
}
Table.prototype.findRowByCharacter=function(value1)
{//Pass in columnId or use this.currentColumnId and create a setCurrentColumn()
	var start = (this.currentRowIndex + 1);
	var end = this.oRowsSorted.length;
	var oRow = null;
	var rowId = null;
	var columnId = this.oColumnsSorted[0];
	var identity = null;
	var cell = null;
	var value2 = null;
	
	/* SEARCH DOWN */
	for(var i=start;i<end;i++)
	{
		rowId = this.oRowsSorted[i];
		
		identity = this.reference + "_r"+ rowId + "c"+ columnId;
		cell = this.htmDoc.getElementById(identity);
		
		if(!cell || !cell.firstChild || !cell.firstChild.firstChild)
			value2 = "";
		else
			value2 = cell.firstChild.firstChild.nodeValue;
		
		value2 = value2.substring(0,1);
	
		if(value1.toLowerCase()==value2.toLowerCase())
		{
			oRow = this.getRowById(rowId);
			if(oRow && oRow.isVisible)
			{
				this.setCurrentRow(oRow);
				return;
			}
		}
	}
	
	/* WRAP SEARCH */	
	for(var i=0;i<start;i++)
	{
		rowId = this.oRowsSorted[i];
		
		identity = this.reference + "_r"+ rowId + "c"+ columnId;
		cell = this.htmDoc.getElementById(identity);
		
		if(!cell || !cell.firstChild || !cell.firstChild.firstChild)
			value2 = "";
		else	
			value2 = cell.firstChild.firstChild.nodeValue;
		
		value2 = value2.substring(0,1);
		
		if(value1.toLowerCase()==value2.toLowerCase())
		{
			oRow = this.getRowById(rowId);
			if(oRow && oRow.isVisible)
			{
				this.setCurrentRow(oRow);
				return;
			}
		}
	}
}
function Row(oTable, rowNode, title)
{
	this.htmDoc = oTable.htmDoc
	this.tblId = oTable.reference;
	this.id = oTable.oRows.length;
	this.htmId = this.tblId + "_r" + this.id;
	this.inputControl = null;
	
	//PT 176487
	if (title)
		this.title = title;
		
	this.isVisible = true;
	this.key = null;
	this.onDblClickFunc = null;
	this.userAttributes = new Array();
	
	/* CLASSNAMES */
	this.row_className = oTable.row_className;
	this.rowHighlight_className = oTable.rowHighlight_className;
	this.rowSelected_className = oTable.rowSelected_className;
	this.cell_className = oTable.cell_className;
	this.data_className = oTable.data_className;
	
	this.initializeAttributes(rowNode);
	this.buildRow(rowNode, oTable);

	return this;
}
/**********************  PRIVATE METHODS **********************/
Row.prototype.initializeAttributes=function(rowNode)
{
	if(rowNode.nodeName == "#document")
		var attributes = rowNode.getElementsByTagName("ROW")[0].attributes;
	else
		var attributes = rowNode.attributes;	
	
	if(!attributes)
		return;

	var loop = attributes.length;
	var name = null;
	var value = null;
	
	for(var i=0;i<loop;i++)
	{
		name = attributes[i].nodeName;
		name = name.toLowerCase();
		value = attributes[i].nodeValue;

		switch (name)
		{
			case "key":
				this.key = value;
				break;
			default:
				this.userAttributes[name] = value;				
		}	
	}
}
/*============================================================*/
Row.prototype.buildRow=function(rowNode,oTable)
{
	var nbrOfColumns = oTable.oColumnsSorted.length
	var tblBody = this.htmDoc.getElementById(this.tblId + "_contentBody");
	var row = null;
	var cell = null;
	var anchor = null;
	var div = null;
	var input = null;
	var txt = null;
	var dataNodes = rowNode.getElementsByTagName("DATA");
	var colId = null;
	var oColumn =null;
	var img = null;

	row = this.htmDoc.createElement("tr");	
	row.id = this.htmId;
	row.tblRef = this.tblId;
	row.r = this.id;
	row.onclick = oTable.setCurrentRow;
	row.ondblclick  = null;
	row.className = this.row_className;
	
	//PT 176487
	if (this.title)
		row.title = this.title;
		
	cell = this.htmDoc.createElement("td");
	cell.id = this.tblId + "_cbox_cell";
	cell.setAttribute("name",this.tblId + "_cbox_cell");
	cell.tblRef = this.tblId;
	cell.r = this.id;
	cell.c = 0;
	cell.width = "20px";
	cell.vAlign = "top"
	
	if(!oTable.isMultipleSelect)
	{
		anchor = this.htmDoc.createElement("button");
		anchor.id = this.htmId + "_anchor";
		anchor.tblRef = this.tblId;
		anchor.r = this.id;
		anchor.onclick = "javascript:void(0)";
		anchor.onfocus = this.rowFocus;
		anchor.onblur = this.rowBlur;
		anchor.setAttribute("hideFocus", "true");
		anchor.style.backgroundColor = "transparent";
		anchor.style.border = "none 0px transparent";
		var anchorValue = "&nbsp;"
		anchor.innerHTML = anchorValue;
		
		if(this.id != "0")
			anchor.tabIndex = -1;
	}
	
	div = this.htmDoc.createElement("span");
	div.id = this.htmId + "_cbox";
	div.tblRef = this.tblId;
	div.r = this.id;
	div.c = 0;
	input = this.htmDoc.createElement("input");
	input.id = this.tblId +"_checkBox";
	input.name = this.tblId +"_checkBox";
	input.type = "checkbox";
	input.value = "EMMA";
	input.tblRef = this.tblId;
	input.r = this.id;
	input.c = 0
	input.className = oTable.isMultipleSelect ? oTable.checkBoxShow_className : oTable.checkBoxHide_className;
	input.onfocus = this.rowFocus;
	input.onblur = this.rowBlur;
	input.onclick = this.rowChecked;
	this.inputControl = input;

	if (dataNodes.length == 7)
	{
		img = this.htmDoc.createElement("img");
		img.id = this.tblId + "_img";
		img.name = this.tblId + "_img";
		img.title = "Running";
		img.src = "../images/loader.gif";
		img.height = 20;
		img.width = 20;
	}

	tblBody.appendChild(row);
	row.appendChild(cell);
	cell.appendChild(div);
	
	if(!oTable.isMultipleSelect)
		cell.appendChild(anchor);
	
	if(img)
		div.appendChild(img);
	else
		div.appendChild(input);
	
	for(var i=0;i<nbrOfColumns;i++)
	{
		colId = oTable.oColumnsSorted[i];
		oColumn = oTable.oColumns[colId];
		value = dataNodes && dataNodes[i].firstChild ? dataNodes[i].firstChild.nodeValue : "";

		this.addCell(row, oColumn, value);			
	}
}

Table.prototype.runningJobs=function(jobStatus)
{
	var tblNobr = this.htmDoc.getElementsByTagName("NOBR")[0];
	var divCount = tblNobr.getElementsByTagName("DIV");
	var div = null;
	var img = null;
	var span = null;

	if ((jobStatus) && (divCount.length < 2))
	{
		div = this.htmDoc.createElement("div");
		div.id = "runningJobs";
		div.style.position ="absolute";
		div.style.top="15px";
		div.style.left="250px";

		img = this.htmDoc.createElement("img");
		img.id="loadImg";
		img.title="Re-Inquire to refresh page";
		img.style.left="40px";
		img.style.width="20px";
		img.style.height="20px";
		img.src="../images/loader.gif";

		span = this.htmDoc.createElement("span");
		span.id="lblRunningJob";
		span.title="Re-Inquire to refresh page";
		span.className = "label";
		span.style.top = "2px";
		span.style.left="30px";

		var text = this.htmDoc.createTextNode("Running Jobs");

		tblNobr.appendChild(div);
		div.appendChild(img);
		div.appendChild(span);
		span.appendChild(text);
	}
	else if (divCount[1])
		tblNobr.removeChild(divCount[1]);
}

Row.prototype.rowChecked=function()
{
	var rowId = this.r;
	var oTable = eval(this.tblRef);
	
	if(!oTable.isMultipleSelect)
		return;
	
	if(this.checked)
		oTable.checkedRows ++;
	else
		oTable.checkedRows --;
}

Row.prototype.rowFocus=function()
{
	var rowId = this.r;
	var oTable = eval(this.tblRef);
	var oRow = oTable.getCurrentRow()
	var row = oRow.htmDoc.getElementById(oRow.htmId);

	if(rowId == oTable.currentRowIndex || !oTable.isMultipleSelect)
		row.className = oRow.rowHighlight_className;
}

Row.prototype.rowBlur=function()
{ 
	var rowId = this.r;
	var oTable = eval(this.tblRef);
	var oRow = oTable.getCurrentRow()
	var row = oRow.htmDoc.getElementById(oRow.htmId);

	if(rowId == oTable.currentRowIndex || !oTable.isMultipleSelect)
		row.className = oRow.rowSelected_className;
}

/*============================================================*/
Row.prototype.addCell=function(row, oColumn, value)
{
	var colId = oColumn.id;
	var width = null;
	var dataAlign = null;
	var cell = null;
	var span = null;
	var txt = null;
	
	width = oColumn.getWidth();
	dataAlign = oColumn.dataAlign;
			
	cell = this.htmDoc.createElement("td");
	cell.id = this.tblId + "_r"+ this.id + "c"+ colId;;
	cell.tblRef = this.tblId;
	cell.r = this.id;
	cell.c = colId;
	cell.width = width;
	cell.align = dataAlign;
	cell.className = this.cell_className;		    
	span = this.htmDoc.createElement("span");
	span.id = oColumn.htmId + "_div";
	span.setAttribute("name",oColumn.htmId + "_div");
	span.tblRef = this.tblId;
	span.r = this.id;
	span.c = colId;
	span.style.whiteSpace = "nowrap";
	span.style.textOverflow = "ellipsis";
	span.title = value;
	span.style.width = width;
	span.className = this.data_className;
	span.style.textAlign = dataAlign;
	txt = this.htmDoc.createTextNode(value);

	row.appendChild(cell);
	cell.appendChild(span);
	span.appendChild(txt);
}
/*============================================================*/
/**********************  PUBLIC METHODS ***********************/
Row.prototype.isChecked=function()
{
	return this.inputControl.checked
}
/*============================================================*/
Row.prototype.setOnDblClickFunc=function(func)
{
	if(typeof(func) != "function" )
		return false;

	var row = this.htmDoc.getElementById(this.htmId);

	if(!row)
		return false;
		
	row.ondblclick = func;
	this.onDblClickFunc = func;
	return true;
}
/*============================================================*/
Row.prototype.removeOnDblClickFunc=function()
{
	var row = this.htmDoc.getElementById(this.htmId);
	
	if(!row)
		return false;
		
	row.ondblclick = null;
	this.onDblClickFunc = null;
	return true;
}
/*============================================================*/
Row.prototype.getUserAttribute=function(attribute)
{
	if(typeof(attribute) != "string")
		return null;
		
	attribute = attribute.toLowerCase();	
	return this.userAttributes[attribute];
}
/*============================================================*/
Row.prototype.setUserAttribute=function(attribute, value)
{
	if(typeof(attribute) != "string" || typeof(value) == "undefined")
		return false;
		
	attribute = attribute.toLowerCase();
	this.userAttributes[attribute] = value;	
	return true;
}
/*============================================================*/
Row.prototype.getKey=function(key)
{
	return this.key;
}
/*============================================================*/
Row.prototype.setKey=function(key)
{
	if(typeof(key) == "undefined")
		return false;
	
	this.key = key;
}
/*============================================================*/
Row.prototype.visible=function(key)
{
	return this.isVisible;
}
/*============================================================*/
Row.prototype.highlight=function(highlight)
{
	if(typeof(highlight) != "boolean")
		return false;
		
	var row = this.htmDoc.getElementById(this.htmId);
	
	if(!row)
		return false;
		
	row.className = highlight ? this.rowHighlight_className : this.row_className;
	return true;
}
/*============================================================*/
Row.prototype.shade=function(shade)
{
	if(typeof(shade) != "boolean")
		return false;
		
	var row = this.htmDoc.getElementById(this.htmId);
	
	if(!row)
		return false;
	
	if(row.className == this.rowHighlight_className)
		return;	

	row.className = shade ? this.rowSelected_className : this.row_className;
	return true;
}
/*============================================================*/
function Column(oTable, columnNode)
{
	this.htmDoc = oTable.htmDoc
	this.tblId = oTable.reference;
	this.id = oTable.oColumns.length;
	this.htmId = this.tblId + "_c" + this.id;
	this.onClickFunc = null;
	this.label = "";
	this.width = 100 ;
	this.labelAlign = "LEFT" ;
	this.dataAlign = "LEFT";
	this.isVisible = true;
	this.userAttributes = new Array();
	
	/* CLASSNAMES   MAKE SURE ALL THESE ARE USED WITHIN THE COLUMN OBJECT and then inherit it from the table object*/
	this.cell_className = oTable.cell_className;
	this.label_className = oTable.label_className;
	this.data_className = oTable.data_className;
	this.dataHighlight_className = oTable.dataHighlight_className;
	
	this.initializeAttributes(columnNode);
	this.buildLabel();

	return this;
}
/**********************  PRIVATE METHODS **********************/
Column.prototype.initializeAttributes=function(columnNode)
{
	if(columnNode.nodeName == "#document")
		var attributes = columnNode.getElementsByTagName("COLUMN")[0].attributes;
	else
		var attributes = columnNode.attributes;
	
	if(!attributes)
		return;
		
	var loop = attributes.length;
	var name = null;
	var value = null;
	
	for(var i=0;i<loop;i++)
	{
		name = attributes[i].nodeName;
		name = name.toLowerCase();
		value = attributes[i].nodeValue;
		
		switch (name)
		{
			case "label":
				this.label = value;
				break;
			case "width":
				if(!isNaN(value) && value > 0)
					this.width = parseFloat(value) ;
				break;
			case "labelalign":
				if(value.toUpperCase() == "LEFT" || value.toUpperCase() == "RIGHT" || value.toUpperCase() == "CENTER")
					this.labelAlign = value.toUpperCase();
				break;
			case "dataalign":
				if(value.toUpperCase() == "LEFT" || value.toUpperCase() == "RIGHT" || value.toUpperCase() == "CENTER")
					this.dataAlign = value.toUpperCase();
				break;
			default:
				this.userAttributes[name] = value;				
		}	
	}
}
/*============================================================*/
Column.prototype.buildLabel=function()
{
	var label = this.getLabel();
	var width = this.getWidth();
	var labelAlign = this.labelAlign;	
	var row = this.htmDoc.getElementById(this.tblId + "_headerTableRow")
	var cell = null;
	var txt = null;
	var span = null;

	/* CELL */
	cell = this.htmDoc.createElement("td");
	cell.tblId = this.tblId;
	cell.id = this.htmId;
	cell.r = -1;
	cell.c = this.id;
	cell.width = width;
	cell.align = labelAlign;
	cell.className = this.cell_className;
	//cell.onmousedown = this.resizeColumn;
	/* DIV - display overflow text */
	span = this.htmDoc.createElement("span");
	span.id = this.htmId + "_div";
	span.setAttribute("name",this.htmId + "_div");
	span.tblId = this.tblId;
	span.r = -1;
	span.c = this.id;
	span.isHeader = "Y";
	span.style.whiteSpace = "nowrap";
	span.style.textOverflow = "ellipsis";
	span.title = label;
	span.style.width = width;
	span.onclick = this.onClickFunc;
	span.className = this.label_className;
	span.style.textAlign = labelAlign;
	/* TEXT */
	txt = this.htmDoc.createTextNode(label);

	row.appendChild(cell);
	cell.appendChild(span);
	span.appendChild(txt);	
}
/*============================================================*/
/**********************  PUBLIC METHODS ***********************/
Column.prototype.getUserAttribute=function(attribute)
{
	if(typeof(attribute) != "string")
		return null;
		
	attribute = attribute.toLowerCase();	
	return this.userAttributes[attribute];
}
/*============================================================*/
Column.prototype.setUserAttribute=function(attribute, value)
{
	if(typeof(attribute) != "string" || typeof(value) == "undefined")
		return false;
		
	attribute = attribute.toLowerCase();
	this.userAttributes[attribute] = value;	
	return true;
}
/*============================================================*/
Column.prototype.setOnClickFunc=function(func)
{
	if(typeof(func) != "function" )
		return false;

	var cell = this.htmDoc.getElementById(this.htmId);

	if(!cell || !cell.firstChild)
		return false;
		
	cell.firstChild.onclick = func;
	this.onClickFunc = func;
	return true;
}
/*============================================================*/
Column.prototype.removeOnClickFunc=function()
{
	var cell = this.htmDoc.getElementById(this.htmId);
	
	if(!cell || !cell.firstChild)
		return false;
		
	/* DIV TAG   */		
	cell.firstChild.onclick = null;
	this.onClickFunc = null;
	return true;
}
/*============================================================*/
Column.prototype.getLabel=function()
{
	return this.label;
}
/*============================================================*/
Column.prototype.setLabel=function(label)
{
	if(typeof(label) != "string")
		return false;
		
	var cell = this.htmDoc.getElementById(this.htmId);

	if(!cell || !cell.firstChild || !cell.firstChild.firstChild)
		return false;
	
	/* DIV TAG   */	
	cell.firstChild.title = label;
	/* TEXT NODE */
	cell.firstChild.firstChild.nodeValue=label; 	
	this.label = label;
	return true;
}
/*============================================================*/
Column.prototype.getDataAlignment=function()
{
	return this.dataAlign;
}
/*============================================================*/
Column.prototype.alignData=function(align)
{
	if(typeof(align) != "string")
		return false;
		
	align = align.toUpperCase();
	if(align != "LEFT" && align != "RIGHT" && align != "CENTER")
		return false;
		
	var divs = this.htmDoc.getElementsByName(this.htmId + "_div");
	var loop = divs.length;

	for(var i=0;i<loop;i++)
	{
		if(divs[i].isHeader == "Y")
			continue;
				
		divs[i].parentNode.align = align;
		divs[i].style.textAlign = align;
	}
	this.dataAlign = align;	
	return true;
}
/*============================================================*/
Column.prototype.getLabelAlignment=function()
{
	return this.labelAlign;
}
/*============================================================*/
Column.prototype.alignLabel=function(align)
{
	if(typeof(align) != "string")
		return false;
		
	align = align.toUpperCase();	
	if(align != "LEFT" && align != "RIGHT" && align != "CENTER")
		return false;
	
	var cell = this.htmDoc.getElementById(this.htmId);
	
	if(!cell || !cell.firstChild)
		return false;

	cell.align = align;
	cell.firstChild.style.textAlign = align;	
	this.labelAlign = align;
	return true;
}
/*============================================================*/
Column.prototype.visible=function(key)
{
	return this.isVisible;
}
/*============================================================*/
Column.prototype.highlight=function(highlight)
{
	if(typeof(highlight) != "boolean")
		return false;
	
	var divs = this.htmDoc.getElementsByName(this.htmId + "_div");
	var loop = divs.length;

	for(var i=0;i<loop;i++)
	{
		if(divs[i].isHeader == "Y")
			continue;
			
		divs[i].className = highlight ? this.dataHighlight_className : this.data_className;
	}	
	return true;
}
/*============================================================*/
Column.prototype.getWidth=function()
{
	return parseFloat(this.width);
}
/*============================================================*/
Column.prototype.setWidth=function(width)
{
	if(typeof(width) != "number" || width < 1)
		return false;
		
	var divs = this.htmDoc.getElementsByName(this.htmId + "_div");
	var loop = divs.length;

	for(var i=0;i<loop;i++)
	{
		divs[i].parentNode.width = width;
		divs[i].style.width = width;
	}
	this.width = width;
	return true;	
}
/*============================================================*/
Column.prototype.resizeColumn=function(evt)
{
 	evt = (evt) ? evt : ((window.event) ? window.event : "");
    if (!evt) return;
	
	var eventElement = parent.getEventElement(evt);
	
	var myWin = window;
	var oTable = eval(eventElement.tblId);
	
	if (!oTable.oBrowser.isIE)
		return;
	
	var oColumn = oTable.getColumnById(eventElement.c);
	var colPos = oTable.getColumnPosition(oColumn.id);
	var colWidth = oColumn.getWidth();

	if((colWidth - evt.offsetX) > 8)
		return;
		
	if(evt.offsetX < 8 && colPos > 2)
	{
		colPos --;
		oColumn = oTable.getColumnById(colPos)
	}

	var tblHeader = oColumn.htmDoc.getElementById(oTable.reference +"_header");
	var span = oColumn.htmDoc.createElement("span");
	span.id = oColumn.tblId + "_resizeBar";
	span.className = oTable.resizeCell_className;
	span.style.top = tblHeader.style.top;
	span.style.left= evt.clientX;
	span.style.height = oTable.getHeight();
	tblHeader.appendChild(span);
		
	document.body.style.cursor = "w-resize";
	
	myWin.tblId = oColumn.tblId;	
	oTable.colDeltaX = 0;		
	oTable.colId = oColumn.id;
	oTable.colStartX = parseInt(evt.screenX,10)
	oTable.colOriginalWidth = oColumn.getWidth();


	if (oTable.oBrowser.isIE)
	{
		eventElement.setCapture();
		document.attachEvent("onmousemove", oColumn.resizeStart);
		document.attachEvent("onmouseup", oColumn.resizeStop);
		myWin.event.cancelBubble = true;
		myWin.event.returnValue = false;
	}
	else
	{
		document.addEventListener("mousemove", oColumn.resizeStart, true);
		document.addEventListener("mouseup", oColumn.resizeStop, true);
		evt.preventDefault();
	}
	
	return;
}
/*============================================================*/
Column.prototype.resizeStart=function(evt)
{
	var myWin = window;
	var oTable = eval(myWin.tblId);
	var oColumn = oTable.getColumnById(oTable.colId);
	var currentX = parseInt(evt.screenX, 10);	
	var colDeltaX = currentX - parseInt(oTable.colStartX, 10);	
	oTable.colDeltaX = colDeltaX;
	
	var div = oColumn.htmDoc.getElementById(oColumn.tblId + "_resizeBar");
	div.style.left= evt.clientX;
		
	if((parseInt(oTable.colOriginalWidth, 10) + colDeltaX) == 10)
		oColumn.resizeStop(evt);
	
	if (oTable.oBrowser.isIE)
	{
	    myWin.event.cancelBubble = true;
	    myWin.event.returnValue = false;
	}
	else
		evt.preventDefault();
	return;
}
/*============================================================*/
Column.prototype.resizeStop=function(evt)
{
	var myWin = window;
	var oTable = eval(myWin.tblId);
	var oColumn = oTable.getColumnById(oTable.colId);
	var width = oColumn.getWidth() + parseInt(oTable.colDeltaX, 10);
	
	oColumn.setWidth(width)
	oTable.resizeTable();	
    	
	if (oTable.oBrowser.isIE)
	{
	    document.detachEvent("onmousemove", oColumn.resizeStart);
	    document.detachEvent("onmouseup", oColumn.resizeStop);
	    document.releaseCapture();
	}
	else
	{
	    document.removeEventListener("mousemove", oColumn.resizeStart, true);
	    document.removeEventListener("mouseup", oColumn.resizeStop, true);
	}

	var span = oColumn.htmDoc.getElementById(oColumn.tblId + "_resizeBar");
	var tblHeader = oColumn.htmDoc.getElementById(oColumn.tblId +"_header");
	
	tblHeader.removeChild(span);
		
	document.body.style.cursor = "auto";
	
	myWin.tblId = null;
	oTable.isIE = null;
	oTable.colId = null;
	oTable.colStartX = null
	oTable.colOriginalWidth = null;
	oTable.colDeltaX = 0;
}



