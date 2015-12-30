// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/careermanagement/manager/Attic/mgrlib.js,v 1.1.2.47 2014/02/25 22:49:13 brentd Exp $
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
 *	Group Profile Tab
 */
function DrawCourses_GroupProfile()
{
	var pObj = new CareerManagementWindowObject(Window8,"main", "Courses_GroupProfile", 402,22,395,250, false, getSeaPhrase("CM_194","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.AddCloseIcon = true;
	pObj.WindowColor = WindowColor
	pObj.CloseIconLocationLeft = pObj.Left + 365
	pObj.CloseIconLocationTop = pObj.Top + 5
	pObj.Draw();
	pObj.DrawView(420,52,360,200);
}

function DrawEmployeeGaps_GroupProfile()
{
	var pObj = new CareerManagementWindowObject(Window8,"main", "EmployeeGaps_GroupProfile", 402,275,395,250, false, getSeaPhrase("CM_195","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.AddCloseIcon = true;
	pObj.WindowColor = WindowColor
	pObj.CloseIconLocationLeft = pObj.Left + 365
	pObj.CloseIconLocationTop = pObj.Top + 5
	pObj.Draw();
	pObj.DrawView(416,310,368,203);
}

function sortByDescription(obj1, obj2)
{
	var name1 = obj1.Description;
	var name2 = obj2.Description;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function sortByQualificationDescription(obj1, obj2)
{
	var name1 = obj1.Qualification.Description;
	var name2 = obj2.Qualification.Description;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function SortDetail_GroupProfile()
{
	var competencyCounter = -1;
	var certificationCounter = -1;
	var educationCounter = -1;
	var employeeCounter = 0;
	for (var i=GroupProfile.Detail.length-1; i>=0; i--)
	{
		if (GroupProfile.Detail[i].Sort == null || GroupProfile.Detail[i].Sort == 0)
			continue;
		// Competency record
		if (Math.floor(GroupProfile.Detail[i].Sort/100) == 1)
		{
			if (GroupProfile.Detail[i].Employee == null || GroupProfile.Detail[i].Employee == 0)
			{
				employeeCounter = 0
				GroupProfile.CompetencyDetail[++competencyCounter] = new GroupProfileRecordObject()
				GroupProfile.CompetencyDetail[competencyCounter].Qualification = GroupProfile.Detail[i]
			}
			else if (competencyCounter != -1)
				GroupProfile.CompetencyDetail[competencyCounter].Employees[employeeCounter++] = GroupProfile.Detail[i]
		}
		// Certification record
		else if (Math.floor(GroupProfile.Detail[i].Sort/100) == 2)
		{
			if (GroupProfile.Detail[i].Employee == null || GroupProfile.Detail[i].Employee == 0)
			{
				employeeCounter = 0
				GroupProfile.CertificationDetail[++certificationCounter] = new GroupProfileRecordObject()
				GroupProfile.CertificationDetail[certificationCounter].Qualification = GroupProfile.Detail[i]
			}
			else if (certificationCounter != -1)
				GroupProfile.CertificationDetail[certificationCounter].Employees[employeeCounter++] = GroupProfile.Detail[i]
		}
		// Education record
		else if (Math.floor(GroupProfile.Detail[i].Sort/100) == 3)
		{
			if (GroupProfile.Detail[i].Employee == null || GroupProfile.Detail[i].Employee == 0)
			{
				employeeCounter = 0
				GroupProfile.EducationDetail[++educationCounter] = new GroupProfileRecordObject()
				GroupProfile.EducationDetail[educationCounter].Qualification = GroupProfile.Detail[i]
			}
			else if (educationCounter != -1)
				GroupProfile.EducationDetail[educationCounter].Employees[employeeCounter++] = GroupProfile.Detail[i]
		}
	}
	GroupProfile.CompetencyDetail.sort(sortByQualificationDescription);
	GroupProfile.CertificationDetail.sort(sortByQualificationDescription);
	GroupProfile.EducationDetail.sort(sortByQualificationDescription);
}

function QualificationClicked_GroupProfile(Tab, Index)
{
	var pObj = new Array();
	var QualificationList = new Array();
	switch (Tab)
	{
		case 0: QualificationList = GroupProfile.CompetencyDetail; break;
		case 1: QualificationList = GroupProfile.CertificationDetail; break;
		case 2: QualificationList = GroupProfile.EducationDetail; break;
	}
	// If we can't find the qualification record, exit rather than generating a javascript error.  (This shouldn't happen, but we'll err on the safe side.)
	if (!QualificationList[Index] || !QualificationList[Index].Employees)
	{	
		removeWaitAlert();
		return;
	}
	//DrawTrainingCoursesForGap(QualificationList,Index);
	DrawEmployeesWithGaps(QualificationList,Index);
}

function DrawEmployeesWithGaps(QualificationList, Index)
{
	var EmpLabels = new Array();
	var JobValues = new Array();
	var EmpValues = new Array();
	var Tmp = new Array();
	var ReqDetail = false;
	var EmpRec = new GroupProfileDetailObject();
	// Sort the employee detail records for this qualification gap in alpha order
	// by employee name.	
	QualificationList[Index].Employees.sort(sortByDescription);
	// Prepare the lists of chart proficiency values and labels.
	for (var j=QualificationList[Index].Employees.length-1; j>=0; j--)
	{
		Tmp = new Array();
		EmpRec = QualificationList[Index].Employees[j];
		var ReqDetail = (EmpRec.Description.charAt(0) == "*") ? true : false;
		Tmp[0] = EmpRec.Description.split(",")[1]+" "+EmpRec.Description.split(",")[0];
		Tmp[0] = Tmp[0].split("*").join("");
		Tmp[0] = Tmp[0].split("  ").join(" ");
		if (ReqDetail) Tmp[0] = "* " + Tmp[0];
		EmpLabels = Tmp.concat(EmpLabels);
		Tmp[0] = (EmpRec.JobPGrph != null && EmpRec.JobPGrph != "") ? setValue(EmpRec.JobPGrph)/10 : 0;
		JobValues = Tmp.concat(JobValues);
		Tmp[0] = (EmpRec.EmployeeProficiency != null && EmpRec.EmployeeProficiency != "") ? setValue(EmpRec.EmployeeProficiency)/10 : 0;
		EmpValues = Tmp.concat(EmpValues);
	}
	ShowSelectCriteria_GroupProfile(false);
	var EmployeeGapsDesc = '<span class="layertitleCM">'+ StripTitle(getSeaPhrase("CM_196","CM")
	+ " - "+QualificationList[Index].Qualification.Description, 60)+'</span>';
	ChangeTitle("main", "EmployeeGaps_GroupProfile", EmployeeGapsDesc);
	_JCHARTINDEX = Index;
	if (JobValues.length)
		Desc = BuildApplet(EmpLabels,JobValues,EmpValues,350,200,GroupProfile.SumMinProf,GroupProfile.SumMaxProf,-1);
	else
		Desc = '<br/><br/><br/><span class="contenttextCM">'+getSeaPhrase("CM_197","CM")+'</span>';
	ReplaceWindowContent("main","EmployeeGaps_GroupProfileWindow",Desc);
	ShowCourses_GroupProfile(false);
	ShowEmployeeGaps_GroupProfile(true);
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
}

function EmployeeGapsClicked_GroupProfile(Index)
{
	// The user is clicking an employee on the gaps chart.  Make sure we remove the sessions/prereqs window.
	CourseDetail_GroupProfile_XIconClicked();
	var QualificationList = new Array();
	switch (GROUPPROFILETAB)
	{
		case 0: QualificationList = GroupProfile.CompetencyDetail; break;
		case 1: QualificationList = GroupProfile.CertificationDetail; break;
		case 2: QualificationList = GroupProfile.EducationDetail; break;
	}
	// If we can't find the qualification record, exit rather than generating a
	// javascript error.  (This shouldn't happen, but we'll err on the safe side.)
	if (!QualificationList[_JCHARTINDEX] || !QualificationList[_JCHARTINDEX].Employees) return
	var EmpRec = QualificationList[_JCHARTINDEX].Employees[Index];
	var ReqDetail = (EmpRec.Description.charAt(0) == "*") ? true : false;
	var EmpName = EmpRec.Description.split(",")[1] +" "+ EmpRec.Description.split(",")[0];
	EmpName = EmpName.split("*").join("");
	EmpName = EmpName.split("  ").join(" ");
	if (ReqDetail) EmpName = "* "+EmpName;
	// Change the employee index value to reflect the report that has just been clicked.
	// This is necessary so that any session update will use the correct employee number.
	_EMPLOYEEINDEX = EmpRec.Employee;
	var TrainingCoursesDesc = '<span class="layertitleCM">'	+ StripTitle(getSeaPhrase("CM_194","CM")
		+ " - " + EmpName, 60)+ '</span>';
	ChangeTitle("main", "Courses_GroupProfile", TrainingCoursesDesc)
	// PT142651. Initialize TrainingCourses array.
	TrainingCourses = new Array();
	var HS50_3_Codes = new Array();
	HS50_3_Codes[0] = new Object();
	HS50_3_Codes[0].type = QualificationList[_JCHARTINDEX].Qualification.Type;
	HS50_3_Codes[0].code = QualificationList[_JCHARTINDEX].Qualification.Code;
	HS50_3_Codes[0].seqnbr = null;
	var empProf = QualificationList[_JCHARTINDEX].Employees[Index].EmployeeProficiency;
	HS50_3_Codes[0].plevel  = (empProf != null && empProf != "") ? setValue(empProf)/10 : null;
	Do_HS50_3_Call(HS50_3_Codes,"HS50.3",false,"GROUPPROFILE");
}

function Do_HS50_3_Call_GROUPPROFILE_Finished()
{
	// PT142651. If we need to perform a page down, make another AGS call to HS50.3.
	if (NonSpace(TrainingCourses.ptsort) > 0 || NonSpace(TrainingCourses.ptCourseDesc) > 0 
	|| NonSpace(TrainingCourses.ptCourseNumber) > 0 || NonSpace(TrainingCourses.ptCourse) > 0 
	|| NonSpace(TrainingCourses.ptseqnbr) > 0)
	{			
		// Use the stored off global variables to perform a pagedown AGS call.
		Do_HS50_3_Call(HS50_3_Codes,"HS50.3",false,"GROUPPROFILE",HS50_3_employee);
		return;	
	}
	RepaintCourses_GroupProfile();
	ShowCourses_GroupProfile(true);
	ShowEmployeeGaps_GroupProfile(true);
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
}

function RepaintCourses_GroupProfile(Index)
{
	if (typeof(Index) == "undefined" || Index == null || isNaN(parseFloat(Index)))
		TrainingCourses = ParseOutTrainingCourses(TrainingCourses);
	if (TrainingCourses.length)
	{
		var arg = '<table border="0" cellpadding="0" cellspacing="0" role="presentation">'
		for (var i=0; i<TrainingCourses.length; i++)
		{
			var toolTip = TrainingCourses[i].Course.courseDescription+' - '+getSeaPhrase("CM_399","CM");
			arg += '<tr><td'
			if (typeof(Index) != "undefined" && Index != null && Index == i)  
				arg += ' class="tablerowhighlightCM"'
			arg += '><a class="contenttextCM" href="javascript:;" onclick="parent.RepaintCourses_GroupProfile('+i+');parent.ShowGroupProfileSessions('+i+');return false;"'
			arg += ' title="'+toolTip+'">'+TrainingCourses[i].Course.courseDescription+'<span class="offscreen"> - '+getSeaPhrase("CM_399","CM")+'</span></a></td></tr>'
		}
		arg += '</table>'
		ReplaceWindowContent("main", "Courses_GroupProfileWindow", arg);
	}
	else
	{
		var arg = '<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td class="contenttextCM">'+getSeaPhrase("CM_198","CM")+'</td></tr></table>'
		ReplaceWindowContent("main", "Courses_GroupProfileWindow", arg);
	}
}

function ShowGroupProfileSessions(Index)
{
	ShowProfile_GroupProfile(false);
	ShowSessionsPreReq(Index, "GroupProfile");
}

function SubmitApplication_GroupProfile_OnClick()
{
	SubmitApplication_OnClick("GroupProfile");
}

function ShowProfile_GroupProfile(nCmd)
{
	ShowWin(nCmd, "main", "GroupProfile", true, true, true);
}

function OnTabClicked_CourseDetail_GroupProfile(TabSelected)
{
	OnTabClicked_CourseDetail(TabSelected, "GroupProfile");
}

function CourseDetail_GroupProfile_XIconClicked()
{
	ShowCourseDetail(false, "GroupProfile");
	ShowSubmitApplication(false, "GroupProfile");
	ShowProfile_GroupProfile(true);
}

function Courses_GroupProfile_XIconClicked()
{
	ShowCourses_GroupProfile(false);
	CourseDetail_GroupProfile_XIconClicked();
}

function EmployeeGaps_GroupProfile_XIconClicked()
{
	ShowCourses_GroupProfile(false);
	ShowEmployeeGaps_GroupProfile(false);
	CourseDetail_GroupProfile_XIconClicked();
	ShowSelectCriteria_GroupProfile(true);
}

function ShowSelectCriteria_GroupProfile(nCmd)
{
	ShowWin(nCmd, "main", "SelectCriteria_GroupProfile", true, true, false);
	if (nCmd)
		showLayer("main", "SelectCriteriaHeader_GroupProfile");
	else 
		hideLayer("main", "SelectCriteriaHeader_GroupProfile");
	if (nCmd)
		showLayer("main", "SelectCriteriaJobHeader_GroupProfile");
	else 
		hideLayer("main", "SelectCriteriaJobHeader_GroupProfile");
	ShowCmbJobCodesSelect_GroupProfile(nCmd);
}

function ShowCourses_GroupProfile(nCmd)
{
	ShowWin(nCmd, "main", "Courses_GroupProfile", true, true, false);
}

function ShowEmployeeGaps_GroupProfile(nCmd)
{
	ShowWin(nCmd, "main", "EmployeeGaps_GroupProfile", true, true, false);
}

function cmbJobCodesFilterSelectArrow_OnClick()
{
	openDmeFieldFilter("job_group_profile");
}

function ShowCmbJobCodesSelect_GroupProfile(nCmd)
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
		ShowSelect(nCmd, "main", "cmbJobCodes");
}

function DrawCourses_GroupProfile()
{
	var pObj = new CareerManagementWindowObject(Window8,"main", "Courses_GroupProfile", 402,22,395,250, false, getSeaPhrase("CM_194","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.AddCloseIcon = true;
	pObj.WindowColor = WindowColor
	pObj.CloseIconLocationLeft = pObj.Left + 365
	pObj.CloseIconLocationTop = pObj.Top + 5
	pObj.Draw();
	pObj.DrawView(420,52,360,200);
}

function DrawEmployeeGaps_GroupProfile()
{
	var pObj = new CareerManagementWindowObject(Window8,"main", "EmployeeGaps_GroupProfile", 402,275,395,250, false, getSeaPhrase("CM_195","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.AddCloseIcon = true;
	pObj.WindowColor = WindowColor
	pObj.CloseIconLocationLeft = pObj.Left + 365
	pObj.CloseIconLocationTop = pObj.Top + 5
	pObj.Draw();
	pObj.DrawView(416,310,368,203);
}

function sortByDescription(obj1, obj2)
{
	var name1 = obj1.Description;
	var name2 = obj2.Description;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function sortByQualificationDescription(obj1, obj2)
{
	var name1 = obj1.Qualification.Description;
	var name2 = obj2.Qualification.Description;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function SortDetail_GroupProfile()
{
	var competencyCounter = -1;
	var certificationCounter = -1;
	var educationCounter = -1;
	var employeeCounter = 0;
	for (var i=GroupProfile.Detail.length-1; i>=0; i--)
	{
		if (GroupProfile.Detail[i].Sort == null || GroupProfile.Detail[i].Sort == 0)
			continue;
		// Competency record
		if (Math.floor(GroupProfile.Detail[i].Sort/100) == 1)
		{
			if (GroupProfile.Detail[i].Employee == null || GroupProfile.Detail[i].Employee == 0)
			{
				employeeCounter = 0
				GroupProfile.CompetencyDetail[++competencyCounter] = new GroupProfileRecordObject()
				GroupProfile.CompetencyDetail[competencyCounter].Qualification = GroupProfile.Detail[i]
			}
			else if (competencyCounter != -1)
				GroupProfile.CompetencyDetail[competencyCounter].Employees[employeeCounter++] = GroupProfile.Detail[i]
		}
		// Certification record
		else if (Math.floor(GroupProfile.Detail[i].Sort/100) == 2)
		{
			if (GroupProfile.Detail[i].Employee == null || GroupProfile.Detail[i].Employee == 0)
			{
				employeeCounter = 0
				GroupProfile.CertificationDetail[++certificationCounter] = new GroupProfileRecordObject()
				GroupProfile.CertificationDetail[certificationCounter].Qualification = GroupProfile.Detail[i]
			}
			else if (certificationCounter != -1)
				GroupProfile.CertificationDetail[certificationCounter].Employees[employeeCounter++] = GroupProfile.Detail[i]
		}
		// Education record
		else if (Math.floor(GroupProfile.Detail[i].Sort/100) == 3)
		{
			if (GroupProfile.Detail[i].Employee == null || GroupProfile.Detail[i].Employee == 0)
			{
				employeeCounter = 0
				GroupProfile.EducationDetail[++educationCounter] = new GroupProfileRecordObject()
				GroupProfile.EducationDetail[educationCounter].Qualification = GroupProfile.Detail[i]
			}
			else if (educationCounter != -1)
				GroupProfile.EducationDetail[educationCounter].Employees[employeeCounter++] = GroupProfile.Detail[i]
		}
	}
	GroupProfile.CompetencyDetail.sort(sortByQualificationDescription);
	GroupProfile.CertificationDetail.sort(sortByQualificationDescription);
	GroupProfile.EducationDetail.sort(sortByQualificationDescription);
}

function DrawEmployeesWithGaps(QualificationList, Index)
{
	var EmpLabels = new Array();
	var JobValues = new Array();
	var EmpValues = new Array();
	var Tmp = new Array();
	var ReqDetail = false;
	var EmpRec = new GroupProfileDetailObject();
	// Sort the employee detail records for this qualification gap in alpha order
	// by employee name.	
	QualificationList[Index].Employees.sort(sortByDescription);
	// Prepare the lists of chart proficiency values and labels.
	for (var j=QualificationList[Index].Employees.length-1; j>=0; j--)
	{
		Tmp = new Array();
		EmpRec = QualificationList[Index].Employees[j];
		var ReqDetail = (EmpRec.Description.charAt(0) == "*") ? true : false;
		Tmp[0] = EmpRec.Description.split(",")[1]+" "+EmpRec.Description.split(",")[0];
		Tmp[0] = Tmp[0].split("*").join("");
		Tmp[0] = Tmp[0].split("  ").join(" ");
		if (ReqDetail) Tmp[0] = "* " + Tmp[0];
		EmpLabels = Tmp.concat(EmpLabels);
		Tmp[0] = (EmpRec.JobPGrph != null && EmpRec.JobPGrph != "") ? setValue(EmpRec.JobPGrph)/10 : 0;
		JobValues = Tmp.concat(JobValues);
		Tmp[0] = (EmpRec.EmployeeProficiency != null && EmpRec.EmployeeProficiency != "") ? setValue(EmpRec.EmployeeProficiency)/10 : 0;
		EmpValues = Tmp.concat(EmpValues);
	}
	ShowSelectCriteria_GroupProfile(false);
	var EmployeeGapsDesc = '<span class="layertitleCM">'+ StripTitle(getSeaPhrase("CM_196","CM")
	+ " - " + QualificationList[Index].Qualification.Description, 60)+ '</span>';
	ChangeTitle("main", "EmployeeGaps_GroupProfile", EmployeeGapsDesc);
	_JCHARTINDEX = Index;
	if (JobValues.length)
		Desc = BuildApplet(EmpLabels,JobValues,EmpValues,350,200,GroupProfile.SumMinProf,GroupProfile.SumMaxProf,-1);
	else
		Desc = '<br/><br/><br/><span class="contenttextCM">'+getSeaPhrase("CM_197","CM")+'</span>';
	ReplaceWindowContent("main","EmployeeGaps_GroupProfileWindow",Desc);
	ShowCourses_GroupProfile(false);
	ShowEmployeeGaps_GroupProfile(true);
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
}

function RepaintCourses_GroupProfile(Index)
{
	if (typeof(Index) == "undefined" || Index == null || isNaN(parseFloat(Index)))
		TrainingCourses = ParseOutTrainingCourses(TrainingCourses);
	if (TrainingCourses.length)
	{
		var arg = '<table border="0" cellpadding="0" cellspacing="0" role="presentation">'
		for (var i=0; i<TrainingCourses.length; i++)
		{
			var toolTip = TrainingCourses[i].Course.courseDescription+' - '+getSeaPhrase("CM_399","CM");
			arg += '<tr><td'
			if (typeof(Index) != "undefined" && Index != null && Index == i)  
				arg += ' class="tablerowhighlightCM"'
			arg += '><a class="contenttextCM" href="javascript:;" onClick="parent.RepaintCourses_GroupProfile('+i+');parent.ShowGroupProfileSessions('+i+');return false;"'
			arg += ' title="'+toolTip+'">'+TrainingCourses[i].Course.courseDescription+'<span class="offscreen"> - '+getSeaPhrase("CM_399","CM")+'</span></a></td></tr>'
		}
		arg += '</table>'
		ReplaceWindowContent("main", "Courses_GroupProfileWindow", arg);
	}
	else
	{
		var arg = '<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td class="contenttextCM">'+getSeaPhrase("CM_198","CM")+'</td></tr></table>'
		ReplaceWindowContent("main", "Courses_GroupProfileWindow", arg);
	}
}

function ShowGroupProfileSessions(Index)
{
	ShowProfile_GroupProfile(false);
	ShowSessionsPreReq(Index, "GroupProfile");
}

function SubmitApplication_GroupProfile_OnClick()
{
	SubmitApplication_OnClick("GroupProfile");
}

function ShowProfile_GroupProfile(nCmd)
{
	ShowWin(nCmd, "main", "GroupProfile", true, true, true);
}

function OnTabClicked_CourseDetail_GroupProfile(TabSelected)
{
	OnTabClicked_CourseDetail(TabSelected, "GroupProfile");
}

function CourseDetail_GroupProfile_XIconClicked()
{
	ShowCourseDetail(false, "GroupProfile");
	ShowSubmitApplication(false, "GroupProfile");
	ShowProfile_GroupProfile(true);
}

function Courses_GroupProfile_XIconClicked()
{
	ShowCourses_GroupProfile(false);
	CourseDetail_GroupProfile_XIconClicked();
}

function EmployeeGaps_GroupProfile_XIconClicked()
{
	ShowCourses_GroupProfile(false);
	ShowEmployeeGaps_GroupProfile(false);
	CourseDetail_GroupProfile_XIconClicked();
	ShowSelectCriteria_GroupProfile(true);
}

function ShowSelectCriteria_GroupProfile(nCmd)
{
	ShowWin(nCmd, "main", "SelectCriteria_GroupProfile", true, true, false);
	if (nCmd)
		showLayer("main", "SelectCriteriaHeader_GroupProfile");
	else 
		hideLayer("main", "SelectCriteriaHeader_GroupProfile");
	if (nCmd)
		showLayer("main", "SelectCriteriaJobHeader_GroupProfile");
	else 
		hideLayer("main", "SelectCriteriaJobHeader_GroupProfile");
	ShowCmbJobCodesSelect_GroupProfile(nCmd);
}

function ShowCourses_GroupProfile(nCmd)
{
	ShowWin(nCmd, "main", "Courses_GroupProfile", true, true, false);
}

function ShowEmployeeGaps_GroupProfile(nCmd)
{
	ShowWin(nCmd, "main", "EmployeeGaps_GroupProfile", true, true, false);
}

function cmbJobCodesFilterSelectArrow_OnClick()
{
	openDmeFieldFilter("job_group_profile");
}

function ShowCmbJobCodesSelect_GroupProfile(nCmd)
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
		ShowSelect(nCmd, "main", "cmbJobCodes");
}

var JobCode
var GroupProfile;
var _GROUPPROFILETAB = 0;
var _MAX_EMPS_FOR_GAP = 10;

function DrawGroupProfile()
{
	DrawGroupProfileTabs(false, 0, getSeaPhrase("CM_359","CM"), false, "GroupProfile");
	DrawCourseDetailTabs(false, 0, false, "GroupProfile", true);
	DrawInstructions_GroupProfile();
	DrawSelectCriteria_GroupProfile();
	DrawCourseDetail("GroupProfile");
	DrawCourses_GroupProfile();
	DrawEmployeeGaps_GroupProfile();
	var Desc = '<form name="pDirectReports"><table cellpadding="0" cellspacing="0" border="0" role="presentation">'
	for (var i=0; i<DirectReports.length; i++)
	{
		Desc += '<tr><td width="25">'
		+ '<input type="checkbox" value="off" id="directreports'+i+'" name="directreports'+i+'" onclick="parent.DirectReportsClicked('+i+');return true;">'
		+ '</td><td width="325"><label class="contenttextCM" for="directreports'+i+'"><span class="offscreen">'+getSeaPhrase("CM_408","CM")+' </span>'+DirectReports[i].description+'</label></td></tr>'
	}
	Desc += '</table></form>'
	ReplaceWindowContent("main", "SelectCriteria_GroupProfileWindow", Desc);
	if (emssObjInstance.emssObj.filterSelect)
		FinishedDrawingTabs();
	else
		GetJobCodesForGroupProfile();
}

function GetJobCodesForGroupProfile()
{
	if(typeof(JobCode) == "undefined")
	{
		JobCode = new Array(0);
		var obj = new DMEObject(authUser.prodline, "JOBCODE");
		obj.out = "JAVASCRIPT";
		obj.index = "jbcset1";
		obj.cond = "active";
		obj.field = "job-code;description";
		obj.key = authUser.company+"";
		obj.max	= "600";
		obj.sortasc = "description";
		obj.func = "PaintJobCode_GroupProfile()";
		obj.debug = false;
		DME(obj,"jsreturn");
	}
	else
		RenderJobCodes();
}

function PaintJobCode_GroupProfile()
{
	for (var i=0; i<self.jsreturn.record.length;i++)
		JobCode[JobCode.length] = new CodeDescObject(self.jsreturn.record[i].job_code, self.jsreturn.record[i].description);
	RenderJobCodes();
}

function RenderJobCodes()
{
	var SelectedIndex = -1;
	var SelectValues = JobCode;
	var Desc = '<form name="Jobs"><select class="contenttextCM" id="cmbJobCodes" name="cmbJobCodes"><option value=" " '
	Desc += (SelectedIndex == -1)?'selected':''
	Desc += '>&nbsp;'
	var SelectDesc = new Array()
	for (var i=0; i<SelectValues.length; i++)
	{
		SelectDesc[i] = '<option value="'+SelectValues[i].code+'"'
		SelectDesc[i] += (SelectedIndex == i)?' selected':''
		SelectDesc[i] += '>'+SelectValues[i].description
	}
	Desc += SelectDesc.join("") + '</select></form>'
	replaceContent("main", "cmbJobCodesSelect", Desc);
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		FinishedDrawingTabs()
}

function DirectReportsClicked(Index)
{
	var pObj = GetFormObject("main", "pAllForm", "SelectCriteriaHeader_GroupProfile")
	pObj.alldirectreports.checked = false;
	styleElement(pObj.alldirectreports);
	var nbrChecked = 0
	var pObj = GetFormFromStansWindowLayer("main", "SelectCriteria_GroupProfileWindow", "pDirectReports");
	for(var i=0; i<DirectReports.length; i++)
	{
		var report = eval('pObj.directreports'+i);
		if (report.checked) nbrChecked++;
		if (nbrChecked > _MAX_EMPS_FOR_GAP)
		{
			var checkBox = eval('pObj.directreports'+Index);
			checkBox.checked = false;
			styleElement(checkBox);
			break;
		}
	}
}

function AllDirectReportsClicked()
{
	var pObj = GetFormFromStansWindowLayer("main", "SelectCriteria_GroupProfileWindow", "pDirectReports");
	var checkBox;
	for (var i=0; i<DirectReports.length; i++)
	{
		checkBox = eval('pObj.directreports'+i);
		if (checkBox.checked)
		{
			checkBox.checked = false;
			styleElement(checkBox);
		}
	}
}

function EmployeeJobClicked()
{
	var pObj = GetFormObject("main", "pJobForm", "SelectCriteriaJobHeader_GroupProfile");
	var checkBox = pObj.selectjobtitle;
	if (checkBox.checked)
	{
		checkBox.checked = false;
		styleElement(checkBox);
	}	
}


function SelectingJobTitleClicked()
{
	var pObj = GetFormObject("main", "pJobForm", "SelectCriteriaJobHeader_GroupProfile");
	var checkBox = pObj.employeejob;
	if (checkBox.checked)
	{
		checkBox.checked = false;
		styleElement(checkBox);
	}
}

function StartOver_MyJobProfile_OnClick()
{
	var nextFunc = function()
	{
		var pObj = GetFormObject("main", "pJobForm", "SelectCriteriaJobHeader_GroupProfile")
		var checkBox = pObj.employeejob;
		if (!checkBox.checked)
		{
			checkBox.checked = true;
			styleElement(checkBox);
		}
		checkBox = pObj.selectjobtitle;
		if (checkBox.checked)
		{
			checkBox.checked = false;
			styleElement(checkBox);	
		}
		pObj = GetFormObject("main", "pAllForm", "SelectCriteriaHeader_GroupProfile")
		checkBox = pObj.alldirectreports;
		if (!checkBox.checked)
		{
			checkBox.checked = true;
			styleElement(checkBox);
		}
		AllDirectReportsClicked();
		ShowProfile_GroupProfile(false);
		ShowWin(true, "main", "Instructions_GroupProfile", true, true);	
		showLayer("main", "InstructionsHeader_GroupProfile");
		removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
	};
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

function CreateProfile_MyJobProfile_OnClick()
{
	var ReportFlag = VerifyReportsFormObjects();
	var JobFlag = VerifyJobFormObjects();
	var company, employees, program, manager, redirect;
	if (ReportFlag && JobFlag)
	{
		var pReportsObj = GetFormFromStansWindowLayer("main", "SelectCriteria_GroupProfileWindow", "pDirectReports");
		var pAllFormObj = GetFormObject("main", "pAllForm", "SelectCriteriaHeader_GroupProfile");
		var pJobFormObj = GetFormObject("main", "pJobForm", "SelectCriteriaJobHeader_GroupProfile");
		var pSelObj;		
		var pFormObj;
		var pFormObjValue = "";
		if (emssObjInstance.emssObj.filterSelect)
		{
			pFormObj = GetTextBoxFormObject("main", "cmbJobCodesFilterSelect", "cmbJobCodesFilterSelect_GroupProfile");
			pFormObjValue = pFormObj.value;		
		}
		else
			pSelObj = GetSelectFormObject("main", "Jobs", "cmbJobCodes");
		company = authUser.company;
		employees = new Array(0);
		program = "HS52.1";
		manager = 0;
		redirect = "GROUPPROFILE";
		if (pAllFormObj.alldirectreports.checked)
		{
			manager = (DirectReports.length <= 10) ? authUser.employee : 0;
			for (var i=0; i<DirectReports.length; i++)
				employees[i] = DirectReports[i].code;
		}
		else
		{
			for (var i=0; i<DirectReports.length; i++)
			{
				if (eval('pReportsObj.directreports'+i).checked)
					employees[employees.length] = DirectReports[i].code;
			}
     	}
		if (!pJobFormObj.employeejob.checked && ((!emssObjInstance.emssObj.filterSelect && pSelObj.selectedIndex == 0)
		|| (emssObjInstance.emssObj.filterSelect && NonSpace(pFormObjValue) == 0)))
		{
			seaAlert(getSeaPhrase("CM_355","CM"), null, null, "error");
			return;
		}
		if (pJobFormObj.employeejob.checked)
     		jobcode = " ";
     	else
     	{
     		if (emssObjInstance.emssObj.filterSelect)
     			jobcode = pFormObjValue;
     		else
     			jobcode = pSelObj.options[pSelObj.selectedIndex].value;
		}
		hideLayer("main", "InstructionsHeader_GroupProfile");
		showWaitAlert(getSeaPhrase("CM_155","CM"), function(){Call_HS52(company,employees,program,manager,redirect,jobcode);});
	}
	else
	{
		if (!ReportFlag && !JobFlag)
			seaAlert(getSeaPhrase("CM_360","CM"), null, null, "error");
		else if (!ReportFlag)
			seaAlert(getSeaPhrase("CM_361","CM"), null, null, "error");
		else if (!JobFlag)
			seaAlert(getSeaPhrase("CM_362","CM"), null, null, "error");	
	}
}

function Do_HS52_1_Call_GROUPPROFILE_Finished()
{
	SortDetail_GroupProfile();
	if (GroupProfile.JobCompFlag == "N" && GroupProfile.GapsExists == "N")
		seaPageMessage(getSeaPhrase("CM_363","CM"), null, null, "info", null, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
	else if (GroupProfile.GapsExists == "N")
		seaPageMessage(getSeaPhrase("CM_364","CM"), null, null, "info", null, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
	else if (GroupProfile.EmployeeCount > 10)
		seaPageMessage(getSeaPhrase("CM_365","CM"), null, null, "info", null, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
    // PT146296. Hide instructions window or it will hide the group profile.
	ShowWin(false, "main", "Instructions_GroupProfile", true, true);
	ShowProfile_GroupProfile(true);
	OnTabClicked_GroupProfile("Competencies");
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
}

function DrawGroupGaps(SortValue)
{
	var JobLabels = new Array(0);
	var JobValues = new Array(0);
	var EmployeeValues = new Array(0);
	var QualificationList = new Array(0);
	if (Math.floor(SortValue/100) == 1)
		QualificationList = GroupProfile.CompetencyDetail;
	else if (Math.floor(SortValue/100) == 2)
		QualificationList = GroupProfile.CertificationDetail;
	else if (Math.floor(SortValue/100) == 3)
		QualificationList = GroupProfile.EducationDetail;
	for (var i=0; i<QualificationList.length; i++)
	{
		var thisQual = QualificationList[i].Qualification;
		JobLabels[i] = thisQual.Description.replace(/\,/g," ");
		JobValues[i] = (thisQual.JobPGrph != null && thisQual.JobPGrph != "") ? setValue(thisQual.JobPGrph)/10 : 0;
		EmployeeValues[i] = (thisQual.EmployeeProficiency != null && thisQual.EmployeeProficiency != "") ? setValue(thisQual.EmployeeProficiency)/10 : 0;
	}
	if ((JobValues.length == 0 && EmployeeValues.length == 0) || (NonSpace(JobValues.join("")) == 0 && NonSpace(EmployeeValues.join("")) == 0))
		Desc = '<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td class="contenttextCM">'+getSeaPhrase("CM_366","CM")+'</td></tr></table>';
	else
	{
		_JCHARTTAB = Math.floor(SortValue/100)-1;
		Desc = BuildApplet(JobLabels,JobValues,EmployeeValues,335,300,GroupProfile.SumMinProf,GroupProfile.SumMaxProf,(Math.floor(SortValue/100)-1));
	}
	ReplaceWindowContent("main", "GroupProfileWindow", Desc);
	// This is needed for the chart applet to display in Firefox on Mac OS for UI theme 9.
	var chartApplet = self.main.document.getElementById("cmChartApplet");	
	if (chartApplet)
	{	
		chartApplet.style.position = "relative";
		chartApplet.style.top = "0px";
		chartApplet.style.left = "0px";
	}	
}

function VerifyReportsFormObjects()
{
	var pReportsObj = GetFormFromStansWindowLayer("main", "SelectCriteria_GroupProfileWindow", "pDirectReports");
	var pAllFormObj = GetFormObject("main", "pAllForm", "SelectCriteriaHeader_GroupProfile");
	if (!pAllFormObj.alldirectreports.checked)
	{
		for (var i=0; i<DirectReports.length; i++)
		{
			if (eval('pReportsObj.directreports'+i).checked)
				return true;
		}
		return false;
	}
	return true;
}

function VerifyJobFormObjects()
{
	var pJobFormObj = GetFormObject("main", "pJobForm", "SelectCriteriaJobHeader_GroupProfile");
	var pAllFormObj = GetFormObject("main", "pAllForm", "SelectCriteriaHeader_GroupProfile");
	if (pJobFormObj.selectjobtitle.checked || pJobFormObj.employeejob.checked)
		return true;
	return false;
}

function DrawInstructions_GroupProfile()
{
	var pObj = new CareerManagementWindowObject(Window2,"main", "Instructions_GroupProfile", 2,22,395,505, true, getSeaPhrase("CM_114","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.Draw();
	var Desc = '<div class="contenttextCM">'
	+ getSeaPhrase("CM_367","CM")
	+ '<ul><li>'+getSeaPhrase("CM_368","CM")+'</li>'
	+ '<li>'+getSeaPhrase("CM_369","CM")+'</li>'
	+ '<li>'+getSeaPhrase("CM_370","CM")+'</li></ul>'
	+ '<p>'+getSeaPhrase("CM_371","CM")
	+ '</div>';
	createLayer("main","InstructionsHeader_GroupProfile",25,100,375,200,true,Desc,"","");
}

function DrawSelectCriteria_GroupProfile()
{
	var Temp = new Array(0);
	var pObj = new CareerManagementWindowObject(Window2,"main", "SelectCriteria_GroupProfile", 402,22,395,505, true, getSeaPhrase("CM_372","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor;
	pObj.Draw();
	pObj.DrawView(420, 120, 350, 250);
	var Desc = '<form name="pAllForm"><span class="contenttextheaderCM" role="heading" aria-level="3">'+getSeaPhrase("CM_373","CM")+'</span>'
	+ '<table width="350" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr><td width="25">'
	+ '<input type="checkbox" value="on" id="alldirectreports" name="alldirectreports" onclick="parent.AllDirectReportsClicked();return true;" checked>'
	+ '</td><td width="325"><label class="contenttextCM" for="alldirectreports">'+getSeaPhrase("CM_374","CM")+'<span class="offscreen">&nbsp;'+getSeaPhrase("CM_375","CM")+'</span></label></td></tr>'
	+ '<tr><td width="25">&nbsp;</td><td><span class="contenttextCM">'+getSeaPhrase("CM_375","CM")+'</span></td></tr></table></form>'
	createLayer("main","SelectCriteriaHeader_GroupProfile",420,53,390,70,true,Desc,"","");
	Desc = '<form name="pJobForm"><span class="contenttextheaderCM" role="heading" aria-level="3">'+getSeaPhrase("CM_376","CM")+'</span>'
	+ '<table width="350" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr><td width="25">'
	+ '<input type="checkbox" value="on" id="employeejob" name="employeejob" onclick="parent.EmployeeJobClicked();return true;" checked>'
	+ '</td><td width="325"><label class="contenttextCM" for="employeejob">'+getSeaPhrase("CM_377","CM")+'<span class="offscreen">&nbsp;'+getSeaPhrase("CM_378","CM")+'</span></label></td></tr>'
	+ '<tr><td>&nbsp</td><td><span class="contenttextCM">'+getSeaPhrase("CM_378","CM")+'</span></td></tr>'
	+ '<tr><td width="25" style="padding-top:15px"><input type="checkbox" value="off" id="selectjobtitle" name="selectjobtitle" onclick="parent.SelectingJobTitleClicked();return true;">'
	+ '<label class="offscreen" for="selectjobtitle">'+getSeaPhrase("CM_19","CM")+'</label></td><td width="325">&nbsp;</td></tr>'
	+ '<tr><td colspan="2" style="padding-top:5px;white-space:nowrap">'
	+ uiButton(getSeaPhrase("CM_117","CM"),"parent.CreateProfile_MyJobProfile_OnClick();return false;","margin-top:10px")
	+ uiButton(getSeaPhrase("CM_379","CM"),"parent.StartOver_MyJobProfile_OnClick();return false;","margin-top:10px;margin-left:5px")
	+ '</td></tr></table></form>'
	createLayer("main","SelectCriteriaJobHeader_GroupProfile",420,375,390,130,true,Desc,"","");
	var toolTip;
	if (emssObjInstance.emssObj.filterSelect)
	{
		toolTip = dmeFieldToolTip("job_group_profile");
		MakeTextBox("cmbJobCodesFilterSelect", 445, 440, 105, 25, "cmbJobCodesFilterSelect_GroupProfile", true, 30, "", 'styler="select" styler_click="parent.cmbJobCodesFilterSelectArrow_OnClick"', getSeaPhrase("CM_23","CM"));
		MakeButton('<img style="cursor:hand;cursor:pointer" border="0" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" alt="'+toolTip+'" title="'+toolTip+'">', 535, 440, 12, 16,
			WindowColor, "cmbJobCodesFilterSelectArrow", isVisible, getSeaPhrase("CM_185","CM"), true, 'styler="hidden"');	
		var buttonObj = getLayerDocument("main", "cmbJobCodesFilterSelectArrowButton");	
		if (buttonObj != null)
			buttonObj.setAttribute("styler", "hidden");		
		Desc = '<span id="cmbJobCodesFilterSelectDesc" class="contenttextdisplayCM"></span>'
		createLayer("main","cmbJobCodesFilterSelectDesc_GroupProfile",557,440,190,30,isVisible,Desc,"","");
		try 
		{
			var pFormObj = GetTextBoxFormObject("main", "cmbJobCodesFilterSelect", "cmbJobCodesFilterSelect_GroupProfile");
			pFormObj.onkeyup = cmbJobCodes_OnKeyUp;
		} 
		catch(e) {}	
	}
	else
		MakeSelectBox("Jobs", 440, 432, 275, 30, "cmbJobCodes", Temp, true, 0, false, getSeaPhrase("CM_23","CM"));
}

function cmbJobCodes_OnKeyUp()
{
	this.value = "";
	var descHtml = '<span id="cmbJobCodesFilterSelectDesc" class="contenttextdisplayCM"></span>';			
	replaceContent("main", "cmbJobCodesFilterSelectDesc_GroupProfile", descHtml);
}

function DrawGroupProfileTabs(ReplaceFlag, TabSelected, Title, IsVisible, WindowName)
{
	var TabsArray = new Array(
		new TabPane("Competencies", getSeaPhrase("CM_69","CM"), 130),
		new TabPane("Certifications", getSeaPhrase("CM_70","CM"), 130),
		new TabPane("Education", getSeaPhrase("CM_49","CM"), 130)
	);
	var Tab = new TabObject(TabsArray, TabSelected, WindowName);
	Tab.Style(InnerTabBorderColor, InnerTabbgColorTabDown, InnerTabbgColorTabUp, InnerTabfgColorTabDown, InnerTabfgColorTabUp, InnerTabfontSize, InnerTabfontFamily, InnerTabfontWeight);
	var pObj = new CareerManagementWindowObject(Window2,"main", WindowName, 2,22,395,490, IsVisible, Title, false);
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.AddCloseIcon = true;
	pObj.CloseIconLocationLeft = pObj.Left + 365
	pObj.CloseIconLocationTop = pObj.Top + 5
	pObj.TabObject = Tab;
	pObj.ReplaceFlag = ReplaceFlag;
	pObj.DrawTabbed();
	if (!pObj.ReplaceFlag) pObj.DrawView(25,100,360,355);
}

function OnTabClicked_GroupProfile(TabName)
{
	ShowCourses_GroupProfile(false);
	ShowEmployeeGaps_GroupProfile(false);
    // PT 146296. Redisplay the initial selection screen if a tab is clicked on the Group Profile.
	ShowSelectCriteria_GroupProfile(true);
	switch (TabName)
	{
		case "Competencies": GROUPPROFILETAB = 0;
			DrawGroupProfileTabs(true, 0, getSeaPhrase("CM_359","CM"), true, "GroupProfile");
			DrawGroupGaps(100);
			break;
		case "Certifications": GROUPPROFILETAB = 1;
			DrawGroupProfileTabs(true, 1, getSeaPhrase("CM_359","CM"), true, "GroupProfile");
			DrawGroupGaps(200);
			break;
		case "Education": GROUPPROFILETAB = 2;
			DrawGroupProfileTabs(true, 2, getSeaPhrase("CM_359","CM"), true, "GroupProfile");
			DrawGroupGaps(300);
			break;
	}
	TabsLoaded();
}

function GroupProfile_XIconClicked()
{
	ShowProfile_GroupProfile(false);
	ShowCourses_GroupProfile(false);
    ShowEmployeeGaps_GroupProfile(false);
	ShowSelectCriteria_GroupProfile(true);
	ShowWin(true, "main", "Instructions_GroupProfile", true, true);
	showLayer("main", "InstructionsHeader_GroupProfile");
}

/*
 *	Action Plan Tab
 */
var Reviews;
var Attachment;
var LastUpdated;
var TimeUpdated;

function DrawEmployeeActionPlan()
{
	DrawActionPlan_EmployeeActionPlan()
	DrawEmployeeActionPlanWithCloseIcon_MyActionPlan()
	DrawReviews_EmployeeActionPlan()
	DrawTrainingHistory_EmployeeActionPlan()
	DrawTrainingRegistration_EmployeeActionPlan()
	if (typeof(DirectReports) == "undefined" || DirectReports == null || !DirectReports.length)
	{
		DetailLine = 0;
		DirectReports = new Array(0);
		Call_HS10(authUser.company, authUser.employee, "EmployeeActionPlan");
	}
	else
		Do_HS10_1_Call_EmployeeActionPlan_Finished();
}

function Do_HS10_1_Call_EmployeeActionPlan_Finished()
{
	if (!ReportsExist()) 
	{
		removeWaitAlert();
		return;
	}
	DrawInstructions_EmployeeActionPlan(DirectReports);	
	DrawAdditionalDetail_EmployeeActionPlan();
	if (_DIRECTREPORTSINDEX >= 0)
		EmployeeAttachmentCollected();
	FinishedDrawingTabs();
}

function DrawEmployeeActionPlanWithCloseIcon_MyActionPlan()
{
	var pObj = new CareerManagementWindowObject(Window1,"main", "ActionPlanWithCloseIcon_EmployeeActionPlan", 2, 23, 496, 484, false, getSeaPhrase("CM_89","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.AddCloseIcon = true;
	pObj.CloseIconLocationLeft = pObj.Left + 468
	pObj.CloseIconLocationTop = pObj.Top + 5
	pObj.Draw();
	var docLoc = getDocLoc("main")
	var width = 80;
	var textwidth = 35;
	var Desc = '<form name="frmAttachmentsForm"><label class="contentlabelCM" for="attachmentname">'+getSeaPhrase("CM_102","CM")+'</label>'
	+ '&nbsp;&nbsp;&nbsp;<input class="contenttextCM" id="attachmentname" name="attachmentname" type="text" size="'+textwidth+'">'
	+ '<p/><label class="contentlabelCM" for="comments">'+getSeaPhrase("CM_111","CM")+'</label><br/>'
	+ '<textarea class="contenttextCM" style="width:420px;height:285px" wrap="wrap" id="comments" name="comments"></textarea>'
	+ '</form>'
	+ '<div style="white-space:nowrap">'
	+ uiButton(getSeaPhrase("CM_95","CM"),"parent.Update_EmployeeActionPlan_OnClick();return false;")
	+ uiButton(getSeaPhrase("CM_94","CM"),"parent.Cancel_EmployeeActionPlan_OnClick();return false;","margin-left:5px")
	+ uiButton(getSeaPhrase("CM_91","CM"),"parent.DeleteActionPlan_EmployeeActionPlan_OnClick();return false;","margin-left:15px","Delete_EmployeeActionPlanWithClose")
	+ '</div>'
	createLayer("main","ActionPlanHeader2_EmployeeActionPlan",20,60,450,470,false,Desc,"","");
}

var empCommentsExist = false;

function RefreshAttachment_Manager()
{
	if (_DIRECTREPORTSINDEX >= 0)
	{
		ShowActionPlan_EmployeeActionPlan(true);
		ShowAdditionalDetail_EmployeeActionPlan(true);
  	}
  	else 
  	{
  		ShowActionPlan_EmployeeActionPlan(false);
		ShowAdditionalDetail_EmployeeActionPlan(false);
  	}
	Attachment = self.jsreturn;
	var date = StandardCareerProfile.NextReviewDate;
	var Desc = '';
	if (Attachment && Attachment.CmtRec && Attachment.CmtRec.length)
	{
		Desc = '<div class="contenttextCM" style="width:100%;height:80%;overflow:auto" tabindex="0">'
		Desc += ThrowOutCarriageReturns(Attachment.CommentData[0].join(""))+'</div>'
		Desc += '<div style="white-space:nowrap">' 
		+ uiButton(getSeaPhrase("CM_92","CM"),"parent.ChangeActionPlan_EmployeeActionPlan_OnClick();return false;")
		+ uiButton(getSeaPhrase("CM_90","CM"),"parent.PrintActionPlan_EmployeeActionPlan_OnClick();return false;","margin-left:5px")
		+ uiButton(getSeaPhrase("CM_91","CM"),"parent.DeleteActionPlan_EmployeeActionPlan_OnClick();return false;","margin-left:15px","Delete_EmployeeActionPlan")
		+ '</div>'
		LastUpdated = FormatDte6(self.jsreturn.CmtAttrib[0].ModifyDate);
		TimeUpdate = TimeRoutines("American", self.jsreturn.CmtAttrib[0].ModifyTime);
	}
	else
	{
		var Desc = '<table style="width:400px" border="0" cellpadding="0" cellspacing="0" role="presentation">'
		+ '<tr><td><div class="contenttextCM">'+getSeaPhrase("CM_328","CM")+'<p/>'+getSeaPhrase("CM_112","CM")+'</div>'
		+ '</td></tr><tr><td style="white-space:nowrap">'
		+ uiButton(getSeaPhrase("CM_93","CM"),"parent.CreatePlan_EmployeeActionPlan_OnClick();return false;")
		+ '</td></tr></table>'	
	}
	if (self.jsreturn.CmtRec && self.jsreturn.CmtRec.length)
		empCommentsExist = true;
	else 
		empCommentsExist = false;
	ReplaceWindowContent("main", "ActionPlan_EmployeeActionPlanWindow", unescape(unescape(Desc)))
	var pObj = GetFormObject("main", "frmAttachmentsForm", "ActionPlanHeader2_EmployeeActionPlan");
	pObj.attachmentname.value = "";
	pObj.comments.value = "";
	// Refresh the update form with the attachment data.
	Desc = '';
	if (Attachment && Attachment.CmtRec && Attachment.CmtRec.length)
	{	
		Desc += unescape(Attachment.CommentData[0].join(""));
		var Title = unescape(Attachment.CmtRec[0].Title);
		pObj.attachmentname.value = Title.split('+').join(' ');
		pObj.comments.value = unescape(Desc);		
		displayButtonCM("Delete_EmployeeActionPlanWithClose", "inline-block");
	} 
	else
		displayButtonCM("Delete_EmployeeActionPlanWithClose", "none");
	Desc = '<table style="width:500px" cellpadding="0" border="0" cellspacing="0" summary="'+getSeaPhrase("TSUM_1","CM")+'">'
	+ '<caption class="offscreen">'+getSeaPhrase("TCAP_1","CM")+'</caption>'
	+ '<tr><th scope="col" colspan="2"></th></tr>'	
	+ '<tr><th scope="row" class="contenttextCM"><span class="contentlabelCM">'+getSeaPhrase("CM_108","CM")+'</span></th>'
	if (date==null || NonSpace(date)==0)
		Desc += '<td class="contenttextCM">'+getSeaPhrase("CM_109","CM")+'</td></tr>'
	else
		Desc += '<td class="contenttextCM">'+FormatDte6(date)+'</td></tr>'
	if (Attachment && Attachment.CmtRec && Attachment.CmtRec.length)
	{
		Desc += '<tr><th scope="row" class="contenttextCM"><span class="contentlabelCM">'+getSeaPhrase("CM_110","CM")+'</span></th><td class="contenttextCM">'+LastUpdated+'<br/>'+TimeUpdate+'</td></tr>'
		+ '<tr><th scope="row" class="contenttextCM"><span class="contentlabelCM">'+getSeaPhrase("CM_111","CM")+'</span></th><td class="contenttextCM">'
		+ unescape(unescape(Attachment.CmtRec[0].Title)).split('+').join(' ')
		+ '</td></tr>'
	}
	Desc += '</table>'
	replaceContent("main", "ActionPlanHeader_EmployeeActionPlan", Desc);
	var htmstr = '<span class="layertitleCM">'+getSeaPhrase("CM_329","CM")
	if (_DIRECTREPORTSINDEX >= 0) htmstr += " - "+DirectReports[_DIRECTREPORTSINDEX].description;  
	htmstr += "</span>";
	ChangeTitle("main", "ActionPlan_EmployeeActionPlan",htmstr);
	RefreshNextReviewDate_EmployeeActionPlan(StandardCareerProfile.NextReviewDate);
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
}

function RefreshNextReviewDate_EmployeeActionPlan(date)
{
	var Desc = '<table style="width:500px" cellpadding="0" border="0" cellspacing="0" summary="'+getSeaPhrase("TSUM_1","CM")+'">'
	+ '<caption class="offscreen">'+getSeaPhrase("TCAP_1","CM")+'</caption>'
	+ '<tr><th scope="col" colspan="2"></th></tr>'
	+ '<tr><th scope="row" class="contenttextCM"><span class="contentlabelCM">'+getSeaPhrase("CM_108","CM")+'</span></th>'
	if (date==null || NonSpace(date)==0)
		Desc += '<td class="contenttextCM">'+getSeaPhrase("CM_109","CM")+'</td></tr>'
	else
		Desc += '<td class="contenttextCM">'+FormatDte6(date)+'</td></tr>'
	if (Attachment && Attachment.CmtRec && Attachment.CmtRec.length)
	{
		Desc += '<tr><th scope="row" class="contenttextCM"><span class="contentlabelCM">'+getSeaPhrase("CM_110","CM")+'</span></th><td class="contenttextCM">'+LastUpdated+'<br/>'+TimeUpdate+'</td></tr>'
		+ '<tr><th scope="row" class="contenttextCM"><span class="contentlabelCM">'+getSeaPhrase("CM_111","CM")+'</span></th><td class="contenttextCM">'
		+ unescape(unescape(Attachment.CmtRec[0].Title)).split('+').join(' ')
		+ '</td></tr>'
	}
	Desc += '</table>'
	replaceContent("main", "ActionPlanHeader_EmployeeActionPlan", Desc);
}

function ShowActionPlanWithCloseIcon_EmployeeActionPlan(nCmd, AttachmentExists)
{
	ShowWin(nCmd, "main", "ActionPlanWithCloseIcon_EmployeeActionPlan", false, true, false);
	ShowWin(!nCmd, "main", "ActionPlan_EmployeeActionPlan", true, false, false);
	if (nCmd)
	{
		showLayer("main", "ActionPlanHeader2_EmployeeActionPlan");
		hideLayer("main", "ActionPlanHeader_EmployeeActionPlan");
	}
	else
	{
		hideLayer("main", "ActionPlanHeader2_EmployeeActionPlan");
		showLayer("main", "ActionPlanHeader_EmployeeActionPlan");
	}
}

function EmployeeAttachmentCollected()
{	
	var code = (_DIRECTREPORTSINDEX >= 0) ? DirectReports[_DIRECTREPORTSINDEX].code : null;
	// detect cached HS50 data
	if (StandardCareerProfileHash[Number(code)])
	{
		StandardCareerProfile = StandardCareerProfileHash[Number(code)];	
		GetActionPlanAttachment("RefreshAttachment_Manager", "C", authUser.company, code, true);	
	}
	else
		Do_HS50_Call(3, 1, "Y", null, "HS50.1", "M_ACTIONPLAN", code);
}

function Do_HS50_1_Call_M_ACTIONPLAN_Finished()
{
	StandardCareerProfile = CareerProfile;
	var Index = GetSelectFormObject("main", "DirectReports", "cmbDirectReports").selectedIndex
	var code = (Index > 0) ? DirectReports[Index-1].code : null;
	// cache this HS50 object
	StandardCareerProfileHash[Number(code)] = StandardCareerProfile;
	GetActionPlanAttachment("RefreshAttachment_Manager", "C", authUser.company, code, true);
}

function Do_HS50_1_Call_M_ACTIONPLAN_NoRefresh_Finished()
{
	var Index = GetSelectFormObject("main", "DirectReports", "cmbDirectReports").selectedIndex;
	var code = (Index>0)? DirectReports[Index-1].code : null;
	GetActionPlanAttachment("RefreshAttachment_Manager", "C", authUser.company, code, true);
}

function ChangeActionPlan_EmployeeActionPlan_OnClick()
{
	var Index = GetSelectFormObject("main", "DirectReports", "cmbDirectReports").selectedIndex;
	var code = (Index>0)? DirectReports[Index-1].code : null;
	ChangeTitle("main", "ActionPlanWithCloseIcon_EmployeeActionPlan", '<span class="layertitleCM">'+getSeaPhrase("CM_329","CM")+" - "+DirectReports[_DIRECTREPORTSINDEX].description+"</span>");
	if (empCommentsExist)
		ShowActionPlanWithCloseIcon_EmployeeActionPlan(true, true);
	else
		ShowActionPlanWithCloseIcon_EmployeeActionPlan(true, false);
}

function PrintActionPlan_EmployeeActionPlan_OnClick()
{
	var Index = GetSelectFormObject("main", "DirectReports", "cmbDirectReports").selectedIndex;
	var code = (Index>0)? DirectReports[Index-1].code : null;
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), function(){GetActionPlanAttachment("PrintAttachment","C",authUser.company,code,true);});
}

function DeleteActionPlan_EmployeeActionPlan_OnClick()
{
	if (seaConfirm(getSeaPhrase("CM_394","CM"), "", handleDeleteEmployeeActionPlanResponse))
		DeleteEmployeeActionPlan();
}

// Firefox will call this function
function handleDeleteEmployeeActionPlanResponse(confirmWin)
{
	if (confirmWin.returnValue == "ok" || confirmWin.returnValue == "continue")
		DeleteEmployeeActionPlan();
}

function DeleteEmployeeActionPlan()
{
	var Index = GetSelectFormObject("main", "DirectReports", "cmbDirectReports").selectedIndex;
	var code = (Index>0)? DirectReports[Index-1].code : null;
	var pAttachObj = new WRITEATTACHObject(authUser.prodline,"EMPLOYEE");
	pAttachObj.out = "XML";
	pAttachObj.index = "EMPSET1";
	pAttachObj.key 	= "K1="+escapeEx(authUser.company)+"&K2="+escapeEx(code);
	pAttachObj.opm = "D";
	pAttachObj.rectype = Attachment.CmtRec[0].UserType;
	pAttachObj.reckey = escapeEx(Attachment.CmtRec[0].RecKey,1);
	pAttachObj.seqkey = escapeEx(Attachment.CmtRec[0].SeqKey,1);
	pAttachObj.usertype = escapeEx(Attachment.CmtRec[0].UserType,1);
	pAttachObj.debug = false;
	pAttachObj.func = "EmployeeActionPlanDeleted";
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), function(){WRITEATTACH(pAttachObj,"jsreturn");});
}

function EmployeeActionPlanDeleted()
{
	var Index = GetSelectFormObject("main", "DirectReports", "cmbDirectReports").selectedIndex;
	var code = (Index>0)? DirectReports[Index-1].code : null;
	var pObj = GetFormObject("main", "frmAttachmentsForm", "ActionPlanHeader2_EmployeeActionPlan");
	pObj.attachmentname.value = "";
	pObj.comments.value = "";
	GetActionPlanAttachment("AttachmentWritten_EmployeeActionPlan", "C", authUser.company, code, true);
}

function Cancel_EmployeeActionPlan_OnClick()
{
	AttachmentWritten_EmployeeActionPlan();
}

function CreatePlan_EmployeeActionPlan_OnClick()
{
	ChangeTitle("main", "ActionPlanWithCloseIcon_EmployeeActionPlan", '<span class="layertitleCM">'+getSeaPhrase("CM_329","CM")+" - "+DirectReports[_DIRECTREPORTSINDEX].description+"</span>");
	ShowActionPlanWithCloseIcon_EmployeeActionPlan(true, false);
}

function Update_EmployeeActionPlan_OnClick()
{
	var Index = GetSelectFormObject("main", "DirectReports", "cmbDirectReports").selectedIndex;
	var code = (Index>0)? DirectReports[Index-1].code : null;
	var pObj = GetFormObject("main", "frmAttachmentsForm", "ActionPlanHeader2_MyActionPlan");
	var company = authUser.company;
	var employee = code;
	var title = pObj.attachmentname.value;
	var body = pObj.comments.value;
	var fc = "A";
	var nextFunc = function()
	{
		if (Attachment && Attachment.CmtRec && Attachment.CmtRec.length)
			WriteActionPlanAttachment(Attachment, company, employee, title, body, "M", "AttachmentWritten_EmployeeActionPlan", "C");
		else
			WriteActionPlanAttachment(Attachment, company, employee, title, body, "A", "AttachmentWritten_EmployeeActionPlan", "C");
	};
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

function AttachmentWritten_EmployeeActionPlan()
{
	ActionPlanWithCloseIcon_EmployeeActionPlan_XIconClicked();
	var Index = GetSelectFormObject("main", "DirectReports", "cmbDirectReports").selectedIndex;
	var code = (Index>0)? DirectReports[Index-1].code : null;
	GetActionPlanAttachment("EmployeeAttachmentCollected", "C", authUser.company, code, true);
}

function ActionPlanWithCloseIcon_EmployeeActionPlan_XIconClicked()
{
	if (empCommentsExist)
		ShowActionPlanWithCloseIcon_EmployeeActionPlan(false, true)
	else
		ShowActionPlanWithCloseIcon_EmployeeActionPlan(false, false)
}

function Reviews_EmployeeActionPlan_OnClick()
{
	var nextFunc = function()
	{
		ShowActionPlan_EmployeeActionPlan(false)
		if (emssObjInstance.emssObj.filterSelect)
		{		
			ShowTrainingRegistration_EmployeeActionPlan(false);
			ShowTrainingHistory_EmployeeActionPlan(false);
			ShowReviews_EmployeeActionPlan(true);
			ShowReviewInfo(-1);
			openDmeListFieldFilter('filterList', "reviews", false);
			ShowFilterList(true);
			removeWaitAlert();
		}
		else
			DME_TO_REVIEW("SortReviewRecs()");
	};
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

function sortBySchedDate(obj1,obj2)
{
	var name1 = obj1.sched_date;
	var name2 = obj2.sched_date;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function SortReviewRecs()
{
	ReviewRecs = ReviewRecs.concat(self.jsreturn.record);
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
	{
		ReviewRecs.sort(sortBySchedDate);	
		DME_TO_REVIEW_FINISHED();
	}
}

function DME_TO_REVIEW_FINISHED()
{
	var Index = (arguments.length>0) ? arguments[0] : -1;
	var Desc = '<table width="100%" cellpadding="0" cellspacing="0" border="0" styler="list" summary="'+getSeaPhrase("TSUM_5","CM")+'">'
	+ '<caption class="offscreen">'+getSeaPhrase("TCAP_4","CM")+'</caption>'
	+ '<tr><th scope="col" class="contentlabelCM" align="center" width="100">'+getSeaPhrase("CM_330","CM")+'</th>'
	+ '<th scope="col" class="contentlabelCM">'+getSeaPhrase("CM_50","CM")+'</th></tr>';		
	for (var i=0; i<ReviewRecs.length; i++)
	{
		var toolTip = ReviewRecs[i].sched_date+', '+ReviewRecs[i].review_type_description+' - '+getSeaPhrase("CM_402","CM");
		Desc += '<tr><td style="text-align:center"';
		if (Index == i)
			Desc += ' class="tablerowhighlightCM"';
		Desc += '><a class="contenttextCM" href="javascript:;" onclick="parent.DME_TO_REVIEW_FINISHED('+i+');return false;"';
		Desc += ' title="'+toolTip+'">'+ReviewRecs[i].sched_date+'<span class="offscreen"> - '+getSeaPhrase("CM_402","CM")+'</span></a></td><td style="text-align:center"';
		if (Index == i)
			Desc += ' class="tablerowhighlightCM"';
		Desc += '><a class="contenttextCM" href="javascript:;" onclick="parent.DME_TO_REVIEW_FINISHED('+i+');return false;">';
		Desc += ' title="'+toolTip+'">'+ReviewRecs[i].review_type_description+'<span class="offscreen"> - '+getSeaPhrase("CM_402","CM")+'</span></a>';
		Desc += '</td></tr>';
	}
	if (!ReviewRecs.length)
		Desc += '<tr><td class="contenttextCM" width="100%" align="center" colspan="2">'+getSeaPhrase("CM_331","CM")+'</td></tr>';
	Desc += '</table>';
	Desc += uiButton(getSeaPhrase("CM_94","CM"),"parent.Reviews_EmployeeActionPlan_XIconClicked();return false;","margin-top:10px");
	ReplaceWindowContent("main", "Reviews_EmployeeActionPlanWindow", Desc);
	ShowTrainingRegistration_EmployeeActionPlan(false);
	ShowTrainingHistory_EmployeeActionPlan(false);
	ShowReviews_EmployeeActionPlan(true);
	ShowReviewInfo(Index);
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
}

function ShowReviewInfo(Index)
{
    if (emssObjInstance.emssObj.filterSelect)
		ReviewRecs = self.jsreturn.record;
	if (Index >= 0)
	{
		var Desc = '<table border="0" cellpadding="0" cellspacing="0" summary="'+getSeaPhrase("TSUM_6","CM",[ReviewRecs[Index].review_type_description])+'">'
		+ '<caption class="offscreen">'+getSeaPhrase("TCAP_5","CM",[ReviewRecs[Index].review_type_description])+'</caption>'
		+ '<tr><th scope="col" colspan="2"></th></tr>'
    	+ '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_332","CM")+'</th>'
    	+ '<td class="contenttextCM">'+ReviewRecs[Index].actual_date+'</td></tr>'
    	+ '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_333","CM")+'</th>'
    	+ '<td class="contenttextCM">'+ReviewRecs[Index].rating+'</td></tr>'
    	+ '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_334","CM")+'</th>'
    	+ '<td class="contenttextCM">'+ReviewRecs[Index].first_name+' '+ReviewRecs[Index].middle_init+'. '+ReviewRecs[Index].last_name+'</td></tr></table>';
		replaceContent("main", "ActionPlanHeader2_MyActionPlan", Desc);
	}
	else
		replaceContent("main", "TrainingHistoryFooter_EmployeeActionPlan", "");
}

function TrainingHistory_EmployeeActionPlan_OnClick()
{
	var nextFunc = function()
	{
		ShowActionPlan_EmployeeActionPlan(false);
		if (emssObjInstance.emssObj.filterSelect)
		{		
			ShowTrainingRegistration_EmployeeActionPlan(false);
			ShowTrainingHistory_EmployeeActionPlan(true);
			ShowReviews_EmployeeActionPlan(false);
			ShowTrainingHistoryInfo(-1);
			openDmeListFieldFilter('filterList', "training_history", false);
			ShowFilterList(true);	
			removeWaitAlert();
		}
		else
			DME_TO_TRAINING_HISTORY("SortTrainingHistory()");
	};
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

function sortByCrsDescription(obj1,obj2)
{
	var name1 = obj1.course_short_crs_desc;
	var name2 = obj2.course_short_crs_desc;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function SortTrainingHistory()
{
	TrHistory = TrHistory.concat(self.jsreturn.record);
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
	{
		if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "09.00.01")
		{
			// if application version is 9.0.1 or greater, records will be sorted by descending DATE-COMPLETED,
			// based on index TRHSET4.
		}
		else
		{
			// otherwise, sort by ascending description.
			TrHistory.sort(sortByCrsDescription);	
		}
		DME_TO_TRAINING_HISTORY_FINISHED();
	}
}

function DME_TO_TRAINING_HISTORY_FINISHED()
{
	var Index = (arguments.length>0) ? arguments[0] : -1;
	var Desc = '<table width="100%" cellpadding="0" cellspacing="0" border="0" styler="list" summary="'+getSeaPhrase("TSUM_7","CM")+'">'
	+ '<caption class="offscreen">'+getSeaPhrase("TCAP_6","CM")+'</caption>'
	+ '<tr><th scope="col" class="contentlabelCM" align="center" width="100">'+getSeaPhrase("CM_335","CM")+'</th>'
	+ '<th scope="col" class="contentlabelCM">'+getSeaPhrase("CM_336","CM")+'</th></tr>';
	for (var i=0; i<TrHistory.length; i++)
	{
		var toolTip = TrHistory[i].course_short_crs_desc+', '+TrHistory[i].date_completed+' - '+getSeaPhrase("CM_403","CM");
		Desc += '<tr><td';
		if (Index == i)
			Desc += ' class="tablerowhighlightCM"';
		Desc += '><a class="contenttextCM" href="javascript:;" onclick="parent.DME_TO_TRAINING_HISTORY_FINISHED('+i+');return false;"';
		Desc += ' title="'+toolTip+'">'+TrHistory[i].course_short_crs_desc+'<span class="offscreen"> - '+getSeaPhrase("CM_403","CM")+'</span></a></td><td style="text-align:center"';
		if (Index == i)
			Desc += ' class="tablerowhighlightCM"';
		Desc += '><a class="contenttextCM" href="javascript:;" onclick="parent.DME_TO_TRAINING_HISTORY_FINISHED('+i+');return false;">';
		Desc += ' title="'+toolTip+'">'+TrHistory[i].date_completed+'<span class="offscreen"> - '+getSeaPhrase("CM_403","CM")+'</span></a></td></tr>';
	}
	if (!TrHistory.length)
		Desc += '<tr><td class="contenttextCM" width="100%" align="center" colspan="2">'+getSeaPhrase("CM_331","CM")+'</td></tr>';
	Desc += '</table>';	
	Desc += uiButton(getSeaPhrase("CM_94","CM"),"parent.TrainingHistory_EmployeeActionPlan_XIconClicked();return false;","margin-top:10px");		
	ReplaceWindowContent("main", "TrainingHistory_EmployeeActionPlanWindow", Desc);
	ShowTrainingRegistration_EmployeeActionPlan(false);
	ShowTrainingHistory_EmployeeActionPlan(true);
	ShowReviews_EmployeeActionPlan(false);
	ShowTrainingHistoryInfo(Index);
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
}

function ShowTrainingHistoryInfo(Index)
{
	if (emssObjInstance.emssObj.filterSelect)
	 	TrHistory = self.jsreturn.record;
	if (Index >= 0)
	{
		var Desc = '<table width="500" border="0" cellpadding="0" cellspacing="0" summary="'+getSeaPhrase("TSUM_8","CM",[TrHistory[Index].course_short_crs_desc])+'">'
		+ '<caption class="offscreen">'+getSeaPhrase("TCAP_7","SEA",[TrHistory[Index].course_short_crs_desc])+'</caption>'
		+ '<tr><th scope="col" colspan="2"></th></tr>'
    	+ '<tr><th scope="row" class="contentlabelCM" width="100">'+getSeaPhrase("CM_337","CM")+'</th>'
    	+ '<td class="contenttextCM" width="400">'+TrHistory[Index].course+'</td></tr>'
    	+ '<tr><th scope="row" class="contentlabelCM" width="100">'+getSeaPhrase("CM_338","CM")+'</th>'
    	+ '<td class="contenttextCM" width="400">'+TrHistory[Index].complete_stats_xlt+'</td></tr>'
    	+ '<tr><th scope="row" class="contentlabelCM" width="100">'+getSeaPhrase("CM_339","CM")+'</th>'
    	+ '<td class="contenttextCM" width="400">'+TrHistory[Index].ceu_awarded+'</td></tr>'
    	+ '<tr><th scope="row" class="contentlabelCM" width="100">'+getSeaPhrase("CM_333","CM")+'</th>'
    	+ '<td class="contenttextCM" width="400">'+TrHistory[Index].rating+'</td></tr></table>';			
		replaceContent("main", "TrainingHistoryFooter_EmployeeActionPlan", Desc);
	}
	else
		replaceContent("main", "TrainingHistoryFooter_EmployeeActionPlan", "");
}

function TrainingRegistration_EmployeeActionPlan_OnClick()
{
	var nextFunc = function()
	{
		ShowActionPlan_EmployeeActionPlan(false);
		if (emssObjInstance.emssObj.filterSelect)
		{
			ShowTrainingRegistration_EmployeeActionPlan(true);
			ShowTrainingHistory_EmployeeActionPlan(false);
			ShowReviews_EmployeeActionPlan(false);
			ShowTrainingRegistrationInfo(-1);
			openDmeListFieldFilter('filterList', "training_registration", false);
			ShowFilterList(true);
			removeWaitAlert();
		}
		else
			DME_TO_TRAINING_REGISTRATION("SortTrainingRegistration()");
	};
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

function SortTrainingRegistration()
{
	TrRegistration = TrRegistration.concat(self.jsreturn.record);
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
	{
		TrRegistration.sort(sortByCrsDescription);	
		DME_TO_TRAINING_REGISTRATION_FINISHED();
	}
}

function DME_TO_TRAINING_REGISTRATION_FINISHED()
{
	var Index = (arguments.length>0) ? arguments[0] : -1;
	var Desc = '<table width="100%" cellpadding="0" cellspacing="0" border="0" styler="list" summary="'+getSeaPhrase("TSUM_9","CM")+'">'
	+ '<caption class="offscreen">'+getSeaPhrase("TCAP_8","CM")+'</caption>'
	+ '<tr><th scope="col" class="contentlabelCM" align="center" width="100">'+getSeaPhrase("CM_335","CM")+'</th>'
	+ '<th scope="col" class="contentlabelCM">'+getSeaPhrase("CM_289","CM")+'</th></tr>';
	for (var i=0; i<TrRegistration.length; i++)
	{
		var toolTip = TrRegistration[i].course_short_crs_desc+', '+TrRegistration[i].start_date+' - '+getSeaPhrase("CM_404","CM");
		Desc += '<tr><td';
		if (Index == i)
			Desc += ' class="tablerowhighlightCM"';
		Desc += '><a class="contenttextCM" href="javascript:;" onclick="parent.DME_TO_TRAINING_REGISTRATION_FINISHED('+i+');return false;"';
		Desc += ' title="'+toolTip+'">'+TrRegistration[i].course_short_crs_desc+'<span class="offscreen"> - '+getSeaPhrase("CM_404","CM")+'</span></a></td><td style="text-align:center"';
		if (Index == i)
			Desc += ' class="tablerowhighlightCM"';
		Desc += '><a class="contenttextCM" href="javascript:;" onclick="parent.DME_TO_TRAINING_REGISTRATION_FINISHED('+i+');return false;"';
		Desc += ' title="'+toolTip+'">'+TrRegistration[i].start_date+'<span class="offscreen"> - '+getSeaPhrase("CM_404","CM")+'</span></a></td></tr>';
	}
	if (!TrRegistration.length)
		Desc += '<tr><td class="contenttextCM" width="100%" align="center" colspan="2">'+getSeaPhrase("CM_331","CM")+'</td></tr>';
	Desc += '</table>';
	Desc += uiButton(getSeaPhrase("CM_94","CM"),"parent.TrainingRegistration_EmployeeActionPlan_XIconClicked();return false;","margin-top:10px");
	ReplaceWindowContent("main", "TrainingRegistration_EmployeeActionPlanWindow", Desc);
	ShowTrainingRegistration_EmployeeActionPlan(true);
	ShowTrainingHistory_EmployeeActionPlan(false);
	ShowReviews_EmployeeActionPlan(false);
	ShowTrainingRegistrationInfo(Index);
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
}

function ShowTrainingRegistrationInfo(Index)
{
    if (emssObjInstance.emssObj.filterSelect)
		TrRegistration = self.jsreturn.record;
	if (Index >=0)
	{
    	var Desc = '<table border="0" cellpadding="0" cellspacing="0" summary="'+getSeaPhrase("TSUM_10","CM",[TrRegistration[i].course_short_crs_desc])+'">'
    	+ '<caption class="offscreen">'+getSeaPhrase("TCAP_9","CM",[TrRegistration[i].course_short_crs_desc])+'</caption>'
    	+ '<tr><th scope="col" colspan="2"></th></tr>'
    	+ '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_337","CM")+'</th>'
    	+ '<td class="contenttextCM">'+TrRegistration[Index].course+'</td></tr>'
    	+ '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_338","CM")+'</th>'
    	+ '<td class="contenttextCM">'+TrRegistration[Index].reg_status_xlt+'</td></tr>'
    	+ '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_340","CM")+'</th>'
    	+ '<td class="contenttextCM">'+TrRegistration[Index].notification_xlt+'</td></tr>'
    	+ '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_341","CM")+'</th>'
    	+ '<td class="contenttextCM">'+TrRegistration[Index].waitlist_date+'</td></tr>'
    	+ '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_342","CM")+'</th>'
    	+ '<td class="contenttextCM">'+TrRegistration[Index].confirm_act_dt+'</td></tr></table>'
		replaceContent("main", "TrainingRegistrationFooter_EmployeeActionPlan", Desc)
	}
	else
		replaceContent("main", "TrainingRegistrationFooter_EmployeeActionPlan", "")	
}

function DrawInstructions_EmployeeActionPlan(SelectValues)
{
	var pObj = new CareerManagementWindowObject(Window6,"main", "Instructions_EmployeeActionPlan", 502,23,288,180, true, getSeaPhrase("CM_114","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.Draw();
	var Desc = '<label class="contenttextCM" for="cmbDirectReports">'+getSeaPhrase("CM_343","CM")+'</label>'
	createLayer("main","InstructionsHeader_EmployeeActionPlan",520,55,255,50,true,Desc,"","");
	MakeSelectBox("DirectReports", 550, 150, 275, 30, "cmbDirectReports", SelectValues, true, _DIRECTREPORTSINDEX, true)
}

function DrawActionPlan_EmployeeActionPlan()
{
	var pObj = new CareerManagementWindowObject(Window1,"main", "ActionPlan_EmployeeActionPlan", 2, 23, 496, 484, false, getSeaPhrase("CM_329","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.Draw();	
	pObj.DrawView(20, 120, 460, 350);
	createLayer("main","ActionPlanHeader_EmployeeActionPlan",20,60,270,100,false,"","","");
}

function ShowActionPlan_EmployeeActionPlan(nCmd)
{
	ShowWin(nCmd, "main", "ActionPlan_EmployeeActionPlan", true, true, false);
	if (nCmd)
		showLayer("main", "ActionPlanHeader_EmployeeActionPlan");
	else
		hideLayer("main", "ActionPlanHeader_EmployeeActionPlan");
}

function DrawReviews_EmployeeActionPlan()
{
	var pObj = new CareerManagementWindowObject(Window1,"main", "Reviews_EmployeeActionPlan", 2, 23, 496, 484, false, getSeaPhrase("CM_344","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	if (emssObjInstance.emssObj.filterSelect)
	{
		pObj.AddCloseIcon = true;
		pObj.CloseIconLocationLeft = pObj.Left + 468
		pObj.CloseIconLocationTop = pObj.Top + 5
	}
	pObj.Draw();
	pObj.DrawView(50, 60, 400, 325);
	if (emssObjInstance.emssObj.filterSelect)
	{
		var filterList = document.getElementById("filterList");
		setHorizontalPos(filterList, "12px");
		filterList.style.top = "87px";
		filterList.style.width = "484px";
		filterList.style.height = "325px";
	}
	createLayer("main","ActionPlanHeader2_MyActionPlan",10,400,480,100,false,"","", "");
}
	
function ShowReviews_EmployeeActionPlan(nCmd)
{
	ShowWin(nCmd, "main", "Reviews_EmployeeActionPlan", true, true, false);
	if (nCmd)
		showLayer("main", "ActionPlanHeader2_MyActionPlan");
	else
		hideLayer("main", "ActionPlanHeader2_MyActionPlan");
}

function DrawTrainingHistory_EmployeeActionPlan()
{
	var pObj = new CareerManagementWindowObject(Window1,"main", "TrainingHistory_EmployeeActionPlan", 2, 23, 496, 484, false, getSeaPhrase("CM_345","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	if (emssObjInstance.emssObj.filterSelect)
	{	
		pObj.AddCloseIcon = true;
		pObj.CloseIconLocationLeft = pObj.Left + 468
		pObj.CloseIconLocationTop = pObj.Top + 5
	}
	pObj.Draw();
	pObj.DrawView(50, 60, 400, 325);
	createLayer("main","TrainingHistoryFooter_EmployeeActionPlan",10,400,480,75,false,"","", "");	
}

function ShowTrainingHistory_EmployeeActionPlan(nCmd)
{
	ShowWin(nCmd, "main", "TrainingHistory_EmployeeActionPlan", true, true, false);
	if (nCmd)
		showLayer("main", "TrainingHistoryFooter_EmployeeActionPlan");
	else
		hideLayer("main", "TrainingHistoryFooter_EmployeeActionPlan");
}

function DrawTrainingRegistration_EmployeeActionPlan()
{
	var pObj = new CareerManagementWindowObject(Window1,"main", "TrainingRegistration_EmployeeActionPlan", 2, 23, 496, 484, false, getSeaPhrase("CM_346","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	if (emssObjInstance.emssObj.filterSelect)
	{	
		pObj.AddCloseIcon = true;
		pObj.CloseIconLocationLeft = pObj.Left + 468
		pObj.CloseIconLocationTop = pObj.Top + 5
	}
	pObj.Draw();
	pObj.DrawView(50, 60, 400, 240);
	createLayer("main","TrainingRegistrationFooter_EmployeeActionPlan",10,400,480,100,false,"","", "");	
}

function ShowTrainingRegistration_EmployeeActionPlan(nCmd)
{
	ShowWin(nCmd, "main", "TrainingRegistration_EmployeeActionPlan", true, true, false);
	if (nCmd)
		showLayer("main", "TrainingRegistrationFooter_EmployeeActionPlan");
	else
		hideLayer("main", "TrainingRegistrationFooter_EmployeeActionPlan");
}

function Reviews_EmployeeActionPlan_XIconClicked()
{
	if (emssObjInstance.emssObj.filterSelect)
		ShowFilterList(false);
	ShowReviews_EmployeeActionPlan(false);
	ShowActionPlan_EmployeeActionPlan(true)
}

function TrainingHistory_EmployeeActionPlan_XIconClicked()
{
	if (emssObjInstance.emssObj.filterSelect)
		ShowFilterList(false);
	ShowTrainingHistory_EmployeeActionPlan(false);
	ShowActionPlan_EmployeeActionPlan(true);
}

function TrainingRegistration_EmployeeActionPlan_XIconClicked()
{
	if (emssObjInstance.emssObj.filterSelect)
		ShowFilterList(false);
	ShowTrainingRegistration_EmployeeActionPlan(false);
	ShowActionPlan_EmployeeActionPlan(true);
}	

function DrawAdditionalDetail_EmployeeActionPlan()
{
	var toolTip = getSeaPhrase("CM_344","CM")+' - '+getSeaPhrase("VIEW_DTL_FOR","SEA");
	var Desc = '<table cellpadding="0" cellspacing="0" role="presentation">'
	+ '<tr><td><a class="contenttextCM" href="javascript:;" onclick="parent.RepaintAdditionalDetail_EmployeeActionPlanLinks(0);parent.Reviews_EmployeeActionPlan_OnClick();return false;"'
	+ ' title="'+toolTip+'">'+getSeaPhrase("CM_344","CM")+'<span class="offscreen"> - '+getSeaPhrase("VIEW_DTL_FOR","SEA")+'</span></a></td></tr>'
	toolTip = getSeaPhrase("CM_345","CM")+' - '+getSeaPhrase("VIEW_DTL_FOR","SEA");
	Desc += '<tr><td><a class="contenttextCM" href="javascript:;" onclick="parent.RepaintAdditionalDetail_EmployeeActionPlanLinks(1);parent.TrainingHistory_EmployeeActionPlan_OnClick();return false;"'
	+ ' title="'+toolTip+'">'+getSeaPhrase("CM_345","CM")+'<span class="offscreen"> - '+getSeaPhrase("VIEW_DTL_FOR","SEA")+'</span></a></td></tr>'
	toolTip = getSeaPhrase("CM_346","CM")+' - '+getSeaPhrase("VIEW_DTL_FOR","SEA");
	Desc += '<tr><td><a class="contenttextCM" href="javascript:;" onclick="parent.RepaintAdditionalDetail_EmployeeActionPlanLinks(2);parent.TrainingRegistration_EmployeeActionPlan_OnClick();return false;"'
	+ ' title="'+toolTip+'">'+getSeaPhrase("CM_346","CM")+'<span class="offscreen"> - '+getSeaPhrase("VIEW_DTL_FOR","SEA")+'</span></a></td></tr></table>'
	var pObj = new CareerManagementWindowObject(Window5,"main", "AdditionalDetail_EmployeeActionPlan", 502,208,288,135, false, getSeaPhrase("CM_347","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowInformation = "";
	pObj.WindowColor = WindowColor;
	pObj.WindowInformation = Desc;
	pObj.Draw();
	pObj.DrawView(520, 248, 255, 80);
}

function RepaintAdditionalDetail_EmployeeActionPlanLinks(Index)
{
	var Desc = '<table cellpadding="0" cellspacing="0" role="presentation"><tr><td'
	if (typeof(Index) != "undefined" && Index != null && Index == 0) 
		Desc += ' class="tablerowhighlightCM"'
	var toolTip = getSeaPhrase("CM_344","CM")+' - '+getSeaPhrase("VIEW_DTL_FOR","SEA");		
	Desc += '><a class="contenttextCM" href="javascript:;" onclick="parent.RepaintAdditionalDetail_EmployeeActionPlanLinks(0);parent.Reviews_EmployeeActionPlan_OnClick();return false;"'
	Desc += ' title="'+toolTip+'">'+getSeaPhrase("CM_344","CM")+'<span class="offscreen"> - '+getSeaPhrase("VIEW_DTL_FOR","SEA")+'</span></a></td></tr><tr><td'
	if (typeof(Index) != "undefined" && Index != null && Index == 1) 
		Desc += ' class="tablerowhighlightCM"'
	toolTip = getSeaPhrase("CM_345","CM")+' - '+getSeaPhrase("VIEW_DTL_FOR","SEA");		
	Desc += '><a class="contenttextCM" href="javascript:;" onclick="parent.RepaintAdditionalDetail_EmployeeActionPlanLinks(1);parent.TrainingHistory_EmployeeActionPlan_OnClick();return false;"'
	Desc += ' title="'+toolTip+'">'+getSeaPhrase("CM_345","CM")+'<span class="offscreen"> - '+getSeaPhrase("VIEW_DTL_FOR","SEA")+'</span></a></td></tr><tr><td'
	if (typeof(Index) != "undefined" && Index != null && Index == 2) 
		Desc += ' class="tablerowhighlightCM"'
	toolTip = getSeaPhrase("CM_346","CM")+' - '+getSeaPhrase("VIEW_DTL_FOR","SEA");		
	Desc += '><a class="contenttextCM" href="javascript:;" onclick="parent.RepaintAdditionalDetail_EmployeeActionPlanLinks(2);parent.TrainingRegistration_EmployeeActionPlan_OnClick();return false;"'	
	Desc += ' title="'+toolTip+'">'+getSeaPhrase("CM_346","CM")+'<span class="offscreen"> - '+getSeaPhrase("VIEW_DTL_FOR","SEA")+'</span></a></td></tr></table>'
	ReplaceWindowContent("main", "AdditionalDetail_EmployeeActionPlanWindow", Desc);
}

function ShowAdditionalDetail_EmployeeActionPlan(nCmd)
{
	ShowWin(nCmd, "main", "AdditionalDetail_EmployeeActionPlan", true, false, false);
}
 
/*
 *	Job Profile Tab
 */
var _TABSELECTED;
var _INDIVIDUALPROFILEALERT = false; // Flag that stores whether we have shown a job profile alert for this employee yet.

function DrawJobProfileWindows_Manager(TabName, NoRefresh)
{
	_TABSELECTED = TabName;
	var ReportName = "";
	if (typeof(DirectReports) != "undefined" && DirectReports != null && _DIRECTREPORTSINDEX >= 0)
		ReportName = " - " + DirectReports[_DIRECTREPORTSINDEX].description;
	DrawJobProfileTabs_MyJobProfile	(
	 	false,	//Do not redraw
	 	TabName, //Set to tab 0
		getSeaPhrase("CM_382","CM") + ReportName // set title description
	);
	DrawCourseDetailTabs(
		false,//Do not redraw
		0, 	//Set to tab 0
	  	false,//Visible flag
	  	"MyJobProfile",
	  	true	//Set close icon
	);
	DrawCourseDetail("MyJobProfile");
	DrawCourses_MyJobProfile();
	DrawDetail_MyJobProfile();
	DrawAdditionalJobDetail_MyJobProfile();
	DrawJobDescription_MyJobProfile();
	DrawJobProfile_MyJobProfile();
	if (typeof(DirectReports) == "undefined" || DirectReports == null || !DirectReports.length)
	{
		DetailLine = 0;
		DirectReports = new Array(0);
		var funcStr = (NoRefresh) ? "ManagerIndividualProfile_NoRefresh" : "ManagerIndividualProfile";
		Call_HS10(authUser.company, authUser.employee, funcStr);
	}
	else if (NoRefresh)
		Do_HS10_1_Call_ManagerIndividualProfile_NoRefresh_Finished();
	else
		Do_HS10_1_Call_ManagerIndividualProfile_Finished();
}

function Do_HS10_1_Call_ManagerIndividualProfile_Finished()
{
	if (!ReportsExist()) 
	{
		removeWaitAlert();
		return;
	}
	DrawInstructionsManager_MyJobProfile(DirectReports);
	var code = (_DIRECTREPORTSINDEX >= 0)? DirectReports[_DIRECTREPORTSINDEX].code : null;
	if (JobProfileCareerProfileHash[Number(code)])
	{
		CareerProfile = JobProfileCareerProfileHash[Number(code)];
		Do_HS50_1_Call_M_INDIVIDUALPROFILE_Finished();
	}
	else if (code != null)
		Do_HS50_Call(3, 1, null, null, "HS50.1", "M_INDIVIDUALPROFILE", code);
	else
		Do_HS50_1_Call_M_INDIVIDUALPROFILE_Finished();
	FinishedDrawingTabs();
}

function Do_HS10_1_Call_ManagerIndividualProfile_NoRefresh_Finished()
{
	if (!ReportsExist()) 
	{
		removeWaitAlert();
		return;
	}
	DrawInstructionsManager_MyJobProfile(DirectReports)
	Do_HS50_1_Call_M_INDIVIDUALPROFILE_Finished();
	FinishedDrawingTabs();
}

function Do_HS50_1_Call_M_INDIVIDUALPROFILE_Finished()
{
	var code = (_DIRECTREPORTSINDEX >= 0)? DirectReports[_DIRECTREPORTSINDEX].code : null;
	if (StandardCareerProfile == null)
	{
		StandardCareerProfile = CareerProfile;
		// cache this HS50 object
		StandardCareerProfileHash[Number(code)] = StandardCareerProfile;
	}
	// cache this HS50 object
	JobProfileCareerProfileHash[Number(code)] = CareerProfile;
	Desc = "";
	if (_DIRECTREPORTSINDEX >= 0)
	{		
		Desc += '<span class="contenttextCM">'
		if (CareerProfile.jobCompFlag != "Y" && CareerProfile.empCompFlag != "Y")
			Desc += getSeaPhrase("CM_383","CM")
		else if (CareerProfile.jobCompFlag != "Y")
			Desc += getSeaPhrase("CM_384","CM")
		else if (CareerProfile.empCompFlag != "Y")
			Desc += getSeaPhrase("CM_385","CM")
		Desc += '</span>'
	}	
	replaceContent("main","InstructionsHeaderAlert", Desc);
	Desc = '<span class="layertitleCM">'+getSeaPhrase("CM_382","CM")
	if (_DIRECTREPORTSINDEX >= 0) Desc +=" - "+DirectReports[_DIRECTREPORTSINDEX].description;  
	Desc += '</span>';
	ChangeTitle("main", "JobProfile_MyJobProfile", Desc);
	ReplaceWindowContent("main", "JobProfile_MyJobProfileWindow", GetProfileInformation(_TABSELECTED,false));
	var Desc = '';
	if (_DIRECTREPORTSINDEX < 0 || typeof(CareerProfile) == "undefined" || CareerProfile == null || 
		((!CareerProfile.jobDetailFlag || CareerProfile.jobDetailFlag == null) && (!CareerProfile.posDetailFlag || CareerProfile.posDetailFlag == null)))
	{	
		Desc += '<span class="contenttextCM">'+getSeaPhrase("CM_201","CM")+'</span>'
	}
	else
	{
		var toolTip = getSeaPhrase("CM_201","CM")+' - '+getSeaPhrase("CM_224","CM");
		Desc += '<a class="contenttextCM" href="javascript:;" onclick="parent.AdditionalJobDetail_MyJobProfile_OnClick();" title="'+toolTip+'">'+getSeaPhrase("CM_201","CM")+'<span class="offscreen"> - '+getSeaPhrase("CM_224","CM")+'</span></a>'
	}
	replaceContent("main","AdditionalJobDetailLink_MyJobProfile",Desc);
	var Desc = ''
	if (_DIRECTREPORTSINDEX < 0 || typeof(CareerProfile) == "undefined" || CareerProfile == null || !CareerProfile.jobDescFlag || CareerProfile.jobDescFlag == null)
		Desc += '<span class="contenttextCM">'+getSeaPhrase("CM_205","CM")+'</span>'
	else
	{
		var toolTip = getSeaPhrase("CM_205","CM")+' - '+getSeaPhrase("CM_223","CM");
		Desc += '<a class="contenttextCM" href="javascript:;" onclick="parent.JobDescription_MyJobProfile_OnClick();" title="'+toolTip+'">'+getSeaPhrase("CM_205","CM")+'<span class="offscreen"> - '+getSeaPhrase("CM_223","CM")+'</span></a>'
	}
	replaceContent("main","JobDescriptionLink_MyJobProfile", Desc);
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
}

function RecallJobProfile(Tab)
{
	DrawJobProfileWindows_Manager(Tab);
}

/*
 *	Employee Qualifications Tab
 */
function DrawMyQualificationsWindows_Manager()
{
	_TABSELECTED = 0;
	DrawInstructions_EmployeeQualifications(DirectReports);
	DrawQualficationsTabs(false, 0);
	DrawCategoryInstructions_MyQualifications();
	DrawCompetencyDetail_MyQualifications();
	FinishedDrawingTabs();
	// Perform HS50.1 AGS call using the selected direct report in order to 
	// refresh the qualification list.
	var code = (_DIRECTREPORTSINDEX>=0)? DirectReports[_DIRECTREPORTSINDEX].code : null;
	if (code != null)
		cmbDirectReports_OnChange();
}

function Do_HS50_1_Call_M_QUALIFICATIONS_Finished()
{
	StandardCareerProfile = CareerProfile;
	var Index = GetSelectFormObject("main", "DirectReports", "cmbDirectReports").selectedIndex;
	var code = (Index>0)? DirectReports[Index-1].code : null;
	// cache this HS50 object
	StandardCareerProfileHash[Number(code)] = StandardCareerProfile;
	switch (_TABSELECTED)
	{
		case 0:	OnTabClicked_Qualifications("Competencies"); break;
		case 1: OnTabClicked_Qualifications("Certifications"); break;
		case 2: OnTabClicked_Qualifications("Education"); break;
		default: removeWaitAlert(); break;
	}
}

function Do_HS50_1_Call_M_QUALIFICATIONS_NoRefresh_Finished()
{	
	switch (_TABSELECTED)
	{
		case 0:	OnTabClicked_Qualifications("Competencies"); break;
		case 1: OnTabClicked_Qualifications("Certifications"); break;
		case 2: OnTabClicked_Qualifications("Education"); break;
		default: removeWaitAlert(); break;
	}
}

/*
 *	Explore Careers Tab
 */
function DrawExploreCareersWindows_Manager(TabName, ProfileTabName)
{	
	_TABSELECTED = TabName;
	_EXPLOREPROFILETABSELECTED = ProfileTabName;
	DrawExploreCareersWindowsTabs(false, TabName, true);
	if (typeof(DirectReports) == "undefined" || DirectReports == null || !DirectReports.length)
	{
		DetailLine = 0;
		DirectReports = new Array(0);
		Call_HS10(authUser.company, authUser.employee, "M_EXPLORECAREERS");
	}
	else
		Do_HS10_1_Call_M_EXPLORECAREERS_Finished();
}

function Do_HS10_1_Call_M_EXPLORECAREERS_Finished()
{	
	if (!ReportsExist()) 
	{
		removeWaitAlert();
		return;
	}
	if (emssObjInstance.emssObj.filterSelect)
		DrawExploreCareersWindows_ManagerContent();
	else
	{
		if (_EXPLORECURRENTWIN == "EXPLOREJOBTITLE" && (typeof(JobCode) == "undefined" || JobCode == null))
		{
			var JobTitle = new JobCodeObject("M_EXPLORECAREERS");
			JobTitle.frame = "jsreturn";
			JobTitle.isSelect = true;
			JobTitle.PaintJobCode();
		}
		else
			PaintJobCode_M_EXPLORECAREERS_Done();	
	}
}

function PaintJobCode_M_EXPLORECAREERS_Done()
{	
	if (_EXPLORECURRENTWIN == "EXPLORECATEGORY" && (typeof(JobClass) == "undefined" || JobClass == null)) 
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
	DrawExploreCareersWindows_ManagerContent();
}

//////////////////////////////////////////////////////////////////////////////////////////
//								MAIN DRAWING TASKS										//
//////////////////////////////////////////////////////////////////////////////////////////

function DrawExploreCareersWindows_ManagerContent()
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
	switch (_EXPLORECURRENTWIN)
	{
		case "EXPLORECATEGORY":
			DrawCategoryTab_ManagerExploreCareers(DirectReports);
			DrawExploreCareersWindowsTabs(true, 1);
			break;
		case "EXPLOREQUALCRITERIA":
			DrawQualCriteriaTab_ManagerExploreCareers(DirectReports);
			DrawExploreCareersWindowsTabs(true, 2);
			break;
		default: // "EXPLOREJOBTITLE"	
			DrawJobTitleTab_ManagerExploreCareers(DirectReports);
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
		if (_CURRENTTAB == "M_EXPLORECAREERS" && _EXPLORECURRENTWIN == "EXPLORECATEGORY")
		{
			ShowExploreCareers(false, "Category", true);
			ShowJobList_ExploreCareers(true);
		}
		if (_CURRENTTAB == "M_EXPLORECAREERS" && _EXPLORECURRENTWIN == "EXPLOREQUALCRITERIA")
		{
			ShowExploreCareers(false, "QualCriteria", true);
			ReDrawQualCriteriaJobListContent();
			ShowJobList_ExploreCareers(true);
		}
		_REFRESHJOBLIST = false;
	}	
	FinishedDrawingTabs();
}

function DrawJobTitleTab_ManagerExploreCareers(SelectValues)
{
	pObj = new CareerManagementWindowObject(Window3,"main", "Instructions_ManagerExploreCareers", 402,71,392,442, true, getSeaPhrase("CM_114","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.Draw();
	Desc = '<span class="contenttextCM">'+getSeaPhrase("CM_348","CM")+'</span>'	
	createLayer("main","JobTitle_Instructions",415,105,370,150,true,Desc,"","",true);
	var toolTip;
	if (emssObjInstance.emssObj.filterSelect)
	{
		toolTip = dmeFieldToolTip("job_title");
		Desc = '<label class="contentlabelCM" for="JobTitleFilterSelect_ExploreCareers">'+getSeaPhrase("CM_23","CM")+'</label>'
		createLayer("main","JobTitle_JobTitleLabel",475,270,300,50,true,Desc,"","");		
		MakeTextBox("JobTitleFilterSelect", 475, 290, 105, 25, "JobTitleFilterSelect_ExploreCareers", true, 30, "", 'styler="select" styler_click="parent.JobTitleFilterSelectArrow_OnClick"');
		MakeButton('<img style="cursor:hand;cursor:pointer" border="0" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" alt="'+toolTip+'" title="'+toolTip+'">', 570, 290, 12, 16,
			WindowColor, "JobTitleFilterSelectArrow", true, getSeaPhrase("CM_185","CM"), true, 'styler="hidden"');
		var buttonObj = getLayerDocument("main", "JobTitleFilterSelectArrowButton");	
		if (buttonObj != null)
			buttonObj.setAttribute("styler", "hidden");			
		Desc = '<span id="JobTitleFilterSelectDesc" class="contenttextdisplayCM"></span>'
		createLayer("main","JobTitleFilterSelectDesc_ExploreCareers",587,290,150,30,true,Desc,"","");	
	}
	else
	{	
		Desc = '<label class="contentlabelCM" for="jobtitleselect">'+getSeaPhrase("CM_23","CM")+'</label>'
		createLayer("main","JobTitle_JobTitleLabel",475,270,300,50,true,Desc,"","");		
		MakeSelectBox("JobTitleSelect", 475, 290, 300, 50, "jobtitleselect", JobCode, true, _JOBCODEINDEX, true);	
	}
	Desc = '<label class="contentlabelCM" for="cmbDirectReports">'+getSeaPhrase("CM_4","CM")+'</label>'
	createLayer("main","JobTitle_DirectReportsLabel",475,316,300,50,true,Desc,"","");
	MakeSelectBox("DirectReports", 475, 336, 300, 50, "cmbDirectReports", SelectValues, true, _DIRECTREPORTSINDEX, true);
	MakeButton(getSeaPhrase("CM_117","CM"), 475, 367, "auto", 30, ButtonBorderColor, "createprofile_ManagerExploreCareers", true);
}

function DrawCategoryTab_ManagerExploreCareers(SelectValues)
{
	pObj = new CareerManagementWindowObject(Window3,"main", "Instructions_ManagerExploreCareers", 402,71,392,442, true, getSeaPhrase("CM_114","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.Draw();
	Desc = '<span class="contenttextCM">'+getSeaPhrase("CM_349","CM")+'</span>'
	createLayer("main","Category_Instructions",415,105,370,150,true,Desc,"","",true);
	var toolTip;
	if (emssObjInstance.emssObj.filterSelect)
	{
		toolTip = dmeFieldToolTip("job_category");
		MakeTextBox("CategoryFilterSelect", 500, 275, 105, 25, "CategoryFilterSelect_ExploreCareers", true, 30, "", 'styler="select" styler_click="parent.CategoryFilterSelectArrow_OnClick"', getSeaPhrase("CM_28","CM"));
		MakeButton('<img style="cursor:hand;cursor:pointer" border="0" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" alt="'+toolTip+'" title="'+toolTip+'">', 595, 275, 12, 16,
			WindowColor, "CategoryFilterSelectArrow", true, getSeaPhrase("CM_185","CM"), true, 'styler="hidden"');
		var buttonObj = getLayerDocument("main", "CategoryFilterSelectArrowButton");	
		if (buttonObj != null)
			buttonObj.setAttribute("styler", "hidden");		
		Desc = '<span id="CategoryFilterSelectDesc" class="contenttextdisplayCM"></span>'
		createLayer("main","CategoryFilterSelectDesc_ExploreCareers",622,275,150,30,true,Desc,"","");	
	}
	else
		MakeSelectBox("CategorySelect", 500, 275, 300, 50, "categoryselect", JobClass, true, _JOBCATEGORYINDEX, true, getSeaPhrase("CM_28","CM"));
	MakeButton(getSeaPhrase("CM_350","CM"), 500, 307, "auto", 30, ButtonBorderColor, "createjoblist_ManagerExploreCareers", true);
	DrawJobListWindow_ExploreCareers(false, SelectValues);
}

function DrawQualCriteriaTab_ManagerExploreCareers(SelectValues)
{
	pObj = new CareerManagementWindowObject(Window3,"main", "Instructions_ManagerExploreCareers", 402,71,392,442, true, getSeaPhrase("CM_114","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.Draw();
	Desc = '<span class="contenttextCM">'+ getSeaPhrase("CM_351","CM")+'</span>'
	createLayer("main","QualCriteria_Instructions1",415,105,370,60,true,Desc,"","",true);
	var toolTip = getSeaPhrase("CM_352","CM");
	Desc = '<a class="contenttextCM" href="javascript:parent.Do_HS50_Call_EMPLOYEEPROFILE();" title="'+toolTip+'">'+getSeaPhrase("CM_352","CM")+'</a>'
	+'<br/><span class="contenttextCM" style="position:relative;top:5px">'+getSeaPhrase("CM_353","CM")+'</span>'
	createLayer("main","QualCriteria_Instructions2",415,200,370,70,true,Desc,"","",true);
	Desc = '<label class="contentlabelCM" for="cmbDirectReports">'+getSeaPhrase("CM_4","CM")+'</label>'
	createLayer("main","QualCriteria_DirectReportsLabel",415,157,200,25,true,Desc,"","");
	MakeSelectBox("DirectReports", 415, 175, 300, 25, "cmbDirectReports", SelectValues, true, _DIRECTREPORTSINDEX, true);
	DrawQualificationSelectBoxes("QualCriteria",QualCriteria_ExploreCareers,true,258);
	MakeButton(getSeaPhrase("CM_122","CM"), 610, 470, "auto", 30, ButtonBorderColor, "ClearForm_ExploreCareers", true);	
	MakeButton(getSeaPhrase("CM_123","CM"), 415, 470, "auto", 30, ButtonBorderColor, "qualcriteria_createjoblist_ManagerExploreCareers", true);
	DrawQualCriteriaTypeListWindow(false);
	DrawQualCriteriaCodeListWindow(false);
	DrawJobListWindow_ExploreCareers(false);
}

function createprofile_ManagerExploreCareers_OnClick()
{
	var SelectJobCode;
	var SelectedJobCode;
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
	var SelectReport = GetSelectFormObject("main", "DirectReports", "cmbDirectReports");
	var SelectedReport = SelectReport.options[SelectReport.selectedIndex].value;
	if ((NonSpace(SelectedJobCode) == 0) && SelectedReport == " ")
	{
		seaAlert(getSeaPhrase("CM_354","CM"), null, null, "error");
		return;
	}
	else if (SelectedReport == " ")
	{
		seaAlert(getSeaPhrase("CM_24","CM"), null, null, "error");
		return;
	}	
	else if (NonSpace(SelectedJobCode) == 0) 
	{
		seaAlert(getSeaPhrase("CM_355","CM"), null, null, "error");
		return;
	}	
	_EXPLOREPROFILETABSELECTED = 0;
	var ReportsCode = (DirectReports[_DIRECTREPORTSINDEX])?DirectReports[_DIRECTREPORTSINDEX].code:" ";
	showWaitAlert(getSeaPhrase("CM_155","CM"), function(){Do_HS50_Call(3,1," ",SelectedJobCode,"HS50.1","M_EXPLORECAREERS",ReportsCode);});
}

function createjoblist_ManagerExploreCareers_OnClick()
{
	var SelectJobClass;
	var SelectedJobClass;
	var SelectedJobClassIndex;
	if (emssObjInstance.emssObj.filterSelect)
	{
		SelectJobClass = GetTextBoxFormObject("main", "CategoryFilterSelect", "CategoryFilterSelect_ExploreCareers");
		SelectedJobClass = SelectJobClass.value;
		if (NonSpace(SelectedJobClass) == 0) 
		{
			seaAlert(getSeaPhrase("CM_34","CM"), null, null, "error");
			return;
		}	
	}
	else
	{	
		SelectJobClass = GetSelectFormObject("main", "CategorySelect", "categoryselect");
		SelectedJobClassIndex = SelectJobClass.selectedIndex;
		if (SelectedJobClassIndex == 0) 
		{
			seaAlert(getSeaPhrase("CM_34","CM"), null, null, "error");
			return;
		}
		if (!JobClass[SelectedJobClassIndex-1].Rel_jobcodes.length)
		{
			seaAlert(getSeaPhrase("CM_129","CM"), null, null, "alert");
			return;
		}
	}
	var nextFunc = function()
	{
		ShowExploreCareers(false, "Category", true);
		// display job list window for manager's selected job category
		if (emssObjInstance.emssObj.filterSelect)
		{
			var SelectJobClass = getLayerDocument("main", "CategoryFilterSelectDesc_ExploreCareers");
			var jobSpan = SelectJobClass.getElementsByTagName("SPAN");
			var CatDesc = getSeaPhrase("CM_130","CM");
			if (jobSpan.length > 0)
				CatDesc += " - "+jobSpan[0].innerHTML;
			_CURRENTJOBLISTDESC = CatDesc;
			Desc = '<span class="layertitleCM">'+_CURRENTJOBLISTDESC+"</span>";
			ChangeTitle("main", "JobList", Desc);		
		}
		else
		{		
			var CatDesc = JobClass[SelectedJobClassIndex-1].description;
			_CURRENTJOBLISTDESC = getSeaPhrase("CM_130","CM")+" - " + CatDesc;
			Desc = '<span class="layertitleCM">' + _CURRENTJOBLISTDESC + "</span>";
			ChangeTitle("main", "JobList", Desc);
			CategoryList = new Array();	
			for (var i=0; i<JobClass[SelectedJobClassIndex-1].Rel_jobcodes.length; i++)
			{
				CategoryList[i] = new SelectObject();
				CategoryList[i].code = JobClass[SelectedJobClassIndex-1].Rel_jobcodes[i].job_code;
				CategoryList[i].description = JobClass[SelectedJobClassIndex-1].Rel_jobcodes[i].description;
			}
			FillSelectBox("JobTitleSelect", "jobtitleselect", CategoryList, getSeaPhrase("CM_23","CM"));
		}
		ShowWin(false, "main", "Instructions_ManagerExploreCareers");	
		ShowJobList_ExploreCareers(true);
		removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
	};
	showWaitAlert(getSeaPhrase("CM_155","CM"), nextFunc);
}

function qualcriteria_createjoblist_ManagerExploreCareers_OnClick()
{
	var HS51Fields = new Array();
	var SelectReport = GetSelectFormObject("main", "DirectReports", "cmbDirectReports");
	var SelectedReport = SelectReport.options[SelectReport.selectedIndex].value;
	// go through criteria select boxes and only use the ones that are filled in
	for (var i=1; i<=QualCriteria_ExploreCareers.QualLabels.length; i++)
	{
		var QualBox = GetTextBoxFormObject("main", "QualCriteria"+i, "qualcriteria"+i);
		var QualBoxType = QualCriteria_ExploreCareers.QualTypes[i-1];
		var QualBoxCode = QualCriteria_ExploreCareers.QualCodes[i-1];
		if (NonSpace(QualBox.value) != 0 && NonSpace(QualBoxType) != 0 && NonSpace(QualBoxCode) != 0)
		{
			// use this criteria when making hs51.1 call to generate a job list
			HS51Fields[HS51Fields.length] = new Object();
			HS51Fields[HS51Fields.length-1].type = QualBoxType; 
			HS51Fields[HS51Fields.length-1].code = QualBoxCode;
			HS51Fields[HS51Fields.length-1].seqnbr = null; 
		}		
		if (NonSpace(QualBox.value) == 0 && (NonSpace(QualBoxType) != 0 || NonSpace(QualBoxCode) != 0))
		{
			replaceContent("main", "QualCriteriaLabel"+i, "");
			QualCriteria_ExploreCareers.QualLabels[i-1] = "";
			QualCriteria_ExploreCareers.QualTypes[i-1] = "";
			QualCriteria_ExploreCareers.QualCodes[i-1] = "";
			QualCriteria_ExploreCareers.QualDescs[i-1] = "";
		}
	}
	if (SelectedReport == " ")
	{
		seaAlert(getSeaPhrase("CM_24","CM"), null, null, "error");
		return;
	}
	else
	{
		QualificationJobList = new QualificationJobObject();
		var ReportCode = (DirectReports[SelectReport.selectedIndex-1])?DirectReports[SelectReport.selectedIndex-1].code:" ";
		showWaitAlert(getSeaPhrase("CM_155","CM"), function(){Do_HS51_Call(HS51Fields,ReportCode,"HS51.1");});
	}
}

function Do_HS50_1_Call_M_EXPLORECAREERS_Finished()
{
	if (self.lawheader.gmsgnbr != "000")
	{
		removeWaitAlert();
		seaAlert(self.lawheader.gmsg, null, null, "error");
		return;
	}
	if (CareerProfile.jobCompFlag != "Y" && CareerProfile.empCompFlag != "Y")
		seaPageMessage(getSeaPhrase("CM_356","CM"), null, null, "info", null, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
	else if (CareerProfile.jobCompFlag != "Y")
		seaPageMessage(getSeaPhrase("CM_357","CM"), null, null, "info", null, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
	else if (CareerProfile.empCompFlag != "Y")
		seaPageMessage(getSeaPhrase("CM_358","CM"), null, null, "info", null, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
	// display job profile window for mgr's selected job title
	var SelectedJobDesc = getSeaPhrase("CM_128","CM");
	switch(_EXPLORECURRENTWIN)
	{
		case "EXPLORECATEGORY":		
			if (emssObjInstance.emssObj.filterSelect)
			{
				var SelectJobCode = getLayerDocument("main", "JobTitleFilterSelectDesc_ExploreCareers");
				var jobSpan = SelectJobCode.getElementsByTagName("SPAN");
				if (jobSpan.length > 0)
					SelectedJobDesc += " - "+jobSpan[0].innerHTML;
			}
			else
			{
				var SelectJobCode = GetSelectFormObject("main", "JobTitleSelect", "jobtitleselect");
				var JobCodeSelectedIndex = SelectJobCode.selectedIndex;
				SelectedJobDesc += " - " + CategoryList[JobCodeSelectedIndex-1].description;
			}
			break;
		case "EXPLOREQUALCRITERIA":
			SelectedJobDesc += " - "+_JOBLISTDESC;
			break;
		default: // "EXPLOREJOBTITLE"	
			if (emssObjInstance.emssObj.filterSelect)
			{
				var SelectJobCode = getLayerDocument("main", "JobTitleFilterSelectDesc_ExploreCareers");
				var jobSpan = SelectJobCode.getElementsByTagName("SPAN");
				if (jobSpan.length > 0)
					SelectedJobDesc += " - "+jobSpan[0].innerHTML;
			}
			else
			{		
				var SelectJobCode = GetSelectFormObject("main", "JobTitleSelect", "jobtitleselect");
				var JobCodeSelectedIndex = SelectJobCode.selectedIndex;
				SelectedJobDesc += " - " +JobCode[JobCodeSelectedIndex-1].description;
			}
			break;
	}
	RefreshJobProfileLink_MyJobProfile();
	_CURRENTPROFILEDESC = SelectedJobDesc;
	ShowJobProfileWin(true,"main");
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
}

/*
 *	Training Options Tab
 */
function DrawTrainingOptionsWindows()
{
	switch(_TRAINCURRENTWIN)
	{
		case "TRAININGCATEGORY": DrawTrainingWindowsTabs(false, 0, true); break;
		case "TRAININGQUALIFICATIONCRITERIA": DrawTrainingWindowsTabs(false, 1, true); break;
		case "TRAININGJOBGAPS": DrawTrainingWindowsTabs(false, 2, true); break;
	}
	DrawTrainingGapTabs(false, 0, false);
	DrawCourseDetailTabs(false, 0, false, "TrainingOptions", false);
	DrawInstructions_TrainingOptions(true);
	DrawTrainingGaps_TrainingOptions();
	DrawCourseDetail_Manager("TrainingOptions");
	DrawTrainingQualCriteriaTypeList();
	DrawTrainingQualCriteriaCodeList();
	DrawCourses_TrainingOptions();
	ShowCourseDetail(false,"TrainingOptions");
	ShowCourses_TrainingOptions(false);
	var reDrawFlag = false;
	switch (_TRAINCURRENTWIN)
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

function Do_HS50_1_Call_M_TRAININGOPTIONS_Finished()
{
	OpenProgram(4);
}
