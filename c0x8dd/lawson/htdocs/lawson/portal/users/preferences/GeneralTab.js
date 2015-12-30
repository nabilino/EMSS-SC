/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/users/preferences/GeneralTab.js,v 1.10.2.16.4.19.12.5.2.12 2012/08/08 12:37:27 jomeli Exp $ */
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

GeneralTab.prototype = new TabPage();
GeneralTab.prototype.constructor = GeneralTab;
GeneralTab.superclass = TabPage.prototype;

function GeneralTab(id,pageMgr)
{
	GeneralTab.superclass.setId.call(this,id);
	GeneralTab.superclass.setManager.call(this,pageMgr);

	this.arrPrinter=new Array();
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.activate = function()
{
	try 
	{
		var elem = this.mgr.document.getElementById("selLocale");
		elem.focus();
		if (elem.selectedIndex == -1 && elem.options.length)
			elem.selectedIndex = 0;
	} catch (e) { }
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.apply = function()
{
	var locale = this.diffValues("selLocale");
	var dataarea = this.diffValues("selPDL");
	var printer = this.diffValues("selDefPrinter");
	var separator = this.diffValues("selDefValSep");

	if (locale == null && dataarea == null && printer == null && separator == null)
		return true;

	// call RmUpdate service for RM attributes
	var iosVersion=this.mgr.portalWnd.oPortalConfig.getShortIOSVersion();
	var args = "";
	if (dataarea != null)
		args += ("?productline=" + (dataarea == "" ? "%20" : dataarea));
	if (separator != null)
	{
		args += (args == "" ? "?" : "&");
		args += ("defvalsep=" + (separator == "" ? "%20" : separator));
	}
	var msg = this.mgr.wnd.parent.oMsgs.getPhrase("msgSaveError")+" (calling RmUpdate)";
	if (args != "")
	{
		var response = this.mgr.portalWnd.httpRequest("/servlet/RmUpdate" + args, null, "", "", false);
		if (this.mgr.portalWnd.oError.isErrorResponse(response,true,true,false,msg,window))
			return;

		// check for individual attribute update failure
		var ds = this.mgr.portalWnd.oError.getDSObject();
		var oMsgNodes = ds.getElementsByTagName("MSG");
		var len = (oMsgNodes ? oMsgNodes.length : 0);
		if (len)			
		{
			msg += "\n\n";
			for (var i=0; i < len; i++)
				msg += oMsgNodes[i].firstChild.nodeValue + "\n";
			this.mgr.portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
			return false;
		}
	}

	// call webprofile for GEN attributes
	args = "";
	if (locale != null)
		args += ("?Locale=" + (locale == "" ? "%20" : locale));
	if (printer != null)
	{
		args += (args == "" ? "?" : "&");
		args += ("PrinterName=" + (printer == "" ? "%20" : printer));
	}

	if (args != "")
	{
		var outType = "text/xml";
		args+="&OUT=XML";

		var response = this.mgr.portalWnd.httpRequest("/cgi-lawson/webprofile.exe" + args, 
				null, "", outType, false);
		msg = this.mgr.wnd.parent.oMsgs.getPhrase("msgSaveError")+" (calling webprofile.exe)\n";

		if (this.mgr.portalWnd.oError.isErrorResponse(response,true,true,false,msg,this.mgr.wnd))
			return;

		// check for individual attribute update failure
		var ds = this.mgr.portalWnd.oError.getDSObject();
		var oMsgNodes = ds.getElementsByTagName("MSG");
		var len = (oMsgNodes ? oMsgNodes.length : 0);
		if (len)
		{
			msg += "\n\n";
			for (var i=0; i < len; i++)
				msg += oMsgNodes[i].firstChild.nodeValue + "\n";
			this.mgr.portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
			return false;
		}

	}
	return true;
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.deactivate = function()
{
	return true;
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.diffValues = function(id)
{
	var value;
	if (id != "selDefPrinter")
		value = this.getSelValue(id);
	else
		value = this.getTextValue(id);
		
	if (value != null && this.getValue(id) != value)
		return value;
	else
		return null;
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.getCbxValue = function(obj)
{
	if (typeof(obj) == "object")
		return (obj.checked) ? "1" : "0";
	else
		return (obj == "1") ? true : false;
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.getDisabledState = function(typ)
{
	var optNode=this.mgr.portalWnd.oPortalConfig.getUserOption(typ);
	return (optNode && optNode.getAttribute("disable") == "1"
		 ? true : false);
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.getTextValue = function(id)
{
	var elem = this.mgr.document.getElementById(id);
	return elem.value;
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.getSelValue = function(id)
{
	var elem = this.mgr.document.getElementById(id);
	return (elem.selectedIndex > -1) ? elem.options[elem.selectedIndex].value : null;
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.getValue = function(id)
{
	switch (id)
	{
	case "selLocale":
		return this.mgr.wnd.parent.profile.getAttribute("locale");
		break;
	case "selPDL":
		return this.mgr.wnd.parent.profile.getAttribute("productline");
		break;
	case "selDefPrinter":
		return this.mgr.wnd.parent.profile.getAttribute("printername");
		break;
	case "selDefValSep":
		return this.mgr.wnd.parent.profile.getAttribute("defvalsep");
		break;
	default:
		return this.mgr.wnd.parent.profile.getPreference(id);
	}
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.init = function()
{
	// set the labels text (if not English)
	if (this.mgr.portal.getLanguage() != "en-us")
	{
	//NOTE: this will set the labels and titles for all tabs
		var lblElems = this.mgr.document.getElementsByTagName("LABEL");
		var len = lblElems.length;
		for (var i = 0; i < len; i++)
		{
			var lbl = lblElems[i];
			try {
				var ph=this.mgr.msgs.getPhrase(lbl.id);
				if (ph!=lbl.id)
					this.mgr.portalWnd.cmnSetElementText(lbl,ph);
			} catch (e) { }
		}

		// set button titles
		lblElems=this.mgr.document.getElementsByTagName("BUTTON");
		len = lblElems.length;
		for (var i = 0; i < len; i++)
		{
			var btn = lblElems[i];
			phId="lbl"+btn.id.substr(3);
			var ph=this.mgr.msgs.getPhrase(phId);
			if (ph != phId)
				btn.setAttribute("title",ph);
		}
	}
	this.setLocaleOptions();
	this.setDataAreaOptions();
	this.setPrinterOptions();
	this.setReportOptions();
	this.setDefValueOptions();
	this.setToolbarDisplayOptions();
	this.setLeftbarOptions();
	this.setNavletOptions();

	// allow auto select required fields?
	var inp = this.mgr.document.getElementById("cbxAutoSelect");
	inp.checked = this.getCbxValue(this.getValue("autoselect"));
	inp.disabled = this.getDisabledState("autoselect");

	// allow list style presentation?
	inp = this.mgr.document.getElementById("cbxUseLists");
	inp.checked = this.getCbxValue(this.getValue("uselist"));
	inp.disabled = this.getDisabledState("uselist");

	// allow display field help?
	inp = this.mgr.document.getElementById("cbxFldHelp");
	inp.checked = this.getCbxValue(this.getValue("fieldhelp"));

	// use field advance?
	if (!this.mgr.portalWnd.oBrowser.isIE)
	{
		var elem = this.mgr.document.getElementById("cbxFldAdvance");
		if (elem) elem.style.display = "none";
		elem = this.mgr.document.getElementById("lblFldAdvance");
		if (elem) elem.style.display = "none";
		elem = this.mgr.document.getElementById("cbxUseShortDate");
		if (elem) elem.style.display = "none";
		elem = this.mgr.document.getElementById("lblUseShortDate");
		if (elem) elem.style.display = "none";
	}
	else
	{
		var useAdv = this.getCbxValue(this.getValue("fieldadvance"));
		inp = this.mgr.document.getElementById("cbxFldAdvance");
		inp.checked = this.getCbxValue(this.getValue("fieldadvance"));
		inp = this.mgr.document.getElementById("cbxUseShortDate");
		inp.checked = this.getCbxValue(this.getValue("useshortdate"));
		if (!useAdv)
		{
			inp.disabled=true;
			elem = this.mgr.document.getElementById("lblUseShortDate");
			if (elem) elem.disabled = true;;
		}
	}

	return true;
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.onKeyDown = function(evt)
{
	return true;
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.onClickCbx = function(evt, cbx)
{
	this.mgr.setModified();
	switch (cbx.id)
	{
	case "cbxAutoSelect":
		this.setValue("autoselect", this.getCbxValue(cbx));
		break;
	case "cbxUseLists":
		this.setValue("uselist", this.getCbxValue(cbx));
		break;
	case "cbxFldHelp":
		this.setValue("fieldhelp", this.getCbxValue(cbx));
		break;
	case "cbxFldAdvance":
		this.setValue("fieldadvance", this.getCbxValue(cbx));
		var inp = this.mgr.document.getElementById("cbxUseShortDate");
		var lbl = this.mgr.document.getElementById("lblUseShortDate");
		inp.disabled = !cbx.checked;
		lbl.disabled = !cbx.checked;
		break;
	case "cbxUseShortDate":
		this.setValue("useshortdate", this.getCbxValue(cbx));
		break;
	}
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.onSelectionChange = function(elem)
{
	var item;
	var selIndex = elem.selectedIndex;
	if (selIndex < 0) return;
	this.mgr.setModified();

	switch (elem.id)
	{
	// falls through to break
	case "selLocale":
	case "selPDL":
	case "selDefValSep":
		break;

	case "selDefPrinter":
		var elemDesc=this.mgr.document.getElementById("lblPrintDesc");
		if (elemDesc)
			this.mgr.portalWnd.cmnSetElementText(elemDesc,this.arrPrinter[selIndex]);
		break;

	case "selDefRptType":
		this.setValue("reportformat", elem.options[selIndex].value);
		break;

	case "selToolbarDisplay":
		this.setValue("toolbardisplay", elem.options[selIndex].value);
		break;

	case "selLeftbarState":
		this.setValue("leftbarstate", elem.options[selIndex].value);
		break;

	case "selAutoOpenNavlets":
		this.setValue("autonavlet", elem.options[selIndex].value);
		break;
	}
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.setDataAreaOptions = function()
{
	var elem = document.getElementById("selPDL");
	elem.disabled=this.getDisabledState("pdl");
	
	//Changed calling DRILL instead of prodproj.exe to get the dataarea - PT 145460
	var call = this.mgr.portalWnd.IDAPath+"?OUT=XML&_TYP=SL&_KNB=@da&_RECSTOGET=200";
	var response = this.mgr.portalWnd.httpRequest(call, null, null, "text/plain");

	var msg = this.mgr.wnd.parent.oMsgs.getPhrase("msgErrorLoadDataAreas") + " (drill around engine)";
	this.mgr.portalWnd.oError.setMessage(msg);
	if (this.mgr.portalWnd.oError.isErrorResponse(response,true,true))
	{
		elem.className = "xtTextBoxDisabled";
		elem.disabled = true;
		return;
	}

	var ds = this.mgr.portalWnd.oError.getDSObject();
	var daNodes = ds.document.getElementsByTagName("LINE");
	var len = daNodes.length;
	var index = -1;
	
	if (len != 0)
	{
		var strCurrent = this.getValue(elem.id);
		for (var i=0; i < len; i++)
 		{
			var keyNodes = daNodes[i].getElementsByTagName("KEYFLD");
			var keyLen = keyNodes.length;
			if (keyLen > 0 && keyNodes[0].hasChildNodes())
			{
				daName=this.mgr.portalWnd.trim(keyNodes[0].childNodes[0].nodeValue);
				index = elem.options.length;
				this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elem, daName, daName);
				if (strCurrent == elem.options[index].value)
					elem.options[index].selected = true;
			
			}
		}
	}
	
	if (elem.options.length == 0)
	{
		this.arrPrinter[this.arrPrinter.length]="";
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elem, 
				this.mgr.wnd.parent.oMsgs.getPhrase("lblNone"), "");
	}	
}

GeneralTab.prototype.onPrinterBlur = function()
{
	var elem = document.getElementById("selDefPrinter");
	if (elem)
	{
		setPrinterDescOnBlur(elem.value);
		window.tabMgr.setModified();
	}
	else
		return;
}

GeneralTab.prototype.doPrinterSelect = function()
{
	var IDACall = "/servlet/Router/Drill/Erp?_OUT=XML&_TYP=SL&_KNB=@pt";
	portalObj.drill.doSelect(window, "returnPrinterSelect", IDACall, portalWnd.IDAPath, true);
}

function setPrinterDescription(strCurrent)
{
	
	var elem = document.getElementById("selDefPrinter");
	var ds = this.portalWnd.oError.getDSObject();
	var setWidth = false;
	var lineNodes = ds.getElementsByTagName("LINE");
	var len = lineNodes.length;
	var index = -1;

	if (len != 0)
	{

		for (var i=0; i < len; i++)
 		{
 			var colNodes = lineNodes[i].getElementsByTagName("COL");
			var colLen = colNodes.length;
			var prName = "";
			var prDesc = "";
			
			if (colLen == 2 && colNodes[1].hasChildNodes())
			{
				prDesc=this.portalWnd.trim(colNodes[1].childNodes[0].nodeValue);
				
				if ( prDesc && prDesc.toLowerCase() == "default printer")
					continue;
				var keyNodes = lineNodes[i].getElementsByTagName("KEYFLD");
				var keyLen = keyNodes.length;
				if (keyLen > 0 && keyNodes[0].hasChildNodes())
				{
					prName=this.portalWnd.trim(keyNodes[0].childNodes[0].nodeValue);
					if (prName == this.portalWnd.trim(strCurrent))
						break;
					else
						prDesc="";
				}
			}
		}

		var elemDesc=this.document.getElementById("lblPrintDesc");
		
		if (elemDesc)
			elemDesc.innerHTML = prDesc;
			
		elem.value = strCurrent;
	}

}



function setPrinterDescOnBlur(input){
	
	var arrPage=new Array();
	var elem = document.getElementById("selDefPrinter");
	var prName = "";
	var prDesc = "";
	var x =0;
	var ds;
	var page;
	
	
	
	var call = this.portalWnd.IDAPath +"?_OUT=XML&_TYP=SL&_KNB=@pt";
	var response = this.portalWnd.httpRequest(call, null, "", "", false);
	var msg = this.parent.oMsgs.getPhrase("msgErrorLoadPrinters") +
			" (calling drill around engine)";
				this.portalWnd.oError.setMessage(msg);
				
				if (this.portalWnd.oError.isErrorResponse(response,true,true))
				{
					elem.className = "xtTextBoxDisabled";
					elem.disabled = true;
					return;
				}
				
				
				
				 ds = this.portalWnd.oError.getDSObject();			
				 page = ds.getElementsByTagName("NEXTPAGE");
					if(page[0].childNodes[0] == null){
						var lineNodes = ds.getElementsByTagName("LINE");
						var len = lineNodes.length;
					}else{
						var pageVal = page[0].childNodes[0].nodeValue;
						var lineNodes = ds.getElementsByTagName("LINE");
						var len = lineNodes.length;
					}
				
	do{
			if(x == 1){
				
				
				 call = this.portalWnd.IDAPath + pageVal.replace("Drill/Erp","");
				 response = this.portalWnd.httpRequest(call, null, "", "", false);
				 msg = this.parent.oMsgs.getPhrase("msgErrorLoadPrinters") +
						" (calling drill around engine)";
				this.portalWnd.oError.setMessage(msg);
				
				if (this.portalWnd.oError.isErrorResponse(response,true,true))
				{
					elem.className = "xtTextBoxDisabled";
					elem.disabled = true;
					return;
				}
				
				 ds = this.portalWnd.oError.getDSObject();			
				 page = ds.getElementsByTagName("NEXTPAGE");
				
				if(page[0].childNodes[0] == null){
					var lineNodes = ds.getElementsByTagName("LINE");
					var len = lineNodes.length;
				}else{
					var pageVal = page[0].childNodes[0].nodeValue;
					var lineNodes = ds.getElementsByTagName("LINE");
					var len = lineNodes.length;
				}
				
			}
			for (var i=0; i < len; i++)
				{
					var colNodes = lineNodes[i].getElementsByTagName("COL");
					var colLen = colNodes.length;
					if (colLen == 2 && colNodes[1].hasChildNodes())
					{
						prDesc=this.portalWnd.trim(colNodes[1].childNodes[0].nodeValue);
						
						if ( prDesc && prDesc.toLowerCase() == "default printer")
							continue;
						var keyNodes = lineNodes[i].getElementsByTagName("KEYFLD");
						var keyLen = keyNodes.length;
						if (keyLen > 0 && keyNodes[0].hasChildNodes())
						{
							prName=this.portalWnd.trim(keyNodes[0].childNodes[0].nodeValue);
							if (prName == this.portalWnd.trim(input))
								break;
							else{
								x=1;
								prDesc="";
								}
						}
					}
				}
				
				

				var elemDesc=this.document.getElementById("lblPrintDesc");
				if (elemDesc)
					elemDesc.innerHTML = prDesc;					
				elem.value = input;
				
				if(page[0].childNodes[0] == null && prDesc == ""){
					break;
				}
		
	}while(prDesc == ""  )
}


function returnPrinterSelect(retVal)
{
	var value = "";
	var description = "";
	var keyValue = null;
	var cols = null
	

	if(!retVal)
		return;
	else
	{
		keyValue = retVal.getElementsByTagName("KEYFLD");
		cols = retVal.columns;
		
		for(var i = 0;i < keyValue.length; i++)
		{
			value = (keyValue[i].hasChildNodes()? keyValue[i].childNodes[0].nodeValue:"");
		}
	

		var elem = document.getElementById("selDefPrinter");
		if (elem)
		{
			if (elem.value != value)
			{
				window.tabMgr.setModified();
				setPrinterDescription(value);
			}
			elem.value = value;
		}
	}
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.setDefValueOptions = function()
{
	var elem = document.getElementById("selDefValSep");
	elem.disabled = this.getDisabledState("separator");
	var aryLabel = new Array("lblComma", "lblTab", "lblSemicolon");
	var len = aryLabel.length;
	var strCurrent = this.getValue(elem.id);
	var index;

	for (var i=0; i<len; i++)
	{
		index = elem.options.length;
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elem, 
				this.mgr.wnd.parent.oMsgs.getPhrase(aryLabel[i]), i);
		if	(strCurrent == elem.options[index].value)
			elem.options[index].selected = true;
	}
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.setLeftbarOptions = function()
{
	var elem = document.getElementById("selLeftbarState");
	elem.disabled=this.getDisabledState("leftbarstate");
	var aryLabel = new Array("lblDefault", "lblHide", "lblRestore") 
	var len = aryLabel.length;
	var strCurrent = this.getValue("leftbarstate");
	var index;

	for (var i=0; i<len; i++)
	{
		if (aryLabel[i].length == "0")
			continue;
		index = elem.options.length;
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elem, 
				this.mgr.wnd.parent.oMsgs.getPhrase(aryLabel[i]), i);
		if	(strCurrent == elem.options[index].value)
			elem.options[index].selected = true;
	}
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.setLocaleOptions = function()
{
	var elem = document.getElementById("selLocale");
	elem.disabled=this.getDisabledState("locale");

	var call = this.mgr.portalWnd.IDAPath + "?_OUT=XML&_TYP=SL&_KNB=@lc";
	var response = this.mgr.portalWnd.httpRequest(call, null, "", "", false);

	var msg = this.mgr.wnd.parent.oMsgs.getPhrase("msgErrorLoadLocales") +
				" (calling drill around engine)";
	this.mgr.portalWnd.oError.setMessage(msg);
	if (this.mgr.portalWnd.oError.isErrorResponse(response,true,true))
	{
		elem.className = "xtTextBoxDisabled";
		elem.disabled = true;
		return;
	}

	var ds = this.mgr.portalWnd.oError.getDSObject();

	// insert 'default' locale
	this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elem, 
			this.mgr.wnd.parent.oMsgs.getPhrase("lblDefault"), "");
	elem.options[0].selected = true;
	
	var locNodes = ds.document.getElementsByTagName("COL");
	var len = locNodes.length;
	var index;
 	if (len == 0) return;
	var strCurrent = this.getValue(elem.id);

	// add all the retrieved locales
 	for (var i=0; i < len; i++)
	{
		var node = locNodes[i];
		if (node.hasChildNodes())
		{
			index = elem.options.length;
			this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elem, 
					node.childNodes[0].nodeValue, node.childNodes[0].nodeValue);
			if (strCurrent == elem.options[index].value)
				elem.options[index].selected = true;
		}
	}
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.setNavletOptions = function()
{
	var elem = document.getElementById("selAutoOpenNavlets");
	elem.disabled=this.getDisabledState("autonavlet");
	var aryLabel = new Array("lblOpenFirst", "lblOpenAll", "lblRestore") 
	var len = aryLabel.length;
	var strCurrent = this.getValue("autonavlet");
	var index;

	for (var i=0; i < len; i++)
	{
		if (aryLabel[i].length == "0")
			continue;
		index = elem.options.length;
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elem, 
				this.mgr.wnd.parent.oMsgs.getPhrase(aryLabel[i]), i);
		if	(strCurrent == elem.options[index].value)
			elem.options[index].selected = true;
	}
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.setPrinterOptions = function()
{
	var elem = document.getElementById("selDefPrinter");
	var selButtonPrinters = document.getElementById("imgSelBtn2");
	selButtonPrinters.disabled=this.getDisabledState("printer");

	var call = this.mgr.portalWnd.IDAPath + "?_OUT=XML&_TYP=SL&_KNB=@pt";
	var response = this.mgr.portalWnd.httpRequest(call, null, "", "", false);

	var msg = this.mgr.wnd.parent.oMsgs.getPhrase("msgErrorLoadPrinters") +
				" (calling drill around engine)";
	this.mgr.portalWnd.oError.setMessage(msg);
	if (this.mgr.portalWnd.oError.isErrorResponse(response,true,true))
	{
		elem.className = "xtTextBoxDisabled";
		elem.disabled = true;
		return;
	}

	var ds = this.mgr.portalWnd.oError.getDSObject();
	var setWidth = false;
	var lineNodes = ds.getElementsByTagName("LINE");
	var len = lineNodes.length;
	var index = -1;

	if (len != 0)
	{
		var strCurrent = this.getValue(elem.id);
		
		//len = ((len > 1001) ? 1001 : len);

		for (var i=0; i < len; i++)
 		{
 			var colNodes = lineNodes[i].getElementsByTagName("COL");
			var colLen = colNodes.length;
			var prName = "";
			var prDesc = "";
			
			if (colLen == 2 && colNodes[1].hasChildNodes())
			{
				prDesc=this.mgr.portalWnd.trim(colNodes[1].childNodes[0].nodeValue);
				if ( prDesc && prDesc.toLowerCase() == "default printer")
					continue;
				var keyNodes = lineNodes[i].getElementsByTagName("KEYFLD");
				var keyLen = keyNodes.length;
				if (keyLen > 0 && keyNodes[0].hasChildNodes())
				{
					prName=this.mgr.portalWnd.trim(keyNodes[0].childNodes[0].nodeValue);
					if (prName == strCurrent)
					{
						var elemDesc=this.mgr.document.getElementById("lblPrintDesc");
						if (elemDesc)
							this.mgr.portalWnd.cmnSetElementText(elemDesc,prDesc);
						break;
					}
				}
			}
		}
		/*
			var keyNodes = lineNodes[i].getElementsByTagName("KEYFLD");
			var keyLen = keyNodes.length;

			if (keyLen > 0 && keyNodes[0].hasChildNodes())
			{
				prName=this.mgr.portalWnd.trim(keyNodes[0].childNodes[0].nodeValue);
				index = elem.options.length;
				this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elem, prName, prName);
				this.arrPrinter[this.arrPrinter.length]=prDesc;
				if (prName.length > 11)
					setWidth = true;
				if (strCurrent == elem.options[index].value)
					elem.options[index].selected = true;
			}
		}
		*/
			
		elem.value = strCurrent;
	}
	/*
	if (elem.options.length == 0)
	{
		this.arrPrinter[this.arrPrinter.length]="";
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elem, 
				this.mgr.wnd.parent.oMsgs.getPhrase("lblNone"), "");
	}
	else
	{
		var selIndex = elem.selectedIndex;
		if (selIndex > -1)
		{
			var elemDesc=this.mgr.document.getElementById("lblPrintDesc");
			if (elemDesc)
				this.mgr.portalWnd.cmnSetElementText(elemDesc,this.arrPrinter[selIndex]);
		}
	}
	if (setWidth)
		elem.style.width = "";
		*/
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.setReportOptions = function()
{
	var elem = document.getElementById("selDefRptType");
	elem.disabled=this.getDisabledState("reportformat");

	var aryLabel = new Array("", "lblPdf", "lblText" ,"lblLSR");
	var len = aryLabel.length;
	var strCurrent = ((this.getValue("reportformat") != "3") ? this.getValue("reportformat") : "3");
	var index;

	for (var i=0; i<len; i++)
	{
		if (aryLabel[i].length == "0")
			continue;
		index = elem.options.length;
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elem, 
				this.mgr.wnd.parent.oMsgs.getPhrase(aryLabel[i]), i);
		if	(strCurrent == elem.options[index].value)
			elem.options[index].selected = true;
	}
}
//-----------------------------------------------------------------------------
GeneralTab.prototype.setToolbarDisplayOptions = function()
{
	var elem = document.getElementById("selToolbarDisplay");
	elem.disabled=this.getDisabledState("toolbardisplay");
	var aryLabel = new Array("lblBtnText", "lblBtnIcon", "lblBtnTextIcon") 
	var len = aryLabel.length;
	var strCurrent = this.getValue("toolbardisplay");
	var index;

	for (var i=0; i<len; i++)
	{
		if (aryLabel[i].length == "0")
			continue;
		index = elem.options.length;
		this.mgr.portalWnd.cmnCreateSelectOption(this.mgr.document, elem, 
				this.mgr.wnd.parent.oMsgs.getPhrase(aryLabel[i]), i);
		if	(strCurrent == elem.options[index].value)
			elem.options[index].selected = true;
	}
}

//-----------------------------------------------------------------------------
GeneralTab.prototype.setValue = function(id, value)
{
	this.mgr.wnd.parent.profile.setPreference(id, value);
}
