/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/edits.js,v 1.50.2.6.4.25.6.13.2.9 2012/08/08 12:37:20 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
//-----------------------------------------------------------------------------
//		***************************************************************
//		*                                                             *                          
//		*                           NOTICE                            *
//		*                                                             *
//		*   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
//		*   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
//		*   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
//		*   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
//		*   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
//		*   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
//		*   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
//		*                                                             *
//		*   (c) COPYRIGHT 2012 INFOR.  ALL RIGHTS RESERVED.           *
//		*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//		*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//		*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//		*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//		*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//		*                                                             *
//		*************************************************************** 
//-----------------------------------------------------------------------------
var EDITJS="edits.js";

function edPerformEdits(mElement)
{
	try {
		var value = mElement.value;
		if (value == "") return;

		switch (mElement.getAttribute("edit"))
		{
		case "upper":
			mElement.value = value.toUpperCase();
			break;

		case "numeric":
			var decSZ=mElement.getAttribute("decsz");					
			if (decSZ)
				value = edFormatDecimal(value, decSZ);
			mElement.value = value;
			break;

		case "signed":
			if (value == "-")
			{
				mElement.value = "";
				return;
			}

			var decSZ=mElement.getAttribute("decsz");					
			if (decSZ)
			{
				var signPos = value.lastIndexOf("-");
				var bSignPrefix = (signPos == 0 ? true : false);
				var bSignSuffix = ((value.length - 1) == signPos ? true : false);
		
				if (bSignPrefix || bSignSuffix)
					value = (bSignPrefix ? value.substring(1,value.length)
									   : value.substring(0,(value.length -1)));	
				value = edFormatDecimal(value, decSZ);
				if((bSignPrefix || bSignSuffix) && value.length)
					value = (bSignSuffix ? value + "-" : "-" + value);
			}
			mElement.value = value;
			break;			

		case "date":
			edValidateDateLength(mElement);	
			if (mElement.value=="")
			{						
				mElement.focus()
				var errMsg = top.lawsonPortal.getPhrase("LBL_INVALID_DATE")
				setTimeout("lawsonPortal.setMessage(\""+errMsg+"\")",1)
				return
			}

			mElement.value=edFormatDate(mElement.value, mElement.getAttribute("size"))
			if (mElement.value=="")
			{
				mElement.focus()	
				var errMsg = top.lawsonPortal.getPhrase("LBL_INVALID_DATE")
				setTimeout("lawsonPortal.setMessage(\""+errMsg+"\")",1)
			}
			break;

		case "time":
			value = edFormatTime(mElement.value, mElement.getAttribute("size"))
			if (value=="")
			{
				mElement.focus()
				mElement.select()
			}
			else
				mElement.value = value;
			break;
		}

	} catch (e)	{
		if (mElement.getAttribute("edit") != "date")
			cmnErrorHandler(e,window,EDITJS); 
	}
}
//-----------------------------------------------------------------------------
function edFormatDecimal(value, decSZ)
{
	// Certain Apps have DECSZ based upon IC data
	// in that case DECSZ is that max number
	// until we can identify these field do NOT format decimal position
	var decSep = oUserProfile.getAttribute("decimalseparator");

	if (value == decSep || value == "")
		return "";
	
	var valAry = value.split(decSep);
	var leftSide = 	valAry[0];	
	var rightSide = valAry[1] ? valAry[1] : "0";
	var leftSideInt = (leftSide == "" ? 0 : parseInt(leftSide, 10));	
	var rightSideInt = parseInt(rightSide, 10);
			
	if (isNaN(leftSideInt) || isNaN(rightSideInt))
		return "";

	return value;
}
//-----------------------------------------------------------------------------
function edGetCurrentTime(sz)
{
	var timeSep=oUserProfile.getAttribute("timeseparator");
	if (!timeSep) timeSep=":";
	var now = new Date();
	var hour   = now.getHours().toString();
	var min = now.getMinutes().toString();
	var sec  = now.getSeconds().toString();
	return (edFormatTime(hour+timeSep+min+timeSep+sec,sz));
}

//-----------------------------------------------------------------------------
function edFormatTime(strTime, size)
{
	var timeSep=oUserProfile.getAttribute("timeseparator");
	if (!timeSep) timeSep=":";
	strTime=strTime.replace(/\D/g,timeSep)
	var re=new RegExp(timeSep,"g");
	if (strTime.replace(re,"")=="") return ""
	var hours="",mins="",secs=""
	if(timeSep != "" && strTime.indexOf(timeSep)!=-1)
	{
		var timeParts=strTime.split(timeSep)
		if(timeParts[0])
			hours=timeParts[0]
		if(timeParts[1])
			mins=timeParts[1]
		if(timeParts[2])
			secs=timeParts[2]
	}
	else
	{
		if(strTime.length>=1)
			hours=strTime.substring(0,1)
		if(strTime.length>=2)
			hours=strTime.substring(0,2)
		if(strTime.length>=3)
			mins=strTime.substring(2,3)
		if(strTime.length>=4)
			mins=strTime.substring(2,4)
		if(strTime.length>=5)
			secs=strTime.substring(4,5)
		if(strTime.length>=6)
			secs=strTime.substring(4,6)
	}

	if(hours.length!=2)
		hours=((hours.length==1) ? "0" + hours : "00")
	if(mins.length!=2)
		mins=((mins.length==1) ? "0" + mins : "00")
	if(secs.length!=2)
		secs=((secs.length==1) ? "0" + secs : "00")
	
	var errMsg = "";
	if (hours < 0 || hours > 23)
		errMsg = "Hour must be between 0 to 23";
	else
		if (mins < 0 || mins > 59)
			errMsg = "Minutes must be between 0 to 59";
		else
			if (secs < 0 || secs > 59)
				errMsg = "Seconds must be between 0 to 59";
	
	if (errMsg != "")
	{
		setTimeout("lawsonPortal.setMessage(\""+errMsg+"\")",1)
		return "";
	}	
	else
		return (size=="4"
			? hours + timeSep + mins
			: hours + timeSep + mins + timeSep + secs);
}

//-----------------------------------------------------------------------------
function edCheckDec(evt, elem)
{
    evt = (evt) ? evt : ((window.event) ? window.event : "")
    if (!evt) return;

	//do not apply edits to a tab or shift+tab.  The src element is not the element that had focus on the
	//keypress instead it is the element that is navigated to.  (IE only)
	if (lawsonPortal.browser.isIE
	&& (evt.keyCode == 9 || evt.keyCode == 16))
		 return true;	
	
	// netscape fires event for some keys IE doesn't
	if (!lawsonPortal.browser.isIE)
	{
		if ( evt.charCode == 0
		&& (evt.keyCode < 37 || evt.keyCode > 40) )		// arrow keys
			return true;
		// can't allow arrow keys in 6.2 - may cause browser to crash!
		if ( evt.charCode == 0
		&& lawsonPortal.browser.version > 6.2)
			return true;
	}

	var val = elem.value;
	if(!val) return;

	var decSep = oUserProfile.getAttribute("decimalseparator");
	var maxLength = parseInt(elem.getAttribute("maxLength"),10);
	var signed = elem.getAttribute("edit")=="signed" ? 1 : 0;
	var decSZ = elem.getAttribute("decsz") ? parseInt(elem.getAttribute("decsz"),10) : 0;
	var dec = (decSZ) ? 1 : 0

	if(signed)
		var bSignPrefix = elem.value.indexOf("-") == 0 ? true : false;

	var signedPrefixExp = (signed && bSignPrefix) ? "(^\\-)" : "^";
	var wholeExp = "\\d{0," + (maxLength - signed - decSZ - dec) + "}";
	var decExp = (decSZ) ? "(\\" + decSep + "\\d{0," + decSZ + "})?" : "";
	var signedSuffixExp = (signed && !bSignPrefix) ? "(\\-)?$" : "$";
	var re = new RegExp(signedPrefixExp + wholeExp + decExp + signedSuffixExp, "g");

	if (!re.test(val))
		elem.value = (!elem.getAttribute("prevDecValue") ? "" : elem.getAttribute("prevDecValue"));
	else
		elem.setAttribute("prevDecValue", val);

	return
}

//-----------------------------------------------------------------------------
function edCheckNumeric(evt, elem)
{
    evt = (evt) ? evt : ((window.event) ? window.event : "")
    if (!evt) return true;

	// netscape fires event for some keys IE doesn't
	if (!lawsonPortal.browser.isIE)
	{
		if ( evt.charCode == 0
		&& (evt.keyCode < 37 || evt.keyCode > 40) )		// arrow keys
			return true;
		// can't allow arrow keys in 6.2 - may cause browser to crash!
		if ( evt.charCode == 0
		&& lawsonPortal.browser.version > 6.2)
			return true;
	}

	var decSZ = elem.getAttribute("decsz") ?  elem.getAttribute("decsz") : null;
	var decSep = oUserProfile.getAttribute("decimalseparator");
	var keyVal = lawsonPortal.browser.isIE ? evt.keyCode : evt.charCode;
	if (keyVal==0)		// netscrape only
		keyVal=evt.keyCode
	var charCode = String.fromCharCode(keyVal);
	var bCancelEvt = true;
	
	if (elem.value == "")
		elem.setAttribute("prevDecValue", "");

	switch (elem.getAttribute("edit"))
	{
	case "numeric":
		if(decSZ && charCode==decSep) return true;
		if(charCode.match(/\d/g)) return true;
		break;
	case "signed":
		if(charCode=="-" && elem.value.indexOf("-") == -1) return true;
		if(decSZ && charCode==decSep) return true;
		if(charCode.match(/\d/g)) return true;
		break;
	}

	if ( !bCancelEvt ) return (true);

	if (lawsonPortal.browser.isIE)
	{
		evt.cancelBubble=true;
		evt.returnValue=false;
		evt.keyCode = 0
	}
	else
	{
		evt.cancelBubble=true;
		evt.preventDefault();
		evt.stopPropagation();
	}
	return (false);
}
//-----------------------------------------------------------------------------
function edCheckJobName(evt, elem)
{
    evt = (evt ? evt : (window.event ? window.event : null));
    if (!evt) return true;

	// netscape fires event for some keys IE doesn't
	if (!oBrowser.isIE)
	{
		if ( evt.charCode == 0
		&& (evt.keyCode < 37 || evt.keyCode > 40) )		// arrow keys
			return true;
		// can't allow arrow keys in 6.2 - may cause browser to crash!
		if ( evt.charCode == 0
		&& lawsonPortal.browser.version > 6.2)
			return true;
	}

	var re = /[~!@#$%^&*()_+`={}:;<>?,\[\]\"\'\/\\\|]/g

	var keyVal = oBrowser.isIE ? evt.keyCode : evt.charCode;
	if (keyVal==0)		// netscrape only
		keyVal=evt.keyCode
	var charCode = String.fromCharCode(keyVal);

	var bCancelEvt = (charCode.match(re) ? true : false);
	if (bCancelEvt)
		setEventCancel(evt);
	return (!bCancelEvt);
}
//-----------------------------------------------------------------------------
function edValidateDateLength(ele)
{
	// must have at least 3 digits for size 4; 5 digits for others
	// insert leading zero if odd number of digits
	// (this function is intended to be called pre-formateDate)

	if (isNaN(ele.value)) return		// allow for possible 't' entry

	var sz=ele.getAttribute("size")
	var value = ele.value
	if (sz=="4")
	{
		if (value.length < 3)
		{
			value=""
			ele.value=value
			return
		}
		//PT- 152360 Changes
		if(value.length ==5)
		return;
				// Changes Ends
	}
	else
	{
		if (value.length < 5)
		{
			value=""
			ele.value=value
			return
		}
	}
	// insert leading zero?
	if ( (value.length==3) || (value.length==5) || (value.length==7) )
		ele.value = "0"+value
}

//-----------------------------------------------------------------------------
function edFormatDate(strDate, sz)
{
	if (sz=="4")
	{
		var dtSep=oUserProfile.getAttribute("dateseparator")
		if (!dtSep) dtSep="/";
		strDate=strDate.replace(/\D/g,dtSep)
		if (strDate==dtSep)
			strDate=""
		if(strDate!="")
		{ // PT- 152360 Changes
			if(strDate.substring(1,2) == dtSep)
				strDate = "0"+strDate.substring(0,1)+strDate.substring(2,4)
 	  			
			if(strDate.indexOf(dtSep)!=-1)
     {
				 if(edValidateDate(strDate.substring(3,5),strDate.substring(0,2)))
					return (strDate.substring(0,2) + dtSep + strDate.substring(3,5))
				 else
					return (strDate ="");
			  }
			else
			{
				if(edValidateDate(strDate.substring(2,4),strDate.substring(0,2)))
							return (strDate.substring(0,2) + dtSep + strDate.substring(2,4))
				else
							return (strDate ="");
	    }
		}//Changes Ends

	}

	var retDate=""
	switch(strDate.toUpperCase())
	{
		case "":
			break
		case "T":		// get todays date
			var oDate=new Date()
			//oDate.setMonth(oDate.getMonth())
			retDate=edSetUserDateFormat(oDate, sz)
			break
		default:
			var temp=edGetDateObject(strDate, sz)
			if(temp==null)
				break
			if(!isNaN(temp.valueOf()))
				retDate=edSetUserDateFormat(temp,sz)
			break
	}
	
	if (retDate=="")
	{
		var errMsg = lawsonPortal.getPhrase("LBL_INVALID_DATE")
		setTimeout("lawsonPortal.setMessage(\""+errMsg+"\")",1)
		}
		
	return retDate
}

//-----------------------------------------------------------------------------
function edGetCentury()
{
	var defaultYear="10";
	var centuryYear=oUserProfile.getAttribute("CENTURY");
	if (centuryYear)
		return (centuryYear < 0 || centuryYear > 99 
			?  defaultYear : centuryYear);

	var dateToday=new Date();
	var yearToday=dateToday.getFullYear();

	return (yearToday < 2050 
            ? (yearToday - 2000 + 5) : defaultYear);
}
//-----------------------------------------------------------------------------
function edGetDateObject(strDate, sz)
{
	if (strDate.toLowerCase()=="t")
	{
		var tmpDate=new Date()
		strDate=edSetUserDateFormat(tmpDate, sz)
	}
	var dtFormat=oUserProfile.getAttribute("dateformat")
	var dtSep=oUserProfile.getAttribute("dateseparator")
	var centuryYear =  edGetCentury();
	if (!dtFormat) dtFormat="YYMMDD";
	if (!dtSep) dtSep="/";
	
	//make sure date fmt has 4Y 2M and 2D
	dtFormat=dtFormat.replace(/Y{1,4}/g,"YYYY")
	dtFormat=dtFormat.replace(/M{1,2}/g,"MM")
	dtFormat=dtFormat.replace(/D{1,2}/g,"DD")

	strDate=strDate.replace(/\D/g,dtSep)
	var speCharArray= new Array(12)
	
	speCharArray[0]="*"
	speCharArray[1]="^"
	speCharArray[2]="$"
	speCharArray[3]="\\"
	speCharArray[4]="+"
	speCharArray[5]="?"
	speCharArray[6]="."
	speCharArray[7]="["
	speCharArray[8]="]"
	speCharArray[9]="("
	speCharArray[10]=")"
	speCharArray[11]="{"
	speCharArray[12]="}"

	var oRegExp=null;	
	for (var i=0; i < speCharArray.length; i++)
	{
		if (dtSep==speCharArray[i])
		{
			oRegExp=new RegExp("\\"+dtSep,"g");
			break	
		}
		else
			oRegExp=new RegExp(dtSep,"g");
	}
	var dateParts=strDate.split(oRegExp)
	var re = /M{1,2}|D{1,2}|(YY){1,2}/g;
	var r = dtFormat.match(re);

	if (dtSep!="" && strDate.indexOf(dtSep)!=-1)
	{
		for(var i=0; i < dateParts.length; i++)
		{
			switch (r[i])
			{
				case "MM":
					mo=dateParts[i]
					break
				case "DD":
					day=dateParts[i]
					break
				case "YYYY":
					yr=dateParts[i]
					
					if(yr.length==1)
						yr = "0" + yr;
						
					if(yr.length==2)
					{
						if(parseInt(yr)>=parseInt(centuryYear))
							yr="19" + yr
						else
							yr="20" + yr
					}
					break
			}
		}
	}
	else
	{
		var objDate=strDate.replace(oRegExp,"")
		var temp=0
		//figure out month day year and put in date fmt string with 4digit year
		var yr, mo,day
		for(var i=0;i<r.length;i++)
		{
			switch (r[i])
			{
				case "MM":
					mo=objDate.substring(temp,temp+r[i].length)
					break
				case "DD":
					day=objDate.substring(temp,temp+r[i].length)
					break
				case "YYYY":
					if (dtFormat=="YYYYMMDD" && strDate.length==6)
						r[i]="YY";				
					yr=objDate.substring(temp,temp+r[i].length)
					if(yr.length==2)
					{
						  if(parseInt(yr)>=parseInt(centuryYear))
							yr="19" + yr
						else
							yr="20" + yr
					}
					break
			}
			temp+=r[i].length
		}
	}
	
	var oDate=null;
	if (edValidateDate(day,mo,yr))
		oDate=new Date(yr,mo-1,day)
	return oDate;
		
}
function edValidateDate(dy,mo,yr)
{
	if((mo=="" && yr=="")||(dy=="" && yr=="")||(dy=="" && mo==""))
		return false
		
	var mos=new Array()
	mos[0]=31
	mos[1]=28
	mos[2]=31
	mos[3]=30
	mos[4]=31
	mos[5]=30
	mos[6]=31
	mos[7]=31
	mos[8]=30
	mos[9]=31
	mos[10]=30
	mos[11]=31

	// leap year is a multiple of 400 or a multiple of 4 but not a multiple of 100
	yr=(yr==null ? 0 : parseFloat(yr,10));
	dy=parseFloat(dy,10)
	mo=parseFloat(mo,10)
	
	if (yr%400==0 ||(yr%4==0 && yr%100!=0) || yr==0)
		mos[1]=29

	var days=mos[mo-1]

	var retVal = ((dy > days || dy < 1)
		? false : ((mo < 1 || mo > 12) ? false : true));
	return retVal;
}
//-----------------------------------------------------------------------------
function edSetUserDateFormat(oDate,sz)
{
	var dtFormat=oUserProfile.getAttribute("dateformat");
	var dtSep=oUserProfile.getAttribute("dateseparator");
	if (!dtFormat) dtFormat="YYMMDD";
	if (!dtSep) dtSep="/";

	//make sure date fmt has 4Y 2M and 2D
	dtFormat=dtFormat.replace(/Y{1,4}/g,"YYYY")
	dtFormat=dtFormat.replace(/M{1,2}/g,"MM")
	dtFormat=dtFormat.replace(/D{1,2}/g,"DD")
	var retDate=""
	if (sz=="undefined") sz="8"

	var month=(oDate.getMonth()+1).toString()
	if(month.length==1)
		month="0" + month
	var day=oDate.getDate().toString()
	if (day.length==1)
		day="0" + day

	if (sz=="4")
		return month + dtSep + day

	objDate=dtFormat
	objDate=objDate.replace("MM",month)
	objDate=objDate.replace("DD",day)
	objDate=objDate.replace("YYYY",oDate.getFullYear())

	var re = /M{1,2}|D{1,2}|(YY){1,2}/g;
	var r = dtFormat.match(re);
	var temp=0;

	// insert date sep between month day year
	for(var i=0;i<r.length;i++)
	{
		retDate+=objDate.substring(temp,temp+r[i].length)
		temp+=r[i].length
		if(i<2)
			retDate+=dtSep
	}
	return retDate
}

//-----------------------------------------------------------------------------
function edGetDateObjectFromLawsonDate(strDate)
{
	var yr=strDate.substring(0,4)
	var mo=strDate.substring(4,6)
	var day=strDate.substring(6,8)
	var oDate=new Date(yr,mo-1,day)
	return oDate
}

//-----------------------------------------------------------------------------
function edGetDateTimeObjectFromLawsonDate(strDate, strTime)
{
	//optional arguments
	if(typeof(strTime)=="undefined")
		strTime=""
	
	var yr=strDate.substring(0,4)
	var mo=strDate.substring(4,6)
	var day=strDate.substring(6,8)
	var hr=strTime.substring(0,2)
	var min=strTime.substring(2,4)
	var sec=strTime.substring(4,6)
		
	var oDate=new Date(yr,mo-1,day,hr, min, sec)
	
	return oDate
}
//-----------------------------------------------------------------------------
function edFormatLawsonDate(oDate)
{
	var month=(oDate.getMonth()+1).toString()
	if (month.length==1)
		month="0" + month
	var day=oDate.getDate().toString()
	if (day.length==1)
		day="0" + day
	return oDate.getFullYear().toString() + month + day
}

//---------------------------------------------------------------------------------------
// handle key down in date field
function onCalKeyPress(evt)
{
    evt = getEventObject(evt)
    if (!evt) return;

	var keyVal = lawsonPortal.browser.isIE ? evt.keyCode : evt.charCode;
	if (keyVal==0) return false		// for netscrape

	// let the following pass through:
	if ( (keyVal==13)					// Enter
	|| (keyVal==oUserProfile.getAttribute("dateseparator").charCodeAt(0))	// date separator
	|| (keyVal==84)						// "T" : today's date
	|| (keyVal==116) )					// "t" : today's date
	{
		return false
	}

	// only digits
	if ((keyVal<48)||(keyVal>57))
	{
		setEventCancel(evt)
		return true
	}
	return false;
}

//-----------------------------------------------------------------------------
function onPortalHelp(evt)
{
    evt = getEventObject(evt)
    if (!evt) return false;

	if ( !evt.altKey && !evt.ctrlKey && evt.shiftKey )
	{
		// we're using Shift-F1
		setEventCancel(evt)
		return (false);
	}
}

//-----------------------------------------------------------------------------
function onPortalKeyDown(evt)
{
    evt = (evt) ? evt : ((window.event) ? window.event : "")
    if (!evt) return;

	var action=getFrameworkHotkey(evt,"portal")
	if (!action)
	{
		// handled by framework
		setEventCancel(evt)
		return (false);
	}

	var evtCaught=false;
	var mElement=getEventElement(evt)
	if (action != "portal")
	{
		// some other portal hotkey
		switch (action)
		{
		case "doContextMenu":
			if ( mElement.id.substr(0,10)=="LAWNAVITEM" )
			{
				evtCaught=true;
				showNavletContextMenu(mElement.id)
			}
			else if ( mElement.id.substr(0,10)=="LAWMENUBTN" )
			{
				evtCaught=true;
				showDrop(mElement,1)
			}
			break;
		case "doTabPageDn":
			lawsonPortal.tabArea.switchActiveLeftPane(1)
			evtCaught=true;
			break;
		case "doTabPageUp":
			lawsonPortal.tabArea.switchActiveLeftPane(-1)
			evtCaught=true;
			break;
		}
		// return only if caught
		if (evtCaught) 
		{
			setEventCancel(evt)
			return evtCaught
		}
	}

	// give the content document a chance to handle
	var bAllowPassThru=true
	var keyVal = lawsonPortal.browser.isIE ? evt.keyCode : evt.charCode;
	if (keyVal==0) keyVal=evt.keyCode		// netscrape only
	if (keyVal > 47 && keyVal < 96)
	{
		// limit the routing of alphanumeric keys
		if ( !evt.altKey && !evt.ctrlKey && !evt.shiftKey )
			bAllowPassThru=false
	}

	// first, any special portal key processing
	if (keyVal==9)				// tab key
	{
		bAllowPassThru=false;
		if (mElement.className == "xTNavSelected"
		&& lawsonPortal.browser.isIE)
		{
			evtCaught=moveNavItemSelection(mElement,(evt.shiftKey ? "up" : "dn"),true)
		}
	}
	else if (keyVal==13)		// enter key
	{
		bAllowPassThru=false
		if ( mElement.id.substr(0,11)=="LAWTBBUTTON"
		|| mElement.id.substr(0,10)=="LAWNAVITEM"
		|| mElement.id.substr(0,10)=="LAWMENUBTN" )
		{
			// Mozilla browsers do the click event anyway
			if (lawsonPortal.browser.isIE)
				mElement.click();
			evtCaught=true;
		}
	}
	else if (keyVal==38			// up arrow
	&& !evt.altKey && !evt.ctrlKey && !evt.shiftKey)
	{
		bAllowPassThru=false
		if (mElement.className == "xTNavSelected")
		{
			moveNavItemSelection(mElement,"up",false)
			evtCaught=true;
		}
	}
	else if (keyVal==40			// down arrow
	&& !evt.altKey && !evt.ctrlKey && !evt.shiftKey)
	{
		bAllowPassThru=false
		if (mElement.className == "xTNavSelected")
		{
			moveNavItemSelection(mElement,"dn",false)
			evtCaught=true;
		}
	}

	// attempt to route to content frame?
	if (bAllowPassThru)
	{
		try {
			// can't use 'id' to retrieve frame?
			var contentWnd=lawsonPortal.drill.mode ? frames[1] : frames[0]
			if ( typeof(contentWnd.cntxtActionHandler) == "function"	// do we have a function to route to?
			&& lawsonPortal.keyMgr.isContextFreeHotkey(evt) )		// key must be valid out of context
			{
				evtCaught=contentWnd.cntxtActionHandler(evt,null)
			}

			if (!evtCaught)
			{
				// not handled in context, should portal handle?
				switch (action)
				{
				case "openNewWindow":
					newPortalWindow();
					evtCaught=true;
					break;
				}
			}
		
		} catch (e)	{
			cmnErrorHandler(e,window,EDITJS); 
		}
	}
	if (evtCaught) setEventCancel(evt)
	return evtCaught
}

//-----------------------------------------------------------------------------
// hotkey manager public interface
// returns:
//		null - handled by portal
//		action - action found, not handled
//		context - no action found
//-----------------------------------------------------------------------------
function getFrameworkHotkey(evt,context)
{
	var retVal=null;

	// first look for portal hotkey
	if (!lawsonPortal || !lawsonPortal.keyMgr)
		return null;
	var action=lawsonPortal.keyMgr.getHotkeyAction(evt,"portal")
	if (action)
	{
		retVal=action;
		switch (action)
		{
		case "switchNavPanelState":
			retVal=null;
			if (!oPortalConfig.isPortalLessMode())
				prtlExpandCollapseNavigation();
			break;
		case "posInNavbar":
			var linksBtn=document.getElementById("LAWDROPBUTTONlinks");
			if (linksBtn)
				linksBtn.click();
			else
			{
				lawsonPortal.tabArea.setVisibleState(true);
				lawsonPortal.tabArea.selectFirst();
			}
			retVal=null;
			break;
		case "posInSearch":
			frmPositionInSearch();
			retVal=null;
			break;
		case "posInToolbar":
			if (frmPositionInToolbar())
				retVal=null;
			break;
		case "goHome":
			retVal=null;
			if (!oPortalConfig.isPortalLessMode())
				goHome();
			break;
		case "goSupport":
			retVal=null;
			if (!oPortalConfig.isPortalLessMode())
				switchContents("http://support.lawson.com")
			break;
		case "goContent":
			retVal=null;
			if (!oPortalConfig.isPortalLessMode())
				switchContents("users/subscriptions/index.htm")
			break;
		case "goOptions":
			retVal=null;
			switchContents("userpref.htm")
			break;
		case "goJobsReports":		// compatibility
		case "goJobsList":
			retVal=null;
			switchContents(getGoJobListURL());
			break;
		case "goUserDocs":			// compatibility
		case "goJobSchedule":
			retVal=null;
			switchContents(getGoJobScheduleURL());
			break;
		case "goPrintFiles":
			retVal=null;
			switchContents(getGoPrintFilesURL());
			break;
		case "showAbout":
			retVal=null;
			portalShowAbout()
			break;
		case "showHotkeys":
			retVal=null;
			portalShowHotkeyHelp()
			break;
		}
		return (retVal);
	}

	// we're done if context is portal
	if (context == "portal") return (context);

	// now look for context hotkey
	action=lawsonPortal.keyMgr.getHotkeyAction(evt,context)
	return (action ? action : context)
}


//-----------------------------------------------------------------------------
function moveNavItemSelection(mElement,dir,bTab)
{
	var retVal=true;
	var curID=mElement.id.substr(10)
	var navID=mElement.getAttribute("container")
	var tabID=mElement.parentNode.parentNode.getAttribute("tabid")
	if (dir == "up")
	{
		if (!lawsonPortal.tabArea.tabs[tabID].navletObjects[navID].selectPrevious(curID))
		{
			if (!lawsonPortal.tabArea.tabs[tabID].selectPrevious(navID))
			{
				if (bTab)
					retVal=false;
				else
					lawsonPortal.tabArea.tabs[tabID].navletObjects[navID].selectFirst()
			}
		}
	}
	else	// if dir == "dn"
	{
		if (!lawsonPortal.tabArea.tabs[tabID].navletObjects[navID].selectNext(curID))
		{
			if (!lawsonPortal.tabArea.tabs[tabID].selectNext(navID))
			{
				if (bTab)
					retVal=false;
				else
					lawsonPortal.tabArea.tabs[tabID].navletObjects[navID].selectLast()
			}
		}
	}
	return retVal;
}
