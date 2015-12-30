//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/agsdate.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
function agsdate(value)
{
	var ymddate = ""
	var date = ""
	var month = ""
	var day = ""
	var year = ""
	if (value == "")
		return ymddate
	if (value == " ")
	{
		ymddate = " "
		return ymddate
	}
	for (var i = 0;i < value.length;i++)
	{
		if (value.charAt(i) >= "0" && value.charAt(i) <= "9")
			date += value.charAt(i)
	}
	var fullyear = (eval(value.length - value.lastIndexOf("/") - 1) == 4) ? true : false

	if (date.length == 4)
	{
		month = date.substring(0,1)
		day = date.substring(1,2)
		year = date.substring(2,4)
	}
	if (date.length == 5)
	{
		month = date.substring(0,1)
		day = date.substring(1,3)
		year = date.substring(3,5)
	}
	if (date.length == 6)
	{
		if (fullyear)
		{	
			month = date.substring(0,1)
			day = date.substring(1,2)
			year = date.substring(2,6)
		}
		else
		{	
			month = date.substring(0,2)
			day = date.substring(2,4)
			year = date.substring(4,6)
		}
	}
	if (date.length == 7)
	{
		month = date.substring(0,1)
		day = date.substring(1,3)
		year = date.substring(3,7)
	}
	if (date.length == 8)
	{
		month = date.substring(0,2)
		day = date.substring(2,4)
		year = date.substring(4,8)
	}
	if (year.length == 2)
	{
		if (year < 70)
			year = "20" + year
		else
			year = "19" + year
	}
	if (month.length == 1)
		month = "0" + month
	if (day.length == 1)
		day = "0" + day
	ymddate = "" + year + month + day
	return ymddate
}
