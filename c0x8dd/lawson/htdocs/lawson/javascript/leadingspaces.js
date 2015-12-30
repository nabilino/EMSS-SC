//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/leadingspaces.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
//Description
//THIS FUNCTION gets rid of the leading spaces in a string and returns the new string
//arguments: string
//EndDescription

function deleteLeadingSpaces(theStr)
{
var cntr=0

    theStr += ''

	//alert('theStr=' + theStr + '    The String Length=' + theStr)
	
	var leadingSpacesComplete=false
	var z = ''
	for (cntr=0;cntr<theStr.length;cntr++)
	{
	if (theStr.substring(cntr,cntr+1) != ' ')
		leadingSpacesComplete=true

	if (theStr.substring(cntr,cntr+1) != ' ' || leadingSpacesComplete)
		z+=theStr.substring(cntr,cntr+1)	  
	}	
	return z
}

function deleteLeadingZeros(theStr)
{
	//alert('theStr=' + theStr + '    The String Length=' + theStr)
	
	var leadingZeroesComplete=false
	var z = ''
	for (x=0;x<theStr.length;x++)
	{
	if (theStr.substring(x,x+1) != '0')
		leadingZeroesComplete=true

	if (theStr.substring(x,x+1) != '0' || leadingZeroesComplete)
		z+=theStr.substring(x,x+1)	  
	}	
	return z
}

// Function will remove trailing zeroes 

function delTrailingZeros(theStr)
{
	var z = ''
	var trailingZeroesComplete=false
	for (var x=theStr.length; x>0;x--)
	{
	if (theStr.substring(x-1,x) != '0')
		trailingZeroesComplete=true

	if (theStr.substring(x-1,x) != '0' || trailingZeroesComplete)
		z = theStr.substring(x-1,x)	+ z  
	}	
	return z
}

function delTrailingSpaces(theStr)
{
	var z = ''
	var trailingSpacesComplete=false
	for (var x=theStr.length; x>0;x--)
	{
	if (theStr.substring(x-1,x) != ' ')
		trailingSpacesComplete=true

	if (theStr.substring(x-1,x) != ' ' || trailingSpacesComplete)
		z = theStr.substring(x-1,x)	+ z  
	}	
	return z
}

