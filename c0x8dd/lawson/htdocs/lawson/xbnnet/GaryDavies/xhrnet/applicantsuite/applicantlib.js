// Version: 8-)@(#)@(201111) 09.00.01.06.00
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/applicantsuite/Attic/applicantlib.js,v 1.1.2.8 2011/07/01 21:27:05 brentd Exp $

/*
 *		Census Logic
 */
 
F_cont = false
nowarning = false
var veteranSelectedIndex = 0;
var ethniccodes = new Array()
var ethnicnames = new Array()
var veteranstatus = new Array();
var ficactry = ""
// PT 149167
ethniccodes[0] = ""
ethnicnames[0] = ""
var eeoclassdesc = ""
var veterandesc = ""

function GetEthnicCodes()
{
	if (ethniccodes.length == 1)
	{
		var object = new DMEObject(authUser.prodline, "hrctrycode");
		object.out = "JAVASCRIPT";
		object.index = "ctcset1";
		object.field = "hrctry-code;description";
		object.key = "ET";
		object.max = "600";
		object.sortasc = "description";
		object.func = "ProcessEthnicCodes()";
		DME(object, "jsreturn");
	}
	else
		GetAppVersion();
}

function ProcessEthnicCodes()
{
	for (var i=0;i<self.jsreturn.NbrRecs;i++) {
		ethniccodes[ethniccodes.length] = self.jsreturn.record[i].hrctry_code
		ethnicnames[ethnicnames.length] = self.jsreturn.record[i].description
	}
	if (self.jsreturn.Next != "")
		self.jsreturn.location.replace(self.jsreturn.Next)
	else
		GetAppVersion()
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
	
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "8.1.1" 
	&& veteranstatus.length == 0)
	{
		GetVeteranStatuses();
	}
	else
	{
		CensusForm();
	}
}

function GetVeteranStatuses()
{
	var object = new DMEObject(authUser.prodline, "hrctrycode");
	object.out = "JAVASCRIPT";
	object.index = "ctcset1";
	object.field = "country-code;hrctry-code;description";
	object.key = "VS";
	object.max = "600";
	object.cond = "active";
	object.func = "ProcessVeteranStatuses()";
	DME(object, "jsreturn");
}

function ProcessVeteranStatuses()
{
	veteranstatus = veteranstatus.concat(self.jsreturn.record);

	if (self.jsreturn.Next != "")
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		CensusForm();
}

function CensusForm()
{
	var html = ""
	html += '<p class="fieldlabelbold" style="text-align:left">'+getSeaPhrase("VOLUNTARY_INFO","ESS")+'</p>'
	html += '<form name=censusdata>'
	html += '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;margin-left:auto;margin-right:auto">'
	html += '<tr>'
	html += '<td class="fieldlabelbold" style="width:40%">'
	html += getSeaPhrase("EEO_CLASS","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	
	if (emssObjInstance.emssObj.filterSelect)
	{
		html += '<input class="inputbox" type="text" name="eeoclass" value="'+eeoclass+'" size="2" maxlength="2" onfocus="this.select()" onkeyup="this.value=\'\';document.getElementById(\'eeoclassDesc\').innerHTML=\'\';">'
		+ '<a href="javascript:parent.openDmeFieldFilter(\'eeoclass\')" style="margin-left:5px">'
		+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
		+ '<span id="eeoclassDesc" style="text-align:left;width:200px" class="fieldlabel">'+eeoclassdesc+'</span>'
	}
	else
	{	
		html += '<select class="inputbox" name=eeoclass>'
		if(eeoclass)
			html += BuildEEOSelect(eeoclass)
		else
			html += BuildEEOSelect("")
		html += '</select>'
	}
	
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td class="fieldlabelbold">'
	html += getSeaPhrase("DEP_27","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	html += '<input type=radio name=gender value="F"'
	if (gender0 == true)
		html += ' checked><span class="plaintablecelldisplay"> '+getSeaPhrase("DEP_26","ESS")
	else
		html += ' ><span class="plaintablecelldisplay"> '+getSeaPhrase("DEP_26","ESS")
	html += '<input type=radio name=gender value="M"'
	if (gender1 == true)
		html += ' checked><span class="plaintablecelldisplay"> '+getSeaPhrase("DEP_25","ESS")
	else
		html += ' ><span class="plaintablecelldisplay"> '+getSeaPhrase("DEP_25","ESS")
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td class="fieldlabelbold">'
	html += getSeaPhrase("OLDER_THAN_18","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	html += '<input type=radio name=ageflag value="Y"'
	if (ageflag0 == true)
		html += ' checked><span class="plaintablecelldisplay"> '+getSeaPhrase("YES","ESS")+'</span>'
	else
		html += ' ><span class="plaintablecelldisplay"> '+getSeaPhrase("YES","ESS")+'</span>'
	html += '<input type=radio name=ageflag value="N"'
	if (ageflag1 == true)
		html += ' checked><span class="plaintablecelldisplay"> '+getSeaPhrase("NO","ESS")+'</span>'
	else
		html += ' ><span class="plaintablecelldisplay"> '+getSeaPhrase("NO","ESS")+'</span>'
	html += '</td>'
	html += '</tr>'
	
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "8.1.1")
	{	
		html += '<tr>'
		html += '<td class="fieldlabelbold">'	
		html += getSeaPhrase("VETERAN_STATUS","ESS")
		html += '</td>'
		html += '<td class="plaintablecell">'	
		
		if (emssObjInstance.emssObj.filterSelect)
		{
			html += '<input class="inputbox" type="text" name="veteran" value="'+veteran+'" size="2" maxlength="2" onfocus="this.select()" onkeyup="this.value=\'\';document.getElementById(\'veteranDesc\').innerHTML=\'\';">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'veteran\')" style="margin-left:5px">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
			+ '<span id="veteranDesc" style="text-align:left;width:200px" class="fieldlabel">'+veterandesc+'</span>'
		}
		else
		{			
			html += '<select class="inputbox" name=veteran>'
			html += BuildVeteranSelect(veteranSelectedIndex);
			html += '</select>'	
		}
		
		html += '</td>'
		html += '</tr>'		
	}
	else
	{
		html += '<tr>'
		html += '<td class="fieldlabelbold">'
		html += getSeaPhrase("ARE_YOU_A_VETERAN","ESS")
		html += '</td>'
		html += '<td class="plaintablecell">'
		html += '<input type=radio name=veteran value="Y"'
		if (veteran0 == true)
			html += ' checked><span class="plaintablecelldisplay"> '+getSeaPhrase("YES","ESS")+'</span>'
		else
			html += ' ><span class="plaintablecelldisplay"> '+getSeaPhrase("YES","ESS")+'</span>'
		html += '<input type=radio name=veteran value="N"'
		if (veteran1 == true)
			html += ' checked><span class="plaintablecelldisplay"> '+getSeaPhrase("NO","ESS")+'</span>'
		else
			html += ' ><span class="plaintablecelldisplay"> '+getSeaPhrase("NO","ESS")+'</span>'
		html += '</td>'
		html += '</tr>'
	}
	
	html += '<tr>'
	html += '<td class="fieldlabelbold">'
	html += getSeaPhrase("ARE_YOU_DISABLED","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	html += '<input type=radio name=handicapId value="Y"'
	if (handicapId0 == true)
		html += ' checked><span class="plaintablecelldisplay"> '+getSeaPhrase("YES","ESS")+'</span>'
	else
		html += ' ><span class="plaintablecelldisplay"> '+getSeaPhrase("YES","ESS")+'</span>'
	html += '<input type=radio name=handicapId value="N"'
	if (handicapId1 == true)
		html += ' checked><span class="plaintablecelldisplay"> '+getSeaPhrase("NO","ESS")+'</span>'
	else
		html += ' ><span class="plaintablecelldisplay"> '+getSeaPhrase("NO","ESS")+'</span>'
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td></td>'
	html += '<td class="plaintablecell">'
	html += uiButton(getSeaPhrase("CONTINUE","ESS"),"parent.F_cont=true;parent.ProcessFormcd();return false")
	html += uiButton(getSeaPhrase("BACK","ESS"),"parent.ProcessFormcd();parent.DspPrvEmploym();return false")
	html += uiButton(getSeaPhrase("QUIT","ESS"),"parent.CheckQuit();return false")
	html += '</td>'
	html += '</tr>'

	self.main.document.getElementById("paneHeader").innerHTML = getSeaPhrase("CENSUS_DATA","ESS");
	self.main.document.getElementById("paneBody").innerHTML = html;
	self.main.stylePage();
}

function ProcessFormcd()
{
	objcd = self.main.document.censusdata
	if (typeof(objcd.eeoclass) != 'undefined') {
		if (emssObjInstance.emssObj.filterSelect)
		{
			eeoclass = objcd.eeoclass.value
			eeoclassdesc = self.main.document.getElementById("eeoclassDesc").innerHTML;
		}
		else
		{
			eidx = objcd.eeoclass.selectedIndex
			eeoclass = objcd.eeoclass[eidx].value
		}
	}

	gender        = GetCheckedValue("&APL-SEX=",objcd.gender)
	gender0       = objcd.gender[0].checked
	gender1       = objcd.gender[1].checked
	ageflag       = GetCheckedValue("&APL-AGE-FLAG=",objcd.ageflag)
	ageflag0      = objcd.ageflag[0].checked
	ageflag1      = objcd.ageflag[1].checked
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "8.1.1")
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
		veteran       = GetCheckedValue("&APL-VETERAN=",objcd.veteran)
		veteran0      = objcd.veteran[0].checked
		veteran1      = objcd.veteran[1].checked
	}
	handicapId    = GetCheckedValue("&APL-HANDICAP-ID=",objcd.handicapId)
	handicapId0   = objcd.handicapId[0].checked
	handicapId1   = objcd.handicapId[1].checked

	if (F_cont)
		GetPA31()
}

function fireFoxQuit(confirmWin)
{
	if (confirmWin.returnValue == "ok" || confirmWin.returnValue == "continue")
	{
		quitApplication();
	}	
}

function CheckQuit()
{
	if (seaConfirm(getSeaPhrase("QUIT_WARNING","ESS"),"",fireFoxQuit)) 
	{
		quitApplication();
	}
}

function quitApplication()
{
	self.location = "/lawson/xhrnet/ui/logo.htm";
}

function GetPA31(nowarning)
{
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"));
	
	var object       = new AGSObject(authUser.prodline, "PA31.1")
	object.event     = "ADD"
	object.rtn       = "DATA"
	object.longNames = "ALL"
	object.tds       = false
	object.callmethod="post"
   	object.field     = "FC=A"
		+ "&APL-COMPANY=" + parseInt(authUser.company,10)
		+ "&APL-APP-STATUS=" + escape(alphadata3)
		+ "&APL-FIRST-NAME=" + escape(firstname)
		+ "&APL-MIDDLE-NAME=" + escape(midlename)
		+ "&APL-LAST-NAME-PRE="	+ escape(lastnameprefix)
		+ "&APL-LAST-NAME="	+ escape(lastname)
		+ "&APL-NAME-SUFFIX=" + escape(lastnamesuffix)
	if (NonSpace(nickname) != 0)
		object.field += "&APL-NICK-NAME=" + escape(nickname)
	else
		object.field += "&APL-NICK-NAME=" + escape(firstname)
	object.field += "&APL-FICA-NBR=" + escape(ficanbr)
		+ "&APL-ADDR1="		+ escape(addr1)
		+ "&APL-ADDR2="		+ escape(addr2)
		+ "&APL-ADDR3="		+ escape(addr3)
		+ "&APL-CITY="		+ escape(city)
		+ "&APL-STATE="		+ escape(state)
		+ "&APL-ZIP="		+ escape(zip)
		+ "&APL-COUNTRY-CODE="	+ escape(country)
		+ "&APL-HM-PHONE-NBR="	+ escape(hmphonenbr)
		+ "&APL-HM-PHONE-CNTRY="+ escape(hmphonecntry)
		+ "&APL-WK-PHONE-NBR="	+ escape(wrkphonenbr)
		+ "&APL-WK-PHONE-EXT="	+ escape(extension)
		+ "&APL-WK-PHONE-CNTRY="+ escape(wrkphonecntry)
		+ "&APL-POSITION1="	+ escape(position1)
		+ "&APL-POSITION2="	+ escape(position2)
		+ "&APL-POSITION3="	+ escape(position3)
		+ "&APL-JOB1="		+ escape(jobs1)
		+ "&APL-JOB2="		+ escape(jobs2)
		+ "&APL-JOB3="		+ escape(jobs3)
		+ "&APL-DATE-AVAIL="	+ escape(datebegin)
		+ "&APL-HIRE-SOURCE="	+ escape(findabout)
		+ "&APL-BEG-PAY="	+ escape(paybase1)
		+ "&APL-END-PAY="	+ escape(paybase2)
		+ "&APL-CURRENCY-CODE="	+ escape(currency)
		+ "&APL-WORK-SCHED="	+ escape(schedule)
		+ nbrfte
		+ prevapply
		+ "&APL-PREV-LOCATION="	+ escape(prevlocation)
		+ "&APL-PREV-DATE="	+ escape(prevdate)
		+ prevemploy
		+ "&APL-PREV-EMP-NBR="	+ escape(prevempnbr)
		+ "&APL-PREV-BEG-DATE="	+ escape(prevbegdate)
		+ "&APL-PREV-END-DATE="	+ escape(prevenddate)
		+ "&APL-PREV-LOC-WORK="	+ escape(prevlocwork)
		+ "&APL-FORMER-FST-NM="	+ escape(formerfstname)
		+ "&APL-FORMER-MI="	+ escape(formermi)
		+ "&APL-FORMER-LST-NM="	+ escape(formerlstname)
		+ "&APL-EEO-CLASS="	+ escape(eeoclass)
		+ gender
		+ ageflag	
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "8.1.1")
	{	
		object.field += "&APL-VETERAN=" + escape(veteran)
	}
	else
	{
		object.field += veteran
	}	
	object.field += handicapId
		+ "&APL-EMAIL-ADDRESS="	+ escape(emailaddress)
		+ "&APL-FAX-NBR="	+ escape(faxnbr)
		+ "&APL-TRAV-PCT="	+ escape(pcavail)
		+ otavail
		+ relocavail
		+ travavail
		+ "&APL-DATE-APPLIED="+authUser.date
	if (nowarning)
	{
		object.field += "&PT-XMIT-NBR1=2&PT-XMIT-NBR2=2"
	}	
	object.func = "parent.DispPA31Msg()";
	AGS(object,"jsreturn")
}


function fireFoxPA31()
{
	GetPA31(true);
}

function DispPA31Msg()
{
	// PT 147713. Show warning message to user if invalid SSN number entered.
	if (self.lawheader.gmsgnbr == "122" || self.lawheader.gmsgnbr == "163") 
	{
		if (seaConfirm(self.lawheader.gmsg,"",fireFoxPA31)) 
		{
			GetPA31(true);
		}
		else
		{
			F_cont = false;
			removeWaitAlert();
		}
	}
	else if (self.lawheader.gmsg.substring(0,7).toUpperCase() == "WARNING")
	{
		GetPA31(true);
	}
	else if (self.lawheader.gmsgnbr == "000") 
	{
		if (error1)
		{
			removeWaitAlert();
			StartAppKnow();
		}
		else
		{
			GetPA43();
		}
	} 
	else 
	{
		F_cont = false;
		seaAlert(self.lawheader.gmsg);
		removeWaitAlert();
	}
}

function GetPA43()
{
	var swt = true
	for (var k=1; k<4; k++) 
	{
		if (!isNaN(parseFloat(eval("open"+k)))) 
		{
			if (swt)	
			{
				var object       = new AGSObject(authUser.prodline, "PA43.2")
				object.event     = "ADD"
				object.rtn       = "MESSAGE"
				object.longNames = "ALL"
				object.tds       = false
				object.field     = "FC=A"
					+ "&PT-PRA-COMPANY=" + parseFloat(authUser.company)
					+ "&PT-PRA-EMP-APP=1"
					+ "&PT-PRA-APPLICANT=" + parseFloat(self.lawheader.ApplicantNumber)
				swt = false;
			}
			object.field += "&LINE-FC"+k+"=A"
				+ "&PRA-REQUISITION"+k+"="  +  parseFloat(eval("open"+k))
				+ "&PQL-APP-STATUS"+k+"="   +  escape(alphadata3)
				+ "&PQL-DATE"+k+"="         +  escape(todaydate)
				+ "&PRA-DATE-APPLIED"+k+"=" +  escape(todaydate)
		}
	}
	if (!swt) 
	{
		object.func = "parent.DisplayMessagece()"
		AGS(object,"jsreturn")
	} 
	else
	{
		removeWaitAlert();
		StartAppKnow();
	}	
}

function DisplayMessagece()
{
	if (self.lawheader.gmsgnbr == "000")
	{
		removeWaitAlert();
		StartAppKnow();
	}
	else
	{
		seaAlert(self.lawheader.gmsg)
		removeWaitAlert();	
	}	
}

function BuildEEOSelect(eeocode)
{
	var eeoselect = new Array();
	for (var i=0; i<ethniccodes.length; i++) {
		eeoselect[i] = '<option value="' + ethniccodes[i] + '"'
		if (eeocode == ethniccodes[i])
			eeoselect[i] += ' selected>'
		else
			eeoselect[i] += '>'
		eeoselect[i] += ethnicnames[i];
	}
	return eeoselect.join("");
}

function BuildVeteranSelect(veteranSelectedIndex)
{
	var veteranselect = new Array();
	veteranselect[0] = '<option value="">'
	for (var i=0; i<veteranstatus.length; i++) {
		veteranselect[i+1] = '<option value="' + veteranstatus[i].hrctry_code + '"'
		if ((i+1) == veteranSelectedIndex)
			veteranselect[i+1] += ' selected>'
		else
			veteranselect[i+1] += '>'
		veteranselect[i+1] += veteranstatus[i].country_code + " - " + veteranstatus[i].description + " - " + veteranstatus[i].hrctry_code;
	}
	return veteranselect.join("");
}

/*
 *		Job Requisition Logic
 */

var error       = false;
var error1      = false;
var error2      = false;
var open1desc	= "";
var open2desc	= "";
var open3desc	= "";
var position1desc = "";
var position2desc = "";
var position3desc = "";
var jobs1desc = "";
var jobs2desc = "";
var jobs3desc = "";
var objj;

function GetJobOpen()
{
   	if (!jbreq)	{
   		if (alphadata11 == 'Y') {
       		Pajobreq        = new Array(0)	  
       		var object      = new DMEObject(authUser.prodline,"pajobreq")
       		object.out      = "JAVASCRIPT"
	       	object.index    = "pjrset1"
       		object.sortasc  = "external-start"
   	       	object.max      = "300"
	       	object.field    = "requisition;description;external-start;external-stop"
	       	object.key      = parseFloat(authUser.company)+"="
       		object.select   = "external-start!=00000000&external-start<="+todaydate
	       	object.exclude  = "drill;keys;sorts"
		object.debug 	= false
       		DME(object,"jsreturn")
    	} else
         	GetPosOpen()
   	} else
    	DspJobReq()
}

function DspPajobreq()
{
   	if (self.jsreturn.NbrRecs) 
   	{
    		for (var i=0; i<self.jsreturn.record.length; i++) 
    		{
       			index = Pajobreq.length
       			Objp = self.jsreturn.record[i]
       			if ((formjsDate(formatDME(Objp.external_stop)) >= todaydate) || 
       				(formjsDate(formatDME(Objp.external_stop)) == 00000000)) 
       			{
            			Pajobreq[index]             = new Object()
            			Pajobreq[index].code 	    = Objp.requisition
            			Pajobreq[index].description = Objp.description
       			}
   		}
   		if (self.jsreturn.Next!='')
      			self.jsreturn.location.replace(self.jsreturn.Next)
	  	else
	  	{
	  		if (Pajobreq.length == 0)
	  		{
	  			error = true;
    			}
    			GetPosOpen()
   		}
   	} 
   	else 
   	{
   		error = true
	  	GetPosOpen()
   	}
}

function GetPosOpen()
{
   	if (alphadata12 == 'Y')	{
   		Paposition     	= new Array(0)
   		var object     	= new DMEObject(authUser.prodline,"paposition")
      		object.out      = "JAVASCRIPT"
	   	object.index    = "posset1"
      		object.sortasc  = "effect-date"
      		object.max      = "300"
	  	object.field    = "position;description;effect-date;end-date"
	  	object.key      = parseFloat(authUser.company)+"="
      		object.cond     = "active-current"
	  	object.exclude  = "drill;keys;sorts"
		object.debug	= false
    	DME(object,"jsreturn")
   	} else
      	GetJobCode()
}

function DspPaposition()
{
   	if(self.jsreturn.NbrRecs) {
   		for(var i=0; i<self.jsreturn.record.length; i++) {
      		pindex = Paposition.length
     		Objpt=self.jsreturn.record[i]	  	 
      		Paposition[pindex] = new Object()
      		Paposition[pindex].code = Objpt.position
      		Paposition[pindex].description = Objpt.description
   		}
   		if(self.jsreturn.Next!='')
      		self.jsreturn.location.replace(self.jsreturn.Next)
	  	else
    		GetJobCode()
   	} else {
   		error1 = true
	  	GetJobCode()
   	}
}

function GetJobCode()
{
   	if (alphadata13 == 'Y')	{
   		JobCode         = new Array(0)
   		var object      = new DMEObject(authUser.prodline,"jobcode")
      	object.out      = "JAVASCRIPT"
	   	object.index    = "jbcset1"
      	object.sortasc  = "description"
      	object.max      = "300"
	  	object.field    = "job-code;description"
	  	object.cond     = "active"
	  	object.key      = parseFloat(authUser.company)+"="
	  	object.exclude  = "drill;keys;sorts"
		object.debug	= false
   		DME(object,"jsreturn")
   	} else
      	DspJobReq()
}

function DspJobcode()
{
   	if(self.jsreturn.NbrRecs) {
   		for(var i=0; i<self.jsreturn.record.length; i++) {
      		cindex =  JobCode.length 	 
    		Objob=self.jsreturn.record[i] 
      		JobCode[cindex] = new Object()
      		JobCode[cindex].code = Objob.job_code
      		JobCode[cindex].description = Objob.description
   		}
   		if(self.jsreturn.Next!='')
			self.jsreturn.location.replace(self.jsreturn.Next)
		else
			DspJobReq()
   	} else {
   	   	error2 = true
	  	DspJobReq()
   	}
}

function DspJobReq()
{       
   	var html = "";
	html = '<p class="fieldlabelbold" style="text-align:left">'
	html += getSeaPhrase("SELECT_JOBS","ESS");
	html += '</p>'

	html += '<form name="jobreq">'
	html += '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;margin-left:auto;margin-right:auto">'
   	if ((alphadata11 == 'Y') && (!error)) {
		html += '<tr>'
   		html += '<td class="plaintablerowheader" style="width:40%">'
   		html += getSeaPhrase("CURRENT_JOB_OPENINGS","ESS")
		html += '</td>'
		html += '<td class="plaintablecell">'

		if (emssObjInstance.emssObj.filterSelect)
		{
			html += '<input class="inputbox" type="text" name="open1" value="'+open1+'" size="9" maxlength="9" onfocus="this.select()" onkeyup="this.value=\'\';document.getElementById(\'open1Desc\').innerHTML=\'\';">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'open1\')" style="margin-left:5px">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
			+ '<span id="open1Desc" style="text-align:left;width:200px" class="fieldlabel">'+open1desc+'</span>'
		}
		else
		{
   			if (open1) 
	 			html += '<select class="inputbox" name=open1>' + BuildJobOpen(open1) + '</select>'
    			else 
				html += '<select class="inputbox" name=open1>' + BuildJobOpen("")    + '</select>'
		}	
		
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		// PT 124512
		// html += '<td class="plaintablerowheader">&bnsp;</td>'
		html += '<td class="plaintablerowheader">&nbsp;</td>'
		html += '<td class="plaintablecell">'
    	
		if (emssObjInstance.emssObj.filterSelect)
		{
			html += '<input class="inputbox" type="text" name="open2" value="'+open2+'" size="9" maxlength="9" onfocus="this.select()" onkeyup="this.value=\'\';document.getElementById(\'open2Desc\').innerHTML=\'\';">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'open2\')" style="margin-left:5px">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
			+ '<span id="open2Desc" style="text-align:left;width:200px" class="fieldlabel">'+open2desc+'</span>'
		}
		else
		{
		
    			if (open2) 
				html += '<select class="inputbox" name=open2>' + BuildJobOpen(open2) + '</select>'
    			else 
				html += '<select class="inputbox" name=open2>' + BuildJobOpen("")    + '</select>'
		}    	

		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheaderborderbottom">&nbsp;</td>'
		html += '<td class="plaintablecell">'
		
		if (emssObjInstance.emssObj.filterSelect)
		{
			html += '<input class="inputbox" type="text" name="open3" value="'+open3+'" size="9" maxlength="9" onfocus="this.select()" onkeyup="this.value=\'\';document.getElementById(\'open3Desc\').innerHTML=\'\';">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'open3\')" style="margin-left:5px">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
			+ '<span id="open3Desc" style="text-align:left;width:200px" class="fieldlabel">'+open2desc+'</span>'
		}
		else
		{
    			if (open2) 
				html += '<select class="inputbox" name=open3>' + BuildJobOpen(open3) + '</select>'
    			else 
				html += '<select class="inputbox" name=open3>' + BuildJobOpen("")    + '</select>'
		}		
		
		html += '</td>'
		html += '</tr>'
	} else {
   		if (error) {
			html += '<tr>'
			html += '<td class="fieldlabelbold" style="text-align:center" colspan="2">'
			html += getSeaPhrase("NO_JOB_OPENINGS","ESS")
			html += '</td>'
			html += '</tr>'
   		}
	}

  	if ((alphadata12 == 'Y') && (!error1)) {
		html += '<tr><td style="height:20px">&nbsp;</td><td class="plaintablecell">&nbsp;</td></tr>'
		html += '<tr>'
   		html += '<td class="plaintablerowheader" style="width:40%">'
		html += getSeaPhrase("APPLICANT_POSITIONS","ESS")
		html += '</td>'
		html += '<td class="plaintablecell">'
		
		if (emssObjInstance.emssObj.filterSelect)
		{
			html += '<input class="inputbox" type="text" name="position1" value="'+position1+'" size="12" maxlength="12" onfocus="this.select()" onkeyup="this.value=\'\';document.getElementById(\'position1Desc\').innerHTML=\'\';">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'position1\')" style="margin-left:5px">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
			+ '<span id="position1Desc" style="text-align:left;width:200px" class="fieldlabel">'+position1desc+'</span>'
		}
		else
		{		
	   		if (position1)
				html += '<select class="inputbox" name=position1>' + BuildPosOpen(position1) + '</select>'
	    		else
				html += '<select class="inputbox" name=position1>' + BuildPosOpen("") + '</select>'
		}
		
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheader">&nbsp;</td>'
		html += '<td class="plaintablecell">'
		
		if (emssObjInstance.emssObj.filterSelect)
		{
			html += '<input class="inputbox" type="text" name="position2" value="'+position2+'" size="12" maxlength="12" onfocus="this.select()" onkeyup="this.value=\'\';document.getElementById(\'position2Desc\').innerHTML=\'\';">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'position2\')" style="margin-left:5px">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
			+ '<span id="position2Desc" style="text-align:left;width:200px" class="fieldlabel">'+position2desc+'</span>'
		}
		else
		{		
	   		if (position2)
				html += '<select class="inputbox" name=position2>' + BuildPosOpen(position2) + '</select>'
	    		else
				html += '<select class="inputbox" name=position2>' + BuildPosOpen("") + '</select>'
		}		
		
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheaderborderbottom">&nbsp;</td>'
		html += '<td class="plaintablecell">'

		if (emssObjInstance.emssObj.filterSelect)
		{
			html += '<input class="inputbox" type="text" name="position3" value="'+position3+'" size="12" maxlength="12" onfocus="this.select()" onkeyup="this.value=\'\';document.getElementById(\'position3Desc\').innerHTML=\'\';">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'position3\')" style="margin-left:5px">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
			+ '<span id="position3Desc" style="text-align:left;width:200px" class="fieldlabel">'+position3desc+'</span>'
		}
		else
		{		
	   		if (position3)
				html += '<select class="inputbox" name=position3>' + BuildPosOpen(position3) + '</select>'
	    		else
				html += '<select class="inputbox" name=position3>' + BuildPosOpen("") + '</select>'
		}

		html += '</td>'
		html += '</tr>'
   	} else {
   		if (error1) {
			html += '<tr>'
			html += '<td class="fieldlabelbold" style="text-align:center" colspan="2">'
   			html += getSeaPhrase("NO_POSITIONS","ESS")
			html += '</td>'
			html += '</tr>'
   		}
	}
       
  	if ((alphadata13 == 'Y') && (!error2)) {
		html += '<tr><td style="height:20px">&nbsp;</td><td class="plaintablecell">&nbsp;</td></tr>'
		html += '<tr>'
   		html += '<td class="plaintablerowheader" style="width:40%">'
		html += getSeaPhrase("SELECT_JOBS_UP_3","ESS")
		html += '</td>'
		html += '<td class="plaintablecell">'
		
		if (emssObjInstance.emssObj.filterSelect)
		{
			html += '<input class="inputbox" type="text" name="jobs1" value="'+jobs1+'" size="9" maxlength="9" onfocus="this.select()" onkeyup="this.value=\'\';document.getElementById(\'jobs1Desc\').innerHTML=\'\';">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'jobs1\')" style="margin-left:5px">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
			+ '<span id="jobs1Desc" style="text-align:left;width:200px" class="fieldlabel">'+jobs1desc+'</span>'
		}
		else
		{				
   			if (jobs1)
				html += '<select class="inputbox" name=jobs1>' + BuildJobCode(jobs1) + '</select>'
    			else
				html += '<select class="inputbox" name=jobs1>' + BuildJobCode("") + '</select>'
		}
		
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheader">'
		html += getSeaPhrase("UP_3","ESS")
		html += '</td>'
		html += '<td class="plaintablecell">'
		
		if (emssObjInstance.emssObj.filterSelect)
		{
			html += '<input class="inputbox" type="text" name="jobs2" value="'+jobs2+'" size="9" maxlength="9" onfocus="this.select()" onkeyup="this.value=\'\';document.getElementById(\'jobs2Desc\').innerHTML=\'\';">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'jobs2\')" style="margin-left:5px">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
			+ '<span id="jobs2Desc" style="text-align:left;width:200px" class="fieldlabel">'+jobs2desc+'</span>'
		}
		else
		{				
   			if (jobs2)
				html += '<select class="inputbox" name=jobs2>' + BuildJobCode(jobs2) + '</select>'
    			else
				html += '<select class="inputbox" name=jobs2>' + BuildJobCode("") + '</select>'
		}		
		
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheaderborderbottom">&nbsp;</td>'
		html += '<td class="plaintablecell">'
		
		if (emssObjInstance.emssObj.filterSelect)
		{
			html += '<input class="inputbox" type="text" name="jobs3" value="'+jobs3+'" size="9" maxlength="9" onfocus="this.select()" onkeyup="this.value=\'\';document.getElementById(\'jobs3Desc\').innerHTML=\'\';">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'jobs3\')" style="margin-left:5px">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
			+ '<span id="jobs3Desc" style="text-align:left;width:200px" class="fieldlabel">'+jobs3desc+'</span>'
		}
		else
		{				
   			if (jobs3)
				html += '<select class="inputbox" name=jobs3>' + BuildJobCode(jobs3) + '</select>'
    			else
				html += '<select class="inputbox" name=jobs3>' + BuildJobCode("") + '</select>'
		}		
		
		html += '</td>'
		html += '</tr>'
	} else {
   		if (error2) {
			html += '<tr>'
			html += '<td class="fieldlabelbold" style="text-align:center" colspan="2">'
   			html += getSeaPhrase("NO_JOBS","ESS")
			html += '</td>'
			html += '</tr>'
   		}
	}
	html += '<tr>'
	html += '<td>&nbsp;</td>'
	html += '<td class="plaintablecell">'
	html += uiButton(getSeaPhrase("CONTINUE","ESS"), "parent.ProcessFormjr();return false")
	html += uiButton(getSeaPhrase("BACK","ESS"), "parent.GetDataj();parent.GetCountryCodes();return false")
	html += uiButton(getSeaPhrase("QUIT","ESS"), "parent.CheckQuit();return false")
	html += '</td>'
	html += '</tr>'
   	html += '</table>'
   	html += '</form>'

	self.main.document.getElementById("paneHeader").innerHTML = getSeaPhrase("JOB_INTEREST","ESS");
	self.main.document.getElementById("paneBody").innerHTML = html;
	self.main.stylePage();
}

function ProcessFormjr()
{
  	objj = new Object()
   	GetDataj()
   
   	if ((typeof(objj.open1) != 'undefined') && (typeof(objj.open2) != 'undefined') && (typeof(objj.open3) != 'undefined')) {
		if (emssObjInstance.emssObj.filterSelect)
		{
   			if (((NonSpace(objj.open1.value) != 0) && (NonSpace(objj.open2.value) != 0)) && (open1 == open2)) {
	   			setRequiredField(objj.open2);
   				seaAlert(getSeaPhrase("DUPLICATE_JOB_OPENING","ESS"))
	  			objj.open2.focus()
	  			return
   			} else if ((((NonSpace(objj.open1.value) != 0)  && (NonSpace(objj.open3.value) != 0)) ||
       			((NonSpace(objj.open2.value) != 0) && (NonSpace(objj.open3.value) != 0))) && ((open1 == open3) || (open2 == open3))) { 
	   			setRequiredField(objj.open3);
  				seaAlert(getSeaPhrase("DUPLICATE_JOB_OPENING","ESS"))
	  			objj.open3.focus()
	  			return
   			} else {
	   			clearRequiredField(objj.open2);
   				clearRequiredField(objj.open3);
	   		}		
		}
		else
		{
   			if (((NonSpace(objj.open1[oidx1].value) != 0) && (NonSpace(objj.open2[oidx2].value) != 0)) && (open1 == open2)) {
	   			setRequiredField(objj.open2.parentNode);
   				seaAlert(getSeaPhrase("DUPLICATE_JOB_OPENING","ESS"))
	  			objj.open2.focus()
	  			return
   			} else if ((((NonSpace(objj.open1[oidx1].value) != 0)  && (NonSpace(objj.open3[oidx3].value) != 0)) ||
       			((NonSpace(objj.open2[oidx2].value) != 0) && (NonSpace(objj.open3[oidx3].value) != 0))) && ((open1 == open3) || (open2 == open3))) { 
	   			setRequiredField(objj.open3.parentNode);
  				seaAlert(getSeaPhrase("DUPLICATE_JOB_OPENING","ESS"))
	  			objj.open3.focus()
	  			return
   			} else {
	   			clearRequiredField(objj.open2.parentNode);
   				clearRequiredField(objj.open3.parentNode);
	   		}
	   	}	
   	}   

	if (emssObjInstance.emssObj.filterSelect)
	{
   		if ((typeof(objj.position1) != 'undefined') && (typeof(objj.position2) != 'undefined')
   		&& (typeof(objj.position3) != 'undefined')) {
   			if (((NonSpace(objj.position1.value) != 0) && (NonSpace(objj.position2.value) != 0)) && (position1 == position2)) {
		   		setRequiredField(objj.position2);
				seaAlert(getSeaPhrase("DUPLICATE_POSITION","ESS"))
   		    		objj.position2.focus()
   		     		return
      			} else if ((((NonSpace(objj.position1.value) != 0) && (NonSpace(objj.position3.value) != 0)) ||
			((NonSpace(objj.position2.value) != 0) && (NonSpace(objj.position3.value) != 0))) &&
			((position1 == position3) || (position2 == position3))) {
		   		setRequiredField(objj.position3);
				seaAlert(getSeaPhrase("DUPLICATE_POSITION","ESS"))
        			objj.position3.focus()
        			return
			} else {
   				clearRequiredField(objj.position2);
   				clearRequiredField(objj.position3);
		   	}
   		}		
	}
	else
	{
   		if ((typeof(objj.position1) != 'undefined') && (typeof(objj.position2) != 'undefined')
   		&& (typeof(objj.position3) != 'undefined')) {
   			if (((NonSpace(objj.position1[pidx1].value) != 0) && (NonSpace(objj.position2[pidx2].value) != 0)) && (position1 == position2))	{
		   		setRequiredField(objj.position2.parentNode);
				seaAlert(getSeaPhrase("DUPLICATE_POSITION","ESS"))
   		    		objj.position2.focus()
   		     		return
      			} else if ((((NonSpace(objj.position1[pidx1].value) != 0) && (NonSpace(objj.position3[pidx3].value) != 0)) ||
			((NonSpace(objj.position2[pidx2].value) != 0) && (NonSpace(objj.position3[pidx3].value) != 0))) &&
			((position1 == position3) || (position2 == position3))) {
		   		setRequiredField(objj.position3.parentNode);
				seaAlert(getSeaPhrase("DUPLICATE_POSITION","ESS"))
        			objj.position3.focus()
        			return
			} else {
   				clearRequiredField(objj.position2.parentNode);
   				clearRequiredField(objj.position3.parentNode);
		   	}
   		}
   	}	
   
	if (emssObjInstance.emssObj.filterSelect)
	{   
	   	if ((typeof(objj.jobs1) != 'undefined') && (typeof(objj.jobs2) != 'undefined')
	   	&& (typeof(objj.jobs3) != 'undefined'))	{
	   		if (((NonSpace(objj.jobs1.value) != 0) && (NonSpace(objj.jobs2.value) != 0)) && (jobs1 == jobs2)) { 
		   		setRequiredField(objj.jobs2);
	      			seaAlert(getSeaPhrase("INIT_APP_1","ESS"))
	     			objj.jobs2.focus()
	     			return
	   		} else if ((((NonSpace(objj.jobs1.value) != 0) && (NonSpace(objj.jobs3.value) != 0)) ||
			((NonSpace(objj.jobs2.value) != 0) && (NonSpace(objj.jobs3.value) != 0))) &&
			((jobs1 == jobs3) || (jobs2 == jobs3))) {
		   		setRequiredField(objj.jobs3);
	      			seaAlert(getSeaPhrase("INIT_APP_1","ESS"))
	     			objj.jobs3.focus()
	     			return
	   		} else {
	   			clearRequiredField(objj.jobs2);
	   			clearRequiredField(objj.jobs3);
		   	}
	   	}
	} else {
	   	if ((typeof(objj.jobs1) != 'undefined') && (typeof(objj.jobs2) != 'undefined')
	   	&& (typeof(objj.jobs3) != 'undefined'))	{
	   		if (((NonSpace(objj.jobs1[jidx1].value) != 0) && (NonSpace(objj.jobs2[jidx2].value) != 0)) && (jobs1 == jobs2))	{ 
		   		setRequiredField(objj.jobs2.parentNode);
	      			seaAlert(getSeaPhrase("INIT_APP_1","ESS"))
	     			objj.jobs2.focus()
	     			return
	   		} else if ((((NonSpace(objj.jobs1[jidx1].value) != 0) && (NonSpace(objj.jobs3[jidx3].value) != 0)) ||
			((NonSpace(objj.jobs2[jidx2].value) != 0) && (NonSpace(objj.jobs3[jidx3].value) != 0))) &&
			((jobs1 == jobs3) || (jobs2 == jobs3))) {
		   		setRequiredField(objj.jobs3.parentNode);
	      			seaAlert(getSeaPhrase("INIT_APP_1","ESS"))
	     			objj.jobs3.focus()
	     			return
	   		} else {
	   			clearRequiredField(objj.jobs2.parentNode);
	   			clearRequiredField(objj.jobs3.parentNode);
		   	}
	   	}	
	}

	if (emssObjInstance.emssObj.filterSelect)
		DspGenInt()
	else
   		GetCurrCodes()
}

function GetDataj()
{
   	objj = self.main.document.jobreq

   	if (typeof(objj.open1) != 'undefined') {
   		if (emssObjInstance.emssObj.filterSelect)
   		{
   			open1 = objj.open1.value
   			open1desc = self.main.document.getElementById("open1Desc").innerHTML;
   		}
   		else
   		{
   			oidx1 = objj.open1.selectedIndex
	  		open1 = objj.open1[oidx1].value
   		}
   	}
   	if (typeof(objj.open2) != 'undefined') {
   		if (emssObjInstance.emssObj.filterSelect)
   		{
   			open2 = objj.open2.value
   			open2desc = self.main.document.getElementById("open2Desc").innerHTML;
   		}
   		else
   		{   	
   			oidx2 = objj.open2.selectedIndex
	  		open2 = objj.open2[oidx2].value
   		}
   	}
   	if (typeof(objj.open3) != 'undefined') {
   		if (emssObjInstance.emssObj.filterSelect)
   		{
   			open3 = objj.open3.value
   			open3desc = self.main.document.getElementById("open3Desc").innerHTML;	
   		}
   		else
   		{   		
   			oidx3 = objj.open3.selectedIndex
   			open3 = objj.open3[oidx3].value
   		}
   	}
   	if (typeof(objj.position1) != 'undefined') {
   		if (emssObjInstance.emssObj.filterSelect)
   		{
   			position1 = objj.position1.value
   			position1desc = self.main.document.getElementById("position1Desc").innerHTML;
   		}
   		else
   		{   		
   			pidx1     = objj.position1.selectedIndex
	  		position1 = objj.position1[pidx1].value
   		}
   	}
   	if (typeof(objj.position2) != 'undefined') {
   		if (emssObjInstance.emssObj.filterSelect)
		{
		   	position2 = objj.position2.value
		   	position2desc = self.main.document.getElementById("position2Desc").innerHTML;
		}
		else
   		{
		  	pidx2     = objj.position2.selectedIndex
		  	position2 = objj.position2[pidx2].value
   		}
   	}
   	if (typeof(objj.position3) != 'undefined') {
   		if (emssObjInstance.emssObj.filterSelect)
   		{
   			position3 = objj.position3.value
   			position3desc = self.main.document.getElementById("position3Desc").innerHTML;
   		}
   		else
   		{   	
   			pidx3     = objj.position3.selectedIndex
			position3 = objj.position3[pidx3].value
   		}
   	}
   	if (typeof(objj.jobs1) != 'undefined') {
   		if (emssObjInstance.emssObj.filterSelect)
   		{
   			jobs1 = objj.jobs1.value
   			jobs1desc = self.main.document.getElementById("jobs1Desc").innerHTML;
   		}
   		else
   		{   	
  			jidx1 = objj.jobs1.selectedIndex
	  		jobs1 = objj.jobs1[jidx1].value
   		}
   	}	
   	if (typeof(objj.jobs2) != 'undefined') {
   		if (emssObjInstance.emssObj.filterSelect)
   		{
   			jobs2 = objj.jobs2.value
   			jobs2desc = self.main.document.getElementById("jobs2Desc").innerHTML;
   		}
   		else
   		{   		
 	  		jidx2 = objj.jobs2.selectedIndex
 	  		jobs2 = objj.jobs2[jidx2].value
   		}
   	}
   	if (typeof(objj.jobs3) != 'undefined') {
   		if (emssObjInstance.emssObj.filterSelect)
   		{
   			jobs3 = objj.jobs3.value
   			jobs3desc = self.main.document.getElementById("jobs3Desc").innerHTML;
   		}
   		else
   		{
   			jidx3 = objj.jobs3.selectedIndex
   			jobs3 = objj.jobs3[jidx3].value
   		}
   	}
   
   	jbreq = true
}

function BuildJobOpen(code)
{
	// PT 149379. Pass blank values to AGS, not space chars.
   	if (code == "")
   		var relcodeselect = '<option value="" selected>'
   	else
   		var relcodeselect = '<option value="">'
   	for (var i=0;i<Pajobreq.length;i++)	{
   		pco = Pajobreq[i]
   		relcodeselect += '<option value="' + pco.code + '"'
	  	if (code == pco.code)
    		relcodeselect += ' selected>' + pco.description + ''
	  	else {
    		relcodeselect += '>'
      		relcodeselect += pco.description
	  	}
	}
  	return relcodeselect
}

function BuildPosOpen(code)
{
	// PT 149379. Pass blank values to AGS, not space chars.
   	if (code == "")
   		var relcodeselect = '<option value="" selected>'
   	else
   		var relcodeselect = '<option value="">'
   	for (var i=0;i < Paposition.length;i++) {
   		pco = Paposition[i]
   		relcodeselect += '<option value="' + pco.code + '"'
	  	if (code == pco.code)
	   		relcodeselect += ' selected>' + pco.description + ''
	  	else {
      		relcodeselect += '>'
       		relcodeselect += pco.description
		}
	}
  	return relcodeselect
}

function BuildJobCode(code)
{
	// PT 149379. Pass blank values to AGS, not space chars.
   	if (code == "")
   		var relcodeselect = '<option value="" selected>'
  	else
   		var relcodeselect = '<option value="">'
   	for (var i=0;i < JobCode.length;i++) {
   		pco = JobCode[i]
   		relcodeselect += '<option value="' + pco.code + '"'
	  	if (code == pco.code)
	   		relcodeselect += ' selected>' + pco.description + ''
	  	else {
      		relcodeselect += '>'
       		relcodeselect += pco.description
		}
	}
  	return relcodeselect
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
// PT 149167
countries[0] = "";
countrynames[0] = "";
var stateProvFilter = "state";
var lastnamesuffixDesc = "";
var stateDesc = "";
var countryDesc = "";

function StartApplicant()
{
	stylePage();
	setTaskHeader("header", getSeaPhrase("INITIAL_APPLICANT","ESS"), "Applicant");
	self.document.title = getSeaPhrase("INITIAL_APPLICANT","ESS");
	StoreDateRoutines();
	todaydate = formjsDate(fmttoday);
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"));
	GetCoName();
}

function GetCoName()
{
   	var object      = new DMEObject(authUser.prodline, "prsystem")
   	object.out      = "JAVASCRIPT"
	object.index    = "prsset1"
   	object.sortasc  = parseInt(authUser.company,10)
	object.field    = "name;auto-app"
	object.key      = parseInt(authUser.company,10)+"="
   	object.max      = "1"
	object.exclude  = "drill;keys;sorts"
   	DME(object, "jsreturn")
}

function DspPrsystem()
{
	var title = "";
	var html = "";
   	if (!self.jsreturn.NbrRecs) {
   	   	title = getSeaPhrase("INITIAL_APPLICANT","ESS");
		self.main.document.getElementById("paneHeader").innerHTML = title;
		html = '<p class="fieldlabelbold" style="text-align:center">'
		html += getSeaPhrase("NO_COMPANY_INFO","ESS");
		html += '</p>'
		self.main.document.getElementById("paneBody").innerHTML = html;
		self.main.stylePage();
		self.document.getElementById("main").style.visibility = "visible";
		removeWaitAlert();
		return;
   	} else {
   		if (self.jsreturn.record[0].auto_app == "N") {
	   	   	title = getSeaPhrase("INITIAL_APPLICANT","ESS");
			self.main.document.getElementById("paneHeader").innerHTML = title;
			html = '<p class="fieldlabelbold" style="text-align:center">'
			html += getSeaPhrase("NO_AUTO_APP_SETTINGS","ESS");
			html += '</p>'
			self.main.document.getElementById("paneBody").innerHTML = html;
			self.main.stylePage();
			self.document.getElementById("main").style.visibility = "visible";
			removeWaitAlert();
			return;
		} else {
			GetSysrules();
   		}
   	}
}

function GetSysrules()
{
   	var sys_company = authUser.company.toString()
   	for (var i=sys_company.length;i<4;i++)
		sys_company = "0" + sys_company
   	if(!nmadflag) {
   		nosysrls        = false
   		var object      = new DMEObject(authUser.prodline,"sysrules")
      	object.out      = "JAVASCRIPT"
    	object.index    = "syrset1"
    	object.field    = "alphadata1;alphadata3;alphadata4"
    	object.key      = "APPLICANT" +"="+ "PA" +"="+ "APPLICANT" +"="+ sys_company
		object.debug	= false
     	object.max      = "1"
    	object.exclude  = "drill;keys;sorts"
   		DME(object, "jsreturn")
   	} else {
   		GrabStates('GetCountryCodes()');
	}
}

function DspSysrules()
{
   	if (!self.jsreturn.NbrRecs)
  		nosysrls = true
   	else {
   		alphadata11 = self.jsreturn.record[0].alphadata1_1
   		alphadata12 = self.jsreturn.record[0].alphadata1_2
   		alphadata13 = self.jsreturn.record[0].alphadata1_3
   		alphadata14 = self.jsreturn.record[0].alphadata1_4
   		alphadata3  = self.jsreturn.record[0].alphadata3
   		alphadata4  = self.jsreturn.record[0].alphadata4
   	}

	if (emssObjInstance.emssObj.filterSelect) {
		GetNameAdd();
	}
	else {
   		GrabStates('GetCountryCodes()');
	}
}

function GetCountryCodes()
{
	var object = new DMEObject(authUser.prodline, "instctrycd");
   	object.out = "JAVASCRIPT";
   	object.index = "intset1";
   	object.field = "country-code;country-desc";
   	object.key = "";
	object.debug = false
	object.max = "300";
	object.sortasc = "country-desc";
   	object.func = "ProcessCtryCodes()";
   	DME(object, "jsreturn");
}

function ProcessCtryCodes()
{
	for (var i=0;i<self.jsreturn.NbrRecs;i++) {
		countries[countries.length] = self.jsreturn.record[i].country_code
		countrynames[countrynames.length] = self.jsreturn.record[i].country_desc
	}

	if (self.jsreturn.Next != "")
		self.jsreturn.location.replace(self.jsreturn.Next)
   	else
		GetHrCtryCodeSelect(authUser.prodline, "SU", "GetNameAdd()");
}

function GetNameAdd()
{
	var title = "";
   	var html = "";
   	if (nosysrls) {
   		title = getSeaPhrase("INITIAL_APPLICANT","ESS");
		html = '<p class="fieldlabelbold" style="text-align:center">'
		html += getSeaPhrase("NO_APPLICANT_SETUP","ESS");
		html += '</p>'
   	} else {
   		title = getSeaPhrase("CONTACT_INFORMATION","ESS");
   		html += '<form name="nameaddrs">'
		html += '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;margin-left:auto;margin-right:auto">'
		html += '<tr>'
		html += '<td colspan="2">'
		html += '<span class="fieldlabelbold" style="text-align:left">'+getSeaPhrase("CONTACT_INFO","ESS")+'</span>'
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheader" style="width:40%">'+getSeaPhrase("HOME_ADDR_16","ESS")+'</td>'
		html += '<td class="plaintablecell">'
		html += '<input class="inputbox" type=text name=ssn value="' + ficanbr + '" size=15 maxlength=15>'
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheader">'+getSeaPhrase("DEP_34","ESS")+'</td>'
		html += '<td class="plaintablecell">'
		html += '<input class="inputbox" type=text name=firstname value="' + firstname + '" size=15 maxlength=15>'
		html += uiRequiredIcon()
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheader">'+getSeaPhrase("MIDDLE_NAME","ESS")+'</td>'
		html += '<td class="plaintablecell">'
		html += '<input class="inputbox" type=text name=midlename value="' + midlename + '" size=12 maxlength=15>'
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheader">'+getSeaPhrase("NAME_PREFIX","ESS")+'</td>'
		html += '<td class="plaintablecell">'
		html += '<input class="inputbox" type=text name=lastnameprefix value="' + lastnameprefix + '" size=12 maxlength=15>'
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheader">'+getSeaPhrase("DEP_38","ESS")+'</td>'
		html += '<td class="plaintablecell">'
		html += '<input class="inputbox" type=text name=lastname value="' + lastname + '" size=15 maxlength=30>'
		html += uiRequiredIcon()
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheader">'+getSeaPhrase("DEP_39","ESS")+'</td>'
		html += '<td class="plaintablecell">'
		
		if (emssObjInstance.emssObj.filterSelect)
		{
			html += '<input class="inputbox" type="text" name="lastnamesuffix" value="'+lastnamesuffix+'" size="4" maxlength="4" onfocus="this.select()" onkeyup="this.value=\'\';document.getElementById(\'lastnamesuffixDesc\').innerHTML=\'\';">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'lastnamesuffix\')" style="margin-left:5px">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
			+ '<span id="lastnamesuffixDesc" style="text-align:left;width:200px" class="fieldlabel">'+lastnamesuffixDesc+'</span>'
		}
		else {		
			html += '<select class="inputbox" name=lastnamesuffix>' + DrawHrCtryCodeSelect("SU", lastnamesuffix) + '</select>'
		}
		
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheader">'+getSeaPhrase("NICKNAME","ESS")+'</td>'
		html += '<td class="plaintablecell">'
		html += '<input class="inputbox" type=text name=nickname value="' + nickname + '" size=30 maxlength=30>'
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheader">'+getSeaPhrase("ADDR_1","ESS")+'</td>'
		html += '<td class="plaintablecell">'
		html += '<input class="inputbox" type=text name=addr1 value="' + addr1 + '" size=30 maxlength=30>'
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheader">'+getSeaPhrase("ADDR_2","ESS")+'</td>'
		html += '<td class="plaintablecell">'
		html += '<input class="inputbox" type=text name=addr2 value="' + addr2 + '" size=30 maxlength=30>'
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheader">'+getSeaPhrase("ADDR_3","ESS")+'</td>'
		html += '<td class="plaintablecell">'
		html += '<input class="inputbox" type=text name=addr3 value="' + addr3 + '" size=30 maxlength=30>'
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheader">'+getSeaPhrase("CITY","ESS")+'</td>'
		html += '<td class="plaintablecell">'
		html += '<input class="inputbox" type=text name=city value="' + city + '" size=15 maxlength=18>'
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheader">'+getSeaPhrase("HOME_ADDR_6","ESS")+'</td>'
		html += '<td class="plaintablecell">'
		
		if (emssObjInstance.emssObj.filterSelect)
		{
			html += '<input class="inputbox" type="text" name="state" value="'+state+'" size="2" maxlength="2" onfocus="this.select()" onkeyup="this.value=\'\';document.getElementById(\'stateDesc\').innerHTML=\'\';">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'state\')" style="margin-left:5px">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
			+ uiRequiredIcon()
			+ '<span id="stateDesc" style="text-align:left;width:200px" class="fieldlabel">'+stateDesc+'</span>'
		}
		else
		{		
			if (state)
    				html += '<select class="inputbox" name=state>' + BuildStateSelect(state) + '</select>'
			else
    				html += '<select class="inputbox" name=state>' + BuildStateSelect("") + '</select>'
			html += uiRequiredIcon()
		}
		
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheader">'+getSeaPhrase("HOME_ADDR_7","ESS")+'</td>'
		html += '<td class="plaintablecell">'
   		html += '<input class="inputbox" type=text name=zip value="' + zip + '" size=10 maxlength=10>'
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheader">'+getSeaPhrase("COUNTRY_ONLY","ESS")+'</td>'
		html += '<td class="plaintablecell">'
		
		if (emssObjInstance.emssObj.filterSelect)
		{
			html += '<input class="inputbox" type="text" name="country" value="'+country+'" size="2" maxlength="2" onfocus="this.select()" onkeyup="this.value=\'\';document.getElementById(\'countryDesc\').innerHTML=\'\';">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'country\')" style="margin-left:5px">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
			+ '<span id="countryDesc" style="text-align:left;width:200px" class="fieldlabel">'+countryDesc+'</span>'
		}
		else
		{	
   			if (country)
	  			html += '<select class="inputbox" name=country>' + BuildCtrySelect(country) + '</select>'
	   		else
  				html += '<select class="inputbox" name=country>' + BuildCtrySelect("") + '</select>'
		}
		
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheader">'+getSeaPhrase("HOME_PHONE_ONLY","ESS")+'</td>'
		html += '<td class="plaintablecell">'
   		html += '<input class="inputbox" type=text name=hmphonenbr value="' + hmphonenbr + '" size=15 maxlength=15>'
		html += '</td>'
		html += '</tr>'
		html += '<tr id="hmctrycd"'
		html += ' onmouseover="parent.displayHelpText(\'self.main\',\'hmctrycd\',\'cntryCdHelpText\',true)"'
		html += ' onmouseout="parent.displayHelpText(\'self.main\',\'hmctrycd\',\'cntryCdHelpText\',false)">'
		html += '<td class="plaintablerowheader">'+getSeaPhrase("HOME_PHONE_CNTRY_CODE_ONLY","ESS")+'</td>'
		html += '<td class="plaintablecell">'
   		html += '<input class="inputbox" type=text name=hmphonecntry value="' + hmphonecntry + '" size=15 maxlength=15>'
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheader">'+getSeaPhrase("JOB_PROFILE_11","ESS")+'</td>'
		html += '<td class="plaintablecell">'
   		html += '<input class="inputbox" type=text name=wrkphonenbr value="' + wrkphonenbr + '" size=15 maxlength=15>'
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheader">'+getSeaPhrase("JOB_OPENINGS_14","ESS")+'</td>'
		html += '<td class="plaintablecell">'
   		html += '<input class="inputbox" type=text name=extension value="' + extension + '" size=15 maxlength=15>'
		html += '</td>'
		html += '</tr>'
		html += '<tr id="wkctrycd"'
		html += ' onmouseover="parent.displayHelpText(\'self.main\',\'wkctrycd\',\'cntryCdHelpText\',true)"'
		html += ' onmouseout="parent.displayHelpText(\'self.main\',\'wkctrycd\',\'cntryCdHelpText\',false)">'
		html += '<td class="plaintablerowheader">'+getSeaPhrase("WORK_PHONE_CNTRY_CODE_ONLY","ESS")+'</td>'
		html += '<td class="plaintablecell">'
   		html += '<input class="inputbox" type=text name=wrkphonecntry value="' + wrkphonecntry + '" size=15 maxlength=15>'
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheader">'+getSeaPhrase("FAX_NUMBER","ESS")+'</td>'
		html += '<td class="plaintablecell">'
   		html += '<input class="inputbox" type=text name=faxnbr value="' + faxnbr + '" size=15 maxlength=15>'
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td class="plaintablerowheaderborderbottom">'+getSeaPhrase("EMAIL_ADDRESS","ESS")+'</td>'
		html += '<td class="plaintablecell">'
   		html += '<input class="inputbox" type=text name=emailaddress value="' + emailaddress + '" size=45 maxlength=60>'
		html += '</td>'
		html += '</tr>'
		html += '<tr>'
		html += '<td>&nbsp;</td>'
		html += '<td class="plaintablecell">'
   		html += uiButton(getSeaPhrase("CONTINUE","ESS"), "parent.ProcessForm();return false")
	   	html += uiButton(getSeaPhrase("QUIT","ESS"), "parent.CheckQuit();return false")
		html += '</td>'
		html += '</tr>'
		html += '</table>'
		html += '</form>'
		html += uiRequiredFooter()
		html += rolloverHelpText("cntryCdHelpText",getSeaPhrase("COUNTRY_CODE_HELP_TEXT","ESS"))
	}
	self.main.document.getElementById("paneHeader").innerHTML = title;
	self.main.document.getElementById("paneBody").innerHTML = html;
	self.main.stylePage();
	self.document.getElementById("main").style.visibility = "visible";
	removeWaitAlert();
	fitToScreen();
}

function ProcessForm()
{
   	objn = self.main.document.forms["nameaddrs"];
   	if (NonSpace(objn.firstname.value) == 0) {
   		setRequiredField(objn.firstname);
   		seaAlert(getSeaPhrase("FIRST_NAME","ESS"))
   		objn.firstname.focus()
   		objn.firstname.select()
   		return
   	} else
   		clearRequiredField(objn.firstname);

   	if (NonSpace(objn.lastname.value) == 0) {
   		setRequiredField(objn.lastname);
  		seaAlert(getSeaPhrase("LAST_NAME","ESS"))
  		objn.lastname.focus()
   		objn.lastname.select()
   		return
   	} else
   		clearRequiredField(objn.lastname);

   	GetDatan()

   	if (NonSpace(state) == 0 && NonSpace(country) == 0) {
   		if (emssObjInstance.emssObj.filterSelect) {
   			setRequiredField(objn.state);
   		} else {
   			setRequiredField(objn.state.parentNode);
   	  	}
   	  	seaAlert(getSeaPhrase("STATE_PROVINCE","ESS"))
	  	objn.state.focus()
	  	return
   	} else {
   		if (emssObjInstance.emssObj.filterSelect) {
   			clearRequiredField(objn.state);
   		} else {
   			clearRequiredField(objn.state.parentNode);
		}
	}
	
   	CheckApplicant()
}

function GetDatan()
{
	docn = self.main.document;
   	objn = docn.nameaddrs
   	firstname    = objn.firstname.value
   	midlename    = objn.midlename.value
   	lastname     = objn.lastname.value
   	nickname     = objn.nickname.value
   	addr1        = objn.addr1.value
   	addr2        = objn.addr2.value
   	addr3        = objn.addr3.value
   	city         = objn.city.value
   	sidx         = objn.state.selectedIndex
   	if (emssObjInstance.emssObj.filterSelect) {
    		state        = objn.state.value;
    		stateDesc    = docn.getElementById("stateDesc").innerHTML;
   		country	     = objn.country.value;  	
   		countryDesc  = docn.getElementById("countryDesc").innerHTML;
   		lastnamesuffix = objn.lastnamesuffix.value;
   		lastnamesuffixDesc = docn.getElementById("lastnamesuffixDesc").innerHTML;
   	} else {
   		state        = objn.state[sidx].value
   		cidx	     = objn.country.selectedIndex
   		country	     = objn.country[cidx].value
   		lastnamesuffix = objn.lastnamesuffix[objn.lastnamesuffix.selectedIndex].value
   	}
   	zip          = objn.zip.value
   	hmphonenbr   = objn.hmphonenbr.value
   	wrkphonenbr  = objn.wrkphonenbr.value
   	faxnbr       = objn.faxnbr.value
   	emailaddress = objn.emailaddress.value
   	ficanbr      = objn.ssn.value
   	lastnameprefix = objn.lastnameprefix.value
    	// PT 149167
    	if (NonSpace(lastnamesuffix) == 0) lastnamesuffix = "";   	
   	hmphonecntry   = objn.hmphonecntry.value
   	extension      = objn.extension.value
   	wrkphonecntry  = objn.wrkphonecntry.value
   	nmadflag     = true
}

function CheckApplicant()
{
   	var object     	= new DMEObject(authUser.prodline,"applicant")
   	object.out      = "JAVASCRIPT"
   	object.index    = "aplset2"
	object.field    = "fica-nbr;addr1;last-name;first-name;addr2;addr3;addr4;city;state;zip;"
   	object.max      = "300"
	object.debug	= false
	object.key      = parseInt(authUser.company,10) + "=" + escape(lastname) + "=" + escape(firstname)
   	DME(object,"jsreturn")
}

function DspApplicant()
{
   	for (var i=0;i<self.jsreturn.NbrRecs;i++) {
   		var app = self.jsreturn.record[i]
   	  	if (NonSpace(ficanbr) != 0)	{
	  		if (ficanbr == app.fica_nbr) {
		   		setRequiredField(objn.ssn);
   		  		seaAlert(getSeaPhrase("DUPLICATE_APPLICANT","ESS"))
	  		  	objn.ssn.focus()
	       		objn.ssn.select()
	       		return
		   	}
	   	}
	   	if ( (ficanbr == app.fica_nbr) &&
	   	(addr1 == app.addr1 || (NonSpace(addr1) == 0 && NonSpace(app.addr1) == 0)) &&
 		(addr2 == app.addr2 || (NonSpace(addr2) == 0 && NonSpace(app.addr2) == 0)) &&
 		(addr3 == app.addr3 || (NonSpace(addr3) == 0 && NonSpace(app.addr3) == 0)) &&
 		(city == app.city   || (NonSpace(city) == 0  && NonSpace(app.city) == 0))  &&
 		(state == app.state || (NonSpace(state) == 0 && NonSpace(app.state) == 0)) &&
 		(zip == app.zip     || (NonSpace(zip) == 0   && NonSpace(app.zip) == 0))) {
	   		setRequiredField(objn.ssn);
		   	seaAlert(getSeaPhrase("DUPLICATE_APPLICANT","ESS"))
	  	   	objn.ssn.focus()
      		objn.ssn.select()
      		return
	   	}
   	}
	clearRequiredField(objn.ssn);

	if (emssObjInstance.emssObj.filterSelect) {
		DspJobReq()
   	} else {
   		GetJobOpen()
	}
}

function BuildCtrySelect(ctry)
{
	var ctryselect = ""
	for (var i = 0;i<countries.length;i++) {
   		ctryselect += '<option value="' + countries[i] + '"'
		if (ctry == countries[i])
			ctryselect += ' selected>'
		else
			ctryselect += '>'
		ctryselect += countrynames[i]
	}
	return ctryselect
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
			if ((filterField == "state") || (filterField == "province")) {

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
		if (stateProvFilter == "state") {
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
		} else {
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
	
	if (filterField.getAttribute("isNumeric") == "true") {
	
		if (ValidNumber(filterForm.elements["keywords"], filterField.getAttribute("fieldSize"), 0) == false) 
		{
			dmeFilter.getWindow().seaAlert(getSeaPhrase("INVALID_NO", "ESS"));
			filterForm.elements["keywords"].select();
			filterForm.elements["keywords"].focus();
			return false;	
		}
	}

	return true;
}

function dmeFieldRecordSelected(recIndex, fieldNm)
{
	var selRec = self.jsreturn.record[recIndex];
	var appDoc = self.main.document;
	var appForm;
	
	switch(fieldNm.toLowerCase())
	{
		case "lastnamesuffix":
			appForm = appDoc.nameaddrs;
			appForm.lastnamesuffix.value = selRec.hrctry_code;
			try { appDoc.getElementById("lastnamesuffixDesc").innerHTML = selRec.description; } catch(e) {}
			appForm.lastnamesuffix.focus();
			break;
		case "state":
			appForm = appDoc.nameaddrs;
			if (stateProvFilter == "state") {
				appForm.state.value = selRec.state;
			} else {
				appForm.state.value = selRec.province;
			}
			try { appDoc.getElementById("stateDesc").innerHTML = selRec.description; } catch(e) {}
			appForm.state.focus();
			break;
		case "country":
			appForm = appDoc.nameaddrs;
			appForm.country.value = selRec.country_code;
			try { appDoc.getElementById("countryDesc").innerHTML = selRec.country_desc; } catch(e) {}
			appForm.country.focus();
			break;
		case "open1":
			appForm = appDoc.jobreq;
			appForm.open1.value = selRec.requisition;
			try { appDoc.getElementById("open1Desc").innerHTML = selRec.description; } catch(e) {}
			appForm.open1.focus();
			break;
		case "open2":
			appForm = appDoc.jobreq;
			appForm.open2.value = selRec.requisition;
			try { appDoc.getElementById("open2Desc").innerHTML = selRec.description; } catch(e) {}
			appForm.open2.focus();
			break;
		case "open3":
			appForm = appDoc.jobreq;
			appForm.open3.value = selRec.requisition;
			try { appDoc.getElementById("open3Desc").innerHTML = selRec.description; } catch(e) {}
			appForm.open3.focus();
			break;
		case "position1":
			appForm = appDoc.jobreq;
			appForm.position1.value = selRec.position;
			try { appDoc.getElementById("position1Desc").innerHTML = selRec.description; } catch(e) {}
			appForm.position1.focus();
			break;
		case "position2":
			appForm = appDoc.jobreq;
			appForm.position2.value = selRec.position;
			try { appDoc.getElementById("position2Desc").innerHTML = selRec.description; } catch(e) {}
			appForm.position2.focus();
			break;
		case "position3":
			appForm = appDoc.jobreq;
			appForm.position3.value = selRec.position;
			try { appDoc.getElementById("position3Desc").innerHTML = selRec.description; } catch(e) {}
			appForm.position3.focus();
			break;	
		case "jobs1":
			appForm = appDoc.jobreq;
			appForm.jobs1.value = selRec.job_code;
			try { appDoc.getElementById("jobs1Desc").innerHTML = selRec.description; } catch(e) {}
			appForm.jobs1.focus();
			break;
		case "jobs2":
			appForm = appDoc.jobreq;
			appForm.jobs2.value = selRec.job_code;
			try { appDoc.getElementById("jobs2Desc").innerHTML = selRec.description; } catch(e) {}
			appForm.jobs2.focus();
			break;
		case "jobs3":
			appForm = appDoc.jobreq;
			appForm.jobs3.value = selRec.job_code;
			try { appDoc.getElementById("jobs3Desc").innerHTML = selRec.description; } catch(e) {}
			appForm.jobs3.focus();
			break;
		case "findabout":
			appForm = appDoc.genlinters;
			appForm.findabout.value = selRec.code;
			try { appDoc.getElementById("findaboutDesc").innerHTML = selRec.description; } catch(e) {}
			appForm.findabout.focus();
			break;
		case "currency":
			appForm = appDoc.genlinters;
			appForm.currency.value = selRec.currency_code;
			try { appDoc.getElementById("currencyDesc").innerHTML = selRec.description; } catch(e) {}
			appForm.currency.focus();
			break;	
		case "schedule":
			appForm = appDoc.genlinters;
			appForm.schedule.value = selRec.work_sched;
			try { appDoc.getElementById("scheduleDesc").innerHTML = selRec.description; } catch(e) {}
			appForm.schedule.focus();
			break;	
		case "eeoclass":
			appForm = appDoc.censusdata;
			appForm.eeoclass.value = selRec.hrctry_code;
			try { appDoc.getElementById("eeoclassDesc").innerHTML = selRec.description; } catch(e) {}
			appForm.eeoclass.focus();
			break;
		case "veteran":
			appForm = appDoc.censusdata;
			appForm.veteran.value = selRec.hrctry_code;
			try { appDoc.getElementById("veteranDesc").innerHTML = selRec.description; } catch(e) {}
			appForm.veteran.focus();
			break;			
		default:
			break;
	}
	try
	{
		filterWin.close();
	}
	catch(e) 
	{}
}

function getDmeFieldElement(fieldNm)
{
	var appDoc = self.main.document;
	var appForm;
	var fld = [null, null];	
	switch(fieldNm.toLowerCase())
	{
		case "lastnamesuffix":
			appForm = appDoc.nameaddrs;
			fld = [self.main, appForm.lastnamesuffix];
			break;
		case "state":
			appForm = appDoc.nameaddrs;
			fld = [self.main, appForm];
			break;
		case "country":
			appForm = appDoc.nameaddrs;
			fld = [self.main, appForm.country];
			break;
		case "open1":
			appForm = appDoc.jobreq;
			fld = [self.main, appForm.open1];
			break;
		case "open2":
			appForm = appDoc.jobreq;
			fld = [self.main, appForm.open2];
			break;
		case "open3":
			appForm = appDoc.jobreq;
			fld = [self.main, appForm.open3];
			break;
		case "position1":
			appForm = appDoc.jobreq;
			fld = [self.main, appForm.position1];
			break;
		case "position2":
			appForm = appDoc.jobreq;
			fld = [self.main, appForm.position2];
			break;
		case "position3":
			appForm = appDoc.jobreq;
			fld = [self.main, appForm.position3];
			break;	
		case "jobs1":
			appForm = appDoc.jobreq;
			fld = [self.main, appForm.jobs1];
			break;
		case "jobs2":
			appForm = appDoc.jobreq;
			fld = [self.main, appForm.jobs2];
			break;
		case "jobs3":
			appForm = appDoc.jobreq;
			fld = [self.main, appForm.jobs3];
			break;
		case "findabout":
			appForm = appDoc.genlinters;
			fld = [self.main, appForm.findabout];
			break;
		case "currency":
			appForm = appDoc.genlinters;
			fld = [self.main, appForm.currency];
			break;	
		case "schedule":
			appForm = appDoc.genlinters;
			fld = [self.main, appForm.schedule];
			break;	
		case "eeoclass":
			appForm = appDoc.censusdata;
			fld = [self.main, appForm.eeoclass];
			break;
		case "veteran":
			appForm = appDoc.censusdata;
			fld = [self.main, appForm.veteran];
			break;			
		default:
			break;
	}
	return fld;
}

function drawDmeFieldFilterContent(dmeFilter)
{
	var selectHtml = new Array();
	var dmeRecs = self.jsreturn.record;
	var nbrDmeRecs = dmeRecs.length;
	var fieldNm = dmeFilter.getFieldNm().toLowerCase();
	
	switch(fieldNm)
	{
		case "lastnamesuffix": // name suffix						
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list">'
			selectHtml[0] += '<tr><th style="width:50%">'+getSeaPhrase("DEP_39","ESS")+'</th>'
			selectHtml[0] += '<th style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'

			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected('+i+',\''+fieldNm+'\');return false" class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.hrctry_code) ? tmpObj.hrctry_code : '&nbsp;'
				selectHtml[i+1] += '</td><td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</td></tr>'
			}
			
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'
				selectHtml[1] += getSeaPhrase("NORECS","ESS");
				selectHtml[1] += '</td></tr>'
			}
			
			selectHtml[selectHtml.length] = '</table>'		
			break;	
		case "state":
			if (stateProvFilter == "state") {
				var tmpObj;
				selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list">'
				selectHtml[0] += '<tr><th style="width:50%">'+getSeaPhrase("STATE_ONLY","ESS")+'</th>'
				selectHtml[0] += '<th style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'

				for (var i=0; i<nbrDmeRecs; i++)
				{
					tmpObj = dmeRecs[i];
					selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected('+i+',\''+fieldNm+'\');return false" class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
					selectHtml[i+1] += '<td style="padding-left:5px" nowrap>'
					selectHtml[i+1] += (tmpObj.state) ? tmpObj.state : '&nbsp;'
					selectHtml[i+1] += '</td><td style="padding-left:5px" nowrap>'
					selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
					selectHtml[i+1] += '</td></tr>'
				}
			} else {
				var tmpObj;
				selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list">'
				selectHtml[0] += '<tr><th style="width:50%">'+getSeaPhrase("PROVINCE","ESS")+'</th>'
				selectHtml[0] += '<th style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'

				for (var i=0; i<nbrDmeRecs; i++)
				{
					tmpObj = dmeRecs[i];
					selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected('+i+',\''+fieldNm+'\');return false" class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
					selectHtml[i+1] += '<td style="padding-left:5px" nowrap>'
					selectHtml[i+1] += (tmpObj.province) ? tmpObj.province : '&nbsp;'
					selectHtml[i+1] += '</td><td style="padding-left:5px" nowrap>'
					selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
					selectHtml[i+1] += '</td></tr>'
				}
			}

			if (nbrDmeRecs == 0)
			{
				selectHtml[1] = '<tr class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'
				selectHtml[1] += getSeaPhrase("NORECS","ESS");
				selectHtml[1] += '</td></tr>'
			}

			selectHtml[selectHtml.length] = '</table>'
			break;
		case "country":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list">'
			selectHtml[0] += '<tr><th style="width:50%">'+getSeaPhrase("COUNTRY_ONLY","ESS")+'</th>'
			selectHtml[0] += '<th style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'

			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected('+i+',\''+fieldNm+'\');return false" class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.country_code) ? tmpObj.country_code : '&nbsp;'
				selectHtml[i+1] += '</td><td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.country_desc) ? tmpObj.country_desc : '&nbsp;'
				selectHtml[i+1] += '</td></tr>'
			}
			
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'
				selectHtml[1] += getSeaPhrase("NORECS","ESS");
				selectHtml[1] += '</td></tr>'
			}
			
			selectHtml[selectHtml.length] = '</table>'			
			break;
		case "open1":
		case "open2":
		case "open3":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list">'
			selectHtml[0] += '<th style="width:50%">'+getSeaPhrase("REQUISITION", "ESS")+'</th>'
			selectHtml[0] += '<th style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'

			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected('+i+',\''+fieldNm+'\');return false" class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.requisition) ? tmpObj.requisition : '&nbsp;'				
				selectHtml[i+1] += '</td><td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</td></tr>'
			}
			
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'
				selectHtml[1] += getSeaPhrase("NORECS","ESS");
				selectHtml[1] += '</td></tr>'
			}
			
			selectHtml[selectHtml.length] = '</table>'		
			break;
		case "position1":
		case "position2":
		case "position3":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list">'
			selectHtml[0] += '<th style="width:50%">'+getSeaPhrase("JOB_PROFILE_8","ESS")+'</th>'
			selectHtml[0] += '<th style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'

			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected('+i+',\''+fieldNm+'\');return false" class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.position) ? tmpObj.position : '&nbsp;'
				selectHtml[i+1] += '</td><td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</td></tr>'
			}
			
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'
				selectHtml[1] += getSeaPhrase("NORECS","ESS");
				selectHtml[1] += '</td></tr>'
			}
			
			selectHtml[selectHtml.length] = '</table>'
		break;	
		case "jobs1":
		case "jobs2":
		case "jobs3":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list">'
			selectHtml[0] += '<tr><th style="width:50%">'+getSeaPhrase("JOB_OPENINGS_6","ESS")+'</th>'
			selectHtml[0] += '<th style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'

			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected('+i+',\''+fieldNm+'\');return false" class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.job_code) ? tmpObj.job_code : '&nbsp;'
				selectHtml[i+1] += '</td><td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</td></tr>'
			}
			
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'
				selectHtml[1] += getSeaPhrase("NORECS","ESS");
				selectHtml[1] += '</td></tr>'
			}
			
			selectHtml[selectHtml.length] = '</table>'
		break;	
		case "findabout":						
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list">'
			selectHtml[0] += '<tr><th style="width:50%">'+getSeaPhrase("HIRE_SOURCE","ESS")+'</th>'
			selectHtml[0] += '<th style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'

			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected('+i+',\''+fieldNm+'\');return false" class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.code) ? tmpObj.code : '&nbsp;'
				selectHtml[i+1] += '</td><td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</td></tr>'
			}
			
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'
				selectHtml[1] += getSeaPhrase("NORECS","ESS");
				selectHtml[1] += '</td></tr>'
			}
			
			selectHtml[selectHtml.length] = '</table>'		
			break;	
		case "currency":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list">'
			selectHtml[0] += '<tr><th style="width:50%">'+getSeaPhrase("QUAL_16","ESS")+'</th>'
			selectHtml[0] += '<th style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'

			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected('+i+',\''+fieldNm+'\');return false" class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.currency_code) ? tmpObj.currency_code : '&nbsp;'
				selectHtml[i+1] += '</td><td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</td></tr>'
			}
			
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'
				selectHtml[1] += getSeaPhrase("NORECS","ESS");
				selectHtml[1] += '</td></tr>'
			}
			
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "schedule":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list">'
			selectHtml[0] += '<tr><th style="width:33%">'+getSeaPhrase("WORK_SCHEDULE","ESS")+'</th>'
			selectHtml[0] += '<th style="width:33%">'+getSeaPhrase("HOME_ADDR_1","ESS")+'</th>'
			selectHtml[0] += '<th style="width:33%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'

			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected('+i+',\''+fieldNm+'\');return false" class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.work_sched) ? tmpObj.work_sched : '&nbsp;'
				selectHtml[i+1] += '</td><td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.effect_date) ? tmpObj.effect_date : '&nbsp;'
				selectHtml[i+1] += '</td><td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</td></tr>'
			}
			
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="3" nowrap>'
				selectHtml[1] += getSeaPhrase("NORECS","ESS");
				selectHtml[1] += '</td></tr>'
			}
			
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "eeoclass":					
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list">'
			selectHtml[0] += '<tr><th style="width:50%">'+getSeaPhrase("ETHNICITY","ESS")+'</th>'
			selectHtml[0] += '<th style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'

			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected('+i+',\''+fieldNm+'\');return false" class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.hrctry_code) ? tmpObj.hrctry_code : '&nbsp;'
				selectHtml[i+1] += '</td><td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</td></tr>'
			}
			
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'
				selectHtml[1] += getSeaPhrase("NORECS","ESS");
				selectHtml[1] += '</td></tr>'
			}
			
			selectHtml[selectHtml.length] = '</table>'		
			break;
		case "veteran":						
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" width="100%;padding-left:5px;padding-right:5px" styler="list">'
			selectHtml[0] += '<tr><th style="width:50%">'+getSeaPhrase("VETERAN_STATUS","ESS")+'</th>'
			selectHtml[0] += '<th style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'

			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected('+i+',\''+fieldNm+'\');return false" class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.hrctry_code) ? tmpObj.hrctry_code : '&nbsp;'
				selectHtml[i+1] += '</td><td style="padding-left:5px" nowrap>'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</td></tr>'
			}
			
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterTableRow" onmouseover="filterTableRowMouseOver(this);" onmouseout="filterTableRowMouseOut(this);">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'
				selectHtml[1] += getSeaPhrase("NORECS","ESS");
				selectHtml[1] += '</td></tr>'
			}
			
			selectHtml[selectHtml.length] = '</table>'		
			break;			
		default: break;
	}	
	dmeFilter.getRecordElement().innerHTML = selectHtml.join("");
	try
	{
		if (typeof(parent.removeWaitAlert) != "undefined")
			parent.removeWaitAlert();
		removeWaitAlert();
	} catch(e) {}	
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
// PT 149167
currcodes[0] = "";
currdescs[0] = "";
var findaboutdesc = "";
var currencydesc = "";
var scheduledesc = "";

function GetCurrCodes()
{
	var object = new DMEObject(authUser.prodline, "cucodes");
   	object.out = "JAVASCRIPT";
   	object.index = "cucset1";
   	object.field = "currency-code;description";
	object.max = "600"
	object.key = "";
	object.sortasc = "description";
   	object.func = "ProcessCurrCodes()";
   	DME(object, "jsreturn");
}

function ProcessCurrCodes()
{
	for (var i=0;i<self.jsreturn.NbrRecs;i++) 
	{
		currcodes[currcodes.length] = self.jsreturn.record[i].currency_code
		currdescs[currdescs.length] = self.jsreturn.record[i].description	
	}
	if (self.jsreturn.Next != "")
		self.jsreturn.location.replace(self.jsreturn.Next)
	else	
		GetWorkSchedules()
}

function GetWorkSchedules()
{
	var object = new DMEObject(authUser.prodline, "hrwrkschd");
   	object.out = "JAVASCRIPT";
   	object.index = "wscset1";
   	object.field = "work-sched;description";
	object.max = "600"
	object.key = authUser.company;
	object.sortasc = "description";
   	object.func = "ProcessWorkSchedules()";
   	DME(object, "jsreturn");
}

function ProcessWorkSchedules()
{
	for (var i=0;i<self.jsreturn.NbrRecs;i++) 
	{
		workschedules[workschedules.length] = self.jsreturn.record[i].work_sched
		workschedulesdescs[workschedulesdescs.length] = self.jsreturn.record[i].description	
	}
	if (self.jsreturn.Next != "")
		self.jsreturn.location.replace(self.jsreturn.Next)
	else	
		GetPcodesi()
}

function GetPcodesi()
{
  	if (!gnint) 
  	{
   		Pcodes          = new Array(0)
   		var object      = new DMEObject(authUser.prodline, "pcodes")
      		object.out     	= "JAVASCRIPT"
    		object.index	= "pcoset1"
    		object.max      = "600"
    		object.field   	= "type;code;description"
    		object.key     	= "HS"
     		object.cond    	= "active"
     		object.exclude 	= "drill;keys;sorts"
   		DME(object, "jsreturn")
   	} 
   	else
   	{
   		DspGenInt()
	}
}

function DspPcodes()
{
   	if (self.jsreturn.NbrRecs) 
   	{
   		for (var i=0; i<self.jsreturn.record.length; i++) 
   		{
         		pindex = Pcodes.length    
         		objpc  = self.jsreturn.record[i]    
         		Pcodes[pindex] = new Object()
   	     		Pcodes[pindex].type = objpc.type
   	     		Pcodes[pindex].code = objpc.code
   	     		Pcodes[pindex].description = objpc.description
      		}
   	
   		if (self.jsreturn.Next!='')
      			self.jsreturn.location.replace(self.jsreturn.Next)
		else
      			DspGenInt()
   	} 
   	else
   	{
   		error3 = true;
   		DspGenInt()
	}
}

function DspGenInt()
{
   	var html = "";
	html += '<form name="genlinters">'
	html += '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;margin-left:auto;margin-right:auto">'
	html += '<tr>'
	html += '<td class="plaintablerowheader" style="width:40%">'
	html += getSeaPhrase("DATE_AVAILABLE_TO_WORK","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	html += '<input class="inputbox" type=text name=datebegin value="'+datebegin1+'" size=10 maxlength=10 onchange=parent.ValidDate(this)>'
	html += '<a href="" onclick="parent.DateSelect(\'datebegin\');return false">'
	html += uiCalendarIcon()+'</a>'+uiDateFormatSpan()
	html += '</td>'
	html += '</tr>'
	
	if (!error3)
	{
		html += '<tr>'
		html += '<td class="plaintablerowheader">'
		html += getSeaPhrase("HOW_FOUND_OPENING","ESS")
		html += '</td>'
		html += '<td class="plaintablecell">'
	
		if (emssObjInstance.emssObj.filterSelect)
		{
			html += '<input class="inputbox" type="text" name="findabout" value="'+findabout+'" size="10" maxlength="10" onfocus="this.select()" onkeyup="this.value=\'\';document.getElementById(\'findaboutDesc\').innerHTML=\'\';">'
			+ '<a href="javascript:parent.openDmeFieldFilter(\'findabout\')" style="margin-left:5px">'
			+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
			+ '<span id="findaboutDesc" style="text-align:left;width:200px" class="fieldlabel">'+findaboutdesc+'</span>'
		}
		else
		{	
			if (findabout)
				html += '<select class="inputbox" name=findabout>' + BuildPcodes("HS",findabout) + '</select>'
			else
    				html += '<select class="inputbox" name=findabout>' + BuildPcodes("HS","") + '</select>'
		}
	
		html += '</td>'
		html += '</tr>'
	}
	
	html += '<tr><td class="plaintablerowheader" style="height:20px">&nbsp;</td><td class="plaintablecell">&nbsp;</td></tr>'
	html += '<tr>'
	html += '<td class="plaintablerowheader">'
	html += getSeaPhrase("HOW_MUCH_PAY","ESS")
	html += '</td>'
	html += '<td></td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td class="plaintablerowheader">'
	html += getSeaPhrase("FROM","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	html += '<input class="inputbox" type=text name=paybase1 value="'+paybase1+'" size=12 maxlength=12 onchange=parent.FormatPay(paybase1)>'
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td class="plaintablerowheader">'
	html += getSeaPhrase("TO","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	html += '<input class="inputbox" type=text name=paybase2 value="'+paybase2+'" size=12 maxlength=12 onchange=parent.FormatPay(paybase2)>'
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td class="plaintablerowheader">'
	html += getSeaPhrase("CURRENCY_TYPE_QUESTION","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	
	if (emssObjInstance.emssObj.filterSelect)
	{
		html += '<input class="inputbox" type="text" name="currency" value="'+currency+'" size="5" maxlength="5" onfocus="this.select()" onkeyup="this.value=\'\';document.getElementById(\'currencyDesc\').innerHTML=\'\';">'
		+ '<a href="javascript:parent.openDmeFieldFilter(\'currency\')" style="margin-left:5px">'
		+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
		+ '<span id="currencyDesc" style="text-align:left;width:200px" class="fieldlabel">'+currencydesc+'</span>'
	}
	else
	{	
		if(currency)
			html += '<select class="inputbox" name=currency>' + BuildCurrSelect(currency) + '</select>'
		else
			html += '<select class="inputbox" name=currency>' + BuildCurrSelect("") + '</select>'	
	}
	
	html += '</td>'
	html += '</tr>'
	html += '<tr><td class="plaintablerowheader" style="height:20px">&nbsp;</td><td class="plaintablecell">&nbsp;</td></tr>'
	html += '<tr>'
	html += '<td class="plaintablerowheader">'
	html += getSeaPhrase("WHICH_WORK_SCHEDULE","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	
	if (emssObjInstance.emssObj.filterSelect)
	{
		html += '<input class="inputbox" type="text" name="schedule" value="'+schedule+'" size="10" maxlength="10" onfocus="this.select()" onkeyup="this.value=\'\';document.getElementById(\'scheduleDesc\').innerHTML=\'\';">'
		+ '<a href="javascript:parent.openDmeFieldFilter(\'schedule\')" style="margin-left:5px">'
		+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0"></a>'
		+ '<span id="scheduleDesc" style="text-align:left;width:200px" class="fieldlabel">'+scheduledesc+'</span>'
	}
	else
	{		
		if (schedule)
			html += '<select class="inputbox" name=schedule>' + BuildWorkScheduleSelect(schedule) + '</select>'
		else
			html += '<select class="inputbox" name=schedule>' + BuildWorkScheduleSelect("") + '</select>'
	}

	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td class="plaintablerowheader">'
	html += getSeaPhrase("AVAILABLE_TO_TRAVEL","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	html += '<input class="inputbox" type=radio name=travavail value="Y"'
	if (travavail0 == true)
		html += ' checked><span class="plaintablecelldisplay"> '+getSeaPhrase("YES","ESS")+'</span>'
	else
		html += ' ><span class="plaintablecelldisplay"> '+getSeaPhrase("YES","ESS")+'</span>'
	html += '<input class="inputbox" type=radio name=travavail value="N"'
	if (travavail1 == true)
		html += ' checked><span class="plaintablecelldisplay"> '+getSeaPhrase("NO","ESS")+'</span>'
	else
		html += ' ><span class="plaintablecelldisplay"> '+getSeaPhrase("NO","ESS")+'</span>'
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td class="plaintablerowheader">'
	html += getSeaPhrase("PERCENT_OF_TIME","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	html += '<input class="inputbox" type=text name=pcavail value="'+pcavail+'" size=3 maxlength=3>'
	html += '</td>'
	html += '</tr>'
	html += '<tr><td class="plaintablerowheader" style="height:20px">&nbsp;</td><td class="plaintablecell">&nbsp;</td></tr>'
	html += '<tr>'
	html += '<td class="plaintablerowheader">'
	html += getSeaPhrase("WILLING_TO_RELOCATE","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	html += '<input class="inputbox" type=radio name=relocavail value="Y"'
	if (relocavail0 == true)
		html += ' checked><span class="plaintablecelldisplay"> '+getSeaPhrase("YES","ESS")+'</span>'
	else
		html += ' ><span class="plaintablecelldisplay"> '+getSeaPhrase("YES","ESS")+'</span>'
	html += '<input class="inputbox" type=radio name=relocavail value="N"'
	if (relocavail1 == true)
		html += ' checked><span class="plaintablecelldisplay"> '+getSeaPhrase("NO","ESS")+'</span>'
	else
		html += ' ><span class="plaintablecelldisplay"> '+getSeaPhrase("NO","ESS")+'</span>'
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td class="plaintablerowheader">'
	html += getSeaPhrase("WILLING_TO_WORK_OVERTIME","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	html += '<input class="inputbox" type=radio name=otavail value="Y"'
	if (otavail0 == true)
		html += ' checked><span class="plaintablecelldisplay"> '+getSeaPhrase("YES","ESS")+'</span>'
	else
		html += ' ><span class="plaintablecelldisplay"> '+getSeaPhrase("YES","ESS")+'</span>'
	html += '<input class="inputbox" type=radio name=otavail value="N"'
	if (otavail1 == true)
		html += ' checked><span class="plaintablecelldisplay"> '+getSeaPhrase("NO","ESS")+'</span>'
	else
		html += ' ><span class="plaintablecelldisplay"> '+getSeaPhrase("NO","ESS")+'</span>'
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td class="plaintablerowheaderborderbottom">'
	html += getSeaPhrase("HOURS_PER_WEEK","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	html += '<select class="inputbox" name=hours>'+buildHoursSelect()+'</select>'
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td></td>'
	html += '<td class="plaintablecell">'
	html += uiButton(getSeaPhrase("CONTINUE","ESS"),"parent.ProcessFormgi();return false")
	html += uiButton(getSeaPhrase("BACK","ESS"),"parent.GetDatagi();parent.GetJobOpen();return false")
	html += uiButton(getSeaPhrase("QUIT","ESS"),"parent.CheckQuit();return false")
	html += '</td>'
	html += '</tr>'
	html += '</table>'
	html += '</form>'

	self.main.document.getElementById("paneHeader").innerHTML = getSeaPhrase("GENERAL_INTEREST","ESS");
	self.main.document.getElementById("paneBody").innerHTML = html;
	self.main.stylePage();
}

function ProcessFormgi()
{
   	GetDatagi()
	
   	if ((getDteDifference((ymdtoday),formjsDate(objg.datebegin.value))<0)) {
   		setRequiredField(objg.datebegin);
   		seaAlert(getSeaPhrase("INIT_APP_2","ESS"))
	  	objg.datebegin.focus()
	  	objg.datebegin.select()
	  	return
   	} else if ((NonSpace(objg.datebegin.value) != 0) && (ValidDate(objg.datebegin) == false)) {
   		setRequiredField(objg.datebegin);
	  	objg.datebegin.focus()
	  	objg.datebegin.select()
	  	return
   	} else
   		clearRequiredField(objg.datebegin);

   	if (typeof(objg.paybase1.value) != 'undefined') {
   		if (((parseFloat(objg.paybase1.value)) <= 0)) {
	   		setRequiredField(objg.paybase1);
      		seaAlert(getSeaPhrase("INIT_APP_3","ESS"))
   	     	objg.paybase1.focus()
   	     	objg.paybase1.select()
   	     	return
      	} 
   	}
   
   	if (typeof(objg.paybase2.value) != 'undefined') {
   		if (((parseFloat(objg.paybase2.value)) <= 0)) {
	   		setRequiredField(objg.paybase2);
       		seaAlert(getSeaPhrase("INIT_APP_3","ESS"))
   	     	objg.paybase2.focus()
   	     	objg.paybase2.select()
   	     	return
      	}
   	}

   	if ((typeof(objg.paybase1.value) != 'undefined') &&	(typeof(objg.paybase2.value) != 'undefined')) {
   		if ((parseFloat(objg.paybase2.value))<(parseFloat(objg.paybase1.value))) {
	   		setRequiredField(objg.paybase2);
       		seaAlert(getSeaPhrase("INIT_APP_4","ESS"))
     		objg.paybase2.focus()
     		objg.paybase2.select()
      		return
      	} else
	   		clearRequiredField(objg.paybase2);
   	}
   
   	if ((NonSpace(objg.paybase1.value) != 0 || NonSpace(objg.paybase2.value) != 0) && NonSpace(currency) == 0) {
   		setRequiredField(objg.currency.parentNode);
	  	seaAlert(getSeaPhrase("INIT_APP_5","ESS"))
		objg.currency.focus()
		return
   	} else
		clearRequiredField(objg.currency.parentNode);
   
   	if ((NonSpace(objg.paybase1.value) == 0 && NonSpace(objg.paybase2.value) == 0) && NonSpace(currency) != 0) {
   		setRequiredField(objg.paybase1);
		seaAlert(getSeaPhrase("INIT_APP_6","ESS"))
		objg.paybase1.focus()
		objg.paybase1.select()	 
		return  
   	} else
 		clearRequiredField(objg.paybase1);
   
   	DspPrvEmploym()
}

function GetDatagi()
{
   	objg = self.main.document.genlinters
   	datebegin   = formjsDate(objg.datebegin.value)
   	datebegin1  = objg.datebegin.value
   	if (!error3)
   	{
   		if (emssObjInstance.emssObj.filterSelect) {
   			findabout   = objg.findabout.value
   			findaboutdesc = self.main.document.getElementById("findaboutDesc").innerHTML;
   		} else {
   			fidx1       = objg.findabout.selectedIndex
   			findabout   = objg.findabout[fidx1].value
   		}
   	}	
   	paybase1    = objg.paybase1.value
   	paybase2    = objg.paybase2.value
   	if (emssObjInstance.emssObj.filterSelect) {
   		currency    = objg.currency.value
   		currencydesc = self.main.document.getElementById("currencyDesc").innerHTML;
   	} else {
   		cucidx	    = objg.currency.selectedIndex
   		currency    = objg.currency[cucidx].value
   	}
	if (emssObjInstance.emssObj.filterSelect) {
		schedule    = objg.schedule.value
		scheduledesc = self.main.document.getElementById("scheduleDesc").innerHTML;
	} else {
   		sidx1       = objg.schedule.selectedIndex	
   		schedule    = objg.schedule[sidx1].value
   	}
   	pcavail     = objg.pcavail.value
	hoursIndex  = objg.hours.selectedIndex
	nbrfte      = "&APL-NBR-FTE=" + objg.hours[hoursIndex].value
   	otavail     = GetCheckedValue("&APL-OT-AVAIL=",objg.otavail)
   	relocavail  = GetCheckedValue("&APL-RELOC-AVAIL=",objg.relocavail)
   	travavail   = GetCheckedValue("&APL-TRAV-AVAIL=",objg.travavail)
   	otavail0    = objg.otavail[0].checked
   	otavail1    = objg.otavail[1].checked
   	travavail0  = objg.travavail[0].checked
   	travavail1  = objg.travavail[1].checked
   	relocavail0 = objg.relocavail[0].checked
   	relocavail1 = objg.relocavail[1].checked
   	gnint       = true
}

function BuildCurrSelect(curr)
{
	var currselect = ""

	// PT 124507
	currselect += '<option value=""'
	if (NonSpace(curr) == 0)
		currselect += ' selected> '
	else
		currselect += ' > '

	for (var i=0; i<currcodes.length; i++) {
      	currselect += '<option value="' + currcodes[i] + '"'
		if (curr == currcodes[i])
			currselect += ' selected>'
		else
			currselect += '>'
		currselect += currdescs[i]
	}
	return currselect
}

function buildHoursSelect()
{
	var html = "";
	html += '<option value=""'
	if (hoursIndex == 0)
		html += ' selected> '
	else
		html += ' > '
	html += '</option>'
	html += '<option value=".25"'
	if (hoursIndex == 1)
		html += ' selected> '+getSeaPhrase("LESS_THAN_TEN","ESS")
	else
		html += ' > '+getSeaPhrase("LESS_THAN_TEN","ESS")
	html += '</option>'
	html += '<option value=".50"'
	if (hoursIndex == 2)
		html += ' selected> '+getSeaPhrase("TEN_TO_NINTEEN","ESS")
	else
		html += ' > '+getSeaPhrase("TEN_TO_NINTEEN","ESS")
	html += '</option>'
	html += '<option value=".75"'
	if (hoursIndex == 3)
		html += ' selected> '+getSeaPhrase("TWENTY_TO_THIRTY_NINE","ESS")
	else
		html += ' > '+getSeaPhrase("TWENTY_TO_THIRTY_NINE","ESS")
	html += '</option>'
	html += '<option value="1.000"'
	if (hoursIndex == 4)
		html += ' selected> '+getSeaPhrase("FULL_TIME","ESS")
	else
		html += ' > '+getSeaPhrase("FULL_TIME","ESS")
	html += '</option>'
	return html;
}

function BuildWorkScheduleSelect(ws)
{
	var wsselect = ""
	
	// PT 124507
	wsselect += '<option value=""'
	if (NonSpace(ws) == 0)
		wsselect += ' selected> '
	else
		wsselect += ' > '
	
	for (var i=0; i<workschedules.length; i++) {
      	wsselect += '<option value="' + workschedules[i] + '"'
		if (ws == workschedules[i])
			wsselect += ' selected>'
		else
			wsselect += '>'
		wsselect += workschedulesdescs[i]
	}
	return wsselect
}

function BuildPcodes(type,code)
{
	// PT 149167
   	if (code == "")
		var relcodeselect = '<option value="" selected>'
   	else
		var relcodeselect = '<option value="">'

   	for (var i=0; i<Pcodes.length; i++) {
		pco = Pcodes[i]  
      	if (pco.type == type) {
   			relcodeselect += '<option value="' + pco.code + '"'
	  		if (code == pco.code)
    			relcodeselect += ' selected>' + pco.description
	  		else {
      			relcodeselect += '>'
		   		if (pco.type == "HS")
	       			relcodeselect += pco.description
		   		if (pco.type == "WS")
	       			relcodeselect += pco.description
	  		}
	  	}
	}
    return relcodeselect
}

function FormatPay(objg)
{
   	if (objg.name == "paybase1")
		valpay1 = objg.value
   	else
    	valpay2 = objg.value
	  
   	if (parseFloat(objg.value) <= 0) {
   		setRequiredField(objg);
   		seaAlert(getSeaPhrase("INIT_APP_3","ESS"))
   	  	objg.focus()
   	  	objg.select()
   	  	return
   	} else if ((objg.name == "paybase2") && ((parseFloat(valpay2)) < (parseFloat(valpay1)))) {
   		setRequiredField(objg);
   		seaAlert(getSeaPhrase("INIT_APP_4","ESS"))
  		objg.focus()
  		objg.select()
  		return
   	} else
   		clearRequiredField(objg);
}

function ReturnDate(date)
{
   	self.main.document.forms[0].elements[date_fld_name].value = date
}

/*
 *		Applicant Previous Employment Logic
 */

function DspPrvEmploym()
{
	var html = '<form name="prevemployf">'
	html += '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;margin-left:auto;margin-right:auto">'
	html += '<tr>'
	html += '<td class="plaintablerowheader" style="width:40%">'
	html += getSeaPhrase("HAVE_APPLIED_BEFORE","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	html += '<input type=radio name=prevapply value="Y"'
	if (prevapply0 == true)
		html += ' checked><span class="plaintablecelldisplay"> '+getSeaPhrase("YES","ESS")+'</span>'
	else
		html += ' ><span class="plaintablecelldisplay"> '+getSeaPhrase("YES","ESS")+'</span>'
	html += '<input type=radio name=prevapply value="N"'
	if (prevapply1 == true)
		html += ' checked><span class="plaintablecelldisplay"> '+getSeaPhrase("NO","ESS")+'</span>'
	else
		html += ' ><span class="plaintablecelldisplay"> '+getSeaPhrase("NO","ESS")+'</span>'
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td class="plaintablerowheader">'
	html += getSeaPhrase("WHERE_APPLIED","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	html += '<input class="inputbox" type=text name=prevlocation value="'+prevlocation+'" size=30 maxlength=20>'
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td class="plaintablerowheader">'
	html += getSeaPhrase("WHEN_APPLIED","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	html += '<input class="inputbox" type=text name=prevdate value="'+prevdate1+'" size=10 maxlength=10 onchange=parent.ValidDate(this)>'
	html += '<a href="" onclick="parent.DateSelect(\'prevdate\');return false">'
	html += uiCalendarIcon()+'</a>'+uiDateFormatSpan()
	html += '</td>'
	html += '</tr>'
	html += '<tr><td class="plaintablerowheader" style="height:20px">&nbsp;</td><td class="plaintablecell">&nbsp;</td></tr>'
	html += '<tr>'
	html += '<td class="plaintablerowheader">'
	html += getSeaPhrase("PREVIOUSLY_EMPLOYED","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	html += '<input type=radio name=prevemploy value="Y"'
	if (prevemploy0 == true)
		html += ' checked><span class="plaintablecelldisplay"> '+getSeaPhrase("YES","ESS")+'</span>'
	else
		html += ' ><span class="plaintablecelldisplay"> '+getSeaPhrase("YES","ESS")+'</span>'
	html += '<input type=radio name=prevemploy value="N"'
	if (prevemploy1 == true)
		html += ' checked><span class="plaintablecelldisplay"> '+getSeaPhrase("NO","ESS")+'</span>'
	else
		html += ' ><span class="plaintablecelldisplay"> '+getSeaPhrase("NO","ESS")+'</span>'
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td class="plaintablerowheader">'
	html += getSeaPhrase("PREVIOUS_EMP_NBR","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	html += '<input class="inputbox" type=text name=prevempnbr value="'+prevempnbr+'" size=9 maxlength=9>'
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td class="plaintablerowheader">'
	html += getSeaPhrase("WHEN_EMPLOYED","ESS")
	html += '</td>'
	html += '<td></td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td class="plaintablerowheader">'
	html += getSeaPhrase("FROM","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	html += '<input class="inputbox" type=text name=prevbegdate value="'+prevbegdate1+'" size=10 maxlength=10 onchange=parent.ValidDate(this)>'
	html += '<a href="" onclick="parent.DateSelect(\'prevbegdate\');return false">'
	html += uiCalendarIcon()+'</a>'+uiDateFormatSpan()
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td class="plaintablerowheader">'
	html += getSeaPhrase("TO","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	html += '<input class="inputbox" type=text name=prevenddate value="'+prevenddate1+'" size=10 maxlength=10 onchange=parent.ValidDate(this)>'
	html += '<a href="" onclick="parent.DateSelect(\'prevenddate\');return false">'
	html += uiCalendarIcon()+'</a>'+uiDateFormatSpan()
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td class="plaintablerowheader">'
	html += getSeaPhrase("WHERE_EMPLOYED","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	html += '<input class="inputbox" type=text name=prevlocwork value="'+prevlocwork+'" size=30 maxlength=20>'
	html += '</td>'
	html += '</tr>'
	html += '<tr><td class="plaintablerowheader" style="height:20px">&nbsp;</td><td class="plaintablecell">&nbsp;</td></tr>'
	html += '<tr>'
	html += '<td class="plaintablerowheader">'
	html += getSeaPhrase("EMPLOYED_DIFFERENT_NAME","ESS")
	html += '</td>'
	html += '<td></td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td class="plaintablerowheader">'
	html += getSeaPhrase("DEP_34","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	html += '<input class="inputbox" type=text name=formerfstnm value="'+formerfstname+'" size=15 maxlength=15>'
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td class="plaintablerowheader">'
	html += getSeaPhrase("DEP_35","ESS")
	html += '</td>'
	html += '<td class="plaintablecell">'
	html += '<input class="inputbox" type=text name=formermi value="'+formermi+'" size=1 maxlength=1>'
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td class="plaintablerowheaderborderbottom">'
	html += getSeaPhrase("DEP_38","ESS") 
	html += '</td>'
	html += '<td class="plaintablecell">'
	html += '<input class="inputbox" type=text name=formerlstnm value="'+formerlstname+'" size=15 maxlength=30>'
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td></td>'
	html += '<td class="plaintablecell">'
	html += uiButton(getSeaPhrase("CONTINUE","ESS"),"parent.ProcessFormpe();return false")
	html += uiButton(getSeaPhrase("BACK","ESS"),"parent.GetDatape();parent.DspGenInt();return false")
	html += uiButton(getSeaPhrase("QUIT","ESS"),"parent.CheckQuit();return false")
	html += '</td>'
	html += '</tr>'
	html += '</table>'
	html += '</form>'

	self.main.document.getElementById("paneHeader").innerHTML = getSeaPhrase("PREVIOUS_EMPLOYMENT","ESS");
	self.main.document.getElementById("paneBody").innerHTML = html;
	self.main.stylePage();
}

function ProcessFormpe()
{
   	GetDatape()

   	if ((!prevapply0) && (NonSpace(objpe.prevlocation.value) != 0)) {
   		setRequiredField(objpe.prevlocation);
   		seaAlert(getSeaPhrase("INIT_APP_7","ESS"))
   		objpe.prevlocation.focus()
	  	objpe.prevlocation.select()
   		return
   	} else
   		clearRequiredField(objpe.prevlocation);

   	if ((!prevapply0) && (NonSpace(objpe.prevdate.value) !=0)) {
   		setRequiredField(objpe.prevdate);
   		seaAlert(getSeaPhrase("INIT_APP_7","ESS"))
   		objpe.prevdate.focus()
	  	objpe.prevdate.select()
   		return
   	} 
   	
   	if ((NonSpace(objpe.prevdate.value) != 0) && (ValidDate(objpe.prevdate) == false)) {
   		setRequiredField(objpe.prevdate);
   		seaAlert(getSeaPhrase("INVALIDDATE","ESS"))
   		objpe.prevdate.focus()
	  	objpe.prevdate.select()
   		return
	}
	
   	if ((NonSpace(objpe.prevdate.value) != 0) && (getDteDifference((ymdtoday),formjsDate(objpe.prevdate.value))>0)) {
   		setRequiredField(objpe.prevdate);
   		seaAlert(getSeaPhrase("INIT_APP_8","ESS"))
   		objpe.prevdate.focus()
	  	objpe.prevdate.select()
   		return
   	} else
   		clearRequiredField(objpe.prevdate);

   	if ((!prevemploy0) && (NonSpace(objpe.prevempnbr.value) != 0)) {
   		setRequiredField(objpe.prevempnbr);
      		seaAlert(getSeaPhrase("INIT_APP_9","ESS"))
      		objpe.prevempnbr.focus()
	  	objpe.prevempnbr.select()
      	return
   	} else
   		clearRequiredField(objpe.prevempnbr);

   	if ((!prevemploy0) && (NonSpace(objpe.prevbegdate.value) != 0)) {
   		setRequiredField(objpe.prevbegdate);
   		seaAlert(getSeaPhrase("INIT_APP_9","ESS"))
      		objpe.prevbegdate.focus()
	  	objpe.prevbegdate.select()
      	return
   	}

   	if ((NonSpace(objpe.prevbegdate.value) != 0) && (ValidDate(objpe.prevbegdate) == false)) {
   		setRequiredField(objpe.prevbegdate);
   		seaAlert(getSeaPhrase("INVALIDDATE","ESS"))
   		objpe.prevbegdate.focus()
	  	objpe.prevbegdate.select()
   		return
   	}

   	if ((NonSpace(objpe.prevbegdate.value) != 0) &&	(getDteDifference((ymdtoday),formjsDate(objpe.prevbegdate.value))>0)) {
   		setRequiredField(objpe.prevbegdate);
  		seaAlert(getSeaPhrase("INIT_APP_10","ESS"))
      		objpe.prevbegdate.focus()
	  	objpe.prevbegdate.select()
      	return
   	} else
   		clearRequiredField(objpe.prevbegdate);

   	if ((!prevemploy0) && (NonSpace(objpe.prevenddate.value) != 0)) {
   		setRequiredField(objpe.prevenddate);
   		seaAlert(getSeaPhrase("INIT_APP_9","ESS"))
   		objpe.prevenddate.focus()
	  	objpe.prevenddate.select()
   		return
   	}

   	if ((NonSpace(objpe.prevenddate.value) != 0) && (ValidDate(objpe.prevenddate) == false)) {
   		setRequiredField(objpe.prevenddate);
		seaAlert(getSeaPhrase("INVALIDDATE","ESS"))
      		objpe.prevenddate.focus()
	  	objpe.prevenddate.select()
      		return
   	}

   	if ((NonSpace(objpe.prevenddate.value) != 0) && (NonSpace(objpe.prevbegdate.value) != 0)
   	&& (getDteDifference(formjsDate(objpe.prevenddate.value),formjsDate(objpe.prevbegdate.value))>0)) {
   		setRequiredField(objpe.prevenddate);
   		seaAlert(getSeaPhrase("INIT_APP_12","ESS"))
      		objpe.prevenddate.focus()
	  	objpe.prevenddate.select()
      		return
   	}

   	if ((NonSpace(objpe.prevenddate.value) != 0) && (getDteDifference((ymdtoday),formjsDate(objpe.prevenddate.value))>0)) {
   		setRequiredField(objpe.prevenddate);
      		seaAlert(getSeaPhrase("INIT_APP_11","ESS"))
      		objpe.prevenddate.focus()
	  	objpe.prevenddate.select()
      		return
   	} else
   		clearRequiredField(objpe.prevenddate);

   	if ((!prevemploy0) && (NonSpace(objpe.prevlocwork.value) != 0)) {
   		setRequiredField(objpe.prevlocwork);
      		seaAlert(getSeaPhrase("INIT_APP_9","ESS"))
      		objpe.prevlocwork.focus()
	  	objpe.prevlocwork.select()
      		return
   	} else
   		clearRequiredField(objpe.prevlocwork);

   	if ((!prevemploy0) && (NonSpace(objpe.formerfstnm.value) != 0)) {
   		setRequiredField(objpe.formerfstnm);
    		seaAlert(getSeaPhrase("INIT_APP_9","ESS"))
   	  	objn.formerfstnm.focus()
   	  	objn.formerfstnm.select()
   	  	return
   	} else
   		clearRequiredField(objpe.formerfstnm);

   	if ((!prevemploy0) && (NonSpace(objpe.formermi.value) != 0)) {
   		setRequiredField(objpe.formermi);
    		seaAlert(getSeaPhrase("INIT_APP_9","ESS"))
   	  	objpe.formermi.focus()
   	  	objpe.formermi.select()
   	  	return
   	} else
   		clearRequiredField(objpe.formermi);

   	if ((!prevemploy0) && (NonSpace(objpe.formerlstnm.value) != 0)) {
   		setRequiredField(objpe.formerlstnm);
      		seaAlert(getSeaPhrase("INIT_APP_9","ESS"))
   	  	objpe.formerlstnm.focus()
   	  	objpe.formerlstnm.select()
   	  	return
   	} else
   		clearRequiredField(objpe.formerlstnm);

   	if (alphadata14 == "Y")
   	{
   		if (emssObjInstance.emssObj.filterSelect)
   			CensusForm()
   		else
   			GetEthnicCodes()
   	}
   	else
   		GetPA31()
}

function GetDatape()
{
   	objpe = self.main.document.forms["prevemployf"]
   	prevapply     = GetCheckedValue("&APL-PREV-APPLY=",objpe.prevapply)
   	prevapply0    = objpe.prevapply[0].checked
   	prevapply1    = objpe.prevapply[1].checked
   	prevlocation  = objpe.prevlocation.value
   	prevdate      = formjsDate(objpe.prevdate.value)
   	prevdate1     = objpe.prevdate.value
   	prevemploy    = GetCheckedValue("&APL-PREV-EMPLOY=",objpe.prevemploy)
   	prevemploy0   = objpe.prevemploy[0].checked
   	prevemploy1   = objpe.prevemploy[1].checked
   	prevempnbr    = objpe.prevempnbr.value
   	prevbegdate   = formjsDate(objpe.prevbegdate.value)
   	prevbegdate1  = objpe.prevbegdate.value
   	prevenddate   = formjsDate(objpe.prevenddate.value)
   	prevenddate1  = objpe.prevenddate.value
   	prevlocwork   = objpe.prevlocwork.value
   	formerfstname = objpe.formerfstnm.value
   	formermi      = objpe.formermi.value
   	formerlstname = objpe.formerlstnm.value
}

/*
 *		Related Links Logic
 */
 
function StartAppKnow()
{
	var html = '<div style="padding:20px;overflow:visible">'
	html += '<p class="fieldlabelbold" style="text-align:left">'
	html += getSeaPhrase("INIT_APP_19","ESS")
	html += '</p>'
	html += '<p class="fieldlabelbold" style="text-align:left">'
	html += getSeaPhrase("YOUR_APPLICANT_NBR","ESS")
	html += '<span class="plaintablecellbold" style="padding:0px">&nbsp;'+parseFloat(self.lawheader.ApplicantNumber)+'</span>.&nbsp;'
	html += getSeaPhrase("REMEMBER_YOUR_APP_NBR","ESS")
	html += '</p>'
	html += '<p class="fieldlabelbold" style="text-align:left">'
	html += getSeaPhrase("ADDL_APPLICANT_INFO","ESS")
	html += '</p>'
	html += '<table border="0" cellspacing="0" cellpadding="5">'
	html += '<tr>'
	html += '<td>'+uiCheckmarkIcon("checkMark0","visibility:hidden")+'</td>'
	html += '<td class="fieldlabel" style="text-align:left">'
	html += '<a href=javascript:parent.subTaskClicked(0)>'+getSeaPhrase("INIT_APP_23","ESS")+'</a>'
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td>'+uiCheckmarkIcon("checkMark1","visibility:hidden")+'</td>'
	html += '<td class="fieldlabel" style="text-align:left">'
	html += '<a href=javascript:parent.subTaskClicked(1)>'+getSeaPhrase("INIT_APP_24","ESS")+'</a>'
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td>'+uiCheckmarkIcon("checkMark2","visibility:hidden")+'</td>'
	html += '<td class="fieldlabel" style="text-align:left">'
	html += '<a href=javascript:parent.subTaskClicked(2)>'+getSeaPhrase("INIT_APP_25","ESS")+'</a>'
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td>'+uiCheckmarkIcon("checkMark3","visibility:hidden")+'</td>'
	html += '<td class="fieldlabel" style="text-align:left">'
	html += '<a href=javascript:parent.subTaskClicked(3)>'+getSeaPhrase("JOB_HISTORY","ESS")+'</a>'
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td>'+uiCheckmarkIcon("checkMark4","visibility:hidden")+'</td>'
	html += '<td class="fieldlabel" style="text-align:left">'
	html += '<a href=javascript:parent.subTaskClicked(4)>'+getSeaPhrase("INIT_APP_27","ESS")+'</a>'
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html += '<td></td>'
	html += '<td>'
	html += uiButton(getSeaPhrase("DONE","ESS"),"parent.finished();return false")
	html += '</td>'
	html += '</tr>'
	html += '</table>'
	html += '</div>'

	self.document.getElementById("main").style.visibility = "hidden";
	self.links.document.getElementById("paneHeader").innerHTML = getSeaPhrase("APPLICATION_COMPLETE","ESS");
	self.links.document.getElementById("paneBody").innerHTML = html;
	self.links.stylePage();
	self.document.getElementById("links").style.visibility = "visible";
}

function finished()
{
	self.document.getElementById("header").style.visibility = "hidden";
	self.document.getElementById("links").style.visibility = "hidden";
	self.location = "/lawson/xhrnet/ui/logo.htm";
}

function subTaskClicked(index)
{
   	if (index == 0)
		source = "/lawson/xhrnet/applicantcert.htm?number="+self.lawheader.ApplicantNumber
   	else if (index == 1)
   		source = "/lawson/xhrnet/applicantcomp.htm?number="+self.lawheader.ApplicantNumber
  	else if (index == 2)
   		source = "/lawson/xhrnet/applicantedu.htm?number="+self.lawheader.ApplicantNumber
   	else if (index == 3)
   		source = "/lawson/xhrnet/jobhistory.htm?number="+self.lawheader.ApplicantNumber
   	else if (index == 4) 
   		source = "/lawson/xhrnet/jobreferences.htm?number="+self.lawheader.ApplicantNumber
   		
	self.links.document.getElementById("checkMark"+index).style.visibility = "visible";
	self.document.getElementById("links").style.visibility = "hidden";
	self.document.getElementById("subtask").src = source;
	self.document.getElementById("subtask").style.visibility = "visible";
}

function backToLinks()
{
	self.document.getElementById("subtask").style.visibility = "hidden";
	self.document.getElementById("links").style.visibility = "visible";
}
 

 
