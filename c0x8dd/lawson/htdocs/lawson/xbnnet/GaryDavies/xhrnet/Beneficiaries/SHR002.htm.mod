<html>
<head>
<title>Beneficiaries</title>
<meta name="viewport" content="width=device-width" />
<META HTTP-EQUIV="Pragma" CONTENT="No-Cache">
<META HTTP-EQUIV="Expires" CONTENT="Mon, 01 Jan 1990 00:00:01 GMT">
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<link rel="alternate stylesheet" type="text/css" id="ui" title="classic" href="/lawson/xhrnet/ui/ui.css"/>
<link rel="alternate stylesheet" type="text/css" id="uiLDS" title="lds" href="/lawson/webappjs/lds/css/ldsEMSS.css"/>
<script src="/lawson/webappjs/commonHTTP.js"></script>
<script src="/lawson/webappjs/transaction.js"></script>
<script src="/lawson/webappjs/data.js"></script>
<script src="/lawson/xhrnet/esscommon80.js"></script>
<script src="/lawson/xhrnet/statesuscan.js"></script>
<script src="/lawson/xhrnet/instctrycdselect.js"></script>
<script src="/lawson/webappjs/user.js"></script>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/xhrnet/xml/xmldateroutines.js"></script>
<script src="/lawson/xhrnet/ui/ui.js"></script>
<script src="/lawson/webappjs/javascript/objects/Dialog.js"></script>
<script>
///////////////////////////////////////////////////////////////////////////////////////////
//
// Global Variables.
//

var fromTask = (window.location.search)?unescape(window.location.search):"";
var parentTask = getVarFromString("from",fromTask);
var pBrowser 		= new BrowserInfo();
var Benefits 		= new Array();
var Beneficiaries 	= new Array();
var NamePrefix 		= new Array();
var NameSuffix 		= new Array();
var Relationship 	= new Array();
var UpdateAllViews	= false;
var BenefitsRec		= null;
var UpdateInProgress = false;

///////////////////////////////////////////////////////////////////////////////////////////
//
// Initialize function.
//

function Initialize()
{
	authenticate("frameNm='jsreturn'|funcNm='AuthenticateFinished()'|desiredEdit='EM'");
}

///////////////////////////////////////////////////////////////////////////////////////////
//
// Initialization Complete function.
//

function AuthenticateFinished()
{
    stylePage();
	if (parentTask != "adoption" && parentTask != "birth") {
		if (fromTask) {
			parent.showWaitAlert(getSeaPhrase("PROCESSING","BEN"));
			try
			{
				parent.document.getElementById(window.name).style.visibility = "visible";
			}
			catch(e)
			{}
		}
	}
	document.title = getSeaPhrase("BENEFICIARIES","BEN");
	StoreDateRoutines();
	DMEToBenefitPlans();
}

///////////////////////////////////////////////////////////////////////////////////////////
//
// Defined Objects.
//

function BeneficiaryObj(plantype,plancode,plandesc,seqnbr,lastname,lastpre,lastsuf,firstname,middleinit,
	pctamtflag,pmtamt,primcntgnt,currencyformsexp, labelname1, beneftype, relcode, ficanbr, empaddress,
	addr1, addr2, addr3, addr4, city, state, zip, countrycode, cmttext, trust, namesuffix, benefname1)
{
	this.plan_type   		= plantype
	this.plan_code   		= plancode
	this.plan_desc   		= plandesc		// this supplies the name
	this.seq_nbr     		= seqnbr
	this.last_name   		= lastname
	this.last_pre			= lastpre
	this.last_suf			= lastsuf
	this.first_name  		= firstname
	this.middle_init 		= middleinit
	this.pct_amt_flag 		= pctamtflag
	this.pmt_amt     		= pmtamt
	this.prim_cntgnt 		= primcntgnt
	this.currency_forms_exp = (currencyformsexp)?currencyformsexp:""
	this.label_name_1		= labelname1;
	this.benef_type 		= beneftype;
	this.rel_code 			= relcode;
	this.fica_nbr 			= ficanbr;
	this.emp_address 		= empaddress;
	this.addr1 				= addr1;
	this.addr2 				= addr2;
	this.addr3 				= addr3;
	this.addr4 				= addr4;
	this.city 				= city;
	this.state 				= state;
	this.zip 				= zip;
	this.country_code 		= countrycode;
	this.cmt_text 			= cmttext;
	this.trust				= trust;
	this.name_suffix		= namesuffix;
	this.benef_name_1		= benefname1;
}

///////////////////////////////////////////////////////////////////////////////////////////
//
// DME requests.
//

function DMEToBenefitPlans()
{
	Benefits = new Array();
	Beneficiaries 	= new Array();
	BenefitsRec = null;

	var pDMEObj   	= new DMEObject(authUser.prodline,"BENEFIT")
	pDMEObj.out   	= "JAVASCRIPT"
	pDMEObj.field 	= "plan-type;plan-code;plan.desc;start-date;stop-date;employee.label-name-1;"
					+ "employee.fica-nbr;currency.forms-exp;"
	pDMEObj.cond  	= "non-waive" //;current"
// MOD BY BILAL  - Prior Customization
		//ISH 2008 Only Show 401k and Life Insurance
		//CGL 01/28/2010 Add Annual Contribution (ANNU) plan to beneficiary display
		//CGL 02/13/2012 Add employee supp life (ELSP) plan to beneficiary display
		pDMEObj.index	= "BENSET2"
		pDMEObj.key   	= parseInt(authUser.company,10)+"=DC;EL=403B;403F;403P;LIFE;ANNU;ELSP="+parseInt(authUser.employee,10)
//	pDMEObj.key   	= parseInt(authUser.company,10)+"=DB;DC;DI;EL="+parseInt(authUser.employee,10)
// END OF MOD
	// PT 150856.
	//pDMEObj.sortasc = "plan.desc"
	pDMEObj.func	= "ProcessBenefits()"
	pDMEObj.max		= "600"
	pDMEObj.debug	= false
	DME(pDMEObj, "jsreturn")
}

function ProcessBenefits()
{
	//PT118698: display benefits with future start dates; do not display if they have been stopped prior to the system date
	var tmpRec;

	for (var i=0; i<self.jsreturn.NbrRecs; i++) {
		tmpRec = self.jsreturn.record[i];
		if (NonSpace(tmpRec.stop_date) == 0 || getDteDifference(ymdtoday,formjsDate(tmpRec.stop_date)) > 0) {
			Benefits[Benefits.length] = self.jsreturn.record[i];
		}
	}

	if (self.jsreturn.Next != "") {
		self.jsreturn.location.replace(self.jsreturn.Next);
	}
	else {
		// PT 150856.
		Benefits.sort(sortByName);
		GetBeneficiary(0);
	}
}

// PT 150856.
function sortByName(obj1,obj2)
{
	var name1 = obj1.plan_desc;
	var name2 = obj2.plan_desc;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function GetBeneficiary(Index)
{
	if (Index >= Benefits.length)
	{
		if(!UpdateAllViews) {
			GetSuffixes();
		}
		else {
			Draw();
		}
	}
	else
	{
		var thisPlan = Benefits[Index];
		var PlanType = Benefits[Index].plan_type;
		var PlanCode = Benefits[Index].plan_code;

		if (typeof(Beneficiaries[PlanType+PlanCode]) == "undefined" || Beneficiaries[PlanType+PlanCode] == null)
		{
			Beneficiaries[PlanType+PlanCode] = new Array();
			GetBeneficiaryInfo(PlanType,PlanCode,"ProcessBeneficiaries("+Index+",'"+PlanType+"','"+PlanCode+"')");
		}
		else
		{
			GetBeneficiary(++Index);
		}
	}
}

function GetBeneficiaryInfo(plantype, plancode, func)
{
	var pObj   		= new DMEObject(authUser.prodline,"BENEFICRY")
		pObj.out   	= "JAVASCRIPT"
		pObj.field 	= "plan-type;plan.desc;plan-code;seq-nbr;last-name;first-name;middle-init;name-suffix;"
					+ "pct-amt-flag;pmt-amt;prim-cntgnt;first-mi-exp;benef-type;rel-code;fica-nbr;emp-address;"
					+ "addr1;addr2;addr3;addr4;city;state;zip;country-code;cmt-text;last-suf;trust;benef-name-1"
					//+ ";last-pre"
		pObj.key   	= parseInt(authUser.company,10)+"="+parseInt(authUser.employee,10)+"="+escape(plantype,1)+"="+escape(plancode,1)
		pObj.func	= escape(func.toString(),1)
		pObj.sortasc= "last-name"
		pObj.max	= "600"
		pObj.debug	= false
	DME(pObj,"jsreturn")
}

function ProcessBeneficiaries(Index, PlanType, PlanCode)
{
	// PT 118581: if the record is a trust, use BENEF-NAME-1; otherwise, construct the full name on the record.
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		var thisBn = self.jsreturn.record[i];
		var Index1 = PlanType+PlanCode;
		var Index2 = Beneficiaries[PlanType+PlanCode].length;
		Beneficiaries[Index1][Index2] = new BeneficiaryObj( thisBn.plan_type,
															thisBn.plan_code,
															thisBn.plan_desc,
															thisBn.seq_nbr,
															thisBn.last_name,
															"",
															thisBn.last_suf,
															thisBn.first_name,
															thisBn.middle_init,
															thisBn.pct_amt_flag,
															thisBn.pmt_amt,
															thisBn.prim_cntgnt,
															Benefits[Index].currency_forms_exp,
															((thisBn.benef_type==1)?thisBn.benef_name_1:thisBn.first_mi_exp+' '+thisBn.last_suf),
															thisBn.benef_type,
															thisBn.rel_code,
															thisBn.fica_nbr,
															thisBn.emp_address,
															thisBn.addr1,
															thisBn.addr2,
															thisBn.addr3,
															thisBn.addr4,
															thisBn.city,
															thisBn.state,
															thisBn.zip,
															thisBn.country_code,
															thisBn.cmt_text,
															thisBn.trust,
															thisBn.name_suffix,
															thisBn.benef_name_1);
	}

	if (self.jsreturn.Next != "")
	{
		self.jsreturn.location.replace(self.jsreturn.Next);
	}
	else
	{
		var Index1 = PlanType+PlanCode;
		if (Beneficiaries[Index1].length == 0)
		{
			Beneficiaries[Index1][0] = new BeneficiaryObj(PlanType, PlanCode, Benefits[Index].plan_desc, "", "",
														  "", "", "", "",  "", 0, "", Benefits[Index].currency_forms_exp,
														  "", "", "", "", "", "", "", "", "", "", "", "", "", "", "","","");
		}

		GetBeneficiary(Index+1);
	}
}

function GetSuffixes()
{
	NamePrefix = new Array();
	NameSuffix = new Array();

	var pObj   		= new DMEObject(authUser.prodline,"HRCTRYCODE")
		pObj.out   	= "JAVASCRIPT"
		pObj.field 	= "type;hrctry-code;description"
		pObj.index 	= "ctcset1";
		pObj.key   	= "PR;SU";
		pObj.func	= "DspSuffixes()";
		pObj.max	= "600"
		pObj.debug	= false
	DME(pObj,"jsreturn")
}

function DspSuffixes()
{
	for(var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		if(self.jsreturn.record[i].type == "PR")
			NamePrefix[NamePrefix.length] = self.jsreturn.record[i];
		else if(self.jsreturn.record[i].type == "SU")
			NameSuffix[NameSuffix.length] = self.jsreturn.record[i];
	}

	if (self.jsreturn.Next != "")
		self.jsreturn.location.replace(self.jsreturn.Next)
	else
		GetRelationships();
}

function GetRelationships()
{
	Relationship = new Array();

	var pObj   	= new DMEObject(authUser.prodline,"PCODES");
	pObj.out   	= "JAVASCRIPT";
	pObj.field 	= "code;description";
	pObj.index 	= "pcoset1";
	pObj.cond   = "Active";
	pObj.key   	= "DP";
	pObj.func	= "DspRelationship()";
	pObj.max	= "600";
	pObj.debug	= false;
	DME(pObj,"jsreturn");
}

function DspRelationship()
{
	for(var i=0; i<self.jsreturn.NbrRecs; i++) {
		Relationship[Relationship.length] = self.jsreturn.record[i];
	}

	if (self.jsreturn.Next != "")
	{
		self.jsreturn.location.replace(self.jsreturn.Next);
	}
	else
	{
		GetCountryCodes();
	}
}

function GetCountryCodes()
{
	GetInstCtryCdSelect(authUser.prodline,"GrabStates(\"Draw()\")");
}

///////////////////////////////////////////////////////////////////////////////////////////
//
// Draw the window. (used if you want to draw a window using javascript.

function Draw()
{
	DrawLeftFrame();
	document.getElementById("RIGHT").style.visibility = "hidden";
	if(UpdateAllViews) {
		seaAlert(self.lawheader.gmsg);
	}
	UpdateAllViews = false;
}

// MOD BY BILAL
//ISH 2008 Open Important Notice
function OpenWinDesc()
{
	window.open("/lawson/xhrnet/importantbeneficiaries.htm","IMPORTANT","width=500,height=500,resizable=yes,toolbar=no,scrollbars=yes");
}
// END OF MOD
function DrawLeftFrame()
{
	var BeneficiaryExists = false;
	var BeneficiaryRecs;

	var strHtml = "";
	var cnt = 0;//PT 164394

	for (var TypeCode in Beneficiaries)
	{
		BeneficiaryRecs = Beneficiaries[TypeCode];

		var marginStr = (BeneficiaryExists)?"margin-top:10px;":"";

		strHtml += '<table id="'+TypeCode+'Tbl" style="'+marginStr+'border:#dddddd 1px solid" border="0" cellspacing="0" cellpadding="0" width="100%">';
		strHtml += '<tr>';
		strHtml += '<td class="plaintablerowheader" style="text-align:right;width:25%">'+getSeaPhrase("PLAN_TYPE","BEN")+'</td>';
		strHtml += '<td class="plaintableheader" style="width:75%">'+PlanTypeTitle(BeneficiaryRecs[0].plan_type)+'</td>';
		strHtml += '</tr>';
		strHtml += '<tr>';
		strHtml += '<td class="plaintablerowheader" style="text-align:right;width:25%">'+getSeaPhrase("PLAN_NAME","BEN")+'</td>';
		strHtml += '<td class="plaintableheader" style="width:75%">'+BeneficiaryRecs[0].plan_desc+'</td>';
		strHtml += '</tr>';

		BeneficiaryExists = true;

		if (BeneficiaryRecs[0].seq_nbr)
		{
			for (var i=0; i<BeneficiaryRecs.length; i++)
			{
				if (BeneficiaryRecs[i].seq_nbr) {
					cnt++;
					strHtml += DrawBeneficiary(BeneficiaryRecs[i],i,TypeCode,(cnt*3)-2);
				}
			}
		}

		strHtml += '<tr>';
		strHtml += '<td>&nbsp;</td><td>';
		strHtml += uiButton(getSeaPhrase("ADD_INDIVIDUAL","BEN"),"parent.AddBenefitsDetail(\'"+TypeCode+"\',0);return false",false,TypeCode+"_addindividualbtn");
		strHtml += uiButton(getSeaPhrase("ADD_TRUST","BEN"),"parent.AddBenefitsDetail(\'"+TypeCode+"\',1);return false",false,TypeCode+"_addtrustbtn");
		strHtml += '</td>';
		strHtml += '</tr>';
		strHtml += '</table>';
	}

	if((window.print && BeneficiaryExists) || (fromTask && parentTask != "main"))
	{
		strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">';
		strHtml += '<tr>';
		strHtml += '<td style="text-align:right">';

		if(window.print && BeneficiaryExists) {
			strHtml += uiButton(getSeaPhrase("PRINT","BEN"),"parent.printForm();return false",false,"printbtn");
		}

		if(fromTask && parentTask != "main") {
			strHtml += uiButton(getSeaPhrase("CLOSE","BEN"),"parent.doneForm();return false",false,"closebtn");
		}

		strHtml += '</td>';
		strHtml += '</tr>';
		strHtml += '</table>';
	}
	//PT 164394
	if(BeneficiaryExists) {
		var hdrHtml = '<div class="fieldlabelbold" style="text-align:left;padding-bottom:10px;padding-left:10px">';
		hdrHtml += getSeaPhrase("ADD_BENEFICIARY","BEN");
		hdrHtml += '</div>';
		if(cnt != 0){
		hdrHtml += '<div class="fieldlabelbold" style="text-align:left;padding-bottom:10px;padding-left:10px">'
		hdrHtml += getSeaPhrase("CHANGE_BENEFICIARY","BEN");
		hdrHtml += '</div>';
		}
		hdrHtml += '</div>';
		strHtml = hdrHtml+strHtml;
	}
	else {
		var hdrHtml = '<div class="fieldlabelbold" style="text-align:left;padding-bottom:10px;padding-left:10px;padding-top:10px">';
		hdrHtml += getSeaPhrase("NO_PLANS_FOR_BEN","BEN");
		hdrHtml += '</div>';
		strHtml = hdrHtml+strHtml;
	}

	try {
// MOD BY BILAL prior Customization.
		self.LEFT.document.getElementById("paneHeader").innerHTML = getSeaPhrase("CURRENT_BENEFICIARIES","BEN");
//		self.LEFT.document.getElementById("paneBody").innerHTML = strHtml;
		self.LEFT.document.getElementById("paneBody").innerHTML = '<div align=center><a href=javascript:parent.OpenWinDesc() style="width:100%" ><font color="red"><h4>Important<br>Click and Read</h4></font></a></div>' + strHtml;
// END OF MOD
	}
	catch(e) {}

	self.LEFT.setLayerSizes();
	self.LEFT.stylePage();

	document.getElementById("LEFT").style.visibility = "visible";
	// if this task has been launched as a related link, remove any processing message
	if (fromTask && typeof(parent.parent.removeWaitAlert) == "function")
		parent.parent.removeWaitAlert();
	if (fromTask && typeof(parent.removeWaitAlert) == "function")
		parent.removeWaitAlert();
}

function hideButtons()
{
	var btnTags = self.LEFT.document.getElementsByTagName("BUTTON");

	for (var i=0; i<btnTags.length; i++) {
		if (btnTags[i].id.indexOf("addindividualbtn") >= 0 || btnTags[i].id.indexOf("addtrustbtn") >= 0) {
			btnTags[i].style.visibility = "hidden";
		}
	}
}

function showButtons()
{
	var btnTags = self.LEFT.document.getElementsByTagName("BUTTON");

	for (var i=0; i<btnTags.length; i++) {
		if (btnTags[i].id.indexOf("addindividualbtn") >= 0 || btnTags[i].id.indexOf("addtrustbtn") >= 0) {
			btnTags[i].style.visibility = "visible";
		}
	}
}

function doneForm()
{
	try {
		parent.document.getElementById("fullrelatedtask").style.visibility = "hidden";
	}
	catch(e) {}
	try {
		parent.document.getElementById("relatedtask").style.visibility = "hidden";
	}
	catch(e) {}
	try {
		parent.document.getElementById("right").style.visibility = "hidden";
	}
	catch(e) {}
	try {
		parent.document.getElementById("left").style.visibility = "visible";
	}
	catch(e) {}

	// display the checkmark indicating that this task has been accessed.
	try {
		parent.left.setImageVisibility("beneficiaries_checkmark","visible");
	}
	catch(e) {}
}

function DrawRightFrame(Index, Key, View)
{
	if(Index >= 0)
	{
		BenefitsRec = Beneficiaries[Key][Index];
	}
	else
	{
		BenefitsRec = new BeneficiaryObj(Beneficiaries[Key][0].plan_type, Beneficiaries[Key][0].plan_code,
										Beneficiaries[Key][0].plan_desc,0,"","","","","","","","",
										Beneficiaries[Key][0].currency_forms_exp,Beneficiaries[Key][0].plan_desc,
										View,"","","","","","","","","","","","","","","");
	}

	var classStr = "fieldlabelboldlite";

	hideButtons();

	var strHtml = '<form name="beneficiaryform">';
	strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">';

	if (View == 1)
	{
		// Trust detail fields
		// Trust
		strHtml += '<tr><td class="'+classStr+'" style="width:40%">'+getSeaPhrase("TRUST","BEN")+'</td>';
		strHtml += '<td class="plaintablecell" nowrap><textarea class="inputbox" name="trust" cols="30" rows="2" maxlength="60" onkeyup="this.value=parent.GetCommentsLength(this.value)">';
		strHtml += BenefitsRec.trust;
		strHtml += '</textarea>'+uiRequiredIcon()+'</td></tr>';
		// Blank Row
		strHtml += BlankRow(classStr);
		// Distribution Type Fields
		strHtml += DistTypeFields(BenefitsRec,classStr);
		// Blank Row
		strHtml += BlankRow(classStr);
		// Beneficiary Type
		strHtml += BeneficiaryType(BenefitsRec,classStr);
		// Blank Row
		strHtml += BlankRow(classStr);
	}
	else
	{
		// Individual detail fields
		// First Name
		strHtml += '<tr><td class="'+classStr+'" style="width:40%">'+getSeaPhrase("FIRST_NAME","BEN")+'</td>';
		strHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="firstname" size="15" maxlength="15" onfocus="this.select()" value="'+BenefitsRec.first_name+'">'+uiRequiredIcon()+'</td></tr>';
		// Middle Initial
		strHtml += '<tr><td class="'+classStr+'" style="width:40%">'+getSeaPhrase("MID_INIT","BEN")+'</td>';
		strHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="middlename" size="1" maxlength="1" onfocus="this.select()" value="'+BenefitsRec.middle_init+'"></td></tr>';
		// PT 118581: remove last name prefix
		// Last Name Prefix
		//strHtml += '<tr><td class="'+classStr+'" style="width:40%">'+getSeaPhrase("LAST_NAME_PRE","BEN")+'</td>';
		//strHtml += '<td class="plaintablecell" nowrap><select class="inputbox" name="prefixes">';
		//strHtml += BuildPrefixes(BenefitsRec.last_pre.split('\ ')[0]);
		//strHtml += '</select></td></tr>';
		// Last Name
		strHtml += '<tr><td class="'+classStr+'" style="width:40%">'+getSeaPhrase("LAST_NAME","BEN")+'</td>';
		strHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="lastname" size="30" maxlength="30" onfocus="this.select()" value="'+BenefitsRec.last_name+'">'+uiRequiredIcon()+'</td></tr>';
		// Last Name Suffix
		strHtml += '<tr><td class="'+classStr+'" style="width:40%">'+getSeaPhrase("LAST_NAME_SUF","BEN")+'</td>';
		strHtml += '<td class="plaintablecell" nowrap><select class="inputbox" name="suffixes">';
		strHtml += BuildSuffixes(BenefitsRec.name_suffix);
		strHtml += '</select></td></tr>';
		// Distribution Type Fields
		strHtml += DistTypeFields(BenefitsRec,classStr);
		// Blank Row
		strHtml += BlankRow(classStr);
		// Beneficiary Type
		strHtml += BeneficiaryType(BenefitsRec,classStr);
		// Relationship
		strHtml += '<tr><td class="'+classStr+'" style="width:40%">'+getSeaPhrase("RELATIONSHIP","BEN")+'</td>';
		strHtml += '<td class="plaintablecell" nowrap><select class="inputbox" name="relationship">';
		strHtml += BuildRelationships(BenefitsRec.rel_code);
		strHtml += '</select></td></tr>';
// MOD BY BILAL - Prior customization
	//ISH 2006 starts Add Relationship to leave blank
		strHtml += '<TR><td class="'+classStr+'" style="width:40%">&nbsp;</td><td class="plaintablecell"><i><font size="-4"><small><center>If relationship is "Spouse" percent election should be 100%. A consent form should be filled out if designation is less than 100% for a relationship "Spouse"</center></small></i></font></td></TR>';
	//ISH end
// END OF MOD
		// Social Number
		strHtml += '<tr><td class="'+classStr+'" style="width:40%">'+getSeaPhrase("SOCIAL_NUMBER","BEN")+'</td>';
// MOD BY BILAL - Prior customization
//		strHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="fica" size="20" maxlength="20" onfocus="this.select()" value="'+BenefitsRec.fica_nbr+'"></td></tr>';
		strHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="fica" size="20" maxlength="20" onfocus="this.select()" value="'+BenefitsRec.fica_nbr+'"> (format:121-78-9073)</td></tr>';
// END OF MOD
		// Blank Row
		strHtml += BlankRow(classStr);
	}

	// Address Fields
	strHtml += AddressFields(BenefitsRec,classStr);
	// Blank Row
	strHtml += BlankRow(classStr);
	// Comments
	strHtml += CommentField(BenefitsRec,classStr+"underline");

	// Form Buttons
	strHtml += '<tr><td>&nbsp;</td><td style="text-align:left">';
	strHtml += uiButton(getSeaPhrase("UPDATE","BEN"),"parent.updateDetail();return false","margin-top:10px");
	strHtml += uiButton(getSeaPhrase("CANCEL","BEN"),"parent.closeDetail();return false","margin-top:10px");
	if (Index >= 0) {
		strHtml += uiButton(getSeaPhrase("DELETE","BEN"),"parent.deleteDetail();return false","margin-top:10px;margin-left:15px");
	}
	strHtml += '</td></tr>';
	strHtml += '</table>';
	strHtml += '</form>';
	strHtml += uiRequiredFooter();

	try {
		self.RIGHT.document.getElementById("paneHeader").innerHTML = getSeaPhrase("DETAIL","BEN");
		self.RIGHT.document.getElementById("paneBody").innerHTML = strHtml;
	}
	catch(e) {}

	self.RIGHT.stylePage();
	self.RIGHT.setLayerSizes();

	document.getElementById("RIGHT").style.visibility = "visible";

	// if this task has been launched as a related link, remove any processing message
	if (fromTask && typeof(parent.parent.removeWaitAlert) == "function")
		parent.parent.removeWaitAlert();
	if (fromTask && typeof(parent.removeWaitAlert) == "function")
		parent.removeWaitAlert();
}

function BlankRow(classStr)
{
	// Blank Row
	var strHtml = '<tr><td class="'+classStr+'" style="text-align:center;height:15px">&nbsp;</td>';
	strHtml += '<td class="plaintablecell" nowrap>&nbsp;</td></tr>';

	return strHtml;
}

function BeneficiaryType(BenefitsRec,classStr)
{
	// Beneficiary Type
	var strHtml = '<tr><td class="'+classStr+'" style="width:40%">'+getSeaPhrase("BENEFICIARY_TYPE","BEN")+'</td>';
	strHtml += '<td id="type" class="plaintablecell" nowrap><select class="inputbox" name="type">';
	strHtml += BuildBeneficiaryType(BenefitsRec.prim_cntgnt);
	strHtml += '</select>'+uiRequiredIcon()+'</td></tr>';

	return strHtml;
}

function CommentField(BenefitsRec,classStr)
{
	// Comments
	var strHtml = '<tr><td class="'+classStr+'" style="width:40%">'+getSeaPhrase("COMMENTS","BEN")+'</td>';
	strHtml += '<td class="plaintablecell" nowrap><textarea class="inputbox" name="comments" cols="30" rows="2" maxlength="60" onkeyup="this.value=parent.GetCommentsLength(this.value)">';
	strHtml += BenefitsRec.cmt_text;
	strHtml += '</textarea></td></tr>';

	return strHtml;
}

function AddressFields(BenefitsRec,classStr)
{
	// Employee Address
	var strHtml = '<tr><td class="'+classStr+'" style="width:40%">'+getSeaPhrase("EE_ADDRESS","BEN")+'</td>';
	strHtml += '<td id="empaddress" class="plaintablecell" nowrap><select class="inputbox" name="empaddress">';
	strHtml += BuildEmployeeAddress(BenefitsRec.emp_address);
	strHtml += '</select></td>';
	// or
	strHtml += '<tr><td class="'+classStr+'" style="width:40%;text-align:right;height:15px">'+getSeaPhrase("OR","BEN")+'</td>';
	strHtml += '<td class="plaintablecell" nowrap>&nbsp;</td></tr>';
	// Address 1
	strHtml += '<tr><td class="'+classStr+'" style="width:40%">'+getSeaPhrase("ADDRESS1","BEN")+'</td>';
	strHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="addr1" size="30" maxlength="30" onfocus="this.select()" value="'+BenefitsRec.addr1+'"></td></tr>';
	// Address 2
	strHtml += '<tr><td class="'+classStr+'" style="width:40%">'+getSeaPhrase("ADDRESS2","BEN")+'</td>';
	strHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="addr2" size="30" maxlength="30" onfocus="this.select()" value="'+BenefitsRec.addr2+'"></td></tr>';
	// Address 3
	strHtml += '<tr><td class="'+classStr+'" style="width:40%">'+getSeaPhrase("ADDRESS3","BEN")+'</td>';
	strHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="addr3" size="30" maxlength="30" onfocus="this.select()" value="'+BenefitsRec.addr3+'"></td></tr>';
	// Address 4
	strHtml += '<tr><td class="'+classStr+'" style="width:40%">'+getSeaPhrase("ADDRESS4","BEN")+'</td>';
	strHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="addr4" size="30" maxlength="30" onfocus="this.select()" value="'+BenefitsRec.addr4+'"></td></tr>';
	// City or Address 5
	strHtml += '<tr><td class="'+classStr+'" style="width:40%">'+getSeaPhrase("ADDRESS5","BEN")+'</td>';
	strHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="addr5" size="18" maxlength="18" onfocus="this.select()" value="'+BenefitsRec.city+'"></td></tr>';
	// State or Province
	strHtml += '<tr><td class="'+classStr+'" style="width:40%">'+getSeaPhrase("STATE_PROVINCE","BEN")+'</td>';
	strHtml += '<td class="plaintablecell" nowrap><select class="inputbox" name="states">';
	strHtml += BuildStateSelect(BenefitsRec.state,false);
	strHtml += '</select></td></tr>';
	// Postal Code
	strHtml += '<tr><td class="'+classStr+'" style="width:40%">'+getSeaPhrase("ZIP","BEN")+'</td>';
	strHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="zip" size="10" maxlength="10" onfocus="this.select()" value="'+BenefitsRec.zip+'"></td></tr>';
	// Country
	strHtml += '<tr><td class="'+classStr+'" style="width:40%">'+getSeaPhrase("COUNTRY","BEN")+'</td>';
	strHtml += '<td class="plaintablecell" nowrap><select class="inputbox" name="country">';
	strHtml += DrawInstCtryCdSelect(BenefitsRec.country_code);
	strHtml += '</select></td></tr>';

	return strHtml;
}

function DistTypeFields(BenefitsRec,classStr)
{
// MOD BY BILAL - Prior customization
	var strHtml =''
	// Distribution Type
//	var strHtml = '<tr><td class="'+classStr+'">'+getSeaPhrase("DISTRIBUTION_TYPE","BEN")+'</td>';
//	strHtml += '<td id="amount" class="plaintablecell" nowrap><select class="inputbox" name="amount">';
//	strHtml += BuildDistType(BenefitsRec.pct_amt_flag);
//	strHtml += '</select>'+uiRequiredIcon()+'</td></tr>';
// END OF MOD

// MOD BY BILAL - Prior customization
	// Amount
//	strHtml += '<tr><td class="'+classStr+'">'+getSeaPhrase("AMOUNT","BEN")+'</td>';
// END OF MOD 
	strHtml += '<tr><td class="'+classStr+'">Percent</td>';
	strHtml += '<td class="plaintablecell" nowrap><input class="inputbox" type="text" name="pmtamt" size="12" maxlength="12" onfocus="this.select()" value="'+((BenefitsRec.pmt_amt)?parseFloat(BenefitsRec.pmt_amt):'')+'">'+uiRequiredIcon()+'</td></tr>';

	return strHtml;
}

///////////////////////////////////////////////////////////////////////////////////////////
//
// Helper functions: Drawing methods.

function closeDetail()
{
	for (var TypeCode in Beneficiaries)
	{
		deactivateTableRows(TypeCode+"Tbl",self.LEFT,false,false);
	}
	showButtons();
	document.getElementById("RIGHT").style.visibility = "hidden";
	try {
		self.RIGHT.document.beneficiaryform.reset();
	}
	catch(e) {}
}

function updateOngoing()
{
	return UpdateInProgress;
}

function GetBenefitsDetail(Index, Key, RowCnt)
{
	// Disable the detail hyperlink if an update is still ongoing.
	if (updateOngoing())
		return false;

	for (var TypeCode in Beneficiaries)
	{
		if (TypeCode != Key) {
			deactivateTableRows(TypeCode+"Tbl",self.LEFT,false,false);
		}
	}
	activateTableRow(Key+"Tbl",RowCnt,self.LEFT);
	try {
		DrawRightFrame(Index, Key, Beneficiaries[Key][((Index < 0) ? 0 : Index)].benef_type);
	} catch(e) {
	}
}

function AddBenefitsDetail(Key, Type)
{
	for (var TypeCode in Beneficiaries)
	{
		deactivateTableRows(TypeCode+"Tbl",self.LEFT,false,false);
	}
	DrawRightFrame(-1, Key, Type);
}

function PlanTypeTitle(plantype)
{
	switch(plantype)
	{
		case "DB": return getSeaPhrase("PLAN_1","BEN"); break;
		case "DC": return getSeaPhrase("PLAN_2","BEN"); break;
		case "DI": return getSeaPhrase("PLAN_3","BEN"); break;
		case "EL": return getSeaPhrase("PLAN_4","BEN"); break;
		default: return getSeaPhrase("PLAN_5","BEN"); break;
	}
}

function DrawBeneficiary(BenRec, Index, Key, RowCnt)
{
	var BeneficiaryRecs = Beneficiaries[Key];

	var strHtml = '<tr>';
	strHtml += '<td class="plaintablerowheader" style="text-align:right;width:25%">'+getSeaPhrase("NAME","BEN")+'</td>';
	strHtml += '<td class="plaintablecell" style="width:75%" nowrap>';
	strHtml += '<a href="" onclick="parent.GetBenefitsDetail('+Index+',\''+Key+'\','+RowCnt+');return false">';
	strHtml += BenRec.label_name_1
	strHtml += '</a></td>';
	strHtml += '</tr>';
	strHtml += '<tr>';
	strHtml += '<td class="plaintablerowheader" style="text-align:right;width:25%">'+getSeaPhrase("TYPE","BEN")+'</td>';
	strHtml += '<td class="plaintablecelldisplay" style="width:75%" nowrap>';
	strHtml += ((BenRec.prim_cntgnt == 1)?getSeaPhrase("PRIMARY","BEN"):getSeaPhrase("CONTINGENT","BEN"));
	strHtml += '</td>';
	strHtml += '</tr>';
	strHtml += '<tr>';

	if (Index+1 >= BeneficiaryRecs.length) {
		strHtml += '<td class="plaintablerowheaderborderbottom" style="text-align:right;padding-bottom:10px;width:25%">'+getSeaPhrase("AMOUNT","BEN")+'</td>';
	}
	else {
		strHtml += '<td class="plaintablerowheader" style="text-align:right;padding-bottom:10px;width:25%">'+getSeaPhrase("AMOUNT","BEN")+'</td>';
	}
	strHtml += '<td class="plaintablecelldisplay" style="padding-bottom:10px;width:75%" nowrap>';
	strHtml += BenRec.pmt_amt+((BenRec.pct_amt_flag == "P")?getSeaPhrase("PER","BEN"):'&nbsp;'+BenRec.currency_forms_exp);
	strHtml += '</td>';
	strHtml += '</tr>';

	return strHtml;
}

function BuildPrefixes(prefix)
{
	var Str = '<option value=" "> </option>';
	for (var i=0; i<NamePrefix.length; i++)
	{
        Str += '<option value="' + NamePrefix[i].hrctry_code + '"';
		Str += (prefix == NamePrefix[i].hrctry_code) ? ' selected>' : '>';
		Str += NamePrefix[i].description;
		Str += '</option>';
	}
	return Str;
}

function BuildSuffixes(suffix)
{
	var Str = '<option value=" "> </option>';
	for (var i=0; i<NameSuffix.length; i++)
	{
        Str += '<option value="' + NameSuffix[i].hrctry_code + '"';
		Str += (suffix == NameSuffix[i].hrctry_code) ? ' selected>' : '>';
		Str += NameSuffix[i].description;
		Str += '</option>';
	}
	return Str;
}

function BuildRelationships(relation)
{
	var Str = '<option value=" "> </option>';
	for (var i=0; i<Relationship.length; i++)
	{
        Str += '<option value="' + Relationship[i].code + '"';
		Str += (relation == Relationship[i].code) ? ' selected>' : '>';
		Str += Relationship[i].description;
		Str += '</option>';
	}
	return Str;
}

function BuildDistType(type)
{
	var Str = '<option value=" "> </option>';
    Str += '<option value="A"';
	Str += (type == "A")?' selected>':'>';
	Str += getSeaPhrase("AMOUNT","BEN");
	Str += '</option>';
    Str += '<option value="P"';
	Str += (type == "P")?' selected>':'>';
	Str += getSeaPhrase("PERCENT","BEN");
	Str += '</option>';
	return Str;
}

function BuildBeneficiaryType(type)
{
	var Str = '<option value=" "> </option>';
    Str += '<option value="1"';
	Str += (type == 1)?' selected>':'>';
	Str += getSeaPhrase("PRIMARY","BEN");
	Str += '</option>';
    Str += '<option value="2"';
	Str += (type == 2)?' selected>':'>';
	Str += getSeaPhrase("CONTINGENT","BEN");
	Str += '</option>';
	return Str;
}

function BuildEmployeeAddress(addr)
{
	var Str = '<option value=" "> </option>';
    Str += '<option value="H"';
	Str += (addr == "H")?' selected>':'>';
	Str += getSeaPhrase("HOME_ADDR","BEN");
	Str += '</option>';
    Str += '<option value="S"';
	Str += (addr == "S")?' selected>':'>';
	Str += getSeaPhrase("SUP_ADDR","BEN");
	Str += '</option>';
	return Str;
}

function GetCommentsLength(returnStr)
{
	return ((returnStr.length>=60)?returnStr.substring(0,60):returnStr);
}

///////////////////////////////////////////////////////////////////////////////////////////
//
// Updating Methods.

function deleteDetail()
{
	var BenRec = BenefitsRec;

	var pAGSObj	      = new AGSObject(authUser.prodline, "BN47.1")
		pAGSObj.event     = "CHG"
		pAGSObj.rtn       = "DATA"
		pAGSObj.longNames = true;
		pAGSObj.tds       = false;
		pAGSObj.func      = "parent.formDeleted()";
		pAGSObj.field     = "FC=C"
				+ "&BEN-COMPANY="		+ authUser.company
				+ "&BEN-EMPLOYEE="		+ authUser.employee
				+ "&BEN-PLAN-TYPE="		+ escape(BenRec.plan_type,1)
				+ "&BEN-PLAN-CODE="		+ escape(BenRec.plan_code,1)
				+ "&LINE-FC1=D"
                + "&BNF-LAST-NAME1="    + ParseAGSValue(BenRec.last_name,1)
                + "&BNF-FIRST-NAME1="   + ParseAGSValue(BenRec.first_name,1)
                + "&BNF-MIDDLE-INIT1="  + ParseAGSValue(BenRec.middle_init,1)
                + "&BNF-NAME-SUFFIX1="	+ ParseAGSValue(BenRec.name_suffix,1)
                + "&BNF-PCT-AMT-FLAG1=" + ParseAGSValue(BenRec.pct_amt_flag,1)
                + "&BNF-PMT-AMT1="      + ParseAGSValue(BenRec.pmt_amt,1)
				+ "&BNF-PRIM-CNTGNT1="  + ((BenRec.prim_cntgnt == 1) ? "P" : "C")
  				+ "&BNF-SEQ-NBR1="		+ escape(BenRec.seq_nbr,1)

		pAGSObj.out       = "JAVASCRIPT";
		pAGSObj.debug     = false;

    if (fromTask)
    {
    	parent.showWaitAlert(getSeaPhrase("PROCESSING","BEN"));
	}

	UpdateInProgress = true;
	AGS(pAGSObj, "jsreturn");
}

function formDeleted()
{
	UpdateInProgress = false;

	if(self.lawheader.gmsgnbr == "000")
	{
		UpdateAllViews = true;
		closeDetail();
		DMEToBenefitPlans();
	}
	else
	{
		// if this task has been launched as a related link, remove any processing message
		if (fromTask && typeof(parent.parent.removeWaitAlert) == "function")
			parent.parent.removeWaitAlert();
		if (fromTask && typeof(parent.removeWaitAlert) == "function")
			parent.removeWaitAlert();

		seaAlert(self.lawheader.gmsg);
	}
}

function updateDetail()
{
//MOD BY BILAL - Prior Customization
	//ISH 2007 Fields values change to upper case as .toUpperCase()
	var BenRec = BenefitsRec;
	var BenDoc = self.RIGHT.document;
	var BenForm = self.RIGHT.document.beneficiaryform;
	var	str = escape(BenForm.comments.value)

	str = str.split("%0D%0A").join("\ ");
	str = str.split("%0D").join("\ ");
	str = str.split("%0A").join("\ ");

	var pAgsObj = new AGSObject(authUser.prodline, "BN47.1")
	pAgsObj.rtn = "DATA"
	pAgsObj.longNames = "ALL"
	pAgsObj.tds = false
	pAgsObj.event = (BenRec.seq_nbr > 0) ? "CHANGE" : "ADD"

	pAgsObj.field = ((BenRec.seq_nbr > 0) ? "FC=C": "FC=A")
		+ "&BEN-COMPANY=" 		+ escape(parseInt(authUser.company,10))
		+ "&BEN-EMPLOYEE=" 	 	+ escape(parseInt(authUser.employee,10))
		+ "&BEN-PLAN-TYPE=" 	+ ParseAGSValue(BenRec.plan_type,1)
		+ "&BEN-PLAN-CODE=" 	+ ParseAGSValue(BenRec.plan_code,1)
		+ "&LINE-FC1="          + ((BenRec.seq_nbr > 0) ? "C" : "A")
		+ "&BNF-TYPE1="			+ BenRec.benef_type
		+ "&BNF-CMT-TEXT1="     + ParseAGSValue(unescape(str),1)
		+ "&USER-ID1="			+ "W"+String(authUser.employee)

	clearRequiredField(BenDoc.getElementById("empaddress"));

	if(BenForm.empaddress.selectedIndex > 0)
	{
		if(NonSpace(BenForm.addr1.value) || NonSpace(BenForm.addr2.value)
		|| NonSpace(BenForm.addr3.value) || NonSpace(BenForm.addr4.value)
		|| NonSpace(BenForm.addr5.value) || BenForm.states.selectedIndex > 0
		|| NonSpace(BenForm.zip.value) || BenForm.country.selectedIndex > 0)
		{
			// Home Address edit
			if(BenForm.empaddress.selectedIndex == 1)
			{
				setRequiredField(BenDoc.getElementById("empaddress"));
				seaAlert(getSeaPhrase("HOME_ADDR_SELECTED","BEN"));
				return;
			}

			// Supplemental Address edit
			if(BenForm.empaddress.selectedIndex == 2)
			{
				setRequiredField(BenDoc.getElementById("empaddress"));
				seaAlert(getSeaPhrase("SUP_ADDR_SELECTED","BEN"));
				return;
			}
		}

	//PT 158906 added addition field as spaces
// MOD BY BILAL - Converting into UPPERCASE
		pAgsObj.field += "&EMP-ADDRESS1=" + ParseAGSValue(BenForm.empaddress.options[BenForm.empaddress.selectedIndex].value.toUpperCase(), 1)
			+ "&BNF-ADDR11="+ escape(' ')
			+ "&BNF-ADDR21="+ escape(' ')
			+ "&BNF-ADDR31="+ escape(' ')
			+ "&BNF-ADDR41="+ escape(' ')
			+ "&BNF-CITY1="+ escape(' ')
			+ "&BNF-STATE1="+ escape(' ')
			+ "&BNF-ZIP1="+ escape(' ')
			+ "&BNF-COUNTRY-CODE1="+ escape(' ');
	}
	else
	{
		pAgsObj.field	+= "&BNF-ADDR11=" + ParseAGSValue(BenForm.addr1.value.toUpperCase(), 1)
			+ "&BNF-ADDR21="        + ParseAGSValue(BenForm.addr2.value.toUpperCase(), 1)
			+ "&BNF-ADDR31="        + ParseAGSValue(BenForm.addr3.value.toUpperCase(), 1)
			+ "&BNF-ADDR41="        + ParseAGSValue(BenForm.addr4.value.toUpperCase(), 1)
			+ "&BNF-CITY1="         + ParseAGSValue(BenForm.addr5.value.toUpperCase(), 1)
			+ "&BNF-STATE1="        + ParseAGSValue(BenForm.states.options[BenForm.states.selectedIndex].value.toUpperCase(), 1)
			+ "&BNF-ZIP1="          + ParseAGSValue(BenForm.zip.value.toUpperCase(), 1)
			+ "&BNF-COUNTRY-CODE1=" + ParseAGSValue(BenForm.country.options[BenForm.country.selectedIndex].value.toUpperCase(), 1)
			+ "&EMP-ADDRESS1="+ escape(' ');
	}

	clearRequiredField(BenDoc.getElementById("type"));
	clearRequiredField(BenForm.pmtamt);
// MOD BY BIAL - Prior customization
//	clearRequiredField(BenDoc.getElementById("amount"));
	try { clearRequiredField(BenForm.fica) } 
	    catch(e) {};
// END OF MOD

	if(BenRec.benef_type == 0)
	{
		clearRequiredField(BenForm.firstname);
		clearRequiredField(BenForm.lastname);

		// First Name edit
		if(!NonSpace(BenForm.firstname.value))
		{
			setRequiredField(BenForm.firstname);
			seaAlert(getSeaPhrase("BEN_NAME_REQUIRED","BEN"));
			BenForm.firstname.focus();
			return;
		}

		// Last Name edit
		if(!NonSpace(BenForm.lastname.value))
		{
			setRequiredField(BenForm.lastname);
			seaAlert(getSeaPhrase("BEN_NAME_REQUIRED","BEN"));
			BenForm.lastname.focus();
			return;
		}

// MOD BY BILAL - Prior Customization
//		// Distribution Type edit
//		if(BenForm.amount.selectedIndex == 0)
//		{
//			setRequiredField(BenDoc.getElementById("amount"));
//			seaAlert(getSeaPhrase("DISTRIBUTION_TYPE_REQUIRED","BEN"));
//			BenForm.type.focus();
//			return;
//		}
// END OF MOD

		// Amount edit
		if(!NonSpace(BenForm.pmtamt.value))
		{
			setRequiredField(BenForm.pmtamt);
			seaAlert(getSeaPhrase("ENTER","BEN"));
			BenForm.pmtamt.focus();
			return;
		}

		// Amount edit
		if(isNaN(parseFloat(BenForm.pmtamt.value)) || !ValidNumber(BenForm.pmtamt,12,2))
		{
			setRequiredField(BenForm.pmtamt);
			seaAlert(getSeaPhrase("INVALID_NUMBER","BEN"));
			BenForm.pmtamt.focus();
			return;
		}

		// Only allow up to 100% distribution.
// MOD BY BILAL - Prior customization
    //ISH 2008 Modify Amount to be P
//		if(BenForm.amount.selectedIndex == 2 && parseInt(BenForm.pmtamt.value,10) > 100)
		if(parseInt(BenForm.pmtamt.value, 10) > 100)
		{
			setRequiredField(BenForm.pmtamt);
			seaAlert(getSeaPhrase("SUM_OVERFLOW","BEN"));
			BenForm.pmtamt.focus();
			return;
		}

// CUSTOM EDIT ADDED.
		if(ParseAGSValue(BenForm.relationship.options[BenForm.relationship.selectedIndex].value,1)=="SPOUSE")
		{
			if (BenForm.pmtamt.value != 100)
			{
				setRequiredField(BenForm.pmtamt);
				seaAlert("If relationship is \"Spouse\", percent election should be 100%. \nA consent form should be filled out if designation is less than \n 100% for a relationship \"Spouse\"");
				BenForm.pmtamt.focus();
			    return;
			}
		}

// END OF MOD
		// Beneficiary Type edit
		if(BenForm.type.selectedIndex == 0)
		{
			setRequiredField(BenDoc.getElementById("type"));
			seaAlert(getSeaPhrase("BENEFICIARY_TYPE_REQUIRED","BEN"));
			BenForm.type.focus();
			return;
		}

// MOD BY BILAL - Converting into UpperCase
		pAgsObj.field += "&BNF-LAST-NAME1="	+ ParseAGSValue(BenForm.lastname.value.toUpperCase(),1)
		+ "&BNF-FIRST-NAME1=" 			+ ParseAGSValue(BenForm.firstname.value.toUpperCase(),1)
		+ "&BNF-MIDDLE-INIT1=" 			+ ParseAGSValue(BenForm.middlename.value.toUpperCase(),1)
		//+ "&BNF-LAST-NAME-PRE1=" 		+ ParseAGSValue(BenForm.prefixes.options[BenForm.prefixes.selectedIndex].value,1)
		+ "&BNF-NAME-SUFFIX1=" 			+ ParseAGSValue(BenForm.suffixes.options[BenForm.suffixes.selectedIndex].value.toUpperCase(),1)
		+ "&BNF-REL-CODE1="				+ ParseAGSValue(BenForm.relationship.options[BenForm.relationship.selectedIndex].value,1)
		+ "&BNF-FICA-NBR1="				+ ParseAGSValue(BenForm.fica.value,1)
		+ "&BNF-TRUST1="                + escape(" ");
// END OF MOD
	}
	else
	{
		clearRequiredField(BenForm.trust);

		if(!NonSpace(BenForm.trust.value))
		{
			setRequiredField(BenForm.trust);
			seaAlert(getSeaPhrase("TRUST_NAME_REQUIRED","BEN"));
			BenForm.trust.focus();
			return;
		}

// MOD BY BILAL
//		// Distribution Type edit
//		if(BenForm.amount.selectedIndex == 0)
//		{
//			setRequiredField(BenDoc.getElementById("amount"));
//			seaAlert(getSeaPhrase("DISTRIBUTION_TYPE_REQUIRED","BEN"));
//			BenForm.type.focus();
//			return;
//		}
// END OF MOD

		// Amount edit
		if(!NonSpace(BenForm.pmtamt.value))
		{
			setRequiredField(BenForm.pmtamt);
			seaAlert(getSeaPhrase("ENTER","BEN"));
			BenForm.pmtamt.focus();
			return;
		}

		// Amount edit
		if(isNaN(parseFloat(BenForm.pmtamt.value)) || !ValidNumber(BenForm.pmtamt,12,2))
		{
			setRequiredField(BenForm.pmtamt);
			seaAlert(getSeaPhrase("INVALID_NUMBER","BEN"));
			BenForm.pmtamt.focus();
			return;
		}

		// Only allow up to 100% distribution.
// MOD BY BILAL - Prior Customization
		// ISH 2008 
//		if(BenForm.amount.selectedIndex == 2 && parseInt(BenForm.pmtamt.value,10) > 100)
		if(parseInt(BenForm.pmtamt.value,10) > 100)
		{
			setRequiredField(BenForm.pmtamt);
			seaAlert(getSeaPhrase("SUM_OVERFLOW","BEN"));
			BenForm.pmtamt.focus();
			return;
		}
// END OF MOD

		// Beneficiary Type edit
		if(BenForm.type.selectedIndex == 0)
		{
			setRequiredField(BenDoc.getElementById("type"));
			seaAlert(getSeaPhrase("BENEFICIARY_TYPE_REQUIRED","BEN"));
			BenForm.type.focus();
			return;
		}

		str = escape(BenForm.trust.value)
		str = str.split("%0D%0A").join("\ ");
		str = str.split("%0D").join("\ ");
		str = str.split("%0A").join("\ ");

		pAgsObj.field += "&BNF-TRUST1="			+ ParseAGSValue(unescape(str),1)
		pAgsObj.field += "&BNF-LAST-NAME1="		+ escape(' ')
		pAgsObj.field +="&BNF-FIRST-NAME1=" 	+ escape(' ')
		pAgsObj.field +="&BNF-MIDDLE-INIT1=" 	+ escape(' ')
		pAgsObj.field +="&BNF-LAST-NAME-PRE1=" 	+ escape(' ')
		pAgsObj.field +="&BNF-NAME-SUFFIX1=" 	+ escape(' ')
		pAgsObj.field +="&BNF-REL-CODE1="		+ escape(' ')
		pAgsObj.field +="&BNF-FICA-NBR1="		+ escape(' ')
	}

	pAgsObj.field += "&BNF-PRIM-CNTGNT1=" 	+ ((BenForm.type.selectedIndex == 2) ? "2" : "1")
	+ "&BNF-PMT-AMT1=" 		+ ParseAGSValue(parseFloat(BenForm.pmtamt.value),1)
// MOD BY BILAL - Prior customization
      // JRZ 12/11/08 Only pulling Pre-tax
//	+ "&BNF-PCT-AMT-FLAG1=" + ((BenForm.amount.selectedIndex == 2) ? "P" : "A")
	+ "&BNF-PCT-AMT-FLAG1=P"
      //~JRZ
// END OF MOD

	if (BenRec.seq_nbr > 0) {
		pAgsObj.field += "&BNF-SEQ-NBR1=" + ParseAGSValue(parseInt(BenRec.seq_nbr,10),1)

	//PT 158906 when BenRec.seq_nbr> 0  then FC="C"
	pAgsObj.field +="&WEB-SEQ-NBR=" + ParseAGSValue(parseInt(BenRec.seq_nbr,10),1)
	pAgsObj.field += "&WEB-UPDATE-FL=Y"
	}

	pAgsObj.dtlField = "LINE-FC;BNF-TYPE;BNF-CMT-TEXT;USER-ID;EMP-ADDRESS;BNF-ADDR1;BNF-ADDR2;BNF-ADDR3;BNF-ADDR4;"
	+ "BNF-CITY;BNF-STATE;BNF-ZIP;BNF-COUNTRY-CODE;BNF-LAST-NAME;BNF-FIRST-NAME;BNF-MIDDLE-INIT;BNF-LAST-NAME-PRE;"
	+ "BNF-NAME-SUFFIX;BNF-REL-CODE;BNF-FICA-NBR;BNF-TRUST;BNF-PRIM-CNTGNT;BNF-PMT-AMT;BNF-PCT-AMT-FLAG;BNF-SEQ-NBR";

	pAgsObj.func = "parent.updateFinished()";
	pAgsObj.debug = false;

    if (fromTask)
    {
    	parent.showWaitAlert(getSeaPhrase("PROCESSING","BEN"));
	}

	self.lawheader.gmsgnbr = -1;
	UpdateInProgress = true;
	AGS(pAgsObj,"jsreturn");
}

function updateFinished()
{
	UpdateInProgress = false;
	var BenDoc = self.RIGHT.document;

	if(self.lawheader.gmsgnbr == "000")
	{
		UpdateAllViews 	= true;
		closeDetail();
		DMEToBenefitPlans();
	}
	else
	{
		// if this task has been launched as a related link, remove any processing message
		if (fromTask && typeof(parent.parent.removeWaitAlert) == "function")
			parent.parent.removeWaitAlert();
		if (fromTask && typeof(parent.removeWaitAlert) == "function")
			parent.removeWaitAlert();

	    if(self.lawheader.gmsgnbr == "109")
		{
			setRequiredField(BenDoc.getElementById("amount"));
			seaAlert(getSeaPhrase("DISTRIBUTION_MUST_BE_AMOUNT","BEN"));
			BenDoc.beneficiaryform.type.focus();
		}
		else if(self.lawheader.gmsgnbr == "110")
		{
			setRequiredField(BenDoc.getElementById("amount"));
			seaAlert(getSeaPhrase("DISTRIBUTION_MUST_BE_PERCENT","BEN"));
			BenDoc.beneficiaryform.type.focus();
		}
		else if(self.lawheader.gmsgnbr == "125")
		{
			setRequiredField(BenDoc.getElementById("amount"));
			seaAlert(getSeaPhrase("DELETE_AND_READD","BEN"));
			BenDoc.beneficiaryform.type.focus();
		}
		else
		{
			seaAlert(self.lawheader.gmsg);
		}
	}
}

function maskSocialNbr(socialNbr)
{
	return socialNbr.substring(socialNbr.length-4,socialNbr.length);
}

function printForm()
{
	var tmpBnRecs;
	var BeneficiaryExists = false;
	var strHtml = '';

	strHtml += '<div style="text-align:center">';
	strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">';
	strHtml += '<tr>';
	strHtml += '<td class="plaintableheader" style="text-align:center">'+getSeaPhrase("BENEFICIARY_DESIGNATION","BEN")+'</td>';
	strHtml += '</tr>';
	strHtml += '<tr>';
	strHtml += '<td class="plaintableheader" style="text-align:center">'+((Benefits.length)?Benefits[0].employee_label_name_1:authUser.name)+'</td>';
	strHtml += '</tr>';
	strHtml += '</table>';
	strHtml += '</div>';
	strHtml += '<p/>';

	strHtml += '<table border="0" cellspacing="0" cellpadding="0">';
	strHtml += '<tr>';
	strHtml += '<td class="plaintableheader">'+getSeaPhrase("EMPNUM","BEN")+'</td>';
	strHtml += '<td class="plaintablecell" style="text-align:right" nowrap>'+authUser.employee+'</td>';
	strHtml += '</tr>';
// MOD BY BILAL - Prior Customization
		//ISH 2007 Remove SSN
//	strHtml += '<tr>';
//	strHtml += '<td class="plaintableheader">'+getSeaPhrase("SSN","BEN")+'</td>';
//	strHtml += '<td class="plaintablecell"  style="text-align:right" nowrap>'+((Benefits.length)?maskSocialNbr(Benefits[0].employee_fica_nbr):'')+'</td>';
//	strHtml += '</tr>';
// END OF MOD
	strHtml += '</table>';
	strHtml += '<p/>';

	for (var TypeCode in Beneficiaries)
	{
		tmpBnRecs = Beneficiaries[TypeCode];

		var marginStr = (BeneficiaryExists)?"margin-top:10px;":"";

		strHtml += '<table style="'+marginStr+'border:#dddddd 1px solid" border="0" cellspacing="0" cellpadding="0" width="100%">';
		strHtml += '<tr class="tablerowhighlight" style="border-bottom:#dddddd 1px solid">';
		strHtml += '<td class="plaintablerowheader" style="width:25%">'+getSeaPhrase("PLAN_TYPE","BEN")+'</td>';
		strHtml += '<td class="plaintableheader" style="width:75%">'+PlanTypeTitle(tmpBnRecs[0].plan_type)+'</td>';
		strHtml += '</tr>';
		strHtml += '<tr class="tablerowhighlight">';
		strHtml += '<td class="plaintablerowheader" style="width:25%">'+getSeaPhrase("PLAN_NAME","BEN")+'</td>';
		strHtml += '<td class="plaintableheader" style="width:75%">'+tmpBnRecs[0].plan_desc+'</td>';
		strHtml += '</tr>';

		BeneficiaryExists = true;

		if (tmpBnRecs[0].seq_nbr)
		{
			for (var i=0; i<tmpBnRecs.length; i++)
			{
				if (tmpBnRecs[i].seq_nbr) {
					strHtml += DrawBeneficiary(tmpBnRecs[i],i,TypeCode);
				}
			}
		}
		else {
			strHtml += '<tr>';
			strHtml += '<td class="plaintableheader" style="width:25%">&nbsp;</td>';
			strHtml += '<td class="plaintableheader" style="width:75%">'+getSeaPhrase("NO_BEN_SPECIFIED","BEN")+'</td>';
			strHtml += '</tr>';
		}

		strHtml += '</table>';
	}

	strHtml += '<p/><p/><p/>';
// MOD BY BILAL - Prior customization
		//ISH 2007 Remove Signature Line
//	strHtml += '<table border="0" cellspacing="0" cellpadding="0" width="100%">';
//	strHtml += '<tr>';
//	strHtml += '<td class="plaintableheader">_______________________________</td>';
//	strHtml += '<td class="plaintableheader">___________________________</td>';
//	strHtml += '<td class="plaintableheader">_____________</td>';
//	strHtml += '</tr>';
//	strHtml += '<tr>';
//	strHtml += '<td class="plaintableheader">'+getSeaPhrase("PRINT_EE_NAME","BEN")+'</td>';
//	strHtml += '<td class="plaintableheader">'+getSeaPhrase("SIGNATURE","BEN")+'</td>';
//	strHtml += '<td class="plaintableheader">'+getSeaPhrase("DATE","BEN")+'</td>';
//	strHtml += '</tr>';
//	strHtml += '</table>';
// END OF MOD

    self.printframe.document.title = getSeaPhrase("BENEFICIARIES","BEN");
    self.printframe.document.body.innerHTML = strHtml;
	self.printframe.stylePage();
	sendToPrinter();
}

function OpenHelpDialog()
{
	openHelpDialogWindow("/lawson/xhrnet/Beneficiaries/SHR002_help.htm");
}

function sendToPrinter()
{
	self.printframe.focus();
	self.printframe.print();
}

function ParseAGSValue(value, flag)
{
	return (value == "")? escape(" ") : escape(value,1);
}

function fitToScreen()
{
	if (typeof(window["styler"]) == "undefined" || window.styler == null)
	{
		window.stylerWnd = findStyler(true);
	}

	if (!window.stylerWnd)
	{
		return;
	}

	if (typeof(window.stylerWnd["StylerEMSS"]) == "function")
	{
		window.styler = new window.stylerWnd.StylerEMSS();
	}
	else
	{
		window.styler = window.stylerWnd.styler;
	}

	var leftFrame = document.getElementById("LEFT");
	var rightFrame = document.getElementById("RIGHT");
	var winHeight = 464;
	var winWidth = 803;

	// resize the table frame to the screen dimensions
	if (document.body.clientHeight)
	{
		winHeight = document.body.clientHeight;
		winWidth = document.body.clientWidth;
	}
	else if (window.innerHeight)
	{
		winHeight = window.innerHeight;
		winWidth = window.innerWidth;
	}

	var contentLeftWidth = (window.styler && window.styler.showLDS) ? (parseInt(winWidth*.49,10) - 17) : ((navigator.appName.indexOf("Microsoft") >= 0) ? (parseInt(winWidth*.49,10) - 12) : (parseInt(winWidth*.49,10) - 7));
	var contentRightWidth = (window.styler && window.styler.showLDS) ? (parseInt(winWidth*.51,10) - 17) : ((navigator.appName.indexOf("Microsoft") >= 0) ? (parseInt(winWidth*.51,10) - 12) : (parseInt(winWidth*.51,10) - 7));

	leftFrame.style.width = parseInt(winWidth*.49,10) + "px";
	leftFrame.style.height = winHeight + "px";
	self.LEFT.document.getElementById("paneBodyBorder").style.width = contentLeftWidth + "px";
	self.LEFT.document.getElementById("paneBodyBorder").style.height = (winHeight - 35) + "px";
	self.LEFT.document.getElementById("paneBody").style.width = "100%";

	rightFrame.style.left = parseInt(winWidth*.49,10) + "px";
	rightFrame.style.width = parseInt(winWidth*.51,10) + "px";
	rightFrame.style.height = winHeight + "px";
	self.RIGHT.document.getElementById("paneBodyBorder").style.width = contentRightWidth + "px";
	self.RIGHT.document.getElementById("paneBodyBorder").style.height = (winHeight - 35) + "px";
	self.RIGHT.document.getElementById("paneBody").style.width = "100%";
}
</script>
<!-- MOD BY BILAL  prior customizations -->
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-395426-5");
pageTracker._trackPageview();
} catch(err) {}</script>
<!-- END OF MOD -->
</head>
<body style="overflow:hidden" onload="fitToScreen();Initialize()" onresize="fitToScreen()">
	<iframe id="LEFT" name="LEFT" style="position:absolute;top:0px;left:0%;width:49%;height:100%;visibility:hidden" src="/lawson/xhrnet/ui/headerpane.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="RIGHT" name="RIGHT" style="position:absolute;top:0px;left:49%;width:51%;height:100%;visibility:hidden" src="/lawson/xhrnet/ui/headerpanehelplite.htm" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="jsreturn" name="jsreturn" src="/lawson/xhrnet/dot.htm" style="visibility:hidden;height:0px;width:0px;" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="lawheader" name="lawheader" src="/lawson/xhrnet/Beneficiaries/SHR002_law.htm" style="visibility:hidden;height:0px;width:0px;" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
	<iframe id="printframe" name="printframe" src="/lawson/xhrnet/ui/pane.htm" style="visibility:visible;height:1px;width:100%" frameborder="no" marginwidth="0" marginheight="0" scrolling="no"></iframe>
</body>
</html>
<!-- Version: 8-)@(#)@(201111) 09.00.01.06.00 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/Beneficiaries/SHR002.htm,v 1.24.2.24 2011/05/04 21:10:20 brentd Exp $ -->
