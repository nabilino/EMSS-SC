// Version: 8-)@(#)@(201111) 09.00.01.06.09
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/bessload.js,v 1.27.2.21.4.3 2012/05/02 20:33:21 brentd Exp $
var rulesCurrentDate = ""
var rulesNewDate = ""
function getNHRules()
{
	stylePage();
	company		= parseFloat(authUser.company)
	employee	= parseFloat(authUser.employee)
	prodline	= authUser.prodline
	var rules_company = company.toString()
	for (var i=rules_company.length;i<4;i++)
		rules_company = "0" + rules_company

	if (rule_type != "N")
		addrchange()
	else {
		var obj 	= new DMEObject(prodline,"sysrules")
		obj.out 	= "JAVASCRIPT"
		obj.index	= "syrset2"
		obj.field 	= "alphadata3;numeric1"
		obj.key 	= "BN=NEWHIREBEN="+rules_company
		obj.func	= "addrchange()"			
		obj.max		= "1"
		obj.debug 	= false
		DME(obj,"jsreturn")
	}
}
function addrchange()
{
	if (rule_type=="N" && self.jsreturn.NbrRecs==0) {
		removeWaitAlert();
		if (typeof(parent.removeWaitAlert) != "undefined") {
			parent.removeWaitAlert();
		}	
		if (typeof(parent.parent.removeWaitAlert) != "undefined") {
			parent.parent.removeWaitAlert();
		}		
		seaAlert(getSeaPhrase("ERROR_6","BEN")+" "+company+".")
		if (opener) 
			setTimeout("window.close()",3000)
		LoadError=true
		return
	}
	if (rule_type=="N") {
		if (self.jsreturn.record[0].alphadata3.toUpperCase()=="SN") {
			_BaseDate	= "paemployee.senior-date"
			_BaseDateWord	= "seniority date"
		} else if (self.jsreturn.record[0].alphadata3.toUpperCase()=="HI") {
			_BaseDate	= "date-hired"
			_BaseDateWord	= "hire date"
		} else if (self.jsreturn.record[0].alphadata3.toUpperCase()=="AN") {
			_BaseDate	= "annivers-date"
			_BaseDateWord	= "anniversary date"
		} else if (self.jsreturn.record[0].alphadata3.toUpperCase()=="AJ") {
			_BaseDate	= "adj-hire-date"
			_BaseDateWord	= "adjusted hire date"
		} else if (self.jsreturn.record[0].alphadata3.toUpperCase()=="B1") {
			_BaseDate	= "paemployee.ben-date-1"
			_BaseDateWord	= "benefit date 1"
		} else if (self.jsreturn.record[0].alphadata3.toUpperCase()=="B2") {
			_BaseDate	= "paemployee.ben-date-2"
			_BaseDateWord	= "benefit date 2"
		} else if (self.jsreturn.record[0].alphadata3.toUpperCase()=="B3") {
			_BaseDate	= "paemployee.ben-date-3"
			_BaseDateWord	= "benefit date 3"
		} else if (self.jsreturn.record[0].alphadata3.toUpperCase()=="B4") {
			_BaseDate	= "paemployee.ben-date-4"
			_BaseDateWord	= "benefit date 4"
		} else if (self.jsreturn.record[0].alphadata3.toUpperCase()=="B5") {
			_BaseDate	= "paemployee.ben-date-5"
			_BaseDateWord	= "benefit date 5"
		}
		_DateRange=parseFloat(self.jsreturn.record[0].numeric1)
	} else
		_BaseDate=""
	var obj 	= new DMEObject(prodline,"Employee")
	obj.out 	= "JAVASCRIPT"
	obj.index	= "empset1"
	obj.field 	= "employee;last-name;first-name;full-name;nick-name;"
		+ "fica-nbr;pay-rate;pay-step;pay-grade;schedule;paemployee.birthdate;salary-class;"
		+ "pay-frequency;ot-plan-code;email-address;"
		+_BaseDate
	obj.key 	= company +"="+ employee
	obj.max		= "1"
	obj.debug	= false
	DME(obj,"jsreturn")
}
var noGo = false
function DspEmployee()
{
	obj = self.jsreturn.record[0]
	if (typeof(obj) == "undefined") {
		removeWaitAlert();
		if (typeof(parent.removeWaitAlert) != "undefined")
			parent.removeWaitAlert();
		if (typeof(parent.parent.removeWaitAlert) != "undefined")
			parent.parent.removeWaitAlert();		
		seaAlert(getSeaPhrase("ERROR_98","BEN"))
		if (opener) 
			setTimeout("window.close()",3000)
		LoadError=true
		return
	}
	if (rule_type=="N") {
		var _BaseDateReturn	= _BaseDate.split('-').join('_')
		_BaseDateReturn		= _BaseDateReturn.split('.').join('_')
		var dte				= eval('obj.'+_BaseDateReturn)
		if(dte == ""){
			removeWaitAlert();
			if (typeof(parent.removeWaitAlert) != "undefined")
				parent.removeWaitAlert();
			if (typeof(parent.parent.removeWaitAlert) != "undefined")
				parent.parent.removeWaitAlert();	
			if(_BaseDateReturn == "paemployee_senior_date")
				seaAlert(getSeaPhrase("ERROR_117","BEN")) ;
			else if(_BaseDateReturn == "date_hired")
				seaAlert(getSeaPhrase("ERROR_118","BEN")) ;
			else if(_BaseDateReturn == "annivers_date")
				seaAlert(getSeaPhrase("ERROR_119","BEN")) ;
			else if(_BaseDateReturn == "adj_hire_date")
				seaAlert(getSeaPhrase("ERROR_120","BEN")) ;
			else if(_BaseDateReturn == "paemployee_ben_date_1")
				seaAlert(getSeaPhrase("ERROR_121","BEN")) ;
			else if(_BaseDateReturn == "paemployee_ben_date_2")
				seaAlert(getSeaPhrase("ERROR_122","BEN")) ;
			else if(_BaseDateReturn == "paemployee_ben_date_3")
				seaAlert(getSeaPhrase("ERROR_123","BEN")) ;
			else if(_BaseDateReturn == "paemployee_ben_date_4")
				seaAlert(getSeaPhrase("ERROR_124","BEN")) ;
			else if(_BaseDateReturn == "paemployee_ben_date_5")
				seaAlert(getSeaPhrase("ERROR_125","BEN")) ;
			if (opener) 
				setTimeout("window.close()",3000)
			LoadError=true
			return
		}
		BenefitRules[1]		= formjsDate(formatDME(dte))
		BenefitRules[2]		= formjsDate(formatDME(dte))
		rulesCurrentDate	= BenefitRules[1]
		rulesNewDate		= BenefitRules[2]
		var dtediff			= (getDteDifference(formjsDate(formatDME(dte)),ymdtoday))
		if (dtediff<0 || dtediff > _DateRange)
			noGo=true
	}
	lastname 	= obj.last_name
	firstname 	= obj.first_name
	fullname	= obj.full_name
	nickname	= obj.nick_name
	dateofbirth = formatDME(obj.paemployee_birthdate)
	ficanbr		= obj.fica_nbr
	emppaystep	= obj.pay_step
	emppaygrade	= obj.pay_grade
	empschedule	= obj.schedule
	empsalary	= obj.pay_rate
	salaryclass = obj.salary_class
	emppayfreq	= obj.pay_frequency
	otplancode	= obj.ot_plan_code
	emailaddress = obj.email_address
	CheckPayRate();
}
function CheckPayRate()
{
	if ((NonSpace(empsalary) == 0 || empsalary==0) && NonSpace(emppaystep) != 0) {
		var object 	= new DMEObject(prodline, "prsagdtl")
		object.out 	= "JAVASCRIPT"
		object.index = "sgdset3"
		object.field = "pay-rate"
		object.select = "effect-date<=" + authUser.date
		object.key 	= parseInt(company,10) +"="+ escape(empschedule,1)
			+ "=" + escape(emppaygrade,1) +"="+ escape(emppaystep,1)
		object.max  = "1";
		object.func	= "DspPrsagdtl()";
		DME(object,"jsreturn");
	} else 
		GoToBulletin();
}
function DspPrsagdtl()
{
	if(self.jsreturn.NbrRecs)
		empsalary = self.jsreturn.record[0].pay_rate;
	GoToBulletin();
}
function GoToBulletin()
{
	var title = ""
	if (process == "newhire")
		title = getSeaPhrase("NEW_HIRE_ENROLLMENT","BEN");
	else
		title = getSeaPhrase("BEN_ENROLL","BEN");
	self.document.title = title
	setTaskHeader("header", title, "Benefits");
	if (noGo || rule_type=="N")
		self.document.getElementById("main").src = "/lawson/xbnnet/benbulletin_nh.htm"
	else
		self.document.getElementById("main").src = "/lawson/xbnnet/benbulletin.htm"
	self.document.getElementById("main").style.visibility = "visible";
}
function CheckBenis()
{
	getRules("I")
}
function getRules(fc)
{
	if (LoadError) 
		return
	if(fc == "+")
		fc = "%2B"
	self.lawheader.count=0
	NbrRecs = 0
	if (fc == "I") {
		if (rule_type == "F")
			parent.parent.showWaitAlert(getSeaPhrase("LOOK_UP_EMP_INFO","BEN"))
		else
			showWaitAlert(getSeaPhrase("LOOK_UP_EMP_INFO","BEN"))
		TC_val = ""
		HK_val = ""
	}
	if (fc == "%2B" && TC_val == "") {
		if (rule_type == "N") {
			BenefitRules[1] = rulesCurrentDate;
			BenefitRules[2] = rulesNewDate;
		}
		getdependents()
	} else {
		updatetype	 	= "RLE"
		var obj 		= new AGSObject(prodline,"BS09.1")
	 	obj.event		= "ADD"
	 	obj.rtn			= "DATA"
	 	obj.longNames		= true
	 	obj.tds			= false
		obj.debug 		= false
	 	obj.field		= "FC="+fc
			+ "&BAE-COMPANY=" 	+ escape(company)
			+ "&BAE-EMPLOYEE=" 	+ escape(employee)
			+ "&BAE-RULE-TYPE="	+ escape(rule_type)
		if (fc == "%2B")
			obj.field += "&_f2=" + escape(TC_val) + "&_f288=" + escape(HK_val)
		obj.func = "parent.getRules('%2B')"
		AGS(obj,"jsreturn")
	}
}
function getdependents()
{
	var obj 	= new DMEObject(prodline,"emdepend")
	obj.out 	= "JAVASCRIPT"
	obj.index	= "emdset1"
	obj.field 	= "last-name;first-name;label-name-1;dep-type;student;cur-age;seq-nbr;disabled;birthdate"
	obj.key 	= company +"="+ employee
	obj.max		= "600"
	obj.debug	= false
	obj.cond 	= "Active"
	DME(obj,"jsreturn")
}
var spouseExists = false
var depsExist = false
function DspEmdepend()
{
	dependents=self.jsreturn.record
	for(var i=0;i<dependents.length;i++) {
		if(dependents[i].dep_type=="S")
			spouseExists=true
		else if(dependents[i].dep_type=="D")
			depsExist=true
		var bdate	= formjsDate(formatDME(dependents[i].birthdate))
		var tday	= ymdtoday.substring(0,4)
		var age		= parseFloat(getDteDifference(parseFloat(bdate),parseFloat(BenefitRules[2])))
		if((age/365)>4) {
			lpyrs=(age/365)/4
			age-=lpyrs
		}
		age=age/365
		age+=''
		if(age.indexOf(".")!=-1)
			age=age.substring(0,age.indexOf("."))
		dependents[i].cur_age		= age
		dependents[i].last_name		= capital(dependents[i].last_name)
		dependents[i].first_name	= capital(dependents[i].first_name)
	}
	checkCurrentEnroll()
}
function checkCurrentEnroll()
{
	if(rule_type=="A" && (parseFloat(BenefitRules[3])>parseFloat(ymdtoday) || parseFloat(BenefitRules[4])<parseFloat(ymdtoday))) {
		removeWaitAlert();
		if (typeof(parent.removeWaitAlert) != "undefined")
			parent.removeWaitAlert();
		if (typeof(parent.parent.removeWaitAlert) != "undefined")
			parent.parent.removeWaitAlert();		
		seaAlert(getSeaPhrase("CURBEN_30","BEN"))
		if (opener) 
			setTimeout("window.close()",3000)
		LoadError=true
	} else {
		var obj 	= new DMEObject(prodline,"bnben")
		obj.debug	= false
		obj.out 	= "JAVASCRIPT"
		obj.index	= "bnbset1"
		obj.field 	= "FC;COMPANY;ENROLL-DATE;EMPLOYEE;PLAN-TYPE;PLAN-CODE;COVER-OPT;"
			+ "MULT-SALARY;COVER-AMT;PAY-RATE;PCT-AMT-FLAG;START-DATE;"
			+ "PRE-AFT-FLAG;SMOKER-FLAG;EMP-PRE-CONT;EMP-AFT-CONT;STOP-DATE;"
			+ "PEND-EVIDENCE;YTD-CONT;RCD-TYPE;PLAN-GROUP;COP-COV-DESC;"
			+ "DEP-COVER-AMT;COV-PCT;FLEX-COST;EMP-COST;COMP-COST;UPDATE-DATE;"
			+ "ALPHADATA1;NUMERIC1;DATE1;PLAN-DESC;CREATE-TRANS;TRAN-REASON;"					  
			+ "MEMBER-ID"
		obj.key 	= company +"="+ employee
		DME(obj,"jsreturn")
	}
}

function CheckEnrollDatesPending()
{
	var msg1 = getSeaPhrase("NHBULLETIN_29","BEN");
	var msg2 = getSeaPhrase("NHBULLETIN_30","BEN");
	var msg3 = getSeaPhrase("NHBULLETIN_31","BEN");
	var futurebens,existingbens;
	futurebens=existingbens=false;

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
 				futurebens = true
			else if (pendedBens[i][5] < BenefitRules[2])
				existingbens = true
			if (futurebens && existingbens)
				break
		}
	}
 	
	if (futurebens && existingbens) {
		stopProcessing();		
		seaAlert(msg3)
		if (opener) 
			setTimeout("window.close()",3000)
		LoadError=true
		return
	} else if (futurebens) {
		stopProcessing();	
		seaAlert(msg1)
		if (opener) 
			setTimeout("window.close()",3000)
		LoadError=true
		return
	} else if (existingbens) {
		stopProcessing();		
		seaAlert(msg2)
		if (opener) 
			setTimeout("window.close()",3000)
		LoadError=true
		return
	}
	
	EligPlanGroups = new Array();
	if (typeof(BenefitRules[8]) != "undefined" && BenefitRules[8] == "Y")
		FlexDollars("I")
	else
		getPlanGroupLimits("I")
}
var nbrpending = 0
var getdeps = false 
function DspBnben()
{
	nbrpending=parseInt(self.jsreturn.NbrRecs)
	var cnt=0
	if(rule_type=="N" && nbrpending>0) {
		removeWaitAlert();
		if (typeof(parent.removeWaitAlert) != "undefined") {
			parent.removeWaitAlert();
		}
		if (typeof(parent.parent.removeWaitAlert) != "undefined") {
			parent.parent.removeWaitAlert();
		}		
		seaAlert(getSeaPhrase("ERROR_99","BEN"))
		if (opener) 
			setTimeout("window.close()",3000)
		LoadError=true
		return
	}
	if(nbrpending != 0) {
	 	for(var i=0;i<nbrpending;i++) {
			obj = self.jsreturn.record[i]
			obj.Cover_Opt 		= doParseFloat(obj.Cover_Opt)
			obj.Mult_Salary 	= doParseFloat(obj.Mult_Salary)
			obj.Cover_Amt 		= doParseFloat(obj.Cover_Amt)
			obj.Pay_Rate 		= doParseFloat(obj.Pay_Rate)
			obj.Emp_Pre_Cont 	= doParseFloat(obj.Emp_Pre_Cont)
			obj.Emp_Aft_Cont 	= doParseFloat(obj.Emp_Aft_Cont)
			obj.Ytd_Cont 		= doParseFloat(obj.Ytd_Cont)
			obj.Dep_Cover_Amt 	= doParseFloat(obj.Dep_Cover_Amt)
			obj.Cov_Pct 		= doParseFloat(obj.Cov_Pct)
			obj.Flex_Cost 		= doParseFloat(obj.Flex_Cost)
			obj.Comp_Cost 		= doParseFloat(obj.Comp_Cost)
			if(!getdeps && (obj.Plan_Type=="HL" || obj.Plan_Type=="DN" || obj.Plan_Type=="DL"))
				getdeps=true
			if(obj.Stop_Date=="") {
				if(obj.Emp_Cost.indexOf("-")!=-1) {
					obj.Emp_Cost=obj.Emp_Cost.substring(0,obj.Emp_Cost.indexOf("-"))
					obj.Emp_Cost=doParseFloat(obj.Emp_Cost)*-1
					obj.Emp_Cost=obj.Emp_Cost+''
				} else
					obj.Emp_Cost = doParseFloat(obj.Emp_Cost)
				ElectedPlans[cnt]	= new Array()
				ElectedPlans[cnt][0]	= obj.Rcd_Type
				ElectedPlans[cnt][1] 	= obj.Plan_Desc
				ElectedPlans[cnt][3]	= obj.Plan_Group
				ElectedPlans[cnt][5]	= formjsDate(formatDME(obj.Start_Date))
				ElectedPlans[cnt][7] 	= obj.Create_Trans				
				ElectedPlans[cnt][8] 	= obj.Tran_Reason				
				ElectedPlans[cnt][9] 	= obj.Member_Id
				ElectedPlans[cnt][2]	= new Array()
				ElectedPlans[cnt][2][0]	= ''
				ElectedPlans[cnt][2][1]	= ''
				ElectedPlans[cnt][2][2]	= ''
				ElectedPlans[cnt][2][3]	= ''
				ElectedPlans[cnt][2][4]	= ''
				ElectedPlans[cnt][2][5]	= ''
				ElectedPlans[cnt][2][6]	= ''
				ElectedPlans[cnt][2][7]	= ''
				ElectedPlans[cnt][2][8]	= ''
				ElectedPlans[cnt][2][9]	= ''
				ElectedPlans[cnt][2][10]	= ''
				ElectedPlans[cnt][2][11]	= ''
				ElectedPlans[cnt][2][12]	= ''
				ElectedPlans[cnt][2][13]	= ''
				ElectedPlans[cnt][2][14]	= ''
				ElectedPlans[cnt][2][15]	= ''
				ElectedPlans[cnt][2][16]	= ''
				ElectedPlans[cnt][2][17]	= ''
				ElectedPlans[cnt][2][18]	= ''
				ElectedPlans[cnt][2][19]	= ''
				ElectedPlans[cnt][2][20]	= ''
				ElectedPlans[cnt][2][21]	= ''
				ElectedPlans[cnt][2][22]	= ''
				ElectedPlans[cnt][2][23]	= ''
				ElectedPlans[cnt][2][24]	= ''
				ElectedPlans[cnt][2][25]	= ''
				ElectedPlans[cnt][2][26]	= ''
				ElectedPlans[cnt][2][27]	= ''
				ElectedPlans[cnt][2][28]	= ''
				ElectedPlans[cnt][2][29]	= ''
				ElectedPlans[cnt][2][30]	= ''
				ElectedPlans[cnt][2][31]	= ''
				ElectedPlans[cnt][2][32]	= ''
				ElectedPlans[cnt][2][33]	= ''
				ElectedPlans[cnt][2][34]	= ''
				ElectedPlans[cnt][2][41] = ''
				ElectedPlans[cnt][2][42] = obj.Create_Trans
				ElectedPlans[cnt][2][43] = obj.Tran_Reason				
				ElectedPlans[cnt][2][44] = obj.Member_Id
				if(doParseFloat(obj.Rcd_Type)==1) {
					ElectedPlans[cnt][2][1]	= obj.Cover_Opt
					ElectedPlans[cnt][2][2]	= obj.Cop_Cov_Desc
					ElectedPlans[cnt][2][3]	= obj.Pre_Aft_Flag
					ElectedPlans[cnt][2][4]	= obj.Pre_Aft_Flag
					ElectedPlans[cnt][2][5]	= doParseFloat(obj.Emp_Cost)
					ElectedPlans[cnt][2][6]	= obj.Flex_Cost
					ElectedPlans[cnt][2][8]	= obj.Comp_Cost
					ElectedPlans[cnt][2][9]	= obj.Rcd_Type
					ElectedPlans[cnt][2][10]	= obj.Plan_Group
					ElectedPlans[cnt][2][11]	= obj.Plan_Type
					ElectedPlans[cnt][2][12]	= obj.Plan_Code
					ElectedPlans[cnt][2][24] = obj.Pct_Amt_Flag
					ElectedPlans[cnt][2][25] = obj.Emp_Pre_Cont
					ElectedPlans[cnt][2][26] = obj.Emp_Aft_Cont
					ElectedPlans[cnt][2][99]	= obj.Plan_Type
					ElectedPlans[cnt][2][98]	= obj.Plan_Code
				}
				if(doParseFloat(obj.Rcd_Type)==2) {
					if(obj.Plan_Type=="DL")	{
						//PT119301:do not deduce the coverage type since the CVR-LIFE-ADD-FLG flag is 
						//not stored in the pending file.  In this case, always display "Dependents". 
						ElectedPlans[cnt][2][4] = "D"
					}					
					ElectedPlans[cnt][2][5]	= obj.Cover_Amt
					ElectedPlans[cnt][2][7]	= obj.Dep_Cover_Amt
					ElectedPlans[cnt][2][6]	= obj.Plan_Type
					ElectedPlans[cnt][2][8]	= obj.Plan_Code
					ElectedPlans[cnt][2][14] = obj.Cover_Amt
					ElectedPlans[cnt][2][15]	= obj.Pre_Aft_Flag
					ElectedPlans[cnt][2][18]	= obj.Emp_Cost
					ElectedPlans[cnt][2][20]	= obj.Flex_Cost
					ElectedPlans[cnt][2][24]	= obj.Comp_Cost
					ElectedPlans[cnt][2][37]	= obj.Plan_Type
					ElectedPlans[cnt][2][51] = obj.Pct_Amt_Flag
					ElectedPlans[cnt][2][63] = obj.Emp_Pre_Cont
					ElectedPlans[cnt][2][64] = obj.Emp_Aft_Cont					
					ElectedPlans[cnt][2][99]	= obj.Plan_Type
					ElectedPlans[cnt][2][38]	= obj.Plan_Code
					ElectedPlans[cnt][2][98]	= obj.Plan_Code
				}
				if(doParseFloat(obj.Rcd_Type)==3 || doParseFloat(obj.Rcd_Type)==13) {
					ElectedPlans[cnt][2][6]	= obj.Plan_Type
					ElectedPlans[cnt][2][8]	= obj.Plan_Code
					ElectedPlans[cnt][2][17]	= obj.Mult_Salary
					ElectedPlans[cnt][2][14]	= obj.Cover_Amt
					ElectedPlans[cnt][2][15]	= obj.Pre_Aft_Flag
					ElectedPlans[cnt][2][18]	= obj.Emp_Cost
					ElectedPlans[cnt][2][20]	= obj.Flex_Cost
					ElectedPlans[cnt][2][24]	= obj.Comp_Cost
					ElectedPlans[cnt][2][37]	= obj.Plan_Type
					ElectedPlans[cnt][2][51] = obj.Pct_Amt_Flag
					ElectedPlans[cnt][2][63] = obj.Emp_Pre_Cont
					ElectedPlans[cnt][2][64] = obj.Emp_Aft_Cont					
					ElectedPlans[cnt][2][38]	= obj.Plan_Code
					ElectedPlans[cnt][2][99]	= obj.Plan_Type
					ElectedPlans[cnt][2][98]	= obj.Plan_Code
				}
				if(doParseFloat(obj.Rcd_Type)==4) {
					ElectedPlans[cnt][2][17]	= obj.Cover_Amt
					ElectedPlans[cnt][2][6]	= obj.Plan_Type
					ElectedPlans[cnt][2][8]	= obj.Plan_Code
					ElectedPlans[cnt][2][15]	= obj.Pre_Aft_Flag
					ElectedPlans[cnt][2][18]	= obj.Emp_Cost
					ElectedPlans[cnt][2][20]	= obj.Flex_Cost
					ElectedPlans[cnt][2][24]	= obj.Comp_Cost
					ElectedPlans[cnt][2][37]	= obj.Plan_Type
					ElectedPlans[cnt][2][38]	= obj.Plan_Code
					ElectedPlans[cnt][2][51] = obj.Pct_Amt_Flag
					ElectedPlans[cnt][2][63] = obj.Emp_Pre_Cont
					ElectedPlans[cnt][2][64] = obj.Emp_Aft_Cont					
					ElectedPlans[cnt][2][99]	= obj.Plan_Type
					ElectedPlans[cnt][2][98]	= obj.Plan_Code
				}
				if(doParseFloat(obj.Rcd_Type)==5) {
					ElectedPlans[cnt][2][12]	= obj.Cov_Pct
					ElectedPlans[cnt][2][37]	= obj.Plan_Type
					ElectedPlans[cnt][2][38]	= obj.Plan_Code
					ElectedPlans[cnt][2][15]	= obj.Pre_Aft_Flag
					ElectedPlans[cnt][2][18]	= obj.Emp_Cost
					ElectedPlans[cnt][2][20]	= obj.Flex_Cost
					ElectedPlans[cnt][2][24]	= obj.Comp_Cost
					ElectedPlans[cnt][2][37]	= obj.Plan_Type
					ElectedPlans[cnt][2][38]	= obj.Plan_Code
					ElectedPlans[cnt][2][51] = obj.Pct_Amt_Flag
					ElectedPlans[cnt][2][63] = obj.Emp_Pre_Cont
					ElectedPlans[cnt][2][64] = obj.Emp_Aft_Cont					
					ElectedPlans[cnt][2][99]	= obj.Plan_Type
					ElectedPlans[cnt][2][98]	= obj.Plan_Code
				}
				if(doParseFloat(obj.Rcd_Type)==6) {
					ElectedPlans[cnt][2][23]	= obj.Pay_Rate
					ElectedPlans[cnt][2][24] = obj.Pct_Amt_Flag
					ElectedPlans[cnt][2][38]	= obj.Plan_Type
					ElectedPlans[cnt][2][39]	= obj.Plan_Code
					ElectedPlans[cnt][2][26]	= obj.Pre_Aft_Flag
					ElectedPlans[cnt][2][16]	= obj.Emp_Cost
					ElectedPlans[cnt][2][18]	= obj.Flex_Cost
					ElectedPlans[cnt][2][22]	= obj.Comp_Cost
					ElectedPlans[cnt][2][38]	= obj.Plan_Type
					ElectedPlans[cnt][2][39]	= obj.Plan_Code
					ElectedPlans[cnt][2][37]	= obj.Cover_Opt
					ElectedPlans[cnt][2][40]	= obj.Cover_Opt
					ElectedPlans[cnt][2][42]	= obj.Pct_Amt_Flag
					ElectedPlans[cnt][2][56] = obj.Emp_Pre_Cont
					ElectedPlans[cnt][2][57] = obj.Emp_Aft_Cont					
					ElectedPlans[cnt][2][99]	= obj.Plan_Type
					ElectedPlans[cnt][2][98]	= obj.Plan_Code
					ElectedPlans[cnt][2][19] = -1
				}
				if(doParseFloat(obj.Rcd_Type)==7) {
					ElectedPlans[cnt][2][23]	= obj.Mult_Salary
					ElectedPlans[cnt][2][38]	= obj.Plan_Type
					ElectedPlans[cnt][2][39]	= obj.Plan_Code
					ElectedPlans[cnt][2][26]	= obj.Pre_Aft_Flag
					ElectedPlans[cnt][2][16]	= obj.Emp_Cost
					if(ElectedPlans[cnt][2][16]=='')
						ElectedPlans[cnt][2][16] = obj.Emp_Pre_Cont
					if(ElectedPlans[cnt][2][16]=='')
						ElectedPlans[cnt][2][16] = obj.Emp_Aft_Cont
					ElectedPlans[cnt][2][18]	= obj.Flex_Cost
					ElectedPlans[cnt][2][22]	= obj.Comp_Cost
					ElectedPlans[cnt][2][24] = obj.Pct_Amt_Flag
					ElectedPlans[cnt][2][38]	= obj.Plan_Type
					ElectedPlans[cnt][2][39]	= obj.Plan_Code
					ElectedPlans[cnt][2][37]	= obj.Cover_Opt
					ElectedPlans[cnt][2][56] = obj.Emp_Pre_Cont
					ElectedPlans[cnt][2][57] = obj.Emp_Aft_Cont					
					ElectedPlans[cnt][2][99]	= obj.Plan_Type
					ElectedPlans[cnt][2][98]	= obj.Plan_Code
				}
				if(doParseFloat(obj.Rcd_Type)==8) {
					ElectedPlans[cnt][2][24]	= obj.Pct_Amt_Flag
					if(obj.Pct_Amt_Flag == "A" || obj.Pct_Amt_Flag == "B") {
						var paydivisor=1
						if(BenefitRules[6]=="P" && obj.Cover_Opt)
							paydivisor=obj.Cover_Opt
						else if(BenefitRules[6]=="M")
							paydivisor=12
						else if(BenefitRules[6]=="S")
							paydivisor=24
						ElectedPlans[cnt][2][23]	= obj.Emp_Pre_Cont/doParseFloat(paydivisor)
						ElectedPlans[cnt][2][36]	= obj.Emp_Aft_Cont/doParseFloat(paydivisor)
					} else {
						ElectedPlans[cnt][2][23]	= obj.Emp_Pre_Cont
						ElectedPlans[cnt][2][36]	= obj.Emp_Aft_Cont
					}
					ElectedPlans[cnt][2][38]	= obj.Plan_Type
					ElectedPlans[cnt][2][39]	= obj.Plan_Code
					ElectedPlans[cnt][2][26]	= obj.Pre_Aft_Flag
					ElectedPlans[cnt][2][16]	= obj.Emp_Cost
					ElectedPlans[cnt][2][18]	= obj.Flex_Cost
					ElectedPlans[cnt][2][22]	= obj.Comp_Cost
					ElectedPlans[cnt][2][38]	= obj.Plan_Type
					ElectedPlans[cnt][2][39]	= obj.Plan_Code
					ElectedPlans[cnt][2][37]	= obj.Numeric1
					ElectedPlans[cnt][2][37]	= obj.Cover_Opt
					ElectedPlans[cnt][2][41] = obj.Flex_Cost+obj.Emp_Pre_Cont+obj.Emp_Aft_Cont
					ElectedPlans[cnt][2][42]	= obj.Pct_Amt_Flag
					ElectedPlans[cnt][2][56] = obj.Emp_Pre_Cont
					ElectedPlans[cnt][2][57] = obj.Emp_Aft_Cont					
					ElectedPlans[cnt][2][99]	= obj.Plan_Type
					ElectedPlans[cnt][2][98]	= obj.Plan_Code
				}
				if(doParseFloat(obj.Rcd_Type)==9) {
					ElectedPlans[cnt][2][24]	= obj.Pct_Amt_Flag
					if(obj.Pct_Amt_Flag == "A" || obj.Pct_Amt_Flag == "B") {
						var paydivisor=1
						if(BenefitRules[6]=="P" && obj.Cover_Opt)
							paydivisor=obj.Cover_Opt
						else if(BenefitRules[6]=="M")
							paydivisor=12
						else if(BenefitRules[6]=="S")
							paydivisor=24
						ElectedPlans[cnt][2][23]	= obj.Emp_Pre_Cont/doParseFloat(paydivisor)
						ElectedPlans[cnt][2][36]	= obj.Emp_Aft_Cont/doParseFloat(paydivisor)
					} else {
						ElectedPlans[cnt][2][23]	= obj.Emp_Pre_Cont
						ElectedPlans[cnt][2][36]	= obj.Emp_Aft_Cont
					}					
					ElectedPlans[cnt][2][38]	= obj.Plan_Type
					ElectedPlans[cnt][2][39]	= obj.Plan_Code
					ElectedPlans[cnt][2][26]	= obj.Pre_Aft_Flag
					ElectedPlans[cnt][2][16]	= obj.Emp_Cost
					ElectedPlans[cnt][2][18]	= obj.Flex_Cost
					ElectedPlans[cnt][2][22]	= obj.Comp_Cost
					ElectedPlans[cnt][2][38]	= obj.Plan_Type
					ElectedPlans[cnt][2][39]	= obj.Plan_Code
					ElectedPlans[cnt][2][37]	= obj.Cover_Opt
					ElectedPlans[cnt][2][41] = obj.Flex_Cost+obj.Emp_Pre_Cont+obj.Emp_Aft_Cont
					ElectedPlans[cnt][2][42]	= obj.Pct_Amt_Flag
					ElectedPlans[cnt][2][56] = obj.Emp_Pre_Cont
					ElectedPlans[cnt][2][57] = obj.Emp_Aft_Cont					
					ElectedPlans[cnt][2][99]	= obj.Plan_Type
					ElectedPlans[cnt][2][98]	= obj.Plan_Code
				}
				if(doParseFloat(obj.Rcd_Type)==10) {
					ElectedPlans[cnt][2][24] = obj.Pct_Amt_Flag
					ElectedPlans[cnt][2][26]	= obj.Pre_Aft_Flag
					ElectedPlans[cnt][2][16]	= obj.Emp_Cost
					ElectedPlans[cnt][2][18]	= obj.Flex_Cost
					ElectedPlans[cnt][2][22]	= obj.Comp_Cost
					ElectedPlans[cnt][2][38]	= obj.Plan_Type
					ElectedPlans[cnt][2][39]	= obj.Plan_Code
					ElectedPlans[cnt][2][56] = obj.Emp_Pre_Cont
					ElectedPlans[cnt][2][57] = obj.Emp_Aft_Cont					
					ElectedPlans[cnt][2][99]	= obj.Plan_Type
					ElectedPlans[cnt][2][98]	= obj.Plan_Code
				}
				if(doParseFloat(obj.Rcd_Type)==12) {
 					ElectedPlans[cnt][2][1]	= obj.Plan_Type
 					ElectedPlans[cnt][2][2]	= obj.Plan_Code
					ElectedPlans[cnt][2][38]	= obj.Plan_Type
					ElectedPlans[cnt][2][39]	= obj.Plan_Code
					ElectedPlans[cnt][2][99]	= obj.Plan_Type
					ElectedPlans[cnt][2][98]	= obj.Plan_Code
				}
				alreadyElect="Y"
				cnt++
			}
   		}
		oldelected		= new Array()
		for(var i=0;i<ElectedPlans.length;i++)
			oldelected[i] = ElectedPlans[i]
		oldElectionsIn	= "PENDING"
		if(getdeps)	{
			var obj 	= new DMEObject(prodline,"depben")
			obj.out 	= "JAVASCRIPT"
			obj.index 	= "depset1"
			obj.field 	= "dependent;plan-type;emp-start;plan-code"
			obj.max 	= "600"
			obj.func 	= "CheckCurrentBens('I')"
			obj.key 	= company+"="+employee
			obj.debug 	= false
			DME(obj,"jsreturn")
		} else
			CheckCurrentBens("I")
	} else
		CheckCurrentBens("I")
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
		return
	var AGSMsg = self.lawheader.gmsg
	if(fc == "+")
		fc = "%2B"
	if (nbrpending > 0) {
		if (getdeps) {
			NewDepList = self.jsreturn.record
			StoreDependentInfo(NewDepList,DependentBens)
			getdeps = false
		} else if(typeof(DependentBens)=="undefined")
			DependentBens = new Array()
	}
	if (!savedplans) {
		savedplans = true
		for(var i=0;i<ElectedPlans.length;i++)
			PriorElectedPlans[i] = ElectedPlans[i]
		ElectedPlans = new Array()
	}
	if (fc == "I" || fc == null) {
		TC_val = ""
		HK_val = ""
		NbrRecs = 1
	}
	if (fc == "%2B" && TC_val == "") {
		if(AGSMsg.toUpperCase().indexOf("PAGEDOWN")!=-1) {
			// PT 151848
			TC_val = "BS10.1";
			CheckCurrentBens("%2B")
			return
		}
		alreadyElected()
		return
	}
	if (rule_type == "F")
		parent.parent.showWaitAlert(getSeaPhrase("RETRIEVE_CUR_BENS","BEN"))
	else
		showWaitAlert(getSeaPhrase("RETRIEVE_CUR_BENS","BEN"))
	updatetype = "CHK"
	self.lawheader.count=0
	var obj 		= new AGSObject(prodline,"BS10.1")
	obj.event		= "ADD"
	obj.rtn			= "DATA"
	obj.longNames	= true
	obj.debug 		= false
	obj.tds			= false
	obj.field		= "FC="+fc
		+ "&BEN-COMPANY=" 	+ escape(company)
		+ "&BEN-EMPLOYEE=" 	+ escape(employee)
		+ "&BAE-CURRENT-DATE=" 	+ escape(BenefitRules[2])
		+ "&BAE-NEW-DATE=" 	+ escape(BenefitRules[2])
		+ "&BAE-COST-DIVISOR=" 	+ escape(BenefitRules[6])
		+ "&BAE-RULE-TYPE=" 	+ escape(rule_type)
		+ "&BFS-FAMILY-STATUS="
	obj.func="parent.CheckCurrentBens('%2B')"
	if (fc == "%2B") {
		obj.field += "&PT-COMPANY=" + escape(PT_Company)
			+ "&PT-EMPLOYEE=" + escape(PT_Employee)
			+ "&PT-PROCESS-LEVEL=" + escape(PT_Process_Level,1).toString().replace("+","%2B")
			+ "&PT-FAMILY-STATUS=" + escape(PT_Family_Status)
			+ "&PT-GROUP-NAME=" + escape(PT_Group_Name,1).toString().replace("+","%2B")
			+ "&PT-PROCESS-ORDER=" + escape(PT_Process_Order)
			+ "&PT-PLN-PLAN-TYPE=" + escape(PT_Plan_Type,1).toString().replace("+","%2B")
			+ "&PT-PLN-PLAN-CODE=" + escape(PT_Plan_Code,1).toString().replace("+","%2B")
			+ "&PT-BEN-START-DATE=" + escape(PT_Ben_Start_Date)
			+ "&PT-FIELDS-SET=Y"
	}
	AGS(obj,"jsreturn")
}
function alreadyElected()
{
	var oldplans = oldelected
	oldelected = new Array()
	for(var i=0;i<oldplans.length;i++)
		oldelected[i] = oldplans[i]
	if (ElectedPlans.length > 0 && nbrpending > 0) {
		removeWaitAlert();
		if (typeof(parent.removeWaitAlert) != "undefined")
			parent.removeWaitAlert();
		if (typeof(parent.parent.removeWaitAlert) != "undefined")
			parent.parent.removeWaitAlert();		
		seaAlert(getSeaPhrase("ERROR_100","BEN"))
		if (opener) 
			setTimeout("window.close()",3000)
		LoadError=true
		return
	} else {
		if (ElectedPlans.length == 0 && nbrpending >= 0)
			ElectedPlans = PriorElectedPlans
		CurrentBenefits("I")
	}
}
// Do we have at least one current ben where BEN-START-DATE == BAE-NEW-DATE?
var verifyPlanGrps = false 
function CurrentBenefits(fc)
{
	if (LoadError) 
		return
	var AGSMsg = self.lawheader.gmsg
	self.lawheader.count=0
	if(fc == "+")
		fc = "%2B"
	if (fc == "I" || fc == null) {
		TC_val = ""
		HK_val = ""
		NbrRecs = 0
		self.lawheader.bncount=0
	}
	if (fc == "%2B" && TC_val == "") {
		if (AGSMsg.toUpperCase().indexOf("PAGEDOWN")!=-1) {
			TC_val = "BS10.1";
			CurrentBenefits("%2B")
			return
		}
		if (rule_type=="N" && CurrentBens.length>0) {
			removeWaitAlert();
			if (typeof(parent.removeWaitAlert) != "undefined")
				parent.removeWaitAlert();
			if (typeof(parent.parent.removeWaitAlert) != "undefined")
				parent.parent.removeWaitAlert();			
			seaAlert(getSeaPhrase("CURBEN_31","BEN"))
			if (opener) 
				setTimeout("window.close()",3000)
			LoadError=true
			return
		}
		CheckEnrollDates()
	} else {
		if (rule_type == "F")
			parent.parent.showWaitAlert(getSeaPhrase("RETRIEVE_CUR_BENS","BEN"))
		else
			showWaitAlert(getSeaPhrase("RETRIEVE_CUR_BENS","BEN"))
		updatetype 		= "BEN"
		var obj 		= new AGSObject(prodline,"BS10.1")
		obj.event		= "ADD"
		obj.debug 		= false
		obj.rtn			= "DATA"
		obj.longNames		= true
		obj.tds			= false
		obj.field		= "FC="+fc
			+ "&BEN-COMPANY=" 	+ escape(company)
			+ "&BEN-EMPLOYEE=" 	+ escape(employee)
			+ "&BAE-CURRENT-DATE=" 	+ escape(BenefitRules[1])
			+ "&BAE-NEW-DATE=" 	+ escape(BenefitRules[2])
			+ "&BAE-COST-DIVISOR=" 	+ escape(BenefitRules[6])
			+ "&BAE-RULE-TYPE=" 	+ escape(rule_type)
			+ "&BFS-FAMILY-STATUS="
		obj.func="parent.CurrentBenefits('%2B')"
		if (fc == "%2B") {
			obj.field += "&PT-COMPANY=" + escape(PT_Company)
				+ "&PT-EMPLOYEE=" + escape(PT_Employee)
				+ "&PT-PROCESS-LEVEL=" + escape(PT_Process_Level,1).toString().replace("+","%2B")
				+ "&PT-FAMILY-STATUS=" + escape(PT_Family_Status)
				+ "&PT-GROUP-NAME=" + escape(PT_Group_Name,1).toString().replace("+","%2B")
				+ "&PT-PROCESS-ORDER=" + escape(PT_Process_Order)
				+ "&PT-PLN-PLAN-TYPE=" + escape(PT_Plan_Type,1).toString().replace("+","%2B")
				+ "&PT-PLN-PLAN-CODE=" + escape(PT_Plan_Code,1).toString().replace("+","%2B")
				+ "&PT-BEN-START-DATE=" + escape(PT_Ben_Start_Date)
				+ "&PT-FIELDS-SET=Y"
		}
		AGS(obj,"jsreturn")
	}
}
// Current bens where BEN-START-DATE != BAE-NEW-DATE
var NewCurrentBens = new Array() 
NewCurrentBens[0] = ""
function CheckEnrollDates()
{
	var msg1 = getSeaPhrase("NHBULLETIN_8","BEN")
	var msg2 = getSeaPhrase("NHBULLETIN_9","BEN")
	var msg3 = getSeaPhrase("NHBULLETIN_10","BEN")
	var msg4 = getSeaPhrase("NHBULLETIN_11","BEN")
	var futurebens,existingbens
	futurebens=existingbens=getdeps=false
	for (var i=1;i<CurrentBens.length;i++) {
		if (!getdeps && (CurrentBens[i][1] == "HL" || CurrentBens[i][1] == "DN" || CurrentBens[i][1] == "DL"))
			getdeps = true
		if (!verifyPlanGrps && (nbrpending > 0 || CurrentBens[i][3] == BenefitRules[2]))
			verifyPlanGrps = true
		else if (CurrentBens[i][3] > BenefitRules[2])
			futurebens = true
		else if (BenefitRules[1] < CurrentBens[i][3] && CurrentBens[i][3] < BenefitRules[2])
			existingbens = true
		if (CurrentBens[i][3] != BenefitRules[2])
			NewCurrentBens[NewCurrentBens.length] = CurrentBens[i]
		if (futurebens && existingbens)
			break
	}
	if (futurebens && existingbens) {
		removeWaitAlert();
		if (typeof(parent.removeWaitAlert) != "undefined")
			parent.removeWaitAlert();
		if (typeof(parent.parent.removeWaitAlert) != "undefined")
			parent.parent.removeWaitAlert();		
		seaAlert(msg4)
		if (opener) 
			setTimeout("window.close()",3000)
		LoadError=true
		return
	} else if (futurebens) {
		removeWaitAlert();
		if (typeof(parent.removeWaitAlert) != "undefined")
			parent.removeWaitAlert();
		if (typeof(parent.parent.removeWaitAlert) != "undefined")
			parent.parent.removeWaitAlert();	
		seaAlert(msg2)
		if (opener) 
			setTimeout("window.close()",3000)
		LoadError=true
		return
	} else if (existingbens) {
		removeWaitAlert();
		if (typeof(parent.removeWaitAlert) != "undefined")
			parent.removeWaitAlert();
		if (typeof(parent.parent.removeWaitAlert) != "undefined")
			parent.parent.removeWaitAlert();		
		seaAlert(msg3+".")
		if (opener) 
			setTimeout("window.close()",3000)
		LoadError=true
		return
	}
	if (CurrentBens != NewCurrentBens)
		CurrentBens = NewCurrentBens
	if (getdeps)
		GetHrDepBens()
	else {
		if (typeof(DependentBens) == "undefined")
			DependentBens = new Array()
		EligPlan("I")
	}
}
function GetHrDepBens()
{
	var obj 	= new DMEObject(prodline,"hrdepben")
	obj.out 	= "JAVASCRIPT"
	obj.index 	= "hdbset1"
	obj.field 	= "dependent;plan-type;emp-start;plan-code;start-date;stop-date"
	obj.max 	= "300"
	obj.func 	= "DspHrDepBen()"
	obj.debug 	= false
	obj.key 	= company+"="+employee
	DME(obj,"jsreturn")
}
function DspHrDepBen()
{
	var tempbens = new Array()
	var newtempbens = new Array()
	for(var i=0;i<self.jsreturn.NbrRecs;i++) {
		if(parseFloat(formjsDate(formatDME(self.jsreturn.record[i].start_date)))<=parseFloat(BenefitRules[1]) 
		&& (self.jsreturn.record[i].stop_date=='' || parseFloat(formjsDate(formatDME(self.jsreturn.record[i].stop_date)))>=parseFloat(BenefitRules[1]))) 
			tempbens[tempbens.length]=self.jsreturn.record[i]
		if(parseFloat(formjsDate(formatDME(self.jsreturn.record[i].start_date)))<=parseFloat(BenefitRules[2]) 
		&& (self.jsreturn.record[i].stop_date=='' || parseFloat(formjsDate(formatDME(self.jsreturn.record[i].stop_date)))>parseFloat(BenefitRules[2])))
			newtempbens[newtempbens.length]=self.jsreturn.record[i]
	}
	CurrentDepList = tempbens
	NewDateDepList = newtempbens
	StoreCurrentDeps(CurrentDepList,CurrentDeps)
	getdeps=false
	EligPlan("I")
}
function StoreCurrentDeps(dependentList,CurrentDeps)
{
	var index
	var dep
	if(typeof(CurrentDeps)=="undefined") {
		CurrentDeps = new Array()
		CurrentDeps[0] = ""
	}
	for(var i=1;i<CurrentBens.length;i++) {
		for(var j=0;j<dependentList.length;j++) {
			if(CurrentBens[i][2] == dependentList[j].plan_code && CurrentBens[i][1] == dependentList[j].plan_type
			&& CurrentBens[i][3] == formjsDate(formatDME(dependentList[j].emp_start))) {
				dep = SelectDependent(dependentList[j].dependent)
				if(dep==-1) 
					continue
				if(typeof(CurrentDeps[i])=="undefined") {
					CurrentDeps[i] = new Array()
					CurrentDeps[i][1] = new Array()
				}
				index = CurrentDeps[i][1].length
				CurrentDeps[i][1][index] = new Object()
				CurrentDeps[i][1][index].first_name = dependents[dep].first_name
				CurrentDeps[i][1][index].last_name = dependents[dep].last_name
				CurrentDeps[i][1][index].dependent = dependentList[j].dependent
				CurrentDeps[i][1][index].label_name_1 = dependents[dep].label_name_1
			}
		}
	}
}
function EarliestEligDate()
{
	var EligDate = ""
	for (var i=1;i<EligPlans.length;i++) {
		if (EligPlans[i][22]=="Y" && EligPlans[i][5] != "")	{
			if (EligDate == "")
				EligDate = EligPlans[i][5]
			else if (parseInt(EligDate,10) > parseInt(EligPlans[i][5],10))
				EligDate = EligPlans[i][5]
		}
	}
	return EligDate
}
var FlexDate = ""
function FlexDollars(fc)
{
	if (LoadError) 
		return;
	if(fc == "+")
		fc = "%2B"
	self.lawheader.count=0
	NbrRecs = 0
	if (fc == "I") {
		TC_val = ""
		HK_val = ""
		if(rule_type=="N" && EligFlexExist)
			FlexDate = EarliestEligDate()
		else 
			FlexDate = BenefitRules[1]
	}
	if (fc == "%2B") {
		getPlanGroupLimits("I")
	} else {
		updatetype 		= "FLX1"
		var obj 		= new AGSObject(prodline,"BS11.1")
		obj.event		= "ADD"
		obj.rtn			= "DATA"
		obj.debug 		= false
		obj.longNames		= true
		obj.tds			= false
		obj.field		= "FC="+fc
			+ "&EFD-COMPANY=" 	+ escape(company)
			+ "&EFD-EMPLOYEE=" 	+ escape(employee)
			+ "&BAE-DATE=" 		+ escape(FlexDate)
			+ "&BAE-COST-DIVISOR="	+ escape(BenefitRules[6])
		obj.func="parent.FlexDollars('%2B')"
		if (fc == "%2B")
			obj.field += "&_f2=" + escape(TC_val) + "&_f288=" + escape(HK_val)
		AGS(obj,"jsreturn")
	}
}
var inquireComplete	= "Start"
var nextpt		= ""
var nextpc		= ""
var nextco		= ""
var nextcofld		= "PT-PLN-COMPANY"
var nextemp		= ""
var nextempfld		= "PT-EMP-EMPLOYEE"
var nextrle		= ""
var nextfs		= ""
var nextpl		= ""
var nextgn		= ""
var nextpo		= ""
function EligPlan(fc)
{
	if (LoadError) 
		return;
	if(fc == "+")
		fc = "%2B"
	if (rule_type == "F")
		parent.parent.showWaitAlert(getSeaPhrase("PREPARE_ENROLL","BEN"))
	else
		showWaitAlert(getSeaPhrase("PREPARE_ENROLL","BEN"))
	NbrRecs = 0
	self.lawheader.count=0
	if (fc == "I") {
		self.lawheader.count2=0
		TC_val = ""
		HK_val = ""
	}
	else if (fc == "%2B" && EligPlans.length == 0) {
		removeWaitAlert();
		if (typeof(parent.removeWaitAlert) != "undefined")
			parent.removeWaitAlert();
		if (typeof(parent.parent.removeWaitAlert) != "undefined")
			parent.parent.removeWaitAlert();		
		if (parseInt(self.lawheader.gmsgnbr,10)!=120)
			seaAlert(getSeaPhrase("NHBULLETIN_12","BEN"))
		if (opener) 
			setTimeout("window.close()",3000)
		LoadError=true
		return
	}
	if (inquireComplete=="Y") {
		if (rule_type == "A" && nbrpending > 0)
		{
			CheckEnrollDatesPending();
		}
		else
		{			
			EligPlanGroups = new Array();
			if (typeof(BenefitRules[8]) != "undefined" && BenefitRules[8] == "Y")
				FlexDollars("I")
			else
				getPlanGroupLimits("I")
		}	
	} else {
		updatetype 		= "ELG"
		var obj 		= new AGSObject(prodline,"BS12.1")
		obj.event		= "ADD"
		obj.rtn			= "DATA"
		obj.longNames		= true
		obj.debug 		= false
		obj.tds			= false
		obj.field		= "FC="+fc
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
			+ "&PT-PROCESS-ORDER="+escape(nextpo,1)
		obj.func="parent.EligPlan('%2B')"
		inquireComplete	= "Y"
		AGS(obj,"jsreturn")
	}
}
var nextpo="";
function getPlanGroupLimits(fc)
{
	if (LoadError) 
		return
	selectedPlanInGrp = new Array()
	var AGSMsg = self.lawheader.gmsg
	if(fc == "+")
		fc = "%2B"
	for (var i=1;i<EligPlans.length;i++) {
		selectedPlanInGrp[i] = false
		enrollError[i] = false
	}
	self.lawheader.count=0
	NbrRecs = 0
	if (fc == "I") {
		TC_val = ""
		HK_val = ""
	}
	if (fc == "%2B" && TC_val == "")
	{
		if(AGSMsg.toUpperCase().indexOf("PAGEDOWN")!=-1)
		{
			TC_val = "BS02.1"
			getPlanGroupLimits("%2B")
			return
		}
		BuildPlanGroups()
	}
	else
	{
		updatetype 		= "RNM"
		var obj 		= new AGSObject(prodline,"BS02.1")
		obj.event		= "ADD"
		obj.rtn			= "DATA"
		obj.longNames		= true
		obj.tds			= false
		obj.debug 		= false
		obj.field		= "FC="+fc
			+ "&BPG-COMPANY=" + escape(company)
		if (fc == "%2B")
			obj.field += "&DKEY-PROTECTED=" +escape(nextpo,1) + "&_HK=" + escape(HK_val)          
		obj.func		= "parent.getPlanGroupLimits('%2B')"
		AGS(obj,"jsreturn")
	}
}
function BuildPlanGroups()
{
	currentdate	= FormatDte4(BenefitRules[1])
	newdate		= FormatDte4(BenefitRules[2])
	EligPlans[0]		= new Array()
	planname			= EligPlans[0][8]
	EligPlanGroups[0]	= new Array()
	EligPlanGroups[0][0]	= EligPlans[0][8]
	EligPlanGroups[0][1]	= EligPlans[0][9]
	EligPlanGroups[0][2]	= ColorArray[1]
	// store off whether or not each "add-allowed"
	EligPlanGroups[0][3]	= new Array()
	// plan for a plan group requires eoi
	for(var i=0;i<EligPlans.length;i++)	{
		if(EligPlans[i][10]=="" || typeof(EligPlans[i][10])=="undefined" || EligPlans[i][10]==null)
			EligPlans[i][10]="Y"
		if(EligPlans[i][12]=="" || typeof(EligPlans[i][12])=="undefined" || EligPlans[i][12]==null)
			EligPlans[i][12]="Y"
		if(EligPlans[i][14]=="" || typeof(EligPlans[i][14])=="undefined" || EligPlans[i][14]==null)
			EligPlans[i][14]="Y"
		// for each elig plan set a flag to determine if employee has the option to change based on EOI days
		if(rule_type=="N") {
			if(typeof(EligPlans[i][17])=='undefined' || !EligPlans[i][17] || EligPlans[i][17]==null || 
			parseFloat(EligPlans[i][17])>=parseFloat(ymdtoday))
				// within EOI range go ahead
				EligPlans[i][17]=1   
			else
				// beyond EOI range can't change plan
				EligPlans[i][17]=0   
		} else
			//annual enrollment go ahead and change plans
			EligPlans[i][17]=1
		if(EligPlans[i][8]!=planname) {
			while(true) {
				colorcnt=parseInt(Math.random()*(ColorArray.length-1))
				if(!isNaN(colorcnt))
					break
			}
			EligPlanGroups[EligPlanGroups.length]		= new Array()
       		EligPlanGroups[EligPlanGroups.length-1][0]	= EligPlans[i][8]
			EligPlanGroups[EligPlanGroups.length-1][1]	= EligPlans[i][9]
			EligPlanGroups[EligPlanGroups.length-1][2]	= ColorArray[colorcnt]
			EligPlanGroups[EligPlanGroups.length-1][3]  = new Array()
			//PT 161506. Store required plan group flag.
			EligPlanGroups[EligPlanGroups.length-1][4]	= EligPlans[i][19]
			planname=EligPlans[i][8]
		}
		if (EligPlans[i][17]==1) 
			// plan does not require eoi
			EligPlanGroups[EligPlanGroups.length-1][3][EligPlanGroups[EligPlanGroups.length-1][3].length]=false
		else 					
			// plan requires eoi
			EligPlanGroups[EligPlanGroups.length-1][3][EligPlanGroups[EligPlanGroups.length-1][3].length]=true
	}
	CurrentPlanGroup=0
	removeWaitAlert();
	if (typeof(parent.removeWaitAlert) != "undefined")
		parent.removeWaitAlert();	
	if (typeof(parent.parent.removeWaitAlert) != "undefined")
		parent.parent.removeWaitAlert();	
	if(alreadyElect=="Y") {
		SortBenefits()
		//flag plans that are limit of another plan so they update in the correct order
		SetCoverageLimits()
		DependentBens = new Array()
		if (nbrpending > 0)
			StoreDependentInfo(NewDepList,DependentBens)
		else
			StoreDependentInfo(NewDateDepList,DependentBens)
		keepcheck1()
	} else
		self.document.getElementById("main").src = "/lawson/xbnnet/benbulletin2.htm"
}
function SortBenefits()
{
	var temp = new Array()
	for(var i=0;i<EligPlanGroups.length;i++) {
		for(var j=0;j<ElectedPlans.length;j++) {
			if(typeof(EligPlanGroups[i][0])!="undefined" && EligPlanGroups[i][0]==ElectedPlans[j][3])
				temp[temp.length] = ElectedPlans[j]
		}
	}
	ElectedPlans = temp
}
function SetCoverageLimits()
{
	for(var i=0;i<EligPlans.length;i++) 
	{
		//is this plan's coverage a limit of another plan?
		if (EligPlans[i][20] && EligPlans[i][21])
		{
			for(var j=0;j<ElectedPlans.length;j++) 
			{
				var plan_type = ""
				var plan_code = ""
				if(parseInt(ElectedPlans[j][0],10)==1)
				{
					plan_type = ElectedPlans[j][2][11]
					plan_code = ElectedPlans[j][2][12]
				}
				else if(parseInt(ElectedPlans[j][0],10)>1 && parseInt(ElectedPlans[j][0],10)<6)
				{
					plan_type = ElectedPlans[j][2][37]
					plan_code = ElectedPlans[j][2][38]
				}
				else if(parseInt(ElectedPlans[j][0],10)>5 && parseInt(ElectedPlans[j][0],10)<11)
				{
					plan_type = ElectedPlans[j][2][38]
					plan_code = ElectedPlans[j][2][39]
				}
				else if(parseInt(ElectedPlans[j][0],10)==12)
				{
					plan_type = ElectedPlans[j][2][1]
					plan_code = ElectedPlans[j][2][2]
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
	var index
	var dep
	if(typeof(DependentBens)=="undefined")
		DependentBens = new Array()
	for(var i=0;i<ElectedPlans.length;i++) {
		for(var j=0;j<dependentList.length;j++)	{
			if(ElectedPlans[i][2][98] == dependentList[j].plan_code && ElectedPlans[i][2][99] == dependentList[j].plan_type
			&& ElectedPlans[i][5] == formjsDate(formatDME(dependentList[j].emp_start)))	{
				dep = SelectDependent(dependentList[j].dependent)
				if (dep == -1) 
					continue
				if(typeof(DependentBens[i])=="undefined") {
					DependentBens[i] = new Array()
					DependentBens[i][1] = new Array()
				}
				index = DependentBens[i][1].length
				DependentBens[i][1][index] = new Object()
				DependentBens[i][1][index].first_name = dependents[dep].first_name
				DependentBens[i][1][index].last_name = dependents[dep].last_name
				DependentBens[i][1][index].dependent = dependentList[j].dependent
			}
		}
	}
}
function doParseFloat(str)
{
	if (str)
		return parseFloat(str)
	else
		return 0
}
function setelected(temp)
{
	if (parseFloat(temp[3]) == parseFloat(BenefitRules[2]))
		alreadyElect="Y"
	ElectedPlans[ElectedPlans.length]			= new Array()
	ElectedPlans[ElectedPlans.length-1][5]		= temp[3]
	ElectedPlans[ElectedPlans.length-1][0]		= temp[22]
	ElectedPlans[ElectedPlans.length-1][1]		= temp[5]
	ElectedPlans[ElectedPlans.length-1][2]		= new Array()
	ElectedPlans[ElectedPlans.length-1][3]		= temp[32]
	ElectedPlans[ElectedPlans.length-1][7] 		= temp[41]
	ElectedPlans[ElectedPlans.length-1][8] 		= temp[42]
	ElectedPlans[ElectedPlans.length-1][9] 		= temp[43]
	ElectedPlans[ElectedPlans.length-1][2][0]	= ''
	ElectedPlans[ElectedPlans.length-1][2][1]	= ''
	ElectedPlans[ElectedPlans.length-1][2][2]	= ''
	ElectedPlans[ElectedPlans.length-1][2][3]	= ''
	ElectedPlans[ElectedPlans.length-1][2][4]	= ''
	ElectedPlans[ElectedPlans.length-1][2][5]	= ''
	ElectedPlans[ElectedPlans.length-1][2][6]	= ''
	ElectedPlans[ElectedPlans.length-1][2][7]	= ''
	ElectedPlans[ElectedPlans.length-1][2][8]	= ''
	ElectedPlans[ElectedPlans.length-1][2][9]	= ''
	ElectedPlans[ElectedPlans.length-1][2][10]	= ''
	ElectedPlans[ElectedPlans.length-1][2][11]	= ''
	ElectedPlans[ElectedPlans.length-1][2][12]	= ''
	ElectedPlans[ElectedPlans.length-1][2][13]	= ''
	ElectedPlans[ElectedPlans.length-1][2][14]	= ''
	ElectedPlans[ElectedPlans.length-1][2][15]	= ''
	ElectedPlans[ElectedPlans.length-1][2][16]	= ''
	ElectedPlans[ElectedPlans.length-1][2][17]	= ''
	ElectedPlans[ElectedPlans.length-1][2][18]	= ''
	ElectedPlans[ElectedPlans.length-1][2][19]	= ''
	ElectedPlans[ElectedPlans.length-1][2][20]	= ''
	ElectedPlans[ElectedPlans.length-1][2][21]	= ''
	ElectedPlans[ElectedPlans.length-1][2][22]	= ''
	ElectedPlans[ElectedPlans.length-1][2][23]	= ''
	ElectedPlans[ElectedPlans.length-1][2][24]	= ''
	ElectedPlans[ElectedPlans.length-1][2][25]	= ''
	ElectedPlans[ElectedPlans.length-1][2][26]	= ''
	ElectedPlans[ElectedPlans.length-1][2][27]	= ''
	ElectedPlans[ElectedPlans.length-1][2][28]	= ''
	ElectedPlans[ElectedPlans.length-1][2][29]	= ''
	ElectedPlans[ElectedPlans.length-1][2][30]	= ''
	ElectedPlans[ElectedPlans.length-1][2][31]	= ''
	ElectedPlans[ElectedPlans.length-1][2][32]	= ''
	ElectedPlans[ElectedPlans.length-1][2][33]	= ''
	ElectedPlans[ElectedPlans.length-1][2][34]	= ''
	ElectedPlans[ElectedPlans.length-1][2][35]	= ''
	ElectedPlans[ElectedPlans.length-1][2][36]	= ''
	ElectedPlans[ElectedPlans.length-1][2][37]	= ''
	ElectedPlans[ElectedPlans.length-1][2][38]	= ''
	ElectedPlans[ElectedPlans.length-1][2][39]	= ''
	ElectedPlans[ElectedPlans.length-1][2][40]	= ''
	ElectedPlans[ElectedPlans.length-1][2][41]	= ''
	ElectedPlans[ElectedPlans.length-1][2][42] 	= temp[41]
	ElectedPlans[ElectedPlans.length-1][2][43] 	= temp[42]
	ElectedPlans[ElectedPlans.length-1][2][44] 	= temp[43]
	ElectedPlans[ElectedPlans.length-1][2][9]	= temp[3]
	temp[18]=doParseFloat(temp[18])
	temp[19]=doParseFloat(temp[19])
	if(doParseFloat(ElectedPlans[ElectedPlans.length-1][0])==1)	{
		ElectedPlans[ElectedPlans.length-1][2][1]	= temp[16]
		ElectedPlans[ElectedPlans.length-1][2][2]	= temp[23]
		ElectedPlans[ElectedPlans.length-1][2][3]	= temp[13]
		ElectedPlans[ElectedPlans.length-1][2][6]	= temp[21]
		ElectedPlans[ElectedPlans.length-1][2][4]	= temp[13]
		ElectedPlans[ElectedPlans.length-1][2][5]	= doParseFloat(temp[18])+doParseFloat(temp[19])
		ElectedPlans[ElectedPlans.length-1][2][8]	= temp[12]
		ElectedPlans[ElectedPlans.length-1][2][11]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][12]	= temp[2]
		ElectedPlans[ElectedPlans.length-1][2][24]	= temp[11]		                                          	       
		ElectedPlans[ElectedPlans.length-1][2][42]	= temp[11]
		ElectedPlans[ElectedPlans.length-1][2][25]	= temp[18]
		ElectedPlans[ElectedPlans.length-1][2][26]	= temp[19]		                                          	       
		ElectedPlans[ElectedPlans.length-1][2][99]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98]	= temp[2]		                                          	       
	}
	if(doParseFloat(ElectedPlans[ElectedPlans.length-1][0])==2)	{
		ElectedPlans[ElectedPlans.length-1][2][4]	= temp[31]
		ElectedPlans[ElectedPlans.length-1][2][2]	= temp[5]
		ElectedPlans[ElectedPlans.length-1][2][5]	= temp[8]
		ElectedPlans[ElectedPlans.length-1][2][7]	= temp[24]
		ElectedPlans[ElectedPlans.length-1][2][14]	= temp[8]
		ElectedPlans[ElectedPlans.length-1][2][20]	= temp[21]
		ElectedPlans[ElectedPlans.length-1][2][15]	= temp[13]
		ElectedPlans[ElectedPlans.length-1][2][18]	= doParseFloat(temp[18])+doParseFloat(temp[19])
		ElectedPlans[ElectedPlans.length-1][2][24]	= temp[12]
		ElectedPlans[ElectedPlans.length-1][2][42]	= temp[11]
		ElectedPlans[ElectedPlans.length-1][2][37]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][38]	= temp[2]
		ElectedPlans[ElectedPlans.length-1][2][63]	= temp[18]
		ElectedPlans[ElectedPlans.length-1][2][64]	= temp[19]		                                          	       
		ElectedPlans[ElectedPlans.length-1][2][99]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98]	= temp[2]		                                          	       
	}
	if(doParseFloat(ElectedPlans[ElectedPlans.length-1][0])==3 || 
	doParseFloat(ElectedPlans[ElectedPlans.length-1][0])==13)	{
		ElectedPlans[ElectedPlans.length-1][2][2]	= temp[5]
		ElectedPlans[ElectedPlans.length-1][2][17]	= temp[9]
		ElectedPlans[ElectedPlans.length-1][2][20]	= temp[21]
		ElectedPlans[ElectedPlans.length-1][2][14]	= temp[8]
		ElectedPlans[ElectedPlans.length-1][2][15]	= temp[13]
		ElectedPlans[ElectedPlans.length-1][2][18]	= doParseFloat(temp[18])+doParseFloat(temp[19])
		ElectedPlans[ElectedPlans.length-1][2][24]	= temp[12]
		ElectedPlans[ElectedPlans.length-1][2][42]	= temp[11]
		ElectedPlans[ElectedPlans.length-1][2][37]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][38]	= temp[2]
		ElectedPlans[ElectedPlans.length-1][2][63]	= temp[18]
		ElectedPlans[ElectedPlans.length-1][2][64]	= temp[19]		                                          	       
		ElectedPlans[ElectedPlans.length-1][2][99]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98]	= temp[2]		                                          	       
	}
	if(doParseFloat(ElectedPlans[ElectedPlans.length-1][0])==4)	{
		ElectedPlans[ElectedPlans.length-1][2][2]	= temp[5]
		ElectedPlans[ElectedPlans.length-1][2][17]	= temp[8]
		ElectedPlans[ElectedPlans.length-1][2][20]	= temp[21]
		ElectedPlans[ElectedPlans.length-1][2][15]	= temp[13]
		ElectedPlans[ElectedPlans.length-1][2][18]	= doParseFloat(temp[18])+doParseFloat(temp[19])
		ElectedPlans[ElectedPlans.length-1][2][24]	= temp[12]
		ElectedPlans[ElectedPlans.length-1][2][42]	= temp[11]
		ElectedPlans[ElectedPlans.length-1][2][37]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][38]	= temp[2]
		ElectedPlans[ElectedPlans.length-1][2][63]	= temp[18]
		ElectedPlans[ElectedPlans.length-1][2][64]	= temp[19]		                                          	       
		ElectedPlans[ElectedPlans.length-1][2][99]	= temp[1]                                          	       
	}
	if(doParseFloat(ElectedPlans[ElectedPlans.length-1][0])==5)	{
		ElectedPlans[ElectedPlans.length-1][2][2]	= temp[5]
		ElectedPlans[ElectedPlans.length-1][2][12]	= temp[20]
		ElectedPlans[ElectedPlans.length-1][2][15]	= temp[13]
		ElectedPlans[ElectedPlans.length-1][2][20]	= temp[21]
		ElectedPlans[ElectedPlans.length-1][2][18]	= doParseFloat(temp[18])+doParseFloat(temp[19])
		ElectedPlans[ElectedPlans.length-1][2][24]	= temp[12]
		ElectedPlans[ElectedPlans.length-1][2][42]	= temp[11]
		ElectedPlans[ElectedPlans.length-1][2][37]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][38]	= temp[2]
		ElectedPlans[ElectedPlans.length-1][2][63]	= temp[18]
		ElectedPlans[ElectedPlans.length-1][2][64]	= temp[19]		                                          	       
		ElectedPlans[ElectedPlans.length-1][2][99]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98]	= temp[2] 		                                          	       
	}
	if(doParseFloat(ElectedPlans[ElectedPlans.length-1][0])==6)	{
		ElectedPlans[ElectedPlans.length-1][2][2]	= temp[5]
		ElectedPlans[ElectedPlans.length-1][2][23]	= temp[27]
		ElectedPlans[ElectedPlans.length-1][2][26]	= temp[13]
		ElectedPlans[ElectedPlans.length-1][2][16]	= temp[37]
		ElectedPlans[ElectedPlans.length-1][2][22]	= temp[12]
		ElectedPlans[ElectedPlans.length-1][2][38]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][39]	= temp[2]
		ElectedPlans[ElectedPlans.length-1][2][37]	= temp[16]
		ElectedPlans[ElectedPlans.length-1][2][40]	= temp[16]
		ElectedPlans[ElectedPlans.length-1][2][56]	= temp[18]
		ElectedPlans[ElectedPlans.length-1][2][57]	= temp[19]		                                          	       
		ElectedPlans[ElectedPlans.length-1][2][99]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98]	= temp[2]
		ElectedPlans[ElectedPlans.length-1][2][42]	= temp[11]
		ElectedPlans[ElectedPlans.length-1][2][24]	= temp[11]
		ElectedPlans[ElectedPlans.length-1][2][17] 	= -1	
	}
	if(doParseFloat(ElectedPlans[ElectedPlans.length-1][0])==7) {
		ElectedPlans[ElectedPlans.length-1][2][2]	= temp[5]
		ElectedPlans[ElectedPlans.length-1][2][23]	= temp[25]
		ElectedPlans[ElectedPlans.length-1][2][26]	= temp[13]
		ElectedPlans[ElectedPlans.length-1][2][16]	= doParseFloat(temp[18])+doParseFloat(temp[19])
		ElectedPlans[ElectedPlans.length-1][2][18]	= temp[21]
		ElectedPlans[ElectedPlans.length-1][2][22]	= temp[12]
		ElectedPlans[ElectedPlans.length-1][2][42]	= temp[11]
		ElectedPlans[ElectedPlans.length-1][2][38]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][39]	= temp[2]
		ElectedPlans[ElectedPlans.length-1][2][37]	= 1
		ElectedPlans[ElectedPlans.length-1][2][56]	= temp[18]
		ElectedPlans[ElectedPlans.length-1][2][57]	= temp[19]		
		ElectedPlans[ElectedPlans.length-1][2][99]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98]	= temp[2]		                                          	       
	}
	if(doParseFloat(ElectedPlans[ElectedPlans.length-1][0])==8)	{
		ElectedPlans[ElectedPlans.length-1][2][2]	= temp[5]
		ElectedPlans[ElectedPlans.length-1][2][23]	= temp[18]
		ElectedPlans[ElectedPlans.length-1][2][36]	= temp[19]
		ElectedPlans[ElectedPlans.length-1][2][26]	= temp[13]
		ElectedPlans[ElectedPlans.length-1][2][16]	= temp[37]
		ElectedPlans[ElectedPlans.length-1][2][22]	= temp[12]
		ElectedPlans[ElectedPlans.length-1][2][24]	= temp[11]
		ElectedPlans[ElectedPlans.length-1][2][38]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][39]	= temp[2]
		ElectedPlans[ElectedPlans.length-1][2][37]	= 1
		ElectedPlans[ElectedPlans.length-1][2][41]	= temp[27]
		ElectedPlans[ElectedPlans.length-1][2][42]	= temp[11]
		ElectedPlans[ElectedPlans.length-1][2][56]	= temp[18]
		ElectedPlans[ElectedPlans.length-1][2][57]	= temp[19]		                                          	       
		ElectedPlans[ElectedPlans.length-1][2][99]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98]	= temp[2]		                                          	       
	}
	if(doParseFloat(ElectedPlans[ElectedPlans.length-1][0])==9)	{
		ElectedPlans[ElectedPlans.length-1][2][2]	= temp[5]
		ElectedPlans[ElectedPlans.length-1][2][23]	= temp[18]
		ElectedPlans[ElectedPlans.length-1][2][36]	= temp[19]
		ElectedPlans[ElectedPlans.length-1][2][26]	= temp[13]
		ElectedPlans[ElectedPlans.length-1][2][16]	= temp[37]
		ElectedPlans[ElectedPlans.length-1][2][22]	= temp[12]
		ElectedPlans[ElectedPlans.length-1][2][24]	= temp[11]
		ElectedPlans[ElectedPlans.length-1][2][38]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][39]	= temp[2]
		ElectedPlans[ElectedPlans.length-1][2][37]	= 1
		ElectedPlans[ElectedPlans.length-1][2][41]	= temp[27]
		ElectedPlans[ElectedPlans.length-1][2][42]	= temp[11]
		ElectedPlans[ElectedPlans.length-1][2][56]	= temp[18]
		ElectedPlans[ElectedPlans.length-1][2][57]	= temp[19]
		ElectedPlans[ElectedPlans.length-1][2][99]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98]	= temp[2]		                                          	       
	}
	if(doParseFloat(ElectedPlans[ElectedPlans.length-1][0])==10) {
		ElectedPlans[ElectedPlans.length-1][2][2]	= temp[5]
		ElectedPlans[ElectedPlans.length-1][2][26]	= temp[13]
		ElectedPlans[ElectedPlans.length-1][2][16]	= doParseFloat(temp[18])+doParseFloat(temp[19])
		ElectedPlans[ElectedPlans.length-1][2][22]	= temp[12]
		ElectedPlans[ElectedPlans.length-1][2][18]	= temp[21]
		ElectedPlans[ElectedPlans.length-1][2][42]	= temp[11]
		ElectedPlans[ElectedPlans.length-1][2][38]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][39]	= temp[2]
		ElectedPlans[ElectedPlans.length-1][2][56]	= temp[18]
		ElectedPlans[ElectedPlans.length-1][2][57]	= temp[19]		                                          	       
		ElectedPlans[ElectedPlans.length-1][2][99]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98]	= temp[2]
		ElectedPlans[ElectedPlans.length-1][2][99]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98]	= temp[2]		                                          	       
	}
	if(doParseFloat(ElectedPlans[ElectedPlans.length-1][0])==12) {
		ElectedPlans[ElectedPlans.length-1][2][2]	= temp[5]
		ElectedPlans[ElectedPlans.length-1][2][42]	= temp[11]
		ElectedPlans[ElectedPlans.length-1][2][1]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][2]	= temp[2]
		ElectedPlans[ElectedPlans.length-1][2][38]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][39]	= temp[2]
		ElectedPlans[ElectedPlans.length-1][2][99]	= temp[1]
		ElectedPlans[ElectedPlans.length-1][2][98]	= temp[2]
	}
	oldelected=new Array()
	oldelected=ElectedPlans
	oldElectionsIn="SYSTEM"
}

