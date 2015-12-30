// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/bessload.js,v 1.27.2.56 2014/02/24 22:02:28 brentd Exp $
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
var rulesCurrentDate = "";
var rulesNewDate = "";
var nhRulesFromBS09 = false;
var verifyPlanGrps = false 
function getNHRules()
{	
	if (rule_type == "N")
	{
		setWinTitle(getSeaPhrase("NEW_HIRE_ENROLLMENT","BEN"));
		if (!appObj)
			appObj = new AppVersionObject(authUser.prodline, "HR");
		if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
		{
			setTimeout("getNHRules()", 10);
			return;
		}
		if (appObj && appObj.getLongAppVersion() != null && appObj.getLongAppVersion().toString() >= "09.00.01.09")
			nhRulesFromBS09 = true;
	}
	else
		setWinTitle(getSeaPhrase("BEN_ENROLL","BEN"));
	company	= parseFloat(authUser.company);
	employee = parseFloat(authUser.employee);
	prodline = authUser.prodline;
	var rules_company = company.toString();
	for (var i=rules_company.length;i<4;i++)
		rules_company = "0" + rules_company;
	_BaseDate = "";
	if (rule_type != "N" || nhRulesFromBS09)
		getEmployee();
	else 
	{
		var obj = new DMEObject(prodline,"sysrules");
		obj.out = "JAVASCRIPT";
		obj.index = "syrset2";
		obj.field = "alphadata3;numeric1";
		obj.key = "BN=NEWHIREBEN="+rules_company;
		obj.func = "checkNHRules()";			
		obj.max = "1";
		obj.debug = false;
		DME(obj,"jsreturn");
	}
}
function setNHBaseDate(nhDate)
{
	nhDate = nhDate.toString().toUpperCase();
	_BaseDateCode = nhDate;	
	if (_BaseDateCode == "SN") 
	{
		_BaseDate = "paemployee.senior-date";
		_BaseDateWord = "seniority date";
	} 
	else if (_BaseDateCode == "HI") 
	{
		_BaseDate = "date-hired";
		_BaseDateWord = "hire date";
	} 
	else if (_BaseDateCode == "AN") 
	{
		_BaseDate = "annivers-date";
		_BaseDateWord = "anniversary date";
	} 
	else if (_BaseDateCode == "AJ") 
	{
		_BaseDate = "adj-hire-date";
		_BaseDateWord = "adjusted hire date";
	} 
	else if (_BaseDateCode == "B1") 
	{
		_BaseDate = "paemployee.ben-date-1";
		_BaseDateWord = "benefit date 1";
	} 
	else if (_BaseDateCode == "B2") {
		_BaseDate = "paemployee.ben-date-2";
		_BaseDateWord = "benefit date 2";
	} 
	else if (_BaseDateCode == "B3") 
	{
		_BaseDate = "paemployee.ben-date-3";
		_BaseDateWord = "benefit date 3";
	} 
	else if (_BaseDateCode == "B4") 
	{
		_BaseDate = "paemployee.ben-date-4";
		_BaseDateWord = "benefit date 4";
	} 
	else if (_BaseDateCode == "B5") 
	{
		_BaseDate = "paemployee.ben-date-5";
		_BaseDateWord = "benefit date 5";
	}	
}
function checkNHRules()
{
	if (self.jsreturn.NbrRecs == 0) 
	{
		stopProcessing();		
		seaAlert(getSeaPhrase("ERROR_6","BEN")+" "+company+".", null, null, "error");
		if (opener) 
			setTimeout("window.close()",3000);
		LoadError = true;
		return;
	}
	setNHBaseDate(self.jsreturn.record[0].alphadata3);
	_DateRange = parseFloat(self.jsreturn.record[0].numeric1);
	getEmployee();		
}
function checkNHDate(dte)
{
	if (typeof(dte) == "undefined" || dte == null || dte == "")
	{	
		stopProcessing();
		if (_BaseDateCode == "SN")
			seaAlert(getSeaPhrase("ERROR_117","BEN"), null, null, "error");
		else if (_BaseDateCode == "HI")
			seaAlert(getSeaPhrase("ERROR_118","BEN"), null, null, "error");
		else if (_BaseDateCode == "AN")
			seaAlert(getSeaPhrase("ERROR_119","BEN"), null, null, "error");
		else if (_BaseDateCode == "AJ")
			seaAlert(getSeaPhrase("ERROR_120","BEN"), null, null, "error");
		else if (_BaseDateCode == "B1")
			seaAlert(getSeaPhrase("ERROR_121","BEN"), null, null, "error");
		else if (_BaseDateCode == "B2")
			seaAlert(getSeaPhrase("ERROR_122","BEN"), null, null, "error");
		else if (_BaseDateCode == "B3")
			seaAlert(getSeaPhrase("ERROR_123","BEN"), null, null, "error");
		else if (_BaseDateCode == "B4")
			seaAlert(getSeaPhrase("ERROR_124","BEN"), null, null, "error");
		else if (_BaseDateCode == "B5")
			seaAlert(getSeaPhrase("ERROR_125","BEN"), null, null, "error");
		if (opener) 
			setTimeout("window.close()",3000);
		LoadError = true;
		return false;
	}
	return true;
}
function getEmployee()
{
	if (emssObjInstance.emssObj.emailAddressType.toString().toLowerCase() == "personal")
	{
		if (!appObj)
			appObj = new AppVersionObject(authUser.prodline, "HR");
		if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
		{
			setTimeout("getEmployee()", 10);
			return;
		}		
	}	
	var obj = new DMEObject(prodline,"employee");
	obj.out = "JAVASCRIPT";
	obj.index = "empset1";
	obj.field = "employee;last-name;first-name;full-name;nick-name;"
	+ "fica-nbr;pay-rate;pay-step;pay-grade;schedule;paemployee.birthdate;salary-class;"
	+ "pay-frequency;ot-plan-code;email-address";
	if ((emssObjInstance.emssObj.emailAddressType.toString().toLowerCase() == "personal") && appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "10.00.00")
		obj.field += ";email-personal";
	if (_BaseDate != "")
		obj.field += ";" + _BaseDate;
	obj.key = company + "=" + employee;
	obj.max = "1";
	obj.debug = false;
	DME(obj,"jsreturn");
}
var noGo = false;
function DspEmployee()
{
	var obj = self.jsreturn.record[0];
	if (typeof(obj) == "undefined") 
	{
		stopProcessing();		
		seaAlert(getSeaPhrase("ERROR_98","BEN"), null, null, "error");
		if (opener) 
			setTimeout("window.close()",3000);
		LoadError = true;
		return;
	}
	if (rule_type == "N" && _BaseDate != "") 
	{
		var _BaseDateReturn	= _BaseDate.split('-').join('_');
		_BaseDateReturn	= _BaseDateReturn.split('.').join('_');
		var dte	= eval('obj.'+_BaseDateReturn);
		if (!checkNHDate(dte))
			return;	
		BenefitRules[1] = formjsDate(formatDME(dte));
		BenefitRules[2] = formjsDate(formatDME(dte));
		rulesCurrentDate = BenefitRules[1];
		rulesNewDate = BenefitRules[2];
		var dtediff = getDteDifference(formjsDate(formatDME(dte)),ymdtoday);
		if (dtediff < 0 || dtediff > _DateRange)
			noGo = true;		
	}
	lastname = obj.last_name;
	firstname = obj.first_name;
	fullname = obj.full_name;
	nickname = obj.nick_name;
	dateofbirth = obj.paemployee_birthdate;
	ficanbr = obj.fica_nbr;
	emppaystep = obj.pay_step;
	emppaygrade = obj.pay_grade;
	empschedule = obj.schedule;
	empsalary = obj.pay_rate;
	salaryclass = obj.salary_class;
	emppayfreq = obj.pay_frequency;
	otplancode = obj.ot_plan_code;
	emailaddress = obj.email_address;
	if ((emssObjInstance.emssObj.emailAddressType.toString().toLowerCase() == "personal") && appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "10.00.00")
		emailaddress = obj.email_personal;
	CheckPayRate();
}
function CheckPayRate()
{
	if ((NonSpace(empsalary) == 0 || empsalary==0) && NonSpace(emppaystep) != 0) 
	{
		var object = new DMEObject(prodline, "prsagdtl")
		object.out = "JAVASCRIPT"
		object.index = "sgdset3"
		object.field = "pay-rate"
		object.select = "effect-date<=" + authUser.date
		object.key = parseInt(company,10) +"="+ escape(empschedule,1)
		+ "=" + escape(emppaygrade,1) +"="+ escape(emppaystep,1)
		object.max = "1";
		object.func = "DspPrsagdtl()";
		DME(object,"jsreturn");
	}
	else 
		GoToBulletin();
}
function DspPrsagdtl()
{
	if (self.jsreturn.NbrRecs)
		empsalary = self.jsreturn.record[0].pay_rate;
	GoToBulletin();
}
function GoToBulletin()
{
	var title = "";
	if (process == "newhire")
		title = getSeaPhrase("NEW_HIRE_ENROLLMENT","BEN");
	else
		title = getSeaPhrase("BEN_ENROLL","BEN");
	setWinTitle(title);
	self.main.setWinTitle(title);
	setTaskHeader("header", title, "Benefits");
	var subTitle;
	if (noGo || rule_type == "N")
	{
		subTitle = getSeaPhrase("WELCOME_NH","BEN");
		self.document.getElementById("main").src = "/lawson/xbnnet/benbulletin_nh.htm";
	}	
	else
	{
		subTitle = getSeaPhrase("WELCOME_AE","BEN")
		self.document.getElementById("main").src = "/lawson/xbnnet/benbulletin.htm";
	}	
	self.document.getElementById("main").style.visibility = "visible";
	stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[subTitle]));
	fitToScreen();
}
function loadBenefits()
{
	initAppVars();
	BenefitRules = new Array();
	startProcessing(getSeaPhrase("LOOK_UP_EMP_INFO","BEN"), function(){getRules("I");});
}
function getRules(fc)
{
	if (LoadError) 
		return;
	if (fc == "+")
		fc = "%2B";
	self.lawheader.count = 0;
	NbrRecs = 0;
	if (fc == "I") 
	{
		TC_val = "";
		HK_val = "";
	}
	if (fc == "%2B" && TC_val == "") 
	{
		if (rule_type == "N") 
		{		
			BenefitRules[1] = rulesCurrentDate;
			BenefitRules[2] = rulesNewDate;			
			if (typeof(BenefitRules[12]) != "undefined")
			{			
				setNHBaseDate(BenefitRules[12]);
				_DateRange = parseFloat(BenefitRules[13]);
				if (isNaN(_DateRange))
					_DateRange = 0;
				if (!checkNHDate(BenefitRules[14]))
					return;				
				BenefitRules[1] = BenefitRules[14];
				BenefitRules[2] = BenefitRules[14];
				rulesCurrentDate = BenefitRules[1];
				rulesNewDate = BenefitRules[2];
				var dtediff = getDteDifference(BenefitRules[14],ymdtoday);
				if (dtediff < 0 || dtediff > _DateRange)
				{
					noGo = true;
					stopProcessing();
					var msg = getSeaPhrase("NHBULLETIN_1","BEN")+' '+_DateRange+' '
					msg += getSeaPhrase("NHBULLETIN_2","BEN")+' '+_BaseDateWord+'.'
					msg += ' '+getSeaPhrase("NHBULLETIN_14","BEN");					
					seaAlert(msg, null, null, "error");
					if (opener) 
						setTimeout("window.close()",3000);
					LoadError = true;
					return;
				}			
			}		
			//unable to find new hire rules from BS09
			if (BenefitRules[2] == "" && nhRulesFromBS09)
			{
				noGo = true;
				stopProcessing();
				seaAlert(getSeaPhrase("ERROR_136","BEN"), null, null, "error");
				if (opener) 
					setTimeout("window.close()",3000);
				LoadError = true;
				return;				
			}	
		}
		if (typeof(BenefitRules[10]) != "undefined" && BenefitRules[10] == "Y")
			startProcessing(getSeaPhrase("WAIT","ESS"), showDependentsScreen);
		else if (typeof(BenefitRules[11]) != "undefined" && BenefitRules[11] == "Y")
			startProcessing(getSeaPhrase("WAIT","ESS"), showSmokerScreen);
		else
			startProcessing(getSeaPhrase("LOOK_UP_EMP_INFO","BEN"), getdependents);
	} 
	else 
	{
		updatetype = "RLE";
		var obj = new AGSObject(prodline,"BS09.1");
	 	obj.event = "ADD";
	 	obj.rtn = "DATA";
	 	obj.longNames = true;
	 	obj.tds = false;
		obj.debug = false;
	 	obj.field = "FC=" + fc
		+ "&BAE-COMPANY=" + escape(company)
		+ "&BAE-EMPLOYEE=" + escape(employee)
		+ "&BAE-RULE-TYPE=" + escape(rule_type);
		if (fc == "%2B")
			obj.field += "&_f2=" + escape(TC_val) + "&_f288=" + escape(HK_val);
		obj.func = "parent.getRules('%2B')";
		AGS(obj,"jsreturn");
	}
}
function showDependentsScreen()
{	
	self.document.getElementById("main").src = "/lawson/xhrnet/dependents.htm?from=benenroll";
	fitToScreen();
}
function showSmokerScreen()
{
	self.document.getElementById("main").src = "/lawson/xbnnet/smoker.htm";
	fitToScreen();
}
function continueEnrollment(task)
{	
	if (task == "dependents" && typeof(BenefitRules[11]) != "undefined" && BenefitRules[11] == "Y")
		startProcessing(getSeaPhrase("WAIT","ESS"), showSmokerScreen);
	else
		startProcessing(getSeaPhrase("LOOK_UP_EMP_INFO","ESS"), getdependents);
}
function setSmokerStatus(formObj)
{
	var status = "";
	for (var i=0; i<formObj.yesorno.length; i++)
	{
		if (formObj.yesorno[i].checked)
		{
			status = formObj.yesorno[i].value;
			break;
		}
	}
	if (status == "")
		seaAlert(getSeaPhrase("SELECT_Y_OR_N","BEN"));
	else
	{	
		if (LastDoc[LastDoc.length-1] != baseurl + "smoker.htm")
			LastDoc[LastDoc.length] = baseurl + "smoker.htm";
		currentdoc = LastDoc.length-1;
		startProcessing(getSeaPhrase("HOME_ADDR_42","ESS"), function(){ProcessSmokerStatus(status);});
	}
}
function ProcessSmokerStatus(status)
{
	var agsObj = new AGSObject(authUser.prodline, "HR11.1");
	agsObj.event = "CHANGE";
	agsObj.rtn = "MESSAGE";
	agsObj.longNames = "ALL";
	agsObj.tds = false;
	agsObj.field = "FC=C"
	+ "&EFFECT-DATE=" + ymdtoday
	+ "&EMP-COMPANY=" + parseInt(authUser.company,10)
	+ "&EMP-EMPLOYEE=" + parseInt(authUser.employee,10)
	+ "&PEM-SMOKER=" + status
	+ "&XMIT-HREMP-BLOCK=1000000000"
	+ "&XMIT-REQDED=1"
	+ "&PT-BYPASS-PERS-ACT=1";
	agsObj.func = "parent.smokerStatusDone()";
	agsObj.debug = false;
	updatetype = "SMK";
	AGS(agsObj,"jsreturn");
}
function smokerStatusDone()
{
	startProcessing(getSeaPhrase("LOOK_UP_EMP_INFO","BEN"), getdependents);
}
function getdependents()
{
	var obj = new DMEObject(prodline, "emdepend");
	obj.out = "JAVASCRIPT";
	obj.index = "emdset1";
	obj.field = "last-name;first-name;label-name-1;dep-type;student;cur-age;seq-nbr;disabled;birthdate";
	obj.key = company +"="+ employee;
	obj.max	= "600";
	obj.debug = false;
	obj.cond = "Active";
	DME(obj,"jsreturn");
}
var spouseExists = false;
var depsExist = false;
var domParterExists = false;
function DspEmdepend()
{
	dependents = self.jsreturn.record;
	for (var i=0; i<dependents.length; i++) 
	{
		if (dependents[i].dep_type == "S")
			spouseExists = true;
		else if (dependents[i].dep_type == "D")
			depsExist = true;
		if (dependents[i].dep_type == "P")
			domParterExists = true;			
		var bdate = formjsDate(formatDME(dependents[i].birthdate));
		var tday = ymdtoday.substring(0,4);
		var age = parseFloat(getDteDifference(parseFloat(bdate), parseFloat(BenefitRules[2])));
		if ((age/365) > 4) 
		{
			lpyrs = (age/365)/4;
			age -= lpyrs;
		}
		age = age/365
		age += ''
		if (age.indexOf(".") != -1)
			age = age.substring(0, age.indexOf("."));
		dependents[i].cur_age = age;
		//GDD  09/18/14  Deps are all caps anyway.
		//dependents[i].last_name = capital(dependents[i].last_name);
		//dependents[i].first_name = capital(dependents[i].first_name);
	}
	checkCurrentEnroll();
}
function checkCurrentEnroll()
{
	if (rule_type == "A" && (parseFloat(BenefitRules[3]) > parseFloat(ymdtoday) || parseFloat(BenefitRules[4]) < parseFloat(ymdtoday))) 
	{
		stopProcessing();		
		seaAlert(getSeaPhrase("CURBEN_30","BEN"), null, null, "error");
		if (opener) 
			setTimeout("window.close()",3000);
		LoadError = true;
	} 
	else 
	{
		var obj = new DMEObject(prodline,"bnben");
		obj.debug = false;
		obj.out = "JAVASCRIPT";
		obj.index = "bnbset1";
		obj.field = "fc;enroll-date;plan-type;plan-code;cover-opt;mult-salary;cover-amt;pay-rate;pct-amt-flag;start-date;pre-aft-flag;smoker-flag;"
		+ "emp-pre-cont;emp-aft-cont;stop-date;pend-evidence;ytd-cont;rcd-type;plan-group;cop-cov-desc;dep-cover-amt;cov-pct;flex-cost;emp-cost;comp-cost;"
		+ "update-date;alphadata1;numeric1;date1;plan-desc;create-trans;tran-reason;member-id;plan.waive-flag";
		obj.key = company +"="+ employee;
		obj.max = "600";
		obj.otmmax = "1";
		DME(obj,"jsreturn");
	}
}

function CheckEnrollDatesPending()
{
	var msg1 = getSeaPhrase("NHBULLETIN_29","BEN");
	var msg2 = getSeaPhrase("NHBULLETIN_30","BEN");
	var msg3 = getSeaPhrase("NHBULLETIN_31","BEN");
	var futurebens, existingbens;
	futurebens = existingbens = false;
	var pendedBens = ElectedPlans;	
	var eligBens = EligPlans;
 	for (var i=0; i<pendedBens.length; i++) 
 	{
 		var isPending = false;
		for (var j=1; j<eligBens.length; j++)
 		{
 			if (eligBens[j][1] == pendedBens[i][2][99] && eligBens[j][2] == pendedBens[i][2][98])
 			{
 				isPending = true;
 				break;
 			}
 		}
 		if (isPending)
		{
 			if (pendedBens[i][5] > BenefitRules[2])
 				futurebens = true;
			else if (pendedBens[i][5] < BenefitRules[2])
				existingbens = true;
			if (futurebens && existingbens)
				break;
		}
	}
	if (futurebens && existingbens) 
	{
		stopProcessing();		
		seaAlert(msg3, null, null, "error");
		if (opener) 
			setTimeout("window.close()",3000);
		LoadError = true;
		return
	} 
	else if (futurebens) 
	{
		stopProcessing();	
		seaAlert(msg1, null, null, "error")
		if (opener) 
			setTimeout("window.close()",3000);
		LoadError = true;
		return
	} 
	else if (existingbens) 
	{
		stopProcessing();		
		seaAlert(msg2, null, null, "error")
		if (opener) 
			setTimeout("window.close()",3000);
		LoadError = true;
		return
	}
	EligPlanGroups = new Array();
	if (typeof(BenefitRules[8]) != "undefined" && BenefitRules[8] == "Y")
		FlexDollars("I");
	else
		getPlanGroupLimits("I");
}
var nbrpending = 0;
var getdeps = false;
function DspBnben()
{
	nbrpending = parseInt(self.jsreturn.NbrRecs);
	var cnt = 0;
	if (rule_type=="N" && nbrpending > 0) 
	{
		stopProcessing();		
		seaAlert(getSeaPhrase("ERROR_99","BEN"), null, null, "error");
		if (opener)
			setTimeout("window.close()",3000);
		LoadError = true;
		return;
	}
	PriorElectedPlans = new Array();
	savedplans = false;
	if (nbrpending != 0) 
	{
	 	for (var i=0; i<nbrpending; i++) 
	 	{
			obj = self.jsreturn.record[i]
			obj.cover_opt = doParseFloat(obj.cover_opt)
			obj.mult_salary = doParseFloat(obj.mult_salary)
			obj.cover_amt = doParseFloat(obj.cover_amt)
			obj.pay_rate = doParseFloat(obj.pay_rate)
			obj.emp_pre_cont = doParseFloat(obj.emp_pre_cont)
			obj.emp_aft_cont = doParseFloat(obj.emp_aft_cont)
			obj.ytd_cont = doParseFloat(obj.ytd_cont)
			obj.dep_cover_amt = doParseFloat(obj.dep_cover_amt)
			obj.cov_pct = doParseFloat(obj.cov_pct)
			obj.flex_cost = doParseFloat(obj.flex_cost)
			obj.comp_cost = doParseFloat(obj.comp_cost)
			if (!getdeps && (obj.plan_type == "HL" || obj.plan_type == "DN" || obj.plan_type == "DL"))
				getdeps = true
			if (obj.stop_date == "") 
			{
				var startDate = formjsDate(formatDME(obj.start_date))
				if (startDate == BenefitRules[2])
					verifyPlanGrps = true
				if (obj.emp_cost.indexOf("-")!=-1) 
				{
					obj.emp_cost = obj.emp_cost.substring(0,obj.emp_cost.indexOf("-"))
					obj.emp_cost = doParseFloat(obj.emp_cost)*-1
					obj.emp_cost = obj.emp_cost+''
				} 
				else
					obj.emp_cost = doParseFloat(obj.emp_cost)
				ElectedPlans[cnt] = new Array()
				ElectedPlans[cnt][0] = obj.rcd_type
				ElectedPlans[cnt][1] = obj.plan_desc
				ElectedPlans[cnt][3] = obj.plan_group
				ElectedPlans[cnt][5] = startDate
				ElectedPlans[cnt][7] = obj.create_trans				
				ElectedPlans[cnt][8] = obj.tran_reason				
				ElectedPlans[cnt][9] = obj.member_id
				ElectedPlans[cnt][2] = new Array()
				for (var j=0; j<42; j++)
					ElectedPlans[cnt][2][j] = ''
				ElectedPlans[cnt][2][42] = obj.create_trans
				ElectedPlans[cnt][2][43] = obj.tran_reason				
				ElectedPlans[cnt][2][44] = obj.member_id
				ElectedPlans[cnt][2][65] = obj.plan_waive_flag
				if (doParseFloat(obj.rcd_type) == 1) 
				{
					ElectedPlans[cnt][2][1]	= obj.cover_opt
					ElectedPlans[cnt][2][2]	= obj.cop_cov_desc
					ElectedPlans[cnt][2][3]	= obj.pre_aft_flag
					ElectedPlans[cnt][2][4]	= obj.pre_aft_flag
					ElectedPlans[cnt][2][5]	= doParseFloat(obj.emp_cost)
					ElectedPlans[cnt][2][6]	= obj.flex_cost
					ElectedPlans[cnt][2][8]	= obj.comp_cost
					ElectedPlans[cnt][2][9]	= obj.rcd_type
					ElectedPlans[cnt][2][10] = obj.plan_group
					ElectedPlans[cnt][2][11] = obj.plan_type
					ElectedPlans[cnt][2][12] = obj.plan_code
					ElectedPlans[cnt][2][24] = obj.pct_amt_flag
					ElectedPlans[cnt][2][25] = obj.emp_pre_cont
					ElectedPlans[cnt][2][26] = obj.emp_aft_cont
					ElectedPlans[cnt][2][99] = obj.plan_type
					ElectedPlans[cnt][2][98] = obj.plan_code
				}
				else if (doParseFloat(obj.rcd_type) == 2) 
				{
					if (obj.plan_type=="DL")	
					{
						//PT119301:do not deduce the coverage type since the CVR-LIFE-ADD-FLG flag is 
						//not stored in the pending file.  In this case, always display "Dependents". 
						ElectedPlans[cnt][2][4] = "D"
					}					
					ElectedPlans[cnt][2][5]	= obj.cover_amt
					ElectedPlans[cnt][2][7]	= obj.dep_cover_amt
					ElectedPlans[cnt][2][6]	= obj.plan_type
					ElectedPlans[cnt][2][8]	= obj.plan_code
					ElectedPlans[cnt][2][14] = obj.cover_amt
					ElectedPlans[cnt][2][15] = obj.pre_aft_flag
					ElectedPlans[cnt][2][18] = obj.emp_cost
					ElectedPlans[cnt][2][20] = obj.flex_cost
					ElectedPlans[cnt][2][24] = obj.comp_cost
					ElectedPlans[cnt][2][37] = obj.plan_type
					ElectedPlans[cnt][2][51] = obj.pct_amt_flag
					ElectedPlans[cnt][2][63] = obj.emp_pre_cont
					ElectedPlans[cnt][2][64] = obj.emp_aft_cont					
					ElectedPlans[cnt][2][99] = obj.plan_type
					ElectedPlans[cnt][2][38] = obj.plan_code
					ElectedPlans[cnt][2][98] = obj.plan_code
				}
				else if (doParseFloat(obj.rcd_type) == 3 || doParseFloat(obj.rcd_type) == 13) 
				{
					ElectedPlans[cnt][2][6]	= obj.plan_type
					ElectedPlans[cnt][2][8]	= obj.plan_code
					ElectedPlans[cnt][2][17] = obj.mult_salary
					ElectedPlans[cnt][2][14] = obj.cover_amt
					ElectedPlans[cnt][2][15] = obj.pre_aft_flag
					ElectedPlans[cnt][2][18] = obj.emp_cost
					ElectedPlans[cnt][2][20] = obj.flex_cost
					ElectedPlans[cnt][2][24] = obj.comp_cost
					ElectedPlans[cnt][2][37] = obj.plan_type
					ElectedPlans[cnt][2][51] = obj.pct_amt_flag
					ElectedPlans[cnt][2][63] = obj.emp_pre_cont
					ElectedPlans[cnt][2][64] = obj.emp_aft_cont					
					ElectedPlans[cnt][2][38] = obj.plan_code
					ElectedPlans[cnt][2][99] = obj.plan_type
					ElectedPlans[cnt][2][98] = obj.plan_code
				}
				else if (doParseFloat(obj.rcd_type) == 4) 
				{
					ElectedPlans[cnt][2][17] = obj.cover_amt
					ElectedPlans[cnt][2][6]	= obj.plan_type
					ElectedPlans[cnt][2][8]	= obj.plan_code
					ElectedPlans[cnt][2][15] = obj.pre_aft_flag
					ElectedPlans[cnt][2][18] = obj.emp_cost
					ElectedPlans[cnt][2][20] = obj.flex_cost
					ElectedPlans[cnt][2][24] = obj.comp_cost
					ElectedPlans[cnt][2][37] = obj.plan_type
					ElectedPlans[cnt][2][38] = obj.plan_code
					ElectedPlans[cnt][2][51] = obj.pct_amt_flag
					ElectedPlans[cnt][2][63] = obj.emp_pre_cont
					ElectedPlans[cnt][2][64] = obj.emp_aft_cont					
					ElectedPlans[cnt][2][99] = obj.plan_type
					ElectedPlans[cnt][2][98] = obj.plan_code
				}
				else if (doParseFloat(obj.rcd_type) == 5) 
				{
					ElectedPlans[cnt][2][12] = obj.cov_pct
					ElectedPlans[cnt][2][14] = obj.cover_amt
					ElectedPlans[cnt][2][37] = obj.plan_type
					ElectedPlans[cnt][2][38] = obj.plan_code
					ElectedPlans[cnt][2][15] = obj.pre_aft_flag
					ElectedPlans[cnt][2][18] = obj.emp_cost
					ElectedPlans[cnt][2][20] = obj.flex_cost
					ElectedPlans[cnt][2][24] = obj.comp_cost
					ElectedPlans[cnt][2][37] = obj.plan_type
					ElectedPlans[cnt][2][38] = obj.plan_code
					ElectedPlans[cnt][2][51] = obj.pct_amt_flag
					ElectedPlans[cnt][2][63] = obj.emp_pre_cont
					ElectedPlans[cnt][2][64] = obj.emp_aft_cont					
					ElectedPlans[cnt][2][99] = obj.plan_type
					ElectedPlans[cnt][2][98] = obj.plan_code
				}
				else if (doParseFloat(obj.rcd_type) == 6) 
				{
					ElectedPlans[cnt][2][23] = obj.pay_rate
					ElectedPlans[cnt][2][24] = obj.pct_amt_flag
					ElectedPlans[cnt][2][38] = obj.plan_type
					ElectedPlans[cnt][2][39] = obj.plan_code
					ElectedPlans[cnt][2][26] = obj.pre_aft_flag
					ElectedPlans[cnt][2][16] = obj.emp_cost
					ElectedPlans[cnt][2][18] = obj.flex_cost
					ElectedPlans[cnt][2][22] = obj.comp_cost
					ElectedPlans[cnt][2][38] = obj.plan_type
					ElectedPlans[cnt][2][39] = obj.plan_code
					ElectedPlans[cnt][2][37] = obj.cover_opt
					ElectedPlans[cnt][2][40] = obj.cover_opt
					ElectedPlans[cnt][2][42] = obj.pct_amt_flag
					ElectedPlans[cnt][2][56] = obj.emp_pre_cont
					ElectedPlans[cnt][2][57] = obj.emp_aft_cont					
					ElectedPlans[cnt][2][99] = obj.plan_type
					ElectedPlans[cnt][2][98] = obj.plan_code
					ElectedPlans[cnt][2][19] = -1
				}
				else if (doParseFloat(obj.rcd_type) == 7) 
				{
					ElectedPlans[cnt][2][23] = obj.mult_salary
					ElectedPlans[cnt][2][38] = obj.plan_type
					ElectedPlans[cnt][2][39] = obj.plan_code
					ElectedPlans[cnt][2][26] = obj.pre_aft_flag
					ElectedPlans[cnt][2][16] = obj.emp_cost
					if (ElectedPlans[cnt][2][16]=='')
						ElectedPlans[cnt][2][16] = obj.emp_pre_cont
					if (ElectedPlans[cnt][2][16]=='')
						ElectedPlans[cnt][2][16] = obj.emp_aft_cont
					ElectedPlans[cnt][2][18] = obj.flex_cost
					ElectedPlans[cnt][2][22] = obj.comp_cost
					ElectedPlans[cnt][2][24] = obj.pct_amt_flag
					ElectedPlans[cnt][2][38] = obj.plan_type
					ElectedPlans[cnt][2][39] = obj.plan_code
					ElectedPlans[cnt][2][37] = obj.cover_opt
					ElectedPlans[cnt][2][56] = obj.emp_pre_cont
					ElectedPlans[cnt][2][57] = obj.emp_aft_cont					
					ElectedPlans[cnt][2][99] = obj.plan_type
					ElectedPlans[cnt][2][98] = obj.plan_code
				}
				else if (doParseFloat(obj.rcd_type) == 8) 
				{
					ElectedPlans[cnt][2][24] = obj.pct_amt_flag
					if (obj.pct_amt_flag == "A" || obj.pct_amt_flag == "B") 
					{
						var paydivisor = 1
						if (BenefitRules[6] == "P" && obj.cover_opt)
							paydivisor = obj.cover_opt
						else if (BenefitRules[6] == "M")
							paydivisor = 12
						else if (BenefitRules[6] == "S")
							paydivisor = 24
						ElectedPlans[cnt][2][23] = obj.emp_pre_cont/doParseFloat(paydivisor)
						ElectedPlans[cnt][2][36] = obj.emp_aft_cont/doParseFloat(paydivisor)
					} 
					else 
					{
						ElectedPlans[cnt][2][23] = obj.emp_pre_cont
						ElectedPlans[cnt][2][36] = obj.emp_aft_cont
					}
					ElectedPlans[cnt][2][38] = obj.plan_type
					ElectedPlans[cnt][2][39] = obj.plan_code
					ElectedPlans[cnt][2][26] = obj.pre_aft_flag
					ElectedPlans[cnt][2][16] = obj.emp_cost
					ElectedPlans[cnt][2][18] = obj.flex_cost
					ElectedPlans[cnt][2][22] = obj.comp_cost
					ElectedPlans[cnt][2][38] = obj.plan_type
					ElectedPlans[cnt][2][39] = obj.plan_code
					ElectedPlans[cnt][2][37] = obj.numeric1
					ElectedPlans[cnt][2][37] = obj.cover_opt
					ElectedPlans[cnt][2][41] = doParseFloat(obj.flex_cost) + doParseFloat(obj.emp_pre_cont) + doParseFloat(obj.emp_aft_cont)
					ElectedPlans[cnt][2][42] = obj.pct_amt_flag
					ElectedPlans[cnt][2][56] = obj.emp_pre_cont
					ElectedPlans[cnt][2][57] = obj.emp_aft_cont					
					ElectedPlans[cnt][2][99] = obj.plan_type
					ElectedPlans[cnt][2][98] = obj.plan_code
				}
				else if (doParseFloat(obj.rcd_type) == 9) 
				{
					ElectedPlans[cnt][2][24] = obj.pct_amt_flag
					if (obj.pct_amt_flag == "A" || obj.pct_amt_flag == "B") 
					{
						var paydivisor = 1
						if (BenefitRules[6] == "P" && obj.cover_opt)
							paydivisor = obj.cover_opt
						else if (BenefitRules[6] == "M")
							paydivisor = 12
						else if (BenefitRules[6] == "S")
							paydivisor = 24
						ElectedPlans[cnt][2][23] = obj.emp_pre_cont/doParseFloat(paydivisor)
						ElectedPlans[cnt][2][36] = obj.emp_aft_cont/doParseFloat(paydivisor)
					} 
					else 
					{
						ElectedPlans[cnt][2][23] = obj.emp_pre_cont
						ElectedPlans[cnt][2][36] = obj.emp_aft_cont
					}					
					ElectedPlans[cnt][2][38] = obj.plan_type
					ElectedPlans[cnt][2][39] = obj.plan_code
					ElectedPlans[cnt][2][26] = obj.pre_aft_flag
					ElectedPlans[cnt][2][16] = obj.emp_cost
					ElectedPlans[cnt][2][18] = obj.flex_cost
					ElectedPlans[cnt][2][22] = obj.comp_cost
					ElectedPlans[cnt][2][38] = obj.plan_type
					ElectedPlans[cnt][2][39] = obj.plan_code
					ElectedPlans[cnt][2][37] = obj.cover_opt
					ElectedPlans[cnt][2][41] = doParseFloat(obj.flex_cost) + doParseFloat(obj.emp_pre_cont) + doParseFloat(obj.emp_aft_cont)
					ElectedPlans[cnt][2][42] = obj.pct_amt_flag
					ElectedPlans[cnt][2][56] = obj.emp_pre_cont
					ElectedPlans[cnt][2][57] = obj.emp_aft_cont					
					ElectedPlans[cnt][2][99] = obj.plan_type
					ElectedPlans[cnt][2][98] = obj.plan_code
				}
				else if (doParseFloat(obj.rcd_type) == 10) 
				{
					ElectedPlans[cnt][2][24] = obj.pct_amt_flag
					ElectedPlans[cnt][2][26] = obj.pre_aft_flag
					ElectedPlans[cnt][2][16] = obj.emp_cost
					ElectedPlans[cnt][2][18] = obj.flex_cost
					ElectedPlans[cnt][2][22] = obj.comp_cost
					ElectedPlans[cnt][2][38] = obj.plan_type
					ElectedPlans[cnt][2][39] = obj.plan_code
					ElectedPlans[cnt][2][56] = obj.emp_pre_cont
					ElectedPlans[cnt][2][57] = obj.emp_aft_cont					
					ElectedPlans[cnt][2][99] = obj.plan_type
					ElectedPlans[cnt][2][98] = obj.plan_code
				}
				else if (doParseFloat(obj.rcd_type) == 12) 
				{
 					ElectedPlans[cnt][2][1]	= obj.plan_type
 					ElectedPlans[cnt][2][2]	= obj.plan_code
					ElectedPlans[cnt][2][38] = obj.plan_type
					ElectedPlans[cnt][2][39] = obj.plan_code
					ElectedPlans[cnt][2][99] = obj.plan_type
					ElectedPlans[cnt][2][98] = obj.plan_code
				}
				alreadyElect = "Y";
				cnt++;
			}
   		}
		oldelected = new Array();
		for (var i=0; i<ElectedPlans.length; i++)
			oldelected[i] = ElectedPlans[i];
		oldElectionsIn = "PENDING";
		if (getdeps)	
		{
			var obj = new DMEObject(prodline,"depben");
			obj.out = "JAVASCRIPT";
			obj.index = "depset1";
			obj.field = "dependent;plan-type;emp-start;plan-code";
			obj.max = "600";
			obj.func = "CheckCurrentBens('I')";
			obj.key = company+"="+employee;
			obj.debug = false;
			DME(obj,"jsreturn");
		} 
		else
			CheckCurrentBens("I");
	} 
	else
		CheckCurrentBens("I");
}
var NewDepList = new Array()
var NewDateDepList = new Array()
var CurrentDepList = new Array()
// Save a copy of elected plans array
var PriorElectedPlans = new Array()
var savedplans = false
function CheckCurrentBens(fc)
{
	if (LoadError) 
		return;
	var AGSMsg = self.lawheader.gmsg;
	if(fc == "+")
		fc = "%2B";
	if (nbrpending > 0) 
	{
		if (getdeps) 
		{
			NewDepList = self.jsreturn.record;
			StoreDependentInfo(NewDepList,DependentBens);
			getdeps = false;
		} 
		else if (typeof(DependentBens) == "undefined")
			DependentBens = new Array();
	}
	if (!savedplans) 
	{
		savedplans = true;
		for(var i=0; i<ElectedPlans.length; i++)
			PriorElectedPlans[i] = ElectedPlans[i];
		ElectedPlans = new Array();
	}
	if (fc == "I" || fc == null) 
	{
		TC_val = "";
		HK_val = "";
		NbrRecs = 1;
	}
	if (fc == "%2B" && TC_val == "") 
	{
		if (AGSMsg.toUpperCase().indexOf("PAGEDOWN") != -1) 
		{
			// PT 151848
			TC_val = "BS10.1";
			CheckCurrentBens("%2B");
			return;
		}
		alreadyElected();
		return;
	}
	updatetype = "CHK";
	self.lawheader.count = 0;
	var obj = new AGSObject(prodline,"BS10.1");
	obj.event = "ADD";
	obj.rtn	= "DATA";
	obj.longNames = true;
	obj.debug = false;
	obj.tds	= false;
	obj.field = "FC="+fc
	+ "&BEN-COMPANY=" 	+ escape(company)
	+ "&BEN-EMPLOYEE=" 	+ escape(employee)
	+ "&BAE-CURRENT-DATE=" 	+ escape(BenefitRules[2])
	+ "&BAE-NEW-DATE=" 	+ escape(BenefitRules[2])
	+ "&BAE-COST-DIVISOR=" 	+ escape(BenefitRules[6])
	+ "&BAE-RULE-TYPE=" 	+ escape(rule_type)
	+ "&BFS-FAMILY-STATUS=";
	obj.func = "parent.CheckCurrentBens('%2B')";
	if (fc == "%2B") 
	{
		obj.field += "&PT-COMPANY=" + escape(PT_Company)
		+ "&PT-EMPLOYEE=" + escape(PT_Employee)
		+ "&PT-PROCESS-LEVEL=" + escape(PT_Process_Level,1).toString().replace("+","%2B")
		+ "&PT-FAMILY-STATUS=" + escape(PT_Family_Status)
		+ "&PT-GROUP-NAME=" + escape(PT_Group_Name,1).toString().replace("+","%2B")
		+ "&PT-PROCESS-ORDER=" + escape(PT_Process_Order)
		+ "&PT-PLN-PLAN-TYPE=" + escape(PT_Plan_Type,1).toString().replace("+","%2B")
		+ "&PT-PLN-PLAN-CODE=" + escape(PT_Plan_Code,1).toString().replace("+","%2B")
		+ "&PT-BEN-START-DATE=" + escape(PT_Ben_Start_Date)
		+ "&PT-FIELDS-SET=Y";
	}
	startProcessing(getSeaPhrase("RETRIEVE_CUR_BENS","BEN"), function(){AGS(obj,"jsreturn");});
}
function alreadyElected()
{
	var oldplans = oldelected;
	oldelected = new Array();
	for (var i=0; i<oldplans.length; i++)
		oldelected[i] = oldplans[i];
	if (ElectedPlans.length > 0 && nbrpending > 0) 
	{
		stopProcessing();		
		seaAlert(getSeaPhrase("ERROR_100","BEN"), null, null, "error");
		if (opener) 
			setTimeout("window.close()",3000);
		LoadError = true;
		return;
	} 
	else 
	{
		if (ElectedPlans.length == 0 && nbrpending >= 0)
			ElectedPlans = PriorElectedPlans;
		CurrentBenefits("I");
	}
}
// Do we have at least one current ben where BEN-START-DATE == BAE-NEW-DATE?
var verifyPlanGrps = false 
function CurrentBenefits(fc)
{
	if (LoadError) 
		return;
	var AGSMsg = self.lawheader.gmsg;
	self.lawheader.count = 0;
	if (fc == "+")
		fc = "%2B";
	if (fc == "I" || fc == null) 
	{
		TC_val = "";
		HK_val = "";
		NbrRecs = 0;
		self.lawheader.bncount = 0;
	}
	if (fc == "%2B" && TC_val == "") 
	{
		if (AGSMsg.toUpperCase().indexOf("PAGEDOWN") != -1) 
		{
			TC_val = "BS10.1";
			CurrentBenefits("%2B");
			return;
		}
		if (rule_type == "N" && CurrentBens.length > 0) 
		{
			stopProcessing();			
			seaAlert(getSeaPhrase("CURBEN_31","BEN"), null, null, "error");
			if (opener) 
				setTimeout("window.close()",3000);
			LoadError = true;
			return;
		}
		CheckEnrollDates();
	} 
	else 
	{
		updatetype = "BEN";
		var obj = new AGSObject(prodline,"BS10.1");
		obj.event = "ADD";
		obj.debug = false;
		obj.rtn	= "DATA";
		obj.longNames = true;
		obj.tds	= false;
		obj.field = "FC="+fc
			+ "&BEN-COMPANY=" 	+ escape(company)
			+ "&BEN-EMPLOYEE=" 	+ escape(employee)
			+ "&BAE-CURRENT-DATE=" 	+ escape(BenefitRules[1])
			+ "&BAE-NEW-DATE=" 	+ escape(BenefitRules[2])
			+ "&BAE-COST-DIVISOR=" 	+ escape(BenefitRules[6])
			+ "&BAE-RULE-TYPE=" 	+ escape(rule_type)
			+ "&BFS-FAMILY-STATUS=";
		obj.func = "parent.CurrentBenefits('%2B')"
		if (fc == "%2B") 
		{
			obj.field += "&PT-COMPANY=" + escape(PT_Company)
			+ "&PT-EMPLOYEE=" + escape(PT_Employee)
			+ "&PT-PROCESS-LEVEL=" + escape(PT_Process_Level,1).toString().replace("+","%2B")
			+ "&PT-FAMILY-STATUS=" + escape(PT_Family_Status)
			+ "&PT-GROUP-NAME=" + escape(PT_Group_Name,1).toString().replace("+","%2B")
			+ "&PT-PROCESS-ORDER=" + escape(PT_Process_Order)
			+ "&PT-PLN-PLAN-TYPE=" + escape(PT_Plan_Type,1).toString().replace("+","%2B")
			+ "&PT-PLN-PLAN-CODE=" + escape(PT_Plan_Code,1).toString().replace("+","%2B")
			+ "&PT-BEN-START-DATE=" + escape(PT_Ben_Start_Date)
			+ "&PT-FIELDS-SET=Y";
		}
		startProcessing(getSeaPhrase("RETRIEVE_CUR_BENS","BEN"), function(){AGS(obj,"jsreturn");});
	}
}
// Current bens where BEN-START-DATE != BAE-NEW-DATE
var NewCurrentBens = new Array();
NewCurrentBens[0] = "";
function CheckEnrollDates()
{
	var msg1 = getSeaPhrase("NHBULLETIN_8","BEN");
	var msg2 = getSeaPhrase("NHBULLETIN_9","BEN");
	var msg3 = getSeaPhrase("NHBULLETIN_10","BEN");
	var msg4 = getSeaPhrase("NHBULLETIN_11","BEN");
	var futurebens, existingbens;
	futurebens = existingbens = getdeps = false;
	NewCurrentBens = new Array();
	NewCurrentBens[0] = "";
	for (var i=1; i<CurrentBens.length; i++) 
	{
		if (!getdeps && (CurrentBens[i][1] == "HL" || CurrentBens[i][1] == "DN" || CurrentBens[i][1] == "DL"))
			getdeps = true;
		if (!verifyPlanGrps && (CurrentBens[i][3] == BenefitRules[2]))
			verifyPlanGrps = true;
		else if (CurrentBens[i][3] > BenefitRules[2])
			futurebens = true;
		else if (BenefitRules[1] < CurrentBens[i][3] && CurrentBens[i][3] < BenefitRules[2])
			existingbens = true;
		if (CurrentBens[i][3] != BenefitRules[2])
			NewCurrentBens[NewCurrentBens.length] = CurrentBens[i];
		if (futurebens && existingbens)
			break;
	}
	if (futurebens && existingbens) 
	{
		stopProcessing();		
		seaAlert(msg4, null, null, "error");
		if (opener) 
			setTimeout("window.close()",3000);
		LoadError = true;
		return;
	} 
	else if (futurebens) 
	{
		stopProcessing();	
		seaAlert(msg2, null, null, "error");
		if (opener) 
			setTimeout("window.close()",3000)
		LoadError = true;
		return;
	} 
	else if (existingbens) 
	{
		stopProcessing();		
		seaAlert(msg3+".", null, null, "error");
		if (opener) 
			setTimeout("window.close()",3000);
		LoadError = true;
		return;
	}
	if (CurrentBens != NewCurrentBens)
		CurrentBens = NewCurrentBens;
	if (getdeps)
		GetHrDepBens();
	else 
	{
		if (typeof(DependentBens) == "undefined")
			DependentBens = new Array();
		EligPlan("I");
	}
}
function GetHrDepBens()
{
	var obj = new DMEObject(prodline,"hrdepben");
	obj.out = "JAVASCRIPT";
	obj.index = "hdbset1";
	obj.field = "dependent;plan-type;emp-start;plan-code;start-date;stop-date";
	obj.max = "300";
	obj.func = "DspHrDepBen()";
	obj.debug = false;
	obj.key = company+"="+employee;
	DME(obj,"jsreturn");
}
function DspHrDepBen()
{
	var tempbens = new Array()
	var newtempbens = new Array()
	for (var i=0; i<self.jsreturn.NbrRecs; i++) 
	{
		if (parseFloat(formjsDate(formatDME(self.jsreturn.record[i].start_date)))<=parseFloat(BenefitRules[1]) 
		&& (self.jsreturn.record[i].stop_date=='' || parseFloat(formjsDate(formatDME(self.jsreturn.record[i].stop_date)))>=parseFloat(BenefitRules[1]))) 
			tempbens[tempbens.length] = self.jsreturn.record[i];
		if (parseFloat(formjsDate(formatDME(self.jsreturn.record[i].start_date)))<=parseFloat(BenefitRules[2]) 
		&& (self.jsreturn.record[i].stop_date=='' || parseFloat(formjsDate(formatDME(self.jsreturn.record[i].stop_date)))>parseFloat(BenefitRules[2])))
			newtempbens[newtempbens.length] = self.jsreturn.record[i];
	}
	CurrentDepList = tempbens;
	NewDateDepList = newtempbens;
	StoreCurrentDeps(CurrentDepList,CurrentDeps);
	getdeps = false;
	EligPlan("I");
}
function StoreCurrentDeps(dependentList, CurrentDeps)
{
	var index;
	var dep;
	if (typeof(CurrentDeps) == "undefined") 
	{
		CurrentDeps = new Array();
		CurrentDeps[0] = "";
	}
	for (var i=1; i<CurrentBens.length; i++) 
	{
		for (var j=0; j<dependentList.length; j++) 
		{
			if (CurrentBens[i][2] == dependentList[j].plan_code && CurrentBens[i][1] == dependentList[j].plan_type && CurrentBens[i][3] == formjsDate(formatDME(dependentList[j].emp_start))) 
			{
				dep = SelectDependent(dependentList[j].dependent);
				if (dep == -1) 
					continue;
				if (typeof(CurrentDeps[i]) == "undefined") 
				{
					CurrentDeps[i] = new Array();
					CurrentDeps[i][1] = new Array();
				}
				index = CurrentDeps[i][1].length;
				CurrentDeps[i][1][index] = new Object();
				CurrentDeps[i][1][index].first_name = dependents[dep].first_name;
				CurrentDeps[i][1][index].last_name = dependents[dep].last_name;
				CurrentDeps[i][1][index].dependent = dependentList[j].dependent;
				CurrentDeps[i][1][index].label_name_1 = dependents[dep].label_name_1;
			}
		}
	}
}
function EarliestEligDate()
{
	var EligDate = "";
	for (var i=1; i<EligPlans.length; i++) 
	{
		EligPlans[i][5] = (EligPlans[i][27]) ? EligPlans[i][27] : EligPlans[i][5];
		if (EligPlans[i][22] == "Y" && EligPlans[i][5] != "")	
		{
			if (EligDate == "")
				EligDate = EligPlans[i][5];
			else if (parseInt(EligDate,10) > parseInt(EligPlans[i][5],10))
				EligDate = EligPlans[i][5];
		}
	}
	return EligDate;
}
var FlexDate = "";
function FlexDollars(fc)
{
	if (LoadError) 
		return;
	if (fc == "+")
		fc = "%2B";
	self.lawheader.count = 0;
	NbrRecs = 0;
	if (fc == "I") 
	{
		TC_val = "";
		HK_val = "";
		if (rule_type == "N" && EligFlexExist)
			FlexDate = EarliestEligDate();
		else 
			FlexDate = BenefitRules[1];
	}
	if (fc == "%2B")
		getPlanGroupLimits("I");
	else 
	{
		updatetype = "FLX1";
		var obj = new AGSObject(prodline,"BS11.1");
		obj.event = "ADD";
		obj.rtn	= "DATA";
		obj.debug = false;
		obj.longNames = true;
		obj.tds	= false;
		obj.field = "FC="+fc
		+ "&EFD-COMPANY=" + escape(company)
		+ "&EFD-EMPLOYEE=" + escape(employee)
		+ "&BAE-DATE=" + escape(FlexDate)
		+ "&BAE-COST-DIVISOR=" + escape(BenefitRules[6]);
		obj.func="parent.FlexDollars('%2B')"
		if (fc == "%2B")
			obj.field += "&_f2=" + escape(TC_val) + "&_f288=" + escape(HK_val);
		AGS(obj,"jsreturn");
	}
}	
function EligPlan(fc)
{
	if (LoadError) 
		return;
	if (fc == "+")
		fc = "%2B";
	NbrRecs = 0;
	self.lawheader.count = 0;
	if (fc == "I") 
	{
		self.lawheader.count2 = 0;
		TC_val = "";
		HK_val = "";
	}
	else if (fc == "%2B" && EligPlans.length == 0) 
	{
		stopProcessing();
		if (parseInt(self.lawheader.gmsgnbr,10) != 120)
			seaAlert(getSeaPhrase("NHBULLETIN_12","BEN"), null, null, "error");
		if (opener) 
			setTimeout("window.close()",3000);
		LoadError = true;
		return;
	}
	if (inquireComplete == "Y") 
	{
		if (rule_type == "A" && nbrpending > 0)
			CheckEnrollDatesPending();
		else
		{			
			EligPlanGroups = new Array();
			if (typeof(BenefitRules[8]) != "undefined" && BenefitRules[8] == "Y")
				FlexDollars("I");
			else
				getPlanGroupLimits("I");
		}	
	} 
	else 
	{
		updatetype = "ELG";
		var obj = new AGSObject(prodline,"BS12.1");
		obj.event = "ADD";
		obj.rtn	= "DATA";
		obj.longNames = true;
		obj.debug = false;
		obj.tds	= false;
		obj.field = "FC="+fc
		+ "&PLN-COMPANY=" + escape(company)
		+ "&EMP-EMPLOYEE=" + escape(employee)
		+ "&BAE-NEW-DATE=" + escape(BenefitRules[2])
		+ "&BAE-RULE-TYPE=" + escape(rule_type)
		+ "&BFS-FAMILY-STATUS="
		+ "&PT-PLAN-TYPE="+escape(nextpt,1).toString().replace("+","%2B")
		+ "&PT-PLAN-CODE="+escape(nextpc,1).toString().replace("+","%2B")
		+ "&"+nextcofld+"="+escape(nextco,1)
		+ "&"+nextempfld+"="+escape(nextemp,1)
		+ "&PT-BAE-RULE-TYPE="+escape(nextrle,1)
		+ "&PT-BFS-FAMILY-STATUS="+escape(nextfs,1)
		+ "&PT-PROCESS-LEVEL="+escape(nextpl,1).toString().replace("+","%2B")
		+ "&PT-GROUP-NAME="+escape(nextgn,1).toString().replace("+","%2B")
		+ "&PT-PROCESS-ORDER="+escape(nextpo,1);
		obj.func = "parent.EligPlan('%2B')";
		inquireComplete	= "Y";
		startProcessing(getSeaPhrase("PREPARE_ENROLL","BEN"), function(){AGS(obj,"jsreturn");});
	}
}
var nextpo = "";
function getPlanGroupLimits(fc)
{
	if (LoadError) 
		return;
	selectedPlanInGrp = new Array();
	var AGSMsg = self.lawheader.gmsg;
	if (fc == "+")
		fc = "%2B";
	for (var i=1; i<EligPlans.length; i++) 
	{
		selectedPlanInGrp[i] = false;
		enrollError[i] = false;
	}
	self.lawheader.count = 0;
	NbrRecs = 0;
	if (fc == "I") 
	{
		TC_val = "";
		HK_val = "";
	}
	if (fc == "%2B" && TC_val == "")
	{
		if (AGSMsg.toUpperCase().indexOf("PAGEDOWN") != -1)
		{
			TC_val = "BS02.1";
			getPlanGroupLimits("%2B");
			return;
		}
		BuildPlanGroups();
	}
	else
	{
		updatetype = "RNM";
		var obj = new AGSObject(prodline,"BS02.1");
		obj.event = "ADD";
		obj.rtn	= "DATA";
		obj.longNames = true;
		obj.tds	= false;
		obj.debug = false;
		obj.field = "FC="+fc
		+ "&BPG-COMPANY=" + escape(company);
		if (fc == "%2B")
			obj.field += "&DKEY-PROTECTED=" +escape(nextpo,1) + "&_HK=" + escape(HK_val);         
		obj.func = "parent.getPlanGroupLimits('%2B')";
		AGS(obj,"jsreturn");
	}
}
function BuildPlanGroups()
{
	currentdate	= FormatDte4(BenefitRules[1]);
	newdate	= FormatDte4(BenefitRules[2]);
	EligPlans[0] = new Array();
	planname = EligPlans[0][8];
	EligPlanGroups[0] = new Array();
	EligPlanGroups[0][0] = EligPlans[0][8];
	EligPlanGroups[0][1] = EligPlans[0][9];
	EligPlanGroups[0][2] = ColorArray[1];
	// store off whether or not each "add-allowed"
	EligPlanGroups[0][3] = new Array();
	// plan for a plan group requires eoi
	for (var i=0; i<EligPlans.length; i++)
	{
		if (EligPlans[i][10]=="" || typeof(EligPlans[i][10])=="undefined" || EligPlans[i][10]==null)
			EligPlans[i][10]="Y"
		if (EligPlans[i][12]=="" || typeof(EligPlans[i][12])=="undefined" || EligPlans[i][12]==null)
			EligPlans[i][12]="Y"
		if (EligPlans[i][14]=="" || typeof(EligPlans[i][14])=="undefined" || EligPlans[i][14]==null)
			EligPlans[i][14]="Y"
		// for each elig plan set a flag to determine if employee has the option to change based on EOI days
		if (rule_type == "N") 
		{
			if (typeof(EligPlans[i][17])=='undefined' || !EligPlans[i][17] || EligPlans[i][17]==null || parseFloat(EligPlans[i][17])>=parseFloat(ymdtoday))
				// within EOI range go ahead
				EligPlans[i][17] = 1; 
			else
				// beyond EOI range can't change plan
				EligPlans[i][17] = 0;
			EligPlans[i][5] = (EligPlans[i][27]) ? EligPlans[i][27] : EligPlans[i][5];
		} 
		else
			//annual enrollment go ahead and change plans
			EligPlans[i][17] = 1;
		if (EligPlans[i][8] != planname) 
		{
			while (true) 
			{
				colorcnt = parseInt(Math.random()*(ColorArray.length-1));
				if (!isNaN(colorcnt))
					break;
			}
			EligPlanGroups[EligPlanGroups.length] = new Array();
       		EligPlanGroups[EligPlanGroups.length-1][0] = EligPlans[i][8];
			EligPlanGroups[EligPlanGroups.length-1][1] = EligPlans[i][9];
			EligPlanGroups[EligPlanGroups.length-1][2] = ColorArray[colorcnt];
			EligPlanGroups[EligPlanGroups.length-1][3] = new Array();
			//PT 161506. Store required plan group flag.
			EligPlanGroups[EligPlanGroups.length-1][4] = EligPlans[i][19];
			planname = EligPlans[i][8];
		}
		if (EligPlans[i][17] == 1) 
			// plan does not require eoi
			EligPlanGroups[EligPlanGroups.length-1][3][EligPlanGroups[EligPlanGroups.length-1][3].length] = false;
		else 					
			// plan requires eoi
			EligPlanGroups[EligPlanGroups.length-1][3][EligPlanGroups[EligPlanGroups.length-1][3].length] = true;
	}
	CurrentPlanGroup = 0;
	if (alreadyElect == "Y") 
	{
		SortBenefits();
		//flag plans that are limit of another plan so they update in the correct order
		SetCoverageLimits();
		DependentBens = new Array();
		if (nbrpending > 0)
			StoreDependentInfo(NewDepList,DependentBens);
		else
			StoreDependentInfo(NewDateDepList,DependentBens);
		keepcheck1();
	} 
	else
	{
		self.document.getElementById("main").src = "/lawson/xbnnet/benbulletin2.htm";
		stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[getSeaPhrase("ENROLLMENT_ORDER","BEN")]));
	}	
}
function SortBenefits()
{
	var temp = new Array()
	for (var i=0; i<EligPlanGroups.length; i++) 
	{
		for (var j=0; j<ElectedPlans.length; j++) 
		{
			if (typeof(EligPlanGroups[i][0])!="undefined" && EligPlanGroups[i][0]==ElectedPlans[j][3])
				temp[temp.length] = ElectedPlans[j];
		}
	}
	ElectedPlans = temp;
}
function SetCoverageLimits()
{
	for (var i=0; i<EligPlans.length; i++) 
	{
		//is this plan's coverage a limit of another plan?
		if (EligPlans[i][20] && EligPlans[i][21])
		{
			for (var j=0; j<ElectedPlans.length; j++) 
			{
				var plan_type = "";
				var plan_code = "";
				if(parseInt(ElectedPlans[j][0],10)==1)
				{
					plan_type = ElectedPlans[j][2][11];
					plan_code = ElectedPlans[j][2][12];
				}
				else if(parseInt(ElectedPlans[j][0],10)>1 && parseInt(ElectedPlans[j][0],10)<6)
				{
					plan_type = ElectedPlans[j][2][37];
					plan_code = ElectedPlans[j][2][38];
				}
				else if(parseInt(ElectedPlans[j][0],10)>5 && parseInt(ElectedPlans[j][0],10)<11)
				{
					plan_type = ElectedPlans[j][2][38];
					plan_code = ElectedPlans[j][2][39];
				}
				else if(parseInt(ElectedPlans[j][0],10)==12)
				{
					plan_type = ElectedPlans[j][2][1];
					plan_code = ElectedPlans[j][2][2];
				}			
				//if the employee has elected this plan, flag that it is a limit of another plan
				if(plan_type == EligPlans[i][1] && plan_code == EligPlans[i][2])
				{
					ElectedPlans[j][2][6] = EligPlans[i][20];
					ElectedPlans[j][2][8] = EligPlans[i][21];
					break;
				}
			}
		}
	}
}
function StoreDependentInfo(dependentList,DependentBens)
{
	var index;
	var dep;
	if (typeof(DependentBens) == "undefined")
		DependentBens = new Array();
	for (var i=0; i<ElectedPlans.length; i++) 
	{
		for (var j=0; j<dependentList.length; j++)
		{
			if (ElectedPlans[i][2][98] == dependentList[j].plan_code && ElectedPlans[i][2][99] == dependentList[j].plan_type && ElectedPlans[i][5] == formjsDate(formatDME(dependentList[j].emp_start)))
			{
				dep = SelectDependent(dependentList[j].dependent);
				if (dep == -1) 
					continue;
				if (typeof(DependentBens[i])=="undefined") 
				{
					DependentBens[i] = new Array();
					DependentBens[i][1] = new Array();
				}
				index = DependentBens[i][1].length;
				DependentBens[i][1][index] = new Object();
				DependentBens[i][1][index].first_name = dependents[dep].first_name;
				DependentBens[i][1][index].last_name = dependents[dep].last_name;
				DependentBens[i][1][index].dependent = dependentList[j].dependent;
			}
		}
	}
}
function doParseFloat(str)
{
	if (str)
		return parseFloat(str);
	else
		return 0;
}
function setelected(temp)
{
	if (parseFloat(temp[3]) == parseFloat(BenefitRules[2]))
		alreadyElect = "Y";
	ElectedPlans[ElectedPlans.length] = new Array()
	ElectedPlans[ElectedPlans.length-1][5] = temp[3]
	ElectedPlans[ElectedPlans.length-1][0] = temp[22]
	ElectedPlans[ElectedPlans.length-1][1] = temp[5]
	ElectedPlans[ElectedPlans.length-1][2] = new Array()
	ElectedPlans[ElectedPlans.length-1][3] = temp[32]
	ElectedPlans[ElectedPlans.length-1][7] = temp[41]
	ElectedPlans[ElectedPlans.length-1][8] = temp[42]
	ElectedPlans[ElectedPlans.length-1][9] = temp[43]
	for (var j=0; j<42; j++)
		ElectedPlans[ElectedPlans.length-1][2][j] = ''
	ElectedPlans[ElectedPlans.length-1][2][9] = temp[3]		
	ElectedPlans[ElectedPlans.length-1][2][42] = temp[41]
	ElectedPlans[ElectedPlans.length-1][2][43] = temp[42]
	ElectedPlans[ElectedPlans.length-1][2][44] = temp[43]
	ElectedPlans[ElectedPlans.length-1][2][65] = temp[46]
	temp[18] = doParseFloat(temp[18])
	temp[19] = doParseFloat(temp[19])
	if (doParseFloat(ElectedPlans[ElectedPlans.length-1][0]) == 1)	
	{
		ElectedPlans[ElectedPlans.length-1][2][1] = temp[16]
		ElectedPlans[ElectedPlans.length-1][2][2] = temp[23]
		ElectedPlans[ElectedPlans.length-1][2][3] = temp[13]
		ElectedPlans[ElectedPlans.length-1][2][6] = temp[21]
		ElectedPlans[ElectedPlans.length-1][2][4] = temp[13]
		ElectedPlans[ElectedPlans.length-1][2][5] = doParseFloat(temp[18]) + doParseFloat(temp[19])
		ElectedPlans[ElectedPlans.length-1][2][8] = temp[12]
		ElectedPlans[ElectedPlans.length-1][2][11] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][12] = temp[2]
		ElectedPlans[ElectedPlans.length-1][2][24] = temp[11]		                                          	       
		ElectedPlans[ElectedPlans.length-1][2][42] = temp[11]
		ElectedPlans[ElectedPlans.length-1][2][25] = temp[18]
		ElectedPlans[ElectedPlans.length-1][2][26] = temp[19]		                                          	       
		ElectedPlans[ElectedPlans.length-1][2][99] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98] = temp[2]		                                          	       
	}
	else if (doParseFloat(ElectedPlans[ElectedPlans.length-1][0]) == 2)	
	{
		ElectedPlans[ElectedPlans.length-1][2][4] = temp[31]
		ElectedPlans[ElectedPlans.length-1][2][2] = temp[5]
		ElectedPlans[ElectedPlans.length-1][2][5] = temp[8]
		ElectedPlans[ElectedPlans.length-1][2][7] = temp[24]
		ElectedPlans[ElectedPlans.length-1][2][14] = temp[8]
		ElectedPlans[ElectedPlans.length-1][2][20] = temp[21]
		ElectedPlans[ElectedPlans.length-1][2][15] = temp[13]
		ElectedPlans[ElectedPlans.length-1][2][18] = doParseFloat(temp[18]) + doParseFloat(temp[19])
		ElectedPlans[ElectedPlans.length-1][2][24] = temp[12]
		ElectedPlans[ElectedPlans.length-1][2][42] = temp[11]
		ElectedPlans[ElectedPlans.length-1][2][37] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][38] = temp[2]
		ElectedPlans[ElectedPlans.length-1][2][63] = temp[18]
		ElectedPlans[ElectedPlans.length-1][2][64] = temp[19]		                                          	       
		ElectedPlans[ElectedPlans.length-1][2][99] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98] = temp[2]		                                          	       
	}
	else if (doParseFloat(ElectedPlans[ElectedPlans.length-1][0]) == 3 || doParseFloat(ElectedPlans[ElectedPlans.length-1][0]) == 13)
	{
		ElectedPlans[ElectedPlans.length-1][2][2] = temp[5]
		ElectedPlans[ElectedPlans.length-1][2][17] = temp[9]
		ElectedPlans[ElectedPlans.length-1][2][20] = temp[21]
		ElectedPlans[ElectedPlans.length-1][2][14] = temp[8]
		ElectedPlans[ElectedPlans.length-1][2][15] = temp[13]
		ElectedPlans[ElectedPlans.length-1][2][18] = doParseFloat(temp[18]) + doParseFloat(temp[19])
		ElectedPlans[ElectedPlans.length-1][2][24] = temp[12]
		ElectedPlans[ElectedPlans.length-1][2][42] = temp[11]
		ElectedPlans[ElectedPlans.length-1][2][37] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][38] = temp[2]
		ElectedPlans[ElectedPlans.length-1][2][63] = temp[18]
		ElectedPlans[ElectedPlans.length-1][2][64] = temp[19]		                                          	       
		ElectedPlans[ElectedPlans.length-1][2][99] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98] = temp[2]		                                          	       
	}
	else if (doParseFloat(ElectedPlans[ElectedPlans.length-1][0]) == 4)
	{
		ElectedPlans[ElectedPlans.length-1][2][2] = temp[5]
		ElectedPlans[ElectedPlans.length-1][2][17] = temp[8]
		ElectedPlans[ElectedPlans.length-1][2][20] = temp[21]
		ElectedPlans[ElectedPlans.length-1][2][15] = temp[13]
		ElectedPlans[ElectedPlans.length-1][2][18] = doParseFloat(temp[18])+doParseFloat(temp[19])
		ElectedPlans[ElectedPlans.length-1][2][24] = temp[12]
		ElectedPlans[ElectedPlans.length-1][2][42] = temp[11]
		ElectedPlans[ElectedPlans.length-1][2][37] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][38] = temp[2]
		ElectedPlans[ElectedPlans.length-1][2][63] = temp[18]
		ElectedPlans[ElectedPlans.length-1][2][64] = temp[19]		                                          	       
		ElectedPlans[ElectedPlans.length-1][2][99] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98] = temp[2]
	}
	else if (doParseFloat(ElectedPlans[ElectedPlans.length-1][0]) == 5)
	{
		ElectedPlans[ElectedPlans.length-1][2][2] = temp[5]
		ElectedPlans[ElectedPlans.length-1][2][12] = temp[20]
	    ElectedPlans[ElectedPlans.length-1][2][14] = temp[8]
		ElectedPlans[ElectedPlans.length-1][2][15] = temp[13]
		ElectedPlans[ElectedPlans.length-1][2][20] = temp[21]
		ElectedPlans[ElectedPlans.length-1][2][18] = doParseFloat(temp[18]) + doParseFloat(temp[19])
		ElectedPlans[ElectedPlans.length-1][2][24] = temp[12]
		ElectedPlans[ElectedPlans.length-1][2][42] = temp[11]
		ElectedPlans[ElectedPlans.length-1][2][37] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][38] = temp[2]
		ElectedPlans[ElectedPlans.length-1][2][63] = temp[18]
		ElectedPlans[ElectedPlans.length-1][2][64] = temp[19]		                                          	       
		ElectedPlans[ElectedPlans.length-1][2][99] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98] = temp[2] 		                                          	       
	}
	else if (doParseFloat(ElectedPlans[ElectedPlans.length-1][0]) == 6)
	{
		ElectedPlans[ElectedPlans.length-1][2][2] = temp[5]
		ElectedPlans[ElectedPlans.length-1][2][23] = temp[27]
		ElectedPlans[ElectedPlans.length-1][2][26] = temp[13]
		ElectedPlans[ElectedPlans.length-1][2][16] = temp[37]
		ElectedPlans[ElectedPlans.length-1][2][22] = temp[12]
		ElectedPlans[ElectedPlans.length-1][2][38] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][39] = temp[2]
		var covOpt = (temp[44]) ? temp[44] : temp[16]
		ElectedPlans[ElectedPlans.length-1][2][37] = covOpt
		ElectedPlans[ElectedPlans.length-1][2][40] = covOpt
		ElectedPlans[ElectedPlans.length-1][2][56] = temp[18]
		ElectedPlans[ElectedPlans.length-1][2][57] = temp[19]		                                          	       
		ElectedPlans[ElectedPlans.length-1][2][99] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98] = temp[2]
		ElectedPlans[ElectedPlans.length-1][2][42] = temp[11]
		ElectedPlans[ElectedPlans.length-1][2][24] = temp[11]
		ElectedPlans[ElectedPlans.length-1][2][17] = (temp[45]) ? temp[45] : 0				
	}
	else if (doParseFloat(ElectedPlans[ElectedPlans.length-1][0]) == 7) 
	{
		ElectedPlans[ElectedPlans.length-1][2][2] = temp[5]
		ElectedPlans[ElectedPlans.length-1][2][23] = temp[25]
		ElectedPlans[ElectedPlans.length-1][2][26] = temp[13]
		ElectedPlans[ElectedPlans.length-1][2][16] = doParseFloat(temp[18]) + doParseFloat(temp[19])
		ElectedPlans[ElectedPlans.length-1][2][18] = temp[21]
		ElectedPlans[ElectedPlans.length-1][2][22] = temp[12]
		ElectedPlans[ElectedPlans.length-1][2][42] = temp[11]
		ElectedPlans[ElectedPlans.length-1][2][38] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][39] = temp[2]
		ElectedPlans[ElectedPlans.length-1][2][37] = 1
		ElectedPlans[ElectedPlans.length-1][2][56] = temp[18]
		ElectedPlans[ElectedPlans.length-1][2][57] = temp[19]		
		ElectedPlans[ElectedPlans.length-1][2][99] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98] = temp[2]		                                          	       
	}
	else if (doParseFloat(ElectedPlans[ElectedPlans.length-1][0]) == 8)	
	{
		ElectedPlans[ElectedPlans.length-1][2][2] = temp[5]
		ElectedPlans[ElectedPlans.length-1][2][23] = temp[18]
		ElectedPlans[ElectedPlans.length-1][2][36] = temp[19]
		ElectedPlans[ElectedPlans.length-1][2][26] = temp[13]
		ElectedPlans[ElectedPlans.length-1][2][16] = temp[37]
		ElectedPlans[ElectedPlans.length-1][2][22] = temp[12]
		ElectedPlans[ElectedPlans.length-1][2][24] = temp[11]
		ElectedPlans[ElectedPlans.length-1][2][38] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][39] = temp[2]
        var covOpt = (temp[44]) ? temp[44] : temp[16]
		ElectedPlans[ElectedPlans.length-1][2][37] = covOpt
		ElectedPlans[ElectedPlans.length-1][2][41] = temp[27]
		ElectedPlans[ElectedPlans.length-1][2][42] = temp[11]
		ElectedPlans[ElectedPlans.length-1][2][56] = temp[18]
		ElectedPlans[ElectedPlans.length-1][2][57] = temp[19]		                                          	       
		ElectedPlans[ElectedPlans.length-1][2][99] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98] = temp[2]		                                          	       
	}
	else if (doParseFloat(ElectedPlans[ElectedPlans.length-1][0]) == 9)	
	{
		ElectedPlans[ElectedPlans.length-1][2][2] = temp[5]
		ElectedPlans[ElectedPlans.length-1][2][23] = temp[18]
		ElectedPlans[ElectedPlans.length-1][2][36] = temp[19]
		ElectedPlans[ElectedPlans.length-1][2][26] = temp[13]
		ElectedPlans[ElectedPlans.length-1][2][16] = temp[37]
		ElectedPlans[ElectedPlans.length-1][2][22] = temp[12]
		ElectedPlans[ElectedPlans.length-1][2][24] = temp[11]
		ElectedPlans[ElectedPlans.length-1][2][38] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][39] = temp[2]
		var covOpt = (temp[44]) ? temp[44] : temp[16]
		ElectedPlans[ElectedPlans.length-1][2][37] = covOpt
		ElectedPlans[ElectedPlans.length-1][2][41] = temp[27]
		ElectedPlans[ElectedPlans.length-1][2][42] = temp[11]
		ElectedPlans[ElectedPlans.length-1][2][56] = temp[18]
		ElectedPlans[ElectedPlans.length-1][2][57] = temp[19]
		ElectedPlans[ElectedPlans.length-1][2][99] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98] = temp[2]		                                          	       
	}
	else if (doParseFloat(ElectedPlans[ElectedPlans.length-1][0]) == 10) 
	{
		ElectedPlans[ElectedPlans.length-1][2][2] = temp[5]
		ElectedPlans[ElectedPlans.length-1][2][26] = temp[13]
		ElectedPlans[ElectedPlans.length-1][2][16] = doParseFloat(temp[18]) + doParseFloat(temp[19])
		ElectedPlans[ElectedPlans.length-1][2][22] = temp[12]
		ElectedPlans[ElectedPlans.length-1][2][18] = temp[21]
		ElectedPlans[ElectedPlans.length-1][2][42] = temp[11]
		ElectedPlans[ElectedPlans.length-1][2][38] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][39] = temp[2]
		ElectedPlans[ElectedPlans.length-1][2][56] = temp[18]
		ElectedPlans[ElectedPlans.length-1][2][57] = temp[19]		                                          	       
		ElectedPlans[ElectedPlans.length-1][2][99] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98] = temp[2]
		ElectedPlans[ElectedPlans.length-1][2][99] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98] = temp[2]		                                          	       
	}
	else if (doParseFloat(ElectedPlans[ElectedPlans.length-1][0]) == 12) 
	{
		ElectedPlans[ElectedPlans.length-1][2][2] = temp[5]
		ElectedPlans[ElectedPlans.length-1][2][42] = temp[11]
		ElectedPlans[ElectedPlans.length-1][2][1] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][2] = temp[2]
		ElectedPlans[ElectedPlans.length-1][2][38] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][39] = temp[2]
		ElectedPlans[ElectedPlans.length-1][2][99] = temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98] = temp[2]
	}
	oldelected = new Array();
	oldelected = ElectedPlans;
	oldElectionsIn = "SYSTEM";
}
