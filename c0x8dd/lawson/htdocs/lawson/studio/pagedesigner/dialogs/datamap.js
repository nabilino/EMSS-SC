/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/pagedesigner/dialogs/datamap.js,v 1.5.28.2 2012/08/08 12:48:48 jomeli Exp $ */
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
var parentWnd=null;
var src=null;
var ds = null;
var designer = null;
var doc = null;

function dmInit()
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

	dmLoadSelectboxes();
	var objSelect = document.getElementById("selObjects");
	if(objSelect.options.length)
	{
		var objList = document.getElementById("lstTranFlds");
		dmLoadDataElements(objSelect.options[objSelect.selectedIndex].value, objList);
		dmLoadDataMap();
	}

	document.body.style.visibility="visible";
	document.body.style.cursor="auto";
	selObjects.focus();
}

function dmLoadSelectboxes()
{
	var objSelect = document.getElementById("selObjects");

	var nugglets = doc.pageXML.selectSingleNode("//NUGGLETS").childNodes;
	var len = nugglets.length;
	var id;
	for(var i=0; i<len; i++)
	{
		id = nugglets[i].getAttribute("id");
		if(!id)continue;
		dmCreateOption(id, id, objSelect);
	}
	objSelect.selectedIndex = 0;

	var lstSrc = document.getElementById("lstDataSrc");
	var nodes = doc.pageXML.selectSingleNode("//DATASRC").childNodes;
	len = nodes.length;
	for(i=0; i<len; i++)
	{
		var option = dmCreateOption(nodes[i].getAttribute("id"), nodes[i].getAttribute("id"), lstSrc);
		option.defaultVal = nodes[i].text;
	}
}

function dmCreateOption(text, value, selectBox)
{
	var option = document.createElement("OPTION");
	option.text = text;
	option.value = value;
	selectBox.add(option)
	return option;
}

function dmLoadDataElements(objId, listBox)
{
	dmClearListBox(listBox);
	var ctlInst = doc.getControlInstance(objId);
	if(!ctlInst)return;
	var i, len, id;
	switch(ctlInst.ctlId.toLowerCase())
	{
		case "data":
			var fields = ctlInst.getObject("fields");
			if(fields.state == "uninitialized")return;
			var coll = new parentWnd.LawCollection();
			len = fields.coll.count;
			for(i=0; i<len; i++)
			{
				id=fields.coll.item(i).name;
				coll.add(id, id);
			}
			var keys = ctlInst.getObject("index");
			len = keys.keys.count;
			for(i=0; i<len; i++)
			{
				id = keys.keys.item(i).name;
				coll.add(id, id);
			}
			len = coll.count;
			for(i=0; i<len; i++)
			{
				id=coll.item(i);
				dmCreateOption(id, id, listBox);
			}
			break;
		case "ida":
			var keys = ctlInst.getObject("keys");
			if(keys.state == "uninitialized")return;
			len = keys.coll.count;
			for(i=0; i<len; i++)
			{
				id = keys.coll.item(i).name;
				dmCreateOption(id, id, listBox);
			}
			break;
		case "ags":
			var flds = ctlInst.getObject("fields")
			if(flds.state == "uninitialized")return;
			len = flds.coll.count;
			for (i=0; i<len; i++)
			{
				id = flds.coll.item(i).name;
				dmCreateOption(id, id, listBox);
			}
			break;
		case "rss":
		case "htm":
		case "image":
			var datasrc = ctlInst.getObject("datasrc");
			if(datasrc.state == "uninitialized")return;
			len = datasrc.datasrc.count;
			for(i=0; i<len; i++)
			{
				id = datasrc.datasrc.item(i).name;
				dmCreateOption(id, id, listBox);
			}
			break;
		case "composite":
			var src = ctlInst.get("src");
			if(src != "")
			{
				var ds = new parentWnd.DataStorage();
				ds.add("docName", src);
				ds.add("docPath", parentWnd.contentPath+"/pages");
				ds = parentWnd.designStudio.persist.getProv("remote").get(ds, true);
				var content = ds.getItem("contents")?ds.getItem("contents").value:null;
				if(content)
				{
					var datasrc = content.selectNodes("//DATASRC/ELEMENT");
					len = datasrc.length;
					for(i=0; i<len; i++)
					{
						id = datasrc[i].getAttribute("id");
						dmCreateOption(id, id, listBox);
					}
				}
			}
			break;
		case "formlet":
			var src = ctlInst.get("src");
			if (src != "")
			{
				var pdl = parentWnd.getVarFromString("_PDL", src);
				var tkn = parentWnd.getVarFromString("_TKN", src);
				var strApi = parentWnd.servicesPath+"/Xpress?&_PDL="+pdl+"&_TKN="+tkn+
							"&_CONTENTDIR="+parentWnd.contentPath;
				var oFormDef = parentWnd.SSORequest(strApi);
				if (!oFormDef || oFormDef.status)
				{
					var msg="Error calling web server Xpress service."
					if (oFormDef && oFormDef.status)
						msg+="\n" + parentWnd.getHttpStatusMsg(oFormDef.status) +
							"\nServer response: " + oFormDef.statusText + " (" + oFormDef.status + ")"
					parentWnd.cmnDlg.messageBox(msg,"ok","alert");
					oFormDef = null;
				}
				if (oFormDef)
				{
					var fldNodes = oFormDef.selectNodes(".//fld[@tp='Text' or @tp='Select' or @tp='Hidden' or @tp='Out']");
					len = fldNodes.length;
					for(i=0; i<len; i++)
					{
						id = fldNodes[i].getAttribute("nm");
						dmCreateOption(id, id, listBox);
					}
				}
			}
			break;
	}
}

function dmClearListBox(listBox)
{
	var len = listBox.options.length;
	for(var i=len-1;i>=0;i--)
	{
		listBox.removeChild(listBox.options[i]);
	}
}

function dmLoadDataMap()
{
	var nodes = doc.pageXML.selectNodes("//TRAVLETTE/DATAMAP/ELEMENT");
	var i, len = nodes.length;
	var nglt, id, datasrc;

	for(i=0; i<len; i++)
	{
		nglt = nodes[i].getAttribute("nglt");
		id = nodes[i].getAttribute("id");
		datasrc = nodes[i].text;
		dmInsertMapEntry(nglt, id, datasrc);
	}
}

function dmInsertMapEntry(nglt, id, datasrc)
{
	var oTable = document.getElementById("tDmap");
	var row, cell, chkBox, txtNode;

	row = oTable.insertRow();
	row.nglt = nglt;
	row.fld = id;
	row.mappedTo = datasrc
	cell = row.insertCell(0);
	cell.align = "center";
	chkBox = document.createElement("INPUT");
	chkBox.type = "checkbox";
	cell.appendChild(chkBox);

	cell = row.insertCell(1);
	cell.align = "left";
	cell.className = "dsLabel";
	cell.style.textAlign = "left";
	txtNode = document.createTextNode(nglt+"-"+id+"  "+datasrc);
	cell.appendChild(txtNode)
}

function dmOnSelChangeHandler(objSelect)
{
	var objId = objSelect.options[objSelect.selectedIndex].value;
	dmLoadDataElements(objId, document.getElementById("lstTranFlds"));
}

function dmAddToDataSrc()
{
	var selObj = document.getElementById("selObjects");
	if(selObj.selectedIndex == -1 || selObj.options.length == 0)return;
	var nglt = selObj.options[selObj.selectedIndex].value;

	var lstFlds = document.getElementById("lstTranFlds");
	if(lstFlds.selectedIndex == -1 || lstFlds.options.length == 0)return;
	var id = lstFlds.options[lstFlds.selectedIndex].value;

	var lstSrc = document.getElementById("lstDataSrc")
	var i, len=lstSrc.options.length;
	for(i=0; i<len; i++)
		if(lstSrc.options[i].value == id) return;
	var option = dmCreateOption(id, id, lstSrc);
	option.defaultVal = "";

	dmInsertMapEntry(nglt, id, id);
	var btnOk = document.getElementById("btnApply");
	btnOk.disabled = false;
}

function dmRemoveFromDataSrc()
{
	var lstSrc = document.getElementById("lstDataSrc");
	if(lstSrc.selectedIndex == -1 || lstSrc.options.length == 0)return;
	var element = lstSrc.options[lstSrc.selectedIndex].value;

	var oTable = document.getElementById("tDmap");
	var i, len = oTable.rows.length;
	for(i=len-1; i>=0; i--)
	{
		if(oTable.rows[i].datasrc == element)
			oTable.deleteRow(i);
	}

	lstSrc.removeChild(lstSrc.options[lstSrc.selectedIndex]);
	lstSrc.selectedIndex = -1;
	var btnOk = document.getElementById("btnApply");
	btnOk.disabled = false;
}

function dmMap()
{
	var selObj = document.getElementById("selObjects");
	var lstFlds = document.getElementById("lstTranFlds");
	var lstSrc = document.getElementById("lstDataSrc");

	if(!selObj.options.length || !lstFlds.options.length )return;
	if(selObj.selectedIndex == -1 || lstFlds.selectedIndex == -1 || lstSrc.selectedIndex == -1)return;

	var tran, fld, datasrc;
	tran = selObj.options[selObj.selectedIndex].value;
	fld = lstFlds.options[lstFlds.selectedIndex].value;
	datasrc = lstSrc.options[lstSrc.selectedIndex].value;

	var ret = dmVerifyEntry(tran, fld, datasrc);

	/*if(ret.indexOf("update") != -1)
	{
		var txtNode = document.createTextNode(tran+"-"+fld+"  "+ datasrc);
		var rowNo = ret.substr(ret.indexOf("_")+1);
		var oTable = document.getElementById("tDmap");
		var oldNode = oTable.rows[rowNo].cells[1].childNodes[0];
		oTable.rows[rowNo].cells[1].replaceChild(txtNode, oldNode);
		oTable.rows[rowNo].mappedTo = datasrc;
	}
	else*/
	if(ret == "create")
		dmInsertMapEntry(tran, fld, datasrc);
	else if(ret == "duplicate")
		return;

	var btnOk = document.getElementById("btnApply");
	btnOk.disabled = false;
}

function dmVerifyEntry(nglt, fld, datasrc)
{
	var oTable = document.getElementById("tDmap");
	var len = oTable.rows.length;
	var retStr = "create";
	for(var i=0; i<len; i++)
	{
		if(oTable.rows[i].nglt == nglt && oTable.rows[i].fld == fld)
		{
			//retStr = (oTable.rows[i].mappedTo == datasrc)?"duplicate":"update_"+i;
			retStr = (oTable.rows[i].mappedTo == datasrc)?"duplicate":"create";
			break;
		}
	}
	return retStr;
}

function dmApply()
{
	var oTable = document.getElementById("tDmap");
	var len = oTable.rows.length;

	var nglt, fld, datasrc;
	var oldNode, newNode, node;
	oldNode = doc.pageXML.selectSingleNode("/TRAVLETTE/DATAMAP");
	newNode = doc.pageXML.createElement("DATAMAP");
	for(var i=1; i<len; i++)
	{
		nglt = oTable.rows[i].nglt;
		fld = oTable.rows[i].fld;
		datasrc = oTable.rows[i].mappedTo;

		node = doc.pageXML.createElement("ELEMENT");
		node.setAttribute("nglt", nglt);
		node.setAttribute("id", fld);
		node.text=datasrc;
		newNode.appendChild(node);
	}
	doc.pageXML.documentElement.replaceChild(newNode, oldNode);

	var lstSrc = document.getElementById("lstDataSrc")
	len = lstSrc.options.length;
	oldNode = doc.pageXML.selectSingleNode("/TRAVLETTE/DATASRC");
	newNode = doc.pageXML.createElement("DATASRC");
	for(i=0; i<len; i++)
	{
		node = doc.pageXML.createElement("ELEMENT");
		node.setAttribute("id", lstSrc.options[i].value);
		if(lstSrc.options[i].defaultVal != "")node.text = lstSrc.options[i].defaultVal;
		newNode.appendChild(node);
	}
	doc.pageXML.documentElement.replaceChild(newNode, oldNode);

	doc.setModifiedFlag(true);
	btnApply.disabled = true;
}

function dmOK()
{
	if(!btnApply.disabled)dmApply();
	window.close();
}

function dmDelete()
{
	var oTable = document.getElementById("tDmap");
	var len = oTable.rows.length;
	var chkBox, nglt, fld, bDelete;
	bDelete = false;
	for(var i=len-1; i>= 0; i--)
	{
		chkBox = oTable.rows[i].cells[0].childNodes[0];
		if(chkBox.checked)
		{
			nglt = oTable.rows[i].nglt;
			fld = oTable.rows[i].fld;
			oTable.deleteRow(i);
			bDelete = true;
		}
	}
	if(bDelete)
	{
		var btnOk = document.getElementById("btnApply");
		btnOk.disabled = false;
	}
}

function dmOnKeyDown()
{
	var bEvtCaught=false;
	var mElement;
	switch(event.keyCode)
	{
		case parentWnd.keys.ESCAPE:
			bEvtCaught=true
			window.close()
			break;
	}
	if (bEvtCaught)
		parentWnd.setEventCancel(event)
	return (!bEvtCaught)
}

function dmInitDefValue()
{
	var objDataSrc = document.getElementById("lstDataSrc");
	if(objDataSrc.selectedIndex == -1) return;
	txtDefault.value = objDataSrc.options[objDataSrc.selectedIndex].defaultVal;
}

function dmOnBlurDefault(objText)
{
	dmOnAssignDefault(objText);
}

function dmOnAssignDefault(objText)
{
	var objDataSrc = document.getElementById("lstDataSrc");

	if(objText.value == "" || objDataSrc.selectedIndex == -1 || objDataSrc.options.length == 0)
	{
		objText.value = "";
		return;
	}

	objDataSrc.options[objDataSrc.selectedIndex].defaultVal = objText.value;

	var btnOk = document.getElementById("btnApply");
	btnOk.disabled = false;
}

function dmDefaultDlg()
{
	var retVal = parentWnd.cmnDlg.selectDefaultValue(txtDefault.value, window);

	if(!retVal || typeof(retVal) == "undefined")return;

	txtDefault.value = retVal;
	dmOnAssignDefault(txtDefault);
}

function dmAddElement()
{
	var id = txtElement.value;
	var lstSrc = document.getElementById("lstDataSrc")
	var i, len=lstSrc.options.length;
	for(i=0; i<len; i++)
		if(lstSrc.options[i].value == id) return;
	var option = dmCreateOption(id, id, lstSrc);
	option.defaultVal = "";
}
