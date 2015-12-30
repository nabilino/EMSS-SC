//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
//////////////////////////////////////////////////////////////////////
//  findframe.js                                                    //
//                                                                  //
//  This is a recursive process that looks for an object reference  //
//  to where you are located and passes that object to you.  You    //
//  call 'findME()' and pass it the object where you want to start  //
//  like 'top', and it returns to you an [object Window] reference  //
//  to where you are.                                               //
//////////////////////////////////////////////////////////////////////

function findME(startHere)
{
	if (eval(startHere) == self)
		return eval(startHere)
	else
		return searchframe(startHere)
}

function searchframe(startHere)
{
	var frameRef = false
	for (var i=0; i<eval(startHere + ".frames.length"); i++)
	{
		if (eval(startHere + ".frames[" + i + "].length") > 0)
			frameRef = searchframe(startHere + ".frames[" + i + "]")
		else if (self == eval(startHere + ".frames[" + i + "]"))
			return eval(startHere + ".frames[" + i + "]")

		if (frameRef)
			return frameRef
	}
	return frameRef
}

