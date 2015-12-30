/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/objects/DrillWrapper.js,v 1.21.2.4.2.3 2014/02/18 16:42:33 brentd Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@10.00.05.00.12 Mon Mar 31 10:17:31 Central Daylight Time 2014 */
//***************************************************************
//*                                                             *
//*                           NOTICE                            *
//*                                                             *
//*   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
//*   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
//*   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
//*   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
//*   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
//*   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
//*   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
//*                                                             *
//*   (c) COPYRIGHT 2014 INFOR.  ALL RIGHTS RESERVED.           *
//*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//*                                                             *
//***************************************************************
//
//	DEPENDENCIES:
//		common.js
//		/sso/sso.js		(only when used with 9.0.0 Technology)
//-----------------------------------------------------------------------------
//
//	PARAMETERS:
//		mainWnd			location of the common.js file
//		user			reference to a UserManager object
//		webappjsDir		location of the webappjs code (relative path)
//-----------------------------------------------------------------------------
//
//	OTHER REQUIREMENTS:
//		* each input box with a drill must declare a "keyNbr" attribute with the key number
//		* each select button must have a "for" attribute that points to the input box
//		* the following phrases must be declared in your language file...
//			- Previous
//			- Next
//			- Back
//			- Search
//			- FindValue
//			- Close
//			- NoRecordsMeetingCriteria
//-----------------------------------------------------------------------------
function DrillWrapperObject(mainWnd, user, webappjsDir)
{
	// only allow one instance per file load
	if (DrillWrapperObject._singleton)
		return DrillWrapperObject._singleton;
	else
		DrillWrapperObject._singleton = this;

	this.mainWnd = mainWnd || window;
	this.user = user;
	this.webappjsDir = webappjsDir;
	this.drillWnd = null;

	this.primaryKey = null;
	this.wndDoc = null;
	this.system = "";
	this.drillType = "";
	this.maxDrillLines = 25;
	this.selectSearchBehaviorFlds = null;

	// used to pass in extra parameters/values for the call
	this.drillParmsAry = null;
}
//-- static variables ---------------------------------------------------------
DrillWrapperObject._singleton = null;
DrillWrapperObject.KEY_ATTRIBUTE_NAME = "keyNbr";
DrillWrapperObject.TYPE_SELECT = "SL";
DrillWrapperObject.TYPE_DRILL = "OS";
//-- static methods -----------------------------------------------------------
DrillWrapperObject.getDetailKey = function(key)
{
	if (!key)
		return "";
	var charPos = key.indexOf("$");
	return (charPos >= 0) ? key.substring(0, charPos) : key;
}
//-----------------------------------------------------------------------------
DrillWrapperObject.getDetailNbr = function(key)
{
	if (!key)
		return -1;
	var charPos = key.indexOf("$");
	return (charPos >= 0) ? key.substring(charPos+1) : charPos;
}
//-- member methods -----------------------------------------------------------
DrillWrapperObject.prototype.openSelect = function(drillBtn, system, drillParmsAry)
{
	var inputBoxId = drillBtn.getAttribute("for");
	if (!inputBoxId)
		return;

	this.wndDoc = drillBtn.ownerDocument;
	if (!this.wndDoc)
		return;

	var inputFld = this.wndDoc.getElementById(inputBoxId);
	if (!inputFld)
		return;

	this.primaryKey = this.getObjAttribute(inputFld, DrillWrapperObject.KEY_ATTRIBUTE_NAME);
	if (!this.primaryKey)
		return;

	if (system)
		this.system = system;
		
	if (drillParmsAry)
		this.drillParmsAry = drillParmsAry;
		
	this.drillType = DrillWrapperObject.TYPE_SELECT;
	this.openCommon();
}
//-----------------------------------------------------------------------------
DrillWrapperObject.prototype.openDrill = function(file, index, drillKeysAry, drillParmsAry)
{
	if (!file || !index)
		return;

	this.primaryKey = null;
	this.wndDoc = null;
	this.drillParmsAry = new Array();

	if (drillParmsAry)
		this.drillParmsAry = drillParmsAry;

	this.drillParmsAry["_FN"] = file;
	this.drillParmsAry["_IN"] = index;

	// drillKeysAry is for the keys
	if (drillKeysAry)
		for (var i=0; i<drillKeysAry.length; i++)
			this.drillParmsAry["K"+(i+1)] = drillKeysAry[i];
	
	this.drillType = DrillWrapperObject.TYPE_DRILL;
	this.openCommon();
}
//-----------------------------------------------------------------------------
DrillWrapperObject.prototype.openCommon = function()
{
	// prepare to open window
	var modWidth = 950;
	var modHeight = 550;
	var modLeft = parseInt((screen.width / 2) - (modWidth / 2), 10);
	var modTop = parseInt((screen.height / 2) - (modHeight / 2), 10);
	this.drillWnd = window.open(this.webappjsDir + "html/drill.htm",
							"drillWnd",
							"left=" + modLeft + ",top=" + modTop + "," +
							"width=" + modWidth + ",height=" + modHeight + ",resizable,modal");
	this.drillWnd.focus();
}
//-----------------------------------------------------------------------------
DrillWrapperObject.prototype.closeDrillWindow = function()
{
	if (this.drillWnd && !this.drillWnd.closed)
	{
		this.drillWnd.close();
		this.drillWnd = null;
	}
	this.primaryKey = null;
	this.system = null;
	this.drillParmsAry = null;
}
//-----------------------------------------------------------------------------
DrillWrapperObject.prototype.getObjAttribute = function(obj, attrName)
{
	var attrValue = obj.getAttribute(attrName);
	if (!attrValue)
	{
		// do this for firefox :)
		attrValue = eval("obj." + attrName);
		if (!attrValue)
			return null;
	}
	return attrValue;
}
//-----------------------------------------------------------------------------
DrillWrapperObject.prototype.addKeysFromScreen = function(drillObj)
{
	if (!drillObj || !this.primaryKey || !this.wndDoc)
		return;

	var formsLen = this.wndDoc.forms.length;
	for (var b=0; b<formsLen; b++)
	{
		var formObj = this.wndDoc.forms[b];
		for (var c=0; c<formObj.elements.length; c++)
		{
			var elmObj = formObj.elements[c];
			var fldKey = this.getObjAttribute(elmObj, DrillWrapperObject.KEY_ATTRIBUTE_NAME);
			var keyDetailNbr = DrillWrapperObject.getDetailNbr(this.primaryKey);
			var fldDetailNbr = DrillWrapperObject.getDetailNbr(fldKey);

			if (keyDetailNbr == -1				// you didn't click on a detail
			 || fldDetailNbr == -1				// OR...	the current element is not on a detail
			 || keyDetailNbr == fldDetailNbr)	// OR...	this means they are on the same detail line
			{
				if (fldKey != null && elmObj.value)
				{
					var name = (keyDetailNbr == -1) ? fldKey :  DrillWrapperObject.getDetailKey(fldKey);
					if (name == "D5")
						drillObj.setParameter(name, encodeURIComponent(elmObj.value));
					else
						drillObj.setParameter(name, elmObj.value);
				}
			}
		}
	}
}
//-----------------------------------------------------------------------------
DrillWrapperObject.prototype.finishSelect = function(selAry)
{
	if (!selAry || !this.primaryKey)
		return;

	// loop through the forms/elements one time and check each one for a match with the keynbr
	var detailNbr = DrillWrapperObject.getDetailNbr(this.primaryKey);
	var formsLen = this.wndDoc.forms.length;
	for (var b=0; b<formsLen; b++)
	{
		var formObj = this.wndDoc.forms[b];
		for (var c=0; c<formObj.elements.length; c++)
		{
			var elmObj = formObj.elements[c];
			var fldKey = this.getObjAttribute(elmObj, DrillWrapperObject.KEY_ATTRIBUTE_NAME);

			// the key (without the detail nbr) exists in the return array
			// AND
			// it's on the same detail line (if the key has a detail line)
			if (typeof(selAry[DrillWrapperObject.getDetailKey(fldKey)]) != "undefined"
			 && DrillWrapperObject.getDetailNbr(fldKey) == detailNbr)
			{
				 
				 if (typeof(window["kNbr"+fldKey]) != "undefined")
				 {
				 
				// If the field is numeric pad with leading zeros.
					if (eval("kNbr"+ fldKey +".elementType") == "N")
					 {
						elmObj.value = replaceString(selAry[DrillWrapperObject.getDetailKey(fldKey)], " ", "0");
					 }
					else
					 {
						elmObj.value = selAry[DrillWrapperObject.getDetailKey(fldKey)];
					 }
				 }
				 else
				{
					elmObj.value = selAry[DrillWrapperObject.getDetailKey(fldKey)];
				}
				elmObj.focus();
				if (elmObj.onchange)
					elmObj.onchange();
			}
		}
	}

	this.closeDrillWindow();
	this.primaryKey = null;
	this.system = null;
	this.drillParmsAry = null;
}
//-- end drill wrapper object code
//-----------------------------------------------------------------------------

