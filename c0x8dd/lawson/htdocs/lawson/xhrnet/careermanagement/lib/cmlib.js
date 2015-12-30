// Version: 8-)@(#)@10.00.05.00.27
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/careermanagement/lib/Attic/cmlib.js,v 1.1.2.82.2.4 2014/07/18 03:25:37 kevinct Exp $
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
 *	Common Functions and Objects
 */

function JobDetailObject()
{
	this.company = null;
	this.jobCode = null;
	this.position = null;
	this.Detail = new Array();
}

function JobDetailDetailObject()
{
	this.type = null
	this.persCode = null
	this.description = null
	this.requiredFlag = null
	this.pctOfTime = null
}
	
function CareerProfileObject()
{
	this.detailMax = null
	this.company = null
	this.employee = null
	this.requestor = null
	this.essential = null
	this.empProfile = null
	this.expireDays = null
	this.jobCompFlag = null
	this.empCompFlag = null
	this.jobDetailFlag = null
	this.jobDescFlag = null
	this.posDetailFlag = null
	this.position = null
	this.posDesc = null
	this.jobCode = null
	this.jbcDesc = null
	this.courseGapFlag = null
	this.courseCount = null
	this.CompetencyDetail = new Array();
	this.CertificationDetail = new Array();
	this.EducationDetail = new Array();
	this.NextReviewDate = null;
	this.MinGrph = null;
	this.MaxGrph = null;
}

function QualificationJobObject()
{
	this.qualMax = null
	this.company = null
	this.employee = null
	this.jobEssential = null
	this.Detail = new Array();
}

function QualificationJobDetailObject()
{
	this.qualType = null
	this.qualCode = null
	this.qualProfic = null
	this.JobDescs = new Array();
}

function QualificationJobDescObject()
{
	this.jobCode = null
	this.description = null
}

function DetailObject()
{
	this.sort = null
	this.weight = null
	this.type = null
	this.code = null
	this.subject = null
	this.description = null
	this.essentialReq = null
	this.empHasCode = null
	this.updateFlag = null
	this.jobProfic = null
	this.empProfic = null
	this.empProficDesc = null
	this.gap = null
	this.gapLevel = null
	this.seqNbr = null
	this.renewDate = null
	this.EprfGrph = null;
	this.JprfGrph = null;
}

function CodeDescObject(code, description, type, webavail)
{
	this.code = code;
	this.description = description;
	this.type = (typeof(type)!="undefined")?type:null;
	this.webavail = (typeof(webavail)!="undefined")?webavail:1;
}

function TrainingCoursesObject()
{
	this.sort = null
	this.courseNumber = null
	this.courseCode = null
	this.courseDescription = null;
 	this.sessionFlag = null;
 	this.preRequisitesFlag = null;
 	this.session = null;
    this.sessionStartDate = null;
    this.preRequisitesType = null;
    this.preRequisite = null;
    this.preRequisiteCompany = null;
    this.seq = null  
    this.ptseqnbr = null;
   	this.ptsort=null;
   	this.ptCourseDesc=null;
   	this.ptCourseNumber=null;
   	this.ptCourse=null;
}

function TrainingSummaryObject()
{
	this.Course = new TrainingCoursesObject()
	this.Prereqs = new Array()
	this.Sessions = new Array()
}

function JobInterestsObject()
{
	this.jobCode = null
	this.jobDesc = null
}

function SessionsObj(Session, SessionStartDate)
{
	this.session = Session
	this.sessionStartDate = SessionStartDate;
}

function PrerequisitesObj(PreReqType, PreReq)
{
	this.preReqType = PreReqType;
	this.preReq = PreReq
}

function JobOpeningsWindowInformationObject(Description, Location, Department, Requistion, ProcessLevel, 
	Openings, Supervisor, WorkSchedule, Contact, PhoneNbr, PhoneExt, Code, Position, RecruitFlag)
{
	this.position = Position
	this.code = Code
	this.description = Description;
	this.location = Location;
	this.department = Department;
	this.requisition = Requistion;
	this.processlevel = ProcessLevel;
	this.openings = Openings;
	this.supervisor = Supervisor;
	this.workschedule = WorkSchedule;
	this.contact = Contact;
	this.phonenbr = PhoneNbr;
	this.phoneext = PhoneExt;
	this.recruitflag = RecruitFlag;
}

function JobAlertObject(JobCode, Position, Description, Requisition, ReqDescription, ReqClosedDate)
{
	this.code = JobCode;
	this.position = Position;
	this.description = Description;
	this.requisition = Requisition;
	this.req_description = ReqDescription;
	this.req_closed_date = ReqClosedDate;
}

function JobAppliedForObject(Requisition, Description, DateHired)
{
	this.requistion = Requisition;
	this.description = Description;
	this.dateHired = DateHired;
}

function DirectReportsObject()
{
	this.employee = null;
	this.full_name = null;
}	

function CoursePrerequisitesDetailObject()
{
	this.Type = null;
	this.Prerequisite = null;
	this.CourseDescription = null;
	this.CompDescription = null;
	this.GroupDescription = null;
	this.Description = null;
	this.Required = null;
	this.FromDate = null;
	this.Length = null;
	this.Eligible = null;
	this.MinimumProficiency	= null;
	this.DateMeasure = null;
	this.Company = null;
	this.CompanyName = null;
}

function CoursePrerequisitesObject()
{
	this.Course	= null;
	this.EffectDate	= null;
	this.CourseDesc	= null;
	this.Detail	= new Array();
}

function GroupProfileObject()
{
	this.EmployeeCount = null;
	this.DetailMax = null;
	this.Company = null;
	this.Manager = null;
	this.JobCode = null;
	this.JobDescription = null;
	this.Essential = null;
	this.DirectReports = null;
	this.JobCompFlag = null;
	this.GapsExists = null;
	this.DetailCount = null;
	this.LastIndexUsed = null;
	this.SumMinProf = null;
	this.SumMaxProf = null;
	this.Detail = new Array(0);
	this.CompetencyDetail = new Array(0);
	this.CertificationDetail = new Array(0);
	this.EducationDetail = new Array(0);
}

function GroupProfileRecordObject()
{
	this.Qualification = new GroupProfileDetailObject()
	this.Employees = new Array(0);
}

function GroupProfileDetailObject()
{
	this.Sort = null;
	this.Employee = null;
	this.Description = null;
	this.Type = null;
	this.Code = null;
	this.JobProficiency = null;
	this.JobPGrph = null;
	this.EmployeeProficiency = null;
	this.QualMinProf = null;
	this.SummaryProfile = false;
	this.Required = "N";
}

var DirectReports = new Array();
var StandardCareerProfileHash = new Array();
var JobProfileCareerProfileHash = new Array();
var JobProfileCareerProfile;
var StandardCareerProfile;
var QualificationJobList = new Array();
var DMECALLED = false;
var DMEFUNC = "";
var _CURRENTTAB = "ACTIONPLAN";
var authUser = null;
var appObj;
var parentTask = "";
var fromTask = (window.location.search)?unescape(window.location.search):"";
var loadedFromParentTask = false;

if (fromTask)
	parentTask = getVarFromString("from", fromTask);

function deleteHashItem(hashArray, hashKey)
{
	if (hashArray[hashKey])
	{
		try 
		{
			delete hashArray[hashKey];
		} 
		catch(e) 
		{
			try { hashArray[hashKey] = null; } catch(e) {}
		}
	}	
}

function autoSelectDirectReport() 
{
	if (!loadedFromParentTask && (typeof(parentTask) != "undefined") && ((parentTask == "goalmgmt") || (parentTask == "perfmgmt"))) 
	{
		loadedFromParentTask = true;
		var reportSelect = (parentTask == "goalmgmt") ? opener.directReport : opener.reportSelect;
		var FormObj = GetSelectFormObject("main", "DirectReports", "cmbDirectReports");
		if (typeof(FormObj) != 'undefined' && FormObj != null && FormObj.selectedIndex < 1) 
		{
			if (FormObj.selectedIndex != reportSelect.selectedIndex) 
			{
				FormObj.selectedIndex = reportSelect.selectedIndex;
				_DIRECTREPORTSINDEX = FormObj.selectedIndex - 1;
				cmbDirectReports_OnChange();
			}
		}
	}
}

function initEmployeeRelatedBookmarkLinks() 
{
	if ((typeof(relatedBookmarkLinks) != "undefined") && (relatedBookmarkLinks.length > 0))
		return;
	relatedBookmarkLinks = new Array();
   	if ((typeof(authUser) != "undefined") && authUser.OfficeObject) 
   	{
		var bkmks = authUser.OfficeObject;
		var foundBkmk = new Array();
		var i = 0;
		var done = false;
		while ((i < authUser.NbrOfOfficeObj) && (!done))
		{
			var bkName = bkmks[i].name.toUpperCase(); // the Lawson-assigned task
			var bkLawName = (bkmks[i].lawnm) ? bkmks[i].lawnm.toUpperCase() : "";	// the Lawson-assigned Lawson name
			var bkUrl = bkmks[i].url;
			if ((!foundBkmk[bkName]) && (((bkName == "GOALVIEW") && (bkUrl.indexOf("employee") >= 0)) || (bkLawName == "XMLHREMPGOALMGMT"))) 
			{
				foundBkmk[bkName] = true;
				// grant access to this bookmark
				relatedBookmarkLinks[relatedBookmarkLinks.length] = bkmks[i];
				done = true;	
			}
			i++;
		}
	}
	if (relatedBookmarkLinks.length > 0)
		relatedBookmarkLinks.sort(sortByBkmkName);
}

function initManagerRelatedBookmarkLinks() 
{
	if ((typeof(relatedBookmarkLinks) != "undefined") && (relatedBookmarkLinks.length > 0))
		return;
	relatedBookmarkLinks = new Array();
   	if ((typeof(authUser) != "undefined") && authUser.OfficeObject) 
   	{
		var bkmks = authUser.OfficeObject;
		var foundBkmk = new Array();
		var i = 0;
		var done = false;
		while ((i < authUser.NbrOfOfficeObj) && (!done))
		{
			var bkName = bkmks[i].name.toUpperCase(); // the Lawson-assigned task
			var bkLawName = (bkmks[i].lawnm) ? bkmks[i].lawnm.toUpperCase() : "";	// the Lawson-assigned Lawson name
			var bkUrl = bkmks[i].url;
			if ((!foundBkmk[bkName]) && ((((bkName == "GOALVIEW") && (bkUrl.indexOf("manager") >= 0)) || (bkLawName == "XMLHRMGRGOALMGMT"))
			|| ((bkName == "PERFORMANCE MANAGEMENT") || (bkLawName == "XMLHRMGRPERFMGMT"))
			|| ((bkName.indexOf("TALENTVIEW") >= 0) || (bkLawName == "XMLHRMGRTALENTVIEW")))) 
			{
				foundBkmk[bkName] = true;
				// grant access to this bookmark
				relatedBookmarkLinks[relatedBookmarkLinks.length] = bkmks[i];
				if ((bkName.indexOf("TALENTVIEW") >= 0) || (bkLawName == "XMLHRMGRTALENTVIEW"))
					relatedBookmarkLinks[relatedBookmarkLinks.length-1].name = getSeaPhrase("CM_TALENTVIEW", "CM");
				if (relatedBookmarkLinks.length == 3)
					done = true;
			}
			i++;
		}
	}
	if (relatedBookmarkLinks.length > 0)
		relatedBookmarkLinks.sort(sortByBkmkName);
}

function sortByBkmkName(obj1, obj2) 
{
	var name1 = obj1.name;
	var name2 = obj2.name;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function launchRelatedBookmarkLink(i) 
{
	if ((typeof(relatedBookmarkLinks) != "undefined") && (i < relatedBookmarkLinks.length)) 
	{	
		var tUrl = relatedBookmarkLinks[i].url;
		var tName = relatedBookmarkLinks[i].name.toUpperCase();
		var tLawnm = (relatedBookmarkLinks[i].lawnm) ? relatedBookmarkLinks[i].lawnm.toUpperCase() : "";
		if ((tName.indexOf("TALENTVIEW") == -1) && (tLawnm != "XMLHRMGRTALENTVIEW")) 
		{
			if (tUrl.indexOf("?") >= 0)
				tUrl += "&from=careermgmt";
			else
				tUrl += "?from=careermgmt";
		}
		var tmpWidth = 850;
		var tmpHeight = 650;
		if (document.body.clientHeight)
		{
			tmpHeight = document.body.clientHeight;
			tmpWidth = document.body.clientWidth;
		}
		else if (window.innerHeight)
		{
			tmpHeight = window.innerHeight;
			tmpWidth = window.innerWidth;
		}	
		if (tmpHeight < 650)
			tmpHeight = 650;
		if (tmpWidth < 850)
			tmpWidth = 850;		
		window.open(tUrl, tLawnm, "width=" + tmpWidth + ",height=" + tmpHeight + ",resizable=yes");		
	}
}

function GetRelatedBookmarkLinksContent() 
{
	var strBuffer = new Array();
	strBuffer[0] = '<table border="0" cellspacing="0" cellpadding="0" width="100%" role="presentation">'
	if (relatedBookmarkLinks.length > 0) 
	{
		for (var i=0; i<relatedBookmarkLinks.length; i++) 
		{
			var toolTip = relatedBookmarkLinks[i].name+' - '+getSeaPhrase("OPEN_LINK_TO","SEA")+' '+getSeaPhrase("OPENS_WIN","SEA");
			strBuffer[i+1] = '<tr><td class="contenttextCM">'
			+ '<a href="javascript:;" onclick="parent.launchRelatedBookmarkLink('+i+');" title="'+toolTip+'" aria-haspopup="true">'+relatedBookmarkLinks[i].name+'<span class="offscreen"> - '+getSeaPhrase("OPEN_LINK_TO","SEA")+' '+getSeaPhrase("OPENS_WIN","SEA")+'</span></a></td></tr>';
		}
	} 
	else
		strBuffer[1] = '<tr><td class="contenttextCM">'+getSeaPhrase("CM_NO_RELATED_LINK_ACCESS", "CM")+'</td></tr>';
	strBuffer[strBuffer.length] = '</table>';
	return strBuffer.join("");
}

function DrawRelatedBookmarkLinks()
{
	var pObj = new CareerManagementWindowObject(Window2,"main", "RelatedBookmarkLinks", 2,515,395,115, false, getSeaPhrase("CM_107","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.WindowInformation = GetRelatedBookmarkLinksContent();
	pObj.Draw();
	pObj.DrawView(10,548,375,75);
}

function ShowRelatedBookmarkLinks(nCmd)
{
	ShowWin(nCmd, "main", "RelatedBookmarkLinks", true, false, false);
}

function EnableButton(ButtonName, nCmd)
{
	if (nCmd)	
		showLayer("main", ButtonName+"Button");
	else		
		hideLayer("main", ButtonName+"Button");
}

function MakeButton(Label, Left, Top, Width, Height, BorderColor, ButtonName, Visible, Flyby, isImage, AttrStr)
{
	if (typeof(Flyby) == "undefined" || Flyby == null)
		Flyby = "";
	if (typeof(AttrStr) == "undefined" || AttrStr == null)
		AttrStr = "";
	if (typeof(Width) == "undefined" || Width == null)
		Width = "auto";
	if (typeof(Height) == "undefined" || Height == null)
		Height = "auto";	
	Flyby = Flyby || Label;
	var Desc;
	if (isImage)
	{
		Desc = '<div role="button" title="'+Flyby+'" aria-label="'+Flyby+'" onclick="javascript:parent.'+ButtonName+'_OnClick()"'
		Desc += (AttrStr) ? ' '+AttrStr:''
		Desc += '>'+Label+'</div>'
	}
	else
	{
		Desc = '<button class="buttonCM" type="button" role="button" title="'+Flyby+'" aria-label="'+Flyby+'" onclick="javascript:parent.'+ButtonName+'_OnClick()"'
	    Desc += (AttrStr) ? ' '+AttrStr:''
	    Desc += '>'+Label+'</button>'
	}
	createLayer("main",ButtonName+"Button",Left,Top,Width,Height,Visible,Desc,"","");
}

function MakeButtonCM(Label, Left, Top, Width, Height, BorderColor, ButtonName, Visible, Flyby, isImage)
{
	if (typeof(Flyby) == "undefined" || Flyby == null)
		Flyby = "";
	if (typeof(Width) == "undefined" || Width == null)
		Width = "auto";
	if (typeof(Height) == "undefined" || Height == null)
		Height = "auto";
	Flyby = Flyby || Label;
	var Desc;
	if (isImage)
		Desc = '<div role="button" title="'+Flyby+'" aria-label="'+Flyby+'" onclick="javascript:parent.'+ButtonName+'_OnClick()">'+Label+'</div>'
	else
	    Desc = '<button class="button2CM" type="button" role="button" title="'+Flyby+'" aria-label="'+Flyby+'" onclick="javascript:parent.'+ButtonName+'_OnClick()">'+Label+'</button>'
	buttonLayer("main",ButtonName+"Button",Left,Top,Width,Height,Visible,Desc,"","");
}

function MakeSelectBox(Label, Left, Top, Width, Height, SelectName, SelectValues, Visible, SelectedIndex, OnChangeFlag, OffScreenLabel)
{
	if (arguments.length > 9 && arguments[9] != "")
		var onChangeFunc = "parent."+SelectName+"_OnChange('"+SelectName+"');"
	else
		var onChangeFunc = "";
	if (typeof(SelectedIndex) == "undefined" || SelectedIndex == null)	SelectedIndex = -1;
	var Desc = '<form name="'+Label+'" onsubmit="return false">'
	if (OffScreenLabel)
		Desc += '<label class="offscreen" for="'+SelectName+'">'+OffScreenLabel+'</label>'	
	Desc += '<select class="contenttextCM" id="'+SelectName+'" name="'+SelectName+'" onchange="'+onChangeFunc+'">'
	Desc += '<option value=" "'
	Desc += (SelectedIndex == -1)?' selected':''
	Desc += '> '
	if (typeof(SelectValues) != "undefined" && SelectValues != null)
	{
		for (var i=0;i<SelectValues.length;i++)
		{
			Desc += '<option value="'+SelectValues[i].code+'"'
			Desc += (SelectedIndex == i)?' selected':''
			Desc += '>'+SelectValues[i].description
		}
	}
	Desc += '</select></form>'
	createLayer("main",SelectName+"Select",Left,Top,Width,Height,Visible,Desc,"","");
}

function MakeTextBox(Label, Left, Top, Width, Height, TextName, Visible, Size, Value, AttrStr, OffScreenLabel)
{
	var Desc = '<form name="'+Label+'" onsubmit="return false">'
	if (OffScreenLabel)
		Desc += '<label class="offscreen" for="'+TextName+'">'+OffScreenLabel+'</label>'
	Desc += '<input class="contenttextCM" style="width:'+(Width-30)+'px !important;max-width:'+(Width-25)+'px !important" type="text" id="'+TextName+'" name="'+TextName+'" maxlength="'+parseInt(Size,10)+'"'
	Desc += (typeof(Value) != "undefined" && Value != null)?' value="'+Value+'"':''
	Desc += (AttrStr) ? ' ' + AttrStr : ''
	Desc += '></form>'
	createLayer("main",TextName+"TextBox",Left,Top,Width,Height,Visible,Desc,"","");
}

function CareerManagementWindowObject(WindowBackground, FrameLocation, WindowName, Left, Top, Width, Height, Visible, Title, scrollFlag)
{
	this.WindowBackground = WindowBackground;
	this.FrameLocation = FrameLocation
	this.WindowName = WindowName
	this.Left = Left
	this.Top = Top
	this.Width = Width
	this.Height = Height
	this.Visible = Visible
	this.Title = Title
	this.scrollFlag = scrollFlag;
	this.Draw = DrawWindow;
	this.DrawTabbed = DrawTabbedWindow;
	this.Replace = ReplaceWindow;
	this.ReplaceTabbed = ReplaceTabbedWindow;
	this.FontStyle = null;
	this.TabObject = null;
	this.ReplaceFlag = false;
	this.ApplyWindow = false;
	this.WindowInformation = "";
	this.WindowColor = "#FFFFFF";
	this.DrawView = DrawInternalView;
	this.AddCloseIcon = false;
	this.CloseIconLocationLeft = this.Left + 20;
	this.CloseIconLocationTop = this.Top;
	this.Detail = false;
	this.GroupBox = true;
}

function DrawWindow()
{
	if (this.ReplaceFlag)
		this.Replace();
	else
	{
		var Desc = '<div class="panewrapperCM"><table class="panewrapperCM" cellpadding="0" cellspacing="0" width="100%" role="presentation">'
		+ '<tr><td class="panepaddingCM">'
		if (this.Detail)
			Desc += '<div class="panebackgroundliteCM">'
		else
			Desc += '<div class="panebackgroundCM">'
		var contentHeight = null;
		try
		{
			if (typeof(window["styler"]) == "undefined" || window.styler == null)
				window.stylerWnd = findStyler(true);
			if (typeof(window.stylerWnd["StylerEMSS"]) == "function")
				window.styler = new window.stylerWnd.StylerEMSS();
			else
				window.styler = window.stylerWnd.styler;
			window.theme = window.stylerWnd.theme;
			if (window.theme == "10")
				contentHeight = this.Height - 5;
			if (window.theme == "8")
				contentHeight = this.Height - 32;			
		}
		catch(e) 
		{
			window.styler = null;
			window.theme = null;
		}
		var browser = new SEABrowser();
		Desc += '<table class="paneouterborderCM"'
		if (browser.isIE && contentHeight != null)
			Desc += 'style="height:auto"'
		Desc += ' cellpadding="0" cellspacing="0" width="100%" role="presentation"><tr><td class="paneframeCM"'
		if (browser.isIE && contentHeight != null)	
			Desc += 'style="height:'+contentHeight+'px"'
		Desc += '><div class="paneinnerborderCM" '+((this.GroupBox)?'styler="groupbox"':'')+'></div>'
		+ '</td></tr></table>'
		+ '</div></td></tr></table></div>'
		createLayer(this.FrameLocation,this.WindowName+"Layer",this.Left,this.Top,this.Width,this.Height,this.Visible,Desc,"","");
		// ui change
		// Desc = '<font style="'+this.FontStyle+'">'+this.Title+'</font>'
		Desc = '<span class="layertitleCM">'+this.Title+'</span>'
		// createLayer(this.FrameLocation,this.WindowName+"Title",this.Left+12,this.Top+9,this.Width,20,this.Visible,Desc,"","");
		var titlewidth = this.Width - 8 - 40
		if (this.AddCloseIcon)
			titlewidth -= 20
		createLayer(this.FrameLocation,this.WindowName+"Title",this.Left+12,this.Top+9,titlewidth,20,this.Visible,Desc,"","",false);
		if (this.ApplyWindow)
			MakeWindow(this.FrameLocation,this.WindowName+"Window","",this.Left+13,this.Top+80,this.Width-30,this.Height-100,this.Visible,this.WindowInformation,false,true,true,false,false,"color","003366","color",this.WindowColor,410,"PGCONTROL",0,0)
		if (this.AddCloseIcon)
		{
			Desc = '<a href="javascript:;" onclick="parent.'+this.WindowName+'_XIconClicked();return false;" title="'+getSeaPhrase("CLOSE_WIN","SEA")+'" aria-label="'+getSeaPhrase("CLOSE_WIN","SEA")+'">'
			Desc += '<img name="xIcon" src="'+XIconOut+'" border="0" alt="'+getSeaPhrase("CM_CLOSE","CM")+'" title="'+getSeaPhrase("CM_CLOSE","CM")+'" '
			Desc += 'onmouseover="this.src=\''+XIconOver+'\';return true;" onfocus="this.src=\''+XIconOver+'\';return true;" onmousedown="this.src=\''+XIconActive+'\';return true;" onkeydown="this.src=\''+XIconActive+'\';return true;" onmouseout="this.src=\''+XIconOut+'\';return true;" onblur="this.src=\''+XIconOut+'\';return true;"></a>'
			// createLayer(this.FrameLocation,this.WindowName+"X",this.CloseIconLocationLeft,this.CloseIconLocationTop,20,20,this.Visible,Desc,"","");
			var iconleft = this.Left+this.Width - 8 - 20
			var icontop = this.Top + 7
			createLayer(this.FrameLocation,this.WindowName+"X",iconleft,icontop,20,20,this.Visible,Desc,"","");
		}
	}
}

function ChangeTitle(FrameLoc, WinName, Title)
{
	replaceContent(FrameLoc, WinName + "Title", Title);
}

function DrawInternalView(Left, Top, Width, Height)
{
	if (typeof(this.scrollFlag)!="boolean")
		MakeWindow(this.FrameLocation,this.WindowName+"Window","",Left,Top,Width,Height,this.Visible,this.WindowInformation,false,true,true,false,false,"color",this.WindowColor,"color",this.WindowColor,LayerObject.length,"PGCONTROL",0,0)
	else
		MakeWindow(this.FrameLocation,this.WindowName+"Window","",Left,Top,Width,Height,this.Visible,this.WindowInformation,false,this.scrollFlag,true,false,false,"color",this.WindowColor,"color",this.WindowColor,LayerObject.length,"PGCONTROL",0,0)
}

function DrawTabbedWindow(TabDesc)
{
	if (this.ReplaceFlag)
		this.ReplaceTabbed(TabDesc);
	else
	{
		var contentHeight = this.Height - 5; 
		try
		{
			if (typeof(window["styler"]) == "undefined" || window.styler == null)
				window.stylerWnd = findStyler(true);
			if (typeof(window.stylerWnd["StylerEMSS"]) == "function")
				window.styler = new window.stylerWnd.StylerEMSS();
			else
				window.styler = window.stylerWnd.styler;
			window.theme = window.stylerWnd.theme;
			if (window.theme == "10")
				contentHeight = this.Height - 5;
			if (window.theme == "8")
				contentHeight = this.Height - 32;
		}
		catch(e) 
		{
			window.styler = null;
			window.theme = null;
		}	
		var browser = new SEABrowser();	
		var Desc = '<div class="panewrapperCM"><table class="panewrapperCM"'
		if (browser.isIE && contentHeight != null)
			Desc += 'style="height:auto"'		
		Desc += ' cellpadding="0" cellspacing="0" role="presentation"><tr><td class="panepaddingCM">'
		+ '<div class="panebackgroundCM">'
		+ '<table class="paneouterborderCM" cellpadding="0" cellspacing="0" role="presentation"><tr><td class="paneframeCM"'
		if (browser.isIE && contentHeight != null)	
			Desc += 'style="height:'+contentHeight+'px"'			
		Desc += '><div class="paneinnerborderCM" styler="groupbox"></div>'
		+ '</td></tr></table>'
		+ '</div></td></tr></table></div>'
		createLayer(this.FrameLocation,this.WindowName+"Layer",this.Left,this.Top,this.Width,this.Height,this.Visible,Desc,"","");
		Desc = '<span class="layertitleCM">'+this.Title+'</span>'
		var titlewidth = this.Width - 8 - 20
		if (this.AddCloseIcon)
			titlewidth -= 20
		createLayer(this.FrameLocation,this.WindowName+"Title",this.Left+12,this.Top+7,titlewidth,20,this.Visible,Desc,"","",false);
		Desc = this.TabObject.Draw(this.TabObject.bgColorTabUp);
		createLayer(this.FrameLocation,this.WindowName+"Tabs",this.Left+4,this.Top+29,this.Width-8,this.Height-42,this.Visible,Desc,"","");
		if (this.ApplyWindow)
			MakeWindow(this.FrameLocation,this.WindowName+"Window","",this.Left+13,this.Top+32,this.Width-16,this.Height-45,this.Visible,this.WindowInformation,false,true,true,false,false,"color","003366","color",this.WindowColor,410,"PGCONTROL",0,0)
		if (this.AddCloseIcon)
		{
			Desc = '<a href="javascript:;" onclick="parent.'+this.WindowName+'_XIconClicked();return false;" title="'+getSeaPhrase("CLOSE_WIN","SEA")+'" aria-label="'+getSeaPhrase("CLOSE_WIN","SEA")+'">'
			Desc += '<img name="xIcon" src="'+XIconOut+'" border="0" alt="'+getSeaPhrase("CM_CLOSE","CM")+'" title="'+getSeaPhrase("CM_CLOSE","CM")+'" '
			Desc += 'onmouseover="this.src=\''+XIconOver+'\';return true;" onfocus="this.src=\''+XIconOver+'\';return true;" onmousedown="this.src=\''+XIconActive+'\';return true;" onkeydown="this.src=\''+XIconActive+'\';return true;" '
			Desc += 'onmouseout="this.src=\''+XIconOut+'\';return true;" onblur="this.src=\''+XIconOut+'\';return true;"></a>'
			// createLayer(this.FrameLocation,this.WindowName+"X",this.CloseIconLocationLeft,this.CloseIconLocationTop,20,20,this.Visible,Desc,"","");
			var iconleft = this.Left+this.Width - 8 - 20
			var icontop = this.Top + 7
			createLayer(this.FrameLocation,this.WindowName+"X",iconleft,icontop,20,20,this.Visible,Desc,"","");
		}
	}
}

function ReplaceWindow()
{
	if (this.WindowBackground)
	{	
		var Desc = '<img src="'+this.WindowBackground+'" alt="" title=""/>'
		replaceContent(this.FrameLocation,this.WindowName+"Layer",Desc);
	};
	Desc = '<span class="layertitleCM">'+this.Title+'</span>'
	replaceContent(this.FrameLocation,this.WindowName+"Title",Desc);
}

function ReplaceTabbedWindow(TabDesc)
{
	var Desc = this.TabObject.Draw(this.TabObject.bgColorTabUp);
	replaceContent(this.FrameLocation,this.WindowName+"Tabs",Desc);
}

function ShowWin(lyFlag, FrameLocation, WindowName, wnFlag /*, xClose, xTabs */)
{
	var xClose = false;
	var xTabs = false;
	if (typeof(wnFlag) == "undefined")
		wnFlag = false;
	xClose = (arguments.length >= 5)? arguments[4]: false;
	xTabs = (arguments.length >= 6)? arguments[5]: false;
	var redirect = (lyFlag)? "showLayer" : "hideLayer";
	if (getLayerDocument(FrameLocation, WindowName+"Layer") != null)
		eval(redirect +'(FrameLocation, WindowName+"Layer")');
	if (getLayerDocument(FrameLocation, WindowName+"Title") != null)
		eval(redirect +'(FrameLocation, WindowName+"Title")');
	if (xTabs && getLayerDocument(FrameLocation, WindowName+"Tabs") != null)
		eval(redirect +'(FrameLocation, WindowName+"Tabs")');
	if (wnFlag && WindowIndex(FrameLocation,WindowName+"Window") != 999)
	{
		if (lyFlag)
			OpenLayerWindow(FrameLocation, WindowName+"Window");
		else
			CloseLayerWindow(FrameLocation, WindowName+"Window");
	}
	if (xClose && getLayerDocument(FrameLocation, WindowName+"X") != null)
		eval(redirect +'(FrameLocation, WindowName+"X")');
}

function setButtonCM(buttonName, visibility)
{
	main.document.getElementById(buttonName).style.visibility = visibility;
}

function displayButtonCM(buttonName, display)
{
	main.document.getElementById(buttonName).style.display = display;
}

function ShowButton(lyFlag, FrameLocation, WindowName)
{
	var redirect = (lyFlag)? "showLayer" : "hideLayer";
	if (getLayerDocument(FrameLocation, WindowName+"Button") != null)
		eval(redirect+'(FrameLocation, WindowName+"Button")');
}

function ShowSelect(lyFlag, FrameLocation, WindowName)
{
	if (lyFlag)
		showLayer(FrameLocation, WindowName+"Select");
	else
		hideLayer(FrameLocation, WindowName+"Select");
}

function ShowTextBox(lyFlag, FrameLocation, WindowName)
{
	if (lyFlag)
		showLayer(FrameLocation, WindowName+"TextBox");
	else
		hideLayer(FrameLocation, WindowName+"TextBox");
}

function BuildSelect(value, SelectType)
{
	if (!isNaN(value))
		value = parseFloat(value);
	var select = new Array()
	select[0] = '<option value=" ">'
	for (var i=0; i<eval(SelectType).length; i++)
	{
        select[i+1] = '<option value="' + eval(SelectType+"["+i+"]").code + '"'
		select[i+1] += (value == eval(SelectType+"["+i+"]").code)?' selected>':'>';
		select[i+1] += eval(SelectType+"["+i+"]").description
	}
	return select.join("")
}

function MatchForDescription(value, SelectType)
{
	for (var i = 0;i < eval(SelectType).length;i++)
	{
		if(value == eval(SelectType+"["+i+"]").code)
			return eval(SelectType+"["+i+"]").description
	}
	return "&nbsp;"
}

function BuildYesNo(value)
{
	select = '<option value="N" '
	select += (value == "N")? 'selected>' : '>';
	select += getSeaPhrase("CM_168","CM")+'<option value="Y" '
	select += (value == "Y")? 'selected>' : '>';
	select += getSeaPhrase("CM_169","CM")
	return select;
}

function StripTitle(title, length)
{
	if (title.length > length)
		title = title.substr(0, length)+"...";
	return title;
}

function ParseAGSValue(value, flag)
{
	return  (value == "")? escape(" ") :  (flag)? escapeEx(value) : escape(value);
}

function GetSelectFormObject(framename, formName, SelectName)
{
	var docName = SelectName + "Select";
	var docLoc = getDocLoc(framename);
	if (navigator.appName.indexOf("Microsoft")>=0 &&
		getDocLoc(framename).getElementsByName(SelectName).length==2)
		return getDocLoc(framename).getElementsByName(SelectName)[1]
	else
		return getDocLoc(framename).getElementsByName(SelectName)[0]
}

function GetTextBoxFormObject(framename, formName, TextBoxName)
{
	var docName = TextBoxName + "TextBox";
	var docLoc = getDocLoc(framename);
	if (navigator.appName.indexOf("Microsoft")>=0 && getDocLoc(framename).getElementsByName(TextBoxName).length==2)
	{	
		// IE matches elements' name with no case sensitivity
		// for example
		// name QualCriteria2 is used for the form
		// name qualcriteria2 is used for the input in that form
		// however we need to get the input object
		return getDocLoc(framename).getElementsByName(TextBoxName)[1]
	}	
	else
		return getDocLoc(framename).getElementsByName(TextBoxName)[0]
}

function GetFormObject(framename, formName, docName)
{
	return getDocLoc(framename).getElementsByName(formName)[0]
}

function GetFormFromStansWindowLayer(frameLocation, windowName, formName)
{
	return getDocLoc(frameLocation).getElementsByName(formName)[0]
}

function GetStansWindowLayer(frameLocation, windowName)
{
	var pFormObj = getLayer(frameLocation,WindowObject[WindowIndex(frameLocation, windowName)].BoxNm);
	return pFormObj;
}

function FillSelectBox(Label, SelectName, SelectValues, OffScreenLabel)
{
	var Desc = '<form name="'+Label+'">'
	if (OffScreenLabel)
		Desc += '<label class="offscreen" for="SelectName">'+OffScreenLabel+'</label>'
	Desc += '<select class="contenttextCM" id="'+SelectName+'" name="'+SelectName+'">'
	+ '<option value=" " selected>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
	+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
	for (var i=0; i<SelectValues.length; i++)
		Desc += '<option value="'+SelectValues[i].code+'">'+SelectValues[i].description
	Desc += '</select></form>'
	replaceContent("main",SelectName+"Select",Desc);
	// make sure the new select is styled properly
	var docLoc = getDocLoc("main");
	self.main.styleElement(docLoc.forms[Label].elements[SelectName]);
}

function ThrowOutCarriageReturns(str)
{
	var tmpStr = unescape(unescape(str.toString()));
	try
	{
		if (iosHandler.getEncoding())
			return tmpStr.toString().replace(/\n/g,"<br/>");
		else
			return tmpStr.toString().replace(/%0A/g, "<br/>").replace(/%0D/g, "<br/>");
	}
	catch(e)
	{
		return tmpStr.toString().replace(/%0A/g, "<br/>").replace(/%0D/g, "<br/>");
	}	
}

function PrintAttachment()
{
	var nextFunc = function()
	{
		var Desc = '<table style="width:500px" cellpadding="0" border="0" cellspacing="0" summary="'+getSeaPhrase("TSUM_1","CM")+'">'
		+ '<caption class="offscreen">'+getSeaPhrase("TCAP_1","CM")+'</caption>'
		+ '<tr><th scope="col" colspan="2"></th></tr>'
		+ '<tr><th scope="row" class="contenttextCM"><span class="contentlabelCM">'+getSeaPhrase("CM_108","CM")+'</span></th>';
		if (StandardCareerProfile.NextReviewDate == null || NonSpace(StandardCareerProfile.NextReviewDate) == 0)
			Desc += '<td class="contenttextCM">'+getSeaPhrase("CM_109","CM")+'</td></tr>';
		else
			Desc += '<td class="contenttextCM">'+FormatDte6(StandardCareerProfile.NextReviewDate)+'</td></tr>';
		if (Attachment != null && Attachment.CmtRec.length)
		{
			Desc += '<tr><th scope="row" class="contenttextCM"><span class="contentlabelCM">'+getSeaPhrase("CM_110","CM")+'</span></th><td class="contenttextCM">'+LastUpdated+'<br/>'+TimeUpdate+'</td></tr>'
			+ '<tr><th scope="row" class="contenttextCM"><span class="contentlabelCM">'+getSeaPhrase("CM_111","CM")+'</span></th><td class="contenttextCM">'
			+ unescape(unescape(Attachment.CmtRec[0].Title)).split('+').join(' ')
			+ '</td></tr>';
		}
		Desc += '</table><p/><div>';
		if (self.jsreturn.CmtRecordCnt)
			Desc += unescape(unescape(ThrowOutCarriageReturns(self.jsreturn.CommentData[0].join(""))));
		Desc += '</div>';
		setWinTitle(getSeaPhrase("CM_329","CM"), self.PGCONTROL);
		self.PGCONTROL.document.getElementById("paneBody").innerHTML = unescape(Desc);
		self.PGCONTROL.stylePage();
		self.PGCONTROL.document.body.style.overflow = "visible";
		self.PGCONTROL.document.getElementById("paneBody").style.overflow = "visible";
		self.PGCONTROL.document.getElementById("paneBorder").style.height = "auto";
		self.PGCONTROL.document.getElementById("paneBodyBorder").style.height = "auto";
		self.PGCONTROL.focus();
		self.PGCONTROL.print();
		removeWaitAlert();
	};
	showWaitAlert(getSeaPhrase("PREPARE_PRINT","SEA"), nextFunc);
}

function GetActionPlanAttachment(funcObj, Type, company, employee, useDefault)
{
	var Profile = (useDefault)?StandardCareerProfile:CareerProfile;
	switch (Type)
	{
		case "C":
			var pAttachObj = new GETATTACHObject(authUser.prodline,"EMPLOYEE");
			pAttachObj.index = "EMPSET1";
			pAttachObj.rectype = "C";	//Action Plan
			pAttachObj.key = "K1=" + escape(company) + "&K2=" + escape(employee);
			break;
		case "D":
			var pAttachObj = new GETATTACHObject(authUser.prodline,"JOBCODE");
			pAttachObj.index = "JBCSET1";
			pAttachObj.rectype = "U";	//Job Description
			pAttachObj.key = "K1=" + escape(company) + "&K2=" + escape(Profile.jobCode);
			pAttachObj.encode = "FALSE";
			break;
	}
	pAttachObj.out = "XML";
	pAttachObj.opm = "T";
	pAttachObj.data = "TRUE";
	pAttachObj.stat = "TRUE";
	pAttachObj.header = "TRUE";
	//pAttachObj.encode = "TEXT";
	pAttachObj.debug = false;
	pAttachObj.func = funcObj;
	GETATTACH(pAttachObj,"jsreturn");
}

function WriteActionPlanAttachment(Attachment, company, employee, title, body, fc, func, UserType)
{
	var pAttachObj = new WRITEATTACHObject(authUser.prodline,"EMPLOYEE");
	pAttachObj.out = "XML";
	pAttachObj.index = "EMPSET1";
	pAttachObj.key = "K1=" + escape(company)
	+ "&K2=" + escape(employee) + "&K3=1&K4=1";
	pAttachObj.rectype = "C";
	pAttachObj.title = escape(title,1); //ThrowOutCarriageReturns(escape(title,1));
	pAttachObj.body = escape(body,1); //ThrowOutCarriageReturns(escape(body,1))
	pAttachObj.usertype = UserType
	if (fc == "A")
		pAttachObj.opm = "M";
	else
	{
		pAttachObj.opm = fc;
		pAttachObj.reckey = escape(Attachment.CmtRec[0].RecKey,1);
		pAttachObj.seqkey = escape(Attachment.CmtRec[0].SeqKey,1);
	}
	pAttachObj.data	= "TRUE";
	//pAttachObj.encode = "TEXT";
	pAttachObj.debug = false;
	pAttachObj.func = "" + func;
	WRITEATTACH(pAttachObj,"jsreturn");
}

function IsValid(pObj)
{
	if (pObj == "undefined" || pObj == "null" || pObj == null || typeof(pObj) == "undefined" || !pObj)
		return false;
	else
		return true;
}

// These state functions are originally from /lawson/javascript/statesuscan.js.
var states = new Array("  ","AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
	"MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","PR","RI","SC","SD","TN","TX","UT","VT",
	"VA","VI","WA","WV","WI","WY","AB","BC","MB","NB","NF","NT","NS","ON","PE","QC","SK","YT");
var statenames = new Array(" ","Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Dist of Columbia","Florida","Georgia","Hawaii",
	"Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska",
	"Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Puerto Rico","Rhode Island",
	"South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Virgin Islands","Washington","West Virginia","Wisconsin","Wyoming","Alberta","British Columbia",
	"Manitoba","New Brunswick","Newfoundland","Northwest Territories","Nova Scotia","Ontario","Prince Edward Island","Quebec","Saskatchewan","Yukon Territory");

function BuildStateSelect(state, usonly)
{
	var stateselect = "";
	var j = states.length;
	if (usonly)
		j = 54;
	for (var i=0; i<j; i++)
	{
        stateselect += '<option value="'+states[i]+'"';
		if (state == states[i])
			stateselect += ' selected>';
		else
			stateselect += '>';
		stateselect += statenames[i];
	}
	return stateselect;
}

function ReturnStateDescription(code)
{
	for (var i=0; i<states.length; i++)
		if (states[i] == code) return statenames[i];
	return code;
}

function ReturnStateCode(description)
{
	for (var i=0; i<statenames.length; i++)
		if (statenames[i] == description) return states[i]
	return description
}

function escapeEx(arg)
{
	var browser = new SEABrowser();
	if (browser.isNS)
		return escape(arg,1);
	else
	{
		arg = escape(arg);
		return arg.replace(/\+/g,"%2B");
	}
}

function isEqual(ItemA, ItemB)
{
	if (typeof(ItemA) == "undefined" || ItemA == null || NonSpace(ItemA) == 0)
		ItemA = "";
	if (typeof(ItemB) == "undefined" || ItemB == null || NonSpace(ItemB) == 0)
		ItemB = "";
	if (!isNaN(parseFloat(ItemA))) ItemA = parseFloat(ItemA);
	if (!isNaN(parseFloat(ItemB))) ItemB = parseFloat(ItemB);
	if (ItemA == ItemB)
		return true;
	else 
		return false;
}

// Check to see if this employee/manager has an reports.
function ReportsExist()
{
	if (DirectReports.length == 0)
	{
		seaAlert(getSeaPhrase("CM_170","CM"), null, null, "error");
		if (opener)
			setTimeout("self.close()",2000);
		return false;
	}
	return true;
}

// Initialize these global tab values when a main tab is clicked.
function ResetTabValues()
{
	QualCriteria_ExploreCareers = new QualificationCriteriaSelectObject();
	QualCriteria_TrainingOptions = new QualificationCriteriaSelectObject();
	_CURRENTPROFILEDESC = getSeaPhrase("CM_128","CM");
	_CURRENTJOBLISTDESC = getSeaPhrase("CM_130","CM");
	_JOSTLISTDESC = "";
	_EXPLORECURRENTWIN = "EXPLOREJOBTITLE";
	_JCHARTTAB = 0;
	_JCHARTUSEDEFAULT = false;
	_EXPLOREPROFILETABSELECTED = 0;
	_REFRESHPROFILE = false;
	_REFRESHJOBLIST = false;
	_JOBCODEINDEX = -1;
	_JOBCATEGORYINDEX = -1;
	_JOBLISTINDEX = -1;
	_CURRENTQUALWINDESC = getSeaPhrase("CM_157","CM");
	_ADDINGQUALIFICATION = false;
	_TRAINCURRENTWIN = "TRAININGCATEGORY";
	_COURSECATEGORYINDEX = -1;
	_TRAINJOBGAPSTAB = 0;
	_TABSELECTED = -1;
	GapObj = new Array();
}

// Check if a parent or opener document has already done an authenticate, otherwise go get the webuser info.
function AuthenCM()
{
	if (parentTask == "")
		authenticate("frameNm='jsreturn'|funcNm='OpenProgram(0)'|officeObjects=true|desiredEdit='EM'");
	else
		authenticate("frameNm='jsreturn'|funcNm='OpenProgram(0)'|desiredEdit='EM'");
	return;
}

function ShowFilterList(isVisible)
{
	try 
	{
		if (isVisible)
			document.getElementById("filterList").style.visibility = "visible";
		else
		{
			document.getElementById("filterList").style.visibility = "hidden";
			// remove the list contents after hiding the list
			self.filterList.document.getElementById("paneBody").innerHTML = "";		
		}
	} catch(e) {}	
}

// Renewal Codes
var renewalCodes = new Array("  ","2Y","3Y", "4Y", "5Y", "6Y", "7Y", "8Y", "9Y", "AN", "QT", "SA");
var renewalNames = new Array(" ", getSeaPhrase("CM_267","CM"), getSeaPhrase("CM_268","CM"), getSeaPhrase("CM_269","CM"), getSeaPhrase("CM_270","CM"), getSeaPhrase("CM_271","CM"), 
	getSeaPhrase("CM_272","CM"), getSeaPhrase("CM_273","CM"), getSeaPhrase("CM_274","CM"), getSeaPhrase("CM_275","CM"), getSeaPhrase("CM_276","CM"), getSeaPhrase("CM_277","CM"));

function BuildRenewalSelect(value)
{
	var select = "";
	for (var i=0; i<renewalCodes.length; i++)
	{
        select += '<option value="'+renewalCodes[i]+'"';
		if (value == renewalCodes[i])
			select += ' selected>';
		else
			select += '>';
		select += renewalNames[i];
	}
	return select;
}

/*
 *	Transaction Functionality
 */
var HS50_3_Codes = new Array();
var HS50_3_employee = "";
function Do_HS50_Call(requestor, essential, profile, jobcode, program, window, employee, frameStr)
{
	if (typeof(program) == "undefined" || program == null)
		program = "HS50.1";
	if (typeof(frameStr) == "undefined" || frameStr == null)
		frameStr = "jsreturn";
	var programSafeStr = program.split(".").join("_");
	CareerProfile = new CareerProfileObject();
	self.lawheader.DetailLine = 0;
	self.lawheader.UpdateType = programSafeStr;
	var hAgsObj = new AGSObject(authUser.prodline, program);
	hAgsObj.event = "ADD";
	hAgsObj.rtn	= "DATA";
	hAgsObj.out	= "JAVASCRIPT";
	hAgsObj.longNames = "ALL";
	hAgsObj.tds	= false;
	hAgsObj.field = "FC=I"
	+ "&COMPANY=" + escapeEx(authUser.company)
	+ "&EMPLOYEE=" + escapeEx(employee);
	if (typeof(requestor) != "undefined" && requestor != null)				
		hAgsObj.field += "&REQUESTOR=" + escapeEx(requestor,1);
	if (typeof(essential) != "undefined" && essential != null)		
		hAgsObj.field += "&ESSENTIAL=" + escapeEx(essential,1);
	if (typeof(profile) != "undefined" && profile != null)		
		hAgsObj.field += "&EMP-PROFILE=" + escapeEx(profile,1);
	if (typeof(jobcode) != "undefined" && jobcode != null)		
		hAgsObj.field += "&JOB-CODE=" + escapeEx(jobcode,1);		
	if (typeof(window) != "undefined" && window != null)		
		hAgsObj.func = "parent.Do_"+programSafeStr+"_Call_"+window+"_Finished()";	
	else
		hAgsObj.func = "parent.Do_"+programSafeStr+"_Call_Finished()";
	hAgsObj.debug = false;
	AGS(hAgsObj,frameStr);
}

function Do_HS51_Call(Codes, employee, program, window)
{
	if (typeof(program) == "undefined" || program == null)
		program = "HS51.1";
	var programSafeStr = program.split(".").join("_");
	QualificationJobList = new QualificationJobObject();
	self.lawheader.DetailLine = 0;
	self.lawheader.DetailLine2 = 0;
	self.lawheader.UpdateType = programSafeStr;
	var hAgsObj = new AGSObject(authUser.prodline, program);
	hAgsObj.event = "ADD";
	hAgsObj.rtn	= "DATA";
	hAgsObj.out	= "JAVASCRIPT";
	hAgsObj.longNames = "ALL";
	hAgsObj.tds	= false;
	hAgsObj.field = "FC=I"
	+ "&COMPANY=" + escapeEx(authUser.company)
	+ "&EMPLOYEE=" + escapeEx(employee);
	for (var i=0;(i<Codes.length && i<6);i++)
	{
		hAgsObj.field += "&QUAL-TYPE"+(i+1)+"="+escapeEx(Codes[i].type,1)
		+ "&QUAL-CODE"+(i+1)+"="+escapeEx(Codes[i].code,1);
	}
	if (typeof(window) != "undefined" && window != null)		
		hAgsObj.func = "parent.Do_"+programSafeStr+"_Call_"+window+"_Finished()";	
	else
		hAgsObj.func = "parent.Do_"+programSafeStr+"_Call_Finished()";
	hAgsObj.debug = false;
	AGS(hAgsObj,"jsreturn");
}

function Do_PA08_Call(position, jobCode, program, window)
{
	var programSafeStr = program.split(".").join("_");
	self.lawheader.DetailLine = 0;	
	self.lawheader.UpdateType = programSafeStr;
	var pAgsObj = new AGSObject(authUser.prodline, program);
	pAgsObj.event = "ADD";
	pAgsObj.rtn	= "DATA";
	pAgsObj.out	= "JAVASCRIPT";
	pAgsObj.longNames = "ALL";
	pAgsObj.tds	= false;
	pAgsObj.field = "FC=I"
	+ "&JBR-COMPANY="+escapeEx(authUser.company);				
	if (typeof(position) != "undefined" && position != null && position != "")
		pAgsObj.field += "&JBR-POSITION="+escapeEx(position,1);
	else
		pAgsObj.field += "&JBR-JOB-CODE="+escapeEx(jobCode,1);
	if (typeof(window) != "undefined" && window != null)		
		pAgsObj.func = "parent.Do_"+programSafeStr+"_Call_"+window+"_Finished('"+position+"','"+jobCode+"')";	
	else
		pAgsObj.func = "parent.Do_"+programSafeStr+"_Call_Finished('"+position+"','"+jobCode+"')";			
	pAgsObj.debug = false;
	AGS(pAgsObj,"jsreturn");
}

function Do_HS50_3_Call(Codes, program, debug, redirect, employee)
{
	// PT142651. Store off some global variables in case we need them for a page down call.
	HS50_3_Codes = Codes;
	HS50_3_employee = employee;
	var programSafeStr = program.split(".").join("_");
	self.lawheader.DetailLine = 0;
	self.lawheader.UpdateType = programSafeStr;
	var Get_Profile = (typeof(redirect) != "undefined" && redirect != null && 
		redirect.toUpperCase().indexOf("JOBPROFILE")!=-1)?true:false;
	var pageDown = false;
	// PT142651. Check to see if we need to perform a page down call.
	if (NonSpace(TrainingCourses.ptsort) > 0 || NonSpace(TrainingCourses.ptCourseDesc) > 0 
	|| NonSpace(TrainingCourses.ptCourseNumber) > 0 || NonSpace(TrainingCourses.ptCourse) > 0 
	|| NonSpace(TrainingCourses.ptseqnbr) > 0)
	{
		pageDown = true;
	}
	var pAgsObj = new AGSObject(authUser.prodline, program);
	pAgsObj.event = "ADD";
	pAgsObj.rtn = "DATA";
	pAgsObj.out = "JAVASCRIPT";
	pAgsObj.longNames = "ALL";
	pAgsObj.tds = false;
	pAgsObj.field = "FC=I";
	if (Codes[0].type == "CC")
		pAgsObj.field += "&CRS-CAT=Y";
	else if (Get_Profile)
	{
		pAgsObj.field += "&COMPANY="+ escapeEx(authUser.company)
		+  "&EMPLOYEE="+ escapeEx(employee);
	}
	for (var i=0;(i<Codes.length && i<6);i++)
	{
		pAgsObj.field += "&TYPE"+(i+1)+"=" +escapeEx(Codes[i].type,1) 
		+  "&CODE"+(i+1)+"=" +escapeEx(Codes[i].code,1);
		if (Codes[i].type != "CC" && typeof(Codes[i].seqnbr) != "undefined" && Codes[i].seqnbr != null)
			pAgsObj.field += "&SEQ-NBR"+(i+1)+"=" + escapeEx(Codes[i].seqnbr,1);
		if (typeof(Codes[i].plevel) != "undefined" && Codes[i].plevel != null && !isNaN(parseInt(Codes[i].plevel,10)))
			pAgsObj.field += "&PROFIC-LVL"+(i+1)+"=" + escapeEx(parseInt(Codes[i].plevel,10),1);
	}
	// PT142651. If we need to perform a page down, pass the position to fields.
	if (pageDown)
	{	
		pAgsObj.field += "&PT-SORT="+escapeEx(TrainingCourses.ptsort)
		+ "&PT-COURSE-DESC="+escapeEx(TrainingCourses.ptCourseDesc)
		+ "&PT-COURSE-NBR="+escapeEx(TrainingCourses.ptCourseNumber)
		+ "&PT-COURSE="+escapeEx(TrainingCourses.ptCourse)
		+ "&PT-SEQ-NUMBER="+escapeEx(TrainingCourses.ptseqnbr) 
		// Re-initialize the position to fields prior to making the AGS call but after setting
		// them in the query string.
		TrainingCourses.ptsort = " ";
		TrainingCourses.ptCourseDesc = " ";
		TrainingCourses.ptCourseNumber = " ";
		TrainingCourses.ptCourse = " ";
		TrainingCourses.ptseqnbr = " ";
	}
	pAgsObj.func = "parent.Do_"+programSafeStr+"_Call_";
	pAgsObj.func += (typeof(redirect) != "undefined" && redirect != null)?redirect+"_Finished()":"Finished()";			
	pAgsObj.debug = (typeof(debug) != "undefined" && debug != null)?debug:false;
	AGS(pAgsObj,"jsreturn");
}

function Do_HS50_5_Call(Codes, empApp, program, fc, debug, redirect)
{
	var programSafeStr = program.split(".").join("_");
	self.lawheader.DetailLine = 1;
	self.lawheader.UpdateType = programSafeStr;
	var pAgsObj = new AGSObject(authUser.prodline, program);
	if (fc == "I")
	{
		JobInterests = new Array(); 
		pAgsObj.event = "ADD";
		pAgsObj.rtn	= "DATA";
	}
	else
	{
		pAgsObj.event = "CHANGE";
		pAgsObj.rtn = "MESSAGE";
	}	
	pAgsObj.out = "JAVASCRIPT";
	pAgsObj.longNames = "ALL";
	pAgsObj.tds = false;
	pAgsObj.field = "FC="+fc
	+ "&COMPANY=" + escapeEx(authUser.company)
	+ "&EMP-APP=" + escapeEx(empApp,1);
	if (_DIRECTREPORTSINDEX >=0 && DirectReports[_DIRECTREPORTSINDEX])
		pAgsObj.field	+= "&EMPLOYEE=" + escapeEx(DirectReports[_DIRECTREPORTSINDEX].code);
	else
		pAgsObj.field	+= "&EMPLOYEE=" + escapeEx(authUser.employee);
	if (fc == "C")
	{
		for (var i=0;(i<Codes.length && i<3);i++)
		{
			pAgsObj.field += "&LINE-FC"+(i+1)+"=" + escapeEx(Codes[i].fc,1);
			if (Codes[i].jobcode != null)
				pAgsObj.field += "&JOB-CODE"+(i+1)+"=" + escapeEx(Codes[i].jobcode,1);
			else if (Codes[i].position != null)	
				pAgsObj.field += "&POSITION"+(i+1)+"=" + escapeEx(Codes[i].position,1);
		}
	}
	pAgsObj.func = "parent.Do_"+programSafeStr+"_Call_";
	pAgsObj.func += (typeof(redirect) != "undefined" && redirect != null)?redirect+"_Finished()":"Finished()";			
	pAgsObj.debug = (typeof(debug) != "undefined" && debug != null)?debug:false;
	AGS(pAgsObj,"jsreturn");
}

function Call_HS10(company, employee, redirect)
{
	var program;
	if (typeof(program) == "undefined" || program == null)
		program = "HS10.1";
	var programSafeStr = program.split(".").join("_");
	if ((typeof(parentTask) != "undefined") && ((parentTask == "goalmgmt") || (parentTask == "perfmgmt"))) 
	{
		var dr = opener.directReports;
		var drLen = dr.length;
		DirectReports.JobDescription = "";
		DirectReports.PosDescription = "";
		if (drLen > 0) 
		{
			DirectReports.JobDescription = dr[0].supv_job_desc;
			DirectReports.PosDescription = dr[0].supv_pos_desc;
		}
		for (var i=0; i<drLen; i++) 
		{
			DirectReports[i] = new DirectReportsObject();
			DirectReports[i].code = dr[i].employee;
			DirectReports[i].description = dr[i].full_name;
		}
		nextFunc = "Do_"+programSafeStr+"_Call_";
		nextFunc += (typeof(redirect) != "undefined" && redirect != null)?redirect+"_Finished()":"Finished()"; 
		eval(nextFunc);	
	} 
	else 
	{
		self.lawheader.DetailLine = 0;
		self.lawheader.UpdateType = programSafeStr;
		var pAgsObj = new AGSObject(authUser.prodline, "HS10.1");
		pAgsObj.event = "ADD";
		pAgsObj.rtn = "DATA";
		pAgsObj.longNames = true;
		pAgsObj.tds = false;
		pAgsObj.field = "FC=I"
		+ "&HSU-COMPANY=" +escapeEx(parseInt(company, 10))
		+ "&HSU-EMPLOYEE=" +escapeEx(parseInt(employee, 10));
		if (DirectReports.length && DirectReports.NextEmployee)
		{
			if (DirectReports.NextFC)
				pAgsObj.field += "&PT-FC="+DirectReports.NextFC;
			if (DirectReports.NextEmployee)
				pAgsObj.field += "&PT-PTF-EMPLOYEE="+DirectReports.NextEmployee;
			if (DirectReports.NextSupervisorCode)
				pAgsObj.field += "&PT-HSU-CODE="+DirectReports.NextSupervisorCode;
			if (DirectReports.NextSupervisorOpCode)
				pAgsObj.field += "&PT-HSU-OP-CODE="+DirectReports.NextSupervisorOpCode;
			DirectReports.Next = false;
			DirectReports.NextFC = "";
			DirectReports.NextEmployee = "";
			DirectReports.NextSupervisorCode = "";
			DirectReports.NextSupervisorOpCode = "";
		}
		pAgsObj.out = "JAVASCRIPT";
		pAgsObj.debug = false;
		if (typeof(redirect) != "undefined" && redirect != null)
			pAgsObj.func = "parent.Next_Call_HS10("+parseInt(company,10)+","+parseInt(employee,10)+",'"+programSafeStr+"','"+redirect+"')";
		else
			pAgsObj.func = "parent.Next_Call_HS10("+parseInt(company,10)+","+parseInt(employee,10)+",'"+programSafeStr+"')";
		AGS(pAgsObj, "jsreturn");
	}
}

function Next_Call_HS10(company, employee, programSafeStr, redirect)
{
	if (DirectReports.length && DirectReports.Next)
		Call_HS10(company, employee, redirect);
	else
	{			
		nextFunc = "Do_"+programSafeStr+"_Call_";
		nextFunc += (typeof(redirect) != "undefined" && redirect != null)?redirect+"_Finished()":"Finished()"; 
		eval(nextFunc);
	}
}

function Call_HS52(company, employees, program, manager, redirect, jobcode)
{
	var programSafeStr = program.split(".").join("_");
	self.lawheader.DetailLine = 0;
	self.lawheader.UpdateType = programSafeStr;
	GroupProfile = new GroupProfileObject();
	var pAgsObj	= new AGSObject(authUser.prodline, program);
	pAgsObj.out = "JAVASCRIPT";
	pAgsObj.debug = false;
	pAgsObj.event = "ADD";
	pAgsObj.rtn = "DATA";
	pAgsObj.longNames = "ALL";
	pAgsObj.tds = false;
	pAgsObj.field = "FC=I"
	+ "&COMPANY=" + escapeEx(parseInt(company,10))			
	if (manager)
		pAgsObj.field += "&MANAGER=" +escapeEx(parseInt(manager,10));
	else
	{
		for (var i=0; i<employees.length; i++)
			pAgsObj.field += "&EMPLOYEE"+(i+1)+"="+escapeEx(parseInt(employees[i], 10));
	}
	pAgsObj.field += "&JOB-CODE=" + escapeEx(jobcode)
	pAgsObj.field += "&ESSENTIAL=" + escapeEx("1");
	pAgsObj.func = "parent.Do_"+programSafeStr+"_Call_";
	pAgsObj.func += (typeof(redirect) != "undefined" && redirect != null)?redirect+"_Finished()":"Finished()";
	AGS(pAgsObj, "jsreturn");
}

function Call_TR02(coursecode, program, func)
{
	var programSafeStr = program.split(".").join("_");
	self.lawheader.DetailLine = 0;
	self.lawheader.UpdateType = programSafeStr;
	CoursePrerequisites = new CoursePrerequisitesObject();
	var pAgsObj	= new AGSObject(authUser.prodline, program);
	pAgsObj.out = "JAVASCRIPT";
	pAgsObj.debug = false;
	pAgsObj.event = "ADD";
	pAgsObj.rtn = "DATA";
	pAgsObj.longNames = "ALL";
	pAgsObj.tds = false;
	pAgsObj.field = "FC=I"
	+ "&RQS-COURSE=" + escapeEx(coursecode);
	pAgsObj.func = (func.indexOf("parent.")!=-1)?func:"parent."+func;
	AGS(pAgsObj, "jsreturn");
}

/*
 *	Data Retrieval Functionality
 */
var Proficiency = new Array();
var Source = new Array();
var Degree = new Array();
var Subject = new Array();
var Institution = new Array();
var RenewalCycle = new Array();
var State = new Array();
var Currency = new Array();
var Certifications = new Array();
var Competency = new Array();
var CourseCategories = new Array();
var TrHistory = new Array();
var TrRegistration = new Array();
var ReviewRecs = new Array();
var TASK_TYPE = "EMPLOYEE";

function SelectObject()
{
	this.code = null;
	this.description = null;
}

function SelectObjectJobCode(job_code, description)
{
	this.job_code = job_code;
	this.description = description;
}

function JobCodeObject(window)
{
	this.PaintJobCode = JobCode_CareerManagement_ExploreCareersTab;
	this.isSelect = false;
	this.frame = "jsreturn";
	this.func = (window)?"PaintJobCode_"+window+"_Done()":"PaintJobCode_Done()"
	JobCode = new Array();
	JobClass = new Array();
}

function JobCode_CareerManagement_ExploreCareersTab()
{
	var obj = new DMEObject(authUser.prodline, "JOBCODE");
	obj.out = "JAVASCRIPT";
	obj.index = "jbcset2";
	obj.cond = "active";
	obj.field = "job-code;description;job-class;job-class.description";
	obj.key = authUser.company+"";
	obj.max = "600";
	obj.func = "PaintJobCode_InProgress('"+this.frame+"',"+this.isSelect+",'"+this.func+"')";	
	obj.debug = false;
	DME(obj,this.frame);
}

function PaintJobCode_InProgress(frameNm, isSelect, redirect)
{
	var frameLoc = eval("self."+frameNm);
	var frameRecs = frameLoc.record;
	if (!isSelect)
	{
		JobCode = JobCode.concat(frameRecs);
		for (var i=0;i<frameRecs.length;i++)
		{
			if (NonSpace(frameRecs[i].job_class) > 0) 
			{
				if ((JobClass.length == 0) || (frameRecs[i].job_class != JobClass[JobClass.length-1].job_class)) 
				{
					JobClass[JobClass.length] = new SelectObject();
					JobClass[JobClass.length-1].job_class = frameRecs[i].job_class;
					JobClass[JobClass.length-1].description = frameRecs[i].job_class_description;
					JobClass[JobClass.length-1].Rel_jobcodes = new Array();
				}
				var len = JobClass[JobClass.length-1].Rel_jobcodes.length;
				JobClass[JobClass.length-1].Rel_jobcodes[len] = new SelectObjectJobCode(frameRecs[i].job_code, frameRecs[i].description); 			
			}
		}
	}
	else 
	{
		for (var i=0;i<frameRecs.length;i++)
		{
			JobCode[JobCode.length] = new SelectObject();
			JobCode[JobCode.length-1].code = frameRecs[i].job_code;
			JobCode[JobCode.length-1].description = frameRecs[i].description;
			if (NonSpace(frameRecs[i].job_class) > 0) 
			{			
				if ((JobClass.length == 0) || (frameRecs[i].job_class != JobClass[JobClass.length-1].code)) 
				{
					JobClass[JobClass.length] = new SelectObject();	
					JobClass[JobClass.length-1].code = frameRecs[i].job_class;				
					JobClass[JobClass.length-1].description = frameRecs[i].job_class_description;
					JobClass[JobClass.length-1].Rel_jobcodes = new Array(); 			
				}
				var len = JobClass[JobClass.length-1].Rel_jobcodes.length;
				JobClass[JobClass.length-1].Rel_jobcodes[len] = new SelectObjectJobCode(frameRecs[i].job_code, frameRecs[i].description); 			
			}
		}
	}
	if (frameLoc.Next != "")
		frameLoc.location.replace(frameLoc.Next);
	else
	{
		JobCode.sort(sortByName);
		JobClass.sort(sortByName);
		PaintJobClass_Done();	
	}
}

function JobClassObject()
{
	this.PaintJobClass = JobCode_CareerManagement_ExploreCareersTab;
	this.isSelect = false;
	this.frame = "jsreturn";
	JobClass = new Array();	
}

function GetSelectBoxesForGeneralUsage(funcStr, task)
{
	DMEFUNC = funcStr;
	TASK_TYPE = task;
	if (emssObjInstance.emssObj.filterSelect)
		GetProficiencies();
	else
	{
		var pObj = new DMEObject(authUser.prodline, "PCODES")
		pObj.out = "JAVASCRIPT"
		pObj.field = "type;code;description"
		pObj.max = "600";
		pObj.sortasc = "description";
		pObj.debug = false;
		pObj.func = "PCODES_Finished('"+task+"')";
		if (task == "MANAGER")
		{
			pObj.field += ";web-avail-supv";
			pObj.cond = "vw-su-web-all";
		}
		else
		{
			pObj.field += ";web-available";
			pObj.cond = "vw-em-web-all";
		}
		DME(pObj,"jsreturn");
	}
}

function PCODES_Finished(task)
{
	var webAvail = "";
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		var pObj = self.jsreturn.record[i];
		if (task == "MANAGER")
			webAvail = eval('pObj.web_avail_supv');
		else 
			webAvail = eval('pObj.web_available');
		if (pObj.type == "ED")
			Degree[Degree.length] = new CodeDescObject(pObj.code, pObj.description, pObj.type, webAvail);
		else if (pObj.type == "CE")
			Certifications[Certifications.length] = new CodeDescObject(pObj.code, pObj.description, pObj.type, webAvail);
		else if (pObj.type == "AB" || pObj.type == "KN" || pObj.type == "OA" || pObj.type == "SK")
			Competency[Competency.length] = new CodeDescObject(pObj.code, pObj.description, pObj.type, webAvail);
	}
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
	{
		var pObj = new DMEObject(authUser.prodline, "PCODES");
		pObj.out = "JAVASCRIPT";
		pObj.field = "type;code;description";
		pObj.key = "PF;SS;ES;EI;CC";
		pObj.max = "600";
		pObj.sortasc = "description";
		pObj.debug = false;
		pObj.func = "MorePCodes_Finished()";
		pObj.cond = "active";
		DME(pObj,"jsreturn");
	}
}

function MorePCodes_Finished()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		pObj = self.jsreturn.record[i];
		if (pObj.type == "PF")
			Proficiency[Proficiency.length] = new CodeDescObject(pObj.code, pObj.description);
		else if (pObj.type == "SS")
			Source[Source.length] = new CodeDescObject(pObj.code, pObj.description);
		else if (pObj.type == "ES")
			Subject[Subject.length] = new CodeDescObject(pObj.code, pObj.description);
		else if (pObj.type == "EI")
			Institution[Institution.length] = new CodeDescObject(pObj.code, pObj.description);
		else if (pObj.type == "CC")
			CourseCategories[CourseCategories.length] = new CodeDescObject(pObj.code, pObj.description);
	}
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
	{
		var pObj = new DMEObject(authUser.prodline, "CUCODES");
		pObj.out = "JAVASCRIPT";
		pObj.field = "currency-code;description";
		pObj.max = "600";
		pObj.debug = false;
		pObj.func = "CUCODES_Finished()";
		DME(pObj,"jsreturn");
	}
}

function CUCODES_Finished()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		pObj = self.jsreturn.record[i];
		Currency[Currency.length] = new CodeDescObject(pObj.currency_code, pObj.description);
	}
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
	{
		Currency.sort(sortByName);
		DMECALLED = true;
		eval(DMEFUNC);
	}
}

function GetProficiencies()
{
	var pObj = new DMEObject(authUser.prodline, "PCODES")
	pObj.out = "JAVASCRIPT"
	pObj.field = "type;code;description"
	pObj.key = "PF";
	pObj.max = "600";
	pObj.sortasc = "description";
	pObj.debug = false;
	pObj.func = "GetProficiencies_Finished()";
	pObj.cond = "active";
	DME(pObj,"jsreturn")
}

function GetProficiencies_Finished()
{
	for (var i=0; i<self.jsreturn.NbrRecs; i++)
	{
		pObj = self.jsreturn.record[i];
		Proficiency[Proficiency.length] = new CodeDescObject(pObj.code, pObj.description);
	}
	if (self.jsreturn.Next)
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
	{
		DMECALLED = true;
		eval(DMEFUNC);		
	}	
}

function sortByName(obj1, obj2)
{
	var name1 = obj1.description;
	var name2 = obj2.description;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function DME_TO_PASESSION(course, func)
{
	var pObj = new DMEObject(authUser.prodline, "PASESSION");
	pObj.out = "JAVASCRIPT";
	pObj.field = "session;start-date;end-date;end-reg-date;site;facility.description;start-time;end-time;session-status;obj-id";
	pObj.max = "600";
	pObj.key = escapeEx(course);
	pObj.debug = false;
	pObj.func = func;
	DME(pObj,"jsreturn");	
}

function DME_TO_REVIEW(func)
{
	ReviewRecs = new Array();
	var pDmeObj = new DMEObject(authUser.prodline, "REVIEW");
	pDmeObj.out = "JAVASCRIPT";
	pDmeObj.index = "REVSET2";
	pDmeObj.field = "seq-nbr;sched-date;code;actual-date;rating;first-name;middle-init;last-name;review-type.description";
	pDmeObj.key = authUser.company+"="+DirectReports[_DIRECTREPORTSINDEX].code;
	pDmeObj.max = 600;
	pDmeObj.func = func;
	pDmeObj.debug = false;
	DME(pDmeObj,"jsreturn");
}

function DME_TO_TRAINING_HISTORY(func)
{
	if (!appObj)
		appObj = new AppVersionObject(authUser.prodline, "HR");
    // if you call getAppVersion() right away and the IOS object isn't set up yet,
	// then the code will be trying to load the sso.js file, and your call for
	// the appversion will complete before the ios version is set
	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
		setTimeout(function(){ DME_TO_TRAINING_HISTORY(func); }, 10);
		return;
	}
	TrHistory = new Array();
	var pDmeObj = new DMEObject(authUser.prodline, "PATRNHIST");
	pDmeObj.out = "JAVASCRIPT";
	if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "09.00.01")
		pDmeObj.index = "TRHSET4";
	else
		pDmeObj.index = "TRHSET1";
	pDmeObj.field = "course;course.short-crs-desc;date-completed;complete-stats,xlt;ceu-awarded;rating"
	pDmeObj.key = authUser.company+"="+DirectReports[_DIRECTREPORTSINDEX].code;
	pDmeObj.max = 600;
	pDmeObj.func = func;
	pDmeObj.debug = false;
	DME(pDmeObj,"jsreturn");	
}

function DME_TO_TRAINING_REGISTRATION(func)
{
	TrRegistration = new Array();
	var pDmeObj = new DMEObject(authUser.prodline, "PAREGISTER")
	pDmeObj.out = "JAVASCRIPT"
	pDmeObj.index = "REGSET2";
	pDmeObj.field = "course;start-date;notification,xlt;reg-status,xlt;course.short-crs-desc;waitlist-date;confirm-act-dt"
	pDmeObj.key = authUser.company+"="+DirectReports[_DIRECTREPORTSINDEX].code;
	pDmeObj.max = 600;
	pDmeObj.func = func;
	pDmeObj.debug = false
	DME(pDmeObj,"jsreturn")	
}

/* Filter Select logic - start */
/*
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
*/

function performDmeFieldFilterOnLoad(dmeFilter)
{
	switch (dmeFilter.getFieldNm().toLowerCase())
	{	
		case "competency":
			var fieldList = "code;type;description";
			var condList = null;
			if (TASK_TYPE == "MANAGER")
			{
				fieldList += ";web-avail-supv";
				condList = "act-su-web-cmp";
			}
			else
			{
				fieldList += ";web-available";
				condList = "act-web-comp";
			}
			dmeFilter.addFilterField("code", 10, getSeaPhrase("QUAL_4","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes",
				"pcoset1",
				fieldList,
				"AB;KN;OA;SK",
				condList,
				null,
				dmeFilter.getNbrRecords(),
				null);
		break;		
		case "certification":
			var fieldList = "code;type;description";
			var condList = null;
			if (TASK_TYPE == "MANAGER")
			{
				fieldList += ";web-avail-supv";
				condList = "act-su-web-crt";
			}
			else
			{
				fieldList += ";web-available";
				condList = "act-web-cert";
			}		
			dmeFilter.addFilterField("code", 10, getSeaPhrase("QUAL_4","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes",
				"pcoset1",
				fieldList,
				"CE",
				condList,
				null,
				dmeFilter.getNbrRecords(),
				null);
		break;	
		case "degree":
			var fieldList = "code;type;description";
			var condList = null;
			if (TASK_TYPE == "MANAGER")
			{
				fieldList += ";web-avail-supv";
				condList = "act-sup-web-ed";
			}
			else
			{
				fieldList += ";web-available";
				condList = "act-web-educ";
			}		
			dmeFilter.addFilterField("code", 10, getSeaPhrase("QUAL_17","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes",
				"pcoset1",
				fieldList,
				"ED",
				condList,
				null,
				dmeFilter.getNbrRecords(),
				null);
		break;	
		case "competency_list":
			var fieldList = "code;type;description";
			var condList = null;
			if (TASK_TYPE == "MANAGER")
			{
				fieldList += ";web-avail-supv";
				condList = "vw-su-web-cmp";
			}
			else
			{
				fieldList += ";web-available";
				condList = "vw-em-web-cmp";
			}
			dmeFilter.addFilterField("code", 10, getSeaPhrase("QUAL_4","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes",
				"pcoset1",
				fieldList,
				"AB;KN;OA;SK",
				condList,
				null,
				dmeFilter.getNbrRecords(),
				null);
		break;		
		case "certification_list":
			var fieldList = "code;type;description";
			var condList = null;
			if (TASK_TYPE == "MANAGER")
			{
				fieldList += ";web-avail-supv";
				condList = "vw-su-web-crt";
			}
			else
			{
				fieldList += ";web-available";
				condList = "vw-em-web-crt";
			}		
			dmeFilter.addFilterField("code", 10, getSeaPhrase("QUAL_4","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes",
				"pcoset1",
				fieldList,
				"CE",
				condList,
				null,
				dmeFilter.getNbrRecords(),
				null);
		break;	
		case "degree_list":
			var fieldList = "code;type;description";
			var condList = null;
			if (TASK_TYPE == "MANAGER")
			{
				fieldList += ";web-avail-supv";
				condList = "vw-su-web-ed";
			}
			else
			{
				fieldList += ";web-available";
				condList = "vw-em-web-ed";
			}		
			dmeFilter.addFilterField("code", 10, getSeaPhrase("QUAL_17","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes",
				"pcoset1",
				fieldList,
				"ED",
				condList,
				null,
				dmeFilter.getNbrRecords(),
				null);
		break;		
		case "subject":
			dmeFilter.addFilterField("code", 10, getSeaPhrase("QUAL_18","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes",
				"pcoset1",
				"code;description",
				"ES",
				"active",
				null,
				dmeFilter.getNbrRecords(),
				null);
		break;
		case "instructor":
			dmeFilter.addFilterField("code", 10, getSeaPhrase("QUAL_20","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes",
				"pcoset1",
				"code;description",
				"EI",
				"active",
				null,
				dmeFilter.getNbrRecords(),
				null);
		break;		
		case "skillsource":
			dmeFilter.addFilterField("code", 10, getSeaPhrase("QUAL_6","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes",
				"pcoset1",
				"code;description",
				"SS",
				"active",
				null,
				dmeFilter.getNbrRecords(),
				null);
		break;
/*		
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
*/		
		case "currencycode":
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
		case "course_category":
			dmeFilter.addFilterField("code", 10, getSeaPhrase("CM_171","CM"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("CM_134","CM"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"pcodes",
				"pcoset1",
				"code;description",
				"CC",
				"active",
				null,
				dmeFilter.getNbrRecords(),
				null);
		break;	
		case "job_title":
		case "job_alert1":
		case "job_alert2":
		case "job_alert3":
		case "job_group_profile":
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
		case "job_category":
			dmeFilter.addFilterField("job-class", 3, getSeaPhrase("CM_28","CM"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("CM_134","CM"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"jobclass", 
				"jclset1", 
				"job-class;description;", 
				String(authUser.company), 
				"jobcodes", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);			
		break;		
		case "jobs_by_category":
			var keyValue = String(authUser.company); 
			var SelectJobClass = GetTextBoxFormObject("main", "CategoryFilterSelect", "CategoryFilterSelect_ExploreCareers");
			keyValue += "=" + SelectJobClass.value;
			dmeFilter.addFilterField("job-code", 9, getSeaPhrase("JOB_OPENINGS_6","ESS"), true);
			dmeFilter.addFilterField("description", 30, getSeaPhrase("JOB_OPENINGS_2","ESS"), false);
			filterDmeCall(dmeFilter,
				"jsreturn",
				"jobcode", 
				"jbcset2", 
				"job-code;description;", 
				keyValue, 
				"active", 
				null, 
				dmeFilter.getNbrRecords(), 
				null);			
		break;					
		case "job_openings":
			dmeFilter.addFilterField("description", 30, getSeaPhrase("CM_134","CM"), false);
			var selectStr = null;
			if (_JOBALERTDESC != null && NonSpace(_JOBALERTDESC) > 0)
			{	
				dmeFilter.setFilterField("description", 30, false, false);
				dmeFilter.setKeywords(_JOBALERTDESC);
				selectStr = dmeFilter.getSelectStr();
				_JOBALERTDESC = null;
			}
			var fieldStr = "requisition;description;department.name;location.description;"
			+ "process-level.name;openings;supervisor.description;work-schedule.description;"
			+ "contact-first;contact-mi;contact-last;wk-phone-nbr;wk-phone-ext;job-code;position"		
			filterDmeCall(dmeFilter,
				"HIDDEN",
				"pajobreq", 
				"pjrset4", 
				fieldStr, 
				String(authUser.company), 
				"not-closed", 
				selectStr, 
				dmeFilter.getNbrRecords(), 
				null);			
		break;			
		case "reviews":
			//dmeFilter.addFilterField("sched-date", 8, getSeaPhrase("CM_330","CM"), false, true);
			dmeFilter.disableSearch();
			filterDmeCall(dmeFilter,
				"jsreturn",
				"review", 
				"revset2", 
				"seq-nbr;sched-date;code;actual-date;rating;first-name;middle-init;last-name;review-type.description", 
				String(authUser.company)+"="+DirectReports[_DIRECTREPORTSINDEX].code, 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);			
		break;	
		case "training_history":
    		if (!appObj)
        		appObj = new AppVersionObject(authUser.prodline, "HR");
       		// if you call getAppVersion() right away and the IOS object isn't set up yet,
       		// then the code will be trying to load the sso.js file, and your call for
			// the appversion will complete before the ios version is set
			if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
			{
				setTimeout(function(){ performDmeFieldFilterOnLoad(dmeFilter); }, 10);
				return;
			}
			//dmeFilter.addFilterField("course", 10, getSeaPhrase("CM_295","CM"), false);
			dmeFilter.disableSearch();
			var indexStr = "trhset1";
			if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "09.00.01")
				indexStr = "trhset4";
			filterDmeCall(dmeFilter,
				"jsreturn",
				"patrnhist", 
				indexStr, 
				"course;course.short-crs-desc;date-completed;complete-stats,xlt;ceu-awarded;rating", 
				String(authUser.company)+"="+DirectReports[_DIRECTREPORTSINDEX].code, 
				null, 
				null, 
				dmeFilter.getNbrRecords(), 
				null);			
		break;	
		case "training_registration":
			//dmeFilter.addFilterField("course", 10, getSeaPhrase("CM_295","CM"), false);
			dmeFilter.disableSearch();
			filterDmeCall(dmeFilter,
				"jsreturn",
				"paregister", 
				"regset2", 
				"course;start-date;notification,xlt;reg-status,xlt;course.short-crs-desc;waitlist-date;confirm-act-dt", 
				String(authUser.company)+"="+DirectReports[_DIRECTREPORTSINDEX].code, 
				null, 
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
		case "competency":
		var fieldList = "code;type;description";
		var condList = null;
		if (TASK_TYPE == "MANAGER")
		{
			fieldList += ";web-avail-supv";
			condList = "act-su-web-cmp";
		}
		else
		{
			fieldList += ";web-available";
			condList = "act-web-comp";
		}		
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes",
			"pcoset1",
			fieldList,
			"AB;KN;OA;SK",
			condList,
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);
		break;		
		case "certification":
		var fieldList = "code;type;description";
		var condList = null;
		if (TASK_TYPE == "MANAGER")
		{
			fieldList += ";web-avail-supv";
			condList = "act-su-web-crt";
		}
		else
		{
			fieldList += ";web-available";
			condList = "act-web-cert";
		}		
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes",
			"pcoset1",
			fieldList,
			"CE",
			condList,
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);
		break;	
		case "degree":
		var fieldList = "code;type;description";
		var condList = null;
		if (TASK_TYPE == "MANAGER")
		{
			fieldList += ";web-avail-supv";
			condList = "act-sup-web-ed";
		}
		else
		{
			fieldList += ";web-available";
			condList = "act-web-educ";
		}		
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes",
			"pcoset1",
			fieldList,
			"ED",
			condList,
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);
		break;
		case "competency_list":
		var fieldList = "code;type;description";
		var condList = null;
		if (TASK_TYPE == "MANAGER")
		{
			fieldList += ";web-avail-supv";
			condList = "vw-su-web-cmp";
		}
		else
		{
			fieldList += ";web-available";
			condList = "vw-em-web-cmp";
		}
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes",
			"pcoset1",
			fieldList,
			"AB;KN;OA;SK",
			condList,
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);
		break;		
		case "certification_list":
		var fieldList = "code;type;description";
		var condList = null;
		if (TASK_TYPE == "MANAGER")
		{
			fieldList += ";web-avail-supv";
			condList = "vw-su-web-crt";
		}
		else
		{
			fieldList += ";web-available";
			condList = "vw-em-web-crt";
		}		
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes",
			"pcoset1",
			fieldList,
			"CE",
			condList,
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);
		break;	
		case "degree_list":
		var fieldList = "code;type;description";
		var condList = null;
		if (TASK_TYPE == "MANAGER")
		{
			fieldList += ";web-avail-supv";
			condList = "vw-su-web-ed";
		}
		else
		{
			fieldList += ";web-available";
			condList = "vw-em-web-ed";
		}		
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes",
			"pcoset1",
			fieldList,
			"ED",
			condList,
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);
		break;
		case "subject":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes",
			"pcoset1",
			"code;description",
			"ES",
			"active",
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);
		break;
		case "instructor":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes",
			"pcoset1",
			"code;description",
			"EI",
			"active",
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);
		break;		
		case "skillsource":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes",
			"pcoset1",
			"code;description",
			"SS",
			"active",
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);
		break;
/*		
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
*/
		case "currencycode":
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
		case "course_category":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"pcodes",
			"pcoset1",
			"code;description",
			"CC",
			"active",
			dmeFilter.getSelectStr(),
			dmeFilter.getNbrRecords(),
			null);
		break;
		case "job_title":
		case "job_alert1":
		case "job_alert2":
		case "job_alert3":
		case "job_group_profile":
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
		case "job_category":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"jobclass", 
			"jclset1", 
			"job-class;description;", 
			String(authUser.company), 
			"jobcodes", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);			
		break;		
		case "jobs_by_category":
		var keyValue = String(authUser.company); 
		var SelectJobClass = GetTextBoxFormObject("main", "CategoryFilterSelect", "CategoryFilterSelect_ExploreCareers");
		keyValue += "=" + SelectJobClass.value;
		filterDmeCall(dmeFilter,
			"jsreturn",
			"jobcode", 
			"jbcset2", 
			"job-code;description;", 
			keyValue, 
			"active", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);			
		break;	
		case "job_openings":				
		var fieldStr = "requisition;description;department.name;location.description;process-level.name;openings;supervisor.description;work-schedule.description;"
		+ "contact-first;contact-mi;contact-last;wk-phone-nbr;wk-phone-ext;job-code;position"		
		filterDmeCall(dmeFilter,
			"HIDDEN",
			"pajobreq", 
			"pjrset4", 
			fieldStr, 
			String(authUser.company), 
			"not-closed", 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);			
		break;
		case "reviews":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"review", 
			"revset2", 
			"seq-nbr;sched-date;code;actual-date;rating;first-name;middle-init;last-name;review-type.description;", 
			String(authUser.company)+"="+DirectReports[_DIRECTREPORTSINDEX].code, 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);			
		break;	
		case "training_history":
        var indexStr = "trhset1";
        if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "09.00.01")
        {
        	indexStr = "trhset4";
        }		
		filterDmeCall(dmeFilter,
			"jsreturn",
			"patrnhist", 
			indexStr, 
			"course;course.short-crs-desc;date-completed;complete-stats,xlt;ceu-awarded;rating", 
			String(authUser.company)+"="+DirectReports[_DIRECTREPORTSINDEX].code, 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);			
		break;	
		case "training_registration":
		filterDmeCall(dmeFilter,
			"jsreturn",
			"paregister", 
			"regset2", 
			"course;start-date;notification,xlt;reg-status,xlt;course.short-crs-desc;waitlist-date;confirm-act-dt", 
			String(authUser.company)+"="+DirectReports[_DIRECTREPORTSINDEX].code, 
			null, 
			dmeFilter.getSelectStr(), 
			dmeFilter.getNbrRecords(), 
			null);			
		break;		
		default: break;
	}
}

function dmeFieldRecordSelected(recIndex, fieldNm)
{
	var selRec = (fieldNm == "job_openings") ? self.HIDDEN.record[recIndex] : self.jsreturn.record[recIndex];
	var pFormObj;
	var formElm;
	switch (fieldNm.toLowerCase())
	{	
		case "competency":
			pFormObj = (_CURRENTTAB == "ACTIONPLAN") ?
				GetFormFromStansWindowLayer("main", "QualificationsDetail_MyActionPlanWindow", "qualificationform"):
				GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");		
			var oldCode = pFormObj.code.value;
			formElm = pFormObj.code;
			pFormObj.type.value = selRec.type;
			pFormObj.code.value = selRec.code;
			if (typeof(pFormObj.qualification) != "undefined")
				pFormObj.qualification.value = selRec.description;
			if (self.main.document.getElementById("competencyType"))
				self.main.document.getElementById("competencyType").innerHTML = selRec.type;
			self.main.document.getElementById("competencyDesc").innerHTML = selRec.description;
			if (oldCode != selRec.code)
				FilterProficiencies(pFormObj);
			break;			
		case "certification":
			pFormObj = (_CURRENTTAB == "ACTIONPLAN") ?
				GetFormFromStansWindowLayer("main", "QualificationsDetail_MyActionPlanWindow", "qualificationform"):
				GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");				
			formElm = pFormObj.code;
			pFormObj.code.value = selRec.code;
			if (typeof(pFormObj.qualification) != "undefined")
				pFormObj.qualification.value = selRec.description;
			self.main.document.getElementById("certificationDesc").innerHTML = selRec.description;
			break;			
		case "degree":
			pFormObj = (_CURRENTTAB == "ACTIONPLAN") ?
				GetFormFromStansWindowLayer("main", "QualificationsDetail_MyActionPlanWindow", "qualificationform"):
				GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");		
			formElm = pFormObj.degree;
			pFormObj.degree.value = selRec.code;
			if (typeof(pFormObj.qualification) != "undefined")
				pFormObj.qualification.value = selRec.description;
			self.main.document.getElementById("degreeDesc").innerHTML = selRec.description;
			break;
		case "competency_list":
		case "certification_list":
		case "degree_list":
			PickedQualificationCode(selRec.type, selRec.code, selRec.description, 
				userSelectedQualificationCriteria.BoxNbr, userSelectedQualificationCriteria.Name, 
				userSelectedQualificationCriteria.Button);
			ShowFilterList(false);
			if (_CURRENTTAB.indexOf("EXPLORECAREERS") != -1)
			{
				if (_CURRENTTAB == "M_EXPLORECAREERS")
					ShowButton(true, "main", "qualcriteria_createjoblist_ManagerExploreCareers");
				else
					ShowButton(true, "main", "qualcriteria_createjoblist_EmployeeExploreCareers");
				ShowButton(true, "main", "ClearForm_ExploreCareers");
			}
			break;						
		case "subject":
			pFormObj = (_CURRENTTAB == "ACTIONPLAN") ?
				GetFormFromStansWindowLayer("main", "QualificationsDetail_MyActionPlanWindow", "qualificationform"):
				GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");				
			formElm = pFormObj.subject;
			pFormObj.subject.value = selRec.code;
			self.main.document.getElementById("subjectDesc").innerHTML = selRec.description;
			break;
		case "instructor":
			pFormObj = (_CURRENTTAB == "ACTIONPLAN") ?
				GetFormFromStansWindowLayer("main", "QualificationsDetail_MyActionPlanWindow", "qualificationform"):
				GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");				
			formElm = pFormObj.instructor;
			pFormObj.instructor.value = selRec.code;
			self.main.document.getElementById("instructorDesc").innerHTML = selRec.description;
			break;			
		case "skillsource":
			pFormObj = (_CURRENTTAB == "ACTIONPLAN") ?
				GetFormFromStansWindowLayer("main", "QualificationsDetail_MyActionPlanWindow", "qualificationform"):
				GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");				
			formElm = pFormObj.skillsource;
			pFormObj.skillsource.value = selRec.code;
			self.main.document.getElementById("skillsourceDesc").innerHTML = selRec.description;
			break;
/*			
		case "state":
			formElm = self.right.document.qualificationform.state;
			if (stateProvFilter == "state")
				self.right.document.qualificationform.state.value = selRec.state;
			else
				self.right.document.qualificationform.state.value = selRec.province;
			self.right.document.getElementById("stateDesc").innerHTML = selRec.description;
			break;
*/			
		case "currencycode":
			pFormObj = (_CURRENTTAB == "ACTIONPLAN") ?
				GetFormFromStansWindowLayer("main", "QualificationsDetail_MyActionPlanWindow", "qualificationform"):
				GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");				
			formElm = pFormObj.currencycode;
			pFormObj.currencycode.value = selRec.currency_code;
			self.main.document.getElementById("currencycodeDesc").innerHTML = selRec.description;
			break;
		case "course_category":
			pFormObj = GetTextBoxFormObject("main", "CourseCategoryFilterSelect", "CourseCategoryFilterSelect_TrainingOptions");
			formElm = pFormObj;
			pFormObj.value = selRec.code;
			var ccDesc = '<span id="CourseCategoryFilterSelectDesc" class="contenttextdisplayCM">'+selRec.description+'</span>'			
			replaceContent("main", "CourseCategoryFilterSelectDesc_TrainingOptions", ccDesc);
			break;	
		case "job_title":
			pFormObj = GetTextBoxFormObject("main", "JobTitleFilterSelect", "JobTitleFilterSelect_ExploreCareers");
			formElm = pFormObj;
			pFormObj.value = selRec.job_code;
			var jobDesc = '<span id="JobTitleFilterSelectDesc" class="contenttextdisplayCM">'+selRec.description+'</span>'			
			replaceContent("main", "JobTitleFilterSelectDesc_ExploreCareers", jobDesc);
			break;
		case "job_alert1":
			pFormObj = GetTextBoxFormObject("main", "JobAlertFilterSelect1", "JobAlertFilterSelect1_JobOpenings");
			formElm = pFormObj;
			pFormObj.value = selRec.job_code;
			var jobDesc = '<span id="JobAlertFilterSelect1Desc" class="contenttextdisplayCM">'+selRec.description+'</span>'			
			replaceContent("main", "JobAlertFilterSelect1Desc_JobOpenings", jobDesc);			
			break;
		case "job_alert2":
			pFormObj = GetTextBoxFormObject("main", "JobAlertFilterSelect2", "JobAlertFilterSelect2_JobOpenings");
			formElm = pFormObj;
			pFormObj.value = selRec.job_code;
			var jobDesc = '<span id="JobAlertFilterSelect2Desc" class="contenttextdisplayCM">'+selRec.description+'</span>'			
			replaceContent("main", "JobAlertFilterSelect2Desc_JobOpenings", jobDesc);		
			break;
		case "job_alert3":
			pFormObj = GetTextBoxFormObject("main", "JobAlertFilterSelect3", "JobAlertFilterSelect3_JobOpenings");
			formElm = pFormObj;
			pFormObj.value = selRec.job_code;
			var jobDesc = '<span id="JobAlertFilterSelect3Desc" class="contenttextdisplayCM">'+selRec.description+'</span>'			
			replaceContent("main", "JobAlertFilterSelect3Desc_JobOpenings", jobDesc);			
			break;
		case "job_group_profile":
			pFormObj = GetTextBoxFormObject("main", "cmbJobCodesFilterSelect", "cmbJobCodesFilterSelect_GroupProfile");
			formElm = pFormObj;
			pFormObj.value = selRec.job_code;
			var jobDesc = '<span id="cmbJobCodesFilterSelectDesc" class="contenttextdisplayCM">'+selRec.description+'</span>'			
			replaceContent("main", "cmbJobCodesFilterSelectDesc_GroupProfile", jobDesc);			
			break;
		case "job_category":
			pFormObj = GetTextBoxFormObject("main", "CategoryFilterSelect", "CategoryFilterSelect_ExploreCareers");
			formElm = pFormObj;
			pFormObj.value = selRec.job_class;
			var jobDesc = '<span id="CategoryFilterSelectDesc" class="contenttextdisplayCM">'+selRec.description+'</span>'			
			replaceContent("main", "CategoryFilterSelectDesc_ExploreCareers", jobDesc);
			break;	
		case "jobs_by_category":
			JobCodeSelected("Category", -1, -1, selRec.job_code, selRec.description);
			break;	
		case "job_openings":
			ShowJobOpeningDetail(recIndex);			
			break;	
		case "reviews":
			ShowTrainingRegistration_EmployeeActionPlan(false);
			ShowTrainingHistory_EmployeeActionPlan(false);
			ShowReviews_EmployeeActionPlan(true);
			ShowReviewInfo(recIndex);			
			break;	
		case "training_history":
			ShowTrainingRegistration_EmployeeActionPlan(false);
			ShowTrainingHistory_EmployeeActionPlan(true);
			ShowReviews_EmployeeActionPlan(false);
			ShowTrainingHistoryInfo(recIndex);			
			break;
		case "training_registration":
			ShowTrainingRegistration_EmployeeActionPlan(true);
			ShowTrainingHistory_EmployeeActionPlan(false);
			ShowReviews_EmployeeActionPlan(false);
			ShowTrainingRegistrationInfo(recIndex);		
			break;
		default:
			break;
	}
	try { filterWin.close(); } catch(e) {}
	try { formElm.focus(); } catch(e) {}
}

function getDmeFieldElement(fieldNm)
{
	var pFormObj;
	var fld = [null, null, null];
	try
	{
		switch (fieldNm.toLowerCase())
		{	
			case "competency":
				pFormObj = (_CURRENTTAB == "ACTIONPLAN") ?
					GetFormFromStansWindowLayer("main", "QualificationsDetail_MyActionPlanWindow", "qualificationform"):
					GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");
				fld = [self.main, pFormObj.code, getSeaPhrase("QUAL_4","ESS")];
				break;			
			case "certification":
				pFormObj = (_CURRENTTAB == "ACTIONPLAN") ?
					GetFormFromStansWindowLayer("main", "QualificationsDetail_MyActionPlanWindow", "qualificationform"):
					GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");				
				fld = [self.main, pFormObj.code, getSeaPhrase("QUAL_4","ESS")];
				break;			
			case "degree":
				pFormObj = (_CURRENTTAB == "ACTIONPLAN") ?
					GetFormFromStansWindowLayer("main", "QualificationsDetail_MyActionPlanWindow", "qualificationform"):
					GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");		
				fld = [self.main, pFormObj.degree, getSeaPhrase("QUAL_17","ESS")];
				break;
			case "competency_list":
			case "certification_list":
			case "degree_list":
				var fldDesc = (fieldNm.toLowerCase() == "degree_list") ? getSeaPhrase("QUAL_17","ESS") : getSeaPhrase("QUAL_4","ESS");
				var QualBox = GetTextBoxFormObject("main", userSelectedQualificationCriteria.Name+userSelectedQualificationCriteria.BoxNbr, 
					userSelectedQualificationCriteria.Name.toLowerCase()+userSelectedQualificationCriteria.BoxNbr);
				fld = [self.main, QualBox, fldDesc];
				break;						
			case "subject":
				pFormObj = (_CURRENTTAB == "ACTIONPLAN") ?
					GetFormFromStansWindowLayer("main", "QualificationsDetail_MyActionPlanWindow", "qualificationform"):
					GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");				
				fld = [self.main, pFormObj.subject, getSeaPhrase("QUAL_18","ESS")];
				break;
			case "instructor":
				pFormObj = (_CURRENTTAB == "ACTIONPLAN") ?
					GetFormFromStansWindowLayer("main", "QualificationsDetail_MyActionPlanWindow", "qualificationform"):
					GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");				
				fld = [self.main, pFormObj.instructor, getSeaPhrase("QUAL_20","ESS")];
				break;			
			case "skillsource":
				pFormObj = (_CURRENTTAB == "ACTIONPLAN") ?
					GetFormFromStansWindowLayer("main", "QualificationsDetail_MyActionPlanWindow", "qualificationform"):
					GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");				
				fld = [self.main, pFormObj.skillsource, getSeaPhrase("QUAL_6","ESS")];
				break;
	/*			
			case "state":
				fld = [self.right, self.right.document.qualificationform.state, getSeaPhrase("STATE_ONLY","ESS")]; 
				if (stateProvFilter == "state")
					self.right.document.qualificationform.state.value = selRec.state;
				else
					self.right.document.qualificationform.state.value = selRec.province;
				self.right.document.getElementById("stateDesc").innerHTML = selRec.description;
				break;
	*/			
			case "currencycode":
				pFormObj = (_CURRENTTAB == "ACTIONPLAN") ?
					GetFormFromStansWindowLayer("main", "QualificationsDetail_MyActionPlanWindow", "qualificationform"):
					GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");				
				fld = [self.main, pFormObj.currencycode, getSeaPhrase("QUAL_16","ESS")];
				break;
			case "course_category":
				pFormObj = GetTextBoxFormObject("main", "CourseCategoryFilterSelect", "CourseCategoryFilterSelect_TrainingOptions");
				fld = [self.main, pFormObj, getSeaPhrase("CM_171","CM")];
				break;	
			case "job_title":
				pFormObj = GetTextBoxFormObject("main", "JobTitleFilterSelect", "JobTitleFilterSelect_ExploreCareers");
				fld = [self.main, pFormObj, getSeaPhrase("JOB_OPENINGS_6","ESS")];
				break;
			case "job_alert1":
				pFormObj = GetTextBoxFormObject("main", "JobAlertFilterSelect1", "JobAlertFilterSelect1_JobOpenings");
				fld = [self.main, pFormObj, getSeaPhrase("JOB_OPENINGS_6","ESS")];			
				break;
			case "job_alert2":
				pFormObj = GetTextBoxFormObject("main", "JobAlertFilterSelect2", "JobAlertFilterSelect2_JobOpenings");
				fld = [self.main, pFormObj, getSeaPhrase("JOB_OPENINGS_6","ESS")];		
				break;
			case "job_alert3":
				pFormObj = GetTextBoxFormObject("main", "JobAlertFilterSelect3", "JobAlertFilterSelect3_JobOpenings");
				fld = [self.main, pFormObj, getSeaPhrase("JOB_OPENINGS_6","ESS")];			
				break;
			case "job_group_profile":
				pFormObj = GetTextBoxFormObject("main", "cmbJobCodesFilterSelect", "cmbJobCodesFilterSelect_GroupProfile");
				fld = [self.main, pFormObj, getSeaPhrase("JOB_OPENINGS_6","ESS")];			
				break;
			case "job_category":
				pFormObj = GetTextBoxFormObject("main", "CategoryFilterSelect", "CategoryFilterSelect_ExploreCareers");
				fld = [self.main, pFormObj, getSeaPhrase("CM_28","CM")];
				break;	
			case "jobs_by_category":
				fld = [null, null, getSeaPhrase("JOB_OPENINGS_6","ESS")];
				break;	
			case "job_openings":
				fld = [null, null, getSeaPhrase("CM_85","CM")];
				break;	
			case "reviews":		
				fld = [null, null, getSeaPhrase("CM_344","CM")];
				break;	
			case "training_history":			
				fld = [null, null, getSeaPhrase("CM_345","CM")];
				break;
			case "training_registration":	
				fld = [null, null, getSeaPhrase("CM_346","CM")];
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
	var pFormObj;
	switch (fieldNm.toLowerCase())
	{	
		case "competency":
			pFormObj = (_CURRENTTAB == "ACTIONPLAN") ?
				GetFormFromStansWindowLayer("main", "QualificationsDetail_MyActionPlanWindow", "qualificationform"):
				GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");		
			pFormObj.code.value = "";
			pFormObj.type.value = "";
			if (typeof(pFormObj.qualification) != "undefined")
				pFormObj.qualification.value = "";
			if (self.main.document.getElementById("competencyType"))
				self.main.document.getElementById("competencyType").innerHTML = "";
			self.main.document.getElementById("competencyDesc").innerHTML = "";
			FilterProficiencies(pFormObj,true);
			break;			
		case "certification":
			pFormObj = (_CURRENTTAB == "ACTIONPLAN") ?
				GetFormFromStansWindowLayer("main", "QualificationsDetail_MyActionPlanWindow", "qualificationform"):
				GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");
			pFormObj.code.value = "";
			if (typeof(pFormObj.qualification) != "undefined")
				pFormObj.qualification.value = "";
			self.main.document.getElementById("certificationDesc").innerHTML = "";
			break;			
		case "degree":
			pFormObj = (_CURRENTTAB == "ACTIONPLAN") ?
				GetFormFromStansWindowLayer("main", "QualificationsDetail_MyActionPlanWindow", "qualificationform"):
				GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");
			pFormObj.degree.value = "";
			if (typeof(pFormObj.qualification) != "undefined")
				pFormObj.qualification.value = "";
			self.main.document.getElementById("degreeDesc").innerHTML = "";
			break;
		case "competency_list":
		case "certification_list":
		case "degree_list":
			break;						
		case "subject":
			pFormObj = (_CURRENTTAB == "ACTIONPLAN") ?
				GetFormFromStansWindowLayer("main", "QualificationsDetail_MyActionPlanWindow", "qualificationform"):
				GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");
			pFormObj.subject.value = "";
			self.main.document.getElementById("subjectDesc").innerHTML = "";
			break;
		case "instructor":
			pFormObj = (_CURRENTTAB == "ACTIONPLAN") ?
				GetFormFromStansWindowLayer("main", "QualificationsDetail_MyActionPlanWindow", "qualificationform"):
				GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");
			pFormObj.instructor.value = "";
			self.main.document.getElementById("instructorDesc").innerHTML = "";
			break;			
		case "skillsource":
			pFormObj = (_CURRENTTAB == "ACTIONPLAN") ?
				GetFormFromStansWindowLayer("main", "QualificationsDetail_MyActionPlanWindow", "qualificationform"):
				GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");
			pFormObj.skillsource.value = "";
			self.main.document.getElementById("skillsourceDesc").innerHTML = "";
			break;
		default:
			break;
	}	
}	

function drawDmeFieldFilterContent(dmeFilter)
{
	var selectHtml = new Array();
	var fieldNm = dmeFilter.getFieldNm().toLowerCase();
	var fldObj = getDmeFieldElement(fieldNm);
	var fldDesc = fldObj[2];	
	var dmeRecs = (fieldNm == "job_openings") ? self.HIDDEN.record : self.jsreturn.record;
	var nbrDmeRecs = dmeRecs.length;	
	switch (fieldNm)
	{	
		case "competency":
		case "certification":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" style="width:100%" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("QUAL_4","ESS")+'</th>'
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
		case "degree":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" style="width:100%" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'	
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("QUAL_17","ESS")+'</th>'
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
		case "competency_list":
		case "certification_list":
			var tmpObj;
			selectHtml[0] = '<table class="filterListTable" border="0" cellspacing="0" cellpadding="0" style="width:100%" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("QUAL_4","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++)
			{
				tmpObj = dmeRecs[i];
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterListTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.code) ? tmpObj.code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0)
			{
				selectHtml[1] = '<tr class="filterListTableRow2">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;		
		case "degree_list":
			var tmpObj;
			selectHtml[0] = '<table class="filterListTable" border="0" cellspacing="0" cellpadding="0" style="width:100%" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'	
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("QUAL_17","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++)
			{
				tmpObj = dmeRecs[i];
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterListTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.code) ? tmpObj.code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0)
			{
				selectHtml[1] = '<tr class="filterListTableRow2">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;		
		case "subject":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" style="width:100%" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("QUAL_18","ESS")+'</th>'
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
		case "instructor":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" style="width:100%" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("QUAL_20","ESS")+'</th>'
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
		case "skillsource":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" style="width:100%" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("QUAL_6","ESS")+'</th>'
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
/*		
		case "state":
			if (stateProvFilter == "state") 
			{
				var tmpObj;
				selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" style="width:100%" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
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
				selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" style="width:100%" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
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
*/		
		case "currencycode":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" style="width:100%" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
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
		case "course_category":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" style="width:100%" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'	
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("CM_171","CM")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("CM_134","CM")+'</th></tr>'
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
		case "job_title":
		case "job_alert1":
		case "job_alert2":
		case "job_alert3":
		case "job_group_profile":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" style="width:100%" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
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
		case "job_category":
			var tmpObj;
			selectHtml[0] = '<table class="filterTable" border="0" cellspacing="0" cellpadding="0" style="width:100%" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("CM_28","CM")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("CM_134","CM")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.job_class) ? tmpObj.job_class : '&nbsp;'
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
		case "jobs_by_category":
			var tmpObj;
			selectHtml[0] = '<span class="contenttextCM" style="padding-left:5px">'+getSeaPhrase("CM_184","CM")+'</span><p/>'
			selectHtml[0] += '<table class="filterListTable" border="0" cellspacing="0" cellpadding="0" style="width:100%" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_6","ESS")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("JOB_OPENINGS_2","ESS")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterListTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.job_code) ? tmpObj.job_code : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.description) ? tmpObj.description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterListTableRow2">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "job_openings":
			var tmpObj;
			selectHtml[0] = '<form name="jobOpenings">'
			selectHtml[0] += '<table class="filterListTable" border="0" cellspacing="0" cellpadding="0" style="width:100%" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50px">'+getSeaPhrase("CM_133","CM")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:30%">'+getSeaPhrase("CM_134","CM")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:30%">'+getSeaPhrase("CM_135","CM")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:30%">'+getSeaPhrase("CM_136","CM")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr class="filterListTableRow">'
				selectHtml[i+1] += '<td nowrap>'
				selectHtml[i+1] += '<input type="checkbox" value="on" id="openings'+i+'" name="openings'+i+'">'
				selectHtml[i+1] += '</td><td style="padding-left:5px" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += '<label for="openings'+i+'">'+((tmpObj.description) ? tmpObj.description : '&nbsp;')+'<span class="offscreen"> '+tmpObj.location_description+' '+tmpObj.department_name+'</span></label>'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += ((tmpObj.location_description) ? tmpObj.location_description : '&nbsp;')
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += ((tmpObj.department_name) ? tmpObj.department_name : '&nbsp;')			
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterListTableRow2">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="4" nowrap>'+getSeaPhrase("NORECS","ESS")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table></form>'
		break;
		case "reviews":
			var tmpObj;
			selectHtml[0] = '<table class="filterListTable" border="0" cellspacing="0" cellpadding="0" style="width:100%" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("CM_330","CM")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("CM_50","CM")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterListTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.sched_date) ? tmpObj.sched_date : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.review_type_description) ? tmpObj.review_type_description : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterListTableRow2">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("CM_331","CM")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;
		case "training_history":
			var tmpObj;
			selectHtml[0] = '<table class="filterListTable" border="0" cellspacing="0" cellpadding="0" style="width:100%" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("CM_335","CM")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("CM_336","CM")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterListTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.course_short_crs_desc) ? tmpObj.course_short_crs_desc : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.date_completed) ? tmpObj.date_completed : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterListTableRow2">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("CM_331","CM")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;	
		case "training_registration":
			var tmpObj;
			selectHtml[0] = '<table class="filterListTable" border="0" cellspacing="0" cellpadding="0" style="width:100%" styler="list" summary="'+getSeaPhrase("TSUM_11","SEA",[fldDesc])+'">'
			selectHtml[0] += '<caption class="offscreen">'+getSeaPhrase("TCAP_8","SEA",[fldDesc])+'</caption>'
			selectHtml[0] += '<tr><th scope="col" style="width:50%">'+getSeaPhrase("CM_335","CM")+'</th>'
			selectHtml[0] += '<th scope="col" style="width:50%">'+getSeaPhrase("CM_289","CM")+'</th></tr>'
			for (var i=0; i<nbrDmeRecs; i++) 
			{
				tmpObj = dmeRecs[i];		
				selectHtml[i+1] = '<tr onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false" class="filterListTableRow">'
				selectHtml[i+1] += '<td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.course_short_crs_desc) ? tmpObj.course_short_crs_desc : '&nbsp;'
				selectHtml[i+1] += '</a></td><td style="padding-left:5px" nowrap><a href="javascript:;" onclick="dmeFieldRecordSelected(event,'+i+',\''+fieldNm+'\');return false">'
				selectHtml[i+1] += (tmpObj.start_date) ? tmpObj.start_date : '&nbsp;'
				selectHtml[i+1] += '</a></td></tr>'
			}
			if (nbrDmeRecs == 0) 
			{
				selectHtml[1] = '<tr class="filterListTableRow2">'
				selectHtml[1] += '<td style="padding-left:5px" colspan="2" nowrap>'+getSeaPhrase("CM_331","CM")+'</td></tr>'
			}
			selectHtml[selectHtml.length] = '</table>'
		break;		
		default: break;
	}
	dmeFilter.getRecordElement().innerHTML = selectHtml.join("");	
}
/* Filter Select logic - end */

/*
 *	Common Layer/Div Element Functionality
 */
var MAX = (1.79E+308);
var layerList = new Array();
var LayerObject = new Array();
var LayerObjectCount = 0

function _cbdhtml_ResetAll()
{
	layerList = new Array();
	LayerObject = new Array();
	LayerObjectCount = 0
}

function LayerObjTemp(framename, name, left, top, width, height, visible, content, bgtype, background)
{
	this.name = name
	this.framename = framename
	this.codename = name
	if (isNaN(name.substring(0,1)))
	{
		if (eval("typeof(" + name + "Code) != \"undefined\""))
			this.description=eval(name + "Description")
		else
			this.description = name
	}
	else
		this.description = name
	this.width = width
	this.height = height
	this.left = left
	this.top = top
	this.clipwidth = 0
	this.clipheight = 0
	this.clipleft = 0
	this.cliptop = 0
	this.flyleft = null
	this.flytop = null
	this.flyclipwidth = null
	this.flyclipheight = null
	this.visible = visible
	this.modvisible = null
	this.source = content
	this.zindex = 0
	this.bgtype = bgtype
	this.background = background
	this.codechanged = false
	this.dimable = false
	this.dim = false
}

function setHorizontalPos(layerElm, hPos)
{
	if (!layerElm)
		return;
	if (typeof(styler) != "undefined" && styler != null && styler.textDir == "rtl")
		layerElm.style.right = hPos;
	else
		layerElm.style.left = hPos;
}

function createLayer(framename, name, left, top, width, height, visible, content, bgtype, background, MSScroll, IFrame, zIndex)
{
  	var docLoc = getDocLoc(framename)
  	if (eval("typeof(" + name + "Code) != \"undefined\""))
  	{
		var test="content=repStr(" + name + "Code,'%%',\"'\")"
		eval(test)
		content=repStr(content,"^^",unescape("%0A"))
		var test="left=" + name + "Left"
		eval(test)
		var newtop=top
		var test="newtop=" + name + "Top"
		eval(test)
		top=newtop
		var test="width=" + name + "Width"
		eval(test)
		var test="height=" + name + "Height"
		eval(test)
	}
  	if (eval("typeof(" + name + "Visible) != \"undefined\"")) 
  	{
		var test="visible=" + name + "Visible"
		eval(test)
	}
  	LayerObject[LayerObjectCount++] = new LayerObjTemp(framename, name, left, top, width, height, visible, content, bgtype, background)
  	if (eval("typeof(" + name + "Code) != \"undefined\""))
		LayerObject[LayerObjectCount-1].codechanged=true
  	var z = layerList.length;
  	if (zIndex)  	
  		z = zIndex;
  	var layer;
	layerList[z] = name;
  	if (docLoc.all || docLoc.getElementById) 
  	{
		var divObj = docLoc.createElement("DIV");
		divObj.setAttribute("id",name)
		divObj.style.position = "absolute"
		divObj.style.overflow = (MSScroll) ? "auto" : "hidden"
		if (MSScroll)
			divObj.setAttribute("tabindex", "0");
		setHorizontalPos(divObj, left+"px");	
		divObj.style.top = top + "px"
		var widthStr = (isNaN(Number(width))) ? width + "" : width + "px";
		var heightStr = (isNaN(Number(height))) ? height + "" : height + "px";
		divObj.style.width = widthStr;
		divObj.style.height = heightStr;
		divObj.style.visibility = (visible) ? "visible" : "hidden"
		//zIndex conflicts with UX 3.0 tab overflow menu
		//divObj.style.zIndex = z
		divObj.style.clip = "rect(0px " +  widthStr + " " + heightStr + " " + "0px)";
		if (background != '') 
		{
			if (bgtype == "color")
				divObj.style.backgroundColor = background 
			else
				divObj.style.backgroundImage = "url(" + background + ")"
		}
		if (docLoc.body)
			docLoc.body.appendChild(divObj);
		divObj.innerHTML = content + '<div id="bottom">&nbsp;</div>'
  	}
	
  	// clipLayer(framename, name, 0, 0, width, height);
	LayerObject[LayerObjectCount-1].width=width
	LayerObject[LayerObjectCount-1].height=height
  	if (eval("typeof(" + name + "Code) != \"undefined\"")) 
  	{
		var test = name+"zindex"
	  	setzIndex(framename, name, eval(test))
	}
	LayerObject[LayerObjectCount-1].zindex=getzIndex(framename, name)
}

// button change
function buttonLayer(framename, name, left, top, width, height, visible, content, bgtype, background, MSScroll, IFrame, zIndex)
{
  	var docLoc = getDocLoc(framename);
  	if (eval("typeof(" + name + "Code) != \"undefined\""))
  	{
		var test="content=repStr(" + name + "Code,'%%',\"'\")"
		eval(test)
		content=repStr(content,"^^",unescape("%0A"))
		var test="left=" + name + "Left"
		eval(test)
		var newtop=top
		var test="newtop=" + name + "Top"
		eval(test)
		top=newtop
		var test="width=" + name + "Width"
		eval(test)
		var test="height=" + name + "Height"
		eval(test)
	}
  	if (eval("typeof(" + name + "Visible) != \"undefined\"")) 
  	{
		var test="visible=" + name + "Visible"
		eval(test)
	}
  	LayerObject[LayerObjectCount++] = new LayerObjTemp(framename, name, left, top, width, height, visible, content, bgtype, background)
  	if (eval("typeof(" + name + "Code) != \"undefined\""))
		LayerObject[LayerObjectCount-1].codechanged=true
  	var z = layerList.length;
  	if (zIndex)  	
  		z = zIndex;
  	var layer;
	layerList[z] = name;
  	if (docLoc.all || docLoc.getElementById) 
  	{
		var LayHTML = '<div id="' + name + '" style="position:relative;overflow:'
		if (MSScroll)
			LayHTML	+= 'auto'
		else
			LayHTML	+= 'hidden'
		if (typeof(styler) != "undefined" && styler != null && styler.textDir == "rtl")
			LayHTML	+= '; right:' + left + 'px;'
		else
			LayHTML	+= '; left:' + left + 'px;'
		var widthStr = (isNaN(Number(width))) ? width + "" : width + "px";
		var heightStr = (isNaN(Number(height))) ? height + "" : height + "px";			
		LayHtml += ' top:' + top + 'px; width:' + widthStr + '; height:' + heightStr + ';' + ' visibility:' + (visible ? 'visible;' : 'hidden;') + ' z-index:' + z;
		LayHTML	+= "clip:rect(0px " +  widthStr + " " + heightStr + " " + "0px)";
		if (background == '')
			LayHTML	+= '">'
		else 
		{
			if (bgtype == "color")
				LayHTML	+= ";background-color:" + background + '">'
			else
				LayHTML	+= ";background-image:url(" + background + ')">'
		}
		LayHTML	+= content;
		LayHTML	+= '<div id="bottom">&nbsp</div></div>';
  	}
  	// clipLayer(framename, name, 0, 0, width, height);
	LayerObject[LayerObjectCount-1].width=width
	LayerObject[LayerObjectCount-1].height=height
  	if (eval("typeof(" + name + "Code) != \"undefined\"")) 
  	{
		var test= name + "zindex"
	  	setzIndex(framename, name, eval(test))
	}
	LayerObject[LayerObjectCount-1].zindex=getzIndex(framename, name)
	return LayHTML;
}

function enableDimming(framename, name, level)
{
	var Index = getObjectIndex(framename, name)
	if (Index !=null)
  	{
		LayerObject[Index].dimable = true
		LayerObject[Index].dim = true
		var levelImg = null;
		if (level == 25)
			levelImg = "/lawson/xhrnet/careermanagement/lib/images/dim25.gif"
		else
		if (level == 50)
			levelImg = "/lawson/xhrnet/careermanagement/lib/images/dim50.gif"
		else
		if (level == 75)
			levelImg = "/lawson/xhrnet/careermanagement/lib/images/dim75.gif"
		else
			levelImg = "/lawson/xhrnet/careermanagement/lib/images/dim100.gif"
		createLayer(framename,"DiM" + name,	LayerObject[Index].left,LayerObject[Index].top,LayerObject[Index].width,LayerObject[Index].height,false,"","image",levelImg);
		setzIndex(framename,"DiM" + name,(LayerObject[Index].zindex+1))
	}
}

function dimLayer(framename, name)
{
	var Index = getObjectIndex(framename, name)
	if (!LayerObject[Index].dimable)
	{
		alert(getSeaPhrase("CM_166","CM"))
		return
	}
	if (Index !=null)
  	{
		LayerObject[Index].dim = true
		showLayer(framename,"DiM" + name)
	}
}

function liteLayer(framename, name)
{
	var Index = getObjectIndex(framename, name)
	if (!LayerObject[Index].dimable)
	{
		alert(getSeaPhrase("CM_167","CM"))
		return
	}
	if (Index !=null)
  	{
		LayerObject[Index].dim = false
		hideLayer(framename,"DiM" + name)
	}
}

function flyAway(framename, name, speed, mapdir)
{
	var Index = getObjectIndex(framename, name)
	LayerObject[Index].flyleft = LayerObject[Index].left
	LayerObject[Index].flytop = LayerObject[Index].top
	LayerObject[Index].flyclipwidth = getClipWidth(framename, name)
	LayerObject[Index].flyclipheight = getClipHeight(framename, name)
	var flyx
	var flyy
	swipeLayer(framename, name, 0, 0, 20, 20,parseInt(speed/2), "")
	switch (mapdir)
	{
		case "N":
			flyx=getWinWidth("main")/2;flyy=-30
			break
		case "NE":
			flyx=getWinWidth("main")+30;flyy=-30
			break
		case "NW":
			flyx=-300;flyy=-30
			break
		case "S":
			flyx=-30;flyy=getWinHeight("main")+30
			break
		case "SE":
			flyx=getWinWidth("main")+30;flyy=getWinHeight("main")+30
			break
		case "SW":
			flyx=-30;flyy=getWinHeight("main")+30
			break
		case "E":
			flyx=getWinWidth("main")+30;flyy=getWinHeight("main")/2
			break
		case "W":
			flyx=-30;flyy=getWinHeight("main")/2
			break
	}
	slideLayer(framename, name, flyx, flyy,speed)
}

function flyIn(framename, name, speed, flyleft, flytop, flyclipwidth, flyclipheight)
{
	// all fly values are overrides if a flyaway was already done
	var Index = getObjectIndex(framename, name)
	if(((typeof(flyleft) == "undefined")||(typeof(flytop) == "undefined")||(typeof(flylwidth) == "undefined")||(typeof(flyheight) == "undefined"))
		&&((LayerObject[Index].flyleft == null)&&(LayerObject[Index].flytop == null)&&(LayerObject[Index].flyclipwidth == null)&&(LayerObject[Index].flyclipheight == null)))
		return
	if(typeof(flyleft) == "undefined")
		flyleft= LayerObject[Index].flyleft
	if(typeof(flytop) == "undefined")
		flyleft= LayerObject[Index].flytop
	if(typeof(flylwidth) == "undefined")
		flyleft= LayerObject[Index].flywidth
	if(typeof(flyheight) == "undefined")
		flyleft= LayerObject[Index].flyheight
	slideLayer(framename, name, LayerObject[Index].flyleft, LayerObject[Index].flytop,speed)
	swipeLayer(framename, name, 0, 0, LayerObject[Index].flyclipwidth, LayerObject[Index].flyclipheight,parseInt(speed/2), "")
}

function bgColorLayer(framename, name, color) 
{
  var layer = getLayer(framename, name);
  var docLoc = getDocLoc(framename);
  var Index = getObjectIndex(framename, name);
  if (Index !=null)
  {
	LayerObject[Index].bgtype="color"
	LayerObject[Index].background=color
  }
  if (docLoc.layers)
    layer.bgColor = color;
  if (docLoc.all || docLoc.getElementById)
    layer.backgroundColor = color;
}

function bgImageLayer(framename, name, image) 
{
  var layer = getLayer(framename, name);
  var docLoc = getDocLoc(framename);
  var Index = getObjectIndex(framename, name);
  if (Index !=null)
  {
	LayerObject[Index].bgtype="image"
	LayerObject[Index].background=image
  }
  if (docLoc.layers)
    layer.background = image;
  if (docLoc.all || docLoc.getElementById)
      layer.backgroundImage = image;
}

function hideLayer(framename, name) 
{
	var layer = getLayer(framename, name);
	var docLoc = getDocLoc(framename);
	var Index = getObjectIndex(framename, name);
	if (typeof(layer) == "undefined") return;
	if (Index != null)
		LayerObject[Index].visible = false;
	layer.zIndex = 0;
	if (docLoc.layers)
		layer.visibility = "hide";
	if (docLoc.all || docLoc.getElementById)
		layer.visibility = "hidden";
}

function showLayer(framename, name, zIndex) 
{
	var layer = getLayer(framename, name);
	var docLoc = getDocLoc(framename);
	var Index = getObjectIndex(framename, name);
	if (typeof(layer) == "undefined") return;
	if (Index != null)
		LayerObject[Index].visible = true;
	if (docLoc.layers)
	{
		layer.visibility = "show";
		layer.zIndex = (typeof(zIndex)!="undefined"&&zIndex!=null)?zIndex:99999999;
	}
	if (docLoc.all || docLoc.getElementById)
	{
		layer.visibility = "visible";
		if (typeof(zIndex)!="undefined" && zIndex!=null)
			layer.zIndex = zIndex;
		else
			layer.zIndex = LayerObject[Index].zindex;
	}
}

function isVisible(framename, name) 
{
	var layer = getLayer(framename, name);
	var docLoc = getDocLoc(framename);
	if (docLoc.layers && layer.visibility == "show")
		return true;
	if ((docLoc.all || docLoc.getElementById) && layer.visibility == "visible")
		return true;
	return false;
}

function moveLayer(framename, name, x, y) 
{
  var layer = getLayer(framename, name);
  var docLoc = getDocLoc(framename)
  var Index = getObjectIndex(framename, name)
  if (Index !=null)
  {
		LayerObject[Index].left = x
		LayerObject[Index].top = y
  }
  if (docLoc.layers)
    layer.moveTo(x, y);
  if (docLoc.all || docLoc.getElementById) 
  {
  	if (typeof(styler) != "undefined" && styler != null && styler.textDir == "rtl")
  		layer.right = x;
  	else
    	layer.left = x;
    layer.top  = y;
  }
}

var animRate = 50;    // Basically sets the update rate for animations.

function getDocLoc(framename)
{
	var docLoc;
	if (framename == '')
		docLoc = document;
	else
		docLoc = eval(framename+".document");
	return docLoc;
}

function slideLayer(framename, name, x, y, speed) 
{
  var layer = getLayer(framename, name);
  var hrzn, vert, left, top, steps;
  var docLoc = getDocLoc(framename)
  // If the layer is currently being moved, wait and try again later.
  if (layer.slideID && layer.slideID != null) 
  {
    setTimeout('slideLayer("' + framename + '","' + name + '", ' + x + ', ' + y + ', ' + speed + ')', animRate);
    return;
  }
  if (docLoc.layers) 
  {
    hrzn = x - layer.left;
    vert = y - layer.top;
    left = layer.left;
    top  = layer.top;
  }
  if (docLoc.all || docLoc.getElementById) 
  {
    hrzn = x - layer.pixelLeft;
    vert = y - layer.pixelTop;
    left = layer.pixelLeft;
    top  = layer.pixelTop;
  }
  // Calculate how many steps it will take and the size of each step.
  steps = (Math.max(Math.abs(hrzn), Math.abs(vert)) / speed) * (1000 / animRate);
  if (steps <= 0)
    return;
  layer.slideLeft = left;
  layer.slideTop = top;
  layer.slideDx = hrzn / steps;
  layer.slideDy = vert / steps;
  layer.slideFinalX = x;
  layer.slideFinalY = y;
  layer.slideSteps = Math.floor(steps);
  layer.slideID = setTimeout('slideStep("' + framename + '","' + name + '")', animRate);
}

function slideStep(framename, name) 
{
  // Moves the layer one step.
  var layer = getLayer(framename, name);
  var docLoc = getDocLoc(framename);
  layer.slideLeft += layer.slideDx;
  layer.slideTop  += layer.slideDy;
  if (docLoc.layers)
    layer.moveTo(layer.slideLeft, layer.slideTop);
  if (docLoc.all || docLoc.getElementById) 
  {
  	if (typeof(styler) != "undefined" && styler != null && styler.textDir == "rtl")
  		layer.right = layer.slideLeft;
  	else
    	layer.left = layer.slideLeft;
    layer.top  = layer.slideTop;
  }
  // If more steps remain, call this function again.
  if (layer.slideSteps-- > 0)
    layer.slideID = setTimeout('slideStep("' + framename + '","' + name + '")', animRate);
  // Otherwise, move layer to final position.
  else 
  {
   	if (docLoc.layers)
      layer.moveTo(layer.slideFinalX, layer.slideFinalY);
    if (docLoc.all || docLoc.getElementById) 
    {
      if (typeof(styler) != "undefined" && styler != null && styler.textDir == "rtl")
      	layer.right = layer.slideFinalX;
      else
      	layer.left = layer.slideFinalX;
      layer.top  = layer.slideFinalY;
    }
    layer.slideID = null;
  }
}

function clipLayer(framename, name, clipleft, cliptop, clipright, clipbottom) 
{
  var layer = getLayer(framename, name);
  var docLoc = getDocLoc(framename);
  var Index = getObjectIndex(framename, name);
  if (Index !=null)
  {
	LayerObject[Index].width=(clipright-clipleft)
	LayerObject[Index].height=(clipbottom-cliptop)
  }
  if (docLoc.layers) 
  {
    layer.clip.left   = clipleft;
    layer.clip.top    = cliptop;
    layer.clip.right  = clipright;
    layer.clip.bottom = clipbottom;
  }
  if (docLoc.all || docLoc.getElementById)
    layer.clip = 'rect(' + cliptop + 'px ' +  clipright + 'px ' + (clipbottom + 2) + 'px ' + clipleft +'px)';
}

function swipeLayer(framename, name, clipleft, cliptop, clipright, clipbottom, speed, FTR) 
{
  var layer = getLayer(framename, name);
  var docLoc = getDocLoc(framename)
  var hrzn1, vert1;
  var hrzn2, vert2;
  var max1, max2;
  var steps;
  // If the layer is currently being clipped, wait and try again later.
  if (layer.swipeID && layer.swipeID != null) 
  {
    setTimeout('swipeLayer("' + framename + '","' + name + '", ' + clipleft + ', ' + cliptop + ', ' + clipright + ', ' + clipbottom + ', ' + speed + ',"' + FTR + '")', animRate);
    return;
  }
  if (docLoc.layers) 
  {
    hrzn1 = clipleft - layer.clip.left;
    vert1 = cliptop - layer.clip.top;
    hrzn2 = clipright - layer.clip.right;
    vert2 = clipbottom - layer.clip.bottom;
  }
  if (docLoc.all || docLoc.getElementById) 
  {
    if (!layer.clip)
      clipLayer(framename, name, 0, 0, layer.pixelWidth, layer.pixelHeight);
    var clip = getClipValues(layer.clip);
    hrzn1 = clipleft - clip[3];
    vert1 = cliptop - clip[0];
    hrzn2 = clipright - clip[1];
    vert2 = clipbottom - clip[2];
  }
  max1 = Math.max(Math.abs(hrzn1), Math.abs(vert1));
  max2 = Math.max(Math.abs(hrzn2), Math.abs(vert2));
  steps = (Math.max(max1, max2) / speed) * (1000 / animRate);
  if (steps <= 0)
    return;
  if (docLoc.layers) 
  {
    layer.swipeLeft   = layer.clip.left;
    layer.swipeTop    = layer.clip.top;
    layer.swipeRight  = layer.clip.right;
    layer.swipeBottom = layer.clip.bottom;
  }
  if (docLoc.all || docLoc.getElementById) 
  {
    layer.swipeLeft   = parseInt(clip[3], 10);
    layer.swipeTop    = parseInt(clip[0], 10);
    layer.swipeRight  = parseInt(clip[1], 10);
    layer.swipeBottom = parseInt(clip[2], 10);
  }
  layer.swipeDx1 = hrzn1 / steps;
  layer.swipeDy1 = vert1 / steps;
  layer.swipeDx2 = hrzn2 / steps;
  layer.swipeDy2 = vert2 / steps;
  layer.swipeFinalLeft   = clipleft;
  layer.swipeFinalTop    = cliptop;
  layer.swipeFinalRight  = clipright;
  layer.swipeFinalBottom = clipbottom;
  layer.swipeSteps = Math.floor(steps);
  layer.swipeID = setTimeout('swipeStep("' + framename +  '","' + name + '","' + FTR + '")', animRate);
}

function swipeStep(framename, name, FTR) 
{
  var layer = getLayer(framename, name);
  var docLoc = getDocLoc(framename)
  // Adjust the layer's clipping area by one step.
  layer.swipeLeft += layer.swipeDx1;
  layer.swipeTop += layer.swipeDy1;
  layer.swipeRight += layer.swipeDx2;
  layer.swipeBottom += layer.swipeDy2;
  if (docLoc.layers) 
  {
    layer.clip.left   = layer.swipeLeft;
    layer.clip.top    = layer.swipeTop;
    layer.clip.right  = layer.swipeRight;
    layer.clip.bottom = layer.swipeBottom;
  }
  if (docLoc.all || docLoc.getElementById)
    layer.clip = 'rect(' + layer.swipeTop + ' ' + layer.swipeRight + ' ' + layer.swipeBottom + ' ' + layer.swipeLeft +')';
  // If more steps remain, call this function again.
  if (--layer.swipeSteps > 0)
    layer.swipeID = setTimeout('swipeStep("' + framename + '","' + name + '","' + FTR + '")', animRate);
  // Otherwise, set layer's final clip area.
  else 
  {
    if (docLoc.layers) 
    {
      layer.clip.left   = Math.round(layer.swipeFinalLeft);
      layer.clip.top    = Math.round(layer.swipeFinalTop);
      layer.clip.right  = Math.round(layer.swipeFinalRight);
      layer.clip.bottom = Math.round(layer.swipeFinalBottom);
    }
    if (docLoc.all || docLoc.getElementById)
      layer.clip = 'rect(' + layer.swipeFinalTop + ' ' + layer.swipeFinalRight + ' ' + layer.swipeFinalBottom + ' ' + layer.swipeFinalLeft +')';
    layer.swipeID = null;
	if (FTR != "")
	{	
		if (typeof(FTR) != 'undefined' )
		{
			if (FTR != 'undefined')
				eval(FTR)
		}
	}	
  }
}

function scrollLayer(framename, name, dx, dy) 
{
  var cl = getClipLeft(framename, name);
  var ct = getClipTop(framename, name);
  var cr = getClipRight(framename, name);
  var cb = getClipBottom(framename, name);
  var l  = getLeft(framename, name);
  var t  = getTop(framename, name);
  var docLoc = getDocLoc(framename);
  // If scrolling the given amounts would move past the edges of the layer,
  // adjust the values so we stop right at the edge.
  if (cl + dx < 0)
    dx = -cl;
  else if (cr + dx > getWidth(framename, name))
    dx = getWidth(framename, name) - cr;
  if (dx< 0)
	dx = 0
  if (ct + dy < 0)
	dy = -ct;
  else if (getDocumentBottom(framename, name) < cb-ct && docLoc.layers)
	return
  else if (cb + dy > getHeight(framename, name))
    dy = getHeight(framename, name) - cb;
  else if ((cb + dy > getDocumentBottom(framename, name)) && (docLoc.layers))
	dy = getDocumentBottom(framename, name) - cb;
  // Move both the clipping region and the layer so that the contents move
  // but the viewable region of the layer appears fixed relative to the page.
  clipLayer(framename, name, cl + dx, ct + dy, cr + dx, cb + dy);
  moveLayer(framename, name, l - dx, t - dy);
}

var ReplaceIP = false;

function replaceContent(framename, name, content)
{
	var docLoc = getDocLoc(framename);
	var Index = getObjectIndex(framename, name);
	if (Index !=null)
		LayerObject[Index].source = content;
	if (docLoc.layers)
	{
		with (getLayer(framename,name).document)
		{
			open();
			write(content);
			write("<layer name=bottom>&nbsp</layer>")
			close();
		}
	}
	else if (docLoc.getElementById)
		docLoc.getElementById(name).innerHTML = repStr(content,"'","&#39;");
	else if (docLoc.all)
	{	
		var str = "docLoc.all." + name + ".innerHTML = '" + repStr(content,"'","&#39;") + "';";
		eval(str);
	}
}

function getObjectIndex(framename, name)
{
	for (x=0; x<LayerObjectCount; x++)
	{
		if ((LayerObject[x].name == name) && (LayerObject[x].framename == framename))
			return x
	}
	return null
}

function getLeft(framename, name) 
{
  var layer = getLayer(framename, name);
  var docLoc = getDocLoc(framename)
  if (docLoc.layers)
    return(layer.left);
  else if (docLoc.all || docLoc.getElementById)
    return(layer.pixelLeft);
  else
    return(null);
}

function getTop(framename, name) 
{
  var layer = getLayer(framename, name);
  var docLoc = getDocLoc(framename)
  if (docLoc.layers)
    return(layer.top);
  else if (docLoc.all || docLoc.getElementById)
    return(layer.pixelTop);
  else
    return(null);
}

function getWidth(framename, name) 
{
  var layer = getLayer(framename, name);
  var docLoc = getDocLoc(framename)
  if (docLoc.layers)
    return(layer.width);
  else if (docLoc.all || docLoc.getElementById)
    return(layer.pixelWidth);
  else
    return(null)
}

function getHeight(framename, name) 
{
  var layer = getLayer(framename, name);
  var docLoc = getDocLoc(framename)
  if (docLoc.layers)
    return(layer.height);
  else if (docLoc.all || docLoc.getElementById)
    return(layer.pixelHeight);
  else
    return(null);
}

function getClipLeft(framename, name) 
{
  var layer = getLayer(framename, name);
  var docLoc = getDocLoc(framename)
  if (docLoc.layers)
    return(layer.clip.left);
  else if (docLoc.all || docLoc.getElementById) {
    var str =  layer.clip;
    if (!str)
      return(0);
    var clip = getClipValues(layer.clip);
    return(clip[3]);
  }
  else
    return(null);
}

function getClipTop(framename, name) 
{
  var layer = getLayer(framename, name);
  var docLoc = getDocLoc(framename)
  if (docLoc.layers)
    return(layer.clip.top);
  else if (docLoc.all || docLoc.getElementById) {
    var str =  layer.clip;
    if (!str)
      return(0);
    var clip = getClipValues(layer.clip);
    return(clip[0]);
  }
  else
    return(null);
}

function getClipRight(framename, name) 
{
  var layer = getLayer(framename, name);
  var docLoc = getDocLoc(framename)
  if (docLoc.layers)
    return(layer.clip.right);
  else if (docLoc.all || docLoc.getElementById) {
    var str =  layer.clip;
    if (!str)
      return(layer.pixelWidth);
    var clip = getClipValues(layer.clip);
    return(clip[1]);
  }
  else
    return(null);
}

function getClipBottom(framename, name) 
{
  var layer = getLayer(framename, name);
  var docLoc = getDocLoc(framename)
  if (docLoc.layers)
    return(layer.clip.bottom);
  else if (docLoc.all || docLoc.getElementById) {
    var str =  layer.clip;
    if (!str)
      return(layer.pixelHeight);
    var clip = getClipValues(layer.clip);
    return(clip[2]);
  }
  else
    return(null);
}

function getClipWidth(framename, name) 
{
	var layer = getLayer(framename, name);
	var docLoc = getDocLoc(framename);
	if (docLoc.layers)
		return(layer.clip.width);
	else if (docLoc.all || docLoc.getElementById) 
	{
		var str = layer.clip;
		if (!str)
			return (layer.pixelWidth);
		var clip = getClipValues(layer.clip);
		return (clip[1] - clip[3]);
	}
	else
		return null;
}

function getClipHeight(framename, name) 
{
	var layer = getLayer(framename, name);
	var docLoc = getDocLoc(framename);
	if (docLoc.layers)
		return(layer.clip.height);
	else if (docLoc.all || docLoc.getElementById) 
	{
		var str = layer.clip;
		if (!str)
			return (layer.pixelHeight);
		var clip = getClipValues(layer.clip);
		return (clip[2] - clip[0]);
	}
	else
		return null;
}

function getWinWidth(framename) 
{
	if (framename == 'undefined')
		framename = 'window';
	var WinObj = eval(framename);
	var docLoc = getDocLoc(framename);
	if (docLoc.layers)
		return (WinObj.innerWidth);
	else if (docLoc.all || docLoc.getElementById)
		return (docLoc.body.clientWidth);
	else
		return null;
}

function getWinHeight(framename) 
{
	if (framename == 'undefined')
		framename = 'window';
	var WinObj = eval(framename);
	var docLoc = getDocLoc(framename);
	if (docLoc.layers)
  		return (WinObj.innerHeight);
	else if (docLoc.all || docLoc.getElementById)
		return (docLoc.body.clientHeight);
	else
		return null;
}

function getzIndex(framename, name) 
{
	var layer = getLayer(framename, name);
	var docLoc = getDocLoc(framename);
	if (docLoc.layers)
		return (layer.zIndex);
	else if (docLoc.all || docLoc.getElementById)
		return (layer.zIndex);
	else
		return null;
}

function setzIndex(framename, name, z) 
{
	var layer = getLayer(framename, name);
	var docLoc = getDocLoc(framename);
	var Index = getObjectIndex(framename, name)
	if (Index !=null)
	{
		if (LayerObject[Index].zindex != z)
		{
			LayerObject[Index].description
			LayerObject[Index].zindex = z
		}
	}
	if (docLoc.layers)
		layer.zIndex = z;
	if (docLoc.all || docLoc.getElementById)
		layer.zIndex = z;
}

function bringToFront(framename, name)
{
	setzIndex(framename, name, 999999999)
}

function sendToBack(framename, name)
{
	setzIndex(framename, name, 0)
}

function sortzIndex(framename, a, b) 
{
	return (getzIndex(framename, a) - getzIndex(framename, b));
}

function getImgSrc(framename, imagename) 
{
	var i, layer;
	var docLoc = getDocLoc(framename);
	// If the image exists in the document object, return the source.
	if (docLoc.images[imagename])
		return docLoc.images[imagename].src;
	// Otherwise, for Netscape, search through the layers for the named image.
	else if (docLoc.layers)
	{
		for (i=0; i<layerList.length; i++) 
		{
			layer = getLayer(framename, layerList[i]);
			if (layer.document.images[imagename])
				return layer.document.images[imagename].src;
		}
	}	
	return null;
}

function setImgSrc(framename, imagename, imagesrc) 
{
	var i, layer;
	var docLoc = getDocLoc(framename);
	// If the image exists in the document object, change the source.
	if (docLoc.images[imagename]) 
	{
		docLoc.images[imagename].src = imagesrc;
		return;
	}
	// Otherwise, for Netscape, search through the layers for the named image.
	else if (docLoc.layers) 
	{
		var found = false;
		for (i=0; i<layerList.length && !found; i++) 
		{
			layer = getLayer(framename, layerList[i]);
			if (typeof(layer) != 'undefined')
			{
				if (layer.document.images[imagename])
				{
					layer.document.images[imagename].src = imagesrc;
					found = true;
				}
			}
		}
	}
}

function getClipValues(str) 
{
	var clip = new Array();
	var i = str.indexOf("(");
	clip[0] = parseInt(str.substring(i + 1, str.length), 10);
	i = str.indexOf(" ", i + 1);
	clip[1] = parseInt(str.substring(i + 1, str.length), 10);
	i = str.indexOf(" ", i + 1);
	clip[2] = parseInt(str.substring(i + 1, str.length), 10);
	i = str.indexOf(" ", i + 1);
	clip[3] = parseInt(str.substring(i + 1, str.length), 10);
	return(clip);
}

function getLayerDocument(framename, name)
{
	var docLoc = getDocLoc(framename);
	var pObj;
	if (docLoc.layers)
		pObj = eval('self.'+framename+'.document.layers["'+name+'"]');
	else if (docLoc.getElementById)
		pObj = eval('docLoc.getElementById("' + name+ '")');
	else if (docLoc.all)
		pObj = eval('docLoc.all.' + name);
	else
		return null;
	if (typeof(pObj) != "undefined" && pObj != null)
		return pObj;
	else
		return null;
}

function getLayer(framename, name) 
{
	// Returns a handle to the named layer.
	var docLoc = getDocLoc(framename);
	if (docLoc.layers)
		return(eval('self.'+framename+'.document.layers["'+name+'"]'));
	else if (docLoc.getElementById)
		return docLoc.getElementById(name).style;
	else if (docLoc.all)
		return eval('docLoc.all.' + name + '.style');
	else
		return null;
}

function GetInputValue(framename, name, LayerMember)
{
  	var docLoc = getDocLoc(framename)
	if (docLoc.all || docLoc.getElementById)
		return eval('docLoc.' + LayerMember + '.value')
	else
		return eval('docLoc.layers["' + name + '"].document.' + LayerMember + '.value')
}

function SetInputValue(framename, name, LayerMember, InputValue)
{
  	var docLoc = getDocLoc(framename)
	if (docLoc.all || docLoc.getElementById)
		eval('docLoc.' + LayerMember + '.value="' + InputValue + '"')
	else
	{
		var TempLayer = eval('docLoc.layers["' + name + '"].document.' + LayerMember)
		TempLayer.value=InputValue
	}
}

function GetCheckboxValue(framename, name, LayerMember)
{
  	var docLoc = getDocLoc(framename)
	if (docLoc.all || docLoc.getElementById)
		return eval('docLoc.' + LayerMember + '.checked')
	else
		return eval('docLoc.layers["' + name + '"].document.' + LayerMember + '.checked')
}

function SetCheckboxValue(framename, name, LayerMember, CheckboxValue)
{
  	var docLoc = getDocLoc(framename)
	if (docLoc.all || docLoc.getElementById)
		eval('docLoc.' + LayerMember + '.checked=' + CheckboxValue)
	else
		eval('docLoc.layers["' + name + '"].document.' + LayerMember + '.checked=' + CheckboxValue)
}

function GetRadioValue(framename, name, LayerMember)
{
	var docLoc = getDocLoc(framename)
	if (docLoc.all || docLoc.getElementById)
	{
		for (var Loop=0; Loop<eval('docLoc.' + LayerMember + '.length'); Loop++)
			if (eval('docLoc.' + LayerMember + "[" + Loop + '].checked'))
				return eval('docLoc.' + LayerMember + "[" + Loop + '].value')
	}
	else
	{
		for (var Loop=0; Loop<eval('docLoc.layers["' + name + '"].document.' + LayerMember + '.length'); Loop++)
 			if (eval('docLoc.layers["' + name + '"].document.' + LayerMember + "[" + Loop + '].checked'))
				return eval('docLoc.layers["' + name + '"].document.' + LayerMember + "[" + Loop + '].value')
	}
}

function SetRadioValue(framename, name, LayerMember, RadioValue)
{
  	var docLoc = getDocLoc(framename)

	if (docLoc.all || docLoc.getElementById)
	{
		for (var Loop=0; Loop<eval('docLoc.' + LayerMember + '.length'); Loop++)
			if (eval('docLoc.' + LayerMember + "[" + Loop + '].value') == RadioValue)
			     eval('docLoc.' + LayerMember + "[" + Loop + '].checked = true')
			else
			     eval('docLoc.' + LayerMember + "[" + Loop + '].checked = false')
	}
	else
	{
		for (var Loop=0; Loop<eval('docLoc.layers["' + name + '"].document.' + LayerMember + '.length'); Loop++)
 			if (eval('docLoc.layers["' + name + '"].document.' + LayerMember + "[" + Loop + '].value') == RadioValue)
				return eval('docLoc.layers["' + name + '"].document.' + LayerMember + "[" + Loop + '].checked = true' )
			else
				return eval('docLoc.layers["' + name + '"].document.' + LayerMember + "[" + Loop + '].checked = false' )
	}
}

function GetListIndex(framename, name, LayerMember)
{
  	var docLoc = getDocLoc(framename)
	if (docLoc.all || docLoc.getElementById)
		return eval('docLoc.' + LayerMember + '.selectedIndex')
	else
		return eval('docLoc.layers["' + name + '"].document.' + LayerMember + '.selectedIndex')
}

function SetListIndex(framename, name, LayerMember, SelIndex)
{
  	var docLoc = getDocLoc(framename)
	if (docLoc.all || docLoc.getElementById)
		eval('docLoc.' + LayerMember + '[' + SelIndex + "].selected = true" )
	else
		eval('docLoc.layers["' + name + '"].document.' + LayerMember + '.options[' + SelIndex + "].selected = true")
}

function FocusInput(framename, name, LayerMember)
{
  	var docLoc = getDocLoc(framename)
	if (docLoc.all || docLoc.getElementById)
	{
		if (isVisible(framename, name))
			eval('docLoc.' + LayerMember + '.focus()')
	}
	else
		eval('docLoc.layers["' + name + '"].document.' + LayerMember + '.focus()')
}

function FocusCheckbox(framename, name, LayerMember)
{
  	var docLoc = getDocLoc(framename)
	if (docLoc.all || docLoc.getElementById)
		eval('docLoc.' + LayerMember + '.focus')
	else
		eval('docLoc.layers["' + name + '"].document.' + LayerMember + '.focus()')
}

var scrolling = false
var vert = 5

function PageUp(Layer,framename,pgSize)
{
	var SSLLoc = (document.getElementById && !document.all) ? "javascript:''" : "/lawson/xhrnet/dot.htm";
	if (typeof(HourStop) != 'undefined')
		window.open(SSLLoc,"HourStop")
	if ((typeof(framename) == 'undefined') || (framename == 'undefined'))
		framename = "main"
	if ((typeof(pgSize) == 'undefined') || (pgSize == 'undefined'))
		pgSize = 350
	if (scrolling)
		scrollLayer(framename,Layer, 0, (pgSize*-1));
}

function PageDn(Layer,framename,pgSize)
{
	var SSLLoc = (document.getElementById && !document.all) ? "javascript:''" : "/lawson/xhrnet/dot.htm";
	if (typeof(HourStop) != 'undefined')
		window.open(SSLLoc,"HourStop")
 	if ((typeof(framename) == 'undefined') || (framename == 'undefined'))
		framename = "main"
	if ((typeof(pgSize) == 'undefined') || (pgSize == 'undefined'))
		pgSize = 350
	if (scrolling)
		scrollLayer(framename, Layer, 0, pgSize);
}

function scroll(Layer,framename, scrollAmt)
{
	if (scrollAmt<0)
		var Direction="UP"
	else
		var Direction="DOWN"
	var Index = WindowIndex(framename,Layer.substring(0,(Layer.length-3)))
	var BoxNm = Layer.substring(0,(Layer.length-3)) + "Box"
	var BoxCtrlStat = Layer.substring(0,(Layer.length-3)) + "BoxScrollStat"
	var BoxCtrlSlide = Layer.substring(0,(Layer.length-3)) + "BoxSlide"
	Layer.substring(0,(Layer.length-3)) + "BoxScrollStat"
	if (Index != 999)
		moveLayer(framename,WindowObject[Index].BoxScrlStat,getLeft(framename,WindowObject[Index].BoxScrlStat),getSlideHeight(framename,Layer.substring(0,(Layer.length-3)),Direction))
	if ((typeof(framename) == 'undefined') || (framename == 'undefined'))
		framename = "main"
	if ((typeof(scrollAmt) == 'undefined') || (scrollAmt == 'undefined'))
		scrollAmt = 4
  	if (scrolling)
	{
    	scrollLayer(framename,Layer, 0, scrollAmt);
    	eval('setTimeout("scroll(\'' + Layer + '\',\'' + framename + '\',' + scrollAmt + ')",1)')
  	}
}

function getDocumentBottom(framename, name) 
{
  var layer = getLayer(framename, name)
  var docLoc = getDocLoc(framename)
  if (docLoc.layers)
  {
  	 if (typeof(layer.layers["bottom"]) != "undefined" && layer.layers["bottom"].top)
   	 	return(layer.layers["bottom"].top)
  	 else return null
  }
  else if (docLoc.all || docLoc.getElementById)
	 return null
  else
     return null
}

function repStr(inStr, fromStr, toStr)
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

function GetObjType(framename, name)
{
	if (getObjectIndex(framename, name) != null)
		return "Layer"
	else if ((typeof(WindowObject) != 'undefined') && (WindowIndex(framename, name) != 999))
		return "Window"
	else if ((typeof(ObjCollectionTemp) != "undefined") && (typeof(name.NbrOfButtons) != 'undefinded'))
		return "ButtonBank"
	else
		return null
}

/*
 *	Common Layer Window Functionality
 */
var WindowObject = new Array();

function WindowObjTemp(framename,name,title,left,top,width,height,visible,content,closeFlag,scrollFlag,pageFlag,swipeFlag,titlebarFlag,bgtype,background,fgtype,fgcolor,zIndex,PgCtrlFrNm,framewidth,titleheight,Minimized,ResizeFlag,MaxLeft,MaxTop,MaxWidth,MaxHeight,MinLeft,MinTop,MinWidth,MinHeight)
{
	this.framename = framename
	this.name = name
	this.title = title
	this.left = left
	this.top = top
	this.width = width
	this.height = height
	this.visible = visible
	this.content = content
	this.closeFlag = closeFlag
	this.closeFunc = ""
	this.scrollFlag = scrollFlag
	this.pageFlag = pageFlag
	this.swipeFlag = swipeFlag
	this.titlebarFlag = titlebarFlag
	this.bgtype = bgtype
	this.background = background
	this.fgtype = fgtype
	this.fgcolor = fgcolor
	this.zIndex = zIndex
	this.PgCtrlFrNm = PgCtrlFrNm
    	this.framewidth=framewidth
	this.titleheight=titleheight
	this.Minimized=Minimized
	this.ResizeFlag=ResizeFlag
	this.MaxLeft=MaxLeft
	this.MaxTop=MaxTop
	this.MaxWidth=MaxWidth
	this.MaxHeight=MaxHeight
	this.MinLeft=MinLeft
	this.MinTop=MinTop
	this.MinWidth=MinWidth
	this.MinHeight=MinHeight
	this.BoxBG = name + "BoxBack"
	this.BoxNm = name + "Box"
	this.BoxCtrlTop = name + "BoxTop"
	this.BoxCtrlSlide = name + "BoxSlide"
	this.BoxScrlUp = name + "BoxUpScroll"
	this.BoxScrlDn = name + "BoxDnScroll"
	this.BoxScrlStat = name + "BoxScrollStat"
}

function MakeWindow(framename,name,title,left,top,width,height,visible,content,closeFlag,scrollFlag,pageFlag,swipeFlag,titlebarFlag,bgtype,background,fgtype,fgcolor,zIndex,PgCtrlFrNm,framewidth,titleheight,Minimized,ResizeFlag,MaxLeft,MaxTop,MaxWidth,MaxHeight,MinLeft,MinTop,MinWidth,MinHeight)
{
	var docLoc = getDocLoc(framename)
	WindowObject[WindowObject.length] = new WindowObjTemp(framename,name,title,left,top,width,height,visible,content,closeFlag,false,pageFlag,swipeFlag,titlebarFlag,bgtype,background,fgtype,fgcolor,zIndex,PgCtrlFrNm,framewidth,titleheight,Minimized,ResizeFlag,MaxLeft,MaxTop,MaxWidth,MaxHeight,MinLeft,MinTop,MinWidth,MinHeight)
	var Index = WindowIndex(framename,name)
	createLayer(framename,WindowObject[Index].BoxBG,(left-framewidth),(top-framewidth+titleheight),(width+(framewidth*2)),(height+(framewidth*2)),visible,"",bgtype,background);
	createLayer(framename,WindowObject[Index].BoxNm,left,(top+titleheight),width,height,visible,content,fgtype,fgcolor,scrollFlag);
	setzIndex(framename,WindowObject[Index].BoxBG,zIndex)
	setzIndex(framename,WindowObject[Index].BoxNm,(zIndex+1))
	clipLayer(framename,WindowObject[Index].BoxNm,0,0,width,height)
	if (titlebarFlag)
	{
		var Desc=BuildTitleHTML(framename,name,Minimized,ResizeFlag,closeFlag,width,title,framewidth)
		createLayer(framename,WindowObject[Index].BoxCtrlTop,(left-framewidth),top,(width+(framewidth*2)),titleheight,visible,Desc,bgtype,background);
		setzIndex(framename,WindowObject[Index].BoxCtrlTop,(zIndex+2))
	}
}

function BuildTitleHTML(framename,name,Minimized,ResizeFlag,closeFlag,width,title,framewidth)
{
	var Desc;
	if (width > 100)
		Desc = '<table width="'+(width+(framewidth*2))+'" role="presentation"><tr><td>'+title+'</td><td class="textAlignRight">'
	else
		Desc = '<table width="'+(width+(framewidth*2))+'" role="presentation"><tr><td class="textAlignRight">'
	if (ResizeFlag)
	{
		if (Minimized)
		{
			var toolTip = getSeaPhrase("MAX_WIN","SEA");
			Desc += ' <a href="javascript:parent.MaximizeWindow(\''+framename+'\',\''+name+'\');" title="'+toolTip+'" aria-label="'+toolTip+'"><img src="/lawson/xhrnet/careermanagement/lib/images/max.gif" border="0" alt="'+getSeaPhrase('MAXIMIZE','ESS')+'" title="'+getSeaPhrase('MAXIMIZE','ESS')+'"></a>'
		}	
		else
		{
			var toolTip = getSeaPhrase("MIN_WIN","SEA");
			Desc += ' <a href="javascript:parent.MinimizeWindow(\''+framename+'\',\''+name+'\');" title="'+toolTip+'" aria-label="'+toolTip+'"><img src="/lawson/xhrnet/careermanagement/lib/images/min.gif" border="0" alt="'+getSeaPhrase('MINIMIZE','ESS')+'" title="'+getSeaPhrase('MINIMIZE','ESS')+'"></a>'
		}	
	}
	if (closeFlag)
	{
		var toolTip = getSeaPhrase("CLOSE_WIN","SEA");
		Desc += ' <a href="javascript:parent.CloseLayerWindow(\''+framename+'\',\''+name+'\');" title="'+toolTip+'" aria-label="'+toolTip+'"><img src="/lawson/xhrnet/careermanagement/lib/images/close.gif" border="0" alt="'+getSeaPhrase('CLOSE','ESS')+'" title="'+getSeaPhrase('CLOSE','ESS')+'"></a>'
	}	
	else
		Desc += '&nbsp'
	Desc += '</td></tr></table>'
	return Desc;
}

function CloseLayerWindow(framename,name)
{
	var docLoc = getDocLoc(framename)
	var Index = WindowIndex(framename,name)
	if (WindowObject[Index].swipeFlag)
	{
		SwipeWindow(framename,name,"CLOSE")
		if (docLoc.all || docLoc.getElementById)
			setTimeout("HideWindow(\"" + framename + "\",\"" + name + "\")",400);
	}
	else
		HideWindow(framename,name)
	if (WindowObject[Index].closeFunc != "")
		eval(WindowObject[Index].closeFunc)
}

function RepaintWindow(framename,name)
{
	var docLoc = getDocLoc(framename)
	if (docLoc.all || docLoc.getElementById)
		return
	var Index = getObjectIndex(framename, name)
	if (LayerObject[Index].source.indexOf("<input") > 0)
	{
		var RecCt = eval('docLoc.layers["' + name + '"].document.forms[0].elements.length')
		var Spin = true
		var InputVals = new Array()
		for (var SS=0; SS<RecCt; SS++)
		{
			var Tmpval = eval('docLoc.layers["' + name + '"].document.forms[0].elements[' + SS + "]" + '.value')
			var Tmpval2 = eval('docLoc.layers["' + name + '"].document.forms[0].elements[' + SS + "].checked")
			if (Tmpval == "on")
			{
				if (Tmpval2)
					{InputVals[SS] = "@T"}
				else
					{InputVals[SS] = "@F"}
			}
			else
			{
				if (Tmpval != "")
					InputVals[SS] = Tmpval
			}
		}
		replaceContent(framename, name, LayerObject[Index].source)
		for (var SS=0; SS<RecCt; SS++)
		{
			if (InputVals[SS] == "@T")
				eval('docLoc.layers["' + name + '"].document.forms[0].elements[' + SS + "]" + '.checked=true')
			else
			{
				if (InputVals[SS] == "@F")
					eval('docLoc.layers["' + name + '"].document.forms[0].elements[' + SS + "]" + '.checked=false')
				else
					eval('docLoc.layers["' + name + '"].document.forms[0].elements[' + SS + "]" + '.value=' + InputVals[SS])
			}
		}
	}
}

function RedrawControls(framename,name)
{
	var Index = WindowIndex(framename,name)
	if (!WindowObject[Index].visible)
		return
	if (WindowObject[Index].scrollFlag)
	{
		moveLayer(framename,WindowObject[Index].BoxCtrlSlide, (WindowObject[Index].left+WindowObject[Index].width-16),(WindowObject[Index].top+WindowObject[Index].titleheight+10))
		swipeLayer(framename,WindowObject[Index].BoxCtrlSlide,0,0, 14,(WindowObject[Index].height-20),1000,"")
	}
	if (WindowObject[Index].titlebarFlag)
	{
		moveLayer(framename,WindowObject[Index].BoxCtrlTop, (WindowObject[Index].left-WindowObject[Index].framewidth),WindowObject[Index].top)
		swipeLayer(framename,WindowObject[Index].BoxCtrlTop,0,0, (WindowObject[Index].width+(WindowObject[Index].framewidth*2)),WindowObject[Index].titleheight,1000,"")
	}
	if (WindowObject[Index].scrollFlag)
	{
		var DocBottom=getDocumentBottom(framename,WindowObject[Index].BoxNm)
		if (DocBottom < WindowObject[Index].height)
		{
			hideLayer(framename,WindowObject[Index].BoxScrlUp)
			hideLayer(framename,WindowObject[Index].BoxScrlDn)
			hideLayer(framename,WindowObject[Index].BoxScrlStat)
			hideLayer(framename,WindowObject[Index].BoxCtrlSlide)
 			showLayer(framename,WindowObject[Index].BoxCtrlSlide + "Cov")
		}
		else
		{
			showLayer(framename,WindowObject[Index].BoxScrlUp)
			showLayer(framename,WindowObject[Index].BoxScrlDn)
			showLayer(framename,WindowObject[Index].BoxScrlStat)
			showLayer(framename,WindowObject[Index].BoxCtrlSlide)
 			hideLayer(framename,WindowObject[Index].BoxCtrlSlide + "Cov")
		}
		moveLayer(framename,WindowObject[Index].BoxScrlUp, (WindowObject[Index].left+WindowObject[Index].width-16),(WindowObject[Index].top+WindowObject[Index].titleheight))
		moveLayer(framename,WindowObject[Index].BoxScrlDn, (WindowObject[Index].left+WindowObject[Index].width-16),(WindowObject[Index].top+WindowObject[Index].titleheight+WindowObject[Index].height-20))
		moveLayer(framename,WindowObject[Index].BoxScrlStat, (WindowObject[Index].left+WindowObject[Index].width-16),(WindowObject[Index].top+WindowObject[Index].titleheight+20))
		swipeLayer(framename,WindowObject[Index].BoxScrlStat,0,0, 14,getBarHeight(framename,name),1000,"")
	}
	if (WindowObject[Index].titlebarFlag)
		replaceContent(WindowObject[Index].framename,WindowObject[Index].BoxCtrlTop,BuildTitleHTML(framename,name,WindowObject[Index].Minimized,WindowObject[Index].ResizeFlag,WindowObject[Index].closeFlag,WindowObject[Index].width,WindowObject[Index].title,WindowObject[Index].framewidth))
}

function MinMaxDone(framename,name)
{
	var Index = WindowIndex(framename,name)
	if (WindowObject[Index].scrollFlag)
		swipeLayer(framename,WindowObject[Index].BoxScrlStat,0,0, 14,getBarHeight(framename,name),1000,"")
	ShowWindowControls(framename,name)
}

function MinMaxFinish(framename,name)
{
	RedrawControls(framename,name)
	var Index = WindowIndex(framename,name)
	moveLayer(framename,WindowObject[Index].BoxBG,(WindowObject[Index].left-WindowObject[Index].framewidth),(WindowObject[Index].top-WindowObject[Index].framewidth+WindowObject[Index].titleheight))
	swipeLayer(framename,WindowObject[Index].BoxBG,1,1,(WindowObject[Index].width+(WindowObject[Index].framewidth*2)),(WindowObject[Index].height+(WindowObject[Index].framewidth*2)),1000,"")
	showLayer(framename, WindowObject[Index].BoxBG)
}

function MinimizeWindow(framename,name)
{
	var Index = WindowIndex(framename,name)
	HideWindowControls(framename, name)
	hideLayer(WindowObject[Index].framename,WindowObject[Index].BoxBG)
	slideLayer(WindowObject[Index].framename,WindowObject[Index].BoxNm, WindowObject[Index].MinLeft, (WindowObject[Index].MinTop+WindowObject[Index].titleheight),1000)
	swipeLayer(WindowObject[Index].framename,WindowObject[Index].BoxNm, 0, 0, WindowObject[Index].MinWidth, WindowObject[Index].MinHeight, 1000, "MinMaxDone('" + framename + "','" + name + "')")
	WindowObject[Index].Minimized=true
	WindowObject[Index].width=WindowObject[Index].MinWidth
	WindowObject[Index].height=WindowObject[Index].MinHeight
	WindowObject[Index].top=WindowObject[Index].MinTop
	WindowObject[Index].left=WindowObject[Index].MinLeft
	if (WindowObject[Index].titlebarFlag)
		replaceContent(WindowObject[Index].framename,WindowObject[Index].BoxCtrlTop,BuildTitleHTML(framename,name,WindowObject[Index].Minimized,WindowObject[Index].ResizeFlag,WindowObject[Index].closeFlag,WindowObject[Index].width,WindowObject[Index].title,WindowObject[Index].framewidth))
	MinMaxFinish(framename,name)
}


function MaximizeWindow(framename,name)
{
	var Index = WindowIndex(framename,name)
	HideWindowControls(framename, name)
	hideLayer(WindowObject[Index].framename,WindowObject[Index].BoxBG)
	slideLayer(WindowObject[Index].framename,WindowObject[Index].BoxNm, WindowObject[Index].MaxLeft, (WindowObject[Index].MaxTop+WindowObject[Index].titleheight),1000)
	swipeLayer(WindowObject[Index].framename,WindowObject[Index].BoxNm, 0, 0, WindowObject[Index].MaxWidth, WindowObject[Index].MaxHeight, 1000, "MinMaxDone('" + framename + "','" + name + "')")
	WindowObject[Index].Minimized=false
	WindowObject[Index].width=WindowObject[Index].MaxWidth
	WindowObject[Index].height=WindowObject[Index].MaxHeight
	WindowObject[Index].top=WindowObject[Index].MaxTop
	WindowObject[Index].left=WindowObject[Index].MaxLeft
	if (WindowObject[Index].titlebarFlag)
		replaceContent(WindowObject[Index].framename,WindowObject[Index].BoxCtrlTop,BuildTitleHTML(framename,name,WindowObject[Index].Minimized,WindowObject[Index].ResizeFlag,WindowObject[Index].closeFlag,WindowObject[Index].width,WindowObject[Index].title,WindowObject[Index].framewidth))
	MinMaxFinish(framename,name)
}

function AddCloseFunction(framename,name,FTR)
{
	var Index = WindowIndex(framename,name)
	WindowObject[Index].closeFunc=FTR
}

function OpenLayerWindow(framename,name)
{
	var Index = WindowIndex(framename,name)
	if (WindowObject[Index].swipeFlag)
		SwipeWindow(framename,name,"OPEN")
	else
		ShowWindow(framename,name)
}

function SwipeWindow(framename,name,OpenClose)
{
	var docLoc = getDocLoc(framename)
	var Index = WindowIndex(framename,name)
	WindowObject[Index].visible
	if (OpenClose == "OPEN")
	{
		moveLayer("main",WindowObject[Index].BoxNm,WindowObject[Index].left,WindowObject[Index].top+WindowObject[Index].titleheight)
		if ((docLoc.all || docLoc.getElementById) || (!WindowObject[Index].scrollFlag))
			clipLayer("main",WindowObject[Index].BoxNm,0,0,WindowObject[Index].width,0)
		else
			clipLayer("main",WindowObject[Index].BoxNm,0,0,(WindowObject[Index].width-16),0)
		showLayer("main",WindowObject[Index].BoxNm)
		moveLayer("main",WindowObject[Index].BoxBG,WindowObject[Index].left-WindowObject[Index].framewidth,WindowObject[Index].top+WindowObject[Index].titleheight-WindowObject[Index].framewidth)
		clipLayer("main",WindowObject[Index].BoxBG,0,0,WindowObject[Index].width+(WindowObject[Index].framewidth*2),0)
		showLayer("main",WindowObject[Index].BoxBG)
		if (WindowObject[Index].scrollFlag)
	    	moveLayer("main",WindowObject[Index].BoxScrlStat,(WindowObject[Index].left+WindowObject[Index].width-16),(WindowObject[Index].top+WindowObject[Index].titleheight+20));
		if ((docLoc.all || docLoc.getElementById) || (!WindowObject[Index].scrollFlag))
			parent.swipeLayer(framename,WindowObject[Index].BoxNm,0,0,WindowObject[Index].width,WindowObject[Index].height,800,"");
		else
			parent.swipeLayer(framename,WindowObject[Index].BoxNm,0,0,(WindowObject[Index].width-16),WindowObject[Index].height,800,"");

		parent.swipeLayer(framename,WindowObject[Index].BoxBG,0,0,WindowObject[Index].width+(WindowObject[Index].framewidth*2),WindowObject[Index].height+(WindowObject[Index].framewidth*2),800,"");
		parent.ShowWindowControls(framename,name)
	}
	else
	{
		parent.HideWindowControls(framename,name)
		if ((docLoc.all || docLoc.getElementById) || (!WindowObject[Index].scrollFlag))
			parent.swipeLayer(framename,WindowObject[Index].BoxNm,0,parent.getClipBottom(framename,WindowObject[Index].BoxNm),WindowObject[Index].width,parent.getClipBottom(framename,WindowObject[Index].BoxNm),1000,"");
		else
			parent.swipeLayer(framename,WindowObject[Index].BoxNm,0,parent.getClipBottom(framename,WindowObject[Index].BoxNm),(WindowObject[Index].width-16),parent.getClipBottom(framename,WindowObject[Index].BoxNm),1000,"");
		parent.swipeLayer(framename,WindowObject[Index].BoxBG,0,parent.getClipBottom(framename,WindowObject[Index].BoxBG),WindowObject[Index].width+(WindowObject[Index].framewidth*2),parent.getClipBottom(framename,WindowObject[Index].BoxBG),1000,"");
	}
}

function ShowWindowControls(framename, name)
{
	var Index = WindowIndex(framename,name)
	WindowObject[Index].visible
	if (WindowObject[Index].titlebarFlag)
		showLayer(framename,WindowObject[Index].BoxCtrlTop)
	if (WindowObject[Index].scrollFlag)
	{
		var DocBottom=getDocumentBottom(framename,WindowObject[Index].BoxNm)
		if (DocBottom >= WindowObject[Index].height)
		{
			showLayer(framename,WindowObject[Index].BoxCtrlSlide)
			showLayer(framename,WindowObject[Index].BoxScrlUp)
			showLayer(framename,WindowObject[Index].BoxScrlDn)
			showLayer(framename,WindowObject[Index].BoxScrlStat)
			hideLayer(framename,WindowObject[Index].BoxCtrlSlide + "Cov")
		}
		else
			showLayer(framename,WindowObject[Index].BoxCtrlSlide + "Cov")

	}
}

function HideWindowControls(framename, name)
{
	var Index = WindowIndex(framename,name)
	WindowObject[Index].visible
	if (WindowObject[Index].titlebarFlag)
		hideLayer(framename,WindowObject[Index].BoxCtrlTop)
	if (WindowObject[Index].scrollFlag)
	{
		hideLayer(framename,WindowObject[Index].BoxCtrlSlide)
		hideLayer(framename,WindowObject[Index].BoxScrlUp)
		hideLayer(framename,WindowObject[Index].BoxScrlDn)
		hideLayer(framename,WindowObject[Index].BoxScrlStat)
		hideLayer(framename,WindowObject[Index].BoxCtrlSlide + "Cov")
	}
}

function ShowWindow(framename,name)
{
	var Index = WindowIndex(framename,name)
	WindowObject[Index].visible = true
	showLayer(framename,WindowObject[Index].BoxBG)
	showLayer(framename,WindowObject[Index].BoxNm)
	ShowWindowControls(framename, name)
}

function ReplaceWindowContent(framename,name,content)
{
  	ReplaceIP = true
	var docLoc = getDocLoc(framename)
	var Index = WindowIndex(framename,name)
	moveLayer(framename,WindowObject[Index].BoxNm,WindowObject[Index].left,WindowObject[Index].top + WindowObject[Index].titleheight)
	if ((docLoc.all || docLoc.getElementById) || (!WindowObject[Index].scrollFlag))
		clipLayer("main",WindowObject[Index].BoxNm,0,0,WindowObject[Index].width,WindowObject[Index].height)
	else
		clipLayer("main",WindowObject[Index].BoxNm,0,0,(WindowObject[Index].width-16),WindowObject[Index].height)
	replaceContent(framename,WindowObject[Index].BoxNm,content)
	if (WindowObject[Index].scrollFlag)
		RedrawControls(framename, name)
	var winRef = self[framename];
	winRef.stylePage();
}

function ReplaceWindowTitle(framename,name,content)
{
	var Index = WindowIndex(framename,name)
	WindowObject[Index].title=content
	RedrawControls(framename, name)
}

function HideWindow(framename,name)
{
	var Index = WindowIndex(framename,name)
	WindowObject[Index].visible = false
	hideLayer(framename,WindowObject[Index].BoxBG)
	hideLayer(framename,WindowObject[Index].BoxNm)
	if (WindowObject[Index].titlebarFlag)
		hideLayer(framename,WindowObject[Index].BoxCtrlTop)
	if (WindowObject[Index].scrollFlag)
	{
		hideLayer(framename,WindowObject[Index].BoxCtrlSlide)
		hideLayer(framename,WindowObject[Index].BoxScrlUp)
		hideLayer(framename,WindowObject[Index].BoxScrlDn)
		hideLayer(framename,WindowObject[Index].BoxScrlStat)
		hideLayer(framename,WindowObject[Index].BoxCtrlSlide + "Cov")
	}

}

function getBarHeight(framename,name)
{
	var Index = WindowIndex(framename,name)
	var DocBottom=getDocumentBottom(framename,WindowObject[Index].BoxNm)
	var VisibleBottom=getClipBottom(framename,WindowObject[Index].BoxNm)
	if (DocBottom < 1)
		DocBottom = VisibleBottom
	if (DocBottom < WindowObject[Index].height)
		return WindowObject[Index].height-45
	var VisibleTop=getClipTop(framename,WindowObject[Index].BoxNm)
	var Percent=(VisibleBottom-VisibleTop)/DocBottom
	var BarBottom=getHeight(framename,WindowObject[Index].BoxCtrlSlide)
	var Bottom=BarBottom*Percent
	if (Bottom-20 < 1)
		return 2
	return Bottom-20

}
function getSlideHeight(framename,name,Direction)
{
	var Index = WindowIndex(framename,name)
	var VisibleTop=getClipTop(framename,WindowObject[Index].BoxNm)
	var VisibleBottom=getClipBottom(framename,WindowObject[Index].BoxNm)
	var DocBottom=getDocumentBottom(framename,WindowObject[Index].BoxNm)
	if (DocBottom< 1)
		DocBottom=1
	var BarTop=getTop(framename,WindowObject[Index].BoxCtrlSlide)
	if (DocBottom<VisibleBottom)
		return BarTop+10
	var BarBottom=BarTop + getHeight(framename,WindowObject[Index].BoxCtrlSlide)
	var Percent=VisibleTop/DocBottom
	var BallHeight = ((getClipHeight(framename,WindowObject[Index].BoxCtrlSlide))*Percent) + BarTop+10
	return BallHeight
}

function WindowIndex(framename,name)
{
	for (x=0; x<WindowObject.length; x++)
	{
		if (framename == WindowObject[x].framename && name == WindowObject[x].name)
		 	return x
	}
	return 999
}

function PageItWin(name, framename ,height)
{
	var SSLLoc = (document.getElementById && !document.all) ? "javascript:''" : "/lawson/xhrnet/dot.htm";
	if (typeof(HourStop) != 'undefined')
		window.open(SSLLoc,"HourStop")
	Index = WindowIndex(framename,name.substring(0,name.length-3))
	if (clickVert > getTop(framename, WindowObject[Index].BoxScrlStat))
		parent.PageDn(name, framename ,height)
	else
		parent.PageUp(name, framename ,height)
	Direction = ""
	moveLayer(framename,WindowObject[Index].BoxScrlStat,getLeft(framename,WindowObject[Index].BoxScrlStat),getSlideHeight(framename,name.substring(0,(name.length-3)),Direction))
}

function StartTrapClick()
{
	window.captureEvents(Event.CLICK)
	window.onclick = PGIT
}

var ClickVert = 0
function PGIT(Ev)
{
	clickVert = Ev.pageY
}

function StopTrapClick()
{
	window.releaseEvents(Event.CLICK)
}

/*
 *	Tabs
 */
var mouseoverTimer;

function TabPane(Code, Description, Width, MouseOver)
{
	this.Code = Code;
	this.Description = Description;
	this.Width = Width;
	this.MouseOver = MouseOver;
}

function TabObject(TabsArrayParam, TabSelectedParam)
{
	this.TabsArray = TabsArrayParam;
	this.TabSelected = TabSelectedParam;
	this.BorderColor = "#FF00FF"
	this.bgColorTabDown = "#000000"
	this.bgColorTabUp = "#FFFFFF"
	this.fgColorTabDown = "#FFFFFF"
	this.fgColorTabUp = "#000000"
	this.fontSize = "10pt"
	this.fontFamily = "times"
	this.fontWeight = "normal"
	this.Draw = DrawTabs;
	this.Style = TabStyle;
	this.HelpTopics = MenuTab;
	if (arguments.length == 3 && arguments[2] != "")
		this.TabName = arguments[2];
	else
		this.TabName = "Tab";
}

function TabStyle(BC, bgCTD, bgCTU, fgCTD, fgCTU, fSize, fFamily, fWeight)
{
	this.BorderColor = BC
	this.bgColorTabDown = bgCTD
	this.bgColorTabUp = bgCTU
	this.fgColorTabDown = fgCTD
	this.fgColorTabUp = fgCTU
	this.fontSize = fSize
	this.fontFamily = fFamily
	this.fontWeight = fWeight
}

function DrawTabs(Color) // this one has 1px change
{
	var strFunction;
	var Tabs = '<div id="CMTabs_' + this.TabName + '" styler="tabcontrol" styler_init="StylerEMSS.initTabControlCM" styler_load="StylerEMSS.onLoadTabControlTabCM">'
	+ '<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr>'
	for (var i=0; i<this.TabsArray.length; i++)
	{
		Tabs += '<td '
		if (i == 0)
			Tabs += (this.TabSelected == i) ? 'class="tableftonCM"' : 'class="tableftoffCM"'
		else if (this.TabSelected == i)
			Tabs += 'class="tabonCM"'
		else
			Tabs += 'class="taboffCM"'
		Tabs += ' nowrap="nowrap"><a href="javascript:;" '
		if (this.TabSelected != i)
			Tabs += this.HelpTopics(this.TabsArray[i].MouseOver, i, false)
		else
			Tabs += this.HelpTopics(this.TabsArray[i].MouseOver, i, true)
		Tabs += '</a></td>'
	}
	Tabs += '<td class="tabbackgroundborderbottomCM" style="width:100%">&nbsp;</td></tr></table></div>'
	return Tabs;
}

function MenuTab(TabContent, Index, Up)
{
	var Left = 1;
	for (var i=0; i<Index; i++)
		Left += this.TabsArray[i].Width - 25;
	var browser = new SEABrowser();
	if (browser.isNS && this.TabsArray[Index].Code == "ExploreCareers")
		Left -= 120;
	var MenuTabs = 'id="' + this.TabName + '_' + this.TabsArray[Index].Code + '_TabBody" ';
	if (Up)
		MenuTabs += 'class="tabupCM" '
	else
		MenuTabs += 'class="tabdownCM" '
	strFunction = 'parent.CallBack_Tabs(\''+this.TabName+'\', \''+this.TabsArray[Index].Code+'\')'
	MenuTabs += 'onclick="'+strFunction+';return false;" '
	var toolTip = this.TabsArray[Index].Description+' - '+getSeaPhrase("OPEN_TAB_X","SEA");
	if (TabContent != "" && typeof(TabContent)!="undefined" && TabContent != "undefined" && TabContent != null)
		toolTip += TabContent;
	MenuTabs += ' title="'+toolTip+'" aria-label="'+toolTip+'">&nbsp;&nbsp;'+this.TabsArray[Index].Description+'&nbsp;&nbsp;'
	return MenuTabs;
}

function CallBack_Tabs(TabName, Code)
{
	clearTimeout(mouseoverTimer);
	var func = "OnTabClicked_"+TabName+"('"+Code+"')"
	eval(func);
}

/*
 *	My Qualifications Tab
 */
var _TABSELECTED;
var _ADDINGQUALIFICATION = false;
var _CURRENTQUALWINDESC = getSeaPhrase("CM_157","CM");
var FilteredProficiency = new Array();
var FilteredQualification = new Array();

function DrawMyQualificationsWindows()
{
	_TABSELECTED = 0;
	DrawQualficationsTabs(false, 0);
	DrawCategoryInstructions_MyQualifications();
	DrawCompetencyDetail_MyQualifications();
	FinishedDrawingTabs();
}

function RepaintMyQualifications(FC)
{
	switch (_TABSELECTED)
	{
		case 0:	OnTabClicked_Qualifications("Competencies", FC); break;
		case 1: OnTabClicked_Qualifications("Certifications", FC); break;
		case 2: OnTabClicked_Qualifications("Education", FC); break;
		default: removeWaitAlert(); break;
	}
}

function OnTabClicked_Qualifications(TabName/*, FC*/)
{
	var Desc = "";
	switch (TabName)
	{
		case "Competencies":
			_TABSELECTED = 0;
			DrawQualficationsTabs(true, 0);
			if (_DIRECTREPORTSINDEX >= 0 && DirectReports[_DIRECTREPORTSINDEX])
			{
				_CURRENTQUALWINDESC = getSeaPhrase("CM_227","CM")+' - '+DirectReports[_DIRECTREPORTSINDEX].description
			}
			else 
				_CURRENTQUALWINDESC = getSeaPhrase("CM_227","CM")
			Desc = '<span class="layertitleCM">'+_CURRENTQUALWINDESC+'</span>';
			ChangeTitle("main", "MyQualifications_MyQualifications", Desc);
			Desc = DataForQualificationsAlert(0, "CompetencyDetail_MyQualifications");
			ReplaceWindowContent("main","MyQualification_MyQualificationsWindow",Desc)
			break;
		case "Certifications":
			_TABSELECTED = 1;
			DrawQualficationsTabs(true, 1);
			if (_DIRECTREPORTSINDEX >= 0 && DirectReports[_DIRECTREPORTSINDEX])
			{
				_CURRENTQUALWINDESC = getSeaPhrase("CM_227","CM")+' - '+DirectReports[_DIRECTREPORTSINDEX].description
			}
			else 
				_CURRENTQUALWINDESC = getSeaPhrase("CM_227","CM")
			Desc = '<span class="layertitleCM">'+_CURRENTQUALWINDESC+'</span>';
			ChangeTitle("main", "MyQualifications_MyQualifications", Desc);
			Desc = DataForQualificationsAlert(1, "CompetencyDetail_MyQualifications");
			ReplaceWindowContent("main","MyQualification_MyQualificationsWindow",Desc)
			break;
		case "Education":
			_TABSELECTED = 2;
			DrawQualficationsTabs(true, 2);
			if (_DIRECTREPORTSINDEX >= 0 && DirectReports[_DIRECTREPORTSINDEX])
				_CURRENTQUALWINDESC = getSeaPhrase("CM_227","CM")+' - '+DirectReports[_DIRECTREPORTSINDEX].description
			else 
				_CURRENTQUALWINDESC = getSeaPhrase("CM_227","CM")
			Desc = '<span class="layertitleCM">'+_CURRENTQUALWINDESC+'</span>';
			ChangeTitle("main", "MyQualifications_MyQualifications", Desc);
			Desc = DataForQualificationsAlert(2, "CompetencyDetail_MyQualifications");
			ReplaceWindowContent("main","MyQualification_MyQualificationsWindow",Desc)
			break;
	}
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
	if ((arguments.length==2 && arguments[1] == "D") || arguments.length==1)
		CompetencyDetail_MyQualifications_XIconClicked();
	else if (_ADDINGQUALIFICATION)
	{
		CompetencyDetail_MyQualifications_XIconClicked();
		seaPageMessage(getSeaPhrase("CM_228","CM"), null, null, "info", null, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
	}
	else
		seaPageMessage(getSeaPhrase("CM_229","CM"), null, null, "info", null, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
	_ADDINGQUALIFICATION = false;
	if (emssObjInstance.emssObj.filterSelect)
		closeDmeFieldFilter();
	TabsLoaded();
}

function GetWebUpdatableRecords(QualificationList)
{
	var WebAvailRecs = new Array();
	for (var i=0; i<QualificationList.length; i++)
	{
		if (typeof(QualificationList[i].webavail) != "undefined" && parseInt(QualificationList[i].webavail,10) > 2)
			WebAvailRecs[WebAvailRecs.length] = QualificationList[i];
	}
	return WebAvailRecs;
}

function AddQualificationButton_MyQualifications_OnClick()
{
	var Desc;
	__WindowName = "CompetencyDetail_MyQualifications";
	var EmployeeQualifications = (_CURRENTTAB == "EMPLOYEEQUALIFICATIONS")?true:false;
	if (EmployeeQualifications && (_DIRECTREPORTSINDEX < 0 || !DirectReports[_DIRECTREPORTSINDEX] || !NonSpace(DirectReports[_DIRECTREPORTSINDEX].description)))
	{
		seaAlert(getSeaPhrase("CM_230","CM"), null, null, "error");
		return;
	}
	_ADDINGQUALIFICATION = true;
	ShowCompetencyDetail_MyQualifications(true);
	if (EmployeeQualifications)
	{
		hideLayer("main", "Instructions_EmployeeActionPlanTitle");
		ShowSelect(false, "main", "cmbDirectReports");
	}
	var buttonStr = '<tr><th scope="row">&nbsp;</th><td class="plaintablecell" style="white-space:nowrap;padding-top:10px">'
	+ uiButton(getSeaPhrase("CM_95","CM"),"parent.UpdateQualificationButton_MyQualifications_OnClick();return false;")
	+ uiButton(getSeaPhrase("CM_94","CM"),"parent.CompetencyDetail_MyQualifications_XIconClicked();return false;","margin-left:5px")		
	+ '</td></tr>'	
	var toolTip;
	switch (_TABSELECTED)
	{
		case 0:
			__ProfileType = "Competency";
			Desc = '<span class="layertitleCM">'+StripTitle(getSeaPhrase("CM_231","CM"), 60)+'</span>';
			ChangeTitle("main", "CompetencyDetail_MyQualifications", Desc);
			FilteredQualification = GetWebUpdatableRecords(Competency);
			Desc = '<form name="qualificationform">'
			Desc += '<table border="0" cellpadding="0" cellspacing="0" width="100%" summary="'+getSeaPhrase("TSUM_92","SEA")+'">'
			Desc += '<caption class="offscreen">'+getSeaPhrase("CM_259","CM")+'</caption>'
			Desc += '<tr><th scope="col" colspan="2"></th></tr>'
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite">'+getSeaPhrase("CM_50","CM")+'</th><td class="plaintablecell"><div id="competencyType" class="contenttextCM"></div></td></tr>'
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label for="code">'+getSeaPhrase("CM_46","CM")+'</label></th>'
			if (emssObjInstance.emssObj.filterSelect)
			{
				toolTip = dmeFieldToolTip("competency");
				Desc += '<td class="plaintablecell" nowrap><input class="contenttextCM" type="text" id="code" name="code" fieldnm="competency" value="" size="10" maxlength="10" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'competency\');">'
				+ '<a href="javascript:parent.openDmeFieldFilter(\'competency\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
				+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
				+ '<span id="competencyDesc" style="width:150px" class="fieldlabelleft"></span></td></tr>'
			}
			else
				Desc += '<td class="plaintablecell"><select id="code" name="code" onchange="parent.FillQualification(this.form,\'Competency\');parent.FilterProficiencies(this.form);">'+BuildSelect("","FilteredQualification")+'</select></td></tr>'
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label for="proficiency">'+getSeaPhrase("CM_232","CM")+'</label></th><td class="plaintablecell"><select class="contenttextCM" id="proficiency" name="proficiency">'+BuildSelect("","Proficiency")+'</select></td></tr>'
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label for="skillsource">'+getSeaPhrase("CM_233","CM")+'</label></th>'
			if (emssObjInstance.emssObj.filterSelect)
			{
				toolTip = dmeFieldToolTip("skillsource");
				Desc += '<td class="plaintablecell" nowrap><input class="contenttextCM" type="text" id="skillsource" name="skillsource" fieldnm="skillsource" value="" size="10" maxlength="10" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'skillsource\');">'
				+ '<a href="javascript:parent.openDmeFieldFilter(\'skillsource\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
				+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
				+ '<span id="skillsourceDesc" style="width:150px" class="fieldlabelleft"></span></td></tr>'
			}
			else
				Desc += '<td class="plaintablecell"><select class="contenttextCM" id="skillsource" name="skillsource">'+BuildSelect("","Source")+'</select></td></tr>'
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label for="renewalcode">'+getSeaPhrase("CM_234","CM")+'</label></th><td class="plaintablecell"><select class="contenttextCM" id="renewalcode" name="renewalcode">'+BuildRenewalSelect("")+'</select></td></tr>'
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label for="instructor">'+getSeaPhrase("CM_235","CM")+'</label></th><td class="plaintablecell"><input class="contenttextCM" type="text" size="10" maxlength="10" id="instructor" name="instructor" value="">'
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label for="perrating">'+getSeaPhrase("CM_236","CM")+'</label></th><td class="plaintablecell"><input class="contenttextCM" type="text" size="6" maxlength="6" id="perrating" name="perrating" value="">'
			toolTip = uiDateToolTip(getSeaPhrase("CM_237","CM"));
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label id="dateacquiredLbl" for="dateacquired">'+getSeaPhrase("CM_237","CM")+'</label></th><td class="plaintablecell">'
			+ '<input class="contenttextCM" type="text" id="dateacquired" name="dateacquired" value="" size="10" maxlength="10" onfocus="this.select()" aria-labelledby="dateacquiredLbl dateacquiredFmt">'
			+ '<a class="contenttextCM" href="javascript:;" onclick="parent.DateSelect(\'dateacquired\');return false;" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a><span class="contenttextCM">'+uiDateFormatSpan("dateacquiredFmt")+'</span></td></tr>';
			toolTip = uiDateToolTip(getSeaPhrase("CM_239","CM"));
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label id="renewdateLbl" for="renewdate">'+getSeaPhrase("CM_239","CM")+'</label></th><td class="plaintablecell">'
			+ '<input class="contenttextCM" type="text" id="renewdate" name="renewdate" value="" size="10" maxlength="10" onfocus="this.select()" aria-labelledby="renewdateLbl renewdateFmt">'
			+ '<a class="contenttextCM" href="javascript:;" onclick="parent.DateSelect(\'renewdate\');return false;" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a><span class="contenttextCM">'+uiDateFormatSpan("renewdateFmt")+'</span></td></tr>';
			toolTip = uiDateToolTip(getSeaPhrase("CM_240","CM"));
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label id="datereturnedLbl" for="datereturned">'+getSeaPhrase("CM_240","CM")+'</label></th><td class="plaintablecell">'
			+ '<input class="contenttextCM" type="text" id="datereturned" name="datereturned" value="" size="10" maxlength="10" onfocus="this.select()" aria-labelledby="datereturnedLbl datereturnedFmt">'
			+ '<a class="contenttextCM" href="javascript:;" onclick="parent.DateSelect(\'datereturned\');return false;" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a><span class="contenttextCM">'+uiDateFormatSpan("datereturnedFmt")+'</span></td></tr>';
			Desc += '<tr><th scope="row" class="fieldlabelboldliteunderline"><label for="cosponsored">'+getSeaPhrase("CM_241","CM")+'</label></th><td class="plaintablecell">'
			+ '<select class="contenttextCM" id="cosponsored" name="cosponsored">'+BuildYesNo("")+'</select></td></tr>'
			Desc += buttonStr
			Desc += '</table>'
			Desc += '<input type="hidden" size="20" maxlength="30" name="qualification" value="">'
			Desc += '<input type="hidden" name="type" value="">'				 
			Desc += '</form>'
			break;
		case 1:
			__ProfileType = "Certifications";
			Desc = '<span class="layertitleCM">'+StripTitle(getSeaPhrase("CM_242","CM"), 60)+'</span>';
			ChangeTitle("main", "CompetencyDetail_MyQualifications", Desc);
			FilteredQualification = GetWebUpdatableRecords(Certifications);
			Desc = '<form name="qualificationform">'
			Desc += '<table border="0" cellpadding="0" cellspacing="0" width="100%" summary="'+getSeaPhrase("TSUM_92","SEA")+'">'
			Desc += '<caption class="offscreen">'+getSeaPhrase("CM_259","CM")+'</caption>'
			Desc += '<tr><th scope="col" colspan="2"></th></tr>'	
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label for="code">'+getSeaPhrase("CM_46","CM")+'</label></th>'
			if (emssObjInstance.emssObj.filterSelect)
			{
				toolTip = dmeFieldToolTip("certification");
				Desc += '<td class="plaintablecell" nowrap><input class="contenttextCM" type="text" id="code" name="code" fieldnm="certification" value="" size="10" maxlength="10" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'certification\');">'
				+ '<a href="javascript:parent.openDmeFieldFilter(\'certification\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
				+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
				+ '<span id="certificationDesc" style="width:150px" class="fieldlabelleft"></span></td></tr>'
			}
			else
				Desc += '<td class="plaintablecell"><select class="contenttextCM" id="code" name="code" onchange="parent.FillQualification(this.form,\'Certifications\');">'+BuildSelect("","FilteredQualification")+'</select></td></tr>'
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label for="state">'+getSeaPhrase("CM_243","CM")+'</label></th><td class="plaintablecell"><select class="contenttextCM" id="state" name="state">'+BuildStateSelect("")+'</select></td></tr>'
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label for="licnumber">'+getSeaPhrase("CM_244","CM")+'</label></th><td class="plaintablecell"><input class="contenttextCM" type="text" id="licnumber" name="licnumber" size="15" maxlength="20" value=""></td></tr>'
			toolTip = uiDateToolTip(getSeaPhrase("CM_237","CM"));
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label id="dateacquiredLbl" for="dateacquired">'+getSeaPhrase("CM_237","CM")+'</label></th><td class="plaintablecell">'
			+ '<input class="contenttextCM" type="text" id="dateacquired" name="dateacquired" value="" size="10" maxlength="10" onfocus="this.select()" aria-labelledby="dateacquiredLbl dateacquiredFmt">'
			+ '<a class="contenttextCM" href="javascript:;" onclick="parent.DateSelect(\'dateacquired\');return false;" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a><span class="contenttextCM">'+uiDateFormatSpan("dateacquiredFmt")+'</span></td></tr>';
			toolTip = uiDateToolTip(getSeaPhrase("CM_240","CM"));
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label id="renewdateLbl" for="renewdate">'+getSeaPhrase("CM_240","CM")+'</label></th><td class="plaintablecell">'
			+ '<input class="contenttextCM" type="text" id="renewdate" name="renewdate" value="" size="10" maxlength="10" onfocus="this.select()" aria-labelledby="renewdateLbl renewdateFmt">'
			+ '<a class="contenttextCM" href="javascript:;" onclick="parent.DateSelect(\'renewdate\');return false;" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a><span class="contenttextCM">'+uiDateFormatSpan("renewdateFmt")+'</span></td></tr>';
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label for="renewalcode">'+getSeaPhrase("CM_234","CM")+'</label></th><td class="plaintablecell"><select class="contenttextCM" id="renewalcode" name="renewalcode">'+BuildRenewalSelect("")+'</select></td></tr>'
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label for="skillsource">'+getSeaPhrase("CM_233","CM")+'</label></th>'
			if (emssObjInstance.emssObj.filterSelect)
			{
				toolTip = dmeFieldToolTip("skillsource");
				Desc += '<td class="plaintablecell" nowrap><input class="contenttextCM" type="text" id="skillsource" name="skillsource" fieldnm="skillsource" value="" size="10" maxlength="10" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'skillsource\');">'
				+ '<a href="javascript:parent.openDmeFieldFilter(\'skillsource\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
				+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
				+ '<span id="skillsourceDesc" style="width:150px" class="fieldlabelleft"></span></td></tr>'
			}
			else
				Desc += '<td class="plaintablecell"><select class="contenttextCM" id="skillsource" name="skillsource">'+BuildSelect("", "Source")+'</select></td></tr>'
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label for="cosponsored">'+getSeaPhrase("CM_241","CM")+'</label></th><td class="plaintablecell"><select class="contenttextCM" id="cosponsored" name="cosponsored">'+BuildYesNo("")+'</select></td></tr>'
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label for="cost">'+getSeaPhrase("CM_245","CM")+'</label></th><td class="plaintablecell"><input class="contenttextCM" type="text" size="14" maxlength="14" id="cost" name="cost" value=""></td></tr>'
			Desc += '<tr><th scope="row" class="fieldlabelboldliteunderline"><label for="currencycode">'+getSeaPhrase("CM_246","CM")+'</label></th>'
			if (emssObjInstance.emssObj.filterSelect)
			{
				toolTip = dmeFieldToolTip("currencycode");
				Desc += '<td class="plaintablecell" nowrap><input class="contenttextCM" type="text" id="currencycode" name="currencycode" fieldnm="currencycode" value="" size="5" maxlength="5" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'currencycode\');">'
				+ '<a href="javascript:parent.openDmeFieldFilter(\'currencycode\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
				+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
				+ '<span id="currencycodeDesc" style="width:150px" class="fieldlabelleft"></span></td></tr>'
			}
			else
				Desc += '<td class="plaintablecell"><select class="contenttextCM" id="currencycode" name="currencycode">'+BuildSelect("", "Currency")+'</select></td></tr>'
			Desc += buttonStr				 
			Desc += '</table>'
			Desc += '<input type="hidden" size="20" maxlength="30" name="qualification" value="">'
			Desc += '</form>'
			break;
		case 2:
			__ProfileType = "Education";
			Desc = '<span class="layertitleCM">'+StripTitle(getSeaPhrase("CM_247","CM"), 60)+'</span>';
			ChangeTitle("main", "CompetencyDetail_MyQualifications", Desc);
			FilteredQualification = GetWebUpdatableRecords(Degree);
			Desc = '<form name="qualificationform">'
			Desc += '<table border="0" cellpadding="0" cellspacing="0" width="100%" summary="'+getSeaPhrase("TSUM_92","SEA")+'">'
			Desc += '<caption class="offscreen">'+getSeaPhrase("CM_259","CM")+'</caption>'
			Desc += '<tr><th scope="col" colspan="2"></th></tr>'
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label for="degree">'+getSeaPhrase("CM_248","CM")+'</label></th>'
			if (emssObjInstance.emssObj.filterSelect)
			{
				toolTip = dmeFieldToolTip("degree");
				Desc += '<td class="plaintablecell" nowrap><input class="contenttextCM" type="text" id="degree" name="degree" fieldnm="degree" value="" size="10" maxlength="10" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'degree\');">'
				+ '<a href="javascript:parent.openDmeFieldFilter(\'degree\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
				+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
				+ '<span id="degreeDesc" style="width:150px" class="fieldlabelleft"></span></td></tr>'
			}
			else
				Desc += '<td class="plaintablecell"><select class="contenttextCM" id="degree" name="degree">'+BuildSelect("", "FilteredQualification")+'</select></td></tr>'
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label for="subject">'+getSeaPhrase("CM_249","CM")+'</label></th>'
			if (emssObjInstance.emssObj.filterSelect)
			{
				toolTip = dmeFieldToolTip("subject");
				Desc += '<td class="plaintablecell" nowrap><input class="contenttextCM" type="text" id="subject" name="subject" fieldnm="subject" value="" size="10" maxlength="10" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'subject\');">'
				+ '<a href="javascript:parent.openDmeFieldFilter(\'subject\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
				+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
				+ '<span id="subjectDesc" style="width:150px" class="fieldlabelleft"></span>'
				+ '</td></tr>'
			}
			else
				Desc += '<td class="plaintablecell"><select class="contenttextCM" id="subject" name="subject">'+BuildSelect("", "Subject")+'</select></td></tr>'
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label for="perrating">'+getSeaPhrase("CM_250","CM")+'</label></th><td class="plaintablecell"><input class="contenttextCM" type="text" size="6" maxlength="6" id="perrating" name="perrating" value=""></td></tr>'
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label for="instructor">'+getSeaPhrase("CM_251","CM")+'</label></th>'
			if (emssObjInstance.emssObj.filterSelect)
			{
				toolTip = dmeFieldToolTip("instructor");
				Desc += '<td class="plaintablecell" nowrap><input class="contenttextCM" type="text" id="instructor" name="instructor" fieldnm="instructor" value="" size="10" maxlength="10" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'instructor\');">'
				+ '<a href="javascript:parent.openDmeFieldFilter(\'instructor\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
				+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
				+ '<span id="instructorDesc" style="width:150px" class="fieldlabelleft"></span></td></tr>'
			}
			else
				Desc += '<td class="plaintablecell"><select class="contenttextCM" id="instructor" name="instructor">'+BuildSelect("", "Institution")+'</select></td></tr>'			
			toolTip = uiDateToolTip(getSeaPhrase("CM_252","CM"));
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label id="renewaldateLbl" for="renewaldate">'+getSeaPhrase("CM_252","CM")+'</label></th><td class="plaintablecell">'
			+ '<input class="contenttextCM" type="text" id="renewaldate" name="renewaldate" value="" size="10" maxlength="10" onfocus="this.select()" aria-labelledby="renewaldateLbl renewaldateFmt">'
			+ '<a class="contenttextCM" href="javascript:;" onclick="parent.DateSelect(\'renewaldate\');return false;" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a><span class="contenttextCM">'+uiDateFormatSpan("renewaldateFmt")+'</span></td></tr>';
			Desc += '<tr><th scope="row" class="plaintablerowheaderlite"><label for="inproflag">'+getSeaPhrase("CM_253","CM")+'</label></th><td class="plaintablecell"><select class="contenttextCM" id="inproflag" name="inproflag">'+BuildYesNo("")+'</select></td></tr>'
			Desc += '<tr><th scope="row" class="fieldlabelboldliteunderline"><label for="cosponsored">'+getSeaPhrase("CM_241","CM")+'</label></th><td class="plaintablecell"><select class="contenttextCM" id="cosponsored" name="cosponsored">'+BuildYesNo("")+'</select></td></tr>'
			Desc += buttonStr
			Desc += '</table></form>'
			break;
	}
	ReplaceWindowContent("main","CompetencyDetail_MyQualificationsWindow",Desc)
}

function CompetencyDetail_MyQualifications_XIconClicked()
{
	QualificationsDetail_XIconClicked()
}

function DeleteQualificationButton_MyQualifications_OnClick()
{
	UpdateQualification_MyActionPlan_OnClick("D") //Call update logic with a DELETE parameter
}

function UpdateQualificationButton_MyQualifications_OnClick()
{	
	// Edit the form for any required fields before passing it to the server.
	var qualForm = GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");
	if (_TABSELECTED == 0 || _TABSELECTED == 1) // Competencies or Certifications
	{
		if (typeof(qualForm.qualification) != "undefined") // Edits for "Add" screen
		{
			clearRequiredField(qualForm.code);
			if (emssObjInstance.emssObj.filterSelect)
			{
				if (NonSpace(qualForm.code.value) == 0)
				{
					setRequiredField(qualForm.code, getSeaPhrase("CM_254","CM"));
					return;
				}
			}
			else
			{
				if (qualForm.code.selectedIndex == 0)
				{
					setRequiredField(qualForm.code, getSeaPhrase("CM_254","CM"));
					return;
				}
			}	
		}
		else // Edits for "Update" screen
		{
			clearRequiredField(qualForm.code);
			if (NonSpace(qualForm.code.value) == 0)
			{
				setRequiredField(qualForm.code, getSeaPhrase("CM_254","CM"));
				return;
			}
		}
		if(_TABSELECTED == 0)
		{
			clearRequiredField(qualForm.perrating);
			if (NonSpace(qualForm.perrating.value) && !ValidNumber(qualForm.perrating,6,2))
			{
				setRequiredField(qualForm.perrating, getSeaPhrase("INVALID_NO","ESS"));
				return;
			}
		}
		// Edit the date formatting.
		if (NonSpace(qualForm.dateacquired.value) && ValidDate(qualForm.dateacquired) == false)
       		return;
       	if (NonSpace(qualForm.renewdate.value) && ValidDate(qualForm.renewdate) == false)
       		return;
       	if (_TABSELECTED == 0 && NonSpace(qualForm.datereturned.value) && ValidDate(qualForm.datereturned) == false)
       		return;
	}
	else if (_TABSELECTED == 2) // Education - Edits for "Add" and "Update" screens
	{
		if (typeof(qualForm.degree) != "undefined") // Edits for "Add" screen
		{
			clearRequiredField(qualForm.degree);
			clearRequiredField(qualForm.subject);			
			if (emssObjInstance.emssObj.filterSelect)
			{
				if (NonSpace(qualForm.degree.value) == 0)
				{
					setRequiredField(qualForm.degree, getSeaPhrase("CM_255","CM"));
					return;
				}
				if (NonSpace(qualForm.subject.value) == 0)
				{
					setRequiredField(qualForm.subject, getSeaPhrase("CM_256","CM"));
					return;
				}				
			}
			else
			{
				if (qualForm.degree.options[qualForm.degree.selectedIndex].value == " ")
				{
					setRequiredField(qualForm.degree, getSeaPhrase("CM_255","CM"));
					return;
				}
				if (qualForm.subject.options[qualForm.subject.selectedIndex].value == " ")
				{
					setRequiredField(qualForm.subject, getSeaPhrase("CM_256","CM"));
					return;
				}
			}	
		}
		else // Edits for "Update" screen
		{
			clearRequiredField(qualForm.code);
			if (NonSpace(qualForm.code.value) == 0)
			{
				setRequiredField(qualForm.code, getSeaPhrase("CM_254","CM"));
				return;
			}
			clearRequiredField(qualForm.subject);
			if (emssObjInstance.emssObj.filterSelect)
			{
				if (NonSpace(qualForm.subject.value) == 0)
				{
					setRequiredField(qualForm.subject, getSeaPhrase("CM_256","CM"));
					return;
				}			
			}
			else
			{
				if (qualForm.subject.options[qualForm.subject.selectedIndex].value == " ")
				{
					setRequiredField(qualForm.subject, getSeaPhrase("CM_256","CM"));
					return;
				}			
			}
		}
		clearRequiredField(qualForm.perrating);
		if (NonSpace(qualForm.perrating.value) && !ValidNumber(qualForm.perrating,6,2))
		{
			setRequiredField(qualForm.perrating, getSeaPhrase("INVALID_NO","ESS"));
			return;
		}
		// Edit the date formatting.
		if (NonSpace(qualForm.renewaldate.value) && ValidDate(qualForm.renewaldate) == false)
       		return;		
	}
	if (_ADDINGQUALIFICATION)
		UpdateQualification_MyActionPlan_OnClick("A")
	else
		UpdateQualification_MyActionPlan_OnClick("C")
}

function FillQualification(formObj, Type)
{
	switch (Type)
	{
		case "Competency":
		if (formObj.code.selectedIndex != 0)
		{
			formObj.qualification.value = FilteredQualification[formObj.code.selectedIndex-1].description;
			formObj.type.value = FilteredQualification[formObj.code.selectedIndex-1].type;
			self.main.document.getElementById("competencyType").innerHTML = FilteredQualification[formObj.code.selectedIndex-1].type;
		}
		else
		{
			formObj.qualification.value = "";
			formObj.type.value = "";
			self.main.document.getElementById("competencyType").innerHTML = "";
		}
		break;
		case "Certifications":
		if (formObj.code.selectedIndex != 0)
			formObj.qualification.value = FilteredQualification[formObj.code.selectedIndex-1].description;
		else
			formObj.qualification.value = "";
		break;
	}
}

//////////////////////////////////////////////////////////////////////////////////////////
//								MAIN DRAWING TASKS										//
//////////////////////////////////////////////////////////////////////////////////////////

function DrawQualficationsTabs(rpFlag, TabSelected)
{
	var TabsArray = new Array(
		new TabPane("Competencies", getSeaPhrase("CM_69","CM"), 110),
		new TabPane("Certifications", getSeaPhrase("CM_70","CM"), 110),
		new TabPane("Education", getSeaPhrase("CM_49","CM"), 110)
	);
	var Tab = new TabObject(TabsArray, TabSelected, "Qualifications");
	Tab.Style(InnerTabBorderColor, InnerTabbgColorTabDown, InnerTabbgColorTabUp, InnerTabfgColorTabDown, InnerTabfgColorTabUp, InnerTabfontSize, InnerTabfontFamily, InnerTabfontWeight);
	if (_CURRENTTAB == "EMPLOYEEQUALIFICATIONS")
		_CURRENTQUALWINDESC = getSeaPhrase("CM_227","CM")
	else
		_CURRENTQUALWINDESC = getSeaPhrase("CM_157","CM")
	var pObj = new CareerManagementWindowObject(Window2,"main", "MyQualifications_MyQualifications", 2,22,395,490, true, _CURRENTQUALWINDESC);
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.TabObject = Tab;
	if (rpFlag) pObj.ReplaceFlag = true;
	pObj.DrawTabbed();
}

function DrawCategoryInstructions_MyQualifications()
{
	var Desc = '<span class="contenttextCM">'+getSeaPhrase("CM_257","CM")+'</span>'
	createLayer("main","Category_Instructions",10,80,380,40,true,Desc,"","");
	Desc = '<span class="contenttextCM">'+getSeaPhrase("CM_258","CM")+'</span>'
	createLayer("main","Category_InstructionsAdd",10,80,380,40,false,Desc,"","");
	Desc = DataForQualificationsAlert(0, "CompetencyDetail_MyQualifications");
	var pObj = new CareerManagementWindowObject(Window6,"main", "MyQualification_MyQualifications", 502,23,288,180, true, "");
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.WindowInformation = Desc;
	pObj.DrawView(10, 100, 380, 360);
}

function DrawCompetencyDetail_MyQualifications()
{
	var pObj = new CareerManagementWindowObject(Window2,"main", "CompetencyDetail_MyQualifications", 400,22,392,490, false, getSeaPhrase("CM_261","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.Detail = true;
	pObj.Draw();
	pObj.DrawView(404, 54, 382, 410);
}

function ShowCompetencyDetail_MyQualifications(nCmd)
{
	ShowWin(nCmd, "main", "CompetencyDetail_MyQualifications", true, true, false);
}

function ShowMyQualification_MyQualifications(nCmd)
{
	ShowWin(nCmd, "main", "MyQualification_MyQualifications", true, false, false);
}

function ShowMyQualification_Header(nCmd, DataFlag)
{
	if (DataFlag)
	{
		showLayer("main", "Category_Instructions");
		hideLayer("main", "Category_InstructionsAdd");
	}
	else
	{
		hideLayer("main", "Category_Instructions");
		showLayer("main", "Category_InstructionsAdd");
	}
}

function DrawInstructions_EmployeeQualifications(SelectValues)
{
	var pObj = new CareerManagementWindowObject(Window7,"main", "Instructions_EmployeeActionPlan", 402,22,390,185, true, getSeaPhrase("CM_114","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor;
	pObj.Draw();
	var Desc = '<label class="contenttextCM" for="cmbDirectReports">'+getSeaPhrase("CM_263","CM")+'</label>';
	createLayer("main","InstructionsHeader_EmployeeActionPlan",418,53,345,50,true,Desc,"","");
	MakeSelectBox("DirectReports", 525, 125, 275, 30, "cmbDirectReports", SelectValues, true, _DIRECTREPORTSINDEX, true);
}

var __WindowName;
var __ProfileIndex;
var __ProfileType;

function DataForQualificationsAlert(Index, Win, LinkIndex)
{
	var EmployeeQualifications = (_CURRENTTAB == "EMPLOYEEQUALIFICATIONS")?true:false;
	var MyQualifications = (_CURRENTTAB == "MYQUALIFICATIONS")?true:false;
	var ActionPlan = (_CURRENTTAB == "ACTIONPLAN")?true:false;
	var DataFlag = false;
	var Desc = "";
	var LinkColor = "";
	if ((typeof(StandardCareerProfile) == "undefined") || (StandardCareerProfile == null) || (EmployeeQualifications && _DIRECTREPORTSINDEX < 0))
	{
		if (EmployeeQualifications && _DIRECTREPORTSINDEX < 0) // This is a manager tab -- no report selected.
			return '<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td><span class="contenttextCM">'+getSeaPhrase("CM_179","CM")+'</span></td></tr></table>';
		else
			return '';
	}
	if (MyQualifications || EmployeeQualifications)
		Desc += '<p>'
	Desc += '<table border="0" cellpadding="0" cellspacing="0" role="presentation">';
	for (var i=0; i<StandardCareerProfile.CompetencyDetail.length && (((MyQualifications || EmployeeQualifications) && Index==0) || ActionPlan); i++)
	{
		var dteDiff = getDteDifference(StandardCareerProfile.CompetencyDetail[i].renewDate, authUser.date);
		if (dteDiff < 0) dteDiff *= -1;
		// PT 108823 - only show qualifications within emssObjInstance.emssObj.cmQualExpireDays days from system date
		if ((!isNaN(dteDiff) && (dteDiff<=emssObjInstance.emssObj.cmQualExpireDays) && ActionPlan) || !ActionPlan)
		{
			if (typeof(LinkIndex) != "undefined" && LinkIndex != null && LinkIndex == i)
				LinkColor = ' class="tablerowhighlightCM"'
			else 
				LinkColor = ""
			DataFlag = true;
			var toolTip = StandardCareerProfile.CompetencyDetail[i].description+', '+FormatDte4(StandardCareerProfile.CompetencyDetail[i].renewDate)+' - '+getSeaPhrase("EDIT_DTL_FOR","SEA");
			Desc += '<tr><td '+LinkColor+'><a class="contenttextCM" href="javascript:;" onclick="parent.QualificationClicked('+i+',\'Competency\',\''+Win+'\');return false;"'
			Desc += ' title="'+toolTip+'">'+StandardCareerProfile.CompetencyDetail[i].description+'<span class="offscreen"> - '+getSeaPhrase("EDIT_DTL_FOR","SEA")+'</span></a></td>';
			if (ActionPlan)
			{
				Desc += '<td '+LinkColor+' style="width:5px">&nbsp;</td>'
				Desc += '<td '+LinkColor+'><a class="contenttextCM" href="javascript:;" onclick="parent.QualificationClicked('+i+',\'Competency\',\''+Win+'\');return false;"'
				Desc += ' title="'+toolTip+'">'+FormatDte4(StandardCareerProfile.CompetencyDetail[i].renewDate)+'<span class="offscreen"> - '+getSeaPhrase("EDIT_DTL_FOR","SEA")+'</span></a></td>';
			}
			Desc += '</tr>'
		}
	}
	for (var i=0; i<StandardCareerProfile.CertificationDetail.length && (((MyQualifications || EmployeeQualifications) && Index==1) || ActionPlan); i++)
	{
		var dteDiff = getDteDifference(StandardCareerProfile.CertificationDetail[i].renewDate, authUser.date);
		if (dteDiff < 0) dteDiff *= -1;
		// PT 108823 - only show qualifications within emssObjInstance.emssObj.cmQualExpireDays days from system date
		if ((!isNaN(dteDiff) && (dteDiff<=emssObjInstance.emssObj.cmQualExpireDays) && ActionPlan) || !ActionPlan)
		{
			if (typeof(LinkIndex) != "undefined" && LinkIndex != null && LinkIndex == i)
				LinkColor = ' class="tablerowhighlightCM"'
			else 
				LinkColor = ""
			DataFlag = true;
			var toolTip = StandardCareerProfile.CertificationDetail[i].description+', '+FormatDte4(StandardCareerProfile.CertificationDetail[i].renewDate)+' - '+getSeaPhrase("EDIT_DTL_FOR","SEA");
			Desc += '<tr><td '+LinkColor+'><a class="contenttextCM" href="javascript:;" onclick="parent.QualificationClicked('+i+',\'Certifications\',\''+Win+'\');return false;"'
			Desc += ' title="'+toolTip+'">'+StandardCareerProfile.CertificationDetail[i].description+'<span class="offscreen"> - '+getSeaPhrase("EDIT_DTL_FOR","SEA")+'</span></a></td>';
			if (ActionPlan)
			{
				Desc += '<td '+LinkColor+' style="width:5px">&nbsp;</td>'
				Desc += '<td '+LinkColor+'><a class="contenttextCM" href="javascript:;" onclick="parent.QualificationClicked('+i+',\'Certifications\',\''+Win+'\');return false"'
				Desc += ' title="'+toolTip+'">'+FormatDte4(StandardCareerProfile.CertificationDetail[i].renewDate)+'<span class="offscreen"> - '+getSeaPhrase("EDIT_DTL_FOR","SEA")+'</span></a></td>';
			}
			Desc += '</tr>'
		}
	}
	for (var i=0; i<StandardCareerProfile.EducationDetail.length && (((MyQualifications || EmployeeQualifications) && Index==2) || ActionPlan); i++)
	{
		var dteDiff = getDteDifference(StandardCareerProfile.EducationDetail[i].renewDate, authUser.date);
		if (dteDiff < 0) dteDiff *= -1;
		// PT 108823 - only show qualifications within emssObjInstance.emssObj.cmQualExpireDays days from system date
		if ((!isNaN(dteDiff) && (dteDiff<=emssObjInstance.emssObj.cmQualExpireDays) && ActionPlan) || !ActionPlan)
		{
			if (typeof(LinkIndex) != "undefined" && LinkIndex != null && LinkIndex == i)
				LinkColor = ' class="tablerowhighlightCM"'
			else 
				LinkColor = ""
			DataFlag = true;
			var toolTip = StandardCareerProfile.EducationDetail[i].description+', '+FormatDte4(StandardCareerProfile.EducationDetail[i].renewDate)+' - '+getSeaPhrase("EDIT_DTL_FOR","SEA");
			Desc += '<tr><td '+LinkColor+'><a class="contenttextCM" href="javascript:;" onclick="parent.QualificationClicked('+i+',\'Education\',\''+Win+'\');return false;"'
			Desc += ' title="'+toolTip+'">'+StandardCareerProfile.EducationDetail[i].description+'<span class="offscreen"> - '+getSeaPhrase("EDIT_DTL_FOR","SEA")+'</span></a></td>';
			if (ActionPlan)
			{
				Desc += '<td '+LinkColor+' style="width:5px">&nbsp;</td>'
				Desc += '<td '+LinkColor+'><a class="contenttextCM" href="javascript:;" onclick="parent.QualificationClicked('+i+',\'Education\',\''+Win+'\');return false;"'
				Desc += ' title="'+toolTip+'">'+FormatDte4(StandardCareerProfile.EducationDetail[i].renewDate)+'<span class="offscreen"> - '+getSeaPhrase("EDIT_DTL_FOR","SEA")+'</span></a></td>';
			}
			Desc += '</tr>'
		}
	}
	if (MyQualifications || EmployeeQualifications) 
	{
		Desc += '<tr><td style="white-space:nowrap;padding-top:10px">'
		Desc += uiButton(getSeaPhrase("CM_259","CM"),"parent.AddQualificationButton_MyQualifications_OnClick();return false;")
		Desc += '</td></tr>'
	}
	Desc += '</table>'
	if (MyQualifications || EmployeeQualifications)
		ShowMyQualification_Header(true, DataFlag);
	return Desc;
}

function RepaintQualificationLinks(Tab, Index)
{
	var EmployeeQualifications = (_CURRENTTAB == "EMPLOYEEQUALIFICATIONS")?true:false;
	var MyQualifications = (_CURRENTTAB == "MYQUALIFICATIONS")?true:false;
	var ActionPlan = (_CURRENTTAB == "ACTIONPLAN")?true:false;
	if (ActionPlan)
	{
		Desc = DataForQualificationsAlert(Tab, "QualificationsDetail_MyActionPlan", Index);
		ReplaceWindowContent("main", "Qualifications_MyActionPlanWindow", Desc);
	}
	else if (EmployeeQualifications || MyQualifications)
	{
		Desc = DataForQualificationsAlert(Tab, "CompetencyDetail_MyQualifications", Index);
		ReplaceWindowContent("main","MyQualification_MyQualificationsWindow",Desc);
	}
}

function QualificationClicked(Index, Type, Win)
{	
	var EmployeeQualifications = (_CURRENTTAB == "EMPLOYEEQUALIFICATIONS")?true:false;
	var ActionPlanFlag = (_CURRENTTAB == "ACTIONPLAN")?true:false;
	var ReturnFunc = (arguments.length > 3)?arguments[3]:"";
	var useDefault = (arguments.length > 4)?arguments[4]:true;
	var MyQualifications = (_CURRENTTAB == "MYQUALIFICATIONS")?true:false;
	var Desc = "";
	var TrainingCoursesDesc = "";
	var Profile = (useDefault)?StandardCareerProfile:CareerProfile;
	_ADDINGQUALIFICATION = false;
	if (ActionPlanFlag)
	{
		RepaintQualificationLinks(-1, Index);
		var StripTitleValue = 50;
		var StripTitleHeader = getSeaPhrase("CM_264","CM")+" - "
		ActionPlanWithCloseIcon_MyActionPlan_XIconClicked()
		ShowQualificationsDetail_MyActionPlan(true);
	}
	else if (MyQualifications || EmployeeQualifications)
	{
		RepaintQualificationLinks(_TABSELECTED, Index);
		var StripTitleValue = 60;
		var StripTitleHeader = getSeaPhrase("CM_261","CM")+" - "
		ShowCompetencyDetail_MyQualifications(true);
		if (EmployeeQualifications)
		{
			hideLayer("main", "Instructions_EmployeeActionPlanTitle");
			ShowSelect(false, "main", "cmbDirectReports");
		}
	}
	else
	{
		var StripTitleValue = 60;
		var StripTitleHeader = getSeaPhrase("CM_220","CM")+" - ";
		var TrainingCourses = getSeaPhrase("CM_194","CM")+" - ";
	}
	var obj	= new DMEObject(authUser.prodline,"EMPCODES");
	obj.out = "JAVASCRIPT";
	obj.index = "epcset1";
	obj.field = "type;code;description;subject;instructor;in-pro-flag;per_rating;co-sponsored;"
	+ "state;lic-number;date-acquired;renew-date;renewal-code;renewal-code,xlt;"
	+ "skill-source;currency-code;cost;profic-level;date-returned;seq-nbr;"
	+ "skill-source.description;currency.description;subject.description;institution.description;"
	__WindowName = Win;
	__ProfileIndex = Index;
	__ProfileType = Type;
	switch (Type)
	{
		case "Competency":
			var pObj = Profile.CompetencyDetail[Index];
			Desc = '<span class="layertitleCM">'+ StripTitle(StripTitleHeader + Profile.CompetencyDetail[Index].description, StripTitleValue)+ '</span>';
			TrainingCoursesDesc	= '<span class="layertitleCM">'+ StripTitle(TrainingCourses + Profile.CompetencyDetail[Index].description, StripTitleValue)+ '</span>';
			obj.func = "PaintCompetency_DetailScreen("+Index+",'"+Win+"','"+ReturnFunc+"',"+useDefault+")";
			break;
		case "Certifications":
			var pObj = Profile.CertificationDetail[Index];
			Desc = '<span class="layertitleCM">'+ StripTitle(StripTitleHeader + Profile.CertificationDetail[Index].description, StripTitleValue)+ '</span>';
			TrainingCoursesDesc	= '<span class="layertitleCM">'+ StripTitle(TrainingCourses + Profile.CertificationDetail[Index].description, StripTitleValue)+ '</span>';
			obj.func = "PaintCertification_DetailScreen("+Index+",'"+Win+"','"+ReturnFunc+"',"+useDefault+")";
			break;
		case "Education":
			var pObj = Profile.EducationDetail[Index];
			Desc = '<span class="layertitleCM">'+ StripTitle(StripTitleHeader + Profile.EducationDetail[Index].description, StripTitleValue)+ '</span>';
			TrainingCoursesDesc	= '<span class="layertitleCM">'+ StripTitle(TrainingCourses + Profile.EducationDetail[Index].description, StripTitleValue)+ '</span>';
			obj.func = "PaintEducation_DetailScreen("+Index+",'"+Win+"','"+ReturnFunc+"',"+useDefault+")";
			break;
	}
	obj.key = escape(authUser.company)+"="+escapeEx(pObj.type)+"=0"+"="+escape(Profile.employee)+"="+escapeEx(pObj.code);
	if (pObj.subject != null || pObj.seqNbr != null)
	{
		if (pObj.subject != null)
			obj.key += "="+escapeEx(pObj.subject);
		else 
			obj.key += "="+escape(" ");
		if (pObj.seqNbr != null)
			obj.key += "="+escape(pObj.seqNbr,1);
	}
	ReplaceWindowContent("main",Win+"Window","");
	ChangeTitle("main", Win, Desc);
	if (!ActionPlanFlag && !MyQualifications && !EmployeeQualifications)
		ChangeTitle("main", "Courses_MyJobProfile", TrainingCoursesDesc);
	obj.debug = false;
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), function(){DME(obj,"jsreturn");});
}

function PaintCompetency_DetailScreen(Index, Win, ReturnFunc)
{
	var useDefault = (arguments.length > 3)?arguments[3]:true;
	var Profile = (useDefault)?StandardCareerProfile:CareerProfile;
	if (!self.jsreturn.NbrRecs)
	{
		Desc = '<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td class="contenttextCM">'+getSeaPhrase("CM_265","CM")+'</td></tr></table>'
		ReplaceWindowContent("main",Win+"Window",Desc);
		if (ReturnFunc != "")
			eval(ReturnFunc);
		removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
		return;
	}
	else
	{
		// If we don't have any proficiency levels defined in PCODES or the display will be readonly, don't bother with an additional call to PACOMPPROF.
		if (Proficiency.length && Profile.CompetencyDetail[Index].updateFlag == "Y")
			GetCompProficiencyLevels(self.jsreturn.record[0].type,self.jsreturn.record[0].code,Index,Win,ReturnFunc,useDefault);
		else
		{
			FilteredProficiency = Proficiency;
			FinishCompetency_DetailScreen(Index,Win,ReturnFunc,useDefault);
		}
	}
}

function FinishCompetency_DetailScreen(Index, Win, ReturnFunc)
{
	var pDme = self.jsreturn.record[0];
	var MyQualifications = (_CURRENTTAB == "MYQUALIFICATIONS")?true:false;
	var JobProfileFlag = (_CURRENTTAB == "MYJOBPROFILE")?true:false;
	var EmployeeQualifications = (_CURRENTTAB == "EMPLOYEEQUALIFICATIONS")?true:false;
	var EmployeeProfile = (_CURRENTTAB == "INDIVIDUALPROFILE")?true:false;
	var ExploreCareers = (_CURRENTTAB.indexOf("EXPLORECAREERS")!=-1)?true:false;
	var useDefault = (arguments.length > 3)?arguments[3]:true;
	var Profile = (useDefault)?StandardCareerProfile:CareerProfile;
	var PeRating = parseFloat(pDme.per_rating);
	if (PeRating == 0)
		PeRating = "";
	var toolTip;
	if (JobProfileFlag || EmployeeProfile || ExploreCareers)
	{
		var Desc = '<table border="0" cellpadding="0" cellspacing="0" summary="'+getSeaPhrase("TSUM_15","SEA",[pDme.description])+'">'
		Desc += '<caption class="offscreen">'+getSeaPhrase("TCAP_11","SEA",[pDme.description])+'</caption>'
		Desc += '<tr><th scope="col" colspan="2"></th></tr>'
		Desc += '<tr><th scope="row" style="width:150px" class="contentlabelCM">'+getSeaPhrase("CM_232","CM")+'</th><td class="plaintablecell">'+MatchForDescription(pDme.profic_level, "FilteredProficiency")+'</td></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_236","CM")+'</th><td class="plaintablecell">'+PeRating+'</td></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_237","CM")+'</th><td class="plaintablecell">'+pDme.date_acquired+'</td></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_239","CM")+'</th><td class="plaintablecell">'+pDme.renew_date+'</td></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_240","CM")+'</th><td class="plaintablecell">'+pDme.date_returned+'</td></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_234","CM")+'</th><td class="plaintablecell">'+pDme.renewal_code_xlt+'</td></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_233","CM")+'</th><td class="plaintablecell">'+pDme.skill_source_description+'</td></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_235","CM")+'</th><td class="plaintablecell">'+pDme.instructor+'</td></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_241","CM")+'</th><td class="plaintablecell">'+((pDme.co_sponsored=="Y")?getSeaPhrase("CM_169","CM"):getSeaPhrase("CM_168","CM"))+'</td></tr>'
		Desc += '</table>'
	}
	else
	{
		if (Profile.CompetencyDetail[Index].updateFlag != "Y")
		{
			var showButtons = false;
			var Desc = '<table border="0" cellpadding="0" cellspacing="0" summary="'+getSeaPhrase("TSUM_15","SEA",[Profile.CompetencyDetail[Index].description])+'">'
			Desc += '<caption class="offscreen">'+getSeaPhrase("TCAP_11","SEA",[Profile.CompetencyDetail[Index].description])+'</caption>'
			Desc += '<tr><th scope="col" colspan="2"></th></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_46","CM")+'</th><td class="plaintablecell">'+Profile.CompetencyDetail[Index].description+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_232","CM")+'</th><td class="plaintablecell">'+MatchForDescription(pDme.profic_level, "FilteredProficiency")+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_233","CM")+'</th><td class="plaintablecell">'+pDme.skill_source_description+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_234","CM")+'</th><td class="plaintablecell">'+pDme.renewal_code_xlt+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_235","CM")+'</th><td class="plaintablecell">'+pDme.instructor+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_236","CM")+'</th><td class="plaintablecell">'+PeRating+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_237","CM")+'</th><td class="plaintablecell">'+pDme.date_acquired+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_239","CM")+'</th><td class="plaintablecell">'+pDme.renew_date+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_240","CM")+'</th><td class="plaintablecell">'+pDme.date_returned+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_241","CM")+'</th><td class="plaintablecell">'+((pDme.co_sponsored=="Y")?getSeaPhrase("CM_169","CM"):getSeaPhrase("CM_168","CM"))+'</td></tr>'
			Desc += '</table>'
		}
		else
		{
			var showButtons = true;
			var Desc = '<form name="qualificationform"><table border="0" cellpadding="0" cellspacing="0" summary="'+getSeaPhrase("TSUM_15","SEA",[Profile.CompetencyDetail[Index].description])+'">'
			Desc += '<caption class="offscreen">'+getSeaPhrase("TCAP_11","SEA",[Profile.CompetencyDetail[Index].description])+'</caption>'
			Desc += '<tr><th scope="col" colspan="2"></th></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_46","CM")+'</th><td class="plaintablecell">'+Profile.CompetencyDetail[Index].description+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM"><label for="proficiency">'+getSeaPhrase("CM_232","CM")+'</label></th><td class="plaintablecell"><select class="contenttextCM" id="proficiency" name="proficiency">'+BuildSelect(pDme.profic_level,"FilteredProficiency")+'</select></td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM"><label for="skillsource">'+getSeaPhrase("CM_233","CM")+'</label></th>'
			if (emssObjInstance.emssObj.filterSelect)
			{
				toolTip = dmeFieldToolTip("skillsource");
				Desc += '<td class="plaintablecell" nowrap><input class="contexttextCM" type="text" id="skillsource" name="skillsource" fieldnm="skillsource" value="'+pDme.skill_source+'" size="10" maxlength="10" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'skillsource\');">'
				+ '<a href="javascript:parent.openDmeFieldFilter(\'skillsource\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
				+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
				+ '<span id="skillsourceDesc" style="width:150px" class="fieldlabelleft">'+pDme.skill_source_description+'</span></td></tr>'
			}
			else	
				Desc += '<td class="plaintablecell"><select class="contenttextCM" id="skillsource" name="skillsource">'+BuildSelect(pDme.skill_source,"Source")+'</select></td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM"><label for="renewalcode">'+getSeaPhrase("CM_234","CM")+'</label></th><td class="plaintablecell"><select class="contenttextCM" id="renewalcode" name="renewalcode">'+BuildRenewalSelect(pDme.renewal_code)+'</select></td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM"><label for="instructor">'+getSeaPhrase("CM_235","CM")+'</label></th><td class="plaintablecell"><input class="contenttextCM" type="text" size="10" maxlength="10" id="instructor" name="instructor" value="'+pDme.instructor+'"></td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM"><label for="perrating">'+getSeaPhrase("CM_236","CM")+'</label></th><td class="plaintablecell"><input class="contenttextCM" type="text" size="6" maxlength="6" id="perrating" name="perrating" value="'+PeRating+'"></td></tr>'
			toolTip = uiDateToolTip(getSeaPhrase("CM_237","CM"));
			Desc += '<tr><th scope="row" class="contentlabelCM"><label id="dateacquiredLbl" for="dateacquired">'+getSeaPhrase("CM_237","CM")+'</label></th><td class="plaintablecell">'
			+ '<input class="contenttextCM" type="text" id="dateacquired" name="dateacquired" value="'+pDme.date_acquired+'" size="10" maxlength="10" onfocus="this.select()" aria-labelledby="dateacquiredLbl dateacquiredFmt">'
			+ '<a class="contenttextCM" href="javascript:;" onclick="parent.DateSelect(\'dateacquired\');return false;" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a><span class="contenttextCM">'+uiDateFormatSpan("dateacquiredFmt")+'</span></td></tr>'
			toolTip = uiDateToolTip(getSeaPhrase("CM_239","CM"));
			Desc += '<tr><th scope="row" class="contentlabelCM"><label id="renewdateLbl" for="renewdate">'+getSeaPhrase("CM_239","CM")+'</label></th><td class="plaintablecell">'
			+ '<input class="contenttextCM" type="text" id="renewdate" name="renewdate" value="'+pDme.renew_date+'" size="10" maxlength="10" onfocus="this.select()" aria-labelledby="renewdateLbl renewdateFmt">'
			+ '<a class="contenttextCM" href="javascript:;" onclick="parent.DateSelect(\'renewdate\');return false;" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a><span class="contenttextCM">'+uiDateFormatSpan("renewdateFmt")+'</span></td></tr>'
			toolTip = uiDateToolTip(getSeaPhrase("CM_240","CM"));
			Desc += '<tr><th scope="row" class="contentlabelCM"><label id="datereturnedLbl" for="datereturned">'+getSeaPhrase("CM_240","CM")+'</label></th><td class="plaintablecell">'
			+ '<input class="contenttextCM" type="text" id="datereturned" name="datereturned" value="'+pDme.date_returned+'" size="10" maxlength="10" onfocus="this.select()" aria-labelledby="datereturnedLbl datereturnedFmt">'
			+ '<a class="contenttextCM" href="javascript:;" onclick="parent.DateSelect(\'datereturned\');return false;" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a><span class="contenttextCM">'+uiDateFormatSpan("datereturnedFmt")+'</span></td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM"><label for="cosponsored">'+getSeaPhrase("CM_241","CM")+'</label></th><td class="plaintablecell"><select class="contenttextCM" id="cosponsored" name="cosponsored">'+BuildYesNo(pDme.co_sponsored)+'</select></td></tr>'
			Desc += '<tr><th scope="row">&nbsp;</th><td class="plaintablecell" style="white-space:nowrap;padding-top:10px">'
			if (MyQualifications || EmployeeQualifications) 
			{
				Desc += uiButton(getSeaPhrase("CM_95","CM"),"parent.UpdateQualificationButton_MyQualifications_OnClick();return false;")
				Desc += uiButton(getSeaPhrase("CM_91","CM"),"parent.DeleteQualificationButton_MyQualifications_OnClick();return false;","margin-left:15px")
			} 
			else
				Desc += uiButton(getSeaPhrase("CM_95","CM"),"parent.UpdateQualification_MyActionPlan_OnClick();return false;")
			Desc += '</td></tr></table>'
			Desc += '<input type="hidden" name="seqnbr" value="'+pDme.seq_nbr+'">'
			Desc += '<input type="hidden" name="code" value="'+pDme.code+'">'
			Desc += '<input type="hidden" name="type" value="'+pDme.type+'">'
			Desc += '</form>'
		}
	}
	ReplaceWindowContent("main",Win+"Window",Desc);
	if (ReturnFunc != "")
		eval(ReturnFunc);
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
}

function PaintCertification_DetailScreen(Index, Win, ReturnFunc)
{
	var useDefault = (arguments.length > 3) ? arguments[3] : true;
	if (!self.jsreturn.NbrRecs)
	{
		Desc = '<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td class="contenttextCM">'+getSeaPhrase("CM_265","CM")+'</td></tr></table>'
		ReplaceWindowContent("main",Win+"Window",Desc);
		if (ReturnFunc != "")
			eval(ReturnFunc);
		removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
		return;
	}
	else
		FinishCertification_DetailScreen(Index, Win, ReturnFunc, useDefault);
}

function FinishCertification_DetailScreen(Index, Win, ReturnFunc)
{
	var Desc = "";
	var pDme = self.jsreturn.record[0];
	var MyQualifications = (_CURRENTTAB == "MYQUALIFICATIONS")?true:false;
	var JobProfileFlag = (_CURRENTTAB == "MYJOBPROFILE")?true:false;
	var EmployeeQualifications = (_CURRENTTAB == "EMPLOYEEQUALIFICATIONS")?true:false;
	var EmployeeProfile = (_CURRENTTAB == "INDIVIDUALPROFILE")?true:false;
	var ExploreCareers = (_CURRENTTAB.indexOf("EXPLORECAREERS")!=-1)?true:false;
	var useDefault = (arguments.length > 3)?arguments[3]:true;
	var Profile = (useDefault)?StandardCareerProfile:CareerProfile;
	var toolTip;
	if (JobProfileFlag || EmployeeProfile || ExploreCareers)
	{
		Desc = '<table border="0" cellpadding="0" cellspacing="0" summary="'+getSeaPhrase("TSUM_15","SEA",[pDme.description])+'">'
		Desc += '<caption class="offscreen">'+getSeaPhrase("TCAP_11","SEA",[pDme.description])+'</caption>'
		Desc += '<tr><th scope="col" colspan="2"></th></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_243","CM")+'</th><td class="plaintablecell">'+ReturnStateDescription(pDme.state)+'</td></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_244","CM")+'</th><td class="plaintablecell">'+pDme.lic_number+'</td></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_237","CM")+'</th><td class="plaintablecell">'+pDme.date_acquired+'</td></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_240","CM")+'</th><td class="plaintablecell">'+pDme.renew_date+'</td></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_234","CM")+'</th><td class="plaintablecell">'+pDme.renewal_code_xlt+'</td></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_233","CM")+'</th><td class="plaintablecell">'+pDme.skill_source_description+'</td></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_241","CM")+'</th><td class="plaintablecell">'+((pDme.co_sponsored=="Y")?getSeaPhrase("CM_169","CM"):getSeaPhrase("CM_168","CM"))+'</td></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_245","CM")+'</th><td class="plaintablecell">'+pDme.cost+'</td></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_246","CM")+'</th><td class="plaintablecell">'+pDme.currency_description+'</td></tr>'
		Desc += '</table>'
	}
	else
	{
		if (Profile.CertificationDetail[Index].updateFlag != "Y")
		{
			var showButtons = false;
			Desc = '<table border="0" cellpadding="0" cellspacing="0" summary="'+getSeaPhrase("TSUM_15","SEA",[Profile.CertificationDetail[Index].description])+'">'
			Desc += '<caption class="offscreen">'+getSeaPhrase("TCAP_11","SEA",[Profile.CertificationDetail[Index].description])+'</caption>'
			Desc += '<tr><th scope="col" colspan="2"></th></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_46","CM")+'</th><td class="plaintablecell">'+Profile.CertificationDetail[Index].description+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_243","CM")+'</th><td class="plaintablecell">'+ReturnStateDescription(pDme.state)+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_244","CM")+'</th><td class="plaintablecell">'+pDme.lic_number+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_237","CM")+'</th><td class="plaintablecell">'+pDme.date_acquired+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_240","CM")+'</th><td class="plaintablecell">'+pDme.renew_date+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_234","CM")+'</th><td class="plaintablecell">'+pDme.renewal_code_xlt+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_233","CM")+'</th><td class="plaintablecell">'+pDme.skill_source_description+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_241","CM")+'</th><td class="plaintablecell">'+((pDme.co_sponsored=="Y")?getSeaPhrase("CM_169","CM"):getSeaPhrase("CM_168","CM"))+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_245","CM")+'</th><td class="plaintablecell">'+pDme.cost+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_246","CM")+'</th><td class="plaintablecell">'+pDme.currency_description+'</td></tr>'
			Desc += '</table>'
		}
		else
		{
			var showButtons = true;
			Desc = '<form name="qualificationform">'
			Desc += '<table border="0" cellpadding="0" cellspacing="0" summary="'+getSeaPhrase("TSUM_15","SEA",[Profile.CertificationDetail[Index].description])+'">'
			Desc += '<caption class="offscreen">'+getSeaPhrase("TCAP_11","SEA",[Profile.CertificationDetail[Index].description])+'</caption>'
			Desc += '<tr><th scope="col" colspan="2"></th></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_46","CM")+'</th><td class="plaintablecell">'+Profile.CertificationDetail[Index].description+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM"><label for="state">'+getSeaPhrase("CM_243","CM")+'</label></th><td class="plaintablecell"><select class="contenttextCM" id="state" name="state">'+BuildStateSelect(pDme.state)+'</select></td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM"><label for="licnumber">'+getSeaPhrase("CM_244","CM")+'</label></th><td class="plaintablecell"><input class="contenttextCM" type="text" id="licnumber" name="licnumber" size="15" maxlength="20" value="'+pDme.lic_number+'"></td></tr>'
			toolTip = uiDateToolTip(getSeaPhrase("CM_237","CM"));
			Desc += '<tr><th scope="row" class="contentlabelCM"><label id="dateacquiredLbl" for="dateacquired">'+getSeaPhrase("CM_237","CM")+'</label></th><td class="plaintablecell">'
			+ '<input class="contenttextCM" type="text" id="dateacquired" name="dateacquired" value="'+pDme.date_acquired+'" size="10" maxlength="10" onfocus="this.select()" aria-labelledby="dateacquiredLbl dateacquiredFmt">'
			+ '<a class="contenttextCM" href="javascript:;" onclick="parent.DateSelect(\'dateacquired\');return false;" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a><span class="contenttextCM">'+uiDateFormatSpan("dateacquiredFmt")+'</span></td></tr>'
			toolTip = uiDateToolTip(getSeaPhrase("CM_240","CM"));
			Desc += '<tr><th scope="row" class="contentlabelCM"><label id="renewdateLbl" for="renewdate">'+getSeaPhrase("CM_240","CM")+'</label></th><td class="plaintablecell">'
			+ '<input class="contenttextCM" type="text" id="renewdate" name="renewdate" value="'+pDme.renew_date+'" size="10" maxlength="10" onfocus="this.select()" aria-labelledby="renewdateLbl renewdateFmt">'
			+ '<a class="contenttextCM" href="javascript:;" onclick="parent.DateSelect(\'renewdate\');return false;" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a><span class="contenttextCM">'+uiDateFormatSpan("renewdateFmt")+'</span></td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM"><label for="renewalcode">'+getSeaPhrase("CM_234","CM")+'</label></th><td class="plaintablecell"><select class="contenttextCM" id="renewalcode" name="renewalcode">'+BuildRenewalSelect(pDme.renewal_code)+'</select></td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM"><label for="skillsource">'+getSeaPhrase("CM_233","CM")+'</label></th>'
			if (emssObjInstance.emssObj.filterSelect)
			{
				toolTip = dmeFieldToolTip("skillsource");
				Desc += '<td class="plaintablecell" nowrap><input class="contenttextCM" type="text" id="skillsource" name="skillsource" fieldnm="skillsource" value="'+pDme.skill_source+'" size="10" maxlength="10" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'skillsource\');">'
				+ '<a href="javascript:parent.openDmeFieldFilter(\'skillsource\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
				+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
				+ '<span id="skillsourceDesc" style="width:150px" class="fieldlabelleft">'+pDme.skill_source_description+'</span></td></tr>'
			}
			else	
				Desc += '<td class="plaintablecell"><select class="contenttextCM" id="skillsource" name="skillsource">'+BuildSelect(pDme.skill_source, "Source")+'</select></td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM"><label for="cosponsored">'+getSeaPhrase("CM_241","CM")+'</label></th><td class="plaintablecell"><select class="contenttextCM" id="cosponsored" name="cosponsored">'+BuildYesNo(pDme.co_sponsored)+'</select></td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM"><label for="cost">'+getSeaPhrase("CM_245","CM")+'</label></th><td class="plaintablecell"><input class="contenttextCM" type="text" id="cost" name="cost" size="14" maxlength="14" value="'+parseFloat(pDme.cost)+'"></td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM"><label for="currencycode">'+getSeaPhrase("CM_246","CM")+'</label></th>'
			if (emssObjInstance.emssObj.filterSelect)
			{
				toolTip = dmeFieldToolTip("currencycode");
				Desc += '<td class="plaintablecell" nowrap><input class="contenttextCM" type="text" id="currencycode" name="currencycode" fieldnm="currencycode" value="'+pDme.currency_code+'" size="5" maxlength="5" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'currencycode\');">'
				+ '<a href="javascript:parent.openDmeFieldFilter(\'currencycode\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
				+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
				+ '<span id="currencycodeDesc" style="width:150px" class="fieldlabelleft">'+pDme.currency_description+'</span></td></tr>'
			}
			else
				Desc += '<td class="plaintablecell"><select class="contenttextCM" id="currencycode" name="currencycode">'+BuildSelect(pDme.currency_code, "Currency")+'</select></td></tr>'
			Desc += '<tr><th scope="row">&nbsp;</th><td class="plaintablecell" style="white-space:nowrap;padding-top:10px">'
			if (MyQualifications || EmployeeQualifications) 
			{
				Desc += uiButton(getSeaPhrase("CM_95","CM"),"parent.UpdateQualificationButton_MyQualifications_OnClick();return false;")
				Desc += uiButton(getSeaPhrase("CM_91","CM"),"parent.DeleteQualificationButton_MyQualifications_OnClick();return false;","margin-left:15px")
			} 
			else if (!ExploreCareers)
				Desc += uiButton(getSeaPhrase("CM_95","CM"),"parent.UpdateQualification_MyActionPlan_OnClick();return false;")
			Desc += '</td></tr></table>'
			Desc += '<input type="hidden" name="seqnbr" value="'+pDme.seq_nbr+'">'
			Desc += '<input type="hidden" name="type" value="'+pDme.type+'">'
			Desc += '<input type="hidden" name="code" value="'+pDme.code+'">'
			Desc += '</form>'
		}
	}
	ReplaceWindowContent("main",Win+"Window",Desc);
	if (ReturnFunc != "")
		eval(ReturnFunc);
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));	
}

var __WindowName;

function PaintEducation_DetailScreen(Index, Win, ReturnFunc)
{
	var useDefault = (arguments.length > 3) ? arguments[3] : true;
	if (!self.jsreturn.NbrRecs)
	{
		Desc = '<table border="0" cellpadding="0" cellspacing="0"><tr><td class="contenttextCM">'+getSeaPhrase("CM_265","CM")+'</td></tr></table>'
		ReplaceWindowContent("main",Win+"Window",Desc);
		if (ReturnFunc != "")
			eval(ReturnFunc);
		removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
		return;
	}
	else
		FinishEducation_DetailScreen(Index, Win, ReturnFunc, useDefault);
}

function FinishEducation_DetailScreen(Index, Win, ReturnFunc)
{
	var Desc = "";
	var pDme = self.jsreturn.record[0];
	var MyQualifications = (_CURRENTTAB == "MYQUALIFICATIONS")?true:false;
	var JobProfileFlag = (_CURRENTTAB == "MYJOBPROFILE")?true:false;
	var EmployeeQualifications = (_CURRENTTAB == "EMPLOYEEQUALIFICATIONS")?true:false;
	var EmployeeProfile = (_CURRENTTAB == "INDIVIDUALPROFILE")?true:false;
	var ExploreCareers = (_CURRENTTAB.indexOf("EXPLORECAREERS")!=-1)?true:false;
	var useDefault = (arguments.length > 3)?arguments[3]:true;
	var Profile = (useDefault)?StandardCareerProfile:CareerProfile;	
	var inproflag = (pDme.in_pro_flag=="Y")?getSeaPhrase("CM_169","CM"):getSeaPhrase("CM_168","CM");
	var PeRating = parseFloat(pDme.per_rating);
	if (PeRating == 0)
		PeRating = "";
	var toolTip;
	if (JobProfileFlag || EmployeeProfile || ExploreCareers)
	{
		Desc = '<table border="0" cellpadding="0" cellspacing="0" summary="'+getSeaPhrase("TSUM_15","SEA",[pDme.description])+'">'
		Desc += '<caption class="offscreen">'+getSeaPhrase("TCAP_11","SEA",[pDme.description])+'</caption>'
		Desc += '<tr><th scope="col" colspan="2"></th></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_249","CM")+'</th><td class="plaintablecell">'+pDme.subject_description+'</td></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_251","CM")+'</th><td class="plaintablecell">'+pDme.institution_description+'</td></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_250","CM")+'</th><td class="plaintablecell">'+PeRating+'</td></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_252","CM")+'</th><td class="plaintablecell">'+pDme.renew_date+'</td></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_253","CM")+'</th><td class="plaintablecell">'+inproflag+'</td></tr>'
		Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_241","CM")+'</th><td class="plaintablecell">'+((pDme.co_sponsored=="Y")?getSeaPhrase("CM_169","CM"):getSeaPhrase("CM_168","CM"))+'</td></tr>'
		Desc += '</table>'
	}
	else
	{
		if (Profile.EducationDetail[Index].updateFlag != "Y")
		{
			var showButtons = false;
			Desc = '<table border="0" cellpadding="0" cellspacing="0" summary="'+getSeaPhrase("TSUM_15","SEA",[pDme.description])+'">'
			Desc += '<caption class="offscreen">'+getSeaPhrase("TCAP_11","SEA",[pDme.description])+'</caption>'
			Desc += '<tr><th scope="col" colspan="2"></th></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_248","CM")+'</th><td class="plaintablecell">'+pDme.code+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_249","CM")+'</th><td class="plaintablecell">'+pDme.subject_description+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_250","CM")+'</th><td class="plaintablecell">'+PeRating+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_251","CM")+'</th><td class="plaintablecell">'+pDme.institution_description+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_252","CM")+'</th><td class="plaintablecell">'+pDme.renew_date+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_253","CM")+'</th><td class="plaintablecell">'+inproflag+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_241","CM")+'</th><td class="plaintablecell">'+((pDme.co_sponsored=="Y")?getSeaPhrase("CM_169","CM"):getSeaPhrase("CM_168","CM"))+'</td></tr>'
			Desc += '</table>'
		}
		else
		{
			var showButtons = true
			Desc = '<form name="qualificationform">'
			Desc += '<table border="0" cellpadding="0" cellspacing="0" summary="'+getSeaPhrase("TSUM_15","SEA",[pDme.description])+'">'
			Desc += '<caption class="offscreen">'+getSeaPhrase("TCAP_11","SEA",[pDme.description])+'</caption>'
			Desc += '<tr><th scope="col" colspan="2"></th></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_248","CM")+'</th><td class="plaintablecell">'+Profile.EducationDetail[Index].description+'</td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM"><label for="subject">'+getSeaPhrase("CM_249","CM")+'</label></th>'
			if (emssObjInstance.emssObj.filterSelect)
			{
				toolTip = dmeFieldToolTip("subject");
				Desc += '<td class="plaintablecell" nowrap><input class="contenttextCM" type="text" id="subject" name="subject" fieldnm="subject" value="'+pDme.subject+'" size="10" maxlength="10" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'subject\');">'
				+ '<a href="javascript:parent.openDmeFieldFilter(\'subject\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
				+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
				+ '<span id="subjectDesc" style="width:150px" class="fieldlabelleft">'+pDme.subject_description+'</span></td></tr>'
			}
			else
				Desc += '<td class="plaintablecell"><select class="contenttextCM" id="subject" name="subject">'+BuildSelect(pDme.subject, "Subject")+'</select></td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM"><label for="perrating">'+getSeaPhrase("CM_250","CM")+'</label></th><td class="plaintablecell"><input class="contenttextCM" type="text" id="perrating" name="perrating" size="6" maxlength="6" value="'+PeRating+'"></td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM"><label for="instructor">'+getSeaPhrase("CM_251","CM")+'</label></th>'
			if (emssObjInstance.emssObj.filterSelect)
			{
				toolTip = dmeFieldToolTip("instructor");
				Desc += '<td class="plaintablecell" nowrap><input class="contenttextCM" type="text" id="instructor" name="instructor" fieldnm="instructor" value="'+pDme.instructor+'" size="10" maxlength="10" onfocus="this.select()" onkeyup="parent.dmeFieldOnKeyUpHandler(event,\'instructor\');">'
				+ '<a href="javascript:parent.openDmeFieldFilter(\'instructor\');" style="margin-left:5px" title="'+toolTip+'" aria-label="'+toolTip+'">'
				+ '<img align="top" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" border="0" alt="'+toolTip+'" title="'+toolTip+'"></a>'
				+ '<span id="instructorDesc" style="width:150px" class="fieldlabelleft">'+pDme.institution_description+'</span></td></tr>'
			}
			else
				Desc += '<td class="plaintablecell"><select class="contenttextCM" id="instructor" name="instructor">'+BuildSelect(pDme.instructor, "Institution")+'</select></td></tr>'
			toolTip = uiDateToolTip(getSeaPhrase("CM_252","CM"));
			Desc += '<tr><th scope="row" class="contentlabelCM"><label id="renewaldateLbl" for="renewaldate">'+getSeaPhrase("CM_252","CM")+'</label></th><td class="plaintablecell">'
			+ '<input class="contenttextCM" type="text" id="renewaldate" name="renewaldate" value="'+pDme.renew_date+'" size="10" maxlength="10" onfocus="this.select()" aria-labelledby="renewaldateLbl renewaldateFmt">'
			+ '<a class="contenttextCM" href="javascript:;" onclick="parent.DateSelect(\'renewaldate\');return false;" title="'+toolTip+'" aria-label="'+toolTip+'">'+uiCalendarIcon()+'</a><span class="contenttextCM">'+uiDateFormatSpan("renewaldateFmt")+'</span></td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM"><label for="inproflag">'+getSeaPhrase("CM_253","CM")+'</label></th><td class="plaintablecell"><select class="contenttextCM" id="inproflag" name="inproflag">'+BuildYesNo(pDme.in_pro_flag)+'</select></td></tr>'
			Desc += '<tr><th scope="row" class="contentlabelCM"><label for="cosponsored">'+getSeaPhrase("CM_241","CM")+'</label></th><td class="plaintablecell"><select class="contenttextCM" id="cosponsored" name="cosponsored">'+BuildYesNo(pDme.co_sponsored)+'</select></td></tr>'
			Desc += '<tr><th scope="row">&nbsp;</th><td class="plaintablecell" style="white-space:nowrap;padding-top:10px">'
			if (MyQualifications || EmployeeQualifications) 
			{
				Desc += uiButton(getSeaPhrase("CM_95","CM"),"parent.UpdateQualificationButton_MyQualifications_OnClick();return false;")
				Desc += uiButton(getSeaPhrase("CM_91","CM"),"parent.DeleteQualificationButton_MyQualifications_OnClick();return false;","margin-left:15px")
			} 
			else if (!ExploreCareers)
				Desc += uiButton(getSeaPhrase("CM_95","CM"),"parent.UpdateQualification_MyActionPlan_OnClick();return false;")
			Desc += '</td></tr></table>'
			Desc += '<input type="hidden" name="seqnbr" value="'+pDme.seq_nbr+'">'
			Desc += '<input type="hidden" name="type" value="'+pDme.type+'">'
			Desc += '<input type="hidden" name="code" value="'+pDme.code+'">'
			Desc += '</form>'
		}
	}
	ReplaceWindowContent("main",Win+"Window",Desc);
	if (ReturnFunc != "")
		eval(ReturnFunc);
	__WindowName = Win;
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
}

function FilterProficiencies(formobj, resetToDefault)
{	
	var code;
	var type;
	if (formobj.code.type == "text")
	{
		code = formobj.code.value;
		type = formobj.type.value;
		if (resetToDefault || NonSpace(code) == 0)
		{
			RefreshProficiencyDropDown(Proficiency);
			return;		
		}	
	}
	else 
	{
		if (formobj.code.selectedIndex > 0) 
		{
			code = FilteredQualification[formobj.code.selectedIndex-1].code;
			type = FilteredQualification[formobj.code.selectedIndex-1].type;
		}
		else
		{	
			RefreshProficiencyDropDown(Proficiency);
			return;
		}
	}
	showWaitAlert(getSeaPhrase("CM_186","CM"), function(){GetCompProficiencyLevels(type, code, -1, null, null, false, true);});
}

function GetCompProficiencyLevels(Type, Code, Index, Win, ReturnFunc, useDefault, RefreshProf)
{
	FilteredProficiency = new Array()
	RefreshProf = (RefreshProf) ? true : false;
	var obj	= new DMEObject(authUser.prodline,"PACOMPPROF");
	obj.out = "JAVASCRIPT";
	obj.index = "pcmset1";
	obj.field = "type;code;description;proficiency.type;proficiency.code;proficiency.description";
	obj.cond = "active";
	obj.max	= "600";
	obj.key = escape(authUser.company)+"="+escapeEx(" ")+"="+escape(Type)+";DF";
	obj.func = "FilterProficiencyLevels('"+escape(Code)+"',"+Index+",'"+Win+"','"+ReturnFunc+"',"+useDefault+","+RefreshProf+")";
	obj.debug = false;
	DME(obj,"HIDDEN");
}

function sortByProfDescription(obj1,obj2)
{
	var name1 = obj1.proficiency_description;
	var name2 = obj2.proficiency_description;
	if (name1 < name2)
		return -1;
	else if (name1 > name2)
		return 1;
	else
		return 0;
}

function FilterProficiencyLevels(Code, Index, Win, ReturnFunc, useDefault, RefreshProf)
{
	FilteredProficiency = FilteredProficiency.concat(self.HIDDEN.record);
	if (self.HIDDEN.Next)
		self.HIDDEN.location.replace(self.HIDDEN.Next);
	else
	{
		if (FilteredProficiency.length) // Proficiencies are based on competency type and (possibly) code.
		{
			FilteredProficiency.sort(sortByProfDescription);
			var DefaultProficiency = new Array();
			var Tmp = new Array();
			for (var i=0; i<FilteredProficiency.length; i++)
			{
				var Desc = FilteredProficiency[i].description || FilteredProficiency[i].proficiency_description;	
				if (FilteredProficiency[i].type == "DF")
					DefaultProficiency[DefaultProficiency.length] = new CodeDescObject(FilteredProficiency[i].proficiency_code,Desc,FilteredProficiency[i].proficiency_type);
				if (FilteredProficiency[i].code == Code)
					Tmp[Tmp.length] = new CodeDescObject(FilteredProficiency[i].proficiency_code,Desc,FilteredProficiency[i].proficiency_type);
			}
			FilteredProficiency = new Array();
			if (Tmp.length) // Proficiencies are based on both competency type and code.
				FilteredProficiency = Tmp;
			else if (DefaultProficiency.length) // Proficiencies are based on competency type.
				FilteredProficiency = DefaultProficiency;
			else // Proficiencies are not based on competency.
				FilteredProficiency = Proficiency
		}
		else // Proficiencies are not based on competency.
			FilteredProficiency = Proficiency
		if (Index != -1)		
			FinishCompetency_DetailScreen(Index,Win,ReturnFunc,useDefault)
	}
	if (RefreshProf)
		RefreshProficiencyDropDown(FilteredProficiency);
	else
		removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));	
}

function RefreshProficiencyDropDown(ProficiencyList)
{
	var formObj = (_CURRENTTAB == "ACTIONPLAN")?GetFormFromStansWindowLayer("main", "QualificationsDetail_MyActionPlanWindow", "qualificationform"):GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");
	var selObj = formObj.proficiency;			
	var selCode = selObj.options[selObj.selectedIndex].value;
	var selIndex = 0;
	if (!ProficiencyList)
		ProficiencyList = Proficiency;
	// already set to the defaults	
	if (ProficiencyList == Proficiency && selObj.options.length == Proficiency.length)
		return;
	selObj.innerHTML = "";
	var tmpObj = self.main.document.createElement("OPTION");
	tmpObj.value = "";
	tmpObj.text = "";
	if (navigator.appName.indexOf("Microsoft") >= 0)
		selObj.add(tmpObj);
	else
		selObj.appendChild(tmpObj);
	for (var j=0; j<ProficiencyList.length; j++) 
	{
		tmpVal = ProficiencyList[j].code;
		tmpDesc = ProficiencyList[j].description;			
		tmpObj = self.main.document.createElement("OPTION");
		tmpObj.value = tmpVal;
		tmpObj.text = tmpDesc;
		if (navigator.appName.indexOf("Microsoft") >= 0)
			selObj.add(tmpObj);
		else
			selObj.appendChild(tmpObj);
		if (selCode == tmpVal)
			selIndex = j+1;
	}
	selObj.selectedIndex = selIndex;
	self.main.styleElement(selObj);
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
}

function ReturnDate(dte)
{
	var pFormObj = getDocLoc("main").getElementsByName("qualificationform")[0];
	eval("pFormObj."+date_fld_name).value = dte;
}

function QualificationsDetail_XIconClicked()
{
	var MyQualifications = (_CURRENTTAB == "MYQUALIFICATIONS")?true:false;
	var JobProfileFlag = (_CURRENTTAB == "MYJOBPROFILE")?true:false;
	var EmployeeQualifications = (_CURRENTTAB == "EMPLOYEEQUALIFICATIONS")?true:false;
	if (MyQualifications || EmployeeQualifications)
	{
		ShowCompetencyDetail_MyQualifications(false);
		if (EmployeeQualifications)
		{
			hideLayer("main", "Instructions_EmployeeActionPlanTitle");
			ShowSelect(true, "main", "cmbDirectReports");
		}
	}
	else
		ShowQualificationsDetail_MyActionPlan(false);
}

function UpdateQualification_MyActionPlan_OnClick(/*FC*/)
{
	var Index = __ProfileIndex;
	var Type = __ProfileType;
	var FC = (arguments.length)?arguments[0]:"C";
	var pAgsObj;
	var pFormObj = (_CURRENTTAB == "ACTIONPLAN")?GetFormFromStansWindowLayer("main", "QualificationsDetail_MyActionPlanWindow", "qualificationform"):GetFormFromStansWindowLayer("main", "CompetencyDetail_MyQualificationsWindow", "qualificationform");
	var ptFields = "&WEB-UPDATE=Y";
	switch (Type)
	{
		case "Competency":
			var pObj = StandardCareerProfile.CompetencyDetail[Index]
			pAgsObj = new AGSObject(authUser.prodline, "PA21.1")
			pAgsObj.field= "FC=C"
			pAgsObj.field +="&SKI-COMPANY="+escape(authUser.company)
			if (_DIRECTREPORTSINDEX >=0 && DirectReports[_DIRECTREPORTSINDEX])
				pAgsObj.field += "&SKI-EMPLOYEE="+ParseAGSValue(DirectReports[_DIRECTREPORTSINDEX].code)
			else
				pAgsObj.field += "&SKI-EMPLOYEE="+ParseAGSValue(authUser.employee)
			pAgsObj.field += "&LINE-FC1="+FC
	    	if (typeof(pFormObj.qualification) != "undefined")
	    	{
		    	pAgsObj.field += "&PCO-SK-DESCRIPTION1="+ParseAGSValue(pFormObj.qualification.value,1)
		    	if (pFormObj.code.type == "text")
				{
					ptFields += "&PT-SKI-CODE="+ParseAGSValue(pFormObj.code.value,1)
					pAgsObj.field += "&SKI-CODE1="+ParseAGSValue(pFormObj.code.value,1)
				}
				else
				{
					ptFields += "&PT-SKI-CODE="+ParseAGSValue(pFormObj.code.options[pFormObj.code.selectedIndex].value,1)
		    		pAgsObj.field += "&SKI-CODE1="+ParseAGSValue(pFormObj.code.options[pFormObj.code.selectedIndex].value,1)
				}
			}
		    else
		    {
		    	ptFields += "&PT-SKI-SEQ-NBR="+ParseAGSValue(pFormObj.seqnbr.value)
		    	+ "&PT-SKI-CODE="+ParseAGSValue(pFormObj.code.value,1)
		    	+ "&PT-EPC-TYPE="+ParseAGSValue(pFormObj.type.value)
		     	pAgsObj.field += "&SKI-SEQ-NBR1="+ParseAGSValue(pFormObj.seqnbr.value)
		       	+ "&SKI-CODE1="+ParseAGSValue(pFormObj.code.value,1)
		       	+ "&EPC-TYPE1="+ParseAGSValue(pFormObj.type.value)
			}
			ptFields += "&PT-DATE-ACQUIRED="+ParseAGSValue(formjsDate(formatDME(pFormObj.dateacquired.value)));
			pAgsObj.field += "&SKI-PROFIC-LEVEL1="+ParseAGSValue(pFormObj.proficiency.options[pFormObj.proficiency.selectedIndex].value,1)
			if (pFormObj.skillsource.type == "text")
				pAgsObj.field += "&SKI-SKILL-SOURCE1="+ParseAGSValue(pFormObj.skillsource.value,1);
			else
				pAgsObj.field += "&SKI-SKILL-SOURCE1="+ParseAGSValue(pFormObj.skillsource.options[pFormObj.skillsource.selectedIndex].value,1);	
			pAgsObj.field += "&EPC-RENEWAL-CODE1="+ParseAGSValue(pFormObj.renewalcode.options[pFormObj.renewalcode.selectedIndex].value,1)
			+ "&SKI-INSTRUCTOR1="+ParseAGSValue(pFormObj.instructor.value,1)
			+ "&SKI-PER-RATING1="+((!isNaN(parseFloat(pFormObj.perrating.value))) ? ParseAGSValue(parseFloat(pFormObj.perrating.value)) : "0")
			+ "&SKI-DATE-ACQUIRED1="+ParseAGSValue(formjsDate(formatDME(pFormObj.dateacquired.value)))
			+ "&SKI-DATE-LST-USED1="+ParseAGSValue(formjsDate(formatDME(pFormObj.renewdate.value)))
			+ "&EPC-DATE-RETURNED1="+ParseAGSValue(formjsDate(formatDME(pFormObj.datereturned.value)))
			+ "&SKI-CO-SPONSORED1="+ParseAGSValue(pFormObj.cosponsored.options[pFormObj.cosponsored.selectedIndex].value)
			break;
		case "Certifications":
			var isMgr = false;
			var pObj = StandardCareerProfile.CertificationDetail[Index];
			pAgsObj = new AGSObject(authUser.prodline, "PA22.1")
			pAgsObj.field = "FC=C"
			+ "&CER-COMPANY="+escape(authUser.company)
			if (_DIRECTREPORTSINDEX >=0 && DirectReports[_DIRECTREPORTSINDEX])
			{
				isMgr = true;
				pAgsObj.field += "&CER-EMPLOYEE="+ParseAGSValue(DirectReports[_DIRECTREPORTSINDEX].code)
			}
			else
				pAgsObj.field += "&CER-EMPLOYEE="+ParseAGSValue(authUser.employee);
			pAgsObj.field += "&LINE-FC1="+FC
			if (typeof(pFormObj.qualification) != "undefined")
			{
				pAgsObj.field += "&PCO-DESCRIPTION="+ParseAGSValue(pFormObj.qualification.value,1)
				if (pFormObj.code.type == "text")
				{
					ptFields += "&PT-CER-CODE="+ParseAGSValue(pFormObj.code.value,1)
					pAgsObj.field += "&CER-CODE1="+ParseAGSValue(pFormObj.code.value,1)
				}
				else
				{
					ptFields += "&PT-CER-CODE="+ParseAGSValue(pFormObj.code.options[pFormObj.code.selectedIndex].value,1)
					pAgsObj.field += "&CER-CODE1="+ParseAGSValue(pFormObj.code.options[pFormObj.code.selectedIndex].value,1)
				}
			}
			else
			{
	     		ptFields += "&PT-CER-SEQ-NBR="+ParseAGSValue(pFormObj.seqnbr.value,1)
	     		+ "&PT-CER-CODE="+ParseAGSValue(pFormObj.code.value,1)
				pAgsObj.field += "&CER-SEQ-NBR1="+ParseAGSValue(pFormObj.seqnbr.value,1)
				+ "&CER-CODE1="+ParseAGSValue(pFormObj.code.value,1)
			}
			ptFields += "&PT-CER-DATE-ACQUIRED="+ParseAGSValue(formjsDate(formatDME(pFormObj.dateacquired.value)));
			pAgsObj.field += "&EPC-STATE1="+ParseAGSValue(pFormObj.state.options[pFormObj.state.selectedIndex].value,1)
			+ "&CER-LIC-NUMBER1="+ParseAGSValue(pFormObj.licnumber.value,1)
			+ "&CER-DATE-ACQUIRED1="+ParseAGSValue(formjsDate(formatDME(pFormObj.dateacquired.value)))
			+ "&CER-RENEW-DATE1="+ParseAGSValue(formjsDate(formatDME(pFormObj.renewdate.value)))
			+ "&CER-RENEWAL-CODE1="+ParseAGSValue(pFormObj.renewalcode.options[pFormObj.renewalcode.selectedIndex].value,1)
			if (pFormObj.skillsource.type == "text")
				pAgsObj.field += "&EPC-SKILL-SOURCE1="+ParseAGSValue(pFormObj.skillsource.value,1);
			else
				pAgsObj.field += "&EPC-SKILL-SOURCE1="+ParseAGSValue(pFormObj.skillsource.options[pFormObj.skillsource.selectedIndex].value,1);	
			pAgsObj.field += "&CER-CO-SPONSORED1="+ParseAGSValue(pFormObj.cosponsored.options[pFormObj.cosponsored.selectedIndex].value)
			+ "&CER-COST1="+ParseAGSValue(pFormObj.cost.value,1)
			+ "&CER-BASE-AMOUNT1=0"
			if (pFormObj.currencycode.type == "text")
				pAgsObj.field += "&CER-CURRENCY-CODE1="+ParseAGSValue(pFormObj.currencycode.value,1);
			else
				pAgsObj.field += "&CER-CURRENCY-CODE1="+ParseAGSValue(pFormObj.currencycode.options[pFormObj.currencycode.selectedIndex].value,1);
			if (FC != "D" && !isMgr)
				pAgsObj.field += "&EPC-VERIFIED-FLAG1=N";
			break;
		case "Education":
			var pObj = StandardCareerProfile.EducationDetail[Index];
			pAgsObj = new AGSObject(authUser.prodline, "PA20.1")
			pAgsObj.field = "FC=C"
			+ "&EDU-COMPANY="+escape(authUser.company)
			if (_DIRECTREPORTSINDEX >=0 && DirectReports[_DIRECTREPORTSINDEX])
				pAgsObj.field += "&EDU-EMPLOYEE="+ParseAGSValue(DirectReports[_DIRECTREPORTSINDEX].code)
			else
				pAgsObj.field += "&EDU-EMPLOYEE="+ParseAGSValue(authUser.employee)
			pAgsObj.field += "&LINE-FC1="+FC
			if (FC=="C" || FC=="D")
				pAgsObj.field += "&EDU-SEQ-NBR1="+ParseAGSValue(pFormObj.seqnbr.value)
			if (typeof(pFormObj.degree) != "undefined")
			{
				if (pFormObj.degree.type == "text")
				{
					ptFields += "&PT-EDU-ED-DEGREE="+ParseAGSValue(pFormObj.degree.value,1)
					pAgsObj.field += "&EDU-ED-DEGREE1="+ParseAGSValue(pFormObj.degree.value,1)
				}
				else
				{
					ptFields += "&PT-EDU-ED-DEGREE="+ParseAGSValue(pFormObj.degree.options[pFormObj.degree.selectedIndex].value,1)
					pAgsObj.field += "&EDU-ED-DEGREE1="+ParseAGSValue(pFormObj.degree.options[pFormObj.degree.selectedIndex].value,1)
				}
			}
			else
			{
				ptFields += "&PT-EDU-ED-DEGREE="+ParseAGSValue(pFormObj.code.value,1)			
				pAgsObj.field += "&EDU-ED-DEGREE1="+ParseAGSValue(pFormObj.code.value,1)			
			}
			if (pFormObj.subject.type == "text")
				pAgsObj.field += "&EDU-ED-SUBJECT1="+ParseAGSValue(pFormObj.subject.value,1);
			else
				pAgsObj.field += "&EDU-ED-SUBJECT1="+ParseAGSValue(pFormObj.subject.options[pFormObj.subject.selectedIndex].value,1);
			if (FC == "C" || FC == "A")
			{
				if (pFormObj.instructor.type == "text")
					pAgsObj.field += "&EDU-ED-INSTIT1="+ParseAGSValue(pFormObj.instructor.value,1);
				else
					pAgsObj.field += "&EDU-ED-INSTIT1="+ParseAGSValue(pFormObj.instructor.options[pFormObj.instructor.selectedIndex].value,1);
				ptFields += "&PT-EDU-COM-DATE="+ParseAGSValue(formjsDate(formatDME(pFormObj.renewaldate.value)))
				pAgsObj.field += "&EDU-COM-DATE1="+ParseAGSValue(formjsDate(formatDME(pFormObj.renewaldate.value)))
				+ "&EDU-PER-RATING1="+ParseAGSValue(pFormObj.perrating.value,1)
				+ "&EDU-IN-PRO-FLAG1="+ParseAGSValue(pFormObj.inproflag.options[pFormObj.inproflag.selectedIndex].value)
				+ "&EDU-CO-SPONSORED1="+ParseAGSValue(pFormObj.cosponsored.options[pFormObj.cosponsored.selectedIndex].value)
			}
			if (FC == "C" || FC == "D")
			{
				if (pFormObj.subject.type == "text")
					pAgsObj.field += "&EDU-SV-SUBJECT1="+ParseAGSValue(pFormObj.subject.value,1);
				else
					pAgsObj.field += "&EDU-SV-SUBJECT1="+ParseAGSValue(pFormObj.subject.options[pFormObj.subject.selectedIndex].value,1);
			}
			break;
	}
	if (FC != "A")
		pAgsObj.field += ptFields;
	pAgsObj.event = "CHG";
	pAgsObj.rtn = "MESSAGE";
	pAgsObj.longNames = "ALL";
	pAgsObj.tds = false;
	pAgsObj.func = "parent.updatequalifications_Finished('"+FC+"')";
	pAgsObj.out = "JAVASCRIPT";
	pAgsObj.debug = false;
	showWaitAlert(getSeaPhrase("CM_266","CM"), function(){AGS(pAgsObj,"jsreturn");});
}

var FunctionCode;

function updatequalifications_Finished(FC)
{
	FunctionCode = FC;
	if (self.lawheader.gmsgnbr == "000")
	{
		StandardCareerProfile = new CareerProfileObject();
		self.lawheader.DetailLine = 0;
		if (_DIRECTREPORTSINDEX >= 0 && DirectReports[_DIRECTREPORTSINDEX])
		{
			// delete the cached HS50 objects because they could contain outdated qualification data
			var empNbr = DirectReports[_DIRECTREPORTSINDEX].code;
			deleteHashItem(StandardCareerProfileHash, Number(empNbr));
			deleteHashItem(JobProfileCareerProfileHash, Number(empNbr));
			Do_HS50_Call(3, 1, "Y", null, "HS50.1", "CHANGE", empNbr);
		}
		else
			Do_HS50_Call(2, 1, "Y", null, "HS50.1", "CHANGE", authUser.employee);
	}
	else
	{
		removeWaitAlert();
		seaAlert(self.lawheader.gmsg, null, null, "error");
	}
}

function Do_HS50_1_Call_CHANGE_Finished()
{
	if (_CURRENTTAB == "ACTIONPLAN")
	{
		StandardCareerProfile = CareerProfile;
		HS50_RePaintQualificationsAlert();
	}
	else
	{
		StandardCareerProfile = CareerProfile;
		RepaintMyQualifications(FunctionCode);
	}
}

/*
 *	Explore Careers Tab
 */
var _EXPLORECURRENTWIN = "EXPLOREJOBTITLE";
var _EXPLOREPROFILETABSELECTED = 0;
var _REFRESHPROFILE = false;
var _REFRESHJOBLIST = false;
var _CURRENTPROFILEDESC = getSeaPhrase("CM_128","CM");
var _CURRENTJOBLISTDESC = getSeaPhrase("CM_130","CM");
var _JOBLISTDESC = "";
var _JOBCODEINDEX = -1;
var _JOBCATEGORYINDEX = -1;
var _JOBLISTINDEX = -1;
var CategoryList = new Array();

function QualificationCriteriaSelectObject()
{
	this.QualLabels = new Array("","","","","","");
	this.QualDescs = new Array("","","","","","");
	this.QualTypes = new Array("","","","","","");
	this.QualCodes = new Array("","","","","","");
}

var QualCriteria_ExploreCareers = new QualificationCriteriaSelectObject();

function ClearForm_ExploreCareers_OnClick()
{
	var nextFunc = function()
	{
		for (var i=1; i<=QualCriteria_ExploreCareers.QualLabels.length; i++)
		{
			var QualBox = GetTextBoxFormObject("main", "QualCriteria"+i, "qualcriteria"+i);
			QualBox.value = "";
			replaceContent("main", "QualCriteriaLabel"+i, "");
		}
		QualCriteria_ExploreCareers = new QualificationCriteriaSelectObject();
		removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
	};
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

function JobTitleFilterSelectArrow_OnClick()
{
	openDmeFieldFilter("job_title");
}

function CategoryFilterSelectArrow_OnClick()
{
	openDmeFieldFilter("job_category");
}

//////////////////////////////////////////////////////////////////////////////////////////
//								MAIN DRAWING TASKS										//
//////////////////////////////////////////////////////////////////////////////////////////

function DrawExploreCareersWindowsTabs(rpFlag, TabSelected, isVisible)
{
	var TabsArray = new Array(
		new TabPane("JobTitle", getSeaPhrase("CM_23","CM"), 90),
		new TabPane("Category", getSeaPhrase("CM_171","CM"), 90),
		new TabPane("QualificationCriteria", getSeaPhrase("CM_172","CM"), 170)
	);
	var Tab = new TabObject(TabsArray, TabSelected, "ExploreCareers");
	Tab.Style(InnerTabBorderColor, InnerTabbgColorTabDown, InnerTabbgColorTabUp, InnerTabfgColorTabDown, InnerTabfgColorTabUp, InnerTabfontSize, InnerTabfontFamily, InnerTabfontWeight);
	var pObj = new CareerManagementWindowObject(Window2,"main", "ExploreCareers", 402,22,392,490, isVisible, getSeaPhrase("CM_158","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.TabObject = Tab;
	if (rpFlag) pObj.ReplaceFlag = true;
	pObj.DrawTabbed();
}

function DrawQualCriteriaTypeListWindow(isVisible)
{
	pObj = new CareerManagementWindowObject(Window5,"main", "QualCriteriaTypeList", 455,100,288,120, isVisible, getSeaPhrase("CM_173","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.AddCloseIcon = true;
	pObj.CloseIconLocationLeft = pObj.Left + 262;
	pObj.CloseIconLocationTop = pObj.Top + 6;
	pObj.Draw();
	pObj.DrawView(470, 130, 245, 70);
}

function DrawQualCriteriaCodeListWindow(isVisible)
{
	pObj = new CareerManagementWindowObject(Window3,"main", "QualCriteriaCodeList", 402,71,392,442, isVisible, getSeaPhrase("CM_174","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.AddCloseIcon = true;
	pObj.CloseIconLocationLeft = pObj.Left + 350;
	pObj.CloseIconLocationTop = pObj.Top + 4;
	pObj.Draw();
	pObj.DrawView(425, 105, 357, 343);
	if (emssObjInstance.emssObj.filterSelect)
	{
		var filterList = document.getElementById("filterList");
		setHorizontalPos(filterList, "412px");	
		filterList.style.top = "132px";	
		filterList.style.width = "380px";
		filterList.style.height = "370px";		
	}
}

function DrawJobListWindow_ExploreCareers(isVisible, SelectValues)
{
	pObj = new CareerManagementWindowObject(Window3,"main", "JobList", 402,71,392,442, isVisible, _CURRENTJOBLISTDESC);
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.AddCloseIcon = true;
	pObj.CloseIconLocationLeft = pObj.Left + 350;
	pObj.CloseIconLocationTop = pObj.Top + 4;
	pObj.Draw();
	pObj.DrawView(420, 105, 355, 355);
	if (_CURRENTTAB == "M_EXPLORECAREERS" && _EXPLORECURRENTWIN == "EXPLORECATEGORY")
		Desc = '<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td><span class="contenttextCM">'+getSeaPhrase("CM_175","CM")+'</span><p/></td></tr></table>';
	else if (_CURRENTTAB == "M_EXPLORECAREERS")
		Desc = '<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td><span class="contenttextCM">'+getSeaPhrase("CM_176","CM")+'</span><p/></td></tr></table>';
	else
		Desc = '<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td><span class="contenttextCM">'+getSeaPhrase("CM_177","CM")+'</span><p/></td></tr></table>';
	createLayer("main","InstructionsHeader_JobList",410,200,380,50,isVisible,Desc,"","");
	var toolTip;
	if (_CURRENTTAB == "M_EXPLORECAREERS" && _EXPLORECURRENTWIN == "EXPLORECATEGORY")
	{
		if (emssObjInstance.emssObj.filterSelect)
		{
			Desc = '<label class="contenttextCM" for="JobTitleFilterSelect_ExploreCareers">'+getSeaPhrase("CM_178","CM")+'</span>'
			createLayer("main","JobList_JobLabel",475,270,300,50,isVisible,Desc,"","");			
			toolTip = dmeFieldToolTip("job_title");
			MakeTextBox("JobTitleFilterSelect", 475, 290, 105, 25, "JobTitleFilterSelect_ExploreCareers", isVisible, 30, "", 'styler="select" styler_click="parent.JobTitleFilterSelectArrow_OnClick"');
			MakeButton('<img style="cursor:hand;cursor:pointer" border="0" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" alt="'+toolTip+'" title="'+toolTip+'">', 570, 290, 12, 16,
				WindowColor, "JobTitleFilterSelectArrow", isVisible, getSeaPhrase("CM_185","CM"), true, 'styler="hidden"');	
			var buttonObj = getLayerDocument("main", "JobTitleFilterSelectArrowButton");	
			if (buttonObj != null)
				buttonObj.setAttribute("styler", "hidden");
			Desc = '<span id="JobTitleFilterSelectDesc" class="contenttextdisplayCM"></span>'
			createLayer("main","JobTitleFilterSelectDesc_ExploreCareers",587,290,150,30,isVisible,Desc,"","");	
		}
		else
		{		
			Desc = '<label class="contenttextCM" for="jobtitleselect">'+getSeaPhrase("CM_178","CM")+'</span>'
			createLayer("main","JobList_JobLabel",475,270,300,50,isVisible,Desc,"","");			
			MakeSelectBox("JobTitleSelect", 475, 290, 300, 50, "jobtitleselect", CategoryList, isVisible, _JOBLISTINDEX, true);
		}
		Desc = '<span class="contenttextCM">'+getSeaPhrase("CM_179","CM")+'</span>'
		createLayer("main","JobList_DirectReportsLabel",475,320,300,50,isVisible,Desc,"","");
		MakeSelectBox("DirectReports", 475, 340, 300, 50, "cmbDirectReports", SelectValues, isVisible, _DIRECTREPORTSINDEX, true)
		MakeButton(getSeaPhrase("CM_117","CM"), 475, 372, "auto", 30, ButtonBorderColor, "createprofile_ManagerExploreCareers", isVisible);
	}
	if (emssObjInstance.emssObj.filterSelect)
	{
		var filterList = document.getElementById("filterList");
		setHorizontalPos(filterList, "412px");
		filterList.style.top = "132px";	
		filterList.style.width = "380px";
		filterList.style.height = "370px";
	}	
}

function ReDrawQualCriteriaJobListContent(Index1, Index2)
{
	var Msg = '<p><table style="width:350px" border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td>';
	var noJobs = false;
	if (QualificationJobList.jobEssential == 0 || QualificationJobList.jobEssential == null)
	{
		Msg += '<span class="contenttextCM">'+getSeaPhrase("CM_180","CM")+'</span>';
		noJobs = true;
	}
	else if (QualificationJobList.jobEssential == 1)
		Msg += '<span class="contenttextCM">'+getSeaPhrase("CM_181","CM")+'</span>';
	else if (QualificationJobList.jobEssential == 2)
		Msg += '<span class="contenttextCM">'+getSeaPhrase("CM_182","CM")+'</span>';
	Msg += '</td></tr></table>';
	// display job list window for selected job category
	if (_CURRENTTAB == "M_EXPLORECAREERS")
		var CatDesc = (DirectReports[_DIRECTREPORTSINDEX])?' - '+DirectReports[_DIRECTREPORTSINDEX].description:'';
	else
		var CatDesc = '';
	_CURRENTJOBLISTDESC = getSeaPhrase("CM_130","CM") + CatDesc
	Desc = '<span class="layertitleCM">'+ _CURRENTJOBLISTDESC+'</span>';
	ChangeTitle("main", "JobList", Desc);
	Desc = Msg;
	if (!noJobs)
	{
		Desc += '<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td>'
		Desc += '<span class="contenttextCM">'+getSeaPhrase("CM_183","CM")+'</span></td></tr></table>';
	}
	replaceContent("main","InstructionsHeader_JobList","");
	Desc += '<p><table border="0" cellpadding="0" cellspacing="0" role="presentation">'
	for (var i=0; i<QualificationJobList.Detail.length; i++)
	{
		for (var j=0; j<QualificationJobList.Detail[i].JobDescs.length; j++)
		{
			var toolTip = QualificationJobList.Detail[i].JobDescs[j].description+' - '+getSeaPhrase("CM_397","CM");
			Desc += '<tr><td'
			if (typeof(Index1) != "undefined" && Index1 != null && Index1 == i && typeof(Index2) != "undefined" && Index2 != null && Index2 == j)
				Desc += ' class="tablerowhighlightCM"'
			Desc += ' nowrap><a class="contenttextCM" href="javascript:;" onclick="parent.ReDrawQualCriteriaJobListContent('+i+','+j+');'
			Desc += 'parent.JobCodeSelected(\'Qualification\','+i+','+j+');return false;" title="'+toolTip+'">'+QualificationJobList.Detail[i].JobDescs[j].description+'<span class="offscreen"> - '+getSeaPhrase("CM_397","CM")+'</span></a></td></tr>'
		}
	}
	Desc += '</table>'
	ReplaceWindowContent("main","JobListWindow",Desc);
}

function ReDrawCategoryJobListContent()
{
	Desc = '<span class="layertitleCM">' + _CURRENTJOBLISTDESC + "</span>";
	ChangeTitle("main", "JobList", Desc);
	replaceContent("main","InstructionsHeader_JobList","");
	RepaintCategoryJobListLinks(_JOBCATEGORYINDEX);
}

function RepaintCategoryJobListLinks(CatIndex, LinkIndex)
{
	if (emssObjInstance.emssObj.filterSelect)
	{				
		openDmeListFieldFilter('filterList', "jobs_by_category", false);
		ShowFilterList(true);
	}
	else
	{
		var Desc = '<span class="contenttextCM">'+getSeaPhrase("CM_184","CM")+'</span><p>'
		Desc += '<table border="0" cellpadding="0" cellspacing="0" role="presentation">'
		for (var i=0; i<JobClass[CatIndex].Rel_jobcodes.length; i++)
		{
			var toolTip = JobClass[CatIndex].Rel_jobcodes[i].description+' - '+getSeaPhrase("CM_397","CM");
			Desc += '<tr><td'
			if (typeof(LinkIndex) != "undefined" && LinkIndex != null && LinkIndex == i)
				Desc += ' class="tablerowhighlightCM"'
			Desc += ' nowrap><a class="contenttextCM" href="javascript:;" onclick="parent.RepaintCategoryJobListLinks('+CatIndex+','+i+');'
			Desc += 'parent.JobCodeSelected(\'Category\','+CatIndex+','+i+');return false;" title="'+toolTip+'">'+JobClass[CatIndex].Rel_jobcodes[i].description+'<span class="offscreen"> - '+getSeaPhrase("CM_397","CM")+'</span></a></td></tr>'
		}
		Desc += '</table>'
		ReplaceWindowContent("main","JobListWindow",Desc);
	}
}

function DrawQualificationSelectBoxes(Name, QualData, Visible, Top)
{
	if (!Top || isNaN(parseFloat(Top))) Top = 235;
	var DescList = new Array();
	Desc = '<table style="width:300px" border="0" cellpadding="0" cellspacing="0" role="presentation">'
	+ '<tr><td style="text-align:center" class="contentlabelCM">'+getSeaPhrase("CM_50","CM")+'</td>'
	+ '<td style="text-align:center" class="contentlabelCM">'+getSeaPhrase("CM_46","CM")+'</td>'
	+ '</tr></table>';
	createLayer("main",Name+"Header",415,(Top+10),300,25,Visible,Desc,"","");
	var ArrowLeft = 715;
	var TextBoxSize = (navigator.appName.indexOf("Microsoft")>=0) ? 33:35;
	var toolTip;
	for (var j=1; j<=QualData.QualLabels.length; j++)
	{
		Desc = '<label class="contenttextCM" for="'+(Name.toLowerCase()+j)+'">'+QualData.QualLabels[j-1]+'</label>'
		createLayer("main",Name+"Label"+j,415,(Top+5)+(j*30),100,25,Visible,Desc,"","");
		toolTip = dmeFieldToolTip(Name+j);
		MakeTextBox((Name+j), 510, Top+(j*30), 215, 25, (Name.toLowerCase()+j), Visible, TextBoxSize, QualData.QualDescs[j-1], 'styler="select" styler_click="parent.'+Name+'Arrow'+j+'_OnClick"');
		MakeButton('<img style="cursor:hand;cursor:pointer" border="0" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" alt="'+toolTip+'" title="'+toolTip+'">', ArrowLeft, Top+(j*30), 12, 16,
			WindowColor, Name+"Arrow"+j, Visible, getSeaPhrase("CM_185","CM"), true, 'styler="hidden"');
		var buttonObj = getLayerDocument("main", Name+"Arrow"+j+"Button");	
		if (buttonObj != null)
			buttonObj.setAttribute("styler", "hidden");
	}
}

function ShowExploreCareers(nCmd, ShowForTabIndex, TabOnly)
{
	if (typeof(TabOnly) == "undefined")
		TabOnly = false;
	if (typeof(ShowForTabIndex) == "undefined")
		ShowForTabIndex = false;
	if (!TabOnly)
	{
		ShowWin(nCmd, "main", "ExploreCareers", true, false, true);
		if (_CURRENTTAB == "M_EXPLORECAREERS")
			ShowWin(nCmd, "main", "Instructions_ManagerExploreCareers");
		else
			ShowWin(nCmd, "main", "Instructions_EmployeeExploreCareers");
	}
	if (!ShowForTabIndex)
	{
		switch (_EXPLORECURRENTWIN)
		{
			case "EXPLOREJOBTITLE": ShowForTabIndex = "JobTitle";break;
			case "EXPLORECATEGORY": ShowForTabIndex = "Category";break;
			case "EXPLOREQUALCRITERIA": ShowForTabIndex = "QualCriteria";break;
		}
	}
	if (emssObjInstance.emssObj.filterSelect)
		ShowFilterList(false);
	switch (ShowForTabIndex)
	{
		case "JobTitle":
			ShowJobTitleInstructions_ExploreCareers(nCmd);
			ShowJobTitleSelect_ExploreCareers(nCmd);
			if (_CURRENTTAB == "M_EXPLORECAREERS")
			{
				ShowJobTitleLabel_ExploreCareers(nCmd);
				ShowDirectReportsLabel_ExploreCareers(nCmd,"JobTitle");
				ShowSelect(nCmd, "main", "cmbDirectReports");
				ShowButton(nCmd, "main", "createprofile_ManagerExploreCareers");
			}
			else
				ShowButton(nCmd, "main", "createprofile_EmployeeExploreCareers");
			break;
		case "Category":
			if (nCmd)
				showLayer("main","Category_Instructions");
			else
			{
				hideLayer("main","Category_Instructions");
				ShowJobList_ExploreCareers(nCmd);
			}
			ShowCategorySelect_ExploreCareers(nCmd);
			if (_CURRENTTAB == "M_EXPLORECAREERS")
				ShowButton(nCmd, "main", "createjoblist_ManagerExploreCareers");
			else
				ShowButton(nCmd, "main", "createjoblist_EmployeeExploreCareers");
			break;
		case "QualCriteria":
			if (!nCmd)
				ShowJobList_ExploreCareers(nCmd);
			ShowButton(nCmd, "main", "ClearForm_ExploreCareers");
			if (_CURRENTTAB == "M_EXPLORECAREERS")
			{
				ShowQualCriteriaWin_ExploreCareers(nCmd, "QualCriteria", "qualcriteria_createjoblist_ManagerExploreCareers");
				ShowDirectReportsLabel_ExploreCareers(nCmd,"QualCriteria");
				ShowSelect(nCmd, "main", "cmbDirectReports");
			}
			else
				ShowQualCriteriaWin_ExploreCareers(nCmd, "QualCriteria", "qualcriteria_createjoblist_EmployeeExploreCareers");
			break;
	}
}

function OnTabClicked_ExploreCareers(TabName)
{
	_REFRESHPROFILE = false;
	_REFRESHJOBLIST = false;
	QualCriteria_ExploreCareers = new QualificationCriteriaSelectObject();
	switch (_EXPLORECURRENTWIN)
	{
		case "EXPLOREJOBTITLE":
			if (!emssObjInstance.emssObj.filterSelect)
				_JOBCODEINDEX = GetSelectFormObject("main", "JobTitleSelect", "jobtitleselect").selectedIndex-1;
			break;
		case "EXPLORECATEGORY":
			if (!emssObjInstance.emssObj.filterSelect)
			{
				_JOBCATEGORYINDEX = GetSelectFormObject("main", "CategorySelect", "categoryselect").selectedIndex-1;
				if (_CURRENTTAB == "M_EXPLORECAREEERS")
					_JOBLISTINDEX = GetSelectFormObject("main", "JobTitleSelect", "jobtitleselect").selectedIndex-1;
			}
			// Set this if you'd like the Job List window to remain visible when the user clicks on a tab.
			//if (TabName == "Category" && isVisible("main", "JobListLayer")) _REFRESHJOBLIST = true;
			break;
		case "EXPLOREQUALCRITERIA":
			// Set this if you'd like the Job List window to remain visible when the user clicks on a tab.
			//if (TabName == "QualificationCriteria" && isVisible("main", "JobListLayer")) _REFRESHJOBLIST = true;
			break;
	}
	switch (TabName)
	{
		case "JobTitle":
			_TABSELECTED = 0;
			_EXPLORECURRENTWIN = "EXPLOREJOBTITLE";
			break;
		case "Category":
			_TABSELECTED = 1;
		    _EXPLORECURRENTWIN = "EXPLORECATEGORY";
			break;
		case "QualificationCriteria":
			_TABSELECTED = 2;
			_EXPLORECURRENTWIN = "EXPLOREQUALCRITERIA";
			break;
	}
	if (emssObjInstance.emssObj.filterSelect)
	{
		ShowFilterList(false);
		closeDmeFieldFilter();
	}
	if (_CURRENTTAB == "M_EXPLORECAREERS")
		OpenProgram(3,_TABSELECTED,_EXPLOREPROFILETABSELECTED)
	else
		OpenProgram(4,_TABSELECTED,_EXPLOREPROFILETABSELECTED)
}

function ShowJobProfileWin(nCmd, FrameLocation)
{
	if (nCmd)
	{
		 var Desc = '<span class="layertitleCM">' + _CURRENTPROFILEDESC + '</span>';
		 ChangeTitle("main", "JobProfile_MyJobProfile", Desc);	 
		 PaintJobProfileInformation(_EXPLOREPROFILETABSELECTED,true);	 
		 ShowJobProfile_MyJobProfile(true);
		 //ShowPrintProfileButton_MyJobProfile(true);	 
		 ShowAdditionalJobDetailLink_MyJobProfile(true);
		 ShowJobDescriptionLink_MyJobProfile(true);
	}
	else
	{
		 ShowAdditionalJobDetailLink_MyJobProfile(false);
		 ShowJobDescriptionLink_MyJobProfile(false);
		 //ShowPrintProfileButton_MyJobProfile(false);
		 ShowJobProfile_MyJobProfile(false);
	}
}

function JobList_XIconClicked()
{
	if (emssObjInstance.emssObj.filterSelect)
		ShowFilterList(false);
	ShowJobList_ExploreCareers(false);
	ShowJobProfileWin(false, "main");
	ShowExploreCareers(true)
}

function QualCriteriaArrow1_OnClick()
{
	if (_CURRENTTAB == "M_EXPLORECAREERS")
		QualCriteriaArrowClicked(1,"QualCriteria","qualcriteria_createjoblist_ManagerExploreCareers");
	else
		QualCriteriaArrowClicked(1,"QualCriteria","qualcriteria_createjoblist_EmployeeExploreCareers");
}

function QualCriteriaArrow2_OnClick()
{
	if (_CURRENTTAB == "M_EXPLORECAREERS")
		QualCriteriaArrowClicked(2,"QualCriteria","qualcriteria_createjoblist_ManagerExploreCareers");
	else
		QualCriteriaArrowClicked(2,"QualCriteria","qualcriteria_createjoblist_EmployeeExploreCareers");
}

function QualCriteriaArrow3_OnClick()
{
	if (_CURRENTTAB == "M_EXPLORECAREERS")
		QualCriteriaArrowClicked(3,"QualCriteria","qualcriteria_createjoblist_ManagerExploreCareers");
	else
		QualCriteriaArrowClicked(3,"QualCriteria","qualcriteria_createjoblist_EmployeeExploreCareers");
}

function QualCriteriaArrow4_OnClick()
{
	if (_CURRENTTAB == "M_EXPLORECAREERS")
		QualCriteriaArrowClicked(4,"QualCriteria","qualcriteria_createjoblist_ManagerExploreCareers");
	else
		QualCriteriaArrowClicked(4,"QualCriteria","qualcriteria_createjoblist_EmployeeExploreCareers");
}

function QualCriteriaArrow5_OnClick()
{
	if (_CURRENTTAB == "M_EXPLORECAREERS")
		QualCriteriaArrowClicked(5,"QualCriteria","qualcriteria_createjoblist_ManagerExploreCareers");
	else
		QualCriteriaArrowClicked(5,"QualCriteria","qualcriteria_createjoblist_EmployeeExploreCareers");
}

function QualCriteriaArrow6_OnClick()
{
	if (_CURRENTTAB == "M_EXPLORECAREERS")
		QualCriteriaArrowClicked(6,"QualCriteria","qualcriteria_createjoblist_ManagerExploreCareers");
	else
		QualCriteriaArrowClicked(6,"QualCriteria","qualcriteria_createjoblist_EmployeeExploreCareers");
}

function QualCriteriaArrowClicked(BoxNbr, Name, Button)
{
	var nextFunc = function()
	{
		var SelectValues = new Array(getSeaPhrase("CM_47","CM"),getSeaPhrase("CM_48","CM"),getSeaPhrase("CM_49","CM"));
		// display qualification types for selection
		Desc = '<span class="layertitleCM">'+getSeaPhrase("CM_173","CM")+'</span>';
		ChangeTitle("main", Name+"TypeList", Desc);
		Desc = '<p/><p/><table border="0" cellpadding="0" cellspacing="0" role="presentation">'
		for (var i=0; i<SelectValues.length; i++)
		{
			var toolTip = SelectValues[i]+' - '+getSeaPhrase("CM_398","CM");
			Desc += '<tr><td nowrap><a class="contenttextCM" href="javascript:;" onclick="parent.PickedQualificationType(\''
			Desc += escape(SelectValues[i],1)+'\',\''+BoxNbr+'\',\''+escape(Name,1)+'\',\''+escape(Button,1)+'\');return false;"'
			Desc += ' title="'+toolTip+'">'+SelectValues[i]+'<span class="offscreen"> - '+getSeaPhrase("CM_398","CM")+'</span></a></td></tr>'
		}
		Desc += '</table>';
		ReplaceWindowContent("main",Name+"TypeListWindow",Desc);
		if (_CURRENTTAB == "M_EXPLORECAREERS")
		{
			hideLayer("main", Name+"_Instructions1");
			hideLayer("main", Name+"_Instructions2");
			ShowDirectReportsLabel_ExploreCareers(false,"QualCriteria");
			ShowDirectReports_ExploreCareers(false);
		}
		else
			hideLayer("main", Name+"_Instructions");
		ShowWin(false, "main", Name+"CodeList", true, true);
		ShowWin(true, "main", Name+"TypeList", true, true);
		if (_CURRENTTAB.indexOf("EXPLORECAREERS") != -1)
			ShowJobProfileWin(false, "main");
		removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
		if (typeof(self.main["StylerEMSS"]) != "undefined" && typeof(self.main.StylerEMSS["selectControlOnLoad"]) == "function")
		{
			var QualBox = GetTextBoxFormObject("main", Name+''+BoxNbr, Name.toLowerCase()+''+BoxNbr);
			self.main.StylerEMSS.selectControlOnLoad(self.main, QualBox);
		}
	};
	showWaitAlert(getSeaPhrase("CM_186","CM"), nextFunc);
}

function SelectedQualificationCodeData(BoxNbr, Name, Button)
{
	this.BoxNbr = (typeof(BoxNbr) != "undefined") ? BoxNbr : null;
	this.Name = (typeof(Name) != "undefined") ? Name : null;
	this.Button = (typeof(Button) != "undefined") ? Button : null;
}

var userSelectedQualificationCriteria = new SelectedQualificationCodeData();

function PickedQualificationType(QualType, BoxNbr, Name, Button)
{
	var QualificationCodes = new Array();
	QualType = unescape(QualType);
	switch (QualType)
	{
		case getSeaPhrase("CM_47","CM"):
			QualificationCodes = Certifications; break;
		case getSeaPhrase("CM_49","CM"):
			QualificationCodes = Degree; break;
		case getSeaPhrase("CM_48","CM"):
			QualificationCodes = Competency; break;
	}
	// display pcodes window for ee's selected qualification type
	Desc = '<span class="layertitleCM">'+getSeaPhrase("CM_187","CM")+" - "+QualType+"</span>";
	ChangeTitle("main", Name+"CodeList", Desc);
	Desc = '<p/><table border="0" cellpadding="0" cellspacing="0" role="presentation">'
	for (var i=0; i<QualificationCodes.length; i++)
	{
		var toolTip = QualificationCodes[i].description+' - '+getSeaPhrase("SELECT_VALUE_FOR","SEA");
		Desc += '<tr><td nowrap><a class="contenttextCM" href="javascript:;" onclick="parent.PickedQualificationCode(\''
		+ escape(QualificationCodes[i].type,1)+'\',\''+escape(QualificationCodes[i].code,1)
		+ '\',\''+escape(QualificationCodes[i].description,1)+'\','+BoxNbr+',\''+Name+'\',\''+Button+'\');return false;" title="'+toolTip+'">'+QualificationCodes[i].description+'<span class="offscreen"> - '+getSeaPhrase("SELECT_VALUE_FOR","SEA")+'</span></a></td></tr>'
	}
	Desc += '</table>'
	ReplaceWindowContent("main",Name+"CodeListWindow",Desc);
	if (_CURRENTTAB.indexOf("EXPLORECAREERS")!=-1)
	{
		ShowQualCriteriaWin_ExploreCareers(false, unescape(Name), unescape(Button));
		if (_CURRENTTAB == "M_EXPLORECAREERS")
			ShowButton(false, "main", "qualcriteria_createjoblist_ManagerExploreCareers");
		else
			ShowButton(false, "main", "qualcriteria_createjoblist_EmployeeExploreCareers");
		ShowButton(false, "main", "ClearForm_ExploreCareers");
	}
	if (_CURRENTTAB.indexOf("TRAININGOPTIONS")!=-1)
	{
		ShowQualCriteriaWin_TrainingOptions(false, unescape(Name), unescape(Button));
		hideLayer("main", "Instructions_TrainingOptionsTitle");
		ShowButton(false, "main", "ClearForm_TrainingOptions");
		ShowButton(false, "main", "CreateCourseList_TrainingOptions2");		
	}
	ShowWin(true, "main", Name+"CodeList", true, true);
	if (emssObjInstance.emssObj.filterSelect)
	{
		userSelectedQualificationCriteria = new SelectedQualificationCodeData(BoxNbr, Name, Button);
		var dmeField = "";
		switch (QualType)
		{
			case getSeaPhrase("CM_47","CM"):
				dmeField = "certification_list"; break;
			case getSeaPhrase("CM_49","CM"):
				dmeField = "degree_list"; break;
			case getSeaPhrase("CM_48","CM"):
				dmeField = "competency_list"; break;
			default: dmeField = "competency";
		}
		openDmeListFieldFilter('filterList', dmeField, false);
		ShowFilterList(true);
	}
}

function PickedQualificationCode(QualType, QualCode, QualDesc, BoxNbr, Name, Button)
{
	QualType = unescape(QualType);
	QualCode = unescape(QualCode);
	QualDesc = unescape(QualDesc);
	Name = unescape(Name);
	Button = unescape(Button);
	var ExploreCareers = (_CURRENTTAB.indexOf("EXPLORECAREERS")!=-1)?true:false;
	var TrainingOptions = (_CURRENTTAB.indexOf("TRAININGOPTIONS")!=-1)?true:false;
	Desc = '<span class="contenttextCM"> ';
	if (QualType == "CE")
	{
		if (ExploreCareers)
			QualCriteria_ExploreCareers.QualLabels[BoxNbr-1] = getSeaPhrase("CM_47","CM")
		if (TrainingOptions)
			QualCriteria_TrainingOptions.QualLabels[BoxNbr-1] = getSeaPhrase("CM_47","CM")
		Desc += getSeaPhrase("CM_47","CM")
	}
	else if (QualType == "ED")
	{
		if (ExploreCareers)
			QualCriteria_ExploreCareers.QualLabels[BoxNbr-1] = getSeaPhrase("CM_49","CM")
		if (TrainingOptions)
			QualCriteria_TrainingOptions.QualLabels[BoxNbr-1] = getSeaPhrase("CM_49","CM")
		Desc += getSeaPhrase("CM_49","CM")
	}
	else
	{
		if (ExploreCareers)
			QualCriteria_ExploreCareers.QualLabels[BoxNbr-1] = getSeaPhrase("CM_48","CM")
		if (TrainingOptions)
			QualCriteria_TrainingOptions.QualLabels[BoxNbr-1] = getSeaPhrase("CM_48","CM")
		Desc += getSeaPhrase("CM_48","CM")
	}
	Desc += '</span>';
	var QualBox = GetTextBoxFormObject("main", Name+BoxNbr, Name.toLowerCase()+BoxNbr);
	QualBox.value = QualDesc;
	if (ExploreCareers)
	{
		QualCriteria_ExploreCareers.QualDescs[BoxNbr-1] = QualDesc;
		QualCriteria_ExploreCareers.QualTypes[BoxNbr-1] = QualType;
		QualCriteria_ExploreCareers.QualCodes[BoxNbr-1] = QualCode;
	}
	if (TrainingOptions)
	{
		QualCriteria_TrainingOptions.QualDescs[BoxNbr-1] = QualDesc;
		QualCriteria_TrainingOptions.QualTypes[BoxNbr-1] = QualType;
		QualCriteria_TrainingOptions.QualCodes[BoxNbr-1] = QualCode;
	}
	replaceContent("main", Name+"Label"+BoxNbr, Desc);
	if (ExploreCareers)
	{
		ShowQualCriteriaWin_ExploreCareers(true, Name, Button);
		ShowButton(true, "main", "ClearForm_ExploreCareers");		
	}
	if (TrainingOptions)
	{
		ShowQualCriteriaWin_TrainingOptions(true, Name, Button);
		ShowButton(true, "main", "ClearForm_TrainingOptions");
	}
}

function JobCodeSelected(Type, Index1, Index2, JobCode, JobDesc)//(jobcode,jobdesc)
{
	showWaitAlert(getSeaPhrase("CM_155","CM"));
	var jobcode = " ";
	var jobdesc = " ";
	switch(Type)
	{
		case "Qualification":
			jobcode = QualificationJobList.Detail[Index1].JobDescs[Index2].jobCode
			jobdesc = QualificationJobList.Detail[Index1].JobDescs[Index2].description
			break;
		case "Category":
			if (emssObjInstance.emssObj.filterSelect)
			{
				jobcode = JobCode;
				jobdesc = JobDesc;
			}
			else
			{
				jobcode = JobClass[Index1].Rel_jobcodes[Index2].job_code
				jobdesc = JobClass[Index1].Rel_jobcodes[Index2].description
			}
			break;
	}
	_JOBLISTDESC = jobdesc;
	_EXPLOREPROFILETABSELECTED = 0;
	if (_CURRENTTAB == "M_EXPLORECAREERS")
		Do_HS50_Call(3,1," ",jobcode,"HS50.1","M_EXPLORECAREERS",DirectReports[_DIRECTREPORTSINDEX].code,"HIDDEN");
	else
		Do_HS50_Call(2,1," ",jobcode,"HS50.1","EXPLORECAREERS",authUser.employee,"HIDDEN");
}

function QualCriteriaCodeList_XIconClicked()
{
	ShowWin(false, "main", "QualCriteriaCodeList", true, true);
	if (_CURRENTTAB == "M_EXPLORECAREERS")
	{
		ShowQualCriteriaWin_ExploreCareers(true, "QualCriteria", "qualcriteria_createjoblist_ManagerExploreCareers");
		hideLayer("main", "QualCriteria_Instructions1");
		hideLayer("main", "QualCriteria_Instructions2");
		ShowDirectReports_ExploreCareers(false);
	}
	else
	{
		ShowQualCriteriaWin_ExploreCareers(true, "QualCriteria", "qualcriteria_createjoblist_EmployeeExploreCareers");
		hideLayer("main", "QualCriteria_Instructions");
	}
	ShowButton(true, "main", "ClearForm_ExploreCareers");
	ShowWin(true, "main", "QualCriteriaTypeList", true, true);
	ShowJobProfileWin(false, "main");
	if (emssObjInstance.emssObj.filterSelect)
		ShowFilterList(false);
}

function QualCriteriaTypeList_XIconClicked()
{
	ShowWin(false, "main", "QualCriteriaTypeList", true, true);
	ShowJobProfileWin(false, "main");
	if (_CURRENTTAB == "M_EXPLORECAREERS")
		ShowQualCriteriaWin_ExploreCareers(true, "QualCriteria", "qualcriteria_createjoblist_ManagerExploreCareers");
	else
		ShowQualCriteriaWin_ExploreCareers(true, "QualCriteria", "qualcriteria_createjoblist_EmployeeExploreCareers");
	ShowButton(true, "main", "ClearForm_ExploreCareers");	
}

function ShowQualCriteriaWin_ExploreCareers(nCmd, Name, Button)
{
	for (var j=1; j<=QualCriteria_ExploreCareers.QualLabels.length; j++)
	{
		if (nCmd)
			showLayer("main", Name+"Label"+j);
		else
			hideLayer("main", Name+"Label"+j);
		ShowTextBox(nCmd, "main", Name.toLowerCase()+j);
		ShowButton(nCmd, "main", Name+"Arrow"+j);
	}
	if (nCmd)
	{
		if (_CURRENTTAB == "M_EXPLORECAREERS")
		{
			showLayer("main", Name+"_Instructions1");
			showLayer("main", Name+"_Instructions2");
			ShowDirectReportsLabel_ExploreCareers(true, Name);
		}
		else
	     	showLayer("main", Name+"_Instructions");
		showLayer("main", Name+"Header");
	}
	else
	{
		if (_CURRENTTAB == "M_EXPLORECAREERS")
		{
			hideLayer("main", Name+"_Instructions1");
			hideLayer("main", Name+"_Instructions2");
			ShowDirectReportsLabel_ExploreCareers(false, Name);			
		}
		else
         	hideLayer("main", Name+"_Instructions");
		hideLayer("main", Name+"Header");
	}
	if (_CURRENTTAB == "M_EXPLORECAREERS")
	{
		ShowDirectReports_ExploreCareers(nCmd);
		ShowWin(nCmd, "main", "Instructions_ManagerExploreCareers");
	}
	else
		ShowWin(nCmd, "main", "Instructions_EmployeeExploreCareers");
	ShowButton(nCmd, "main", Button);
	ShowWin(false, "main", Name+"CodeList", true, true);
	ShowWin(false, "main", Name+"TypeList", true, true);
}

function ShowQualCriteriaTypeList_ExploreCareers(nCmd)
{
	ShowWin(nCmd, "main", "QualCriteriaTypeList", true, true);
}

function ShowQualCriteriaCodeList_ExploreCareers(nCmd)
{
	ShowWin(nCmd, "main", "QualCriteriaCodeList", true, true);
}

function ShowJobList_ExploreCareers(nCmd)
{
	ShowWin(nCmd, "main", "JobList", true, true);
	ShowJobListHeader_ExploreCareers(nCmd);
	if (_CURRENTTAB == "M_EXPLORECAREERS" && _EXPLORECURRENTWIN == "EXPLORECATEGORY")
	{
		ShowJobListJobLabel_ExploreCareers(nCmd);
		ShowJobTitleSelect_ExploreCareers(nCmd);
		ShowDirectReportsLabel_ExploreCareers(nCmd,"JobList");
		ShowDirectReports_ExploreCareers(nCmd);
		ShowCreateProfileButton_ExploreCareers(nCmd);
	}
}

function ShowJobTitleInstructions_ExploreCareers(nCmd)
{
	if (nCmd)		
		showLayer("main", "JobTitle_Instructions");
	else			
		hideLayer("main", "JobTitle_Instructions");
}

function ShowJobTitleLabel_ExploreCareers(nCmd)
{
	if (nCmd)
		showLayer("main", "JobTitle_JobTitleLabel");
	else			
		hideLayer("main", "JobTitle_JobTitleLabel");
}

function ShowJobListHeader_ExploreCareers(nCmd)
{
	if (nCmd) 
	{
		// if this layer has no data, we actually don't show it
		if (getDocLoc("main").getElementById("InstructionsHeader_JobList").innerHTML != "")
			showLayer("main", "InstructionsHeader_JobList");
	} 
	else
		hideLayer("main", "InstructionsHeader_JobList");
}

function ShowJobListJobLabel_ExploreCareers(nCmd)
{
	if (nCmd)
		showLayer("main", "JobList_JobLabel");
	else
		hideLayer("main", "JobList_JobLabel");
}

function ShowDirectReportsLabel_ExploreCareers(nCmd, Tab)
{
	if (nCmd) 
		showLayer("main", Tab+"_DirectReportsLabel");
	else 
		hideLayer("main", Tab+"_DirectReportsLabel");
}

function ShowCreateJobListButton_ExploreCareers(nCmd)
{
	if (_CURRENTTAB == "M_EXPLORECAREERS")
		ShowButton(nCmd, "main", "createjoblist_ManagerExploreCareers");
	else
		ShowButton(nCmd, "main", "createjoblist_EmployeeExploreCareers");
}

function ShowCreateProfileButton_ExploreCareers(nCmd)
{
	if (_CURRENTTAB == "M_EXPLORECAREERS")
		ShowButton(nCmd, "main", "createprofile_ManagerExploreCareers");
	else
		ShowButton(nCmd, "main", "createprofile_EmployeeExploreCareers");
}

function ShowJobTitleSelect_ExploreCareers(nCmd)
{
	if (emssObjInstance.emssObj.filterSelect)
	{
		ShowTextBox(nCmd, "main", "JobTitleFilterSelect_ExploreCareers");
		ShowButton(nCmd, "main", "JobTitleFilterSelectArrow");
		if (nCmd)
			showLayer("main", "JobTitleFilterSelectDesc_ExploreCareers");
		else
			hideLayer("main", "JobTitleFilterSelectDesc_ExploreCareers");
	}
	else
		ShowSelect(nCmd, "main", "jobtitleselect");
}

function ShowCategorySelect_ExploreCareers(nCmd)
{
	if (emssObjInstance.emssObj.filterSelect)
	{
		ShowTextBox(nCmd, "main", "CategoryFilterSelect_ExploreCareers");
		ShowButton(nCmd, "main", "CategoryFilterSelectArrow");
		if (nCmd)
			showLayer("main", "CategoryFilterSelectDesc_ExploreCareers");
		else
			hideLayer("main", "CategoryFilterSelectDesc_ExploreCareers");
	}
	else
		ShowSelect(nCmd, "main", "categoryselect");
}

function ShowDirectReports_ExploreCareers(nCmd)
{
	ShowSelect(nCmd, "main", "cmbDirectReports");
}

function jobtitleselect_OnChange()
{
	switch (_EXPLORECURRENTWIN)
	{
		case "EXPLORECATEGORY":
			_JOBLISTINDEX = GetSelectFormObject("main", "JobTitleSelect", "jobtitleselect").selectedIndex-1;
			break;

		default: // "EXPLOREJOBTITLE"
			_JOBCODEINDEX = GetSelectFormObject("main", "JobTitleSelect", "jobtitleselect").selectedIndex-1;
			break;
	}
}

function categoryselect_OnChange()
{
	_JOBCATEGORYINDEX = GetSelectFormObject("main", "CategorySelect", "categoryselect").selectedIndex-1
}

function Do_HS51_1_Call_Finished()
{
	if (self.lawheader.gmsgnbr != "000")
	{
		removeWaitAlert();
		seaAlert(self.lawheader.gmsg, null, null, "error");
		return;
	}
	ReDrawQualCriteriaJobListContent();
	if (_CURRENTTAB == "EXPLORECAREERS")
		ShowQualCriteriaWin_ExploreCareers(false, "QualCriteria","qualcriteria_createjoblist_EmployeeExploreCareers");
	if (_CURRENTTAB == "M_EXPLORECAREERS")
		ShowQualCriteriaWin_ExploreCareers(false, "QualCriteria","qualcriteria_createjoblist_ManagerExploreCareers");
	ShowButton(false, "main", "ClearForm_ExploreCareers");
	ShowJobList_ExploreCareers(true);
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
}

function Do_HS50_Call_EMPLOYEEPROFILE()
{
	if (_DIRECTREPORTSINDEX == -1 || !DirectReports[_DIRECTREPORTSINDEX])
	{
		removeWaitAlert();
		seaAlert(getSeaPhrase("CM_24","CM"), null, null, "error");
		return;
	}
	else
		Do_HS50_Call(3,1,"Y",null,"HS50.1","EMPLOYEEPROFILE", DirectReports[_DIRECTREPORTSINDEX].code);
}

function Do_HS50_1_Call_EMPLOYEEPROFILE_Finished()
{
	_CURRENTPROFILEDESC = getSeaPhrase("CM_128","CM")+" - " + DirectReports[_DIRECTREPORTSINDEX].description;
	Do_HS50_1_Call_DEFAULTPROFILE_Finished(false);
}

function Do_HS50_1_Call_DEFAULTPROFILE_Finished(useDefault)
{
	var Profile = (useDefault)?StandardCareerProfile:CareerProfile;
	if (useDefault) CareerProfile = StandardCareerProfile;
	if (_CURRENTTAB == "M_EXPLORECAREERS") // Manager Explore Careers
	{
		if (CareerProfile.empCompFlag != "Y")
		{
			removeWaitAlert();
			seaAlert(getSeaPhrase("CM_188","CM"), null, null, "error");
			ShowJobProfileWin(false,"main");
			return;
		}
	}
	else // Employee Explore Careers
	{
		if (Profile.empCompFlag != "Y")
		{
			removeWaitAlert();
			seaAlert(getSeaPhrase("CM_188","CM"), null, null, "error");
			ShowJobProfileWin(false,"main");
			return;
		}
	}
	_EXPLOREPROFILETABSELECTED = 0;
	ShowJobProfileWin(true,"main");
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
}

/*
 *	Session/Prerequisites Logic
 */
var __TrainingCoursesIndexSelected;
var SessionsObj;
var CoursePrerequisites;
var PreReqs = new Array(0);
var _EMPLOYEEINDEX
var sessionIndex = -1;
var sessionFc = "A";
var sessionForm = null;

function ShowSessionsPreReq(Index, TabName)
{
	var nextFunc = function()
	{
		ShowCourseDetailWin(false, TabName);
		ShowSubmitApplication(false, TabName);
		if (_CURRENTTAB.indexOf("TRAININGOPTIONS") != -1)
			ShowTrainingGaps_TrainingOptions(false);
		PaintCourseDetailTab(0, Index, TabName);
	};
	showWaitAlert(getSeaPhrase("CM_155","CM"), nextFunc);
}

function ShowCourseDetailWin(pFlag, TabName)
{
	if (_CURRENTTAB == "M_TRAININGOPTIONS")
		ShowCourseDetail_Manager(pFlag, TabName)
	else
		ShowCourseDetail(pFlag, TabName);
}

function DrawCourseDetailTabs(rpFlag, TabSelected, IsVisible, TabName)
{
	var TabsArray = new Array(
		new TabPane("Sessions", getSeaPhrase("CM_278","CM"), 75),
		new TabPane("Prerequisites", getSeaPhrase("CM_279","CM"), 130)
	);
	var Tab = new TabObject(TabsArray, TabSelected, "CourseDetail_"+TabName);
	Tab.Style(InnerTabBorderColor, InnerTabbgColorTabDown, InnerTabbgColorTabUp, InnerTabfgColorTabDown, InnerTabfgColorTabUp, InnerTabfontSize, InnerTabfontFamily, InnerTabfontWeight);
	var pObj = new CareerManagementWindowObject(Window2,"main", "CourseDetail_"+TabName, 2,22,395,490, IsVisible, getSeaPhrase("CM_280","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.TabObject = Tab;
	if (arguments.length>4 && arguments[4] == true)
	{
		pObj.AddCloseIcon = true;
		pObj.CloseIconLocationLeft = pObj.Left + 365
		pObj.CloseIconLocationTop = pObj.Top + 5
	}
	if (rpFlag)	pObj.ReplaceFlag = true;
	pObj.DrawTabbed();
}

function DrawCourseDetail_Manager(TabName)
{
	var code = (_DIRECTREPORTSINDEX>=0)? DirectReports[_DIRECTREPORTSINDEX].code : null;
	var description = (_DIRECTREPORTSINDEX>=0)? DirectReports[_DIRECTREPORTSINDEX].description : null;
	_EMPLOYEEINDEX = code;
	var pObj = new CareerManagementWindowObject(Window2,"main", "CourseDetail_"+TabName, 25,80,50,300, false, getSeaPhrase("CM_280","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.DrawView(25,150,325,315);
	MakeButton(getSeaPhrase("CM_281","CM"), 125, 475, 150, 24, ButtonBorderColor, "SubmitApplication_"+TabName, false, getSeaPhrase("CM_137","CM"));
	if (_TRAINCURRENTWIN != "TRAININGJOBGAPS")
	{
		var Desc = '<label class="contenttextCM" for="cmbDirectReports_SESS">'+getSeaPhrase("CM_282","CM")+'</label>'
		createLayer("main","DirectReports_CourseDetail_Manager",22,80,425,70,false,Desc,"","");
		MakeSelectBox("DirectReports", 22, 120, 425, 30, "cmbDirectReports_SESS", DirectReports, false, _DIRECTREPORTSINDEX, true)
	}
	else
	{
		var Desc = '<span class="contentlabelCM">'+getSeaPhrase("CM_283","CM")+'&nbsp;&nbsp;</span>'
		Desc += '<span class="contenttextCM">'+description+'</span>'
		createLayer("main","DirectReports_CourseDetail_Manager",22,80,400,70,false,Desc,"","");
	}
}

function cmbDirectReports_SESS_OnChange()
{
	var FormObj = GetSelectFormObject("main", "DirectReports", "cmbDirectReports_SESS");
	if (typeof(FormObj) != "undefined" && FormObj != null)
		_DIRECTREPORTSINDEX = FormObj.selectedIndex - 1;
}

function DrawCourseDetail(TabName)
{
	if (_DIRECTREPORTSINDEX >= 0 && DirectReports[_DIRECTREPORTSINDEX])
		_EMPLOYEEINDEX = DirectReports[_DIRECTREPORTSINDEX].code
	else
		_EMPLOYEEINDEX = authUser.employee;
	var pObj = new CareerManagementWindowObject(Window2,"main", "CourseDetail_"+TabName, 25,80,50,300, false, getSeaPhrase("CM_280","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.DrawView(25,90,350,375);
	MakeButton(getSeaPhrase("CM_281","CM"), 125, 475, 150, 24, ButtonBorderColor, "SubmitApplication_"+TabName, false, getSeaPhrase("CM_137","CM"));
}

function ShowSubmitApplication(nCmd, TabName)
{
	ShowButton(nCmd, "main", "SubmitApplication_"+TabName)
}

function ShowCourseDetail(nCmd, TabName)
{
	ShowWin(nCmd, "main", "CourseDetail_"+TabName, true, true, true);
	ShowSubmitApplication(nCmd, TabName)
}

function ShowCourseDetail_Manager(nCmd, TabName)
{
	ShowWin(nCmd, "main", "CourseDetail_"+TabName, true, true, true);
	if (_TRAINCURRENTWIN != "TRAININGJOBGAPS")
		ShowSelect(nCmd, "main", "cmbDirectReports_SESS");
	ShowSubmitApplication(nCmd, TabName);
	if (nCmd)
		showLayer("main", "DirectReports_CourseDetail_Manager");
	else
		hideLayer("main", "DirectReports_CourseDetail_Manager");
}

function SubmitApplication_OnClick(TabName)
{
	sessionForm = GetFormFromStansWindowLayer("main", "CourseDetail_"+TabName+"Window", "sessionForm");
	// If we are submitting a course session via the Group Profile tab, we have already set the
	// appropriate employee index.  In this case, it is the employee number of the direct report
	// clicked on the "Employees with Gaps" chart.
	if (TabName != "GroupProfile")
	{
		if (_CURRENTTAB == "M_TRAININGOPTIONS" && _DIRECTREPORTSINDEX == -1)
		{
			seaAlert(getSeaPhrase("CM_24","CM"), null, null, "error");
			var selObj = GetSelectFormObject("main", "DirectReports", "cmbDirectReports_SESS")
			if (typeof(selObj) != "undefined" && selObj != null)			
				selObj.focus();
			return;
		}	
		else if (_DIRECTREPORTSINDEX >= 0 && DirectReports[_DIRECTREPORTSINDEX])
			_EMPLOYEEINDEX = DirectReports[_DIRECTREPORTSINDEX].code
		else
			_EMPLOYEEINDEX = authUser.employee;
	}
	var sessionChecked = false;
	var formElem = new Object();
	var formLen = sessionForm.elements.length;
	sessionIndex = -1;
	sessionFc = "A";
	for (var i=0; i<formLen; i++)
	{
		formElem = sessionForm.elements[i];
		if (formElem.type == "radio" && formElem.name == "session")
		{
			sessionIndex++;
			if (formElem.checked)
			{
				sessionChecked = true;
				break;
			}
		}
	}
	if (!sessionChecked)
	{
		seaAlert(getSeaPhrase("CM_284","CM"), null, null, "error");
		return;
	}
	CheckRegistration();		
}

function CheckRegistration()
{
	var sessionNbr = eval('sessionForm.sessionCode'+sessionIndex).value;
	var startDate = eval('sessionForm.startdate'+sessionIndex).value;
	if (NonSpace(sessionNbr) && !isNaN(parseFloat(sessionNbr)))
		sessionNbr = parseInt(sessionNbr,10);	
  	var dmeObj = new DMEObject(authUser.prodline, "paregister");
	dmeObj.out = "JAVASCRIPT";
	dmeObj.index = "regset2";
	dmeObj.field = "course;session;start-date;reg-status";
	dmeObj.key = escapeEx(parseInt(authUser.company,10))+"="+escapeEx(parseInt(_EMPLOYEEINDEX,10))+"="+escapeEx(TrainingCourses[__TrainingCoursesIndexSelected].Course.courseCode)+"="+escapeEx(parseInt(sessionNbr,10))+"="+escapeEx(formjsDate(startDate));
	dmeObj.max = "1";
	dmeObj.func = "CheckRegistrationReturned()";
	showWaitAlert(getSeaPhrase("CM_186","CM"), function(){DME(dmeObj, "jsreturn");});
}

function CheckRegistrationReturned()
{
	var sessionRecs = self.jsreturn.record;
	var cancelledSession = (sessionRecs.length > 0 && sessionRecs[0].reg_status == "X") ? true : false;
	sessionFc = (cancelledSession) ? "C" : "A";
	var sessionStatus = eval('sessionForm.sessionStatus' + sessionIndex).value;
	if (sessionStatus == "FA" || sessionStatus == "FL") 
	{
		removeWaitAlert();
		if (seaConfirm(getSeaPhrase("PUT_ON_WAITING_LIST","ESS"), "", handleWaitListResponse))
			SubmitTrainingSession(sessionIndex, sessionFc, "W");
	}
	else
		SubmitTrainingSession(sessionIndex, sessionFc, "C");
}

// Firefox will call this function
function handleWaitListResponse(confirmWin)
{
	if (confirmWin.returnValue == "ok" || confirmWin.returnValue == "continue")
		SubmitTrainingSession(sessionIndex, sessionFc, "W");
}

function SubmitTrainingSession(sessionIndex, sessionFc, status)
{
	var sessionNbr = eval('sessionForm.sessionCode'+sessionIndex).value;
	var startDate = eval('sessionForm.startdate'+sessionIndex).value;
	var sessionStatus = status;
	var objId = eval('sessionForm.objId' + sessionIndex).value;
	if (NonSpace(sessionNbr) && !isNaN(parseFloat(sessionNbr)))
		sessionNbr = parseInt(sessionNbr,10);
	if (!status)
	{
		sessionStatus = eval('sessionForm.sessionStatus' + sessionIndex).value;
		status = (sessionStatus == "FA" || sessionStatus == "FL") ? "W" : "C";
	}
	var object = new AGSObject(authUser.prodline, "TR20.2");
	object.event = (sessionFc == "A") ? "ADD" : "CHG";
	object.rtn = "MESSAGE";
	object.longNames = "ALL";
	object.callmethod = "post";
	object.tds = false;
	object.func = "parent.SubmitApplication_IsFinished()";
	object.field = "FC="+sessionFc;
	object.debug = false;
	i = 1;
	object.field += "&LINE-FC"+i+"="+sessionFc
	+ "&DTL-COURSE"+i+"="+escapeEx(TrainingCourses[__TrainingCoursesIndexSelected].Course.courseCode)
	+ "&DTL-SESSION"+i+"="+escapeEx(sessionNbr)
	+ "&DTL-START-DATE"+i+"="+escapeEx(formjsDate(startDate))
	+ "&DTL-COMPANY"+i+"="+escapeEx(authUser.company)
	+ "&DTL-EMPLOYEE"+i+"="+escapeEx(_EMPLOYEEINDEX)	
	+ "&REG-COURSE"+i+"="+escapeEx(TrainingCourses[__TrainingCoursesIndexSelected].Course.courseCode)
	+ "&REG-SESSION"+i+"="+escapeEx(sessionNbr)
	+ "&REG-START-DATE"+i+"="+escapeEx(formjsDate(startDate))
	+ "&REG-COMPANY"+i+"="+escapeEx(authUser.company)
	+ "&REG-EMPLOYEE"+i+"="+escapeEx(_EMPLOYEEINDEX)
	+ "&REG-REG-STATUS"+i+"="+status
	+ "&REG-OBJ-ID"+i+"="+parseInt(objId,10);
	if (sessionFc == "C")
	{
		object.field += "&PT-REG-COURSE="+escapeEx(TrainingCourses[__TrainingCoursesIndexSelected].Course.courseCode)
		+ "&PT-REG-SESSION="+escapeEx(sessionNbr)
		+ "&PT-REG-START-DATE="+escapeEx(formjsDate(startDate))
		+ "&PT-REG-COMPANY="+escapeEx(authUser.company)
		+ "&PT-REG-EMPLOYEE="+escapeEx(_EMPLOYEEINDEX);
	}	
	showWaitAlert(getSeaPhrase("CM_186","CM"), function(){AGS(object,"jsreturn");});
}

function SubmitApplication_IsFinished()
{
	removeWaitAlert();
	if (self.lawheader.gmsgnbr == "000")
		seaPageMessage(getSeaPhrase("CM_285","CM"), null, null, "info", null, true, getSeaPhrase("APPLICATION_ALERT","SEA"), true);
	else
		seaAlert(self.lawheader.gmsg, null, null, "error");	
}

function OnTabClicked_CourseDetail(TabSelected, TabName)
{
	var nextFunc = function()
	{
		ShowCourseDetailWin(false, TabName);
		ReplaceWindowContent("main", "CourseDetail_"+TabName+"Window", "");
		switch (TabSelected)
		{
			case "Sessions":
				DrawCourseDetailTabs(true, 0, false, TabName);
				PaintCourseDetailTab(0, __TrainingCoursesIndexSelected, TabName); break;
			case "Prerequisites":	
				DrawCourseDetailTabs(true, 1, false, TabName);		
				PaintCourseDetailTab(1, __TrainingCoursesIndexSelected, TabName); break;
			default:
				removeWaitAlert(); break;
		}
		TabsLoaded();
	};
	showWaitAlert(getSeaPhrase("CM_155","CM"), nextFunc);
}

function PaintCourseDetailTab(TabIndex, CourseIndex, TabName)
{
	var Desc = '<span class="layertitleCM">'+getSeaPhrase("CM_280","CM")+" - "+TrainingCourses[CourseIndex].Course.courseDescription+'</span>';
	ChangeTitle("main", "CourseDetail_"+TabName, Desc);
	ReplaceWindowContent("main", "CourseDetail_"+TabName+"Window", "");
	switch (TabIndex)
	{
		case 0:
			if (TrainingCourses[CourseIndex].Course.sessionFlag == null || TrainingCourses[CourseIndex].Course.sessionFlag != "Y")
			{
				DrawCourseDetailTabs(true, 0, false, TabName);
				__TrainingCoursesIndexSelected = CourseIndex;
				var Desc = '<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td>'
				+ '<span class="contenttextCM">'+getSeaPhrase("CM_286","CM")+' '+TrainingCourses[CourseIndex].Course.courseDescription+'.</span></table></center>'
				ReplaceWindowContent("main", "CourseDetail_"+TabName+"Window", Desc);
				if (_CURRENTTAB == "M_TRAININGOPTIONS")
				{
					showLayer("main", "DirectReports_CourseDetail_Manager");
					if (_TRAINCURRENTWIN != "TRAININGJOBGAPS")	
						ShowSelect(true, "main", "cmbDirectReports_SESS");
				}				
				ShowCourseDetailWin(true, TabName);
				ShowSubmitApplication(false, TabName);
				self.main.stylePage();
				removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
			}
			else	
				DME_TO_PASESSION(TrainingCourses[CourseIndex].Course.courseCode,'PaintSessions('+CourseIndex+',\''+TabName+'\')');
			break;
		case 1:
			if (TrainingCourses[CourseIndex].Course.preRequisitesFlag == null || TrainingCourses[CourseIndex].Course.preRequisitesFlag != "Y")
			{
				DrawCourseDetailTabs(true, 1, false, TabName);
				__TrainingCoursesIndexSelected = CourseIndex;
				if (_CURRENTTAB == "M_TRAININGOPTIONS")
				{
					hideLayer("main", "DirectReports_CourseDetail_Manager");
					if (_TRAINCURRENTWIN != "TRAININGJOBGAPS")
						ShowSelect(false, "main", "cmbDirectReports_SESS");
				}				
				var Desc = '<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td>'
				+ '<span class="contenttextCM">'+getSeaPhrase("CM_287","CM")+' '+TrainingCourses[CourseIndex].Course.courseDescription+'.</span></table>'
				ReplaceWindowContent("main", "CourseDetail_"+TabName+"Window", Desc);
				ShowCourseDetailWin(true, TabName);
				ShowSubmitApplication(false, TabName);
				self.main.stylePage();
				removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
			}
			else
				Call_TR02(TrainingCourses[CourseIndex].Course.courseCode,"TR02.1",'PaintPreReqs('+CourseIndex+',\''+TabName+'\')');
			break;	
		default:
			self.main.stylePage();
			ShowCourseDetailWin(true, TabName);
			removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
			break;
	}	
}

function PaintSessions(Index, TabName)
{
	DrawCourseDetailTabs(true, 0, false, TabName);
	__TrainingCoursesIndexSelected = Index;
	ReplaceWindowContent("main", "CourseDetail_"+TabName+"Window", "");
	var PrintFlag = false;
	var arg = '<form name="sessionForm"><div role="radiogroup"><table border="0" cellpadding="0" cellspacing="0" summary="'+getSeaPhrase("TSUM_11","CM",[TrainingCourses[Index].Course.courseDescription])+'">'
	+ '<caption class="offscreen">'+getSeaPhrase("TCAP_2","SEA",[TrainingCourses[Index].Course.courseDescription])+'</caption>'
	+ '<tr><th scope="col" colspan="6"></th></tr>'
	var HiddenFields = '';
	var SessionObj = new Array();
	for (var i=0,j=0; i<self.jsreturn.record.length; i++)
	{
		var pObj = self.jsreturn.record[i];
		for (var k=0; k<TrainingCourses[Index].Sessions.length; k++)
		{
			var sessObj = TrainingCourses[Index].Sessions[k]
			// Match the correct session record from the database with the one from HS50.3.
			if (parseInt(sessObj.session,10) == parseInt(pObj.session,10) && isEqual(sessObj.sessionStartDate,formjsDate(formatDME(pObj.start_date))))
			{
				SessionObj[SessionObj.length] = pObj;
				PrintFlag = true;
				var sNbr = SessionObj.length-1;
				arg += '<tr><td><input type="radio" value="on" id="session'+sNbr+'" name="session" aria-describedby="sLbl2 sLbl3 sLbl4 sLbl5 sLbl6 sLbl7 sLbl8 sLbl9 sLbl10 sLbl11 sLbl12 sLbl13"></td>'
				+ '<th class="contentlabelCM"><label for="session'+sNbr+'">'+getSeaPhrase("CM_288","CM")+':<span class="offscreen">&nbsp;'+pObj.session+'</span></label></th>'
				+ '<td class="plaintablecell">'+pObj.session+'</td><td colspan="3">&nbsp;</td></tr>'
				+ '<tr><td>&nbsp;</td><th class="contentlabelCM"><span id="sLbl2">'+getSeaPhrase("CM_289","CM")+':</span></th>'
				+ '<td class="contenttextCM"><span id="sLbl3">'+pObj.start_date+'</span></td>'
				+ '<td>&nbsp;</td><th class="contentlabelCM"><span id="sLbl4">'+getSeaPhrase("CM_290","CM")+':</span></th>'
				+ '<td class="plaintablecell"><span id="sLbl5">'+pObj.end_date+'</span></td></tr>'
				+ '<tr><td>&nbsp;</td><th class="contentlabelCM"><span id="sLbl6">'+getSeaPhrase("CM_291","CM")+':</span></th>'
				+ '<td class="plaintablecell"><span id="sLbl7">'+pObj.site+'</span></td><td colspan="3">&nbsp;</td></tr>'
				+ '<tr><td>&nbsp;</td><th class="contentlabelCM"><span id="sLbl8">'+getSeaPhrase("CM_292","CM")+':</span></th>'
				+ '<td class="plaintablecell"><span id="sLbl9">'+pObj.facility_description+'</span></td><td colspan="3">&nbsp;</td></tr>'
				+ '<tr><td>&nbsp;</td><th class="contentlabelCM"><span id="sLbl10">'+getSeaPhrase("CM_293","CM")+':</span></th>'
				+ '<td class="contenttextCM"><span id="sLbl11">'+pObj.start_time+'</span></td>'
				+ '<td>&nbsp;</td><th class="contentlabelCM"><span id="sLbl12">'+getSeaPhrase("CM_294","CM")+':</span></th>'
				+ '<td class="plaintablecell"><span id="sLbl13">'+pObj.end_time+'</span></td></tr>'
				HiddenFields += '<input type="hidden" value="'+pObj.session+'" name="sessionCode'+j+'">'
				+ '<input type="hidden" value="'+formatDME(pObj.start_date)+'" name="startdate'+j+'">'
				+ '<input type="hidden" value="'+pObj.session_status+'" name="sessionStatus'+j+'">'
				+ '<input type="hidden" value="'+pObj.obj_id+'" name="objId'+j+'">';
				j++;
				break;
			}
		}
	}
	arg += '</table>'+HiddenFields+'</div></form>'
	if (!SessionObj.length || !PrintFlag)
	{
		Desc = '<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td>'
		+ '<span class="contenttextCM">'+getSeaPhrase("CM_286","CM")+' '+TrainingCourses[Index].Course.courseDescription+'.</span></td></tr></table>'
		ReplaceWindowContent("main", "CourseDetail_"+TabName+"Window", Desc);
		if(_CURRENTTAB == "M_TRAININGOPTIONS")
		{
			showLayer("main", "DirectReports_CourseDetail_Manager");
			if (_TRAINCURRENTWIN != "TRAININGJOBGAPS")
				ShowSelect(true, "main", "cmbDirectReports_SESS");
		}	
		ShowCourseDetailWin(true, TabName);
		ShowSubmitApplication(false, TabName);
	}
	else
	{
		ReplaceWindowContent("main", "CourseDetail_"+TabName+"Window", arg);
		if (_CURRENTTAB == "M_TRAININGOPTIONS")
		{
			showLayer("main", "DirectReports_CourseDetail_Manager");
			if (_TRAINCURRENTWIN != "TRAININGJOBGAPS")
				ShowSelect(true, "main", "cmbDirectReports_SESS");
		}
		ShowCourseDetailWin(true, TabName);
		ShowSubmitApplication(true, TabName);
	}
	self.main.stylePage();
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
}

function PaintPreReqs(Index, TabName)
{
	PreReqs = new Array(0);
	var Eligible = "";
	var FoundFromDate = false;
	for (var i=0;i<CoursePrerequisites.Detail.length;i++)
	{
		var pObj = CoursePrerequisites.Detail[i];
		for (var k=0; k<TrainingCourses[Index].Prereqs.length; k++)
		{
			var prereqObj = TrainingCourses[Index].Prereqs[k];
			if (prereqObj.preRequisiteCompany == null || !NonSpace(prereqObj.preRequisiteCompany))
				prereqObj.preRequisiteCompany = 0;
			if (pObj.Company == null || !NonSpace(pObj.Company)) pObj.Company = 0;
			// Match the correct prerequisite record from the database with the one from HS50.3.
			if (isEqual(prereqObj.preRequisitesType,pObj.Type) && isEqual(prereqObj.preRequisite,pObj.Prerequisite)
			&& parseInt(prereqObj.preRequisiteCompany,10) == parseInt(pObj.Company,10))
			{
			    if (pObj.FromDate != null) FoundFromDate = true;
				switch (pObj.Type)
				{
				    case "CS": pObj.Type = getSeaPhrase("CM_295","CM"); pObj.Description = pObj.CourseDescription; break;
					case "EG": pObj.Type = getSeaPhrase("CM_296","CM"); pObj.Description = pObj.GroupDescription; break;
					case "AB": pObj.Type = getSeaPhrase("CM_297","CM"); pObj.Description = pObj.CompDescription; break;
					case "KN": pObj.Type = getSeaPhrase("CM_298","CM"); pObj.Description = pObj.CompDescription; break;
					case "OA": pObj.Type = getSeaPhrase("CM_299","CM"); pObj.Description = pObj.CompDescription; break;
					case "SK": pObj.Type = getSeaPhrase("CM_300","CM"); pObj.Description = pObj.CompDescription; break;
					case "SV": pObj.Type = getSeaPhrase("CM_301","CM"); pObj.Description = null; break;
					default: pObj.Type = null; pObj.Description = null; break;
				}
				switch (pObj.Length)
				{
				     case "D": pObj.Length = getSeaPhrase("CM_302","CM"); break;
					 case "M": pObj.Length = getSeaPhrase("CM_303","CM"); break;
					 case "Y": pObj.Length = getSeaPhrase("CM_304","CM"); break;
					 default: pObj.Length = null; break;
				}
				switch (pObj.Required)
				{
				     case "Y": pObj.Required = getSeaPhrase("CM_305","CM"); break;
					 case "N": pObj.Required = getSeaPhrase("CM_306","CM"); break;
				     default: pObj.Required = null; break;
				}
				PreReqs[PreReqs.length] = pObj;
				break;
			}
		}
	}
	if (FoundFromDate)
	{
	     var pDMEObj = new DMEObject(authUser.prodline, "employee");
	     pDMEObj.out = "JAVASCRIPT";
	     pDMEObj.index = "empset1";
	     pDMEObj.debug = false;
	     pDMEObj.key = parseInt(authUser.company,10)+"="+parseInt(authUser.employee,10);
	     pDMEObj.field = "date-hired;adj-hire-date;annivers-date;paemployee.senior-date";
	     pDMEObj.func = "ContinuePaintingPreReqs("+Index+",'"+TabName+"')";
	     DME(pDMEObj, "jsreturn");
	}
	else
	     ContinuePaintingPreReqs(Index,TabName);
}

function ContinuePaintingPreReqs(Index, TabName)
{
	DrawCourseDetailTabs(true, 1, false, TabName);
	if (_CURRENTTAB == "M_TRAININGOPTIONS")
	{
		hideLayer("main", "DirectReports_CourseDetail_Manager");		
		if (_TRAINCURRENTWIN != "TRAININGJOBGAPS")
			ShowSelect(false, "main", "cmbDirectReports_SESS");
	}
	__TrainingCoursesIndexSelected = Index;
	ReplaceWindowContent("main", "CourseDetail_"+TabName+"Window", "");
	if (!PreReqs.length)
	{
		var arg = '<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td>'
		+ '<span class="contenttextCM">'+getSeaPhrase("CM_287","CM")+' '+TrainingCourses[Index].Course.courseDescription+'.</span></td></tr></table>'
	}
	else
	{
		var arg = '<table border="0" cellpadding="0" cellspacing="0" summary="'+getSeaPhrase("TSUM_2","CM",[TrainingCourses[Index].Course.courseDescription])+'">';
		arg += '<caption class="offscreen">'+getSeaPhrase("TCAP_2","CM",[TrainingCourses[Index].Course.courseDescription])+'</caption>'
		arg += '<tr><th scope="col" colspan="2"></th></tr>'
		for (var i=0; i<PreReqs.length; i++)
		{
			var pObj = PreReqs[i];
			if ((self.jsreturn.record || typeof(self.jsreturn.record) != "undefined") && (self.jsreturn.record[0] || typeof(self.jsreturn.record[0]) != "undefined"))
			{
				switch (pObj.FromDate)
				{
					case "HI": pObj.FromDate = formatDME(self.jsreturn.record[0].date_hired); break;
					case "AJ": pObj.FromDate = formatDME(self.jsreturn.record[0].adj_hire_date); break;
					case "AN": pObj.FromDate = formatDME(self.jsreturn.record[0].annivers_date); break;
					case "SN": pObj.FromDate = formatDME(self.jsreturn.record[0].paemployee_senior_date); break;
				}
			}
			else 
				pObj.FromDate = null;
			if (pObj.FromDate != null && pObj.DateMeasure != null && pObj.Length != null)
				pObj.Eligible = AddToDate(formjsDate(pObj.FromDate), pObj.DateMeasure, pObj.Length);
			else 
				pObj.Eligible = null;
			if (typeof(pObj.Type) != "undefined" && pObj.Type != null && NonSpace(pObj.Type))
				arg += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_50","CM")+':</th><td class="plaintablecell">'+pObj.Type+'</td></tr>'
			if (typeof(pObj.Description) != "undefined" && pObj.Description != null && NonSpace(pObj.Description))
				arg += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_134","CM")+':</th><td class="plaintablecell">'+pObj.Description+'</td></tr>'
			if (typeof(pObj.CompanyName) != "undefined" && pObj.CompanyName != null && NonSpace(pObj.CompanyName))
				arg += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_307","CM")+':</th><td class="plaintablecell">'+pObj.CompanyName+'</td></tr>'
			if (typeof(pObj.FromDate) != "undefined" && pObj.FromDate != null && NonSpace(pObj.FromDate))
				arg += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_308","CM")+':</th><td class="plaintablecell">'+FormatDte3(formjsDate(pObj.FromDate))+'</td></tr>'
			if (typeof(pObj.Eligible) != "undefined" && pObj.Eligible != null && NonSpace(pObj.Eligible))
				arg += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_309","CM")+':</th><td class="plaintablecell">'+FormatDte3(pObj.Eligible)+'</td></tr>'
			if (typeof(pObj.MinimumProficiency) != "undefined" && pObj.MinimumProficiency != null && NonSpace(pObj.MinimumProficiency))
				arg += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_310","CM")+':</th><td class="plaintablecell">'+pObj.MinimumProficiency+'</td></tr>'
			if (typeof(pObj.Length) != "undefined" && pObj.Length != null && NonSpace(pObj.Length) && typeof(pObj.DateMeasure) != "undefined" && pObj.DateMeasure != null && NonSpace(pObj.DateMeasure))
			{
				arg += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_311","CM")+':</th><td class="plaintablecell">'+parseFloat(pObj.DateMeasure)+'&nbsp;'
				if (parseFloat(pObj.DateMeasure)<2)
					arg += pObj.Length.substring(0,pObj.Length.length-1)
				else
					arg += pObj.Length
				arg += '</td></tr>'	
			}
			if (typeof(pObj.Required) != "undefined" && pObj.Required != null && NonSpace(pObj.Required))
				arg += '<tr><th scope="row" class="contentlabelCM">'+getSeaPhrase("CM_305","CM")+':</th><td class="plaintablecell">'+pObj.Required+'</td></tr>'
		}
		arg += '</table>'
	}
	ReplaceWindowContent("main", "CourseDetail_"+TabName+"Window", arg);
	ShowCourseDetailWin(true, TabName);
	ShowSubmitApplication(false, TabName);
	self.main.stylePage();
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
}

function ParseOutTrainingCourses(pObj)
{
	var CourseList = new Array(0);
	var SessPrereq = new Array(0);
	for(var i=0; i<pObj.length; i++)
	{
		pObj[i].sort = parseInt(pObj[i].sort, 10);
		if (pObj[i].sort == 1)
		{
			CourseList[CourseList.length] = new TrainingSummaryObject();
			CourseList[CourseList.length-1].Course = pObj[i];
		}
		else
		{
			SessPrereq[SessPrereq.length] = new TrainingCoursesObject();
			SessPrereq[SessPrereq.length] = pObj[i];
		}
	}
	for(var j=0; j<SessPrereq.length; j++)
	{
		for(var k=0; k<CourseList.length; k++)
		{
			if (CourseList[k].Course.courseNumber == SessPrereq[j].courseNumber)
			{
				if (SessPrereq[j].sort == 2) // Session
				{
					CourseList[k].Sessions[CourseList[k].Sessions.length] = SessPrereq[j];
					break;
				}
				else if (SessPrereq[j].sort == 3) // Prerequisite
				{
					CourseList[k].Prereqs[CourseList[k].Prereqs.length] = SessPrereq[j];
					break;
				}
			}
		}
	}
	return CourseList;
}

function AddToDate(FromDate, Length, Type)
{
	var pDate = new Date(FromDate);
	var Year = Number(FromDate.substring(0,4));
	var Month = Number(FromDate.substring(4,6));
	var Day = Number(FromDate.substring(6,8));
	var daysInMonth	= new Array(0,31,28,31,30,31,30,31,31,30,31,30,31);
	switch (Type)
	{
		case getSeaPhrase("CM_304","CM"):
			return (String(Year + Number(Length)) + String(Month) + String(Day));
		case getSeaPhrase("CM_303","CM"):
			Year += Math.floor(Number(Length) / 12);
			var MonthsLeft = Number(Length) % 12;
			if ((Month + MonthsLeft) > 12)
			{
				Year += Math.floor((Month + MonthsLeft) / 12);
				Month = (Month + MonthsLeft) % 12;
			}
			else
				Month += MonthsLeft;
			if (Month.toString().length == 1) Month = "0" + Month;
			return (String(Year) + String(Month) + String(Day));
		case getSeaPhrase("CM_302","CM"):
			Year += Math.floor(Length / 365);
			var DaysLeft = Length % 365;
			if (Month == 2 && isLeapYear(Year))
				var AdjustedDaysLeft = (29 - Day)
			else
				var AdjustedDaysLeft = (daysInMonth[Month] - Day)
			if (DaysLeft - AdjustedDaysLeft < 0)
				Day += DaysLeft;
			else
			{
				DaysLeft -= AdjustedDaysLeft;
				while (DaysLeft > 0)
				{
					Month++;
					if (Month > 12)
					{
						Year++;
						Month = 1;
					}
					if (Month == 2 && isLeapYear(Year))
						AdjustedDaysLeft = (DaysLeft - 29);
					else
						AdjustedDaysLeft = (DaysLeft - daysInMonth[Month]);
					if (AdjustedDaysLeft < 0)
						Day = DaysLeft;
					DaysLeft = AdjustedDaysLeft;
				}
			}
			if (Month.toString().length == 1) Month = "0" + Month;
			if (Day.toString().length == 1) Day = "0" + Day;
			return (String(Year) + String(Month) + String(Day));
		default: return "";
	}
}

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

/*
 *	Job Profile Tab
 */
var _JCHARTUSEDEFAULT = false
var _JCHARTTAB = 0
var _JCHARTINDEX = 0

function GetProfileInformation(Tab)
{
	var useDefault = (arguments.length<2)?true:false;
	var Profile = (useDefault)?StandardCareerProfile:CareerProfile;
	var ManagerTab = (_CURRENTTAB.substring(0,2)=="M_"||_CURRENTTAB=="INDIVIDUALPROFILE"||_CURRENTTAB=="GROUPPROFILE"||_CURRENTTAB=="EMPLOYEEQUALIFICATIONS"||_CURRENTTAB=="EMPLOYEEACTIONPLAN")?true:false;
	var pObj;
	if (typeof(Profile) == "undefined" || Profile == null)
	{
		if (ManagerTab && _DIRECTREPORTSINDEX < 0) // This is a manager tab -- no report selected.
			return '<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td><span class="contenttextCM">'+getSeaPhrase("CM_179","CM")+'</span></td></tr></table>';
		else
			return '';
	}
	switch (Tab)
	{
		case 0:	pObj = Profile.CompetencyDetail; break;
		case 1:	pObj = Profile.CertificationDetail; break;
		case 2:	pObj = Profile.EducationDetail; break;
	}
	if ((ManagerTab && _DIRECTREPORTSINDEX < 0) || pObj.length == 0) 
	{
		if (ManagerTab && _DIRECTREPORTSINDEX < 0) // This is a manager tab -- no report selected.
			Desc = '<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td><span class="contenttextCM">'+getSeaPhrase("CM_179","CM")+'</span></td></tr></table>'
		else if (pObj.length == 0) // There is no detail for this competency record.
			Desc = '<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td><span class="contenttextCM">'+getSeaPhrase("CM_199","CM")+'</span></td></tr></table>';
	}
	else
	{
		var JobLabels = new Array();
		var JobValues = new Array();
		var EmployeeValues = new Array();
		_JCHARTUSEDEFAULT = (useDefault)?true:false;
		_JCHARTTAB = Tab;
		for (var i=0; i<pObj.length; i++)
		{
			JobLabels[JobLabels.length] = pObj[i].description.replace(/\,/g," ")
			JobValues[JobValues.length] = setValue(pObj[i].JprfGrph)
			EmployeeValues[EmployeeValues.length] = setValue(pObj[i].EprfGrph)
		}
		Desc = BuildApplet(JobLabels,JobValues,EmployeeValues,335,300,Profile.MinGrph,Profile.MaxGrph,Tab)
	}
	return Desc;
}

function Profile_OnClick(Index, Tab, useDefault)
{
	AdditionalJobDetail_MyJobProfile_XIconClicked();
	JobDescription_MyJobProfile_XIconClicked();
	if (_CURRENTTAB == "INDIVIDUALPROFILE") 
	{
		ShowSelect(false, "main", "cmbDirectReports");
		hideLayer("main","InstructionsHeader_IndividualProfile");
	}
	if (_CURRENTTAB == "MYJOBPROFILE" || _CURRENTTAB == "INDIVIDUALPROFILE")
	{
		ShowInstructions_MyJobProfile(false);
		hideLayer("main","InstructionsHeader");
		hideLayer("main","InstructionsHeaderAlert");	
	}
	if (_CURRENTTAB.indexOf("EXPLORECAREERS") != -1)
		ShowExploreCareers(false);
	ShowCourses_MyJobProfile(true);
	ShowDetail_MyJobProfile(true);
	ReplaceWindowContent("main", "Courses_MyJobProfileWindow", "");
	ReplaceWindowContent("main", "Detail_MyJobProfileWindow", "");
	var type = "";
	var Profile = (useDefault)?StandardCareerProfile:CareerProfile;
	switch (Tab)
	{
		case 0: type = "Competency"; break;
		case 1: type = "Certifications"; break;
		case 2: type = "Education"; break;
	}
	QualificationClicked(Index, type, "Detail_MyJobProfile", "QualificationStuffDoneForMyJobProfile("+useDefault+","+Tab+","+Index+")", useDefault)
}

// Refresh data when a qualification link from the chart is clicked.
function JChart_OnClick(Index)
{
	var nextFunc = function()
	{
		if (Index.toString().indexOf("e") != -1)
		{
			EmployeeGapsClicked_GroupProfile(parseInt(Index.substring(Index.indexOf("e")+1),10));
			return; // Employee Gaps chart
		}
		// Pass the appropriate info to the profile onclick event function.
		if (_CURRENTTAB == "GROUPPROFILE")
			QualificationClicked_GroupProfile(_JCHARTTAB, Index);
		else
			Profile_OnClick(Index, _JCHARTTAB, _JCHARTUSEDEFAULT);
	};
	showWaitAlert(getSeaPhrase("CM_186","CM"), nextFunc);
}

function QualificationStuffDoneForMyJobProfile(useDefault, Tab, Index)
{
	var pObj;
	var Profile = (useDefault)?StandardCareerProfile:CareerProfile;
	switch (Tab)
	{
		case 0: pObj = Profile.CompetencyDetail[Index]; break;
		case 1: pObj = Profile.CertificationDetail[Index]; break;
		case 2: pObj = Profile.EducationDetail[Index]; break;
	}
	var HS50_3_Codes = new Array();
	HS50_3_Codes[0] = new Object();
	HS50_3_Codes[0].type = pObj.type;
	HS50_3_Codes[0].code = pObj.code;
	HS50_3_Codes[0].seqnbr = pObj.seqNbr;
	HS50_3_Codes[0].plevel = (pObj.empProfic != "") ? pObj.empProfic : null;
	// PT142651. Initialize TrainingCourses array.
	TrainingCourses = new Array();
	if (_DIRECTREPORTSINDEX >= 0 && DirectReports[_DIRECTREPORTSINDEX])
		Do_HS50_3_Call(HS50_3_Codes,"HS50.3",false, "JOBPROFILE", DirectReports[_DIRECTREPORTSINDEX].code)
	else
		Do_HS50_3_Call(HS50_3_Codes,"HS50.3",false, "JOBPROFILE", authUser.employee)
}

function Do_HS50_3_Call_JOBPROFILE_Finished(Index)
{
	// PT142651. If we need to perform a page down, make another AGS call to HS50.3.
	if (NonSpace(TrainingCourses.ptsort) > 0 || NonSpace(TrainingCourses.ptCourseDesc) > 0 || NonSpace(TrainingCourses.ptCourseNumber) > 0 || NonSpace(TrainingCourses.ptCourse) > 0 
	|| NonSpace(TrainingCourses.ptseqnbr) > 0)
	{			
		// Use the stored off global variables to perform a pagedown AGS call.
		Do_HS50_3_Call(HS50_3_Codes,"HS50.3",false,"JOBPROFILE",HS50_3_employee);
		return;	
	}	
	var arg = '';
	TrainingCourses = ParseOutTrainingCourses(TrainingCourses);
	if (TrainingCourses.length)
	{
		arg = '<table border="0" cellpadding="0" cellspacing="0" role="presentation">'
		for (var i=0; i<TrainingCourses.length; i++) 
		{
			var toolTip = TrainingCourses[i].Course.courseDescription+' - '+getSeaPhrase("CM_399","CM");
			arg += '<tr><td><a class="contenttextCM" href="javascript:;" onclick="parent.RepaintCourses_MyJobProfileLinks('+i+');parent.ShowJobProfileSessions('+i+');return false;"'
			arg += ' title="'+toolTip+'">'+TrainingCourses[i].Course.courseDescription+'<span class="offscreen"> - '+getSeaPhrase("CM_399","CM")+'</span></a><br/>'
		}
		arg += '</table>'	
		ReplaceWindowContent("main", "Courses_MyJobProfileWindow", arg);
	}
	else
	{
		arg = '<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td>'
		+ '<span class="contenttextCM">'+getSeaPhrase("CM_200","CM")+'</span></table>'
		ReplaceWindowContent("main", "Courses_MyJobProfileWindow", arg);
	}
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
}

function RepaintCourses_MyJobProfileLinks(Index)
{
	var arg = '<table border="0" cellpadding="0" cellspacing="0" role="presentation">'
	for (var i=0; i<TrainingCourses.length; i++)
	{
		var toolTip = TrainingCourses[i].Course.courseDescription+' - '+getSeaPhrase("CM_399","CM");
		arg += '<tr><td'
		if (typeof(Index) != "undefined" && Index != null && Index == i)
			arg += ' class="tablerowhighlightCM"'
		arg += '><a class="contenttextCM" href="javascript:;" onclick="parent.RepaintCourses_MyJobProfileLinks('+i+');parent.ShowJobProfileSessions('+i+');return false;"'
		arg += ' title="'+toolTip+'">'+TrainingCourses[i].Course.courseDescription+'<span class="offscreen"> - '+getSeaPhrase("CM_399","CM")+'</span></a><br/>'
	}
	arg += '</table>'	
	ReplaceWindowContent("main", "Courses_MyJobProfileWindow", arg);
}

function OnTabClicked_JobProfile_MyJobProfile(TabName)
{
	if (_CURRENTTAB.indexOf("EXPLORECAREERS")!=-1)
	{
		var Index = (_CURRENTTAB == "M_EXPLORECAREERS") ? 3 : 4;
		_REFRESHPROFILE = true;
		_REFRESHJOBLIST = false;
		switch (_EXPLORECURRENTWIN)
		{
			case "EXPLOREJOBTITLE": 
			if (!emssObjInstance.emssObj.filterSelect)
				_JOBCODEINDEX = GetSelectFormObject("main", "JobTitleSelect", "jobtitleselect").selectedIndex-1;
			break;
			case "EXPLORECATEGORY": 	
				if (!emssObjInstance.emssObj.filterSelect)
				{
					_JOBCATEGORYINDEX = GetSelectFormObject("main", "CategorySelect", "categoryselect").selectedIndex-1;	
					if (_CURRENTTAB == "M_EXPLORECAREERS")
						_JOBLISTINDEX = GetSelectFormObject("main", "JobTitleSelect", "jobtitleselect").selectedIndex-1;
				}
				// Set this if you'd like the Job List window to remain visible when the user clicks on a tab.
				//if (isVisible("main", "JobListLayer")) _REFRESHJOBLIST = true;
			break;
			case "EXPLOREQUALCRITERIA":
				 // Set this if you'd like the Job List window to remain visible when the user clicks on a tab.
				 //if (isVisible("main", "JobListLayer")) _REFRESHJOBLIST = true;
			break;
		}
		switch (TabName)
		{
			case "Competencies":
				_TABSELECTED = 0; 
				OpenProgram(Index, _TABSELECTED, 0);
				break;
			case "Certifications":
				_TABSELECTED = 1; 
				OpenProgram(Index, _TABSELECTED, 1);
				break;
			case "Education":
				_TABSELECTED = 2; 
				OpenProgram(Index, _TABSELECTED, 2);
				break;
		}		
	}
	else
	{
		var Index = (_CURRENTTAB == "INDIVIDUALPROFILE") ? 0 : 1;
		switch (TabName)
		{
			case "Competencies": 	
				if (_TABSELECTED != 0) 
				{
					_TABSELECTED = 0;
					OpenProgram(Index, 0);
				}	
				break;
			case "Certifications": 	
				if (_TABSELECTED != 1)
				{
					_TABSELECTED = 1;
					OpenProgram(Index, 1);
				}
				break;
			case "Education": 	
				if (_TABSELECTED != 2)
				{
					_TABSELECTED = 2;
					OpenProgram(Index, 2);
				}	
				break;
		}
	}
}

function PaintJobProfileInformation(Tab)
{
	var useDefault = (arguments.length<2)?true:false;
	DrawJobProfileTabs_MyJobProfile(true, Tab);	
	ReplaceWindowContent("main", "JobProfile_MyJobProfileWindow", GetProfileInformation(Tab,useDefault));
	// This is needed for the chart applet to display in Firefox on Mac OS for UI theme 9.
	var chartApplet = self.main.document.getElementById("cmChartApplet");	
	if (chartApplet)
	{	
		chartApplet.style.position = "relative";
		chartApplet.style.top = "0px";
		chartApplet.style.left = "0px";
	}
}

function AdditionalJobDetail_MyJobProfile_OnClick(useDefault)
{
	ShowJobDescription_MyJobProfile(false);
	ShowAdditionalJobDetail_MyJobProfile(true);
	ChangeTitle("main", "AdditionalJobDetail_MyJobProfile", '<span class="layertitleCM">'+getSeaPhrase("CM_201","CM")+'</span>');
	if (_CURRENTTAB == "INDIVIDUALPROFILE") 
	{
		ShowSelect(false, "main", "cmbDirectReports");
		hideLayer("main","InstructionsHeader_IndividualProfile");
	}
	if (_CURRENTTAB == "MYJOBPROFILE" || _CURRENTTAB == "INDIVIDUALPROFILE")
	{
		if (isVisible("main", "Courses_MyJobProfileLayer"))
			Courses_MyJobProfile_XIconClicked();
		ShowInstructions_MyJobProfile(false);
		hideLayer("main","InstructionsHeader");
		hideLayer("main","InstructionsHeaderAlert");		
	}	
	
	if (_CURRENTTAB.indexOf("EXPLORECAREERS") != -1)
		ShowExploreCareers(false);
	var Profile = (useDefault)?StandardCareerProfile:CareerProfile;
	if (typeof(JobDetail) == "undefined" || _CURRENTTAB == "INDIVIDUALPROFILE")
	{
		JobDetail = new JobDetailObject();
		var thisPosition = Profile.position;
		var thisJobcode = Profile.jobCode;
		if (!Profile.posDetailFlag || Profile.posDetailFlag == null) thisPosition = null;
		if (!Profile.jobDetailFlag || Profile.jobDetailFlag == null) thisJobcode = null;
		JobDetail.company = Profile.company;
		JobDetail.jobCode = Profile.jobCode;
		JobDetail.position = Profile.position;
		JobRelate_CareerManagement_ExploreCareersTab(thisPosition, thisJobcode);
	}	
	else
		ReplaceWindowContent("main", "AdditionalJobDetail_MyJobProfileWindow", JobDetailInformation(true));
}

function JobRelate_CareerManagement_ExploreCareersTab(thisposition, thisjobcode)
{
	var obj = new DMEObject(authUser.prodline, "jobrelate");
	obj.index = "jbrset1";
	obj.out = "JAVASCRIPT";
	obj.field = "type;pers-code;pers-code.description;required-flag;pct-of-time";
	obj.key = authUser.company+"";
	obj.max	= "600";
	obj.cond = "phys-mntl-wrk";
	if (typeof(thisposition) != "undefined" && thisposition != null && thisposition != "")
	{
		obj.select = "position="+thisposition;
		if (typeof(thisjobcode) != "undefined" && thisjobcode != null && thisjobcode != "")
			obj.select += "|job-code="+thisjobcode;
	}
	else if (typeof(thisjobcode) != "undefined" && thisjobcode != null && thisjobcode != "")
		obj.select = "job-code="+thisjobcode;
	obj.func = "PaintJobRelate_InProgress()" ;
	obj.debug = false;
	DME(obj,"jsreturn");
}

function PaintJobRelate_InProgress()
{
	var i = JobDetail.Detail.length;
	var noRec = self.jsreturn.NbrRecs;
	for (var j=0; j<noRec; i++,j++)
	{	
			
		var jobObj = self.jsreturn.record[j];	
		JobDetail.Detail[i] = new JobDetailDetailObject()
		JobDetail.Detail[i].type = jobObj.type
		JobDetail.Detail[i].persCode = jobObj.pers_code
		JobDetail.Detail[i].description = jobObj.pers_code_description
		JobDetail.Detail[i].requiredFlag = jobObj.required_flag
		JobDetail.Detail[i].pctOfTime = jobObj.pct_of_time  
	}
	if (self.jsreturn.Next != "")
		self.jsreturn.location.replace(self.jsreturn.Next);
	else
		ReplaceWindowContent("main", "AdditionalJobDetail_MyJobProfileWindow", JobDetailInformation(true)); 
}

function AdditionalJobDetail_MyJobProfile_XIconClicked()
{
	ShowAdditionalJobDetail_MyJobProfile(false);
	//ShowPrintJobDetailButton_MyJobProfile(false);
	if (_CURRENTTAB == "INDIVIDUALPROFILE")
	{
		if (!isVisible("main", "Courses_MyJobProfileLayer")) 
		{
			ShowSelect(true, "main", "cmbDirectReports")
			showLayer("main","InstructionsHeader_IndividualProfile");
		}
	}
	if (_CURRENTTAB == "MYJOBPROFILE" || _CURRENTTAB == "INDIVIDUALPROFILE")
	{
		if (!isVisible("main", "Courses_MyJobProfileLayer")) 
		{
			ShowInstructions_MyJobProfile(true);
			showLayer("main","InstructionsHeader");
			showLayer("main","InstructionsHeaderAlert");	
		}
	}	
	if (_CURRENTTAB.indexOf("EXPLORECAREERS") != -1)
	{
		ShowExploreCareers(true)
		if (_REFRESHJOBLIST)
		{
			ShowJobList_ExploreCareers(true);
			ShowCategorySelect_ExploreCareers(false);
			_REFRESHJOBLIST = false;
		}
	}
}

function JobDescription_MyJobProfile_XIconClicked()
{
	ShowJobDescription_MyJobProfile(false);

	if (_CURRENTTAB == "INDIVIDUALPROFILE")
	{
		if (!isVisible("main", "Courses_MyJobProfileLayer")) 
		{
			ShowSelect(true, "main", "cmbDirectReports")
			showLayer("main","InstructionsHeader_IndividualProfile");
		}
	}
	if (_CURRENTTAB == "MYJOBPROFILE" || _CURRENTTAB == "INDIVIDUALPROFILE")
	{
		if (!isVisible("main", "Courses_MyJobProfileLayer")) 
		{
			ShowInstructions_MyJobProfile(true)
			showLayer("main","InstructionsHeader");
			showLayer("main","InstructionsHeaderAlert");	
		}
	}	
	if (_CURRENTTAB.indexOf("EXPLORECAREERS") != -1)
	{
		ShowExploreCareers(true)
		if (_REFRESHJOBLIST)
		{
			ShowJobList_ExploreCareers(true);
			ShowCategorySelect_ExploreCareers(true);
			_REFRESHJOBLIST = false;
		}
	}
}

function Courses_MyJobProfile_XIconClicked()
{
	ShowCourses_MyJobProfile(false);
	ShowDetail_MyJobProfile(false);
	if (_CURRENTTAB == "INDIVIDUALPROFILE")
	{
		ShowSelect(true, "main", "cmbDirectReports")
		CourseDetail_MyJobProfile_XIconClicked()
		showLayer("main","InstructionsHeader_IndividualProfile");
	}
	if (_CURRENTTAB == "MYJOBPROFILE" || _CURRENTTAB == "INDIVIDUALPROFILE")
	{
		ShowInstructions_MyJobProfile(true)
		showLayer("main","InstructionsHeader");
		showLayer("main","InstructionsHeaderAlert");	
	}	
	if (_CURRENTTAB.indexOf("EXPLORECAREERS") != -1)
	{
		ShowExploreCareers(true);
		ShowCourseDetail(false, "MyJobProfile")
	}
}

// Not used. Printing an applet in a frame yields undesirable results.
function PrintProfile_MyJobProfile_OnClick()
{
	var Profile = (StandardCareerProfile.jbcDesc == null) ? CareerProfile : StandardCareerProfile;
	var pObj;
	if (typeof(Profile) == "undefined" || Profile == null) 
		return '';
	var nextFunc = function()
	{
		switch (Tab)
		{
			case 0:	pObj = Profile.CompetencyDetail; break;
			case 1:	pObj = Profile.CertificationDetail; break;
			case 2:	pObj = Profile.EducationDetail; break;
		}
		if (_CURRENTTAB.substring(0,2) == "M_" && !pObj.length) 
		{
			Desc = '<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td><span class="contenttextCM">'+getSeaPhrase("CM_179","CM")+'</span></td></tr></table>'
			return Desc;
		}
		else
		{
			var JobLabels = new Array(0);
			var JobValues = new Array(0);
			var EmployeeValues = new Array(0);
			for (var i=0; i<pObj.length; i++)
			{
				JobLabels[JobLabels.length] = pObj[i].description.replace(/\,/g," ")
				JobValues[JobValues.length] = setValue(pObj[i].JprfGrph)/10
				EmployeeValues[EmployeeValues.length] = setValue(pObj[i].EprfGrph)/10
			}
			Desc = BuildApplet(JobLabels, JobValues, EmployeeValues, 335, 300, Tab)
		}
		setWinTitle(getSeaPhrase("CM_128","CM"), self.PGCONTROL);
		self.PGCONTROL.document.getElementById("paneBody").innerHTML = Desc;
		self.PGCONTROL.stylePage();
		self.PGCONTROL.document.body.style.overflow = "visible";
		self.PGCONTROL.document.getElementById("paneBody").style.overflow = "visible";	
		self.PGCONTROL.document.getElementById("paneBorder").style.height = "auto";
		self.PGCONTROL.document.getElementById("paneBodyBorder").style.height = "auto";
		self.PGCONTROL.focus();
		self.PGCONTROL.print();
		removeWaitAlert();
	};
	showWaitAlert(getSeaPhrase("CM_202","CM"), nextFunc);
}

function PrintJobDetail_MyJobProfile_OnClick()
{
	var nextFunc = function()
	{
		var Desc = '<table border="0" cellspacing="0" cellpadding="0" summary="'+getSeaPhrase("TSUM_12","SEA")+'">';
		Desc += '<caption class="offscreen">'+getSeaPhrase("TCAP_9","SEA")+'</caption>';
		Desc += '<tr><th scope="col" colspan="2"></th></tr>'
		var JobDesc = '';
		var PosDesc = '';
		if (StandardCareerProfile.jbcDesc != null && StandardCareerProfile.jbcDesc != "")
			JobDesc = StandardCareerProfile.jbcDesc;
		else if (CareerProfile.jbcDesc != null && CareerProfile.jbcDesc != "")
			JobDesc = CareerProfile.jbcDesc
		else
			JobDesc = "";
		if (StandardCareerProfile.posDesc != null && StandardCareerProfile.posDesc != "")
			PosDesc = StandardCareerProfile.posDesc
		else if (CareerProfile.posDesc != null && CareerProfile.posDesc != "")
			PosDesc = CareerProfile.posDesc
		else
			PosDesc = "";
		if (_DIRECTREPORTSINDEX >=0 && DirectReports[_DIRECTREPORTSINDEX])
			Desc += '<tr><th scope="row"><span class="contentlabelCM">'+getSeaPhrase("CM_203","CM")+'</span></th><td><span class="contenttextCM">'+DirectReports[_DIRECTREPORTSINDEX].description+'</span></td></tr>'
		else
			Desc += '<tr><th scope="row"><span class="contentlabelCM">'+getSeaPhrase("CM_203","CM")+'</span></th><td><span class="contenttextCM">'+authUser.name+'</span></td></tr>'
		Desc += '<tr><th scope="row"><span class="contentlabelCM">'+getSeaPhrase("CM_204","CM")+'</span></th><td><span class="contenttextCM">'+JobDesc+'</span></td></tr>'
		Desc += '<tr><th scope="row"><span class="contentlabelCM">'+getSeaPhrase("CM_395","CM")+'</span></th><td><span class="contenttextCM">'+PosDesc+'</span></td></tr>'
		Desc += '</table>'
		Desc += JobDetailInformation(false);
		setWinTitle(getSeaPhrase("CM_201","CM"), self.PGCONTROL);
		self.PGCONTROL.document.getElementById("paneBody").innerHTML = Desc;
		self.PGCONTROL.stylePage();
		self.PGCONTROL.document.body.style.overflow = "visible";
		self.PGCONTROL.document.getElementById("paneBody").style.overflow = "visible";
		self.PGCONTROL.document.getElementById("paneBorder").style.height = "auto";
		self.PGCONTROL.document.getElementById("paneBodyBorder").style.height = "auto";	
		self.PGCONTROL.focus();
		self.PGCONTROL.print();
		removeWaitAlert();
	};
	showWaitAlert(getSeaPhrase("PREPARE_PRINT","SEA"), nextFunc);
}

function JobDescription_MyJobProfile_OnClick(useDefault)
{
	if (_CURRENTTAB == "INDIVIDUALPROFILE") 
	{
		ShowSelect(false, "main", "cmbDirectReports");
		hideLayer("main","InstructionsHeader_IndividualProfile");
	}
	if (_CURRENTTAB == "MYJOBPROFILE" || _CURRENTTAB == "INDIVIDUALPROFILE")
	{
		if (isVisible("main", "Courses_MyJobProfileLayer")) 
			Courses_MyJobProfile_XIconClicked();
		ShowInstructions_MyJobProfile(false)
		hideLayer("main","InstructionsHeader");
		hideLayer("main","InstructionsHeaderAlert");
	}
	if (_CURRENTTAB.indexOf("EXPLORECAREERS") != -1)
		ShowExploreCareers(false);
	ActionPlanAttachmentTitle = getSeaPhrase("CM_205","CM");
	if (_DIRECTREPORTSINDEX >= 0 && DirectReports[_DIRECTREPORTSINDEX])
		var employee = DirectReports[_DIRECTREPORTSINDEX].code;
	else
		var employee = authUser.employee;
	GetActionPlanAttachment("Draw_JobDescription", "D", authUser.company, employee, useDefault);
}

function Draw_JobDescription()
{	
	ShowJobDescription_MyJobProfile(true);
	ShowAdditionalJobDetail_MyJobProfile(false);
	var urlStr = "";
	var origUrlStr = "";
	var pFormObj = GetStansWindowLayer("main", "JobDescription_MyJobProfileWindow");
	if (self.jsreturn.UrlData.length)
	{					
		urlStr = self.jsreturn.UrlData[0].join("");
		origUrlStr = urlStr;
		// strip the leading slash if it exists
		if (origUrlStr.indexOf("/") == 0)
			origUrlStr = origUrlStr.substring(1);
	}
	// PT 139619: if this is a relative URL, try loading under the Portal directory and careermanagement directories
	if (urlStr && urlStr.indexOf(location.protocol) != 0 && isUrlRelative(urlStr))
	{
		urlStr = origUrlStr;
		// try loading the file under the Portal drill directory
		var portalPath = "/lawson/portal";
		try 
		{
			var tmpPath = profileHandler.portalWnd.lawsonPortal.path;
			if (tmpPath)
				portalPath = tmpPath;
		} catch(e) {}
		urlStr = location.protocol + "//" + location.host + portalPath + "/drill/" + encodeURLPart(urlStr);
		if (!fileExists(urlStr)) 
		{
			urlStr = origUrlStr; // reset the URL string
			// strip the leading slash if it exists
			if (urlStr.indexOf("/") == 0)
				urlStr = urlStr.substring(1);
			// try loading the file under the careermanagement directory
			var cmPath = "/lawson/xhrnet/careermanagement"
			urlStr = location.protocol + "//" + location.host + "/lawson/xhrnet/careermanagement/" + encodeURLPart(urlStr);
			// if all else fails, try loading the file from the WEBDIR
			if (!fileExists(urlStr)) 
			{
				urlStr = origUrlStr; // reset the URL string
				// strip the leading slash if it exists
				if (urlStr.indexOf("/") == 0)
					urlStr = urlStr.substring(1);
				urlStr = location.protocol + "//" + location.host + "/" + encodeURLPart(urlStr);
			}
		}
	}
	if (pFormObj.layers)
		pFormObj.load(unescape(urlStr), 350);
	else
	{
		var Desc = '<iframe id="jobdesc" name="jobdesc" title="'+getSeaPhrase("CM_204","CM")+'" level="3" tabindex="0" height="100%" width="100%" frameborder="0" src="'+urlStr+'"></iframe>';
		ReplaceWindowContent("main", "JobDescription_MyJobProfileWindow", Desc);
	}
	ChangeTitle("main", "JobDescription_MyJobProfile", '<span class="layertitleCM">'+getSeaPhrase("CM_205","CM")+"</span>");
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
}

function encodeURLPart(str)
{
	try
	{
		if (str && iosHandler.getEncoding())
		{
			str = str + "";
			if (str.indexOf("/") >= 0)
			{
				var urlParts = str.split("/");
				for (var i=0; i<urlParts.length; i++)
				{
					if (decodeURIComponent(urlParts[i]) == urlParts[i])	
						urlParts[i] = encodeURIComponent(urlParts[i]);					
				}
				str = urlParts.join("/");
			}
			else if (decodeURIComponent(str) == str)
				str = encodeURIComponent(str);		
		}		
	}
	catch(e) {}
	return str;
}

function isUrlRelative(urlStr) 
{
    var v = new RegExp();
    v.compile("^[A-Za-z]+:\/\/");
    if (v.test(urlStr))
        return false;
    return true;
} 

function fileExists(urlStr)
{        
	try 
	{	
		// what version of IOS do I call?
		if (iosHandler.getIOSVersion() != null) 
		{	
			var cntType = "text/xml";		
			try
			{
				if (iosHandler.getEncoding())
					cntType += "; charset=UTF-8";
			}	
			catch(e) {}
			// check for SSO
			if (iosHandler.isSSOFileLoaded()) 
			{			
				var urlRes = SSORequest(urlStr, null, cntType, "text/plain");
				if (urlRes == null)
					return false;
				return (!urlRes.status || urlRes.status == 200);
			} 
			else 
			{
				var urlRes = SEARequest(urlStr, null, cntType, "text/plain");
				return (!urlRes.status || urlRes.status == 200);
			}
		}
	} catch(e) {}
	return false;
}

// Not used.  Future enhancement.
function PrintJobDescription_MyJobProfile_OnClick()
{
	var pFormObj = GetStansWindowLayer("main", "JobDescription_MyJobProfileWindow");
	pFormObj.print();
}

function ShowJobProfileSessions(Index)
{
	//ShowPrintProfileButton_MyJobProfile(false);
	ShowJobDescriptionLink_MyJobProfile(false);
	ShowAdditionalJobDetailLink_MyJobProfile(false);
	ShowJobProfile_MyJobProfile(false) 
	ShowSessionsPreReq(Index, "MyJobProfile")
}

function CourseDetail_MyJobProfile_XIconClicked()
{
	ShowCourseDetail(false, "MyJobProfile");	
	ShowSubmitApplication(false, "MyJobProfile");
	ShowJobDescriptionLink_MyJobProfile(true);
	ShowAdditionalJobDetailLink_MyJobProfile(true);
	ShowJobProfile_MyJobProfile(true);
}

function SubmitApplication_MyJobProfile_OnClick()
{
	SubmitApplication_OnClick("MyJobProfile");
}

function OnTabClicked_CourseDetail_MyJobProfile(TabSelected)
{
	OnTabClicked_CourseDetail(TabSelected, "MyJobProfile");
}

function JobDetailInformation(notForPrint)
{
	var OrderOfExecutionOfType = new Array("EC", "EO", "MR", "PH", "SR", "TR");
	var OrderOfExecutionOfDescription = new Array(getSeaPhrase("CM_206","CM"), 
		getSeaPhrase("CM_207","CM"), getSeaPhrase("CM_208","CM"), getSeaPhrase("CM_209","CM"), 
		getSeaPhrase("CM_210","CM"), getSeaPhrase("CM_211","CM"));	
	var Desc = '<table border="0" cellpadding="3" cellspacing="0" summary="'+getSeaPhrase("TSUM_3","CM")+'">'
	+ '<caption class="offscreen">'+getSeaPhrase("TCAP_3","CM")+'</caption>'
	+ '<tr><th scope="col" class="contentlabelCM" style="width:130px">'+getSeaPhrase("CM_50","CM")+'</th>'
	+ '<th scope="col" class="contentlabelCM" style="width:70px">'+getSeaPhrase("CM_212","CM")+'</th>'
	+ '<th scope="col" class="contentlabelCM" style="width:70px">'+getSeaPhrase("CM_213","CM")+'</th></tr>'
	for (var i=0; i<OrderOfExecutionOfType.length;i++)
	{
		Desc += '<tr><td class="contentlabelCM" colspan="3">'+OrderOfExecutionOfDescription[i]+'</td></tr>'
		var FOUND = false;
		for (var j=0, k=0; j<JobDetail.Detail.length; j++)
		{
			if (JobDetail.Detail[j].type == OrderOfExecutionOfType[i])
			{
				FOUND = true;
				Desc += '<tr><td class="contenttextCM">'+JobDetail.Detail[j].description+'</td><td class="contenttextCM">'
				+ ((JobDetail.Detail[j].requiredFlag=="Y")?getSeaPhrase("CM_169","CM"):getSeaPhrase("CM_168","CM"))
				+ '</td><td class="contenttextCM">'+parseFloat(JobDetail.Detail[j].pctOfTime)+'</td></tr>'
			}
		}
		if (!FOUND)
			Desc += '<tr><td class="contenttextCM" colspan="3">'+getSeaPhrase("CM_214","CM")+'</td></tr>'
		FOUND = false;
	}
	if (notForPrint) 
	{
		Desc += '<tr><td colspan="3" style="white-space:nowrap">'
		+ uiButton(getSeaPhrase("CM_221","CM"),"parent.PrintJobDetail_MyJobProfile_OnClick();return false;")
		+ '</td></tr>'
	}
	Desc += '</table>'
	return Desc;
}

//////////////////////////////////////////////////////////////////////////////////////////
//								MAIN DRAWING TASKS										//
//////////////////////////////////////////////////////////////////////////////////////////

function DrawJobProfileTabs_MyJobProfile(rpFlag, TabSelected, Title)
{
	var isVisible = (arguments.length > 2)?arguments[2]:true;
	var WinTitle = (Title)?Title:getSeaPhrase("CM_156","CM");
	var TabsArray = new Array(
		new TabPane("Competencies", getSeaPhrase("CM_69","CM"), 110),
		new TabPane("Certifications", getSeaPhrase("CM_70","CM"), 110),
		new TabPane("Education", getSeaPhrase("CM_49","CM"), 110) 
	);
	var Tab = new TabObject(TabsArray, TabSelected, "JobProfile_MyJobProfile");
	Tab.Style(InnerTabBorderColor, InnerTabbgColorTabDown, InnerTabbgColorTabUp, InnerTabfgColorTabDown, InnerTabfgColorTabUp, InnerTabfontSize, InnerTabfontFamily, InnerTabfontWeight);
	var pObj = new CareerManagementWindowObject(Window2,"main", "JobProfile_MyJobProfile", 2,22,395,490, isVisible, WinTitle);
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.TabObject = Tab;
	if (rpFlag)	pObj.ReplaceFlag = true;
	pObj.DrawTabbed();
}

function DrawInstructionsManager_MyJobProfile(SelectValues)
{
	var pObj = new CareerManagementWindowObject(Window7,"main", "Instructions_MyJobProfile", 402,22,395,185, true, getSeaPhrase("CM_114","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.Draw();
	var Desc = '<label class="contenttextCM" for="cmbDirectReports">' + getSeaPhrase("CM_215","CM") + '</label>'
	createLayer("main","InstructionsHeader_IndividualProfile",410,55,380,50,true,Desc,"","",true);
	MakeSelectBox("DirectReports", 525, 80, 275, 30, "cmbDirectReports", SelectValues, true, _DIRECTREPORTSINDEX, true)
	Desc = '<span class="contenttextCM">'+getSeaPhrase("CM_216","CM")+'</span>'
	createLayer("main","InstructionsHeader",410,105,380,145,true,Desc,"","",true);
	createLayer("main","InstructionsHeaderAlert",410,165,380,145,true,"","","");
}

function DrawInstructions_MyJobProfile()
{
	var pObj = new CareerManagementWindowObject(Window7,"main", "Instructions_MyJobProfile", 402,22,395,185, true, getSeaPhrase("CM_114","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.Draw();
	Desc = '<span class="contenttextCM">'+getSeaPhrase("CM_216","CM")+'</span>'
	createLayer("main","InstructionsHeader",410,55,380,145,true,Desc,"","",true);
	Desc = '<span class="contenttextCM">'
	if (CareerProfile.jobCompFlag != "Y" && CareerProfile.empCompFlag != "Y")
		Desc += getSeaPhrase("CM_217","CM")
	else if (CareerProfile.jobCompFlag != "Y")
		Desc += getSeaPhrase("CM_218","CM")
	else if (CareerProfile.empCompFlag != "Y")
		Desc += getSeaPhrase("CM_219","CM")
	Desc += '</span>'
	createLayer("main","InstructionsHeaderAlert",410,150,380,145,true,Desc,"","");	
}

function DrawCourses_MyJobProfile()
{
	var pObj = new CareerManagementWindowObject(Window8,"main", "Courses_MyJobProfile", 402,22,395,250, false, getSeaPhrase("CM_194","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.AddCloseIcon = true;
	pObj.WindowColor = WindowColor
	pObj.CloseIconLocationLeft = pObj.Left + 365
	pObj.CloseIconLocationTop = pObj.Top + 5	
	pObj.Draw();
	pObj.DrawView(415,56,365,200);	
}

function DrawDetail_MyJobProfile()
{
	var pObj = new CareerManagementWindowObject(Window8,"main", "Detail_MyJobProfile", 402,264,395,250, false, getSeaPhrase("CM_220","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.Draw();
	pObj.DrawView(415,296,365,200);
}

function DrawAdditionalJobDetail_MyJobProfile()
{
	var pObj = new CareerManagementWindowObject(Window2,"main", "AdditionalJobDetail_MyJobProfile", 402, 22, 395, 490, false, getSeaPhrase("CM_201","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.AddCloseIcon = true;
	pObj.CloseIconLocationLeft = pObj.Left + 365
	pObj.CloseIconLocationTop = pObj.Top + 5
	pObj.Draw();
	pObj.DrawView(415, 55, 366, 405);	
}

function DrawJobDescription_MyJobProfile()
{
	var pObj = new CareerManagementWindowObject(Window2,"main", "JobDescription_MyJobProfile", 402, 22, 395, 490, false, getSeaPhrase("CM_205","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.AddCloseIcon = true;
	pObj.CloseIconLocationLeft = pObj.Left + 365
	pObj.CloseIconLocationTop = pObj.Top + 5
	pObj.Draw();
	pObj.DrawView(417, 54, 366, 436);	
}

function DrawJobProfile_MyJobProfile()
{
	var isVisible = (arguments.length > 0)?arguments[0]:true;
	var pObj = new CareerManagementWindowObject(Window2,"main", "JobProfile_MyJobProfile", 25,80,50,300, isVisible, getSeaPhrase("CM_220","CM"), false);
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	if (arguments.length>2)
		pObj.WindowInformation = GetProfileInformation(arguments[2]);
	else	
		pObj.WindowInformation = ""
	pObj.DrawView(25,100,355,355);
	//MakeButton("Print Profile", 25, 475, 100, 30, ButtonBorderColor, "PrintProfile_MyJobProfile", isVisible, "Print Employee Profile Information");
	var useDefault = (arguments.length > 1)?arguments[1]:true;
	var Profile = (useDefault)?StandardCareerProfile:CareerProfile;
	var Desc = ''
	if (typeof(Profile) == "undefined" || Profile == null || !Profile.jobDescFlag || Profile.jobDescFlag == null)
		Desc += '<span class="contenttextCM">'+getSeaPhrase("CM_205","CM")+'</span>'
	else
	{
		var toolTip = getSeaPhrase("CM_205","CM")+' - '+getSeaPhrase("CM_223","CM");
		Desc += '<a class="contenttextCM" href="javascript:;" onclick="parent.JobDescription_MyJobProfile_OnClick('+useDefault+');" title="'+toolTip+'">'+getSeaPhrase("CM_205","CM")+'<span class="offscreen"> - '+getSeaPhrase("CM_223","CM")+'</span></a>'
	}	
	createLayer("main","JobDescriptionLink_MyJobProfile",10,475,180,20,isVisible,Desc,"","");
	Desc = ''
	if (typeof(Profile) == "undefined" || Profile == null || ((!Profile.jobDetailFlag || Profile.jobDetailFlag == null) && (!Profile.posDetailFlag || Profile.posDetailFlag == null)))
		Desc += '<span class="contenttextCM">'+getSeaPhrase("CM_201","CM")+'</span>'
	else
	{
		var toolTip = getSeaPhrase("CM_201","CM")+' - '+getSeaPhrase("CM_224","CM");
		Desc += '<a class="contenttextCM" href="javascript:;" onclick="parent.AdditionalJobDetail_MyJobProfile_OnClick('+useDefault+');" title="'+toolTip+'">'+getSeaPhrase("CM_201","CM")+'<span class="offscreen"> - '+getSeaPhrase("CM_224","CM")+'</span></a>'
	}
	createLayer("main","AdditionalJobDetailLink_MyJobProfile",190,475,200,20,isVisible,Desc,"","");
}

function RefreshJobProfileLink_MyJobProfile()
{
	var Desc = ''
	if (!CareerProfile.jobDescFlag || CareerProfile.jobDescFlag == null)
		Desc += '<span class="contenttextCM">'+getSeaPhrase("CM_205","CM")+'</span>'
	else
	{
		var toolTip = getSeaPhrase("CM_205","CM")+' - '+getSeaPhrase("CM_223","CM");
		Desc += '<a class="contenttextCM" href="javascript:;" onclick="parent.JobDescription_MyJobProfile_OnClick('+false+');" title="'+toolTip+'">'+getSeaPhrase("CM_205","CM")+'<span class="offscreen"> - '+getSeaPhrase("CM_223","CM")+'</span></a>'
	}	
	replaceContent("main","JobDescriptionLink_MyJobProfile",Desc);
	Desc = ''
	if (((!CareerProfile.jobDetailFlag || CareerProfile.jobDetailFlag == null) && (!CareerProfile.posDetailFlag || CareerProfile.posDetailFlag == null)))
		Desc += '<span class="contenttextCM">'+getSeaPhrase("CM_201","CM")+'</span>'
	else
	{
		var toolTip = getSeaPhrase("CM_201","CM")+' - '+getSeaPhrase("CM_224","CM");
		Desc += '<a class="contenttextCM" href="javascript:;" onclick="parent.AdditionalJobDetail_MyJobProfile_OnClick('+false+');" title="'+toolTip+'">'+getSeaPhrase("CM_201","CM")+'<span class="offscreen"> - '+getSeaPhrase("CM_224","CM")+'</span></a>'
	}
	replaceContent("main","AdditionalJobDetailLink_MyJobProfile",Desc);
}

function ShowInstructions_MyJobProfile(nCmd)
{
	ShowWin(nCmd, "main", "Instructions_MyJobProfile", false, false, false);
}

function ShowCourses_MyJobProfile(nCmd)
{
	ShowWin(nCmd, "main", "Courses_MyJobProfile", true, true, false);
}

function ShowDetail_MyJobProfile(nCmd)
{
	ShowWin(nCmd, "main", "Detail_MyJobProfile", true, false, false);
}

function ShowAdditionalJobDetail_MyJobProfile(nCmd)
{
	ShowWin(nCmd, "main", "AdditionalJobDetail_MyJobProfile", true, true, false);
}

function ShowJobDescription_MyJobProfile(nCmd)
{
	ShowWin(nCmd, "main", "JobDescription_MyJobProfile", true, true, false);
}

function ShowJobProfile_MyJobProfile(nCmd)
{
	ShowWin(nCmd, "main", "JobProfile_MyJobProfile", true, false, true);
}

function ShowJobDescriptionButton_MyJobProfile(nCmd)
{
	ShowButton(nCmd, "main", "PrintJobDescription_MyJobProfile")
}

// Not used.  Printing an applet in a frame yields undesirable results.
function ShowPrintProfileButton_MyJobProfile(nCmd)
{
	ShowButton(nCmd, "main", "PrintProfile_MyJobProfile")
}

function ShowJobDescriptionLink_MyJobProfile(nCmd)
{
	if (nCmd)		
		showLayer("main", "JobDescriptionLink_MyJobProfile");
	else			
		hideLayer("main", "JobDescriptionLink_MyJobProfile");
}

function ShowAdditionalJobDetailLink_MyJobProfile(nCmd)
{
	if (nCmd)		
		showLayer("main", "AdditionalJobDetailLink_MyJobProfile");
	else			
		hideLayer("main", "AdditionalJobDetailLink_MyJobProfile");
}

function ShowInstructionsHeader_MyJobProfile(nCmd)
{
	if (nCmd)		
		showLayer("main", "InstructionsHeader_MyJobProfile");
	else			
		hideLayer("main", "InstructionsHeader_MyJobProfile");
}

function ShowInstructionsHeaderAlert_MyJobProfile(nCmd)
{
	if (nCmd)		
		showLayer("main", "InstructionsHeaderAlert_MyJobProfile");
	else			
		hideLayer("main", "InstructionsHeaderAlert_MyJobProfile");
}

/*
 *	Training Options Tab
 */
var _TRAINCURRENTWIN = "TRAININGCATEGORY";
var _COURSECATEGORYINDEX = -1;
var _TRAINJOBGAPSTAB = 0;
var GapObj = new Array();
var QualCriteria_TrainingOptions = new QualificationCriteriaSelectObject();
var TrainingCourses = new Array(0);

function OnTabClicked_Training(TabName /*, DoNotRedrawTabs*/)
{
	QualCriteria_TrainingOptions = new QualificationCriteriaSelectObject()
	switch (TabName)
	{
		case "Category":
			_TRAINCURRENTWIN = "TRAININGCATEGORY";
			break;
		case "QualificationCriteria":
		    _TRAINCURRENTWIN = "TRAININGQUALIFICATIONCRITERIA";
			break;
		case "ForJobGaps":
			_TRAINCURRENTWIN = "TRAININGJOBGAPS";
			if (arguments.length < 2) _TRAINJOBGAPSTAB = 0
			break;
	}
	if (emssObjInstance.emssObj.filterSelect)
	{
		ShowFilterList(false);
		closeDmeFieldFilter();
	}
	if (_CURRENTTAB == "M_TRAININGOPTIONS")
		OpenProgram(4);
	else
		OpenProgram(5);
}

//////////////////////////////////////////////////////////////////////////////////////////
//										Category Tab									//
//////////////////////////////////////////////////////////////////////////////////////////

function CreateCourseList_TrainingOptions2_OnClick()
{
	CreateCourseList_TrainingOptions_OnClick()
}

function CreateCourseList_TrainingOptions_OnClick()
{
	switch (_TRAINCURRENTWIN)
	{
		case "TRAININGCATEGORY":
			ShowCourseCategorySelect_TrainingOptions(true);
			SetupCourseListForCategoryTab_TrainingOptions();
			break;
		case "TRAININGQUALIFICATIONCRITERIA":
			SetupCourseListForQualificationTab_TrainingOptions();
			break;
		case "TRAININGJOBGAPS":
			break;
	}
}

function ShowCourseCategorySelect_TrainingOptions(nCmd)
{
	if (emssObjInstance.emssObj.filterSelect)
	{
		ShowTextBox(nCmd, "main", "CourseCategoryFilterSelect_TrainingOptions");
		ShowButton(nCmd, "main", "CourseCategoryFilterSelectArrow");
		if (nCmd)
			showLayer("main", "CourseCategoryFilterSelectDesc_TrainingOptions");
		else
			hideLayer("main", "CourseCategoryFilterSelectDesc_TrainingOptions");
	}
	else
		ShowSelect(nCmd, "main", "CourseCategorySelect_TrainingOptions");
}

function CourseCategoryFilterSelectArrow_OnClick()
{
	openDmeFieldFilter("course_category");
}

function SetupCourseListForCategoryTab_TrainingOptions()
{
	var pFormObj;
	var CourseSelected;
	if (emssObjInstance.emssObj.filterSelect)
	{
		pFormObj = GetTextBoxFormObject("main", "CourseCategoryFilterSelect", "CourseCategoryFilterSelect_TrainingOptions");
		CourseSelected = pFormObj.value;		
	}
	else
	{			
		pFormObj = GetSelectFormObject("main", "CourseCategorySelect", "CourseCategorySelect_TrainingOptions");
		CourseSelected = pFormObj.options[pFormObj.selectedIndex].value;
	}
	if (NonSpace(CourseSelected) == 0)
	{
		seaAlert(getSeaPhrase("CM_312","CM"), null, null, "error");
		return;
	}
	var CourseDesc = getSeaPhrase("CM_313","CM") + " - "
	if (emssObjInstance.emssObj.filterSelect)
	{
		var ccDescObj = getLayerDocument("main", "CourseCategoryFilterSelectDesc_TrainingOptions");
		var ccSpan = ccDescObj.getElementsByTagName("SPAN");
		if (ccSpan.length > 0)
			CourseDesc += ccSpan[0].innerHTML;
	}
	else
		CourseDesc += CourseCategories[pFormObj.selectedIndex-1].description;
	var CourseTitle = '<span class="layertitleCM">'+CourseDesc+"</span>"
	ChangeTitle("main", "Courses_TrainingOptions", CourseTitle)
	// PT142651. Initialize TrainingCourses array.
	TrainingCourses = new Array();
	var HS50_3_Codes = new Array();
	HS50_3_Codes[0] = new Object();
	HS50_3_Codes[0].type = "CC";
	HS50_3_Codes[0].code = CourseSelected;
	HS50_3_Codes[0].seqnbr = null;
	HS50_3_Codes[0].plevel = null;
	showWaitAlert(getSeaPhrase("CM_155","CM"), function(){Do_HS50_3_Call(HS50_3_Codes,"HS50.3",false,"TRAININGOPTIONS");});
}

function Do_HS50_3_Call_TRAININGOPTIONS_Finished()
{
	if (self.lawheader.gmsgnbr != "000")
	{
		removeWaitAlert();
		seaAlert(self.lawheader.gmsg, null, null, "error");
		return;
	}
	// PT142651. If we need to perform a page down, make another AGS call to HS50.3.
	if (NonSpace(TrainingCourses.ptsort) > 0 || NonSpace(TrainingCourses.ptCourseDesc) > 0  || NonSpace(TrainingCourses.ptCourseNumber) > 0 
	|| NonSpace(TrainingCourses.ptCourse) > 0 || NonSpace(TrainingCourses.ptseqnbr) > 0)
	{			
		// Use the stored off global variables to perform a pagedown AGS call.
		Do_HS50_3_Call(HS50_3_Codes,"HS50.3",false,"TRAININGOPTIONS",HS50_3_employee);
		return;	
	}
	ShowCourses_TrainingOptions(true)
	ShowTrainingOptions(false, "QualificationCriteria")
	ShowCourseCategorySelect_TrainingOptions(false);
	ShowTrainingQualCriteria_Instructions(false);
	hideLayer("main","InstructionsHeader_TrainingOptions");
	ShowForJobGapsInstructions_TrainingOptions(false);
	TrainingCourses = ParseOutTrainingCourses(TrainingCourses);
	if (TrainingCourses.length)
	{
		var arg = '<table border="0" cellspacing="0" cellpadding="0" role="presentation">'
		for (var i=0; i<TrainingCourses.length; i++)
		{
			var toolTip = TrainingCourses[i].Course.courseDescription+' - '+getSeaPhrase("CM_400","CM");
			arg += '<tr><td><a class="contenttextCM" href="javascript:;" onclick="parent.RepaintCourses_TrainingOptionsLinks('+i+');parent.ShowSessionsPreReq('+i+',\'TrainingOptions\');return false;"'
			arg += ' title="'+toolTip+'">'+TrainingCourses[i].Course.courseDescription+'<span class="offscreen"> - '+getSeaPhrase("CM_400","CM")+'</span></a></td></tr>'
		}
		arg += '</table>'
		ReplaceWindowContent("main", "Courses_TrainingOptionsWindow", arg);
	}
	else
	{
		if (_TRAINCURRENTWIN == "TRAININGQUALIFICATIONCRITERIA")
			var msg = '<table border="0" cellspacing="0" cellpadding="0" role="presentation"><tr><td><span class="contenttextCM">'+getSeaPhrase("CM_314","CM")+'</span></table>';
		else if (_TRAINCURRENTWIN == "TRAININGJOBGAPS")
			var msg = '<table border="0" cellspacing="0" cellpadding="0" role="presentation"><tr><td><span class="contenttextCM">'+getSeaPhrase("CM_315","CM")+'</span></table>';
		else // TRAINING CATEGORY
			var msg = '<table border="0" cellspacing="0" cellpadding="0" role="presentation"><tr><td><span class="contenttextCM">'+getSeaPhrase("CM_316","CM")+'</span></table>';
		ReplaceWindowContent("main", "Courses_TrainingOptionsWindow", msg);
	}
	removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
}

function RepaintCourses_TrainingOptionsLinks(Index)
{
	var nextFunc = function()
	{
		var arg = '<table border="0" cellpadding="0" cellspacing="0" role="presentation">'
		for (var i=0; i<TrainingCourses.length; i++)
		{
			var toolTip = TrainingCourses[i].Course.courseDescription+' - '+getSeaPhrase("CM_400","CM");
			arg += '<tr><td'
			if (typeof(Index) != "undefined" && Index != null && Index == i) 
				arg += ' class="tablerowhighlightCM"'
			arg += '><a class="contenttextCM" href="javascript:;" onclick="parent.RepaintCourses_TrainingOptionsLinks('+i+');parent.ShowSessionsPreReq('+i+', \'TrainingOptions\');return false;"'
			arg += ' title="'+toolTip+'">'+TrainingCourses[i].Course.courseDescription+'<span class="offscreen"> - '+getSeaPhrase("CM_400","CM")+'</span></a></td></tr>'
		}
		arg += '</table>'
		ReplaceWindowContent("main", "Courses_TrainingOptionsWindow", arg);
		removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
	};
	
}

function Courses_TrainingOptions_XIconClicked()
{
	ShowCourseDetail(false,"TrainingOptions")
	ShowCourses_TrainingOptions(false)
	switch (_TRAINCURRENTWIN)
	{
		case "TRAININGCATEGORY": OnTabClicked_Training("Category"); break;
		case "TRAININGQUALIFICATIONCRITERIA": OnTabClicked_Training("QualificationCriteria", true); break;
		case "TRAININGJOBGAPS":	OnTabClicked_Training("ForJobGaps",true); break;
	}
}

//////////////////////////////////////////////////////////////////////////////////////////
//									Qualification Criteria Tab							//
//////////////////////////////////////////////////////////////////////////////////////////

function SetupCourseListForQualificationTab_TrainingOptions()
{
	var HS50_3_Fields = new Array();
	for (var i=1; i<=QualCriteria_TrainingOptions.QualLabels.length; i++)
	{
		var QualBox = GetTextBoxFormObject("main", "TrainingQualCriteria"+i, "trainingqualcriteria"+i);
		var QualBoxType = QualCriteria_TrainingOptions.QualTypes[i-1];
		var QualBoxCode = QualCriteria_TrainingOptions.QualCodes[i-1];
		if (NonSpace(QualBox.value)!=0 && NonSpace(QualBoxType)!=0 && NonSpace(QualBoxCode)!=0)
		{
			// Use this criteria when making hs50.3 call to generate a course list.
			HS50_3_Fields[HS50_3_Fields.length] = new Object();
			HS50_3_Fields[HS50_3_Fields.length-1].type = QualBoxType;
			HS50_3_Fields[HS50_3_Fields.length-1].code = QualBoxCode;
			HS50_3_Fields[HS50_3_Fields.length-1].seqnbr = null;

		}
		if (NonSpace(QualBox.value)==0 && (NonSpace(QualBoxType)!=0 || NonSpace(QualBoxCode)!=0))
		{
			replaceContent("main", "TrainingQualCriteriaLabel"+i, "");
			QualCriteria_TrainingOptions.QualLabels[i-1] = "";
			QualCriteria_TrainingOptions.QualTypes[i-1] = "";
			QualCriteria_TrainingOptions.QualCodes[i-1] = "";
			QualCriteria_TrainingOptions.QualDescs[i-1] = "";
		}
	}
	if (HS50_3_Fields.length == 0)
	{
		seaAlert(getSeaPhrase("CM_317","CM"), null, null, "error");
		return;
	}
	else
		showWaitAlert(getSeaPhrase("CM_155","CM"), function(){Do_HS50_3_Call(HS50_3_Fields,"HS50.3",false,"TRAININGQUALCRITERIA");});
}

function Do_HS50_3_Call_TRAININGQUALCRITERIA_Finished()
{
	Do_HS50_3_Call_TRAININGOPTIONS_Finished();
}

//////////////////////////////////////////////////////////////////////////////////////////
//									For Job Gaps Tab									//
//////////////////////////////////////////////////////////////////////////////////////////

function GetJobGapQualifications_TrainingOptions(Tab)
{
	if ((_CURRENTTAB == "M_TRAININGOPTIONS") && (_DIRECTREPORTSINDEX < 0))
	{
		return '<table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr>'
		+ '<td><span class="contenttextCM">'+getSeaPhrase("CM_179","CM")+'</span></td></tr></table>'
	}
	var useDefault = (arguments.length<2)?false:true;
	var Profile = (useDefault)?StandardCareerProfile:CareerProfile;
	switch (Tab)
	{
		case 0:
			pObj = Profile.CompetencyDetail; break;
		case 1:
			pObj = Profile.CertificationDetail; break;
		case 2:
			pObj = Profile.EducationDetail; break;
	}

	// Filter the qualification list, displaying only the gap records.
	GapObj = new Array()
	for (var i=0; i<pObj.length; i++)
	{
		if (typeof(pObj[i].gap) != "undefined" && pObj[i].gap != null)
			GapObj[GapObj.length] = pObj[i]
	}
	var Desc = DrawGapListLinks(Tab,useDefault)
	return Desc
}

function DrawGapListLinks(Tab, useDefault, Index)
{
	var Desc = '<p><table border="0" cellpadding="0" cellspacing="0" role="presentation">'
	if (GapObj.length > 0)
	{
		for (var i=0; i<GapObj.length; i++)
		{
			var toolTip = GapObj[i].description+' - '+getSeaPhrase("CM_401","CM");
			Desc += '<tr><td'
			if (typeof(Index) != "undefined" && Index != null && Index == i) 
				Desc += ' class="tablerowhighlightCM"'
			Desc += '><a class="contenttextCM" href="javascript:parent.RepaintGapListLinks(\''+Tab+'\','+useDefault+','+i+');parent.Profile_TrainingOptions_OnClick('+i+','+Tab+','+useDefault+');"'
  			Desc += ' title="'+toolTip+'">'+GapObj[i].description+'<span class="offscreen"> - '+getSeaPhrase("CM_401","CM")+'</span></a></td></tr>'
		}
	}
	else
		Desc += '<tr><td><span class="contenttextCM">'+getSeaPhrase("CM_318","CM")+'</span></td></tr>'
	return Desc + '</table>';
}

function RepaintGapListLinks(Tab, useDefault, Index)
{
	var Desc = DrawGapListLinks(Tab, useDefault, Index)
	ReplaceWindowContent("main", "TrainingGaps_TrainingOptionsWindow", Desc);
}

function PaintTrainingJobGapInformation(Tab)
{
	var Desc = GetJobGapQualifications_TrainingOptions(Tab);
	DrawTrainingGapTabs(true, Tab);
	ReplaceWindowContent("main", "TrainingGaps_TrainingOptionsWindow", Desc);
}

function Profile_TrainingOptions_OnClick(Index, Tab, useDefault)
{
	var pObj;
	if (_CURRENTTAB == "M_TRAININGOPTIONS")
		ShowSelect(false, "main", "cmbDirectReports");
	var Profile = (useDefault)?StandardCareerProfile:CareerProfile;
	switch (Tab)
	{
		case 0: pObj = Profile.CompetencyDetail[Index]; break;
		case 1: pObj = Profile.CertificationDetail[Index]; break;
		case 2: pObj = Profile.EducationDetail[Index]; break;
	}
	if (_TRAINCURRENTWIN == "TRAININGJOBGAPS")
	{
		var CourseTitle = '<span class="layertitleCM">'
		+ getSeaPhrase("CM_313","CM")+" - "+GapObj[Index].description+"</span>"
		ChangeTitle("main", "Courses_TrainingOptions", CourseTitle)
		pObj = GapObj[Index];
	}
	var HS50_3_Codes 		= new Array();
	HS50_3_Codes[0] 		= new Object();
	HS50_3_Codes[0].type 	= pObj.type;
	HS50_3_Codes[0].code 	= pObj.code;
	HS50_3_Codes[0].seqnbr 	= pObj.seqNbr;
	HS50_3_Codes[0].plevel  = (pObj.empProfic != "") ? pObj.empProfic : null;
	Do_HS50_3_Call(HS50_3_Codes,"HS50.3",false,"TRAININGOPTIONS")
}

function OnTabClicked_TrainingGaps_TrainingOptions(TabName)
{
	switch (TabName)
	{
		case "Competencies":
			_TRAINJOBGAPSTAB = 0;
			DrawTrainingGapTabs(true, 0);
			PaintTrainingJobGapInformation(0);
			break;
		case "Certifications":
			_TRAINJOBGAPSTAB = 1;
			DrawTrainingGapTabs(true, 1);
			PaintTrainingJobGapInformation(1);
			break;
		case "Education":
			_TRAINJOBGAPSTAB = 2;
			DrawTrainingGapTabs(true, 2);
			PaintTrainingJobGapInformation(2)
			break;
	}
	TabsLoaded();
}

//////////////////////////////////////////////////////////////////////////////////////////
//								MAIN DRAWING TASKS										//
//////////////////////////////////////////////////////////////////////////////////////////

function DrawTrainingWindowsTabs(rpFlag, TabSelected, IsVisible)
{
	TabsTrainingArray = new Array(
		new TabPane("Category", getSeaPhrase("CM_171","CM"), 90),
		new TabPane("QualificationCriteria", getSeaPhrase("CM_172","CM"), 150),
		new TabPane("ForJobGaps", getSeaPhrase("CM_319","CM"), 110)
	);
	var Tab 				= new TabObject(TabsTrainingArray, TabSelected, "Training");
	Tab.Style(InnerTabBorderColor, InnerTabbgColorTabDown, InnerTabbgColorTabUp, InnerTabfgColorTabDown, InnerTabfgColorTabUp, InnerTabfontSize, InnerTabfontFamily, InnerTabfontWeight);
	var pObj = new CareerManagementWindowObject(Window2,"main", "Training", 402,22,392,490, IsVisible, getSeaPhrase("CM_159","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.TabObject = Tab;
	if (rpFlag)
		pObj.ReplaceFlag = true;
	pObj.DrawTabbed();
}

function DrawTrainingGapTabs(rpFlag, TabSelected, IsVisible)
{
	TabsTrainingGapsArray = new Array(
		new TabPane("Competencies", getSeaPhrase("CM_69","CM"), 110),
		new TabPane("Certifications", getSeaPhrase("CM_70","CM"), 110),
		new TabPane("Education", getSeaPhrase("CM_49","CM"), 110)
	);
	var Tab = new TabObject(TabsTrainingGapsArray, TabSelected, "TrainingGaps_TrainingOptions");
	Tab.Style(InnerTabBorderColor, InnerTabbgColorTabDown, InnerTabbgColorTabUp, InnerTabfgColorTabDown, InnerTabfgColorTabUp, InnerTabfontSize, InnerTabfontFamily, InnerTabfontWeight);
	var pObj = new CareerManagementWindowObject(Window2,"main", "TrainingGaps_TrainingOptions", 2,22,395,490, IsVisible, getSeaPhrase("CM_320","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.TabObject = Tab;
	if (rpFlag)
		pObj.ReplaceFlag = true;
	pObj.DrawTabbed();
}

function DrawInstructions_TrainingOptions(Manager)
{
	var pObj = new CareerManagementWindowObject(Window3,"main", "Instructions_TrainingOptions", 402,72,392,442, false, getSeaPhrase("CM_114","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.Draw();
	Desc = '<span class="contenttextCM">'+getSeaPhrase("CM_321","CM")+'</span>'
	createLayer("main","InstructionsHeader_TrainingOptions",450,190,300,100,false,Desc,"","");
	var toolTip;
	if (emssObjInstance.emssObj.filterSelect)
	{
		toolTip = dmeFieldToolTip("course_category");
		MakeTextBox("CourseCategoryFilterSelect", 510, 325, 105, 25, "CourseCategoryFilterSelect_TrainingOptions", false, 30, "", 'styler="select" styler_click="parent.CourseCategoryFilterSelectArrow_OnClick"', getSeaPhrase("CM_171","CM"));
		MakeButton('<img style="cursor:hand;cursor:pointer" border="0" src="/lawson/xhrnet/ui/images/ico_form_dropmenu.gif" alt="'+toolTip+'" title="'+toolTip+'">', 605, 325, 12, 16,
			WindowColor, "CourseCategoryFilterSelectArrow", false, getSeaPhrase("CM_185","CM"), true, 'styler="hidden"');
		var buttonObj = getLayerDocument("main", "CourseCategoryFilterSelectArrowButton");	
		if (buttonObj != null)
			buttonObj.setAttribute("styler", "hidden");		
		Desc = '<span id="CourseCategoryFilterSelectDesc" class="contenttextdisplayCM"></span>'
		createLayer("main","CourseCategoryFilterSelectDesc_TrainingOptions",622,325,150,30,false,Desc,"","");	
	}
	else
		MakeSelectBox("CourseCategorySelect", 510, 325, 300, 23, "CourseCategorySelect_TrainingOptions", CourseCategories, false, _COURSECATEGORYINDEX, true, getSeaPhrase("CM_171","CM"));	
	MakeButton(getSeaPhrase("CM_322","CM"), 510, 354, "auto", 30, ButtonBorderColor, "CreateCourseList_TrainingOptions", false);
	MakeButton(getSeaPhrase("CM_122","CM"), 610, 450, "auto", 30, ButtonBorderColor, "ClearForm_TrainingOptions", false);
	MakeButton(getSeaPhrase("CM_322","CM"), 415, 450, "auto", 30, ButtonBorderColor, "CreateCourseList_TrainingOptions2", false);
	Desc = '<span class="contenttextCM">'+getSeaPhrase("CM_323","CM")+'</span>'
	createLayer("main","TrainingQualCriteria_Instructions",450,140,300,100,false,Desc,"","");
	DrawQualificationSelectBoxes("TrainingQualCriteria",QualCriteria_TrainingOptions,false,238);
	if (Manager) 
	{
		MakeSelectBox("DirectReports", 525, 275, 275, 30, "cmbDirectReports", DirectReports, false, _DIRECTREPORTSINDEX, true, getSeaPhrase("CM_16","CM"))
		Desc = '<span class="contenttextCM">'+getSeaPhrase("CM_324","CM")+'</span>'
	} 
	else
		Desc = '<span class="contenttextCM">'+getSeaPhrase("CM_325","CM")+'</span>'
	createLayer("main","ForJobGapsInstructions_TrainingOptions",420,110,350,140,false,Desc,"","");
}

function ShowForJobGapsInstructions_TrainingOptions(nCmd)
{
	if (nCmd)
		showLayer("main", "ForJobGapsInstructions_TrainingOptions");
	else
		hideLayer("main", "ForJobGapsInstructions_TrainingOptions");
}

function DrawCourses_TrainingOptions()
{
	var pObj = new CareerManagementWindowObject(Window3,"main", "Courses_TrainingOptions", 402,72,392,442, false, getSeaPhrase("CM_313","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.AddCloseIcon = true;
	pObj.CloseIconLocationLeft = pObj.Left + 350
	pObj.CloseIconLocationTop = pObj.Top + 4
	pObj.Draw();
	pObj.DrawView(425,110,350,330);
}

function DrawTrainingGaps_TrainingOptions()
{
	var pObj = new CareerManagementWindowObject(Window2,"main", "TrainingGaps_TrainingOptions", 25,80,50,300, false, getSeaPhrase("CM_326","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.DrawView(25,80,355,375);
}

function DrawTrainingQualCriteriaTypeList()
{
	var pObj = new CareerManagementWindowObject(Window5,"main", "TrainingQualCriteriaTypeList", 450,100,288,120, false, getSeaPhrase("CM_187","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.AddCloseIcon = true;
	pObj.CloseIconLocationLeft = pObj.Left + 262;
	pObj.CloseIconLocationTop = pObj.Top + 6;
	pObj.Draw();
	pObj.DrawView(467, 130, 245, 70);
}

function DrawTrainingQualCriteriaCodeList()
{
	var pObj = new CareerManagementWindowObject(Window3,"main", "TrainingQualCriteriaCodeList", 402,71,392,442, false, getSeaPhrase("CM_174","CM"));
	pObj.FontStyle = 'color:'+TitleBarFgColor+';font-weight:bold;font-family:arial;font-size:'+TitleBarFontSize+';'
	pObj.WindowColor = WindowColor
	pObj.AddCloseIcon = true;
	pObj.CloseIconLocationLeft = pObj.Left + 350;
	pObj.CloseIconLocationTop = pObj.Top + 4;
	pObj.Draw();
	pObj.DrawView(416, 103, 360, 375);
	if (emssObjInstance.emssObj.filterSelect)
	{
		var filterList = document.getElementById("filterList");
		setHorizontalPos(filterList, "412px");
		filterList.style.top = "132px";	
		filterList.style.width = "380px";
		filterList.style.height = "370px";
	}	
}

function ShowTrainingOptions(nCmd, ShowForTabIndex)
{
	ShowWin(nCmd, "main", "Instructions_TrainingOptions");
	switch (ShowForTabIndex)
	{
		case "Category":
			if (nCmd)
				showLayer("main","InstructionsHeader_TrainingOptions");
			else
				hideLayer("main","InstructionsHeader_TrainingOptions");
			ShowCourseCategorySelect_TrainingOptions(nCmd);
			ShowButton(true, "main", "CreateCourseList_TrainingOptions");
			ShowButton(false, "main", "CreateCourseList_TrainingOptions2");
			ShowButton(false, "main", "ClearForm_TrainingOptions");
			break;
		case "QualificationCriteria":
			for (var j=1; j<=QualCriteria_TrainingOptions.QualLabels.length; j++)
			{
				if (nCmd)
					showLayer("main", "TrainingQualCriteriaLabel"+j)
				else
					hideLayer("main", "TrainingQualCriteriaLabel"+j)
				ShowTextBox(nCmd, "main", "trainingqualcriteria"+j);
				ShowButton(nCmd, "main", "TrainingQualCriteriaArrow"+j);
			}
			if (nCmd)
				showLayer("main", "TrainingQualCriteriaHeader");
			else
				hideLayer("main", "TrainingQualCriteriaHeader");
			ShowButton(false, "main", "CreateCourseList_TrainingOptions");
			ShowButton(nCmd, "main", "CreateCourseList_TrainingOptions2");
			ShowButton(nCmd, "main", "ClearForm_TrainingOptions");

			break;
		case "ForJobGaps":
			ShowForJobGapsInstructions_TrainingOptions(nCmd);
			if (getLayerDocument("main", "cmbDirectReportsSelect") != null)
				ShowSelect(nCmd, "main", "cmbDirectReports");
			ShowTrainingGaps_TrainingOptions(nCmd);
			ShowButton(false, "main", "CreateCourseList_TrainingOptions");
			ShowButton(false, "main", "CreateCourseList_TrainingOptions2");
			ShowButton(nCmd, "main", "CreateGapList_TrainingOptions");
			ShowButton(false, "main", "ClearForm_TrainingOptions");
			break;
	}
}

function ShowCreateCourseListButton_TrainingOptions(nCmd)
{
	ShowButton(nCmd, "main", "CreateCourseList_TrainingOptions");
}

function ShowCourses_TrainingOptions(nCmd)
{
	ShowWin(nCmd, "main", "Courses_TrainingOptions", true, true, false);
}

function ShowTrainingGaps_TrainingOptions(nCmd)
{
	if (_TRAINCURRENTWIN == "TRAININGJOBGAPS")
		ShowWin(nCmd, "main", "TrainingGaps_TrainingOptions", true, false, true);
}

function ShowTrainingQualCriteriaTypeList_TrainingOptions(nCmd)
{
	ShowWin(nCmd, "main", "TrainingQualCriteriaTypeList_TrainingOptions", true, false, false);
}

function ShowTrainingQualCriteriaCodeList_TrainingOptions(nCmd)
{
	ShowWin(nCmd, "main", "TrainingQualCriteriaCodeList_TrainingOptions", true, false, false);
}

function ClearForm_TrainingOptions_OnClick()
{
	var nextFunc = function()
	{
		for (var i=1; i<=QualCriteria_TrainingOptions.QualLabels.length; i++)
		{
			var QualBox = GetTextBoxFormObject("main", "TrainingQualCriteria"+i, "trainingqualcriteria"+i);
			QualBox.value = "";
			replaceContent("main", "TrainingQualCriteriaLabel"+i, "");
		}
		QualCriteria_TrainingOptions = new QualificationCriteriaSelectObject();
		removeWaitAlert(getSeaPhrase("CNT_UPD_FRM","SEA",[self.main.getWinTitle()]));
	};
	showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"), nextFunc);
}

function TrainingQualCriteriaArrow1_OnClick()
{
	QualCriteriaArrowClicked(1,"TrainingQualCriteria","CreateCourseList_TrainingOptions");
}

function TrainingQualCriteriaArrow2_OnClick()
{
	QualCriteriaArrowClicked(2,"TrainingQualCriteria","CreateCourseList_TrainingOptions");
}

function TrainingQualCriteriaArrow3_OnClick()
{
	QualCriteriaArrowClicked(3,"TrainingQualCriteria","CreateCourseList_TrainingOptions");
}

function TrainingQualCriteriaArrow4_OnClick()
{
	QualCriteriaArrowClicked(4,"TrainingQualCriteria","CreateCourseList_TrainingOptions");
}

function TrainingQualCriteriaArrow5_OnClick()
{
	QualCriteriaArrowClicked(5,"TrainingQualCriteria","CreateCourseList_TrainingOptions");
}

function TrainingQualCriteriaArrow6_OnClick()
{
	QualCriteriaArrowClicked(6,"TrainingQualCriteria","CreateCourseList_TrainingOptions");
}

function ShowQualCriteriaWin_TrainingOptions(nCmd, Name, Button)
{
	for (var j=1; j<=QualCriteria_TrainingOptions.QualLabels.length; j++)
	{
		if (nCmd)
			showLayer("main", Name+"Label"+j);
		else
			hideLayer("main", Name+"Label"+j);
		ShowTextBox(nCmd, "main", Name.toLowerCase()+j);
		ShowButton(nCmd, "main", Name+"Arrow"+j);
	}
    if (nCmd)
	{
	    showLayer("main", Name+"_Instructions");
		showLayer("main", Name+"Header");
	}
	else
	{
        hideLayer("main", Name+"_Instructions");
		hideLayer("main", Name+"Header");
	}
	ShowButton(false, "main", "CreateCourseList_TrainingOptions");
	ShowButton(true, "main", "CreateCourseList_TrainingOptions2");
	ShowButton(true, "main", "ClearForm_TrainingOptions");
	ShowWin(false, "main", Name+"CodeList", true, true);
	ShowWin(false, "main", Name+"TypeList", true, true);
}

function ShowTrainingQualCriteria_Instructions(nCmd)
{
	if (nCmd)
		showLayer("main", "TrainingQualCriteria_Instructions");
	else
		hideLayer("main", "TrainingQualCriteria_Instructions");
}

function ShowTrainingQualCriteriaInstructionsHeader_TrainingOptions(nCmd)
{
	if (nCmd)
		showLayer("main", "TrainingQualCriteriaInstructionsHeader_TrainingOptions");
	else
		hideLayer("main", "TrainingQualCriteriaInstructionsHeader_TrainingOptions");
}

function SubmitApplication_TrainingOptions_OnClick()
{
	SubmitApplication_OnClick("TrainingOptions")
}

function OnTabClicked_CourseDetail_TrainingOptions(TabSelected)
{
	OnTabClicked_CourseDetail(TabSelected, "TrainingOptions");
}

function CourseDetail_TrainingOptions_XIconClicked()
{
	if (_CURRENTTAB == "M_TRAININGOPTIONS")
		ShowCourseDetail_Manager(false, "TrainingOptions")
	else
		ShowCourseDetail(false,"TrainingOptions");
	ShowTrainingGaps_TrainingOptions(true)
}

function TrainingQualCriteriaCodeList_XIconClicked()
{
	ShowWin(false, "main", "TrainingQualCriteriaCodeList", true, true);
	ShowQualCriteriaWin_TrainingOptions(true, "TrainingQualCriteria", "CreateCourseList_TrainingOptions");
	hideLayer("main", "TrainingQualCriteria_Instructions");
	sendToBack("main", "TrainingQualCriteria_Instructions");
	ShowWin(true, "main", "TrainingQualCriteriaTypeList", true, true);
	showLayer("main", "Instructions_TrainingOptionsTitle");
	ShowButton(true, "main", "ClearForm_TrainingOptions");
	ShowButton(true, "main", "CreateCourseList_TrainingOptions2");	
	if (emssObjInstance.emssObj.filterSelect)
		ShowFilterList(false);
}

function TrainingQualCriteriaTypeList_XIconClicked()
{
	ShowWin(false, "main", "TrainingQualCriteriaTypeList", true, true);
	ShowQualCriteriaWin_TrainingOptions(true, "TrainingQualCriteria", "CreateCourseList_TrainingOptions");
}

function CourseCategorySelect_TrainingOptions_OnChange()
{
	_COURSECATEGORYINDEX = GetSelectFormObject("main", "CourseCategorySelect", "CourseCategorySelect_TrainingOptions").selectedIndex-1;
}
 
/*
 *	Java Chart Logic
 */
function BuildApplet(JobLabels, JobProficiency, EmployeeProficiency, Width, Height, Min, Max, Tab, DisableLinks)
{
	if (typeof(Max) == "undefined" || typeof(setValue(Max)) == "undefined" || isNaN(parseFloat(setValue(Max))) || parseFloat(setValue(Max))<=0)
		Max = 5;
	if (typeof(Min) == "undefined" || typeof(setValue(Min)) == "undefined" || isNaN(parseFloat(setValue(Min))))
		Min = 0;
	if ((JobProficiency.length == 0 && EmployeeProficiency.length == 0) || (NonSpace(JobProficiency.join("")) == 0 && NonSpace(EmployeeProficiency.join("")) == 0))
		return '';
	Width = (Width == null) ? 335 : Width;
	Height = (Height == null) ? 320 : Height;
	Desc = '<applet id="cmChartApplet" alt="Proficiency Applet" codebase="/lawson/java"'
	+ ' archive="jchart.jar" code="lawson.jchart.ChartApplet.class" width="'+Width+'" height="'+Height+'" title="'+getSeaPhrase("ACC_PRO","ESS")+'" aria-label="'+getSeaPhrase("ACC_PRO","ESS")+'">'
	+ '<param name="chartType" value="hoverbar"/>'
	+ '<param name="legendPosition" value="north"/>'
	// Not really necessary: the chart is not displaying the title.
//	switch(Tab)
//	{
//		case 0:	Desc += '<param name="chartTitle" value="Competency Profile"/>';break;
//		case 1:	Desc += '<param name="chartTitle" value="Certification Profile"/>';break;
//		case 2:	Desc += '<param name="chartTitle" value="Education Profile"/>';break;
//	}
	if (DisableLinks)
		Desc += '<param name="valueURL" value="/lawson/xhrnet/dot.htm">'
	else 
		Desc += '<param name="valueURL" value="/lawson/xhrnet/careermanagement/lib/chartdetail.htm">'
	Desc += '<param name="valueURLKeys" value="'
	for (var i=JobLabels.length-1; i>=0; i--)
	{
		if (Tab == -1)
			Desc += (i == JobLabels.length-1) ? 'e'+i : ',e'+i
		else
			Desc += (i == JobLabels.length-1) ? i : ','+i;
	}
	Desc += '"><param name="valueFrame" value="HIDDEN"/>'
	Desc += '<param name="3D" value="false"/>'
	Desc += '<param name="minValue" value="'+parseFloat(setValue(Min))+'"/>'
	Desc += '<param name="maxValue" value="'+parseFloat(setValue(Max))+'"/>'
	Desc += '<param name="maxLabel" value="'+parseFloat(setValue(Max))+'"/>'
	Desc += '<param name="mouseDrag" value="false"/>'
	Desc += '<param name="xLabel" value='+getSeaPhrase("CM_3","CM")+'/>'
	Desc += '<param name="showGrid" value="true"/>'
	Desc += '<param name="labelFont" value="Arial-9"/>'
	Desc += '<param name="leftMargin" value="20"/>'
	Desc += '<param name="scrollArrowColor" value="'
	Desc += ((ChartEmployeeDataColor.charAt(0)=="#")?ChartEmployeeDataColor.substring(1):ChartEmployeeDataColor)+'"/>'
	Desc += '<param name="requiredLabel" value="*"/>'
	Desc += '<param name="numberOfTicks" value="5"/>'
	Desc += '<param name="legendBgColor" value="'+WindowColor+'"/>'
	Desc += '<param name="componentBgColor" value="'+WindowColor+'"/>'	
	Desc += '<param name="chartBgColor" value="'+WindowColor+'"/>'
	Desc += '<param name="showXAxis" value="true"/>'
	Desc += '<param name="showYAxis" value="true"/>'
	Desc += '<param name="legendFont" value="Arial-bold-10"/>'
	Desc += '<param name="dataset0.name" value="Employee"/>'
	Desc += '<param name="dataset0.labels" value="'
	accessibleTableBuffer = new Array();
	accessibleTableBuffer[0] = '<table border="1" summary="'+getSeaPhrase("TSUM_4","CM")+'"><caption>'+getSeaPhrase("CM_405","CM")+'</caption><tr><th scope="col">'+getSeaPhrase("CM_134","CM")+'</th><th scope="col">'+getSeaPhrase("CM_406","CM")+'</th><th scope="col">'+getSeaPhrase("CM_407","CM")+'</th></tr>';
	for (var i=JobLabels.length-1; i>=0; i--) 
	{
		Desc += (i == JobLabels.length-1) ? JobLabels[i] : ','+JobLabels[i];
		var valueKey = (Tab == -1) ? '\'e'+i+'\'' : i;	
		var toolTip;
		var toolTipDtl;
		if (valueKey.toString().indexOf("e") != -1)
		{	
			toolTip = JobLabels[i];
			toolTipDtl = getSeaPhrase("CM_409","CM");
		}	
		// Pass the appropriate info to the profile onclick event function.
		if (_CURRENTTAB == "GROUPPROFILE")
		{	
			toolTip = JobLabels[i];
			toolTipDtl = getSeaPhrase("CM_410","CM");
		}	
		else
		{	
			toolTip = JobLabels[i];
			toolTipDtl = getSeaPhrase("CM_411","CM");		
		}	
		toolTip += ' - '+toolTipDtl;
		accessibleTableBuffer[accessibleTableBuffer.length] = '<tr><th scope="row"><a href="javascript:;" onclick="opener.JChart_OnClick('+valueKey+');return false" title="'+toolTip+'">'+JobLabels[i]+'<span class="offscreen"> - '+toolTipDtl+'</span></a></th><td style="text-align:right">'+EmployeeProficiency[i]+'</td><td style="text-align:right">'+JobProficiency[i]+'</td></tr>';
	}
	accessibleTableBuffer[accessibleTableBuffer.length] = '</table>'
	Desc += '"/><param name="dataset0.values" value="'
	for (var i=EmployeeProficiency.length-1; i>=0; i--)
		Desc += (i == EmployeeProficiency.length-1) ? EmployeeProficiency[i] : ','+EmployeeProficiency[i];
	Desc += '"/><param name="dataset0.globalValueColor" value="'
	Desc += ((ChartEmployeeDataColor.charAt(0)=="#")?ChartEmployeeDataColor.substring(1):ChartEmployeeDataColor)+'"/>'
	Desc += '<param name="dataset1.name" value="Job"/>'
	Desc += '<param name="dataset1.values" value="'
	for (var i=JobProficiency.length-1; i>=0; i--)
		Desc += (i == JobProficiency.length-1) ? JobProficiency[i] : ','+JobProficiency[i];
	Desc += '"/><param name="dataset1.globalValueColor" value="'
	Desc += ((ChartJobDataColor.charAt(0)=="#")?ChartJobDataColor.substring(1):ChartJobDataColor)+'"/>'
	Desc += '<param name="tipForMinusOne" value='+getSeaPhrase("CM_6","CM")+'/>'
	Desc += accessibleTableBuffer.join("")	
	Desc += '</applet>'	
	var titleLbl = getSeaPhrase("ACC_PRO","ESS")+' '+getSeaPhrase("OPENS_WIN","SEA");
	Desc += '<br/><a href="javascript:;" onclick="parent.openAccessibleAppletWindow();" title="'+titleLbl+'" aria-haspopup="true">'+getSeaPhrase("ACC_PRO","ESS")+'<span class="offscreen"> '+getSeaPhrase("OPENS_WIN","SEA")+'</span></a>'
	return Desc
}
