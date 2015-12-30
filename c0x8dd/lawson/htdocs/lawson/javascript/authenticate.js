//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/authenticate.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $

var authenHost = ''
var authenFrameNm = ''
var authenFuncNm  = ''
var authenDesiredEdit = ''
var officeObjects = false
var skinsobjs = false

function authenticate(param)
{
var host        = ''
var frameNm     = ''
var funcNm      = ''
var desiredEdit = ''
var quickEdit   = false

    var paramLst  = param.split('|')
    var NbrParams = paramLst.length

    for (var i=0;i<NbrParams;i++)
        if (paramLst[i].indexOf("=") != -1)
            eval(paramLst[i])

	if (host != "")
    	authenHost = host
	else
		authenHost = location.host
    authenFrameNm = frameNm
    authenFuncNm  = funcNm
    authenDesiredEdit = desiredEdit

    if (authenFrameNm == '')
        alert('ERROR: In Calling Authenticate Routine')
    else
    {
        if ((top && top.authUser) || (opener && opener.top && opener.top.authUser))
        {
            quickEdit = true
            if (top && top.authUser)
				authUser = top.authUser
            else if (opener && opener.top && opener.top.authUser)
	            authUser = opener.top.authUser

			if(typeof(authUser.editDone) == "unknown")	//added 10/26 crk
                doCGIAuthentication(true)				//added 10/26 crk
            else if (desiredEdit == authUser.editDone || desiredEdit == null || desiredEdit == '') //changed 10/26 crk
			{
				if (typeof(authUser.FATALError) == "undefined")
	                finishUp(false)
				else
	                finishUp(authUser.FATALError)
			}
            else
                doCGIAuthentication(true)
        }
        else
    		doCGIAuthentication(false)
	}
}

function authLengthenBar(what,firstText,secondText)
{
	if (typeof(stretchProgressBar) != 'undefined')
		stretchProgressBar(what,firstText,secondText)
}

function callTAUTHEN(string, frameStr, debugFl)
{
	if (debugFl)
		alert("DEBUG: Calling callTAUTHEN(" + string + "," + frameStr + ")");
	eval("window." + frameStr + ".location.replace(\"" + string + "\")")
}

function doCGIAuthentication(editTypeOnly)
{
var urlSep = "&"
var urlStr = location.protocol + "//" + authenHost + "/cgi-lawson/authen"
	if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
		urlStr += CGIExt
    else
		if (opener != null)
			if (typeof(opener.CGIExt) != null && typeof(opener.CGIExt) != 'undefined')
				urlStr += opener.CGIExt
    urlStr += "?"

	var parmsStr = "func=returnToAuthen()"
    if (authenDesiredEdit != '')
    	parmsStr += urlSep + "edit=" + authenDesiredEdit
    if (editTypeOnly)
    	parmsStr += urlSep + "edittypeonly"
	if (!officeObjects)
		parmsStr += urlSep + "officeobjs=false"
	if (skinsobjs)
		parmsStr += urlSep + "skinsobjs=true"
	urlStr += parmsStr

	callTAUTHEN(urlStr, authenFrameNm, false)
}

function returnToAuthen(FatalErrorFl)
{
	authUser = eval(authenFrameNm + ".authUser")
	if (skinsobjs)
		skin = eval(authenFrameNm + ".skin")
    finishUp(FatalErrorFl)
}

function finishUp(FatalErrorFl)
{
var tmpStr = ''

	if (typeof(authUser.FATALError) != 'undefined')
	{
	    if (authenFuncNm != "")
	    {
	    	tmpStr  = authenFuncNm.substring(0,authenFuncNm.lastIndexOf(")"))
	        if (tmpStr.charAt(tmpStr.length-1) != "(")
	        	tmpStr += ","
	        tmpStr += authUser.FATALError + ")"
			eval(tmpStr)
	    }
	    else
	    	startApp(authUser.FATALError)
	}
	else
	{
	    if (authenFuncNm != "")
	    {
	    	tmpStr  = authenFuncNm.substring(0,authenFuncNm.lastIndexOf(")"))
	        if (tmpStr.charAt(tmpStr.length-1) != "(")
	        	tmpStr += ","
	        tmpStr += FatalErrorFl + ")"
			eval(tmpStr)
	    }
	    else
	    	startApp(FatalErrorFl)
	}
}


