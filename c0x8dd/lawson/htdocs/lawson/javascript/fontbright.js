//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// Description: This function determines if a white or black font color 
//              should be used with the corresponding background color.
// Arguments:   The Background color in hex triplets ex. 'c0c0c0'

function fontBright(thecolor)
{
var drd = 0
var dgr = 0
var dbl = 0
var brightness = 0

//	hrd = thecolor.substring(0,2)
//  hgr = thecolor.substring(2,4)
//  hbl = thecolor.substring(4,6)
    drd = parseInt(thecolor.substring(0,2),16)
    dgr = parseInt(thecolor.substring(2,4),16)
    dbl = parseInt(thecolor.substring(4,6),16)

	brightness = eval(0.212671 * drd + 0.715160 * dgr + 0.072169 * dbl)

	if (brightness >= 128)
		return '000000'
	else
		return 'FFFFFF'		
}
