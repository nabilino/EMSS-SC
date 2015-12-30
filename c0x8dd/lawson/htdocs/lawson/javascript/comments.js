//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/comments.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
// This will take a large string and turn it into one of two types of arrays.
// The first a web array, turning carriage returns into '<BR>'.  The second
// a Fixed Line Length, with some return carriage smarts.  This is essentially so we can take 
// blocks of comments and send them to the Program Object on the server.
// The parameters are:  String and Line Length and (optional) max nbr of lines
// The return: is an array of strings matching Line Length and max nbr of lines!
// NOTE:  must include the /lawson/javascript/repstr.js in the calling programs .js list

//** The first function simply turns a text block into a web readable string
function webComments(wcString, wcLineLength, wcNbrOfLines, retCh)
{
	wcString = unescape(wcString)
var wcStrArray = new Array()
	if (retCh == null
	||  retCh == "undefined")
		retCh = '<BR>'
var wcTmpStr   = repStrs(wcString,'\r\n',retCh)
var wcCommCntr = 0
var wcLineCntr = 1	
var wcIndex    = 0

	if (wcNbrOfLines == null || wcNbrOfLines == 0)
    	wcNbrOfLines = 9999

    while (wcCommCntr < wcTmpStr.length
    &&     wcLineCntr < wcNbrOfLines)
    {
    	wcStrArray[wcIndex] = wcTmpStr.substring(wcCommCntr,wcCommCntr+wcLineLength)
    	wcLineCntr++
        wcIndex++
    	wcCommCntr = wcCommCntr + wcLineLength	
    }

	return wcStrArray
}
