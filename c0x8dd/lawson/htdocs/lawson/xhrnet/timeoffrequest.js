// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/Attic/timeoffrequest.js,v 1.1.2.26 2014/02/12 23:38:24 brentd Exp $
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
var sysRules;
var dataObj;
var tranObj;
var appObj;
var pfObj;
var techVersion;
var httpRequest;
var commentsDialog;
var requestDialog;
var cancelDialog;
var deleteUrl = "/lawson/xhrnet/images/delete2.gif";
var commentsUrl = "/lawson/xhrnet/timeentry/Skins/Ocean/images/clipboard.gif";
var commentsExistUrl = "/lawson/xhrnet/timeentry/Skins/Ocean/images/clipboard2.gif";
var commentsExistHoverUrl = "/lawson/xhrnet/timeentry/Skins/Ocean/images/clipboardover2.gif";

function EmpDataObject()
{
	this.approverName = null;
	this.balances = [];
	this.timeOffRequests = [];
	this.leaveOfAbsenceRequests = [];
	this.allRequests = [];
	this.sortField = null;
	this.sortField2 = null;
	this.sortField3 = null;
	this.sortDir = null;
	this.reqSortField = null;
	this.reqSortDir = null;
	this.reasons = null;
	// dirty object tracks which pieces of data need to be refresh following an update
	this.dirty = {"balances":true,"timeOffRequests":true,"leaveOfAbsenceRequests":true};
	this.timeOffRequestType = null; //"submitted", "pending", "cancelled", "rejected", "leaveofabsence"
	this.timeOffRequestTypeDesc = null;
	this.empNbr = 0;
	this.empName = null;
	this.requestTypeItems = null;
};

// returns 2D array that contains all time off requests for each plan
EmpDataObject.prototype.getTimeOffRequestsByPlan = function(requests)
{
	this.sortField = "plan";
	this.sortField2 = "employee_group";
	this.sortField3 = "position";
	requests = requests || this.timeOffRequests;
	requests.sort(sortByAscField3);
	var len = requests.length;
	var requestsByPlan = [];
	var plan, group, position;
	var i = 0;
	while (i < len)
	{
		var j = 1;
		plan = ((i+j) < len) ? requests[i+j].plan : null;
		group = ((i+j) < len) ? requests[i+j].employee_group : null;
		position = ((i+j) < len) ? requests[i+j].position : null;
		var len2 = requestsByPlan.length;
		requestsByPlan[len2] = [];
		requestsByPlan[len2][0] = requests[i];
		while (plan != null && group != null && position != null && requests[i].plan == plan && requests[i].employee_group == group && requests[i].position == position)
		{
			var len3 = requestsByPlan[len2].length;
			requestsByPlan[len2][len3] = requests[i+j];
			j++;
			plan = ((i+j) < len) ? requests[i+j].plan : null;
			group = ((i+j) < len) ? requests[i+j].employee_group : null;
			position = ((i+j) < len) ? requests[i+j].position : null;
		}
		i = i + j;
	}
	return requestsByPlan;
};

// returns array that contains total time off hours requested for each date
EmpDataObject.prototype.getTimeOffRequestHoursByDate = function()
{
	this.sortField = "leave_date";
	var requests = this.timeOffRequests.sort(sortByDescField);
	var len = requests.length;
	var requestsByDate = [];
	for (var i=0; i<len; i++)
	{
		var idx = requestsByDate.length;
		var lastDate = (idx > 0) ? Number(formjsDate(formatDME(requestsByDate[idx-1].date))) : null;
		var curDate = Number(formjsDate(formatDME(requests[i].leave_date)));
		if (lastDate != null && curDate == lastDate)
			requestsByDate[idx-1].hours += Number(requests[i].hours);
		else
			requestsByDate[idx] = {date:requests[i].leave_date, hours:requests[i].hours};
	}	
	return requestsByDate;
};

// checks if daily hours limit will be exceeded by a time off request
EmpDataObject.prototype.checkTimeOffRequestHoursLimit = function(hours, beginDate, endDate)
{
	var error = (Number(hours) > sysRules.max_hours_per_day) ? true : false;
	var bDate = Number(formjsDate(formatDME(beginDate)));
	var eDate = Number(formjsDate(formatDME(endDate)));
	var errorDate = null;
	if (!error)
	{
		var dayRequests = this.getTimeOffRequestHoursByDate();
		var len = dayRequests.length;
		for (var i=0; i<len; i++)
		{
			var dayDate = Number(formjsDate(formatDME(dayRequests[i].date)));
			if (bDate <= dayDate && dayDate <= eDate)
			{
				if ((Number(dayRequests[i].hours) + Number(hours)) > sysRules.max_hours_per_day)
				{
					error = true;
					errorDate = dayRequests[i].date;
					break;
				}
			}
			else if (dayDate > eDate)
				break;
		}
	}
	else
		errorDate = beginDate;
	// only return errorDate if this is a range
	if (errorDate && bDate == eDate)
		errorDate = null;
	return [error, errorDate];
};

// gets balance record for a time off request
EmpDataObject.prototype.getPlanBalance = function(request)
{
	if (!request)
		return null;
	var len = this.balances.length;
	var balRec = null;
	for (var i=0; i<len; i++)
	{
		if (request.plan == this.balances[i].plan && request.employee_group == this.balances[i].employee_group && request.position == this.balances[i].position)
		{	
			balRec = this.balances[i];
			break;
		}	
	}
	return balRec;
};

function AppObject()
{
};

AppObject.parseNbr = function(nbr)
{
	if (typeof(nbr) == "undefined" || nbr == null)
		return 0;
	var nbrStr = '' + nbr;
	nbrStr = nbrStr.replace(/,/g, "");
	nbrStr = trimString(nbrStr);
	if (nbrStr.charAt(nbrStr.length-1) == '-')
		nbrStr = '-' + nbrStr.substring(0, nbrStr.length-1);	
	var nbr = Number(nbrStr);
	if (isNaN(nbr))
		nbr = 0;
	return nbr;
};

AppObject.roundNbr = function(nbr, dec)
{
	dec = (typeof(dec) == "undefined" || dec == null || isNaN(Number(dec))) ? 2 : Number(dec);
	var nbrStr = '' + AppObject.parseNbr(nbr);
	var nbrDec = Number(nbrStr);
	nbrDec = nbrDec.toFixed(dec);
	return nbrDec;
};

AppObject.truncateNbr = function(nbr, dec) 
{
	dec = (typeof(dec) == "undefined" || dec == null || isNaN(Number(dec))) ? 2 : Number(dec);
	var nbrStr = '' + AppObject.parseNbr(nbr);
	var nbrDec = Number(nbrStr); 
	nbrDec = nbrDec.toFixed(dec+1) + '';
	return nbrDec.substring(0, nbrDec.length - 1); 
};

AppObject.validDate = function(dateElm)
{
	var dteParams = dateIsValid(dateElm.value);
	var dte = dteParams[0];
	var errMsg = dteParams[1];
	if (dte)
		dateElm.value = dte;
	return ((errMsg) ? false : true);		
};

AppObject.dateInCompareFormat = function(val)
{
	if (val == "" || typeof(val) == "number" || val.indexOf(authUser.date_separator) == -1)
		return val;
	try 
	{
		return formjsDate(formatDME(val));
	}
	catch (e) 
	{
		return val;
	}
};

var empData = new EmpDataObject();

function checkAppVersion()
{
	if (!appObj)
		appObj = new AppVersionObject(authUser.prodline, "HR");
	// if you call getAppVersion() right away and the IOS object isn't set up yet,
	// then the code will be trying to load the sso.js file, and your call for
	// the appversion will complete before the ios version is set
	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
		setTimeout("checkAppVersion()", 10);
		return;
	}
	if (!appObj || appObj.getAppVersion() == null || appObj.getAppVersion().toString() < "10.00.00")
	{
		removeWaitAlert();
		seaAlert(getSeaPhrase("HR_APP_VER_ERR","SEA",['10.0.0']), getSeaPhrase("CONTACT_HR","ESS"));
		return;
	}
	getSystemRules();
}

function getSystemRules(nextFunc)
{
	var checkSystemRules = function()
	{
		if (dataObj.getNbrRecs() == 0)
		{
			removeWaitAlert();
			seaAlert(getSeaPhrase("NO_LEAVE_RULES","SEA")+" "+authUser.company+".", getSeaPhrase("CONTACT_HR","ESS"));
			return;
		}
		var sysRec = dataObj.getRecord(0);
		var rulesAry = sysRec.getFieldValue("alphadata1");
		var maxHoursPerDay = AppObject.parseNbr(sysRec.getFieldValue("numeric1"));
		if (maxHoursPerDay == 0)
			maxHoursPerDay = 24;
		var fullDayHours = AppObject.parseNbr(sysRec.getFieldValue("numeric2"));
		if (fullDayHours == 0)
			fullDayHours = 8;
		sysRules = {
			"request_type" : AppObject.parseNbr(rulesAry[0]),
			"notification_required" : AppObject.parseNbr(rulesAry[1]),
			"create_time_record" : AppObject.parseNbr(rulesAry[2]),
			"leave_status_code" : sysRec.getFieldValue("alphadata3"),
			"leave_action_code" : sysRec.getFieldValue("alphadata4"),
			"max_hours_per_day" : maxHoursPerDay,
			"full_day_hours" : fullDayHours
		};			
		getData();
	};
	techVersion = (iosHandler && iosHandler.getIOSVersionNumber() >= "09.00.00") ? DataObject.TECHNOLOGY_900 : DataObject.TECHNOLOGY_803;
	httpRequest = (typeof(SSORequest) == "function") ? SSORequest : SEARequest;
	var rulesCompany = "" + Number(authUser.company);
	for (var i=rulesCompany.length; i<4; i++)
		rulesCompany = "0" + rulesCompany;
	dataObj = new DataObject(window, techVersion, httpRequest, checkSystemRules);
	dataObj.setEncoding(authUser.encoding);
	dataObj.setParameter("PROD", authUser.prodline);
	dataObj.setParameter("FILE", "sysrules");
	dataObj.setParameter("INDEX", "syrset1");
	dataObj.setParameter("FIELD", "alphadata1;alphadata3;alphadata4;numeric1;numeric2");
	dataObj.setParameter("KEY", "TIMEOFFREQUEST=LP=ES031="+rulesCompany);
	dataObj.setParameter("MAX", "1");
	dataObj.callData();
}

function getEmployeeData()
{
	if (empData.dirty)
	{
		if (empData.dirty["balances"])
		{
			getEmployeeBalances();
			return;
		}
		else if (empData.dirty["timeOffRequests"] || empData.dirty["leaveOfAbsenceRequests"])
		{
			getEmployeeRequests();
			return;
		}
	}
	displayEmployeeData();
}

function getEmployeeBalances()
{
	empData.balances = [];
	var storeBalances = function()
	{
		var msgNbr = tranObj.getMsgNbr();
		var msg = tranObj.getMessage();
		if (msgNbr == TransactionObject.SUCCESS_MSGNBR)
		{
			var i = 0;
			var plan = tranObj.getValue("TEM-PLANr" + i);
			while (plan != null)
			{
				empData.balances[empData.balances.length] = {
					"plan" : plan,
					"desc" : tranObj.getValue("PLAN-DESCr" + i),
					"available_balance" : AppObject.parseNbr(tranObj.getValue("WEB-AVAILABLE-BALr" + i)),
					"pending_requests" : AppObject.parseNbr(tranObj.getValue("WEB-PENDING-REQSr" + i)),
					"projected_balance" : AppObject.parseNbr(tranObj.getValue("WEB-PROJECTED-BALr" + i)),
					"negative_balance" : AppObject.parseNbr(tranObj.getValue("WEB-NEGATIVE-BALr" + i)), //set up on LP03.5
					"usage_service_code" : tranObj.getValue("USE-SERVICE-CODEr" + i),
					"master_end_date" : tranObj.getValue("TEM-MSTR-ENDr" + i),
					"employee_group" : tranObj.getValue("TEM-EMPLOYEE-GROUPr" + i) || "",
					"position" : tranObj.getValue("TEM-POSITIONr" + i) || ""
				};
				i++;
				plan = tranObj.getValue("TEM-PLANr" + i);
			}
			// page down functionality not considered in design
			empData.approverName = tranObj.getValue("HSU-FULL-NAME");
			empData.sortField = "desc";
			empData.balances.sort(sortByAscField);
			getEmployeeRequests();
		}
		else
		{
			removeWaitAlert();
			if (msg)
				seaAlert(msg, getSeaPhrase("CONTACT_HR","SEA"), null, "error");
		}		
	};
	tranObj = new TransactionObject(window, techVersion, httpRequest, storeBalances);
	tranObj.setEncoding(authUser.encoding);
	tranObj.setParameter("_PDL", authUser.prodline);
	tranObj.setParameter("_TKN", "HS19.1");
	tranObj.setParameter("FC", "I");
	tranObj.setParameter("_LFN", "TRUE");
	tranObj.setParameter("_EVT", "ADD");
	tranObj.setParameter("_RTN", "DATA");
	tranObj.setParameter("_TDS", "Ignore");
	if (techVersion == TransactionObject.TECHNOLOGY_900)
		tranObj.setParameter("_DTLROWS", "FALSE");
	tranObj.setParameter("COMPANY", String(Number(authUser.company)));
	tranObj.setParameter("EMPLOYEE", String(Number(empData.empNbr)));
	tranObj.callTransaction();
}

function getEmployeeRequests()
{
	if (empData.dirty)
	{
		if ((sysRules.request_type == 1 || sysRules.request_type == 3) && empData.dirty["timeOffRequests"])
		{
			getTimeOffRequests();
			return;
		}
		else if ((sysRules.request_type == 2 || sysRules.request_type == 3) && empData.dirty["leaveOfAbsenceRequests"])
		{
			getLeaveOfAbsenceRequests();
			return;
		}
	}
	displayEmployeeData();
}

function getTimeOffRequests()
{
	empData.timeOffRequests = [];
	var storeTimeOffRequests = function()
	{
		var nbrRecs = dataObj.getNbrRecs();
		for (var j=0; j<nbrRecs; j++)
		{
			var record = dataObj.getRecord(j);
			var recIndex = empData.timeOffRequests.length;
			empData.timeOffRequests[recIndex] = {
				"rec_type" : "PTO",
				"seq_nbr": AppObject.parseNbr(record.getFieldValue("seq-number")),
				"plan" : record.getFieldValue("plan"),
				"desc" : record.getFieldValue("taplan.description"),
				"status" : AppObject.parseNbr(record.getFieldValue("status")),
				"status_xlt" : record.getFieldValue("status,xlt"),
				"leave_date" : record.getFieldValue("leave-date"),
				"return_date" : "", // return date is only valid for leave of absence requests
				"hours" : AppObject.parseNbr(record.getFieldValue("hours")),
				"position" : record.getFieldValue("position") || "",
				"employee_group" : record.getFieldValue("employee-group") || "",
				"comments" : record.getFieldValue("memo"),
				"selected" : false // has manager selected this request?
			};
		}
		if (dataObj.getNextCall())
		{
			dataObj.callNext();
			return;
		}	
		if (empData.dirty)
		{
			if ((sysRules.request_type == 2 || sysRules.request_type == 3) && empData.dirty["leaveOfAbsenceRequests"])
			{
				getLeaveOfAbsenceRequests();
				return;
			}
		}
		displayEmployeeData();
	};
	dataObj = new DataObject(window, techVersion, httpRequest, storeTimeOffRequests);
	dataObj.setEncoding(authUser.encoding);
	dataObj.setParameter("PROD", authUser.prodline);
	dataObj.setParameter("FILE", "lppendreq");
	switch (empData.timeOffRequestType)
	{
		case "submitted":
			dataObj.setParameter("INDEX", "lpqset1");
			dataObj.setParameter("COND", "submitted");
			break;
		case "pending":
			dataObj.setParameter("INDEX", "lpqset3");
			break;
		case "cancelled":
			dataObj.setParameter("INDEX", "lpqset1");
			dataObj.setParameter("COND", "cancelled");
			break;
		case "rejected":
			dataObj.setParameter("INDEX", "lpqset1");
			dataObj.setParameter("COND", "rejected");
			break;
		default: // "submitted" or "approved"
			dataObj.setParameter("INDEX", "lpqset7");
			break;
	}
	dataObj.setParameter("FIELD", "seq-number;plan;taplan.description;employee-group;position;status;status,xlt;leave-date;hours;memo");
	dataObj.setParameter("KEY", String(Number(authUser.company)) + "=" + String(Number(empData.empNbr)));
	dataObj.setParameter("MAX", "500");
	dataObj.setParameter("OTMMAX", "1");
	dataObj.callData();
}

function getLeaveOfAbsenceRequests()
{
	empData.leaveOfAbsenceRequests = [];
	var storeLeaveOfAbsenceRequests = function()
	{
		var nbrRecs = dataObj.getNbrRecs();
		for (var j=0; j<nbrRecs; j++)
		{
			var record = dataObj.getRecord(j);
			var recIndex = empData.leaveOfAbsenceRequests.length;
			empData.leaveOfAbsenceRequests[recIndex] = {
				"rec_type" : "LOA",
				"seq_nbr" : AppObject.parseNbr(record.getFieldValue("seq-nbr")),
				"plan" : record.getFieldValue("leave-reason"),
				"desc" : record.getFieldValue("leave-reason.description"),
				"status" : record.getFieldValue("status"),
				"status_xlt" : record.getFieldValue("leave-status.description"),
				"leave_date" : record.getFieldValue("begin-date"),
				"return_date" : record.getFieldValue("expect-return"),
				"hours" : "", // hours is only valid for paid time off requests
				"comments" : record.getFieldValue("memo"),
				"selected" : false // has manager selected this request?
			}
		}
		if (dataObj.getNextCall())
		{
			dataObj.callNext();
			return;
		}
		displayEmployeeData();
	};

	dataObj = new DataObject(window, techVersion, httpRequest, storeLeaveOfAbsenceRequests);
	dataObj.setEncoding(authUser.encoding);
	dataObj.setParameter("PROD", authUser.prodline);
	dataObj.setParameter("FILE", "lpempleave");
	dataObj.setParameter("INDEX", "lelset1");
	dataObj.setParameter("FIELD", "seq-nbr;leave-reason;leave-reason.description;status;leave-status.description;begin-date;expect-return;memo");
	dataObj.setParameter("KEY", String(Number(authUser.company)) + "=" + String(Number(empData.empNbr)));
	dataObj.setParameter("SELECT", "end-date=00000000|end-date>"+ymdtoday);
	dataObj.setParameter("MAX", "500");
	dataObj.setParameter("OTMMAX", "1");
	dataObj.callData();
}

function commentIconHover(hover, i)
{
	var commentsImg = self.main.document.getElementById("comment"+i);
	if (hover)
		commentsImg.src = (commentsImg.src.indexOf(commentsExistUrl)>=0) ? commentsExistHoverUrl : commentsUrl;
	else
		commentsImg.src = (commentsImg.src.indexOf(commentsExistHoverUrl)>=0) ? commentsExistUrl : commentsUrl;
}

function refreshCommentIcon(recIndex)
{
	var request = empData.allRequests[recIndex];
	var commentIcon = self.main.document.getElementById("comment"+recIndex);
	if (commentIcon)
	{
		if (NonSpace(request.comments) > 0)
			commentIcon.src = commentIcon.getAttribute("active_icon");
		else
			commentIcon.src = commentIcon.getAttribute("default_icon");
		styleElement(commentIcon);
	}
}

function updateComments(action, cmtsWin, recIndex)
{
	var request = empData.allRequests[recIndex];
	var cmtForm = cmtsWin.document.forms["requestComments"];
	var cmtText = cmtForm.elements["comments"].value;
	if (action == "D")
		cmtText = "";
	if (request.rec_type == "LOA")
	{
		var checkLP51Response = function()
		{
			var msgNbr = tranObj.getMsgNbr();
			var msg = tranObj.getMessage();	
			if (msgNbr == TransactionObject.SUCCESS_MSGNBR)
			{
				removeWaitAlert();
				request.comments = tranObj.getValue("LEL-MEMO");
				seaPageMessage(getSeaPhrase("COMMENTS_UPDATED","SEA"), "", null, "info", null, true, getSeaPhrase("UPDATE_COMPLETE","ESS"), true);
				refreshCommentIcon(recIndex);
			}	
			else
			{
				setTimeout(removeWaitAlert, 10);
				if (msg)
					seaAlert(msg, getSeaPhrase("CONTACT_HR","SEA"), null, "error");
			}
		};			
		var callLP51 = function()
		{
			tranObj = new TransactionObject(window, techVersion, httpRequest, checkLP51Response);
			tranObj.setEncoding(authUser.encoding);
			tranObj.setParameter("_PDL", authUser.prodline);
			tranObj.setParameter("_TKN", "LP51.1");
			tranObj.setParameter("_LFN", "TRUE");
			tranObj.setParameter("_EVT", "CHG");
			tranObj.setParameter("_RTN", "DATA");
			tranObj.setParameter("_TDS", "Ignore");
			if (techVersion == TransactionObject.TECHNOLOGY_900)
				tranObj.setParameter("_DTLROWS", "FALSE");
			tranObj.setParameter("LEL-COMPANY", String(Number(authUser.company)));
			tranObj.setParameter("LEL-EMPLOYEE", String(Number(empData.empNbr)));
			tranObj.setParameter("LEL-SEQ-NBR", String(Number(Number(request.seq_nbr))));
			tranObj.setParameter("FC", "C");
			tranObj.setParameter("LEL-MEMO", String(cmtText));
			tranObj.setParameter("LEL-USER-ID", "W" + authUser.employee);
			tranObj.callTransaction();				
		};
		showWaitAlert(getSeaPhrase("UPDATING_COMMENTS","SEA"), callLP51);		
	}
	else
	{
		var checkHS19Response = function()
		{
			var msgNbr = tranObj.getMsgNbr();
			var msg = tranObj.getMessage();	
			if (msgNbr == TransactionObject.SUCCESS_MSGNBR)
			{
				removeWaitAlert();
				request.comments = tranObj.getValue("LPQ-MEMOr0");
				seaPageMessage(getSeaPhrase("COMMENTS_UPDATED","SEA"), "", null, "info", null, true, getSeaPhrase("UPDATE_COMPLETE","ESS"), true);
				refreshCommentIcon(recIndex);
			}	
			else
			{
				setTimeout(removeWaitAlert, 10);
				if (msg)
					seaAlert(msg, getSeaPhrase("CONTACT_HR","SEA"), msg, null, "error");
			}			
		};		
		var callHS19 = function()
		{	
			tranObj = new TransactionObject(window, techVersion, httpRequest, checkHS19Response);
			tranObj.setEncoding(authUser.encoding);
			tranObj.setParameter("_PDL", authUser.prodline);
			tranObj.setParameter("_TKN", "HS19.2");
			tranObj.setParameter("_LFN", "TRUE");
			tranObj.setParameter("_EVT", "CHG");
			tranObj.setParameter("_RTN", "DATA");
			tranObj.setParameter("_TDS", "Ignore");
			if (techVersion == TransactionObject.TECHNOLOGY_900)
				tranObj.setParameter("_DTLROWS", "FALSE");
			tranObj.setParameter("FC", "C");
			tranObj.setParameter("COMPANY", String(Number(authUser.company)));
			tranObj.setParameter("EMPLOYEE", String(Number(empData.empNbr)));	
			tranObj.setParameter("TEM-PLAN", request.plan);
			tranObj.setParameter("TEM-EMPLOYEE-GROUP", request.employee_group);
			tranObj.setParameter("TEM-POSITION", request.position);
			tranObj.setParameter("WEB-UPDATE", "Y");
			if (typeof(mgrData) != "undefined")
				tranObj.setParameter("LPQ-MGR-USER-ID", "W" + authUser.employee);
			else
				tranObj.setParameter("LPQ-EMP-USER-ID", "W" + authUser.employee);
			//seq nbr, hours, leave date, status, and memo all need to be passed on a change
			tranObj.setParameter("LINE-FCr0", "C");
			tranObj.setParameter("LPQ-SEQ-NUMBERr0", String(Number(request.seq_nbr)));
			tranObj.setParameter("LPQ-HOURSr0", String(Number(request.hours)));			
			tranObj.setParameter("LPQ-LEAVE-DATEr0", formjsDate(formatDME(request.leave_date)));
			tranObj.setParameter("LPQ-STATUSr0", String(Number(request.status)));			
			tranObj.setParameter("LPQ-MEMOr0", String(cmtText));
			tranObj.callTransaction();
		};
		showWaitAlert(getSeaPhrase("UPDATING_COMMENTS","SEA"), callHS19);		
	}	
}

function commentsActionTaken(msgWin, recIndex)
{
	var request = empData.allRequests[recIndex];
	var action = (NonSpace(request.comments) > 0) ? "C" : "A";
	switch (msgWin.returnValue)
	{
		case "update": //update
		case "yes":
		case "ok":
			updateComments(action, msgWin, recIndex);
			break;
		case "delete": //delete
		case "no":
			updateComments("D", msgWin, recIndex);
			break;
		case "cancel": //cancel
		case "close":
			break;
	}
}

function displayRequestComments(recIndex)
{
	var request = empData.allRequests[recIndex];
	var cmtText = (NonSpace(request.comments) > 0) ? String(request.comments) : "";
	createDialog("commentsDialog");
	commentsDialog.translationAry = new Array();
	commentsDialog.translationAry["btnYes"] = "UPDATE";
	commentsDialog.translationAry["btnNo"] = "DELETE";
	commentsDialog.translationAry["btnClear"] = "CLEAR";
	commentsDialog.translationAry["btnCancel"] = "CANCEL";
	commentsDialog.initDialog = function(wnd)
	{
		wnd = wnd || window;
		if (typeof(wnd["styler"]) == "undefined" || wnd.styler == null)
			wnd.stylerWnd = findStyler(true);
		if (!wnd.stylerWnd)
			return;
		if (this.styler == null)
		{
			this.styler = new wnd.stylerWnd.StylerBase();
			this.styler.showLDS = styler.showLDS;
			this.styler.showInfor = styler.showInfor;
			this.styler.showInfor3 = styler.showInfor3;
			if (this.pinned && typeof(parent.parent["SSORequest"]) != "undefined")
				this.styler.httpRequest = parent.parent.SSORequest;
			else if (typeof(wnd["SSORequest"]) != "undefined")
				this.styler.httpRequest = wnd.SSORequest;
		}
		wnd.styler = this.styler;
		if (!wnd.styler || (!wnd.styler.showInfor3 && !wnd.styler.showInfor && !wnd.styler.showLDS))
		{
			wnd.styler.loadEnableCssFile(wnd, "/lawson/xhrnet/ui/ui.css");
			var msgTable = wnd.document.getElementById("msgTable");
			msgTable.style.marginLeft = "auto";
			msgTable.style.marginRight = "auto";
		}
		var clearFunc = function()
		{
			wnd.document.forms["requestComments"].elements["comments"].value = '';
		}
		if (this.styler != null && this.styler.showInfor3)
		{
			this.setButtons([
			     {id: "update", name: "update", text: this.getPhrase("UPDATE"), click: null},
			     {id: "delete", name: "delete", text: this.getPhrase("DELETE"), click: null},
			     {id: "clear", name: "clear", text: this.getPhrase("CLEAR"), click: clearFunc},
			     {id: "cancel", name: "cancel", text: this.getPhrase("CANCEL"), click: null}
			]);
		}
		else
		{
			var btnClear = this.addButton("btnClear", "clear", "CLEAR", wnd, clearFunc);
			this.translateButton("btnClear", "CLEAR", wnd);
			wnd.accessKeyToBtn = new Array();
		}
	};
	var reqData = [request.desc,request.leave_date,AppObject.truncateNbr(request.hours,2)];
	var strHtml = '<div style="padding:5px;text-align:center"><form name="requestComments" onsubmit="return false;">'
	+ '<table border="0" cellspacing="0" cellpadding="0" style="margin-left:0px;width:auto" summary="'+getSeaPhrase("TSUM_81","SEA",reqData)+'">'
	+ '<caption class="offscreen">'+getSeaPhrase("TCAP_60","SEA",reqData)+'</caption>'
	+ '<tr><th scope="col" colspan="2"></th></tr>'
	+ '<tr><th scope="row" class="fieldlabelbold" nowrap="">'+getSeaPhrase("PLAN","ESS")+'</th><td class="plaintablecelldisplay">'+((request.desc)?request.desc:'&nbsp;')+'</td></tr>';
	if (request.rec_type == "LOA")
	{
		strHtml += '<tr><th scope="row" class="fieldlabelbold" nowrap="">'+getSeaPhrase("DATE","ESS")+'</th><td class="plaintablecelldisplay">'+((request.leave_date)?request.leave_date:'&nbsp;')+'</td></tr>'
		+ '<tr><th scope="row" class="fieldlabelbold" nowrap="">'+getSeaPhrase("RETURN_DATE","SEA")+'</th><td class="plaintablecelldisplay">'+((request.return_date)?request.return_date:'&nbsp;')+'</td></tr>';			
	}	
	else	
	{	
		strHtml += '<tr><th scope="row" class="fieldlabelbold" nowrap="">'+getSeaPhrase("DATE","ESS")+'</th><td class="plaintablecelldisplay">'+((request.leave_date)?request.leave_date:'&nbsp;')+'</td></tr>'
		+ '<tr><th scope="row" class="fieldlabelbold" nowrap="">'+getSeaPhrase("HOURS","ESS")+'</th><td class="plaintablecelldisplay">'+AppObject.truncateNbr(request.hours,2)+'</td></tr>';
	}
	strHtml += '<tr><th scope="row" class="fieldlabelbold" nowrap=""><label for="comments">'+getSeaPhrase("COMMENTS","ESS")+'</label></th><td class="plaintablecelldisplay" nowrap="">'
	+ '<input type="text" class="inputbox" style="width:auto;max-width:325px" id="comments" name="comments" size="60" maxlength="60" value="'+cmtText+'" styler="textbox"></td></tr>'
	if (typeof(mgrData) == "undefined")
	{
		strHtml += '<tr><th scope="row" class="fieldlabelbold" nowrap="">'+getSeaPhrase("APPROVER","SEA")+'</th>'
		+ '<td class="plaintablecelldisplay">'+((empData.approverName)?empData.approverName:'&nbsp;')+'</td></tr>';
	}
	strHtml += '</table></form></div>';
	var nextFunc = function(msgWin)
	{
		commentsActionTaken(msgWin, recIndex);
	};
	var actionReturn = commentsDialog.messageBox(strHtml, "yesnocancel", "none", window, false, "", nextFunc, null, false, getSeaPhrase("COMMENTS","ESS"));
	if (typeof(actionReturn) != "undefined" && typeof(actionReturn) != null)
		commentsActionTaken(actionReturn, recIndex);
}

function getSortField(obj, sortField)
{
	var name = obj[sortField];
	if (sortField == "leave_date" || sortField == "return_date")
		name = Number(formjsDate(formatDME(name)));
	else if (sortField == "hours")
		name = Number(name);
	return name;
}

function sortByAscField(obj1, obj2)
{
	var name1 = getSortField(obj1, empData.sortField);
	var name2 = getSortField(obj2, empData.sortField);
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function sortByDescField(obj1, obj2)
{
	var name1 = getSortField(obj1, empData.sortField);
	var name2 = getSortField(obj2, empData.sortField);
	if (name1 > name2)
		return -1;
	else if (name1 < name2)
		return 1;
	else
		return 0;
}

// ascending sort by three fields
function sortByAscField3(obj1, obj2)
{
	var firstFieldName1 = getSortField(obj1, empData.sortField);
	var firstFieldName2 = getSortField(obj2, empData.sortField);
	var secondFieldName1 = getSortField(obj1, empData.sortField2);
	var secondFieldName2 = getSortField(obj2, empData.sortField2);
	var thirdFieldName1 = getSortField(obj1, empData.sortField3);
	var thirdFieldName2 = getSortField(obj2, empData.sortField3);
	if (firstFieldName1 != firstFieldName2)
	{
		if (firstFieldName1 < firstFieldName2)
			return -1;
		else if (firstFieldName1 > firstFieldName2)
			return 1;
		else
			return 0;
	}
	else if (secondFieldName1 != secondFieldName2)
	{
		if (secondFieldName1 < secondFieldName2)
			return -1;
		else if (secondFieldName1 > secondFieldName2)
			return 1;
		else
			return 0;
	}
	else
	{
		if (thirdFieldName1 < thirdFieldName2)
			return -1;
		else if (thirdFieldName1 > thirdFieldName2)
			return 1;
		else
			return 0;
	}
}

function createDialog(dialogName)
{
	window[dialogName] = new DialogObject("/lawson/webappjs/", null, styler, true);
	window[dialogName].pinned = true;
	window[dialogName].getPhrase = function(phrase)
	{
		if (!phrase || (phrase.indexOf("<") != -1 && phrase.indexOf(">") != -1))
			return phrase;
		if (!userWnd && typeof(window["findAuthWnd"]) == "function")
			userWnd = findAuthWnd(true);
		if (userWnd && userWnd.getSeaPhrase)
		{
			var retStr = userWnd.getSeaPhrase(phrase.toUpperCase(), "ESS");
			if (retStr == "")
				retStr = userWnd.getSeaPhrase(phrase.toUpperCase(), "SEA");
			return (retStr != "") ? retStr : phrase;
		}
		else
			return phrase;
	}
	window[dialogName].styleDialog = function(wnd)
	{
		wnd = wnd || window;
		if (typeof(wnd["styler"]) == "undefined" || wnd.styler == null)
			wnd.stylerWnd = findStyler(true);
		if (!wnd.stylerWnd)
			return;
		if (this.styler == null)
		{
			this.styler = new wnd.stylerWnd.StylerBase();
			this.styler.showLDS = styler.showLDS;
			this.styler.showInfor = styler.showInfor;
			this.styler.showInfor3 = styler.showInfor3;
			if (this.pinned && typeof(parent.parent["SSORequest"]) != "undefined")
				this.styler.httpRequest = parent.parent.SSORequest;
			else if (typeof(wnd["SSORequest"]) != "undefined")
				this.styler.httpRequest = wnd.SSORequest;
		}
		wnd.styler = this.styler;
		wnd.StylerBase = wnd.stylerWnd.StylerBase;
		wnd.StylerEMSS = wnd.stylerWnd.StylerEMSS;
		wnd.StylerBase.webappjsURL = "/lawson/webappjs";		
		if (wnd.styler.showInfor3)
		{
			wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/infor3/css/emss/infor.css");
		}
		else
		{
			wnd.styler.loadJsFile(wnd, "Sizer", wnd.StylerBase.webappjsURL + "/javascript/objects/Sizer.js");
			wnd.styler.loadJsFile(wnd, "Calendar", wnd.StylerBase.webappjsURL + "/javascript/objects/Calendar.js");
		    if (typeof(wnd.calObj) == "undefined" || wnd.calObj == null)
		    {
		    	wnd.userWnd = wnd.stylerWnd.userWnd;
		    	wnd.StylerEMSS.initCalendarControl(wnd);
		        wnd.calObj.styler = wnd.styler;
		        wnd.calObj.openDirection = wnd.CalendarObject.OPEN_LEFT_DOWN;
		    }			
			if (wnd.styler.showInfor)
			{	
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/infor/css/emss/infor.css");
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/infor/css/base/inforTextbox.css");
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/infor/css/base/inforDropDown.css");
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/infor/css/base/inforLookup.css");
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/infor/css/base/inforRadioButton.css");
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/infor/css/base/inforDatePicker.css");
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/infor/css/base/inforHidden.css");
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/infor/css/base/inforStandardIconButtons.css");
			} 
			else if (wnd.styler.showLDS)
			{
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/lds/css/emss/lds.css");
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/lds/css/base/textbox.css");
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/lds/css/base/selectComboBoxElement.css");
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/lds/css/base/inputSelectElement.css");
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/lds/css/base/inputRadioButtonElement.css");
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/lds/css/base/inputCalendarElement.css");
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/lds/css/base/hiddenElement.css");
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/lds/css/base/asteriskElement.css");
			}
		}	
		if ((wnd.styler.showInfor || wnd.styler.showInfor3) && wnd.styler.textDir == "rtl")
		{
			var htmlObjs = wnd.styler.getLikeElements(wnd, "html");
			for (var i=0; i<htmlObjs.length; i++)
			    htmlObjs[i].setAttribute("dir", wnd.styler.textDir);
			var subDir = (wnd.styler.showInfor3) ? "/infor3" : "/infor";
			wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + subDir + "/css/base/inforRTL.css");
			if (navigator.userAgent.indexOf("MSIE") >= 0)
			{
				var botLeft = wnd.document.getElementById("bottomLeft");
				var botRight = wnd.document.getElementById("bottomRight");
				botLeft.style.marginLeft = "0px";
				botLeft.style.marginRight = "3px";
				botRight.style.marginLeft = "0px";
				botRight.style.marginRight = "-3px";
			}
		}
		wnd.styler.modifyDOM(wnd);
	}
	window[dialogName].translateButton = function(btn, phrase, wnd)
	{
		wnd = wnd || window;
		if (typeof(btn) == "string")
		{
			if (typeof(this.translationAry) != "undefined" && this.translationAry)
				phrase = this.translationAry[btn];
			btn = wnd.document.getElementById(btn);
		}
		else if (typeof(btn) == "object")
		{
			if (typeof(this.translationAry) != "undefined" && this.translationAry)
				phrase = this.translationAry[btn.getAttribute("id")];
		}
		if (!btn || !phrase)
			return;
		btn.value = this.getPhrase(phrase);
		if (btn.innerText != null)
			btn.innerText = btn.value;
		else if (btn.textContent != null)
			btn.textContent = btn.value;
		else
			btn.innerHTML = btn.value;
	}
}
