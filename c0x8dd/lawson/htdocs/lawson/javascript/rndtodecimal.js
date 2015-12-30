//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/rndtodecimal.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
//Description
//THIS FUNCTION adds and rounds to number of decimals specified 
//arguments: Qty (Numeric)   
//           NbrDec - the number of decimals
//EndDescription

function roundToDecimal(Qty,NbrDec)
{
	var strQty  = "" + Qty
	var decimal = 0
	var zeros = '';

	if (strQty == ".0")
		Qty = 0

	if (Qty != 0) 
	{   
		for(var i=0;i<strQty.length;i++)
		{
			if(strQty.charAt(i)==".")
				continue;
			else if(strQty.charAt(i)=="0")
				zeros += "0"
			else
				break;
		}
		decimal = strQty * Math.pow(10,NbrDec);
		decimal = Math.round(decimal);
		
		strdecimal = "" + zeros + decimal;
		len = strdecimal.length;
		
		return strdecimal.substring(0, len - NbrDec) + "." + strdecimal.substring(len - NbrDec, len);
	}
	else
		return "0.00"       
}

