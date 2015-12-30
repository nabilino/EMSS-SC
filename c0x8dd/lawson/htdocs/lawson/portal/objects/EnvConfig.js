/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/objects/Attic/EnvConfig.js,v 1.1.4.2 2013/09/11 04:41:07 jquito Exp $ */
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
//		*   (c) COPYRIGHT 2013 INFOR.  ALL RIGHTS RESERVED.           *
//		*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//		*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//		*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//		*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//		*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//		*                                                             *
//		*************************************************************** 
//-----------------------------------------------------------------------------

//Maps the SysEnv output xml to a portal object
// EnvConfig object constructor

function EnvConfig(wnd)
{
	this.wnd = wnd;

	this.storage = null;
	this.scriptName = "object/EnvConfig.js";
}

//-----------------------------------------------------------------------------
EnvConfig.prototype.getProperty = function(name)
{
	try 
	{
		if (!this.storage)
			return null;

		var settingNode = this.storage.getNodeByAttributeId("PROPERTY", "name", name);

		if (settingNode)
			return settingNode.getAttribute("value");

		return null;
	} 
	catch (e) 
	{ 
		return null;
	}
}

//-----------------------------------------------------------------------------
EnvConfig.prototype.makeRequest = function()
{
	try	
	{
		var envConfig = this.wnd.httpRequest("/servlet/SysEnv?_OUT=XML", null, "", "", false);
		if (this.wnd.oError.isErrorResponse(envConfig, true, true, false, "", this.wnd))
			return false;

		// load the XML in data storage object
		var ds = new this.wnd.DataStorage(envConfig, this.wnd);

		// validate the XML format
		var root = ds.getRootNode();
		if (!root || root.nodeName != "SYSENV")
			return false;

		this.storage = ds;
		return true;
	} 
	catch(e) 
	{ 
		this.wnd.oError.displayExceptionMessage(e, this.scriptName, "loadStorage");
		return false;
	}
}