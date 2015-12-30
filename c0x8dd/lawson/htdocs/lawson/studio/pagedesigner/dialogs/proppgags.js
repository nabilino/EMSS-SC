/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/pagedesigner/dialogs/proppgags.js,v 1.4.2.1.26.2 2012/08/08 12:48:48 jomeli Exp $ */
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
var objAgs= null;
var objOriginalAgs = null;
var parentWnd=null;
var src=null;
var ds = null;
var designer = null;
var doc = null;
var oFormDef = null;
var bPaintedValues = false;
var bPaintedKeys = false;

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
	objOriginalAgs = doc.activeControl;

	ppgLoadData();

	document.body.style.visibility="visible";
	document.body.style.cursor="auto";
	txtAPI.focus();
}

function ppgLoadData()
{
	objAgs = new Object();
	objAgs.id = objOriginalAgs.id;
	objAgs.query = objOriginalAgs.get("qry");
	objAgs.pdl = objOriginalAgs.get("pdl");
	objAgs.sys = objOriginalAgs.get("sys");
	objAgs.token = objOriginalAgs.get("token");
	objAgs.pdloverride = objOriginalAgs.get("pdloverride");
	objAgs.maxrows = objOriginalAgs.get("maxrows");
	objAgs.fc = objOriginalAgs.get("fc");
	objAgs.nonstdda = objOriginalAgs.get("nonstdda");
	objAgs.paging = objOriginalAgs.get("paging");
	objAgs.xsl=objOriginalAgs.get("xsl");
	objAgs.graph = (objAgs.xsl == "agstable.xsl")?false:true;

	objAgs.chartTitle = "";
	objAgs.catTitle = "";
	objAgs.valueTitle = "";
	objAgs.fields = new parentWnd.LawCollection();
	objAgs.dps = new parentWnd.LawCollection();
	objAgs.tblFields = new parentWnd.LawCollection();

	var orig, i, len, fld, newfld;
	if(objAgs.graph)
	{
		objAgs.chartTitle = objOriginalAgs.getObject("charttitle").text;
		objAgs.catTitle = objOriginalAgs.getObject("categorytitle").text;
		objAgs.valueTitle = objOriginalAgs.getObject("valuetitle").text;

		orig = objOriginalAgs.getObject("fields");
		if(orig.state != "uninitialized")
		{
			len = orig.coll.count;
			for(i=0; i<len; i++)
			{
				fld = orig.coll.item(i);
				newfld = new Object();
				newfld.name = fld.name;
				newfld.value = fld.value;
				newfld.refresh = fld.refresh;
				objAgs.fields.add(newfld.name, newfld);
			}
		}

		orig = objOriginalAgs.getObject("datapoints");
		if(orig.state != "uninitialized")
		{
			var dp, newdp;
			len = orig.coll.count;
			for(i=0; i<len; i++)
			{
				dp = orig.coll.item(i);
				newdp = new Object();
				newdp.id = dp.id;
				newdp.det = dp.det;
				newdp.height = dp.height;
				newdp.label = dp.label;
				newdp.value = dp.value;
				objAgs.dps.add(newdp.id, newdp);
			}
		}
	}
	else
	{
		orig = objOriginalAgs.getObject("fields");
		if(orig.state != "uninitialized")
		{
			len = orig.coll.count;
			for(i=0; i<len; i++)
			{
				fld = orig.coll.item(i);
				newfld = new Object();
				newfld.name = fld.name;
				newfld.value = fld.value;
				newfld.refresh = fld.refresh;
				objAgs.fields.add(newfld.name, newfld);
			}
		}

		orig = objOriginalAgs.getObject("agstable");
		if(orig.state != "uninitialized")
		{
			len = orig.coll.count;
			for(i=0; i<len; i++)
			{
				fld = orig.coll.item(i);
				newfld = new Object();
				newfld.id = fld.id;
				newfld.name = fld.name;
				newfld.heading = fld.heading;
				newfld.type=fld.type;
				newfld.sort = fld.sort;
				newfld.drill = fld.drill;
				newfld.align = fld.align;
				newfld.hide = fld.hide;
				objAgs.tblFields.add(newfld.id, newfld);
			}
		}
	}
	txtAPI.value = objAgs.query;
	chkPdlOvrde.checked = (objAgs.pdloverride == "y")?true:false;
	len = selRepresent.options.length;
	for(i=0; i<len; i++)
		if(selRepresent.options[i].value == objAgs.xsl)
		{
			selRepresent.selectedIndex = i;
			break;
		}
	ppgOnChgRepresentation();

	if(objAgs.graph)
	{
		txtChartTitle.value = objAgs.chartTitle;
		txtCatTitle.value = objAgs.catTitle;
		txtValTitle.value = objAgs.valueTitle;
	}
	else
	{
		txtRows.value = objAgs.maxrows;
		txtInitFC.value = objAgs.fc;
		chkNonStdDa.checked = (objAgs.nonstdda == "y")?true:false;
		chkPaging.checked = (objAgs.paging == "y")?true:false;
	}

	if(objAgs.pdl != "" && objAgs.token != "")
	{
		ppgFormDef();
	}
}

function ppgSwitchTab(objTab)
{
	if(objTab.id == ppgActiveTab) return;
	document.getElementById(ppgActiveTab).className = "dsTabButtonInactive";
	document.all["div" + ppgActiveTab.substring(3, ppgActiveTab.length)].style.display = "none";
	objTab.className = "dsTabButtonActive";
	switch(objTab.id)
	{
		case "tabGen":
			divGen.style.display = "block";
			txtAPI.focus();
			break;
		case "tabValues":
			divValues.style.display = "block";
			if(!bPaintedValues)ppgPaintValuesTab();
			break;
		case "tabKeys":
			divKeys.style.display = "block";
			if(!bPaintedKeys)ppgPaintKeysTab();
			break;
	}
	ppgActiveTab = objTab.id;
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
		parentWnd.setEventCancel(event)
	return (!bEvtCaught)
}

function ppgActivateTab(inc)
{
	var tabArray = new Array();
	tabArray[0] = "tabGen";
	tabArray[1] = "tabValues";

	var curIndex = parseInt( document.getElementById(ppgActiveTab).tabind );
	var tabIndex = curIndex + inc;

	if( tabIndex < 0 )
		tabIndex = 0;
	else if( tabIndex > 1 )
		tabIndex = 1;

	if( curIndex != tabIndex ) {
		var obj = document.getElementById( tabArray[tabIndex] );
		obj.fireEvent( "onclick" );
	}
}

function ppgOnChgRepresentation()
{
	var strXsl = selRepresent.options[selRepresent.selectedIndex].value;
	var bGraph =  (strXsl == "agstable.xsl")?false:true;
	if(bGraph != objAgs.graph)
	{
		// Clear the values tab
		//objAgs.fields = new parentWnd.LawCollection();
		objAgs.dps = new parentWnd.LawCollection();
		objAgs.tblFields = new parentWnd.LawCollection();

		for(var i=tbValues.rows.length-1; i>=0; i--)
			tbValues.deleteRow(i);
		objAgs.graph = bGraph;
		ppgPaintValuesHeader();
	}
	objAgs.graph = bGraph;
	if(objAgs.graph)
	{
		tableParam.style.display = "none";
		graphParam.style.display = "block"
	}
	else
	{
		graphParam.style.display = "none"
		tableParam.style.display = "block";
	}
	objAgs.xsl = strXsl;
	if(document.body.style.visibility == "visible")btnApply.disabled=false;
}

function ppgInvokeAPIBuilder()
{
	document.body.style.cursor = "wait";
	var apiParam = new Object();
	apiParam.da = objAgs.pdl;
	apiParam.sys = objAgs.sys;
	apiParam.tkn = objAgs.token;
	apiParam.fc = objAgs.fc;
	apiParam.fields = "";
	var i, fldItem, len = objAgs.fields.count;
	for(i=0; i<len; i++)
	{
		fldItem = objAgs.fields.item(i);
		apiParam.fields += fldItem.name + "=" + fldItem.value;
		if(i<len-1)apiParam.fields += "&";
	}

 	var frmArgs = new Array();
 	frmArgs[0]=parentWnd;
 	frmArgs[1]="ags"; // DME / AGS / IDA
	frmArgs[2]=apiParam;
	var apiReturn = showModalDialog(parentWnd.studioPath+"/tools/apibuilder/apibuilder.htm", frmArgs,
			"dialogLeft:80px;dialogTop:10px;dialogHeight:650px;dialogWidth:700px;edge:sunken;help:no;scroll:no;status:no;resizable:yes;center:yes")

	if (!apiReturn || typeof(apiReturn)=="undefined")
	{
		document.body.style.cursor = "default";
		return;
	}

	if(objAgs.query != apiReturn.query)
	{
		objAgs.pdl = apiReturn.pdl;
		objAgs.sys = apiReturn.sys;
		objAgs.token = apiReturn.tkn;
		objAgs.fc = apiReturn.fc;
		objAgs.query = apiReturn.query;
		objAgs.fields = new parentWnd.LawCollection();
		var arrFields = apiReturn.fields.split("&");
		len = arrFields.length;
		for(i=0; i<len; i++)
		{
			if(arrFields[i] == "")continue;
			var arrFldVal = new Array()
			arrFldVal = arrFields[i].split("=");
			var field = new Object();
			field.name = arrFldVal[0];
			field.value =arrFldVal[1];
			objAgs.fields.add(field.name, field);
		}
		txtAPI.value=apiReturn.query;
		if(!objAgs.graph)txtInitFC.value=objAgs.fc;
		ppgFormDef();
		btnApply.disabled=false;
	}
	document.body.style.cursor = "default";
}

function ppgParseAgsApi()
{
	if(objAgs.query != txtAPI.value)
	{
		objAgs.pdl = parentWnd.getVarFromString("_PDL", txtAPI.value);
		objAgs.sys = "";
		objAgs.token = parentWnd.getVarFromString("_TKN", txtAPI.value);
		objAgs.query = txtAPI.value;
		objAgs.fc = parentWnd.getVarFromString("FC", txtAPI.value);
		txtInitFC.value = objAgs.fc;
		ppgFormDef();
		btnApply.disabled=false;
	}
}

function ppgFormDef()
{
	var strApi = parentWnd.servicesPath+"/Xpress?&_PDL="+objAgs.pdl+
			"&_TKN="+objAgs.token+"&_CONTENTDIR="+parentWnd.contentPath;

	oFormDef = parentWnd.SSORequest(strApi);
	if (!oFormDef || oFormDef.status)
	{
		var msg="Error calling web server Xpress service."
		if (oFormDef)
			msg+="\n" + parentWnd.getHttpStatusMsg(oFormDef.status) +
				"\nServer response: " + oFormDef.statusText + " (" + oFormDef.status + ")"
		parentWnd.cmnDlg.messageBox(msg,"ok","alert");
		oFormDef = null;
	}
}

function ppgPaintKeysTab()
{
	for(var i=tbKeys.rows.length-1; i>=2; i--)
		tbKeys.deleteRow(i);
	var len = objAgs.fields.count;
	if(!len)return;
	var key, row, cell, spannode, textNode, textBox, chkBox ,button;
	for(i=0; i<len; i++)
	{
		key = objAgs.fields.item(i);
		row = tbKeys.insertRow();
		row.keyName = key.name;

		cell =row.insertCell(0);
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
		textBox.onblur = ppgMoveKeyValue;
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
		chkBox.onclick = ppgMoveKeyValue;
		cell.appendChild(chkBox);
		chkBox.checked = (key.refresh == "n")?false:true;
	}
	bPaintedKeys = true;
}

function ppgMoveKeyValue()
{
	var elm = event.srcElement;
	if(!elm) return;

	var keyName = elm.parentNode.parentNode.keyName;
	var key = objAgs.fields.item(keyName);
	if(elm.id.indexOf("txtKeyVal") != -1)
	{
		if(key.value != elm.value)
		{
			key.value = elm.value;
			btnApply.disabled = false;
		}
	}
	else
	{
		key.refresh = (elm.checked)?"y":"n";
		btnApply.disabled = false;
	}
}

function ppgOpenDefaultDlg()
{
	var elm = event.srcElement;
	if(!elm) return;
	var keyName = elm.parentNode.parentNode.keyName;
	var key = objAgs.fields.item(keyName);

	var retVal = parentWnd.cmnDlg.selectDefaultValue(key.value, window);
	if(!retVal || typeof(retVal) == "undefined")return;
	var txtElem = document.getElementById("txtKeyVal"+elm.id.substr(6));
	if(txtElem)txtElem.value = retVal;
	key.value = retVal;
	btnApply.disabled = false;
}

function ppgPaintValuesTab()
{
	for(var i=tbValues.rows.length-1; i>=0; i--)
		tbValues.deleteRow(i);
	tbValues.activeRow = -1;
	ppgPaintValuesHeader();
	var i, len, row, cell;
	if(objAgs.graph)
	{
		len = objAgs.dps.count;
		for(i = 0; i<len; i++)
		{
			//ppgCreateTextBrowseNode(txtId, txtWidth, bTxtDisabled, txtValue, btnId)
			row = tbValues.insertRow();
			row.id = "row"+i;
			row.activeRow = "0";
			row.onclick = ppgOnRowClick;
			cell = row.insertCell(0);
			cell.align = "center";
			cell.appendChild(ppgCreateTextBrowseNode("txtLabel"+i, "150", false, objAgs.dps.item(i).label, "btnLabel"+i));
			cell = row.insertCell(1);
			cell.align = "center";
			cell.appendChild(ppgCreateTextBrowseNode("txtValue"+i, "150", true, objAgs.dps.item(i).value, "btnValue"+i));
		}
	}
	else
	{
		len = objAgs.tblFields.count;
		var chkBox, txtBox;
		for(i=0; i<len; i++)
		{
			row = tbValues.insertRow();
			row.id = "row"+i;
			row.activeRow = "0";
			row.onclick = ppgOnRowClick;

			cell = row.insertCell(0);
			cell.align = "center";
			cell.appendChild(ppgCreateTextBrowseNode("txtField"+i, "80", false, objAgs.tblFields.item(i).name, "btnField"+i));

			cell = row.insertCell(1);
			cell.align = "center";
			txtBox = document.createElement("INPUT");
			txtBox.id="txtHding"+i;
			txtBox.className = "dsTextBox";
			txtBox.style.width = "80px";
			txtBox.style.position = "relative";
			txtBox.value = objAgs.tblFields.item(i).heading;
			txtBox.onblur = ppgMoveTextValue;
			cell.appendChild(txtBox);

			cell = row.insertCell(2);
			cell.align = "center";
			cell.appendChild(ppgCreateAlignNode("selAlign"+i, "80", objAgs.tblFields.item(i).align));

			cell = row.insertCell(3);
			cell.align = "center";
			chkBox = document.createElement("INPUT")
			chkBox.type = "checkbox";
			chkBox.id = "chkSort"+i;
			chkBox.onclick = ppgOnClickChkBox;
			cell.appendChild(chkBox);
			chkBox.checked = (objAgs.tblFields.item(i).sort == "n")?false:true;

			cell = row.insertCell(4);
			cell.align = "center";
			chkBox = document.createElement("INPUT")
			chkBox.type = "checkbox";
			chkBox.id = "chkDril"+i;
			chkBox.onclick = ppgOnClickChkBox;
			cell.appendChild(chkBox);
			chkBox.checked = (objAgs.tblFields.item(i).drill== "n")?false:true;

			cell = row.insertCell(5);
			cell.align = "center";
			chkBox = document.createElement("INPUT")
			chkBox.type = "checkbox";
			chkBox.id = "chkHide"+i;
			chkBox.onclick = ppgOnClickChkBox;
			cell.appendChild(chkBox);
			chkBox.checked = (objAgs.tblFields.item(i).hide == "n")?false:true;
		}
	}
	if(tbValues.rows.length>1)
	{
		tbValues.rows[1].style.backgroundColor = "threedhighlight";
		tbValues.rows[1].activeRow = "1";
		tbValues.activeRow = "1";
	}
}

function ppgPaintValuesHeader()
{
	var row, cell, spanNode;
	if(objAgs.graph)
	{
		row = tbValues.insertRow(0);
		cell = row.insertCell(0);
		cell.align = "center";
		cell.appendChild(ppgCreateSpanNode("Label"));
		cell = row.insertCell(1);
		cell.align = "center";
		cell.appendChild(ppgCreateSpanNode("Value"));
	}
	else
	{
		row = tbValues.insertRow(0);
		cell = row.insertCell(0);
		cell.align = "center";
		cell.appendChild(ppgCreateSpanNode("Field"));
		cell = row.insertCell(1);
		cell.align = "center";
		cell.appendChild(ppgCreateSpanNode("Heading"));
		cell = row.insertCell(2);
		cell.align = "center";
		cell.appendChild(ppgCreateSpanNode("Align"));
		cell = row.insertCell(3);
		cell.align = "center";
		cell.appendChild(ppgCreateSpanNode("Sort"));
		cell = row.insertCell(4);
		cell.align = "center";
		cell.appendChild(ppgCreateSpanNode("Drill"));
		cell = row.insertCell(5);
		cell.align = "center";
		cell.appendChild(ppgCreateSpanNode("Hide"));
	}
	bPaintedValues=true;
}

function ppgCreateSpanNode(txtLabel)
{
	var spanNode, textNode;
	spanNode = document.createElement("SPAN");
	spanNode.className = "dsLabel";
	spanNode.style.position = "relative";
	spanNode.style.textDecoration = "underline";
	textNode = document.createTextNode(txtLabel);
	spanNode.appendChild(textNode);
	return spanNode;
}

function ppgCreateTextBrowseNode(txtId, txtWidth, bTxtDisabled, txtValue, btnId)
{
	var spanNode, textBox, button;

	spanNode = document.createElement("SPAN");
	textBox = document.createElement("INPUT");
	textBox.type = "text";
	textBox.id = txtId;
	textBox.className = "dsTextBox";
	textBox.style.width = txtWidth;
	textBox.style.position = "relative";
	textBox.value = txtValue;
	textBox.disabled = bTxtDisabled;
	if(!textBox.disabled)textBox.onblur = ppgMoveTextValue;
	spanNode.appendChild(textBox);
	button = document.createElement("INPUT");
	button.type = "button";
	button.id = btnId;
	button.className = "dsButton";
	button.style.position = "relative";
	button.style.height = "18px";
	button.style.width = "18px";
	button.style.backgroundImage = "url('../../images/3dots.gif')";
	button.style.backgroundPosition = "center";
	button.style.backgroundRepear = "no-repeat";
	button.onclick = ppgDataSrcDialog;
	spanNode.appendChild(button);
	return spanNode;
}

function ppgCreateAlignNode(selId, selWidth, txtAlign)
{
	var selectBox = document.createElement("SELECT");
	selectBox.id = selId;
	selectBox.className = "dsTextBox";
	selectBox.style.width = selWidth;
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
	selectBox.onchange = ppgOnAlignChange;
	selectBox.selectedIndex = parseInt(txtAlign);
	return selectBox;
}

function ppgMoveTextValue(strId)
{
	var elm = (typeof(strId) != "undefined")?document.getElementById(strId):event.srcElement;
	if(!elm) return;

	if(objAgs.graph)
	{
		var dpId = elm.id.substr(8);
		var dp = objAgs.dps.item(dpId);
		if(dp)
		{
			if(elm.id.indexOf("txtLabel")>=0)
			{
				if (dp.label != elm.value)
				{
					dp.label = elm.value;
					btnApply.disabled = false;
				}
			}
			else if(elm.id.indexOf("txtValue")>=0)
			{
				if(dp.value != elm.value)
				{
					dp.value = elm.value;
					btnApply.disabled =false;
				}
			}
		}
	}
	else
	{
		var tblId = elm.id.substr(8);
		var fld = objAgs.tblFields.item(tblId);
		if(fld)
		{
			if(elm.id.indexOf("txtField")>=0)
			{
				if(fld.name != elm.value)
				{
					fld.name = elm.value;
					btnApply.disabled = false;
				}
			}
			else if(elm.id.indexOf("txtHding")>=0)
			{
				if(fld.heading != elm.value)
				{
					fld.heading = elm.value;
					btnApply.disabled = false;
				}
			}
		}
	}
}

function ppgOnClickChkBox()
{
	var elm = event.srcElement;
	if(!elm)return;
	var id = elm.id.substr(7);
	var fld = objAgs.tblFields.item(id);
	if(fld)
	{
		var value = (elm.checked)?"y":"n";
		if(elm.id.indexOf("chkSort")>=0)
			fld.sort = value;
		else if(elm.id.indexOf("chkDril")>=0)
			fld.drill = value;
		else if(elm.id.indexOf("chkHide")>=0)
			fld.hide = value;
	}
	btnApply.disabled=false;
}

function ppgOnAlignChange()
{
	var elm = event.srcElement;
	if(!elm)return;
	var id = elm.id.substr(8);
	var fld = objAgs.tblFields.item(id);
	if(fld)
	{
		fld.align = elm.options[elm.selectedIndex].value;
		btnApply.disabled=false;
	}
}

function ppgDataSrcDialog()
{
	var elm = event.srcElement;
	if(!elm) return;
	var strTxtId = "", rowNo = elm.id.substr(8);
	var bAppend = false;
	var nType;
	if(elm.id.indexOf("btnLabel") == 0)
	{
		strTxtId = "txtLabel"+rowNo;
		nType= 2;
		bAppend = true;
	}
	else if(elm.id.indexOf("btnValue") == 0)
	{
		strTxtId = "txtValue"+rowNo;
		nType = 2;
	}
	else if(elm.id.indexOf("btnField") == 0)
	{
		strTxtId = "txtField"+rowNo;
		nType = 0;
	}

	if(strTxtId != "")ppgDataSrcDialog2(strTxtId, nType, bAppend);
	ppgMoveTextValue(strTxtId);
}

function ppgDataSrcDialog2(strId, nType, bAppend)
{
	if(typeof(bAppend) == "undefined")bAppend = false;
	if(typeof(nType) == "undefined")nType= 0;
	var textBox = document.getElementById(strId);

	var args = new Array();
	args[0] = parentWnd;
	args[1] = oFormDef;
	args[2] = textBox.value;
	var dlgStyle = "dialogHeight:400px;dialogWidth:280px;center:yes;help:no;scroll:no;status:no;"

	var strField = window.showModalDialog("datafld.htm", args, dlgStyle);

	if(typeof(strField)!="undefined")
	{
		var fNode = oFormDef.selectSingleNode("//fld[@nm='"+strField+"'] | push[@nm='"+strField+"']");
		fNbr = fNode.getAttribute("nbr");
		if(!fNbr)fNbr = "";

		if(nType == 1)
			strField = "fld_"+ fNbr + "/" + strField;
		else if(nType == 2)
			strField = "[{" + fNbr + "/" + strField + "}]";

		textBox.value = (bAppend)?textBox.value+strField:strField;
		if(strId.indexOf("txtField") >=0 || strId.indexOf("txtLabel") >=0 || strId.indexOf("txtValue") >=0 )
		{
			var id = strId.substr(8);
			if(objAgs.graph)
			{
				var dp = objAgs.dps.item(id);
				if(!dp)
				{
					var dp = new Object();
					dp.label = (strId.indexOf("txtLabel") >= 0)?textBox.value:"";
					dp.value =(strId.indexOf("txtValue") >= 0)?textBox.value:"";
					dp.id=id
					dp.det = "";
					dp.height = "";
					objAgs.dps.add(dp.id, dp);
				}
				else
				{
					if(strId.indexOf("txtLabel") >= 0)
						dp.label = textBox.value;
					else
						dp.value = textBox.value;
				}
			}
			else
			{
					var fld = new Object();
					fld.name = textBox.value;
					var elem = document.getElementById("txtHding"+id);
					fld.heading = (elem)?elem.value:"";
					fld.type=fNode.getAttribute("ed");
					if(!fld.type)fld.type="";
					elem = document.getElementById("selAlign"+id);
					fld.align = elem?elem.options[elem.selectedIndex].value:"1";
					elem = document.getElementById("chkSort"+id);
					fld.sort=elem?(elem.checked?"y":"n"):"n";
					elem = document.getElementById("chkDril"+id);
					fld.drill=elem?(elem.checked?"y":"n"):"n";
					elem = document.getElementById("chkHide"+id);
					fld.hide = elem?(elem.checked?"y":"n"):"n";
					fld.id = id;
					objAgs.tblFields.add(fld.id, fld);
			}
		}
	}
	if(!textBox.disabled)textBox.focus();
	btnApply.disabled=false;
}

function ppgOnRowClick()
{
	var row = event.srcElement;
	if (!row) return;
	while(row.id.indexOf("row") != 0)
		row = row.parentNode;

	var i, len = tbValues.rows.length;
	for(i=0; i<len; i++)
	{
		if(tbValues.rows[i].activeRow == "1")
		{
			tbValues.rows[i].style.backgroundColor = "buttonface";
			tbValues.rows[i].activeRow = "0";
			break;
		}
	}
	row.style.backgroundColor = "threedhighlight";
	row.activeRow = "1";
	tbValues.activeRow = row.rowIndex;
}

function ppgAdd()
{
	var row, cell, i;
	i = tbValues.rows.length-1;
	if(objAgs.graph)
	{
		row = tbValues.insertRow();
		row.id = "row"+i;
		row.activeRow = "0";
		row.onclick = ppgOnRowClick;
		cell =row.insertCell(0);
		cell.align = "center";
		cell.appendChild(ppgCreateTextBrowseNode("txtLabel"+i, "150", false, "", "btnLabel"+i));
		cell =row.insertCell(1);
		cell.align = "center";
		cell.appendChild(ppgCreateTextBrowseNode("txtValue"+i, "150", true, "", "btnValue"+i));
	}
	else
	{
		row = tbValues.insertRow();
		row.id = "row"+i;
		row.activeRow = "0";
		row.onclick = ppgOnRowClick;
		cell = row.insertCell(0);
		cell.align = "center";
		cell.appendChild(ppgCreateTextBrowseNode("txtField"+i, "80", false, "", "btnField"+i));

		cell = row.insertCell(1);
		cell.align = "center";
		var txtBox = document.createElement("INPUT");
		txtBox.id="txtHding"+i;
		txtBox.className = "dsTextBox";
		txtBox.style.width = "80px";
		txtBox.style.position = "relative";
		txtBox.onblur = ppgMoveTextValue;
		cell.appendChild(txtBox);

		cell = row.insertCell(2);
		cell.align = "center";
		cell.appendChild(ppgCreateAlignNode("selAlign"+i, "80", "1"));

		cell = row.insertCell(3);
		cell.align = "center";
		var chkBox = document.createElement("INPUT")
		chkBox.type = "checkbox";
		chkBox.id = "chkSort"+i;
		chkBox.onclick = ppgOnClickChkBox;
		cell.appendChild(chkBox);

		cell = row.insertCell(4);
		cell.align = "center";
		var chkBox = document.createElement("INPUT")
		chkBox.type = "checkbox";
		chkBox.id = "chkDril"+i;
		chkBox.onclick = ppgOnClickChkBox;
		cell.appendChild(chkBox);

		cell = row.insertCell(5);
		cell.align = "center";
		chkBox = document.createElement("INPUT")
		chkBox.type = "checkbox";
		chkBox.id = "chkHide"+i;
		chkBox.onclick = ppgOnClickChkBox;
		cell.appendChild(chkBox);
	}
	if(row)
	{
		var len = tbValues.rows.length;
		for(i=0; i<len; i++)
		{
			if(tbValues.rows[i].activeRow == "1")
			{
				tbValues.rows[i].style.backgroundColor = "buttonface";
				tbValues.rows[i].activeRow = "0";
				break;
			}
		}
		row.style.backgroundColor = "threedhighlight";
		row.activeRow = "1";
		tbValues.activeRow = row.rowIndex;
		btnApply.disabled=false;
	}
}

function ppgRemove()
{
	if(tbValues.activeRow > 0)
	{
		if(objAgs.graph)
			objAgs.dps.remove((tbValues.activeRow-1));
		else
			objAgs.tblFields.remove((tbValues.activeRow-1));
		tbValues.deleteRow(tbValues.activeRow);
		tbValues.activeRow = -1;
		btnApply.disabled=false;
	}
}

function ppgTxtOnBlur(elem)
{
	switch (elem.id)
	{
		case "txtRows":
			if(objAgs.maxrows != elem.value)
			{
				objAgs.maxrows = elem.value;
				btnApply.disabled = false;
			}
			break;
		case "txtInitFC":
			if(objAgs.fc != elem.value)
			{
				objAgs.fc = elem.value;
				btnApply.disabled = false;
			}
			break;
		case "txtChartTitle":
			if(objAgs.chartTitle != elem.value)
			{
				objAgs.chartTitle = elem.value;
				btnApply.disabled = false;
			}
			break;
		case "txtCatTitle":
			if(objAgs.catTitle != elem.value)
			{
				objAgs.catTitle = elem.value;
				btnApply.disabled = false;
			}
			break;
		case "txtValTitle":
			if(objAgs.valueTitle != elem.value)
			{
				objAgs.valueTitle = elem.value;
				btnApply.disabled = false;
			}
			break;
	}
}

function ppgUpdate()
{
	var agsNode = doc.pageXML.selectSingleNode("//AGS[@id='"+objAgs.id+"']");
	var newNode, oldNode, childNode;
	var orig, i, len;

	objOriginalAgs.set("qry", objAgs.query);
	objOriginalAgs.set("pdl", objAgs.pdl);
	objOriginalAgs.set("sys", objAgs.sys);
	objOriginalAgs.set("token", objAgs.token);
	objAgs.pdloverride = (chkPdlOvrde.checked)?"y":"n";
	objOriginalAgs.set("pdloverride", objAgs.pdloverride);
	objOriginalAgs.set("xsl", objAgs.xsl);

	agsNode.setAttribute("qry", objAgs.query);
	agsNode.setAttribute("pdl", objAgs.pdl);
	agsNode.setAttribute("sys", objAgs.sys);
	agsNode.setAttribute("token", objAgs.token);
	agsNode.setAttribute("pdloverride", objAgs.pdloverride);
	agsNode.setAttribute("xsl", objAgs.xsl);

	if(objAgs.graph)
	{
		//objAgs.chartTitle = txtChartTitle.value;
		//objAgs.catTitle = txtCatTitle.value;
		//objAgs.valueTitle = txtValTitle.value;

		objOriginalAgs.getObject("charttitle").text = objAgs.chartTitle;
		objOriginalAgs.getObject("categorytitle").text = objAgs.catTitle;
		objOriginalAgs.getObject("valuetitle").text = objAgs.valueTitle;
		newNode = doc.pageXML.createElement("CHARTTITLE");
		newNode.text = objAgs.chartTitle;
		oldNode = agsNode.selectSingleNode("./CHARTTITLE")
		ppgNodeCopy(newNode, oldNode, agsNode);
		newNode = doc.pageXML.createElement("CATEGORYTITLE");
		newNode.text = objAgs.catTitle;
		oldNode = agsNode.selectSingleNode("./CATEGORYTITLE")
		ppgNodeCopy(newNode, oldNode, agsNode);
		newNode = doc.pageXML.createElement("VALUETITLE");
		newNode.text = objAgs.valueTitle;
		oldNode = agsNode.selectSingleNode("./VALUETITLE")
		ppgNodeCopy(newNode, oldNode, agsNode);

		orig = objOriginalAgs.getObject("fields");
		orig.coll = new parentWnd.LawCollection();
		len = objAgs.fields.count;
		newNode = doc.pageXML.createElement("FIELDS");
		for(i=0; i<len; i++)
		{
			var field = new Object();
			field.name = objAgs.fields.item(i).name;
			field.value = objAgs.fields.item(i).value;
			field.refresh = objAgs.fields.item(i).refresh;
			orig.coll.add(field.name, field);
			childNode = doc.pageXML.createElement("FIELD");
			childNode.setAttribute("name", field.name);
			childNode.setAttribute("refresh", field.refresh);
			childNode.text = field.value;
			newNode.appendChild(childNode);
		}
		orig.state = "initialized";
		oldNode = agsNode.selectSingleNode("./FIELDS");
		ppgNodeCopy(newNode, oldNode, agsNode);

		orig = objOriginalAgs.getObject("datapoints");
		orig.coll = new parentWnd.LawCollection();
		newNode = doc.pageXML.createElement("DATAPOINTS");
		len = objAgs.dps.count;
		for(i=0; i<len; i++)
		{
			var dpsrc = objAgs.dps.item(i);
			if(dpsrc.label == "" || dpsrc.value == "")continue;
			var dp = new Object();
			dp.id = dpsrc.id;
			dp.det = dpsrc.det;
			dp.height = dpsrc.height;
			dp.label = dpsrc.label;
			dp.value = dpsrc.value;
			orig.coll.add(dp.id, dp);

			childNode = doc.pageXML.createElement("DP");
			childNode.setAttribute("id", dp.id);
			childNode.setAttribute("det", dp.det);
			childNode.setAttribute("height", dp.height);
			var lblNode = doc.pageXML.createElement("LABEL")
			lblNode.setAttribute("val", dp.label);
			childNode.appendChild(lblNode);
			var valNode = doc.pageXML.createElement("VALUE");
			valNode.setAttribute("val", dp.value);
			childNode.appendChild(valNode);
			newNode.appendChild(childNode);
		}
		orig.state = "initialized";
		oldNode  = agsNode.selectSingleNode("./DATAPOINTS");
		ppgNodeCopy(newNode, oldNode, agsNode);
	}
	else
	{
		//objAgs.maxrows = txtRows.value;
		//objAgs.fc = txtInitFC.value;
		objAgs.nonstdda = (chkNonStdDa.checked)?"y":"n";
		objAgs.paging = (chkPaging.checked)?"y":"n";
		objOriginalAgs.set("maxrows", objAgs.maxrows);
		objOriginalAgs.set("fc", objAgs.fc);
		objOriginalAgs.set("nonstdda", objAgs.nonstdda);
		objOriginalAgs.set("paging", objAgs.paging);
		agsNode.setAttribute("maxrows", objAgs.maxrows);
		agsNode.setAttribute("fc", objAgs.fc);
		agsNode.setAttribute("nonstdda", objAgs.nonstdda);

		orig = objOriginalAgs.getObject("fields");
		orig.coll = new parentWnd.LawCollection();
		len = objAgs.fields.count;
		newNode = doc.pageXML.createElement("INPFIELDS");
		for(i=0; i<len; i++)
		{
			var field = new Object();
			field.name = objAgs.fields.item(i).name;
			field.value = objAgs.fields.item(i).value;
			field.refresh = objAgs.fields.item(i).refresh;
			orig.coll.add(field.name, field);
			childNode = doc.pageXML.createElement("INPFIELD");
			childNode.setAttribute("name", field.name);
			childNode.setAttribute("refresh", field.refresh);
			childNode.text = field.value;
			newNode.appendChild(childNode);
		}
		orig.state = "initialized";
		oldNode = agsNode.selectSingleNode("./INPFIELDS");
		ppgNodeCopy(newNode, oldNode, agsNode);

		orig = objOriginalAgs.getObject("agstable");
		orig.coll = new parentWnd.LawCollection();
		len = objAgs.tblFields.count;
		newNode = doc.pageXML.createElement("FIELDS");
		for(i=0; i<len; i++)
		{
			var fld = new Object();
			var fldsrc = objAgs.tblFields.item(i);
			if(fldsrc.name == "")continue;
			fld.id = fldsrc.id;
			fld.name = fldsrc.name;
			fld.heading = fldsrc.heading;
			fld.type = fldsrc.type;
			fld.sort = fldsrc.sort;
			fld.drill = fldsrc.drill;
			fld.align = fldsrc.align;
			fld.hide = fldsrc.hide;
			orig.coll.add(fld.id, fld);

			childNode = doc.pageXML.createElement("FIELD");
			childNode.setAttribute("id", fld.id);
			childNode.setAttribute("name", fld.name);
			childNode.setAttribute("heading", fld.heading);
			childNode.setAttribute("type", fld.type);
			childNode.setAttribute("sort", fld.sort);
			childNode.setAttribute("drill", fld.drill);
			childNode.setAttribute("align", fld.align);
			childNode.setAttribute("hide", fld.hide);
			newNode.appendChild(childNode);
		}
		orig.state = "initialized";
		oldNode  = agsNode.selectSingleNode("./FIELDS");
		ppgNodeCopy(newNode, oldNode, agsNode);
	}
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
	window.close()
}
