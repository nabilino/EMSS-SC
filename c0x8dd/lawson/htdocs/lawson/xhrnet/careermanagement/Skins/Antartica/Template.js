// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/careermanagement/Skins/Antartica/Template.js,v 1.5.2.12 2014/02/21 22:52:18 brentd Exp $
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
//The following is a template skin for Career Management. The variables below can be adjusted to your likeness.
//Comments next to each variable better explain the element in the UI.
var HeaderFgColor = "#000000";			//Header portion of the program. Text Color.
var BodybgColor = "#848B83";			//Body of Application. Background Color.	
var ButtonBorderColor = "#848B83";		//Border Color for all Buttons in Application
var MainTabBorderColor = "#000000";		//Main Application Tab Border Color
var MainTabbgColorTabDown = "#C2CCC3";	//Main Application Tab Background Color for when it is inactive
var MainTabbgColorTabUp = "#E0EEDD";	//Main Application Tab Background color for when active
var MainTabfgColorTabDown = "#848B83";	//Main Application Tab Foreground color for when it is inactive
var MainTabfgColorTabUp = "#000000";	//Main Application Tab Foreground color for when it is active
var MainTabfontSize = "9pt";			//Main Tab Font size, represented in Points
var MainTabfontFamily = "arial";		//Main Tab Font face represented by short name
var MainTabfontWeight = "bold";			//Main Tab Font style
var BackgroundColor = "#E0EEDD";

//These variables define style attributes for the innermost tabs which appear inside the Windows. 
var InnerTabBorderColor = "#000000";
var InnerTabbgColorTabDown = "#C2CCC3";
var InnerTabbgColorTabUp = "#FFFFF0";
var InnerTabfgColorTabDown = "#848B83";
var InnerTabfgColorTabUp = "#000000";
var InnerTabfontSize = "10pt";
var InnerTabfontFamily = "arial";
var InnerTabfontWeight = "bold";

//Chart data colors
var ChartEmployeeDataColor = "#C2CCC3";
var ChartJobDataColor = "#000000";

//Windows Title Bar preferences
var TitleBarFgColor = "#000000"; 	//Text Color of the Title Bar
var TitleBarFontSize = "11pt"; 		//Text size of the title bar

var AlternateColor1 = "#FFFFF0";
var AlternateColor2 = "#C2CCC3";	//Used for highlighting

//NOTE: This setting has been moved to xhrnet/xml/config/emss_config.xml
//Change this value to represent the range of time you want the Qualification Alert box in the My Action Plan Tab to return. 
//var QUALIFICATIONEXPIRESIN = 90;			

//PLEASE DO NOT ALTER THE LINES BELOW!!
var WindowsDirectory = "/lawson/xhrnet/careermanagement/Skins/Antartica/";
var XIconOut = WindowsDirectory + "xIcon.gif";	//Close Window icon
var XIconOver = WindowsDirectory + "xIconOver.gif"; //Close Window Icon
var XIconActive = WindowsDirectory + "xIconOver.gif"; //Close Window Icon
var Window1 = null;
var Window2 = null;
var Window3 = null;
var Window4 = null;
var Window5 = null;
var Window6 = null;
var Window7 = null;
var Window8 = null;
var WindowColor = "transparent";
