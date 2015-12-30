//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// Description: This function will find all the special characters in a string and 
//              return a true (special character exists) or false (special character does NOT exist).
// Arguments:   The string to be checked.

function chkSpecChars(theStr)
{
var jCntr = 0
var specChars = '!?-&@<>"()' + "'"

	for (jCntr=0;jCntr<specChars.length;jCntr++)
		if (theStr.indexOf(specChars.charAt(jCntr)) != -1)
			return true

	return false
}
