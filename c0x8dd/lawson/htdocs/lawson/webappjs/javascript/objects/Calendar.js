/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/objects/Calendar.js,v 1.11.2.20.2.6 2014/01/10 14:29:55 brentd Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@10.00.05.00.12 Mon Mar 31 10:17:31 Central Daylight Time 2014 */
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
//
//	DEPENDENCIES:
//		SizerObject.js
//-----------------------------------------------------------------------------
//
//	PARAMETERS:
//		mainWnd					reference to the window with SizerObject code
//		dateFormat				the format the user wants the date in
//								valid options are MMDDYY (default), DDMMYY, YYMMDD
//		dateSeparator			the separator the user wants to use (default is /)
//		translationFunc			pointer to the translation function
//-----------------------------------------------------------------------------
Date.prototype.getWeek = function() 
{	
	var oneJan = new Date(this.getFullYear(), 0, 1);
	return Math.ceil((((this - oneJan) / 86400000) + oneJan.getDay()) / 7);
} 
//-----------------------------------------------------------------------------
function CalendarObject(mainWnd, dateFormat, dateSeparator, translationFunc)
{
	// only allow one instance per file load
	if (CalendarObject._singleton)
		return CalendarObject._singleton;
	else
		CalendarObject._singleton = this;

	// calendar div
	this.calendar = document.createElement("DIV");
	this.calendar.className = "calendarOuter";
	document.body.appendChild(this.calendar);

	// user prefs
	this.dateFormat = dateFormat || CalendarObject.MMDDYY;
	this.dateSeparator = dateSeparator || CalendarObject.DEFAULT_SEPARATOR;
	this.type = CalendarObject.TYPE_GREGORIAN;

	// other
	this.openDirection = CalendarObject.OPEN_DOWN;
	this.mainWnd = mainWnd || window;
	this.today = new Date();
	this.selDay = this.today.getDate();
	this.selMonth = this.today.getMonth() + 1;
	this.selYear = this.today.getFullYear();
	this.origDate = null;
	this.calTimer = null;
	this.inputFld = null;
	this.monthNameAry = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
	this.monthShortNameAry = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
	this.dayNameAry = new Array("Su","Mo","Tu","We","Th","Fr","Sa");
	this.labelsAry = new Array("Today","OK","Cancel");
	this.translateLabels(translationFunc);
	this.styler = null;
	this.selMonthMonth = null;
	this.selYearYear = null;
	this.selMonthElm = null;
	this.selYearElm = null;
	this.selYearStart = this.selYear - 5;
	this.firstDay = 0;
}
//-- static variables ---------------------------------------------------------
CalendarObject._singleton = null;
CalendarObject.GRACE_TIME = 500;
CalendarObject.MMDDYY = "MMDDYY";
CalendarObject.DDMMYY = "DDMMYY";
CalendarObject.YYMMDD = "YYMMDD";
CalendarObject.DEFAULT_SEPARATOR = "/";
CalendarObject.OPEN_UP = "Up";
CalendarObject.OPEN_LEFT_UP = "LeftUp";
CalendarObject.OPEN_RIGHT_UP = "RightUp";
CalendarObject.OPEN_DOWN = "Down";
CalendarObject.OPEN_LEFT_DOWN = "LeftDown";
CalendarObject.OPEN_RIGHT_DOWN = "RightDown";
CalendarObject.OPEN_CENTER = "Center";
CalendarObject.TYPE_GREGORIAN = "Gregorian";
CalendarObject.TYPE_HIJRI = "Hijri";
//-- static methods -----------------------------------------------------------
CalendarObject.formatDateForAgs = function(date, fmt, sep, type)
{
	fmt = fmt || CalendarObject.MMDDYY;
	sep = sep || CalendarObject.DEFAULT_SEPARATOR;
	type = type || CalendarObject.TYPE_GREGORIAN;
	
	if (type.toString().toLowerCase() == CalendarObject.TYPE_HIJRI.toLowerCase())
		date = CalendarObject.toGregorian(date, fmt, sep, type);
	
	// expected input... full user formatted date with separators
	var dateAry = date.split(sep);
	if (dateAry.length != 3)
		return date;

	var month = "";
	var day = "";
	var year = "";
	if (CalendarObject.DDMMYY == fmt)
	{
		day = dateAry[0];
		month = dateAry[1];
		year = dateAry[2];
	}
	else if (CalendarObject.YYMMDD == fmt)
	{
		year = dateAry[0];
		month = dateAry[1];
		day = dateAry[2];
	}
	else // MMDDYY
	{
		month = dateAry[0];
		day = dateAry[1];
		year = dateAry[2];
	}
	return (year + month + day);
}
//-----------------------------------------------------------------------------
CalendarObject.toGregorian = function(date, fmt, sep, type)
{
	type = type || CalendarObject.TYPE_GREGORIAN;
	
	if (type.toString().toLowerCase() == CalendarObject.TYPE_GREGORIAN.toLowerCase())
		return date;
	
	var dateObj = CalendarObject.createDateFromUserValue(date, fmt, sep, type);
	if (!dateObj)
		return date;
	
	var month = (type.toString().toLowerCase() == CalendarObject.TYPE_HIJRI.toLowerCase()) ? parseInt(dateObj[1],10) + 1 : dateObj.getMonth() + 1;
	if (month < 10)
		month = "0" + month;
	var day = (type.toString().toLowerCase() == CalendarObject.TYPE_HIJRI.toLowerCase()) ? dateObj[2] : dateObj.getDate();
	if (day < 10)
		day = "0" + day;
	var year = (type.toString().toLowerCase() == CalendarObject.TYPE_HIJRI.toLowerCase()) ? dateObj[0] : dateObj.getFullYear();
	
	var cal = Globalize.culture().calendar;
	var gregDate = cal.convert.toGregorian(parseInt(year,10), parseInt(month,10)-1, parseInt(day,10));
	month = gregDate.getMonth() + 1;
	if (month < 10)
		month = "0" + month;
	day = gregDate.getDate();
	if (day < 10)
		day = "0" + day;
	year = gregDate.getFullYear();
	return CalendarObject.formatDateForUser(month, day, year, fmt, sep);
}
//-----------------------------------------------------------------------------
CalendarObject.fromGregorian = function(date, fmt, sep, type)
{
	fmt = fmt || CalendarObject.MMDDYY;
	sep = sep || CalendarObject.DEFAULT_SEPARATOR;
	type = type || CalendarObject.TYPE_GREGORIAN;
	
	if (type.toString().toLowerCase() == CalendarObject.TYPE_GREGORIAN.toLowerCase())
		return date;	
	
	var dateAry = date.split(sep);
	if (dateAry.length != 3)
		return null;

	var day;
	var month;
	var year;
	if (CalendarObject.DDMMYY == fmt)
	{
		day = dateAry[0];
		month = dateAry[1];
		year = dateAry[2];
	}
	else if (CalendarObject.YYMMDD == fmt)
	{
		year = dateAry[0];
		month = dateAry[1];
		day = dateAry[2];
	}
	else // MMDDYY
	{
		month = dateAry[0];
		day = dateAry[1];
		year = dateAry[2];
	}
	
	// preventative check
	if (isNaN(day) || isNaN(month) || isNaN(year))
		return null;
	
	var cal = Globalize.culture().calendar;
	var gregDate = new Date(parseInt(year,10), parseInt(month,10)-1, parseInt(day,10));	
	var hijriDate = cal.convert.fromGregorian(gregDate);	
	month = parseInt(hijriDate[1],10) + 1;
	if (month < 10)
		month = "0" + month;
	day = parseInt(hijriDate[2],10);
	if (day < 10)
		day = "0" + day;
	year = hijriDate[0];
	return CalendarObject.formatDateForUser(month, day, year, fmt, sep);
}
//-----------------------------------------------------------------------------
CalendarObject.formatDateForUser = function(month, day, year, fmt, sep)
{
	fmt = fmt || CalendarObject.MMDDYY;
	sep = sep || CalendarObject.DEFAULT_SEPARATOR;

	if (CalendarObject.DDMMYY == fmt)
		return day + sep + month + sep + year;
	else if (CalendarObject.YYMMDD == fmt)
		return year + sep + month + sep + day;
	else // MMDDYY
		return month + sep + day + sep + year;
}
//-----------------------------------------------------------------------------
CalendarObject.createDateFromUserValue = function(date, fmt, sep, type)
{
	type = type || CalendarObject.TYPE_GREGORIAN;
	date = CalendarObject.isDateValid(date, fmt, sep, type);
	if (!date)
		return null;

	fmt = fmt || CalendarObject.MMDDYY;
	sep = sep || CalendarObject.DEFAULT_SEPARATOR;

	var dateAry = date.split(sep);
	if (dateAry.length != 3)
		return null;

	var day;
	var month;
	var year;
	if (CalendarObject.DDMMYY == fmt)
	{
		day = dateAry[0];
		month = dateAry[1];
		year = dateAry[2];
	}
	else if (CalendarObject.YYMMDD == fmt)
	{
		year = dateAry[0];
		month = dateAry[1];
		day = dateAry[2];
	}
	else // MMDDYY
	{
		month = dateAry[0];
		day = dateAry[1];
		year = dateAry[2];
	}

	// preventative check
	if (isNaN(day) || isNaN(month) || isNaN(year))
		return null;
	if (type.toString().toLowerCase() == CalendarObject.TYPE_HIJRI.toLowerCase())
	{		
		var cal = Globalize.culture().calendar;
		var gregDate = cal.convert.toGregorian(parseInt(year,10), parseInt(month,10)-1, parseInt(day,10));
		var hijriDate = cal.convert.fromGregorian(gregDate);		
		return hijriDate;
	}
	else
	{	
		var dateObj = new Date(parseFloat(Date.parse(month + sep + day + sep + year)));
		return (isNaN(dateObj)) ? null : dateObj;
	}
}
//-----------------------------------------------------------------------------
CalendarObject.getDaysInMonth = function(year, month, type)
{	
	// pass in year as a four digit year, pass in month as a integer 1-12	
	type = type || CalendarObject.TYPE_GREGORIAN;	

	if (type.toString().toLowerCase() == CalendarObject.TYPE_HIJRI.toLowerCase())
	{	
		var cal = Globalize.culture().calendar;
		if (isNaN(parseInt(year,10)) || isNaN(parseInt(month,10)))
		{
			year = (new Date()).getFullYear();
			month = (new Date()).getMonth() + 1;			
			var dt = new Date(year, month, 1);
			dt.setDate(dt.getDate() - 1);
			var hijriDate = cal.convert.fromGregorian(dt);	
			month = parseInt(hijriDate[1],10) + 1;
			if (month < 10)
				month = "0" + month;
			year = hijriDate[0];
		}
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
		return (daysInMonth - 1);
	}	
	else
	{	
		var dt = new Date(year, month, 1);
		dt.setDate(dt.getDate() - 1);
		return (dt.getDate());
	}
}
//-----------------------------------------------------------------------------
CalendarObject.getFirstDayOfMonth = function(year, month, type)
{
	// pass in year as a four digit year, pass in month as a integer 1-12
	type = type || CalendarObject.TYPE_GREGORIAN;
	
	if (type.toString().toLowerCase() == CalendarObject.TYPE_HIJRI.toLowerCase())
	{	
		var cal = Globalize.culture().calendar;
		var gregDate = cal.convert.toGregorian(parseInt(year,10), parseInt(month,10)-1, 1);		
		return (gregDate.getDay());
	}	
	else
	{	
		var dt = new Date(year, month-1, 1, 8);
		return (dt.getDay());
	}
}
//-----------------------------------------------------------------------------
CalendarObject.getUserDateFormat = function(fmt, sep)
{
	fmt = fmt || CalendarObject.MMDDYY;
	sep = sep || CalendarObject.DEFAULT_SEPARATOR;

	if (CalendarObject.DDMMYY == fmt)
		return "dd" + sep + "mm" + sep + "yyyy";
	else if (CalendarObject.YYMMDD == fmt)
		return "yyyy" + sep + "mm" + sep + "dd";
	else // MMDDYY
		return "mm" + sep + "dd" + sep + "yyyy";
}
//-----------------------------------------------------------------------------
CalendarObject.isDateValid = function(date, fmt, sep, type)
{
	// expected input... date with/without separators
	// returns
	// 		date invalid - null
	// 		date valid	 - corrected date (with 0's and separators)
	fmt = fmt || CalendarObject.MMDDYY;
	sep = sep || CalendarObject.DEFAULT_SEPARATOR;
	type = type || CalendarObject.TYPE_GREGORIAN;
	
	var month = "";
	var day = "";
	var year = "";
	var dateAry = date.split(sep);
	if (dateAry.length != 3 && dateAry.length != 1)
		return null;

	if (dateAry.length == 3)
	{
		// the date has separators
		if (CalendarObject.DDMMYY == fmt)
		{
			day = dateAry[0];
			month = dateAry[1];
			year = dateAry[2];
		}
		else if (CalendarObject.YYMMDD == fmt)
		{
			year = dateAry[0];
			month = dateAry[1];
			day = dateAry[2];
		}
		else // MMDDYY
		{
			month = dateAry[0];
			day = dateAry[1];
			year = dateAry[2];
		}

		if (isNaN(day) || isNaN(month) || isNaN(year) || (year.length != 2 && year.length != 4))
			return null;
	}
	else
	{
		// the date does not have separators
		if (isNaN(date))
			return null;

		switch (date.length)
		{
			case 8:
			case 6:
				if (CalendarObject.DDMMYY == fmt)
				{
					day = date.substring(0,2);
					month = date.substring(2,4);
					year = date.substring(4);
				}
				else if (CalendarObject.YYMMDD == fmt)
				{
					year = (date.length == 8) ? date.substring(0,4) : date.substring(0,2);
					month = (date.length == 8) ? date.substring(4,6) : date.substring(2,4);
					day = (date.length == 8) ? date.substring(6) : date.substring(4);
				}
				else // MMDDYY
				{
					month = date.substring(0,2);
					day = date.substring(2,4);
					year = date.substring(4);
				}
				break;
			default:
				return null;
		}
	}

	if (year.length == 2)
		year = (type.toString().toLowerCase() == CalendarObject.TYPE_HIJRI.toLowerCase()) ? "14" + year : "20" + year;

	var nDay = parseInt(day, 10);
	var nMonth = parseInt(month, 10);
	var nYear = parseInt(year, 10);

	// validate year
	if (nYear < 1000)
		return null;

	// validate month
	if (nMonth < 1 || nMonth > 12)
		return null;
	else if (nMonth < 10)
		month = "0" + nMonth;

	// validate day
	if (nDay < 1 || nDay > CalendarObject.getDaysInMonth(year, month, type))
		return null;
	else if (nDay < 10)
		day = "0" + nDay;

	return CalendarObject.formatDateForUser(month, day, year, fmt, sep);
}
//-----------------------------------------------------------------------------
CalendarObject.isLeapYear = function(year, type)
{
	type = type || CalendarObject.TYPE_GREGORIAN;
	
	if (type.toString().toLowerCase() == CalendarObject.TYPE_HIJRI.toLowerCase())	
	{
		if (isNaN(parseInt(year,10)))
		{	
			year = (new Date()).getFullYear();
			var dt = new Date(year, 1, 1);
			var cal = Globalize.culture().calendar;
			var hijriDate = cal.convert.fromGregorian(dt);
			year = hijriDate[0];			
		}	
		return ((((year * 11) + 14) % 30) < 11);
	}	
	else
	{	
		if (isNaN(parseInt(year,10)))
			year = (new Date()).getFullYear();		
		// do the classic leap year calculation
		// leap year is a multiple of 400 or a multiple of 4 but not a multiple of 100
		return ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ? true : false;
	}
}
//-----------------------------------------------------------------------------
//-- member methods -----------------------------------------------------------
CalendarObject.prototype.setType = function(type)
{
	if (this.styler != null) {
		if (!this.styler.showInfor3 && !this.styler.showInfor) {
			this.type = CalendarObject.TYPE_GREGORIAN;
			return
		}
	}		
	if (type && type.toString().toLowerCase() == CalendarObject.TYPE_HIJRI.toLowerCase())
	{
		this.type = CalendarObject.TYPE_HIJRI;
		try
		{
			this.styler.loadCalendarLibraries(window, this.type);
			if (this.styler.getTextDir() != "rtl")
				Globalize.culture("ar-SA").isRTL = false;			
			Globalize.culture("ar-SA");
			Globalize.culture().calendar = Globalize.culture().calendars.standard;
			var cal = Globalize.culture().calendar;		
			var gregDate = this.today;		
			this.today = cal.convert.fromGregorian(gregDate);
			this.selMonth = parseInt(this.today[1],10) + 1;
			this.selDay = parseInt(this.today[2],10);
			this.selYear = parseInt(this.today[0],10);
			this.selYearStart = this.selYear - 5;
			this.firstDay = 6;
		}
		catch(e)
		{
			this.type = CalendarObject.TYPE_GREGORIAN;
		}
	}	
	else
	{
		this.type = CalendarObject.TYPE_GREGORIAN;
	}	
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.getTodaysYear = function()
{
	if (this.type == CalendarObject.TYPE_HIJRI)
		return (parseInt(this.today[0],10));
	else
		return (this.today.getFullYear());
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.getTodaysMonth = function()
{
	if (this.type == CalendarObject.TYPE_HIJRI)
		return (parseInt(this.today[1],10));
	else
		return (this.today.getMonth());
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.getTodaysDay = function()
{
	if (this.type == CalendarObject.TYPE_HIJRI)
		return (parseInt(this.today[2],10));
	else
		return (this.today.getDate());
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.translateLabels = function(func)
{
	if (!func)
		return;
	
	var i = 0;

	// months
	for (i = 0; i<this.monthNameAry.length; i++)
	{
		this.monthNameAry[i] = func(this.monthNameAry[i]);
		this.monthShortNameAry[i] = func(this.monthShortNameAry[i]);
	}
	
	// days
	for (i = 0; i<this.dayNameAry.length; i++)
		this.dayNameAry[i] = func(this.dayNameAry[i]);
	
	// labels
	for (i = 0; i<this.labelsAry.length; i++)
		this.labelsAry[i] = func(this.labelsAry[i]);
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.open = function(inputFld, evt)
{
	// *** DEPRECATED AFTER RSS 8.1.0.52 and RSS 9.0.0.3 ***
	// (USE .openCalendar() method below)

	if (!inputFld || !evt)
		return;

	this.inputFld = inputFld;
	this.calendar.style.visibility = "visible";

	// height/width is auto, we cannot dynamically detect
	// average height=150 and width=200
	var cTop = evt.clientY + document.body.scrollTop - 10;
	if (this.mainWnd.SizerObject.getHeight(window) < cTop + 150)
		cTop = this.mainWnd.SizerObject.getHeight(window) + document.body.scrollTop - 150;

	var cLeft = evt.clientX + document.body.scrollLeft - 10;
	if (this.mainWnd.SizerObject.getWidth(window) < cLeft + 200)
		cLeft = this.mainWnd.SizerObject.getWidth(window) + document.body.scrollLeft - 200;

	this.calendar.style.top = cTop + "px";
	this.calendar.style.left = cLeft + "px";

	var dateObj = CalendarObject.createDateFromUserValue(this.inputFld.value, this.dateFormat, this.dateSeparator, this.type) || this.today;
	var nMonth = (this.type == CalendarObject.TYPE_HIJRI) ? parseInt(dateObj[1],10) + 1 : dateObj.getMonth() + 1;
	if (nMonth < 10)
		nMonth = "0" + nMonth;
	var nDay = (this.type == CalendarObject.TYPE_HIJRI) ? dateObj[2] : dateObj.getDate();
	if (nDay < 10)
		nDay = "0" + nDay;	
	var nYear = (this.type == CalendarObject.TYPE_HIJRI) ? dateObj[0] : dateObj.getFullYear();
	this.origDate = CalendarObject.formatDateForUser(nMonth, nDay, nYear, this.dateFormat, this.dateSeparator);
	this.display(parseInt(nMonth,10), parseInt(nDay,10), nYear);
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.openCalendar = function(calendarBtn, evt)
{
	if (!evt || !calendarBtn)
		return;

	var id = calendarBtn.getAttribute("for");
	if (!id)
		return;

	var inputFld = document.getElementById(id);
	if (!inputFld)
		return;

	this.inputFld = inputFld;
	var inputFldPos = this.mainWnd.PositionObject.getInstance(this.inputFld);	
	var dateObj = CalendarObject.createDateFromUserValue(this.inputFld.value, this.dateFormat, this.dateSeparator, this.type) || this.today;	
	var nMonth = (this.type == CalendarObject.TYPE_HIJRI) ? parseInt(dateObj[1],10) + 1 : dateObj.getMonth() + 1;
	if (nMonth < 10)
		nMonth = "0" + nMonth;
	var nDay = (this.type == CalendarObject.TYPE_HIJRI) ? dateObj[2] : dateObj.getDate();
	if (nDay < 10)
		nDay = "0" + nDay;
	var nYear = (this.type == CalendarObject.TYPE_HIJRI) ? dateObj[0] : dateObj.getFullYear();
	this.origDate = CalendarObject.formatDateForUser(nMonth, nDay, nYear, this.dateFormat, this.dateSeparator);
	this.display(parseInt(nMonth,10), parseInt(nDay,10), nYear);

	if (this.styler != null && this.styler.showInfor)
	{			
		if (this.openDirection == CalendarObject.OPEN_UP || this.openDirection == CalendarObject.OPEN_LEFT_UP || this.openDirection == CalendarObject.OPEN_RIGHT_UP)	
			this.calendar.style.top = (inputFldPos.thetop - this.calendar.offsetHeight) + "px";
		else if (this.openDirection == CalendarObject.OPEN_CENTER)
			this.calendar.style.top = (inputFldPos.thetop + Math.floor(inputFldPos.height / 2) - Math.floor(this.calendar.offsetHeight / 2)) + "px";				
		else // open down
			this.calendar.style.top = (inputFldPos.thetop + inputFldPos.height) + "px";
		
		var leftPos;
		if (this.openDirection == CalendarObject.OPEN_CENTER)
			leftPos = inputFldPos.right + 15;
		else if (this.openDirection == CalendarObject.OPEN_RIGHT_DOWN || this.openDirection == CalendarObject.OPEN_RIGHT_UP)
			leftPos = inputFldPos.right - this.calendar.offsetWidth + 15;
		else
			leftPos = inputFldPos.left - 2;
		if (this.styler && this.styler.textDir == "rtl") 
		{	
			if (this.openDirection == CalendarObject.OPEN_CENTER)
				leftPos = inputFldPos.left - this.calendar.offsetWidth - 15;
			else if (this.openDirection == CalendarObject.OPEN_RIGHT_DOWN || this.openDirection == CalendarObject.OPEN_RIGHT_UP)
				leftPos = inputFldPos.left - 15;
			else	
				leftPos = inputFldPos.right - this.calendar.offsetWidth + 2;
		}		
		this.calendar.style.left = leftPos + "px";
	}
	else if (this.styler != null && this.styler.showLDS)
	{			
		if (this.openDirection == CalendarObject.OPEN_UP || this.openDirection == CalendarObject.OPEN_LEFT_UP || this.openDirection == CalendarObject.OPEN_RIGHT_UP)	
			this.calendar.style.top = (inputFldPos.thetop - this.calendar.offsetHeight + 4) + "px";
		else if (this.openDirection == CalendarObject.OPEN_CENTER)
			this.calendar.style.top = (inputFldPos.thetop + Math.floor(inputFldPos.height / 2) - Math.floor(this.calendar.offsetHeight / 2)) + "px";				
		else // open down
			this.calendar.style.top = (inputFldPos.thetop + inputFldPos.height - 5) + "px";
		
		var leftPos;
		if (this.openDirection == CalendarObject.OPEN_CENTER)
			leftPos = inputFldPos.right + 15;
		else if (this.openDirection == CalendarObject.OPEN_LEFT_DOWN || this.openDirection == CalendarObject.OPEN_LEFT_UP)
			leftPos = inputFldPos.left - 11;		
		else
			leftPos = inputFldPos.right - this.calendar.offsetWidth + 25;
		
		if (leftPos >= 0)
			this.calendar.style.left = leftPos + "px";
		else 
			this.calendar.style.left = (inputFldPos.left - 11) + "px";
	}
	else
	{
		if (this.openDirection == CalendarObject.OPEN_UP || this.openDirection == CalendarObject.OPEN_LEFT_UP || this.openDirection == CalendarObject.OPEN_RIGHT_UP)
			this.calendar.style.top = (inputFldPos.thetop - this.calendar.offsetHeight) + "px";
		else if (this.openDirection == CalendarObject.OPEN_CENTER)
			this.calendar.style.top = (inputFldPos.thetop + Math.floor(inputFldPos.height / 2) - Math.floor(this.calendar.offsetHeight / 2)) + "px";	
		else if (this.openDirection == CalendarObject.OPEN_LEFT_DOWN || this.openDirection == CalendarObject.OPEN_RIGHT_DOWN)
			this.calendar.style.top = (inputFldPos.thetop + inputFldPos.height) + "px";
		else // open down
			this.calendar.style.top = inputFldPos.thetop + "px";			
		
		if (this.openDirection == CalendarObject.OPEN_LEFT_DOWN || this.openDirection == CalendarObject.OPEN_LEFT_UP)
			this.calendar.style.left = inputFldPos.left + "px";
		else if (this.openDirection == CalendarObject.OPEN_RIGHT_DOWN || this.openDirection == CalendarObject.OPEN_RIGHT_UP)
			this.calendar.style.left = (inputFldPos.right - this.calendar.offsetWidth) + "px";			
		else	
			this.calendar.style.left = (inputFldPos.left + inputFldPos.width) + "px";
	}
	
	this.calendar.style.visibility = "visible";
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.displayClassic = function(month, day, year)
{
	if (month >= 1 && month <= 12 && month != this.selMonth)
		this.selMonth = month;
	if (day >= 1 && day <= 31 && day != this.selDay)
		this.selDay = day;
	if (year >= 1970 && year != this.selYear)
		this.selYear = year;

	// inner calendar div
	var pMonth = (this.selMonth == 1) ? 12 : this.selMonth-1;
	var pYear = (this.selMonth == 1) ? this.selYear-1 : this.selYear;
	var nMonth = (this.selMonth == 12) ? 1 : this.selMonth+1;
	var nYear = (this.selMonth == 12) ? this.selYear+1 : this.selYear;
	var page = "<div class='calendarInner' onmouseover='CalendarObject._singleton.clearTimer()' onmouseout='CalendarObject._singleton.setTimer()'>"
			 + "<table border='0' cellpadding='0' cellspacing='0' style='padding-bottom:5px;width:175px;'><tr>"
				// previous month button
			 +  "<td style='width:14px;vertical-align:bottom;'><button class='calendarArrow' onmouseover='this.oldClass=this.className;this.className+=\"Over\"' onmouseout='this.className=this.oldClass' onclick='CalendarObject._singleton.display(" + pMonth + ", CalendarObject._singleton.selDay, " + pYear + ")'><</button></td>"
				// display the month name
			 +  "<td style='width:80px;text-align:center;vertical-align:bottom;'><span class='calendarHeading'>" + this.monthNameAry[this.selMonth-1] + "</span></td>"
				// next month button
			 +  "<td style='width:14px;vertical-align:bottom;'><button class='calendarArrow' onmouseover='this.oldClass=this.className;this.className+=\"Over\"' onmouseout='this.className=this.oldClass' onclick='CalendarObject._singleton.display(" + nMonth + ", CalendarObject._singleton.selDay, " + nYear + ")'>></button></td>"
				// spacer
			 +  "<td style='width:5px;'>&nbsp;</td>"
				// previous year button
			 +  "<td style='width:14px;vertical-align:bottom;'><button class='calendarArrow' onmouseover='this.oldClass=this.className;this.className+=\"Over\"' onmouseout='this.className=this.oldClass' onclick='CalendarObject._singleton.display(" + this.selMonth + ", CalendarObject._singleton.selDay, " + (this.selYear-1) + ")'><</button></td>"
				// display the year
			 +  "<td style='width:34px;text-align:center;vertical-align:bottom;'><span class='calendarHeading'>" + this.selYear + "</span></td>"
				// next year button
			 +  "<td style='width:14px;vertical-align:bottom;'><button class='calendarArrow' onmouseover='this.oldClass=this.className;this.className+=\"Over\"' onmouseout='this.className=this.oldClass' onclick='CalendarObject._singleton.display(" + this.selMonth + ", CalendarObject._singleton.selDay, " + (this.selYear+1) + ")'>></button></td>"
			 +  "</tr></table>"

	var tH = "<td class='calendarDayHeader'>";
	page += "<table border='0' cellspacing='0' cellpadding='0'>"
		 +  "<tr>"
		 +  tH + this.dayNameAry[0] + "</td>"
		 +  tH + this.dayNameAry[1] + "</td>"
		 +  tH + this.dayNameAry[2] + "</td>"
		 +  tH + this.dayNameAry[3] + "</td>"
		 +  tH + this.dayNameAry[4] + "</td>"
		 +  tH + this.dayNameAry[5] + "</td>"
		 +  tH + this.dayNameAry[6] + "</td>";

	// figure out how many days the month will have...
	var nDays = CalendarObject.getDaysInMonth(this.selYear, this.selMonth, this.type);
	if (this.selDay > nDays)
		this.selDay = nDays;

	// and go back to the first day of the month...
	// and figure out which day of the week it hits...
	var firstDay = new Date(this.selYear, this.selMonth-1, 1, 8);
	var startDay = firstDay.getDay();

	// now write the blanks at the beginning of the calendar
	page += "</tr><tr>";
	var column = 0;
	for (i=0; i<startDay; i++)
	{
		page += "<td class='calendarDay'>&nbsp;</td>";
		column++;
	}

	for (i=1; i<=nDays; i++)
	{
		if (column >= 7)
		{
			column = 0;
			page += "</tr><tr>";
		}

		// Display the number for the day
		//  (style different if it is today)
		var clazz = "calendarDay";
		if (i == this.getTodaysDay() &&
			this.selMonth == (this.getTodaysMonth()+1) &&
			this.selYear == this.getTodaysYear())
			clazz += "Today";
		else if (column == 6)
			clazz += "Right";
		page += "<td class='" + clazz + "'"
			 +  " onmouseover='this.oldClass=this.className;this.className+=\"Over\"'"
			 +  " onmouseout='this.className=this.oldClass'"
			 +  " onclick='CalendarObject._singleton.returnDay(" + i + ")'"
			 +  ">" + i + "</td>"
		column++;
	}

	if (column > 0)
		for (var i=column; i<7; i++)
			page += "<td class='calendarDay" + ((i==6)?"Right":"") + "'>&nbsp;</td>";
	page += "</tr></table></div>";
	this.calendar.innerHTML = page;
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.displayLDS = function(month, day, year)
{
	if (month >= 1 && month <= 12 && month != this.selMonth)
		this.selMonth = month;
	if (day >= 1 && day <= 31 && day != this.selDay)
		this.selDay = day;
	if (year >= 1970 && year != this.selYear)
		this.selYear = year;

	// inner calendar div
	var pMonth = (this.selMonth == 1) ? 12 : this.selMonth-1;
	var pYear = (this.selMonth == 1) ? this.selYear-1 : this.selYear;
	var nMonth = (this.selMonth == 12) ? 1 : this.selMonth+1;
	var nYear = (this.selMonth == 12) ? this.selYear+1 : this.selYear;
	var page = "<div class='calendarInner' onmouseover='CalendarObject._singleton.clearTimer()' onmouseout='CalendarObject._singleton.setTimer()'>"
			 + "<table class='calendarNav' border='0' cellpadding='0' cellspacing='0'><tr>"
			 + "<td>&nbsp;</td>"
				// previous month button
			 +  "<td class='calendarArrow' onmouseover='this.className=\"calendarArrowOver\";' onmouseout='this.className=\"calendarArrow\";' onclick='if(this.childNodes.length>0){this.childNodes[0].onclick();}'><button class='calendarArrowLeft' onclick='CalendarObject._singleton.display(" + pMonth + ", CalendarObject._singleton.selDay, " + pYear + ")'>&nbsp;</button></td>"
				// display the month name
			 +  "<td style='text-align:center'><span class='calendarHeading'>" + this.monthNameAry[this.selMonth-1] + "</span></td>"
				// next month button
			 +  "<td class='calendarArrow' onmouseover='this.className=\"calendarArrowOver\";' onmouseout='this.className=\"calendarArrow\";' onclick='if(this.childNodes.length>0){this.childNodes[0].onclick();}'><button class='calendarArrowRight' onclick='CalendarObject._singleton.display(" + nMonth + ", CalendarObject._singleton.selDay, " + nYear + ")'>&nbsp;</button></td>"
				// spacer
			 +  "<td style='width:5px;'>&nbsp;</td>"
				// previous year button
			 +  "<td class='calendarArrow' onmouseover='this.className=\"calendarArrowOver\";' onmouseout='this.className=\"calendarArrow\";' onclick='if(this.childNodes.length>0){this.childNodes[0].onclick();}'><button class='calendarArrowLeft' onclick='CalendarObject._singleton.display(" + this.selMonth + ", CalendarObject._singleton.selDay, " + (this.selYear-1) + ")'>&nbsp;</button></td>"
				// display the year
			 +  "<td style='text-align:center'><span class='calendarHeading'>" + this.selYear + "</span></td>"
				// next year button
			 +  "<td class='calendarArrow' onmouseover='this.className=\"calendarArrowOver\";' onmouseout='this.className=\"calendarArrow\";' onclick='if(this.childNodes.length>0){this.childNodes[0].onclick();}'><button class='calendarArrowRight' onclick='CalendarObject._singleton.display(" + this.selMonth + ", CalendarObject._singleton.selDay, " + (this.selYear+1) + ")'>&nbsp;</button></td>"
			 + "<td>&nbsp;</td>"
			 +  "</tr></table>"

	page += "<table class='calendarTable' border='0' cellspacing='0' cellpadding='0'>"

	// figure out how many days the month will have...
	var nDays = CalendarObject.getDaysInMonth(this.selYear, this.selMonth, this.type);
	if (this.selDay > nDays)
		this.selDay = nDays;

	// and go back to the first day of the month...
	// and figure out which day of the week it hits...
	var firstDay = new Date(this.selYear, this.selMonth-1, 1, 8);
	var startDay = firstDay.getDay();

	// figure out how many days the previous month has...
	var prevDays = CalendarObject.getDaysInMonth(pYear, pMonth, this.type);

	// now write the blanks at the beginning of the calendar
	var calHtml = "<tr>";
	
	// if the month starts on a Sunday, insert the last 7 days of the previous month
	if (startDay == 0)
	{
		startDay = 7;
		var tDay = new Date(pYear, pMonth-1, prevDays);
		calHtml += "<td class='weekNbr'>" + tDay.getWeek() + "</td>";
	}
	else
	{
		calHtml += "<td class='weekNbr'>" + firstDay.getWeek() + "</td>";
	}	
	
	var todayColumn = -1;
	var systemColumn = -1;
	var column = 0;
	var rows = 0;
	for (i=0; i<startDay; i++)
	{
		calHtml += "<td class='calendarDayGray'"
			+ " onmouseover='this.oldClass=this.className;this.className+=\"Over\"'"
			+ " onmouseout='this.className=this.oldClass'"	
			+ " onclick='CalendarObject._singleton.returnDay(" + (prevDays - startDay + i + 1) + "," + pMonth + "," + pYear + ")'"
			+ ">" + (prevDays - startDay + i + 1) + "</td>";
		column++;
	}

	for (i=1; i<=nDays; i++)
	{
		if (column >= 7)
		{
			column = 0;
			rows++;
			calHtml += "</tr><tr>";
			var tDay = new Date(this.selYear, this.selMonth-1, i+1);
			calHtml += "<td class='weekNbr'>" + tDay.getWeek()  + "</td>";
		}
		var isSystemDate = false;
		
		// Display the number for the day
		//  (style different if it is today or the selected day)
		var clazz = "calendarDay";
		if (i == day || (i == nDays && todayColumn == -1))
		{
			todayColumn = column;
			clazz += "Today";
			// automatically select this date
			this.selectDay(day, month, year, true);
		}
		else if (i == this.getTodaysDay() &&
			this.selMonth == (this.getTodaysMonth()+1) &&
			this.selYear == this.getTodaysYear())
		{
			isSystemDate = true;
			systemColumn = column;
			clazz += "SystemDate";			
		}
		else if (column == 6)
		{	
			clazz += "Right";
		}

		calHtml += "<td class='" + clazz + "'"
			 +  " onmouseover='this.oldClass=this.className;this.className+=\"Over\"'"
			 +  " onmouseout='this.className=this.oldClass'"
			 +  " onclick='CalendarObject._singleton.returnDay(" + i + ")'>"

		if (isSystemDate)
		{			 
			calHtml += "<button class='calendarDay'"
			 +  " onmouseover='this.oldClass=this.className;this.className+=\"Over\"'"
			 +  " onmouseout='this.className=this.oldClass'"
			 +  ">" + i + "</button>";
		}	
		else
		{
			calHtml += i;
		}

		calHtml += "</td>";
		column++;
	}

	var nmDay = 1;

	if (column > 0)
	{
		for (var i=column,j=1; i<7; i++,j++)
		{
			calHtml += "<td class='calendarDayGray" + ((i==6)?"Right":"") + "'"
			+ " onmouseover='this.oldClass=this.className;this.className+=\"Over\"'"
			+ " onmouseout='this.className=this.oldClass'"	
			+ " onclick='CalendarObject._singleton.returnDay(" + j + "," + nMonth + "," + nYear + ")'"			
			+ ">" + j + "</td>";
		}
		
		nmDay = j;
	}
	
	if (rows == 4)
	{
		column = 0;
		rows++;
		calHtml += "</tr><tr>";
		var tDay = new Date(nYear, nMonth-1, nmDay+1);
		calHtml += "<td class='weekNbr'>" + tDay.getWeek()  + "</td>";		
		
		for (var i=0; i<7; i++)
		{
			calHtml += "<td class='calendarDayGray" + ((i==6)?"Right":"") + "'"
			+ " onmouseover='this.oldClass=this.className;this.className+=\"Over\"'"
			+ " onmouseout='this.className=this.oldClass'"	
			+ " onclick='CalendarObject._singleton.returnDay(" + (nmDay + i) + "," + nMonth + "," + nYear + ")'"			
			+ ">" + (nmDay + i) + "</td>";
			
			column++;
		}		
	}
	
	calHtml += "</tr>";
	
	var tH = "<td class='calendarDayHeader'>";
	var tHToday = "<td class='calendarTodayHeader'>";
	var tHSystemDate = "<td class='calendarSystemDateHeader'>";
	
	var hdrHtml = "<tr>"
	+ "<td class='weekNbrHeader'>&nbsp;</td>";
	
	for (var i=0; i<7; i++)
	{
		if (i == todayColumn)
			hdrHtml +=  tHToday;
		else if (i == systemColumn)
			hdrHtml += tHSystemDate;
		else
			hdrHtml += tH;
		hdrHtml += this.dayNameAry[i] + "</td>"	
	}
	
	hdrHtml += "</tr>";
	
	page += hdrHtml + calHtml
	+ "</table></div>";
	this.calendar.innerHTML = page;
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.displayInfor = function(month, day, year)
{
	if (month >= 1 && month <= 12 && month != this.selMonth)
		this.selMonth = month;
	if (day >= 1 && day <= 31 && day != this.selDay)
		this.selDay = day;
	if (year != this.selYear)
		this.selYear = year;

	// inner calendar div
	var pMonth = (this.selMonth == 1) ? 12 : this.selMonth-1;
	var pYear = (this.selMonth == 1) ? this.selYear-1 : this.selYear;
	var nMonth = (this.selMonth == 12) ? 1 : this.selMonth+1;
	var nYear = (this.selMonth == 12) ? this.selYear+1 : this.selYear;
	var page = "<div class='calendarInner' onmouseover='CalendarObject._singleton.clearTimer()' onmouseout='CalendarObject._singleton.setTimer()'>"
			 + "<div class='calendarNav'><table class='calendarNav' border='0' cellpadding='0' cellspacing='0'><tr>"
				// previous month button
			 +  "<td class='calendarArrowLeft' onclick='if(this.childNodes.length>0){this.childNodes[0].onclick();}'><button class='calendarArrowLeft' onmouseover='this.className=\"calendarArrowLeftOver\";' onmousedown='this.className=\"calendarArrowLeftActive\";' onmouseout='this.className=\"calendarArrowLeft\";' onclick='CalendarObject._singleton.display(" + pMonth + ", CalendarObject._singleton.selDay, " + pYear + ")'>&nbsp;</button></td>"
				// display the month name
			 +  "<td style='text-align:center;vertical-align:top'><span class='calendarHeading'>" + this.monthNameAry[this.selMonth-1] + " " + this.selYear + "</span><button class='calendarArrowDown' onmouseover='this.className=\"calendarArrowDownOver\";' onmousedown='this.className=\"calendarArrowDownActive\";' onmouseout='this.className=\"calendarArrowDown\";' onclick='CalendarObject._singleton.displayMonthYear()'>&nbsp;</button></td>"
				// next month button
			 +  "<td class='calendarArrowRight' onclick='if(this.childNodes.length>0){this.childNodes[0].onclick();}'><button class='calendarArrowRight' onmouseover='this.className=\"calendarArrowRightOver\";' onmousedown='this.className=\"calendarArrowRightActive\";' onmouseout='this.className=\"calendarArrowRight\";' onclick='CalendarObject._singleton.display(" + nMonth + ", CalendarObject._singleton.selDay, " + nYear + ")'>&nbsp;</button></td>"			 
			 +  "</tr></table></div>"

	page += "<table class='calendarTable' border='0' cellspacing='0' cellpadding='0'>"

	// figure out how many days the month will have...	
	var nDays = CalendarObject.getDaysInMonth(this.selYear, this.selMonth, this.type);
	if (this.selDay > nDays)
		this.selDay = nDays;

	// and go back to the first day of the month...
	// and figure out which day of the week it hits...
	var startDay = CalendarObject.getFirstDayOfMonth(this.selYear, this.selMonth, this.type);
	
	// figure out how many days the previous month has...
	var prevDays = CalendarObject.getDaysInMonth(pYear, pMonth, this.type);

	// now write the blanks at the beginning of the calendar
	var calHtml = "<tr>";
	
	startDay = (startDay - this.firstDay + 7) % 7;
	
	// if the month starts on the first day, insert the last 7 days of the previous month
	if (startDay == 0)
	{
		startDay = 7;
	}
	
	var todayColumn = -1;
	var systemColumn = -1;
	var column = 0;
	var rows = 0;
	for (i=0; i<startDay; i++)
	{
		calHtml += "<td class='calendarDayGray'"
			+ " onmouseover='this.oldClass=this.className;this.className+=\"Over\"'"
			+ " onmouseout='this.className=this.oldClass'"	
			+ " onclick='CalendarObject._singleton.returnDay(" + (prevDays - startDay + i + 1) + "," + pMonth + "," + pYear + ")'"
			+ ">" + (prevDays - startDay + i + 1) + "</td>";
		column++;
	}

	for (i=1; i<=nDays; i++)
	{
		if (column >= 7)
		{
			column = 0;
			rows++;
			calHtml += "</tr><tr>";
			//var tDay = new Date(this.selYear, this.selMonth-1, i+1);
			//calHtml += "<td class='weekNbr'>" + tDay.getWeek()  + "</td>";
		}
		var isSystemDate = false;
		
		// Display the number for the day
		//  (style different if it is today or the selected day)
		var clazz = "calendarDay";
		if ((i == day || (i == nDays && todayColumn == -1))
		&& (i == this.getTodaysDay() && this.selMonth == (this.getTodaysMonth()+1) && this.selYear == this.getTodaysYear()))
		{
			//system date is selected
			todayColumn = column;
			clazz += "TodaySystemDate";
			// automatically select this date
			this.selectDay(day, month, year, true);		
		}
		else if (i == day || (i == nDays && todayColumn == -1))
		{
			//selected day
			todayColumn = column;
			clazz += "Today";
			// automatically select this date
			this.selectDay(day, month, year, true);
		}
		else if (i == this.getTodaysDay() && this.selMonth == (this.getTodaysMonth()+1) && this.selYear == this.getTodaysYear())
		{
			//system date
			isSystemDate = true;
			systemColumn = column;
			clazz += "SystemDate";	
		}

		calHtml += "<td class='" + clazz + "'"
			 +  " onmouseover='this.oldClass=this.className;this.className+=\"Over\"'"
			 +  " onmouseout='this.className=this.oldClass'"
			 +  " onclick='CalendarObject._singleton.returnDay(" + i + ")'>"

		if (isSystemDate)
		{			 
			calHtml += "<button class='calendarDay'"
			 +  " onmouseover='this.oldClass=this.className;this.className+=\"Over\"'"
			 +  " onmouseout='this.className=this.oldClass'"
			 +  ">" + i + "</button>";
		}	
		else
		{
			calHtml += i;
		}

		calHtml += "</td>";
		column++;
	}

	var nmDay = 1;

	if (column > 0)
	{
		for (var i=column,j=1; i<7; i++,j++)
		{
			calHtml += "<td class='calendarDayGray'"
			+ " onmouseover='this.oldClass=this.className;this.className+=\"Over\"'"
			+ " onmouseout='this.className=this.oldClass'"	
			+ " onclick='CalendarObject._singleton.returnDay(" + j + "," + nMonth + "," + nYear + ")'"			
			+ ">" + j + "</td>";
		}
		
		nmDay = j;
	}
	
	if (rows == 4)
	{
		column = 0;
		rows++;
		calHtml += "</tr><tr>";		
		
		for (var i=0; i<7; i++)
		{
			calHtml += "<td class='calendarDayGray'"
			+ " onmouseover='this.oldClass=this.className;this.className+=\"Over\"'"
			+ " onmouseout='this.className=this.oldClass'"	
			+ " onclick='CalendarObject._singleton.returnDay(" + (nmDay + i) + "," + nMonth + "," + nYear + ")'"			
			+ ">" + (nmDay + i) + "</td>";
			
			column++;
		}		
	}
	
	calHtml += "</tr>";
	
	var tH = "<td class='calendarDayHeader'>";
	var tHToday = "<td class='calendarTodayHeader'>";
	var tHSystemDate = "<td class='calendarSystemDateHeader'>";
	
	var hdrHtml = "<tr>";

	var j = this.firstDay;
	for (var i=0; i<7; i++)
	{
		if (j == todayColumn)
			hdrHtml += tHToday;
		else if (j == systemColumn)
			hdrHtml += tHSystemDate;
		else
			hdrHtml += tH;
		hdrHtml += this.dayNameAry[j] + "</td>";
		j = (j + 1) % 7;
	}	
	
	var btnClass = "calendarButton";
	//old IE versions do not support CSS rounded corners
	if (navigator.appName == "Microsoft Internet Explorer")
	{
		var ua = navigator.userAgent;
		if (ua.indexOf("MSIE ") != -1 && parseFloat(ua.substring(ua.indexOf("MSIE ")+5)) < 10)
			btnClass = "calendarToday";
	}	
	hdrHtml += "</tr>";
	page += hdrHtml + calHtml + "</table>"
	+ "<div class='calendarToday'><button class='"+btnClass+"' tabindex='0' onclick='CalendarObject._singleton.returnDay("+this.getTodaysDay()+","+(this.getTodaysMonth()+1)+","+this.getTodaysYear()+")'>"+this.labelsAry[0]+"</button></div>";
	+ "</div>";
	this.calendar.innerHTML = page;
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.display = function(month, day, year)
{
	// make sure the day is valid for the year and month
	var nDays = CalendarObject.getDaysInMonth(year, month, this.type);
	if (day > nDays)
		day = nDays;	
	if (this.styler != null && this.styler.showLDS)
	{
		this.displayLDS(month, day, year);	
	}
	else if (this.styler != null && this.styler.showInfor)
	{
		this.displayInfor(month, day, year);	
	}	
	else
	{
		this.displayClassic(month, day, year);
	}
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.monthYearSelectValue = function(selElm)
{
	selElm.onmouseover = null;
	selElm.onmouseout = null;
	var divElm;
	if (!selElm.getAttribute("systemDate"))
	{
		divElm = selElm.childNodes[0];
		divElm.className = divElm.className.replace("calendarDay", "monthYearSelected");
	}
	var type = (selElm && selElm.getAttribute("monthNbr")) ? "month" : "year";
	var whichElm = (type == "month") ? this.selMonthElm : this.selYearElm;
	//reset the old selected value	
	if (whichElm && whichElm != selElm && !whichElm.getAttribute("systemDate"))
	{
		if (whichElm.childNodes.length > 0)
		{
			divElm = whichElm.childNodes[0];
			divElm.onmouseover = function()
			{
				this.className += "Over";
			}
			divElm.onmouseout = function()
			{
				this.className = this.className.replace("Over","");
			}
			divElm.className = divElm.className.replace("monthYearSelected", "calendarDay");
			divElm.className = divElm.className.replace("Over", "");
		}
	}
	if (selElm && selElm.getAttribute("monthNbr"))
	{
		this.selMonthMonth = Number(selElm.getAttribute("monthNbr"));
		this.selMonthElm = selElm;
	}
	else
	{
		if (selElm.getAttribute("systemDate"))
			this.selYearYear = Number(selElm.getAttribute("systemDate"));
		else
			this.selYearYear = Number(selElm.getAttribute("yearNbr"));
		this.selYearElm = selElm;	
	}
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.selectMonthYear = function()
{
	if (this.selMonthMonth == null)
		this.selMonthMonth = this.selMonth;
	if (this.selYearYear == null)
		this.selYearYear = this.selYear;	
	this.selYearStart = this.getTodaysYear() - 5;
	this.display(this.selMonthMonth, this.selDay, this.selYearYear);
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.cancelSelectMonthYear = function()
{
	this.selYearStart = this.getTodaysYear() - 5;
	this.display(this.selMonth, this.selDay, this.selYear);
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.addSelMonthRow = function(rowNbr)
{
	var str = "<td class='calendarDay' onclick='CalendarObject._singleton.monthYearSelectValue(this)' monthNbr='"+(rowNbr+1)+"'";
	if ((rowNbr+1) == (this.getTodaysMonth()+1))
		str += " systemDate='"+(this.getTodaysMonth()+1)+"'><div class='calendarDaySystemDate'>"+this.monthShortNameAry[rowNbr]+"</div>";	
	else
		str += "><div class='calendarDay' onmouseover='this.className+=\"Over\"' onmouseout='this.className=this.className.replace(\"Over\",\"\")'>"+this.monthShortNameAry[rowNbr]+"</div>";
	str += "</td><td class='calendarDayGridDivider' onclick='CalendarObject._singleton.monthYearSelectValue(this)' monthNbr='"+(rowNbr+7)+"'";
	if ((rowNbr+7) == (this.getTodaysMonth()+1))
		str += " systemDate='"+(this.getTodaysMonth()+1)+"'><div class='calendarDaySystemDate'>"+this.monthShortNameAry[rowNbr+6]+"</div>";	
	else	
		str += "><div class='calendarDay' onmouseover='this.className+=\"Over\"' onmouseout='this.className=this.className.replace(\"Over\",\"\")'>"+this.monthShortNameAry[rowNbr+6]+"</div>";
	str += "</td>";
	return str;
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.addSelYearRow = function()
{
	var str = "<td class='calendarDay' onclick='CalendarObject._singleton.monthYearSelectValue(this)'>"
	+ "<div class='calendarDay' onmouseover='this.className+=\"Over\"' onmouseout='this.className=this.className.replace(\"Over\",\"\")'>&nbsp;</div></td>"	
	+ "<td class='calendarDay' onclick='CalendarObject._singleton.monthYearSelectValue(this)'>"
	+ "<div class='calendarDay' onmouseover='this.className+=\"Over\"' onmouseout='this.className=this.className.replace(\"Over\",\"\")'>&nbsp;</div></td>";
	return str;
}
CalendarObject.prototype.stopEvent = function(e)
{
	if (!e) e = window.event;
    if (e.stopPropagation) 
        e.stopPropagation();
    else
        e.cancelBubble = true;
}    
//-----------------------------------------------------------------------------
CalendarObject.prototype.displayMonthYearPreviousYear = function(e)
{
	this.stopEvent(e);
	this.selYearStart--;
	this.setSelYears();
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.displayMonthYearNextYear = function(e)
{
	this.stopEvent(e);
	this.selYearStart++;
	this.setSelYears();
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.setSelYears = function()
{
	var startYr = Number(this.selYearStart);
	var yrTbl = document.getElementById("calendarMonthYearPanel");
	var yrRows = yrTbl.getElementsByTagName("tr");
	for (var i=1; i<yrRows.length; i++)
	{
		var yrCells = yrRows[i].getElementsByTagName("td");
		yrCells[2].setAttribute("yearNbr", "" + startYr);
		var yrDiv = yrCells[2].childNodes[0];
		if (startYr == this.getTodaysYear())
		{
			yrCells[2].setAttribute("systemDate", String(this.getTodaysYear()));
			yrDiv.className = "calendarDaySystemDate";
			yrDiv.onmouseover = null;
			yrDiv.onmouseout = null;			
			yrDiv.innerHTML = "" + startYr;
		}	
		else
		{
			yrCells[2].removeAttribute("systemDate");
			if (startYr == Number(this.selYearYear))
				yrDiv.className = "monthYearSelected";
			else
				yrDiv.className = "calendarDay";	
			yrDiv.innerHTML = "" + startYr;
		}
		yrCells[3].setAttribute("yearNbr", "" + (startYr+5));
		yrDiv = yrCells[3].childNodes[0];
		if ((startYr+5) == this.getTodaysYear())
		{
			yrCells[3].setAttribute("systemDate", String(this.getTodaysYear()));
			yrDiv.className = "calendarDaySystemDate";
			yrDiv.onmouseover = null;
			yrDiv.onmouseout = null;
			yrDiv.innerHTML = "" + (startYr+5);
		}	
		else
		{
			yrCells[3].removeAttribute("systemDate");
			if ((startYr+5) == this.selYearYear)
				yrDiv.className = "monthYearSelected";
			else
				yrDiv.className = "calendarDay";			
			yrDiv.innerHTML = "" + (startYr+5);
		}
		startYr++;
	}
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.displayMonthYear = function()
{
	this.selMonthMonth = null;
	this.selYearYear = null;	
	
	var page = "<div class='calendarInner' onmouseover='CalendarObject._singleton.clearTimer()' onmouseout='CalendarObject._singleton.setTimer()'>"
	+ "<table id='calendarMonthYearPanel' class='calendarMonthYearPanel' cellspacing='0' cellpadding='0'>"
	+ "<tbody>";
	
	page += "<tr>"+this.addSelMonthRow(0);
	page += "<td class='calendarArrowLeft' onclick='if(this.childNodes.length>0){this.childNodes[0].onclick();}'><button class='calendarArrowLeft' onmouseover='this.className=\"calendarArrowLeftOver\";' onmousedown='this.className=\"calendarArrowLeftActive\";' onmouseout='this.className=\"calendarArrowLeft\";' onclick='CalendarObject._singleton.displayMonthYearPreviousYear(event)'>&nbsp;</button></td>"
	+ "<td class='calendarArrowRight' onclick='if(this.childNodes.length>0){this.childNodes[0].onclick();}'><button class='calendarArrowRight' onmouseover='this.className=\"calendarArrowRightOver\";' onmousedown='this.className=\"calendarArrowRightActive\";' onmouseout='this.className=\"calendarArrowRight\";' onclick='CalendarObject._singleton.displayMonthYearNextYear(event)'>&nbsp;</button></td>"
	+ "</tr>";	
		
	for (var j=1; j<=5; j++)
	{	
		page += "<tr>"+this.addSelMonthRow(j);
		page += this.addSelYearRow()+"</tr>";
	}	
	
	var btnClass = "calendarButton";
	//old IE versions do not support CSS rounded corners
	if (navigator.appName == "Microsoft Internet Explorer")
	{
		var ua = navigator.userAgent;
		if (ua.indexOf("MSIE ") != -1 && parseFloat(ua.substring(ua.indexOf("MSIE ")+5)) < 10)
			btnClass = "calendarToday";
	}
	
	page += "</tbody></table>"		
	+ "<div class='calendarToday'>"
	+ "<button class='"+btnClass+"' tabindex='0' onclick='CalendarObject._singleton.selectMonthYear()'>"+this.labelsAry[1]+"</button>"
	+ "<button class='"+btnClass+"' tabindex='0' onclick='CalendarObject._singleton.cancelSelectMonthYear()'>"+this.labelsAry[2]+"</button>"
	+ "</div>"
	
	page += "</div>";
	this.calendar.innerHTML = page;	
	this.setSelYears();
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.setTimer = function()
{
	this.calTimer = setTimeout("CalendarObject._singleton.close()", CalendarObject.GRACE_TIME);
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.clearTimer = function()
{
	clearTimeout(this.calTimer);
	this.calTimer = null;
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.close = function()
{
	if (this.inputFld && this.inputFld.onchange && this.inputFld.value != this.origDate)
	{
		this.origDate = this.inputFld.value;
		this.inputFld.onchange();
	}	
	this.inputFld = null;
	this.calendar.style.visibility = "hidden";
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.returnDay = function(dayOfMonth, month, year)
{
	this.selectDay(dayOfMonth, month, year);
	this.close();
}
//-----------------------------------------------------------------------------
CalendarObject.prototype.selectDay = function(dayOfMonth, month, year, systemSelected)
{
	if (!this.inputFld)
	{
		this.close();
		return;
	}

	// add prefix 0's
	var nmonth = (month) ? "" + month : "" + this.selMonth;
	if (nmonth.length == 1)
		nmonth = "0" + nmonth;
	var nday = "" + dayOfMonth;
	if (nday.length == 1)
		nday = "0" + nday;

	var nyear = (year) ? "" + year : this.selYear;

	// format for user preference
	var dateForUser = CalendarObject.formatDateForUser(nmonth, nday, nyear, this.dateFormat, this.dateSeparator);
	this.inputFld.value = dateForUser;
	if (this.inputFld.onchange)
		this.inputFld.onchange();
	if (this.type == CalendarObject.TYPE_HIJRI)
		this.inputFld.setAttribute("gregDate", CalendarObject.toGregorian(dateForUser, this.dateFormat, this.dateSeparator, this.type));
	
	if (!systemSelected 
	&& this.inputFld.onchange
	&& (dateForUser != this.origDate))
	{
		this.origDate = dateForUser;
		this.inputFld.onchange();
	}
}
//-----------------------------------------------------------------------------
