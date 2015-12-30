//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/formatcomma.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
//Description
//THIS FUNCTION STRIPS LEADING SPACES AND ADDS COMMAS TO A
//NUMERIC STRING. NEGATIVE SIGNS CAN BE EITHER LEADING OR
//TRAILING.
//EndDescription

function formatComma(NumString)
{
var tempStr = ""
var minusLoc = 0
var decimalLoc = 0
var startLength = 0
var mainBlock = ""
var loopNbr = 0
var stringOut = ''
var stringLeft = 0
var endHere = 0

     tempStr = NumString.split(" ")
	 tempStr = tempStr.join('')

     minusLoc = tempStr.indexOf("-")
     decimalLoc = tempStr.indexOf(".")
	 startLength = tempStr.length

	 
     if (decimalLoc > 0) 
	    {
		 if (minusLoc == 0)
		    mainBlock = tempStr.substring(1,decimalLoc)  	//LEADING MINUS 
	 	 else
		    mainBlock = tempStr.substring(0,decimalLoc)		//TRAILING OR NO MINUS
		}
	else    												//NO DECIMAL
	   {
		if (minusLoc == 0)
			mainBlock = tempStr.substring(1,startLength)  	//LEADING MINUS
		else
		   {
		    if (minusLoc > 0)
			   mainBlock = tempStr.substring(0,startLength-1) //TRAILING MINUS
			else
			   mainBlock = tempStr      					//NO MINUS
			}
		}	 
		
    loopNbr = parseInt((mainBlock.length-1) / 3)
    stringLeft = mainBlock.length % 3	
	
    for (iix=0;iix<loopNbr;iix++)
       {
		endHere = parseInt(mainBlock.length-(3*iix))
		stringOut = ',' + mainBlock.substring(endHere-3,endHere) + stringOut
	   }	

    if (stringLeft == 1)
	   stringOut = mainBlock.substring(0,1) + stringOut
    if (stringLeft == 2)
	   stringOut = mainBlock.substring(0,2) + stringOut
    if (stringLeft == 0)
	   stringOut = mainBlock.substring(0,3) + stringOut

    if (decimalLoc > 0) 
	  {
	   if (minusLoc == 0)        	//LEADING MINUS 
	     stringOut = '-' + stringOut + tempStr.substring(decimalLoc,startLength)
	   else							//TRAILING OR NO MINUS
		   stringOut = stringOut + tempStr.substring(decimalLoc,startLength)
	  }
	else							//NO DECIMAL
	  {
	   if (minusLoc == 0)
	     stringOut = '-' + stringOut 	//LEADING MINUS
	   else
		 {
	     if (minusLoc > 0)
	       stringOut = stringOut + '-' 	 //TRAILING MINUS
		  }
	   }	 
				
    return stringOut   
}

