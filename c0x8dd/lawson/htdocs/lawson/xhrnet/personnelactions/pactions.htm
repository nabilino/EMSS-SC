<!DOCTYPE html>
<html lang="en">
<head>
<title>Personnel Actions</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width" />
<title>Personnel Actions</title>
<script type="text/javascript" src="/lawson/webappjs/data.js"></script>
<script type="text/javascript" src="/lawson/webappjs/transaction.js"></script>
<script type="text/javascript" src="/lawson/webappjs/common.js"></script>
<script type="text/javascript" src="/lawson/webappjs/commonHTTP.js"></script>
<script type="text/javascript" src="/lawson/webappjs/user.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/email.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/esscommon80.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/dr.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/prlockout.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/empinfo.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/xml/xmldateroutines.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/Transaction.js"></script>
<script src="/lawson/webappjs/javascript/objects/ProcessFlow.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/personnelactions/personnelactionsfiles/pactionslib.js"></script>
<script type="text/javascript">
var fromTask = (window.location.search)?unescape(window.location.search):"";
var empIndex = "";
var Rules = new Array();
var appObj;
var positionFldIndex = -1;
var salaryClassFldIndex = -1;
var payRateFldIndex = -1;
var gradeFldIndex = -1;
var stepFldIndex = -1;
//GDD 09/22/14  New variable
var actionName = "";

// DirectReports defined in dr.js
if (fromTask)
	empIndex = getVarFromString("index",fromTask);

if (empIndex && NonSpace(empIndex) != 0) 
{
	DirectReports = parent.emps;
	for (var i=0; i<parent.emps.length; i++) 
	{
		DirectReports[i].Code = parent.emps[i].employee;
		DirectReports[i].FullName = parent.emps[i].full_name;
	}
} 
else
	empIndex = -1;

function doAuthentication()
{
	authenticate("frameNm='jsreturn'|funcNm='AuthenticateFinished()'|sysenv=true|desiredEdit='EM'");
}

function AuthenticateFinished()
{
    stylePage();
    setWinTitle(getSeaPhrase("PACTIONS","ESS"));
	// to initialize fmttoday
	StoreDateRoutines();
	if (fromTask)
		parent.showWaitAlert(getSeaPhrase("ACTION_LOADING","ESS"), getLawsonApplicationVersion);
	else
		getLawsonApplicationVersion();
	fitToScreen();
}

function getLawsonApplicationVersion()
{
	if (!appObj)
		appObj = new AppVersionObject(authUser.prodline, "HR");
	// if you call getAppVersion() right away and the IOS object isn't set up yet,
	// then the code will be trying to load the sso.js file, and your call for
	// the appversion will complete before the ios version is set
	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
       	setTimeout("getLawsonApplicationVersion()", 10);
       	return;
	}
	initPersonnelActions();
}

function initPersonnelActions()
{
	if (empIndex == -1)
		Call_HS10(authUser.company, authUser.employee, "PERSONNEL", false);
	else
	{
	//GDD 09/22/14  force get actions for mods
	//	if (emssObjInstance.emssObj.filterSelect)
	//		paintEmployeeActionSelects();
	//	else
	//GDD end of change
			getActions();
	}
}

function sortByName(obj1, obj2)
{
	var name1 = obj1.LastName + ' ' + obj1.FullName;
	var name2 = obj2.LastName + ' ' + obj2.FullName;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function Do_HS10_1_Call_PERSONNEL_Finished()
{
	if (DirectReports.length > 0)
		DirectReports.sort(sortByName);
	else
		parent.seaAlert(getSeaPhrase("NO_DIRECT_REPORTS","ESS"), null, null, "error");
	//GDD 09/22/14 force get actions for mods
	//if (emssObjInstance.emssObj.filterSelect)
	//	paintEmployeeActionSelects();
	//else
	//GDD end of change
		getActions();
}

function getActions()
{
	Rules = new Array();
	var obj	= new DMEObject(authUser.prodline, "PERSACTYPE");
	obj.out = "JAVASCRIPT";
	obj.field = "action-code;description;web-available;web-avail-supv;web-immediate;workflow-flag";
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "09.00.01")
	{
		obj.field += ";require-reason;dft-reason;action-reason.act-reason-cd";
		obj.otmmax = "1";
	}
	obj.key = parseInt(authUser.company,10) + "";
	obj.cond = "Web-Supv-Avail";
	obj.max	= "600";
	obj.debug = false;
	obj.func = "getActionsFinished()";
	DME(obj, "jsreturn");
}

function getActionsFinished()
{
	for (var n=0; n<self.jsreturn.NbrRecs; n++) 
	{
		var obj = self.jsreturn.record[n];
		var len = Rules.length;
		Rules[len] = new RulesObject(obj.description, obj.action_code, obj.web_available,
			obj.web_avail_supv, obj.web_immediate, obj.workflow_flag);
 		if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "09.00.01")
		{
			if (obj.require_reason != "" && !isNaN(parseInt(obj.require_reason, 10)))
				Rules[len].NbrRequiredReasons = obj.require_reason;
			if (obj.dft_reason_1 != "")
				Rules[len].DefaultReasonCode1 = obj.dft_reason_1;
			if (obj.dft_reason_2 != "")
				Rules[len].DefaultReasonCode2 = obj.dft_reason_2;
			if (obj.action_reason_act_reason_cd != "")
				Rules[len].ReasonCodesExist = true;
		}
	}
	if (self.jsreturn.Next != "")
		window.open(self.jsreturn.Next, "jsreturn");
	else
		paintEmployeeActionSelects();
}

function startOver(elmObj)
{
	var nextFunc = function()
	{
		var obj = self.main.document.getElementById("fieldsTable");
		if (obj != null && typeof(obj) == "object")
			obj.innerHTML = "";
		clearRequiredKeyFields();
		// if we are refreshing due to the action code changing, fill default reason codes
		if (elmObj && elmObj.id == "actionsSelect" && appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "09.00.01")
			setDefaultReasonCodes();
		//GDD  09/22/14  Need to refresh screen too.
	        if (self.main.document.getElementById("actionsSelect").value != actionName) {
		        actionName = self.main.document.getElementById("actionsSelect").value;	
			empIndex = self.main.document.getElementById("reportsSelect").selectedIndex-1;
//		        _RULESINDEX = self.main.document.getElementById("actionsSelect").selectedIndex-1;
			if (empIndex == -1) empIndex = 0;
			paintEmployeeActionSelects();
		}
		//GDD end of change.
		self.main.document.getElementById("continueButton").style.visibility = "visible";
		if (fromTask)
			parent.removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
		fitToScreen();
	};
	if (fromTask)
		parent.showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
	else
		nextFunc();

}

// Populate any default reason codes for the selected action.
function setDefaultReasonCodes()
{
	var reason1Obj = self.main.document.getElementById("reasonSelect1");
	var reason2Obj = self.main.document.getElementById("reasonSelect2");
	if (emssObjInstance.emssObj.filterSelect)
	{
		_RULESINDEX = 0;
		reason1Obj.value = "";
		reason2Obj.value = "";
		try { self.main.document.getElementById("xlt_reasonSelect1").innerHTML = ""; } catch(e) {}
		try { self.main.document.getElementById("xlt_reasonSelect2").innerHTML = ""; } catch(e) {}
	}
	else
	{
		_RULESINDEX = self.main.document.getElementById("actionsSelect").selectedIndex - 1;
		reasonCodes = new Array();
		removeAllSelectItems(reason1Obj);
		removeAllSelectItems(reason2Obj);
	}
	if (Rules.length == 0 || _RULESINDEX < 0)
		return;
	if (Rules[_RULESINDEX].NbrRequiredReasons > 0)
	{
		self.main.document.getElementById("reasonSelect1RequiredIcon").style.display = "";
		if (Rules[_RULESINDEX].NbrRequiredReasons > 1)
			self.main.document.getElementById("reasonSelect2RequiredIcon").style.display = "";
		else
			self.main.document.getElementById("reasonSelect2RequiredIcon").style.display = "none";
	}
	else
	{
		self.main.document.getElementById("reasonSelect1RequiredIcon").style.display = "none";
		self.main.document.getElementById("reasonSelect2RequiredIcon").style.display = "none";
	}
	if (emssObjInstance.emssObj.filterSelect)
	{
		if (Rules[_RULESINDEX].DefaultReasonCode1 != null)
			self.main.document.getElementById("reasonSelect1").value = Rules[_RULESINDEX].DefaultReasonCode1;
	}
	else
	{
		if (Rules[_RULESINDEX].DefaultReasonCode1 != null)
		{
			var dataArray = new Array();
			dataArray[0] = new Object();
			dataArray[0].name = Rules[_RULESINDEX].DefaultReasonCode1;
			dataArray[0].code = Rules[_RULESINDEX].DefaultReasonCode1;
			generateSelectOptions("reasonSelect1", dataArray, true);
			var reason1s = self.main.document.getElementById("reasonSelect1");
			self.main.styleElement(reason1s);
		}
	}
	if (emssObjInstance.emssObj.filterSelect)
	{
		if (Rules[_RULESINDEX].DefaultReasonCode2 != null)
			self.main.document.getElementById("reasonSelect2").value = Rules[_RULESINDEX].DefaultReasonCode2;
	}
	else
	{
		if (Rules[_RULESINDEX].DefaultReasonCode2 != null)
		{
			var dataArray = new Array();
			dataArray[0] = new Object();
			dataArray[0].name = Rules[_RULESINDEX].DefaultReasonCode2;
			dataArray[0].code = Rules[_RULESINDEX].DefaultReasonCode2;
			generateSelectOptions("reasonSelect2", dataArray, true);
			var reason2s = self.main.document.getElementById("reasonSelect2");
			self.main.styleElement(reason2s);
		}
	}
}

function generateReportsSelect()
{
	var html = '<select id="reportsSelect" class="inputbox" onchange="parent.startOver();">';
	if (empIndex == -1)
		html += '<option value="" selected="selected"></option>';
	else
		html += '<option value=""></option>';
	for (var i=0; i<DirectReports.length; i++) {
		html += '<option value="'+DirectReports[i].Code+'"';
		if (empIndex == i)
			html += ' selected="selected"';
		html += '>'+DirectReports[i].FullName+'</option>';
	}
	html += '</select>';
	return html;
}

function generateActionsSelect()
{
	var htmlStr;
	var toolTip;
	//GDD 09/22/14  Force select because of issues with dme dropdown not knowning on first select of a change.
	//if (emssObjInstance.emssObj.filterSelect) 
	//{
	//	toolTip = dmeFieldToolTip("actionsSelect");
	//      htmlStr = '<input type="text" id="actionsSelect" fieldnm="actionsSelect" class="inputbox" style="width:150px;text-transform:uppercase" size="10" maxlength="10" onkeyup="parent.actionCodeModified(this);return false" onchange="parent.lookUpUserEnteredActionCode(this);parent.startOver();" onblur="parent.CheckActionChanged(this);">';
	//	htmlStr += '<a href="javascript:;" onclick="parent.openFieldSelect(\'actionsSelect\',1,\'DME\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">';
	//	htmlStr += '<img src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" style="margin-bottom:-3px" alt="'+toolTip+'" title="'+toolTip+'"></a>';
	//} 
	//else 
	//{
		//GDD  09/22/14  set value now because of change in StartOver()
		//htmlStr = '<select id="actionsSelect" class="inputbox" onchange="parent.startOver(this);">';
		//htmlStr += '<option value="" selected="selected"></option>';
		//for (var i=0; i<Rules.length; i++)
		//	htmlStr += '<option value="'+Rules[i].ActionCode+'">'+Rules[i].Description+'</option>';
		//htmlStr += '</select>';
		htmlStr = '<select id="actionsSelect" class="inputbox" onchange="parent.lookUpUserEnteredActionCode(this);parent.actionCodeModified(this);parent.startOver(this);">';
		htmlStr += '<option value=""'+(actionName == "")?' selected="selected" </option>':' </option>';
		for (var i=0; i<Rules.length; i++) {
			htmlStr += '<option value="'+Rules[i].ActionCode+'"';
			if (Rules[i].ActionCode == actionName) htmlStr += ' selected="selected" ';
			htmlStr += '>'+Rules[i].Description+'</option>';
		}
		htmlStr += '</select>';
		//GDD End of Change

	//}
	return htmlStr;
}

function actionCodeModified(elmObj)
{
	if (Rules.length == 0 || Rules[0].ActionCode.toString().toUpperCase() != elmObj.value.toUpperCase())
	{
		Rules = new Array();
		self.main.document.getElementById("xlt_actionsSelect").innerHTML = "";
	}
}

function ReturnDate(date)
{
	 var effectiveDate = self.main.document.getElementById("effectiveDate");
	 var oldDate = effectiveDate.value;
	 effectiveDate.value = date;
	 if (oldDate != date)
	 	startOver();	
}

// If the user keys in an action code, look up the record from the PERSACTYPE file.
function lookUpUserEnteredActionCode(elmObj, funcToCall)
{
	if (!elmObj || NonSpace(elmObj.value) == 0)
		return false;
	elmObj.value = elmObj.value.toUpperCase();
	if (Rules.length == 0 || Rules[_RULESINDEX].ActionCode != elmObj.value)
	{
		var dmeObj	= new DMEObject(authUser.prodline, "persactype");
		dmeObj.out = "JAVASCRIPT";
		dmeObj.index = "patset1";
		dmeObj.field = "action-code;description;web-available;web-avail-supv;web-immediate;workflow-flag";
		if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "09.00.01")
		{
			dmeObj.field += ";require-reason;dft-reason;action-reason.act-reason-cd";
			dmeObj.otmmax = "1";
		}
		dmeObj.key = parseInt(authUser.company,10)+"="+elmObj.value;
		dmeObj.cond = "web-supv-avail";
		dmeObj.max	= "1";
		dmeObj.debug = false;
		if (funcToCall)
			dmeObj.func = "storeUserEnteredActionCode('"+funcToCall+"')";
		else
			dmeObj.func = "storeUserEnteredActionCode()";
		DME(dmeObj, "jsreturn");
	}
	return true;
}

function storeUserEnteredActionCode(funcToCall)
{
	if (self.jsreturn.NbrRecs > 0)
	{
		var selRec = self.jsreturn.record[0];
		try { self.main.document.getElementById("xlt_actionsSelect").innerHTML = selRec.description; } catch(e) {}
		Rules = new Array();
		Rules[0] = new RulesObject(selRec.description, selRec.action_code, selRec.web_available,
				selRec.web_avail_supv, selRec.web_immediate, selRec.workflow_flag);
		if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "09.00.01")
		{
			if (selRec.require_reason != "" && !isNaN(parseInt(selRec.require_reason, 10)))
				Rules[0].NbrRequiredReasons = parseInt(selRec.require_reason, 10);
			if (selRec.dft_reason_1 != "")
				Rules[0].DefaultReasonCode1 = selRec.dft_reason_1;
			if (selRec.dft_reason_2 != "")
				Rules[0].DefaultReasonCode2 = selRec.dft_reason_2;
			if (selRec.action_reason_act_reason_cd != "")
				Rules[0].ReasonCodesExist = true;
			setDefaultReasonCodes();
			clearRequiredField(self.main.document.getElementById("actionsSelect"));
		}
	}
	else
	{
		Rules = new Array();
		Rules[0] = new RulesObject("", "INVALID_ACTION_CODE", "Y", "2", "N", "N");
		self.main.document.getElementById("reasonSelect1RequiredIcon").style.display = "none";
		self.main.document.getElementById("reasonSelect2RequiredIcon").style.display = "none";
	}
	if (funcToCall)
		eval(funcToCall);
}

function generateReasonSelect(i)
{
	var toolTip;
	var htmlStr;

	htmlStr = '<span id="reasonSelect'+i+'Cell">';
      //GDD  08/20/14  Customize the Dropdown if TERMPEND
      if (actionName == "TERMPEND") {
	    if (i == 1) {
		    htmlStr += '<select id="reasonSelect'+i+'" class="inputbox" style="width:100px" onchange="parent.ResetReason2(this);return false"';
	        htmlStr += '>';
		    htmlStr += '<option value="" selected></option>';
		    htmlStr += '<option value="TOV">Voluntary</option>';
		    htmlStr += '<option value="TOI">Involuntary</option>';
		    htmlStr += '</select>';
	    }
	    else { 
		    htmlStr += '<select id="reasonSelect'+i+'" class="inputbox" style="width:200px">';
		    htmlStr += '</select>';
	    }  
      }
      else {  
      //GDD  end of change 
	if (emssObjInstance.emssObj.filterSelect) 
	{
		toolTip = dmeFieldToolTip("reasonSelect"+i);
		htmlStr += '<input type="text" id="reasonSelect'+i+'" fieldnm="reasonSelect'+i+'" class="inputbox" style="width:150px;text-transform:uppercase" size="10" maxlength="10" onkeyup="parent.dmeFieldOnKeyUpHandler(event,0);">';
		htmlStr += '<a href="javascript:;"';
		if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "09.00.01")
			htmlStr += ' onclick="parent.reasonCodeSelected('+i+');return false"';
		else
			htmlStr += ' onclick="parent.openFieldSelect(\'reasonSelect'+i+'\',0,\'DME\');return false"';
		htmlStr += ' title="'+toolTip+'" aria-label="'+toolTip+'"><img src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" style="margin-bottom:-3px" alt="'+toolTip+'" title="'+toolTip+'"></a>';
	} 
	else 
	{
		htmlStr += '<select id="reasonSelect'+i+'" fieldnm="reasonSelect'+i+'" class="inputbox" style="width:150px"';
		if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "09.00.01")
		{
			DMEFunctions[0]	= "GetReasonCodes()";
			htmlStr += ' onclick="parent.reasonCodeSelected('+i+');return false"';
		}
		else
			htmlStr += ' onclick="parent.openFieldSelect(\''+'reasonSelect'+i+'\',0,\'DME\');return false"';
		htmlStr += '><option value=""></option></select>';
	}
	} //GDD  08/20/14   Because of If added above
	htmlStr += '</span>';
	return htmlStr;
}

// Make sure an action code is selected before a reason code, since reason codes will be looked up
// for the selected action.  Valid for application release 9.0.1 or newer.
function reasonCodeSelected(i)
{
	if (!validateActionCode())
		return;
	else
		openFieldSelect("reasonSelect"+i, 0, "DME");
}

//GDD  08/20/14  reset selected index if blank selected because of delivered code if TERMPEND
function ResetReason2(obj)
{

	var reason1 = obj.value;
	if (obj.selectedIndex != 0) GetTermReasons(reason1.substring(2,3));
}

function GetTermReasons(TermType)
{
	var object 		= new DMEObject(authUser.prodline,"PAACTREAS")
	object.out 	= "JAVASCRIPT"
	object.index	= "creset3"
	object.field	= "act-reason-cd;description"
	object.key	= String(authUser.company);
		
	if (Rules[_RULESINDEX].ReasonCodesExist)
	{
		object.index	= "creset4"
		object.key += "=" + actionName;
	}
	object.select   = "description%7E"+TermType+"-";
	object.cond 	= "active";
	object.func     = "LoadSelect2()";
	object.max	= "600"
	object.debug 	= false;
	DME(object,"jsreturn")

}

function LoadSelect2()
{
	var select2Obj = self.main.document.getElementById("reasonSelect2");
	for (var k=0;k<select2Obj.options.length;k++) {
		select2Obj.options[i] = null;
	}
	select2Obj.options.length = 0;
	var option = document.createElement("option");
	option.value = "";
	option.text = "";
	select2Obj.options.add(option);
	for (var i=0;i<self.jsreturn.NbrRecs;i++) {
		var option = document.createElement("option");
		option.value = self.jsreturn.record[i].act_reason_cd;
		option.text = self.jsreturn.record[i].description.substring(2);
		select2Obj.options.add(option);
	}
	select2Obj.selectedIndex = 1;
	startOver();
} 	
//GDD  end of change
					


function paintEmployeeActionSelects()
{
	var toolTip;
	self.main.document.getElementById("paneHeader").innerHTML = getSeaPhrase("PERSONNEL_ACTION_CRITERIA","ESS");
	var htmlStr = uiRequiredFooter();
	htmlStr += '<table style="width:auto" border="0" cellspacing="0" cellpadding="0" role="presentation">';
	htmlStr += '<tr><td class="fieldlabelboldleft" style="padding-left:10px"><label for="reportsSelect">'+getSeaPhrase("SELECT_EMPLOYEE","ESS")+'</label><br/>';
	htmlStr += '<span id="reportsCell">'+generateReportsSelect()+uiRequiredIcon()+'</span></td>';
	htmlStr += '<td class="fieldlabelboldleft" colspan="2"><label for="actionsSelect">'+getSeaPhrase("SELECT_PERSONNEL_ACTION","ESS")+'</label><br/>';
	htmlStr += '<span id="actionsCell">'+generateActionsSelect()+uiRequiredIcon()+'</span>';
	if (emssObjInstance.emssObj.filterSelect)
		htmlStr += '<span class="fieldlabelleft" style="width:auto;overflow:visible" id="xlt_actionsSelect"></span>';
	htmlStr += '</td></tr>';  

    //GDD  08/20/14  Show different label if TERMPEND	
    if (actionName == "TERMPEND") {
	    toolTip = "Select Termination Date";
	    htmlStr += '<tr><td class="fieldlabelboldleft" style="padding-top:10px;padding-left:10px;vertical-align:top"><label id="effectiveDateLbl" for="effectiveDate">Termination Date</label><br/>';
    }
    else {
	    toolTip = getSeaPhrase("SELECT_EFFECTIVE_DATE","ESS");
	    htmlStr += '<tr><td class="fieldlabelboldleft" style="padding-top:10px;padding-left:10px;vertical-align:top"><label id="effectiveDateLbl" for="effectiveDate">'+getSeaPhrase("SELECT_EFFECTIVE_DATE","ESS")+'</label><br/>';
    }  
    //GDD  end of change
	htmlStr += '<span><input class="inputbox" id="effectiveDate" type="text" size="12" maxlength="10" value="'+fmttoday+'" onchange="parent.startOver();" aria-labelledby="effectiveDateLbl effectiveDateFmt">';
	htmlStr += '<a href="javascript:;" onclick="parent.DateSelect(\'date\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a><br/>'+uiDateFormatSpan("effectiveDateFmt")+uiRequiredIcon()+'</span>';
    var selectReasonLbl = getSeaPhrase("SELECT_REASON","ESS");
    htmlStr += '</td><td class="fieldlabelboldleft" style="padding-top:10px;padding-left:0px;padding-right:0px;vertical-align:top">'
    htmlStr += '<label class="fieldlabelboldleft">'+selectReasonLbl+'</label><br/>'
	if (emssObjInstance.emssObj.filterSelect)
	{
		htmlStr += '<table border="0" cellspacing="0" cellpadding="0" role="presentation">';
		htmlStr += '<tr><td class="fieldlabelboldleft" nowrap><label for="reasonSelect1"><span class="offscreen">'+selectReasonLbl+'&nbsp;</span>'+getSeaPhrase("REASON_1","ESS")+'</label><br/><span id="reasonSelect1Cell">'+generateReasonSelect(1)+'</span><span id="reasonSelect1RequiredIcon" style="display:none">'+uiRequiredIcon()+'</span><br/>'
		htmlStr += '<span class="fieldlabelleft" style="width:auto;overflow:visible;padding-left:0px" id="xlt_reasonSelect1"></span></td>'
		htmlStr += '<td class="fieldlabelboldleft"><label for="reasonSelect2"><span class="offscreen">'+selectReasonLbl+'&nbsp;</span>'+getSeaPhrase("REASON_2","ESS")+'</label><br/><span id="reasonSelect2Cell">'+generateReasonSelect(2)+'</span><span id="reasonSelect2RequiredIcon" style="display:none">'+uiRequiredIcon()+'</span><br/>';
		htmlStr += '<span style="width:auto;overflow:visible;padding-left:0px" class="fieldlabelleft" id="xlt_reasonSelect2"></span></td>';
		htmlStr += '</tr></table>';
	}
	else
	{
		htmlStr += '<table border="0" cellspacing="0" cellpadding="0" role="presentation">';
		htmlStr += '<tr><td class="fieldlabelboldleft" nowrap><label class="offscreen" for="reasonSelect1">'+selectReasonLbl+' '+getSeaPhrase("REASON_1","ESS")+'</label><span id="reasonSelect1Cell" style="white-space:nowrap">'+generateReasonSelect(1)+'</span><span id="reasonSelect1RequiredIcon" style="display:none">'+uiRequiredIcon()+'</span></td>'
		htmlStr += '<td class="fieldlabelboldleft"><label class="offscreen" for="reasonSelect2">'+selectReasonLbl+' '+getSeaPhrase("REASON_2","ESS")+'</label><span id="reasonSelect2Cell">'+generateReasonSelect(2)+'</span><span id="reasonSelect2RequiredIcon" style="display:none">'+uiRequiredIcon()+'</span></td>';
		htmlStr += '</tr></table>';
	}
    htmlStr += '</td><td class="plaintablecellright" style="padding-top:10px" nowrap>';
	htmlStr += '<span id="continueButton">';
	if (empIndex != -1) 
	{
		htmlStr += uiButton(getSeaPhrase("CONTINUE","ESS"),"parent.continueClicked();return false","margin-top:0px");
//		htmlStr += uiButton(getSeaPhrase("BACK","ESS"),"parent.parent.backToMain('personnelactions');return false","margin-top:0px;margin-right:5px;margin-left:5px;");
	}
	else
		htmlStr += uiButton(getSeaPhrase("CONTINUE","ESS"),"parent.continueClicked();return false","margin-top:0px;margin-right:5px;margin-left:5px");
	htmlStr += '</span></td></tr></table>';
	htmlStr += '<div id="fieldsTable" class="floatLeft" style="position:relative;top:0px;width:auto;height:auto"></div>';
	self.main.document.getElementById("paneBody").innerHTML = htmlStr;
	self.main.stylePage();
	self.document.getElementById("main").style.visibility = "visible";
	if (fromTask)
		parent.removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
	fitToScreen();
}

var _DRINDEX = 0;
var _RULESINDEX = 0;

function continueClicked()
{
	if (self.main.document.getElementById("reportsSelect").selectedIndex <= 0) 
	{
		setRequiredField(self.main.document.getElementById("reportsCell"), getSeaPhrase("SELECT_EMPLOYEE","ESS"), self.main.document.getElementById("reportsSelect"));
		return;
	} 
	else
		clearRequiredField(self.main.document.getElementById("reportsCell"));
	if (emssObjInstance.emssObj.filterSelect) 
	{
		if (NonSpace(self.main.document.getElementById("actionsSelect").value) == 0) 
		{
			setRequiredField(self.main.document.getElementById("actionsSelect"), getSeaPhrase("SELECT_PERSONNEL_ACTION","ESS"));
			return;
		} 
		else if (Rules.length == 0 && lookUpUserEnteredActionCode(self.main.document.getElementById("actionsSelect"), "continueClicked()")) 
		{

	//GDD  08/20/14  Add edit if TERMPEND
    if (self.main.document.getElementById("actionsSelect").value == "TERMPEND") {
	    if (self.main.document.getElementById("reasonSelect1").selectedIndex == 0) {
		    parent.seaAlert("Must select Voluntary or Involuntary");
		    self.main.document.getElementById("reasonSelect1").selectedIndex = 1;
		    return;
	    }

	    if (self.main.document.getElementById("reasonSelect2").selectedIndex == 0) {
		    parent.seaAlert("Must enter secondary reason");
		    return;
	    }
	}  
    //GDD  end of change 

			// validate user entered action code
			return;
		} 
		else if (Rules[_RULESINDEX].ActionCode == "INVALID_ACTION_CODE") 
		{
			setRequiredField(self.main.document.getElementById("actionsSelect"), getSeaPhrase("INVALID_PERSONNEL_ACTION","ESS"));
			return;
		} 
		else
			clearRequiredField(self.main.document.getElementById("actionsSelect"));
	} 
	else 
	{
		if (self.main.document.getElementById("actionsSelect").selectedIndex <= 0) 
		{
			setRequiredField(self.main.document.getElementById("actionsCell"), getSeaPhrase("SELECT_PERSONNEL_ACTION","ESS"), self.main.document.getElementById("actionsSelect"));
			return;
		} 
		else
			clearRequiredField(self.main.document.getElementById("actionsCell"));
	}
	if (NonSpace(self.main.document.getElementById("effectiveDate").value) == 0) 
	{
		setRequiredField(self.main.document.getElementById("effectiveDate"), getSeaPhrase("MUST_ENTER_DATE","ESS"));
		return;
	} 
	else 
	{
		var dteParams = dateIsValid(self.main.document.getElementById("effectiveDate").value);
		var dte = dteParams[0];
		var errMsg = dteParams[1];
		if (!dte)
		{
			setRequiredField(self.main.document.getElementById("effectiveDate"), getSeaPhrase("CAL_1","ESS"));
			return;
		} 
		else 
		{
			self.main.document.getElementById("effectiveDate").value = dte;
			clearRequiredField(self.main.document.getElementById("effectiveDate"));
		}
	}
	if (emssObjInstance.emssObj.filterSelect) 
	{
		clearRequiredField(self.main.document.getElementById("reasonSelect1"));
		clearRequiredField(self.main.document.getElementById("reasonSelect2"));
	} 
	else 
	{
		clearRequiredField(self.main.document.getElementById("reasonSelect1Cell"));
		clearRequiredField(self.main.document.getElementById("reasonSelect2Cell"));
	}
	self.main.document.getElementById("continueButton").style.visibility = "hidden";
	_DRINDEX = self.main.document.getElementById("reportsSelect").selectedIndex - 1;
	if (emssObjInstance.emssObj.filterSelect)
		_RULESINDEX = 0;
	else
		_RULESINDEX = self.main.document.getElementById("actionsSelect").selectedIndex - 1;
	Rules[_RULESINDEX].EffectiveDate = self.main.document.getElementById("effectiveDate").value;
	//Sync immediate flag to the rules; on an immediate action, the user may have elected to pend the same action for a different effective date
	Rules[_RULESINDEX].WebImmediate = Rules[_RULESINDEX].OrigWebImmediate;
	if (fromTask)
		parent.showWaitAlert(getSeaPhrase("ACTION_LOADING","ESS"), GetPersactypeForSecondWindow);
	else
		GetPersactypeForSecondWindow();
	self.main.stylePage();
}

function validateEffectiveDate()
{
	if (NonSpace(self.main.document.getElementById("effectiveDate").value) == 0) 
	{
		setRequiredField(self.main.document.getElementById("effectiveDate"), getSeaPhrase("MUST_ENTER_DATE","ESS"));
		return false;
	} 
	else 
	{
		var dteParams = dateIsValid(self.main.document.getElementById("effectiveDate").value);
		var dte = dteParams[0];
		var errMsg = dteParams[1];
		if (!dte)
		{
			setRequiredField(self.main.document.getElementById("effectiveDate"), getSeaPhrase("CAL_1","ESS"));
			return false;
		} 
		else 
		{
			self.main.document.getElementById("effectiveDate").value = dte;
			clearRequiredField(self.main.document.getElementById("effectiveDate"));
		}	
	}
	return true;
}

function generateFieldSelect(selectID, fldNbr, where, changeText, maxLen)
{
	var toolTip = dmeFieldToolTip(selectID);
	var maxLenStr = (maxLen) ? ' maxlength="'+maxLen+'"' : '';
	var htmlStr = '';
	if ((2000 <= fldNbr) && (fldNbr <= 2099)) 
	{
		htmlStr = '<input type="text" id="'+selectID+'" fieldnm="'+fldNbr+'" class="inputbox" style="width:250px" value="';
		if (typeof(changeText) != "undefined" && changeText != null)
			htmlStr += changeText;
		htmlStr += '"'+maxLenStr+'><a href="javascript:;" onclick="parent.openFieldSelect(\''+selectID+'\','+fldNbr+',\''+where+'\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">';
		htmlStr += '<img src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" style="margin-bottom:-3px" alt="'+toolTip+'" title="'+toolTip+'">';
		htmlStr += '</a><span class="fieldlabelleft" style="width:250px" id="xlt_'+selectID+'"></span>';
	} 
	else if ((where == "DME") && (emssObjInstance.emssObj.filterSelect)) 
	{
		if (fldNbr == 136) 
		{
			htmlStr += '<input type="hidden" id="'+selectID+'_indicator" class="inputbox">';
			htmlStr += '<input type="hidden" id="'+selectID+'_effectdate" class="inputbox">';
			htmlStr += '<input type="text" id="'+selectID+'" class="inputbox" style="width:250px" onkeyup="parent.dmeFieldOnKeyUpHandler(event,'+fldNbr+');" value="';
			if (typeof(changeText) != "undefined" && changeText != null)
				htmlStr += changeText;
			htmlStr += '"'+maxLenStr+'>';
		} 
		else 
		{
			htmlStr += '<input type="text" id="'+selectID+'" fieldnm="'+fldNbr+'" class="inputbox" style="width:250px" onkeyup="parent.dmeFieldOnKeyUpHandler(event,'+fldNbr+');" value="';
			if (typeof(changeText) != "undefined" && changeText != null)
				htmlStr += changeText;
			htmlStr += '"'+maxLenStr+'>';
		}
		htmlStr += '<a href="javascript:;" onclick="parent.openFieldSelect(\''+selectID+'\','+fldNbr+',\''+where+'\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">';
		htmlStr += '<img src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" style="margin-bottom:-3px" alt="'+toolTip+'" title="'+toolTip+'">';
		htmlStr += '</a><span class="fieldlabelleft" style="width:250px" id="xlt_'+selectID+'"></span>';
	} 
	else 
	{
		htmlStr = '<select id="'+selectID+'" class="inputbox" style="width:250px" onclick="parent.openFieldSelect(\''+selectID+'\','+fldNbr+',\''+where+'\');return false"';
		if (fldNbr == 64)
			htmlStr += ' onchange="parent.CalculatePayRatePercentage();"';
		else if (fldNbr == 136)
			htmlStr += ' onchange="parent.ScheduleChanged();"';
		htmlStr += '>';
		// treat an existing value on a pending action the same as a default value, so it will get removed when the user
		// clicks on the dropdown to populate the complete list of field values.
		if (typeof(changeText) != "undefined" && changeText != null) 
		{
			htmlStr += '<option value="DEFAULT_VALUE"></option>';
			htmlStr += '<option value="'+changeText+'" selected="">'+changeText+'</option>';
		}
		else
			htmlStr += '<option value=""></option>';
		htmlStr += '</select>';
	}
	return htmlStr;
}

function PaintFieldsForAction()
{
	positionFldIndex = -1;
	salaryClassFldIndex = -1;
	payRateFldIndex = -1;
	gradeFldIndex = -1;
	stepFldIndex = -1;
	var actionDesc;
	if (emssObjInstance.emssObj.filterSelect)
		actionDesc = self.main.document.getElementById("xlt_actionsSelect").innerHTML;
	else
		actionDesc = Rules[_RULESINDEX].Description;
	var htmlStr = '<p id="pendOrNotMsg" class="fieldlabelboldleft">';
	if (Rules[_RULESINDEX].WebImmediate == "Y") 
	{
		htmlStr += '<input id="pendOrNot" type="checkbox">';
		htmlStr += '<label for="pendOrNot">&nbsp;'+getSeaPhrase("ACTION_PEND_A","ESS")+'</label>';
	} 
	else
		htmlStr += getSeaPhrase("ACTION_PEND_B","ESS");
	htmlStr += '</p>';
	htmlStr += '<table class="plaintableborder" style="border-left:0px;width:100%" align="center" cellpadding="0" cellspacing="0" styler="list" styler_edit="true" summary="'+getSeaPhrase("TSUM_18","SEA",[actionDesc,DirectReports[_DRINDEX].FullName])+'">';
	htmlStr += '<caption class="offscreen">'+getSeaPhrase("TCAP_13","SEA",[actionDesc,DirectReports[_DRINDEX].FullName])+'</caption>';
	htmlStr += '<tr><th scope="col" class="plaintableheaderbordersidesbold" style="width:33%">'+getSeaPhrase("FIELD","ESS")+'</th>';
	htmlStr += '<th scope="col" class="plaintableheaderborder" style="width:33%">'+getSeaPhrase("CURRENT_VALUE","ESS")+'</th>';
	htmlStr += '<th scope="col" class="plaintableheaderborder" style="width:33%" styler_edit="true">'+getSeaPhrase("CHANGE_TO","ESS")+'</th></tr>';
	if (!Data.length)
	{
		htmlStr += '<tr><td class="fieldlabelbold" style="text-align:center" colspan="3">'+getSeaPhrase("NO_FIELDS","ESS")+'</td></tr>';
	}
	else 
	{
		var maxFldLen = (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "10.00.00") ? 60 : 30;
		for (var n=0; n<Data.length; n++) 
		{
			htmlStr += '<tr>';
			if (Data[n].FldNbr == 62) 
			{
				htmlStr += '<td class="plaintableheaderbordersidesonly" style="white-space:nowrap" nowrap="nowrap"><label for="percentage'+n+'">'+((Data[n].Field)?Data[n].Field:'&nbsp;')+'</label></td>';
				htmlStr += '<td class="plaintablerowheaderdisplay" style="white-space:nowrap" nowrap="nowrap"><label for="fieldSelect'+n+'">'+((Data[n].CurrentValue)?Data[n].CurrentValue:'&nbsp;')+'</label></td>';
			}
			else 
			{
				htmlStr += '<td class="plaintableheaderbordersidesonly" style="white-space:nowrap" nowrap="nowrap"><label for="fieldSelect'+n+'">'+((Data[n].Field)?Data[n].Field:'&nbsp;')
		//GDD  12/09/14  Set required icon if TERMPEND and field is Eligible for Rehire
		if (self.main.document.getElementById("actionsSelect").value == "TERMPEND" && Data[n].Field == "Eligible for Rehire") htmlStr += uiRequiredIcon();
		//GDD end of change.
				htmlStr += '</label></td>';
				htmlStr += '<td class="plaintablerowheaderdisplay" style="white-space:nowrap" nowrap="nowrap"><label for="fieldSelect'+n+'">'+((Data[n].CurrentValue)?Data[n].CurrentValue:'&nbsp;')+'</label></td>';
			}
			htmlStr += '<td id="actionFldCell'+n+'" class="plaintablecell" style="white-space:nowrap" nowrap="nowrap">';
			if (Data[n].FldNbr == 62) 
			{
				payRateFldIndex = n;
				var rateAmount = (Data[n].ChangeText) ? roundToDecimal(parseFloat(((Data[n].ChangeText/Data[n].CurrentValue)-1)*100),4) : '';
				htmlStr += '<input class="inputbox" type="text" size="9" maxlength="9" id="percentage'+n+'" name="percentage'+n+'" onblur="parent.Calculate('+n+',\'percent\');" value="'+rateAmount+'">';
				htmlStr += '<span class="plaintablecell">% =</span>';
				htmlStr += '<input class="inputbox" type="text" size="15" id="fieldSelect'+n+'" name="select'+n+'" onchange="parent.Calculate('+n+',\'amount\')" value="';
				if (typeof(Data[n].ChangeText) != "undefined" && Data[n].ChangeText != null && NonSpace(Data[n].ChangeText) > 0)
					htmlStr += roundToDecimal(Data[n].ChangeText, 4);
				htmlStr += '">';
			} 
            //GDD  08/20/14  Force value of status if TERMPEND 
			if (Data[n].FldNbr == 20 && self.main.document.getElementById("actionsSelect").value == "TERMPEND") {
				htmlStr += '<input type="text" id="fieldSelect'+n+'" class="text" style="width:250px" value="TP" readonly>';
			}  
            //GDD  end of change 
	    //GDD 12/04/14   Add Calendar Icon for Last Day Worked	
			else	
			if (Data[n].Field == "Last Day Worked") {
				var toolTip = "Select Last Day Worked";
				htmlStr += '<input type="text" id="fieldSelect'+n+'" fieldnm="'+Data[n].FldNbr+'" class="inputbox" style="width:250px" value="';
				if (typeof(Data[n].ChangeText) != "undefined" && Data[n].ChangeText == null)
					htmlStr += Data[n].ChangeText;
				htmlStr += '" maxlength="12">';
				htmlStr += '<a href="javascript:;" onclick="parent.DateSelect(\'date\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a>';
                        }
			else 
	    //GDD end of change	
	    //GDD 12/10/14   Set dropdown for Eligible for Rehire	
			if (Data[n].Field == "Eligible for Rehire") {
				htmlStr += '<select id="fieldSelect'+n+'" fieldnm="'+Data[n].FldNbr+'" class="inputbox" style="width:250px">';
				htmlStr += '<option value=""';
				if (Data[n].ChangeText == "") htmlStr +=" selected";
				htmlStr += '> </option>';
				htmlStr += '<option value="Y"';
				if (Data[n].ChangeText == "Y") htmlStr +=" selected";
				htmlStr += '>Yes</option>';
				htmlStr += '<option value="N"';
				if (Data[n].ChangeText == "N") htmlStr +=" selected";
				htmlStr += '>No</option>';
				htmlStr += '<option value="M"';
				if (Data[n].ChangeText == "M") htmlStr +=" selected";
				htmlStr += '>Maybe</option>';
				htmlStr += '</select>';

                        }
			else 
	    //GDD end of change	
			{
				if (Data[n].FldNbr == 64) 
					salaryClassFldIndex = n;
				else if (Data[n].FldNbr == 126) 
					positionFldIndex = n;
				else if (Data[n].FldNbr == 134) 
					stepFldIndex = n;
				else if (Data[n].FldNbr == 135) 
					gradeFldIndex = n;
				else if (Data[n].FldNbr == 140) 
				{
					// if we are running on top of 8.1.1 applications, perform a DME to get the veteran status select;
					// otherwise use a hard-coded value list.
					if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "08.01.01")
						DMEFunctions[140] = "GetHrctrycode('VS')";
					else
						HardCodedLists[140] =  VeteranLiterals;
				}
				if (typeof(HardCodedLists[Data[n].FldNbr]) != "undefined" && HardCodedLists[Data[n].FldNbr] != null)
					htmlStr += generateFieldSelect("fieldSelect"+n, Data[n].FldNbr, "HARDCODED", Data[n].ChangeText, maxFldLen);
				else if (typeof(DMEFunctions[Data[n].FldNbr]) != "undefined" && DMEFunctions[Data[n].FldNbr] != null)
					htmlStr += generateFieldSelect("fieldSelect"+n, Data[n].FldNbr, "DME", Data[n].ChangeText, maxFldLen);
				else if (2000 <= Data[n].FldNbr && Data[n].FldNbr <= 2099)
					htmlStr += generateFieldSelect("fieldSelect"+n, Data[n].FldNbr, Data[n].FldNbr.toString().substring(2), Data[n].ChangeText, maxFldLen);
				else 
				{
					htmlStr += '<input class="inputbox" type="text" id="fieldSelect'+n+'" name="fieldSelect'+n+'" style="width:250px" maxlength="'+maxFldLen+'" value="';
					if (typeof(Data[n].ChangeText)!="undefined" && Data[n].ChangeText!=null)
						htmlStr += Data[n].ChangeText;
					htmlStr += '">';
				}
			}
			htmlStr += '</td></tr>';
		}
 		var commentText = (Comments) ? Comments.Text : "";
		//GDD  12/09/14  Set comment text for Term Pend
		if (self.main.document.getElementById("actionsSelect").value == "TERMPEND") {
			htmlStr += '<tr><td class="plaintableheaderbordersides" style="white-space:nowrap" nowrap="nowrap"><label for="comments">If Eligible for Rehire is No or Maybe you must provide details supporting your choice here</label></td>';
		}
		else { 
			htmlStr += '<tr><td class="plaintableheaderbordersides" style="white-space:nowrap" nowrap="nowrap"><label for="comments">'+getSeaPhrase("COMMENTS","ESS")+'</label></td>';
		}
		htmlStr += '<td class="plaintablerowheaderborderbottomdisplay" style="white-space:nowrap" nowrap="nowrap">&nbsp;</td>'
		//GDD End of Change	
		+ '<td class="plaintablecell" style="white-space:nowrap" nowrap="nowrap"><textarea id="comments" name="comments" value="" rows="4" cols="31"'
		+ ' class="inputbox" style="width:250px" onfocus="this.select()">'+ commentText +'</textarea></td></tr>';
	}
	htmlStr += '<tr><td class="plaintablecell" style="white-space:nowrap" nowrap="nowrap">&nbsp;</td><td class="plaintablecell" style="white-space:nowrap" nowrap="nowrap">&nbsp;</td>';
	htmlStr += '<td class="plaintablecell" style="white-space:nowrap" nowrap="nowrap">';
	htmlStr += uiButton(getSeaPhrase("UPDATE","ESS"),"parent.Update("+positionFldIndex+");return false");
	if (positionFldIndex >= 0)
		htmlStr += uiButton(getSeaPhrase("FILL_DEFAULTS","ESS"),"parent.fillDefaults("+positionFldIndex+");return false","margin-left:5px");
	htmlStr += uiButton(getSeaPhrase("CANCEL","ESS"),"parent.cancelClicked();return false","margin-left:5px");
	htmlStr += '</td></tr></table>';
    self.main.document.getElementById("fieldsTable").innerHTML = htmlStr;
	self.main.stylePage();
	if (fromTask)
		parent.removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));	
	fitToScreen();
}

function cancelClicked()
{
	if (emssObjInstance.emssObj.filterSelect)
	{
		Rules = new Array();
		self.main.document.getElementById("actionsSelect").value = "";
		try { self.main.document.getElementById("xlt_actionsSelect").innerHTML = ""; } catch(e) {}
	}
	else
	{
		self.main.document.getElementById("actionsSelect").selectedIndex = 0;
		var actionS = self.main.document.getElementById("actionsSelect");
		self.main.styleElement(actionS);
	}
	self.main.document.getElementById("effectiveDate").value = "";
	self.main.document.getElementById("reasonSelect1").selectedIndex = 0;
	self.main.document.getElementById("reasonSelect2").selectedIndex = 0;
	var reason1s = self.main.document.getElementById("reasonSelect1");
	self.main.styleElement(reason1s);
	var reason2s = self.main.document.getElementById("reasonSelect2");
	self.main.styleElement(reason2s);
	startOver();
}

function RulesObject(Description, ActionCode, WebAvail, WebAvailSuper, WebImmediate, WorkFlowFlag)
{
	this.Description = Description;
	this.ActionCode = ActionCode;
	this.WebAvail = WebAvail;
	this.WebAvailSuper = WebAvailSuper;
	this.WebImmediate = WebImmediate;
	this.OrigWebImmediate = WebImmediate;
	this.WorkFlowFlag = WorkFlowFlag;
	this.EffectiveDate = null;
	this.Reason1 = null;
	this.Reason2 = null;
	this.ActionType = null;
	this.Company = null;
	this.Employee = null;
	this.FicaNbr = null;
	this.EmployeeName = null;
	this.UpdateBenefit = null;
	this.ReasonText = null;
	this.EmailAddress = null;
	this.DoEmail = 0;
	this.AddressChange = false;
	this.SuppAddrChange = false;
	this.SchoolDist = "";
	this.OldState = "";
	this.NewState = "";
	this.EmpTaxFilter = 0;
	this.PrsEmpTaxAddr = 0;
	this.PrsTaxFilter = 0;
	this.DefaultReasonCode1 = null;
	this.DefaultReasonCode2 = null;
	this.ReasonCodesExist = false;
	this.NbrRequiredReasons = 0;
	this.CommentsFlag = null;
	this.ActionNbr = "";
}

function fitToScreen()
{
	if (typeof(window["styler"]) == "undefined" || window.styler == null)
		window.stylerWnd = findStyler(true);
	if (!window.stylerWnd)
		return;
	if (typeof(window.stylerWnd["StylerEMSS"]) == "function")
		window.styler = new window.stylerWnd.StylerEMSS();
	else
		window.styler = window.stylerWnd.styler;
	var winObj = getWinSize();
	var winWidth = winObj[0];	
	var winHeight = winObj[1];
	var contentWidth;
	var contentBorderWidth;
	var contentHeight;
	var contentBorderHeight;
	if (window.styler && window.styler.showInfor)
	{
		contentWidth = winWidth - 10;
		contentBorderWidth = (navigator.appName.indexOf("Microsoft") >= 0) ? contentWidth + 5 : contentWidth + 2;
		contentHeight = winHeight - 65;
		contentBorderHeight = (navigator.appName.indexOf("Microsoft") >= 0) ? contentHeight + 30 : contentHeight + 25;	
	}
	else if (window.styler && (window.styler.showLDS || window.styler.showInfor3))
	{
		contentWidth = winWidth - 20;
		contentBorderWidth = (window.styler.showInfor3) ? contentWidth + 7 : contentWidth + 17;
		contentHeight = winHeight - 75;
		contentBorderHeight = (navigator.appName.indexOf("Microsoft") >= 0) ? contentHeight + 30 : contentHeight + 25;				
	}
	else
	{
		contentWidth = winWidth - 10;
		contentBorderWidth = contentWidth;
		contentHeight = winHeight - 65;
		contentBorderHeight = contentHeight + 24;				
	}	
	if (self.main.onresize && self.main.onresize.toString().indexOf("setLayerSizes") >= 0)
		self.main.onresize = null;
	try
	{
		document.getElementById("main").style.height = winHeight + "px";
		document.getElementById("main").style.width = winWidth + "px";
		self.main.document.getElementById("paneBorder").style.width = contentBorderWidth + "px";
		self.main.document.getElementById("paneBorder").style.height = contentBorderHeight + "px";		
		self.main.document.getElementById("paneBodyBorder").style.width = contentWidth + "px";
		self.main.document.getElementById("paneBodyBorder").style.height = contentHeight + "px";
		self.main.document.getElementById("paneBody").style.width = contentWidth + "px";
		self.main.document.getElementById("paneBody").style.height = contentHeight + "px";
		self.main.document.getElementById("paneBody").style.overflow = "auto";		
	}
	catch(e) {}
	try
	{
		self.main.document.getElementById("fieldsTable").style.width = "100%";
	}
	catch(e) {}
}

</script>
</head>
<body style="overflow:hidden" onload="doAuthentication()" onresize="fitToScreen()">
	<iframe id="main" name="main" title="Main Content" level="2" tabindex="0" style="visibility:hidden;position:absolute;top:0px;left:0px;width:803px;height:564px" marginwidth="0" marginheight="0" frameborder="no" scrolling="no" src="/lawson/xhrnet/ui/headerpanehelp.htm"></iframe>
	<iframe name="jsreturn" title="Empty" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/dot.htm"></iframe>
	<iframe name="lawheader" title="Empty" style="visibility:hidden;height:0px;width:0px;" src="/lawson/xhrnet/personnelactions/palawheader.htm"></iframe>
</body>
</html>
<!-- Version: 8-)@(#)@10.00.05.00.27 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/personnelactions/pactions.htm,v 1.21.2.102.2.1 2014/07/02 14:05:14 kevinct Exp $ -->
<!--************************************************************
 *                                                             *
 *                           NOTICE                            *
 *                                                             *
 *   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
 *   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
 *   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
 *   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
 *   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
 *   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
 *   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
 *                                                             *
 *   (c) COPYRIGHT 2014 INFOR.  ALL RIGHTS RESERVED.           *
 *   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
 *   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
 *   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
 *   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
 *   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
 *                                                             *
 ************************************************************-->
