/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/pages/pages.js,v 1.69.2.14.4.34.6.7.2.7.2.1 2012/11/12 06:05:40 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.692 2013-12-12 04:00:00 */
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

var portalWnd=null;
var portalObj=null;

var page;
var pageURI;
var defaultURI;

function initPage()
{
	var gtResp;
	var gtApi;
	var incNode;
	var oNode;

	portalWnd=envFindObjectWindow("lawsonPortal");
	if (!portalWnd) return;

	// load the script versions
	envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

	portalObj=portalWnd.lawsonPortal;
	pageURI=portalObj.path+"/pages";
	defaultURI=portalObj.path+"/content/pages";

	var parms=getVarsFromURL();
	var prev=portalObj.previewMode?true:false;
	var lang=portalWnd.oUserProfile.getAttribute("language");
	var cmp=("COMPOSITE" in parms);

	if(prev && !cmp)
		gtResp=portalObj.preview.XMLDocument;
	else
	{
		if(("FILE" in parms)==false)
		{
			var msg="FILE "+portalObj.getPhrase("msgErrorMissingParameter")+"\n"+document.location;
			portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
						
			if (portalObj.backURL != portalWnd.getHome()) 
				 portalWnd.goBack();
			
			return;
		}
		gtApi="/servlet/gettrav?src=";
		if(parms.FILE.charAt(0)=="/")
			gtApi+=parms.FILE;
		else
			gtApi+=defaultURI+"/"+parms.FILE;

		if(lang!="" && lang!=" " && lang!="language")
			gtApi+="&language="+lang;
		gtResp=portalWnd.httpRequest(gtApi,null,"","",false);
	}

	// check for errors retrieving XML
	var msg="Error calling gettrav service:\n";
	if (portalWnd.oError.isErrorResponse(gtResp,true,true,true,msg,window))
	{
		// if back is home, don't want to go there:
		// home page could have tried to open this page
		if (portalObj.backURL != portalWnd.getHome()) 
			 portalWnd.goBack();
		return;
	}

	// instantiate new PortalPage object
	page=new PortalPage(gtResp);
	page.parameters=parms;
	page.preview=prev;
	page.language=lang;
	if(cmp)
		page.phrases=parent.page.phrases;
	else
		page.phrases=loadMessagesFile("pages");

	if(page.phrases==null)
	{
		var msg=portalObj.getPhrase("ERROR_LOAD_XML")+": phrases.";
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);

		if (portalObj.backURL != portalWnd.getHome()) 
			 portalWnd.goBack();
			 
		return;
	}
	portalObj.setMessage(page.phrases.getPhrase("pageLoading"));
	if(!page.title)page.title=page.phrases.getPhrase("portalPage")
	page.buildDataSrc();
	page.buildDataMap();
	page.buildContentObjects();
	page.buildMenuObjects();

	//Load custom script modules into page
	incNode=page.pageDOM.getElementsByTagName("INCLUDE")[0];
	if (incNode && (incNode.hasChildNodes()))
	{
		for(var i=0;i<incNode.childNodes.length;i++)
		{
			oNode=incNode.childNodes[i];
			if(oNode.nodeType!=3 && oNode.nodeType!=4)
			{
				loadCustomScript("file",oNode.getAttribute("name"));
			}
		}
	}
	incNode=page.pageDOM.getElementsByTagName("XSCRIPT")[0];
	if (incNode && (incNode.hasChildNodes()))
	{
		oNode=incNode.childNodes[0];
		loadCustomScript("text",oNode.nodeValue);
	}
	page.eventSink(page.id,"OnInit");

	// transform Page Content
	for (incNode in page.objects)
	{
		incNode=page.objects[incNode];
		if("refresh" in incNode)
			incNode.refresh(page.dataSource);
		else
			incNode.render();
	}

	portalObj.setTitle(page.title)
	portalObj.setMessage("");
	
	if (portalObj.isPortalPage && portalWnd.oPortalConfig.isPortalLessMode())
	{
		if (!portalObj.tabArea.tabs["HOME"].visible && !portalObj.tabArea.tabs["MENU"].visible && !portalObj.tabArea.tabs["PAGE"].visible)
			portalObj.tabArea.collapse();
		else
			portalObj.tabArea.expand();
	}
}

function unloadPage()
{
	try{
		page.eventSink(page.id,"OnTerminate");
		if (window.parent == portalWnd)
			portalWnd.formUnload();
	}catch(e){}
}

function pageOnKeyDown(evt)
{
    evt = portalWnd.getEventObject(evt);
    if (!evt) return false;

	// check with portal for hotkey action
	var action = portalWnd.getFrameworkHotkey(evt,"portalpage");
	if ( !action )
	{
		// framework handled the keystroke
		portalWnd.setEventCancel(evt);
		return false;
	}

	// hotkey defined for this keystroke
	if (action != "portalpage")
	{
		cntxtActionHandler(evt,action);
		portalWnd.setEventCancel(evt);
		return false;
	}
}

function cntxtActionHandler(evt,action)
{
	if (action==null)		// called by the portal
	{
		action = portalWnd.getFrameworkHotkey(evt,"portalpage");
		if (!action || action=="portalpage")
			return false;
	}
	var bHandled=false;
	switch (action)
	{
		case "doRefresh":
			window.location.reload();
			bHandled = true;
			break;
		case "doPageUp":
		case "doPageDn":
			if(page.currentObjId != "")
			{
				var obj = page.objects[page.currentObjId];
				if (obj && (obj.type == "DME" || obj.type == "AGS"))
				{
					var objBtn = (action == "doPageUp") 
							? document.getElementById("btnPrev_"+obj.id)
							: document.getElementById("btnNext_"+obj.id);
					if(objBtn && objBtn.style.display == "block")
					{
						if (portalObj.browser.isIE)
							objBtn.fireEvent("onclick");
						else
							objBtn.click();
						bHandled = true;
					}
				}
			}
			break;
		case "posInFirstField":
			break;
	}
	return (bHandled);
}
//Object Definitions ------------------------------------------------------------------------------
//Page object
function PortalPage(DOM)
{
	this.pageDOM=DOM;
	this.objects=new Object();
	this.dataSource=new PortalStorage();
	this.rulesByObject=new RuleStorage();
	this.rulesByField=new RuleStorage();
	this.phrases=null;
	this.parameters=null;
	this.preview=null;
	this.language="";
	this.currentObjId=""
	this.id=this.pageDOM.documentElement.getAttribute("id");
	this.title=this.pageDOM.documentElement.getAttribute("TITLE")
	this.formlets=new PortalStorage();
	this.state=new Object();
	this.state.maximized = false;
	this.state.hiddenObjects = new PortalStorage();
}
PortalPage.prototype.buildDataSrc=function()
{
	var dsNode;
	var oNode;
	var oNodes;
	var nm;
	var val;
	var fld;
	var objRef;

	dsNode = this.pageDOM.getElementsByTagName("DATASRC");
	if (!dsNode)
		return;
	oNode=dsNode[0];
	if (!oNode)
		return;
	oNodes=oNode.getElementsByTagName("ELEMENT");
	for(var i=0;i<oNodes.length;i++)
	{
		oNode=oNodes[i];
		nm=oNode.getAttribute("id");
		if(oNode.hasChildNodes())
		{
			val=oNode.childNodes[0].nodeValue;
			if(val.indexOf("LAW_WEB_USR")!=-1)
			{
				val=val.substr(12);
				val=portalWnd.oUserProfile.getAttribute(val);
			}
		}
		else
			val="";
		this.dataSource.addElement(nm,val);
	}
}
PortalPage.prototype.buildDataMap=function()
{
	var dmNode;
	var oNode;
	var oNodes;
	var nm;
	var val;
	var fld;
	var objRef;

	dmNode = this.pageDOM.getElementsByTagName("DATAMAP");
	if (!dmNode)
		return;
	oNode=dmNode[0];
	if (!oNode)
		return;
	oNodes=oNode.getElementsByTagName("ELEMENT");
	for(var i=0;i<oNodes.length;i++)
	{
		oNode=oNodes[i];
		//create rules by Object and rules by Field
		nm=oNode.getAttribute("nglt");
		val=oNode.getAttribute("id");
		fld=oNode.childNodes[0].nodeValue;
		this.rulesByObject.addRule(nm,fld,val);
		this.rulesByField.addRule(fld,nm,val);
	}
}
PortalPage.prototype.buildContentObjects=function()
{
	var nNode;
	var oNode;
	var oNodes;
	var nm;
	var val;
	var fld;
	var objRef;

	nNode=this.pageDOM.getElementsByTagName("NUGGLETS");
	if (!nNode)
		return;
	oNode=nNode[0];
	if (!oNode)
		return;
	oNodes=oNode.childNodes;
	for(var i=0;i<oNodes.length;i++)
	{
		oNode=oNodes[i];
		if(oNode.nodeType!=3 && oNode.nodeType!=4)
		{
			nm=oNode.getAttribute("id");
			val=oNode.getAttribute("tp").toUpperCase();
			switch(val)
			{
				case "NUGTXT":
				{
					this.objects[nm]=new Text(oNode);
					break;
				}
				case "HTM":
				{
					this.objects[nm]=new HTML(oNode);
					break;
				}
				case "NUGIMG":
				{
					this.objects[nm]=new PageImage(oNode);
					break;
				}
				case "RPT":
				{
					this.objects[nm]=new Report(oNode);
					break;
				}
				case "RSS":
				{
					this.objects[nm]=new RSS(oNode);
					break;
				}
				case "DME":
				{
					this.objects[nm]=new DME(oNode);
					break;
				}
				case "IDA":
				{
					this.objects[nm]=new IDA(oNode);
					break;
				}
				case "FRMLT":
				{
					this.objects[nm]=new Formlet(oNode);
					this.formlets.addElement(nm, this.objects[nm].refreshData);
					break;
				}
				case "AGS":
				{
					this.objects[nm]=new AGS(oNode);
					break;
				}
				case "CMP":
				{
					this.objects[nm]=new Composite(oNode);
					break;
				}
				default:
				{
					objRef=new Object();
					this.objects[nm]=objRef;
					objRef.refresh=nullPointerRef;
					objRef.render=nullPointerRef;
					break;
				}
			}
		}
	}
}
PortalPage.prototype.buildMenuObjects=function()
{
	var nNode;
	var oNode;
	var oNodes;
	var nm;
	var val;
	var fld;
	var objRef;

	nNode=this.pageDOM.getElementsByTagName("NAVLETS");
	if (!nNode)
		return;
	oNode=nNode[0];
	if (!oNode)
		return;
	oNodes=oNode.childNodes;
	for(var i=0;i<oNodes.length;i++)
	{
		oNode=oNodes[i];
		if(oNode.nodeType!=3 && oNode.nodeType!=4)
		{
			nm=oNode.getAttribute("id");
			this.objects[nm]=new Menu(oNode);
		}
	}
}
PortalPage.prototype.addElement=function(name,value)
{
	this.dataSource.addElement(name,value);
}
PortalPage.prototype.removeElement=function(name)
{
	this.dataSource.removeItem(name);
}
PortalPage.prototype.addObject=function(name,object)
{
	this.objects[name]=object;
}
PortalPage.prototype.removeObject=function(name)
{
	this.objects[name]=null;
}
PortalPage.prototype.setObjectValues=function(objectId,pStorageObject)
{
	portalObj.setMessage(this.phrases.getPhrase("updateDatasrc"));
	var nm;
	var val;
	this.transaction=new TransObject();

	// To enable formlets to do a refresh even if the keys do not change...
	var bTransact = false;
	var fmlt;
	for(fmlt in this.formlets)
	{
		if(typeof(this.formlets[fmlt]) != "function")
		{
			if (this.formlets[fmlt])
			{
				bTransact = true;
				break;
			}
		}
	}
	var rules=this.rulesByObject[objectId];	//Mappings for an Object
	for(nm in rules)
	{
		if(typeof(rules[nm])!="function")	//x in y iterates properties and functions
		{
			val=rules[nm];	//Object Field name
			val=pStorageObject[val];	//Object Field value
			if(val!=this.dataSource[nm] || bTransact)
			{
				this.dataSource[nm]=val;	//Set Page Field value
				this.transaction.addTransByFieldRules(nm);
			}
		}
	}
	portalObj.setMessage(page.phrases.getPhrase("triggerRefresh"));
	this.transaction.removeTransaction(objectId)
	this.transaction.transact();
	if(this.parameters.COMPOSITE)this.setParentDataSource(rules,pStorageObject);
	portalObj.setMessage("");
}
PortalPage.prototype.setParentDataSource=function(rules,pStorageObject)
{
	var nm, val;
	if(!window.parent.page)return;
	var datasrc = window.parent.page.dataSource;
	for(nm in rules)
	{
		if(typeof(rules[nm])!="function")	//x in y iterates properties and functions
		{
			val=rules[nm];	//Object Field name
			val=pStorageObject[val];	//Object Field value
			window.parent.page.setElementValue(nm, val);
		}
	}
	if(window.parent.page.transaction)window.parent.page.transaction.transact();
}
PortalPage.prototype.getObjectValues=function(objectId)
{
	var nm;
	var val;
	var ret=new PortalStorage();
	var rule=this.rulesByObject[objectId];
	for(nm in rule)
	{
		if(typeof(rule[nm])!="function")
		{
			val=rule[nm];
			if(val in ret)
			{
				if(ret[val]=="" && this.dataSource[nm]!="")
				ret[val]=this.dataSource[nm];
			}
			else
				ret.addElement(val,this.dataSource[nm]);
		}
	}
	return ret;
}
PortalPage.prototype.setElementValue=function(name,value)
{
	if(this.transaction==null)
		this.transaction=new TransObject();
	if(typeof(value)=="undefined")
		value="";
	if(value!=this.dataSource[name])
	{
		this.dataSource[name]=value;
		this.transaction.addTransByFieldRules(name);
	}
}
PortalPage.prototype.getElementValue=function(name)
{
	return this.dataSource[name];
}
PortalPage.prototype.addMapping=function(objectId,pageField,objectField)
{
	this.rulesByObject.addRule(objectId,pageField,objectField);
	this.rulesByField.addRule(pageField,objectId,objectField);
}
PortalPage.prototype.removeMapping=function(objectId,pageField)
{
	this.rulesByObject.removeRule(objectId,pageField);
	this.rulesByObject.removeRule(pageField,objectId);
}
PortalPage.prototype.eventSink=function(evtSource, evtName)
{
	try
	{
		if(typeof(window[evtSource+"_"+evtName])=="function")
		{
			if (arguments.length == 2)
				return (eval(evtSource+"_"+evtName+"()"));
			if (arguments.length == 3)
				return (eval(evtSource+"_"+evtName+"("+
					(typeof(arguments[2])=="string"?"'"+arguments[2]+"'":arguments[2])+")"));
			if (arguments.length == 4 && evtSource.indexOf("rpt") == 0)
				return (eval(evtSource+"_"+evtName+"("+
					(typeof(arguments[2])=="string"?"'"+arguments[2]+"'":arguments[2])+","+
					(typeof(arguments[3])=="string"?"'"+arguments[3]+"'":arguments[3])+")"))
			return true;
		}
		else
			return true;
	}
	catch (e)
	{
		var prefMsg=page.phrases.getPhrase("ERR_EVENT") + 
				( evtSource || evtName ? " - "+evtSource+"_"+evtName :"" );
		portalWnd.oError.displayExceptionMessage(e,"pages/pages.js","PortalPage.eventSink",prefMsg);
		return false;
	}
}
PortalPage.prototype.setCurrentObj=function(e)
{
	var srcObj = e?e.currentTarget:window.event.srcElement;
	for(;srcObj.parentNode!=null;)
	{
		if(srcObj.parentNode.id == "portalpage" 
			|| srcObj.parentNode.id.indexOf("divcontfrmlt_") == 0
			|| srcObj.parentNode.id.indexOf("divcontCMP_") == 0)break;
		srcObj=srcObj.parentNode;
	}
	if(typeof(srcObj.type) == "undefined" || typeof(srcObj.id) == "undefined")return;
	if(page.currentObjId != srcObj.id)
	{
		page.onDeactivateObject(page.currentObjId)
		page.currentObjId = srcObj.id
		page.onActivateObject(page.currentObjId)
	}
}
PortalPage.prototype.onActivateObject=function(objId)
{
	var obj=this.objects[objId]
	if(!obj || typeof(obj)=="undefined")return;
	switch(obj.type.toUpperCase())
	{
		case "DME":
			if(obj.filter)
				obj.dmeDrawFilter()
			break;
		case "IDA":
			var navObj = portalObj.tabArea.tabs["PAGE"].navletObjects["drlViews"+obj.id]
			if(navObj)navObj.show()
			navObj = portalObj.tabArea.tabs["PAGE"].navletObjects["drlFind"+obj.id]
			if(navObj)navObj.show()
			break;
	}
}
PortalPage.prototype.onDeactivateObject=function(objId)
{
	var obj=this.objects[objId]
	if(!obj || typeof(obj)=="undefined")return;
	switch(obj.type.toUpperCase())
	{
		case "DME":
			if(obj.filter)
				portalObj.tabArea.tabs["PAGE"].removeNavlet(obj.id+"_filterNav")
			break;
		case "IDA":
			var navObj = portalObj.tabArea.tabs["PAGE"].navletObjects["drlViews"+obj.id]
			if(navObj)navObj.hide()
			navObj = portalObj.tabArea.tabs["PAGE"].navletObjects["drlFind"+obj.id]
			if(navObj)navObj.hide()
			break;
	}
}

PortalPage.prototype.manageLeftBar=function(bShow)
{
	if(bShow)
	{
		this.onActivateObject(this.currentObjId)
	}
	else
	{
		var navObjs = portalObj.tabArea.tabs["PAGE"].navletObjects
		if (navObjs)
		{
			var id, navlet
			for (id in navObjs)
			{
				navlet = navObjs[id]
				if(navlet)
					navlet.hide()
			}
		}
	}
}
PortalPage.prototype.drawTitleBar=function(nugObj, bRelative, bDrawMaxBtn)
{
	if(!nugObj)return;
	if(typeof(bRelative) == "undefined")bRelative = false;

	var titleElm = document.createElement("DIV");
	titleElm.className = "TitleBar"
	titleElm.id = "title_"+nugObj.id;

	if(bRelative)
	{
		titleElm.style.position="relative";
		titleElm.style.left = "0px";
		titleElm.style.top = "0px";
	}
	else
	{
		titleElm.style.position="absolute";
		titleElm.style.left = nugObj.left+"px";
		titleElm.style.top = nugObj.top+"px";
	}
	titleElm.style.height = "20px";
	titleElm.style.width = "100%";

	var titleTab = document.createElement("TABLE");
	titleTab.style.width = "100%";
	titleTab.id = "titleTab_"+nugObj.id;
	titleTab.border = "0px";
	titleTab.cellPadding = "0px";
	titleTab.cellSpacing = "0px";
	titleElm.appendChild(titleTab);

	var objRow, cell0, cell1;
	objRow = titleTab.insertRow(titleTab.rows.length);
	objRow.className = "TitleBarFill";

	cell0 = objRow.insertCell(0);
	cell0.width = "89%";
	cell0.className = "TitleBar";
	cell0.align = "left";
	cell0.appendChild(document.createTextNode(nugObj.title));

	cell1 = objRow.insertCell(1);
	cell1.width = "11%";
	cell1.align = "right"
	if (bDrawMaxBtn)
	{
		var image = document.createElement("IMG");
		cell1.appendChild(image);
		image.id = "Maxbtn_"+nugObj.id;
		image.src = "../images/ico_maximize.gif";
		image.alt = page.phrases.getPhrase("maximize");
		image.container = nugObj.id
		image.style.marginTop="1px";
		image.style.marginRight="4px";
		image.onclick = nuggletMaximize;
	}

	return titleElm;
}

function nuggletMaximize(e)
{
	var img=e?e.currentTarget:window.event.srcElement;
	//var id = img.getAttribute("container");
	var id = img.container;
	var objNugglet = page.objects[id];
	var htmId=id;
	if(objNugglet.type == "frmlt" || objNugglet.type == "CMP")
		htmId = "divcont"+objNugglet.type+"_"+id;

	var elemNugglet = document.getElementById(htmId);
	elemNugglet.style.left = "10px";
	elemNugglet.style.top = "0px";
	elemNugglet.style.height = (portalObj.browser.isIE ? "99%" : "98%");
	elemNugglet.style.width = (portalObj.browser.isIE ? "99%" : "98%");
	elemNugglet.style.zIndex = 9999;
	page.state.maximized = true;

	var obj;
	for (obj in page.objects)
	{
		if (obj == id) continue;
		obj = page.objects[obj];
		if (obj.type.toLowerCase() == "menu" 
		|| obj.type.toLowerCase() == "transfer" 
		|| obj.type.toLowerCase() == "user")
			continue;

		var htmElem = (obj.type == "frmlt" || obj.type == "CMP")
				? document.getElementById("divcont"+obj.type+"_"+obj.id)
				: document.getElementById(obj.id);
		if(htmElem)
		{
			if(htmElem.style.visibility == "hidden")
				page.state.hiddenObjects.addElement(id, true);
			else
			{
				page.state.hiddenObjects.addElement(id, false);
				htmElem.style.visibility = "hidden";
			}
		}
	}

	img.src = "../images/ico_restore.gif";
	img.alt = page.phrases.getPhrase("restore");
	img.onclick = nuggletRestore;
}

function nuggletRestore(e)
{
	var img=e?e.currentTarget:window.event.srcElement;
	//var id = img.getAttribute("container");
	id = img.container;
	var objNugglet = page.objects[id];

	var htmId=id;
	if(objNugglet.type == "frmlt" || objNugglet.type == "CMP")
		htmId = "divcont"+objNugglet.type+"_"+id;

	var elemNugglet = document.getElementById(htmId);
	elemNugglet.style.left = objNugglet.left;
	elemNugglet.style.top = objNugglet.top;
	elemNugglet.style.height = objNugglet.height+"px";
	elemNugglet.style.width = objNugglet.width+"px";
	elemNugglet.style.zIndex = objNugglet.zIndex;
	page.state.maximized = false;

	var obj;
	for (obj in page.objects)
	{
		if(obj == id)continue;

		obj = page.objects[obj];
		if (obj.type.toLowerCase() == "menu" 
		|| obj.type.toLowerCase() == "transfer" 
		|| obj.type.toLowerCase() == "user")
			continue;

		var htmElem = (obj.type == "frmlt" || obj.type == "CMP")
				? document.getElementById("divcont"+obj.type+"_"+obj.id)
				: document.getElementById(obj.id);
		if(!htmElem)continue;

		if(obj.type == "DME" && obj.hide)continue;

		if(!obj.autoHide)
			htmElem.style.visibility = "visible";
		else if(!page.state.hiddenObjects[id])
			htmElem.style.visibility = "visible";
	}

	img.src = "../images/ico_maximize.gif";
	img.alt = page.phrases.getPhrase("maximize");
	img.onclick = nuggletMaximize;
}

//Storage object
function PortalStorage()
{
	//just a place to mount prototypes
}
PortalStorage.prototype.addElement=function(name,value)
{
	if(typeof(value)=="undefined")
		value="";
	this[name]=value;
	return this[name];
}
PortalStorage.prototype.removeElement=function(name)
{
	this[name]=null;
}

//Rule Storage object
function RuleStorage()
{
	//just a place to mount prototypes
}
RuleStorage.prototype.addRule=function(key,name,value)
{
	if(typeof(value)=="undefined")
		value="";
	if(key in this)
	{
		if(typeof(name)=="undefined")
			return this[key];
		else
		{
			this[key].addElement(name,value);
			return this[key][name];
		}
	}
	else
	{
		this[key]=new PortalStorage();
		if(typeof(name)!="undefined")
		{
			this[key].addElement(name,value);
			return this[key][name];
		}
	}
	return this[key];
}
RuleStorage.prototype.removeRule=function(key,name)
{
	if(typeof(name)=="undefined")
		this[key]=null;
	else
		this[key][name]=null;
}

function TransObject()
{
	//just a place to mount prototypes
}
TransObject.prototype.addTransaction=function(objectId)
{
	if(objectId in this) return;
	this[objectId]=true;
}
TransObject.prototype.removeTransaction=function(objectId)
{
	if(objectId in this)this[objectId]=null;
}

TransObject.prototype.addTransByFieldRules=function(fieldId)
{
	var rule;
	var rules=page.rulesByField[fieldId];

	for(rule in rules)
	{
		if(typeof(rules[rule])!="function")
			this.addTransaction(rule);
	}
}
TransObject.prototype.transact=function()
{
	var obj;
	var pStore;
	for(obj in this)
	{
		if(typeof(this[obj])!="function" && this[obj])
		{
			pStore=page.getObjectValues(obj);
			page.objects[obj].refresh(pStore);
		}
	}
	this.destroy();
	page.eventSink(page.id,"OnDatasrcUpdate");
}
TransObject.prototype.destroy=function()
{
	page.transaction=null;
}
//Text Object
function Text(DOMNode)
{
	if(typeof(DOMNode) == "undefined" || !DOMNode)
	{
		var strXML =  '<TEXT id="" TITLE="" col="" row="" height="" width="" border="0" ';
		strXML += 'scroll="1" tp="NUGTXT" nm="Text" interval="0" host="" ahide="0" src="">';
		strXML += '<textarea fontfamily="tahoma" fontsize="8pt" bold="normal" ital="normal" ';
		strXML += 'uline="none" align="left" bgcolor="FFFFFF" color="FF0000"><![CDATA[]]></textarea></TEXT>';
		DOMNode = stringToXMLObj(strXML);
		if(DOMNode)DOMNode = DOMNode.documentElement;
		else return;
	}
	var bool;
	var oNode;

	this.rendered=false;
	this.id=DOMNode.getAttribute("id");
	this.title=DOMNode.getAttribute("TITLE");
	bool=DOMNode.getAttribute("ahide");
	this.autoHide=(bool==0)?false:true;
	bool=DOMNode.getAttribute("border");
	this.border=(bool==0)?false:true;
	this.height=DOMNode.getAttribute("height");
	this.width=DOMNode.getAttribute("width");
	this.left=DOMNode.getAttribute("col");
	this.top=DOMNode.getAttribute("row");
	this.type=DOMNode.getAttribute("tp");
	this.interval=DOMNode.getAttribute("interval");
	bool=chkValue(DOMNode.getAttribute("scroll"), "1");
	this.scroll=(bool==0)?false:true;
	this.zIndex = chkValue(DOMNode.getAttribute("zindex"), "1");

	oNode=DOMNode.getElementsByTagName("textarea")[0];
	if(!oNode)
	{
		this.align="left";
		this.bold="normal";
		this.italic="normal";
		this.underLine="none";
		this.color = "black";
		this.backgroundColor = "white";
		this.fontFamily = "tahoma"
		this.fontSize = "8pt"
		this.text = "";
		return;
	}

	this.align=oNode.getAttribute("align");
	if(this.align=="")
		this.align="left";
	this.bold=oNode.getAttribute("bold");
	if(this.bold=="")
		this.bold="normal";
	this.italic=oNode.getAttribute("ital");
	if(this.italic=="")
		this.italic="normal";
	this.underLine=oNode.getAttribute("uline");
	if(this.underLine=="")
		this.underLine="none";
	this.color=oNode.getAttribute("color");
	this.backgroundColor=oNode.getAttribute("bgcolor");
	this.fontFamily=chkValue(oNode.getAttribute("fontfamily"), "tahoma");
	this.fontSize=chkValue(oNode.getAttribute("fontsize"), "8pt");
	for(var i=0;i<oNode.childNodes.length;i++)
	{
		if(oNode.childNodes[i].nodeType==4)
			this.text=oNode.childNodes[i].nodeValue;
	}
	this.bDrawMaxBtn = false;
}
Text.prototype.render=function()
{
	var newElm;
	var titleElm;
	var bodyElm;

	if(this.rendered)
	{
		newElm=document.getElementById(this.id);
		document.body.removeChild(newElm);
	}
	newElm=document.createElement("DIV");
	newElm.id=this.id;
	newElm.className="TextObject";
	newElm.style.position="absolute";
	newElm.style.top=this.top+"px";
	newElm.style.left=this.left+"px";
	newElm.style.height=this.height+"px";
	newElm.style.width=this.width+"px";
	newElm.onclick = page.setCurrentObj;
	newElm.type=this.type;
	if(!this.border)
		newElm.style.borderWidth="0px";
	if(this.autoHide)
		newElm.style.visibility="hidden";
	newElm.style.overflow = (this.scroll)?"auto":"hidden";
	newElm.style.zIndex = this.zIndex;

	if(this.title != "")
	{
		var titleElm = page.drawTitleBar(this, true, this.bDrawMaxBtn);
		newElm.appendChild(titleElm);
	}

	bodyElm = document.createElement("table");
	bodyElm.cellSpacing = "0";
	bodyElm.cellPadding = "0";
	bodyElm.border = "0";
	bodyElm.width = "100%";

	var oRow = bodyElm.insertRow(0);
	var oCell = oRow.insertCell(0);
	var pre = document.createElement("pre");
	pre.style.fontWeight = this.bold;
	pre.style.fontStyle = this.italic;
	pre.style.textAlign = this.align;
	pre.style.textDecoration = this.underLine;
	pre.style.fontFamily = this.fontFamily;
	pre.style.fontSize = this.fontSize;

	if (this.color != "")
			pre.style.color = this.color;
	if (this.backgroundColor != "")
			pre.style.backgroundColor = this.backgroundColor;

	if (portalObj.browser.isIE)
	{
		this.text = this.text.replace(/\r\n/g, "\r");
		this.text = this.text.replace(/\n/g, "\r");
	}

	pre.appendChild(document.createTextNode(this.text));
	oCell.appendChild(pre);
	newElm.appendChild(bodyElm);
	newElm.onclick=pageNotification;

	document.body.appendChild(newElm);
	page.eventSink(this.id,"OnInit");
	this.rendered=true;
}
Text.prototype.setzIndex=function(zIndex)
{
	var elem = document.getElementById(this.id);
	if(elem)
	{
		this.zIndex = zIndex;
		elem.style.zIndex = this.zIndex;
	}
}

//HTML Object
function HTML(DOMNode)
{
	if(typeof(DOMNode) == "undefined" || !DOMNode)
	{
		var strXML = '<HTM id="" TITLE="" col="" row="" height="" width="" ';
		strXML += 'border="0" scroll="1" ahide="0" src="" tp="HTM" nm="htm" ';
		strXML += 'interval="0" host=""><URL><![CDATA[]]></URL><DATASRC/></HTM>'
		DOMNode = stringToXMLObj(strXML);
		if(DOMNode)DOMNode = DOMNode.documentElement;
		else return;
	}

	var incNode;
	var oNode;
	var bool;

	this.rendered=false;
	this.id=DOMNode.getAttribute("id");
	this.title=chkValue(DOMNode.getAttribute("TITLE"), "");
	bool=DOMNode.getAttribute("ahide");
	this.autoHide=(bool==0)?false:true;
	bool=DOMNode.getAttribute("border");
	this.border=(bool==0)?false:true;
	bool=chkValue(DOMNode.getAttribute("scroll"), "1");
	this.scroll=(bool==0)?false:true;
	this.zIndex = chkValue(DOMNode.getAttribute("zindex"), "1");
	this.height=DOMNode.getAttribute("height");
	this.width=DOMNode.getAttribute("width");
	this.left=DOMNode.getAttribute("col");
	this.top=DOMNode.getAttribute("row");
	this.type=DOMNode.getAttribute("tp");
	this.interval=DOMNode.getAttribute("interval");
	this.URL="";
	this.baseURL="";
	this.dataSource="";

	oNode=DOMNode.getElementsByTagName("URL")[0];
	if(!oNode) return;

	this.baseURL=oNode.childNodes[0].nodeValue;
	this.dataSource=new PortalStorage();

	oNode=DOMNode.getElementsByTagName("DATASRC")[0];
	if(!oNode) return;

	incNode=oNode.getElementsByTagName("ELEMENT");
	for(var i=0;i<incNode.length;i++)
	{
		oNode=incNode[i];
		if(oNode.nodeType!=3 && oNode.nodeType!=4)
		{
			if(oNode.hasChildNodes())
				this.dataSource.addElement(oNode.getAttribute("id"),oNode.childNodes[0].nodeValue);
			else
				this.dataSource.addElement(oNode.getAttribute("id"));
		}
	}
}
HTML.prototype.render=function()
{
	var newElm, frameElm;

	if(this.rendered)
	{
		newElm=document.getElementById(this.id);
		frameElm=document.getElementById("frame_"+this.id);
	}
	else
	{
		newElm=document.createElement("DIV");
		newElm.id=this.id;
		newElm.className="HTMObject";
		newElm.style.position="absolute";
		newElm.style.top=this.top+"px";
		newElm.style.left=this.left+"px";
		newElm.style.height=this.height+"px";
		newElm.style.width=this.width+"px";
		newElm.onclick = page.setCurrentObj;
		newElm.type=this.type;
		document.body.appendChild(newElm);
		if(!this.border)
			newElm.style.borderWidth="0px";
		newElm.style.overflow=(this.scroll)?"auto":"hidden";
		newElm.style.zIndex = this.zIndex;

		if(this.title != "")
		{
			var titleElm = page.drawTitleBar(this, true, true);
			newElm.appendChild(titleElm)
		}
		frameElm=document.createElement("IFRAME");
		frameElm.id="frame_"+this.id;
		frameElm.name="frame_"+this.id;
		frameElm.style.left="0px";
		frameElm.style.top=(this.title == "") ? "0px" : "20px";
		frameElm.style.height=(this.title == "")
				? "100%" : (100-(20/parseInt(this.height)*100))+"%" ;
		frameElm.style.width="100%";
		frameElm.scrolling=(this.scroll)?"auto":"no";
		if(portalObj.browser.isIE)
			frameElm.onactivate = page.setCurrentObj;
		else
			frameElm.onclick = page.setCurrentObj;
		newElm.appendChild(frameElm);
		page.eventSink(this.id,"OnInit");
	}
	if(this.autoHide || page.state.maximized)
		newElm.style.visibility="hidden";
	else
		newElm.style.visibility="visible";
	if(this.URL.indexOf("lawform&") >= 0)
	{
		var tkn=getVarFromString("_TKN",this.URL);
		var pdl=getVarFromString("_PDL",this.URL);
		var id=getVarFromString("_ID", this.URL);
		portalWnd.formTransfer(tkn,pdl,frameElm,null,id,"page");
	}
	else
		frameElm.src=this.URL;
	this.rendered=true;
}
HTML.prototype.refresh=function(pStorage)
{
	var nm;
	var val;
	var vals;
	var strURL=this.baseURL;
	var re = new RegExp("<<(.*?)>>","");

	if(typeof(pStorage)!="undefined")
		vals=pStorage;
	else if(!this.rendered)
		vals=page.getObjectValues(this.id);
		
	for(nm in vals)
	{
		if(typeof(vals[nm])!="function")
		{
			val=vals[nm];
			if(val!="")
				this.dataSource[nm]=val;
		}
	}

	while(strURL.match(re))
	{
		nm=RegExp.$1;
		val=this.dataSource[nm];
		if(val=="" || val==null || typeof(val)=="undefined")
			this.autoHide=true;
		else
			this.autoHide=false;
		strURL=strURL.replace(re,val)
	}
	if(strURL != this.URL)
	{
		this.URL=strURL;
		this.render();
	}
}
HTML.prototype.setzIndex=function(zIndex)
{
	var elem = document.getElementById(this.id);
	if(elem)
	{
		this.zIndex = zIndex;
		elem.style.zIndex = this.zIndex;
	}
}
//Image Object
function PageImage(DOMNode)
{
	if(typeof(DOMNode) == "undefined" || !DOMNode)
	{
		var strXML = '<IMAGE id="" TITLE="" col="" row="" height="" width="" ';
		strXML += 'border="0" ahide="0" src="" tp="NUGIMG" nm="Image" interval="0" ';
		strXML += 'host=""><URL><![CDATA[]]></URL><DATASRC></DATASRC></IMAGE>'
		DOMNode = stringToXMLObj(strXML);
		if(DOMNode)DOMNode = DOMNode.documentElement;
		else return;
	}
	var incNode;
	var oNode;
	var bool;

	this.rendered=false;
	this.id=DOMNode.getAttribute("id");
	this.title=DOMNode.getAttribute("TITLE");
	bool=DOMNode.getAttribute("ahide");
	this.autoHide=(bool==0)?false:true;
	bool=DOMNode.getAttribute("border");
	this.border=(bool==0)?false:true;
	this.height=DOMNode.getAttribute("height");
	this.width=DOMNode.getAttribute("width");
	this.left=DOMNode.getAttribute("col");
	this.top=DOMNode.getAttribute("row");
	this.type=DOMNode.getAttribute("tp");
	this.interval=DOMNode.getAttribute("interval");
	this.URL="";
	this.baseURL="";
	this.dataSource="";
	this.zIndex = chkValue(DOMNode.getAttribute("zindex"), "1");
	this.bDrawMaxBtn = false;

	oNode=DOMNode.getElementsByTagName("URL")[0];
	if(!oNode) return;

	this.baseURL=oNode.childNodes[0].nodeValue;
	this.dataSource=new PortalStorage();

	oNode=DOMNode.getElementsByTagName("DATASRC")[0];
	if(!oNode) return;

	incNode=oNode.getElementsByTagName("ELEMENT");
	for(var i=0;i<incNode.length;i++)
	{
		oNode=incNode[i];
		if(oNode.nodeType!=3 && oNode.nodeType!=4)
		{
			if(oNode.hasChildNodes())
				this.dataSource.addElement(oNode.getAttribute("id"),oNode.childNodes[0].nodeValue);
			else
				this.dataSource.addElement(oNode.getAttribute("id"));
		}
	}
}
PageImage.prototype.render=function()
{
	var newElm;
	var titleElm;
	var bodyElm;

	if(this.rendered)
	{
		newElm=document.getElementById(this.id);
		document.body.removeChild(newElm);
	}
	newElm=document.createElement("DIV");
	newElm.id=this.id;
	newElm.className="ImageObject";
	newElm.style.position="absolute";
	newElm.style.top=this.top+"px";
	newElm.style.left=this.left+"px";
	newElm.style.height=this.height+"px";
	newElm.style.width=this.width+"px";
	newElm.style.visibility="hidden";
	newElm.style.zIndex = this.zIndex;
	newElm.onclick = page.setCurrentObj;
	newElm.type=this.type;
	if(!this.border)
		newElm.style.borderWidth="0px";
	if(this.autoHide || page.state.maximized)
		newElm.style.visibility="hidden";
	else
		newElm.style.visibility="visible";

	if(this.title!="")
	{
		var titleElm = page.drawTitleBar(this, true, this.bDrawMaxBtn);
		newElm.appendChild(titleElm);
	}

	bodyElm=document.createElement("IMG");
	bodyElm.style.position="relative";
	bodyElm.src=this.URL;
	newElm.appendChild(bodyElm);
	newElm.onclick=pageNotification;

	document.body.appendChild(newElm);
	page.eventSink(this.id,"OnInit");
	//newElm.src=this.URL;
	this.rendered=true;
}
PageImage.prototype.refresh=function(pStorage)
{
	var nm;
	var val;
	var vals;
	var strURL=this.baseURL;
	var re = new RegExp("<<(.*?)>>","");

	if(typeof(pStorage)!="undefined")
		this.dataSource=pStorage;
	else if(!this.rendered)
	{
		vals=page.getObjectValues(this.id);
		for(nm in vals)
		{
			if(typeof(vals[nm])!="function")
			{
				val=vals[nm];
				if(val!="")
					this.dataSource[nm]=val;
			}
		}
	}
	while(strURL.match(re))
	{
		usrVar=RegExp.$1;
		varVal=this.dataSource[usrVar];
		if(varVal=="" || varVal==null || typeof(varVal)=="undefined")
			this.autoHide=true;
		else
			this.autoHide=false;
		strURL=strURL.replace(re,varVal)
	}
	this.URL=strURL;
	this.render();
}
PageImage.prototype.setzIndex=function(zIndex)
{
	var elem = document.getElementById(this.id);
	if(elem)
	{
		this.zIndex = zIndex;
		elem.style.zIndex = this.zIndex;
	}
}

//Menu Object
function Menu(DOMNode)
{
	if(typeof(DOMNode) == "undefined" || !DOMNode)
	{
		var strXML = '<MENU id="" TITLE="" windowoption="ptr" track="0" ';
		strXML += 'tp="menu" nm="Menu" interval="0" dseq="" ahide="0" ';
		strXML += 'border="0" host="" PDL=""></MENU>'
		DOMNode = stringToXMLObj(strXML);
		if(DOMNode)DOMNode = DOMNode.documentElement;
		else return;
	}
	var bool;
	var oNodes;
	var oNode;
	var newMn;

	this.rendered=false;
	this.id=DOMNode.getAttribute("id");
	this.title=DOMNode.getAttribute("TITLE");
	bool=DOMNode.getAttribute("track");
	this.autoStep=(bool==0)?false:true;
	this.type=DOMNode.getAttribute("tp");
	this.interval=DOMNode.getAttribute("interval");
	this.navigateOption=DOMNode.getAttribute("windowoption");
	this.menus=new Array();

	oNodes=DOMNode.getElementsByTagName("submenu");
	for(var i=0;i<oNodes.length;i++)
	{
		oNode=oNodes[i];
		this.menus[i]=new Object();
		newMn=this.menus[i];
		newMn.TKN=oNode.getAttribute("TKN");
		bool=oNode.getAttribute("TKNCurPos");
		newMn.current=(bool==0)?false:true;
		newMn.description=oNode.getAttribute("TKNDesc");
		newMn.URL=oNode.getAttribute("TKNURL");
		newMn.title=oNode.getAttribute("TKNValue");
	}
}
Menu.prototype.render=function()
{
	var oNavlet;
	var oMenu;
	page.eventSink(this.id,"OnInit");
	var oTabPage=portalObj.tabArea.tabs.PAGE;
	if(this.rendered)
		oTabPage.removeNavlet(this.id);

	oNavlet=oTabPage.addNavlet(this.title,this.id,this);
	for(var i=0;i<this.menus.length;i++)
	{
		oMenu=this.menus[i];
		oNavlet.addItem(i,oMenu.title,"navigate("+i+")", oMenu.description);
	}
	oTabPage.setTitle("Page");
	oTabPage.show();
	if(this.type != "user")
	{
		var formFrame = document.getElementById("MENU_form");
		if(!formFrame)
		{
			formFrame=document.createElement("IFRAME");
			formFrame.src = "../blank.htm";
			formFrame.id="MENU_form";
			formFrame.name=formFrame.id;
			formFrame.className="FormObject";
			formFrame.style.visibility="hidden"
			formFrame.style.position="absolute";
			formFrame.style.top="0px";
			formFrame.style.left="0px";
			formFrame.style.height="100%";
			formFrame.style.width="100%";
			formFrame.style.zIndex = "99"
			document.body.appendChild(formFrame);
		}
	}
	this.rendered=true;
}
Menu.prototype.navigate=function(menuRef)
{
	var usrVar="";
	var oMenu=this.menus[menuRef];
	var strURL=oMenu.URL;
	var strCmpts;
	var re = new RegExp("<<(.*?)>>","");

	page.currentObjId = this.id;
	while(strURL.match(re))
	{
		usrVar=RegExp.$1;
		if(usrVar=="PDL")
			usrVar="productline";
		strURL=strURL.replace(re,portalWnd.oUserProfile.getAttribute(usrVar))
	}

	if(this.type!="user")
		strURL="lawform&"+strURL.replace("&amp;", "&");

	if (!page.eventSink(this.id, "OnBeforeTransfer", strURL))
		return;
		
	switch(this.navigateOption)
	{
		case "win":
		{
			if(this.type == "user")
				window.open(strURL);
			else
			{
				var formFrame = document.getElementById("MENU_form");
				var tkn=getVarFromString("_TKN",strURL);
				var pdl=getVarFromString("_PDL",strURL);
				var id=getVarFromString("_ID", strURL);
				if(formFrame)
				{
					document.body.style.visibility = "hidden";
					page.manageLeftBar(false);
					portalWnd.formTransfer(tkn,pdl,formFrame,null,id,"page");
					formFrame.style.visibility = "visible";
				}
			}
			break;
		}
		case "ptr":
		{
			page.setElementValue(this.id+"URL",strURL);
			page.transaction.transact();
			page.dataSource[this.id+"URL"]="";
			break;
		}
		default:
		{
			if(this.type == "user")
				portalWnd.switchContents(strURL);
			else
			{
				var tkn=getVarFromString("_TKN",strURL);
				var pdl=getVarFromString("_PDL",strURL);
				var id=getVarFromString("_ID", strURL);
				portalWnd.formTransfer(tkn,pdl,null,null,id,"portal");
			}
			break;
		}
	}
}

//Report Object
function Report(DOMNode)
{
	if(typeof(DOMNode) == "undefined" || !DOMNode)
	{
		var strXML = '<RPT id="" TITLE="Reports" col="" row="" height="" ';
		strXML += 'width="" border="0" scroll="1" windowoption="ptr" pIco="1" ';
		strXML += 'sIco="1" dIco="1" src="" tp="RPT" nm="Report" interval="0" ';
		strXML += 'host="" col1="Job" col2="Description" ahide="0"/>'
		DOMNode = stringToXMLObj(strXML);
		if(DOMNode)DOMNode = DOMNode.documentElement;
		else return;
	}
	var incNode;
	var oNode;
	var bool;

	this.rendered=false;
	this.id=DOMNode.getAttribute("id");
	this.title=DOMNode.getAttribute("TITLE");
	bool=DOMNode.getAttribute("ahide");
	this.autoHide=(bool==0)?false:true;
	bool=DOMNode.getAttribute("border");
	this.border=(bool==0)?false:true;
	bool=chkValue(DOMNode.getAttribute("scroll"), "1");
	this.scroll=(bool==0)?false:true;
	this.zIndex = chkValue(DOMNode.getAttribute("zindex"), "1");
	this.height=DOMNode.getAttribute("height");
	this.width=DOMNode.getAttribute("width");
	this.left=DOMNode.getAttribute("col");
	this.top=DOMNode.getAttribute("row");
	this.type=DOMNode.getAttribute("tp");
	this.interval=DOMNode.getAttribute("interval");
	this.navigateOption=DOMNode.getAttribute("windowoption");
	this.jobHeader=DOMNode.getAttribute("col1");
	this.descHeader=DOMNode.getAttribute("col2");
	this.noActionIcon="../images/spacer.gif";
	this.printIcon="../images/print.gif";
	this.submitIcon="../images/refresh.gif";
	this.deleteIcon="../images/ico_delete.gif";
	bool=DOMNode.getAttribute("pIco");
	this.printEnabled=(bool=="1")?true:false;
	bool=DOMNode.getAttribute("sIco");
	this.submitEnabled=(bool=="1")?true:false;
	bool=DOMNode.getAttribute("dIco");
	this.deleteEnabled=(bool=="1")?true:false;

	this.baseURL=portalWnd.JOBSRVPath+"?_TYPE=joblist";
	this.URL="";
	this.reports=new Array();
	this.dataSource=new PortalStorage();

	oNode=DOMNode.getElementsByTagName("DATASRC")[0];
	if(!oNode) return this;

	incNode=oNode.getElementsByTagName("ELEMENT");
	for(var i=0;i<incNode.length;i++)
	{
		oNode=incNode[i];
		if(oNode.nodeType!=3 && oNode.nodeType!=4)
		{
			if(oNode.hasChildNodes())
				this.dataSource.addElement(oNode.getAttribute("id"),oNode.childNodes[0].nodeValue);
			else
				this.dataSource.addElement(oNode.getAttribute("id"));
		}
	}
}
Report.prototype.refresh=function(pStorage)
{
	var jobList;
	var oNode;
	var oNodes;
	var tmpNode;
	var objJob;

	// pStorage not used in this object to date

	this.URL=this.baseURL;
	jobList=portalWnd.httpRequest(this.URL);
	if (jobList.status)
	{
		var msg=portalObj.getPhrase("ERROR_LOAD_XML")+": "+this.URL+"Status: "+jobList.status;
		portalWnd.cmnDlg.messageBox(msg,"ok","alert",window);
		return;
	}

	oNodes=jobList.getElementsByTagName("JOB");
	for(var i=0; i<oNodes.length; i++)
	{
		oNode = oNodes[i];
		this.reports[i] = new Object();
		objJob = this.reports[i];
		objJob.name = oNode.getAttribute("JOBNAME");
		objJob.user = oNode.getAttribute("USERNAME");
		objJob.title = oNode.getAttribute("DESCRIPTION");
		objJob.productLine = oNode.getAttribute("PRODUCTLINE");

		if(oNode.childNodes.length)
			objJob.prt = oNode.childNodes[0].getAttribute("FILEPATH") + "/" +  
				oNode.childNodes[0].getAttribute("FILENAME")
		else
			objJob.prt = ""
		
		objJob.visible=true;
	}
	
	this.render();
}
Report.prototype.render=function()
{
	var newElm;
	var childElm;
	var tableElm;
	var objRow;
	var objCell;
	var objChild;
	var objTxt;
	var oNode;

	if(this.rendered)
	{
		newElm=document.getElementById(this.id);
		newElm.parentNode.removeChild(newElm);
	}
	
	newElm=document.createElement("DIV");
	newElm.id=this.id;
	newElm.className="ReportObject";
	newElm.style.position="absolute";
	newElm.style.top=this.top+"px";
	newElm.style.left=this.left+"px";
	newElm.style.height=this.height+"px";
	newElm.style.width=this.width+"px";
	newElm.onclick = page.setCurrentObj;
	newElm.type=this.type;
	
	if(!this.border)
		newElm.style.borderWidth="0px";
		
	newElm.style.overflow=(this.scroll)?"auto":"hidden";
	newElm.style.zIndex = this.zIndex;
	
	if(this.autoHide || page.state.maximized)
		newElm.style.visibility="hidden";
	else
		newElm.style.visibility="visible";

	document.body.appendChild(newElm);
	page.eventSink(this.id,"OnInit");

	if(this.title!="")
	{
		var titleElm = page.drawTitleBar(this, true, true);
		newElm.appendChild(titleElm);
	}

	tableElm=document.createElement("TABLE");
	newElm.appendChild(tableElm);
	for(var i=-1;i<this.reports.length;i++)
	{
		if(i==-1)	//create Header level cells
		{
			objRow=tableElm.insertRow(0);
			for(var n=0;n<5;n++)
			{
				objCell=objRow.insertCell(n);
				objCell.className="ReportCaption";
				objCell.align="center";
				switch(n)
				{
					case 3:
						objTxt=document.createTextNode(this.jobHeader);
						break;
					case 4:
						objTxt=document.createTextNode(this.descHeader);
						break;
					default:
						objTxt=document.createTextNode("");
						break;
				}
				objCell.appendChild(objTxt);
			}
		}
		else	//create detail level cells
		{
			oNode=this.reports[i];
			if(!oNode.visible) continue;

			objRow=tableElm.insertRow(i+1);


			objCell=objRow.insertCell(0);
			if(this.submitEnabled)
			{
				objChild=document.createElement("IMG");
				objCell.appendChild(objChild);
				objCell.className="ReportAction";
				objChild.src=this.submitIcon;
				objChild.alt=page.phrases.getPhrase("submitJob");
				objChild.setAttribute("target",this.id);
				objChild.setAttribute("action","submit");
				objChild.setAttribute("index",i);
				objChild.onclick=processReportRequest;
			}

			objCell=objRow.insertCell(1);
			if(this.deleteEnabled)
			{
				objChild=document.createElement("IMG");
				objCell.appendChild(objChild);
				objCell.className="ReportAction";
				objChild.src=this.deleteIcon;
				objChild.alt=page.phrases.getPhrase("deleteJob");
				objChild.setAttribute("target",this.id);
				objChild.setAttribute("action","delete");
				objChild.setAttribute("index",i);
				objChild.onclick=processReportRequest;
			}

			objCell=objRow.insertCell(2);
			if(this.printEnabled)
			{
				objChild=document.createElement("IMG");
				objCell.appendChild(objChild);
				if(oNode.prt!="")
				{
					objCell.className="ReportAction";
					objChild.src=this.printIcon;
					objChild.alt=page.phrases.getPhrase("printJob");
					objChild.setAttribute("target",this.id);
					objChild.setAttribute("action","print");
					objChild.setAttribute("index",i);
					objChild.onclick=processReportRequest;
				}
				else
					objChild.src=this.noActionIcon;
			}

			objCell=objRow.insertCell(3);
			objCell.appendChild(document.createTextNode(oNode.name));
			objCell.className="ReportName";
			if(oNode.prt!="")
			{
				objCell.setAttribute("target",this.id);
				objCell.setAttribute("action","display");
				objCell.setAttribute("index",i);
				objCell.onclick=processReportRequest;
			}
			else
			{
				objCell.style.cursor="default";
				objCell.style.textDecoration="none";
			}

			objCell=objRow.insertCell(4);
			objCell.className="ReportDesc";
			objCell.appendChild(document.createTextNode(oNode.title));
		}
	}
	document.body.appendChild(newElm);
	this.rendered=true;
}
function processReportRequest(e)
{
	var evt;
	var srcElm;
	var rptObj;
	var index;
	var rptItem;
	var action;
	var request;
	var response;
	var printer;
	var respTxt;

	evt=new LawsonEvent(e);
	srcElm=evt.getSrcElement();
	rptObj=srcElm.getAttribute("target");
	rptObj=page.objects[rptObj];
	index=srcElm.getAttribute("index");
	rptItem=rptObj.reports[index];
	action=srcElm.getAttribute("action");

	if (!page.eventSink(rptObj.id, "OnBeforeTransfer", action, index))
		return;
		
	switch(action)
	{
		case "print":
		{
			printer=portalWnd.oUserProfile.getAttribute("printername");
			if (!printer)
			{
				var msg=page.phrases.getPhrase("noprinter");
				portalWnd.cmnDlg.messageBox(msg,"ok","alert",window);
				return;
			}

			var msg=rptItem.name+" "+page.phrases.getPhrase("printJob")+" "+printer;
			portalWnd.cmnDlg.messageBox(msg,"ok","info",window);
			
			request="/cgi-lawson/webrpt.exe?";
			request+="_DTGT=&_FN="+rptItem.prt+"&_DMD=PRINT&_PRINTER="+printer+"&_COPIES=1&DSTUSR="+rptItem.user;
			response = portalWnd.httpRequest(request,null,null,"text/html",false);
			
			if (response.status)
			{
				msg=page.phrases.getPhrase("printFail");
			}
			else
			{
				msg = (response.indexOf("File Has Been Printed.") == -1)
					? portalObj.getPhrase("PRINTERROR") 
					: rptItem.name + " " + portalWnd.rptPhrases.getPhrase("msgJobPrinted");		
			}
			
			portalWnd.cmnDlg.messageBox(msg,"ok","alert",window)
			break;
		}
		case "submit":
		{
			if(!window.confirm(page.phrases.getPhrase("submitJob")+"?"))
				return;
				
			var request="/cgi-lawson/jobrun.exe?";
			request+="FUNC=run&JOB="+rptItem.name+"&USER="+rptItem.user;
			request+="&DATE=&TIME=&JOBQUEUE=&OUT=XML";

			response = portalWnd.httpRequest(request,null,null,null,false);
			var msg = portalObj.getPhrase("JOBRUN_ERROR1");
			
			if (!portalWnd.oError.isErrorResponse(response,true,true,false,msg,window))
			{
				msg=portalWnd.oError.getDSMessage();
				portalWnd.cmnDlg.messageBox(msg,"ok","info",window);
				rptObj.refresh();
			}
			break;
		}
		case "delete":
		{
			if(!window.confirm(page.phrases.getPhrase("deleteJob")+"?"))
				return;

			request = "/cgi-lawson/xdeljob.exe?" + rptItem.user + "&" + rptItem.name;
			var oDeleteXml = portalWnd.httpRequest(request,null,null,null,false);
			var msg=portalObj.getPhrase("msgErrorInvalidResponse") + " xdeljob.exe.\n\n";
			if (portalWnd.oError.isErrorResponse(oDeleteXml,true,true,false,msg,window))
				break;

			var oDS = portalWnd.oError.getDSObject();
			var oJobNodes = oDS.getElementsByTagName("Job");

			var len = oJobNodes ? oJobNodes.length : 0;
			msg="";
			for (var i=0; i < len; i++)
				msg += oJobNodes[i].firstChild.nodeValue + "\n";

			portalWnd.cmnDlg.messageBox(msg,"ok","",window);
			rptObj.refresh();
			break;
		}
		case "display":
		{
			var domainName=getDomainName();
			var domainParm=(domainName) ? "&_DOMAIN="+domainName : "";
			request="/cgi-lawson/webrpt.exe?_DTGT=&_FN="+rptItem.prt+domainParm;
			
			switch(rptObj.navigateOption)
			{
				case "win":
				{
					window.open(request);
					break;
				}
				case "ptr":
				{
					page.setElementValue(rptObj.id+"URL",request);
					page.transaction.transact();
					page.dataSource[rptObj.id+"URL"]="";
					break;
				}
				default:
				{
					portalObj.contentFrame.src=request;
					break;
				}
			}
			return;
			break;
		}
	}

	evt.cancelBubble=true;
}
Report.prototype.setzIndex=function(zIndex)
{
	var elem = document.getElementById(this.id);
	if(elem)
	{
		this.zIndex = zIndex;
		elem.style.zIndex = this.zIndex;
	}
}

function RSS(DOMNode)
{
	if(typeof(DOMNode) == "undefined" || !DOMNode)
	{
		var strXML = '<RSS id="" TITLE="" col="" row="" height="" width="" ';
		strXML += 'border="0" scroll="1" windowoption="ptr" ahide="0" ';
		strXML += 'showdesc="0" src="" tp="RSS" nm="RSS" interval="0" host="" ';
		strXML += 'link="" desc=""><URL><![CDATA[]]></URL><DATASRC></DATASRC></RSS>'
		DOMNode = stringToXMLObj(strXML);
		if(DOMNode)DOMNode = DOMNode.documentElement;
		else return;
	}
	this.id = DOMNode.getAttribute("id")
	this.left = DOMNode.getAttribute("col");
	this.top = DOMNode.getAttribute("row");
	this.height = DOMNode.getAttribute("height");
	this.width = DOMNode.getAttribute("width");
	this.type=DOMNode.getAttribute("tp");
	this.rendered = false

	this.title = DOMNode.getAttribute("TITLE");
	this.border = (DOMNode.getAttribute("border")=="1")?true:false;
	this.autoHide = (DOMNode.getAttribute("ahide")=="1")?true:false;
	this.showDesc = (DOMNode.getAttribute("showdesc")=="1")?true:false;
	this.scroll= (chkValue(DOMNode.getAttribute("scroll"), "1") == "0")?false:true;
	this.zIndex = chkValue(DOMNode.getAttribute("zindex"), "1");
	this.navigateOption = DOMNode.getAttribute("windowoption");
	this.interval = DOMNode.getAttribute("interval");
	this.URL="";
	this.baseURL="";
	this.dataSource="";

	var oNode=DOMNode.getElementsByTagName("URL")[0];
	if(!oNode) return;
	this.baseURL=oNode.childNodes[0].nodeValue;
	this.dataSource = new PortalStorage()

	oNode=DOMNode.getElementsByTagName("DATASRC")[0];
	if(!oNode) return;

	var incNode=oNode.getElementsByTagName("ELEMENT");
	for(var i=0;i<incNode.length;i++)
	{
		oNode=incNode[i];
		if(oNode.nodeType!=3 && oNode.nodeType!=4)
		{
			if(oNode.hasChildNodes())
				this.dataSource.addElement(oNode.getAttribute("id"),oNode.childNodes[0].nodeValue);
			else
				this.dataSource.addElement(oNode.getAttribute("id"));
		}
	}
}

RSS.prototype.render=function()
{
	if(this.URL=="")return;
	var rssFrame;
	var objChild;
	var objTxt;
	if(this.rendered)
	{
		rssFrame=document.getElementById(this.id);
		rssFrame.removeChild(rssFrame.firstChild);
	}

	rssFrame=document.createElement("DIV");
	rssFrame.className = "RSSObject";
	rssFrame.id=this.id;
	rssFrame.style.position="absolute";
	rssFrame.style.top=this.top+"px";
	rssFrame.style.left=this.left+"px";
	rssFrame.style.height=this.height+"px"
	rssFrame.style.width=this.width+"px";
	if(!this.border)
		rssFrame.style.borderWidth="0px";
	rssFrame.style.overflow = (this.scroll)?"auto":"hidden";
	rssFrame.style.zIndex = this.zIndex;
	rssFrame.style.visibility=(this.autoHide || page.state.maximized)?"hidden":"visible";
	rssFrame.onclick = page.setCurrentObj;
	rssFrame.type=this.type;
	document.body.appendChild(rssFrame)
	if(this.title!="")
	{
		var titleElm = page.drawTitleBar(this, true, true);
		rssFrame.appendChild(titleElm);
	}
	var rssTable = document.createElement("TABLE");
	rssTable.align = "center";
	rssTable.width = "100%";
	rssFrame.appendChild(rssTable);

	var rssReturn = portalWnd.httpRequest("/servlet/PassThrough?_URL="+this.URL)
	if (!rssReturn || rssReturn.status)
	{
		var msg=portalObj.getPhrase("ERROR_LOAD_XML")+"\n"+this.URL;
		if (rssReturn)
			msg+="\n"+portalWnd.getHttpStatusMsg(rssReturn.status);
		portalWnd.cmnDlg.messageBox(msg,"ok","alert",window);
		return;
	}

	var rssItems=rssReturn.getElementsByTagName("item");	
	var objRow, objCell;
	var strTitle, strLink, strDescription
	var j=0;
	var x=0;
	for (var i=0; i<rssItems.length; i++)
	{
		for (x=0; x < rssItems[i].childNodes.length; x++)
		{
			if (rssItems[i].childNodes[x].nodeName == "title")
				strTitle = rssItems[i].childNodes[x].childNodes[0].nodeValue
			if (rssItems[i].childNodes[x].nodeName == "link")
				strLink = rssItems[i].childNodes[x].childNodes[0].nodeValue
			if (rssItems[i].childNodes[x].nodeName == "description")
				strDescription = rssItems[i].childNodes[x].childNodes[0].nodeValue
		}

		objRow = rssTable.insertRow(j++)
		objCell = objRow.insertCell(0)
		var objLink = document.createElement("SPAN")
		objLink.className="RSSLink"
		objLink.style.position="relative"
		objLink.container=this.id
		objLink.link=strLink
		objLink.onclick=rssOpenWindow
		objTxt=document.createTextNode(strTitle)
		objLink.appendChild(objTxt)
		objCell.appendChild(objLink)
		if(this.showDesc)
		{
			objTxt=document.createTextNode(strDescription)
			objCell.appendChild(objTxt)
		}
	}
}

function rssOpenWindow(e)
{
	e=e?e.currentTarget:window.event.srcElement
	var strLink = e.link
	var rssObj = page.objects[e.container]

	if (!page.eventSink(rssObj.id, "OnBeforeTransfer", strLink))
		return;
		
	switch(rssObj.navigateOption)
	{
		case "win":
			window.open(strLink);
			break;
		case "ptr":
			page.setElementValue(rssObj.id+"URL",strLink);
			page.transaction.transact();
			page.dataSource[rssObj.id+"URL"]="";
			break;
		default:
			portalObj.contentFrame.src=strLink;
			break;
	}
}

RSS.prototype.refresh=function(pStorage)
{
	var nm;
	var val;
	var vals;
	var strURL=this.baseURL;
	var re = new RegExp("<<(.*?)>>","");

	if(typeof(pStorage)!="undefined")
		this.dataSource=pStorage;
	else if(!this.rendered)
	{
		vals=page.getObjectValues(this.id);
		for(nm in vals)
		{
			if(typeof(vals[nm])!="function")
			{
				val=vals[nm];
				if(val!="")
					this.dataSource[nm]=val;
			}
		}
	}
	while(strURL.match(re))
	{
		nm=RegExp.$1;
		val=this.dataSource[nm];
		if(val=="" || val==null || typeof(val)=="undefined")
			this.autoHide=true;
		else
			this.autoHide=false;
		strURL=strURL.replace(re,val)
	}
	this.URL=strURL;
	this.render();
}
RSS.prototype.setzIndex=function(zIndex)
{
	var elem = document.getElementById(this.id);
	if(elem)
	{
		this.zIndex = zIndex;
		elem.style.zIndex = this.zIndex;
	}
}

function Formlet(DOMNode)
{
	if(typeof(DOMNode) == "undefined" || !DOMNode)
	{
		var strXML = '<FORMLET id="" TITLE="" col="" row="" height="" ';
		strXML += 'width="" border="0" scroll="1" ahide="0" refresh="0" ';
		strXML += 'src="" interval="0" tp="frmlt"/>'
		DOMNode = stringToXMLObj(strXML);
		if(DOMNode)DOMNode = DOMNode.documentElement;
		else return;
	}
	var incNode;
	var oNode;
	var bool;
	var strSRC;

	this.rendered=false;
	this.id=DOMNode.getAttribute("id");
	bool=DOMNode.getAttribute("border");
	this.border=(bool==0)?false:true;
	bool=chkValue(DOMNode.getAttribute("scroll"), "1");
	this.scroll=(bool==0)?false:true;
	this.zIndex = chkValue(DOMNode.getAttribute("zindex"), "1");
	this.height=DOMNode.getAttribute("height");
	this.width=DOMNode.getAttribute("width");
	this.left=DOMNode.getAttribute("col");
	this.top=DOMNode.getAttribute("row");
	this.type=DOMNode.getAttribute("tp");
	this.interval=DOMNode.getAttribute("interval");
	bool=chkValue(DOMNode.getAttribute("ahide"), "0");
	this.autoHide=(bool==0)?false:true;
	bool=chkValue(DOMNode.getAttribute("refresh"), "0");
	this.refreshData=(bool==0)?false:true;
	this.title=chkValue(DOMNode.getAttribute("TITLE"), "");

	strSRC=DOMNode.getAttribute("src");
	this.frmID=getVarFromString("_ID", strSRC);
	this.frmPDL=getVarFromString( "_PDL", strSRC);	
	this.frmTKN=getVarFromString( "_TKN", strSRC);
}
Formlet.prototype.render=function()
{
	var newElm, frameElm;

	if (!this.rendered)
	{
		newElm=document.createElement("DIV");
		newElm.id="divcontfrmlt_"+this.id;
		newElm.className="FormObject";
		newElm.style.position="absolute";
		newElm.style.top=this.top+"px";
		newElm.style.left=this.left+"px";
		newElm.style.height=this.height+"px";
		newElm.style.width=this.width+"px";
		newElm.onclick = page.setCurrentObj;
		newElm.type=this.type;
		document.body.appendChild(newElm);
		if(!this.border)
			newElm.style.borderWidth="0px";
		newElm.style.zIndex = this.zIndex;

		if(this.title != "")
		{
			var titleElm = page.drawTitleBar(this, true, true);
			newElm.appendChild(titleElm)
		}
		frameElm=document.createElement("IFRAME");
		frameElm.id=this.id;
		frameElm.src = "../blank.htm";
		frameElm.name=this.id;
		frameElm.type=this.type;
		frameElm.className="FormObject";
		frameElm.style.left="0px";
		frameElm.style.top=(this.title == "")?"0px":"20px";
		frameElm.style.height=(this.title == "")?"100%":(100-(20/parseInt(this.height)*100))+"%" ;
		frameElm.style.width="100%";
		frameElm.scrolling=(this.scroll)?"auto":"no";
		if(!this.border)
		{
			frameElm.style.border = "0px";
			frameElm.frameBorder = "0"
		}
		if(portalObj.browser.isIE)
			frameElm.onactivate = page.setCurrentObj;
		else
			frameElm.onclick = page.setCurrentObj;
		newElm.appendChild(frameElm);
		//transfer frame to form
		portalWnd.formTransfer(this.frmTKN,this.frmPDL,frameElm,null,this.frmID,"page");
	}
	else
	{
		newElm=document.getElementById("divcontfrmlt_"+this.id);
		frameElm = document.getElementById(this.id);
	}

	if(this.autoHide)
		newElm.style.visibility="hidden";
	else
		newElm.style.visibility="visible";

	this.rendered=true;
}
Formlet.prototype.refresh=function(pStorage)
{
	var frmObj;

	if(this.rendered)
	{
		frmObj=window.frames[this.id];
		if(!frmObj) return;

		if(this.autoHide)
		{
			var nm;
			var bHide = false;
			for(nm in pStorage)
			{
				if(pStorage[nm] != "function")
				{
					if(pStorage[nm] == "")
					{
						bHide = true;
						break;
					}
				}
			}
			this.autoHide = bHide;
			var formFrame = document.getElementById("divcontfrmlt_"+this.id);
			formFrame.style.visibility = (this.autoHide || page.state.maximized)?"hidden":"visible";
		}

		if(!this.autoHide)
		{
			if (portalObj.browser.isIE && frmObj.document.readyState == "complete")
				frmObj.lawformPageUpdate(pStorage, this.refreshData);
			else if (!portalObj.browser.isIE)
				frmObj.lawformPageUpdate(pStorage, this.refreshData);
		}
	}
	else
		this.render();
}
Formlet.prototype.setzIndex=function(zIndex)
{
	var elem = document.getElementById("divcontfrmlt_"+this.id);
	if(elem)
	{
		this.zIndex = zIndex;
		elem.style.zIndex = this.zIndex;
	}
}

function Composite(DOMNode)
{
	if(typeof(DOMNode) == "undefined" || !DOMNode)
	{
		var strXML = '<COMPOSITE id="" col="" row="" height="" width="" ';
		strXML += 'border="0" scroll="1" src="" ahide="0" tp="CMP" nm="Composite"/>';
		DOMNode = stringToXMLObj(strXML);
		if(DOMNode)DOMNode = DOMNode.documentElement;
		else return;
	}
	var bool;
	var oNode;

	this.rendered=false;
	this.id=DOMNode.getAttribute("id");
	this.title=chkValue(DOMNode.getAttribute("TITLE"), "");
	bool=DOMNode.getAttribute("border");
	this.border=(bool==0)?false:true;
	bool=chkValue(DOMNode.getAttribute("scroll"), "1");
	this.scroll=(bool==0)?false:true;
	this.zIndex = chkValue(DOMNode.getAttribute("zindex"), "1");
	bool=chkValue(DOMNode.getAttribute("ahide"), "0");
	this.autoHide=(bool==0)?false:true;
	this.height=DOMNode.getAttribute("height");
	this.width=DOMNode.getAttribute("width");
	this.left=DOMNode.getAttribute("col");
	this.top=DOMNode.getAttribute("row");
	this.type=DOMNode.getAttribute("tp");
	this.interval=DOMNode.getAttribute("interval");
	this.src=DOMNode.getAttribute("src");
	this.baseURL=window.location.href.replace(window.location.search,"");
	this.URL="";
}
Composite.prototype.render=function()
{
	var newElm, frameElm;
	var loc;

	if(!this.rendered)
	{
		newElm=document.createElement("DIV");
		newElm.id="divcontCMP_"+this.id;
		newElm.className="CompositeObject";
		newElm.style.position="absolute";
		newElm.style.top=this.top+"px";
		newElm.style.left=this.left+"px";
		newElm.style.height=this.height+"px";
		newElm.style.width=this.width+"px";
		newElm.onclick = page.setCurrentObj;
		newElm.type=this.type;
		document.body.appendChild(newElm);
		if(!this.border)
			newElm.style.borderWidth="0px";
		newElm.style.overflow=(this.scroll)?"auto":"hidden";
		newElm.style.zIndex = this.zIndex;

		if(this.title != "")
		{
			var titleElm = page.drawTitleBar(this, true, true);
			newElm.appendChild(titleElm)
		}
		frameElm=document.createElement("IFRAME");
		frameElm.id=this.id;
		frameElm.src = "../blank.htm";
		frameElm.name=this.id;
		frameElm.type=this.type;
		frameElm.className="CompositeObject";
		frameElm.style.left="0px";
		frameElm.style.top=(this.title == "")?"0px":"20px";
		frameElm.style.height=(this.title == "")?"100%":(100-(20/parseInt(this.height)*100))+"%" ;
		frameElm.style.width="100%";
		frameElm.scrolling=(this.scroll)?"auto":"no";
		if(!this.border)
			frameElm.style.border = "0px";
		if(portalObj.browser.isIE)
			frameElm.onactivate = page.setCurrentObj;
		else
			frameElm.onclick = page.setCurrentObj;
		newElm.appendChild(frameElm);

		// set the composite iFrames source
		if ("SRC" in page.parameters)
			loc=page.parameters.SRC;
		else
			loc=portalObj.path+"/content/pages/";
		this.URL=this.baseURL+"?file="+loc.substr(0,this.baseURL.lastIndexOf("/")+1)+this.src+"&composite=true";
		frameElm.src=this.URL;
	}
	else
	{
		newElm=document.getElementById("CMP_"+this.id);
		frameElm=document.getElementById(this.id);
	}

	if(this.autoHide)
		newElm.style.visibility="hidden";
	else
		newElm.style.visibility="visible";
	this.rendered=true;
}
Composite.prototype.refresh=function(pStorage)
{
	var frmObj;
	var nm;

	if(this.rendered)
	{
		frmObj=window.frames[this.id];
		if(!frmObj) return;
		if(this.autoHide)
		{
			var bHide = false
			for(nm in pStorage)
			{
				if(typeof(pStorage[nm])!="function")
				{
					if(pStorage[nm] == "")
					{
						bHide = true;
						break;
					}
				}
			}
			this.autoHide = bHide;
			var compFrame = document.getElementById("CMP_"+this.id);
			compFrame.style.visibility = (this.autoHide || page.state.maximized)?"hidden":"visible";
		}

		if(!this.autoHide)
		{
			for(nm in pStorage)
			{
				if(typeof(pStorage[nm])!="function")
					frmObj.page.setElementValue(nm,pStorage[nm]);
			}
			if(frmObj.page.transaction)frmObj.page.transaction.transact();
		}
	}
	else
		this.render();
}
Composite.prototype.setzIndex=function(zIndex)
{
	var elem = document.getElementById("CMP_"+this.id);
	if(elem)
	{
		this.zIndex = zIndex;
		elem.style.zIndex = this.zIndex;
	}
}

//Event Object
function LawsonEvent(evt)
{
	this.eventObject=evt?evt:window.event;
	this.isIE=evt?false:true;
}
LawsonEvent.prototype.getSrcElement=function()
{
	if(this.isIE)
		return this.eventObject.srcElement;
	else
		return this.eventObject.currentTarget;
}
//-----------------------------------------------------------------------------
//**DME**
function DME(nodeDme)
{
	if(typeof(nodeDme) == "undefined" || !nodeDme 
		|| (nodeDme && nodeDme.getAttribute("qry")== "") )
	{
		var strXML = '<DATA id="" TITLE="" col="" row="" height="" width="" ';
		strXML += 'border="0" scroll="1" filter="0" filtertitle="Filter" hide="0" ';
		strXML += 'windowoption="ptr" ahide="0" qry="" pdloverride="" maxrecs="" ';
		strXML += 'pagesize="" prod="" sys="" file="" xsl="dme.xsl" sort="" tp="DME" ';
		strXML += 'nm="Dme Query" interval="0" par="" dseq="" host="">';
		strXML += '<TABLE header="horizontal"/><LINK type="drill" tkn="" desc=""/>';
		strXML += '<FIELDS font="tahoma" size="8pt" color="000000" addtorow="none" btnlabel="" btnvalue=""></FIELDS>';
		strXML += '<SORTS></SORTS><INDEX name=""></INDEX><CONDITIONS></CONDITIONS><CRITERIA></CRITERIA></DATA>';
		nodeDme = stringToXMLObj(strXML);
		if(nodeDme)nodeDme= nodeDme.documentElement;
		else return;
	}
	this.id = nodeDme.getAttribute("id")
	this.left = nodeDme.getAttribute("col")
	this.top = nodeDme.getAttribute("row")
	this.width = nodeDme.getAttribute("width")
	this.height = nodeDme.getAttribute("height")
	this.border = (nodeDme.getAttribute("border") == "1")?true:false;
	this.scroll = (chkValue(nodeDme.getAttribute("scroll"), "1") == "1")?true:false;
	this.zIndex = chkValue(nodeDme.getAttribute("zindex"), "1");
	this.title = nodeDme.getAttribute("TITLE")
	this.type=nodeDme.getAttribute("tp");

	this.prod = nodeDme.getAttribute("prod");
	if(nodeDme.getAttribute("pdloverride") == "y")
	{
		var strProd = portalWnd.oUserProfile.getAttribute("productline")
		this.prod = strProd
	}
	this.file = nodeDme.getAttribute("file");

	var strFields=""
	this.fieldProps = new Object();
	var fieldsNode = nodeDme.getElementsByTagName("FIELDS")[0];
	var graphNode = nodeDme.getElementsByTagName("GRAPHSTYLE")[0];
	if(this.graph)
	{
		this.fieldProps.color = chkValue(graphNode.getAttribute("color"),"black");
		this.fieldProps.font = chkValue(graphNode.getAttribute("font"),"Arial");
		this.fieldProps.size = chkValue(graphNode.getAttribute("size"), "8pt");
	}
	else
	{
		this.fieldProps.color = chkValue(fieldsNode.getAttribute("color"),"black");
		this.fieldProps.font = chkValue(fieldsNode.getAttribute("font"),"Arial");
		this.fieldProps.size = chkValue(fieldsNode.getAttribute("size"), "8pt");
	}
	this.fieldProps.addtorow = chkValue(fieldsNode.getAttribute("addtorow"), "none");
	this.fieldProps.btnlabel = chkValue(fieldsNode.getAttribute("btnlabel"), "");
	this.fieldProps.btnvalue = chkValue(fieldsNode.getAttribute("btnvalue"), "");

	this.fields = new Array()
	var colNodes = nodeDme.getElementsByTagName("FIELD")
	for(var i = 0;i<colNodes.length; i++)
	{
		strFields += colNodes[i].getAttribute("name") + ";"
		if(this.link == "form")colNodes[i].setAttribute("drill", "n")
		if(!colNodes[i].getAttribute("align"))colNodes[i].setAttribute("align", "1")

		this.fields[i] = new dmeField(colNodes[i].getAttribute("name"), colNodes[i].getAttribute("heading"),
									colNodes[i].getAttribute("rtsort"), colNodes[i].getAttribute("drill"),
									colNodes[i].getAttribute("hide"), colNodes[i].getAttribute("align"),
									colNodes[i].getAttribute("hdralign"), colNodes[i].getAttribute("wrap"),
									colNodes[i].getAttribute("hdrwrap"), colNodes[i].getAttribute("tooltip"),
									colNodes[i].getAttribute("hdrtooltip"), colNodes[i].getAttribute("occurs"))
	}
	this.numFields = i
	this.fieldstring = strFields

	this.index = nodeDme.getElementsByTagName("INDEX")[0].getAttribute("name")
	if(this.index != null && this.index != "")
	{
		this.keys = new Array()
		var keyNodes = nodeDme.getElementsByTagName("INDELEMENT")
		for (i=0; i< keyNodes.length; i++)
		{
			var strVal = keyNodes[i].getAttribute("value")
			if (strVal.substr(0,11) == "LAW_WEB_USR")
				strVal=portalWnd.oUserProfile.getAttribute(strVal.substr(strVal.indexOf(".")+1))

			if (!keyNodes[i].getAttribute("type"))
				keyNodes[i].setAttribute("type", "")

			this.keys[i] = new dmeKey(keyNodes[i].getAttribute("name"), strVal,
									keyNodes[i].getAttribute("label"), keyNodes[i].getAttribute("readonly"),
									keyNodes[i].getAttribute("rtupdate"), keyNodes[i].getAttribute("hide"),
									keyNodes[i].getAttribute("type"))
			// Check to see if the index key is in fields collection
			for(var j=0; j<this.numFields; j++)
			{
				if(this.fields[j].name ==this.keys[i].name)break;
			}
			if(j==this.numFields)this.keys[i].setData=true
		}
		this.numKeys = i
	}
	else
		this.index = ""

	this.xsl = nodeDme.getAttribute("xsl")
	if(this.xsl == "dme.xsl" || this.xsl == "dmesingle.xsl")
		this.graph = false
	else
		this.graph = true

	this.maxrecs = nodeDme.getAttribute("maxrecs")
	this.pageSize = nodeDme.getAttribute("pagesize")
			? parseInt(nodeDme.getAttribute("pagesize"))
			: parseInt(this.maxrecs);
	this.single = false
	if (this.pageSize == 1 && nodeDme.getAttribute("xsl") == "dmesingle.xsl")this.single = true
	this.filter = (nodeDme.getAttribute("filter")=="1")?true:false;
	this.filtertitle = nodeDme.getAttribute("filtertitle")
	var linkNode = nodeDme.getElementsByTagName("LINK")[0]
	this.link = linkNode.getAttribute("type")
	this.tooltip=linkNode.getAttribute("desc")
	this.tkn=""
	this.hk=""
	if (this.link == "form")
	{
		this.tkn = linkNode.getAttribute("tkn")
		for(i=0; i < this.numFields; i++)
		{
			if (this.fields[i].hide == "n")
			{
				this.fields[i].form = "y";
				break;
			}
		}
	}

	this.cond = ""
	this.condNodes=null
	var condNodes = nodeDme.getElementsByTagName("CONDITION")
	if(condNodes.length)this.condNodes=condNodes
	for (i=0; i<condNodes.length; i++)
	{
		if (condNodes[i].getAttribute("selected") == 'y')
			this.cond += "COND=" + condNodes[i].getAttribute("name")+"&"
	}
	this.cond = this.cond.substr(0, this.cond.length-1)

	// Criteria
	this.criteria = "";
	if (nodeDme.getElementsByTagName("CRITERIA")[0].firstChild)
	{
		this.criteria = nodeDme.getElementsByTagName("CRITERIA")[0].firstChild.nodeValue;
		this.criteria  = portalWnd.processMessageString(this.criteria);
	}		

	// Sorts
	this.sort = ""
	var sortNodes = nodeDme.getElementsByTagName("SORT")
	var len=(sortNodes?sortNodes.length:0)
	if (len)
	{
		this.sort = sortNodes[0].getAttribute("type")+"="
		for(i=0; i < len ; i++)
			this.sort += sortNodes[i].getAttribute("name")+";"
	}
	this.lastSort = "" // To manage sort direction

	this.begin = ""
	this.autoHide = (nodeDme.getAttribute("ahide") == "1")?true:false;
	this.hide = (nodeDme.getAttribute("hide") == "1")?true:false;
	this.navigateOption = nodeDme.getAttribute("windowoption")
	this.rendered = false

	this.api = ""
	this.objDmeResult=null
	this.currentRow = -1
	this.prevKeyString = ""
	this.curKeyString=""
	this.forceRefresh = false
	this.cancelupdate = false
	//this.checkBoxClicked=false;
	//Paging
	this.noOfRecords=0;
	this.noOfPages=0;
	this.currentPage=0;
}

//-----------------------------------------------------------------------------
DME.prototype.render=function()
{
	if(this.id == "")return;
	if (!this.rendered)
	{
		var dmeFrame = document.createElement("DIV")
		dmeFrame.className = "DMEObject";
		dmeFrame.id = this.id
		dmeFrame.style.position = "absolute"
		dmeFrame.style.left = this.left+"px"
		dmeFrame.style.top = this.top+"px"
		dmeFrame.style.height = this.height+"px"
		dmeFrame.style.width = this.width+"px"
		dmeFrame.style.zIndex = this.zIndex;
		dmeFrame.style.overflow = (this.scroll)?"auto":"hidden";				
		dmeFrame.onclick = page.setCurrentObj;
		dmeFrame.type="dme"
		if (!this.border)
			dmeFrame.style.borderWidth = "0px"
		dmeFrame.style.visibility = (this.hide || this.autoHide)?"hidden":"visible"
		document.body.appendChild(dmeFrame)
		if(this.link == "form")
		{
			var formFrame=document.createElement("IFRAME");
			formFrame.id=this.id + "_form";
			formFrame.src = "../blank.htm";
			formFrame.className="FormObject";
			formFrame.style.visibility="hidden"
			formFrame.style.position="absolute";
			formFrame.style.top="0px";
			formFrame.style.left="0px";
			formFrame.style.height="100%";
			formFrame.style.width="100%";
			formFrame.style.zIndex = "99999"
			document.body.appendChild(formFrame);
		}

		page.eventSink(this.id, "OnInit")

		this.dmeWriteHtm0()
		if (!this.autoHide)
		{
			page.eventSink(this.id, "OnLoadBegin")
			this.dmeBuildApi()
			if (this.single)
			{
				this.objDmeResult = this.dmeHttpRequest();
				if(!this.objDmeResult)return;
				if(this.checkError())return;
				page.eventSink(this.id, "OnLoadComplete")
				this.setPagingValues();
				this.dmeWriteSingle()
			}
			else if(this.graph)
			{
				this.objDmeResult = this.dmeHttpRequest();
				if(!this.objDmeResult)return;
				page.eventSink(this.id, "OnLoadComplete")
				if (portalObj.browser.isIE)
					this.dmeDrawGraphVML()
				else
					this.dmeDrawNSGraph()
			}
			else
			{
				this.dmeWriteHtm1()// Create header
				this.objDmeResult = this.dmeHttpRequest();
				if(!this.objDmeResult)return;
				if(this.checkError())return;
				page.eventSink(this.id, "OnLoadComplete")
				this.setPagingValues();
				this.dmeWriteHtm2()// Create table and display
			}
		}
		this.rendered = true
	}
}
//---------------------------------------------------------------------------------------------------
DME.prototype.setzIndex=function(zIndex)
{
	var elem = document.getElementById(this.id);
	if(elem)
	{
		this.zIndex = zIndex;
		elem.style.zIndex = this.zIndex;
	}
}
//---------------------------------------------------------------------------------------------------
DME.prototype.refresh=function(pStorage)
{
	// check on rendered state
	if (this.rendered)
	{
		var dmeFrame = document.getElementById(this.id)
		if (dmeFrame)
		{
			if(this.autoHide)
			{
				for(var i=0; i<this.numKeys; i++)
				{
					if(this.keys[i].updOnChg == "y")
					{
						var strVal = pStorage[this.keys[i].name]
						if(typeof(strVal) == "undefined" || strVal == "")return;
					}
				}
				this.autoHide = false
				dmeFrame.style.visibility = (this.hide || page.state.maximized)?"hidden":"visible";
			}
			page.eventSink(this.id, "OnLoadBegin")
			this.dmeBuildApi(pStorage)
			if (!this.forceRefresh)
			{
				if (this.prevKeyString == this.curKeyString)return;
			}
			else
			{
				this.forceRefresh = false
			}

			this.clearTableRows();
			if (this.single)
			{
				this.objDmeResult = this.dmeHttpRequest();
				if(!this.objDmeResult)return;
				if(this.checkError())return;
				page.eventSink(this.id, "OnLoadComplete")
				this.setPagingValues();
				this.dmeWriteSingle()
			}
			else if(this.graph)
			{
				this.objDmeResult = this.dmeHttpRequest();
				if(!this.objDmeResult)return;
				page.eventSink(this.id, "OnLoadComplete")
				if (portalObj.browser.isIE)
					this.dmeDrawGraphVML()
				else
					this.dmeDrawNSGraph()
			}
			else
			{
				this.dmeWriteHtm1()// Create header
				this.objDmeResult = this.dmeHttpRequest();
				if(!this.objDmeResult)return;
				if(this.checkError())return;
				page.eventSink(this.id, "OnLoadComplete")
				this.setPagingValues();
				this.dmeWriteHtm2()// Create table and display
			}
		}
		else
		{
			this.rendered = false
			this.render()
		}
	}
	else
	{
		this.render()
	}
}

//---------------------------------------------------------------------------------------------------
DME.prototype.dmeBuildApi=function(pStorage)
{
	if(this.file == "" || this.numFields == 0)
	{
		this.api = "";
		return;
	}
	this.api = "PROD=" + this.prod + "&FILE=" + this.file + "&FIELD=" + this.fieldstring
	if(this.index != "")
	{
		this.api += "&INDEX=" + this.index + "&KEY"
		for (var i = 0; i < this.numKeys; i++)
		{
			if (typeof(pStorage) == "undefined")
				var strVal = "";
			else
			{
				var strVal= pStorage[this.keys[i].name];
				if(!strVal || typeof(strVal) == "undefined")
					strVal = "";
			}
			if (this.keys[i].type == "5")strVal = this.dmeConvertDate(strVal)
			if (this.keys[i].updOnChg == "y")
			{
				if(strVal == "")strVal = this.keys[i].value
				if(strVal != "")this.api += "=" +  strVal
			}
			else if(!this.rendered && strVal != "")
			{
				this.api += "=" +  strVal
			}
			else if(this.keys[i].value != "") // Key does not depend on the parent and has value set at design time
			{
				this.api += "=" +  this.keys[i].value
			}
		}
		this.curKeyString = this.api.substr(this.api.indexOf("&KEY")+4)
	}

	if (this.cond != "")
		this.api += "&" + this.cond
		
	if (this.sort != "")
		this.api += "&" + this.sort
		
	if (this.criteria != "")
		this.api += (this.criteria.indexOf("&") == 0 ? this.criteria : "&" + this.criteria)

	if (this.maxrecs != "")this.api += "&MAX=" + this.maxrecs
	this.api += (this.graph)?"&OUT=xmlgraph":"&OUT=XML"
	if (this.begin != "")this.api += "&" + this.begin
}

DME.prototype.dmeHttpRequest=function()
{
	if(this.api == "")return null;
	this.prevKeyString = this.curKeyString
	this.currentRow = -1
	return (portalWnd.httpRequest(portalWnd.DMEPath+"?"+this.api))
}

//---------------------------------------------------------------------------------------------------
DME.prototype.dmeConvertDate=function(strVal)
{
	if(strVal == "" || typeof(strVal) == "undefined")return "";
	if(strVal.indexOf("->") > -1)return strVal		// All index values with range, specify server format
	var dt = portalWnd.edGetDateObject(strVal, strVal.length)
	var lawDt = portalWnd.edFormatLawsonDate(dt)
	return lawDt

}

//---------------------------------------------------------------------------------------------------
DME.prototype.dmeWriteHtm0=function()
{
	var objMainWin = document.getElementById(this.id)
	var objTitDiv = document.createElement("DIV")
	var ht1 = (this.title != "")?"40px":"20px";
	var tp2 = (this.title != "")?"50px":"30px";
	this.dmeSetStyle(objTitDiv, "titleDiv_"+this.id, false, "0%", "0%", ht1, "100%")
	objTitDiv.style.borderBottom = "1px solid black"
	objMainWin.appendChild(objTitDiv)

	var dmeTitle = document.createElement("TABLE");
	dmeTitle.style.width = "100%";
	dmeTitle.id = "dmeTitle_"+this.id;
	dmeTitle.border = "0px";
	dmeTitle.cellPadding = "0px";
	dmeTitle.cellSpacing = "0px";
	objTitDiv.appendChild(dmeTitle);

	var objRow, cell0, cell1;
	if(this.title != "")
	{
		objRow = dmeTitle.insertRow(dmeTitle.rows.length);
		objRow.height = "20px";
		objRow.className = "TitleBarFill";

		cell0 = objRow.insertCell(0);
		cell0.width = "89%";
		cell0.className = "TitleBar";
		cell0.align = "left";
		cell0.appendChild(document.createTextNode(this.title));

		cell1 = objRow.insertCell(1);
		cell1.width = "11%";
		cell1.align = "right"
		var image = document.createElement("IMG");
		cell1.appendChild(image);
		image.id = "Maxbtn_"+this.id;
		image.src = "../images/ico_maximize.gif";
		image.alt = page.phrases.getPhrase("maximize");
		image.container = this.id;
		image.onclick = nuggletMaximize;
	}

	objRow = dmeTitle.insertRow(dmeTitle.rows.length);
	objRow.height = "20px";

	cell0 = objRow.insertCell(0)
	cell0.width="90%"
	cell0.align = "right"
	var btnPrev = this.dmeCreateButton("btnPrev_"+this.id, false, "Previous", "PREVCALL", this.id)
	btnPrev.onclick = dmePreviousNext
	cell0.appendChild(btnPrev)

	cell1 = objRow.insertCell(1)
	cell1.width="10%"
	cell1.align = "center"
	var btnNext = this.dmeCreateButton("btnNext_"+this.id, false, "Next", "NEXTCALL", this.id)
	btnNext.onclick = dmePreviousNext
	cell1.appendChild(btnNext)

	var contentDiv = document.createElement("DIV")
	contentDiv.id = "contentDiv_"+this.id;
	contentDiv.style.left = "0%";
	contentDiv.style.top = tp2;
	contentDiv.style.width = "99.5%";
	objMainWin.appendChild(contentDiv)

	if(!this.graph)
	{
		var dmeTable = document.createElement("TABLE")
		dmeTable.align = "center"
		dmeTable.id = "dmeTable_"+this.id
		contentDiv.appendChild(dmeTable)

		var tbody0 = document.createElement("TBODY")
		tbody0.id = "tbody0_"+this.id
		dmeTable.appendChild(tbody0)
	}
}

//---------------------------------------------------------------------------------------------------
DME.prototype.dmeWriteHtm1=function()
{
	var oTable = document.getElementById("dmeTable_"+this.id)
	var oThead = oTable.createTHead();
	var objRow = oThead.insertRow(0)
	var j = 0;
	if(this.fieldProps.addtorow == "checkbox" || this.fieldProps.addtorow == "both" )
	{
		var objCol = objRow.insertCell(j++);
		objCol.align = "center";
		objCol.noWrap = false;
		oChild = this.dmeCreateSpan(page.phrases.getPhrase("select"), true, false);
		if(oChild)
		{
			oChild.style.color = this.fieldProps.color;
			oChild.style.fontFamily = this.fieldProps.font;
			oChild.style.fontSize = this.fieldProps.size;
			objCol.appendChild(oChild)
		}
	}
	for (var i=0; i < this.numFields; i++)
	{
		if (this.fields[i].hide == 'n')
		{
			for(var k=0; k<this.fields[i].occurs; k++)
			{
				var objCol = objRow.insertCell(j++)
				objCol.align = this.dmeGetAlignment(this.fields[i].hdralign);
				objCol.noWrap =this.fields[i].hdrwrap;
				if (this.fields[i].sort == 'y')
					oChild = this.dmeCreateAnchor(this.fields[i].heading, true, "sort", 
							0, i, this.fields[i].name, this.fields[i].hdrtooltip, this.id)
				else
					oChild = this.dmeCreateSpan(this.fields[i].heading, true, false)
				if(oChild)
				{
					oChild.style.color = this.fieldProps.color;
					oChild.style.fontFamily = this.fieldProps.font;
					oChild.style.fontSize = this.fieldProps.size;
					objCol.appendChild(oChild)
				}
			}
		}
	}
	if(this.fieldProps.addtorow == "button" || this.fieldProps.addtorow == "both" )
	{
		var objCol = objRow.insertCell(j++);
		objCol.align = "center";
		objCol.noWrap = false;
		oChild = this.dmeCreateSpan(this.fieldProps.btnlabel, true, false);
		if(oChild)
		{
			oChild.style.color = this.fieldProps.color;
			oChild.style.fontFamily = this.fieldProps.font;
			oChild.style.fontSize = this.fieldProps.size;
			objCol.appendChild(oChild)
		}
	}
	objRow = oThead.insertRow(1)
	var objHr = objRow.insertCell(0)
	objHr.colSpan = Math.max(oTable.rows[0].cells.length,1)
	objHr.appendChild(this.dmeCreateHr())
}

//---------------------------------------------------------------------------------------------------
DME.prototype.dmeWriteHtm2=function()
{
	var rowIndex = 0;
	var i, len;
	i = this.pageSize * (this.currentPage - 1);
	len = (this.pageSize + i > this.noOfRecords)?this.noOfRecords:(this.pageSize + i);

	var objRow, objCol;
	var oTbody = document.getElementById("tbody0_"+this.id)
	var dmeRecords = this.objDmeResult.getElementsByTagName("RECORD");
	for (; i<len; i++)//row index
	{
		var colNodes = dmeRecords[i].getElementsByTagName("COL")
		objRow = oTbody.insertRow(rowIndex++)
		objRow.id = "row" + i
		objRow.container = this.id
		objRow.onclick = dmeRowClick
		var k=0; //cell index
		if(this.fieldProps.addtorow == "checkbox" || this.fieldProps.addtorow == "both" )
		{
			var objCol = objRow.insertCell(k++);
			objCol.align = "center";
			objCol.noWrap = false;
			oChild = this.dmeCreateCheckbox(this.id+"_chk"+i, this.id, i);
			oChild.onclick = dmeCheckBoxClick
			objCol.appendChild(oChild)
		}
		for(var j=0; j<this.numFields; j++) // column index (includes hidden columns)
		{
			if (this.fields[j].hide == 'n')
			{
				var occNodes = (this.fields[j].occurs > 1)?colNodes[j].getElementsByTagName("OCC"):null;

				for(var l=0; l<this.fields[j].occurs; l++) // occurs index
				{
					objCol = objRow.insertCell(k++)
					objCol.id = "col" + (k-1)
					objCol.colName = this.fields[j].name;
					objCol.align = this.dmeGetAlignment(this.fields[j].align)
					objCol.noWrap = this.fields[j].wrap;

					if(this.fields[j].occurs == 1)
					{
						for(var x=0;x<colNodes[j].childNodes.length;x++)
						{
							if(colNodes[j].childNodes[x].nodeType==4)
							{
								objCol.setAttribute("text", colNodes[j].childNodes[x].nodeValue)
								break;
							}
						}
					}
					else
					{
						for(var y=0; y<occNodes[l].childNodes.length; y++)
						{
							if(occNodes[l].childNodes[y].nodeType==4)
							{
								objCol.setAttribute("text", occNodes[l].childNodes[y].nodeValue)
							}
						}
					}

					var oChild
					if (this.fields[j].drill == 'y')
						oChild = this.dmeCreateAnchor(objCol.getAttribute("text"), false, 
								this.link, i, (k-1), this.fields[j].name, this.fields[j].tooltip, this.id)
					else if(this.fields[j].form == 'y')
						oChild = this.dmeCreateAnchor(objCol.getAttribute("text"), false, 
								this.link, i, (k-1), this.fields[j].name, this.tooltip, this.id)
					else
						oChild = this.dmeCreateSpan(objCol.getAttribute("text"), false, true)
					objCol.appendChild(oChild)
				}
			}
		}
		if (this.fieldProps.addtorow == "button" || this.fieldProps.addtorow == "both" )
		{
			var objCol = objRow.insertCell(k++);
			objCol.align = "center";
			objCol.noWrap = false;
			oChild = this.dmeCreateButton(this.id+"_btn"+i, true, this.fieldProps.btnvalue, "", this.id);
			oChild.onclick = dmeButtonClick
			objCol.appendChild(oChild)
		}
	}
	objRow = oTbody.insertRow(rowIndex)
	objCol = objRow.insertCell(0)
	objCol.colSpan = oTbody.rows[0].cells.length
	objCol.appendChild(this.dmeCreateHr())

	//  Enable/Disable Prev/Next buttons
	var btnPrev = document.getElementById("btnPrev_"+this.id)
	var btnNext = document.getElementById("btnNext_"+this.id)

	btnPrev.style.display = (this.currentPage > 1 ||
				(this.currentPage == 1 && this.objDmeResult.getElementsByTagName("PREVCALL").length == 1))?"block":"none"
	btnNext.style.display = ((this.currentPage<this.noOfPages) ||
				(this.currentPage == this.noOfPages && this.objDmeResult.getElementsByTagName("NEXTCALL").length == 1))?"block":"none"
}

//---------------------------------------------------------------------------------------------------
DME.prototype.dmeWriteSingle=function()
{
	var oTbody = document.getElementById("tbody0_"+this.id)
	var dmeRecords = this.objDmeResult.getElementsByTagName("RECORD");
	var recordNo = this.pageSize * (this.currentPage - 1)
	dmeRecords = dmeRecords[recordNo];
	var colNodes = dmeRecords.getElementsByTagName("COL")
	for (var i=0; i < colNodes.length; i++)
	{
		if (this.fields[i].hide == 'n')
		{
			var occNodes = (this.fields[i].occurs > 1)?colNodes[i].getElementsByTagName("OCC"):null;
			for(var j=0; j < this.fields[i].occurs; j++)
			{
				var objRow = oTbody.insertRow(oTbody.rows.length)
				var objCol = objRow.insertCell(0)
				objCol.id = "colname" + i
				objCol.align = "right"
				var oChild = this.dmeCreateSpan(this.fields[i].heading, true, false)
				objCol.appendChild(oChild)

				objCol = objRow.insertCell(1)
				objCol.id = "col" + i
				objCol.align = this.dmeGetAlignment(this.fields[i].align)

				if(this.fields[i].occurs == 1)
				{
					for(var x=0;x<colNodes[i].childNodes.length;x++)
					{
						if(colNodes[i].childNodes[x].nodeType==4)
						{
							objCol.setAttribute("text", colNodes[i].childNodes[x].nodeValue)
							break;
						}
					}
				}
				else
				{
						for(var y=0; y<occNodes[j].childNodes.length; y++)
						{
							if(occNodes[j].childNodes[y].nodeType==4)
							{
								objCol.setAttribute("text", occNodes[j].childNodes[y].nodeValue)
							}
						}
				}

				if (this.fields[i].drill == 'y' )
					oChild = this.dmeCreateAnchor(objCol.getAttribute("text"), false, this.link, 
							recordNo, i, this.fields[i].name, this.fields[i].tooltip, this.id)
				else if( this.fields[i].form == 'y')
					oChild = this.dmeCreateAnchor(objCol.getAttribute("text"), false, this.link, 
							recordNo, i, this.fields[i].name, this.tooltip, this.id)
				else
					oChild = this.dmeCreateSpan(objCol.getAttribute("text"), false, true)
				objCol.appendChild(oChild)
			}
		}
	}
	if(this.fieldProps.addtorow == "button" || this.fieldProps.addtorow == "both" )
	{
		objRow = oTbody.insertRow(oTbody.rows.length)
		objCol = objRow.insertCell(0);
		objCol = objRow.insertCell(1);
		objCol.align = "center";
		objCol.noWrap = false;
		oChild = this.dmeCreateButton(this.id+"_btn0", true, this.fieldProps.btnvalue, "", this.id);
		oChild.onclick = dmeButtonClick
		objCol.appendChild(oChild)
	}
	objRow = oTbody.insertRow(oTbody.rows.length)
	objCol = objRow.insertCell(0)
	objCol.colSpan = 2
	objCol.appendChild(this.dmeCreateHr())

	//  Enable/Disable Prev/Next buttons
	var btnPrev = document.getElementById("btnPrev_"+this.id)
	var btnNext = document.getElementById("btnNext_"+this.id)

	btnPrev.style.display = (this.currentPage > 1 ||
				(this.currentPage == 1 && this.objDmeResult.getElementsByTagName("PREVCALL").length == 1))?"block":"none"
	btnNext.style.display = ((this.currentPage<this.noOfPages) ||
				(this.currentPage == this.noOfPages && this.objDmeResult.getElementsByTagName("NEXTCALL").length == 1))?"block":"none"

	if (!this.cancelUpdate)
	{
		var rowStorage = new PortalStorage()
		for (i=0; i<this.numFields;i++)
		{
			for(x=0; x<colNodes[i].childNodes.length;x++)
			{
				if(colNodes[i].childNodes[x].nodeType == 4)
				{
					rowStorage.addElement(this.fields[i].name, portalWnd.trim(colNodes[i].childNodes[x].nodeValue))
					break;
				}
			}

		}
		for(i=0;i<this.numKeys;i++)
		{
			if(this.keys[i].setData && this.keys[i].value !="")
				rowStorage.addElement(this.keys[i].name, portalWnd.trim(this.keys[i].value))
		}
		page.setObjectValues(this.id, rowStorage)
		page.eventSink(this.id, "OnDatasrcUpdate")
	}
}
DME.prototype.clearTableRows=function()
{
	var oTable = document.getElementById("dmeTable_"+this.id)
	var len=(oTable?oTable.rows.length:0)
	for(var i=len-1; i>=0; i--)
		oTable.deleteRow(i)
}

//---------------------------------------------------------------------------------------------------
DME.prototype.checkError=function()
{
	//Reset Prev/Next buttons
	var btnPrev = document.getElementById("btnPrev_"+this.id)
	var btnNext = document.getElementById("btnNext_"+this.id)
	btnPrev.style.display = "none";
	btnNext.style.display = "none";
	
	if(this.objDmeResult.status)
	{
		this.dmePrintNoRecords(portalObj.getPhrase("ERROR_LOAD_XML")+" [2249]");
		return true;
	}
	var msgNode = this.objDmeResult.getElementsByTagName("MESSAGE");
	if (msgNode && msgNode.length)
	{
		msgNode = msgNode[0];
		var status = msgNode.getAttribute("status");
		if (status != "0")
		{
			var msg = msgNode.firstChild.nodeValue;
			if (msg.length > 0)
				this.dmePrintNoRecords(portalObj.getPhrase("LBL_ERROR") + " - " + msgNode.firstChild.nodeValue);
			return true;
		}
	}
	if(this.objDmeResult.getElementsByTagName("RECORDS").length == 0)
	{
		this.dmePrintNoRecords(portalObj.getPhrase("msgErrorCallingDME")+"\n"+this.api);
		return true;
	}
	var count = this.objDmeResult.getElementsByTagName("RECORDS")[0].getAttribute("count")
	if (count == 0)
	{
		this.dmePrintNoRecords(portalObj.getPhrase("msgNoRecordsFound"));
		return true;
	}
	return false;
}
//---------------------------------------------------------------------------------------------------
DME.prototype.setPagingValues=function()
{
	var records = parseInt(this.objDmeResult.getElementsByTagName("RECORDS")[0].getAttribute("count"));
	this.noOfRecords = records;
	this.noOfPages = Math.ceil(this.noOfRecords/this.pageSize);
	this.currentPage=1;
	
	if(this.noOfPages && (this.begin != "" && this.begin.indexOf("PREV") != -1))
		this.currentPage = this.noOfPages
}
//---------------------------------------------------------------------------------------------------
DME.prototype.dmeDrawFilter=function()
{
	if(portalObj.tabArea.tabs["PAGE"].navletObjects[this.id+"_filterNav"])
	{
		portalObj.tabArea.tabs["PAGE"].navletObjects[this.id+"_filterNav"].show();
		return;
	}
	var navletObj = portalObj.tabArea.tabs["PAGE"].addNavlet(this.filtertitle,this.id+"_filterNav",window)
	var filterObj = navletObj.addFilter(this.id+"_filterObj", "dmeApplyFilter")

	// Index keys
	for (var i=0;i<this.numKeys;i++)
	{
		if (!this.keys[i].hide)
		{
			var objText = filterObj.addField("IND_"+this.keys[i].name, this.keys[i].label, "text")
			if(this.keys[i].readOnly)objText.disabled=true
			if(this.keys[i].value)objText.value=this.keys[i].value
		}
	}
	// Conditions
	if(this.condNodes)
	{
		for(i=0; i<this.condNodes.length; i++)
		{
			var strHide=this.condNodes[i].getAttribute("hide")
			if(strHide == "y")continue;
			var objCheck = filterObj.addField("CND_"+this.condNodes[i].getAttribute("name"), 
					this.condNodes[i].getAttribute("label"), "checkbox")
			if(this.condNodes[i].getAttribute("selected")=="y")objCheck.checked=true
		}
	}
	portalObj.tabArea.tabs["PAGE"].setTitle(page.title)
	portalObj.tabArea.tabs["PAGE"].show()
}

//---------------------------------------------------------------------------------------------------
function dmeApplyFilter(retObj)
{
	var arrNamVal
	var i,j
	var objDme = page.objects[page.currentObjId]
	objDme.cond=""
	for (i=0;i<retObj.length;i++)
	{
		arrNamVal = retObj[i]
		var strPrefix = arrNamVal[0].substr(0,4)
		var strName = arrNamVal[0].substr(4)
		if(strPrefix == "IND_")
		{
			for(j=0; j<objDme.numKeys; j++)
			{
				if(!objDme.keys[j].hide && objDme.keys[j].name == strName)
				{
					objDme.keys[j].value=arrNamVal[1]
					break;
				}
			}
		}
		if(strPrefix == "CND_")
		{
			for(j=0;j<objDme.condNodes.length;j++)
			{
				var strHide=objDme.condNodes[j].getAttribute("hide")
				if(strHide == "y")continue;
				if(objDme.condNodes[j].getAttribute("name") == strName)
				{
					var strSelected = arrNamVal[1]?"y":"n"
					objDme.condNodes[j].setAttribute("selected", strSelected)
					if(arrNamVal[1])
					{
						objDme.cond += "COND="+strName +"&"
					}
				}
			}
		}
	}
	objDme.cond = objDme.cond.substr(0, objDme.cond.length-1)
	page.eventSink(objDme.id, "OnApplyFilter")
	objDme.forceRefresh = true
	objDme.refresh()
}

//---------------------------------------------------------------------------------------------------
DME.prototype.dmeSetStyle=function(obj, id, bPosAbs, sleft, stop, sheight, swidth)
{
	if (!obj)return
	if(id != "")obj.id = id
	obj.style.position=bPosAbs ? "absolute": "relative";
	if(sleft != "")obj.style.left=sleft
	if(stop != "")obj.style.top=stop
	if(sheight != "")obj.style.height=sheight
	if(swidth != "")obj.style.width=swidth
}

//---------------------------------------------------------------------------------------------------
DME.prototype.dmeCreateSpan=function(strText, bBold, bCursor)
{
	var oSpan = document.createElement("SPAN")
	oSpan.className = "DMECol"
	oSpan.style.position = "relative"
	oSpan.style.paddingRight = "10px"
	if(bBold)oSpan.style.fontWeight = "bold"
	if(bCursor)oSpan.style.cursor = (portalObj.browser.isIE)?"hand":"pointer"
	var oText = document.createTextNode(strText)
	oSpan.appendChild(oText)
	return oSpan
}

//---------------------------------------------------------------------------------------------------
DME.prototype.dmeCreateAnchor=function(strText, bBold, strAction, nRow, nCol, fldName, strTooltip, strContainer)
{
	var oAnchor = this.dmeCreateSpan(strText, bBold, true)
	oAnchor.style.textDecoration = "underline"

	oAnchor.action = strAction
	oAnchor.sort = "SORTASC"
	oAnchor.row = nRow
	oAnchor.col = nCol
	oAnchor.fldName = fldName
	oAnchor.container = strContainer
	if (strTooltip && strTooltip != "")oAnchor.title = strTooltip
	oAnchor.onclick = dmeAnchorClick
	return oAnchor
}

//---------------------------------------------------------------------------------------------------
DME.prototype.dmeCreateButton=function(id, bDisplay, strValue, strNodeName, strContainer)
{
	var btnObj = document.createElement("INPUT")
	btnObj.type = "button"
	btnObj.className = "DMEButton"
	btnObj.style.position = "relative"
	btnObj.id = id
	btnObj.style.display = bDisplay?"block":"none"
	btnObj.value = strValue
	btnObj.prevNext = strNodeName
	btnObj.container = strContainer
	return btnObj
}

//---------------------------------------------------------------------------------------------------
DME.prototype.dmeCreateCheckbox=function(id, strContainer, row)
{
	var chkObj = document.createElement("INPUT")
	chkObj.type = "checkbox"
	chkObj.style.position = "relative"
	chkObj.id = id
	chkObj.r = row;
	chkObj.container = strContainer
	return chkObj
}

//---------------------------------------------------------------------------------------------------
DME.prototype.dmeCreateHr=function()
{
	var oHr = document.createElement("HR")
	oHr.size = "0"
	oHr.noShade = true
	return oHr
}

//---------------------------------------------------------------------------------------------------
DME.prototype.dmeGetAlignment=function(strAlign)
{
	switch(strAlign)
	{
		case "0":
			return "left"
		case "1":
			return "right"
		case "2":
			return "center"
		default:
			return "right"
	}
}
//---------------------------------------------------------------------------------------------------
DME.prototype.showFilter=function(show)
{
	show = (typeof(show) != "boolean" ? true : show);
	
	if(show)
	{
		page.currentObjId = this.id;
		this.dmeDrawFilter();
	}
	else
	{
		page.currentObjId = "";
		var oTab = portalObj.tabArea.tabs["PAGE"];
		
		if(oTab)
			oTab.removeNavlet(this.id + "_filterNav");
	}

	return true;
}
//---------------------------------------------------------------------------------------------------
DME.prototype.dmePrintNoRecords=function(strPhrase)
{
	var dmeTable = document.getElementById("dmeTable_" + this.id)
	var oTbody = document.getElementById("tbody0_" + this.id)
	var objRow = oTbody.insertRow(0)
	var objCol = objRow.insertCell(0)
	objCol.colSpan = (this.single)?2:dmeTable.rows[0].cells.length
	objCol.appendChild(this.dmeCreateSpan(strPhrase, false, false))

	objRow = oTbody.insertRow(1)
	objCol = objRow.insertCell(0)
	objCol.colSpan = (this.single)?2:dmeTable.rows[0].cells.length
	objCol.appendChild(this.dmeCreateHr())

}

//---------------------------------------------------------------------------------------------------
function dmeAnchorClick(e)
{
	e = e?e.currentTarget:window.event.srcElement
	if(typeof(e.container) == "undefined")return;
	var objDme = page.objects[e.container]
	if(!objDme)return;

	switch (e.action)
	{
		case "sort":
			var strSort="SORTASC="+objDme.fields[e.col].name
			if (objDme.lastSort != "")
			{
				if (objDme.fields[e.col].name == objDme.lastSort.substr(objDme.lastSort.indexOf("=")+1))
				{
					if(strSort == objDme.lastSort)strSort="SORTDESC="+objDme.fields[e.col].name
				}
			}
			objDme.dmeSort(strSort)
			break;
		case "drill":
			objDme.dmeDrill("", e.fldName, e.row, e.col)
			break;
		case "form":
			objDme.dmeOpenForm(e.row)
			break;
	}
}

//---------------------------------------------------------------------------------------------------
function dmeRowClick(e)
{
	var rowObj=e?e.currentTarget:window.event.srcElement
	if (rowObj.id.indexOf("row") == -1)
	{
		rowObj = rowObj.parentNode
		if (rowObj.id.indexOf("row") == -1)
		{
			rowObj = rowObj.parentNode
			if (rowObj.id.indexOf("row") == -1)return
		}
	}
	var objDme = page.objects[rowObj.container]
	var curRow = parseInt(rowObj.id.substr(3));
	if (objDme.currentRow == curRow)
	{
		page.eventSink(objDme.id, "OnRowClick"); // Fire click eventhough the active row has not changed - PT90626
		return;
	}
	else if (objDme.currentRow != -1)
	{
		var curRowTbl = objDme.currentRow % objDme.pageSize + 2;
		var objTable = document.getElementById("dmeTable_"+objDme.id)
		var rowElem = objTable.rows[curRowTbl];
		
		if(rowElem)
			rowElem.className = "";
	}
	objDme.currentRow = curRow
	rowObj.className= "DMECurrentRow"
	page.eventSink(objDme.id, "OnRowClick")

	if (!objDme.cancelUpdate)
	{
		var colNodes = objDme.objDmeResult.getElementsByTagName("RECORD")[objDme.currentRow].getElementsByTagName("COL")
		var rowStorage = new PortalStorage()
		for (var i=0; i<objDme.numFields;i++)
		{
			for(var x=0; x<colNodes[i].childNodes.length;x++)
			{
				if(colNodes[i].childNodes[x].nodeType == 4)
				{
					rowStorage.addElement(objDme.fields[i].name, portalWnd.trim(colNodes[i].childNodes[x].nodeValue))
					break;
				}
			}

		}
		for(i=0;i<objDme.numKeys;i++)
		{
			if(objDme.keys[i].setData && objDme.keys[i].value !="")rowStorage.addElement(objDme.keys[i].name, portalWnd.trim(objDme.keys[i].value))
		}
		page.setObjectValues(objDme.id, rowStorage)
		page.eventSink(objDme.id, "OnDatasrcUpdate")
	}
	//objDme.checkBoxClicked = false;
}


DME.prototype.getValue=function(fieldName, row)
{
	if(typeof(fieldName) != "string")
		return null;
	
	row = (typeof(row) != "undefined" ? row : this.currentRow);

	if(isNaN(row))
		return null;
	
	var recordAry = this.getRowRecord(row);
	var loop = recordAry.length;
	
	for(var i = 0; i < loop; i++)
	{
		var oField = recordAry[i];
		
		if(oField.name == fieldName)
			return oField.value;
	}
	
	return null;
}
DME.prototype.getRowRecord=function(row)
{
	var recordAry = new Array;
	
	row = (typeof(row) != "undefined" ? row : this.currentRow);
	
	if(isNaN(row))
		return recordAry;

	var recordNode = this.objDmeResult.getElementsByTagName("RECORD")[row];
	
	if(!recordNode)
		return recordAry;
	
	var oNodes = recordNode.getElementsByTagName("COL");
	
	if(!oNodes)
		return recordAry;
		
	var loop = (this.fields ? this.fields.length : 0);

	for(var i = 0; i < loop; i++)
	{
		var innerLoop = (oNodes[i] ? oNodes[i].childNodes.length : 0);
		
		for(var j = 0; j < innerLoop; j++)
		{
			if(oNodes[i].childNodes[j].nodeType == 4)		
			{
				var oField = new Object;
				oField.name = this.fields[i].name;
				oField.value = oNodes[i].childNodes[j].nodeValue;
				recordAry.push(oField);
				break;
			}
		}
	}
	
	return recordAry;
}

DME.prototype.getRowRecordKeys=function(row)
{
	var keyAry = new Array;
	var strRecordKey = "";
	
	row = (typeof(row) != "undefined" ? row : this.currentRow);
	
	if(isNaN(row))
		return keyAry;

	var keyNodes = this.objDmeResult.getElementsByTagName("KEY");
	var loop = keyNodes.length;

	for(var i = 0; i < loop; i++)
	{
		var keyNode = keyNodes[i];
		var oField = new Object;
		oField.name = keyNode.getAttribute("name");	
		oField.type = keyNode.getAttribute("type");
		oField.size = keyNode.getAttribute("size");
		oField.value = null;
		keyAry.push(oField);
	}	

	var recordNode = this.objDmeResult.getElementsByTagName("RECORD")[row];
	
	if(!recordNode)
		return keyAry;
	
	var oNodes = recordNode.getElementsByTagName("RECKEY");
	
	if(!oNodes)
		return keyAry;
		
	var oNode = oNodes[0];
	var loop = (oNode ? oNode.childNodes.length : 0);

	for(var i = 0; i < loop; i++)
	{
		if(oNode.childNodes[i].nodeType == 4)
		{
			strRecordKey = oNode.childNodes[i].nodeValue;
			break;
		}
	}
	
	var valueAry = strRecordKey.split("=");
	valueAry.shift(1);
	var loop = valueAry.length ;

	for(var i = 0; i < loop; i++)
		keyAry[i].value = valueAry[i];
	
	return keyAry;
}
DME.prototype.getRowDrillKeys=function(row)
{
	row = (typeof(row) != "undefined" ? row : this.currentRow);
	
	if(isNaN(row))
		return null;

	var recordNode = this.objDmeResult.getElementsByTagName("RECORD")[row];
	
	if(!recordNode)
		return null;
	
	var oNodes = recordNode.getElementsByTagName("IDACALL");
	
	if(!oNodes)
		return null;
		
	var oNode = oNodes[0];
	var loop = (oNode ? oNode.childNodes.length : 0);

	for(var i = 0; i < loop; i++)
	{
		if(oNode.childNodes[i].nodeType == 4)
			return oNode.childNodes[i].nodeValue;
	}
	
	return null;
}

DME.prototype.setValue=function(fieldName, row, value)
{
	if(typeof(fieldName) != "string")
		return false;

	if(isNaN(row))
		return false;
		
	if(typeof(value) != "string")
		return false;

	var recordNode = this.objDmeResult.getElementsByTagName("RECORD")[row];
	
	if(!recordNode)
		return false;

	var oNodes = recordNode.getElementsByTagName("COL");
	
	if(!oNodes)
		return false;
				
	var loop = (this.fields ? this.fields.length : 0);
	
	for(var i = 0; i < loop; i++)
	{
		var name = this.fields[i].name;
		
		if(fieldName == name)
		{
			var innerLoop = (oNodes[i] ? oNodes[i].childNodes.length : 0);
		
			for(var j = 0; j < innerLoop; j++)
			{
				if(oNodes[i].childNodes[j].nodeType == 4)		
				{
					oNodes[i].childNodes[j].nodeValue = value;
					break;
				}
			}
		}
	}

	var oTable = document.getElementById("dmeTable_" + this.id)
	var oRows = oTable.rows;
	var loop = oRows.length
	var rowId = "row" + row;
			
	for(var i = 0; i < loop; i++)
	{
		if(oRows[i].id == rowId)
		{
			var oCells = oRows[i].cells;
			var innerLoop = oCells.length;
			
			for(var j = 0; j < innerLoop; j++)
			{
				var oCell = oCells[j];
				var cellColName = oCell.getAttribute("colName");

				if(fieldName == cellColName)
				{
					var oElem = oCell.childNodes[0];
					oElem.firstChild.data = value;
					return true;
				}			
			}
			
			return true;
		}
	}	
			
	return true;		

}

DME.prototype.getCheckedRows=function()
{
	var returnAry = new Array();
	
	if(this.fieldProps.addtorow != "checkbox" && this.fieldProps.addtorow != "both" )
		return returnAry;
		
	var oTable = document.getElementById("dmeTable_" + this.id)
	var loop = oTable.rows.length;
	
	for(var i = 1; i < loop; i++)
	{
		var oRow = oTable.rows[i];
		var oCell = oRow.cells[0];

		if(oCell.childNodes[0].id.indexOf("chk") == -1)
			continue;
			
		if(oCell.childNodes[0].checked)
		{
			var row = oCell.childNodes[0].getAttribute("r");
			returnAry.push(row);
		}
	}

	return returnAry;
}

DME.prototype.setButtonValue=function(value, row)
{
	row = (typeof(row) != "undefined" ? row : this.currentRow);
	
	if(isNaN(row))
		return false;

	if(typeof(value) != "string")
		return false;
	
	var id = this.id + "_btn" + row;	
	var btn = document.getElementById(id);
	
	if(!btn)
		return false;
		
	btn.value = value;
	return true;		
}
DME.prototype.getButtonValue=function(row)
{
	row = (typeof(row) != "undefined" ? row : this.currentRow);
	
	if(isNaN(row))
		return null;
	
	var id = this.id + "_btn" + row;	
	var btn = document.getElementById(id);
	
	if(!btn)
		return null;
		
	return btn.value;
}
DME.prototype.disableButton=function(disable, row)
{
	if(typeof(disable) != "boolean")
		return false;
		
	row = (typeof(row) != "undefined" ? row : this.currentRow);
	
	if(isNaN(row))
		return false;
	
	var id = this.id + "_btn" + row;	
	var btn = document.getElementById(id);
	
	if(!btn)
		return false;
		
	btn.disabled = disable;
	return true;		
}
DME.prototype.isButtonDisabled=function(row)
{
	row = (typeof(row) != "undefined" ? row : this.currentRow);
	
	if(isNaN(row))
		return null;
	
	var id = this.id + "_btn" + row;	
	var btn = document.getElementById(id);
	
	if(!btn)
		return null;
		
	return btn.disabled;
}
DME.prototype.isRowChecked=function(row)
{
	row = (typeof(row) != "undefined" ? row : this.currentRow);
	
	if(isNaN(row))
		return null;

	var id = this.id + "_chk" + row;	
	var elem = document.getElementById(id);
	
	if(!elem)
		return null;
		
	return elem.checked;
}
function dmeCheckBoxClick(e)
{
	var chkBox=e?e.currentTarget:window.event.srcElement
	var index = chkBox.id.indexOf("chk")
	if(index == -1)return;
	if(typeof(chkBox.container) == "undefined") return;
	var row = chkBox.id.substr(index+3);

	try {
		if(typeof(window[chkBox.container+"_OnClickCheckBox"])=="function")
			eval(chkBox.container+"_OnClickCheckBox('"+chkBox.container+"',"+row+","+chkBox.checked+")");
	} catch (e) { }

	var objDme = page.objects[chkBox.container];
}

DME.prototype.clearAllCheckBoxes=function()
{
	if(this.fieldProps.addtorow == "button" || this.fieldProps.addtorow == "none")return;
	var oTable = document.getElementById("dmeTable_"+this.id)
	var i = 1;
	var len = oTable.rows.length;
	var objRow, objCell;
	for(;i<len;i++)
	{
		objRow = oTable.rows[i];
		objCell = objRow.cells[0];
		if(objCell.childNodes[0].id.indexOf("chk") > 0)
			objCell.childNodes[0].checked = false;
	}
}

//---------------------------------------------------------------------------------------------------
function dmeButtonClick(e)
{
	// first, set this row as the active row
	dmeRowClick(e);

	// fire off the click event
	var btn=e?e.currentTarget:window.event.srcElement
	var index = btn.id.indexOf("btn")
	if(index == -1)return;
	if(typeof(btn.container) == "undefined") return;
	var row = btn.id.substr(index+3);

	try {
		if(typeof(window[btn.container+"_OnClickButton"])=="function")
			eval(btn.container+"_OnClickButton('"+btn.container+"',"+row+")");
	} catch (e) { }
}

//---------------------------------------------------------------------------------------------------
function dmePreviousNext(e)
{
	e = e?e.currentTarget:window.event.srcElement
	if (typeof(e.container) == "undefined") return
	var objDme = page.objects[e.container]
	if(!objDme)return;
	objDme.currentRow = -1;

	if(e.prevNext == "PREVCALL" && objDme.currentPage > 1)
	{
		objDme.currentPage--;
		objDme.clearTableRows();
		if(objDme.single)
			objDme.dmeWriteSingle();
		else
		{
			objDme.dmeWriteHtm1();
			objDme.dmeWriteHtm2();
		}
	}
	else if(e.prevNext == "NEXTCALL" && objDme.currentPage < objDme.noOfPages)
	{
		objDme.currentPage++;
		objDme.clearTableRows();
		if(objDme.single)
			objDme.dmeWriteSingle();
		else
		{
			objDme.dmeWriteHtm1();
			objDme.dmeWriteHtm2();
		}
	}
	else
	{
		var strPrev=""
		var objPrev = objDme.objDmeResult.getElementsByTagName(e.prevNext)[0]
		for(var x=0; x<objPrev.childNodes.length; x++)
		{
			if(objPrev.childNodes[x].nodeType == 4)
			{
				strPrev = objPrev.childNodes[x].nodeValue
				break;
			}
		}
		objDme.dmePrevNext(strPrev)
	}
}

//---------------------------------------------------------------------------------------------------
DME.prototype.dmePrevNext=function(strBegin)
{
	var pStorage;

	var c = strBegin.charAt(strBegin.length-1);
	if(c=="&")strBegin = strBegin.substr(0, strBegin.length-1)
	this.begin = strBegin
	this.forceRefresh = true
	pStorage=page.getObjectValues(this.id)
	this.refresh(pStorage)
	this.begin = ""
}

//---------------------------------------------------------------------------------------------------
DME.prototype.dmeSort=function(strSort)
{
	var pStorage;

	this.sort = strSort
	this.forceRefresh = true
	pStorage=page.getObjectValues(this.id)
	this.refresh(pStorage)
	this.lastSort = strSort // For change in sort direction
	this.sort = ""
}

//---------------------------------------------------------------------------------------------------
DME.prototype.dmeDrill=function(strRecKey, fldName, row, col)
{
	var node = this.objDmeResult.getElementsByTagName("IDABASE")[0]
	var colNode, recordNode, relDrillNode, idaCallNode;
	var idaString=""
	for(var x=0; x<node.childNodes.length; x++)
	{
		if (node.childNodes[x].nodeType == 4)
		{
			idaString = node.childNodes[x].nodeValue
			break;
		}
	}
	var idaCall = node.getAttribute("executable")+"?"+idaString
	if(strRecKey != "")
	{
		idaCall += strRecKey
	}
	else
	{
		recordNode = this.objDmeResult.getElementsByTagName("RECORD")[row];
		colNode = recordNode.getElementsByTagName("COL")[col];
		relDrillNode = colNode.getElementsByTagName("RELDRILL")[0];
		if(relDrillNode)
		{
			for(x=0; x<relDrillNode.childNodes.length; x++)
			{
				if (relDrillNode.childNodes[x].nodeType == 4)
				{
					idaCall = relDrillNode.childNodes[x].nodeValue;
					break;
				}
			}
		}
		else
		{
			idaCallNode = recordNode.getElementsByTagName("IDACALL")[0];
			for(x=0; x<idaCallNode.childNodes.length; x++)
			{
				if (idaCallNode.childNodes[x].nodeType == 4)
				{
					strRecKey = idaCallNode.childNodes[x].nodeValue;
					break;
				}
			}
			idaCall += strRecKey;
		}
	}

	try {
		if(typeof(window[this.id+"_OnOpenDrill"]) == "function")
			idaCall = eval(this.id+"_OnOpenDrill("+row+", '"+fldName+"', '"+idaCall+"')");
	} catch (e) { }

	//page.manageLeftBar(false) - PT 180735 no need to manage left bar this is just a drill-around.
	//portalObj.tabArea.tabs["PAGE"].clearNavlets()	
	portalObj.drill.doDrill(window, "dmeDrillRet", idaCall)
}

//---------------------------------------------------------------------------------------------------
function dmeDrillRet(retVal)
{
	if (retVal)
	{
		restoreNavlets();
		page.manageLeftBar(true)
	}
}
//---------------------------------------------------------------------------------------------------
DME.prototype.dmeOpenForm=function(row)
{
	try {
		if(typeof(window[this.id+"_OnOpenForm"]) == "function")
			eval(this.id+"_OnOpenForm("+row+")");
	} catch (e) { }

	switch(this.navigateOption)
	{
		case "win":
		{
			var objFrame = document.getElementById(this.id+"_form")
			if(objFrame)
			{
				document.body.style.visibility = "hidden"
				page.manageLeftBar(false)
				portalWnd.formTransfer(this.tkn,this.prod,objFrame,this.hk,null,"page");
				objFrame.style.visibility = "visible"
			}
			break;
		}
		case "ptr":
		{
			page.setElementValue(this.id+"URL","lawform&_PDL="+this.prod+"&_TKN="+this.tkn);
			page.transaction.transact();
			page.dataSource[this.id+"URL"]="";
			break;
		}
		default:
		{
			portalWnd.formTransfer(this.tkn,this.prod,null,this.hk,null,"portal");
			break;
		}
	}
}

//---------------------------------------------------------------------------------------------------
function portalpgCloseForm()
{
	portalObj.toolbar.clear()

	var obj = page.objects[page.currentObjId];
	var objFrame =null;
	if (obj.type.toLowerCase() == "dme")
		objFrame = document.getElementById(page.currentObjId+"_form");
	else
		objFrame = document.getElementById("MENU_form");
	if(objFrame)
	{
		objFrame.src = portalObj.path + "/blank.htm";
		objFrame.style.visibility = "hidden"
		document.body.style.visibility = "visible"
	}
	restoreNavlets();	
	page.manageLeftBar(true)
}

//---------------------------------------------------------------------------------------------------
//// This is the function that formwindow calls on load.
function initializeFramework()
{
	if (page.currentObjId == "")
	{
		// KLUDGE - In ns, the currentObjId does not get set for IFRAMES
		// restore the navlets anyway - PT121729
		// vlm: the kludge was in fact a... 
		// use the existing portal object variable - PT 128939
		if (!portalObj.browser.isIE)
			restoreNavlets();
		return;
	}
	var obj = page.objects[page.currentObjId];
	if(!obj)return;
	if((obj.type.toLowerCase() == "dme" || obj.type.toLowerCase() == "menu" || obj.type.toLowerCase() == "transfer")
			&& obj.navigateOption == "win")
	{
		portalObj.toolbar.clear()
		portalObj.toolbar.target = window
		portalObj.toolbar.createButton("Close", portalpgCloseForm, "portalpgCloseForm", "enabled", "LBL_CLOSE")
	}
	else
	{
		page.manageLeftBar(true)
	}
}

function restoreNavlets()
{
	// Restore the navlets in the parent pages
	var par = window;
	while (par)
	{
		if (typeof(par.initializeFramework) == "function")
		{
			par.initializeFramework();
			break;
		}
			
		par = (typeof(par.parent) != "undefined" && par.parent != par.self)
					? par.parent : null;
	}
	// Restore the navlets in this page
	var obj;
	for(obj in page.objects)
	{
		obj=page.objects[obj];
		if (obj.type.toLowerCase() == "menu" || obj.type.toLowerCase() == "transfer" || obj.type.toLowerCase() == "user")
		{
			if("refresh" in obj)
				obj.refresh();
			else
				obj.render();
		}
	}
}

//---------------------------------------------------------------------------------------------------
DME.prototype.dmeDrawGraphVML=function()
{
	// This is IE specific routine
	if (this.objDmeResult.status)
	{
		var msg=portalObj.getPhrase("ERROR_LOAD_XML");
		msg+="\n"+portalWnd.getHttpStatusMsg(this.objDmeResult.status);
		portalWnd.cmnDlg.messageBox(msg,"ok","alert",window);
		return;
	}
	var msgNode = this.objDmeResult.getElementsByTagName("MESSAGE");
	if (msgNode && msgNode.length)
	{
		msgNode = msgNode[0];
		var status = msgNode.getAttribute("status");
		if (status != "0")
		{
			var msg = msgNode.firstChild.nodeValue;
			if (msg.length > 0)
				portalWnd.cmnDlg.messageBox(msgNode.firstChild.nodeValue,"ok","alert",window);
			return;
		}
	}
	var catNode = this.objDmeResult.getElementsByTagName("category")
	catNode[0].firstChild.nodeValue = this.fields[0].heading
	var datasets = this.objDmeResult.getElementsByTagName("dataset")
	for (var i=1; i <= datasets.length; i++)
	{
		datasets[i-1].setAttribute("name", this.fields[i].heading)
	}

    var path = portalObj.path + "/pages/" + this.xsl;
    var oGraphXsl = portalWnd.objFactory.createInstance("DOM");
    oGraphXsl.async = false;
    oGraphXsl.load(path);

    if (oGraphXsl.parseError.errorCode != 0)
    {
        portalWnd.oError.displayDOMParseError(oGraphXsl.parseError, portalObj.path + "/pages/" + this.xsl);
        return;
    }

	var strHtml = this.objDmeResult.transformNode(oGraphXsl)
	var contentDiv = document.getElementById("contentDiv_" + this.id)
	contentDiv.innerHTML = strHtml

	initGraph(this.objDmeResult)
	resizeGraph();
}

//---------------------------------------------------------------------------------------------------
DME.prototype.dmeDrawNSGraph=function()
{
	var contentDiv = document.getElementById("contentDiv_" + this.id)
	newElm=document.createElement("IFRAME");
	newElm.id="nsGraph_"+this.id;
	newElm.src = "../blank.htm";
	newElm.style.borderWidth="0px";
	newElm.frameBorder="no";
	contentDiv.appendChild(newElm)
	newElm.style.position="absolute";
	newElm.style.top="0px";
	newElm.style.left="0px";
	newElm.style.height="100%";
	newElm.style.width="100%";
	newElm.src = portalObj.path + "/pages/graph/nsgraph.htm?" + this.id
	return;
}
//---------------------------------------------------------------------------------------------------
function dmeField(strDbName, strHeading, strRtSort, strDrill, strHide, strAlign, strHdrAlign, strWrap, strHdrWrap, strTooltip, strHdrTooltip, strOccurs)
{
	this.name = strDbName
	this.heading = strHeading
	this.sort = strRtSort
	this.drill = strDrill
	this.hide = strHide
	this.align = strAlign
	this.hdralign = chkValue(strHdrAlign, "2");
	this.wrap = (chkValue(strWrap, "y")=="y")?false:true;
	this.hdrwrap = (chkValue(strHdrWrap, "y")=="y")?false:true;
	this.tooltip = chkValue(strTooltip, "");
	this.hdrtooltip = chkValue(strHdrTooltip, "");
	this.occurs = parseInt(chkValue(strOccurs, "1"));
	this.form = "n"
}

//---------------------------------------------------------------------------------------------------
function dmeKey(strKeyName, strKeyVal, strKeyLbl, strReadOnly, strUpdOnChg, strHide, strType)
{
	this.name = strKeyName
	this.value = strKeyVal
	this.valueRt = strKeyVal
	this.label = strKeyLbl
	this.readOnly = (strReadOnly=="y")?true:false;
	this.updOnChg = strUpdOnChg
	this.hide = (strHide=="y")?true:false;
	this.type = strType
	this.setData=false
}

//---------------------------------------------------------------------------------------------------

//*****IDA Nugglet
function IDA(DOMNode)
{
	if(typeof(DOMNode) == "undefined" || !DOMNode)
	{
		var strXML =  '<IDA id="" col="" row="" height="" width="" border="0" scroll="1" windowoption="ptr" ahide="0" qry="" link="explorer" recstoget="50" pdloverride="" pdl="" sys="" tkn="" drill="" src="" tp="IDA" nm="IDA Query" par="" doc="" dseq="" interval="0" host=""><KEYS></KEYS></IDA>'
		DOMNode = stringToXMLObj(strXML);
		if(DOMNode)DOMNode = DOMNode.documentElement;
		else return;
	}
	this.id = DOMNode.getAttribute("id")
	this.left = DOMNode.getAttribute("col");
	this.top = DOMNode.getAttribute("row");
	this.height = DOMNode.getAttribute("height");
	this.width = DOMNode.getAttribute("width");
	this.type=DOMNode.getAttribute("tp");
	this.rendered = false;
	this.isNugglet = true;

	this.title = DOMNode.getAttribute("TITLE");
	this.border = (DOMNode.getAttribute("border")=="1")?true:false;
	this.scroll = (chkValue(DOMNode.getAttribute("scroll"), "1") == "1")?true:false;
	this.zIndex = chkValue(DOMNode.getAttribute("zindex"), "1");
	this.autoHide = (DOMNode.getAttribute("ahide")=="1")?true:false;
	this.navigateOption = DOMNode.getAttribute("windowoption");
	this.interval = DOMNode.getAttribute("interval");

	this.baseCall=DOMNode.getAttribute("qry");
	var strProd = portalWnd.oUserProfile.getAttribute("productline")
	if(DOMNode.getAttribute("pdloverride") == "y" && strProd != DOMNode.getAttribute("pdl"))
	{
		var ind1 = this.baseCall.indexOf("_PDL=")
		var str1 = this.baseCall.substring(0,ind1+5)
		var str2 = this.baseCall.substr(ind1)
		var ind2 = str2.indexOf("&")
		var str3 = str2.substr(ind2)
		this.baseCall = str1 + strProd + str3
	}
	this.idaCall = this.baseCall;
	this.maxRecords = DOMNode.getAttribute("recstoget")
	this.mode = DOMNode.getAttribute("link")	// This should determine select/explore mode

	var keyNodes = DOMNode.getElementsByTagName("KEY")
	this.keys = new Array()
	for(var i=0; i < keyNodes.length; i++)
	{
		var objKey = new Object()
		objKey.key = keyNodes[i].getAttribute("keynum")
		objKey.name = keyNodes[i].getAttribute("name")
		objKey.refresh = keyNodes[i].getAttribute("refresh")
		objKey.value = keyNodes[i].firstChild?keyNodes[i].firstChild.nodeValue:"";
		if(objKey.value.substr(0,11) == "LAW_WEB_USR")
			objKey.value=portalWnd.oUserProfile.getAttribute(objKey.value.substr(objKey.value.indexOf(".")+1))
		this.keys[i]=objKey
	}
}

IDA.prototype.render=function()
{
	var newElm;

	if(this.rendered)
		newElm=document.getElementById(this.id);
	else
	{
		newElm=document.createElement("IFRAME");
		newElm.id=this.id;
		newElm.src = "../blank.htm";
		newElm.name=this.id;
		newElm.style.position="absolute";
		newElm.style.top=this.top+"px";
		newElm.style.left=this.left+"px";
		newElm.style.height=this.height+"px";
		newElm.style.width=this.width+"px";
		newElm.scrolling=(this.scroll)?"auto":"no";
		newElm.style.zIndex = this.zIndex;
		newElm.type=this.type;
		if(portalObj.browser.isIE)
			newElm.onactivate = page.setCurrentObj;
		else
			newElm.onclick = page.setCurrentObj;

		document.body.appendChild(newElm);
		page.eventSink(this.id, "OnInit")
	}
	if(!this.border)
		newElm.style.borderWidth="0px";
	if(this.autoHide)
		newElm.style.visibility="hidden";
	else
		newElm.style.visibility="visible";

	page.eventSink(this.id, "OnLoadBegin")
	newElm.src="../drill/drill.htm?parent.idaInitDrill(window, \""+ this.id + "\")";
	this.rendered=true;
}

IDA.prototype.setzIndex=function(zIndex)
{
	var elem = document.getElementById(this.id);
	if(elem)
	{
		this.zIndex = zIndex;
		elem.style.zIndex = this.zIndex;
	}
}

IDA.prototype.refresh=function(pStorage)
{
	this.idaBuildCall(pStorage)
	if (this.rendered)
	{
		var objFrame = document.getElementById(this.id)
		if(this.autoHide)
		{
			this.autoHide = false;
			objFrame.style.visibility = (page.state.maximized)?"hidden":"visible";
		}
		var drillWin = objFrame.contentWindow
		drillWin.drlDrillObj.idaCall = this.idaCall
		drillWin.drlDrillObj.execute()
	}
	else
		this.render()
	page.eventSink(this.id, "OnLoadComplete")
}

IDA.prototype.idaBuildCall=function(pStorage)
{
	var strAPI = this.baseCall
	if(this.maxRecords != 50)strAPI += "&_RECSTOGET=" + this.maxRecords
	var strVal=""
	for (var i=0; i<this.keys.length; i++)
	{
		if(this.keys[i].refresh == "y" && typeof(pStorage) != "undefined")
		{
			strVal = pStorage[this.keys[i].name]
			if (typeof(strVal) == "undefined" || !strVal)strVal = ""
		}
		else if(this.keys[i].value != "")
		{
			strVal = this.keys[i].value;
		}
		var ndx1, len1, str;
		str = "&"+this.keys[i].key+"=";
		len1 = str.length;
		ndx1 = strAPI.indexOf(str);
		if(ndx1 != -1)
		{
			var str1, str2, ndx2;
			str1 = strAPI.substr(0, ndx1+len1);
			str1+=strVal;
			str2 = strAPI.substr(ndx1+len1);
			ndx2 = str2.indexOf("&");
			str2 = str2.substr(ndx2);
			strAPI = str1 + str2;
		}
		else
			strAPI += "&" + this.keys[i].key + "=" + strVal;
	}
	this.idaCall = strAPI
}

function idaInitDrill(drillWin, nugId)
{
	var objIda = page.objects[nugId]
	if(typeof(drillWin.drlDrillObj) != "undefined")
	{
		drillWin.drlDrillObj.mode = objIda.mode
		drillWin.drlDrillObj.idaCall = objIda.idaCall
		drillWin.drlDrillObj.formTitle = page.title
		drillWin.drlDrillObj.nbrRecords = objIda.maxRecords
		drillWin.drlDrillObj.isNugglet = true
		drillWin.drlDrillObj.id = nugId
		drillWin.drlDrillObj.execute()
	}
}
//---------------------------------------------------------------------------------------------------

//***AGS Nugglet
function AGS(DOMNode)
{
	if(typeof(DOMNode) == "undefined" || !DOMNode)
	{
		var strXML =  '<AGS id="" TITLE="" col="" row="" height="" width="" border="0" scroll="1" ahide="0" qry="" pdl="" pdloverride="" sys="" token="" xsl="agstable.xsl" maxrows="1" nonstdda="n" fc="I" paging="" tp="AGS" nm="AGS Query" par="" doc="" dseq="" interval="0" host="" windowoption="RTR">'
		strXML += '<INPFIELDS></INPFIELDS><FIELDS></FIELDS></AGS>';
		DOMNode = stringToXMLObj(strXML);
		if(DOMNode)DOMNode = DOMNode.documentElement;
		else return;
	}
	this.id = DOMNode.getAttribute("id")
	this.left = DOMNode.getAttribute("col");
	this.top = DOMNode.getAttribute("row");
	this.height = DOMNode.getAttribute("height");
	this.width = DOMNode.getAttribute("width");
	this.type=DOMNode.getAttribute("tp");
	this.rendered = false;

	this.title = DOMNode.getAttribute("TITLE");
	this.border = (DOMNode.getAttribute("border")=="1")?true:false;
	this.scroll = (chkValue(DOMNode.getAttribute("scroll"), "1") == "1")?true:false;
	this.zIndex = chkValue(DOMNode.getAttribute("zindex"), "1");
	this.autoHide = (DOMNode.getAttribute("ahide")=="1")?true:false;
	this.navigateOption = DOMNode.getAttribute("windowoption");
	this.interval = DOMNode.getAttribute("interval");

	this.pdl = DOMNode.getAttribute("pdl")
	if(DOMNode.getAttribute("pdloverride") == "y")this.pdl = portalWnd.oUserProfile.getAttribute("productline")
	this.tkn = DOMNode.getAttribute("token")
	this.xsl = DOMNode.getAttribute("xsl")
	this.graph = (this.xsl == "agstable.xsl")?false:true;

	this.maxrows = parseInt(chkValue(DOMNode.getAttribute("maxrows"), "1"));
	this.fc = chkValue(DOMNode.getAttribute("fc"), "I");
	this.nonstdda =( chkValue(DOMNode.getAttribute("nonstdda") ,"") == "y")?true:false;
	this.paging = (chkValue(DOMNode.getAttribute("paging"), "n") == "y")?true:false;

	this.fields = new Array()
	var flds = (this.graph)?DOMNode.getElementsByTagName("FIELD"):DOMNode.getElementsByTagName("INPFIELD");
	var i, len;
	len = flds.length;
	for (i=0; i<len; i++)
	{
		this.fields[i] = new Object()
		this.fields[i].name = flds[i].getAttribute("name")
		this.fields[i].value = (flds[i].firstChild)?flds[i].firstChild.nodeValue:"";
		if(this.fields[i].value.substr(0,11) == "LAW_WEB_USR")
			this.fields[i].value=portalWnd.oUserProfile.getAttribute(this.fields[i].value.substr(this.fields[i].value.indexOf(".")+1))
		this.fields[i].refresh = chkValue(flds[i].getAttribute("refresh"), "y");
	}

	if(this.graph)
	{
		var node= DOMNode.getElementsByTagName("CHARTTITLE")[0].firstChild
		if(node)this.charttitle = node.nodeValue
		else this.charttitle = ""
		node= DOMNode.getElementsByTagName("CATEGORYTITLE")[0].firstChild
		if(node)this.cattitle = node.nodeValue
		else this.cattitle = ""
		node= DOMNode.getElementsByTagName("VALUETITLE")[0].firstChild
		if(node)this.valtitle = node.nodeValue
		else this.valtitle = ""

		var dpNodes = DOMNode.getElementsByTagName("DP")
		var lblNodes = DOMNode.getElementsByTagName("LABEL")
		var valNodes = DOMNode.getElementsByTagName("VALUE")
		this.graphparams = new Array()
		len = dpNodes.length;
		for (i=0; i<len; i++)
		{
			this.graphparams[i] = new Object()
			this.graphparams[i].det = dpNodes[i].getAttribute("det")
			this.graphparams[i].height = dpNodes[i].getAttribute("height")
			this.graphparams[i].label = lblNodes[i].getAttribute("val")
			this.graphparams[i].value = valNodes[i].getAttribute("val")
		}
	}
	else
	{
		this.tblFields = new Array();
		var tblNodes = DOMNode.getElementsByTagName("FIELD");
		len = tblNodes.length;
		for(i=0; i<len; i++)
		{
			this.tblFields[i] = new Object();
			this.tblFields[i].id = tblNodes[i].getAttribute("id");
			this.tblFields[i].name = tblNodes[i].getAttribute("name");
			this.tblFields[i].heading = tblNodes[i].getAttribute("heading");
			this.tblFields[i].type = tblNodes[i].getAttribute("type");
			this.tblFields[i].sort = tblNodes[i].getAttribute("sort");
			this.tblFields[i].drill = tblNodes[i].getAttribute("drill");
			this.tblFields[i].align = tblNodes[i].getAttribute("align");
			this.tblFields[i].hide = tblNodes[i].getAttribute("hide");
		}
	}

	this.api=""
	this.agsXML=null;
	this.agsGraphXML=null;
	this.agsTableXML=null;
	this.error = false;
	this.sortFld="";
	this.sortType="";
	this.sortDir="+";
	this.currentRow = -1;
}

AGS.prototype.render=function()
{
	if (!this.rendered)
	{
		var agsFrame = document.createElement("DIV")
		agsFrame.className = "AGSObject"
		agsFrame.id = this.id
		agsFrame.style.position = "absolute"
		agsFrame.style.left = this.left+"px"
		agsFrame.style.top = this.top+"px"
		agsFrame.style.height = this.height+"px"
		agsFrame.style.width = this.width+"px"
		agsFrame.style.overflow = (this.scroll)?"auto":"hidden";
		agsFrame.style.zIndex = this.zIndex;
		agsFrame.onclick = page.setCurrentObj;
		agsFrame.type=this.type;
		if (!this.border)
			agsFrame.style.borderWidth = "0px"
		agsFrame.style.visibility = (this.autoHide)?"hidden":"visible"
		document.body.appendChild(agsFrame)
		page.eventSink(this.id, "OnInit")

		page.eventSink(this.id, "OnBeforeLoad")
		this.agsBuildApi();
		var bRet = this.agsExecute();
		if(bRet)
			this.agsDrawHtml();
		this.rendered = true
	}
}

AGS.prototype.setzIndex=function(zIndex)
{
	var elem = document.getElementById(this.id);
	if(elem)
	{
		this.zIndex = zIndex;
		elem.style.zIndex = this.zIndex;
	}
}

AGS.prototype.refresh=function(pStorage)
{
	if(this.rendered)
	{
		page.eventSink(this.id, "OnBeforeLoad")
		this.autoHide = false;
		document.getElementById(this.id).style.visibility = (page.state.maximized)?"hidden":"visible";
		this.agsBuildApi(pStorage)
		var bRet = this.agsExecute();
		if(bRet)
			this.agsDrawHtml();
	}
	else
	{
		this.render()
	}
}

AGS.prototype.agsBuildApi=function(pStorage)
{
	this.api = "_PDL="+this.pdl+"&_TKN="+this.tkn
	this.api += "&_LFN=TRUE&_EVT=ADD&_RTN=DATA&_TDS=IGNORE&_OUT=XML&_EOT=TRUE&FC="
	this.api += (this.fc != "")?this.fc:"I";
	var strValue =""
	for(var i=0; i<this.fields.length; i++)
	{
		if(this.fields[i].refresh == "n")continue;
		if(typeof(pStorage) != "undefined")
		{
			strValue = pStorage[this.fields[i].name]
			if(!strValue || typeof(strValue) == "undefined")strValue=""
		}
		if(strValue == "")strValue = this.fields[i].value
		this.api+="&"+this.fields[i].name+"="+strValue
		strValue=""
	}
}

AGS.prototype.agsExecute=function()
{
	this.agsXML = portalWnd.httpRequest(portalWnd.AGSPath+"?"+this.api)
	if (!this.agsXML || this.agsXML.status)
	{
		var msg=portalObj.getPhrase("FORM_DATA_ERROR")
		if (this.agsXML)
			msg+="\n"+portalWnd.getHttpStatusMsg(this.agsXML.status);
		portalWnd.cmnDlg.messageBox(msg,"ok","alert",window);
		return false;
	}
	var msg = this.agsXML.getElementsByTagName("MsgNbr")
	if (msg.length > 0)
		msg = msg[0].firstChild.nodeValue
	if (msg != "000")
	{
		msg = this.agsXML.getElementsByTagName("Message")[0].firstChild.nodeValue
		var agsDiv = document.getElementById(this.id)
		var oSpan = document.createElement("SPAN")
		oSpan.appendChild(document.createTextNode(msg))
		oSpan.className = "Message"
		oSpan.style.fontWeight = "normal"
		agsDiv.appendChild(oSpan)
		return false;
	}
	page.eventSink(this.id, "OnLoadComplete")
	return true;
}

AGS.prototype.agsDrawHtml=function()
{
	if(this.graph)
		this.agsTransformXmlGraph();
	else
	{
		this.agsTransformXmlTable();
		if(!this.rendered)this.agsTableHtml1();
		this.agsTableHtml2();
	}
}

AGS.prototype.agsTransformXmlGraph=function()
{
	var sGraphXml = "<xmlgraph>\n";
	var sLabels = "";
	var sDataset = "";
	var dp;
	var sLabel = "";
	var sValue = "";
	var name = "";
	var sChartTitle = this.agsGetNodeValue(this.charttitle);
	var sCategoryTitle = this.agsGetNodeValue(this.cattitle);
	var sValueTitle = this.agsGetNodeValue(this.valtitle);
	sGraphXml += "<category>" + sCategoryTitle + "</category>\n";
	sGraphXml += "<value>" + sValueTitle + "</value>\n";
	sDataset += '<dataset id="0" name="' + sChartTitle + '">\n'

	for( var i = 0; i < this.graphparams.length; i++ )
	{
		sLabel = this.graphparams[i].label
		sValue = this.graphparams[i].value
		if(this.graphparams[i].det != "" )
		{
			// process the detail area
			height = this.graphparams[i].height;
			var valueField = sValue;
			var labelField = sLabel;
			for( var j = 1; j <= height; j++ )
			{
				sValue = this.agsGetValue(valueField, j );
				sLabel = this.agsGetValue(labelField, j ) + '-' + j;
				if( sValue != "" )
				{
					sLabels += '<label value="' + sLabel + '"/>\n';
					sDataset += '   <dp label="' + sLabel + '" value="' + sValue + '"/>\n';
				}
			}
		}
		else {
			sValue = this.agsGetValue(sValue );
			sLabel = this.agsGetValue(sLabel );
			sLabels += '<label value="' + sLabel + '"/>\n';
			sDataset += '   <dp label="' + sLabel + '" value="' + sValue + '"/>\n';
		}
	}
	sDataset += '</dataset>\n';
	sGraphXml += sLabels;
	sGraphXml += sDataset;
	sGraphXml += '</xmlgraph>\n';
	sGraphXml = sGraphXml.replace( /&/, "&amp;" );

	this.agsGraphXML= stringToXMLObj(sGraphXml);
	if(portalObj.browser.isIE)
		this.agsRenderGraphIE()
	else
		this.agsRenderGraphNS()
}

AGS.prototype.agsGetValue=function(sCurValue, detailRow ) {
	var sValue = sCurValue;
	var ptr1 = sCurValue.indexOf( "[{" );
	var ptr2 = sCurValue.indexOf( "}]" );
	if( ( ptr1 != -1 ) && ( ptr2 != -1 ) ) {
		var sField = sCurValue.substring( ptr1 + 2, ptr2 );
		// field may be in format _f34/OPEN-AMOUNT-1
		if( sField.indexOf( "/" ) != -1 ) {
			sField = sField.substring( sField.indexOf( "/" ) + 1, sField.length );
		}
		sValue = sCurValue.substring( 0, ptr1 );
		if( detailRow > 0 )
			sField = sField + "r" + detailRow;
		var agsVal = (this.agsXML.getElementsByTagName(sField)[0].firstChild)?this.agsXML.getElementsByTagName(sField)[0].firstChild.nodeValue:"";
		sValue += this.agsProcessValue(agsVal);
		sValue += this.agsGetValue(sCurValue.substring( ptr2 + 2, sCurValue.length), detailRow);
	}
	return sValue;
}

AGS.prototype.agsGetNodeValue=function(sVal)
{
	// get the value of a node - if prefixed with 'fld_', get the value from the ags form
	var ptr = sVal.indexOf( "fld_" );
	if( ptr != -1 )
	{
		// field may be in format _f34/OPEN-AMT1
		if( sVal.indexOf( "/" ) != -1 )
			sVal = sVal.substring( sVal.indexOf( "/" ) + 1, sVal.length );
		else
			sVal = sVal.substring( 4, sVal.length );
		var agsVal = this.agsXML.getElementsByTagName(sVal)
		if(agsVal.length>0)
		{
			agsVal = agsVal[0].firstChild
			if(agsVal)agsVal = agsVal.nodeValue
			else agsVal=""
			sVal = agsVal
		}
		else
		{
			this.error = true;
			sVal = "[{"+sVal.substring( 4, sVal.length )+"}]";
		}
	}
	return sVal;
}

AGS.prototype.agsProcessValue=function(sValue) {
	// check for a postfix negative value
	var len = sValue.length;
	if( sValue.substr( len - 1, 1 ) == "-" ) {
		sValue = "-" + sValue.substring( 0, len - 2 );
	}
	return sValue;
}

AGS.prototype.agsRenderGraphIE=function()
{
    var path = portalObj.path + "/pages/" + this.xsl;
    var oGraphXsl = portalWnd.objFactory.createInstance("DOM");
    oGraphXsl.async = false;
    oGraphXsl.load(path);

    if (oGraphXsl.parseError.errorCode != 0)
    {
        portalWnd.oError.displayDOMParseError(oGraphXsl.parseError, portalObj.path + "/pages/" + this.xsl);
        return;
    }

	var strHtml = this.agsGraphXML.transformNode(oGraphXsl)
	var contentDiv = document.getElementById(this.id)
	contentDiv.innerHTML = strHtml

	initGraph(this.agsGraphXML)
	resizeGraph();
}

AGS.prototype.agsRenderGraphNS=function()
{
	var contentDiv = document.getElementById(this.id)
	newElm=document.createElement("IFRAME");
	newElm.id="nsGraph_"+this.id;
	newElm.src = "../blank.htm";
	newElm.style.borderWidth="0px";
	newElm.frameBorder="no";
	contentDiv.appendChild(newElm)
	newElm.style.position="absolute";
	newElm.style.top="0px";
	newElm.style.left="0px";
	newElm.style.height="100%";
	newElm.style.width="100%";
	newElm.src = portalObj.path + "/pages/graph/nsgraph.htm?" + this.id
	return;
}

AGS.prototype.agsTransformXmlTable=function()
{
	var strXml = "";
	strXml += "<TABLE>";
	strXml += "<ROWS>";
	for (var i=0; i<this.maxrows; i++)
	{
		strXml += "<ROW>"
		var len = this.tblFields.length;
		for (var j=0; j<len; j++)
		{
			strXml += "<FIELD nm=\"" + this.tblFields[j].name + "\">"
			strXml += "</FIELD>"
		}
		strXml += "</ROW>"
	}
	strXml += "</ROWS>";
	strXml += "</TABLE>";
	this.agsTableXML = stringToXMLObj(strXml)

	this.agsFillData(0, 0, this.maxrows);
}

AGS.prototype.agsFillData=function(nAgsRow, nTblStartRowNo, nTableRows)
{
	nAgsRow = parseInt(nAgsRow);
	nTblStartRowNo = parseInt(nTblStartRowNo);
	nTableRows = parseInt(nTableRows);

	var i, j, len, len2;
	len = nTblStartRowNo + nTableRows;
	len2 = this.tblFields.length;
	var fldNode, agsNode, fldName, value;
	var rows = this.agsTableXML.getElementsByTagName("ROW");
	for(i=nTblStartRowNo; i<len; i++)
	{
		for(j=0; j<len2; j++)
		{
			value = "";
			fldNode = rows[i].childNodes[j];
			fldName = fldNode.getAttribute("nm");
			if(this.nonstdda)
				fldName += nAgsRow;
			else
				fldName += "r" + nAgsRow;
			agsNode = this.agsXML.getElementsByTagName(fldName);
			if(!agsNode.length)
			{
				fldName = fldNode.getAttribute("nm");
				agsNode = this.agsXML.getElementsByTagName(fldName);
			}
			if(agsNode.length)
			{
				agsNode = agsNode[0];
				if(agsNode)
				{
					value = (agsNode.firstChild ? agsNode.firstChild.nodeValue : "");
				}
			}
			fldNode.appendChild(this.agsTableXML.createTextNode(value));
		}
		nAgsRow++;
	}
}

AGS.prototype.agsTableHtml1=function()
{
	var agsFrame = document.getElementById(this.id);
	var objTitDiv = document.createElement("DIV")
	var ht1 = (this.title != "")?"40px":"20px";
	var tp2 = (this.title != "")?"50px":"30px";
	var ht2 = (this.title != "")?"75%":"80%";
	this.agsSetStyle(objTitDiv, "titleDiv_"+this.id, false, "0%", "0%", ht1, "100%")
	objTitDiv.style.borderBottom = "1px solid black"
	agsFrame.appendChild(objTitDiv)

	var agsTitle = document.createElement("TABLE")
	agsTitle.style.width = "100%"
	agsTitle.id = "agsTitle_"+this.id
	agsTitle.border = "0px";
	agsTitle.cellPadding = "0px";
	agsTitle.cellSpacing = "0px";
	objTitDiv.appendChild(agsTitle)

	var objRow, cell0, cell1;
	if(this.title != "")
	{
		objRow = agsTitle.insertRow(agsTitle.rows.length);
		objRow.height = "20px";
		objRow.className = "TitleBarFill";

		cell0 = objRow.insertCell(0);
		cell0.width = "89%";
		cell0.className = "TitleBar";
		cell0.align = "left";
		cell0.appendChild(document.createTextNode(this.title));

		cell1 = objRow.insertCell(1);
		cell1.width = "11%";
		cell1.align = "right"
		var image = document.createElement("IMG");
		cell1.appendChild(image);
		image.id = "Maxbtn_"+this.id;
		image.src = "../images/ico_maximize.gif";
		image.alt = page.phrases.getPhrase("maximize");
		image.container = this.id;
		image.onclick = nuggletMaximize;
	}

	objRow = agsTitle.insertRow(agsTitle.rows.length);
	objRow.height = "20px";

	cell0 = objRow.insertCell(0);
	cell0.width="90%"
	cell0.align = "right"
	var btnPrev = this.agsCreateButton("btnPrev_"+this.id, false, "Previous", "PREVIOUS", this.id)
	btnPrev.onclick = agsPreviousNext
	cell0.appendChild(btnPrev)

	cell1 = objRow.insertCell(1)
	cell1.width="10%"
	cell1.align = "center"
	var btnNext = this.agsCreateButton("btnNext_"+this.id, false, "Next", "NEXT", this.id)
	btnNext.onclick = agsPreviousNext
	cell1.appendChild(btnNext)

	var contentDiv = document.createElement("DIV")
	contentDiv.id = "contentDiv_"+this.id;
	contentDiv.style.left = "0%";
	contentDiv.style.top = tp2;
	contentDiv.style.height = ht2;
	contentDiv.style.width = "99.5%";
	contentDiv.style.overflow = "auto"
	agsFrame.appendChild(contentDiv)

	var agsTable = document.createElement("TABLE")
	agsTable.align = "center"
	agsTable.id = "agsTable_"+this.id
	contentDiv.appendChild(agsTable)

	var tbody0 = document.createElement("TBODY")
	tbody0.id = "tbody0_"+this.id
	agsTable.appendChild(tbody0)

	var oThead = agsTable.createTHead();
	var objRow = oThead.insertRow(0);
	var j = 0; var len=this.tblFields.length;
	for (var i=0; i < len; i++)
	{
		if (this.tblFields[i].hide == 'n')
		{
			var objCol = objRow.insertCell(j++);
			if(this.tblFields[i].align == "0")
				objCol.align = "left";
			else if(this.tblFields[i].align == "1")
				objCol.align = "right";
			else
				objCol.align = "center";
			if (this.tblFields[i].sort == 'y')
				oChild = this.agsCreateAnchor(this.tblFields[i].heading, true, "sort", 0, i, this.tblFields[i].name, "", this.id)
			else
				oChild = this.agsCreateSpan(this.tblFields[i].heading, true, false)
			objCol.appendChild(oChild)
		}
	}
	objRow = oThead.insertRow(1);
	var hr = document.createElement("HR");
	hr.size = "0";
	hr.noShade = true;
	var cell = objRow.insertCell(0);
	cell.colSpan = (j==0 ? 1:j); //In case user does not pick a field.
	cell.appendChild(hr);
}
AGS.prototype.agsTableHtml2=function()
{
	var oTbody = document.getElementById("tbody0_" + this.id)
	var i, len = oTbody.rows.length;
	for ( i=len-1; i>=0; i--)
		oTbody.deleteRow(i);
	var rows = this.agsTableXML.getElementsByTagName("ROW");
	len = rows.length;
	var j,k,len2 = this.tblFields.length;
	var row, col, fldNode, oChild;
	for(i=0; i<len; i++)
	{
		row = oTbody.insertRow(i);
		row.id = "agsrow_"+i;
		row.container=this.id;
		row.onclick = agsRowClick;
		k=0;
		for(j=0; j<len2; j++)
		{
			if(this.tblFields[j].hide == "n")
			{
				fldNode = rows[i].childNodes[j];
				col = row.insertCell(k++);
				if(this.tblFields[j].align == "0")
					col.align = "left";
				else if(this.tblFields[j].align == "1")
					col.align = "right";
				else
					col.align = "center";
				if(this.tblFields[j].drill == "y")
					oChild = this.agsCreateAnchor(fldNode.firstChild.nodeValue, false, "drill", i,(k-1), this.tblFields[j].name, "", this.id);
				else
					oChild = this.agsCreateSpan(fldNode.firstChild.nodeValue, false, false);
				col.appendChild(oChild)
			}
		}
	}
	row = oTbody.insertRow(i);
	var hr = document.createElement("HR");
	hr.size = "0";
	hr.noShade = true;
	col = row.insertCell(0);
	col.colSpan = (k == 0 ? 1:k);//In case user does not pick a field.
	col.appendChild(hr);
	page.eventSink(this.id, "onAgsTableRender");
}
//---------------------------------------------------------------------------------------------------
AGS.prototype.agsSetStyle=function(obj, id, bPosAbs, sleft, stop, sheight, swidth)
{
	if (!obj)return
	if(id != "")obj.id = id
	obj.style.position=bPosAbs ? "absolute": "relative";
	if(sleft != "")obj.style.left=sleft
	if(stop != "")obj.style.top=stop
	if(sheight != "")obj.style.height=sheight
	if(swidth != "")obj.style.width=swidth
}

//---------------------------------------------------------------------------------------------------
AGS.prototype.agsCreateSpan=function(strText, bBold, bCursor)
{
	var oSpan = document.createElement("SPAN")
	oSpan.className = "DMECol"
	oSpan.style.position = "relative"
	oSpan.style.paddingRight = "10px"
	if(bBold)oSpan.style.fontWeight = "bold"
	if(bCursor)oSpan.style.cursor = (portalObj.browser.isIE)?"hand":"pointer"
	var oText = document.createTextNode(strText)
	oSpan.appendChild(oText)
	return oSpan
}

//---------------------------------------------------------------------------------------------------
AGS.prototype.agsCreateAnchor=function(strText, bBold, strAction, nRow, nCol, fldName, strTooltip, strContainer)
{
	var oAnchor = this.agsCreateSpan(strText, bBold, true)
	oAnchor.style.textDecoration = "underline"

	oAnchor.action = strAction
	oAnchor.sort = "SORTASC"
	oAnchor.row = nRow
	oAnchor.col = nCol
	oAnchor.fldName = fldName
	oAnchor.container = strContainer
	if (strTooltip && strTooltip != "")oAnchor.title = strTooltip
	oAnchor.onclick = agsAnchorClick
	return oAnchor
}

//---------------------------------------------------------------------------------------------------
AGS.prototype.agsCreateButton=function(id, bDisplay, strValue, strNodeName, strContainer)
{
	var btnObj = document.createElement("INPUT")
	btnObj.type = "button"
	btnObj.className = "DMEButton"
	btnObj.style.position = "relative"
	btnObj.id = id
	btnObj.style.display = bDisplay?"block":"none"
	btnObj.value = strValue
	btnObj.prevNext = strNodeName
	btnObj.container = strContainer
	return btnObj
}

AGS.prototype.enableNextButton=function(bEnable)
{
	var nextBtn = document.getElementById("btnNext_"+this.id);
	if(!nextBtn)return;
	nextBtn.style.display = (bEnable)?"block":"none";
}

AGS.prototype.enablePreviousButton=function(bEnable)
{
	var prevBtn = document.getElementById("btnPrev_"+this.id);
	if(!prevBtn)return;
	prevBtn.style.display = (bEnable)?"block":"none";
}

function agsPreviousNext(e)
{
	e = e?e.currentTarget:window.event.srcElement
	if (typeof(e.container) == "undefined") return
	var objAgs = page.objects[e.container]
	if(!objAgs)return;
	if(e.prevNext == "PREVIOUS")
		page.eventSink(objAgs.id, "onPrevious")
	else if(e.prevNext == "NEXT")
		page.eventSink(objAgs.id, "onNext")
}

function agsAnchorClick(e)
{
	e = e?e.currentTarget:window.event.srcElement
	if(typeof(e.container) == "undefined")return;
	var objAgs = page.objects[e.container]
	if(!objAgs)return;

	switch (e.action)
	{
		case "sort":
			var bRet = false;
			if(typeof(window[objAgs.id+"_OnSort"]) == "function")
			{
				try {
					var bRet = eval(objAgs.id+"_OnSort()");
					if(!bRet)
						objAgs.agsSort(e.fldName);
				} catch (e) { }
			}
			break;
		case "drill":
			if(typeof(window[objAgs.id+"_OnOpenDrill"]) == "function")
			{
				try {
					var idaCall = eval(objAgs.id+"_OnOpenDrill('"+e.fldName+"')");
					if(typeof(idaCall)!= "undefined" && idaCall != "")
					{
						page.manageLeftBar(false);
						portalObj.drill.doDrill(window, "agsDrillRet", idaCall);
					}
				} catch (e) { }
			}
			break;
	}
}

function agsDrillRet(retVal)
{
	page.manageLeftBar(true);
}

function agsRowClick(e)
{
	var rowObj=e?e.currentTarget:window.event.srcElement
	if (rowObj.id.indexOf("agsrow") == -1)
	{
		rowObj = rowObj.parentNode
		if (rowObj.id.indexOf("agsrow") == -1)
		{
			rowObj = rowObj.parentNode
			if (rowObj.id.indexOf("agsrow") == -1)return
		}
	}
	var objAgs = page.objects[rowObj.container]
	var curRow = parseInt(rowObj.id.substr(7));
	if (objAgs.currentRow == curRow)
	{
		page.eventSink(objAgs.id, "OnRowClick");
		return;
	}
	else if (objAgs.currentRow != -1)
	{
		var curRowTbl = objAgs.currentRow +  2;
		var objTable = document.getElementById("agsTable_"+objAgs.id)
		objTable.rows[curRowTbl].className=""
	}
	objAgs.currentRow = curRow;
	rowObj.className= "DMECurrentRow";
	page.eventSink(objAgs.id, "OnRowClick");


	var colNodes = objAgs.agsTableXML.getElementsByTagName("ROW")[objAgs.currentRow].getElementsByTagName("FIELD")
	var rowStorage = new PortalStorage();
	var len = objAgs.tblFields.length;
	for (var i=0; i<len;i++)
	{
		rowStorage.addElement(objAgs.tblFields[i].name, portalWnd.trim(colNodes[i].childNodes[0].nodeValue));
	}
	page.setObjectValues(objAgs.id, rowStorage)
	page.eventSink(objAgs.id, "OnDatasrcUpdate")
}

AGS.prototype.agsSort=function(fldName)
{
	if(this.sortFld == fldName)
		this.sortDir = (this.sortDir == "-")?"+":"-";
	else
	{
		this.sortDir="+";
		this.sortFld = fldName;
	}

	var i, len = this.tblFields.length;
	for(i=0; i<len; i++)
	{
		if(this.tblFields[i].name == fldName)
		{
			this.sortType = this.tblFields[i].type;
			break;
		}
	}
	this.bubbleSort(i);
	this.agsTableHtml2();
}
AGS.prototype.bubbleSort=function(colIndex)
{
	var rows = this.agsTableXML.getElementsByTagName("ROWS")[0];
	var tmpObj1, tmpObj2;
	var tmpVal1, tmpVal2, tmpVal3;
	var tmpRow;
	var len = rows.childNodes.length;
	for (var i=0; i<len; i++)
	{
		for(var j=len-1; j>i; j--)
		{
			if(!rows.childNodes[j-1])break;

			tmpObj1 = rows.childNodes[j-1].getElementsByTagName("FIELD")[colIndex];
			tmpObj2 = rows.childNodes[j].getElementsByTagName("FIELD")[colIndex];

			if(!tmpObj1 || !tmpObj2)break;

			tmpVal1 = tmpObj1.childNodes[0].nodeValue;
			tmpVal2 = tmpObj2.childNodes[0].nodeValue;

			if(this.sortType == "numeric")
			{
				tmpVal3 = tmpVal1+0;
				if(!isNaN(tmpVal3)) tmpVal1=tmpVal3;

				tmpVal3 = tmpVal2+0;
				if(!isNaN(tmpVal3)) tmpVal2=tmpVal3;
			}
			else if(this.sortType == "date")
			{
				tmpVal1=this.getLawsonSystemDate(tmpVal1);
				tmpVal2=this.getLawsonSystemDate(tmpVal2);
			}

			if((this.sortDir=="+" && tmpVal1 > tmpVal2)
			|| (this.sortDir=="-" && tmpVal1 < tmpVal2))
			{
				tmpRow = rows.childNodes[j-1].cloneNode(true);
				rows.replaceChild(rows.childNodes[j].cloneNode(true),rows.childNodes[j-1]);
				rows.replaceChild(tmpRow,rows.childNodes[j]);
			}
		}
	}
}

AGS.prototype.getLawsonSystemDate=function(strVal)
{
	var dt = portalWnd.edGetDateObject(strVal, strVal.length);
	var lawDt = portalWnd.edFormatLawsonDate(dt);
	return lawDt;
}

//Utility functions -------------------------------------------------------------------------------
function getVarFromString(varName,str)
{
	var value=portalWnd.getVarFromString(varName,str);
	return value;
}

function getVarFromURL(varRef)
{
	var value=unescape(portalWnd.getVarFromString(varRef,document.location.search));
	return value;
}
function getVarsFromURL()
{
	var parms=new PortalStorage();
	var search=document.location.search;
	var nm;
	var val;
	var ptr1;
	var ptr2;

	search=search.substr(1);
	while(search!="")
	{
		ptr1=search.indexOf("=");
		nm=search.substr(0,ptr1);
		search=search.replace(nm+"=","");
		ptr1=search.indexOf("&");
		if(ptr1!=-1)
			val=search.substr(0,ptr1);
		else
			val=search.substr(0);
		parms.addElement(nm.toUpperCase(),unescape(val));
		search=search.replace(val,"");
		if(search.charAt(0)=="&")
			search=search.substr(1);
	}
	return parms;
}
function loadMessagesFile(URI)
{
	if (URI=="") return null;

	var msgDOM=new portalWnd.phraseObj(URI);
	if (!msgDOM || msgDOM.phraseDoc.status)
		return null;
	return msgDOM;
}
function addMessage(id,phrase)
{
	var msgDOM;
	var newMsg;
	var parNode;

	msgDOM=page.phrases.phraseDoc;
	parNode=msgDOM.getElementsByTagName("Translate");
	if(!parNode) return null;
	newMsg=msgDOM.createElement("phrase");
	newMsg.setAttribute("id",id);
	newMsg.appendChild(msgDOM.createTextNode(phrase));
	parNode.appendChild(newMsg);
	return true;
}
function loadCustomScript(type,value)
{
	var scSource=value;
	var scPath="";
	var scName="";
	try	{
		if(type=="file")
		{
			scPath=portalObj.path + "/content/scripts/"+value;
			if (value.indexOf("servlet") != -1)
			{
				scName = value.substr(value.lastIndexOf("&name="),value.length);
				scName = scName.substr(scName.indexOf("=")+1,scName.length);
			}
			else
				scName = value; 
			scSource=portalWnd.fileMgr.getFile(portalObj.path + "/content/scripts",
				scName,"text/plain",false);
		}

		if ((typeof(scSource)=="string") && (scSource.length))
		{
			var scElm=document.createElement("SCRIPT");
			scElm.text=scSource;
			document.body.appendChild(scElm);
			return;
		}

		var msg=page.phrases.getPhrase("ERR_LOADING_SCRIPT") + (scPath ? (" - "+scPath) : "");
		portalWnd.cmnDlg.messageBox(msg,"ok","alert",window);

	} catch (e)	{
		var prefMsg=page.phrases.getPhrase("ERR_LOADING_SCRIPT") + (scPath ? (" - "+scPath) : "");
		portalWnd.oError.displayExceptionMessage(e,"pages/pages.js","loadCustomScript",prefMsg);
	}
}
function nullPointerRef()
{
	return;
}
function pageNotification(e)
{
	page.setCurrentObj(e);
	evt=new LawsonEvent(e);
	srcElm=evt.getSrcElement();
	
	var id = srcElm.getAttribute("id");
	
	while(id == "")
	{
		srcElm=srcElm.parentNode;
		id = srcElm.getAttribute("id");
	}
		
	page.eventSink(id,"OnClick");	
}
function stringToXMLObj(strXml)
{
	var xmlObj = null;
	if(portalObj.browser.isIE)
	{
		xmlObj=portalWnd.objFactory.createInstance("DOM");
		xmlObj.async =false;
		xmlObj.loadXML(strXml);
	}
	else
	{
		var parser=new DOMParser();
		var re=new RegExp(/\n|\r|\t/g)
		strXml=strXml.replace(re,"");
		xmlObj =parser.parseFromString(strXml,"text/xml");
	}
	return xmlObj;
}
function chkValue(strValue, strDef)
{
	if(!strValue || typeof(strValue) == "undefined")
	{
		if(!strDef || typeof(strDef) == "undefined")
			strValue = "";
		else
			strValue = strDef;
	}
	return strValue;
}
function getDomainName()
{
	var domainName = "";
	if (!portalObj.browser.isIE)
		return domainName;

	if (typeof(ENVDOMAIN) != "undefined")
		domainName = ENVDOMAIN;

	return domainName;
}
