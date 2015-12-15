/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/globals.js,v 1.25.2.8.4.15.6.5.2.3 2012/08/08 12:37:20 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@3.0.7.5 */
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

// portal global variables
//-----------------------------------------------------------------------------

// framework variables -----------------------------------------
var lawsonPortal=null;
var objFactory=null;
var cmnDlg=null;
var fileMgr=null;
var printMgr=null;
var oUserProfile=null;
var oPortalConfig=null;
var oBrowser=null;
var oError=null;
var oVersions=null;
var oFormCache=null;
var IEXMLSERVICE=null;
var AFSERVICE=null;
var nbrTimesToLoad = 1000;
var versionNumber="9.0.1";
var buildNumber="11.231 2012-09-05 04:00:00";

// regular expression variables --------------------------------
var tokenRE=/^\D{2}\d{2}(.\d{1})?$|^\D{4}.\d{1}$|^(\D{2}\d{3})$/i;
var menuRE=/^\w*MN$|^\w*MN\.\d+$|^\w*\.0$/i;
var flowRE=/^\w*FL\.\d+$|^\w*SU\.\d+$|^\w*BB\.\d+$|^\w*BF\.\d+$|^APPI\.\d+$|^APPR\.\d+$|^APIQ\.\d+$|^ARIN\.\d+$|^ARPF\.\d+$/i;
var urlMenuRE=/(?:\_TKN\=|\|TKN\=)(\D{2}MX\.\d+|\D{2}MN(\.\d+)?|\w{4}\.0|\D{2}MN)/i;
var servRE=/^\/servlet|^\/cgi\-lawson/;

var dragObj = new Object();
dragObj.zIndex = 0;

// services path variables -------------------------------------
var AGSPath="/servlet/Router/Transaction/Erp";
var DMEPath="/servlet/Router/Data/Erp";
var IDAPath="/servlet/Router/Drill/Erp";
var GETATTACHPath = "/cgi-lawson/getattachrec.exe";
var JOBSRVPath="/servlet/JobServer";
var PRODPROJPath="/cgi-lawson/prodproj.exe";
var WRITEATTACHPath = "/cgi-lawson/writeattach.exe";

// menu variables ----------------------------------------------
var iWindow;

// phrase tables -----------------------------------------------
var erpPhrases=null;		// erp form phrase table
var rptPhrases=null;		// Jobs and Report phrase

// window references -------------------------------------------
var portalWnd=null;			// portal window
var hotkeyWnd=null;			// hotkeys help Window
var aboutWnd=null;			// about Window
var helpWnd=null;			// help Window
var srchWnd=null;			// search Window
var formWnd=null;			// form which opened old help
var lastHelp="";			// last help file opened
var menuCrumbAry = new Array(); 

// sso related variables ---------------------------------------
var bInSSOCheck=false;		// set during active check to eliminate
							// double call to logout method
var	_IS_LOGGED_OUT = false;
