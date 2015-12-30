/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/reports/printmgr.js,v 1.20.2.13.4.6.10.2.2.8 2012/08/08 12:37:19 jomeli Exp $ */
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
window.document.title = wndArguments ? wndArguments[2] : window.document.title;

var portalWnd = null;
var portalObj = null;
var oJob = null;
var oDropDown=null;
var gPrintersAry = null;
var gGroupsAry = null;
var gCurrentRptInd = null;
var PHRASE_NONE = "None";
var PHRASE_PRINTER = "Printer";
var PHRASE_GROUP = "group";
var PHRASE_YES = "Yes";
var PHRASE_NO = "No";

function init()
{	
	if (wndArguments)
		portalWnd = wndArguments[0];
	else
		portalWnd=envFindObjectWindow("lawsonPortal");
	if (!portalWnd) return;

	// load the script versions
	envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

	portalObj=portalWnd.lawsonPortal;
	portalObj.setMessage("");

	// load phrases
	//if (!portalWnd.rptPhrases) IE9 doesn't like this. Must recreate phrases object
		portalWnd.rptPhrases = new portalWnd.phraseObj("reports");

	PHRASE_NONE = portalWnd.rptPhrases.getPhrase("lblNone");
	PHRASE_PRINTER = portalWnd.rptPhrases.getPhrase("lblPrinter");
	PHRASE_GROUP = portalWnd.rptPhrases.getPhrase("lblDistGroup");
	PHRASE_YES = portalWnd.rptPhrases.getPhrase("lblYes");
	PHRASE_NO = portalWnd.rptPhrases.getPhrase("lblNo");				

	// get job object reference
	oJob = portalWnd.oJob;
	if (oJob == null)
	{
		portalWnd.history.back();
		portalWnd.hideDrillFrame();
		return;
	}

	// set title of page
	if (!portalObj.browser.isIE)
		portalObj.setTitle(portalObj.getPhrase("LBL_REPORT_PROPERTIES"));

	buildToolbar();
	translateLabels()
	oJob.getPrtInfo();
	buildFileList();
	document.body.style.visibility = "visible";
	document.body.style.overflow = "hidden";
	posInFirstFld();
}											  
function translateLabels()
{
	var tmpObj = document.getElementById("lblFile");
	var txtObj = document.createTextNode(portalWnd.rptPhrases.getPhrase("lblFile"));
	tmpObj.appendChild(txtObj);
	tmpObj = document.getElementById("lblDestination");
	txtObj = document.createTextNode(portalWnd.rptPhrases.getPhrase("lblDestination"));
	tmpObj.appendChild(txtObj);
	tmpObj = document.getElementById("lblCopies");
	txtObj = document.createTextNode(portalWnd.rptPhrases.getPhrase("lblCopies"));
	tmpObj.appendChild(txtObj);
	tmpObj = document.getElementById("lblSave");
	txtObj = document.createTextNode(portalWnd.rptPhrases.getPhrase("lblSave"));
	tmpObj.appendChild(txtObj);
	tmpObj = document.getElementById("lblPath");
	txtObj = document.createTextNode(portalWnd.rptPhrases.getPhrase("lblPath"));
	tmpObj.appendChild(txtObj);
	tmpObj = document.getElementById("lblFileAssignments");
	txtObj = document.createTextNode(portalWnd.rptPhrases.getPhrase("lblFileAssignments"));
	tmpObj.appendChild(txtObj);	
}	

function setPrintInfo()
{
	var elemAry = new Array("selDest", "selPrinters", "txtDest", "txtCopies", "cbxSave", "txtPath");
	var loop = elemAry.length;
	
	for(var i=0; i<loop; i++)
	{
		var oElem = document.getElementById(elemAry[i]);
		
		if(oElem.isDirty)
		{
			setPrtProperties(gCurrentRptInd);
			oJob.setPrtInfo();
			var message =portalObj.getPhrase("PRINTINFO");
			closeRptProp(message)		
			return;
		}
	}
	
	closeRptProp("")
}
function handleKeyDown(evt)
{
	var evtCaught = false;
	
	evt = portalWnd.getEventObject(evt);
	if (!evt)
		return false;
	if (portalObj.browser.isIE)
	{
		// get portal hotkey action
		var action = portalObj.keyMgr.getHotkeyAction(evt, "portal");
		// hotkey defined for this keystroke
		if (action != null)
		{
			cntxtActionHandler(evt, action);
			portalWnd.setEventCancel(evt);
			return false;
		}
	}
	else
	{
		// check with portal for hotkey action
		var action = portalWnd.getFrameworkHotkey(evt, "erpReporting");
		if (!action)
		{
			// framework handled the keystroke
			portalWnd.setEventCancel(evt)
			return false;
		}

		// hotkey defined for this keystroke
		if (action != "erpReporting")
		{
			cntxtActionHandler(evt, action);
			portalWnd.setEventCancel(evt);
			return false;
		}
	}

	var keyVal = (portalObj.browser.isIE) ? evt.keyCode : evt.charCode ;
	
	if (keyVal == 0)	// netscape only
		keyVal = evt.keyCode;

	switch(keyVal)
	{	
		case 38://PREVIOUS ROW (up arrow)
			if(!evt.altKey && !evt.ctrlKey && !evt.shiftKey)
			{
				var mElement = window.event.srcElement;
				
				if(mElement.id == "txtCopies")
				{
					var copiesInt = parseInt(mElement.value,10);
					
					if(copiesInt > 1)
						mElement.value = copiesInt - 1;
						
					evtCaught = true;						
				}				
			}
			break;	
		case 40://NEXT ROW (down arrow)
			if(!evt.altKey && !evt.ctrlKey && !evt.shiftKey)
			{
				var mElement = window.event.srcElement;
				
				if(mElement.id == "txtCopies")
				{
					var copiesInt = parseInt(mElement.value,10);
					
					if(copiesInt < 99)
						mElement.value = copiesInt + 1;
				
					evtCaught = true;						
				}
			}
			break;	
		}	

	if (evtCaught)
		portalWnd.setEventCancel(evt);
		
	return evtCaught;	
}
function cntxtActionHandler(evt,action)
{
	if (action==null)		// called by the portal
	{
		action = portalWnd.getFrameworkHotkey(evt,"erpReporting");
		if (!action || action=="erpReporting")
			return false;
	}

	var bHandled=false;

	switch(action)
	{
		case "doCancel":
			closeRptProp();
			bHandled=true;
			break;		
		case "doSubmit":
			setPrintInfo();
			bHandled=true;
			break;		
		case "posInFirstField":
			posInFirstFld();	
			bHandled=true;
			break;
		case "posInToolbar":
			posInToolbar();
			bHandled=true;
			break;
	}
	
	return (bHandled);
}
function rptPropOnFocus(mElement)
{
	mElement.className = "textBoxHighLight";
}
function rptPropOnBlur(mElement)
{
	mElement.className = "textbox";
}
function onDestOptionChange(value, isDirty)
{
	setTimeout("setDestOption('" + value + "'," + isDirty+ ")",100)
}
function setDestOption(value, isDirty)
{
	var txtDestElem = document.getElementById("txtDest");
	var txtCopiesElem = document.getElementById("txtCopies");
	var cbxSaveElem = document.getElementById("cbxSave");			
	var selDestElem = document.getElementById("selDest");
	var selPrinters = document.getElementById("selPrinters");
	var selImage = document.getElementById("imgSelBtn2");
	
	//initialize visibility of elements
	txtDestElem.style.visibility = "visible";
	selPrinters.style.visibility = "hidden";
	selImage.style.visibility = "hidden";
	
	selDestElem.isDirty = isDirty;
	
	switch(value)
	{
		case PHRASE_NONE:
			txtDestElem.disabled = true;
			txtCopiesElem.disabled = true;
			cbxSaveElem.disabled = true;
			buildNoneList();
			break;
		case PHRASE_PRINTER:
			txtDestElem.disabled = false;
			txtCopiesElem.disabled = false;
			cbxSaveElem.disabled = false;
			txtDestElem.style.visibility = "hidden";
			selPrinters.style.visibility = "visible";
			selImage.style.visibility = "visible";
			//buildPrinterList();
			break;
		case PHRASE_GROUP:
			txtDestElem.disabled = false;
			txtCopiesElem.disabled = true;
			cbxSaveElem.disabled = true;
			buildGroupList();
			break;
	}
}
function buildToolbar()
{
	if (portalObj.browser.isIE)
	{
		var toolBarElement = document.getElementById("toolBarDiv");
		toolBarElement.style.display = "block"
		var oToolbar = new portalWnd.Toolbar(portalWnd, window, toolBarElement);	
	}
	else
		var oToolbar = portalObj.toolbar;

	oToolbar.clear();
	oToolbar.target = window;
	oToolbar.createButton(portalWnd.rptPhrases.getPhrase("lblOK"), setPrintInfo);
	oToolbar.createButton(portalWnd.rptPhrases.getPhrase("lblCancel"), closeRptProp);
}
function closeRptProp(message)
{
	if(typeof(message)!= "string")
		message = "";
		
	portalObj.setMessage(message);
	portalWnd.oJob = null;	
		
	if (portalObj.browser.isIE)
	{
		portalWnd.clearCallBackPrms();
		window.close();
	}
	else
		portalWnd.hideDrillFrame();
}
function posInFirstFld()
{
	var	firstFldElm = document.getElementById("selFiles");
	firstFldElm.focus();	
}
function posInToolbar()
{
	var toolBar=window.document.getElementById("toolBarDiv");
	if (!toolBar) return false;

	var tbList=toolBar.getElementsByTagName("BUTTON")
	for (var i = 0; i < tbList.length; i++)
	{
		if (tbList[i].disabled) continue;
		if (tbList[i].style.visibility=="hidden") continue;

		tbList[i].focus();
		return true;
	}
	return false;
}

function onMyChange(elem)
{
	elem.isDirty = true;
}
function buildFileList()
{
	var selFilesElem = document.getElementById("selFiles");	
	var loop = oJob.rptPropAry.length;
		
	for(var i=0; i<loop; i++)
	{
		var prtFile = oJob.rptPropAry[i].prtFile;
		var prtPath = oJob.rptPropAry[i].path
		
		if(!prtFile)
			continue;
			
		portalWnd.cmnCreateSelectOption(document, selFilesElem, prtFile, prtPath + "/" + prtFile);
	}
	
	var nbrOfPrt = selFilesElem.options.length;
	
	if(nbrOfPrt == 0)
		portalWnd.cmnCreateSelectOption(document, selFilesElem, PHRASE_NONE, "");
	else
		setPrtFile(selFilesElem.selectedIndex);
}
function onPrtChange(rptIndx)
{
	setTimeout("setPrtFile(" + rptIndx + ")",100)
}
function setPrtFile(rptIndx)
{
	setPrtProperties(gCurrentRptInd);
	gCurrentRptInd = rptIndx;
	var oPrtData = oJob.rptPropAry[rptIndx];
	var txtCopiesElem = document.getElementById("txtCopies");
	var cbxSaveElem = document.getElementById("cbxSave");
	var txtPathElem = document.getElementById("txtPath");

	//Step 1. Destination
	buildDestinationList(oPrtData.destOption, oPrtData.destination)		
	//Step 2. Copies
	txtCopiesElem.value = oPrtData.copies;	
	//Step 3. Save Option
	cbxSaveElem.checked = oPrtData.saveOption == PHRASE_YES ? true : false;
	//Step 4. Path
	txtPathElem.value = oPrtData.path;		
}
function buildDestinationList(destOption, destination)
{
	buildDestOptionList(destOption);
	
	if(destOption == PHRASE_PRINTER)
		buildPrinterList(destination);	
	if(destOption == PHRASE_GROUP)
		buildGroupList(destination);
}
function buildDestOptionList(currentOption)
{
	currentOption = currentOption == "" ? PHRASE_NONE : currentOption
	var tempAry = new Array(PHRASE_NONE, PHRASE_PRINTER, PHRASE_GROUP);
	var selDestElem = document.getElementById("selDest");
	
	if(selDestElem.getAttribute("isBuilt") == "NO")
	{	
		for(var i=0; i<3; i++)
		{
			portalWnd.cmnCreateSelectOption(document, selDestElem, tempAry[i], tempAry[i]);

			if (currentOption == tempAry[i])
				selDestElem.selectedIndex = i;
		}
		
		selDestElem.setAttribute("isBuilt", "YES");
	}
	else
	{	//select option
		var loop = selDestElem.options.length;
	
		for(var i=0; i<loop; i++)
		{
			if (currentOption == selDestElem.options[i].value)
				selDestElem.selectedIndex = i;
		}		
	}

	setDestOption(currentOption, false);			
}
function buildNoneList()
{
	var txtDestElem = document.getElementById("txtDest");
	txtDestElem.options.length = 0;
	portalWnd.cmnCreateSelectOption(document, txtDestElem, PHRASE_NONE, "");
	setDestination(null, false)

}

function doPrinterSelect()
{
	var IDACall = "/servlet/Router/Drill/Erp?_OUT=XML&_TYP=SL&_KNB=@pt";
	portalObj.drill.doSelect(window, "returnPrinterSelect", IDACall, portalWnd.IDAPath, true, this);
	this.focus();
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

		var elem = document.getElementById("selPrinters");
		if (elem)
		{
			if (elem.value != value)
			{
				elem.isDirty = true;
				var textDestElem = document.getElementById("txtDest");
				textDestElem.isDirty = false;
			}
			elem.value = value;
			setPrinterDescription(value);
		}
	}
}

function setPrinterDescription(strCurrent)
{
	var elem = document.getElementById("selPrinters");
	

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
					{
						var elemDesc=this.document.getElementById("outDest");
						if (elemDesc)
							this.portalWnd.cmnSetElementText(elemDesc,prDesc);
						break;
					}
				}
			}
		}
		if (elem)
			elem.value = strCurrent;
	}

}

function buildPrinterList(currentPrinter)
{
	if(!gPrintersAry)
		getPrinters();
		
	if(typeof(currentPrinter)== "undefined")
		currentPrinter = portalWnd.oUserProfile.getAttribute("printername");

	var selDestElem = document.getElementById("selDest");		
	var txtDestElem = document.getElementById("txtDest");
	var selPrinters = document.getElementById("selPrinters");
	var selImage = document.getElementById("imgSelBtn2");
	
	/*
	txtDestElem.options.length = 0;
	var loop = gPrintersAry.length;

	if(loop == 0)
	{
		portalWnd.cmnCreateSelectOption(document, txtDestElem, PHRASE_NONE, "");
		setDestination(txtDestElem.selectedIndex, false);
		return;
	}
		
	for(var i=0; i<loop; i++)
	{
		var printerName = gPrintersAry[i][0];
		portalWnd.cmnCreateSelectOption(document, txtDestElem, printerName, printerName);

		if (portalWnd.trim(currentPrinter) == portalWnd.trim(printerName))
			txtDestElem.selectedIndex = i;
	}
	setDestination(txtDestElem.selectedIndex, false);
	*/
	selPrinters.value = currentPrinter;
	setPrinterDescription(currentPrinter);
	//is printer selection disabled
	var optNode = portalWnd.oPortalConfig.getUserOption("printer");
	var strDisabled = (optNode ? optNode.getAttribute("disable") : "0");
	
	if(strDisabled == "0")
		selImage.disabled = false;
	else
		selImage.disabled = true;		
}
function buildGroupList(currentGroup)
{
	if(!gGroupsAry)
		getGroups();

	var selDestElem = document.getElementById("selDest");		
	var txtDestElem = document.getElementById("txtDest");
	
	txtDestElem.options.length = 0;
	var loop = gGroupsAry.length;

	if(loop == 0)
	{
		portalWnd.cmnCreateSelectOption(document, txtDestElem, PHRASE_NONE, "");
		setDestination(txtDestElem.selectedIndex, false);
		return;
	}
		
	for(var i=0; i<loop; i++)
	{
		var groupName = gGroupsAry[i][0];
		portalWnd.cmnCreateSelectOption(document, txtDestElem, groupName, groupName);

		if (currentGroup && (portalWnd.trim(currentGroup) == portalWnd.trim(groupName)))
			txtDestElem.selectedIndex = i;
	}
	setDestination(txtDestElem.selectedIndex, false)
}
function onDestinationChange(indx, isDirty)
{
	setTimeout("setDestination(" + indx + "," + isDirty + ")",100)
}
function setDestination(indx, isDirty)
{
	var selDestElem = document.getElementById("selDest");
	var destination = selDestElem.options[selDestElem.selectedIndex].value;
	var outDestElem = document.getElementById("outDest");	
	
	if(destination == PHRASE_PRINTER)
		var outputValue = gPrintersAry.length ? gPrintersAry[indx][1] : PHRASE_NONE;

	if(destination == PHRASE_GROUP)
		var outputValue = gGroupsAry.length ? gGroupsAry[indx][1] : PHRASE_NONE;

	if(destination == PHRASE_NONE)
		var outputValue = PHRASE_NONE;		

	portalWnd.cmnSetElementText(outDestElem, outputValue);
	outDestElem.title = outputValue;
}
function setPrtProperties(rptIndx)
{
	if(rptIndx == null)
		return;

	var oPrtData = oJob.rptPropAry[rptIndx];
	var selDestElem = document.getElementById("selDest");
	var txtDestElem = document.getElementById("txtDest");		
	var txtCopiesElem = document.getElementById("txtCopies");
	var cbxSaveElem = document.getElementById("cbxSave");
	var txtPathElem = document.getElementById("txtPath");
	var selPrinters = document.getElementById("selPrinters");

	//Step 1. Destination
	oPrtData.destOption = selDestElem.options[selDestElem.selectedIndex].value;
	if (oPrtData.destOption == "Printer")
		oPrtData.destination = selPrinters.value;
	else
		oPrtData.destination = txtDestElem.options[txtDestElem.selectedIndex].value;
	//Step 2. Copies
	oPrtData.copies = txtCopiesElem.value;	
	//Step 3. Save Option
	oPrtData.saveOption = cbxSaveElem.checked ? PHRASE_YES : PHRASE_NO;
	//Step 4. Path
	oPrtData.path = txtPathElem.value;	
}
function getPrinters()
{
	gPrintersAry = new Array();
	var api = portalWnd.IDAPath + "?_OUT=XML&_TYP=SL&_KNB=@pt";
	var printersXml = portalWnd.httpRequest(api,null,null,null,false);

	var msg=portalObj.getPhrase("msgErrorInvalidResponse") + "\n" +api;
	if (portalWnd.oError.isErrorResponse(printersXml,true,true,false,msg,window))
		return;
		
	var oDS = portalWnd.oError.getDSObject();
	var lineNodes = oDS.getElementsByTagName("LINE");
	var len = lineNodes.length;

	for (var i=0; i < len; i++)
	{
		var colNodes = lineNodes[i].getElementsByTagName("COL");
		var colLen = colNodes.length;
	
		if (colLen == 2 && colNodes[1].hasChildNodes())
		{
			if (colNodes[1].childNodes[0].nodeValue.toLowerCase() == "default printer")
				continue;
			else
			{
				var printerDesc = (colNodes[1].childNodes[0].nodeValue != "") 
					? colNodes[1].childNodes[0].nodeValue
					: "";
				var printerName = colNodes[0].childNodes[0].nodeValue;
			}
		}
		var tempAry = new Array(printerName, printerDesc);
		gPrintersAry.push(tempAry);
	}
}
function getGroups()
{
	gGroupsAry = new Array();
	var api = portalWnd.IDAPath + "?_OUT=XML&_TYP=SL&_KNB=@dg";
	var nextNodes = getPage(api);
	var oDS = portalWnd.oError.getDSObject();
	var lineNodes = oDS.getElementsByTagName("LINE");
	var len = lineNodes.length;

	do
	{
		for (var i=0; i < len; i++)
		{
			var colNodes = lineNodes[i].getElementsByTagName("COL");
			var colLen = colNodes.length;
		
			if (colLen == 2 && colNodes[1].hasChildNodes())
			{
				var groupDesc = (colNodes[1].childNodes[0].nodeValue != "") 
					? colNodes[1].childNodes[0].nodeValue
					: "";
				var groupName = colNodes[0].childNodes[0].nodeValue;
			}
			var tempAry = new Array(groupName, groupDesc);
			gGroupsAry.push(tempAry);
		}
		var exitSW = 1;
		if(nextNodes[0].text != "")
		{
			var nextpage = nextNodes[0].text;
			IDAPath = portalWnd.IDAPath;
			pathIndex = IDAPath.indexOf("Drill/Erp");
			nextIDAPath = IDAPath.slice(0,pathIndex);
			api = nextIDAPath + nextpage;

			nextNodes = getPage(api);
			
			oDS = portalWnd.oError.getDSObject();
			lineNodes = oDS.getElementsByTagName("LINE");
			len = lineNodes.length;
			exitSW = 0
		}
	}
	while ((len > 0) && (exitSW == 0))
}

function getPage(api)
{
	var groupsXml = portalWnd.httpRequest(api,null,null,null,false);

	var msg=portalObj.getPhrase("msgErrorInvalidResponse") + "\n" + api;
	if (portalWnd.oError.isErrorResponse(groupsXml,true,true,false,msg,window))
		return;

	var oDS = portalWnd.oError.getDSObject();
	var nextNodes = oDS.getElementsByTagName("NEXTPAGE");
	var nextLen = nextNodes.length;
	return nextNodes;
}
