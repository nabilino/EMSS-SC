<!-- This file contains the logic to display the second window that lists the actions for a //-->
<!-- given group. The manager can make the change immediate or pending. This file contains the //-->
<!-- update logic. The error checking is done is paerrors.js //-->

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<HTML>
<HEAD>
<TITLE>Personnel Actions</TITLE>
<META NAME="Generator" CONTENT="TextPad 3.0">
<META NAME="Author" CONTENT="?">
<META NAME="Keywords" CONTENT="?">
<META NAME="Description" CONTENT="?">
<META HTTP-EQUIV="Pragma" 	CONTENT="No-Cache">
<META HTTP-EQUIV="Expires" 	CONTENT="Mon, 01 Jan 1990 00:00:01 GMT">
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<link rel="alternate stylesheet" type="text/css" id="ui" title="classic" href="/lawson/xhrnet/ui/ui.css"/>
<link rel="alternate stylesheet" type="text/css" id="uiLDS" title="lds" href="/lawson/webappjs/lds/css/ldsEMSS.css"/>
<script type="text/javascript" src="/lawson/webappjs/data.js"></script>
<script type="text/javascript" src="/lawson/webappjs/transaction.js"></script>
<script type="text/javascript" src="/lawson/webappjs/common.js"></script>
<script type="text/javascript" src="/lawson/webappjs/commonHTTP.js"></script>
<script type="text/javascript" src="/lawson/webappjs/user.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/email.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/esscommon80.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/dr.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/empinfo.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/xml/xmldateroutines.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/ui/ui.js"></script>

<script src="/lawson/webappjs/javascript/objects/StylerBase.js?emss"></script>
<script src="/lawson/webappjs/javascript/objects/emss/StylerEMSS.js"></script>
<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>
<script src="/lawson/webappjs/javascript/objects/ActivityDialog.js"></script>
<script src="/lawson/webappjs/javascript/objects/OpaqueCover.js"></script>
<script src="/lawson/webappjs/javascript/objects/Dialog.js"></script>

<script src="/lawson/webappjs/javascript/objects/ProcessFlow.js"></script>
<script src="/lawson/webappjs/javascript/objects/Data.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/personnelactions/personnelactionsfiles/pactionslib.js"></script>
<script src="/lawson/xhrnet/waitalert.js"></script>
<SCRIPT>

// JRZ Address Change Setup

// list of the valid state codes that we have set up in Lawson
//var validStateCodes = new Array("AL","AK","AS","AZ","AR","CA","CO","CT","DE","DC","FM","FL","GA","GU","HI","ID","IL","IN","IA","KS","KY","LA","ME","MH","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","MP","OH","OK","OR","PW","PA","PR","RI","SC","SD","TN","TX","UT","VT","VI","VA","WA","WV","WI","WY");
var validStateCodes = new Array("ID","MO","OR","AL","AZ","MT","NV","CA","TN");

var prm 			= window.location.search.substring(1);
var _DRINDEX 		= prm.split(",")[0];
var _RULESINDEX 	= prm.split(",")[1];
var Highlight 		= "#7FFFD4"
var Background 		= "#FFFFFF"
var Dark 			= "#66CDAA"
var Shadow 			= "#458B74"
var authUser 		= opener.authUser;
var Rules 			= opener.Rules;
var Data;
var FailedWithChange= false;
var	EVENT			= '';
var	FC				= '';
var StopWatch 		= "/lawson/xhrnet/images/stopwtch.gif";
var ReturnedSchDist	= false; // PT 105729
var SchoolDistWin; // PT 105729
var ValuesNew;    //PT158883
function DataObject(Field, CurrentValue, ChangeText, SelectValue, SelectBoxName, FldNbr, Options, gstring)
{
	this.Field = Field
	this.CurrentValue = CurrentValue;
	this.ChangeText = ChangeText
	this.SelectValue = SelectValue;
	this.SelectBoxName = SelectBoxName;
	this.FldNbr = FldNbr;
	this.Options = Options
	this.gstring = gstring;
}

function InitializeLawheader()
{
	var Length = 36;

	self.lawheader.Items 		= new Array(Length);
	self.lawheader.Fields 		= new Array(Length);
	self.lawheader.ValuesNew 	= new Array(Length);
	self.lawheader.ValuesPre 	= new Array(Length);

	self.lawheader.Xmit = new Array()
	self.lawheader.HiddenKeys = ""; // PT 152887
	self.lawheader.OrigCompany = "";
	self.lawheader.OrigEmployee = "";
	self.lawheader.OrigActionCode = "";
	self.lawheader.OrigEffectDate = "";
}

function GetPersactypeForSecondWindow()
{
	TaxLocatorVariable = false;
	EVENT	= '';
	FC		= '';

	InitializeLawheader()
	self.lawheader.UpdateType = "PA52.1";

	showWaitAlert("Collecting Action Information...")

	var pAGSObj 			= new AGSObject(authUser.prodline, "PA52.1")
		pAGSObj.event		= "ADD" // PT 152887
		pAGSObj.rtn			= "DATA"
		pAGSObj.longNames	= true;
		pAGSObj.tds			= false;
		pAGSObj.field		= "FC=I" // PT 152887
			+ "&PCT-COMPANY=" 		+ escape(authUser.company)
			+ "&PCT-ACTION-CODE=" 	+ escape(Rules[_RULESINDEX].ActionCode)
			+ "&PCT-EMPLOYEE=" 		+ escape(authUser.employee)
			+ "&PCT-EFFECT-DATE=" 	+ escape(formjsDate(Rules[_RULESINDEX].EffectiveDate))
			+ "&IMMEDIATE-ACTION="	+ escape(Rules[_RULESINDEX].WebImmediate)

		pAGSObj.func		="parent.GenerateArray()"
		pAGSObj.debug 		= false;
	AGS(pAGSObj,"jsreturn");
}

function GenerateArray()
{
	Data = new Array();
	var objLaw = self.lawheader
	ValuesNew = self.lawheader.ValuesNew;
	for(var n=0;n<objLaw.Items.length;n++)
	{
		if(objLaw.Items[n])
		{
			Data[Data.length] = new DataObject(  objLaw.Items[n],
												(!objLaw.ValuesPre[n]) ? "" : objLaw.ValuesPre[n],
												(!objLaw.ValuesNew[n]) ? "" : objLaw.ValuesNew[n],
												'',
												"select"+n,
												parseInt(objLaw.Fields[n],10),
												null,
												objLaw.Items[n].split('\ ').join(''));
			// PT 105729
			if(!Rules[_RULESINDEX].AddressChange || !Rules[_RULESINDEX].SuppAddrChange)
				CheckForAddressChange(parseInt(objLaw.Fields[n],10));
		}
	}
	GetEmailAddress();
}

// PT 105729
// Check if an address field is being changed.  If so, we will need to send an email following an update.
function CheckForAddressChange(fldNbr)
{
	// EMP-ADDR1, EMP-ADDR2, EMP-ADDR3, EMP-ADDR4, EMP-CITY, EMP-STATE, EMP-ZIP, EMP-COUNTY, EMP-COUNTRY-CODE
	if (fldNbr == 5 || fldNbr == 6 || fldNbr == 157 || fldNbr == 158 || fldNbr == 7 || fldNbr == 8 || fldNbr == 9 || fldNbr == 568
	|| fldNbr == 10)
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
	var syr_company = authUser.company.toString()
	for (var i=syr_company.length; i<4; i++)
		syr_company = "0" + syr_company

	var pDMEObj 		= new DMEObject(authUser.prodline, "SYSRULES");
		pDMEObj.out 	= "JAVASCRIPT";
		pDMEObj.field 	= "email-address;alphadata2"
		pDMEObj.key     = "EMAILNOTIFICATION=HR="+syr_company+"="+escape(" ",1)+"=1=N=N"
		pDMEObj.max		= "1";
		pDMEObj.debug 	= false;
		pDMEObj.func 	= "FinishdedGettingEmailAddress()";
	DME(pDMEObj,"jsreturn");
}

function FinishdedGettingEmailAddress()
{
	if(self.jsreturn.NbrRecs)
	{
		Rules[_RULESINDEX].EmailAddress = self.jsreturn.record[0].email_address;
		Rules[_RULESINDEX].DoEmail = self.jsreturn.record[0].alphadata2;
	}
	GetTaxFilters();
}

// PT 105729
function GetTaxFilters()
{
	var fields = "tax-filter;process-level.emp-tax-addr;process-level.tax-filter"
		GetEmpInfo(authUser.prodline,Rules[_RULESINDEX].Company,Rules[_RULESINDEX].Employee,"employee",
		fields,"FinishedGettingTaxFilters()");
}

function FinishedGettingTaxFilters()
{
	if(self.jsreturn.NbrRecs)
	{
		Rules[_RULESINDEX].EmpTaxFilter = EmpInfo.tax_filter;
		Rules[_RULESINDEX].PrsEmpTaxAddr = EmpInfo.process_level_emp_tax_addr;
		Rules[_RULESINDEX].PrsTaxFilter = EmpInfo.process_level_tax_filter;
	}
	PaintActions();
}

// JRZ map current value data to field names for display
var originalNameToField = {
  "addr1": "address_addr1",
  "addr2": "address_addr1",
  "city": "address_city",
  "state": "address_state",
  "zip": "address_zip",
  "phone": "address_phone",
  "supp_addr1": "address_supp_addr1",
  "supp_addr2": "address_supp_addr2",
  "supp_city": "address_supp_city",
  "supp_state": "address_supp_state",
  "supp_zip": "address_supp_zip",
  "supp_phone": "address_supp_phone"
};

// JRZ map field names to PA field names
// this needs to be in the exact same order that your PA has the fields
var fieldToPA = new Array(
"address_addr1",
"address_addr2",
"address_city",
"address_state",
"address_zip",
"address_phone",
"address_supp_addr1",
"address_supp_addr2",
"address_supp_city",
"address_supp_state",
"address_supp_zip",
"address_supp_phone"
);

function PaintActions()
{
	var positionFldIndex = -1;

	with(self.HEADER.document)
	{
		write('<body bgcolor='+Background+'>')
		// JRZ changing the tips link to be a link to the Postal Service address reqs
    write('<a href="http://www.usps.com/ncsc/lookups/usps_abbreviations.htm" target="_new">')
		write('Address Formatting Help</a>')
		write('<div align=center>')
		write('<font style="font-family:arial;font-size:12pt;font-weight:bold;color:black;">')
		write('Enter the </font>')
		write('<font style="font-family:arial;font-size:12pt;font-weight:bold;color:blue;">')
		write(Rules[_RULESINDEX].Description)
		write('</font>')
		write('<font style="font-family:arial;font-size:12pt;font-weight:bold;color:black;">')
		write(' for ')
		write('<font style="font-family:arial;font-size:12pt;font-weight:bold;color:red;">')
		write(Rules[_RULESINDEX].EmployeeName)
		write('</font>')
		write('<font style="font-family:arial;font-size:12pt;font-weight:bold;color:black;">')
		write('.')
		// PT 107138
		// write('<br>The action will be effective '+formatDME(Rules[_RULESINDEX].EffectiveDate)+ '.</font><p>')
		write('<br>The action will be effective '+ Rules[_RULESINDEX].EffectiveDate + '.</font><p>')
		write('<font style="font-family:arial;font-size:11pt;font-weight:bold;font-style:italic;color:black;">')

    // JRZ not giving the option to switch immediate/pending
		if(Rules[_RULESINDEX].WebImmediate=="Y")
		{
			//write('This change will be updated immediately')
			//write('<p>Check here to pend this action for review ')
			//write('<a href="" onClick="parent.Change();return false;">')
			//write('<img src="/lawson/xhrnet/images/emptychbox.gif"></a>')
		}else {
		//PT 158884 add filter default
    // JRZ add note about how long it will take
			//write('This change will be reviewed and approved within 3 business days.')
    }
    write('</font><font style="font-family:arial;font-size:10pt;font-weight:normal;color:black;">')
    write('<p align="center">');
    write('<table border="1">');
    write('<tr>');
    write('<td><font style="color:blue;font-weight:bold;font-size:10pt">General<br/>Rules:</font></td>');
    write('<td><font style="font-size:10pt">');
    write('All changes you make are immediate.<br/>');
    write('Include area code with phone number like this: 208-123-4567<br/>');
    write('Enter your address in Address 1 (the length is 30 characters).  If your address is greater than the maximum, continue on Address 2.<br/>');
    write('If the state you are moving to is not listed, use the contact phone number below.<br/>');
    write('<b>For help, view the <a href="/lawson/xhrnet/personnelactions/Online-Address-Guide.pdf" target="_new">Online Instructions</a> or call your HR department:</b><br/>');
    write('<b>&nbsp;&nbsp;Boise/Meridian - 208-381-2470, WR - 208-727-8487, MV - 208-737-2135</b><br/>');
    write('</font></td></tr>');
    write('</p>');
		write('</font><form name=reasons>')
    // JRZ no need to enter reasons for address change
    write('<input type=hidden name=reason1 value=""/>');
    write('<input type=hidden name=reason2 value=""/>');
		close();
	}
	stylePage();
	with(self.CONTROLITEM.document)
	{
		write('<body bgcolor='+Background+'>')
    

		// JRZ add my own better fields
  write('<div style="clear:left"></div>');
  write('<div id="mailing_address" style="float:left;width:350px">');
	write('<h3>Mailing Address</h3>');
  write('<div style="height:30px"></div>');
	write('<div style="float:left;width:90px">Address 1:</div><div style="float:left"><input id="address_addr1" type="text" size="30" maxlength="30"/></div><div style="clear:left"></div>');
	write('<div style="float:left;width:90px">Address 2:</div><div style="float:left"><input id="address_addr2" type="text" size="30" maxlength="30"/></div><div style="clear:left"></div>');
	write('<div style="float:left;width:90px">City:</div><div style="float:left"><input id="address_city" type="text" size="30" maxlength="30"/></div><div style="clear:left"></div>');
	write('<div style="float:left;width:90px">State:</div><div style="float:left">');
	write('<select id="address_state" >');
	for(var vs in validStateCodes) {
	  write('<option value="'+validStateCodes[vs]+'" ');
	  write('>'+validStateCodes[vs]+'</option>');
	}
	write('</select>');
	write('</div><div style="clear:left"></div>');
	write('<div style="float:left;width:90px">Zip:</div><div style="float:left"><input id="address_zip" type="text" size="10" maxlength="10"/></div><div style="clear:left"></div>');
  write('</div>');
  write('<div style="float:left;width:350px">');
	write('<h3>Home/Physical Address</h3>');
  write('<div style="height:30px"><input type="checkbox" name="supplemental_same" onclick="parent.updateSupplementalSame();"> Home/Physical Address is same as mailing</div>');
	write('<div id="supplemental_address" style="visiblity:visible">');
	write('<div style="float:left;width:75px">Address 1:</div><div style="float:left"><input id="address_supp_addr1" type="text" size="30" maxlength="30"/></div><div style="clear:left"></div>');
	write('<div style="float:left;width:75px">Address 2:</div><div style="float:left"><input id="address_supp_addr2" type="text" size="30" maxlength="30"/></div><div style="clear:left"></div>');
	write('<div style="float:left;width:75px">City:</div><div style="float:left"><input id="address_supp_city" type="text" size="30" maxlength="30"/></div><div style="clear:left"></div>');
	write('<div style="float:left;width:75px">State:</div><div style="float:left">');
	write('<select id="address_supp_state" >');
	for(var vs in validStateCodes) {
	  write('<option value="'+validStateCodes[vs]+'" ');
	  write('>'+validStateCodes[vs]+'</option>');
	}
	write('</select>');
	write('</div><div style="clear:left"></div>');
	write('<div style="float:left;width:75px">Zip:</div><div style="float:left"><input id="address_supp_zip" type="text" size="10" maxlength="10"/></div><div style="clear:left"></div>');
	write('</div>');
  write('</div>');
  write('<div style="clear:left"></div>');
	write('<div style="float:left;width:90px">Home Phone:</div><div style="float:left"><input id="address_phone" type="text" size="30" maxlength="30"/></div><div style="clear:left"></div>');
	write('<div style="float:left;width:90px">Cell Phone:</div><div style="float:left"><input id="address_supp_phone" type="text" size="30" maxlength="30"/></div><div style="clear:left"></div>');		
    //write('<p><input type="button" onclick="parent.addressChangeLogic();" value="Do it!" /><input type="button" onclick="parent.resetAddressForm();" value="Reset" /></p>');
    
    
    
		write('<form name=persaction><p>')
    // JRZ making main form hidden
    write('<div style="visibility:hidden">');
		write('<table border=0 width=700 cellpadding=0 cellspacing=0 align=center>')
		write('<tr><td width=200>')
		write('<font style="font-family:arial;font-size:12pt;font-weight:bold;color:black;">')
		write('Field</font><td width=220>')
		write('<font style="font-family:arial;font-size:12pt;font-weight:bold;color:black;">')
		write('Current Value<br/></font><font style="font-family:arial;font-size:10pt;color:black;">Max 20 letters displayed</font>')
		write('<td align=absmiddle width=200>')
		write('<font style="font-family:arial;font-size:12pt;font-weight:bold;color:black;">')
		write('Change To</font>')
		write('<td align=center width=80>')
		write('<font style="font-family:arial;font-size:12pt;font-weight:bold;color:black;">')
		write('Clear<br/>Current</font>')
    
		if(!Data.length)
		{
			write('<tr><td><font style="font-family:arial;font-size:14pt;font-weight:bold;color:black;">')
			write('No Fields Available</font></td></tr></table></form>')
		}
		else
		{
			for(var n=0;n<Data.length;n++)
			{
				write('<tr><td><font style="font-family:arial;font-size:10pt;font-weight:bold;color:black;">')
				write(Data[n].Field+'</font><td><font style="font-family:arial;font-size:10pt;font-weight:bold;color:black;">')
				write(Data[n].CurrentValue+'</font><td nowrap>')

				if(Data[n].FldNbr==62)
				{
					var rateAmount = (Data[n].ChangeText) ? roundToDecimal(parseFloat(((Data[n].ChangeText/Data[n].CurrentValue)-1)*100),4) : '';

					write('<input type=text size=6 maxlength=6 name=percentage onBlur=parent.Calculate(this.form,'+n+',"percent") value="'+rateAmount+'" maxlength=5>')
					write('% =&nbsp; &nbsp;')
					write('<input type=text size=15 name=select'+n+' id=select'+n+' onBlur=parent.Calculate(this.form,'+n+',"amount") value="')

					if(Data[n].ChangeText)
						write(roundToDecimal(Data[n].ChangeText,4))

					write('">')
				}
				else if (emssObjInstance.emssObj.filterSelect) {
          // launch user fields as pop-ups, and allow user to enter value in text box
          if (Data[n].FldNbr == 126) {
            write('<input type="hidden" name="select'+n+'_indicator" id="select'+n+'_indicator" >')
            write('<input type="hidden" name="select'+n+'_effectdate" id="select'+n+'_effectdate" >')
            write('<input type="text" name="select'+n+'" id="select'+n+'" style="width:200px" onkeyup="parent.keyUp('+n+',this.form)">')
          } else {
            write('<input type="text" name="select'+n+'" id="select'+n+'" style="width:200px">')
          }
        }	else {
          write('<input type=text size=30 maxlength=30 id=select'+n+' onBlur=parent.StoreText('+n+',this.form) value="')

					if(Data[n].ChangeText != null && typeof(Data[n].ChangeText)!='undefined')
						write(Data[n].ChangeText)

					write('">')
				}

				//PT 158883
				if(Data[n].FldNbr == 126) {
					positionFldIndex = n;
				}
				//PT 158884 add filter default
				if(HardCodedLists[Data[n].FldNbr]!=null && typeof(HardCodedLists[Data[n].FldNbr])!="undefined")
				{
					write('&nbsp;<a href="" onClick="parent.RuntoBox(\'select'+n+'\','+Data[n].FldNbr+',\'HARDCODED\');return false;">')
					write('<img src="/lawson/xhrnet/images/selarrow.gif" border=0></a>')

				}
				else if(DMEFunctions[Data[n].FldNbr]!=null && typeof(DMEFunctions[Data[n].FldNbr])!="undefined")
				{
					write('&nbsp;<a href="" onClick="parent.RuntoBox(\'select'+n+'\','+Data[n].FldNbr+',\'DME\');return false;">')
					write('<img src="/lawson/xhrnet/images/selarrow.gif" border=0></a>')
				}
				else if(2000<=Data[n].FldNbr && Data[n].FldNbr<=2099)
				{
					write('&nbsp;<a href="" onClick="parent.RuntoBox(\'select'+n+'\','+Data[n].FldNbr+',\''+Data[n].FldNbr.toString().substring(2)+'\');return false;">')
					write('<img src="/lawsonx/hrnet/images/selarrow.gif" border=0></a>')
				}
      
        // JRZ add clear box to avoid *BLANK confusion
        write('<td align="center"><input type="checkbox" name="clearme'+n+'" id="clearme'+n+'" onclick="parent.toggleBlank(this,'+n+')"/></td>');        
      
			}
      // JRZ added close div for hidden
			write('</td></tr></table></div></form>')
		}
		
		close();
	}

	with(self.BUTTONS.document)
	{
		write('<form><body bgcolor='+Background+'><div align=center>')
    // JRZ added in our custom address translation logic
		write('<input type=button value="Update" onClick="if(parent.addressChangeLogic()) { parent.Update(); }">')
		// PT 99952
		// write('&nbsp;&nbsp;&nbsp;<input type=button value="Back" onClick="parent.close()">')
		//PT 158883
		if (positionFldIndex >= 0) {
		write('&nbsp;&nbsp;&nbsp;<input type=button value="Fill Defaults" onClick="parent.fillDefaults('+positionFldIndex+')">')
		}
		write('&nbsp;&nbsp;&nbsp;<input type=button value="Back" onClick="parent.CloseActionWindows()">')
		write('</form>')
		close();
	}

	removeWaitAlert();
	
  // JRZ load the initial values into our address form
  resetAddressForm();

}
function keyUp(n,obj){
eval('obj.select'+n+'_indicator').value ='';
eval('obj.select'+n+'_effectdate').value ='';
}

// JRZ
// purpose of function is to validate all of our own fields
// then go through and map to the appropriate PA fields to prepare a good upload
function addressChangeLogic() {
  // if the home same as mailing is checked, update the fields
  updateSupplementalSame();
  
  // FIELD VALIDATION
  
  // convert all to upper case
  for(var f in fieldToPA) {
    var fField = self.CONTROLITEM.document.getElementById(fieldToPA[f]);
    fField.value = fField.value.toUpperCase();
  }
  
  // validate address/city fields to remove invalid chars
  var addressFields = new Array("address_addr1","address_addr2","address_supp_addr1","address_supp_addr2","address_city","address_supp_city");
  for(var af in addressFields) {
    var aField = self.CONTROLITEM.document.getElementById(addressFields[af]);
    if(aField.value != '') {
      aField.value = formatAddressLine(aField.value);
    }
  }
  
  // validate phone number to format properly if possible
  var phoneFields = new Array("address_phone","address_supp_phone");
  for(var pf in phoneFields) {
    var pField = self.CONTROLITEM.document.getElementById(phoneFields[pf]);
    if(pField.value != '') {
      var newPhone = formatPhoneNumber(pField.value);
      if(newPhone == "0") {
        alert("Invalid phone number, please enter phone number in format aaa-bbb-cccc");
        return false;
      }
      pField.value = newPhone;
    }

  }
  
  // validate zip code to format properly if possible
  var zipFields = new Array("address_zip","address_supp_zip");
  for(var zf in zipFields) {
    var zField = self.CONTROLITEM.document.getElementById(zipFields[zf]);
    if(zField.value != '') {
      var newZip = formatZip(zField.value);
      if(newZip == "0") {
        alert("Invalid zip format, please enter zip code as 12345 or 12345-6789");
        return false;
      }
      zField.value = newZip;
    }
  }
  
  // save fields off into an array to do compares with current values easier
  var newValues = new Object();
  for(var f in fieldToPA) {
    newValues[fieldToPA[f]] = self.CONTROLITEM.document.getElementById(fieldToPA[f]).value;
  }
  
  // Lawson ERROR Cases
  
  // 1) home phone overwriting supp phone
  // we will send up an alert box but still send data
  // if:
  //   system reg/supp address is the same
  //   no address changes entered
  //   reg phone changes
  //   supp phone doesn't
  //     then reg phone will overwrite supp phone automatically via Lawson
  if(isCurrentFieldsSame() &&
     !isNewAddressChange() &&
     opener.addressData.address_phone != newValues.address_phone &&
     opener.addressData.address_supp_phone == newValues.address_supp_phone
    ) {
     alert("Warning!: Due to a system limitation, your Cell phone # will mistakenly become the same\nas your Home phone # when this change processes.\nAfter this change has processed,\nplease come back in and change your Cell phone #.\nThanks, St. Luke's HRIS");
  }
  
  // 2) Home address unexpectedly overwriting supp address
  // we will send up an alert box but still send data
  // if: 
  //   system reg/supp address is the same
  //   "same as mailing" checkbox is unchecked
  //   reg address changes
  //   supp address doesn't
  //     then reg address will overwrite supp address automatically via Lawson
  if(isCurrentFieldsSame() &&
     !(self.CONTROLITEM.document.getElementById("supplemental_same").checked) &&
     !isNewRegularSame() &&
     isNewSupplementalSame()) {
    alert("Warning!: Due to a system limitation, your Home/Physical address will mistakenly become the same\nas your Mailing address when this change processes.\nAfter this change has processed,\nplease come back in and change your Home/Physical Address.\nThanks, St. Luke's HRIS");
  }
  
  // FIELD MAPPING
  for(var f in fieldToPA) {
    // if previous not blank and current is blank, then use *blank
	  if(opener.addressData[fieldToPA[f]] != '' && newValues[fieldToPA[f]] == '') {
	    self.CONTROLITEM.document.getElementById("select"+f).value = "*BLANK";
	  }
	  // if current != previous, send it
	  else if(newValues[fieldToPA[f]] != opener.addressData[fieldToPA[f]]) {
	    self.CONTROLITEM.document.getElementById("select"+f).value = self.CONTROLITEM.document.getElementById(fieldToPA[f]).value;
	  }
	  // else don't send (empty out field)
	  else {
      self.CONTROLITEM.document.getElementById("select"+f).value = '';
	  }
  }
  
  return true;
}

// JRZ if the current address values are the same for both regular and supplemental
function isCurrentAddsSame() {
  return (opener.addressData.address_addr1 == opener.addressData.address_supp_addr1 &&
          opener.addressData.address_addr2 == opener.addressData.address_supp_addr2 &&
		      opener.addressData.address_city == opener.addressData.address_supp_city &&
		      opener.addressData.address_state == opener.addressData.address_supp_state &&
		      opener.addressData.address_zip == opener.addressData.address_supp_zip);
}

// JRZ if the current Lawson defined address values (address + phone) are the same for both regular and supplemental
function isCurrentFieldsSame() {
  return (isCurrentAddsSame() && opener.addressData.address_phone == opener.addressData.address_supp_phone);
}

// JRZ did regular address change from current to new?
function isNewRegularSame() {
  var mydoc = self.CONTROLITEM.document;
  return (mydoc.getElementById("address_addr1").value == opener.addressData.address_addr1 &&
          mydoc.getElementById("address_addr2").value == opener.addressData.address_addr2 &&
		      mydoc.getElementById("address_city").value == opener.addressData.address_city &&
		      mydoc.getElementById("address_state").value == opener.addressData.address_state &&
		      mydoc.getElementById("address_zip").value == opener.addressData.address_zip);
}

// JRZ did supp address change from current to new?
function isNewSupplementalSame() {
  var mydoc = self.CONTROLITEM.document;
  return (mydoc.getElementById("address_supp_addr1").value == opener.addressData.address_supp_addr1 &&
          mydoc.getElementById("address_supp_addr2").value == opener.addressData.address_supp_addr2 &&
		      mydoc.getElementById("address_supp_city").value == opener.addressData.address_supp_city &&
		      mydoc.getElementById("address_supp_state").value == opener.addressData.address_supp_state &&
		      mydoc.getElementById("address_supp_zip").value == opener.addressData.address_supp_zip);
}

// JRZ any address fields different between current and new values?
function isNewAddressChange() {
  return (!isNewRegularSame() || !isNewSupplementalSame());
}

// JRZ checkbox event handler
var oldChecked = false;
function updateSupplementalSame() {
  var isChecked = self.CONTROLITEM.document.getElementById("supplemental_same").checked;

  // every time box state changes, the addresses should be the same
  // or if the box is checked, should be the same
  if(oldChecked != isChecked || isChecked) {
    self.CONTROLITEM.document.getElementById("address_supp_addr1").value = self.CONTROLITEM.document.getElementById("address_addr1").value;
    self.CONTROLITEM.document.getElementById("address_supp_addr2").value = self.CONTROLITEM.document.getElementById("address_addr2").value;
    self.CONTROLITEM.document.getElementById("address_supp_city").value = self.CONTROLITEM.document.getElementById("address_city").value;
    self.CONTROLITEM.document.getElementById("address_supp_state").value = self.CONTROLITEM.document.getElementById("address_state").value;
    self.CONTROLITEM.document.getElementById("address_supp_zip").value = self.CONTROLITEM.document.getElementById("address_zip").value;  
  }
  
  // save off old state
  oldChecked = isChecked;

  // if just was checked, hide form
  if(isChecked) {
    self.CONTROLITEM.document.getElementById("supplemental_address").style.visibility = "hidden";
  }
  else {
    self.CONTROLITEM.document.getElementById("supplemental_address").style.visibility = "visible";
  }
}

// JRZ reset the form values back to what is in the system for current value
function resetAddressForm() {
  for(var f in fieldToPA) {
	  self.CONTROLITEM.document.getElementById(fieldToPA[f]).value = opener.addressData[fieldToPA[f]];
  }
  
	// clear checkbox
	var checkboxInput = self.CONTROLITEM.document.getElementById("supplemental_same");
	if(checkboxInput.checked) {
    oldChecked = false;
	  checkboxInput.click();
	}
  
  // if regular/supp are the same, pre-select the checkbox
	if(isCurrentAddsSame()) {
    oldChecked = true;
	  checkboxInput.click();
	}
}

// JRZ handler on checkbox click for *BLANK
function toggleBlank(e,n) {
  var input = eval('self.CONTROLITEM.document.persaction.select'+n);
  // if checked, then going to be unchecked
  if(e.checked) {
    input.value = "*BLANK";
    input.disabled = true;
  }
  else {
    input.value = "";
    input.disabled = false;
  }
}
//~JRZ

// Override Pay Rate Calculate function so that it works within the main browser frame.
function Calculate(obj,index,cal)
{
	var val = parseFloat(Data[index].CurrentValue);

	if(cal=="percent")
	{
		var thisObj = obj.percentage
		var selObj = eval('self.CONTROLITEM.document.persaction.select'+index)

		if (isNaN(parseFloat(thisObj.value)))
			return

		// Format the pay rate amount value to four decimal places to avoid PA52 edit.
		var arg = roundToDecimal(((parseFloat(thisObj.value)+100)/100) * val,4)
	}
	else
	{
		var thisObj = eval('obj.select'+index)
		var selObj = self.CONTROLITEM.document.persaction.percentage

		if (isNaN(parseFloat(thisObj.value)))
			return

		var arg = roundToDecimal(((parseFloat(thisObj.value)*100) / val) - 100,4);
	}

	// Check for a valid number before storing the change.
	if (isNaN(parseFloat(arg)))
		return

	selObj.value = arg;
	StoreText(index,self.CONTROLITEM.document.persaction)
}

function StoreText(n,obj)
{
	Data[n].ChangeText = eval('obj.select'+n).value;
}
//PT 158884
function RuntoBox(selectID,fldnbr,myString)
{
	MakeCallToDME(selectID,fldnbr, myString,true)
}

function OpenWinTips()
{ //PT 162111
	var tex = window.open("/lawson/xhrnet/tipsfolder/patips.htm","PERSONALACTIONSTIPS","width=300,height=500,resizable=yes,toolbar=no");
	tex.focus();
}

function Change()
{
	Rules[_RULESINDEX].WebImmediate = (Rules[_RULESINDEX].WebImmediate == "Y") ? "N" : "Y";
	Toggle();
}

function Toggle()
{
	var CheckBox_Checked = "/lawson/xhrnet/images/redchbox.gif";
	var CheckBox_Empty = "/lawson/xhrnet/images/emptychbox.gif";

	self.HEADER.document.images[1].src = (Rules[_RULESINDEX].WebImmediate == "N") ? CheckBox_Checked : CheckBox_Empty;
}

/***PT 158883 chages start here*********/
function storePosition(n)
{
	for (var i=0; i<Data.length; i++) {
		var obj = self.CONTROLITEM.document.getElementById("select" +i);
		var value = obj.value;

		if (value == null || (NonSpace(value) == 0) || (i != n))
		{
			Data[i].ChangeText = "";
			obj.value = "";
		}
		else
		{
			Data[i].ChangeText = value;
		}
	}
}


function fillDefaults(n)
{
var position = self.CONTROLITEM.document.getElementById("select"+n);

if(position.value ==''){
alert("Position is Required");
return;
}
storePosition(n);

var pAGSObj = new AGSObject(authUser.prodline,"PA52.1")

	pAGSObj.event	= "CHG"
	pAGSObj.rtn		= "DATA"
	pAGSObj.longNames= true
	pAGSObj.tds		= false
	pAGSObj.field	= "FC=F"
			+ "&PCT-COMPANY=" 			+escape(authUser.company)
			+ "&PCT-ACTION-CODE=" 		+escape(Rules[_RULESINDEX].ActionCode)
			+ "&PCT-EMPLOYEE=" 			+escape(authUser.employee)
			+ "&PCT-EFFECT-DATE=" 		+escape(formjsDate(Rules[_RULESINDEX].EffectiveDate))
			+ "&IMMEDIATE-ACTION=" 		+escape(Rules[_RULESINDEX].WebImmediate)

	var count = 1;

	for(var i=0,j=1;i<Data.length;i++)
	{
		index = parseInt((String(j))+(String(count)),10)
		if ((Data[i].FldNbr == 126) && (Data[i].ChangeText != ""))
		{
			pAGSObj.field += "&PCT-NEW-VALUE-"+index+"="	+escape(Data[i].ChangeText)
			pAGSObj.field += "&PAT-FLD-NBR-"+index+"="	+escape(self.lawheader.Fields[i])
		}

		if(++count>12)
		{
			j++
			count=1
		}
	}
	pAGSObj.field 		+= "&_HK=" + escape(self.lawheader.HiddenKeys,1) // PT 152887
	pAGSObj.field += "&ORIG-COMPANY=" + escape(self.lawheader.OrigCompany,1)
	pAGSObj.field += "&ORIG-EMPLOYEE=" + escape(self.lawheader.OrigEmployee,1)
	pAGSObj.field += "&ORIG-ACTION-CODE=" + escape(self.lawheader.OrigActionCode,1)
	pAGSObj.field += "&ORIG-EFFECT-DATE=" + escape(self.lawheader.OrigEffectDate,1)
	pAGSObj.dtlField = "PCT-NEW-VALUE-1;PCT-NEW-VALUE-2"; //;PCT-NEW-VALUE-3";
	pAGSObj.func = "parent.fillDefaultsComplete()";
	pAGSObj.debug = false;
	pAGSObj.preInquire = true;

	InitializeLawheader();

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
				//var newVal = objLaw.ValuesNew[n];
				var newDesc = objLaw.ValuesNew[n];

				if (objLaw.ValuesNew[n].toString().indexOf("*BLANK") == 0)
				{
					newDesc = "*BLANK";
				}
					var actionFld = self.CONTROLITEM.document.getElementById("select"+n);

				if (self.CONTROLITEM.document.getElementById("select"+n).type == "text")
				{
					// default field is a text box
					actionFld.value = newDesc;
				}
			}
		}

		alert("Default data has been posted to this personnel action for the position you have selected.")
	}
	else
	{
		alert(self.lawheader.myMsg);
	}

}
function storedata(){

	for (var i=0; i<Data.length; i++) {
		var obj = self.CONTROLITEM.document.getElementById("select"+i);
		var value = "";
		if (obj.type == "text")
		{
			if (obj.value.indexOf("*BLANK") == 0)
			{
				value = "*BLANK";
			}
			else
			{
				value = obj.value;
			}
		}
    
		if (value==null || NonSpace(value)==0) {
			Data[i].ChangeText = "";
    }
		else {

      // JRZ force the values to upper case
      Data[i].ChangeText = value.toUpperCase();
    
      // JRZ add in field-specific filtering
      // field mapping:
      // 5 -> addr 1
      // 6 -> addr 2
      // 7 -> city
      // 8 -> state
      // 9 -> zip
      //10 -> country
      //13 -> phone
      //39 -> supp addr1
      //40 -> supp addr2
      //41 -> supp city
      //42 -> supp state
      //43 -> supp zip
      //44 -> supp country
      //891-> supp phone
      if(Data[i].ChangeText != "*BLANK") {
        if(Data[i].FldNbr == 5 || Data[i].FldNbr == 6 || Data[i].FldNbr == 39 || Data[i].FldNbr == 40 || Data[i].FldNbr == 7 || Data[i].FldNbr == 41 ) {
          Data[i].ChangeText = formatAddressLine(Data[i].ChangeText);
        }
        else if(Data[i].FldNbr == 13 || Data[i].FldNbr == 891) {
        
          Data[i].ChangeText= formatPhoneNumber(Data[i].ChangeText);
          if(Data[i].ChangeText == "0") {
            alert("Invalid phone number, please enter phone number in format aaa-bbb-cccc");
            return false;
          }
        }
      }
      //~JRZ

    }
  }
  return true;
}

// JRZ properly formatting phone number
function formatPhoneNumber(phone) {
  // strip out all non-number characters
  var newphone = phone.replace(/\D/g,'');
  // then insert back in dashes
  if(newphone.length == 10) {
    return newphone.substr(0,3) + "-" + newphone.substr(3,3) + "-" + newphone.substr(6,4);
  }
  else {
    return "0";
  }
}
//~JRZ

// JRZ properly formatting address lines
function formatAddressLine(addr) {
  // removing certain special characters . , # / \ -
  return addr.replace(/[\.,#\/\\-]{1}/g,'');
}
//~JRZ

// JRZ properly formatting zip
function formatZip(zip) {
  // strip out all non-number characters
  var newzip = zip.replace(/\D/g,'');
  // then insert back in dashes
  if(newzip.length == 9) {
    return newzip.substr(0,5) + "-" + newzip.substr(5,4);
  }
  else if(newzip.length == 5) {
    // do nothing, everything is OK
    return newzip;
  }
  else {
    return "0";
  }
}
//~JRZ

/***PT 158883 changes ends here*********/

function Update()
{
	//PT 158883
// CLYNCH DEBUG - 2 LINES
//	alert("start of function update");
//	alert("storedata = " + storedata());
	if(!storedata()) {
	return false;
  }

	// PT 99952
	if(DoesObjectExist(objectWin) && DoesObjectExist(objectWin.myWin) && !objectWin.myWin.closed)
		objectWin.myWin.close()

if(self.CONTROLITEM.document.persaction.percentage)
	{
//	alert("document.persaction.percentage");
	var PerNo=self.CONTROLITEM.document.persaction.percentage;

	//PT 158883
	if (!NonSpace(PerNo.value ) == 0 && PerNo.value.indexOf("*BLANK") != 0)
	{
	if ((isNaN(parseFloat(PerNo.value))))

	{
			alert("Invalid Number");
			PerNo.focus();
			PerNo.select();
			return;
	}
	}
	}
	var ArrayLength;
	showWaitAlert("Saving Action Information...")

	if(EVENT=='' && FC=='')
	{
//		alert("EVENT and FC blank");
		ArrayLength = 36;

		for(var i=0; i<ArrayLength; i++)
		{
			if(typeof(ValuesNew[i])!="undefined" && ValuesNew[i]!='')
			{
//				alert("EVENT SET TO CHANGE, FC SET TO C")
				EVENT = "CHANGE"
				FC = "C"
				break;
			}
		}
		if(i>=ArrayLength)
		{
//			alert("EVENT SET TO CHANGE, FC SET TO A")
			EVENT = "CHANGE"
			FC = "A"
		}
	}
	TaxLocatorVariable = false; // PT 105729
	CheckMsg()
}

function CheckMsg()
{
//	alert("Start function CheckMsg");
	var pAGSObj = new AGSObject(authUser.prodline,"PA52.1")

	if(Rules[_RULESINDEX].WebImmediate == "Y" && FC == "C")
	{
		MsgBox("You cannot change an already existing action to an immediate action. Therefore the action will pended");
		Rules[_RULESINDEX].WebImmediate = "N";
	}

	pAGSObj.event	= EVENT
	pAGSObj.rtn		= "DATA"
	pAGSObj.longNames= true
	pAGSObj.tds		= false
	pAGSObj.field	= "FC="+FC
			+ "&PCT-COMPANY=" 			+escape(authUser.company)
			+ "&PCT-ACTION-CODE=" 		+escape(Rules[_RULESINDEX].ActionCode)
			+ "&PCT-EMPLOYEE=" 			+escape(authUser.employee)
			+ "&PCT-EFFECT-DATE=" 		+escape(formjsDate(Rules[_RULESINDEX].EffectiveDate))
			+ "&IMMEDIATE-ACTION=" 		+escape(Rules[_RULESINDEX].WebImmediate)
			+ "&BYPASS-POPUPS=Y"
			+ "&PCT-REASON1=" 			+escape(self.HEADER.document.reasons.reason1.value)
			+ "&PCT-REASON2=" 			+escape(self.HEADER.document.reasons.reason2.value)

	var count = 1;
//	alert("SET fields completed");
//	alert("Data Length = " + Data.length);
	for(var i=0,j=1;i<Data.length;i++)
	{
//		alert("In parsing fields loop");
		index = parseInt((String(j))+(String(count)),10)
//		alert("Data[i].ChangeText = " + Data[i].ChangeText);
		if(Data[i].ChangeText!='')
		{
			pAGSObj.field += "&PCT-NEW-VALUE-"+index+"="	+escape(Data[i].ChangeText)
			pAGSObj.field += "&PAT-FLD-NBR-"+index+"="	+escape(self.lawheader.Fields[i])
		}

		if(++count>12)
		{
			j++
			count=1
		}
	}
	pAGSObj.field += "&_HK=" + escape(self.lawheader.HiddenKeys,1) // PT 152887
	pAGSObj.field += "&ORIG-COMPANY=" + escape(self.lawheader.OrigCompany,1)
	pAGSObj.field += "&ORIG-EMPLOYEE=" + escape(self.lawheader.OrigEmployee,1)
	pAGSObj.field += "&ORIG-ACTION-CODE=" + escape(self.lawheader.OrigActionCode,1)
	pAGSObj.field += "&ORIG-EFFECT-DATE=" + escape(self.lawheader.OrigEffectDate,1)
// MOD BY BILAL	
	pAGSObj.field += "&XMIT-IMMED=1"
	pAGSObj.field += "&XMIT-HREMP-BLOCK=1000"
// END OF MOD
	pAGSObj.dtlField = "PCT-NEW-VALUE-1;PCT-NEW-VALUE-2"; //;PCT-NEW-VALUE-3";
	pAGSObj.func = "parent.CheckForErrors()";
	pAGSObj.debug = false;
//	alert("Finished setting company, employee, dates.");

		pAGSObj.preInquire = true;
	AGS(pAGSObj,"jsreturn")
//	alert("Exiting CheckMsg");
}

function Updated()
{


	var pAGSObj = new AGSObject(authUser.prodline, "PA52.1")
	showWaitAlert("Saving Action Information...")

	pAGSObj.event	= EVENT
	pAGSObj.rtn		= "DATA"
	pAGSObj.longNames= true
	pAGSObj.tds		= false
	pAGSObj.field	= "FC="+FC
			+ "&PCT-COMPANY=" 			+escape(authUser.company)
			+ "&PCT-ACTION-CODE=" 		+escape(Rules[_RULESINDEX].ActionCode)
			+ "&PCT-EMPLOYEE=" 			+escape(authUser.employee)
			+ "&BYPASS-POPUPS=Y"

	for(var k=0;k<self.lawheader.Xmit.length;k++)
	{
		if(typeof(self.lawheader.Xmit[k])!='undefined')
		{
			switch(k)
			{
				case 0:	pAGSObj.field += "&XMIT-HREMP-BLOCK=";break;
				case 1:	pAGSObj.field += "&XMIT-DEDDAT=";break;
				case 2:	pAGSObj.field += "&XMIT-IMMED=";break;
				case 3:	pAGSObj.field += "&XMIT-REQDED=";break;
				case 4:	pAGSObj.field += "&XMIT-ACT-EXISTS=";break;
			}
			pAGSObj.field += escape(self.lawheader.Xmit[k])
		}
	}

	pAGSObj.field += "&PCT-EFFECT-DATE=" +escape(formjsDate(Rules[_RULESINDEX].EffectiveDate))
		+ "&IMMEDIATE-ACTION=" 		+escape(Rules[_RULESINDEX].WebImmediate)
		+ "&PCT-REASON1=" 			+escape(self.HEADER.document.reasons.reason1.value)
		+ "&PCT-REASON2=" 			+escape(self.HEADER.document.reasons.reason2.value)

	var count = 1;
	for(var i=0,j=1;i<Data.length;i++)
	{
		index = parseInt((String(j))+(String(count)),10)
    // JRZ Blank fields should still be passed
		//if(Data[i].ChangeText!='')
		//{
			pAGSObj.field += "&PCT-NEW-VALUE-"+index+"="	+escape(Data[i].ChangeText)
			pAGSObj.field += "&PAT-FLD-NBR-"+index+"="	+escape(self.lawheader.Fields[i])
		//}

		if(++count>12)
		{
			j++
			count=1
		}
	}

	pAGSObj.field += "&_HK=" + escape(self.lawheader.HiddenKeys,1) // PT 152887
	pAGSObj.field += "&ORIG-COMPANY=" + escape(self.lawheader.OrigCompany,1)
	pAGSObj.field += "&ORIG-EMPLOYEE=" + escape(self.lawheader.OrigEmployee,1)
	pAGSObj.field += "&ORIG-ACTION-CODE=" + escape(self.lawheader.OrigActionCode,1)
	pAGSObj.field += "&ORIG-EFFECT-DATE=" + escape(self.lawheader.OrigEffectDate,1)
	pAGSObj.dtlField = "PCT-NEW-VALUE-1;PCT-NEW-VALUE-2"; //;PCT-NEW-VALUE-3";
	pAGSObj.func = "parent.CheckForErrors()";
	pAGSObj.debug = false;
	if (FC == "A")
		pAGSObj.preInquire = true;
	AGS(pAGSObj,"jsreturn")
}

var count = 0;

function DspMsg()
{
	count++;
	if(self.lawheader.gmsgnbr == "000")
	{
		if(count==1)
			CheckForErrors();
		else
		{
			// PT 105729
			if (Rules[_RULESINDEX].AddressChange)
			{
				AddressChangeSucceeded();
			}
			else
			{
				if (TaxLocatorVariable)
					SendEmail();
				setTimeout("UpdateCompleteMessage()","500");
			}
		}
	}
	else if (Rules[_RULESINDEX].AddressChange)
	{
		if (typeof(Rules[_RULESINDEX].EmailAddress) == "undefined" || Rules[_RULESINDEX].EmailAddress == null || NonSpace(Rules[_RULESINDEX].EmailAddress) == 0) // SYSRULES email is blank
		{
			if (TaxLocatorVariable) // Tax Locator error message
			{
				MsgBox("Address change cannot be made at this time; please contact your "
					+ "HR department for assistance in investigating this Tax Locator problem.")
				return;
			}
		}

		MsgBox("Address change cannot be made at this time; please contact your "
			+ "HR department to make this change.");
	}
	else
	{
		MsgBox("Error: "+self.lawheader.gmsgnbr+"\n\n"+self.lawheader.myMsg);
	}
}

// PT 105729
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
					ShowSchoolDist();
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
				ShowSchoolDist();
			}
		}
		else
		{
			UpdateCompleteMessage();
			SendEmail();
		}
	}
	else
	{
		UpdateCompleteMessage();
	}
}

function ShowSchoolDist()
{
	// If the employee is changing their home state to or from PA or OH, display a pop-up
	// window that asks for the school district.  Otherwise, continue to the email logic.
	if (Rules[_RULESINDEX].OldState == "OH" || Rules[_RULESINDEX].OldState == "PA" || Rules[_RULESINDEX].NewState == "OH" || Rules[_RULESINDEX].NewState == "PA")
	{
		SchoolDistWin = window.open("/lawson/xhrnet/schooldst.htm","SCHDST","left="+parseInt((screen.width/2)-275,10)+",top="+parseInt((screen.height/2)-60,10)+",width=550,height=120,resizable=yes,toolbar=no");
		SchoolDistWin.focus();
	}
	else
	{
		UpdateCompleteMessage();
		SendEmail();
	}
}

// PT 105729
function ReturnSchDst(SchDstVal)
{
	// Since the user may close the school district window by clicking on the "Update" button, both the onunload
	// and button events may invoke this function.  Make sure we only process the body of this function once.
	if (ReturnedSchDist) return;

	ReturnedSchDist = true;
 	if (SchDstVal)
    	Rules[_RULESINDEX].SchoolDist = SchDstVal;
	else
		Rules[_RULESINDEX].SchoolDist = "";
	UpdateCompleteMessage();
	SendEmail();
}

// PT 105729
function UpdateCompleteMessage()
{
	removeWaitAlert();
	if (self.lawheader.gmsgnbr == "000")
	{
		MsgBox("Personnel actions have been updated.");
		CloseActionWindows();
	}
}

// PT 105729
function SendEmail()
{
	if(Rules[_RULESINDEX].EmailAddress != null && NonSpace(Rules[_RULESINDEX].EmailAddress) > 0)
	{
		var TaxFlag = false;
		var PR13TaxMsg = "";
		var SendingTo 	= Rules[_RULESINDEX].EmailAddress;
		var SendingFrom = (authUser.name) ? authUser.name : "Personnel Actions";

		var pObj 	= new EMAILObject(SendingTo,SendingFrom);
		pObj.subject	= "Personnel Actions"
		pObj.message = "Company: "+Rules[_RULESINDEX].Company
		+ "\nEmployee Number: "+Rules[_RULESINDEX].Employee
		+ "\nName: "+Rules[_RULESINDEX].EmployeeName
		+ "\nAction: "+Rules[_RULESINDEX].ActionCode
		// PT 107138
		// + "\nEffective: "+formatDME(Rules[_RULESINDEX].EffectiveDate)
		+ "\nEffective: "+Rules[_RULESINDEX].EffectiveDate

		// Check tax filter values to see if local tax authority fields may need to be changed.
		if ((parseInt(Rules[_RULESINDEX].EmpTaxFilter,10) == 2 || parseInt(Rules[_RULESINDEX].EmpTaxFilter,10) == 3)
		|| ((!Rules[_RULESINDEX].EmpTaxFilter || isNaN(parseFloat(Rules[_RULESINDEX].EmpTaxFilter))) && (parseInt(Rules[_RULESINDEX].PrsTaxFilter,10) == 2 || parseInt(Rules[_RULESINDEX].PrsTaxFilter,10) == 3)))
		{
			TaxFlag = true;
		}

		// If the employee is changing their home state to or from PA or OH, display the school
		// district in the email message.
		if (TaxFlag)
		{
			// This is a supplemental address change.
			if (Rules[_RULESINDEX].SuppAddrChange)
			{
				// If this is a supplemental address change and PRS-EMP-TAX-ADDR == 2.
				if (parseInt(Rules[_RULESINDEX].PrsEmpTaxAddr,10) == 2)
				{
					PR13TaxMsg = "PR13 local tax authority fields may need to be changed."
					// This is a supplemental address change; append the school district value to the email.
					if (Rules[_RULESINDEX].OldState == "OH" || Rules[_RULESINDEX].OldState == "PA" || Rules[_RULESINDEX].NewState == "OH" || Rules[_RULESINDEX].NewState == "PA")
					{
						pObj.message += "\nSchool District: " + Rules[_RULESINDEX].SchoolDist
					}
				}
			}
			else
			{
				PR13TaxMsg = "PR13 local tax authority fields may need to be changed."
				// This is a home address change; append the school district value to the email.
				if (Rules[_RULESINDEX].OldState == "OH" || Rules[_RULESINDEX].OldState == "PA" || Rules[_RULESINDEX].NewState == "OH" || Rules[_RULESINDEX].NewState == "PA")
				{
					pObj.message += "\nSchool District: " + Rules[_RULESINDEX].SchoolDist
				}
			}
		}

		if (Rules[_RULESINDEX].WebImmediate == "N")
		{
			pObj.message += "\n\nA pending personnel action has been entered by this employee's supervisor.  This action can be reviewed on PA52.1."
		}
		else
		{
			pObj.message += "\n\nA personnel action has been entered by this employee's supervisor.  This action can be reviewed on PA52.1."
		}

		if (TaxLocatorVariable)
		{
			pObj.message += "\nTax Locator error has been identified.  Please review PR13.8 for this employee."
		}

		if (PR13TaxMsg != "")
		{
			pObj.message += "\n"+PR13TaxMsg;
		}

		EMAIL(pObj,"jsreturn");
	}
}

// PT 105729
function cgiEmailDone()
{
	removeWaitAlert();
}

function DoesObjectExist(pObj)
{
	if(typeof(pObj) == "undefined" || typeof(pObj) == "unknown" || pObj == null || typeof(pObj) == "null")
		return false;
	else
		return true;
}

function CloseActionWindows()
{
	self.close();

	if(DoesObjectExist(objectWin) && DoesObjectExist(objectWin.myWin) && !objectWin.myWin.closed)
		objectWin.myWin.close()
    
  // JRZ refresh the parent page
  opener.Call();
}

var loadTimer = setTimeout("GetPersactypeForSecondWindow()",3000)

</SCRIPT>
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-395426-5");
pageTracker._trackPageview();
} catch(err) {}</script>
</HEAD>

<!-- No Body tag included with this file -->

<FRAMESET rows="225,100%,50,*,*" frameborder=no border=0 onLoad="clearTimeout(loadTimer);GetPersactypeForSecondWindow()">
	<FRAME SRC="/lawson/xhrnet/dot.htm" marginwidth=9 marginheight=9 name=HEADER scrolling=no>
	<FRAME SRC="/lawson/xhrnet/dot.htm" marginwidth=9 marginheight=9 name=CONTROLITEM>
	<FRAME SRC="/lawson/xhrnet/dot.htm" name=BUTTONS scrolling=no>
	<FRAME SRC="/lawson/xhrnet/dot.htm" name=jsreturn scrolling=no>
	<FRAME SRC=/lawson/xhrnet/personnelactions/palawheader.htm name=lawheader scrolling=no>
</FRAMESET>

</HTML>
