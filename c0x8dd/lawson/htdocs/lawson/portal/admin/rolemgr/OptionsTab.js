/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/admin/rolemgr/Attic/OptionsTab.js,v 1.1.2.9.4.5.12.1.2.7 2012/08/08 12:37:29 jomeli Exp $ */
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

OptionsTab.prototype = new TabPage();
OptionsTab.prototype.constructor = OptionsTab;
OptionsTab.superclass = TabPage.prototype;

function OptionsTab(id,pageMgr)
{
	OptionsTab.superclass.setId.call(this,id);
	OptionsTab.superclass.setManager.call(this,pageMgr);
	this.modified=false;
}

//-----------------------------------------------------------------------------
OptionsTab.prototype.activate=function()
{
	try {
		var elem=this.mgr.document.getElementById("selLocaleRequired");
		elem.focus();
		elem.select();
	} catch (e) { }
}

//-----------------------------------------------------------------------------
OptionsTab.prototype.apply=function()
{
	if (!this.modified)
		return true;

	return true;
}

//-----------------------------------------------------------------------------
OptionsTab.prototype.deactivate=function()
{
	return true;
}

//-----------------------------------------------------------------------------
OptionsTab.prototype.getOptionNode=function(id)
{
	var node=this.mgr.storage.getNodeByAttributeId("USEROPTION","id",id);
	if(!node)
	{
		userOptionsNode = this.mgr.storage.getElementsByTagName("USEROPTIONS")[0]
		userOptionsLength = userOptionsNode.length
		var userOptionsSW = null
		for (i = 0; i < userOptionsLength; i++)
		{
			otherOptionsNode = userOptionsNode[i].getAttributeNode("id").value
			if ("otheroptions" == otherOptionsNode)
			{
				userOptionsSW = 1;
			}
		}
		if (!userOptionsSW)
		{
			var otherOptions = this.mgr.storage.document.createElement("USEROPTION");
			otherOptions.setAttribute("id","otheroptions")
			otherOptions.setAttribute("defval","")
			otherOptions.setAttribute("reqval","")
			otherOptions.setAttribute("disable","0")
			userOptionsNode.appendChild(otherOptions)
		}
	}
	return node;
}

//-----------------------------------------------------------------------------
OptionsTab.prototype.init=function()
{
	this.setDataAreaOptions();
	this.setReportOptions();
	this.setLocaleDisplayOptions();
	this.setPrinterOptions();
	this.setSeparatorOptions();
	this.setToolbarDisplayOptions();

	this.setYesNoOptions("autoselect");
	this.setYesNoOptions("uselist");

	this.setSelectOptions("explorer");
	this.setSelectOptions("select");
	this.setSelectOptions("list");

	this.setFindFilterOptions("otheroptions");
	return true;
}

//-----------------------------------------------------------------------------
OptionsTab.prototype.onClickCbx=function(evt,cbx)
{
	var type=cbx.id.substr(3).toLowerCase();
	var iPos=type.indexOf("disable");
	var value = cbx.checked ? "1" : "0";
	type = type.substr(0,iPos);

	this.setValue(type, "disable", value);
}

//-----------------------------------------------------------------------------
OptionsTab.prototype.onKeyDown=function(evt)
{
	return true;
}

//-----------------------------------------------------------------------------
OptionsTab.prototype.onResize=function()
{

	var tbl=this.mgr.document.getElementById("optionsTbl");
	if (!tbl) return;
	var paneElem=tbl.parentNode;
	var newWidth = (parseInt(paneElem.offsetWidth,10) > 600 
		? "600px" 
		: (parseInt(paneElem.offsetWidth,10) < 400 
				? "400px" 
				: parseInt(paneElem.offsetWidth,10)-30+"px"));
	tbl.style.width=newWidth;
}

//-----------------------------------------------------------------------------
OptionsTab.prototype.onSelectionChange = function(elem)
{
	var item;
	var selIndex = elem.selectedIndex;
	if (selIndex < 0) return;

	var type=elem.id.substr(3).toLowerCase();
	var iPos=type.indexOf("required");
	var attr = (iPos != -1 ? "reqval" : "defval");
	iPos = (iPos != -1 ? iPos : type.length - 7);
	type = type.substr(0,iPos);

	this.setValue(type, attr, elem.options[selIndex].value);
}

//-----------------------------------------------------------------------------
OptionsTab.prototype.setDataAreaOptions = function()
{
	var elemReq = this.mgr.document.getElementById("selPDLRequired");
	var call = this.mgr.portalWnd.PRODPROJPath+"?OUT=TEXT";
	var response = this.mgr.portalWnd.httpRequest(call, null, null, "text/plain", false);

	var sMsg = this.mgr.msgs.getPhrase("msgErrorLoadDataAreas")+"\n\n";
	if (this.mgr.portalWnd.oError.handleBadResponse(response,true,sMsg,window))
	{
		elemReq.className = "xtTextBoxDisabled";
		elemReq.disabled = true;
		return;
	}

	// get option node
	var optNode=this.getOptionNode("pdl");
	var strReq = (optNode ? optNode.getAttribute("reqval") : "");

	// set the checkbox
	this.mgr.document.getElementById("cbxPDLDisabled").checked = 
		(optNode && optNode.getAttribute("disable") == "1" ? true : false);

	// insert the none choice
	this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elemReq, 
				this.mgr.msgs.getPhrase("lblNone"), "");

	if (response.length == 0) return;

	var re = new RegExp("\\n|\\r\\n|\\r","g");
	var names = response.split(re);
	var len = names.length;
	var index;

	// now load all the pdl and projects
	for (var i=0; i < len; i++)
 	{
		index = elemReq.options.length;
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elemReq, 
				names[i], names[i]);
		if (strReq == elemReq.options[index].value)
			elemReq.options[index].selected = true;
	}
}

//-----------------------------------------------------------------------------
OptionsTab.prototype.setLocaleDisplayOptions = function()
{
	var elemReq = this.mgr.document.getElementById("selLocaleRequired");
	var call = this.mgr.portalWnd.IDAPath + "?_OUT=XML&_TYP=SL&_KNB=@lc";
	var response = this.mgr.portalWnd.httpRequest(call);

	var sMsg = this.mgr.wnd.parent.oMsgs.getPhrase("msgErrorLoadLocales")+"\n\n";
	if (this.mgr.portalWnd.oError.handleBadResponse(response,true,sMsg,window))
	{
		elem.className = "xtTextBoxDisabled";
		elem.disabled = true;
		return;
	}

	var ds = new this.mgr.portalWnd.DataStorage(response);

	// insert the none (default) choice
	this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elemReq, 
			this.mgr.msgs.getPhrase("lblNone"), "");
	elemReq.options[0].selected = true;
	
	var optNode=this.getOptionNode("locale");
	var strReq = (optNode ? optNode.getAttribute("reqval") : "");
	var locNodes = ds.document.getElementsByTagName("COL");
	var len = locNodes.length;
	var index;

	// load the required
 	for (var i=0; i < len; i++)
	{
		var node = locNodes[i];
		if (node.hasChildNodes())
		{
			index = elemReq.options.length;
			this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elemReq, 
					node.childNodes[0].nodeValue, node.childNodes[0].nodeValue);
			if (strReq == elemReq.options[index].value)
				elemReq.options[index].selected = true;
		}
	}

	// set the checkbox
	this.mgr.document.getElementById("cbxLocaleDisabled").checked = 
		(optNode && optNode.getAttribute("disable") == "1" ? true : false);
}

//-----------------------------------------------------------------------------
OptionsTab.prototype.setPrinterOptions = function()
{
	var elemReq = document.getElementById("selPrinterRequired");

	var optNode=this.getOptionNode("printer");
	var strReq = (optNode ? optNode.getAttribute("reqval") : "");

	// first insert the none choice
	this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elemReq, 
				this.mgr.msgs.getPhrase("lblNone"), "");

	// now load the required select
	var call = this.mgr.portalWnd.IDAPath + "?_OUT=XML&_TYP=SL&_KNB=@pt&_RECSTOGET=1000";
	var response = this.mgr.portalWnd.httpRequest(call);

	var sMsg = this.mgr.wnd.parent.oMsgs.getPhrase("msgErrorLoadPrinters") +
				" (calling drill around engine)";
	if (this.mgr.portalWnd.oError.handleBadResponse(response,true,sMsg,window))
	{	
		elem.className = "xtTextBoxDisabled";
		elem.disabled = true;
	}
	else
	{
		var lineNodes = response.getElementsByTagName("LINE");
		var len = lineNodes.length;
		var index;
		for (var i=0; i < len; i++)
 		{
 			var colNodes = lineNodes[i].getElementsByTagName("COL");
			var colLen = colNodes.length;
			if (colLen == 2 && colNodes[1].hasChildNodes())
			{
				var prDesc=this.mgr.portalWnd.trim(colNodes[1].childNodes[0].nodeValue);
				if ( prDesc && prDesc.toLowerCase() == "default printer")
					continue;
			}

			var keyNodes = lineNodes[i].getElementsByTagName("KEYFLD");
			var keyLen = keyNodes.length;
			if (keyLen > 0 && keyNodes[0].hasChildNodes())
			{
				var prName=this.mgr.portalWnd.trim(keyNodes[0].childNodes[0].nodeValue);
				index = elemReq.options.length;
				this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elemReq, prName, prName);
				if (strReq == elemReq.options[index].value)
					elemReq.options[index].selected = true;
			}
		}
	}

	// set the checkbox
	this.mgr.document.getElementById("cbxPrinterDisabled").checked = 
		(optNode && optNode.getAttribute("disable") == "1" ? true : false);
}

//-----------------------------------------------------------------------------
OptionsTab.prototype.setReportOptions = function()
{
	var elemReq = this.mgr.document.getElementById("selReportFormatRequired");
	var aryLabel = new Array("lblPdf", "lblText","lblLSR");
	var len = aryLabel.length;

	var optNode=this.getOptionNode("reportformat");
	var strReq = (optNode ? optNode.getAttribute("reqval") : "");

	// first insert the none choice
	this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elemReq, 
				this.mgr.msgs.getPhrase("lblNone"), "");

	// now load the require select
	for (var i=0; i < len; i++)
	{
		if (aryLabel[i].length == "0")
			continue;
		index = elemReq.options.length;
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elemReq, 
				this.mgr.msgs.getPhrase(aryLabel[i]), i+1);
		if	(strReq == elemReq.options[index].value)
			elemReq.options[index].selected = true;
	}

	// set the checkbox
	this.mgr.document.getElementById("cbxReportFormatDisabled").checked = 
		(optNode && optNode.getAttribute("disable") == "1" ? true : false);
}

//-----------------------------------------------------------------------------
OptionsTab.prototype.setSelectOptions = function(type)
{
	var index;
	var aryLabel = this.mgr.portalWnd.oPortalConfig.arrValues;
	var len = aryLabel.length;

	var typeName=type.substr(0,1).toUpperCase()+type.substr(1);
	var elemReq = this.mgr.document.getElementById("sel"+typeName+"Required");

	var optNode=this.getOptionNode(type);
	var strReq = (optNode ? optNode.getAttribute("reqval") : "");

	// first insert the none choice
	this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elemReq, 
				this.mgr.msgs.getPhrase("lblNone"), "");

	for (var i=0; i < len; i++)
	{
		index = elemReq.options.length;
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elemReq, 
				aryLabel[i], aryLabel[i]);
		if	(strReq == elemReq.options[index].value)
			elemReq.options[index].selected = true;
	}

	// set the checkbox
	this.mgr.document.getElementById("cbx"+typeName+"Disabled").checked = 
		(optNode && optNode.getAttribute("disable") == "1" ? true : false);
}

//-----------------------------------------------------------------------------
OptionsTab.prototype.setSeparatorOptions=function()
{
	var elemReq = document.getElementById("selSeparatorRequired");
	var aryLabel = new Array("lblComma", "lblTab", "lblSemicolon");
	var len = aryLabel.length;
	var index;

	var optNode=this.getOptionNode("separator");
	var strReq = (optNode ? optNode.getAttribute("reqval") : "");

	// first insert the none choice
	this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elemReq, 
				this.mgr.msgs.getPhrase("lblNone"), "");

	// now load the required select
	for (var i=0; i<len; i++)
	{
		index = elemReq.options.length;
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elemReq, 
				this.mgr.msgs.getPhrase(aryLabel[i]), i);
		if	(strReq == elemReq.options[index].value)
			elemReq.options[index].selected = true;
	}

	// set the checkbox
	this.mgr.document.getElementById("cbxSeparatorDisabled").checked = 
		(optNode && optNode.getAttribute("disable") == "1" ? true : false);
}

//-----------------------------------------------------------------------------
OptionsTab.prototype.setToolbarDisplayOptions = function()
{
	var elemReq = document.getElementById("selToolbarDisplayRequired");
	var aryLabel = new Array("lblBtnText", "lblBtnIcon", "lblBtnTextIcon") 
	var len = aryLabel.length;
	var index;

	var optNode=this.getOptionNode("toolbardisplay");
	var strReq = (optNode ? optNode.getAttribute("reqval") : "");

	// first insert the none choice
	this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elemReq, 
				this.mgr.msgs.getPhrase("lblNone"), "");

	// now load the required select
	for (var i=0; i < len; i++)
	{
		index = elemReq.options.length;
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elemReq, 
				this.mgr.msgs.getPhrase(aryLabel[i]), i);
		if	(strReq == elemReq.options[index].value)
			elemReq.options[index].selected = true;
	}

	// set the checkbox
	this.mgr.document.getElementById("cbxToolbarDisplayDisabled").checked = 
		(optNode && optNode.getAttribute("disable") == "1" ? true : false);
}

//-----------------------------------------------------------------------------
OptionsTab.prototype.setValue=function(type,attr,val)
{
	var optNode=this.getOptionNode(type);
	if (!optNode) return;
	optNode.setAttribute(attr,val);
	this.mgr.setModified();
}

//-----------------------------------------------------------------------------
OptionsTab.prototype.setYesNoOptions=function(type)
{
	var typeName=type.substr(0,1).toUpperCase()+type.substr(1);
	var elemReq = this.mgr.document.getElementById("sel"+typeName+"Required");
	var aryLabel = new Array("lblYes", "lblNo");
	var len = aryLabel.length;

	var optNode=this.getOptionNode(type);
	var strReq = (optNode ? optNode.getAttribute("reqval") : "");

	// first insert the none choice
	this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elemReq, 
				this.mgr.msgs.getPhrase("lblNone"), "");

	// now load the required select
	  for (var i=len-1, j=0; i > -1; i--, j++)
	{
		if (aryLabel[i].length == "0")
			continue;
		index = elemReq.options.length;
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elemReq, 
				this.mgr.msgs.getPhrase(aryLabel[j]), i);
		if	(strReq == elemReq.options[index].value)
			elemReq.options[index].selected = true;
	}

	// set the checkbox
	this.mgr.document.getElementById("cbx"+typeName+"Disabled").checked = 
		(optNode && optNode.getAttribute("disable") == "1" ? true : false);
}
//-----------------------------------------------------------------------------
OptionsTab.prototype.setFindFilterOptions=function(type)
{
	var typeName=type.substr(0,1).toUpperCase()+type.substr(1);
	var elemReq = this.mgr.document.getElementById("sel"+typeName+"Required");
	var aryLabel = new Array("lblFind","lblFilter");
	var len = aryLabel.length;

	var optNode=this.getOptionNode(type);
	var strReq = (optNode ? optNode.getAttribute("reqval") : "");

	// first insert the none choice
	this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elemReq, 
				this.mgr.msgs.getPhrase("lblNone"), "");

	// now load the required select
	  for (var i=len-1, j=0; i > -1; i--, j++)
	{
		if (aryLabel[i].length == "0")
			continue;
		index = elemReq.options.length;
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elemReq, 
				this.mgr.msgs.getPhrase(aryLabel[j]), j);
		if	(strReq == elemReq.options[index].value)
			elemReq.options[index].selected = true;
	}

	// set the checkbox
	this.mgr.document.getElementById("cbx"+typeName+"Disabled").checked = 
		(optNode && optNode.getAttribute("disable") == "1" ? true : false);
}
