//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/spacer.js,v 1.1.26.1 2007/02/06 22:08:33 keno Exp $ $Name: REVIEWED_901 $
function spacer(string, n, type)
{
	var space = "";
	for (var i = 0; i < (n - string.length); i++)
		space += " ";
	if (type == "L")
		return string + space;
	else
		return space + string;
}
