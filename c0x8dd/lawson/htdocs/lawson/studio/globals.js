/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/globals.js,v 1.3.2.2.4.2.6.1.6.2 2012/08/08 12:48:51 jomeli Exp $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// globals.js
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

// services path variables -------------------------------------
var portalPath;
var studioPath;
var contentPath;
var servicesPath = "/servlet";
var cgiPath = "/cgi-lawson";
var AGSPath="/servlet/Router/Transaction/Erp"
var DMEPath="/servlet/Router/Data/Erp"
var IDAPath="/servlet/Router/Drill/Erp"

// global objects ----------------------------------------------
var designStudio=null;
var xmlFactory=null;
var cmnDlg=null;
var fileMgr=null;
var oPreviewWin=null;
var oApiWin=null;
var oPreview=null;

// sso related variables ---------------------------------------
var bInSSOCheck=false;		// set during active check to eliminate
							// double call to logout method

// key codes ---------------------------------------------------
function Keys() {};
Keys.prototype.BACKSPACE = 8;
Keys.prototype.TAB = 9;
Keys.prototype.ENTER = 13;
Keys.prototype.SHIFT = 16;
Keys.prototype.CONTROL = 17;
Keys.prototype.ALT = 18;
Keys.prototype.ESCAPE = 27;
Keys.prototype.SPACE = 32;
Keys.prototype.PAGE_UP = 33;
Keys.prototype.PAGE_DOWN = 34;
Keys.prototype.END = 35;
Keys.prototype.HOME = 36;
Keys.prototype.LEFT_ARROW = 37;
Keys.prototype.UP_ARROW = 38;
Keys.prototype.RIGHT_ARROW = 39;
Keys.prototype.DOWN_ARROW = 40;
Keys.prototype.INSERT = 45;
Keys.prototype.DELETE = 46;
Keys.prototype.AKEY = 65;
Keys.prototype.BKEY = 66;
Keys.prototype.CKEY = 67;
Keys.prototype.DKEY = 68;
Keys.prototype.EKEY = 69;
Keys.prototype.FKEY = 70;
Keys.prototype.GKEY = 71;
Keys.prototype.HKEY = 72;
Keys.prototype.IKEY = 73;
Keys.prototype.JKEY = 74;
Keys.prototype.KKEY = 75;
Keys.prototype.LKEY = 76;
Keys.prototype.MKEY = 77;
Keys.prototype.NKEY = 78;
Keys.prototype.OKEY = 79;
Keys.prototype.PKEY = 80;
Keys.prototype.QKEY = 81;
Keys.prototype.RKEY = 82;
Keys.prototype.SKEY = 83;
Keys.prototype.TKEY = 84;
Keys.prototype.UKEY = 85;
Keys.prototype.VKEY = 86;
Keys.prototype.WKEY = 87;
Keys.prototype.XKEY = 88;
Keys.prototype.YKEY = 89;
Keys.prototype.ZKEY = 90;
Keys.prototype.KEYPAD_PLUS = 107;
Keys.prototype.KEYPAD_MINUS = 109;
Keys.prototype.KEYPAD_DELETE = 110;
Keys.prototype.QUOTE = 222;
if (!window.keys)
	window.keys=new Keys();

// Design Studio events ----------------------------------------
var ON_LOAD_DESIGNER_COMPLETE = "LOAD_DESIGNER_COMPLETE";
var ON_DOCUMENT_INITIALIZED = "DOCUMENT_INITIALIZED";
var ON_CLICK_TOOLBOX_ITEM = "ON_CLICK_TOOLBOX_ITEM";
var ON_DBLCLICK_TOOLBOX_ITEM = "ON_DBLCLICK_TOOLBOX_ITEM";
var ON_CLICK_MENU = "ON_CLICK_MENU";
var ON_CLICK_MENUITEM = "ON_CLICK_MENUITEM";
var ON_BEFORE_DELETE_CONTROLS = "ON_BEFORE_DELETE_CONTROLS";
var ON_BEFORE_SWITCH_VIEW = "ON_BEFORE_SWITCH_VIEW";
var ON_SWITCH_VIEW = "ON_SWITCH_VIEW";
var ON_BEFORE_MOVE_IN = "ON_BEFORE_MOVE_IN";
var ON_BEFORE_IN = "ON_MOVE_IN";
var ON_BEFORE_MOVE_OUT = "ON_BEFORE_MOVE_OUT";
var ON_BEFORE_OUT = "ON_MOVE_OUT";
var ON_PROPERTYAREA_PAINTED = "ON_PROPERTYAREA_PAINTED";
var ON_CONTROL_INSTANCE_CREATED = "ON_CONTROL_INSTANCE_CREATED";
var ON_CONTROL_INSTANCE_COPIED = "ON_CONTROL_INSTANCE_COPIED";
var ON_CONTROL_INSTANCE_DELETED = "ON_CONTROL_INSTANCE_DELETED";
var ON_BEFORE_METRIC_RULE_CHANGE = "ON_BEFORE_METRIC_RULE_CHANGE";
var ON_PROPERTY_CHANGE = "ON_PROPERTY_CHANGE";
var ON_PROPERTYPAGE_RETURN = "ON_PROPERTYPAGE_RETURN";
var ON_CLICK_PROPAREA_BROWSEBTN = "ON_CLICK_PROPAREA_BROWSEBTN";
var ON_CLICK_PROPPAGE="ON_CLICK_PROPPAGE";
var ON_WINDOW_ACTIVATE = "ON_WINDOW_ACTIVATE";
var ON_WINDOW_INACTIVATE = "ON_WINDOW_INACTIVATE";
var ON_BEFORE_PA_CLEAR = "ON_BEFORE_PA_CLEAR";

// HTTP status messages (from MSDN) ----------------------------
var gHttpStat=new Array();
	gHttpStat["100"] = "The request can be continued.";
	gHttpStat["101"] = "The server has switched protocols in an upgrade header.";
	gHttpStat["200"] = "The request completed successfully.";
	gHttpStat["201"] = "The request has been fulfilled and resulted in the creation of a new resource.";
	gHttpStat["202"] = "The request has been accepted for processing, but the processing has not been completed.";
	gHttpStat["203"] = "The returned meta information in the entity-header is not the definitive set available from the origin server.";
	gHttpStat["204"] = "The server has fulfilled the request, but there is no new information to send back.";
	gHttpStat["205"] = "The request has been completed, and the client program should reset the document view that caused the request to be sent to allow the user to easily initiate another input action.";
	gHttpStat["206"] = "The server has fulfilled the partial GET request for the resource.";
	gHttpStat["300"] = "The server couldn't decide what to return.";
	gHttpStat["301"] = "The requested resource has been assigned to a new permanent URI (Uniform Resource Identifier), and any future references to this resource should be done using one of the returned URIs.";
	gHttpStat["302"] = "The requested resource resides temporarily under a different URI (Uniform Resource Identifier).";
	gHttpStat["303"] = "The response to the request can be found under a different URI (Uniform Resource Identifier) and should be retrieved using a GET HTTP verb on that resource.";
	gHttpStat["304"] = "The requested resource has not been modified.";
	gHttpStat["305"] = "The requested resource must be accessed through the proxy given by the location field.";
	gHttpStat["307"] = "The redirected request keeps the same HTTP verb. HTTP/1.1 behavior.";
	gHttpStat["400"] = "The request could not be processed by the server due to invalid syntax.";
	gHttpStat["401"] = "The requested resource requires user authentication.";
	gHttpStat["402"] = "Not currently implemented in the HTTP protocol.";
	gHttpStat["403"] = "The server understood the request, but is refusing to fulfill it.";
	gHttpStat["404"] = "The server has not found anything matching the requested URI (Uniform Resource Identifier).";
	gHttpStat["405"] = "The HTTP verb used is not allowed.";
	gHttpStat["406"] = "No responses acceptable to the client were found.";
	gHttpStat["407"] = "Proxy authentication required.";
	gHttpStat["408"] = "The server timed out waiting for the request.";
	gHttpStat["409"] = "The request could not be completed due to a conflict with the current state of the resource. The user should resubmit with more information.";
	gHttpStat["410"] = "The requested resource is no longer available at the server, and no forwarding address is known.";
	gHttpStat["411"] = "The server refuses to accept the request without a defined content length.";
	gHttpStat["412"] = "The precondition given in one or more of the request header fields evaluated to false when it was tested on the server.";
	gHttpStat["413"] = "The server is refusing to process a request because the request entity is larger than the server is willing or able to process.";
	gHttpStat["414"] = "The server is refusing to service the request because the request URI (Uniform Resource Identifier) is longer than the server is willing to interpret.";
	gHttpStat["415"] = "The server is refusing to service the request because the entity of the request is in a format not supported by the requested resource for the requested method.";
	gHttpStat["449"] = "The request should be retried after doing the appropriate action.";
	gHttpStat["500"] = "The server encountered an unexpected condition that prevented it from fulfilling the request.";
	gHttpStat["501"] = "The server does not support the functionality required to fulfill the request.";
	gHttpStat["502"] = "The server, while acting as a gateway or proxy, received an invalid response from the upstream server it accessed in attempting to fulfill the request.";
	gHttpStat["503"] = "The service is temporarily overloaded.";
	gHttpStat["504"] = "The request was timed out waiting for a gateway.";
	gHttpStat["505"] = "The server does not support, or refuses to support, the HTTP protocol version that was used in the request message.";

