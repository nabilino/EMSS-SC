//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/todaysdate.js,v 1.1.26.1 2007/02/06 22:08:33 keno Exp $ $Name: REVIEWED_901 $
// Description: This function will returns todays date in the format
//				of mm/dd/yyyy.
// Example:     var strtoday = todaysdate()
//			    If today was May 7, 1997 the function would
//			    return 05/07/1997.
// Arguments:   No arguments are required.

function todaysdate()
{
	var today = new Date();
	var	thisDay = today.getDate();
	thisDay = "" + thisDay
	if (thisDay.length == 1)
		thisDay = "0" + thisDay
	var thisMonth = today.getMonth() + 1;
	thisMonth = "" + thisMonth
	if (thisMonth.length == 1)
		thisMonth = "0" + thisMonth
	var thisYear = today.getFullYear()
//	var thisYear = today.getYear()
//	if (thisYear < 100)
//		thisYear += 1900
	var fmttoday = thisMonth + "/" + thisDay + "/" + thisYear
	return fmttoday
}
