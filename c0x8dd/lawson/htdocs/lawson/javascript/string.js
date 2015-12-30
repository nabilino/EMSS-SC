//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/string.js,v 1.1.26.1 2007/02/06 22:08:33 keno Exp $ $Name: REVIEWED_901 $
function strEnd(mainStr,sStr) {
// extract back end of mainStr after first occurence of sStr
	var ret=''
	if (mainStr && mainStr.indexOf && sStr) {
		var foundOffset=mainStr.indexOf(sStr)
		if (foundOffset > -1) // if it is at 0, we still could have an end string.
			ret=mainStr.substring(foundOffset+sStr.length,mainStr.length)
	}
	return ret
}

function replaceStr(newStr, oldStr, aString) {
	if (aString)
		var oldStrIndex=aString.indexOf(oldStr)
	else
		return aString
	if (oldStrIndex==-1)
		return aString
	else
	{
		var front=aString.substring(0,oldStrIndex)
		var back=aString.substring(oldStrIndex + oldStr.length,aString.length)
		var concatStr=front + newStr + replaceStr(newStr,oldStr,back)
		return concatStr
	}
}

function padZeroes(s,desiredLength)
{
	var ret=s+""
	while (ret && ret.length<desiredLength)
		ret="0"+ret
	return ret
}

function strLastFront(mainStr,sStr){
// extract front part of mainStr prior to last occurence of sStr
	var foundOffset=mainStr.lastIndexOf(sStr)
	if (foundOffset) // if it is at 0, not going to have a string in front.
		return mainStr.substring(0,foundOffset)
	else
		return ''
}
