// Version: 8-)@(#)@10.00.02.00.29
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/careermanagement/Skins/October/Template.js,v 1.3.6.7 2012/06/29 17:24:25 brentd Exp $
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
//The following is a template skin for Career Management. The variables you see below aspects
//of the program that you can adjust to you're likeness. I have supplied comments next to each
//variable to better explain what element you are adjusting in the overall look and feel. 

var HeaderFgColor			= "#FFFFFF";	//Header portion of the program. Top portion. Text color.
var BodybgColor 			= "#F0BA02";	//Body of Application. Background Color	
var ButtonBorderColor 		= "#F8F2B4";	//Border Color for all Buttons in Application
var MainTabBorderColor 		= "#FFFFFF";	//Main Application Tab Border Color
var MainTabbgColorTabDown 	= "#F0BA02";	//Main Application Tab Background Color for when it is inactive
var MainTabbgColorTabUp 	= "#F8F2B4";	//Main Application Tab Background color for when active
var MainTabfgColorTabDown 	= "#FFFFFF";	//Main Application Tab Foreground color for when it is inactive
var MainTabfgColorTabUp 	= "#000000";	//Main Application Tab Foreground color for when it is active
var MainTabfontSize 		= "9pt";		//Main Tab Font size, represented in Points
var MainTabfontFamily 		= "arial";		//Main Tab Font face represented by short name
var MainTabfontWeight		= "bold";		//Main Tab Font style

var BackgroundColor			= "#F8F2B4"

//The Following are exactly like they are above, except these variables represent the 
//inner most Tabs which appear inside the Windows. 
var InnerTabBorderColor 	= "#000000";
var InnerTabbgColorTabDown 	= "#F0BA02";
var InnerTabbgColorTabUp 	= "#F8F2B4";
var InnerTabfgColorTabDown 	= "#FFFFFF";
var InnerTabfgColorTabUp 	= "#000000";
var InnerTabfontSize 		= "10pt";
var InnerTabfontFamily 		= "arial";
var InnerTabfontWeight		= "bold";

//Chart data colors
var ChartEmployeeDataColor	= "F0BA02";
var ChartJobDataColor		= "#000000";

//Windows Title Bar preferences
var TitleBarFgColor 		= "#000000";	//Text Color of the Title Bar
var TitleBarFontSize 		= "11pt";		//Text size of the title bar

var AlternateColor1 		= "#FEEBB2";
var AlternateColor2		= "#FEFBB2";

//NOTE: This setting has been moved to xhrnet/xml/config/emss_config.xml
//Change this value to represent the range of time you want the Qualification Alert box in the
//My Action Plan Tab to return. 
//var QUALIFICATIONEXPIRESIN 	= 90;			

//Change this to whatever animated company logo you might. This will change the icon in the 
//Progress Windows 
var AnimatedIcon		= "/lawson/xhrnet/images/wtanimate.gif";

//This variable defines where you have stored the standard template.
var WindowsDirectory 		= "/lawson/xhrnet/careermanagement/Skins/October/"
var HeaderIcon			= WindowsDirectory + "managerPict.gif"
var XIconOut			= WindowsDirectory + "xIcon.gif"	//Close Window icon
var XIconOver			= WindowsDirectory + "xIconOver.gif" //Close Window Icon
var XIconActive			= WindowsDirectory + "xIconOver.gif" //Close Window Icon

var ScrollDown 			= "/lawson/xhrnet/careermanagement/lib/images/scrolldown.gif"
var ScrollUp			= "/lawson/xhrnet/careermanagement/lib/images/scrollup.gif"
//var ScrollUp			= "/lawson/xhrnet/careermanagement/lib/scrollup.gif"
var ScrollBackground		= "/lawson/xhrnet/careermanagement/lib/images/scrollbackground.gif"

//{Please do not alter the lines below!!
	var Window1 = WindowsDirectory + "Window1.gif"
	var Window2 = WindowsDirectory + "Window2.gif"
	var Window3 = WindowsDirectory + "Window3.gif"
	var Window4 = WindowsDirectory + "Window4.gif"
	var Window5 = WindowsDirectory + "Window5.gif"
	var Window6 = WindowsDirectory + "Window6.gif"
	var Window7 = WindowsDirectory + "Window7.gif"
	var Window8 = WindowsDirectory + "Window8.gif"
	
	var WindowColor = "transparent"; 
//}
