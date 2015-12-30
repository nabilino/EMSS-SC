/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/common.js,v 1.15.2.7.16.1.2.2 2012/08/08 12:48:51 jomeli Exp $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// common.js
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
function cmnSetElementText(node,text)
{
	if ( !node.hasChildNodes() ) return;
	var len=node.childNodes.length
	for (var i=0; i < len; i++)
	{
		if (node.childNodes[i].nodeType == 3)
		{
			node.childNodes[i].nodeValue = text
			break;
		}
	}
}

//-----------------------------------------------------------------------------
function setEventCancel(evt)
{
	evt.cancelBubble=true;
	evt.returnValue=false;
	evt.keyCode = 0
}

//-----------------------------------------------------------------------------
function displayDOMError(pe,path)
{
	var msg="XML parse error"
	if (typeof(path)!="undefined")
		msg+=" in file "+path+":"
	msg+="\n"+pe.reason+"line "+pe.line+", col "+pe.linepos+":\n"+pe.srcText;
	cmnDlg.messageBox(msg,"ok","stop")
}

//-----------------------------------------------------------------------------
function displayErrorPage(studioWnd,msg)
{
	// by default, error.htm will display an SSO error msg
	// must pass a reference to the studio window
	try {
		// hide all the containers of the studio window (index.htm)
		studioWnd.document.getElementById("dockTop").style.display="none";
		studioWnd.document.getElementById("dockLeft").style.display="none";
		studioWnd.document.getElementById("workSpace").style.display="none";
		studioWnd.document.getElementById("dockRight").style.display="none";

		var src="error.htm" + (typeof(msg)=="string" ? "?"+msg : "");
		var cntFrm = studioWnd.document.getElementById("loginScr");
		cntFrm.style.top="0";
		cntFrm.style.left="0";
		cntFrm.style.width=screen.width;
		cntFrm.style.height=screen.height;
		cntFrm.src = src;
		cntFrm.style.visibility="visible"
	} catch (e) { }
}

//-----------------------------------------------------------------------------
function displayExceptionMessage(e,file,func,prefMsg)
{
	var errMsg = (typeof(prefMsg=="string") ? prefMsg+"\n" : "");
	errMsg += "ERROR: " + e.name + "\n"
			 + "Number: " + (e.number & 0xFFFF) + "\n"
			 + "Message: " + e.message + "\n"
			 + "Description: " + e.description + "\n"
	if (typeof(file) != "undefined")
		errMsg += "File: "+file+"\n";
	if (typeof(func) != "undefined")
		errMsg += "Function: "+func+"\n";
	alert(errMsg);
}

//-----------------------------------------------------------------------------
function displayIOSErrorMessage(dom,force,prefMsg)
{
	if (typeof(force) != "boolean")
		force=false;

	var root=dom.documentElement;
	if (root && root.nodeName == "ERROR")
	{
		var level = parseInt(root.getAttribute("level"),10);
		if (level > 0 || force)
		{
			var msg = (typeof(prefMsg) != "undefined" ? prefMsg : "");
			var msgNode=root.getElementsByTagName("MSG");
			msgNode=(msgNode && msgNode.length > 0 ? msgNode[0] : null);
			if (msgNode)
				msg+=msgNode.firstChild.nodeValue;
			top.cmnDlg.messageBox(msg,"ok", (level > 0 ? "stop" : "alert"));
		}
	}
}

//-----------------------------------------------------------------------------
function getHttpStatusMsg(stat)
{
	if (typeof(gHttpStat[""+stat]) != "undefined")
		return gHttpStat[""+stat];
	else
		return "Unknown message for status: "+stat;
}

//-----------------------------------------------------------------------------
// this method takes an htm (i.e. "blank.htm") and returns a full url path or
//  it takes a relative path (i.e. "/portal/blank.htm") and returns full path
function getFullUrl(pageStr)
{
	if (pageStr.indexOf("/") != 0)
	{
		var path = window.location.pathname;
		if (path.indexOf(".htm") == -1)
		{
			if (path.substring(path.length-1) != "/")
				path += "/";
		}
		else
			path = path.substring(0, path.length-9);
		pageStr = path + pageStr;
	}
	return (window.location.protocol + "//" + window.location.host + pageStr);
}

//-----------------------------------------------------------------------------
function getDriveTypeIcon(type)
{
	var icoName=""
	switch (type)
	{
	case 1:
		icoName="icodrivefloppy.gif"
		break;
	case 3:
		icoName="icodrivenet.gif"
		break;
	case 4:
		icoName="icodrivecd.gif"
		break;
	default:
		icoName="icodrive.gif"
		break;
	}
	return (icoName);
}

//-----------------------------------------------------------------------------
function cmnLoadSelectPDL(wnd, oCbo, strDefault, bNoDel)
{
	// first clear any existing options
	var oLen=oCbo.length
	if (!bNoDel)
	{
		for (var i = oLen-1; i > 0; i--)
		{
			var oChild=oCbo.options.children(i)
			oCbo.removeChild(oChild)
		}
	}
	
	// get a list of PDLs
	var strQuery = "?PROD=GEN&FILE=PRODLINE&FIELD=ProductLine&OUT=XML&XCOLS=TRUE" +
			"&XKEYS=FALSE&XRELS=FALSE&XIDA=FALSE&MAX=1000"

	var objPDLXML=top.SSORequest(top.DMEPath+strQuery);
	if (!objPDLXML || objPDLXML.status)
		return;

	var oNodes = objPDLXML.selectNodes("/DME/RECORDS/RECORD/COLS/COL")
	var selIndex = -1
 	for (var i=0; i < oNodes.length; i++)
 	{
		var oOption = wnd.document.createElement("option")
		oOption.text = oNodes(i).text
		oOption.value = oNodes(i).text
		oCbo.add(oOption)
		if (oNodes(i).text==strDefault)
			selIndex=i
 	}
	oCbo.selectedIndex=selIndex+(bNoDel?oLen:0)
}

//-----------------------------------------------------------------------------
function edSetUserDateFormat(oDate,sz)
{
	// from portal/edits.js
	var dtFormat=top.designStudio.getUserVariable("DateFormat");
	var dtSep=top.designStudio.getUserVariable("DateSeperator");
	//make sure date fmt has 4Y 2M and 2D
	dtFormat=dtFormat.replace(/Y{1,4}/g,"YYYY")
	dtFormat=dtFormat.replace(/M{1,2}/g,"MM")
	dtFormat=dtFormat.replace(/D{1,2}/g,"DD")
	var retDate=""
	if (sz=="undefined") sz="8"

	var month=(oDate.getMonth()+1).toString()
	if(month.length==1)
		month="0" + month
	var day=oDate.getDate().toString()
	if(day.length==1)
		day="0" + day

	if(sz=="4")
		return month + dtSep + day

	objDate=dtFormat
	objDate=objDate.replace("MM",month)
	objDate=objDate.replace("DD",day)
	objDate=objDate.replace("YYYY",oDate.getFullYear())

	var r, re;
	re = /M{1,2}|D{1,2}|(YY){1,2}/g;
	r = dtFormat.match(re);
	var temp=0

	//insert date sep between month day year
	for(var i=0;i<r.length;i++)
	{
		retDate+=objDate.substring(temp,temp+r[i].length)
		temp+=r[i].length
		if(i<2)
			retDate+=dtSep
	}
	return retDate
}

//-----------------------------------------------------------------------------
function cmnLoadSelectProject(wnd, oCbo)
{
// Note: does not clear the select list; 
//		 assumes cmnLoadSelectPDL has been called

	// get a list of Projects
	var strQuery = "?PROD=GEN&FILE=PROJECT&FIELD=project&OUT=XML&XCOLS=TRUE" +
			"&XKEYS=FALSE&XRELS=FALSE&XIDA=FALSE&MAX=1000"

	var objPDLXML=top.SSORequest(top.DMEPath+strQuery);
	if (!objPDLXML || objPDLXML.status)
		return;

	var oNodes = objPDLXML.selectNodes("/DME/RECORDS/RECORD/COLS/COL")
	
	for (var i=0; i < oNodes.length; i++)
 	{
		var oOption = wnd.document.createElement("option")
		oOption.text = oNodes(i).text
		oOption.value = oNodes(i).text
		oCbo.add(oOption)
 	}
}

//-----------------------------------------------------------------------------
function cmnFormatXMLString(inStr)
{
	var outStr=inStr.replace(/\>\</g,">\n<");
	var tempDOM = xmlFactory.createInstance("DOM");
	tempDOM.async=false
	tempDOM.loadXML(outStr)
	if (tempDOM.parseError.errorCode != 0)
	{
		displayDOMError(tempDOM.parseError,folder+"/"+fileName)
		return null;
	}
	outStr=tempDOM.xml;
	tempDOM=null;
	return outStr;
}

//-----------------------------------------------------------------------------
function trim(str)
{
	if (!str) return ("");
	var s=str.replace(/^\s+|\s+$/g, '');
	return (s);
}

//-----------------------------------------------------------------------------
function getVarFromString(varName,str)
{
	str+='&'
	reStr="(?:\\&|\\?|_|^)" + varName + "=(.*?)(?:\\&|$)"
	var re=new RegExp(reStr,"gi")
	if(re.test(str))
		return RegExp.$1
	else
		return ""
}

//-----------------------------------------------------------------------------
// for an integer-indexed array a, determine if s is in
function arrayContains(a,s)
{
	if (!a)
		return false;
	for(var i=0;i<a.length;i++)
		if(a[i]==s)
			return true;
	return false;
}

//-----------------------------------------------------------------------------
function validFilename(fn)
{
	var badchars="/\\:*?\"<>|&'";
	for (var i=0;i<fn.length;i++)
	{
		var c=fn.substring(i,i+1);
		for (var j=0;j<badchars.length;j++)
			if (c==badchars.substring(j,j+1))
				return false;
	}
	return true;
}

//-----------------------------------------------------------------------------
function xmlEncodeString(str)
{
	var retVal=str.replace(/\&/g,"&amp;")
	retVal=retVal.replace(/\</g,"&lt;")
	retVal=retVal.replace(/\>/g,"&gt;")
	retVal=retVal.replace(/\"/g,"&quot;")
	retVal=retVal.replace(/\'/g,"&apos;")
	return retVal
}

// CommonDialog ---------------------------------------------------------------
function CommonDialog(path)
{
	this.path = (typeof(path) == "undefined" || path == null) ?
			studioPath : path;
}

// ----------------------------------------------------------------------------
CommonDialog.prototype.colorPicker=function(startColor,wnd)
{
// startColor can be literal or hex (without #) or decimal ( < 256 )
// return is hex (without #)

	// validate window opener reference
	if(typeof(wnd)=="undefined" || wnd == null)
	{
		this.messageBox("Must supply window reference to color picker dialog.","ok","stop");
		return null;
	}

	// validate startColor
	var colorHold=getWebColorHexValue(startColor);
	if(colorHold)
		startColor=colorHold;

	//check for #
	if (startColor.indexOf("#") > -1)
	{
		startColor = startColor.substr(1)
		if(IsValidHex(startColor)==false)
		{
			if(IsGoodDec(startColor))
				startColor=HexValue(startColor);
			else
			{
				this.messageBox("Invalid start color supplied to color picker dialog.",
							"ok","stop",wnd);
				return null;
			}
		}
	}

	var dlgArgs = new Array();
	dlgArgs[0] = wnd;
	dlgArgs[1] = startColor;
	var strDlgPath=this.path+"/dialogs/colorpick.htm"
 	var strFeatures="dialogWidth:320px;dialogHeight:300px;center:yes;help:no;scroll:no;status:no;";
	var colorHold = wnd.showModalDialog(strDlgPath, dlgArgs, strFeatures);
	return (typeof(colorHold) == "undefined") ? null : colorHold;
}

// ----------------------------------------------------------------------------
CommonDialog.prototype.fontPicker=function(ds,wnd)
{
	ds = (typeof(ds) == "undefined" || ds == null) ?
			new DataStorage() : ds;
	var win = (typeof(wnd) == "undefined" || wnd == null) ?
			window : wnd

	var dlgArgs = new Array();
	dlgArgs[0] = window;
	dlgArgs[1] = ds;
	var strDlgPath=this.path+"/dialogs/fontpick.htm"
 	var strFeatures="dialogWidth:440px;dialogHeight:320px;center:yes;help:no;scroll:no;status:no;";
	var dataStorage = win.showModalDialog(strDlgPath, dlgArgs, strFeatures);
	return (typeof(dataStorage) == "undefined")	? null : dataStorage;
}

// ----------------------------------------------------------------------------
// presents options to check which modified documents should be saved
CommonDialog.prototype.multiSaveDlg=function(ds,wnd)
{
	ds = (typeof(ds) == "undefined" || ds == null) ?
			new DataStorage() : ds;
	var win = (typeof(wnd) == "undefined" || wnd == null) ?
			window : wnd

	var dlgArgs = new Array();
	dlgArgs[0] = window;
	dlgArgs[1] = ds;
	var strDlgPath=this.path+"/dialogs/multisavedlg.htm"
 	var strFeatures="dialogWidth:440px;dialogHeight:260px;center:yes;help:no;scroll:no;status:no;";
	var dataStorage = win.showModalDialog(strDlgPath, dlgArgs, strFeatures);
	return (typeof(dataStorage) == "undefined")	? null : dataStorage;
}

// ----------------------------------------------------------------------------
// dialog to enter a new location for a filename
CommonDialog.prototype.saveAsDlg=function(ds,wnd)
{
	ds = (typeof(ds) == "undefined" || ds == null) ?
			new DataStorage() : ds;
	var win = (typeof(wnd) == "undefined" || wnd == null) ?
			window : wnd

	var dlgArgs = new Array();
	dlgArgs[0] = window;
	dlgArgs[1] = ds;
	var strDlgPath=this.path+"/dialogs/saveasdlg.htm"
 	var strFeatures="dialogWidth:540px;dialogHeight:300px;center:yes;help:no;scroll:no;status:no;";
	var dataStorage = win.showModalDialog(strDlgPath, dlgArgs, strFeatures);
	return (typeof(dataStorage) == "undefined")	? null : dataStorage;
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
	var win = (typeof(wnd) == "undefined" || wnd == null) ?
			window : wnd

	var dlgArgs = new Array();
	dlgArgs[0] = this.path;
	dlgArgs[1] = type;
	dlgArgs[2] = icon;
	dlgArgs[3] = msg;
	dlgArgs[4] = typeof(showPrint)=="boolean" ? showPrint : false;
	var strDlgPath=this.path+"/dialogs/msgdlg.htm"
 	var strFeatures="dialogWidth:600px;dialogHeight:120px;center:yes;help:no;scroll:no;status:no;";
	return( win.showModalDialog(strDlgPath, dlgArgs, strFeatures) );
}

// ----------------------------------------------------------------------------
CommonDialog.prototype.usher=function(ds,wnd)
{
	ds = (typeof(ds) == "undefined" || ds == null) ?
			new DataStorage() : ds;
	var win = (typeof(wnd) == "undefined" || wnd == null) ?
			window : wnd

	var dlgArgs = new Array();
	dlgArgs[0] = window;
	dlgArgs[1] = ds;
	var strDlgPath=this.path+"/dialogs/usherdialog.htm"
 	var strFeatures="dialogWidth:540px;dialogHeight:380px;center:yes;help:no;scroll:no;status:no;";
	var dataStorage = win.showModalDialog(strDlgPath, dlgArgs, strFeatures);
	return (typeof(dataStorage) == "undefined")	? null : dataStorage;
}

// ----------------------------------------------------------------------------
CommonDialog.prototype.selectImage=function(init,path,wnd)
{
	if (typeof(init) == "undefined")
		init=""
	if (typeof(path) != "string" || path=="")
		path=contentPath+"/images"
	var win = (typeof(wnd) == "undefined" || wnd == null) ?
		window : wnd

	var dlgArgs = new Array();
	dlgArgs[0] = top;
	dlgArgs[1] = init;
	dlgArgs[2] = path;

	var strDlgPath=this.path+"/dialogs/imgsel.htm"
 	var strFeatures="dialogWidth:340px;dialogHeight:360px;center:yes;help:no;scroll:no;status:no;";
	var ret = win.showModalDialog(strDlgPath, dlgArgs, strFeatures);
	return (typeof(ret) == "undefined") ? null : ret;
}

// ----------------------------------------------------------------------------
CommonDialog.prototype.selectFolder=function(root,base,init,engine,wnd)
{
	if (typeof(root) != "string" || root=="")
		root="/"
	if (typeof(base) != "string")
		base=""
	if (typeof(init) != "string")
		init=""
	if (typeof(engine) != "string")
		engine="local"
	if (engine != "local" && engine != "server" && engine != "km")
		engine="local"
	var win = (typeof(wnd) == "undefined" || wnd == null) ?
		window : wnd

	var dlgArgs = new Array();
	dlgArgs[0] = top;
	dlgArgs[1] = root;
	dlgArgs[2] = base;
	dlgArgs[3] = init;
	dlgArgs[4] = engine;
	if (engine == "local")
		dlgArgs[5] = top.designStudio.persist.getProv("local");

	var strDlgPath=this.path+"/dialogs/foldersel.htm"
 	var strFeatures="dialogWidth:340px;dialogHeight:360px;center:yes;help:no;scroll:no;status:no;";
	var ret = win.showModalDialog(strDlgPath, dlgArgs, strFeatures);
	return (typeof(ret) == "undefined") ? null : ret;
}

// ----------------------------------------------------------------------------
CommonDialog.prototype.selectScriptFiles=function(init,path,wnd)
{
	if (typeof(init) == "undefined")
		init=null
	if (typeof(path) != "string" || path=="")
		path=contentPath+"/scripts"
	var win = (typeof(wnd) == "undefined" || wnd == null) ?
		window : wnd

	var dlgArgs = new Array();
	dlgArgs[0] = top;
	dlgArgs[1] = init;
	dlgArgs[2] = path;

	var strDlgPath=this.path+"/dialogs/scriptsel.htm"
 	var strFeatures="dialogWidth:320px;dialogHeight:370px;center:yes;help:no;scroll:no;status:no;";
	var ret = win.showModalDialog(strDlgPath, dlgArgs, strFeatures);
	return (typeof(ret) == "undefined") ? null : ret;
}
//-----------------------------------------------------------------------------
CommonDialog.prototype.selectDefaultValue=function(init, wnd)
{
	if(!init || typeof(init) == "undefined")init = "";
	if(!wnd || typeof(wnd) == "undefined")wnd = window;

	var dlgArgs = new Array()
	dlgArgs[0] = init;
	dlgArgs[1] = top;
	var strDlgPath=this.path+"/dialogs/default.htm"
 	var strFeatures="dialogWidth:300px;dialogHeight:300px;center:yes;help:no;scroll:no;status:no;";
	var ret = wnd.showModalDialog(strDlgPath, dlgArgs, strFeatures);
	return (typeof(ret) == "undefined") ? null : ret;
}
//-----------------------------------------------------------------------------
CommonDialog.prototype.prompt=function(init, phrase, wnd, maxLen)
{
	if (!init || typeof(init) == "undefined") init = "";
	if (!phrase || typeof(phrase) == "undefined") phrase = "Text";
	if (!wnd || typeof(wnd) == "undefined") wnd = window;
	if (!maxLen || typeof(maxLen) == "undefined") maxLen = "";

	var dlgArgs = new Array()
	dlgArgs[0] = top;
	dlgArgs[1] = init;
	dlgArgs[2] = phrase;
	dlgArgs[3] = maxLen;

	var strDlgPath=this.path+"/dialogs/promptdlg.htm"
 	var strFeatures="dialogWidth:440px;dialogHeight:130px;center:yes;help:no;scroll:no;status:no;";
	var ret = wnd.showModalDialog(strDlgPath, dlgArgs, strFeatures);
	return (typeof(ret) == "undefined") ? null : ret;
}
// LawCollection---------------------------------------------------------------
function LawCollection()
{
	this.elements=new Object();
	this.hash=new Object();
	this.count=0;
}
LawCollection.prototype.add=function(key,item)
{
	if(key in this.elements)
		return this.elements[key]=item;

	this.elements[key]=item;
	this.hash[this.count]=key;
	this.count++;
	return this.elements[key];
}
LawCollection.prototype.remove=function(key)
{
	var ret;

	if(key in this.elements)
	{
		ret=this.elements[key];
		delete this.elements[key];
		this.count--;
	}
	this.hash=new Object();
	var cnt=0;
	for(key in this.elements)
	{
		this.hash[cnt]=key;
		cnt++;
	}
	return ret;
}
LawCollection.prototype.removeAll=function()
{
	this.elements=new Object();
	this.hash=new Object();
	this.count=0;
}
LawCollection.prototype.items=function()
{
	var key;
	var ret=new Array();

	for(key in this.elements)
		ret[ret.length]=this.elements[key];
	return ret;
}
LawCollection.prototype.item=function(key)
{
	var t=typeof(key);
	switch (t)
	{
		case "number":
			return this.elements[this.hash[key]];
			break;
		case "string":
			return this.elements[key];
			break;
		case "undefined":
			return null;
			break;
		default:
			var msg="LawCollection.prototype.item, typeof="+t+" not expected. [616]";
			cmnDlg.messageBox(msg,"ok","stop")
			break;
	}
}

// StringTable-----------------------------------------------------------------
function StringTable(id)
{
	this.id = (typeof(id) == "string" ? id : "")
	this.phrases = new DataStorage();
}
StringTable.prototype.initialize=function(strSrcType, objSource)
{
	if(!objSource)return;

	var i;
	if (strSrcType == "XML")
	{
		var nodes = objSource.selectNodes("//PHRASE");
		for(i=0; i<nodes.length; i++)
			this.addPhrase(nodes[i].getAttribute("id"), nodes[i].text);
	}
	else if (strSrcType == "ARRAY")
	{
		for(i=0; i<objSource.length; i++)
			this.addPhrase(objSource[i][0], objSource[i][1]);
	}
}
StringTable.prototype.getPhrase=function(id)
{
	if (!id) return "";
	if (typeof(id) != "string") return "";

	var msg=this.phrases.getItem(id)
	if (!msg && this.id == "designStudio" ) return (id);
	if (!msg)
	{
		msg=designStudio.stringTable.getPhrase(id)
		if (!msg) return (id);
		// did ds stringTable return the id?
		if (typeof(msg) == "string") return (msg);
	}

	var ph=msg.value.replace(/\%n\%/g,"\n")
	return (ph);
}
StringTable.prototype.addPhrase=function(id, phrase)
{
	return this.phrases.add(id, phrase);
}

// Storage---------------------------------------------------------------------
function DataStorage()
{
	this.length=0;
	this.items=new Array()
	this.index=new Object()
}
DataStorage.prototype.add=function(name,value)
{
	var i=this.items.length;
	if(typeof(value)=="undefined")
		value="";

	var item=new Object();
	item.name=name;
	item.value=value;
	this.items[i]=item;
	this.length=this.items.length;
	this.index[name]=i;

	return this.items[i];
}
DataStorage.prototype.children=function(index)
{
	if(arguments.length==0)
		return this.items;
	return this.items[index];
}
DataStorage.prototype.getItem=function(name)
{
	var index=this.index[name];
	if(typeof(index)=="undefined")
		return null;
	return this.items[index];
}
DataStorage.prototype.setItem=function(name,value)
{
	if (typeof(value) == "undefined")
		value=""
	var index=this.index[name];
	if(typeof(index)=="undefined")
		return false;
	var item=this.items[index];
	if (!item) return (false);
	item.value=value
	return true;
}
DataStorage.prototype.remove=function(name)
{
	var index=this.index[name];
	if(typeof(index)=="undefined")
		return;
	this.items.splice(index,1);
	this.length=this.items.length;
}
