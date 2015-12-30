/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/inbasket/pfdetail.js,v 1.5.4.2.4.7.6.1.2.2 2012/08/08 12:37:26 jomeli Exp $ */
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

var strType = ""

//-----------------------------------------------------------------------------
function pfdtlOnLoad()
{
	// is page loaded in inbasket.htm container?
	if (top == self || typeof(parent.pfInbasket) == "undefined")
		return;

	// load the script versions
	envLoadWindowScriptVersions(parent.portalWnd.oVersions,window,parent.portalWnd);

	strType = document.location.search.substr(1)
	pfdtlDisplayList()
}

//-----------------------------------------------------------------------------
function pfdtlDisplayList()
{
	switch (strType)
	{
		case "FOLDER":
			pfdtlDisplayFolders();
			break;
		case "MESSAGE":
			pfdtlDisplayMessages();
			break;
		case "HISTORY":
			pfdtlDisplayHistory();
			break;
	}
}

//-----------------------------------------------------------------------------
function pfdtlDisplayFolders()
{
	var mainDiv = document.getElementById("divPfDtl")
	var oTable = document.createElement("TABLE")
	mainDiv.appendChild(oTable)
	oTable.id = "folders"
	oTable.align = "center"
	var oThead = oTable.createTHead();

	var oRow, oCol;
	oRow = oThead.insertRow(0)
	oCol = oRow.insertCell(0)
	oCol.align = "center"
	oCol.appendChild(createSpan(parent.pfMsgs.getPhrase("lblName"), true))

	oCol = oRow.insertCell(1)
	oCol.align = "center"
	oCol.appendChild(createSpan(parent.pfMsgs.getPhrase("lblType"), true))

	oCol = oRow.insertCell(2)
	oCol.align = "center"
	oCol.appendChild(createSpan(parent.pfMsgs.getPhrase("lblAttach"), true))

	oCol = oRow.insertCell(3)
	oCol.align = "center"
	oCol.appendChild(createSpan(parent.pfMsgs.getPhrase("lblDate"), true))

	oRow = oThead.insertRow(1)
	oCell = oRow.insertCell(0)
	oCell.colSpan = 4
	var oHr = document.createElement("HR")
	oHr.size = "0"
	oHr.noShade = true
	oCell.appendChild(oHr)

	var oTbody = document.createElement("TBODY")
	oTable.appendChild(oTbody)
	var folders = parent.pfInbasket.curWorkObjDetail.getElementsByTagName("FOLDER")
						
	var strDateTime = ""
	var child=null
	var temp;
	for (var i=0; i < folders.length; i++)
	{
		
		var errMsg = folders[i].getElementsByTagName("FOLDERERROR");
		if(errMsg && errMsg.length > 0)	
			errMsg = "" + errMsg[0].firstChild.nodeValue;
		else
			errMsg="";
	
		if (errMsg != "") 
		{ 
			errMsg="&_FOLDERERROR=" + errMsg; 
		}
		oRow = oTbody.insertRow(i)
		oCol = oRow.insertCell(0)
		child = createSpan(folders[i].getAttribute("filename"), false, i)
		temp = folders[i].getElementsByTagName("FOLDERURL")
		child.url = temp[0].firstChild.nodeValue+errMsg
		child.onclick = pfdtlOpenFolder
		oCol.appendChild(child)

		oCol = oRow.insertCell(1)
		oCol.appendChild(createSpan(folders[i].getAttribute("type"), false))

		oCol = oRow.insertCell(2)
		oCol.appendChild(createSpan(folders[i].getAttribute("attachby"), false))
		strDateTime = folders[i].getAttribute("date") + 
				" " + folders[i].getAttribute("time")
		oCol = oRow.insertCell(3)
		oCol.appendChild(createSpan(strDateTime, false))
	}

	oRow = oTbody.insertRow(i++)
	oCell = oRow.insertCell(0)
	oCell.colSpan = 4
	var oHr = document.createElement("HR")
	oHr.size = "0"
	oHr.noShade = true
	oCell.appendChild(oHr)

	oRow = oTbody.insertRow(i++)
	oCell = oRow.insertCell(0)
	oCell.colSpan = 4
	oCell.align = "center"
	var btn = document.createElement("INPUT")
	btn.type = "button"
	btn.className="button"
	btn.value = parent.pfMsgs.getPhrase("lblAddFold")
	btn.onclick = pfdtlAddFolder
	oCell.appendChild(btn)

	try{
		oThead.focus();	
	}catch(e){}	
}

//-----------------------------------------------------------------------------
function pfdtlDisplayMessages()
{
	var mainDiv = document.getElementById("divPfDtl")
	var oTable = document.createElement("TABLE")
	mainDiv.appendChild(oTable)
	oTable.id = "messages"
	oTable.align = "center"
	var oThead = oTable.createTHead();

	var oRow, oCol;
	oRow = oThead.insertRow(0)
	oCol = oRow.insertCell(0)
	oCol.align = "center"
	oCol.appendChild(createSpan(parent.pfMsgs.getPhrase("lblMessages"), true))

	oCol = oRow.insertCell(1)
	oCol.align = "center"
	oCol.appendChild(createSpan(parent.pfMsgs.getPhrase("lblAttach"), true))

	oCol = oRow.insertCell(2)
	oCol.align = "center"
	oCol.appendChild(createSpan(parent.pfMsgs.getPhrase("lblDate"), true))

	oRow = oThead.insertRow(1)
	oCell = oRow.insertCell(0)
	oCell.colSpan = 3
	var oHr = document.createElement("HR")
	oHr.size = "0"
	oHr.noShade = true
	oCell.appendChild(oHr)

	var oTbody = document.createElement("TBODY")
	oTable.appendChild(oTbody)
	var message = parent.pfInbasket.curWorkObjDetail.getElementsByTagName("MESSAGE")
	var strDateTime = ""
	var child=null
	for (var i=0; i < message.length; i++)
	{
		oRow = oTbody.insertRow(i)
		oCol = oRow.insertCell(0)
		child = createSpan(message[i].getAttribute("id"), false, i)
		child.msgid = message[i].getAttribute("id")
		child.onclick = pfdtlOpenMessage
		oCol.appendChild(child)

		oCol = oRow.insertCell(1)
		oCol.appendChild(createSpan(message[i].getAttribute("attachby"), false))

		strDateTime = message[i].getAttribute("attachdate") + 
				" " + message[i].getAttribute("attachtime")
		oCol = oRow.insertCell(2)
		oCol.appendChild(createSpan(strDateTime, false))
	}

	oRow = oTbody.insertRow(i++)
	oCell = oRow.insertCell(0)
	oCell.colSpan = 3
	var oHr = document.createElement("HR")
	oHr.size = "0"
	oHr.noShade = true
	oCell.appendChild(oHr)

	oRow = oTbody.insertRow(i++)
	oCell = oRow.insertCell(0)
	oCell.colSpan = 3
	oCell.align = "center"
	var btn = document.createElement("INPUT")
	btn.type = "button"
	btn.className="button"
	btn.value = parent.pfMsgs.getPhrase("lbladdMessage")
	btn.onclick = pfdtlAddMessage
	oCell.appendChild(btn)
	
	try{
		oThead.focus();	
	}catch(e){}	
}

//-----------------------------------------------------------------------------
function pfdtlDisplayHistory()
{
	var mainDiv = document.getElementById("divPfDtl")
	var oTable = document.createElement("TABLE")
	mainDiv.appendChild(oTable)
	oTable.id = "history"
	oTable.align = "center"
	var oThead = oTable.createTHead();

	var oRow, oCol;
	oRow = oThead.insertRow(0)
	oCol = oRow.insertCell(0)
	oCol.align = "center"
	oCol.appendChild(createSpan(parent.pfMsgs.getPhrase("lblTask"), true));

	oCol = oRow.insertCell(1)
	oCol.align = "center"
	oCol.appendChild(createSpan(parent.pfMsgs.getPhrase("lblDate"), true))

	oCol = oRow.insertCell(2)
	oCol.align = "center"
	oCol.appendChild(createSpan(parent.pfMsgs.getPhrase("lblUser"), true));

	oCol = oRow.insertCell(3)
	oCol.align = "center"
	oCol.appendChild(createSpan(parent.pfMsgs.getPhrase("lblActivity"), true));

	oCol = oRow.insertCell(4)
	oCol.align = "center"
	oCol.appendChild(createSpan(parent.pfMsgs.getPhrase("lblOperation"), true));

	oRow = oThead.insertRow(1)
	oCell = oRow.insertCell(0)
	oCell.colSpan = 6
	var oHr = document.createElement("HR")
	oHr.size = "0"
	oHr.noShade = true
	oCell.appendChild(oHr)

	var oTbody = document.createElement("TBODY")
	oTable.appendChild(oTbody)
	var message = parent.pfInbasket.curWorkObjDetail.getElementsByTagName("WORKITEM")
	var strDateTime = ""
	for (var i=0; i < message.length; i++)
	{
		
		oRow = oTbody.insertRow(i)
		oCol = oRow.insertCell(0)
		oCol.appendChild(createSpan(message[i].getAttribute("task"), false))		
		
		strDateTime = message[i].getAttribute("date") +
				" " + message[i].getAttribute("time")
		oCol = oRow.insertCell(1)
		oCol.appendChild(createSpan(strDateTime, false))

		oCol = oRow.insertCell(2)
		oCol.appendChild(createSpan(message[i].getAttribute("user"), false))

		oCol = oRow.insertCell(3)
		oCol.appendChild(createSpan(message[i].getAttribute("activityId"), false))

		oCol = oRow.insertCell(4)
		oCol.appendChild(createSpan(message[i].getAttribute("actionTaken"), false))
	}

	oRow = oTbody.insertRow(i++)
	oCell = oRow.insertCell(0)
	oCell.colSpan = 6
	var oHr = document.createElement("HR")
	oHr.size = "0"
	oHr.noShade = true
	oCell.appendChild(oHr)
	
	try{
		oThead.focus();	
	}catch(e){}	
}

//-----------------------------------------------------------------------------
function createSpan(colText, bBold, anchor)
{
	var oSpan = document.createElement("SPAN");
	oSpan.className = "cellText";
	oSpan.style.fontWeight = (bBold ? "bold" : "normal");
	if (typeof(anchor) != "undefined")
	{
		oSpan.style.textDecoration = "underline";
		oSpan.style.cursor = (parent.portalObj.browser.isIE ? "hand" : "pointer");
		oSpan.index = anchor;
	}
	oSpan.appendChild(document.createTextNode(colText));
	return oSpan;
}

//-----------------------------------------------------------------------------
function pfdtlOpenFolder(e)
{
	var oSpan = e ? e.currentTarget : window.event.srcElement;
	pfdtlSwitchVisibility(true)
	var objFrame = document.getElementById("frmPfDtl")
	var keyerr = top.getVarFromString("_FOLDERERROR", oSpan.url); 
	if(keyerr != '')
	{ 
	   alert("Warning! " + keyerr + "\nFolder being launched with invalid keystring") 
	   oSpan.url = oSpan.url.replace("&_FOLDERERROR="+keyerr,"") 
	} 

	objFrame.src = oSpan.url
}

//-----------------------------------------------------------------------------
function pfdtlOpenMessage(e)
{
	pfdtlSwitchVisibility(false)
	document.getElementById("lblMsg").style.visibility = "visible"
	document.getElementById("txtMsg").style.visibility = "visible"
	document.getElementById("lblName").style.visibility = "visible" 
	document.getElementById("txtName").style.visibility = "visible" 
	document.getElementById("btnAdd").style.visibility = "hidden"
	document.getElementById("btnUpdate").style.visibility = "visible" 
	document.getElementById("btnDelete").style.visibility = "visible" 

	var oSpan = e ? e.currentTarget : window.event.srcElement
	var messageNd = parent.pfInbasket.curWorkObjDetail.getElementsByTagName("MESSAGE")[oSpan.index]
	var msgId = messageNd.getAttribute("id")
	document.getElementById("txtName").value = msgId
	var temp = messageNd.getElementsByTagName("MESSAGECONTENT")[0]
	var message = temp.firstChild.nodeValue
	document.getElementById("txtMsg").value = message
}

//-----------------------------------------------------------------------------
function pfdtlAddFolder()
{
	var eName = document.getElementById("txtName");
	eName.value=""
	var lblUrl = document.getElementById("lblUrl");
	var eURL = document.getElementById("txtUrl");
	eURL.value=""
	var btnAdd = document.getElementById("btnAdd");
 	var btnUpdate = document.getElementById("btnUpdate"); 
    var btnDelete = document.getElementById("btnDelete"); 


	eName.style.visibility = "visible";	
	lblUrl.style.visibility = "visible";
	eURL.style.visibility = "visible";
	btnAdd.style.visibility = "visible";
	btnUpdate.style.visibility = "hidden"; 
	btnDelete.style.visibility = "hidden"; 

	pfdtlSwitchVisibility(false);
	eName.select();
}
//-----------------------------------------------------------------------------
function pfdtlAddMessage()
{
	var eName = document.getElementById("txtName");
	eName.value = ""
	var lblMsg = document.getElementById("lblMsg");
	var eMsg = document.getElementById("txtMsg");
	eMsg.value = ""
	var btnAdd = document.getElementById("btnAdd");
	var btnUpdate = document.getElementById("btnUpdate"); 
	var btnDelete = document.getElementById("btnDelete"); 


	eName.style.visibility = "visible";
	lblMsg.style.visibility = "visible";
	eMsg.style.visibility = "visible";
	btnAdd.style.visibility = "visible";
	btnUpdate.style.visibility = "hidden"; 
	btnDelete.style.visibility = "hidden"; 
	pfdtlSwitchVisibility(false);
	eName.select();
}
function pfdtlUpdateMessage() 
{ 
   pfdtlUpdDelMessage("C"); 
} 
    
function pfdtlDeleteMessage() 
{ 
	if (confirm(parent.pfMsgs.getPhrase("lblConfirmDelete")))    
		pfdtlUpdDelMessage("D"); 
} 


//-----------------------------------------------------------------------------
function pfdtlAdd()
{
	parent.portalObj.setMessage("")
	var bSuccess = false;
	var rtn = null
	switch(strType)
	{
		case "FOLDER":
			var eName = document.getElementById("txtName");
			var lblUrl = document.getElementById("lblUrl");
			var eURL = document.getElementById("txtUrl");
			var btnAdd = document.getElementById("btnAdd");	
		
			var name = eName.value;
			var folder = eURL.value;
			
			if (name == "")
			{
				parent.portalObj.setMessage(parent.pfMsgs.getPhrase("errMsg4"))
				eName.focus()
				return;
			}
			
			if (name.length > 30)
			{
				parent.portalObj.setMessage(parent.pfMsgs.getPhrase("errMsg9"))
				eName.focus()
				return;
			}
			
			if (folder == "")
			{
				parent.portalObj.setMessage(parent.pfMsgs.getPhrase("errMsg5"))
				eURL.focus()
				return
			}
			
			var addURL = parent.pfInbasket.curWorkObjDetail.getElementsByTagName("FOLDERADDURL") 
			
			if (addURL && addURL.length > 0)
			{
				addURL = addURL[0].firstChild.nodeValue
				addURL = addURL.replace("&FLDNAME=", "&FLDNAME="+name)
				addURL = addURL.replace("&FLDURL=", "&FLDURL="+folder)
				addURL=addURL +"&_NOCACHE=" + (new Date().getTime())
				rtn = parent.portalWnd.httpRequest(addURL)
				if(rtn.status)
				{
					//parent.portalObj.setMessage(parent.pfMsgs.getPhrase("errMsg8"))
					parent.portalObj.setMessage(parent.pfMsgs.getPhrase("errMsg8") + ".  " 
                                            + parent.pfMsgs.getPhrase("lblErrorMessage") + ": " + rtn.message); 

					btnAdd.focus();
					return
				}
				else
				{
					parent.pfInbasket.curWorkObjDetail = rtn;
					var errMsg = rtn.getElementsByTagName("FOLDERERRORMSG");
					if(errMsg && errMsg.length > 0)	
					    errMsg = "" + errMsg[0].firstChild.nodeValue;
					else
					    errMsg="";
	
					if (errMsg != "") 
					{ 
					   if (errMsg.indexOf("Duplicate") >= 0) 
							   errMsg = parent.pfMsgs.getPhrase("lblFldrAlreadyExists"); 
					   errMsg = parent.pfMsgs.getPhrase("errMsg8") + ".  " 
						+ parent.pfMsgs.getPhrase("lblErrorMessage") + ": " + errMsg; 
					   parent.portalObj.setMessage(errMsg);  
					   btnAdd.focus(); 
					   return; 
					} 
					else 
					{ 
					   //alert(pfMsgs.getPhrase("lblAddSuccessful")); 
					   parent.portalObj.setMessage(parent.pfMsgs.getPhrase("lblAddSuccessful")); 
					   parent.pfInbasket.curWorkObjDetail = rtn; 
                                                        
					} 
			
				}
				eName.style.visibility = "hidden";
				lblUrl.style.visibility = "hidden";
				eURL.style.visibility = "hidden";
				btnAdd.style.visibility = "hidden";
			}
			break;

		case "MESSAGE":
			var eName = document.getElementById("txtName");
			var lblMsg = document.getElementById("lblMsg");
			var eMsg = document.getElementById("txtMsg");
			var btnAdd = document.getElementById("btnAdd");
			
			var name = eName.value;
			var msg = eMsg.value;
			
			if (name == "")
			{
				parent.portalObj.setMessage(parent.pfMsgs.getPhrase("errMsg4"))
				eName.focus()
				return
			}
			
			if (name.length > 10)
			{
				parent.portalObj.setMessage(parent.pfMsgs.getPhrase("errMsg10"))
				eName.focus()
				return
			}
			
			if (msg == "")
			{
				parent.portalObj.setMessage(parent.pfMsgs.getPhrase("errMsg6"))
				eMsg.focus()
				return;
			}
 		

			
			var msgURL = parent.pfInbasket.curWorkObjDetail.getElementsByTagName("MESSAGEADDURL") 
			
			if (msgURL && msgURL.length > 0)
			{
				msgURL = msgURL[0].firstChild.nodeValue
				msgURL = msgURL.replace("&MSGID=", "&MSGID="+escape(name))
				msgURL = msgURL.replace("&MSGCONTENT=", "&MSGCONTENT="+escape(msg))
				var pkg = msgURL.substring("/bpm/inbasket?".length,msgURL.length)

				var rtn = parent.portalWnd.httpRequest("/bpm/inbasket",pkg,"application/x-www-form-urlencoded","text/xml")
				if (rtn.status)
				{
					 parent.portalObj.setMessage(parent.pfMsgs.getPhrase("errMsg7") + ".  " 
                                            + parent.pfMsgs.getPhrase("lblErrorMessage") + ": " + rtn.message); 
                     btnAdd.focus(); 
                     return; 

				}
				else
				{
					parent.pfInbasket.curWorkObjDetail = rtn; 
                    var errMsg = rtn.getElementsByTagName("MESSAGEERRORMSG"); 
                        
                    if(errMsg && errMsg.length > 0) 
                      errMsg = "" + errMsg[0].firstChild.nodeValue; 
                    else 
                      errMsg = ""; 
                             
                       if (errMsg != "") 
                       { 
                               if (errMsg.indexOf("Duplicate") >= 0) 
                                       errMsg = parent.pfMsgs.getPhrase("lblMsgAlreadyExists"); 
                               errMsg = parent.pfMsgs.getPhrase("errMsg7") + ".  " 
                                + parent.pfMsgs.getPhrase("lblErrorMessage") + ": " + errMsg; 
                               alert(errMsg);
                               btnAdd.focus(); 
                               return; 
                       } 
                       else 
                       { 
                               parent.portalObj.setMessage(parent.pfMsgs.getPhrase("lblAddSuccessful")); 
                               parent.pfInbasket.curWorkObjDetail = rtn;                                                      
                       } 
						
				}
				eName.style.visibility = "hidden";
				lblMsg.style.visibility = "hidden";
				lblName.style.visibility = "hidden";
				eMsg.style.visibility = "hidden";
				btnAdd.style.visibility = "hidden";
				
			}
			break;
	}
	// Update details
	var mainDiv = document.getElementById("divPfDtl")
	mainDiv.removeChild(mainDiv.firstChild)
	pfdtlDisplayList()
	document.getElementById("divPfDtl2").style.visibility = "hidden"
}
function pfdtlUpdDelMessage(action)
{
        var eName = document.getElementById("txtName");
        var lblMsg = document.getElementById("lblMsg");
        var eMsg = document.getElementById("txtMsg");
        var btnAdd = document.getElementById("btnAdd");
        var btnUpdate = document.getElementById("btnUpdate");
        var btnDelete = document.getElementById("btnDelete");

        eName.style.visibility = "visible";
        lblMsg.style.visibility = "visible";
        eMsg.style.visibility = "visible";
        btnAdd.style.visibility = "hidden";
        btnUpdate.style.visibility = "visible";
        btnDelete.style.visibility = "visible";
        pfdtlSwitchVisibility(false);
        eName.select();
        
        parent.portalObj.setMessage("")
        var bSuccess = false;
        var rtn = null
        
        var name = eName.value;
        var msg = eMsg.value;
        
        if(name == "")
        {
                parent.portalObj.setMessage(parent.pfMsgs.getPhrase("errMsg4"));
                eName.focus();
                return;
        }

		if (name.length > 10)
		{
			parent.portalObj.setMessage(parent.pfMsgs.getPhrase("errMsg10"))
			eName.focus();
			return;
		}
        
        if(msg == "")
        {
                parent.portalObj.setMessage(parent.pfMsgs.getPhrase("errMsg6"));
                eMsg.focus();
                return;
        }
        
        var msgURL = parent.pfInbasket.curWorkObjDetail.getElementsByTagName("MESSAGEADDURL")
        
        if(msgURL && msgURL.length > 0)
        {
                msgURL = msgURL[0].firstChild.nodeValue
                msgURL = msgURL.replace("&UPDTACTION=A", "&UPDTACTION="+action)
                msgURL = msgURL.replace("&MSGID=", "&MSGID="+escape(name))
                msgURL = msgURL.replace("&MSGCONTENT=", "&MSGCONTENT="+escape(msg))
                //document.body.style.cursor = "wait";
				//alert(msgURL);
				var pkg = msgURL.substring("/bpm/inbasket?".length,msgURL.length)
				var rtn = parent.portalWnd.httpRequest("/bpm/inbasket",pkg,"application/x-www-form-urlencoded","text/xml")
                var msgType = "";
                if (action == "D")
                        msgType = parent.pfMsgs.getPhrase("errMsg12");
                else
                        msgType =  parent.pfMsgs.getPhrase("errMsg11");

                if(rtn.status)
                {
                        document.body.style.cursor = "default";
                        parent.portalObj.setMessage(msgType + ".  "
                         + parent.pfMsgs.getPhrase("lblErrorMessage") + ": " + rtn.message);
                        btnUpdate.focus();
                        return;
                }
                else
                {
                        parent.pfInbasket.curWorkObjDetail = rtn;
                        var errMsg = rtn.getElementsByTagName("MESSAGEERRORMSG");
                        
                        if(errMsg && errMsg.length > 0)
                                errMsg = "" + errMsg[0].firstChild.nodeValue;
                        else
                                errMsg ="";
                                
                        document.body.style.cursor = "default";
                        if (errMsg != "")
                        {
                                if (errMsg.indexOf("not found") >= 0)
                                        errMsg = parent.pfMsgs.getPhrase("lblRecordNotFound");
                                errMsg = msgType + ".  "
                                 + parent.pfMsgs.getPhrase("lblErrorMessage") + ": " + errMsg;
                                parent.portalObj.setMessage(errMsg);
                                btnUpdate.focus();
                                return;
                        }
                        else
                        {
                                parent.pfInbasket.curWorkObjDetail = rtn;
                                if (action == "D")
                                {
                                        //alert(pfMsgs.getPhrase("lblDeleteSuccessful"));
                                        parent.portalObj.setMessage(parent.pfMsgs.getPhrase("lblDeleteSuccessful"));
                                        eName.value = "";
                                        eName.style.visibility = "hidden";
                                        lblName.style.visibility = "hidden";
                                        lblMsg.style.visibility = "hidden";
                                        eMsg.value = "";
                                        eMsg.style.visibility = "hidden";
                                        btnUpdate.style.visibility = "hidden";
                                        btnDelete.style.visibility = "hidden";
                                }
                                else
                                {
                                        parent.portalObj.setMessage(parent.pfMsgs.getPhrase("lblUpdatedSuccessful"));
                                        //alert(pfMsgs.getPhrase("lblUpdatedSuccessful"));
                                }
                        }
                }
        }
		eName.style.visibility = "hidden";
		lblMsg.style.visibility = "hidden";
		eMsg.style.visibility = "hidden";
		lblName.style.visibility = "hidden";
		btnAdd.style.visibility = "hidden";
		btnUpdate.style.visibility = "hidden";
        btnDelete.style.visibility = "hidden"; 
 
        var mainDiv = document.getElementById("divPfDtl");
        mainDiv.removeChild(mainDiv.firstChild);
        pfdtlDisplayList();
        document.getElementById("divPfDtl2").style.visibility = "hidden";
}



//-----------------------------------------------------------------------------
function pfdtlSwitchVisibility(bFrame)
{
	var objFrame = document.getElementById("frmPfDtl")
	var objDiv = document.getElementById("divPfDtl2")
	if (bFrame)
	{
		objDiv.style.visibility = "hidden"
		objFrame.style.visibility = "visible"
	}
	else
	{
		objFrame.style.visibility = "hidden"
		objDiv.style.visibility = "visible"
	}
}

function initializeFramework()
{
	//Portal hook to allow the content to rebuild the portal framework
	parent.buildPortalFramework();
}

function handleKeyDown(evt)
{
	parent.handleKeyDown(evt);
}