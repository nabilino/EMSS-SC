/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/users/subscriptions/subscriptions.js,v 1.50.2.26.4.18.12.3.2.5 2012/08/08 12:37:28 jomeli Exp $ */
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

// subscriptions - bookmarks available/shown to user
// layout - describing home page content
// + navlet - navigation bookmark
// + nuglet - layout bookmark content

// uses xauthen retrieved bookmarks for current accessible bookmark data
// uses dme to determine unsubscribed bookmarks
// uses portal-loaded profile for previous layout

var authenPath = "/cgi-lawson/xauthen.exe?ADMIN=TRUE"

var portalWnd=null;
var portalObj=null;

// data storage
var objAdminAuthen = null
var objAdminBlocks = null
var objBookmarkKeys = null
var objContent = null
var objNavigation = null
var objPortalUser = null
var objUserBlocks = null
var objSubscriptions = null

var arrBmNodes = null
var arrBookmarkObj = null
var arrNavlets = null
var arrNavletSpans = null
var arrNuglets = null
var arrNugletSpans = null
var divBookmarks = null
var hotNode = null
var hotSpan = null
var isIE = false;
var lastEye = null
var lcCell = null
var profile = null
var profileDoc = null
var lyrDrag = null
var lyrLayout = null
var oFeedBack = null;
var mdX = null
var mdY = null
var nodeLeftPane = null
var nodeRightPane = null
var lastNavlet = null
var lastNuglet = null
var layoutLeft = null
var layoutLoaded = null
var layoutTop = null
var rcCell = null
var txtSearch = null

var nextStart = 0
var prevStart = 0
var currentStart = 0
var indentPx = 16
var loadCount = 0
var viewRecords = 20 // size of top level links to show on one screen
var gridPx = 10

// phrases
var collapsePhrase = null
var colWidthPhrase = null
var dragDblClickPhrase = null
var expandPhrase = null
var inLayoutPhrase = null
var	locked1Phrase = null
var	locked2Phrase = null
var	lockedLayoutPhrase = null
var	lockedSubPhrase = null
var lockedUnsubPhrase = null
var noLayoutPhrase = null
var mainContentPanePhrase = null
var navPanePhrase = null
var noChildrenPhrase = null
var relocatingPhrase = null
var removeLayoutPhrase = null
var selectPhrase = null
var subscribedPhrase = null
var successPhrase = null
var toggleStatePhrase = null
var unsubscribedPhrase = null
var	yourAdminPhrase = null

// xml tags
var ATTR_KEY = "key"
var ATTR_NAME = "nm"
var ATTR_URL = "url"
var ATTR_DIR = "dir"
var ATTR_WIDTH = "width"
var ATTR_STATE = "state"
var ATTR_TYPE = "type"
var ATTR_SUBSCRIPTION = "subscription"
var ATTR_LAYOUT = "layout"

var EXPAND_COLLAPSED = "collapsed"
var EXPAND_NO_CHILDREN = "nochildren"
var EXPAND_EXPANDED = "expanded"

var TAG_AUTHEN_BOOKMARK = "Bookmark"
var TAG_AUTHEN_BOOKMARKS = "Bookmarks"
var TAG_PROFILE_WEBUSER = "WEBUSER"
var TAG_BLOCK = "BLOCK"
var TAG_BLOCK_CHECK = "BLOCK_CHECK"
var TAG_BLOCKS = "BLOCKS"
var TAG_BOOKMARK = "BOOKMARK"
var TAG_BOOKMARKS = "BOOKMARKS"
var TAG_CONTENT = "CONTENT"
var TAG_FLOW = "FLOW"
var TAG_DME_MESSAGE = "MESSAGE"
var TAG_MESSAGE = "Message"
var TAG_MSGNBR = "MsgNbr"
var TAG_NAVIGATION = "NAVIGATION"
var TAG_NAVLET = "NAVLET"
var TAG_NUGLET = "NUGLET"
var TAG_PORTAL_USER = "PORTAL_USER"
var TAG_DATE = "DATE"
var TAG_TIME = "TIME"

var LOCK_ADMIN = "admin"
var LOCK_USER = "user"

var DIR_HORIZONTAL = "h"
var DIR_VERTICAL = "v"

var MODE_LAYOUT = "layout"
var MODE_SUBSCRIPTION = "subscription"

//-----------------------------------------------------------------------------
function initSubscriptions()
{
	portalWnd=envFindObjectWindow("lawsonPortal");
	if (!portalWnd.lawsonPortal || !portalWnd.oUserProfile)
	{
		setTimeout("initSubscriptions()",300)
		return
	}

	// load the script versions
	envLoadWindowScriptVersions(portalWnd.oVersions,window,portalWnd);

	portalObj = portalWnd.lawsonPortal;
	profile = portalWnd.oUserProfile;
	profileDoc = portalWnd.oUserProfile.storage.getDocument();
	isIE = portalObj.browser.isIE;
	
	// link object elements
	var divTip=document.getElementById("divTip")
	divBookmarks=document.getElementById("divBookmarks")
	lyrLayout = document.getElementById("lyrLayout")
	lyrLayout.onselectstart = portalWnd.cmnBlockSelect;
	lyrDrag = document.getElementById("lyrDrag")

	// get subscription messages	
	subMsgs=new portalWnd.phraseObj("subscriptions")
	collapsePhrase = subMsgs.getPhrase("LBL_COLLAPSE")
	colWidthPhrase = portalObj.getPhrase("LBL_COLUMN_WIDTH")
	dragDblClickPhrase = subMsgs.getPhrase("LBL_DRAG_DBL_CLICK")
	expandPhrase = subMsgs.getPhrase("LBL_EXPAND")
	noChildrenPhrase = subMsgs.getPhrase("LBL_NO_CHILDREN")
	mainContentPanePhrase = subMsgs.getPhrase("LBL_MAIN_CONTENT")
	inLayoutPhrase = subMsgs.getPhrase("LBL_IN_LAYOUT")
	noLayoutPhrase = subMsgs.getPhrase("LBL_NO_LAYOUT")
	navPanePhrase = subMsgs.getPhrase("LBL_NAVIGATION")
	relocatingPhrase = 	portalObj.getPhrase("LBL_RELOCATING")
	removeLayoutPhrase = portalObj.getPhrase("LBL_REMOVE_LAYOUT")
	subscribedPhrase = subMsgs.getPhrase("LBL_SUBSCRIBED_DESC")
	successPhrase = portalObj.getPhrase("CHANGE_SUCCESSFUL")
	unsubscribedPhrase = subMsgs.getPhrase("LBL_UNSUBSCRIBED_DESC")
	toggleStatePhrase = portalObj.getPhrase("LBL_TOGGLE_STATE")
	locked1Phrase = portalObj.getPhrase("LBL_LOCKED1")
	locked2Phrase = portalObj.getPhrase("LBL_LOCKED2")
	lockedSubPhrase = portalObj.getPhrase("LBL_LOCKED_SUB")
	lockedUnsubPhrase = portalObj.getPhrase("LBL_LOCKED_UNSUB")
	lockedLayoutPhrase = portalObj.getPhrase("LBL_LOCKED_LAYOUT")
	yourAdminPhrase = portalObj.getPhrase("LBL_YOUR_ADMIN")
	
	// fill in text spans, translations
	var subPhrase = subMsgs.getPhrase("LBL_SUBSCRIPTIONS")
	var lblSubHeader=document.getElementById("lblSubHeader")
	portalWnd.cmnSetElementText(lblSubHeader,subPhrase)
	var layoutPhrase = subMsgs.getPhrase("LBL_LAYOUT")
	var lblLayoutHeader=document.getElementById("lblLayoutHeader")
	portalWnd.cmnSetElementText(lblLayoutHeader,layoutPhrase)

	var findPhrase = portalObj.getPhrase("LBL_FIND") 
	var spansearch=document.getElementById("spansearch")
	portalWnd.cmnSetElementText(spansearch,findPhrase)
	spansearch.title = findPhrase
	lyrDrag.style.backgroundColor = "transparent"
	lyrDrag.style.cursor = "move"
	
	// title at the top
	var contentPhrase = subMsgs.getPhrase("LBL_CONTENT")
	portalObj.setTitle(contentPhrase)
	with (portalObj.toolbar)
	{
		target = window
		clear()
		createButton(subMsgs.getPhrase("LBL_SAVE"), subSubmit, "save", "disabled")
		createButton(portalObj.getPhrase("LBL_RELOAD_PORTAL"), subReloadPortal, "reload", "disabled")
		createButton(portalObj.getPhrase("LBL_REFRESH"), subRefresh, "refresh")
		createButton(portalObj.getPhrase("LBL_PREVIOUS"), goPrev, "prev",null,null,"prev")
		createButton(portalObj.getPhrase("LBL_NEXT"), goNext, "next",null,null,"next")
		createButton(portalObj.getPhrase("LBL_HOME"), subCancel, "cancel", "", "", "home");
	}

	// Set non-IE positions
	if (!isIE)
	{
		divBookmarks.style.top = parseInt(divBookmarks.style.top,10) + 3;
		divBookmarks.style.width = parseInt(divBookmarks.style.width,10) + 2;
		lyrLayout.style.top = parseInt(lyrLayout.style.top,10) + 3;
	}
	// reposition find box
	sizeFind() 

	// Feedback object
	oFeedBack = new FeedBack(window,portalWnd);

	setTimeout("initSubscriptions2()",100)
}

function initSubscriptions2()
{	
	// all bookmarks available to this user
	var lbm=loadBookmarks()
	if (!lbm)
	{
		portalWnd.goBack()
		return
	}

	statusUpdate(subMsgs.getPhrase("LBL_LOADING_SUBSCRIPTION_SETTINGS"))

	// bookmarks this user doesn't want to display
	objSubscriptions = loadUnsubscribed();

	// load layout - objBookmarksKeys is needed for render bookmarks
	loadLayout()
	
	// if subscription locked, but unsubscribe, resubscribe
	// if layout locked, but not in layout, add to layout
	checkLocked()

	// subscriptions
	prevStart = 0
	nextStart = viewRecords
	renderBookmarks(0)

	// layout
	renderLayout()

	// add return press check
	txtSearch=document.getElementById("txtSearch")
	txtSearch.onkeypress=keyPress
	txtSearch.focus()
	
	portalWnd.cmnClearStatus();
	
	divBookmarks.style.visibility = "visible"
	lyrLayout.style.visibility = "visible"
	
	// turn off right click and enable popup hide
	document.oncontextmenu = noContextMenu
}

function noContextMenu(e)
{
	if (isIE)
	{
		window.event.cancelBubble = true
		window.event.returnValue = false
	}
	return false
}

function sizeFind()
{
	// reposition the find div
	var scrWidth=(isIE
		? document.body.offsetWidth
		: window.innerWidth);
	var scrHeight=(isIE
		? document.body.offsetHeight
		: window.innerHeight);
	
	// push divFind to bottom of page
	var divFind=document.getElementById("divFind")
	var findHeight = parseInt(divFind.style.height,10)
	var findTop = scrHeight - findHeight - ((isIE) ? 0 : 2);
	divFind.style.left = "0px"
	divFind.style.top = findTop + "px";

	// resize divBookmarks between top and divFind
	var diff = (isIE) ? 0 : 2;
	var bookmarkTop = parseInt(divBookmarks.style.top,10)
	var bookmarkHeight = (scrHeight - bookmarkTop - findHeight - diff)
	if (bookmarkHeight < 8) return;
	var bookmarkLeft = parseInt(divBookmarks.style.left,10)
	var bookmarkWidth = parseInt(divBookmarks.style.width,10)
	divBookmarks.style.height = bookmarkHeight + "px"

	var top = parseInt(lyrLayout.style.top) + diff;
	var left = bookmarkLeft + bookmarkWidth + ((isIE) ? 5 : 7) 
	var width = scrWidth - left;
	var height = scrHeight - top + ((isIE) ? 0 : 2);
	if (width < 8) return;

	lyrLayout.style.left = left + "px"
	lyrLayout.style.height = height + "px"
	lyrLayout.style.width = width + "px"

	var hdr = document.getElementById("lblLayoutHeader");
	hdr.style.left = left + "px"
	hdr.style.width = width + "px"

	if (typeof(oFeedBack && oFeedBack.resize) == "function")
		oFeedBack.resize();
}

function unloadFunc()
{
	portalWnd.cmnClearStatus();
	if (profile.getModified()) //use this instead of isDirty, see LSF-1932
	{
		if (confirm(portalObj.getPhrase("LBL_SAVE_LAYOUT_QUESTION")))
			subSave();
		setDirty(false);
	}
	if (typeof(portalWnd.formUnload) == "function")
		portalWnd.formUnload();
}

///// Subscriptions

function loadBookmarks()
{	
	// arrBmNodes preserves the tree structure
	arrBmNodes = new Array()
	
	// arrBookmarkObj has bookmark objects
	arrBookmarkObj = new Array()

	var loadErr=portalObj.getPhrase("AGSXMLERROR") + " - " + subMsgs.getPhrase("LBL_LOADING_BOOKMARKS")
	if (objAdminAuthen==null)
	{
		try {
			var api = authenPath;
			// get request storage
			portalObj.setMessage(portalObj.getPhrase("LBL_LOADING"));
			var oXml = portalWnd.httpRequest(api, null, "", "", false);
			oXml = (oXml ? new portalWnd.DataStorage(oXml) : null);
			portalObj.setMessage("");
			objAdminAuthen = oXml;
			
			// no object error
			if (!objAdminAuthen)
			{
				var msg=portalObj.getPhrase("msgErrorInvalidResponse") + 
					" xauthen service:\n" + api + "\n";
				portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
				return false;
			}
			
			// status error
			if (objAdminAuthen.document.status)
			{
				var msg=portalObj.getPhrase("msgErrorReportedBy") + " xauthen service:\n";
				msg += portalWnd.getHttpStatusMsg(objAdminAuthen.document.status);
				portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
				return false;
			}
			
			// check root node for error...
			if (objAdminAuthen.isErrorDoc())
			{
				var stdError = this.portalObj.getPhrase("msgErrorReportedBy") + " xauthen";
				this.portalWnd.oError.displayIOSErrorMessage(objAdminAuthen, true, stdError, window);
				return false;
			}

			// check for custom xauthen error...
			var arrErr=objAdminAuthen.document.getElementsByTagName("ErrorMsg")
			var errLen=(arrErr?arrErr.length:0)
			if(errLen)
			{
				var msg = loadErr+"\n";
				for(var i=0; i<errLen; i++)
					msg += arrErr[i].firstChild.nodeValue+"\n";
				portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
				return false;
			}

		} catch (e)	{
			portalWnd.displayExceptionMessage(e,"users/subscriptions/subscription.js","loadBookmarks",loadErr);
			return false
		}
	}
	
	// loop through and store bookmarks - preserve hierarchy!
	try
	{
		statusUpdate(subMsgs.getPhrase("LBL_STORING_BOOKMARKS"))
		var objBookmark=objAdminAuthen.document.getElementsByTagName(TAG_AUTHEN_BOOKMARKS)
		var lenBookmark=(objBookmark?objBookmark.length:0)
		if (!lenBookmark) {
			portalWnd.cmnDlg.messageBox(loadErr + " [379]");
			return false
		}

		objBookmark=objBookmark[0]
		var len = (objBookmark && objBookmark.childNodes ?
			objBookmark.childNodes.length : 0)
		for (var i=0; i < len; i++)
		{
			if ((objBookmark.childNodes[i].nodeType == 1)
			&& (objBookmark.childNodes[i].tagName == TAG_AUTHEN_BOOKMARK))
			{
				var node=objBookmark.childNodes[i]
				if (!portalWnd.cmnArrayContains(arrBmNodes,node))
					arrBmNodes[arrBmNodes.length] = node
			}
		}
	
		// sort listing alphabetically
		arrBmNodes.sort(compareBookmarks)
		
		statusUpdate(subMsgs.getPhrase("LBL_CREATING_BOOKMARK_INDEX"))
		getBookmarkHash17()

	} catch (e) {
		portalWnd.displayExceptionMessage(e,"users/subscriptions/subscription.js","loadBookmarks",loadErr);
		return false
	}
	return true
}

function getBookmarkHash17()
{
	var objBookmark=objAdminAuthen.document.getElementsByTagName(TAG_AUTHEN_BOOKMARK)
	var key
	var bm
	for (var i=0; i < objBookmark.length;i++)
	{
		bm = objBookmark[i]
		key = bm.getAttribute(ATTR_KEY)
		var bObj = new BookmarkObj(key)
		bObj.content = bm
		arrBookmarkObj[arrBookmarkObj.length] = bObj
	}
	objBookmark=null
}

function compareBookmarks(bm1, bm2)
{
	var nm1 = (bm1.getAttribute(ATTR_NAME)).toLowerCase()
	var nm2 = (bm2.getAttribute(ATTR_NAME)).toLowerCase()
	return ( nm1 < nm2 ? -1 : (nm1 == nm2 ? 0 : 1) );
}

// load a trimmed array of the bookmark keys that this user doesn't want to display
function loadUnsubscribed()
{
	portalWnd.arrUnsub = new Array();
	var userId = profile.getId();
	if (!userId) return false;		// DME call will fail!
	
	try {
		var query = "PROD=LOGAN" +
				"&FILE=LOUSRBKOPT" +
				"&FIELD=BOOK-MARK;" +
				"&INDEX=UBOSET1" +
				"&KEY=" + userId +
				"&MAX=600" +
				"&OUT=XML";
				
		var req = new portalWnd.DMERequest(portalWnd, query);
		var res = req.getResponse(false);
		if (res.error)
		{
			var errorNodes = res.resDoc.getElementsByTagName("ERROR");
			var error = errorNodes ? errorNodes[0] : null;
			var key = error ? error.getAttribute("key") : null;
			if (key != "ITEM_SECURED")	
				portalWnd.cmnDlg.messageBox(res.error, "ok", "stop");
			return false;
		}
		var len = res.getNbrRecs();
		var key;
		for (var j=0;j<len;j++) {
			// get DME columns
			key = res.getRecordValue(j,0);
			
			// this is where home.js and subscription.js differ
			if (key) {
				// store the bookmark that the user is unsubscribed to
				portalWnd.arrUnsub[portalWnd.arrUnsub.length]=key;
				var bObj = getTrimBookmarkObj(portalWnd.trim(key));
				if (bObj)
					bObj.unsubscribed = true;
			}
		}
		return true;

	} catch (e)	{
		portalWnd.displayExceptionMessage(e,"users/subscriptions/subscriptions.js","loadUnsubscribed");
		return false;
	}
}

function goPrev()
{
	if (prevStart == currentStart)
	{
		portalWnd.cmnDlg.messageBox(subMsgs.getPhrase("LBL_NO_PREV_BOOKMARKS"));
		return
	}
	// reset the search-related nodes
	bookmarkResetSearch()
	renderBookmarks(prevStart)
}

function goNext()
{
	if(nextStart > arrBmNodes.length)
	{
		portalWnd.cmnDlg.messageBox(subMsgs.getPhrase("LBL_NO_NEXT_BOOKMARKS"));
		return
	}
	// reset the search-related nodes
	bookmarkResetSearch()
	renderBookmarks(nextStart)
}

function doSearch()
{
	// reset the search-related nodes
	bookmarkResetSearch()

	var strSearch = txtSearch.value.toLowerCase()

	// if no search string, refresh display to start
	if (strSearch == "")
	{
		renderBookmarks(0)
		return
	}
	
	// search through bookmarks from the current start point for the string
	var len = arrBmNodes.length
	var strName
	for (var i = currentStart; i < len; i++)
	{
		if (findBookmarkWithin(arrBmNodes[i],strSearch))
		{
			renderBookmarks(i)
			return
		}
	}
	
	// if did not start at beginning, try again from start
	for(var i = 0; i < currentStart; i++)
	{
		if (findBookmarkWithin(arrBmNodes[i],strSearch))
		{
			renderBookmarks(i)
			return
		}
	}
	
	// did not find
	portalWnd.cmnDlg.messageBox(subMsgs.getPhrase("LBL_BOOKMARK_NOT_FOUND")+" (calling data mining engine)");
}

function findBookmarkWithin(bm, strSearch)
{
	var found = false
	if (isBookmarkNode(bm))
	{
		var strName = bm.getAttribute(ATTR_NAME)
		strName=strName.toLowerCase()	
		if(strName.indexOf(strSearch)>-1)
			found=true
		else
		{
			// look through children
			for(var i = 0; i < bm.childNodes.length && !found; i++) {
				found|=findBookmarkWithin(bm.childNodes[i], strSearch)
			}

			// if we found one in our children, remember that we want to open later
			if (found) {
				var key = bm.getAttribute(ATTR_KEY)
				var bObj = getBookmarkObj(key)
				if (bObj)
					bObj.search=true
			}
		}
	}
	return found
}

function renderBookmarks(i)
{
	statusUpdate(subMsgs.getPhrase("LBL_RENDERING_SUBSCRIPTIONS"))

	if (arrBmNodes)
	{
		// increment layer numbers - do not want to affect invisible layers
		loadCount++
	
		// clear old object references
		clearBookmarkObjSubscriptions()
		
		// remove/hide previous layers
		abandonChildrenLight(divBookmarks)
	
		currentStart=i
		prevStart = Math.max(0,i - viewRecords)
		nextStart = i + viewRecords

		// set next/prev button states
		portalObj.toolbar.changeButtonState("prev", 
					prevStart == currentStart ? "disabled" : "enabled");
		portalObj.toolbar.changeButtonState("next", 
					nextStart > arrBmNodes.length ? "disabled" : "enabled");

		renderNode(1, arrBmNodes, divBookmarks, i)
	
		// open the search-related divs
		bookmarkOpenSearch()
	}
	
	if (arrNavlets && arrNuglets)
		// have rendered layout, so update the subscribed bookmarks
		setTimeout("refreshLayoutBolds()",10)
	portalWnd.cmnClearStatus();
}

// perform partial render of the divBookmarks nodes
function renderNode( level, nodelist, parentNode, startindex )
{
	var len = nodelist.length;
	
	if(!len) 
		return null;

	var locSpacerImg = document.createElement("button");
	locSpacerImg.className="btnCon";
	locSpacerImg.disabled=true;
				
	var locBookImg = document.createElement("button");
	locBookImg.title = noChildrenPhrase;
	locBookImg.status = "closed";
	locBookImg.className="btnConEmptyBk";
	
	// top level - restrict to viewRecords
	var start = (level == 1 ? startindex : 0);
	var end = (level == 1 ? Math.min(len, startindex + viewRecords) : len);

	for (var i=start; i<end; i++)
	{
		var node = nodelist[i];
		
		if (!isBookmarkNode(node)) ///WHAT DOES THIS CHECK
			continue;
		
		var key = node.getAttribute(ATTR_KEY);
		var url = node.getAttribute(ATTR_URL);
			
		var bObj = getBookmarkObj(key);

		if (bObj == null) 
			return null;

		// a tree div - do not specify height, width, allow to auto-flow of contents
		var div=document.createElement("div")
		div.id="div"+key;
		div.bObj = bObj
		div.canHide = true
		div.className = "conNode"
		div.content = node
		div.hasChildren=bookmarkHasChildren(bObj)				
		div.expandStatus = (div.hasChildren?EXPAND_COLLAPSED:EXPAND_NO_CHILDREN) // collapsed, expanded, nochildren
		div.level = level
		div.key = key
		div.mode = MODE_SUBSCRIPTION
		div.sublock = (bObj.childLock?bObj.childLock:getBookmarkLock(key,ATTR_SUBSCRIPTION))
		div.hasURL = ((typeof(url)!="undefined") && (url != ""));
		
		if (!bObj.tp)
			bObj.tp = ((div.hasChildren || !div.hasURL)?TAG_NAVLET:TAG_NUGLET)
		
		div.tp = bObj.tp
		div.style.display = (level==1 ? "block" : "none");

		// eye - only show if subscriptions are unlocked on server
		div.eye = null;
		if (objSubscriptions)
		{
			if (div.sublock)
			{
				div.eye = document.createElement("button")
				div.eye.className = "btnConVisLocked"
				div.eye.title = getSublockPhrase(div.sublock,!bObj.unsubscribed)
			}
			else
			{
				div.eye = document.createElement("input")
				div.eye.type = "checkbox" 
				div.eye.className = "btnConVis"
				div.eye.onclick = divEyeClick
				div.eye.title = (bObj.unsubscribed?unsubscribedPhrase:subscribedPhrase)
			}
			// code to better visualize if children can be checked/unchecked.
			var parBookmark = getBookmarkObjParent(bObj);
			if (parBookmark && !isSubscribedObj(parBookmark))
			{
				div.eye.style.visibility = "hidden";
			}
			div.eye.div = div
			div.appendChild(div.eye)
		}

		// ind
		if(level>1)
		{
			div.ind = locSpacerImg.cloneNode(false)
			div.ind.style.width = ((level-1)*indentPx) + "px"
			div.appendChild(div.ind)
		}
							
		// book
		div.book = locBookImg.cloneNode(false)
		div.book.div = div
		if (div.hasChildren) {
			div.book.onclick = divBookClick
			div.book.title = expandPhrase
			div.book.className="btnConClosedBk"
		}
		div.appendChild(div.book)
		// drag	
		div.drag = document.createElement("button")		
		div.drag.div = div
		div.drag.className="conNodeText";
		
		if(allowSubscription(div))
		{
			div.drag.onclick = divDragClick;
			div.drag.ondblclick = divDragDblClick;
			div.drag.onmousedown = divDragStart;
			div.drag.onselectstart = portalWnd.cmnBlockSelect;
			div.drag.title=(bObj.unsubscribed ? noLayoutPhrase : dragDblClickPhrase);
		}
		else
			div.drag.disabled = true;
		
		div.drag.appendChild(document.createTextNode(getBookmarkObjName(bObj)))
		div.appendChild(div.drag)
		parentNode.appendChild(div)
		bObj.div = div

		// must be done after added to doc				
		if (!bObj.unsubscribed && div.eye)
			div.eye.checked=true;
	}
}


///// subscriptions events

function divEyeClick(e)
{
	e = portalWnd.getEventObject(e,window);
	var t = portalWnd.getEventElement(e);
	if (t)
	{
		// save so instant response in IE	
		lastEye=t;
		setTimeout("divEyeClick2()",10);
	}
}

function divEyeClick2()
{
	var t=lastEye
	
	window.status = portalObj.getPhrase("LBL_UPDATING")

	// link to div objects
	var bObj = t.div.bObj
	var key = t.div.key
	var drag = t.div.drag
	var eye = t.div.eye
	
	if (!bObj.unsubscribed) {
		// currently subscribed
		// add "unsubscribe" record to lobkmarkopt
		try {
			var api = portalWnd.AGSPath + "?_PDL=LOGAN&" +
				"_TKN=LO15.1&" +
				"_LFN=TRUE&" +
				"_EVT=ADD&" +
				"_RTN=MSG&" +
				"_TDS=IGNORE&" +
				"_OUT=XML&" +
				"FC=A&" +
				"UBO-WEB-USER=" + profile.getId() + "&" +
				"UBO-BOOK-MARK=" + trimLeadingZeros(key) + "&" +
				"_EOT=TRUE"

			// get request storage
			portalObj.setMessage(portalObj.getPhrase("LBL_LOADING"));
			var oXml = portalWnd.httpRequest(api, null, "", "", false);

			var msg=portalObj.getPhrase("msgErrorReportedBy") + " Transaction service:\n";
			portalWnd.oError.setMessage(msg);
			if (portalWnd.oError.isErrorResponse(oXml,true,true))
			{
				if (eye) eye.checked = true;
				return;
			}
			var objSubscribe = portalWnd.oError.getDSObject();

			// message and message number
			var message = objSubscribe.getElementValue(TAG_MESSAGE);
			var msgnbr = parseInt(objSubscribe.getElementValue(TAG_MSGNBR),10);
			if ((message == "") && (msgnbr != 0))
				message = portalObj.getPhrase("LBL_AGS_ERROR") + " " + msgnbr;
			portalObj.setMessage(message);
			
			// message number 0 == success
			if(msgnbr == 0)
			{
				drag.title=noLayoutPhrase
				if (eye)
				{
					eye.checked=false
					eye.title = unsubscribedPhrase
				}
				bObj.unsubscribed = true
				showBookmarkChildrenEyes(bObj,false);
				portalObj.setMessage(successPhrase)

				// if in layout, remove
				if (bObj.layoutNode)
					layoutRemoveNode(bObj.layoutNode)
				bookmarkRemoveLayoutChildren(bObj)
			}
			else
			{
				// show error message, if exists
				if (eye) eye.checked = true;
				portalWnd.cmnDlg.messageBox(message,"ok","stop",window);
				return;
			}
			
			objSubscribe = null;
	
		} catch (e)	{
			if (eye)
				eye.checked = true;
			portalWnd.displayExceptionMessage(e,"users/subscriptions/subscription.js","divEyeClick2")
			return;
		}
	} else {
		// not currently subscribed
		// delete previous "unsubscribe" record from lobkmarkopt
		try {
			var api = portalWnd.AGSPath + "?_PDL=LOGAN&" +
				"_TKN=LO15.1&" +
				"_LFN=TRUE&" +
				"_EVT=CHG&" +
				"_RTN=MSG&" +
				"_TDS=IGNORE&" +
				"_OUT=XML&" +
				"FC=D&" +
				"UBO-WEB-USER=" + profile.getId() + "&" +
				"UBO-BOOK-MARK=" + trimLeadingZeros(key) + "&" +
				"_EOT=TRUE"

			// get request storage
			portalObj.setMessage(portalObj.getPhrase("LBL_LOADING"));
			var oXml = portalWnd.httpRequest(api, null, "", "", false);

			var msg=portalObj.getPhrase("msgErrorReportedBy") + " Transaction service:\n";
			portalWnd.oError.setMessage(msg);
			if (portalWnd.oError.isErrorResponse(oXml,true,true))
			{
				if (eye) eye.checked = false;
				return;
			}
			var objSubscribe = portalWnd.oError.getDSObject();

			// message and message number
			var message = objSubscribe.getElementValue(TAG_MESSAGE);
			var msgnbr = parseInt(objSubscribe.getElementValue(TAG_MSGNBR),10);
			if ((message == "") && (msgnbr != 0))
				message = portalObj.getPhrase("LBL_AGS_ERROR") + " " + msgnbr;
			portalObj.setMessage(message);
						
			// message number 0 == success
			if(msgnbr == 0)
			{
				drag.title = dragDblClickPhrase;
				if (eye)
				{
					eye.checked = true;
					eye.title = subscribedPhrase;
				}
				bObj.unsubscribed = false;
				showBookmarkChildrenEyes(bObj,true);
				portalObj.setMessage(successPhrase);
			}
			else
			{
				// show error message, if exists
				if (eye) eye.checked = false;
				portalWnd.cmnDlg.messageBox(message,"ok","stop",window);
				return;
			}
			
			objSubscribe = null;

		} catch (e)	{
			if (eye) eye.checked = false;
			portalWnd.displayExceptionMessage(e,"users/subscriptions/subscription.js","divEyeClick2")
			return;
		}
	}
}

function divBookClick(e)
{
	e = portalWnd.getEventObject(e,window);
	var t = portalWnd.getEventElement(e);
	if (!t || !t.div)
		return;
	divBookClick2(t.div);
}

function divBookClick2(div)
{
	switch (div.expandStatus)
	{
		case EXPAND_EXPANDED:
			divBookClose(div);
			break;
		case EXPAND_COLLAPSED:
			divBookOpen(div);
			break;
	}
}

function divBookClose(div)
{
	divSetChildrenDisplay(div,"none");
	div.book.className="btnConClosedBk";
	div.book.title = expandPhrase;
	div.expandStatus = EXPAND_COLLAPSED;
}

function divBookOpen(div) {
	if(div.expandStatus == EXPAND_COLLAPSED) {
		var doBold = false
		if (!div.loaded) {
			renderNode(div.level+1, div.content.childNodes, div, 0)
			div.loaded=true
			doBold=true
		}
		divSetChildrenDisplay(div,"block")
		div.book.className="btnConOpenBk"
		div.book.title = collapsePhrase
		div.expandStatus = EXPAND_EXPANDED
		
		if (doBold && arrNuglets && arrNavlets) {
			// have rendered layout, so update the subscribed bookmarks
			setTimeout("refreshLayoutBolds()",30)
		}
	}
}

function divDragClick(e)
{
	e=portalWnd.getEventObject(e,window);
	var t=portalWnd.getEventElement(e);
	if (!t || !t.div)
		return;
	divDragClick2(t);
}

var lastDrag
var lastDragTime
function divDragClick2(t)
{
	// if user clicked on open space, turn off any old hot nodes
	if (!t)
	{
		divBookmarksClick()
		return
	}
		
	// compare times for double click
	var d = new Date()
	if ((lastDrag == t) && lastDragTime && doubleClickTime(lastDragTime,d))
	{
		divDragDblClickNode(t)
		return
	}
	lastDrag = t
	lastDragTime = d
}

function divBookmarksClick(e) 
{
	lastDrag=null
	lastDragTime=null
	return
}

function divDragDblClick(e)
{
	e = portalWnd.getEventObject(e,window);
	var t = portalWnd.getEventElement(e);
	if (t && t.div)
		divDragDblClickNode(t);
}

function divDragDblClickNode(t)
{
	var key = t.div.key;
	var bObj = t.div.bObj;
	if (!bObj.layoutNode && !bObj.unsubscribed)
	{
		if (t.div.tp == TAG_NAVLET)
		{
			var fromNode = profileDoc.createElement(TAG_NAVLET);
			fromNode.setAttribute(ATTR_KEY,key);
			objNavigation.appendChild(fromNode);
			renderNavigation();
			rememberBookmarkKey(key);
			setDirty();
		}
		else if (t.div.tp == TAG_NUGLET)
		{
			var fromNode = profileDoc.createElement(TAG_NUGLET);
			fromNode.setAttribute(ATTR_KEY,key);
			objContent.appendChild(fromNode);
			renderContentPane();
			rememberBookmarkKey(key);
			setDirty();
		}
	}
	else if (bObj.layoutNode && bObj.div && bObj.div.drag)
	{
		layoutRemoveNode(bObj.layoutNode);
	}
	lastDrag = null;
	lastDragTime = null;
}

function allowSubscription(elem)
{
	try {
		switch (elem.tp)
		{
			case TAG_NAVLET:
				var nm=getBookmarkName(elem.key);
				if (nm == "Portal Administration"
				&& !portalWnd.oUserProfile.isPortalAdmin())
					return false;
				break;
			case TAG_NUGLET:
				var node = elem.content;
				var url = node.getAttribute("url");
				var bOpenNewWindow = (node.getAttribute("win") == "yes" ? true : false);
				// certain portal bookmarks not supported in content frame
				if (url.substr(0,6) == "admin/"
				|| url.substr(0,8) == "reports/"
				|| url.substr(0,8) == "utility/")
					return false;

				// won't see content if not using default home page
				if (portalObj.homePage != "home.htm")
					return false;
				
				if(bOpenNewWindow)
					return false;
			
				break;
		}
		return true;
	} catch (e) { }
	return false;
}

function divSetChildrenDisplay(div,setting)
{
	for (var i=0; i < div.childNodes.length; i++)
	{
		var div_i = div.childNodes[i]
		if ( div_i.nodeType==1 && div_i.tagName.toLowerCase() == "div" )
			div_i.style.display = setting
	}
}

// is this bookmark subscribed?
function isSubscribed( key ) {
	var bObj = getBookmarkObj(key)
	return isSubscribedObj(bObj)
}

function isSubscribedObj(bObj) {
	if (bObj)
		return (!bObj.unsubscribed)
	return false
}

// is this bookmark subscribed to and its parents subscribed to?
function isChainSubscribed( key ) {
	var bObj = getBookmarkObj(key)
	return isChainSubscribedObj(bObj)
}

function isChainSubscribedObj(bObj) {
	if (bObj) {
		var ret=isSubscribedObj(bObj)
		if (ret) {
			var pObj = getBookmarkObjParent(bObj)
			if (pObj!=null)
				ret = isChainSubscribedObj(pObj)
		}
		return ret
	}
	return false
}

function trimLeadingZeros( text ) {
	if (text==null) return text
	var flag = false
	var retString = ""
	for(i=0;i<text.length;i++) {
		if((text.charAt(i) != "0") && (!flag)) {
			flag = true
		}
		if(flag) {
			retString += text.charAt(i)
		}
	}
	return retString
}

///// Layout

function renderLayout() {
	if (!layoutLoaded) {
		statusUpdate(subMsgs.getPhrase("LBL_RENDERING_LAYOUT"))

		arrNavlets = new Array()
		arrNavletSpans = new Array()

		arrNuglets = new Array()
		arrNugletSpans = new Array()
	
		var layoutTbl=null;
		var r=null;
		var t=null;
		var lc=null;
		var rc=null;
		var l=null;
	
		// render generic nodes
		// generic table
		layoutTbl = document.createElement("table");
		layoutTbl.style.width = "100%";
	
		// generic headers
		r = layoutTbl.insertRow(layoutTbl.rows.length);
				
		lc = r.insertCell(r.cells.length);
		lc.className = "xTCustomHeader";
		lc.style.width = "30%";
		l=document.createElement("LABEL");
		l.onselectstart = portalWnd.cmnBlockSelect;
		t = document.createTextNode(navPanePhrase);
		l.appendChild(t);
		lc.appendChild(l);
			
		rc = r.insertCell(r.cells.length);
		rc.className = "xTCustomHeader";
		rc.style.width = "70%";
		l=document.createElement("LABEL");
		l.onselectstart = portalWnd.cmnBlockSelect;
		t = document.createTextNode(mainContentPanePhrase);
		l.appendChild(t);
		rc.appendChild(l);
	
		// generic columns
		r = layoutTbl.insertRow(layoutTbl.rows.length);
		r.style.verticalAlign="top";
				
		// left column - navigation pane
		lcCell = r.insertCell(r.cells.length);
		lcCell.verticalAlign = "top";
		lcCell.onselectstart = portalWnd.cmnBlockSelect;
		lcCell.style.height="100%";
		lcCell.style.borderColor="black";
		lcCell.style.borderWidth="1px";
		lcCell.style.borderStyle="solid";
		lcCell.tp = TAG_NAVLET;
		
		// render left, navigation pane - navlets
		renderNavigation();
			
		// right column - content pane
		rcCell = r.insertCell(r.cells.length);
		rcCell.verticalAlign = "top";
		rcCell.style.width="90%";
		rcCell.style.height="100%";
		rcCell.style.borderColor="black";
		rcCell.style.borderWidth="1px";
		rcCell.style.borderStyle="solid";
		rcCell.onselectstart = portalWnd.cmnBlockSelect;
		rcCell.tp = TAG_NUGLET;
	
		lyrLayout.appendChild(layoutTbl);

		layoutLoaded = true;
	}
	
	// render right content pane - nuglets
	renderContentPane()
	portalWnd.cmnClearStatus();
}

// user clicked finish button at top, or press ok to a save confirmation
function subSave()
{
	// remember which bookmarks need to be saved out
	var arrNeededKeys = new Array()
	statusUpdate(subMsgs.getPhrase("LBL_SAVING"))

	// navlets
	for (var i=0; i < arrNavlets.length; i++)
	{
		// remember to save this key to the file
		if (!portalWnd.cmnArrayContains(arrNeededKeys,arrNavlets[i]))
			arrNeededKeys[arrNeededKeys.length] = arrNavlets[i]
	}

	// nuglets
	for (var i=0; i < arrNuglets.length; i++)
	{
		// remember to save this key to the file
		if (!portalWnd.cmnArrayContains(arrNeededKeys,arrNuglets[i]))
			arrNeededKeys[arrNeededKeys.length] = arrNuglets[i]
	}

	// update portal user bookmarks in profile xml
	for (var i=0; i < arrNeededKeys.length; i++)
	{
		var key=arrNeededKeys[i].substring(4)
		rememberBookmarkKey(key)		
	}

	// ask profile object to save data	
	profile.setModified();
	if (!profile.save())
	{
		statusUpdate(subMsgs.getPhrase("LBL_ERROR_SAVING_CONTENT"));
		return false;
	}
	statusUpdate(successPhrase);

	// now update the left bar
	portalObj.tabArea.tabs["HOME"].clearNavlets();
	portalWnd.buildLeftCustomLinks();
	portalWnd.inbasketLoadTasks();
	portalWnd.buildLeftBookmarks();

	// enable the reload portal button
	portalObj.toolbar.changeButtonState("reload", "enabled");
	return true;
}

// render left, navigation
function renderNavigation()
{
	var p=subMsgs.getPhrase("LBL_RENDERING_NAVIGATION")
	statusUpdate(p)
	oFeedBack.show()
	setTimeout("renderNavigation2()",50)
}

function renderNavigation2() {
	abandonChildren(lcCell)
	arrNavlets = new Array()
	arrNavletSpans = new Array()
	clearBookmarkObjNavigation()
	lastNavlet = null

	// modified to work with spans
	if (objNavigation) {
		var navlets=objNavigation.getElementsByTagName(TAG_NAVLET)
		if (navlets) {
			var t = document.createElement("table")
			t.cellPadding = 0;
			t.cellSpacing = 0
			with (t.style) {
				textAlign = "left"
				verticalAlign = "top"
				width = "100%"
			}
			t.canHide = true
			for (var i=0;i<navlets.length;i++) {
				var key = navlets[i].getAttribute(ATTR_KEY)
				var bObj = getBookmarkObj(key)
				if (bObj!=null) {
					// only add row if navlet is renderable
					var n=renderNavlet(navlets[i])
					if (n) {
						var r = t.insertRow(t.rows.length)
						var c = r.insertCell(r.cells.length)
						c.style.width = "100%"
						c.style.verticalAlign = "top"
						c.appendChild(n)
					}
				} else {
					// if no longer available, remove navlet from layout
					// but only if not layout locked
					if (n==null && !getBookmarkLock(key,ATTR_LAYOUT)) {
						navlets[i].parentNode.removeChild(navlets[i])
						forgetBookmarkKey(key)
						setDirty()
					}
				}
			}
			lcCell.appendChild(t)
		}
	}

	oFeedBack.hide()
	portalWnd.cmnClearStatus();
}
		
// render an individual navlet into the left, navigation pane
function renderNavlet(content) {
	key=content.getAttribute(ATTR_KEY)
	if (!key)
		return null

	if (!isChainSubscribed( key ))
		return null

	var bObj = getBookmarkObj(key)
	if (bObj==null)
	{
		// the bookmark was in the layout, but not provided by authen/profile.
		// the user no longer has access to the bookmark.
		window.status = subMsgs.getPhrase("LBL_TRIMMED")
		return null
	}

	if (!portalWnd.cmnArrayContains(arrNavlets,"nav_"+key))
	{
		var laylock = getBookmarkLock(key,ATTR_LAYOUT)
		var s = document.createElement("div")
		s.canHide = true
		s.className = "conLet"
		s.content=content
		s.id = "nav_"+key
		s.key = key
		s.laylock = laylock
		s.mode = MODE_LAYOUT
		s.ondblclick = layoutDoubleClick
		s.onmousedown = layoutDragStart
		s.onselectstart = portalWnd.cmnBlockSelect;
		s.pos = 0
		s.tabIndex = 1
		s.tp = TAG_NAVLET
		
		// remove img
		var delNode = document.createElement("button")
		if (laylock)
		{
			delNode.className="btnConVisLocked"
			delNode.title=getLaylockPhrase(laylock)
		}
		else
		{
			delNode.className="btnConDelete"
			delNode.title=removeLayoutPhrase
			delNode.onclick = btnDeleteClick
		}
		delNode.span = s
		delNode.laylock = laylock
		s.appendChild(delNode)

		//var t = document.createTextNode(getBookmarkObjName(bObj,true))
		var t = document.createTextNode(getBookmarkObjName(bObj,false))
		s.appendChild(t)
	
		arrNavlets[arrNavlets.length]="nav_"+key
		arrNavletSpans[arrNavletSpans.length] = s
		
		bookmarkSetLayout(bObj,s)
		return s
	}
	return null
}

// loads navigation and content section, or creates them
function loadLayout()
{
	statusUpdate(subMsgs.getPhrase("LBL_LOADING_LAYOUT_SETTINGS"))
	if (layoutLoaded)
		return
		
	// get objPortalUser
	objPortalUser=profile.storage.getRootNode();
	if (objPortalUser == null)
	{
		objPortalUser=profileDoc.createElement(TAG_PORTAL_USER)
		profileDoc.appendChild(objPortalUser)
		
	}
	
	// get objNavigation
	objNavigation=objPortalUser.getElementsByTagName(TAG_NAVIGATION)
	objNavigation = (objNavigation && objNavigation.length > 0 && objNavigation[0].nodeType == 1 
			? objNavigation[0] : null);

	// create objNavigation if does not exist	
	if (objNavigation == null) {
		objNavigation=profileDoc.createElement(TAG_NAVIGATION)
		objPortalUser.appendChild(objNavigation)
		
	}

	// get objContent
	objContent=objPortalUser.getElementsByTagName(TAG_CONTENT)
	objContent = (objContent && objContent.length > 0 && objContent[0].nodeType == 1 
			? objContent[0] : null);
		
	// create objContent if does not exist	
	if (objContent == null) {
		objContent=profileDoc.createElement(TAG_CONTENT)
		objPortalUser.appendChild(objContent)
		
	}

	// get objBookmarkKeys
	objBookmarkKeys=objPortalUser.getElementsByTagName(TAG_BOOKMARKS)
	objBookmarkKeys = (objBookmarkKeys && objBookmarkKeys.length > 0 && objBookmarkKeys[0].nodeType == 1 
			? objBookmarkKeys[0] : null);
		
	// create objBookmarkKeys if does not exist	
	if (objBookmarkKeys == null) {
		objBookmarkKeys=profileDoc.createElement(TAG_BOOKMARKS)
		objPortalUser.appendChild(objBookmarkKeys)
		
	}

	// get objAdminBlocks, objUserBlocks
	objAdminBlocks = null
	objUserBlocks = null
	var objBlocks=portalObj.profile.getElementsByTagName(TAG_BLOCKS);
	if (objBlocks)
	{
		for (var i=0; i < objBlocks.length; i++)
		{
			if (objBlocks[i].nodeType == 1)
			{
				var type = objBlocks[i].getAttribute(ATTR_TYPE)
				if (type == LOCK_ADMIN)
					objAdminBlocks = objBlocks[i]
				else if (type == LOCK_USER)
					objUserBlocks = objBlocks[i]
			}
		}	
	}
		
	// create objUserBlocks if does not exist	
	if (objUserBlocks == null)
	{
		objUserBlocks=profileDoc.createElement(TAG_BLOCKS)
		objUserBlocks.setAttribute(ATTR_TYPE,LOCK_USER)
		objPortalUser.appendChild(objUserBlocks)
		
	}
}

function shouldCheckLocked()
{
	// block check content
	var bcc=objPortalUser.getElementsByTagName(TAG_BLOCK_CHECK)
	bcc = (bcc && bcc.length > 0 && bcc[0].nodeType == 1 ? bcc[0] : null);
	if (bcc == null)
	{
		bcc=profileDoc.createElement(TAG_BLOCK_CHECK)
		objPortalUser.appendChild(bcc)
		
	}
	
	// check time nodes
	var date=profile.getAttribute("date");
	var time=profile.getAttribute("time");
	if (bcc.hasChildNodes())
	{
		var ok=true
		var len=bcc.childNodes.length
		for (var i=0; i < len; i++)
		{
			if (bcc.childNodes[i].nodeType == 1) { // ns
				var tn=bcc.childNodes[i].tagName
				if (tn==TAG_DATE) {
					if (bcc.childNodes[i].firstChild.data!=date) {
						ok=false
						bcc.childNodes[i].firstChild.data=date
					}
				}
				if (tn==TAG_TIME) {
					if (bcc.childNodes[i].firstChild.data!=time) {
						ok=false
						bcc.childNodes[i].firstChild.data=time
					}
				}
			}
		}
		// check if not ok time, date
		return (!ok)
	}
	else
	{
		var dateNode=profileDoc.createElement(TAG_DATE)		
		dateNode.appendChild(profileDoc.createTextNode(date))
		bcc.appendChild(dateNode)

		var timeNode=profileDoc.createElement(TAG_TIME)
		timeNode.appendChild(profileDoc.createTextNode(time))
		bcc.appendChild(timeNode)

		
		return true
	}
}

// if bookmark locked, but chain is unsubscribed, resubscribe
// if layout locked, but not in layout, add to layout
function checkLocked() {
	if (!shouldCheckLocked())
		return

	statusUpdate(portalObj.getPhrase("LBL_CHECKING_BOOKMARK_LOCKS"))

	var bm
	var bDirty=false
	var arrNavlets=objNavigation.getElementsByTagName(TAG_NAVLET)
	var arrNuglets=objContent.getElementsByTagName(TAG_NUGLET)
	if (objAdminBlocks)
	{
		for (var i=0; i <objAdminBlocks.childNodes.length; i++)
		{
			bm = objAdminBlocks.childNodes[i]
			if (bm.nodeType == 1)
			{
				var key = bm.getAttribute(ATTR_KEY)
				if (bm.getAttribute(ATTR_LAYOUT))
					bDirty=lockToLayout(key, arrNavlets, arrNuglets) || bDirty
				else if (bm.getAttribute(ATTR_SUBSCRIPTION))
					bDirty=lockToSubscription(key) || bDirty
			}
		}
	}
	if (objUserBlocks)
	{
		for (var i=0;i<objUserBlocks.childNodes.length;i++)
		{
			bm = objUserBlocks.childNodes[i]
			if (bm.nodeType == 1)
			{
				var key = bm.getAttribute(ATTR_KEY)
				if (bm.getAttribute(ATTR_LAYOUT))
					bDirty=lockToLayout(key, arrNavlets, arrNuglets) || bDirty
				else if (bm.getAttribute(ATTR_SUBSCRIPTION))
					bDirty=lockToSubscription(key) || bDirty
			}
		}
	}
	if (bDirty)
		setDirty()
}

// bookmark is subscription locked, insure subscribed
// go upwards in chain to insure is subscribed
function lockToSubscription(key)
{
	var ret=false
	var bObj=getBookmarkObj(key)
	if (bObj)
	{
		bObj.childLock = true
		// insure subscribed
		if (!isSubscribedObj(bObj))
		{
			subscribeObj(bObj)
			ret = true
		}
			
		// insure parent is subscribed
		var pObj = getBookmarkObjParent(bObj)
		if (pObj)
			ret=lockToSubscription(pObj.key) || ret
	}
	return ret
}

// delete previous "unsubscribe" record from lobkmarkopt
function subscribeObj(bObj)
{
	var api = portalWnd.AGSPath + "?_PDL=LOGAN&" +
		"_TKN=LO15.1&" +
		"_LFN=TRUE&" +
		"_EVT=CHG&" +
		"_RTN=MSG&" +
		"_TDS=IGNORE&" +
		"_OUT=XML&" +
		"FC=D&" +
		"UBO-WEB-USER=" + profile.getId() + "&" +
		"UBO-BOOK-MARK=" + trimLeadingZeros(bObj.key) + "&" +
		"_EOT=TRUE"
		
	try {
		// get request storage
		portalObj.setMessage(portalObj.getPhrase("LBL_LOADING"));
		var oXml = portalWnd.httpRequest(api, null, "", "", false);

		var msg=portalObj.getPhrase("msgErrorReportedBy") + " Transaction service:\n";
		portalWnd.oError.setMessage(msg);
		if (portalWnd.oError.isErrorResponse(oXml,true,true))
		{
			if (eye) eye.checked = false;
			return;
		}
		var objSubscribe = portalWnd.oError.getDSObject();

		// message and message number
		var message = objRename.getElementValue(TAG_MESSAGE);
		var msgnbr = parseInt(objRename.getElementValue(TAG_MSGNBR),10);
		if ((message == "") && (msgnbr != 0))
			message = portalObj.getPhrase("LBL_AGS_ERROR") + " " + msgnbr;
		portalObj.setMessage(message);

		// message number 0 == success
		if(msgnbr == 0)
			bObj.unsubscribed = false;
		// show error message, if exists
		else
			portalWnd.cmnDlg.messageBox(message,"ok","stop",window);
			
		objSubscribe = null;

	} catch (e)	{
		portalWnd.displayExceptionMessage(e,"users/subscriptions/subscription.js","subscribeObj");
	}
}

// bookmark is layout locked, insure it is in layout
function lockToLayout(key, arrNavlets, arrNuglets)
{
	var ret=false
	var bObj=getBookmarkObj(key)
	if (bObj) {
		// simulate subscription lock because layout needs subscription
		ret = lockToSubscription(key)

		setLayoutPosition(bObj);

		if (bObj.tp == TAG_NAVLET)
		{
			// return if found in layout
			for (var i=0; i < arrNavlets.length; i++)
				if (arrNavlets[i].getAttribute(ATTR_KEY) == key)
					return ret
			
			// create navlet
			var node = profileDoc.createElement(TAG_NAVLET)
			node.setAttribute(ATTR_KEY,key)
			objNavigation.appendChild(node)
			
			rememberBookmarkKey(key)
			return true
		}
		else if (bObj.tp == TAG_NUGLET)
		{
			// return if found in layout
			for (var i=0; i < arrNuglets.length; i++)
				if (arrNuglets[i].getAttribute(ATTR_KEY) == key)
					return ret

			// create nuglet
			var node = profileDoc.createElement(TAG_NUGLET)
			node.setAttribute(ATTR_KEY,key)
			objContent.appendChild(node)
			
			rememberBookmarkKey(key)
			return true
		}
	}
	return ret
}

// render right, main content
function renderContentPane()
{
	var p=subMsgs.getPhrase("LBL_RENDERING_CONTENTS")
	statusUpdate(p)
	oFeedBack.show()
	setTimeout("renderContentPane2()",50)
}

function renderContentPane2()
{
	abandonChildren(rcCell)
	arrNuglets = new Array()
	arrBorders = new Array()
	arrNugletSpans = new Array()
	hotSpan = null
	lastNuglet = null
	clearBookmarkObjContent()
	renderContent(objContent,rcCell)
	if (portalObj.homePage != "home.htm")
		renderAlternateHome(rcCell);
	oFeedBack.hide()
	portalWnd.cmnClearStatus();
}

function renderContent(content,parentNode)
{
	if (!content) return false

	if (content.tagName == TAG_CONTENT)
	{
		// render children
		if (content.hasChildNodes())
		{
			var rChildren = false
			for(var i=0;i<content.childNodes.length;i++)
			{
				if (content.childNodes[i].nodeType == 1) // ns
					rChildren |= renderContent(content.childNodes[i],parentNode)
			}
			return rChildren
		}
	}
	else if (content.tagName == TAG_FLOW)
	{
		var dir = content.getAttribute(ATTR_DIR)
		if (dir == DIR_HORIZONTAL)
		{

			var t = document.createElement("table")
			t.cellPadding = (isIE) ? 0 : 2;
			t.cellSpacing = 0
			with (t.style) {
				//margin = "0px"
				textAlign = "left"
				verticalAlign = "top"
				width = "100%"
			}
			t.content = content
			t.canHide = true
			var r = t.insertRow(t.rows.length)
			
			// render children
			var rChildren = false
			if (content.hasChildNodes()) {
				var len = content.childNodes.length
				if (len) {
					// real children - ns
					// by placing the elements into this temporary array, we can
					// trim the parent node if necessary
					var realChildren = new Array()
					for(var i=0;i<len;i++) {
						if (content.childNodes[i].nodeType == 1)
							realChildren[realChildren.length]=content.childNodes[i]
					}
					len = realChildren.length
					if (len) {
						var p
						for(var i=0;i<len;i++) {
							p = 100/len
							if (isIE || (realChildren[i].hasAttributes() && realChildren[i].hasAttribute(ATTR_WIDTH))) {
								var tp = realChildren[i].getAttribute(ATTR_WIDTH)
								if (tp)
									p=tp
							}
							var c = r.insertCell(r.cells.length)
							c.style.verticalAlign = "top"
							c.style.width = p + "%"
							var b=renderContent(realChildren[i],c)
							//if (!b)
							//	r.deleteCell(r.cells.length)
							//else
							if (r.cells.length>1) {
								c = r.insertCell(r.cells.length-1)
								c.style.verticalAlign = "middle"
								c.style.width = edgeWidth + "px"
								c.style.height = "100%"
								var cz=renderColumnSizer(content,r.cells.length,c,t)
							}
							rChildren|=b
						}
					}
				}
			}
			if (rChildren) {
				parentNode.appendChild(t)
				return true
			} else {
				t=null
				return false
			}
		}
		
		if (dir == DIR_VERTICAL || !dir)
		{
			var t = document.createElement("table")
			t.cellPadding = (isIE) ? 0 : 2;
			t.cellSpacing = 0
			with (t.style) {
				//margin = "0px"
				textAlign = "left"
				verticalAlign = "top"
				width = "100%"
			}
			t.canHide = true
			t.content = content
			
			// render children
			var rChildren = false
			if (content.hasChildNodes())
			{
				var len = content.childNodes.length
				if (len)
				{
					// real children - ns
					// by placing the elements into this temporary array, we can
					// trim the parent node if necessary
					var realChildren = new Array()
					for(var i=0;i<len;i++) {
						if (content.childNodes[i].nodeType == 1)
							realChildren[realChildren.length]=content.childNodes[i]
					}
					len = realChildren.length
					for (var i=0; i < len; i++)
					{
						var r = t.insertRow(t.rows.length)
						var c = r.insertCell(r.cells.length)
						c.style.width = "100%"
						c.style.verticalAlign = "top"
						var b=renderContent(realChildren[i],c)
						rChildren|=b
					}
				}
			}
			if (rChildren)
			{
				parentNode.appendChild(t)
				return true
			}
			else
			{
				t=null
				return false
			}
		}
	}
	else if (content.tagName == TAG_NUGLET)
	{
		var n=renderNuglet(content,parentNode)
		
		// if unsubscribed, remove this child
		// but only if not layout locked
		if (n==null) {
			var key=content.getAttribute(ATTR_KEY)
			if (key && !getBookmarkLock(key,ATTR_LAYOUT)) {
				content.parentNode.removeChild(content)
				forgetBookmarkKey(key)
				setDirty()
			}
		}
		return (n!=null)
	}
}

function renderAlternateHome(parentNode)
{
	var s = document.createElement("div");
	s.className = "conLet";
	s.style.height="100%";
	var t = document.createTextNode(portalObj.getPhrase("lblGoHomePage")+": "+portalObj.homePage);
	s.appendChild(t);

	parentNode.appendChild(s);
}

// render an individual nuglet into the right content area
function renderNuglet(content,parentNode)
{
	if (portalObj.homePage != "home.htm")
		return null;
	
	var key=content.getAttribute(ATTR_KEY)
	if (!key) return null

	if (!isChainSubscribed( key )) return null

	var bObj = getBookmarkObj(key)
	if (bObj==null)
	{
		// the bookmark was in the layout, but not provided by authen/profile.
		// the user no longer has access to the bookmark.
		window.status = subMsgs.getPhrase("LBL_TRIMMED")
		return null
	}
	
	if (!portalWnd.cmnArrayContains(arrNuglets,"nug_"+key))
	{
		var laylock = getBookmarkLock(key,ATTR_LAYOUT)
		
		var s = document.createElement("div")
		s.canHide = true
		s.className = "conLet"
		s.content = content
		s.id = "nug_"+key
		s.key = key
		s.laylock = laylock
		s.mode = MODE_LAYOUT
		s.ondblclick = layoutDoubleClick
		s.onmousedown = layoutDragStart
		s.onselectstart = portalWnd.cmnBlockSelect;
		s.pos = 0
		s.state = content.getAttribute(ATTR_STATE)
		s.tabIndex = 1
		s.tp = TAG_NUGLET
	
		// remove img
		var delNode = document.createElement("button")
		if (laylock)
		{
			delNode.className="btnConVisLocked"
			delNode.title=getLaylockPhrase(laylock)
		}
		else
		{
			delNode.title=removeLayoutPhrase
			delNode.className="btnConDelete"
		}
		delNode.onclick=btnDeleteClick
		delNode.span = s // keyboard
		delNode.laylock = laylock
		s.appendChild(delNode)

		// state img
		s.stateImg = document.createElement("button")
		s.stateImg.title=toggleStatePhrase
		s.stateImg.onclick = spanStateClick
		if (s.state && s.state=="min")
			s.stateImg.className="btnConMinus"
		else
			s.stateImg.className="btnConPlus"
		s.stateImg.span = s
		s.appendChild(s.stateImg)

		// text
		//var t = document.createTextNode(getBookmarkObjName(bObj,true))
		var t = document.createTextNode(getBookmarkObjName(bObj,false))
		s.appendChild(t)

		parentNode.appendChild(s)

		arrNuglets[arrNuglets.length]="nug_"+key
		arrNugletSpans[arrNugletSpans.length] = s
		
		bookmarkSetLayout(bObj,s)
		return s
	}
	return null
}

function getLaylockPhrase(laylock)
{
	return locked1Phrase + " " + 
		((laylock == LOCK_USER)?(". "):"") + 
		((laylock == LOCK_ADMIN)?(yourAdminPhrase + " "):"") + 
		locked2Phrase + " " + lockedLayoutPhrase
}

function renderColumnSizer(content,cellNumber,parentNode,baseNode)
{
	var s = document.createElement("span")
	with (s.style) {
		cursor = "e-resize"
		whiteSpace = "nowrap"
		height = "100%"
		width = "5px"
	}
	s.onselectstart = portalWnd.cmnBlockSelect;
	s.onmousedown = columnDragStart
	s.baseNode = baseNode
	s.mode = MODE_LAYOUT
	parentNode.appendChild(s)
	return s
}

///// LAYOUT DRAG

function layoutDragStart(evt) 
{
	// start dragging a nuglet or navlet
	evt = portalWnd.getEventObject(evt,window);
	var t = portalWnd.getEventElement(evt);
	if (!t) return;

	lyrDrag.elNode = t
	lyrDrag.tp = t.tp
	lyrDrag.mode = MODE_LAYOUT

	if (!t.key) return
	window.status = relocatingPhrase + " " + getBookmarkName(t.key)

	// Get cursor position with respect to the page.
	detMouse(evt)
	lyrDrag.oX = mX
	lyrDrag.oY = mY
	
	// iterative position finding code from menu.js
	detCoords(t)

	lyrDrag.oLeft = t.detLeft
	lyrDrag.oTop = t.detTop
	lyrDrag.oHeight = t.detHeight
	lyrDrag.oWidth = t.detWidth
	
	with (lyrDrag.style) {
		left = lyrDrag.oLeft + "px"
		top = lyrDrag.oTop + "px"
		height = lyrDrag.oHeight + "px"
		width = lyrDrag.oWidth + "px"
	}

	// determine last lowest element	
	if (lyrDrag.tp == TAG_NAVLET)
	{
		detCoords(lcCell)
		lastNavlet = lowestSpan(arrNavletSpans)
	}
	else if (lyrDrag.tp == TAG_NUGLET)
	{
		detCoords(rcCell)
		lastNuglet = lowestSpan(arrNugletSpans)
	}
	else
		return
	
	// Capture mousemove and mouseup events on the page.
	if (isIE)
	{
		lyrDrag.setCapture()
		document.attachEvent("onmousemove", layoutDragGo)
		document.attachEvent("onmouseup",   layoutDragStop)
		window.event.cancelBubble = true
		window.event.returnValue = false
	}
	else
	{
		document.addEventListener("mousemove", layoutDragGo,   true)
		document.addEventListener("mouseup",   layoutDragStop, true)
		event.preventDefault()
	}
}

function layoutDragGo(event)
{
	lastX = mX
	lastY = mY
	detMouse(event)

	if (lastX != mX || lastY != mY)
	{
		// If moved, show draglayer
		if (!lyrDrag.dragging && mouseMoved(mX,mY,lyrDrag.oX,lyrDrag.oY)) {
			lyrDrag.dragging = true
			lyrDrag.style.visibility = "visible"
		}
	
		// determine hot edges
		hotSpans(mX,mY)
		if (hotSpan)
		{
			var nL, nT
			var t = hotSpan
			
	 		// Move drag element to hotEdge position
			switch (hotSpan.pos)
			{
				case 8:
					lyrDrag.oHeight = edgeWidth
					lyrDrag.oWidth = t.detWidth
					nL = t.detLeft
					nT = (t.detTop - lyrDrag.oHeight)
					break
					
				case 6:
					lyrDrag.oHeight = t.detHeight
					lyrDrag.oWidth = edgeWidth
					nL = t.detRight
 					nT = t.detTop
					break
				
				case 4:
					lyrDrag.oHeight = t.detHeight
					lyrDrag.oWidth = edgeWidth
					nL = (t.detLeft - lyrDrag.oWidth)
 					nT = t.detTop
					break
				
				case 2:
					lyrDrag.oHeight = edgeWidth
					lyrDrag.oWidth = t.detWidth
					nL = t.detLeft
 					nT = t.detBottom
					break
						
				default:
					break
					
			} // switch

			with (lyrDrag.style) {
				height = lyrDrag.oHeight + "px"
				width = lyrDrag.oWidth + "px"		
				left = (nL - mdX) + "px"
				top = (nT - mdY) + "px"
				visibility = "visible"
			}

		}
		else
		{
			// drag to top or bottom
			with (lyrDrag.style) {
				if (lyrDrag.mode == MODE_SUBSCRIPTION)
					height = lyrDrag.t1.detHeight + "px"
				else if (lyrDrag.mode == MODE_LAYOUT)
					height = lyrDrag.elNode.detHeight + "px"

				if (lyrDrag.tp == TAG_NAVLET) {
					width = lcCell.detWidth + "px"
					left = lcCell.detLeft + "px"
					var weight = mY - ((lastNavlet?lastNavlet.detBottom:lcCell.detTop)/2)
					if (weight < 0) {
						//top = (lcCell.detTop - parseInt(height,10) - edgeWidth) + "px"
						//top = (lyrContent.detTop - edgeWidth) + "px"
						top = (lcCell.detTop - edgeWidth) + "px"
					} else 
						top = ((lastNavlet?lastNavlet.detBottom:lcCell.detTop) + edgeWidth) + "px"
				} else if ((lyrDrag.tp == TAG_NUGLET)){
					width = rcCell.detWidth + "px"
					left = rcCell.detLeft + "px"
					var weight = mY - ((lastNuglet?lastNuglet.detBottom:rcCell.detTop)/2) 
					if (weight < 0) {
						//top = (rcCell.detTop - parseInt(height,10) - edgeWidth) + "px"
						//top = (lyrContent.detTop - edgeWidth) + "px"
						top = (rcCell.detTop - edgeWidth) + "px"
					} else
						top = ((lastNuglet?lastNuglet.detBottom:rcCell.detTop) + edgeWidth) + "px"
				} else 
					visibility = "hidden"
			}
		}
	}

	if (isIE) 
	{
		window.event.cancelBubble = true
	   	window.event.returnValue = false
	}
	else
   		event.preventDefault()
}

function layoutDragStop(event)
{
	// Stop capturing mousemove and mouseup events.
	if (isIE)
	{
    	document.detachEvent("onmousemove", layoutDragGo)
    	document.detachEvent("onmouseup", layoutDragStop)
    	document.releaseCapture()
	}
	else
	{
    	document.removeEventListener("mousemove", layoutDragGo, true)
    	document.removeEventListener("mouseup", layoutDragStop, true)
  	}
	portalWnd.cmnClearStatus();
	
	// hide drag layer
	lyrDrag.style.visibility = "hidden"

	if (lyrDrag.dragging)
	{
		lyrDrag.dragging = false
		
	 	// Get mouse position
		detMouse(event)
	 	
		// position node
 		var lastLeft = (lyrDrag.oLeft + mX - lyrDrag.oX)
 		var lastTop = (lyrDrag.oTop + mY - lyrDrag.oY)
		layoutDrop(lastLeft, lastTop)
		return
	} else {
		layoutNodeClick(lyrDrag.elNode)
		return
	}
}

// user clicked on the text for a node
// called by selectNodeId
var lastLayoutClick
function layoutNodeClick(node)
{
	// if user clicked on open space, turn off any old hot nodes
	if (!node)
	{
		// turn off old hot node
		lastLayoutClick=null
		hotNode=null
		return
	}
	
	// compare times for double click
	var newDate = new Date()
	if (hotNode == node && lastLayoutClick && doubleClickTime(lastLayoutClick,newDate))
	{
		layoutRemoveNode(node)
		lastLayoutClick=null
		hotNode=null
		return
	}
	lastLayoutClick=newDate
	
	// set new hot node	
	hotNode = node
}

///// SUBSCRIPTIONS DRAG

function divDragStart(evt) 
{
	evt = portalWnd.getEventObject(evt,window);
	var t=portalWnd.getEventElement(evt);
	if (!t) return;
		
	lyrDrag.elNode = null
	lyrDrag.mode = MODE_SUBSCRIPTION
	lyrDrag.t1 = t;
	lyrDrag.key = lyrDrag.t1.div.key
	lyrDrag.tp = lyrDrag.t1.div.tp
	var bObj = getBookmarkObj(lyrDrag.key)
	if (bObj.layoutNode) return;
	
	if (!isChainSubscribed(lyrDrag.key))
		return;

	// remember original in case no movement
	detCoords(lyrDrag.t1)

	// Get cursor position with respect to the page.
 	detMouse(evt)

	// Save starting positions of cursor and element.
	lyrDrag.oX = mX
	lyrDrag.oY = mY
	
	lyrDrag.oLeft = lyrDrag.t1.detLeft - divBookmarks.scrollLeft
	lyrDrag.oTop = lyrDrag.t1.detTop - divBookmarks.scrollTop
	lyrDrag.oHeight = lyrDrag.t1.detHeight
	lyrDrag.oWidth = lyrDrag.t1.detWidth
	
	with (lyrDrag.style)
	{
		left = lyrDrag.oLeft + "px"
		top = lyrDrag.oTop + "px"
		height = lyrDrag.oHeight + "px"
		width = lyrDrag.oWidth + "px"
	}
	
	// determine last lowest element	
	if (lyrDrag.tp == TAG_NAVLET) 
	{
		detCoords(lcCell)
		lastNavlet = lowestSpan(arrNavletSpans)
	}
	else if (lyrDrag.tp == TAG_NUGLET)
	{
		detCoords(rcCell)
		lastNuglet = lowestSpan(arrNugletSpans)
	}
	else
		return
	
	// Capture mousemove and mouseup events on the page.
	if (isIE)
	{
		lyrDrag.setCapture()
		document.attachEvent("onmousemove", layoutDragGo)
		document.attachEvent("onmouseup", divDragStop)
		window.event.cancelBubble = true
		window.event.returnValue = false
	}
	else
	{
		document.addEventListener("mousemove", layoutDragGo,   true)
		document.addEventListener("mouseup", divDragStop, true)
		event.preventDefault()
	}
}

function divDragStop(event)
{
	// Stop capturing mousemove and mouseup events.
	if (isIE)
	{
    	document.detachEvent("onmousemove", layoutDragGo)
    	document.detachEvent("onmouseup", divDragStop)
    	document.releaseCapture()
	}
	else
	{
    	document.removeEventListener("mousemove", layoutDragGo, true)
    	document.removeEventListener("mouseup", divDragStop, true)
  	}

	// hide drag layer	
	lyrDrag.style.visibility = "hidden"

	// if no drag, simulate click
	if (!lyrDrag.dragging)
		return
	lyrDrag.dragging = false
	
 	// Get mouse position with respect to the page.
 	detMouse(event)

	// see if it is worth the effort repositioning
	if (!mouseMoved(mX,mY,lyrDrag.oX,lyrDrag.oY)) 
	{
		cleanSpan()
		return
	}

	// create node
	lyrDrag.elNode = null

	// render a new node based on the subscription node t1
	var t

	if (lyrDrag.tp == TAG_NAVLET)
	{
		var node = profileDoc.createElement(TAG_NAVLET)
		node.setAttribute(ATTR_KEY,lyrDrag.key)
		objNavigation.appendChild(node)
		
		rememberBookmarkKey(lyrDrag.key)
		t=renderNavlet(node)
	}
	else if (lyrDrag.tp == TAG_NUGLET) 
	{
		var node = profileDoc.createElement(TAG_NUGLET)
		node.setAttribute(ATTR_KEY,lyrDrag.key)
		objContent.appendChild(node)
		
		rememberBookmarkKey(lyrDrag.key)
		t=renderNuglet(node,rcCell)
	}
	else
	{
		portalWnd.cmnDlg.messageBox("lyrDrag.tp=\""+lyrDrag.tp+"\" "+
				subMsgs.getPhrase("LBL_UNDEFINED")+". [1819]");
		cleanSpan()
		return
	}
	if (t)
	{
		lyrDrag.elNode = t
		detCoords(t)
	
		// position new node
 		var lastLeft = (lyrDrag.oLeft + mX - lyrDrag.oX)
 		var lastTop = (lyrDrag.oTop + mY - lyrDrag.oY)
		layoutDrop(lastLeft, lastTop)
	}
}

function layoutDrop(lastLeft, lastTop)
{
	// from node is the node that was being dragged
	// lastLeft and lastTop are the upper left corner of lyrDrag
	if (lyrDrag.tp == TAG_NAVLET)
	{
		dropNavlet(lastLeft,lastTop)
		setDirty()
	}
	else if (lyrDrag.tp == TAG_NUGLET)
	{
		dropNuglet()
		setDirty()
	}

	cleanSpan()		
}

function cleanSpan() {
	if (hotSpan) {
		hotSpan.pos = 0
		hotSpan.className = "conLet"
		hotSpan = null
	}
}

function hotSpans(x,y) {
	// see if hot span still hot
	var edge
	var vertOnly = (lyrDrag.tp == TAG_NAVLET)
	if (hotSpan) {
		if (nodeContains(hotSpan,x,y)) {
			edge = detClosest(hotSpan,x,y,"edge",vertOnly)
			hotSpan.pos = edge
			return
		}
		else {
			cleanSpan()
		}
	}

	// find closest span
	var span
	var d
	var minSpan = null
	var minD = 5000 * 5000
	var arrSpans
	if (lyrDrag.tp == TAG_NAVLET) {
		arrSpans = arrNavletSpans
	}
	else if (lyrDrag.tp == TAG_NUGLET) {
		arrSpans = arrNugletSpans
	}
	if (!arrSpans)
		return
	for (var i=0;i<arrSpans.length;i++) {
		span = arrSpans[i]
		d = detClosest(span,x,y,"dist",vertOnly)
		if (d<minD) {
			minSpan = span
			minD = d
		}
	}
	
	// find closest edge
	if (minD < 100 * 100) {
		edge = detClosest(minSpan,x,y,"edge",vertOnly)
		hotSpan = minSpan
		hotSpan.pos = edge
		hotSpan.className = "conLetHot"
		return
	}
}

function dropNavlet(lastLeft, lastTop) {
	// from = old source node
	var fromElement = lyrDrag.elNode
	if (!fromElement)
		return

	var fromNode = fromElement.content
	var fromParent = fromNode.parentNode
	if (hotSpan!=null) {
		// to = new source node
		var toNode = hotSpan.content
		var notSame = (fromNode != toNode)
		if (notSame) {
			var toParent = toNode.parentNode
			var nextSibling = toNode.nextSibling
			fromParent.removeChild(fromNode)
			var beforeNode=null
			switch (hotSpan.pos) {
				//case 4,8:
				case 8:
					if (fromNode!=toNode)
						beforeNode=toNode
					break
		
				//case 2,6:
				case 2:
					if (fromNode!=nextSibling)
						beforeNode=nextSibling
					break
		
				default:
					break
			} // switch
			toParent.insertBefore(fromNode,beforeNode)
	
			renderNavigation()
		} // notSame
	} // hotSpan
	
	else if (lyrDrag.mode != MODE_SUBSCRIPTION) {
		fromParent.removeChild(fromNode)
		fromParent.appendChild(fromNode)
		renderNavigation()
	}
	
	else {
		renderNavigation()
	}
}

function dropNuglet() {
	// from = old source node
	var fromElement = lyrDrag.elNode
	if (!fromElement)
		return
	var fromNode = fromElement.content
	if (!fromNode)
		return
	var fromParent = fromNode.parentNode
	if (!fromParent)
		return
	if (hotSpan!=null) {
		// to = new source node
		var toNode = hotSpan.content
		if (!toNode)
			return
		var notSame = (fromNode != toNode)
		if (notSame) {

			var toParent = toNode.parentNode
			if (!toParent)
				return
			var toParentTag = toParent.tagName
			var toParentFlow = ((toParentTag == TAG_FLOW) ? toParent.getAttribute(ATTR_DIR) : null)
			var nextSibling = toNode.nextSibling
			var nextSibling2 = null
			if (nextSibling!=null)
				nextSibling2 = nextSibling.nextSibling
	
			fromParent.removeChild(fromNode)
			switch (hotSpan.pos) {
				case 8:
					if (!toParentFlow || toParentFlow == DIR_HORIZONTAL) {
	
						// remove elements
						toParent.removeChild(toNode)
						
						// create flow element in parent
						var toFlowNode = profileDoc.createElement(TAG_FLOW)
						toFlowNode.setAttribute(ATTR_DIR,DIR_VERTICAL)
						toFlowNode.appendChild(fromNode)
						
						if (nextSibling && nextSibling.parentNode == toParent)
							toParent.insertBefore(toFlowNode,nextSibling)			
						else if (nextSibling == fromNode) {
							toParent.insertBefore(toFlowNode,nextSibling2)
						} else
							toParent.appendChild(toFlowNode)
								
						// add nodes to flow element
						toFlowNode.appendChild(fromNode)
						toFlowNode.appendChild(toNode)

						transferWidthAttribute(toNode,toFlowNode)
					}
					else if (toParentFlow == DIR_VERTICAL) {
						var beforeNode
						if (fromNode==toNode) {
							//beforeNode=null
							beforeNode = nextSibling
						} else
							beforeNode=toNode
						toParent.insertBefore(fromNode,beforeNode)
					}
					cleanNode(fromParent)
					break
		
				case 4:
					if (!toParentFlow || toParentFlow == DIR_VERTICAL) {
						// remove elements
						toParent.removeChild(toNode)
						
						// create flow element in parent
						var toFlowNode = profileDoc.createElement(TAG_FLOW)
						toFlowNode.setAttribute(ATTR_DIR,DIR_HORIZONTAL)
						if (nextSibling && nextSibling.parentNode == toParent)
							toParent.insertBefore(toFlowNode,nextSibling)			
						else if (nextSibling == fromNode) {
							toParent.insertBefore(toFlowNode,nextSibling2)
						} else
							toParent.appendChild(toFlowNode)
	
						// add nodes to flow element
						toFlowNode.appendChild(fromNode)
						toFlowNode.appendChild(toNode)
						

						transferWidthAttribute(toNode,toFlowNode)
					}
					else if (toParentFlow == DIR_HORIZONTAL) {
						if (MAX_COLUMNS && toParent.childNodes.length>=MAX_COLUMNS) {
							toParent.parentNode.insertBefore(fromNode,toParent)
						} else {
							var beforeNode
							if (fromNode==toNode) {
								//beforeNode=null
								beforeNode = nextSibling
							} else
								beforeNode=toNode
							toParent.insertBefore(fromNode,beforeNode)
						}
					}
					cleanNode(fromParent)
					break
		
				case 6:
					if (!toParentFlow || toParentFlow == DIR_VERTICAL) {
						// remove elements
						toParent.removeChild(toNode)
						
						// create flow element in parent
						var toFlowNode = profileDoc.createElement(TAG_FLOW)
						toFlowNode.setAttribute(ATTR_DIR,DIR_HORIZONTAL)
						if (nextSibling && nextSibling.parentNode == toParent)
							toParent.insertBefore(toFlowNode,nextSibling)			
						else if (nextSibling == fromNode) {
							toParent.insertBefore(toFlowNode,nextSibling2)
						} else
							toParent.appendChild(toFlowNode)
								
						// add nodes to flow element
						toFlowNode.appendChild(toNode)
						toFlowNode.appendChild(fromNode)
						

						transferWidthAttribute(toNode,toFlowNode)
					}
					else if (toParentFlow == DIR_HORIZONTAL) {
						if (MAX_COLUMNS && toParent.childNodes.length>=MAX_COLUMNS) {
							toParent.parentNode.insertBefore(fromNode,toParent.nextSibling)
						} else {
							var beforeNode
							if (fromNode==nextSibling) {
								//beforeNode=null
								beforeNode = nextSibling2
							} else
								beforeNode=nextSibling
							toParent.insertBefore(fromNode,beforeNode)
						}
					}
					break
		
				case 2:
					if (!toParentFlow || toParentFlow == DIR_HORIZONTAL) {
						// remove elements
						toParent.removeChild(toNode)
						
						// create flow element in parent
						var toFlowNode = profileDoc.createElement(TAG_FLOW)
						toFlowNode.setAttribute(ATTR_DIR,DIR_VERTICAL)
						if (nextSibling && nextSibling.parentNode == toParent)
							toParent.insertBefore(toFlowNode,nextSibling)			
						else if (nextSibling == fromNode) {
							toParent.insertBefore(toFlowNode,nextSibling2)
						} else
							toParent.appendChild(toFlowNode)
		
						// add nodes to flow element
						toFlowNode.appendChild(toNode)
						toFlowNode.appendChild(fromNode)
						

						transferWidthAttribute(toNode,toFlowNode)
					}
					else if (toParentFlow == DIR_VERTICAL) {
						var beforeNode
						if (fromNode==nextSibling) {
							//beforeNode=null
							beforeNode = nextSibling2
						} else
							beforeNode=nextSibling
						toParent.insertBefore(fromNode,beforeNode)
					}
					break
		
				default:
					break
			} // switch hotSpan.pos
			cleanNode(fromParent)
			
			// redraw content pane
			renderContentPane()
		} // notSame
	} // hotSpan
	
	else if (lyrDrag.mode != MODE_SUBSCRIPTION) {
		// remove from old location
		fromParent.removeChild(fromNode)
		
 		// put element in parent at start or end
		var toParent = objContent
		var weight = mY - ((lastNuglet?lastNuglet.detBottom:rcCell.detTop)/2)
		if (weight<0 && toParent.firstChild) {
			toParent.insertBefore(fromNode,toParent.firstChild)
		} else {
			toParent.appendChild(fromNode)
		}
		
		cleanNode(fromParent)

		renderContentPane()
	}
	else {
		renderContentPane()
	}
}

// if this is a flow element and is now empty, remove it
function cleanNode(node) {
	var nodeTag = node.tagName
	var nodeParent = node.parentNode
	var nodeFlow = ((nodeTag == TAG_FLOW) ? node.getAttribute(ATTR_DIR) : null)
	
	// only continue if we are a flow node
	if (nodeFlow && nodeParent) {
		// if there are no children, remove this node
		var len=(node.childNodes?node.childNodes.length:0)
		if (len==0)
		{
			nodeParent.removeChild(node)
			return cleanNode(nodeParent)
		}

		// if there is only 1 child, this flow node can be pruned and the child raised
		if (len==1)
		{
			var sib = node.nextSibling
			nodeParent.removeChild(node)
			var pushNode = node.childNodes[0]
			nodeParent.insertBefore(pushNode,sib)
			transferWidthAttribute(node,pushNode)
			return true
		}
		
		var arr = node.getElementsByTagName(TAG_NUGLET)
		len = (arr?arr.length:0)
		
		// if there are no nuglet children, remove this node
		if (len == 0) {
			nodeParent.removeChild(node)
			cleanNode(nodeParent)
			return
		}

		// if there is only 1 nuglet child, this flow node can be pruned and the child raised
		else if (len == 1) {
			var sib = node.nextSibling
			nodeParent.removeChild(node)
			var pushNode = arr[0]
			nodeParent.insertBefore(pushNode,sib)
			transferWidthAttribute(node,pushNode)
			cleanNode(nodeParent)
			return	
		}
	}
}

function layoutDoubleClick(e)
{
	e = portalWnd.getEventObject(e,window);
	var t = portalWnd.getEventElement(e);
	if (t)
		layoutRemoveNode(t);
}

function btnDeleteClick(e)
{
	e = portalWnd.getEventObject(e,window);
	var t = portalWnd.getEventElement(e);
	if (t && t.span)
		layoutRemoveNode(t.span);
}

function layoutRemoveNode(node)
{
	// do not remove if locked!
	if (node.laylock)
	{
		portalWnd.cmnDlg.messageBox(getLaylockPhrase(node.laylock));
		return
	}

	var nodeContent = node.content
	if (!nodeContent) return
	var nodeParent = nodeContent.parentNode
	if (!nodeParent) return

	nodeParent.removeChild(nodeContent)
	var key = nodeContent.getAttribute(ATTR_KEY)
	if (key) forgetBookmarkKey(key)

	// remove from layout
	var bObj = getBookmarkObj(key)
	bookmarkClearLayout(bObj)
	
	var tp = node.tp
	if (tp == TAG_NAVLET)
		renderNavigation()
	else if (tp == TAG_NUGLET)
	{
		cleanNode(nodeParent)
		renderContentPane()
	}
	else return
	setDirty()
}

///// COLUMN DRAG

function columnDragStart(evt)
{
	// start dragging a column
	evt = portalWnd.getEventObject(evt,window);
	var t = portalWnd.getEventElement(evt);
	if (!t)	return;
		
	lyrDrag.elNode = t
	lyrDrag.tp = t.tp
	lyrDrag.mode = MODE_LAYOUT

	// Get cursor position with respect to the page.
	detMouse(evt)
	lyrDrag.oX = mX
	lyrDrag.oY = mY
	
	// iterative position finding code from menu.js
	detCoords(t)
	detCoords(t.baseNode)
			
	lyrDrag.oLeft = t.detLeft
	lyrDrag.oTop = t.detTop
	lyrDrag.oHeight = t.detHeight
	lyrDrag.oWidth = t.detWidth

	lyrDrag.baseLeft = lyrDrag.elNode.baseNode.detLeft
	lyrDrag.baseWidth = lyrDrag.elNode.baseNode.detWidth
	
	with (lyrDrag.style) {
		left = lyrDrag.oLeft + "px"
		top = lyrDrag.oTop + "px"
		height = lyrDrag.oHeight + "px"
		width = lyrDrag.oWidth + "px"
		visibility = "visible"
	}
	
	// Capture mousemove and mouseup events on the page.
	if (isIE) 
	{
		lyrDrag.setCapture()
		document.attachEvent("onmousemove", columnDragGo)
		document.attachEvent("onmouseup",   columnDragStop)
		window.event.cancelBubble = true
		window.event.returnValue = false
	}
	else
	{
		document.addEventListener("mousemove", columnDragGo,   true)
		document.addEventListener("mouseup",   columnDragStop, true)
		event.preventDefault()
	}
}

function columnDragGo(event) {
	lastX = mX
	lastY = mY
	detMouse(event)

	if (lastX != mX || lastY != mY)
	{
	
		// If moved, show draglayer
		if (!lyrDrag.dragging && mouseMoved(mX,mY,lyrDrag.oX,lyrDrag.oY)) {
			lyrDrag.dragging = true
			lyrDrag.style.visibility = "visible"
		}
	
 		// Move drag element by the same amount the cursor has moved.
		nL = (lyrDrag.oLeft + mX - lyrDrag.oX)
		nT = lyrDrag.oTop
		
		var p = ((nL-lyrDrag.baseLeft) / lyrDrag.baseWidth) * 100
		lyrDrag.alt = ( event.altKey && !event.ctrlKey && !event.shiftKey )
		if (lyrDrag.alt)
			p = (Math.round(p/gridPx)*gridPx)
		p=acceptP(p)
		
		nL = parseInt(lyrDrag.baseLeft + ((p * lyrDrag.baseWidth) / 100))

		lyrDrag.style.left = nL + "px"
		lyrDrag.style.top = nT + "px"
		window.status = colWidthPhrase + ": " + p + "%"
	}

	if (isIE) 
	{
		window.event.cancelBubble = true
	   	window.event.returnValue = false
	}
	else
   		event.preventDefault()
}

function columnDragStop(event) {
	// Stop capturing mousemove and mouseup events.
	if (isIE) 
	{
    	document.detachEvent("onmousemove", columnDragGo)
    	document.detachEvent("onmouseup", columnDragStop)
    	document.releaseCapture()
	}
	else
	{
    	document.removeEventListener("mousemove", columnDragGo, true)
    	document.removeEventListener("mouseup", columnDragStop, true)
  	}
	
	// hide drag layer
	lyrDrag.style.visibility = "hidden";
	portalWnd.cmnClearStatus();

	if (lyrDrag.dragging)
	{
		lyrDrag.dragging = false
		
	 	// Get mouse position
		detMouse(event)
	 	
		// position node
 		var nL = (lyrDrag.oLeft + mX - lyrDrag.oX)
		columnDrop(nL)
	}
}

function columnDrop(nL) {
	// Determine final
	var p = (nL-lyrDrag.baseLeft) / lyrDrag.baseWidth * 100
	if (lyrDrag.alt)
		p = (Math.round(p/gridPx)*gridPx)
	p=acceptP(p)
		
	var content = lyrDrag.elNode.baseNode.content
	if (content.hasChildNodes()) {
		var arrPercent = new Array()
		for(var i=0;i<content.childNodes.length;i++) {
			if (content.childNodes[i].nodeType == 1) {
				arrPercent[arrPercent.length] = content.childNodes[i]
			}
		}
		
		// 2 columns max
		if (arrPercent.length==2) {
			arrPercent[0].setAttribute(ATTR_WIDTH,p)
			arrPercent[1].setAttribute(ATTR_WIDTH,100-p)
			setDirty()
			renderContentPane()
		}
	}
}

// user pressed cancel button
function subCancel()
{
	setDirty(false);
	portalWnd.location.reload();
}
function subReloadPortal()
{
	setDirty(false);
	portalWnd.location.reload();
}

function setDirty(bIsDirty)
{
	if (typeof(bIsDirty) != "boolean")
		bIsDirty=true
	isDirty=bIsDirty
	
	// tell profile it has been modified, or cancel
	profile.setModified(bIsDirty);
		
	portalObj.toolbar.changeButtonState("save", bIsDirty ? "enabled" : "disabled")
	
}

function spanStateClick(e)
{
	e = portalWnd.getEventObject(e,window);
	var t = portalWnd.getEventElement(e);
	if (t && t.span) {
		var state = t.span.state;
		if (state && state == "min")
		{
			t.span.state = "max";
			t.span.stateImg.className="btnConPlus";
			t.span.content.setAttribute(ATTR_STATE,"max");
		}
		else
		{
			t.span.state = "min";
			t.span.stateImg.className="btnConMinus";
			t.span.content.setAttribute(ATTR_STATE,"min");
		}
		setDirty();
	}
}

function statusUpdate(s) {
	window.status = s
}

function getSublockPhrase(sublock,subscribed) {
	return locked1Phrase + " " + ((sublock == LOCK_USER)?(". "):"") + ((sublock == LOCK_ADMIN)?(yourAdminPhrase + " "):"") + locked2Phrase + " " + (subscribed?lockedSubPhrase:lockedUnsubPhrase)
}

// for some reason, need this in the divBookmarks, cannot use normal abandonChildren
function abandonChildrenLight(node) {
	var len = node.childNodes.length
	var childNode
	var i
	var arrRemove=new Array()
	for (i=0; i < len;i++)
	{
		childNode=node.childNodes[i]
		if (childNode.canHide)
			arrRemove[arrRemove.length]=childNode
	}
	for (i=arrRemove.length-1; i >= 0; i--)
	{
		// if IE, we can remove the node and clean up memory
		// in NS6.2.1 we cannot remove the node and show new nodes
		// it works in NS if we do an alert between each deletion,
		// but that would be irritating to the user.
		
		if (isIE)
			node.removeChild(arrRemove[i])
		else
		{
			arrRemove[i].style.visibility="hidden"
			arrRemove[i].style.height="0px"
		}
	}
}

function subRefresh()
{
	if (isDirty && (confirm(portalObj.getPhrase("LBL_SAVE_LAYOUT_QUESTION"))))
	{
		if (!subSave()) return;
	}
	setDirty(false);
	window.location.reload();
}

function subKeyDown(evt)
{
	evt = portalWnd.getEventObject(evt,window);
	if (!evt) return false;
		
	// check with portal for hotkey action
	var action = portalWnd.getFrameworkHotkey(evt,"subscriptions")
	if ( !action )
	{
		// framework handled the keystroke
		portalWnd.setEventCancel(evt)
		return false
	}

	// hotkey defined for this keystroke
	if (action != "subscriptions")
	{
		cntxtActionHandler(evt,action)
		portalWnd.setEventCancel(evt)
		return false
	}

	var evtCaught = false
	var keyVal = (isIE) ? evt.keyCode : evt.charCode
	if (keyVal == 0)	// netscape only
		keyVal = evt.keyCode

	if ( (keyVal == 13)	// enter
	&& (!evt.altKey && !evt.ctrlKey && !evt.shiftKey) )
	{
		var t=portalWnd.getEventElement(evt);
		if (t && typeof(t.click)=="function")
		{
			t.click()
			evtCaught = true
		}
	}

	if (evtCaught)
		portalWnd.setEventCancel(evt)
	return evtCaught
}

//-----------------------------------------------------------------------------
function cntxtActionHandler(evt,action)
{
	if (action==null)		// called by the portal
	{
		action = portalWnd.getFrameworkHotkey(evt,"subscriptions")
		if (!action || action=="subscriptions")
			return false
	}

	var bHandled=false
	switch (action)
	{
	case "doSubmit":
		if (isDirty)
		{
			subSubmit();
		}
		bHandled=true
		break
	case "doCancel":
		subCancel()
		bHandled=true
		break
	case "doNext":
		goNext()
		bHandled=true
		break
	case "doPrev":
		goPrev()
		bHandled=true
		break
	case "doRefresh":
		subRefresh();
		bHandled=true
		break
	case "openNewWindow":
		portalWnd.newPortalWindow("?_URL=users/subscriptions/index.htm");
		bHandled=true;
		break;
	case "posInFirstField":
		document.getElementById("txtSearch").focus()
		bHandled=true
		break
	}
	return (bHandled)
}

function subSubmit()
{
	if (subSave())
		setDirty(false);
}

function refreshLayoutBolds() {
	for (var i=0;i<arrNavlets.length;i++) {
		var key = arrNavlets[i]
		key = key.substring(4,key.length)
		var bObj=getBookmarkObj(key)
		var s=arrNavletSpans[i]
		bookmarkSetLayout(bObj,s)
	}
	for (var i=0;i<arrNuglets.length;i++) {
		var key = arrNuglets[i]
		key=key.substring(4,key.length)
		var bObj=getBookmarkObj(key)
		var s=arrNugletSpans[i]
		bookmarkSetLayout(bObj,s)
	}
}

///// bookmark object

// bookmarkObj for storing array of smart bookmarks
function BookmarkObj(key) {
	this.key = key
	this.unsubscribed=false
}

function bookmarkClearLayout(bObj) {
	bObj.layoutNode = null
	if (bObj.div && bObj.div.drag) {
		var subscribed = isChainSubscribedObj(bObj)
		bObj.div.drag.title=(subscribed?dragDblClickPhrase:noLayoutPhrase)
		with (bObj.div.drag.style) {
			fontStyle = "normal"
			fontWeight = "normal"
		}
	}
}

function bookmarkSetLayout(bObj,node) {
	bObj.layoutNode = node
	if (bObj.div && bObj.div.drag) {
		bObj.div.drag.title=inLayoutPhrase
		with (bObj.div.drag.style) {
			fontStyle = "italic"
			fontWeight = "bolder"
		}
	}
}

function bookmarkHasChildren(bObj) {
	// det child nodes for rendering 
	var ret = bObj.content.childNodes.length

	// in NS, childNodes may not be bookmarks
	if (!isIE && ret)
	{
		ret=false;
		for (var i=0; i < bObj.content.childNodes.length && !ret; i++)
			ret |= isBookmarkNode(bObj.content.childNodes[i]);
	}
	return ret;
}

function bookmarkRemoveLayoutChildren(bObj) {
	var content
	var key
	var c
	for (var i=0;i<bObj.content.childNodes.length;i++) {
		content = bObj.content.childNodes[i]
		if (isBookmarkNode(content)) {
			key=content.getAttribute(ATTR_KEY)
			c = getBookmarkObj(key)
			if (c) {
				// if in layout, remove
				if (c.layoutNode)
					layoutRemoveNode(c.layoutNode)
					
				// remove children from layout
				bookmarkRemoveLayoutChildren(c)
			}
		}
	}
}

function isBookmarkNode(node)
{
	var ret = ( isIE
		? (node.getAttribute(ATTR_KEY) && node.getAttribute(ATTR_NAME))
		: (node.nodeType == 1) && (node.tagName == TAG_AUTHEN_BOOKMARK) && node.hasAttributes() );
	return ret
}

// clear the search-related divs
function bookmarkResetSearch() {
	if (!arrBookmarkObj)
		return null
	var len = arrBookmarkObj.length
	for (var i=0;i<len;i++) {
		arrBookmarkObj[i].search = false
	}
	return null
}

// open the search-related divs
function bookmarkOpenSearch() {
	if (!arrBookmarkObj)
		return null
	var len = arrBookmarkObj.length
	for (var i=0;i<arrBookmarkObj.length;i++) {
		if (arrBookmarkObj[i].search)
			divBookOpen(arrBookmarkObj[i].div)
	}
}

function getBookmarkName(key,shouldFull) {
	// remove from bookmarks array
	var bObj = getBookmarkObj(key)
	if (!bObj)
		return null
	return getBookmarkObjName(bObj,shouldFull)
}

function getBookmarkObjName(bObj,shouldFull) {
	var ret=""
	if(shouldFull && bObj.content.parentNode.tagName == TAG_AUTHEN_BOOKMARK) {
		var key = bObj.content.parentNode.getAttribute(ATTR_KEY)
		if (key)
			ret+=getBookmarkName(key, shouldFull) + " / "
	}
	ret+=bObj.content.getAttribute(ATTR_NAME)
	return ret
}

function getBookmarkObjParent(bObj) {
	if(bObj && bObj.content && bObj.content.parentNode && bObj.content.parentNode.tagName == TAG_AUTHEN_BOOKMARK) {
		var key = bObj.content.parentNode.getAttribute(ATTR_KEY)
		if (key)
			return getBookmarkObj(key)
	}
	return null
}

function clearBookmarkObjSubscriptions() {
	if (!arrBookmarkObj)
		return
	var len = arrBookmarkObj.length
	var bObj = null
	for (var i=0;i<len;i++) {
		bObj = arrBookmarkObj[i]
		bObj.div = null
	}
}

function clearBookmarkObjNavigation() {
	if (!arrBookmarkObj)
		return
	var len = arrBookmarkObj.length
	var bObj = null
	for (var i=0;i<len;i++) {
		bObj = arrBookmarkObj[i]
		if (bObj.tp == TAG_NAVLET) {
			bookmarkClearLayout(bObj)
		}
	}
}

function clearBookmarkObjContent() {
	if (!arrBookmarkObj)
		return
	var len = arrBookmarkObj.length
	var bObj = null
	for (var i=0;i<len;i++) {
		bObj = arrBookmarkObj[i]
		if (bObj.tp == TAG_NUGLET) {
			bookmarkClearLayout(bObj)
		}
	}
}

function getBookmarkObj(key) {
	if (!arrBookmarkObj)
		return null
	var len = arrBookmarkObj.length
	var bObj = null
	for (var i=0;i<len;i++) {
		bObj = arrBookmarkObj[i]
		if (bObj.key == key)
			return bObj
	}
	return null
}

function getTrimBookmarkObj(key) {
	if (!arrBookmarkObj)
		return null
	var len = arrBookmarkObj.length
	var bObj = null
	for (var i=0;i<len;i++) {
		bObj = arrBookmarkObj[i]
		if (!bObj.trimKey)
			bObj.trimKey = trimLeadingZeros(bObj.key)
		if (bObj.trimKey == key)
			return bObj
	}
	return null
}

///// BOOKMARK KEYS

function rememberBookmarkKey(key)
{
	// add to bookmarks array
	if (!getBookmarkKey(key))
	{
		var bm = profileDoc.createElement(TAG_BOOKMARK)
		bm.setAttribute(ATTR_KEY,key)
		objBookmarkKeys.appendChild(bm)
	}
}

function forgetBookmarkKey(key) {
	// remove from bookmarks array
	var bm
	for (var i=0;i<objBookmarkKeys.childNodes.length;i++) {
		bm = objBookmarkKeys.childNodes[i]
		if (bm.nodeType == 1) {
			if (bm.getAttribute(ATTR_KEY) == key) {
				objBookmarkKeys.removeChild(bm)
				return
			}
		}
	}
}

function getBookmarkKey(key) {
	// find in bookmarks array
	var bm
	for (var i=0;i<objBookmarkKeys.childNodes.length;i++) {
		bm = objBookmarkKeys.childNodes[i]
		if (bm.nodeType == 1) {
			if (bm.getAttribute(ATTR_KEY) == key) {
				return bm
			}
		}
	}
	return null
}

///// BOOKMARK LOCKS

function getBookmarkLock(key,attr) {
	// attr is ATTR_LAYOUT or ATTR_SUBSCRIPTION
	var bm
	if (objAdminBlocks) {
		for (var i=0;i<objAdminBlocks.childNodes.length;i++) {
			bm = objAdminBlocks.childNodes[i]
			if (bm.nodeType == 1) {
				if (bm.getAttribute(ATTR_KEY) == key) {
					var s=bm.getAttribute(attr)
					if (s)
						return s
					break
				}
			}
		}
	}
	if (objUserBlocks) {
		for (var i=0;i<objUserBlocks.childNodes.length;i++) {
			bm = objUserBlocks.childNodes[i]
			if (bm.nodeType == 1) {
				if (bm.getAttribute(ATTR_KEY) == key) {
					var s=bm.getAttribute(attr)
					if (s)
						return s
					break
				}
			}
		}
	}
	return null
}

// modifies the mouse coordinates determined in detMouse (layout.js) for the
// current layout/scroll situation.
function detMouse2(event) {
	mdX=0
	mdY=0
	if (isIE) 
	{
		mdX = lyrLayout.scrollLeft
		mdY = lyrLayout.scrollTop
	}
	mX+=mdX
	mY+=mdY
}

// loop through the children bookmarks and hide all of the eye
// checkboxes for them all
function showBookmarkChildrenEyes(bObj, visible)
{
	if(!bObj) return
	
	var childrenAry = getBookmarkChildren(bObj);
	var loop = childrenAry.length;
		
	for (var i=0; i<loop; i++)
	{
		var key = childrenAry[i];
		var oChildBkmrk = getBookmarkObj(key);
		
		if (oChildBkmrk.div && oChildBkmrk.div.eye)
			oChildBkmrk.div.eye.style.visibility = visible ? "visible" : "hidden";

		if(oChildBkmrk)
			showBookmarkChildrenEyes(oChildBkmrk, visible);
	}
}
// return an array of the bookmark children keys
function getBookmarkChildren(parObj)
{
	var ret = new Array();
	
	if(!parObj || !parObj.content || !parObj.content.childNodes)
		return ret;
		
	var loop = parObj.content.childNodes.length

	for (var i=0; i<loop; i++)
	{	
		var oNode = parObj.content.childNodes[i];
		var key = oNode.getAttribute("key");
		ret.push(key);	
	}

	return ret;
}
function setLayoutPosition(oBkmrk)
{
	//check if bookmark is locked to navigation	
	if(oBkmrk.tp == TAG_NAVLET)
		return true;
	
	var oNavletNodes = objNavigation.getElementsByTagName(TAG_NAVLET);	
	var loop = (oNavletNodes ? oNavletNodes.length : 0);
	
	for(var i = 0; i < loop; i++)
	{
		var oNode = oNavletNodes[i];
		
		if(oNode.nodeType != "1")
			continue;
		
		var key = oNode.getAttribute("key");

		if(oBkmrk.key == key)
		{
			oBkmrk.tp = TAG_NAVLET;
			return true;	
		}	
	}
	
	//check if bookmark is locked to content
	if(oBkmrk.tp == TAG_NUGLET)
		return true;

	var oNugletNodes = objContent.getElementsByTagName(TAG_NUGLET);			
	var loop = (oNugletNodes ? oNugletNodes.length : 0);
	
	for(var i = 0; i < loop; i++)
	{
		var oNode = oNugletNodes[i];
		
		if(oNode.nodeType != "1")
			continue;

		var key = oNode.getAttribute("key");

		if(oBkmrk.key == key)
		{
			oBkmrk.tp = TAG_NUGLET;
			return true;	
		}			
	}
	
	//guess to where to put this bookmark
	oBkmrk.tp = (bookmarkHasChildren(oBkmrk)?TAG_NAVLET:TAG_NUGLET);
	return true;
}
