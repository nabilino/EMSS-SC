//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
//What String:@(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/dateroutines.js,v 1.4.8.1.6.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $ 
///   AGS INPUT NEEDS -->		YYYYMMDD
///   AGS OUTPUT GIVES -->		YYYYMMDD
///   DME OUTPUT GIVES -->		MM/DD/YYYY

var fmttoday, ymdtoday	// You must call StoreDateRoutines somehow before using these variables

var daysinmonth 	= new Array(0,31,28,31,30,31,30,31,31,30,31,30,31)
var daysInAMonth 	= daysinmonth;
var localeDatePref 	=  "MMDDYY"     //DME dates look at the user local to determine date formats (possible formats are:MMDDYY,DDMMYY,YYMMDD)
var defaultDatePref	 = "MMDDYYYY"	//  used if authUser.datefmt is not defined
var defaultDateSep 	 = "/"		//  used if authUser.date_separator is not defined
var centuryTurnOver	 = 69		//  this number must be from 0-99  (if you don't want to consider 1900's, set centuryTurnOver = 99)
					//	 >  centuryTurnOver means it's 1900's
					//	 <= centuryTurnOver means it's 2000's
					//  (note: unnecessary if you use full formatted dates. )
var theMonth = new Array()
	theMonth["january"]		= 1
	theMonth["february"]	= 2
	theMonth["march"]		= 3
	theMonth["april"]		= 4
	theMonth["may"]			= 5
	theMonth["june"]		= 6
	theMonth["july"]		= 7
	theMonth["august"]		= 8
	theMonth["september"]	= 9
	theMonth["october"]		= 10
	theMonth["november"]	= 11
	theMonth["december"]	= 12
	theMonth[1]		= "January"
	theMonth[2]		= "February"
	theMonth[3]		= "March"
	theMonth[4]		= "April"
	theMonth[5]		= "May"
	theMonth[6]		= "June"
	theMonth[7]		= "July"
	theMonth[8]		= "August"
	theMonth[9]		= "September"
	theMonth[10]	= "October"
	theMonth[11]	= "November"
	theMonth[12]	= "December"

function Initialize_DateRoutines()
{
	if (typeof(authUser) != "undefined" && typeof(authUser.datefmt) != "undefined" && authUser.datefmt !="") //DPB PT 80168
		defaultDatePref = authUser.datefmt.toUpperCase()
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "") //DPB PT 80168
		defaultDateSep = authUser.date_separator
	if (typeof(authUser) != "undefined" && typeof(authUser.locale_datefmt) != "undefined" && authUser.locale_datefmt != "")
			localeDatePref = authUser.locale_datefmt 

}

function getFormatedUserDate(str, DME_or_AGS)
{
	Initialize_DateRoutines();
		
	DME_or_AGS	= (typeof(DME_or_AGS) == "undefined") ? "DME" : DME_or_AGS.toUpperCase();
	str			= (DME_or_AGS == "DME") ? fromDMEtoStandard(str) : fromAGStoStandard(str);
	
	switch (defaultDatePref)
	{
		case "MMDDYYYY":
			str = fromStandardtoMMDDYYYY(str);	break;
		case "MMDDYY":
			str = fromStandardtoMMDDYY(str);	break;
		case "DDMMYYYY":
			str = fromStandardtoDDMMYYYY(str);	break;
		case "DDMMYY":
			str = fromStandardtoDDMMYY(str);	break;
		case "YYYYMMDD":
			str = fromStandardtoYYYYMMDD(str);	break;
		case "YYMMDD":
			str = fromStandardtoYYMMDD(str);	break;
	}
	return str
}

function storeFormatedUserDate(str)
{
	Initialize_DateRoutines();
	
	switch (defaultDatePref)
	{
		case "MMDDYYYY":
			str = fromMMDDYYYYtoStandard(str);	break;
		case "MMDDYY":
			str = fromMMDDYYtoStandard(str);	break;
		case "DDMMYYYY":
			str = fromDDMMYYYYtoStandard(str);	break;
		case "DDMMYY":
			str = fromDDMMYYtoStandard(str);	break;
		case "YYYYMMDD":
			str = fromYYYYMMDDtoStandard(str);	break;
		case "YYMMDD":
			str = fromYYMMDDtoStandard(str);	break;
	}
	str	= fromStandardtoAGS(str);
	return str
}

// THIS FUNCTION IS USED IN CONJUCTION WITH DATESELECT.JS AND DATESELECT.HTM
function convertDateSelectDate(str)
{
	return getFormatedUserDate(str, "DME")
}

// THIS FUNCTION CHECKS THE USER-ENTERED DATE FOR VALIDITY
function dateIsValid(str, separatorOveride)
{
	if (typeof(str) == "undefined" || str == "")
		return "";
	Initialize_DateRoutines() //DPB IT 80168
	var sep = (typeof(separatorOveride) == "undefined")?defaultDateSep:separatorOveride;

	var tmpary = str.split(sep)
	var alertstr = ""
	if (tmpary.length != 3)
		alertstr = "Invalid date format, please re-enter a valid date, or use the available select button."
	else
	{
		switch (defaultDatePref)
		{
			case "MMDDYYYY":
				var tmpmonth	= parseInt(tmpary[0], 10)
				var tmpday		= parseInt(tmpary[1], 10)
				var tmpyear		= String(tmpary[2])
				if (tmpyear.length != 4)
					alertstr = "Please re-enter a valid 4-digit year."
				break;
			case "MMDDYY":
				var tmpmonth	= parseInt(tmpary[0], 10)
				var tmpday		= parseInt(tmpary[1], 10)
				var tmpyear		= String(tmpary[2])
				if (tmpyear.length != 2)
					alertstr = "Please re-enter a valid 2-digit year."
				break;
			case "DDMMYYYY":
				var tmpmonth	= parseInt(tmpary[1], 10)
				var tmpday		= parseInt(tmpary[0], 10)
				var tmpyear		= String(tmpary[2])
				if (tmpyear.length != 4)
					alertstr = "Please re-enter a valid 4-digit year."
				break;
			case "DDMMYY":
				var tmpmonth	= parseInt(tmpary[1], 10)
				var tmpday		= parseInt(tmpary[0], 10)
				var tmpyear		= String(tmpary[2])
				if (tmpyear.length != 2)
					alertstr = "Please re-enter a valid 2-digit year."
				break;
			case "YYYYMMDD":
				var tmpmonth	= parseInt(tmpary[1], 10)
				var tmpday		= parseInt(tmpary[2], 10)
				var tmpyear		= String(tmpary[0])
				if (tmpyear.length != 4)
					alertstr = "Please re-enter a valid 4-digit year."
				break;
			case "YYMMDD":
				var tmpmonth	= parseInt(tmpary[1], 10)
				var tmpday		= parseInt(tmpary[2], 10)
				var tmpyear		= String(tmpary[0])
				if (tmpyear.length != 2)
					alertstr = "Please re-enter a valid 2-digit year."
				break;
		}

		if (!alertstr)
		{
			var tmpyear2 = parseInt(tmpyear, 10)
			if (tmpyear2 < 100)
				tmpyear2 = (tmpyear2 > centuryTurnOver)?tmpyear2+1900:tmpyear2+2000;
			if (tmpmonth < 1 || tmpmonth > 12)
				alertstr = "Please re-enter a valid month."
			else if (tmpday < 1 || tmpday > 31)
				alertstr = "Please re-enter a valid day."
			else if ((tmpmonth == 4 || tmpmonth == 6 || tmpmonth == 9 || tmpmonth == 11) && tmpday > 30)
				alertstr = "Please re-enter a valid day."
			else if (tmpmonth == 2 && tmpday > 29)
				alertstr = "Please re-enter a valid day."
			else if ((tmpmonth == 2 && tmpday == 29) && !isLeapYear(tmpyear2)) //DPB PT 80168
				alertstr = "Please re-enter a valid day."
		}
	}

	if (alertstr)
	{
		alert(alertstr)
		return false;
	}
	else
	{
		if (tmpmonth >= 1 && tmpmonth <=9)
			tmpmonth = "0" + tmpmonth
		if (tmpday >= 1 && tmpday <= 9)
			tmpday = "0" + tmpday
		switch (defaultDatePref)
		{
			case "MMDDYYYY":
				return tmpmonth + sep + tmpday + sep + tmpyear;	break;
			case "MMDDYY":
				return tmpmonth + sep + tmpday + sep + tmpyear;	break;
			case "DDMMYYYY":
				return tmpday + sep + tmpmonth + sep + tmpyear;	break;
			case "DDMMYY":
				return tmpday + sep + tmpmonth + sep + tmpyear;	break;
			case "YYYYMMDD":
				return tmpyear + sep + tmpmonth + sep + tmpday;	break;
			case "YYMMDD":
				return tmpyear + sep + tmpmonth + sep + tmpday;	break;
		}
	}
}

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


// THE NEXT 4 FUNCTIONS DEAL WITH CONVERTING AGS & DME OUPUTS/INPUTS TO THIS FILE'S STANDARD, AND VICE-VERSA

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// This functions takes in a value (assumes american format delimited by "/") and returns standard YYYYMMDD
// format with delimiters defined by the webuser. 


function fromDMEtoStandard(str)
{
	Initialize_DateRoutines();

	if (str.indexOf("/") == -1)	//must be dlimited by a "/" or it will error out. 
		return str;
	else
	{	
		str = str.split("/")
		switch (localeDatePref)
		{
			case "MMDDYY":
				return (str[2] + defaultDateSep + str[0] + defaultDateSep + str[1])
			case "DDMMYY":
				return (str[2] + defaultDateSep + str[1] + defaultDateSep + str[0])
			case "YYMMDD":
				return (str[0] + defaultDateSep + str[1] + defaultDateSep + str[2])
		}
	}
}

function fromStandardtoDME(str)
{
	Initialize_DateRoutines();

	if (str.indexOf(defaultDateSep) == -1)
	{
		return str;
	}
	else
	{
		str = str.split(defaultDateSep)
		return (str[1] + "/" + str[2] + "/" + str[0])
	}
}

function fromAGStoStandard(str)
{
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "") //DPB PT 80168
		defaultDateSep = authUser.date_separator
	if (str.length != 8)
		return str;
	return (str.substr(0,4) + defaultDateSep + str.substr(4,2) + defaultDateSep + str.substr(6,2))
}

function fromStandardtoAGS(str)
{
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "") //DPB PT 80168
		defaultDateSep = authUser.date_separator
	if (str.indexOf(defaultDateSep) == -1)
		return str;
	str = str.split(defaultDateSep)
	return (str[0] + str[1] + str[2])
}

// THE NEXT 4 FUNCTIONS DEAL WITH DATES OF "MMDDYYYY" & "MMDDYY"
function fromStandardtoMMDDYYYY(str)
{
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "") //DPB PT 80168
		defaultDateSep = authUser.date_separator
	str = str.split(defaultDateSep)
	return (str[1] + defaultDateSep + str[2] + defaultDateSep + str[0])
}

function fromMMDDYYYYtoStandard(str)
{
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "") //DPB PT 80168
		defaultDateSep = authUser.date_separator
	str = str.split(defaultDateSep)
	return (str[2] + defaultDateSep + str[0] + defaultDateSep + str[1])
}

function fromStandardtoMMDDYY(str)
{
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "") //DPB PT 80168
		defaultDateSep = authUser.date_separator
	str = str.split(defaultDateSep)
	return (str[1] + defaultDateSep + str[2] + defaultDateSep + str[0].substr(2,2))
}

function fromMMDDYYtoStandard(str)
{
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "") //DPB PT 80168
		defaultDateSep = authUser.date_separator
	str = str.split(defaultDateSep)
	var cc = (parseInt(str[2],10) > centuryTurnOver)?"19":"20";
	return (cc + str[2] + defaultDateSep + str[0] + defaultDateSep + str[1])
}

// THE NEXT 4 FUNCTIONS DEAL WITH DATES OF "DDMMYYYY" & "DDMMYY"
function fromStandardtoDDMMYYYY(str)
{
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "") //DPB PT 80168
		defaultDateSep = authUser.date_separator
	str = str.split(defaultDateSep)
	return (str[2] + defaultDateSep + str[1] + defaultDateSep + str[0])
}

function fromDDMMYYYYtoStandard(str)
{
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "") //DPB PT 80168
		defaultDateSep = authUser.date_separator
	str = str.split(defaultDateSep)
	return (str[2] + defaultDateSep + str[1] + defaultDateSep + str[0])
}

function fromStandardtoDDMMYY(str)
{
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "") //DPB PT 80168
		defaultDateSep = authUser.date_separator
	str = str.split(defaultDateSep)
	return (str[2] + defaultDateSep + str[1] + defaultDateSep + str[0].substr(2,2))
}

function fromDDMMYYtoStandard(str)
{
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "") //DPB PT 80168
		defaultDateSep = authUser.date_separator
	str = str.split(defaultDateSep)
	var cc = (parseInt(str[2],10) > centuryTurnOver)?"19":"20";
	return (cc + str[2] + defaultDateSep + str[1] + defaultDateSep + str[0])
}

// THE NEXT 4 FUNCTIONS DEAL WITH DATES OF "YYYYMMDD" & "YYMMDD"
function fromStandardtoYYYYMMDD(str)
{
	return str
}

function fromYYYYMMDDtoStandard(str)
{
	return str
}

function fromStandardtoYYMMDD(str)
{
	return str.substring(2)
}

function fromYYMMDDtoStandard(str)
{
	var cc = (parseInt(str.substr(0,2),10) > centuryTurnOver)?"19":"20";
	return (cc + str)
}

function StoreDateRoutines() // Call this after authenticate has finished.
{
	ymdtoday = storeFormatedUserDate(getFormatedUserDate(authUser.date, "AGS"));
	fmttoday = getFormatedUserDate(authUser.date, "AGS");
}

// takes a date in the form YYYYMMDD and returns 'January 1, 1997' (American) Formats will be different based
// on country
function FormatDte3(dte)
{
	Initialize_DateRoutines() //DPB IT 80168
	StoreDateRoutines()
	var year=String(dte).substring(0,4);
	var month=String(dte).substring(4,6);
	var day=String(dte).substring(6,8);
	
	switch (defaultDatePref)
	{
		case "MMDDYYYY":
			return theMonth[parseFloat(month)] + ' ' + String(Number(day)) + ', ' + String(year);
		case "MMDDYY":
			return theMonth[parseFloat(month)] + ' ' + String(Number(day)) + ', ' + String(year).substring(2,4);
		case "DDMMYYYY":
			return String(Number(day)) + ' ' + theMonth[parseFloat(month)] + ', ' + String(year);
		case "DDMMYY":
			return String(Number(day)) + ' ' + theMonth[parseFloat(month)] + ', ' + String(year).substring(2,4);
		case "YYYYMMDD":
			return String(year) + ', ' + theMonth[parseFloat(month)] + ' ' + String(Number(day));
		case "YYMMDD":
			return String(year).substring(2,4) + ', ' + theMonth[parseFloat(month)] + ' ' + String(Number(day));
		default:
			return theMonth[parseFloat(month)] + ' ' + String(Number(day)) + ', ' + String(year);
	}
}

// takes date in the form YYYYMMDD and returns 'MM/DD/YYYY' (American) Formats will be different based
// on country
function FormatDte4(dte)
{
	Initialize_DateRoutines() //DPB IT 80168
    	StoreDateRoutines()
	var year=String(dte).substring(0,4)
	var month=String(dte).substring(4,6)
	var day=String(dte).substring(6,8)

	switch (defaultDatePref)
	{
		case "MMDDYYYY":
			return String(month) + defaultDateSep + String(day) + defaultDateSep + String(year);	break;
		case "MMDDYY":
			return String(month) + defaultDateSep + String(day) + defaultDateSep + String(year).substring(2,4);	break;
		case "DDMMYYYY":
			return String(day) + defaultDateSep + String(month) + defaultDateSep + String(year);	break;
		case "DDMMYY":
			return String(day) + defaultDateSep + String(month) + defaultDateSep + String(year).substring(2,4);	break;
		case "YYYYMMDD":
			return String(year) + defaultDateSep + String(month) + defaultDateSep + String(day);	break;
		case "YYMMDD":
			return String(year).substring(2,4) + defaultDateSep + String(month) + defaultDateSep + String(day);	break;
		default:
			return String(month) + defaultDateSep + String(day) + defaultDateSep + String(year);	break;
	}
}

// takes date in format YYYYMMDD and returns 'Sun Feb 19' (American) Formats will be different based
// on country
function FormatDte5(dte)
{
	Initialize_DateRoutines() //DPB IT 80168
	StoreDateRoutines()
	var year=String(dte).substring(0,4)
	var month=String(dte).substring(4,6)
	var dy=parseFloat(String(dte).substring(6,8))
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
	
	switch (defaultDatePref)
	{
		case "MMDDYYYY":
			return weekDay + ' ' + month + ' ' + String(dy);
		case "MMDDYY":
			return weekDay + ' ' + month + ' ' + String(dy);
		case "DDMMYYYY":
			return weekDay + ' ' + String(dy) + ' ' + month;
		case "DDMMYY":
			return weekDay + ' ' + String(dy) + ' ' + month;
		case "YYYYMMDD":
			return weekDay + ' ' + month + ' ' + String(dy);
		case "YYMMDD":
			return weekDay + ' ' + month + ' ' + String(dy);
		default:
			return weekDay + ' ' + month + ' ' + String(dy);
	}
}
 
function FormatDte6(dte)
{
	Initialize_DateRoutines() //DPB IT 80168
	StoreDateRoutines()
	var year=String(dte).substring(0,4)

	switch (defaultDatePref)
	{
		case "MMDDYYYY":
			return FormatDte5(dte) + ', ' + String(year);
		case "MMDDYY":
			return FormatDte5(dte) + ', ' + String(year).substring(2,4);
		case "DDMMYYYY":
			return FormatDte5(dte) + ', ' + String(year);
		case "DDMMYY":
			return FormatDte5(dte) + ', ' + String(year).substring(2,4);
		case "YYYYMMDD":
			return String(year) + ', ' + FormatDte5(dte);
		case "YYMMDD":
			return String(year).substring(2,4) + ', ' + FormatDte5(dte);
		default:
			return FormatDte5(dte) + ', ' + String(year);
	}
}

function FormatDte7(dte)
{
	Initialize_DateRoutines() //DPB IT 80168
	StoreDateRoutines()
	var year=String(dte).substring(0,4)
	var month=String(dte).substring(4,6)
	var dy=String(dte).substring(6,8)
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
	
	switch (defaultDatePref)
	{
		case "MMDDYYYY":
			return month + ' ' + String(dy) + ', ' + String(year);
		case "MMDDYY":
			return month + ' ' + String(dy) + ', ' + String(year).substring(2,4);
		case "DDMMYYYY":
			return String(dy) + ' ' + month + ', ' + String(year);
		case "DDMMYY":
			return String(dy) + ' ' + month + ', ' + String(year).substring(2,4);
		case "YYYYMMDD":
			return String(year) + ', ' + month + ', ' + String(dy);
		case "YYMMDD":
			return String(year).substring(2,4) + ', ' + month + ', ' + String(dy);
		default:
			return month + ' ' + String(dy) + ', ' + String(year);
	}
}

// takes YYYYMMDD and gives you the previous day ('19990101' would give '19981231') 
function PreviousDate(dte)
{
	StoreDateRoutines()
	var yr	 = parseInt(String(dte).substring(0,4), 10);
	var mnth = parseInt(String(dte).substring(4,6), 10);
	var dy	 = parseInt(String(dte).substring(6,8), 10);
	if(( !(yr % 4) && (yr % 100)) || !(yr % 400) )
		daysInAMonth[2] = 29;
	if(dy>1)
		dy--;
	else
	{
		if(mnth>1)
			dy	 = daysInAMonth[(--mnth)];
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

// takes YYYYMMDD and gives you the next day ('19981231' would give '19990101')
function NextDate(dte)
{
	StoreDateRoutines()
	var yr	 = parseInt(String(dte).substring(0,4), 10);
	var mnth = parseInt(String(dte).substring(4,6), 10);
	var dy	 = parseInt(String(dte).substring(6,8), 10);
	if(( !(yr % 4) && (yr % 100)) || !(yr % 400) )
		daysInAMonth[2] = 29;
	if(dy<daysInAMonth[mnth])
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

