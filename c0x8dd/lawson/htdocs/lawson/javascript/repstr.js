//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/repstr.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
function getFront(mainStr, srchStr)
{
	fndOffset = mainStr.indexOf(srchStr);
	if (fndOffset == -1)
		return null;
	else
		return mainStr.substring(0, fndOffset);
}

function getEnd(mainStr, srchStr)
{
	fndOffset = mainStr.indexOf(srchStr);
	if (fndOffset == -1)
		return null;
	else
		return mainStr.substring(fndOffset+srchStr.length, mainStr.length);
}

function repStrs(inStr, fromStr, toStr)
{
	var resultStr = "" + inStr;
	if (resultStr == "")
		return "";
	var front = getFront(resultStr, fromStr);
	var end = getEnd(resultStr, fromStr);
	while (front != null && end != null)
	{
		resultStr = front + toStr + end;
		var front = getFront(resultStr, fromStr);
		var end = getEnd(resultStr, fromStr);
	}
	return resultStr;
}
