/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/wizards/erp_new.js,v 1.6.2.2.4.1.22.6 2012/08/08 12:48:54 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// erp_new.js
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
tabArray[0] = "tabPDL"
tabArray[1] = "tabSYS"
tabArray[2] = "tabTKN"
tabArray[3] = "tabFinish"
var maxTabIndex=3
var dlgActiveTab=null;

var dsSelections=null;
var bReloadList=true;
var studioWnd=null;
var gProjects=null;
var gPDL="";
var gDataArea="";

//-----------------------------------------------------------------------------
function dlgInit()
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

	// set the active tab
	dlgActiveTab = window.document.all.tabPDL

 	// initialize values
	dsSelections = new studioWnd.DataStorage()
	dsSelections.add("pdl","")
	dsSelections.add("sys","")
	dsSelections.add("tkn","")
	dsSelections.add("id","")

 	if ( dlgBuildPDLList() )
 	{
 		if (window.document.all.selPDL.selectedIndex == -1)
 			window.document.all.selPDL.selectedIndex=0;
 	}
 	
	// show the document
	window.document.body.style.visibility="visible"

	if (window.document.all.selPDL.options.length)
		window.document.all.selPDL.focus()
	else
	{
		window.document.all.btnNext.disabled=true;
		window.document.all.btnCancel.focus()
	}

}

//-----------------------------------------------------------------------------
function dlgOnKeyDown()
{
	var bEvtCaught=false;
	switch(event.keyCode)
	{
	case 27:		// escape
		bEvtCaught=true
		window.close()
		break;
	case 13:	// enter
		switch (event.srcElement.id)
		{
		case "selPDL":
		case "selSYS":
		case "selTKN":
		case "QuickPaint":
		case "BlankPalette":
			window.document.all.btnNext.click()
			bEvtCaught=true
			break;
		}
		break;
	}
	if (bEvtCaught)
	{
		event.cancelBubble=true;
		event.returnValue=true;
	}
	return (!bEvtCaught)
}

//-----------------------------------------------------------------------------
function dlgActivateTab(inc)
{
	var curIndex = parseInt(dlgActiveTab.tabind)
	var tabIndex = curIndex + inc

	if(tabIndex < 0)
		tabIndex = 0
	else if (tabIndex > maxTabIndex)
		tabIndex = maxTabIndex

	if (curIndex == tabIndex) return;

	var objTab = document.getElementById(tabArray[tabIndex])
	if(objTab.id == dlgActiveTab.id) return;

	// make the previously active tab inactive
	window.document.all["div" + dlgActiveTab.id.substr(3)].style.display = "none"
	window.document.all["tab" + dlgActiveTab.id.substr(3)].style.display = "none"

	// show the new active tab and div
	objTab.style.display="block"
	window.document.all["div"+objTab.id.substr(3)].style.display = "block"

	switch(objTab.id)
	{
		case "tabPDL":
			window.document.all.btnBack.disabled=true
			if (window.document.all.selPDL.options.length)
			{
				window.document.all.btnNext.disabled=false;
				window.document.all.selPDL.focus()
			}
			else
			{
				window.document.all.btnNext.disabled=true;
				window.document.all.btnCancel.focus();
			}
			break;
		case "tabSYS":
			window.document.all.btnBack.disabled=false
			if (!window.document.all.selSYS.options.length || bReloadList)
			{
			 	if ( dlgBuildSYSList() )
			 	{
			 		if (window.document.all.selSYS.selectedIndex == -1)
			 			window.document.all.selSYS.selectedIndex=0;
			 	}
			}
			if (window.document.all.selSYS.options.length)
			{
				window.document.all.btnNext.disabled=false;
				window.document.all.selSYS.focus()
			}
			else
			{
				window.document.all.btnNext.disabled=true;
				window.document.all.btnCancel.focus();
			}
			break;
		case "tabTKN":
			if (!window.document.all.selTKN.options.length || bReloadList)
			{
			 	if ( dlgBuildTKNList() )
			 	{
			 		if (window.document.all.selTKN.selectedIndex == -1)
			 			window.document.all.selTKN.selectedIndex=0;
			 	}
			}
			window.document.all.btnNext.value="Next >"
			window.document.all.btnNext.onclick=dlgOnClickNext
			if (window.document.all.selTKN.options.length)
			{
				window.document.all.btnNext.disabled=false;
				window.document.all.selTKN.focus();
			}
			else
			{
				window.document.all.btnNext.disabled=true;
				window.document.all.btnCancel.focus();
			}
			break;
		case "tabFinish":
			window.document.all.txtDataArea.innerText=dsSelections.getItem("pdl").value
			window.document.all.txtSystemCode.innerText=dsSelections.getItem("sys").value
			window.document.all.txtToken.innerText=dsSelections.getItem("tkn").value
			window.document.all.btnNext.disabled=false
			window.document.all.btnNext.value="Finish"
			window.document.all.btnNext.onclick=dlgOnClickFinish
			window.document.all.btnNext.focus()
			break;
	}

	// save reference to new active tab
	dlgActiveTab = objTab
}

//-----------------------------------------------------------------------------
function dlgOnClickNext()
{
	var mElement = window.document.getElementById("sel"+dlgActiveTab.id.substr(3))
	if (!mElement) return;
	
	var selIndex = mElement.selectedIndex
	if (selIndex == -1) return;

	var curValue=dsSelections.getItem(dlgActiveTab.id.substr(3).toLowerCase()).value
	bReloadList=false
	if (curValue != mElement.options[selIndex].value)
		bReloadList=true
	dsSelections.setItem(dlgActiveTab.id.substr(3).toLowerCase(), mElement.options[selIndex].value)
	dlgActivateTab(1)
}

//-----------------------------------------------------------------------------
function dlgOnClickBack()
{
	bReloadList=false;
	dlgActivateTab(-1)
}

//-----------------------------------------------------------------------------
function dlgOnClickFinish()
{
	dsSelections.add("paint", QuickPaint.checked ? "quick" : "blank" )

	studioWnd.designStudio.commandHandler.commandInfo.docName=
			dsSelections.getItem("tkn").value.toLowerCase()+".new.xml";
	studioWnd.designStudio.commandHandler.commandInfo.docPath=studioWnd.contentPath+"/forms"

	window.returnValue=dsSelections
	window.close()
}

//-----------------------------------------------------------------------------
function dlgBuildPDLList()
{
 	gProjects=new Array();
 	var project = null;
	// clear the list
	var selPDL=window.document.all.selPDL
	for (var i=selPDL.options.length-1; i > -1; i--)
		selPDL.removeChild(selPDL.children(i))

	var pdlDOM=dlgGetListDOM("pdl")
	if (!pdlDOM) return (false);

	// get the current selection
	var item=dsSelections.getItem("pdl");
	var curPDL = item ? item.value : "";

	// get the user's default PDL if no previous selection
	if (curPDL == "")
		curPDL=studioWnd.designStudio.getUserVariable("ProductLine")
		
	var pdlNodes=pdlDOM.selectNodes("/IDARETURN/LINES/LINE/COLS/COL")
	var len=pdlNodes.length
 	for (var i=0; i < len; i++ )
 	{
 		var oOption = document.createElement("option")
		if (studioWnd.trim(pdlNodes(i).text) == "GEN") continue;
 		project = new Object();
		project.name = studioWnd.trim(pdlNodes(i).text);
		project.isDataArea = false;
		project.productLine = studioWnd.trim(pdlNodes(i).text);
		gProjects[gProjects.length] = project;
 		oOption.text = studioWnd.trim(pdlNodes(i).text);
 		oOption.value = studioWnd.trim(pdlNodes(i).text);
 		if (oOption.value == curPDL)
 			oOption.selected=true;
 		selPDL.add(oOption)
 	}
 	dlgSetDataAreaProjects();
	return (selPDL.options.length ? true : false);
}

//----------------------------------------------------------------------------
function dlgSetDataAreaProjects()
{
	// get the dataareas
	var xmlDoc = studioWnd.SSORequest(studioWnd.DMEPath+"?PROD=GEN&FILE=PROJECT&OUT=XML");
	if (!xmlDoc || xmlDoc.status)
	{
		var msg="Error calling engine "+studioWnd.DMEPath+"."
		if (xmlDoc)
			msg+=studioWnd.getHttpStatusMsg(xmlDoc.status) + 
				"\nServer response: "+xmlDoc.statusText + " (" + xmlDoc.status + ")\n\n"
		studioWnd.cmnDlg.messageBox(msg,"ok","stop",window)
		return;
	}

	// reflect dataareas in projects
	var nodes=xmlDoc.selectNodes("//COLS");
	var len=(nodes?nodes.length:0);
	for(var i=0;i<len;i++)
	{
		var childLen=(nodes[i].childNodes?nodes[i].childNodes.length:0);
		if (childLen && childLen>2)
		{
			var pdl=studioWnd.trim(nodes[i].childNodes[0].text);
			var dataArea=studioWnd.trim(nodes[i].childNodes[1].text);
			dlgSetDataArea(dataArea, pdl);
		}
	}
}

function dlgSetDataArea(dataArea, pdl)
{
	var project=dlgGetProject(dataArea);
	if (project)
	{
		project.isDataArea=true;
		project.productLine=pdl;
	}
}

function dlgGetProject(name)
{
	var len=(gProjects?gProjects.length:0);
	for(var i=0;i<len;i++)
	{
		if (gProjects[i].name == name)
			return gProjects[i];
	}
	return null;
}

function dlgIsDataArea(name)
{
	var project=dlgGetProject(name);
	return (project?project.isDataArea:false);
}

//-----------------------------------------------------------------------------
function dlgBuildSYSList()
{
	// clear the list
	var selSYS=window.document.all.selSYS
	for (var i=selSYS.options.length-1; i > -1; i--)
		selSYS.removeChild(selSYS.children(i))

	var sysDOM=dlgGetListDOM("sys")
	if (!sysDOM) return (false);

	// get the current selection
	var item=dsSelections.getItem("sys");
	var curSYS = item ? item.value : "";
	
    var sysNodes=sysDOM.selectNodes("/IDARETURN/LINES/LINE/COLS")
	var len=sysNodes.length
 	for (var i=0; i < len; i++ )
 	{
		var strText = sysNodes(i).childNodes(0).text + "  " + sysNodes(i).childNodes(1).text
		var oOption = document.createElement("OPTION")
 		selSYS.add(oOption)
		oOption.innerText = strText
		oOption.value = sysNodes(i).childNodes(0).text
 		if (oOption.value == curSYS)
 			oOption.selected=true;
 	}
	return (selSYS.options.length ? true : false);
}

//-----------------------------------------------------------------------------
function dlgBuildTKNList()
{
	// clear the list
	var selTKN=window.document.all.selTKN
	for (var i=selTKN.options.length-1; i > -1; i--)
		selTKN.removeChild(selTKN.children(i))

	var tknDOM=dlgGetListDOM("tkn")
	if (!tknDOM) return (false);

	// get the current selection
	var item=dsSelections.getItem("tkn");
	var curTKN = item ? item.value : "";

	var tknNodes=tknDOM.selectNodes("/TOKENS/TOKEN")
	var len=tknNodes.length
	var tknArray=new Array();
 	for (var i=0; i < len; i++ )
 	{
		var tkn=new Object();
		tkn.name=tknNodes[i].getAttribute("name");
		tkn.title=tknNodes[i].getAttribute("title");
		tknArray[tknArray.length]=tkn;
 	}

	// sort the token object array
	var oSortArray = new SortArray(window);
	var typeArray = new Array("mixed","alpha");
	var orderArray = new Array(true, true);
	for (var i = 0; i < len; i++)
	{
		var myObj=tknArray[i];
		var valueAry = new Array(myObj.name, myObj.title);
		oSortArray.setObjectSortCriteria(myObj, valueAry, typeArray, orderArray);
	}
	oSortArray.sortObjects(tknArray);

 	for (var i=0; i < len; i++ )
 	{
 		var oOption = document.createElement("option")
		var strText = tknArray[i].name + " ";
		if (tknArray[i].name.length < 6)
			strText += " ";
 		strText += tknArray[i].title;
 		oOption.text = strText
 		oOption.value = tknArray[i].name;
 		if (oOption.value == curTKN)
 			oOption.selected=true;
 		selTKN.add(oOption)
 	}
	return (selTKN.options.length ? true : false);
}

//-----------------------------------------------------------------------------
function dlgGetListDOM(type)
{
	var api=""
	var msg="Error calling engine "+studioWnd.IDAPath+"."
	switch (type)
	{
	case "pdl":
		api=studioWnd.IDAPath+"?OUT=XML&_TYP=SL&_KNB=@da&_RECSTOGET=1000"
		break;
	case "sys":
		gDataArea = studioWnd.trim(dsSelections.getItem("pdl").value);
		gPDL=(dlgIsDataArea(gDataArea)?dlgGetProject(gDataArea).productLine:gDataArea);	
	    api=studioWnd.IDAPath+"?OUT=XML&_TYP=SL&_KNB=@sc&@pl="+ gPDL +"&_RECSTOGET=1000"
		break;
	case "tkn":
		msg="Error calling gettokens.exe.\n";
		api=studioWnd.cgiPath+"/gettokens.exe?"+dsSelections.getItem("pdl").value+"&"+
				dsSelections.getItem("sys").value+"&OUT=XML&ALL"
		break;
	}
	if (api=="") return (null);

	var domXML=studioWnd.SSORequest(api,null,"","",false);
	if(!domXML || domXML.status)
	{
		if (domXML)
			msg+=(studioWnd.getHttpStatusMsg(domXML.status) + 
				"\nServer response: " + domXML.statusText + " (" + domXML.status + ")");
		domXML=null;
		studioWnd.cmnDlg.messageBox(msg,"ok","stop",window)
	}
	else
	{
		if(domXML.xml == "")
		{
			domXML=null;
			msg+=(pageXLT.selectSingleNode("//phrase[@id='msgInvalidServerResponse']").text);
			studioWnd.cmnDlg.messageBox(msg,"ok","stop",window)
		}
		else
		{
			var errNode=domXML.selectSingleNode("//ERROR")
			if (errNode)
			{
				domXML=null;
				var msg="Error retrieving ";
				switch (type)
				{
				case "pdl":	msg+="ProductLine list.\n";	break;
				case "sys":	msg+="System Code list.\n";	break;
				case "tkn":	msg+="Form IDs list.\n";	break;
				}
				msg+=pageXLT.selectSingleNode("//phrase[@id='msgDiscoverError']").text + 
						"\n" + errNode.selectSingleNode("MSG").text
				studioWnd.cmnDlg.messageBox(msg,"ok","stop",window)
			}
		}
	}
	return (domXML);
}
