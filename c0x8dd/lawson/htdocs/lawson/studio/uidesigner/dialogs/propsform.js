/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/dialogs/propsform.js,v 1.3.2.2.26.3 2012/08/08 12:48:50 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// propsform.js
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

var tabArray = new Array()
tabArray[0] = "tabGeneral"
tabArray[1] = "tabData"
tabArray[2] = "tabActions"
tabArray[3] = "tabTransfers"
var maxTabIndex=3
var ppgActiveTab=null;

var studioWnd=null;
var sourceWnd=null;
var mFormElem=null;
var oFormDef=null;
var bModified=false;
var formNode=null;
var fldObjArray=new Array();

//-----------------------------------------------------------------------------
function ppgInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	// save dialog arguments
	studioWnd = wndArguments[0]
	sourceWnd = wndArguments[2]
	mFormElem=wndArguments[3]

	// make a local copy of the UI xml
	oFormDef=studioWnd.xmlFactory.createInstance("DOM");
	oFormDef.async=false;
	oFormDef.loadXML(sourceWnd.myDoc.xmlDoc.xml)
	formNode=oFormDef.selectSingleNode("/form")

	// set the active tab
	ppgActiveTab = document.all.tabGeneral

	// initialize values
	try {
		lblTitle.innerText=formNode.getAttribute("TITLE")
		txtFormId.value=formNode.getAttribute("formid")
		if (sourceWnd.myDoc.maxLen && sourceWnd.myDoc.maxLen.length > 0)
			txtFormId.maxLength = sourceWnd.myDoc.maxLen;
		cbxNoTknXfer.checked = formNode.getAttribute("NOTKNXFER") == "1" ? false : true;
		cbxDefaultUI.checked = formNode.getAttribute("defaultui") == "true" ? true : false;
		cbxWorkflowEnabled.checked = formNode.getAttribute("workflow") == "1" ? true : false;

	} catch (e) { }

	if ( genBuildActionList() )
	{
		if (selInitialAction.selectedIndex == -1)
			selInitialAction.selectedIndex=0;
	}
	if ( genBuildDefaultList() )
	{
		if (selDefaultAction.selectedIndex == -1)
			selDefaultAction.selectedIndex=0;
	}
	
	genBuildPropertiesTable()	
	daBuildFieldList()

	cbxEVT.checked=formNode.getAttribute("evttype")=="CHG" ? true : false;
	var rtntype = formNode.getAttribute("rtntype")
	if (!rtntype || rtntype=="ALL")
		rbAll.checked=true
	else
	{
		rbSelected.checked=true
		btnSelFields.disabled=false;
	}

	
	if ( trBuildAssignedList() )
		selTransAssigned.selectedIndex=0;
	trOnAssignedChange();

	// initialize values
	if ( acBuildAssignedList() )
		selActionAssigned.selectedIndex=0;
	if ( acBuildAvailableList() )
		selActionAvailable.selectedIndex=0;
	acOnAssignedChange();
	acOnAvailableChange();

	// show the document
	document.body.style.visibility="visible"
	document.body.style.cursor="auto"
	txtFormId.focus()
	txtFormId.select()
}

//-----------------------------------------------------------------------------
function ppgOnKeyDown()
{
	var bEvtCaught=false;
	switch(event.keyCode)
	{
	case studioWnd.keys.ESCAPE:
		bEvtCaught=true
		window.close()
		break;
	case studioWnd.keys.ENTER:
		switch (event.srcElement.id)
		{
		case "selFieldList":
			btnFieldProps.click()
			bEvtCaught=true
			break;
		case "selActionAssigned":
			btnActionProps.click()
			bEvtCaught=true
			break;
		case "selTransAssigned":
			btnTransProps.click()
			bEvtCaught=true
			break;
		}
		break;
	case studioWnd.keys.PAGE_UP:		// previous tab
		if( !event.altKey && event.ctrlKey && !event.shiftKey )
		{
			ppgActivateTab(-1)
			bEvtCaught=true
		}
		break;
	case studioWnd.keys.PAGE_DOWN:		// next tab
		if( !event.altKey && event.ctrlKey && !event.shiftKey )
		{
			ppgActivateTab(1)
			bEvtCaught=true
		}
		break;
	}
	if (bEvtCaught)
		studioWnd.setEventCancel(event)
	return (!bEvtCaught)
}

//-----------------------------------------------------------------------------
function ppgActivateTab(inc)
{
	var curIndex = parseInt(ppgActiveTab.tabind)
	var tabIndex = curIndex + inc

	if(tabIndex < 0)
		tabIndex = 0
	else if (tabIndex > maxTabIndex)
		tabIndex = maxTabIndex

	if (curIndex != tabIndex)
	{
		var obj = document.getElementById(tabArray[tabIndex])
		obj.fireEvent("onclick")
	}
}

//-----------------------------------------------------------------------------
function ppgSwitchTab(objTab)
{
	if(objTab.id == ppgActiveTab.id) return;

	// make the previously active tab inactive
	ppgActiveTab.className = "dsTabButtonInactive"
	document.all["div" + ppgActiveTab.id.substr(3)].style.display = "none"

	objTab.className = "dsTabButtonActive"
	switch(objTab.id)
	{
		case "tabGeneral":
			divGeneral.style.display = "block"
			txtFormId.focus()
			txtFormId.select()
			break;
		case "tabData":
			divData.style.display = "block"
			selFieldList.focus()
			break;
		case "tabActions":
			divActions.style.display = "block"
			selActionAssigned.focus()
			break;
		case "tabTransfers":
			divTransfers.style.display = "block"
			selTransAssigned.focus()
			break;
	}

	// Make this tab as active tab
	ppgActiveTab = objTab
}

//-----------------------------------------------------------------------------
function ppgEnableApply(bEnable)
{
	if (typeof(bEnable) != "boolean")
		bEnable=true;
	btnApply.disabled=!bEnable
	bModified=bEnable;
}

//-----------------------------------------------------------------------------
function ppgOK()
{
	if (!btnApply.disabled)
	{
		if (!ppgUpdate())
			return;
	}
	window.close()
}

//-----------------------------------------------------------------------------
function ppgUpdate()
{
	if ( !oFormDef ) return (false);

	// perform validation
	if (txtFormId.value == "")
	{
		ppgSwitchTab(tabGeneral)
		txtFormId.focus()
		studioWnd.cmnDlg.messageBox(
			pageXLT.selectSingleNode("//phrase[@id='msgPleaseEnterReq']").text,"ok","alert",window)
		return false;
	}
	txtFormId.value=txtFormId.value.toUpperCase()
	if ( txtFormId.value != formNode.getAttribute("formid") )
	{
		var bUnique=sourceWnd.myDoc.isFormIdUnique(txtFormId.value,oFormDef)
		if (bUnique == null) return false;
		if ( !bUnique )
		{
			ppgSwitchTab(tabGeneral)
			txtFormId.focus()
			txtFormId.select()
			var msg=pageXLT.selectSingleNode("//phrase[@id='msgFormIdOverwrite']").text
			if ( studioWnd.cmnDlg.messageBox(msg,"okcancel","question",window) != "ok" )
				return false;
		}
	}

	ppgEnableApply(false)
	btnCancel.focus()

	// initial form action
	var selIndex=selInitialAction.selectedIndex;
	var value=(selIndex != -1 
			? selInitialAction.options[selIndex].value
			: "");
	formNode.setAttribute("prefc", value);

	// default form action
	selIndex=selDefaultAction.selectedIndex;
	value=(selIndex != -1 
			? selDefaultAction.options[selIndex].value
			: "");
	formNode.setAttribute("defaultFC", value);

	// other form node attributes
	formNode.setAttribute("NOTKNXFER", cbxNoTknXfer.checked ? "0" : "1");
	formNode.setAttribute("defaultui", cbxDefaultUI.checked ? "true" : "false");
	formNode.setAttribute("formid", txtFormId.value);
	formNode.setAttribute("evttype", cbxEVT.checked ? "CHG" : "");
	formNode.setAttribute("rtntype", rbAll.checked ? "ALL" : "SEL");
	formNode.setAttribute("workflow", cbxWorkflowEnabled.checked ? "1" : "0");

	// set the return attribute on selected form fields
	if (!rbAll.checked)
	{
		var nCount=0
		nodes = oFormDef.selectNodes("//fld[@nbr and (@tp='Text' or @tp='Hidden' or @tp='Select' or @tp='Out')] | //push[@nbr]")
		var len=nodes.length
		for ( var i=0; i < len; i++ )
		{
			if (nodes[i].getAttribute("rtn")=="1")
			{
				nCount++
				break;
			}
		}
		if (nCount==0)
		{
			ppgSwitchTab(document.getElementById("tabData"))
			var msg=pageXLT.selectSingleNode("//phrase[@id='msgPleaseSelectFields']").text
			studioWnd.cmnDlg.messageBox(msg,"ok","alert",window)
			return(false);
		}
	}

	// apply the form XML
	sourceWnd.myDoc.xmlDoc.loadXML(oFormDef.xml);
	sourceWnd.myDoc.params.setItem("id",txtFormId.value)
	sourceWnd.myDoc.setModifiedFlag(true,false);
	return (true);
}

//-----------------------------------------------------------------------------
function genBuildActionList()
{
	if ( !oFormDef ) return (false);

	// clear the list
	for (var i=selInitialAction.options.length-1; i > -1; i--)
		selInitialAction.removeChild(selInitialAction.children(i))

	// add a 'none' choice	
	var oOption = document.createElement("option")
	oOption.text = "None"
	oOption.value = ""
	selInitialAction.add(oOption)

	var origVal = (formNode.getAttribute("prefc") ? formNode.getAttribute("prefc") : "" );
	var btnNodes = oFormDef.selectNodes("/form/toolbar/button")
	if ( !btnNodes ) return (false);

	for (var i=0; i < btnNodes.length; i++ )
	{
		var oOption = document.createElement("option")
		oOption.text = acGetActionText(btnNodes[i])
		oOption.value = btnNodes[i].getAttribute("value")
		if (oOption.value == origVal)
			oOption.selected=true;
		
		selInitialAction.add(oOption)
	}
	return (true);
}

//-----------------------------------------------------------------------------
function genBuildDefaultList()
{
	if ( !oFormDef ) return (false);

	// clear the list
	for (var i=selDefaultAction.options.length-1; i > -1; i--)
		selDefaultAction.removeChild(selDefaultAction.children(i))

	// add a 'none' choice	
	var oOption = document.createElement("option")
	oOption.text = "None"
	oOption.value = ""
	selDefaultAction.add(oOption)

	var origVal = (formNode.getAttribute("defaultFC") ? formNode.getAttribute("defaultFC") : "" );
	var btnNodes = oFormDef.selectNodes("/form/toolbar/button")
	if ( !btnNodes || btnNodes.length == 0) 
	{
		var FCNodes = oFormDef.selectNodes("/form/fld[@tp='Hidden' and @nm='FC']/vals")
		if ( !FCNodes )
			return (false);
		else
			btnNodes = FCNodes;
	}

	for (var i=0; i < btnNodes.length; i++ )
	{
		var oOption = document.createElement("option")
		
		if (!FCNodes)
		{
			oOption.text = acGetActionText(btnNodes[i])
			oOption.value = btnNodes[i].getAttribute("value")
		}
		else
		{
			oOption.text = btnNodes[i].text + "(" + btnNodes[i].getAttribute("Tran") + ")"
			oOption.value = btnNodes[i].getAttribute("Tran")
		}
			
		if (oOption.value == origVal)
			oOption.selected=true;
		
		selDefaultAction.add(oOption)
	}
	return (true);
}

//-----------------------------------------------------------------------------
function genOnActionChange()
{
	ppgEnableApply()
}

//-----------------------------------------------------------------------------
function genBuildPropertiesTable()
{
	var arrAttr = new Array();
	var len = formNode ? formNode.attributes.length : 0;
	for (var i = 0; i < len; i++)
	{
		var attr=new Object()
		attr.id=formNode.attributes.item(i).nodeName.toLowerCase()
		attr.nm=formNode.attributes.item(i).nodeName
		arrAttr[arrAttr.length] = attr
	}
	arrAttr.sort(idSort)

	var oTable = document.getElementById("tblProperties");
	for (var i = 0; i < len; i++)
	{
		row = oTable.insertRow();
		row.style.height = "20px";

		cell = row.insertCell(0);
		cell.width="40%";
		cell.className = "dsProperty";
		cell.style.paddingLeft = "4px";
		cell.innerText = arrAttr[i].nm

		cell = row.insertCell(1);
		cell.width="60%";
		cell.className = "dsProperty";
		cell.style.paddingLeft = "4px";
		cell.innerText = formNode.getAttribute(arrAttr[i].nm)
	}
}

//-----------------------------------------------------------------------------
function trBuildAssignedList()
{
	if ( !oFormDef ) return (false);

	var trNodes = oFormDef.selectNodes("/form/transfers/frm_trans")
	if (!trNodes.length) return (false);

	// clear any assigned items
	for (var i=selTransAssigned.options.length-1; i > -1; i--)
		selTransAssigned.removeChild(selTransAssigned.children(i))

	for (var i=0; i < trNodes.length; i++ )
	{
		var oOption = document.createElement("option")
		var value = trNodes[i].getAttribute("id")
		oOption.text = trGetTransferText(trNodes[i])
		oOption.value = value
		
		selTransAssigned.add(oOption)
	}
	return (true);
}

//-----------------------------------------------------------------------------
function trOnAssignedChange()
{
	btnTransProps.disabled=false;
	btnDeleteTrans.disabled=false;
	btnUpTrans.disabled=false;
	btnDownTrans.disabled=false;

	if (!selTransAssigned.options.length)
	{
		btnTransProps.disabled=true;
		btnDeleteTrans.disabled=true;
	}
	if (selTransAssigned.selectedIndex < 1)
		btnUpTrans.disabled=true;
	if (selTransAssigned.selectedIndex+1 == selTransAssigned.options.length)
		btnDownTrans.disabled=true;
}

//-----------------------------------------------------------------------------
function trTransProperty(mode)
{
	var selIndex = -1;
	if (mode == "assigned")
	{
		selIndex=selTransAssigned.selectedIndex
		if (selIndex == -1) return;
	}

	var origId=null
 	var frmArgs = new Array()
 	frmArgs[0]=studioWnd
 	frmArgs[1]=oFormDef
 	frmArgs[2]=null
	if (mode == "assigned")
	{
		origId=selTransAssigned.options[selIndex].value
	 	frmArgs[2]=origId
	}
	frmArgs[3]=mode

	var htmPath=studioWnd.studioPath+"/uidesigner/dialogs/transfer.htm"
	var strFeatures="dialogHeight:210px;dialogWidth:460px;center:yes;help:no;scroll:no;status:no;"

	var tranId = showModalDialog(htmPath, frmArgs, strFeatures)
	if (typeof(tranId) == "undefined") return;

	var trNode=oFormDef.selectSingleNode("/form/transfers/frm_trans[@id='"+tranId+"']")
	if (!trNode) return;

	if (mode == "assigned")
	{
		var strText=trGetTransferText(trNode)
		if (origId == tranId && strText == selTransAssigned.options[selIndex].value)
			return;
		selTransAssigned.options[selIndex].value=tranId
		selTransAssigned.options[selIndex].text=strText
	}
	else
	{
		var oOption = document.createElement("option")
		oOption.text = trGetTransferText(trNode)
		oOption.value = tranId
		selTransAssigned.add(oOption)
		selTransAssigned.selectedIndex=selTransAssigned.options.length-1
	}
	ppgEnableApply()
}

//-----------------------------------------------------------------------------
function trDeleteTrans()
{
	var selIndex=selTransAssigned.selectedIndex
	if (selIndex == -1) return;
	var tranId = selTransAssigned.options[selIndex].value

	prDeleteFormNode("/form/transfers",tranId,selTransAssigned,selIndex)
	selTransAssigned.focus()
}

//-----------------------------------------------------------------------------
function trGetTransferText(node)
{
	var strText=(node.getAttribute("TITLE") ? node.getAttribute("TITLE") : "Unknown description") +
		(node.getAttribute("TOKEN") ? " ("+node.getAttribute("TOKEN")+")" : "")
	return (strText);
}

//-----------------------------------------------------------------------------
function trMoveTrans(direction)
{
	// must have a selection
	var selIndex = selTransAssigned.selectedIndex
	if (selIndex == -1) return

	var aChild = selTransAssigned.children(selIndex)
	var oOption = document.createElement("option")
	var transNode=oFormDef.selectSingleNode("/form/transfers")

	switch (direction)
	{
	case "up" :
		// any where to go?
		if (selIndex < 1) return

		var dnVal = selTransAssigned.options[selIndex].value
		var dnText = selTransAssigned.options[selIndex].text
		var upVal = selTransAssigned.options[selIndex-1].value
		var upText = selTransAssigned.options[selIndex-1].text

		var oUpNode=oFormDef.selectSingleNode("/form/transfers/frm_trans[@id='"+upVal+"']")
		var oDnNode=oFormDef.selectSingleNode("/form/transfers/frm_trans[@id='"+dnVal+"']")

		transNode.insertBefore(oDnNode, oUpNode)
			
		selTransAssigned.options[selIndex-1].value = dnVal
		selTransAssigned.options[selIndex-1].text = dnText
		selTransAssigned.options[selIndex].value = upVal
		selTransAssigned.options[selIndex].text = upText
		selTransAssigned.selectedIndex=selIndex-1
		break;

	case "dn" :
		// any where to go?
		if (selIndex > selTransAssigned.options.length-2)
			return

		var upVal = selTransAssigned.options[selIndex].value
		var upText = selTransAssigned.options[selIndex].text
		var dnVal = selTransAssigned.options[selIndex+1].value
		var dnText = selTransAssigned.options[selIndex+1].text

		var oUpNode=oFormDef.selectSingleNode("/form/transfers/frm_trans[@id='"+upVal+"']")
		var oDnNode=oFormDef.selectSingleNode("/form/transfers/frm_trans[@id='"+dnVal+"']")

		transNode.insertBefore(oDnNode, oUpNode)

		selTransAssigned.options[selIndex+1].value = upVal
		selTransAssigned.options[selIndex+1].text = upText
		selTransAssigned.options[selIndex].value = dnVal
		selTransAssigned.options[selIndex].text = dnText
		
		selTransAssigned.selectedIndex=selIndex+1
		break;
	}
	trOnAssignedChange()
	ppgEnableApply()
}

//-----------------------------------------------------------------------------
function daBuildFieldList()
{
	if ( !oFormDef ) return (false);

	var fldNodes=oFormDef.selectNodes("//fld[@nbr and (@tp='Text' or @tp='Hidden' or @tp='Select' or @tp='Out')] | //push[@nbr]")
	var len=(fldNodes ? fldNodes.length : 0);
	for (var i=0; i < len; i++ )
	{
		if (fldNodes[i].getAttribute("nm") == "")
			continue;
		var oFld=new Object()
		oFld.id=fldNodes[i].getAttribute("id")
		oFld.nm=fldNodes[i].getAttribute("nm")
		fldObjArray[fldObjArray.length]=oFld
	}
	if (fldObjArray.length)
	{
		daFieldSort("id")
		selFieldList.selectedIndex=0;
	}
	else
	{
		btnFieldProps.disabled=true;
		btnFieldSortId.disabled=true;
		btnFieldSortName.disabled=true;
	}
}


//-----------------------------------------------------------------------------
function daFieldSort(type)
{
	// remove any fields in the list
	for (var i=selFieldList.options.length-1; i > -1; i--)
		selFieldList.removeChild(selFieldList.children(i))

	if (type=="id")
		fldObjArray.sort(idSort)
	else	// type=="name"
		fldObjArray.sort(nameSort)

	for (var i=0; i < fldObjArray.length; i++ )
	{
		var oOption = document.createElement("option")
		var value = fldObjArray[i].id
		var str=value
		for (var j = value.length; j < 10; j++)
			str+=" "
		oOption.text = str+fldObjArray[i].nm
		oOption.value = value
		selFieldList.add(oOption)
	}
	selFieldList.selectedIndex=0;
}

//-----------------------------------------------------------------------------
function idSort(a,b)
{
	var aText=a.id.toLowerCase()
	var bText=b.id.toLowerCase()
	if (aText < bText) return (-1);
	if (aText == bText) return (0);
	if (aText > bText) return (1);
}

//-----------------------------------------------------------------------------
function nameSort(a,b)
{
	var aText=a.nm.toLowerCase()
	var bText=b.nm.toLowerCase()
	if (aText < bText) return (-1);
	if (aText == bText) return (0);
	if (aText > bText) return (1);
}

//-----------------------------------------------------------------------------
function daFieldProperty()
{
	var selIndex=selFieldList.selectedIndex
	if (selIndex == -1) return;

 	var frmArgs = new Array()
 	frmArgs[0]=studioWnd
 	frmArgs[1]=oFormDef.selectSingleNode("//*[@id='"+selFieldList.options[selIndex].value+"']")

	var htmPath=studioWnd.studioPath+"/uidesigner/dialogs/attributes.htm"
	var strFeatures="dialogHeight:380px;dialogWidth:280px;center:yes;help:no;scroll:no;status:no;"

	showModalDialog(htmPath, frmArgs, strFeatures)
}

//-----------------------------------------------------------------------------
function daOnRadioClick()
{
	ppgEnableApply();
	btnSelFields.disabled = rbSelected.checked ? false : true;
	if (rbSelected.checked)
		btnSelFields.click()
	else
	{
		// clear all the field return attributes
		var nodes=oFormDef.selectNodes("//fld[@nbr and (@tp='Text' or @tp='Hidden' or @tp='Select' or @tp='Out')] | //push[@nbr]")
		var len=nodes.length
		for ( var i=0; i < len; i++ )
			nodes[i].setAttribute("rtn", "0")
	}
}

//-----------------------------------------------------------------------------
function daSelectFields()
{
 	var frmArgs = new Array()
 	frmArgs[0]=studioWnd
	frmArgs[1]=sourceWnd.myDoc.xmlDoc
	frmArgs[2]=sourceWnd.myDoc.origDoc

	var htmPath=studioWnd.studioPath+"/uidesigner/dialogs/transaction.htm"
	var strFeatures="dialogHeight:400px;dialogWidth:300px;center:yes;help:no;scroll:no;status:no;"

	if (showModalDialog(htmPath, frmArgs, strFeatures))
		ppgEnableApply()
}

//-----------------------------------------------------------------------------
function acBuildAssignedList()
{
	if ( !oFormDef ) return (false);

	var btnNodes = oFormDef.selectNodes("/form/toolbar/button")
	if (!btnNodes.length) return (false);

	// clear any assigned items
	for (var i=selActionAssigned.options.length-1; i > -1; i--)
		selActionAssigned.removeChild(selActionAssigned.children(i))

	for (var i=0; i < btnNodes.length; i++ )
	{
		var oOption = document.createElement("option")
		oOption.text = acGetActionText(btnNodes[i])
		oOption.value = btnNodes[i].getAttribute("value")
		selActionAssigned.add(oOption)
	}
	return (true);
}

//-----------------------------------------------------------------------------
function acBuildAvailableList()
{
	if ( !oFormDef ) return (false);

	// clear any available items
	for (var i=selActionAvailable.options.length-1; i > -1; i--)
		selActionAvailable.removeChild(selActionAvailable.children(i))

	var fcNode=sourceWnd.myDoc.origDoc.selectSingleNode("/form/toolbar")
	if (!fcNode) return (false);

	var len=fcNode.childNodes.length
	for (var i=0; i < len; i++ )
	{
		// already assigned?
		var strValue=fcNode.childNodes[i].getAttribute("value")
		if (oFormDef.selectSingleNode("/form/toolbar/button[@value='"+strValue+"']"))
			continue;

		var oOption = document.createElement("option")
		oOption.text = acGetActionText(fcNode.childNodes[i])
		oOption.value = strValue;
		selActionAvailable.add(oOption)
	}
	return ( selActionAvailable.options.length ? true : false );
}

//-----------------------------------------------------------------------------
function acOnAssignedChange()
{
	btnActionProps.disabled=false;
	btnUnassignAction.disabled=false;
	btnUpAction.disabled=false;
	btnDownAction.disabled=false;

	if (!selActionAssigned.options.length)
	{
		btnActionProps.disabled=true;
		btnUnassignAction.disabled=true;
	}
	if (selActionAssigned.selectedIndex == 0)
		btnUpAction.disabled=true;
	if (selActionAssigned.selectedIndex+1 == selActionAssigned.options.length)
		btnDownAction.disabled=true;
}

//-----------------------------------------------------------------------------
function acOnAvailableChange()
{
	btnAssignAction.disabled=false;
	if (!selActionAvailable.options.length)
		btnAssignAction.disabled=true;
}

//-----------------------------------------------------------------------------
function acActionProperty()
{
	var selIndex=selActionAssigned.selectedIndex
	if (selIndex == -1) return;

 	var frmArgs = new Array()
 	frmArgs[0]=studioWnd
 	frmArgs[1]=oFormDef
 	frmArgs[2]=selActionAssigned.options[selIndex].value

	var htmPath=studioWnd.studioPath+"/uidesigner/dialogs/action.htm"
	var strFeatures="dialogHeight:230px;dialogWidth:440px;center:yes;help:no;scroll:no;status:no;"

	var actionVal = showModalDialog(htmPath, frmArgs, strFeatures)
	if (typeof(actionVal) != "undefined")
	{
		var btnNode=oFormDef.selectSingleNode("/form/toolbar/button[@value='"+actionVal+"']")
		if ( selActionAssigned.options[selIndex].value != actionVal
		|| 	selActionAssigned.options[selIndex].text != acGetActionText(btnNode) )
		{
			selActionAssigned.options[selIndex].value=actionVal
			selActionAssigned.options[selIndex].text=acGetActionText(btnNode)
		}
		ppgEnableApply()
	}
}

//-----------------------------------------------------------------------------
function acUnassignAction()
{
	var selIndex=selActionAssigned.selectedIndex
	if (selIndex == -1) return;
	var btnVal = selActionAssigned.options[selIndex].value
	var btnNode=oFormDef.selectSingleNode("/form/toolbar/button[@value='"+btnVal+"']")
	var btnId=btnNode.getAttribute("id")
	var value=btnNode.getAttribute("value")
	var text=acGetActionText(btnNode)

	prDeleteFormNode("/form/toolbar",btnId,selActionAssigned,selIndex)
	selActionAssigned.focus()

	var oOption = document.createElement("option")
	oOption.text = text
	oOption.value = value
		
	var index = selActionAvailable.add(oOption)
	selActionAvailable.selectedIndex=index;
	acOnAvailableChange()
}

//-----------------------------------------------------------------------------
function acGetActionText(node)
{
	var strText = (node.getAttribute("nm") ? node.getAttribute("nm") : "") + 
		" ("+node.getAttribute("value")+")";
	return (strText);
}

//-----------------------------------------------------------------------------
function acMoveAction(direction)
{
	// must have a selection
	var selIndex = selActionAssigned.selectedIndex
	if (selIndex == -1) return

	var aChild = selActionAssigned.children(selIndex)
	var oOption = document.createElement("option")
	var tbarNode=oFormDef.selectSingleNode("/form/toolbar")

	switch (direction)
	{
	case "up" :
		// any where to go?
		if (selIndex < 1) return

		var dnVal = selActionAssigned.options[selIndex].value
		var dnText = selActionAssigned.options[selIndex].text
		var upVal = selActionAssigned.options[selIndex-1].value
		var upText = selActionAssigned.options[selIndex-1].text

		var oUpNode=oFormDef.selectSingleNode("/form/toolbar/button[@value='"+upVal+"']")
		var oDnNode=oFormDef.selectSingleNode("/form/toolbar/button[@value='"+dnVal+"']")

		tbarNode.insertBefore(oDnNode, oUpNode)
			
		selActionAssigned.options[selIndex-1].value = dnVal
		selActionAssigned.options[selIndex-1].text = dnText
		selActionAssigned.options[selIndex].value = upVal
		selActionAssigned.options[selIndex].text = upText
		selActionAssigned.selectedIndex=selIndex-1
		break;

	case "dn" :
		// any where to go?
		if (selIndex > selActionAssigned.options.length-2)
			return

		var upVal = selActionAssigned.options[selIndex].value
		var upText = selActionAssigned.options[selIndex].text
		var dnVal = selActionAssigned.options[selIndex+1].value
		var dnText = selActionAssigned.options[selIndex+1].text

		var oUpNode=oFormDef.selectSingleNode("/form/toolbar/button[@value='"+upVal+"']")
		var oDnNode=oFormDef.selectSingleNode("/form/toolbar/button[@value='"+dnVal+"']")

		tbarNode.insertBefore(oDnNode, oUpNode)

		selActionAssigned.options[selIndex+1].value = upVal
		selActionAssigned.options[selIndex+1].text = upText
		selActionAssigned.options[selIndex].value = dnVal
		selActionAssigned.options[selIndex].text = dnText
		
		selActionAssigned.selectedIndex=selIndex+1
		break;
	}
	acOnAssignedChange()
	ppgEnableApply()
}

//-----------------------------------------------------------------------------
function acAssignAction()
{
	if ( !oFormDef ) return (false);

	var selIndex = selActionAvailable.selectedIndex
	if (selIndex == -1) return

	var value=selActionAvailable.options[selIndex].value

	var newId=""
	var tbarNode=oFormDef.selectSingleNode("/form/toolbar")
	if (!tbarNode)
	{
		var oTbNode=sourceWnd.myDoc.origDoc.selectSingleNode("/form/toolbar")
		if (oTbNode)
		{
			tbarNode = oTbNode.cloneNode(false)
			formNode.appendChild(tbarNode)
		}
		newId="button1"
	}
	else
		newId="button"+sourceWnd.myDoc.getUniqueID("button","",oFormDef)

	var newNode = oFormDef.createNode(1, "button", "")
	newNode.setAttribute("id",newId)
	var oBtnNode=sourceWnd.myDoc.origDoc.selectSingleNode("/form/toolbar/button[@value='"+value+"']")
	newNode.setAttribute("nm",oBtnNode ? oBtnNode.getAttribute("nm") : "")
	newNode.setAttribute("value",value)
	newNode.setAttribute("visible",sourceWnd.myDoc.isStandardAction(value) ? "1" : "0");
	if (tbarNode)
		tbarNode.appendChild(newNode)

	var oOption = document.createElement("option")
	oOption.text = acGetActionText(newNode)
	oOption.value = value;
		
	selActionAssigned.add(oOption)
	selActionAssigned.selectedIndex=selActionAssigned.options.length-1;

	var aChild = selActionAvailable.children(selIndex)
	selActionAvailable.removeChild(aChild)
	selActionAvailable.selectedIndex=selIndex-1;

	acOnAssignedChange()
	acOnAvailableChange()
	ppgEnableApply()
}

//-----------------------------------------------------------------------------
function prDeleteFormNode(parentSel,nodeId,selElement,nIndex)
{
	var parentNode=oFormDef.selectSingleNode(parentSel)
 	for (var i=0; i < parentNode.childNodes.length; i++)
 	{
 		var child=parentNode.childNodes.item(i)
 		if (child.getAttribute("id") == nodeId)
 		{
 			parentNode.removeChild(child);
 			break;
 		}
 	}
	if (typeof(selElement) != "undefined")
	{
		selElement.removeChild(selElement.children(nIndex))
		var idx=nIndex-1
		if (idx < 0 && selElement.options.length)
			idx=0
		selElement.selectedIndex=idx;
	}
	ppgEnableApply()
}
