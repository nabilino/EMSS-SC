//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/skin.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00*/

var skin = false
var skinHost = ''
var skinFrameNm = ''
var skinFuncNm  = ''
var debugSkin = false

function goSkin(param)
{
	var host = '', frameNm = '', funcNm = ''
	param = param.split('|')
	for (var i=0; i<param.length; i++)
		if (param[i].indexOf("=") != -1)
			eval(param[i])    	

	skinHost = location.host
    skinFrameNm = frameNm
    skinFuncNm  = funcNm

    if (skinFrameNm == '')
        alert('ERROR: In Calling Skin Objects Routine, no frame specified')
    else
    {
		findSKIN("top")

		if (!skin && opener)
			findSKIN("opener")

		if (!skin)
			doCGISkinGet()
		else
		{
			if (skinFuncNm != '')
				setTimeout(skinFuncNm, 1)
			else
				setTimeout("skinGetIsDone()", 1)
		}
	}
}

function findSKIN(startHere)
{
	if (eval(startHere) == self)
	{
		if (self.skin)
		{
			authUser = self.authUser
			skin = self.skin
			return true;
		}
		else
			return false;
	}
	else
	{
		if (document.layers)
		{
			if (typeof(eval(startHere + ".skin")) != "undefined")
			{
				authUser = eval(startHere + ".authUser")
				skin = eval(startHere + ".skin")
				return true;
			}
		}
		else if (document.all)
		{
			if (typeof(eval("try{eval(startHere + '.skin')}catch(e){}")) != "undefined")
			{
				authUser = eval(startHere + ".authUser")
				skin = eval(startHere + ".skin")
				return true;
			}
		}
	}

	return SKINsearchframe(startHere)
}

function SKINsearchframe(startHere)
{
	var frameRef = false
	if (document.layers)
	{
		for (var i=0; i<eval(startHere+".frames.length"); i++)
		{
			if (eval(startHere + ".frames[" + i + "].length") > 0)
				frameRef = SKINsearchframe(startHere + ".frames[" + i + "]")
			else if (typeof(eval(startHere + ".frames[" + i + "].skin")) != "undefined")
			{
				authUser = eval(startHere + ".frames[" + i + "].authUser")
				skin = eval(startHere + ".frames[" + i + "].skin")
				return true;
			}
			else
				return false;
	
			if (frameRef)
				return frameRef
		}
	}
	else if (document.all)
	{
		if (typeof(eval("try{eval(startHere + '.frames.length')}catch(e){}")) != "undefined")
		{
			for (var i=0; i<eval(startHere+".frames.length"); i++)
			{
				if (typeof(eval("try{eval(startHere + '.frames[" + i + "].length')}catch(e){}")) != "undefined")
				{
					if (eval(startHere + ".frames[" + i + "].length") > 0)
						frameRef = SKINsearchframe(startHere + ".frames[" + i + "]")
					else if (typeof(eval("try{eval(startHere + '.frames[" + i + "].skin')}catch(e){}")) != "undefined")
					{
						authUser = eval(startHere + ".frames[" + i + "].authUser")
						skin = eval(startHere + ".frames[" + i + "].skin")
						return true;
					}
				}
				else
					return false;

				if (frameRef)
					return frameRef
			}
		}
		else
			return false;
	}

	return frameRef
}

function callTSKIN(string, frameStr)
{
	if (debugSkin)
		alert("DEBUG: Calling callTSKIN(" + string + "," + frameStr + ")");
	eval("window." + frameStr + ".location.replace(\"" + string + "\")")
}

function doCGISkinGet()
{
	var urlSep = "&"
	var urlStr = location.protocol + "//" + skinHost + "/cgi-lawson/authen"
	if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
		urlStr += CGIExt
	else
		if (opener != null)
			if (typeof(opener.CGIExt) != null && typeof(opener.CGIExt) != 'undefined')
				urlStr += opener.CGIExt
	urlStr += "?"

	var parmsStr = "func=returnToSkin()"
				 + urlSep + "officeobjs=true" //dpb PT 81987
				 + urlSep + "skinsobjs=true"
	urlStr += parmsStr

	callTSKIN(urlStr, skinFrameNm)
}

function returnToSkin(FatalErrorFl)
{
	skin	 = eval(skinFrameNm + ".skin")
	authUser = eval(skinFrameNm + ".authUser")
	if (skin && skin.ErrorMsg != "")
		alert("SKINS ERROR: " + skin.ErrorMsg)
	if (skinFuncNm != '')
		setTimeout(skinFuncNm, 1)
	else
		setTimeout("skinGetIsDone()", 1)
}

function enterPage()  //dpb PT 81987
{
	var blnHasAccess = false
	var strPathname = location.pathname.toLowerCase()
	var strHash = location.hash.toLowerCase()
	var strPage = strPathname.substring(strPathname.lastIndexOf("/")).toLowerCase()
	var strBookmark = strPathname
	
	if (strPage == "/addgroup.htm" || strPage == "/adduser.htm")
	{
		strBookmark = "/lawson/office/usergroups.htm"
	}
	if (strPage == "/setskin.htm" || strPage == "/userformat.htm") 
	{
		strBookmark = strPathname + (strHash  == "#lawson" ? strHash : "")
	}
	
	for (var i=0;i<authUser.OfficeObject.length;i++)
	{
		if (authUser.OfficeObject[i].url.toLowerCase() == strBookmark)
		{
			blnHasAccess = true;
			break;
		}
	}
	return blnHasAccess
}
