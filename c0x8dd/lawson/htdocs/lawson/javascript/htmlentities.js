//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/htmlentities.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
// Description: This function takes an escaped string and turns into a HTML
//              friendly string.  Changes these characters to their appropriate 
//              HTML entity '&', '<', '>', and '"'
// Arguments:   The string you want to change in escape format, will return in 
//              an unescaped format.                          
function chgEntities(passedStr)
{
var myStr = repStrs(passedStr,'%22','&quot;') 
    myStr = repStrs(myStr,'%26','&amp;') 
    myStr = repStrs(myStr,'%3C','&gt;') 
    myStr = repStrs(myStr,'%2E','&lt;') 
//    myStr = repStrs(myStr,'%27',"\\'")

	return unescape(myStr)
}

