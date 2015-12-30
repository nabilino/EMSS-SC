/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/reports/jobutil.js,v 1.15.2.21.4.19.6.2.2.6.2.2 2013/09/11 04:41:08 jquito Exp $ */
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

var CONST_GETTOKENS="/cgi-lawson/gettokens.exe";

var oJob = null;	// global job object variable
var jobsContentWin = null;
var jobsCallBackFunc = null;
var oJobPrintFiles=null; 
var jobUtilPageIndex = "";
var jobUtilTableIndex = 0;
var jobUtilLastCall = "";
var jobUtilFindFieldIndex = "";
var jobUtilFindKeyValue = "";
var jobUtilSearchMode = "";

function showJobSubmit(jobName, userName, cntWin, callBackFunc)
{
	oJob = new JobObject(jobName, userName);

	if(lawsonPortal.browser.isIE)
	{
		var args = new Array(window,lawsonPortal.getPhrase("lblSubmitJob"))
		var features = "dialogWidth:300px;dialogHeight:230px;center:yes;help:no;scroll:no;status:no;resizable:no;";
		setCallBackPrms(cntWin, callBackFunc);
		cmnDlg.show("/reports/jobsubmit.htm", features, args);	
	}
	else
		useDrillFrame(lawsonPortal.path + "/reports/jobsubmit.htm", cntWin, callBackFunc);
}

function showRptPrint(jobName, userName, tkn, prtFile, cntWin, callBackFunc)
{
	oJob = new JobObject(jobName, userName);
	oJob.token = tkn;
	oJob.printFile = prtFile ;
	
	if(lawsonPortal.browser.isIE)
	{
		var args = new Array(window,lawsonPortal.getPhrase("lblPrintReport"))
		var features = "dialogWidth:400px;dialogHeight:255px;center:yes;help:no;scroll:no;status:no;resizable:no;";
		setCallBackPrms(cntWin, callBackFunc);
		cmnDlg.show("/reports/rptprint.htm", features, args);	
	}
	else
		useDrillFrame(lawsonPortal.path + "/reports/rptprint.htm", cntWin, callBackFunc);
}

function showPrintMgr(jobName, userName, tkn, batchForm, cntWin, callBackFunc)
{
	oJob = new JobObject(jobName, userName);
	oJob.token = tkn;
	oJob.batchForm = batchForm;

	if(lawsonPortal.browser.isIE)
	{
		var args = new Array(window,lawsonPortal.getPhrase("LBL_REPORT_PROPERTIES"))
		var features = "dialogWidth:500px;dialogHeight:240px;center:yes;help:no;scroll:no;status:no;resizable:no;";
		setCallBackPrms(cntWin, callBackFunc);
		cmnDlg.show("/reports/printmgr.htm", features, args);	
	}
	else		
		useDrillFrame(lawsonPortal.path + "/reports/printmgr.htm", cntWin, callBackFunc);
}
//-----------------------------------------------------------------------------
//------------------------- JOB OBJECT & METHODS... ---------------------------
//-----------------------------------------------------------------------------

function JobObject(jobName, userName, jobQueue, startDate, startTime)
{
	this.jobName		= jobName;
	this.userName		= userName;
	this.jobQueue		= "";
	this.startDate		= "";
	this.startTime		= "";
	this.token			= "";
	this.copies			= 1;
	this.printFile		= "";
	this.batchForm		= null;
	this.rptPropAry		= new Array();
	this.caller			= "";
}

JobObject.prototype.submitJob=function()
{
	var msg  = "";
	var api  = "?FUNC=run"
		api += "&JOB="		+ oJob.jobName
		api += "&USER="		+ oJob.userName
		api += "&DATE="		+ oJob.startDate
		api += "&TIME="		+ oJob.startTime
		api += "&QUEUE="	+ oJob.jobQueue
		api += "&OUT=XML"

	return httpRequest("/cgi-lawson/jobrun.exe" + api,null,null,null,false);
}

JobObject.prototype.printReport=function()
{
	var msg = "";
	var api  = "?_DTGT="
		api += "&_FN="			+ this.printFile
		api += "&_DMD=PRINT"
		api += "&_PRINTER="		+ this.printer
		api += "&_COPIES="		+ this.copies
		api += "&_DSTUSR="		+ this.userName
		api += "&_PRINT=TRUE"

	var printXML = httpRequest("/cgi-lawson/webrpt.exe" + api, null, null, "text/html", false)
	oJob = null;
	return printXML;
}
JobObject.prototype.getPrtInfo=function()
{
	//possible reports
	//# of properties per report
	//_f13 to _f72 elements are reserved for report properties
	this.rptPropAry.length = 0;
	var pos = 13;
	var oBatchTkn = this.batchForm;
	
	for(var i=0; i<10; i++)
	{
		var oPrtData = new Object();
		oPrtData.prtFile = oBatchTkn.getDataValue("RPT-FLD" + pos);
		pos++;
		oPrtData.destOption = oBatchTkn.getDataValue("RPT-FLD" + pos);
		pos++;
		oPrtData.destination = oBatchTkn.getDataValue("RPT-FLD" + pos);
		pos++;
		oPrtData.copies = oBatchTkn.getDataValue("RPT-FLD" + pos);
		pos++;
		oPrtData.saveOption = oBatchTkn.getDataValue("RPT-FLD" + pos);
		pos++;
		oPrtData.path = oBatchTkn.getDataValue("RPT-FLD" + pos);
		pos++;

		this.rptPropAry.push(oPrtData);			
	}
}
JobObject.prototype.setPrtInfo=function()
{
	var pos = 13;
	var oBatchTkn = this.batchForm;
	
	for(var i=0; i<10; i++)
	{
		var oPrtData = this.rptPropAry[i];
		
		oBatchTkn.setDataValue("RPT-FLD" + pos, oPrtData.prtFile);
		pos++;
		oBatchTkn.setDataValue("RPT-FLD" + pos, oPrtData.destOption);
		pos++;
		oBatchTkn.setDataValue("RPT-FLD" + pos, oPrtData.destination);
		pos++;
		oBatchTkn.setDataValue("RPT-FLD" + pos, oPrtData.copies);
		pos++;
		oBatchTkn.setDataValue("RPT-FLD" + pos, oPrtData.saveOption);
		pos++;
		oBatchTkn.setDataValue("RPT-FLD" + pos, oPrtData.path);
		pos++;
	}
}
//-----------------------------------------------------------------------------
//------------------------- END Job Object & Methods... -----------------------
//-----------------------------------------------------------------------------

function DrillToken (portalWnd, isModal, pdl, filter, callbackFunc)
{
	if(!this.validateArguments(portalWnd, isModal, pdl, filter, callbackFunc))
		return null;

	this.portalWnd = portalWnd;
	this.pdl = pdl;
	this.systemCode = null;
	this.token = null;
	this.filter = null;	
	this.callbackFunc = callbackFunc;

	this.isModal = isModal;	
	this.portalObj = portalWnd.lawsonPortal;
	this.oToolbar = null;
	this.systemCodeList = new Array();	
}

DrillToken.prototype.validateArguments=function(portalWnd, isModal, pdl, filter, callbackFunc)
{
	if(typeof(portalWnd) != "object")
		return false;
	if(typeof(isModal) != "boolean")
		return false;
	if(typeof(pdl) != "string")
		return false;
	if(typeof(filter) != "string")
		return false;
	if(typeof(callbackFunc) != "string")
		return false;
	return true;
}
DrillToken.prototype.setFilter=function(filter)
{
	filter = filter.toUpperCase();
	this.filter = ((filter != "ONLINE" && filter != "BATCH") ? null : filter);

}
DrillToken.prototype.getSystemCodes=function()
{
	var api = this.portalWnd.IDAPath + "?_KNB=@sc&@pl=" + this.pdl + "&_RECSTOGET=100";
	var idaXML = this.portalWnd.httpRequest(api,null,null,"text/xml", false);

	if (this.portalWnd.oError.isErrorResponse(idaXML,true,true,false,"",window))
		return false;

	var oDS = this.portalWnd.oError.getDSObject();
	var systemCodeXml = oDS.getElementsByTagName("COLS");
	var iLoop = systemCodeXml.length;
	
	for (var i=0; i < iLoop; i++)
	{
		var oSystemCode	= new Object();
		oSystemCode.name = "";
		oSystemCode.title = "";
		oSystemCode.hasTokens = false;
		oSystemCode.tokens = new Array();		
		
		var node = systemCodeXml[i];
		var jLoop = node.getElementsByTagName("COL")[0].childNodes.length;
	
		for (var j=0; j < jLoop; j++)
		{
			if(node.getElementsByTagName("COL")[0].childNodes[j].nodeType==4)
				oSystemCode.name = node.getElementsByTagName("COL")[0].childNodes[j].nodeValue;
			if(node.getElementsByTagName("COL")[1].childNodes[j].nodeType==4)
				oSystemCode.title = node.getElementsByTagName("COL")[1].childNodes[j].nodeValue;
			
			this.systemCodeList[i]=oSystemCode;
			if(i==0)
				this.systemCode = oSystemCode.name;
		}
	}
	
	return true;
}

DrillToken.prototype.getSystemCodeIndex=function(systemCode)
{
	var loop = this.systemCodeList.length;
	for (var i=0; i <loop; i++)
	{
		if(this.systemCodeList[i].name == systemCode)
			return i;
	}
	return null;
}
DrillToken.prototype.getTokens=function()
{
	var api = CONST_GETTOKENS + "?"+ this.pdl + "&" + this.systemCode + "&OUT=XML";
	var getTokensXML = this.portalWnd.httpRequest(api,null,null,"text/xml", false);
	
	var msg="Error calling:\n"+api;
	if (this.portalWnd.oError.isErrorResponse(getTokensXML,true,true,false,msg,window))
		return null;
			
	var oDS = this.portalWnd.oError.getDSObject();
	var tokenAry = new Array();	
	var tokenXml = oDS.getElementsByTagName("TOKEN");
	var loop = tokenXml.length;
	var j = 0;
	
	for (var i=0; i < loop; i++)
	{
		var type = tokenXml[i].getAttribute("type");
		var name = tokenXml[i].getAttribute("name")
		var title = tokenXml[i].getAttribute("title");
		
		var oToken = new Object();
		oToken.type = type;
		oToken.name = name;
		oToken.title = title;
		
		if(!this.filter || this.filter == type.toUpperCase())
		{
			tokenAry[j] = oToken;
			j++;
		}
	}
	return tokenAry;
}
DrillToken.prototype.callBack=function(token,title)
{
	title = !title ? "" : title;
	
	if(!token)
		eval("jobsContentWin." + this.callbackFunc + "()");
	else
		eval("jobsContentWin." + this.callbackFunc + "(\""+ token + "\",\"" + title + "\")")
}
DrillToken.prototype.close=function()
{
	if(this.isModal)
		clearCallBackPrms();
	else
		eval("jobsContentWin." + this.callbackFunc + "()")
}

function setCallBackPrms(cntWin, callBackFunc)
{	
	jobsContentWin	 = cntWin;
	jobsCallBackFunc = callBackFunc;
}
function callCallBackPrms()
{
	try	{
		eval("jobsContentWin." + jobsCallBackFunc + "()");
	} catch (e)	{}

	clearCallBackPrms();
	oJob = null;
}		
function clearCallBackPrms()
{
	jobsContentWin	 = null;
	jobsCallBackFunc = null;
}

function useDrillFrame(frmSrc, cntWin, callBackFunc)
{	
	setCallBackPrms(cntWin, callBackFunc);
	with (lawsonPortal)
	{
		toolbar.clear();
		if (drill.maximized)
			drill.maximize();
		drill.drillContainer;
		drill.mode								= "erpReporting";
		drill.drillFrame.src					= frmSrc;
		drill.drillContainer.style.visibility	= "visible";
		drill.drillContainer.style.display		= "block";
	}
}

function hideDrillFrame()
{
	if (lawsonPortal.drill.mode)
	{
		with (lawsonPortal)
		{
			toolbar.clear();
			drill.mode								= "";
			drill.drillFrame.src					= lawsonPortal.path + "/blank.htm";
			drill.drillContainer.style.visibility	= "hidden";
			drill.drillContainer.style.display		= "none";
			drill.close();
		}
	
	callCallBackPrms();
	}
}
function JobPrintFilesObj()
{
	this.userName="";
	this.caller = "";
	this.viewFormat="";
	this.selectedPrintFile=0;
	this.jobOwner="";
	this.printFiles	= new Array();
}

JobPrintFilesObj.prototype.addPrintFile = function(pdl,token,name,description,filePath,jobStep)
{
	var i=this.printFiles.length;
	var docItem=new Object();
	
	docItem.pdl=pdl
	docItem.token=token	
	docItem.name=name
	docItem.description=description	
	docItem.filePath=filePath
	docItem.jobStep=jobStep
		
	this.printFiles[i]=docItem;
}
function ListObj()
{
	this.length=0;
	this.members=new Array;
	this.sortIndex=new Array;
//	this.pageStart=0;
//	this.pageInterval=20;
//	this.sortColumn=null;
//	this.sortOrder=null;
//	this.currentRowNbr=0;
}
ListObj.prototype.addMember=function(obj)
{
	try{
		var i = this.length;
		
		try{		
			obj.listKey = i;
			obj.isMemberSelected = false;
			obj.isMemberCurrent = false;
		}catch(e){return false}
		
		this.members[i] = obj;
		this.length = this.members.length;
		
		i = this.sortIndex.length;
		this.sortIndex[i]=obj.listKey;
		return true;
	}catch(e){return false;}
}
ListObj.prototype.removeMember=function(key)
{
	try{
		for(var i=0;i<this.length;i++)
		{
			if(this.members[i].listKey == key)
			{
				this.members.splice(i,1);
				this.length = this.members.length;
				break;
			}
		}
		
		for(var i=0;i<this.sortIndex.length;i++)
		{
			if(this.sortIndex[i] == key)
			{
				this.sortIndex.splice(i,1);
				break;
			}
		}
		return true;
	}catch(e){return false;}
}
ListObj.prototype.getMember=function(keyVal)
{
	try{
		for(var i=0;i<this.length;i++)
		{
			if(this.members[i].listKey == keyVal)
				return this.members[i];
		}
		return null;
	}catch(e){return null;}
}
ListObj.prototype.getMemberByKey=function(keyFld,keyVal)
{
	try{
		var val="";
		
		for(var i=0;i<this.length;i++)
		{
			val = eval("this.members[i]."+keyFld);
			if(val==undefined )
				val = null;
			try{	
				if(val == keyVal)
					return this.members[i];
			}catch(e){}
		}
		return null;
	}catch(e){return null;}
}
ListObj.prototype.getMembersByKey=function(keyFld,keyVal)
{
	try{
		var val="";
		var retAry = new Array;
		var j = 0;
		
		for(var i=0;i<this.length;i++)
		{
			val = eval("this.members[i]."+keyFld);
			if(val==undefined)
				val = null;
			try{	
				if(val == keyVal)
				{
					retAry[j] = this.members[i];
					j++;
				}
			}catch(e){}
		}
		return retAry;
	}catch(e){return retAry;}
}
ListObj.prototype.getSubsetOfList=function(keyFld,keyVal)
{
	try{
		var val="";
		var retList = new ListObj();
		
		for(var i=0;i<this.length;i++)
		{
			val = eval("this.members[i]."+keyFld);
		
			if(val==undefined)
				val = null;
			try{	
				if(val == keyVal)
					retList.addMember(this.members[i]);
			}catch(e){}
		}
		return retList;
	}catch(e){return retList;}
}
ListObj.prototype.sortList=function(index,isDescending)
{
	try{
		var indexKey="";
		var tempAry = new Array;
		var retAry = new Array;
		var sortOrderAry = new Array;
		
		try{
			if(typeof(isDescending)=="boolean")
			{
				if(isDescending)	
					sortOrderAry[0]=true;
				else
					sortOrderAry[0]=false;
			}
			else
			{
				for(var i=0;i<isDescending.length;i++)
				{
					if(isDescending[i])	
						sortOrderAry[i]=true;
					else
						sortOrderAry[i]=false;	
				}
			}
		}catch(e){sortOrderAry[0]=false;}		
		
		for (var i=0; i < this.length; i++)
		{
			var sortCriteriaObj = new Object;
			sortCriteriaObj.indices = new Array;
			sortCriteriaObj.isDescending = sortOrderAry;
			sortCriteriaObj.key;
		
			if(typeof(index)=="string")
			{
				indexKey = eval("this.members[i]."+index);
				if(indexKey==undefined)
					indexKey = null;
				sortCriteriaObj.indices[0]=indexKey;	
			}
			else
			{
				for(var j=0;j<index.length;j++)
				{
					indexKey = eval("this.members[i]."+index[j]);
					if(indexKey==undefined)
						indexKey = null;
					sortCriteriaObj.indices[j]=indexKey;	
				}
			}					
			sortCriteriaObj.key = this.members[i].listKey;	
			tempAry[i] = sortCriteriaObj;
		}	
	
		tempAry.sort(this.sortLogic);

		for (var i=0;i<tempAry.length;i++)
		{
			retAry[i]=tempAry[i].key;	
		}
	
		this.sortIndex = retAry;
		return true;
	}catch(e){return false;}
}
ListObj.prototype.sortLogic= function(criteriaObj1, criteriaObj2)
{
	try{
		var arg1=criteriaObj1.indices[0];
		var arg2=criteriaObj2.indices[0];
		var re=new RegExp("\\D","g");
		var nbrOfSorts=criteriaObj1.indices.length;
		
		if(!re.test(arg1) && !re.test(arg2))
		{
			arg1 = parseInt(arg1);
			arg2 = parseInt(arg2);
		}
		else
		{
			arg1 = arg1.toUpperCase();
			arg2 = arg2.toUpperCase();
		}

		if(arg1 > arg2)
			return criteriaObj1.isDescending[0]?-1:1;
		if(arg1 < arg2)
			return criteriaObj1.isDescending[0]?1:-1;
			
		if(nbrOfSorts>1)
		{
			for(var i = 1;i<criteriaObj1.indices.length; i++)
			{
				arg1=criteriaObj1.indices[i];
				arg2=criteriaObj2.indices[i];
		
				if(!re.test(arg1) && !re.test(arg2))
				{
					arg1 = parseInt(arg1);
					arg2 = parseInt(arg2);
				}
		
				if(arg1 > arg2)
					return criteriaObj1.isDescending[i]?-1:1;
				if(arg1 < arg2)
					return criteriaObj1.isDescending[i]?1:-1;
			}
		}			
	}catch(e){}	
	return 0;
}
//-----------------------------------------------------------------------------
function getDefaultViewFormat()
{
	try {
		switch(oUserProfile.getPreference("reportformat")) 
		{
			case "3": return "LSR";
			case "2": return "textView";
			case "1": return "pdfView";
			default: return "pdfView";
		}
	} catch(e) {}
	return "pdfView";
}
//-----------------------------------------------------------------------------
function getJobURL(TKN,bNewWin)
{
	if (typeof(bNewWin) != "boolean")
		bNewWin=false;
	var tkn=TKN.split("=")
	var url="";
	switch (tkn[1])
	{
	case " JL ":
		// jobs & reports
		url = bNewWin
			? "reports/joblist.htm"
			: lawsonPortal.path+"/reports/joblist.htm";
		break;

	case " J ":
		// job scheduler
		url = bNewWin
			? "reports/jobschedule.htm"
			: lawsonPortal.path+"/reports/jobschedule.htm";
		break;
	case " M ":
		// print manager
		url = bNewWin
			? "reports/printfiles.htm?"
			: lawsonPortal.path+"/reports/printfiles.htm?";
		break;
	}
	return url;
}
//-----------------------------------------------------------------------------
function isJobFC(fc)
{
	switch (fc)
	{
	case " JD ":
	case " JL ":
	case " J ":
	case " M ":
	case " R ":
	case " S ":
		return true;
		break;
	default:
		return false;
		break;
	}
}
//-----------------------------------------------------------------------------
function isJobLink(action)
{
	action=action.toLowerCase();
	if (action.indexOf("gojobdefintion")==0)
		return true;
	else if (action.indexOf("gojoblist")==0)
		return true;
	else if (action.indexOf("gojobschedule")==0)
		return true;
	else if (action.indexOf("goprintfiles")==0)
		return true;
	else if (action.indexOf("lawformjoblink")==0)
		return true;
	return false;
}
//-----------------------------------------------------------------------------
function getJobLink(action)
{
	var theAction=action.toLowerCase();
	var jobLink=lawsonPortal.path+"/index.htm?_URL=";
	if (theAction.indexOf("gojobdefintion")==0)
		jobLink += ("reports/jobdef.htm?&_NOCACHE=" + new Date().getTime());
	else if (theAction.indexOf("gojoblist")==0)
		jobLink += getJobURL("FC= JL ",true);
	else if(theAction.indexOf("gojobschedule")==0)
		jobLink += getJobURL("FC= J ",true);
	else if (theAction.indexOf("goprintfiles")==0)	  
		jobLink += getJobURL("FC= M ",true);
	else if (theAction.indexOf("lawformjoblink")==0)
	{
		var tkn=action.substr(14);
		tkn=tkn.substr(0,tkn.length-2);
		jobLink += getJobURL(tkn,true);
	}
	else jobLink="";

	return jobLink;
}
//-----------------------------------------------------------------------------
function getGoPrintFilesURL(userName,jobName,pageKey)
{
	var switchURL=portalWnd.lawsonPortal.path + "/reports/printfiles.htm?_NOCACHE=";
	switchURL+=(new Date().getTime());
	if (typeof(userName) != "undefined")
		switchURL+=("&_LOGIN=" + userName);
	if (typeof(jobName) != "undefined")
		switchURL+=("&_JOBNAME=" + jobName);
	if (typeof(pageKey) != "undefined")
		switchURL+=("&_PAGEKEY=" + pageKey);
	return switchURL;
}
//-----------------------------------------------------------------------------
function getGoJobScheduleURL(userName,filter)
{
	var switchURL=portalWnd.lawsonPortal.path + "/reports/jobschedule.htm?_NOCACHE=";
	switchURL+=(new Date().getTime());
	if (typeof(userName) != "undefined")
		switchURL+=("&_LOGIN=" + userName);
	if (typeof(filter) != "undefined")
		switchURL+=("&_FILTER=" + filter);
	return switchURL;
}
//-----------------------------------------------------------------------------
function getGoJobListURL(userName,jobName,pageKey)
{
	var switchURL=portalWnd.lawsonPortal.path + "/reports/joblist.htm?_NOCACHE=";
	switchURL+=(new Date().getTime());
	if (typeof(userName) != "undefined")
		switchURL+=("&_LOGIN=" + userName);
	if (typeof(jobName) != "undefined")
		switchURL+=("&_JOBNAME=" + jobName);
	if (typeof(pageKey) != "undefined")
		switchURL+=("&_PAGEKEY=" + pageKey);
	return switchURL;
}
//-----------------------------------------------------------------------------
function getGoJobDefURL(jobName)
{
	var switchURL=portalWnd.lawsonPortal.path + "/reports/jobdef.htm?_NOCACHE=";
	switchURL+=(new Date().getTime());
	if (typeof(jobName) != "undefined")
		switchURL+=("&_JOBNAME=" + jobName);
	return switchURL;
}
//-----------------------------------------------------------------------------
function getParameterScreenURL()
{
	var switchURL=portalWnd.lawsonPortal.path + "/reports/actionframework.htm?_NOCACHE=";
	switchURL+=(new Date().getTime());
	return switchURL;
}

//-----------------------------------------------------------------------------
function createJobHK(jobname, username)
{
	jobname = (typeof(jobname) != "string" ? "" : jobname);
	username = (typeof(username) != "string" ? "" : username);
	
	var maxLenJobname = 10;

	while(maxLenJobname - jobname.length)
		jobname += " "

	return jobname + username
}
//-----------------------------------------------------------------------------
function getDomainName()
{
	try{
	
	var domainName = "";
	if (!portalWnd.lawsonPortal.browser.isIE)
		return domainName;

	if (typeof(ENVDOMAIN) != "undefined")
		domainName = ENVDOMAIN;

	return domainName;

	} catch(e){reportError(e)}		
}
