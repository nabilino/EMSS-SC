/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/drill/drill.js,v 1.124.2.44.4.44.6.11.2.26 2012/08/08 12:37:23 jomeli Exp $ */
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

// dynamic window title
window.document.title = wndArguments ? wndArguments[2] : window.document.title;

var drlDrillObj = null;
var drlPortal = null;
var drlPortalWnd = null;
var drlAboutWnd = null;
var drlSearchWnd = null;
var drlRange = null;
var drillAroundWndId = null;

function drlInit()
{
	var bIsIE = false;
	var standAlone = false;
	var callback = "";
	var drillDownMode = false;
	try {
		window.focus();
	} catch(e) { }

	if (wndArguments)
	{
		drlPortalWnd = wndArguments[0];
		drlPortal = drlPortalWnd.lawsonPortal;
		callback = "drlPortalWnd." + wndArguments[1];
		drillDownMode = (!wndArguments[3] ? false : wndArguments[3]);
		
		if(drillDownMode)
		{
			drillAroundWndId = (drlPortal.drill.drillAroundAry.length - 1)
			var oDrlAroundSelect = drlPortal.drill.drillAroundAry[drillAroundWndId];
			oDrlAroundSelect.wnd = window;
		}
			
		standAlone = true;
	}
	else
	{
		callback = window.location.search.replace("?", "");
				
		if(callback == "DRILLAROUND")
		{
			drillDownMode = true;
			drlPortalWnd = envFindObjectWindow("lawsonPortal", window.opener.parent);
			drlPortal = drlPortalWnd.lawsonPortal;
			callback = "window.opener.doDrillExecute(window)";
			drillAroundWndId = (drlPortal.drill.drillAroundAry.length - 1)
			var oDrlAroundSelect = drlPortal.drill.drillAroundAry[drillAroundWndId];
			oDrlAroundSelect.wnd = window;
			standAlone = true;			
		}
		else
		{
			drlPortalWnd = envFindObjectWindow("lawsonPortal");
			drlPortal = drlPortalWnd.lawsonPortal;
		}
	}

	// load the script versions
	envLoadWindowScriptVersions(drlPortalWnd.oVersions,window,drlPortalWnd);

	if (typeof(drlPortal) == "object" && drlPortal != null)
		bIsIE = drlPortal.browser.isIE;
	else
		bIsIE = ( navigator.userAgent.indexOf("MSIE") >= 0 ) ? true : false;

	drlDrillObj = new drillObj(bIsIE, callback, standAlone, drillDownMode);
}

//-----------------------------------------------------------------------------
//-- start drill object code
function drillObj(bIsIE, callback, standAlone, drillDownMode)
{
	// properties set by caller
	this.id = "0";					// initial value
	this.mode = null;				// [ select | list | explorer | attachment | genlist]
	this.target = null;				// window reference
	this.callback = null;			// function to call on form to return after processing (select and list)
	this.attachType = null;			// [ CMT/URL | CMT | URL ]
	this.nbrRecords = 25;
	this.idaCall = null;
	this.idaOrig = null;
	this.idaPath = null;
	this.isNugglet = false;			// [ true | false ]

	// list driven properties set by caller
	this.oReqFields = null;			// required fields collection from parent
	this.makeIda = null;   			// function to call on form to build the ida string
	this.formTitle = null;			// tab page title of left pane
	this.listUpdate = null;			// function to call on form to update the list selections

	// internal properties	
	this.isStandAlone = standAlone;		// [ true | false ]
	this.bIsIE = bIsIE;					// [ true | false ]
	this.isDrilling = drillDownMode;	// [ true | false ]
	this.recsToGet = "&_RECSTOGET=";
	this.idaLoad = null;
	this.idaXML = "";
	this.blnHasMsgbar = null;
	this.blnHasToolbar = false;			// [ true | false ]
	this.blnSearch = false;				// [ true | false ]
	this.blnReset = false;				// [ true | false ]
	this.blnFindNext = false;			// [ true | false ]
	this.toolbar = null;
	this.treeHasFocus = false;			// [ true | false ]
	this.attachmentHasFocus = false		// [ true | false ]
	this.noRecs = false;				// [ true | false ]
	this.isKnowledge = false; //bIsIE;			// [ true | false ]
	this.isKnowledgeLoaded = false;		// [ true | false ]
    this.genList = null;
    this.isDrillAllowed = false;

	this.treeArray = new Array();
	this.tree = new drlTree();
	this.tree.index = 0;
	this.treeArray[0] = this.tree;
	this.treeNodeId = 0;
	this.selectedTreeNode = null;
	this.selectedListNode = null;
	this.currentRow = null;
	this.context = null;
	this.rootNode = null;
	this.reqCurrentIndex = 0;			// for reqFields object
	this.ddNavlet = null;
	this.oViews = null;
	this.view = "";
	this.portalWnd = drlPortalWnd;

	this.openFolder = drlPortalWnd.getFullUrl(drlPortal.path + "/images/folderopen.gif");
	this.closedFolder = drlPortalWnd.getFullUrl(drlPortal.path + "/images/folder.gif");
	this.secureFolder = drlPortalWnd.getFullUrl(drlPortal.path + "/images/foldersecure.gif");
	this.documentImage = drlPortalWnd.getFullUrl(drlPortal.path + "/images/document.gif");
	this.expandedImage = drlPortalWnd.getFullUrl(drlPortal.path + "/images/minus.gif");
	this.collapsedImage = drlPortalWnd.getFullUrl(drlPortal.path + "/images/plus.gif");
	this.leafImage = drlPortalWnd.getFullUrl(drlPortal.path + "/images/blank.gif");

	this.topDiff = (this.isStandAlone) ? window.screenTop - parseInt(window.dialogTop, 10) : 0;
	this.leftDiff = (this.isStandAlone) ? window.screenLeft - parseInt(window.dialogLeft, 10) : 0;

	// for refresh method
	this.refreshPkg = null;	   			// for dom passed to refresh
	this.refreshObject = null;			// current object making call
	this.refreshCallback = null;		// method to return to when refresh is done
	this.recsDisabled = false;			// [ true | false ]

	if (document.implementation && document.implementation.createDocument)
		this.idaLoad = document.implementation.createDocument("", "",	null);
	else if (window.ActiveXObject)
	{
	  this.idaLoad = drlPortalWnd.objFactory.createInstance("DOM");
	  this.idaLoad.async = false;
	}
	setTimeout("drlComplete('" + callback + "')",0);
}

//-----------------------------------------------------------------------------
drillObj.prototype.clearRefresh = function()
{
	this.refreshObject = null;
	this.refreshCallback = null;
	this.refreshPkg = null;
}

//-----------------------------------------------------------------------------
drillObj.prototype.doChangeRecordsComplete = function(bRefreshOk)
{
	this.clearRefresh();
	if (bRefreshOk)
	{
		this.populate();
		drlRemoveNavlet("drlViews");
		drlRemoveNavlet("drlFind");
		this.render();
	}
}

//-----------------------------------------------------------------------------
drillObj.prototype.execute = function()
{
	var title;
	drlRemoveNavlet("drlViews");
	drlRemoveNavlet("drlFind");

	this.toolbar = this.setToolbar();
	this.setRecords();

	if (this.isNugglet || !this.isStandAlone)
	{
		if (this.tree.nodes.length > 0)
			this.tree.initialize();
	}

	switch (this.mode)
	{
		case "explorer":
			title = drlPortal.getPhrase("LBL_DRILL_EXPLORER");
			drlSetTitle(title);
			break;

		case "select":
			title = drlPortal.getPhrase("LBL_SELECT");
			drlSetTitle(drlPortal.getPhrase("LBL_DRILL_SELECT"));
        	if (this.idaCall.indexOf("_KNB=@") != -1)
                this.mode = "genlist";
			break;

		case "list":
			title = drlPortal.getPhrase("LBL_LIST_SELECT");
			drlSetTitle(title);
               			
			if (!this.renderDataDirectory())
			{
				drlCloseReturn(null);
				return;
			}
			var curIndex = this.makeIdaCall();
                			
			if (curIndex == this.oReqFields.reqFlds.length)
			{
				drlCloseReturn(this.oReqFields);
				return;
			}
			break;

		case "attachment":
			title = drlPortal.getPhrase("LBL_ATTACHMENTS");
			drlSetTitle(title);
			break;
	}

	drlCreateButtons();
	this.sizeMsgBar();

	if (this.idaOrig != this.idaCall)
		this.idaOrig = this.idaCall;

	this.refreshCallback = "drlDrillObj.executeComplete";
	this.refresh(this.idaCall);
}

//-----------------------------------------------------------------------------
drillObj.prototype.executeComplete = function(bRefreshOk)
{
	this.clearRefresh();
	if (bRefreshOk)
	{
		this.populate();
		this.render();
		var bSizeSplit = (this.mode == "explorer" || this.mode == "attachment")
		    ? true 
		    : false;
		drlDoResize(null, bSizeSplit);
	}
	else
	{
		if (this.mode == "list")
			drlCloseReturn(drlDrillObj.oReqFields);
	}
}

//-----------------------------------------------------------------------------
drillObj.prototype.makeIdaCall = function()
{
	var reqFields = this.oReqFields.reqFlds;
	var len = reqFields.length;
	for (var x=0; x<len; x++)
	{
		if (reqFields[x].data == "")
		{
			if (reqFields[x].tp.toLowerCase() == "select")
			{
				return len;
				break;
			}
			this.idaCall = eval("this.target." + this.makeIda + "('SL','" 
					+ reqFields[x].fld + "','" + reqFields[x].keynbr + "')");
			this.idaOrig = this.idaCall;
			this.reqCurrentIndex = x;
			break;
		}
	}
	return x;
}

//-----------------------------------------------------------------------------
drillObj.prototype.modifyPath = function(url)
{
	var oModPath = new Object();
	oModPath.pkg = null;
	oModPath.contentType = null;
	oModPath.url = url;
	var path = url.toLowerCase().substr(0, url.indexOf("?") + 1);

	// GETATTACHREC; replace path
	if (path.indexOf("getattachrec.exe?") != -1)
		oModPath.url = drlPortalWnd.GETATTACHPath + url.substr(url.indexOf("?"), url.length);

	// WRITEATTACH; replace path
	else if (path.indexOf("writeattach.exe?") != -1)
		oModPath.url = drlPortalWnd.WRITEATTACHPath + url.substr(url.indexOf("?"), url.length);

	// IDA; replace path and add recstoget
	else if (path.indexOf("drill/erp?") != -1 
			|| path.indexOf("ida?") != -1
			|| path.indexOf("ida.exe?") != -1)
	{
		oModPath.url = this.idaPath + url.substr(url.indexOf("?"), url.length)
				+ this.recsToGet + this.nbrRecords;

		// do post call if too long
		if (oModPath.url.length > 1900)
		{
			oModPath.pkg = oModPath.url.substr(oModPath.url.indexOf("?") + 1, oModPath.url.length);
			oModPath.url = oModPath.url.substr(0, oModPath.url.indexOf("?"));
			oModPath.contentType = "application/x-www-form-urlencoded";
		}
	}
	// PSA; leave path alone, but add the recstoget
	else if (path.indexOf(".dll?") != -1)
		oModPath.url += this.recsToGet + this.nbrRecords;

	return oModPath;
}

//-----------------------------------------------------------------------------
drillObj.prototype.populate = function()
{
	switch (this.mode)
	{
		case "list":
		case "select":
		case "genlist":
			this.tree.root();
			this.tree.nodes[0].tree.populate();
			this.tree.nodes[0].list.populate();
			this.tree.nodes[0].tree.firstSelectableNode();
			break;

		case "explorer":
			this.tree.populate();
			this.tree.firstSelectableNode();
			this.rootNode = this.selectedTreeNode;
			break;

		case "attachment":
			this.tree.attachmentRoot();
			this.tree.firstSelectableNode();
			this.rootNode = this.selectedTreeNode;
			break;

	}
}

//-----------------------------------------------------------------------------
drillObj.prototype.processNextForListComplete = function(bRefreshOk)
{
	this.clearRefresh();
	if (bRefreshOk)
	{
		this.populate();
		drlRemoveNavlet("drlViews");
		drlRemoveNavlet("drlFind");
		this.render();
	}
	else
		drlCloseReturn(this.oReqFields);
}

//-----------------------------------------------------------------------------
drillObj.prototype.refresh = function(url, isPkg)
{
	if (url.length > 0)
	{
		this.setMessage(drlPortal.getPhrase("PROCESSING") + "...");
		var re = /\\/g;
		var url1 = url.replace(re, "\\\\");	 //necessary because using setTimeout
	}
	setTimeout("drlDrillObj.refreshComplete(\"" + url1 + "\"," +  isPkg + ")",0);
}

//-----------------------------------------------------------------------------
drillObj.prototype.refreshComplete = function(url, isPkg)
{
	this.idaLoad = null;
	this.noRecs = false;
	var errMsg = "";
	var retVal = true;

	if (url.length == 0)
		retVal = false;
	else
	{
		if (typeof(isPkg) == "undefined")
			isPkg = false;

		var pkg = (isPkg) ? this.refreshPkg : null;

		if (this.idaPath == null)
			this.idaPath = drlPortalWnd.IDAPath;

		var oModPath = this.modifyPath(url);
		url = oModPath.url;

		// override pkg if available from oModPath
		if (oModPath.pkg != null)
			pkg = oModPath.pkg;

		this.idaXML = drlPortalWnd.httpRequest(url, pkg, oModPath.contentType, null, false);

		var msg = drlPortal.getPhrase("ERROR_LOAD_XML");
		var mUrl = url.substr(0, url.indexOf("?"));
		msg += ": " + (mUrl.length == 0 ? url : mUrl);
		drlPortalWnd.oError.setMessage(msg);
		if (drlPortalWnd.oError.isErrorResponse(this.idaXML,true,true,false,"",window))
		{
			this.setMessage("");
			retVal = false;
		}

		if (retVal)
		{
			this.idaLoad = drlPortalWnd.oError.getDSObject();

			// check for no records
			var lines = this.idaLoad.document.getElementsByTagName("LINES").item(0);
			if (lines && lines.childNodes.length == 0)
			{
				errMsg = drlPortal.getPhrase("msgNoRecordsMeetCriteria");
				this.noRecs = true;
			}
			else
			{
				// Check for 803-type error message
				errMsg = drlUndefineToBlank(this.idaLoad.getElementValue("ERRMSG"));

				if (errMsg.length > 0)
					this.noRecs = true;
				else
				{
					// Getattachrec and writeattach returns a slightly different error node
					var errNode = this.idaLoad.document.getElementsByTagName("ErrMsg").item(0);
					if (typeof(errNode) != "undefined" && errNode != null)
					{
						var errNbr = errNode.getAttribute("ErrNbr");
						if (errNbr != "0")
							errMsg = errNode.firstChild.nodeValue;

						if (errMsg == "No records meeting criteria")
							this.noRecs = true;
					}
				}
			}

			if (errMsg.length > 0)
			{
				drlRemoveChildren(document.getElementById("drlHeader"));
				drlRemoveChildren(document.getElementById("drlList"));
				document.getElementById("drlFooter").className = "DrillInvisible";
				this.setMessage(errMsg);
				retVal = false;
			}
		}
	}
	if (this.refreshCallback != null)
		eval(this.refreshCallback + "(" + retVal + ")");
}

//-----------------------------------------------------------------------------
drillObj.prototype.render = function()
{
	var bClear = true;

	switch (this.mode)
	{
		case "attachment":
		case "explorer":
			var tree = document.getElementById("drlTree");
			this.tree.render(tree);
			tree.className = "DrillTreeView";

			if (drlDrillObj.bIsIE)
				setTimeout("document.getElementById('drlTree').doScroll('scrollbarPageLeft')",0);

			// display first selectable tree item in list
			var node = this.tree.nextSelectableNode(-1);
			if (node)
			{
				bClear = false;
				node.show();
			}

			document.getElementById("drlSplitBar").className = "DrillSplitBar";
			drlSetFocusBorder(true);
			break;

		case "list":
		case "select":
		case "genlist":
			var tree = document.getElementById("drlTree");
			tree.className="DrillInvisible";
			document.getElementById("drlSplitBar").className = "DrillInvisible";

			this.tree.render(tree);
			this.tree.nodes[0].list.setViewOptions();

			if (!drlDrillObj.oViews)
				this.tree.nodes[0].list.render();
			else
				bClear = false;

			drlSetFocusBorder(false);
			break;

	}
	document.getElementById("drlWindow").className = "";
	if (bClear)
		this.setMessage("");
}

//-----------------------------------------------------------------------------
drillObj.prototype.renderDataDirectory = function()
{
	drlPortal.tabArea.tabs["PAGE"].setTitle(drlDrillObj.formTitle);

	this.ddNavlet = drlPortal.tabArea.tabs["PAGE"].addNavlet("Data Directory", 
			"drlDataDir" + drlDrillObj.id, window, "LBL_DATA_DIRECTORY");

	var reqFields = this.oReqFields.reqFlds;
	var len = reqFields.length;
	for (var index=0; index<len; index++)
	{
		if (reqFields[index].label == "")
		{
			return false;
			break;
		}
		var action = (reqFields[index].data == "") 
			? null 
			: "drlClickDataDirectory(" + index + ")";
		this.ddNavlet.addItem(reqFields[index].keynbr, reqFields[index].pos + ") " 
				+ reqFields[index].label + " " + reqFields[index].data, action, "");

		if (action == null)
			this.ddNavlet.changeItemState(reqFields[index].keynbr, "DISABLED");
	}
	return true;
}

//-----------------------------------------------------------------------------
drillObj.prototype.resetReqFields = function(index)
{
	var len = this.oReqFields.reqFlds.length;
	for (index; index<len; index++)
		this.updateReqFields(index, "", null);
}

//-----------------------------------------------------------------------------
drillObj.prototype.selectListNode = function(listNode)
{
	if (listNode != null)
	{
		if (this.selectedListNode != null)
		{
			if (this.selectedListNode.index != listNode.index)
			{
				this.selectedListNode.unselect();
				this.selectedListNode.update();
			}
		}
		listNode.selected = true;
		this.selectedListNode = listNode;
	}
}

//-----------------------------------------------------------------------------
drillObj.prototype.selectTreeNode = function(treeNode)
{
	if (!treeNode) return;

	if (this.selectedTreeNode)
	{
		if (this.selectedTreeNode.id != treeNode.id)
		{
			this.selectedTreeNode.unselect();
			this.selectedTreeNode.update();
		}
	}
	treeNode.selected = true;
	this.selectedTreeNode = treeNode;
	this.selectedTreeNode.setImage();
}

//-----------------------------------------------------------------------------
drillObj.prototype.setMessage = function(sMsg)
{
	if (this.blnHasMsgbar)
	{
		var msgBar = document.getElementById("drlMsgbar");
		msgBar.childNodes[0].nodeValue = sMsg;
	}
	else
		drlPortal.setMessage(sMsg);
}

//-----------------------------------------------------------------------------
drillObj.prototype.setRecords = function()
{
	var optNode = drlPortalWnd.oPortalConfig.getUserOption(this.mode);
	this.recsDisabled = (optNode && optNode.getAttribute("disable") == "1"
			? true : false);

	if (this.recsDisabled) return;

	var elem = document.getElementById("drlRecordsLabel1");
	elem.firstChild.nodeValue = drlPortal.getPhrase("LBL_VIEW") + " ";

	elem = document.getElementById("drlRecordsLabel2");
	elem.firstChild.nodeValue = drlPortal.getPhrase("LBL_RECORDS");

	elem = document.getElementById("drlSelectRecords");
	elem.disabled = false;
	elem.options.length = 0;
		
	var index;
	var aryLabel = drlPortalWnd.oPortalConfig.arrValues;
	var len = aryLabel.length;
	var nbrRecs = this.nbrRecords.toString();

	for (var i=0; i<len; i++)
	{
		index = elem.options.length;
		drlPortalWnd.cmnCreateSelectOption(document, elem, 
				aryLabel[i], aryLabel[i]);
		if	(nbrRecs == elem.options[index].value)
			elem.options[index].selected = true;
	}
	elem.disabled = true;
}

//-----------------------------------------------------------------------------
drillObj.prototype.setToolbar = function()
{
	if (this.isNugglet || this.isStandAlone)
	{
		var toolbar = document.getElementById("drlToolBar");
		toolbar.className = "DrillToolbar";
		toolbar.style.height = "30px";
		return new drlPortalWnd.Toolbar(drlPortalWnd, window, toolbar);
	}
	else
		return drlPortal.toolbar;
}

//-----------------------------------------------------------------------------
drillObj.prototype.sizeMsgBar = function()
{
	if (this.blnHasMsgbar == null)
	{
		if (this.isNugglet || this.isStandAlone)
		{
			var drillMsg = document.getElementById("drlMsgOuter");
			drillMsg.className = "DrillMsgOuter";
			drillMsg.style.height = "22px";
			this.blnHasMsgbar = true;				// message bar is contained within drill object
			drlDoResize(null, false);
		}
		else
			this.blnHasMsgbar = false;				// message bar is contained on portal
	}
}

//-----------------------------------------------------------------------------
drillObj.prototype.updateReqFields = function(index, data, keyflds)
{
	var reqField = this.oReqFields.reqFlds[index];
	reqField.data = data;
	reqField.keyflds = keyflds;
	var action = (data == "") ? null : "drlClickDataDirectory(" + index + ")";

	this.ddNavlet.changeItem(reqField.keynbr, reqField.pos + ") " 
			+ reqField.label + " " + data, action);

	if (action == null)
		this.ddNavlet.changeItemState(reqField.keynbr, "DISABLED");

	eval("drlDrillObj.target." + this.listUpdate + "('" 
			+ reqField.fld + "','" + data + "')");
}

//-----------------------------------------------------------------------------
function drlComplete(callback)
{
	if (callback.length > 0)
		eval(callback);
}

//-----------------------------------------------------------------------------
function drlTree()
{
	this.index = null;
	this.parentTree = null;
	this.parentTreeNode = null;
	this.nodes = new Array();
}

//-----------------------------------------------------------------------------
drlTree.prototype.attachmentRoot = function()
{
	if (drlDrillObj.attachType == null || drlDrillObj.attachType == "")
		return;

	var blnCmtAttach = ((drlDrillObj.attachType.search(/CMT/i)) == -1) ? false : true;
	var loopCnt = (drlDrillObj.attachType.toUpperCase()=="CMT/URL") ? 2 : 1;

	for	(var i=0; i<loopCnt; i++)
	{
		switch (drlDrillObj.attachType.toUpperCase())
		{
			case "CMT/URL":
				blnCmtAttach = (i==0);
				if (!blnCmtAttach)
					drlDrillObj.idaCall = drlDrillObj.idaCall.replace(/_TYP=CMT/gi, "_TYP=URL");

			case "CMT":
			case "URL":
				var treeNode = new drlTreeNode();
				treeNode.populateAttachment(blnCmtAttach);

				treeNode.index = i;
				treeNode.parentTree = this.index;
				treeNode.tree.parentTree = this.index;
				treeNode.tree.parentTreeNode = treeNode.index;
				treeNode.tree.index = drlDrillObj.treeArray.length;
				drlDrillObj.treeArray[drlDrillObj.treeArray.length] = treeNode.tree;
				treeNode.id = drlDrillObj.treeNodeId++;
				treeNode.list.parentTree = this.index;
				treeNode.list.siblingTree = treeNode.tree.index;
				treeNode.list.parentTreeNode = treeNode.index;
				treeNode.setTitle();

				this.nodes[i] = treeNode;
				break;
		}
	}
}

//-----------------------------------------------------------------------------
drlTree.prototype.firstSelectableNode = function()
{
	for	(var i=0; i<this.nodes.length; i++)
	{
		if (!this.nodes[i].isSecure && this.nodes[i].visible)
		{
			drlDrillObj.selectTreeNode(this.nodes[i]);
			break;
		}
	}
}

//-----------------------------------------------------------------------------
drlTree.prototype.hideAll = function()
{
	for	(var i=0; i<this.nodes.length; i++)
	{
		if (this.nodes[i].visible)
			this.nodes[i].deleteNode();
	}
}

//-----------------------------------------------------------------------------
drlTree.prototype.initialize = function()
{
	drlDrillObj.treeArray = new Array();
	drlDrillObj.tree = null;
	drlDrillObj.tree = new drlTree();
	drlDrillObj.tree.index = 0;
	drlDrillObj.treeArray[0] = drlDrillObj.tree;
	drlDrillObj.treeNodeId = 0;
	drlDrillObj.selectedTreeNode = null;
	drlDrillObj.selectedListNode = null;

	drlRemoveChildren(document.getElementById("drlTree"));
	drlRemoveChildren(document.getElementById("drlHeader"));
	drlRemoveChildren(document.getElementById("drlList"));
}

//-----------------------------------------------------------------------------
drlTree.prototype.lastSelectableNode = function()
{
	var index = this.nodes.length;
	for	(var i=index-1; 0<=i; i--)
	{
		if (!this.nodes[i].isSecure && this.nodes[i].visible)
			return this.nodes[i];
	}
	return null;
}

//-----------------------------------------------------------------------------
drlTree.prototype.nextSelectableNode = function(index)
{
	index = (index == -1) ? 0 : index+1;
	for	(var i=index; i<this.nodes.length; i++)
	{
		if (!this.nodes[i].isSecure && !this.nodes[i].isProtected && this.nodes[i].visible)
			return this.nodes[i];
	}
	return null;
}

//-----------------------------------------------------------------------------
drlTree.prototype.populate = function()
{
	var oNodes = drlDrillObj.idaLoad.document.getElementsByTagName("LINE");
	var oneOnlyNode = drlDrillObj.idaLoad.document.getElementsByTagName("OneOnly");
	var isOneOnly = false;
	if (oneOnlyNode.length > 0)
		isOneOnly = oneOnlyNode[0].text == "T" ? true : false;
	
	var len = oNodes.length;
	for (var i=0; i<len; i++)
	{
		var treeNode = new drlTreeNode();
		treeNode.populate(oNodes[i]);
		treeNode.index = this.nodes.length;
		treeNode.parentTree = this.index;
		treeNode.tree.parentTree = this.index;
		treeNode.tree.index = drlDrillObj.treeArray.length;
		drlDrillObj.treeArray[drlDrillObj.treeArray.length] = treeNode.tree;
		treeNode.tree.parentTreeNode = treeNode.index;
		treeNode.id = drlDrillObj.treeNodeId++;
		treeNode.list.parentTree = this.index;
		treeNode.list.siblingTree = treeNode.tree.index;
		treeNode.list.parentTreeNode = treeNode.index;
		treeNode.setTitle(drlDrillObj.idaLoad);
		if (isOneOnly)
		{
			treeNode.isOneOnly = true;
			treeNode.getParentTreeNode().isOneOnly = true;
		}
		if (isOneOnly && len>1)
		{
			var colsNode = oNodes[i].getElementsByTagName("COLS")[0];
			if (colsNode)
			{
				var colNode = colsNode.getElementsByTagName("COL")[0];
				if (colNode)
				{
					var isAdd = (colNode.getAttribute("action") == "Add")
					if (isAdd)
						treeNode.visible = false;
				}
			}
		}
		this.nodes[this.nodes.length] = treeNode;
	}
}

//-----------------------------------------------------------------------------
drlTree.prototype.prevSelectableNode = function(index)
{
	for	(var i=index-1; 0<=i; i--)
	{
		if (!this.nodes[i].isSecure && !this.nodes[i].isProtected && this.nodes[i].visible)
			return this.nodes[i];
	}
	return null;
}

//-----------------------------------------------------------------------------
drlTree.prototype.render = function(elem)
{
	var len = this.nodes.length;
	for	(var i=0; i<len; i++)
	{
		if (this.nodes[i].visible)
			this.nodes[i].render(elem);
	}
}

//-----------------------------------------------------------------------------
drlTree.prototype.root = function()
{
	drlDrillObj.rootNode = new drlTreeNode();
	drlDrillObj.rootNode.expanded = true;
	drlDrillObj.rootNode.text = "Root";
	drlDrillObj.rootNode.idaCall = drlDrillObj.idaCall;
	drlDrillObj.rootNode.callType = "SL";
	drlDrillObj.rootNode.image = drlDrillObj.openFolder;
	drlDrillObj.rootNode.expandedImage = drlDrillObj.expandedImage;
	drlDrillObj.rootNode.index = 0;
	drlDrillObj.rootNode.parentTree = this.index;
	drlDrillObj.rootNode.tree.parentTree = this.index;
	drlDrillObj.rootNode.tree.parentTreeNode = drlDrillObj.rootNode.index;
	drlDrillObj.rootNode.tree.index = drlDrillObj.treeArray.length;
	drlDrillObj.treeArray[drlDrillObj.treeArray.length] = drlDrillObj.rootNode.tree;
	drlDrillObj.rootNode.id = drlDrillObj.treeNodeId++;
	drlDrillObj.rootNode.list.parentTree = this.index;
	drlDrillObj.rootNode.list.siblingTree = drlDrillObj.rootNode.tree.index;
	drlDrillObj.rootNode.list.parentTreeNode = drlDrillObj.rootNode.index;
	drlDrillObj.rootNode.setTitle(drlDrillObj.idaLoad);
	this.nodes[0] = drlDrillObj.rootNode;
}

//-----------------------------------------------------------------------------
function drlTreeNode()
{
	this.selected = false;
	this.expanded = false;
	this.visited = false;
	this.isSecure = false;
	this.isProtected = false;
	this.isLeafNode = false;
	this.convertReport = false;
	this.hasAttachment = false;
	this.visible = true;
	this.attach = false;
	this.knowledge = false;
	this.title = "";
	this.text = "";
	this.idaCall = "";
	this.idaOrig = "";
	this.callType = "";
	this.image = "";
	this.expandedImage = "";
	this.index = null;
	this.id = null;
	this.parentTree = null;
	this.viewMode = "list";  	// [ list | attachment ]
	this.keyNodes = null;
	this.isOneOnly = false;
	this.events = new Array();
	this.list = new drlList();
	this.attachment = new drlAttachment();
	this.tree = new drlTree();
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.addAttachment = function(bRefreshOk)
{
	drlDrillObj.clearRefresh();
	if (!bRefreshOk) return;

	this.convertChangeReport();
	var tree = drlDrillObj.treeArray[this.parentTree];
	tree.populate();

	var parentTreeNode = this.getParentTreeNode();
	parentTreeNode.list.append();

	var addedTreeNode = tree.nodes[tree.nodes.length-1];
	var elem = document.getElementById(parentTreeNode.id);

	addedTreeNode.render(elem.nextSibling);
	addedTreeNode.attachment.render(addedTreeNode.parentTree, addedTreeNode.index);
	addedTreeNode.expandParentTree();
	drlDrillObj.selectTreeNode(addedTreeNode);
	addedTreeNode.update();
	drlDrillObj.treeHasFocus = false;
	drlPlaceFocus();
	if (parentTreeNode.isOneOnly)
	{
		tree.nodes[0].deleteNode();
	}
	drlDrillObj.setMessage(drlPortal.getPhrase("ADD_SUCCESSFUL"));
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.addNode = function()
{
	this.tree.populate();
	this.list.populate();
	var elem = this.getElement();
	this.tree.render(elem.nextSibling);
	this.list.render();

	this.expandParentTree();
	drlDrillObj.selectTreeNode(this);
	this.expand();
	this.update();
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.changeAttachment = function(bRefreshOk)
{
	drlDrillObj.clearRefresh();
	if (!bRefreshOk) return;

	var line = this.convertChangeReport();
	this.attachment.populate(line);
	this.text = this.attachment.title;
	this.attachment.render(this.parentTree, this.index);
	this.update();

	var siblingListNode = this.getSiblingListNode();
	siblingListNode.columns[0].update(this.text);
	drlDrillObj.treeHasFocus = false;
	drlPlaceFocus();

	this.visited = true;
	drlDrillObj.setMessage(drlPortal.getPhrase("CHANGE_SUCCESSFUL"));
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.checkSelectedFocus = function()
{
	var parentTreeNode = drlDrillObj.selectedTreeNode.getParentTreeNode();
	while (parentTreeNode != null)
	{
		if (parentTreeNode.expanded)
			parentTreeNode = parentTreeNode.getParentTreeNode();
		else
		{
			parentTreeNode.showList();
			break;
		}
	}
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.collapse = function()
{
	this.selected = true;
	this.setImage();
	this.setCollapse();
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.collapseTree = function()
{
	this.setCollapse();
	this.updateTree();
	this.checkSelectedFocus();
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.collapseTreeList = function()
{
	this.list.render();
	drlDrillObj.selectTreeNode(this);
	this.collapse();
	this.update();
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.convertAttachmentReport = function()
{
	var convert = "";
	var report = drlDrillObj.idaLoad.document.getElementsByTagName("Report").item(0);
	var executable = report.getAttribute("executable");
	var cgidir = report.getAttribute("cgidir");
	var queryBase = drlDrillObj.idaLoad.document.getElementsByTagName("QueryBase").item(0);
	var exePath = queryBase.getAttribute("exepath");
	var previousAttachType = "";
	var queryBaseData = "";
	var oneOnlyNodes = drlDrillObj.idaLoad.document.getElementsByTagName("OneOnly");
	var drillNameNodes = drlDrillObj.idaLoad.document.getElementsByTagName("DrillName");
	var winTitle = drlDrillObj.idaLoad.document.getElementsByTagName("WinTitle")[0].text;
	var isOneOnly = false;
	
	
	for (var i = 0; i<oneOnlyNodes.length; i++)
	{
		if (winTitle == drillNameNodes[i].text)
		{
			isOneOnly = oneOnlyNodes[i].nodeTypedValue == "T" ? true : false;
			break;
		}
	}
	
	var len = queryBase.childNodes.length;
	for (var x=0; x<len; x++)
	{
		if (queryBase.childNodes[x].nodeValue.indexOf("_OUT=XML") != -1)
		{
			queryBaseData = queryBase.childNodes[x].nodeValue;
			break;
		}
	}

	var oNodes = drlDrillObj.idaLoad.document.getElementsByTagName("RecAtt");
	len = oNodes.length;
	for (var i=0; i<len; i++)
	{
		var queryVal = oNodes[i].getElementsByTagName("QueryVal").item(0).firstChild.nodeValue;
		var attachType = oNodes[i].getElementsByTagName("AttType").item(0);
		attachType = 
			(typeof(attachType)!="undefined" && attachType!=null) 
				? attachType.firstChild.nodeValue 
				: previousAttachType;
		if (attachType.length==1)
			attachType = (attachType=="C") ? "CMT" : "URL";
		else if (attachType.length==0)
			attachType = (queryVal.indexOf("_USCH=http")!=-1 || queryVal.indexOf("_USCH=email")!=-1) ? "URL" : "CMT";
		var blnEmail = (queryVal.indexOf("_USCH=email")!=-1) ? true : false;

		convert += "<LINE>\n";
		if (isOneOnly)
			convert += "<OneOnly>T</OneOnly>\n";
		convert += "<COLS>\n";

		switch (oNodes[i].getAttribute("Action"))
		{
			case "Add":
				var action = "Add";
				var title = oNodes[i].getElementsByTagName("AttName").item(0).firstChild.nodeValue;
				break;

			case "":
				if (oNodes[i].getElementsByTagName("AttData").item(0))
				{
					var action = "";
					var title = oNodes[i].getElementsByTagName("AttData").item(0).firstChild.nodeValue;
				}
				else
				{
					var action = "Change";
					var title = oNodes[i].getElementsByTagName("AttName").item(0).firstChild.nodeValue;
				}
				break;

			default:
				var action = "";
				var title = "";
				break;
		}

		convert += "<COL action='" + action + "'><![CDATA[" + title + "]]></COL>\n";
		convert += "</COLS>\n";

		if (action == "Add")
			var idaCall = exePath + "?" + queryBaseData + queryVal;
		else
			var idaCall = cgidir + executable + "?" + queryBaseData + queryVal;

		convert += "<IDACALL type='" + attachType + "' attachment='true' email='" + blnEmail
		convert += "'><![CDATA[" + idaCall + "]]></IDACALL>\n";
		convert += this.createModTags(oNodes[i]);
		convert += "</LINE>\n";

		previousAttachType = attachType;
	}

	if (convert.length > 0)
	{
		convert = "<IDARETURN>\n" + "<LINES>\n" + convert + "</LINES>\n" + "</IDARETURN>";
		drlDrillObj.idaLoad = new drlPortalWnd.DataStorage(convert);
	}
	else
		drlDrillObj.idaLoad = null;

	return (drlDrillObj.idaLoad == null) ? false : true;
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.convertChangeReport = function()
{
	var convert = "";
	var report = drlDrillObj.idaLoad.document.getElementsByTagName("Report").item(0);
	var executable = report.getAttribute("executable");
	var path = report.getAttribute("cgidir");
	var queryBase = drlDrillObj.idaLoad.document.getElementsByTagName("QueryBase").item(0);
	var exePath = queryBase.getAttribute("exepath");
	var queryBaseData = "";

	var len = queryBase.childNodes.length;
	for (var x=0; x<len; x++)
	{
		if (queryBase.childNodes[x].nodeValue.indexOf("_OUT=XML") != -1)
		{
			queryBaseData = queryBase.childNodes[x].nodeValue;
			break;
		}
	}

	var oNodes = drlDrillObj.idaLoad.document.getElementsByTagName("RecAtt");
	len = oNodes.length;
	for (var i=0; i<len; i++)
	{
		var queryVal = oNodes[i].getElementsByTagName("QueryVal").item(0).firstChild.nodeValue;
		var title = oNodes[i].getElementsByTagName("AttName").item(0).firstChild.nodeValue;
		var tNode = oNodes[i].getElementsByTagName("AttData").item(0)
		var text = "";

		var tNodeLen = tNode.childNodes.length;
		for (var x=0; x<tNodeLen; x++)
		{
			if (tNode.childNodes[x].nodeType == 4)
			{
				text = tNode.childNodes[x].nodeValue;
				break;
			}
		}

		var attachType = (this.attachment.isComment) ? "CMT" : "URL";
		var blnEmail = (this.attachment.isEmail);
		var idaCall = path + "getattachrec.exe?" + queryBaseData + queryVal;
		idaCall = idaCall.replace(/\\/g, "/");

		convert += "<LINE>\n";
		convert += 		"<COLS>\n";
		convert += 			"<COL action='Change'><![CDATA[" + title + "]]></COL>\n";
		convert += 		"</COLS>\n";
		convert += 		"<IDACALL type='" + attachType + "' attachment='true' email='" + blnEmail
		convert += "'><![CDATA[" + idaCall + "]]></IDACALL>\n";
		convert += 		"<ATTACHMENT><![CDATA[" + text + "]]></ATTACHMENT>\n";
		convert += this.createModTags(oNodes[i]);
		convert += "</LINE>\n";
	}

	if (convert.length > 0)
	{
		convert = "<IDARETURN>\n" + "<LINES>\n" + convert + "</LINES>\n" + "</IDARETURN>";
		drlDrillObj.idaLoad = new drlPortalWnd.DataStorage(convert);
	}
	else
		drlDrillObj.idaLoad = null;

	return ( drlDrillObj.idaLoad != null
			? drlDrillObj.idaLoad.document.getElementsByTagName("LINE").item(0) 
			: null );
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.createModTags = function(node)
{
	var aryLabel = new Array("CrtDate", "CrtTime", "ModDate", "ModTime", 
			"AttCreator", "AttModifier");
	var lenLabel = aryLabel.length;
	var strTags = "";
	var tag = "";
	var item = null;
	var value = "";

	for (var n=0; n<lenLabel; n++)
	{
		tag = aryLabel[n].toUpperCase();
		item = node.getElementsByTagName(aryLabel[n]).item(0); 
		var value = (item == null || item.firstChild == null) 
			? "" 
			: item.firstChild.nodeValue;
		strTags += "<" + tag + "><![CDATA[" + value + "]]></" + tag + ">\n";
	}
	return strTags;
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.deleteAttachment = function(bRefreshOk)
{
	drlDrillObj.clearRefresh();
	if (!bRefreshOk) return;

	this.visible = false;

	var parentTreeNode = this.getParentTreeNode();
	var siblingListNode = this.getSiblingListNode();
	siblingListNode.hide();

	// remove this node from the tree
	var elem = this.getElement();
	while (elem.className != "DrillTreeContainer")
		elem = elem.parentNode;

	var insert = elem;
	while (insert.className != "insertPoint")
		insert = insert.parentNode;
	var removed = insert.removeChild(elem);
	if (parentTreeNode.isOneOnly)
	{
		parentTreeNode.tree.nodes[0].visible = true;
		parentTreeNode.list.nodes[0].visible = true;
		parentTreeNode.tree.render(insert);
	}
	
	parentTreeNode.expandTreeList();
	drlDrillObj.treeHasFocus = true;
	drlPlaceFocus();
	drlDrillObj.setMessage(drlPortal.getPhrase("DELETE_SUCCESSFUL"));
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.deleteNode = function()
{
	this.visible = false;
	var parentTreeNode = this.getParentTreeNode();
	var siblingListNode = this.getSiblingListNode();
	siblingListNode.hide();

	// remove this node from the tree
	var elem = this.getElement();
	while (elem.className != "DrillTreeContainer")
		elem = elem.parentNode;

	var insert = elem;
	while (insert && insert.className != "insertPoint")
		insert = insert.parentNode;
	if (insert)
		var removed = insert.removeChild(elem);

	parentTreeNode.expandTree();
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.doConvert = function()
{
	return this.convertAttachmentReport();
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.expand = function()
{
	this.selected = true;
	this.setImage();
	this.setExpand();
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.expandList = function()
{
	if (!this.visited)
	{
		drlDrillObj.refreshObject = this;
		drlDrillObj.refreshCallback = "drlDrillObj.refreshObject.expandListComplete";
		
		if(!this.idaCall) return;
		
		drlDrillObj.refresh(this.idaCall);
	}
	else
	{
		this.list.render();
		drlDrillObj.selectTreeNode(this);
		this.update();
		drlSetTitle(this.title);
	}
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.expandListComplete = function(bRefreshOk)
{
	var bConvert = false;
	drlDrillObj.clearRefresh();
	if (bRefreshOk)
	{
		if (this.convertReport)
			bConvert = this.doConvert();

		this.tree.populate();
		this.list.populate();
		var elem = this.getElement();
		this.tree.render(elem.nextSibling);
		this.list.render();

		drlDrillObj.selectTreeNode(this);
		this.selected = true;
		this.visited = true;
		this.expandedImage = (this.tree.nodes.length > 0 || this.attach) 
			? this.expandedImage 
			: drlDrillObj.leafImage;
		this.setImage();
		this.update();
		drlDrillObj.setMessage("");
	}
	else
	{
		if (drlDrillObj.mode == "explorer")
		{
			if (drlDrillObj.noRecs)
				this.noRecordsError();
			drlDrillObj.selectTreeNode(this);
			this.list.render();
			this.update();
		}
	}
	drlSetTitle(this.title);
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.expandParentTree = function()
{
	var parentTreeNode = this.getParentTreeNode();
	if (parentTreeNode != null)
	{
		drlDrillObj.selectTreeNode(parentTreeNode);
		parentTreeNode.expand();
		parentTreeNode.update();
	}
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.expandTree = function()
{
	if (!this.visited)
	{
		drlDrillObj.refreshObject = this;
		drlDrillObj.refreshCallback = "drlDrillObj.refreshObject.expandTreeComplete";
		drlDrillObj.refresh(this.idaCall);
	}
	else
	{
		this.setExpand();
		this.updateTree();
	}
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.expandTreeComplete = function(bRefreshOk)
{
	var bConvert = false;
	drlDrillObj.clearRefresh();
	if (bRefreshOk)
	{
		if (this.convertReport)
			bConvert = this.doConvert();

		// empty directory
		if (!bConvert && this.callType == "KR")
		{
			this.setExpand();
			this.updateTree();
			drlDrillObj.setMessage("");
		}
		else
		{	
			this.tree.populate();
			this.list.populate();
			var elem = this.getElement();
			this.tree.render(elem.nextSibling);
			this.setExpand();
			this.updateTree();
			drlDrillObj.setMessage("");
		}
	}
	else
	{
		switch (drlDrillObj.mode)
		{
			case "list":
				drlCloseReturn(drlDrillObj.oReqFields);
				return;
				break;

			case "explorer":
				if (this.callType == "KR")
					this.expand();
				else if (drlDrillObj.noRecs)
					this.noRecordsError();
				break;

			case "attachment":
				if (drlDrillObj.noRecs)
					this.noRecordsError();
				break;
		}
	}
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.expandTreeList = function()
{
	if (!this.visited)
	{
		drlDrillObj.refreshObject = this;
		drlDrillObj.refreshCallback = "drlDrillObj.refreshObject.expandTreeListComplete";
		drlDrillObj.refresh(this.idaCall);
	}
	else
	{
		this.list.render();
		drlDrillObj.selectTreeNode(this);
		this.expand();
		this.update();
		drlSetTitle(this.title);
	}
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.expandTreeListComplete = function(bRefreshOk)
{
	var bConvert = false;
	drlDrillObj.clearRefresh();
	if (bRefreshOk)
	{
		if (this.convertReport)
			bConvert = this.doConvert();

		this.tree.populate();
		this.list.populate();
		var elem = this.getElement();
		this.tree.render(elem.nextSibling);
		this.list.render();

		drlDrillObj.selectTreeNode(this);
		this.expand();
		this.update();
		drlDrillObj.setMessage("");
	}
	else
	{
		switch (drlDrillObj.mode)
		{
			case "list":
				drlCloseReturn(drlDrillObj.oReqFields);
				return;
				break;

			case "explorer":
				if (this.callType == "KR")
					this.expand();
				else if (drlDrillObj.noRecs)
					this.noRecordsError();
				drlDrillObj.selectTreeNode(this);
				this.list.render();
				this.update();
				break;

			case "attachment":
				if (drlDrillObj.noRecs)
					this.noRecordsError();
				break;
		}

		drlDrillObj.blnSearch = false;
		drlDrillObj.blnFindNext = false;
		drlDrillObj.blnReset = false;
		drlSetSearchButtons();
	}
	drlSetTitle(this.title);
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.findReturnComplete = function(bRefreshOk)
{
	drlDrillObj.clearRefresh();
	
	if (drlDrillObj.noRecs)
	{
		drlDrillObj.blnFindNext = false;
		drlSetSearchButtons();
	}

	if (!bRefreshOk) return;

	this.list.nodes = new Array();
	this.tree.nodes = new Array();
	this.visited = false;
	this.expanded = false;
	this.list.navigate.isFind = true;

	var elem = document.getElementById(this.id);
	drlRemoveChildren(elem.nextSibling);

	this.tree.populate();
	this.list.populate();
	this.tree.render(elem.nextSibling);
	this.list.render();

	this.expandParentTree();
	drlDrillObj.selectTreeNode(this);
	this.expand();
	this.update();
	drlDrillObj.setMessage("");
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.firstSelectableListNode = function()
{
	for	(var i=0; i<this.list.nodes.length; i++)
	{
		if (!this.list.nodes[i].isSecure)
		{
			drlDrillObj.selectListNode(this.list.nodes[i]);
			break;
		}
	}
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.getElement = function()
{
	return document.getElementById(this.id);
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.getGrandparentTree = function()
{
	var gparentTree = null;

	if (this.parentTree != null)
	{
		var parentTree = drlDrillObj.treeArray[this.parentTree];
		if (parentTree.parentTree != null)
		{
			var gparentTree = drlDrillObj.treeArray[parentTree.parentTree];
		}
	}

	return gparentTree;
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.getParentTreeNode = function()
{
	var parentTreeNode = null;

	if (this.parentTree != null)
	{
		var tree = drlDrillObj.treeArray[this.parentTree];
		if (tree.parentTree != null)
		{
			var parentTree = drlDrillObj.treeArray[tree.parentTree];
			parentTreeNode = parentTree.nodes[tree.parentTreeNode];
		}
	}
	return parentTreeNode;
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.getSiblingListNode = function()
{
	var listNode = null;
	var parentTreeNode = this.getParentTreeNode();
	if (parentTreeNode != null)
		listNode = parentTreeNode.list.nodes[this.index];
	return listNode;
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.noRecordsError = function()
{
	this.secure();
	this.update();

	var siblingListNode = this.getSiblingListNode();
	if (siblingListNode != null)
		siblingListNode.hide();

	drlDrillObj.selectTreeNode(drlDrillObj.selectedTreeNode);
	if (drlDrillObj.selectedTreeNode != null && drlDrillObj.selectedTreeNode.id == this.id)
	{
		if (this.parentTree != null)
		{
			var parentTree = drlDrillObj.treeArray[this.parentTree];
			parentTree.firstSelectableNode();
			if (drlDrillObj.selectedTreeNode != null && drlDrillObj.selectedTreeNode.id == this.id)
				drlDrillObj.selectedTreeNode.list.render();
		}
	}
	else
	{
		var parentTreeNode = this.getParentTreeNode();
		if (parentTreeNode != null)
			parentTreeNode.list.render();
	}
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.populate = function(line)
{
	var idaCall = line.getElementsByTagName("IDACALL").item(0);
	this.callType = idaCall.getAttribute("type");

	if (drlDrillObj.mode == "select" || drlDrillObj.mode == "list" || drlDrillObj.mode == "genlist")
	{
		if (!this.callType)
			this.callType = drlSetCallType(true);
	}

	// Get the idaCall string
	var sIdaCall = "";
	var len = idaCall.childNodes.length;
	for (var x=0; x<len; x++)
	{
		if (idaCall.childNodes[x].nodeValue.indexOf("TYP=") != -1)
		{
			sIdaCall = idaCall.childNodes[x].nodeValue;
			break;
		}
	}

	this.idaCall = sIdaCall;
	this.idaOrig = sIdaCall;
	this.isSecure = (this.idaCall.length == 0 || this.callType.length == 0);
	this.isProtected = (this.callType == "OS" && this.idaCall.length == 0);
	this.isSecure = (this.isProtected) ? false : this.isSecure;
	var col = line.getElementsByTagName("COL").item(0);
	this.text = drlPortalWnd.trim(col.firstChild.nodeValue);

	if (!this.isSecure)
	{
		if (this.callType == "OPN" || this.callType == "KRf" || this.callType == "OW")
			this.isLeafNode = true;

		this.convertReport = (this.callType == "KR");

		// focus/blur events are not allowing the click event to work when 
		//	the tree pane has been scrolled in netscape
		if (drlPortal.browser.isIE)
		{
			this.events[0] = new drlEvent("onfocus", "drlOnFocusTree()");
  			this.events[1] = new drlEvent("onblur", "drlOnBlurTree()");
		}

		this.events[2] = new drlEvent("onclick", "drlOnToggleDoc()");
		this.events[3] = new drlEvent("onclick", "drlClickTreeNode()");

		if(drlDrillObj.mode == "explorer")
			this.keyNodes = line.getElementsByTagName("KEYFLDS").item(0);
	
		if (this.callType == "CMT" || this.callType == "URL")
		{
			this.attach = true;
			this.hasAttachment = (idaCall.getAttribute("attachment") == "true");
			this.viewMode = (this.hasAttachment) ? "attachment" : "list";
			this.isLeafNode = (this.hasAttachment);
			this.convertReport = (!this.hasAttachment);
			// remove extra trailing ampersand; causes problems with dataStorage
		    if (this.idaCall.charAt(this.idaCall.length-1) == "&")
		        this.idaCall = this.idaCall.substr(0, this.idaCall.length-1);
			this.idaCall = (this.idaCall.indexOf("_ECODE") == -1) 
					? this.idaCall + "&_ECODE=FALSE" 
					: this.idaCall;
			this.idaCall = (this.idaCall.indexOf("_ATTR") == -1) 
					? this.idaCall + "&_ATTR=TRUE" 
					: this.idaCall;
			this.idaCall = (this.idaCall.indexOf("_AOBJ") == -1) 
					? this.idaCall + "&_AOBJ=TRUE" 
					: this.idaCall;								

			if (this.hasAttachment)
				this.attachment.populate(line);
		}
	}
	this.setImage();
	this.expandedImage = (this.isLeafNode || this.isSecure || this.isProtected) 
			? drlDrillObj.leafImage 
			: drlDrillObj.collapsedImage;
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.populateAttachment = function(blnCmtAttach)
{
	this.text = (blnCmtAttach) ? "Comment" : "Url";
	this.idaCall = drlDrillObj.idaCall;
	this.callType = (blnCmtAttach) ? "CMT" : "URL";

	this.image = drlDrillObj.closedFolder;
	this.expandedImage = drlDrillObj.collapsedImage;
	this.events[0] = new drlEvent("onfocus", "drlOnFocusTree()");
	this.events[1] = new drlEvent("onblur", "drlOnBlurTree()");
	this.events[2] = new drlEvent("onclick", "drlOnToggleDoc()");
	this.events[3] = new drlEvent("onclick", "drlClickTreeNode()");
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.refresh = function()
{
	this.tree.hideAll();
	this.tree.nodes = new Array();
	this.list.nodes = new Array();
	this.visited = false;
	this.select();
	drlSetFocusBorder(true);
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.render = function(elem)
{
	var className = (this.parentTree == "0") ? "DrillTreeContainerRoot" : "DrillTreeContainer";
	var container = drlAppendNode("div", elem, className);
	var treeBody = new drlPortalWnd.StringBuilder();
		
	treeBody.append("<DIV id=\"" + this.id + "\" class=\"DrillTreeCursor\" ");
	treeBody.append("index=\"" + this.index + "\" parentTree=\"" + this.parentTree + "\" ");
	treeBody.append("isSecure=\"" + this.isSecure + "\" ");
	treeBody.append("selected=\"" + this.selected + "\">");

	// expanded/collapsed/leaf image
	treeBody.append("<NOBR><SPAN class=\"DrillTreeExpandImage\">");
	treeBody.append("<IMG id=\"tx" + this.id + "\" src=\"" + this.expandedImage + "\" align=\"absMiddle\" ");
	
	// event for expand/collapse/leaf image
	if (!this.isSecure && !this.isLeafNode && this.events[2])
		treeBody.append(this.events[2].toString());

	// folder/document image
	treeBody.append("></SPAN><SPAN class=\"DrillTreeImage\">");
	treeBody.append("<IMG id=\"ti" + this.id + "\" src=\"" + this.image + "\" align=\"absBottom\" ");

	// event for folder/document image
	if (!this.isSecure && this.events[3])
		treeBody.append(this.events[3].toString());

	// folder/document text
	className = (this.selected) 
			? "DrillTreeTextSelected" 
			: ((this.isSecure) ? "DrillTreeTextSecure" : "DrillTreeText");

 	treeBody.append("></SPAN><BUTTON id=\"tn" + this.id + "\" class=\"" + className + "\" ");
	treeBody.append("tabIndex=\"-1\" hidefocus ");

	// event for folder/document text
	if (!this.isSecure && this.events[0])
		treeBody.append(this.events[0].toString());

	if (!this.isSecure && this.events[1])
		treeBody.append(this.events[1].toString());

	if (!this.isSecure && this.events[3])
		treeBody.append(this.events[3].toString());
	
	treeBody.append(">" + drlPortalWnd.xmlEncodeString(this.text) + "&nbsp;</BUTTON></NOBR></DIV>");
	treeBody.append("<DIV id=\"insertPoint\" class=\"insertPoint\" style=\"display:none\"></DIV>");

	container.innerHTML = treeBody.toString();

	this.tree.render(document.getElementById(this.id));

	if(drlDrillObj.selectedTreeNode)
		drlSetTitle(drlDrillObj.selectedTreeNode.title);
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.reSelect = function()
{
	var parentTreeNode = this.getParentTreeNode();
	if (drlDrillObj.treeHasFocus)
	{
		drlDrillObj.selectTreeNode(parentTreeNode);
		drlSetFocusBorder(true);
	}
	else
		parentTreeNode.list.reSelect(this.index);
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.secure = function()
{
	this.selected = false;
	this.visited = false;
	this.expanded = false;
	this.isSecure = true;
	this.expandedImage = drlDrillObj.leafImage;
	this.setImage();
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.select = function()
{
	if (this.isLeafNode)
		this.show();
	else
	{
		if (!this.visited)
		{
			drlDrillObj.refreshObject = this;
			drlDrillObj.refreshCallback = "drlDrillObj.refreshObject.selectComplete";
			drlDrillObj.refresh(this.idaCall);
		}
		else
		{
			this.expandParentTree();
			this.list.render();
			drlDrillObj.selectTreeNode(this);
			this.update();
			drlSetTitle(this.title);
		}
	}
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.selectComplete = function(bRefreshOk)
{
	var bConvert = false;
	drlDrillObj.clearRefresh();
	if (bRefreshOk)
	{
		if (this.convertReport)
			bConvert = this.doConvert();

		// empty directory
		if (!bConvert && this.callType == "KR")
		{
			this.expandParentTree();
			this.collapseTreeList();
			drlDrillObj.setMessage("");
		}
		else
		{	
			this.tree.populate();
			this.list.populate();
			var elem = this.getElement();
			this.tree.render(elem.nextSibling);
			this.expandParentTree();
			this.collapseTreeList();
			drlDrillObj.setMessage("");
		}
	}
	else
	{
		drlDrillObj.setMessage("");
		if (drlDrillObj.noRecs)
			this.noRecordsError();
	}
	drlSetTitle(this.title);
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.setCollapse = function()
{
	this.expandedImage = (this.tree.nodes.length > 0) 
			? drlDrillObj.collapsedImage 
			: drlDrillObj.leafImage;
	this.expanded = false;
	this.visited = true;
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.setExpand = function()
{
	this.expandedImage = (this.tree.nodes.length > 0) 
			? drlDrillObj.expandedImage 
			: drlDrillObj.leafImage;
	this.expanded = true;
	this.visited = true;
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.setImage = function()
{
	this.image = (this.isLeafNode)
			? drlDrillObj.documentImage
			: (this.isSecure) ? drlDrillObj.secureFolder
			: (this.selected) ? drlDrillObj.openFolder : drlDrillObj.closedFolder;
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.setTitle = function(idaLoad)
{
	var title;
	switch (drlDrillObj.mode)
	{
		case "list":
			title = this.text;
			if (idaLoad)
			{
				var idaRet = idaLoad.document.getElementsByTagName("IDARETURN");
				title = idaRet[0].getAttribute("title");
				if (title == "")
					title = this.text;
			}

			if (drlDrillObj.oReqFields.reqFlds.length > 0)
				this.title = drlPortal.getPhrase("LBL_STEP") + " " + 
						drlDrillObj.oReqFields.reqFlds[drlDrillObj.reqCurrentIndex].pos +
						" " + drlPortal.getPhrase("LBL_OF") + " " + 
						drlDrillObj.oReqFields.reqFlds.length + ": " + 
						drlPortal.getPhrase("LBL_SELECT") + " " + title;
			break;

		case "select":
			title = this.text;
			if (idaLoad)
			{
				var idaRet = idaLoad.document.getElementsByTagName("IDARETURN");
				title = idaRet[0].getAttribute("title");
				if (title == "")
					title = this.text;
			}
			this.title = 
				(title.toLowerCase() == "root" || title == null || title.length < 1)
				? drlPortal.getPhrase("LBL_DRILL_SELECT")
				: title;
			break;

		case "explorer":
				this.title = drlPortal.getPhrase("LBL_DRILL_EXPLORER");
			break;

		case "attachment":
			this.title = drlPortal.getPhrase("LBL_ATTACHMENTS");
			break;
	}
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.show = function()
{
	if (this.viewMode == "list")
	{
		if (this.isLeafNode)
			this.showList();
		else
			this.expandList();
	}
	else
		this.showAttachment();
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.showAttachment = function()
{
	if (this.attachment.isAdd)
	{
		this.visited = true;
		this.expandParentTree();
		drlDrillObj.selectTreeNode(this);
		this.attachment.render(this.parentTree, this.index);
		this.update();
	}
	else
	{
		drlDrillObj.refreshObject = this;
		drlDrillObj.refreshCallback = "drlDrillObj.refreshObject.showAttachmentComplete";
		this.idaCall += drlDrillObj.bIsIE ? "&_AESC=IE" : "&_AESC=NS";		
		drlDrillObj.refresh(this.idaCall);
	}
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.showAttachmentComplete = function(bRefreshOk)
{
	drlDrillObj.clearRefresh();
	if (!bRefreshOk) return;

	this.convertChangeReport();
	var line = drlDrillObj.idaLoad.document.getElementsByTagName("LINE").item(0);
	this.attachment.populate(line);

	this.visited = true;
	this.expandParentTree();
	drlDrillObj.selectTreeNode(this);
	this.attachment.render(this.parentTree, this.index);
	this.update();
	drlDrillObj.setMessage("");
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.showList = function()
{

	if (!this.visited)
	{
		drlDrillObj.refreshObject = this;
		drlDrillObj.refreshCallback = "drlDrillObj.refreshObject.showListComplete";
		drlDrillObj.refresh(this.idaCall);
	}
	else
	{
		drlDrillObj.selectTreeNode(this);
		this.list.render();
		this.update();
	}
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.showListComplete = function(bRefreshOk)
{
	drlDrillObj.clearRefresh();
	this.list.style = 1;
	this.list.hideColumnHeader = true;
	if (bRefreshOk)
	{
		this.list.populate();
		this.visited = true;
	}

	drlDrillObj.selectTreeNode(this);
	this.list.render();
	this.update();
	
	if (bRefreshOk)
		drlDrillObj.setMessage("");
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.showTree = function()
{
	if (this.isLeafNode)
		this.showList();
	else
	{
		if (this.expanded)
			this.collapseTree();
		else
			this.expandTree();
	}
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.showTreeList = function()
{
	if (this.viewMode == "list")
	{
		if (this.isLeafNode)
			this.showList();
		else
			this.expandTreeList();
	}
	else
		this.showAttachment();
	drlSetFocusBorder(true);
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.switchSides = function()
{
	var elem = this.getElement();
	if (elem)
	{
		var node = document.getElementById("tn" + this.id);
		node.className = "DrillTreeTextUnselected";
	}
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.update = function()
{
	var elem = this.getElement();
	if (elem)
	{
		elem.setAttribute("selected", this.selected);
		elem.setAttribute("isSecure", this.isSecure);

		var node = document.getElementById("ti" + this.id);
		node.setAttribute("src", this.image);

		node = document.getElementById("tx" + this.id);
		node.setAttribute("src", this.expandedImage);

		node = document.getElementById("tn" + this.id);
		node.className = this.selected
			? "DrillTreeTextSelected"
			: ((this.isSecure) ? "DrillTreeTextSecure" : "DrillTreeText");

		var tabIndx = (this.selected) 
				? (this.isSecure) ? "-1" : "1" 
				: "-1";
		node.setAttribute("tabIndex", tabIndx);
		node.firstChild.nodeValue = this.text;
		try {
			if (this.selected)
				node.focus();
		} catch(e) { }

		elem.nextSibling.style.display = 
				(this.expanded && elem.nextSibling.hasChildNodes()) 
					? "block" : "none";
	}
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.updateTree = function()
{
	var elem = this.getElement();
	if (elem)
	{
		elem.setAttribute("selected", this.selected);
		elem.setAttribute("isSecure", this.isSecure);

		var node = document.getElementById("ti" + this.id);
		node.setAttribute("src", this.image);

		node = document.getElementById("tx" + this.id);
		node.setAttribute("src", this.expandedImage);

		node = document.getElementById("tn" + this.id);
		node.className = this.selected
				? "DrillTreeTextSelected"
				: ((this.isSecure) ? "DrillTreeTextSecure" : "DrillTreeText");

		var tabIndx = (this.selected) 
				? (this.secure) ? "-1" : "1" 
				: "-1";
		node.setAttribute("tabIndex", tabIndx);
		node.firstChild.nodeValue = this.text;
		elem.nextSibling.style.display = 
				(this.expanded && elem.nextSibling.hasChildNodes()) 
					? "block" : "none";
	}
}

//-----------------------------------------------------------------------------
drlTreeNode.prototype.unselect = function()
{
	this.selected = false;
	this.setImage();
}

//-----------------------------------------------------------------------------
function drlList()
{
	this.parentTree = null;
	this.siblingTree = null;
	this.selectedItem = null;
	this.parentTreeNode = null;
	this.hideColumnHeader = false;
	this.search = null;					//search options for list driven
	this.knowledge = false;
	this.style = 0;
	this.hasIdaCalls = false;
	this.nodes = new Array();
	this.columnHeaders = new Array();
	this.events = new Array();
	this.navigate = new drlNavigate();
	this.findStorage = null;
}

//-----------------------------------------------------------------------------
drlList.prototype.addNode = function(line)
{
	var listNode = new drlListNode();
	listNode.populate(line, this.columnHeaders);
	listNode.index = this.nodes.length;
	this.nodes[this.nodes.length] = listNode;
}

//-----------------------------------------------------------------------------
drlList.prototype.append = function()
{
	// Append additional list nodes
	var lNodes = drlDrillObj.idaLoad.document.getElementsByTagName("LINE");
	var len = lNodes.length;
	for (var x=0; x<len; x++)
		this.addNode(lNodes[x]);
}

//-----------------------------------------------------------------------------
drlList.prototype.checkIdaCalls = function()
{
	this.hasIdaCalls = false;
	if (!drlDrillObj.idaLoad) return;
	var nodes = drlDrillObj.idaLoad.document.getElementsByTagName("IDACALL");
	var len = nodes.length;
	for	(var i=0; i<len; i++)
	{
		var idaCall = nodes[i];
		if (idaCall.hasChildNodes())
		{
			var childLen = idaCall.childNodes.length;
			for (var x=0; x<childLen; x++)
			{
				if (idaCall.childNodes[x].nodeValue.indexOf("TYP=") != -1)
				{
					// found a valid call
					this.hasIdaCalls = true;
					return;
					break;
				}
			}
		}
	}
}

//-----------------------------------------------------------------------------
drlList.prototype.getSelectableNode = function(index)
{
	var node = this.nextSelectableNode(index);
	if (node != null)
		return node;
	else
	{
		node = this.prevSelectableNode(index);
		if (node != null)
			return node;
	}
	return null;
}

//-----------------------------------------------------------------------------
drlList.prototype.nextSelectableNode = function(index)
{
	index = (index == -1) ? 0 : index+1;
	for	(var i=index; i<this.nodes.length; i++)
	{
		if (!this.nodes[i].isSecure && this.nodes[i].visible)
			return this.nodes[i];
	}
	return null;
}

//-----------------------------------------------------------------------------
drlList.prototype.populate = function()
{
	this.checkIdaCalls();
	drlPopulateColumnHeaders(this);
	this.navigate.populate();
	drlSetFindFields(this);

	// Get line nodes
	var lNodes = drlDrillObj.idaLoad.document.getElementsByTagName("LINE");
	var oneOnlyNode = drlDrillObj.idaLoad.document.getElementsByTagName("OneOnly");
	var isOneOnly = false;
	
	var tree = drlDrillObj.treeArray[this.parentTree];
	var treeNode = tree.nodes[this.parentTreeNode];
	
	if (oneOnlyNode.length > 0 && drlDrillObj.mode == "attachment")
	{
		isOneOnly = oneOnlyNode[0].text == "T" ? true : false;
	}
	
	var len = lNodes.length;
	for (x=0; x<len; x++)
	{
		this.nodes[x] = new drlListNode();
		if (isOneOnly)
		{
			treeNode.isOneOnly = true;
			treeNode.getParentTreeNode().isOneOnly = true;
		}
		if (isOneOnly && len>1)
		{
			var colsNode = lNodes[x].getElementsByTagName("COLS")[0];
			if (colsNode)
			{
				var colNode = colsNode.getElementsByTagName("COL")[0];
				if (colNode)
				{
					var isAdd = (colNode.getAttribute("action") == "Add")
					if (isAdd)
						this.nodes[x].visible = false;
				}
			}
		}
		this.nodes[x].index = x;
		this.nodes[x].populate(lNodes[x], this.columnHeaders);

		if (this.selectedItem == null && !(this.nodes[x].isSecure))
			this.selectedItem = x;
	}
}

//-----------------------------------------------------------------------------
drlList.prototype.prevSelectableNode = function(index)
{
	for	(var i=index-1; 0<=i; i--)
	{
		if (!this.nodes[i].isSecure && this.nodes[i].visible)
			return this.nodes[i];
	}
	return null;
}

//-----------------------------------------------------------------------------
drlList.prototype.render = function()
{
	drlDrillObj.selectedListNode = null;
	drlDrillObj.blnSearch = false;
	var suffix = (drlDrillObj.bIsIE) ? "IE" : "NS";
	var col;
	var row;
	var listBody = new drlPortalWnd.StringBuilder();

	var listview = document.getElementById("drlListView");
	listview.className = "DrillListView";
	document.getElementById("drlAttachView").className = "DrillInvisible";

	var elemHeader = document.getElementById("drlHeader");
	var elemList = document.getElementById("drlList");
	var elemFooter = document.getElementById("drlFooter");

	elemHeader.className = "DrillInvisible";
	elemHeader.style.height = "0px";

	elemList.className = "";
	elemList.style.top = "0px";

	elemList.setAttribute("siblingTree", this.siblingTree);
	elemList.setAttribute("parentTree", this.parentTree);
	elemList.setAttribute("parentTreeNode", this.parentTreeNode);

	if (this.style == 1)
	{
		elemFooter.className = "DrillInvisible";
		elemFooter.style.height = "0px";

		elemList.className = "DrillList";
		var len = this.nodes.length;
		for	(row=0; row<len; row++)
		{
			listBody.append("<BR>");
			var colLen = this.nodes[row].columns.length;
			for	(col=0; col<colLen; col++)
				listBody.append(this.nodes[row].columns[col].header + " ");
		}
		elemList.innerHTML = "<PRE class=\"ptFixed\">" + listBody.toString() + "</PRE>";
		drlDoResize(null, false);
	}
	else if (this.style == 0)
	{
		// build column headers
		var colHeading = new drlPortalWnd.StringBuilder();

		if (!this.hideColumnHeader)
		{
			var colLen = this.columnHeaders.length;
			if (colLen > 0)
			{
				drlDrillObj.blnSearch = true;
				elemHeader.className = "DrillListHeader";
				elemList.style.top = "20px";

				// extra column for hidden selector
				colHeading.append("<TR><TD class=\"DrillRowSelectorCell\"> </TD>");

				// extra column for image
				colHeading.append("<TD class=\"DrillListImage\"> </TD>");

				for (col=0; col<colLen; col++)
				{
					var nodeCol = this.columnHeaders[col];
					colHeading.append("<TD class=\"DrillListHead"  + nodeCol.alignment + "\" "
							+ ((col == 0) ? "" : "style=\"border-left:solid lightgrey 1px;\" ")
							+ "noWrap=\"true\">");
					colHeading.append("<NOBR id=\"colHd" + col + "\">&nbsp;"
							+ nodeCol.header + "&nbsp;</NOBR></TD>");	
				}

				// begin separator row - column for hidden selector
				colHeading.append("</TR><TR><TD class=\"DrillRowSelectorCell\"> </TD>");
				// column for HRule
				colHeading.append("<TD class=\"DrillHRule\" colspan=\"" + (colLen + 1) + "\" " 
						+ "bgColor=\"darkgray\"></TD></TR>");
			}
		}

		// build rows of columns
		var lbl_select = drlPortal.getPhrase("LBL_SELECT");
		var len = this.nodes.length;
		var rowCtr = -1;

		for	(row=0; row<len; row++)
		{
			var nodeRow = this.nodes[row];
			if (!nodeRow.isSecure && nodeRow.visible)
			{
				var rowId = "r" + ++rowCtr;
				var strText = "";
				var colLen = nodeRow.columns.length;
				var evtLen = nodeRow.events.length;

				// building column body first because strText is needed in selector column
				var columns = new drlPortalWnd.StringBuilder();

				for (col=0; col<colLen; col++)
				{
					var nodeRowCol = nodeRow.columns[col];
					columns.append("<TD id=\"" + rowId + "c" + (col + 2) + "\" "
							+ "class=\"DrillListView" + nodeRowCol.alignment + "\" "
							+ ((col == 0) ? "" : "style=\"border-left:solid lightgrey 1px;\" ")
							+ ">");

					var alignCol = drlPortalWnd.xmlEncodeString(nodeRowCol.header);
					alignCol = (nodeRowCol.alignment == "left")
							? alignCol.replace(/^\s+/g,"&nbsp;")
							: alignCol.replace(/\s+$/g,"&nbsp;");
					columns.append("<NOBR>&nbsp;" + alignCol + "&nbsp;</NOBR></TD>");
					strText += " " + nodeRowCol.header;
				}

				listBody.append("<TR id=\"" + rowId + "\" " 
						+ "class=\"" + ((rowCtr % 2 == 0) ? "DrillRowEven" : "DrillRowOdd") + "\" "
						+ "index=\"" + nodeRow.index + "\" ");

				for (ev=2; ev<evtLen; ev++)
					listBody.append(nodeRow.events[ev].toString());
	
				// extra column for the hidden selector
				var rowColId = rowId + "c0";
				listBody.append("><TD id=\"" + rowColId + "\" " 
						+ "class=\"DrillRowSelectorCell\" hidefocus ");

				listBody.append("><BUTTON id=\"A" + rowColId + "\" "
						+ "class=\"DrillRowSelector" + suffix + "\" hidefocus "
						+ "title=\"" + lbl_select + strText + "\" tabIndex=\"-1\" ");

				// focus event for hidden selector
				if (nodeRow.events[0])
					listBody.append(nodeRow.events[0].toString());

				// blur event for hidden selector
				if (nodeRow.events[1])
					listBody.append(nodeRow.events[1].toString());

				listBody.append("onclick=\"return false;\">&nbsp;</BUTTON></TD>");

				// extra column for the image
				listBody.append("<TD id=\"" + rowId + "c1\">");
				if (colLen > 0 && nodeRow.columns[0].image != "")
					listBody.append("<IMG class=\"DrillListImage\" "
						+ "src=\"" + nodeRow.columns[0].image + "\" align=\"right\"></TD>");
				else
					listBody.append("&nbsp;</TD>");

				listBody.append(columns.toString() + "</TR>");
			}
		}

		// display body
		elemList.className = "DrillList";
		elemList.innerHTML = "<DIV id=\"drlListScroll\"><TABLE id=\"ListViewTable\" " 
				+ "class=\"DrillListViewTable\" border=\"0\" " 
				+ "cellspacing=\"0\" cellpadding=\"2\">"
				+ "<TBODY id=\"drlTblBody\" totalRows=\"" + rowCtr + "\">" 
				+ listBody.toString() + "</TBODY><TFOOT style=\"visibility:hidden\">" 
				+ colHeading.toString() + "</TFOOT></TABLE></DIV>";

		// display column headers
		if (!this.hideColumnHeader)
		{
			if (this.columnHeaders.length > 0)
			{
				var strHeader = "<TABLE class=\"DrillListViewTable\" border=\"0\" " 
					+ "cellSpacing=\"0\" cellPadding=\"2\">"
					+ "<THEAD>" + colHeading.toString() + "</THEAD>"
					+ "<TBODY style=\"visibility:hidden\">" + listBody.toString() + "</TBODY>"
					+ "</TABLE>";

				// remove ids so column header table is not referenced
				strHeader = strHeader.replace(/id=/g, "xid=");
				elemHeader.innerHTML = strHeader;
			}
		}

		this.navigate.setPage(elemFooter, rowCtr, true);

		if (rowCtr > -1)
		{
			if (drlDrillObj.mode == "select" || drlDrillObj.mode == "list" || drlDrillObj.mode == "genlist")
				setTimeout("drlHighlightRow(0,0)", 10);
			else
				drlHighlightRow(0, 0, false);	// resolves issue when focus is at bottom of list

			drlDoResize(null, false);
		}

		else
		{
			elemHeader.innerHTML = "";
			elemList.innerHTML = "";
		}
	}
	drlSetToolBar(this);
}

//-----------------------------------------------------------------------------
drlList.prototype.reSelect = function(index)
{
	var node = this.getSelectableNode(index);
	if (node != null)
	{
		drlDrillObj.selectListNode(node);
		drlSetFocusBorder(false);
	}
	else
	{
		drlDrillObj.selectedListNode = null;
		drlSetFocusBorder(true);
	}
}

//-----------------------------------------------------------------------------
drlList.prototype.setViewOptions = function()
{
	var rowCtr = -1;
	var viewStr = drlPortal.getPhrase("LBL_VIEW_OPTIONS");
	var len = this.nodes.length;

	for	(var row=0; row<len; row++)
	{
		if (this.nodes[row].type != "SL")
		{
			drlRemoveNavlet("drlViews");
			return;
		}
		if (!this.nodes[row].isSecure && this.nodes[row].visible)
		{
			if (!drlDrillObj.oViews)
			{
				drlDrillObj.oViews = document.getElementById("drlViewSelect");
				drlDrillObj.oViews.className = "DrillViewSelect";

				if (!window.oDropView)
					window.oDropView = new window.Dropdown(drlPortalWnd);
				window.oDropView.clearItems();
			}
			window.oDropView.addItem(this.nodes[row].columns[0].header,
				++rowCtr + "|" + this.nodes[row].index + "|" + this.siblingTree); 
		}
	}

	if (this.selectedItem != null && drlDrillObj.oViews)
		drlClickViewOption(0, this.selectedItem, this.siblingTree);
}

//-----------------------------------------------------------------------------
function drlListNode()
{
	this.index = null;
	this.treeSibling = null;
	this.isSecure = false;
	this.isProtected = false;
	this.selected = false;
	this.visible = true;
	this.knowledge = false;
	this.isAttachment = false;
	this.type = "";
	this.idaCall = "";
	this.keyNodes = null;
	this.columns = new Array();
	this.events = new Array();
}

//-----------------------------------------------------------------------------
drlListNode.prototype.getElement = function()
{
	return drlFindCurrentRow();
}

//-----------------------------------------------------------------------------
drlListNode.prototype.hide = function()
{
	this.visible = false;
}

//-----------------------------------------------------------------------------
drlListNode.prototype.populate = function(line, colHdr)
{
	var align;
	var image;
	var node;
	var idaNode = line.getElementsByTagName("IDACALL").item(0);

	if (idaNode.hasChildNodes())
	{
		var idaCall = idaNode.firstChild.nodeValue;

		if (idaCall && idaCall.length > 0)
			this.idaCall = idaCall;
		else
			this.idaCall = "";
	}
	else
		this.idaCall = "";

	switch (drlDrillObj.mode)
	{
		case "list":
		case "select":
		case "genlist":
			this.type = drlSetCallType(false);
			break;

		default:
			this.type = idaNode.getAttribute("type");
			this.idaCall = drlPortalWnd.trim(this.idaCall);
			this.isSecure = (this.idaCall.length == 0 || this.type.length == 0);
			this.isProtected = (this.type == "OS" && this.idaCall.length == 0);
			this.isSecure = (this.isProtected) ? false : this.isSecure;
			break;
	}

	switch (drlDrillObj.mode)
	{
		// falls through to break
		case "select":
		case "list":
		case "genlist":
			if (this.type == "OS")
				this.keyNodes = line.getElementsByTagName("KEYFLDS").item(0);
			break;
	}

	var cNodes = line.getElementsByTagName("COL");

	var len = cNodes.length;
	for (var col=0; col<len; col++)
	{
		node = cNodes[col];
		this.columns[col] = new drlColumn();

		if (colHdr.length > 0)
			align = (colHdr[col].alignment == "") ? "left" : colHdr[col].alignment;
		else
			align = "left";

		if (col == 0)
		{
			// document / folder image
			switch (this.type)
			{
				case "SL":
					if (drlDrillObj.mode == "select" || drlDrillObj.mode == "genlist")
						image = drlDrillObj.closedFolder;
					else
				 		image =	"";
					break;

				// falls through to break
				case null:
			 	case "KR":
			 	case "OS":
				case "OV":
					if (drlDrillObj.mode == "select" 
							|| drlDrillObj.mode == "list" 
							|| drlDrillObj.mode == "genlist"
							|| (drlDrillObj.mode == "explorer" && this.isProtected))
				 		image =	"";
					else
						image = drlDrillObj.closedFolder;
			 		break;

				case "OW":
				case "KRf":
				case "OPN":
					image =	drlDrillObj.documentImage;
					break;

				case "CMT":
				case "URL":
					this.isAttachment = (idaNode.getAttribute("attachment") == "true");
					image =	this.isAttachment 
							? drlDrillObj.documentImage 
							: drlDrillObj.closedFolder;
					break;

				default:
					image = "";
					break;
			}
		}
		else
			image = "";

		// events
		this.events[0] = new drlEvent("onfocus", "drlOnFocusList()");
		this.events[1] = new drlEvent("onblur", "drlOnBlurList()");

		switch (this.type)
		{
		 	case "OS":
				if (drlDrillObj.mode == "select" || drlDrillObj.mode == "genlist")
					this.events[2] = new drlEvent("onclick", "drlClickRowClose()");
				else if (drlDrillObj.mode == "explorer" && !this.isProtected)
					this.events[2] = new drlEvent("onclick", "drlClickRow()");
				else if (drlDrillObj.mode == "list")
					this.events[2] = new drlEvent("onclick", "drlClickListRow()");
		 		break;

		 	case "KRf":
		 	case "OPN":
				break;
			case null:
				break;
			// SL, OW, OV, KR, CMT, URL, any others
			default:
				this.events[2] = new drlEvent("onclick", "drlClickRow()");
				break;
		}
		this.columns[col].populate(node.firstChild.nodeValue, "", align, image, "");
	}

}

//-----------------------------------------------------------------------------
drlListNode.prototype.switchSides = function()
{
	var elem = this.getElement();
	if (elem)
		elem.className = "DrillRowUnselected";
}

//-----------------------------------------------------------------------------
drlListNode.prototype.unselect = function()
{
	this.selected = false;
}

//-----------------------------------------------------------------------------
drlListNode.prototype.update = function()
{
	var elem = this.getElement();
	if (elem)
	{
		var row = parseInt(elem.id.replace("r", ""));
		drlHighlightRow(row, row);
	}
}

//-----------------------------------------------------------------------------
function drlColumn()
{
	this.header = "";
	this.name = "";
	this.alignment = "";
	this.width = "";
	this.image = "";
}

//-----------------------------------------------------------------------------
drlColumn.prototype.populate = function(header, name, alignment, image, width)
{
	this.header = (typeof(header) == "undefined") ? "" : header;
	this.name = (typeof(name) == "undefined") ? "" : name;
	this.alignment = (typeof(alignment) == "undefined") ? "" : alignment;
	this.image = (typeof(image) == "undefined") ? "" : image;
	this.width = (typeof(width) == "undefined") ? "" : width;
}

//-----------------------------------------------------------------------------
drlColumn.prototype.update = function(header, name, alignment, image, width)
{
	if (typeof(header)!="undefined" && header!=null)
		this.header = header;

	if (typeof(name)!="undefined" && name!=null)
		this.name = name;

	if (typeof(alignment)!="undefined" && alignment!=null)
		this.alignment = alignment;

	if (typeof(image)!="undefined" && image!=null)
		this.image = image;

	if (typeof(width)!="undefined" && width!=null)
		this.width = width;
}

//-----------------------------------------------------------------------------
function drlNavigate()
{
	this.prevPage = "";
	this.nextPage = "";
	this.findNext = "";
	this.startCount = 0;
	this.totalCount = 0;
	this.isFind = false;
	this.page = "first";			// [ first | next | prev ]
}

//-----------------------------------------------------------------------------
drlNavigate.prototype.checkValue = function(val)
{
	return (typeof(val) == "undefined") ? "" : val;
}

//-----------------------------------------------------------------------------
drlNavigate.prototype.decrement = function(count)
{
	this.totalCount = this.startCount - 1;
	this.startCount = this.totalCount - count;
}

//-----------------------------------------------------------------------------
drlNavigate.prototype.first = function(count)
{
	this.startCount = 1;
	this.totalCount = this.startCount + count;
}

//-----------------------------------------------------------------------------
drlNavigate.prototype.increment = function(count)
{
	this.startCount = this.totalCount + 1;
	this.totalCount = this.startCount + count;
}

//-----------------------------------------------------------------------------
drlNavigate.prototype.populate = function()
{
	this.nextPage = this.checkValue(drlDrillObj.idaLoad.getElementValue("NEXTPAGE"));
	this.prevPage = this.checkValue(drlDrillObj.idaLoad.getElementValue("PREVPAGE"));
	this.findNext = this.checkValue(drlDrillObj.idaLoad.getElementValue("FINDNEXT"));

	this.nextPage = drlPortalWnd.cmnRemoveVarFromString("RECSTOGET", this.nextPage);
	this.prevPage = drlPortalWnd.cmnRemoveVarFromString("RECSTOGET", this.prevPage);
	this.findNext = drlPortalWnd.cmnRemoveVarFromString("RECSTOGET", this.findNext);
}

//-----------------------------------------------------------------------------
drlNavigate.prototype.setButton = function(direction, bDisable, bRecords)
{
	direction = direction.toLowerCase();

	if (typeof(bDisable) != "boolean")
		bDisable = true;

	if (typeof(bRecords) != "boolean")
		bRecords = false;

	var phrase = "";
	switch (direction)
	{
		case "prev":
			phrase = drlPortal.getPhrase("LBL_PREVIOUS");
			break;

		case "next":
			phrase = drlPortal.getPhrase("LBL_NEXT");
			break;
	}

	var btn = document.getElementById("drlBtn" + direction);
	btn.title = (bDisable) 
		? "" 
		: phrase + ((bRecords) 
			? " " + drlDrillObj.nbrRecords 
			: "");
	btn.value = phrase + ((bRecords) 
			? " " + drlDrillObj.nbrRecords 
			: "");
	btn.disabled = bDisable;
	btn.className = (bDisable) ? "anchorDisabled" : "anchorActive";
}

//-----------------------------------------------------------------------------
drlNavigate.prototype.setPage = function(footer, count, bRecords)
{
	if (drlDrillObj.mode == "attachment")
	{
		footer.className = "DrillInvisible";
		footer.style.height = "0px";
	}
	else
	{
		var page = this.page.toLowerCase();
		var drlCount = document.getElementById("drlCount");
		if (this.isFind)
		{
			bRecords = false;
			document.getElementById("drlRecordsSelect").className = "DrillInvisible";
			document.getElementById("drlRecordsCount").className = "DrillInvisible";
		}
		else
		{
			if (drlDrillObj.recsDisabled)
				document.getElementById("drlRecordsSelect").className = "DrillInvisible";
			else
				document.getElementById("drlRecordsSelect").className = "DrillLabelSmall";

			document.getElementById("drlRecordsCount").className = "";
			switch (page)
			{
				case "first":
					this.first(count);
					break;

				case "next":
					this.increment(count);
					break;

				case "prev":
					this.decrement(count);
					break;
			}
			drlCount.firstChild.nodeValue = drlPortal.getPhrase("LBL_RECORDS") 
				+ " " + this.startCount + " - " + this.totalCount;
		}

		footer.className = "DrillListFooter";
		footer.style.height = "23px";
		this.setButton("prev", (this.prevPage == ""), bRecords);
		this.setButton("next", (this.nextPage == ""), bRecords);

		var elem = document.getElementById("drlSelectRecords");
		if (!drlDrillObj.recsDisabled 
				&& count+1 < elem.options[0].value 
				&& page == "first")
			elem.disabled = true;
		else
			elem.disabled = false;
	}
}

//-----------------------------------------------------------------------------
function drlAttachment()
{
	this.isComment = true;
	this.isEmail = false;
	this.isAdd = false;
	this.action = null;
   	this.title = null;
	this.text = null;
	this.crtDate = "";
	this.crtTime = "";
	this.modDate = "";
	this.modTime = "";
	this.attCreator = "";
	this.attModifier = "";
}

//-----------------------------------------------------------------------------
drlAttachment.prototype.populate = function(line)
{
	var idaCall = line.getElementsByTagName("IDACALL").item(0);
	this.isComment = (idaCall.getAttribute("type") == "CMT");
	this.isEmail = (idaCall.getAttribute("email") == "true");
	var col = line.getElementsByTagName("COL").item(0);
	this.action = col.getAttribute("action");
	this.isAdd = (this.action == "Add");
	this.title = (this.isAdd) ? "" : col.firstChild.nodeValue;

	if (line.getElementsByTagName("CRTDATE").item(0))
	{
		this.crtDate = line.getElementsByTagName("CRTDATE").item(0).firstChild.nodeValue;
		this.crtTime = line.getElementsByTagName("CRTTIME").item(0).firstChild.nodeValue;
		this.modDate = line.getElementsByTagName("MODDATE").item(0).firstChild.nodeValue;
		this.modTime = line.getElementsByTagName("MODTIME").item(0).firstChild.nodeValue;
		this.attCreator = line.getElementsByTagName("ATTCREATOR").item(0).firstChild.nodeValue;
		this.attModifier = line.getElementsByTagName("ATTMODIFIER").item(0).firstChild.nodeValue;
	}

	if (this.isAdd)
		this.text = (this.isComment) ? "" : ((this.isEmail) ? "mailto:" : "http://");
	else
	{
		var attachment = line.getElementsByTagName("ATTACHMENT").item(0);
		this.text = 
			(attachment==null || attachment.hasChildNodes()==false) 
			? "" 
			: attachment.firstChild.nodeValue;
	}
}

//-----------------------------------------------------------------------------
drlAttachment.prototype.render = function(parentTree, treeNodeIndex)
{
	var attach = document.getElementById("drlAttachView");
	attach.setAttribute("parentTree", parentTree);
	attach.setAttribute("index", treeNodeIndex);
	attach.className = "DrillAttachView";
	document.getElementById("drlListView").className = "DrillInvisible";
	document.getElementById("lblTitle").firstChild.nodeValue = 
				drlPortal.getPhrase("LBL_TITLE") + ":";

    var table = document.getElementById("drlAttachTable");
	var title = document.getElementById("txtAttachTitle");
	title.value = this.title;
	var commentRow = document.getElementById("drlCommentRow");
	var commentLabelRow = document.getElementById("drlCommentLabelRow");	
	var urlRow = document.getElementById("drlUrlRow");
	var urlLabelRow = document.getElementById("drlUrlLabelRow");
	var btnRow = document.getElementById("drlAttachBtns");
	var cmdOpen = document.getElementById("cmdOpen");
	cmdOpen.value = drlPortal.getPhrase("LBL_OPEN");
	var cmdAddChg = document.getElementById("cmdAddChg");	
	var cmdDelete = document.getElementById("cmdDelete");
	btnRow.className = "";

	if (this.isComment)
	{
		commentLabelRow.className = "";
		commentRow.className = "";
		table.setAttribute("height", "98%");
		urlLabelRow.className = "DrillInvisible";
		urlRow.className = "DrillInvisible";
		cmdOpen.className = "DrillInvisible";	
		document.getElementById("lblCmtText").firstChild.nodeValue = 
				drlPortal.getPhrase("LBL_TEXT") + ": ";
	    var text = document.getElementById("txtCmtAttach");
		text.value = this.text;
		text.setAttribute("bFirst", "0");
	}
	else
	{
		commentLabelRow.className = "DrillInvisible";
		commentRow.className = "DrillInvisible";
		table.setAttribute("height", "");
		urlLabelRow.className = "";
		urlRow.className = "";
		cmdOpen.className = "DrillButton";
		document.getElementById("lblUrlText").firstChild.nodeValue = (this.isEmail) 
				? drlPortal.getPhrase("LBL_EMAIL") + ": " 
				: drlPortal.getPhrase("LBL_URL") + ": ";
		document.getElementById("cmdOpen").value = drlPortal.getPhrase("LBL_OPEN");
		var text = document.getElementById("txtUrlAttach");
		text.value = this.text;
		text.setAttribute("bFirst", "0");
 	}

	//if explorer, disable ability to add or modify comments
	if (drlDrillObj.mode == "explorer")
	{
		text.readOnly = "true";
		title.readOnly = "true";
		cmdAddChg.className = "DrillInvisible";
		cmdDelete.className = "DrillInvisible";	
	}

	if (this.crtDate.length > 0)
		document.getElementById("drlCreated").firstChild.nodeValue = drlPortal.getPhrase("LBL_CREATED") 
			+ " " + this.crtDate + " " + this.crtTime + " "
            + (this.attCreator.length > 0
			    ? drlPortal.getPhrase("LBL_BY") + " " + this.attCreator
                : "");
	else
		document.getElementById("drlCreated").firstChild.nodeValue = ""; 

	if (this.modDate.length > 0)
		document.getElementById("drlModified").firstChild.nodeValue = drlPortal.getPhrase("LBL_MODIFIED") 
			+ " " + this.modDate + " " + this.modTime + " "
            + (this.attModifier.length > 0 
                ? drlPortal.getPhrase("LBL_BY") + " " + this.attModifier
                : "");
	else
		document.getElementById("drlModified").firstChild.nodeValue = ""; 

	cmdAddChg.value = (this.isAdd)? drlPortal.getPhrase("LBL_ADD") : drlPortal.getPhrase("LBL_CHANGE");
	cmdDelete.value = drlPortal.getPhrase("LBL_DELETE");
	cmdDelete.disabled = (this.isAdd);
	drlDoResize(null, false);
}

//-----------------------------------------------------------------------------
function drlEvent(evt, functionName)
{
	this.evt = evt;
	this.functionName = functionName
}

//-----------------------------------------------------------------------------
drlEvent.prototype.toString = function()
{
	return this.evt + "=\"" 
			+ this.functionName.replace("()", "(window.event, this)") + "\" ";
}
//-----------------------------------------------------------------------------
function DrillAroundSelect(portalWnd, targetWnd, title, knb, keyfieldNode)
{
	this.drlPortalWnd = portalWnd;
	this.targetWnd = targetWnd; //drill select window
	this.btnTitle = title;
	this.knb = knb;
	this.keyFieldNode = keyfieldNode;
	
	this.keyValue = null;	
	this.wnd = null; //drillaround window
}
//-----------------------------------------------------------------------------
DrillAroundSelect.prototype.getKeyValue=function()
{
	if(!this.keyValue)
	{
		var keyVals = this.keyFieldNode.getElementsByTagName("KEYFLD");
		var loop = keyVals.length;
		
		for (var i=0; i < loop; i++)
		{
			var oKeyValue = keyVals[i];
			
			if (oKeyValue.getAttribute("keynbr") == this.knb && oKeyValue.hasChildNodes())
			{
				this.keyValue = this.drlPortalWnd.trim(oKeyValue.childNodes[0].nodeValue);
				break;
			}				
		}
	}
	
	return this.keyValue;
}
//-----------------------------------------------------------------------------
DrillAroundSelect.prototype.getBtnTitle=function()
{
	if(!this.keyValue)
		this.getKeyValue();
	
	var phraseAry = new Array;	
	phraseAry.push(this.drlPortalWnd.lawsonPortal.getPhrase("LBL_SELECT"));
	phraseAry.push(this.keyValue);
	phraseAry.push(this.drlPortalWnd.lawsonPortal.getPhrase("LBL_FROM"));
	phraseAry.push(this.btnTitle);
	phraseAry.push(this.drlPortalWnd.lawsonPortal.getPhrase("LBL_LIST"));
	
	var phrase = phraseAry.join(" ");	
	return phrase;
	
}
//-----------------------------------------------------------------------------
DrillAroundSelect.prototype.closeWindow=function()
{
	if(this.wnd)
	{
		this.wnd.close();
		this.wnd = null;
		return true;
	}
	
	return false;
}
//-----------------------------------------------------------------------------
DrillAroundSelect.prototype.doSelect=function()
{
	this.targetWnd.drlCloseReturn(this.keyFieldNode);
	return true;
}
//-- end of drill object code
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
function cntxtActionHandler(evt,action)
{
	if (action == null)		// called by the portal
	{
		action = drlPortalWnd.getFrameworkHotkey(evt, "drillobj");
		if (!action || action == "drillobj")
			return false;
	}

	var bHandled = false;
	switch (action)
	{
		case "doCancel":
			drlClose();
			bHandled = true;
			break;
		case "doContextMenu":
			drlContextMenu(evt, true);
			bHandled = true;
			break;
		case "doFormHelp":
			drlPortal.drill.callFormHelp();
	        drlPlaceFocus();	// form help sets focus to non-visible form field
			bHandled=true
			break;
		case "doNext":
			if (drlDrillObj.selectedTreeNode
					&& drlDrillObj.selectedTreeNode.viewMode == "list"
					|| drlDrillObj.mode == "genlist")
				drlNext();
			bHandled = true;
			break;
		case "doPageDn":
			if (drlDrillObj.bIsIE)
			{
				if (drlDrillObj.treeHasFocus)
				{
					document.getElementById("drlTree").doScroll("scrollbarPageDown");
					bHandled = true;
				}
				else if (drlDrillObj.mode == "genlist" 
				|| drlDrillObj.selectedTreeNode.viewMode == "list")
				{
					document.getElementById("drlList").doScroll("scrollbarPageDown");
					bHandled = true;
				}
			}
			break;
		case "doPageUp":
			if (drlDrillObj.bIsIE)
			{
				if (drlDrillObj.treeHasFocus)
				{
					document.getElementById("drlTree").doScroll("scrollbarPageUp");
					bHandled = true;
				}
				else if (drlDrillObj.mode == "genlist" 
				|| drlDrillObj.selectedTreeNode.viewMode == "list")
				{
					document.getElementById("drlList").doScroll("scrollbarPageUp");
					bHandled = true;
				}
			}
			bHandled = true;
			break;
		case "doPrev":
			if (drlDrillObj.selectedTreeNode
					&& drlDrillObj.selectedTreeNode.viewMode == "list"
					|| drlDrillObj.mode == "genlist")
				drlPrevious();
			bHandled = true;
			break;
		case "posInFirstField":
	        drlPlaceFocus();
			bHandled = true;
			break;
		case "posInToolbar":
			bHandled = drlPositionInToolbar();
			break;
		case "doSubmit":
			bHandled = drlDoEnterKey();
			break;
	}
	return bHandled;
}

function cntxtGetPrintContent()
{
	var elem = document.createElement("body");
	var sourceHTML = document.getElementById("drill").innerHTML;
	
	//hide non-printable items
	var nonPrintableElements = new Array()
	nonPrintableElements["drlToolBar"]="drlToolBar";
	nonPrintableElements["cmdAddChg"]="cmdAddChg";	
	nonPrintableElements["cmdDelete"]="cmdDelete";	
	nonPrintableElements["drlMsgOuter"]="drlMsgOuter";
	nonPrintableElements["drlTitleBarBtn"]="drlTitleBarBtn";
	nonPrintableElements["drlFooter"]="drlFooter";
	nonPrintableElements["drlSplitBar"]="drlSplitBar";
	nonPrintableElements["drlViewSelect"]="drlViewSelect";
	
	elem.innerHTML = sourceHTML;	

	var elemAry = elem.getElementsByTagName("*");	
	var loop = elemAry.length;

	for(var i = 0; i  < loop; i ++)
	{
		var elem1 = elemAry[i];
		//hide non-printable elements
		if(nonPrintableElements[elem1.id])
			elem1.className = "DrillInvisible";

		//do not allow input			
		elem1.readOnly = true;
		//disable events
		elem1.onhelp = null;
		elem1.onclick = null;
		elem1.ondblclick = null;
		elem1.onkeydown = null;
		elem1.onkeyup = null;
		elem1.onkeypress = null;
		elem1.onmouseout = null;
		elem1.onmouseover = null;
		elem1.onmousemove = null;
		elem1.onmousedown = null;
		elem1.onmouseup = null;
		elem1.onfocus = null;
		elem1.onblur = null;
		elem1.onselect = null;
	}		

	var container = elem.document.getElementById("drlWindow");
	var tree = elem.document.getElementById("drlTree");
	var listView = elem.document.getElementById("drlListView");
	var list = elem.document.getElementById("drlList");
	var elemHeader = elem.document.getElementById("drlHeader");
	var elemFooter = elem.document.getElementById("drlFooter");
	var attach = elem.document.getElementById("drlAttachView");	

	tree.style.overflowX = "hidden";
	tree.style.overflowY = "visible";
	listView.style.overflow = "visible";
	list.style.overflow = "visible";
	elemHeader.style.overflow = "visible";
	elemFooter.style.overflow = "visible";
	attach.style.overflow = "visible";

	
	var printHTML = elem.innerHTML;	
	elem = null;

	return printHTML;
}

//-----------------------------------------------------------------------------
function drlAbout()
{
	var strFeatures = "scrollbars,height=600,width=800,resizable";
	drlAboutWnd = window.open("aboutdrill.htm", "", strFeatures);
	return true;
}

//-----------------------------------------------------------------------------
function drlAppendNode(nodeName, parent, cls, id)
{
	var obj = document.createElement(nodeName);

	if (typeof(cls)!="undefined" && cls!=null)
		obj.className = cls;

	if (typeof(id)!="undefined" && id!=null)
		obj.id = id;

	parent.appendChild(obj);
	return obj;
}

//-----------------------------------------------------------------------------
function drlAttachBlur(evt, elem, blnFocus)
{
	drlDrillObj.attachmentHasFocus = blnFocus;
}

//-----------------------------------------------------------------------------
function drlAttachFocus(evt, elem)
{
	if (!drlDrillObj.attachmentHasFocus)
	{
		drlDrillObj.attachmentHasFocus = true;
		drlDrillObj.treeHasFocus = false;
	}

	if (elem.tagName == "INPUT" || elem.tagName == "TEXTAREA")
	{
		if (elem.tagName == "INPUT")
			elem.select();
		else
		{
			try {
				var bFirst = elem.getAttribute("bFirst");
				elem.setAttribute("bFirst", "1");
				if (drlDrillObj.bIsIE)
				{
					if (bFirst == "0")
					{
						var r = elem.createTextRange();
					    r.collapse(true);
					    r.moveStart('character', 0);
					    r.moveEnd('character', 0);
					    r.select();
					}
					else if (drlRange)
						drlRange.select();
				}
				else
				{
					if (bFirst == "0")
						elem.setSelectionRange(0,0);
				}
			} catch(e) { }
		}
		drlAttachBlur(evt, elem, true);
	}
}

//-----------------------------------------------------------------------------
function drlAttachKeyDown(evt, elem, keyVal)
{
	// No key events are being caught.
	return false;
}

//-----------------------------------------------------------------------------
function drlButtonBlur(btn)
{
	btn.className = "anchorActive";
}

//-----------------------------------------------------------------------------
function drlButtonFocus(btn)
{
	drlSetFocusBorder(false);
	btn.className = "anchorFocus";
}

//-----------------------------------------------------------------------------
function drlButtonMouseOut(btn)
{
	if (btn.className == "anchorHover")
		btn.className = "anchorActive" 
}

//-----------------------------------------------------------------------------
function drlButtonMouseOver(btn)
{
	if (btn.className == "anchorActive")
		btn.className = "anchorHover"
}

//-----------------------------------------------------------------------------
function drlCheckLocation(elem)
{
	while (elem.id != "drlTree" && elem.id != "drlList" && elem.id != "drill")
		elem = elem.parentNode;
	return elem;
}

//-----------------------------------------------------------------------------
function drlClearStatus()
{
	window.status="";
}

//-----------------------------------------------------------------------------
function drlClickAttachAddChg()
{
	drlDrillObj.setMessage("");

	var maxAttachSize = 31000;  // writeattach limit

	var title = document.getElementById("txtAttachTitle");
	if (title.value.length == 0)
	{
		drlPortalWnd.cmnDlg.messageBox(drlPortal.getPhrase("TITLE_MISSING"), "ok", "stop");
		title.focus();
		return;
	}

	var elem = document.getElementById("drlAttachView");
	var parentTree = elem.getAttribute("parentTree");
	var index = elem.getAttribute("index");
	var tree = drlDrillObj.treeArray[parentTree];
	var treeNode = tree.nodes[index];

	var strTitle = escape(title.value);
	strTitle = strTitle.replace(/\+/g, "%2b");
	var strText = treeNode.attachment.isComment
			? document.getElementById("txtCmtAttach").value 
			: document.getElementById("txtUrlAttach").value;
	if (treeNode.attachment.isEmail)
		strText = (strText.indexOf("mailto:")==0) ? strText : "mailto:" + strText;
	strText = escape(strText.substr(0, maxAttachSize));
	strText = strText.replace(/\+/g, "%2b");	
	
    var idaCall = treeNode.idaCall.replace(/.+(getattachrec|writeattach).+\?/i, "");
	idaCall = drlPortalWnd.cmnRemoveVarFromString("OPM", idaCall);
	idaCall = drlPortalWnd.cmnRemoveVarFromString("ECODE", idaCall);
    idaCall += "&_OPM=M&_ECODE=FALSE";

    var strAttach = "<?xml version=\"1.0\"?><ATTACHXML>";
	strAttach += "<_AESC>" + (drlDrillObj.bIsIE ? "IE" : "NS") + "</_AESC>";
    strAttach += "<_ANAM><![CDATA[" + strTitle + "]]></_ANAM>";
    strAttach += "<_ATXT><![CDATA[" + strText + "]]></_ATXT>";

    var parms = idaCall.split("&");
    var loop = parms.length;
    for (var i=0; i<loop; i++)
    {
        var pairs = parms[i].split("=");
        strAttach += "<" + pairs[0] + ">";
        strAttach += (drlPortalWnd.escapeExtended(drlPortalWnd.urlDecode(pairs[1]))) ? drlPortalWnd.escapeExtended(drlPortalWnd.urlDecode(pairs[1])) : "";
        strAttach += "</" + pairs[0] + ">";
    }

    strAttach += "</ATTACHXML>";
	var storage = new drlPortalWnd.DataStorage(strAttach);
	drlDrillObj.refreshPkg = storage.document;

	switch (treeNode.attachment.action)
	{
		case "Add":
			drlDrillObj.refreshObject = treeNode;
			drlDrillObj.refreshCallback = "drlDrillObj.refreshObject.addAttachment";
			drlDrillObj.refresh(drlPortalWnd.WRITEATTACHPath, true);
			break;

		case "Change":
			drlDrillObj.refreshObject = treeNode;
			drlDrillObj.refreshCallback = "drlDrillObj.refreshObject.changeAttachment";
			drlDrillObj.refresh(drlPortalWnd.WRITEATTACHPath, true);
			break;
	}
}

//-----------------------------------------------------------------------------
function drlClickAttachDelete()
{
	drlDrillObj.setMessage("");

	var elem = document.getElementById("drlAttachView");
	var parentTree = elem.getAttribute("parentTree");
	var index = elem.getAttribute("index");
	var tree = drlDrillObj.treeArray[parentTree];
	var treeNode = tree.nodes[index];

	var idaCall = treeNode.idaCall.replace(/getattachrec/, "writeattach");
	idaCall = drlPortalWnd.cmnRemoveVarFromString("OPM", idaCall);
	idaCall = drlPortalWnd.cmnRemoveVarFromString("ECODE", idaCall);
	idaCall = idaCall + "&_OPM=D&_ECODE=FALSE";

	drlDrillObj.refreshObject = treeNode;
	drlDrillObj.refreshCallback = "drlDrillObj.refreshObject.deleteAttachment";
	drlDrillObj.refresh(idaCall);
}

//-----------------------------------------------------------------------------
function drlClickAttachOpen()
{
	drlDrillObj.setMessage("");

	var elem = document.getElementById("drlAttachView");
	var parentTree = elem.getAttribute("parentTree");
	var index = elem.getAttribute("index");
	var tree = drlDrillObj.treeArray[parentTree];
	var treeNode = tree.nodes[index];
	var elem = document.getElementById("txtUrlAttach");

	if (treeNode.attachment.isEmail)
	{
		var mailto = (elem.value.indexOf("mailto:")==0) ? elem.value : "mailto:" + elem.value;
		var mailForm = document.getElementById("mailFrm");

		if (drlDrillObj.bIsIE)
			mailFrm.navigate(mailto);
		else
		{
			mailForm.src = mailto;
			setTimeout(drlResetMailForm,200);
		}
	}
	else
	{
    		try{
        		window.open(elem.value);
        	}
        	catch(e) { drlPortalWnd.cmnDlg.messageBox(drlPortal.getPhrase("msgErrorUrlNotValid"),"ok","alert"); }
	}
}

//-----------------------------------------------------------------------------
function drlClickDataDirectory(index)
{
	drlDrillObj.setMessage("");

	if (drlDrillObj.oReqFields.reqFlds[index].data != "")
		drlDrillObj.resetReqFields(index);

	drlProcessNextForList();
}

//-----------------------------------------------------------------------------
function drlClickListRow(evt, elem)
{
	if (!elem) return;
	drlDoClickListRow(elem);
}

//-----------------------------------------------------------------------------
function drlClickRow(evt, elem)
{
	if (!elem) return;
	drlDoClickRow(elem);
}

//-----------------------------------------------------------------------------
function drlClickRowClose(evt, elem)
{
	if (!elem) return;
	
	if(drlDrillObj.isNugglet)
		drlToggleListHighlight(elem)
	else
		drlDoClickRowClose(elem);
}

//-----------------------------------------------------------------------------
function drlClickTreeNode(evt, elem)
{
	drlDrillObj.setMessage("");
	while (elem.className != "DrillTreeCursor")
		elem = elem.parentNode;

	var parentTree = elem.getAttribute("parentTree");
	var index = elem.getAttribute("index");
	var tree = drlDrillObj.treeArray[parentTree];
	var treeNode = tree.nodes[index];

	if (!treeNode.selected)
		drlRemoveNavlet("drlFind");
	if (treeNode.isSecure)
	{ 
		if (drlDrillObj.treeHasFocus && drlDrillObj.selectedTreeNode)
			drlDrillObj.selectedTreeNode.update();
		return false;
	}
	treeNode.show();
}

//-----------------------------------------------------------------------------
function drlClickView(elem)
{
	window.oDropView.show(drlDrillObj.view, elem, "drlClickViewSelected", null);
}

//-----------------------------------------------------------------------------
function drlClickViewOption(row, index, siblingTree)
{
	drlDrillObj.setMessage("");
	drlRemoveNavlet("drlFind");

	var tree = drlDrillObj.treeArray[siblingTree];
	var treeNode = tree.nodes[index];

	if (treeNode.idaOrig == "")
		treeNode.idaOrig = treeNode.idaCall;
	else if (treeNode.idaOrig != treeNode.idaCall)
	{
		treeNode.visited = false;
		treeNode.idaCall = treeNode.idaOrig;
	}

	treeNode.expandTreeList();
	drlSetFocusBorder(false);
}

//-----------------------------------------------------------------------------
function drlClickViewSelected(view)
{
	if (!view)
	{
		document.getElementById("drlViewSelect").focus();
		return;
	}
	drlDrillObj.view = view;
	var ary = view.split("|");
	drlClickViewOption(ary[0], ary[1], ary[2]);
}

//-----------------------------------------------------------------------------
function drlClose(evt)
{
	if (!drlDrillObj.isStandAlone)
		drlPortal.drill.close();

	drlCloseReturn(null);
}
//-----------------------------------------------------------------------------
function drlCloseDrillAroundWnds()
{
	var oPortalDrill = drlPortal.drill;
	var loop = 	oPortalDrill.drillAroundAry.length;
	
	for(var i=0; i< loop; i++)
	{
		var oDrlAroundSelect = oPortalDrill.drillAroundAry[i];
		
		if(oDrlAroundSelect.wnd)
			oDrlAroundSelect.closeWindow();
	}

	oPortalDrill.drillAroundAry.length = 0;
	return true;
}
//-----------------------------------------------------------------------------
function drlCloseReturn(returnVal)
{
	if(drlDrillObj.isDrilling)
	{
		//drillaround will always open in a new window
		//therefore we just close the window
		window.close();
		return;
	}
	
	if (drlDrillObj.isStandAlone)
	{
		// window.dialogTop & dialogLeft do not change if the window is just moved
		// so calculate ourselves
		var top = window.screenTop - drlDrillObj.topDiff;	
		var left = window.screenLeft - drlDrillObj.leftDiff;
		var mode = (drlDrillObj.mode == "genlist") ? "select" : drlDrillObj.mode;	
		drlPortalWnd.oUserProfile.setMetrics(mode, top, left, window.dialogHeight, 
				window.dialogWidth);
	}
	
	if (typeof(returnVal) == "undefined")
		returnVal = null;
		
	if (!drlDrillObj.isStandAlone)
	{
		drlDrillObj.toolbar.clear();
		drlDrillObj.setMessage("");
		drlDrillObj.blnHasToolbar = false;

		drlRemoveNavlet("drlViews");
		drlRemoveNavlet("drlFind");
		drlRemoveNavlet("drlDataDir");
	}
	
	drlDrillObj.idaPath = null;

	if (drlDrillObj.callback != null)
		drlPortal.drill.doCallback(returnVal);

	// needed for window Close button click
	drlDrillObj.mode = "drlCloseReturn";	

	if (drlDrillObj.isStandAlone)
		window.close();
}

//-----------------------------------------------------------------------------
function drlContextMenu(evt, bHotKey)
{
	drlDrillObj.setMessage("");
	if (drlDrillObj.mode == "genlist") return;
    evt = (evt) ? evt : ((window.event) ? window.event : "");
    if (!evt) return false;

	var elem = drlPortalWnd.getEventElement(evt);
	if (typeof(elem) == "undefined" || typeof(elem.id) == "undefined")
	{
		drlPortalWnd.setEventCancel(evt);
		return false;
	}

	var where = drlCheckLocation(elem);
	if (where && where.id != "drlTree" && where.id != "drlList")
	{
		drlPortalWnd.setEventCancel(evt);
		return false;
	}

	var index = null;
	var treeKey = null;
	var treeNode = null;

	if (bHotKey)
	{
		if (drlDrillObj.treeHasFocus)
			elem = document.getElementById("tn" + drlDrillObj.selectedTreeNode.id);
		else
			elem = drlFindCurrentRow();
	}

	where = drlCheckLocation(elem);

	if (where.id == "drlTree")
	{
		var parId = elem.id.substr(2, elem.id.length);
		var par = document.getElementById(parId);
		
		if (!par) return false;

		while (elem && elem.className != "DrillTreeCursor")
			elem = elem.parentNode;
			
		if (!elem) return false;

		treeKey = elem.getAttribute("parentTree");
		index = elem.getAttribute("index");
		
		if (!index) return false;
		
		tree = drlDrillObj.treeArray[treeKey];
		treeNode = tree.nodes[index];
		drlDrillObj.treeHasFocus = true;
		var clickedId = "tn" + elem.id;
		var origId = drlDrillObj.selectedTreeNode.getElement();
		origId = "tn" + origId.id;
		drlDrillObj.context = origId + "|" + clickedId;		
		
		if(!treeNode.isSecure)
		{
			document.getElementById(clickedId).className = "DrillTreeTextSelected";
			drlToggleTreeHighlight(origId, clickedId);
		}
	}
	else
	{
		while (elem.tagName != "TR" && elem.id != "drlList")
		{
			elem = elem.parentNode;
			if (!elem) return false;
		}

		index = elem.getAttribute("index");
		
		if (!index) return false;

		var list = document.getElementById("drlList");
		treeKey = list.getAttribute("siblingTree");
		var tree = drlDrillObj.treeArray[treeKey];
		treeNode = tree.nodes[index];
		drlDrillObj.context = elem.id.replace("r", "");
		
		if(!treeNode.isSecured)
			drlToggleListHighlight(elem);

		if (!bHotKey)
		{
			drlDrillObj.treeHasFocus = false;
			drlPlaceFocus();
		}
	}

	var key = treeKey + "|" + index + "|" + where.id + "|" + elem.id;
	window.oDropdown = new window.Dropdown(drlPortalWnd);
	window.oDropdown.clearItems();

		if (bHotKey)
			drlSetContextMenu(window, treeNode, key, elem, where);
		else
			drlSetContextMenu(window, treeNode, key, elem, where, evt.clientX, evt.clientY);

	drlPortalWnd.setEventCancel(evt);
}

//-----------------------------------------------------------------------------
function drlCreateButtons()
{
	if (drlDrillObj.mode == "list")
		drlDrillObj.blnHasToolbar = false;

	if (!drlDrillObj.blnHasToolbar)
	{
		with (drlDrillObj.toolbar)
		{
			target = window;
			clear(true);
		
			switch (drlDrillObj.mode)
			{
				case "genlist":
					if (!drlDrillObj.isNugglet)
					{
						drlCreateReturnButton();
						addSeparator();
						drlCreateDrillSearch();
						addSeparator();
						createButton(drlPortal.getPhrase("LBL_PRINTABLE_VIEW"),drlPrintableView, "printableView", "enabled");						
						changeButtonTitle("printableView",drlPortal.getPhrase("LBL_PRINT_THIS_PAGE"));
					}
					else
					{
						drlCreateDrillSearch();
					}
					break;

				case "select":
					if (!drlDrillObj.isNugglet)
					{	
						drlCreateReturnButton();
						addSeparator();
						drlCreateDrillSearch();
						addSeparator();						
						createButton(drlPortal.getPhrase("LBL_PRINTABLE_VIEW"),drlPrintableView, "printableView", "enabled");													
						changeButtonTitle("printableView",drlPortal.getPhrase("LBL_PRINT_THIS_PAGE"));
						if(drlDrillObj.isDrillAllowed)
							createButton(drlPortal.getPhrase("LBL_EXPLORER_VIEW"),drlSwitchToDrill, "toggleView", "enabled");		
						changeButtonTitle("toggleView",drlPortal.getPhrase("LBL_SHOW_EXPLORER_VIEW"));	
					}
					else
					{
						drlCreateDrillSearch();
					}					
					break;

				case "explorer":
					if (!drlDrillObj.isNugglet)
					{
						drlCreateReturnButton();
						addSeparator();
						drlCreateDrillSearch();
						addSeparator();						
						createButton(drlPortal.getPhrase("LBL_PRINTABLE_VIEW"),drlPrintableView, "printableView", "enabled");													
						changeButtonTitle("printableView",drlPortal.getPhrase("LBL_PRINT_THIS_PAGE"));
						drlSetTitleBarBtn();
					}
					else
					{
						drlCreateDrillSearch();
					}					
					break;

				case "list":
					createButton(drlPortal.getPhrase("LBL_STOP_LIST_MODE"),drlClose, "drlShowForm", "enabled");					
					createButton(drlPortal.getPhrase("LBL_DEFINE"),"drlDoDefine()", "drlFormTransfer", "enabled");
					drlSetListDefineButton();					
					addSeparator();				
					drlCreateDrillSearch();
					break;

				case "attachment":
					drlCreateReturnButton();
					addSeparator();
					createButton(drlPortal.getPhrase("LBL_PRINTABLE_VIEW"),drlPrintableView, "printableView", "enabled");					
					changeButtonTitle("printableView",drlPortal.getPhrase("LBL_PRINT_THIS_PAGE"));
					break;
			}
	 	}
		drlDrillObj.blnHasToolbar = true;
	}
}

//-----------------------------------------------------------------------------
function drlCreateReturnButton()
{
	var icon = (drlDrillObj.isStandAlone) ? "" : "back";
	var phrase = (drlDrillObj.isStandAlone) 
			? drlPortal.getPhrase("LBL_CLOSE") 
			: drlPortal.getPhrase("LBL_BACK");
	drlDrillObj.toolbar.createButton(phrase, drlClose, "drlClose", "enabled", "", icon);
}

//-----------------------------------------------------------------------------
function drlCreateDrillSearch()
{
	drlDrillObj.toolbar.createButton(drlPortal.getPhrase("LBL_SEARCH"), drlDoSearch, "drlSearch", "disabled");
	drlDrillObj.toolbar.createButton(drlPortal.getPhrase("LBL_FIND_NEXT"), drlFindNext, "drlFindNext", "disabled");
	drlDrillObj.toolbar.createButton(drlPortal.getPhrase("LBL_RESET"), drlDoReset, "drlReset", "disabled");
}

//-----------------------------------------------------------------------------
function drlDoChangeRecords(elem)
{
	var footer = document.getElementById("drlFooter");
	var prevRecords = drlDrillObj.nbrRecords;
	var value = elem.options[elem.selectedIndex].value;
	drlDrillObj.nbrRecords = parseInt(value, 10);

	var btn = document.getElementById("drlBtnnext");
	btn.title = btn.title.replace(prevRecords, value);
	btn.value = btn.value.replace(prevRecords, value);

	btn = document.getElementById("drlBtnprev");
	btn.title = btn.title.replace(prevRecords, value);
	btn.value = btn.value.replace(prevRecords, value);

	document.getElementById("drlRecordsCount").className = "DrillInvisible";

	switch (drlDrillObj.mode)
	{
		case "explorer":  //changes
			drlDrillObj.tree.initialize();
			drlDrillObj.refreshCallback = "drlDrillObj.doChangeRecordsComplete";
			drlDrillObj.refresh(drlDrillObj.idaCall);
//			drlDrillObj.selectedTreeNode.refresh();
			break;


		default:
			drlDrillObj.tree.initialize();
			drlDrillObj.tree.root();

			drlDrillObj.refreshCallback = "drlDrillObj.doChangeRecordsComplete";
			drlDrillObj.refresh(drlDrillObj.idaCall);
			break;
	}
}

//-----------------------------------------------------------------------------
function drlDoClickListRow(elem)
{
	drlDrillObj.setMessage("");

	var index = elem.getAttribute("index");
	var list = document.getElementById("drlList");
	var parentTree = list.getAttribute("parentTree");
	var treeNodeIndex = list.getAttribute("parentTreeNode");
	var tree = drlDrillObj.treeArray[parentTree];

	var keyVals = tree.nodes[treeNodeIndex].list.nodes[index].keyNodes.getElementsByTagName("KEYFLD");
	var keyReq = drlDrillObj.oReqFields.reqFlds[drlDrillObj.reqCurrentIndex];
	var keyflds = tree.nodes[treeNodeIndex].list.nodes[index].keyNodes;

	var len = keyVals.length;
	for (var x=0; x<len; x++)
	{
		if (keyVals[x].getAttribute("keynbr") == keyReq.keynbr)
		{
			drlDrillObj.updateReqFields(drlDrillObj.reqCurrentIndex, keyVals[x].firstChild.nodeValue, keyflds);
			break;
		}
	}

	if (drlDrillObj.bIsIE)
		setTimeout("drlProcessNextForList()", 0);
	else
		drlProcessNextForList();
}

//-----------------------------------------------------------------------------
function drlDoClickRow(elem)
{
	drlSetFocusBorder(false);
	drlDrillObj.setMessage("");
	drlRemoveNavlet("drlFind");

	while (elem.tagName != "TR")
		elem = elem.parentNode;

	var index = elem.getAttribute("index");
	var list = document.getElementById("drlList");
	var siblingTree = list.getAttribute("siblingTree");
	var tree = drlDrillObj.treeArray[siblingTree];
	var treeNode = tree.nodes[index];

	treeNode.expandParentTree();
	treeNode.showTreeList();
}

//-----------------------------------------------------------------------------
function drlDoClickRowClose(elem)
{
	drlSetFocusBorder(false);
	drlDrillObj.setMessage("");

	while (elem.tagName != "TR")
		elem = elem.parentNode;

	var index = elem.getAttribute("index");
	var list = document.getElementById("drlList");
	var parentTree = list.getAttribute("parentTree");
	var treeNodeIndex = list.getAttribute("parentTreeNode");
	var tree = drlDrillObj.treeArray[parentTree];

	drlCloseReturn(tree.nodes[treeNodeIndex].list.nodes[index].keyNodes);
}

//-----------------------------------------------------------------------------
function drlDoContext(value)
{
	var context = drlDrillObj.context;
	drlDrillObj.context = null;
	var aryContext = context.split("|");

	if (!value)
	{
		// on the tree; remove the color
		if (drlDrillObj.treeHasFocus)
		{
			// original id
			if (aryContext.length > 0 && aryContext[0].length > 0 
				&& document.getElementById(aryContext[0]).className != "DrillTreeTextSecure")
				document.getElementById(aryContext[0]).className = "DrillTreeTextSelected";

			// clicked id
			if (aryContext.length > 1 && aryContext[1].length > 0)
			{
				if (aryContext[0] == aryContext[1])
				{
					try {
						document.getElementById(aryContext[0]).focus();
					} catch (e) { }
				}
				else
				{
					if (document.getElementById(aryContext[1]).className != "DrillTreeTextSecure")
						document.getElementById(aryContext[1]).className = "DrillTreeText";
				}
			}
		}
		else
			drlHighlightRow(aryContext[0], aryContext[0], true);
		return;
	}

	// values action | treeKey | index | where.id | elem.id
	var values = value.split("|");
	var tree = drlDrillObj.treeArray[values[1]];
	var treeNode = tree.nodes[values[2]];

	switch (values[0])
	{
		case "explorerselect":
			var oKeyFlds = treeNode.keyNodes;
			drlDoExplorerSelect(oKeyFlds);
			break
		case "drillaround":
			var elem = document.getElementById(values[4]);
			drlDoDrillAround(elem);
			break			
		case "selectrow":
			var elem = document.getElementById(values[4]);
			drlDoClickRowClose(elem);
			break;
		case "listrow":
			var elem = document.getElementById(values[4]);
			drlDoClickListRow(elem);
			break;
		case "openrow":
			var elem = document.getElementById(values[4]);
			drlDoClickRow(elem);
			break;
		case "open":
			treeNode.show();
			break;
		case "expand":
		case "collapse":
			treeNode.showTree();
			treeNode.update();
			try {
				document.getElementById(aryContext[0]).focus();
			} catch (e) { }
			break;
	}
}
//-----------------------------------------------------------------------------
function drlDoDefine()
{
	var index = drlDrillObj.reqCurrentIndex;
	
	if (index != null && drlDrillObj.oReqFields.reqFlds[index].deftkn != null)
		drlCloseReturn(drlDrillObj.oReqFields.reqFlds[index].deftkn);
}

//-----------------------------------------------------------------------------
function drlDoDrillAround(elem)
{
	var index = elem.getAttribute("index");
	var list = document.getElementById("drlList");
	var parentTree = list.getAttribute("parentTree");
	var treeNodeIndex = list.getAttribute("parentTreeNode");
	var tree = drlDrillObj.treeArray[parentTree];

	var api = tree.nodes[treeNodeIndex].list.nodes[index].idaCall;
	var title = drlDrillObj.selectedTreeNode.title;
	var oKeyNodes = tree.nodes[treeNodeIndex].list.nodes[index].keyNodes;
	var _KNB = drlPortalWnd.getVarFromString("_KNB",tree.nodes[treeNodeIndex].idaCall)

	var oDrlAroundSelect = new DrillAroundSelect(drlPortalWnd, window, title, _KNB, oKeyNodes);
	var drillAroundId = drlPortal.drill.drillAroundAry.length;
	drlPortal.drill.drillAroundAry.push(oDrlAroundSelect);
	
	drlPortal.drill.doDrillAround(api,drlPortalWnd.strIDAPath)
}
//-----------------------------------------------------------------------------
function drlDoDrillAroundSelect()
{
	var oPortalDrill = drlPortal.drill;
	var oDrlAroundSelect = oPortalDrill.drillAroundAry[drillAroundWndId];
	oDrlAroundSelect.doSelect();
	return true;
}
//-----------------------------------------------------------------------------
function drlDoEnterKey()
{
	if (drlDrillObj.treeHasFocus || drlDrillObj.attachmentHasFocus)
		return false;

	var tblTr = drlFindCurrentRow();
	if (!tblTr) 
		return false;
	
	switch (drlDrillObj.mode)
	{
		case "list":
			drlDoClickListRow(tblTr);
			break;
		case "select":
		case "genlist":
			if(drlDrillObj.isNugglet)
				drlToggleListHighlight(tblTr)
			else
				drlDoClickRowClose(tblTr);		
			break;
		case "explorer":
		case "attachment":
			drlDoClickRow(tblTr);
			break;

		default:
			return false;
	}
	return true;
}
//-----------------------------------------------------------------------------
function drlDoExplorerSelect(oKeyflds)
{
	drlCloseReturn(oKeyflds);
	return true;
}
//-----------------------------------------------------------------------------
function drlDoKeyDown(evt)
{
	drlDrillObj.setMessage("");

    evt = (evt) ? evt : ((window.event) ? window.event : "");
    if (!evt) return;

	var elem = drlPortalWnd.getEventElement(evt);
	var evtCaught = false;

	if (drlDrillObj.isStandAlone)
	{
		// get portal hotkey action
		var action = drlPortal.keyMgr.getHotkeyAction(evt, "portal");
		// hotkey defined for this keystroke
		if (action != null)
		{
			cntxtActionHandler(evt, action)
			drlPortalWnd.setEventCancel(evt);
			return false;
		}
	}
	else
	{
		// check with portal for hotkey action
		var action = drlPortalWnd.getFrameworkHotkey(evt, "drillobj");
		if (!action)
		{
			// framework handled the keystroke
			drlPortalWnd.setEventCancel(evt)
			return false;
		}

		// hotkey defined for this keystroke
		if (action != "drillobj")
		{
			cntxtActionHandler(evt, action)
			drlPortalWnd.setEventCancel(evt);
			return false;
		}
	}

	var keyVal = (drlDrillObj.bIsIE) ? evt.keyCode : evt.charCode;
	if (keyVal == 0)			// netscape only
		keyVal = evt.keyCode;

	// tab
	if (keyVal == 9)
	{
		// ctrl+tab - swap between tree and list/attachment form
		if (!evt.altKey && evt.ctrlKey && !evt.shiftKey)
			evtCaught = drlSwapPanes();
	}
	// F6 - swap between tree and list/attachment form
	else if (!evt.altKey && !evt.ctrlKey && !evt.shiftKey && keyVal == 117)
		evtCaught = drlSwapPanes();
	// display About window: Alt-Ctrl-A or Ctrl-Shift-V
	else if (evt.altKey && evt.ctrlKey && !evt.shiftKey && evt.keyCode == 65
	|| !evt.altKey && evt.ctrlKey && evt.shiftKey && evt.keyCode == 86)
		evtCaught = drlAbout();

	if (!evtCaught)
	{
		if (drlDrillObj.treeHasFocus)
			evtCaught = drlTreeKeyDown(evt, elem, keyVal);
		else
		{
			if (drlDrillObj.selectedTreeNode != null)
			{
				if (drlDrillObj.attachmentHasFocus)
					evtCaught = drlAttachKeyDown(evt, elem, keyVal);
				else
					evtCaught = drlListKeyDown(evt, elem, keyVal);
			}
            else if (drlDrillObj.mode == "genlist")
                evtCaught = drlListKeyDown(evt, elem, keyVal);
		}
	}
	if (evtCaught)
		drlPortalWnd.setEventCancel(evt);

	return evtCaught;
}

//-----------------------------------------------------------------------------
function drlDoReset()
{

	var list = document.getElementById("drlList");
	var parentTree = list.getAttribute("parentTree");
	var treeNodeIndex = list.getAttribute("parentTreeNode");
	var tree = drlDrillObj.treeArray[parentTree];
	var treeNode = tree.nodes[treeNodeIndex];

	treeNode.list.navigate.page = "first";
	treeNode.list.navigate.isFind = false;

	drlDrillObj.blnReset = false;
	drlDrillObj.blnFindNext = false;
	drlSetSearchButtons();
	var oModPath = drlDrillObj.modifyPath(treeNode.idaOrig != "" ?
	treeNode.idaOrig : drlDrillObj.idaOrig);
	treeNode.idaCall = oModPath.url;
	treeNode.refresh();
	drlDrillObj.setMessage("");
}

//-----------------------------------------------------------------------------
function drlDoResize(evt, bDoSize)
{
	if (typeof(bDoSize) == "undefined")
		bDoSize = (drlDrillObj.mode == "explorer" || drlDrillObj.mode == "attachment")
		    ? true 
		    : false;

	try	{
		var scrWidth = 0;
		var scrHeight = 0;

		if (drlDrillObj.bIsIE)
		{
			scrWidth = document.body.offsetWidth;
			scrHeight = document.body.offsetHeight;
		}
		else
		{
			scrWidth = window.innerWidth-3;
			scrHeight = window.innerHeight;
		}

		if (evt && (scrHeight < 50 || scrWidth < 50))
		{
			drlPortalWnd.setEventCancel(evt);
			return;
		}
		var container = document.getElementById("drlWindow");
		var toolbar = document.getElementById("drlToolBar");
		var tree = document.getElementById("drlTree");
		var splitBar = document.getElementById("drlSplitBar");
		var listview = document.getElementById("drlListView");
		var head = document.getElementById("drlHeader");
		var list = document.getElementById("drlList");
		var listscroll = document.getElementById("drlListScroll");
		var footer = document.getElementById("drlFooter");
		var attach = document.getElementById("drlAttachView");
		var msgBar = document.getElementById("drlMsgOuter");
		var xFrame = document.getElementById("drlwdav");
		var cmtAttach = document.getElementById("txtCmtAttach");
		var urlAttach = document.getElementById("txtUrlAttach");

		var msgBarHeight = (msgBar.className != "DrillInvisible") 
			? parseInt(msgBar.style.height,10) 
			: 0;
		var height = scrHeight - container.offsetTop - msgBarHeight;

		if (bDoSize)
		{
			tree.style.height = height;
			tree.style.left = container.offsetLeft;
			tree.style.width = ((scrWidth / 3) - 12);
		}
		else if (tree.className == "DrillInvisible")
			tree.style.width = 0;

		container.style.height = height;
		splitBar.style.height = height;
		splitBar.style.left = (drlDrillObj.bIsIE) ? tree.style.width : parseInt(tree.style.width) + 3;

		var listWidth = scrWidth - (parseInt(tree.style.width) + splitBar.offsetWidth);
		var listLeft = parseInt(splitBar.style.left) + splitBar.offsetWidth;
		listview.style.height = height;
		listview.style.left = listLeft;
		listview.style.width = listWidth;
		attach.style.height = height;
		attach.style.left = listLeft;
		attach.style.width = listWidth;
		cmtAttach.style.width = listWidth - 20;
		urlAttach.style.width = listWidth - 20;

		if (head.className == "DrillInvisible")
			list.style.height = parseInt(listview.style.height);
		else
			list.style.height = parseInt(listview.style.height) - parseInt(list.style.top);

		if (footer.className != "DrillInvisible")
		{
			list.style.height = parseInt(list.style.height) - parseInt(footer.style.height);
			footer.style.top = parseInt(list.style.height) + parseInt(list.style.top);
			footer.style.width = listWidth;
		}

		list.style.width = parseInt(listview.style.width);

		// 16 is width of possible scrollbars
		if (listscroll)
			listscroll.style.width = parseInt(listview.style.width)-16;

		head.style.width = parseInt(list.style.width)-16;

		if (drlDrillObj.blnHasMsgbar)
		{
			msgBar.style.top = scrHeight - parseInt(msgBar.style.height);
			msgBar.style.width = scrWidth;
		}

	} catch(e) { }
}

//-----------------------------------------------------------------------------
function drlDoSearch()
{
	var strFeatures = "";
	var url = "";
	var list = document.getElementById("drlList");
	var parentTree = list.getAttribute("parentTree");
	var treeNodeIndex = list.getAttribute("parentTreeNode");
	var tree = drlDrillObj.treeArray[parentTree];
	var treeNode = tree.nodes[treeNodeIndex];
	var listNode = treeNode.list;
	var oModPath = drlDrillObj.modifyPath(treeNode.idaOrig != "" ? treeNode.idaOrig : drlDrillObj.idaOrig);
	url = oModPath.url;

	// create object on window for drill information; mostly for Netscape
	window.nsrchObj = new Object();
	nsrchObj.portalWnd = drlPortalWnd;
	nsrchObj.storage = listNode.findStorage;
	nsrchObj.url = url;
	nsrchObj.callback = null;
	nsrchObj.mode = drlDrillObj.mode;

	var dlgArgs = new Array();
	dlgArgs[0] = drlPortal.getPhrase("LBL_SEARCH");
	dlgArgs[1] = nsrchObj;

	if (drlPortal.browser.isIE)
	{
		strFeatures = "dialogWidth:616px;dialogHeight:308px;center:yes;help:no;scroll:no;status:no;resizable:no;";
		var wnd = (drlDrillObj.isStandAlone) ? window : drlPortalWnd;
		var retObj = wnd.showModalDialog(drlPortal.path + "/drill/drsearch.htm", dlgArgs, strFeatures);

		if (typeof(retObj) != "undefined")
			drlFindReturn();
	}
	else
	{
		nsrchObj.callback = "portalWnd.lawsonPortal.drill.drillFrame.contentWindow.drlDoSearchReturnNS()";
		strFeatures = "top=255px,left=201px,width=621px,height=258px,chrome,dependent,dialog,modal,";

		// needs to be last statement in this function; uses callback on return if search takes place
		drlSearchWnd = window.open(drlPortal.path + "/drill/drsearch.htm", nsrchObj.title, strFeatures);
	}
}

//-----------------------------------------------------------------------------
function drlDoSearchReturnNS()
{
	setTimeout("drlFindReturn()", 0);
}
//-----------------------------------------------------------------------------
function drlEnableTitleBarBtn(enable)
{
		var btn = document.getElementById("drlTitleBarBtn");
		btn.className = (enable ? "anchorActive" : "anchorDisabled")
		btn.disabled = !enable;
}

//-----------------------------------------------------------------------------
function drlFindCurrentRow()
{
	var list = document.getElementById("drlList");
	var tblBody = list.getElementsByTagName("TBODY")[0];
	if (!tblBody) return null;
	var tblTr = tblBody.getElementsByTagName("TR");
	var len = tblTr.length

	if (drlDrillObj.currentRow != null)
		return tblTr[drlDrillObj.currentRow];
	else
	{
		for (var row=0; row<len; row++)
		{
			if (tblTr[row].getAttribute("selected") == "true")
			{
				return tblTr[row];
				break;
			}
		}
	}
	if (len > 0)
		return tblTr[0];
	else
		return null;
}

//-----------------------------------------------------------------------------
function drlFindNext()
{
	drlFindReturn(true);
}

//-----------------------------------------------------------------------------
function drlFindReturn(blnFindNext)
{
	drlDrillObj.setMessage("");

	if (typeof(blnFindNext) == "undefined")
		blnFindNext = false;

	if (!blnFindNext)
	{
		var storage = new drlPortalWnd.DataStorage(nsrchObj.storage.getDataString());
		nsrchObj = null;

		var url = storage.getElementValue("OUTPUT", 0);
	}

	var list = document.getElementById("drlList");
	var parentTree = list.getAttribute("parentTree");
	var treeNodeIndex = list.getAttribute("parentTreeNode");
	var tree = drlDrillObj.treeArray[parentTree];
	var treeNode = tree.nodes[treeNodeIndex];

	if (!blnFindNext)
	{
		treeNode.list.findStorage = storage;
		treeNode.idaCall = url;

		var node = storage.getNodeByAttributeId("FIELDS", "id", "drill");
		var filter = node.getAttribute("filter");

		drlDrillObj.blnFindNext = (filter == "1") ? false : true;
		drlDrillObj.blnReset = true;
		drlSetSearchButtons();
	}
	else
	{
		treeNode.idaCall = (treeNode.list.navigate.findNext.length > 0) 
				? treeNode.list.navigate.findNext 
				: treeNode.idaCall;

		// protect ourselves from IDA 'opportunities':
		treeNode.idaCall = treeNode.idaCall.replace("\n","")
		treeNode.idaCall = drlPortalWnd.cmnRemoveVarFromString("USR", treeNode.idaCall);
	}

	drlDrillObj.refreshObject = treeNode;
	drlDrillObj.refreshCallback = "drlDrillObj.refreshObject.findReturnComplete";
	drlDrillObj.refresh(treeNode.idaCall);
	drlPlaceFocus();
}

//-----------------------------------------------------------------------------
function drlHighlightRow(newRow, oldRow, blnNormal)
{
	if (typeof(blnNormal) == "undefined")
		blnNormal = true;

	var list = document.getElementById("drlList");
	var tblBody = list.getElementsByTagName("TBODY")[0];
	if (tblBody.id != "drlTblBody")	return;

	var tblTr = tblBody.getElementsByTagName("TR");
	if (tblTr.length == 0) return;

	if (blnNormal)
	{
		var tblBtn = tblBody.getElementsByTagName("BUTTON");
		var aNode;

		aNode = tblBtn[oldRow].childNodes[0];
		aNode.nodeValue = "";
		tblTr[oldRow].className = (oldRow % 2 == 0) ? "DrillRowEven" : "DrillRowOdd";
		tblTr[oldRow].setAttribute("selected", false);
		tblBtn[oldRow].setAttribute("tabIndex", "-1");

		aNode = tblBtn[newRow].childNodes[0];
		aNode.nodeValue = ">";
		tblTr[newRow].className = "DrillRowSelected";
		tblTr[newRow].setAttribute("selected", true);
		tblBtn[newRow].setAttribute("tabIndex", "1");
	}
	drlDrillObj.currentRow = newRow;
 	try {
		tblBtn[newRow].focus();
 	} catch(e) { }
}

//-----------------------------------------------------------------------------
function drlListKeyDown(evt, elem, keyVal)
{
	var evtCaught = false;
	// not a list element, so cancel
	if (drlDrillObj.isIE && elem.id.indexOf("r") != 0) return false;

	var list = document.getElementById("drlList");
	var tblBody = list.getElementsByTagName("TBODY")[0];
	if (!tblBody) return false;
	if (tblBody.id != "drlTblBody") return false;

	var totalRows = parseInt(tblBody.getAttribute("totalRows"));
	var row = 0;
	var tblTr = drlFindCurrentRow();
	if (tblTr)
		row = parseInt(tblTr.id.replace("r", ""));

	var oldRow = row;
	var charCode = String.fromCharCode(keyVal);

	if (!evt.altKey && !evt.ctrlKey && !evt.shiftKey)
	{
		if (elem.nodeName == "BUTTON" && elem.id.indexOf("Ar") == 0)
		{
			// enter
			if (keyVal == 13)
				evtCaught = drlDoEnterKey();
			// up arrow
			else if (keyVal == 38)
			{
				row = (--row < 0) ? 0 : row;
				drlHighlightRow(row, oldRow);
				evtCaught = true;
			}
			// down arrow
			else if (keyVal == 40)
			{
				row = (++row > totalRows) ? totalRows : row;
				drlHighlightRow(row, oldRow);
				evtCaught = true;
			}
			// end
			else if (keyVal == 35)
			{
				drlHighlightRow(totalRows, oldRow);
				evtCaught = true;
			}
			// home
			else if (keyVal == 36)
			{
				drlHighlightRow(0, oldRow);
				evtCaught = true;
			}
		}
	}
	else if (!evt.altKey && evt.ctrlKey && evt.shiftKey)
	{
       	switch(charCode)
    	{
            case "R":				//drill
				if (drlDrillObj.bIsIE && drlDrillObj.mode == "select" && drlDrillObj.isDrillAllowed)	// doesn't work for NS
				{
					drlSwitchToDrill();
					evtCaught = true;
				}
				break;
		}
	}
	return evtCaught;
}

//-----------------------------------------------------------------------------
function drlNext()
{
	drlDrillObj.setMessage("");
	var list = document.getElementById("drlList");
	var parentTree = list.getAttribute("parentTree");
	var treeNodeIndex = list.getAttribute("parentTreeNode");
	var tree = drlDrillObj.treeArray[parentTree];
	var treeNode = tree.nodes[treeNodeIndex];

	if (tree.nodes[treeNodeIndex].list.navigate.nextPage == "")
		return;

	tree.nodes[treeNodeIndex].list.navigate.page = "next";
	treeNode.list.nodes = new Array();
	treeNode.tree.nodes = new Array();
	treeNode.visited = false;
	if (!treeNode.expanded)
		treeNode.expanded = false; 
	treeNode.idaCall = tree.nodes[treeNodeIndex].list.navigate.nextPage;
	var elem = document.getElementById(treeNode.id);
	drlRemoveChildren(elem.nextSibling);
	treeNode.show();
}

//-----------------------------------------------------------------------------
function drlOnBlurList(evt, elem)
{
	if (drlDrillObj.context)
	{
		if (drlDrillObj.context && drlDrillObj.context == elem.id)
			return;
	}

	elem = elem.parentNode;
	var par = document.getElementById(elem.id.substr(0, elem.id.indexOf("c")));
	var selected = par.getAttribute("selected");
	var row = parseInt(par.id.replace("r", ""));
	par.className = (selected == "true" || selected == true) 
			? "DrillRowUnselected"
			: (row % 2 == 0) ? "DrillRowEven" : "DrillRowOdd";
}

//-----------------------------------------------------------------------------
function drlOnBlurTree(evt, elem)
{
	if (drlDrillObj.context)
	{
		var aryContext = drlDrillObj.context.split("|");
		if (aryContext[1] && aryContext[1] == elem.id)
			return;
	}

	var parId = elem.id.replace("tn", "");
	var par = document.getElementById(parId);
	var selected = par.getAttribute("selected");
	var isSecure = par.getAttribute("isSecure");
	if (isSecure == "true" || isSecure == true)
		return false;
	elem.className = (selected == "true" || selected == true) 
			? "DrillTreeTextUnselected" : "DrillTreeText";
}

//-----------------------------------------------------------------------------
function drlOnFocusList(evt, elem)
{
	elem = elem.parentNode;
	var par = document.getElementById(elem.id.substr(0, elem.id.indexOf("c")));
	var selected = par.getAttribute("selected");
	var row = parseInt(par.id.replace("r", ""));
	par.className = (selected == "true" || selected == true) 
			? "DrillRowSelected"
			: (row % 2 == 0) ? "DrillRowEven" : "DrillRowOdd";
	drlDrillObj.treeHasFocus = (selected == "true" || selected == true)
			? false : true;
}

//-----------------------------------------------------------------------------
function drlOnFocusTree(evt, elem)
{
	var parId = elem.id.replace("tn", "");
	var par = document.getElementById(parId);
	var selected = par.getAttribute("selected");
	var isSecure = par.getAttribute("isSecure");
	if (isSecure == "true" || isSecure == true)
	{ 
		if (drlDrillObj.treeHasFocus && drlDrillObj.selectedTreeNode)
			drlDrillObj.selectedTreeNode.update();
		return false;
	}
	elem.className = (selected == "true" || selected == true) 
			? "DrillTreeTextSelected" : "DrillTreeText";
	drlDrillObj.treeHasFocus = (selected == "true" || selected == true)
			? true : false;
}

//-----------------------------------------------------------------------------
function drlOnHelp(e)
{
	// only IE fires this -- do we want to cancel?
	var evt=window.event
	if ( drlPortal.keyMgr.cancelHelpKey(evt,"forms") )
		drlPortalWnd.setEventCancel(evt)
}

//-----------------------------------------------------------------------------
function drlOnToggleDoc(evt, elem)
{
	while (elem.className != "DrillTreeCursor")
		elem = elem.parentNode;

	var parentTree = elem.getAttribute("parentTree");
	var index = elem.getAttribute("index");
	var tree = drlDrillObj.treeArray[parentTree];
	var treeNode = tree.nodes[index];
	if (treeNode.isSecure)
	{ 
		if (drlDrillObj.treeHasFocus && drlDrillObj.selectedTreeNode)
			drlDrillObj.selectedTreeNode.update();
		return false;
	}
	treeNode.showTree();
}

//-----------------------------------------------------------------------------
function drlPlaceFocus()
{
	try { 
		if(drlDrillObj.isNugglet) return;
			
		switch (drlDrillObj.mode)
		{
			case "explorer":
				if (drlDrillObj.treeHasFocus)
				{
					if (drlDrillObj.selectedListNode != null) 
						drlDrillObj.selectedListNode.switchSides();
					drlDrillObj.selectedTreeNode.update();
				}
				else
				{
					drlDrillObj.selectedTreeNode.switchSides();
					if (drlDrillObj.selectedListNode == null)
						drlDrillObj.selectedTreeNode.firstSelectableListNode();				
					drlDrillObj.selectedListNode.update();
				}
				break;

			case "select":
			case "list":
			case "genlist":
				if (document.getElementById("drlListView").className != "DrillInvisible")
				{
					drlDrillObj.treeHasFocus = false;
					if (drlDrillObj.selectedListNode == null)
					{
						var par = drlDrillObj.selectedTreeNode.getParentTreeNode();
						par.firstSelectableListNode();
					}
					drlDrillObj.selectedListNode.update();
				}
				break;

			case "attachment":
				if (drlDrillObj.treeHasFocus)
				{
					if (drlDrillObj.selectedListNode != null) 
						drlDrillObj.selectedListNode.switchSides();
					drlDrillObj.selectedTreeNode.update();
				}
				else
				{
					if (document.getElementById("drlListView").className != "DrillInvisible")
					{
						drlDrillObj.selectedTreeNode.switchSides();
						if (drlDrillObj.selectedListNode == null)
							drlDrillObj.selectedTreeNode.firstSelectableListNode();				
						drlDrillObj.selectedListNode.update();
					}
					else if (document.getElementById("drlAttachView").className != "DrillInvisible")
					{
						var elem = document.getElementById("txtAttachTitle");
						elem.focus();
						drlDrillObj.selectedTreeNode.switchSides();
						drlDrillObj.treeHasFocus = false;
					}
				}
				break;
		}
	} catch(e) { }
}

//-----------------------------------------------------------------------------
function drlPopulateColumnHeaders(oObj)
{
	// get column headers
    var column = null;
    var header = "";
	var colNodes = drlDrillObj.idaLoad.document.getElementsByTagName("COLUMN");
	var len = colNodes.length;
	oObj.hideColumnHeader = false;

	for (var x=0; x<len; x++)
	{
        header = "";
		column = colNodes[x];
		if (x == 0)
		{
			if (column.getAttribute("header") == "")
				oObj.hideColumnHeader = true;
			if (column.getAttribute("knowledge") == "true")
				oObj.knowledge = true;
		}

		var colLen = column.childNodes.length;
	    for (var i=0; i<colLen; i++)
	    {
		    if (column.childNodes[i].nodeType == 4)
		    {
			    header = column.childNodes[i].nodeValue;
			    break;
		    }
	    }
		oObj.columnHeaders[x] = new drlColumn();
		oObj.columnHeaders[x].populate(header, 
				column.getAttribute("name"), 
				(column.getAttribute("type") == "NUMERIC" 
				|| column.getAttribute("type") == "BCD" 
				|| column.getAttribute("type") == "ALPHARIGHT") 				
					? "right" : "left",
				"", "");
	}
}

//---------------------------------------------------------------------------------------
// copied from portal
function drlPositionInToolbar()
{
	var toolBar = document.getElementById("drlToolBar");
	if (!toolBar) return false;

	var tbList = toolBar.getElementsByTagName("BUTTON")
	var len = tbList.length;
	for (var i=0; i<len; i++)
	{
		if (tbList[i].disabled) continue;
		if (tbList[i].style.visibility == "hidden") continue;

		tbList[i].focus();
		return true;
	}
	return false;
}

//-----------------------------------------------------------------------------
function drlPrevious()
{
	drlDrillObj.setMessage("");
	var list = document.getElementById("drlList");
	var parentTree = list.getAttribute("parentTree");
	var treeNodeIndex = list.getAttribute("parentTreeNode");
	var tree = drlDrillObj.treeArray[parentTree];
	var treeNode = tree.nodes[treeNodeIndex];

	if (tree.nodes[treeNodeIndex].list.navigate.prevPage == "")
		return;

	tree.nodes[treeNodeIndex].list.navigate.page = "prev";
	treeNode.list.nodes = new Array();
	treeNode.tree.nodes = new Array();
	treeNode.visited = false;
	if (!treeNode.expanded)
		treeNode.expanded = false; 
	treeNode.idaCall = tree.nodes[treeNodeIndex].list.navigate.prevPage;
	var elem = document.getElementById(treeNode.id);
	drlRemoveChildren(elem.nextSibling);
	treeNode.show();
}

//-----------------------------------------------------------------------------
function drlProcessNextForList()
{
	var curIndex = drlDrillObj.makeIdaCall();
					
	// All required fields have been selected
	if (curIndex == drlDrillObj.oReqFields.reqFlds.length)
		drlCloseReturn(drlDrillObj.oReqFields);
	else
	{
		// Continue with the next call
		drlSetListDefineButton();
		drlDrillObj.tree.initialize();
		drlDrillObj.tree.root();

		drlDrillObj.refreshCallback = "drlDrillObj.processNextForListComplete";
		drlDrillObj.refresh(drlDrillObj.idaCall);
	}
}

//-----------------------------------------------------------------------------
function drlRemoveChildren(elem)
{
	if (elem.hasChildNodes())
	{
		while(elem.childNodes.length > 0)
			elem.removeChild(elem.childNodes[0]);
	}
}
//-----------------------------------------------------------------------------
function drlRemoveDrillAroundWnd(index)
{
	var oPortalDrill = drlPortal.drill;
	var oDrlAroundSelect = oPortalDrill.drillAroundAry[index];

	if(oDrlAroundSelect)
		oDrlAroundSelect.closeWindow();
	
	return true;	
}
//-----------------------------------------------------------------------------
function drlRemoveNavlet(nav)
{
	switch (nav)
	{
		case "drlViews":
			var elem = document.getElementById("drlViewSelect");
			elem.className = "DrillInvisible";
			drlDrillObj.view = "";
			drlDrillObj.oViews = null;
			break;

		case "drlFind":
			drlDrillObj.blnFindNext = false;
			drlDrillObj.blnReset = false;
			drlSetSearchButtons();
			break;

		case "drlDataDir":
			if (!drlDrillObj.isStandAlone)
				drlPortal.tabArea.tabs["PAGE"].removeNavlet("drlDataDir" + drlDrillObj.id);
			drlDrillObj.ddNavlet = null;
			break;
	}
}

//-----------------------------------------------------------------------------
function drlResetMailForm()
{
	var mailForm = document.getElementById("mailFrm");
	mailForm.src = drlPortal.path+"/blank.htm";
}

//-----------------------------------------------------------------------------
function drlResize(evt, bDoSize)
{
    evt = (evt) ? evt : ((window.event) ? window.event : "");
    if (!evt) return;

	if (typeof(bDoSize) == "undefined")
		bDoSize = (drlDrillObj.mode == "explorer" || drlDrillObj.mode == "attachment")
		    ? true 
		    : false;

	drlDoResize(evt, bDoSize);
}

//-----------------------------------------------------------------------------
function drlSetCallType(bIsTree)
{
	var keyfldsNode = drlDrillObj.idaLoad.document.getElementsByTagName("KEYFLD").item(0);

	if (keyfldsNode)
		return "OS";
	else
	{
		if (bIsTree)
			return null;
		else
			return "SL";
	}
}
//-----------------------------------------------------------------------------
function drlSetContextMenu(window, treeNode, key, elem, where, x, y)
{
	if (where.id == "drlList")
		drlSetListContext(window, treeNode, key);
	else
		drlSetTreeContext(window, treeNode, key);
	
	//determine if menu items were added
	var hasItems = false;	
	
	for(listObj in window.oDropdown.items)
	{
		hasItems = true
		break;
	}
	
	if(hasItems)	
		window.oDropdown.show("", elem, "drlDoContext", where, x, y);
		
	return 
}

//-----------------------------------------------------------------------------
function drlPrintableView()
{
	if(drlDrillObj.isStandAlone)
		drlPortalWnd.portalOnPrint(null, window);
	else
		drlPortalWnd.portalOnPrint();

}

//-----------------------------------------------------------------------------
function drlSetExplorerSelect(window, treeNode, key)
{
	if(drlDrillObj.isNugglet) return false;
	
	var oTree = treeNode;
	var oKeyNodes = null;
	var value = null;
	var _KNB = drlPortalWnd.getVarFromString("_KNB" , drlDrillObj.idaCall);
				
	while(oTree)
	{
		oKeyNodes = oTree.keyNodes;
		if(oKeyNodes)
		{
			var keyVals = oKeyNodes.getElementsByTagName("KEYFLD");

			for (var i=0; i < keyVals.length; i++)	
			{
				if (keyVals[i].getAttribute("keynbr") == _KNB && keyVals[i].hasChildNodes())
				{
					value = keyVals[i].childNodes[0].nodeValue;
					value = drlPortalWnd.trim(value);
					break;
				}
			}			
		
			if(value) break;
		 }
	
		oTree = oTree.getParentTreeNode();
	}
	
	if(value)
	{
		treeNode.keyNodes = oTree.keyNodes;				
		window.oDropdown.addItem(drlPortal.getPhrase("LBL_SELECT") + " " + value, "explorerselect|" + key);
		return true
	}
	
	return false
}

//-----------------------------------------------------------------------------
function drlSetFindFields(oObj)
{
	// return if storage object already exists
	if (oObj.findStorage)
		return;

	var findNodes = drlDrillObj.idaLoad.document.getElementsByTagName("FINDFLDS");
	var colNodes = drlDrillObj.idaLoad.document.getElementsByTagName("COLUMNS");
	var keyNodes = drlDrillObj.idaLoad.document.getElementsByTagName("KEYFIND");
	var strXML = "";

	if (drlDrillObj.bIsIE)
	{
		strXML += (findNodes.length == 0) ? "" : findNodes[0].xml;
		strXML += (colNodes.length == 0) ? "" : colNodes[0].xml;
		strXML += (keyNodes.length == 0) ? "" : keyNodes[0].xml;
	}
	else
	{
		var ser = new drlPortalWnd.XMLSerializer();
		strXML += (findNodes.length == 0) ? "" : ser.serializeToString(findNodes[0]);
		strXML += (colNodes.length == 0) ? "" : ser.serializeToString(colNodes[0]);
		strXML += (keyNodes.length == 0) ? "" : ser.serializeToString(keyNodes[0]);
	}
		
	strXML = "<SEARCH>" + strXML + "<FIELDS id=\"drill\" tab=\"\" ";
	strXML += "filter=\"" + drlPortalWnd.oUserProfile.getFindOption("otheroptions") + "\"></FIELDS>";
	strXML += "<OUTPUT><![CDATA[]]></OUTPUT></SEARCH>";
	oObj.findStorage = new drlPortalWnd.DataStorage(strXML);
}

//-----------------------------------------------------------------------------
function drlSetFocusBorder(blnFocus)
{
	if (drlDrillObj != null)
	{
		if (drlDrillObj.treeHasFocus != blnFocus)
		{
			drlDrillObj.treeHasFocus = blnFocus;
			setTimeout(drlPlaceFocus, 0);
		}
	}
}

//-----------------------------------------------------------------------------
function drlSetListContext(window, treeNode, key)
{
	switch (drlDrillObj.mode)
	{
		case "genlist":
			return;
			
		case "select":
			if (treeNode.callType == "OS")
			{
				if (!treeNode.isProtected && drlDrillObj.isDrillAllowed)
					window.oDropdown.addItem("Drill Around" + String.fromCharCode(174), "drillaround|" + key);
				
				if (!drlDrillObj.isNugglet)
					window.oDropdown.addItem(drlPortal.getPhrase("LBL_SELECT"), "selectrow|" + key);
			}
			break;
			
		case "list":
			if (treeNode.callType == "OS" && !drlDrillObj.isNugglet)
				window.oDropdown.addItem(drlPortal.getPhrase("LBL_SELECT"), "listrow|" + key);
				
			break;
			
		case "attachment":	
			if (!treeNode.isProtected)
				window.oDropdown.addItem(drlPortal.getPhrase("LBL_OPEN"), "openrow|" + key);
				
			break;
				
		case "explorer":
			if (!treeNode.isProtected)
			{
				window.oDropdown.addItem(drlPortal.getPhrase("LBL_OPEN"), "openrow|" + key);
				drlSetExplorerSelect(window, treeNode, key);
			}
			break;
	}
		
	return;
}
//-----------------------------------------------------------------------------
function drlSetListDefineButton()
{
	var index = drlDrillObj.reqCurrentIndex;
	
	if (index != null && drlDrillObj.oReqFields.reqFlds[index].deftkn != null)
		drlDrillObj.toolbar.changeButtonState("drlFormTransfer","enabled");
	else
		drlDrillObj.toolbar.changeButtonState("drlFormTransfer","disabled");

	return true;
}
//-----------------------------------------------------------------------------
function drlSetSearchButtons()
{
	if (drlDrillObj.toolbar && drlDrillObj.mode != "attachment")
	{
		drlDrillObj.toolbar.changeButtonState("drlSearch",
			(drlDrillObj.blnSearch ? "enabled" : "disabled"));

		drlDrillObj.toolbar.changeButtonState("drlFindNext",
			(drlDrillObj.blnFindNext ? "enabled" : "disabled"));

		drlDrillObj.toolbar.changeButtonState("drlReset",
			(drlDrillObj.blnReset ? "enabled" : "disabled"));
	}
}

//-----------------------------------------------------------------------------
function drlSetTitle(title)
{
	document.getElementById("drlTitleBar").className = "DrillTitleBar";
	var drlTitle = document.getElementById("drlTitle");
	drlTitle.childNodes[0].nodeValue = title;
	drlTitle.className = "DrillTitle";
}

//-----------------------------------------------------------------------------
function drlSetTitleBarBtn()
{
   	if(drlDrillObj.isDrilling)
   	{
   		var oDrlAroundSelect = drlPortal.drill.drillAroundAry[drillAroundWndId]      
   		
   		if(oDrlAroundSelect.targetWnd.drlDrillObj.isNugglet)
   		{
    	    drlEnableTitleBarBtn(false);
    	    return true;        		
    	}
    	
    	var btn = document.getElementById("drlTitleBarBtn");
    	var phrase = oDrlAroundSelect.getBtnTitle();
		btn.title = phrase;
		btn.value = phrase;	
		drlEnableTitleBarBtn(true);	
    }
    else
   	    drlEnableTitleBarBtn(false);
}

//-----------------------------------------------------------------------------
function drlSetTreeContext(window, treeNode, key)
{
	if(drlDrillObj.mode == "select" || drlDrillObj.mode == "list" || drlDrillObj.mode == "genlist")
	   	return;

	if (!treeNode.isLeafNode && !treeNode.isSecure && !treeNode.isProtected)	
	{
		if (treeNode.expanded)
			window.oDropdown.addItem(drlPortal.getPhrase("LBL_COLLAPSE"), "collapse|" + key);
		else
			window.oDropdown.addItem(drlPortal.getPhrase("LBL_EXPAND"), "expand|" + key);
	}

	if(!treeNode.isSecure && !treeNode.isProtected)
		window.oDropdown.addItem(drlPortal.getPhrase("LBL_OPEN"), "open|" + key);
	
	if(drlDrillObj.mode == "explorer")
		drlSetExplorerSelect(window, treeNode, key);
		
	return;
}

//-----------------------------------------------------------------------------
function drlSetToolBar(oObj)
{
	if (drlDrillObj.mode == "attachment" || typeof(oObj) == "undefined")
		return;

    switch (oObj.constructor)
    {
        case drlList:
			if (drlDrillObj.mode == "explorer")
			{
				drlDrillObj.blnReset = oObj.navigate.isFind;
				drlDrillObj.blnFindNext = (oObj.navigate.isFind) 
						? (oObj.navigate.findNext.length > 0) 
						: false;
			}
			drlSetSearchButtons();
			break;

    }
}

//-----------------------------------------------------------------------------
function drlStoreCaret(evt, elem)
{
	drlRange = document.selection.createRange();
}

//-----------------------------------------------------------------------------
function drlSwapPanes()
{
	if (drlDrillObj.mode == "explorer" || drlDrillObj.mode == "attachment")
	{
		if (drlDrillObj.treeHasFocus 
				&& drlDrillObj.selectedTreeNode.isLeafNode
				&& drlDrillObj.mode == "explorer")
			return true;
		else
		{
			drlSetFocusBorder(!drlDrillObj.treeHasFocus);
			return true;
		}
	}
	return true;
}

//-----------------------------------------------------------------------------
function drlSwitchToDrill()
{
	var phraseId = "";
	drlRemoveNavlet("drlViews");
	drlRemoveNavlet("drlFind");

	if (drlDrillObj.mode != "explorer")
	{
		if (drlDrillObj.tree.nodes.length <= 0 || drlDrillObj.tree.nodes[0].idaCall == null)
			return;

		drlDrillObj.idaCall = drlDrillObj.tree.nodes[0].idaCall;
		drlDrillObj.mode = "explorer";
		drlDrillObj.nbrRecords = drlPortalWnd.oUserProfile.getRecords(drlDrillObj.mode);
		phraseId = "Drill Around" + String.fromCharCode(174);
		drlDrillObj.toolbar.changeButtonText("toggleView",drlPortal.getPhrase("LBL_LIST_VIEW"));
		drlDrillObj.toolbar.changeButtonTitle("toggleView",drlPortal.getPhrase("LBL_SHOW_LIST_VIEW"));		
	}
	else
	{
		drlDrillObj.idaCall = drlDrillObj.idaOrig;
		drlDrillObj.mode = "select";
		drlDrillObj.nbrRecords = drlPortalWnd.oUserProfile.getRecords(drlDrillObj.mode);
		phraseId = "Drill Around" + String.fromCharCode(174);
		drlDrillObj.toolbar.changeButtonText("toggleView",drlPortal.getPhrase("LBL_EXPLORER_VIEW"));
		drlDrillObj.toolbar.changeButtonTitle("toggleView",drlPortal.getPhrase("LBL_SHOW_EXPLORER_VIEW"));		
	}
	
	drlDrillObj.tree.initialize();
	drlDrillObj.execute();

	if (!drlDrillObj.isStandAlone)
	{
		var title = drlPortal.getTitle();
		var pos = title.indexOf("-");
		if (pos > 0)
			title = title.substring(0, title.indexOf("-") + 2) + phraseId;
		else
			title += " - " + phraseId;
		drlPortal.setTitle(title);
	}
	
	drlPlaceFocus();
}

//-----------------------------------------------------------------------------
function drlToggleListHighlight(elem)
{
	var curElem = elem;
	while (curElem && curElem.tagName != "TR" && curElem.id != "drlList")
		curElem = curElem.parentNode;
	if (!curElem) return;

	var row = parseInt(curElem.id.replace("r", ""));
	var list = document.getElementById("drlList");
	var tblBody = list.getElementsByTagName("TBODY")[0];

	if (isNaN(row)) return false;
	if (!tblBody) return false;

	var totalRows = parseInt(tblBody.getAttribute("totalRows"));
	var oldRow = 0;
	var tblTr = drlFindCurrentRow();

	if (tblTr)
		oldRow = parseInt(tblTr.id.replace("r", ""));

	drlHighlightRow(row, oldRow);
}

//-----------------------------------------------------------------------------
function drlToggleTreeHighlight(origId, clickedId)
{
	if (origId != clickedId)
		document.getElementById(origId).className = "DrillTreeTextUnSelected";
}

//-----------------------------------------------------------------------------
function drlTreeKeyDown(evt, elem, keyVal)
{
	var evtCaught = false;
	// not a tree element, so cancel
	if (drlDrillObj.isIE && elem.id.indexOf("tn") != 0) return false;

	// left arrow|| numeric keypad minus || minus key 
	if (keyVal == 37 || keyVal == 109 || keyVal == 189)
	{
		// Collapse a branch node
		if (drlDrillObj.selectedTreeNode.expanded)
			drlDrillObj.selectedTreeNode.collapseTree();
		else if (keyVal == 37)
		{
			// Get parent node if node is already collapsed
			treeNode = drlDrillObj.selectedTreeNode.getParentTreeNode();
			if (treeNode)
			{
				drlRemoveNavlet("drlFind");
				treeNode.select();
			}
		}
		evtCaught = true;
	}
	// up arrow
	else if (keyVal == 38)
	{
		var tree = drlDrillObj.treeArray[drlDrillObj.selectedTreeNode.parentTree];
		var index = drlDrillObj.selectedTreeNode.index;

		// Get the previous sibling node on this tree
		var treeNode = tree.prevSelectableNode(index);
		if (treeNode == null)
		{
			// Get the parent node since at the first selectable child node
			treeNode = drlDrillObj.selectedTreeNode.getParentTreeNode();
		}
		else
		{
			// Traverse the tree down to the last non-expandable node
			while (treeNode != null && treeNode.expanded)
			{
				var parentTreeNode = treeNode;
				treeNode = treeNode.tree.prevSelectableNode(treeNode.tree.nodes.length);
			}

			if (treeNode == null)
			{
				// Get the parent node since no selectable child nodes exists
				treeNode = parentTreeNode;
			}
		}
		if (treeNode)
		{
			drlRemoveNavlet("drlFind");
			treeNode.show();
		}
		evtCaught = true;
	}
	// right arrow || numeric keypad plus || Shift plus key
	else if (keyVal == 39 || keyVal == 107 || (!evt.altKey && !evt.ctrlKey && evt.shiftKey && keyVal == 187))
	{
		// expand a collapsed branch node
		if (!drlDrillObj.selectedTreeNode.isLeafNode)
		{
			if (drlDrillObj.selectedTreeNode.expanded && keyVal == 39)
			{
				// get the first selectable child
				var treeNode = drlDrillObj.selectedTreeNode.tree.nextSelectableNode(-1);
				if (treeNode)
				{
					drlRemoveNavlet("drlFind");
					treeNode.select();
				}
			}
			else
				drlDrillObj.selectedTreeNode.expandTree();
		}

		evtCaught = true;
	}
	// down arrow
	else if (keyVal == 40)
	{
		if (drlDrillObj.selectedTreeNode.isLeafNode 
		|| !drlDrillObj.selectedTreeNode.expanded)
		{
			var tree = drlDrillObj.treeArray[drlDrillObj.selectedTreeNode.parentTree];
			var index = drlDrillObj.selectedTreeNode.index;
		}
		else
		{
			var tree = drlDrillObj.selectedTreeNode.tree;
			var index = -1;
		}

		// Get the next sibling node on this tree
		var nextNode = tree.nextSelectableNode(index);
		if (nextNode == null)
		{
			// Traverse up the tree to find the next node
			var treeNode = drlDrillObj.selectedTreeNode;
			var parentTreeNode = treeNode.getParentTreeNode();
			if (parentTreeNode != null)
				tree = parentTreeNode.tree;
			else
				tree = drlDrillObj.treeArray[drlDrillObj.selectedTreeNode.parentTree];

			while (tree != null && nextNode == null)
			{
				var nextNode = tree.nextSelectableNode(treeNode.index);
				if (nextNode == null)
				{
					var tree = treeNode.getGrandparentTree();
					var treeNode = treeNode.getParentTreeNode();
				}
			}
		}
		if (nextNode)
		{
			drlRemoveNavlet("drlFind");
			nextNode.show();
		}
		evtCaught = true;
	}
	// end
	else if (keyVal == 35)
	{
		var tree = drlDrillObj.tree;
		var lastNode = tree.lastSelectableNode();
		// get last child
		while (lastNode != null && lastNode.expanded)
			lastNode = lastNode.tree.lastSelectableNode();
		if (lastNode)
		{
			drlRemoveNavlet("drlFind");
			lastNode.show();
		}
		evtCaught = true;
	}
	// home
	else if (keyVal == 36)
	{
		drlRemoveNavlet("drlFind");
		drlDrillObj.rootNode.show();
		evtCaught = true;
	}

	return evtCaught;
}

//-----------------------------------------------------------------------------
function drlUndefineToBlank(val)
{
	if (typeof(val) == "undefined")
		return "";
	else
		return val;
}

//-----------------------------------------------------------------------------
function drlUnload()
{
	if(drlDrillObj.isDrilling)
	{
		drlRemoveDrillAroundWnd(drillAroundWndId);
		return; 
	}

	if (drlDrillObj.isStandAlone && drlDrillObj.mode != "drlCloseReturn")
		drlCloseReturn(null);
	
	drlDrillObj = null;
	if (drlAboutWnd)
		drlAboutWnd.close();
	if (drlSearchWnd)
		drlSearchWnd.close();

	drlCloseDrillAroundWnds();	
}
//-----------------------------------------------------------------------------
var dragObj = new Object();

//-----------------------------------------------------------------------------
function dragStart(evt)
{
	var el;
	var x, y;

    evt = (evt) ? evt : ((window.event) ? window.event : "");
    if (!evt) return;
	dragObj.elNode = drlPortalWnd.getEventElement(evt);

	// Get cursor position with respect to the page.
	if (drlDrillObj.bIsIE)
	{
		x = window.event.clientX + document.documentElement.scrollLeft
		  + document.body.scrollLeft;
		y = window.event.clientY + document.documentElement.scrollTop
		  + document.body.scrollTop;
	}
	else
	{
		x = evt.pageX;
		y = evt.pageY;
	}

	// Save starting positions of cursor and element.
	dragObj.cursorStartX = x;
	dragObj.cursorStartY = y;
	dragObj.elStartLeft = parseInt(dragObj.elNode.style.left, 10);
	dragObj.elStartTop = parseInt(dragObj.elNode.style.top, 10);

	if (isNaN(dragObj.elStartLeft)) dragObj.elStartLeft = 0;
	if (isNaN(dragObj.elStartTop))  dragObj.elStartTop = 0;

	// Capture mousemove and mouseup events on the page.
	if (drlDrillObj.bIsIE)
	{
		dragObj.elNode.setCapture();
		document.attachEvent("onmousemove", dragGo);
		document.attachEvent("onmouseup", dragStop);
		window.event.cancelBubble = true;
		window.event.returnValue = false;
	}
	else
	{
	    document.addEventListener("mousemove", dragGo, true);
	    document.addEventListener("mouseup", dragStop, true);
	    evt.preventDefault();
	}
}

//-----------------------------------------------------------------------------
function dragGo(evt)
{
	var x, y;

	// Get cursor position with respect to the page.
	if (drlDrillObj.bIsIE)
	{
		x = window.event.clientX + document.documentElement.scrollLeft
		  + document.body.scrollLeft;
		y = window.event.clientY + document.documentElement.scrollTop
		  + document.body.scrollTop;
	}
	else
	{
		x = evt.pageX;
		y = evt.pageY;
	}

	// Move drag element by the same amount the cursor has moved.
	var scrWidth = (drlDrillObj.bIsIE) ? document.body.offsetWidth : window.innerWidth;
	dragObj.elNode.style.left = (dragObj.elStartLeft + x - dragObj.cursorStartX) + "px";

	if (parseInt(dragObj.elNode.style.left) < 50 )
		dragObj.elNode.style.left = "50px";
	if (parseInt(dragObj.elNode.style.left) > scrWidth - 50)
		dragObj.elNode.style.left = scrWidth - 50 + "px";

	var tree = document.getElementById("drlTree");
	var splitBar = document.getElementById("drlSplitBar");
	var listview = document.getElementById("drlListView");
	var head = document.getElementById("drlHeader");
	var list = document.getElementById("drlList");
	var listscroll = document.getElementById("drlListScroll");
	var footer = document.getElementById("drlFooter");
	var attach = document.getElementById("drlAttachView");
	var xFrame = document.getElementById("drlwdav");

	tree.style.width = dragObj.elNode.style.left;
	splitBar.style.left = (drlDrillObj.bIsIE) ? tree.style.width : parseInt(tree.style.width) + 3;
	listview.style.left = dragObj.elNode.offsetLeft + splitBar.offsetWidth;
	attach.style.left = dragObj.elNode.offsetLeft + splitBar.offsetWidth;

	listview.style.width = scrWidth - listview.offsetLeft;
	attach.style.width = scrWidth - attach.offsetLeft;

	// 16 is width of possible scrollbars
	head.style.width = parseInt(listview.style.width)-16;
	list.style.width = listview.style.width;
	footer.style.width = listview.style.width;

	if (listscroll)
		listscroll.style.width = parseInt(listview.style.width)-16;

	if (drlDrillObj.bIsIE)
	{
	    window.event.cancelBubble = true;
	    window.event.returnValue = false;
	}
	else
		evt.preventDefault();
}

//-----------------------------------------------------------------------------
function dragStop(evt)
{
	// Stop capturing mousemove and mouseup events.
	if (drlDrillObj.bIsIE)
	{
	    document.detachEvent("onmousemove", dragGo);
	    document.detachEvent("onmouseup", dragStop);
	    document.releaseCapture();
	}
	else
	{
	    document.removeEventListener("mousemove", dragGo, true);
	    document.removeEventListener("mouseup", dragStop, true);
	}
}
//------------------------------------------------------------------------------
function mapScroll()
{
	var drlHeader = this.document.getElementById("drlHeader");
	var drlList = this.document.getElementById("drlList");
	drlHeader.scrollLeft = drlList.scrollLeft;
}
