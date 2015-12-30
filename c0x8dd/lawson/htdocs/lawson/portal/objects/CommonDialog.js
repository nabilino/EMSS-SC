/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/objects/CommonDialog.js,v 1.3.2.2.4.5.14.2.2.2 2012/08/08 12:37:30 jomeli Exp $ */
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

//-----------------------------------------------------------------------------
// CommonDialog object constructor
function CommonDialog(portalWnd,path)
{
	this.portalWnd = portalWnd;
	this.path = (typeof(path) != "string" || path == null)
			? this.portalWnd.document.location.pathname.substr(0,
					this.portalWnd.document.location.pathname.lastIndexOf("/"))
			: path;
}

// ----------------------------------------------------------------------------
// function to display error message with option to display stack trace
// 		msg - the message to display, required
//		ds - a datastorage object with IOS standard error format, required
//		icon - the image to display, optional : 'info' (default), 'alert', 'stop'
//		wnd - the window owning the dialog, optional
// there is no return value from this method
// ----------------------------------------------------------------------------
CommonDialog.prototype.errorMessageBox=function(msg,ds,icon,wnd)
{
	// owner window is optional
	var win = (typeof(wnd) == "undefined" || wnd == null) ?
			window : wnd

	// DataStorage object is required
	if (!ds) return;

	// errorMessageBox supported only in IE: else use alert
	if (!this.portalWnd.oBrowser.isIE)
	{
		var dtlText="";
		var dtlNode=ds.getElementsByTagName("DETAILS");
		dtlNode=(dtlNode && dtlNode.length > 0 ? dtlNode[0] : null);
		if (dtlNode)
			dtlText+=dtlNode.firstChild.nodeValue;
		msg += ("\nDetails:\n"+dtlText.substr(0,1000)+"\n\n");
		win.alert(msg);
		return;
	}

	if (typeof(icon) == "undefined" || icon == null)
		icon="info"			// default
	else
	{
		// validate icon
		if (icon!="info" && icon!="alert" && icon!="stop")
			icon="info"
	}

	var dlgArgs = new Array();
	dlgArgs[0] = this.path;
	dlgArgs[1] = ds;
	dlgArgs[2] = icon;
	dlgArgs[3] = msg;
	var strDlgPath=this.path+"/dialogs/error_msgdlg.htm"
 	var strFeatures="dialogWidth:600px;dialogHeight:120px;center:yes;help:no;scroll:no;status:no;";
	win.showModalDialog(strDlgPath, dlgArgs, strFeatures);
}

// ----------------------------------------------------------------------------
CommonDialog.prototype.folderSelect=function(start,wnd)
{
	// supported only in IE
	if (!this.portalWnd.oBrowser.isIE)
		return null;

	if (typeof(start) != "string")
		start = "c:\\";

	// owner window is optional
	var win = (typeof(wnd) == "undefined" || wnd == null) ?
			window : wnd

	var dlgArgs = new Array();
	dlgArgs[0] = window;
	dlgArgs[1] = start;
	var strDlgPath=this.path+"/dialogs/foldersel.htm"
 	var strFeatures="dialogWidth:340px;dialogHeight:360px;center:yes;help:no;scroll:no;status:no;";
	var valueStorage = win.showModalDialog(strDlgPath, dlgArgs, strFeatures);
	return (typeof(valueStorage) == "undefined") ? null : valueStorage;
}

// ----------------------------------------------------------------------------
CommonDialog.prototype.fontPicker=function(ds,wnd)
{
	// supported only in IE
	if (!this.portalWnd.oBrowser.isIE)
		return null;

	try {
		ds = (typeof(ds) == "undefined" || ds == null) ?
			new ValueStorage() : ds;
	} catch (e) { 
		this.messageBox("Unable to instanitate ValueStorage object.","ok","stop");
		return null;
	}

	// owner window is optional
	var win = (typeof(wnd) == "undefined" || wnd == null) ?
			window : wnd

	var dlgArgs = new Array();
	dlgArgs[0] = window;
	dlgArgs[1] = ds;
	var strDlgPath=this.path+"/dialogs/fontpick.htm"
 	var strFeatures="dialogWidth:440px;dialogHeight:320px;center:yes;help:no;scroll:no;status:no;";
	var valueStorage = win.showModalDialog(strDlgPath, dlgArgs, strFeatures);
	return (typeof(valueStorage) == "undefined") ? null : valueStorage;
}

// ----------------------------------------------------------------------------
// function to display message and return a button selection
// 		msg - the message to display, required
//		type - the set of buttons to display, optional
//			'ok' (default), 'okcancel', 'yesno', 'yesnocancel', 'stopcontinue'
//		icon - the image to display, optional
//			'info' (default), 'alert', 'question', 'stop'
//		wnd - the window owning the dialog, optional
// the dialog will always return one the lowercase values (string) of the buttons
// ----------------------------------------------------------------------------
CommonDialog.prototype.messageBox=function(msg,type,icon,wnd,showPrint)
{
	// owner window is optional
	var win = (typeof(wnd) == "undefined" || wnd == null) ?
			window : wnd

	// messageBox supported only in IE: else use alert
	if (!this.portalWnd.oBrowser.isIE)
	{
		if (icon=="question")
		{
			// question may use: 'okcancel', 'yesno', 'stopcontinue'
			var strNo = (type=="okcancel" ? "cancel" : (type=="stopcontinue" ? "continue" : "no"));
			var strYes = (type=="okcancel" ? "ok" : (type=="stopcontinue" ? "stop" : "yes"));
			var ret=win.confirm(msg);
			return (ret ? strYes : strNo);
		}
		else
		{
			win.alert(msg);
			return null;
		}
	}

	if (typeof(icon) == "undefined" || icon == null)
		icon="info"			// default
	else
	{
		// validate icon
		if (icon!="info" && icon!="alert" && icon!="question" && icon!="stop" && icon!="trash")
			icon="info"
	}

	// validate type and possibly override icon
	if (typeof(type) == "undefined" || type == null)
		type="ok"			// default
	switch (type)
	{
	case "ok":
	case "okcancel":
		break;
	case "yesno":
	case "yesnocancel":
	case "stopcontinue":
		if (icon=="info") icon="question"
		break;
	default:
		type="ok";
		break;
	}

	var dlgArgs = new Array();
	dlgArgs[0] = this.path;
	dlgArgs[1] = type;
	dlgArgs[2] = icon;
	dlgArgs[3] = msg;
	dlgArgs[4] = typeof(showPrint)=="boolean" ? showPrint : false;
	var strDlgPath=this.path+"/dialogs/msgdlg.htm"
	var strFeatures = (win.opener)
		? "dialogWidth:1px;dialogHeight:1px;"
		: "dialogWidth:600px;dialogHeight:120px;";
	strFeatures += "center:yes;help:no;scroll:no;status:no;";
	return win.showModalDialog(strDlgPath, dlgArgs, strFeatures);
}

//-----------------------------------------------------------------------------
CommonDialog.prototype.prompt=function(initValue, title, phrase, wnd)
{
	// owner window is optional
	var win = (typeof(wnd) == "undefined" || wnd == null) ?
			window : wnd
	var ret=null;

	// supported only in IE
	if (!this.portalWnd.oBrowser.isIE)
		ret = win.prompt(phrase,initValue);
	else
	{
		var dlgArgs = new Array()
		dlgArgs[0] = initValue;
		dlgArgs[1] = title;
		dlgArgs[2] = phrase;

		var strDlgPath=this.path+"/dialogs/promptdlg.htm"
	 	var strFeatures="dialogWidth:440px;dialogHeight:130px;center:yes;help:no;scroll:no;status:no;";
		ret = win.showModalDialog(strDlgPath, dlgArgs, strFeatures);
	}
	return (typeof(ret) == "undefined") ? null : ret;
}

//-----------------------------------------------------------------------------
CommonDialog.prototype.show=function(htm, features, args, wnd)
{
	// supported only in IE
	if (!this.portalWnd.oBrowser.isIE)
		return null;

	// do we have an URL?
	if (!htm || typeof(htm) != "string")
	{
		this.messageBox("A valid URL must be supplied to the show method.",
					"ok","stop",wnd);
		return null;
	}

	var dlgArgs = new Array()
	dlgArgs[0] = this.portalWnd;

	if (typeof(args) == "object")
	{
		for (var i = 0; i < args.length; i++)
			dlgArgs[i+1] = args[i];
	}

	var win = (typeof(wnd) == "undefined" || wnd == null) ?
			window : wnd

	var strDlgPath=this.path+htm;
 	var strFeatures=(typeof(features) == "string")
 		? features
 		: "dialogWidth:440px;dialogHeight:220px;center:yes;help:no;scroll:no;status:no;";
	var retVal = win.showModalDialog(strDlgPath, dlgArgs, strFeatures);
	return (typeof(retVal) == "undefined" || retVal == null) ? null : retVal;
}
