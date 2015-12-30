/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/dialogs/btnaction.js,v 1.2.2.1.4.2.22.2 2012/08/08 12:48:50 jomeli Exp $ */
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

var studioWnd=null
var oFormDef=null
var oldFdef = null
var strValue = null
var strPrefix = ""
var strFC = "FC="
var strTran = "Tran="
var strFunction = "function="
var strURL = "URL="

var funcList=new Array()

//-----------------------------------------------------------------------------
function defInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	studioWnd = wndArguments[0]
	strValue = wndArguments[1]
	sourceWnd = wndArguments[2]
	oFormDef=sourceWnd.myDoc.xmlDoc
	oldFdef = sourceWnd.myDoc.origDoc
	
	// initialize the function list
	defInitFunctionList()

	// select intial value/radio button
	defSelectInitialButton()

	document.body.style.visibility="visible"
	btnOK.focus()
}

//-----------------------------------------------------------------------------
function defOnKeyPress()
{
	if (khdlOKCancel(event))
	{
		event.cancelBubble=true
		event.returnValue=false
		return true
	}
	return(false)
}

//-----------------------------------------------------------------------------
function defSelectInitialButton()
{
	if (strValue.substr(0,strFC.length) == strFC)
	{
		rbFormAction.checked = true
		txtValue.value = strValue.substr(strFC.length)
	}
	else if (strValue.substr(0,strTran.length) == strTran)
	{
		rbFormTransfer.checked = true
		txtValue.value = strValue.substr(strTran.length)
	}

	else if (strValue.substr(0,strFunction.length) == strFunction)
	{
		rbFormFunction.checked = true
		txtValue.value = strValue.substr(strFunction.length)
	}

	else if (strValue.substr(0,strURL.length) == strURL)
	{
		rbURL.checked = true
		txtValue.value = strValue.substr(strURL.length)
	}
	else 
	{
		rbFormOpen.checked = true
		txtValue.value = strValue
	}

	defRadioClick(false)
}

//-----------------------------------------------------------------------------
function defSelect()
{
	window.returnValue = strPrefix + txtValue.value
	
	// all done
	window.close()
}

//-----------------------------------------------------------------------------
function defRadioClick(bClearText)
{	
	if (typeof(bClearText) == "undefined")
		bClearText = true
	
	// clear any list items
	defClearList()

	selassigned.disabled=true

	if (rbFormAction.checked)
	{
		if (strPrefix == strFC) bClearText = false
		strPrefix = strFC
		defBuildActionList()
		selassigned.disabled = false
		txtValue.disabled = true
		lblTitle.innerText=pageXLT.selectSingleNode("//phrase[@id='phFC']").text
	}
	else if (rbFormTransfer.checked)
	{
		if (strPrefix == strTran) bClearText = false
		strPrefix = strTran
		defBuildTransferList()
		selassigned.disabled = false
		txtValue.disabled = false
		lblTitle.innerText=pageXLT.selectSingleNode("//phrase[@id='phTransfer']").text
	}
	else if (rbFormOpen.checked)
	{
		if (strPrefix == "") bClearText = false
		strPrefix = ""
		selassigned.disabled = true
		txtValue.disabled = false
		lblTitle.innerText=pageXLT.selectSingleNode("//phrase[@id='phOpen']").text
	}
	else if (rbURL.checked)
	{
		if (strPrefix == strURL) bClearText = false
		strPrefix = strURL
		selassigned.disabled = true
		txtValue.disabled = false
		lblTitle.innerText=pageXLT.selectSingleNode("//phrase[@id='phURL']").text
	}
	else	// if (rbFormFunction.checked)
	{
		if (strPrefix == strFunction) bClearText = false
		strPrefix = strFunction
		defBuildFunctionList()
		selassigned.disabled = false
		txtValue.disabled = false
		lblTitle.innerText=pageXLT.selectSingleNode("//phrase[@id='phFunction']").text
	}

	if (bClearText) txtValue.value = ""
}

//-----------------------------------------------------------------------------
function defClearList()
{
	while(selassigned.options.length>0)
	{
		selassigned.options.remove(selassigned.options.length-1)
	}
}

//-----------------------------------------------------------------------------
function defBuildActionList()
{
	if ( !oldFdef ) return
	var oToolBarNode = oldFdef.selectSingleNode("//toolbar")
	
	if ( !oToolBarNode ) return
	
	var nodes = oToolBarNode.childNodes

	for (var i=0; i<nodes.length; i++ )
	{
		if (nodes[i].nodeName != "#text"
		&& nodes[i].nodeName != "#comment") 
		{
			var oOption = document.createElement("option")
			var value=""
			var nm=""
			
			value=nodes[i].getAttribute("value")
			nm=nodes[i].getAttribute("nm")

			oOption.text = nm
			oOption.value = value
			
			if (txtValue.value!="" && value==txtValue.value)
				oOption.selected=true
			selassigned.add(oOption)
		}
	}
}

//-----------------------------------------------------------------------------
function defBuildTransferList()
{
	if ( !oldFdef ) return
	var oTransfersNode = oldFdef.selectSingleNode("//transfers")
	
	if ( !oTransfersNode ) return
	var nodes = oTransfersNode.childNodes

	for (var i=0; i<nodes.length; i++ )
	{
		if (nodes[i].nodeName != "#text"
		&& nodes[i].nodeName != "#comment") 
		{
			var oOption = document.createElement("option")
			oOption.value=nodes[i].getAttribute("nbr")

			var prod=nodes[i].getAttribute("PROD")
			var token=nodes[i].getAttribute("TOKEN")
			var title=nodes[i].getAttribute("TITLE")

			oOption.text = title+" ("+token+")"
			oOption.value = token
			
			if (txtValue.value!="" && token==txtValue.value)
				oOption.selected=true

			selassigned.add(oOption)
		}
	}
}

//-----------------------------------------------------------------------------
function defInitFunctionList()
{
	var initList=new Array()
	var listIdx=0
	var reFunc = /^function.*\)$/gm;
	var re = /\(/

	// first look for functions in form script node
	var xsNode=oFormDef.selectSingleNode("//XSCRIPT")
	if (xsNode)
	{
		var scriptText=xsNode.text
		var iIndex=scriptText.search(reFunc)
		while (iIndex != -1)
		{
			scriptText = scriptText.substr(iIndex+9)
			var len=scriptText.search(re)
			if (len != -1)
			{
				// if any parameters in function, they are ignored
				var funcName=scriptText.substr(0,len)
				
				if(defIsButtonEvent(funcName))
				{
					iIndex=scriptText.search(reFunc);
					continue;
				}
								
				funcName +="()";
				initList[listIdx]=funcName
				listIdx += 1
			}
			iIndex=scriptText.search(reFunc)
		}
	}

	// now look for functions in included script files
	var incNode=oFormDef.selectSingleNode("//INCLUDE")
	if (!incNode || incNode.length < 1)
	{
		// no include files, any internal functions?
		if (listIdx > 0)
			funcList=initList.sort()
		return
	}

	var len=incNode.childNodes.length;
	for (var i = 0; i < len; i++)
	{
		// 'name' attribute is really a FileMgr call
		var fileName=incNode.childNodes(i).getAttribute("name")
		var fileText=studioWnd.SSORequest(fileName,null,"text/plain","text/plain",false)
		if (typeof(fileText) != "string")
			continue;

		var iIndex=fileText.search(reFunc)
		while (iIndex != -1)
		{
			fileText = fileText.substr(iIndex+9)
			var idx=fileText.search(re)
			if (idx != -1)
			{
				// if any parameters in function, they are ignored
				var funcName=fileText.substr(0,idx)+"()"
				initList[listIdx]=funcName
				listIdx += 1
			}
			iIndex=fileText.search(reFunc)
		}
	}

	// now sort the list
	funcList=initList.sort()
}
//-----------------------------------------------------------------------------
function defIsButtonEvent(funcName)
{
	var control = studioWnd.designStudio.activeDesigner.toolBox.getControlObject("button");

	for (var i = 0; i < control.events.count; i++)
	{
		var evt = control.events.item(i);
		var eventName = "BUTTON_" + evt.label;

		if(eventName == funcName)
			return true;	
	}

	return false;
}
//-----------------------------------------------------------------------------
function defBuildFunctionList()
{
	for (var i=0; i<funcList.length; i++ )
	{
		var oOption = document.createElement("option")
		var value=funcList[i]

		oOption.text = value
		oOption.value = value
		
		if (txtValue.value!="" && value==txtValue.value)
			oOption.selected=true
		selassigned.add(oOption)
	}
}

//-----------------------------------------------------------------------------
function defOnSelectChange()
{
	txtValue.value = selassigned.options[selassigned.selectedIndex].value
}
