// Version: 8-)@(#)@10.00.02.00.29
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/careermanagement/employee/Attic/emplib.js,v 1.1.2.13 2012/07/19 13:31:58 brentd Exp $
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
//*   (c) COPYRIGHT 2012 INFOR.  ALL RIGHTS RESERVED.           *
//*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//*                                                             *
//***************************************************************
/*
 *	Action Plan Tab
 */
 
var AttachmentWindowTitle;
var ActionPlanAttachmentTitle = getSeaPhrase("CM_77","CM");
var Attachment;
var LastUpdated;
var TimeUpdated;
var attachmentTimer;

function DrawActionPlanWindows()
{
	DrawActionPlanWithCloseIcon_MyActionPlan()
	DrawActionPlan_MyActionPlan()
	DrawQualifications_MyActionPlan()
	DrawJobAlert_MyActionPlan()
	DrawQualificationsDetail_MyActionPlan()
	DrawRelatedLinks_MyActionPlan()

	if ((typeof(StandardCareerProfile) != "undefined") && (StandardCareerProfile != null))
		Do_HS50_1_Call_ACTIONPLAN_Finished()		
	else
		Do_HS50_Call(2, 1, "Y", null, "HS50.1", "ACTIONPLAN", authUser.employee)
}

function Do_HS50_1_Call_ACTIONPLAN_Finished()
{
	if (StandardCareerProfile == null)
		StandardCareerProfile = CareerProfile;

	if( StandardCareerProfile.CompetencyDetail.length ||
		StandardCareerProfile.CertificationDetail.length ||
		StandardCareerProfile.EducationDetail.length)
	{
		RefreshQualificationHeader_MyActionPlan('<span class="contenttextCM">'+getSeaPhrase("CM_79","CM")+' '+emssObjInstance.emssObj.cmQualExpireDays+' '+getSeaPhrase("CM_80","CM")+'</span>')
		var Desc = DataForQualificationsAlert(-1, "QualificationsDetail_MyActionPlan");
		if(Desc == '')
		{
			var Desc = '<span class="contenttextCM">'
			Desc += getSeaPhrase("CM_81","CM")+' '+emssObjInstance.emssObj.cmQualExpireDays+' '+getSeaPhrase("CM_80","CM")+'</span>'
			RefreshQualificationHeader_MyActionPlan(Desc)
		}
		else
		{
			ReplaceWindowContent("main", "Qualifications_MyActionPlanWindow", Desc);
		}
	}
	else
	{
		var Desc = '<span class="contenttextCM">'
		Desc += getSeaPhrase("CM_81","CM")+' '+emssObjInstance.emssObj.cmQualExpireDays+' '+getSeaPhrase("CM_80","CM")+'</span>'
		RefreshQualificationHeader_MyActionPlan(Desc)
	}

	JobAlert = new Array();
	PAJOBINTRS_Call("PaintJobAlert_JobAlertScreen()", 0, null, null);
}

function sortByDescription(obj1,obj2)
{
	var name1 = obj1.job_requis_description;
	var name2 = obj2.job_requis_description;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function PaintJobAlert_JobAlertScreen()
{
	ReqsExist = false;
	JobsExist = false;

	// PT 150856.
	JobAlert.sort(sortByDescription);

	for (var i=0;i<JobAlert.length;i++) {
		JobsExist = true;
		if(parseInt(JobAlert[i].requisition,10) != 0 && !NonSpace(JobAlert[i].req_closed_date))	{
			ReqsExist = true;
			JobAlert[i].link = true;
		} else
			JobAlert[i].link = false;
	}

	var Desc = "<table border=0 cellpadding=0 cellspacing=0>";
	if (ReqsExist) {
		RefreshJobAlertHeader_MyActionPlan('<span class="contenttextCM">'+getSeaPhrase("CM_82","CM")+'</span>')
		for(var i=0; i<JobAlert.length; i++) {
			Desc += '<tr><td>'
			if (JobAlert[i].link) 
			{
				Desc += '<a class="contenttextCM" href="" onClick="parent._JOBALERTDESC=\''+JobAlert[i].description+'\';parent.OnTabClicked_MainTabs(\'Openings\');return false;">'
					+ JobAlert[i].description + '</a>';
			}
			else
				Desc += '<span class="contenttextdisplayCM">' + JobAlert[i].description + '</span>'
			Desc += '</td></tr>'
		}
	} else {
		if(JobsExist) {
			RefreshJobAlertHeader_MyActionPlan('<span class="contenttextCM">'+getSeaPhrase("CM_83","CM")+'</span>')
			for(var i=0; i<JobAlert.length;i++)
				Desc += '<tr><td><span class="contenttextdisplayCM">' + JobAlert[i].description + '</span></td></tr>'
		} else
			RefreshJobAlertHeader_MyActionPlan('<span class="contenttextCM">'+getSeaPhrase("CM_84","CM")+' </span>')

		Desc += '<tr><td>&nbsp;</td></tr>'
		Desc += '<tr><td><a class="contenttextCM" href="" onClick="parent.OnTabClicked_MainTabs(\'Openings\');return false;">'
			+ getSeaPhrase("CM_85","CM")+'</a></td></tr>'
	}

	Desc += "</table>";

	ReplaceWindowContent("main", "JobAlert_MyActionPlanWindow", Desc)
	GetActionPlanAttachment("AttachmentCollected", "C", authUser.company, authUser.employee, true);
}

function URL(Link, LinkName, MouseOver, WindowName)
{
	this.Link = Link;
	this.LinkName = LinkName
	this.MouseOver = MouseOver;
	this.WindowName = WindowName
}

//Remember to make sure you have a comma to delimit each new URL object!
var URLArray = new Array(
	//new URL("http://www.ijob.com", "IJob", "Goto IJob", "IJOB"),
	//new URL("http://www.personalogic.aol.com/?product=careers,aolcom,aolcom", "Netscape Career Match", "Goto Netscape Career Match", "NETSCAPECAREERCENTER")
);

function AttachmentCollected()
{
	RefreshAttachmentWindow_MyActionPlan()

	var Desc = '<table cellpadding=0 cellspacing=0 border=0>'
	for(var i=0;i<URLArray.length;i++)
	{
		Desc += '<tr><td><a class="contenttextCM" href="" onClick="window.open(\''+URLArray[i].Link+'\', \''+URLArray[i].WindowName+'\');return false;" onMouseOver="window.status=\''+URLArray[i].MouseOver+'\';return true;" onMouseOut="window.status=\' \';return true;">'
			+ URLArray[i].LinkName+'</a></td></tr>'
	}

	if(!URLArray.length)
		Desc += '<tr><td><span class="contenttextCM">'+getSeaPhrase("CM_86","CM")+'</span></td></tr>'

	Desc += '</table>'
	ReplaceWindowContent("main", "RelatedLinks_MyActionPlanWindow", Desc)

	var pObj = GetFormObject("main", "frmAttachmentsForm", "ActionPlanHeader2_MyActionPlan");
	pObj.attachmentname.value = "";
	pObj.comments.value = ""

	Desc = ''
	if (Attachment && Attachment.CmtRec && Attachment.CmtRec.length)
	{
		//for(var j=0; j<Attachment.CommentData[0].length; j++)
		//	Desc += unescape(Attachment.CommentData[0][j]);
		Desc += unescape(Attachment.CommentData[0].join(""));

		var Title = unescape(Attachment.CmtRec[0].Title);
		pObj.attachmentname.value = Title.split('+').join(' ')
		pObj.comments.value = unescape(Desc)
		displayButtonCM("Delete_MyActionPlanWithClose", "inline-block");
	} 
	else
	{
		displayButtonCM("Delete_MyActionPlanWithClose", "none");
	}
	
	RefreshNextReviewDate_MyActionPlan(StandardCareerProfile.NextReviewDate)

	FinishedDrawingTabs();
}

function HS50_RePaintQualificationsAlert()
{
	ReplaceWindowContent("main", "Qualifications_MyActionPlanWindow", DataForQualificationsAlert(-1, "QualificationsDetail_MyActionPlan"))
	seaAlert(getSeaPhrase("CM_87","CM"))
}

function AttachmentWindowDone()
{
	GetActionPlanAttachment("RefreshAttachmentWindow_MyActionPlan", "C", authUser.company, authUser.employee, true)
}

function DeleteActionPlan_MyActionPlan_OnClick()
{
	if (seaConfirm(getSeaPhrase("CM_88","CM"), "", handleDeleteActionPlanResponse))
	{
		DeleteActionPlan();
	}
}

// Firefox will call this function
function handleDeleteActionPlanResponse(confirmWin)
{
	if (confirmWin.returnValue == "ok" || confirmWin.returnValue == "continue")
	{
		DeleteActionPlan();
	}
}

function DeleteActionPlan()
{
	var pAttachObj = new WRITEATTACHObject(authUser.prodline,"EMPLOYEE");

	pAttachObj.out = "XML";
	pAttachObj.index = "EMPSET1";
	pAttachObj.key 	= "K1=" + escapeEx(authUser.company)
			 + "&K2=" + escapeEx(authUser.employee);

	pAttachObj.opm = "D";
	pAttachObj.rectype = Attachment.CmtRec[0].UserType;
	pAttachObj.reckey = escapeEx(Attachment.CmtRec[0].RecKey,1);
	pAttachObj.seqkey = escapeEx(Attachment.CmtRec[0].SeqKey,1);
	pAttachObj.usertype = escapeEx(Attachment.CmtRec[0].UserType,1);

	pAttachObj.debug = false;
	pAttachObj.func = "ActionPlanDeleted";

	WRITEATTACH(pAttachObj,"jsreturn");
	//attachmentTimer = setTimeout("ActionPlanDeleted()",3000);
}

function ActionPlanDeleted()
{
	//clearTimeout(attachmentTimer);
	var pObj = GetFormObject("main", "frmAttachmentsForm", "ActionPlanHeader2_MyActionPlan");
	pObj.attachmentname.value = "";
	pObj.comments.value = ""

	GetActionPlanAttachment("AttachmentWritten_MyActionPlan", "C", authUser.company, authUser.employee, true);
}

function PrintActionPlan_MyActionPlan_OnClick()
{
	GetActionPlanAttachment("PrintAttachment", "C", authUser.company, authUser.employee, true);
}

function ChangePlan_MyActionPlan_OnClick()
{
	// netscape 7
	//if(typeof(Attachment.CommentData)!="undefined")
	if(commentsExist)
		ShowActionPlanWithCloseIcon_MyActionPlan(true, true)
	else
		ShowActionPlanWithCloseIcon_MyActionPlan(true, false)
}

function ActionPlanWithCloseIcon_MyActionPlan_XIconClicked()
{
	if(commentsExist)
		ShowActionPlanWithCloseIcon_MyActionPlan(false, true)
	else
		ShowActionPlanWithCloseIcon_MyActionPlan(false, false)
}

function Cancel_MyActionPlan_OnClick()
{
	AttachmentWritten_MyActionPlan();
}

function CreatePlan_MyActionPlan_OnClick()
{
	ShowActionPlanWithCloseIcon_MyActionPlan(true, false)
}

function Update_MyActionPlan_OnClick()
{
	var pObj = GetFormObject("main", "frmAttachmentsForm", "ActionPlanHeader2_MyActionPlan");
	var company = authUser.company;
	var employee = authUser.employee
	var title = pObj.attachmentname.value;
	var body = pObj.comments.value;
	var fc = "A";

	if(Attachment && Attachment.CmtRec && Attachment.CmtRec.length)
		WriteActionPlanAttachment(Attachment, company, employee, title, body, "M", "AttachmentWritten_MyActionPlan", "C")
	else
		WriteActionPlanAttachment(Attachment, company, employee, title, body, "A", "AttachmentWritten_MyActionPlan", "C")
}

function AttachmentWritten_MyActionPlan()
{
	ActionPlanWithCloseIcon_MyActionPlan_XIconClicked()
	GetActionPlanAttachment("AttachmentCollected", "C", authUser.company, authUser.employee, true);
}

//////////////////////////////////////////////////////////////////////////////////////////
//								MAIN DRAWING TASKS										//
//////////////////////////////////////////////////////////////////////////////////////////

function DrawActionPlan_MyActionPlan()
{
	// ui change
	// var pObj = new CareerManagementWindowObject(Window1,"main", "ActionPlan_MyActionPlan", 2, 23, 496, 505, true, getSeaPhrase("CM_89","CM"));
	// cursor in My Action Plan not flashing
	// var pObj = new CareerManagementWindowObject(Window1,"main", "ActionPlan_MyActionPlan", 2, 23, 496, 484, true, getSeaPhrase("CM_89","CM"));
	var pObj = new CareerManagementWindowObject(Window1,"main", "ActionPlan_MyActionPlan", 2, 23, 496, 484, true, getSeaPhrase("CM_89","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.Draw();
	pObj.DrawView(20, 120, 460, 350);

	createLayer("main","ActionPlanHeader_MyActionPlan",20,60,500,50,true,"","","");
}

function DrawActionPlanWithCloseIcon_MyActionPlan()
{
	// ui change
	// var pObj = new CareerManagementWindowObject(Window1,"main", "ActionPlanWithCloseIcon_MyActionPlan", 2, 23, 496, 505, false, getSeaPhrase("CM_89","CM"));
	var pObj = new CareerManagementWindowObject(Window1,"main", "ActionPlanWithCloseIcon_MyActionPlan", 2, 23, 496, 484, false, getSeaPhrase("CM_89","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.AddCloseIcon = true;
	pObj.CloseIconLocationLeft = pObj.Left + 468
	pObj.CloseIconLocationTop = pObj.Top + 5
	pObj.Draw();

	var docLoc = getDocLoc("main");
	var width = 80;
	var textwidth = 35;

	var Desc = "<form name=frmAttachmentsForm><span class=contentlabelCM>"+getSeaPhrase("CM_102","CM")+"</span>"
		+ "&nbsp;&nbsp;&nbsp;<input class=contenttextCM name=attachmentname type=text size="+textwidth+">"
		+ "<br><p><br>"
		//cols="+width+" rows="20"
		+ '<textarea class="contenttextCM" style="width:450px;height:285px" wrap="wrap" name="comments"></textarea>'
		+ "</form>"
		+ '<div style="white-space:nowrap">'
		+ uiButton(getSeaPhrase("CM_95","CM"),"parent.Update_MyActionPlan_OnClick();return false;")
		+ uiButton(getSeaPhrase("CM_94","CM"),"parent.Cancel_MyActionPlan_OnClick();return false;","margin-left:5px")
		+ uiButton(getSeaPhrase("CM_91","CM"),"parent.DeleteActionPlan_MyActionPlan_OnClick();return false;","margin-left:15px","Delete_MyActionPlanWithClose")
		+ '</div>'

	//createLayer("main","ActionPlanHeader2_MyActionPlan",20,60,500,370,false,Desc,"","");
	createLayer("main","ActionPlanHeader2_MyActionPlan",20,60,450,470,false,Desc,"","");
}

function ShowActionPlanWithCloseIcon_MyActionPlan(nCmd, AttachmentExists)
{
	ShowWin(nCmd, "main", "ActionPlanWithCloseIcon_MyActionPlan", false, true, false)
	ShowWin(!nCmd, "main", "ActionPlan_MyActionPlan", true, false, false)

	if(nCmd)
	{
		showLayer("main", "ActionPlanHeader2_MyActionPlan")
		hideLayer("main", "ActionPlanHeader_MyActionPlan")
	}
	else
	{
		hideLayer("main", "ActionPlanHeader2_MyActionPlan")
		showLayer("main", "ActionPlanHeader_MyActionPlan")
	}
}

function DrawQualifications_MyActionPlan()
{
	pObj = new CareerManagementWindowObject(Window6,"main", "Qualifications_MyActionPlan", 502,23,288,180, true, getSeaPhrase("CM_103","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.Draw();
	pObj.DrawView(515, 100, 260, 90);

	createLayer("main","QualificationsHeader_MyActionPlan",515,60,265,30,true,"","","");
}

function DrawJobAlert_MyActionPlan()
{
	pObj = new CareerManagementWindowObject(Window6,"main", "JobAlert_MyActionPlan", 502,204,288,180, true, getSeaPhrase("CM_104","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.Draw();
	pObj.DrawView(515, 285, 260, 80);

	createLayer("main","JobAlertHeader_MyActionPlan",515,235,265,50,true,"","","");
}

function DrawQualificationsDetail_MyActionPlan()
{
	// cursor in My Action Plan not flashing
	// pObj = new CareerManagementWindowObject(Window3,"main", "QualificationsDetail_MyActionPlan", 115,28,378,410, false, getSeaPhrase("CM_105","CM"));
	pObj = new CareerManagementWindowObject(Window3,"main", "QualificationsDetail_MyActionPlan", 412,204,378,410, false, getSeaPhrase("CM_105","CM"), false);
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.AddCloseIcon = true;
	pObj.CloseIconLocationLeft = pObj.Left + 350
	pObj.CloseIconLocationTop = pObj.Top + 4
	pObj.Draw();
	pObj.DrawView(427, 236, 350, 360);
}

function DrawRelatedLinks_MyActionPlan()
{
	var pObj = new CareerManagementWindowObject(Window5,"main", "RelatedLinks_MyActionPlan", 502,385,288,120, true, getSeaPhrase("CM_107","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowInformation = "";
	pObj.WindowColor = WindowColor	
	pObj.Draw();
	pObj.DrawView(515, 420, 260, 77);
}

function RefreshQualificationHeader_MyActionPlan(Desc)
{
	replaceContent("main", "QualificationsHeader_MyActionPlan", Desc)
}

function RefreshNextReviewDate_MyActionPlan(date)
{
	var Desc = '<table width=500 cellpadding=0 border=0 cellspacing=0><tr><td class="contenttextCM">'
		+'<span class="contentlabelCM">'
		+getSeaPhrase("CM_108","CM")+' &nbsp;</span>'

	Desc += (date==null || NonSpace(date)==0) ? getSeaPhrase("CM_109","CM") : FormatDte6(date);

	if(Attachment && Attachment.CmtRec && Attachment.CmtRec.length)
	{
		Desc += '</td><td class="contenttextCM" rowspan=2><span class="contentlabelCM">'+getSeaPhrase("CM_110","CM")+'</span>'
			+ '<br>'+LastUpdated+'<br>'+TimeUpdate+'</td></tr>'
			+ '<tr><td class="contenttextCM"><span class="contentlabelCM">'+getSeaPhrase("CM_111","CM")+'</span>'
			+ '&nbsp;'+unescape(unescape(Attachment.CmtRec[0].Title)).split('+').join(' ')
			+ '</td></tr></table>'
	}
	else
	{
		Desc += '</td></tr></table>'
	}

	replaceContent("main", "ActionPlanHeader_MyActionPlan", Desc);
}

function RefreshJobAlertHeader_MyActionPlan(Desc)
{
	replaceContent("main", "JobAlertHeader_MyActionPlan", Desc)
}

// flag to indicate whether there is comments at this time
// somehow Attachment will be refreshed, thus losing correct reference
var commentsExist = false;

function RefreshAttachmentWindow_MyActionPlan()
{
	Attachment = self.jsreturn;

	var arg = '<div class="contenttextCM" style="width:100%;height:80%;overflow:auto">';
	if (self.jsreturn.CmtRec && self.jsreturn.CmtRec.length)
	{
		//for(var j=0; j<self.jsreturn.CommentData[0].length; j++)
		//	arg += ThrowOutCarriageReturns(self.jsreturn.CommentData[0][j])
		arg += ThrowOutCarriageReturns(self.jsreturn.CommentData[0].join(""))

		LastUpdated = FormatDte6(self.jsreturn.CmtAttrib[0].ModifyDate);
		TimeUpdate = TimeRoutines("American", self.jsreturn.CmtAttrib[0].ModifyTime);
	}
	arg += '</div>'
	if (self.jsreturn.CmtRec && self.jsreturn.CmtRec.length) {
		arg += '<div style="white-space:nowrap">' 
			+ uiButton(getSeaPhrase("CM_92","CM"),"parent.ChangePlan_MyActionPlan_OnClick();return false;")
			+ uiButton(getSeaPhrase("CM_90","CM"),"parent.PrintActionPlan_MyActionPlan_OnClick();return false;","margin-left:5px")
			+ uiButton(getSeaPhrase("CM_91","CM"),"parent.DeleteActionPlan_MyActionPlan_OnClick();return false;","margin-left:15px")
			+ '</div>'
	}
	
	// netscape 7
	if (self.jsreturn.CmtRec && self.jsreturn.CmtRec.length)
		commentsExist = true;
	else 
		commentsExist = false;

	if (self.jsreturn.CmtRec && self.jsreturn.CmtRec.length)
	{			
		ReplaceWindowContent("main", "ActionPlan_MyActionPlanWindow", unescape(unescape(arg)))
	}
	else
	{	
		var Desc = "<br><br><br><br><center><table width=400 border=0 cellpadding=10 cellspacing=10><tr><td>"
			+ '<div class="contenttextCM">'+ getSeaPhrase("CM_112","CM")+"<p>"
			+ getSeaPhrase("CM_113","CM")+"</div>"
			+ '</td></tr><tr><td style="white-space:nowrap">'
			+ uiButton(getSeaPhrase("CM_93","CM"),"parent.CreatePlan_MyActionPlan_OnClick();return false;")
			+ "</td></tr></table></center>"

		ReplaceWindowContent("main", "ActionPlan_MyActionPlanWindow", Desc)
	}
	RefreshNextReviewDate_MyActionPlan(StandardCareerProfile.NextReviewDate)
}

function ShowActionPlan_MyActionPlan(nCmd)
{
	ShowWin(nCmd, "main", "ActionPlan_MyActionPlan", true, false, false)
}

function ShowQualifications_MyActionPlan(nCmd)
{
	ShowWin(nCmd, "main", "Qualifications_MyActionPlan", true, false, false)
}

function ShowJobAlert_MyActionPlan(nCmd)
{
	ShowWin(nCmd, "main", "JobAlert_MyActionPlan", true, false, false);
	if (nCmd)
	{
		showLayer("main", "JobAlertHeader_MyActionPlan");
	}
	else
	{
		hideLayer("main", "JobAlertHeader_MyActionPlan");
	}
}

function ShowRelatedLinks_MyActionPlan(nCmd)
{
	ShowWin(nCmd, "main", "RelatedLinks_MyActionPlan", true, false, false)
}

function ShowQualificationsDetail_MyActionPlan(nCmd)
{
	ShowJobAlert_MyActionPlan(!nCmd);
	ShowRelatedLinks_MyActionPlan(!nCmd);
	ShowWin(nCmd, "main", "QualificationsDetail_MyActionPlan", true, true, false)
}

function ShowRelatedLinks_MyActionPlan(nCmd)
{
	ShowWin(nCmd, "main", "RelatedLinks_MyActionPlan", true, false, false)
}

function ShowUpdateQualificationButton_MyActionPlan(nCmd)
{
	ShowButton(nCmd, "main", "UpdateQualification_MyActionPlan")
}

function QualificationsDetail_MyActionPlan_XIconClicked()
{
	QualificationsDetail_XIconClicked()
}

/*
 *	Job Openings Tab
 */
 
var MoreThanOneApplication = 0;
var JobOpeningsWindowInformation = new Array();

var JobAlert = new Array();
var JobAppliedFor = new Array();
var JobInterests = new Array();
var JobSelects = new Array();

var JobAlert1Index;
var JobAlert2Index;
var JobAlert3Index;

var JobAlert1Index_New;
var JobAlert2Index_New;
var JobAlert3Index_New;

var FilterSelect1Value;
var FilterSelect2Value;
var FilterSelect3Value;

var FilterSelect1Value_New;
var FilterSelect2Value_New;
var FilterSelect3Value_New;

var selectedJobs = new Array();

var _JOBALERTDESC = null;

function DrawJobOpeningsWindows()
{
	var pObj = new CareerManagementWindowObject(Window1,"main", "JobOpenings", 2,24,496,484, true, getSeaPhrase("CM_85","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor;
	//pObj.GroupBox = (emssObjInstance.emssObj.filterSelect) ? false : true;
	pObj.Draw();
	pObj.DrawView(10, 85, 483, 418);

	if (emssObjInstance.emssObj.filterSelect)
	{
		var filterList = document.getElementById("filterList");
		setHorizontalPos(filterList, "12px");	
		filterList.style.top = "88px";
		filterList.style.width = "483px";
		filterList.style.height = "418px";
	}

	var pObj = new CareerManagementWindowObject(Window5,"main", "JobsAppliedFor", 502,371,288,140, true, getSeaPhrase("CM_131","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowInformation = "";
	pObj.WindowColor = WindowColor
	pObj.Draw();
	pObj.DrawView(515, 403, 260, 92);

	var pObj = new CareerManagementWindowObject(Window4,"main", "JobAlert", 502,24,288,348, true, getSeaPhrase("CM_104","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.Draw();

	var Desc = '<span class="contenttextCM">'+getSeaPhrase("CM_132","CM")+'</span>'
	createLayer("main","JobAlertTab_JobAlertHeader",510,55,275,95,true,Desc,"","",true);

	if (emssObjInstance.emssObj.filterSelect)
	{
		MakeButton(getSeaPhrase("CM_137","CM"), 10, 475, 175, 30, ButtonBorderColor, "SubmitApplication_JobOpenings", true);
	}

	//Job Opening Detail window
	if (emssObjInstance.emssObj.filterSelect)
	{
		pObj = new CareerManagementWindowObject(Window8,"main", "JobOpeningDetail", 495,24,308,300, false, getSeaPhrase("CM_138","CM"));
		pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
		pObj.AddCloseIcon = true;
		pObj.WindowColor = WindowColor
		pObj.CloseIconLocationLeft = pObj.Left + 365
		pObj.CloseIconLocationTop = pObj.Top + 5
		pObj.Draw();
		pObj.DrawView(520,56,268,253);	
	}
	else
	{
		pObj = new CareerManagementWindowObject(Window8,"main", "JobOpeningDetail", 395,24,395,250, false, getSeaPhrase("CM_138","CM"));
		pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
		pObj.AddCloseIcon = true;
		pObj.WindowColor = WindowColor
		pObj.CloseIconLocationLeft = pObj.Left + 365
		pObj.CloseIconLocationTop = pObj.Top + 5
		pObj.Draw();
		pObj.DrawView(420,56,355,203);
	}
	
	PAJOBINTRS_Call("PaintJobAlertWindow_JobOpenings()", 0, null,null);
}

function PAJOBINTRS_Call(func, EmpApp, condition, sortasc)
{
	JobAlert = new Array();
	var pObj = new DMEObject(authUser.prodline, "PAJOBINTRS")
	pObj.out = "JAVASCRIPT"
	pObj.field = "job-code;job-code.description;position;job-requis.requisition;"
	+ "job-requis.description;job-requis.closed_date"
	pObj.key = authUser.company+"="+escapeEx(EmpApp)+"="+authUser.employee

	if(condition != null && typeof(condition)!="undefined")
		pObj.cond = condition;

	pObj.max = 600;
	pObj.debug = false;
	pObj.func = "PAJOBINTRS_Finished('"+func+"')";

	if(sortasc != null && typeof(sortasc)!="undefined")
		pObj.sortasc = sortasc;

	DME(pObj,"jsreturn")
}

function PAJOBINTRS_Finished(func)
{
	for(var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		pDme = self.jsreturn.record[i];
		JobAlert[JobAlert.length] = new JobAlertObject(pDme.job_code, pDme.position, pDme.job_code_description,
			pDme.job_requis_requisition, pDme.job_requis_description, formatDME(pDme.job_requis_closed_date));
	}

	if(self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		eval(func);
}

function GetJobInterestIndexes(Index)
{
	if(JobAlert.length <= Index)
		return -1;

	for (var j=0; j<JobSelects.length; j++)
	{
		if (JobAlert[Index].code == JobSelects[j].code)
			return j;
	}
	return -1;
}

function GetJobInterestCode(Index)
{
	if(JobAlert.length <= Index)
		return "";

	return JobAlert[Index].code;
}

function GetJobInterestDesc(Index)
{
	if(JobAlert.length <= Index)
		return "";

	return JobAlert[Index].description;
}

function PaintJobAlertWindow_JobOpenings()
{
	MakeButton(getSeaPhrase("CM_95","CM"), 519, 225, 100, 30, ButtonBorderColor, "updateJobAlert", true);

	if (emssObjInstance.emssObj.filterSelect)
	{
		DME_TO_JOB_REQ_FINISHED();	
	}
	else
	{
		PAJOBREQ_Call("DME_TO_JOB_REQ_FINISHED()");
	}
}

function ShowJobAlertWin(Visible, FrameLocation, Button)
{
	if (Visible)
	{
        	showLayer(FrameLocation, "JobAlertTab_JobAlertHeader");
		showLayer(FrameLocation, "JobAlertTitle");
	}
	else
	{
	     	hideLayer(FrameLocation, "JobAlertTab_JobAlertHeader");
	     	hideLayer(FrameLocation, "JobAlertTitle");
	}
	
	if (Button)
		ShowButton(Visible, FrameLocation, "updateJobAlert");
	
	if (emssObjInstance.emssObj.filterSelect)
	{
		ShowTextBox(Visible, "main", "JobAlertFilterSelect1_JobOpenings");
		ShowButton(Visible, "main", "JobAlertFilterSelect1Arrow");
		if (Visible)
			showLayer("main", "JobAlertFilterSelect1Desc_JobOpenings");
		else
			hideLayer("main", "JobAlertFilterSelect1Desc_JobOpenings");
			
		ShowTextBox(Visible, "main", "JobAlertFilterSelect2_JobOpenings");
		ShowButton(Visible, "main", "JobAlertFilterSelect2Arrow");
		if (Visible)
			showLayer("main", "JobAlertFilterSelect2Desc_JobOpenings");
		else
			hideLayer("main", "JobAlertFilterSelect2Desc_JobOpenings");
			
		ShowTextBox(Visible, "main", "JobAlertFilterSelect3_JobOpenings");
		ShowButton(Visible, "main", "JobAlertFilterSelect3Arrow");
		if (Visible)
			showLayer("main", "JobAlertFilterSelect3Desc_JobOpenings");
		else
			hideLayer("main", "JobAlertFilterSelect3Desc_JobOpenings");			
	}
	else
	{
		ShowSelect(Visible, FrameLocation, "jobalertselect1");
		ShowSelect(Visible, FrameLocation, "jobalertselect2");
		ShowSelect(Visible, FrameLocation, "jobalertselect3");
	}
}

function ShowJobAlertFilterSelect(nCmd)
{
	if (emssObjInstance.emssObj.filterSelect)
	{
		ShowTextBox(nCmd, "main", "cmbJobCodesFilterSelect_GroupProfile");
		ShowButton(nCmd, "main", "cmbJobCodesFilterSelectArrow");
		if (nCmd)
			showLayer("main", "cmbJobCodesFilterSelectDesc_GroupProfile");
		else
			hideLayer("main", "cmbJobCodesFilterSelectDesc_GroupProfile");
	}
	else
	{
		ShowSelect(nCmd, "main", "cmbJobCodes");
	}
}

function PAJOBREQ_Call(func)
{
	JobOpeningsWindowInformation = new Array();
	var pObj = new DMEObject(authUser.prodline, "PAJOBREQ")
		pObj.out = "JAVASCRIPT"
		pObj.field = "requisition;description;department.name;location.description;"
			+ "process-level.name;openings;supervisor.description;work-schedule.description;"
			+ "contact-first;contact-mi;contact-last;wk-phone-nbr;wk-phone-ext;job-code;position"
		pObj.key = authUser.company+""
		pObj.max = 600;
		pObj.debug = false;
		pObj.cond = "not-closed";
		pObj.func = "PAJOBREQ_Finished('"+func+"')";
	DME(pObj,"jsreturn")
}

function PAJOBREQ_Finished(func)
{
	for(var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		pDme = self.jsreturn.record[i];
		JobOpeningsWindowInformation[JobOpeningsWindowInformation.length]
			= new JobOpeningsWindowInformationObject(pDme.description, pDme.location_description, pDme.department_name,
				pDme.requisition, pDme.process_level_name, pDme.openings, pDme.supervisor_description,
				pDme.work_schedule_description, pDme.contact_first+" "+pDme.contact_mi+" "+pDme.contact_last,
				pDme.wk_phone_nbr, pDme.wk_phone_ext, pDme.job_code, pDme.position);
	}
	if(self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		eval(func);
}

function DME_TO_JOB_REQ_FINISHED()
{
	if (emssObjInstance.emssObj.filterSelect)
	{
		DME_TO_JOB_CODE_FINISHED();	
	}
	else
	{
		JobSelects = new Array();
		var pObj = new DMEObject(authUser.prodline, "JOBCODE")
			pObj.out = "JAVASCRIPT"
			pObj.field = "job-code;description;"
			pObj.key = authUser.company+""
			pObj.max = "600";
			pObj.debug = false;
			pObj.cond = "active";
			pObj.func = "JOBCODE_Finished('DME_TO_JOB_CODE_FINISHED()')";
		DME(pObj,"jsreturn")
	}
}

function JOBCODE_Finished(func)
{
	for(var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		pDme = self.jsreturn.record[i];
		JobSelects[JobSelects.length] = new SelectObject()
		JobSelects[JobSelects.length-1].code = pDme.job_code;
		JobSelects[JobSelects.length-1].description = pDme.description;
	}
	if(self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		eval(func);
}

function DME_TO_JOB_CODE_FINISHED()
{
	if (emssObjInstance.emssObj.filterSelect)
	{
		MakeTextBox("JobAlertFilterSelect1", 519, 150, 115, 25, "JobAlertFilterSelect1_JobOpenings", true, 30, GetJobInterestCode(0), 'styler="select" styler_click="parent.JobAlertFilterSelect1Arrow_OnClick"');	
		MakeButton('<img style="cursor:hand;cursor:pointer" border="0" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" alt="'+getSeaPhrase("SELECT_VALUE","ESS")+'">', 624, 150, 12, 16,
			WindowColor, "JobAlertFilterSelect1Arrow", isVisible, getSeaPhrase("CM_185","CM"), true, 'styler="hidden"');	
		var buttonObj = getLayerDocument("main", "JobAlertFilterSelect1ArrowButton");	
		if (buttonObj != null)
		{
			buttonObj.setAttribute("styler", "hidden");
		}		
		Desc = '<span id="JobAlertFilterSelect1Desc" class="contenttextdisplayCM">'+GetJobInterestDesc(0)+'</span>'
		createLayer("main","JobAlertFilterSelect1Desc_JobOpenings",641,155,150,25,isVisible,Desc,"","");
		
		try 
		{
			var pFormObj = GetTextBoxFormObject("main", "JobAlertFilterSelect1", "JobAlertFilterSelect1_JobOpenings");
			pFormObj.onkeyup = jobAlert_OnKeyUp;
		} catch(e) {}
	
		try
		{
			var tBox = self.main.document.getElementById("JobAlertFilterSelect1_JobOpeningsTextBox");
			var zInd = tBox.style.zIndex;
			if (typeof(zInd) != "undefined" && zInd != null && !isNaN(Number(zInd)))
			{
				tBox.style.zIndex = zInd + 3;
			}
		} catch(e) {}
	
		MakeTextBox("JobAlertFilterSelect2", 519, 173, 115, 25, "JobAlertFilterSelect2_JobOpenings", true, 30, GetJobInterestCode(1), 'styler="select" styler_click="parent.JobAlertFilterSelect2Arrow_OnClick"');
		MakeButton('<img style="cursor:hand;cursor:pointer" border="0" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" alt="'+getSeaPhrase("SELECT_VALUE","ESS")+'">', 624, 173, 12, 16,
			WindowColor, "JobAlertFilterSelect2Arrow", isVisible, getSeaPhrase("CM_185","CM"), true, 'styler="hidden"');
		var buttonObj = getLayerDocument("main", "JobAlertFilterSelect2ArrowButton");	
		if (buttonObj != null)
		{
			buttonObj.setAttribute("styler", "hidden");
		}			
		Desc = '<span id="JobAlertFilterSelect2Desc" class="contenttextdisplayCM">'+GetJobInterestDesc(1)+'</span>'
		createLayer("main","JobAlertFilterSelect2Desc_JobOpenings",641,178,150,25,isVisible,Desc,"","");

		try 
		{
			var pFormObj = GetTextBoxFormObject("main", "JobAlertFilterSelect2", "JobAlertFilterSelect2_JobOpenings");
			pFormObj.onkeyup = jobAlert_OnKeyUp;
		} catch(e) {}
		
		try
		{
			var tBox = self.main.document.getElementById("JobAlertFilterSelect2_JobOpeningsTextBox");
			var zInd = tBox.style.zIndex;
			if (typeof(zInd) != "undefined" && zInd != null && !isNaN(Number(zInd)))
			{
				tBox.style.zIndex = zInd + 3;
			}
		} catch(e) {}		
		
		MakeTextBox("JobAlertFilterSelect3", 519, 196, 115, 25, "JobAlertFilterSelect3_JobOpenings", true, 30, GetJobInterestCode(2), 'styler="select" styler_click="parent.JobAlertFilterSelect3Arrow_OnClick"');
		MakeButton('<img style="cursor:hand;cursor:pointer" border="0" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" alt="'+getSeaPhrase("SELECT_VALUE","ESS")+'">', 624, 196, 12, 16,
			WindowColor, "JobAlertFilterSelect3Arrow", isVisible, getSeaPhrase("CM_185","CM"), true, 'styler="hidden"');
		var buttonObj = getLayerDocument("main", "JobAlertFilterSelect3ArrowButton");	
		if (buttonObj != null)
		{
			buttonObj.setAttribute("styler", "hidden");
		}			
		Desc = '<span id="JobAlertFilterSelect3Desc" class="contenttextdisplayCM">'+GetJobInterestDesc(2)+'</span>'
		createLayer("main","JobAlertFilterSelect3Desc_JobOpenings",641,201,150,25,isVisible,Desc,"","");			
	
		try 
		{
			var pFormObj = GetTextBoxFormObject("main", "JobAlertFilterSelect3", "JobAlertFilterSelect3_JobOpenings");
			pFormObj.onkeyup = jobAlert_OnKeyUp;
		} catch(e) {}	
		
		try
		{
			var tBox = self.main.document.getElementById("JobAlertFilterSelect3_JobOpeningsTextBox");
			var zInd = tBox.style.zIndex;
			if (typeof(zInd) != "undefined" && zInd != null && !isNaN(Number(zInd)))
			{
				tBox.style.zIndex = zInd + 3;
			}
		} catch(e) {}		
	}
	else
	{
		MakeSelectBox("JobAlertSelect1", 519, 150, 210, 23, "jobalertselect1", JobSelects, true, GetJobInterestIndexes(0))
		MakeSelectBox("JobAlertSelect2", 519, 173, 210, 23, "jobalertselect2", JobSelects, true, GetJobInterestIndexes(1))
		MakeSelectBox("JobAlertSelect3", 519, 196, 210, 23, "jobalertselect3", JobSelects, true, GetJobInterestIndexes(2))
	}
	
	ResetJobInterests();
	RepaintJobOpeningsLinks();
	PAREQAPP_Call("DME_TO_PA_REQ_APP_FINSIHED()");	
}

function jobAlert_OnKeyUp()
{
	this.value = "";
	
	var descObj = null;
	switch(this.name)
	{
		case "JobAlertFilterSelect1_JobOpenings": descObj = "JobAlertFilterSelect1Desc_JobOpenings"; break;
		case "JobAlertFilterSelect2_JobOpenings": descObj = "JobAlertFilterSelect2Desc_JobOpenings"; break;
		case "JobAlertFilterSelect3_JobOpenings": descObj = "JobAlertFilterSelect3Desc_JobOpenings"; break;
		default: break;
	}
	
	if (descObj != null)
	{
		var descHtml = '<span id="'+descObj.replace("_JobOpenings","")+'" class="contenttextCM"></span>';			
		replaceContent("main", descObj, descHtml);
	}
}

function RepaintJobOpeningsLinks()
{
	if (emssObjInstance.emssObj.filterSelect)
	{				
		openDmeListFieldFilter('filterList', "job_openings", false);
		ShowFilterList(true);
	}
	else
	{
		var Desc = '<form name=jobOpenings>'
		Desc += '<table width="100%" cellpadding="0" cellspacing="0" border="0" nowrap styler="list">'
		Desc += '<tr class="contentlabelCM">'
		Desc += '<th width="50px">'+getSeaPhrase("CM_133","CM") + '</th>'
		Desc += '<th width="33%">'+getSeaPhrase("CM_134","CM") + '</th>'
		Desc += '<th width="33%">'+getSeaPhrase("CM_135","CM") + '</th>'
		Desc += '<th width="33%">'+getSeaPhrase("CM_136","CM") + '</th>'
		Desc += '</tr>'

		for(var i=0; i<JobOpeningsWindowInformation.length; i++)
		{
			Desc += '<tr><td nowrap><input type=checkbox value="on" name=openings'+i+'></td>'
			Desc += '<td nowrap><a class="contenttextCM" href="" onClick="parent.ShowJobOpeningDetail('+i+');return false;">'
			Desc += JobOpeningsWindowInformation[i].description+'</a>&nbsp;</td>'
			Desc += '<td class="contenttextCM" nowrap>'+JobOpeningsWindowInformation[i].location+'&nbsp;</td>'
			Desc += '<td class="contenttextCM" nowrap>'+JobOpeningsWindowInformation[i].department+'&nbsp;</td>'
		}

		Desc += '<tr><td colspan="4" style="white-space:nowrap">'
		Desc += uiButton(getSeaPhrase("CM_137","CM"),"parent.SubmitApplication_JobOpenings_OnClick();return false;")
		Desc += '</td></tr>'
	
		Desc += '</table>'

		ReplaceWindowContent("main", "JobOpeningsWindow", Desc)
	}
}

function PAREQAPP_Call(func)
{
	JobAppliedFor = new Array();
	
	var pObj = new DMEObject(authUser.prodline, "PAREQAPP")
		pObj.out = "JAVASCRIPT"
		pObj.index = "praset2"
		pObj.cond = "active-req"
		pObj.field = "applicant;requisition;date-applied;requisition.description;"
		pObj.key = authUser.company+"=0="+authUser.employee
		pObj.max = "600";
		pObj.debug = false;
		pObj.func = "PAREQAPP_Finished('"+func+"')";
	DME(pObj,"jsreturn")
}

function PAREQAPP_Finished(func)
{
	var pDme;

	for(var i=0; i<self.jsreturn.NbrRecs;i++)
	{
		pDme = self.jsreturn.record[i];
		JobAppliedFor[JobAppliedFor.length] = new JobAppliedForObject(pDme.requisition, pDme.requisition_description, formatDME(pDme.date_applied));
	}
	if(self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		eval(func);
}

function DME_TO_PA_REQ_APP_FINSIHED()
{
	Desc = '';
	for(var i=0; i<JobAppliedFor.length; i++) {
		Desc += '<span class="contenttextCM">' + JobAppliedFor[i].description + '</span><br>'
		Desc += '<span class="contentlabelCM">'+getSeaPhrase("CM_139","CM")+'</span> '
		Desc += '<span class="contenttextCM">'+JobAppliedFor[i].dateHired+'</span><p>'
	}

	ReplaceWindowContent("main", "JobsAppliedForWindow", Desc)
	FinishedDrawingTabs();
}

function JobAlertFilterSelect1Arrow_OnClick()
{
	openDmeFieldFilter("job_alert1");
}

function JobAlertFilterSelect2Arrow_OnClick()
{
	openDmeFieldFilter("job_alert2");
}

function JobAlertFilterSelect3Arrow_OnClick()
{
	openDmeFieldFilter("job_alert3");
}

function ShowJobOpeningDetail(Index)
{
	if (emssObjInstance.emssObj.filterSelect)
	{	
		Desc = '<span class="layertitleCM">'
		+ getSeaPhrase("CM_138","CM") + ' - ' + self.HIDDEN.record[Index].description
		+ '</span>';		
	}
	else
	{		
		Desc = '<span class="layertitleCM">'
		+ getSeaPhrase("CM_138","CM") + ' - ' + JobOpeningsWindowInformation[Index].description
		+ '</span>';	
	}
	
	ChangeTitle("main", "JobOpeningDetail", Desc);

	if (emssObjInstance.emssObj.filterSelect)
	{
		var jobArray = self.HIDDEN.record;
	
		Desc = '<table border=0 cellpadding=0 cellspacing=0>'
		Desc += '<tr><td class="contentlabelCM">'+ getSeaPhrase("CM_140","CM")+'<td width=20>&nbsp;'
			+ '<td class="contenttextCM">'+jobArray[Index].requisition
			+ '<tr><td class="contentlabelCM">'+ getSeaPhrase("CM_141","CM")+'<td width=20>&nbsp;'
			+ '<td class="contenttextCM">'+jobArray[Index].process_level_name
			+ '<tr><td class="contentlabelCM">'+ getSeaPhrase("CM_142","CM")+'<td width=20>&nbsp;'
			+ '<td class="contenttextCM">'+jobArray[Index].department_name
			+ '<tr><td class="contentlabelCM">'+ getSeaPhrase("CM_143","CM")+'<td width=20>&nbsp;'
			+ '<td class="contenttextCM">'+jobArray[Index].openings
			+ '<tr><td class="contentlabelCM">'+ getSeaPhrase("CM_144","CM")+'<td width=20>&nbsp;'
			+ '<td class="contenttextCM">'+jobArray[Index].supervisor_description
			+ '<tr><td class="contentlabelCM">'+ getSeaPhrase("CM_145","CM")+'<td width=20>&nbsp;'
			+ '<td class="contenttextCM">'+jobArray[Index].work_schedule_description
			+ '<tr><td class="contentlabelCM">'+ getSeaPhrase("CM_146","CM")+'<td width=20>&nbsp;'
			+ '<td class="contenttextCM">'+jobArray[Index].contact_first+' '+jobArray[Index].contact_mi+' '+jobArray[Index].contact_last
			+ '<tr><td class="contentlabelCM">'+ getSeaPhrase("CM_147","CM")+'<td width=20>&nbsp;'
			+ '<td class="contenttextCM">'+jobArray[Index].wk_phone_nbr
			+ '<tr><td class="contentlabelCM">'+ getSeaPhrase("CM_148","CM")+'<td width=20>&nbsp;'
			+ '<td class="contenttextCM">'+jobArray[Index].wk_phone_ext
		Desc += '</table>'	
	}
	else
	{
		Desc = '<table border=0 cellpadding=0 cellspacing=0>'
		Desc += '<tr><td class="contentlabelCM">'+ getSeaPhrase("CM_140","CM")+'<td width=20>&nbsp;'
			+ '<td class="contenttextCM">'+JobOpeningsWindowInformation[Index].requisition
			+ '<tr><td class="contentlabelCM">'+ getSeaPhrase("CM_141","CM")+'<td width=20>&nbsp;'
			+ '<td class="contenttextCM">'+JobOpeningsWindowInformation[Index].processlevel
			+ '<tr><td class="contentlabelCM">'+ getSeaPhrase("CM_142","CM")+'<td width=20>&nbsp;'
			+ '<td class="contenttextCM">'+JobOpeningsWindowInformation[Index].department
			+ '<tr><td class="contentlabelCM">'+ getSeaPhrase("CM_143","CM")+'<td width=20>&nbsp;'
			+ '<td class="contenttextCM">'+JobOpeningsWindowInformation[Index].openings
			+ '<tr><td class="contentlabelCM">'+ getSeaPhrase("CM_144","CM")+'<td width=20>&nbsp;'
			+ '<td class="contenttextCM">'+JobOpeningsWindowInformation[Index].supervisor
			+ '<tr><td class="contentlabelCM">'+ getSeaPhrase("CM_145","CM")+'<td width=20>&nbsp;'
			+ '<td class="contenttextCM">'+JobOpeningsWindowInformation[Index].workschedule
			+ '<tr><td class="contentlabelCM">'+ getSeaPhrase("CM_146","CM")+'<td width=20>&nbsp;'
			+ '<td class="contenttextCM">'+JobOpeningsWindowInformation[Index].contact
			+ '<tr><td class="contentlabelCM">'+ getSeaPhrase("CM_147","CM")+'<td width=20>&nbsp;'
			+ '<td class="contenttextCM">'+JobOpeningsWindowInformation[Index].phonenbr
			+ '<tr><td class="contentlabelCM">'+ getSeaPhrase("CM_148","CM")+'<td width=20>&nbsp;'
			+ '<td class="contenttextCM">'+JobOpeningsWindowInformation[Index].phoneext
		Desc += '</table>'
	}

	ReplaceWindowContent("main","JobOpeningDetailWindow",Desc);
	ShowJobAlertWin(false, "main", true);
	ShowWin(true, "main", "JobOpeningDetail", true, true);
}

function JobOpeningDetail_XIconClicked()
{
	ShowJobAlertWin(true, "main", true);
	ShowWin(false, "main", "JobOpeningDetail", true, true);
}

function updateJobAlert_OnClick()
{
	showWaitAlert(getSeaPhrase("CM_155","CM"));

	if (emssObjInstance.emssObj.filterSelect)
	{
		var pFormObj;
		pFormObj = GetTextBoxFormObject("main", "JobAlertFilterSelect1", "JobAlertFilterSelect1_JobOpenings");
		FilterSelect1Value_New = pFormObj.value;
		
		pFormObj = GetTextBoxFormObject("main", "JobAlertFilterSelect2", "JobAlertFilterSelect2_JobOpenings");
		FilterSelect2Value_New = pFormObj.value;		
	
		pFormObj = GetTextBoxFormObject("main", "JobAlertFilterSelect3", "JobAlertFilterSelect3_JobOpenings");
		FilterSelect3Value_New = pFormObj.value;	
	
		if ((NonSpace(FilterSelect1Value) == 0) && (NonSpace(FilterSelect1Value_New) == 0) 
		&& ((NonSpace(FilterSelect2Value) == 0) && NonSpace(FilterSelect2Value_New) == 0) 
		&& (NonSpace(FilterSelect3Value) == 0) && (NonSpace(FilterSelect3Value_New) == 0))
		{
			seaAlert(getSeaPhrase("CM_149","CM"));
			removeWaitAlert();
			return;
		}
	}
	else
	{
		JobAlert1Index_New = GetSelectFormObject("main", "JobAlertSelect1", "jobalertselect1").selectedIndex;
		JobAlert2Index_New = GetSelectFormObject("main", "JobAlertSelect2", "jobalertselect2").selectedIndex;
		JobAlert3Index_New = GetSelectFormObject("main", "JobAlertSelect3", "jobalertselect3").selectedIndex;

		if (!JobAlert1Index && !JobAlert2Index && !JobAlert3Index && !JobAlert1Index_New && !JobAlert2Index_New && !JobAlert3Index_New)
		{
			seaAlert(getSeaPhrase("CM_149","CM"));
			removeWaitAlert();
			return;
		}	
	}
	
	HS50_5_Codes = new Array();
	var HS50_Lgth = 0;

	if (emssObjInstance.emssObj.filterSelect)
	{
		if (NonSpace(FilterSelect1Value) > 0)
		{
			HS50_Lgth = HS50_5_Codes.length;
			HS50_5_Codes[HS50_Lgth] = new Object();
			HS50_5_Codes[HS50_Lgth].jobcode = FilterSelect1Value;
			HS50_5_Codes[HS50_Lgth].position = null;
			HS50_5_Codes[HS50_Lgth].fc = "D";
		}

		if (NonSpace(FilterSelect2Value) > 0)
		{
			HS50_Lgth = HS50_5_Codes.length;
			HS50_5_Codes[HS50_Lgth] = new Object();
			HS50_5_Codes[HS50_Lgth].jobcode = FilterSelect2Value;
			HS50_5_Codes[HS50_Lgth].position = null;
			HS50_5_Codes[HS50_Lgth].fc = "D";
		}
	
		if (NonSpace(FilterSelect3Value) > 0)
		{
			HS50_Lgth = HS50_5_Codes.length;
			HS50_5_Codes[HS50_Lgth] = new Object();
			HS50_5_Codes[HS50_Lgth].jobcode = FilterSelect3Value;
			HS50_5_Codes[HS50_Lgth].position = null;
			HS50_5_Codes[HS50_Lgth].fc = "D";
		}	
	}
	else
	{
		if (JobAlert1Index != 0)
		{
			HS50_Lgth = HS50_5_Codes.length;
			HS50_5_Codes[HS50_Lgth] = new Object();
			HS50_5_Codes[HS50_Lgth].jobcode = JobSelects[JobAlert1Index-1].code; //JobOpeningsWindowInformation[JobAlert1Index-1].code;
			HS50_5_Codes[HS50_Lgth].position = null //JobOpeningsWindowInformation[JobAlert1Index-1].position;
			HS50_5_Codes[HS50_Lgth].fc = "D"
		}
	
		if (JobAlert2Index != 0)
		{
			HS50_Lgth = HS50_5_Codes.length;
			HS50_5_Codes[HS50_Lgth] = new Object();
			HS50_5_Codes[HS50_Lgth].jobcode = JobSelects[JobAlert2Index-1].code; //JobOpeningsWindowInformation[JobAlert2Index-1].code;
			HS50_5_Codes[HS50_Lgth].position = null //JobOpeningsWindowInformation[JobAlert2Index-1].position;
			HS50_5_Codes[HS50_Lgth].fc = "D"
		}
	
		if (JobAlert3Index != 0)
		{
			HS50_Lgth = HS50_5_Codes.length;
			HS50_5_Codes[HS50_Lgth] = new Object();
			HS50_5_Codes[HS50_Lgth].jobcode = JobSelects[JobAlert3Index-1].code; //JobOpeningsWindowInformation[JobAlert3Index-1].code;
			HS50_5_Codes[HS50_Lgth].position = null //JobOpeningsWindowInformation[JobAlert3Index-1].position;
			HS50_5_Codes[HS50_Lgth].fc = "D"
		}
	}
	
	if(HS50_5_Codes.length)
		Do_HS50_5_Call(HS50_5_Codes,0,"HS50.5","C",false,"JOBALERT_DELETE")
	else
		Do_HS50_5_Call_JOBALERT_DELETE_Finished(true);
}

function ResetJobInterests()
{
	if (emssObjInstance.emssObj.filterSelect)
	{
		var pFormObj;
		pFormObj = GetTextBoxFormObject("main", "JobAlertFilterSelect1", "JobAlertFilterSelect1_JobOpenings");
		FilterSelect1Value = pFormObj.value;
		
		pFormObj = GetTextBoxFormObject("main", "JobAlertFilterSelect2", "JobAlertFilterSelect2_JobOpenings");
		FilterSelect2Value = pFormObj.value;		
	
		pFormObj = GetTextBoxFormObject("main", "JobAlertFilterSelect3", "JobAlertFilterSelect3_JobOpenings");
		FilterSelect3Value = pFormObj.value;	
	}
	else
	{
		JobAlert1Index = GetSelectFormObject("main", "JobAlertSelect1", "jobalertselect1").selectedIndex;
		JobAlert2Index = GetSelectFormObject("main", "JobAlertSelect2", "jobalertselect2").selectedIndex;
		JobAlert3Index = GetSelectFormObject("main", "JobAlertSelect3", "jobalertselect3").selectedIndex;
	}
}

function Do_HS50_5_Call_JOBALERT_DELETE_Finished(skipErrorCheck)
{
	if (!skipErrorCheck && self.lawheader.gmsgnbr != "000")
	{
		seaAlert(self.lawheader.gmsg);
		removeWaitAlert();
		return;
	}

	ResetJobInterests();

	HS50_5_Codes = new Array();
	var HS50_Lgth = 0;

	if (emssObjInstance.emssObj.filterSelect)
	{				
		if (NonSpace(FilterSelect1Value) > 0)
		{
			HS50_Lgth = HS50_5_Codes.length;
			HS50_5_Codes[HS50_Lgth] = new Object();
			HS50_5_Codes[HS50_Lgth].jobcode = FilterSelect1Value;
			HS50_5_Codes[HS50_Lgth].position = null;
			HS50_5_Codes[HS50_Lgth].fc = "A"
		}

		if (NonSpace(FilterSelect2Value) > 0)
		{
			HS50_Lgth = HS50_5_Codes.length;
			HS50_5_Codes[HS50_Lgth] = new Object();
			HS50_5_Codes[HS50_Lgth].jobcode = FilterSelect2Value;
			HS50_5_Codes[HS50_Lgth].position = null;
			HS50_5_Codes[HS50_Lgth].fc = "A"
		}

		if (NonSpace(FilterSelect3Value) > 0)
		{
			HS50_Lgth = HS50_5_Codes.length;
			HS50_5_Codes[HS50_Lgth] = new Object();
			HS50_5_Codes[HS50_Lgth].jobcode = FilterSelect3Value;
			HS50_5_Codes[HS50_Lgth].position = null;
			HS50_5_Codes[HS50_Lgth].fc = "A"
		}	
	}
	else
	{
		if (JobAlert1Index != 0)
		{
			HS50_Lgth = HS50_5_Codes.length;
			HS50_5_Codes[HS50_Lgth] = new Object();
			HS50_5_Codes[HS50_Lgth].jobcode = JobSelects[JobAlert1Index-1].code; //JobOpeningsWindowInformation[JobAlert1Index-1].code;
			HS50_5_Codes[HS50_Lgth].position = null //JobOpeningsWindowInformation[JobAlert1Index-1].position;
			HS50_5_Codes[HS50_Lgth].fc = "A"
		}

		if (JobAlert2Index != 0)
		{
			HS50_Lgth = HS50_5_Codes.length;
			HS50_5_Codes[HS50_Lgth] = new Object();
			HS50_5_Codes[HS50_Lgth].jobcode = JobSelects[JobAlert2Index-1].code; //JobOpeningsWindowInformation[JobAlert2Index-1].code;
			HS50_5_Codes[HS50_Lgth].position = null //JobOpeningsWindowInformation[JobAlert2Index-1].position;
			HS50_5_Codes[HS50_Lgth].fc = "A"
		}

		if (JobAlert3Index != 0)
		{
			HS50_Lgth = HS50_5_Codes.length;
			HS50_5_Codes[HS50_Lgth] = new Object();
			HS50_5_Codes[HS50_Lgth].jobcode = JobSelects[JobAlert3Index-1].code; //JobOpeningsWindowInformation[JobAlert3Index-1].code;
			HS50_5_Codes[HS50_Lgth].position = null //JobOpeningsWindowInformation[JobAlert3Index-1].position;
			HS50_5_Codes[HS50_Lgth].fc = "A"
		}
	}

	if(HS50_5_Codes.length)
		Do_HS50_5_Call(HS50_5_Codes,0,"HS50.5","C",false,"JOBALERT_ADD")
	else
	{
		ResetJobInterests()
		var S = (HS50_5_Codes.length==1)? getSeaPhrase("CM_150","CM") : getSeaPhrase("CM_151","CM");
		seaAlert(S);
		removeWaitAlert();
	}
}

function Do_HS50_5_Call_JOBALERT_ADD_Finished()
{
	if (self.lawheader.gmsgnbr != "000")
	{
		seaAlert(self.lawheader.gmsg);
		removeWaitAlert();
		return;
	}

	ResetJobInterests()
	var S = (HS50_5_Codes.length==1)? getSeaPhrase("CM_150","CM") : getSeaPhrase("CM_151","CM");
	seaAlert(S);
	removeWaitAlert();
}

function SubmitApplication_JobOpenings_OnClick(checkForError, n)
{
	if (!n)
	{
		showWaitAlert(getSeaPhrase("CM_155","CM"));
	}
	
	var pFormObj;
	
	if (emssObjInstance.emssObj.filterSelect)
	{
		pFormObj = self.filterList.document.forms["jobOpenings"]
		var pFormElms = pFormObj.elements;
		var elmLen = pFormElms.length;

		// if an AGS call to PA43 has already occurred, check for an error, otherwise assemble the
		// list of jobs to submit.
		if (checkForError)
		{
			if (self.lawheader.gmsgnbr != "000" && self.lawheader.gmsgnbr != "106")
			{
				displayPA43Error(n);
				return;
			}
		}
		else
		{	
			selectedJobs = new Array();
			for (var i=0; i<elmLen; i++)
			{
				if (pFormElms[i].checked)
				{
					selectedJobs[selectedJobs.length] = i;
				}
			}		
		}
		
	}
	else
	{
		pFormObj = GetFormFromStansWindowLayer("main", "JobOpeningsWindow", "jobOpenings")	

		// if an AGS call to PA43 has already occurred, check for an error, otherwise assemble the
		// list of jobs to submit.
		if (checkForError)
		{
			if (self.lawheader.gmsgnbr != "000" && self.lawheader.gmsgnbr != "106")
			{
				displayPA43Error(n);
				return;
			}
		}
		else
		{	
			selectedJobs = new Array();
			for (var i = 0;i < JobOpeningsWindowInformation.length;i++)
			{
				if (eval("pFormObj.openings"+i).checked)
				{
					selectedJobs[selectedJobs.length] = i;
				}
			}		
		}
	}
	
	if (selectedJobs.length > 0)
	{
		var thisJob = selectedJobs.shift();	
		MoreThanOneApplication++;
        	if (emssObjInstance.emssObj.filterSelect) {
        	    var checkBoxElm = pFormObj.elements[thisJob];
        	    checkBoxElm.checked = false;
        	    self.filterList.styleElement(checkBoxElm);
        	} else {
        	    var checkBoxElm = eval("pFormObj.openings"+thisJob); 
        	    checkBoxElm.checked = false;
        	    self.main.styleElement(checkBoxElm);
        	}
		ApplyForJob(thisJob);
	}
	else
	{
		ApplicationSubmitted();
	}	
}

function displayPA43Error(n)
{
	removeWaitAlert();
	var jobRec;
				
	if (emssObjInstance.emssObj.filterSelect)
	{
		jobRec = self.HIDDEN.record[n];
	}
	else
	{
		jobRec = JobOpeningsWindowInformation[n];
	}
				
	var msgNbr = parseInt(self.lawheader.gmsgnbr, 10);
	var errorMsg = getSeaPhrase("JOB_SUBMISSION_ERROR", "ESS") + " " + jobRec.description;

	switch(msgNbr)
	{
		case 108:
		case 123:
			errorMsg += "\n\n" + getSeaPhrase("WEB_APPLICANT_STATUS_ERROR", "ESS");
			break;
		case 107:
		case 124:
			errorMsg += "\n\n" + getSeaPhrase("WEB_HIRE_SOURCE_ERROR", "ESS");
			break;
		default:
			break;
	}

	errorMsg += "\n\n(" + self.lawheader.gmsg + ")\n\n" + getSeaPhrase("CONTACT_HR", "ESS");
	alert(errorMsg);
}

function ApplyForJob(n)
{
	StoreDateRoutines()
	
	var reqNbr;
	if (emssObjInstance.emssObj.filterSelect)
	{
		reqNbr = Number(self.HIDDEN.record[n].requisition);
	}
	else
	{
		reqNbr = Number(JobOpeningsWindowInformation[n].requisition);
	}

	var pAgsObj = new AGSObject(authUser.prodline, "PA43.1");
	pAgsObj.event = "CHANGE";
	pAgsObj.rtn = "MESSAGE";
	pAgsObj.longNames = true;
	pAgsObj.tds = false;
	pAgsObj.debug = false;
	pAgsObj.field = "FC=C"
		  + "&PJR-COMPANY=" + parseInt(authUser.company,10)
		  + "&PJR-REQUISITION=" + escapeEx(reqNbr)
		  + "&LINE-FC1=A"
	      	  + "&PRA-EMP-APP1=0"
		  + "&PRA-APPLICANT1=" + parseInt(authUser.employee,10)
		  + "&PQL-APP-STATUS1=WA"
		  + "&PQL-DATE1=" + formjsDate(fmttoday)
		  + "&PRA-DATE-APPLIED1=" + formjsDate(fmttoday)
		  + "&PRA-HIRE-SOURCE1=WEBAPP"

	pAgsObj.func = "parent.SubmitApplication_JobOpenings_OnClick(true,"+n+")";

	AGS(pAgsObj,"jsreturn")
}

function ApplicationSubmitted()
{
	switch(MoreThanOneApplication)
	{
	case 0:	seaAlert(getSeaPhrase("CM_152","CM"));
		removeWaitAlert();
			break;
	case 1: seaAlert(getSeaPhrase("CM_153","CM"));
			PAREQAPP_Call("RefreshJobsAppliedFor()");
			break;
	default: seaAlert(getSeaPhrase("CM_153","CM"));
			PAREQAPP_Call("RefreshJobsAppliedFor()");
	}
}

function RefreshJobsAppliedFor()
{
	var Desc = ''
	for(var i=0; i<JobAppliedFor.length; i++)
	{
		Desc += '<span class="contenttextCM">' + JobAppliedFor[i].description + '</span><br>'
		Desc += '<span class="contentlabelCM">'+getSeaPhrase("CM_139","CM")+'</span> '
		Desc += '<span class="contenttextCM">'+JobAppliedFor[i].dateHired+'</span><p>'
	}
	ReplaceWindowContent("main", "JobsAppliedForWindow", Desc)
	removeWaitAlert();
}

/*
 *	Explore Careers Tab
 */ 

function DrawExploreCareersWindows(TabName, ProfileTabName)
{
	_TABSELECTED = TabName;
	_EXPLOREPROFILETABSELECTED = ProfileTabName;

	DrawExploreCareersWindowsTabs(false, TabName, true);
		
	if (emssObjInstance.emssObj.filterSelect)
	{	
		DrawExploreCareersWindows_EmployeeContent();
	}
	else
	{	
		if (_EXPLORECURRENTWIN == "EXPLOREJOBTITLE" &&
			(typeof(JobCode) == "undefined" || JobCode == null))
		{
			var JobTitle = new JobCodeObject("EXPLORECAREERS");
			JobTitle.frame = "jsreturn";
			JobTitle.isSelect = true;
			JobTitle.PaintJobCode();
		}
		else
			PaintJobCode_EXPLORECAREERS_Done();	
	}
}

function PaintJobCode_EXPLORECAREERS_Done()
{
	if (_EXPLORECURRENTWIN == "EXPLORECATEGORY" && 
		(typeof(JobClass) == "undefined" || JobClass == null)) 
	{
		var JobCategory = new JobClassObject();
		JobCategory.frame = "jsreturn";
		JobCategory.isSelect = true;
		JobCategory.PaintJobClass();
	}	
	else
		PaintJobClass_Done();
}

function PaintJobClass_Done()
{	
	DrawExploreCareersWindows_EmployeeContent();
}

//////////////////////////////////////////////////////////////////////////////////////////
//								MAIN DRAWING TASKS										//
//////////////////////////////////////////////////////////////////////////////////////////

function DrawExploreCareersWindows_EmployeeContent()
{	
	DrawTrainingGapTabs(false, 0, false);
	DrawCourseDetailTabs(false, 0, false, "MyJobProfile", true);
	DrawJobProfileTabs_MyJobProfile(false,_EXPLOREPROFILETABSELECTED,false);
	DrawJobProfile_MyJobProfile(false,false);
	DrawCourseDetail("MyJobProfile");
	DrawCourses_MyJobProfile();
	DrawDetail_MyJobProfile();
	DrawAdditionalJobDetail_MyJobProfile();
	DrawJobDescription_MyJobProfile();
	
	switch(_EXPLORECURRENTWIN)
	{
		case "EXPLORECATEGORY":
			DrawCategoryTab_EmployeeExploreCareers();
			DrawExploreCareersWindowsTabs(true, 1);
			break;
		
		case "EXPLOREQUALCRITERIA":
			DrawQualCriteriaTab_EmployeeExploreCareers();
			DrawExploreCareersWindowsTabs(true, 2);
			break;
			
		default: // "EXPLOREJOBTITLE"	
			DrawJobTitleTab_EmployeeExploreCareers();
			DrawExploreCareersWindowsTabs(true, 0);
			break;
	}

	if (_REFRESHPROFILE) 
	{
		ShowJobProfileWin(true,"main");
		_REFRESHPROFILE = false;
	}	
	
	if (_REFRESHJOBLIST) 
	{
		if (_CURRENTTAB == "EXPLORECAREERS" && _EXPLORECURRENTWIN == "EXPLORECATEGORY")
		{
			ShowExploreCareers(false, "Category", true);
			ReDrawCategoryJobListContent();
			ShowJobList_ExploreCareers(true);
		}
		if (_CURRENTTAB == "EXPLORECAREERS" && _EXPLORECURRENTWIN == "EXPLOREQUALCRITERIA")
		{
			ShowExploreCareers(false, "QualCriteria", true);
			ReDrawQualCriteriaJobListContent();
			ShowJobList_ExploreCareers(true);
		}
			
		_REFRESHJOBLIST = false;
	}	
	
	FinishedDrawingTabs()	
}

function DrawJobTitleTab_EmployeeExploreCareers()
{
	pObj = new CareerManagementWindowObject(Window3,"main", "Instructions_EmployeeExploreCareers", 402,71,392,442, true, getSeaPhrase("CM_114","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.Draw();

	Desc = '<span class="contenttextCM">'+getSeaPhrase("CM_115","CM")+'</span><p>'
	Desc += '<span class="contenttextCM">'+getSeaPhrase("CM_116","CM")+'</span>'
	createLayer("main","JobTitle_Instructions",415,105,370,150,true,Desc,"","",true);

	if (emssObjInstance.emssObj.filterSelect)
	{
		MakeTextBox("JobTitleFilterSelect", 500, 275, 105, 25, "JobTitleFilterSelect_ExploreCareers", true, 30, "", 'styler="select" styler_click="parent.JobTitleFilterSelectArrow_OnClick"');
		MakeButton('<img style="cursor:hand;cursor:pointer" border="0" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" alt="'+getSeaPhrase("SELECT_VALUE","ESS")+'">', 595, 275, 12, 16,
			WindowColor, "JobTitleFilterSelectArrow", true, getSeaPhrase("CM_185","CM"), true, 'styler="hidden"');
		var buttonObj = getLayerDocument("main", "JobTitleFilterSelectArrowButton");	
		if (buttonObj != null)
		{
			buttonObj.setAttribute("styler", "hidden");
		}			
		Desc = '<span id="JobTitleFilterSelectDesc" class="contenttextdisplayCM"></span>'
		createLayer("main","JobTitleFilterSelectDesc_ExploreCareers",612,275,150,30,true,Desc,"","");	
	}
	else
	{
		MakeSelectBox("JobTitleSelect", 500, 275, 300, 23, "jobtitleselect", JobCode, true, _JOBCODEINDEX, true);	
	}
	MakeButton(getSeaPhrase("CM_117","CM"), 500, 304, 150, 30, ButtonBorderColor, "createprofile_EmployeeExploreCareers", true);
}

function DrawCategoryTab_EmployeeExploreCareers()
{
	pObj = new CareerManagementWindowObject(Window3,"main", "Instructions_EmployeeExploreCareers", 402,71,392,442, true, getSeaPhrase("CM_114","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.Draw();

	Desc = '<span class="contenttextCM">'+getSeaPhrase("CM_115","CM")+'</span><p>'
	Desc += '<span class="contenttextCM">'+getSeaPhrase("CM_118","CM")+'</span>'
	createLayer("main","Category_Instructions",415,105,370,150,true,Desc,"","",true);
	
	if (emssObjInstance.emssObj.filterSelect)
	{
		MakeTextBox("CategoryFilterSelect", 500, 275, 105, 25, "CategoryFilterSelect_ExploreCareers", true, 30, "", 'styler="select" styler_click="parent.CategoryFilterSelectArrow_OnClick"');
		MakeButton('<img style="cursor:hand;cursor:pointer" border="0" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" alt="'+getSeaPhrase("SELECT_VALUE","ESS")+'">', 595, 275, 12, 16,
			WindowColor, "CategoryFilterSelectArrow", true, getSeaPhrase("CM_185","CM"), true, 'styler="hidden"');
		var buttonObj = getLayerDocument("main", "CategoryFilterSelectArrowButton");	
		if (buttonObj != null)
		{
			buttonObj.setAttribute("styler", "hidden");
		}			
		Desc = '<span id="CategoryFilterSelectDesc" class="contenttextdisplayCM"></span>'
		createLayer("main","CategoryFilterSelectDesc_ExploreCareers",612,275,150,30,true,Desc,"","");	
	}
	else
	{	
		MakeSelectBox("CategorySelect", 500, 275, 300, 23, "categoryselect", JobClass, true, _JOBCATEGORYINDEX, true);
	}
	MakeButton(getSeaPhrase("CM_119","CM"), 500, 304, 150, 30, ButtonBorderColor, "createjoblist_EmployeeExploreCareers", true);

	DrawJobListWindow_ExploreCareers(false);
}

function DrawQualCriteriaTab_EmployeeExploreCareers()
{
	pObj = new CareerManagementWindowObject(Window3,"main", "Instructions_EmployeeExploreCareers", 402,71,392,442, true, getSeaPhrase("CM_114","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'	
	pObj.Draw();

	Desc = '<center><a class="contenttextCM" href="javascript:parent.Do_HS50_1_Call_DEFAULTPROFILE_Finished(true)">'
		+ getSeaPhrase("CM_120","CM") + '</a></center><br>'
		+ '<span class="contenttextCM">'+getSeaPhrase("CM_121","CM")+'</span><p>'
		
	createLayer("main","QualCriteria_Instructions",415,105,370,150,true,Desc,"","",true);
	
	DrawQualificationSelectBoxes("QualCriteria",QualCriteria_ExploreCareers,true,238);
	
	MakeButton(getSeaPhrase("CM_122","CM"), 610, 450, 150, 30, ButtonBorderColor, "ClearForm_ExploreCareers", true);	
	MakeButton(getSeaPhrase("CM_123","CM"), 450, 450, 160, 30, ButtonBorderColor, "qualcriteria_createjoblist_EmployeeExploreCareers", true);	
	
	DrawQualCriteriaTypeListWindow(false);
	DrawQualCriteriaCodeListWindow(false);
	DrawJobListWindow_ExploreCareers(false);
}

function createprofile_EmployeeExploreCareers_OnClick()
{
	var SelectJobCode;
	var SelectedJobCode;
	
	showWaitAlert(getSeaPhrase("CM_155","CM"));
	
	if (emssObjInstance.emssObj.filterSelect)
	{
		SelectJobCode = GetTextBoxFormObject("main", "JobTitleFilterSelect", "JobTitleFilterSelect_ExploreCareers");
		SelectedJobCode = SelectJobCode.value;	
	}
	else
	{
		SelectJobCode = GetSelectFormObject("main", "JobTitleSelect", "jobtitleselect");
		SelectedJobCode = SelectJobCode.options[SelectJobCode.selectedIndex].value;
	}
	
	if (NonSpace(SelectedJobCode) == 0) 
	{
		seaAlert(getSeaPhrase("CM_124","CM"))
		removeWaitAlert();
		return;
	}	

	_EXPLOREPROFILETABSELECTED = 0;	
	Do_HS50_Call(2,1," ",SelectedJobCode,"HS50.1","EXPLORECAREERS", authUser.employee)
}

function Do_HS50_1_Call_EXPLORECAREERS_Finished()
{
	if (self.lawheader.gmsgnbr != "000")
	{
		seaAlert(self.lawheader.gmsg);
		removeWaitAlert();
		return;
	}
	
	if (CareerProfile.jobCompFlag != "Y" && CareerProfile.empCompFlag != "Y")
	{
		seaAlert(getSeaPhrase("CM_125","CM"));		
	}
	else if (CareerProfile.jobCompFlag != "Y")
	{
		seaAlert(getSeaPhrase("CM_126","CM"));
	}
	else if (CareerProfile.empCompFlag != "Y")
	{
		seaAlert(getSeaPhrase("CM_127","CM"));
	}
	// display job profile window for employee's selected job title
	var SelectedJobDesc = getSeaPhrase("CM_128","CM");
	switch(_EXPLORECURRENTWIN)
	{
		case "EXPLORECATEGORY":
			SelectedJobDesc += " - " + _JOBLISTDESC;
			break;
		
		case "EXPLOREQUALCRITERIA":
			SelectedJobDesc += " - " + _JOBLISTDESC;
			break;
			
		default: // "EXPLOREJOBTITLE"
			if (emssObjInstance.emssObj.filterSelect)
			{
				var SelectJobCode = getLayerDocument("main", "JobTitleFilterSelectDesc_ExploreCareers");
				var jobSpan = SelectJobCode.getElementsByTagName("SPAN");
				if (jobSpan.length > 0)
				{
					SelectedJobDesc += " - " + jobSpan[0].innerHTML;
				}
			}
			else
			{
				var SelectJobCode = GetSelectFormObject("main", "JobTitleSelect", "jobtitleselect");
				var JobCodeSelectedIndex = SelectJobCode.selectedIndex;
				SelectedJobDesc += " - " + JobCode[JobCodeSelectedIndex-1].description;
			}		
			break;
	}

	RefreshJobProfileLink_MyJobProfile();
	_CURRENTPROFILEDESC = SelectedJobDesc;
	ShowJobProfileWin(true,"main");
	removeWaitAlert();
}

function qualcriteria_createjoblist_EmployeeExploreCareers_OnClick()
{
	showWaitAlert(getSeaPhrase("CM_155","CM"));
	var HS51Fields = new Array();
	
	// go through criteria select boxes and only use the ones that are filled in
	for (var i=1;i<=QualCriteria_ExploreCareers.QualLabels.length;i++)
	{
		var QualBox = GetTextBoxFormObject("main", "QualCriteria"+i, "qualcriteria"+i);
		var QualBoxType = QualCriteria_ExploreCareers.QualTypes[i-1];
		var QualBoxCode = QualCriteria_ExploreCareers.QualCodes[i-1];
					
		if (NonSpace(QualBox.value)!=0 && NonSpace(QualBoxType)!=0 &&
			NonSpace(QualBoxCode)!=0)
		{
			// use this criteria when making hs51.1 call to generate a job list
			HS51Fields[HS51Fields.length] = new Object();
			HS51Fields[HS51Fields.length-1].type = QualBoxType; 
			HS51Fields[HS51Fields.length-1].code = QualBoxCode;
			HS51Fields[HS51Fields.length-1].seqnbr = null; 
		}		
		
		if (NonSpace(QualBox.value)==0 && (NonSpace(QualBoxType)!=0 || NonSpace(QualBoxCode)!=0))
		{
			replaceContent("main", "QualCriteriaLabel"+i, "");
			QualCriteria_ExploreCareers.QualLabels[i-1] = "";
			QualCriteria_ExploreCareers.QualTypes[i-1] = "";
			QualCriteria_ExploreCareers.QualCodes[i-1] = "";
			QualCriteria_ExploreCareers.QualDescs[i-1] = "";
		}
	}
	
	QualificationJobList = new QualificationJobObject();
	Do_HS51_Call(HS51Fields,authUser.employee,"HS51.1");
}

function createjoblist_EmployeeExploreCareers_OnClick()
{
	showWaitAlert(getSeaPhrase("CM_155","CM"));
	
	var SelectJobClass;
	var SelectedJobClass;
	var SelectedJobClassIndex;
	
	if (emssObjInstance.emssObj.filterSelect)
	{
		SelectJobClass = GetTextBoxFormObject("main", "CategoryFilterSelect", "CategoryFilterSelect_ExploreCareers");
		SelectedJobClass = SelectJobClass.value;
		
		if (NonSpace(SelectedJobClass) == 0) 
		{
			seaAlert(getSeaPhrase("CM_34","CM"));
			removeWaitAlert();
			return;
		}				
	}
	else
	{
		SelectJobClass = GetSelectFormObject("main", "CategorySelect", "categoryselect");
		SelectedJobClassIndex = SelectJobClass.selectedIndex;
		
		if (SelectedJobClassIndex == 0) 
		{
			seaAlert(getSeaPhrase("CM_34","CM"));
			removeWaitAlert();
			return;
		}		

		if (!JobClass[SelectedJobClassIndex-1].Rel_jobcodes.length)
		{
			seaAlert(getSeaPhrase("CM_129","CM"));
			removeWaitAlert();
			return;
		}
	}

	ShowExploreCareers(false, "Category", true);
	
	// display job list window for employee's selected job category
	if (emssObjInstance.emssObj.filterSelect)
	{
		var SelectJobClass = getLayerDocument("main", "CategoryFilterSelectDesc_ExploreCareers");
		var jobSpan = SelectJobClass.getElementsByTagName("SPAN");
		var CatDesc = getSeaPhrase("CM_130","CM");
		if (jobSpan.length > 0)
		{
			CatDesc += " - " + jobSpan[0].innerHTML;
		}
		_CURRENTJOBLISTDESC = CatDesc;
	}
	else
	{
		var CatDesc = JobClass[SelectedJobClassIndex-1].description;
		_CURRENTJOBLISTDESC = getSeaPhrase("CM_130","CM")+" - " + CatDesc;
		_JOBCATEGORYINDEX = SelectedJobClassIndex-1;
	}	
		
	ReDrawCategoryJobListContent();
	
	ShowWin(false, "main", "Instructions_EmployeeExploreCareers");
	ShowJobList_ExploreCareers(true);
	removeWaitAlert();
}

/*
 *	Job Profile Tab
 */

var _TABSELECTED;

function DrawJobProfileWindows(TabName, NoRefresh)
{
	_TABSELECTED = TabName;
	_DIRECTREPORTSINDEX = authUser.employee;
	
	DrawJobProfileTabs_MyJobProfile	(
									 	false,	//Do not redraw
						 			 	(arguments.length>0) ? arguments[0] : 0	
									)
						
	DrawCourseDetailTabs(
							false,//Do not redraw
							0, 	//Set to tab 0
						  	false,//Visible flag
						  	"MyJobProfile",
						  	true	//Set close icon
						);

	if (NoRefresh)
	{
		Do_HS50_1_Call_JOBPROFILE_Finished();
	}
	else if ((typeof(JobProfileCareerProfile) != "undefined") && (JobProfileCareerProfile != null))
	{
		CareerProfile = JobProfileCareerProfile;
		Do_HS50_1_Call_JOBPROFILE_Finished();
	}
	else
		Do_HS50_Call(2, 1, " ", null, "HS50.1", "JOBPROFILE", authUser.employee)
}

function Do_HS50_1_Call_JOBPROFILE_Finished()
{
	if (JobProfileCareerProfile == null)
		JobProfileCareerProfile = CareerProfile;

	DrawInstructions_MyJobProfile()
	DrawCourseDetail("MyJobProfile")
	DrawCourses_MyJobProfile()
	DrawDetail_MyJobProfile()
	DrawAdditionalJobDetail_MyJobProfile()
	DrawJobDescription_MyJobProfile()

	DrawJobProfile_MyJobProfile(true,false)

	PaintJobProfileInformation(_TABSELECTED)
	
	FinishedDrawingTabs()
}

/*
 *	Training Options Tab
 */

var MainTabSelected = 0;
var TrainingCourses = new Array(0);

function DrawTrainingOptionsWindows(NoRefresh)
{
	switch(_TRAINCURRENTWIN)
	{
		case "TRAININGCATEGORY": DrawTrainingWindowsTabs(false, 0, true);break;
		case "TRAININGQUALIFICATIONCRITERIA": DrawTrainingWindowsTabs(false, 1, true);break;
		case "TRAININGJOBGAPS": DrawTrainingWindowsTabs(false, 2, true);break;
	}
	
	DrawTrainingGapTabs(false, 0, false);
	DrawCourseDetailTabs(false, 0, false, "TrainingOptions", true);
	
	if (NoRefresh)
	{
		Do_HS50_1_Call_TRAININGOPTIONS_Finished();	
	}
	else if ((typeof(JobProfileCareerProfile) != "undefined") && (JobProfileCareerProfile != null))
	{
		// Training Options uses the same HS50.1 data as Job Profile; use a cached version, if available.
		CareerProfile = JobProfileCareerProfile;
		Do_HS50_1_Call_TRAININGOPTIONS_Finished();
	}	
	else
		Do_HS50_Call(2, 1, " ", null, "HS50.1", "TRAININGOPTIONS", authUser.employee)
}

function Do_HS50_1_Call_TRAININGOPTIONS_Finished()
{
	if (JobProfileCareerProfile == null)
		JobProfileCareerProfile = CareerProfile;

	DrawInstructions_TrainingOptions(false)
	DrawTrainingGaps_TrainingOptions()
	DrawCourseDetail("TrainingOptions")
	DrawTrainingQualCriteriaTypeList()
	DrawTrainingQualCriteriaCodeList()
	DrawCourses_TrainingOptions()

	ShowCourseDetail(false,"TrainingOptions")
	ShowCourses_TrainingOptions(false)	

	var reDrawFlag = false;
	
	switch(_TRAINCURRENTWIN)
	{
		case "TRAININGQUALIFICATIONCRITERIA":
			DrawTrainingWindowsTabs(true, 1);
			ShowTrainingOptions(false, "Category");
			ShowTrainingOptions(false, "ForJobGaps");
			ShowTrainingOptions(true, "QualificationCriteria");
			ShowTrainingQualCriteria_Instructions(true);
			break;
		
		case "TRAININGJOBGAPS":
			DrawTrainingWindowsTabs(true, 2);
			ShowTrainingOptions(false, "Category");
			ShowTrainingOptions(false, "QualificationCriteria");
			ShowTrainingOptions(true, "ForJobGaps");
			ShowTrainingQualCriteria_Instructions(false);
			PaintTrainingJobGapInformation(_TRAINJOBGAPSTAB);
			break;
		default:
			DrawTrainingWindowsTabs(true, 0);			
			ShowTrainingOptions(false, "QualificationCriteria");
			ShowTrainingOptions(false, "ForJobGaps");
			ShowTrainingOptions(true, "Category");
			ShowTrainingQualCriteria_Instructions(false);
			break;
	}
	
	FinishedDrawingTabs();
}

/*
 *	My Qualifications Tab
 */
 
function DrawMyQualificationsWindows()
{
	_TABSELECTED = 0;
	DrawQualficationsTabs(false, 0);
	DrawCategoryInstructions_MyQualifications();
	DrawCompetencyDetail_MyQualifications();
	FinishedDrawingTabs();
} 


 



 
