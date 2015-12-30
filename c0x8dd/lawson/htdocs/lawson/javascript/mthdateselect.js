//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/mthdateselect.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
// Description: This function opens a calendar window from which a month and year can
//              be selected to be returned to the calling program as two separate fields.
// Arguments:   No arguments are required.
//

var date_fld_name1 = ""
var date_fld_name2 = ""
var frame_nm = ""

function OpenDateSelect()
{
	if (typeof DateWin != "object")
		DateWin = window.open("/lawson/javascript/mthdateselect.htm","dateselect","height=220,width=300,menubar=no")
	else
	{
		if (DateWin.closed)
			DateWin = window.open("/lawson/javascript/mthdateselect.htm","dateselect","height=220,width=300")
		else
			DateWin.focus()
	}
	if (DateWin == null)
	{
		DateWin = ""
		alert("Unable to open new window; Please restart your web browser")
	}
}


function ReturnDate(theMonth,theYear)
{
	eval(frame_nm + '.document.forms[0].elements["' + date_fld_name1 + '"].value=theMonth')
	eval(frame_nm + '.document.forms[0].elements["' + date_fld_name2 + '"].value=theYear')
}


function DateSelect(framenm,fldname1,fldname2,n)
{
	date_fld_name1 = fldname1
	date_fld_name2 = fldname2
    frame_nm      = framenm
	if (n)
		pct_n = n

	OpenDateSelect()
}
