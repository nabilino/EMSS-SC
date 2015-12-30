// Version: 8-)@(#)@(201111) 09.00.01.06.00
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/timeentry/Skins/Ocean/Template.js,v 1.5.2.5 2010/01/11 19:05:11 brentd Exp $

////////////////////////////////////////////////////////////////////////////////////////////////
//
// Time Entry Stylesheet and graphics setup file. 
// Created 4/6/2000
// Author: Chris Klecker
// Company: Lawson Software
//

// Notes from the author.....

// The following program is to be used in order to create a custom look and feel for Time Entry.
// I have included all of the images: buttons, graphics, plus the background color schemes and 
// some of the font style sheets used in the program. You may copy this sheet and alter it to 
// create a secondary style sheet and so on.  

// These "skins" are stored in directories wherein lies all of the images used for the skin.
// In order to create a new Template, simply copy the whole directory and paste it under a 
// different name. Adjust the images to your liking and then link the new Template in the following
// programs:

// 		timeentry.htm
// 		manager.htm
// 		summaryapproval.htm
// 		printtime.htm
// 		missedtimecards.htm
// 		reporting.htm
// 		tips.htm
// 		exception.htm


// This style sheet doesn't allow to much flexibility in the look and feel however it does
// allow you to use the same graphics with a different color scheme or perhaps graphics that are
// the same size as the orignal graphics. Using graphics that do not fit in the framework may make
// Time Entry look weird. So please take caution as to what graphics you choose to use in this 
// program.

// EXAMPLE:
// Let's say for instance, you have another icon you wish to use to represent Tips called 'tipsX.gif'.
// This new gif is under the Ocean/images directory. Your new TipsIcon variable
// would then read,
//					var TipsIcon = Location + "tipsX.gif"
//
// Do not forget the rollover image for the icon. Let's say you called your rollover image tipsXover.gif,
//					var TipsIconOver = Location + "tipsXover.gif"
//
// If you do not have a rollover image then use the TipsIcon value for the TipsIconOver value
// For example
//					var TipsIconOver = Location + "tipsX.gif"
//
// Then on a rollover it will display the same graphic. 
//
// I have provided two skins: Ocean and Desert.

////////////////////////////////////////////////////////////////////////////////////////////////
//Change these values to have them point to your graphics.
//

var Location = "/lawson/xhrnet/timeentry/Skins/Ocean/images/";

var TipsIcon 			= Location + "tips.gif";
var TipsIconOver		= Location + "tipsover.gif";
var TimeOffIcon			= Location + "timeoff.gif";
var TimeOffIconOver		= Location + "timeoffover.gif";
var PreviousIcon		= Location + "left.gif";
var PreviousIconOver		= Location + "leftover.gif";
var SelectionIcon		= Location + "select.gif";
var SelectionIconOver		= Location + "selectover.gif";
var NextIcon			= Location + "right.gif";
var NextIconOver		= Location + "rightover.gif";
var ExistingCommentsIcon	= Location + "clipboard2.gif";
var ExistingCommentsOverIcon	= Location + "clipboardover2.gif";
var NoCommentsIcon		= Location + "clipboard.gif";
var NoCommentsOverIcon		= Location + "clipboardover.gif";
var DrillAroundIcon1		= Location + "detailred.gif";
var DrillAroundIcon2		= Location + "detailyellow.gif";
var DrillAroundIcon3		= Location + "detailgreen.gif";	
var CheckIcon			= "/lawson/xhrnet/images/redcheck.gif";					
var BlankIcon			= "/lawson/xhrnet/images/blank.gif";						
var SplitIcon			= "/lawson/xhrnet/images/split1b.gif";
var SplitIcon2			= "/lawson/xhrnet/images/split2b.gif";
var AnimatedIcon		= "/lawson/xhrnet/images/wtanimate.gif";
var ActivityDeleteIcon		= "/lawson/xhrnet/images/delete2.gif";
var TimeEntrySplash		= "/lawson/xhrnet/timeentry/employee/timeentrysplash.htm";


////////////////////////////////////////////////////////////////////////////////////////////////
//Change these images change the look and feel. These images are for rounding of the corners.
//

var HeaderRoundedCorner		= Location + "HeaderRoundedCorner.gif";
var DateRoundedCorner 		= Location + "DateRoundedCorner.gif";
var DateRoundedCornerRight	= Location + "DateRoundedCornerRight.gif";
var BottomRoundedCorner		= Location + "BottomRoundedCorner.gif";
var SaveChangesHeader		= Location + "savechangesheader.gif";
var PrintHeader			= Location + "PrintTimeHeader.gif";
var SelectGroupTitle		= Location + "selectgrouptitle.gif";
var SelectEmployeeTitle		= Location + "selectemployeetitle.gif";
var BottomRoundedCorner		= Location + "BottomRoundedCorner.gif";


////////////////////////////////////////////////////////////////////////////////////////////////
//Change these images to give yourself a different style of buttons. All of the buttons used
//in this program are defined here with their rollover images.
//

var UpdateTimeCardOverButton= Location + "updateover.gif";
var UpdateTimeCardButton		= Location + "update.gif";
var QuitOverButton			= Location + "quitover.gif";
var QuitButton				= Location + "quit.gif";
var ApproveAllOverButton		= Location + "approveallover.gif";
var ApproveAllButton			= Location + "approveall.gif";
var YesOverButton			= Location + "yesover.gif";
var YesButton				= Location + "yes.gif";
var NoOverButton			= Location + "noover.gif";
var NoButton				= Location + "no.gif";
var CancelOverButton			= Location + "cancelover.gif";
var CancelButton			= Location + "cancel.gif";
var SubmitOverButton			= Location + "submitover.gif";
var SubmitButton			= Location + "submit.gif";
var DeleteRowOverButton			= Location + "deleterowover.gif";
var DeleteRowButton			= Location + "deleterow.gif";
var PrintOverButton			= Location + "printover.gif";
var PrintButton				= Location + "print.gif";
var CopyOverButton			= Location + "copyover.gif";
var CopyButton				= Location + "copy.gif";
var PasteOverButton			= Location + "pasteover.gif";
var PasteButton				= Location + "paste.gif";
var QuitOverButton			= Location + "quitover.gif";
var QuitButton				= Location + "quit.gif";
var BackToPeriodOverButton		= Location + "periodviewover.gif";
var BackToPeriodButton			= Location + "periodview.gif";
var BackToListOverButton		= Location + "backtolistover.gif";
var BackToListButton			= Location + "backtolist.gif";
var BackToSummaryOverButton		= Location + "backtosummaryover.gif";
var BackToSummaryButton			= Location + "backtosummary.gif";
var UpdateNormOverButton 		= Location + "updatenormover.gif";
var UpdateNormButton			= Location + "updatenorm.gif";
var DeleteOverButton			= Location + "deleteover.gif";
var DeleteButton			= Location + "delete.gif";
var ClearOverButton			= Location + "clearover.gif";
var ClearButton				= Location + "clear.gif";
var PrintOverButton			= Location + "printover.gif";
var PrintButton				= Location + "print.gif";
var ContinueOverButton			= Location + "continueover.gif";
var ContinueButton			= Location + "continue.gif";
var ClearFormOverButton			= Location + "clearformover.gif";
var ClearFormButton			= Location + "clearform.gif";
var BackButton				= Location + "back.gif"
var BackOverButton			= Location + "backover.gif"

////////////////////////////////////////////////////////////////////////////////////////////////
//Coloring Information
//

var BackgroundColor				= "#CAE1FF";
var HeaderAndFooterBackgroundColor 		= "#6E7B8B";
var DateBackgroundColor 			= "#A2B5CD";
var MidtoneColor				= "#BCD2EE";


////////////////////////////////////////////////////////////////////////////////////////////////
//Font Information
//

var HeaderFontStyle 				= "font-family:arial;font-size:9pt;color:white;font-weight:bold;";
var DateFontStyle				= "font-family:arial;font-size:10pt;font-weight:bold;color:#000000;";
var StatusMessageFontStyle			= "font-family:arial;font-size:10pt;color:#000000;font-weight:bold;";
var TotalHoursFontStyle				= "font-size:12pt;font-family:arial;font-weight:bold;color:#000000;";
var ReportsFontStyle				= "color:white;font-size:8pt;font-weight:bold;font-family:arial;";
var StatusFontStyle				= "font-size:10pt;color:black;font-weight:bold;font-family:arial;";
var ManagerSelectWindow				= "font-size:10pt;font-family:arial;font-weight:bold;color:black;";
var ManagerSelectWindowLargeFont		= "font-size:12pt;font-family:arial;font-weight:bold;color:black;";
var SelectBoxLink				= "font-size:10pt;font-family:arial;color:#6E7B8B;font-weight:bold;"

////////////////////////////////////////////////////////////////////////////////////////////////
//Misc Data related information. Toggle these variables to your liking
//

/* NOTE: These settings have been moved to the xhrnet/xml/config/emss_config.xml file.	
var NumberofDetailLinesInDaily 			= 10;
var PromptFor24HourEditInPeriod			= true;
var PromptFor24HourEditInDaily			= true;
var SendEmailWhenEmployeeSubmitsTimeCard 	= false;
var SendEmailWhenManagerChangesTimeCard		= true;
var SendEmailWhenManagerRejectsTimeCard		= true;
var SendEmailWhenManagerApprovesTimeCard	= false;
var PostOrGlOnly 				= true;
*/
	
////////////////////////////////////////////////////////////////////////////////////////////////
//Comments Window. Change these items to change the look and feel of the Comments Window. The
//buttons for this window are defined above.
//
	
var HeaderTitle 				= Location + "comments.gif";
var CommentsBackgroundColor 			= BackgroundColor
var CommentsHeaderandFooterBackgroundColor 	= HeaderAndFooterBackgroundColor
var CommentsHeaderFontStyle			= "color:white;font-family:arial;";


////////////////////////////////////////////////////////////////////////////////////////////////
//Calendar Window. Change these items to change the look and feel of the Calendar Window. 
//

var CalendarHeaderRoundedCorner			= Location + "CalendarHeaderRoundedCorner.gif";
var CalendarBackgroundColor 			= BackgroundColor;
var CalendarHeaderandFooterBackgroundColor 	= HeaderAndFooterBackgroundColor;
var CalendarDaysBackgroundColor			= MidtoneColor;
var CalendarDaysHighlightedBackgroundColor  	= DateBackgroundColor;
var CalendarHeaderFontStyle			= "font-family:arial;font-size:14pt;font-weight:bold;color:white;";
var CalendarDaysFontStyle			= "font-size:12pt;font-weight:bold;font-family:arial;color:black;";
var CalendarHeaderDaysFontStyle			= "font-size:14pt;font-weight:bold;font-family:arial;color:black;";

////////////////////////////////////////////////////////////////////////////////////////////////
//Email Window. Change these items to change the look and feel of the Email Window. 
//

var EmailBackgroundColor 			= "#D3D3D3";
var EmailHeaderAndFooterBackgroundColor 	= "#778899";
var EmailHeaderAndFooterFontStyle 		= "color:white;font-family:arial;";
var EmailHeaderRoundedCorner 			= Location + "roundborder.gif";
var EmailFooterRoundedCorner 			= Location + "roundborder2.gif";

////////////////////////////////////////////////////////////////////////////////////////////////
//Time Entry Reporting. Change these to change the look and feel of Time Entry Reporting.  
//

var WhichTypeOfReport = Location + "whichtypeofreport.gif";
var EnterPayPeriod = Location + "enterpayperiod.gif";
var EmployeesToIncludeInReport = Location + "employeestoincludeinreport.gif";
var StatusesToIncludeInReport = Location + "statusestoincludeinreport.gif";

////////////////////////////////////////////////////////////////////////////////////////////////
//PLEASE DO NOT ALTER THE TEMPLATE FROM THIS POINT!!!!!!!!!!
//THESE ARE PROGRAM SPECIFIC VARIABLES. CHANGING THESE VALUES COULD CAUSE TIME ENTRY TO FAIL!

var TipsWindow;					//Window Handle for Tips Window
var EmployeeTemp; 				//Temporary Storage for Employee Object
var TimeCardTemp;				//Temporary Storage for TimeCard object
var Employee;					//Storage for Employee Object
var TimeCard;					//Storage for TimeCard Object
var TimeOffWindow;				//Window Handle for Time Off window.
var LockedOut 		= false			//Flag to lock out entry
var QuickPaint		= false;		//Flag to skip repainting form
var StaticRow		= "";			//Form detail constant
var StyleSheet		= "";			//Used if a style were used. 
var Semaphore 		= false;		//Keeps users from adding twice. 
var boolSaveChanges	= false;		//whether or not changes have been made to the form
var TimeCardCopy;				//Copy Storage for Copying time cards
var LeaveBalances 	= "/lawson/xhrnet/leavebalancebegin.htm"; //Location of Leave Balances program

////////////////////////////////////////////////////////////////////////////////////////////////
//Preload the images
//

var PreviousIconImage				= new Image();
PreviousIconImage.src				= PreviousIcon;

var PreviousIconOverImage			= new Image();
PreviousIconOverImage.src 			= PreviousIconOver;

var SelectionIconImage				= new Image();
SelectionIconImage.src 				= SelectionIcon;

var SelectionIconOverImage			= new Image();
SelectionIconOverImage.src 			= SelectionIconOver;

var NextIconImage				= new Image();
NextIconImage.src				= NextIcon;

var NextIconOverImage				= new Image();
NextIconOverImage.src				= NextIconOver;

var ExistingCommentsIconImage			= new Image();
ExistingCommentsIconImage.src			= ExistingCommentsIcon;

var ExistingCommentsOverIconImage		= new Image();
ExistingCommentsOverIconImage.src		= ExistingCommentsOverIcon;

var NoCommentsIconImage				= new Image();
NoCommentsIconImage.src				= NoCommentsIcon;

var NoCommentsOverIconImage			= new Image();
NoCommentsOverIconImage.src			= NoCommentsOverIcon;

var DrillAroundIcon1Image			= new Image();
DrillAroundIcon1Image.src			= DrillAroundIcon1;

var DrillAroundIcon2Image			= new Image();
DrillAroundIcon2Image.src			= DrillAroundIcon2;

var DrillAroundIcon3Image			= new Image();
DrillAroundIcon3Image.src			= DrillAroundIcon3;

var CheckIconImage				= new Image();
CheckIconImage.src				= CheckIcon;

var BlankIconImage				= new Image();
BlankIconImage.src				= BlankIcon;

var SplitIconImage				= new Image();
SplitIconImage.src				= SplitIcon;

var SplitIcon2Image				= new Image();
SplitIcon2Image.src				= SplitIcon2;

var AnimatedIconImage				= new Image();
AnimatedIconImage.src				= AnimatedIcon;

var TimeOffIconImage				= new Image();
TimeOffIconImage.src				= TimeOffIcon;

var TimeOffIconOverImage			= new Image();
TimeOffIconOverImage.src			= TimeOffIconOver;

var ActivityDeleteIconImage			= new Image();
ActivityDeleteIconImage.src			= ActivityDeleteIcon;

var TimeEntrySplashImage			= new Image();
TimeEntrySplashImage.src			= TimeEntrySplash;


////////////////////////////////////////////////////////////////////////////////////////////////
//Debug Information. This is for testing purposes only!!!
//

var TurnOnLineFc 				= "hidden"; //switch to "text" to show. "hidden" to hide
var TurnOnCoordinates 				= "hidden"; //switch to "text" to show. "hidden" to hide
var IgnorePeriodOutOfRangeAndLockOut= false;

//END!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
