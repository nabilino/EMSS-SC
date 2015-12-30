/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/servenv.js,v 1.2.6.3.22.2 2012/08/08 12:48:50 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
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

// Do not comment out the following
var wndArguments = (window.dialogArguments != null && typeof(window.dialogArguments) != "undefined")
	? window.dialogArguments : null;

var msgDOMAIN = "Window dialog arguments not available.\n" + 
			"Notify administrator 'servenv.js' document domain not set.";
var bDomain = false;

//Uncomment the following for PSA
/*
var ENVDOMAIN = "lawson.com";

if (navigator.appName.indexOf("Microsoft") >= 0)
{
	try	{
		window.document.domain = ENVDOMAIN;
	}
	catch(e) {
		window.status = "WARNING: Could not enforce domain rules. [servenv.js]";
	}
}
//Cross-domain is unsupported in Mozilla XMLHTTP
else
	bDomain = true; 
*/
