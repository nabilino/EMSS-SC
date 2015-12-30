/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/pagedesigner/dialogs/proppgurl.js,v 1.2.28.4 2012/08/08 12:48:48 jomeli Exp $ */
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
var objNugglet = null;
var objOrigNugglet = null;

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

	objOrigNugglet = doc.activeControl;
	ppgLoadData();

	document.body.style.visibility="visible";
	document.body.style.cursor="auto";
	txtUrl.focus();
}

function ppgLoadData()
{
	objNugglet = new Object();
	objNugglet.id = objOrigNugglet.id;
	objNugglet.datasrc = new parentWnd.LawCollection();

	var orig = objOrigNugglet.getObject("url");
	objNugglet.url = (orig.state !="uninitialized")?orig.url:"";
	txtUrl.value = objNugglet.url;

	orig = objOrigNugglet.getObject("datasrc");
	if(orig.state != "uninitialized")
	{
		var i, newitem, item, option, len = orig.datasrc.count;
		for(i=0; i<len; i++)
		{
			item = orig.datasrc.item(i);
			newitem = new Object();
			newitem.name = item.name;
			newitem.value = item.value;
			objNugglet.datasrc.add(newitem.name, newitem);

			option = document.createElement("OPTION");
			option.text = item.name;
			option.value= item.name;
			lstVariable.add(option);
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
	}
	if (bEvtCaught)
		parentWnd.setEventCancel(event)
	return (!bEvtCaught)
}

function ppgOnblurUrl()
{
	if(txtUrl.value != "")
	{
		if(txtUrl.value == "") return;
		var bAddHttp = true;
		if(txtUrl.value.charAt(0) == "<" && txtUrl.value.charAt(1) == "<"
			&& txtUrl.value.charAt(txtUrl.value.length-2) == ">"
			&& txtUrl.value.charAt(txtUrl.value.length-1) == ">")
				bAddHttp = false;
		if(txtUrl.value.charAt(0) == "/")
			bAddHttp = false;
		if(bAddHttp)
		{
			if((txtUrl.value.indexOf("http://") == -1) && (txtUrl.value.indexOf("https://") == -1))
				txtUrl.value = "http://"+txtUrl.value;
		}
		if(txtUrl.value != objNugglet.url)
			btnApply.disabled = false;
	}
}

function ppgListItemClick(objList)
{
	if(objList.selectedIndex == -1)return;
	var strName = objList.options[objList.selectedIndex].value;
	var item = objNugglet.datasrc.item(strName);
	txtName.value = item.name;
	txtValue.value = item.value;
	btnAdd.value = "Update";
	btnAdd.flag = "update";
}

function ppgVariable(objBtn)
{
	var name, value;
	name = txtName.value;
	value = txtValue.value;
	if(name == "")return;

	txtName.value="";
	txtValue.value="";
	var i, len;
	var objList = document.getElementById("lstVariable");
	switch(objBtn.id)
	{
		case "btnAdd":
			if(objBtn.flag == "add")
			{
				len = objList.options.length;
				for(i=0; i<len; i++)
				{
					if(name == objList.options[i].value)
						break;
				}
				if(i==len) //Item not found
				{
					var option = document.createElement("OPTION");
					option.text = name;
					option.value = name;
					objList.add(option);

					var newItem = new Object();
					newItem.name = name;
					newItem.value = value;
					objNugglet.datasrc.add(name, newItem);
					btnApply.disabled = false;
				}
			}
			else if(objBtn.flag == "update")
			{
				var item = objNugglet.datasrc.item(name);
				if(item)item.value = value;
				objBtn.value = "Add";
				objBtn.flag="add";
				objList.selectedIndex = -1;
				btnApply.disabled = false;
			}

			break;
		case "btnDel":
			len = objList.options.length;
			for(i=0; i<len; i++)
			{
				if(name == objList.options[i].value)
					break;
			}
			var option = objList.options[i];
			objNugglet.datasrc.remove(option.value);
			objList.removeChild(option);
			btnAdd.value = "Add";
			btnAdd.flag="add";
			objList.selectedIndex = -1;
			btnApply.disabled = false;
			break;

	}
	txtName.focus();
}

function ppgUpdate()
{
	var newNode, oldNode, nugNode;
	nugNode = doc.pageXML.selectSingleNode("//NUGGLETS/*[@id='" + objNugglet.id + "']");

	objNugglet.url = txtUrl.value;
	var orig = objOrigNugglet.getObject("url")
	orig.url = objNugglet.url;
	orig.state = "initialized";
	newNode = doc.pageXML.createElement("URL");
	newNode.appendChild(doc.pageXML.createCDATASection(objNugglet.url));
	oldNode = nugNode.selectSingleNode("./URL");
	if(oldNode)
		nugNode.replaceChild(newNode, oldNode);
	else
		nugNode.appendChild(newNode);

	orig = objOrigNugglet.getObject("datasrc");
	if(orig.state == "uninitialized")orig.datasrc = new parentWnd.LawCollection();
	else orig.datasrc.removeAll();

	var newitem, item, len = objNugglet.datasrc.count;
	newNode = doc.pageXML.createElement("DATASRC");
	var childNode;
	for(var i=0; i<len;  i++)
	{
		item = objNugglet.datasrc.item(i);
		newitem = new Object();
		newitem.name = item.name;
		newitem.value = item.value;
		orig.datasrc.add(newitem.name, newitem);
		childNode = doc.pageXML.createElement("ELEMENT");
		childNode.setAttribute("id", newitem.name);
		childNode.text = newitem.value;
		newNode.appendChild(childNode);
	}
	orig.state = "initialized";
	oldNode = nugNode.selectSingleNode("./DATASRC");
	if(oldNode)
		nugNode.replaceChild(newNode, oldNode);
	else
		nugNode.appendChild(newNode);
	btnApply.disabled = true;
	window.returnValue = "changed";
}

function ppgOK()
{
	if(!btnApply.disabled)ppgUpdate();
	window.close();
}
