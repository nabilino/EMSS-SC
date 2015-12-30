//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/waitalert.js,v 1.9.24.1.2.1 2008/07/28 07:17:52 jomeli Exp $ $Name: REVIEWED_901 $
// Description: This function opens a wait alert window, which is used to
//              show some processing is in progress.
// Arguments:   A short message to display in the window. If the argument is
//              not specified or null, the default message of 
//              "Processing -- please wait." is displayed
//              imgsrc = Image, if any, to display with the message
//              stayOnTop means if there are other windows or alerts opening this wait alert will stay on top of all that
//              Read Warning below
//              the last argument is a stylesheet, by using style sheet standards you can create your own
//              fonts and colors.  The most common used will be background and font color, here is an example
//              of what to pass to change these two features  'background-color:blue;color:red'
// WARNING:If using the 'stayOnTop' option of true and the user has not been authenticated
//         the 'onblur()' function in the wait alert window will clash with the authentication window and your
//         .htm will then have problems authenticating.  That is why we default 'stayOnTop' to false!

var gProtocol = location.protocol
var gHost     = location.host
var waitAlertWind;
var bFlag;


function envFindObjectWindow(strObj,startWnd)
{
	var aWnd=null;
	try {

		var aParent=(typeof(startWnd) != "undefined" 
				? startWnd : window);
		while (aParent)
		{
			var obj=eval("aParent."+strObj);
			if (obj != null && typeof(obj) != "undefined")
			{
				aWnd=aParent;
				break;
			}
			aParent=(typeof(aParent.parent) != "undefined" && aParent.parent != aParent.self
					? aParent.parent : null);
		}
	} catch (e) { }
	return aWnd;
}

function showWaitAlert(msg,imgsrc,stayOnTop,theStyle)
{
	var parentWndow=envFindObjectWindow("lawsonPortal");
	var locationStr = parentWndow.location + '';
	
	locationStr = locationStr.substr(0, locationStr.lastIndexOf('/') + 1)
	var theblank = locationStr + 'blankdmn.htm';
	
    var onTop      = ''
    var stylesheet = ''
	bFlag = true;
	
    if(navigator.userAgent.indexOf('MSIE')==-1) theblank="about:blank" //PT 99086
    
	if (typeof(imgsrc) == 'undefined' || imgsrc == null || msg.length < 1)
		imgsrc = "/lawson/images/animate/stopwtch.gif";

	if (typeof(msg) == 'undefined' || msg == null || msg.length < 1)
		msg = "Processing -- please wait.";
		
    if (typeof(stayOnTop) == 'undefined' || stayOnTop == null)
    	stayOnTop = false
    if (stayOnTop)
    	onTop = ' onblur=self.focus()'
    	
    if (typeof(theStyle) == 'undefined' || theStyle == null || theStyle.length < 1)
        stylesheet = ' style="background-color:white;color:black;font-weight:bold;font-size:large"'
    else
    	stylesheet = ' style="' + theStyle + '"'

	removeWaitAlert()
	waitAlertWind = window.open(theblank, "WAIT", 
		"toolbar=no,scrollbars=yes,menubar=no,resizable=yes," +
		"width=300,height=100");

	var page = '<html><head><title>Processing - Wait</title><script src="' + gProtocol + '//' + gHost +'/lawson/portal/servenv.js"><\/scr' + 'ipt>' +'</head>\n' +
		'<body' + onTop + stylesheet + '><center>\n' +
		'<img align=left src=' + imgsrc + ' border=0>\n' + 
		msg + '\n</font>\n' + '</center></body></html>\n';
	
	var waitDoc;
	var i =0;
	while(bFlag && i < 1000)
	{
		try
		{
			i++;
			waitDoc = waitAlertWind.document;
			waitDoc.write(page);
			waitDoc.close();
			bFlag = false;
		}catch(e){}
	}
	
}

// Description: This function removes the wait alert window that was
//              created by the showWaitAlert function. It is OK to
//              call this function, even if you are not sure that the
//              wait alert window is even open.

function removeWaitAlert()
{
	if (waitAlertWind && (typeof(waitAlertWind) == 'object' && waitAlertWind!=null)
     		&& (typeof(waitAlertWind.document) != 'undefined') && (typeof(waitAlertWind.document) != 'unknown'))
	{
		if (waitAlertWind.closed == false)
			waitAlertWind.close();
	}
}

