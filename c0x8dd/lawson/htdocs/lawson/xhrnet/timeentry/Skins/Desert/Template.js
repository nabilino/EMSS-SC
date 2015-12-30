// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/timeentry/Skins/Desert/Template.js,v 1.5.2.12 2014/02/18 22:58:49 brentd Exp $
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
// Time Entry Styles and Graphics Definitions 
//
// The following program is to be used in order to create a custom look and feel for Time Entry.
// Images for all buttons and icons have been provided, plus the background color schemes and 
// some of the font style sheets used in the program. You may copy this sheet and alter it to 
// create a secondary style sheet and so on.  
//
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
//
// This style sheet doesn't allow to much flexibility in the look and feel however it does
// allow you to use the same graphics with a different color scheme or perhaps graphics that are
// the same size as the orignal graphics. Using graphics that do not fit in the framework may make
// Time Entry look weird. So please take caution as to what graphics you choose to use in this 
// program.
//
// There are two skins: Ocean and Desert.

////////////////////////////////////////////////////////////////////////////////////////////////
//Change these values to have them point to your graphics.
//
var Location = "/lawson/xhrnet/timeentry/Skins/Desert/images/";
var SelectionIcon = Location + "select.gif";
var SelectionIconOver = Location + "selectover.gif";
var PreviousIcon = Location + "left.gif";
var PreviousIconOver = Location + "leftover.gif";
var NextIcon = Location + "right.gif";
var NextIconOver = Location + "rightover.gif";
var DrillAroundIcon1 = Location + "detailred.gif";
var DrillAroundIcon2 = Location + "detailyellow.gif";
var DrillAroundIcon3 = Location + "detailgreen.gif";
var ExistingCommentsIcon = Location + "clipboard2.gif";
var ExistingCommentsOverIcon = Location + "clipboardover2.gif";
var NoCommentsIcon = Location + "clipboard.gif";
var NoCommentsOverIcon = Location + "clipboardover.gif";										
var SplitIcon = "/lawson/xhrnet/images/split1b.gif";
var SplitIcon2 = "/lawson/xhrnet/images/split2b.gif";
var ActivityDeleteIcon = "/lawson/xhrnet/images/delete2.gif";
var ActivityDeleteIconOver = "/lawson/xhrnet/images/delete2.gif";
var ActivityDeleteIconActive = "/lawson/xhrnet/images/delete2.gif";
var TimeEntrySplash	= "/lawson/xhrnet/timeentry/employee/timeentrysplash.htm";

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
//PLEASE DO NOT ALTER THE TEMPLATE BELOW THIS LINE.
//THESE ARE PROGRAM SPECIFIC VARIABLES. CHANGING THESE VALUES COULD CAUSE TIME ENTRY TO FAIL.
var TipsWindow;	//Window Handle for Tips Window
var EmployeeTemp; //Temporary Storage for Employee Object
var TimeCardTemp; //Temporary Storage for TimeCard object
var Employee; //Storage for Employee Object
var TimeCard; //Storage for TimeCard Object
var TimeOffWindow; //Window Handle for Time Off window.
var LockedOut = false //Flag to lock out entry
var QuickPaint = false;	//Flag to skip repainting form
var StaticRow = "";	//Form detail constant
var StyleSheet = ""; //Used if a stylesheet is defined. 
var Semaphore = false; //Keeps users from adding twice. 
var boolSaveChanges	= false; //Whether or not changes have been made to the form
var TimeCardCopy; //Copy Storage for Copying time cards
var LeaveBalances = "/lawson/xhrnet/leavebalancebegin.htm"; //Location of Leave Balances program

////////////////////////////////////////////////////////////////////////////////////////////////
//Preload the images
//
var SelectionIconImage = new Image();
SelectionIconImage.src = SelectionIcon;
var SelectionIconOverImage = new Image();
SelectionIconOverImage.src = SelectionIconOver;
var PreviousIconImage = new Image();
PreviousIconImage.src = PreviousIcon;
var PreviousIconOverImage = new Image();
PreviousIconOverImage.src = PreviousIconOver;
var NextIconImage = new Image();
NextIconImage.src = NextIcon;
var NextIconOverImage = new Image();
NextIconOverImage.src = NextIconOver;
var DrillAroundIcon1Image = new Image();
DrillAroundIcon1Image.src = DrillAroundIcon1;
var DrillAroundIcon2Image = new Image();
DrillAroundIcon2Image.src = DrillAroundIcon2;
var DrillAroundIcon3Image = new Image();
DrillAroundIcon3Image.src = DrillAroundIcon3;
var ExistingCommentsIconImage = new Image();
ExistingCommentsIconImage.src = ExistingCommentsIcon;
var ExistingCommentsOverIconImage = new Image();
ExistingCommentsOverIconImage.src = ExistingCommentsOverIcon;
var NoCommentsIconImage	= new Image();
NoCommentsIconImage.src = NoCommentsIcon;
var NoCommentsOverIconImage	= new Image();
NoCommentsOverIconImage.src	= NoCommentsOverIcon;
var SplitIconImage = new Image();
SplitIconImage.src = SplitIcon;
var SplitIcon2Image	= new Image();
SplitIcon2Image.src	= SplitIcon2;
var ActivityDeleteIconImage	= new Image();
ActivityDeleteIconImage.src	= ActivityDeleteIcon;
var TimeEntrySplashImage = new Image();
TimeEntrySplashImage.src = TimeEntrySplash;

////////////////////////////////////////////////////////////////////////////////////////////////
//Debug information. This is for testing purposes only.
//
var IgnorePeriodOutOfRangeAndLockOut = false;
//End of debug information.
