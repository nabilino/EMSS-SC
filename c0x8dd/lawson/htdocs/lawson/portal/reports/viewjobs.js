/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/reports/viewjobs.js,v 1.49.2.19.4.19.6.13.2.11.2.5 2013/12/11 01:15:43 renang Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.692 2013-12-12 04:00:00 */
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
var VIEWJOBSJS="reports/viewjobs.js"		// filename constant for error handler
var portalWnd = null;
var portalObj = null;
var g=null;
var domainName="";

function GlobalObject(portalPath)
{
	this.pdfOption="LANDSCAPE";	
	this.rptNameAry = new Array;
	this.rptIndexAry = new Array;
	this.rptFmtPhraseAry = new Array;
	this.rptFmtAry = new Array;
}
//-----------------------------------------------------------------------------
function initViewJobs()
{
	try{
	
    portalWnd = parent;
	portalObj = portalWnd.lawsonPortal;
	g=new GlobalObject(portalObj.path);
		
	portalObj.setMessage(portalObj.getPhrase("LOADING"));
	document.body.style.cursor = "wait";
	//if(!portalWnd.rptPhrases) IE9 doesn't like this. Must recreate phrases object.
	portalWnd.rptPhrases = new portalWnd.phraseObj("reports"); 

	domainName = portalWnd.getDomainName();
	buildRelatedReports(portalWnd.oJobPrintFiles.selectedPrintFile);
	buildViewOptions();
	buildToolbar();
	doViewRpt();

	document.body.style.visibility = "visible";
	document.body.style.overflow = "hidden";

	} catch(e){reportError(e)}		
}
//-----------------------------------------------------------------------------
function setTitle(printFile)
{
	try{
	var title = printFile.filePath.substring(printFile.filePath.lastIndexOf("/") + 1);
	
	if(printFile.name)
	{
		title += " (" + portalWnd.rptPhrases.getPhrase("lblJob") + " " + printFile.name + " - "
		title += portalWnd.rptPhrases.getPhrase("lblStep") + " " + printFile.jobStep + ")";
	}
	
	title=(typeof(title)=="undefined" ? "" : title);
	portalObj.setTitle(title);

	} catch(e){reportError(e)}			
}
//-----------------------------------------------------------------------------
function buildViewOptions()
{
	try{

	var defaultFormat = portalWnd.getDefaultViewFormat();
	var optNode = portalWnd.oPortalConfig.getUserOption("reportformat");
	var strDisabled = (optNode ? optNode.getAttribute("disable") : "0");

	//View Option button is not necessary if text is the default view
	//and the user can not change the view format.	
	if (strDisabled == "1" && defaultFormat == "textView")
		return;
			
	//PDF report formats are needed  
	var PDF_PHRASE = portalWnd.rptPhrases.getPhrase("lblPDF");
	g.rptFmtPhraseAry.push(PDF_PHRASE + " - " + portalWnd.rptPhrases.getPhrase("lblLandscape"));
	g.rptFmtAry.push("LANDSCAPE");
	g.rptFmtPhraseAry.push(PDF_PHRASE + " - " + portalWnd.rptPhrases.getPhrase("lblPortrait"));
	g.rptFmtAry.push("PORTRAIT");
	g.rptFmtPhraseAry.push(PDF_PHRASE + " - " + portalWnd.rptPhrases.getPhrase("lblCondensed158"));
	g.rptFmtAry.push("CONDENSED158");
	g.rptFmtPhraseAry.push(PDF_PHRASE + " - " + portalWnd.rptPhrases.getPhrase("lblCondensed198"));
	g.rptFmtAry.push("CONDENSED198");
	g.rptFmtPhraseAry.push(PDF_PHRASE + " - " + portalWnd.rptPhrases.getPhrase("lblCondensed233"));
	g.rptFmtAry.push("CONDENSED233");
	 if ( getLSRStatus() )
	{	
		g.rptFmtPhraseAry.push(portalWnd.rptPhrases.getPhrase("lblLSR"));
		g.rptFmtAry.push("LSR");
	}

	//Text report format is necessary only if user able to change report format
	if (strDisabled != "1")
	{
		g.rptFmtPhraseAry.unshift(portalWnd.rptPhrases.getPhrase("lblText"));
		g.rptFmtAry.unshift("textView");	
	}
	
	} catch(e){reportError(e)}	
}
//-----------------------------------------------------------------------------
function getLSRStatus()
{
    try
    {
        var rptIndex = portalWnd.oJobPrintFiles.selectedPrintFile;
        var printFile = portalWnd.oJobPrintFiles.printFiles[rptIndex];
        var pdl = printFile.pdl;
        var token = printFile.token;
    
        var api = "/lawson-ios/action/InquireLSRStatus?productLine=" + pdl + "&token=" + token;         
        var myXML = portalWnd.httpRequest(api, null, "", "application/x-www-form-urlencoded", false);
    
        if (typeof(myXML) != "string")
        {
			var lsrnode = myXML.getElementsByTagName("LSRREQUEST");
			
			//disable LSR if the LSRInquireStatus service is missing
			if (lsrnode && (lsrnode.length > 0))			
				return lsrnode[0].getAttribute("enabled").toLowerCase() == "true";
        }
    } 
    catch(e) { reportError(e); }
    
    return false;
}
//-----------------------------------------------------------------------------
function buildToolbar()
{
	try{
	
	portalObj.toolbar.target = window;
	portalObj.toolbar.clear();
	
	portalObj.toolbar.createButton(portalObj.getPhrase("LBL_BACK"),doClose,"close","","","back");
	portalObj.toolbar.createButton(portalWnd.rptPhrases.getPhrase("lblPrint"),doPrint,"print");
	portalObj.toolbar.createButton(portalWnd.rptPhrases.getPhrase("lblCreateCSV"),doCSV,"print");
	
	if (g.rptFmtAry.length > 0)
	{
		portalObj.toolbar.addSeparator();	
		
		var text = portalObj.getPhrase("LBL_VIEW_OPTIONS");
		var title = portalWnd.rptPhrases.getPhrase("lblShowReportFormats");
		portalObj.toolbar.addDropdownButton("actions",text,title,showViewOptions,title,showViewOptions);
	}
	
	if(g.rptNameAry.length > 0)
	{
		var text=portalObj.getPhrase("LBL_RELATED_REPORTS");
		var title=portalWnd.rptPhrases.getPhrase("lblShowRelatedReports"); 
		portalObj.toolbar.addDropdownButtonRight("links",text,title,showRelatedReports,title,showRelatedReports);
	}
	
	} catch(e){reportError(e)}		
}
//-----------------------------------------------------------------------------
function doClose()
{
	try{
	
	if (portalWnd.oJobPrintFiles.caller == "Jobs")
		goJobList();
	else
		goPrintFiles();

	} catch(e){reportError(e)}			
}
//============================================================//
function doViewRelatedRpt(rptIndex)
{
	try{
	
	if (typeof(rptIndex) == "undefined") return;

	portalWnd.oJobPrintFiles.selectedPrintFile = rptIndex;
	doViewRpt();
	buildRelatedReports(rptIndex);
	
	} catch(e){reportError(e)}		
}
//============================================================//
function showRelatedReports()
{
	try{
	
	var actionBtn=portalWnd.document.getElementById("LAWTBBUTTONlinks");
	var dropBtn=portalWnd.document.getElementById("LAWDROPBUTTONlinks");
	actionBtn.className="";
	dropBtn.className="";
	portalWnd.iWindow.dropObj.clearItems();
	var loop = g.rptNameAry.length;

	for (var i = 0; i < loop; i++)
	{
		var menuText = g.rptNameAry[i];
		var menuClick = portalWnd.iWindow.dropObj.trackMenuClick
		var menuHref = "frames[0].doViewRelatedRpt(" + g.rptIndexAry[i] + ")"
		portalWnd.iWindow.dropObj.addItem(menuText, null, "FUNCTION", menuClick, menuHref);
	}
	
	portalWnd.iWindow.dropObj.showIframe("",actionBtn,"dropObj.portalWnd.frames[0].doViewRelatedRpt");
	
	} catch(e){reportError(e)}	
}
//-----------------------------------------------------------------------------
function doRptFmtChange(rptFormat)
{
	try{
	
	if(!rptFormat) return;
	
	portalWnd.oJobPrintFiles.viewFormat = rptFormat;	
	doViewRpt();
	
	} catch(e){reportError(e)}	
}
//-----------------------------------------------------------------------------
function showViewOptions()
{
	try{
	
	var actionBtn=portalWnd.document.getElementById("LAWTBBUTTONactions");
	portalWnd.iWindow.dropObj.clearItems();
	var loop = g.rptFmtPhraseAry.length;
	var currentFormat = portalWnd.oJobPrintFiles.viewFormat;
	var initialSelect = "";

	for (var i = 0; i < loop; i++)
	{
		if(initialSelect == "" && (currentFormat == g.rptFmtAry[i]))
			initialSelect = g.rptFmtPhraseAry[i];
			
		var menuText = g.rptFmtPhraseAry[i];
		var menuClick = portalWnd.iWindow.dropObj.trackMenuClick;
		var menuHref="frames[0].doRptFmtChange('" + g.rptFmtAry[i] + "')";
		portalWnd.iWindow.dropObj.addItem(menuText,null,"FUNCTION",menuClick,menuHref);
	}
	
	portalWnd.iWindow.dropObj.showIframe(initialSelect,actionBtn,"dropObj.portalWnd.frames[0].doRptFmtChange");
	
	} catch(e){reportError(e)}		
}
//-----------------------------------------------------------------------------
function doViewRpt()
{

	try{

	var reportFormat = (portalWnd.oJobPrintFiles.viewFormat == "pdfView"
		? g.pdfOption 
		: portalWnd.oJobPrintFiles.viewFormat);
	var rptIndex = portalWnd.oJobPrintFiles.selectedPrintFile;
	var printFile = portalWnd.oJobPrintFiles.printFiles[rptIndex];
	var filePath = printFile.filePath;
	var pdl = printFile.pdl;
	var token = printFile.token;
	var rptype;
	
	if (reportFormat == "LSR" && !getLSRStatus())
		reportFormat = "textView";	
	// NT backslashes!! make 2->1
	filePath = filePath.replace(/\\{2}/g, "\\");

	// too many scrollbars when pdf opens in IE
	if (portalObj.browser.isIE)
		document.body.scroll = (isPDFview(reportFormat)) ? "no" : "auto";

	portalObj.setMessage(portalObj.getPhrase("LOADING"));
	document.body.style.cursor = "wait";

	if(isPDFview(reportFormat))
	{
		if(reportFormat != "LSR"){
			var api = "/servlet/Report?action=PDF&file=" + filePath;
			api +=  "&LAYOUT=" + reportFormat;		
			api += "&REPORT_OWNER=" +portalWnd.oJobPrintFiles.userName;
			pdfWnd = window.open(api,'pdfWin',"width=800,height=600,resizable=yes");
			portalObj.setMessage(portalObj.getPhrase("AGSREADY")); 		
		}else{
			
			var api = "/servlet/Report?action=LSR&file=" + filePath;
			api += "&REPORT_OWNER=" +portalWnd.oJobPrintFiles.userName;				
			var myXML =	portalWnd.httpRequest(api, null, "", "application/pdf", false);
			
			if(typeof(myXML) != "string")
			{
				var details = myXML.getElementsByTagName("DETAILS")[0].childNodes[0].text;
				
				if(details.indexOf("FormatNotEnabledException") != -1){
					this.setDefaultReport(filePath, domainName, printFile);
					document.body.style.cursor = "auto";
					portalObj.setMessage(portalWnd.rptPhrases.getPhrase("msgLSRNotEnabled"));
				}else{
					var msg = myXML.getElementsByTagName("ERROR")[0].childNodes[0].text;
					portalWnd.cmnDlg.errorMessageBox(msg,myXML,(myXML=="" ? "info" : "alert"),window);
					portalObj.setMessage("");
				}
			}else{
				pdfWnd = window.open(api,'pdfWin',"width=800,height=600,resizable=yes"); 						
				document.body.style.cursor = "auto";
				portalObj.setMessage(portalObj.getPhrase("AGSREADY"));		
			}
		}
	}
	else
	{
		this.setDefaultReport(filePath,domainName,printFile);
		document.body.style.cursor = "auto";
		portalObj.setMessage(portalObj.getPhrase("AGSREADY"));
	}

	} catch(e){reportError(e)}		
}

function setDefaultReport(filePath,domainName,printFile) {
	var api = "/cgi-lawson/webrpt.exe?";
	api += (domainName) ? "&_DOMAIN=" + domainName : "";
	api += "&_FN=" + filePath +	"&_DTGT=";	
	portalObj.toolbar.changeButtonState("print","ENABLED");
	document.getElementById("reportFrame").src = api ;
	setTitle(printFile);	
}


//-----------------------------------------------------------------------------
function buildRelatedReports(rptIndex)
{
	try{
	
	//reset global arrays to nothing
	g.rptNameAry.length = 0;
	g.rptIndexAry.length = 0;
	var loop = portalWnd.oJobPrintFiles.printFiles.length;
	//repopulate array but do not include the displayed report	
	for(var i = 0; i < loop; i++)
	{
		if(i == rptIndex) continue;
		
		var printFile = portalWnd.oJobPrintFiles.printFiles[i];
		var rptName = printFile.filePath;
		var j = rptName.lastIndexOf("/");
		
		if (j > 0)
			rptName = rptName.substr(j+1);

		rptName = rptName + " - " + 
				portalWnd.rptPhrases.getPhrase("lblJob") + " " + printFile.name + " " + 
				portalWnd.rptPhrases.getPhrase("lblStep") + " " + printFile.jobStep;
						
		g.rptNameAry.push(rptName);
		g.rptIndexAry.push(i);
	}
	
	} catch(e){reportError(e)}		
}
//-----------------------------------------------------------------------------
function doCSV()
{
	try{
	
	var rptIndex = portalWnd.oJobPrintFiles.selectedPrintFile;
	var filePath = portalWnd.oJobPrintFiles.printFiles[rptIndex].filePath;	

	// NT backslashes!! make 2->1
	filePath = filePath.replace(/\\{2}/g, "\\");

	var api = "/servlet/Report?action=CSV&jobname=" + portalWnd.oJobPrintFiles.printFiles[rptIndex].name; 
	api += "&file=" + filePath;
	api += "&REPORT_OWNER=" +portalWnd.oJobPrintFiles.userName;
	window.open(api);
	
	} catch(e){reportError(e)}		
}
//-----------------------------------------------------------------------------
function doPrint()
{	
	try{
	
	var selectedFileIndex = portalWnd.oJobPrintFiles.selectedPrintFile;
	var printFile = portalWnd.oJobPrintFiles.printFiles[selectedFileIndex];
	var webUser = portalWnd.oUserProfile.getAttribute("id");
		
	portalWnd.showRptPrint(printFile.name, portalWnd.oJobPrintFiles.jobOwner, 
		printFile.token, printFile.filePath, window, "returnDoPrint()");
		
	} catch(e){reportError(e)}			
}
//-----------------------------------------------------------------------------
function returnDoPrint()
{
	try{
	
	var selectedFileIndex = portalWnd.oJobPrintFiles.selectedPrintFile;
	var printFile = portalWnd.oJobPrintFiles.printFiles[selectedFileIndex];
	
	if (!portalObj.browser.isIE)
	{
		setTitle(printFile);
		buildToolbar();	
	}

	} catch(e){reportError(e)}		
}
//============================================================//
function doPortalDrill(api)
{
	try {

		if (!portalWnd.oUserProfile.isOpenWindow("explorer"))
		{
			portalObj.toolbar.clear();
			var title = "Drill Around" + String.fromCharCode(174);
			portalObj.setTitle(title);
		}

		portalObj.drill.doDrill(window, "returnPortalDrill", portalWnd.IDAPath + "?" + api);

	} catch(e){reportError(e)}
}
//============================================================//
function returnPortalDrill()
{
	try {
		if(!portalWnd.oUserProfile.isOpenWindow("explorer"))
		{
			buildToolbar();
			var rptIndex = portalWnd.oJobPrintFiles.selectedPrintFile;
			var printFile = portalWnd.oJobPrintFiles.printFiles[rptIndex];
			setTitle(printFile);
		}
		
	} catch(e){reportError(e)}
}
//-----------------------------------------------------------------------------
function rw100Drill(PARMS)
{
 	portalWnd.newPortalWindow(PARMS);
}
//-----------------------------------------------------------------------------
function isPDFview(viewFormat)
{
	try{
	
	switch(viewFormat)
	{
		case "pdfView":
		case "PORTRAIT":
		case "LANDSCAPE":
		case "CONDENSED158":
		case "CONDENSED198":
		case "CONDENSED233":
		case "LSR":
			return true;
		default:
			return false;
	}	

	} catch(e){reportError(e)}		
}
//-----------------------------------------------------------------------------
function goJobList()
{	
	try{
	
	var selectedFileIndex = portalWnd.oJobPrintFiles.selectedPrintFile;
	var printFile = portalWnd.oJobPrintFiles.printFiles[selectedFileIndex];
	var userName=parent.oJobPrintFiles.userName;
	var url=portalWnd.getGoJobListURL(userName,printFile.name,portalWnd.jobUtilPageIndex);
	portalWnd.switchContents(url);
	
	} catch(e){reportError(e)}			
}

//-----------------------------------------------------------------------------
function goPrintFiles()
{
	try{
		
	var selectedFileIndex = portalWnd.oJobPrintFiles.selectedPrintFile;
	var printFile = portalWnd.oJobPrintFiles.printFiles[selectedFileIndex];
	var userName=parent.oJobPrintFiles.userName;
	var url=portalWnd.getGoPrintFilesURL(userName,printFile.name,portalWnd.jobUtilPageIndex);
	portalWnd.switchContents(url);

	} catch(e){reportError(e)}		
}
//-----------------------------------------------------------------------------
function handleKeyDown(evt)
{
	try{
	
	var evtCaught = false;
	
	evt = portalWnd.getEventObject(evt);
	if (!evt)
		return false;
	
	// check with portal for hotkey action
	var action = portalWnd.getFrameworkHotkey(evt,"erpReporting");
	if ( !action )
	{
		// framework handled the keystroke
		portalWnd.setEventCancel(evt)
		return false;
	}

	// hotkey defined for this keystroke
	if (action != "erpReporting")
	{
		evtCaught=cntxtActionHandler(evt,action);
		portalWnd.setEventCancel(evt);
		return false;
	}
	
	return evtCaught;

	} catch(e){reportError(e)}		
}
//-----------------------------------------------------------------------------
function cntxtActionHandler(evt,action)
{
	try{
	
	if (action==null)		// called by the portal
	{
		action = portalWnd.getFrameworkHotkey(evt,"erpReporting");
		if (!action || action=="erpReporting")
			return false;
	}

	var bHandled=false;

	switch(action)
	{
		case "doRefresh":
			doViewRpt();
			bHandled=true
			break;	
		case "doCancel":
			doClose();
			bHandled=true
			break;	
		case "posInFirstField":
			document.getElementById("reportFrame").focus();
			bHandled=true;
			break;
	}
	
	return (bHandled);

	} catch(e){reportError(e)}		
}
//-----------------------------------------------------------------------------
function unloadFunc()
{
	try{
		
	portalWnd.clearCallBackPrms();
	if (typeof(portalWnd.formUnload) == "function")
		portalWnd.formUnload();

	parent.oJobPrintFiles = null;
	} catch(e){reportError(e)}	
}
//-----------------------------------------------------------------------------
function reportError(error)
{
	try{
		showReady();
		var strFunction = reportError.caller.toString();
		var i = (strFunction.indexOf("("));
		var funcName = strFunction.substr(0,i);
		funcName = funcName.replace("function ","");
		portalWnd.cmnErrorHandler(error,window,VIEWJOBSJS,"",funcName);
	}catch(e){}
}


