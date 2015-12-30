/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/objects/ProcessFlow.js,v 1.4.2.7.2.2 2014/01/10 14:29:55 brentd Exp $ */
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
//	PARAMETERS:
//		mainWnd			(optional) location of the window where the call should be made
//		techVersion		(optional) defaults to 9.0.0
//		httpRequest		(optional) reference to a request method (i.e. SSORequest, httpRequest, etc..)
//							if null, the call() method will always return null
//		funcAfterCall		(optional) function to run after the data call is executed
//-----------------------------------------------------------------------------
function ProcessFlowObject(mainWnd, techVersion, httpRequest, appName)
{
	this.mainWnd = mainWnd || window;
	this.httpRequest = httpRequest || this.mainWnd.SSORequest || null;
	this.techVersion = techVersion || ProcessFlowObject.TECHNOLOGY_900;
	this.showErrors = true;
	this.encoding = null;
	this.escapeFunc = this.mainWnd.cmnEscapeIt || this.mainWnd.escape;
	this.dom = null;

	// private fields (for ProcessFlowObject only!)
	this.workFlow = null;
	this.appName = appName || "SEA";
}
//-- static variables ---------------------------------------------------------
ProcessFlowObject.TECHNOLOGY_803 = "8.0.3";
ProcessFlowObject.TECHNOLOGY_900 = "9.0.0";
//-----------------------------------------------------------------------------
ProcessFlowObject.prototype.setFlow = function(name, eventType, system, dataArea, user, funcAfterCall, categoryValue)
{		
	var workFlow = new Workflow(name, eventType, system, dataArea, 
					user, funcAfterCall, categoryValue, 
					this.appName, this);
	
	if (workFlow)
	{
		workFlow.encoding = this.encoding;
		workFlow.escapeFunc = this.escapeFunc;
		this.workFlow = workFlow;
		return workFlow;
	}
	
	return null;
}
//-----------------------------------------------------------------------------
ProcessFlowObject.prototype.getFlow = function()
{
	if (!this.workFlow) 
		return null;

	return this.workFlow;
}
//-----------------------------------------------------------------------------
ProcessFlowObject.prototype.triggerFlow = function()
{
	if (!this.workFlow) 
		return null;

	return this.workFlow.trigger();
}
//-----------------------------------------------------------------------------
ProcessFlowObject.prototype.setEncoding = function(encoding)
{
	this.encoding = encoding || null;
	if (this.encoding != null && typeof(this.mainWnd["escapeForCharset"]) != "undefined")
		this.escapeFunc = this.mainWnd.escapeForCharset;
}
//-- static variables ---------------------------------------------------------
Workflow.SERVICE_EVENT_TYPE = "ServiceAsync";
Workflow.PROCESS_EVENT_TYPE = "ProcessAsync";
Workflow.ERP_SYSTEM = "ERP";
//-----------------------------------------------------------------------------
function Workflow(name, eventType, system, dataArea, user, funcAfterCall, categoryValue, appName, baseClass)
{
	if (typeof(name) != "string"
	|| typeof(dataArea) != "string"
	|| typeof(user) != "string")
		return null;

	this.name = name;
	this.eventType = eventType || Workflow.SERVICE_EVENT_TYPE;
	this.system = system || Workflow.ERP_SYSTEM;
	this.dataArea = dataArea;
	this.user = user;
	this.categoryValue = categoryValue || "";
	this.appName = appName || "SEA";
	this.funcAfterCall = funcAfterCall;
	this.baseClass = baseClass || null;
	this.dom = null;

	this.businessCriterias = new Array();
	this.variables = new Array();
	this.folders = new Array();

	return this;
}
Workflow.prototype.trigger = function()
{
	var httpRequest = (this.baseClass && this.baseClass.httpRequest) 
				? this.baseClass.httpRequest
				: (this.baseClass && this.baseClass.mainWnd && this.baseClass.mainWnd.SSORequest)
					? this.baseClass.mainWnd.SSORequest
					: (window.SSORequest)
						? window.SSORequest
						: null;

	if (!httpRequest)
	{
		alert("ERROR: Failed to trigger flow " + this.name + ". Could not find httpRequest method - ProcessFlow.js");			
		if (this.funcAfterCall)
			this.funcAfterCall();		
		return null;
	}

	if (typeof(TransactionObject) == "function")
	{
		var timeStamp = new Date().getTime();
		var workTitle = this.appName + "_" + this.name + "_" + this.user + "_" + timeStamp;
		var tranObj = new TransactionObject(window, this.techVersion, httpRequest, this.funcAfterCall);
		tranObj.setEncoding(this.encoding);
		tranObj.setParameter("_PDL", this.dataArea);
		tranObj.setParameter("_TKN", "WFWK.1");
		tranObj.setParameter("FC", "A");
		tranObj.setParameter("_LFN", "TRUE");
		tranObj.setParameter("_EVT", "ADD");
		tranObj.setParameter("_RTN", "DATA");
		tranObj.setParameter("_TDS", "Ignore");
		tranObj.setParameter("PRODUCT-LINE", this.dataArea);
		tranObj.setParameter("EVENT-TYPE", this.eventType);
		tranObj.setParameter("SERVICE", this.name);
		tranObj.setParameter("WORK-TITLE", workTitle);
		tranObj.setParameter("WORK-CATEGORY", this.categoryValue);
	
		var len = this.businessCriterias.length;
		for (var i = 0; (i < len && i < 3); i++)
		{
			tranObj.setParameter("CRITERION-" + (i+1), this.businessCriterias[i].runtimeValue);
		}		
		
		len = this.variables.length;
		for (var i = 0; (i < len && i < 15); i++)
		{
			tranObj.setParameter("VARIABLE-NAMEr" + i, this.variables[i].name);
			tranObj.setParameter("VARIABLE-VALUEr" + i, this.variables[i].runtimeValue);
		}		
		
		var len = this.folders.length;
		for (var i = 0; (i < len && i < 4); i++)
		{
			tranObj.setParameter("DOCUMENT-ID" + (i+1), this.folders[i].name);
			tranObj.setParameter("FORM-KEYS" + (i+1) + "1", this.folders[i].keyString);
		}		
		
		var tranDom = tranObj.callTransaction();
		if (tranDom != null)
		{
			var retCode = tranObj.getValue("RETURN-CODE");
			if (retCode == "" || Number(retCode) == 0)
				return tranDom;
			else
				return null; 
		}			
	}
	else
	{
		if (this.funcAfterCall)
			this.funcAfterCall();	
	}
	
	return null;
}
//-----------------------------------------------------------------------------
Workflow.prototype.addCriterion = function(name, value)
{
	if (typeof(name) != "string"
	|| typeof(value) != "string")
		return false;

	var oCriteria = new Object();
	oCriteria.name = name;
	oCriteria.value = value;
	oCriteria.runtimeValue = value;

	this.businessCriterias[this.businessCriterias.length] = oCriteria;

	return true;
}
//-----------------------------------------------------------------------------
Workflow.prototype.addVariable = function(name, value)
{
	if (typeof(name) != "string"
	|| typeof(value) != "string")
		return false;

	var oVariable = new Object();
	oVariable.name = name;
	oVariable.value = value;
	oVariable.runtimeValue = value;

	this.variables[this.variables.length] = oVariable;

	return true;
}
//-----------------------------------------------------------------------------
Workflow.prototype.addFolder = function(name, type, keyString)
{
	if (typeof(name) != "string"
	|| typeof(type) != "string"
	|| typeof(keyString) != "string")
		return false;

	var oFolder = new Object();
	oFolder.name = name;
	oFolder.type = type;
	oFolder.keyString = keyString;

	this.folders[this.folders.length] = oFolder;

	return true;
}