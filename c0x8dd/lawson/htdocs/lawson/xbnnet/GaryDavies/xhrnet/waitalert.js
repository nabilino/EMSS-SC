// Version: 8-)@(#)@(201111) 09.00.01.06.00
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/waitalert.js,v 1.10.2.3 2008/03/31 22:13:23 brentd Exp $
// Description: This function displays a processing message in a header frame.
// Arguments:   A short message to display in the window. 
function showWaitAlert(msg,frameObj)
{	
	var wnd = (frameObj) ? frameObj : window;
	var docObj = wnd.document;	
	removeWaitAlert(wnd);

	if (wnd.styler && wnd.styler.showLDS)
	{
    		if (wnd.activityDialog == null && typeof(wnd["ActivityDialogObject"]) == "function")
    		{
    			wnd.activityDialog = new ActivityDialogObject(wnd);
    		}
    		
    		if (wnd.activityDialog)
    		{
    			wnd.activityDialog.showDialog(msg);
    		}
    	}
    	else
    	{
    		try {    	
    			var cssDocs = docObj.getElementsByTagName("LINK");
    			var foundCss = false;
    			for (var i=0; i<cssDocs.length; i++) {
    				if (cssDocs[i].href == "/lawson/xhrnet/ui/ui.css") {
    					foundCss = true;
    					cssDocs[i].disabled = false;
    					break;
    				}
    			}
    			if (foundCss == false) {
    				var cssElm = docObj.createElement("LINK");
    				cssElm.rel = "stylesheet";
    				cssElm.type = "text/css";
    				cssElm.href = "/lawson/xhrnet/ui/ui.css";
    				docObj.body.appendChild(cssElm);
    			}
    			if (docObj.getElementById("progressLayer")) {
    				var processingObj = docObj.getElementById("progressLayer");
    				var parentObj = processingObj.parentNode;
    				parentObj.removeChild(processingObj);
    			}
    			docObj.body.appendChild(processingLayer(msg));
        	}
        	catch(e) {}
        }	
}

// Description: This function removes the processing message from the display.
function removeWaitAlert(frameObj)
{
	var wnd = (frameObj) ? frameObj : window; 
	var docObj = wnd.document;
	
	if (wnd.styler && wnd.styler.showLDS)
	{
    		if (wnd.activityDialog)
    		{
    			wnd.activityDialog.hideDialog();		
		}
	}
	else
	{
		try {
			docObj.getElementById("progressMsg").style.visibility = "hidden";
			docObj.getElementById("progressBar").style.visibility = "hidden";
			docObj.getElementById("progressLayer").style.visibility = "hidden";
		}
		catch(e) {}
	}
}

function processingLayer(msg)
{
	/* used for setting innerHTML of document body
	var str = '<div id="progressLayer" style="background-color:#ffffff;position:absolute;height:30px;left:35%;top:5px;z-index:100">'
	+ '<table border="0" cellspacing="0" cellpadding="0">'
	+ '<tr>'
	+ '<td valign="top"><nobr><div id="progressMsg" class="progressmsg" style="padding-left:0px">'+msg+'</div></nobr>'
	+ '<div id="progressBar" class="progressbar" style="margin-left:0px;height:14px;overflow:hidden"></div></td>'
	+ '</tr>'
	+ '</table>'
	+ '</div>'
	return str;
	*/
	
	// main processing DIV tag
	var oProcess = document.createElement("DIV");
	oProcess.id = "progressLayer";
	oProcess.style.backgroundColor = "#ffffff";
	if (!document.all) {
		oProcess.style.paddingLeft = "3px";
		oProcess.style.paddingTop = "3px"
	}
	oProcess.style.position = "absolute";
	oProcess.style.height = "30px";
	try {
		if (window.innerWidth) {
			oProcess.style.left = parseInt(window.innerWidth*.35,10)+"px";
		}
		else if (document.body.clientWidth) {
			oProcess.style.left = parseInt(document.body.clientWidth*.35,10)+"px";
		}
		else {
			oProcess.style.left = "300px";
		}
	}
	catch(e) {
		oProcess.style.left = "300px";
	}	
	oProcess.style.top = "0px";
	oProcess.style.zIndex = "100";
	oProcess.style.visibility = "visible";

	// TABLE tag to house the processing message and image	
	var oTbl = document.createElement("TABLE");
	oTbl.setAttribute("border","0");
	oTbl.setAttribute("cellspacing","0");
	oTbl.setAttribute("cellpadding","0");
	
	var oRow = oTbl.insertRow(0);	
	var cell0 = oRow.insertCell(0);
	cell0.setAttribute("valign","top");

	// message DIV tag	
	var oTmp = document.createElement("NOBR");
	var oMsg = document.createElement("DIV");
	oMsg.id = "progressMsg";
	oMsg.className = "progressmsg";
	oMsg.style.paddingLeft = "0px";
	oMsg.style.visibility = "visible";

	var oChild = document.createTextNode(msg);
	oMsg.appendChild(oChild);
	oTmp.appendChild(oMsg);

	// barber pole image DIV tag 	
	var oBar = document.createElement("DIV");
	oBar.id = "progressBar";
	oBar.className = "progressbar";
	oBar.style.marginLeft = "0px";
	oBar.style.height = "14px";
	oBar.style.overflow = "hidden";
	oBar.style.visibility = "visible";
	
	cell0.appendChild(oTmp);
	cell0.appendChild(oBar);
	
	oProcess.appendChild(oTbl);
	
	return oProcess;
}
