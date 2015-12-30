/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/pagedesigner/dialogs/proppgnavlet.js,v 1.3.2.1.4.1.16.2 2012/08/08 12:48:48 jomeli Exp $ */
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
}

function ppgLoadData()
{
	objNugglet = new Object();
	objNugglet.id = objOrigNugglet.id;
	objNugglet.type = objOrigNugglet.get("tp");
	objNugglet.da = "";
	objNugglet.sys = "";
	objNugglet.tkn = "";
	objNugglet.menuitems = new parentWnd.LawCollection();

	var orig = objOrigNugglet.getObject("menudata");
	var i, len, item, newitem, lstOption;
	if(orig.state != "uninitialized")
	{
		len = orig.menuitems.count;
		for(i=0; i<len; i++)
		{
			item = orig.menuitems.item(i);
			newitem = new Object();
			newitem.tkn = item.tkn;
			newitem.caption = item.caption;
			newitem.description = item.description;
			newitem.url = item.url;
			newitem.curpos = item.curpos;
			objNugglet.menuitems.add(newitem.tkn, newitem);

			lstOption = ppgAddOption(newitem.caption, newitem.tkn, lstProgSelected);
			lstOption.caption = item.caption;
			lstOption.description = item.description;
			lstOption.url = item.url;
			lstOption.curpos = item.curpos;
		}
	}
	if(objNugglet.type == "user")
	{
		daSys.style.display = "none";
		lstOption = ppgAddOption("new", "new", lstProg);
		lstOption.caption = "new";
		lstOption.description = "new";
		lstOption.url = "";
		lstOption.curpos = false;

		btnMOVE_ALLRIGHT.style.display = "none";
		btnMOVE_ALLLEFT.style.display = "none";
	}
	else
	{
		lstDa.selectedIndex = 0;
		lstSys.selectedIndex = -1;
		lstTkn.selectedIndex = -1;
		ppgFillDaListBox();
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

function ppgAddOption(text, value, objList)
{
	var option = document.createElement("OPTION");
	option.text = text;
	option.value = value;
	objList.add(option);
	return option;
}

function ppgRemoveAllOptions(objSelect)
{
	var i,option, len = objSelect.options.length;
	for(i=len-1; i>=0; i--)
	{
		option = objSelect.options[i];
		objSelect.removeChild(option);
	}
	if(objSelect.id == "lstSys")ppgAddOption("Select a system code", "selectsys", lstSys);
	else if(objSelect.id == "lstTkn")ppgAddOption("Select a menu/program", "selectmenu", lstTkn);
}

function ppgFillDaListBox()
{
	var strQuery=parentWnd.DMEPath+"?PROD=GEN&FILE=PRODLINE&FIELD=ProductLine&OUT=XML";
	strQuery+="&XKEYS=FALSE&XRELS=FALSE&XIDA=FALSE&MAX=1000";

	var discover = ppgPost(strQuery, "DME");
	if(!discover)return;
	var das = discover.selectNodes("/DME/RECORDS/RECORD/COLS/COL");
	var len = das.length;
	for(var i=0; i<len; i++)
	{
		ppgAddOption(das[i].text, das[i].text, lstDa);
	}
}

function ppgFillSysListBox()
{
	var strDa = lstDa.options[lstDa.selectedIndex].value;
	if(strDa == "selectda")return;
	ppgRemoveAllOptions(lstSys);
	objNugglet.da = strDa;
	var apiCall = parentWnd.DMEPath + "?PROD=GEN&FILE=SYSTEM&FIELD=SystemCode;SysName&INDEX=STMSET1&KEY=" + strDa;
	apiCall+="&OUT=XML&XKEYS=FALSE&XRELS=FALSE&XIDA=FALSE&MAX=1000";
	var discover = ppgPost(apiCall, "DME");
	if(!discover)return;
	var sys = discover.selectNodes("/DME/RECORDS/RECORD/COLS");
	var len = sys.length;
	for(var i=0; i<len; i++)
	{
		ppgAddOption(sys[i].childNodes[0].text + " " + sys[i].childNodes[1].text, sys[i].childNodes[0].text, lstSys);
	}
}

function ppgFillTokenListBox()
{
	var strSys = lstSys.options[lstSys.selectedIndex].value;
	if(strSys == "selectsys")return;
	ppgRemoveAllOptions(lstTkn);
	objNugglet.sys = strSys;
	var option, name, id, i, len, tkns;
	var apiCall, discover;
	if(objNugglet.type == "menu")
	{
		apiCall = parentWnd.cgiPath + "/formdef.exe?_PDL=" + objNugglet.da + "&_TKN=" + objNugglet.sys + "MN" + "&_OUT=XML" + "&_XSL=NONE";
		discover = ppgPost(apiCall, "Formdef");
		if(!discover)return;
		var formNode = discover.documentElement;
		ppgAddOption(formNode.getAttribute("TOKEN")+ " " + formNode.getAttribute("TITLE"), formNode.getAttribute("TOKEN"), lstTkn);
		tkns = discover.selectNodes("/form/menu");
		len = tkns.length;
		for(i=2; i<len; i++)
		{
			name = tkns[i].getAttribute("TITLE");
			id=tkns[i].getAttribute("TOKEN")
			option = ppgAddOption(id + " " + name, id, lstTkn);
		}
	}
	else
	{
		apiCall = parentWnd.cgiPath + "/gettokens.exe?" + objNugglet.da + "&" + objNugglet.sys + "&OUT=XML";
		discover = ppgPost(apiCall, "gettokens");
		tkns = discover.selectNodes("//TOKEN");
		len = tkns.length;
		for(i=0; i<len; i++)
		{
			name = tkns[i].getAttribute("title");
			id=tkns[i].getAttribute("name")
			option = ppgAddOption(id + " " + name,	id, lstTkn);
		}
	}
}

function ppgFillProgListBox()
{
	var strTkn = lstTkn.options[lstTkn.selectedIndex].value;
	if(strTkn == "selectmenu")return;
	objNugglet.tkn = strTkn
	ppgRemoveAllOptions(lstProg);
	objNugglet.tkn = strTkn;
	var api = parentWnd.cgiPath + "/formdef.exe?_PDL=" + objNugglet.da + "&_TKN=" + objNugglet.tkn + "&_OUT=XML" + "&_XSL=NONE";
	var formDef = ppgPost(api, "Formdef");
	if(!formDef)return;

	var nodes;
	if (objNugglet.type == "menu")
		nodes = formDef.selectNodes("//menu");
	else
		nodes = formDef.selectNodes("//frm_trans");
	var i, j, len2, len = nodes.length;
	var tkn, title, option;
	for(i=0; i<len; i++)
	{
		tkn = nodes[i].getAttribute("TOKEN");
		title = nodes[i].getAttribute("TITLE");
		option = ppgAddOption(tkn + " " + title, tkn, lstProg);
	}
}

function ppgPost(apiCall, service)
{
	var discover = parentWnd.SSORequest(apiCall);
	if (!discover || discover.status)
	{
		var msg="Error calling web server "+service+" service.";
		if (discover)
			msg+="\n" + parentWnd.getHttpStatusMsg(discover.status) +
				"\nServer response: " + discover.statusText + " (" + discover.status + ")"
		parentWnd.cmnDlg.messageBox(msg,"ok","alert");
		return null;
	}
	return discover;
}

function ppgAddItem()
{
	if(ppgAddRemoveItem(lstProg, lstProgSelected))
		if(objNugglet.type != "user")btnMOVE_ALLLEFT.style.display = "block";
}

function ppgAddAllItem()
{
	var i, len = lstProg.options.length;
	for(i=0; i<len; i++)
	{
		ppgAddRemoveItem(lstProg, lstProgSelected, i, false);
	}
	ppgRemoveAllOptions(lstProg);
	btnMOVE_ALLRIGHT.style.display = "none";
	btnMOVE_ALLLEFT.style.display = "block";
}

function ppgRemoveItem()
{
	if(ppgAddRemoveItem(lstProgSelected, lstProg))
		if(objNugglet.type != "user")btnMOVE_ALLRIGHT.style.display = "block";
}

function ppgRemoveAllItem()
{
	var i, len = lstProgSelected.options.length;
	for(i=0; i<len; i++)
	{
		ppgAddRemoveItem(lstProgSelected, lstProg, i, false);
	}
	ppgRemoveAllOptions(lstProgSelected);
	btnMOVE_ALLRIGHT.style.display = "block";
	btnMOVE_ALLLEFT.style.display = "none";
}

function ppgAddRemoveItem(srcList, destList, index, bRemove)
{
	if(typeof(index) == "undefined")index = srcList.selectedIndex;
	if(index == -1)return false;
	if(typeof(bRemove) == "undefined")bRemove = true;
	var srcOption, newOption=null;
	srcOption = srcList.options[index];
	if(!srcOption || typeof(srcOption) == "undefined")return false;

	if(objNugglet.type != "user")
	{
		newOption = ppgAddOption(srcOption.text, srcOption.value, destList);
		if(bRemove)srcList.removeChild(srcOption);
	}
	else
	{
		if (srcList.id == "lstProg")
			newOption = ppgAddOption(srcOption.text, srcOption.value, destList);
		else
			if(bRemove)srcList.removeChild(srcOption);
	}

	if(newOption && destList.id == "lstProgSelected")
	{
		if(objNugglet.type != "user")
		{
			newOption.caption = newOption.text;
			newOption.description = newOption.caption;
			newOption.url = "_PDL=<<PDL>>&_TKN="+newOption.value;
			newOption.curpos = srcOption.curpos;
		}
		else
		{
			newOption.caption = "";
			newOption.description = "";
			newOption.url = "";
			newOption.curpos = "";
		}
	}
	if(srcList.id == "lstProgSelected")	ppgPopulateFields(true); //Clears fields
	btnApply.disabled = false;
	return true;
}

function ppgPopulateFields(bClear)
{
	if(bClear)
	{
		txtCaption.value = "";
		txtDescription.value = "";
		txtURL.value = "";
		chkCurPos.checked = false;
	}
	else
	{
		if(lstProgSelected.selectedIndex == -1)return;
		var option = lstProgSelected.options[lstProgSelected.selectedIndex];
		txtCaption.value = option.caption;
		txtDescription.value = option.description;
		txtURL.value = option.url;
		chkCurPos.checked = option.curpos;
	}
}

function ppgPopulateOption(objSrcElm)
{
	if(lstProgSelected.selectedIndex == -1)return;
	var option = lstProgSelected.options[lstProgSelected.selectedIndex];
	switch (objSrcElm.id)
	{
		case "txtCaption":
			if(option.caption != txtCaption.value)
			{
				option.caption = txtCaption.value;
				option.text = option.caption;
				btnApply.disabled=false;
			}
			break;
		case "txtDescription":
			if(option.description != txtDescription.value)
			{
				option.description = txtDescription.value;
				btnApply.disabled=false;
			}
			break;
		case "txtURL":
			if(option.url != txtURL.value)
			{
				if(objNugglet.type == "user")
				{
					if(txtURL.value != "" && txtURL.value.toLowerCase().indexOf("www.") == 0)
						txtURL.value = "http://"+txtURL.value;
				}
				option.url = txtURL.value;
				btnApply.disabled=false;
			}
			break;
		case "chkCurPos":
			option.curpos = chkCurPos.checked;
			btnApply.disabled=false;
			break;
	}
}

function ppgMove(strDir)
{
	if(lstProgSelected.selectedIndex == -1)return;
	var node1 = lstProgSelected.options[lstProgSelected.selectedIndex];

	var index, node2=null;
	if(strDir == "up")
	{
		index = lstProgSelected.selectedIndex - 1;
		if(index >= 0)
			node2=lstProgSelected.options[index];
	}
	else if(strDir == "down")
	{
		index = lstProgSelected.selectedIndex + 1;
		if(index < lstProgSelected.options.length)
			node2=lstProgSelected.options[index];
	}
	if(node2)
	{
		node1.swapNode(node2);
		//lstProgSelected.selectedIndex = index;
		btnApply.disabled = false;
	}
}

function ppgUpdate()
{
	var orig = objOrigNugglet.propertyBag.objects.item("menudata");
	if(orig.state == "uninitialized")orig.menuitems = new parentWnd.LawCollection();
	else orig.menuitems.removeAll();
	var nugNode = doc.pageXML.selectSingleNode("//NAVLETS/*[@id='" + objOrigNugglet.id +"']");
	for(var i=nugNode.childNodes.length - 1; i >=0; i--)
		nugNode.removeChild(nugNode.childNodes[i]);

	var newitem, item, childNode, len = lstProgSelected.options.length;
	for(i=0; i<len; i++)
	{
		item = lstProgSelected.options[i];
		newitem = new Object();
		newitem.tkn = (objNugglet.type == "user")?i:item.value;
		newitem.caption = item.caption;
		newitem.description = item.description;
		newitem.url = item.url;
		newitem.curpos = item.curpos;
		orig.menuitems.add(newitem.tkn, newitem);

		childNode = doc.pageXML.createElement("submenu");
		childNode.setAttribute("TKN", newitem.tkn);
		childNode.setAttribute("TKNValue", newitem.caption);
		childNode.setAttribute("TKNDesc", newitem.description);
		childNode.setAttribute("TKNURL", newitem.url);
		childNode.setAttribute("TKNCurPos", newitem.curpos);
		nugNode.appendChild(childNode);
	}
	orig.state = "initialized";
	window.returnValue = "changed";
	btnApply.disabled = true;
}

function ppgOK()
{
	if(!btnApply.disabled)ppgUpdate();
	window.close();
}
