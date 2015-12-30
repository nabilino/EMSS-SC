/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/dialogs/propsdtl.js,v 1.3.2.2.4.2.22.3 2012/08/08 12:48:50 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// propsdtl.js
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
tabArray[0] = "tabHeader"
tabArray[1] = "tabBody"
tabArray[2] = "tabData"
var maxTabIndex=2
var ppgActiveTab=null

var studioWnd=null
var sourceWnd=null
var oFormDef=null
var mFormElem=null
var ctlNode=null
var propBag=null
var origId=""
var bModified=false;
var dtlCols=0				// last good columns entry

//-----------------------------------------------------------------------------
function dtlInit()
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
	propBag = wndArguments[1]
	sourceWnd = wndArguments[2]

	// make a local copy of the UI xml
	oFormDef=studioWnd.xmlFactory.createInstance("DOM");
	oFormDef.async=false;
	oFormDef.loadXML(sourceWnd.myDoc.xmlDoc.xml)
	if (oFormDef.parseError.errorCode != 0)
	{
		studioWnd.displayDOMError(oFormDef.parseError,"detail properties page");
		window.returnValue=false;
		window.close();
		return;
	}

	mFormElem=wndArguments[3];
	origId=mFormElem.getAttribute("id");
	ctlNode=oFormDef.selectSingleNode("//detail[@id='"+origId+"']");

	// set the active tab
	ppgActiveTab = tabHeader;

	// initialize values
	dtlBuildHdrAssignedList();
	dtlBuildHdrAvailableList();
	dtlBuildFldsAssignedList();
	dtlBuildFldsAvailableList();

	txtDetailId.innerText=origId;
	txtDetailId2.innerText=origId;
	txtDetailId3.innerText=origId;
	txtHeaderSize.value=ctlNode.getAttribute("hdrsize");
	txtRowSpan.value=ctlNode.getAttribute("rowspan");
	txtRows.value=ctlNode.getAttribute("rows");
	dtlCols=sourceWnd.myDoc.dtlCols;
	txtDtlCols.value=dtlCols;

	dtlBuildColsEntry();

	// show the document
	document.body.style.visibility="visible";
	document.body.style.cursor="auto";
	txtHeaderSize.focus();
	txtHeaderSize.select();
}

//-----------------------------------------------------------------------------
function dtlOnKeyDown()
{
	var bEvtCaught=false;
	switch(event.keyCode)
	{
	case studioWnd.keys.ESCAPE:
		bEvtCaught=true
		window.close()
		break;
	case studioWnd.keys.ENTER:
		break;
	case studioWnd.keys.PAGE_UP:		// previous tab
		if( !event.altKey && event.ctrlKey && !event.shiftKey )
		{
			dtlActivateTab(-1)
			bEvtCaught=true
		}
		break;
	case studioWnd.keys.PAGE_DOWN:		// next tab
		if( !event.altKey && event.ctrlKey && !event.shiftKey )
		{
			dtlActivateTab(1)
			bEvtCaught=true
		}
		break;
	}

	if (bEvtCaught)
		studioWnd.setEventCancel(event)
	return (!bEvtCaught)
}

//-----------------------------------------------------------------------------
function dtlActivateTab(inc)
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
function dtlSwitchTab(objTab)
{
	if(objTab.id == ppgActiveTab.id) return;

	// make the previously active tab inactive
	ppgActiveTab.className = "dsTabButtonInactive"
	document.all["div" + ppgActiveTab.id.substr(3)].style.display = "none"

	objTab.className = "dsTabButtonActive"
	switch(objTab.id)
	{
		case "tabHeader":
			dtlBuildHdrAssignedList()
			dtlBuildHdrAvailableList()
			divHeader.style.display = "block"
			txtHeaderSize.focus()
			txtHeaderSize.select()
			break;
		case "tabBody":
			dtlBuildFldsAssignedList()
			dtlBuildFldsAvailableList()
			divBody.style.display = "block"
			txtRowSpan.focus()
			txtRowSpan.select()
			break;
		case "tabData":
			dtlBuildDataAvailableList();
			divData.style.display = "block";
			(btnPaint.disabled ? selDataAvailable.focus() : btnPaint.focus());
			break;
	}

	// Make this tab as active tab
	ppgActiveTab = objTab
}

//-----------------------------------------------------------------------------
function dtlBuildHdrAssignedList()
{
	// clear the list
	for (var i=selHdrAssigned.options.length-1; i > -1; i--)
		selHdrAssigned.removeChild(selHdrAssigned.children(i))

	var hdrNodes=ctlNode.selectNodes("./fld[@dtlhdr='1'] | ./LINE[@dtlhdr='1']")
	var len = hdrNodes ? hdrNodes.length : 0;	

	for (var i=0; i < len; i++)
	{
		if (hdrNodes[i].getAttribute("tp") == "labelHidden"
		|| hdrNodes[i].getAttribute("tp") == "rectHidden"
		|| hdrNodes[i].getAttribute("tp") == "Hidden")
			continue;
		var oOption = document.createElement("option")
		var strText=hdrNodes[i].nodeName
		if (hdrNodes[i].nodeName == "fld" && hdrNodes[i].getAttribute("nm"))
			strText=hdrNodes[i].getAttribute("nm")
		strText += (" ("+hdrNodes[i].getAttribute("id")+")")
		oOption.text = strText
		oOption.value = hdrNodes[i].getAttribute("id")
		selHdrAssigned.add(oOption)
	}
}

//-----------------------------------------------------------------------------
function dtlBuildHdrAvailableList()
{
	// clear the list
	for (var i=selHdrAvailable.options.length-1; i > -1; i--)
		selHdrAvailable.removeChild(selHdrAvailable.children(i))

	var selPhrase="./fld[@tp='Out' or @tp='labelHidden' or @tp='rectHidden' or @dtlhdr!='1' " +
			"or (@tp='label' and not(@dtlhdr))] | ./LINE[not(@dtlhdr)]"
	var hdrNodes=ctlNode.selectNodes(selPhrase);
	var len = hdrNodes ? hdrNodes.length : 0;	

	for (var i=0; i < len; i++ )
	{
		var tp=hdrNodes[i].getAttribute("tp");
		if ( tp != "labelHidden" && tp != "rectHidden" && tp != "Out"
		&& tp != "rect" && tp != "label")
			continue;
		var nbr=hdrNodes[i].getAttribute("nbr");
		if (nbr && nbr.indexOf("r0") != -1)
			continue;
		if (hdrNodes[i].getAttribute("repeat") == "true")
			continue;

		var oOption = document.createElement("option")
		var strText=hdrNodes[i].nodeName
		if (hdrNodes[i].nodeName == "fld" && hdrNodes[i].getAttribute("nm"))
			strText=hdrNodes[i].getAttribute("nm")
		strText += (" ("+hdrNodes[i].getAttribute("id")+")")
		oOption.text = strText
		oOption.value = hdrNodes[i].getAttribute("id")
		selHdrAvailable.add(oOption)
	}
}

//-----------------------------------------------------------------------------
function dtlBuildFldsAssignedList()
{
	// clear the list
	for (var i=selFldsAssigned.options.length-1; i > -1; i--)
		selFldsAssigned.removeChild(selFldsAssigned.children(i))

	var fldNodes=ctlNode.selectNodes("./fld[not(@dtlhdr)] | ./push | ./IMAGE")
	var len = fldNodes ? fldNodes.length : 0;	

	for (var i=0; i < len; i++)
	{
		if (fldNodes[i].getAttribute("tp") == "labelHidden"
		|| fldNodes[i].getAttribute("tp") == "rectHidden"
		|| fldNodes[i].getAttribute("tp") == "Hidden")
			continue;

		var nbr=fldNodes[i].getAttribute("nbr")
		if (!nbr || nbr.indexOf("r0") == -1)
			continue;

		var oOption = document.createElement("option")
		var strText=fldNodes[i].nodeName
		if (fldNodes[i].nodeName == "fld" && fldNodes[i].getAttribute("nm"))
			strText=fldNodes[i].getAttribute("nm")
		if (fldNodes[i].nodeName == "push" && fldNodes[i].getAttribute("btnnm"))
			strText=fldNodes[i].getAttribute("btnnm")
		strText += (" ("+fldNodes[i].getAttribute("id")+")")
		oOption.text = strText
		oOption.value = fldNodes[i].getAttribute("id")
		selFldsAssigned.add(oOption)
	}
}

//-----------------------------------------------------------------------------
function dtlBuildFldsAvailableList()
{
	// clear the list
	for (var i=selFldsAvailable.options.length-1; i > -1; i--)
		selFldsAvailable.removeChild(selFldsAvailable.children(i))

	var fldNodes=ctlNode.selectNodes("./fld[not(@dtlhdr)] | ./push | ./IMAGE")
	var len = fldNodes ? fldNodes.length : 0;	

	for (var i=0; i < len; i++ )
	{
		if (fldNodes[i].getAttribute("tp") == "labelHidden"
		|| fldNodes[i].getAttribute("tp") == "rectHidden"
		|| fldNodes[i].getAttribute("tp") == "Hidden")
			continue;

		if (fldNodes[i].getAttribute("tp") == "label"
		&& fldNodes[i].getAttribute("repeat") == "true")
			continue;

		var nbr=fldNodes[i].getAttribute("nbr")
		if (nbr && nbr.indexOf("r0") != -1)
			continue;

		var oOption = document.createElement("option")
		var strText=fldNodes[i].nodeName
		if (fldNodes[i].nodeName == "fld" && fldNodes[i].getAttribute("nm"))
			strText=fldNodes[i].getAttribute("nm")
		if (fldNodes[i].nodeName == "push" && fldNodes[i].getAttribute("btnnm"))
			strText=fldNodes[i].getAttribute("btnnm")
		strText += (" ("+fldNodes[i].getAttribute("id")+")")
		oOption.text = strText
		oOption.value = fldNodes[i].getAttribute("id")
		selFldsAvailable.add(oOption)
	}
}

//-----------------------------------------------------------------------------
function dtlBuildDataAvailableList()
{
	// clear the list
	btnPaint.disabled=false;
	for (var i=selDataAvailable.options.length-1; i > -1; i--)
		selDataAvailable.removeChild(selDataAvailable.children(i))

	var fldArray=new Array();
	var oFldDOM=sourceWnd.myDoc.dsm.detailXML;
	var fldNodes=oFldDOM.documentElement.childNodes;
	var len=(fldNodes ? fldNodes.length : 0);

	var bRtnOnly = false;
	var rtntype=oFormDef.selectSingleNode("//form").getAttribute("rtntype");
	if (rtntype)
		bRtnOnly = (rtntype == "SEL" ? true : false);

	// build array of fields to sort
	for (var i=0; i < len; i++ )
	{
		if (bRtnOnly)
		{
			if ( fldNodes[i].getAttribute("rtn") == "0" ) continue;

			// must check against current form node as well
			var fNode = oFormDef.selectSingleNode("//*[@nbr='"+fldNodes[i].getAttribute("nbr")+"']");
			if ( fNode && fNode.getAttribute("rtn") == "0" ) continue;
		}

		if (fldNodes[i].getAttribute("nm") == "")
			continue;

		var output=(fldNodes[i].getAttribute("isxlt") == null ? "" : " (OUTPUT)");
		fldArray[fldArray.length]=fldNodes[i].getAttribute("nm") + output + "/" + 
					fldNodes[i].getAttribute("nbr");
	}

	len=fldArray.length
	if (!len)
	{
		// add the 'none' choice?
		var oOption = document.createElement("option")
		oOption.text = "None";
		oOption.value = "none";
		selDataAvailable.add(oOption);
		btnPaint.disabled=true;
		return;
	}

	fldArray.sort();
	for (var i=0; i < len; i++ )
	{
		var oOption = document.createElement("option");
		var pos=fldArray[i].indexOf("/");
		var nbr=fldArray[i].substr(pos+1);
		var text=fldArray[i].substr(0,pos);
		var origNode=sourceWnd.myDoc.origDoc.selectSingleNode("//*[@nbr='"+nbr+"']");
		if (origNode && origNode.getAttribute("tp") == "Hidden")
			text+="*";

		oOption.text=text;
		oOption.value=nbr;
		selDataAvailable.add(oOption);
	}
}

//-----------------------------------------------------------------------------
function ppgEnableApply(bEnable)
{
	if (typeof(bEnable) != "boolean")
		bEnable=true;
	btnApply.disabled=!bEnable
}

//-----------------------------------------------------------------------------
function dtlReturn()
{
	sourceWnd.myDoc.dtlCols = dtlCols
	window.returnValue=bModified
	window.close()
}

//-----------------------------------------------------------------------------
function dtlOK()
{
	if (!btnApply.disabled)
	{
		if (!dtlUpdate()) return;
	}
	dtlReturn();
}

//-----------------------------------------------------------------------------
function dtlUpdate()
{
	// validate entries
	if (txtHeaderSize.value == "")
	{
		dtlSwitchTab(tabHeader)
		txtHeaderSize.focus()
		studioWnd.cmnDlg.messageBox(
			pageXLT.selectSingleNode("//phrase[@id='msgPleaseEnterReq']").text,"ok","alert",window)
		return false;
	}
	if (txtRowSpan.value == "")
	{
		dtlSwitchTab(tabBody)
		txtRowSpan.focus()
		studioWnd.cmnDlg.messageBox(
			pageXLT.selectSingleNode("//phrase[@id='msgPleaseEnterReq']").text,"ok","alert",window)
		return false;
	}
	var len = txtDtlCols.value
	var prevVal=0;
	for (var i = 0; i < len; i++)
	{
		var mElement=document.getElementById("txtCol"+i)
		if (!mElement) continue;	// shouldn't happen!
		if (mElement.value == "")
		{
			dtlSwitchTab(tabBody)
			mElement.focus()
			studioWnd.cmnDlg.messageBox(
				pageXLT.selectSingleNode("//phrase[@id='msgPleaseEnterReq']").text,"ok","alert",window)
			return false;
		}
		if (parseInt(mElement.value) <= prevVal)
		{
			dtlSwitchTab(tabBody)
			mElement.focus()
			studioWnd.cmnDlg.messageBox(
				pageXLT.selectSingleNode("//phrase[@id='msgColsNotConsistent']").text,"ok","alert",window)
			return false;
		}
		prevVal=parseInt(mElement.value)
	}

	// edits are complete and valid
	dtlCols = txtDtlCols.value
	btnOK.focus()
	ppgEnableApply(false)

	var hdrNodes=ctlNode.selectNodes("./fld")
	len = hdrNodes ? hdrNodes.length : 0;

	// first clear clear all the header and repeat attributes
	for (var i = 0; i < len; i++)
	{
	 	hdrNodes[i].removeAttribute("header");
		hdrNodes[i].removeAttribute("dtlhdr");
		hdrNodes[i].removeAttribute("repeat");
	}		

	// now loop through the assigned list
	len = selHdrAssigned.options.length
	for (var i = 0; i < len; i++)
	{
		var hdrNode=ctlNode.selectSingleNode("./*[@id='"+selHdrAssigned.options[i].value+"']")
		if (hdrNode)
		{
			hdrNode.setAttribute("dtlhdr","1")
			var tp=hdrNode.getAttribute("tp")
			if (tp == "labelHidden" ||  tp == "rectHidden")
			{
				var newTp=tp.substr(0,tp.length-6)
				hdrNode.setAttribute("tp",newTp)
				if (!sourceWnd.myDoc.undeleteControlInstance(hdrNode.getAttribute("id"),false,false))
				{
					// create a control for this previously hidden item
					sourceWnd.myDoc.createControlInstance(newTp, null, false)
				}
			}
		}
	}

	// now loop through the assigned fld list
	len = selFldsAssigned.options.length
	for (var i = 0; i < len; i++)
	{
		var id=selFldsAssigned.options[i].value
		var fldNode=ctlNode.selectSingleNode("./*[@id='"+id+"']")
		if (fldNode)
		{
			var ctlInst=sourceWnd.myDoc.getControlInstance(id);
			var nbr=ctlInst.get("nbr");	
			if (nbr.indexOf("r0") != -1) continue;
			
			// use 'repeat' for labels
			if (fldNode.getAttribute("tp") == "label")
			{
				fldNode.setAttribute("repeat","true");
				if (ctlInst) ctlInst.set("repeat","true");
			}
			else
			{
				fldNode.setAttribute("nbr",nbr+"r0");
				if (ctlInst) ctlInst.set("nbr",nbr+"r0");
			}
		}
	}

	// now loop through the available fld list
	len = selFldsAvailable.options.length
	for (var i = 0; i < len; i++)
	{
		var id=selFldsAvailable.options[i].value
		var fldNode=ctlNode.selectSingleNode("./*[@id='"+id+"']")
		if (fldNode)
		{
			var nbr=fldNode.getAttribute("nbr")
			if (nbr.indexOf("r0") != -1)
				nbr=nbr.substr(0,nbr.length-2);
			fldNode.setAttribute("nbr",nbr)
			var ctlInst=sourceWnd.myDoc.getControlInstance(id)
			if (ctlInst) ctlInst.set("nbr",nbr)
		}
	}

	ctlNode.setAttribute("hdrsize",txtHeaderSize.value)
	ctlNode.setAttribute("rowspan",txtRowSpan.value)
	rowNodes=ctlNode.selectNodes("./row[@row]")
	len = rowNodes ? rowNodes.length : 0;		// shouldn't be zero!

	var hdrSize=parseInt(txtHeaderSize.value);
	var cols=parseInt(txtDtlCols.value)
	var rowSpan=parseInt(txtRowSpan.value)

	for (var i = 0; i < len; i++)
	{
		var rem=i%cols
		var txtCol=document.getElementById("txtCol"+rem)
		if (txtCol)
			rowNodes[i].setAttribute("col",txtCol.value)

		var rowNbr=((Math.floor(i/cols))*rowSpan)+hdrSize;
		rowNodes[i].setAttribute("row",rowNbr);
	}

	// apply the form XML
	sourceWnd.myDoc.xmlDoc.loadXML(oFormDef.xml)
	sourceWnd.myDoc.setModifiedFlag(true,false)
	bModified=true;
	return (true);
}

//-----------------------------------------------------------------------------
function dtlAddSel()
{
	var selIndex = selHdrAvailable.selectedIndex
	if (selIndex == -1) return;

	var oOption = document.createElement("option")
	oOption.value=selHdrAvailable.options[selIndex].value
	oOption.text=selHdrAvailable.options[selIndex].text
	selHdrAssigned.add(oOption)

	selHdrAvailable.removeChild(selHdrAvailable.children(selIndex))
	var selNode=ctlNode.selectSingleNode("./fld[@id='"+oOption.value+"']")
	if (selNode) selNode.setAttribute("dtlhdr","1");
	ppgEnableApply()

	if (selHdrAvailable.options.length)
	{
		if (selIndex < selHdrAvailable.options.length)
			selHdrAvailable.selectedIndex=selIndex
		else
			selHdrAvailable.selectedIndex=selIndex-1
	}

	// remove from field available list (if found)
	var len = selFldsAvailable.options.length;
	for (var i = 0; i < len; i++)
	{
		if (selFldsAvailable.options[i].value == oOption.value)
		{
			selFldsAvailable.removeChild(selFldsAvailable.children(i))
			break;
		}
	}
}

//-----------------------------------------------------------------------------
function dtlRemSel()
{
	var selIndex = selHdrAssigned.selectedIndex
	if (selIndex == -1) return;

	var oOption = document.createElement("option")
	oOption.value=selHdrAssigned.options[selIndex].value
	oOption.text=selHdrAssigned.options[selIndex].text
	selHdrAvailable.add(oOption)

	selHdrAssigned.removeChild(selHdrAssigned.children(selIndex))
	var selNode=ctlNode.selectSingleNode("./fld[@id='"+oOption.value+"']")
	if (selNode) selNode.removeAttribute("dtlhdr");
	ppgEnableApply()

	if (selHdrAssigned.options.length)
	{
		if (selIndex < selHdrAssigned.options.length)
			selHdrAssigned.selectedIndex=selIndex
		else
			selHdrAssigned.selectedIndex=selIndex-1
	}
}

//-----------------------------------------------------------------------------
function dtlAddSelFld()
{
	var selIndex = selFldsAvailable.selectedIndex
	if (selIndex == -1) return;

	var oOption = document.createElement("option")
	var id=selFldsAvailable.options[selIndex].value;
	var node=ctlNode.selectSingleNode("./*[@id='"+id+"']");
	var nbr=node.getAttribute("nbr");
	if (nbr.indexOf("r0") == -1)
		node.setAttribute("nbr",nbr+"r0");

	oOption.value=id;
	oOption.text=selFldsAvailable.options[selIndex].text;
	selFldsAssigned.add(oOption)

	selFldsAvailable.removeChild(selFldsAvailable.children(selIndex))
	ppgEnableApply()

	if (selFldsAvailable.options.length)
	{
		if (selIndex < selFldsAvailable.options.length)
			selFldsAvailable.selectedIndex=selIndex
		else
			selFldsAvailable.selectedIndex=selIndex-1
	}
}

//-----------------------------------------------------------------------------
function dtlRemSelFld()
{
	var selIndex = selFldsAssigned.selectedIndex
	if (selIndex == -1) return;

	var oOption = document.createElement("option")
	var id=selFldsAssigned.options[selIndex].value;
	var node=ctlNode.selectSingleNode("./*[@id='"+id+"']");
	var nbr=node.getAttribute("nbr");
	if (nbr.indexOf("r0") != -1)
		node.setAttribute("nbr",nbr.substr(0,nbr.length-2))

	oOption.value=selFldsAssigned.options[selIndex].value
	oOption.text=selFldsAssigned.options[selIndex].text
	selFldsAvailable.add(oOption)

	selFldsAssigned.removeChild(selFldsAssigned.children(selIndex))
	ppgEnableApply()

	if (selFldsAssigned.options.length)
	{
		if (selIndex < selFldsAssigned.options.length)
			selFldsAssigned.selectedIndex=selIndex
		else
			selFldsAssigned.selectedIndex=selIndex-1
	}
}

//-----------------------------------------------------------------------------
function dtlQuickPaint()
{
	if (selDataAvailable.selectedIndex == -1)
		return;
	var msg="Quick Paint will apply changes immediately.\nOK to proceed?\n\n";
	if (studioWnd.cmnDlg.messageBox(msg,"okcancel","question",window) != "ok")
		return;

	var len = selDataAvailable.options.length;
	for (var i = 0; i < len; i++)
	{
		if (!selDataAvailable.options[i].selected)
			continue;
		var nbr=selDataAvailable.options[i].value;
		var dataNode=ctlNode.selectSingleNode("//*[@nbr='"+nbr+"']");

		var origNode=sourceWnd.myDoc.origDoc.selectSingleNode("//*[@nbr='"+nbr+"']");
		var tp=origNode.getAttribute("tp")
		if (tp != "Hidden")
		{
			if (tp == "Fc") tp="Select";
			if (tp != null)
				dataNode.setAttribute("tp",tp);
			dataNode.setAttribute("row",origNode.getAttribute("row"));
			dataNode.setAttribute("col",origNode.getAttribute("col"));
		}
		else
		{
			dataNode.setAttribute("tp","Text");
			dataNode.setAttribute("row",ctlNode.getAttribute("hdrsize"));
			dataNode.setAttribute("col","8");
			dataNode.setAttribute("id",sourceWnd.myDoc.createElementID(dataNode));
		}
		sourceWnd.myDoc.createControlFromNode(dataNode,ctlNode.getAttribute("id"))
		sourceWnd.myDoc.dsm.remove(dataNode);
	}
	dtlUpdate();
	dtlBuildDataAvailableList();
}

//-----------------------------------------------------------------------------
function dtlBuildColsEntry()
{
	var dtlColsCell=document.getElementById("dtlColsCell")
	if (!dtlColsCell) return;

	// clear last cell
	dtlColsCell.innerHTML=""

	var len = txtDtlCols.value == "" ? 0 : txtDtlCols.value;
	if (len < 1) return;

	var strHTML="<label id='lblDtlCols' for='txtDtlCols' class='dsLabel' " +
			"style='position:relative;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Positions:&nbsp;&nbsp;</label>"
	
	for (var i = 0; i < len; i++)
	{
		var rowNode=ctlNode.selectSingleNode("./row[@rowID='"+i+"']")
		strHTML+="<input type='text' id='txtCol"+i+"' class='dsTextBox' maxlength='2' " 
		strHTML+="onkeypress='khdlNbrKeyPress()' onchange='ppgEnableApply()' "
		strHTML+="style='position:relative;width:20px;' value='"+rowNode.getAttribute("col")+"'></input>&nbsp;&nbsp;"
	}
	dtlColsCell.innerHTML=strHTML
}

//-----------------------------------------------------------------------------
function dtlOnColsChange()
{
	if (txtDtlCols.value == "" || txtDtlCols.value == "0")
		// must have at least 1 column
		txtDtlCols.value="1"
	
	dtlBuildColsEntry()
	ppgEnableApply()

	var col0=document.getElementById("txtCol0")
	if (col0)
	{
		col0.focus()
		col0.select()
	}
}
