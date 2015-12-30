//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
autoPrefsLocation='/ricky/lawson/javascript/preferences/autoprefs.htm' 
cookieName='LawsonPrefs'
cookieValue='PrefsOK'

function GetLawsonCookie()
{
	if (GetCookie(cookieName) == cookieValue)
		return true
	else
		return false
}

var globalCallBack = ''
function checkSystem(callBackFunc) 
{
	globalCallBack = callBackFunc
	if (!navigator.javaEnabled())
	{
		alert('\nYou need to turn on "Java" in the browser preference settings.\n\nPlease change the preference, restart the browser, and try again.')
		return false
	} 

	if (GetLawsonCookie())
		systemOK()
	else
		checkAndUpdatePrefs()
}

function checkAndUpdatePrefs()
{
	var options='dependent=yes,toolbar=no,height=100,width=500'
	var updater = open(autoPrefsLocation,'updater',options) //updates Communicator's preferences 
}

function systemOK()
{
	eval(globalCallBack)
}

function setLawsonCookie() 
{
var expdate = new Date();

	expdate.setTime(expdate.getTime()+(365*24*60*60*1000));  //expires in 1 year 
	SetCookie(cookieName,cookieValue,expdate,"/") //valid for entire domain
}

function GetCookie(name)
{
var arg=name + "=";
var alen=arg.length;
var clen=document.cookie.length;
var i=0;

	while (i<clen) 
	{
    var j=i + alen;
    	if (document.cookie.substring(i, j)==arg)
      		return getCookieVal (j);
		i = document.cookie.indexOf(" ", i) + 1;
    	if (i==0)
			break; 
  	}
	return null;
}

function getCookieVal(offset)
{
var endstr = document.cookie.indexOf (";", offset);
	if (endstr == -1)
    	endstr = document.cookie.length;

	return unescape(document.cookie.substring(offset, endstr));
}

function SetCookie (name,value,expires,path,domain,secure) 
{
	document.cookie = name + "=" + escape (value) +
    	((expires) ? "; expires=" + expires.toGMTString() : "") +
    	((path) ? "; path=" + path : "") +
    	((domain) ? "; domain=" + domain : "") +
    	((secure) ? "; secure" : "");
}

function DeleteCookie (name,path,domain) 
{
	if (GetCookie(name)) 
	{
    	document.cookie = name + "=" +
      		((path) ? "; path=" + path : "") +
      		((domain) ? "; domain=" + domain : "") +
      		"; expires=Thu, 01-Jan-70 00:00:01 GMT";
	}
}
