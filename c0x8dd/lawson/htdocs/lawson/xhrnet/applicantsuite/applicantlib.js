// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/applicantsuite/Attic/applicantlib.js,v 1.1.2.50 2014/02/25 22:49:16 brentd Exp $
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
/*
 *		Census Logic
 */
var doupdate = false;
var veteranSelectedIndex = 0;
var ethniccodes = new Array();
var ethnicnames = new Array();
var veteranstatus = new Array();
var ficactry = "";
ethniccodes[0] = "";
ethnicnames[0] = "";
var eeoclassdesc = "";
var veterandesc = "";

function GetEthnicCodes()
{
	if (ethniccodes.length == 1)
	{
		var dmeObj = new DMEObject(authUser.prodline, "hrctrycode");
		dmeObj.out = "JAVASCRIPT";
		dmeObj.index = "ctcset1";
		dmeObj.field = "hrctry-code;description";
		dmeObj.key = "ET";
		dmeObj.max = "600";
		dmeObj.sortasc = "description";
		dmeObj.func = "ProcessEthnicCodes()";
		DME(dmeObj, "jsreturn");
	}
	else
		GetAppVersion();
}

function ProcessEthnicCodes()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++) 
	{
		ethniccodes[ethniccodes.length] = self.jsreturn.record[i].hrctry_code;
		ethnicnames[ethnicnames.length] = self.jsreturn.record[i].description;
	}
	if (self.jsreturn.Next != "")
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		GetAppVersion();
}

function GetAppVersion()
{
	if (!appObj)
		appObj = new AppVersionObject(authUser.prodline, "HR");
	// if you call getAppVersion() right away and the IOS object isn't set up yet,
	// then the code will be trying to load the sso.js file, and your call for
	// the appversion will complete before the ios version is set
	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
       	setTimeout("GetVeteranStatuses()", 10);
       	return;
	}
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "08.01.01" && veteranstatus.length == 0)
		GetVeteranStatuses();
	else
		DisplayCensusInfo();
}

function GetVeteranStatuses()
{
	var dmeObj = new DMEObject(authUser.prodline, "hrctrycode");
	dmeObj.out = "JAVASCRIPT";
	dmeObj.index = "ctcset1";
	dmeObj.field = "country-code;hrctry-code;description";
	dmeObj.key = "VS";
	dmeObj.max = "600";
	dmeObj.cond = "active";
	dmeObj.func = "ProcessVeteranStatuses()";
	DME(dmeObj, "jsreturn");
}

function ProcessVeteranStatuses()
{
	veteranstatus = veteranstatus.concat(self.jsreturn.record);
	if (self.jsreturn.Next != "")
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		DisplayCensusInfo();
}

function DisplayCensusInfo()
{
	var html = '<p class="fieldlabelboldleft">'+getSeaPhrase("VOLUNTARY_INFO","ESS")+'</p>'
	html += '<form name="censusdata">'
	html += '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;margin-left:auto;margin-right:auto" role="presentation">'
	html += '<tr><td class="plaintablerowheader" style="width:40%"><label for="eeoclass">'+getSeaPhrase("EEO_CLASS","ESS")+'</label></td>'
	html += '<td class="plaintablecell">'
	var toolTip;
	if (emssObjInstance.emssObj.filterSelect)
	{
		toolTip = dmeFieldToolTip("eeoclass");
		html += '<input class="inputbox" id="eeoclass" name="eeoclass" fieldnm="eeoclass" type="text" value="'+eeoclass+'" size="2" maxlength="2" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'eeoclass\');">'
		+ '<a href="javascript:parent.openDmeFieldFilter(\'eeoclass\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
		+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
		+ '<span id="eeoclassDesc" style="width:200px" class="fieldlabel">'+eeoclassdesc+'</span>'
	}
	else
	{	
		html += '<select class="inputbox" id="eeoclass" name="eeoclass">'
		if (eeoclass)
			html += BuildEEOSelect(eeoclass)
		else
			html += BuildEEOSelect("")
		html += '</select>'
	}
	html += '</td></tr>'
	html += '<tr><td class="plaintablerowheader" style="width:40%">'+getSeaPhrase("DEP_27","ESS")+'</td>'		
	html += '<td class="plaintablecell" style="padding-top:2px;padding-bottom:2px">'
	html += '<div role="radiogroup" aria-labelledby="genderLbl">'
	html += '<span id="genderLbl" class="offscreen">'+getSeaPhrase("DEP_27","ESS")+'</span>'	
	html += '<input type="radio" id="female" name="gender" value="F"'
	if (gender0 == true)
		html += ' checked'
	html += ' role="radio"><label for="female" class="plaintablecelldisplay">&nbsp;'+getSeaPhrase("DEP_26","ESS")+'</label>'
	html += '<input type="radio" id="male" name="gender" value="M"'
	if (gender1 == true)
		html += ' checked'
	html += ' role="radio"><label for="male" class="plaintablecelldisplay">&nbsp;'+getSeaPhrase("DEP_25","ESS")+'</label>'
	html += '</div></td></tr>'
	html += '<tr><td class="plaintablerowheader" style="width:40%">'+getSeaPhrase("OLDER_THAN_18","ESS")+'</td>'		
	html += '<td class="plaintablecell" style="padding-top:2px;padding-bottom:2px">'
	html += '<div role="radiogroup" aria-labelledby="ageLbl">'
	html += '<span id="ageLbl" class="offscreen">'+getSeaPhrase("OLDER_THAN_18","ESS")+'</span>'		
	html += '<input type="radio" id="adult" name="ageflag" value="Y"'
	if (ageflag0 == true)
		html += ' checked'
	html += ' role="radio"><label for="adult" class="plaintablecelldisplay">&nbsp;'+getSeaPhrase("YES","ESS")+'</label>'
	html += '<input type="radio" id="child" name="ageflag" value="N"'
	if (ageflag1 == true)
		html += ' checked'
	html += ' role="radio"><label for="child" class="plaintablecelldisplay">&nbsp;'+getSeaPhrase("NO","ESS")+'</label>'
	html += '</div></td></tr>'
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "08.01.01")
	{	
		html += '<tr><td class="plaintablerowheader" style="width:40%"><label for="veteran">'+getSeaPhrase("VETERAN_STATUS","ESS")+'</label></td>'
		html += '<td class="plaintablecell">'
		if (emssObjInstance.emssObj.filterSelect)
		{			
			toolTip = dmeFieldToolTip("veteran");
			html += '<input class="inputbox" type="text" id="veteran" name="veteran" fieldnm="veteran" value="'+veteran+'" size="2" maxlength="2" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'veteran\');">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'veteran\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
			+ '<span id="veteranDesc" style="width:200px" class="fieldlabel">'+veterandesc+'</span>'
		}
		else
			html += '<select class="inputbox" id="veteran" name="veteran">'+BuildVeteranSelect(veteranSelectedIndex)+'</select>'
		html += '</td></tr>'		
	}
	else
	{
		html += '<tr><td class="plaintablerowheader" style="width:40%">'+getSeaPhrase("ARE_YOU_A_VETERAN","ESS")+'</td>'		
		html += '<td class="plaintablecell" style="padding-top:2px;padding-bottom:2px">'
		html += '<div role="radiogroup" aria-labelledby="veteranLbl">'
		html += '<span id="veteranLbl" class="offscreen">'+getSeaPhrase("ARE_YOU_A_VETERAN","ESS")+'</span>'			
		html += '<input type="radio" id="veteranYes" name="veteran" value="Y"'
		if (veteran0 == true)
			html += ' checked'
		html += ' role="radio"><label for="veteranYes" class="plaintablecelldisplay">&nbsp;'+getSeaPhrase("YES","ESS")+'</label>'
		html += '<input type="radio" id="veteranNo" name="veteran" value="N"'
		if (veteran1 == true)
			html += ' checked'
		html += ' role="radio"><label for="veteranNo" class="plaintablecelldisplay">&nbsp;'+getSeaPhrase("NO","ESS")+'</label>'
		html += '</div></td></tr>'
	}
	html += '<tr><td class="plaintablerowheaderborderbottom" style="width:40%">'+getSeaPhrase("ARE_YOU_DISABLED","ESS")+'</td>'		
	html += '<td class="plaintablecell" style="padding-top:2px;padding-bottom:2px">'
	html += '<div role="radiogroup" aria-labelledby="disabledLbl">'
	html += '<span id="disabledLbl" class="offscreen">'+getSeaPhrase("ARE_YOU_DISABLED","ESS")+'</span>'		
	html += '<input type="radio" id="disabledYes" name="handicapId" value="Y"'
	if (handicapId0 == true)
		html += ' checked'
	html += ' role="radio"><label for="disabledYes" class="plaintablecelldisplay">&nbsp;'+getSeaPhrase("YES","ESS")+'</label>'
	html += '<input type="radio" id="disabledNo" name="handicapId" value="N"'
	if (handicapId1 == true)
		html += ' checked'
	html += ' role="radio"><label for="disabledNo" class="plaintablecelldisplay">&nbsp;'+getSeaPhrase("NO","ESS")+'</label>'
	html += '</div></td></tr>'
	html += '<tr><td style="width:40%">&nbsp;</td>'
	html += '<td class="plaintablecell">'
	html += uiButton(getSeaPhrase("CONTINUE","ESS"),"parent.UpdateCensusInfo();return false")
	html += uiButton(getSeaPhrase("BACK","ESS"),"parent.BackToPrevEmploy();return false", "margin-left:5px")
	html += uiButton(getSeaPhrase("QUIT","ESS"),"parent.CheckQuit();return false", "margin-left:5px")
	html += '</td></tr></table></form>'
	self.main.document.getElementById("paneHeader").innerHTML = getSeaPhrase("CENSUS_DATA","ESS");
	self.main.document.getElementById("paneBody").innerHTML = html;
	self.main.stylePage();
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
	fitToScreen();
}

function UpdateCensusInfo()
{
	doupdate = true;
	ProcessCensusData();
}

function ProcessCensusData()
{
	objcd = self.main.document.censusdata;
	if (typeof(objcd.eeoclass) != 'undefined') 
	{
		if (emssObjInstance.emssObj.filterSelect)
		{
			eeoclass = objcd.eeoclass.value;
			eeoclassdesc = self.main.document.getElementById("eeoclassDesc").innerHTML;
		}
		else
		{
			eidx = objcd.eeoclass.selectedIndex;
			eeoclass = objcd.eeoclass[eidx].value;
		}
	}
	gender = GetCheckedValue("&APL-SEX=",objcd.gender);
	gender0 = objcd.gender[0].checked;
	gender1 = objcd.gender[1].checked;
	ageflag = GetCheckedValue("&APL-AGE-FLAG=",objcd.ageflag);
	ageflag0 = objcd.ageflag[0].checked;
	ageflag1 = objcd.ageflag[1].checked;
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "08.01.01")
	{
		if (emssObjInstance.emssObj.filterSelect)
		{
			veteran = objcd.veteran.value;
			veterandesc = self.main.document.getElementById("veteranDesc").innerHTML;
		}
		else
		{
			veteran = objcd.veteran[objcd.veteran.selectedIndex].value;		
			veteranSelectedIndex = objcd.veteran.selectedIndex;
		}
	}
	else
	{
		veteran = GetCheckedValue("&APL-VETERAN=",objcd.veteran);
		veteran0 = objcd.veteran[0].checked;
		veteran1 = objcd.veteran[1].checked;
	}
	handicapId = GetCheckedValue("&APL-HANDICAP-ID=",objcd.handicapId);
	handicapId0 = objcd.handicapId[0].checked;
	handicapId1 = objcd.handicapId[1].checked;
	if (doupdate)
		GetPA31();
}

function fireFoxQuit(confirmWin)
{
	if (confirmWin.returnValue == "ok" || confirmWin.returnValue == "continue")
		quitApplication();	
}

function CheckQuit()
{
	if (seaConfirm(getSeaPhrase("QUIT_WARNING","ESS"),"",fireFoxQuit))
		quitApplication();
}

function quitApplication()
{
	self.main.location = "/lawson/xhrnet/ui/logo.htm";
}

function GetPA31(nowarning)
{
	var agsObj = new AGSObject(authUser.prodline, "PA31.1");
	agsObj.event = "ADD";
	agsObj.rtn = "DATA";
	agsObj.longNames = "ALL";
	agsObj.tds = false;
	agsObj.callmethod = "post";
   	agsObj.field = "FC=A"
	+ "&APL-COMPANY=" + parseInt(authUser.company,10)
	+ "&APL-APP-STATUS=" + escape(alphadata3)
	+ "&APL-FIRST-NAME=" + escape(firstname)
	+ "&APL-MIDDLE-NAME=" + escape(midlename)
	+ "&APL-LAST-NAME-PRE="	+ escape(lastnameprefix)
	+ "&APL-LAST-NAME="	+ escape(lastname)
	+ "&APL-NAME-SUFFIX=" + escape(lastnamesuffix);
	if (NonSpace(nickname) != 0)
		agsObj.field += "&APL-NICK-NAME=" + escape(nickname);
	else
		agsObj.field += "&APL-NICK-NAME=" + escape(firstname);
	agsObj.field += "&APL-FICA-NBR=" + escape(ficanbr)
	+ "&APL-ADDR1="	+ escape(addr1)
	+ "&APL-ADDR2="	+ escape(addr2)
	+ "&APL-ADDR3="	+ escape(addr3)
	+ "&APL-CITY=" + escape(city)
	+ "&APL-STATE="	+ escape(state)
	+ "&APL-ZIP=" + escape(zip)
	+ "&APL-COUNTRY-CODE=" + escape(country)
	+ "&APL-HM-PHONE-NBR=" + escape(hmphonenbr)
	+ "&APL-HM-PHONE-CNTRY=" + escape(hmphonecntry)
	+ "&APL-WK-PHONE-NBR=" + escape(wrkphonenbr)
	+ "&APL-WK-PHONE-EXT=" + escape(extension)
	+ "&APL-WK-PHONE-CNTRY=" + escape(wrkphonecntry)
	+ "&APL-POSITION1="	+ escape(position1)
	+ "&APL-POSITION2="	+ escape(position2)
	+ "&APL-POSITION3="	+ escape(position3)
	+ "&APL-JOB1=" + escape(jobs1)
	+ "&APL-JOB2=" + escape(jobs2)
	+ "&APL-JOB3=" + escape(jobs3)
	+ "&APL-DATE-AVAIL=" + escape(datebegin)
	+ "&APL-HIRE-SOURCE=" + escape(findabout)
	+ "&APL-BEG-PAY=" + escape(paybase1)
	+ "&APL-END-PAY=" + escape(paybase2)
	+ "&APL-CURRENCY-CODE="	+ escape(currency)
	+ "&APL-WORK-SCHED=" + escape(schedule)
	+ nbrfte
	+ prevapply
	+ "&APL-PREV-LOCATION="	+ escape(prevlocation)
	+ "&APL-PREV-DATE="	+ escape(prevdate)
	+ prevemploy
	+ "&APL-PREV-EMP-NBR=" + escape(prevempnbr)
	+ "&APL-PREV-BEG-DATE="	+ escape(prevbegdate)
	+ "&APL-PREV-END-DATE="	+ escape(prevenddate)
	+ "&APL-PREV-LOC-WORK="	+ escape(prevlocwork)
	+ "&APL-FORMER-FST-NM="	+ escape(formerfstname)
	+ "&APL-FORMER-MI="	+ escape(formermi)
	+ "&APL-FORMER-LST-NM="	+ escape(formerlstname)
	+ "&APL-EEO-CLASS="	+ escape(eeoclass)
	+ gender
	+ ageflag;	
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "08.01.01")	
		agsObj.field += "&APL-VETERAN=" + escape(veteran);
	else
		agsObj.field += veteran;
	agsObj.field += handicapId
	+ "&APL-EMAIL-ADDRESS="	+ escape(emailaddress)
	+ "&APL-FAX-NBR=" + escape(faxnbr)
	+ "&APL-TRAV-PCT=" + escape(pcavail)
	+ otavail
	+ relocavail
	+ travavail
	+ "&APL-DATE-APPLIED="+authUser.date;
	if (nowarning)
		agsObj.field += "&PT-XMIT-NBR1=2&PT-XMIT-NBR2=2";	
	agsObj.func = "parent.DisplayPA31Msg()";
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), function(){AGS(agsObj,"jsreturn");});
}

function confirmPA31()
{
	GetPA31(true);
}

function DisplayPA31Msg()
{
	if (self.lawheader.gmsgnbr == "122" || self.lawheader.gmsgnbr == "163") 
	{
		if (seaConfirm(self.lawheader.gmsg,"",confirmPA31))
			GetPA31(true);
		else
		{
			doupdate = false;
			removeWaitAlert();
		}
	}
	else if (self.lawheader.gmsg.substring(0,7).toUpperCase() == "WARNING")
		GetPA31(true);
	else if (self.lawheader.gmsgnbr == "000") 
	{
		if (error1)
			DisplayRelatedLinks();
		else
			GetPA43();
	} 
	else 
	{
		doupdate = false;
		removeWaitAlert();
		seaAlert(self.lawheader.gmsg, null, null, "error");
	}
}

function GetPA43()
{
	var appliedForJob = false;
	var agsObj = new AGSObject(authUser.prodline, "PA43.2");
	agsObj.event = "ADD";
	agsObj.rtn = "MESSAGE";
	agsObj.longNames = "ALL";
	agsObj.tds = false;
	agsObj.field = "FC=A"
	+ "&PT-PRA-COMPANY=" + parseFloat(authUser.company)
	+ "&PT-PRA-EMP-APP=1"
	+ "&PT-PRA-APPLICANT=" + parseFloat(self.lawheader.ApplicantNumber);
	for (var k=1; k<4; k++) 
	{
		if (!isNaN(parseFloat(eval("open"+k)))) 
		{
			appliedForJob = true;
			agsObj.field += "&LINE-FC"+k+"=A"
			+ "&PRA-REQUISITION"+k+"=" + parseFloat(eval("open"+k))
			+ "&PQL-APP-STATUS"+k+"=" + escape(alphadata3)
			+ "&PQL-DATE"+k+"=" + escape(todaydate)
			+ "&PRA-DATE-APPLIED"+k+"=" + escape(todaydate);
		}
	}
	if (appliedForJob) 
	{
		agsObj.func = "parent.DisplayPA43Msg()";
		AGS(agsObj,"jsreturn");
	} 
	else
		DisplayRelatedLinks();
}

function DisplayPA43Msg()
{
	if (self.lawheader.gmsgnbr == "000")
		DisplayRelatedLinks();
	else
	{
		removeWaitAlert();
		seaAlert(self.lawheader.gmsg, null, null, "error");	
	}	
}

function BuildEEOSelect(eeocode)
{
	var selectAry = new Array();
	var len = ethniccodes.length;
	for (var i=0; i<len; i++) 
	{
		selectAry[i] = '<option value="'+ethniccodes[i]+'"';
		if (eeocode == ethniccodes[i])
			selectAry[i] += ' selected>';
		else
			selectAry[i] += '>';
		selectAry[i] += ethnicnames[i];
	}
	return selectAry.join("");
}

function BuildVeteranSelect(veteranSelectedIndex)
{
	var selectAry = new Array();
	selectAry[0] = '<option value="">';
	var len = veteranstatus.length;
	for (var i=0; i<len; i++) 
	{
		selectAry[i+1] = '<option value="'+veteranstatus[i].hrctry_code+'"';
		if ((i+1) == veteranSelectedIndex)
			selectAry[i+1] += ' selected>';
		else
			selectAry[i+1] += '>';
		selectAry[i+1] += veteranstatus[i].country_code+" - "+veteranstatus[i].description+" - "+veteranstatus[i].hrctry_code;
	}
	return selectAry.join("");
}

/*
 *		Job Requisition Logic
 */
var error = false;
var error1 = false;
var error2 = false;
var open1desc = "";
var open2desc = "";
var open3desc = "";
var position1desc = "";
var position2desc = "";
var position3desc = "";
var jobs1desc = "";
var jobs2desc = "";
var jobs3desc = "";
var objj;

function BackToAllOpenings()
{
	var nextFunc = function()
	{
		StoreGeneralInterestData();
		GetAllOpenings();
	};
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

function GetAllOpenings()
{
   	if (!jbreq)	
   	{
   		if (alphadata11 == 'Y') 
   		{
       		Pajobreq = new Array(0);	  
       		var dmeObj = new DMEObject(authUser.prodline,"pajobreq");
       		dmeObj.out = "JAVASCRIPT";
	       	dmeObj.index = "pjrset1";
       		dmeObj.sortasc = "external-start";
   	       	dmeObj.max = "300";
	       	dmeObj.field = "requisition;description;external-start;external-stop";
	       	dmeObj.key = parseFloat(authUser.company)+"=";
       		dmeObj.select = "external-start!=00000000&external-start<="+todaydate;
	       	dmeObj.exclude = "drill;keys;sorts";
	       	dmeObj.debug = false;
       		DME(dmeObj,"jsreturn");
    	} 
   		else
         	GetPositionOpenings();
   	} 
   	else
    	DisplayAllOpenings();
}

function DspPajobreq()
{
   	if (self.jsreturn.NbrRecs) 
   	{
   		for (var i=0; i<self.jsreturn.record.length; i++) 
   		{
   			index = Pajobreq.length
   			Objp = self.jsreturn.record[i]
   			if ((formjsDate(formatDME(Objp.external_stop)) >= todaydate) || (formjsDate(formatDME(Objp.external_stop)) == 00000000)) 
   			{
   				Pajobreq[index] = new Object();
   				Pajobreq[index].code = Objp.requisition;
   				Pajobreq[index].description = Objp.description;
   			}
   		}
   		if (self.jsreturn.Next != '')
   			self.jsreturn.location.replace(self.jsreturn.Next);
	  	else
	  	{
	  		if (Pajobreq.length == 0)
	  			error = true;
    		GetPositionOpenings();
   		}
   	} 
   	else 
   	{
   		error = true;
	  	GetPositionOpenings();
   	}
}

function GetPositionOpenings()
{
   	if (alphadata12 == 'Y')	
   	{
   		Paposition = new Array(0)
   		var dmeObj = new DMEObject(authUser.prodline,"paposition");
   		dmeObj.out = "JAVASCRIPT";
	   	dmeObj.index = "posset1";
	   	dmeObj.sortasc = "effect-date";
	   	dmeObj.max = "300";
	  	dmeObj.field = "position;description;effect-date;end-date";
	  	dmeObj.key = parseFloat(authUser.company)+"=";
	  	dmeObj.cond = "active-current";
	  	dmeObj.exclude = "drill;keys;sorts";
		dmeObj.debug = false;
    	DME(dmeObj,"jsreturn");
   	} 
   	else
      	GetJobOpenings();
}

function DspPaposition()
{
   	if (self.jsreturn.NbrRecs) 
   	{
   		for (var i=0; i<self.jsreturn.record.length; i++) 
   		{
      		pindex = Paposition.length;
     		Objpt=self.jsreturn.record[i];	  	 
      		Paposition[pindex] = new Object();
      		Paposition[pindex].code = Objpt.position;
      		Paposition[pindex].description = Objpt.description;
   		}
   		if (self.jsreturn.Next != '')
      		self.jsreturn.location.replace(self.jsreturn.Next);
	  	else
    		GetJobOpenings();
   	} 
   	else 
   	{
   		error1 = true;
	  	GetJobOpenings();
   	}
}

function GetJobOpenings()
{
   	if (alphadata13 == 'Y')	
   	{
   		JobCode = new Array(0);
   		var dmeObj = new DMEObject(authUser.prodline,"jobcode");
      	dmeObj.out = "JAVASCRIPT";
	   	dmeObj.index = "jbcset1";
      	dmeObj.sortasc = "description";
      	dmeObj.max = "300";
	  	dmeObj.field = "job-code;description";
	  	dmeObj.cond = "active";
	  	dmeObj.key = parseFloat(authUser.company)+"=";
	  	dmeObj.exclude = "drill;keys;sorts";
		dmeObj.debug = false;
   		DME(dmeObj,"jsreturn");
   	} 
   	else
      	DisplayAllOpenings();
}

function DspJobcode()
{
   	if (self.jsreturn.NbrRecs) 
   	{
   		for (var i=0; i<self.jsreturn.record.length; i++) 
   		{
      		cindex =  JobCode.length 	 
    		Objob=self.jsreturn.record[i] 
      		JobCode[cindex] = new Object()
      		JobCode[cindex].code = Objob.job_code
      		JobCode[cindex].description = Objob.description
   		}
   		if (self.jsreturn.Next != '')
			self.jsreturn.location.replace(self.jsreturn.Next)
		else
			DisplayAllOpenings();
   	} 
   	else 
   	{
   	   	error2 = true;
	  	DisplayAllOpenings();
   	}
}

function DisplayAllOpenings()
{
   	var html = '<p class="fieldlabelboldleft">'+getSeaPhrase("SELECT_JOBS","ESS")+'</p>'
	html += '<form name="jobreq">'
	html += '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;margin-left:auto;margin-right:auto" role="presentation">'
   	var toolTip;
	if ((alphadata11 == 'Y') && (!error)) 
   	{
   		var openingsLbl = getSeaPhrase("CURRENT_JOB_OPENINGS","ESS"); 
		html += '<tr><td class="plaintablerowheader" style="width:40%">'+openingsLbl+'</td><td>&nbsp;</td></tr>'
   		html += '<tr><td class="plaintablerowheader" style="width:40%"><label for="open1"><span class="offscreen">'+openingsLbl+'&nbsp;</span>'+getSeaPhrase("JOB_OPENING_1","SEA")+'</label>'
   		html += '</td><td class="plaintablecell">'	
		if (emssObjInstance.emssObj.filterSelect)
		{			
			toolTip = dmeFieldToolTip("open1");
			html += '<input class="inputbox" type="text" id="open1" name="open1" fieldnm="open1" value="'+open1+'" size="9" maxlength="9" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'open1\');">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'open1\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
			+ '<span id="open1Desc" style="width:200px" class="fieldlabel">'+open1desc+'</span>'
		}
		else
		{
   			if (open1)	
	 			html += '<select class="inputbox" id="open1" name="open1">'+BuildJobOpen(open1)+'</select>'
    		else
				html += '<select class="inputbox" id="open1" name="open1">'+BuildJobOpen("")+'</select>'
		}
		html += '</td></tr>'
   		html += '<tr><td class="plaintablerowheader" style="width:40%"><label for="open2"><span class="offscreen">'+openingsLbl+'&nbsp;</span>'+getSeaPhrase("JOB_OPENING_2","SEA")+'</label>'
		html += '</td><td class="plaintablecell">'	
		if (emssObjInstance.emssObj.filterSelect)
		{
			toolTip = dmeFieldToolTip("open2");
			html += '<input class="inputbox" type="text" id="open2" name="open2" fieldnm="open2" value="'+open2+'" size="9" maxlength="9" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'open2\');">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'open2\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
			+ '<span id="open2Desc" style="width:200px" class="fieldlabel">'+open2desc+'</span>'
		}
		else
		{
    		if (open2) 
				html += '<select class="inputbox" id="open2" name="open2">'+BuildJobOpen(open2)+'</select>'
    		else 
				html += '<select class="inputbox" id="open2" name="open2">'+BuildJobOpen("")+'</select>'
		}
		html += '</td></tr>'
		html += '<tr><td class="plaintablerowheaderborderbottom" style="width:40%"><label for="open3"><span class="offscreen">'+openingsLbl+'&nbsp;</span>'+getSeaPhrase("JOB_OPENING_3","SEA")+'</label>'
		html += '</td><td class="plaintablecell">'	
		if (emssObjInstance.emssObj.filterSelect)
		{
			toolTip = dmeFieldToolTip("open3");
			html += '<input class="inputbox" type="text" id="open3" name="open3" fieldnm="open3" value="'+open3+'" size="9" maxlength="9" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'open3\');">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'open3\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
			+ '<span id="open3Desc" style="width:200px" class="fieldlabel">'+open2desc+'</span>'
		}
		else
		{
    		if (open3) 
				html += '<select class="inputbox" id="open3" name="open3">'+BuildJobOpen(open3)+'</select>'
    		else 
				html += '<select class="inputbox" id="open3" name="open3">'+BuildJobOpen("")+'</select>'
		}
		html += '</td></tr>'
	} 
   	else 
   	{
   		if (error)
			html += '<tr><td class="fieldlabelbold" style="text-align:center" colspan="2">'+getSeaPhrase("NO_JOB_OPENINGS","ESS")+'</td></tr>'
	}
  	if ((alphadata12 == 'Y') && (!error1)) 
  	{
  		var positionsLbl = getSeaPhrase("APPLICANT_POSITIONS","ESS");
		html += '<tr><td style="height:20px;width:40%">&nbsp;</td><td class="plaintablecell">&nbsp;</td></tr>'
		html += '<tr><td class="plaintablerowheader" style="width:40%">'+positionsLbl+'</td><td>&nbsp;</td></tr>'
   	   	html += '<tr><td class="plaintablerowheader" style="width:40%"><label for="position1"><span class="offscreen">'+positionsLbl+'&nbsp;</span>'+getSeaPhrase("POSITION_1","SEA")+'</label></td>'
	   	html += '<td class="plaintablecell">'
		if (emssObjInstance.emssObj.filterSelect)
		{
			toolTip = dmeFieldToolTip("position1");
			html += '<input class="inputbox" type="text" id="position1" name="position1" fieldnm="position1" value="'+position1+'" size="12" maxlength="12" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'position1\');">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'position1\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
			+ '<span id="position1Desc" style="width:200px" class="fieldlabel">'+position1desc+'</span>'
		}
		else
		{		
	   		if (position1)
				html += '<select class="inputbox" id="position1" name="position1">'+BuildPosOpen(position1)+'</select>'
	    	else
				html += '<select class="inputbox" id="position1" name="position1">'+BuildPosOpen("")+'</select>'
		}
   		html += '</td></tr>'
   		html += '<tr><td class="plaintablerowheader" style="width:40%"><label for="position2"><span class="offscreen">'+positionsLbl+'&nbsp;</span>'+getSeaPhrase("POSITION_2","SEA")+'</label></td>'
   		html += '<td class="plaintablecell">'	
		if (emssObjInstance.emssObj.filterSelect)
		{
			toolTip = dmeFieldToolTip("position2");
			html += '<input class="inputbox" type="text" id="position2" name="position2" fieldnm="position2" value="'+position2+'" size="12" maxlength="12" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'position2\');">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'position2\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
			+ '<span id="position2Desc" style="width:200px" class="fieldlabel">'+position2desc+'</span>'
		}
		else
		{		
	   		if (position2)
				html += '<select class="inputbox" id="position2" name="position2">'+BuildPosOpen(position2)+'</select>'
	    	else
				html += '<select class="inputbox" id="position2" name="position2">'+BuildPosOpen("")+'</select>'
		}
   		html += '</td></tr>'
   		html += '<tr><td class="plaintablerowheaderborderbottom" style="width:40%"><label for="position3"><span class="offscreen">'+positionsLbl+'&nbsp;</span>'+getSeaPhrase("POSITION_3","SEA")+'</label></td>'
   		html += '<td class="plaintablecell">'	
		if (emssObjInstance.emssObj.filterSelect)
		{
			toolTip = dmeFieldToolTip("position3");
			html += '<input class="inputbox" type="text" id="position3" name="position3" fieldnm="position3" value="'+position3+'" size="12" maxlength="12" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'position3\');">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'position3\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
			+ '<span id="position3Desc" style="width:200px" class="fieldlabel">'+position3desc+'</span>'
		}
		else
		{
	   		if (position3)
	   			html += '<select class="inputbox" id="position3" name="position3">'+BuildPosOpen(position3)+'</select>'
	    	else
	    		html += '<select class="inputbox" id="position3" name="position3">'+BuildPosOpen("")+'</select>'
		}
   		html += '</td></tr>'
   	} 
  	else 
  	{
   		if (error1)
			html += '<tr><td class="fieldlabelbold" style="text-align:center" colspan="2">'+getSeaPhrase("NO_POSITIONS","ESS")+'</td></tr>'
	}
  	if ((alphadata13 == 'Y') && (!error2)) 
  	{
  		var jobsLbl = getSeaPhrase("SELECT_JOBS_UP_3","ESS")+' '+getSeaPhrase("UP_3","ESS");
		html += '<tr><td style="height:20px;width:40%">&nbsp;</td><td class="plaintablecell">&nbsp;</td></tr>'
		html += '<tr><td class="plaintablerowheader" style="width:40%">'+jobsLbl+'</td><td>&nbsp;</td></tr>'
   		html += '<tr><td class="plaintablerowheader" style="width:40%"><label for="jobs1"><span class="offscreen">'+jobsLbl+'&nbsp;</span>'+getSeaPhrase("JOB_1","SEA")+'</label></td>'
		html += '<td class="plaintablecell">'	
		if (emssObjInstance.emssObj.filterSelect)
		{
			toolTip = dmeFieldToolTip("jobs1");
			html += '<input class="inputbox" type="text" id="jobs1" name="jobs1" fieldnm="jobs1" value="'+jobs1+'" size="9" maxlength="9" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'jobs1\');">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'jobs1\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
			+ '<span id="jobs1Desc" style="width:200px" class="fieldlabel">'+jobs1desc+'</span>'
		}
		else
		{				
   			if (jobs1)
				html += '<select class="inputbox" id="jobs1" name="jobs1">'+BuildJobCode(jobs1)+'</select>'
    		else
				html += '<select class="inputbox" id="jobs1" name="jobs1">'+BuildJobCode("")+'</select>'
		}
   		html += '</td></tr>'
   		html += '<tr><td class="plaintablerowheader" style="width:40%"><label for="jobs2"><span class="offscreen">'+jobsLbl+'&nbsp;</span>'+getSeaPhrase("JOB_2","SEA")+'</label></td>'
   		html += '<td class="plaintablecell">'	
		if (emssObjInstance.emssObj.filterSelect)
		{
			toolTip = dmeFieldToolTip("jobs2");
			html += '<input class="inputbox" type="text" id="jobs2" name="jobs2" fieldnm="jobs2" value="'+jobs2+'" size="9" maxlength="9" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'jobs2\');">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'jobs2\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
			+ '<span id="jobs2Desc" style="width:200px" class="fieldlabel">'+jobs2desc+'</span>'
		}
		else
		{				
   			if (jobs2)
				html += '<select class="inputbox" id="jobs2" name="jobs2">'+BuildJobCode(jobs2)+'</select>'
    		else
				html += '<select class="inputbox" id="jobs2" name="jobs2">'+BuildJobCode("")+'</select>'
		}
   		html += '</td></tr>'
   		html += '<tr><td class="plaintablerowheaderborderbottom" style="width:40%"><label for="jobs3"><span class="offscreen">'+jobsLbl+'&nbsp;</span>'+getSeaPhrase("JOB_3","SEA")+'</label></td>'
   		html += '<td class="plaintablecell">'	
		if (emssObjInstance.emssObj.filterSelect)
		{
			toolTip = dmeFieldToolTip("jobs3");
			html += '<input class="inputbox" type="text" id="jobs3" name="jobs3" fieldnm="jobs3" value="'+jobs3+'" size="9" maxlength="9" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'jobs3\');">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'jobs3\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
			+ '<span id="jobs3Desc" style="width:200px" class="fieldlabel">'+jobs3desc+'</span>'
		}
		else
		{				
   			if (jobs3)
				html += '<select class="inputbox" id="jobs3" name="jobs3">'+BuildJobCode(jobs3)+'</select>'
    		else
				html += '<select class="inputbox" id="jobs3" name="jobs3">'+BuildJobCode("")+'</select>'
		}
   		html += '</td></tr>'
	} 
  	else 
  	{
   		if (error2)
			html += '<tr><td class="fieldlabelbold" style="text-align:center" colspan="2">'+getSeaPhrase("NO_JOBS","ESS")+'</td></tr>'
	}
  	html += '<tr><td style="width:40%">&nbsp;</td><td class="plaintablecell">'
	html += uiButton(getSeaPhrase("CONTINUE","ESS"),"parent.ProcessAllOpenings();return false")
	html += uiButton(getSeaPhrase("BACK","ESS"),"parent.BackToContactInfo();return false","margin-left:5px")
	html += uiButton(getSeaPhrase("QUIT","ESS"),"parent.CheckQuit();return false","margin-left:5px")
	html += '</td></tr></table></form>'
	self.main.document.getElementById("paneHeader").innerHTML = getSeaPhrase("JOB_INTEREST","ESS");
	self.main.document.getElementById("paneBody").innerHTML = html;
	self.main.stylePage();
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
	fitToScreen();
}

function ProcessAllOpenings()
{
  	objj = new Object();
   	StoreAllOpeningsData();
   	if ((typeof(objj.open1) != 'undefined') && (typeof(objj.open2) != 'undefined') && (typeof(objj.open3) != 'undefined')) 
   	{
		if (emssObjInstance.emssObj.filterSelect)
		{
   			if (((NonSpace(objj.open1.value) != 0) && (NonSpace(objj.open2.value) != 0)) && (open1 == open2)) 
   			{
   				setRequiredField(objj.open2, getSeaPhrase("DUPLICATE_JOB_OPENING","ESS"));
	  			return;
   			} 
   			else if ((((NonSpace(objj.open1.value) != 0)  && (NonSpace(objj.open3.value) != 0)) ||
       			((NonSpace(objj.open2.value) != 0) && (NonSpace(objj.open3.value) != 0))) && ((open1 == open3) || (open2 == open3))) 
   			{ 
  				setRequiredField(objj.open3, getSeaPhrase("DUPLICATE_JOB_OPENING","ESS"));
	  			return;
   			} 
   			else 
   			{
	   			clearRequiredField(objj.open2);
   				clearRequiredField(objj.open3);
	   		}		
		}
		else
		{
   			if (((NonSpace(objj.open1[oidx1].value) != 0) && (NonSpace(objj.open2[oidx2].value) != 0)) && (open1 == open2)) 
   			{
   				setRequiredField(objj.open2.parentNode, getSeaPhrase("DUPLICATE_JOB_OPENING","ESS"), objj.open2);
	  			return;
   			} 
   			else if ((((NonSpace(objj.open1[oidx1].value) != 0)  && (NonSpace(objj.open3[oidx3].value) != 0)) ||
       			((NonSpace(objj.open2[oidx2].value) != 0) && (NonSpace(objj.open3[oidx3].value) != 0))) && ((open1 == open3) || (open2 == open3))) 
   			{ 
  				setRequiredField(objj.open3.parentNode, getSeaPhrase("DUPLICATE_JOB_OPENING","ESS"), objj.open3);
	  			return;
   			} 
   			else 
   			{
	   			clearRequiredField(objj.open2.parentNode);
   				clearRequiredField(objj.open3.parentNode);
	   		}
	   	}	
   	}
	if (emssObjInstance.emssObj.filterSelect)
	{
   		if ((typeof(objj.position1) != 'undefined') && (typeof(objj.position2) != 'undefined') && (typeof(objj.position3) != 'undefined')) 
   		{
   			if (((NonSpace(objj.position1.value) != 0) && (NonSpace(objj.position2.value) != 0)) && (position1 == position2)) 
   			{
				setRequiredField(objj.position2, getSeaPhrase("DUPLICATE_POSITION","ESS"));
   		     	return
      		} 
   			else if ((((NonSpace(objj.position1.value) != 0) && (NonSpace(objj.position3.value) != 0)) ||
			((NonSpace(objj.position2.value) != 0) && (NonSpace(objj.position3.value) != 0))) &&
			((position1 == position3) || (position2 == position3))) 
      		{
      			setRequiredField(objj.position3, getSeaPhrase("DUPLICATE_POSITION","ESS"));
        		return;
			} 
      		else 
      		{
   				clearRequiredField(objj.position2);
   				clearRequiredField(objj.position3);
		   	}
   		}		
	}
	else
	{
   		if ((typeof(objj.position1) != 'undefined') && (typeof(objj.position2) != 'undefined') && (typeof(objj.position3) != 'undefined')) 
   		{
   			if (((NonSpace(objj.position1[pidx1].value) != 0) && (NonSpace(objj.position2[pidx2].value) != 0)) && (position1 == position2))	
   			{
   				setRequiredField(objj.position2.parentNode, getSeaPhrase("DUPLICATE_POSITION","ESS"), objj.position2);
   		     	return;
      		} 
   			else if ((((NonSpace(objj.position1[pidx1].value) != 0) && (NonSpace(objj.position3[pidx3].value) != 0)) ||
			((NonSpace(objj.position2[pidx2].value) != 0) && (NonSpace(objj.position3[pidx3].value) != 0))) &&
			((position1 == position3) || (position2 == position3))) 
   			{
				setRequiredField(objj.position3.parentNode, getSeaPhrase("DUPLICATE_POSITION","ESS"), objj.position3);
        		return;
			} 
      		else 
      		{
   				clearRequiredField(objj.position2.parentNode);
   				clearRequiredField(objj.position3.parentNode);
		   	}
   		}
   	}
	if (emssObjInstance.emssObj.filterSelect)
	{   
	   	if ((typeof(objj.jobs1) != 'undefined') && (typeof(objj.jobs2) != 'undefined') && (typeof(objj.jobs3) != 'undefined'))	
	   	{
	   		if (((NonSpace(objj.jobs1.value) != 0) && (NonSpace(objj.jobs2.value) != 0)) && (jobs1 == jobs2)) 
	   		{ 
	      		setRequiredField(objj.jobs2, getSeaPhrase("INIT_APP_1","ESS"));
	     		return;
	   		} 
	   		else if ((((NonSpace(objj.jobs1.value) != 0) && (NonSpace(objj.jobs3.value) != 0)) ||
			((NonSpace(objj.jobs2.value) != 0) && (NonSpace(objj.jobs3.value) != 0))) &&
			((jobs1 == jobs3) || (jobs2 == jobs3))) 
	   		{
	      		setRequiredField(objj.jobs3, getSeaPhrase("INIT_APP_1","ESS"));
	     		return;
	   		} 
	   		else 
	   		{
	   			clearRequiredField(objj.jobs2);
	   			clearRequiredField(objj.jobs3);
		   	}
	   	}
	} 
	else 
	{
	   	if ((typeof(objj.jobs1) != 'undefined') && (typeof(objj.jobs2) != 'undefined') && (typeof(objj.jobs3) != 'undefined'))	
	   	{
	   		if (((NonSpace(objj.jobs1[jidx1].value) != 0) && (NonSpace(objj.jobs2[jidx2].value) != 0)) && (jobs1 == jobs2))	
	   		{ 
	      		setRequiredField(objj.jobs2.parentNode, getSeaPhrase("INIT_APP_1","ESS"), objj.jobs2);
	     		return;
	   		} 
	   		else if ((((NonSpace(objj.jobs1[jidx1].value) != 0) && (NonSpace(objj.jobs3[jidx3].value) != 0)) ||
			((NonSpace(objj.jobs2[jidx2].value) != 0) && (NonSpace(objj.jobs3[jidx3].value) != 0))) &&
			((jobs1 == jobs3) || (jobs2 == jobs3))) 
	   		{
	      		setRequiredField(objj.jobs3.parentNode, getSeaPhrase("INIT_APP_1","ESS"), objj.jobs3);
	     		return;
	   		} 
	   		else 
	   		{
	   			clearRequiredField(objj.jobs2.parentNode);
	   			clearRequiredField(objj.jobs3.parentNode);
		   	}
	   	}	
	}
	var nextFunc = function()
	{
		if (emssObjInstance.emssObj.filterSelect)
			DisplayGeneralInterest();
		else
	   		GetCurrencyCodes();
	};
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

function StoreAllOpeningsData()
{
   	objj = self.main.document.jobreq;
   	if (typeof(objj.open1) != 'undefined') 
   	{
   		if (emssObjInstance.emssObj.filterSelect)
   		{
   			open1 = objj.open1.value;
   			open1desc = self.main.document.getElementById("open1Desc").innerHTML;
   		}
   		else
   		{
   			oidx1 = objj.open1.selectedIndex;
	  		open1 = objj.open1[oidx1].value;
   		}
   	}
   	if (typeof(objj.open2) != 'undefined') 
   	{
   		if (emssObjInstance.emssObj.filterSelect)
   		{
   			open2 = objj.open2.value;
   			open2desc = self.main.document.getElementById("open2Desc").innerHTML;
   		}
   		else
   		{   	
   			oidx2 = objj.open2.selectedIndex;
	  		open2 = objj.open2[oidx2].value;
   		}
   	}
   	if (typeof(objj.open3) != 'undefined') 
   	{
   		if (emssObjInstance.emssObj.filterSelect)
   		{
   			open3 = objj.open3.value;
   			open3desc = self.main.document.getElementById("open3Desc").innerHTML;	
   		}
   		else
   		{   		
   			oidx3 = objj.open3.selectedIndex;
   			open3 = objj.open3[oidx3].value;
   		}
   	}
   	if (typeof(objj.position1) != 'undefined') 
   	{
   		if (emssObjInstance.emssObj.filterSelect)
   		{
   			position1 = objj.position1.value;
   			position1desc = self.main.document.getElementById("position1Desc").innerHTML;
   		}
   		else
   		{   		
   			pidx1 = objj.position1.selectedIndex;
	  		position1 = objj.position1[pidx1].value;
   		}
   	}
   	if (typeof(objj.position2) != 'undefined') 
   	{
   		if (emssObjInstance.emssObj.filterSelect)
		{
		   	position2 = objj.position2.value;
		   	position2desc = self.main.document.getElementById("position2Desc").innerHTML;
		}
		else
   		{
		  	pidx2 = objj.position2.selectedIndex;
		  	position2 = objj.position2[pidx2].value;
   		}
   	}
   	if (typeof(objj.position3) != 'undefined') 
   	{
   		if (emssObjInstance.emssObj.filterSelect)
   		{
   			position3 = objj.position3.value;
   			position3desc = self.main.document.getElementById("position3Desc").innerHTML;
   		}
   		else
   		{   	
   			pidx3 = objj.position3.selectedIndex;
			position3 = objj.position3[pidx3].value;
   		}
   	}
   	if (typeof(objj.jobs1) != 'undefined') 
   	{
   		if (emssObjInstance.emssObj.filterSelect)
   		{
   			jobs1 = objj.jobs1.value;
   			jobs1desc = self.main.document.getElementById("jobs1Desc").innerHTML;
   		}
   		else
   		{   	
  			jidx1 = objj.jobs1.selectedIndex;
	  		jobs1 = objj.jobs1[jidx1].value;
   		}
   	}	
   	if (typeof(objj.jobs2) != 'undefined') 
   	{
   		if (emssObjInstance.emssObj.filterSelect)
   		{
   			jobs2 = objj.jobs2.value;
   			jobs2desc = self.main.document.getElementById("jobs2Desc").innerHTML;
   		}
   		else
   		{   		
 	  		jidx2 = objj.jobs2.selectedIndex;
 	  		jobs2 = objj.jobs2[jidx2].value;
   		}
   	}
   	if (typeof(objj.jobs3) != 'undefined') 
   	{
   		if (emssObjInstance.emssObj.filterSelect)
   		{
   			jobs3 = objj.jobs3.value;
   			jobs3desc = self.main.document.getElementById("jobs3Desc").innerHTML;
   		}
   		else
   		{
   			jidx3 = objj.jobs3.selectedIndex;
   			jobs3 = objj.jobs3[jidx3].value;
   		}
   	}
   	jbreq = true;
}

function BuildJobOpen(code)
{
	var selectAry = new Array();	
	var len = Pajobreq.length;
   	if (NonSpace(code) == 0)
   		selectAry[0] = '<option value="" selected>';
   	else
   		selectAry[0] = '<option value="">';
	for (var i=0; i<len; i++) 
	{
		selectAry[i+1] = '<option value="'+Pajobreq[i].code+'"'
		if (code == Pajobreq[i].code)
			selectAry[i+1] += ' selected>';
		else
			selectAry[i+1] += '>';
		selectAry[i+1] += Pajobreq[i].description;
	}
	return selectAry.join("");
}

function BuildPosOpen(code)
{
	var selectAry = new Array();
	var len = Paposition.length;
   	if (NonSpace(code) == 0)
   		selectAry[0] = '<option value="" selected>';
   	else
   		selectAry[0] = '<option value="">';	
	for (var i=0; i<len; i++) 
	{
		selectAry[i+1] = '<option value="'+Paposition[i].code+'"'
		if (code == Paposition[i].code)
			selectAry[i+1] += ' selected>';
		else
			selectAry[i+1] += '>';
		selectAry[i+1] += Paposition[i].description;
	}
	return selectAry.join("");
}

function BuildJobCode(code)
{
	var selectAry = new Array();
	var len = JobCode.length;
   	if (NonSpace(code) == 0)
   		selectAry[0] = '<option value="" selected>';
   	else
   		selectAry[0] = '<option value="">';	
	for (var i=0; i<len; i++) 
	{
		selectAry[i+1] = '<option value="'+JobCode[i].code+'"';
		if (code == JobCode[i].code)
			selectAry[i+1] += ' selected>';
		else
			selectAry[i+1] += '>';
		selectAry[i+1] += JobCode[i].description;
	}
	return selectAry.join("");
}

/*
 *		Applicant Name Logic
 */
var nosysrls = false;
var nmadflag = false;
var nowarning = false;
var countries = new Array();
var countrynames = new Array();
var ficactry = "";
countries[0] = "";
countrynames[0] = "";
var stateProvFilter = "state";
var lastnamesuffixDesc = "";
var stateDesc = "";
var countryDesc = "";

function StartApplicant()
{
	stylePage();
	var title = getSeaPhrase("INITIAL_APPLICANT","ESS");
	setWinTitle(title);
	setTaskHeader("header",title,"Applicant");
	var nextFunc = function()
	{
		StoreDateRoutines();
		todaydate = ymdtoday;
		GetCoName();
	};
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

function GetCoName()
{
   	var dmeObj = new DMEObject(authUser.prodline, "prsystem");
   	dmeObj.out = "JAVASCRIPT";
	dmeObj.index = "prsset1";
   	dmeObj.sortasc = parseInt(authUser.company,10);
	dmeObj.field = "name;auto-app";
	dmeObj.key = parseInt(authUser.company,10)+"=";
   	dmeObj.max = "1";
	dmeObj.exclude = "drill;keys;sorts";
   	DME(dmeObj, "jsreturn");
}

function DspPrsystem()
{
	var title = "";
	var html = "";
   	if (!self.jsreturn.NbrRecs) 
   	{
   	   	title = getSeaPhrase("INITIAL_APPLICANT","ESS");
		self.main.document.getElementById("paneHeader").innerHTML = title;
		html = '<p class="fieldlabelbold" style="text-align:center">'+getSeaPhrase("NO_COMPANY_INFO","ESS")+'</p>';
		self.main.document.getElementById("paneBody").innerHTML = html;
		self.main.stylePage();
		self.document.getElementById("main").style.visibility = "visible";
		removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
		return;
   	} 
   	else 
   	{
   		if (self.jsreturn.record[0].auto_app == "N") 
   		{
	   	   	title = getSeaPhrase("INITIAL_APPLICANT","ESS");
			self.main.document.getElementById("paneHeader").innerHTML = title;
			html = '<p class="fieldlabelbold" style="text-align:center">'+getSeaPhrase("NO_AUTO_APP_SETTINGS","ESS")+'</p>';
			self.main.document.getElementById("paneBody").innerHTML = html;
			self.main.stylePage();
			self.document.getElementById("main").style.visibility = "visible";
			removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
			return;
		} 
   		else
			GetSysrules();
   	}
}

function GetSysrules()
{
   	var sys_company = authUser.company.toString();
   	for (var i=sys_company.length; i<4; i++)
		sys_company = "0" + sys_company;
   	if (!nmadflag) 
   	{
   		nosysrls = false;
   		var dmeObj = new DMEObject(authUser.prodline,"sysrules");
      	dmeObj.out = "JAVASCRIPT";
    	dmeObj.index = "syrset1";
    	dmeObj.field = "alphadata1;alphadata3;alphadata4";
    	dmeObj.key = "APPLICANT" +"="+ "PA" +"="+ "APPLICANT" +"="+ sys_company;
		dmeObj.debug = false;
     	dmeObj.max = "1";
    	dmeObj.exclude = "drill;keys;sorts";
   		DME(dmeObj, "jsreturn");
   	} 
   	else
   		GrabStates('GetCountryCodes()');
}

function DspSysrules()
{
   	if (!self.jsreturn.NbrRecs)
  		nosysrls = true;
   	else 
   	{
   		alphadata11 = self.jsreturn.record[0].alphadata1_1;
   		alphadata12 = self.jsreturn.record[0].alphadata1_2;
   		alphadata13 = self.jsreturn.record[0].alphadata1_3;
   		alphadata14 = self.jsreturn.record[0].alphadata1_4;
   		alphadata3 = self.jsreturn.record[0].alphadata3;
   		alphadata4 = self.jsreturn.record[0].alphadata4;
   	}
	if (emssObjInstance.emssObj.filterSelect)
		DisplayContactInfo();
	else
   		GrabStates('GetCountryCodes()');
}

function GetCountryCodes()
{
	var dmeObj = new DMEObject(authUser.prodline, "instctrycd");
   	dmeObj.out = "JAVASCRIPT";
   	dmeObj.index = "intset1";
   	dmeObj.field = "country-code;country-desc";
   	dmeObj.key = "";
	dmeObj.debug = false
	dmeObj.max = "300";
	dmeObj.sortasc = "country-desc";
   	dmeObj.func = "ProcessCtryCodes()";
   	DME(dmeObj, "jsreturn");
}

function ProcessCtryCodes()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++) 
	{
		countries[countries.length] = self.jsreturn.record[i].country_code;
		countrynames[countrynames.length] = self.jsreturn.record[i].country_desc;
	}
	if (self.jsreturn.Next != "")
		self.jsreturn.location.replace(self.jsreturn.Next)
   	else
		GetHrCtryCodeSelect(authUser.prodline,"SU","DisplayContactInfo()");
}

function BackToContactInfo()
{
	var nextFunc = function()
	{
		StoreAllOpeningsData();
		DisplayContactInfo();	
	};
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

function DisplayContactInfo()
{
	var title = "";
   	var html = "";
   	var toolTip;
   	if (nosysrls) 
   	{
   		title = getSeaPhrase("INITIAL_APPLICANT","ESS");
		html = '<p class="fieldlabelbold" style="text-align:center">'+getSeaPhrase("NO_APPLICANT_SETUP","ESS")+'</p>';
   	} 
   	else 
   	{
   		title = getSeaPhrase("CONTACT_INFORMATION","ESS");
   		html += '<form name="nameaddrs">'
   		html += '<p class="fieldlabelboldleft">'+getSeaPhrase("CONTACT_INFO","ESS")+'</p>'	
		html += '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;margin-left:auto;margin-right:auto" role="presentation">'
		html += '<tr><td class="plaintablerowheader" style="width:40%">'+uiRequiredFooter()+'</td><td class="plaintablecell">&nbsp;</td></tr>'				
		html += '<tr><td class="plaintablerowheader" style="width:40%"><label for="ssn">'+getSeaPhrase("HOME_ADDR_16","ESS")+'</label></td>'
		html += '<td class="plaintablecell">'
		html += '<input class="inputbox" type="text" id="ssn" name="ssn" value="'+ficanbr+'" size="15" maxlength="15"></td></tr>'
		html += '<tr><td class="plaintablerowheader"><label for="firstname">'+getSeaPhrase("DEP_34","ESS")+'</label></td>'
		html += '<td class="plaintablecell">'
		html += '<input class="inputbox" type="text" id="firstname" name="firstname" value="'+firstname+'" size="15" maxlength="15">'+uiRequiredIcon()+'</td></tr>'
		html += '<tr><td class="plaintablerowheader"><label for="midlename">'+getSeaPhrase("MIDDLE_NAME","ESS")+'</label></td>'
		html += '<td class="plaintablecell">'
		html += '<input class="inputbox" type="text" id="midlename" name="midlename" value="'+midlename+'" size="12" maxlength="15"></td></tr>'
		html += '<tr><td class="plaintablerowheader"><label for="lastnameprefix">'+getSeaPhrase("NAME_PREFIX","ESS")+'</label></td>'
		html += '<td class="plaintablecell">'
		html += '<input class="inputbox" type="text" id="lastnameprefix" name="lastnameprefix" value="'+lastnameprefix+'" size="12" maxlength="15"></td></tr>'
		html += '<tr><td class="plaintablerowheader"><label for="lastname">'+getSeaPhrase("DEP_38","ESS")+'</label></td>'
		html += '<td class="plaintablecell">'
		html += '<input class="inputbox" type="text" id="lastname" name="lastname" value="'+lastname+'" size="15" maxlength="30">'+uiRequiredIcon()+'</td></tr>'
		html += '<tr><td class="plaintablerowheader"><label for="lastnamesuffix">'+getSeaPhrase("DEP_39","ESS")+'</label></td>'
		html += '<td class="plaintablecell">'
		if (emssObjInstance.emssObj.filterSelect)
		{
			toolTip = dmeFieldToolTip("lastnamesuffix");
			html += '<input class="inputbox" type="text" id="lastnamesuffix" name="lastnamesuffix" fieldnm="lastnamesuffix" value="'+lastnamesuffix+'" size="4" maxlength="4" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'lastnamesuffix\');">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'lastnamesuffix\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
			+ '<span id="lastnamesuffixDesc" style="width:200px" class="fieldlabel">'+lastnamesuffixDesc+'</span>'
		}
		else		
			html += '<select class="inputbox" id="lastnamesuffix" name="lastnamesuffix">'+DrawHrCtryCodeSelect("SU",lastnamesuffix)+'</select>'
		html += '</td></tr>'
		html += '<tr><td class="plaintablerowheader"><label for="nickname">'+getSeaPhrase("NICKNAME","ESS")+'</label></td>'
		html += '<td class="plaintablecell">'
		html += '<input class="inputbox" type="text" id="nickname" name="nickname" value="'+nickname+'" size="30" maxlength="30"></td></tr>'
		html += '<tr><td class="plaintablerowheader"><label for="addr1">'+getSeaPhrase("ADDR_1","ESS")+'</label></td>'
		html += '<td class="plaintablecell">'
		html += '<input class="inputbox" type="text" id="addr1" name="addr1" value="'+addr1+'" size="30" maxlength="30"></td></tr>'
		html += '<tr><td class="plaintablerowheader"><label for="addr2">'+getSeaPhrase("ADDR_2","ESS")+'</label></td>'
		html += '<td class="plaintablecell">'
		html += '<input class="inputbox" type="text" id="addr2" name="addr2" value="'+addr2+'" size="30" maxlength="30"></td></tr>'
		html += '<tr><td class="plaintablerowheader"><label for="addr3">'+getSeaPhrase("ADDR_3","ESS")+'</label></td>'
		html += '<td class="plaintablecell">'
		html += '<input class="inputbox" type="text" id="addr3" name="addr3" value="'+addr3+'" size="30" maxlength="30"></td></tr>'
		html += '<tr><td class="plaintablerowheader"><label for="city">'+getSeaPhrase("CITY","ESS")+'</label></td>'
		html += '<td class="plaintablecell">'
		html += '<input class="inputbox" type="text" id="city" name="city" value="'+city+'" size="15" maxlength="18"></td></tr>'
		html += '<tr><td class="plaintablerowheader"><label for="state">'+getSeaPhrase("HOME_ADDR_6","ESS")+'</label></td>'
		html += '<td class="plaintablecell">'
		if (emssObjInstance.emssObj.filterSelect)
		{
			toolTip = dmeFieldToolTip("state");
			html += '<input class="inputbox" type="text" id="state" name="state" fieldnm="state" value="'+state+'" size="2" maxlength="2" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'state\');">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'state\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
			+ uiRequiredIcon()
			+ '<span id="stateDesc" style="width:200px" class="fieldlabel">'+stateDesc+'</span>'
		}
		else
		{		
			if (state)
    			html += '<select class="inputbox" id="state" name="state">'+BuildStateSelect(state)+'</select>'
			else
    			html += '<select class="inputbox" id="state" name="state">'+BuildStateSelect("")+'</select>'
			html += uiRequiredIcon()
		}
		html += '</td></tr>'
		html += '<tr><td class="plaintablerowheader"><label for="zip">'+getSeaPhrase("HOME_ADDR_7","ESS")+'</label></td>'
		html += '<td class="plaintablecell">'
   		html += '<input class="inputbox" type="text" id="zip" name="zip" value="'+zip+'" size="10" maxlength="10"></td></tr>'
		html += '<tr><td class="plaintablerowheader"><label for="country">'+getSeaPhrase("COUNTRY_ONLY","ESS")+'</label></td>'
		html += '<td class="plaintablecell">'
		if (emssObjInstance.emssObj.filterSelect)
		{
			toolTip = dmeFieldToolTip("country");
			html += '<input class="inputbox" type="text" id="country" name="country" fieldnm="country" value="'+country+'" size="2" maxlength="2" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'country\');">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'country\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
			+ '<span id="countryDesc" style="width:200px" class="fieldlabel">'+countryDesc+'</span>'
		}
		else
		{	
   			if (country)
	  			html += '<select class="inputbox" id="country" name="country">'+BuildCtrySelect(country)+'</select>'
	   		else
  				html += '<select class="inputbox" id="country" name="country">'+BuildCtrySelect("")+'</select>'
		}
		html += '</td></tr>'
		html += '<tr><td class="plaintablerowheader"><label for="hmphonenbr">'+getSeaPhrase("HOME_PHONE_ONLY","ESS")+'</label></td>'
		html += '<td class="plaintablecell">'
   		html += '<input class="inputbox" type="text" id="hmphonenbr" name="hmphonenbr" value="'+hmphonenbr+'" size="15" maxlength="15"></td></tr>'
		html += '<tr><td class="plaintablerowheader">'			
		html += '<label id="hmctrycd" for="hmphonecntry" title="'+getSeaPhrase("COUNTRY_CODE_HELP_TEXT","ESS")+'">'+getSeaPhrase("HOME_PHONE_CNTRY_CODE_ONLY","ESS")+'<span class="offscreen">&nbsp;'+getSeaPhrase("COUNTRY_CODE_HELP_TEXT","ESS")+'</span></label></td>'
		html += '<td class="plaintablecell">'
   		html += '<input class="inputbox" type="text" id="hmphonecntry" name="hmphonecntry" value="'+hmphonecntry+'" size="15" maxlength="15"></td></tr>'
		html += '<tr><td class="plaintablerowheader"><label for="wrkphonenbr">'+getSeaPhrase("JOB_PROFILE_11","ESS")+'</label></td>'
		html += '<td class="plaintablecell">'
   		html += '<input class="inputbox" type="text" id="wrkphonenbr" name="wrkphonenbr" value="'+wrkphonenbr+'" size="15" maxlength="15"></td></tr>'
		html += '<tr><td class="plaintablerowheader"><label for="extension">'+getSeaPhrase("JOB_OPENINGS_14","ESS")+'</label></td>'
		html += '<td class="plaintablecell">'
   		html += '<input class="inputbox" type="text" id="extension" name="extension" value="'+extension+'" size="15" maxlength="15"></td></tr>'
		html += '<tr><td class="plaintablerowheader"><label id="wkctrycd" for="wrkphonecntry" title="'+getSeaPhrase("COUNTRY_CODE_HELP_TEXT","ESS")+'">'+getSeaPhrase("WORK_PHONE_CNTRY_CODE_ONLY","ESS")+'<span class="offscreen">&nbsp;'+getSeaPhrase("COUNTRY_CODE_HELP_TEXT","ESS")+'</span></label></td>'
		html += '<td class="plaintablecell">'
   		html += '<input class="inputbox" type="text" id="wrkphonecntry" name="wrkphonecntry" value="'+wrkphonecntry+'" size="15" maxlength="15"></td></tr>'
		html += '<tr><td class="plaintablerowheader"><label for="faxnbr">'+getSeaPhrase("FAX_NUMBER","ESS")+'</label></td>'
		html += '<td class="plaintablecell">'
   		html += '<input class="inputbox" type="text" id="faxnbr" name="faxnbr" value="'+faxnbr+'" size="15" maxlength="15"></td></tr>'
		html += '<tr><td class="plaintablerowheaderborderbottom"><label for="emailaddress">'+getSeaPhrase("EMAIL_ADDRESS","ESS")+'</label></td>'
		html += '<td class="plaintablecell">'
   		html += '<input class="inputbox" type="text" id="emailaddress" name="emailaddress" value="'+emailaddress+'" size="45" maxlength="60"></td></tr>'
		html += '<tr><td>&nbsp;</td>'
		html += '<td class="plaintablecell">'
   		html += uiButton(getSeaPhrase("CONTINUE","ESS"),"parent.ProcessContactInfo();return false")
	   	html += uiButton(getSeaPhrase("QUIT","ESS"),"parent.CheckQuit();return false","margin-left:5px")
		html += '</td></tr></table></form>'
	}
	self.main.document.getElementById("paneHeader").innerHTML = title;
	self.main.document.getElementById("paneBody").innerHTML = html;
	self.main.stylePage();
	self.document.getElementById("main").style.visibility = "visible";
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
	fitToScreen();
}

function ProcessContactInfo()
{
   	objn = self.main.document.forms["nameaddrs"];
   	if (NonSpace(objn.firstname.value) == 0) 
   	{
   		setRequiredField(objn.firstname, getSeaPhrase("FIRST_NAME","ESS"));
   		return;
   	} 
   	else
   		clearRequiredField(objn.firstname);
   	if (NonSpace(objn.lastname.value) == 0) 
   	{
  		setRequiredField(objn.lastname, getSeaPhrase("LAST_NAME","ESS"));
   		return;
   	} 
   	else
   		clearRequiredField(objn.lastname);
   	StoreContactInfo();
   	if (NonSpace(state) == 0 && NonSpace(country) == 0) 
   	{
   	  	if (emssObjInstance.emssObj.filterSelect)
   			setRequiredField(objn.state, getSeaPhrase("STATE_PROVINCE","ESS"));
   		else
   			setRequiredField(objn.state.parentNode, getSeaPhrase("STATE_PROVINCE","ESS"), objn.state);
	  	return;
   	} 
   	else 
   	{
   		if (emssObjInstance.emssObj.filterSelect)
   			clearRequiredField(objn.state);
   		else
   			clearRequiredField(objn.state.parentNode);
	}
   	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), CheckForDuplicateApplicant);
}

function StoreContactInfo()
{
	docn = self.main.document;
   	objn = docn.nameaddrs;
   	firstname = objn.firstname.value;
   	midlename = objn.midlename.value;
   	lastname = objn.lastname.value;
   	nickname = objn.nickname.value;
   	addr1 = objn.addr1.value;
   	addr2 = objn.addr2.value;
   	addr3 = objn.addr3.value;
   	city = objn.city.value;
   	sidx = objn.state.selectedIndex;
   	if (emssObjInstance.emssObj.filterSelect) 
   	{
   		state = objn.state.value;
   		stateDesc = docn.getElementById("stateDesc").innerHTML;
   		country	= objn.country.value;  	
   		countryDesc = docn.getElementById("countryDesc").innerHTML;
   		lastnamesuffix = objn.lastnamesuffix.value;
   		lastnamesuffixDesc = docn.getElementById("lastnamesuffixDesc").innerHTML;
   	} 
   	else 
   	{
   		state = objn.state[sidx].value;
   		cidx = objn.country.selectedIndex;
   		country = objn.country[cidx].value;
   		lastnamesuffix = objn.lastnamesuffix[objn.lastnamesuffix.selectedIndex].value;
   	}
   	zip = objn.zip.value;
   	hmphonenbr = objn.hmphonenbr.value;
   	wrkphonenbr = objn.wrkphonenbr.value;
   	faxnbr = objn.faxnbr.value;
   	emailaddress = objn.emailaddress.value;
   	ficanbr = objn.ssn.value;
   	lastnameprefix = objn.lastnameprefix.value;
   	if (NonSpace(lastnamesuffix) == 0) lastnamesuffix = "";   	
   	hmphonecntry = objn.hmphonecntry.value;
   	extension = objn.extension.value;
   	wrkphonecntry = objn.wrkphonecntry.value;
   	nmadflag = true;
}

function CheckForDuplicateApplicant()
{
   	var dmeObj = new DMEObject(authUser.prodline,"applicant");
   	dmeObj.out = "JAVASCRIPT";
   	dmeObj.index = "aplset2";
	dmeObj.field = "fica-nbr;addr1;last-name;first-name;addr2;addr3;addr4;city;state;zip";
   	dmeObj.max = "300";
	dmeObj.debug = false;
	dmeObj.key = parseInt(authUser.company,10) + "=" + escape(lastname) + "=" + escape(firstname);
   	DME(dmeObj,"jsreturn");
}

function DspApplicant()
{
   	for (var i=0; i<self.jsreturn.NbrRecs; i++) 
   	{
   		var app = self.jsreturn.record[i];
   	  	if (NonSpace(ficanbr) != 0)	
   	  	{
	  		if (ficanbr == app.fica_nbr) 
	  		{	  		
	  			removeWaitAlert();
		   		setRequiredField(objn.ssn, getSeaPhrase("DUPLICATE_APPLICANT","ESS"));
	       		return;
		   	}
	   	}
	   	if ((ficanbr == app.fica_nbr) &&
	   	(addr1 == app.addr1 || (NonSpace(addr1) == 0 && NonSpace(app.addr1) == 0)) &&
 		(addr2 == app.addr2 || (NonSpace(addr2) == 0 && NonSpace(app.addr2) == 0)) &&
 		(addr3 == app.addr3 || (NonSpace(addr3) == 0 && NonSpace(app.addr3) == 0)) &&
 		(city == app.city   || (NonSpace(city) == 0  && NonSpace(app.city) == 0))  &&
 		(state == app.state || (NonSpace(state) == 0 && NonSpace(app.state) == 0)) &&
 		(zip == app.zip     || (NonSpace(zip) == 0   && NonSpace(app.zip) == 0))) 
	   	{
	   		removeWaitAlert();
      		setRequiredField(objn.ssn, getSeaPhrase("DUPLICATE_APPLICANT","ESS"));      		
      		return;
	   	}
   	}
	clearRequiredField(objn.ssn);
	if (emssObjInstance.emssObj.filterSelect)
		DisplayAllOpenings();
   	else
   		GetAllOpenings();
}

function BuildCtrySelect(code)
{
	var selectAry = new Array();
	var len = countries.length;
	for (var i=0; i<len; i++) 
	{
		selectAry[i] = '<option value="'+countries[i]+'"';
		if (code == countries[i])
			selectAry[i] += ' selected>';
		else
			selectAry[i] += '>';
		selectAry[i] += countrynames[i];
	}
	return selectAry.join("");
}

/* Filter Select logic - start */
function performDmeFieldFilterOnChange(dmeFilter)
{
	switch (dmeFilter.getFieldNm().toLowerCase())
	{
		case "state": // state/province
		case "province":
			var filterForm = dmeFilter.getFilterForm();
			var selObj = filterForm.elements["filterField"];
			var filterField = selObj.options[selObj.selectedIndex].value;
			if ((filterField == "state") || (filterField == "province")) 
			{
				stateProvFilter = filterField;
				filterForm.elements["filterBtn"].onclick();
			}
		break;
	}
}

function performDmeFieldFilterOnLoad(dmeFilter)
{
	switch (dmeFilter.getFieldNm().toLowerCase())
	{	
		case "lastnamesuffix": // name suffix
			dmeFilter.addFilterField("hrctry-code", 4, getSeaPhrase("DEP_39","ESS"), false);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);		
			filterDmeCall(dmeFilter,
				"jsreturn",
				"hrctrycode", 
				"ctcset1", 
				"hrctry-code;description", 
				"SU", 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;	
		case "state":
			dmeFilter.addFilterField("state", 2, getSeaPhrase("STATE_ONLY","ESS"), true);
			dmeFilter.addFilterField("province", 2, getSeaPhrase("PROVINCE","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prstate",
				"psaset1",
				"state;description",
				"",
				null,
				null,
				dmeFilter.getNbrRecords(),
				null);
		break;	
		case "country":
			dmeFilter.addFilterField("country-code", 2, getSeaPhrase("COUNTRY_ONLY","ESS"), true);		
			dmeFilter.addFilterField("country-desc", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"instctrycd", 
				"intset1", 
				"country-code;country-desc", 
				"", 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;
		case "open1":
		case "open2":
		case "open3":
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);		
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pajobreq", 
				"pjrset1", 
				"requisition;description;external-start;external-stop", 
				String(authUser.company), 
				null,
       				"external-stop>="+todaydate+"|external-stop=00000000&external-start!=00000000&external-start<="+todaydate, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;
		case "position1":
		case "position2":
		case "position3":
			dmeFilter.addFilterField("position", 12, getSeaPhrase("JOB_PROFILE_8","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);	
			filterDmeCall(dmeFilter,
				"jsreturn",
				"paposition", 
				"posset3", 
				"position;description", 
				String(authUser.company), 
				"active-current", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);
		break;
		case "jobs1":
		case "jobs2":
		case "jobs3":
			dmeFilter.addFilterField("job-code", 9, getSeaPhrase("JOB_OPENINGS_6","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"jobcode", 
				"jbcset1", 
				"job-code;description;", 
				String(authUser.company), 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);					
		break;
		case "findabout":						
			dmeFilter.addFilterField("code", 10, getSeaPhrase("HIRE_SOURCE","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes", 
				"pcoset1", 
				"code;description", 
				"HS", 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);
		break;
		case "currency":
			dmeFilter.addFilterField("currency-code", 5, getSeaPhrase("QUAL_16","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"cucodes", 
				"cucset1", 
				"currency-code;description", 
				"", 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);				
		break;
		case "schedule":		
			dmeFilter.addFilterField("work-sched", 10, getSeaPhrase("WORK_SCHEDULE","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"hrwrkschd", 
				"wscset1", 
				"work-sched;effect-date;description", 
				String(authUser.company), 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;	
		case "eeoclass":	
			dmeFilter.addFilterField("hrctry-code", 4, getSeaPhrase("ETHNICITY","ESS"), false);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"hrctrycode", 
				"ctcset1", 
				"hrctry-code;description", 
				"ET", 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;
		case "veteran":	
			dmeFilter.addFilterField("hrctry-code", 4, getSeaPhrase("VETERAN_STATUS","ESS"), false);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"hrctrycode", 
				"ctcset1", 
				"hrctry-code;description", 
				"VS", 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);		
		break;		
		default: break;
	}
}

function performDmeFieldFilter(dmeFilter)
{
	switch (dmeFilter.getFieldNm().toLowerCase())
	{
		case "lastnamesuffix": // name suffix	
		filterDmeCall(dmeFilter,
			"jsreturn",
			"hrctrycode", 
			"ctcset1", 
			"hrctry-code;description", 
			"SU", 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;
		case "state":
		if (stateProvFilter == "state") 
		{
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prstate",
				"psaset1",
				"state;description",
				"",
				null,
				dmeFilter.getSelectStr(),
				dmeFilter.getNbrRecords(),
				null);
		} 
		else 
		{
			filterDmeCall(dmeFilter,
				"jsreturn",
				"prprovince",
				"ppvset1",
				"province;description",
				"",
				null,
				dmeFilter.getSelectStr(),
				dmeFilter.getNbrRecords(),
				null);
		}
		break;
		case "country":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"instctrycd", 
			"intset1", 
			"country-code;country-desc", 
			"", 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;
		case "open1":
		case "open2":
		case "open3":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pajobreq", 
			"pjrset1", 
			"requisition;description;external-start;external-stop", 
			String(authUser.company), 
			null, 
			"external-stop>="+todaydate+"|external-stop=00000000&external-start!=00000000&external-start<="+todaydate+"&"+dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;
		case "position1":
		case "position2":
		case "position3":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"paposition", 
			"posset3", 
			"position;description", 
			String(authUser.company), 
			"active-current", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);
		break;
		case "jobs1":
		case "jobs2":
		case "jobs3":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"jobcode", 
			"jbcset1", 
			"job-code;description;", 
			String(authUser.company), 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);					
		break;
		case "findabout":						
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes", 
			"pcoset1", 
			"code;description", 
			"HS", 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);
		break;
		case "currency":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"cucodes", 
			"cucset1", 
			"currency-code;description", 
			"", 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);				
		break;
		case "schedule":		
		filterDmeCall(dmeFilter,
			"jsreturn",
			"hrwrkschd", 
			"wscset1", 
			"work-sched;effect-date;description", 
			String(authUser.company), 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;
		case "eeoclass":	
		filterDmeCall(dmeFilter,
			"jsreturn",
			"hrctrycode", 
			"ctcset1", 
			"hrctry-code;description", 
			"ET", 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;
		case "veteran":	
		filterDmeCall(dmeFilter,
			"jsreturn",
			"hrctrycode", 
			"ctcset1", 
			"hrctry-code;description", 
			"VS", 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);		
		break;		
		default: break;
	}
}

function validateDmeFieldFilter(dmeFilter, filterForm)
{
	var selObj = filterForm.elements["filterField"];
	var filterField = selObj.options[selObj.selectedIndex];
	var keywords = filterForm.elements["keywords"].value;
	if (filterField.getAttribute("isNumeric") == "true") 
	{
		dmeFilter.getWindow().clearRequiredField(filterForm.elements["keywords"]);
		if (ValidNumber(filterForm.elements["keywords"], filterField.getAttribute("fieldSize"), 0) == false) 
		{
			dmeFilter.getWindow().setRequiredField(filterForm.elements["keywords"], getSeaPhrase("INVALID_NO","ESS"));
			return false;	
		}
	}
	return true;
}

function dmeFieldRecordSelected(recIndex, fieldNm)
{
	var selRec = self.jsreturn.record[recIndex];
	var appDoc = self.main.document;
	var formElm;
	switch (fieldNm.toLowerCase())
	{
		case "lastnamesuffix":
			formElm = appDoc.nameaddrs.lastnamesuffix;
			formElm.value = selRec.hrctry_code;
			try { appDoc.getElementById("lastnamesuffixDesc").innerHTML = selRec.description; } catch(e) {}
			break;
		case "state":
			formElm = appDoc.nameaddrs.state;
			if (stateProvFilter == "state")
				formElm.value = selRec.state;
			else
				formElm.value = selRec.province;
			try { appDoc.getElementById("stateDesc").innerHTML = selRec.description; } catch(e) {}
			break;
		case "country":
			formElm = appDoc.nameaddrs.country;
			formElm.value = selRec.country_code;
			try { appDoc.getElementById("countryDesc").innerHTML = selRec.country_desc; } catch(e) {}
			break;
		case "open1":
			formElm = appDoc.jobreq.open1; 
			formElm.value = selRec.requisition;
			try { appDoc.getElementById("open1Desc").innerHTML = selRec.description; } catch(e) {}
			break;
		case "open2":
			formElm = appDoc.jobreq.open2;
			formElm.value = selRec.requisition;
			try { appDoc.getElementById("open2Desc").innerHTML = selRec.description; } catch(e) {}
			break;
		case "open3":
			formElm = appDoc.jobreq.open3
			formElm.value = selRec.requisition;
			try { appDoc.getElementById("open3Desc").innerHTML = selRec.description; } catch(e) {}
			break;
		case "position1":
			formElm = appDoc.jobreq.position1;
			formElm.value = selRec.position;
			try { appDoc.getElementById("position1Desc").innerHTML = selRec.description; } catch(e) {}
			break;
		case "position2":
			formElm = appDoc.jobreq.position2;
			formElm.value = selRec.position;
			try { appDoc.getElementById("position2Desc").innerHTML = selRec.description; } catch(e) {}
			break;
		case "position3":
			formElm = appDoc.jobreq.position3
			formElm.value = selRec.position;
			try { appDoc.getElementById("position3Desc").innerHTML = selRec.description; } catch(e) {}
			break;	
		case "jobs1":
			formElm = appDoc.jobreq.jobs1;
			formElm.value = selRec.job_code;
			try { appDoc.getElementById("jobs1Desc").innerHTML = selRec.description; } catch(e) {}
			break;
		case "jobs2":
			formElm = appDoc.jobreq.jobs2;
			formElm.value = selRec.job_code;
			try { appDoc.getElementById("jobs2Desc").innerHTML = selRec.description; } catch(e) {}
			break;
		case "jobs3":
			formElm = appDoc.jobreq.jobs3;
			formElm.value = selRec.job_code;
			try { appDoc.getElementById("jobs3Desc").innerHTML = selRec.description; } catch(e) {}
			break;
		case "findabout":
			formElm = appDoc.genlinters.findabout;
			formElm.value = selRec.code;
			try { appDoc.getElementById("findaboutDesc").innerHTML = selRec.description; } catch(e) {}
			break;
		case "currency":
			formElm = appDoc.genlinters.currency;
			formElm.value = selRec.currency_code;
			try { appDoc.getElementById("currencyDesc").innerHTML = selRec.description; } catch(e) {}
			break;	
		case "schedule":
			formElm = appDoc.genlinters.schedule;
			formElm.value = selRec.work_sched;
			try { appDoc.getElementById("scheduleDesc").innerHTML = selRec.description; } catch(e) {}
			break;	
		case "eeoclass":
			formElm = appDoc.censusdata.eeoclass;
			formElm.value = selRec.hrctry_code;
			try { appDoc.getElementById("eeoclassDesc").innerHTML = selRec.description; } catch(e) {}
			break;
		case "veteran":
			formElm = appDoc.censusdata.veteran;
			formElm.value = selRec.hrctry_code;
			try { appDoc.getElementById("veteranDesc").innerHTML = selRec.description; } catch(e) {}
			break;			
		default: break;
	}
	try { filterWin.close(); } catch(e) {}
	try { formElm.focus(); } catch(e) {}
}

function getDmeFieldElement(fieldNm)
{
	var appDoc = self.main.document;
	var appForm;
	var fld = [null, null, null];
	try
	{
		switch (fieldNm.toLowerCase())
		{
			case "lastnamesuffix":
				appForm = appDoc.nameaddrs;
				fld = [self.main, appForm.lastnamesuffix, getSeaPhrase("DEP_39","ESS")];
				break;
			case "state":
				appForm = appDoc.nameaddrs;
				fld = [self.main, appForm.state, getSeaPhrase("STATE_ONLY","ESS")];
				break;
			case "country":
				appForm = appDoc.nameaddrs;
				fld = [self.main, appForm.country, getSeaPhrase("COUNTRY_ONLY","ESS")];
				break;
			case "open1":
				appForm = appDoc.jobreq;
				fld = [self.main, appForm.open1, getSeaPhrase("REQUISITION", "ESS")];
				break;
			case "open2":
				appForm = appDoc.jobreq;
				fld = [self.main, appForm.open2, getSeaPhrase("REQUISITION", "ESS")];
				break;
			case "open3":
				appForm = appDoc.jobreq;
				fld = [self.main, appForm.open3, getSeaPhrase("REQUISITION", "ESS")];
				break;
			case "position1":
				appForm = appDoc.jobreq;
				fld = [self.main, appForm.position1, getSeaPhrase("JOB_PROFILE_8","ESS")];
				break;
			case "position2":
				appForm = appDoc.jobreq;
				fld = [self.main, appForm.position2, getSeaPhrase("JOB_PROFILE_8","ESS")];
				break;
			case "position3":
				appForm = appDoc.jobreq;
				fld = [self.main, appForm.position3, getSeaPhrase("JOB_PROFILE_8","ESS")];
				break;	
			case "jobs1":
				appForm = appDoc.jobreq;
				fld = [self.main, appForm.jobs1, getSeaPhrase("JOB_OPENINGS_6","ESS")];
				break;
			case "jobs2":
				appForm = appDoc.jobreq;
				fld = [self.main, appForm.jobs2, getSeaPhrase("JOB_OPENINGS_6","ESS")];
				break;
			case "jobs3":
				appForm = appDoc.jobreq;
				fld = [self.main, appForm.jobs3, getSeaPhrase("JOB_OPENINGS_6","ESS")];
				break;
			case "findabout":
				appForm = appDoc.genlinters;
				fld = [self.main, appForm.findabout, getSeaPhrase("HIRE_SOURCE","ESS")];
				break;
			case "currency":
				appForm = appDoc.genlinters;
				fld = [self.main, appForm.currency, getSeaPhrase("QUAL_16","ESS")];
				break;	
			case "schedule":
				appForm = appDoc.genlinters;
				fld = [self.main, appForm.schedule, getSeaPhrase("WORK_SCHEDULE","ESS")];
				break;	
			case "eeoclass":
				appForm = appDoc.censusdata;
				fld = [self.main, appForm.eeoclass, getSeaPhrase("ETHNICITY","ESS")];
				break;
			case "veteran":
				appForm = appDoc.censusdata;
				fld = [self.main, appForm.veteran, getSeaPhrase("VETERAN_STATUS","ESS")];
				break;			
			default:
				break;
		}
	}
	catch(e) {}
	return fld;
}

function dmeFieldKeyUpHandler(fieldNm)
{
	//bjd
	var appDoc = self.main.document;
	switch (fieldNm.toLowerCase())
	{
		case "lastnamesuffix":
			appDoc.nameaddrs.lastnamesuffix.value = "";
			appDoc.getElementById("lastnamesuffixDesc").innerHTML = "";
			break;
		case "state":
			appDoc.nameaddrs.state.value = "";
			appDoc.getElementById("stateDesc").innerHTML = "";
			break;
		case "country":
			appDoc.nameaddrs.country.value = "";
			appDoc.getElementById("countryDesc").innerHTML = "";
			break;
		case "open1":
			appDoc.jobreq.open1.value = "";
			appDoc.getElementById("open1Desc").innerHTML = "";
			break;
		case "open2":
			appDoc.jobreq.open2.value = "";
			appDoc.getElementById("open2Desc").innerHTML = "";
			break;
		case "open3":
			appDoc.jobreq.open3.value = "";
			appDoc.getElementById("open3Desc").innerHTML = "";
			break;
		case "position1":
			appDoc.jobreq.position1.value = "";
			appDoc.getElementById("position1Desc").innerHTML = "";
			break;
		case "position2":
			appDoc.jobreq.position2.value = "";
			appDoc.getElementById("position2Desc").innerHTML = "";
			break;
		case "position3":
			appDoc.jobreq.position3.value = "";
			appDoc.getElementById("position3Desc").innerHTML = "";
			break;	
		case "jobs1":
			appDoc.jobreq.jobs1.value = "";
			appDoc.getElementById("jobs1Desc").innerHTML = "";				
			break;
		case "jobs2":
			appDoc.jobreq.jobs2.value = "";
			appDoc.getElementById("jobs2Desc").innerHTML = "";
			break;
		case "jobs3":
			appDoc.jobreq.jobs3.value = "";
			appDoc.getElementById("jobs3Desc").innerHTML = "";
			break;
		case "findabout":
			appDoc.genlinters.findabout.value = "";
			appDoc.getElementById("findaboutDesc").innerHTML = "";
			break;
		case "currency":
			appDoc.genlinters.currency.value = "";
			appDoc.getElementById("currencyDesc").innerHTML = "";
			break;	
		case "schedule":
			appDoc.genlinters.schedule.value = "";
			appDoc.getElementById("scheduleDesc").innerHTML = "";
			break;	
		case "eeoclass":
			appDoc.censusdata.eeoclass.value = "";
			appDoc.getElementById("eeoclassDesc").innerHTML = "";
			break;
		case "veteran":
			appDoc.censusdata.veteran.value = "";
			appDoc.getElementById("veteranDesc").innerHTML = "";
			break;			
		default: break;
	}	
}	

function drawDmeFieldFilterContent(dmeFilter)
{
	var selectHtml = new Array();
	var dmeRecs = self.jsreturn.record;
	var nbrDmeRecs = dmeRecs.length;
	var fieldNm = dmeFilter.getFieldNm().toLowerCase();
	var fldObj = getDmeFieldElement(fieldNm);
	var fldDesc = fldObj[2];
	switch (fieldNm)
	{
		case "lastnamesuffix": // name suffix						
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("DEP_39","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.hrctry_code) ? tmpObj.hrctry_code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'		
			break;	
		case "state":
			if (stateProvFilter == "state") 
			{
				var tmpObj;
				selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
				selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
				selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("STATE_ONLY","ESS")+'</th>'
				selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
				for (var i=0; i<nbrDmeRecs; i++)
				{
					tmpObj = dmeRecs[i];
					selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
					selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
					selectHtml[i+1] += (tmpObj.state) ? tmpObj.state : '&nbsp;'
					selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
					selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
					selectHtml[i+1] += '</a></td></tr>'
				}
			} 
			else 
			{
				var tmpObj;
				selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
				selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
				selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("PROVINCE","ESS")+'</th>'
				selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
				for (var i=0; i<nbrDmeRecs; i++)
				{
					tmpObj = dmeRecs[i];
					selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
					selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
					selectHtml[i+1] += (tmpObj.province) ? tmpObj.province : '&nbsp;'
					selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
					selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
					selectHtml[i+1] += '</a></td></tr>'
				}
			}
			if (nbrDmeRecs == 0)
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
			break;
		case "country":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("COUNTRY_ONLY","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.country_code) ? tmpObj.country_code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.country_desc) ? tmpObj.country_desc : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'			
			break;
		case "open1":
		case "open2":
		case "open3":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("REQUISITION", "ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.requisition) ? tmpObj.requisition : '&nbsp;'				
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'		
			break;
		case "position1":
		case "position2":
		case "position3":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_PROFILE_8","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.position) ? tmpObj.position : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;	
		case "jobs1":
		case "jobs2":
		case "jobs3":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_6","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.job_code) ? tmpObj.job_code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;	
		case "findabout":						
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("HIRE_SOURCE","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.code) ? tmpObj.code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'		
			break;	
		case "currency":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("QUAL_16","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.currency_code) ? tmpObj.currency_code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "schedule":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:33%">'+getSeaPhrase("WORK_SCHEDULE","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("HOME_ADDR_1","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:33%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.work_sched) ? tmpObj.work_sched : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.effect_date) ? tmpObj.effect_date : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="3" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "eeoclass":					
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("ETHNICITY","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.hrctry_code) ? tmpObj.hrctry_code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'		
			break;
		case "veteran":						
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("VETERAN_STATUS","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.hrctry_code) ? tmpObj.hrctry_code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'		
			break;			
		default: break;
	}	
	dmeFilter.getRecordElement().innerHTML = selectHtml.join("");	
}
/* Filter Select logic - end */ 

/*
 *		Applicant Work Info Logic
 */
var workschedules = new Array();
var workschedulesdescs = new Array();
var currcodes = new Array();
var currdescs = new Array();
var erramt  = false;
var error3 = false;
var gnint   = false;
currcodes[0] = "";
currdescs[0] = "";
var findaboutdesc = "";
var currencydesc = "";
var scheduledesc = "";

function GetCurrencyCodes()
{
	var dmeObj = new DMEObject(authUser.prodline, "cucodes");
   	dmeObj.out = "JAVASCRIPT";
   	dmeObj.index = "cucset1";
   	dmeObj.field = "currency-code;description";
	dmeObj.max = "600";
	dmeObj.key = "";
	dmeObj.sortasc = "description";
   	dmeObj.func = "ProcessCurrencyCodes()";
   	DME(dmeObj, "jsreturn");
}

function ProcessCurrencyCodes()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++) 
	{
		currcodes[currcodes.length] = self.jsreturn.record[i].currency_code;
		currdescs[currdescs.length] = self.jsreturn.record[i].description;	
	}
	if (self.jsreturn.Next != "")
		self.jsreturn.location.replace(self.jsreturn.Next);
	else	
		GetWorkSchedules();
}

function GetWorkSchedules()
{
	var dmeObj = new DMEObject(authUser.prodline, "hrwrkschd");
   	dmeObj.out = "JAVASCRIPT";
   	dmeObj.index = "wscset1";
   	dmeObj.field = "work-sched;description";
	dmeObj.max = "600";
	dmeObj.key = authUser.company;
	dmeObj.sortasc = "description";
   	dmeObj.func = "ProcessWorkSchedules()";
   	DME(dmeObj, "jsreturn");
}

function ProcessWorkSchedules()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++) 
	{
		workschedules[workschedules.length] = self.jsreturn.record[i].work_sched;
		workschedulesdescs[workschedulesdescs.length] = self.jsreturn.record[i].description	;
	}
	if (self.jsreturn.Next != "")
		self.jsreturn.location.replace(self.jsreturn.Next);
	else	
		GetPcodes();
}

function GetPcodes()
{
  	if (!gnint) 
  	{
   		Pcodes = new Array(0);
   		var dmeObj = new DMEObject(authUser.prodline, "pcodes");
  		dmeObj.out = "JAVASCRIPT";
		dmeObj.index = "pcoset1";
		dmeObj.max = "600";
		dmeObj.field = "type;code;description";
		dmeObj.key = "HS";
 		dmeObj.cond = "active";
 		dmeObj.exclude = "drill;keys;sorts";
   		DME(dmeObj, "jsreturn");
   	} 
   	else
   		DisplayGeneralInterest();
}

function DspPcodes()
{
   	if (self.jsreturn.NbrRecs) 
   	{
   		for (var i=0; i<self.jsreturn.record.length; i++) 
   		{
         	pindex = Pcodes.length;    
         	objpc = self.jsreturn.record[i] ;   
         	Pcodes[pindex] = new Object();
   	     	Pcodes[pindex].type = objpc.type;
   	     	Pcodes[pindex].code = objpc.code;
   	     	Pcodes[pindex].description = objpc.description;
      	}
   		if (self.jsreturn.Next!='')
      		self.jsreturn.location.replace(self.jsreturn.Next);
		else
      		DisplayGeneralInterest();
   	} 
   	else
   	{
   		error3 = true;
   		DisplayGeneralInterest();
	}
}

function BackToGeneralInterest()
{
	var nextFunc = function()
	{
		StorePrevEmployData();
		DisplayGeneralInterest();
	};
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

function DisplayGeneralInterest()
{
	var toolTip;
   	var html = '<form name="genlinters">'
	html += '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;margin-left:auto;margin-right:auto" role="presentation">'
	html += '<tr><td class="plaintablerowheader" style="width:40%"><label id="datebeginLbl" for="datebegin">'+getSeaPhrase("DATE_AVAILABLE_TO_WORK","ESS")+'</label></td>'
	html += '<td class="plaintablecell">'
	toolTip = uiDateToolTip(getSeaPhrase("DATE_AVAILABLE_TO_WORK","ESS"));
	html += '<input class="inputbox" type="text" id="datebegin" name="datebegin" value="'+datebegin1+'" size="10" maxlength="10" onchange="parent.ValidDate(this)" aria-labelledby="datebeginLbl datebeginFmt">'
	html += '<a href="javascript:;" onclick="parent.DateSelect(\'datebegin\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan('datebeginFmt')+'</td></tr>'
	if (!error3)
	{
		html += '<tr><td class="plaintablerowheader"><label for="findabout">'+getSeaPhrase("HOW_FOUND_OPENING","ESS")+'</label></td>'
		html += '<td class="plaintablecell">'
		if (emssObjInstance.emssObj.filterSelect)
		{
			toolTip = dmeFieldToolTip("findabout");
			html += '<input class="inputbox" type="text" id="findabout" name="findabout" fieldnm="findabout" value="'+findabout+'" size="10" maxlength="10" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'findabout\');">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'findabout\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
			+ '<span id="findaboutDesc" style="width:200px" class="fieldlabel">'+findaboutdesc+'</span>'
		}
		else
		{	
			if (findabout)
				html += '<select class="inputbox" id="findabout" name="findabout">'+BuildPcodes("HS",findabout)+'</select>'
			else
    			html += '<select class="inputbox" id="findabout" name="findabout">'+BuildPcodes("HS","")+'</select>'
		}
	
		html += '</td></tr>'
	}
   	var paybaseLbl = getSeaPhrase("HOW_MUCH_PAY","ESS");
	html += '<tr><td class="plaintablerowheader" style="height:20px">&nbsp;</td><td class="plaintablecell">&nbsp;</td></tr>'
	html += '<tr><td class="plaintablerowheader" style="width:40%">'+paybaseLbl+'</td><td>&nbsp;</td></tr>'
	html += '<tr><td class="plaintablerowheader">'
	html += '<label for="paybase1"><span class="offscreen">'+paybaseLbl+'&nbsp;</span>'+getSeaPhrase("FROM_PAY","SEA")+'</label></td>'
	html += '<td class="plaintablecell">'	
	html += '<input class="inputbox" type="text" id="paybase1" name="paybase1" value="'+paybase1+'" size="12" maxlength="12" onchange="parent.FormatPay(paybase1)" aria-labelledby="paybase1Lbl"></td></tr>'
	html += '<tr><td class="plaintablerowheader">'		
	html += '<label for="paybase2"><span class="offscreen">'+paybaseLbl+'&nbsp;</span>'+getSeaPhrase("TO_PAY","SEA")+'</label></td>'
	html += '<td class="plaintablecell">'	
	html += '<input class="inputbox" type="text" id="paybase2" name="paybase2" value="'+paybase2+'" size="12" maxlength="12" onchange="parent.FormatPay(paybase2)" aria-labelledby="paybase2Lbl"></td></tr>'
	html += '<tr><td class="plaintablerowheader">'		
	html += '<label for="currency"><span class="offscreen">'+paybaseLbl+'&nbsp;</span>'+getSeaPhrase("CURRENCY_TYPE_QUESTION","ESS")+'</label></td>'
	html += '<td class="plaintablecell">'
	if (emssObjInstance.emssObj.filterSelect)
	{
		toolTip = dmeFieldToolTip("currency");
		html += '<input class="inputbox" type="text" id="currency" name="currency" fieldnm="currency" value="'+currency+'" size="5" maxlength="5" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'currency\');">'
		+ '<a href="javascript:parent.openDmeFieldFilter(\'currency\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
		+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
		+ '<span id="currencyDesc" style="width:200px" class="fieldlabel">'+currencydesc+'</span>'
	}
	else
	{	
		if (currency)
			html += '<select class="inputbox" id="currency" name="currency">'+BuildCurrSelect(currency)+'</select>'
		else
			html += '<select class="inputbox" id="currency" name="currency">'+BuildCurrSelect("")+'</select>'	
	}
	html += '</td></tr>'
	html += '<tr><td class="plaintablerowheader" style="height:20px">&nbsp;</td><td class="plaintablecell">&nbsp;</td></tr>'
	html += '<tr><td class="plaintablerowheader">'
	html += '<label for="schedule">'+getSeaPhrase("WHICH_WORK_SCHEDULE","ESS")+'</label></td>'
	html += '<td class="plaintablecell">'
	if (emssObjInstance.emssObj.filterSelect)
	{
		toolTip = dmeFieldToolTip("schedule");
		html += '<input class="inputbox" type="text" id="schedule" name="schedule" fieldnm="schedule" value="'+schedule+'" size="10" maxlength="10" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'schedule\');">'
		+ '<a href="javascript:parent.openDmeFieldFilter(\'schedule\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
		+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
		+ '<span id="scheduleDesc" style="width:200px" class="fieldlabel">'+scheduledesc+'</span>'
	}
	else
	{		
		if (schedule)
			html += '<select class="inputbox" id="schedule" name="schedule">'+BuildWorkScheduleSelect(schedule)+'</select>'
		else
			html += '<select class="inputbox" id="schedule" name="schedule">'+BuildWorkScheduleSelect("")+'</select>'
	}
	html += '</td></tr>'
	html += '<tr><td class="plaintablerowheader" style="width:40%">'+getSeaPhrase("AVAILABLE_TO_TRAVEL","ESS")+'</td>'		
	html += '<td class="plaintablecell" style="padding-top:2px;padding-bottom:2px">'
	html += '<div role="radiogroup" aria-labelledby="travelLbl">'
	html += '<span id="travelLbl" class="offscreen">'+getSeaPhrase("AVAILABLE_TO_TRAVEL","ESS")+'</span>'	
	html += '<input class="inputbox" type="radio" id="travelYes" name="travavail" value="Y"'
	if (travavail0 == true)
		html += ' checked'
	html += ' role="radio"><label class="plaintablecelldisplay" for="travelYes">&nbsp;'+getSeaPhrase("YES","ESS")+'</label>'
	html += '<input class="inputbox" type="radio" id="travelNo" name="travavail" value="N"'
	if (travavail1 == true)
		html += ' checked'
	html += ' role="radio"><label class="plaintablecelldisplay" for="travelNo">&nbsp;'+getSeaPhrase("NO","ESS")+'</label>'
	html += '</div></td></tr>'
	html += '<tr><td class="plaintablerowheader">'
	html += '<label for="pcavail">'+getSeaPhrase("PERCENT_OF_TIME","ESS")+'</label></td>'
	html += '<td class="plaintablecell">'
	html += '<input class="inputbox" type="text" id="pcavail" name="pcavail" value="'+pcavail+'" size="3" maxlength="3"></td></tr>'
	html += '<tr><td class="plaintablerowheader" style="height:20px">&nbsp;</td><td class="plaintablecell">&nbsp;</td></tr>'
	html += '<tr><td class="plaintablerowheader" style="width:40%">'+getSeaPhrase("WILLING_TO_RELOCATE","ESS")+'</td>'
	html += '<td class="plaintablecell" style="padding-top:2px;padding-bottom:2px">'
	html += '<div role="radiogroup" aria-labelledby="relocateLbl">'
	html += '<span id="relocateLbl" class="offscreen">'+getSeaPhrase("WILLING_TO_RELOCATE","ESS")+'</span>'		
	html += '<input class="inputbox" type="radio" id="relocateYes" name="relocavail" value="Y"'
	if (relocavail0 == true)
		html += ' checked'
	html += ' role="radio"><label class="plaintablecelldisplay" for="relocateYes">&nbsp;'+getSeaPhrase("YES","ESS")+'</label>'
	html += '<input class="inputbox" type="radio" id="relocateNo" name="relocavail" value="N"'
	if (relocavail1 == true)
		html += ' checked'
	html += ' role="radio"><label class="plaintablecelldisplay" for="relocateNo">&nbsp;'+getSeaPhrase("NO","ESS")+'</label>'
	html += '</div></td></tr>'
	html += '<tr><td class="plaintablerowheader" style="width:40%">'+getSeaPhrase("WILLING_TO_WORK_OVERTIME","ESS")+'</td>'
	html += '<td class="plaintablecell" style="padding-top:2px;padding-bottom:2px">'
	html += '<div role="radiogroup" aria-labelledby="otLbl">'
	html += '<span id="otLbl" class="offscreen">'+getSeaPhrase("WILLING_TO_WORK_OVERTIME","ESS")+'</span>'		
	html += '<input class="inputbox" type="radio" id="otYes" name="otavail" value="Y"'
	if (otavail0 == true)
		html += ' checked'
	html += ' role="radio"><label class="plaintablecelldisplay" for="otYes">&nbsp;'+getSeaPhrase("YES","ESS")+'</label>'
	html += '<input class="inputbox" type="radio" id="otNo" name="otavail" value="N"'
	if (otavail1 == true)
		html += ' checked'
	html += ' role="radio"><label class="plaintablecelldisplay" for="otNo">&nbsp;'+getSeaPhrase("NO","ESS")+'</label>'
	html += '</div></td></tr>'
	html += '<tr><td class="plaintablerowheaderborderbottom">'
	html += '<label for="hours">'+getSeaPhrase("HOURS_PER_WEEK","ESS")+'</label></td>'
	html += '<td class="plaintablecell">'
	html += '<select class="inputbox" id="hours" name="hours">'+buildHoursSelect()+'</select></td></tr>'
	html += '<tr><td>&nbsp;</td><td class="plaintablecell">'
	html += uiButton(getSeaPhrase("CONTINUE","ESS"),"parent.ProcessGeneralInterest();return false")
	html += uiButton(getSeaPhrase("BACK","ESS"),"parent.BackToAllOpenings();return false","margin-left:5px")
	html += uiButton(getSeaPhrase("QUIT","ESS"),"parent.CheckQuit();return false","margin-left:5px")
	html += '</td></tr></table></form>'
	self.main.document.getElementById("paneHeader").innerHTML = getSeaPhrase("GENERAL_INTEREST","ESS");
	self.main.document.getElementById("paneBody").innerHTML = html;
	self.main.stylePage();
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
}

function ProcessGeneralInterest()
{
   	StoreGeneralInterestData();
   	if ((getDteDifference((ymdtoday),formjsDate(formatDME(objg.datebegin.value)))<0)) 
   	{   		
   		setRequiredField(objg.datebegin, getSeaPhrase("INIT_APP_2","ESS"));
	  	return;
   	} 
   	else if ((NonSpace(objg.datebegin.value) != 0) && (ValidDate(objg.datebegin) == false)) 
   	{   		
   		setRequiredField(objg.datebegin, getSeaPhrase("CAL_1","ESS"));
	  	return;
   	} 
   	else
   		clearRequiredField(objg.datebegin);
   	if (typeof(objg.paybase1.value) != 'undefined') 
   	{
   		if (((parseFloat(objg.paybase1.value)) <= 0)) 
   		{   			
	   		setRequiredField(objg.paybase1, getSeaPhrase("INIT_APP_3","ESS"));
   	     	return;
      	} 
   	}
   	if (typeof(objg.paybase2.value) != 'undefined') 
   	{
   		if (((parseFloat(objg.paybase2.value)) <= 0)) 
   		{			
	   		setRequiredField(objg.paybase2, getSeaPhrase("INIT_APP_3","ESS"));
   	     	return;
      	}
   	}
   	if ((typeof(objg.paybase1.value) != 'undefined') &&	(typeof(objg.paybase2.value) != 'undefined')) 
   	{
   		if ((parseFloat(objg.paybase2.value))<(parseFloat(objg.paybase1.value))) 
   		{  			
	   		setRequiredField(objg.paybase2, getSeaPhrase("INIT_APP_4","ESS"));
      		return;
      	} 
   		else
	   		clearRequiredField(objg.paybase2);
   	}
   	if ((NonSpace(objg.paybase1.value) != 0 || NonSpace(objg.paybase2.value) != 0) && NonSpace(currency) == 0) 
   	{  		
   		setRequiredField(objg.currency.parentNode, getSeaPhrase("INIT_APP_5","ESS"), objg.currency);
		return;
   	} 
   	else
		clearRequiredField(objg.currency.parentNode);
   	if ((NonSpace(objg.paybase1.value) == 0 && NonSpace(objg.paybase2.value) == 0) && NonSpace(currency) != 0) 
   	{		
   		setRequiredField(objg.paybase1, getSeaPhrase("INIT_APP_6","ESS")); 
		return; 
   	} 
   	else
 		clearRequiredField(objg.paybase1);
   	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), DisplayPrevEmploy);
}

function StoreGeneralInterestData()
{
   	objg = self.main.document.genlinters;
   	datebegin = formjsDate(formatDME(objg.datebegin.value));
   	datebegin1 = objg.datebegin.value;
   	if (!error3)
   	{
   		if (emssObjInstance.emssObj.filterSelect) 
   		{
   			findabout = objg.findabout.value;
   			findaboutdesc = self.main.document.getElementById("findaboutDesc").innerHTML;
   		} 
   		else 
   		{
   			fidx1 = objg.findabout.selectedIndex;
   			findabout = objg.findabout[fidx1].value;
   		}
   	}	
   	paybase1 = objg.paybase1.value;
   	paybase2 = objg.paybase2.value;
   	if (emssObjInstance.emssObj.filterSelect) 
   	{
   		currency = objg.currency.value;
   		currencydesc = self.main.document.getElementById("currencyDesc").innerHTML;
   	} 
   	else 
   	{
   		cucidx = objg.currency.selectedIndex;
   		currency = objg.currency[cucidx].value;
   	}
	if (emssObjInstance.emssObj.filterSelect) 
	{
		schedule = objg.schedule.value;
		scheduledesc = self.main.document.getElementById("scheduleDesc").innerHTML;
	} 
	else 
	{
   		sidx1 = objg.schedule.selectedIndex;
   		schedule = objg.schedule[sidx1].value;
   	}
   	pcavail = objg.pcavail.value;
	hoursIndex = objg.hours.selectedIndex;
	nbrfte = "&APL-NBR-FTE=" + objg.hours[hoursIndex].value;
   	otavail = GetCheckedValue("&APL-OT-AVAIL=",objg.otavail);
   	relocavail = GetCheckedValue("&APL-RELOC-AVAIL=",objg.relocavail);
   	travavail = GetCheckedValue("&APL-TRAV-AVAIL=",objg.travavail);
   	otavail0 = objg.otavail[0].checked;
   	otavail1 = objg.otavail[1].checked;
   	travavail0 = objg.travavail[0].checked;
   	travavail1 = objg.travavail[1].checked;
   	relocavail0 = objg.relocavail[0].checked;
   	relocavail1 = objg.relocavail[1].checked;
   	gnint = true;
}

function BuildCurrSelect(code)
{
	var selectAry = new Array();
	var len = currcodes.length;
   	if (NonSpace(code) == 0)
   		selectAry[0] = '<option value="" selected>';
   	else
   		selectAry[0] = '<option value="">';	
	for (var i=0; i<len; i++) 
	{
		selectAry[i+1] = '<option value="'+currcodes[i]+'"';
		if (code == currcodes[i])
			selectAry[i+1] += ' selected>';
		else
			selectAry[i+1] += '>';
		selectAry[i+1] += currdescs[i];
	}
	return selectAry.join("");
}

function buildHoursSelect()
{
	var html = '<option value=""'
	if (hoursIndex == 0)
		html += ' selected>'
	else
		html += '>'
	html += '</option>'
	html += '<option value=".25"'
	if (hoursIndex == 1)
		html += ' selected>'+getSeaPhrase("LESS_THAN_TEN","ESS")
	else
		html += '>'+getSeaPhrase("LESS_THAN_TEN","ESS")
	html += '</option>'
	html += '<option value=".50"'
	if (hoursIndex == 2)
		html += ' selected>'+getSeaPhrase("TEN_TO_NINTEEN","ESS")
	else
		html += '>'+getSeaPhrase("TEN_TO_NINTEEN","ESS")
	html += '</option>'
	html += '<option value=".75"'
	if (hoursIndex == 3)
		html += ' selected>'+getSeaPhrase("TWENTY_TO_THIRTY_NINE","ESS")
	else
		html += '>'+getSeaPhrase("TWENTY_TO_THIRTY_NINE","ESS")
	html += '</option>'
	html += '<option value="1.000"'
	if (hoursIndex == 4)
		html += ' selected>'+getSeaPhrase("FULL_TIME","ESS")
	else
		html += '>'+getSeaPhrase("FULL_TIME","ESS")
	html += '</option>'
	return html;
}

function BuildWorkScheduleSelect(code)
{
	var selectAry = new Array();	
	var len = workschedules.length;
   	if (NonSpace(code) == 0)
   		selectAry[0] = '<option value="" selected>';
   	else
   		selectAry[0] = '<option value="">';
	for (var i=0; i<len; i++) 
	{
		selectAry[i+1] = '<option value="'+workschedules[i]+'"';
		if (code == workschedules[i])
			selectAry[i+1] += ' selected>';
		else
			selectAry[i+1] += '>';
		selectAry[i+1] += workschedulesdescs[i];
	}
	return selectAry.join("");
}

function BuildPcodes(type, code)
{
	var selectAry = new Array();	
	var len = Pcodes.length;
   	if (NonSpace(code) == 0)
   		selectAry[0] = '<option value="" selected>';
   	else
   		selectAry[0] = '<option value="">';
	for (var i=0; i<len; i++) 
	{
		if (Pcodes[i].type == type)
		{	
			var len2 = selectAry.len;
			selectAry[len2] = '<option value="'+Pcodes[i].code+'"';
			if (code == Pcodes[i].code)
				selectAry[len2] += ' selected>';
			else
				selectAry[len2] += '>';
			selectAry[len2] += Pcodes[i].description;
		}
	}
	return selectAry.join("");
}

function FormatPay(objg)
{
   	if (objg.name == "paybase1")
		valpay1 = objg.value;
   	else
    	valpay2 = objg.value;
   	if (parseFloat(objg.value) <= 0) 
   	{ 		
   		setRequiredField(objg, getSeaPhrase("INIT_APP_3","ESS"));
   	  	return;
   	} 
   	else if ((objg.name == "paybase2") && ((parseFloat(valpay2)) < (parseFloat(valpay1)))) 
   	{ 		
   		setRequiredField(objg, getSeaPhrase("INIT_APP_4","ESS"));
  		return;
   	} 
   	else
   		clearRequiredField(objg);
}

function ReturnDate(date)
{
   	self.main.document.forms[0].elements[date_fld_name].value = date
}

/*
 *		Applicant Previous Employment Logic
 */
function BackToPrevEmploy()
{
	var nextFunc = function()
	{
		doupdate = false;
		ProcessCensusData();
		DisplayPrevEmploy();
	};
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

function DisplayPrevEmploy()
{
	var toolTip;
	var html = '<form name="prevemployf">'
	html += '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;margin-left:auto;margin-right:auto" role="presentation">'
	html += '<tr><td class="plaintablerowheader" style="width:40%">'+getSeaPhrase("HAVE_APPLIED_BEFORE","ESS")+'</td>'
	html += '<td class="plaintablecell" style="padding-top:2px;padding-bottom:2px">'
	html += '<div role="radiogroup" aria-labelledby="appliedLbl">'
	html += '<span id="appliedLbl" class="offscreen">'+getSeaPhrase("HAVE_APPLIED_BEFORE","ESS")+'</span>'		
	html += '<input type="radio" id="appliedYes" name="prevapply" value="Y"'
	if (prevapply0 == true)
		html += ' checked'
	html += ' role="radio"><label class="plaintablecelldisplay" for="appliedYes">&nbsp;'+getSeaPhrase("YES","ESS")+'</label>'
	html += '<input type="radio" id="appliedNo" name="prevapply" value="N"'
	if (prevapply1 == true)
		html += ' checked'
	html += ' role="radio"><label class="plaintablecelldisplay" for="appliedNo">&nbsp;'+getSeaPhrase("NO","ESS")+'</label>'
	html += '</div></td></tr>'
	html += '<tr><td class="plaintablerowheader" style="width:40%"><label for="prevlocation">'+getSeaPhrase("WHERE_APPLIED","ESS")+'</label></td>'
	html += '<td class="plaintablecell">'
	html += '<input class="inputbox" type="text" id="prevlocation" name="prevlocation" value="'+prevlocation+'" size="30" maxlength="20"></td></tr>'
	html += '<tr><td class="plaintablerowheader"><label id="prevdateLbl" for="prevdate">'+getSeaPhrase("WHEN_APPLIED","ESS")+'</label></td>'
	toolTip = uiDateToolTip(getSeaPhrase("WHEN_APPLIED","ESS"));
	html += '<td class="plaintablecell">'
	html += '<input class="inputbox" type="text" id="prevdate" name="prevdate" value="'+prevdate1+'" size="10" maxlength="10" onchange="parent.ValidDate(this)" aria-labelledby="prevdateLbl prevdateFmt">'
	html += '<a href="javascript:;" onclick="parent.DateSelect(\'prevdate\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan("prevdateFmt")+'</td></tr>'
	html += '<tr><td class="plaintablerowheader" style="height:20px">&nbsp;</td><td class="plaintablecell">&nbsp;</td></tr>'
	html += '<tr><td class="plaintablerowheader" style="width:40%">'+getSeaPhrase("PREVIOUSLY_EMPLOYED","ESS")+'</td>'
	html += '<td class="plaintablecell" style="padding-top:2px;padding-bottom:2px">'
	html += '<div role="radiogroup" aria-labelledby="prevemployLbl">'
	html += '<span id="prevemployLbl" class="offscreen">'+getSeaPhrase("PREVIOUSLY_EMPLOYED","ESS")+'</span>'		
	html += '<input type="radio" id="employedYes" name="prevemploy" value="Y"'
	if (prevemploy0 == true)
		html += ' checked'
	html += ' role="radio"><label class="plaintablecelldisplay" for="employedYes">&nbsp;'+getSeaPhrase("YES","ESS")+'</label>'
	html += '<input type="radio" id="employedNo" name="prevemploy" value="N"'
	if (prevemploy1 == true)
		html += ' checked'
	html += ' role="radio"><label class="plaintablecelldisplay" for="employedNo">&nbsp;'+getSeaPhrase("NO","ESS")+'</label>'
	html += '</div></td></tr>'
	html += '<tr><td class="plaintablerowheader"><label for="prevempnbr">'+getSeaPhrase("PREVIOUS_EMP_NBR","ESS")+'</label></td>'
	html += '<td class="plaintablecell">'
	html += '<input class="inputbox" type="text" id="prevempnbr" name="prevempnbr" value="'+prevempnbr+'" size="9" maxlength="9"></td></tr>'
	var employeddatesLbl = getSeaPhrase("WHEN_EMPLOYED","ESS")
	html += '<tr><td class="plaintablerowheader" style="width:40%">'+employeddatesLbl+'</td><td class="plaintablecell"><td>&nbsp;</td></tr>'
	html += '<tr><td class="plaintablerowheader"><label id="prevbegdateLbl" for="prevbegdate"><span class="offscreen">'+employeddatesLbl+'&nbsp;</span>'+getSeaPhrase("FROM_DATE","ESS")+'</label></td>'
	toolTip = uiDateToolTip(getSeaPhrase("FROM_DATE","ESS"));
	html += '<td class="plaintablecell">'	
	html += '<input class="inputbox" type="text" id="prevbegdate" name="prevbegdate" value="'+prevbegdate1+'" size="10" maxlength="10" onchange="parent.ValidDate(this)" aria-labelledby="prevbegdateLbl prevbegdateFmt">'
	html += '<a href="javascript:;" onclick="parent.DateSelect(\'prevbegdate\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan("prevbegdateFmt")+'</td></tr>'
	html += '<tr><td class="plaintablerowheader"><label id="prevenddateLbl" for="prevenddate"><span class="offscreen">'+employeddatesLbl+'&nbsp;</span>'+getSeaPhrase("TO_DATE","ESS")+'</label></td>'
	toolTip = uiDateToolTip(getSeaPhrase("TO_DATE","ESS"));
	html += '<td class="plaintablecell">'	
	html += '<input class="inputbox" type="text" id="prevenddate" name="prevenddate" value="'+prevenddate1+'" size="10" maxlength="10" onchange="parent.ValidDate(this)" aria-labelledby="prevenddateLbl prevenddateFmt">'
	html += '<a href="javascript:" onclick="parent.DateSelect(\'prevenddate\');return false" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a>'+uiDateFormatSpan("prevenddateFmt")+'</td></tr>'
	html += '<tr><td class="plaintablerowheader"><label for="prevlocwork">'+getSeaPhrase("WHERE_EMPLOYED","ESS")+'</label></td>'
	html += '<td class="plaintablecell">'
	html += '<input class="inputbox" type="text" id="prevlocwork" name="prevlocwork" value="'+prevlocwork+'" size="30" maxlength="20"></td></tr>'
	html += '<tr><td class="plaintablerowheader" style="height:20px">&nbsp;</td><td class="plaintablecell">&nbsp;</td></tr>'
	var formernameLbl = getSeaPhrase("EMPLOYED_DIFFERENT_NAME","ESS");
	html += '<tr><td class="plaintablerowheader" style="width:40%">'+formernameLbl+'</td>'
	html += '<td class="plaintablecell"><td>&nbsp;</td></tr>'
	html += '<tr><td class="plaintablerowheader"><label for="formerfstnm"><span class="offscreen">'+formernameLbl+'&nbsp;</span>'+getSeaPhrase("DEP_34","ESS")+'</label></td>'
	html += '<td class="plaintablecell">'	
	html += '<input class="inputbox" type="text" id="formerfstnm" name="formerfstnm" value="'+formerfstname+'" size="15" maxlength="15"></td></tr>'
	html += '<tr><td class="plaintablerowheader"><label for="formermi"><span class="offscreen">'+formernameLbl+'&nbsp;</span>'+getSeaPhrase("DEP_35","ESS")+'</label></td>'
	html += '<td class="plaintablecell">'	
	html += '<input class="inputbox" type="text" id="formermi" name="formermi" value="'+formermi+'" size="1" maxlength="1"></td></tr>'
	html += '<tr><td class="plaintablerowheaderborderbottom"><label for="formerlstnm"><span class="offscreen">'+formernameLbl+'&nbsp;</span>'+getSeaPhrase("DEP_38","ESS")+'</label></td>'
	html += '</td><td class="plaintablecell">'
	html += '<input class="inputbox" type="text" id="formerlstnm" name="formerlstnm" value="'+formerlstname+'" size="15" maxlength="30"></td></tr>'
	html += '<tr><td></td><td class="plaintablecell">'
	html += uiButton(getSeaPhrase("CONTINUE","ESS"),"parent.ProcessPrvEmploym();return false")
	html += uiButton(getSeaPhrase("BACK","ESS"),"parent.BackToGeneralInterest();return false","margin-left:5px")
	html += uiButton(getSeaPhrase("QUIT","ESS"),"parent.CheckQuit();return false","margin-left:5px")
	html += '</td></tr></table></form>'
	self.main.document.getElementById("paneHeader").innerHTML = getSeaPhrase("PREVIOUS_EMPLOYMENT","ESS");
	self.main.document.getElementById("paneBody").innerHTML = html;
	self.main.stylePage();
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
}

function ProcessPrvEmploym()
{
   	StorePrevEmployData();
   	if ((!prevapply0) && (NonSpace(objpe.prevlocation.value) != 0)) 
   	{   		
   		setRequiredField(objpe.prevlocation, getSeaPhrase("INIT_APP_7","ESS"));
   		return;
   	} 
   	else
   		clearRequiredField(objpe.prevlocation);
   	if ((!prevapply0) && (NonSpace(objpe.prevdate.value) != 0)) 
   	{
   		setRequiredField(objpe.prevdate, getSeaPhrase("INIT_APP_7","ESS"));
   		return;
   	}
   	if ((NonSpace(objpe.prevdate.value) != 0) && (ValidDate(objpe.prevdate) == false))
   		return;
   	if ((NonSpace(objpe.prevdate.value) != 0) && (getDteDifference((ymdtoday),formjsDate(formatDME(objpe.prevdate.value))) > 0)) 
   	{
   		setRequiredField(objpe.prevdate, getSeaPhrase("INIT_APP_8","ESS"));
   		return;
   	} 
   	else
   		clearRequiredField(objpe.prevdate);
   	if ((!prevemploy0) && (NonSpace(objpe.prevempnbr.value) != 0)) 
   	{
      	setRequiredField(objpe.prevempnbr, getSeaPhrase("INIT_APP_9","ESS"));
      	return;
   	} 
   	else
   		clearRequiredField(objpe.prevempnbr);
   	if ((!prevemploy0) && (NonSpace(objpe.prevbegdate.value) != 0)) 
   	{
   		setRequiredField(objpe.prevbegdate, getSeaPhrase("INIT_APP_9","ESS"));
      	return;
   	}
   	if ((NonSpace(objpe.prevbegdate.value) != 0) && (ValidDate(objpe.prevbegdate) == false))
   		return;
   	if ((NonSpace(objpe.prevbegdate.value) != 0) &&	(getDteDifference((ymdtoday),formjsDate(formatDME(objpe.prevbegdate.value))) > 0)) 
   	{
  		setRequiredField(objpe.prevbegdate, getSeaPhrase("INIT_APP_10","ESS"));
      	return;
   	} 
   	else
   		clearRequiredField(objpe.prevbegdate);
   	if ((!prevemploy0) && (NonSpace(objpe.prevenddate.value) != 0))
   	{	
   		setRequiredField(objpe.prevenddate, getSeaPhrase("INIT_APP_9","ESS"));
   		return;
   	}
   	if ((NonSpace(objpe.prevenddate.value) != 0) && (ValidDate(objpe.prevenddate) == false))
      	return;
   	if ((NonSpace(objpe.prevenddate.value) != 0) && (NonSpace(objpe.prevbegdate.value) != 0) && (getDteDifference(formjsDate(formatDME(objpe.prevenddate.value)),formjsDate(formatDME(objpe.prevbegdate.value))) > 0)) 
   	{
   		setRequiredField(objpe.prevenddate, getSeaPhrase("INIT_APP_12","ESS"));
      	return;
   	}
   	if ((NonSpace(objpe.prevenddate.value) != 0) && (getDteDifference((ymdtoday),formjsDate(formatDME(objpe.prevenddate.value))) > 0)) 
   	{
      	setRequiredField(objpe.prevenddate, getSeaPhrase("INIT_APP_11","ESS"));
      	return;
   	} 
   	else
   		clearRequiredField(objpe.prevenddate);
   	if ((!prevemploy0) && (NonSpace(objpe.prevlocwork.value) != 0)) 
   	{
      	setRequiredField(objpe.prevlocwork, getSeaPhrase("INIT_APP_9","ESS"));
      	return;
   	} 
   	else
   		clearRequiredField(objpe.prevlocwork);
   	if ((!prevemploy0) && (NonSpace(objpe.formerfstnm.value) != 0)) 
   	{
    	setRequiredField(objpe.formerfstnm, getSeaPhrase("INIT_APP_9","ESS"));
   	  	return;
   	} 
   	else
   		clearRequiredField(objpe.formerfstnm);
   	if ((!prevemploy0) && (NonSpace(objpe.formermi.value) != 0)) 
   	{
    	setRequiredField(objpe.formermi, getSeaPhrase("INIT_APP_9","ESS"));
   	  	return;
   	} 
   	else
   		clearRequiredField(objpe.formermi);
   	if ((!prevemploy0) && (NonSpace(objpe.formerlstnm.value) != 0)) 
   	{
      	setRequiredField(objpe.formerlstnm, getSeaPhrase("INIT_APP_9","ESS"));
   	  	return;
   	} 
   	else
   		clearRequiredField(objpe.formerlstnm);
   	if (alphadata14 == "Y")
   	{
   		var nextFunc = function()
   		{
	   		if (emssObjInstance.emssObj.filterSelect)
	   			DisplayCensusInfo();
	   		else
	   			GetEthnicCodes();
   		};
   		showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
   	}
   	else
   		GetPA31();
}

function StorePrevEmployData()
{
   	objpe = self.main.document.forms["prevemployf"];
   	prevapply = GetCheckedValue("&APL-PREV-APPLY=",objpe.prevapply);
   	prevapply0 = objpe.prevapply[0].checked;
   	prevapply1 = objpe.prevapply[1].checked;
   	prevlocation = objpe.prevlocation.value;
   	prevdate = formjsDate(formatDME(objpe.prevdate.value));
   	prevdate1 = objpe.prevdate.value;
   	prevemploy = GetCheckedValue("&APL-PREV-EMPLOY=",objpe.prevemploy);
   	prevemploy0 = objpe.prevemploy[0].checked;
   	prevemploy1 = objpe.prevemploy[1].checked;
   	prevempnbr = objpe.prevempnbr.value;
   	prevbegdate = formjsDate(formatDME(objpe.prevbegdate.value));
   	prevbegdate1 = objpe.prevbegdate.value;
   	prevenddate = formjsDate(formatDME(objpe.prevenddate.value));
   	prevenddate1 = objpe.prevenddate.value;
   	prevlocwork = objpe.prevlocwork.value;
   	formerfstname = objpe.formerfstnm.value;
   	formermi = objpe.formermi.value;
   	formerlstname = objpe.formerlstnm.value;
}

/*
 *		Related Links Logic
 */
function DisplayRelatedLinks()
{
	var html = '<div style="padding:20px;overflow:visible">'
	html += '<p class="fieldlabelboldleft">'+getSeaPhrase("INIT_APP_19","ESS")+'</p>'
	html += '<p class="fieldlabelboldleft">'+getSeaPhrase("YOUR_APPLICANT_NBR","ESS")
	html += '<span class="plaintablecellbold" style="padding:0px">&nbsp;'+parseFloat(self.lawheader.ApplicantNumber)+'</span>.&nbsp;'+getSeaPhrase("REMEMBER_YOUR_APP_NBR","ESS")+'</p>'
	html += '<p class="fieldlabelboldleft">'+getSeaPhrase("ADDL_APPLICANT_INFO","ESS")+'</p>'
	html += '<table border="0" cellspacing="0" cellpadding="0" styler="list" role="presentation">'
	html += '<tr><td>&nbsp;</td><td>&nbsp;</td></tr>'
	html += '<tr><td>'+uiCheckmarkIcon("checkMark0","visibility:hidden")+'</td>'
	var toolTip = getSeaPhrase("INIT_APP_23","ESS")+' - '+getSeaPhrase("OPEN_LINK_TO","SEA");
	var toolTip2 = getSeaPhrase("OPEN_LINK_TO","SEA");
	html += '<td class="fieldlabelleft"><a href="javascript:parent.subTaskClicked(0);" title="'+toolTip+'">'+getSeaPhrase("INIT_APP_23","ESS")+'<span class="offscreen"> - '+toolTip2+'</span></a></td></tr>'
	html += '<tr><td>'+uiCheckmarkIcon("checkMark1","visibility:hidden")+'</td>'
	toolTip = getSeaPhrase("INIT_APP_24","ESS")+' - '+getSeaPhrase("OPEN_LINK_TO","SEA");
	html += '<td class="fieldlabelleft"><a href="javascript:parent.subTaskClicked(1);" title="'+toolTip+'">'+getSeaPhrase("INIT_APP_24","ESS")+'<span class="offscreen"> - '+toolTip2+'</span></a></td></tr>'
	html += '<tr><td>'+uiCheckmarkIcon("checkMark2","visibility:hidden")+'</td>'
	toolTip = getSeaPhrase("INIT_APP_25","ESS")+' - '+getSeaPhrase("OPEN_LINK_TO","SEA");
	html += '<td class="fieldlabelleft"><a href="javascript:parent.subTaskClicked(2);" title="'+toolTip+'">'+getSeaPhrase("INIT_APP_25","ESS")+'<span class="offscreen"> - '+toolTip2+'</span></a></td></tr>'
	html += '<tr><td>'+uiCheckmarkIcon("checkMark3","visibility:hidden")+'</td>'
	toolTip = getSeaPhrase("JOB_HISTORY","ESS")+' - '+getSeaPhrase("OPEN_LINK_TO","SEA");
	html += '<td class="fieldlabelleft"><a href="javascript:parent.subTaskClicked(3);" title="'+toolTip+'">'+getSeaPhrase("JOB_HISTORY","ESS")+'<span class="offscreen"> - '+toolTip2+'</span></a></td></tr>'
	html += '<tr><td>'+uiCheckmarkIcon("checkMark4","visibility:hidden")+'</td>'
	toolTip = getSeaPhrase("INIT_APP_27","ESS")+' - '+getSeaPhrase("OPEN_LINK_TO","SEA");
	html += '<td class="fieldlabelleft"><a href="javascript:parent.subTaskClicked(4);" title="'+toolTip+'">'+getSeaPhrase("INIT_APP_27","ESS")+'<span class="offscreen"> - '+toolTip2+'</span></a></td></tr>'
	html += '</table><p/>'
	html += uiButton(getSeaPhrase("DONE","ESS"),"parent.FinishedApp();return false")
	html += '</div>'
	self.document.getElementById("main").style.visibility = "hidden";
	self.links.document.getElementById("paneHeader").innerHTML = getSeaPhrase("APPLICATION_COMPLETE","ESS");
	self.links.document.getElementById("paneBody").innerHTML = html;
	self.links.stylePage();
	self.document.getElementById("links").style.visibility = "visible";
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.links.getWinTitle()]));
	fitToScreen();
}

function FinishedApp()
{
	self.document.getElementById("header").style.visibility = "hidden";
	self.document.getElementById("links").style.visibility = "hidden";
	self.main.location = "/lawson/xhrnet/ui/logo.htm";
}

function subTaskClicked(index)
{
   	if (index == 0)
		source = "/lawson/xhrnet/applicantcert.htm?number="+Number(self.lawheader.ApplicantNumber);
   	else if (index == 1)
   		source = "/lawson/xhrnet/applicantcomp.htm?number="+Number(self.lawheader.ApplicantNumber);
  	else if (index == 2)
   		source = "/lawson/xhrnet/applicantedu.htm?number="+Number(self.lawheader.ApplicantNumber);
   	else if (index == 3)
   		source = "/lawson/xhrnet/jobhistory.htm?number="+Number(self.lawheader.ApplicantNumber);
   	else if (index == 4) 
   		source = "/lawson/xhrnet/jobreferences.htm?number="+Number(self.lawheader.ApplicantNumber);
	self.links.document.getElementById("checkMark"+index).style.visibility = "visible";
	self.document.getElementById("links").style.visibility = "hidden";
	self.document.getElementById("subtask").src = source;
	self.document.getElementById("subtask").style.visibility = "visible";
	fitToScreen();
}

function backToLinks()
{
	self.document.getElementById("subtask").style.visibility = "hidden";
	self.document.getElementById("links").style.visibility = "visible";
	fitToScreen();
} 
