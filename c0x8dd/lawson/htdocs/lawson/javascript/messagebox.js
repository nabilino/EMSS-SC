//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/messagebox.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
// Description: This function opens a white backround window, which is used to
//              display processing messages or errors.
//				Can be used instead of the grey javascript alert boxes.
// Arguments:   A short message to display in the window.
//              The argument MUST be specified by the calling program 

function displayMessage(finmsg,imgsrc)
{
var theblank = (window.location.protocol=='http:')?'about:blank':'/lawson/dot.htm';  //dpb 07-11-01 SSL Issue
//	if (typeof(imgsrc) == 'undefined')
//		imgsrc="/lawson/images/logos/lawson2.gif";

	if ((finmsg) && (finmsg != null))
		var waitMsg = finmsg;
	else
		var waitMsg = "Processing -- please wait.";

	finMessageWind = window.open(theblank, "MESSAGE", 
		"toolbar=no,scrollbars=no,menubar=no,resizable=no," +
		"width=400,height=160");

	var page = "<html><head><title>Message</title></head>\n" +
		"<body bgcolor=#ffffff><center>\n<font size=5>\n" +
//		"<img align=left src=" + imgsrc + " border=0>\n" + 
		waitMsg + "\n</font>\n" 
//        waitMsg + "</center></body></html>\n";
//		waitMsg + "\n</font>\n" + "</center></body></html>\n";

		page		+= '<html> <body> <form> <CENTER>'
					+ '<input type=button value=OK onClick=window.close() >'
					+ '</html>'
					+ "</CENTER> </form> </body> "

		var waitDoc = finMessageWind.document;
		waitDoc.write(page)

}

// Description: This function removes the oemessage generated form the
//              calling script and is called independently from the 
//              above function.

function removeDisplayMessage()
{
	if (typeof(finMessageWind) != 'undefined')
	{
		if (finMessageWind.closed == false)
			finMessageWind.close();
	}
}

