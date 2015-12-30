/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/objects/Attic/ErrorObject.js,v 1.1.2.14.6.2.2.3 2012/08/08 12:37:30 jomeli Exp $ */
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

// ErrorObject object constructor

function ErrorObject(portalWnd)
{
	this.portalWnd = portalWnd;
	this.httpPhrases=null;
	this.xmlDoc=null;
	this.msg="";
	this.ds=null;
}

//-----------------------------------------------------------------------------
ErrorObject.prototype.displayDOMParseError=function(pe,path,wnd)
{
	wnd = (typeof(wnd) == "undefined" ? this.portalWnd : wnd);
	var msg="XML parse error"
	if (typeof(path)!="undefined")
		msg+=" in file "+path+":"
	msg+="\n"+pe.reason+"line "+pe.line+", col "+pe.linepos+":\n"+pe.srcText;
	this.portalWnd.cmnDlg.messageBox(msg,"ok","stop", wnd);
	this.portalWnd.lawTraceMsg("Messagebox displayed for DOM parse error.",msg);
}

//-----------------------------------------------------------------------------
ErrorObject.prototype.displayExceptionMessage=function(e,file,func,prefMsg,wnd)
{
	wnd = (typeof(wnd) == "undefined" ? this.portalWnd : wnd);
	var errMsg = (typeof(prefMsg)=="string" ? prefMsg+"\n" : "");
	if (this.portalWnd.oBrowser.isIE)
	{
		errMsg += "ERROR: " + e.name + "\n"
				 + "Number: " + (e.number & 0xFFFF) + "\n"
				 + "Message: " + e.message + "\n"
				 + "Description: " + e.description + "\n"
	}
	else
	{
		errMsg += "ERROR:\n";
		for (var i in e)
		{
			var str=e[i]+"";
			errMsg += str
			// some cases identified where message comes as a char array!
			if (str.length > 1) errMsg+="\n";
		}
	}
	if (typeof(func) != "undefined")
		errMsg += "\nFunction: "+func+"\n";
	if (typeof(file) != "undefined")
	{
		if (typeof(func) == "undefined") errMsg += "\n";
		errMsg += "File: "+file+"\n";
		var item=this.portalWnd.oVersions.getItem(file);
		if (item) errMsg += "Version: "+item.value+"\n";
	}
	wnd.alert(errMsg);
	this.portalWnd.lawTraceMsg("JavaScript exception encountered.",errMsg);
}

//-----------------------------------------------------------------------------
// ds: DataStorage object
// bForce: boolean - should it force a level 0 error to be displayed?
//		(optional - default false)
// prefMsg: String - prefix message (optional - default empty string)
// wnd: Window to 'own' dialog box (optional - default portal window)
//-----------------------------------------------------------------------------
ErrorObject.prototype.displayIOSErrorMessage=function(ds,bForce,prefMsg,wnd)
{
	bForce = (typeof(bForce) != "boolean" ? false : bForce);
	prefMsg = (typeof(prefMsg) != "undefined" ? prefMsg : "");
	wnd = (typeof(wnd) == "undefined" ? this.portalWnd : wnd);

	var msg=this.getDSMessage(ds);
	if (!msg) return;

	// if level is not there, old error node - show msg
	var root=ds.getRootNode();
	var level = (root && root.nodeName == "ERROR"
		? parseInt(root.getAttribute("level"),10) : 1);
	if (level > 0 || bForce || isNaN(level))
	{
		if (this.ds.getElementsByTagName("ERROR")[0].getAttribute("key") == "TOKEN_NOT_VALID")
		{
			var newMsg = lawsonPortal.getPhrase("LBL_SEARCH_RESULTS")+":\n" +
			"No programs or bookmarks were found. \n\n The following errors were logged: " + msg;
			portalWnd.cmnDlg.messageBox(newMsg,"ok","info",portalWnd);
			this.portalWnd.lawTraceMsg("Messagebox displayed for IOS reported error.",msg);
		}
		else
		{
			var errMsg = prefMsg + " " + msg +"\n\n";
			this.portalWnd.cmnDlg.errorMessageBox(errMsg, ds, (level > 0 ? "stop" : "alert"), wnd);
			this.portalWnd.lawTraceMsg("Messagebox displayed for IOS reported error.",msg);
		}
	}
}

//-----------------------------------------------------------------------------
// Return a translated HTTP status message for the given error code.
// stat: int - http status code
//-----------------------------------------------------------------------------
ErrorObject.prototype.getHttpStatusMsg=function(stat)
{
	try {
		// instantiate phrase object on first access
		if (!this.httpPhrases)
			this.httpPhrases=new this.portalWnd.phraseObj("httpstatus");

		var msg=this.httpPhrases.getPhrase(stat);
		if (msg != stat)
			return ("Status "+stat+": "+msg);
		
	} catch (e) { }
	return "Unknown message for status: "+stat;
}

//-----------------------------------------------------------------------------
ErrorObject.prototype.getDSMessage=function(ds)
{
	ds = (typeof(ds) == "undefined" ? this.ds : ds);
	var msg="";
	if (!ds) return msg;
	try {
		var root=ds.getRootNode();
		if (!root) return msg;

		//-------------------------------------------------------
		var errNode = (root.nodeName == "ERROR" ? root : null)
		if (!errNode)
		{
			var len=(root.childNodes ? root.childNodes.length : 0);
			for (var i = 0; i < len; i++)
			{
				var name = root.childNodes[i].nodeName.toLowerCase();
				if (name == "error" || name == "errmsg")
				{
					errNode=root.childNodes[i];
					break;
				}
			}
		}
		
		errNode = (!errNode ? root : errNode)
		//-------------------------------------------------------

		var msgNode=errNode.getElementsByTagName("MSG");

		//-------------------------------------------------------
		// for compatibility with CGIs not yet converted
		// (at some point we would hope to remove the following)

		if (!msgNode || msgNode.length < 1)
			msgNode=errNode.getElementsByTagName("MESSAGE");
		if (!msgNode || msgNode.length < 1)
			msgNode=ds.getElementsByTagName("ERROR");

		msgNode=(msgNode && msgNode.length > 0 ? msgNode[0] : null);
		if (msgNode)
		{
			msg=this.portalWnd.cmnGetNodeCDataValue(msgNode);
			
			if(!msg && msgNode.firstChild)
				msg = msgNode.firstChild.nodeValue;
		}
						
		msg = (msg == null ? "" : msg);
		
	} catch (e) { }

	return msg;
}

//-----------------------------------------------------------------------------
ErrorObject.prototype.getDSObject=function()
{
	return this.ds;
}

//-----------------------------------------------------------------------------
ErrorObject.prototype.handleBadResponse=function(xmlDoc,bDisp,msg,wnd)
{
	wnd = (typeof(wnd) == "undefined" ? this.portalWnd : wnd);
	bDisp = (typeof(bDisp) != "boolean" ? true : bDisp);
	msg = (typeof(msg) == "string" ? msg : (this.msg ? this.msg : ""));
	this.msg="";

	this.xmlDoc=xmlDoc;
	
	//check if user is loggedout
	if (this.portalWnd._IS_LOGGED_OUT)
		return true;

	if (!this.xmlDoc || this.xmlDoc.status)
	{
		if (this.xmlDoc)
			msg+=this.getHttpStatusMsg(this.xmlDoc.status);
		if (bDisp)
			this.portalWnd.cmnDlg.messageBox(msg,"ok","stop",wnd);
		return true;
	}
	return false;
}
//-----------------------------------------------------------------------------
// xmlDoc: DOMDocument/response object
// bStatChk: boolean- should the HTTP status property be checked?
//		 (optional - true)		
// bDisp: boolean - should errors be displayed as a dialog?
//		 (optional - true)		
// bForce: boolean - should it force a level 0 error to be displayed?
//		 (optional - false)		
// msg: String - prefix message (optional - default empty string)
// wnd: Window to 'own' dialog box (optional - default portal window)
//-----------------------------------------------------------------------------
ErrorObject.prototype.isErrorResponse=function(xmlDoc,bStatChk,bDisp,bForce,msg,wnd)
{
	bStatChk = (typeof(bStatChk) != "boolean" ? true : bStatChk);
	bDisp = (typeof(bDisp) != "boolean" ? true : bDisp);
	wnd = (typeof(wnd) == "undefined" ? this.portalWnd : wnd);
	msg = (typeof(msg) == "string" ? msg : (this.msg ? this.msg : ""));
	this.msg="";
	this.ds=null;

	if (bStatChk && this.handleBadResponse(xmlDoc,bDisp,msg,wnd))
		return true;

	this.xmlDoc=xmlDoc;
	this.ds=new this.portalWnd.DataStorage(this.portalWnd.oBrowser.isIE ? xmlDoc.xml : xmlDoc,
			this.portalWnd);
	if (this.ds.isErrorDoc())
	{
		if (bDisp)
			this.displayIOSErrorMessage(this.ds,bForce,msg,wnd);
		return true;
	}
	return false;
}

//-----------------------------------------------------------------------------
ErrorObject.prototype.isNotAuthenticatedResponse=function(oHttp)
{
	return (oHttp == null ? true : false);
}

//-----------------------------------------------------------------------------
ErrorObject.prototype.setMessage=function(msg)
{
	this.msg=msg;
}

