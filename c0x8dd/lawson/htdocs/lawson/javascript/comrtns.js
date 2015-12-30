//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
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
var fmttoday 		= thisMonth + "/" + thisDay + "/" + thisYear
var ymdtoday 		= "" + thisYear + thisMonth + thisDay
var daysinmonth 	= new Array(0,31,29,31,30,31,30,31,31,30,31,30,31)

function NonSpace(str)
{
	if(typeof(str)=='undefined' || !str)
		return 0;
	var n = 0
	for (var i=0;i<str.length;i++)
	{
		if (str.charAt(i) != " ")
			n++
	}
	return n
}

function ValidDate(obj)
{
	var nstr 		= ""
	var slashcnt 	= 0
	var nmonth 		= ""
	var nday 		= ""
	var month 		= ""
	var day 		= ""
	var year 		= ""
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

function ValidTime(obj,size)
{
	var val = obj.value
	if (NonSpace(val) == 0)
		return true
	if (val.length == 0)
		return true
	var str = val.split(":")
	if (str.length > 3)
		return false
	for (var i = 0;i < str.length;i++)
	{
		if (str[i].length > 2)
		{
			return false
			break
		}
		else if (str[i].length == 1)
			str[i] = "0" + str[i]
		else if (str[i].length == 0)
			str[i] = "00"
	}
	var nstr = str.join(":")
	if (nstr.length == 1)
		nstr += "0:00:00"
	else if (nstr.length == 2)
		nstr += ":00:00"
	else if (nstr.length == 3)
		nstr += "00:00"
	else if (nstr.length == 4)
		nstr += "0:00"
	else if (nstr.length == 5)
		nstr += ":00"
	else if (nstr.length == 6)
		nstr += "00"
	else if (nstr.length == 7)
		nstr += "0"
	if (size == 4)
		val = nstr.substring(0,5)
	else
		val = nstr
/*
	var colons = 0
	var col_pos = -1
	for (var i = 0;i < val.length;i++)
	{
		if (val.charAt(i) == ":")
		{
			col_pos = i
			++colons
		}
	}
	if (colons > 2)
		return false
	if (colons == 0 && val.length > 4)
		return false
	if (colons == 1 && (val.length > 5 || val.length < 2))
		return false
	if (colons == 1 && (col_pos < 1 || col_pos > 2))
		return false
	if (colons == 1)
	{
		if (val.length == 2)
			val = "0" + val + "00"
		else if (val.length == 3)
		{
			if (col_pos == 1)
				val = "0" + val.charAt(0) + ":" + val.charAt(2) + "0"
			else if (col_pos == 2)
				val = val + "00"
		}
		else if (val.length == 4)
		{
			if (col_pos == 1)
				val = "0" + val
			else if (col_pos == 2)
				val = val + "0"
		}
	}
	if (colons == 0)
	{
		if (val.length == 1)
			val = "0" + val + ":00"
		else if (val.length == 2)
			val = val + ":00"
		else if (val.length == 3)
			val = "0" + val.substring(0,1) + ":" + val.substring(1,3)
		else
			val = val.substring(0,2) + ":" + val.substring(2,4)
	}
*/
	var str = val.split(":")
	var h = Number(str[0])
	var m = Number(str[1])
	var s = 0
	if (str[2])
		s = Number(str[2])
	if (h > 24)
		return false
	if (m > 59)
		return false
	if (s > 59)
		return false
	obj.value = val
	return true
}

function ValidNumber(obj,size,decimal)
{
	if (obj.value.length == 0)
		return true
	var decimalcount = 0
	var nbrdec = 0
	var zerocount = 0
	for (var i = 0;i < obj.value.length;i++)
	{
		if (obj.value.charAt(i) == ".")
			decimalcount++
		else
		{
			if (obj.value.charAt(i) == "0")
				zerocount++
			if (obj.value.charAt(i) < "0" || obj.value.charAt(i) > "9")
			{
				return false
				break
			}
			else
			{
				if (decimalcount > 0)
					nbrdec++
			}
		}
	}
	if (decimalcount > 1 && decimal != 0)
		return false
	if (decimalcount > 0 && decimal == 0)
		return false
	if (nbrdec > decimal)
		return false
	if (decimalcount + zerocount == obj.value.length)
	{
		obj.value = ""
		return true
	}
	if (obj.value.charAt(0) == ".")
		obj.value = "0" + obj.value
	if (nbrdec < decimal)
	{
		if (decimalcount == 0)
			obj.value += "."
		for (var i = 1;i <= decimal - nbrdec;i++)
			obj.value += "0"
	}
	if (obj.value.length > size)
		return false

	return true
}

function formjsDate(value)
{
	value+=''
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

function agsTime(value,size)
{
	var retval = ""
	if (value.length == 0)
		retval = "0000"
	else if (value.length == 1)
		retval = "000"
	else if (value.length == 2)
		retval = "00"
	else if (value.length == 3)
		retval = "0"
	for (var i = 0;i < value.length;i++)
	{
		if (value.charAt(i) >= "0" && value.charAt(i) <= "9")
			retval += value.charAt(i)
	}
	if (size == 5)
		retval = retval.substring(0,4)
	return retval
}

