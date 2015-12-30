/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/pagedesigner/dialogs/proppgdme.js,v 1.5.2.4.26.2 2012/08/08 12:48:48 jomeli Exp $ */
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
var ppgActiveTab="tabGen";
var ppgActiveTab2="header";
var objDme= null;
var objOriginalDme = null;
var parentWnd=null;
var src=null;
var ds = null;
var designer = null;
var doc = null;
var bPaintedFieldHdr =false;
var bPaintedFieldBody =false;
var bPaintedIndex = false;
var bPaintedCond = false;

var ppgRepArray=new Array();
var ppgDispArray=new Array();
var ppgFontArray = new Array();
var ppgFontSizeArray = new Array();

function ppgInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	parentWnd = wndArguments[0];
	src = wndArguments[2];
	ds = parentWnd.designStudio;
	designer = ds.activeDesigner;
	doc = designer.activeDocument;

	objOriginalDme = doc.activeControl;
	objDme = new Object();
	ppgInitialiseArrays();
	ppgInitWorkCopy();

	// And initialise the general tab.
	txtAPI.value = objDme.query;
	chkPdlOvrde.checked = (objDme.pdloverride == "y")?true:false;
	txtRecords.value = objDme.maxrecs;
	txtPageSize.value = objDme.pagesize
	selDisplay.selectedIndex = ppgDispArray[objDme.table.header];
	(objDme.link.type == "drill")?rdDrill.checked = true:rdForm.checked = true;
	txtToken.value = objDme.link.tkn;
	txtToolTip.value = objDme.link.desc;
	if(objDme.sort == "SORTASC")
		rdAsc.checked = true;
	else if(objDme.sort == "SORTDESC")
		rdDesc.checked = true;
	else
		rdNone.checked = true;

	ppgEnableDisableControls("display");
	ppgEnableDisableControls("link");
	ppgEnableDisableControls("addtorow");
	var str = (txtPageSize.value > 1)?"all":selDisplay.options[selDisplay.selectedIndex].value;
	ppgLoadRepresentSelect(str);
	selRepresent.selectedIndex = ppgRepArray[objDme.xsl];

	document.body.style.visibility="visible";
	document.body.style.cursor="auto";
	txtAPI.focus();
}

function ppgInitWorkCopy()
{
	var i, len;
	ppgInitialiseArrays();
	objDme.id = objOriginalDme.id;
	objDme.query = objOriginalDme.get("qry");
	objDme.pdloverride = objOriginalDme.get("pdloverride");
	objDme.maxrecs = objOriginalDme.get("maxrecs") ;
	objDme.pagesize = objOriginalDme.get("pagesize");
	objDme.xsl = objOriginalDme.get("xsl");
	objDme.sort = objOriginalDme.get("sort");
	objDme.prod = objOriginalDme.get("prod");
	objDme.sys = objOriginalDme.get("sys");
	objDme.file = objOriginalDme.get("file");
	objDme.fieldNames = "";
	objDme.keyValues = "";

	objDme.table = new Object();
	var orig = objOriginalDme.getObject("table");
	objDme.table.header = (orig.state != "uninitialized")?orig.header:"horizontal";

	objDme.link = new Object();
	orig = objOriginalDme.getObject("link");
	if(orig.state != "uninitialized")
	{
		objDme.link.type = orig.type;
		objDme.link.tkn = orig.tkn;
		objDme.link.desc = orig.desc;
	}
	else
	{
		objDme.link.type = "drill";
		objDme.link.tkn = "";
		objDme.link.desc = "";
	}

	objDme.graphStyle = new Object();
	orig = objOriginalDme.getObject("graphStyle");
	if(orig.state != "uninitialized")
	{
		objDme.graphStyle.color = orig.color;
		objDme.graphStyle.font = orig.font;
		objDme.graphStyle.size = orig.size;
	}
	else
	{
		objDme.graphStyle.color = "000000";
		objDme.graphStyle.font = "tahoma";
		objDme.graphStyle.size = "8pt";
	}

	objDme.fields = new Object();
	objDme.fields.coll = new parentWnd.LawCollection();
	objDme.fieldsArray=new Array();	// When fields are moved up/down, this array stores the order.
	orig = objOriginalDme.getObject("fields");
	if(orig.state != "uninitialized")
	{
		if(objDme.xsl == "dme.xsl" || objDme.xsl =="dmesingle.xsl")
		{
			objDme.fields.color=orig.color;
			objDme.fields.font=orig.font;
			objDme.fields.size=orig.size;
		}
		objDme.fields.addtorow=orig.addtorow;
		objDme.fields.btnlabel = orig.btnlabel;
		objDme.fields.btnvalue = orig.btnvalue;

		len = orig.coll.count;
		var field;
		for(i=0; i<len; i++)
		{
			field = new Field();
			field.initialize(orig.coll.item(i));
			objDme.fields.coll.add(field.name, field);
			objDme.fieldNames += field.name + ";";
			objDme.fieldsArray[i]=field.name;
		}
	}
	else
	{
		objDme.fields.color="000000";
		objDme.fields.font="tahoma";
		objDme.fields.size="8pt";
		objDme.fields.addtorow="none";
		objDme.fields.btnlabel = "";
		objDme.fields.btnvalue = "";
	}

	objDme.index = new Object();
	orig = objOriginalDme.getObject("index");
	if(orig.state != "uninitialized")
	{
		objDme.index.name = orig.name;
		objDme.index.keys = new parentWnd.LawCollection();
		var len = orig.keys.count;
		var src, key;
		for(var i=0; i<len; i++)
		{
			src = orig.keys.item(i)
			key = new Key();
			key.initialize(src);
			objDme.keyValues += key.value + "=";
			objDme.index.keys.add(key.name, key);
		}
	}
	else
	{
		objDme.index.name = "";
		objDme.index.keys = new parentWnd.LawCollection();
	}

	objDme.conditions = new Object();
	objDme.conditions.coll = new parentWnd.LawCollection();
	orig = objOriginalDme.getObject("conditions");
	if(orig.state != "uninitialized")
	{
		len = orig.coll.count;
		var cond;
		for(i=0; i<len; i++)
		{
			src = orig.coll.item(i);
			cond = new Condition();
			cond.initialize(src);
			objDme.conditions.coll.add(cond.name, cond);
		}
	}

	orig = objOriginalDme.getObject("criteria");
	objDme.criteria = (orig.state != "uninitialized")?orig.criteria:"";
}

function Field()
{
	this.name = "";
	this.caption = "";
	this.hdralign="2";
	this.align = "1";
	this.hdrwrap="y";
	this.wrap="y";
	this.sortorder = "";
	this.rtsort = "n";
	this.drill = "n";
	this.hide = "n";
	this.hdrtooltip="";
	this.tooltip="";
	this.occurs="1";
}
Field.prototype.initialize=function(objField)
{
	this.name = objField.name;
	this.caption = objField.caption;
	this.hdralign=objField.hdralign;
	this.align = objField.align;
	this.hdrwrap=objField.hdrwrap;
	this.wrap=objField.wrap;
	this.sortorder = objField.sortorder;
	this.rtsort = objField.rtsort;
	this.drill = objField.drill;
	this.hide = objField.hide;
	this.hdrtooltip=objField.hdrtooltip;
	this.tooltip=objField.tooltip;
	this.occurs=objField.occurs;
}
Field.prototype.assignDefaultCaption=function()
{
	this.caption = makeCaption(this.name);
}

function Key()
{
	this.name = "";
	this.value = "";
	this.refresh = "n";
	this.caption = "";
	this.hide = "n";
	this.readonly = "n";
	this.type = "";
	this.size = "";
}
Key.prototype.initialize=function(objKey)
{
	this.name = objKey.name;
	this.refresh = objKey.refresh;
	this.value = objKey.value;
	this.caption = objKey.caption;
	this.hide = objKey.hide;
	this.readonly = objKey.readonly;
	this.type = objKey.type;
	this.size = objKey.size;
}
Key.prototype.assignDefaultCaption=function()
{
	this.caption = makeCaption(this.name);
}

function Condition()
{
	this.name = "";
	this.selected = "n";
	this.caption = "";
	this.hide = "n";
}
Condition.prototype.initialize=function(objCond)
{
	this.name = objCond.name;
	this.selected = objCond.selected;
	this.caption = objCond.caption;
	this.hide = objCond.hide;
}
Condition.prototype.assignDefaultCaption=function()
{
	this.caption = makeCaption(this.name)
}

function makeCaption(name)
{
	var strName = name
	var re1 = /\_/g;
	var re2 = /\-/g
	strName = strName.replace(re1, " ")
	strName = strName.replace(re2, " ")

	strName = strName.toLowerCase()

	var strRtn = ""
	var strSplit = strName.split(" ")
	for(var i=0; i < strSplit.length; i++)
	{
		if(i != 0) strRtn += " "
		if(strSplit[i] != "")
		{
			strRtn += (strSplit[i].substr(0, 1)).toUpperCase()
			strRtn += strSplit[i].substr(1)
		}
	}
	return strRtn;
}

function ppgInitialiseArrays()
{
	ppgRepArray["dme.xsl"] = 0;
	ppgRepArray["dmesingle.xsl"] = 0;
	ppgRepArray["xmlgraph_HBAR.xsl"] = 1;
	ppgRepArray["xmlgraph_VBAR.xsl"] = 2;
	ppgRepArray["xmlgraph_PIE.xsl"] = 3;
	ppgRepArray["xmlgraph_LINE.xsl"] = 4;

	ppgDispArray["horizontal"]=0;
	ppgDispArray["vertical"]=1;

	ppgFontArray["arial"] = 0;
	ppgFontArray["book antiqua"]= 1;
	ppgFontArray["comic sans ms"] = 2;
	ppgFontArray["courier new"] = 3;
	ppgFontArray["helvetica"] = 4;
	ppgFontArray["lucida console"] = 5;
	ppgFontArray["modern"] = 6;
	ppgFontArray["ms sans serif"] = 7;
	ppgFontArray["news gothic mt"] = 8;
	ppgFontArray["serif"] = 9;
	ppgFontArray["sans serif"] = 10;
	ppgFontArray["tahoma"] = 11;
	ppgFontArray["times new roman"] = 12;
	ppgFontArray["verdana"] = 13;
	ppgFontArray["wide latin"] = 14;

	ppgFontSizeArray["8pt"] = 0;
	ppgFontSizeArray["9pt"] = 1;
	ppgFontSizeArray["10pt"] = 2;
	ppgFontSizeArray["11pt"] = 3;
	ppgFontSizeArray["12pt"] = 4;
	ppgFontSizeArray["13pt"] = 5;
	ppgFontSizeArray["14pt"] = 6;
	ppgFontSizeArray["15pt"] = 7;
	ppgFontSizeArray["16pt"] = 8;
	ppgFontSizeArray["17pt"] = 9;
	ppgFontSizeArray["18pt"] = 10;
	ppgFontSizeArray["19pt"] = 11;
	ppgFontSizeArray["20pt"] = 12;
	ppgFontSizeArray["21pt"] = 13;
	ppgFontSizeArray["22pt"] = 14;
}

function ppgEnableDisableControls(strId)
{
	switch(strId)
	{
		case "display":
			if(objDme.pagesize == "1")
			{
				lblDisplay.disabled = false;
				selDisplay.disabled = false;
			}
			else
			{
				lblDisplay.disabled = true;
				selDisplay.disabled = true;
			}
			break;
		case "link":
			if(objDme.link.type == "drill")
			{
				lblToken.disabled = true;
				txtToken.disabled = true;
				lblToolTip.disabled = true;
				txtToolTip.disabled = true;

				txtToken.value = "";
				txtToolTip.value = "";
			}
			else
			{
				lblToken.disabled = false;
				txtToken.disabled = false;
				lblToolTip.disabled = false;
				txtToolTip.disabled = false;

				txtToken.value = objDme.link.tkn;
				txtToolTip.value = objDme.link.desc;
			}
			break;
		case "addtorow":
			if(objDme.fields.addtorow == "button" || objDme.fields.addtorow == "both")
			{
				lblBtnLabel.disabled = false;
				txtBtnLabel.disabled = false;
				lblBtnValue.disabled = false;
				txtBtnValue.disabled = false;

				txtBtnLabel.value = objDme.fields.btnlabel;
				txtBtnValue.value = objDme.fields.btnvalue;
			}
			else
			{
				lblBtnLabel.disabled = true;
				txtBtnLabel.disabled = true;
				lblBtnValue.disabled = true;
				txtBtnValue.disabled = true;

				txtBtnLabel.value = "";
				txtBtnValue.value = "";
			}
	}
}

function ppgOnKeyDown()
{
	var bEvtCaught=false;
	switch(event.keyCode)
	{
		case parentWnd.keys.ESCAPE:
			bEvtCaught=true
			window.close()
			break;
		case parentWnd.keys.PAGE_UP:
			if( !event.altKey && event.ctrlKey && !event.shiftKey )
			{
				ppgActivateTab(-1);
				bEvtCaught = true;
			}
			break;
		case parentWnd.keys.PAGE_DOWN:
			if( !event.altKey && event.ctrlKey && !event.shiftKey )
			{
				ppgActivateTab(1);
				bEvtCaught = true;
			}
			break;
	}
	if (bEvtCaught)
		parentWnd.setEventCancel(event);
	return (!bEvtCaught);
}

function ppgActivateTab(inc)
{
	var tabArray = new Array();
	tabArray[0] = "tabGen";
	tabArray[1] = "tabCols";
	tabArray[2] = (ppgActiveTab2=="header")?"tabBodyInfo":"tabHeaderInfo";
	tabArray[3] = "tabIndex";
	tabArray[4] = "tabCond";
	tabArray[5] = "tabSelect";

	var tabIndex,	 curIndex = parseInt(document.getElementById(ppgActiveTab).tabind)
	if(curIndex == 1)
	{
		if( inc > 0 && ppgActiveTab2 == "body")
			curIndex = 2;
		else if( inc < 0 && ppgActiveTab2 == "body")
			curIndex = 3;
	}
	else if(curIndex == 3 && inc<0)
		curIndex = 2;

	tabIndex = curIndex + inc
	if(tabIndex < 0)
		tabIndex = 0
	else if (tabIndex > 5)
		tabIndex = 5

	if (curIndex != tabIndex)
	{
		var obj = document.getElementById(tabArray[tabIndex])
		obj.fireEvent("onclick")
	}
}

function ppgPageSizeOnBlur()
{
	if(objDme.pagesize != txtPageSize.value)
	{
		objDme.pagesize = txtPageSize.value;
		ppgEnableDisableControls("display");
		if(txtPageSize.value > 1)
			ppgLoadRepresentSelect("all");
		else
			ppgLoadRepresentSelect(selDisplay.options[selDisplay.selectedIndex].value);
		btnApply.disabled = false;
	}
}

function ppgOnChgDisplay()
{
	ppgLoadRepresentSelect(selDisplay.options[selDisplay.selectedIndex].value);
	btnApply.disabled = false;
}

function ppgLoadRepresentSelect(strId)
{
	var i, len = selRepresent.options.length;
	for(i=len-1; i>=0; i--)
		selRepresent.removeChild(selRepresent.options[i]);

	var selArrayVal = new Array();
	var selArrayTxt = new Array();
	switch(strId)
	{
		case "all":
			selArrayVal[0] = "dme.xsl"; 			selArrayTxt[0] = "Table";
			selArrayVal[1] = "xmlgraph_HBAR.xsl"; 	selArrayTxt[1] = "Horizontal Bar Graph";
			selArrayVal[2] = "xmlgraph_VBAR.xsl"; 	selArrayTxt[2] = "Vertical Bar Graph";
			selArrayVal[3] = "xmlgraph_PIE.xsl"; 	selArrayTxt[3] = "Pie Chart";
			selArrayVal[4] = "xmlgraph_LINE.xsl"; 	selArrayTxt[4] = "Line Graph";
			for(i=0; i<5; i++)
			{
				var option = document.createElement("OPTION");
				option.text = selArrayTxt[i];
				option.value = selArrayVal[i];
				selRepresent.add(option);
			}
			break;
		case "horizontal":
			selArrayVal[0] = "dme.xsl"; 			selArrayTxt[0] = "Table";
			var option = document.createElement("OPTION");
			option.text = selArrayTxt[0];
			option.value = selArrayVal[0];
			selRepresent.add(option);
			break;
		case "vertical":
			selArrayVal[0] = "dmesingle.xsl"; 			selArrayTxt[0] = "Single Record";
			var option = document.createElement("OPTION");
			option.text = selArrayTxt[0];
			option.value = selArrayVal[0];
			selRepresent.add(option);
			break;
	}
}

function ppgOnChgRepresentation()
{
	objDme.xsl = selRepresent.options[selRepresent.selectedIndex].value;
	//ppgEnableDisableControls("represent");
	btnApply.disabled = false;
}

function ppgSelectColor()
{
	var color = parentWnd.cmnDlg.colorPicker(txtFontColor.value, window);
	if(color)
	{
		txtFontColor.value=color;
		btnApply.disabled = false;
	}
	txtFontColor.focus();
}

function ppgChooseLink()
{
	objDme.link.type = (rdDrill.checked)?"drill":"form";
	ppgEnableDisableControls("link");
	btnApply.disabled = false;
}

function ppgOnClickAddtoRow()
{
	if(rdChk.checked)
		objDme.fields.addtorow = "checkbox";
	else if(rdBtn.checked)
		objDme.fields.addtorow = "button";
	else if(rdNon.checked)
		objDme.fields.addtorow = "none";
	else if(rdBoth.checked)
		objDme.fields.addtorow = "both";

	ppgEnableDisableControls("addtorow");
	btnApply.disabled = false;
}

function ppgSwitchTab(objTab)
{
	if(objTab.id == ppgActiveTab) return;
	document.getElementById(ppgActiveTab).className = "dsTabButtonInactive"
	document.all["div" + ppgActiveTab.substring(3, ppgActiveTab.length)].style.display = "none"
	objTab.className = "dsTabButtonActive"
	switch(objTab.id)
	{
		case "tabGen":
			divGen.style.display = "block";
			txtAPI.focus();
			break;
		case "tabCols":
			divCols.style.display = "block";
			ppgSwitchColTab(ppgActiveTab2);
			break;
		case "tabIndex":
			divIndex.style.display = "block";
			if(!bPaintedIndex)ppgPaintIndexTab();
			break;
		case "tabCond":
			divCond.style.display = "block";
			if(!bPaintedCond)ppgPaintCondTab();
			break;
		case "tabSelect":
			txtCriteria.value = objDme.criteria;
			divSelect.style.display = "block";
			txtCriteria.focus()
			break;
	}
	ppgActiveTab = objTab.id
}

function  ppgSwitchColTab(strTab)
{
	if(strTab == "header")
	{
		tabBodyInfo.className="dsTabButtonInactive";
		tabHeaderInfo.className="dsTabButtonActive";
		divBodyInfo.style.display="none";
		divHdrInfo.style.display="block";
		ppgActiveTab2="header";
		ppgPaintFieldTab("header");
	}
	else
	{
		tabHeaderInfo.className="dsTabButtonInactive";
		tabBodyInfo.className="dsTabButtonActive";
		divHdrInfo.style.display="none";
		divBodyInfo.style.display="block";
		ppgActiveTab2="body";
		ppgPaintFieldTab("body");
	}

}

function ppgInvokeAPIBuilder()
{
	document.body.style.cursor = "wait";
	var apiParam = new Object();
	apiParam.da = objDme.prod;
	apiParam.sys = objDme.sys;
	apiParam.file = objDme.file;
	apiParam.fields = objDme.fieldNames;
	apiParam.index = objDme.index.name;
	apiParam.keys = objDme.keyValues;
	apiParam.max = objDme.maxrecs;
	apiParam.strCrit = objDme.criteria;
 	var frmArgs = new Array();
 	frmArgs[0]=parentWnd;
 	frmArgs[1]="dme"; // DME / AGS / IDA
	frmArgs[2]=apiParam;
	var apiReturn = showModalDialog(parentWnd.studioPath+"/tools/apibuilder/apibuilder.htm", frmArgs,
			"dialogLeft:80px;dialogTop:10px;dialogHeight:650px;dialogWidth:700px;edge:sunken;help:no;scroll:no;status:no;resizable:yes;center:yes")

	if (!apiReturn || typeof(apiReturn)=="undefined")
	{
		document.body.style.cursor = "default";
		txtAPI.focus();
		return;
	}

	if (objDme.query != apiReturn.query)
	{

		objDme.prod = apiReturn.pdl;
		objDme.sys = apiReturn.sys;
		objDme.file = apiReturn.file;
		objDme.fieldNames = apiReturn.fields;
		objDme.query= apiReturn.query;
		objDme.criteria = apiReturn.strCrit;
		ppgLoadFields(objDme.fieldNames, objDme.query);
		objDme.keyValues = apiReturn.keys;
		if(objDme.index.name != apiReturn.index)
		{
			ppgLoadKeys(apiReturn.index, apiReturn.keys);
		}
		objDme.index.name = apiReturn.index;
		if(apiReturn.max != "")objDme.maxrecs = apiReturn.max;
		if(objDme.maxrecs < objDme.pagesize)objDme.pagesize = objDme.maxrecs;
		txtAPI.value = objDme.query;
		txtRecords.value = objDme.maxrecs;
		txtPageSize.value = objDme.pagesize;
		bPaintedField =false;
		bPaintedIndex = false;
		bPaintedCond = false;
		btnApply.disabled = false;
	}
	document.body.style.cursor = "default";
}

function ppgApiCheckOnBlur()
{
	if(txtAPI.value != objDme.query)
	{
		if(objDme.query != "" && objDme.file == parentWnd.getVarFromString("FILE", txtAPI.value))
		{
			var index = parentWnd.getVarFromString("INDEX", txtAPI.value);
			if(objDme.index.name != index && objDme.index.name != "")
			{
				var keys = parentWnd.getVarFromString("KEY", txtAPI.value);
				ppgLoadKeys(index, keys);
			}
		}
		else
		{
			ppgParseAPI(txtAPI.value);
		}

		bPaintedField =false;
		bPaintedIndex = false;
		bPaintedCond = false;
		btnApply.disabled = false;
	}
}

function ppgParseAPI(strQry)
{
	objDme.file = parentWnd.getVarFromString("FILE", strQry);
	objDme.prod = parentWnd.getVarFromString("PROD", strQry);
	objDme.fieldNames = parentWnd.getVarFromString("FIELD", strQry);
	ppgLoadFields(objDme.fieldNames, strQry);
	objDme.query = strQry;
	objDme.index.name = parentWnd.getVarFromString("INDEX", strQry);
	var keys = parentWnd.getVarFromString("KEY", strQry);
	if(objDme.index.name != "")ppgLoadKeys(objDme.index.name, keys);
	var cond = parentWnd.getVarFromString("COND", strQry);
	objDme.criteria = parentWnd.getVarFromString("SELECT", strQry);
}

function ppgLoadFields(fieldNames, strQry)
{
	if(fieldNames == "") return;
	//Get the occurs information
	var bSuccess = false;
	var outDme = ppgDiscover(strQry);
	if(outDme)
	{
		bSuccess = true;
		var colNodes = outDme.selectNodes("/DME/COLUMNS/COLUMN");
		if(!colNodes.length)bSuccess = false;
	}
	var arrFields = fieldNames.split(";");
	var len = arrFields.length;
	objDme.fieldsArray = new Array();
	for(var i=0; i<len; i++)
	{
		if(arrFields[i] == "")continue;
		objDme.fieldsArray[i] = arrFields[i];
		if(objDme.fields.coll.item(arrFields[i]))continue;
		var field = new Field();
		field.name = arrFields[i];
		if(bSuccess && colNodes[i] && colNodes[i].getAttribute("nOccurs"))
			field.occurs = colNodes[i].getAttribute("nOccurs");
		field.assignDefaultCaption();
		objDme.fields.coll.add(field.name, field);
	}
}

function ppgLoadKeys(indexName, keyValues)
{
	if (indexName == "")
	{
		objDme.index.keys = new parentWnd.LawCollection();
		return;
	}
	var strProd = objDme.prod;
	if(objDme.pdloverride == "y")strProd = parentWnd.designStudio.getUserVariable("ProductLine");

	var api = parentWnd.DMEPath+"?PROD=GEN&FILE=FILEINDFLD&INDEX=FIFSET1&KEY=" + strProd + "=" + objDme.file + "="
				+ indexName	+ "&OUT=XML&FIELD=FLDNAME"
	var indDiscover = ppgDiscover(api);
	if(!indDiscover)return;
	var bValAvailable = false;
	if(typeof(keyValues) != "undefined" && keyValues != "")
	{
		var arrKeyVal = new Array();
		arrKeyVal = keyValues.split("=");
		bValAvailable = true;
	}
	var keys = indDiscover.selectNodes("/DME/RECORDS/RECORD/COLS/COL");
	var len = keys.length;
	objDme.index.keys.removeAll();
	for(var i=0; i<len; i++)
	{
		var api2=parentWnd.DMEPath+"?PROD=GEN&FILE=ELEMENT&FIELD=Size;Type;&INDEX=ELMSET1&KEY=" + strProd + "=" + keys[i].text + "&OUT=XML"
		var keyInfo = ppgDiscover(api2);
		if(!keyInfo)return;
		var key = new Key();
		key.name = keys[i].text;
		if(bValAvailable && typeof(arrKeyVal[i]) != "undefined")key.value = arrKeyVal[i];
		key.assignDefaultCaption();
		var keyInfoNode = keyInfo.selectSingleNode("//COLS");
		if(keyInfoNode)
		{
			key.size = parentWnd.trim(keyInfoNode.childNodes[0].text);
			key.type = parentWnd.trim(keyInfoNode.childNodes[1].text);
		}
		objDme.index.keys.add(key.name, key);
	}
}

function ppgDiscover(apiCall)
{
	var discover = parentWnd.SSORequest(apiCall);
	if (!discover || discover.status)
	{
		var msg="Error calling web server DME service.";
		if (discover)
			msg+="\n" + parentWnd.getHttpStatusMsg(discover.status) +
				"\nServer response: " + discover.statusText + " (" + discover.status + ")";
		parentWnd.cmnDlg.messageBox(msg,"ok","alert");
		return null;
	}
	return discover;
}

function ppgPaintFieldTab(strTab)
{
	if(objDme.fieldNames == "")return;
	if(strTab == "header" && !bPaintedFieldHdr)
		ppgPaintFieldHdrTab();
	else if(strTab == "body" && !bPaintedFieldBody)
		ppgPaintFieldBodyTab();

}

function ppgPaintFieldHdrTab()
{
	if(objDme.xsl != "dme.xsl" && objDme.xsl !="dmesingle.xsl")
	{
		txtFontColor.value = objDme.graphStyle.color;
		selFont.selectedIndex = ppgFontArray[objDme.graphStyle.font];
		selFontSize.selectedIndex = ppgFontSizeArray[objDme.graphStyle.size];
	}
	else
	{
		txtFontColor.value = objDme.fields.color;
		selFont.selectedIndex = ppgFontArray[objDme.fields.font];
		selFontSize.selectedIndex = ppgFontSizeArray[objDme.fields.size];
	}

	var i, len = objDme.fields.coll.count;
	var oTable = document.getElementById("tbCols0");
	for(i=oTable.rows.length-1; i>=0; i--)
		oTable.deleteRow(i);
	oTable.activeRow = -1;
	var row, cell, spannode, textNode, textBox, selectBox, chkbox, field;
	for(i=0; i<len; i++)
	{
		field = objDme.fields.coll.item(i);
		row = oTable.insertRow();
		row.id = "row" + i;
		row.fieldName = field.name;
		row.onclick = ppgRowClick;

		cell = row.insertCell(0);
		cell.align = "left";
		spannode = document.createElement("SPAN");
		spannode.className = "dsLabel";
		textNode = document.createTextNode(field.name);
		spannode.appendChild(textNode);
		cell.appendChild(spannode);

		cell = row.insertCell(1);
		cell.align = "center";
		textBox = document.createElement("INPUT");
		textBox.type = "text";
		textBox.id = "txtCaption"+i;
		textBox.className = "dsTextBox";
		textBox.style.width = "80px";
		textBox.style.position = "relative";
		textBox.value = field.caption;
		textBox.onblur = ppgMoveFieldValue;
		cell.appendChild(textBox);

		cell = row.insertCell(2);
		cell.align = "center";
		selectBox = document.createElement("SELECT");
		selectBox.id = "selHdrAlign"+i;
		selectBox.className = "dsTextBox";
		selectBox.style.width = "60px";
		selectBox.style.position = "relative";
		var option = document.createElement("OPTION");
		option.text = "left"; option.value="0";
		selectBox.add(option);
		option = document.createElement("OPTION");
		option.text = "right"; option.value="1";
		selectBox.add(option);
		option = document.createElement("OPTION");
		option.text = "center"; option.value="2";
		selectBox.add(option);
		selectBox.onchange = ppgMoveFieldValue;
		cell.appendChild(selectBox);
		selectBox.selectedIndex = parseInt(field.hdralign);

		cell = row.insertCell(3);
		cell.align = "center";
		chkbox = document.createElement("INPUT");
		chkbox.type = "checkbox";
		chkbox.id = "chkRtSort"+i;
		chkbox.style.position = "relative";
		chkbox.onclick = ppgMoveFieldValue;
		cell.appendChild(chkbox);
		chkbox.checked = (field.rtsort=="y")?true:false;

		cell = row.insertCell(4);
		cell.align = "center";
		textBox = document.createElement("INPUT");
		textBox.type = "text";
		textBox.id = "txtHdrTooltip"+i;
		textBox.className = "dsTextBox";
		textBox.style.width = "80px";
		textBox.style.position = "relative";
		textBox.value = field.hdrtooltip;
		textBox.onblur = ppgMoveFieldValue;
		cell.appendChild(textBox);

		cell = row.insertCell(5);
		cell.align = "center";
		chkbox = document.createElement("INPUT");
		chkbox.type = "checkbox";
		chkbox.id = "chkHdrWrap"+i;
		chkbox.style.position = "relative";
		chkbox.onclick = ppgMoveFieldValue;
		cell.appendChild(chkbox);
		chkbox.checked = (field.hdrwrap=="y")?true:false;
	}
	bPaintedFieldHdr = true;
	if(oTable.rows.length>1)
	{
		oTable.rows[0].style.backgroundColor = "threedhighlight";
		oTable.rows[0].activeRow = "1";
		oTable.activeRow = "0";
	}
}

function ppgPaintFieldBodyTab()
{
	if(objDme.fields.addtorow == "checkbox")
		rdChk.checked = true;
	else if(objDme.fields.addtorow == "button")
		rdBtn.checked = true;
	else if(objDme.fields.addtorow == "none")
		rdNon.checked = true;
	else if(objDme.fields.addtorow == "both")
		rdBoth.checked = true;
	txtBtnLabel.value = objDme.fields.btnlabel;
	txtBtnValue.value = objDme.fields.btnvalue;

	var i, len = objDme.fields.coll.count;
	var oTable = document.getElementById("tbCols1");
	for(i=oTable.rows.length-1; i>=0; i--)
		oTable.deleteRow(i);
	var row, cell, spannode, textNode, textBox, selectBox, chkbox, field;
	for(i=0; i<len; i++)
	{
		field = objDme.fields.coll.item(i);
		row = oTable.insertRow();
		row.id = "row" + i;
		row.fieldName = field.name;

		cell = row.insertCell(0);
		cell.align = "left";
		spannode = document.createElement("SPAN");
		spannode.className = "dsLabel";
		textNode = document.createTextNode(field.name);
		spannode.appendChild(textNode);
		cell.appendChild(spannode);

		cell = row.insertCell(1);
		cell.align = "center";
		selectBox = document.createElement("SELECT");
		selectBox.id = "selAlign"+i;
		selectBox.className = "dsTextBox";
		selectBox.style.width = "60px";
		selectBox.style.position = "relative";
		var option = document.createElement("OPTION");
		option.text = "left"; option.value="0";
		selectBox.add(option);
		option = document.createElement("OPTION");
		option.text = "right"; option.value="1";
		selectBox.add(option);
		option = document.createElement("OPTION");
		option.text = "center"; option.value="2";
		selectBox.add(option);
		selectBox.onchange = ppgMoveFieldValue;
		cell.appendChild(selectBox);
		selectBox.selectedIndex = parseInt(field.align);

		cell = row.insertCell(2);
		cell.align = "center";
		textBox = document.createElement("INPUT");
		textBox.type = "text";
		textBox.id = "txtSort"+i;
		textBox.className = "dsTextBox";
		textBox.style.width = "40px";
		textBox.style.position = "relative";
		textBox.value = field.sortorder;
		textBox.onblur = ppgMoveFieldValue;
		cell.appendChild(textBox);

		cell = row.insertCell(3);
		cell.align = "center";
		chkbox = document.createElement("INPUT");
		chkbox.type = "checkbox";
		chkbox.id = "chkDrill"+i;
		chkbox.style.position = "relative";
		chkbox.onclick = ppgMoveFieldValue;
		cell.appendChild(chkbox);
		chkbox.checked = (field.drill=="y")?true:false;

		cell = row.insertCell(4);
		cell.align = "center";
		textBox = document.createElement("INPUT");
		textBox.type = "text";
		textBox.id = "txtTooltip"+i;
		textBox.className = "dsTextBox";
		textBox.style.width = "80px";
		textBox.style.position = "relative";
		textBox.value = field.tooltip;
		textBox.onblur = ppgMoveFieldValue;
		cell.appendChild(textBox);

		cell = row.insertCell(5);
		cell.align = "center";
		chkbox = document.createElement("INPUT");
		chkbox.type = "checkbox";
		chkbox.id = "chkWrap"+i;
		chkbox.style.position = "relative";
		chkbox.onclick = ppgMoveFieldValue;
		cell.appendChild(chkbox);
		chkbox.checked = (field.hdrwrap=="y")?true:false;

		cell = row.insertCell(6);
		cell.align = "center";
		chkbox = document.createElement("INPUT");
		chkbox.type = "checkbox";
		chkbox.id = "chkHide"+i;
		chkbox.style.position = "relative";
		chkbox.onclick = ppgMoveFieldValue;
		cell.appendChild(chkbox);
		chkbox.checked = (field.hide=="y")?true:false;
	}
	bPaintedFieldBody=true;
}

function ppgMoveFieldValue()
{
	var col = event.srcElement;
	if(!col) return;
	var row = event.srcElement.parentNode.parentNode;
	var field, name = row.fieldName;
	field = objDme.fields.coll.item(name);
	if(col.id.indexOf("txtCaption") == 0)
	{
		if(field.caption != col.value)
		{
			field.caption = col.value;
			btnApply.disabled = false;
		}
	}
	else if(col.id.indexOf("selAlign") == 0)
	{
		field.align = col.options[col.selectedIndex].value;
		btnApply.disabled = false;
	}
	else if(col.id.indexOf("selHdrAlign") == 0)
	{
		field.hdralign = col.options[col.selectedIndex].value;
		btnApply.disabled = false;
	}
	else if(col.id.indexOf("chkHdrWrap") == 0)
	{
		field.hdrwrap = col.checked?"y":"n";
		btnApply.disabled = false;
	}
	else if(col.id.indexOf("chkWrap") == 0)
	{
		field.wrap = col.checked?"y":"n";
		btnApply.disabled = false;
	}
	else if(col.id.indexOf("txtSort") == 0)
	{
		if(field.sortorder != col.value)
		{
			field.sortorder = col.value;
			btnApply.disabled =false;
		}
	}
	else if(col.id.indexOf("chkRtSort") == 0)
	{
		field.rtsort = (col.checked)?"y":"n";
		btnApply.disabled = false;
	}
	else if(col.id.indexOf("chkDrill") == 0)
	{
		field.drill = col.checked?"y":"n";
		btnApply.disabled = false;
	}
	else if(col.id.indexOf("chkHide") == 0)
	{
		field.hide = col.checked?"y":"n";
		btnApply.disabled = false;
	}
	else if(col.id.indexOf("txtTooltip") == 0)
	{
		if(field.tooltip != col.value)
		{
			field.tooltip = col.value;
			btnApply.disabled = false;
		}
	}
	else if(col.id.indexOf("txtHdrTooltip") == 0)
	{
		if(field.hdrtooltip != col.value)
		{
			field.hdrtooltip = col.value;
			btnApply.disabled = false;
		}
	}
}

function ppgRowClick()
{
	var row = event.srcElement;
	if (!row) return;
	while(row.id.indexOf("row") != 0)
		row = row.parentNode;

	var i, len = tbCols0.rows.length;
	for(i=0; i<len; i++)
	{
		if(tbCols0.rows[i].activeRow == "1")
		{
			tbCols0.rows[i].style.backgroundColor = "buttonface";
			tbCols0.rows[i].activeRow = "0";
			break;
		}
	}
	row.style.backgroundColor = "threedhighlight";
	row.activeRow = "1";
	tbCols0.activeRow = row.rowIndex;
}

function ppgMoveRow(strDirection)
{
	var obj1, obj2;
	var i = parseInt(tbCols0.activeRow);
	obj1 = tbCols0.rows[i];
	if(strDirection == "down")
	{
		if(i < tbCols0.rows.length-1)
		{
			obj2 = tbCols0.rows[i+1];
			obj1.swapNode(obj2);
			i++;
		}
	}
	else
	{
		if(i > 0)
		{
			obj2 = tbCols0.rows[i-1];
			obj1.swapNode(obj2);
			i--;
		}
	}
	if(obj2)
	{
		objDme.fieldsArray[obj1.rowIndex] = obj1.fieldName;
		objDme.fieldsArray[obj2.rowIndex] = obj2.fieldName;

		////Fix for checkbox - After the swap the check box does not have the correct value
		obj1.cells[3].childNodes[0].checked = (objDme.fields.coll.item(obj1.fieldName).rtsort=="y")?true:false;
		obj1.cells[5].childNodes[0].checked = (objDme.fields.coll.item(obj1.fieldName).hdrwrap=="y")?true:false;
		obj2.cells[3].childNodes[0].checked = (objDme.fields.coll.item(obj2.fieldName).rtsort=="y")?true:false;
		obj2.cells[5].childNodes[0].checked = (objDme.fields.coll.item(obj2.fieldName).hdrwrap=="y")?true:false;
		btnApply.disabled = false;
	}
	tbCols0.activeRow = i;
}

function ppgPaintIndexTab()
{
	txtIndex.value = objDme.index.name;
	if(txtIndex.value == "")return;
	var len = objDme.index.keys.count;

	var oTable = document.getElementById("tbKeys");
	for(l=oTable.rows.length-1; l > 0; l--)
		oTable.deleteRow(l);
	var key, row, cell, spannode, textNode, textBox, chkBox, button;
	for(var i=0; i<len; i++)
	{
		key = objDme.index.keys.item(i);
		row = oTable.insertRow();
		row.keyName = key.name

		cell = row.insertCell(0);
		cell.align = "left";
		spannode = document.createElement("SPAN");
		spannode.className = "dsLabel";
		textNode = document.createTextNode(key.name);
		spannode.appendChild(textNode);
		cell.appendChild(spannode);

		cell = row.insertCell(1);
		cell.align = "center";
		textBox = document.createElement("INPUT");
		textBox.type = "text";
		textBox.id = "txtKeyVal"+i;
		textBox.className = "dsTextBox";
		textBox.style.width = "60px";
		textBox.style.position = "relative";
		textBox.value = key.value;
		textBox.onblur = ppgMoveIndexValue;
		cell.appendChild(textBox);
		button = document.createElement("INPUT");
		button.type = "button";
		button.id = "btnDef"+i;
		button.className = "dsButton";
		button.style.position = "relative";
		button.style.height = "18px";
		button.style.width = "18px";
		button.style.backgroundImage = "url('../../images/3dots.gif')";
		button.style.backgroundPosition = "center";
		button.style.backgroundRepear = "no-repeat";
		button.onclick = ppgOpenDefaultDlg;
		cell.appendChild(button)

		cell = row.insertCell(2);
		cell.align = "center";
		chkBox = document.createElement("INPUT")
		chkBox.type = "checkbox";
		chkBox.id = "chkKeyRefresh"+i;
		chkBox.onclick = ppgMoveIndexValue;
		cell.appendChild(chkBox);
		chkBox.checked = (key.refresh == "n")?false:true;

		cell = row.insertCell(3);
		textBox = document.createElement("INPUT");
		textBox.type = "text";
		textBox.id = "txtKeyCap"+i;
		textBox.className = "dsTextBox";
		textBox.style.width = "80px";
		textBox.style.position = "relative";
		textBox.value = key.caption;
		textBox.onblur = ppgMoveIndexValue;
		cell.appendChild(textBox);

		cell = row.insertCell(4);
		cell.align = "center";
		chkBox = document.createElement("INPUT")
		chkBox.type = "checkbox";
		chkBox.id = "chkReadonly"+i;
		chkBox.onclick = ppgMoveIndexValue;
		cell.appendChild(chkBox);
		chkBox.checked = (key.readonly == "n")?false:true;

		cell = row.insertCell(5);
		cell.align = "center";
		chkBox = document.createElement("INPUT")
		chkBox.type = "checkbox";
		chkBox.id = "chkHide"+i;
		chkBox.onclick = ppgMoveIndexValue;
		cell.appendChild(chkBox);
		chkBox.checked = (key.hide == "n")?false:true;
	}
	bPaintedIndex = true;
}

function ppgMoveIndexValue()
{
	var elm = event.srcElement;
	if(!elm) return;

	var keyName = elm.parentNode.parentNode.keyName;
	var key = objDme.index.keys.item(keyName);
	if(elm.id.indexOf("txtKeyVal") != -1)
	{
		if(key.value != elm.value)
		{
			key.value = elm.value;
			btnApply.disabled = false;
		}
	}
	else if(elm.id.indexOf("txtKeyCap") != -1)
	{
		if(key.caption != elm.value)
		{
			key.caption = elm.value;
			btnApply.disabled =false;
		}
	}
	else if(elm.id.indexOf("chkKeyRefresh") != -1)
	{
		key.refresh = (elm.checked)?"y":"n";
		btnApply.disabled = false;
	}
	else if(elm.id.indexOf("chkHide") != -1)
	{
		key.hide = (elm.checked)?"y":"n";
		btnApply.disabled = false;
	}
	else if(elm.id.indexOf("chkReadonly") != -1)
	{
		key.readonly= (elm.checked)?"y":"n";
		btnApply.disabled = false;
	}
}

function ppgOpenDefaultDlg()
{
	var elm = event.srcElement;
	if(!elm) return;
	var keyName = elm.parentNode.parentNode.keyName;
	var key = objDme.index.keys.item(keyName);

	var retVal = parentWnd.cmnDlg.selectDefaultValue(key.value, window);
	if(!retVal || typeof(retVal) == "undefined")return;
	var txtElem = document.getElementById("txtKeyVal"+elm.id.substr(6));
	if(txtElem)txtElem.value = retVal;
	key.value = retVal;
	btnApply.disabled = false;
	txtElem.focus();
}

function ppgPaintCondTab()
{
	if(objDme.prod == "" || objDme.file == "")return;

	var strProd = objDme.prod;
	if(objDme.pdloverride == "y")strProd = parentWnd.designStudio.getUserVariable("ProductLine");
	var api = parentWnd.DMEPath + "?PROD=GEN&FILE=FILECND&OUT=XML&FIELD=CndName&KEY=" + strProd + "=" + objDme.file + "&MAX=500";
	var condDiscover = ppgDiscover(api);
	if(!condDiscover)return;

	var conds = condDiscover.selectNodes("/DME/RECORDS/RECORD/COLS/COL");
	var len = conds.length;

	var oTable = document.getElementById("tbCond");
	for(l=oTable.rows.length-1; l>=0; l--)
		oTable.deleteRow(l);
	var row, cell, spannode, textNode, textBox, chkBox, name;
	for(var i=0; i<len; i++)
	{
		name = conds[i].text;
		row = oTable.insertRow();

		cell = row.insertCell(0);
		cell.align = "left";
		spannode = document.createElement("SPAN");
		spannode.className = "dsLabel";
		textNode = document.createTextNode(name);
		spannode.appendChild(textNode);
		cell.appendChild(spannode);

		cell = row.insertCell(1);
		cell.align = "center";
		chkBox = document.createElement("INPUT")
		chkBox.type = "checkbox";
		chkBox.id = "chkCondApply"+i;
		chkBox.condName = name;
		chkBox.onclick = ppgReadCondValue;
		cell.appendChild(chkBox);
		chkBox.checked = ppgCondValue(name, "apply");

		cell = row.insertCell(2);
		cell.align = "center";
		textBox = document.createElement("INPUT");
		textBox.type = "text";
		textBox.id = "txtCondCap"+i;
		textBox.className = "dsTextBox";
		textBox.style.width = "80px";
		textBox.style.position = "relative";
		textBox.value = ppgCondValue(name, "caption");
		textBox.condName = name;
		textBox.onblur = ppgReadCondValue;
		cell.appendChild(textBox);

		cell = row.insertCell(3);
		cell.align = "center";
		chkBox = document.createElement("INPUT")
		chkBox.type = "checkbox";
		chkBox.id = "chkCondSelect"+i;
		chkBox.condName = name;
		chkBox.onclick = ppgReadCondValue;
		cell.appendChild(chkBox);
		chkBox.checked = ppgCondValue(name, "select");

		cell = row.insertCell(4);
		cell.align = "center";
		chkBox = document.createElement("INPUT")
		chkBox.type = "checkbox";
		chkBox.id = "chkCondHide"+i;
		chkBox.condName = name;
		chkBox.onclick = ppgReadCondValue;
		cell.appendChild(chkBox);
		chkBox.checked = ppgCondValue(name, "hide");
	}
	bPaintedCond = true;
}

function ppgCondValue(condName, strVal)
{
	var cond = objDme.conditions.coll.item(condName);
	if(!cond || typeof(cond) == "undefined")
		return (strVal == "caption")?"":false;

	switch(strVal)
	{
		case "caption":
			return cond.caption;
		case "apply":
			return true;
		case "select":
			return (cond.selected=="y")?true:false;
		case "hide":
			return (cond.hide=="y")?true:false;
	}
}

function ppgReadCondValue()
{
	var elm = event.srcElement;
	if(!elm)return;

	var cond = objDme.conditions.coll.item(elm.condName);
	if(elm.id.indexOf("Apply") != - 1)
	{
		if(elm.checked)
		{
			if(!cond || typeof(cond) == "undefined")
			{
				cond = new Condition();
				cond.name = elm.condName;
				cond.assignDefaultCaption();
				objDme.conditions.coll.add(cond.name, cond);
				var capElm = document.getElementById("txtCondCap" + elm.id.substr(12));
				if(capElm)capElm.value = cond.caption;
			}
		}
		else
		{
			if(cond && typeof(cond) != "undefined")
				objDme.conditions.coll.remove(elm.condName);
		}
		btnApply.disabled = false;
	}
	else if (elm.id.indexOf("Select") != -1)
	{
		if(elm.checked)
		{
			if(!cond || typeof(cond) == "undefined")
			{
				cond = new Condition();
				cond.name = elm.condName;
				cond.assignDefaultCaption();
				cond.selected = "y";
				objDme.conditions.coll.add(cond.name, cond);
				var applyElm = document.getElementById("chkCondApply" + elm.id.substr(13));
				if(applyElm)applyElm.checked = true;
				var capElm = document.getElementById("txtCondCap" + elm.id.substr(13));
				if(capElm)capElm.value = cond.caption;
			}
			else
				cond.selected = "y";
		}
		else
		{
			if(typeof(cond) != "undefined")
				cond.selected = "n";
		}
		btnApply.disabled = false;
	}
	else if(elm.id.indexOf("Hide") != -1)
	{
		if(cond)cond.hide = (elm.checked)?"y":"n";
		btnApply.disabled = false;
	}
	else if (elm.id.indexOf("CondCap") != -1)
	{
		if(cond)
		{
			if(cond.caption != elm.value)
			{
				cond.caption = elm.value;
				btnApply.disabled = false;
			}
		}
	}
}

function ppgTxtOnBlur(elem)
{
	switch(elem.id)
	{
		case "txtRecords":
			if(objDme.maxrecs != elem.value)
			{
				objDme.maxrecs = elem.value
				btnApply.disabled = false;
			}
			break;
		case "txtToken":
			if(objDme.link.tkn != elem.value)
			{
				objDme.link.tkn = elem.value
				btnApply.disabled = false;
			}
			break;
		case "txtToolTip":
			if(objDme.link.desc != elem.value)
			{
				objDme.link.desc = elem.value
				btnApply.disabled = false;
			}
			break;
		case "txtFontColor":
			if(objDme.fields.color != elem.value)
			{
				objDme.fields.color = elem.value
				btnApply.disabled = false;
			}
			break;
		case "txtBtnLabel":
			if(objDme.fields.btnlabel != elem.value)
			{
				objDme.fields.btnlabel = elem.value
				btnApply.disabled = false;
			}
			break;
		case "txtBtnValue":
			if(objDme.fields.btnvalue != elem.value)
			{
				objDme.fields.btnvalue = elem.value
				btnApply.disabled = false;
			}
			break;
		case "txtCriteria":
			if(objDme.criteria != elem.value)
			{
				objDme.criteria = elem.value
				btnApply.disabled = false;
			}
			break;
	}
}

function ppgReadData()
{
	objDme.pdloverride = (chkPdlOvrde.checked)?"y":"n";
	if(objDme.maxrecs == "")objDme.maxrecs="25";
	if(objDme.pagesize== "")objDme.pagesize="25";
	var p = parseInt(objDme.pagesize);
	var m = parseInt(objDme.maxrecs);
	if(p>m)objDme.pagesize=objDme.maxrecs;

	objDme.table.header = selDisplay.options[selDisplay.selectedIndex].value;
	objDme.xsl = selRepresent.options[selRepresent.selectedIndex].value;
	if(rdAsc.checked)
		objDme.sort = "SORTASC";
	else if(rdDesc.checked)
		objDme.sort = "SORTDESC";
	else
		objDme.sort = "none";
	if(objDme.xsl != "dme.xsl" && objDme.xsl !="dmesingle.xsl")
	{
		if(!objDme.graphStyle)objDme.graphStyle = new Object();
		objDme.graphStyle.color = txtFontColor.value;
		objDme.graphStyle.font = selFont.options[selFont.selectedIndex].value;
		objDme.graphStyle.size = selFontSize.options[selFontSize.selectedIndex].value;
	}
	else
	{
		objDme.fields.color = txtFontColor.value;
		objDme.fields.font = selFont.options[selFont.selectedIndex].value;
		objDme.fields.size = selFontSize.options[selFontSize.selectedIndex].value;
	}
}

function ppgUpdate()
{
	ppgReadData();
	var dmeNode, newNode, oldNode;
	dmeNode = doc.pageXML.selectSingleNode("//DATA[@id='"+objDme.id+"']");

	objOriginalDme.set("qry", objDme.query);
	objOriginalDme.set("pdloverride", objDme.pdloverride);
	objOriginalDme.set("maxrecs", objDme.maxrecs);
	objOriginalDme.set("pagesize", objDme.pagesize);
	objOriginalDme.set("prod", objDme.prod);
	objOriginalDme.set("sys", objDme.sys);
	objOriginalDme.set("file", objDme.file);
	objOriginalDme.set("xsl", objDme.xsl);
	objOriginalDme.set("sort", objDme.sort);

	dmeNode.setAttribute("qry", objDme.query);
	dmeNode.setAttribute("pdloverride", objDme.pdloverride);
	dmeNode.setAttribute("maxrecs", objDme.maxrecs);
	dmeNode.setAttribute("pagesize", objDme.pagesize);
	dmeNode.setAttribute("prod", objDme.prod);
	dmeNode.setAttribute("sys", objDme.sys);
	dmeNode.setAttribute("file", objDme.file);
	dmeNode.setAttribute("xsl", objDme.xsl);
	dmeNode.setAttribute("sort", objDme.sort);

	var orig = objOriginalDme.getObject("table");
	orig.header = objDme.table.header;
	orig.state = "initialized";

	newNode = doc.pageXML.createElement("TABLE");
	newNode.setAttribute("header", orig.header);
	oldNode = dmeNode.selectSingleNode("./TABLE");
	ppgNodeCopy(newNode, oldNode, dmeNode);

	orig = objOriginalDme.getObject("link");
	orig.type = objDme.link.type;
	orig.tkn = objDme.link.tkn;
	orig.desc = objDme.link.desc;
	orig.state = "initialized";

	newNode = doc.pageXML.createElement("LINK");
	newNode.setAttribute("type", orig.type);
	newNode.setAttribute("tkn", orig.tkn);
	newNode.setAttribute("desc", orig.desc);
	oldNode = dmeNode.selectSingleNode("./LINK");
	ppgNodeCopy(newNode, oldNode, dmeNode);

	if(objDme.xsl != "dme.xsl" && objDme.xsl != "dmesingle.xsl")
	{
		orig = objOriginalDme.getObject("graphStyle");
		orig.color = objDme.graphStyle.color;
		orig.font = objDme.graphStyle.font;
		orig.size = objDme.graphStyle.size;
		orig.state = "initialized";

		newNode = doc.pageXML.createElement("GRAPHSTYLE");
		newNode.setAttribute("font", orig.font);
		newNode.setAttribute("size", orig.size);
		newNode.setAttribute("color", orig.color);
		oldNode = dmeNode.selectSingleNode("./GRAPHSTYLE");
		ppgNodeCopy(newNode, oldNode, dmeNode);
	}

	orig = objOriginalDme.getObject("fields");
	newNode = doc.pageXML.createElement("FIELDS");
	if(objDme.xsl == "dme.xsl" || objDme.xsl == "dmesingle.xsl")
	{
		orig.color = objDme.fields.color;
		orig.font = objDme.fields.font;
		orig.size = objDme.fields.size;
		orig.addtorow = objDme.fields.addtorow;
		orig.btnlabel = objDme.fields.btnlabel;
		orig.btnvalue = objDme.fields.btnvalue;

		newNode.setAttribute("font", orig.font);
		newNode.setAttribute("size", orig.size);
		newNode.setAttribute("color", orig.color);
		newNode.setAttribute("addtorow", orig.addtorow);
		newNode.setAttribute("btnlabel", orig.btnlabel);
		newNode.setAttribute("btnvalue", orig.btnvalue);
	}
	if(typeof(orig.coll) != "undefined")orig.coll.removeAll();
	else orig.coll = new parentWnd.LawCollection();
	var len = objDme.fieldsArray.length;
	var field, child;
	var sortArray = new Array();
	for(var i=0; i<len; i++)
	{
		field = new Field();
		field.initialize(objDme.fields.coll.item(objDme.fieldsArray[i]));
		orig.coll.add(field.name, field);
		if(field.sortorder != "")sortArray[field.sortorder] = field.name;

		child = doc.pageXML.createElement("FIELD");
		child.setAttribute("name", field.name);
		child.setAttribute("heading", field.caption);
		child.setAttribute("align", field.align);
		child.setAttribute("sortorder", field.sortorder);
		child.setAttribute("rtsort", field.rtsort);
		child.setAttribute("drill", field.drill);
		child.setAttribute("hide", field.hide);
		child.setAttribute("hdralign", field.hdralign);
		child.setAttribute("wrap", field.wrap);
		child.setAttribute("hdrwrap", field.hdrwrap);
		child.setAttribute("tooltip", field.tooltip);
		child.setAttribute("hdrtooltip", field.hdrtooltip);
		child.setAttribute("occurs", field.occurs);
		newNode.appendChild(child);
	}
	orig.state = "initialized";
	oldNode = dmeNode.selectSingleNode("./FIELDS");
	ppgNodeCopy(newNode, oldNode, dmeNode);

	newNode = doc.pageXML.createElement("SORTS");
	if(objDme.sort != "none")
	{
		len=sortArray.length;
		if(len)
		{
			for(i=0; i<len; i++)
			{
				var val = sortArray[i.toString(10)];
				if(val && typeof(val)!= "undefined")
				{
					child = doc.pageXML.createElement("SORT");
					child.setAttribute("name", val);
					child.setAttribute("type", objDme.sort);
					newNode.appendChild(child);
				}
			}
		}
	}
	oldNode = dmeNode.selectSingleNode("./SORTS");
	ppgNodeCopy(newNode, oldNode, dmeNode);

	orig = objOriginalDme.getObject("index");
	orig.name = objDme.index.name;
	newNode = doc.pageXML.createElement("INDEX");
	newNode.setAttribute("name", orig.name);
	len = objDme.index.keys.count;
	if(typeof(orig.keys) != "undefined")orig.keys.removeAll();
	else orig.keys = new parentWnd.LawCollection();
	for(i=0; i<len; i++)
	{
		var key = new Key();
		key.initialize(objDme.index.keys.item(i));
		orig.keys.add(key.name, key);

		child = doc.pageXML.createElement("INDELEMENT");
		child.setAttribute("name", key.name);
		child.setAttribute("label", key.caption);
		child.setAttribute("value", key.value);
		child.setAttribute("rtupdate", key.refresh);
		child.setAttribute("readonly", key.readonly);
		child.setAttribute("hide", key.hide);
		child.setAttribute("size", key.size);
		child.setAttribute("type", key.type);
		newNode.appendChild(child);
	}
	orig.state = "initialized";
	oldNode = dmeNode.selectSingleNode("./INDEX");
	ppgNodeCopy(newNode, oldNode, dmeNode);

	orig = objOriginalDme.getObject("conditions");
	if(orig.state == "uninitialized")orig.coll = new parentWnd.LawCollection();
	else orig.coll.removeAll();
	newNode = doc.pageXML.createElement("CONDITIONS");

	len = objDme.conditions.coll.count;
	var cond, condsrc;
	for(i=0; i<len; i++)
	{
		cond = new Condition();
		cond.initialize(objDme.conditions.coll.item(i));
		orig.coll.add(cond.name, cond);

		child = doc.pageXML.createElement("CONDITION");
		child.setAttribute("name", cond.name);
		child.setAttribute("label", cond.caption);
		child.setAttribute("hide", cond.hide);
		child.setAttribute("selected", cond.selected);
		newNode.appendChild(child);
	}
	orig.state = "initialized";
	oldNode = dmeNode.selectSingleNode("./CONDITIONS");
	ppgNodeCopy(newNode, oldNode, dmeNode);

	orig = objOriginalDme.getObject("criteria");
	orig.criteria = objDme.criteria;
	orig.state = "initialized";
	newNode = doc.pageXML.createElement("CRITERIA");
	newNode.text = orig.criteria;
	oldNode = dmeNode.selectSingleNode("./CRITERIA");
	ppgNodeCopy(newNode, oldNode, dmeNode);
	btnApply.disabled = true;
	window.returnValue = "changed";
}

function ppgNodeCopy(newNode, oldNode, par)
{
	if(newNode)
	{
		if(oldNode)
			par.replaceChild(newNode, oldNode);
		else
			par.appendChild(newNode);
	}
}

function ppgOK()
{
	if(!btnApply.disabled)ppgUpdate();
	window.close();
}
