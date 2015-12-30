//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/dateselect.js,v 1.2.24.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
// Description: This function opens a calendar window from which a date can
//              be selected to be returned to the calling program.
// Arguments:   No arguments are required.
//
// The window.opener program must contain a function called ReturnDate()
// The argument passed to this function will be a string containing the
// selected date in the format "mm/dd/yyyy".

function OpenDateSelect()
{
	if (typeof DateWin != "object")
		DateWin = window.open("/lawson/javascript/dateselect.htm","dateselect","height=250,width=210")
	else
	{
		if (DateWin.closed)
			DateWin = window.open("/lawson/javascript/dateselect.htm","dateselect","height=250,width=210")
		else
			DateWin.focus()
	}
	if (DateWin == null)
	{
		DateWin = ""
		alert("Unable to open new window; Please restart your web browser")
	}
}


var authUser;
var imgURL = "/lawson/images/schedule";
var today = new Date();
var thisDay = today.getDate();
var thisMonth = today.getMonth() + 1;
var thisYear = today.getFullYear();
var selDay = thisDay;
var selMonth = thisMonth;
var selYear = thisYear;

function monthArr()
{
	this[0] = 31;
	this[1] = 28;
	this[2] = 31;
	this[3] = 30;
	this[4] = 31;
	this[5] = 30;
	this[6] = 31;
	this[7] = 31;
	this[8] = 30;
	this[9] = 31;
	this[10] = 30;
	this[11] = 31;
}

function monthNameArr()
{
	this[0] = ""
	this[1] = "Jan"
	this[2] = "Feb"
	this[3] = "Mar"
	this[4] = "Apr"
	this[5] = "May"
	this[6] = "Jun"
	this[7] = "Jul"
	this[8] = "Aug"
	this[9] = "Sep"
	this[10] = "Oct"
	this[11] = "Nov"
	this[12] = "Dec"
}

function dispCal(month, day, year)
{
	if (month >= 1 && month <=12 && month != selMonth)
		selMonth = month;
	if (day >= 1 && day <= 31 && day != selDay)
		selDay = day;
	if (year >= 1970 && year != selYear)
		selYear = year;

	var MonthName = new monthNameArr();
	// do the classic leap year calculation

	var monthDays = new monthArr();
	if (((selYear % 4 == 0) && (selYear % 100 != 0)) || (selYear % 400 == 0))
		monthDays[1] = 29;
	// figure out how many days the month will have...
	var nDays = monthDays[selMonth-1];
	if (selDay > nDays)
		selDay = nDays;
	// and go back to the first day of the month...
	var firstDay = new Date(selYear, selMonth-1, 1, 8);

	// and figure out which day of the week it hits...
	var startDay = firstDay.getDay();
	var page = "<html><head><title>Calendar</title>"
	page += "<script src='/lawson/javascript/dateroutines.js'></script>"
	page += "<script src='dateselect.js'></script></head>"
	page += "<body link=#000000 bgcolor=#cccccc>";
	// Display the Previous Month button
	page += "<center><a href=\"javascript:";
	if (selMonth == 1)
		page += "parent.dispCal(12, parent.selDay, " + (selYear-1) + ")\" ";
	else
		page += "parent.dispCal(" + (selMonth-1) + ", parent.selDay, " + selYear + ")\" ";
	page += "><img border=0 src=\"" + imgURL + "/l_tri.gif\"></a>";

	// Display the Month
	page += '<font color=blue size=4><b>' + MonthName[selMonth] + '</b></font>';

	// Display the Next Month button
	page += "<a href=\"javascript:";
	if (selMonth == 12)
		page += "parent.dispCal(1, parent.selDay, " + (selYear+1) + ")\" ";
	else
		page += "parent.dispCal(" + (selMonth+1) + ", parent.selDay, " + selYear + ")\" ";
	page += "><img border=0 src=\"" + imgURL + "/blue_tri.gif\"></a>";

	page += "<img border=0 src=\"" + imgURL + "/blnk_tri.gif\">";

	// Display the Previous Year button
	page += "<a href=\"javascript:";
	page += "parent.dispCal(" + selMonth + ", parent.selDay, " + (selYear-1) + ")\">";
	page += "<img border=0 src=\"" + imgURL + "/l_tri.gif\"></a>";

	// Display the Year
	page += "<font color=blue size=4><b>" + selYear + "</b></font>";

	// Display the Next Year button
	page += "<a href=\"javascript:";
	page += "parent.dispCal(" + selMonth + ", parent.selDay, " + (selYear+1) + ")\">";
	page += "<img border=0 src=\"" + imgURL + "/blue_tri.gif\"></a>";

	var tH = "<th align=center>";
	page += 
		"<table border=1 cellspacing=2 cellpadding=2 align=center><tr>" +
		tH + "S" + tH + "M" + tH + "T" + tH + "W" + tH + "T" + tH + "F" + 
		tH + "S";

	// now write the blanks at the beginning of the calendar
	page += "<tr>";
	var column = 0;
	for (i=0; i<startDay; i++)
	{
		page += "<td>"
		column++;
	}

	for (i=1; i<=nDays; i++)
	{
		if (column >= 7)
		{
			column = 0;
			page += "<tr>";
		}

		/* Display the number for the day. */
		page += "<td align=center bgcolor="
		if ((i == selDay) && (i == thisDay) && 
			(selMonth == thisMonth) && (selYear == thisYear))
			/* If this is the selected day and today, mark it purple */
			page += "mediumpurple>";
		else if (i == selDay) 
			/* If this is the selected day, mark it red. */
			page += "magenta>";
		else
			page += "lightgrey>";
		page += "<a href='javascript:parent.ReturnDay("+selYear+","+selMonth+","+i+")' " + ">" + i + "</a>"
		
		column++;
	}
	if (column > 0)
	{
		for (var i = column; i < 7; i++)
		{
			page += "<td>"
		}
	}
	page += "</font></table></center></body></html>";
	document.open();
	document.write(page);
	document.close();
}

function ReturnDay(selYear, selMonth, dayOfMonth)
{
	authUser = opener.authUser;
	nmonth = "" + selMonth
	if (nmonth.length == 1)
		nmonth = "0" + nmonth
	nday = "" + dayOfMonth
	if (nday.length == 1)
		nday = "0" + nday

	retval = String(selYear) + String(nmonth) + String(nday);
	window.opener.ReturnDate(FormatDte4(retval))
	self.close()
}