// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/esscommon80.js,v 1.11.2.40 2014/02/25 22:49:12 brentd Exp $
//***************************************************************
//*                                                             *
//*                           NOTICE                            *
//*                                                             *
//*   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
//*   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
//*   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
//*   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
//*   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
//*   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
//*   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
//*                                                             *
//*   (c) COPYRIGHT 2014 INFOR.  ALL RIGHTS RESERVED.           *
//*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//*                                                             *
//***************************************************************
var today = new Date();
var thisDay = today.getDate();
var thisMonth = today.getMonth() + 1;
var thisYear = today.getFullYear();
if (thisDay.toString().length == 1) thisDay = "0" + thisDay;
if (thisMonth.toString().length == 1) thisMonth = "0" + thisMonth;
var ymdtoday = "" + thisYear + thisMonth + thisDay;
var date_fld_name = "";
var fc = "";

// To take the double quotes in a string as part of the string.
function fixQuote(str) 
{
     return str.toString().replace(/\"/g,"&quot;");
}

//***************************************************************************************
//Takes a valid date in user's format and calendar type and returns Gregorian date formatted 
//with separator based on user's format.
//Example of use
//		formatDME("01/01/1999")
//***************************************************************************************
function formatDME(str)
{
	StoreDateRoutines();
	if (NonSpace(str))
		return getFormatedUserDate(str, "DME");
	else
		return str;
}

//***************************************************************************************
//Takes a valid date in Gregorian yyyymmdd format and returns the day of the week 
//***************************************************************************************
function dteDay(dte)
{
	var year = dte.substring(0,4);
	var month = dte.substring(4,6);
	var dy = parseFloat(dte.substring(6,8));
	var firstDay = new Date(year, month-1, dy, 8);
	var weekDay = firstDay.getDay();
	switch (weekDay)
	{
		case 0: weekDay = getSeaPhrase("SUN","ESS"); break;
		case 1: weekDay = getSeaPhrase("MON","ESS"); break;
		case 2: weekDay = getSeaPhrase("TUE","ESS"); break;
		case 3: weekDay = getSeaPhrase("WED","ESS"); break;
		case 4: weekDay = getSeaPhrase("THU","ESS"); break;
		case 5: weekDay = getSeaPhrase("FRI","ESS"); break;
		case 6: weekDay = getSeaPhrase("SAT","ESS"); break;
	}
	return weekDay;
}

//***************************************************************************************
// Validates a date within a textbox object and return an error if one is found. Optional
// argument for a window name for the alert box to be tied to.
// Example of use:
//		<input type="text" onchange="parent.ValidateDate(this)">
//***************************************************************************************
function ValidateDate(obj)
{
	StoreDateRoutines();	
	var dteParams = dateIsValid(obj.value);
	var dte = dteParams[0];
	var errMsg = dteParams[1];
	
	if (!NonSpace(dte) || (dte == false))
	{		
		if (!errMsg)
			errMsg = getSeaPhrase("CAL_1","ESS");
		var focusFnc = function(){try{obj.focus();obj.select()}catch(e){}};
		setRequiredField(obj, errMsg, focusFnc);
		return false;
	}
	else
	{
		obj.value = dte;
		return true;
	}
}

//***************************************************************************************
// Validates a date from a textbox object. It will change the value within the textbox
// automatically.
// Example of use:
//		<input type="text" onchange="parent.ValidDate(this)">
//***************************************************************************************
function ValidDate(obj)
{
	return ValidateDate(obj);
}

function ValidPhoneEntry(obj)
{
	// kaalin Remove ability to accept spaces and dots
	
	//var re = /^(\s)*[\d\(\)\-\.\+\s\/]+(\s)*$/;
	var re = /^\d{3}-\d{3}-\d{4}$/;
	return (obj.value.match(re))?true:false;
}

//***************************************************************************************
// Compare two dates in YYYYMMDD format and return the difference in days between them.
// A negative return value indicates that the second date is before the first date.
// Example of use:
//		getDteDifference("19990101", "19990131");
//***************************************************************************************
function getDteDifference(dteOne, dteTwo)
{
	StoreDateRoutines();
	if ((dteOne+'') == '')	dteOne = 0;
	if ((dteTwo+'') == '')	dteTwo = 0;
	dteOne = englishMonth[parseFloat(String(dteOne).substring(4,6))] + ' ' + String(Number(String(dteOne).substring(6,8))) + ', ' + String(dteOne).substring(0,4);
	dteTwo = englishMonth[parseFloat(String(dteTwo).substring(4,6))] + ' ' + String(Number(String(dteTwo).substring(6,8))) + ', ' + String(dteTwo).substring(0,4);
	var msecdte1 = parseFloat(Date.parse(dteOne));
	var msecdte2 = parseFloat(Date.parse(dteTwo));
	var msecdtediff = msecdte2 - msecdte1;
	return Math.round(msecdtediff / 86400000);  //conversion from milleseconds to days
}

//***************************************************************************************
// Takes a valid Gregorian date in user's format and returns yyyymmdd.
// Example of use:
// 		formjsDate("01/01/1999");
//***************************************************************************************
function formjsDate(value)
{
	StoreDateRoutines();
	if (NonSpace(value))
		return storeFormatedUserDate(value);
	else
		return value;
}

//***************************************************************************************
// Converts a string of "5-" to a number -5
// Example of use:
//		setValue("678-");
//***************************************************************************************
function setValue(num)
{
	var negative = false;
	if ((num+'').indexOf('-') != -1 && (num+'').indexOf('-') != 0)
		negative = true;
	num = parseFloat(num);
	num += '';
	if (negative)
		num = '-' + num;
	return num;
}

// *********************************************************************
// Strip any space characters from the ends of a string.
// *********************************************************************
function trimString(str) 
{
	if (typeof(str) == "undefined" || !str)
		return str;
	if (str.trim)
		return str.trim();
	else	
		return str.replace(/^\s+|\s+$/g, "");
}

function normalizeSpace(str) 
{
	if (typeof(str) == "undefined") 
		return "";
	return trimString(str);
}

//****************************************************************************************
// Returns a non zero value if string contains characters. Returns 0 if the string contains
// all spaces.
// Example of use:
//		NonSpace("    ");
//****************************************************************************************
function NonSpace(str)
{
	if (typeof(str) == "undefined" || !str)
		return 0;
	var result = str.match(/\S/g);
	return (result) ? (result.length) : 0;
}

//***************************************************************************************
//  Validates numeric percent fields. Optional fields for window
// name for the alert box to be tied to, and whether the value is signed
// (if signed, the sign is not included in the size parameter; by default,
// values are treated as positive numbers).  A percent sign is included
// in the value output following successful validation.
// Example of use:
//		<input type="text" onchange="parent.ValidatePercent(this,4,2,null,true)">
//***************************************************************************************
function ValidatePercent(obj, size, decimal, winname, signed)
{	
	var objValue = obj.value;
	var percentIndex = objValue.lastIndexOf("%");
	var fndPercent = (percentIndex != -1)? true : false;
	if (ValidPercent(obj,size,decimal,signed) == false)
	{
		if (fndPercent) obj.value += "%";	
		var focusFnc = function(){try{obj.focus();obj.select()}catch(e){}};
		setRequiredField(obj, getSeaPhrase("INVALID_NO","ESS"), focusFnc);
		return false;
	}
	else if (isNaN(parseFloat(obj.value)) == false && obj.value.lastIndexOf("%") == -1)	
		obj.value += "%";
	return true;
}

//***************************************************************************************
// Percent validator.  Used by function ValidatePercent.
//***************************************************************************************
function ValidPercent(obj, size, decimal, signed)
{
	var objValue = obj.value;
	var percentIndex = objValue.lastIndexOf("%");
	var fndPercent = (percentIndex != -1)? true : false;
	// remove all space following the number and including a trailing percent sign
	if (fndPercent)
	{
		for (var i=percentIndex-1; i>=0; i--)
		{
			if (objValue.charAt(i) != " ")
			{
				obj.value = objValue.substring(0,i+1);
				break;
			}
		}
	}
	var returnVal = ValidNumber(obj, size, decimal, signed);
	if (isNaN(parseFloat(obj.value)) == false && obj.value.lastIndexOf("%") == -1)
		obj.value += "%";
	return returnVal;
}

//***************************************************************************************
// Same as ValidateDate however this validates numeric fields. Optional field for window
// name to launch alert box from, and whether the value is signed (if signed, the sign 
// is not included in the size parameter); by default values are treated as positive.
// Example of use:
//		<input type="text" onchange="parent.ValidateNumber(this,4,2)">
//***************************************************************************************
function ValidateNumber(obj, size, decimal, winname, signed)
{	
	if (ValidNumber(obj,size,decimal,signed) == false)
	{
		var focusFnc = function(){try{obj.focus();obj.select()}catch(e){}};
		setRequiredField(obj, getSeaPhrase("INVALID_NO","ESS"), focusFnc);
		return false;
	}
	else
		return true;
}

//***************************************************************************************
// Number validator.  Used by function ValidateNumber.
//***************************************************************************************
function ValidNumber(obj, size, decimal, signed)
{
	var objValue = obj.value;
	var negative = false;
	objValue = normalizeSpace(objValue);
	if (objValue.length == 0)
		return true;
	if (typeof(signed) != "undefined" && signed)
	{
		// strip out a leading "+" or "-" sign for validation purposes
		for (var i=0; i<objValue.length; i++)
		{
			if (objValue.charAt(i) != " ")
			{
				if (objValue.charAt(i) == "+" || objValue.charAt(i) == "-")
				{
					if (objValue.charAt(i) == "-") negative = true;
					objValue = objValue.substring(i+1,objValue.length);
				}
				break
			}
		}
	}
	var decimalcount = 0;
	var nbrdec = 0;
	var zerocount = 0;
	for (var i=0; i<objValue.length; i++)
	{
		if (objValue.charAt(i) == ".")
			decimalcount++;
		else
		{
			if (objValue.charAt(i) == "0")
				zerocount++;
			if (objValue.charAt(i) < "0" || objValue.charAt(i) > "9")
			{
				return false;
				break;
			}
			else
			{
				if (decimalcount > 0)
					nbrdec++;
			}
		}
	}
	if (decimalcount > 1 && decimal != 0)
		return false;
	else if (decimalcount > 0 && decimal == 0)
		return false;
	else if (nbrdec > decimal)
		return false;
	else if ((decimalcount + zerocount) == objValue.length)
		return true;
	if (objValue.charAt(0) == ".")
		objValue = "0" + objValue;
	if (nbrdec < decimal)
	{
		if (decimalcount == 0)
			objValue += ".";
		for (var i=1; i<=(decimal-nbrdec); i++)
			objValue += "0";
	}
	if (objValue.length > size)
		return false;
	if (negative && isNaN(parseFloat(objValue)) == false)
		objValue = "-" + objValue;
	obj.value = objValue;
	return true;
}

//*************************************************************************************
// Formats a numeric amount with commas.  Optional parameter to display
// a "0" amount if the value is not a number or equivalent to zero (by default,
// the function will return an empty space in this case).
// Example of use:
// 		formatComma(roundToDecimal(Grants[i].GrantPrice,4));
//*************************************************************************************
function formatComma(NumString, showZero)
{
	if (typeof(NumString) == "undefined" || NumString == null)
		NumString = "";
	var TempStr = "";
	var MainBlock = "";
	var StringOut = "";
	var MinusLoc = 0;
	var DecimalLoc = 0;
	var StartLength = 0;
	var LoopNbr = 0;
	var StringLeft = 0;
	var EndHere = 0;
	// remove any existing comma and space characters
	NumString = NumString.toString();
	var Tmp = NumString.split(",");
	NumString = Tmp.join("");
	TempStr = NumString.replace(/ /g,"");
	if (NumString == "" || isNaN(parseFloat(TempStr)))
	{
		if (showZero)
			return "0";
		else
			return "";
	}
	MinusLoc = TempStr.indexOf("-");
	DecimalLoc = TempStr.indexOf(".");
	StartLength = TempStr.length;
	if (DecimalLoc >= 0) //DECIMAL FOUND
	{
		if (MinusLoc == 0)
			MainBlock = TempStr.substring(1,DecimalLoc) //LEADING MINUS
		else if (DecimalLoc > 0)
			MainBlock = TempStr.substring(0,DecimalLoc) //TRAILING OR NO MINUS
	}
	else //NO DECIMAL
	{
		if (MinusLoc == 0)
			MainBlock = TempStr.substring(1,StartLength) //LEADING MINUS
		else
		{
			if (MinusLoc > 0)
			   	MainBlock = TempStr.substring(0,MinusLoc) //TRAILING MINUS
			else
			   	MainBlock = TempStr //NO MINUS
		}
	}
	if (MainBlock != "")
		MainBlock = parseFloat(MainBlock).toString();
	LoopNbr = parseInt((MainBlock.length-1)/3,10);
	StringLeft = MainBlock.length % 3;
	for (var j=0; j<LoopNbr; j++)
	{
		EndHere = parseInt(MainBlock.length-(3*j),10);
		StringOut = "," + MainBlock.substring(EndHere-3,EndHere) + StringOut;
	}
	if (StringLeft == 1)
		StringOut = MainBlock.substring(0,1) + StringOut;
	else if (StringLeft == 2)
		StringOut = MainBlock.substring(0,2) + StringOut;
	else if (StringLeft == 0)
		StringOut = MainBlock.substring(0,3) + StringOut;
	if (StringOut == "") StringOut = "0";
	if (DecimalLoc >= 0)
	{
	   	if (MinusLoc == 0) //MINUS
	   		StringOut = "-" + StringOut + TempStr.substring(DecimalLoc,StartLength);
	   	else if (MinusLoc > 0)
	   		StringOut = "-" + StringOut + TempStr.substring(DecimalLoc,MinusLoc);
	   	else //TRAILING OR NO MINUS
			StringOut = StringOut + TempStr.substring(DecimalLoc,StartLength);
	}
	else if (MinusLoc >= 0) //NO DECIMAL
		StringOut = "-" + StringOut; //MINUS
	var TempStr2 = "";
	for (var k=0; k<StringOut.length; k++)
	{
		// this removes all leading commas and spaces
		if (!isNaN(parseInt(StringOut.charAt(k),10)) || StringOut.charAt(k)==".")
		{
			if (MinusLoc >= 0)
				TempStr2 = "-" + StringOut.substring(k,StringOut.length);
			else 
				TempStr2 = StringOut.substring(k,StringOut.length);
			break;
		}
	}
	if (TempStr2 == "" || isNaN(parseFloat(TempStr2)))
	{
		if (showZero)
			return "0";
		else
			return "";
	}
	return TempStr2;
}

//***************************************************************************************
// Open calendar. You must have dateselect.js included for this to work
//***************************************************************************************
function DateSelect(fldname, n)
{
	date_fld_name = fldname;
	if (n)
		pct_n = n;
	OpenDateSelect();
}

//***************************************************************************************
// use this to clear a frame. Use this to assign values to the document object. optional
// argument for a frame name. Default is "CONTROLITEM".
//***************************************************************************************
function ClearControlItem()
{
	var frameObj;
	if (arguments.length > 0)
		frameObj = window[arguments[1]];
	else
		frameObj = window["CONTROLITEM"];
	with (framObj.document)
	{
		open();
		write("<body></body>");
		close();
	}
}

//***************************************************************************************
// Function to compare a date range in YYYYMMDD format and returns a boolean
// that indicates whether the range falls before the current system date.
// Example of use:
//		IsCurrent("20000101", "20000401")
//***************************************************************************************
function IsCurrent(beg, end)
{
	if (beg.length == 0)
		beg = "00000000";
	if (end.length == 0)
		end = "00000000";
	if (beg > ymdtoday)
		return false;
	if ((end != "00000000") && (end < ymdtoday))
		return false;
	return true;
}

function GetCheckedValue(fldname, obj)
{
	var returnvalue = "";
	for (var i=0; i<obj.length; i++)
	{
		if (obj[i].checked == true)
		{
			returnvalue = obj[i].value;
			break;
		}
	}
	if (returnvalue != "")
		returnvalue = fldname + returnvalue;
	return returnvalue;
}

//***************************************************************************************
// Performs what setValue performs but instead of returning a number it returns a string.
//***************************************************************************************
function EvaluateBCD(str)
{ 
	if (!isNaN(parseFloat(str)))
	{
		str = "" + str;
		if (str.charAt(str.length - 1) != "-")
			return parseFloat(str);
		else
			return "-" + parseFloat(str);
	}
	else
	{
		return 0;
	}
}

//***************************************************************************************
// A function that does what roundtoDecimal could perform if you called it with NbrDec=2.
//***************************************************************************************
function roundToPennies(n)
{
	return roundToDecimal(n, 2);
}

//***************************************************************************************
// Rounds decimal numbers. Qty is the number to be rounded. NbrDec is the decimal place 
// to round to.
// Example of use:
//		roundToDecimal("+4.567898", 2); -> "4.57"
//***************************************************************************************
function roundToDecimal(Qty, NbrDec)
{
	var strQty  = "" + Qty;
	if (NbrDec == null)
		NbrDec = 0;
	if (strQty.charAt(strQty.length - 1) == "-" || strQty.charAt(strQty.length - 1) == "+")
	{
		var trailingSign = strQty.substring(strQty.length - 1, strQty.length);
		strQty = trailingSign + strQty.substring(0, strQty.length - 1);
	}
	strQty = strQty.replace(/,/g, "");
	var nbrQty = Number(strQty);
	if (isNaN(nbrQty))
		return strQty;
	else if (nbrQty == 0)
		return "";
	else
		return nbrQty.toFixed(NbrDec);
}

//***************************************************************************************
// Truncates decimal numbers. Qty is the number to be truncated. NbrDec is the decimal place  
// to round to.
// Example of use:
//		truncateToDecimal("+4.567898", 2); -> "4.56"
//***************************************************************************************
function truncateToDecimal(Qty, NbrDec)
{
	var strQty  = "" + Qty;
	var leadingSign='', trailingSign='';
	if ((strQty.charAt(0) == '-') || (strQty.charAt(0) == '+'))
	{
		leadingSign = strQty.substring(0,1);
		strQty = strQty.substring(1,strQty.length);
	}
	else if ((strQty.charAt(strQty.length-1) == '-') || (strQty.charAt(strQty.length-1) == '+'))
	{
		trailingSign = strQty.substring(strQty.length-1,strQty.length);
		strQty = strQty.substring(0,strQty.length-1);
	}
	var decimal = 0;
	var zeros = '';
	if (strQty == ".0")
		Qty = 0;
	if (Qty != 0)
	{
		for (var i=0; i<strQty.length; i++)
		{
			if (strQty.charAt(i) == ".")
				continue;
			else if (strQty.charAt(i) == "0")
				zeros += "0";
			else
				break;
		}
		decimal = strQty * Math.pow(10, NbrDec);
		decimal = Math.floor(decimal);
		strdecimal = "" + zeros + decimal;
		len = strdecimal.length;
		if (strdecimal.substring(0, len-NbrDec) == '')
			return (trailingSign + leadingSign + "0." + strdecimal.substring(len-NbrDec, len));
		else
			return trailingSign + leadingSign + strdecimal.substring(0, len-NbrDec) + "." + strdecimal.substring(len-NbrDec, len);
	}
	else
		return "";
}

//***************************************************************************************
// Rounds decimal numbers. 
// nbr:	the number to be rounded.
// decimals: the number of decimal places to round to	
// Example of use:
//		formatNumeric("10.2378", 2) --> returns 10.24
//***************************************************************************************
function formatNumeric(nbr, decimals) 
{
	nbr = nbr.toString();
	var lastChar = nbr.charAt(nbr.length - 1);
	if (lastChar == "-")
		nbr = "-" + nbr.substring(0, nbr.length - 1);
	else if (lastChar == "+")
		nbr = nbr.substring(0, nbr.length - 1);
	nbr = Number(nbr);
	decimals = Number(decimals);
	var resultNbr;
	if (nbr.toFixed)
		resultNbr = nbr.toFixed(decimals); 
	else 
	{
		nbr = nbr.toString();
		resultNbr = roundToDecimal(nbr, decimals);
		if (resultNbr == "") 
		{
			resultNbr = "0";
			if (decimals > 0) 
			{
				resultNbr += ".";
				for (var i=0; i<decimals; i++)
					resultNbr += "0";
			}	
		}
		if (decimals == 0)
			resultNbr = parseInt(resultNbr, 10);
	}
	return resultNbr.toString();
}

//***************************************************************************************
// Truncates decimal numbers.
// Parameters:
// nbr:	 	the number to be truncated.
// decimals:	the number of decimal places to truncate to
// Example of use
//		truncateNumeric("10.2378", 2) --> returns 10.23
//***************************************************************************************
function truncateNumeric(nbr, decimals) 
{
	nbr = nbr.toString();
	var lastChar = nbr.charAt(nbr.length - 1);
	if (lastChar == "-")
		nbr = "-" + nbr.substring(0, nbr.length - 1);
	else if (lastChar == "+")
		nbr = nbr.substring(0, nbr.length - 1);
	nbr = Number(nbr);
	decimals = Number(decimals);
	var resultNbr;
	nbr = nbr.toString();
	resultNbr = truncateToDecimal(nbr, decimals);
	if (resultNbr == "") 
	{
		resultNbr = "0";
		if (decimals > 0) 
		{
			resultNbr += ".";
			for (var i=0; i<decimals; i++)
				resultNbr += "0";
		}
	}
	if (decimals == 0)
		resultNbr = parseInt(resultNbr, 10);
	return resultNbr.toString();
}

//*******************************************************************************************
// Moves a sign on the tail end of a string to the front. Used to make an negative AGS value
// negative in Javascript.
// Example of use.
//		MoveTrailingSignToFront("50-");
//*******************************************************************************************
function MoveTrailingSignToFront(amt)
{
	var retAmt = amt;
	var sign = retAmt.charAt(retAmt.length-1);
	var j = 0;
	while (retAmt.charAt(j) == " ")
		j++;
	retAmt = retAmt.substring(j,retAmt.length);
	if (sign == "+" || sign == "-")
	{
		if (sign == "-")
			retAmt = "-"+retAmt.substring(0,retAmt.length-1);
		else
			retAmt = retAmt.substring(0,retAmt.length-1);
	}
	return retAmt;
}

function TimeRoutines(Style, Time)
{
	var Hours = parseInt(Time.substr(0,2), 10);
	var Minutes = parseInt(Time.substr(2,2), 10);
	var Seconds = parseInt(Time.substr(4,2), 10);
	var NonZuluHours = (!Hours) ? 12 : ((Hours > 12) ? (Hours - 12) : Hours);
	var AM = (Hours < 12) ? true : false;
	Seconds = (AM) ? Seconds + " AM" : Seconds + " PM";
	switch (Style)
	{
		default:
			if (String(Minutes).length == 1)
				Minutes = "0" + String(Minutes);
			if (String(Seconds).length == 1)
				Seconds = "0" + String(Seconds);
			return NonZuluHours + ":" + Minutes + ":" + Seconds;
	}
}

//*******************************************************************************************
// Use this function to determine if a year is a leap year.
//*******************************************************************************************
function isLeapYear(Year)
{
	Year = Number(Year);
	if ((Year % 4) != 0)
		return false;
   	else if ((Year % 400) == 0)
   		return true;
   	else if ((Year % 100) == 0)
   		return false;
   	else
   		return true;
}

function OnClickHandler()
{ 
	var el = null;
	var flag = true;
	try 
	{
		if (!window.event || !window.event.srcElement)
			return;
	  	el = window.event.srcElement;
	  	// do the while loop to find out if any of the parent elements are an A HREF.
	  	// this is necessary because in IE 4.x, you can receive events of any element including the <B> tag.   
	  	while (flag && el)   
	  	{
	  		if (el.tagName == "A")
	  		{ 
	  			flag = false;
	  			if (el.protocol == "javascript:")
	  			{
	  				execScript(el.href, "javascript");
	  				// a window.event.returnValue=false is performed so that the default action does not happen 
	  				window.event.returnValue = false; 
	  			}	
	  			if (el.protocol == "vbscript:")
	  			{ 
	  				execScript(el.pathname, "vbscript");
	  				window.event.returnValue = false; 
	  			}
	  		} 
	  		else 
	  			el = el.parentElement; 
	  	} 
  } catch(e) {}
} // end OnClickHandler()

document.onclick = OnClickHandler; // set the onclick handler for the document 

function getVarFromString(varName, str)
{
	var url = unescape(str);
	var ptr = url.indexOf(varName + "=");
	var ptr2;
	var val1 = "";
	if (ptr != -1)
	{
		var val1 = url.substring(ptr+varName.length+1, url.length);
		var ptr2;
		if ((ptr2 = val1.indexOf("&")) != -1)
		{
			if (ptr2 == -1)
				ptr2 = val1.length;
			val1 = val1.substring(0,ptr2);
		}
	}
	return val1;
}

function getFront(mainStr, srchStr)
{
	var fndOffset = mainStr.indexOf(srchStr);
	if (fndOffset == -1)
		return null;
	else
		return mainStr.substring(0, fndOffset);
}

function getEnd(mainStr, srchStr)
{
	var fndOffset = mainStr.indexOf(srchStr);
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

function deleteLeadingZeros(theStr)
{
	var leadingZeroesComplete = false;
	var z = '';
	for (x=0; x<theStr.length; x++)
	{
		if (theStr.substring(x, x+1) != '0')
			leadingZeroesComplete = true;
		if (theStr.substring(x, x+1) != '0' || leadingZeroesComplete)
			z += theStr.substring(x, x+1);	  
	}	
	return z;
}

function maskDigits(nbr, maskChar, visibleDigits, totalDigits)
{	
	maskChar = (typeof(maskChar) != "undefined") ? maskChar : "x";
	visibleDigits = (typeof(visibleDigits) != "undefined" && visibleDigits != null && !isNaN(Number(visibleDigits))) ? Number(visibleDigits) : 4;
	var len = nbr.length;
	if (typeof(totalDigits) != "undefined" && totalDigits != null && !isNaN(Number(totalDigits)) && Number(totalDigits) > len)
		len = Number(totalDigits);
	if (len < visibleDigits)
		return nbr;
	var maskLen = len - visibleDigits;
	var mask = "";
	for (var i=0; i<maskLen; i++)
		mask += maskChar;
	return mask + nbr.substring(nbr.length - visibleDigits, nbr.length);
}
