/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/pagedesigner/dialogs/proppgida.js,v 1.3.2.1.26.2 2012/08/08 12:48:48 jomeli Exp $ */
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
var objIda= null;
var objOriginalIda = null;
var parentWnd=null;
var src=null;
var ds = null;
var designer = null;
var doc = null;
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
	objOriginalIda = doc.activeControl;

	ppgLoadData();
	txtAPI.value = objIda.query;
	chkPdlOvrde.checked = (objIda.pdloverride == "y")?true:false;
	txtRecords.value = objIda.maxrecs;
	(objIda.link == "select")?rdSelect.checked=true:rdExplore.checked=true;

	document.body.style.visibility="visible";
	document.body.style.cursor="auto";
	txtRecords.focus();
}

function ppgLoadData()
{
	objIda = new Object();
	objIda.id = objOriginalIda.id;
	objIda.query = objOriginalIda.get("qry");
	objIda.pdloverride = objOriginalIda.get("pdloverride");
	objIda.maxrecs = objOriginalIda.get("recstoget");
	objIda.link = objOriginalIda.get("link");
	objIda.pdl = objOriginalIda.get("pdl");
	objIda.sys = objOriginalIda.get("sys");
	objIda.tkn = objOriginalIda.get("tkn");
	objIda.drill = objOriginalIda.get("drill");

	objIda.keys = new parentWnd.LawCollection();
	var orig = objOriginalIda.getObject("keys");
	if(orig.state != "uninitialized")
	{
		var len = orig.coll.count;
		for(var i=0; i<len; i++)
		{
			var key = new Object();
			key.keynum = orig.coll.item(i).keynum;
			key.name = orig.coll.item(i).name;
			key.value = orig.coll.item(i).value;
			key.refresh = orig.coll.item(i).refresh;
			objIda.keys.add(key.name, key);
		}
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
			txtRecords.focus();
			break;
		case "tabKeys":
			divKeys.style.display = "block";
			if(!bPaintedKeys)ppgPaintKeysTab();
			break;
	}
	ppgActiveTab = objTab.id
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

function ppgTxtOnBlur(elem)
{
	if(elem.id == "txtRecords")
	{
		if(objIda.maxrecs != elem.value)
		{
			objIda.maxrecs = elem.value
			btnApply.disabled = false;
		}
	}
}

function ppgActivateTab(inc)
{
	var tabArray = new Array();
	tabArray[0] = "tabGen";
	tabArray[1] = "tabKeys";

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

function ppgInvokeAPIBuilder()
{
	document.body.style.cursor = "wait";
	var apiParam = new Object();
	apiParam.da = objIda.pdl;
	apiParam.sys = objIda.sys;
	apiParam.tkn = objIda.tkn;
	apiParam.drill = objIda.drill;
	apiParam.keys = new Array();
	var i, key, len = objIda.keys.count;
	for(i=0; i<len; i++)
	{
		apiParam.keys[i] = objIda.keys.item(i);
	}
 	var frmArgs = new Array();
 	frmArgs[0]=parentWnd;
 	frmArgs[1]="ida"; // DME / AGS / IDA
	frmArgs[2]=apiParam;
	var apiReturn = showModalDialog(parentWnd.studioPath+"/tools/apibuilder/apibuilder.htm", frmArgs,
			"dialogLeft:80px;dialogTop:10px;dialogHeight:650px;dialogWidth:700px;edge:sunken;help:no;scroll:no;status:no;resizable:yes;center:yes")

	if (!apiReturn || typeof(apiReturn)=="undefined")
	{
		document.body.style.cursor = "default";
		return;
	}

	if(objIda.query != apiReturn.query)
	{
		objIda.pdl = apiReturn.pdl;
		objIda.sys = apiReturn.sys;
		objIda.tkn = apiReturn.tkn;
		objIda.drill = apiReturn.drill;
		objIda.query = apiReturn.query;
		txtAPI.value=apiReturn.query;
		len = apiReturn.keys.length;
		for(i=0; i<len; i++)
		{
			key = new Object();
			key.name = apiReturn.keys[i].name;
			key.keynum= apiReturn.keys[i].keynum;
			key.value = apiReturn.keys[i].value;
			key.refresh = "n";
			objIda.keys.add(key.name, key)
		}
		bPaintedKeys = false;
		btnApply.disabled = false;
	}
	document.body.style.cursor = "default";
}

function ppgPaintKeysTab()
{
	var i, len = objIda.keys.count;
	for(i=tbKeys.rows.length-1;i>1; i--)
		tbKeys.deleteRow(i);
	if(!len)return;
	var key, row, cell, spannode, textNode, textBox, chkBox ,button;
	for(i=0; i<len; i++)
	{
		key = objIda.keys.item(i);
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
	var key = objIda.keys.item(keyName);
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
	var key = objIda.keys.item(keyName);

	var retVal = parentWnd.cmnDlg.selectDefaultValue(key.value, window);
	if(!retVal || typeof(retVal) == "undefined")return;
	var txtElem = document.getElementById("txtKeyVal"+elm.id.substr(6));
	if(txtElem)txtElem.value = retVal;
	key.value = retVal;
	btnApply.disabled = false;
}

function ppgUpdate()
{
	objIda.pdloverride = (chkPdlOvrde.checked)?"y":"n";
	objIda.maxrecs = txtRecords.value;
	objIda.link = (rdSelect.checked)?"select":"explorer";

	var idaNode = doc.pageXML.selectSingleNode("//IDA[@id='"+objIda.id+"']");
	objOriginalIda.set("qry", objIda.query);
	objOriginalIda.set("pdloverride", objIda.pdloverride);
	objOriginalIda.set("recstoget", objIda.maxrecs);
	objOriginalIda.set("link", objIda.link);
	objOriginalIda.set("pdl", objIda.pdl);
	objOriginalIda.set("sys", objIda.sys);
	objOriginalIda.set("tkn", objIda.tkn);
	objOriginalIda.set("drill", objIda.drill);

	idaNode.setAttribute("qry", objIda.query);
	idaNode.setAttribute("pdloverride", objIda.pdloverride);
	idaNode.setAttribute("recstoget", objIda.maxrecs);
	idaNode.setAttribute("link", objIda.link);
	idaNode.setAttribute("pdl", objIda.pdl);
	idaNode.setAttribute("sys", objIda.sys);
	idaNode.setAttribute("tkn", objIda.tkn);
	idaNode.setAttribute("drill", objIda.drill);

	var orig = objOriginalIda.getObject("keys");
	orig.coll = new parentWnd.LawCollection()

	var newNode = doc.pageXML.createElement("KEYS");
	var i, len=objIda.keys.count, child, oldNode;
	for(i=0; i<len; i++)
	{
		var key = new Object();
		key.keynum = objIda.keys.item(i).keynum;
		key.name = objIda.keys.item(i).name;
		key.value = objIda.keys.item(i).value;
		key.refresh = objIda.keys.item(i).refresh;
		orig.coll.add(key.name, key);

		child = doc.pageXML.createElement("KEY");
		child.setAttribute("keynum", key.keynum);
		child.setAttribute("name", key.name);
		child.setAttribute("refresh", key.refresh);
		child.text = key.value;
		newNode.appendChild(child);
	}
	orig.state = "initialized";
	oldNode = idaNode.selectSingleNode("./KEYS");
	if(oldNode)
		idaNode.replaceChild(newNode, oldNode);
	else
		idaNode.appendChild(newNode);
	btnApply.disabled=true;
	window.returnValue = "changed";
}

function ppgOK()
{
	if(!btnApply.disabled)ppgUpdate();
	window.close();
}
