//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/common.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
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
//var thisYear = today.getYear()
//if (thisYear < 100)
//	thisYear += 1900
var fmttoday = thisMonth + "/" + thisDay + "/" + thisYear
var ymdtoday = "" + thisYear + thisMonth + thisDay
var daysinmonth = new Array(0,31,29,31,30,31,30,31,31,30,31,30,31)
var DateWin = ""
var date_fld_name = ""
var frame_nm = ""
var supflag = false
var fc = ""
var sub_emp_name = ""

function ReturnDate(theDate)
{
	eval(frame_nm + '.document.forms[0].elements["' + date_fld_name + '"].value=theDate')
	if (date_fld_name == 'reqDelDate')
    	Req_Del_Dt = theDate
}

function NonSpace(str)
{
	var n = 0
	for (var i=0;i<str.length;i++)
	{
		if (str.charAt(i) != " ")
			n++
	}
	return n
}

function UpperCase(obj)
{
	obj.value = obj.value.toUpperCase()
}

function FormatDate(date)   //**  MM/DD/YEAR - logan returns dates in this format **//
{
	if (date.length == 0)
		return ""
	else
	if (date == "00000000")
		return ""
	else
    	return date
//		return date.substring(4,6) + "/" + date.substring(6,8) + "/" + date.substring(0,4)
}

function ValidateDate(obj)
{
	if (ValidDate(obj) == false)
	{
		alert("Invalid Date")
		obj.focus()
		obj.select()
	}
}

function ValidDate(obj)
{
	var nstr = ""
	var slashcnt = 0
	var nmonth = ""
	var nday = ""
	var month = ""
	var day = ""
	var year = ""
	if (NonSpace(obj.value) == 0)
		return true
	if (obj.value.length == 1)
	{
		if (obj.value.charAt(0) == "T" || obj.value.charAt(0) == "t")
			obj.value = thisMonth + "/" + thisDay + "/" + thisYear
		if (obj.value.charAt(0) == "B" || obj.value.charAt(0) == "b" ||
		    obj.value.charAt(0) == "F" || obj.value.charAt(0) == "f")
			obj.value = thisMonth + "/01/" + thisYear
		if (obj.value.charAt(0) == "E" || obj.value.charAt(0) == "e" ||
		    obj.value.charAt(0) == "L" || obj.value.charAt(0) == "l")
		{
			nday = daysinmonth[eval(thisMonth)]
			if (thisMonth == "02")
			{
				if (eval(thisYear % 4) != 0 || year == 1900)
					nday = "28"
			}
			obj.value = thisMonth + "/" + nday + "/" + thisYear
		}
	}
	if (obj.value.length > 2 && (obj.value.charAt(0) == "T" || obj.value.charAt(0) == "t"))
	{
		sign = obj.value.charAt(1)
		days = obj.value.substring(2,obj.value.length)
		for (var i = 0;i < days.length;i++)
		{
			if (days.charAt(i) < "0" || days.charAt(i) > "9")
			{
				return false
				break
			}
		}
		days = eval(days)
		x = Date.parse(fmttoday)
		y = new Date()
		if (sign == "+")
			x += (days * 24 * 60 * 60 * 1000)
		else
			x -= (days * 24 * 60 * 60 * 1000)
		y.setTime(x)
		var	newDay = y.getDate();
		newDay = "" + newDay
		if (newDay.length == 1)
			newDay = "0" + newDay
		var newMonth = y.getMonth() + 1;
		newMonth = "" + newMonth
		if (newMonth.length == 1)
			newMonth = "0" + newMonth
		var newYear = y.getFullYear()
//		var newYear = y.getYear()
//		if (newYear < 100)
//			newYear += 1900
		obj.value = newMonth + "/" + newDay + "/" + newYear
	}
	for (var i = 0;i < obj.value.length;i++)
	{
		if (obj.value.charAt(i) == "/")
			slashcnt++
		else
		{
			if (obj.value.charAt(i) < "0" || obj.value.charAt(i) > "9")
			{
				return false
				break
			}
			else
			{
				if (slashcnt == 0)
					nmonth += obj.value.charAt(i)
				if (slashcnt == 1)
					nday += obj.value.charAt(i)
				nstr += obj.value.charAt(i)
			}
		}
	}
	if (slashcnt == 1 && nstr.length <= 4 && nstr.length >= 2)
	{
		if (nmonth.length == 1)
			nmonth = "0" + nmonth
		if (nday.length == 1)
			nday = "0" + nday
		nstr = "" + nmonth + nday + thisYear
		obj.value = nmonth + "/" + nday + "/" + thisYear
		++slashcnt
	}
	if (slashcnt == 0 && nstr.length <= 2 && nstr.length >= 1)
	{
		if (nstr.length == 1)
			nstr = "0" + nstr
		obj.value = thisMonth + "/" + nstr + "/" + thisYear
		nstr = "" + thisMonth + nstr + thisYear
		slashcnt = 2
	}
	if (slashcnt != 2 && slashcnt != 0)
		return false
	if (nstr.length < 4 || nstr.length > 8)
		return false
	var fullyear = (eval(obj.value.length - obj.value.lastIndexOf("/") - 1) == 4) ? true : false

	if (nstr.length == 4)
	{
		month = nstr.substring(0,1)
		day = nstr.substring(1,2)
		year = nstr.substring(2,4)
	}
	if (nstr.length == 5)
	{
		month = nstr.substring(0,1)
		day = nstr.substring(1,3)
		year = nstr.substring(3,5)
	}
	if (nstr.length == 6)
	{
		if (fullyear)
		{	
			month = nstr.substring(0,1)
			day = nstr.substring(1,2)
			year = nstr.substring(2,6)
		}
		else
		{	
			month = nstr.substring(0,2)
			day = nstr.substring(2,4)
			year = nstr.substring(4,6)
		}
	}
	if (nstr.length == 7)
	{
		month = nstr.substring(0,1)
		day = nstr.substring(1,3)
		year = nstr.substring(3,7)
	}
	if (nstr.length == 8)
	{
		month = nstr.substring(0,2)
		day = nstr.substring(2,4)
		year = nstr.substring(4,8)
	}
	if (year.length == 2)
	{
		if (year < 70)
			year = "20" + year
		else
			year = "19" + year
	}
	if (year < 1870 || year > 2069)
		return false
	if (month < 1 || month > 12)
		return false
	if (day < 1 || day > daysinmonth[eval(month)])
		return false
	if (day > 28 && month == 2)
	{
		if (eval(year % 4) != 0 || year == 1900)
			return false
	}
	if (month.length == 1)
		month = "0" + month
	if (day.length == 1)
		day = "0" + day
	obj.value = "" + month + "/" + day + "/" + year
	return true
}

function formjsDate(value)
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

function DateSelect(framenm,fldname,n)
{
	date_fld_name = fldname
    frame_nm      = framenm
	if (n)
		pct_n = n

	OpenDateSelect()
}

