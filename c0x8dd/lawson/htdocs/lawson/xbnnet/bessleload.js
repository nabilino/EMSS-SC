// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/bessleload.js,v 1.14.2.50 2014/02/24 22:02:27 brentd Exp $
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
function getEmployee()
{	
	company = authUser.company;
	employee = authUser.employee;
	prodline = authUser.prodline;
	if (emssObjInstance.emssObj.emailAddressType.toString().toLowerCase() == "personal")
	{	
		if (!appObj)
			appObj = new AppVersionObject(prodline, "HR");
		// if you call getAppVersion() right away and the IOS object isn't set up yet,
		// then the code will be trying to load the sso.js file, and your call for
		// the appversion will complete before the ios version is set
		if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
		{
			setTimeout("getEmployee()", 10);
			return;
		}
	}	
	var obj = new DMEObject(prodline,"employee");
	obj.out = "JAVASCRIPT";
	obj.index = "empset1";
	obj.field = "employee;last-name;first-name;full-name;nick-name;fica-nbr;pay-rate;pay-step;pay-grade;schedule;"			
	+ "paemployee.birthdate;salary-class;pay-frequency;ot-plan-code;email-address";
	if ((emssObjInstance.emssObj.emailAddressType.toString().toLowerCase() == "personal") && appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "10.00.00")
		obj.field += ";email-personal";
	obj.key = company +"="+ employee;		
	obj.max = "1";
	obj.debug = false;
	DME(obj,"jsreturn");
}
function DspEmployee()
{
	obj = self.jsreturn.record[0];
	lastname = obj.last_name;
	firstname = obj.first_name;
	fullname = obj.full_name;
	nickname = obj.nick_name;
	dateofbirth = obj.paemployee_birthdate;
	ficanbr	= obj.fica_nbr;
	empsalary = obj.pay_rate;
	emppaystep = obj.pay_step;
	emppaygrade	= obj.pay_grade;
	empschedule	= obj.schedule;
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
		var object = new DMEObject(prodline, "prsagdtl");
		object.out = "JAVASCRIPT";
		object.index = "sgdset3";
		object.field = "pay-rate";
		object.select = "effect-date<="+authUser.date;
		object.key = parseInt(company,10)+"="+escape(empschedule,1)+"="+escape(emppaygrade,1)+"="+escape(emppaystep,1);
		object.max = "1";
		object.func	= "DspPrsagdtl()";
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
	setWinTitle(getSeaPhrase("LIFE_EVENT_ENROLLMENT","BEN"));
	if (typeof(event)!='undefined' && event!='' && typeof(eventdte)!='undefined' && eventdte!='')
	{
		self.document.getElementById("main").src = baseurl+"benbulletin_le.htm";
		stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[getSeaPhrase("WELCOME_LE","BEN")]));
	}	
	else
	{
		stopProcessing();
		seaAlert(getSeaPhrase("NHBULLETIN_18","BEN"), null, null, "error");
		if (window.opener) 
			setTimeout("window.close()",3000);
		LoadError = true;
	}
	self.document.getElementById("main").style.visibility = "visible";
	fitToScreen();
}
function loadLEBenefits()
{
	initAppVars();
	BenefitRules = new Array();	
	startProcessing(getSeaPhrase("LOOK_UP_EMP_INFO","BEN"), getFamilyStatusHistory);
}	
function getFamilyStatusHistory()
{
	if (LoadError)
		return;
	updatetype = "FSH";
	window.lawheader.count = 0;
	var obj = new AGSObject(prodline,"ES10.1");
	obj.event = "ADD";
	obj.rtn = "DATA";
	obj.longNames = true;
	obj.tds = false;
	obj.field = "FC=I"
	+ "&FSH-COMPANY=" + escape(company)
	+ "&FSH-EMPLOYEE=" + escape(employee)
	+ "&FSH-FAMILY-STATUS=" + escape(eventname.toUpperCase())
	+ "&FSH-EFFECT-DATE=" + eventdte;
	obj.func = "parent.getdependents()";
	obj.debug = false;
	AGS(obj,"jsreturn");
}
function getdependents()
{
	if (updatetype != 'FSH')
	{
		stopProcessing();		
		//FSH record does not exist
		seaAlert(getSeaPhrase("NHBULLETIN_18","BEN"), null, null, "error");
		if (window.opener) 
			setTimeout("window.close()",3000);
		LoadError = true;
	}
	else
	{
		var obj = new DMEObject(prodline,"emdepend");
		obj.out = "JAVASCRIPT";
		obj.index = "emdset1";
		obj.field = "last-name;first-name;label-name-1;dep-type;student;cur-age;seq-nbr;disabled;birthdate";
		obj.key = company+"="+employee;
		obj.max = "600";
		obj.debug = false;
		obj.cond = "Active";
		DME(obj,"jsreturn");
	}
}
var spouseExists = false;
var depsExist = false;
var domParterExists = false;
function DspEmdepend()
{
	dependents = jsreturn.record;
	for (var i=0; i<dependents.length; i++)
	{
		if (dependents[i].dep_type == "S")
			spouseExists = true;
		else if (dependents[i].dep_type == "D")
			depsExist = true;
		if (dependents[i].dep_type == "P")
			domParterExists = true;			
		var bdate = formjsDate(formatDME(dependents[i].birthdate));
		var tday = ymdtoday.substring(0,4)
		var age = parseFloat(getDteDifference(bdate, ymdtoday));
		if ((age/365) > 4)
		{
			lpyrs = (age/365)/4;
			age -= lpyrs;
		}
		age = age/365;
		age += '';
		if (age.indexOf(".")!=-1)
			age = age.substring(0, age.indexOf("."));
		dependents[i].cur_age = age;
		dependents[i].last_name = capital(dependents[i].last_name);
		dependents[i].first_name = capital(dependents[i].first_name);
	}
	if (typeof(window.lawheader.FSHobject.Benefit_update) != "undefined" && window.lawheader.FSHobject.Benefit_update == "Y")
	{
		var html = '<div class="plaintablecell"><p>'+getSeaPhrase("ERROR_112","BEN")+'</p></div>';
		self.main.document.getElementById("paneBody").innerHTML = html;
		stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));		
	}
	else
		startProcessing(getSeaPhrase("LOOK_UP_EMP_INFO","BEN"), function(){getRules("I");});
}
function getRules(fc)
{
	if (LoadError) 
		return;
	window.lawheader.count = 0;
	NbrRecs = 0;
	if(fc == "+")
		fc = "%2B";
	if (fc == "I")
	{
		TC_val = "";
		HK_val = "";
	}
	if (fc == "%2B" && TC_val == "")
	{
		if (typeof(BenefitRules[10]) != "undefined" && BenefitRules[10] == "Y")
			startProcessing(getSeaPhrase("WAIT","ESS"), showDependentsScreen);
		else if (typeof(BenefitRules[11]) != "undefined" && BenefitRules[11] == "Y")
			startProcessing(getSeaPhrase("WAIT","ESS"), showSmokerScreen);
		else
			startProcessing(getSeaPhrase("LOOK_UP_EMP_INFO","BEN"), checkCurrentEnroll);
	}
	else
	{
		updatetype = "RLE";
		var obj = new AGSObject(prodline,"BS09.1");
	 	obj.event = "ADD";
		obj.rtn	= "DATA";
		obj.longNames = true;
		obj.tds	= false;
		obj.field = "FC="+fc
		+ "&BAE-COMPANY=" + escape(company)
		+ "&BAE-EMPLOYEE=" + escape(employee)
		+ "&BAE-RULE-TYPE=F";
		if (fc == "%2B")
			obj.field += "&_f2=" + escape(TC_val) + "&_f288=" + escape(HK_val);
		obj.func = "parent.getRules('%2B')";
		obj.debug = false;
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
		startProcessing(getSeaPhrase("LOOK_UP_EMP_INFO","ESS"), checkCurrentEnroll);
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
		seaAlert(getSeaPhrase("SELECT_Y_OR_N","BEN"), null, null, "error");
	else
	{
		if (LastDoc[LastDoc.length-1] != baseurl + "smoker.htm")
			LastDoc[LastDoc.length]=baseurl + "smoker.htm";
		currentdoc = LastDoc.length - 1;
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
	startProcessing(getSeaPhrase("LOOK_UP_EMP_INFO","BEN"), checkCurrentEnroll);
}
function checkCurrentEnroll()
{
	var obj = new DMEObject(prodline,"bnben");
	obj.debug = false;
	obj.out = "JAVASCRIPT";
	obj.index = "bnbset1";
	obj.field = "plan-type;plan-code;start-date";
	obj.key = company +"="+ employee;
	obj.max = "1";
	obj.otmmax = "1";
	DME(obj,"jsreturn");
}
var nbrpending = 0;
var getdeps = false;
function DspBnben()
{
	nbrpending = parseInt(self.jsreturn.NbrRecs);
	if (nbrpending > 0)
	{
		stopProcessing();	
		seaAlert(getSeaPhrase("ERROR_113","BEN"), null, null, "error");
		if (window.opener) 
			setTimeout("window.close()",3000);
		LoadError = true;
		return;
	}
	EligPlan("I");
}
function EligPlan(fc)
{
	if (LoadError) 
		return;	
	if (fc == "+")
		fc = "%2B";
	BenefitRules[1] = ymdtoday;
	BenefitRules[2] = eventdte;
	NbrRecs = 0;
	window.lawheader.count = 0;
	if (fc == "I")
	{
		window.lawheader.count2 = 0;
		TC_val = "";
		HK_val = "";
	}
	else if (fc == "%2B" && EligPlans.length == 0)
	{
		stopProcessing();
		seaAlert(getSeaPhrase("NHBULLETIN_19","BEN"), null, null, "error");
		if (window.opener) 
			setTimeout("window.close()",3000);
 		LoadError = true;
		return;
	}
	if (inquireComplete == "Y")
		CurrentBenefits("I");
	else
	{
		updatetype = "ELG";
		var obj = new AGSObject(prodline,"BS12.1");
	 	obj.event = "ADD";
	 	obj.rtn = "DATA";
	 	obj.longNames = true;
	 	obj.tds = false;
	 	obj.field = "FC="+fc
		+ "&PLN-COMPANY=" + escape(company)
		+ "&EMP-EMPLOYEE=" + escape(employee)
		+ "&BAE-RULE-TYPE=" + rule_type
		+ "&BFS-FAMILY-STATUS=" + escape(eventname.toUpperCase())
		+ "&BAE-NEW-DATE=" + escape(eventdte)
 		+ "&PT-PLAN-TYPE="+escape(nextpt,1).toString().replace("+","%2B")
 		+ "&PT-PLAN-CODE="+escape(nextpc,1).toString().replace("+","%2B")
		+ "&"+nextcofld+"="+escape(nextco,1)+"&"+nextempfld+"="+escape(nextemp,1)
		+ "&PT-BAE-RULE-TYPE="+escape(nextrle,1)+"&PT-BFS-FAMILY-STATUS="+escape(nextfs,1)
		+ "&PT-PROCESS-LEVEL="+escape(nextpl,1).toString().replace("+","%2B")
		+ "&PT-GROUP-NAME="+escape(nextgn,1).toString().replace("+","%2B")
		+ "&PT-PROCESS-ORDER="+escape(nextpo,1);
		obj.func = "parent.EligPlan('%2B')";
	 	inquireComplete = "Y";
	 	obj.debug = false;
	 	startProcessing(getSeaPhrase("PREPARE_ENROLL","BEN"), function(){AGS(obj,"jsreturn");});
	}
}
var verifyPlanGrps = false
function CurrentBenefits(fc)
{
	if (LoadError) 
		return;
	var AGSMsg = window.lawheader.gmsg;
	window.lawheader.count = 0;
	if (fc == "+")
		fc = "%2B";
	if (fc == "I" || fc == null)
	{
		TC_val = "";
		HK_val = "";
		NbrRecs = 0;
		window.lawheader.bncount = 0;
	}
	if (fc == "%2B" && TC_val == "")
	{
		if (AGSMsg.toUpperCase().indexOf("PAGEDOWN") != -1)
		{
			TC_val = "BS10.1";
			CurrentBenefits("%2B");
			return;
		}
		CheckEnrollDates();
	}
	else
	{
		updatetype = "BEN";
		var obj = new AGSObject(prodline,"BS10.1");
	 	obj.event = "ADD";
	 	obj.rtn	= "DATA";
	 	obj.longNames = true;
	 	obj.tds	= false;
	 	obj.field = "FC="+fc
		+ "&BEN-COMPANY=" 	+ escape(company)
		+ "&BEN-EMPLOYEE=" 	+ escape(employee)
		+ "&BAE-CURRENT-DATE=" 	+ escape(eventdte)
		+ "&BAE-NEW-DATE=" 	+ escape(eventdte)
		+ "&BAE-COST-DIVISOR=" 	+ escape(BenefitRules[6])
		+ "&BAE-RULE-TYPE=" 	+ escape(rule_type)
		+ "&BFS-FAMILY-STATUS=" + escape(eventname.toUpperCase());
	 	obj.func = "parent.CurrentBenefits('%2B')";
		if (fc == "%2B")
		{
			obj.field += "&PT-COMPANY=" + escape(PT_Company)
			+ "&PT-EMPLOYEE=" + escape(PT_Employee)
			+ "&PT-PROCESS-LEVEL=" + escape(PT_Process_Level).toString().replace("+","%2B")
			+ "&PT-FAMILY-STATUS=" + escape(PT_Family_Status)
			+ "&PT-GROUP-NAME=" + escape(PT_Group_Name).toString().replace("+","%2B")
			+ "&PT-PROCESS-ORDER=" + escape(PT_Process_Order)
			+ "&PT-PLN-PLAN-TYPE=" + escape(PT_Plan_Type,1).toString().replace("+","%2B")
			+ "&PT-PLN-PLAN-CODE=" + escape(PT_Plan_Code,1).toString().replace("+","%2B")
			+ "&PT-BEN-START-DATE=" + escape(PT_Ben_Start_Date)
			+ "&PT-FIELDS-SET=Y";
		}
	 	obj.debug = false;
	 	startProcessing(getSeaPhrase("RETRIEVE_CUR_BENS","BEN"), function(){AGS(obj,"jsreturn");});
	}
}
function CheckEnrollDates()
{
	var newPlans = new Array();
	newPlans[0] = "";
	var found = false;
	var currentBenIndex = -1;
	// For Life Events Enrollment, only allow the employee to enroll in plans that have been flagged as Add, Change, 
	// or Stop Allowed on BS03.2.  Remove ineligible plans from the EligPlans and CurrentBens arrays.
	for (var i=1; i<EligPlans.length; i++)
	{
		found = false;
		currentBenIndex = -1;
		for (var j=1; j<CurrentBens.length; j++)
		{
			if (CurrentBens[j][1] == EligPlans[i][1] && CurrentBens[j][2] == EligPlans[i][2])
			{
				currentBenIndex = j;
				// PT 147390:
				// According to BS12/BS03.2, is the change or stop flag set to yes to allow changing this benefit?
				if (EligPlans[i][12] == "Y" || EligPlans[i][14] == "Y")
				{
					newPlans[newPlans.length] = EligPlans[i];
					found = true;
				}
				break;
			}
		}
		if (!found)
		{
			if (EligPlans[i][10] == "Y")
				newPlans[newPlans.length] = EligPlans[i];
			else if (currentBenIndex != -1)
				CurrentBens.splice(currentBenIndex,1);
		}
	}
	EligPlans = newPlans
	if (EligPlans.length == 1)
	{
		stopProcessing();		
		seaAlert(getSeaPhrase("NHBULLETIN_20","BEN"), null, null, "error");
		if (window.opener) 
			setTimeout("window.close()",3000);
 		LoadError = true;
		return;
	}
	var msg = getSeaPhrase("NHBULLETIN_21","BEN");	  
	getdeps = false;
	var dateerror = false;
	for (var i=1; i<CurrentBens.length; i++)
	{
		if (!getdeps && (CurrentBens[i][1] == "HL" || CurrentBens[i][1] == "DN" || CurrentBens[i][1] == "DL"))
			getdeps = true;
		if (CurrentBens[i][3] >= BenefitRules[2])
		{
			stopProcessing();		
			seaAlert(msg, null, null, "error");
			if (window.opener) 
				setTimeout("window.close()",3000);
			LoadError = true;
			return;
		}
		if (!dateerror)
		{
			for (var j=1; j<EligPlans.length; j++)
			{
				if (EligPlans[j][1] == CurrentBens[i][1] && EligPlans[j][2] == CurrentBens[i][2])
				{
					var add_date = EligPlans[j][11];
					var change_date = getNextDay(EligPlans[j][13]);
					var stop_date =	getNextDay(EligPlans[j][15]);
					var ben_start_date = CurrentBens[i][3];
					if ((add_date!="" && add_date<=ben_start_date) || (change_date!="" && change_date<=ben_start_date) 
					|| (stop_date!="" && stop_date<=ben_start_date))
					{
						dateerror = true;
						msg = getSeaPhrase("CANNT_USE","BEN");
						break;
					}
				}
			}
		}
		if (dateerror)
		{
			stopProcessing();			
			seaAlert(msg, null, null, "error");
			if (window.opener) 
				setTimeout("window.close()",3000);
			LoadError = true;
			return;
		}
	}
	if (getdeps)
		GetLeHrDepBens();
	else
	{
		if (typeof(DependentBens) == "undefined")
			DependentBens = new Array();
		if (typeof(BenefitRules[8]) != "undefined" && BenefitRules[8] == "Y")
	 		FlexDollars("I");
		else
			getPlanGroupLimits("I");
	}
}
var CurrentDepList = new Array();
function GetLeHrDepBens()
{
	var obj = new DMEObject(prodline,"hrdepben");
	obj.out = "JAVASCRIPT";
	obj.index = "hdbset1";
	obj.field = "dependent;plan-type;emp-start;plan-code;start-date;stop-date";
	obj.max = "600";
	obj.func = "DspLeHrDepBen()";
	obj.debug = false;
	obj.key = company+"="+employee;
	DME(obj,"jsreturn");
}
function DspLeHrDepBen()
{
	var tempbens = new Array()
	var newtempbens = new Array()
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		if (parseFloat(formjsDate(formatDME(self.jsreturn.record[i].start_date)))<=parseFloat(eventdte) 
		&& (self.jsreturn.record[i].stop_date=='' || parseFloat(formjsDate(formatDME(self.jsreturn.record[i].stop_date)))>=parseFloat(eventdte)))
		{
			tempbens[tempbens.length] = self.jsreturn.record[i];
		}
	}
	CurrentDepList = tempbens;
	StoreCurrentDeps(CurrentDepList,CurrentDeps);
	getdeps = false;
	EligPlanGroups = new Array();
	if (typeof(BenefitRules[8]) != "undefined" && BenefitRules[8] == "Y")
		FlexDollars("I");
	else
		getPlanGroupLimits("I");
}
function StoreCurrentDeps(dependentList,CurrentDeps)
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
			if (CurrentBens[i][2] == dependentList[j].plan_code && CurrentBens[i][1] == dependentList[j].plan_type
			&& CurrentBens[i][3] == formjsDate(formatDME(dependentList[j].emp_start)))
			{
				dep = SelectDependent(dependentList[j].dependent)
				if (dep == -1) continue
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
var FlexDate = "";
function FlexDollars(fc)
{
	if (LoadError) 
		return;
	if (fc == "+")
		fc = "%2B";
	window.lawheader.count = 0;
	NbrRecs = 0;
	if (fc == "I")
	{
		FlexDate = eventdte;
		TC_val = "";
		HK_val = "";
	}
	if (fc == "%2B")
		getPlanGroupLimits("I");
	else
	{
		updatetype = "FLX1";
		FlexDate = eventdte;
		var obj = new AGSObject(prodline,"BS11.1");
	 	obj.event = "ADD";
	 	obj.rtn	= "DATA";
	 	obj.longNames = true;
	 	obj.tds	= false;
	 	obj.field = "FC="+fc
		+ "&EFD-COMPANY=" + escape(company)
		+ "&EFD-EMPLOYEE=" + escape(employee)
		+ "&BAE-DATE=" + escape(eventdte)
		+ "&BAE-COST-DIVISOR=" + escape(BenefitRules[6]);
	 	obj.func = "parent.FlexDollars('%2B')";
		if (fc == "%2B")
			obj.field += "&_f2=" + escape(TC_val) + "&_f288=" + escape(HK_val);
	 	obj.debug = false;
		AGS(obj,"jsreturn");
	}
}
var nextpo = "";
function getPlanGroupLimits(fc)
{
	if (LoadError) 
		return;
	selectedPlanInGrp = new Array();
	var AGSMsg = self.lawheader.gmsg;
	if(fc == "+")
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
	currentdate = FormatDte4(ymdtoday);
	newdate = FormatDte4(eventdte);
	EligPlans[0] = new Array();
	planname = EligPlans[0][8];
	EligPlanGroups[0] = new Array();
	EligPlanGroups[0][0] = EligPlans[0][8];
	EligPlanGroups[0][1] = EligPlans[0][9];
	EligPlanGroups[0][2] = ColorArray[1];
	EligPlanGroups[0][3] = new Array(); // store off whether or not each "add-allowed" plan for a plan group requires eoi
	for (var i=0; i<EligPlans.length; i++)
	{
		if (EligPlans[i][10]=='' || typeof(EligPlans[i][10])=='undefined' || EligPlans[i][10]==null)
			EligPlans[i][10] = 'Y';
		if (EligPlans[i][12]=='' || typeof(EligPlans[i][12])=='undefined' || EligPlans[i][12]==null)
			EligPlans[i][12] = 'Y';
		if (EligPlans[i][14]=='' || typeof(EligPlans[i][14])=='undefined' || EligPlans[i][14]==null)
			EligPlans[i][14] = 'Y';
		//for each elig plan set a flag to determine if employee has the option to change based on EOI days
		if (typeof(EligPlans[i][17])=='undefined' || !EligPlans[i][17] || EligPlans[i][17]==null || parseFloat(EligPlans[i][17])>=parseFloat(ymdtoday))
			EligPlans[i][17] = 1;   //within EOI range go ahead
		else
			EligPlans[i][17] = 0;  //beyond EOI range can't change plan
		if (EligPlans[i][8] != planname)
		{
			while (true)
			{
				colorcnt = parseInt(Math.random()*ColorArray.length);
				if (!isNaN(colorcnt))
					break;
			}
			EligPlanGroups[EligPlanGroups.length] = new Array();
        	EligPlanGroups[EligPlanGroups.length-1][0] = EligPlans[i][8];
			EligPlanGroups[EligPlanGroups.length-1][1] = EligPlans[i][9];
			EligPlanGroups[EligPlanGroups.length-1][2] = ColorArray[colorcnt];
			EligPlanGroups[EligPlanGroups.length-1][3] = new Array();
			EligPlanGroups[EligPlanGroups.length-1][4] = EligPlans[i][19];
			planname = EligPlans[i][8];
		}
		if (EligPlans[i][10] == "Y")
		{
			if (EligPlans[i][17] == 1) // "add-allowed" plan does not require eoi
				EligPlanGroups[EligPlanGroups.length-1][3][EligPlanGroups[EligPlanGroups.length-1][3].length] = false;
			else 					// "add-allowed" plan requires eoi
				EligPlanGroups[EligPlanGroups.length-1][3][EligPlanGroups[EligPlanGroups.length-1][3].length] = true;
		}
	}
	// error out if any of our plan groups require eoi for every "add-allowed" plan in the group
	for (var j=1; j<EligPlanGroups.length; j++)
	{
		var GrpEOI = true;  // flag whether each "add-allowed" plan requires eoi per group
		for (var k=0; k<EligPlanGroups[j][3].length; k++)
		{
			if (!EligPlanGroups[j][3][k])
			{
				// an "add-allowed" plan that does not require eoi exists
				GrpEOI = false;
				break;
			}
		}
		if (EligPlanGroups[j][3].length != 0 && GrpEOI)
		{
			stopProcessing();
			var alertmsg = getSeaPhrase("ERROR_114","BEN");
			seaAlert(alertmsg, null, null, "error");
			if (window.opener) 
				setTimeout("window.close()",3000);
			LoadError = true;
			return;
		}
	}
	CurrentPlanGroup = 0;	
	self.document.getElementById("main").src = "/lawson/xbnnet/benbulletin2.htm";
	stopProcessing(getSeaPhrase("CNT_UPD_FRM","SEA",[getSeaPhrase("ENROLLMENT_ORDER","BEN")]));
}

