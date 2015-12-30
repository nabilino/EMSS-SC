/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/admin/usersandgroups/usersandgroups.js,v 1.32.2.1.4.12.8.1.2.3 2012/08/08 12:37:23 jomeli Exp $ */
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

var portalWnd=null;
var portalObj=null;
var USERSANDGROUPSJS="admin/usersandgroups/usersandgroups.js";

var formpageTitle = "" //title for the popup depending on whether user is adding/editing users or groups

// phrases
var addPhrase = "";
var addGroupPhrase = "";
var deleteGroupPhrase = "";
var editGroupPhrase = "";
var expandPhrase = "";
var findPhrase = "";
var forPhrase = "";
var nextPhrase = "";
var previousPhrase = "";
var removeUserGroupPhrase = "";
var userGroupsPhrase = "";
var usersGroupsPhrase = "";
var webUsersPhrase = "";

var oFrm=null;
var iFrm=null;

var grouplist
var grouplistPrevious = null;
var grouplistNext
var grouplistReload

var userlist
var userlistPrevious = null;
var userlistNext
var userlistReload

var lyrGroups
var lyrUsers
var txtGroupSearch
var txtUserSearch
var arrWindows

var lastDME = null
var lastAGS = null
var lastSubNode = null

// active ids
var activeUser = ""
var activeUserId = ""
var activeGroup = ""
var addOrEditUserOrGroupAPI = ""
var addEditURL = 'addedit.htm'

var searchFor
var scrWidth=0
var scrHeight=0
var perPage=25
var subCount=10
var MAX_NAME = 24

var groupSubNodes
var userSubNodes
var groupids
var userids
var usernames
var expandedUsers
var expandedGroups
var arrGroupPlus = null;
var arrUserPlus = null;

var groupW
var groupH

var isIE

var TAG_MESSAGE="Message"
var TAG_DME_MESSAGE = "MESSAGE"
var TAG_MSGNBR="MsgNbr"

//-----------------------------------------------------------------------------
function init()
{
	portalWnd=envFindObjectWindow("lawsonPortal");
	portalObj = portalWnd.lawsonPortal;

	subMsgs=new portalWnd.phraseObj("usersandgroups")
	usersGroupsPhrase = subMsgs.getPhrase("LBL_USERS_GROUPS")

	if (portalWnd.oPortalConfig.getShortIOSVersion() != "8.0.3")
	{
		var msg=usersGroupsPhrase+":\n"+portalObj.getPhrase("FEATURE_NOT_SUPPORTED");
		portalWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		portalWnd.goBack();
		return;
	}

	isIE = portalObj.browser.isIE
	iFrm=document.getElementById("formFrame");

	// phrases
	addGroupPhrase = subMsgs.getPhrase("LBL_ADD_USERGROUP")
	addWebuserPhrase = subMsgs.getPhrase("LBL_ADD_WEBUSER")
	deleteUserPhrase = subMsgs.getPhrase("LBL_DELETE_USER")
	deleteGroupPhrase = subMsgs.getPhrase("LBL_DELETE_GROUP")
	editGroupPhrase = subMsgs.getPhrase("LBL_EDIT_USERGROUP")
	editUserPhrase = subMsgs.getPhrase("LBL_EDIT_WEBUSER")
	expandPhrase = subMsgs.getPhrase("LBL_EXPAND")
	forPhrase = subMsgs.getPhrase("LBL_FOR")
	removeUserGroupPhrase = subMsgs.getPhrase("LBL_REMOVE_USER")
	userGroupsPhrase = subMsgs.getPhrase("LBL_USERGROUPS")
	webUsersPhrase = subMsgs.getPhrase("LBL_WEBUSERS")

	// layers
	var userGroups=document.getElementById("userGroups")
	var webUsers=document.getElementById("webUsers")
	grouplist=document.getElementById("grouplist")
	lyrGroups=document.getElementById("lyrGroups")
	userlist=document.getElementById("userlist")
	lyrUsers=document.getElementById("lyrUsers")
	txtGroupSearch = document.getElementById("txtGroupSearch")
	txtUserSearch=document.getElementById("txtUserSearch")

	previousPhrase = portalObj.getPhrase("LBL_PREVIOUS");
	nextPhrase = portalObj.getPhrase("LBL_NEXT");
	findPhrase = portalObj.getPhrase("LBL_FIND") 
	addPhrase = portalObj.getPhrase("LBL_ADD") 

	arrWindows = new Array()

	// groups
	var groupprev=document.getElementById("groupprev")
	portalWnd.cmnSetElementText(groupprev,previousPhrase);
	groupprev.title = previousPhrase;
	var groupnext=document.getElementById("groupnext")
	portalWnd.cmnSetElementText(groupnext,nextPhrase)
	groupnext.title = nextPhrase
	var groupsearch=document.getElementById("groupsearch")
	portalWnd.cmnSetElementText(groupsearch,findPhrase)
	groupsearch.title = findPhrase
	var groupadd=document.getElementById("groupadd")
	portalWnd.cmnSetElementText(groupadd,addPhrase)
	groupadd.title = addPhrase;
	var lblGroupSearch=document.getElementById("lblGroupSearch")
	portalWnd.cmnSetElementText(lblGroupSearch,findPhrase)

	// users
	var userprev=document.getElementById("userprev")
	portalWnd.cmnSetElementText(userprev,previousPhrase);
	userprev.title = previousPhrase;
	var usernext=document.getElementById("usernext")
	portalWnd.cmnSetElementText(usernext,nextPhrase)
	usernext.title = nextPhrase
	var usersearch=document.getElementById("usersearch")
	portalWnd.cmnSetElementText(usersearch,findPhrase)
	usersearch.title = findPhrase
	var lblUserSearch=document.getElementById("lblUserSearch")
	portalWnd.cmnSetElementText(lblUserSearch,findPhrase)

	// update text
	setTitle()
	portalWnd.cmnSetElementText(webUsers,webUsersPhrase)
	portalWnd.cmnSetElementText(userGroups,userGroupsPhrase)
	txtGroupSearch.onkeypress=groupKeyPress
	txtUserSearch.onkeypress=userKeyPress

	sizeFind()
	loadGroups("initial")
	loadUsers("initial")

	grouplist.style.visibility = "visible"
	userlist.style.visibility = "visible"

	setFocus()
	portalWnd.cmnClearStatus();
}

//-----------------------------------------------------------------------------
function setFocus()
{
	try {
		txtGroupSearch.focus()
	} catch (e) { }
}

//-----------------------------------------------------------------------------
function sizeFind()
{
	// reposition the find div
	scrWidth=(isIE
		? document.body.offsetWidth
		: window.innerWidth);
	scrHeight=(isIE
		? document.body.offsetHeight
		: window.innerHeight);

	var diff = (isIE) ? 0 : 4;
	var top = parseInt(lyrGroups.style.top,10);
	var height = (scrHeight - top - diff);
	lyrGroups.style.height = height + "px";
	lyrUsers.style.height = height + "px";
}

//-----------------------------------------------------------------------------
function loadGroups( loadedFrom )
{
	// loadedFrom can take one of 5 values:
	// initial -- on first load when window pops up
	// next -- when user clicks next link
	// previous -- when user clicks previous link
	// reload -- after a user has been deleted
	// search -- when user is doing a search.

	// dme call to get groups
	var api = portalWnd.DMEPath + "?"
	if( loadedFrom == "initial" )
	{
		api +=	"PROD=LOGAN&" +
				"FILE=SIRDGRP&" +
				"FIELD=GROUP;STATUS;&" +
				"MAX=" + perPage + "&" +
				"EXCLUDE=DRILL&" +
				"INDEX=RDGSET2&" +
				"KEY=1&" +
				"OUT=XML";
		grouplistReload = "";
	}
	else if( loadedFrom == "previous" )
	{
		if (!grouplistPrevious)
		{
			var msg = subMsgs.getPhrase("LBL_NO_PREV_GROUPS");
			portalWnd.cmnDlg.messageBox(msg,"ok","info",window);
			return;
		}
		api +=	"PROD=LOGAN&" +
				"FILE=SIRDGRP&" +
				"FIELD=GROUP;STATUS;&" +
				"MAX=" + perPage + "&" +
				"EXCLUDE=DRILL&" +
				"INDEX=RDGSET2&" +
				"KEY=1&" + grouplistPrevious + 
				"OUT=XML";
		grouplistReload = grouplistPrevious;
	}
	else if( loadedFrom == "next" )
	{
		if (!grouplistNext)
		{
			var msg = subMsgs.getPhrase("LBL_NO_NEXT_GROUPS");
			portalWnd.cmnDlg.messageBox(msg,"ok","info",window);
			return;
		}

		api += 	"PROD=LOGAN&" +
				"FILE=SIRDGRP&" +
				"FIELD=GROUP;STATUS;&" +
				"MAX=" + perPage + "&" +
				"EXCLUDE=DRILL&" +
				"INDEX=RDGSET2&" +
				"KEY=1&" + grouplistNext + 
				"OUT=XML";
		grouplistReload = grouplistNext;
	}
	else if( loadedFrom == "reload" )
	{
		api += 	"PROD=LOGAN&" +
				"FILE=SIRDGRP&" +
				"FIELD=GROUP;STATUS;&" +
				"MAX=" + perPage + "&" +
				"EXCLUDE=DRILL&" +
				"INDEX=RDGSET2&" +
				"KEY=1&" + grouplistReload + 
				"OUT=XML";
	}
	else
	{ // loadedFrom = "search"
		searchFor = portalWnd.trim( txtGroupSearch.value )
		grouplistReload = (searchFor
			 ? "SELECT=GROUP^~" + escape(searchFor) + "&" : "");

		api += 	"PROD=LOGAN&" +
				"FILE=SIRDGRP&" +
				"FIELD=GROUP;STATUS;&" +
				"MAX=" + perPage + "&" +
				"EXCLUDE=DRILL&" +
				"INDEX=RDGSET2&" +
				"KEY=1&" + grouplistReload + 
				"OUT=XML";
	}

	var oGrpXml=portalWnd.httpRequest(api,null,"","text/xml",false);
	if (portalWnd.oError.isErrorResponse(oGrpXml,true,true,false,"",window))
	{
		oGrpXml=null;
		return;
	}

	lastDME=oGrpXml;
	oGrpXml=portalWnd.oError.getDSObject();

	var arrMsgs=oGrpXml.document.getElementsByTagName(TAG_DME_MESSAGE);
	var lenMsgs=(arrMsgs?arrMsgs.length:0);
	if (lenMsgs && (arrMsgs[0].getAttribute("status")=="1"))
	{
		var msg=portalObj.getPhrase("LBL_ERROR") + " - " + arrMsgs[0].firstChild.nodeValue;
		portalWnd.cmnDlg.messageBox(msg,"ok","alert",window);
		return;
	}					

	renderGroups(oGrpXml);
	oGrpXml=null;
}

//-----------------------------------------------------------------------------
function renderGroups(oGrpXml)
{
	lyrGroups.style.visibility = "hidden"

	groupids = new Array()
	groupSubNodes = new Array()
	arrGroupPlus = new Array()

	// save position calls
	grouplistPrevious = oGrpXml.document.getElementsByTagName("PREVCALL");
	if(grouplistPrevious && grouplistPrevious.length)
		grouplistPrevious=grouplistPrevious[0].firstChild.nodeValue;
	else
		grouplistPrevious=null;

	grouplistNext = oGrpXml.document.getElementsByTagName("NEXTCALL")
	if(grouplistNext && grouplistNext.length)
		grouplistNext=grouplistNext[0].firstChild.nodeValue
	else
		grouplistNext=null

	// clear previous nodes
	abandonChildren(lyrGroups)

	var arrRECORD = oGrpXml.document.getElementsByTagName("RECORD")
	var len = arrRECORD.length

	var divNode = document.createElement("div")
	divNode.className = "usergroups"
	divNode.style.height = (scrHeight - 41) + "px"
	divNode.canHide = true

	if (len==0)
	{
		var tableNode = document.createElement("table")
		tableNode.style.textAlign = "center"
		tableNode.cellPadding = 1
		tableNode.cellSpacing = 1

		// header row
		var rowNode = tableNode.insertRow(-1)

		// row 0, col 0 - group
		var cellNode = rowNode.insertCell(-1)
		cellNode.className = "item"

		var descriptionPhrase = subMsgs.getPhrase("LBL_NO_RECORDS_EXIST")
		cellNode.appendChild(document.createTextNode(descriptionPhrase))

		divNode.appendChild(tableNode)

	}
	else
	{ // len>0

		// ----- start node table

		var arrCOL
		var btn = null;
		var name
		var status

		var bigTable
		var bigRow
		var bigCell

		var table
		var row
		var span
		var cell
		var img
		var anc
		var sub
		var j=0 // bgcolor

		var nameWidth = (isIE ? (parseInt((scrWidth/2) - 82,10) + "px") : "250px");
		///// BIG

		// big table
		bigTable = document.createElement("table")
		bigTable.cellPadding = 1
		bigTable.cellSpacing = 1
		bigTable.className = "xTTableList"

		// big row
		bigRow = bigTable.insertRow(-1)

		// big cell
		bigCell = bigRow.insertCell(-1)
		bigCell.style.width = "100%"

		for (var i=0; i < len; i++)
		{
			// get DME columns
			if (isIE)
			{
				arrCOL = arrRECORD[i].getElementsByTagName("COL")
				name = arrCOL[0].firstChild.nodeValue
				status = arrCOL[1].firstChild.nodeValue
			}
			else
			{
				arrCOL=getNodeChildElementsByTagName(arrRECORD[i],"COL")
				for (var k=0; k < arrCOL[0].childNodes.length; k++)
				{
					if (arrCOL[0].childNodes[k].nodeType==4)
					{
						name = arrCOL[0].childNodes[k].nodeValue
						break
					}
				}
				for (var k=0; k < arrCOL[1].childNodes.length; k++)
				{
					if (arrCOL[1].childNodes[k].nodeType==4)
					{
						status = arrCOL[1].childNodes[k].nodeValue
						break
					}
				}
			}

			groupids[i]=name

			if (name)
			{
				// small table
				table = document.createElement("table")
				table.cellPadding = 0
				table.cellSpacing = 0;
				table.style.backgroundColor = (j%2 ? "#FFFFFF" : "#E2ECE1");

				// small row i
				row = table.insertRow(-1)

				// small row i, col 0 - plus
				cell = row.insertCell(-1);
				cell.className = "xTPlusCell";
				btn = document.createElement("button");
				btn.className = "xTPlusIcon";
				btn.expandStatus = 0;
				btn.gutype = "group";
				btn.i = i;
				btn.onclick = spanToggle;
				btn.title = expandPhrase;
				arrGroupPlus[i] = btn;
				cell.appendChild(btn);

				// small row i, col 1 - name
				cell = row.insertCell(-1);
				with (cell.style)
				{
					overflow = "hidden";
					textAlign = "left";
					width = nameWidth;
				}
				btn = document.createElement("button")
				btn.className = "xTButton";
				btn.gutype = "group";
				btn.i = i;
				btn.onclick = spanToggle;
				btn.title = name;
				// construction required for NS6.  value does not work
				btn.appendChild(document.createTextNode(portalWnd.strLimitLen(name,MAX_NAME)));
				cell.appendChild(btn);

				// small row i, col 2 - edit img
				cell = row.insertCell(-1);
				cell.className = "xTRightCell23";
				btn = document.createElement("button");
				btn.className = "xTEditIcon";
				btn.clickAction = "edit";
				btn.gutype = "group";
				btn.i = i;
				btn.onclick = spanClick;
				btn.title = editGroupPhrase;
				cell.appendChild(btn);

				// small row i, col 3 - delete img
				cell = row.insertCell(-1);
				cell.className = "xTRightCell23";
				btn = document.createElement("button");
				btn.className  ="xTDeleteIcon";
				btn.clickAction = "delete";
				btn.gutype = "group";
				btn.i = i;
				btn.onclick = spanClick;
				btn.title = deleteGroupPhrase;
				cell.appendChild(btn);

				// small row i, col 4 - activate img
				cell = row.insertCell(-1);
				cell.className = "xTRightCell46";
				btn = document.createElement("button");
				btn.className = "xTActIcon";
				btn.clickAction = "activate";
				btn.gutype = "group";
				btn.i = i;
				btn.onclick = spanClick;
				btn.title = addWebuserPhrase;
				cell.appendChild(btn);

				// this group's users row
				row = table.insertRow(-1)

				// this group's users row, col 0-4
				cell = row.insertCell(-1);
				cell.colSpan = 5;
				cell.style.width = "100%";
				cell.textAlign = "left";

				groupSubNodes[i] = document.createElement("div")
				groupSubNodes[i].className = "xtSubDiv"
				groupSubNodes[i].i = i
				groupSubNodes[i].prevParam = null
				groupSubNodes[i].nextParam = null
				groupSubNodes[i].gutype = "group"
				groupSubNodes[i].loaded = false

				cell.appendChild(groupSubNodes[i])

				bigCell.appendChild(table)

				///// BIG
				j++
			}

		} // for
		divNode.appendChild(bigTable)

	} // len>0
	lyrGroups.appendChild(divNode)
	lyrGroups.style.visibility = "visible"
}

//-----------------------------------------------------------------------------
function loadUsers( loadedFrom )
{
	// loadedFrom can take one of 5 values:
	// initial -- on first load when window pops up
	// next -- when user clicks next link
	// previous -- when user clicks prev link
	// reload -- after a user has been deleted
	// search -- when user is doing a search.

	// dme call to get users
	var api = portalWnd.DMEPath + "?"
	if (loadedFrom == "initial")
	{
		api += 	"PROD=LOGAN&" +
				"FILE=SIRDIDHDR&" +
				"INDEX=IDHSET7&" +
				"FIELD=ID;ID-STATUS;WEB-USER;&" +
				"MAX=" + perPage + "&" +
				"SORTASC=WEB-USER&" +
				"OUT=XML&" +
				"SELECT=ID-STATUS=1";
		userlistReload = "";
	}
	else if (loadedFrom == "previous")
	{
		if (!userlistPrevious) 
		{
			var msg = subMsgs.getPhrase("LBL_NO_PREV_USERS")
			portalWnd.cmnDlg.messageBox(msg,"ok","info",window);
			return;
		}
		api += 	"PROD=LOGAN&" +
				"FILE=SIRDIDHDR&" +
				"INDEX=IDHSET7&" +
				"FIELD=ID;ID-STATUS;WEB-USER;&" +
				"MAX=" + perPage + "&" + userlistPrevious +
				"SORTASC=WEB-USER&" +
				"OUT=XML&" +
				"SELECT=ID-STATUS=1";
		userlistReload = userlistPrevious;
	}
	else if (loadedFrom == "next")
	{
		if (!userlistNext)
		{
			var msg = subMsgs.getPhrase("LBL_NO_NEXT_USERS")
			portalWnd.cmnDlg.messageBox(msg,"ok","info",window);
			return;
		}

		api += 	"PROD=LOGAN&" +
				"FILE=SIRDIDHDR&" +
				"INDEX=IDHSET7&" +
				"FIELD=ID;ID-STATUS;WEB-USER;&" +
				"MAX=" + perPage + "&" + userlistNext +
				"SORTASC=WEB-USER&" +
				"OUT=XML&" +
				"SELECT=ID-STATUS=1";
		userlistReload = userlistNext;
	}
	else if (loadedFrom == "reload")
	{
		api += 	"PROD=LOGAN&" +
				"FILE=SIRDIDHDR&" +
				"INDEX=IDHSET7&" +
				"FIELD=ID;ID-STATUS;WEB-USER;&" +
				"MAX=" + perPage + "&" + userlistReload +
				"SORTASC=WEB-USER&" +
				"OUT=XML&" +
				"SELECT=ID-STATUS=1";
	}
	else
	{ // loadedFrom = "search"
		searchFor = portalWnd.trim( txtUserSearch.value )
		userlistReload = (searchFor
			? "SELECT=ID-STATUS=1" + escape("&") + "WEB-USER^~" + escape(searchFor) + "&"
			: "");

		api += 	"PROD=LOGAN&" +
				"FILE=SIRDIDHDR&" +
				"INDEX=IDHSET7&" +
				"FIELD=ID;ID-STATUS;WEB-USER;&" +
				"MAX=" + perPage + "&" + userlistReload +
				"SORTASC=WEB-USER&" +
				"OUT=XML&";
	}

	var oUsrXml=portalWnd.httpRequest(api,null,"","text/xml",false);
	if (portalWnd.oError.isErrorResponse(oUsrXml,true,true,false,"",window))
	{
		oUsrXml=null;
		return;
	}

	lastDME=oUsrXml
	oUsrXml=portalWnd.oError.getDSObject();

	var arrMsgs=oUsrXml.document.getElementsByTagName(TAG_DME_MESSAGE);
	var lenMsgs=(arrMsgs?arrMsgs.length:0);
	if (lenMsgs && (arrMsgs[0].getAttribute("status")=="1"))
	{
		var msg=portalObj.getPhrase("LBL_ERROR") + " - " + arrMsgs[0].firstChild.nodeValue;
		portalWnd.cmnDlg.messageBox(msg,"ok","alert",window);
		return;
	}					

	renderUsers(oUsrXml);
	oUsrXml=null;
}

//-----------------------------------------------------------------------------
function renderUsers(oUsrXml)
{
	lyrUsers.style.visibility = "hidden"

	userids = new Array()
	usernames = new Array()
	userSubNodes = new Array()
	arrUserPlus = new Array();

	// save position calls
	userlistPrevious = oUsrXml.document.getElementsByTagName("PREVCALL");
	if(userlistPrevious && userlistPrevious.length)
		userlistPrevious=userlistPrevious[0].firstChild.nodeValue;
	else
		userlistPrevious=null;

	userlistNext = oUsrXml.document.getElementsByTagName("NEXTCALL")
	if(userlistNext && userlistNext.length)
		userlistNext=userlistNext[0].firstChild.nodeValue
	else
		userlistNext=null

	// clear previous nodes
	abandonChildren(lyrUsers)

	var arrRECORD = oUsrXml.document.getElementsByTagName("RECORD")
	var len = arrRECORD.length

	var divNode = document.createElement("div")
	divNode.className = "usergroups"
	divNode.style.height = (scrHeight - 41) + "px"
	divNode.canHide = true

	if (len==0)
	{
		var tableNode = document.createElement("table")
		tableNode.style.textAlign = "center"
		tableNode.cellPadding = 1
		tableNode.cellSpacing = 1

		// header row
		var rowNode = tableNode.insertRow(-1)

		// row 0, col 0 - group
		var cellNode = rowNode.insertCell(-1)
		cellNode.className = "item"

		var descriptionPhrase = subMsgs.getPhrase("LBL_NO_RECORDS_EXIST")
		cellNode.appendChild(document.createTextNode(descriptionPhrase))

		divNode.appendChild(tableNode)

	}
	else
	{ // len>0
		// ----- start node table
		var arrCOL
		var btn = null;
		var className
		var userid
		var name
		var status
		var bigTable
		var bigRow
		var bigCell
		var table
		var row
		var span
		var cell
		var img
		var anc
		var sub
		var j=0 // bgcolor
		var t="";

		var nameWidth = (isIE ? (parseInt((scrWidth/2) - 82,10)) : "300");
		var nameWidth2 = parseInt(2*nameWidth/3,10) + "px";
		var nameWidth3 = parseInt(nameWidth/3,10) + "px";

		// big table
		bigTable = document.createElement("table")
		bigTable.cellPadding = 1
		bigTable.cellSpacing = 1
		bigTable.className = "xTTableList"

		// big row
		bigRow = bigTable.insertRow(-1)

		// big cell
		bigCell = bigRow.insertCell(-1)
		bigCell.style.width = "100%"

		for (var i=0; i < len; i++)
		{
			// get DME columns
			if (isIE)
			{
				arrCOL = arrRECORD[i].getElementsByTagName("COL")
				userid = arrCOL[0].firstChild.nodeValue
				status = arrCOL[1].firstChild.nodeValue
				name = arrCOL[2].firstChild.nodeValue
			}
			else
			{
				arrCOL=getNodeChildElementsByTagName(arrRECORD[i],"COL")
				for (var k=0; k < arrCOL[0].childNodes.length; k++)
				{
					if (arrCOL[0].childNodes[k].nodeType==4)
					{
						userid = arrCOL[0].childNodes[k].nodeValue
						break
					}
				}
				for (var k=0; k < arrCOL[1].childNodes.length; k++)
				{
					if (arrCOL[1].childNodes[k].nodeType==4)
					{
						status = arrCOL[1].childNodes[k].nodeValue
						break
					}
				}
				for (var k=0; k < arrCOL[2].childNodes.length; k++)
				{
					if (arrCOL[2].childNodes[k].nodeType==4)
					{
						name = arrCOL[2].childNodes[k].nodeValue
						break
					}
				}
			}

			userids[i]=userid
			usernames[i]=name

			// DME is returning two of the same person during a search
			// so only render if this combo is unique

			for (var j=0; j < i; j++)
			{
				if (userids[j]==userids[i] && usernames[j]==usernames[i])
				{
					name = null
					j=i
				}
			}

			if (name)
			{
				// small table
				table = document.createElement("table")
				table.cellPadding = 0
				table.cellSpacing = 0
				table.style.backgroundColor = (j%2 ? "#FFFFFF" : "#E2ECE1");

				// small row i
				row = table.insertRow(-1)

				// small row i, col 0 - plus
				cell = row.insertCell(-1);
				cell.className = "xTPlusCell";
				btn = document.createElement("button");
				btn.className = "xTPlusIcon";
				btn.expandStatus = 0;
				btn.gutype = "user";
				btn.i = i;
				btn.onclick = spanToggle;
				btn.title = expandPhrase;
				arrUserPlus[i] = btn;
				cell.appendChild(btn);

				// small row i, col 1 - name
				cell = row.insertCell(-1);
				with (cell.style)
				{
					overflow = "hidden";
					textAlign = "left";
					width = nameWidth3;	// nameWidth2??
				}
				btn = document.createElement("button");
				btn.className = "xTButton";
				btn.gutype = "user";
				btn.i = i;
				btn.onclick = spanToggle;
				btn.style.width = nameWidth3;
				btn.title = name;
				// construction required for NS6.  value does not work
				btn.appendChild(document.createTextNode(portalWnd.strLimitLen(name,MAX_NAME)));
				cell.appendChild(btn);

				// small row i, col 2 - userid
				cell = row.insertCell(-1);
				with (cell.style)
				{
					overflow = "hidden";
					textAlign = "left";
					width = nameWidth3;
				}
				btn = document.createElement("button");
				btn.className = "xTButton";
				btn.gutype = "user";
				btn.i = i;
				btn.onclick = spanToggle;
				btn.style.width = nameWidth3;
				btn.title = userid;
				// construction required for NS6.  value does not work
				btn.appendChild(document.createTextNode(portalWnd.strLimitLen(userid,MAX_NAME)));
				cell.appendChild(btn);
				
				// small row i, col 3 - edit img
				cell = row.insertCell(-1);
				cell.className = "xTRightCell23";
				btn = document.createElement("button");
				btn.className = "xTEditIcon";
				btn.clickAction = "edit";
				btn.gutype = "user";
				btn.i = i;
				btn.onclick = spanClick;
				btn.title = editUserPhrase;
				cell.appendChild(btn);
	
				// small row i, col 4 - delete img
				cell = row.insertCell(-1);
				cell.className = "xTRightCell23";
				btn = document.createElement("button");
				btn.className = "xTDeleteIcon";
				btn.clickAction = "delete";
				btn.gutype = "user";
				btn.i = i;
				btn.onclick = spanClick;
				btn.title = deleteUserPhrase;
				cell.appendChild(btn);

				// small row i, col 5 - activate img
				cell = row.insertCell(-1);
				cell.className = "xTRightCell46";
				btn = document.createElement("button");
				btn.className = "xTActIcon";
				btn.clickAction = "activate";
				btn.gutype = "user";
				btn.i = i;
				btn.onclick = spanClick;
				btn.title = addGroupPhrase;
				cell.appendChild(btn);

				// this group's users row
				row = table.insertRow(-1)

				// this group's users row, col 0 - 5
				cell = row.insertCell(-1);
				cell.colSpan = 6;
				cell.style.width = "100%";
				cell.textAlign = "left";

				userSubNodes[i] = document.createElement("div")
				userSubNodes[i].className = "xtSubDiv"
				userSubNodes[i].i = i
				userSubNodes[i].gutype = "user"
				userSubNodes[i].prevParam = null
				userSubNodes[i].nextParam = null
				userSubNodes[i].loaded = false

				cell.appendChild(userSubNodes[i])

				bigCell.appendChild(table)
				j++
			} // name
		} // for
		divNode.appendChild(bigTable)

	} // len>0
	lyrUsers.appendChild(divNode)
	lyrUsers.style.visibility = "visible"
}

//-----------------------------------------------------------------------------
// Each of the 4 add/edit functions below open up the same html file (via openAddEdit)
// but just load it differently depending on the addOrEditUserOrGroupAPI string.
function addNewGroup()
{
	formpageTitle = "LBL_ADD_USERGROUP"
	with (iFrm.style)
	{
		zIndex=99
		visibility="visible"
		display="block"
	}
	if(!oFrm || oFrm.mode!="USRGRPADD")
	{
		oFrm=new Object()
		oFrm.mode="USRGRPADD"
		oFrm.doc=document
		portalWnd.formTransfer("RD55.2","LOGAN", iFrm,"","USRGRPADD","page")
	}
	else
		document.frames["formFrame"].FORM_OnInit()

}
//-----------------------------------------------------------------------------
function editGroup(group)
{
	formpageTitle = "LBL_EDIT_USERGROUP"
	with (iFrm.style)
	{
		zIndex=99;
		visibility="visible";
		display="block";
	}
	if (!oFrm || oFrm.mode!="USRGRPEDIT")
	{
		oFrm=new Object();
		oFrm.mode="USRGRPEDIT";
		oFrm.group=group;
		oFrm.doc=document;
		portalWnd.formTransfer("RD55.2","LOGAN", iFrm,group,"USRGRPEDIT","page");
	}
	else
	{
		oFrm.group=group;
		document.frames["formFrame"].doInq();
	}
}
//-----------------------------------------------------------------------------
function addNewUser()
{
	formpageTitle = "LBL_ADD_WEBUSER"
	with (iFrm.style)
	{
		zIndex=99
		visibility="visible"
		display="block"
	}
	if (!oFrm || oFrm.mode!="WEBUSRADD")
	{
		oFrm=new Object()
		oFrm.mode="WEBUSRADD"
		oFrm.doc=document
		top.formTransfer("RD30.1","LOGAN", iFrm,"","WEBUSRADD","page")
	}
	else
		document.frames["formFrame"].FORM_OnInit()
}
//-----------------------------------------------------------------------------
function editUser(user)
{
	formpageTitle = "LBL_EDIT_WEBUSER";
	if (!oFrm || oFrm.mode!="WEBUSREDIT")
	{
		oFrm=new Object();
		oFrm.mode="WEBUSREDIT";
		oFrm.user=user;
		oFrm.doc=document;
		portalWnd.formTransfer("RD30.1","LOGAN", iFrm,user,"WEBUSREDIT","page");
	}
	else
	{
		oFrm.user=user;
		document.frames["formFrame"].doInq();
	}
	with (iFrm.style)
	{
		zIndex=99
		visibility="visible"
		display="block"
	}
}
//-----------------------------------------------------------------------------
// user clicked on a span in the user or group table
function spanToggle(e)
{
	e = portalWnd.getEventObject(e,window);
	var t = portalWnd.getEventElement(e);
	if (t)
	{
		if (t.img)
			t=t.img;
		var i = t.i;
		var gutype = t.gutype;
		toggleSubnode(i,gutype);
	}
}

//-----------------------------------------------------------------------------
function toggleSubnode(i,gutype)
{
	var imgNode
	var subNode
	if (gutype=="user")
	{
		imgNode = arrUserPlus[i]
		subNode = userSubNodes[i]
		toggleImgStatus(imgNode)
	}
	else if (gutype=="group")
	{
		imgNode = arrGroupPlus[i]
		subNode = groupSubNodes[i]
		toggleImgStatus(imgNode)
	}
	else
		return
	if (imgNode.expandStatus)
	{
		if (!subNode.loaded)
			renderSubNode(i,subNode,gutype);
		subNode.style.visibility="visible";
		subNode.style.display="block";
	}
	else
	{
		subNode.style.visibility="hidden";
		subNode.style.display="none";
	}
}

//-----------------------------------------------------------------------------
function refreshSubnode(i,gutype)
{
	var imgNode
	var subNode
	if (gutype=="user")
	{
		imgNode = arrUserPlus[i]
		subNode = userSubNodes[i]
		setImgStatus(imgNode,false)
	}
	else if (gutype=="group")
	{
		imgNode = arrGroupPlus[i]
		subNode = groupSubNodes[i]
		setImgStatus(imgNode,false)
	}
	else
		return;
	subNode.style.visibility="hidden";
	subNode.style.display="none"
	subNode.loaded=false;
	toggleSubnode(i,gutype);
}

//-----------------------------------------------------------------------------
function toggleImgStatus(imgNode)
{
	setImgStatus(imgNode,!imgNode.expandStatus);
}

//-----------------------------------------------------------------------------
function setImgStatus(imgNode,s)
{
	with (imgNode)
	{
		expandStatus=s;
		className=expandStatus?"xTMinusIcon":"xTPlusIcon";
	}
}

//-----------------------------------------------------------------------------
// user clicked on an icon/button in a user or group table
function spanClick(e)
{
	e=portalWnd.getEventObject(e,window);
	var t=portalWnd.getEventElement(e);
	if (!t) return;

	if (t.img)
		t=t.img
	var i = t.i
	var gutype = t.gutype
	var a = t.clickAction

	switch (a)
	{
	case "activate":
		spanActivate (gutype,i);
		break;
	case "delete":
		spanDelete (gutype,i);
		break;
	case "edit":
		spanEdit (gutype,i);
		break;
	}
}

//-----------------------------------------------------------------------------
// user clicked on the activate icon for a group or user.
// this allows them to add users to a group,
// or associate a user with more groups.
function spanActivate(gutype, i) 
{
	// set active group or user and open a select window.
	var u="";
	var n="";
	var p='toolbar=no,location=no,status=yes,menubar=no,scrollbars=no,resizable=yes,width=450,height=500,dependent=yes';
	if (gutype=="user")
	{
		activeUser = usernames[i];
		activeUserId = userids[i];
		u='grouplist.htm';
		n='groupListPage';
	}
	else if (gutype=="group")
	{
		activeGroup = groupids[i];
		u='userlist.htm';
		n='userListPage';
	}
	
	if (u && n)
	{
		var w=window.open(u,n,p);
		arrWindows[arrWindows.length]=w;
		w.focus();
	}
}

//-----------------------------------------------------------------------------
function spanDelete(gutype, i)
{
	if (gutype=="user")
		deleteUser(userids[i],usernames[i]);
	else if (gutype=="group")
		deleteGroup(groupids[i]);
}

//-----------------------------------------------------------------------------
function deleteUser(user,username)
{
	var delPhrase = subMsgs.getPhrase("LBL_DELETE_USER")
	if ("ok" != portalWnd.cmnDlg.messageBox(delPhrase + " " + user + " (" + username + ") ?",
			"okcancel", "question",window))
		return;

	var api = portalWnd.AGSPath + "?" +
			"_PDL=LOGAN&" +
			"_TKN=RD30.1&" +
			"_LFN=ALL&" +
			"_EVT=CHG&" +
			"_RTN=MSG&" +
			"_TDS=IGNORE&" +
			"_OUT=XML&" +
			"FC=D&" +
			"IDH-ID=" + escape(user).replace(/\+/g,"%2B") + "&" +
			"_EOT=TRUE"
				
	deleteUserOrGroup(api)
}

//-----------------------------------------------------------------------------
function deleteGroup(group)
{
	var delPhrase = subMsgs.getPhrase("LBL_DELETE_GROUP")
	if ("ok" != portalWnd.cmnDlg.messageBox(delPhrase + " " + group + "?",
			"okcancel", "question",window))
		return;

	var api = portalWnd.AGSPath + "?" +
		"_PDL=LOGAN&" +
		"_TKN=RD55.2&" +
		"_LFN=ALL&" +
		"_EVT=CHG&" +
		"_RTN=MSG&" +
		"_TDS=IGNORE&" +
		"_OUT=XML&" +
		"FC=D&" +
		"RDG-GROUP=" + escape(group).replace(/\+/g,"%2B") + "&" +
		"_EOT=TRUE";

	deleteUserOrGroup(api)
}

//-----------------------------------------------------------------------------
function deleteUserOrGroup(api) 
{
	if (!api) return;
	try {
		var objDelete=portalWnd.httpRequest(api,null,"","text/xml",false);
		if (portalWnd.oError.isErrorResponse(objDelete,true,true,false,"",window))
		{
			objDelete=null;
			return;
		}
		objDelete=portalWnd.oError.getDSObject();
		lastAGS=objDelete

		var message=objDelete.getElementValue(TAG_MESSAGE)
		portalObj.setMessage(message)

		var msgNbr=objDelete.getElementValue(TAG_MSGNBR)
		if (msgNbr=="000")
		{
			loadGroups("reload")
			loadUsers("reload")
		}
		objDelete=null

	} catch (e) {
		portalWnd.oError.displayExceptionMessage(e,USERSANDGROUPSJS,"deleteUserOrGroup","",window);
	}
}

//-----------------------------------------------------------------------------
function spanEdit(gutype, i)
{
	if (gutype=="user")
		editUser(userids[i]);
	else if (gutype=="group")
		editGroup(groupids[i]);
}

//-----------------------------------------------------------------------------
// called in response from a user click in userlist.htm
function addUser(userid, user) 
{
	var api = portalWnd.AGSPath + "?" +
		"_PDL=LOGAN&" +
		"_TKN=RD55.2&" +
		"_LFN=FALSE&" +
		"_EVT=CHG&" +
		"_RTN=MSG&" +
		"_TDS=IGNORE&" +
		"_OUT=XML&" +
		"_DTLSEP=:&" +
		"FC=C&" +
		"RDG-GROUP=" + escape(activeGroup).replace(/\+/g,"%2B") + "&" +
		"LINE-FC:1=A&" +
		"WDG-ID:1=" + escape(userid).replace(/\+/g,"%2B") + "&" +
		"_EOT=TRUE"

	try {
		var objAdd=portalWnd.httpRequest(api,null,"","text/xml",false);
		if (portalWnd.oError.isErrorResponse(objAdd,true,true,false,"",window))
		{
			objAdd=null;
			return;
		}
		objAdd=portalWnd.oError.getDSObject();
		lastAGS=objAdd

		var message=objAdd.getElementValue(TAG_MESSAGE)
		portalObj.setMessage(message)

		var msgNbr=objAdd.getElementValue(TAG_MSGNBR)
		if (msgNbr=="000")
		{
			refreshGroup(activeGroup)
			refreshUser(user)
		}
		objAdd=null

	} catch (e) {
		portalWnd.oError.displayExceptionMessage(e,USERSANDGROUPSJS,"addUser","",window);
	}
}

//-----------------------------------------------------------------------------
// called in response from a user click in grouplist.htm
function addGroup(group)
{
	var api = portalWnd.AGSPath + "?" +
		"_PDL=LOGAN&" +
		"_TKN=RD55.2&" +
		//"_LFN=ALL&" +
		"_LFN=FALSE&" +
		"_EVT=CHG&" +
		"_RTN=MSG&" +
		"_TDS=IGNORE&" +
		"_OUT=XML&" +
		"FC=C&" +
		"_DTLSEP=:&" +
		"RDG-GROUP=" + escape(group).replace(/\+/g,"%2B") + "&" +
		"LINE-FC:1=A&" +
		//"WDG-ID:1=" + escape( activeUser ) + "&" +
		"WDG-ID:1=" + escape(activeUserId).replace(/\+/g,"%2B") + "&" +
		"_EOT=TRUE"

	try {
		var objAdd=portalWnd.httpRequest(api,null,"","text/xml",false);
		if (portalWnd.oError.isErrorResponse(objAdd,true,true,false,"",window))
		{
			objAdd=null;
			return;
		}
		objAdd=portalWnd.oError.getDSObject();

		var message=objAdd.getElementValue(TAG_MESSAGE)
		portalObj.setMessage(message)

		var msgNbr=objAdd.getElementValue(TAG_MSGNBR)
		if (msgNbr=="000")
		{
			refreshGroup(group)
			refreshUser(activeUserId)
		}
		objAdd = null

	} catch (e) {
		portalWnd.oError.displayExceptionMessage(e,USERSANDGROUPSJS,"addGroup","",window);
	}
}

//-----------------------------------------------------------------------------
// refresh sub nodes of group
function refreshGroup(group) 
{
	var i=findGroupI(group)
	if (i > -1)
		refreshSubnode(i,"group")
}

//-----------------------------------------------------------------------------
// find i value for group name
function findGroupI(group) 
{
	for (var i=0; i < groupids.length; i++)
	{
		if (groupids[i]==group)
			return i;
	}
	return -1;
}

//-----------------------------------------------------------------------------
// refresh sub nodes of user
function refreshUser(user) 
{
	var i=findUserI(user);
	if (i > -1)
		refreshSubnode(i,"user");
}

//-----------------------------------------------------------------------------
// find i value for user name
function findUserI(user) 
{
	for (var i=0; i < userids.length; i++)
	{
		if (userids[i]==user)
			return i;
	}
	return -1;
}

//-----------------------------------------------------------------------------
function spanRemoveClick(e)
{
	e=portalWnd.getEventObject(e,window);
	var t=portalWnd.getEventElement(e);
	if (t.img)
		t=t.img
	var i = t.i
	var gutype = t.gutype
	var userid
	var group
	if (gutype=="user")
	{
		userid = userids[i]
		group = t.group
	}
	else if (gutype=="group")
	{
		userid = t.userid
		group = groupids[i]
	}
	removeUserFromGroup(userid,group)
}

//-----------------------------------------------------------------------------
function removeUserFromGroup(user, group)
{
	var removePhrase = subMsgs.getPhrase("LBL_REMOVE_USER")
	if ("ok" != portalWnd.cmnDlg.messageBox(removePhrase,
			"okcancel", "question",window))
		return;

	var api = portalWnd.AGSPath + "?" +
			"_PDL=LOGAN&" +
			"_TKN=RD55.2&" +
			//"_LFN=ALL&" +
			"_LFN=FALSE&" +
			"_EVT=CHG&" +
			"_RTN=MSG&" +
			"_TDS=IGNORE&" +
			"_OUT=XML&" +
			"FC=C&" +
			"_DTLSEP=:&" +
			"RDG-GROUP=" + escape(group).replace(/\+/g,"%2B") + "&" +
			"LINE-FC:1=D&" +
			"WDG-ID:1=" + escape(user).replace(/\+/g,"%2B") + "&" +
			"_EOT=TRUE";

	try {
		var oDeleteXml=portalWnd.httpRequest(api,null,"","text/xml",false);
		if (portalWnd.oError.isErrorResponse(oDeleteXml,true,true,false,"",window))
		{
			oDeleteXml=null;
			return;
		}
		oDeleteXml=portalWnd.oError.getDSObject();
		lastAGS=oDeleteXml

		var message=oDeleteXml.getElementValue(TAG_MESSAGE)
		portalObj.setMessage(message)

		var msgNbr=oDeleteXml.getElementValue(TAG_MSGNBR)
		if (msgNbr=="000")
		{
			refreshGroup(group)
			refreshUser(user)
		}
		oDeleteXml = null
		
	} catch (e) { 
		portalWnd.oError.displayExceptionMessage(e,USERSANDGROUPSJS,"removeUserFromGroup","",window);
	}
}

//-----------------------------------------------------------------------------
function renderSubNode(i,subNode,gutype) 
{
	// remove old table
	abandonChildren(subNode)
	if (!subNode.loadedTable)
	{
		// sub node table
		var tableNode = document.createElement("table")
		tableNode.style.border = "0px"
		tableNode.style.width = "100%";
		tableNode.textAlign = "left"
		tableNode.cellPadding = 0
		tableNode.cellSpacing = 0

		// sub node row 0
		var rowNode = tableNode.insertRow(-1)

		// sub node row 0, col 0
		var cellNode = rowNode.insertCell(-1)
		cellNode.style.textAlign = "left";
		cellNode.style.width = "5%";

		// sub node row 0, col 1 - sub phrase
		cellNode = rowNode.insertCell(-1);
		cellNode.style.fontWeight = "bold";
		cellNode.style.textAlign = "left";
		cellNode.className = "tip"
		cellNode.style.whiteSpace="nowrap"
		if (gutype=="user")
			cellNode.colSpan = 1
		else if (gutype=="group")
			cellNode.colSpan = 2

		var subPhrase
		var api=portalWnd.DMEPath + "?"
		if (gutype=="user")
		{
			subNode.begin = ""
			subPhrase = userGroupsPhrase + " " + forPhrase + " " + usernames[i] + ":"
		}
		else if (gutype=="group")
		{
			subNode.begin = ""
			subPhrase = webUsersPhrase + " " + forPhrase + " " + groupids[i] + ":"
		}
		var labelNode=document.createElement("label");
		labelNode.onselectstart=portalWnd.cmnBlockSelect;
		var textNode = document.createTextNode(subPhrase);
		labelNode.appendChild(textNode);
		cellNode.appendChild(labelNode);

		// sub node row 0, col 2 - search
		cellNode = rowNode.insertCell(-1)
		cellNode.style.textAlign = "right";
		cellNode.className = "item"

		var sTable = document.createElement("table")
		sTable.style.border = "0px"
		sTable.cellPadding = 0
		sTable.cellSpacing = 0

		var sRow = sTable.insertRow(-1)

		// row 0 - col 0 - previous
		var sCell = sRow.insertCell(-1);
		sCell.style.verticalAlign = "middle";
		var btn = document.createElement("button");
		btn.className = "xTMiniButton";
		btn.onclick = previousSubNode;
		btn.subNode = subNode;
		btn.title = previousPhrase;
		// construction required for NS6.  value does not work
		btn.appendChild(document.createTextNode(previousPhrase));
		sCell.appendChild(btn);

		// row 0 - col 1 - next
		sCell = sRow.insertCell(-1)
		sCell.style.verticalAlign = "middle";
		btn = document.createElement("button");
		btn.className = "xTMiniButton";
		btn.onclick = nextSubNode;
		btn.subNode = subNode;
		btn.title = nextPhrase;
		// construction required for NS6.  value does not work
		btn.appendChild(document.createTextNode(nextPhrase));
		sCell.appendChild(btn);

		// row 0 - col 2 - input
		sCell = sRow.insertCell(-1);
		sCell.className = "xTMiniButton";
		var iNode = document.createElement("input");
		iNode.size = 10;
		iNode.className="xTMiniSearchField";
		iNode.onkeypress = inodekeyPress;
		iNode.subNode = subNode;
		subNode.iNode = iNode;
		sCell.appendChild(iNode);

		// row 0 - col 3 - find
		sCell = sRow.insertCell(-1);
		sCell.style.verticalAlign = "middle";
		btn = document.createElement("button");
		btn.className = "xTMiniButton";
		btn.onclick = searchSubNode;
		btn.subNode = subNode;
		btn.title = findPhrase;
		// construction required for NS6.  value does not work
		btn.appendChild(document.createTextNode(findPhrase));
		sCell.appendChild(btn);

		cellNode.appendChild(sTable)
		subNode.loadedTable = true
		subNode.appendChild(tableNode)
	}

	renderSubNodeRange(i,gutype,subNode,"")

	subNode.loaded = true
	oXml = null
}

//-----------------------------------------------------------------------------
function previousSubNode(e)
{
	e=portalWnd.getEventObject(e,window);
	var t=portalWnd.getEventElement(e);
	if (!t)
		return;
	if (t.img)
		t=t.img;
	var subNode = t.subNode;
	var i = subNode.i;
	var gutype = subNode.gutype;
	var param = subNode.prevParam;
	if (param)
		renderSubNodeRange(i,gutype,subNode,param);
	else
	{
		var m=(gutype == "user")?"LBL_NO_PREV_GROUPS":"LBL_NO_PREV_USERS";
		var msg=subMsgs.getPhrase(m);
		portalWnd.cmnDlg.messageBox(msg,"ok","info",window);
	}
}

//-----------------------------------------------------------------------------
function nextSubNode(e)
{
	e=portalWnd.getEventObject(e,window);
	var t=portalWnd.getEventElement(e);
	if (!t)
		return;
	if (t.img)
		t=t.img;
	var subNode = t.subNode;
	var i = subNode.i;
	var gutype = subNode.gutype;
	var param = subNode.nextParam;
	if (param)
		renderSubNodeRange(i,gutype,subNode,param);
	else
	{
		var m=(gutype == "user")?"LBL_NO_NEXT_GROUPS":"LBL_NO_NEXT_USERS";
		var msg=subMsgs.getPhrase(m);
		portalWnd.cmnDlg.messageBox(msg,"ok","info",window);
	}
}

//-----------------------------------------------------------------------------
function inodekeyPress(e) 
{
	if ( (isIE && window.event.keyCode == 13) 
	|| (!isIE && e.which == 13) )
	{
		searchSubNode(e)
		return false
	}
	return true
}

//-----------------------------------------------------------------------------
function searchSubNode(e)
{
	e=portalWnd.getEventObject(e,window);
	var t=portalWnd.getEventElement(e);
	if (!t)
		return;
	var subNode = t.subNode;
	var i = subNode.i;
	var gutype = subNode.gutype;
	var searchTxt = subNode.iNode.value;
	var param = "";
	if (searchTxt)
	{
		if (gutype=="user")
			param = "SELECT=group^~" + escape( searchTxt ) + "&";
		else if (gutype=="group")
			param = "SELECT=sirdidhdr.web-user^~" + escape( searchTxt ) + "&";
		renderSubNodeRange(i,gutype,subNode,param);
	} else
		renderSubNodeRange(i,gutype,subNode,"");
}

//-----------------------------------------------------------------------------
function renderSubNodeRange(i,gutype,subNode,param) 
{
	abandonChildren(subNode)

	var api=portalWnd.DMEPath + "?"
	if (gutype=="user")
	{
		api += 	"PROD=LOGAN&" +
				"FILE=SIRDIDGRP&" +
				"FIELD=group;sirdgrp.description;&" +
				"INDEX=WDGSET2&" +
				"KEY=" + escape(userids[i]) + "&" + param +
				"MAX=" + subCount + "&" +
				"OUT=XML";
	}
	else if (gutype=="group")
	{
		api += 	"PROD=LOGAN&" +
				"FILE=SIRDIDGRP&" +
				"FIELD=sirdidhdr.web-user;id;&" +
				"INDEX=WDGSET1&" +
				"KEY=" + escape(groupids[i]) + "&" + param +
				"MAX=" + subCount + "&" +
				"OUT=XML";
			// do not show this sort - it is misleading.
			//"SORTASC=sirdidhdr.web-user&" +
	}
	var oXml=portalWnd.httpRequest(api,null,"","text/xml",false);
	if (portalWnd.oError.isErrorResponse(oXml,true,true,false,"",window))
	{
		oXml=null;
		return;
	}
	oXml=portalWnd.oError.getDSObject();
	lastDME=oXml
	lastSubNode=subNode
	if (isIE)
		renderSubNodeRange2(i,gutype,param)
	else
		setTimeout("renderSubNodeRange2("+i+",'"+gutype+"','"+param+"')",100)
}

//-----------------------------------------------------------------------------
function renderSubNodeRange2(i,gutype,param)
{
	// sub node table
	var tableNode = document.createElement("table");
	tableNode.style.width = "100%";
	tableNode.textAlign = "left";
	tableNode.cellPadding = 0;
	tableNode.cellSpacing = 0
	tableNode.canHide = true;

	var subNode=lastSubNode
	var oXml=lastDME

	// save position calls
	var prevParam = oXml.document.getElementsByTagName("PREVCALL")
	if(prevParam && prevParam.length)
		subNode.prevParam=prevParam[0].firstChild.nodeValue
	else
		subNode.prevParam=null

	var nextParam = oXml.document.getElementsByTagName("NEXTCALL")
	if(nextParam && nextParam.length)
		subNode.nextParam=nextParam[0].firstChild.nodeValue
	else
		subNode.nextParam=null

	// render subnodes
	var arrRECORD = oXml.document.getElementsByTagName("RECORD")
	var len = arrRECORD.length

	if (len < 1)
	{
		subNode.appendChild(tableNode);
		return;
	}

	// get DME records
	for (var j=0; j < len; j++)
	{
		if (gutype=="user")
		{
			var group
			var description

			// get DME columns
			var arrCOL
			if (isIE)
			{
				arrCOL = arrRECORD[j].getElementsByTagName("COL")
				group=arrCOL[0].firstChild.nodeValue
				description=arrCOL[1].firstChild.nodeValue
			}
			else
			{
				arrCOL=getNodeChildElementsByTagName(arrRECORD[j],"COL")
				for (var k=0; k < arrCOL[0].childNodes.length; k++)
				{
					if (arrCOL[0].childNodes[k].nodeType==4)
					{
						group = arrCOL[0].childNodes[k].nodeValue
						break
					}
				}
				for (var k=0; k < arrCOL[1].childNodes.length; k++)
				{
					if (arrCOL[1].childNodes[k].nodeType==4)
					{
						description = arrCOL[1].childNodes[k].nodeValue
						break
					}
				}
			}

			// sub node row i
			rowNode = tableNode.insertRow(-1)

			// sub node row i, col 0 - spacer
			cellNode = rowNode.insertCell(-1);
			cellNode.className = "xTPlusCell";

			// sub node row i, col 1 - delete
			cellNode = rowNode.insertCell(-1);
			cellNode.style.width = "5%";
			var btn = document.createElement("button");
			btn.className = "xTDeleteIcon";
			btn.group = group;
			btn.gutype = gutype;
			btn.i = i;
			btn.onclick=spanRemoveClick;
			btn.title = removeUserGroupPhrase;
			cellNode.appendChild(btn);

			// sub node row i, col 2 - group
			cellNode = rowNode.insertCell(-1);
			cellNode.style.textAlign = "left"
			cellNode.style.whiteSpace="nowrap"
			cellNode.className = "item"
			var labelNode=document.createElement("label");
			labelNode.onselectstart=portalWnd.cmnBlockSelect;
			textNode = document.createTextNode(portalWnd.strLimitLen(group,MAX_NAME));
			labelNode.appendChild(textNode);
			cellNode.appendChild(labelNode);

			// sub node row i, col 3 - description
			cellNode = rowNode.insertCell(-1);
			cellNode.style.textAlign = "left"
			cellNode.style.whiteSpace="nowrap"
			cellNode.className = "item"
			labelNode=document.createElement("label");
			labelNode.onselectstart=portalWnd.cmnBlockSelect;
			textNode = document.createTextNode(portalWnd.strLimitLen(description,MAX_NAME));
			labelNode.appendChild(textNode);
			cellNode.appendChild(labelNode);
		}

		else if (gutype=="group")
		{
			var user
			var userid

			// get DME columns
			var arrCOL 
			if (isIE)
			{
				arrCOL = arrRECORD[j].getElementsByTagName("COL")
				user=arrCOL[0].firstChild.nodeValue
				userid=arrCOL[1].firstChild.nodeValue
			}
			else
			{
				arrCOL=getNodeChildElementsByTagName(arrRECORD[j],"COL")
				for (var k=0; k < arrCOL[0].childNodes.length; k++)
				{
					if (arrCOL[0].childNodes[k].nodeType==4)
					{
						user = arrCOL[0].childNodes[k].nodeValue
						break
					}
				}
				for (var k=0; k < arrCOL[1].childNodes.length; k++)
				{
					if (arrCOL[1].childNodes[k].nodeType==4)
					{
						userid = arrCOL[1].childNodes[k].nodeValue
						break
					}
				}
			}

			// sub node row i
			rowNode = tableNode.insertRow(-1)

			// sub node row i, col 0 - spacer
			cellNode = rowNode.insertCell(-1);
			cellNode.className = "xTPlusCell";

			// sub node row i, col 1 - delete
			cellNode = rowNode.insertCell(-1);
			cellNode.style.width = "5%";
			var btn = document.createElement("button");
			btn.className = "xTDeleteIcon";
			btn.gutype = gutype;
			btn.i = i;
			btn.onclick=spanRemoveClick;
			btn.title = removeUserGroupPhrase;
			btn.userid = userid;
			cellNode.appendChild(btn);

			// sub node row i, col 2 - user
			cellNode = rowNode.insertCell(-1);
			cellNode.style.textAlign = "left"
			cellNode.className = "item"
			cellNode.title = user
			var labelNode=document.createElement("label");
			labelNode.onselectstart=portalWnd.cmnBlockSelect;
			textNode = document.createTextNode(portalWnd.strLimitLen(user,MAX_NAME));
			labelNode.appendChild(textNode);
			cellNode.appendChild(labelNode);

			// sub node row i, col 3 - id
			cellNode = rowNode.insertCell(-1);
			cellNode.style.textAlign = "left"
			cellNode.className = "item"
			cellNode.title = userid
			labelNode=document.createElement("label");
			labelNode.onselectstart=portalWnd.cmnBlockSelect;
			textNode = document.createTextNode(portalWnd.strLimitLen(userid,MAX_NAME))
			labelNode.appendChild(textNode);
			cellNode.appendChild(labelNode);
		}
	} // for

	subNode.appendChild(tableNode)
}

//-----------------------------------------------------------------------------
function groupKeyPress(e) 
{
	if ( (isIE && window.event.keyCode == 13) 
	|| (!isIE && e.which == 13) )
	{
		loadGroups('search')
		return false
	}
	return (isIE)
}

//-----------------------------------------------------------------------------
function userKeyPress(e) 
{
	if ( (isIE && window.event.keyCode == 13) 
	|| (!isIE && e.which == 13))
	{
		loadUsers("search")
		return false
	}
	return (isIE)
}

//-----------------------------------------------------------------------------
function ugKeyDown(evt)
{
	evt = portalWnd.getEventObject(evt,window);
	if (!evt) return false;

	// check with portal for hotkey action
	var action = portalWnd.getFrameworkHotkey(evt,"usersgroups");
	if ( !action )
	{
		// framework handled the keystroke
		portalWnd.setEventCancel(evt)
		return false;
	}

	// hotkey defined for this keystroke
	if (action != "usersgroups")
	{
		cntxtActionHandler(evt,action);
		portalWnd.setEventCancel(evt)
		return false;
	}

	var evtCaught = false
	var keyVal = (isIE ? evt.keyCode : evt.charCode)
	if (keyVal == 0) // netscape only
		keyVal = evt.keyCode;

	var charCode = String.fromCharCode(keyVal);
	var t = portalWnd.getEventElement(evt);
	if (t && keyVal == 13 && typeof(t.onclick) == "function") // enter
	{
		t.click();
		evtCaught = true;
	}

	if (evtCaught)
		portalWnd.setEventCancel(evt);
	return evtCaught;
}

//-----------------------------------------------------------------------------
function cntxtActionHandler(evt,action)
{
	if (action==null)		// called by the portal
	{
		if (oFrm)
			return (iFrm.cntxtActionHandler(evt,action));
		action = portalWnd.getFrameworkHotkey(evt,"usersgroups");
		if (!action || action=="usersgroups")
			return false;
	}

	var bHandled=false;
	switch (action)
	{
	case "doCancel":
		if (oFrm)
			ugHideFormFrame(false);
		else
			portalWnd.goHome()
		bHandled=true
		break;
	case "posInFirstField":
		if (oFrm)
			return (iFrm.cntxtActionHandler(evt,action));
        setFocus()
		bHandled=true
		break;
	}
	return (bHandled);
}

//-----------------------------------------------------------------------------
function closeAccessWindows() 
{
	if (arrWindows)
	{
		for (var i=0; i < arrWindows.length; i++)
		{
			if (arrWindows[i] && arrWindows[i].close)
				arrWindows[i].close();
		}
	}
	arrWindows = new Array();
}

//-----------------------------------------------------------------------------
function unloadFunc() 
{
	portalWnd.cmnClearStatus();
	closeAccessWindows();
	if (typeof(portalWnd.formUnload) == "function")
		portalWnd.formUnload();
}

//-----------------------------------------------------------------------------
function detCoords(t) 
{
	// in ns, t sometimes null
	if (!t)	return;

	if (isIE)
	{
		// if IE, loop upwards, adding coordinates
	 	var oTmp=t
		var iTop=0
		var iLeft=0

		if (typeof(oTmp.offsetParent) != "object")
			return

		while(oTmp.offsetParent)
		{
			iTop+=oTmp.offsetTop
			iLeft+=oTmp.offsetLeft
			oTmp=oTmp.offsetParent
		}

		t.detLeft = iLeft
		t.detTop = iTop
	}
	else
	{
		// if NS, get pageX, pageY
		t.detLeft = t.offsetLeft
		t.detTop = t.offsetTop
		t.detLeft+=layoutLeft
		t.detTop+=layoutTop
	}

	t.detWidth = parseInt(t.offsetWidth,10)
	t.detHeight = parseInt(t.offsetHeight,10)
	t.detRight = t.detLeft + t.detWidth
	t.detBottom = t.detTop + t.detHeight

	t.detCoords = true
}

//-----------------------------------------------------------------------------
// called from lawform.xsl, lawformc.xsl
function initializeFramework() 
{
	if (portalWnd.rfWindow && (typeof(portalWnd.rfWindow.FORM_OnInit)=="function") )
		portalWnd.rfWindow.FORM_OnInit()
}

//-----------------------------------------------------------------------------
function setTitle()
{
	document.title = usersGroupsPhrase
	portalObj.setTitle(usersGroupsPhrase)
	portalObj.toolbar.target=top
	portalObj.toolbar.clear()
	portalObj.toolbar.createButton(portalObj.getPhrase("LBL_HOME"), 
			"goHome()", "home", "", "", "home");
}
//-----------------------------------------------------------------------------
function ugHideFormFrame(bRefresh)
{
	with (iFrm.style)
	{
		zIndex=0;
		visibility="hidden";
		display="none";
	}
	oFrm=null;
	setTitle();
	setFocus();
	portalWnd.cmnClearStatus();

	if (bRefresh)
	{
		loadGroups("reload");
		loadUsers("reload");
	}
}