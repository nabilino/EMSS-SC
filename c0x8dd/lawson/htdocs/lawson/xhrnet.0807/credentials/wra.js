// Version: 8-)@(#)@10.00.02.00.29
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/credentials/wra.js,v 1.7.2.5 2012/06/29 17:24:23 brentd Exp $
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
//*   (c) COPYRIGHT 2012 INFOR.  ALL RIGHTS RESERVED.           *
//*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//*                                                             *
//***************************************************************
var WRAV;

function WRAVObject(Employee,Company,SystemDate,Name)
{
	this.EmployeeCode = Employee;
	this.Company = Company;
	this.SystemDate = SystemDate;
	this.Name = Name;
	this.WRAVRecords = new Array();
	this.WRAVHtml = "";
}

function WorkRestrictionsProfile(Company, Employee, SystemDate, Name)
{
	if(typeof(WRAV)!="undefined" && WRAV.EmployeeCode == Employee)
	{
		WRAV.Manager = true;
		OpenWRAVWindow();
	}
	else
	{
		WRAV = new WRAVObject(Employee,Company,SystemDate,Name);
		var DMEobj 		= new DMEObject(authUser.prodline, "PAMEDICAL");
			DMEobj.out	= "JAVASCRIPT";
			DMEobj.field	= "hr-code.description;code;type;beg-date;end-date";
			DMEobj.index	= "pmdset1";
			DMEobj.key	= Company +"="+ Employee +"=WR;AC";
			DMEobj.max	= "600";
			DMEobj.select	= "end-date=00000000|end-date>="+SystemDate;
			DMEobj.func	= "DSP_PAMEDICAL()";
			DMEobj.debug	= false;
		DME(DMEobj,"jsreturn");
	}
}

function DSP_PAMEDICAL()
{
	WRAV.WRAVRecords = WRAV.WRAVRecords.concat(self.jsreturn.record);

	if (self.jsreturn.Next!="") {
		window.jsreturn.location.replace(self.jsreturn.Next);
	}
	else {
		 OpenWRAVWindow();
	}
}

function OpenWRAVWindow()
{
	WRAV.WRAVWindow = self;
	WRAV.WRAVHtml = PaintWRAVTable();	
	WorkRestrictionsDone();
}

function sortByDescription(obj1, obj2)
{
	var name1 = obj1.hrcode_description;
	var name2 = obj2.hrcode_description;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function PaintWRAVTable()
{
	var WRRecs = new Array();
	var ACRecs = new Array();
	
	for (var i=0; i<WRAV.WRAVRecords.length; i++)
	{
		if (WRAV.WRAVRecords[i].type == "WR") {
			WRRecs[WRRecs.length] = WRAV.WRAVRecords[i];
		}
		else if (WRAV.WRAVRecords[i].type == "AC")
		{
			ACRecs[ACRecs.length] = WRAV.WRAVRecords[i];
		}
	}	

	WRRecs.sort(sortByName);
	ACRecs.sort(sortByName);
	
	var strHtml = '';

	// display the work restrictions sorted alphanumerically by type
	if (getSeaPhrase("WORK_RESTRICTION","CR") < getSeaPhrase("ACCOMMODATION","CR")) {
		strHtml += BuildWRTable(WRRecs);
		strHtml += BuildACTable(ACRecs);
	}	
	else {
		strHtml += BuildACTable(ACRecs);
		strHtml += BuildWRTable(WRRecs);	
	}
	
	return strHtml;
}

function BuildWRTable(WRRecs)
{
	var strHtml = "";
	
	if (WRRecs.length > 0) {
		
		strHtml += '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">'
		+ '<tr><th class="plaintableheaderborder" style="width:56%;text-align:center">'+getSeaPhrase("WORK_RESTRICTION","CR")+'</th>'
		+ '<th class="plaintableheaderborder" style="width:22%;text-align:center">'+getSeaPhrase("BEGIN","CR")+'</th>'
		+ '<th class="plaintableheaderborder" style="width:22%;text-align:center">'+getSeaPhrase("END","CR")+'</th>'		
		+ '</tr>';		
		
		for (var i=0; i<WRRecs.length; i++)
		{
			strHtml += '<tr>'
			+ '<td class="plaintablecell">'
			+ ((WRRecs[i].hr_code_description && NonSpace(WRRecs[i].hr_code_description)>0)?WRRecs[i].hr_code_description:'&nbsp;')
			+'</td>';
	
			strHtml += '<td class="plaintablecell" style="text-align:center">'
			+ ((WRRecs[i].beg_date && NonSpace(WRRecs[i].beg_date)>0)?formatDME(WRRecs[i].beg_date):'&nbsp;')
			+ '</td>';
			
			strHtml += '<td class="plaintablecell" style="text-align:center">'
			+ ((WRRecs[i].end_date && NonSpace(WRRecs[i].end_date)>0)?formatDME(WRRecs[i].end_date):'&nbsp;')
			+ '</td></tr>';		
		}
	
		strHtml += '</table>';
	}
	return strHtml;
}

function BuildACTable(ACRecs)
{
	var strHtml = "";
	
	if (ACRecs.length > 0) {
		
		strHtml += '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" width="100%" styler="list">'
		+ '<tr><th class="plaintableheaderborder" style="width:56%;text-align:center">'+getSeaPhrase("ACCOMMODATION","CR")+'</th>'
		+ '<th class="plaintableheaderborder" style="width:22%;text-align:center">'+getSeaPhrase("BEGIN","CR")+'</th>'
		+ '<th class="plaintableheaderborder" style="width:22%;text-align:center">'+getSeaPhrase("END","CR")+'</th>'		
		+ '</tr>';		
		
		for (var i=0; i<ACRecs.length; i++)
		{
			strHtml += '<tr>'
			+ '<td class="plaintablecell">'
			+ ((ACRecs[i].hr_code_description && NonSpace(ACRecs[i].hr_code_description)>0)?ACRecs[i].hr_code_description:'&nbsp;')
			+'</td>';
	
			strHtml += '<td class="plaintablecell" style="text-align:center">'
			+ ((ACRecs[i].beg_date && NonSpace(ACRecs[i].beg_date)>0)?formatDME(ACRecs[i].beg_date):'&nbsp;')
			+ '</td>';
			
			strHtml += '<td class="plaintablecell" style="text-align:center">'
			+ ((ACRecs[i].end_date && NonSpace(ACRecs[i].end_date)>0)?formatDME(ACRecs[i].end_date):'&nbsp;')
			+ '</td></tr>';			
		}
		
		strHtml += '</table>';
	}
	return strHtml;
}
