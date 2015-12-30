/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/strings.js,v 1.9.2.3.2.2 2014/01/10 14:29:59 brentd Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@10.00.05.00.12 Mon Mar 31 10:17:31 Central Daylight Time 2014 */
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
//
//	NOTE:
//		every method in this file has to do with string manipulation
//-----------------------------------------------------------------------------


//-----------------------------------------------------------------------------
function replaceString(inStr, fromStr, toStr)
{
	// make sure inStr is a string
	inStr += "";
	return inStr.split(fromStr).join(toStr);
}

//-----------------------------------------------------------------------------
// remove special characters from certain input fields.
function removeSpecChars(iStr)
{
	// make sure iStr is a string
	iStr += "";

	//	© = %A9
	//	® = %AE
	//	™ = %u2122
	// escape the string to check for control characters
	iStr = escape(iStr);

	// Registered trademark
	if (iStr.indexOf("%AE") != -1)
		iStr = replaceString(iStr,"%AE","");

	// copyright
	if (iStr.indexOf("%A9") != -1)
		iStr = replaceString(iStr,"%A9","");

	// trademark
	if (iStr.indexOf("%u2122") != -1)
		iStr = replaceString(iStr,"%u2122","");

	return unescape(iStr);
}

//-----------------------------------------------------------------------------
function isValueInString(myValue, myString)
{
	if (typeof(myValue) != "string" || typeof(myString) != "string")
		return false;
	if (myString.indexOf(myValue) != -1)
		return true;
	return false;
}

//-----------------------------------------------------------------------------
// use this method to extract | and || separated string parameters
function getParmFromString(varName, str)
{
	str += "|";
	var reStr = "(?:\\||)" + varName + "=(.*?)(?:\\||$)";
	var re = new RegExp(reStr, "gi");
	if (re.test(str))
		return RegExp.$1;
	else
		return "";
}

//-----------------------------------------------------------------------------
function formatURL(str)
{
	var re=/^(ftp\:\/\/|http(?:s)?\:\/\/|mailto\:\/\/)?(?:\w+\@)?(\w+\.)?\w+(?:\.\w+)+(?:\:\d+)?/
	mtch = re.test(str);
	if (mtch)
	{
		if (RegExp.$1 == "" && RegExp.$2 == "")
			str = "http://www." + str;
		else if(RegExp.$1 == "")
			str = "http://" + str;
	}
	return str;
}

//-----------------------------------------------------------------------------
function xmlEncodeString(str)
{
	var retVal = str.replace(/\&/g,"&amp;");
	retVal = retVal.replace(/\</g,"&lt;");
	retVal = retVal.replace(/\>/g,"&gt;");
	retVal = retVal.replace(/\"/g,"&quot;");
	return retVal;
}

//-----------------------------------------------------------------------------
function xmlDecodeString(str)
{
	var retVal = str.replace(/\&amp;/g,"&");
	retVal = retVal.replace(/\&lt;/g,"<");
	retVal = retVal.replace(/\&gt;/g,">");
	retVal = retVal.replace(/\&quot;/g,"\"");
	return retVal;
}

//------------------------------------------------------------------------------------------
// remove a key and its data from a string
function removeVarFromString(varName, strIn)
{
	var iBegin = strIn.indexOf("_" + varName);
	var iLenValue = -1;
	var strValue = "";
	var retStr = strIn;

	if (iBegin != -1)
	{
		strValue = strIn.substring(iBegin + varName.length + 2, strIn.length);
		if (strValue.indexOf("&") != -1)
		{
			iLenValue = strValue.indexOf("&");
			if (iLenValue == -1)
				iLenValue = strValue.length;
		}
		retStr = strIn.substring(0, iBegin - 1);
		if (iLenValue > -1)
			retStr += strIn.substring(iBegin + varName.length + 2 + iLenValue, strIn.length);
	}
	return retStr;
}

//-----------------------------------------------------------------------------
// use this method to extract ? and & separated string parameters
// (allows for or ignores presence of underscore (_) precending varName) 
function getVarFromString(varName, str)
{
	str += "&";
	var reStr = "(?:\\&|\\?|^)" + varName + "=(.*?)(?:\\&|$)";
	var re = new RegExp(reStr,"gi");
	if (re.test(str))
		return RegExp.$1;
	else if (varName.substr(0,1) != "_")
	{
		reStr = "(?:\\&|\\?|^)\\_" + varName + "=(.*?)(?:\\&|$)";
		re = new RegExp(reStr,"gi");
		if (re.test(str))
			return RegExp.$1;
	}
	return "";
}

//-----------------------------------------------------------------------------
function strStartsWith(str, startStr)
{
	if (!str || !startStr)
		return false;
	return (str.substring(0, startStr.length) == startStr) ? true : false;
}

//-----------------------------------------------------------------------------
function strEndsWith(str, endStr)
{
	if (!str || !endStr)
		return false;
	return (str.substring(str.length-endStr.length) == endStr) ? true : false;
}

//-----------------------------------------------------------------------------
function strTrim(str)
{
	if (!str)
		return ("");
	return str.replace(/^\s+|\s+$/g, "");
}

//-----------------------------------------------------------------------------
function strFillChar(str, max, dir, ch)
{
	var c = (ch ? ch.substr(0,1) : " ");
	var s = str;
	var n = (s ? s.length - max : max);
	for (var i=0; i<n; i++)
		s = (dir == "right" ? s + c : c + s);
	return s;
}

//-----------------------------------------------------------------------------
function strStripChar(str, ch)
{
	var c = (ch ? ch.substr(0,1) : " ");
	var s = str;
	var iPos = s.indexOf(c);
	while (iPos != -1)
	{
		s = s.substr(0,iPos) + s.substr(iPos+1);
		iPos = s.indexOf(c);
	}
	return s;
}

//-----------------------------------------------------------------------------
function strLimitLen(s,len)
{
	if (s.length > len)
		s = s.substring(0, len);
	return s
}

//-----------------------------------------------------------------------------
function deleteLeadingSpaces(theStr)
{
    theStr += "";
	var cntr = 0;
	var leadingSpacesComplete = false;
	var z = "";
	for (cntr=0; cntr<theStr.length; cntr++)
	{
		if (theStr.substring(cntr, cntr+1) != " ")
			leadingSpacesComplete = true;
		if (theStr.substring(cntr, cntr+1) != " " || leadingSpacesComplete)
			z += theStr.substring(cntr, cntr+1);
	}
	return z;
}

//-----------------------------------------------------------------------------
function deleteLeadingZeros(theStr)
{
	var leadingZeroesComplete = false;
	var z = "";
	for (var x=0; x<theStr.length; x++)
	{
		if (theStr.substring(x, x+1) != "0")
			leadingZeroesComplete = true;
		if (theStr.substring(x, x+1) != "0" || leadingZeroesComplete)
			z += theStr.substring(x, x+1);
	}
	return z;
}

//-----------------------------------------------------------------------------
function delTrailingZeros(theStr)
{
	var z = "";
	var trailingZeroesComplete = false;
	for (var x=theStr.length; x>0; x--)
	{
		if (theStr.substring(x-1, x) != "0")
			trailingZeroesComplete = true;
		if (theStr.substring(x-1, x) != "0" || trailingZeroesComplete)
			z = theStr.substring(x-1, x) + z;
	}
	return z;
}

//-----------------------------------------------------------------------------
function delTrailingSpaces(theStr)
{
	var z = "";
	var trailingSpacesComplete = false;
	for (var x=theStr.length; x>0; x--)
	{
		if (theStr.substring(x-1, x) != " ")
			trailingSpacesComplete = true;
		if (theStr.substring(x-1, x) != " " || trailingSpacesComplete)
			z = theStr.substring(x-1, x) + z;
	}
	return z;
}
//-----------------------------------------------------------------------------
function addCommas(NumString)
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

//-----------------------------------------------------------------------------
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


