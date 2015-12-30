/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/reports/jobdef.js,v 1.38.2.37.4.21.6.1.2.8 2012/08/08 12:37:19 jomeli Exp $ */
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

var JOBDEFJS = "reports/jobdef.js";		// filename constant for error handler
var portalWnd = null;
var portalObj = null;
var gDefPdl=null;
var gJobStep = null;
var oJobDefDS = null;
var gLastControl = null;
var pdlAry = new Array();
var nSteps = 0;
var gHK = "";
var oDropDown=null;
var oFeedBack = null;
var glinkTextAry = new Array();
var glinkTknAry = new Array()

function initJobDef()
{
	try {
		portalWnd = envFindObjectWindow("lawsonPortal");
		if (!portalWnd) return;

		// load the script versions
		envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

		portalObj = portalWnd.lawsonPortal;

		if (portalWnd.oPortalConfig.getRoleOptionValue("allow_jobdef","0")!= "1")
		{
			var msg = portalObj.getPhrase("NO_ACCESS_TO_JOBDEF");
		 	portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		 	portalWnd.goHome();
		 	return;
		}

		//if(!portalWnd.rptPhrases) IE9 doesn't like this. Must recreate phrases object
			portalWnd.rptPhrases = new portalWnd.phraseObj("reports");
		
		
		//if (!portalWnd.erpPhrases) IE9 doesn't like this. Must recreate phrases object
			portalWnd.erpPhrases=new portalWnd.phraseObj("forms")

		portalObj.keyMgr.addHotkeySet("forms","forms",portalWnd.erpPhrases);

		oFeedBack = new FeedBack(window, portalWnd);
		showBusy();
		gDefPdl = portalWnd.oUserProfile.getAttribute("productline")
		getProductLines();
		buildRelatedForms()
		buildPortalObjects();
		translateLabels();
		loadBlankForm();
		setInitialParameters();
		document.body.style.display = "block";

		if(oJobDefDS.getElementValue("_f2") != "")
			doFunction("I");

		posInFirstField();
		showReady();

	} catch(e){reportError(e)}	
}
//============================================================//
function buildPortalObjects()
{
	try{

	portalObj.setTitle(portalObj.getPhrase("LBL_JOB_DEFINITION"));
	buildToolbar();
	
	} catch(e){reportError(e)}		
}
//============================================================//
function buildToolbar()
{
	try{
	
	with (portalObj.toolbar)
	{
		target = window;
		clear();
		var btnText=portalWnd.rptPhrases.getPhrase("lblSubmit");
		createButton(btnText,doSubmit,"submit");
		btnText=portalWnd.rptPhrases.getPhrase("lblAdd");
		createButton(btnText,"doFunction('A')","add",null,null,"add");
		btnText=portalWnd.rptPhrases.getPhrase("lblChange");
		createButton(btnText,"doFunction('C')","chg",null,null,"chg");
		btnText=portalWnd.rptPhrases.getPhrase("lblDelete");
		createButton(btnText,"doFunction('D')","del",null,null,"del");
		btnText=portalWnd.rptPhrases.getPhrase("lblInquire");
		createButton(btnText,"doFunction('I')","inq",null,null,"inq");
		btnText=portalWnd.rptPhrases.getPhrase("lblAddStep");
		createButton(btnText,"doAddStep()");
		
		//related forms drop button
		if(glinkTextAry.length > 0)
		{
			var text=portalObj.getPhrase("LBL_RELATED_FORMS");
			var title=portalWnd.erpPhrases.getPhrase("lblShowFormTransfers");//trouble
			portalObj.toolbar.addDropdownButtonRight("links",text,title,showRelatedForms,
				title,showRelatedForms);
		}		
	}
		
	} catch(e){reportError(e)}	
}
//============================================================//
function buildRelatedForms()
{
	try{
	
	if(portalWnd.oPortalConfig.getRoleOptionValue("allow_joblist","0")== "1")
	{
		glinkTextAry.push(portalObj.getPhrase("LBL_JOBS_REPORTS"));
		glinkTknAry.push("JOBLIST");
	}
	
	if(portalWnd.oPortalConfig.getRoleOptionValue("allow_jobschedule","0")== "1")
	{
		glinkTextAry.push(portalObj.getPhrase("LBL_JOBS_SCHEDULE"));
		glinkTknAry.push("UNJS.2");
	}

	if(portalWnd.oPortalConfig.getRoleOptionValue("allow_printfiles","0")== "1")
	{
		glinkTextAry.push(portalObj.getPhrase("LBL_PRINT_MANAGER"));
		glinkTknAry.push("UNPM.1")
	}

	} catch(e){reportError(e)}	
}	
//============================================================//
function showRelatedForms()
{
	try{
	
	var actionBtn=portalWnd.document.getElementById("LAWTBBUTTONlinks");
	var dropBtn=portalWnd.document.getElementById("LAWDROPBUTTONlinks")
	actionBtn.className="";
	dropBtn.className="";
	portalWnd.iWindow.dropObj.clearItems();
	
	var loop = glinkTextAry.length;

	for (var i = 0; i < loop; i++)
	{
		var menuText = glinkTextAry[i];
		var menuClick = portalWnd.iWindow.dropObj.trackMenuClick;
		var menuHref = "frames[0].doFormTransfer('" + glinkTknAry[i] + "')";
		portalWnd.iWindow.dropObj.addItem(menuText, null, "FUNCTION", menuClick, menuHref);
	}
	
	portalWnd.iWindow.dropObj.showIframe("",actionBtn,"dropObj.portalWnd.frames[0].doFormTransfer");

	} catch(e){reportError(e)}	
}
//============================================================//
function doFormTransfer(tkn)
{
	try{
	
	if (typeof(tkn) == "undefined")
		return;
		
	switch(tkn)
	{
		case "UNJS.2":	//completed jobs
			goJobSchedule();
			return;		
		case "JOBLIST":	//joblist
			goJobList();
			return;
		case "UNPM.1":	//print manager
			goPrintFiles();
			return;
	}

	} catch(e){reportError(e)}		
}

//============================================================//
function goParameterScreen(userName, jobName, jobStep)
{
//goParameterScreen(userName, jobName, jobStep)
	try{
	
	var url=portalWnd.getParameterScreenURL();
	portalWnd.switchContents(url + "&jobOwner=" + userName + "&jobName=" + jobName + "&jobStepNumber=" + jobStep);
	
	} catch(e){reportError(e)}		
}

//============================================================//
function goJobList()
{
	try{
	
	var url=portalWnd.getGoJobListURL();
	portalWnd.switchContents(url);
	
	} catch(e){reportError(e)}		
}
//============================================================//
function goJobSchedule()
{
	try{
	
	var url=portalWnd.getGoJobScheduleURL();
	portalWnd.switchContents(url);

	} catch(e){reportError(e)}		
}
//============================================================//
function goPrintFiles()
{
	try{
	
	var url=portalWnd.getGoPrintFilesURL();
	portalWnd.switchContents(url);	

	} catch(e){reportError(e)}		
}
//============================================================//
function removePortalObjects()
{
	try{
	
	portalObj.toolbar.clear();

	} catch(e){reportError(e)}		
}
//============================================================//
function translateLabels()
{
	try{
	
	var tmpObj = null;

	tmpObj = document.getElementById("lblJobName");
	portalWnd.cmnSetElementText(tmpObj,portalWnd.rptPhrases.getPhrase("lblJobName"))

	tmpObj = document.getElementById("lblJobDescription");
	portalWnd.cmnSetElementText(tmpObj,portalWnd.rptPhrases.getPhrase("lblJobDescription"))

	tmpObj = document.getElementById("lblUserName");
	portalWnd.cmnSetElementText(tmpObj,portalWnd.rptPhrases.getPhrase("lblUserName"))

	tmpObj = document.getElementById("lblStep");
	portalWnd.cmnSetElementText(tmpObj,portalWnd.rptPhrases.getPhrase("lblStep"))

	tmpObj = document.getElementById("lblDataArea");
	portalWnd.cmnSetElementText(tmpObj,portalWnd.rptPhrases.getPhrase("lblDataArea"))

	tmpObj = document.getElementById("lblForm");
	portalWnd.cmnSetElementText(tmpObj,portalWnd.rptPhrases.getPhrase("lblForm"))

	tmpObj = document.getElementById("lblStepDescription");
	portalWnd.cmnSetElementText(tmpObj,portalWnd.rptPhrases.getPhrase("lblStepDescription"))

	} catch(e){reportError(e)}		
}
//============================================================//
function loadBlankForm()
{
	try{
	
	var strXML = "<?xml version=\"1.0\"?><JOB><_f1></_f1><_f2></_f2>" +
		"<_f3></_f3><_f4>1</_f4><_f5></_f5><STEP><PARAMS>0</PARAMS></STEP>" + 
		"<_f6r0>1</_f6r0><_f7r0></_f7r0><_f8r0></_f8r0><_f9r0></_f9r0></JOB>";
	oJobDefDS = new portalWnd.DataStorage(strXML);
	nSteps = 1;
	setFormData(true);

	} catch(e){reportError(e)}		
}
//============================================================//
function buildSteps(bDisableParam)
{
	try{
	var jobNode = oJobDefDS.getRootNode();
	var oDetailArea = document.getElementById("detailArea");

	var f6 = "1";
	var f7 = "";
	var f8 = "";
	var f9 = "";
	var selIndex = -1;
	var row = null, cell = null, text = null, input = null, span = null, img = null, tbl = null, btn = null, hr = null;

	clearSteps();

	for (var i=0; i<nSteps; i++)
	{
		f6 = oJobDefDS.getElementValue("_f6r"+i);
		f7 = oJobDefDS.getElementValue("_f7r"+i);

		//Remove Blank Defaulting for Enhancement
		//if(f7=="")
		//	f7=gDefPdl;

		f8 = oJobDefDS.getElementValue("_f8r"+i);
		f9 = oJobDefDS.getElementValue("_f9r"+i);

		//Create row
		var rowDiv = document.createElement("div");
		rowDiv.id = f6;
		rowDiv.style.width = "100%";
		rowDiv.style.height = "30px";

		// Current Step... f6
		input = document.createElement("span");
		input.id = "_f6r" + i;
		input.innerHTML=f6;
		input.className="output";
		input.style.left = "2px"
		input.style.width = "50px";
		rowDiv.appendChild(input);

		// Data Area... f7
		input = document.createElement("Select");
		input.id = "_f7r" + i;
		input.className = "textBox";
		input.style.left = "62px"
		input.style.width = "80px";
		for (var j=0; j < pdlAry.length; j++)
		{
			input.options[j] = new Option(pdlAry[j]);
			input.options[j].text=pdlAry[j];
			input.options[j].value=pdlAry[j];

			if(f7 == input.options[j].value)
				input.options[j].selected=true;
		}
		

		input.onchange=onPdlChange
		input.onblur = textBlur;
		rowDiv.appendChild(input);

		// Form... f8
		input = document.createElement("INPUT");
		input.id = "_f8r" + i;
		input.setAttribute("value", f8);
		input.className = "textBox";
		input.style.left = "152px"
		input.style.width = "60px";
		input.maxLength = "10";
		//input.style.textTransform = "lowercase";
		input.onfocus = textFocus;
		input.onblur = textBlur;
		input.onchange = onFormChange;
		rowDiv.appendChild(input);

		//image
		span = document.createElement("SPAN");
		span.className = "selectButton";
		span.id = "selBtn_f8r" + i;
		span.style.left = "213px";
		span.onclick = doSelectToken;
		img = document.createElement("IMG");
		img.setAttribute("name", "selBtn_f8r" + i);
		img.setAttribute("id", "selBtn_f8r" + i);
		img.setAttribute("src", portalObj.path + "/images/ico_form_dropselect.gif");
		span.appendChild(img);
		rowDiv.appendChild(span);

		// Step Description... f9
		input = document.createElement("INPUT");
		input.id = "_f9r" +i;
		input.setAttribute("value", f9);
		input.className = "textBox"
		input.style.left = "237px"
		input.style.width = "150px";
		input.maxLength = "30";
		input.onfocus = textFocus;
		input.onblur = textBlur;
		rowDiv.appendChild(input);

		// Parameters...
		btn = document.createElement("input");
		btn.type = "button";
		btn.id = "_f11r" + i;
		btn.className = "anchor" + (bDisableParam ? "Disabled" : "Active");
		btn.style.left = "400px"
		btn.style.width = "100px";
		btn.value = portalWnd.rptPhrases.getPhrase("lblParameters");
		btn.title = portalWnd.rptPhrases.getPhrase("lblParameters");
		btn.hideFocus = true;
		btn.disabled = bDisableParam;
		btn.onmouseover = jobdefButtonMouseOver;
		btn.onmouseout = jobdefButtonMouseOut;
		btn.onblur = jobdefButtonBlur;
		btn.onfocus = jobdefButtonFocus;
		btn.onclick = doParameters;
		rowDiv.appendChild(btn);

		// Insert Step
		btn = document.createElement("input");
		btn.type = "button";
		btn.id = "_f12r" + i;
		btn.className = "anchorActive";
		btn.style.left = "505px"
		btn.style.width = "100px";
		btn.value = portalWnd.rptPhrases.getPhrase("lblInsertStep");
		btn.title = portalWnd.rptPhrases.getPhrase("lblInsertStep");
		btn.hideFocus = true;
		btn.onmouseover = jobdefButtonMouseOver;
		btn.onmouseout = jobdefButtonMouseOut;
		btn.onblur = jobdefButtonBlur;
		btn.onfocus = jobdefButtonFocus;
		btn.onclick = doInsertStep;
		rowDiv.appendChild(btn);

		// Delete Step
		btn = document.createElement("input");
		btn.type = "button"
		btn.className = "anchorActive";
		btn.id = "_f13r" + i;
		btn.style.left = "610px"
		btn.style.width = "100px";
		btn.value = portalWnd.rptPhrases.getPhrase("lblDeleteStep");
		btn.title = portalWnd.rptPhrases.getPhrase("lblDeleteStep");
		btn.hideFocus = true;
		btn.onmouseover = jobdefButtonMouseOver;
		btn.onmouseout = jobdefButtonMouseOut;
		btn.onblur = jobdefButtonBlur;
		btn.onfocus = jobdefButtonFocus;
		btn.onclick = doDeleteStep;

		rowDiv.appendChild(btn);

		oDetailArea.appendChild(rowDiv);
	}

	} catch(e){reportError(e)}		
}

function clearSteps()
{
	try{
	
	var oDetailArea = document.getElementById("detailArea");
	while (oDetailArea.childNodes.length > 0)
		oDetailArea.removeChild(oDetailArea.childNodes[0])
	
	} catch(e){reportError(e)}	
}

function textFocus(element)
{
	if(typeof(element) == "undefined")
	{
		if(portalObj.browser.isIE)
			element = window.event.srcElement;
		else
		{
			if(element.target.nodeType == 3)
				element = element.target.parentNode;
			else
				element = element.target;
		}
	}

	element.className = "textBoxHighLight";
	try {
		element.select();
	}catch(e){}
}

function textBlur(element)
{
	if(portalObj.browser.isIE)
		element = window.event.srcElement;
	else
	{
		if(element.target.nodeType == 3)
			element = element.target.parentNode;
		else
			element = element.target;
	}
	element.className = "textBox";
}

function setFormData(bDisableParam)
{
	try{
	
	if (typeof(bDisableParam)!= "boolean")
		bDisableParam = false;

	var txtObj = null;
	var value = null;

	// job name
	value = oJobDefDS.getElementValue("_f2");
	txtObj = document.getElementById("_f2");
	txtObj.value = value;
	// description
	value = oJobDefDS.getElementValue("_f3");
	txtObj = document.getElementById("_f3");
	txtObj.value = value;

	// owner name
	value = oJobDefDS.getElementValue("_f5");
	txtObj = document.getElementById("_f5");
	txtObj.value = value;

	buildSteps(bDisableParam);

	} catch(e){reportError(e)}		
}

function getFormData(bEscapeData)
{
	try{
	
	var txtObj = null;
	var prevStep = null;
	var value = null;
	bEscapeData=(typeof(bEscapeData)=="boolean" ? bEscapeData : false);	

	// job name
	txtObj = document.getElementById("_f2");
	value = bEscapeData ? escape(txtObj.value.toUpperCase()) : txtObj.value.toUpperCase();
	oJobDefDS.setElementValue("_f2", value);
	// description
	txtObj = document.getElementById("_f3");
	value = bEscapeData ? escape(txtObj.value) : txtObj.value;
	oJobDefDS.setElementValue("_f3", value);

	// owner name
	txtObj = document.getElementById("_f5");
	value = bEscapeData ? escape(txtObj.value) : txtObj.value;
	oJobDefDS.setElementValue("_f5", value);

	// number of steps
	oJobDefDS.setElementValue("_f4", nSteps);

	for (var i=0; i<nSteps; i++)
	{
		// data area
		txtObj = document.getElementById("_f7r"+i);
		oJobDefDS.setElementValue("_f7r"+i, txtObj.value.toUpperCase());
		// form
		txtObj = document.getElementById("_f8r"+i);
		//oJobDefDS.setElementValue("_f8r"+i, txtObj.value.toUpperCase());
		oJobDefDS.setElementValue("_f8r"+i, txtObj.value);
		// description
		txtObj = document.getElementById("_f9r"+i);
		value = bEscapeData ? escape(txtObj.value) : txtObj.value;
		oJobDefDS.setElementValue("_f9r"+i, value);
 		// previous step
 		prevStep = oJobDefDS.getElementValue("_f10r"+i);
 		oJobDefDS.setElementValue("_f10r"+i,prevStep);
 	}

	} catch(e){reportError(e)}	 	
}
//============================================================//
function doSelect()
{
	try {
		showBusy();
		
		if (oJobDefDS.getElementValue("_f5") == "")
			var login = portalWnd.oUserProfile.getAttribute("lawsonusername");
		else if (oJobDefDS.getElementValue("_f5") != portalWnd.oUserProfile.getAttribute("lawsonusername"))
			var login = oJobDefDS.getElementValue("_f5");
		else
			var login = portalWnd.oUserProfile.getAttribute("lawsonusername");		
		
		var idaApi = portalWnd.IDAPath + "?_OUT=XML&_TYP=SL&@un=" + login + "&_KNB=@mj";

		gLastControl = document.getElementById("_f2");

		if(!portalWnd.oUserProfile.isOpenWindow("select"))
		{
			removePortalObjects();
			var title = "Drill Around" + String.fromCharCode(174);
			portalObj.setTitle(title);
		}				

		portalObj.drill.doSelect(window, "doSelectReturn", idaApi);

	} catch(e){reportError(e)}	
}
//============================================================//
function doSelect2()
{
	try {
		showBusy();

		if (!portalWnd.oUserProfile.isOpenWindow("select"))
		{
			removePortalObjects();
			var title = "Drill Around" + String.fromCharCode(174);
			portalObj.setTitle(title);
		}

		var idaApi = portalWnd.IDAPath + "?_OUT=XML&_TYP=SV&_KNB=@un";

		gLastControl = document.getElementById("_f5");

		portalObj.drill.doSelect(window, "doSelectReturn", idaApi);

	} catch(e){reportError(e)}
}
//============================================================//
function doSelectReturn(keys)
{
	try {
		showBusy();

		if(!portalWnd.oUserProfile.isOpenWindow("select"))
			buildPortalObjects();

		var bDoInquire=false;
		if (keys && keys.childNodes)
		{
			for (var i=0; i<keys.childNodes.length; i++)
			{
				if (keys.childNodes[i].nodeType != 3
						&& (keys.childNodes[i].getAttribute("keynbr") == "@mj" 
						|| keys.childNodes[i].getAttribute("keynbr") == "@pl"))
				{
					var value = keys.childNodes[i].firstChild.nodeValue;
					gLastControl.value = value;
				}
				if (keys.childNodes[i].nodeType != 3
				&& "@un" == keys.childNodes[i].getAttribute("keynbr"))
				{
					var userName = keys.childNodes[i].firstChild.nodeValue;
				}

				if (keys.childNodes[i].nodeType != 3
				&& "@ln" == keys.childNodes[i].getAttribute("keynbr"))
				{
					var longName = keys.childNodes[i].firstChild.nodeValue;
				}				

			}
			
			if ((document.getElementById("_f5").value != userName) && (!value))
			{
				gLastControl.value = userName
				bDoInquire=true;
			}			 

		}

		gLastControl.focus();
		showReady();

		if (bDoInquire) doInquire();

	} catch(e){reportError(e)}	
}

function doInquire()
{
	try{
		showBusy();
		setTimeout("doFunction1('" + "I" + "')",50)
		showReady();

	} catch(e){reportError(e)}
}

//============================================================//
function doSelectToken(e)
{
	try {
		gJobStep = getJobStep(e);
		var pdl= document.getElementById("_f7r" + gJobStep).value;
		var token = document.getElementById("_f8r" + gJobStep).value;
		var callback = "doSelectTokenReturn";
		var qString = "?_PDL=" + pdl + "&_TKN=" + token + "&_FUNC=" + callback + "&_FILTER=BATCH";

		getFormData();

		if(portalWnd.oUserProfile.isOpenWindow("select"))
		{
			var features = "dialogWidth:500px;dialogHeight:400px;center:yes;help:no;scroll:no;status:no;resizable:yes;";
			portalWnd.setCallBackPrms(window)
			portalWnd.cmnDlg.show("/reports/tokenSelect.htm" + qString, features);
		}
		else
		{
			showBusy();
			removePortalObjects();
			portalWnd.useDrillFrame(portalObj.path + "/reports/tokenSelect.htm" + qString, window);
			var title = "Drill Around" + String.fromCharCode(174);
			portalObj.setTitle(title);
			showReady();
		}
		
	} catch(e){reportError(e)}	
}
//============================================================//
function doSelectTokenReturn(token, tokenTitle)
{
	try {
		window.focus();
		var tokenElement = document.getElementById("_f8r" + gJobStep);
		var titleElement = document.getElementById("_f9r" + gJobStep);

		if(typeof(token) != "undefined")
		{
			tokenElement.value = token;
			oJobDefDS.setElementValue("_f8r" + gJobStep,token);
		}

		if(typeof(tokenTitle) != "undefined")
		{
			titleElement.value = tokenTitle;
			titleElement.focus();
			oJobDefDS.setElementValue("_f9r" + gJobStep,tokenTitle);
		}
		else
			tokenElement.focus()

		gJobStep = null;

		if(!portalWnd.oUserProfile.isOpenWindow("select"))
		{
			portalWnd.hideDrillFrame();
			buildPortalObjects();
		}

		showReady();

	} catch(e){reportError(e)}	
}
//============================================================//
function doAddStep(bUpdate)
{
	try {
		if(!bUpdate)
		{//did not come from insertStep()
			showBusy();

			for(var i=0;i<nSteps;i++)
			{
				if(!isValidStep(i))
				{
					showReady();
					return;
				}
			}

			getFormData();
			gDefPdl = oJobDefDS.getElementValue("_f7r"+ (nSteps-1));
		}

		var jobNode = oJobDefDS.getRootNode();

		if(!jobNode)
		{
			showReady();
			return;
		}

		var stepNode = oJobDefDS.document.createElement("STEP");
		var paramNode = oJobDefDS.document.createElement("PARAMS");

		paramNode.appendChild(oJobDefDS.document.createTextNode("0"));
		stepNode.appendChild(paramNode);
		jobNode.appendChild(stepNode);

		stepNode = oJobDefDS.document.createElement("_f6r"+nSteps);
		jobNode.appendChild(stepNode);
		stepNode = oJobDefDS.document.createElement("_f7r"+nSteps);
		jobNode.appendChild(stepNode);
		stepNode = oJobDefDS.document.createElement("_f8r"+nSteps);
		jobNode.appendChild(stepNode);
		stepNode = oJobDefDS.document.createElement("_f9r"+nSteps);
		jobNode.appendChild(stepNode);
 		stepNode = oJobDefDS.document.createElement("_f10r"+nSteps);
	 	jobNode.appendChild(stepNode);

		nSteps++;
		oJobDefDS.setElementValue("_f6r"+(nSteps-1), nSteps);

		if(!bUpdate)
		{
			buildSteps(true);
			showReady();
			var tknElement = document.getElementById("_f8r" + (nSteps-1));
			tknElement.focus();
			tknElement.select();
		}

	} catch(e){reportError(e)}	
}
//============================================================//
function doInsertStep(e)
{
	try {
		showBusy();
		var jobStep = getJobStep(e);

		for(var i=0;i<nSteps;i++)
		{
			if(!isValidStep(i))
			{
				showReady();
				return;
			}
		}

		getFormData();
		gDefPdl = oJobDefDS.getElementValue("_f7r"+jobStep);

		doAddStep(true);

		// Move the steps down leaving the current row as the blank new step
		for(var i=nSteps-1; i>jobStep; i--)
		{
			oJobDefDS.setElementValue("_f7r"+i, oJobDefDS.getElementValue("_f7r"+(i-1)));
			oJobDefDS.setElementValue("_f8r"+i, oJobDefDS.getElementValue("_f8r"+(i-1)));
			oJobDefDS.setElementValue("_f9r"+i, oJobDefDS.getElementValue("_f9r"+(i-1)));
 			oJobDefDS.setElementValue("_f10r"+i, oJobDefDS.getElementValue("_f10r"+(i-1)));
	 		oJobDefDS.setElementValue("PARAMS", oJobDefDS.getElementValue("PARAMS", i-1), i);
		}

		oJobDefDS.setElementValue("_f7r"+jobStep, "");
		oJobDefDS.setElementValue("_f8r"+jobStep, "");
		oJobDefDS.setElementValue("_f9r"+jobStep, "");
 		oJobDefDS.setElementValue("_f10r"+jobStep, "");
		oJobDefDS.setElementValue("PARAMS", "0", jobStep);

		buildSteps(true);

		var tknElement = document.getElementById("_f8r" + jobStep);
		tknElement.focus();
		tknElement.select();
		showReady();

	} catch(e){reportError(e)}	
}
//============================================================//
function doDeleteStep(e)
{
	try {
		showBusy();
		var jobStep = getJobStep(e);

		if (nSteps == 1)
		{
			var formElement = document.getElementById("_f8r"+jobStep);
			var msg = portalWnd.rptPhrases.getPhrase("msgOneStepReq")
			portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
			formElement.focus();
			formElement.select();
			showReady();
			return;
		}

		getFormData();

		var jobNode = oJobDefDS.getRootNode();

		if(!jobNode)
		{
			showReady();
			return;
		}

		// move the data up a row
		for (var i=parseInt(jobStep,10); i<nSteps-1; i++)
		{
			oJobDefDS.setElementValue("_f7r"+i, oJobDefDS.getElementValue("_f7r"+(i+1)));
			oJobDefDS.setElementValue("_f8r"+i, oJobDefDS.getElementValue("_f8r"+(i+1)));
			oJobDefDS.setElementValue("_f9r"+i, oJobDefDS.getElementValue("_f9r"+(i+1)));
 			oJobDefDS.setElementValue("_f10r"+i, oJobDefDS.getElementValue("_f10r"+(i+1)));
		}

		// delete the last row from jobXML
		var node = oJobDefDS.getNodeByName("_f6r"+(nSteps-1));
		jobNode.removeChild(node);
		node = oJobDefDS.getNodeByName("_f7r"+(nSteps-1));
		jobNode.removeChild(node);
		node = oJobDefDS.getNodeByName("_f8r"+(nSteps-1));
		jobNode.removeChild(node);
		node = oJobDefDS.getNodeByName("_f9r"+(nSteps-1));
		jobNode.removeChild(node);
	 	node = oJobDefDS.getNodeByName("_f10r"+(nSteps-1));
 		jobNode.removeChild(node);

		// delete the step node from jobXML
		var stepNodes = oJobDefDS.getElementsByTagName("STEP");
		jobNode.removeChild(stepNodes.item(jobStep));

		nSteps--;
		oJobDefDS.setElementValue("_f4", nSteps);
		buildSteps(true);

		if (jobStep >= nSteps)
			jobStep--;

		var formElement = document.getElementById("_f8r"+jobStep);
		formElement.focus();
		formElement.select();
		showReady();

	} catch(e){reportError(e)}	
}
//============================================================//
function doSubmit()
{
	try {
		if (!portalObj.browser.isIE)
			showBusy();

		getFormData();

		if(!isValidJob())
		{
			showReady();
			return;
		}

		var jobName = oJobDefDS.getElementValue("_f2");
		if (oJobDefDS.getElementValue("_f5") == "")
			var userName = portalWnd.oUserProfile.getAttribute("lawsonusername");
		else if (oJobDefDS.getElementValue("_f5") != portalWnd.oUserProfile.getAttribute("lawsonusername"))
			var userName = oJobDefDS.getElementValue("_f5");
		else
			var userName = portalWnd.oUserProfile.getAttribute("lawsonusername");

		if(gHK != jobName)
		{
			var msg = portalWnd.erpPhrases.getPhrase("ERR_MUST_INQUIRE_FIRST");
			portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
			posInFirstField();
			showReady();
			return;
		}

		if (!portalObj.browser.isIE)
			removePortalObjects();

		portalWnd.showJobSubmit(jobName, userName, window, "doSubmitReturn");

	} catch(e){reportError(e)}	
}
//============================================================//
function doSubmitReturn()
{
	try {
		showBusy();

		if (!portalObj.browser.isIE)
			buildPortalObjects();

		posInFirstField();
		showReady();

	} catch(e){reportError(e)}	
}
function doFunction(val)
{
	try{
	
	oFeedBack.show();
	setTimeout("doFunction1('" + val + "')",50)

	} catch(e){reportError(e)}		
}
//============================================================//
function doFunction1(val)
{
	try {
		showBusy();
		getFormData(true);
		oJobDefDS.setElementValue("_f1", val);

//		if(!isValidJob())
//			return;

		if((val == "C" || val == "D") &&
			(gHK != unescape(oJobDefDS.getElementValue("_f2"))))
		{

			var msg = portalWnd.erpPhrases.getPhrase("ERR_MUST_INQUIRE_FIRST");
			portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
			posInFirstField();
			showReady();
			return;
		}

		switch (val)
		{
			case "A":
				var strVal = portalWnd.rptPhrases.getPhrase("lblAdd");
				break;
			case "C":
				var strVal = portalWnd.rptPhrases.getPhrase("lblChange");
				break;
			case "D":
				var strVal = portalWnd.rptPhrases.getPhrase("lblDelete");
				break;
			case "I":
				var strVal = portalWnd.rptPhrases.getPhrase("lblInquire");
				break;
			default:
				var strval = "";
				break;
		}

		portalObj.setMessage(portalWnd.rptPhrases.getPhrase("msgProcessing") + " " + strVal + "...");

		if (val == "D")
		{
			document.body.style.cursor = "auto";
			doDelete();
			return;
		}

		var jobXMLdom = portalWnd.httpRequest("/cgi-lawson/xjobdef.exe", oJobDefDS.document,null,null,false);
		var msg=portalObj.getPhrase("msgErrorInvalidResponse") + " xjobdef.exe.\n\n";
		if (portalWnd.oError.isErrorResponse(jobXMLdom,true,true,false,msg,window))
		{
			showReady();
			posInFirstField();
			return;
		}

		oJobDefDS = portalWnd.oError.getDSObject();
		nSteps = parseInt(oJobDefDS.getElementValue("_f4"),10);
		setFormData(false);

		if(val == "I" || val == "A" )
			gHK = oJobDefDS.getElementValue("_f2");

		var fldNbr = oJobDefDS.getElementValue("FLDNBR");
		msg = oJobDefDS.getElementValue("MESSAGE");

		if(!fldNbr)
			posInFirstField();
		else
		{
			try {
				var fldNbrElem = document.getElementById(fldNbr);
				fldNbrElem.focus();
				fldNbrElem.select();
			}catch(e){posInFirstField()}
		}
		showReady();
		portalObj.setMessage(msg);

	} catch(e){reportError(e)}	
}
//============================================================//
function doDelete()
{
	try {
		showBusy();

		var jobName = oJobDefDS.getElementValue("_f2");
		if (portalWnd.oUserProfile.getAttribute("lawsonusername") == oJobDefDS.getElementValue("_f5"))
			var userName = portalWnd.oUserProfile.getAttribute("lawsonusername");
		else
			var userName = oJobDefDS.getElementValue("_f5");
		var msg=portalWnd.rptPhrases.getPhrase("msgOkToDeleteJob") + " " + jobName + ".";
		if (portalWnd.cmnDlg.messageBox(msg,"yesno","question",window) != "yes")
			showReady();
		else
			deleteJobs(userName, jobName);

		posInFirstField();
		
	} catch(e){reportError(e)}	
}
//============================================================//
function deleteJobs(jobUser, joblist)
{
	try {
		var api = "/cgi-lawson/xdeljob.exe?" + jobUser + "&" + joblist;
		var oDeleteXml = portalWnd.httpRequest(api,null,null,null,false);

		var msg=portalObj.getPhrase("msgErrorInvalidResponse") + " xdeljob.exe.\n\n";
		if (portalWnd.oError.isErrorResponse(oDeleteXml,true,true,false,msg,window))
			return;

		var oDS = portalWnd.oError.getDSObject();
		var oJobNodes = oDS.getElementsByTagName("Job");
		var len = oJobNodes ? oJobNodes.length : 0;
		msg="";
		for (var i=0; i < len; i++)
			msg += oJobNodes[i].firstChild.nodeValue;

		showReady();
		portalObj.setMessage(msg);

	} catch(e){reportError(e)}	
}
//============================================================//
function doParameters(e)
{
	try {
		showBusy();
		getFormData();
		var jobStep = getJobStep(e);

		if(!isValidJob())
		{
			showReady();
			return;
		}

		if(!isValidStep(jobStep))
		{
			showReady();
			return;
		}

		if (portalWnd.oUserProfile.getAttribute("lawsonusername") == oJobDefDS.getElementValue("_f5"))
			var userName = portalWnd.oUserProfile.getAttribute("lawsonusername");
		else
			var userName = oJobDefDS.getElementValue("_f5");

		userName = userName.replace(/\\/g, "\\\\"); //window DOMAIN\USER issue		
		var jobName = oJobDefDS.getElementValue("_f2");
		var pdl = oJobDefDS.getElementValue("_f7r" + jobStep);
		var token = oJobDefDS.getElementValue("_f8r" + jobStep);
		var hybridHK = "_JOBPARAM~jobDef~" + userName + "~" + jobName + "~" + jobStep;
	
		if (pdl != "")
			portalWnd.formTransfer(token, pdl, null, hybridHK);
		else
			goParameterScreen(userName, jobName, jobStep);

 	
	} catch(e){reportError(e)}	
}
//============================================================//
function doClearForm()
{
	try {
		showBusy();
		loadBlankForm();
		posInFirstField();
		showReady();

	} catch(e){reportError(e)}	
}
//============================================================//
function isValidJob()
{
	try{
	
	var jobName = oJobDefDS.getElementValue("_f2");
	var jobNameElement = document.getElementById("_f2");

	if(jobName == "")
	{
		showReady();
		var msg = portalWnd.rptPhrases.getPhrase("msgJobNameReq");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		portalObj.setMessage(msg);
		posInFirstField();
		return false;
	}
	return true;

	} catch(e){reportError(e)}		
}
//============================================================//
function isValidStep(step)
{
	try{
	
	var pdlElement = document.getElementById("_f7r"+step)
	var pdl = pdlElement.value;
	
	//for enhancement
	/*
	if(pdl == "")
	{
		var msg = portalWnd.rptPhrases.getPhrase("msgDataAreaReqJobStep");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		pdlElement.focus();
		return false;
	}
	*/
	var tknElement = document.getElementById("_f8r"+step);
	var tkn= portalWnd.trim(tknElement.value);

	if(tkn == "")
	{
		var msg = portalWnd.rptPhrases.getPhrase("msgFormReqJobStep");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		tknElement.focus();
		tknElement.select();
		return false;
	}

	return true

	} catch(e){reportError(e)}		
}
//============================================================//
function handleKeyDown(evt)
{
	try{
	
	var evtCaught = false;

	evt = portalWnd.getEventObject(evt);
	if (!evt)
		return false;

	// check with portal for hotkey action
	var action = portalWnd.getFrameworkHotkey(evt,"forms");
	if ( !action )
	{
		// framework handled the keystroke
		portalWnd.setEventCancel(evt)
		return false;
	}

	// hotkey defined for this keystroke
	if (action != "forms")
	{
		evtCaught=cntxtActionHandler(evt,action);
		portalWnd.setEventCancel(evt);
		return false;
	}

	var keyVal = (portalObj.browser.isIE) ? evt.keyCode : evt.charCode ;
	if (keyVal == 0)	// netscape only
		keyVal = evt.keyCode;


	switch(keyVal)
	{
		case 27://ESC
			portalWnd.hideDrillFrame();
			evtCaught = true;
			break;
	}

	if (evtCaught)
		portalWnd.setEventCancel(evt);

	return evtCaught;

	} catch(e){reportError(e)}		
}
//============================================================//
function cntxtActionHandler(evt,action)
{
	try{
	
	if (action==null)		// called by the portal
	{
		action = portalWnd.getFrameworkHotkey(evt,"forms");
		if (!action || action=="forms")
			return false;
	}

	var mElement=portalWnd.getEventElement(evt)
	var bHandled=false;

	switch(action)
	{
		case "doSubmit":
			doSubmit();
			bHandled=true
			break;
		case "doClearAll":
			doClearForm();
			bHandled=true
			break;
		case "doFuncAdd":
			doFunction("A");
			bHandled=true
			break;
		case "doFuncChg":
			doFunction("C");
			bHandled=true
			break;
		case "doFuncInq":
			doFunction("I");
			bHandled=true
			break;
		case "doDelete":
			doFunction("D");
			bHandled=true
			break;
		case "doRefresh":
			doFunction("I");
			bHandled=true
			break;
		case "doCancel":
			portalWnd.hideDrillFrame();
			bHandled=true;
			break;
		case "openNewWindow":
			var url = "?_URL=reports/jobdef.htm";
	
			if (portalWnd.oPortalConfig.isPortalLessMode())
					url+="&RUNASTOP=0";		

			portalWnd.newPortalWindow(url);						
			bHandled=true;
			break;
		case "posInFirstField":
			posInFirstField();
			bHandled=true;
			break;
		case "doContextMenu":
			if(mElement && mElement.id == "_f2")
			{
				showContextMenu(evt,window,mElement);
				bHandled=true;
			}
			break;
		case "doOpenField":
			if(mElement && mElement.id == "_f2")
			{
				doSelect()
				bHandled=true
			}

			if(mElement && mElement.id.substring(0,3) == "_f8")
			{
				doSelectToken(evt)
				bHandled=true
			}

			if(typeof(mElement.onclick) == "function")
			{
				mElement.click();
				bHandled=true;
			}
			break;
	}

	return (bHandled);

	} catch(e){reportError(e)}		
}
//============================================================//
function unloadFunc()
{
	try {
		portalWnd.clearCallBackPrms();

		if (typeof(portalWnd.formUnload) == "function")
			portalWnd.formUnload();

		portalWnd = null;
		portalObj = null;
		gDefPdl=null;
		gJobStep = null;
		oJobDefDS = null;
		gLastControl = null;
		pdlAry = new Array();
		nSteps = 0;
		oDropDown=null

	} catch(e){reportError(e)}	
}
//============================================================//
function getProductLines()
{
	try{
	
	var api = portalWnd.PRODPROJPath+"?OUT=TEXT";

	var strProdProj=portalWnd.httpRequest(api,null,null,"text/plain",false);
	var msg=portalObj.getPhrase("msgErrorInvalidResponse") + " "+portalWnd.PRODPROJPath+".\n\n";
	if (portalWnd.oError.handleBadResponse(strProdProj,true,msg,window))
		return;

	if (strProdProj.length == 0) return;

	var re=new RegExp("\\n|\\r\\n|\\r","g")
	var names=strProdProj.split(re)

	for (var i=0; i < names.length; i++)
		pdlAry[i] = names[i];
	
	pdlAry[i] = "";
		
	} catch(e){reportError(e)}			
}
//============================================================//
function onPdlChange(e)
{
	try{
	
	var jobStep = getJobStep(e);
	var tokenElement = document.getElementById("_f8r" + jobStep);
	var titleElement = document.getElementById("_f9r" + jobStep);

	tokenElement.value = "";
	titleElement.value = "";

	enableParameters(jobStep, false)
	return true;

	} catch(e){reportError(e)}		
}
//============================================================//
function onFormChange(e)
{
	try{
	
	var jobStep = getJobStep(e);
	enableParameters(jobStep, false)
	return true;
	
	} catch(e){reportError(e)}		
}
//============================================================//
function enableParameters(jobStep, enable)
{
	try{
	
	var id =  "_f11r" + jobStep;
	var btn = document.getElementById(id);
	btn.className = "anchor" + (enable ? "Active" : "Disabled");
	return true;

	} catch(e){reportError(e)}	
}
//============================================================//
function updateSteps()
{
	try{
	
	var txtObj = null;

	for (var i=0; i<nSteps; i++)
	{
		// Data Area
		txtObj = document.getElementById("_f7r"+i);
		txtObj.value = oJobDefDS.getElementValue("_f7r"+i);
		// Form
		txtObj = document.getElementById("_f8r"+i);
		txtObj.value = oJobDefDS.getElementValue("_f8r"+i);
		// Step Description
		txtObj = document.getElementById("_f9r"+i);
		txtObj.value =oJobDefDS.getElementValue("_f9r"+i);
	}

	} catch(e){reportError(e)}		
}
//============================================================//
function getJobStep(e)
{
	try{
	
	var what = null;

	if (portalObj.browser.isIE)
		what = window.event.srcElement.id;
	else
	{
		if (e.target.nodeType == 3)
		{
			what = e.target.parentNode.id;
		}
		else
		{
			what = e.target.id;
		}
	}

	return what.substring((what.indexOf("r")+1),what.length);

	} catch(e){reportError(e)}		
}
//============================================================//
function jobdefButtonMouseOver(btn)
{
	if (this.className == "anchorActive")
		this.className = "anchorHover"
}
//============================================================//
function jobdefButtonMouseOut(btn)
{
	if (this.className == "anchorHover")
		this.className="anchorActive" 
}
//============================================================//
function jobdefButtonBlur(btn)
{
	this.className = "anchorActive";
}
//============================================================//
function jobdefButtonFocus(btn)
{
	this.className = "anchorFocus";
}
//============================================================//
function jobdefResize()
{
	try {
		if (oFeedBack && typeof(oFeedBack.resize) == "function")
			oFeedBack.resize();
			
	} catch(e){reportError(e)}	
}
//============================================================//
function showBusy()
{
	portalObj.setMessage(portalObj.getPhrase("PROCESSING"));
	document.body.style.cursor = "wait";
}
//============================================================//
function showReady()
{
	try {
		document.body.style.cursor = "auto";
		portalObj.setMessage(portalObj.getPhrase("AGSREADY"));

		if(oFeedBack && typeof(oFeedBack.hide) == "function");
			oFeedBack.hide();
	} catch(e) { }
}
//============================================================//
function setInitialParameters()
{
	try{
	
	var qString = window.location.search;
	var jobName = portalWnd.getVarFromString("_JOBNAME", qString);
	var ownerIndex = qString.lastIndexOf("&") + 1;
	var ownerName = ""
	if (ownerIndex > 0)
		ownerName = qString.slice(ownerIndex);

	if(jobName != "")
	{
		var jobNameElement = document.getElementById("_f2");
		jobNameElement.value = jobName;
		oJobDefDS.setElementValue("_f2",jobName);

		var ownerNameElement = document.getElementById("_f5");
		ownerNameElement.value = ownerName;
		oJobDefDS.setElementValue("_f5",ownerName); //changes
	}
	
	} catch(e){reportError(e)}		
}
//============================================================//
function posInFirstField()
{
	try {
		var jobName = document.getElementById("_f2");
		jobName.focus();
		jobName.select();
		
	} catch(e){reportError(e)}	
}
//============================================================//
function showContextMenu(evt,window, mElement)
{
	try {
		if (typeof(mElement) == "undefined")
		{
			mElement = portalWnd.getEventElement(evt)
			if (typeof(mElement) == "undefined") return;
		}
		if (!mElement) return;
		window.lastControl=mElement;

		if (!window.oDropDown)
			window.oDropDown=new window.Dropdown()

		window.oDropDown.clearItems()
		oDropDown.addItem(portalWnd.rptPhrases.getPhrase("lblSelect"), "select");

		window.oDropDown.show("", mElement, "returnContextMenu")
		evt=portalWnd.getEventObject(evt);

		if(evt) 
			portalWnd.setEventCancel(evt);

	} catch(e){reportError(e)}	
}
//============================================================//
function returnContextMenu(value)
{
	try {
		if(value == "select")
			doSelect();
		else
			window.lastControl.select();

	} catch(e){reportError(e)}	
}
//============================================================//
function reportError(error)
{
	try{
		showReady();
		var strFunction = reportError.caller.toString();
		var i = (strFunction.indexOf("("));
		var funcName = strFunction.substr(0,i);
		funcName = funcName.replace("function ","");
		portalWnd.cmnErrorHandler(error,window,JOBDEFJS,"",funcName);			
	}catch(e){}
}

