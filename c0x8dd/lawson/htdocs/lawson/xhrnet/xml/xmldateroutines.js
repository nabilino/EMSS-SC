// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/xml/xmldateroutines.js,v 1.15.2.17 2014/02/10 23:26:34 brentd Exp $
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
//*   (c) COPYRIGHT 2014 INFOR.  ALL RIGHTS RESERVED.           *
//*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//*                                                             *
//***************************************************************
///   AGS INPUT NEEDS -->		YYYYMMDD
///   AGS OUTPUT GIVES -->		YYYYMMDD
///   DME OUTPUT GIVES -->		MM/DD/YYYY
var fmttoday, ymdtoday;	// You must call StoreDateRoutines somehow before using these variables
var daysinmonth = new Array(0,31,28,31,30,31,30,31,31,30,31,30,31);
var daysInAMonth = daysinmonth;
var localeDatePref =  "MMDDYY"; // DME dates look at the user local to determine date formats (possible formats are:MMDDYY,DDMMYY,YYMMDD)
var defaultDatePref	= "MMDDYYYY"; // used if authUser.datefmt is not defined
var defaultDateSep = "/"; // used if authUser.date_separator is not defined
var calendarType = "GREGORIAN";
var centuryTurnOver	= 69; // this number must be from 0-99  (if you don't want to consider 1900s, set centuryTurnOver = 99)
						  // >  centuryTurnOver means 1900s, <= centuryTurnOver means 2000s
						  // (note: unnecessary if you use full formatted dates.)
var initDateRoutines = false;
var theMonth = new Array()
{
	theMonth["january"] = 1;
	theMonth["february"] = 2;
	theMonth["march"] = 3;
	theMonth["april"] = 4;
	theMonth["may"] = 5;
	theMonth["june"] = 6;
	theMonth["july"] = 7;
	theMonth["august"] = 8;
	theMonth["september"] = 9;
	theMonth["october"] = 10;
	theMonth["november"] = 11;
	theMonth["december"] = 12;
	theMonth[1] = "January";
	theMonth[2] = "February";
	theMonth[3] = "March";
	theMonth[4] = "April";
	theMonth[5] = "May";
	theMonth[6] = "June";
	theMonth[7] = "July";
	theMonth[8] = "August";
	theMonth[9] = "September";
	theMonth[10] = "October";
	theMonth[11] = "November";
	theMonth[12] = "December";
};

var englishMonth = new Array()
{
	englishMonth[1] = "January";
	englishMonth[2] = "February";
	englishMonth[3] = "March";
	englishMonth[4] = "April";
	englishMonth[5] = "May";
	englishMonth[6] = "June";
	englishMonth[7] = "July";
	englishMonth[8] = "August";
	englishMonth[9] = "September";
	englishMonth[10] = "October";
	englishMonth[11] = "November";
	englishMonth[12] = "December";
};

function Initialize_DateRoutines()
{
	if (initDateRoutines) return;
	if ((typeof(window["styler"]) == "undefined" || window.styler == null) && typeof(window["findStyler"]) != "undefined")
		window.stylerWnd = findStyler(true);
	if (window.stylerWnd)
	{
		if (typeof(window.stylerWnd["StylerEMSS"]) == "function")
			window.styler = new window.stylerWnd.StylerEMSS();
		else
			window.styler = window.stylerWnd.styler;
	}	
	if (typeof(authUser) != "undefined" && typeof(authUser.datefmt) != "undefined" && authUser.datefmt !="")
		defaultDatePref = authUser.datefmt.toUpperCase();
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "")
		defaultDateSep = authUser.date_separator;
	if (typeof(authUser) != "undefined" && typeof(authUser.locale_datefmt) != "undefined" && authUser.locale_datefmt != "")
		localeDatePref = authUser.locale_datefmt;
	if (typeof(authUser) != "undefined" && typeof(authUser.century) != "undefined" && authUser.century != "")
		centuryTurnOver = Number(authUser.century);
	if (typeof(authUser) != "undefined" && typeof(authUser.calendar_type) != "undefined" && authUser.calendar_type != "")
	{	
		if ((typeof(window["styler"]) == "undefined" || window.styler == null) && typeof(window["findStyler"]) != "undefined")
			window.stylerWnd = findStyler(true);
		if (window.stylerWnd && window.styler)
		{			
			if (authUser.calendar_type.toString().toLowerCase() == window.stylerWnd.StylerEMSS.CALENDAR_TYPE_HIJRI.toLowerCase())
			{
				calendarType = window.stylerWnd.StylerEMSS.CALENDAR_TYPE_HIJRI;
				if (typeof(window["CalendarObject"]) != "undefined")
					window.stylerWnd.StylerEMSS.initCalendarControl(window);
				else
					window.styler.loadCalendarLibraries(window, calendarType);
			}
		}
	}	
	try 
	{
		if (typeof(self.getSeaPhrase) != "undefined" && self.getSeaPhrase("JAN","ESS") != "")
    		camefrom = self;
		else if (opener && typeof(opener.getSeaPhrase) != "undefined" && opener.getSeaPhrase("JAN","ESS") != "")
			camefrom = opener;
		else if (opener && opener.opener && typeof(opener.opener.getSeaPhrase) != "undefined" && opener.opener.getSeaPhrase("JAN","ESS") != "")
		    camefrom = opener.opener;
		else 
    		camefrom = self;
    }
    catch(e) 
    {
    	camefrom = self;	
    }
    if (typeof(camefrom.getSeaPhrase) != "undefined")
    {
    	theMonth[1] = camefrom.getSeaPhrase("JAN","ESS");
		theMonth[2] = camefrom.getSeaPhrase("FEB","ESS");
		theMonth[3] = camefrom.getSeaPhrase("MAR","ESS");
		theMonth[4] = camefrom.getSeaPhrase("APR","ESS");
		theMonth[5] = camefrom.getSeaPhrase("MAY","ESS");
		theMonth[6] = camefrom.getSeaPhrase("JUN","ESS");
		theMonth[7] = camefrom.getSeaPhrase("JUL","ESS");
		theMonth[8] = camefrom.getSeaPhrase("AUG","ESS");
		theMonth[9] = camefrom.getSeaPhrase("SEP","ESS");
		theMonth[10] = camefrom.getSeaPhrase("OCT","ESS");
		theMonth[11] = camefrom.getSeaPhrase("NOV","ESS");
        theMonth[12] = camefrom.getSeaPhrase("DEC","ESS");
	}
	initDateRoutines = true;
}	

//constructs date string with separator based on user pref (e.g., 01/01/1997)
function formatDateForUser(mth, dy, yr, sep)
{
	if (mth >= 1 && mth <=9)
		mth = "0" + parseInt(mth,10);
	if (dy >= 1 && dy <=9)
		dy = "0" + parseInt(dy,10);
	switch (localeDatePref)
	{
		case "MMDDYY":
		case "MMDDYYYY":
			return mth + sep + dy + sep + yr;
			break;
		case "DDMMYY":
		case "DDMMYYYY":
			return dy + sep + mth + sep + yr;
			break;
		case "YYMMDD":
		case "YYYYMMDD":
			return yr + sep + mth + sep + dy;				
			break;
		default:
			return mth + sep + dy + sep + yr;
			break;
	}
}

//constructs lowercase date format string with separator based on user pref (e.g., mm/dd/yyyy)
function getDateFormatForUser(mth, dy, yr, sep)
{
	if (typeof(mth) == "undefined" || mth == null)
		mth = 'mm';
	if (typeof(dy) == "undefined" || dy == null)
		dy = 'dd';
	if (typeof(yr) == "undefined" || yr == null)
		yr = 'yyyy';
	if (typeof(sep) == "undefined" || sep == null)	
		sep = ' ';
	var dateAry = new Array();
	switch (localeDatePref)
	{
		case "MMDDYY":
		case "MMDDYYYY":
			if (mth)
				dateAry[dateAry.length] = mth;
			if (dy)
				dateAry[dateAry.length] = dy;
			if (yr)
				dateAry[dateAry.length] = yr;
			break;
		case "DDMMYY":
		case "DDMMYYYY":
			if (dy)
				dateAry[dateAry.length] = dy;			
			if (mth)
				dateAry[dateAry.length] = mth;
			if (yr)
				dateAry[dateAry.length] = yr;
			break;
		case "YYMMDD":
		case "YYYYMMDD":
			if (yr)
				dateAry[dateAry.length] = yr;			
			if (mth)
				dateAry[dateAry.length] = mth;
			if (dy)
				dateAry[dateAry.length] = dy;				
			break;
		default:
			dateAry = new Array(mth, dy, yr);
	}
	return dateAry.join(sep);
}

//takes gregorian date in user's format (e.g., MM/DD/YYYY) and returns hijri date array
function fromGregtoHijri(str)
{	
	str = storeFormatedUserDate(str);
	var year = parseInt(str.substring(0,4),10);
	var month = parseInt(str.substring(4,6),10)-1;
	var day = parseInt(str.substring(6,8),10);
	var gregDate = new Date(year, month, day, 8);
	var cal = Globalize.culture().calendar;	
	var hijriDate = cal.convert.fromGregorian(gregDate);
	return hijriDate;
}

//takes hijri date in user's format (e.g., DD/MM/YYYY) and returns gregorian javascript date object
function fromHijritoGreg(str)
{	
	str = storeFormatedUserDate(str);
	var year = parseInt(str.substring(0,4),10);
	var month = parseInt(str.substring(4,6),10)-1;
	var day = parseInt(str.substring(6,8),10);
	var cal = Globalize.culture().calendar;
	var gregDate = cal.convert.toGregorian(year, month, day);
	return gregDate;
}

//returns gregorian date formatted with separator based on user's format
//AGS: input date is assumed in gregorian in YYYYMMDD format (no separator)
//DME: input date is assumed in user's format (with separator) for user calendar type (gregorian/hijri)
function getFormatedUserDate(str, DME_or_AGS)
{
	Initialize_DateRoutines();
	DME_or_AGS = (typeof(DME_or_AGS) == "undefined") ? "DME" : DME_or_AGS.toUpperCase();	
	var dte	= (DME_or_AGS == "DME") ? fromDMEtoStandard(str) : fromAGStoStandard(str);
	if (!dte)
		return str;
	else
		str = dte;
	switch (defaultDatePref)
	{
		case "MMDDYY":
			//str = fromStandardtoMMDDYY(str); break;
		case "MMDDYYYY":
			str = fromStandardtoMMDDYYYY(str); break;
		case "DDMMYY":
			//str = fromStandardtoDDMMYY(str); break;
		case "DDMMYYYY":
			str = fromStandardtoDDMMYYYY(str); break;
		case "YYMMDD":
			//str = fromStandardtoYYMMDD(str); break;
		case "YYYYMMDD":
			str = fromStandardtoYYYYMMDD(str); break;
	}
	return str;
}

//takes gregorian date formatted with separator based on user's format, returns gregorian date in YYYYMMDD format (no separator)
function storeFormatedUserDate(str)
{
	Initialize_DateRoutines();
	if (str.indexOf(defaultDateSep) == -1)	//must be delimited 
		return str;	
	// Dates from AGS XML output return in locale date format 
	switch (localeDatePref) //(defaultDatePref)
	{
		case "MMDDYY":
			//str = fromMMDDYYtoStandard(str); break;
		case "MMDDYYYY":
			str = fromMMDDYYYYtoStandard(str); break;
		case "DDMMYY":
			//str = fromDDMMYYtoStandard(str); break;
		case "DDMMYYYY":
			str = fromDDMMYYYYtoStandard(str); break;
		case "YYMMDD":
			//str = fromYYMMDDtoStandard(str); break;
		case "YYYYMMDD":
			str = fromYYYYMMDDtoStandard(str); break;
	}
	str	= fromStandardtoAGS(str);
	return str;
}

function getDaysInMonth(year, month)
{	
	// pass in year as a four digit year, pass in month as a integer 1-12
	if (calendarType && calendarType.toLowerCase() == "hijri")
	{		
		var cal = Globalize.culture().calendar;
		var daysInMonth = 29;
		month = parseInt(month,10) - 1;		
		var nMonth = month;	
		while (nMonth == month) 
		{
			daysInMonth++;			
			var gregDate = cal.convert.toGregorian(parseInt(year,10), month, daysInMonth);
			// if error, the year may be outside the accepted range
			try
			{
				var hijriDate = cal.convert.fromGregorian(gregDate);
				nMonth = parseInt(hijriDate[1],10);
			}
			catch(e)
			{
				daysInMonth = 0;
				nMonth = month + 1;
			}
        }		
		return daysInMonth-1;
	}	
	else
	{	
		var dt = new Date(year, month, 1);
		dt.setDate(dt.getDate() - 1);
		return (dt.getDate());
	}
}

//validate a user entered date
//input date is assumed in user's format and calendar type (with separator)
//returns false if invalid, otherwise date in user's format
function dateIsValid(str, separatorOveride)
{
	if (typeof(str) == "undefined" || str == "")
		return ["", ""];
	Initialize_DateRoutines();
	var sep = (typeof(separatorOveride) == "undefined") ? defaultDateSep : separatorOveride;
	var tmpary;
	var dte = "";
	var dateFormat = "";
	var alertstr = "";	
	if (calendarType && calendarType.toLowerCase() == "hijri")
	{		
		var usrdate = storeFormatedUserDate(str);
		var usryear = parseInt(usrdate.substring(0,4),10);
		var usrmonth = parseInt(usrdate.substring(4,6),10);
		var usrday = parseInt(usrdate.substring(6,8),10);
		var ndays = getDaysInMonth(usryear, usrmonth);
		if (ndays == -1)
			alertstr = camefrom.getSeaPhrase("CAL_1","ESS");
		else if (usrday > ndays)	
			alertstr = camefrom.getSeaPhrase("CAL_5","ESS");
		else if (usrmonth < 1 || usrmonth > 12)
			alertstr = camefrom.getSeaPhrase("CAL_4","ESS");
		else
		{	
			dateFormat = getDateFormatForUser('MM', 'dd', 'yyyy', sep);					
			if (Globalize.parseDate(str, dateFormat) != null)		
				dte = getFormatedUserDate(str, "DME");		
			else
				dte = "";
		}
		tmpary = dte.split(sep);		
	}	
	else
		tmpary = str.split(sep);
	if (alertstr) 
	{}
	else if (tmpary.length != 3)
		alertstr = camefrom.getSeaPhrase("CAL_1","ESS");
	else
	{
		var tmpmonth = tmpday = tmpyear = 0;		
		switch (defaultDatePref)
		{
			case "MMDDYYYY":
				tmpmonth = parseInt(tmpary[0], 10);
				tmpday = parseInt(tmpary[1], 10);
				tmpyear = String(tmpary[2]);
				if (tmpyear.length != 4)
                {
                	if (tmpyear.length < 3)
                    {
                    	tmpyear = Number(tmpyear);
						tmpyear = (tmpyear > centuryTurnOver) ? tmpyear+1900 : tmpyear+2000;
                        tmpyear = "" + tmpyear;
                    }
                    else
						alertstr = camefrom.getSeaPhrase("CAL_2","ESS");
    			}
				break;
			case "MMDDYY":
				tmpmonth = parseInt(tmpary[0], 10);
				tmpday = parseInt(tmpary[1], 10);
				tmpyear = String(tmpary[2]);
				if (tmpyear.length != 2)
					alertstr = camefrom.getSeaPhrase("CAL_3","ESS");
				break;
			case "DDMMYYYY":
				tmpmonth = parseInt(tmpary[1], 10);
				tmpday = parseInt(tmpary[0], 10);
				tmpyear = String(tmpary[2]);
				if (tmpyear.length != 4)
                {
                	if (tmpyear.length < 3)
                    {
                    	tmpyear = Number(tmpyear);
						tmpyear = (tmpyear > centuryTurnOver) ? tmpyear+1900 : tmpyear+2000;
                        tmpyear = "" + tmpyear;
                    }
                    else
						alertstr = camefrom.getSeaPhrase("CAL_2","ESS");
    			}
				break;
			case "DDMMYY":
				tmpmonth = parseInt(tmpary[1], 10);
				tmpday = parseInt(tmpary[0], 10);
				tmpyear = String(tmpary[2]);
				if (tmpyear.length != 2)
					alertstr = camefrom.getSeaPhrase("CAL_3","ESS");
				break;
			case "YYYYMMDD":
				tmpmonth = parseInt(tmpary[1], 10);
				tmpday = parseInt(tmpary[2], 10);
				tmpyear = String(tmpary[0]);
				if (tmpyear.length != 4)
                {
                	if (tmpyear.length < 3)
                    {
                    	tmpyear = Number(tmpyear);
						tmpyear = (tmpyear > centuryTurnOver) ? tmpyear+1900 : tmpyear+2000;
                        tmpyear = "" + tmpyear;
                    }
                    else
						alertstr = camefrom.getSeaPhrase("CAL_3","ESS");
    			}
				break;
			case "YYMMDD":
				tmpmonth = parseInt(tmpary[1], 10);
				tmpday = parseInt(tmpary[2], 10);
				tmpyear = String(tmpary[0]);
				if (tmpyear.length != 2)
					alertstr = camefrom.getSeaPhrase("CAL_3","ESS");
				break;
		}
		if (!alertstr)
		{
			var tmpyear2 = parseInt(tmpyear, 10);
			if (tmpyear2 < 100)
				tmpyear2 = (tmpyear2 > centuryTurnOver) ? tmpyear2+1900 : tmpyear2+2000;
			if (tmpmonth < 1 || tmpmonth > 12)
				alertstr = camefrom.getSeaPhrase("CAL_4","ESS");
			else if (tmpday < 1 || tmpday > 31)
				alertstr = camefrom.getSeaPhrase("CAL_5","ESS");
			else if ((tmpmonth == 4 || tmpmonth == 6 || tmpmonth == 9 || tmpmonth == 11) && tmpday > 30)
				alertstr = camefrom.getSeaPhrase("CAL_5","ESS");
			else if (tmpmonth == 2 && tmpday > 29)
				alertstr = camefrom.getSeaPhrase("CAL_5","ESS");
			else if ((tmpmonth == 2 && tmpday == 29) && !isLeapYear(tmpyear2))
				alertstr = camefrom.getSeaPhrase("CAL_5","ESS");	
			if (isNaN(Number(tmpmonth)) || isNaN(Number(tmpday)) || isNaN(Number(tmpyear))
			|| isNaN(parseInt(tmpmonth, 10)) || isNaN(parseInt(tmpday, 10)) || isNaN(parseInt(tmpyear, 10)))
			{
				alertstr = camefrom.getSeaPhrase("CAL_1","ESS");				
			}	
		}
	}
	if (alertstr)
	{
		//if (!window.styler || !window.styler.showInfor3)
		//	seaAlert(alertstr);
		return [false, alertstr];
	}	
	else
	{
		if (calendarType && calendarType.toLowerCase() == "hijri")
		{
			var gregDate = fromHijritoGreg(str);
			if (gregDate)
				return [Globalize.format(gregDate, dateFormat), ""];
		}	
		if (tmpmonth >= 1 && tmpmonth <=9)
			tmpmonth = "0" + tmpmonth;
		if (tmpday >= 1 && tmpday <= 9)
			tmpday = "0" + tmpday;
		switch (defaultDatePref)
		{
			case "MMDDYYYY":
				return [(tmpmonth + sep + tmpday + sep + tmpyear), ""];	break;
			case "MMDDYY":
				return [(tmpmonth + sep + tmpday + sep + tmpyear), ""];	break;
			case "DDMMYYYY":
				return [(tmpday + sep + tmpmonth + sep + tmpyear), ""];	break;
			case "DDMMYY":
				return [(tmpday + sep + tmpmonth + sep + tmpyear), ""];	break;
			case "YYYYMMDD":
				return [(tmpyear + sep + tmpmonth + sep + tmpday), ""];	break;
			case "YYMMDD":
				return [(tmpyear + sep + tmpmonth + sep + tmpday), ""];	break;
		}
	}
	return [false, alertstr];
}

function isLeapYear(Year)
{
	Year = Number(Year);
	if ((Year % 4) != 0)
    	return false;
   	else if ((Year % 400) == 0)
       	return true;
   	else if ((Year % 100) == 0)
       	return false;
    else
		return true;
}

//the functions below convert AGS and DME date formats to the library "standard" format: YYYY/MM/DD (gregorian)
//takes a date in user's format and calendar and returns YYYY/MM/DD gregorian (delimiter based on user pref) 
function fromDMEtoStandard(str)
{
	Initialize_DateRoutines();
	if (calendarType && calendarType.toLowerCase() == "hijri")
	{		
		var gregDate = fromHijritoGreg(str);
		if (gregDate)
		{	
			var dateFormat = 'yyyy' + defaultDateSep + 'MM' + defaultDateSep + 'dd';
			return Globalize.format(gregDate, dateFormat, "default");
		}
	}
	if (str.indexOf(defaultDateSep) == -1)	//must be delimited
		return str;
	else
	{	
		str = str.split(defaultDateSep);
		switch (localeDatePref)
		{
			case "MMDDYY":
			case "MMDDYYYY": 
				if (str[2].length == 2)
					str[2] = ((parseInt(str[2],10) > centuryTurnOver)?"19"+str[2]:"20"+str[2]);
				return (str[2] + defaultDateSep + str[0] + defaultDateSep + str[1]);
			case "DDMMYY":
			case "DDMMYYYY":
				if (str[2].length == 2)
					str[2] = ((parseInt(str[2],10) > centuryTurnOver)?"19"+str[2]:"20"+str[2]);			
				return (str[2] + defaultDateSep + str[1] + defaultDateSep + str[0]);
			case "YYMMDD":
			case "YYYYMMDD":
				if (str[0].length == 2)
					str[0] = ((parseInt(str[0],10) > centuryTurnOver)?"19"+str[0]:"20"+str[0]);
				return (str[0] + defaultDateSep + str[1] + defaultDateSep + str[2]);
		}
	}
}

//takes gregorian date in YYYYMMDD and returns YYYY/MM/DD gregorian (delimiter based on user pref)
function fromAGStoStandard(str)
{
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "")
		defaultDateSep = authUser.date_separator;
	if (str.length == 6)
	{
		var yr = str.substr(0,2);
		yr = (yr > centuryTurnOver)?"19"+yr:"20"+yr;
		str = yr + str.substr(2,6);
	}
	else if (str.length != 8)
		return str;
	return (str.substr(0,4) + defaultDateSep + str.substr(4,2) + defaultDateSep + str.substr(6,2));
}

//takes gregorian date in MMDDYYYY and returns YYYY/MM/DD gregorian (delimiter based on user pref)
function fromMMDDYYYYtoStandard(str)
{
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "")
		defaultDateSep = authUser.date_separator;
	str = str.split(defaultDateSep);
	if (parseInt(str[0],10) >= 0 && parseInt(str[0],10) <= 9)
		str[0] = "0" + parseInt(str[0],10);
	if (parseInt(str[1],10) >= 0 && parseInt(str[1],10) <= 9)
		str[1] = "0" + parseInt(str[1],10);	
	if (str[2].length == 2)
		str[2] = (parseInt(str[2],10) > centuryTurnOver)?parseInt(str[2],10)+1900:parseInt(str[2],10)+2000;	
	return (str[2] + defaultDateSep + str[0] + defaultDateSep + str[1]);
}

//takes gregorian date in MMDDYY and returns YYYY/MM/DD gregorian (delimiter based on user pref)
function fromMMDDYYtoStandard(str)
{
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "")
		defaultDateSep = authUser.date_separator;
	str = str.split(defaultDateSep);
	var cc = "";
	if (parseInt(str[0],10) >= 0 && parseInt(str[0],10) <= 9)
		str[0] = "0" + parseInt(str[0],10);
	if (parseInt(str[1],10) >= 0 && parseInt(str[1],10) <= 9)
		str[1] = "0" + parseInt(str[1],10);	
	if (str[2].length <= 2)
		cc = (parseInt(str[2],10) > centuryTurnOver)?"19":"20";
	return (cc + str[2] + defaultDateSep + str[0] + defaultDateSep + str[1]);
}

//takes gregorian date in DDMMYYYY and returns YYYY/MM/DD gregorian (delimiter based on user pref)
function fromDDMMYYYYtoStandard(str)
{
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "")
		defaultDateSep = authUser.date_separator;
	if (str)
	{
		str = str.split(defaultDateSep);
		if (parseInt(str[0],10) >= 0 && parseInt(str[0],10) <= 9)
			str[0] = "0" + parseInt(str[0],10);
		if (parseInt(str[1],10) >= 0 && parseInt(str[1],10) <= 9)
			str[1] = "0" + parseInt(str[1],10);		
		if (str[2].length == 2)
			str[2] = (parseInt(str[2],10) > centuryTurnOver)?parseInt(str[2],10)+1900:parseInt(str[2],10)+2000;
		return (str[2] + defaultDateSep + str[1] + defaultDateSep + str[0]);
	}
	else
		return "";
}

//takes gregorian date in DDMMYY and returns YYYY/MM/DD gregorian (delimiter based on user pref)
function fromDDMMYYtoStandard(str)
{
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "")
		defaultDateSep = authUser.date_separator;
	if (str)
	{
		str = str.split(defaultDateSep);
		var cc = "";
		if (parseInt(str[0],10) >= 0 && parseInt(str[0],10) <= 9)
			str[0] = "0" + parseInt(str[0],10);
		if (parseInt(str[1],10) >= 0 && parseInt(str[1],10) <= 9)
			str[1] = "0" + parseInt(str[1],10);		
		if (str[2].length <= 2)
			cc = (parseInt(str[2],10) > centuryTurnOver)?"19":"20";
		return (cc + str[2] + defaultDateSep + str[1] + defaultDateSep + str[0]);
	}
	else
		return "";
}

//takes gregorian date in YYYYMMDD and returns YYYY/MM/DD gregorian (delimiter based on user pref)
function fromYYYYMMDDtoStandard(str)
{
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "")
		defaultDateSep = authUser.date_separator;
	if (str)
	{
		str = str.split(defaultDateSep);		
		if (str[0].length == 2)
			str[0] = (parseInt(str[0],10) > centuryTurnOver)?parseInt(str[0],10)+1900:parseInt(str[0],10)+2000;
		if (parseInt(str[1],10) >= 0 && parseInt(str[1],10) <= 9)
			str[1] = "0" + parseInt(str[1],10);
		if (parseInt(str[2],10) >= 0 && parseInt(str[2],10) <= 9)
			str[2] = "0" + parseInt(str[2],10);		
		return (str[0] + defaultDateSep + str[1] + defaultDateSep + str[2]);
	}
	else
		return "";
}

//takes gregorian date in YYMMDD and returns YYYY/MM/DD gregorian (delimiter based on user pref)
function fromYYMMDDtoStandard(str)
{
	var cc = "";
	if (str.length != 8)
		cc = (parseInt(str.substr(0,2),10) > centuryTurnOver)?"19":"20";
	return (cc + str);
}

//takes gregorian date in YYYY/MM/DD (delimiter based on user pref) and returns in user's format and calendar type
function fromStandardtoDME(str)
{
	Initialize_DateRoutines();
	if (calendarType && calendarType.toLowerCase() == "hijri")
	{
		str = getFormatedUserDate(fromStandardtoAGS(str), "AGS");
		var hijriDate = fromGregtoHijri(str);
		return formatDateForUser(parseInt(hijriDate[1],10)+1, hijriDate[2], hijriDate[0], defaultDateSep);
	}	
	if (str.indexOf(defaultDateSep) == -1)
		return str;
	else
	{
		str = getFormatedUserDate(fromStandardtoAGS(str), "AGS");
		return str;
	}
}

//takes gregorian date in YYYY/MM/DD (delimiter based on user pref) and returns YYYYMMDD gregorian
function fromStandardtoAGS(str)
{
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "")
		defaultDateSep = authUser.date_separator;
	if (str.indexOf(defaultDateSep) == -1)
		return str;
	str = str.split(defaultDateSep);
	if (str[0].length == 2)
		str[0] = (parseInt(str[0],10) > centuryTurnOver)?parseInt(str[0],10)+1900:parseInt(str[0],10)+2000;	
	if (parseInt(str[1],10) >= 0 && parseInt(str[1],10) <= 9)
		str[1] = "0" + parseInt(str[1],10);
	if (parseInt(str[2],10) >= 0 && parseInt(str[2],10) <= 9)
		str[2] = "0" + parseInt(str[2],10);	
	return (str[0] + str[1] + str[2]);
}

//takes gregorian date in YYYY/MM/DD and returns MM/DD/YYYY gregorian (delimiter based on user pref)
function fromStandardtoMMDDYYYY(str)
{
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "")
		defaultDateSep = authUser.date_separator;
	str = str.split(defaultDateSep);
	return (str[1] + defaultDateSep + str[2] + defaultDateSep + str[0]);
}

//takes gregorian date in YYYY/MM/DD and returns MM/DD/YY gregorian (delimiter based on user pref)
function fromStandardtoMMDDYY(str)
{
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "")
		defaultDateSep = authUser.date_separator;
	str = str.split(defaultDateSep);
	return (str[1] + defaultDateSep + str[2] + defaultDateSep + str[0].substr(2,2));
}

//takes gregorian date in YYYY/MM/DD and returns DD/MM/YYYY gregorian (delimiter based on user pref)
function fromStandardtoDDMMYYYY(str)
{
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "")
		defaultDateSep = authUser.date_separator;
	if (str)
	{
		str = str.split(defaultDateSep);
		if (str[0].length == 2)
			str[0] = (parseInt(str[0],10) > centuryTurnOver)?parseInt(str[0],10)+1900:parseInt(str[0],10)+2000;
		return (str[2] + defaultDateSep + str[1] + defaultDateSep + str[0]);
	}
	else
		return "";
}

//takes gregorian date in YYYY/MM/DD and returns DD/MM/YY gregorian (delimiter based on user pref)
function fromStandardtoDDMMYY(str)
{
	if (typeof(authUser) != "undefined" && typeof(authUser.date_separator) != "undefined" && authUser.date_separator != "")
		defaultDateSep = authUser.date_separator;
	if (str)
	{
		str = str.split(defaultDateSep);
		return (str[2] + defaultDateSep + str[1] + defaultDateSep + str[0].substr(2,2));
	}
	else
		return "";
}

//takes gregorian date in YYYY/MM/DD and returns same format (delimiter based on user pref)
function fromStandardtoYYYYMMDD(str)
{
	return str;
}

//takes a date in YYYY/MM/DD gregorian format and returns YY/MM/DD gregorian (delimiter based on user pref)
function fromStandardtoYYMMDD(str)
{
	return str.substring(2);
}

function StoreDateRoutines() //call this after authenticate has finished
{		
	if (!authUser || !authUser.date) return;
	var dte = getFormatedUserDate(authUser.date, "AGS");
	ymdtoday = storeFormatedUserDate(dte);	
	if (calendarType && calendarType.toLowerCase() == "hijri")
	{		
		var hijriDate = fromGregtoHijri(dte);
		fmttoday = formatDateForUser(parseInt(hijriDate[1],10)+1, hijriDate[2], hijriDate[0], defaultDateSep);		
	}
	else
		fmttoday = dte;
}

// takes gregorian date in YYYYMMDD format and returns 'long-month day, year' in user's format and calendar type
// example: 19970101 -> 'January 1, 1997' (gregorian)
function FormatDte3(dte)
{
	Initialize_DateRoutines();
	StoreDateRoutines();
	if (isNaN(parseInt(dte.split(defaultDateSep).join(""),10)))
		return "";
	if (String(dte).indexOf(defaultDateSep) == -1 && String(dte).length == 6)
		dte = fromStandardtoAGS(fromAGStoStandard(dte));
	if (calendarType && calendarType.toLowerCase() == "hijri")
	{	
		dte = getFormatedUserDate(dte, "AGS");
		var hijriDate = fromGregtoHijri(dte);
		var dateFormat = 'MM, dd yyyy';
		switch (defaultDatePref)
		{
			case "MMDDYYYY":
			case "MMDDYY":
				dateFormat = 'MMMM dd, yyyy'; break;
			case "DDMMYYYY":
			case "DDMMYY":
				dateFormat = 'dd MMMM, yyyy'; break;
			case "YYYYMMDD":
			case "YYMMDD":
				dateFormat = 'yyyy, MMMM dd'; break;
			default:
				dateFormat = 'MMMM, dd yyyy'; break;
		}
		return Globalize.format(new Date(hijriDate[0], hijriDate[1], hijriDate[2]), dateFormat);
	}
	var year = String(dte).substring(0,4);
	var month = String(dte).substring(4,6);
	var day = String(dte).substring(6,8);
	switch (defaultDatePref)
	{
		case "MMDDYYYY":
			return theMonth[parseFloat(month)] + ' ' + String(Number(day)) + ', ' + String(year); break;
		case "MMDDYY":
			return theMonth[parseFloat(month)] + ' ' + String(Number(day)) + ', ' + String(year).substring(2,4); break;
		case "DDMMYYYY":
			return String(Number(day)) + ' ' + theMonth[parseFloat(month)] + ', ' + String(year); break;
		case "DDMMYY":
			return String(Number(day)) + ' ' + theMonth[parseFloat(month)] + ', ' + String(year).substring(2,4); break;
		case "YYYYMMDD":
			return String(year) + ', ' + theMonth[parseFloat(month)] + ' ' + String(Number(day)); break;
		case "YYMMDD":
			return String(year).substring(2,4) + ', ' + theMonth[parseFloat(month)] + ' ' + String(Number(day)); break;
		default:
			return theMonth[parseFloat(month)] + ' ' + String(Number(day)) + ', ' + String(year); break;
	}
}

// takes gregorian date in YYYYMMDD format and returns date in user's format and calendar type
// for example: 19970101 -> '01/01/1997' (gregorian)
function FormatDte4(dte)
{	
	Initialize_DateRoutines();
    StoreDateRoutines();
	if (isNaN(parseInt(dte.split(defaultDateSep).join(""),10)))
		return "";
	if (String(dte).indexOf(defaultDateSep) != -1)
		return dte;
	if (String(dte).indexOf(defaultDateSep) == -1 && String(dte).length == 6)
		dte = fromStandardtoAGS(fromAGStoStandard(dte));
	if (calendarType && calendarType.toLowerCase() == "hijri")
	{	
		dte = getFormatedUserDate(dte, "AGS");
		var hijriDate = fromGregtoHijri(dte);
		return formatDateForUser(parseInt(hijriDate[1],10)+1, hijriDate[2], hijriDate[0], defaultDateSep);
	}	
	var year = String(dte).substring(0,4);
	var month = String(dte).substring(4,6);
	var day = String(dte).substring(6,8);
	switch (defaultDatePref)
	{
		case "MMDDYYYY":
			return String(month) + defaultDateSep + String(day) + defaultDateSep + String(year); break;
		case "MMDDYY":
			return String(month) + defaultDateSep + String(day) + defaultDateSep + String(year).substring(2,4);	break;
		case "DDMMYYYY":
			return String(day) + defaultDateSep + String(month) + defaultDateSep + String(year); break;
		case "DDMMYY":
			return String(day) + defaultDateSep + String(month) + defaultDateSep + String(year).substring(2,4);	break;
		case "YYYYMMDD":
			return String(year) + defaultDateSep + String(month) + defaultDateSep + String(day); break;
		case "YYMMDD":
			return String(year).substring(2,4) + defaultDateSep + String(month) + defaultDateSep + String(day);	break;
		default:
			return String(month) + defaultDateSep + String(day) + defaultDateSep + String(year); break;
	}
}

// takes gregorian date in YYYYMMDD format and returns 'short-day short-month day' in user's format and calendar type
// example: 19970101 -> Wed Jan 1' (gregorian)
function FormatDte5(dte)
{
	Initialize_DateRoutines();
	StoreDateRoutines();
	if (isNaN(parseInt(dte.split(defaultDateSep).join(""),10)))
		return "";
	if (String(dte).indexOf(defaultDateSep) == -1 && String(dte).length == 6)
		dte = fromStandardtoAGS(fromAGStoStandard(dte));
	if (calendarType && calendarType.toLowerCase() == "hijri")
	{	
		dte = getFormatedUserDate(dte, "AGS");
		var hijriDate = fromGregtoHijri(dte);
		var dateFormat = 'dddd MMMM dd';
		switch (defaultDatePref)
		{
			case "MMDDYYYY":
			case "MMDDYY":
				dateFormat = 'dddd MMMM dd'; break;
			case "DDMMYYYY":
			case "DDMMYY":
				dateFormat = 'dddd dd MMMM'; break;
			case "YYYYMMDD":
			case "YYMMDD":
				dateFormat = 'dddd MMMM dd'; break;
			default:
				dateFormat = 'dddd MMMM dd'; break;
		}
		return Globalize.format(new Date(hijriDate[0], hijriDate[1], hijriDate[2]), dateFormat);
	}	
	var year = String(dte).substring(0,4)
	var month = String(dte).substring(4,6)
	var dy = parseFloat(String(dte).substring(6,8))
	var firstDay = new Date(year, month-1, dy, 8);
	var weekDay = firstDay.getDay();
	switch (month)
	{
		case "01":	month = camefrom.getSeaPhrase("JAN_2","ESS"); break;
		case "02":	month = camefrom.getSeaPhrase("FEB_2","ESS"); break;
		case "03":	month = camefrom.getSeaPhrase("MAR_2","ESS"); break;
		case "04":	month = camefrom.getSeaPhrase("APR_2","ESS"); break;
		case "05":	month = camefrom.getSeaPhrase("MAY_2","ESS"); break;
		case "06":	month = camefrom.getSeaPhrase("JUN_2","ESS"); break;
		case "07":	month = camefrom.getSeaPhrase("JUL_2","ESS"); break;
		case "08":	month = camefrom.getSeaPhrase("AUG_2","ESS"); break;
		case "09":	month = camefrom.getSeaPhrase("SEP_2","ESS"); break;
		case "10":	month = camefrom.getSeaPhrase("OCT_2","ESS"); break;
		case "11":	month = camefrom.getSeaPhrase("NOV_2","ESS"); break;
		case "12":	month = camefrom.getSeaPhrase("DEC_2","ESS"); break;
	}
	switch (weekDay)
	{
		case 0: weekDay = camefrom.getSeaPhrase("SUN","ESS"); break;
		case 1: weekDay = camefrom.getSeaPhrase("MON","ESS"); break;
		case 2: weekDay = camefrom.getSeaPhrase("TUE","ESS"); break;
		case 3: weekDay = camefrom.getSeaPhrase("WED","ESS"); break;
		case 4: weekDay = camefrom.getSeaPhrase("THU","ESS"); break;
		case 5: weekDay = camefrom.getSeaPhrase("FRI","ESS"); break;
		case 6: weekDay = camefrom.getSeaPhrase("SAT","ESS"); break;
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

// takes gregorian date in YYYYMMDD format and returns 'short-day short-month day, year' in user's format and calendar type
// example: 19970101 -> Wed Jan 1, 1997' (gregorian)
function FormatDte6(dte)
{
	Initialize_DateRoutines();
	StoreDateRoutines();
	if (isNaN(parseInt(dte.split(defaultDateSep).join(""),10)))
		return "";
	if (String(dte).indexOf(defaultDateSep) == -1 && String(dte).length == 6)
		dte = fromStandardtoAGS(fromAGStoStandard(dte));
	if (calendarType && calendarType.toLowerCase() == "hijri")
	{	
		dte = getFormatedUserDate(dte, "AGS");
		var hijriDate = fromGregtoHijri(dte);		
		var dateFormat = 'dddd MMMM dd, yyyy';
		switch (defaultDatePref)
		{
			case "MMDDYYYY":
			case "MMDDYY":
				dateFormat = 'dddd MMMM dd, yyyy'; break;
			case "DDMMYYYY":
			case "DDMMYY":
				dateFormat = 'dddd dd MMMM, yyyy'; break;
			case "YYYYMMDD":
			case "YYMMDD":
				dateFormat = 'dddd MMMM dd, yyyy'; break;
			default:
				dateFormat = 'dddd MMMM dd, yyyy'; break;
		}
		return Globalize.format(new Date(hijriDate[0], hijriDate[1], hijriDate[2]), dateFormat);
	}	
	var year = String(dte).substring(0,4);
	switch (defaultDatePref)
	{
		case "MMDDYYYY":
			return FormatDte5(dte) + ', ' + String(year); break;
		case "MMDDYY":
			return FormatDte5(dte) + ', ' + String(year).substring(2,4); break;
		case "DDMMYYYY":
			return FormatDte5(dte) + ', ' + String(year); break;
		case "DDMMYY":
			return FormatDte5(dte) + ', ' + String(year).substring(2,4); break;
		case "YYYYMMDD":
			return String(year) + ', ' + FormatDte5(dte); break;
		case "YYMMDD":
			return String(year).substring(2,4) + ', ' + FormatDte5(dte); break;
		default:
			return FormatDte5(dte) + ', ' + String(year); break;
	}
}

// takes gregorian date in YYYYMMDD format and returns 'short-month day, year' in user's format and calendar type
// example: 19970101 -> Jan 1, 1997' (gregorian)
function FormatDte7(dte)
{
	Initialize_DateRoutines();
	StoreDateRoutines();
	if (isNaN(parseInt(dte.split(defaultDateSep).join(""),10)))
		return "";
	if (String(dte).indexOf(defaultDateSep) == -1 && String(dte).length == 6)
		dte = fromStandardtoAGS(fromAGStoStandard(dte));
	if (calendarType && calendarType.toLowerCase() == "hijri")
	{	
		dte = getFormatedUserDate(dte, "AGS");
		var hijriDate = fromGregtoHijri(dte);
		var dateFormat = 'MMMM dd, yyyy';
		switch (defaultDatePref)
		{
			case "MMDDYYYY":
			case "MMDDYY":
				dateFormat = 'MMMM dd, yyyy'; break;
			case "DDMMYYYY":
			case "DDMMYY":
				dateFormat = 'dd MMMM, yyyy'; break;
			case "YYYYMMDD":
			case "YYMMDD":
				dateFormat = 'yyyy, MMMM dd'; break;
			default:
				dateFormat = 'MMMM dd, yyyy'; break;
		}
		return Globalize.format(new Date(hijriDate[0], hijriDate[1], hijriDate[2]), dateFormat);
	}	
	var year = String(dte).substring(0,4);
	var month = String(dte).substring(4,6);
	var dy = String(dte).substring(6,8);
	switch (month)
	{
		case "01":	month = camefrom.getSeaPhrase("JAN_2","ESS"); break;
		case "02":	month = camefrom.getSeaPhrase("FEB_2","ESS"); break;
		case "03":	month = camefrom.getSeaPhrase("MAR_2","ESS"); break;
		case "04":	month = camefrom.getSeaPhrase("APR_2","ESS"); break;
		case "05":	month = camefrom.getSeaPhrase("MAY_2","ESS"); break;
		case "06":	month = camefrom.getSeaPhrase("JUN_2","ESS"); break;
		case "07":	month = camefrom.getSeaPhrase("JUL_2","ESS"); break;
		case "08":	month = camefrom.getSeaPhrase("AUG_2","ESS"); break;
		case "09":	month = camefrom.getSeaPhrase("SEP_2","ESS"); break;
		case "10":	month = camefrom.getSeaPhrase("OCT_2","ESS"); break;
		case "11":	month = camefrom.getSeaPhrase("NOV_2","ESS"); break;
		case "12":	month = camefrom.getSeaPhrase("DEC_2","ESS"); break;
	}
	switch (defaultDatePref)
	{
		case "MMDDYYYY":
			return month + ' ' + String(dy) + ', ' + String(year); break;
		case "MMDDYY":
			return month + ' ' + String(dy) + ', ' + String(year).substring(2,4); break;
		case "DDMMYYYY":
			return String(dy) + ' ' + month + ', ' + String(year); break;
		case "DDMMYY":
			return String(dy) + ' ' + month + ', ' + String(year).substring(2,4); break;
		case "YYYYMMDD":
			return String(year) + ', ' + month + ', ' + String(dy); break;
		case "YYMMDD":
			return String(year).substring(2,4) + ', ' + month + ', ' + String(dy); break;
		default:
			return month + ' ' + String(dy) + ', ' + String(year); break;
	}
}

//takes gregorian year and returns year in user's calendar type
function FormatDte8(year)
{
	Initialize_DateRoutines();
	StoreDateRoutines();
	year = "" + year;
	if (isNaN(parseInt(year,10)))
		return year;
	if (year.length == 2)
		year = (parseInt(year,10) > centuryTurnOver) ? "19" + year : "20" + year;
	if (calendarType && calendarType.toLowerCase() == "hijri")
	{
		var dte = getFormatedUserDate(year + "0101", "AGS");
		var hijriDate = fromGregtoHijri(dte);
		return hijriDate[0];
	}
	else
		return year;
}

// takes gregorian date in YYYYMMDD and returns the previous day in gregorian (19970101 -> 19961231) 
function PreviousDate(dte)
{
	StoreDateRoutines();
	if (String(dte).indexOf(defaultDateSep) == -1 && String(dte).length == 6)
		dte = fromStandardtoAGS(fromAGStoStandard(dte));
	var yr = parseInt(String(dte).substring(0,4), 10);
	var mnth = parseInt(String(dte).substring(4,6), 10);
	var dy = parseInt(String(dte).substring(6,8), 10);
	if ((!(yr % 4) && (yr % 100)) || !(yr % 400))
		daysInAMonth[2] = 29;
	if (dy>1)
		dy--;
	else
	{
		if (mnth>1)
			dy = daysInAMonth[(--mnth)];
		else
		{
			mnth = 12;
			dy = 31;
			yr--;
		}
	}
	if (String(mnth).length == 1)	
		mnth = "0" + mnth;
	if (String(dy).length == 1)		
		dy = "0" + dy;
	return String(yr) + String(mnth) + String(dy);
}

// takes gregorian date in YYYYMMDD and returns the next day in gregorian (19970101 -> 19970102) 
function NextDate(dte)
{
	StoreDateRoutines();
	if (String(dte).indexOf(defaultDateSep) == -1 && String(dte).length == 6)
		dte = fromStandardtoAGS(fromAGStoStandard(dte));
	var yr = parseInt(String(dte).substring(0,4), 10);
	var mnth = parseInt(String(dte).substring(4,6), 10);
	var dy = parseInt(String(dte).substring(6,8), 10);
	if ((!(yr % 4) && (yr % 100)) || !(yr % 400))
		daysInAMonth[2] = 29;
	if (dy<daysInAMonth[mnth])
		dy++;
	else
	{
		if (mnth<12)
		{
			mnth++;
			dy = 1;
		}
		else
		{
			mnth = 1;
			dy = 1;
			yr++;
		}
	}
	if (String(mnth).length == 1)	
		mnth = "0" + mnth;
	if (String(dy).length == 1)		
		dy = "0" + dy;
	return String(yr) + String(mnth) + String(dy);
}

function DateSelect(fldname, n)
{
	date_fld_name = fldname;
	if (n)
		pct_n = n;
	OpenDateSelect();
}

function OpenDateSelect(fldname)
{
	calWin = window.open("/lawson/xhrnet/xml/xmlcalendar.htm","cal","left="+parseInt((screen.width/2)-150,10)+",top="+parseInt((screen.height/2)-250,10)+",width=255,height=210");
	try { calWin.focus(); } catch(e) {}	
}
