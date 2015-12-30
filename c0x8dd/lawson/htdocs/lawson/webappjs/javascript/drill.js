/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/drill.js,v 1.28.2.9.2.9 2014/02/18 16:42:37 brentd Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@10.00.05.00.12 Mon Mar 31 10:17:31 Central Daylight Time 2014 */
//***************************************************************
//*                                                             *
//*                           NOTICE                            *
//*                                                             *
//*   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
//*   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
//*   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
//*   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
//*   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
//*   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
//*   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
//*                                                             *
//*   (c) COPYRIGHT 2014 INFOR.  ALL RIGHTS RESERVED.           *
//*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//*                                                             *
//***************************************************************

var mainWnd;
var drillWrapper;
var drillObj;

var iSizerCollection;
var table;
var oCover;

var searchBtn;
var backBtn;
var prevBtn;
var nextBtn;
var findNextBtn;

var alphabetTD;
var searchTable;
var styler = null;

var detailTxt;
//-----------------------------------------------------------------------------
function drill_init()
{
	mainWnd = (window.dialogArguments) ? window.dialogArguments[0] : ((opener) ? opener : null);
	if (!mainWnd)
	{
		window.close();
		return;
	}

	drillWrapper = mainWnd.DrillWrapperObject._singleton;
	if (drillWrapper.user.isTimedOut())
	{
		document.location.replace("/sso/SSOServlet?_ssoOrigUrl=" + escape(document.location.href));
		return;
	}

	// theme 8 uses the lds theme for drill
	if ((!mainWnd.sipObj.styler.showLDS) && (!mainWnd.sipObj.styler.showInfor) && (!mainWnd.sipObj.styler.showInfor3)) {
		mainWnd.sipObj.styler.loadCssFile(window, "../../webappjs/lds/css/ldsRSS.css");
	}

	if (mainWnd.sipObj.styler.showInfor3)
		mainWnd.sipObj.styler.replaceCssFileWith(window, "drill.css", "../../webappjs/infor3/css/rss/drill.css");
	
	// Drill Object
	drillObj = new DrillObject(drillWrapper.mainWnd, drillWrapper.user.techVersion, drillWrapper.user.httpRequest);
	drillObj.setParameter("_PDL", drillWrapper.user.prodline);
	drillObj.setParameter("_SYS", drillWrapper.system);
	drillObj.setParameter("_TYP", drillWrapper.drillType);
	drillObj.setParameter("_RECSTOGET", drillWrapper.maxDrillLines);
	drillObj.setEncoding(drillWrapper.user.encoding);
	
	if (drillWrapper.drillType == mainWnd.DrillWrapperObject.TYPE_SELECT)
	{
		drillObj.setParameter("_KNB", mainWnd.DrillWrapperObject.getDetailKey(drillWrapper.primaryKey));
		drillWrapper.addKeysFromScreen(drillObj);
	}
	if (drillWrapper.drillParmsAry)
		for (var i in drillWrapper.drillParmsAry)
			drillObj.setParameter(i, drillWrapper.drillParmsAry[i]);

	// other objects
	oCover = new OpaqueCoverObject();
	oCover.showCover();
	iSizerCollection = new SizerCollectionObject(window);
	table = new TableBuilderObject(document.getElementById("drillTable"));
	table.protectRow(table.table.rows[0]);

	// buttons
	searchBtn = document.getElementById("searchBtn");
	backBtn = document.getElementById("backBtn");
	nextBtn = document.getElementById("nextBtn");
	prevBtn = document.getElementById("prevBtn");
	findNextBtn = document.getElementById("findNextBtn");
	alphabetTD = document.getElementById("alpahbetTD");
	searchTable = document.getElementById("searchTable");

	var alphabetBtns = document.getElementsByTagName("Button");
	for (var i=0; i<alphabetBtns.length; i++)
	{
		if (alphabetBtns[i].className == "alphabetBtn")
		{
			alphabetBtns[i].style.padding = "0px";
			if (!drillObj.isBrowserIE())
				alphabetBtns[i].style.margin = "-2px";
			else
				alphabetBtns[i].style.margin = "0px";
		}
	}

	// translations
	translate("prevBtn", "Previous");
	translate("nextBtn", "Next");
	translate("findNextBtn", "FindNext");
	translate("backBtn", "Back");
	translate("searchBtn", "Search");
	translate("findValue", "FindValue");
	translate("closeBtn", "Close");
	translate("srchFieldLbl", "SearchField");
	translate("srchTypeLbl", "SearchMethod");
	translate("srchValueLbl", "SearchValue");

	detailTxt = drillWrapper.user.getPhrase("Detail");
		
	// sizer objects -- idStr, parentSizerObject, maxWidth, maxHeight
	var buttonBarDivSizer = new SizerObject("buttonBarDiv", null, "100%");
	buttonBarDivSizer.doHeight = false;
	iSizerCollection.addSizer(buttonBarDivSizer);

	var buttonBarTableSizer = new SizerObject("buttonBarTable", buttonBarDivSizer, "100%");
	buttonBarTableSizer.widthOffset = 2;
	buttonBarTableSizer.doHeight = false;
	iSizerCollection.addSizer(buttonBarTableSizer);

 	var itemBodySizer = new SizerObject("itemBodyDiv", null, "100%", "100%");
 	if (mainWnd.sipObj.styler.showLDS || mainWnd.sipObj.styler.showInfor)
	{
		itemBodySizer.widthOffset = 20;
		itemBodySizer.heightOffset = 64;      
	}
	else
	{	
		itemBodySizer.widthOffset = 10;
		itemBodySizer.heightOffset = 60;
	}
	iSizerCollection.addSizer(itemBodySizer);

 	var drillTableSizer = new SizerObject("drillTable", itemBodySizer, "100%", "100%");
	drillTableSizer.doHeight = false;
	drillTableSizer.widthOffset = 30;
	iSizerCollection.addSizer(drillTableSizer);

	var searchDivSizer = new SizerObject("searchDiv", null, "100%", "100%");
	iSizerCollection.addSizer(searchDivSizer);

	document.body.style.visibility="visible"
	document.body.focus();

	// call drill
	drillObj.funcAfterCall = paintScreen;
	if (drillObj.callDrill() == null)
		closeMe();
}

//-----------------------------------------------------------------------------
function styleDrill()
{
	if (styler == null) {
		styler = new StylerRSS();
		if (mainWnd.sipObj.styler.showLDS) {
			styler.showLDS = true;
			styler.showInfor = false;
			styler.showInfor3 = false;
			styler.loadCssFile(window, "../../webappjs/lds/css/ldsRSS.css");
		}
		else
		if (mainWnd.sipObj.styler.showInfor) {
			styler.showInfor = true;
			styler.showLDS = false;
			styler.showInfor3 = false;
			styler.loadCssFile(window, "../../webappjs/infor/css/inforRSS.css");
			var txtDir = mainWnd.sipObj.styler.getTextDir();
			styler.setTextDir(txtDir) // set the drills styler to match the main app.
			if (txtDir == "rtl") {
				styler.loadCssFile(window, "../../webappjs/infor/css/inforRSS_RTL.css");
			}
		}
		else
		if (mainWnd.sipObj.styler.showInfor3) {
			styler.showInfor3 = true;
			styler.showInfor = false;
			styler.showLDS = false;
			styler.loadCssFile(window, "../../webappjs/infor3/css/inforRSS.css");
			var txtDir = mainWnd.sipObj.styler.getTextDir();
			styler.setTextDir(txtDir) // set the drills styler to match the main app.
			if (txtDir == "rtl") {
				styler.loadCssFile(window, "../../webappjs/infor3/css/inforRSS_RTL.css");
			}
		}
	}	
	styler.selectStyleSheet(window);
	setTimeout("document.body.style.visibility='visible'", 2000);
}

//-----------------------------------------------------------------------------
function drill_resize()
{
	if (iSizerCollection)
		iSizerCollection.sizeAll();
}

//-----------------------------------------------------------------------------
function drill_keydown(evt)
{
	evt = getEventObject(evt);
	if (!evt)
		return;

	var evtCaught = false;
	switch (evt.keyCode)
	{
		// backspace
		case 8:
				var evtElm = getEventElement(evt);
			if (evtElm)
				{
				if (evtElm.id != "srchValue")
			{
				evtCaught = true;
				goBack();
			}
			}
			break;
		// 13 - enter
		// 123 - F12
		case 13:
		case 123:
			var evtElm = getEventElement(evt);
			if (evtElm)
			{
				if (evtElm.id == "srchValue" && evtElm.value != "")
				{
				if (searchBtn)
				{
					searchBtn.click();
					evtCaught = true;
				}
			}
			}
			break;
		// escape key
		case 27:
			evtCaught = true;
				closeMe();
			break;
		// ctrl-shift-n - next
		case 78:
			if (evt.ctrlKey && evt.shiftKey)
			{
				var nextBtn = document.getElementById("nextBtn");
				if (nextBtn && !nextBtn.disabled && nextBtn.onclick)
				{
					nextBtn.click()
					evtCaught = true;
				}
			}
			break;
		// ctrl-shift-p - previous
		case 80:
			if (evt.ctrlKey && evt.shiftKey)
			{
				var prevBtn = document.getElementById("prevBtn");
				if (prevBtn && !prevBtn.disabled && prevBtn.onclick)
				{
					prevBtn.click()
					evtCaught = true;
				}
			}
			break;
	}

	if (evtCaught)
	{
		evt.returnValue = false;
		setEventCancel(evt);
		cancelEventBubble(evt);
	}
}

//-----------------------------------------------------------------------------
function drill_unload()
{	
	try
	{
		if (drillWrapper.user.isTimedOut())
			return;
		else
			drillWrapper.closeDrillWindow();
	}
	catch (e)
	{}
}

//-----------------------------------------------------------------------------
function paintScreen()
{
	table.deleteAllRows();
	
	backBtn = document.getElementById("backBtn");
	prevBtn = document.getElementById("prevBtn");
	nextBtn = document.getElementById("nextBtn");
	findNextBtn = document.getElementById("findNextBtn");
	
	backBtn.disabled = (drillObj.getBackCall()) ? false : true;
	prevBtn.disabled = true;
	nextBtn.disabled = true;
	findNextBtn.disabled = true;
	searchTable.style.display = "none";

	// paint title
	var titleSpan = document.getElementById("titleSpan");
	cmnRemoveChildNodes(titleSpan);
	if (drillObj.techVersion == DrillObject.TECHNOLOGY_803)
	{
		// check for older ida error
		var errMsgNodes = drillObj.dom.getElementsByTagName("ERRMSG");
		if (errMsgNodes.length > 0)
		{
			titleSpan.appendChild(document.createTextNode(cmnGetNodeCDataValue(errMsgNodes[0])));
			oCover.hideCover();
			drill_resize();
			return;
		}
	}

	titleSpan.appendChild(document.createTextNode(drillObj.getTitle()));
	table.table.setAttribute("summary", drillObj.getTitle());

	// configure table - set up protected and model row
	var pRow = document.getElementById("pRow");
	var mRow = table.table.insertRow(1);
	table.table.rows[1].setAttribute("aria-hidden", "true");
	cmnRemoveChildNodes(pRow);
	var nbrColumns = drillObj.getNbrColumns();
	if (nbrColumns > 0)
	{
		table.table.setAttribute("styler", "list");
		table.table.className = "dataTable";
		iSizerCollection.getSizer("drillTable").maxWidth = 100;
		
		var thLeft = document.createElement('th');
		thLeft.className = "columnheadleft";
		thLeft.innerHTML = "&nbsp;";
		pRow.appendChild(thLeft);
		
		var mCell = mRow.insertCell(0);
		mCell.className = "leftCol";
		for (var i=0; i<nbrColumns; i++)
		{
			mCell = mRow.insertCell(i+1);
			mCell.scope = "row";
			var th = document.createElement('th');
			th.className = "columnhead";
			th.scope = "col";
			th.innerHTML = drillObj.getColumn(i).getColumnValue();
			pRow.appendChild(th);
		}
		var thRight = document.createElement('th');
		thRight.className = "columnheadright";
		thRight.innerHTML = "&nbsp;";
		pRow.appendChild(thRight);

		mCell = mRow.insertCell(nbrColumns+1);
		mCell.className = "rightCol";
	}
	else
	{
		table.table.removeAttribute("styler");
		table.table.className = "listTable";
		iSizerCollection.getSizer("drillTable").maxWidth = 70;
		var mCell = mRow.insertCell(0);
		mCell = mRow.insertCell(1);
		mCell = mRow.insertCell(2);
	}
	table.setModelRow(mRow);

	// check for zero records
	var nbrLines = drillObj.getNbrLines();
	if (nbrLines == 0)
	{
		table.createNoRecordsRow(drillWrapper.user.getPhrase("NoRecordsMeetingCriteria"));
		// Show search even no records were found on prior search
		searchTable.style.display = "";
		oCover.hideCover();
		drill_resize();
		if ((mainWnd.sipObj.styler) && (mainWnd.sipObj.styler.showLDS || mainWnd.sipObj.styler.showInfor || mainWnd.sipObj.styler.showInfor3))
			styleDrill();		
		return;
	}

	// paint table
	for (var idxLine=0; idxLine<nbrLines; idxLine++)
	{
		var line = drillObj.getLine(idxLine);
		var idaCall = line.getIdaCall();
		var nbrCols = line.getColCount();
		var cellContentAry = new Array();
		cellContentAry[0] = "";

		for (var idxCol=0; idxCol<nbrCols; idxCol++)
		{
			// in 9.0 tech, there seems to always be an ida call node
			if (idaCall || line.getKeyFldCount() > 0)
			{
				var colHeader = "";
				if (drillObj.getColumn(idxCol) != null)
					colHeader = drillObj.getColumn(idxCol).getColumnValue();
				cellContentAry[idxCol+1] = "<a styler='hyperlink' href='javascript:;'"
										 + " onclick='lineClick(" + idxLine + ")'"
										 + " aria-label='" + colHeader  + "'"
										 + " title='" + delTrailingSpaces(line.getColValue(idxCol)) + "'>"
										 + line.getColValue(idxCol) + "</a>";
			}
			else
			{
				cellContentAry[idxCol+1] = line.getColValue(idxCol);
			}
			cellContentAry[idxCol+1].scope = "row";
		}

		// drill around button?
		if ((!mainWnd.sipObj.styler.showInfor) && (!mainWnd.sipObj.styler.showInfor3)){
			cellContentAry[nbrCols + 1] = (line.getKeyFldCount() > 0 && idaCall) ? "<button class='drillAround' onclick='drillAroundClick(" + idxLine + ")'/>" : "";
		}
		else {
			cellContentAry[nbrCols + 1] = (line.getKeyFldCount() > 0 && idaCall) ? "<button class='drillAroundInfor' onclick='drillAroundClick(" + idxLine + ")'"
			+ "onmouseover='this.oldClass=this.className; this.className=\"drillAroundOverInfor\"'"
			+ "onmousedown='this.className=\"drillAroundPressInfor\"'"
			+ "onmouseout='this.className=\"drillAroundInfor\"'"
			+ " title='" + detailTxt + "'/>" : "";
		}

		table.createRow(cellContentAry, "" , "row_" + idxLine);
	}

	// enable/disable buttons
	searchTable.style.display = (drillObj.getNbrFindFields() > 0) ? "" : "none";
	prevBtn.disabled = (drillObj.getPrevCall()) ? false : true;
	nextBtn.disabled = (drillObj.getNextCall()) ? false : true;
	findNextBtn.disabled = (drillObj.getFindNextCall()) ? false : true;

	// This is only used for vendor (keyNbr 031) searching
	if ((drillObj.getNbrFindFields() > 0) && (mainWnd.DrillWrapperObject.getDetailKey(drillWrapper.primaryKey) == "031"))
		alphabetTD.style.display = "";
	else
		alphabetTD.style.display = "none";

	var srchValueObj = document.getElementById("srchValue");
	if (!srchValueObj)
	{
		if (drillObj.getNbrFindFields() > 0)
		buildSearch();
	}
	else
	{
		if (drillObj.getNbrFindFields() > 0 && srchValueObj.value == "")
			buildSearch();
	}
		
	oCover.hideCover();
	drill_resize();
	
	if ((styler != null) && (mainWnd.sipObj.styler.showLDS || mainWnd.sipObj.styler.showInfor || mainWnd.sipObj.styler.showInfor3))
	{
		styler.processButtonElement(window, prevBtn); 		// restyle the button
		styler.processButtonElement(window, nextBtn); 		// restyle the button
		styler.processButtonElement(window, findNextBtn); 	// restyle the button
	}

	if ((mainWnd.sipObj.styler) && (mainWnd.sipObj.styler.showLDS || mainWnd.sipObj.styler.showInfor || mainWnd.sipObj.styler.showInfor3))
		styleDrill();
	window.resizeBy(1,1); // JT-288587
}

//-----------------------------------------------------------------------------
function paintAttachScreen()
{
	table.deleteAllRows();
	
	backBtn = document.getElementById("backBtn");
	prevBtn = document.getElementById("prevBtn");
	nextBtn = document.getElementById("nextBtn");
	findNextBtn = document.getElementById("findNextBtn");
	
	backBtn.disabled = (drillObj.getBackCall()) ? false : true;
	prevBtn.disabled = true;
	nextBtn.disabled = true;
	// reset for subsequent calls
	drillObj.funcAfterCall = paintScreen;

	// paint title
	var titleSpan = document.getElementById("titleSpan");
	cmnRemoveChildNodes(titleSpan);

	// check for error
	var errMsgNodes = drillObj.dom.getElementsByTagName("ErrMsg");
	if (errMsgNodes.length > 0)
		var errNbr = errMsgNodes[0].getAttribute("ErrNbr");
	if (errNbr != 0 && errNbr != 14)
	{
		titleSpan.appendChild(document.createTextNode("Error from " + DrillObject.ATTACHMENT_URL));
		titleSpan.appendChild(document.createElement("P"));
		titleSpan.appendChild(document.createTextNode("error number " + errNbr + " - " + cmnGetNodeCDataValue(errMsgNodes[0])));
		oCover.hideCover();
		drill_resize();
		return;
	}

	var attachTitle = drillObj.getAttachTitle();
	if (attachTitle.indexOf("NULL") == -1 )
		titleSpan.appendChild(document.createTextNode(drillObj.getAttachTitle()));

	// configure table - set up protected and model row
	var pRow = document.getElementById("pRow");
	var mRow = table.table.insertRow(1);
	cmnRemoveChildNodes(pRow);
		table.table.className = "listTable";
		iSizerCollection.getSizer("drillTable").maxWidth = 70;
		var mCell = mRow.insertCell(0);
		mCell = mRow.insertCell(1);
		mCell = mRow.insertCell(2);
	table.setModelRow(mRow);

	// check for zero records
	var nbrRecAttNodes = drillObj.getRecAttCount();
	if (nbrRecAttNodes == 0)
	{
		table.createNoRecordsRow(drillWrapper.user.getPhrase("NoRecordsMeetingCriteria"));
		oCover.hideCover();
		drill_resize();
		return;
	}

	// paint table
	for (var idx = 0; idx < nbrRecAttNodes; idx++)
	{
		var cellContentAry = new Array();
		cellContentAry[0] = "";

		// if there is a crtDate(create date), then we will show link(s) to the comment(s)/URL(),
		// otherwise show the comment text.
		if (drillObj.getRecAttCdataValue(idx,"CrtDate"))
		{
			cellContentAry[1] = "<a styler='hyperlink' href='javascript:;'"
							  + " onclick='attachClick(" + idx + ")'>"
							  + drillObj.getRecAttCdataValue(idx,"AttName")
							  + "</a>";
		}
		else
		{
			titleSpan.appendChild(document.createTextNode(drillObj.getRecAttCdataValue(idx,"AttName")));
			if (drillObj.getAttachQuery(idx).indexOf("_ATYP=U") != -1)
				cellContentAry[1] = "<a styler='hyperlink' href='javascript:;'"
							  + " onclick='urlClick(" + idx + ")'>"
							  + unescape(drillObj.getRecAttCdataValue(idx,"AttData"))
							  + "</a>";
			else
			{
				var attachValue = escape(drillObj.getRecAttCdataValue(idx,"AttData"));
				attachValue = (attachValue.split("%0D").join("")).split("%0A").join("</br>");
				cellContentAry[1] = unescape(attachValue);
			}
		}

		cellContentAry[2] = "";

		table.createRow(cellContentAry, "" , "row_" + idx);
	}

	// enable/disable buttons
	prevBtn.disabled = (drillObj.getPrevCall()) ? false : true;
	nextBtn.disabled = (drillObj.getNextCall()) ? false : true;
	oCover.hideCover();
	drill_resize();
	
	if ((styler != null) && (mainWnd.sipObj.styler.showLDS || mainWnd.sipObj.styler.showInfor || mainWnd.sipObj.styler.showInfor3))
	{
		styler.processButtonElement(window, prevBtn); 		// restyle the button
		styler.processButtonElement(window, nextBtn); 		// restyle the button
		styler.processButtonElement(window, findNextBtn); 	// restyle the button
}

	if ((mainWnd.sipObj.styler) && (mainWnd.sipObj.styler.showLDS || mainWnd.sipObj.styler.showInfor  || mainWnd.sipObj.styler.showInfor3))
		styleDrill();
}

//-----------------------------------------------------------------------------
function lineClick(idxLine)
{
	if (!oCover.isCoverVisible())
	{
		oCover.showCover();
		setTimeout("lineClick(" + idxLine + ")", 1);
		return;
	}

	var line = drillObj.getLine(idxLine);
	var nbrKeyFlds = line.getKeyFldCount();
	if (nbrKeyFlds > 0)
	{
		var selAry = new Array();
		for (var i=0; i<nbrKeyFlds; i++)
		{
			var keyNbr = line.getKeyFldAttribute(i, "keynbr");
			selAry[keyNbr] = delTrailingSpaces(line.getKeyFldValue(i));
			if (keyNbr == '24A'){
				selAry['24M'] = delTrailingSpaces(line.getColValue(1)); 
			}
		}
		drillWrapper.finishSelect(selAry);
		return;
	}

	drillObj.callDrill(line.getIdaCall());
	return;
}

//-----------------------------------------------------------------------------
function attachClick(idxAtt)
{
	if (!oCover.isCoverVisible())
	{
		oCover.showCover();
		setTimeout("attachClick(" + idxAtt + ")", 1);
		return;
	}

	drillObj.callDrill(DrillObject.ATTACHMENT_URL + drillObj.getAttachQuery(idxAtt));
	return;
}

//-----------------------------------------------------------------------------
function urlClick(idxAtt)
{
	if (!oCover.isCoverVisible())
	{
		oCover.showCover();
		setTimeout("urlClick(" + idxAtt + ")", 1);
		return;
	}

	var url = drillObj.getRecAttCdataValue(idxAtt,"AttData");
	window.open(url, "UrlWnd","resizable=yes")
	oCover.hideCover();
	return;
}

//-----------------------------------------------------------------------------
function drillAroundClick(lineIdx)
{
	if (!oCover.isCoverVisible())
	{
		oCover.showCover();
		setTimeout("drillAroundClick(" + lineIdx + ")", 1);
		return;
	}

	var line = drillObj.getLine(lineIdx);
	drillObj.callDrill(line.getIdaCall());
}

//-----------------------------------------------------------------------------
function translate(objId, phraseStr)
{
	var obj = document.getElementById(objId);
	if (!obj)
		return;
	obj.appendChild(document.createTextNode(drillWrapper.user.getPhrase(phraseStr)));
}

//-----------------------------------------------------------------------------
function closeMe()
{
	drillWrapper.closeDrillWindow();
}

//-----------------------------------------------------------------------------
function buildSearch()
{
	var nbrFindFlds = drillObj.getNbrFindFields();
	var srchFieldHTML = "";
	var srchFieldTD = document.getElementById("srchFieldTD");

	srchFieldHTML = "<select onchange='setSearchType(this.value)' id='srchField' style='margin-right:2px;'>";
	
	for (var i=0; i<nbrFindFlds; i++)
	{
		var findFld = drillObj.getFindField(i);
		var oText = findFld.getFindFldValue();
		srchFieldHTML += "<option value=\"" + i + "\">" + oText + "</option>";
	}

	srchFieldHTML += "</select>";
	srchFieldTD.innerHTML = srchFieldHTML;
	setSearchType(0);
}

//-----------------------------------------------------------------------------
function setSearchType(srchFldIdx)
{
	var srchTypeHTML = "<select id='srchType' style='margin-right:2px;'>";
	var srchTypeTD = document.getElementById("srchTypeTD");

	// less than/greater than/equal to select box
	var numericSrchType =  "<option value='<'><</option>"
					  	+  "<option value='<='><=</option>"
					  	+  "<option value='='>=</option>"
					  	+  "<option value='>='>>=</option>"
					  	+  "<option value='>'>></option>";

	var alphaSrchType = "<option value='1'>" + drillWrapper.user.getPhrase("Equals") + "</option>"
					  + "<option value='2'>" + drillWrapper.user.getPhrase("BeginsWith") + "</option>"
					  + "<option value='3'>" + drillWrapper.user.getPhrase("EndsWith") + "</option>"
					  + "<option value='4'>" + drillWrapper.user.getPhrase("Contains") + "</option>";


	var findFld = drillObj.getFindField(parseInt(srchFldIdx));
	var fldType = findFld.getFindFldAttribute("type"); 
	if (fldType == "NUMERIC")
		srchTypeHTML += numericSrchType;
	else
		srchTypeHTML += alphaSrchType;
	
	srchTypeHTML += "</select>";
	srchTypeTD.innerHTML = srchTypeHTML;

	// Check for a select box with a finite list of value options
	var srchValueTD = document.getElementById("srchValueTD");
	var nbrValNodes = findFld.getValCount();
	if (nbrValNodes != 0)
	{
		var srchValueHTML = "";
		srchValueHTML = "<select id='srchValue' style='margin-right:2px;'>";
		
		for (var i=0; i<nbrValNodes; i++)
		{
			var oText = findFld.getValValue(i);
			var oValue = findFld.getValAttribute(i, "value");
			srchValueHTML += "<option value=\"" + oValue + "\">" + oText + "</option>";
}

		srchValueHTML += "</select>";
		srchValueTD.innerHTML = srchValueHTML;
	}
	else
	{
		var fldMaxLen = parseInt(findFld.getFindFldAttribute("size"), 10);
		var srchValueHTML = "";		
		srchValueHTML = "<input type='text' id='srchValue' class='inputbox' size='30' maxlength='" + fldMaxLen + "'";
		if (fldType == "NUMERIC")
			srchValueHTML += " onkeypress='return isNumeric(event)'";
		
		srchValueHTML += "/>";
		srchValueTD.innerHTML = srchValueHTML;
	}
}

//-----------------------------------------------------------------------------
function goAlphabetVendorSearch(srchValue)
{
	if (!oCover.isCoverVisible())
	{
		oCover.showCover();
		setTimeout("goAlphabetVendorSearch('" + srchValue + "')", 1);
		return;
	}

	var searchQuery = drillObj.getReloadCall();
	
	// strip the SK1 or SK
	var skPos;
	if (drillObj.techVersion == DrillObject.TECHNOLOGY_803)
	{
		skPos = searchQuery.indexOf("&SK1");
		if (skPos >= 0)
			searchQuery = searchQuery.substring(0, skPos);
	}
	else
	{
		var params = searchQuery.split("&");
		searchQuery = "";
		for (var i=0; i<params.length; i++)
		{
			skPos = params[i].indexOf("_SK");
			if (skPos != 0) // skip the _SK param.
			{
				if (i == 0)
					searchQuery += params[i];
				else
					searchQuery += "&" + params[i];
			}
		}
	}

	var beforeSearchOperand = (drillObj.techVersion == DrillObject.TECHNOLOGY_803) ? "=" : "^~";
	var afterSearchOperand = "*";
	var searchType = "1"; // for the FL field.  0 = find, 1 = filter;
	
	if ((drillWrapper.selectSearchBehaviorFlds != null) 
	&& (typeof(drillWrapper.selectSearchBehaviorFlds["031"])!= "undefined"))
	{
	var searchBehaviorObj = drillWrapper.selectSearchBehaviorFlds["031"];
		searchType = (searchBehaviorObj.searchType == "find") ? "0" : "1"; // for the FL field.  0 = find, 1 = filter;
	}
	
	var searchFldObj = drillObj.getFindField(0);
	var searchStr1 = "&_FL=" + searchType + "&_FF=";
	var idx = searchQuery.indexOf(searchStr1);
	var srchName = "";

	// In 803 Tech - if no records are found, the columns are not returned
	// we then need to get the field to search from the prior call.
	if (searchFldObj != null)
		srchName = searchFldObj.getFindFldAttribute("name");
	else
	{
		var queryName = searchQuery.substring(idx+searchStr1.length, searchQuery.length); // grab the search name( the value after _FF=)
		var srchIdx = queryName.indexOf("=");
		if (srchIdx != -1)
			srchName = queryName.substring(0,srchIdx);
	}
	
	if (drillObj.techVersion == DrillObject.TECHNOLOGY_803)
		srchName = replaceString(srchName, "*", "");
	var searchStr2 = srchName + beforeSearchOperand + srchValue + afterSearchOperand;
	if (!drillObj.isPost)
		searchStr2 = escape(searchStr2);

	// remove previous search if there was one
	if (idx != -1)
		searchQuery = searchQuery.substring(0, idx);

	searchQuery += searchStr1 + searchStr2;

	// call with the search
	drillObj.callDrill(searchQuery);
	
}
//-----------------------------------------------------------------------------
function goSearch(findFldIdx)
{
	if (!findFldIdx)
		findFldIdx = parseInt(document.getElementById("srchField").value);
	
	if (!oCover.isCoverVisible())
	{
		oCover.showCover();
		setTimeout("goSearch(" + findFldIdx + ")", 1);
		return;
	}

	var findFld = drillObj.getFindField(findFldIdx);
	var searchQuery = drillObj.getReloadCall();

	// strip the SK1 or SK
	var skPos;
	if (drillObj.techVersion == DrillObject.TECHNOLOGY_803)
	{
		skPos = searchQuery.indexOf("&SK1");
		if (skPos >= 0)
			searchQuery = searchQuery.substring(0, skPos);
	}
	else
	{
		var params = searchQuery.split("&");
		searchQuery = "";
		for (var i=0; i<params.length; i++)
		{
			skPos = params[i].indexOf("_SK");
			if (skPos != 0) // skip the _SK param.
			{
				if (i == 0)
					searchQuery += params[i];
				else
					searchQuery += "&" + params[i];
			}
		}
	}

	/* 	
		9.0.0 Tech - /servlet/Router/Drill/Erp - field search syntax
	 	^ ignore case
		~ like
	 	! not
	 	= equal
	-------------------------------------------------------------------
		8.0.3 Tech - /servlet/ida - field search syntax
	 	= equal (this seems to work with * for wildcards)
	*/

	var beforeSearchOperand = "";
	var afterSearchOperand = "";
	var searchType = "1"; // for the FL field.  0 = find, 1 = filter;  
	var searchValue = "";
	var searchTypeBox = document.getElementById("srchType");
	
	if (findFld.getValCount() == 0)
	{
		var searchField = document.getElementById("srchValue");
		searchValue = escape(searchField.value);
		var searchFieldType = findFld.getFindFldAttribute("type");
		beforeSearchOperand = (drillObj.techVersion == DrillObject.TECHNOLOGY_803) ? "" : "^~";
		afterSearchOperand = "";
	
		if (searchFieldType == "NUMERIC")
			beforeSearchOperand = searchTypeBox.options[searchTypeBox.selectedIndex].value;
		else
		if (drillObj.techVersion == DrillObject.TECHNOLOGY_803)
		{
			switch (searchTypeBox.options[searchTypeBox.selectedIndex].value)
			{
				// 803 Technology
				// 1  	Equals (fastest)
				// 2	Begins with (fast)
				// 3	Ends with (slow)
				// 4	Contains (slowest)
				
				case "1":
					beforeSearchOperand = "=";
					afterSearchOperand = "";
					break;
				case "2":
					beforeSearchOperand = "=";
					afterSearchOperand = "*";
					break;
				case "3":
					beforeSearchOperand = "=*";
					afterSearchOperand = "";
					break;
				case "4":
					beforeSearchOperand = "=*";
					afterSearchOperand = "*";
					break;
				default:
					beforeSearchOperand = "=";
					afterSearchOperand = "*";
					break;						
					}
		}
					else
					{
			switch (searchTypeBox.options[searchTypeBox.selectedIndex].value)
			{
				// 90 Technology
				// 1  	Equals (fastest)
				// 2	Begins with (fast)
				// 3	Ends with (slow)
				// 4	Contains (slowest)
				
				case "1":
					beforeSearchOperand = "^=";
						afterSearchOperand = "";								
					break;
				case "2":
					beforeSearchOperand = "^~";
					afterSearchOperand = "*";
					break;
				case "3":
					beforeSearchOperand = "^~*";
					afterSearchOperand = "";
					break;
				case "4":
					beforeSearchOperand = "^~";
					afterSearchOperand = "";
					break;						
				default:
					beforeSearchOperand = "^~";
					afterSearchOperand = "*";								
					break;
			}
		}
	}
	else
	{
		var valsSearchList = document.getElementById("srchValue");
		searchValue = valsSearchList.options[valsSearchList.selectedIndex].value;
		beforeSearchOperand = "=";
		afterSearchOperand = "";
	}

	if (searchFieldType != "NUMERIC")
	{
		if ((drillWrapper.selectSearchBehaviorFlds != null) 
		&& (typeof(drillWrapper.selectSearchBehaviorFlds[findFld.drillObj.paramsAry._KNB])!= "undefined"))
		{
			var searchBehaviorObj = drillWrapper.selectSearchBehaviorFlds[findFld.drillObj.paramsAry._KNB];
			if(searchBehaviorObj.searchType == "find")
				searchType = "0"; // do a find
			}
				}
	
	var searchStr1 = "&_FL=" + searchType + "&_FF=";
	var name = findFld.getFindFldAttribute("name");
	if (drillObj.techVersion == DrillObject.TECHNOLOGY_803)
		name = replaceString(name, "*", "");
	var searchStr2 = name + beforeSearchOperand + searchValue + afterSearchOperand;
	if (!drillObj.isPost)
		searchStr2 = escape(searchStr2);

	// remove previous search if there was one
	var idx = searchQuery.indexOf(searchStr1);
	if (idx != -1)
		searchQuery = searchQuery.substring(0, idx);

	searchQuery += searchStr1 + searchStr2;

	// call with the search
	drillObj.callDrill(searchQuery);
}

//-----------------------------------------------------------------------------
function goBack()
{
	if (!oCover.isCoverVisible())
	{
		oCover.showCover();
		setTimeout("goBack()", 1);
		return;
	}

	var srchValueObj = document.getElementById("srchValue");
	if (srchValueObj)
		srchValueObj.value = "";
			
	drillObj.callBack();
}

//-----------------------------------------------------------------------------
function goPrev()
{
	if (!oCover.isCoverVisible())
	{
		oCover.showCover();
		setTimeout("goPrev()", 1);
		return;
	}
	drillObj.callPrev();
}

//-----------------------------------------------------------------------------
function goNext()
{
	if (!oCover.isCoverVisible())
	{
		oCover.showCover();
		setTimeout("goNext()", 1);
		return;
	}
	drillObj.callNext();
}
//-----------------------------------------------------------------------------
function goFindNext()
{
	if (!oCover.isCoverVisible())
	{
		oCover.showCover();
		setTimeout("goFindNext()", 1);
		return;
	}
	drillObj.callFindNext();
}
//-----------------------------------------------------------------------------
function isNumeric(evt)
{
	var numcheck = /\d/;	
	var e = window.event || evt;
	var keynum = e.keyCode || e.which;
	
	keychar = String.fromCharCode(keynum);
		
	// Key codes: 46 = delete; 8 = backspace; 37-40: arrow keys.
	// Make sure that the charCode is '0' while doing this check as there are characters, such as '%&( that have the same key code.
	var isValidAction = (e.charCode == 0 && ((keynum == 46) || (keynum == 8) || (keynum > 36 && keynum < 41)));
	if (!numcheck.test(keychar))
	{
		if (!isValidAction)
			return false;
	}
	return true;
}