// Version: 8-)@(#)@(201111) 09.00.01.06.00
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/esscommon80.js,v 1.11.2.24 2010/04/13 03:09:20 juanms Exp $
var today = new Date();
var thisDay = today.getDate();
var thisMonth = today.getMonth() + 1;
var thisYear = today.getFullYear();

if (thisDay.toString().length==1) thisDay="0"+thisDay;
if (thisMonth.toString().length==1) thisMonth="0"+thisMonth;

var ymdtoday = "" + thisYear + thisMonth + thisDay;
var DateWin 		= ""
var date_fld_name 	= ""
var supflag 		= false
var fc 			= ""
var sub_emp_name 	= ""
var phonenbr 		= ""
var TipsWindow;

function ChooseSkin()
{
	switch(arguments[0])
	{
		case "antartica": return "/lawson/xhrnet/skins/antartica.css";
		case "cheesecake": return "/lawson/xhrnet/skins/cheesecake.css";
		case "desert": return "/lawson/xhrnet/skins/desert.css";
		case "honeydew": return "/lawson/xhrnet/skins/honeydew.css";
		case "lifeevents": return "/lawson/xhrnet/skins/lifeevents.css";
		default: return "/lawson/xhrnet/skins/default.css";
	}
}
//PT 131896
// To take the double quotes in a string as part of the string.
function fixQuote(str) 
{
     return str.toString().replace(/\"/g,"&quot;");
}
//PT 131896
function formatDME(str)
{
	StoreDateRoutines()
	if(NonSpace(str))
		return getFormatedUserDate(str, "DME");
	else
		return str;
}

//PT 144679

// extracts the day part of the date 
function dteDay(dte)
{
	var year=dte.substring(0,4)
	var month=dte.substring(4,6)
	var dy=parseFloat(dte.substring(6,8))
	var firstDay = new Date(year, month-1, dy, 8);
	var weekDay = firstDay.getDay();
	
	switch(weekDay)
	{
		case 0: weekDay = getSeaPhrase("SUN","ESS");break;
		case 1: weekDay = getSeaPhrase("MON","ESS");break;
		case 2: weekDay = getSeaPhrase("TUE","ESS");break;
		case 3: weekDay = getSeaPhrase("WED","ESS");break;
		case 4: weekDay = getSeaPhrase("THU","ESS");break;
		case 5: weekDay = getSeaPhrase("FRI","ESS");break;
		case 6: weekDay = getSeaPhrase("SAT","ESS");break;
	}
	return weekDay;
	
}
//PT 144679

//***************************************************************************************
// AGS date checker. If date is returned 00000000 then return blank.
// Example of use:
//		FormatDate("19990808")
//***************************************************************************************
function FormatDate(date)
{
	StoreDateRoutines()
	date = storeFormatedUserDate(date);

	return  (date.length == 0 || date == "00000000") ? "" : date;
}

//***************************************************************************************
// Validates a date within a textbox object and return an error if one is found. Optional
// argument for a window name for the alert box to be tied to.
// Example of use:
//		<input type=text onChange="parent.ValidateDate(this)">
//***************************************************************************************
function ValidateDate(obj)
{
	StoreDateRoutines()	
	var dte = dateIsValid(obj.value);

	if(!NonSpace(dte) || (dte == false))
	{
		try
		{
			obj.focus()
			obj.select()
		}
		catch(e) {}
		return false
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
//		<input type=text onChange="parent.ValidDate(this)">
//***************************************************************************************
function ValidDate(obj)
{
	return ValidateDate(obj);
}

function ValidPhoneEntry(obj)
{
	var re = /^(\s)*[\d\(\)\-\.\+\s\/]+(\s)*$/;
	return (obj.value.match(re))?true:false;
}

//***************************************************************************************
// Compares two dates in YYYYMMDD format and return the difference
// in days between them. A negative return value indicates
// that the second date is before the first date
// Example of use:
//		getDteDifference("19990101", "19990131")
//***************************************************************************************
function getDteDifference(dteOne,dteTwo)
{
	StoreDateRoutines()

	if(dteOne+''=='')	dteOne=0
	if(dteTwo+''=='')	dteTwo=0

	dteOne = englishMonth[parseFloat(String(dteOne).substring(4,6))] + ' ' + String(Number(String(dteOne).substring(6,8))) + ', ' + String(dteOne).substring(0,4);
	dteTwo = englishMonth[parseFloat(String(dteTwo).substring(4,6))] + ' ' + String(Number(String(dteTwo).substring(6,8))) + ', ' + String(dteTwo).substring(0,4);

	var msecdte1=parseFloat(Date.parse(dteOne))
	var msecdte2=parseFloat(Date.parse(dteTwo))
	var msecdtediff=msecdte2-msecdte1

	return Math.round(msecdtediff / 86400000)  //conversion from milleseconds to days
}

//***************************************************************************************
// takes a valid date in most formats and returns yyyymmdd. This does not work if the arg
// is already in the form of yyyymmdd!
// Example of use
// 		formjsDate("01/01/1999")
//***************************************************************************************
function formjsDate(value)
{
	StoreDateRoutines()

	if(NonSpace(value))
		return storeFormatedUserDate(value);
	else
		return value;
}

//***************************************************************************************
// Converts a string of "5-" to a number -5
// Example of use
//		setValue("678-")
//***************************************************************************************
function setValue(num)
{
	var negative=false
	if((num+'').indexOf('-')!=-1 && (num+'').indexOf('-')!=0)
		negative=true
	num=parseFloat(num)
	num+=''
	if(negative)
		num='-'+num
	parseFloat(num)
	return num
}

// *********************************************************************
// Strip any space characters from the ends of a string.
// Parameters:
// str:		string to process
// *********************************************************************
function normalizeSpace(str) {

	if (typeof(str) == "undefined") return "";

	var newStr = "";
	var i = 0;
	var j = str.toString().length-1;
	str = str.toString();
	while (i<str.length && str.charAt(i)==" ") {
		i++;
	}
	while (j>=0 && str.charAt(j)==" ") {
		j--;
	}
	newStr = str.substring(i,j+1);
	return newStr;
}

//***************************************************************************************
// WindowName is a String containing an alternate name for your window. This parameter is
//	optional. _tipsWin is the default tips window name.
// Example of use:
//		openTipsWin("/lawson/tips.htm", "TipsWindow")
//***************************************************************************************
function openTipsWin(URLSTRING)
{
	if(typeof(TipsWindow)!='undefined' && !TipsWindow.closed)
		TipsWindow.focus()
	else
		TipsWindow = 	window.open(URLSTRING,"Tips","scrollbars=yes,toolbar=no,status=no,resizable=yes,width=400,height=400")
}

//****************************************************************************************
// Returns a non zero value if string contains characters. Returns 0 if the string contains
// all spaces.
// Example of use:
//		NonSpace("    ")
//****************************************************************************************
function NonSpace(str)
{
	if(typeof(str)=='undefined' || !str)
		return 0;
	var n = 0
	for (var i=0;i<str.length;i++)
	{
		if (str.charAt(i) != " ")
			n++
	}
	return n
}

//***************************************************************************************
// Converts an text box's value from lower to uppercase. obj is the textbox object.
// Example of use:
//		<input type=text onChange="parent.UpperCase(this)">
//***************************************************************************************
function UpperCase(obj)
{
	obj.value = obj.value.toUpperCase()
}

//***************************************************************************************
// Display the alert box cleanly by removing all messaging windows. optional second
// argument for a window to have this alert box mapped to.
// Example of use:
//		MsgBox("Transaction complete!", "ProgramWindow")
//***************************************************************************************
function MsgBox(msg)
{
	removeWaitAlert()
	if(arguments.length>1)
	{
		if(arguments.length>2 && arguments[2]=="confirm")
		{
			var funcToCall = (arguments.length > 3 && typeof(arguments[3]) == "function") ? arguments[3] : null;
			
			if(typeof(eval(arguments[1]))!="undefined")
			{
				var winObj = eval(arguments[1]);
				winObj.focus();
				return winObj.seaConfirm(msg, "", funcToCall)
			}
			else
			{
				self.focus();
				return seaConfirm(msg, "", funcToCall)
			}
		}
		else
		{
			if(typeof(eval(arguments[1]))!="undefined")
			{
				var winObj = eval(arguments[1]);
				winObj.focus();
				winObj.seaAlert(msg)
			}
			else
			{
				self.focus();
				seaAlert(msg)
			}
		}
	}
	else
	{
		self.focus();
		seaAlert(msg)
	}
}

//***************************************************************************************
// ???
//***************************************************************************************
function ValidTime(obj,size)
{
	var val = obj.value
	if (NonSpace(val) == 0)
		return true
	if (val.length == 0)
		return true
	var str = val.split(":")
	if (str.length > 3)
		return false
	for (var i = 0;i < str.length;i++)
	{
		if (str[i].length > 2)
		{
			return false
			break
		}
		else if (str[i].length == 1)
			str[i] = "0" + str[i]
		else if (str[i].length == 0)
			str[i] = "00"
	}
	var nstr = str.join(":")
	if (nstr.length == 1)
		nstr += "0:00:00"
	else if (nstr.length == 2)
		nstr += ":00:00"
	else if (nstr.length == 3)
		nstr += "00:00"
	else if (nstr.length == 4)
		nstr += "0:00"
	else if (nstr.length == 5)
		nstr += ":00"
	else if (nstr.length == 6)
		nstr += "00"
	else if (nstr.length == 7)
		nstr += "0"
	if (size == 4)
		val = nstr.substring(0,5)
	else
		val = nstr
	var str = val.split(":")
	var h = Number(str[0])
	var m = Number(str[1])
	var s = 0
	if (str[2])
		s = Number(str[2])
	if (h > 24)
		return false
	if (m > 59)
		return false
	if (s > 59)
		return false
	obj.value = val
	return true
}

//***************************************************************************************
//  Validates numeric percent fields. Optional fields for window
// name for the alert box to be tied to, and whether the value is signed
// (if signed, the sign is not included in the size parameter; by default,
// values are treated as positive numbers).  A percent sign is included
// in the value output following successful validation.
// Example of use:
//		<input type=text onChange="parent.ValidatePercent(this,4,2,null,true)">
//***************************************************************************************
function ValidatePercent(obj,size,decimal,winname,signed)
{
	var objValue = obj.value
	var percentIndex = objValue.lastIndexOf("%")
	var fndPercent = (percentIndex != -1)? true : false;

	if (ValidPercent(obj,size,decimal,signed) == false)
	{
		if(typeof(winname) != "undefined" && winname)
			MsgBox("Invalid Number", winname)
		else
			MsgBox("Invalid Number")

		if (fndPercent) obj.value += "%"
		obj.focus()
		obj.select()
	}
	else if (isNaN(parseFloat(obj.value)) == false && obj.value.lastIndexOf("%") == -1)
		obj.value += "%"
}

//***************************************************************************************
// Boolean percent checker.  Used by function ValidatePercent.
//***************************************************************************************
function ValidPercent(obj,size,decimal,signed)
{
	var objValue = obj.value
	var percentIndex = objValue.lastIndexOf("%")
	var fndPercent = (percentIndex != -1)? true : false;

	// remove all space following the number and including a trailing percent sign
	if (fndPercent)
	{
		for (var i=percentIndex-1; i>=0; i--)
		{
			if (objValue.charAt(i) != " ")
			{
				obj.value = objValue.substring(0,i+1)
				break
			}
		}
	}

	var returnVal = ValidNumber(obj,size,decimal,signed);
	if (isNaN(parseFloat(obj.value)) == false && obj.value.lastIndexOf("%") == -1)
		obj.value += "%"

	return returnVal;
}

//***************************************************************************************
// Same as validateDate however this validates numeric fields. Optional field for window
// name for the alert box to be tied to, and whether the value is signed.
// (if signed, the sign is not included in the size parameter; by default,
// values are treated as positive numbers).
// Example of use:
//		<input type=text onChange="parent.ValidateNumber(this,4,2)">
//***************************************************************************************
function ValidateNumber(obj,size,decimal,winname,signed)
{
	if (ValidNumber(obj,size,decimal,signed) == false)
	{
		if (typeof(winname) != "undefined" && winname)
			MsgBox("Invalid Number", winname)
		else
			MsgBox("Invalid Number")

		obj.focus()
		obj.select()
	}
}

//***************************************************************************************
// Boolean number checker.  Used by function ValidateNumber.
//***************************************************************************************
function ValidNumber(obj,size,decimal,signed)
{
	var objValue = obj.value
	var negative = false

	objValue = normalizeSpace(objValue);

	if (objValue.length == 0)
		return true
	if (typeof(signed) != "undefined" && signed)
	{
		// strip out a leading "+" or "-" sign for validation purposes
		for (var i=0; i<objValue.length; i++)
		{
			if (objValue.charAt(i) != " ")
			{
				if (objValue.charAt(i) == "+" || objValue.charAt(i) == "-")
				{
					if (objValue.charAt(i) == "-") negative = true
					objValue = objValue.substring(i+1,objValue.length);
				}
				break
			}
		}
	}
	//if (isNaN(parseFloat(objValue)) == false)
	//	objValue = String(parseFloat(objValue));

	var decimalcount = 0
	var nbrdec = 0
	var zerocount = 0
	for (var i=0; i<objValue.length; i++)
	{
		if (objValue.charAt(i) == ".")
			decimalcount++
		else
		{
			if (objValue.charAt(i) == "0")
				zerocount++
			if (objValue.charAt(i) < "0" || objValue.charAt(i) > "9")
			{
				return false
				break
			}
			else
			{
				if (decimalcount > 0)
					nbrdec++
			}
		}
	}
	if (decimalcount > 1 && decimal != 0)
		return false
	if (decimalcount > 0 && decimal == 0)
		return false
	if (nbrdec > decimal)
		return false
	if (decimalcount + zerocount == objValue.length)
		return true
	if (objValue.charAt(0) == ".")
		objValue = "0" + objValue
	if (nbrdec < decimal)
	{
		if (decimalcount == 0)
			objValue += "."
		for (var i=1; i<=decimal - nbrdec; i++)
			objValue += "0"
	}
	if (objValue.length > size)
		return false
	if (negative && isNaN(parseFloat(objValue)) == false)
		objValue = "-" + objValue
	obj.value = objValue

	return true
}

//***************************************************************************************
// Replace all spaces in a string with a specified character.  If no replacement
// character is passed in, spaces are replaced with plus signs ("+").
//***************************************************************************************
function replaceSpaces(str,chr)
{
	var nstr = ""
	chr = (typeof(chr)=="undefined" || chr==null)?"+":chr;

	for (var i=0;i < str.length;i++)
	{
		if (str.charAt(i) == " ")
			nstr += chr;
		else
			nstr += str.charAt(i)
	}
	return nstr
}

//*************************************************************************************
// Formats a numeric amount with commas.  Optional parameter to display
// a "0" amount if the value is not a number or equivalent to zero (by default,
// the function will return an empty space in this case).
// Uses function replaceSpaces.
// Example of use:
// formatComma(roundToDecimal(Grants[i].GrantPrice,4))
//*************************************************************************************
function formatComma(NumString,showZero)
{
	if (typeof(NumString)=="undefined" || NumString==null)
		NumString = ""

	var TempStr = ""
	var MainBlock = ""
	var StringOut = ""
	var MinusLoc = 0
	var DecimalLoc = 0
	var StartLength = 0
	var LoopNbr = 0
	var StringLeft = 0
	var EndHere = 0

	// remove any existing comma and space characters
	NumString = NumString.toString()
	var Tmp = NumString.split(",")
	NumString = Tmp.join("")
	TempStr = replaceSpaces(NumString,"")

	if (NumString == "" || isNaN(parseFloat(TempStr)))
	{
		if (showZero)
			return "0"
		else
			return ""
	}

    	MinusLoc = TempStr.indexOf("-")
    	DecimalLoc = TempStr.indexOf(".")
	StartLength = TempStr.length

    	if (DecimalLoc >= 0) 						//DECIMAL FOUND
	{
		if (MinusLoc == 0)
			MainBlock = TempStr.substring(1,DecimalLoc)  	//LEADING MINUS
	 	 else if (DecimalLoc > 0)
		    	MainBlock = TempStr.substring(0,DecimalLoc)	//TRAILING OR NO MINUS
	}
	else    								//NO DECIMAL
	{
		if (MinusLoc == 0)
			MainBlock = TempStr.substring(1,StartLength)  	//LEADING MINUS
		else
		{
		    	if (MinusLoc > 0)
			   	MainBlock = TempStr.substring(0,MinusLoc) 	//TRAILING MINUS
			else
			   	MainBlock = TempStr      			//NO MINUS
		}
	}
	if (MainBlock != "")
		MainBlock = parseFloat(MainBlock).toString()

    	LoopNbr = parseInt((MainBlock.length-1)/3,10)
    	StringLeft = MainBlock.length % 3

    	for (var j=0; j<LoopNbr; j++)
    	{
		EndHere = parseInt(MainBlock.length-(3*j),10)
		StringOut = "," + MainBlock.substring(EndHere-3,EndHere) + StringOut
	}

    	if (StringLeft == 1)
	   	StringOut = MainBlock.substring(0,1) + StringOut
    	else if (StringLeft == 2)
	   	StringOut = MainBlock.substring(0,2) + StringOut
    	else if (StringLeft == 0)
	   	StringOut = MainBlock.substring(0,3) + StringOut

	if (StringOut == "") StringOut = "0"

    	if (DecimalLoc >= 0)
	{
	   	if (MinusLoc == 0)        	//MINUS
	   		StringOut = "-" + StringOut + TempStr.substring(DecimalLoc,StartLength)
	   	else if (MinusLoc > 0)
	   		StringOut = "-" + StringOut + TempStr.substring(DecimalLoc,MinusLoc)
	   	else			//TRAILING OR NO MINUS
			StringOut = StringOut + TempStr.substring(DecimalLoc,StartLength)
	}
	else if (MinusLoc >= 0)			//NO DECIMAL
	     	StringOut = "-" + StringOut 	//MINUS

	var TempStr2 = ""
	for(var k=0;k<StringOut.length;k++)
	{																		// on some machines/browsers(?) a leading comma is placed;
		// this loop will remove all leading commas and spaces
		if(!isNaN(parseInt(StringOut.charAt(k),10)) || StringOut.charAt(k)==".")
		{
			if (MinusLoc >= 0)
				TempStr2 = "-" + StringOut.substring(k,StringOut.length)
			else TempStr2 = StringOut.substring(k,StringOut.length)
			break
		}
	}

	if (TempStr2 == "" || isNaN(parseFloat(TempStr2)))
	{
		if (showZero)
			return "0"
		else
			return ""
	}

	return TempStr2
}

function NewDateSelect(fldname, n)
{
	date_fld_name = fldname

	if (n)
		pct_n = n

	CalendarWindow = window.open("/lawson/xhrnet/JobRequisitions/Lib/SEACalendar.htm", "CALENDAR", "height=250,width=220,scrollbars,resizable,toolbar=no,status=no");
}

//***************************************************************************************
// Open calendar. You must have dateselect.js included for this to work
//***************************************************************************************
function DateSelect(fldname,n)
{
	date_fld_name = fldname
	if (n)
		pct_n = n

	OpenDateSelect()
}

//***************************************************************************************
// use this to clear a frame. Use this to assign values to the document object. optional
// argument for a frame name. Default is "CONTROLITEM".
//***************************************************************************************
function ClearControlItem()
{
	var frameNm;
	if(arguments.length>0)
		frameNm = arguments[1];
	else
		frameNm = "CONTROLITEM";

	eval('self.'+frameNm+'.document').open();
	eval('self.'+frameNm+'.document').write("<body link=maroon vlink=maroon bgcolor=#cccccc>");
	eval('self.'+frameNm+'.document').close();
}

//***************************************************************************************
// sort myArray centered on property. length is length of myArray. direction is either
// ">" or ascending, or "<" for descending. SortByNumber will convert the strings to numbers
// so values like 1, 10, 11, 2 will sort properly.
// Example of use
//		sortObjArray(TimeCard, "Order", TimeCard.Form.length, ">", true)
//***************************************************************************************
function sortObjArray(myarray,property,length,direction,SortByNumber)
{
	var i=0, j=0, hold;
	var direction = (typeof(direction)!="undefined")?direction:'>';

	for(i=0;i<length;i++)
		for(j=length-1;j>i;j--)
		{
			if(typeof(eval(myarray[j-1])) == "undefined") //added for arrays of non zero starting points
				break;										//[8/18/00]

			obj1 = escape(EvalProperty(eval("myarray[j-1]." + property)))
			obj2 = escape(EvalProperty(eval("myarray[j]." + property)))
			if(typeof(SortByNumber)!="undefined" && SortByNumber)
			{
				if(!isNaN(parseFloat(unescape(obj1)))&&!isNaN(parseFloat(unescape(obj2))))
				{
					obj1 = parseFloat(unescape(obj1))
					obj2 = parseFloat(unescape(obj2))
				}
			}
			if((direction=='>' && obj1 > obj2) || (direction=='<' && obj1 < obj2))
			{
				hold = myarray[j-1]
				myarray[j-1]=myarray[j]
				myarray[j]=hold
			}
		}
}

function EvalProperty(str)
{
	str = "" + str
	var nstr = str
	if (str.length == 10)
	{
		if (str.charAt(2) == "/" && str.charAt(5) == "/")
			nstr = str.substring(6,10) + str.substring(0,2) + str.substring(3,5)
	}
	return nstr
}

//***************************************************************************************
// Function to compare a date range in YYYYMMDD format and returns a boolean
// that indicates whether the range falls before the current system date.
// Example of use:
//		IsCurrent("20000101", "20000401")
//***************************************************************************************
function IsCurrent(beg,end)
{
	if (beg.length == 0)
		beg = "00000000"

	if (end.length == 0)
		end = "00000000"

	if (beg > ymdtoday)
		return false
	if (end != "00000000" && end < ymdtoday)
		return false

	return true
}

function GetCheckedValue(fldname,obj)
{
	var returnvalue = ""
	for (var i = 0;i < obj.length;i++)
	{
		if (obj[i].checked == true)
		{
			returnvalue = obj[i].value
			break
		}
	}
	if (returnvalue != "")
		returnvalue = fldname + returnvalue
	return returnvalue
}


function FmtSupName(obj)
{
	retval = ""
	if (obj.employee_last_name != "**")
	{
		retval += "<br>"
		if (obj.employee_nick_name != "")
			retval += obj.employee_nick_name
		else
			retval += obj.employee_first_name
		retval += " " + obj.employee_last_name
	}
	return retval
}

//***************************************************************************************
// Performs what setValue performs but instead of returning a number it returns a string.
//***************************************************************************************
function EvaluateBCD(str)
{ 
	//PT 157772
	if(!isNaN(parseFloat(str)))
	{
		
	str = "" + str
	if (str.charAt(str.length - 1) != "-")
		return parseFloat(str)
	else
		return "-" + parseFloat(str)
	}
	else
		{
	return 0
}
	
}

//***************************************************************************************
// A function that performs exactly what roundtoDecimal could perform if you called it
// with NbrDec=2.
//***************************************************************************************
function roundToPennies(n)
{
	return roundToDecimal(n, 2);
}

//***************************************************************************************
// Formats a str that represents a pseudo phone number and converts it to represent a
// standard phone number.
// Example of Use
//		FormatPhoneNumber("16125550000")
//***************************************************************************************
function FormatPhoneNumber(str)
{
	var phnum=""

	if (ValidPhoneNbr(str))
	{
		for (var i=0;i<phonenbr.length;i++)
		{
			if (phonenbr.length ==10)
			{
				if (i == 0)
					phnum = "("+phonenbr

				if (i == 2)
					phnum = phnum.substring(0,4) + ")" + phnum.substring(4,11)

				if (i == 5)
					phnum = phnum.substring(0,8) + "-" + phnum.substring(8,12)
			}

			if (phonenbr.length ==7)
			{
				if (i == 2)
					phnum = phonenbr.substring(0,3) + "-" + phonenbr.substring(3,8)
			}
		}
		return phnum
	}
	else
		return str
}

//***************************************************************************************
// Validates a given string to see if could represent a phone number
// Example of Use
//		ValidPhoneNbr("16125550000")
//***************************************************************************************
function ValidPhoneNbr(str)
{

  var num = ""
  for (var i=0;i < str.length;i++)
  {
	 if ((str.charAt(i) == '9') || (str.charAt(i) == '8')||
	     (str.charAt(i) == '7') || (str.charAt(i) == '6')||
	     (str.charAt(i) == '5') || (str.charAt(i) == '4')||
	     (str.charAt(i) == '3') || (str.charAt(i) == '2')||
	     (str.charAt(i) == '1') || (str.charAt(i) == '0'))
	  	num += str.charAt(i)

	}

	phonenbr = num

	if ((num.length !=7) && (num.length !=10))
	    return false
	else
	    return true

}

function agsTime(value,size)
{
	var retval = ""
	if (value.length == 0)
		retval = "0000"
	else if (value.length == 1)
		retval = "000"
	else if (value.length == 2)
		retval = "00"
	else if (value.length == 3)
		retval = "0"
	for (var i = 0;i < value.length;i++)
	{
		if (value.charAt(i) >= "0" && value.charAt(i) <= "9")
			retval += value.charAt(i)
	}
	if (size == 5)
		retval = retval.substring(0,4)
	return retval
}

//***************************************************************************************
// rounds decimal numbers. Qty is the number to be rounded. NbrDec contains a value to
// what decimal point.
// Example of use
//		roundToDecimal("+4.567898", 2)
//***************************************************************************************
function roundToDecimal(Qty, NbrDec)
{
	var strQty  = "" + Qty;

	if (NbrDec == null)
	{
		NbrDec = 0;
	}
	
	if (strQty.charAt(strQty.length - 1) == "-" || strQty.charAt(strQty.length - 1) == "+")
	{
		var trailingSign = strQty.substring(strQty.length - 1, strQty.length);
		strQty = trailingSign + strQty.substring(0, strQty.length - 1);
	}
	
	strQty = strQty.replace(/,/g, "");
	
	var nbrQty = Number(strQty);
	
	if (isNaN(nbrQty))
	{
		return strQty;
	}
	else if (nbrQty == 0)
	{
		return "";
	}
	else
	{
		return nbrQty.toFixed(NbrDec);
	}
}

//***************************************************************************************
// truncates decimal numbers. Qty is the number to be truncated. NbrDec contains a value 
// to what decimal point.
// Example of use
//		truncateToDecimal("+4.567898", 2) -> "4.56"
//***************************************************************************************
function truncateToDecimal(Qty,NbrDec)
{
	var strQty  = "" + Qty
	var leadingSign='',trailingSign='';

	if( strQty.charAt(0)=='-' || strQty.charAt(0)=='+')
	{
		leadingSign = strQty.substring(0,1)
		strQty = strQty.substring(1,strQty.length)
	}
	else if(strQty.charAt(strQty.length-1)=='-' || strQty.charAt(strQty.length-1)=='+')
	{
		trailingSign = strQty.substring(strQty.length-1,strQty.length)
		strQty = strQty.substring(0,strQty.length-1)
	}

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
		decimal = Math.floor(decimal);

		strdecimal = "" + zeros + decimal;
		len = strdecimal.length;

		if(strdecimal.substring(0, len - NbrDec)=='')
			return (trailingSign+leadingSign+"0." + strdecimal.substring(len - NbrDec, len))
		else
			return trailingSign+leadingSign+strdecimal.substring(0, len - NbrDec) + "." + strdecimal.substring(len - NbrDec, len);
	}
	else
		return ""
}

//***************************************************************************************
// Rounds decimal numbers. 
// Parameters:
// nbr:	 	the number to be rounded.
// decimals:	the number of decimal places to round to	
// Example of use
//		formatNumeric("10.2378", 2) --> returns 10.24
//***************************************************************************************
function formatNumeric(nbr, decimals) {

	nbr = nbr.toString();
	var lastChar = nbr.charAt(nbr.length - 1);
	if (lastChar == "-") {
		nbr = "-" + nbr.substring(0, nbr.length - 1);
	} else if (lastChar == "+") {
		nbr = nbr.substring(0, nbr.length - 1);
	}

	nbr = Number(nbr);
	decimals = Number(decimals);
	var resultNbr;
	
	if (nbr.toFixed) {
		resultNbr = nbr.toFixed(decimals);
	} else {
		nbr = nbr.toString();
		resultNbr = roundToDecimal(nbr, decimals);
		if (resultNbr == "") {
			resultNbr = "0";
			if (decimals > 0) {
				resultNbr += ".";
				for (var i=0; i<decimals; i++) {
					resultNbr += "0";
				}
			}	
		}
		if (decimals == 0) {
			resultNbr = parseInt(resultNbr, 10);
		}
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
function truncateNumeric(nbr, decimals) {

	nbr = nbr.toString();
	var lastChar = nbr.charAt(nbr.length - 1);
	if (lastChar == "-") {
		nbr = "-" + nbr.substring(0, nbr.length - 1);
	} else if (lastChar == "+") {
		nbr = nbr.substring(0, nbr.length - 1);
	}

	nbr = Number(nbr);
	decimals = Number(decimals);
	var resultNbr;


	nbr = nbr.toString();
	resultNbr = truncateToDecimal(nbr, decimals);
	if (resultNbr == "") {
		resultNbr = "0";
		if (decimals > 0) {
			resultNbr += ".";
			for (var i=0; i<decimals; i++) {
				resultNbr += "0";
			}
		}
	}
	if (decimals == 0) {
		resultNbr = parseInt(resultNbr, 10);
	}
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

//*******************************************************************************************
// Processes a Form error using existing logic for Alert boxes. Will highlight the form in
// question and set focus to that element.
// Example of use.
//		ProcessFormError("self", "self.document.forms[0]", "phonenumber", "Invalid Phone Number!");
//*******************************************************************************************
function ProcessFormError(WindowNm, FormObj, Element, ErrorMsg)
{
	MsgBox(ErrorMsg, WindowNm);
	eval(FormObj+"."+Element).focus();
	eval(FormObj+"."+Element).select();
}

//*******************************************************************************************
// The following checks for what protocal is being used and will return a proper frame object
// based on that protocal.
// Example of use.
//		Desc = '<frame name=CONTROLITEM src="'+SSL()+'">;
//*******************************************************************************************
function SSL()
{
	var SLLProtocal = (window.location.protocol == 'http:')?'about:blank':'/lawson/xhrnet/dot.htm';
	return SLLProtocal;
}

function TimeRoutines(Style, Time)
{
	var Hours = parseInt(Time.substr(0,2), 10);
	var Minutes = parseInt(Time.substr(2,2), 10);
	var Seconds = parseInt(Time.substr(4,2), 10);
	var NonZuluHours = (!Hours) ? 12 : ((Hours > 12) ? (Hours - 12) : Hours);
	var AM = (Hours < 12) ? true : false;
	Seconds = (AM) ? Seconds + " AM" : Seconds + " PM";

	switch(Style)
	{
		default:
			if(String(Minutes).length == 1)
				Minutes = "0"+String(Minutes)
			if(String(Seconds).length == 1)
				Seconds = "0"+String(Seconds)

			return NonZuluHours + ":" + Minutes + ":" + Seconds ;
	}
}

//*******************************************************************************************
// Use this function to disable the context menu for a document.
//*******************************************************************************************
function DisableContextMenu(Flag)
{
	document.oncontextmenu = function(){return !Flag}

	if(document.layers)
	{
		window.captureEvents(Event.MOUSEDOWN);
		window.onmousedown = function(e){ if(e.target==document)return !Flag; }
	}
	else
		document.onmousedown = function(){return !Flag}
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

//*******************************************************************************************
// Use this function to determine if an object is valid
//*******************************************************************************************
function ASSERT(pObj)
{
	if(typeof(pObj) == "undefined" 	//If function has not been assigned a value yet
	|| typeof(pObj) == "unknown" 	//If function has not been assigned a value yet (IE)
	|| typeof(pObj) == "null" 		//If function has been assigned a null type;
	|| pObj == null)				//If function has been assigned a null value
	{
		return false;
	}
	else
	{
		return true;
	}
}

function CreateStory(pStr)
{
	return '<story xmlns:HTML="http://www.w3.org/Profiles/XHTML-transitional">' + pStr + '</story>'
}

function MergeXML()
{
	var pStr = '';

	for(var i=0; i<arguments.length; i++)
		pStr += String(arguments[i].xml);

	return pStr;
}

function StoreXMLDocument(pXMLObj)
{
	var objMSGXML=new ActiveXObject("Microsoft.XMLDOM");
	objMSGXML.async=false
	objMSGXML.load(pXMLObj) //OR DME CALL

	return (objMSGXML.parseError.errorCode == 0) ? objMSGXML : null;
}

function StoreXSLDocument(pXSLObj)
{
	var objMSGXSL=new ActiveXObject("Microsoft.XMLDOM");
	objMSGXSL.async=false
	objMSGXSL.load(pXSLObj) //OR DME CALL

	return (objMSGXSL.parseError.errorCode == 0) ? objMSGXSL : null;
}

function CreateXSLPage(pXMLObj, pXSLObj)
{
	return pXMLObj.transformNode(pXSLObj);
}

function Send(pString)
{
	document.open();
	document.write(pString);
	document.close();
}

//*******************************************************************************************
// Returns information about the browser the user is running.
//*******************************************************************************************
function BrowserInfo()
{
	var OtherWindow = (arguments.length) ? arguments[0] : null;
	var IE4 = (document.all && !document.getElementById) ? true : false;
	var NS4 = (document.layers) ? true : false;
	var IE5 = (document.all && document.getElementById) ? true : false;
	var N6 = (document.getElementById && !document.all) ? true : false;
	var win = navigator.userAgent.toLowerCase().indexOf("win")!=-1;
	var mac = navigator.userAgent.toLowerCase().indexOf("mac")!=-1;

	this.screenWidth = function() 	{ return (IE5) ? ((OtherWindow) ? OtherWindow.document.body.clientWidth : document.body.clientWidth) : ((OtherWindow) ? OtherWindow.innerWidth : window.innerWidth);}
	this.screenHeight = function()	{ return (IE5) ? ((OtherWindow) ? OtherWindow.document.body.clientHeight : document.body.clientHeight) : ((OtherWindow) ? OtherWindow.innerHeight : window.innerHeight);}
	this.IsNetscape6 = function() 	{ return N6;}
	this.IsIE5 = function() 		{ return IE5;}
	this.IsNS4 = function() 		{ return NS4;}
	this.IsIE4 = function() 		{ return IE4;}
	this.IsWin = function() 		{ return win;}
	this.IsMac = function() 		{ return mac;}
}

function AssertWindow(WindowVar)
{
	return ((typeof(WindowVar)=="undefined" || !WindowVar) || WindowVar.closed || WindowVar==null) ? true : false;
}

function OpenPopupWindow(URL, Handle, Width, Height, Resize, Scrollbars, Toolbar)
{
	return window.open("","Print","width="+Width+",height="+Height+",resizable="+((Resize)?'yes':'no')+",scrollbars="+((Scrollbars)?'yes':'no')+",toolbar="+((Toolbar)?'yes':'no'));
}

function WriteTextBox(Name, Value, Size, MaxSize, FocusEvent, ChangeEvent)
{
	var returnVal = '<input type=text name="'+name+'" value="'+Value+'" size='+Size
	returnVal += ' maxlength='+MaxSize+' onFocus="'+FocusEvent+';" onChange="'+ChangeEvent+';">'

	return returnVal;
}

//*******************************************************************************************
//An alternative method to sort an array. This function expects MainArray and InsertionArray
//to already be sorted. It will parse through MainArray, index by index and check
//InsertionArray starting at the first index and will find where in MainArray it can
//insert the index from InsertionArray.
//*******************************************************************************************

function InsertionSort(MainArray, InsertionArray, Property, Direction, Numerical)
{
	for(i=0, j=0; i<MainArray.length && j < InsertionArray.length; i++)
	{//parse through MainArray starting at index 0

		var mainObj1 = EvalProperty(eval("MainArray[i]." + Property))
		var insertObj = EvalProperty(eval("InsertionArray[j]." + Property));
		var objInsert = new Array(new Object());

		for(ty in InsertionArray[j])
			eval('objInsert[0].'+ty+' = "'+eval("InsertionArray[j]."+ty)+'"')

		if(i+1 < MainArray.length) //make sure we are not at the end of the array
		{
			//extract the property value we are sorting against. EvalProperty will also
			//handle date strings
			var mainObj2 = EvalProperty(eval("MainArray[i+1]." + Property))
			var compObj1 = compareNumbers(mainObj1, insertObj);
			var compObj2 = compareNumbers(mainObj2, insertObj);

			if( (Numerical && Direction == ">" && (compObj1 < 0) && (compObj2 >= 0)) ||
				(Numerical && Direction == "<" && (compObj1 > 0) && (compObj2 <= 0)) ||
				(!Numerical && Direction == ">" && (mainObj1 < insertObj) && (mainObj2 >= insertObj)) ||
				(!Numerical && Direction == "<" && (mainObj1 > insertObj) && (mainObj2 <= insertObj)))
			{//whew!
				//Divide the array where we need to insert and store them off

				var objArray1 = MainArray.slice(0, i)
				var objArray2 = MainArray.slice(i+1, MainArray.length);

				//Now combine all parts to recreate MainArray
				MainArray = new Array();
				MainArray = MainArray.concat(objArray1).concat(objInsert).concat(objArray2);

				++j;
				++i;
			}
			else if( (Numerical && Direction == ">" && (compareNumbers(mainObj1, insertObj) > 0)) ||
				(Numerical && Direction == "<" && (compareNumbers(mainObj1, insertObj) < 0)) ||
				(!Numerical && Direction == ">" && (mainObj1 > insertObj)) ||
				(!Numerical && Direction == "<" && (mainObj1 < insertObj)))
			{
				var objArray1 = (i>0) ? MainArray.slice(0, i) : new Array();
				var objArray2 = MainArray.slice(i, MainArray.length);

				//Now combine all parts to recreate MainArray
				MainArray = new Array();
				MainArray = MainArray.concat(objArray1).concat(objInsert).concat(objArray2);
				++j;
			}
		}
		else
		{//We are at the end of the array. Concatenate the rest of InsertionArray to the
		 //end of MainArray.
			if(j < InsertionArray.length)
			{
				MainArray = MainArray.concat(objInsert);
				++j;
			}
		}
	}

	return MainArray;
}

function compareNumbers(a, b)
{
	return a - b;
}

function OnClickHandler()
{ 
  var el=null;
  var flag=true;
  try {
  	el = event.srcElement;
  	// Do the While loop to find out if any of the parent elements 
  	// are an A HREF.
  	// This is necessary because in Internet Explorer 4.x, you can 
  	// receive events of any element including the <B> tag.   
  	while (flag && el)   
  	{
    		if (el.tagName == "A")
    		{ 
      			flag=false;
      			if (el.protocol == "javascript:")
      			{
        			execScript(el.href, "javascript");
        			// A window.event.returnValue=false is performed so that the 
        			// default action does not happen - which in case of an HREF
        			// will be navigating to a link. 
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

document.onclick = OnClickHandler; // set the On click handler for the document 

function getVarFromString(varName, str)
{
	var url = str;
	var ptr = url.indexOf(varName + "=");
	var ptr2;
	var val1 = "";

	if (ptr != -1)
	{
		var val1 = url.substring(ptr + varName.length + 1,url.length);
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
	fndOffset = mainStr.indexOf(srchStr);
	if (fndOffset == -1)
		return null;
	else
		return mainStr.substring(0, fndOffset);
}

function getEnd(mainStr, srchStr)
{
	fndOffset = mainStr.indexOf(srchStr);
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
