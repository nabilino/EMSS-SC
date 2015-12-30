/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/forms/about.js,v 1.37.2.10.4.13.6.1.2.3 2012/08/08 12:37:26 jomeli Exp $NoKeywords: $ */
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
var bNormalClose=false;

var textloc
var oNavlet=null
var agsWnd = null;
var lastView=""
var dashStr="---------------------------------------------------------------\n"

//-----------------------------------------------------------------------------
function aboutInit()
{
	portalWnd=parent.portalWnd;
	portalObj=parent.portalObj;
	with (portalObj.toolbar)
	{
		target=window
		clear()
		createButton(portalObj.getPhrase("LBL_CLOSE"), aboutClose, "close");
		createButton(portalObj.getPhrase("LBL_DETACH"), aboutOnClickDetach, "btnDetach");
		createButton(portalObj.getPhrase("LBL_DO_QUERY"), aboutTranCall, "btnShowTran");
		changeButtonState("btnShowTran", aboutSetTranButton(false));
	}

	lastView="FormHTML";
   	if (portalObj.xsltSupport)
		lastView="FormXML"
	else
	{
		var btn=document.getElementById("FormXML");
		btn.style.display="none";
		btn=document.getElementById("XSLScript");
		btn.style.display="none";
		btn=document.getElementById("CustomScript");
		btn.style.display="none";
	}

	// display stuff
	aboutOnResize()
	switchView(lastView)
	if (portalWnd.oPortalConfig.isPortalLessMode())
	{
		try { 
			portalWnd.sizePortalStuff();
			aboutOnResize();
		} catch (e) { }
	}
}

//-----------------------------------------------------------------------------
function aboutOnBeforeUnload()
{
	// this will catch the use of browser 'back' whether from
	// mouse or keyboard and do the close action
	if (!bNormalClose)
		aboutClose();
}

//-----------------------------------------------------------------------------
function aboutUnload()
{
	portalWnd.formUnload()
	try {
		parent.xslInitFramework();
		parent.lawForm.positionInField(parent.lastControl.id);
	} catch (e) { }
}

//-----------------------------------------------------------------------------
function aboutClose()
{
	bNormalClose=true;
	portalObj.setTitle(parent.strTitle)
	parent.bPushedForm=false;

	var obj=parent.document.getElementById("utilDiv");
	obj.style.display="none";
	obj=parent.document.getElementById("utilFrame");
	obj.src=portalObj.path+"/blank.htm";
	obj=parent.document.getElementById("utilContainer");
	obj.style.display="none";
	parent.formState.setValue("formReady",true)
}

//-----------------------------------------------------------------------------
function aboutOnClickDetach()
{
	// change button text and call detach/maximize on parent
	if(parent.utilWindowState.currentState!="MAXIMIZED")
	{
		portalObj.toolbar.changeButtonText("btnDetach",portalObj.getPhrase("LBL_DETACH"));
		parent.lawformMaximizeUtilityWindow();
	}
	else
	{
		portalObj.toolbar.changeButtonText("btnDetach",portalObj.getPhrase("LBL_MAXIMIZE"));
		parent.lawformDetachUtilityWindow();
	}
}

//-----------------------------------------------------------------------------
function aboutTranCall()
{
	var root = parent.tranMagic.storage.getRootNode();
	if (root.hasChildNodes())
	{
		var call = "";
		var tNodes = root.firstChild;
		var len = tNodes.childNodes.length;

		// build name/value pairs
		for (var x=0; x<len; x++)
		{
			var node = tNodes.childNodes[x];
			if (node.nodeName.indexOf("_") == 0)
			{
				call += (x > 0) ? "&" : "";
				call += node.nodeName + "=";
				if (node.childNodes.length > 0) 
					call += escape(node.firstChild.nodeValue);
			}
		}

		call = "http://" + window.location.host + portalWnd.AGSPath + "?" + call;
		if (call.length > 2000)
		{
			var msg = portalObj.getPhrase("LBL_GREATER_2000") 
					+ " [" + call.length + "]";
			portalWnd.cmnDlg.messageBox(msg, "ok", "stop");
			return;
		}

		var parms = "left=0,top=0,height=480,width=600,location,menubar,"
	  		+ "resizable,scrollbars,status,titlebar,toolbar";
	  	agsWnd = window.open(call, "_blank", parms);
	}
}

//-----------------------------------------------------------------------------
function aboutSetTranButton(bEnabled)
{
	if (portalObj.browser.isIE)
		return (bEnabled) ? "SHOW" : "HIDE";
	else
		return (bEnabled) ? "ENABLED" : "DISABLED";
}

//-----------------------------------------------------------------------------
function aboutFormat(str)
{
	var strNew=str.replace( /(\<[^!\?])/g ,"\n$1")
	return (strNew);
}

//-----------------------------------------------------------------------------
function formatXML(str)
{
	var strNew=str.replace(/\>\<(?!\/)/gi,">\n<")
	return (strNew);
}

//-----------------------------------------------------------------------------
function formatFormXML(xml)
{
	var str=formatXML(xml);
	var str=str.replace(/<\/form>/,"\n</form>");
	str=str.replace(/<\/PATH>/,"\n</PATH>");
	str=str.replace(/<\/transfers>/,"\n</transfers>");
	str=str.replace(/<\/toolbar>/,"\n</toolbar>");
	str=str.replace(/><\/detail>/gi,">\n</detail>");
	str=str.replace(/><\/tab>/gi,">\n</tab>");
	str=str.replace(/><\/tabregion>/gi,">\n</tabregion>");
	str=str.replace(/<\/vals><\/fld>/gi,"</vals>\n</fld>");
	var dom=portalWnd.objFactory.createInstance("DOM");
	dom.async=false;
	dom.loadXML(str);
	return (dom.xml);
}

//-----------------------------------------------------------------------------
// secure tab info
function filterAGS(formXML,agsXML)
{
	// loop on form nodes
	var docClone=agsXML.cloneNode(true)
	if (formXML)
	{
		var arrTabs=formXML.getElementsByTagName("tab")
		var lenTabs=(arrTabs ? arrTabs.length : 0);
		for (var i=lenTabs-1; i >= 0; i--)
		{
			// det fields in prot tabs
			var tabProt=arrTabs[i].getAttribute("tabprot")
			if (tabProt=="1")
			{
				var arrFlds=arrTabs[i].getElementsByTagName("fld")
				var lenFlds=(arrFlds ? arrFlds.length : 0)
				for (var j=0; j < lenFlds; j++)
				{
					// del ags fields
					var nbr=arrFlds[j].getAttribute("nbr")
					if (nbr)
					{
						var agsFlds=docClone.getElementsByTagName(nbr)
						if (agsFlds.length)
							agsFlds[0].parentNode.removeChild(agsFlds[0])
					}
				}
			}
		}
	}
	// return ags
	var str=docClone.xml.replace(/\>\</gi,">\n<");
	str=str.replace(/(\<_f\d+\>)\s+(\<\/_f)/gi, "$1$2");
	var dom=portalWnd.objFactory.createInstance("DOM");
	dom.async=false;
	dom.loadXML(str);

	return dom.xml;
}

//-----------------------------------------------------------------------------
function aboutKeysCollection()
{
	var keys
	var keyProp
	var aboutText="keyNbr\tfldNbr\tnm\t\ted\tdecsz\tdetail\toccur\tsuperKey\tnoKeyImp priority\tdefine\tbMoving\taltref\tvalue\n"
	aboutText+=dashStr.substr(0,dashStr.length-2)+"------------------"+dashStr;
	for (var i=0; i < parent.keyColl.lawKeys.length; i++)
	{
		key=parent.keyColl.lawKeys[i]
		for (keyProp in key)
			aboutText+="'"+key[keyProp]+"'\t"
		aboutText+="\n"
	}

	document.getElementById("textWindow").value=aboutText
}
//-----------------------------------------------------------------------------
function aboutKeysData()
{
	var aboutText="Transfered key data\n"
	aboutText+=dashStr;
	var len=parent.keyColl.tranKeys.length;
	for (var i=0; i < len; i++)
	{
		var dataStr=parent.keyColl.tranKeys[i]
		aboutText+=dataStr;
		aboutText+="\n";
	}

	document.getElementById("textWindow").value=aboutText
}

//-----------------------------------------------------------------------------
function aboutRequiredCollection()
{
	var aboutText="fld\tkeynbr\treq\tnextreq\tkey\tsize\tedit\tdet\n"
	aboutText+=dashStr
 	if (parent.reqColl)
	{
	 	for (var i = 0; i < parent.reqColl.reqFlds.length; i++)
	 	{
			aboutText+=parent.reqColl.reqFlds[i].fld+"\t"
			aboutText+=("'"+parent.reqColl.reqFlds[i].keynbr+"'\t")
			aboutText+=parent.reqColl.reqFlds[i].req+"\t"
			aboutText+=parent.reqColl.reqFlds[i].nextreq+"\t"
			aboutText+=parent.reqColl.reqFlds[i].key+"\t"
			aboutText+=parent.reqColl.reqFlds[i].size+"\t"
			aboutText+=parent.reqColl.reqFlds[i].edit+"\t"
			aboutText+=parent.reqColl.reqFlds[i].det+"\n"
		}
	}
	document.getElementById("textWindow").value=aboutText
}

//-----------------------------------------------------------------------------
function aboutListCollection()
{
	var aboutText="fld\tpos\tkeynbr\tdeftkn\ttp\tlabel\n"
	aboutText+=dashStr
 	if (parent.listColl)
	{
	 	for (var i = 0; i < parent.listColl.reqFlds.length; i++)
	 	{
			aboutText+=parent.listColl.reqFlds[i].fld+"\t"
			aboutText+=parent.listColl.reqFlds[i].pos+"\t"
			aboutText+=("'"+parent.listColl.reqFlds[i].keynbr+"'\t")
			aboutText+=(parent.listColl.reqFlds[i].deftkn ? parent.listColl.reqFlds[i].deftkn+"\t": " \t")
			aboutText+=parent.listColl.reqFlds[i].tp+"\t"
			aboutText+=parent.listColl.reqFlds[i].label+"\n"
		}
	}
	document.getElementById("textWindow").value=aboutText
}

//-----------------------------------------------------------------------------
function aboutDefaultsCollection()
{
	var aboutText="fld\tdefval\tpar\tisxlt\tdet\n"
	aboutText+=dashStr
 	if (parent.defColl)
	{
	 	for (var i = 0; i < parent.defColl.defFlds.length; i++)
	 	{
			aboutText+=parent.defColl.defFlds[i].fld+"\t"
			aboutText+=parent.defColl.defFlds[i].defval+"\t"
			aboutText+=parent.defColl.defFlds[i].par+"\t"
			aboutText+=parent.defColl.defFlds[i].isxlt+"\t"			
			aboutText+=(parent.defColl.defFlds[i].det ? parent.defColl.defFlds[i].det : "")
			aboutText+="\n"
		}
	}
	document.getElementById("textWindow").value=aboutText
}

//-----------------------------------------------------------------------------
function aboutIdsCollection()
{
	var aboutText="fld\tid\n"
	aboutText+=dashStr
 	if (parent.idColl)
	{
	 	for (var i = 0; i < parent.idColl.ids.length; i++)
	 	{
			aboutText+=parent.idColl.ids[i].fld+"\t"
			aboutText+=parent.idColl.ids[i].id+"\n"
		}
	}
	document.getElementById("textWindow").value=aboutText
}

//-----------------------------------------------------------------------------
function aboutNamesCollection()
{
	var aboutText="fld\tnm\t\t\tfldbtn\tpar\tdet\ttp\toc\n"
	   aboutText+="-------------"+dashStr
 	if (parent.namColl)
	{
	 	for (var i = 0; i < parent.namColl.names.length; i++)
	 	{
			aboutText+=parent.namColl.names[i].fld+"\t"
			aboutText+=parent.namColl.names[i].nm+"\t"
			if (parent.namColl.names[i].nm.length < 19)
				aboutText+="\t"
			if (parent.namColl.names[i].nm.length < 10)
				aboutText+="\t"
			aboutText+=parent.namColl.names[i].fldbtn+"\t"
			aboutText+=parent.namColl.names[i].par+"\t"
			aboutText+=parent.namColl.names[i].det+"\t"
			aboutText+=parent.namColl.names[i].type+"\t"
			aboutText+=parent.namColl.names[i].oc+"\n"
		}
	}
	document.getElementById("textWindow").value=aboutText
}

//-----------------------------------------------------------------------------
function aboutPushesCollection()
{
	var aboutText="fld\tid\n"
	aboutText+=dashStr
 	if (parent.pushColl)
	{
	 	for (var i = 0; i < parent.pushColl.ids.length; i++)
	 	{
			aboutText+=parent.pushColl.ids[i].fld+"\t"
			aboutText+=parent.pushColl.ids[i].id+"\n"
		}
	}
	document.getElementById("textWindow").value=aboutText
}
function aboutWorkflowCollection()
{
	var aboutText="service\tsystem\tsubsystem\t\tcategoryValue\ttrigger\n"
	aboutText+=dashStr
 	if (parent.workflows)
	{
	 	for (var i = 0; i < parent.workflows.length; i++)
	 	{
			aboutText+=parent.workflows.children(i).service+"\t"
			aboutText+=parent.workflows.children(i).system+"\t"
			aboutText+=parent.workflows.children(i).subSystem+"\t"
			aboutText+=parent.workflows.children(i).categoryValue+"\t"
			aboutText+=parent.workflows.children(i).trigger
			aboutText+="\n"
		}
	}
	document.getElementById("textWindow").value=aboutText
}

//-----------------------------------------------------------------------------
function showFormObjects()
{
	var obj=parent.formState
	var aboutText="FormState object:\n"
	aboutText+=dashStr
	aboutText+="doDefine\t\t"+obj.doDefine+"\n"
	aboutText+="doPush\t\t"+obj.doPush+"\n"
	aboutText+="doTransfer\t"+obj.doTransfer+"\n"
	aboutText+="formReady\t\t"+obj.formReady+"\n"
	aboutText+="token\t\t"+obj.token+"\n"
	aboutText+="pushFromRow\t"+obj.pushFromRow+"\n"
	aboutText+="currentRow\t"+obj.currentRow+"\n"
	aboutText+="currentField\t"+obj.currentField+"\n"
	aboutText+="currentDetailArea "+obj.currentDetailArea+"\n"
	aboutText+="currentTabPage\t"+obj.currentTabPage+"\n"
	aboutText+="selectDetailRow\t"+obj.selectDetailRow+"\n"
	aboutText+="autoComplete\t"+obj.autoComplete+"\n"
	aboutText+="autoCompleteFC\t"+obj.autoCompleteFC+"\n"
	aboutText+="agsError\t\t"+obj.agsError+"\n"
	aboutText+="agsMsgNbr\t\t"+obj.agsMsgNbr+"\n"
	aboutText+="agsFldNbr\t\t"+obj.agsFldNbr+"\n"
	
	aboutText+="\nCRTIO object:\n"
	aboutText+=dashStr
	obj=parent.formState.crtio
	aboutText+="customId\t\t"+obj.customId+"\n"
	aboutText+="Request\t\t"+obj.Request+"\n"
	aboutText+="Screen\t\t"+obj.Screen+"\n"
	aboutText+="PassXlt\t\t"+obj.PassXlt+"\n"
	aboutText+="DspXlt\t\t"+obj.DspXlt+"\n"
	aboutText+="Message\t\t"+obj.Message+"\n"
	
	obj=parent.lawForm.magic
	aboutText+="\nMagic object:\n"
	aboutText+=dashStr
	aboutText+="initialized\t"+obj.initialized+"\n"
	aboutText+="isFlowchart\t"+obj.isFlowchart+"\n"
	aboutText+="FYEO\t\t"+obj.FYEO+"\n"
	aboutText+="visitedPushScr\t"+obj.visitedPushScr+"\n"
	aboutText+="FC\t\t"+obj.FC+"\n"
	aboutText+="evtType\t\t"+obj.evtType+"\n"
	aboutText+="rtnType\t\t"+obj.rtnType+"\n"

	document.getElementById("textWindow").value=aboutText
}

//-----------------------------------------------------------------------------
function showFormVars()
{
	var aboutText="Form XSL variables:\n"
	aboutText+=dashStr
	aboutText+="strTitle\t\t"+parent.strTitle+"\n"
	aboutText+="strPDL\t\t"+parent.strPDL+"\n"
	aboutText+="strTKN\t\t"+parent.strTKN+"\n"
	aboutText+="strSYS\t\t"+parent.strSYS+"\n"
	aboutText+="strFORMID\t\t"+parent.strFORMID+"\n"
	aboutText+="strMode\t\t"+parent.strMode+"\n"
	aboutText+="strHost\t\t"+parent.strHost+"\n"
	aboutText+="strAGSPath\t"+parent.strAGSPath+"\n"
	aboutText+="strIDAPath\t"+parent.strIDAPath+"\n"
	aboutText+="strHKValue\t"+parent.strHKValue+"\n"
	aboutText+="strHKFldNbr\t"+parent.strHKFldNbr+"\n"
	aboutText+="strOKAction\t"+parent.strOKAction+"\n"
	aboutText+="strFrmFCFldNbr\t"+parent.strFrmFCFldNbr+"\n"
	aboutText+="strRowFCFldNbr\t"+parent.strRowFCFldNbr+"\n"
	aboutText+="strValidFCs\t"+parent.strValidFCs+"\n"
	if (parent.strJobNameFld)
	{
		aboutText+="strJobNameFld\t"+parent.strJobNameFld+"\n"
		aboutText+="strUsrNameFld\t"+parent.strUsrNameFld+"\n"
	}
	aboutText+="aFormFC[]\t\t"
	var len=parent.aFormFC.length;
	for (var i = 0; i < len; i++)
	{
		aboutText+=parent.aFormFC[i]+" | ";
	}
	aboutText=aboutText.substr(0,aboutText.length-2)+"\n";

	aboutText+="aFormFCText[]\t"
	for (var i = 0; i < len; i++)
	{
		aboutText+=parent.aFormFCText[i]+" | ";
	}
	aboutText=aboutText.substr(0,aboutText.length-2)+"\n";

	document.getElementById("textWindow").value=aboutText
}

//-----------------------------------------------------------------------------
function showWorkflow()
{
	var aboutText = "Last workflow request:\n" + dashStr;
	aboutText += (parent.tranMagic.lastWorkflowReq
		? formatXML(parent.tranMagic.lastWorkflowReq)+"\n"
		: "");
	aboutText += ("\nLast Workflow response:\n" + dashStr+"\n");
	aboutText += (parent.tranMagic.lastWorkflowRes
		? formatXML(parent.tranMagic.lastWorkflowRes)+"\n"
		: "");

	document.getElementById("textWindow").value=aboutText
}

//-----------------------------------------------------------------------------
function showCustomScript()
{
	var len=parent.document.scripts.length
	var txtWnd=document.getElementById("textWindow")
	txtWnd.value = "No Custom Script attached to Form.";
	for (var i = (len-1); i > 0; i--)
	{
		var iPos = parent.document.scripts(i).text.indexOf("var keyColl");
		if (iPos != -1 && i == len-1)
			break;
		else if (iPos != -1)
		{
			txtWnd.value = "";
			for (var j = i+1; j < len; j++)
			{
				if (parent.document.scripts(j).src != "")
				{
					try {
					var path = parent.document.scripts(j).src;
					var oText = portalWnd.httpRequest(path,null,"text/plain","text/plain",false)
					txtWnd.value +="\n\nSource: "+path+"\n";
					txtWnd.value += dashStr;
					if (oText.status)
						txtWnd.value += oText.status + ": " + oText.statusText;
					else
						txtWnd.value += oText;
					} catch (e) { }
				}
				else if (parent.document.scripts(j).text != "")
					txtWnd.value += parent.document.scripts(j).text;
			}
			break;
		}
	}
}

//-----------------------------------------------------------------------------
function switchView(view)
{
	try {		// a browser 'back' can be a problem!
		portalObj.toolbar.changeButtonState("btnShowTran", aboutSetTranButton(false));
		var btn=document.getElementById(lastView);
		btn.className="anchorActive";

		var btn=document.getElementById(view);
		btn.className="anchorHover";
		lastView=view;

		var txtWnd=document.getElementById("textWindow")
		switch(view)
		{
		case "FormXML":
			txtWnd.value=formatFormXML(parent.lawForm.IEXML.xml);
			break
		case "FormHTML":
			txtWnd.value=aboutFormat(parent.document.lastChild.innerHTML);
			break
		case "FormObj":
			showFormObjects();
			break
		case "FormVars":
			showFormVars();
			break
		case "TranMagic":
			var str=parent.tranMagic.storage.getDataString(true);
			str=str.replace(/(\<_f\d+\>)\s+(\<\/_f)/gi, "$1$2");
			txtWnd.value=str;
			portalObj.toolbar.changeButtonState("btnShowTran", aboutSetTranButton(true));
			break
		case "AgsReturn":
			var agsXML = (portalObj.xsltSupport
				? filterAGS(parent.lawForm.IEXML,parent.tranMagic.storage.document)
				: parent.tranMagic.storage.getDataString(true));
			txtWnd.value=agsXML
			break
		case "XSLScript":
			var len=parent.document.scripts.length
			txtWnd.value = "";
			for (var i = (len-1); i > 0; i--)
			{
				var iPos = parent.document.scripts(i).text.indexOf("var keyColl");
				if (iPos != -1)
				{
					txtWnd.value = parent.document.scripts(i).text;
					break;
				}
			}
			break;
		case "CustomScript":
			showCustomScript();
			break;
		case "Workflow":
			showWorkflow();
			break
		case "KeysColl":
			aboutKeysCollection();
			break
		case "KeysData":
			aboutKeysData();
			break
		case "ReqColl":
			aboutRequiredCollection();
			break
		case "ListColl":
			aboutListCollection();
			break
		case "DefColl":
			aboutDefaultsCollection();
			break
		case "PushColl":
			aboutPushesCollection();
			break
		case "NameColl":
			aboutNamesCollection();
			break
		case "IdColl":
			aboutIdsCollection();
			break
		case "WfColl":
			aboutWorkflowCollection();
			break
		}
		txtWnd.focus()
	} catch (e) { 
		var prefMsg="Error switching to view: "+view+"\n";
		portalWnd.displayExceptionMessage(e,"forms/about.js","switchView",prefMsg)
		aboutClose();
	}
}

//-----------------------------------------------------------------------------
function textKeyDown(evt)
{
    evt = portalWnd.getEventObject(evt)
    if (!evt) return;

	if (evt.keyCode == 27) return;			// allow escape

	if (evt.keyCode == 9 && !evt.shiftKey)	// allow tab?
	{
		portalWnd.setEventCancel(evt);
		return false;
	}

	if (evt.keyCode < 65)
		portalWnd.cancelEventBubble(evt)
	else if (evt.keyCode < 90 && !evt.altKey && !evt.ctrlKey && !evt.shiftKey)
		portalWnd.cancelEventBubble(evt)
}

//-----------------------------------------------------------------------------
function aboutKeyDown(evt)
{
    evt = portalWnd.getEventObject(evt)
    if (!evt) return false;

	// check with portal for hotkey action
	var action = portalWnd.getFrameworkHotkey(evt,"aboutforms");
	if ( !action )
	{
		// framework handled the keystroke
		portalWnd.setEventCancel(evt);
		return false;
	}

	// hotkey defined for this keystroke
	if (action != "aboutforms")
	{
		cntxtActionHandler(evt,action);
		portalWnd.setEventCancel(evt);
		return false;
	}

	var evtCaught=false
	var keyVal = portalObj.browser.isIE ? evt.keyCode : evt.charCode;
	if (keyVal==0)		// netscrape only
		keyVal=evt.keyCode;

   	if ( (keyVal == 37)	// arrow left
	&& ( evt.altKey && !evt.ctrlKey && !evt.shiftKey ) )
	{
		// kill the browser 'back' key combo
		evtCaught=true;
	}
	if(evtCaught==true)
		portalWnd.setEventCancel(evt)
	return evtCaught
}

//-----------------------------------------------------------------------------
function cntxtActionHandler(evt,action)
{
	if (action==null)		// called by the portal
	{
		action = portalWnd.getFrameworkHotkey(evt,"aboutforms");
		if (!action || action=="aboutforms")
			return false;
	}

	var bHandled=false;
	switch (action)
	{
	case "doCancel":
		aboutClose()
		bHandled=true
		break;
	case "posInFirstField":
        document.getElementById("textWindow").focus()
		bHandled=true
		break;
	}
	return (bHandled);
}

//-----------------------------------------------------------------------------
function aboutOnResize(evt)
{
	var scrWidth=(portalObj.browser.isIE
		? document.body.offsetWidth
		: window.innerWidth-2);
	var scrHeight=(portalObj.browser.isIE
		? document.body.offsetHeight
		: window.innerHeight-2);
	if (scrWidth < 157) return;
	if (scrHeight < 170) return;

	var btnDiv=document.getElementById("btnDiv")
	if (!btnDiv) return;

	btnDiv.style.left=6;
	btnDiv.style.width=scrWidth-20;

	var textWindow=document.getElementById("textWindow")
	if (!textWindow) return;

	textWindow.style.top=btnDiv.offsetHeight+4;
	textWindow.style.left=6;
	textWindow.style.width=scrWidth-20;
	textWindow.style.height=scrHeight-(btnDiv.offsetHeight+20);
}
