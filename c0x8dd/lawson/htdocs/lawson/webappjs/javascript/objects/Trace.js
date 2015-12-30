/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/objects/Trace.js,v 1.10.2.3.2.2 2014/01/10 14:29:55 brentd Exp $ */
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
//		commonHTTP.js
//-----------------------------------------------------------------------------
//
//	PARAMETERS:
//		objName					the javascript variable name of your object instance
//								(must be "TRACE" for now until bug is fixed!)
//		mainWnd					(optional) reference to your products main window
//								(i.e. where your iframes exist)
//		webappjsDir				(optional) the location of the webappjs code 
//								(i.e. /lawson/webappjs/ is the default)
//-----------------------------------------------------------------------------
function TraceObject(objName, mainWnd, webappjsDir)
{
	this.name = objName;
	this.browser = new SEABrowser();
	this.isTraceOn = false;
	this.winHandle = null;
	this.traceLoadedMethod = null;		// method to call to keep page loading
	this.firstTraceMethod = null;		// generic method to call to trace something immediately
	this.mainWnd = (mainWnd) ? mainWnd : window;
	this.webappjsDir = (webappjsDir) ? webappjsDir : "/lawson/webappjs/";
	if (this.webappjsDir.substring(this.webappjsDir.length-1) != "/")
		this.webappjsDir += "/";
}
//-----------------------------------------------------------------------------
// methodsToTrace is an optional string parameter with method name separated by the | sign
TraceObject.prototype.configure = function(traceLoadedMethod, firstTraceMethod, methodsToTrace)
{
	if (firstTraceMethod)
		this.firstTraceMethod = firstTraceMethod;

	if (this.mainWnd.location.search.toLowerCase().indexOf("debug=true") != -1)
	{
		// set the traceLoadedMethod before starting trace
		if (traceLoadedMethod)
			this.traceLoadedMethod = traceLoadedMethod;
		this.toggle();
	}

	if (methodsToTrace)
	{
		var ary = methodsToTrace.split("|");
		for (var i=0; i<ary.length; i++)
			this.traceFunction(ary[i], this.mainWnd);
	}
}
//-----------------------------------------------------------------------------
TraceObject.prototype.setTraceReady = function()
{
	// called from trace.htm when it's loaded and ready...
	this.isTraceOn = true;
	this.traceCookies();
	if (this.firstTraceMethod)
		this.firstTraceMethod();
	if (this.traceLoadedMethod)
		this.traceLoadedMethod();

	this.traceLoadedMethod = null;
}
//-----------------------------------------------------------------------------
TraceObject.prototype.toggle = function()
{
	if (this.isTraceOn)
		this.stop();
	else
		this.start();
}
//-----------------------------------------------------------------------------
TraceObject.prototype.start = function()
{
	if (this.isTraceOn)
		return;

	this.winHandle = this.mainWnd.open(this.webappjsDir + "html/trace.htm?name=" + this.name,
								 "trace_" + new Date().getTime(),
								 "left=0,top=0,height=600,width=800,resizable=yes,scrollbars=yes");
	this.mainWnd.focus();
}
//-----------------------------------------------------------------------------
TraceObject.prototype.clear = function()
{
	this.winHandle.clearTrace();
}
//-----------------------------------------------------------------------------
TraceObject.prototype.printTraceWnd = function()
{
	this.winHandle.printTrace();
}
//-----------------------------------------------------------------------------
TraceObject.prototype.stop = function()
{
	this.isTraceOn = false;
	if (this.winHandle && !this.winHandle.closed)
		this.winHandle.close();
}	
//-----------------------------------------------------------------------------
TraceObject.prototype.getCurrentTimeString = function()
{
	var d = new Date();
	var s = d.getHours() + ":" +
			d.getMinutes() + ":" +
			d.getSeconds() + ":" +
			d.getMilliseconds();
	return s;
}
//-----------------------------------------------------------------------------
// this is called at random and from object methods
TraceObject.prototype.dump = function(msg, data, color)
{
	if (!this.isTraceOn)
		return;

	if (!msg && !data)
		return;

	msg = "MSG (" + this.getCurrentTimeString() + ") : " + ((!msg) ? "" : msg);
	data = (!data) ? null : data;
	color = (!color) ? "navy" : color;

	this.winHandle.traceIt(msg, data, color);
}
//-----------------------------------------------------------------------------
// this is called from almost every method
TraceObject.prototype.doTrace = function(msg)
{
	if (!this.isTraceOn)
		return;

	msg = (!msg) ? null : msg;

	var methodStr = "METHOD (" + this.getCurrentTimeString() + ") : ";
	var dataStr = "";

	// get the method name
	var callerStr = String(this.doTrace.caller);
	if (callerStr == "null")
		return;

	var traceItemMethod = callerStr.substring(callerStr.indexOf("function")+(this.browser.isIE?8:9), callerStr.indexOf("{"));
	// for methods from an object
	if (traceItemMethod.substring(0,1) == "(")
		traceItemMethod = "function";
	methodStr += traceItemMethod;

	// check/print parameters
	var tmpArgmtsLen = (this.doTrace.caller != null) ? this.doTrace.caller.arguments.length : 0;
	var tmpPassedLen = (this.doTrace.caller != null) ? this.doTrace.caller.length : 0;
	if (tmpArgmtsLen > 0 || tmpPassedLen > 0)
	{
		dataStr += "Parameters:";
		if (tmpArgmtsLen != tmpPassedLen)
			dataStr += "\n\tExpected - " + tmpPassedLen + "\n\tReceived - " + tmpArgmtsLen + "\n";
		for (var i=0; i<tmpArgmtsLen; i++)
			dataStr += "\n\tParam" + (i+1) + " - " + typeof(this.doTrace.caller.arguments[i]) + " - " + this.doTrace.caller.arguments[i];
	}

	if (msg)
	{
		if (dataStr)
			dataStr += "\n-----------------------------------------------------------------\n\n";
		dataStr += msg;
	}

	this.winHandle.traceIt(methodStr, dataStr);
}
//-----------------------------------------------------------------------------
TraceObject.prototype.traceFunction = function(functionName, scopeObject)
{
	scopeObject = (scopeObject) ? scopeObject : this.mainWnd;
	this.createFunctionWrapper(functionName, scopeObject, this.traceBefore, this.traceAfter);
}
//-----------------------------------------------------------------------------
TraceObject.prototype.createFunctionWrapper = function(functionName, scopeObject)
{
  	var wrappedFunction;
  	var functionReference = scopeObject[functionName];
	var traceObjName = this.name;

  	scopeObject[this.name + '.trace' + functionName] = functionReference;

  	wrappedFunction = function()
  	{
    	var returnValue;
		TRACE.traceBefore(functionName, arguments);
		returnValue = functionReference.apply(scopeObject, arguments);
		TRACE.traceAfter(functionName, returnValue);
		return returnValue;
  	};

  	if (typeof(functionReference.constructor) != "undefined")
    	wrappedFunction.constructor = functionReference.constuctor;

  	if (typeof(functionReference.prototype) != "undefined")
    	wrappedFunction.prototype = functionReference.prototype;

  	scopeObject[functionName] = wrappedFunction;
}
//-----------------------------------------------------------------------------
TraceObject.prototype.traceObject = function(contextname, classname)
{
  	var classref = eval(contextname + "." + classname);
  	var oP;
  	var sP;

  	if (!classref || !classref.prototype)
 		return;

  	for (oP in classref.prototype)
  	{
    	sP = oP + "";
		if (typeof(classref.prototype[sP]) == "function" && (sP).indexOf("lawTrace") == -1)
      		classref.prototype[sP] = this.createMethodWrapper(contextname, classname, sP, this.traceBefore, this.traceAfter);
  	}
}
//-----------------------------------------------------------------------------
TraceObject.prototype.createMethodWrapper = function(contextname, classname, methodname, precall, postcall)
{
  	var context = eval(contextname);
  	var methodref = context[classname].prototype[methodname];

  	context[classname].prototype[this.name + '.lawTrace' + methodname] = methodref;

  	var wrappedmethod = function () 
  	{
    	var returnValue;
		var thisref = eval("this");
		var argsref = arguments;

		precall(contextname + "." + classname, methodname, argsref);
		returnValue = methodref.apply(thisref, argsref);
		postcall(contextname + "." + classname, methodname, returnValue);
		return returnValue;
  	};

  	return wrappedmethod;
}
//-----------------------------------------------------------------------------
TraceObject.prototype.traceBefore = function(functionName, fArguments)
{
	if (!this.isTraceOn)
		return;

  	var argString = '';
  	for (var i=0; i<fArguments.length; i++)
  	{
    	argString += this.persistToString(fArguments[i]);
    	if (i < fArguments.length - 1)
  			argString += ', ';
  	}
  	this.winHandle.traceIt("ENTER (" + this.getCurrentTimeString() + ") : " + functionName  + "(" + fArguments[0] + " ...", "(" + argString + ")", "maroon");
}
//-----------------------------------------------------------------------------
TraceObject.prototype.persistToString = function(obj)
{
  	var s = "";
  	if (obj == null)
 		return "null";

  	switch (typeof(obj))
  	{
    	case "number":
   			return obj;
		case "string":
   			return "\"" + obj + "\"";
		case "undefined":
   			return "undefined";
		case "boolean":
   			return obj + "";
		case "object":
			try
			{
				if (obj.status)
				{
   					var txtDmp = "";
   					if (obj.responseText)
   						txtDmp = obj.responseText;
   					return "HTTP Error: " + obj.status + ":" + obj.statusText + "\n\n" + txtDmp;
   				}
				return (new SEAObjectFactory().formatXML(obj));
			}
			catch(e)
			{
				return "unknown object";
       		}
  	}
	return "unknown type";
}
//-----------------------------------------------------------------------------
TraceObject.prototype.traceAfter = function(functionName, returnValue)
{
	if (!this.isTraceOn)
		return;

	this.winHandle.traceIt("EXIT  (" + this.getCurrentTimeString() + ") : " + functionName, this.persistToString(returnValue), "maroon");
}
//-----------------------------------------------------------------------------
TraceObject.prototype.traceCookies = function()
{
	if (!this.isTraceOn)
		return;

	var cookies = this.mainWnd.document.cookie.split(";");
	var dataStr = "";
	for (var i=0; i<cookies.length; i++)
	{
		var cAry = cookies[i].split("=");
		if (cAry.length == 2)
			dataStr += cAry[0] + " = " + cAry[1] + "\n";
		else
		{
			dataStr += cAry[0] + " = ";
			for (var c=1; c<cAry.length; c++)
			{
				dataStr += cAry[c];
				if (c+1 < cAry.length)
					dataStr += ", ";
			}
			dataStr += "\n";
		}
	}
	this.dump("Browser Cookies", dataStr);
}
