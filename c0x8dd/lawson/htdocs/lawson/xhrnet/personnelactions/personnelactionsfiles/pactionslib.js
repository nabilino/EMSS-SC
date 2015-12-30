// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/personnelactions/personnelactionsfiles/Attic/pactionslib.js,v 1.1.2.46.2.1 2014/03/14 19:26:18 brentd Exp $
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
/*
 *	Common Functions
 */
var Data;
var	FC = '';
var ValuesNew;

function PADataObject(Field, CurrentValue, ChangeText, SelectValue, SelectBoxName, FldNbr, Options, gstring)
{
	this.Field = Field;
	this.CurrentValue = CurrentValue;
	this.ChangeText = ChangeText;
	this.SelectValue = SelectValue;
	this.SelectBoxName = SelectBoxName;
	this.FldNbr = FldNbr;
	this.Options = Options;
	this.gstring = gstring;
}

function InitializeLawheader()
{
	var Length = 36;
	self.lawheader.Items = new Array(Length);
	self.lawheader.Fields = new Array(Length);
	self.lawheader.ValuesNew = new Array(Length);
	self.lawheader.ValuesPre = new Array(Length);
	self.lawheader.Xmit = new Array()
	self.lawheader.HiddenKeys = "";
	self.lawheader.OrigCompany = "";
	self.lawheader.OrigEmployee = "";
	self.lawheader.OrigActionCode = "";
	self.lawheader.OrigEffectDate = "";	
}

function GetPersactypeForSecondWindow()
{
	TaxLocatorVariable = false;
	FC = '';
	Initialize_DateRoutines();
	InitializeLawheader();
	self.lawheader.UpdateType = "PA52.1";
	var pAGSObj = new AGSObject(authUser.prodline, "PA52.1");
	pAGSObj.event = "ADD";
	pAGSObj.rtn = "DATA";
	pAGSObj.longNames = true;
	pAGSObj.lfn = "ALL";
	pAGSObj.tds = false;
	pAGSObj.field = "FC=I"
	+ "&PCT-COMPANY=" + escape(authUser.company)
	+ "&PCT-ACTION-CODE=" + escape(Rules[_RULESINDEX].ActionCode.toString().toUpperCase())
	+ "&PCT-EMPLOYEE=" + escape(DirectReports[_DRINDEX].Code)
	+ "&PCT-EFFECT-DATE=" + escape(formjsDate(formatDME(Rules[_RULESINDEX].EffectiveDate)))
	+ "&IMMEDIATE-ACTION=" + escape(Rules[_RULESINDEX].WebImmediate);
	pAGSObj.func = "parent.GenerateArray()";
	pAGSObj.debug = false;
	AGS(pAGSObj,"jsreturn");
}

function GenerateArray()
{
	Data = new Array();
	ValuesNew = self.lawheader.ValuesNew;
	var objLaw = self.lawheader;
	for (var n=0; n<objLaw.Items.length; n++)
	{
		if (objLaw.Items[n])
		{
			Data[Data.length] = new PADataObject(objLaw.Items[n],
				(!objLaw.ValuesPre[n]) ? "" : objLaw.ValuesPre[n],
				(!objLaw.ValuesNew[n]) ? "" : objLaw.ValuesNew[n],
				'',
				"select"+n,
				parseInt(objLaw.Fields[n],10),
				null,
				objLaw.Items[n].split('\ ').join(''));	
			if (!Rules[_RULESINDEX].AddressChange || !Rules[_RULESINDEX].SuppAddrChange)
				CheckForAddressChange(parseInt(objLaw.Fields[n],10));
		}
	}
	GetEmailAddress();
}

// Check if an address field is being changed.  If so, we will need to send an email following an update.
function CheckForAddressChange(fldNbr)
{
	// EMP-ADDR1, EMP-ADDR2, EMP-ADDR3, EMP-ADDR4, EMP-CITY, EMP-STATE, EMP-ZIP, EMP-COUNTY, EMP-COUNTRY-CODE
	if (fldNbr == 5 || fldNbr == 6 || fldNbr == 157 || fldNbr == 158 || fldNbr == 7 || fldNbr == 8 || fldNbr == 9 || fldNbr == 568 || fldNbr == 10)
	{
		Rules[_RULESINDEX].AddressChange = true;
	}
	// EMP-SUPP-ADDR1, EMP-SUPP-ADDR2, EMP-SUPP-ADDR3, EMP-SUPP-ADDR4, EMP-SUPP-CITY, EMP-SUPP-STATE, EMP-SUPP-ZIP, EMP-SUPP-COUNTRY-CODE
	if (fldNbr == 39 || fldNbr == 40 || fldNbr == 148 || fldNbr == 149 || fldNbr == 41 || fldNbr == 42 || fldNbr == 43 || fldNbr == 44)
	{
		Rules[_RULESINDEX].AddressChange = true;
		Rules[_RULESINDEX].SuppAddrChange = true;
	}
}

function GetEmailAddress()
{
	var syr_company = authUser.company.toString();
	for (var i=syr_company.length; i<4; i++)
		syr_company = "0" + syr_company;
	var pDMEObj = new DMEObject(authUser.prodline, "SYSRULES");
	pDMEObj.out = "JAVASCRIPT";
	pDMEObj.field = "email-address;alphadata2";
	pDMEObj.key = "EMAILNOTIFICATION=HR="+syr_company+"="+escape(" ",1)+"=1=N=N";
	pDMEObj.max = "1";
	pDMEObj.debug = false;
	pDMEObj.func = "FinishdedGettingEmailAddress()";
	DME(pDMEObj,"jsreturn");
}

function FinishdedGettingEmailAddress()
{
	if (self.jsreturn.NbrRecs)
	{
		Rules[_RULESINDEX].EmailAddress = self.jsreturn.record[0].email_address;
		Rules[_RULESINDEX].DoEmail = self.jsreturn.record[0].alphadata2;
	}
	GetTaxFilters();
}

function GetTaxFilters()
{
	var fields = "tax-filter;process-level.emp-tax-addr;process-level.tax-filter;pro-rate-a-sal;annual-hours;fte-total;hm-dist-co"
	GetEmpInfo(authUser.prodline,Rules[_RULESINDEX].Company,Rules[_RULESINDEX].Employee,"employee",fields,"FinishedGettingTaxFilters()");
}

function FinishedGettingTaxFilters()
{
	if (self.jsreturn.NbrRecs)
	{
		Rules[_RULESINDEX].EmpTaxFilter = EmpInfo.tax_filter;
		Rules[_RULESINDEX].PrsEmpTaxAddr = EmpInfo.process_level_emp_tax_addr;
		Rules[_RULESINDEX].PrsTaxFilter = EmpInfo.process_level_tax_filter;
	}
	InitializeCommentsObject();
	if (Rules[_RULESINDEX].CommentsFlag == "*")
		GetPaComments();
	else
		PaintFieldsForAction();
}

// Override Pay Rate Calculate function so that it works within the main browser frame.
function Calculate(index, cal)
{
	var val = parseFloat(Data[index].CurrentValue);
	if (salaryClassFldIndex != -1)
	{
		var salaryClassFld = self.main.document.getElementById("fieldSelect" + salaryClassFldIndex);
		var salaryClassVal = null;
		if (salaryClassFld.selectedIndex >= 0)
		{
			salaryClassVal = salaryClassFld.options[salaryClassFld.selectedIndex].value;
		 	if (salaryClassVal != Data[salaryClassFldIndex].CurrentValue)
		 	{
		 		// change from hourly to salaried, so use the employee's salary as the current value
		 		if (salaryClassVal == "S")
		 			val = EmpInfo.pro_rate_a_sal;
		 		// change from salaried to hourly, so calculate the hourly rate based on the employee's salary	
		 		else if (salaryClassVal == "H")
		 			val = val / (EmpInfo.annual_hours * EmpInfo.fte_total);
		 	}
		}
	}	
	if (cal == "percent")
	{
		var thisObj = self.main.document.getElementById("percentage"+index);
		var selObj = self.main.document.getElementById("fieldSelect"+index);
		if (isNaN(parseFloat(thisObj.value)))
			return;
		// Format the pay rate amount value to four decimal places to avoid PA52 edit.
		var arg = roundToDecimal(((parseFloat(thisObj.value)+100)/100) * val,4);
	}
	else
	{
		var selObj = self.main.document.getElementById("percentage"+index);
		var thisObj = self.main.document.getElementById("fieldSelect"+index);
		if (isNaN(parseFloat(thisObj.value)))
			return;
		var arg = roundToDecimal(((parseFloat(thisObj.value)*100) / val) - 100,2);
	}
	// Check for a valid number before storing the change.
	if (isNaN(parseFloat(arg)))
		return;
	selObj.value = arg;
}

function CalculatePayRatePercentage()
{
	if (payRateFldIndex != -1)
	{
		var payRateFld = self.main.document.getElementById("fieldSelect" + payRateFldIndex);
		var percentFld = self.main.document.getElementById("percentage" + payRateFldIndex);
		if (NonSpace(payRateFld.value) > 0)
			Calculate(payRateFldIndex, "amount");
		else if (NonSpace(percentFld.value) > 0)
			Calculate(payRateFldIndex, "percent");
	}
}

function ScheduleChanged()
{
	var selObj;
	var optObj;
	if (stepFldIndex != -1)
	{
		selObj = self.main.document.getElementById("fieldSelect" + stepFldIndex);
		selObj.innerHTML = "";
		optObj = self.main.document.createElement("OPTION");
		optObj.value = "DEFAULT_VALUE";
		optObj.text = "";
		if (navigator.appName.indexOf("Microsoft") >= 0)
			selObj.add(optObj);
		else
			selObj.appendChild(optObj);
		optObj = self.main.document.createElement("OPTION");
		optObj.value = "";
		optObj.text = "";
		if (navigator.appName.indexOf("Microsoft") >= 0)
			selObj.add(optObj);
		else
			selObj.appendChild(optObj);
		self.main.styleElement(selObj);	
	}
	if (gradeFldIndex != -1)
	{
		selObj = self.main.document.getElementById("fieldSelect" + gradeFldIndex);		
		selObj.innerHTML = "";
		optObj = self.main.document.createElement("OPTION");
		optObj.value = "DEFAULT_VALUE";
		optObj.text = "";
		if (navigator.appName.indexOf("Microsoft") >= 0)
			selObj.add(optObj);
		else
			selObj.appendChild(optObj);
		optObj = self.main.document.createElement("OPTION");
		optObj.value = "";
		optObj.text = "";
		if (navigator.appName.indexOf("Microsoft") >= 0)
			selObj.add(optObj);
		else
			selObj.appendChild(optObj);			
		self.main.styleElement(selObj);			
	}	
}

function OpenHelpDialog()
{
	openHelpDialogWindow("/lawson/xhrnet/personnelactions/patips.htm");
}

function getSelectValue(id)
{
	var obj = self.main.document.getElementById(id);
	if (obj.type == "text")
		return obj.value;
	else 
	{
		var index = obj.selectedIndex;
		if (index == 0)
			return "";
		else
			return obj.options.item(index).value;
	}
}

function storeData()
{
	if (Rules[_RULESINDEX].WebImmediate == "Y") 
	{
		var pendOrNot = self.main.document.getElementById("pendOrNot");
		if (FC == "C" && pendOrNot.checked)
			FC = "A";
		Rules[_RULESINDEX].WebImmediate = (pendOrNot.checked) ? "N" : "Y";
	}
	for (var i=0; i<Data.length; i++) 
	{
		var obj = self.main.document.getElementById("fieldSelect"+i);
		var value = "";
		if (obj.type == "text")
		{
			if (obj.value.indexOf(getSeaPhrase("PA_BLANK_FIELD","ESS")) == 0)
				value = "*BLANK";
			else
				value = obj.value;
		}
		else
			value = getSelectValue("fieldSelect"+i);
		if (value == null || NonSpace(value) == 0)
		{
			// if there was a previous value for this field and the user has cleared it out, 
			// blank it out on the update to PA52
			if (Data[i].ChangeText != "")
				Data[i].ChangeText = " ";
			else	
				Data[i].ChangeText = "";
		}
		else
			Data[i].ChangeText = value;
	}
}

function storePosition(n)
{
    var obj = self.main.document.getElementById("fieldSelect"+n);
    var value = "";
    if (obj.type == "text")
        value = obj.value;
    else
        value = getSelectValue("fieldSelect"+n);
    if (value != null && NonSpace(value) != 0)
        Data[n].ChangeText = value;
}

function fillDefaults(n)
{
	clearRequiredFields();
	var positionFld = self.main.document.getElementById("fieldSelect" + n);
	//clearRequiredField(self.main.document.getElementById("actionFldCell" + n));
	if (positionFld.selectedIndex < 1)
	{
		setRequiredField(self.main.document.getElementById("actionFldCell" + n), getSeaPhrase("POSITION_REQUIRED","ESS"), positionFld);
		return;
	}
	// store the position field and blank out the others prior to a fill defaults
	storePosition(n);
	self.lawheader.UpdateType = "PA52.1";
	var pAGSObj = new AGSObject(authUser.prodline,"PA52.1");
	pAGSObj.event = "CHG";
	pAGSObj.rtn = "DATA";
	pAGSObj.longNames = true;
	pAGSObj.lfn = "ALL";
	pAGSObj.tds = false;
	pAGSObj.field = "FC=F"
	+ "&PCT-COMPANY=" + escape(authUser.company)
	+ "&PCT-ACTION-CODE=" + escape(Rules[_RULESINDEX].ActionCode.toString().toUpperCase())
	+ "&PCT-EMPLOYEE=" + escape(DirectReports[_DRINDEX].Code)
	+ "&PCT-EFFECT-DATE=" + escape(formjsDate(formatDME(Rules[_RULESINDEX].EffectiveDate)))
	+ "&IMMEDIATE-ACTION=" + escape(Rules[_RULESINDEX].WebImmediate);
	var count = 1;
	var i = 0;
	var j = 1;
	var found = false;
	var index;
	while ((i < Data.length) && (found == false))
	{
		index = parseInt((String(j))+(String(count)), 10);
		if ((Data[i].FldNbr == 126) && (Data[i].ChangeText != ""))
		{
			pAGSObj.field += "&PCT-NEW-VALUE-"+index+"=" + escape(Data[i].ChangeText);
			pAGSObj.field += "&PAT-FLD-NBR-"+index+"=" + escape(self.lawheader.Fields[i]);
			found = true;
		}
		if (++count > 12)
		{
			j++;
			count = 1;
		}
		i++;
	}
	pAGSObj.field += "&_HK=" + escape(self.lawheader.HiddenKeys,1);
	pAGSObj.field += "&ORIG-COMPANY=" + escape(self.lawheader.OrigCompany,1);
	pAGSObj.field += "&ORIG-EMPLOYEE=" + escape(self.lawheader.OrigEmployee,1);
	pAGSObj.field += "&ORIG-ACTION-CODE=" + escape(self.lawheader.OrigActionCode,1);
	pAGSObj.field += "&ORIG-EFFECT-DATE=" + escape(self.lawheader.OrigEffectDate,1);	
	pAGSObj.dtlField = "PCT-NEW-VALUE-1;PCT-NEW-VALUE-2";
	pAGSObj.func = "parent.fillDefaultsComplete()";
	pAGSObj.debug = false;
	pAGSObj.preInquire = true;
	InitializeLawheader();
	if (fromTask)
		parent.showWaitAlert(getSeaPhrase("RETRIEVE_DEFAULT","ESS"), function(){AGS(pAGSObj,"jsreturn");});
	else
		AGS(pAGSObj,"jsreturn");
}

function fillDefaultsComplete()
{
	// if there was no error returned from a "Fill Defaults" action, set the default values in the form
	if (parseInt(self.lawheader.gmsgnbr,10) == 0)
	{
		var objLaw = self.lawheader;
		// loop through the fields on the action
		for (var n=0; n<objLaw.Items.length; n++)
		{
			// make sure there is a default value before processing the field;
			// skip over the position field, as it has already been set by the user
			if (objLaw.Items[n] && objLaw.ValuesNew[n] && parseInt(objLaw.Fields[n],10) != 126)
			{
				var newVal = objLaw.ValuesNew[n];
				var newDesc = objLaw.ValuesNew[n];
				if (objLaw.ValuesNew[n].toString().indexOf("*BLANK") == 0)
					newDesc = getSeaPhrase("PA_BLANK_FIELD","ESS");
				var actionFld = self.main.document.getElementById("fieldSelect"+n);
				// default field is a text box
				if (self.main.document.getElementById("fieldSelect"+n).type == "text")
					actionFld.value = newDesc;
				else 
				{
					// default field is a dropdown; if the user has already populated the full list in the dropdown,
					// select the default value from that list; otherwise, create a single option in the dropdown containing the default value
					if (actionFld.options.item(0).value == "DME_RETURNED")
					{
						// if the default value could not be found in the full dropdown list, append it to the list and select it
						if (setSelectValue("fieldSelect"+n, objLaw.ValuesNew[n]) == false)
						{
							var defaultFld = new Object();
							defaultFld.name = newDesc;
							defaultFld.code = newVal;
							appendDefaultSelectOption("fieldSelect"+n, defaultFld);							
						}
					}
					else
					{
						var dataArray = new Array();
						dataArray[0] = new Object();
						dataArray[0].name = newDesc;
						dataArray[0].code = newVal;
						generateSelectOptions("fieldSelect"+n, dataArray, true);
					}
				}
			}
		}
		parent.seaPageMessage(getSeaPhrase("PA_DATA_POSTED","ESS"), null, null, "info", null, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
	}
	else
		parent.seaAlert(self.lawheader.myMsg, null, null, "error");
	if (fromTask)
		parent.removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.MAIN.getWinTitle()]));
}

function clearRequiredFields()
{
	// key fields
	clearRequiredKeyFields();
	// action detail fields	
	for (var n=0; n<Data.length; n++)
		clearRequiredField(self.main.document.getElementById("actionFldCell" + n));
}

function clearRequiredKeyFields()
{
	clearRequiredField(self.main.document.getElementById("reportsCell"));
	clearRequiredField(self.main.document.getElementById("effectiveDate"));
	if (emssObjInstance.emssObj.filterSelect) 
	{
		clearRequiredField(self.main.document.getElementById("actionsSelect"));
		clearRequiredField(self.main.document.getElementById("reasonSelect1"));
		clearRequiredField(self.main.document.getElementById("reasonSelect2"));		
	} 
	else 
	{
		clearRequiredField(self.main.document.getElementById("actionsCell"));
		clearRequiredField(self.main.document.getElementById("reasonSelect1Cell"));
		clearRequiredField(self.main.document.getElementById("reasonSelect2Cell"));	
	}
}

function removeAllSelectItems(selObj)
{
	selObj.innerHTML = "";
	var optObj = self.main.document.createElement("OPTION");
	optObj.value = "";
	optObj.text = "";
	if (navigator.appName.indexOf("Microsoft") >= 0)
		selObj.add(optObj);
	else
		selObj.appendChild(optObj);
}

function setSelectValue(id, val)
{
	var i = 0;
	var obj = self.main.document.getElementById(id);
	var opts = obj.options;
	var len = opts.length;
	var found = false;
	while ((i < len) && (found == false))
	{
		if (opts[i].value == val)
		{
			obj.selectedIndex = i;
			self.main.styleElement(obj);
			found = true;
		}
		i++;
	}
	return found;
}

function Update(n)
{
//GDD  12/10/14  Force a comment if Eligible for Rehire is N or M (modified by ianm 20150115 to use document field
// instead of Data changeValue field. A form will not contain a changeValue, if no change has occurred.)
	if (self.main.document.getElementById("actionsSelect").value == "TERMPEND") {
	    for (var i=0; i<Data.length; i++)
	    {
			if (Data[i].Field == "Eligible for Rehire")
			{
				var EfR = self.main.document.getElementById("fieldSelect" + i).value;
				
				if ( (EfR == "N" || EfR == "M") && self.main.document.getElementById("comments").value == "") {
					//alert("Must enter comments for Eligible for Rehire");
					setRequiredField(self.main.document.getElementById("comments"), "Must enter comments for Eligible for Rehire");
					return;
				} else if (EfR == "")
				{
					setRequiredField(self.main.document.getElementById("fieldSelect" + i), "Must choose a value for Eligible for Rehire");
					return;
				}
			}
		}
	}
//GDD End of change

	clearRequiredFields();	
	storeData();
	// Sync up effective date in case the user has changed it since loading the action.	
	if (!validateEffectiveDate())
		return;
	Rules[_RULESINDEX].EffectiveDate = self.main.document.getElementById("effectiveDate").value;
	// validate the pay percentage and amount fields
	for (var i=0; i<Data.length; i++)
	{
		if (self.main.document.getElementById("percentage" + i))
		{
			var blankFldMsg = getSeaPhrase("PA_BLANK_FIELD","ESS");
			var PerNo = self.main.document.getElementById("percentage" + i);	
			clearRequiredField(PerNo);	
			if ((PerNo.value.indexOf(blankFldMsg) != 0) && isNaN(Number(PerNo.value)))
			{
				setRequiredField(PerNo, getSeaPhrase("INVALID_NO","ESS"));
				return;
			}
			var PayNo = self.main.document.getElementById("fieldSelect" + i);
			clearRequiredField(PayNo);
			if ((PayNo.value.indexOf(blankFldMsg) != 0) && !ValidNumber(PayNo,15,4))
			{
				setRequiredField(PayNo, getSeaPhrase("INVALID_NO","ESS"));
				return;
			}					
			break;
		}		
	}
	var ArrayLength;
	if (FC == "")
	{
		ArrayLength = 36;
		for (var i=0; i<ArrayLength; i++)
		{
			if ((typeof(ValuesNew[i]) != "undefined") && (ValuesNew[i] != ""))
			{
				FC = "C";
				break;
			}
		}
		if (i >= ArrayLength)
			FC = "A";
	}
	TaxLocatorVariable = false;
	if (fromTask)
		parent.showWaitAlert(getSeaPhrase("ACTION_SAVING","ESS"), CheckMsg);
	else
		CheckMsg()
}

function CheckMsg()
{
	var pAGSObj = new AGSObject(authUser.prodline,"PA52.1");
	// If immediate updates are allowed, add a new immediate action if the user updates an action a second time.
	if (Rules[_RULESINDEX].WebImmediate == "Y" && FC == "C")
		FC = "A";
	if ((Rules[_RULESINDEX].AddressChange || Rules[_RULESINDEX].SuppAddrChange) && Rules[_RULESINDEX].WebImmediate == "Y" 
	&& emssObjInstance.emssObj.payrollLockout && (appObj && appObj.getLongAppVersion() != null && appObj.getLongAppVersion().toString() >= "09.00.01.09"))		
	{
		if (isPRLockedOut("A", authUser.company, DirectReports[_DRINDEX].Code))
		{	
			StopWindowProcessing();
			parent.seaAlert(getSeaPhrase("PR_LOCKED_OUT","SEA"), null, null, "error");
			return;
		}
	}
	pAGSObj.event = "CHG";
	pAGSObj.rtn = "DATA";
	pAGSObj.longNames = true;
	pAGSObj.lfn = "ALL";	
	pAGSObj.tds = false;
	pAGSObj.field = "FC="+FC
	+ "&PCT-COMPANY=" + escape(authUser.company)
	+ "&PCT-ACTION-CODE=" + escape(Rules[_RULESINDEX].ActionCode.toString().toUpperCase())
	+ "&PCT-EMPLOYEE=" + escape(DirectReports[_DRINDEX].Code)
	+ "&PCT-EFFECT-DATE=" + escape(formjsDate(formatDME(Rules[_RULESINDEX].EffectiveDate)))
	+ "&IMMEDIATE-ACTION=" + escape(Rules[_RULESINDEX].WebImmediate);
	if (Rules[_RULESINDEX].WebImmediate != "Y")
			pAGSObj.field += "&BYPASS-POPUPS=Y";
	pAGSObj.field += "&PCT-REASON1=" + escape(getSelectValue("reasonSelect1").toString().toUpperCase())
	+ "&PCT-REASON2=" + escape(getSelectValue("reasonSelect2").toString().toUpperCase());
	var count = 1;
	for (var i=0,j=1; i<Data.length; i++)
	{
		index = parseInt((String(j)) + (String(count)),10);
		if (Data[i].ChangeText != '')
		{
			pAGSObj.field += "&PCT-NEW-VALUE-"+index+"=" + escape(Data[i].ChangeText);
			pAGSObj.field += "&PAT-FLD-NBR-"+index+"=" + escape(self.lawheader.Fields[i]);
		}
		if (++count>12)
		{
			j++;
			count = 1;
		}
	}
	pAGSObj.field += "&_HK=" + escape(self.lawheader.HiddenKeys,1);
	pAGSObj.field += "&ORIG-COMPANY=" + escape(self.lawheader.OrigCompany,1);
	pAGSObj.field += "&ORIG-EMPLOYEE=" + escape(self.lawheader.OrigEmployee,1);
	pAGSObj.field += "&ORIG-ACTION-CODE=" + escape(self.lawheader.OrigActionCode,1);
	pAGSObj.field += "&ORIG-EFFECT-DATE=" + escape(self.lawheader.OrigEffectDate,1);
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "09.00.01")
		pAGSObj.field += "&USER-ID=W" + escape(authUser.employee);
	pAGSObj.dtlField = "PCT-NEW-VALUE-1;PCT-NEW-VALUE-2";
	pAGSObj.func = "parent.CheckForErrors()";
	pAGSObj.debug = false;
	if (FC == "A")
		pAGSObj.preInquire = true;	
	AGS(pAGSObj,"jsreturn");
}

function Updated()
{
	clearRequiredFields();
	var pAGSObj = new AGSObject(authUser.prodline, "PA52.1");
	pAGSObj.event = "CHG";
	pAGSObj.rtn = "DATA";
	pAGSObj.longNames = true;
	pAGSObj.lfn = "ALL";
	pAGSObj.tds = false;
	pAGSObj.field = "FC="+FC
	+ "&PCT-COMPANY=" + escape(authUser.company)
	+ "&PCT-ACTION-CODE=" + escape(Rules[_RULESINDEX].ActionCode.toString().toUpperCase())
	+ "&PCT-EMPLOYEE=" + escape(DirectReports[_DRINDEX].Code);
	if (Rules[_RULESINDEX].WebImmediate != "Y")
		pAGSObj.field += "&BYPASS-POPUPS=Y";
	for (var k=0; k<self.lawheader.Xmit.length; k++)
	{
		if (typeof(self.lawheader.Xmit[k]) != 'undefined')
		{
			switch (k)
			{
				case 0:	pAGSObj.field += "&XMIT-HREMP-BLOCK="; break;
				case 1:	pAGSObj.field += "&XMIT-DEDDAT="; break;
				case 2:	pAGSObj.field += "&XMIT-IMMED="; break;
				case 3:	pAGSObj.field += "&XMIT-REQDED="; break;
				case 4:	pAGSObj.field += "&XMIT-ACT-EXISTS="; break;
			}
			pAGSObj.field += escape(self.lawheader.Xmit[k]);
		}
	}
	pAGSObj.field += "&PCT-EFFECT-DATE=" + escape(formjsDate(formatDME(Rules[_RULESINDEX].EffectiveDate)))
	+ "&IMMEDIATE-ACTION=" + escape(Rules[_RULESINDEX].WebImmediate)
	+ "&PCT-REASON1=" + escape(getSelectValue("reasonSelect1").toString().toUpperCase())
	+ "&PCT-REASON2=" + escape(getSelectValue("reasonSelect2").toString().toUpperCase());
	var count = 1;
	for (var i=0,j=1; i<Data.length; i++)
	{
		index = parseInt((String(j)) + (String(count)),10);
		if (Data[i].ChangeText != '')
		{
			pAGSObj.field += "&PCT-NEW-VALUE-"+index+"=" + escape(Data[i].ChangeText);
			pAGSObj.field += "&PAT-FLD-NBR-"+index+"=" + escape(self.lawheader.Fields[i]);
		}
		if (++count>12)
		{
			j++;
			count = 1;
		}
	}
	pAGSObj.field += "&_HK=" + escape(self.lawheader.HiddenKeys,1);
	pAGSObj.field += "&ORIG-COMPANY=" + escape(self.lawheader.OrigCompany,1);
	pAGSObj.field += "&ORIG-EMPLOYEE=" + escape(self.lawheader.OrigEmployee,1);
	pAGSObj.field += "&ORIG-ACTION-CODE=" + escape(self.lawheader.OrigActionCode,1);
	pAGSObj.field += "&ORIG-EFFECT-DATE=" + escape(self.lawheader.OrigEffectDate,1);
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "09.00.01")
		pAGSObj.field += "&USER-ID=W" + escape(authUser.employee);	
	pAGSObj.dtlField = "PCT-NEW-VALUE-1;PCT-NEW-VALUE-2";
	pAGSObj.func = "parent.CheckForErrors()";
	pAGSObj.debug = false;
	if (FC == "A")
		pAGSObj.preInquire = true;	
	if (fromTask)
		parent.showWaitAlert(getSeaPhrase("ACTION_SAVING","ESS"), function(){AGS(pAGSObj,"jsreturn");});
	else
		AGS(pAGSObj,"jsreturn");
}

var count = 0;

function FinishUpdate()
{
	// If the action allows immediate updates, but this action was pended, the action is now locked into pending updates.
	if (Rules[_RULESINDEX].WebImmediate == "N")
	{
		try
		{
			var pend = self.main.document.getElementById("pendOrNot");
			if (pend)
			{
				var pendOrNotMsg = self.main.document.getElementById("pendOrNotMsg");
				if (pendOrNotMsg)
					pendOrNotMsg.innerHTML = getSeaPhrase("ACTION_PEND_B","ESS");
			}
		} catch(e) {}
	}	
	if (Rules[_RULESINDEX].AddressChange)
		AddressChangeSucceeded();
	else
	{
		if (TaxLocatorVariable)
			SendEmail();
		setTimeout("UpdateCompleteMessage()","500");
	}
}

function DspMsg()
{
	count++;
	if (self.lawheader.gmsgnbr == "000")
	{
		if (count == 1)
			CheckForErrors();
		else
			ProcessPaComments();
	}
	else if (Rules[_RULESINDEX].AddressChange)
	{
		if (typeof(Rules[_RULESINDEX].EmailAddress) == "undefined" || Rules[_RULESINDEX].EmailAddress == null || NonSpace(Rules[_RULESINDEX].EmailAddress) == 0) // SYSRULES email is blank
		{
			if (TaxLocatorVariable) // Tax Locator error message
			{
				parent.seaAlert(getSeaPhrase("HOME_ADDR_13","ESS"), null, null, "error");
				return;
			}
		}
		parent.seaAlert(getSeaPhrase("HOME_ADDR_14","ESS"), null, null, "error");
	}
	else
		parent.seaAlert(getSeaPhrase("ERROR","ESS")+": "+self.lawheader.gmsgnbr+"\n\n"+self.lawheader.myMsg, null, null, "error");
}

function ProcessPaComments()
{	
	InitializeCommentsObject();
	var cmtElm = self.main.document.getElementById("comments");
	if (!cmtElm)
	{	
		FinishUpdate();
		return;
	}	
	if (Rules[_RULESINDEX].CommentsFlag == "*" && NonSpace(cmtElm.value) == 0)
		DeletePaComments();
	else if (NonSpace(cmtElm.value) > 0)
		UpdateComments();
	else
		FinishUpdate();
}

function AddressChangeSucceeded()
{
	// Store the old and new state values.
	Rules[_RULESINDEX].OldState = "";
	Rules[_RULESINDEX].NewState = "";
	for (var i=0; i<Data.length; i++)
	{
		// If the user is performing a supplemental address change, capture the old and new supp state values
		if (Rules[_RULESINDEX].SuppAddrChange)
		{
			if (Data[i].FldNbr == 42)
			{
				Rules[_RULESINDEX].OldState = Data[i].CurrentValue;
				Rules[_RULESINDEX].NewState = Data[i].ChangeText;
				break;
			}
		}
		else // old and new home state values
		{
			if (Data[i].FldNbr == 8)
			{
				Rules[_RULESINDEX].OldState = Data[i].CurrentValue;
				Rules[_RULESINDEX].NewState = Data[i].ChangeText;
				break;
			}
		}
	}
	// Do we create an email?
	if ((parseInt(Rules[_RULESINDEX].DoEmail,10) == 1 || (parseInt(Rules[_RULESINDEX].DoEmail,10) == 2 && TaxLocatorVariable))
	&& typeof(Rules[_RULESINDEX].EmailAddress) != "undefined" && Rules[_RULESINDEX].EmailAddress != null && NonSpace(Rules[_RULESINDEX].EmailAddress) != 0)
	{
		// Is EMP-TAX-FILTER = 2 or 3, etc?
		if ((parseInt(Rules[_RULESINDEX].EmpTaxFilter,10) == 2 || parseInt(Rules[_RULESINDEX].EmpTaxFilter,10) == 3)
		|| ((!Rules[_RULESINDEX].EmpTaxFilter || isNaN(parseFloat(Rules[_RULESINDEX].EmpTaxFilter))) && (parseInt(Rules[_RULESINDEX].PrsTaxFilter,10) == 2 || parseInt(Rules[_RULESINDEX].PrsTaxFilter,10) == 3)))
		{
			// This is a supplemental address change.
			if (Rules[_RULESINDEX].SuppAddrChange)
			{
				// If this is a supplemental address change and PRS-EMP-TAX-ADDR == 2, send an email.
				if (parseInt(Rules[_RULESINDEX].PrsEmpTaxAddr,10) == 2)
				{
					UpdateCompleteMessage();
					SendEmail();
				}
				else
				{
					// If this is a supplemental address change and PRS-EMP-TAX-ADDR != 2, do not send an email.
					UpdateCompleteMessage();
				}
			}
			else
			{
				// This is a home address change; send an email.
				UpdateCompleteMessage();
				SendEmail();				
			}
		}
		else
		{
			UpdateCompleteMessage();
			SendEmail();
		}
	}
	else
		UpdateCompleteMessage();
}

function UpdateCompleteMessage()
{
	if (fromTask)
		parent.removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
	if (self.lawheader.gmsgnbr == "000")
		parent.seaPageMessage(getSeaPhrase("PACTIONS_UPDATED","ESS"), null, null, "info", null, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
}

function SendEmail()
{
	// If no email address exists, do not trigger an email notification
	if (Rules[_RULESINDEX].EmailAddress == null || NonSpace(Rules[_RULESINDEX].EmailAddress) == 0)
		return;
	if (emssObjInstance.emssObj.processFlowsEnabled)
	{
		var techVersion = (iosHandler && iosHandler.getIOSVersionNumber() >= "09.00.00") ? ProcessFlowObject.TECHNOLOGY_900 : ProcessFlowObject.TECHNOLOGY_803;
		var httpRequest = (typeof(SSORequest) == "function") ? SSORequest : SEARequest;
		var pfObj = new ProcessFlowObject(window, techVersion, httpRequest, "EMSS");
		pfObj.setEncoding(authUser.encoding);
		pfObj.showErrors = false;
		var flowObj = pfObj.setFlow("EMSSPAAddrChg", Workflow.SERVICE_EVENT_TYPE, Workflow.ERP_SYSTEM, authUser.prodline, authUser.webuser, null, "");
		flowObj.addVariable("company", String(Rules[_RULESINDEX].Company));
		flowObj.addVariable("employee", String(Rules[_RULESINDEX].Employee));
		flowObj.addVariable("action", Rules[_RULESINDEX].ActionCode);
		flowObj.addVariable("effectDate", Rules[_RULESINDEX].EffectiveDate);
		flowObj.addVariable("taxError", (TaxLocatorVariable) ? "Y" : "N");
		flowObj.addVariable("taxFilter", (TaxFlag) ? "Y" : "N");
		flowObj.addVariable("immediate", Rules[_RULESINDEX].WebImmediate);
		flowObj.addVariable("emailFormat", String(emssObjInstance.emssObj.emailFormat));
		pfObj.triggerFlow();
		return;
	}
	var TaxFlag = false;
	var PR13TaxMsg = "";
	var SendingTo 	= Rules[_RULESINDEX].EmailAddress;
	var SendingFrom = (authUser.name) ? authUser.name : "Personnel Actions";
	var pObj = new EMAILObject(SendingTo,SendingFrom);
	pObj.subject = getSeaPhrase("PACTIONS","ESS");
	pObj.message = getSeaPhrase("CO","ESS")+": "+Rules[_RULESINDEX].Company
	+ "\n"+getSeaPhrase("JOB_PROFILE_2","ESS")+": "+Rules[_RULESINDEX].Employee
	+ "\n"+getSeaPhrase("NAME","ESS")+": "+Rules[_RULESINDEX].EmployeeName
	+ "\n"+getSeaPhrase("ACTION","ESS")+": "+Rules[_RULESINDEX].ActionCode
	+ "\n"+getSeaPhrase("EFFECTIVE","ESS")+": "+Rules[_RULESINDEX].EffectiveDate
	// Check tax filter values to see if local tax authority fields may need to be changed.
	if ((parseInt(Rules[_RULESINDEX].EmpTaxFilter,10) == 2 || parseInt(Rules[_RULESINDEX].EmpTaxFilter,10) == 3)
	|| ((!Rules[_RULESINDEX].EmpTaxFilter || isNaN(parseFloat(Rules[_RULESINDEX].EmpTaxFilter))) && (parseInt(Rules[_RULESINDEX].PrsTaxFilter,10) == 2 || parseInt(Rules[_RULESINDEX].PrsTaxFilter,10) == 3)))
	{
		TaxFlag = true;
	}
	if (TaxFlag)
	{
		// This is a supplemental address change.
		if (Rules[_RULESINDEX].SuppAddrChange)
		{
			// If this is a supplemental address change and PRS-EMP-TAX-ADDR == 2.
			if (parseInt(Rules[_RULESINDEX].PrsEmpTaxAddr,10) == 2)
				PR13TaxMsg = getSeaPhrase("HOME_ADDR_48","ESS");
		}
		else
			PR13TaxMsg = getSeaPhrase("HOME_ADDR_48","ESS");
	}
	if (Rules[_RULESINDEX].WebImmediate == "N")
		pObj.message += "\n\n"+getSeaPhrase("PACTIONS_EMAIL_MSG1","ESS")
	else
		pObj.message += "\n\n"+getSeaPhrase("PACTIONS_EMAIL_MSG2","ESS")
	if (TaxLocatorVariable)
		pObj.message += "\n"+getSeaPhrase("HOME_ADDR_41","ESS")
	if (PR13TaxMsg != "")
		pObj.message += "\n"+PR13TaxMsg;
	EMAIL(pObj,"jsreturn");
}

function cgiEmailDone()
{
	if (fromTask)
		parent.removeWaitAlert();
}

function DoesObjectExist(pObj)
{
	if (typeof(pObj) == "undefined" || typeof(pObj) == "unknown" || pObj == null || typeof(pObj) == "null")
		return false;
	else
		return true;
}

/*
 *	Data Retrieval Functions
 */
// DME coded values for the select boxes written strictly for Personnel Actions
var deptCode = new Array();
var paPosition = new Array();
var jobCode	= new Array();
var supervisor = new Array();
var pCodes = new Array();
var Hrctrycodes = new Array();
var acAcctcat = new Array();
var acActivity = new Array();
var glMaster = new Array();
var glMasterAll = new Array();
var prSaghead = new Array();
var proverTime = new Array();
var prTaxauth = new Array();
var prSystem = new Array();
var prDtl = new Array();
var dtlInList = new Array();
var prInList = new Array();
var empStatus = new Array();
var glNames	= new Array();
var ctryNames = new Array();
var currNames = new Array();
var BusNbrGrp = new Array();
var prStates = new Array();
var prProvinces	= new Array();
var vetCodes = new Array();
var workSchedule = new Array();
var QCEntNbrGrp = new Array();
var reasonCodes	= new Array();

// DME Select Window Functions, indexed by Field Number from PADICT
var DMEFunctions = new Array();
DMEFunctions[0]	= "GetPcodes('RA')"; // Reasons
DMEFunctions[10] = "GetCountryCodes()"; // Country
DMEFunctions[14] = "GetPrsystem()"; // Process Level
DMEFunctions[15] = "GetDepartment()"; // Department
DMEFunctions[16] = "GetPcodes('UL')"; // User Level
DMEFunctions[17] = "GetPcodes('LO')"; // Location
DMEFunctions[18] = "GetHrsuper()"; // Supervisor
DMEFunctions[19] = "GetJobcode()"; // Job Code
DMEFunctions[20] = "GetEmstatus()"; // Status	
DMEFunctions[21] = "GetPcodes('UN')"; // Union Code
DMEFunctions[22] = "GetPcodes('BU')"; // Bargaining Unit
DMEFunctions[23] = "GetPcodes('HS')"; // Hire Source
DMEFunctions[28] = "GetGlnames()";  // Expense Acct Unit
DMEFunctions[29] = "GetGlmaster(false)"; // Expense Account
DMEFunctions[30] = "GetGlmaster(true)"; // Expense Sub Account
DMEFunctions[31] = "GetAcactivity()"; // Activity
DMEFunctions[32] = "GetHrctrycode('ET')"; // Ethnicity
DMEFunctions[44] = "GetCountryCodes()"; // Supplemental Country
DMEFunctions[46] = "GetPcodes('MG')"; // Mail Group
DMEFunctions[48] = "GetPrtaxauth('ST')"; // Work State
DMEFunctions[49] = "GetPrtaxauth('ST')"; // Workers Comp State
DMEFunctions[54] = "GetPcodes('SC')"; // Badge Code
DMEFunctions[81] = "GetPrtaxauth('ST')"; // Resident State
DMEFunctions[84] = "GetPrtaxauth('CN')"; // Resident County
DMEFunctions[86] = "GetPrtaxauth('CI')"; // Resident City
DMEFunctions[92] = "GetCountryCodes()"; // Birthplace - Country
DMEFunctions[106] = "GetProvertime()"; // Pay Plan
DMEFunctions[126] = "GetPaposition()"; // Position Number 1
//DMEFunctions[128] = "GetPaposition()"; // Position Number 2
//DMEFunctions[130] = "GetPaposition()"; // Position Number 3
DMEFunctions[134] = "GetSchedule('S')"; // Step
DMEFunctions[135] = "GetSchedule('G')"; // Grade
DMEFunctions[136] = "GetPrsaghead()"; // Schedule
//DMEFunctions[140] = "GetHrctrycode('VS')"; // Veteran - for 8.1.1 apps or newer
DMEFunctions[141] = "GetPcodes('PC')"; // Primary Physician
DMEFunctions[165] = "GetAcacctcat()"; // Account Category
DMEFunctions[289] = "GetHrsuper()"; // Indirect Supervisor
DMEFunctions[293] = "GetHrwrkschd()"; // Work Schedule
DMEFunctions[769] = "GetPrtaxauth('CN')"; // Work County
DMEFunctions[770] = "GetPrtaxauth('CI')"; // Work City
DMEFunctions[771] = "GetPrtaxauth('SD')"; // Resident School District
DMEFunctions[773] = "GetPrtaxauth('SD')"; // Work School District
DMEFunctions[782] = "GetCountryCodes()"; // Spouse Emplr Country
DMEFunctions[783] = "GetCountryCodes()"; // Work Country
DMEFunctions[789] = "GetCurrCodes()"; // Emp Currency
DMEFunctions[898] = "GetCurrCodes()"; // Emp Base Currency
DMEFunctions[881] = "GetHrctrycode('SU')"; // Name Suffix
DMEFunctions[879] = "GetHrctrycode('PR')"; // Name Prefix
DMEFunctions[889] = "GetPcodes('DI')";
DMEFunctions[888] = "GetPcodes('RE')";
DMEFunctions[99] = "GetPcodes('DT')";
DMEFunctions[103] = "GetPcodes('DT')";
DMEFunctions[98] = "GetPcodes('DO')";
DMEFunctions[102] = "GetPcodes('DO')";
DMEFunctions[93] = "GetPcodes('WE')";
DMEFunctions[594] = "GetBusNbrGrp()";
DMEFunctions[1520] = "GetQCEntNbrGrp()";
DMEFunctions[8] = "GetPrStates()";
DMEFunctions[42] = "GetPrStates()";
DMEFunctions[91] = "GetPrStates()";
DMEFunctions[117] = "GetPrStates()";
DMEFunctions[595] = "GetPrProvinces()";
DMEFunctions[1509] = "GetPrProvinces()";	

var selectID;
var stateProvFilter = "state";

function openFieldSelect(_selectID, fldNbr, where)
{
	selectID = _selectID;
	var selObj = self.main.document.getElementById(selectID);
	if (selObj.nodeName.toLowerCase() == "select")
	{
		if (selObj.options.item(0).value == "DME_RETURNED")
			return;
	}	
	if (where.toString() == "HARDCODED")
		Perform(HardCodedLists[fldNbr]);
	else 
	{	
		var nextFunc = function()
		{
			if (where.toString() == "DME") 
			{		
				if (emssObjInstance.emssObj.filterSelect)
					openDmeFieldFilter(fldNbr);
				else
					eval(DMEFunctions[fldNbr]);
			} 
			else
			{
				selObj.setAttribute("userfld", "true");
				selObj.setAttribute("fieldnm", ""+where);
				openDmeFieldFilter(fldNbr);
			}
		};
		if (fromTask)
			parent.showWaitAlert(getSeaPhrase("RETRIEVING_RECORDS","ESS"), nextFunc);
		else
			nextFunc();
	}	
}

function GetEmstatus()
{
	if (empStatus.length)
		Perform(empStatus);
	else
	{
		empStatus = new Array();
		var object = new DMEObject(authUser.prodline,"EMSTATUS")
		object.out = "JAVASCRIPT"
		object.field = "emp-status;description";
		object.key = ""+authUser.company;
		object.cond = "active-emp";
		object.max = "600";
		DME(object,"jsreturn");
	}
}

function DspEmstatus()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		index = empStatus.length;
		empStatus[index] = new Object();
		empStatus[index].code = self.jsreturn.record[i].emp_status;
		if (self.jsreturn.record[i].description)
			empStatus[index].name = self.jsreturn.record[i].description;
		else 
			empStatus[index].name = empStatus[index].code;
		empStatus[index].description = empStatus[index].name +' - '+ empStatus[index].code;
	}
	if (self.jsreturn.Next != '')
		window.open(self.jsreturn.Next,"jsreturn");
	else
	{
		empStatus.sort(sortByDescription);	
		Perform(empStatus)
	}
}

function GetPrsystem()
{
	if (prSystem.length)
		Perform(prSystem);
	else
	{
		prSystem = new Array();
		var object = new DMEObject(authUser.prodline,"PRSYSTEM");
		object.out 	= "JAVASCRIPT";
		object.field = "process-level;name";
		object.key = ""+authUser.company;
		object.cond	= "active-pl";
		object.max = "600";
		DME(object,"jsreturn");
	}
}

function DspPrsystem()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		index = prSystem.length;
		prSystem[index] = new Object();
		prSystem[index].code = self.jsreturn.record[i].process_level;
		if (self.jsreturn.record[i].name)
			prSystem[index].name = self.jsreturn.record[i].name;
		else 
			prSystem[index].name = prSystem[index].code;
		prSystem[index].description = prSystem[index].name +' - '+ prSystem[index].code;		
	}
	if (self.jsreturn.Next != '')
		window.open(self.jsreturn.Next,"jsreturn");
	else
	{
		prSystem.sort(sortByDescription);	
		Perform(prSystem);
	}		
}

function GetDepartment()
{
	if (deptCode.length)
		Perform(deptCode);
	else
	{
		deptCode = new Array();
		var object = new DMEObject(authUser.prodline,"DEPTCODE");
		object.out = "JAVASCRIPT";
		object.field = "process-level;department;name";
		object.key = authUser.company+"";
		object.max = "600";
		object.cond	= "active";
		DME(object,"jsreturn");
	}
}

function DspDeptcode()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		obj = self.jsreturn.record[i];
		index = deptCode.length;
		deptCode[index] = new Object();
		deptCode[index].subName = obj.process_level;
		deptCode[index].code = obj.department;
		deptCode[index].name = obj.name;
		deptCode[index].description = deptCode[index].subName +' - '+ deptCode[index].name +' - '+ deptCode[index].code;	
	}
	if (self.jsreturn.Next != '')
		window.open(self.jsreturn.Next,"jsreturn");
	else
	{
		deptCode.sort(sortByDescription);	
		Perform(deptCode);
	}
}

function GetPaposition()
{
	if (paPosition.length)
		Perform(paPosition);
	else
	{
		paPosition = new Array();
		var object = new DMEObject(authUser.prodline,"PAPOSITION");
		object.out = "JAVASCRIPT";
		object.field = "position;description";
		object.cond	= "active-current";
		object.key 	= ""+authUser.company;
		object.max	= "600";
		DME(object,"jsreturn");
	}
}

function DspPaposition()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		index = paPosition.length;
		paPosition[index] = new Object();
		paPosition[index].code = self.jsreturn.record[i].position;
		if (self.jsreturn.record[i].description)
			paPosition[index].name = self.jsreturn.record[i].description;
		else 
			paPosition[index].name = paPosition[index].code;
		paPosition[index].description = paPosition[index].name +' - '+ paPosition[index].code;	
	}
	if (self.jsreturn.Next != '')
		window.open(self.jsreturn.Next,"jsreturn");
	else
	{
		paPosition.sort(sortByDescription);	
		Perform(paPosition);
	}
}

function GetHrwrkschd()
{
	if (workSchedule.length)
		Perform(workSchedule);
	else
	{
		workSchedule = new Array();
		var object = new DMEObject(authUser.prodline,"HRWRKSCHD");
		object.out = "JAVASCRIPT";
		object.index = "wscset1";
		object.field = "work-sched;description";
		object.key = String(authUser.company);
		object.max = "600";
		DME(object,"jsreturn");
	}
}

function DspHrwrkschd()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		index = workSchedule.length;
		workSchedule[index] = new Object();
		workSchedule[index].code = self.jsreturn.record[i].work_sched;
		if (self.jsreturn.record[i].description)
			workSchedule[index].name = self.jsreturn.record[i].description;
		else 
			workSchedule[index].name = workSchedule[index].code;
		workSchedule[index].description = workSchedule[index].name +' - '+ workSchedule[index].code;		
	}
	if (self.jsreturn.Next != '')
		window.open(self.jsreturn.Next,"jsreturn");
	else
	{
		workSchedule.sort(sortByDescription);	
		Perform(workSchedule);
	}
}

function GetJobcode()
{
	if (jobCode.length)
		Perform(jobCode);
	else
	{
		jobCode = new Array();
		var object = new DMEObject(authUser.prodline,"JOBCODE");
		object.out = "JAVASCRIPT";
		object.field = "job-code;description";
		object.key = ""+authUser.company;
		object.cond = "Active";
		object.max = "600";
		DME(object,"jsreturn");
	}
}

function DspJobcode()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		index = jobCode.length;
		jobCode[index] = new Object();
		jobCode[index].code = self.jsreturn.record[i].job_code;
		if (self.jsreturn.record[i].description)
			jobCode[index].name = self.jsreturn.record[i].description;
		else 
			jobCode[index].name = jobCode[index].code
		jobCode[index].description = jobCode[index].name +' - '+ jobCode[index].code;		
	}
	if (self.jsreturn.Next != '')
		window.open(self.jsreturn.Next,"jsreturn");
	else
	{
		jobCode.sort(sortByDescription);	
		Perform(jobCode);
	}
}

function GetHrsuper()
{
	if (supervisor.length)
		Perform(supervisor);
	else
	{
		supervisor = new Array();
		var object = new DMEObject(authUser.prodline,"HRSUPER");
		object.out = "JAVASCRIPT";
		object.field = "code;description;full-name;employee";
		object.key = String(authUser.company);
		object.max = "600";
		object.cond	= "Active-Code";
		DME(object,"jsreturn");
	}
}

function DspHrsuper()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		index = supervisor.length;
		supervisor[index] = new Object();
		supervisor[index].code = self.jsreturn.record[i].code;
		var empNbr = Number(self.jsreturn.record[i].employee);
		if (!isNaN(empNbr) && empNbr != 0)
			supervisor[index].name = self.jsreturn.record[i].full_name +' - '+ self.jsreturn.record[i].description;
		else
			supervisor[index].name = getSeaPhrase("POSITION_NOT_FILLED","ESS")+' - '+ self.jsreturn.record[i].description;
		supervisor[index].employee = self.jsreturn.record[i].employee;
		supervisor[index].description = supervisor[index].name +' - '+ supervisor[index].code;
	}
	if (self.jsreturn.Next != '')
		window.open(self.jsreturn.Next,"jsreturn");
	else
	{		
		supervisor.sort(sortBySupervisorDescription);
		Perform(supervisor);
	}
}

var lastPcodeSelect = "";
function GetPcodes(selectValue)
{
	if (pCodes.length && lastPcodeSelect == selectValue)
		Perform(pCodes);
	else
	{	
		pCodes = new Array();
		lastPcodeSelect = selectValue;
		var object = new DMEObject(authUser.prodline,"PCODES");
		object.out = "JAVASCRIPT";
		object.index = "pcoset1";
		object.field = "code;description";
		object.key = String(selectValue);
		object.cond = "Active";
		object.max = "600";
		object.debug = false;
		DME(object,"jsreturn");
	}
}

function DspPcodes()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		index = pCodes.length;
		pCodes[index] = new Object();
		pCodes[index].code = self.jsreturn.record[i].code;
		if (self.jsreturn.record[i].description)
			pCodes[index].name = self.jsreturn.record[i].description;
		else 
			pCodes[index].name = pCodes[index].code;
		pCodes[index].description = pCodes[index].name+' - '+pCodes[index].code;			
	}
	if (self.jsreturn.Next != '')
		window.open(self.jsreturn.Next,"jsreturn");
	else
	{
		pCodes.sort(sortByDescription);	
		Perform(pCodes);
	}
}

var lastHrctrycodeSelect = "";
function GetHrctrycode(selectValue)
{
	if (Hrctrycodes.length && lastHrctrycodeSelect == selectValue)
		Perform(Hrctrycodes);
	else
	{
		Hrctrycodes = new Array();
		lastHrctrycodeSelect = selectValue;
		var workCtry = (DirectReports[_DRINDEX].WorkCountry) ? DirectReports[_DRINDEX].WorkCountry : "";
		var object = new DMEObject(authUser.prodline,"HRCTRYCODE");
		object.out = "JAVASCRIPT";
		object.index = "ctcset1";
		object.field = "hrctry-code;description";
		object.key = selectValue+"="+workCtry;
		object.cond = "Active";
		object.max = "600";
		DME(object,"jsreturn");
	}
}

function DspHrctrycode()
{
	for(var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		index = Hrctrycodes.length;
		Hrctrycodes[index] = new Object();
		Hrctrycodes[index].code = self.jsreturn.record[i].hrctry_code;
		if (self.jsreturn.record[i].description)
			Hrctrycodes[index].name = self.jsreturn.record[i].description;
		else 
			Hrctrycodes[index].name = Hrctrycodes[index].hrctry_code;
		Hrctrycodes[index].description = Hrctrycodes[index].name+' - '+Hrctrycodes[index].code;		
	}
	if (self.jsreturn.Next != '')
		window.open(self.jsreturn.Next,"jsreturn");
	else
	{
		Hrctrycodes.sort(sortByDescription);		
		Perform(Hrctrycodes);
	}
}

function GetBusNbrGrp()
{
	if (BusNbrGrp.length)
		Perform(BusNbrGrp);
	else
	{
		BusNbrGrp = new Array();
		var object = new DMEObject(authUser.prodline,"PRBUSGRP");
		object.out = "JAVASCRIPT";
		object.field = "process-level;bus-nbr-grp;bus-nbr";
		object.max = "600";
		object.key = String(authUser.company);
		DME(object,"jsreturn");
	}
}

function DspPrbusgrp()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		index = BusNbrGrp.length;
		BusNbrGrp[index] = new Object();
		BusNbrGrp[index].code = self.jsreturn.record[i].bus_nbr_grp;
		if (self.jsreturn.record[i].bus_nbr)
			BusNbrGrp[index].name = self.jsreturn.record[i].bus_nbr;
		else 
			BusNbrGrp[index].name = BusNbrGrp[index].code;
		BusNbrGrp[index].description = BusNbrGrp[index].name+' - '+BusNbrGrp[index].code;				
	}
	if (self.jsreturn.Next != '')
		window.open(self.jsreturn.Next,"jsreturn");
	else
	{
		BusNbrGrp.sort(sortByDescription);	
		Perform(BusNbrGrp);
	}
}

function GetQCEntNbrGrp()
{
	if (QCEntNbrGrp.length)
		Perform(QCEntNbrGrp);
	else
	{
		QCEntNbrGrp = new Array();
		var object = new DMEObject(authUser.prodline,"PRQCENTGRP");
		object.out = "JAVASCRIPT";
		object.field = "process-level;qc-ent-nbr-grp;qc-ent-nbr";
		object.max = "600";
		object.key = String(authUser.company);
		DME(object,"jsreturn");	
	}
}

function DspPrqcentgrp()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		index = QCEntNbrGrp.length;
		QCEntNbrGrp[index] = new Object();
		QCEntNbrGrp[index].code = self.jsreturn.record[i].qc_ent_nbr_grp;
		if (self.jsreturn.record[i].qc_ent_nbr)
			QCEntNbrGrp[index].name = self.jsreturn.record[i].qc_ent_nbr;
		else 
			QCEntNbrGrp[index].name = QCEntNbrGrp[index].code;
		QCEntNbrGrp[index].description = QCEntNbrGrp[index].name+' - '+QCEntNbrGrp[index].code;		
	}
	if (self.jsreturn.Next != '')
		window.open(self.jsreturn.Next,"jsreturn");
	else
	{
		QCEntNbrGrp.sort(sortByDescription);	
		Perform(QCEntNbrGrp);
	}
}

function GetAcacctcat()
{
	if (acAcctcat.length)
		Perform(acAcctcat);
	else
	{
		acAcctcat = new Array();
		var object = new DMEObject(authUser.prodline,"ACACCTCAT");
		object.out = "JAVASCRIPT";
		object.field = "acct-category;description";
		object.max = "600";
		DME(object,"jsreturn");	
	}
}

function DspAcacctcat()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		index = acAcctcat.length;
		acAcctcat[index] = new Object();
		acAcctcat[index].code = self.jsreturn.record[i].acct_category;
		if (self.jsreturn.record[i].description)
			acAcctcat[index].name = self.jsreturn.record[i].description;
		else 
			acAcctcat[index].name = acAcctcat[index].code;
		acAcctcat[index].description = acAcctcat[index].name+' - '+acAcctcat[index].code;				
	}
	if (self.jsreturn.Next != '')
		window.open(self.jsreturn.Next,"jsreturn");
	else
	{
		acAcctcat.sort(sortByDescription);	
		Perform(acAcctcat);
	}
}

function GetAcactivity()
{
	if (acActivity.length)
		Perform(acActivity);
	else
	{
		acActivity = new Array();
		var object = new DMEObject(authUser.prodline,"ACACTIVITY");
		object.out = "JAVASCRIPT";
		object.field = "activity;description";
		object.max = "600";
		DME(object,"jsreturn");
	}
}

function DspAcactivity()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		index = acActivity.length;
		acActivity[index] = new Object();
		acActivity[index].code = self.jsreturn.record[i].activity;
		if (self.jsreturn.record[i].description)
			acActivity[index].name = self.jsreturn.record[i].description;
		else 
			acActivity[index].name = acActivity[index].code;
		acActivity[index].description = acActivity[index].name+' - '+acActivity[index].code;		
	}
	if (self.jsreturn.Next != '')
		window.open(self.jsreturn.Next,"jsreturn");
	else
	{
		acActivity.sort(sortByDescription);	
		Perform(acActivity);
	}
}

function GetGlnames()
{
	if (glNames.length)
		Perform(glNames);
	else
	{
		glNames = new Array();
		var object = new DMEObject(authUser.prodline,"GLNAMES");
		object.out = "JAVASCRIPT";
		object.index = "glnset1";
		object.field = "acct-unit;description";
		object.max = "600";
		object.key = (EmpInfo.hm_dist_co) ? EmpInfo.hm_dist_co+"" : "";
		DME(object,"jsreturn");
	}
}

function DspGlnames()
{
	var dupArray = new Array();
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		if (!dupArray[self.jsreturn.record[i].acct_unit]) 
		{
			dupArray[self.jsreturn.record[i].acct_unit] = true;
			index = glNames.length;
			glNames[index] = new Object();
			glNames[index].code = self.jsreturn.record[i].acct_unit;
			if (self.jsreturn.record[i].description)
				glNames[index].name = self.jsreturn.record[i].description;
			else
				glNames[index].name = glNames[index].code;
			glNames[index].description = glNames[index].name+' - '+glNames[index].code;			
		}	
	}
	if (self.jsreturn.Next != '')
		window.open(self.jsreturn.Next,"jsreturn");
	else
	{
		glNames.sort(sortByDescription);	
		Perform(glNames);
	}
}

function GetGlmaster(subAcct)
{
	if (glMasterAll.length) 
	{
		setGlMaster(subAcct);
		Perform(glMaster);
	}
	else
	{
		glMasterAll = new Array();
		var object = new DMEObject(authUser.prodline,"GLMASTER");
		object.out = "JAVASCRIPT";
		object.index = "glmset2";
		object.field = "account;acct-desc;sub-account";
		object.key = (EmpInfo.hm_dist_co) ? EmpInfo.hm_dist_co+"" : "";
		object.max = "600";
		object.func	= (subAcct)?"DspGlmaster(true)":"DspGlmaster(false)";
		object.debug = false;
		DME(object,"jsreturn");
	}
}

function DspGlmaster(subAcct)
{
	glMasterAll = glMasterAll.concat(self.jsreturn.record);
	if (self.jsreturn.Next != '')
		window.open(self.jsreturn.Next,"jsreturn");
	else 
	{
		setGlMaster(subAcct);
		Perform(glMaster);
	}
}

function setGlMaster(subAcct)
{
	var lgth;
	var dupArray = new Array();
	glMaster = new Array();
	if (subAcct) 
	{
		for (var i=0; i<glMasterAll.length; i++)
		{
			if (!dupArray[glMasterAll[i].sub_account]) 
			{
				dupArray[glMasterAll[i].sub_account] = true;
				lgth = glMaster.length;
				glMaster[lgth] = new Object();
				glMaster[lgth].code = parseInt(glMasterAll[i].sub_account,10);
				glMaster[lgth].name = parseInt(glMasterAll[i].sub_account,10);
				glMaster[lgth].description = glMaster[lgth].name+' - '+glMaster[lgth].code;				
			}
		}
	}
	else 
	{
		for (var i=0; i<glMasterAll.length; i++)
		{
			if (!dupArray[glMasterAll[i].account]) 
			{
				dupArray[glMasterAll[i].account] = true;
				lgth = glMaster.length;
				glMaster[lgth] = new Object();
				glMaster[lgth].code = glMasterAll[i].account;
				if (glMasterAll[i].acct_desc)
					glMaster[lgth].name = glMasterAll[i].acct_desc;
				else
					glMaster[lgth].name = glMasterAll[i].code;
				glMaster[lgth].description = glMaster[lgth].name+' - '+glMaster[lgth].code;				
			}	
		}	
	}
	glMaster.sort(sortByDescription);
}

function GetSchedule(selectValue)
{
	var index = -1
	for (var n=0; n<Data.length; n++)
	{
		if (Data[n].FldNbr == 136)
		{
			index = n;
			break;
		}
	}
	if (index != -1)
	{
		// var schedBox = eval('self.CONTROLITEM.document.persaction.select'+index)
		var schedBox = self.main.document.getElementById("fieldSelect"+index);
		var sValue = schedBox.value;
		if (NonSpace(sValue) && (sValue != "DME_RETURNED"))
		{
			var schedIndicator = "";
			for (var i=0;i<prSaghead.length;i++)
			{
				if (prSaghead[i].code == sValue)
				{
					schedIndicator = prSaghead[i].indicator;
					break;
				}
			}
			if (selectValue == "S" && schedIndicator == "G")
			{
				Tmp = new Array();
				Perform(Tmp);
			}
			else
				GetPrsaghead(selectValue,sValue,schedIndicator);
			return;
		}	
	}
	GetPrsaghead(selectValue);
}

var lastPrsSelect = "";
var lastSchedValue = "";
var lastSchedInd = "";
function GetPrsaghead(selectValue,schedValue,schedIndicator)
{
	if (!selectValue && prSaghead.length)
		Perform(prSaghead);
	else if (prDtl.length && (selectValue && lastPrsSelect == selectValue) &&
		(schedValue && lastSchedValue == schedValue) && (schedIndicator && lastSchedInd == schedIndicator))
			Perform(prDtl);	
	else
	{
		StoreDateRoutines();
		lastPrsSelect = selectValue;
		lastSchedValue = schedValue;
		lastSchedInd = schedIndicator;
		var object = new DMEObject(authUser.prodline,"PRSAGHEAD");
		object.out = "JAVASCRIPT";
		object.field = "schedule;description;indicator;effect-date";
		object.key = ""+authUser.company+"=";
		object.max = "600";
		object.select = "effect-date<="+ymdtoday;
		if (selectValue	&& selectValue != "")
		{
			prDtl = new Array();
			dtlInList = new Array();
			if (!schedIndicator) schedIndicator = "";
			if (selectValue == "G")
				object.field += ";rate.pay-grade";
			else if (selectValue == "S")
				object.field += ";rate.pay-step";	
			object.otmmax = "600";
			object.func = "DspPrsaghead('"+selectValue+"')";
			object.index = "sghset2";
			// handle case where we have a schedule but no indicator (e.g., after a "fill defaults")
			if (schedIndicator || selectValue != "G")
			{
				if (schedIndicator)
					object.key += schedIndicator;
				else if (selectValue != "G")
					object.key += selectValue;
				if (schedValue)
					object.key += "=" + escape(schedValue);			
			}
			else if (schedValue)
				object.select += "&schedule=" + escape(schedValue);
		}
		object.debug = false;	
		DME(object,"jsreturn");
	}
}

function DspPrsaghead(selectValue)
{
	if (selectValue)
	{
		var lastSched = "";
		for (var i=0; i<self.jsreturn.NbrRecs; i++)
		{
			if (self.jsreturn.record[i].schedule != lastSched)
			{
				if (self.jsreturn.record[i].Rel_rate)
				{
					var len = self.jsreturn.record[i].Rel_rate.length;
					for (var j=0; j<len; j++)
					{
						var value = "";
						if (selectValue == "S")
							value = self.jsreturn.record[i].Rel_rate[j].pay_step;
						else 
							value = self.jsreturn.record[i].Rel_rate[j].pay_grade;
						if (!dtlInList[value])
						{
							index = prDtl.length;
							prDtl[index] = new Object();
							prDtl[index].code = value;
							prDtl[index].name = prDtl[index].code;
							prDtl[index].description = prDtl[index].name +' - '+ prDtl[index].code;							
							dtlInList[prDtl[index].code] = true;
						}
					}
				}
			}
			lastSched = self.jsreturn.record[i].schedule;
		}
		if (self.jsreturn.Next != '')
			window.open(self.jsreturn.Next,"jsreturn");
		else
		{
			prDtl.sort(sortByDescription);		
			Perform(prDtl);	
		}
	}
	else
	{
		for (var i=0; i<self.jsreturn.NbrRecs; i++)
		{
			if (!prInList[self.jsreturn.record[i].schedule])
			{
				index = prSaghead.length;
				prSaghead[index] = new Object();
				prSaghead[index].code = self.jsreturn.record[i].schedule;
				if (self.jsreturn.record[i].description)
					prSaghead[index].name = self.jsreturn.record[i].description;
				else 
					prSaghead[index].name = prSaghead[index].code;
				prSaghead[index].indicator = self.jsreturn.record[i].indicator;
				prSaghead[index].description = prSaghead[index].name +' - '+ prSaghead[index].code;			
				prInList[prSaghead[index].code] = true;
			}
		}
		if (self.jsreturn.Next != '')
			window.open(self.jsreturn.Next,"jsreturn");
		else
		{
			prSaghead.sort(sortByDescription);			
			Perform(prSaghead);
		}
	}		
}	

function GetProvertime()
{
	if (proverTime.length)
		Perform(proverTime);
	else
	{
		proverTime = new Array();
		var object = new DMEObject(authUser.prodline,"PROVERTIME");
		object.out = "JAVASCRIPT";
		object.field = "plan-code;description";
		object.key = ""+authUser.company;
		object.max = "600";
		DME(object,"jsreturn");
	}
}

function DspProvertime()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		index = proverTime.length;
		proverTime[index] = new Object();
		proverTime[index].code = self.jsreturn.record[i].plan_code;
		if (self.jsreturn.record[i].description)
			proverTime[index].name = self.jsreturn.record[i].description;
		else 
			proverTime[index].name = proverTime[index].code;
		proverTime[index].description = proverTime[index].name +' - '+ proverTime[index].code;			
	}
	if (self.jsreturn.Next != '')
		window.open(self.jsreturn.Next,"jsreturn");
	else
	{
		proverTime.sort(sortByDescription);	
		Perform(proverTime);
	}
}

var lastTaxSelect = "";
function GetPrtaxauth(selectValue)
{
	if (prTaxauth.length && lastTaxSelect == selectValue)
		Perform(prTaxauth);
	else
	{
		lastTaxSelect = selectValue;
		prTaxauth = new Array();
		var object = new DMEObject(authUser.prodline,"PRTAXAUTH");
		object.out = "JAVASCRIPT";
		object.field = "tax-id-code;description";
		object.select = "tax-auth-type=" + selectValue;
		object.max = "600";
		DME(object,"jsreturn");
	}
}

function DspPrtaxauth()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		index = prTaxauth.length;
		prTaxauth[index] = new Object();
		prTaxauth[index].code = self.jsreturn.record[i].tax_id_code;
		if (self.jsreturn.record[i].description)
			prTaxauth[index].name = self.jsreturn.record[i].description;
		else 
			prTaxauth[index].name = prTaxauth[index].code;
		prTaxauth[index].description = prTaxauth[index].name +' - '+ prTaxauth[index].code;					
	}
	if (self.jsreturn.Next != '')
		window.open(self.jsreturn.Next,"jsreturn");
	else
	{
		prTaxauth.sort(sortByDescription);	
		Perform(prTaxauth);
	}
}

function GetCurrCodes()
{
	if (currNames.length)
		Perform(currNames);
	else
	{
    	var object = new DMEObject(authUser.prodline, "cucodes");
      	object.out = "JAVASCRIPT";
      	object.index = "cucset1";
      	object.field = "currency-code;forms-exp";
      	object.max = "600"
      	object.key = "";
   		DME(object, "jsreturn");
	}
}

function DspCucodes()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
	    index = currNames.length;
	    currNames[index] = new Object();
		currNames[index].code = self.jsreturn.record[i].currency_code;
		if (self.jsreturn.record[i].forms_exp)
			currNames[index].name = self.jsreturn.record[i].forms_exp;	
		else 
			currNames[index].name = currNames[index].code;
		currNames[index].description = currNames[index].name +' - '+ currNames[index].code;				
	}
	if (self.jsreturn.Next != '')
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
	{
		currNames.sort(sortByDescription);	
		Perform(currNames);
	}
}

function GetCountryCodes()
{
	if (ctryNames.length)
		Perform(ctryNames);
	else
	{
		var object = new DMEObject(authUser.prodline, "INSTCTRYCD");
      	object.out = "JAVASCRIPT";
      	object.index = "intset1";
      	object.field = "country-code;country-desc";
	  	object.max = "600";
      	object.key = "";
   		DME(object, "jsreturn");
	}
}

function DspInstctrycd()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
	    index = ctryNames.length;
	    ctryNames[index] = new Object();
		ctryNames[index].code = self.jsreturn.record[i].country_code;
		if (self.jsreturn.record[i].country_desc)
			ctryNames[index].name = self.jsreturn.record[i].country_desc;	
		else 
			ctryNames[index].name = ctryNames[index].code;
		ctryNames[index].description = ctryNames[index].name +' - '+ ctryNames[index].code;		
	}
	if (self.jsreturn.Next != '')
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
	{
		ctryNames.sort(sortByDescription);	
		Perform(ctryNames);
	}
}

function GetPrStates()
{
	if (prStates.length)
		Perform(prStates);
	else
	{
		var object = new DMEObject(authUser.prodline, "PRSTATE");
		object.out = "JAVASCRIPT";
		object.field = "state;description";
		object.max = "600";
		object.debug = false;
		DME(object,"jsreturn");
	}
}

function DspPrstate()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
	   	index = prStates.length;
	    prStates[index] = new Object();
	   	prStates[index].code = self.jsreturn.record[i].state;
		if (self.jsreturn.record[i].description)
			prStates[index].name = self.jsreturn.record[i].description;	
		else 
			prStates[index].name = prStates[index].code;
		prStates[index].description = prStates[index].name +' - '+ prStates[index].code;		
	}
	if (self.jsreturn.Next != '')
		self.jsreturn.location.replace(self.jsreturn.Next);
	else	
		GetPrProvinces(true);	
}

function GetPrProvinces(stateprov)
{
	if (!stateprov && prProvinces.length)
		Perform(prProvinces);
	else
	{
		var object = new DMEObject(authUser.prodline, "PRPROVINCE");
		object.out = "JAVASCRIPT";
		object.field = "province;description";
		object.max = "600";
		if (stateprov)
			object.func = "DspPrprovince(true)";
		object.debug = false;
		DME(object,"jsreturn");
	}
}

function DspPrprovince(stateprov)
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
	   	index = prProvinces.length;
	    prProvinces[index] = new Object();
	   	prProvinces[index].code = self.jsreturn.record[i].province;
		if (self.jsreturn.record[i].description)
			prProvinces[index].name = self.jsreturn.record[i].description;	
		else 
			prProvinces[index].name = prProvinces[index].code;
		prProvinces[index].description = prProvinces[index].name +' - '+ prProvinces[index].code;		
	}
	if (self.jsreturn.Next != '')
		self.jsreturn.location.replace(self.jsreturn.Next);
	else if (stateprov)
	{
		prStates = prStates.concat(prProvinces);
		prStates.sort(sortByDescription);		
		Perform(prStates);
	}
	else
	{
		prProvinces.sort(sortByDescription);	
		Perform(prProvinces);	
	}
}

// Logic to retrieve reason codes by specific action.  Valid for application release 9.0.1 or newer.
function GetReasonCodes()
{	
	_RULESINDEX = self.main.document.getElementById("actionsSelect").selectedIndex - 1;
	if (reasonCodes.length)
		Perform(reasonCodes);
	else
	{	
		reasonCodes = new Array();
		var object = new DMEObject(authUser.prodline,"PAACTREAS");
		object.out = "JAVASCRIPT";
		object.index = "creset3";
		object.field = "act-reason-cd;description";
		object.key = String(authUser.company);	
		if (Rules[_RULESINDEX].ReasonCodesExist)
		{
			object.index = "creset4";
			object.key += "=" + Rules[_RULESINDEX].ActionCode;
		}	
		object.cond = "active";
		object.max = "600";
		object.debug = false;
		DME(object,"jsreturn");
	}
}

function DspPaactreas()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		index = reasonCodes.length;
		reasonCodes[index] = new Object();
		reasonCodes[index].code = self.jsreturn.record[i].act_reason_cd;
		if (self.jsreturn.record[i].description)
			reasonCodes[index].name = self.jsreturn.record[i].description;
		else 
			reasonCodes[index].name = reasonCodes[index].act_reason_cd;
		reasonCodes[index].description = reasonCodes[index].name +' - '+ reasonCodes[index].code;			
	}
	if (self.jsreturn.Next != '')
		window.open(self.jsreturn.Next,"jsreturn");
	else
	{
		reasonCodes.sort(sortByDescription);	
		Perform(reasonCodes);
	}
}

// Require an action code to be selected prior to selecting a reason code.
function validateActionCode()
{
	if (emssObjInstance.emssObj.filterSelect) 
	{
		if (NonSpace(self.main.document.getElementById("actionsSelect").value) == 0) 
		{
			setRequiredField(self.main.document.getElementById("actionsSelect"), getSeaPhrase("SELECT_PERSONNEL_ACTION","ESS"));
			return false;
		} 
		else
			clearRequiredField(self.main.document.getElementById("actionsSelect"));
	} 
	else 
	{
		if (self.main.document.getElementById("actionsSelect").selectedIndex <= 0) 
		{
			var actionsSelect = self.main.document.getElementById("actionsSelect") || null;
			setRequiredField(self.main.document.getElementById("actionsCell"), getSeaPhrase("SELECT_PERSONNEL_ACTION","ESS"), actionsSelect);
			return false;
		} 
		else
			clearRequiredField(self.main.document.getElementById("actionsCell"));
	}
	return true;
}

function Perform(dataArray)
{
	if (typeof(parent.removeWaitAlert) != "undefined")
		parent.removeWaitAlert();
	generateSelectOptions(selectID, dataArray);
}

function sortByCombinedName(obj1, obj2)
{
	var name1 = obj1.subName + obj1.name;
	var name2 = obj2.subName + obj2.name;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function sortBySubName(obj1, obj2)
{
	if (obj1.subName < obj2.subName)
		return -1;
	else if (obj1.subName > obj2.subName)
		return 1;
	else
		return 0;
}

function sortByName(obj1, obj2)
{
	if (obj1.name < obj2.name)
		return -1;
	else if (obj1.name > obj2.name)
		return 1;
	else
		return 0;
}

function sortByCode(obj1, obj2)
{
	if (obj1.code < obj2.code)
		return -1;
	else if (obj1.code > obj2.code)
		return 1;
	else
		return 0;
}

function sortByDescription(obj1, obj2)
{
	if (obj1.description < obj2.description)
		return -1;
	else if (obj1.description > obj2.description)
		return 1;
	else
		return 0;
}

//Sort "Position not filled" to bottom
function sortBySupervisorDescription(obj1, obj2)
{
	var empNbr1 = Number(obj1.employee);
	var empNbr2 = Number(obj2.employee);
	if (empNbr1 == 0 & empNbr2 != 0)
		return 1;
	else if (empNbr1 != 0 & empNbr2 == 0)
		return -1;
	else
	{
		if (obj1.description < obj2.description)
			return -1;
		else if (obj1.description > obj2.description)
			return 1;
		else
			return 0;
	}
}

/* Filter Select logic - start */
function performDmeFieldFilterOnChange(dmeFilter)
{
	switch (dmeFilter.getFieldNm().toString().toLowerCase())
	{
		case "8": // state/province
		case "42":
		case "91":
		case "117":
			var filterForm = dmeFilter.getFilterForm();
			var selObj = filterForm.elements["filterField"];
			var filterField = selObj.options[selObj.selectedIndex].value;
			if ((filterField == "state") || (filterField == "province")) 	
				filterForm.elements["filterBtn"].onclick();
		break;	
	}
}

function performDmeFieldFilterOnLoad(dmeFilter)
{
	var fieldNm = dmeFilter.getFieldNm().toString().toLowerCase();
	switch (fieldNm)
	{	
		case "0": // reason code
			// For application version 9.0.1 or newer, perform a DME to the PAACTREAS file.
			if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "09.00.01")
			{
				// Require an action code to be selected prior to selecting a reason code.
				if (NonSpace(self.main.document.getElementById("actionsSelect").value) == 0) 
				{
					setRequiredField(self.main.document.getElementById("actionsSelect"), getSeaPhrase("SELECT_PERSONNEL_ACTION","ESS"));
					return;
				} 
				else
					clearRequiredField(self.main.document.getElementById("actionsSelect"));	
				if (selectID == "reasonSelect1")
					dmeFilter.addFilterField("act-reason-cd", 10, getSeaPhrase("REASON_1","ESS"), true);
				else
					dmeFilter.addFilterField("act-reason-cd", 10, getSeaPhrase("REASON_2","ESS"), true);		
				dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
				var indexValue = "creset3";
				var keyValue = String(authUser.company);
				if (Rules.length > 0 && Rules[0].ReasonCodesExist)
				{
					indexValue = "creset4";
					keyValue += "=" + Rules[0].ActionCode;
				}
				filterDmeCall(dmeFilter,
					"jsreturn",
					"paactreas", 
					indexValue, 
					"act-reason-cd;description", 
					keyValue, 
					"active", 
					null, 
					dmeFilter.getNbrRecords(), 
					null);			
			}
			else
			{
				if (selectID == "reasonSelect1")
					dmeFilter.addFilterField("code", 10, getSeaPhrase("REASON_1","ESS"), true);
				else
					dmeFilter.addFilterField("code", 10, getSeaPhrase("REASON_2","ESS"), true);		
				dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
				filterDmeCall(dmeFilter,
					"jsreturn",
					"pcodes", 
					"pcoset1", 
					"code;description", 
					"RA", 
					"active", 
					null, 
					dmeFilter.getNbrRecords(), 
					null);		
			}
		break;	
		case "1": // action code
			dmeFilter.addFilterField("action-code", 10, getSeaPhrase("ACTION","ESS"), true);		
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			var fieldStr = "action-code;description;web-available;web-avail-supv;web-immediate;workflow-flag";
			var otmNbrRecs = null;
			if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "09.00.01")
			{
				fieldStr += ";require-reason;dft-reason;action-reason.act-reason-cd";
				otmNbrRecs = "1";
			}
			filterDmeCall(dmeFilter,
				"jsreturn",
				"persactype", 
				"patset1", 
				fieldStr, 
				String(authUser.company), 
				"web-supv-avail", 
				null, 
				dmeFilter.getNbrRecords(), 
				otmNbrRecs);		
		break;	
		case "8": // state/province
		case "42":
		case "91":
		case "117":
			dmeFilter.addFilterField("state", 2, getSeaPhrase("STATE_ONLY","ESS"), true);
			dmeFilter.addFilterField("province", 2, getSeaPhrase("PROVINCE","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prstate", 
				"psaset1", 
				"state;description", 
				"", 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;
		case "10": // country code
		case "44":
		case "92":
		case "782":
		case "783":
			dmeFilter.addFilterField("country-code", 2, getSeaPhrase("COUNTRY_ONLY","ESS"), true);		
			dmeFilter.addFilterField("country-desc", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"instctrycd", 
				"intset1", 
				"country-code;country-desc", 
				"", 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;
		case "14": // process level
			dmeFilter.addFilterField("process-level", 5, getSeaPhrase("PROCESS_LEVEL_CODE","ESS"), true);
			dmeFilter.addFilterField("name", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);		
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prsystem",
				"prsset1",
				"process-level;name",
				String(authUser.company),
				"active-pl",
				null,
				dmeFilter.getNbrRecords(),
				null);		
		break;			
		case "15": // department			
			dmeFilter.addFilterField("department", 5, getSeaPhrase("DEPARTMENT_CODE","ESS"), true);
			var index = -1;
			for (var n=0; n<Data.length; n++) 
			{
				if (Data[n].FldNbr == 14) 
				{
					index = n;
					break;
				}
			}
			var keyValue = String(authUser.company);
			var plVal;
			if (index != -1) 
			{
				var processLevelBox = self.main.document.getElementById("fieldSelect" + index);
				plVal = processLevelBox.value;					
			}		
			if ((typeof(plVal) != "undefined") && plVal && (NonSpace(plVal) > 0))
				keyValue += "=" + plVal;
			else
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
		case "16": // user level						
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
		case "17": // location						
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
		case "18": // supervisor			
		case "289": 
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
		case "19": // job code
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
		case "20": // employee status
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
		case "21": // union code					
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
		case "22": // bargaining unit					
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
		case "23": // hire source					
			dmeFilter.addFilterField("code", 10, getSeaPhrase("HIRE_SOURCE","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes", 
				"pcoset1", 
				"code;description", 
				"HS", 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);
		break;	
		case "28": // accounting unit
			dmeFilter.addFilterField("acct-unit", 15, getSeaPhrase("JOB_PROFILE_5","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"glnames", 
				"glnset1", 
				"acct-unit;description", 
				(EmpInfo.hm_dist_co) ? EmpInfo.hm_dist_co + "" : "", 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;
		case "29": // expense account
			dmeFilter.addFilterField("acct-unit", 15, getSeaPhrase("JOB_PROFILE_5","ESS"), true);
			dmeFilter.addFilterField("account", 6, getSeaPhrase("ACCOUNT","ESS"), true, true);
			dmeFilter.addFilterField("acct-desc", 60, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"glmaster", 
				"glmset2", 
				"acct-unit;account;acct-desc", 
				(EmpInfo.hm_dist_co) ? EmpInfo.hm_dist_co + "" : "", 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;
		case "30": // expense subaccount
			dmeFilter.addFilterField("acct-unit", 15, getSeaPhrase("JOB_PROFILE_5","ESS"), true);
			dmeFilter.addFilterField("account", 6, getSeaPhrase("ACCOUNT","ESS"), true, true);
			dmeFilter.addFilterField("sub-account", 4, getSeaPhrase("SUBACCOUNT","ESS"), false, true);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"glmaster", 
				"glmset2", 
				"acct-unit;account;sub-account", 
				(EmpInfo.hm_dist_co) ? EmpInfo.hm_dist_co + "" : "", 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;	
		case "31": // activity		
			dmeFilter.addFilterField("activity", 15, getSeaPhrase("ACTIVITY","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"acactivity", 
				"acvset1", 
				"activity;description", 
				"", 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;	
		case "32": // ethnicity	
			dmeFilter.addFilterField("hrctry-code", 4, getSeaPhrase("ETHNICITY","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			var workCtry = (DirectReports[_DRINDEX].WorkCountry) ? DirectReports[_DRINDEX].WorkCountry : "";
			filterDmeCall(dmeFilter,
				"jsreturn",
				"hrctrycode", 
				"ctcset1", 
				"hrctry-code;description", 
				"ET=" + workCtry, 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;
		case "140": // veteran status	
			dmeFilter.addFilterField("hrctry-code", 4, getSeaPhrase("VETERAN_STATUS","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			var workCtry = (DirectReports[_DRINDEX].WorkCountry) ? DirectReports[_DRINDEX].WorkCountry : "";
			filterDmeCall(dmeFilter,
				"jsreturn",
				"hrctrycode", 
				"ctcset1", 
				"hrctry-code;description", 
				"VS=" + workCtry, 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;
		case "879": // name prefix	
			dmeFilter.addFilterField("hrctry-code", 4, getSeaPhrase("NAME_PREFIX","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			var workCtry = (DirectReports[_DRINDEX].WorkCountry) ? DirectReports[_DRINDEX].WorkCountry : "";
			filterDmeCall(dmeFilter,
				"jsreturn",
				"hrctrycode", 
				"ctcset1", 
				"hrctry-code;description", 
				"PR=" + workCtry, 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;
		case "881": // name suffix
			dmeFilter.addFilterField("hrctry-code", 4, getSeaPhrase("DEP_39","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);	
			var workCtry = (DirectReports[_DRINDEX].WorkCountry) ? DirectReports[_DRINDEX].WorkCountry : "";
			filterDmeCall(dmeFilter,
				"jsreturn",
				"hrctrycode", 
				"ctcset1", 
				"hrctry-code;description", 
				"SU=" + workCtry, 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;			
		case "48": // work state
		case "49": // workers' comp state
		case "81": // resident state
			dmeFilter.addFilterField("tax-id-code", 10, getSeaPhrase("STATE_ONLY","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);		
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prtaxauth", 
				"prxset2", 
				"tax-id-code;description", 
				"ST", 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;
		case "84": // resident county
		case "769": // work county
			dmeFilter.addFilterField("tax-id-code", 10, getSeaPhrase("COUNTY_ONLY","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);		
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prtaxauth", 
				"prxset2", 
				"tax-id-code;description", 
				"CN", 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;	
		case "86": // resident city
		case "770": // work city
			dmeFilter.addFilterField("tax-id-code", 10, getSeaPhrase("CITY","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);		
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prtaxauth", 
				"prxset2", 
				"tax-id-code;description", 
				"CI", 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;		
		case "771": // resident school district
		case "773": // work school district
			dmeFilter.addFilterField("tax-id-code", 10, getSeaPhrase("HOME_ADDR_44","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);		
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prtaxauth", 
				"prxset2", 
				"tax-id-code;description", 
				"SD", 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);				
		break;		
		case "46": // mail group					
			dmeFilter.addFilterField("code", 10, getSeaPhrase("MAIL_GROUP","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes", 
				"pcoset1", 
				"code;description", 
				"MG", 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);
		break;	
		case "54": // badge code					
			dmeFilter.addFilterField("code", 10, getSeaPhrase("BADGE_CODE","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes", 
				"pcoset1", 
				"code;description", 
				"SC", 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);
		break;
		case "93": // eligibility status					
			dmeFilter.addFilterField("code", 10, getSeaPhrase("STATUS","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes", 
				"pcoset1", 
				"code;description", 
				"WE", 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);
		break;
		case "98": // document 1 description					
			dmeFilter.addFilterField("code", 10, getSeaPhrase("DOCUMENT_1","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes", 
				"pcoset1", 
				"code;description", 
				"DO", 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);
		break;
		case "99": // document 1 type					
			dmeFilter.addFilterField("code", 10, getSeaPhrase("DOCUMENT_1","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes", 
				"pcoset1", 
				"code;description", 
				"DT", 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);
		break;		
		case "102": // document 2 description					
			dmeFilter.addFilterField("code", 10, getSeaPhrase("DOCUMENT_2","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes", 
				"pcoset1", 
				"code;description", 
				"DO", 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);
		break;
		case "103": // document 2 type					
			dmeFilter.addFilterField("code", 10, getSeaPhrase("DOCUMENT_2","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes", 
				"pcoset1", 
				"code;description", 
				"DT", 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);
		break;		
		case "141": // primary physician					
			dmeFilter.addFilterField("code", 10, getSeaPhrase("PRIMARY_CARE_PHYSICIAN","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes", 
				"pcoset1", 
				"code;description", 
				"PC", 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);
		break;
		case "888": // religion				
			dmeFilter.addFilterField("code", 10, getSeaPhrase("RELIGION","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes", 
				"pcoset1", 
				"code;description", 
				"RE", 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);
		break;		
		case "889": // disability type
			dmeFilter.addFilterField("code", 10, getSeaPhrase("DISABILITY","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes", 
				"pcoset1", 
				"code;description", 
				"DI", 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;	
		case "106": // pay plan
			dmeFilter.addFilterField("plan-code", 4, getSeaPhrase("PLAN","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"provertime", 
				"proset2", 
				"plan-code;description;effect-date", 
				String(authUser.company), 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;
		case "126": // position
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
		case "134": // pay step
			var keyValue = String(authUser.company);
			var selectValue = "effect-date<=" + ymdtoday;
			var index = -1;
			for (var n=0; n<Data.length; n++) 
			{
				if (Data[n].FldNbr == 136) 
				{
					index = n;
					break;
				}
			}
			var indicatorValue = null;
			var schedBox;
			var tmpVal;
			var scheduleExists = false;
			if (index != -1) 
			{
				schedBox = self.main.document.getElementById("fieldSelect" + index);
				tmpVal = schedBox.value;
				if (NonSpace(tmpVal) && (tmpVal != "DME_RETURNED")) 
				{
					scheduleExists = true;
					keyValue += "=" + tmpVal;
					schedBox = self.main.document.getElementById("fieldSelect" + index + "_effectdate");
					tmpVal = schedBox.value;
					if (NonSpace(tmpVal)) 
					{
						keyValue += "=" + formjsDate(formatDME(tmpVal));
						selectValue = null;
					}
				}
				schedBox = self.main.document.getElementById("fieldSelect" + index + "_indicator");
				tmpVal = schedBox.value;
				if (NonSpace(tmpVal))
					indicatorValue = tmpVal;
			}
			dmeFilter.addFilterField("pay-step", 3, getSeaPhrase("PAY_STEP","ESS"), false, true);	
			if (!scheduleExists)
				dmeFilter.addFilterField("schedule", 9, getSeaPhrase("PAY_SCHEDULE","ESS"), true);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prsagdtl", 
				"sgdset1", 
				"schedule;pay-step;effect-date", 
				keyValue, 
				null, 
				selectValue, 
				dmeFilter.getNbrRecords(), 
				null);
		break;		
		case "135": // pay grade	
			var keyValue = String(authUser.company);
			var selectValue = "effect-date<=" + ymdtoday;
			var index = -1;
			for (var n=0; n<Data.length; n++) 
			{
				if (Data[n].FldNbr == 136) 
				{
					index = n;
					break;
				}
			}
			var indicatorValue = null;
			var schedBox;
			var tmpVal;
			var scheduleExists = false;
			if (index != -1) 
			{
				schedBox = self.main.document.getElementById("fieldSelect" + index);
				tmpVal = schedBox.value;
				if (NonSpace(tmpVal) && (tmpVal != "DME_RETURNED")) 
				{
					var scheduleExists = true;
					keyValue += "=" + tmpVal;
					schedBox = self.main.document.getElementById("fieldSelect" + index + "_effectdate");
					tmpVal = schedBox.value;
					if (NonSpace(tmpVal)) {
						keyValue += "=" + formjsDate(formatDME(tmpVal));
						selectValue = null;
					}
				}
				schedBox = self.main.document.getElementById("fieldSelect" + index + "_indicator");
				tmpVal = schedBox.value;
				if (NonSpace(tmpVal))
					indicatorValue = tmpVal;				
			}
			dmeFilter.addFilterField("pay-grade", 3, getSeaPhrase("PAY_GRADE","ESS"), false);
			if (!scheduleExists)
				dmeFilter.addFilterField("schedule", 9, getSeaPhrase("PAY_SCHEDULE","ESS"), true);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prsagdtl", 
				"sgdset1", 
				"schedule;pay-grade;effect-date", 
				keyValue, 
				null, 
				selectValue, 
				dmeFilter.getNbrRecords(), 
				null);
		break;		
		case "136": // schedule
			dmeFilter.addFilterField("schedule", 9, getSeaPhrase("PAY_SCHEDULE","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);	
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prsaghead", 
				"sghset2", 
				"schedule;indicator;description;effect-date", 
				String(authUser.company), 
				null, 
				"effect-date<=" + ymdtoday, 
				dmeFilter.getNbrRecords(), 
				null);
		break;	
		case "165": // account category
			dmeFilter.addFilterField("acct-category", 5, getSeaPhrase("ACCOUNT_CATEGORY","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);	
			filterDmeCall(dmeFilter,
				"jsreturn",
				"acacctcat", 
				"aaxset1", 
				"acct-category;description", 
				"", 
				null, 
				"", 
				dmeFilter.getNbrRecords(), 
				null);		
		break;
		case "293": // work schedule		
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
		case "789": // currency
		case "898":
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
		case "595": // province
		case "1509":
			dmeFilter.addFilterField("province", 10, getSeaPhrase("PROVINCE","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prprovince", 
				"ppvset1", 
				"province;description", 
				"", 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;
		case "594": // business number group
			dmeFilter.addFilterField("process-level", 5, getSeaPhrase("JOB_PROFILE_3","ESS"), true);
			dmeFilter.addFilterField("bus-nbr-grp", 4, getSeaPhrase("BUS_NBR_GROUP","ESS"), true);
			dmeFilter.addFilterField("bus-nbr", 15, getSeaPhrase("BUS_NBR","ESS"), true);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prbusgrp", 
				"pbgset1", 
				"process-level;bus-nbr-grp;bus-nbr", 
				String(authUser.company), 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;
		case "1520": // qc enterprise number group
			dmeFilter.addFilterField("process-level", 5, getSeaPhrase("JOB_PROFILE_3","ESS"), true);
			dmeFilter.addFilterField("qc-ent-nbr-grp", 4, getSeaPhrase("ENT_NBR_GROUP","ESS"), true);
			dmeFilter.addFilterField("qc-ent-nbr", 16, getSeaPhrase("ENT_NBR","ESS"), true);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prqcentgrp", 
				"pqcset1",
				"process-level;qc-ent-nbr-grp;qc-ent-nbr", 
				String(authUser.company), 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);
		break;		
		default:
			var fldObj = getDmeFieldElement(fieldNm);
			var fldElm = fldObj[1];
			if (fldElm && fldElm.getAttribute("userfld") == "true")
			{
				dmeFilter.addFilterField("code", 10, getSeaPhrase("VALUE","ESS"), true);	
				dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
				filterDmeCall(dmeFilter,
					"jsreturn",
					"pcodes", 
					"pcoset1", 
					"code;description", 
					fldElm.getAttribute("fieldnm"), 
					"active", 
					null, 
					dmeFilter.getNbrRecords(), 
					null);				
			}	
		break;
	}
}

function performDmeFieldFilter(dmeFilter)
{
	var fieldNm = dmeFilter.getFieldNm().toString().toLowerCase();
	switch (fieldNm)
	{
		case "0": // reason code
		// For application version 9.0.1 or newer, perform a DME to the PAACTREAS file.
		if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "09.00.01")
		{
			var indexValue = "creset3";
			var keyValue = String(authUser.company);
			if (Rules.length > 0 && Rules[0].ReasonCodesExist)
			{
				indexValue = "creset4";
				keyValue += "=" + Rules[0].ActionCode;
			}	
			filterDmeCall(dmeFilter,
				"jsreturn",
				"paactreas", 
				indexValue, 
				"act-reason-cd;description", 
				keyValue, 
				"active", 
				dmeFilter.getSelectStr(), 
				dmeFilter.getNbrRecords(), 
				null);			
		}
		else
		{
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes", 
				"pcoset1", 
				"code;description", 
				"RA", 
				"active", 
				dmeFilter.getSelectStr(), 
				dmeFilter.getNbrRecords(), 
				null);		
		}
		break;	
		case "1": // action code
		var fieldStr = "action-code;description;web-available;web-avail-supv;web-immediate;workflow-flag";
		var otmNbrRecs = null;
		if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "09.00.01")
		{
			fieldStr += ";require-reason;dft-reason;action-reason.act-reason-cd";
			otmNbrRecs = "1";
		}		
		filterDmeCall(dmeFilter,
			"jsreturn",
			"persactype", 
			"patset1", 
			fieldStr, 
			String(authUser.company), 
			"web-supv-avail", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			otmNbrRecs);		
		break;	
		case "8": // state/province
		case "42":
		case "91":
		case "117":
		if (stateProvFilter == "state") 
		{	
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prstate", 
				"psaset1", 
				"state;description", 
				"", 
				null, 
				dmeFilter.getSelectStr(), 
				dmeFilter.getNbrRecords(), 
				null);
		} 
		else 
		{
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prprovince", 
				"ppvset1", 
				"province;description", 
				"", 
				null, 
				dmeFilter.getSelectStr(), 
				dmeFilter.getNbrRecords(), 
				null);		
		}
		break;		
		case "10": // country code
		case "44":
		case "92":
		case "782":
		case "783":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"instctrycd", 
			"intset1", 
			"country-code;country-desc", 
			"", 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;	
		case "14": // process level
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prsystem",
			"prsset1",
			"process-level;name",
			String(authUser.company),
			"active-pl",
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);		
		break;	
		case "15": // department
		var index = -1;
		for (var n=0; n<Data.length; n++) 
		{
			if (Data[n].FldNbr == 14) 
			{
				index = n;
				break;
			}
		}
		var keyValue = String(authUser.company);
		var plVal;
		if (index != -1) 
		{
			var processLevelBox = self.main.document.getElementById("fieldSelect" + index);
			plVal = processLevelBox.value;			
			if ((typeof(plVal) != "undefined") && plVal && (NonSpace(plVal) > 0))
				keyValue += "=" + plVal;
		}				
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
		case "16": // user level						
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
		case "17": // location						
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
		case "18": // supervisor
		case "289":
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
		case "19": // job code
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
		case "20": // employee status
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
		case "21": // union code					
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
		case "22": // bargaining unit					
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
		case "23": // hire source					
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes", 
			"pcoset1", 
			"code;description", 
			"HS", 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);
		break;	
		case "28": // accounting unit
		filterDmeCall(dmeFilter,
			"jsreturn",
			"glnames", 
			"glnset1", 
			"acct-unit;description", 
			(EmpInfo.hm_dist_co) ? EmpInfo.hm_dist_co + "" : "", 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;
		case "29": // expense account
		filterDmeCall(dmeFilter,
			"jsreturn",
			"glmaster", 
			"glmset2", 
			"acct-unit;account;acct-desc", 
			(EmpInfo.hm_dist_co) ? EmpInfo.hm_dist_co + "" : "", 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;	
		case "30": // expense subaccount
		filterDmeCall(dmeFilter,
			"jsreturn",
			"glmaster", 
			"glmset2", 
			"acct-unit;account;sub-account", 
			(EmpInfo.hm_dist_co) ? EmpInfo.hm_dist_co + "" : "", 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;	
		case "31": // activity		
		filterDmeCall(dmeFilter,
			"jsreturn",
			"acactivity", 
			"acvset1", 
			"activity;description", 
			"", 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;	
		case "32": // ethnicity	
		var workCtry = (DirectReports[_DRINDEX].WorkCountry) ? DirectReports[_DRINDEX].WorkCountry : "";	
		filterDmeCall(dmeFilter,
			"jsreturn",
			"hrctrycode", 
			"ctcset1", 
			"hrctry-code;description", 
			"ET=" + workCtry, 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;	
		case "140": // veteran status
		var workCtry = (DirectReports[_DRINDEX].WorkCountry) ? DirectReports[_DRINDEX].WorkCountry : "";	
		filterDmeCall(dmeFilter,
			"jsreturn",
			"hrctrycode", 
			"ctcset1", 
			"hrctry-code;description", 
			"VS=" + workCtry, 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;
		case "879": // name prefix
		var workCtry = (DirectReports[_DRINDEX].WorkCountry) ? DirectReports[_DRINDEX].WorkCountry : "";	
		filterDmeCall(dmeFilter,
			"jsreturn",
			"hrctrycode", 
			"ctcset1", 
			"hrctry-code;description", 
			"PR=" + workCtry, 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;
		case "881": // name suffix
		var workCtry = (DirectReports[_DRINDEX].WorkCountry) ? DirectReports[_DRINDEX].WorkCountry : "";	
		filterDmeCall(dmeFilter,
			"jsreturn",
			"hrctrycode", 
			"ctcset1", 
			"hrctry-code;description", 
			"SU=" + workCtry, 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;
		case "48": // work state
		case "49": // workers' comp state
		case "81": // resident state
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prtaxauth", 
			"prxset2", 
			"tax-id-code;description", 
			"ST", 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;
		case "84": // resident county
		case "769": // work county
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prtaxauth", 
			"prxset2", 
			"tax-id-code;description", 
			"CN", 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;	
		case "86": // resident city
		case "770": // work city
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prtaxauth", 
			"prxset2", 
			"tax-id-code;description", 
			"CI", 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;	
		case "771": // resident school district
		case "773": // work school district
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prtaxauth", 
			"prxset2", 
			"tax-id-code;description", 
			"SD", 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);				
		break;		
		case "46": // mail group					
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes", 
			"pcoset1", 
			"code;description", 
			"MG", 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);
		break;	
		case "54": // badge code					
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes", 
			"pcoset1", 
			"code;description", 
			"SC", 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);
		break;
		case "93": // eligibility status					
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes", 
			"pcoset1", 
			"code;description", 
			"WE", 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);
		break;
		case "98": // document 1 description					
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes", 
			"pcoset1", 
			"code;description", 
			"DO", 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);
		break;
		case "99": // document 1 type					
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes", 
			"pcoset1", 
			"code;description", 
			"DT", 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);
		break;		
		case "102": // document 2 description					
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes", 
			"pcoset1", 
			"code;description", 
			"DO", 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);
		break;
		case "103": // document 2 type					
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes", 
			"pcoset1", 
			"code;description", 
			"DT", 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);
		break;		
		case "141": // primary physician					
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes", 
			"pcoset1", 
			"code;description", 
			"PC", 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);
		break;
		case "888": // religion				
		filterDmeCall(dmeFilter, 
			"jsreturn", 
			"pcodes", 
			"pcoset1", 
			"code;description", 
			"RE", 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);
		break;		
		case "889": // disability type
		filterDmeCall(dmeFilter, 
			"jsreturn", 
			"pcodes", 
			"pcoset1", 
			"code;description", 
			"DI", 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;	
		case "106": // pay plan
		filterDmeCall(dmeFilter,
			"jsreturn",
			"provertime", 
			"proset2", 
			"plan-code;description;effect-date", 
			String(authUser.company), 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;		
		case "126": // position
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
		case "134": // pay step
		var keyValue = String(authUser.company);
		var selectValue = "effect-date<=" + ymdtoday;
		if (dmeFilter.getSelectStr() != null)
			selectValue += "&" + dmeFilter.getSelectStr();
		var index = -1;
		for (var n=0; n<Data.length; n++) 
		{
			if (Data[n].FldNbr == 136) 
			{
				index = n;
				break;
			}
		}
		var indicatorValue = null;
		var schedBox;
		var tmpVal;
		if (index != -1) 
		{
			schedBox = self.main.document.getElementById("fieldSelect" + index);
			tmpVal = schedBox.value;
			if (NonSpace(tmpVal) && (tmpVal != "DME_RETURNED")) 
			{
				keyValue += "=" + tmpVal;
				schedBox = self.main.document.getElementById("fieldSelect" + index + "_effectdate");
				tmpVal = schedBox.value;
				if (NonSpace(tmpVal)) 
				{
					keyValue += "=" + formjsDate(formatDME(tmpVal));
					selectValue = dmeFilter.getSelectStr();
				}
			}
			schedBox = self.main.document.getElementById("fieldSelect" + index + "_indicator");
			tmpVal = schedBox.value;
			if (NonSpace(tmpVal))
				indicatorValue = tmpVal;
		}
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prsagdtl", 
			"sgdset1", 
			"schedule;pay-step;effect-date", 
			keyValue, 
			null, 
			selectValue, 
			dmeFilter.getNbrRecords(), 
			null);
		break;		
		case "135": // pay grade
		var keyValue = String(authUser.company);
		var selectValue = "effect-date<=" + ymdtoday;
		if (dmeFilter.getSelectStr() != null)
			selectValue += "&" + dmeFilter.getSelectStr();
		var index = -1;
		for (var n=0; n<Data.length; n++) 
		{
			if (Data[n].FldNbr == 136) 
			{
				index = n;
				break;
			}
		}
		var indicatorValue = null;
		var schedBox;
		var tmpVal;
		if (index != -1) 
		{
			schedBox = self.main.document.getElementById("fieldSelect" + index);
			tmpVal = schedBox.value;
			if (NonSpace(tmpVal) && (tmpVal != "DME_RETURNED")) 
			{
				keyValue += "=" + tmpVal;
				schedBox = self.main.document.getElementById("fieldSelect" + index + "_effectdate");
				tmpVal = schedBox.value;
				if (NonSpace(tmpVal)) 
				{
					keyValue += "=" + formjsDate(formatDME(tmpVal));
					selectValue = dmeFilter.getSelectStr();
				}
			}
			schedBox = self.main.document.getElementById("fieldSelect" + index + "_indicator");
			tmpVal = schedBox.value;
			if (NonSpace(tmpVal))
				indicatorValue = tmpVal;
		}
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prsagdtl", 
			"sgdset1", 
			"schedule;pay-grade;effect-date", 
			keyValue, 
			null, 
			selectValue, 
			dmeFilter.getNbrRecords(), 
			null);
		break;		
		case "136": // schedule	
		var selectValue = "effect-date<=" + ymdtoday;
		if (dmeFilter.getSelectStr() != null)
			selectValue += "&" + dmeFilter.getSelectStr();
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prsaghead", 
			"sghset2", 
			"schedule;indicator;description;effect-date", 
			String(authUser.company), 
			null, 
			selectValue, 
			dmeFilter.getNbrRecords(), 
			null);
		break;	
		case "165": // account category
		filterDmeCall(dmeFilter,
			"jsreturn",
			"acacctcat", 
			"aaxset1", 
			"acct-category;description", 
			"", 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;		
		case "293": // work schedule		
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
		case "789": // currency
		case "898":
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
		case "595": // province
		case "1509":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prprovince", 
			"ppvset1", 
			"province;description", 
			"", 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;		
		case "594": // business number group
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prbusgrp", 
			"pbgset1", 
			"process-level;bus-nbr-grp;bus-nbr", 
			String(authUser.company), 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;		
		case "1520": // qc enterprise number group
		filterDmeCall(dmeFilter,
			"jsreturn",
			"prqcentgrp", 
			"pqcset1", 
			//PT 159758
			"process-level;qc-ent-nbr-grp;qc-ent-nbr", 
			String(authUser.company), 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);
		break;		
		default:
			var fldObj = getDmeFieldElement(fieldNm);
			var fldElm = fldObj[1];
			if (fldElm && fldElm.getAttribute("userfld") == "true")
			{
				filterDmeCall(dmeFilter,
					"jsreturn",
					"pcodes", 
					"pcoset1",
					"code;description", 
					fldElm.getAttribute("fieldnm"), 
					null, 
					dmeFilter.getSelectStr(), 
					dmeFilter.getNbrRecords(), 
					null);			
			}			
		break;
	}
}

function validateDmeFieldFilter(dmeFilter, filterForm)
{
	var selObj = filterForm.elements["filterField"];
	var filterField = selObj.options[selObj.selectedIndex];
	var keywords = filterForm.elements["keywords"].value;
	if (filterField.getAttribute("isNumeric") == "true") 
	{
		dmeFilter.getWindow().clearRequiredField(filterForm.elements["keywords"]);
		if (ValidNumber(filterForm.elements["keywords"], filterField.getAttribute("fieldSize"), 0) == false) 
		{
			dmeFilter.getWindow().setRequiredField(filterForm.elements["keywords"], getSeaPhrase("INVALID_NO","ESS"));
			return false;	
		}
	}
	return true;
}

function dmeFieldRecordSelected(recIndex, fieldNm)
{
	var selRec = self.jsreturn.record[recIndex];
	var formElm = self.main.document.getElementById(selectID);
	var formDescElm;
	switch (fieldNm.toString().toLowerCase())
	{
		case "0": // reason code	
			if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "09.00.01")
				formElm.value = selRec.act_reason_cd;
			else
				formElm.value = selRec.code;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.description; } catch(e) {}
			break;
		case "1": // action code	
			formElm.value = selRec.action_code;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.description; } catch(e) {}
			if (Rules.length > 0 && selRec.action_code != Rules[_RULESINDEX])
				startOver();
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
			}					
			break;	
		case "8": // state/province
		case "42":
		case "91":
		case "117":
			if (stateProvFilter == "state")
				formElm.value = selRec.state;
			else
				formElm.value = selRec.province;		
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.description; } catch(e) {}			
			break;			
		case "10": // country code
		case "44":
		case "92":
		case "782":
		case "783":
			formElm.value = selRec.country_code;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.country_desc; } catch(e) {}
			break;
		case "14": // process level
			formElm.value = selRec.process_level;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.name; } catch(e) {}			
			break;
		case "15": // department
			formElm.value = selRec.department;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.name; } catch(e) {}			
			break;			
		case "16": // user level						
		case "17": // location	
		case "18": // supervisor
		case "289": 
			formElm.value = selRec.code;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.description; } catch(e) {}			
			break;
		case "19": // job code
			formElm.value = selRec.job_code;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.description; } catch(e) {}			
			break;
		case "20": // employee status
			formElm.value = selRec.emp_status;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.description; } catch(e) {}			
			break;
		case "21": // union code						
		case "22": // bargaining unit					
		case "23": // hire source
		case "46": // mail group						
		case "54": // badge code					
		case "93": // eligibility status					
		case "98": // document 1 description					
		case "99": // document 1 type							
		case "102": // document 2 description					
		case "103": // document 2 type							
		case "141": // primary physician					
		case "888": // religion				
		case "889": // disability type
			formElm.value = selRec.code;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.description; } catch(e) {}
			break;	
		case "28": // accounting unit
			formElm.value = selRec.acct_unit;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.description; } catch(e) {}
			break;	
		case "29": // expense account
			formElm.value = selRec.account;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.acct_desc; } catch(e) {}
			break;
		case "30": // expense subaccount
			formElm.value = selRec.sub_account;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.sub_account; } catch(e) {}
			break;	
		case "31": // activity
			formElm.value = selRec.activity;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.description; } catch(e) {}
			break;	
		case "32": // ethnicity
		case "140": // veteran status
		case "879": // name prefix
		case "881": // name suffix
			formElm.value = selRec.hrctry_code;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.description; } catch(e) {}
			break;
		case "48": // work state
		case "49": // workers' comp state
		case "81": // resident state
		case "84": // resident county
		case "769": // work county
		case "86": // resident city
		case "770": // work city
		case "771": // resident school district
		case "773": // work school district		
			formElm.value = selRec.tax_id_code;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.description; } catch(e) {}
			break;	
		case "106": // pay plan
			formElm.value = selRec.plan_code;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.description; } catch(e) {}				
			break;		
		case "126": // position
			formElm.value = selRec.position;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.description; } catch(e) {}
			break;
		case "134": // pay step
			formElm.value = selRec.pay_step;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.pay_step; } catch(e) {}
			break;	
		case "135": // pay grade
			formElm.value = selRec.pay_grade;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.pay_grade; } catch(e) {}
			break;			
		case "136": // schedule	
			formElm.value = selRec.schedule;
			var formElm2 = self.main.document.getElementById(selectID + "_indicator");
			formElm2.value = selRec.indicator;
			var formElm3 = self.main.document.getElementById(selectID + "_effectdate");
			formElm3.value = selRec.effect_date;			
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.description; } catch(e) {}
			break;	
		case "165": // account category
			formElm.value = selRec.acct_category;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.description; } catch(e) {}				
			break;
		case "293": // work schedule	
			formElm.value = selRec.work_sched;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.description; } catch(e) {}					
			break;
		case "789": // currency
		case "898":
			formElm.value = selRec.currency_code;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.description; } catch(e) {}						
			break;	
		case "595": // province
		case "1509":
			formElm.value = selRec.province;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.description; } catch(e) {}					
			break;	
		case "594": // business number group
			formElm.value = selRec.bus_nbr_grp;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.bus_nbr_grp; } catch(e) {}		
			break;	
		case "1520": // qc enterprise number group
			formElm.value = selRec.qc_ent_nbr_grp;
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.qc_ent_nbr_grp; } catch(e) {}		
			break;			
		default:
			if (formElm.getAttribute("userfld") == "true")
			{
				formElm.value = selRec.code;
				try { self.main.document.getElementById("xlt_"+selectID).innerHTML = selRec.description; } catch(e) {}							
			}			
			break;
	}
	try { filterWin.close(); } catch(e) {}
	try { formElm.focus(); } catch(e) {}
}

function getDmeFieldElement(fieldNm)
{
	var formElm = self.main.document.getElementById(selectID);
	var fld = [self.main, formElm, null];
	try
	{
		switch (fieldNm.toString().toLowerCase())
		{
			case "0": fld[2] = (selectID == "reasonSelect1") ? getSeaPhrase("REASON_1","ESS") : getSeaPhrase("REASON_2","ESS"); break;
			case "1": fld[2] = getSeaPhrase("ACTION","ESS"); break;
			case "8": 
			case "42":
			case "91":
			case "117":	fld[2] = getSeaPhrase("STATE_ONLY","ESS"); break;
			case "10": 
			case "44":
			case "92":
			case "782":	
			case "783": fld[2] = getSeaPhrase("COUNTRY_ONLY","ESS"); break;
			case "14": fld[2] = getSeaPhrase("PROCESS_LEVEL_CODE","ESS"); break;
			case "15": fld[2] = getSeaPhrase("DEPARTMENT_CODE","ESS"); break;
			case "16": fld[2] = getSeaPhrase("USER_LEVEL","ESS"); break;
			case "17": fld[2] = getSeaPhrase("JOB_PROFILE_6","ESS"); break;
			case "18": 
			case "289":	fld[2] = getSeaPhrase("JOB_PROFILE_7","ESS"); break;
			case "19": fld[2] = getSeaPhrase("JOB_OPENINGS_6","ESS"); break;
			case "20": fld[2] = getSeaPhrase("EMPLOYEE_STATUS","ESS"); break;
			case "21": fld[2] = getSeaPhrase("JOB_PROFILE_10","ESS"); break;
			case "22": fld[2] = getSeaPhrase("BARGAINING_UNIT","ESS"); break;
			case "23": fld[2] = getSeaPhrase("HIRE_SOURCE","ESS"); break;
			case "28": fld[2] = getSeaPhrase("JOB_PROFILE_5","ESS"); break;
			case "29": fld[2] = getSeaPhrase("ACCOUNT","ESS"); break;
			case "30": fld[2] = getSeaPhrase("SUBACCOUNT","ESS"); break;
			case "31": fld[2] = getSeaPhrase("ACTIVITY","ESS"); break;
			case "32": fld[2] = getSeaPhrase("ETHNICITY","ESS"); break;
			case "140": fld[2] = getSeaPhrase("VETERAN_STATUS","ESS"); break;
			case "879": fld[2] = getSeaPhrase("NAME_PREFIX","ESS"); break;
			case "881": fld[2] = getSeaPhrase("DEP_39","ESS"); break;
			case "48":
			case "49":
			case "81": fld[2] = getSeaPhrase("STATE_ONLY","ESS"); break;
			case "84": 
			case "769":	fld[2] = getSeaPhrase("COUNTY_ONLY","ESS"); break;
			case "86": 
			case "770":	fld[2] = getSeaPhrase("CITY","ESS"); break;
			case "771": 
			case "773": fld[2] = getSeaPhrase("HOME_ADDR_44","ESS"); break;
			case "46": fld[2] = getSeaPhrase("MAIL_GROUP","ESS"); break;
			case "54": fld[2] = getSeaPhrase("BADGE_CODE","ESS"); break;
			case "93": fld[2] = getSeaPhrase("STATUS","ESS"); break;
			case "98": 
			case "99": fld[2] = getSeaPhrase("DOCUMENT_1","ESS"); break;
			case "102": 
			case "103": fld[2] = getSeaPhrase("DOCUMENT_2","ESS"); break;		
			case "141": fld[2] = getSeaPhrase("PRIMARY_CARE_PHYSICIAN","ESS"); break;
			case "888": fld[2] = getSeaPhrase("RELIGION","ESS"); break;
			case "889": fld[2] = getSeaPhrase("DISABILITY","ESS"); break;
			case "106": fld[2] = getSeaPhrase("PLAN","ESS"); break;
			case "126": fld[2] = getSeaPhrase("JOB_PROFILE_8","ESS"); break;	
			case "134": fld[2] = getSeaPhrase("PAY_STEP","ESS"); break;
			case "135": fld[2] = getSeaPhrase("PAY_GRADE","ESS"); break;
			case "136": fld[2] = getSeaPhrase("PAY_SCHEDULE","ESS"); break;
			case "165": fld[2] = getSeaPhrase("ACCOUNT_CATEGORY","ESS"); break;
			case "293": fld[2] = getSeaPhrase("WORK_SCHEDULE","ESS"); break;
			case "789": 
			case "898":	fld[2] = getSeaPhrase("QUAL_16","ESS"); break;
			case "595": 
			case "1509": fld[2] = getSeaPhrase("PROVINCE","ESS"); break;
			case "594": fld[2] = getSeaPhrase("BUS_NBR_GROUP","ESS"); break;
			case "1520": fld[2] = getSeaPhrase("ENT_NBR_GROUP","ESS"); break;
			default: 
				if (formElm.getAttribute("userfld") == "true")
				{
					var digitIdx = selectID.search(/\d/);
					if (digitIdx != -1)
					{
						var n = Number(selectID.substring(digitIdx,selectID.length));
						fld[2] = Data[n].Field;
					}
				}	
				break;
		}	
	}
	catch(e) {}
	return fld;
}

function dmeFieldKeyUpHandler(fieldNm)
{
	var formElm = self.main.document.getElementById(selectID);
	switch (fieldNm.toString().toLowerCase())
	{
		case "136":
			self.main.document.getElementById(selectID+"_indicator").value = "";
			self.main.document.getElementById(selectID+"_effectdate").value = "";
			self.main.document.getElementById("xlt_"+selectID).innerHTML = "";	
			break;
		default: 
			try { self.main.document.getElementById("xlt_"+selectID).innerHTML = ""; } catch(e) {}
			break;
	}
}

function drawDmeFieldFilterContent(dmeFilter)
{
	var selectHtml = new Array();
	var dmeRecs = self.jsreturn.record;
	var nbrDmeRecs = dmeRecs.length;
	var fieldNm = dmeFilter.getFieldNm().toString().toLowerCase();
	var fldObj = getDmeFieldElement(fieldNm);
	var fldElm = fldObj[1];	
	var fldDesc = fldObj[2];	
	switch (fieldNm)
	{
		case "2072": // Eliglble for rehire
			setRequiredField(self.main.document.getElementById("fieldSelect" + index));
		break;
		case "0": // reason code
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			if (selectID == "reasonSelect1")
				selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("REASON_1","ESS")+'</th>'
			else
				selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("REASON_2","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "09.00.01")
			{
				for (var i=0; i<nbrDmeRecs; i++) 
				{
					tmpObj = dmeRecs[i];		
					selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
					selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
					selectHtml[i+1] += (tmpObj.act_reason_cd) ? tmpObj.act_reason_cd : '&nbsp;'
					selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
					selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
					selectHtml[i+1] += '</a></td></tr>'
				}			
			}
			else
			{
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
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;	
		case "1": // action code
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("ACTION","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.action_code) ? tmpObj.action_code : '&nbsp;'
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
		case "8": // state/province
		case "42":
		case "91":
		case "117":		
			if (stateProvFilter == "state") 
			{			
				var tmpObj;
				selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'		
				selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
				selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("STATE_ONLY","ESS")+'</th>'
				selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
				for (var i=0; i<nbrDmeRecs; i++) 
				{
					tmpObj = dmeRecs[i];		
					selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
					selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
					selectHtml[i+1] += (tmpObj.state) ? tmpObj.state : '&nbsp;'
					selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
					selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
					selectHtml[i+1] += '</a></td></tr>'
				}
			} 
			else 
			{
				var tmpObj;
				selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'		
				selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
				selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("PROVINCE","ESS")+'</th>'
				selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
				for (var i=0; i<nbrDmeRecs; i++) 
				{
					tmpObj = dmeRecs[i];		
					selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
					selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
					selectHtml[i+1] += (tmpObj.province) ? tmpObj.province : '&nbsp;'
					selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
					selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
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
		case "10": // country code
		case "44":
		case "92":
		case "782":
		case "783":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("COUNTRY_ONLY","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.country_code) ? tmpObj.country_code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.country_desc) ? tmpObj.country_desc : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'			
			break;	
		case "14": // process level
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
		case "15": // department
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
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.name) ? tmpObj.name : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="3" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;		
		case "16": // user level
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
		case "17": // location	
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
		case "18": // supervisor
		case "289":
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
		case "19": // job code
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
		case "20": // employee status
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
		case "21": // union code
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
		case "22": // bargaining unit					
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
		case "23": // hire source						
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("HIRE_SOURCE","ESS")+'</th>'
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
		case "28": // accounting unit
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("JOB_PROFILE_5","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.acct_unit) ? tmpObj.acct_unit : '&nbsp;'
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
		case "29": // expense account
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:33%">'+getSeaPhrase("JOB_PROFILE_5","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("ACCOUNT","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.acct_unit) ? tmpObj.acct_unit : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.account) ? tmpObj.account : '&nbsp;'				
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'				
				selectHtml[i+1] += (tmpObj.acct_desc) ? tmpObj.acct_desc : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="3" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'		
			break;
		case "30": // expense subaccount
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:33%">'+getSeaPhrase("JOB_PROFILE_5","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("ACCOUNT","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("SUBACCOUNT","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.acct_unit) ? tmpObj.acct_unit : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.account) ? tmpObj.account : '&nbsp;'				
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'				
				selectHtml[i+1] += (tmpObj.sub_account) ? tmpObj.sub_account : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="3" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'		
			break;	
		case "31": // activity
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("ACTIVITY","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '</td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.activity) ? tmpObj.activity : '&nbsp;'				
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
		case "32": // ethnicity						
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("ETHNICITY","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.hrctry_code) ? tmpObj.hrctry_code : '&nbsp;'
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
		case "140": // veteran status						
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("VETERAN_STATUS","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.hrctry_code) ? tmpObj.hrctry_code : '&nbsp;'
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
		case "879": // name prefix						
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("NAME_PREFIX","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.hrctry_code) ? tmpObj.hrctry_code : '&nbsp;'
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
		case "881": // name suffix						
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("DEP_39","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.hrctry_code) ? tmpObj.hrctry_code : '&nbsp;'
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
		case "48": // work state
		case "49": // workers' comp state
		case "81": // resident state
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("STATE_ONLY","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.tax_id_code) ? tmpObj.tax_id_code : '&nbsp;'
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
		case "84": // resident county
		case "769": // work county
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("COUNTY_ONLY","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.tax_id_code) ? tmpObj.tax_id_code : '&nbsp;'
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
		case "86": // resident city
		case "770": // work city
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("CITY","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.tax_id_code) ? tmpObj.tax_id_code : '&nbsp;'
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
		case "771": // resident school district
		case "773": // work school district
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("HOME_ADDR_44","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.tax_id_code) ? tmpObj.tax_id_code : '&nbsp;'
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
		case "46": // mail group						
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("MAIL_GROUP","ESS")+'</th>'
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
		case "54": // badge code
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("BADGE_CODE","ESS")+'</th>'
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
		case "93": // eligibility status					
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
		case "98": // document 1 description					
		case "99": // document 1 type			
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("DOCUMENT_1","ESS")+'</th>'
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
		case "102": // document 2 description		
		case "103": // document 2 type	
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("DOCUMENT_2","ESS")+'</th>'
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
		case "141": // primary physician
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("PRIMARY_CARE_PHYSICIAN","ESS")+'</th>'
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
		case "888": // religion		
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("RELIGION","ESS")+'</th>'
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
		case "889": // disability type
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("DISABILITY","ESS")+'</th>'
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
		case "106": // pay plan
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:33%">'+getSeaPhrase("PLAN","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("HOME_ADDR_1","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.plan_code) ? tmpObj.plan_code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.effect_date) ? tmpObj.effect_date : '&nbsp;'				
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="3" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'		
		break;			
		case "126": // position
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
		case "134": // pay step
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:33%">'+getSeaPhrase("PAY_SCHEDULE","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("HOME_ADDR_1","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("PAY_STEP","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.schedule) ? tmpObj.schedule : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.effect_date) ? tmpObj.effect_date : '&nbsp;'				
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.pay_step) ? tmpObj.pay_step : '&nbsp;'				
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="3" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;		
		case "135": // pay grade
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:33%">'+getSeaPhrase("PAY_SCHEDULE","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("HOME_ADDR_1","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("PAY_GRADE","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.schedule) ? tmpObj.schedule : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.effect_date) ? tmpObj.effect_date : '&nbsp;'				
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.pay_grade) ? tmpObj.pay_grade : '&nbsp;'				
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="3" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;		
		case "136": // pay schedule
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:33%">'+getSeaPhrase("PAY_SCHEDULE","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("HOME_ADDR_1","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.schedule) ? tmpObj.schedule : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.effect_date) ? tmpObj.effect_date : '&nbsp;'				
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="3" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "165": // account category
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("ACCOUNT_CATEGORY","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.acct_category) ? tmpObj.acct_category : '&nbsp;'
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
		case "293": // work schedule
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
		case "789": // currency
		case "898":
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
		case "595": // province
		case "1509":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'		
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("PROVINCE","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.province) ? tmpObj.province : '&nbsp;'
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
		case "594": // business number group
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:33%">'+getSeaPhrase("JOB_PROFILE_3","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("BUS_NBR_GROUP","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("BUS_NBR","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.process_level) ? tmpObj.process_level : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.bus_nbr_grp) ? tmpObj.bus_nbr_grp : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.bus_nbr) ? tmpObj.bus_nbr : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="3" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'		
		break;		
		case "1520": // qc enterprise number group
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:33%">'+getSeaPhrase("JOB_PROFILE_3","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("ENT_NBR_GROUP","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("ENT_NBR","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.process_level) ? tmpObj.process_level : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.qc_ent_nbr_grp) ? tmpObj.qc_ent_nbr_grp : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.qc_ent_nbr) ? tmpObj.qc_ent_nbr : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="3" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'		
		break;		
		default:
			if (fldElm && fldElm.getAttribute("userfld") == "true")
			{
				var tmpObj;
				selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
				selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
				selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("VALUE","ESS")+'</th>'
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
			}	
		break;
	}	
	dmeFilter.getRecordElement().innerHTML = selectHtml.join("");	
}
/* Filter Select logic - end */

/*
 *	Static Data
 */
//Hard coded values for the select boxes written strictly for Personnel Actions
var SalaryClassLiterals=new Array();
SalaryClassLiterals[0]=new Object();SalaryClassLiterals[0].code="H";SalaryClassLiterals[0].name=getSeaPhrase("HOURLY","ESS");
SalaryClassLiterals[1]=new Object();SalaryClassLiterals[1].code="S";SalaryClassLiterals[1].name=getSeaPhrase("SALARIED","ESS");
var PayFrequencyLiterals=new Array();
PayFrequencyLiterals[0]=new Object();PayFrequencyLiterals[0].code="1";PayFrequencyLiterals[0].name=getSeaPhrase("WEEKLY","ESS");
PayFrequencyLiterals[1]=new Object();PayFrequencyLiterals[1].code="2";PayFrequencyLiterals[1].name=getSeaPhrase("BIWEEKLY","ESS");
PayFrequencyLiterals[2]=new Object();PayFrequencyLiterals[2].code="3";PayFrequencyLiterals[2].name=getSeaPhrase("SEMIMONTHLY","ESS");
PayFrequencyLiterals[3]=new Object();PayFrequencyLiterals[3].code="4";PayFrequencyLiterals[3].name=getSeaPhrase("MONTHLY","ESS");
var ShiftLiterals=new Array();
ShiftLiterals[0]=new Object();ShiftLiterals[0].code="1";ShiftLiterals[0].name=getSeaPhrase("FIRST_SHIFT","ESS");
ShiftLiterals[1]=new Object();ShiftLiterals[1].code="2";ShiftLiterals[1].name=getSeaPhrase("SECOND_SHIFT","ESS");
ShiftLiterals[2]=new Object();ShiftLiterals[2].code="3";ShiftLiterals[2].name=getSeaPhrase("THIRD_SHIFT","ESS");
ShiftLiterals[3]=new Object();ShiftLiterals[3].code="4";ShiftLiterals[3].name=getSeaPhrase("FOURTH_SHIFT","ESS");
ShiftLiterals[4]=new Object();ShiftLiterals[4].code="5";ShiftLiterals[4].name=getSeaPhrase("FIFTH_SHIFT","ESS");
ShiftLiterals[5]=new Object();ShiftLiterals[5].code="6";ShiftLiterals[5].name=getSeaPhrase("SIXTH_SHIFT","ESS");
ShiftLiterals[6]=new Object();ShiftLiterals[6].code="7";ShiftLiterals[6].name=getSeaPhrase("SEVENTH_SHIFT","ESS");
ShiftLiterals[7]=new Object();ShiftLiterals[7].code="8";ShiftLiterals[7].name=getSeaPhrase("EIGHTH_SHIFT","ESS");
ShiftLiterals[8]=new Object();ShiftLiterals[8].code="9";ShiftLiterals[8].name=getSeaPhrase("NINTH_SHIFT","ESS");
var ExemptLiterals=new Array();
ExemptLiterals[0]=new Object();ExemptLiterals[0].code="Y";ExemptLiterals[0].name=getSeaPhrase("EXEMPT","ESS");
ExemptLiterals[1]=new Object();ExemptLiterals[1].code="N";ExemptLiterals[1].name=getSeaPhrase("NONEXEMPT","ESS");
var Railroad=new Array();
Railroad[0]=new Object();Railroad[0].code="0";Railroad[0].name=getSeaPhrase("NOT_RAILROAD_EE","ESS");
Railroad[1]=new Object();Railroad[1].code="1";Railroad[1].name=getSeaPhrase("TIER_ONE_EE","ESS");
Railroad[2]=new Object();Railroad[2].code="2";Railroad[2].name=getSeaPhrase("TIER_TWO_EE","ESS");	
var TippedLiterals=new Array()
TippedLiterals[0]=new Object();TippedLiterals[0].code="N";TippedLiterals[0].name=getSeaPhrase("NON_TIPPED_EE","ESS");
TippedLiterals[1]=new Object();TippedLiterals[1].code="C";TippedLiterals[1].name=getSeaPhrase("TIPPED_EE_CREDIT","ESS");
TippedLiterals[2]=new Object();TippedLiterals[2].code="T";TippedLiterals[2].name=getSeaPhrase("TIPPED_EE_NO_CREDIT","ESS");								
var AutoTimeRecordLiterals=new Array();
AutoTimeRecordLiterals[0]=new Object();AutoTimeRecordLiterals[0].code="N";AutoTimeRecordLiterals[0].name=getSeaPhrase("NO","ESS");
AutoTimeRecordLiterals[1]=new Object();AutoTimeRecordLiterals[1].code="S";AutoTimeRecordLiterals[1].name=getSeaPhrase("STANDARD","ESS");
AutoTimeRecordLiterals[2]=new Object();AutoTimeRecordLiterals[2].code="T";AutoTimeRecordLiterals[2].name=getSeaPhrase("TIMEGROUP","ESS");
AutoTimeRecordLiterals[3]=new Object();AutoTimeRecordLiterals[3].code="Y";AutoTimeRecordLiterals[3].name=getSeaPhrase("YES","ESS");										
var EICStatusLiterals=new Array();
EICStatusLiterals[0]=new Object();EICStatusLiterals[0].code="1";EICStatusLiterals[0].name=getSeaPhrase("SINGLE","ESS");
EICStatusLiterals[1]=new Object();EICStatusLiterals[1].code="2";EICStatusLiterals[1].name=getSeaPhrase("JOINT","ESS");								
var VeteranLiterals=new Array();
VeteranLiterals[0]=new Object();VeteranLiterals[0].code="N";VeteranLiterals[0].name=getSeaPhrase("NO","ESS");
VeteranLiterals[1]=new Object();VeteranLiterals[1].code="Y";VeteranLiterals[1].name=getSeaPhrase("YES","ESS");
VeteranLiterals[2]=new Object();VeteranLiterals[2].code="1";VeteranLiterals[2].name=getSeaPhrase("VETERAN","ESS");
VeteranLiterals[3]=new Object();VeteranLiterals[3].code="2";VeteranLiterals[3].name=getSeaPhrase("DISABLED_VET","ESS");
VeteranLiterals[4]=new Object();VeteranLiterals[4].code="3";VeteranLiterals[4].name=getSeaPhrase("VIETNAM_VET","ESS");
VeteranLiterals[5]=new Object();VeteranLiterals[5].code="4";VeteranLiterals[5].name=getSeaPhrase("DISABLED_VIETNAM_VET","ESS");
VeteranLiterals[6]=new Object();VeteranLiterals[6].code="5";VeteranLiterals[6].name=getSeaPhrase("GULF_WAR_VET","ESS");
VeteranLiterals[7]=new Object();VeteranLiterals[7].code="6";VeteranLiterals[7].name=getSeaPhrase("SPECIAL_DISABLED_VET","ESS");
VeteranLiterals[8]=new Object();VeteranLiterals[8].code="7";VeteranLiterals[8].name=getSeaPhrase("OTHER_VET","ESS");
var MaritalStatusLiterals=new Array();
MaritalStatusLiterals[0]=new Object();MaritalStatusLiterals[0].code="M";MaritalStatusLiterals[0].name=getSeaPhrase("MARRIED","ESS");
MaritalStatusLiterals[1]=new Object();MaritalStatusLiterals[1].code="S";MaritalStatusLiterals[1].name=getSeaPhrase("SINGLE","ESS");
MaritalStatusLiterals[2]=new Object();MaritalStatusLiterals[2].code="D";MaritalStatusLiterals[2].name=getSeaPhrase("DIVORCED","ESS");
MaritalStatusLiterals[3]=new Object();MaritalStatusLiterals[3].code="W";MaritalStatusLiterals[3].name=getSeaPhrase("WIDOWED","ESS");
MaritalStatusLiterals[4]=new Object();MaritalStatusLiterals[4].code="L";MaritalStatusLiterals[4].name=getSeaPhrase("LEGALLY_SEPARATED","ESS");
MaritalStatusLiterals[5]=new Object();MaritalStatusLiterals[5].code="O";MaritalStatusLiterals[5].name=getSeaPhrase("SIGNIFICANT_OTHER","ESS");
MaritalStatusLiterals[6]=new Object();MaritalStatusLiterals[6].code="P";MaritalStatusLiterals[6].name=getSeaPhrase("DOMESTIC_PARTNER","ESS");
var GenderLiterals=new Array();
GenderLiterals[0]=new Object();GenderLiterals[0].code="M";GenderLiterals[0].name=getSeaPhrase("DEP_25","ESS");
GenderLiterals[1]=new Object();GenderLiterals[1].code="F";GenderLiterals[1].name=getSeaPhrase("DEP_26","ESS");							
var FunctionalGroupLiterals=new Array();
FunctionalGroupLiterals[0]=new Object();FunctionalGroupLiterals[0].code="01";FunctionalGroupLiterals[0].name=getSeaPhrase("FINANCE_ADMIN","ESS");
FunctionalGroupLiterals[1]=new Object();FunctionalGroupLiterals[1].code="02";FunctionalGroupLiterals[1].name=getSeaPhrase("STREETS_HIGHWAYS","ESS");
FunctionalGroupLiterals[2]=new Object();FunctionalGroupLiterals[2].code="03";FunctionalGroupLiterals[2].name=getSeaPhrase("PUBLIC_WELFARE","ESS");
FunctionalGroupLiterals[3]=new Object();FunctionalGroupLiterals[3].code="04";FunctionalGroupLiterals[3].name=getSeaPhrase("POLICE_PROTECTION","ESS");
FunctionalGroupLiterals[4]=new Object();FunctionalGroupLiterals[4].code="05";FunctionalGroupLiterals[4].name=getSeaPhrase("FIRE_PROTECTION","ESS");
FunctionalGroupLiterals[5]=new Object();FunctionalGroupLiterals[5].code="06";FunctionalGroupLiterals[5].name=getSeaPhrase("PARK_AND_REC","ESS");
FunctionalGroupLiterals[6]=new Object();FunctionalGroupLiterals[6].code="07";FunctionalGroupLiterals[6].name=getSeaPhrase("HOSPITALS_SANATARIUMS","ESS");
FunctionalGroupLiterals[7]=new Object();FunctionalGroupLiterals[7].code="08";FunctionalGroupLiterals[7].name=getSeaPhrase("HEALTH","ESS");
FunctionalGroupLiterals[8]=new Object();FunctionalGroupLiterals[8].code="09";FunctionalGroupLiterals[8].name=getSeaPhrase("HOUSING","ESS");
FunctionalGroupLiterals[9]=new Object();FunctionalGroupLiterals[9].code="10";FunctionalGroupLiterals[9].name=getSeaPhrase("COMMUNITY_DEV","ESS");
FunctionalGroupLiterals[10]=new Object();FunctionalGroupLiterals[10].code="11";FunctionalGroupLiterals[10].name=getSeaPhrase("CORRECTIONS","ESS");
FunctionalGroupLiterals[11]=new Object();FunctionalGroupLiterals[11].code="12";FunctionalGroupLiterals[11].name=getSeaPhrase("UTILS_TRANS","ESS");
FunctionalGroupLiterals[12]=new Object();FunctionalGroupLiterals[12].code="13";FunctionalGroupLiterals[12].name=getSeaPhrase("SANITATION","ESS");
FunctionalGroupLiterals[13]=new Object();FunctionalGroupLiterals[13].code="14";FunctionalGroupLiterals[13].name=getSeaPhrase("EMPLOYMENT_SECURITY","ESS");
FunctionalGroupLiterals[14]=new Object();FunctionalGroupLiterals[14].code="15";FunctionalGroupLiterals[14].name=getSeaPhrase("OTHER","ESS");
FunctionalGroupLiterals[15]=new Object();FunctionalGroupLiterals[15].code="99";FunctionalGroupLiterals[14].name=getSeaPhrase("NA","ESS");
var ApplyMaxCompLimitLiterals=new Array();
ApplyMaxCompLimitLiterals[0]=new Object();ApplyMaxCompLimitLiterals[0].code="N";ApplyMaxCompLimitLiterals[0].name=getSeaPhrase("NO","ESS");
var AutomaticDepositLiterals=new Array();
AutomaticDepositLiterals[0]=new Object();AutomaticDepositLiterals[0].code="Y";AutomaticDepositLiterals[0].name=getSeaPhrase("YES","ESS");
AutomaticDepositLiterals[1]=new Object();AutomaticDepositLiterals[1].code="N";AutomaticDepositLiterals[1].name=getSeaPhrase("NO","ESS");
AutomaticDepositLiterals[2]=new Object();AutomaticDepositLiterals[2].code="P";AutomaticDepositLiterals[2].name=getSeaPhrase("PARTIAL","ESS");
var YesNoLiterals=new Array();
YesNoLiterals[0]=new Object();YesNoLiterals[0].code="Y";YesNoLiterals[0].name=getSeaPhrase("YES","ESS");
YesNoLiterals[1]=new Object();YesNoLiterals[1].code="N";YesNoLiterals[1].name=getSeaPhrase("NO","ESS");
var TaxFilterLiterals=new Array();
TaxFilterLiterals[0]=new Object();TaxFilterLiterals[0].code="1";TaxFilterLiterals[0].name=getSeaPhrase("LOCATE_ALL_TAXES","ESS");
TaxFilterLiterals[1]=new Object();TaxFilterLiterals[1].code="2";TaxFilterLiterals[1].name=getSeaPhrase("LOCATE_FED_STATE","ESS");
TaxFilterLiterals[2]=new Object();TaxFilterLiterals[2].code="3";TaxFilterLiterals[2].name=getSeaPhrase("LOCATE_FED","ESS");
var EmpRemoteLiterals=new Array();
EmpRemoteLiterals[0]=new Object();EmpRemoteLiterals[0].code="0";EmpRemoteLiterals[0].name=getSeaPhrase("NOT_REMOTE","ESS");
EmpRemoteLiterals[1]=new Object();EmpRemoteLiterals[1].code="1";EmpRemoteLiterals[1].name=getSeaPhrase("REMOTE","ESS");
// Hardcoded Select Window Functions, indexed by Field Number from PADICT	
var HardCodedLists = new Array();
//HardCodedLists[8] = StatesLiterals; // State
//HardCodedLists[42] = StatesLiterals; // Supplemental State
HardCodedLists[57] = FunctionalGroupLiterals; // EEO-4 Group
HardCodedLists[58] = YesNoLiterals; // Exclude From EEO-4
HardCodedLists[59] = MaritalStatusLiterals; // Marital Status
HardCodedLists[60] = YesNoLiterals; // Pension Plan
HardCodedLists[63] = PayFrequencyLiterals; // Pay Frequency
HardCodedLists[64] = SalaryClassLiterals; // Salary Class
HardCodedLists[65] = ShiftLiterals; // Shift
HardCodedLists[66] = AutoTimeRecordLiterals; // Auto Time Record
HardCodedLists[67] = AutomaticDepositLiterals; // Automatic Deposit
HardCodedLists[73] = ExemptLiterals; // Exempt
HardCodedLists[74] = EICStatusLiterals; // EIC Status
HardCodedLists[88] = GenderLiterals; // Gender
//HardCodedLists[91] = StatesLiterals; // Birthplace - State		
HardCodedLists[97] = YesNoLiterals; // Disability
HardCodedLists[105] = YesNoLiterals; // Warning Message
HardCodedLists[109] = YesNoLiterals; // Spouse Health Plan
HardCodedLists[110] = YesNoLiterals; // Spouse Dental Plan
//HardCodedLists[117] = StatesLiterals; // Spouse Emplr State
HardCodedLists[120] = YesNoLiterals; // Owner
HardCodedLists[121] = YesNoLiterals; // Key Employee
HardCodedLists[122] = YesNoLiterals; // Officer
HardCodedLists[123] = YesNoLiterals; // Highly Compensated
HardCodedLists[124] = YesNoLiterals; // Smoker
//HardCodedLists[140] = VeteranLiterals; // Veteran - only for pre-8.1.1 apps
HardCodedLists[161] = YesNoLiterals; // Deceased
HardCodedLists[164] = TippedLiterals; // Tipped Employee
HardCodedLists[167] = ApplyMaxCompLimitLiterals; // Apply Max Comp Limit
HardCodedLists[567] = Railroad; // Railroad
HardCodedLists[617] = YesNoLiterals; //Related to employer
HardCodedLists[613] = YesNoLiterals; //Visible Minority
HardCodedLists[612] = YesNoLiterals; //Aborignal
//HardCodedLists[595] = CanadaProvinceLiterals; //Tax providence
//HardCodedLists[1509] = CanadaProvinceLiterals; //WC providence
HardCodedLists[915] = YesNoLiterals; // Emp Priv Consent
HardCodedLists[1610] = TaxFilterLiterals; // Emp Tax Filter
HardCodedLists[1611] = EmpRemoteLiterals; // Emp Remote
/*
 *	Transaction Error Validation
 */
//Error checking written strictly for Personnel Actions
var TaxLocatorVariable = false;

// Firefox will call this function after the user interacts with a confirm dialog box
function handleConfirmResponse(confirmWin)
{
	var dialogResponse = confirmWin.returnValue == "ok" || confirmWin.returnValue == "continue";
	CheckForErrors(dialogResponse);
}

var count = 0;
function CheckForErrors(dialogResponse)
{
	var confirmResponse;
	switch (parseInt(self.lawheader.gmsgnbr))
	{
		case 108:
		{			
			if (typeof(dialogResponse) == "undefined" || dialogResponse == null)
			{
				msg = getSeaPhrase("PAY_OUT_OF_RANGE","ESS");		
				confirmResponse = parent.seaConfirm(msg, "", handleConfirmResponse);
				// wait for the callback function
				if (confirmResponse == null)
					return;
			}
			else
				confirmResponse = dialogResponse;
			if (confirmResponse)
				Updated();
			else
				StopWindowProcessing();
			break;
		}
		case 131:
		{
			if (++count<2)
				Updated();
			else
			{
				StopWindowProcessing();
				parent.seaAlert(self.lawheader.myMsg, null, null, "error");
			}
			break;
		}
		case 145:
		{
			StopWindowProcessing();
			msg = getSeaPhrase("PACTIONS_FIELD_ERROR","ESS");
			highlightFieldInError(self.lawheader.gfldnbr, msg);
			break;
		}
		case 146:
		{
			StopWindowProcessing();
			msg = getSeaPhrase("PACTIONS_SAME_DATA","ESS");
			highlightFieldInError(self.lawheader.gfldnbr, msg);
			break;
		}
		case 138:
		{
			StopWindowProcessing();
			msg = getSeaPhrase("STEP_AND_GRADE_EMP","ESS");
			highlightFieldInError(self.lawheader.gfldnbr, msg);
			break;
		}
		case 169:
		{
			StopWindowProcessing();
			msg = getSeaPhrase("INVALID_PAY_PLAN","ESS");
			highlightFieldInError(self.lawheader.gfldnbr, msg);
			break;
		}
		case 116:
		{
			StopWindowProcessing();
			msg = getSeaPhrase("NO_STATUS_CHG","ESS");
			highlightFieldInError(self.lawheader.gfldnbr, msg);
			break;
		}
		case 190:
		{
			if (typeof(dialogResponse) == "undefined" || dialogResponse == null)
			{
				msg = getSeaPhrase("PR_DED_UPDATE","ESS");
				confirmResponse = parent.seaConfirm(msg, "", handleConfirmResponse);
				// wait for the callback function
				if (confirmResponse == null)
					return;
			}
			else
				confirmResponse = dialogResponse;
			if (confirmResponse)
				Updated();
			else
				StopWindowProcessing();
			break;
		}
		case 150:
		case 105:
			if (self.lawheader.myMsg.indexOf("Date") != -1) 
			{
				StopWindowProcessing();
				highlightFieldInError(self.lawheader.gfldnbr, self.lawheader.myMsg);
				break;
			}
		case 100:
		{
			// PT 107208: this error is combined with message #100			
			if (self.lawheader.myMsg == "Check position record; can not override default value") 
			{
				StopWindowProcessing();
				msg = "Contact human resources for assistance (cannot override default value for position record)";
				highlightFieldInError(self.lawheader.gfldnbr, msg);
				break;
			}
			// PT 128508: this error is combined with message #100
			else if (self.lawheader.myMsg == "Acct does not exist for any acct unit for company") 
			{
				StopWindowProcessing();
				msg = "Acct does not exist for any acct unit for company";
				highlightFieldInError(self.lawheader.gfldnbr, msg);
				break;
			}
			// PT 139840: an invalid field was entered by the user
			else if (self.lawheader.myMsg.indexOf("does not exist") != -1) 
			{
				StopWindowProcessing();
				highlightFieldInError(self.lawheader.gfldnbr, self.lawheader.myMsg);
				break;
			}
			else if (self.lawheader.myMsg.indexOf("Field must not be negative") != -1)
			{
				StopWindowProcessing();
				highlightFieldInError(self.lawheader.gfldnbr, self.lawheader.myMsg);
				break;				
			}
			// PT 139840. If the user is making an address change and receives Tax Locator errors 100 or 105,
			// either resubmit the update or produce a hard error message, based on the email option.
			if (Rules[_RULESINDEX].AddressChange && self.lawheader.gmsgnbr != "150")
			{
				if (typeof(Rules[_RULESINDEX].EmailAddress) == "undefined" || Rules[_RULESINDEX].EmailAddress == null || NonSpace(Rules[_RULESINDEX].EmailAddress) == 0) // SYSRULES email is blank
				{				
					StopWindowProcessing();
					if (self.lawheader.gmsgnbr == "100" || self.lawheader.gmsgnbr == "105") // Tax Locator error message
						msg = getSeaPhrase("HOME_ADDR_13","ESS");
					else
						msg = getSeaPhrase("HOME_ADDR_14","ESS");
					highlightFieldInError(self.lawheader.gfldnbr, msg);
				}
				else if (!TaxLocatorVariable && (self.lawheader.gmsgnbr == "100" || self.lawheader.gmsgnbr == "105")) // Tax Locator error message
				{
					TaxLocatorVariable = true;
					if (Rules[_RULESINDEX].WebImmediate == "Y" && (Rules[_RULESINDEX].EmailAddress == null || NonSpace(Rules[_RULESINDEX].EmailAddress) == 0))
					{
						if (typeof(dialogResponse) == "undefined" || dialogResponse == null)
						{
							// temporarily set the TaxLocatorVariable flag back to false so the logic will fall back into this block of code for Firefox
							TaxLocatorVariable = false;
							msg = getSeaPhrase("TAX_DED_REVIEW","ESS");
							confirmResponse = parent.seaConfirm(msg, "", handleConfirmResponse);
							// wait for the callback function
							if (confirmResponse == null)
								return;
						}
						else
							confirmResponse = dialogResponse;		
						TaxLocatorVariable = true;
						Rules[_RULESINDEX].WebImmediate = "N";
						if (confirmResponse)
							Updated();
						else
							StopWindowProcessing();
					}
					else
						Updated();
				}
				else
				{
					StopWindowProcessing();
					msg = getSeaPhrase("HOME_ADDR_14","ESS");
					highlightFieldInError(self.lawheader.gfldnbr, msg);
				}
			}	
			else
			{
				TaxLocatorVariable = true;
				if (Rules[_RULESINDEX].WebImmediate == "Y" && (Rules[_RULESINDEX].EmailAddress == null || NonSpace(Rules[_RULESINDEX].EmailAddress) == 0))
				{
					if (typeof(dialogResponse) == "undefined" || dialogResponse == null)
					{
						msg = getSeaPhrase("TAX_DED_REVIEW","ESS");			
						confirmResponse = parent.seaConfirm(msg, "", handleConfirmResponse);
						// wait for the callback function
						if (confirmResponse == null)
							return;
					}
					else
						confirmResponse = dialogResponse;					
					Rules[_RULESINDEX].WebImmediate = "N";
					if (confirmResponse)
						Updated();
					else
						StopWindowProcessing();
				}
				else
					Updated();
			}
			break;
		}
		case 52:
		{
			StopWindowProcessing();
			msg = getSeaPhrase("FIELD_AUTH_ERROR","ESS")+" ("+self.lawheader.gfldnbr+").  "+getSeaPhrase("CONTACT_HR","ESS");
			highlightFieldInError(self.lawheader.gfldnbr, msg);
			break;
		}
		case 261:
		{
			if (typeof(dialogResponse) == "undefined" || dialogResponse == null)
			{
				highlightFieldInError(self.lawheader.gfldnbr, self.lawheader.myMsg);
				confirmResponse = parent.seaConfirm(self.lawheader.myMsg, "", handleConfirmResponse);
				// wait for the callback function
				if (confirmResponse == null)
					return;
			}
			else
				confirmResponse = dialogResponse;		
			if (confirmResponse)
				Updated();
			else
				StopWindowProcessing();
			break;
		}		
		case 0:
		{
			if (self.lawheader.myMsg.toUpperCase().indexOf("WARNING") == 0)
			{
				if (typeof(dialogResponse) == "undefined" || dialogResponse == null)
				{
					confirmResponse = parent.seaConfirm(self.lawheader.myMsg, "", handleConfirmResponse);
					// wait for the callback function
					if (confirmResponse == null)
						return;
				}
				else
					confirmResponse = dialogResponse;			
				if (confirmResponse)
					Updated();
				else
					StopWindowProcessing();
			}
			else
				DspMsg();
			break;
		}
		default:
		{
			if (self.lawheader.myMsg.toUpperCase().indexOf("WARNING") == 0)
			{
				if (typeof(dialogResponse) == "undefined" || dialogResponse == null)
				{
					confirmResponse = parent.seaConfirm(self.lawheader.myMsg, "", handleConfirmResponse);
					// wait for the callback function
					if (confirmResponse == null)
						return;
				}
				else
					confirmResponse = dialogResponse;			
				if (confirmResponse)
					Updated();
				else
					StopWindowProcessing();
			}
			else 
			{
				StopWindowProcessing();
				msg = getSeaPhrase("ERROR","ESS")+":\n"+self.lawheader.myMsg;
				highlightFieldInError(self.lawheader.gfldnbr, msg);
			}
		}
	}
}

function StopWindowProcessing()
{
	try
	{
		if (typeof(parent.removeWaitAlert) != "undefined")
			parent.removeWaitAlert();
		if (typeof(window.stop) != "undefined")
			window.stop();
	}
	catch(e) {}
}

function highlightFieldInError(fld, msg)
{
	if (typeof(window["styler"]) == "undefined" || window.styler == null)
		window.stylerWnd = findStyler(true);
	if (!window.stylerWnd)
	{
		parent.seaAlert(msg, null, null, "error");
		return;
	}	
	if (typeof(window.stylerWnd["StylerEMSS"]) == "function")
		window.styler = new window.stylerWnd.StylerEMSS();
	else
		window.styler = window.stylerWnd.styler;
	try
	{
		fld = fld.toString().toUpperCase();
		if (fld.indexOf("_F") == 0)
		{
			parent.seaAlert(msg, null, null, "error");
			return false;
		}	
		if (fld == "PCT-ACTION-CODE")
		{
			if (emssObjInstance.emssObj.filterSelect)
				setRequiredField(self.main.document.getElementById("actionsSelect"), msg);
			else
			{
				var actionsSelect = self.main.document.getElementById("actionsSelect") || null;
				setRequiredField(self.main.document.getElementById("actionsCell"), msg, actionsSelect);		
			}
			// Inline error message doesn't always display so alert the error as well
			if (typeof(window["styler"]) != "undefined" && window.styler && window.styler.showInfor3)
				parent.seaAlert(msg, null, null, "error");			
			return true;
		}
		else if (fld == "PCT-EFFECT-DATE")
		{
			setRequiredField(self.main.document.getElementById("effectiveDate"), msg);
			// Inline error message doesn't always display so alert the error as well
			if (typeof(window["styler"]) != "undefined" && window.styler && window.styler.showInfor3)
				parent.seaAlert(msg, null, null, "error");			
			return true;
		}
		else if (fld.indexOf("PCT-REASON") == 0)
		{
			var fldDigit = parseInt(fld.substring(10, fld.length), 10);
			if (emssObjInstance.emssObj.filterSelect)
				setRequiredField(self.main.document.getElementById("reasonSelect" + fldDigit), msg);
			else
			{
				var reasonSelect = self.main.document.getElementById("reasonSelect" + fldDigit) || null;
				setRequiredField(self.main.document.getElementById("reasonSelect" + fldDigit + "Cell"), msg, reasonSelect);		
			}
			// Inline error message doesn't always display so alert the error as well
			if (typeof(window["styler"]) != "undefined" && window.styler && window.styler.showInfor3)
				parent.seaAlert(msg, null, null, "error");			
			return true;
		}

		if (fld.indexOf("PCT-NEW-VALUE-") != 0)
		{
			parent.seaAlert(msg, null, null, "error");
			return false;
		}	
		var fldDigits = fld.substring(14);
		var rowIndex = fldDigits.indexOf("R");
		// Is this running on 8.1+ IOS w/ XML output?  If so, increment the row number of
		// the field in error returned by the Transaction servlet.
		if (rowIndex != -1)
		{
			var firstNumber = fldDigits.substring(0, rowIndex);
			var secondNumber = parseInt(fldDigits.substring(rowIndex + 1), 10) + 1;
			fldDigits = parseInt(firstNumber + String(secondNumber), 10);
		}
		else
			fldDigits = parseInt(fldDigits, 10);
		if (isNaN(fldDigits))
		{
			parent.seaAlert(msg, null, null, "error");
			return false;
		}	
		var count = 1;
		var index;		
		var i = 0;
		var j = 1;
		var found = false;
		while ((i < Data.length) && (found == false))
		{
			index = parseInt((String(j)) + (String(count)), 10);
			if (fldDigits == index)
			{
				found = true;
				var fieldSelect = self.main.document.getElementById("fieldSelect" + i) || null;
				setRequiredField(self.main.document.getElementById("actionFldCell" + i), msg, fieldSelect);			
			}
			if (++count > 12)
			{
				j++;
				count = 1;
			}
			i++;
		}
		if (found)
		{
			// Inline error message doesn't always display so alert the error as well
			if (typeof(window["styler"]) != "undefined" && window.styler && window.styler.showInfor3)
				parent.seaAlert(msg, null, null, "error");			
			return true;
		}	
	}
	catch(e) {}
	parent.seaAlert(msg, null, null, "error");
	return false;
}

/*
 *	Field Select Functionality
 */
function generateSelectOptions(selectID, dataArray, isDefault)
{
	var code = "";
	var name = "";
	var selObj = self.main.document.getElementById(selectID);
	var selectedCode = "";
	var optObj;
	// are we adding a new default option to a dropdown?
	if (isDefault)
	{
		selectedCode = dataArray[0].code;
		// if there was a previous default value in the dropdown, remove it
		if (selObj.options.item(0).value == "DEFAULT_VALUE")
		{
			selObj.innerHTML = "";
			optObj = self.main.document.createElement("OPTION");
			optObj.value = "DEFAULT_VALUE";
			optObj.text = "";
			if (navigator.appName.indexOf("Microsoft") >= 0)
				selObj.add(optObj);
			else
				selObj.appendChild(optObj);		
		}
		else
			selObj.options.item(0).value = "DEFAULT_VALUE";
	}
	else	
	{
		// if there is a previous default option in the dropdown prior to populating the full
		// selection list, remove it before adding the rest of options
		if (selObj.options.item(0).value == "DEFAULT_VALUE")
		{
			selectedCode = selObj.options.item(1).value;
			selObj.innerHTML = "";
			optObj = self.main.document.createElement("OPTION");
			optObj.value = "DME_RETURNED";
			optObj.text = "";
			if (navigator.appName.indexOf("Microsoft") >= 0)
				selObj.add(optObj);
			else
				selObj.appendChild(optObj);		
		}
		else
			selObj.options.item(0).value = "DME_RETURNED";
	}
	// add the dropdown options
	for (var i=0; i<dataArray.length; i++) 
	{
		if (typeof(dataArray[i]) == "object") 
		{
			if (typeof(dataArray[i].code) != "undefined")
				code = dataArray[i].code;
			else if (typeof(dataArray[i].name) != "undefined")
				code = dataArray[i].name;
			else if (typeof(dataArray[i].subName) != "undefined")
				code = dataArray[i].subName;
			if (typeof(dataArray[i].subName) != "undefined")
				name = dataArray[i].subName + " - " + dataArray[i].name;
			else if (typeof(dataArray[i].name) != "undefined")
				name = dataArray[i].name;
			else if (typeof(dataArray[i].code) != "undefined")
				name = dataArray[i].code;
		} 
		else 
		{
			code = dataArray[i];
			name = dataArray[i];
		}
		optObj = self.main.document.createElement("OPTION");
		optObj.value = code;
		if (isDefault && (name == code))
			optObj.text = code
		else	
		{
			if (code.indexOf("*BLANK") == 0)
				optObj.text = name;
			else
				optObj.text = name + " - " + code;
		}
		if (navigator.appName.indexOf("Microsoft") >= 0)
				selObj.add(optObj);
		else
			selObj.appendChild(optObj);
		// if a default option was previously selected, make sure it remains selected
		// in the full DME record list
		if ((selectedCode != "") && (code === selectedCode))
			selObj.selectedIndex = i + 1;
	}
	// if the defaulted option isn't found in the records from the DME call, add it to the 
	// end of the dropdown options and select it
	if ((selectedCode != "") && (selObj.options.length > 1) && (selObj.selectedIndex < 1))
	{
		var defaultFld = new Object();
		defaultFld.name = selectedCode;
		defaultFld.code = selectedCode;
		appendDefaultSelectOption(selectID, defaultFld);	
	}
	self.main.styleElement(selObj);
	self.main.triggerElement(selObj, "click");
	self.main.triggerElement(selObj, "click");
}

function appendDefaultSelectOption(selectID, defaultFld)
{
	var selObj = self.main.document.getElementById(selectID);
	var optObj = self.main.document.createElement("OPTION");
	optObj.value = defaultFld.code;
	if (defaultFld.code == defaultFld.name)
	{
		if (defaultFld.code.indexOf("*BLANK") == 0)
			optObj.text = getSeaPhrase("PA_BLANK_FIELD","ESS");
		else
			optObj.text = defaultFld.code;
	}
	else
	{
		if (defaultFld.code.indexOf("*BLANK") == 0)
			optObj.text = defaultFld.name;
		else
			optObj.text = defaultFld.name + " - " + defaultFld.code;
	}
	if (navigator.appName.indexOf("Microsoft") >= 0)
	{
		if (selObj.options.length > 1)
		{
			selObj.add(optObj, 1);
			selObj.selectedIndex = 1;
		}
		else
		{
			selObj.add(optObj);
			selObj.selectedIndex = selObj.options.length - 1;
		}
	}
	else
	{
		if (selObj.options.length > 1)
		{
			selObj.insertBefore(optObj, selObj.options.item(1));
			selObj.selectedIndex = 1;
		}
		else
		{
			selObj.appendChild(optObj);
			selObj.selectedIndex = selObj.options.length - 1;
		}
	}
	self.main.styleElement(selObj);
}

function RidLeadingSpaces(str)
{
	str = String(str);
	if (str.charAt(0)!=' ')
		return str;
	else
	{
		for (var i=0; i<str.length; i++)
		{
			if (str.charAt(i) != " ")
				break;
		}
		return str.substring(i,str.length);
	}
}

/*
 *	Comments Functionality
 */
var Comments = null;		//Instance of the Comments object.
var commentRecords;
var CommentDtlLines;
var PA56_DTL_FIELD_SIZE = 60;
var PA56_NBR_DETAIL_LINES = 10;

function CommentsObject()
{
	this.ActionCode = null
	this.ActionType = null
	this.Date = null
	this.Employee = null
	this.Text = null
	this.ActionNbr = null
}

function InitializeCommentsObject()
{
	Comments = new CommentsObject();
	Comments.Text = "";
	Comments.Date = Rules[_RULESINDEX].EffectiveDate;
	Comments.Employee = Rules[_RULESINDEX].Employee;
	Comments.ActionCode = Rules[_RULESINDEX].ActionCode;	
	Comments.ActionType = Rules[_RULESINDEX].ActionType;
	Comments.ActionNbr = Rules[_RULESINDEX].ActionNbr;
}

function GetPaComments()
{
	commentRecords = new Array();
	var dmeObj = new DMEObject(authUser.prodline, "pacomments");
	dmeObj.out = "XML";
	dmeObj.index = "pacset2";
	dmeObj.field = "cmt-text";
	dmeObj.key = parseInt(authUser.company,10)+"=0=PA="+escape(Comments.ActionCode)+"="+formjsDate(formatDME(Comments.Date))+"="+parseInt(Comments.Employee);
	dmeObj.max = "600";
	dmeObj.select = "ln-nbr=" + Number(Rules[_RULESINDEX].ActionNbr);
	dmeObj.func = "GetMorePaComments()";
	DME(dmeObj, "jsreturn");
}

function GetMorePaComments() 
{
	var cmtRecs = self.jsreturn.record; //   Add a reference to the comment array.
	var nbrRecs = cmtRecs.length;
	var blankLine = new Array();
	var foundNonBlankLine = false;
	Comments.Text = "";
	for (var i=0; i<nbrRecs; i++) 
	{
		var cmtText = cmtRecs[i].cmt_text;
		// Added code to handle carriage returns and trailing spaces. A carriage return gets returned from DME as a single comment line containing only
		// an empty string.  Convert it back to a carriage return so it will get formatted properly in the text area.
		if (cmtText == "") 
		{
			// Retain carriage returns.  If the carriage return is not at the beginning of
			// the comments or at the end, add an additional carriage return in order to
			// preserve the paragraph break.
			cmtText = unescape("%0D%0A");
			blankLine[commentRecords.length] = true; // store a flag that this line is blank
		} 
		else
			foundNonBlankLine = true;
		// Store the line of comment text in the commentRecords array.  Make sure any escaped double
		// quote or backslash characters appear correctly in the text area.
		commentRecords[commentRecords.length] = cmtText.replace(/\\\\"/g,'"').replace(/\\\\/g,'\\');
		// If the current line does not start with white space, append a space character to the
		// end of the previous line so that words do not run together in the text area.  This is
		// necessary because DME trims the whitespace off of the end of each line.
		if (commentRecords.length > 1) 
		{
			var thisLine = commentRecords[commentRecords.length-1];
			var prevLine = commentRecords[commentRecords.length-2];
			if ((thisLine.charAt(0) != " ") && (!blankLine[commentRecords.length-2]) && (prevLine.length < PA56_DTL_FIELD_SIZE))
				commentRecords[commentRecords.length-2] += " ";
		}
	}
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
	{
		Comments.Text = commentRecords.join("");	
		PaintFieldsForAction();		
	}
}

function DeletePaComments(dtlLineCounter) 
{
	// if an error was returned, abort the update
	if (Number(self.lawheader.gmsgnbr) != 0) 
	{
		FinishComments(true);
		return;
	}
	var agsObj = new AGSObject(authUser.prodline, "PA56.1");
	agsObj.rtn = "MESSAGE";
	agsObj.longNames = true;
	agsObj.tds = false;
	agsObj.event = "CHG";
	agsObj.field = "FC=D"
	if (Rules[_RULESINDEX].WebImmediate != "Y")
		agsObj.field += "&PGM-NAME=PA52";
	agsObj.field += "&PAC-COMPANY=" + Number(authUser.company)
	+ "&PAC-EMPLOYEE=" + Number(Comments.Employee)
	+ "&PAC-ACTION-CODE-IND=" + Comments.ActionCode
	+ "&PAC-DATE=" + formjsDate(formatDME(Comments.Date))
	+ "&PT-ACTION-TYPE=" + Comments.ActionType
	+ "&PT-PAC-LN-NBR=" + Number(Comments.ActionNbr)
	+ "&PT-IMMEDIATE-FLG=" + Rules[_RULESINDEX].WebImmediate;	
	if (Rules[_RULESINDEX].WebImmediate == "Y")
		agsObj.field += "&PAH-OBJ-ID=1";
	agsObj.func = "parent.purgeDeletedPaComments(" + dtlLineCounter +")";
	agsObj.debug = false;
	AGS(agsObj, "jsreturn");
}

function purgeDeletedPaComments(dtlLineCounter) 
{
	// Ignore the delete error if someone deleted the comments manually on PA56 (the error will be message number 12, "No More Records To View")--in that case, we
	// can just add new comments. If any other error was returned while deleting comments, abort the update.
	if (Number(self.lawheader.gmsgnbr) != 0 && Number(self.lawheader.gmsgnbr) != 12) 
	{
		FinishComments(true);
		return;
	}
	if (typeof(dtlLineCounter) != "undefined")
		AddComments(dtlLineCounter);
	else
		FinishComments();
}

function FinishComments(errorReturned)
{
	if (!errorReturned)
	{
		if (Number(self.lawheader.gmsgnbr) != 0)
		{
			if (fromTask)
				parent.removeWaitAlert();			
			parent.seaAlert(self.lawheader.myMsg, null, null, "error");
		}
	}
	else 
	{
		if (fromTask)
			parent.removeWaitAlert();
		parent.seaPageMessage(self.lawheader.myMsg, null, null, "info", null, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
	}	
	FinishUpdate();	
}

function UpdateComments()
{
	StoreComments();
	if (Rules[_RULESINDEX].CommentsFlag == "*")
		DeletePaComments(0);
	else
		AddComments(0);
}

function StoreComments() 
{
	CommentDtlLines = new Array();
	Comments.Text = self.main.document.getElementById("comments").value;
	//  Parse carriage returns and split the lines into manageable strings for PA56.
	ParseCommentText(Comments.Text);
}

//The next two functions handle parsing of user-entered comments.
//Parse the user-entered review comment text and prepare it for update on PA56.
//Append each line to the global CommentDtlLines array.  It is assumed that
//the commentText parameter is an unescaped string.
function ParseCommentText(commentText) 
{
	// If the literal text %0A or %0D is found in the unescaped comment text, replace each with escaped literal characters.  If we don't do this, when inquiring on this data,
	// the Javascript output from DME will insert a carriage return before ending the string, causing an 'unterminated string constant' error.
	if ((commentText.indexOf("%0D") != -1) || (commentText.indexOf("%0A") != -1)) 
	{
		commentText = commentText.replace(/%0D/g,"\\%\\0\\D");
		commentText = commentText.replace(/%0A/g,"\\%\\0\\A");
	}
	var tmpText = escape(commentText, 1);
	var newLineComments = new Array(); // Splits the comment text by carriage returns
	var tmpLines;

	// First, check to see if this line has any carriage returns in it.  If so, create a new blank line for each one.  Handle operating system specific encodings.  If a
	// carriage return exists, the line will be split into two lines.  Windows encodes carriage returns as \r\n, or %0D%0A
	if (tmpText.indexOf("%0D%0A") != -1) 
	{
		tmpLines = tmpText.split("%0D%0A");
		for (var i=0; i<tmpLines.length; i++) 
		{
			newLineComments[newLineComments.length] = unescape(tmpLines[i]);
			if ((i < tmpLines.length - 1) && (NonSpace(tmpLines[i]) > 0))
				newLineComments[newLineComments.length] = ""; // represent a carriage return on PA56 as a blank line
		}
	}
	// Unix encodes carriage returns as \r, or %0D
	else if (tmpText.indexOf("%0D") != -1) 
	{
		tmpLines = tmpText.split("%0D");
		for (var i=0; i<tmpLines.length; i++) 
		{
			newLineComments[newLineComments.length] = unescape(tmpLines[i]);
			if ((i < tmpLines.length - 1) && (NonSpace(tmpLines[i]) > 0))
				newLineComments[newLineComments.length] = ""; // represent a carriage return on PA56 as a blank line
		}
	}
	// Macintosh encodes carriage returns as \n, or %0A
	else if (tmpText.indexOf("%0A") != -1) 
	{
		tmpLines = tmpText.split("%0A");
		for (var i=0; i<tmpLines.length; i++) 
		{
			newLineComments[newLineComments.length] = unescape(tmpLines[i]);
			if ((i < tmpLines.length - 1) && (NonSpace(tmpLines[i]) > 0))
				newLineComments[newLineComments.length] = ""; // represent a carriage return on PA56 as a blank line
		}
	}
	// If this line does not contain any carriage returns, then pass it directly to the chunkUupCommentString() function.
	else
		newLineComments[0] = commentText;
	// Now that the carriage returns are removed, chunk up each string so we are left
	// with lines that can be updated on PA56.
	for (var k=0; k<newLineComments.length; k++)
		ChunkUpCommentString(newLineComments[k]);
}

//Chunk up the parameter string into lines which are the right size for PA56. Check to see if the string is less than a full PA56 line size.  If it is,
//or the string takes up the full PA56 line and contains no white space, then add it as it is.  Otherwise, trim the string at the word before the last space
//character.  If the string is longer than the maximum character size for a detail line on PA56, then chunk it up into multiple lines, using the rules
//listed above for each line.
function ChunkUpCommentString(commentText) 
{
	// Keep a count of what character we are at as we break up the comments string into lines for update on PA56.
	var charCnt = 0;
	if (commentText == "") 
	{
		CommentDtlLines[CommentDtlLines.length] = "";
		return;
	}
	while (charCnt < commentText.length) 
	{
		var truncatedLine = false; // true if we trim the end of the comment line
		var cmtLine;
		// PA56 can handle up to PA56_DTL_FIELD_SIZE characters on one line.  Grab that many characters and process that string to see if we need to trim the end so we do not
		// get any words split on two lines.
		if ((charCnt + PA56_DTL_FIELD_SIZE) > commentText.length)
			cmtLine = commentText.substring(charCnt, (charCnt + commentText.length));
		else
			cmtLine = commentText.substring(charCnt, (charCnt + PA56_DTL_FIELD_SIZE));
		if (cmtLine.length < PA56_DTL_FIELD_SIZE) 
		{
			// this string is less than a full PA56 line; add it as is.
			truncatedLine = true;
			CommentDtlLines[CommentDtlLines.length] = cmtLine;
			charCnt += cmtLine.length;
		} 
		else 
		{
			if (cmtLine.charAt(cmtLine.length - 1) != " ") 
			{
				var j = cmtLine.length - 1;
				while ((j >= 0) && (cmtLine.charAt(j) != " ")) 
				{
					j--;
				}
				// this string fills the whole PA56 line and contains no white space; add it as is.
				if (j < 0)
					CommentDtlLines[CommentDtlLines.length] = cmtLine;
				else 
				{
					// break this string at the last available space character
					truncatedLine = true;
					CommentDtlLines[CommentDtlLines.length] = cmtLine.substring(0, j + 1);
					charCnt += (j + 1);
				}
			} 
			else 
			{
				// this string fills the whole PA56 line but ends in a space character; add it as is.
				CommentDtlLines[CommentDtlLines.length] = cmtLine;
			}
		}
		// If this line was not trimmed, then move the character count up to the next block of text to process.
		if (!truncatedLine)
			charCnt += PA56_DTL_FIELD_SIZE;
	}
}

function AddComments(dtlLineCounter) 
{	
	// if an error was returned or no new comments exist, abort the update
	if ((dtlLineCounter > 0 && Number(self.lawheader.gmsgnbr) != 0) || (CommentDtlLines.length == 0)) 
	{
		FinishComments(true);
		return;
	}
	var agsObj = new AGSObject(authUser.prodline, "PA56.1");
	agsObj.rtn = "MESSAGE";
	agsObj.longNames = true;
	agsObj.tds = false;
	agsObj.event = "ADD";
	agsObj.field = "FC=A"
	if (Rules[_RULESINDEX].WebImmediate != "Y")
		agsObj.field += "&PGM-NAME=PA52";
	agsObj.field += "&PAC-COMPANY=" + Number(authUser.company)
	+ "&PAC-EMPLOYEE=" + Number(Comments.Employee)
	+ "&PAC-ACTION-CODE-IND=" + Comments.ActionCode
	+ "&PAC-DATE=" + formjsDate(formatDME(Comments.Date))
	+ "&PT-ACTION-TYPE=" + Comments.ActionType
	+ "&PT-PAC-LN-NBR=" + Number(Comments.ActionNbr)
	+ "&PT-IMMEDIATE-FLG=" + Rules[_RULESINDEX].WebImmediate;	
	if (Rules[_RULESINDEX].WebImmediate == "Y")
		agsObj.field += "&PAH-OBJ-ID=1"; 				
	var lineNbr = 0;
	var j;
	for (j = dtlLineCounter; ((j < CommentDtlLines.length) && (lineNbr < PA56_NBR_DETAIL_LINES)); j++) 
	{
		lineNbr++;
		agsObj.field += "&LINE-FC"+lineNbr+"=A"
		+ "&PAC-CMT-TEXT"+lineNbr+"="+escape(CommentDtlLines[j], 1)
		+ "&PAC-PRINT-CODE"+lineNbr+"=Y";
	}
	if ((CommentDtlLines.length - dtlLineCounter) > PA56_NBR_DETAIL_LINES)
		agsObj.func = "parent.AddComments("+j+")";
	else
		agsObj.func = "parent.FinishComments()";
	agsObj.debug = false;
	AGS(agsObj, "jsreturn");
}
