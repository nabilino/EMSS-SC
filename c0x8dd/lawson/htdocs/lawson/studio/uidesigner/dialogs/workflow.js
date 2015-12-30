/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/dialogs/workflow.js,v 1.4.2.7.26.2 2012/08/08 12:48:50 jomeli Exp $ */
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

//form/workflows/workflow/criteria/criterion
//criterion name type value

//form/workflows/workflow/variables/variable
//variable src name type value

var tabArray = new Array()
tabArray[0] = "tabService"
tabArray[1] = "tabTriggerInfo"
tabArray[2] = "tabVariables"
var maxTabIndex=tabArray.length-1
var dlgActiveTab=null

var arrFields=null
var arrUserEnv=null
var builtPDL=false
var builtCriteria=false
var builtFields=false
var builtNameCriteria=false
var builtNameFields=false
var builtNameUserEnv=false
var builtNameVariables=false
var builtUserEnv=false
var builtVariables=false
var domVariables=null
var editMode=""
var	editCV=""
var	editName=""
var	editPos=0
var editSrc=""
var	editType=""
var	editValue=""
var gSelNameElement = null;
var workflowNode=null
var studioWnd=null
var oFormDef=null

//-----------------------------------------------------------------------------
function nameSort(a,b)
{
	// from txtdefault.js
	var aText=a.nm.toLowerCase()
	var bText=b.nm.toLowerCase()
	if (aText < bText) return (-1)
	if (aText == bText) return (0)
	if (aText > bText) return (1)
}

//-----------------------------------------------------------------------------
function padSpaces(s,n)
{
	var ret=s+""
	while (ret.length<n)
		ret+=" "
	return ret
}

//-----------------------------------------------------------------------------
function wfInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	studioWnd = wndArguments[0]
	oFormDef = wndArguments[1]
	workflowNode = wndArguments[2]

	if (workflowNode)
		// default return value
		window.returnValue=workflowNode
	else
	{
		// create empty workflow node if none provided
		var oDOM=studioWnd.xmlFactory.createInstance("DOM")
		oDOM.async=false
		oDOM.loadXML("<form><workflow id=\"\" /></form>")
		workflowNode=oDOM.selectSingleNode("//workflow")
	}

	// set the active tab
	var fElement=txtService
	//dlgActiveTab = window.document.all.tabService
	wfActivateTab(0)
	var id=workflowNode.getAttribute("id")
	if (id)
	{
		txtService.value=id
		if ( wfBuildService() )
		{
			fElement=btnNext
			wfActivateTab(1)
		}
	}
		
	document.body.style.visibility="visible"
	fElement.focus()
}

//-----------------------------------------------------------------------------
function wfActivateTab(inc)
{
	// increment tab index
	var curIndex = (dlgActiveTab?parseInt(dlgActiveTab.tabind):-1)
	var tabIndex = curIndex + inc
	if(tabIndex < 0)
		tabIndex = 0
	else if (tabIndex > maxTabIndex)
		tabIndex = maxTabIndex
	if (curIndex == tabIndex) return

	var objTab = document.getElementById(tabArray[tabIndex])
	if(dlgActiveTab && (objTab.id == dlgActiveTab.id)) return

	// make the previously active tab inactive
	if (dlgActiveTab) 
	{
		window.document.all["div" + dlgActiveTab.id.substr(3)].style.display = "none"
		window.document.all["tab" + dlgActiveTab.id.substr(3)].style.display = "none"
	}

	// show the new active tab and div
	objTab.style.display="block"
	window.document.all["div"+objTab.id.substr(3)].style.display = "block"

	var btnBack=document.getElementById("btnBack")
	var btnCancel=document.getElementById("btnCancel")
	var btnNext=document.getElementById("btnNext")
	switch(objTab.id)
	{
		case "tabService":
			btnBack.disabled=true
			var selService=document.getElementById("selService")
			btnNext.disabled=(selService.length?false:true)
			btnNext.value="Next >"
			btnNext.onclick=wfOnClickNext
			try 
			{	// on initialization, window may not be visible
				document.getElementById("txtService").focus()
			}
			catch (e)
			{ }
			break
		case "tabTriggerInfo":
			txtSelServiceTriggerInfo.value=wfGetCurrentService()
			if (!builtPDL)
			 	wfBuildPDL()

			document.getElementById("txtWorkCategoryValue").value=wfGetCurrentWorkCatValue()
			btnBack.disabled=false
			btnNext.disabled=false
			btnNext.value="Next >"
			btnNext.onclick=wfOnClickNext
			try
			{	// on initialization, window may not be visible
				document.getElementById("selProductLine").focus()
			}
			catch (e)
			{ }
			break
		case "tabVariables":
			txtSelServiceVariables.value=wfGetCurrentService()
			btnBack.disabled=false
			if (!builtCriteria)
			 	wfBuildCriteria()
			if (!builtVariables)
			 	wfBuildVariables()
			btnNext.disabled=false
			btnNext.value="Finish"
			btnNext.onclick=wfOnClickFinish
			try 
			{	// on initialization, window may not be visible
				btnNext.focus()
			}
			catch (e)
			{ }
			break
	}

	// save reference to new active tab
	dlgActiveTab = objTab
}

//-----------------------------------------------------------------------------
function wfBuildCriteria()
{
	// clear the select
	var sel=document.getElementById("selCriteria")
	for (var i=sel.length-1; i > -1; i--)
		sel.removeChild(sel.children(i))

	// get criteria		
	var criteriaDOM=wfGetListDOM("criteria")
	if (!criteriaDOM) return (false)
	var occNodes=criteriaDOM.selectNodes("/DME/RECORDS/RECORD/COLS/COL/OCC")
	var len=(occNodes?occNodes.length:0)

	// build the select
	var name=""
 	for (var i=0; i<3; i++)
 	{
		if (i<len)
			name=occNodes[i].text
		if (!name)
			name="CRITERIA-"+(i+1)
		if (name)
		{
			var c=workflowNode.selectSingleNode("criteria/criterion[@name='"+name+"']")
			var	type=(c?c.getAttribute("type"):"Literal")
			var	value=(c?c.getAttribute("value"):"")

	 		var oOption = document.createElement("option")
	 		oOption.text = wfTextCriteria(name,type,value)
	 		oOption.value = name
			sel.add(oOption)
		}
		wfSetXMLTag("a","c",i,"",name,type,value);
 	}
	builtCriteria=true
	return (sel.length ? true : false)
}

//-----------------------------------------------------------------------------
function wfBuildFields()
{
	// clear the select
	var sel=document.getElementById("selField")
	for (var i=selField.length-1; i > -1; i--)
		sel.removeChild(selField.children(i))

	// get fields
	if (!arrFields)
		wfGetFields()
	var len=(arrFields?arrFields.length:0)
	if (!len) return (false)
	
	// build the select
	for (var i=0; i<len; i++)
	{
		var name=arrFields[i].nm
		if (name)
		{
		 	var oOption = document.createElement("option")
			oOption.text=name
			oOption.value=name
		 	sel.add(oOption)
		}
	}
	builtFields=true
	return (sel.length ? true : false)
}

//-----------------------------------------------------------------------------
function wfBuildNameCriteria()
{
	// clear the select
	var sel=document.getElementById("selNameCriterion")
	for (var i=sel.length-1; i > -1; i--)
		sel.removeChild(sel.children(i))

	// get criteria
	var criteriaDOM=wfGetListDOM("criteria")
	if (!criteriaDOM) return (false)
	var occNodes=criteriaDOM.selectNodes("/DME/RECORDS/RECORD/COLS/COL/OCC")
	var len=(occNodes?occNodes.length:0)
	if (!len) return (false)

	// build the select
 	for (var i=0; i<3; i++)
 	{
		if (i<len)
			name=occNodes[i].text
		if (!name)
			name="CRITERIA-"+(i+1)
		if (name)
		{
	 		var oOption = document.createElement("option")
	 		oOption.text = name
	 		oOption.value = name
	 		sel.add(oOption)
		}
 	}
	builtNameCriteria=true
	return (sel.length ? true : false)
}

//-----------------------------------------------------------------------------
function wfBuildNameFields()
{
	// clear the select
	var sel=document.getElementById("selNameField")
	for (var i=sel.length-1; i > -1; i--)
		sel.removeChild(sel.children(i))

	// get fields
	if (!arrFields)
		wfGetFields()
	var len=(arrFields?arrFields.length:0)
	if (!len) return (false)
		
	// build the select
	for (var i=0; i<len; i++)
	{
		var name=arrFields[i].nm
		if (name)
		{
		 	var oOption = document.createElement("option")
			oOption.text=name
			oOption.value=name
		 	sel.add(oOption)
		}
	}
	builtNameFields=true
	return (sel.length ? true : false)
}

//-----------------------------------------------------------------------------
function wfBuildNameUserEnv()
{
	// clear the select
	var sel=document.getElementById("selNameUserEnv")
	for (var i=sel.length-1; i > -1; i--)
		sel.removeChild(sel.children(i))

	// get user env
	if (!arrUserEnv)
		wfGetUserEnv()

	// build the select
	var len=(arrUserEnv?arrUserEnv.length:0)
	for (var i=0; i<len; i++)
	{
		var name=arrUserEnv[i]
		if (name)
	 	{
			var oOption = document.createElement("option")
			oOption.text=name
			oOption.value=name
		 	sel.add(oOption)
		}
	}
	builtNameUserEnv=true
	return (sel.length ? true : false)
}

//-----------------------------------------------------------------------------
function wfBuildNameVariables()
{
 	// clear the select
	var sel=document.getElementById("selNameVariable")
	for (var i=sel.length-1; i > -1; i--)
		sel.removeChild(sel.children(i))

	// get variables
	if (!domVariables)
		wfGetVariables()
	if (!domVariables) return (false)
	var serviceNodes=domVariables.selectNodes("/DME/RECORDS/RECORD/COLS")
	var len=(serviceNodes?serviceNodes.length:0)
	if (!len) return (false)

	// build the select
	for (var i=0; i<len; i++)
 	{
		var arr=serviceNodes[i].getElementsByTagName("COL")
		var name=((arr&&arr.length)?arr[0].text:"")
		if (name)
		{
	 		var oOption = document.createElement("option")
	 		oOption.text = name
	 		oOption.value = name
	 		sel.add(oOption)
		}
 	}
	builtNameVariables=true
	return (sel.length ? true : false)
}

//-----------------------------------------------------------------------------
function wfBuildPDL()
{
	// clear the select
	var sel=document.getElementById("selProductLine")
	for (var i=sel.length-1; i > -1; i--)
		sel.removeChild(sel.children(i))

	// add empty option
 	var oOption = document.createElement("option")
	oOption.text=""
	oOption.value=""
	sel.add(oOption)

	// get product lines
	var pdl=wfGetCurrentPDL()
	studioWnd.cmnLoadSelectPDL(window,sel,pdl,true)
	
	builtPDL=true
	return (sel.length ? true : false)
}

//-----------------------------------------------------------------------------
function wfBuildService()
{
	// clear the select
	var sel=document.getElementById("selService");
	
	for (var i=sel.length-1; i > -1; i--)
		sel.removeChild(sel.children(i));

	// get services
	var serviceDOM=wfGetListDOM("service");
	
	if (!serviceDOM)
		return (false);
		
	var serviceNodes=serviceDOM.selectNodes("/DME/RECORDS/RECORD/COLS");
	var len=(serviceNodes?serviceNodes.length:0);
	
	if (!len) 
		return (false);
	
	// build the select
	var curService=wfGetCurrentService();
	var selIndex = -1;

 	for (var i=0; i<len; i++)
 	{
		var columnAry = serviceNodes[i].getElementsByTagName("COL");
		var service = columnAry[0].text;
		var status = columnAry[1].text 
		var description = columnAry[2].text;
		
		if (service)
		{
	 		if (service == curService)
	 			selIndex++;
	 			
	 		var oOption = document.createElement("option")
	 		oOption.text = padSpaces(service,15) + "   " + (status =="1"?"":"Disabled");
	 		oOption.value = service;
			oOption.desc = description
	 		sel.add(oOption)
		}
 	}

	if (sel.length)	
	{
		sel.selectedIndex = (selIndex == -1 ? 0 : selIndex)
		wfSelect(sel)
		try
		{	// on initialization, window may not be visible
			sel.focus()
		}
		catch (e)
		{ }
	}
	builtService=true
	return (sel.length ? true : false)
}

//-----------------------------------------------------------------------------
function wfBuildUserEnv()
{
	// clear the select
	var sel=document.getElementById("selUserEnv")
	for (var i=sel.length-1; i > -1; i--)
		sel.removeChild(sel.children(i))

	// get user env
	if (!arrUserEnv)
		wfGetUserEnv()

	// build the select
	var len=(arrUserEnv?arrUserEnv.length:0)
	for (var i=0; i <len; i++)
	{
		var name=arrUserEnv[i]
		if (name)
	 	{
			var oOption = document.createElement("option")
			oOption.text=name
			oOption.value=name
		 	sel.add(oOption)
		}
	}
	builtUserEnv=true
	return (sel.length ? true : false)
}

//-----------------------------------------------------------------------------
function wfBuildVariables()
{
 	// clear the select
	var sel=document.getElementById("selVariables")
	for (var i=sel.length-1; i > -1; i--)
		sel.removeChild(sel.children(i))

	// get variables
	var arrVars=workflowNode.selectNodes("variables/variable")
	var len=(arrVars?arrVars.length:0)
	if (!len) return (false)

	// build the select
	for (var i=0; i<len; i++)
 	{
		var src=arrVars[i].getAttribute("src")
		var name=arrVars[i].getAttribute("name")
		var type=arrVars[i].getAttribute("type")
		var value=arrVars[i].getAttribute("value")
		if (!src) 
		{
			src="Variable"
			arrVars[i].setAttribute("src",src)
		}
		if (name)
		{
	 		var oOption = document.createElement("option")
			oOption.text = wfTextVariable(src,name,type,value)		
	 		oOption.value = name
	 		sel.add(oOption)
		}
 	}
	builtVariables=true
	return (sel.length ? true : false)
}

//-----------------------------------------------------------------------------
function wfClearCriteria()
{
	var arrNodes=workflowNode.selectNodes("criteria/criterion")
	var len=(arrNodes?arrNodes.length:0)
	for (var i=len-1;i>=0;i--)
		arrNodes[i].parentNode.removeChild(arrNodes[i])
}

//-----------------------------------------------------------------------------
function wfClearTriggerInfo()
{
	document.getElementById("txtWorkCategoryValue").value=""
	document.getElementById("selProductLine").selectedIndex=0
}

//-----------------------------------------------------------------------------
function wfClearVariables()
{
	var arrNodes=workflowNode.selectNodes("variables/variable")
	var len=(arrNodes?arrNodes.length:0)
	for (var i=len-1;i>=0;i--)
		arrNodes[i].parentNode.removeChild(arrNodes[i])
}

//-----------------------------------------------------------------------------
function wfDeleteXMLTag(cv,pos)
{
	// find section
	var sectionTag=(cv=="c"?"criteria":"variables")
	var sectionNode=workflowNode.selectSingleNode(sectionTag)
	if (!sectionNode)
	{
		sectionNode=workflowNode.ownerDocument.createElement(sectionTag)
		workflowNode.appendChild(sectionNode)
	}
	
	// delete element
	var elemTag=(cv=="c"?"criterion":"variable")
	var arrNodes=sectionNode.selectNodes(elemTag)
	var len=(arrNodes?arrNodes.length:0)
	if (!len) return
	var node=arrNodes[pos]
	if (node)
		node.parentNode.removeChild(node)

	// clear edit settings so it will not try to save on next select
	wfEditSet("","",0,"","","","")
		
	// update select
	switch (cv)
	{
		case "c":
			wfBuildCriteria()
			break
		case "v":
			wfBuildVariables()
			break
	}
}

//-----------------------------------------------------------------------------
function wfEditSave()
{
	if (!editCV)
		return false;

	// get current values
	var selSource=document.getElementById("selSource")
	var selTypeList=document.getElementById("selTypeList")
	
	var srcIndex=selSource.selectedIndex
	var src=((srcIndex>-1)?selSource.options[srcIndex].value:"Literal")
	var name=(editCV=="v"?wfGetNamebySource(src):editName)
	
	if(editCV == "v")
	{
		var bValidName = wfIsValidVariableName(name);
	
		if(!bValidName && gSelNameElement)
		{
			gSelNameElement.focus();
			return false;
		}
	}
	
	var typeIndex=selTypeList.selectedIndex
	var type=((typeIndex>-1)?selTypeList.options[typeIndex].value:"Literal")
	var value=""
	switch (type)
	{
		case "Literal":
			var txtValue=document.getElementById("txtValue")
			value=txtValue.value
			break
		case "Field":
			var sel=document.getElementById("selField")
			var i=sel.selectedIndex
			value=(i>-1?sel.options[i].value:"")
			break
		case "UserEnv":
			var sel=document.getElementById("selUserEnv")
			var i=sel.selectedIndex
			value=(i>-1?sel.options[i].value:"")
			break
	}
	wfSetXMLTag(editMode,editCV,editPos,src,name,type,value)
	return true;
}

//-----------------------------------------------------------------------------
function wfEditSet(mode,cv,pos,src,name,type,value)
{
	// save initial values - used by wfSelectType
	editMode=mode
	editCV=cv
	editSrc=src
	editPos=pos
	editName=name
	editType=type
	editValue=value

	// update display
	var lblEditName=document.getElementById("lblEditName")
	var lblEditValue=document.getElementById("lblEditValue")
	var selSource=document.getElementById("selSource")
	var txtName=document.getElementById("txtName")
	var selNameField=document.getElementById("selNameField")
	var selTypeList=document.getElementById("selTypeList")
	var txtValue=document.getElementById("txtValue")
	var btnUpdate=document.getElementById("btnUpdate")
	switch (cv)
	{
		case "c":
			lblEditName.style.visibility="visible"
			lblEditValue.style.visibility="visible"
			selSource.style.display="none"
			wfSelectSource("")
			
			txtName.disabled=true
			txtName.value=name
			txtName.style.display="inline"
			
			selTypeList.style.visibility="visible"
			
			btnUpdate.value=(mode=="a"?"Add":"Update")
			btnUpdate.style.visibility="visible"
			break
		case "v":
			lblEditName.style.visibility="visible"
			lblEditValue.style.visibility="visible"
			if (!src) 
			{	
				src="Variable"
				editSrc=src
			}
			wfSelectUpdate(selSource,src)
			selSource.style.display="inline"
			wfSelectSource(src)

			selTypeList.style.visibility="visible"

			btnUpdate.value=(mode=="a"?"Add":"Update")
			btnUpdate.style.visibility="visible"
			break
		default:
			lblEditName.style.visibility="hidden"
			lblEditValue.style.visibility="hidden"
			selSource.style.display="none"
			wfSelectSource("")

			selTypeList.style.visibility="hidden"

			btnUpdate.style.visibility="hidden"
			break
	}
	
	// enable type list
	selTypeList.selectedIndex=-1
	if (type)
	{
		var len=selTypeList.length
		for (var i=0;i<len;i++)
		{
			if (selTypeList.options[i].value==type)
			{
				selTypeList.selectedIndex=i
				break
			}
		}
		selTypeList.style.visibility="visible"
	}
	wfSelectType(type)
}

//-----------------------------------------------------------------------------
function wfGetCurrentPDL()
{
	var ret=workflowNode.getAttribute("pdl")
	return (ret?ret:"")
}

//-----------------------------------------------------------------------------
function wfGetCurrentService()
{
	var ret=workflowNode.getAttribute("id")
	return (ret?ret:"")
}
//-----------------------------------------------------------------------------
function wfGetCurrentWorkCatValue()
{
	var ret=workflowNode.getAttribute("workcatval")
	return (ret?ret:"")
}

//-----------------------------------------------------------------------------
function wfGetFields()
{
	arrFields=new Array()
	var nodes=null
	var formNode=oFormDef.selectSingleNode("//form")
	var rtntype=formNode.getAttribute("rtntype")
	if (!rtntype || rtntype=="ALL")
		nodes = oFormDef.selectNodes("//fld[@nbr]")
	else
		nodes = oFormDef.selectNodes("//fld[@nbr and @rtn='1']")

	var len=(nodes ? nodes.length : 0)
	for (var i=0; i<len; i++)
	{
		var tp = nodes[i].getAttribute("tp")
		if ( tp!="label" && tp!="labelHidden" && tp!="rect")
		{
		 	var fldObj = new Object
			fldObj.nm=nodes[i].getAttribute("nm")
			fldObj.nbr=nodes[i].getAttribute("nbr")
			arrFields.push(fldObj)
		}
	}
	len=arrFields.length
	if (len)
		arrFields.sort(nameSort)
}

//-----------------------------------------------------------------------------
function wfGetListDOM(type)
{
	// based on dlgGetListDOM from erp_new.js
	var api=""
	var curService=wfGetCurrentService()
	switch (type)
	{
		case "service":
			api=studioWnd.DMEPath+"?"
				+"PROD=LOGAN&FILE=WFSERVICE&INDEX=WFSSET1"
				+"&FIELD=SERVICE;ALL-PROCSTATUS;SHORT-DESC;"
				+"&OUT=XML&XKEYS=FALSE&XRELS=FALSE&XIDA=FALSE&MAX=1000"
			var txtService=document.getElementById("txtService")
			if (txtService.value!="")
				api+=("&SELECT=SERVICE~"+(escape(txtService.value)))
			break
		case "criteria":
			api=studioWnd.DMEPath+"?"
				+"PROD=LOGAN&FILE=WFSERVICE&INDEX=WFSSET1"
				+"&FIELD=CRITERIA-NAME"
				+"&OUT=XML&XKEYS=FALSE&XRELS=FALSE&XIDA=FALSE&MAX=1"
				+"&KEY="+escape(curService)
			break
		case "variables":
			api=studioWnd.DMEPath+"?"
				+"PROD=LOGAN&FILE=WFSRVVAR&INDEX=WSVSET1"
				+"&FIELD=VARIABLE-NAME;VARIABLE-TYPE;VARIABLE-SIZE;KEY-FIELD"
				+"&OUT=XML&XKEYS=FALSE&XRELS=FALSE&XIDA=FALSE&MAX=1000"
				+"&KEY="+escape(curService)
			break
	}
	if (api=="") return (null)

	var domXML=studioWnd.SSORequest(api,null,"","",false);
	if (!domXML || domXML.status)
	{
		var msg="Error loading workflow services.\n";
		if (domXML)
			msg+=studioWnd.getHttpStatusMsg(domXML.status) + 
				"\nServer response: " + domXML.statusText + " (" + domXML.status + ")" 
		studioWnd.cmnDlg.messageBox(msg,"ok","stop",window)
		domXML=null
	}
	else
	{
		if(domXML.xml == "")
		{
			domXML=null
			var msg="Invalid Server Response.";
			studioWnd.cmnDlg.messageBox(msg,"ok","stop",window)
		}
		else
		{
			var errNode=domXML.selectSingleNode("//ERROR")
			if (errNode)
			{
				domXML=null
				var msg= "Error calling Data service.\n" + 
						errNode.selectSingleNode("MSG").text;
				studioWnd.cmnDlg.messageBox(msg,"ok","stop",window)
			}
		}
	}
	return (domXML)
}

//-----------------------------------------------------------------------------
function wfGetNamebySource(src)
{
	switch (src)
	{
		case "Literal":
			return document.getElementById("txtName").value
			break
		case "Field":
			var sel=document.getElementById("selNameField")
			var i=sel.selectedIndex
			return (i>-1?sel.options[i].value:"")
			break
		case "UserEnv":
			var sel=document.getElementById("selNameUserEnv")
			var i=sel.selectedIndex
			return (i>-1?sel.options[i].value:"")
			break
		case "Criterion":
			var sel=document.getElementById("selNameCriterion")
			var i=sel.selectedIndex
			return (i>-1?sel.options[i].value:"")
			break
		case "Variable":
			var sel=document.getElementById("selNameVariable")
			var i=sel.selectedIndex
			return (i>-1?sel.options[i].value:"")
			break
	}
	return ""
}

//-----------------------------------------------------------------------------
function wfGetUserEnv()
{
	arrUserEnv = new Array();
	var index = 0;
	var nodes = studioWnd.designStudio.profile.selectNodes("/PROFILE/ATTRIBUTES/ATTR");
	var len = (nodes ? nodes.length : 0);
	
	if (!len)
		return;
	
	for (var i=0; i<len; i++)
	{
		arrUserEnv[index] = nodes[i].getAttribute("name");
		index++;
	}
	
	if (index)
		arrUserEnv.sort();
}

//-----------------------------------------------------------------------------
function wfGetVariables()
{
	domVariables=wfGetListDOM("variables")
}

//-----------------------------------------------------------------------------
function wfOnClickAdd()
{
	// for clarity, deselect both selects
	document.getElementById("selCriteria").selectedIndex=-1
	document.getElementById("selVariables").selectedIndex=-1

	// get variables length
	var arrVars=workflowNode.selectNodes("variables/variable")
	var pos=(arrVars?arrVars.length:0)

	// show add row
	var mode="a"
	var cv="v"
	var src="Variable"
	var name=""
	var type="Literal"
	var value=""
	wfEditSet(mode,cv,pos,src,name,type,value)
}

//-----------------------------------------------------------------------------
function wfOnClickBack()
{
	switch(dlgActiveTab.id)
	{
		case "tabService":
			break
		case "tabTriggerInfo":
			//assumes service will still be there
			wfSaveTriggerInfo()
			wfActivateTab(-1)
			break
		case "tabVariables":
			//assumes trigger info will still be there
			wfActivateTab(-1)
			break
	}
}

//-----------------------------------------------------------------------------
function wfOnClickDelete()
{
	if ((editMode=="e") && editCV)
		wfDeleteXMLTag(editCV,editPos)
}

//-----------------------------------------------------------------------------
function wfOnClickDeleteAll()
{
	wfClearCriteria()
	wfClearVariables()
	wfBuildCriteria()
	wfBuildVariables()
}

//-----------------------------------------------------------------------------
function wfOnClickUpdate()
{
	var bContinue = wfEditSave();
	
	if(!bContinue)
		return false;
	
	if (editMode=="a")
	{
		var selId=(editCV=="c"?"selCriteria":"selVariables")
		var sel=document.getElementById(selId)
		var val=editName
		wfSelectUpdate(sel,val)
		
		editMode="e"
		btnUpdate.value="Update"
	}
}

//-----------------------------------------------------------------------------
function wfOnClickFinish()
{
 	window.returnValue=workflowNode
	window.close()                                                                                         
}

//-----------------------------------------------------------------------------
function wfOnClickNext()
{
	switch(dlgActiveTab.id)
	{
		case "tabService":
			var sel = window.document.getElementById("sel"+dlgActiveTab.id.substr(3))
			if (!sel) return
			
			var selIndex = sel.selectedIndex
			if (selIndex == -1) return
		
			var curService=wfGetCurrentService()
			var id=sel.options[selIndex].value
			if (curService != id)
			{
				builtCriteria=false
				builtNameCriteria=false
				builtNameVariables=false
				builtVariables=false		
				domVariables=null
				wfClearTriggerInfo()
				wfClearCriteria()
				wfClearVariables()

				// clear edit settings
				var mode=""
				var cv=""
				var pos=0
				var src=""
				var name=""
				var type=""
				var value=""
				wfEditSet(mode,cv,pos,src,name,type,value)
			}
			workflowNode.setAttribute("id",id)
			wfActivateTab(1)
			break
		case "tabTriggerInfo":
			wfSaveTriggerInfo()
			wfActivateTab(1)
			break
		case "tabVariables":
			break
	}
}

//-----------------------------------------------------------------------------
function wfOnKeyDown()
{
	var bEvtCaught=false
	switch(event.keyCode)
	{
		case 27: // escape
			bEvtCaught=true
			window.close()
			break
		case 13: // enter
			switch (event.srcElement.id)
			{
				case "selProductLine":
				case "selService":
				case "txtWorkCategoryValue":
					document.getElementById("btnNext").click()
					bEvtCaught=true
					break
		
				case "txtService":
					document.getElementById("btnFind").click()
					bEvtCaught=true
					break
			}
			break
	}
	if (bEvtCaught)
	{
		event.cancelBubble=true
		event.returnValue=true
	}
	return (!bEvtCaught)
}

//-----------------------------------------------------------------------------
function wfSaveTriggerInfo()
{
	var workcatval=document.getElementById("txtWorkCategoryValue").value;
	var selProductLine=document.getElementById("selProductLine");
	var pdlIndex=selProductLine.selectedIndex;
	var pdl=(pdlIndex>-1?selProductLine.options[pdlIndex].value:"");
		
	workflowNode.setAttribute("workcatval",workcatval);
	workflowNode.setAttribute("pdl",pdl);
}

//-----------------------------------------------------------------------------
function wfSelect(sel)
{
	if (selIndex == -1) 
	{
		switch (sel.id)
		{
			case "selService":
				document.getElementById("btnNext").disabled=true
				break
			case "selCriteria":
			case "selVariables":
				document.getElementById("btnDelete").disabled=true
				break
		}
		return
	}	
	
	// called when user clicks on a select
	var selIndex=sel.selectedIndex
	var name=sel.options[selIndex].value
	switch (sel.id)
	{
		case "selService":
			var value=sel.options[selIndex].desc
			document.getElementById("lblDescText").firstChild.nodeValue=value
			document.getElementById("btnNext").disabled=false
			break
		case "selCriteria":
			// for clarity, deselect other
			document.getElementById("selVariables").selectedIndex=-1
			
			// current value from xml
			var c=workflowNode.selectSingleNode("criteria/criterion[@name='"+name+"']")
			var mode="e"
			var cv="c"
			var pos=selIndex
			var src=""
			var	type=(c?c.getAttribute("type"):"Literal")
			var	value=(c?c.getAttribute("value"):"")
			wfEditSet(mode,cv,pos,src,name,type,value)

			document.getElementById("btnDelete").disabled=false
			break
		case "selVariables":
			// for clarity, deselect other
			document.getElementById("selCriteria").selectedIndex=-1

			// current value from xml
			var v=workflowNode.selectSingleNode("variables/variable[@name='"+name+"']")
			var mode="e"
			var cv="v"
			var pos=selIndex
			var src=(v?v.getAttribute("src"):"Variable")
			var	type=(v?v.getAttribute("type"):"Literal")
			var	value=(v?v.getAttribute("value"):"")
			wfEditSet(mode,cv,pos,src,name,type,value)

			document.getElementById("btnDelete").disabled=false
			break
	}
}
				
//-----------------------------------------------------------------------------
function wfSelectName(elem)
{
	gSelNameElement = elem;
	
	switch (elem.id)
	{
	case "txtName":
		txtValue.value=elem.value
		break
	case "selNameField":
		var selTypeList=document.getElementById("selTypeList")
		wfSelectUpdate(selTypeList,"Field")
		wfSelectType("Field")
		var selField=document.getElementById("selField")
		wfSelectUpdate(selField,elem.options[elem.selectedIndex].value)
		break
	case "selNameUserEnv":
		var selTypeList=document.getElementById("selTypeList")
		wfSelectUpdate(selTypeList,"UserEnv")
		wfSelectType("UserEnv")
		var selUserEnv=document.getElementById("selUserEnv")
		wfSelectUpdate(selUserEnv,elem.options[elem.selectedIndex].value)
		break
	case "selNameCriterion":
		break
	case "selNameVariable":
		break
	}
}

//-----------------------------------------------------------------------------
function wfSelectSource(src)
{
	editSource=src
	
	var txtName=document.getElementById("txtName")
	var selNameField=document.getElementById("selNameField")
	var selNameUserEnv=document.getElementById("selNameUserEnv")
	var selNameCriterion=document.getElementById("selNameCriterion")
	var selNameVariable=document.getElementById("selNameVariable")
	switch (src)
	{
		case "Literal":
			selNameField.style.display="none"
			selNameUserEnv.style.display="none"
			selNameCriterion.style.display="none"
			selNameVariable.style.display="none"
			txtName.value=editName
			txtName.disabled=false
			txtName.style.display="inline"
			break
		case "Field":
			txtName.style.display="none"
			selNameUserEnv.style.display="none"
			selNameCriterion.style.display="none"
			selNameVariable.style.display="none"
			if (!builtNameFields)
				wfBuildNameFields()
			wfSelectUpdate(selNameField,editName)
			selNameField.style.display="inline"
			break
		case "UserEnv":
			txtName.style.display="none"
			selNameField.style.display="none"
			selNameCriterion.style.display="none"
			selNameVariable.style.display="none"
			if (!builtNameUserEnv)
				wfBuildNameUserEnv()
			wfSelectUpdate(selNameUserEnv,editName)
			selNameUserEnv.style.display="inline"
			break
		case "Variable":
			txtName.style.display="none"
			selNameField.style.display="none"
			selNameUserEnv.style.display="none"
			selNameCriterion.style.display="none"
			if (!builtNameVariables)
				wfBuildNameVariables()
			wfSelectUpdate(selNameVariable,editName)
			selNameVariable.style.display="inline"
			break
		default:
			txtName.style.display="none"
			selNameField.style.display="none"
			selNameUserEnv.style.display="none"
			selNameCriterion.style.display="none"
			selNameVariable.style.display="none"
			break
	}
}

//-----------------------------------------------------------------------------
function wfSelectType(type)
{
	var selField=document.getElementById("selField")
	var selUserEnv=document.getElementById("selUserEnv")
	var txtValue=document.getElementById("txtValue")
	switch (type)
	{
		case "Literal":
			selField.style.display="none"
			selUserEnv.style.display="none"
			document.getElementById("txtValue").value=editValue
			txtValue.style.display="inline"
			break
		case "Field":
			txtValue.style.display="none"
			selUserEnv.style.display="none"
			if (!builtFields)
				wfBuildFields()
			wfSelectUpdate(selField,editValue)
			selField.style.display="inline"
			break
		case "UserEnv":
			txtValue.style.display="none"
			selField.style.display="none"
			if (!builtUserEnv)
				wfBuildUserEnv()
			wfSelectUpdate(selUserEnv,editValue)
			selUserEnv.style.display="inline"
			break
		default:
			txtValue.style.display="none"
			selField.style.display="none"
			selUserEnv.style.display="none"
			break
	}
}

//-----------------------------------------------------------------------------
function wfSelectUpdate(sel,val)
{
	// selects option with value val in select sel
	if (!sel) return
	var len=sel.length
	for (var i=0; i<len; i++)
	{
		if (sel.options[i].value==val)
		{
			sel.selectedIndex=i
			sel.title=val
			return
		}
	}
	sel.selectedIndex=-1
}

//-----------------------------------------------------------------------------
function wfSetXMLTag(mode,cv,pos,src,name,type,value)
{
	// find section
	var sectionTag=(cv=="c"?"criteria":"variables")
	var sectionNode=workflowNode.selectSingleNode(sectionTag)
	if (!sectionNode)
	{
		sectionNode=workflowNode.ownerDocument.createElement(sectionTag)
		workflowNode.appendChild(sectionNode)
	}
	
	// update element
	var elemTag=(cv=="c"?"criterion":"variable")
	var arrNodes=sectionNode.selectNodes(elemTag)
	var node=(arrNodes && (arrNodes.length>pos)?arrNodes[pos]:null)
	if (!node)
	{
		node=workflowNode.ownerDocument.createElement(elemTag)
		node.setAttribute("pos",pos)
		sectionNode.appendChild(node)
	}
	node.setAttribute("src",src)
	node.setAttribute("name",name)
	node.setAttribute("type",type)
	node.setAttribute("value",value)
	
	editName=name
	editSrc=src
	editType=type
	editValue=value

	// update select
	switch (cv)
	{
		case "c":
			var sel=document.getElementById("selCriteria")
	 		var oOption = sel.options[pos]
			if (!oOption)
			{
				oOption=document.createElement("option")
				sel.add(oOption)
			}
	 		oOption.text=wfTextCriteria(name,type,value)
			oOption.value=name
			break
		case "v":
			var sel=document.getElementById("selVariables")
	 		var oOption = sel.options[pos]
			if (!oOption)
			{
				oOption=document.createElement("option")
				sel.add(oOption)
			}
			oOption.text=wfTextVariable(src,name,type,value)
			oOption.value=name
			break
	}
}

//-----------------------------------------------------------------------------
function wfTextCriteria(name,type,value)
{
	if (type=="UserEnv") type="User Variable"
	else if (type=="Field") type="Form Field"	
	
	return padSpaces(name,15)
		+"   "+padSpaces(type,13)
		+"   "+padSpaces(value,45)
}

//-----------------------------------------------------------------------------
function wfTextVariable(src,name,type,value)
{
	if (src=="Variable") src="Service Variable"
	else if (src=="UserEnv") src="User Variable"
	else if (src=="Field") src="Form Field"
	
	if (type=="UserEnv") type="User Variable"
	else if (type=="Field") type="Form Field"	
	
	return padSpaces(src,16)
		+"   "+padSpaces(name,20)
		+"   "+padSpaces(type,13)
		+"   "+padSpaces(value,45)
}

//-----------------------------------------------------------------------------
function wfIsValidVariableName(name)
{
	if(typeof(name)!= "string" || name == "")
	{
		var msg = "Variable name can NOT be blank";
		studioWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		return false;
	}

	if(editMode=="a")
		var node = workflowNode.selectSingleNode("./variables/variable[@name='" + name + "']");
	else
		var node = workflowNode.selectSingleNode("./variables/variable[@name='" + name + "@pos=" + editPos + "']");
	
	if(node)
	{
		var msg = "Variable name must be unique";
		studioWnd.cmnDlg.messageBox(msg,"ok","stop",window);
		return false;
	}
	
	return true;
}

