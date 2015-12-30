// Version: 8-)@(#)@(201111) 09.00.01.06.00
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/esscommon.js,v 1.4.4.10 2009/12/16 20:06:29 brentd Exp $
var today = new Date();
var	thisDay = today.getDate();
var thisMonth = today.getMonth() + 1;
var thisYear = today.getFullYear()

thisDay = "" + thisDay

if (thisDay.length == 1)
	thisDay = "0" + thisDay

thisMonth = "" + thisMonth

if (thisMonth.length == 1)
	thisMonth = "0" + thisMonth

var fmttoday 		= thisMonth + "/" + thisDay + "/" + thisYear
var ymdtoday 		= "" + thisYear + thisMonth + thisDay
var daysinmonth 	= new Array(0,31,29,31,30,31,30,31,31,30,31,30,31)
var DateWin 		= ""
var date_fld_name 	= ""
var supflag 		= false
var fc 				= ""
var sub_emp_name 	= ""
var phonenbr 		= ""
var TipsWindow;

//***************************************************************************************
// Converts a string of "5-" to a number -5
// Example of use
//		setValue("678-")
//***************************************************************************************
function setValue(num)
{
	var negative=false
	if((num+'').indexOf('-')!=-1 && (num+'').indexOf('-')!=0)
		negative=true
	num=parseFloat(num)
	num+=''
	if(negative)
		num='-'+num
	parseFloat(num)
	return num
}

//***************************************************************************************
// WindowName is a String containing an alternate name for your window. This parameter is
//	optional. _tipsWin is the default tips window name.
// Example of use
//		openTipsWin("/lawson/tips.htm", "TipsWindow")
//***************************************************************************************
function openTipsWin(URLSTRING)
{	
	if(typeof(TipsWindow)!='undefined' && !TipsWindow.closed)
		TipsWindow.focus()
	else
		TipsWindow = window.open(URLSTRING,"Tips","scrollbars=yes,toolbar=no,status=no,resizable=yes,width=400,height=400")
}

//****************************************************************************************
//Returns a non zero value if string contains characters. Returns 0 if the string contains
//all spaces.
//Example of use
//		NonSpace("    ")
//****************************************************************************************
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

//***************************************************************************************
// Converts an text box's value from lower to uppercase. obj is the textbox object.
// Example of use
//		write("<input type=text onChange="parent.UpperCase(this)">')
//***************************************************************************************
function UpperCase(obj)	
{
	obj.value = obj.value.toUpperCase()
}

//***************************************************************************************
// Display the alert box cleanly by removing all messaging windows. optional second 
// argument for a window to have this alert box mapped to.
// Example of use.
//		MsgBox("Transaction complete!", "ProgramWindow")
//***************************************************************************************
function MsgBox(msg)
{
	removeWaitAlert()
	if(arguments.length>1)
	{
		if(arguments.length>2 && arguments[2]=="confirm")
		{
			var funcToCall = (arguments.length > 3 && typeof(arguments[3]) == "function") ? arguments[3] : null;
			
			if(typeof(eval(arguments[1]))!="undefined")
			{
				var winObj = eval(arguments[1]);
				winObj.focus();
				return winObj.seaConfirm(msg, "", funcToCall)		
			}
			else
			{
				self.focus();
				return seaConfirm(msg, "", funcToCall)
			}
		}
		else
		{
			if(typeof(eval(arguments[1]))!="undefined")
			{
				var winObj = eval(arguments[1]);
				winObj.focus();
				winObj.seaAlert(msg)
			}
			else
			{
				self.focus();
				seaAlert(msg)
			}
		}
	}
	else
	{
		self.focus();
		seaAlert(msg)
	}
}

//***************************************************************************************
// AGS date checker. If date is returned 00000000 then return blank.
// Example of use
//		FormatDate("19990808")
//***************************************************************************************
function FormatDate(date)
{
	if (date.length == 0)
		return ""
	else
	
	if (date == "00000000")
		return ""
	else
		return date
}

//***************************************************************************************
// validate a date within a textbox object and return an error if one is found. Optional
// argument for a window name for the alert box to be tied to.
// Example of use
//		write('<input type=text onChange="parent.ValidateDate(this)">')
//***************************************************************************************
function ValidateDate(obj)
{
	if (ValidDate(obj) == false)
	{
		if(arguments.length>0)
			MsgBox("Invalid Date", arguments[1])
		else
			MsgBox("Invalid Date")
		
		try
		{
			obj.focus()
			obj.select()
		}
		catch(e) {}
	}
}

//***************************************************************************************
// validates a date from a textbox object. It will change the value within the textbox
// automatically. 
// Example of use
//		write('<input type=text onChange="parent.ValidDate(this)">')
//***************************************************************************************
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
		if (obj.value.charAt(0).toUpperCase() == "T")
			obj.value = thisMonth + "/" + thisDay + "/" + thisYear

		if (obj.value.charAt(0).toUpperCase() == "B" || obj.value.charAt(0).toUpperCase() == "F")
			obj.value = thisMonth + "/01/" + thisYear

		if (obj.value.charAt(0).toUpperCase() == "E" || obj.value.charAt(0).toUpperCase() == "L")
		{
			if (parseInt(thisMonth,10) == 2)
			{
				nday = (isLeapYear(parseInt(thisYear,10))) ? "29" : "28"
			}
			else nday = daysinmonth[parseInt(thisMonth,10)]
			obj.value = thisMonth + "/" + nday + "/" + thisYear
		}
	}

	if (obj.value.length > 2 && obj.value.charAt(0).toUpperCase() == "T")
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

	for (var i=0; i<obj.value.length; i++)
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

	if (parseInt(year,10) < 1870 || parseInt(year,10) > 2069)
		return false

	if (parseInt(month,10) < 1 || parseInt(month,10) > 12)
		return false

	if (parseInt(day,10) < 1 || parseInt(day,10) > daysinmonth[parseInt(month,10)])
		return false

	if (parseInt(month,10) == 2 && parseInt(day,10) > 28 && !isLeapYear(parseInt(year,10)))
		return false
		
	if (month.length == 1)
		month = "0" + month

	if (day.length == 1)
		day = "0" + day

	obj.value = "" + month + "/" + day + "/" + year
	return true
}

//***************************************************************************************
// ???
//***************************************************************************************
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

//***************************************************************************************
// Same as validateDate however this validates numeric fields. Optional field for window
// name for the alert box to be tied to.
// Example of use
//		write('<input type=text onChange="parent.ValidateNumber(this,4,2)">')
//***************************************************************************************
function ValidateNumber(obj,size,decimal)
{
	if (ValidNumber(obj,size,decimal) == false)
	{
		if(arguments.length>0)
			MsgBox("Invalid Number", arguments[1])
		else
			MsgBox("Invalid Number")

		obj.focus()
		obj.select()
	}
}

//***************************************************************************************

//***************************************************************************************
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

function replaceSpaces(str)
{
	var nstr = ""
	for (var i=0;i < str.length;i++)
	{
		if (str.charAt(i) == " ")
			nstr += "+"
		else
			nstr += str.charAt(i)
	}
	return nstr
}

//***************************************************************************************
// Open calendar. You must have dateselect.js included for this to work
//***************************************************************************************
function DateSelect(fldname,n)
{
	date_fld_name = fldname
	if (n)
		pct_n = n

	OpenDateSelect()
}

//***************************************************************************************
// use this to clear a frame. Use this to assign values to the document object. optional
// argument for a frame name. Default is "CONTROLITEM".
//***************************************************************************************
function ClearControlItem()
{
	var frameNm;
	if(arguments.length>0)
		frameNm = arguments[1];
	else
		frameNm = "CONTROLITEM";
		
	eval('self.'+frameNm+'.document').open();
	eval('self.'+frameNm+'.document').write("<body link=maroon vlink=maroon bgcolor=#cccccc>");
	eval('self.'+frameNm+'.document').close();
}

//***************************************************************************************
// sort myArray centered on property. length is length of myArray. direction is either
// ">" or ascending, or "<" for descending. SortByNumber will convert the strings to numbers
// so values like 1, 10, 11, 2 will sort properly. 
// Example of use
//		soryObjArray(TimeCard, "Order", TimeCard.Form.length, ">", true)
//***************************************************************************************
function sortObjArray(myarray,property,length,direction,SortByNumber)
{
	var i=0, j=0, hold;
	var direction = (typeof(direction)!="undefined")?direction:'>';
	
	for(i=0;i<length;i++)
		for(j=length-1;j>i;j--)
		{
			if(typeof(eval(myarray[j-1])) == "undefined") //added for arrays of non zero starting points
				break;										//[8/18/00]
			
			obj1 = escape(EvalProperty(eval("myarray[j-1]." + property)))
			obj2 = escape(EvalProperty(eval("myarray[j]." + property)))
			if(typeof(SortByNumber)!="undefined" && SortByNumber)
			{
				if(!isNaN(parseFloat(unescape(obj1)))&&!isNaN(parseFloat(unescape(obj2))))
				{
					obj1 = parseFloat(unescape(obj1))
					obj2 = parseFloat(unescape(obj2))
				}
			}
			if((direction=='>' && obj1 > obj2) || (direction=='<' && obj1 < obj2))
			{
				hold = myarray[j-1]
				myarray[j-1]=myarray[j]
				myarray[j]=hold
			}
		}
}

function EvalProperty(str)
{
	str = "" + str
	var nstr = str
	if (str.length == 10)
	{
		if (str.charAt(2) == "/" && str.charAt(5) == "/")
			nstr = str.substring(6,10) + str.substring(0,2) + str.substring(3,5)
	}
	return nstr
}

function IsCurrent(beg,end)
{
	if (beg.length == 0)
		ymdstart = "00000000"
	else
		ymdstart = beg.substring(6,10) + beg.substring(0,2) + beg.substring(3,5)

	if (end.length == 0)
		ymdstop = "00000000"
	else
		ymdstop = end.substring(6,10) + end.substring(0,2) + end.substring(3,5)

	if (ymdstart > ymdtoday)
		return false
	if (ymdstop != "00000000" && ymdstop < ymdtoday)
		return false

	return true
}

function GetCheckedValue(fldname,obj)
{
	var returnvalue = ""
	for (var i = 0;i < obj.length;i++)
	{
		if (obj[i].checked == true)
		{
			returnvalue = obj[i].value
			break
		}
	}
	if (returnvalue != "")
		returnvalue = fldname + returnvalue
	return returnvalue
}


function FmtSupName(obj)
{
	retval = ""
	if (obj.employee_last_name != "**")
	{
		retval += "<br>"
		if (obj.employee_nick_name != "")
			retval += obj.employee_nick_name
		else
			retval += obj.employee_first_name
		retval += " " + obj.employee_last_name
	}
	return retval
}

//***************************************************************************************
// Performs what setValue performs but instead of returning a number it returns a string.
//***************************************************************************************
function EvaluateBCD(str)
{
	str = "" + str
	if (str.charAt(str.length - 1) != "-")
		return parseFloat(str)
	else
		return "-" + parseFloat(str)
}

//***************************************************************************************
// A function that performs exactly what roundtoDecimal could perform if you called it
// with NbrDec=2. 
//***************************************************************************************
function roundToPennies(n)
{
	return roundToDecimal(n, 2);
}

//***************************************************************************************
// Formats a str that represents a pseudo phone number and converts it to represent a 
// standard phone number.
// Example of Use
//		FormatPhoneNumber("16125550000")
//***************************************************************************************
function FormatPhoneNumber(str)
{
	var phnum=""

	if (ValidPhoneNbr(str))
	{
		for (var i=0;i<phonenbr.length;i++)
		{
			if (phonenbr.length ==10)
			{
				if (i == 0)  
					phnum = "("+phonenbr

				if (i == 2)
					phnum = phnum.substring(0,4) + ")" + phnum.substring(4,11)

				if (i == 5)
					phnum = phnum.substring(0,8) + "-" + phnum.substring(8,12)
			}

			if (phonenbr.length ==7)
			{
				if (i == 2)
					phnum = phonenbr.substring(0,3) + "-" + phonenbr.substring(3,8)
			}
		}
		return phnum
	}
	else   		 
		return str
}

//***************************************************************************************
// Validates a given string to see if could represent a phone number
// Example of Use
//		ValidPhoneNbr("16125550000")
//***************************************************************************************
function ValidPhoneNbr(str)
{
 
  var num = ""
  for (var i=0;i < str.length;i++)
  {
	 if ((str.charAt(i) == '9') || (str.charAt(i) == '8')|| 
	     (str.charAt(i) == '7') || (str.charAt(i) == '6')||
	     (str.charAt(i) == '5') || (str.charAt(i) == '4')||
	     (str.charAt(i) == '3') || (str.charAt(i) == '2')||
	     (str.charAt(i) == '1') || (str.charAt(i) == '0'))
	  	num += str.charAt(i)
						
	}
	
	phonenbr = num
	
	if ((num.length !=7) && (num.length !=10))
	    return false
	else 
	    return true 
	
}

//***************************************************************************************
//function to compare two dates in YYYYMMDD format and return the difference 
//in days between them. A negative return value indicates
//that the second date is before the first date
// Example of use
//		getDteDifference("19990101", "19990131")
//***************************************************************************************
function getDteDifference(dteOne,dteTwo)
{
	if(dteOne+''=='')
		dteOne=0
	if(dteTwo+''=='')
		dteTwo=0
		
	dteOne=FormatDte3(dteOne)
	dteTwo=FormatDte3(dteTwo)	

	var msecdte1=parseFloat(Date.parse(dteOne))
	var msecdte2=parseFloat(Date.parse(dteTwo))
	
	var msecdtediff=msecdte2-msecdte1

	var daysDifference=msecdtediff/86400000		//conversion from milleseconds to days
	daysDifference=Math.round(daysDifference)
	return daysDifference
}

//***************************************************************************************
// takes a valid date in most formats and returns yyyymmdd. This does not work if the arg
// is already in the form of yyyymmdd!
// Example of use
// 		formjsDate("01/01/1999")
//***************************************************************************************
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

//***************************************************************************************
// takes a date in the form YYYYMMDD and returns 'January 1, 1997'
// Example of use
//		FormatDte3("19990101")
//***************************************************************************************
function FormatDte3(dte)
{
	dte+="" 
	var year=""
	var month=""
	var day=""
	year=dte.substring(0,4)
	month=dte.substring(4,6)
	day=dte.substring(6,8)
	if(month=="01")
		month="January"
	if(month=="02")
		month="February"
	if(month=="03")
		month="March"
	if(month=="04")
		month="April"
	if(month=="05")
		month="May"
	if(month=="06")
		month="June"
	if(month=="07")
		month="July"
	if(month=="08")
		month="August"
	if(month=="09")
		month="September"
	if(month=="10")
		month="October"
	if(month=="11")
		month="November"
	if(month=="12")
		month="December"
	if(day.substring(0,1)=="0")
		day=day.substring(1,2)
	dte=month+' '+day+', '+year
	
	return dte
}

//***************************************************************************************
// takes date in the form yyyymmdd and returns 'mm/dd/yyyy'
// Example of use
//		FormatDte4("19990101")
//***************************************************************************************
function FormatDte4(dte)
{
	dte+="" 
	var year=""
	var month=""
	var day=""
	year=dte.substring(0,4)
	month=dte.substring(4,6)
	day=dte.substring(6,8)
		
	dte=month+"/"+day+"/"+year
	return dte
}

//***************************************************************************************
// takes date in format yyyymmdd and returns 'Sun Feb 19'
// Example of use
//		FormatDte5("19990101")
//***************************************************************************************
function FormatDte5(dte)
{
	var year=dte.substring(0,4)
	var month=dte.substring(4,6)
	var dy=parseFloat(dte.substring(6,8))
	var firstDay = new Date(year, month-1, dy, 8);
	var weekDay = firstDay.getDay();

	switch(month)
	{
		case "01":	month="Jan";break;
		case "02":	month="Feb";break;
		case "03":	month="Mar";break;
		case "04":	month="Apr";break;
		case "05":	month="May";break;
		case "06":	month="Jun";break;
		case "07":	month="Jul";break;
		case "08":	month="Aug";break;
		case "09":	month="Sep";break;
		case "10":	month="Oct";break;
		case "11":	month="Nov";break;
		case "12":	month="Dec";break;
	}
	switch(weekDay)
	{
		case 0: weekDay = "Sun";break;
		case 1: weekDay = "Mon";break;
		case 2: weekDay = "Tue";break;
		case 3: weekDay = "Wed";break;
		case 4: weekDay = "Thu";break;
		case 5: weekDay = "Fri";break;
		case 6: weekDay = "Sat";break;
	}
		
	return weekDay+' '+month+' '+dy
}
 
function FormatDte6(dte)
{
	var year=dte.substring(0,4)
	return FormatDte5(dte) +", " + year;
}

function FormatDte7(dte)
{
	var year=dte.substring(0,4)
	var month=dte.substring(4,6)
	var dy=dte.substring(6,8)

	switch(month)
	{
		case "01":	month="Jan";break;
		case "02":	month="Feb";break;
		case "03":	month="Mar";break;
		case "04":	month="Apr";break;
		case "05":	month="May";break;
		case "06":	month="Jun";break;
		case "07":	month="Jul";break;
		case "08":	month="Aug";break;
		case "09":	month="Sep";break;
		case "10":	month="Oct";break;
		case "11":	month="Nov";break;
		case "12":	month="Dec";break;
	}
		
	return month+' '+dy+', '+year;

}

//***************************************************************************************
// rounds decimal numbers. Qty is the number to be rounded. NbrDec contains a value to 
// what decimal point. 
// Example of use
//		roundToDecimal("+4.567898", 2)
//***************************************************************************************
function roundToDecimal(Qty, NbrDec)
{
	var strQty  = "" + Qty;

	if (NbrDec == null)
	{
		NbrDec = 0;
	}
	
	if (strQty.charAt(strQty.length - 1) == "-" || strQty.charAt(strQty.length - 1) == "+")
	{
		var trailingSign = strQty.substring(strQty.length - 1, strQty.length);
		strQty = trailingSign + strQty.substring(0, strQty.length - 1);
	}
	
	strQty = strQty.replace(/,/g, "");
	
	var nbrQty = Number(strQty);
	
	if (isNaN(nbrQty))
	{
		return strQty;
	}
	else if (nbrQty == 0)
	{
		return "";
	}
	else
	{
		return nbrQty.toFixed(NbrDec);
	}
}

//****************************************************************************************
// Decrement date based on date given. January 1st, 1999 would decrement to Dec 31st, 1998
// Example of use
//		PreviousDate("19990101")
//****************************************************************************************
var daysInAMonth = new Array(31,28,31,30,31,30,31,31,30,31,30,31);

function PreviousDate(dte)
{
	var yr	 = parseInt(String(dte).substring(0,4), 10);
	var mnth = parseInt(String(dte).substring(4,6), 10);
	var dy	 = parseInt(String(dte).substring(6,8), 10);

	if (isLeapYear(yr))
		daysInAMonth[1] = 29;
				
	if(dy>1)
		dy--;
	else
	{
		if(mnth>1)
			dy	 = daysInAMonth[(--mnth)-1];
		else
		{
			mnth = 12;
			dy	 = 31;
			yr--;
		}
	}

	if (String(mnth).length == 1)	mnth = "0" + mnth;
	if (String(dy).length == 1)		dy 	 = "0" + dy;
		
	return String(yr) + String(mnth) + String(dy);
}

//****************************************************************************************
// Increment date based on date given. Dec 31st, 1998 would increment to Jan 1st, 1999
// Example of use
//		NextDate("19990101")
//****************************************************************************************
function NextDate(dte)
{
	var yr	 = parseInt(String(dte).substring(0,4), 10);
	var mnth = parseInt(String(dte).substring(4,6), 10);
	var dy	 = parseInt(String(dte).substring(6,8), 10);
	
	if (isLeapYear(yr))
		daysInAMonth[1] = 29;
				
	if(dy<daysInAMonth[mnth-1])
		dy++
	else
	{
		if(mnth<12)
		{
			mnth++
			dy=1
		}
		else
		{
			mnth = 1
			dy	 = 1
			yr++
		}
	}
	
	if (String(mnth).length == 1)	mnth = "0" + mnth;
	if (String(dy).length == 1)		dy 	 = "0" + dy;
	
	return String(yr) + String(mnth) + String(dy);
}

//*******************************************************************************************
// Moves a sign on the tail end of a string to the front. Used to make an negative AGS value
// negative in Javascript.
// Example of use.
//		MoveTrailingSignToFront("50-");
//*******************************************************************************************

function MoveTrailingSignToFront(amt)
{
	var retAmt = amt;
	var sign = retAmt.charAt(retAmt.length-1);

	var j = 0;
	while (retAmt.charAt(j) == " ")
		j++;

	retAmt = retAmt.substring(j,retAmt.length);

	if (sign == "+" || sign == "-")
	{
		if (sign == "-")
			retAmt = "-"+retAmt.substring(0,retAmt.length-1);
		else
			retAmt = retAmt.substring(0,retAmt.length-1);
	}
	return retAmt;
}

//*******************************************************************************************
// Processes a Form error using existing logic for Alert boxes. Will highlight the form in
// question and set focus to that element. 
// Example of use.
//		ProcessFormError("self", "self.document.forms[0]", "phonenumber", "Invalid Phone Number!");
//*******************************************************************************************

function ProcessFormError(WindowNm, FormObj, Element, ErrorMsg)
{
	MsgBox(ErrorMsg, WindowNm);
	eval(FormObj+"."+Element).focus();
	eval(FormObj+"."+Element).select();
}

//*******************************************************************************************
// The following checks for what protocal is being used and will return a proper frame object
// based on that protocal.
// Example of use.
//		Desc = '<frame name=CONTROLITEM src="'+SSL()+'">;
//*******************************************************************************************

function SSL()
{
	var SLLProtocal = (window.location.protocol == 'http:')?'about:blank':'/lawson/xhrnet/dot.htm';
	return SLLProtocal;
}

function TimeRoutines(Style, Time)
{
	var Hours = parseInt(Time.substr(0,2), 10);
	var Minutes = parseInt(Time.substr(2,2), 10);
	var Seconds = parseInt(Time.substr(4,2), 10);
	var NonZuluHours = (!Hours) ? 12 : ((Hours > 12) ? (Hours - 12) : Hours);
	var AM = (Hours < 12) ? true : false;
	Seconds = (AM) ? Seconds + " AM" : Seconds + " PM";

	switch(Style)
	{
		default: 
			if(String(Minutes).length == 1)
				Minutes = "0"+String(Minutes)
			if(String(Seconds).length == 1)
				Seconds = "0"+String(Seconds)
			
			return NonZuluHours + ":" + Minutes + ":" + Seconds ;
	}
}

function DateRoutines(Style, Format, Dte)
{
	var year = parseInt(Dte.substr(0,4), 10)
	var month = parseInt(Dte.substr(4,2), 10)
	var day = parseInt(Dte.substr(6,2), 10)
	var shortyear = parseInt(Dte.substr(2,4), 10);
	
	switch(Style)
	{
		default:
		switch(Format)
		{
			case "day mon dd, year": return FormatDte6(Dte);
			case "day mon dd": return FormatDte5(Dte);
			case "mon/dd/year": return FormatDte7(Dte);
			case "month/dd/year": return FormatDte3(Dte);
			case "mm/dd/yy": return month + "/" + day +"/" + shortyear;
			default: return FormatDte4(Dte);
		}
	}
}

//*******************************************************************************************
// Use this function to determine if a year is a leap year.
//*******************************************************************************************

function isLeapYear(Year)
{
	Year = Number(Year)
	
	if ((Year % 4) != 0)
    	return false
   	else if ((Year % 400) == 0)
       	return true
   	else if ((Year % 100) == 0)
       	return false
    else
		return true
}

function ASSERT(pObj)
{
	if(typeof(pObj) == "undefined" || typeof(pObj) == "unknown" || typeof(pObj) == "null" || pObj == null)
		return false;
	else
		return true;
}

