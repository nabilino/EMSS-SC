//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
var gProtocol = location.protocol
var gHost     = location.host

function callEMAIL(string, frameStr, doPost)
{
	if (doPost)
	{
		eval("window." + frameStr + ".document.write(\'" + string + "\')")
		eval("window." + frameStr + ".document.close()")
	}
	else
	    eval("window." + frameStr + ".location.replace(\"" + string + "\")")
}

function EMAILObject(whoto,whofrom)
{
	this.protocol = gProtocol;
	this.hostname = gHost;
 	this.progName = "/cgi-lawson/email";

	if (typeof(CGIExt) != null && typeof(CGIExt) != 'undefined')
		this.progName += CGIExt
	else
		if (opener != null)
			if (typeof(opener.CGIExt) != null && typeof(opener.CGIExt) != 'undefined')
				this.progName += opener.CGIExt
				
	this.whoto    = whoto;
	this.whofrom  = whofrom;
	this.subject  = null;
	this.message  = null;
	this.EMAILBuild = EMAILBuild;
	this.doPost = false;
}

// PT 117693
var targetConversionFrame = "";
function convert()
{
	var subject = eval("self."+targetConversionFrame+".document.getElementById('subject')")
	subject.value = unescape(subject.value)
	var message = eval("self."+targetConversionFrame+".document.getElementById('message')")
	message.value = unescape(message.value)
	targetConversionFrame = ""
}

function EMAILBuild(frameStr)
{
	var object   = this;
	var urlStr   = object.protocol + "//" + object.hostname + object.progName + "?"
	var urlSep   = "&";
	var parmsStr = "";
	var postForm = "";
	
	if(object.message.length > 650)
		object.doPost = true;

	// Check for a Microsoft Web Server (NT)
	if (typeof(authUser) != "undefined" && typeof(authUser) != null && typeof(authUser.serverSoftware) != "undefined" && authUser.serverSoftware.substr(0,9).toUpperCase() == "MICROSOFT")
	{
		object.doPost = false;
	    	urlStr = 'mailto:'
	        parmStr  = object.whoto
	        parmStr += '?' + 'sender=' + object.whofrom
	        parmStr += urlSep + 'subject=' + escape(object.subject)
	        parmStr += urlSep + 'body=' + escape(object.message)
		        
	        urlStr += parmStr
	        return urlStr
	}
	else
	{
	  	if(object.doPost)
	  	{
			// PT 117693
  			targetConversionFrame = frameStr
	  		//postForm = '<BODY onLoad="javascript:document.emailform.submit();return false">'
 	  		postForm = '<BODY onLoad="parent.convert();document.emailform.submit();return false">'
                		 + '<FORM ACTION=' + urlStr + ' TARGET=' + frameStr + ' METHOD=POST name=emailform>'
				 // PT 117693
	 			 //+ '<INPUT NAME=whoto TYPE=hidden VALUE=' + escape(object.whoto) + '>'
				 //+ '<INPUT NAME=whofrom TYPE=hidden VALUE=' + escape(object.whofrom) + '>'
	 			 + '<INPUT NAME=whoto TYPE=hidden VALUE=' + object.whoto + '>'
				 + '<INPUT NAME=whofrom TYPE=hidden VALUE=' + object.whofrom + '>'
				 // PT 117693
				 //+ '<INPUT NAME=subject TYPE=hidden VALUE=' + escape(object.subject) + '>'
				 //+ '<INPUT NAME=body TYPE=hidden VALUE='+escape(object.message)+'>'
				 + '<INPUT id=subject NAME=subject TYPE=hidden VALUE=' + escape(object.subject) + '>'
				 + '<textarea id=message NAME=body>'+escape(object.message)+'</textarea>'
				 + '<INPUT TYPE=SUBMIT NAME="callEMAIL" VALUE="Do EMAIL Calls">'
                		 + '</FORM>'
                		 + '</BODY>'
                	
			urlStr = postForm;
	    		return urlStr;
		}
		else
		{
			parmsStr += escape(object.whoto)
	    		parmsStr += urlSep + escape(object.whofrom)
				// PT 117693
	    		//parmsStr += urlSep + "%22" + escape(object.subject) + "%22"
	    		//parmsStr += urlSep + "%22" + escape(object.message) + "%22"
	    		parmsStr += urlSep + escape(object.subject) 
	    		parmsStr += urlSep + escape(object.message) 

	    		urlStr += parmsStr;
	    		return urlStr;
	    	}
	}
}

function EMAIL(object, frameStr)
{
	callEMAIL(object.EMAILBuild(frameStr), frameStr, object.doPost);
}
