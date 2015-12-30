/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/reports/rptprint.js,v 1.20.2.13.4.7.6.1.2.10.2.1 2013/11/21 01:38:46 renang Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.671 2013-11-21 04:00:00 */
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
var oJob=null;
var gPrintersAry = null;

function initPrintDlg()
{
	if (wndArguments)
		portalWnd = wndArguments[0];
	else
		portalWnd=envFindObjectWindow("lawsonPortal");
	if (!portalWnd) return;

	// load the script versions
	envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);
		
	portalObj=portalWnd.lawsonPortal;

	//load phrases
	if(!portalWnd.rptPhrases)
		portalWnd.rptPhrases = new portalWnd.phraseObj("reports");

	portalObj.setMessage("");

	// get job object reference
	oJob = portalWnd.oJob;
	if (oJob == null || typeof(oJob.printFile) == "undefined")
	{
		portalWnd.history.back();
		portalWnd.hideDrillFrame();
		return;
	}

	// set title of page
	if (!portalObj.browser.isIE)
		portalObj.setTitle(portalWnd.rptPhrases.getPhrase("lblJobPrint"));

	buildToolbar();
	translateLabels();
	buildPrinterList();
	document.body.style.visibility = "visible";
	document.body.style.overflow = "hidden";
	posInFirstField();
}
function buildPrinterList()
{
	var	currentPrinter = portalWnd.oUserProfile.getAttribute("printername");

	var selPrintersElem = document.getElementById("selPrinters");		
	var selButtonPrinters = document.getElementById("imgSelBtn2");		

	selPrintersElem.value = currentPrinter;
	if ( currentPrinter != "" )
		setPrinterDescOnBlur(currentPrinter);
	//is printer selection disabled
	var optNode = portalWnd.oPortalConfig.getUserOption("printer");
	var strDisabled = (optNode ? optNode.getAttribute("disable") : "0");
	
	if(strDisabled == "0")
	{
		selButtonPrinters.disabled = false;
		selPrintersElem.disabled = false;
	}
	else
	{
		selButtonPrinters.disabled = true;	
		selPrintersElem.disabled = true;
	}
}

function onPrinterBlur()
{
	var elem = document.getElementById("selPrinters");
	if (elem && (elem.value != ""))
		setPrinterDescOnBlur(elem.value);
	else
		return;
}

function doPrinterSelect()
{
	var IDACall = "/servlet/Router/Drill/Erp?_OUT=XML&_TYP=SL&_KNB=@pt";
	portalObj.drill.doSelect(window, "returnPrinterSelect", IDACall, portalWnd.IDAPath, true, this);
	this.focus();
}
 
function setPrinterDescription(strCurrent)
{
	
	var elem = document.getElementById("selPrinters");


	var ds = this.portalWnd.oError.getDSObject();
	var setWidth = false;
	var lineNodes = ds.getElementsByTagName("LINE");
	var len = lineNodes.length;
	var index = -1;
	
	var page = ds.getElementsByTagName("NEXTPAGE");
	var pageLen = page.length;
	
	
	
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
						prName=this.portalWnd.trim(keyNodes[0].childNodes[0].nodeValue);
						if (prName == this.portalWnd.trim(strCurrent))
							break;
						else
							prDesc="";
					}
				}
				

			}
		}
		
		var elemDesc=this.document.getElementById("outPrinter");
		
		if (elemDesc)
			elemDesc.innerHTML = prDesc;
		
		elem.value = strCurrent;
		
	}

}

function setPrinterDescOnBlur(input)
{	
	var prName = this.portalWnd.trim(input);	

	var oMsgs = new this.portalWnd.phraseObj("preferences");
	//drill for only the record we want
	var call = this.portalWnd.IDAPath + "?_OUT=XML&_TYP=SL&_KNB=@pt&maxRecords=1&SK1=" + prName;
	var response = this.portalWnd.httpRequest(call, null, "", "", false);
	var msg = oMsgs.getPhrase("msgErrorLoadPrinters")
			+ " (calling drill around engine)";
	this.portalWnd.oError.setMessage(msg);

	var elem = document.getElementById("selPrinters");
	if (this.portalWnd.oError.isErrorResponse(response, true, true)) {
		elem.className = "xtTextBoxDisabled";
		elem.disabled = true;
		return;
	}
					
	var ds = this.portalWnd.oError.getDSObject();
	var lineNodes = ds.getElementsByTagName("LINE");
	var prDesc = "";
	
	/*
	 * this drill call will only return one record. If there is none, there 
	 * are no printers in this system
	 */	
	if ( lineNodes.length > 0 ) 
	{
		colNodes = lineNodes[0].getElementsByTagName("COL");
		if ( colNodes.length >=2 )
		{
			/* 
			 * drill can return an "incorrect" first value if the SK1 prName
			 * does not exist in the DB
			 * 1st COL node is name, 2nd is description
			 */		
			if (prName == this.portalWnd.trim(colNodes[0].childNodes[0].nodeValue))			
				prDesc = this.portalWnd.trim(colNodes[1].childNodes[0].nodeValue);			
		}
	}
					
	var elemDesc=this.document.getElementById("outPrinter");
	if (elemDesc)
		elemDesc.innerHTML = prDesc;					
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
			elem.value = value;
			setPrinterDescription(value);
		}
	}


}

function doPrint()
{	
	var printObj = document.getElementById("selPrinters");
	var copiesObj = document.getElementById("nbrCopies");

	if (printObj.value == "")
	{	
		var msg = portalWnd.rptPhrases.getPhrase("msgPrinterInvalid");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		printObj.focus();
		return;
	}

	if (copiesObj.value == "" 
	|| isNaN(parseInt(copiesObj.value,10)) 
	|| parseInt(copiesObj.value,10) < 1)
	{	
		var msg = portalWnd.rptPhrases.getPhrase("msgCopiesInvalid");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		copiesObj.focus();
		copiesObj.select();
		return;
	}

	if (parseInt(copiesObj.value, 10) > 99)
		copiesObj.value = "1";

	oJob.copies  = copiesObj.value;
	oJob.printer = printObj.value;
	var jobName = !oJob.jobName ? portalWnd.rptPhrases.getPhrase("lblJob"): oJob.jobName;
	
	portalObj.setMessage(portalWnd.rptPhrases.getPhrase("msgPrinting"));
	var msg = oJob.printReport();	// before this function completes, it sets oJob back to null;

	if (msg.status)
	{
		closePrint(msg)
		return;
	}
	//this needs to be changed so XML is return by IOS
	var msg=(msg.indexOf("File Has Been Printed.") == -1) 
		? portalObj.getPhrase("PRINTERROR") 
		: jobName + " " + portalWnd.rptPhrases.getPhrase("msgJobPrinted");

	closePrint(msg)
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
				
				if(mElement.id == "nbrCopies")
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
				
				if(mElement.id == "nbrCopies")
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
			closePrint();
			bHandled=true;
			break;		
		case "doSubmit":
			doPrint();
			bHandled=true;
			break;		
		case "posInFirstField":
			posInFirstField();
			bHandled=true;
			break;
		case "posInToolbar":
			posInToolbar();
			bHandled=true;
			break;			
	}
	
	return (bHandled);
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
	oToolbar.createButton(portalWnd.rptPhrases.getPhrase("lblPrint"), doPrint);
	oToolbar.createButton(portalWnd.rptPhrases.getPhrase("lblCancel"), closePrint);
}
function closePrint(message)
{
	if(typeof(message)!= "string")
		message = "";
	
	if(message.length)
		portalWnd.cmnDlg.messageBox(message,"ok","",window);
				
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
function posInFirstField()
{
	var selPrintersElem = document.getElementById("selPrinters");	

	if(selPrintersElem.disabled)
		document.getElementById("nbrCopies").focus();	
	else
		selPrintersElem.focus();
	
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
function translateLabels()
{
	var txtObj = null;
	
	txtObj = document.getElementById("lblJobOwner");
	portalWnd.cmnSetElementText(txtObj,portalWnd.rptPhrases.getPhrase("lblJobOwner"));

	txtObj = document.getElementById("lblJobName");
	portalWnd.cmnSetElementText(txtObj,portalWnd.rptPhrases.getPhrase("lblJobName"));

	txtObj = document.getElementById("lblToken");
	portalWnd.cmnSetElementText(txtObj,portalWnd.rptPhrases.getPhrase("lblForm"));

	txtObj = document.getElementById("lblPrtFile");
	portalWnd.cmnSetElementText(txtObj,portalWnd.rptPhrases.getPhrase("lblPrintFile"));

	txtObj = document.getElementById("lblPrinter");
	portalWnd.cmnSetElementText(txtObj,portalWnd.rptPhrases.getPhrase("lblPrinter"));
	
	txtObj = document.getElementById("lblCopies");
	portalWnd.cmnSetElementText(txtObj,portalWnd.rptPhrases.getPhrase("lblCopies"));
	
	txtObj = document.getElementById("jobOwner");
	portalWnd.cmnSetElementText(txtObj,oJob.userName);
	
	txtObj = document.getElementById("jobName");
	portalWnd.cmnSetElementText(txtObj,oJob.jobName);

	txtObj = document.getElementById("token");
	portalWnd.cmnSetElementText(txtObj,oJob.token);

	txtObj = document.getElementById("prtFile");
	portalWnd.cmnSetElementText(txtObj,oJob.printFile.substring(oJob.printFile.lastIndexOf("/")+1));

	txtObj = document.getElementById("nbrCopies");
	txtObj.value = "1";
}
function printOnFocus(mElement)
{
	mElement.className = "textBoxHighLight";
}
function printOnBlur(mElement)
{
	mElement.className = "textbox";
}
function getPrinters()
{
	gPrintersAry = new Array();
	var api = portalWnd.IDAPath + "?_OUT=XML&_TYP=SL&_KNB=@pt&_RECSTOGET=1000";
	var printersXml = portalWnd.httpRequest(api,null,null,null,false);

	var msg=portalObj.getPhrase("msgErrorInvalidResponse") + "\n\n" + api;
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
			if (colNodes[1].childNodes[0].nodeValue == "Default Printer")
				continue;
			else
			{
				var printerDesc = (colNodes[1].childNodes[0].nodeValue != "") 
					? colNodes[1].childNodes[0].nodeValue
					: keyNodes[0].childNodes[0].nodeValue;
				var printerName = colNodes[0].childNodes[0].nodeValue;
			}
		}
		var tempAry = new Array(printerName, printerDesc);
		gPrintersAry.push(tempAry);
	}
}
function onPrinterChange(indx)
{
	var outPrinterElem = document.getElementById("outPrinter");	
	
	var outputValue = gPrintersAry.length ? gPrintersAry[indx][1] : portalWnd.rptPhrases.getPhrase("lblNone");
	portalWnd.cmnSetElementText(outPrinterElem, outputValue);
	outPrinterElem.title = outputValue;
}
