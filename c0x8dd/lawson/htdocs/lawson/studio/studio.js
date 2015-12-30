/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/studio.js,v 1.12.2.11.4.8.6.3.6.3 2012/08/08 12:48:51 jomeli Exp $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// studio.js
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

function studioOnLoad()
{
	var basePath;
	with(window.location)
	{
		basePath=pathname;
		studioPath=basePath.substr(0,basePath.lastIndexOf("/"));
	}

	if (bDomain)
		alert("Cross Domain Error: Cross domain is not supported by this browser.");

	// error checking to make sure sso.js was loaded from servlet container
	try	{
		xmlFactory = new SSOObjectFactory();
	}
	catch (e) {
		var cntFrm = window.document.getElementById("loginScr");
		cntFrm.style.visibility="visible"
		cntFrm.style.width=screen.width;
		cntFrm.style.height=screen.height;
		cntFrm.src = "error.htm";
		return;
	}
	if (!xmlFactory)
	{
		// unable to create DOM objects
		var msg="Lawson Design Studio requires Internet Explorer 5.5 or greater\n"+
			"and support for the Microsoft XMLDOM versions 3 or 4."
		cmnDlg.messageBox(msg,"ok","stop")
		return;
	}

	cmnDlg = new CommonDialog(studioPath);
	fileMgr = new FileManager(window);
	designStudio = new DesignStudio();

	var src = null;
	try	{
		var ssoAuthObj = new SSOAuthObject();	// get singleton auth object
		src=ssoAuthObj.getRelyingSvcURL();
		if (src == null)
			src=ssoAuthObj.getHTTPUrl();
		if (src) src+="?_ssoOrigUrl=" + getFullUrl("logondone.htm");
	}
	catch (e) {	}
	if (src != null)
		document.getElementById("loginScr").src = src;
	else
		displayErrorPage(window,"The Design Studio cannot load because it was unable to " +
			"establish communication with the primary security server.%n" +
			"System Administrator: please verify the lsserver is running properly.");
}

//-----------------------------------------------------------------------------
function studioOnBeforeUnload()
{
	// can't call closeFile on open count of 1 since that method
	// gives user a chance to cancel and this lame event can only be
	// cancelled using a non-customizable message box

	if (designStudio && designStudio.explorer)
		designStudio.explorer.closeAll(true)

	if (!studioSSOIsActive() && designStudio && designStudio.prefsModified)
	{
		// prompt to give an indication a login will be required
		var msg="User options have been modified.\nOK to save?\n";
		if ( cmnDlg.messageBox(msg,"okcancel","question",window) != "ok" )
			return;
	}

	// save user preferences?
	if (designStudio && designStudio.prefsModified)
		designStudio.saveUserPrefs()

	// check for open window and close it
	try {
		if (top.oApiWin && !top.oApiWin.closed)
			top.oApiWin.close();
        if (top.oPreviewWin && !top.oPreviewWin.closed)
            top.oPreviewWin.close();
	} catch (e) { }
}
//-----------------------------------------------------------------------------
function studioSSOIsActive(bPrompt)
{
	try {
		// method returns true or false to indicate whether user is
		// authenticated.  any caller of this method that recives a false
		// return value should call the logout function and exit

		// validate optional paramater
		bPrompt = (typeof(bPrompt) == "boolean" ? bPrompt : false);
		// 'turn off' the Logout function
		bInSSOCheck=true;
		// get singleton auth object
		var ssoAuthObj = new SSOAuthObject();
		var bRetVal = false;
		if (ssoAuthObj.getRelyingSvcURL() != null)
			bRetVal = ssoAuthObj.ping(true);
		else
			// if bPrompt=true, call login else ping with true to reset timeout
			bRetVal = ( bPrompt ? ssoAuthObj.login() : ssoAuthObj.ping(true) );
		// re-enable the Logout method
		bInSSOCheck=false;
		return bRetVal;
		
	} catch (e) { }
	return false;
}

//-----------------------------------------------------------------------------
function studioInitialize(profileDOM)
{
	window.document.getElementById("loginScr").src = "";
	window.document.getElementById("loginScr").style.display="none";
	window.document.getElementById("loginDiv").style.display="none";
	window.document.getElementById("dockTop").style.display="block";
	window.document.getElementById("workSpace").style.display="block";

	with(designStudio)
	{
		ui.menu.style.visibility = "visible";
		profile = profileDOM;
		init();
		ui.leftBar.style.width = getUserPreference("LEFTBARWIDTH","15")+"%";
		ui.rightBar.style.width = getUserPreference("RIGHTBARWIDTH","15")+"%";
		ui.workSpace.style.width = (100 - (parseInt(ui.leftBar.style.width) +
				parseInt(ui.rightBar.style.width)))+"%";
	}
	setTimeout("studioEvalCommandLine()",5)
}

//-----------------------------------------------------------------------------
function studioEvalCommandLine()
{
	var strDesigner="";
	var oDesigner=null;
	var command=getVarFromString("command",window.location.search);
	command = command ? command.toUpperCase() : "";
	switch (command)
	{
		case "ID_API_BUILDER":				// fall through list of valid
		case "ID_TOOLS_REBUILDINDEX":		// standalone commands
		case "ID_TOOLS_SETFORMPDL":
		case "ID_TOOLS_SETWIZPDL":
			designStudio.commandHandler.execute(command);
			break;

		case "ID_FILE_OPEN":
		case "ID_FILE_NEW":
			strDesigner=getVarFromString("designer",window.location.search)
			oDesigner=designStudio.designers.item(strDesigner)
			if (!oDesigner)
			{
				designStudio.commandHandler.execute(command);
				return;
			}
			var docObj=studioBuildDocObjFromURL(oDesigner,
							command == "ID_FILE_OPEN" ? "open" : "new")
			designStudio.commandHandler.openDocumentObj(docObj);
			break;

		default:
			var bOpenRecent=false;
			if (designStudio.getUserPreference("OPENRECENT","0") == "1")
				bOpenRecent=designStudio.openRecent(0)
			if (!bOpenRecent)
				designStudio.commandHandler.execute("ID_FILE_NEW");
			break;
	}
}

//-----------------------------------------------------------------------------
function studioBuildDocObjFromURL(oDesigner,actId)
{
	var strVar="";
	var docObj = new Object();
	docObj.id=oDesigner.getId();
	docObj.actId=actId;

	// the following are optional
	strVar=getVarFromString("docId",window.location.search);
	var oVar=oDesigner.getDoc(strVar);
	docObj.docId = oVar ? strVar : null;
	strVar=getVarFromString("docName",window.location.search);
	docObj.docName = strVar ? strVar : null;
	strVar=getVarFromString("docPath",window.location.search);
	docObj.docPath = strVar ? strVar : null;
	strVar=getVarFromString("provId",window.location.search);
	docObj.provId = strVar ? strVar : null;

	// pdl required for wizard and forms
	strVar=getVarFromString("pdl",window.location.search);
	if (!strVar) return docObj;

	docObj.params = new DataStorage()
	docObj.params.add("pdl",strVar)
	strVar=getVarFromString("tkn",window.location.search);
	docObj.params.add("tkn",strVar)
	docObj.params.add("sys","")
	if (actId=="new")
		docObj.params.add("paint","")
	strVar=getVarFromString("id",window.location.search);
	docObj.params.add("id",strVar)

	return docObj;
}

//-----------------------------------------------------------------------------
// studio keydown event handler
function studioOnKeyDown()
{
	if (studioHandleKey(event))
	{
		setEventCancel(event);
		return false;
	}
	return true;
}

//-----------------------------------------------------------------------------
// public method to route keys through the studio
// ( caller should 'setEventCancel' if return is true )
function studioHandleKey(evt)
{
	if (!designStudio) return false;
	if (!evt) return false;

	if (designStudio.menuMan
	&& designStudio.menuMan.handleKeyboardEvent(evt))
		return (true);

	if (designStudio.activeDesigner)
	{
		if (designStudio.activeDesigner.commandHandler
		&& designStudio.activeDesigner.commandHandler.handleKeyboardEvent(evt))
			return (true);
	}

	if (designStudio.commandHandler
	&& designStudio.commandHandler.handleKeyboardEvent(evt))
		return (true);

	if (designStudio.menuMan)
		designStudio.menuMan.hideMenuBars();

	return (false);
}

// DesignStudio----------------------------------------------------------------
function DesignStudio()
{
	this.profile=null;
	this.designers=null;
	this.fileTypes=null;
	this.activeDesigner=null;
	this.menuBar=null;
	this.commandHandler = null;
	this.cmnDlg=null;
	this.stringTable=null;
	this.path = window.location.pathname.substr(0,window.location.pathname.lastIndexOf("/"));
	this.explorer=null;
	this.persist=null;
	this.versionNumber="9.0.1"
	this.buildNumber="11.231 2012-09-05 04:00:00"
	this.recentArrDS=null;
	this.recentMenu=null;
	this.prefsModified=false;

	this.ui = new Object();
	this.ui.menu = document.getElementById("dockTop");
	this.ui.leftBar = document.getElementById("dockLeft");
	this.ui.rightBar = document.getElementById("dockRight");
	this.ui.workSpace = document.getElementById("workSpace");
}
DesignStudio.prototype.init=function()
{
	this.stringTable = new StringTable("designStudio");
	this.stringTable.initialize("XML", SSORequest("studiomsgs.xml"));

	this.recentArrDS=null;
	this.recentMenu=null;

	this.commandHandler = new DefaultCommandHandler();
	this.explorer = new Explorer();

	var objStudioXML = SSORequest("studio.xml");
	if(!objStudioXML)return false;

	this.setPortalPath(this.getUserPreference("PORTAL","/lawson/portal"));

	var nodes=objStudioXML.selectNodes("//DESIGNER");
	var len=(nodes?nodes.length:0);
	var id;
	this.designers = new LawCollection();
	for (var i=0; i<len; i++)
	{
		// only add designer if not denied
		id=nodes[i].getAttribute("id");
		this.designers.add(id, new DesignerStub(id,nodes[i]));
	}

	this.persist=new Persistence();
	nodes=objStudioXML.selectNodes("//PROVIDER");
	len=(nodes?nodes.length:0);
	for(var i=0;i<len;i++)
		this.persist.loadProvider(nodes[i]);

	this.fileTypes=new LawCollection();
	nodes=objStudioXML.selectNodes("//FILETYPE");
	len=(nodes?nodes.length:0);
	for(var i=0;i<len;i++)
	{
		var id=nodes[i].getAttribute("id");
		var val=nodes[i].firstChild.nodeValue;
		this.fileTypes.add(id,val);
	}

	this.loadMenuBar(objStudioXML.selectSingleNode("//MENUBAR"));
//	this.showSplashScreen();
	return true;
}
DesignStudio.prototype.loadDesigner=function(cmdInfo)
{
	var id=cmdInfo.id;
	try	{
		var objXML=null;
		var userDesigner = this.designers.item(id);
		if (!userDesigner) return false;
		var strDir = userDesigner.getDir();
		if (userDesigner && strDir)
			objXML = SSORequest(strDir+"/designer.xml");
		if(!objXML) return false;

		this.explorer.setInactiveWindow();

		this.activeDesigner = new Designer(id);
		this.activeDesigner.stringTable = new StringTable(id);
		this.activeDesigner.stringTable.initialize("XML",
				SSORequest(strDir+"/"+objXML.selectSingleNode(".//MESSAGE").text));

		this.activeDesigner.designerInfo = new DesignerInfo(strDir, objXML.documentElement, this.activeDesigner.stringTable);
		if(typeof(cmdInfo) != "undefined")this.activeDesigner.cmdInfo = cmdInfo;

		// load the menu definition
		objXML = SSORequest(this.activeDesigner.designerInfo.folder+"/"+this.activeDesigner.designerInfo.menu);
		this.activeDesigner.loadMenuBar(objXML);

		// load toolbox
		if(this.activeDesigner.designerInfo.toolbox != "NONE")
		{
			objXML = SSORequest(this.activeDesigner.designerInfo.folder+
						"/controls/"+this.activeDesigner.designerInfo.toolbox);
			if(!objXML)
			{
				//TODO: error handler
				return false;
			}
			if (!this.activeDesigner.loadToolbox(objXML))
				return false;
		}

		// Construct the drag element and create the iframe to load the designer source
		var cell = document.getElementById("workSpace");
		var srcDiv = document.createElement("DIV");
		srcDiv.id = "c"+ (this.explorer.openDocuments.count + 1);
		srcDiv.className = "";
		srcDiv.style.zIndex = "2";
		srcDiv.style.position = "absolute";
		srcDiv.style.top = "0px";
		srcDiv.style.left = "0px";
		srcDiv.style.height = "0px";
		srcDiv.style.width = "0px";
		cell.appendChild(srcDiv)

		var srcFrame = document.createElement("IFRAME");
		srcFrame.id = "w" + (this.explorer.openDocuments.count + 1);
		srcFrame.frameBorder = "no";
		srcFrame.scrolling = "no";
		srcFrame.border = "0";
		srcFrame.className = "dsViewFrameActive";
		srcFrame.style.zIndex = "1";
		srcDiv.appendChild(srcFrame);

		this.activeDesigner.source = window.frames[srcFrame.id];
		srcFrame.src = studioPath+ "/" + this.activeDesigner.designerInfo.folder + "/" +
					this.activeDesigner.designerInfo.indexHtm;

		this.activeDesigner.readyState="loading";

	} catch(e) {
		displayExceptionMessage(e,"studio.js","DesignStudio.loadDesigner","");
		return false;
	}
	return true;
}
DesignStudio.prototype.loadDesignerComplete=function()
{
	// create activeDocument, draw, commandHandler, propertyChangeNotify instances
	this.activeDesigner.activeDocument = new this.activeDesigner.source.ActiveDocument();
	this.activeDesigner.draw = new this.activeDesigner.source.Draw();
	this.activeDesigner.commandHandler = new this.activeDesigner.source.CommandHandler();
	this.activeDesigner.eventHandler = new this.activeDesigner.source.EventHandler();

	// add the document to the windows collection
	var name = this.explorer.add(this.activeDesigner.cmdInfo.docName, this.activeDesigner.cmdInfo.docPath, this.activeDesigner);
	this.activeDesigner.activeDocument.qualifiedName = name;
	if(!this.activeDesigner.cmdInfo.docName && !this.activeDesigner.cmdInfo.docPath)
	{
		this.activeDesigner.activeDocument.docPath = "";
		this.activeDesigner.activeDocument.docName = name;
	}
	this.activeDesigner.workSpace = this.activeDesigner.source.document.getElementById("dsWorkspace");
	this.activeDesigner.workSpace.constructViews(this.activeDesigner.designerInfo);
}
DesignStudio.prototype.loadDesignerComplete2=function()
{
	this.activeDesigner.readyState="complete";
	var evtObj = this.createEventObject(ON_LOAD_DESIGNER_COMPLETE, null, null, this.commandHandler.commandInfo);
	this.activeDesigner.eventHandler.processEvent(evtObj);

	this.activeDesigner.workSpace.setActive(this.activeDesigner.workSpace.view);
	this.explorer.setActiveWindow(this.activeDesigner.activeDocument.qualifiedName);
	if(this.activeDesigner.docId != "")
	{
		this.activeDesigner.activeDocument.setDocumentProperties();
		if (this.commandHandler.commandInfo.actId=="new")
			this.activeDesigner.activeDocument.isNew=true;
		evtObj = this.createEventObject(ON_DOCUMENT_INITIALIZED, null, null, this.commandHandler.commandInfo);
		this.activeDesigner.eventHandler.processEvent(evtObj);
		// design palette may not reflect current document
		var view = this.activeDesigner.workSpace.views.item(this.activeDesigner.workSpace.view);
		if (view) view.updateView();
	}
}
DesignStudio.prototype.loadMenuBar=function(objXML)
{
	if (!this.menuMan)
	{
		this.menuMan=new MenuManager();
		if (!this.menuMan)
		{
			alert("Could not create menu manager! [212]");
			return;
		}
	}
	var oMenuBar=document.getElementById("dsMenu");
	this.menuBar=oMenuBar.cloneNode(false);
	this.menuBar.id="dsMenuBar0";
	document.getElementById("dockTop").className="dsMenuDock";
	oMenuBar.parentNode.appendChild(this.menuBar);
	this.menuBar.menuMan=this.menuMan;
	this.menuBar.xml=objXML;
	this.menuBar.visible=true;
}
DesignStudio.prototype.getUserVariable=function(name,defval)
{
	var retVal = (typeof(defval)!="undefined" ? defval : "");
	if (typeof(name) != "string" || name == "")
		return "";

	name=name.toLowerCase();		// profile returns all names LC
	elemNode = this.profile.selectSingleNode("/PROFILE/ATTRIBUTES/ATTR[@name='"+name+"']");
	if (elemNode)
		retVal = elemNode.getAttribute("value");
	return retVal;
}
DesignStudio.prototype.getUserPreference=function(name,defval)
{
	var retVal = typeof(defval)!="undefined" ? defval : "";
	var prefNode = this.profile.selectSingleNode("//PREFERENCES/"+name);
	if (prefNode)
		retVal = prefNode.text;
	return retVal;
}
DesignStudio.prototype.setUserPreference=function(name,value)
{
	var prefsNode = this.profile.selectSingleNode("//PREFERENCES");
	if (!prefsNode)
	{
		var pUserNode=this.profile.selectSingleNode("//PORTAL_USER");
		if (!pUserNode) return false;
		prefsNode=this.profile.createElement("PREFERENCES");
		pUserNode.appendChild(prefsNode);
	}

	var prefNode = this.profile.selectSingleNode("//PREFERENCES/"+name);
	if (prefNode)
	{
		for (var i=prefNode.childNodes.length-1;i>0;i--)
			prefNode.removeChild(prefNode.childNodes[i]);
		prefNode.text="";
	}
	else
	{
		if (!prefsNode) return false;
		prefNode = this.profile.createElement(name);
		prefsNode.appendChild(prefNode);
	}

	var txtNode = this.profile.createCDATASection(xmlEncodeString(value));
	prefNode.appendChild(txtNode);
	
	switch (name)
	{
	case "PORTAL":
		this.setPortalPath(value);
		var remoteProv=this.persist.getProv("remote");
		if (remoteProv)
		{
			remoteProv.setRoot(contentPath);
			remoteProv.cd(contentPath);
		}
		break;
	case "LOCALWORKSPACE":
		var localProv=this.persist.getProv("local");
		if (localProv)
			localProv.cd(value);
		break;
	}

	this.prefsModified=true;
	return true;
}
DesignStudio.prototype.saveUserPrefs=function(bDispMsg)
{
	var bRetVal=false;
	try {
		if (typeof(bDispMsg) != "boolean")
			bDispMsg=false

		// construct filename based on webuser
		var filename = this.getUserVariable("ID")
		filename = filename.replace(/\\/g,'_')
		filename += ".xml"
		var folder=studioPath+"/data/users";

		// get the user info node in profile data
		var userNode=this.profile.selectSingleNode("//PORTAL_USER")

		// format it before sending to filemgr
		var strXML=cmnFormatXMLString(userNode.xml);

		// ask filemgr to save it
		var ret=top.fileMgr.save(folder, filename, strXML, "text/xml", true, bDispMsg)
		bRetVal = (ret ? true : false);
		if (bRetVal)
			this.prefsModified=false;
	}
	catch(e) { }
	return bRetVal
}
DesignStudio.prototype.createEventObject=function(eventId, windowEvent, cmdHistoryId, extraInfo)
{
	var evtObj = new EventObject();
	evtObj.eventId = eventId;
	evtObj.windowEvent = windowEvent;
	evtObj.cmdHistoryId = cmdHistoryId;
	evtObj.extraInfo = extraInfo
	return evtObj;
}
// Recent methods
DesignStudio.prototype.pushRecentFileDS=function(ds)
{
	// get max recent
	var maxRecent=this.getUserPreference("RECENTMAX","4");
	maxRecent=parseInt(maxRecent,10);

	var arrNew=null;
	if (maxRecent>0)
	{
		// build new array
		arrNew=new Array();
		arrNew.push(ds);

		var arrDS=this.getRecentArrDS();
		var lenDS=(arrDS?arrDS.length:0);
		var lenCurr=0;
		var p_0=ds.getItem("docPath").value+ds.getItem("docName").value;
		for (var i=0;i<lenDS && lenCurr<(maxRecent-1);i++)
		{
			// check for duplicate path
			var p_i=arrDS[i].getItem("docPath").value+arrDS[i].getItem("docName").value;
			if (p_0!=p_i)
			{
				arrNew.push(arrDS[i]);
				lenCurr++;
			}
		}
	}
	this.setRecentArrDS(arrNew);
}
// method will except a 'docObj' or a complete initialized ActiveDocument object
DesignStudio.prototype.pushRecentFileObj=function(docObj)
{
	if (docObj.docName && docObj.docPath && docObj.provId && docObj.docId)
	{
		var desId = docObj.id ? docObj.id : (docObj.designer ? docObj.designer.id : "");
		if (!desId) return;

		var ds=new DataStorage();
		ds.add("id",desId);
		ds.add("docName",docObj.docName);
		ds.add("docPath",docObj.docPath);
		ds.add("provId",docObj.provId);
		ds.add("docId",docObj.docId);
		if (docObj.params)
			ds.add("params",docObj.params);
		this.pushRecentFileDS(ds);
	}
}
DesignStudio.prototype.popRecentFileDS=function(ds)
{
	// get max recent
	var maxRecent=this.getUserPreference("RECENTMAX","4");
	maxRecent=parseInt(maxRecent,10);
	
	var arrNew = new Array();
	var p_0=ds.getItem("docPath").value+ds.getItem("docName").value;
	
	var arrDS=this.getRecentArrDS();
	var lenDS=(arrDS?arrDS.length:0);
	var lenCurr=0;
	for (var i=0;i<lenDS && lenCurr<(maxRecent-1);i++)
	{
		var p_i=arrDS[i].getItem("docPath").value+arrDS[i].getItem("docName").value;
		if (p_0!=p_i)
		{
			arrNew.push(arrDS[i]);
			lenCurr++;
		}		
	}
	this.setRecentArrDS(arrNew);
}
DesignStudio.prototype.clearRecent=function()
{
	this.setRecentArrDS();
}
DesignStudio.prototype.openRecent=function(i)
{
	// arrDS
	var arrDS=this.getRecentArrDS();
	var lenDS=(arrDS?arrDS.length:0);
	if (i < lenDS)
	{
		var docObj=new Object();
		var fileDS=arrDS[i];
		for (var j=0; j < fileDS.length; j++)
		{
			// fileDS
			var n=fileDS.items[j].name;
			var v=fileDS.items[j].value;
			docObj[n]=v;
		}
		this.commandHandler.openDocumentObj(docObj);
		return true;
	}
	return false;
}
DesignStudio.prototype.setRecentArrDS=function(arrDS)
{
	// builds save string and save to behavior element
	// arrDS - array of data storages.  each element is a fileDS.
	// fileDS - file data storage, actId,id,docId,docName,docPath,provId.
	this.recentArrDS=arrDS;

	var recNode=this.getRecentNode();
	if (!recNode)
	{
		recNode=this.profile.createElement("RECENT");
		var userNode=this.profile.selectSingleNode("//PORTAL_USER");
		if (userNode)
			userNode.appendChild(recNode);
	}
	var lenDS=(arrDS?arrDS.length:0);
	var cData=null;

	// clear out recnode
	for (var i=recNode.childNodes.length-1;i>0;i--)
		recNode.removeChild(recNode.childNodes[i]);
	recNode.text="";

	// get max recent
	var maxRecent=this.getUserPreference("RECENTMAX","4");
	maxRecent=parseInt(maxRecent,10);

	for (var i=0;i<lenDS && i<maxRecent;i++)
	{
		var fileDS=arrDS[i];
		var fileNode=this.profile.createElement("FILE");
		for (var j=0;j<arrDS[i].length;j++)
		{
			var n=fileDS.items[j].name;
			if (n!="overwrite" && n!="contents")
			{
				var v=fileDS.items[j].value;
				if (n!="params")
				{
					var attrNode=this.profile.createElement("ATTR");
					attrNode.setAttribute("id",n);
					cData = this.profile.createCDATASection(xmlEncodeString(v));
					attrNode.appendChild(cData);
					fileNode.appendChild(attrNode);
				}
				else
				{
					// params
					var paramNode=this.profile.createElement("PARAMS");
					var lenP=(v?v.length:0);
					for (var k=0;k<lenP;k++)
					{
						attrNode=this.profile.createElement("ATTR");
						attrNode.setAttribute("id",v.items[k].name);
						cData = this.profile.createCDATASection(xmlEncodeString(v.items[k].value));
						attrNode.appendChild(cData);
						paramNode.appendChild(attrNode);
					}
					fileNode.appendChild(paramNode);
				}
			}
		}
		recNode.appendChild(fileNode);
	}
	this.prefsModified=true;
	this.recentMenu=null; // forces rebuild of menu xml
}
DesignStudio.prototype.getRecentArrDS=function()
{
	// gets save string from behavior element
	// returns an array of file data storage objects.
	// arrDS - array of data storage strings.  each element is a fileStr.
	// fileStr - string representation of fileDS.
	// fileDS - file data storage, actId,id,docId,docName,docPath,provId.
	// parDS - parameter data storage
	if (!this.recentArrDS)
	{
		var recNode=this.getRecentNode();
		if (!recNode)
			return null;

		var arrRet=new Array();
		var arrFiles=recNode.getElementsByTagName("FILE");
		var lenFiles=(arrFiles?arrFiles.length:0);
		for (var i=0;i<lenFiles;i++)
		{
			var fileDS=new DataStorage();
			var attrLen=(arrFiles[i].childNodes?arrFiles[i].childNodes.length:0);
			for (var j=0;j<attrLen;j++)
			{
				var t=arrFiles[i].childNodes[j].tagName.toLowerCase();
				if (t=="attr")
				{
					var n=arrFiles[i].childNodes[j].getAttribute("id");
					var v=arrFiles[i].childNodes[j].firstChild.nodeValue;
					fileDS.add(n,v);
				}
				else if (t=="params")
				{
					// params
					var parDS=new top.DataStorage();
					var pLen=(arrFiles[i].childNodes[j].childNodes?arrFiles[i].childNodes[j].childNodes.length:0);
					for (var k=0;k<pLen;k++)
					{
						var nd=arrFiles[i].childNodes[j].childNodes[k];
						var pn=nd.getAttribute("id");
						var pv=(nd.firstChild?nd.firstChild.nodeValue:null);
						if (pn && pv)
							parDS.add(pn,pv);
					}
					fileDS.add("params",parDS);
				}
			}
			arrRet.push(fileDS);
		}
		this.recentArrDS=arrRet;
	}
	return (this.recentArrDS);
}
DesignStudio.prototype.getRecentMenu=function()
{
	// builds menu XML string based on array of recent data storages
	// arrDS - array of data storages.  each element is a fileDS.
	// fileDS - file data storage, actId,id,docId,docName,docPath,provId.
	if (!this.recentMenu)
	{
		var arrDS=this.getRecentArrDS();
		var lenDS=(arrDS?arrDS.length:0);

		var dis=new Object();
		var objXML=top.xmlFactory.createInstance("DOM");
		dis.windowMenu=objXML.createElement("MENU");

		// clear opt
		var item = objXML.createElement("ITEM");
		item.setAttribute(top.menus.ATTR_CAPTIONID, "LBL_RECENTCLR");
		item.setAttribute(top.menus.ATTR_ID, "ID_RECENTCLR");
		item.setAttribute(top.menus.ATTR_TITLEID, "TITLE_RECENTCLR");
		item.setAttribute(top.menus.ATTR_ENABLED, (lenDS?"1":"0"));
		dis.windowMenu.appendChild(item);

		// spacer
		if (lenDS)
		{
			item = objXML.createElement("ITEM");
			item.setAttribute(top.menus.ATTR_CAPTION, "-");
			dis.windowMenu.appendChild(item);
		}

		// filenames
		for (var i=0;i<lenDS;i++)
		{
			var fileDS=arrDS[i];
			var docName=fileDS.getItem("docName");
			docName=(docName?docName.value:"");
			if (docName)
			{
				var docPath=fileDS.getItem("docPath");
				docPath=(docPath?docPath.value:"");
				var dispPath=docPath+"/"+docName;
				dispPath=dispPath.replace(/\\/g,"/");
				dispPath=dispPath.replace(/\/\//g,"/");
				item = objXML.createElement("ITEM");
				item.setAttribute(top.menus.ATTR_CAPTION,dispPath);
				item.setAttribute(top.menus.ATTR_ID, "ID_RECENT_"+i);
				item.setAttribute(top.menus.ATTR_TITLEID,dispPath);
				dis.windowMenu.appendChild(item);
			}
		}
		this.recentMenu=dis.windowMenu;
	}
	return (this.recentMenu);
}
DesignStudio.prototype.getRecentNode=function()
{
	return this.profile.selectSingleNode("//RECENT");
}
DesignStudio.prototype.setPortalPath=function(path)
{
	// sets global variables
	portalPath=path;
	contentPath=path+"/content";
}

//Explorer---------------------------------------------------------------------
function Explorer()
{
	this.openDocuments = new LawCollection();
	this.newFileIndex = 0;
	this.activeFileName = "";
	this.bRestoring = false;

	var objXML = xmlFactory.createInstance("DOM");
	this.windowMenu = objXML.createElement("MENU");
	// minimize all item
	var item = objXML.createElement("ITEM");
	item.setAttribute(menus.ATTR_CAPTIONID, "LBL_MINIMIZEALL");
	item.setAttribute(menus.ATTR_ID, "ID_WINDOW_MINIMIZEALL");
	item.setAttribute(menus.ATTR_TITLEID, "TITLE_MINIMIZEALL");
	item.setAttribute(menus.ATTR_ENABLED, "eval_top.designStudio.explorer.openDocuments.count");
	this.windowMenu.appendChild(item);
	// close all item
	var item = objXML.createElement("ITEM");
	item.setAttribute(menus.ATTR_CAPTIONID, "LBL_CLOSEALL");
	item.setAttribute(menus.ATTR_ID, "ID_WINDOW_CLOSEALL");
	item.setAttribute(menus.ATTR_TITLEID, "TITLE_CLOSEALL");
	item.setAttribute(menus.ATTR_ENABLED, "eval_top.designStudio.explorer.openDocuments.count");
	this.windowMenu.appendChild(item);
	// next window item
	var item = objXML.createElement("ITEM");
	item.setAttribute(menus.ATTR_CAPTIONID, "LBL_NEXTWINDOW");
	item.setAttribute(menus.ATTR_ID, "ID_WINDOW_NEXT");
	item.setAttribute(menus.ATTR_TITLEID, "TITLE_NEXTWINDOW");
	item.setAttribute(menus.ATTR_SHORTCUT, "Ctrl+Shift+W");
	item.setAttribute(menus.ATTR_ENABLED, "eval_top.designStudio.explorer.setEnable('nextwindow')");
	this.windowMenu.appendChild(item);
	// separator
	item = objXML.createElement("ITEM");
	item.setAttribute(menus.ATTR_CAPTION, "-");
	item.setAttribute(menus.ATTR_VISIBLE, "eval_top.designStudio.explorer.openDocuments.count");
	this.windowMenu.appendChild(item);
}
Explorer.prototype.add=function(fileName, path, designer)
{
	var newDoc = new Object();
	if(fileName == "")
	{
		fileName = "document"+ (++this.newFileIndex);
	}
	if(path != "")path+="/";
	newDoc.fileName = path+fileName;
	newDoc.fileName = newDoc.fileName.replace(/\\/g, "/");
	newDoc.fileName=newDoc.fileName.replace(/\/\//g,"/");
	newDoc.title = newDoc.fileName;
	newDoc.designer = designer;
	this.openDocuments.add(newDoc.fileName, newDoc);
	this.updateWindowsMenu("add", newDoc.fileName);
	return newDoc.fileName;
}
Explorer.prototype.remove=function(fileName)
{
	var doc = this.openDocuments.item(fileName);
	if(!doc)return;
	if(doc.designer.workSpace.minimized)
	{
		var elem = document.getElementById(fileName + "_MIN");
		if (elem)
			elem.parentElement.removeChild(elem);
	}
	doc.designer = null;
	this.openDocuments.remove(fileName);
	this.activeFileName = "";
	this.updateWindowsMenu("remove", fileName);
}
Explorer.prototype.updateWindowsMenu=function(strOperation, fileName, newName)
{
	// we have to reverse the slant of the slash in a local
	// path or we won't be able to get back to the node
	var re=/\\/g
	var idString=fileName.replace(re,"/")
	var item;

	switch (strOperation)
	{
		case "add":
		{
			var objXML = xmlFactory.createInstance("DOM");
			item = objXML.createElement("ITEM");
			item.setAttribute(menus.ATTR_CAPTION, fileName);
			item.setAttribute(menus.ATTR_ID, "ID_SWITCH_FILE_"+idString);
			item.setAttribute(menus.ATTR_TITLEID, "TITLE_SWITCH_FILE");
			item.setAttribute(menus.ATTR_CHECKED, "eval_top.designStudio.explorer.isActiveFile('"+fileName+"')");
			this.windowMenu.appendChild(item);
			break;
		}
		case "remove":
		{
			item = this.windowMenu.selectSingleNode(".//ITEM[@id='ID_SWITCH_FILE_"+idString+"']");
			if(item)
				this.windowMenu.removeChild(item);
			break;
		}
		case "update":
		{
			if(typeof(newName) == "undefined") return;
			item = this.windowMenu.selectSingleNode(".//ITEM[@id='ID_SWITCH_FILE_"+idString+"']");
			if(item)
			{
				var newString=newName.replace(re,"/")
				item.setAttribute(menus.ATTR_CAPTION, newName);
				item.setAttribute(menus.ATTR_ID, "ID_SWITCH_FILE_"+newString);
				item.setAttribute(menus.ATTR_CHECKED, "eval_top.designStudio.explorer.isActiveFile('"+newName+"')");
			}
			break;
		}
	}
}
Explorer.prototype.isActiveFile=function(fileName)
{
	return ((fileName == this.activeFileName)?true:false);
}
Explorer.prototype.isFileOpen=function(fileName)
{
	if(this.openDocuments.item(fileName))
		return true;
	else
		return false;
}
Explorer.prototype.getWindowsMenu=function()
{
	return this.windowMenu;
}
Explorer.prototype.showNextWindow=function()
{
	var len = this.openDocuments.count;
	if (!len || len == 1) return;

	var activeDoc = this.openDocuments.item(this.activeFileName);
	if (!activeDoc) return;

	var idxNext = -1;
	for (var i=0; i < len; i++)
	{
		var doc = this.openDocuments.item(i);
		if (doc.fileName == activeDoc.fileName)
		{
			idxNext = (i == len-1 ? 0 : i+1);
			break;
		}
	}
	if (idxNext != -1)
	{
		var nextDoc = this.openDocuments.item(idxNext);
		this.setActiveWindow(nextDoc.fileName);
	}
}
Explorer.prototype.minimizeWindow=function(fileName)
{
	// called by the htc to add the minimized window in to the table.
	var doc = this.openDocuments.item(fileName);
	if(!doc)return;

	var re=/\\/g
	var parmName=fileName.replace(re,"\\\\")
	var onClick1 = "designStudio.explorer.changeMinWindowState('" + parmName + "', 'restore');";
	var onClick2 = "designStudio.explorer.changeMinWindowState('" + parmName + "', 'maximize');";
	var onClick3 = "designStudio.explorer.closeFile('" + parmName + "');";
	var onSelectStart = "designStudio.explorer.selectStart();";

	var mod = (doc.designer.activeDocument.getModifiedFlag()) ? " *" : "";
	var title = doc.designer.designerInfo.name + " - " + fileName.replace(re, "/")+mod;
	var strBtnStyle = "position:relative;height:15px;width:16px;margin:0px;background-position:center;background-repeat:no-repeat;";

	var minTable = document.getElementById("minTable");
	var elem = document.createElement("SPAN");
	elem.id = fileName + "_MIN";
	elem.className = "dsWindowTitle";
	elem.style.height = "20px";
	elem.style.width = "150px";
	elem.style.border = "outset threedface 2px";
	elem.style.backgroundColor = "inactivecaption";
	elem.style.color = "inactivecaptiontext";
	elem.onselectstart = designStudio.explorer.selectStart;
	elem.title = title;
	minTable.appendChild(elem);

	var strHtml = "<nobr><span style=\"top:0px;left:0px;height:20px;width:150px;\" ondblclick=\"" + onClick1 + "\">";
	strHtml += "<span style=\"top:0px;overflow:none;margin:4px;\">";

	if (doc.designer.designerInfo.icon && doc.designer.designerInfo.icon.length > 0)
		strHtml += "<img style=\"margin-left:4px;margin-right:2px;margin-top:2px;\" src=\"" + designStudio.path + "/"
			+ doc.designer.designerInfo.folder + "/" + doc.designer.designerInfo.icon + "\"></img>";

	strHtml += "</span><span style=\"top:0px;width:66px;text-overflow:ellipsis;overflow:hidden;\">" + title  + "</span><span style=\"margin:2px;top:0px;width:55px;\">";
	strHtml += "<input type=\"button\" class=\"dsWindowButton\" style=\"" + strBtnStyle
		+ "background-image=url(images/restore.gif);\" onclick=\"" + onClick1 + "\" title=\"Restore\"></input> ";
	strHtml += "<input type=\"button\" class=\"dsWindowButton\" style=\"" + strBtnStyle
		+ "background-image=url(images/maximize.gif);\" onclick=\"" + onClick2 + "\" title=\"Maximize\"></input> ";
	strHtml += "<input type=\"button\" class=\"dsWindowButton\" style=\"" + strBtnStyle
		+ "background-image:url(images/close.gif);\" onclick=\"" + onClick3 + "\" title=\"Close\"></input></span></span></nobr>";
	elem.innerHTML = strHtml;

	//Restore all
	if (!this.bRestoring)
	{
		this.restoreAll();
		var len = this.openDocuments.count;
		for(var i=0; i<len; i++)
		{
			var doc = this.openDocuments.item(i);
			if(!doc.designer.workSpace.minimized)
			{
				this.setActiveWindow(doc.fileName);
				break;
			}
		}
		if(i==len)	//all windows are minimized
		{
			this.setInactiveWindow();
			designStudio.menuBar.visible =true;
			designStudio.activeDesigner = null;
			dsToolBox.disableToolbox();
			dsPropArea.disablePA();
		}
	}
}
Explorer.prototype.changeMinWindowState=function(fileName, toState)
{
	// called by the minimized window in the table
	var doc = this.openDocuments.item(fileName);
	if(!doc)return;
	this.setActiveWindow(fileName);
	doc.designer.workSpace.setWindowState(toState);
	var elem = document.getElementById(fileName + "_MIN");
	if (elem)
		elem.parentElement.removeChild(elem);
}
Explorer.prototype.changeMinWindowState2=function(fileName)
{
	var len = this.openDocuments.count;
	for(var i=0; i<len; i++)
	{
		var doc = this.openDocuments.item(i);
		if(doc.designer.workSpace.maximized)
			break;
	}
	var state = (i==len)?"restore":"maximize";

	doc = this.openDocuments.item(fileName);
	if(!doc)return;
	doc.designer.workSpace.setWindowState(state);
	var elem = document.getElementById(fileName + "_MIN");
	if (elem)
		elem.parentElement.removeChild(elem);
}
Explorer.prototype.restoreAll=function()
{
	this.bRestoring = true;
	var i=0, len, doc;
	len = this.openDocuments.count;
	for(i=0; i < len; i++)
	{
		doc = this.openDocuments.item(i);
		if(doc.designer.workSpace.maximized)
			doc.designer.workSpace.setWindowState("restore");
	}
	this.bRestoring = false;
}
Explorer.prototype.minimizeAll=function()
{
	this.bRestoring = true;
	var i, len, doc;
	len = this.openDocuments.count;
	for(i=0; i<len; i++)
	{
		doc = this.openDocuments.item(i);
		if(!doc.designer.workSpace.minimized)
			doc.designer.workSpace.setWindowState("minimize");
	}
	this.setInactiveWindow();
	designStudio.menuBar.visible =true;
	designStudio.activeDesigner = null;
	dsToolBox.disableToolbox();
	dsPropArea.disablePA();
	this.bRestoring = false;
}
Explorer.prototype.closeFile=function(fileName)
{
	var doc = this.openDocuments.item(fileName);
	if(!doc)return;
	var bClose = doc.designer.activeDocument.onClose();
	if(!bClose)return;

	designStudio.ui.workSpace.removeChild(doc.designer.source.frameElement.parentElement);
	this.remove(fileName);

	if(this.openDocuments.count)
	{
		dsPropArea.clearAll();		//delete the prop table rows
		dsPropArea.removeAllIds();	//Clear the ids in the dropdown
		this.setActiveWindow(this.openDocuments.item(0).fileName);
	}
	else
		this.onCloseLastWindow();
}
Explorer.prototype.closeAll=function(bUnloading)
{
	// create array for the multi file save dialog
	var arrFiles=new Array();
	var doc, lenDocs, i, fObj;
	lenDocs = this.openDocuments.count;
	for(i=lenDocs-1; i>=0; i--)
	{
		doc = this.openDocuments.item(i);
		if (!doc.designer.activeDocument.getModifiedFlag()) continue;
		fObj=new FileStub(doc.fileName,doc.title,doc.designer);
		arrFiles.push(fObj);
	}

	// multisaveDlg returns a new array of files to save
	var ret=null
	if (arrFiles.length>0)
		ret=top.cmnDlg.multiSaveDlg(arrFiles);
	var lenFiles = (ret?ret.length:0);
	for(i=0; i<lenFiles; i++)
	{
		doc=this.openDocuments.item(ret[i]);
	 	doc.designer.activeDocument.saveDocument();
	}

	// close all documents
	if (bUnloading) return;
	for(i=lenDocs-1; i>=0; i--)
	{
		doc=this.openDocuments.item(i);
		designStudio.ui.workSpace.removeChild(doc.designer.source.frameElement.parentElement);
		this.remove(doc.fileName, true);
	}
	var minTable = document.getElementById("minTable");
	while (minTable.childNodes.length > 0)
		minTable.removeChild(elem.childNodes[0]);

	this.onCloseLastWindow();
}
Explorer.prototype.onCloseLastWindow=function()
{
	if (typeof(designStudio) != "undefined" && designStudio.activeDesigner)
	{
		designStudio.menuBar.visible =true;
		designStudio.activeDesigner.showPropertyArea(true);
		designStudio.activeDesigner = null;
	}
	if (typeof(dsToolBox) != "undefined")
		dsToolBox.disableToolbox();
	if (typeof(dsPropArea) != "undefined")
	{
		dsPropArea.clearAll();		//delete the prop table rows
		dsPropArea.removeAllIds();	//Clear the ids in the dropdown
		dsPropArea.disablePA();
	}
}
Explorer.prototype.renameDocument=function(qName, newFileName, newPath)
{
	var doc = this.openDocuments.item(qName);
	if(!doc) return;
	this.openDocuments.remove(qName);
	doc.fileName = newPath+"/"+newFileName;
	doc.fileName = doc.fileName.replace(/\\/g, "/");
	doc.fileName = doc.fileName.replace(/\/\//g, "/");
	if(doc.title == qName)
	{
		doc.title = doc.fileName;
		this.openDocuments.add(doc.fileName, doc);
		this.setTitle(doc.fileName, doc.title);
	}
	else
		this.openDocuments.add(doc.fileName, doc);


	this.updateWindowsMenu("update", qName, doc.fileName);
	if(this.activeFileName == qName)this.activeFileName = doc.fileName;
	doc.designer.workSpace.docName = doc.fileName;
	return doc.fileName;
}
Explorer.prototype.setTitle=function(fileName, title)
{
	var doc = this.openDocuments.item(fileName);
	if(!doc)return;
	doc.title = title;
	doc.designer.workSpace.setTitle(title);
}
Explorer.prototype.setEnable=function(id)
{
	var bEnable = false;
	try	{
		if (id == "nextwindow")
		{
			var minTable = document.getElementById("minTable");
			var minWin = minTable.childNodes.length;
			if (designStudio.explorer.openDocuments.count - minWin > 1)
				bEnable = true;
		}
	}
	catch(e) { }
	return bEnable;
}
Explorer.prototype.selectStart=function()
{
	return false;
}
Explorer.prototype.setInactiveWindow=function()
{
	if(this.activeFileName == "") return;
	var doc = this.openDocuments.item(this.activeFileName);
	doc.designer.workSpace.setInactiveWindow();
	doc.designer.menuBar.visible = false;
	dsPropArea.clearAll();		//delete the prop table rows
	dsPropArea.removeAllIds();	//Clear the ids in the dropdown
	var evtObj = designStudio.createEventObject(ON_WINDOW_INACTIVATE, null, null, this.activeFileName);
	doc.designer.eventHandler.processEvent(evtObj);
	this.activeFileName = "";
}
Explorer.prototype.setActiveWindow=function(fileName, bWindowMenu)
{
	if (typeof(bWindowMenu) == "undefined") bWindowMenu=false;
	if (this.activeFileName == fileName) return;
	if (this.activeFileName != "") this.setInactiveWindow();

	// activate the new window
	var doc = this.openDocuments.item(fileName);
	if (typeof(doc) == "undefined" || doc==null) return;

	designStudio.activeDesigner = doc.designer;
	var bWasMinimized=doc.designer.workSpace.minimized;
	var bWasRestored = (!bWasMinimized && !doc.designer.workSpace.maximized) ? true : false;
	if ((bWasMinimized || bWasRestored) && bWindowMenu)
		this.changeMinWindowState2(fileName);
	doc.designer.workSpace.setActiveWindow();
	// Draw the menu
	doc.designer.menuBar.visible = true;

	// And draw the toolbox
	if(doc.designer.toolBox)doc.designer.toolBox.paint();

	//update the property area - loading new controls list.
	if (typeof(dsPropArea) != "undefined") dsPropArea.addAllIds();		//add the new ids into the dropdown
	if (typeof(dsToolBox) != "undefined") dsToolBox.enableToolbox();
	if (typeof(dsPropArea) != "undefined") dsPropArea.enablePA();
	this.activeFileName = fileName;

	if (bWasMinimized)
	{
		var vu=doc.designer.workSpace.views.item(doc.designer.workSpace.view)
		vu.setActive()
		vu.setToolboxState()
		vu.setContent()
	}
	var evtObj = designStudio.createEventObject(ON_WINDOW_ACTIVATE, null, null, bWasMinimized);
	doc.designer.eventHandler.processEvent(evtObj);
}


// EventObject-----------------------------------------------------------------
function EventObject()
{
	this.eventId = "";
	this.windowEvent = null;
	this.cmdHistoryId = "";
	this.extraInfo = null;
}

// DefaultCommandHandler-------------------------------------------------------
function DefaultCommandHandler()
{
	this.receiver = "DESIGNSTUDIO";
	this.commandId = "";
	this.commandInfo = null;
}
DefaultCommandHandler.prototype.openDocumentObj=function(docObj)
{
	// called by execute for NEW, OPEN and RECENT.
	this.commandInfo = new Object();
	this.commandId=((docObj.actId && (docObj.actId=="new")) ? "ID_FILE_NEW" : "ID_FILE_OPEN");
	this.commandInfo.commandId = this.commandId;

	this.commandInfo.actId = (docObj.actId ? docObj.actId : "");
	this.commandInfo.id = (docObj.id ? docObj.id : "");
	this.commandInfo.docId = (docObj.docId ? docObj.docId : "");
	this.commandInfo.docName = (docObj.docName ? docObj.docName : "");
	this.commandInfo.docPath = (docObj.docPath ? docObj.docPath : "");
	this.commandInfo.provId = (docObj.provId ? docObj.provId : "");

	// wizard finder
	if (docObj.params)
		this.commandInfo.params=docObj.params;
	else
	{
		var desStub=(docObj.id ? designStudio.designers.item(docObj.id) : null);
		var docStub=((docObj.docId && desStub) ? desStub.getDoc(docObj.docId) : null);
		var wizrd=(docStub ? docStub.getWizard(docObj.actId) : null);
		if (wizrd && (wizrd.prov=="all" || wizrd.prov==this.commandInfo.provId))
		{
			var path=desStub.getDir()+"/"+wizrd.getPath();
			var frmArgs = new Array();
			frmArgs[0]=top;
			var dialogHeight=wizrd.getAttribute("dialogHeight");
			dialogHeight=(dialogHeight ? dialogHeight : 380);
			var dialogWidth=wizrd.getAttribute("dialogWidth");
			dialogWidth=(dialogWidth ? dialogWidth : 380);
			var strFeatures="dialogHeight:"+dialogHeight+"px;dialogWidth:"+
					dialogWidth+"px;center:yes;help:no;scroll:no;status:no;";
			var ds=window.showModalDialog(path,frmArgs,strFeatures);
			window.focus()
			if (typeof(ds) == "undefined") return;
			this.commandInfo.params = ds;
			// post-wizard sync
			docObj.params=ds;
			docObj.docName=(this.commandInfo.docName);
			docObj.docPath=(this.commandInfo.docPath);
		}
	}
	this.commandInfo.contents = (docObj.contents ? docObj.contents : "");
	if(this.commandInfo.docName && this.commandInfo.docPath)
	{
		var fileName = this.commandInfo.docPath + "/" + this.commandInfo.docName;
		fileName = fileName.replace(/\\/g, "/");
		fileName = fileName.replace(/\/\//g,"/");
		if(designStudio.explorer.isFileOpen(fileName))
		{
			designStudio.explorer.setActiveWindow(fileName);
			return;
		}
		else
			designStudio.pushRecentFileObj(docObj);
	}
	designStudio.loadDesigner(this.commandInfo);
}
DefaultCommandHandler.prototype.execute=function(commandId)
{
	var bHandled=false
	this.commandId = commandId;
	var ds=null;
	switch(this.commandId)
	{
	//------------------------------------------------------------ file menu
	case "ID_FILE_NEW":
	case "ID_FILE_OPEN":
		// usher is file new/existing/recent dialog.
		// send initial tab
		ds=new DataStorage();
		var actId=(this.commandId=="ID_FILE_NEW")?"new":"existing";
		ds.add("actId",actId);
		ds.add("retContent", false);
		var doc=(top.designStudio.activeDesigner?top.designStudio.activeDesigner.activeDocument:null);
		if (doc)
			ds.add("dirDS",doc.getDirDS(false));
		else
		{
			var dirDS=new top.DataStorage();
			dirDS.add("provId","remote");
			dirDS.add("setRoot","true");
			ds.add("dirDS",dirDS);
		}
		var docObj=top.cmnDlg.usher(ds);
		if (docObj)
			this.openDocumentObj(docObj);
		else
			window.focus()
		usher=null;
		bHandled=true;
  		break;
	case "ID_FILE_SAVE":
		if (designStudio.activeDesigner.activeDocument)
		{
			designStudio.activeDesigner.activeDocument.saveDocument();
			bHandled=true;
		}
		break;
	case "ID_FILE_SAVEAS":
		if (designStudio.activeDesigner.activeDocument)
		{
			designStudio.activeDesigner.activeDocument.saveAsDocument();
			bHandled=true;
		}
		break;
	case "ID_FILE_CLOSE":
		designStudio.explorer.closeFile(designStudio.explorer.activeFileName);
		bHandled=true;
		break;
	case "ID_RECENTCLR":
		designStudio.clearRecent();
		bHandled=true;
		break;
	case "ID_FILE_EXIT":
		window.close()
		bHandled=true;
		break;

	//------------------------------------------------------------ edit menu
	case "ID_EDIT_UNDO":
		if ( designStudio.activeDesigner && designStudio.activeDesigner.workSpace
		&& designStudio.activeDesigner.workSpace.editor.mode == "wysiwyg"
		&& designStudio.activeDesigner.activeDocument )
		{
			designStudio.activeDesigner.activeDocument.commandHistory.undo();
			bHandled=true;
		}
		break;
	case "ID_EDIT_REDO":
		if ( designStudio.activeDesigner && designStudio.activeDesigner.workSpace
		&& designStudio.activeDesigner.workSpace.editor.mode == "wysiwyg"
		&& designStudio.activeDesigner.activeDocument )
		{
			designStudio.activeDesigner.activeDocument.commandHistory.redo();
			bHandled=true;
		}
		break;
	case "ID_EDIT_DESELECTALL":
		if ( designStudio.activeDesigner
		&& designStudio.activeDesigner.workSpace.editor )
		{
			designStudio.activeDesigner.workSpace.editor.reset();
			designStudio.activeDesigner.activeDocument.bMultipleSelection=false;
			designStudio.activeDesigner.activeDocument.selectControlInstance(designStudio.activeDesigner.activeDocument.mainHost);
			bHandled=true;
		}
		break;

	case "ID_EDIT_DELETE":
		if ( designStudio.activeDesigner && designStudio.activeDesigner.workSpace
		&& designStudio.activeDesigner.workSpace.editor.mode == "wysiwyg"
		&& designStudio.activeDesigner.activeDocument)
		{
			if (designStudio.activeDesigner.activeDocument.activeControl 
			|| designStudio.activeDesigner.activeDocument.selectedControls)
			{
				if(typeof(designStudio.activeDesigner.workSpace.editor.doDelete) == "function")
				{
					designStudio.activeDesigner.workSpace.editor.doDelete();
					bHandled = true;
				}
			}
		}
		break;

	//------------------------------------------------------------ view menu
	case "ID_VIEW_PROPERTIES":
		if ( designStudio.activeDesigner
		&& designStudio.activeDesigner.workSpace.editor.mode == "wysiwyg"
		&& designStudio.activeDesigner.toolBox
		&& designStudio.ui.rightBar.style.display == "block"
		&& dsPropArea )
		{
			dsPropArea.setFocusPA();
			bHandled=true;
		}
		break;
	case "ID_VIEW_TOOLBOX":
		if ( designStudio.activeDesigner
		&& designStudio.activeDesigner.workSpace.editor.mode == "wysiwyg"
		&& designStudio.activeDesigner.toolBox
		&& designStudio.ui.leftBar.style.display == "block")
		{
			dsToolBox.setFocusToolbox();
			bHandled=true;
		}
		break;
	case "ID_VIEW_DESIGN":
		if (designStudio.activeDesigner
		&& designStudio.activeDesigner.activeDocument)
		{
			designStudio.activeDesigner.workSpace.switchView("design")
			bHandled=true;
		}
		break;
	case "ID_VIEW_SOURCE":
		if (designStudio.activeDesigner
		&& designStudio.activeDesigner.activeDocument)
		{
			designStudio.activeDesigner.workSpace.switchView("source")
			bHandled=true;
		}
		break;
	case "ID_VIEW_SCRIPT":
		if (designStudio.activeDesigner
		&& designStudio.activeDesigner.activeDocument)
		{
			designStudio.activeDesigner.workSpace.switchView("script")
			bHandled=true;
		}
		break;

	//------------------------------------------------------------ tools menu
	case "ID_API_BUILDER":
		if (!top.oApiWin || top.oApiWin.closed)
		{
			var strFeatures="top=10,left=80,width="+(top.document.body.clientWidth-100)+
					",height="+top.document.body.clientHeight+
					",resizable=1,scrollbars=1,status=0,toolbar=0,menubar=0,location=0";
			top.oApiWin = top.open(top.studioPath + "/tools/apibuilder/apibuilder.htm","_new2", strFeatures)
		}
		else
			top.oApiWin.focus()
		break;
	case "ID_TOOLS_REBUILDINDEX":
		var dlgArgs = new Array();
		dlgArgs[0]=top;
	 	var sFeatures="dialogWidth:400px;dialogHeight:280px;center:yes;help:no;scroll:no;status:no;";
		window.showModalDialog(studioPath+"/tools/utils/bldindex.htm", dlgArgs, sFeatures);
		window.focus()
		bHandled=true;
		break;
	case "ID_TOOLS_SETFORMPDL":
		var dlgArgs = new Array();
		dlgArgs[0]=top;
	 	var sFeatures="dialogWidth:400px;dialogHeight:490px;center:yes;help:no;scroll:no;status:no;";
		window.showModalDialog(studioPath+"/tools/utils/formpdl.htm", dlgArgs, sFeatures);
		window.focus()
		bHandled=true;
		break;
	case "ID_TOOLS_SETWIZPDL":
		var dlgArgs = new Array();
		dlgArgs[0]=top;
	 	var sFeatures="dialogWidth:400px;dialogHeight:280px;center:yes;help:no;scroll:no;status:no;";
		window.showModalDialog(studioPath+"/tools/utils/wizpdl.htm", dlgArgs, sFeatures);
		window.focus()
		bHandled=true;
		break;
	case "ID_TOOLS_OBJECTS":
		window.open(studioPath+"/tools/domref/dom.htm");
		bHandled=true;
		break;
	case "ID_TOOLS_OPTIONS":
		var dlgArgs = new Array();
		dlgArgs[0]=top;
	 	var sFeatures="dialogWidth:450px;dialogHeight:470px;center:yes;help:no;scroll:no;status:no;";
		window.showModalDialog(studioPath+"/dialogs/options.htm", dlgArgs, sFeatures);
		window.focus()
		bHandled=true;
		break;


	//------------------------------------------------------------ help menu
	case "ID_HELP_CONTENTS":
	case "ID_HELP_INDEX":
	case "ID_HELP_SEARCH":
	case "ID_HELP_TECHSUPPORT":
	case "ID_HELP_LAWSON":
		alert("Command not implemented")
		bHandled=true;
		break;

	case "ID_HELP_ABOUTSTUDIO":
	 	var sFeatures="dialogWidth:380px;dialogHeight:240px;center:yes;help:no;scroll:no;status:no;";
		var args = new Array(window);
		window.showModalDialog(studioPath+"/about.htm", args, sFeatures);
		window.focus()
		bHandled=true;
		break;

	//------------------------------------------------------------- window menu
	case "ID_WINDOW_CLOSEALL":
		if (designStudio.explorer.openDocuments.count)
		{
			if (designStudio.explorer.openDocuments.count > 1)
				designStudio.explorer.closeAll(false);
			else
				designStudio.explorer.closeFile(designStudio.explorer.activeFileName);
		}
		bHandled = true;
		break;
	case "ID_WINDOW_MINIMIZEALL":
		designStudio.explorer.minimizeAll();
		bHandled = true;
		break;
	case "ID_WINDOW_NEXT":
		designStudio.explorer.showNextWindow();
		bHandled = true;
		break;
	default:
		var index = this.commandId.indexOf("ID_SWITCH_FILE");
		if(index != -1)
		{
			var file = this.commandId.substr(15); // Filename is at the end.
			designStudio.explorer.setActiveWindow(file, true);
			bHandled = true;
		}
		break;
	}
	if (!bHandled)
	{
		var idr="ID_RECENT_";
		var r=this.commandId.indexOf(idr);
		if ( r > -1)
		{
			designStudio.openRecent(this.commandId.substr(idr.length));
			bHandled=true;
		}
	}
	return (bHandled);
}
DefaultCommandHandler.prototype.handleKeyboardEvent=function(evt)
{
	var bHandled = false;
	switch (evt.keyCode)
	{
		case keys.ENTER:
			if (designStudio.activeDesigner
			&& evt.srcElement.tagName == "INPUT"
			&& (evt.srcElement.id.indexOf("ctl_") >= 0 || evt.srcElement.id.indexOf("btn_") >= 0))
			{
				evt.srcElement.fireEvent("onclick", evt);
				bHandled = true;
			}
			break;

		case keys.ESCAPE:
			break;

		case keys.PAGE_DOWN:
			if (!evt.altKey && evt.ctrlKey && !evt.shiftKey)
			{
				if (designStudio.activeDesigner)
					bHandled=designStudio.activeDesigner.workSpace.switchNextView("dn")
			}
			break;

		case keys.PAGE_UP:
			if (!evt.altKey && evt.ctrlKey && !evt.shiftKey)
			{
				if (designStudio.activeDesigner)
					bHandled=designStudio.activeDesigner.workSpace.switchNextView("up")
			}
			break;

		case keys.AKEY:
			if (evt.ctrlKey && evt.altKey)
			{
				var strFeatures="dialogHeight:600px;dialogWidth:800px;edge:sunken;help:no;scroll:no;resizable:yes"
				var dlgArgs=new Array()
				dlgArgs[0]=top
				dlgArgs[1]=designStudio
				window.showModalDialog("debug.htm", dlgArgs, strFeatures)
				window.focus()
				bHandled = true;
			}
			break;

		case keys.PKEY:
			if (evt.altKey && evt.ctrlKey && !evt.shiftKey)
				bHandled = this.execute("ID_VIEW_PROPERTIES")
			break;

		case keys.TKEY:
			if (evt.altKey && evt.ctrlKey && !evt.shiftKey)
				bHandled = this.execute("ID_VIEW_TOOLBOX")
			break;

		case keys.WKEY:
			if (!evt.altKey && evt.ctrlKey && evt.shiftKey)
				bHandled = this.execute("ID_WINDOW_NEXT")
			break;

		case keys.YKEY:
			if (!evt.altKey && evt.ctrlKey && !evt.shiftKey)
				bHandled = this.execute("ID_EDIT_REDO")
			break;

		case keys.ZKEY:
			if (!evt.altKey && evt.ctrlKey && !evt.shiftKey)
				bHandled = this.execute("ID_EDIT_UNDO")
			break;
	}

	return (bHandled);
}

// DesignerInfo ---------------------------------------------------------------
function DesignerInfo(strFolder, DOMNode, stringTable)
{
	this.id = DOMNode.getAttribute("id");
	// During load designer get name from string table
	this.name = stringTable.getPhrase(DOMNode.getAttribute("phraseId"))
	this.folder = strFolder;
	this.indexHtm = DOMNode.selectSingleNode("./INDEXHTM").text;
	this.menu = DOMNode.selectSingleNode("./MENU").text;
	this.msgFile = DOMNode.selectSingleNode("./MESSAGE").text;
	this.icon = DOMNode.selectSingleNode("./ICON").text;

	this.toolbox = DOMNode.selectSingleNode("./TOOLBOX").text;
	if(this.toolbox == "")this.toolbox = "NONE";

	this.views = new LawCollection();
	var nodes = DOMNode.selectNodes(".//VIEW");
	var len = nodes.length;
	for (var i=0; i < len; i++)
	{
		var view = new Object();
		view.id = nodes[i].getAttribute("id");
		view.name = stringTable.getPhrase(nodes[i].getAttribute("phraseId"));
		view.editor = nodes[i].getAttribute("editor");
		view.src = nodes[i].getAttribute("src");
		view.defaultView = nodes[i].getAttribute("default");
		if(!view.defaultView)view.defaultView="n";
		if(view.defaultView == "y")	this.defaultView = view.name;

		view.leftBarWidth = nodes[i].getAttribute("lwidth");
		view.rightBarWidth = nodes[i].getAttribute("rwidth");
		this.views.add(view.id, view)
	}

	this.documentInfo = new LawCollection();

	nodes = DOMNode.selectNodes(".//DOCUMENT");
	len = nodes.length;
	for (i=0; i < len; i++)
	{
		var docInfo = new DocumentInfo(nodes[i]);
		this.documentInfo.add(docInfo.id, docInfo);
	}
}

// DocumentInfo----------------------------------------------------------------
function DocumentInfo(DOMNode)
{
	this.id = DOMNode.getAttribute("id");
	this.hosts = new LawCollection();
	var nodes = DOMNode.selectNodes(".//HOST");

	this.xmlstring = "";
	this.properties=new LawCollection();
	nodes = DOMNode.selectNodes(".//PROPERTY");
	var len = nodes.length;
	for(i=0; i<len; i++)
	{
		var property = new Property(nodes[i]);
		this.properties.add(property.id, property);
		this.xmlstring += nodes[i].xml;
	}

	var propPageNode = DOMNode.selectSingleNode(".//PROPERTYPAGE");
	this.propPage=null;
	if(propPageNode)
	{
		var propPage = new Object();
		propPage.label = designStudio.activeDesigner.stringTable.getPhrase(propPageNode.getAttribute("phraseId"));
		propPage.dialog = propPageNode.getAttribute("htm")?propPageNode.getAttribute("htm"):"";
		propPage.dialogHeight=propPageNode.getAttribute("height")?propPageNode.getAttribute("height"):"";
		propPage.dialogWidth=propPageNode.getAttribute("width")?propPageNode.getAttribute("width"):"";
		this.propPage = propPage;
		this.xmlstring += propPageNode.xml;
	}


	this.rules = new LawCollection();
	nodes = DOMNode.selectNodes(".//RULE");
	len = nodes.length;
	for(i=0; i<len; i++)
	{
		var rule = new Rule(nodes[i]);
		this.rules.add(rule.rule, rule);
	}
	var node = DOMNode.selectSingleNode(".//RULES");
	if(node)this.xmlstring += node.xml;

	this.events = new LawCollection();
	nodes = DOMNode.selectNodes(".//EVENT");
	len = nodes.length;
	for(i=0; i<len; i++)
	{
		var evt = new EventObj(nodes[i]);
		this.events.add(evt.id, evt);
		this.xmlstring += nodes[i].xml;
	}
}

// Designer -------------------------------------------------------------------
function Designer(id)
{
	this.id=id;
	this.designerInfo = null;
	this.menuBar = null;
	this.toolBox = null;
	this.source=null;
	this.activeDocument = null;
	this.cmdInfo = null;
	this.draw = null;
	this.commandHandler = null;
	this.propertyChangeNotify = null;
	this.stringTable = null;
	this.workSpace = null;
	this.readyState="initialized";
}
Designer.prototype.loadMenuBar=function(objXML)
{
	if(typeof(objXML) != "undefined")
	{
		if (!designStudio.menuMan)
		{
			designStudio.menuMan=new MenuManager();
			if (!designStudio.menuMan)
			{
				alert("Could not create menu manager! [1004]");
				return;
			}
		}

		var oMenuBar=document.getElementById("dsMenu");
		this.menuBar=oMenuBar.cloneNode(false);
		this.menuBar.id="dsMenuBar"+document.uniqueID;
		oMenuBar.parentNode.appendChild(this.menuBar);
		this.menuBar.menuMan=designStudio.menuMan;
		this.menuBar.xml=objXML;
		this.menuBar.visible=true;
  	}
	else if(this.menuBar)
	{
		this.menuBar.visible = true;
	}
}
Designer.prototype.loadToolbox=function(objXML)
{
	var dsToolbox = document.getElementById("dsToolBox");
	if(!dsToolbox)
	{
		dsToolbox = document.createElement("LWSN:TOOLBOX");
		dsToolbox.id = "dsToolBox";
		designStudio.ui.leftBar.appendChild(dsToolbox);
	}

	this.toolBox = new Toolbox(objXML);
	try {
		if (this.toolBox)
			this.toolBox.paint();
	}
	catch (e) {
		var msg = "An error occurred while loading the Toolbox: " +
				e.description + "\nPlease notify your system administrator.";
		cmnDlg.messageBox(msg, "ok", "stop");
		return false;
	}

	var prop = document.getElementById("dsPropArea");
	if(!prop)
	{
		prop = document.createElement("LWSN:PROPERTIES");
		prop.id = "dsPropArea";
		designStudio.ui.rightBar.appendChild(prop);
	}
	return true;
}
Designer.prototype.showToolbox=function(bShow)
{
	with(designStudio)
	{
		ui.leftBar.style.width = bShow?getUserPreference("LEFTBARWIDTH","15")+"%":"0%";
		ui.leftBar.style.display = bShow?"block":"none";
		ui.workSpace.style.width = (100 - (parseInt(ui.leftBar.style.width) + parseInt(ui.rightBar.style.width)))+"%";
	}
}
Designer.prototype.showPropertyArea=function(bShow)
{
	with(designStudio)
	{
		ui.rightBar.style.width = bShow?getUserPreference("RIGHTBARWIDTH","15")+"%":"0%";
		ui.rightBar.style.display = bShow?"block":"none";
		ui.workSpace.style.width = (100 - (parseInt(ui.leftBar.style.width) + parseInt(ui.rightBar.style.width)))+"%";
		if (explorer.openDocuments.count > 0)
			activeDesigner.workSpace.checkPlacement();
	}
}

// View------------------------------------------------------------------------
function View()
{
	this.id="";
	this.active=false;	// Currently active in a collection of views
	this.opened=false;	// Opened this view atleast once.
	this.bUpdatedProperty = false;
}
View.prototype.initialize=function(id)
{
	this.id = id;
	this.active=false;
	this.opened=false;
	this.enabled=true;
	this.bUpdatedProperty = false;
}
View.prototype.updateView=function()
{
	return;
}
View.prototype.setContent=function()
{
	return;
}
View.prototype.getContent=function()
{
	return;
}
View.prototype.setToolboxState=function()
{
	return;
}
View.prototype.setActive=function()
{
	return;
}
View.prototype.setInactive=function()
{
	return;
}
View.prototype.setScrolling=function(bEnable)
{
	if (typeof(bEnable) != "boolean")
		bEnable=true;
	var strEnable = bEnable ? "yes" : "no";
	return (designStudio.activeDesigner.workSpace.setScrolling(this.id, strEnable));
}
View.prototype.enableView=function(bEnable)
{
	if (typeof(bEnable) != "boolean")
		bEnable=true;
	designStudio.activeDesigner.workSpace.enableView(this.id, bEnable);
	this.enabled=bEnable;
}
View.prototype.isEnabled=function()
{
	return (this.enabled);
}

// PropertyView----------------------------------------------------------------
PropertyView.prototype = new View();
PropertyView.prototype.constructor = PropertyView;
PropertyView.superclass = View.prototype;
function PropertyView(id)
{
	PropertyView.superclass.initialize.call(this, id);
	this.enabled = false;
	this.opened = true;
}
PropertyView.prototype.updateView=function(ctl, name)
{
	if(typeof(ctl) == "undefined")
		return;
	else if(typeof(name) == "undefined")
		dsPropArea.updateValues(ctl);
	else
		dsPropArea.updateValues(ctl, name);
}
PropertyView.prototype.drawPropertyWindow=function(strDraw)
{
	switch(strDraw)
	{
		case "CLEAR_PA":
			dsPropArea.clearAll();
			dsPropArea.clearIdSelection();
			break;
		case "ID_MULTIPLECTLS":
			dsPropArea.paintMultipleControls();
			break;
	}
}

// DesignView------------------------------------------------------------------
DesignView.prototype = new View();
DesignView.prototype.constructor = DesignView;
DesignView.superclass = View.prototype;
function DesignView()
{
}
DesignView.prototype.initialize=function(id)
{
	this.bUpdatedProperty = false;
	DesignView.superclass.initialize.call(this, id);
}
DesignView.prototype.updateView=function(ctl, name)
{
	var dsUpdate = new DataStorage();
	var i=0;
	if (typeof(ctl) == "undefined")
	{
		ctl = designStudio.activeDesigner.activeDocument.controls.item(designStudio.activeDesigner.activeDocument.mainHost);
		if(!ctl)return;
	}

	if (typeof(name) == "undefined")
	{
		var ctldef=designStudio.activeDesigner.toolBox.getControlObject(ctl.ctlId, ctl.ctlGrpId);
		var len = ctldef.properties.count;
		for(i=0; i < len; i++)
		{
			dsUpdate.add(ctldef.properties.item(i).id,ctl.get(ctldef.properties.item(i).id));
		}
		designStudio.activeDesigner.workSpace.editors.item(this.id).updateElement(dsUpdate, ctl.id);
	}
	else
	{
		// update the control metrics
		dsUpdate.add(name,ctl.get(name));
		designStudio.activeDesigner.workSpace.editors.item(this.id).updateElement(dsUpdate, ctl.id);
	}
}

// DefaultDocument-------------------------------------------------------------
function DefaultDocument()
{
	this.designer = null;
	this.docId = "";
	this.docName = "";
	this.docPath = "";
	this.params = null;
	this.provId = "";
	this.qualifiedName = "";
	this.mainHost = "";
	this.readyState="";
	this.docInfo=null;
	this.activeControl = null;
	this.controls = null;
	this.bMultipleSelection=false;
	this.selectedControls=null;
	this.dirty=false;
	this.index=0;
	this.commandHistory = null;
}
DefaultDocument.prototype.initialize=function()
{
	this.designer = designStudio.activeDesigner;
	this.mainHost = "";

	var ci=this.designer.cmdInfo;
	if (ci)
	{
		this.docId=(ci.docId?ci.docId:null);
		this.docName=(ci.docName?ci.docName:null);
		this.docPath=(ci.docPath?ci.docPath:null);
		this.provId=(ci.provId?ci.provId:null);
		this.params=(ci.params?ci.params:null);
	}

	this.docInfo = (this.docId != "") ? this.designer.designerInfo.documentInfo.item(this.docId) : null;
	this.activeControl = null;
	this.controls = new LawCollection();
	this.bMultipleSelection=false;
	this.selectedControls=null;
	this.readyState="initialized"
	this.isNew=false;
	this.index=0;
	this.commandHistory = new CommandHistory();
}
DefaultDocument.prototype.setDocumentProperties=function()
{
	if(this.docId == "" || !this.docInfo) return;
	if(this.designer.toolBox)
	{
		// Have the document control defined.
		var xmlstring = "<?xml version='1.0'?><CONTROL id='" + this.docId + "' phraseId='" +
							this.docId + "' img='' target=''>" +
							this.docInfo.xmlstring + "</CONTROL>";
		var docDefn = xmlFactory.createInstance("DOM");
		docDefn.loadXML(xmlstring);

		var docControl = new Control(docDefn.documentElement,this.designer.toolBox.controlGroups.item(0).id);
		docControl.render=false;

		// Add the document properties to the first control group.
		this.designer.toolBox.controlGroups.item(0).controls.add(this.docId, docControl);

		// Create an Instance of the document and add it to the controls collection.
		var ctlInst = this.designer.toolBox.createInstance(this.docId);
		ctlInst.set("id", this.mainHost);
		ctlInst.id = this.mainHost;
		this.controls.add(ctlInst.id, ctlInst);
		this.activeControl = ctlInst;
		dsPropArea.addId(ctlInst.id);
		this.setModifiedFlag();
	}
}
DefaultDocument.prototype.createControlInstance=function(ctlId, propbag, bDraw)
{
	var ctlInst = this.designer.toolBox.createInstance(ctlId);
	if(!ctlInst)return null;

	if(typeof(propbag) != "undefined" && propbag != null)
	{
		var items=propbag.children();
		var len=propbag.length;
		for (var i = 0; i < len; i++)
		{
			ctlInst.set(items[i].name, items[i].value);
			if (items[i].name == "id")
				ctlInst.id = items[i].value;
		}
	}
	if(ctlInst.id == "")
	{
		ctlInst.id = ctlInst.ctlId+this.index++;
		ctlInst.set("id", ctlInst.id);
	}

	this.controls.add(ctlInst.id, ctlInst);
	this.activeControl = ctlInst;
	if (typeof(bDraw) == "undefined")
		bDraw=true;
	dsPropArea.addId(ctlInst.id);
	if (bDraw)
		this.designer.draw.drawControl(ctlInst);
	this.setModifiedFlag();
	var evtObj = designStudio.createEventObject(ON_CONTROL_INSTANCE_CREATED, null, null, ctlInst);
	designStudio.activeDesigner.eventHandler.processEvent(evtObj);
	return ctlInst;
}
DefaultDocument.prototype.copyControlInstance=function(ctlId, propbag)
{
	var ctl = this.controls.item(ctlId);
	var ctlInst = this.designer.toolBox.createInstance(ctl.ctlId);
	if(ctlInst.id == "")
		ctlInst.id = ctl.id+ "_copy" + ++this.index;

	// bring forward the original's property bag elements
	var items=ctl.propertyBag.elements.children();
	var len=ctl.propertyBag.elements.length
	for (var i = 0; i < len; i++)
	{
		switch (items[i].name) 
		{
			case "id":
				ctlInst.set(items[i].name, ctlInst.id);
				break;
			case "col":
				var offsetX=this.designer.workSpace.editor.getGridWidth() != 1 ? 2 : 30;
				ctlInst.set(items[i].name, parseInt(ctlInst.get("col"))+offsetX);
				break;
			case "row":
				var offsetY=this.designer.workSpace.editor.getGridWidth() != 1 ? 1 : 25;
				ctlInst.set(items[i].name, parseInt(ctlInst.get("row"))+offsetY);
				break;
			default:
				ctlInst.set(items[i].name, items[i].value);
				break;
		}
	}

	// were any 'override' properties supplied?
	if(typeof(propbag) != "undefined" && propbag != null)
	{
		items=propbag.children();
		len=propbag.length;
		for (var i = 0; i < len; i++)
		{
			ctlInst.set(items[i].name, items[i].value);
			if (items[i].name == "id")
				ctlInst.id = items[i].value;
		}
	}

	// bring forward the original's rule elements
	var items=ctl.rules.hash;
	var len=ctl.rules.count;
	for (var i = 0; i < len; i++)
		ctlInst.setRule(items[i], ctl.rules.elements[items[i]].value);

	this.controls.add(ctlInst.id, ctlInst);
	dsPropArea.addId(ctlInst.id);
	var htm = this.designer.draw.drawControl(ctlInst, null, ctlId);
	this.selectControlInstance(ctlInst.id);
	this.setModifiedFlag();

	var ctlCopy = new Object();
	ctlCopy.oldId = ctlId;
	ctlCopy.newId = ctlInst.id;
	var evtObj = designStudio.createEventObject(ON_CONTROL_INSTANCE_COPIED, null, null, ctlCopy);
	designStudio.activeDesigner.eventHandler.processEvent(evtObj);

	return ctlInst;
}
DefaultDocument.prototype.getControlInstance=function(ctlId)
{
	var ctl=this.controls.item(ctlId);
	return ctl ? ctl : null;
}
DefaultDocument.prototype.getControlObject=function(ctlInstId)
{
	try {
		var ctlInst=this.controls.item(ctlInstId);
		if (!ctlInst) return (null);

		var oGroup=this.designer.toolBox.controlGroups.item(ctlInst.ctlGrpId)
		if (!oGroup) return (null);

		var oControl=oGroup.controls.item(ctlInst.ctlId)
		return (oControl ? oControl : null);
	}
	catch (e) { return (null); }
}
DefaultDocument.prototype.getDirDS=function(bSave)
{
	// dialog data storage
	var dirDS=new top.DataStorage();
	if (this.provId) dirDS.add("provId",this.provId);
	if (!bSave)
	{
		dirDS.add("setRoot","true");
		return (dirDS);
	}

	// find top level for this designer
	var desStub=top.designStudio.designers.item(top.designStudio.activeDesigner.id);
	var folder=desStub ? desStub.getProvDir() : "";
	dirDS.add("topPath",top.contentPath+"/"+folder);

	if (this.designer.id) dirDS.add("id",this.designer.id);
	if (this.docName) dirDS.add("docName",this.docName);
	if (this.docPath) dirDS.add("docPath",this.docPath);
	if (this.docId) dirDS.add("docId",this.docId);
	if (this.dataId) dirDS.add("dataId",this.dataId);
	if (this.sysId) dirDS.add("sysId",this.sysId);
	return dirDS;
}
DefaultDocument.prototype.selectControlInstance=function(ctlId, containerId)
{
	if (this.readyState == "loading") return;
	this.activeControl = this.getControlInstance(ctlId);
	if(this.activeControl)
		this.activeControl.select();
	else
	{
		var evtObj = designStudio.createEventObject(ON_BEFORE_PA_CLEAR, null, null, ctlId);
		if (!designStudio.activeDesigner.eventHandler.processEvent(evtObj))
			return;
		this.designer.workSpace.views.item("PROPERTYAREA").drawPropertyWindow("CLEAR_PA");
	}
}
DefaultDocument.prototype.deleteControlInstance=function(ctlId,bNotify)
{
// if designer chooses, may provide control XML node to
// have available to drawControl method on an undelete

	// optional parameter
	bNotify = (typeof(bNotify) != "boolean" ? true : bNotify);

	var nullVal=null;
	if (!this.controls.item(ctlId)) 
		return nullVal;

	this.controls.item(ctlId).markDelete(true);
	this.activeControl=null;
	dsPropArea.removeId(ctlId);
	this.setModifiedFlag();
	if (bNotify)
	{
		var evtObj = designStudio.createEventObject(ON_CONTROL_INSTANCE_DELETED, null, null, ctlId);
		var evtRet=designStudio.activeDesigner.eventHandler.processEvent(evtObj);
	}

	// return node if we have one, otherwise return undefined
	return (typeof(evtRet) == "object" ? evtRet : nullVal);
}
DefaultDocument.prototype.undeleteControlInstance=function(ctlId,bNotify,bDraw,xml)
{
	// optional parameters
	bNotify = (typeof(bNotify) != "boolean" ? true : bNotify);
	bDraw = (typeof(bDraw) != "boolean" ? true : bDraw);
	xml = (typeof(xml) != "string" ? null : xml);

	var ctlInst = this.controls.item(ctlId)
	if (!ctlInst) return null;

	ctlInst.markDelete(false);
	dsPropArea.addId(ctlInst.id);
	if (bDraw)
		this.designer.draw.drawControl(ctlInst,xml);

	this.setModifiedFlag();

	if (bNotify)
	{
		var evtObj = designStudio.createEventObject(ON_CONTROL_INSTANCE_CREATED, null, null, ctlInst);
		designStudio.activeDesigner.eventHandler.processEvent(evtObj);
	}
	return ctlInst;
}
DefaultDocument.prototype.updateProperty=function(name, value, ctlId)
{
	var ctlInst = this.getControlInstance(ctlId)
	if (!ctlInst) return;

	ctlInst.set(name, value);
	this.updateAllViews(ctlInst, name);
	
	var ctl = this.designer.toolBox.getControlObject(ctlInst.ctlId, ctlInst.ctlGrpId);
	if (ctl.properties.elements[name].displayOnly == "0")
		this.setModifiedFlag();
}
DefaultDocument.prototype.updateProperties=function(dsNameVal, ctlId)
{
	var ctl = this.getControlInstance(ctlId)
	if (!ctl)return;

	var items=dsNameVal.children();
	var len=dsNameVal.length;
	for (var i = 0; i < len; i++)
		ctl.set(items[i].name, items[i].value);

	this.updateAllViews(ctl);
	this.setModifiedFlag();
}
DefaultDocument.prototype.setModifiedFlag=function(bModified, bCmdHistChanged)
{
	if (this.readyState != "complete") return;
	if (typeof(bModified) != "boolean")	bModified=true;
	if (typeof(bCmdHistChanged) == "undefined")bCmdHistChanged = true;
	if(this.dirty != bModified)
	{
		this.dirty = bModified;
		designStudio.activeDesigner.workSpace.setModifiedTitle(bModified);
		if(bModified && !bCmdHistChanged)this.commandHistory.setOtherChanges(true);
	}
}
DefaultDocument.prototype.getModifiedFlag=function()
{
	return (this.dirty);
}
DefaultDocument.prototype.updateAllViews=function(ctl, name)
{
	if (this.readyState == "loading") return;
	var view=null;
	var len = this.designer.workSpace.views.count;
	for (var i=0; i < len; i++)
	{
		view = this.designer.workSpace.views.item(i);
		if(view.bUpdatedProperty)
		{
			view.bUpdatedProperty = false;
			continue;
		}

		if (view.opened)
			view.updateView(ctl, name);
	}
}
DefaultDocument.prototype.startMultipleSelection=function(selectedElements)
{
	this.bMultipleSelection = true;
	this.selectedControls = selectedElements
	this.designer.workSpace.views.item("PROPERTYAREA").drawPropertyWindow("ID_MULTIPLECTLS");
}
DefaultDocument.prototype.cancelMultipleSelection=function()
{
	this.selectedControls = null;
	this.bMultipleSelection = false;
}
DefaultDocument.prototype.getControlRules=function(ctlInstId)
{
	var ctlInst = this.controls.item(ctlInstId);
	var rules = null;
	if(ctlInst)
		rules = ctlInst.getRules();
	return rules;
}
DefaultDocument.prototype.getSaveContents=function()
{
	// used by saveDocument to save file contents
	// should be overridden
	return "";
}
DefaultDocument.prototype.onClose=function()
{
	if (!this.isValid(true)) return (false);

	// returns true if close is acceptable
	if (!this.getModifiedFlag()) return (true);

	// prompt to save modified file
	var msg=this.docName + " " +top.designStudio.stringTable.getPhrase("MSG_FILE_MODIFIED") +
			"\n" + top.designStudio.stringTable.getPhrase("MSG_SAVE_CHANGES")
	var ret=top.cmnDlg.messageBox(msg,"yesnocancel");
	switch (ret)
	{
	case "cancel":
		return false;
		break;
	case "no":
		return true;
		break;
	case "yes":
		return (this.saveDocument());
		break;
	}
	return true;
}
DefaultDocument.prototype.isValid=function(bClosing)
{
	return (true);
}
DefaultDocument.prototype.saveAsDocument=function()
{
	if (!this.isValid(false, true)) return (false);

	// dialog data storage
	var inDS=new DataStorage();
	inDS.add("doc",this);
	inDS.add("dirDS",this.getDirDS(true));
	var outDS=top.cmnDlg.saveAsDlg(inDS);
	if (outDS)
	{
		// doc location from saveasdialog
		// defined by prov, path, and name
		if (outDS.prov && outDS.loc && outDS.name)
		{
			this.isNew=false;
			this.provId=outDS.prov;
			this.docPath=outDS.loc;
			this.setDocName(outDS.name);
			return (this.saveDocument());
		}
	}
	return false;
}
DefaultDocument.prototype.setDocName=function(name)
{
	// changes the filename for this doco before setting it
	// in default case, make sure .xml extension
	// override this function if you do not want this behavior
	var ext=(name && (name.length > 4)) ? name.substr(name.length-4) : "";
	if (ext != ".xml") name += ".xml";
	this.renameDocument(this.docName, name);
	this.docName=name;
}
DefaultDocument.prototype.renameDocument=function(oldName, newName)
{
	this.qualifiedName = designStudio.explorer.renameDocument(this.qualifiedName, newName, this.docPath);
}
DefaultDocument.prototype.saveDocument=function()
{
	if (!this.provId || !this.docPath || !this.docName || this.isNew)
		return (this.saveAsDocument());

	if (!this.isValid(false)) return (false);

	var bSuccess=false;
	var prov=designStudio.persist.getProv(this.provId);
	if (prov)
	{
		// bad path
		var newLoc=prov.cd(this.docPath);
		if (!newLoc) return false;

		// save datastorage used by provider - give all info
		var ds=new top.DataStorage();
		ds.add("overwrite",true);
		var contents=this.getSaveContents();
		if (contents) ds.add("contents",contents);
		if (this.designer.id) ds.add("id",this.designer.id);
		if (this.docName) ds.add("docName",this.docName);
		if (this.docPath) ds.add("docPath",this.docPath);
		if (this.provId) ds.add("provId",this.provId);
		if (this.docId) ds.add("docId",this.docId);
		var bRet = prov.put(ds);
		if (bRet)
		{
			bSuccess=true;
			this.setModifiedFlag(false);
			this.commandHistory.setSaveIndex();

			if (this.params) ds.add("params",this.params);
			designStudio.pushRecentFileDS(ds);

			window.status=designStudio.stringTable.getPhrase("MSG_FILE_SAVED");
		}
	}
	return (bSuccess);
}
DefaultDocument.prototype.acceptableId=function(oldId, newId)
{
    if (oldId==newId)
        return false;
    if (this.getControlInstance(newId))
	{
		var msg=designStudio.stringTable.getPhrase("MSG_DUPLICATE_ID_NOT_ALLOWED");
		top.cmnDlg.messageBox(msg,"ok","alert");
		return false;
	}
    return true;
}
DefaultDocument.prototype.updateInstanceId=function(oldId, newId)
{
	var ctlInst = this.controls.item(oldId);
	this.controls.remove(oldId)
	ctlInst.id = newId;
	this.controls.add(newId, ctlInst);
	dsPropArea.changeId(oldId, newId);
    return true;
}

// CommandHistory--------------------------------------------------------------
function CommandHistory()
{
	this.commands = new LawCollection();
	this.index = -1;
	this.navIndex = -1;
	this.saveIndex = -1;
	this.key = "c";
	this.isNavigating = false;
	this.otherChanges = false;
}
CommandHistory.prototype.add = function(command)
{
	var strKey = "";
	if (designStudio.activeDesigner.activeDocument.readyState=="loading")
		return strKey;
	if (!this.isNavigating)
	{
		// some undo's have taken place
		if (this.index > this.navIndex)
		{
			for (var x=this.index; this.navIndex<x; x--)
				this.remove(this.key + x);
			this.index = x;
		}

		this.index++;
		this.navIndex = this.index;
		var commandCollection = new LawCollection();
		commandCollection.add(command.initiator, command);
		strKey = this.key+this.index;
		this.commands.add(strKey, commandCollection);
		return strKey;
	}
	return strKey;
}
CommandHistory.prototype.addTo=function(command, commandIndex)
{
	if(!this.isNavigating)
	{
		var commandCollection = this.commands.item(commandIndex);
		if(commandCollection)
		{
			commandCollection.add(command.initiator, command);
			return true;
		}
		return false;
	}
	return false;
}
//TODO: update does an add when it should be replacing the command. add places another command onto the stack MAF
CommandHistory.prototype.update=function(command, commandIndex)
{
	if(!this.isNavigating)
	{
		var commandCollection = this.commands.item(commandIndex);
		if(commandCollection)
		{
			commandCollection.add(commandCollection.initiator, command);
			return true;
		}
		return false;
	}
	return false;
}
CommandHistory.prototype.removeAll = function()
{
	this.commands = new LawCollection();
	this.index = -1;
	this.navIndex = -1;
	this.saveIndex = -1;
	this.key = "c";
	this.isNavigating = false;
}
CommandHistory.prototype.canRedo = function()
{
	return (this.navIndex < this.index) ? true : false;
}
CommandHistory.prototype.canUndo = function()
{
	return (this.navIndex > -1) ? true : false;
}
CommandHistory.prototype.remove = function(index)
{
	this.commands.remove(index);
}
CommandHistory.prototype.undo = function()
{
	// redo's have been done back to present location and now an undo is being done
	if (this.navIndex > this.index)
		this.navIndex = this.index;

	if (this.navIndex > -1)
	{
		this.isNavigating = true;
		var commandCollection = this.commands.item(this.key + this.navIndex);
		var len = commandCollection.count;
		for(var i=0; i<len; i++)
		{
			var evtObj = parent.designStudio.createEventObject(parent.ON_BEFORE_UNDO, null, null, commandCollection.item(i));
			parent.designStudio.activeDesigner.eventHandler.processEvent(evtObj);
			commandCollection.item(i).unExecute();
		}
		this.navIndex--;
		this.checkSaveIndex();
		this.isNavigating = false;
	}
}
CommandHistory.prototype.redo = function()
{
	// allow redo only if an undo has taken place
	if (this.navIndex <= this.index)
	{
		this.navIndex++;

		// don't allow redo beyond present location
		if (this.navIndex > this.index)
			return;

		this.isNavigating = true;
		var commandCollection = this.commands.item(this.key + this.navIndex);
		var len = commandCollection.count;
		for(var i=0; i<len; i++)
		{
			var evtObj = parent.designStudio.createEventObject(parent.ON_BEFORE_REDO, null, null, commandCollection.item(i));
			parent.designStudio.activeDesigner.eventHandler.processEvent(evtObj);
			commandCollection.item(i).execute();
		}
		this.checkSaveIndex();
		this.isNavigating = false;
	}
}
CommandHistory.prototype.setOtherChanges=function(bChange)
{
	this.otherChanges = bChange;
}
CommandHistory.prototype.setSaveIndex=function()
{
	this.saveIndex = this.navIndex;
	this.setOtherChanges(false);
}
CommandHistory.prototype.checkSaveIndex=function()
{
	if(this.navIndex == this.saveIndex && !this.otherChanges)
		designStudio.activeDesigner.activeDocument.setModifiedFlag(false);
	else
		designStudio.activeDesigner.activeDocument.setModifiedFlag(true);
}
