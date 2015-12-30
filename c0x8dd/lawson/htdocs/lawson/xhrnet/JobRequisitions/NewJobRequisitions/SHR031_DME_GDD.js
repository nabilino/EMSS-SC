// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/JobRequisitions/NewJobRequisitions/SHR031_DME.js,v 1.11.2.51 2014/02/26 16:07:00 brentd Exp $
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
var selectHtml = '';
var processLevelKey;
var selectedScheduleRec = null;

function GetDME_HRSUPER()
{
	HrSuper = new Array();
	HrSuperCodes = new Array();
	var pDMEObj = new DMEObject(authUser.prodline, "HRSUPER");
	pDMEObj.out = "JAVASCRIPT";
	pDMEObj.index = "HSUSET3";
	pDMEObj.field = "code";
	pDMEObj.key = String(authUser.company)+"="+String(authUser.employee);
	pDMEObj.cond = "active-code";
	if (emssObjInstance.emssObj.filterSelect)		
		pDMEObj.max = "1";
	else
		pDMEObj.max = "600";
	pDMEObj.func = "DME_HRSUPER_Done()";
	pDMEObj.exclude = "drills;keys";
	pDMEObj.debug = false;
	DME(pDMEObj,"jsreturn");
}
function DME_HRSUPER_Done()
{
	HrSuper = HrSuper.concat(self.jsreturn.record);
	if (HrSuper.length == 0)
	{
		removeWaitAlert();		
		seaAlert(getSeaPhrase("NOT_SUPERVISOR","ESS"), null, null, "error")
		return;
	}
	for (var i=0; i<self.jsreturn.record.length; i++)
		HrSuperCodes[HrSuperCodes.length] = self.jsreturn.record[i].code;
	if (emssObjInstance.emssObj.filterSelect)
		DrawLeftWindow();
	else
	{
		if (self.jsreturn.Next != "") 
		{
			self.jsreturn.location.replace(self.jsreturn.Next);
			return;
		}
		DMECall("JOBCODE","JBCSET1","job-code;description",String(authUser.company),"active","","","job");
	}
}
var HrSuperDescs = new Array();     // hash array to store HRSUPER descriptions by code
function GetDME_HRSUPER_DESC(code)
{
     var pDMEObj = new DMEObject(authUser.prodline, "HRSUPER");
     pDMEObj.out = "JAVASCRIPT";
     pDMEObj.index = "HSUSET1";
     pDMEObj.field = "code;description";
     pDMEObj.key = String(authUser.company)+"="+escape(String(code),1);
     pDMEObj.cond = "active-code";
     pDMEObj.max = "1";
     pDMEObj.func = "DME_HRSUPER_DESC_Done()";
     pDMEObj.exclude = "drills;keys";
     pDMEObj.debug = false;
     DME(pDMEObj,"jsreturn");
}
function DME_HRSUPER_DESC_Done()
{
     if (self.jsreturn.NbrRecs > 0)
     {
          var hsuRec = self.jsreturn.record[0];         
          HrSuperDescs[hsuRec.code] = hsuRec.description; 
          PA42.Supervisor.Description = hsuRec.description; 
     }
     else
     {
          HrSuperDescs[hsuRec.code] = hsuRec.code; 
          PA42.Supervisor.Description = hsuRec.code;           
     }
     FillDefaults_Render();
}
function SelectObject()
{
	this.JobCode = new Array();
	this.ReqStatus = new Array();
	this.ProcessLevel = new Array();
	this.Department = new Array();
	this.Location = new Array();
	this.UserLevel = new Array();
	this.Supervisor = new Array();
	this.EmployeeStatus = new Array();
	this.Currency = new Array();
	this.WorkSchedule = new Array();
	this.Union = new Array();
	this.BargainUnit = new Array();
	this.Index = 0;
	this.gotProcessLevel = false;
	this.gotDepartment = false;
	this.gotSupervisor = false;
	this.gotEmployeeStatus = false;	
	this.gotCurrency = false;
	this.gotWorkSchedule = false;
}
function sortByDescription(obj1, obj2)
{
	var name1 = obj1.description;
	var name2 = obj2.description;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}
function sortByName(obj1, obj2)
{
	var name1 = obj1.name;
	var name2 = obj2.name;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}
function sortByStep(obj1, obj2)
{
	var name1 = obj1.pay_step;
	var name2 = obj2.pay_step;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}
function sortByGrade(obj1, obj2)
{
	var name1 = obj1.pay_grade;
	var name2 = obj2.pay_grade;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}
function sortByReportDescription(obj1, obj2)
{
	var name1 = obj1.Description;
	var name2 = obj2.Description;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}
function DMECall(Tkn, Ind, Flds, Key, Cond, SortOn, Select, Option, OTMMax)
{
	var pDMEObj = new DMEObject(authUser.prodline, String(Tkn))
	pDMEObj.out = "JAVASCRIPT"
	pDMEObj.index = String(Ind);
	pDMEObj.field = String(Flds);
	pDMEObj.key = String(Key);
	pDMEObj.cond = String(Cond);
	pDMEObj.max = "600";	
	pDMEObj.exclude = "drills;keys";
	pDMEObj.debug = false;		
	pDMEObj.func = "DMECall_DONE('"+Tkn+"','','"+Option+"')";
	if (typeof(OTMMax) != "undefined" && OTMMax)	
		pDMEObj.otmmax = String(OTMMax);
	if (typeof(SortOn) != "undefined" && SortOn)	
		pDMEObj.sortasc = String(SortOn);
	if (typeof(Select) != "undefined" && Select)
		pDMEObj.select = String(Select);
	DME(pDMEObj,"jsreturn")
}
function DMECall_DONE(Tkn, Key, Option)
{
	switch (Option)
	{
		case "job": Selects.JobCode = Selects.JobCode.concat(self.jsreturn.record); break;
		case "pcodes":
			var tmpObj;
			for (var i=0; i<self.jsreturn.NbrRecs; i++) 
			{
				tmpObj = self.jsreturn.record[i];
				if (tmpObj.type == "RQ")
					Selects.ReqStatus[Selects.ReqStatus.length] = tmpObj; 
				else if (tmpObj.type == "LO")
					Selects.Location[Selects.Location.length] = tmpObj;
				else if (tmpObj.type == "UL")
					Selects.UserLevel[Selects.UserLevel.length] = tmpObj;
				else if (tmpObj.type == "UN")
					Selects.Union[Selects.Union.length] = tmpObj;
				else if (tmpObj.type == "BU")
					Selects.BargainUnit[Selects.BargainUnit.length] = tmpObj;
			}
			break;
		case "ProcessLevel": Selects.ProcessLevel = Selects.ProcessLevel.concat(self.jsreturn.record); break;
		case "Department": Selects.Department = Selects.Department.concat(self.jsreturn.record); break;
		case "Supervisor": Selects.Supervisor = Selects.Supervisor.concat(self.jsreturn.record); break;
		case "EmployeeStatus": Selects.EmployeeStatus = Selects.EmployeeStatus.concat(self.jsreturn.record); break;
		case "Currency": Selects.Currency = Selects.Currency.concat(self.jsreturn.record); break;
		case "WorkSchedule": Selects.WorkSchedule = Selects.WorkSchedule.concat(self.jsreturn.record); break;		
		default: break;	
	}
	if (Tkn != "HS10" && typeof(self.jsreturn.Next)!="undefined" && self.jsreturn.Next != "") 
	{
		self.jsreturn.location.replace(self.jsreturn.Next);
		return;
	}
	if (Option == "Supervisor")
		Selects.Supervisor.sort(sortByDescription);
	switch (Tkn)
	{
		case "JOBCODE":
			Selects.JobCode.sort(sortByDescription);
			if (!Selects.ReqStatus.length)
				DMECall("PCODES","PCOSET1","type;code;description;web-avail-supv","RQ;LO;UL;UN;BU","active","","","pcodes");
			else
				DMECall_DONE("PCODES");
			break;
		case "PCODES":
			Selects.ReqStatus.sort(sortByDescription);
			Selects.Location.sort(sortByDescription);
			Selects.UserLevel.sort(sortByDescription);
			Selects.Union.sort(sortByDescription);
			Selects.BargainUnit.sort(sortByDescription);
			DrawLeftWindow();
			break;
		case "PRSYSTEM":
			Selects.ProcessLevel.sort(sortByName);
			var selObj = self.right.document.newjobreqdtlform.processlevel;			
			var selCode = selObj.options[selObj.selectedIndex].value;
			var selIndex = 0;
			selObj.innerHTML = "";
			var tmpObj = self.right.document.createElement("OPTION");
			tmpObj.value = " ";
			tmpObj.text = " ";
			if (navigator.appName.indexOf("Microsoft") >= 0)
				selObj.add(tmpObj);
			else
				selObj.appendChild(tmpObj);
			for (var j=0; j<Selects.ProcessLevel.length; j++) 
			{
				tmpVal = Selects.ProcessLevel[j].process_level;
				tmpDesc = Selects.ProcessLevel[j].name;
				tmpObj = self.right.document.createElement("OPTION");
				tmpObj.value = tmpVal;
				tmpObj.text = tmpDesc;
				tmpObj.setAttribute("rflag",String(Selects.ProcessLevel[j].recruit_flag));
				if (navigator.appName.indexOf("Microsoft") >= 0)
					selObj.add(tmpObj);
				else
					selObj.appendChild(tmpObj);
				if (selCode == tmpVal)
					selIndex = j+1;
			}
			selObj.selectedIndex = selIndex;
			self.right.styleElement(selObj);
			removeWaitAlert();
			break;
		case "DEPTCODE":
			Selects.Department.sort(sortByName);
			var selObj = self.right.document.newjobreqdtlform.department;			
			var selCode = selObj.options[selObj.selectedIndex].value;
			var selIndex = 0;
			selObj.innerHTML = "";
			var tmpObj = self.right.document.createElement("OPTION");
			tmpObj.value = " ";
			tmpObj.text = " ";				
			if (navigator.appName.indexOf("Microsoft") >= 0)
				selObj.add(tmpObj);
			else
				selObj.appendChild(tmpObj);
			for (var j=0; j<Selects.Department.length; j++) 
			{
				tmpVal = Selects.Department[j].department;
				tmpDesc = Selects.Department[j].name;
				tmpObj = self.right.document.createElement("OPTION");
				tmpObj.value = tmpVal;
				tmpObj.text = tmpDesc;
				if (navigator.appName.indexOf("Microsoft") >= 0)
					selObj.add(tmpObj);
				else
					selObj.appendChild(tmpObj);
				if (selCode == tmpVal)
					selIndex = j+1;
			}
			selObj.selectedIndex = selIndex;
			self.right.styleElement(selObj);
			removeWaitAlert();
			break;			
		case "HRSUPER":
			Selects.Supervisor.sort(sortByDescription);
			var selObj = self.right.document.newjobreqdtlform.supervisor;			
			var selCode = selObj.options[selObj.selectedIndex].value;
			var selIndex = 0;
			selObj.innerHTML = "";
			var tmpObj = self.right.document.createElement("OPTION");
			tmpObj.value = " ";
			tmpObj.text = " ";				
			if (navigator.appName.indexOf("Microsoft") >= 0)
				selObj.add(tmpObj);
			else
				selObj.appendChild(tmpObj);
			for (var j=0; j<Selects.Supervisor.length; j++) 
			{
				tmpVal = Selects.Supervisor[j].code;
				tmpDesc = Selects.Supervisor[j].description;	
				tmpObj = self.right.document.createElement("OPTION");
				tmpObj.value = tmpVal;
				tmpObj.text = tmpDesc;
				if (navigator.appName.indexOf("Microsoft") >= 0)
					selObj.add(tmpObj);
				else
					selObj.appendChild(tmpObj);
				if (selCode == tmpVal)
					selIndex = j+1;
			}
			selObj.selectedIndex = selIndex;
			self.right.styleElement(selObj);
			removeWaitAlert();		
			break;
		case "HRWRKSCHD":
			Selects.WorkSchedule.sort(sortByDescription);
			var selObj = self.right.document.newjobreqdtlform.workschedule;			
			var selCode = selObj.options[selObj.selectedIndex].value;
			var selIndex = 0;
			selObj.innerHTML = "";
			var tmpObj = self.right.document.createElement("OPTION");
			tmpObj.value = " ";
			tmpObj.text = " ";				
			if (navigator.appName.indexOf("Microsoft") >= 0)
				selObj.add(tmpObj);
			else
				selObj.appendChild(tmpObj);
			for (var j=0; j<Selects.WorkSchedule.length; j++) 
			{
				tmpVal = Selects.WorkSchedule[j].work_sched;
				tmpDesc = Selects.WorkSchedule[j].description;
				tmpObj = self.right.document.createElement("OPTION");
				tmpObj.value = tmpVal;
				tmpObj.text = tmpDesc;
				if (navigator.appName.indexOf("Microsoft") >= 0)
					selObj.add(tmpObj);
				else
					selObj.appendChild(tmpObj);
				if (selCode == tmpVal)
					selIndex = j+1;
			}
			selObj.selectedIndex = selIndex;
			self.right.styleElement(selObj);
			removeWaitAlert();			
			break;				
		case "EMSTATUS":
			Selects.EmployeeStatus.sort(sortByDescription);
			var selObj = self.right.document.newjobreqdtlform.employeestatus;			
			var selCode = selObj.options[selObj.selectedIndex].value;
			var selIndex = 0;
			selObj.innerHTML = "";
			var tmpObj = self.right.document.createElement("OPTION");
			tmpObj.value = " ";
			tmpObj.text = " ";				
			if (navigator.appName.indexOf("Microsoft") >= 0)
				selObj.add(tmpObj);
			else
				selObj.appendChild(tmpObj);
			for (var j=0; j<Selects.EmployeeStatus.length; j++) 
			{
			//GDD  11/25/14  Only allow specific statuses
			  if (Selects.EmployeeStatus[j].emp_status.indexOf("A") = 0) {
				tmpVal = Selects.EmployeeStatus[j].emp_status;
				tmpDesc = Selects.EmployeeStatus[j].description;
				tmpObj = self.right.document.createElement("OPTION");
				tmpObj.value = tmpVal;
				tmpObj.text = tmpDesc;
				if (navigator.appName.indexOf("Microsoft") >= 0)
					selObj.add(tmpObj);
				else
					selObj.appendChild(tmpObj);
				if (selCode == tmpVal)
					selIndex = j+1;
                  }
                //GDD end of change
			}
			selObj.selectedIndex = selIndex;
			self.right.styleElement(selObj);
			removeWaitAlert();
			break;
		case "CUCODES":
			Selects.Currency.sort(sortByDescription);
			var selObj = self.right.document.newjobreqdtlform.currency;			
			var selCode = selObj.options[selObj.selectedIndex].value;
			var selIndex = 0;
			selObj.innerHTML = "";
			var tmpObj = self.right.document.createElement("OPTION");
			tmpObj.value = " ";
			tmpObj.text = " ";				
			if (navigator.appName.indexOf("Microsoft") >= 0)
				selObj.add(tmpObj);
			else
				selObj.appendChild(tmpObj);
			for (var j=0; j<Selects.Currency.length; j++) 
			{
				tmpVal = Selects.Currency[j].currency_code;
				tmpDesc = Selects.Currency[j].description;
				tmpObj = self.right.document.createElement("OPTION");
				tmpObj.value = tmpVal;
				tmpObj.text = tmpDesc;
				if (navigator.appName.indexOf("Microsoft") >= 0)
					selObj.add(tmpObj);
				else
					selObj.appendChild(tmpObj);
				if (selCode == tmpVal)
					selIndex = j+1;
			}
			selObj.selectedIndex = selIndex;
			self.right.styleElement(selObj);
			removeWaitAlert();
			break;
		case "HS10":
			PA42.DirectReports.sort(sortByReportDescription);
			var selObj = self.right.document.newjobreqdtlform.replacementfor;			
			var selCode = selObj.options[selObj.selectedIndex].value;
			var selIndex = 0;
			selObj.innerHTML = "";
			var tmpObj = self.right.document.createElement("OPTION");
			tmpObj.value = " ";
			tmpObj.text = " ";				
			if (navigator.appName.indexOf("Microsoft") >= 0)
				selObj.add(tmpObj);
			else
				selObj.appendChild(tmpObj);
			for (var j=0; j<PA42.DirectReports.length; j++) 
			{
				tmpVal = PA42.DirectReports[j].Code;
				tmpDesc = PA42.DirectReports[j].Description;
				tmpObj = self.right.document.createElement("OPTION");
				tmpObj.value = tmpVal;
				tmpObj.text = tmpDesc;
				if (navigator.appName.indexOf("Microsoft") >= 0)
					selObj.add(tmpObj);
				else
					selObj.appendChild(tmpObj);
				if (selCode == tmpVal)
					selIndex = j+1;
			}
			selObj.selectedIndex = selIndex;
			self.right.styleElement(selObj);
			removeWaitAlert();
			break;
	}		
}
/* Filter Select logic - start */
function SuperObject()
{
	this.data = new Array();
	this.currEmpNbr = 0;
}
SuperObject.prototype.setCurrentEmpNbr = function(nbr)
{
	this.currEmpNbr = Number(nbr);
}
SuperObject.prototype.getIndex = function(nbr)
{
	if (!this.data)
		this.data = new Array();
	for (var i=0; i<this.data.length; i++)
	{
		if (Number(this.data[i].nbr) == Number(nbr))
			return i;
	}
	return -1;
}
SuperObject.prototype.getSuper = function(nbr)
{
	if (!nbr)
		return null;
	nbr = Number(nbr);
	var idx = this.getIndex(nbr);	
	if (idx != -1)
		return this.data[idx];
	else
		return null;	
}
SuperObject.prototype.addSuper = function(nbr, name, lastname, codes)
{
	if (!nbr)
		return false;
	nbr = Number(nbr);
	var idx = this.getIndex(nbr);	
	if (idx == -1)
	{
		//insert into array, sorted by name
		var i = 0;
		while (i < this.data.length && this.data[i].lastname <= lastname) 
			i++;
		var sObj = new SuperCodesObject(nbr, name, lastname, codes);
		this.data.splice(i, 0, sObj);
		return true;
	}
	else if (!this.data[idx].codes && codes)
		this.data[idx].codes = codes;
	return false;
}
SuperObject.prototype.getCurrentSuper = function()
{
	return this.getSuper(this.currEmpNbr);
}	
function SuperCodesObject(nbr, name, lastname, codes)
{
	this.nbr = nbr || 0;
	this.name = name || "";
	this.lastname = lastname || "";
	this.codes = codes || null;
}
var superObj = new SuperObject();
function getMgrSuperCodes(empNbr)
{
	if (!empNbr)
		empNbr = authUser.employee;
	superObj.setCurrentEmpNbr(empNbr);
	var currSuper = superObj.getCurrentSuper();
	if (!currSuper || !currSuper.codes)
	{
		var dmeObj = new DMEObject(authUser.prodline, "hrsuper");
		dmeObj.out = "JAVASCRIPT";
		dmeObj.index = "hsuset3";
		dmeObj.field = "code;label-name-1;employee.last-name";
		dmeObj.key = String(parseInt(authUser.company,10))+"="+String(parseInt(empNbr,10));
		dmeObj.cond = "active-code";
		dmeObj.max = "600";
		dmeObj.otmmax = "1";
		dmeObj.func = "storeMgrSuperCodes("+Number(empNbr)+")";
		dmeObj.exclude = "drills;keys";
		dmeObj.debug = false;
		DME(dmeObj,"jsreturn");		
	}
	else
		openDmeFieldFilter("replacementfor");
}
function storeMgrSuperCodes(empNbr)
{
	var codeArr = new Array();
	var nbrRecs = self.jsreturn.NbrRecs;
	for (var i=0; i<nbrRecs; i++)
		codeArr[i] = self.jsreturn.record[i].code;
	var empName = "";
	var lastName = "";
	if (nbrRecs > 0)
	{
		empName = self.jsreturn.record[0].label_name_1;
		lastName = self.jsreturn.record[0].employee_last_name;
	}
	else if (Number(empNbr) == Number(authUser.employee))
	{
		empName = authUser.name;
		var nameParts = authUser.name.split(" ");
		lastName = nameParts[nameParts.length-1];
	}	
	superObj.addSuper(empNbr, empName, lastName, codeArr.join(";"));	
	openDmeFieldFilter("replacementfor");
}
function refreshReplacementForSelect(selObj)
{
	var selIndex = 0;
	var empObj, rptOpt;
	selObj.innerHTML = "";
	for (var i=0; i<superObj.data.length; i++)
	{
		empObj = superObj.data[i];
		rptOpt = filterWin.document.createElement("option");
		rptOpt.value = "" + Number(empObj.nbr);
		rptOpt.text = "" + empObj.name;
		if (Number(empObj.nbr) == Number(superObj.currEmpNbr))
			selIndex = i;
		if (navigator.appName.indexOf("Microsoft") >= 0)
			selObj.add(rptOpt);
		else
			selObj.appendChild(rptOpt);
	}
	selObj.selectedIndex = selIndex;
	selObj.onchange = function()
	{
		var val = this.options[this.selectedIndex].value;
		if (val != "")
			getMgrSuperCodes(val);
	}			
}
function performDmeFieldFilterOnLoad(dmeFilter)
{
	switch (dmeFilter.getFieldNm().toLowerCase())
	{	
		case "position":
			dmeFilter.addFilterField("process-level", 5, getSeaPhrase("PROCESS_LEVEL_CODE","ESS"), true);
			dmeFilter.addFilterField("department", 5, getSeaPhrase("DEPARTMENT_CODE","ESS"), true);
			dmeFilter.addFilterField("position", 12, getSeaPhrase("JOB_PROFILE_8","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);	
			filterDmeCall(dmeFilter,
				"jsreturn",
				"paposition", 
				"posset3", 
				"process-level;department;position;description;", 
				String(authUser.company), 
				"active-current", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);
		break;
		case "job":
			dmeFilter.addFilterField("job-code", 9, getSeaPhrase("JOB_OPENINGS_6","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"jobcode", 
				"jbcset1", 
				"job-code;description;", 
				String(authUser.company), 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);			
		break;	
		case "status":						
			dmeFilter.addFilterField("code", 10, getSeaPhrase("STATUS","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes", 
				"pcoset1", 
				"code;description", 
				"RQ", 
				"web-supv-activ", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;		
		case "processlevel":
			dmeFilter.addFilterField("process-level", 5, getSeaPhrase("PROCESS_LEVEL_CODE","ESS"), true);
			dmeFilter.addFilterField("name", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);		
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prsystem",
				"prsset1",
				"process-level;name;recruit-flag;currency-flag;currency-code;currency.description",
				String(authUser.company),
				"active-pl",
				null,
				dmeFilter.getNbrRecords(),
				null);		
		break;
		case "department":			
			dmeFilter.addFilterField("department", 5, getSeaPhrase("DEPARTMENT_CODE","ESS"), true);
			var dtlForm = self.right.document.newjobreqdtlform;
			var keyValue;
			// if there is a process level selected, do not allow the user to select a department from a different process level
			if (!emssObjInstance.emssObj.filterSelect)
				processLevelKey = dtlForm.processlevel.options[dtlForm.processlevel.selectedIndex].value;
			else if (emssObjInstance.emssObj.filterSelect)
				processLevelKey = dtlForm.processlevelcode.value;
			if (typeof(processLevelKey) != "undefined" && processLevelKey && NonSpace(processLevelKey) > 0)
				keyValue = String(authUser.company)+"="+processLevelKey;
			else
				keyValue = String(authUser.company);
				dmeFilter.addFilterField("process-level", 5, getSeaPhrase("PROCESS_LEVEL_CODE","ESS"), true);
			dmeFilter.addFilterField("name", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"deptcode",
				"dptset1",
				"department;process-level;name",
				keyValue,
				"active",
				null,
				dmeFilter.getNbrRecords(),
				null);		
		break;
		case "location":						
			dmeFilter.addFilterField("code", 10, getSeaPhrase("JOB_PROFILE_6","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes", 
				"pcoset1", 
				"code;description", 
				"LO", 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;
		case "union":						
			dmeFilter.addFilterField("code", 10, getSeaPhrase("JOB_PROFILE_10","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes", 
				"pcoset1", 
				"code;description", 
				"UN", 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;
		case "bargainunit":						
			dmeFilter.addFilterField("code", 10, getSeaPhrase("BARGAINING_UNIT","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes", 
				"pcoset1", 
				"code;description", 
				"BU", 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;	
		case "userlevel":						
			dmeFilter.addFilterField("code", 10, getSeaPhrase("USER_LEVEL","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes", 
				"pcoset1", 
				"code;description", 
				"UL", 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;		
		case "supervisor":						
			dmeFilter.addFilterField("code", 10, getSeaPhrase("JOB_PROFILE_7","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			dmeFilter.addFilterField("full-name", 49, getSeaPhrase("EMPLOYEE_NAME","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"hrsuper", 
				"hsuset1", 
				"code;description;employee;full-name", 
				String(authUser.company), 
				"active-code", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;	
		case "employeestatus":
			dmeFilter.addFilterField("emp-status", 2, getSeaPhrase("EMPLOYEE_STATUS","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"emstatus", 
				"emsset1", 
				"emp-status;description", 
				String(authUser.company), 
				"active-emp", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;
		case "currency":
			dmeFilter.addFilterField("currency-code", 5, getSeaPhrase("QUAL_16","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"cucodes", 
				"cucset1", 
				"currency-code;description", 
				"", 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);				
		break;
		case "workschedule":
			dmeFilter.addFilterField("work-sched", 10, getSeaPhrase("WORK_SCHEDULE","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"hrwrkschd", 
				"wscset1", 
				"work-sched;effect-date;description", 
				String(authUser.company), 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;
		case "replacementfor":
			dmeFilter.getFilterForm().style.display = "none";
			var filterWin = dmeFilter.getWindow();		
			var filterBar = filterWin.document.getElementById("filterBar");
			var rptForm = filterWin.document.createElement("form");
			rptForm.setAttribute("name", "filterRptForm");
			rptForm.setAttribute("id", "filterRptForm");
			rptForm.onsubmit = function() { return false; };
			var rptTbl = filterWin.document.createElement("table");
			rptTbl.setAttribute("border", "0");
			rptTbl.setAttribute("cellspacing", "0");
			rptTbl.setAttribute("cellpadding", "0");
			rptTbl.style.width = "100%";
			rptTbl.style.borderBottom = "0px";
			rptTbl.appendChild(filterWin.document.createElement("thead"));
			var rptTblB = filterWin.document.createElement("tbody");
			var rptTblR = filterWin.document.createElement("tr");
			rptTblB.appendChild(rptTblR);
			rptTbl.appendChild(rptTblB);
			var rptTblC = filterWin.document.createElement("td");
			rptTblC.className = "filterListButton";
			rptTblC.setAttribute("nowrap", "");
			rptTblC.style.whiteSpace = "nowrap";
			rptTblC.style.paddingLeft = "3px";
			var rptLbl = filterWin.document.createTextNode(getSeaPhrase("VIEW_REPORTS_FOR","ESS")+" ");
			rptTblC.appendChild(rptLbl);
			rptTblR.appendChild(rptTblC);
			var rptSel = filterWin.document.createElement("select");
			rptSel.setAttribute("name", "filterRpts");
			rptSel.setAttribute("id", "filterRpts");
			rptSel.setAttribute("styler", "combobox");
			refreshReplacementForSelect(rptSel);
			rptTblC = filterWin.document.createElement("td");
			rptTblC.setAttribute("nowrap", "");
			rptTblC.style.whiteSpace = "nowrap";
			rptTblC.style.paddingLeft = "3px";
			rptTblC.appendChild(rptSel);			
			rptTblR.appendChild(rptTblC);
			try
			{
				if (filterWin.frameElement)
				{			
					var cBtn = filterWin.document.createElement("button");
					cBtn.setAttribute("name", "closeBtn");
					cBtn.setAttribute("id", "closeBtn");
					cBtn.setAttribute("type", "button"); 
					cBtn.className = "filterSearchButton";
					cBtn.style.float = "left";
					cBtn.style.marginLeft = "5px";
					cBtn.onclick = filterWin.doClose;
					cBtn.appendChild(filterWin.document.createTextNode(getSeaPhrase("CLOSE","ESS")));
					rptTblC = filterWin.document.createElement("td");
					rptTblC.style.paddingLeft = "3px";
					rptTblC.style.width = "100%";
					rptTblC.appendChild(cBtn);
					rptTblR.appendChild(rptTblC);
				}
			}
			catch(e) {}
			rptForm.appendChild(rptTbl);
			var rptDiv = filterWin.document.createElement("div");
			rptDiv.appendChild(rptForm);			
			filterBar.appendChild(rptDiv);			
			dmeFilter.addFilterField("employee", 9, getSeaPhrase("JOB_PROFILE_2","ESS"), false, true);
			dmeFilter.addFilterField("label-name-1", 30, getSeaPhrase("EMPLOYEE_NAME","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pathfind", 
				"ptfset2",
				"employee;label-name-1;last-name;hrsuper.code", 
				String(authUser.company)+"=18="+superObj.getCurrentSuper().codes, 
				"pos-level-1", 
				null, 
				dmeFilter.getNbrRecords(), 
				"1");		
		break;	
		case "step":
		case "grade":
			var sType = (dmeFilter.getFieldNm().toLowerCase() == "step") ? "S" : "G";
			dmeFilter.addFilterField("schedule", 9, getSeaPhrase("SCHEDULE","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prsaghead", 
				"sghset2",
				"schedule;description;indicator;effect-date", 
				String(authUser.company)+"="+sType, 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;			
		case "stepandgrade":
			var selectStr = null;
			var selectSched = "";
			if (selectedScheduleRec)
			{
				selectStr = "effect-date=" + formjsDate(formatDME(selectedScheduleRec.effect_date));
				selectSched = selectedScheduleRec.schedule;
				if (selectedScheduleRec.indicator == "S")
				{
					dmeFilter.addFilterField("pay-grade", 3, getSeaPhrase("GRADE","ESS"), true);
					dmeFilter.addFilterField("pay-step", 2, getSeaPhrase("STEP","ESS"), false, true);
				}
				else
					dmeFilter.addFilterField("pay-grade", 3, getSeaPhrase("GRADE","ESS"), true);
			}
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prsagdtl", 
				"sgdset3",
				"pay-step;pay-grade;pay-rate;effect-date", 
				String(authUser.company)+"="+escape(selectSched), 
				null, 
				selectStr, 
				dmeFilter.getNbrRecords(), 
				null);	
		break;				
		default: break;
	}
}
function performDmeFieldFilter(dmeFilter)
{
	switch (dmeFilter.getFieldNm().toLowerCase())
	{
		case "position":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"paposition", 
			"posset3", 
			"position;description;process-level;department", 
			String(authUser.company), 
			"active-current", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);	
		break;
		case "job":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"jobcode", 
			"jbcset1", 
			"job-code;description;", 
			String(authUser.company), 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);
		break;
		case "status":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes", 
			"pcoset1", 
			"code;description", 
			"RQ", 
			"web-supv-activ", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);			
		break;
		case "processlevel":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prsystem",
			"prsset1",
			"process-level;name;recruit-flag;currency-flag;currency-code;currency.description",
			String(authUser.company),
			"active-pl",
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);			
		break;	
		case "department":
		var keyValue;
		if (typeof(processLevelKey) != "undefined" && processLevelKey && NonSpace(processLevelKey) > 0)
			keyValue = String(authUser.company)+"="+processLevelKey;
		else
			keyValue = String(authUser.company);	
		filterDmeCall(dmeFilter,
			"jsreturn",
			"deptcode",
			"dptset1",
			"department;process-level;name",
			keyValue,
			"active",
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);			
		break;	
		case "location":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes", 
			"pcoset1", 
			"code;description", 
			"LO", 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);			
		break;	
		case "union":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes", 
			"pcoset1", 
			"code;description", 
			"UN", 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);			
		break;
		case "bargainunit":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes", 
			"pcoset1", 
			"code;description", 
			"BU", 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);			
		break;
		case "userlevel":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes", 
			"pcoset1", 
			"code;description", 
			"UL", 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);			
		break;	
		case "supervisor":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"hrsuper", 
			"hsuset1", 
			"code;description;employee;full-name", 
			String(authUser.company), 
			"active-code", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);			
		break;	
		case "employeestatus":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"emstatus", 
			"emsset1", 
			"emp-status;description", 
			String(authUser.company), 
			"active-emp", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;
		case "currency":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"cucodes", 
			"cucset1", 
			"currency-code;description", 
			"", 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;
		case "workschedule":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"hrwrkschd", 
			"wscset1", 
			"work-sched;effect-date;description", 
			String(authUser.company), 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;
		case "replacementfor":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pathfind", 
			"ptfset2",
			"employee;label-name-1;last-name;hrsuper.code", 
			String(authUser.company)+"=18="+superObj.getCurrentSuper().codes, 
			"pos-level-1",
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			"1");
		break;
		case "step":
		case "grade":
		var sType = (dmeFilter.getFieldNm().toLowerCase() == "step") ? "S" : "G";
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prsaghead", 
			"sghset2",
			"schedule;description;indicator;effect-date", 
			String(authUser.company)+"="+sType, 
			null,
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;	
		case "stepandgrade":
		var selectSched = "";
		if (selectedScheduleRec)
			selectSched = selectedScheduleRec.schedule;
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prsagdtl", 
			"sgdset3",
			"pay-step;pay-grade;pay-rate;effect-date", 
			String(authUser.company)+"="+escape(selectSched), 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);	
		break;						
		default: break;
	}
}
function dmeFieldRecordSelected(recIndex, fieldNm)
{
	var selRec = self.jsreturn.record[recIndex];
	var formElm;
	switch (fieldNm.toLowerCase())
	{
		case "position":
			PA42.Position.Description = selRec.description;
			PA42.Position.Code = selRec.position;
			formElm = self.left.document.newjobreqform.position;
			self.left.document.newjobreqform.position.value = selRec.description;
			self.left.document.newjobreqform.positioncode.value = selRec.position;
			break;	
		case "job":
			PA42.JobCode.Description = selRec.description;
			PA42.JobCode.Code = selRec.job_code;
			formElm = self.left.document.newjobreqform.job;
			self.left.document.newjobreqform.job.value = selRec.description;
			self.left.document.newjobreqform.jobcode.value = selRec.job_code;			
			break;
		case "status":
			PA42.ReqStatus.Description = selRec.description;
			PA42.ReqStatus.Code = selRec.code;
			formElm = self.left.document.newjobreqform.status;
			self.left.document.newjobreqform.status.value = selRec.description;
			self.left.document.newjobreqform.statuscode.value = selRec.code;			
			break;	
		case "processlevel":
			PA42.ProcessLevel.Description = selRec.name;
			PA42.ProcessLevel.Code = selRec.process_level;
			PA42.RecruitingFlag = selRec.recruit_flag;
			formElm = self.right.document.newjobreqdtlform.processlevel;
			self.right.document.newjobreqdtlform.processlevel.value = selRec.name;
			self.right.document.newjobreqdtlform.processlevelcode.value = selRec.process_level;
			self.right.document.newjobreqdtlform.plrecruitflag.value = selRec.recruit_flag;
			break;	
		case "department":
			PA42.Department.Description = selRec.name;
			PA42.Department.Code = selRec.department;
			formElm = self.right.document.newjobreqdtlform.department;
			self.right.document.newjobreqdtlform.department.value = selRec.name;
			self.right.document.newjobreqdtlform.departmentcode.value = selRec.department;
			break;
		case "location":
			PA42.Location.Description = selRec.description;
			PA42.Location.Code = selRec.code;
			formElm = self.right.document.newjobreqdtlform.location;
			self.right.document.newjobreqdtlform.location.value = selRec.description;
			self.right.document.newjobreqdtlform.locationcode.value = selRec.code;			
			break;	
		case "union":
			PA42.Union.Description = selRec.description;
			PA42.Union.Code = selRec.code;	
			formElm = self.right.document.newjobreqdtlform.union;
			self.right.document.newjobreqdtlform.union.value = selRec.description;
			self.right.document.newjobreqdtlform.unioncode.value = selRec.code;			
			break;	
		case "bargainunit":
			PA42.BargainUnit.Description = selRec.description;
			PA42.BargainUnit.Code = selRec.code;
			formElm = self.right.document.newjobreqdtlform.bargainunit;
			self.right.document.newjobreqdtlform.bargainunit.value = selRec.description;
			self.right.document.newjobreqdtlform.bargainunitcode.value = selRec.code;			
			break;	
		case "userlevel":
			PA42.UserLevel.Description = selRec.description;
			PA42.UserLevel.Code = selRec.code;
			formElm = self.right.document.newjobreqdtlform.userlevel;
			self.right.document.newjobreqdtlform.userlevel.value = selRec.description;
			self.right.document.newjobreqdtlform.userlevelcode.value = selRec.code;			
			break;
		case "supervisor":
			PA42.Supervisor.Description = selRec.description;
			PA42.Supervisor.Code = selRec.code;
			formElm = self.right.document.newjobreqdtlform.supervisor;
			self.right.document.newjobreqdtlform.supervisor.value = selRec.description;
			self.right.document.newjobreqdtlform.supervisorcode.value = selRec.code;			
			break;
		case "employeestatus":
			PA42.EmployeeStatus.Description = selRec.description;
			PA42.EmployeeStatus.Code = selRec.emp_status;
			formElm = self.right.document.newjobreqdtlform.employeestatus;
			self.right.document.newjobreqdtlform.employeestatus.value = selRec.description;
			self.right.document.newjobreqdtlform.employeestatuscode.value = selRec.emp_status;			
			break;
		case "currency":
			PA42.Currency.Description = selRec.description;
			PA42.Currency.Code = selRec.currency_code;
			formElm = self.right.document.newjobreqdtlform.currency;
			self.right.document.newjobreqdtlform.currency.value = selRec.description;
			self.right.document.newjobreqdtlform.currencycode.value = selRec.currency_code;			
			break;
		case "workschedule":
			PA42.WorkSchedule.Description = selRec.description;
			PA42.WorkSchedule.Code = selRec.work_sched;
			formElm = self.right.document.newjobreqdtlform.workschedule;
			self.right.document.newjobreqdtlform.workschedule.value = selRec.description;
			self.right.document.newjobreqdtlform.workschedulecode.value = selRec.work_sched;			
			break;
		case "replacementfor":
			PA42.ReplacementEmployee.Description = selRec.label_name_1;
			PA42.ReplacementEmployee.Code = selRec.employee;
			formElm = self.right.document.newjobreqdtlform.replacementfor;
			self.right.document.newjobreqdtlform.replacementfor.value = selRec.label_name_1;
			self.right.document.newjobreqdtlform.replacementforcode.value = Number(selRec.employee);			
			break;
		case "step":
		case "grade":
			selectedScheduleRec = selRec;
			openDmeFieldFilter("stepandgrade");
			break;
		case "stepandgrade":
			PA42.Step = (selectedScheduleRec.indicator == "S") ? selRec.pay_step : " ";
			PA42.Grade = selRec.pay_grade;
			formElm = self.right.document.newjobreqdtlform.paystepcode;
			self.right.document.newjobreqdtlform.paystepcode.value = PA42.Step;	
			self.right.document.newjobreqdtlform.paygradecode.value = PA42.Grade;
			PA42.Schedule.Code = selectedScheduleRec.schedule;
			PA42.Schedule.Description = selectedScheduleRec.description;
			self.right.document.newjobreqdtlform.payschedulecode.value = selectedScheduleRec.schedule;
			self.right.document.newjobreqdtlform.payschedule.value = selectedScheduleRec.description;
			self.right.document.newjobreqdtlform.salarybeg.value = selRec.pay_rate;
			self.right.document.getElementById("paygrade").innerHTML = String(PA42.Grade);
			self.right.document.getElementById("paystep").innerHTML = String(PA42.Step);			
			break;								
		default: break;
	}
	try { filterWin.close(); } catch(e) {}
	try { formElm.focus(); } catch(e) {}
}
function getDmeFieldElement(fieldNm)
{
	var fld = [null, null, null];
	try
	{
		switch (fieldNm.toLowerCase())
		{
			case "position":
				fld = [self.left, self.left.document.newjobreqform.position, getSeaPhrase("JOB_PROFILE_8","ESS")];
				break;	
			case "job":
				fld = [self.left, self.left.document.newjobreqform.job, getSeaPhrase("JOB_OPENINGS_6","ESS")];			
				break;
			case "status":
				fld = [self.left, self.left.document.newjobreqform.status, getSeaPhrase("STATUS","ESS")];			
				break;	
			case "processlevel":
				fld = [self.right, self.right.document.newjobreqdtlform.processlevel, getSeaPhrase("PROCESS_LEVEL_CODE","ESS")];
				break;	
			case "department":
				fld = [self.right, self.right.document.newjobreqdtlform.department, getSeaPhrase("DEPARTMENT_CODE","ESS")];
				break;
			case "location":
				fld = [self.right, self.right.document.newjobreqdtlform.location, getSeaPhrase("JOB_PROFILE_6","ESS")];			
				break;	
			case "union":
				fld = [self.right, self.right.document.newjobreqdtlform.union, getSeaPhrase("JOB_PROFILE_10","ESS")];			
				break;	
			case "bargainunit":
				fld = [self.right, self.right.document.newjobreqdtlform.bargainunit, getSeaPhrase("BARGAINING_UNIT","ESS")];			
				break;	
			case "userlevel":
				fld = [self.right, self.right.document.newjobreqdtlform.userlevel, getSeaPhrase("USER_LEVEL","ESS")];			
				break;
			case "supervisor":
				fld = [self.right, self.right.document.newjobreqdtlform.supervisor, getSeaPhrase("JOB_PROFILE_7","ESS")];			
				break;
			case "employeestatus":
				fld = [self.right, self.right.document.newjobreqdtlform.employeestatus, getSeaPhrase("EMPLOYEE_STATUS","ESS")];			
				break;
			case "currency":
				fld = [self.right, self.right.document.newjobreqdtlform.currency, getSeaPhrase("QUAL_16","ESS")];			
				break;
			case "workschedule":
				fld = [self.right, self.right.document.newjobreqdtlform.workschedule, getSeaPhrase("WORK_SCHEDULE","ESS")];			
				break;
			case "replacementfor":
				fld = [self.right, self.right.document.newjobreqdtlform.replacementfor, getSeaPhrase("EMPLOYEE","ESS")];			
				break;
			case "payschedule":
				fld = [self.right, self.right.document.newjobreqdtlform.payschedule, getSeaPhrase("SCHEDULE_TYPE","ESS")];			
				break;										
			default:
				break;
		}
	}
	catch(e) {}
	return fld;
}
function getValueListFieldElement(fieldNm)
{
	var fld = [null, null, null];
	switch (fieldNm.toLowerCase())
	{
		case "payschedule":
			fld = [self.right, self.right.document.newjobreqdtlform.payschedule, getSeaPhrase("SCHEDULE_TYPE","ESS")];			
			break;										
		default: break;
	}
	return fld;
}
function dmeFieldKeyUpHandler(fieldNm)
{
	switch (fieldNm.toLowerCase())
	{
		case "position":
			PA42.Position.Description = "";
			PA42.Position.Code = "";
			self.left.document.newjobreqform.position.value = "";
			self.left.document.newjobreqform.positioncode.value = "";
			break;	
		case "job":
			PA42.JobCode.Description = "";
			PA42.JobCode.Code = "";
			self.left.document.newjobreqform.job.value = "";
			self.left.document.newjobreqform.jobcode.value = "";			
			break;
		case "status":
			PA42.ReqStatus.Description = "";
			PA42.ReqStatus.Code = "";
			self.left.document.newjobreqform.status.value = "";
			self.left.document.newjobreqform.statuscode.value = "";			
			break;	
		case "processlevel":
			PA42.ProcessLevel.Description = "";
			PA42.ProcessLevel.Code = "";
			self.right.document.newjobreqdtlform.processlevel.value = "";
			self.right.document.newjobreqdtlform.processlevelcode.value = "";
			break;	
		case "department":
			PA42.Department.Description = selRec.name;
			PA42.Department.Code = selRec.department;
			self.right.document.newjobreqdtlform.department.value = selRec.name;
			self.right.document.newjobreqdtlform.departmentcode.value = selRec.department;
			break;
		case "location":
			PA42.Location.Description = "";
			PA42.Location.Code = "";
			self.right.document.newjobreqdtlform.location.value = "";
			self.right.document.newjobreqdtlform.locationcode.value = "";			
			break;	
		case "union":
			PA42.Union.Description = "";
			PA42.Union.Code = "";	
			self.right.document.newjobreqdtlform.union.value = "";
			self.right.document.newjobreqdtlform.unioncode.value = "";			
			break;	
		case "bargainunit":
			PA42.BargainUnit.Description = "";
			PA42.BargainUnit.Code = "";
			self.right.document.newjobreqdtlform.bargainunit.value = "";
			self.right.document.newjobreqdtlform.bargainunitcode.value = "";			
			break;	
		case "userlevel":
			PA42.UserLevel.Description = "";
			PA42.UserLevel.Code = "";
			self.right.document.newjobreqdtlform.userlevel.value = "";
			self.right.document.newjobreqdtlform.userlevelcode.value = "";			
			break;
		case "supervisor":
			PA42.Supervisor.Description = "";
			PA42.Supervisor.Code = "";
			self.right.document.newjobreqdtlform.supervisor.value = "";
			self.right.document.newjobreqdtlform.supervisorcode.value = "";			
			break;
		case "employeestatus":
			PA42.EmployeeStatus.Description = "";
			PA42.EmployeeStatus.Code = "";
			self.right.document.newjobreqdtlform.employeestatus.value = "";
			self.right.document.newjobreqdtlform.employeestatuscode.value = "";			
			break;
		case "currency":
			PA42.Currency.Description = "";
			PA42.Currency.Code = ""
			self.right.document.newjobreqdtlform.currency.value = "";
			self.right.document.newjobreqdtlform.currencycode.value = "";			
			break;
		case "workschedule":
			PA42.WorkSchedule.Description = "";
			PA42.WorkSchedule.Code = "";
			self.right.document.newjobreqdtlform.workschedule.value = "";
			self.right.document.newjobreqdtlform.workschedulecode.value = "";			
			break;
		case "replacementfor":
			PA42.ReplacementEmployee.Description = "";
			PA42.ReplacementEmployee.Code = "";
			self.right.document.newjobreqdtlform.replacementfor.value = "";
			self.right.document.newjobreqdtlform.replacementforcode.value = "";			
			break;
		case "payschedule":
			PA42.Schedule.Description = "";
			PA42.Schedule.Code = "";
			self.right.document.getElementById("paygrade").innerHTML = "";
			self.right.document.getElementById("paystep").innerHTML = "";
			self.right.document.newjobreqdtlform.payschedulecode.value = "";
			self.right.document.newjobreqdtlform.paygradecode.value = "";
			self.right.document.newjobreqdtlform.paystepcode.value = "";
			break;								
		default: break;
	}	
}
function drawDmeFieldFilterContent(dmeFilter)
{
	var selectHtml = new Array();
	var dmeRecs = self.jsreturn.record;
	var nbrDmeRecs = dmeRecs.length;
	var fieldNm = dmeFilter.getFieldNm().toLowerCase();
	var fldObj = getDmeFieldElement(fieldNm);
	var fldDesc = fldObj[2];	
	switch (fieldNm)
	{
		case "position":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:25%">'+getSeaPhrase("PROCESS_LEVEL_CODE","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:25%">'+getSeaPhrase("DEPARTMENT_CODE","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:25%">'+getSeaPhrase("JOB_PROFILE_8","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:25%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.process_level) ? tmpObj.process_level : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.department) ? tmpObj.department : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.position) ? tmpObj.position : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="4" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "job":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_6","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.job_code) ? tmpObj.job_code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;	
		case "status":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("STATUS","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.code) ? tmpObj.code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "processlevel":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("PROCESS_LEVEL_CODE","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.process_level) ? tmpObj.process_level : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.name) ? tmpObj.name : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "department":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:33%">'+getSeaPhrase("DEPARTMENT_CODE","ESS")+'</th>'	
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("PROCESS_LEVEL_CODE","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.department) ? tmpObj.department : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.process_level) ? tmpObj.process_level : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.name) ? tmpObj.name : '&nbsp;'
				selectHtml[i+1] += '</td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="3" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "location":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("JOB_PROFILE_6","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.code) ? tmpObj.code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "union":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("JOB_PROFILE_10","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.code) ? tmpObj.code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "bargainunit":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("BARGAINING_UNIT","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.code) ? tmpObj.code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "userlevel":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("USER_LEVEL","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.code) ? tmpObj.code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "supervisor":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:33%">'+getSeaPhrase("JOB_PROFILE_7","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("EMPLOYEE_NAME","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.code) ? tmpObj.code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (Number(tmpObj.employee) != 0) ? tmpObj.full_name : getSeaPhrase("POSITION_NOT_FILLED","ESS")				
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="3" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "employeestatus":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("EMPLOYEE_STATUS","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.emp_status) ? tmpObj.emp_status : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;	
		case "currency":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("QUAL_16","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.currency_code) ? tmpObj.currency_code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "workschedule":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:33%">'+getSeaPhrase("WORK_SCHEDULE","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("HOME_ADDR_1","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.work_sched) ? tmpObj.work_sched : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.effect_date) ? tmpObj.effect_date : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="3" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "replacementfor":
			var filterWin = dmeFilter.getWindow();
			var selObj = filterWin.document.getElementById("filterRpts");
			var optObj;
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("JOB_PROFILE_2","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("EMPLOYEE_NAME","ESS")+'</th></tr>'
			var refreshSelect = false;
			for (var i=0; i<nbrDmeRecs; i++) 
			{			
				tmpObj = dmeRecs[i];
				// add supervisor to the dropdown
				if (tmpObj.hrsuper_code && superObj.addSuper(tmpObj.employee, tmpObj.label_name_1, tmpObj.last_name, null))
					refreshSelect = true;
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.employee) ? tmpObj.employee : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.label_name_1) ? tmpObj.label_name_1 : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (refreshSelect)
				refreshReplacementForSelect(selObj);
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;	
		case "step":
		case "grade":
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("SCHEDULE","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{			
				tmpObj = dmeRecs[i];
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.schedule) ? tmpObj.schedule : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;	
		case "stepandgrade":
			if (selectedScheduleRec.indicator == "S") 
			{
				selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
				selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
				selectHtml[0] += '<tr><th scope="col" style="width:33%">'+getSeaPhrase("GRADE","ESS")+'</th>'
				selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("STEP","ESS")+'</th>'
				selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("PAY_RATE_2","ESS")+'</th></tr>'
				for (var i=0; i<nbrDmeRecs; i++) 
				{			
					tmpObj = dmeRecs[i];
					selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
					selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
					selectHtml[i+1] += (tmpObj.pay_grade) ? tmpObj.pay_grade : '&nbsp;'
					selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
					selectHtml[i+1] += (tmpObj.pay_step) ? tmpObj.pay_step : '&nbsp;'
					selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
					selectHtml[i+1] += (tmpObj.pay_rate) ? tmpObj.pay_rate : '&nbsp;'					
					selectHtml[i+1] += '</a></td></tr>'
				}
			}
			else
			{
				selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
				selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
				selectHtml[0] += '<tr><th scope="col" style="width:33%">'+getSeaPhrase("GRADE","ESS")+'</th>'
				selectHtml[0] += '<th scope="col" style="width:33%">&nbsp;</th>'
				selectHtml[0] += '<th scope="col" style="width:33%">&nbsp;</th></tr>'
				for (var i=0; i<nbrDmeRecs; i++) 
				{			
					tmpObj = dmeRecs[i];
					selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
					selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
					selectHtml[i+1] += (tmpObj.pay_grade) ? tmpObj.pay_grade : '&nbsp;'
					selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
					if (i%3 == 0)
						selectHtml[i+1] += getSeaPhrase("MIN","ESS")					
					else if (i%3 == 1)
						selectHtml[i+1] += getSeaPhrase("MID","ESS")
					else if (i%3 == 2)
						selectHtml[i+1] += getSeaPhrase("MAX","ESS")					
					else
						selectHtml[i+1] += '&nbsp;'
					selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
					selectHtml[i+1] += (tmpObj.pay_rate) ? tmpObj.pay_rate : '&nbsp;'					
					selectHtml[i+1] += '</a></td></tr>'
				}			
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;				
	}	
	dmeFilter.getRecordElement().innerHTML = selectHtml.join("");	
}
function drawValueListContent(dmeFilter)
{
	var selectHtml = new Array();
	var fieldNm = dmeFilter.getFieldNm().toLowerCase();
	var fldObj = getDmeFieldElement(fieldNm);
	var fldDesc = fldObj[2];	
	switch (fieldNm)
	{
		case "payschedule": // payschedule		
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:100%">'+getSeaPhrase("SCHEDULE_TYPE","ESS")+'</th></tr>'
			selectHtml[1] = '<tr onclick="valueListFieldRecordSelected(event,0,\''+fieldNm+'\');return false" class="filterTableRow">'
			selectHtml[1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="valueListFieldRecordSelected(event,0,\''+fieldNm+'\');return false">'+getSeaPhrase("STEP_GRADE_SCHEDULE","ESS")+'</a></td></tr>'
			selectHtml[2] = '<tr onclick="valueListFieldRecordSelected(event,1,\''+fieldNm+'\');return false" class="filterTableRow">'
			selectHtml[2] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="valueListFieldRecordSelected(event,1,\''+fieldNm+'\');return false">'+getSeaPhrase("GRADE_RANGE_SCHEDULE","ESS")+'</a></td></tr>'
			selectHtml[3] = '</table>'			
			break;
		default: break;
	}
	dmeFilter.getRecordElement().innerHTML = selectHtml.join("");
}
function valueListFieldRecordSelected(recIndex, fieldNm)
{
	switch (fieldNm.toLowerCase())
	{
		case "payschedule": // payschedule
			if (recIndex == 0)
				openDmeFieldFilter("step");
			else
				openDmeFieldFilter("grade");		
			break;	
		default: 
		try { filterWin.close(); } catch(e) {}		
		break;
	}
}
/* Filter Select logic - end */
function GetProcessLevel()
{
	if (!Selects.gotProcessLevel && !Selects.ProcessLevel.length) 
	{
		showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"));
		DMECall("PRSYSTEM","PRSSET1","process-level;name;recruit-flag;currency-flag;currency-code;currency.description",String(authUser.company),"active-pl","name","","ProcessLevel");
		Selects.gotProcessLevel = true;	
	}
}
function GetDepartment()
{
	var dtlForm = self.right.document.newjobreqdtlform;
	if ((!emssObjInstance.emssObj.filterSelect && (dtlForm.processlevel.selectedIndex > 0) && (processLevelKey != dtlForm.processlevel.options[dtlForm.processlevel.selectedIndex].value))
	|| (emssObjInstance.emssObj.filterSelect && (NonSpace(dtlForm.processlevelcode.value) > 0) && (processLevelKey != dtlForm.processlevelcode.value))) 
	{
		Selects.gotDepartment = false;
		Selects.Department = new Array();
	}
	if (!Selects.gotDepartment && !Selects.Department.length) 
	{
		showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"));
		processLevelKey = PA42.ProcessLevel.Code;	
		var keyValue;	
		if (!emssObjInstance.emssObj.filterSelect && (dtlForm.processlevel.selectedIndex > 0))
			processLevelKey = dtlForm.processlevel.options[dtlForm.processlevel.selectedIndex].value;
		else if (emssObjInstance.emssObj.filterSelect && (NonSpace(dtlForm.processlevelcode.value) > 0))
			processLevelKey = dtlForm.processlevelcode.value;
		if (typeof(processLevelKey) != "undefined" && processLevelKey && NonSpace(processLevelKey) > 0)
			keyValue = String(authUser.company)+"="+processLevelKey;
		else
			keyValue = String(authUser.company);
		DMECall("DEPTCODE","DPTSET1","process-level;department;name",keyValue,"active","","","Department");		
		Selects.gotDepartment = true;
	}
}
function GetSupervisor()
{
	if (!Selects.gotSupervisor && !Selects.Supervisor.length) 
	{
		showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"));
		DMECall("HRSUPER","HSUSET1","code;description;full-name",String(authUser.company),"active-code","description","","Supervisor");				
		Selects.gotSupervisor = true;	
	}
}
function GetEmployeeStatus()
{
	if (!Selects.gotEmployeeStatus && !Selects.EmployeeStatus.length) 
	{
		showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"));			
		DMECall("EMSTATUS","EMSSET1","emp-status;description",String(authUser.company),"active-emp","","","EmployeeStatus");					
		Selects.gotEmployeeStatus = true;	
	}
}
function GetCurrency()
{
	if (!Selects.gotCurrency && !Selects.Currency.length) 
	{
		showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"));			
		DMECall("CUCODES","CUCSET1","currency-code;description","","","","","Currency");					
		Selects.gotCurrency = true;	
	}
}
function GetWorkSchedule()
{
	if (!Selects.gotWorkSchedule && !Selects.WorkSchedule.length) 
	{
		DMECall("HRWRKSCHD","WSCSET1","work-sched;effect-date;description",String(authUser.company),"","","","WorkSchedule");
		Selects.gotWorkSchedule = true;        
	}
}
function BuildJobSelect(code)
{
	var selectHtml = new Array();
	var tmpObj;
	selectHtml[0] = '<option value=" ">'
	for (var i=0; i<Selects.JobCode.length; i++)
	{
		tmpObj = Selects.JobCode[i];	
		selectHtml[i+1] = '<option value="'+tmpObj.job_code+'"';
		selectHtml[i+1] += (code == tmpObj.job_code)?' selected>':'>';
		selectHtml[i+1] += tmpObj.description;
	}
	return selectHtml.join("");
}
function SetJobCode(jobCode, jobForm)
{
	if (emssObjInstance.emssObj.filterSelect) 
	{
		jobForm.jobcode.value = jobCode.Code;
		jobForm.job.value = jobCode.Description;
	} 
	else 
	{
		var selectOpts = jobForm.job.options;
		for (var i=0; i<selectOpts.length; i++)
		{
			if (jobCode.Code == selectOpts[i].value)
			{
				jobForm.job.selectedIndex = i;
				break;
			}
		}
	}	
}
function BuildStatusSelect(code)
{
	var selectHtml = new Array();
	var tmpObj;
	selectHtml[0] = '<option value=" ">'
	for (var i=0; i<Selects.ReqStatus.length; i++)
	{
		tmpObj = Selects.ReqStatus[i];
		if (Number(tmpObj.web_avail_supv) == 2)
		{
			selectHtml[i+1] = '<option value="'+tmpObj.code+'"';
			selectHtml[i+1] += (code == tmpObj.code)?' selected>':'>';
			selectHtml[i+1] += tmpObj.description;
		}
	}
	return selectHtml.join("");
}
function BuildProcessLevelSelect(code,desc)
{
	var selectHtml = new Array();
	var tmpObj;
	selectHtml[0] = '<option value=" ">'
	for (var i=0; i<Selects.ProcessLevel.length; i++)
	{
		tmpObj = Selects.ProcessLevel[i];	
		selectHtml[i+1] = '<option value="'+tmpObj.process_level+'"';
		selectHtml[i+1] += (code == tmpObj.process_level)?' selected>':'>';
		selectHtml[i+1] += tmpObj.name;
	}
	if (code != "" && Selects.ProcessLevel.length == 0) {
		selectHtml[1] = '<option value="'+code+'" selected>';
		selectHtml[1] += String(desc);
	}
	return selectHtml.join("");
}
function BuildDepartmentSelect(code,desc)
{
	var selectHtml = new Array();
	var tmpObj;
	selectHtml[0] = '<option value=" ">'
	for (var i=0; i<Selects.Department.length; i++)
	{
		tmpObj = Selects.Department[i];	
		selectHtml[i+1] = '<option value="'+tmpObj.department+'"';
		selectHtml[i+1] += (code == tmpObj.department)?' selected>':'>';
		selectHtml[i+1] += tmpObj.name;
	}
	if (code != "" && Selects.Department.length == 0) {
		selectHtml[1] = '<option value="'+code+'" selected>';
		selectHtml[1] += String(desc);
	}	
	return selectHtml.join("");
}
function BuildLocationSelect(code)
{
	var selectHtml = new Array();
	var tmpObj;
	selectHtml[0] = '<option value=" ">'
	for (var i=0; i<Selects.Location.length; i++)
	{
		tmpObj = Selects.Location[i];	
		selectHtml[i+1] = '<option value="'+tmpObj.code+'"';
		selectHtml[i+1] += (code == tmpObj.code)?' selected>':'>';
		selectHtml[i+1] += tmpObj.description;
	}
	return selectHtml.join("");
}
function BuildSupervisorSelect(code,desc)
{
	var selectHtml = new Array();
	var tmpObj;
	selectHtml[0] = '<option value=" ">'
	for (var i=0; i<Selects.Supervisor.length; i++)
	{
		tmpObj = Selects.Supervisor[i];	
        selectHtml[i+1] = '<option value="'+tmpObj.code+'"';
		selectHtml[i+1] += (code == tmpObj.code)?' selected>':'>';
		selectHtml[i+1] += tmpObj.description;
	}
	if (code != "" && Selects.Supervisor.length == 0) {
		selectHtml[1] = '<option value="'+code+'" selected>';
		selectHtml[1] += String(desc);
	}	
	return selectHtml.join("");
}
function BuildUnionSelect(code)
{
	var selectHtml = new Array();
	var tmpObj;
	selectHtml[0] = '<option value=" ">'
	for (var i=0; i<Selects.Union.length; i++)
	{
		tmpObj = Selects.Union[i];	
        selectHtml[i+1] = '<option value="'+tmpObj.code+'"';
		selectHtml[i+1] += (code == tmpObj.code)?' selected>':'>';
		selectHtml[i+1] += tmpObj.description;
	}
	return selectHtml.join("");
}
function BuildBargainUnitSelect(code)
{
	var selectHtml = new Array();
	var tmpObj;
	selectHtml[0] = '<option value=" ">'
	for (var i=0; i<Selects.BargainUnit.length; i++)
	{
		tmpObj = Selects.BargainUnit[i];	
        selectHtml[i+1] = '<option value="'+tmpObj.code+'"';
		selectHtml[i+1] += (code == tmpObj.code)?' selected>':'>';
		selectHtml[i+1] += tmpObj.description;
	}
	return selectHtml.join("");
}
function BuildUserLevelSelect(code)
{
	var selectHtml = new Array();
	var tmpObj;
	selectHtml[0] = '<option value=" ">'
	for (var i=0; i<Selects.UserLevel.length; i++)
	{
		tmpObj = Selects.UserLevel[i];	
        selectHtml[i+1] = '<option value="'+tmpObj.code+'"';
		selectHtml[i+1] += (code == tmpObj.code)?' selected>':'>';
		selectHtml[i+1] += tmpObj.description;
	}
	return selectHtml.join("");
}
function BuildEmpStatusSelect(code,desc)
{
	var selectHtml = new Array();
	var tmpObj;
	selectHtml[0] = '<option value=" ">'
	for (var i=0; i<Selects.EmployeeStatus.length; i++)
	{
		tmpObj = Selects.EmployeeStatus[i];	
        selectHtml[i+1] = '<option value="'+tmpObj.emp_status+'"';
		selectHtml[i+1] += (code == tmpObj.emp_status)?' selected>':'>';
		selectHtml[i+1] += tmpObj.description;
	}
	if (code != "" && Selects.EmployeeStatus.length == 0) {
		selectHtml[1] = '<option value="'+code+'" selected>';
		selectHtml[1] += String(desc);
	}	
	return selectHtml.join("");
}
function BuildSalaryTypeSelect(value)
{
	var selectStr = '<option value=" ">'
	selectStr += '<option value="S"'
	selectStr += (value == "S")? 'selected>':'>';
	selectStr += getSeaPhrase("SALARIED","ESS")
	selectStr += '<option value="H" '
	selectStr += (value == "H")? 'selected>':'>';
	selectStr += getSeaPhrase("HOURLY","ESS")
	return selectStr;
}

function BuildYesNoSelect(value)
{
	var selectStr = '<option value="N" '
	selectStr += (value == "N")? 'selected>':'>';
	selectStr += getSeaPhrase("NO","ESS")
	selectStr += '<option value="Y" '
	selectStr += (value == "Y")? 'selected>':'>';
	selectStr += getSeaPhrase("YES","ESS")
	return selectStr;
}
function BuildCurrencySelect(code,desc)
{
	var selectHtml = new Array();
	var tmpObj;
	selectHtml[0] = '<option value=" ">'
	for (var i=0; i<Selects.Currency.length; i++)
	{
		tmpObj = Selects.Currency[i];	
        selectHtml[i+1] = '<option value="'+tmpObj.currency_code+'"';
		selectHtml[i+1] += (code == tmpObj.currency_code)?' selected>':'>';
		selectHtml[i+1] += tmpObj.description;
	}
	if (code != "" && Selects.Currency.length == 0) {
		selectHtml[1] = '<option value="'+code+'" selected>';
		selectHtml[1] += String(desc);
	}	
	return selectHtml.join("");
}
function BuildWorkScheduleSelect(code, desc)
{
	var selectHtml = new Array();
	var tmpObj;
	selectHtml[0] = '<option value=" ">'
	for (var i=0; i<Selects.WorkSchedule.length; i++)
	{
		tmpObj = Selects.WorkSchedule[i];	
        selectHtml[i+1] = '<option value="'+tmpObj.work_sched+'"';
		selectHtml[i+1] += (code == tmpObj.work_sched)?' selected>':'>';
		selectHtml[i+1] += tmpObj.description;
	}
	if (code != "" && Selects.WorkSchedule.length == 0) {
		selectHtml[1] = '<option value="'+code+'" selected>';
		selectHtml[1] += String(desc);
	}
	return selectHtml.join("");
}
function BuildShiftSelect(value)
{
	var selectStr = '<option value=" ">';
	for (var i=1; i<=9; i++) {
		selectStr += '<option value="'+i+'"';
		selectStr += (value == String(i))? 'selected>':'>';
		selectStr += getSeaPhrase(String(i),"ESS");
	}
	return selectStr;
}
