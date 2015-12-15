/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/lawtrace.js,v 1.4.2.11.4.1.14.1.2.2 2012/08/08 12:37:20 jomeli Exp $ */
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
function lawTraceObj(href)
{
	this.on = false;
	this.traceWindow = null;
	this.stackDiv = null;
	this.stackCnt = 0;
	this.msgsAry = null;
	this.title="Trace - "+href.substr(0,href.indexOf("?"));
}
//-----------------------------------------------------------------------------
lawTraceObj.prototype.open=function()
{
	if (this.traceWindow && !this.traceWindow.closed)
		this.close();

	this.stackDiv = null;
	this.stackCnt = 0;
	this.msgsAry = null;
	this.traceWindow = window.open("lawtrace.htm", "",
			"left=0,top=0,height=480,width=640,resizable=yes,scrollbars=yes");
	window.focus();
}
//-----------------------------------------------------------------------------
lawTraceObj.prototype.close=function()
{
	if (!this.traceWindow)
		return;

	if (!this.traceWindow.closed)
		this.traceWindow.close();
}
//-----------------------------------------------------------------------------
lawTraceObj.prototype.getTitle=function()
{
	return this.title;
}
//-----------------------------------------------------------------------------
lawTraceObj.prototype.dump=function(msg,dataDmp)
{
  	if (!this.on)
		return;

  	if (!this.traceWindow || this.traceWindow.closed)
		this.open();

	if (!this.stackDiv) // stackDiv gets set from the trace window
	{
		if (this.msgsAry == null)
			this.msgsAry = new Array();
		var len = this.msgsAry.length;
		if (len == 25)  // 25 msgs queued without getting dumped... trace window didn't load
		{
			lawTrace.on = false;
			lawTrace.msgsAry = null;
			lawTrace.close();
			alert("Error Loading Trace Utility.");
		}
		else
			this.msgsAry[len] = (typeof(dataDmp) == "undefined") ? new Array(msg) : new Array(msg,dataDmp) ;
		return;
	}

	var dmpDiv=this.traceWindow.document.createElement("DIV");
	if (typeof(dataDmp) != "undefined")
	{
		dataDmp=dataDmp.toString()
		dmpDiv.style.cursor="default";
		dmpDiv.ondblclick=showData;
		var expandImg=this.traceWindow.document.createElement("IMG");
		expandImg.src="images/plus.gif";
		expandImg.style.margin="2px";
		expandImg.onclick=showData;
		expandImg.style.cursor="hand";
		dmpDiv.appendChild(expandImg);
		var nobr=this.traceWindow.document.createElement("NOBR");
		nobr.onselectstart=noTextSelect;
		nobr.appendChild(this.traceWindow.document.createTextNode(msg));
		dmpDiv.appendChild(nobr);
		var dataDiv=this.traceWindow.document.createElement("DIV");
		var dmp=this.traceWindow.document.createElement("PRE");
		var theText=dataDmp.replace(/\r\n|\n/g,"\r");
//		theText=theText.replace(/\n/g,"\r");
		dmp.appendChild(this.traceWindow.document.createTextNode(theText));
		dataDiv.style.border="1px solid black";
		dataDiv.style.margin="5px";
		dataDiv.style.display="none"
		dataDiv.appendChild(dmp);
		dmpDiv.appendChild(dataDiv);
	}
	else
	{
		var blankImg=this.traceWindow.document.createElement("IMG");
		blankImg.src="images/blank.gif";
		blankImg.style.margin="2px";
		dmpDiv.appendChild(blankImg);
		var nobr=this.traceWindow.document.createElement("NOBR");
		nobr.appendChild(this.traceWindow.document.createTextNode(msg));
		dmpDiv.appendChild(nobr);
	}	
	if (++this.stackCnt%2 == 0)
		dmpDiv.style.backgroundColor="lightgrey";
	else
		dmpDiv.style.backgroundColor="white";
		
	this.stackDiv.appendChild(dmpDiv);
	this.traceWindow.scrollBy(0,100000);	// scroll to the bottom
	return;
}
//-----------------------------------------------------------------------------
lawTraceObj.prototype.dumpWaitingMsgs=function()
{
  	if (!this.on || !this.traceWindow || this.traceWindow.closed || !this.stackDiv || this.msgsAry == null)
		return;

	for (var i=0; i<this.msgsAry.length; i++)
	{
		var tmpAry = this.msgsAry[i];
		if (tmpAry.length == 2)
			this.dump(tmpAry[0],tmpAry[1]);
		else
			this.dump(tmpAry[0]);
	}

	this.msgsAry = null;
}
//-----------------------------------------------------------------------------
var lawTrace = new lawTraceObj(window.location.href);
window.onunload = function () { lawTrace.close(); }
//-----------------------------------------------------------------------------
function noTextSelect(evt)
{
	return false;
}
//-----------------------------------------------------------------------------
function showData(evt)
{
	var elem;
    var imgElem;
    if (typeof(evt)!="undefined" && evt.target)
    {
        imgElem = (evt.target.nodeType == 3) ? evt.target.parentNode : evt.target;
    	elem=imgElem.parentNode;
    }
    else
    {
        imgElem = lawTrace.traceWindow.event.srcElement;
        elem=imgElem.parentElement;
    }
    
	if(elem.childNodes.length==3)
	{
		if(elem.childNodes[2].style.display=="none")
		{
			elem.childNodes[2].style.display="block";
			elem.childNodes[0].src="images/minus.gif"
		}
		else
		{
			elem.childNodes[2].style.display="none";
			elem.childNodes[0].src="images/plus.gif"
		}
	}
}
//-----------------------------------------------------------------------------
function getCurrentTimeString()
{
	var d = new Date();
	var s = d.getHours() + ":" +
			d.getMinutes() + ":" +
			d.getSeconds() + ":" +
			d.getMilliseconds();
	return s;
}
//-----------------------------------------------------------------------------
function lawTraceCreateFunctionWrapper(scopeName, functionName)
{
  	var wrappedFunction;
  	var scopeObject = eval(scopeName);
  	var functionReference = scopeObject[functionName];

  	scopeObject['lawTrace' + functionName] = functionReference;

  	wrappedFunction = function () 
  	{
    	var returnValue;

		lawTraceBefore(scopeName, functionName, arguments);
		returnValue=functionReference.apply(scopeObject,arguments);
		lawTraceAfter(scopeName, functionName, returnValue);
		return returnValue;
  	};

  	if (typeof(functionReference.constructor) != 'undefined')
    	wrappedFunction.constructor = functionReference.constuctor;

  	if (typeof(functionReference.prototype) != 'undefined')
    	wrappedFunction.prototype = functionReference.prototype;

  	scopeObject[functionName] = wrappedFunction;
}
//-----------------------------------------------------------------------------
function lawTraceCreateMethodWrapper(contextname, classname, methodname, precall, postcall)
{
  	var context = eval(contextname);
  	var methodref = context[classname].prototype[methodname];

  	context[classname].prototype['lawTrace' + methodname] = methodref;

  	var wrappedmethod = function () 
  	{
    	var returnValue;
		var thisref = eval('this');
		var argsref = arguments;

		precall(contextname + '.' + classname, methodname, argsref);
		returnValue=methodref.apply(thisref, argsref);
		postcall(contextname + '.' + classname, methodname, returnValue);
		return returnValue;
  	};

  	return wrappedmethod;
}
//-----------------------------------------------------------------------------
function lawTracePersistToString(obj)
{
  	var s = '';

  	if (obj == null)
 		return 'null';

  	switch(typeof(obj))
  	{
    	case 'number':
   			return obj;
		case 'string':
   			return '"' + obj + '"';
		case 'undefined':
   			return 'undefined';
		case 'boolean':
   			return obj + '';
		case "object":
   			try{
   				if(obj.status)
   				{
   					var txtDmp=""
   					if(obj.responseText)
   						txtDmp=obj.responseText
   					return "HTTP Error: "+ obj.status +":"+obj.statusText + "\n\n" + txtDmp
   				}
   				var sXML="";
   				if(obj.xml)
   					sXML=obj.xml
   				else
   				{
   					var ser=new XMLSerializer();
					sXML=ser.serializeToString(obj)
   				}
   				return sXML
   			}catch(e){
				return "unknown object";
       		}
  	}
  	return null;
}
//-----------------------------------------------------------------------------
function lawTraceBefore(scopeName, functionName, fArguments) 
{
  	var i;
  	var argString = '';
  	for (i = 0; i < fArguments.length; i++)
  	{
    	argString += lawTracePersistToString(fArguments[i]);
    	if (i < fArguments.length - 1)
  			argString += ', ';
  	}
  	lawTrace.dump('ENTER ('+ getCurrentTimeString() +") : "+ scopeName + '.' + functionName  + '(' + fArguments[0] + ' ...' , '(' + argString + ')');
}
//-----------------------------------------------------------------------------
function lawTraceAfter(scopeName, functionName, returnValue) 
{
  	lawTrace.dump('EXIT  ('+ getCurrentTimeString() +") : "+ scopeName + '.' + functionName , lawTracePersistToString(returnValue));
}
//-----------------------------------------------------------------------------
function lawTraceFunction(scopeName, functionName)
{
  	lawTraceCreateFunctionWrapper(scopeName, functionName, lawTraceBefore, lawTraceAfter);
}
//-----------------------------------------------------------------------------
function lawTraceObject(contextname, classname)
{
  	var classref = eval(contextname + '.' + classname);
  	var oP;
  	var sP;

  	if (!classref || !classref.prototype)
 		return;

  	for (oP in classref.prototype)
  	{
    	sP = oP + '';
		if (typeof(classref.prototype[sP]) == 'function' && (sP).indexOf('lawTrace') == -1)
      		classref.prototype[sP] = lawTraceCreateMethodWrapper(contextname, classname, sP, lawTraceBefore, lawTraceAfter);
  	}
}
