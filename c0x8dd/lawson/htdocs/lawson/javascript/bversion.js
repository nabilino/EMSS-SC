//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/bversion.js,v 1.2.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
// This function will return the Browser and Version the user is on.

function userBrowser()
{

 this.Netscape = 0
 this.IE = 0
 this.Windows = ''
 this.Mac = 0
 this.Unix = 0

	if (navigator.userAgent.indexOf('MSIE') != -1)
	   {
		if (navigator.userAgent.indexOf('MSIE 3.') != -1)
			this.IE = 3
		else if (navigator.userAgent.indexOf('MSIE 4.') != -1)
			this.IE = 4
		else if (navigator.userAgent.indexOf('MSIE 5.5') != -1)
			this.IE = 5.5
		else if (navigator.userAgent.indexOf('MSIE 5.') != -1)
			this.IE = 5
		else if (navigator.userAgent.indexOf('MSIE 6.') != -1)
			this.IE = 6
		else if (navigator.userAgent.indexOf('MSIE 7.') != -1)
			this.IE = 7
		else if (navigator.userAgent.indexOf('MSIE 8.') != -1)
			this.IE = 8
		else if (navigator.userAgent.indexOf('MSIE 9.') != -1)
			this.IE = 9
		}
	else
		{
		 if (navigator.userAgent.indexOf('Mozilla/2.0') != -1)
		 	this.Netscape = 2
		 else if (navigator.userAgent.indexOf('Mozilla/3.0') != -1)
		 	this.Netscape = 3
		 else if (navigator.userAgent.indexOf('Mozilla/4.0') != -1)
		 	this.Netscape = 4
		 else if (navigator.userAgent.indexOf('Mozilla/4.5') != -1)
		 	this.Netscape = 4.5
		 else if (navigator.userAgent.indexOf('Mozilla/4.6') != -1)
		 	this.Netscape = 4.6
		 else if (navigator.userAgent.indexOf('Mozilla/4.7') != -1)
		 	this.Netscape = 4.7
		 else if (navigator.userAgent.indexOf('Mozilla/4.8') != -1)
		 	this.Netscape = 4.8
		 else if (navigator.userAgent.indexOf('Mozilla/4.9') != -1)
		 	this.Netscape = 4.9
		 else if (navigator.userAgent.indexOf('Mozilla/5.') != -1)
		 	this.Netscape = 5
		 else if (navigator.userAgent.indexOf('Mozilla/6.') != -1)
		 	this.Netscape = 6
		 else if (navigator.userAgent.indexOf('Mozilla/7.') != -1)
		 	this.Netscape = 7
		 else if (navigator.userAgent.indexOf('Mozilla/8.') != -1)
		 	this.Netscape = 8
		 else if (navigator.userAgent.indexOf('Mozilla/9.') != -1)
		 	this.Netscape = 9
		}			

	if ((navigator.userAgent.indexOf('Windows 3.1') != -1) ||
		(navigator.userAgent.indexOf('Win32') != -1))
	 	this.Windows = "Windows 3.x"
	else if ((navigator.userAgent.indexOf('Windows 95') != -1) ||
		 (navigator.userAgent.indexOf('Win95') != -1))
		  this.Windows = "Windows 95"
	else if ((navigator.userAgent.indexOf('Windows 98') != -1) ||
		 (navigator.userAgent.indexOf('Win98') != -1))
		  this.Windows = "Windows 98"
	else if ((navigator.userAgent.indexOf('Windows NT') != -1) ||
		 (navigator.userAgent.indexOf('WinNT') != -1))
		  this.Windows = "Windows NT"
	else if ((navigator.userAgent.indexOf('Windows 2000') != -1) ||
		 (navigator.userAgent.indexOf('Win2000') != -1))
		  this.Windows = "Windows 2000"

	if (navigator.userAgent.indexOf('Mac') != -1) 
	 	this.Mac = 1

	if ((navigator.userAgent.indexOf('Linux') != -1) ||
		(navigator.userAgent.indexOf('SunOS') != -1) ||
		(navigator.userAgent.indexOf('IRIX') != -1) ||
		(navigator.userAgent.indexOf('HP-UX') != -1))
	 	this.Unix = 1				
}


function GetBrowser()
{
var myBrowser  = new userBrowser()
var browserStr = ''

	if (myBrowser.Netscape > 0)
	{
		browserStr = "Netscape Version "	
		if (myBrowser.Netscape == 2)
			browserStr += "2.0"
		else if (myBrowser.Netscape == 3)
			browserStr += "3.0"
		else if (myBrowser.Netscape == 4)
		 	browserStr += "4.0"
		else if (myBrowser.Netscape == 4.5)
		 	browserStr += "4.5"
		else if (myBrowser.Netscape == 5)
		 	browserStr += "5.0"
		else if (myBrowser.Netscape == 6)
		 	browserStr += "6.0"
		else if (myBrowser.Netscape == 7)
		 	browserStr += "7.0"
		else if (myBrowser.Netscape == 8)
		 	browserStr += "8.0"
		else if (myBrowser.Netscape == 9)
		 	browserStr += "9.0"
	}
	else
	if (myBrowser.IE > 0)
	{
		browserStr = "Internet Explorer "
		if (myBrowser.IE == 3)
			browserStr += "3.0"
		else if (myBrowser.IE == 4)
		 	browserStr += "4.0"
		else if (myBrowser.IE == 5)
		 	browserStr += "5.0"
		else if (myBrowser.IE == 5.5)
		 	browserStr += "5.5"
		else if (myBrowser.IE == 6)
		 	browserStr += "6.0"
		else if (myBrowser.IE == 7)
		 	browserStr += "7.0"
		else if (myBrowser.IE == 8)
		 	browserStr += "8.0"
		else if (myBrowser.IE == 9)
		 	browserStr += "9.0"
	}
	else
	if (myBrowser.Mac > 0)
		browserStr = "Macintosh Compatible"
	else
	if (myBrowser.Unix > 0)
		browserStr = "UNIX Compatible"

	return browserStr	
}

function GetVersion()
{
	return GetBrowser()
}

function GetOS()
{
	if (navigator.userAgent.indexOf("(Mac") != -1)
		return "Macintosh"
	else if (navigator.userAgent.indexOf("(Win95") != -1)
		return "Windows 95"
	else if (navigator.userAgent.indexOf("(WinNT") != -1)
		return "Windows NT"
	else if (navigator.userAgent.indexOf("(Linux") != -1)
		return "Linux"
	else if (navigator.userAgent.indexOf("(SunOS") != -1)
		return "Sun"
	else
		return navigator.userAgent
}
