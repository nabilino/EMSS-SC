/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/dialogs/txtdefault.js,v 1.3.6.3.16.2 2012/08/08 12:48:49 jomeli Exp $ */
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
var ctlNode=null

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
	var txtVal = wndArguments[1]
	sourceWnd = wndArguments[2]
	oFormDef=sourceWnd.myDoc.xmlDoc
	ctlNode=oFormDef.selectSingleNode("//fld[@id='"+wndArguments[3].id+"']")

	// select intial value/radio button
	if (txtVal.substr(0,4)=="knb_")
		rbKey.checked=true
	else if (txtVal.substr(0,4)=="fld_")
		rbField.checked=true
	else if (txtVal.substr(0,11)=="LAW_WEB_USR")
		rbUserEnv.checked=true
	else if (txtVal=="@TD")
		rbDate.checked=true
	else if (txtVal=="CCT")
		rbTime.checked=true
	else
		rbLiteral.checked=true

	if(!oFormDef)
	{
		rbKey.disabled = true
		rbField.disabled = true
		rbDate.disabled = true
		rbTime.disabled = true
	}

	defRadioClick()
	txtValue.value = wndArguments[1]
	document.body.style.visibility="visible"
	btnOK.focus()
}

//-----------------------------------------------------------------------------
function defOnKeyPress()
{
	var evtCaught=false;

	if (khdlOKCancel(event))
		evtCaught=true;
	else if (event.srcElement.id=="txtValue" && rbLiteral.checked==true)
	{
		if (event.keyCode==34)	// double qoute
		{
			event.keyCode=0;
			evtCaught=true;
		}
	}

	if (evtCaught)
	{
		event.cancelBubble=true;
		event.returnValue=false;
	}
	return (evtCaught);	
}

//-----------------------------------------------------------------------------
function defSelect()
{
	if(oFormDef)
	{
		if (ctlNode.getAttribute("ed") == "upper" && rbLiteral.checked==true)
			txtValue.value=txtValue.value.toUpperCase()
	}

	window.returnValue=txtValue.value

	// all done
	window.close()
}

//-----------------------------------------------------------------------------
function defRadioClick()
{
	// clear any list items
	while(selassigned.options.length > 0)
		selassigned.options.remove(selassigned.options.length-1)
	selassigned.disabled=true

	if (rbField.checked)
	{
		defBuildFieldList()
		selassigned.disabled=false
		txtValue.value="fld_"
		if (selassigned.selectedIndex != -1)
			txtValue.value+=selassigned.options[selassigned.selectedIndex].text
		txtValue.disabled=true
	}
	else if (rbKey.checked)
	{
		defBuildKeyList()
		selassigned.disabled=false
		txtValue.value="knb_"
		if (selassigned.selectedIndex != -1)
			txtValue.value+=selassigned.options[selassigned.selectedIndex].text
		txtValue.disabled=true
	}
	else if (rbUserEnv.checked)
	{
		defBuildEnvList()
		selassigned.disabled=false
		txtValue.value="LAW_WEB_USR."
		if (selassigned.selectedIndex != -1)
			txtValue.value+=selassigned.options[selassigned.selectedIndex].text
		txtValue.disabled=true
	}
	else if (rbLiteral.checked)
	{
		txtValue.disabled=false
		txtValue.value=""
	}
	else if (rbTime.checked)
	{
		txtValue.value="CCT"
		txtValue.disabled=true
	}
	else	// if (rbDate.checked)
	{
		txtValue.value="@TD"
		txtValue.disabled=true
	}
}

//-----------------------------------------------------------------------------
function defBuildFieldList()
{
	var fldArray=new Array()
	var nodes=null
	var formNode=oFormDef.selectSingleNode("//form")
	var rtntype=formNode.getAttribute("rtntype")
	if (!rtntype || rtntype=="ALL")
		nodes = oFormDef.selectNodes("//fld[@nbr]")
	else
		nodes = oFormDef.selectNodes("//fld[@nbr and @rtn='1']")

	var len=nodes ? nodes.length : 0;
	for (var i=0; i < len; i++)
	{
		var tp = nodes[i].getAttribute("tp")
		if ( tp!="label" && tp!="labelHidden" && tp!="rect")
		{
		 	var fldObj = new Object
			fldObj.nm=nodes[i].getAttribute("nm")
			fldObj.nbr=nodes[i].getAttribute("nbr")
			fldArray[fldArray.length]=fldObj
		}
	}

	len=fldArray.length
	if (!len) return;
	fldArray.sort(nameSort)

	for (var i=0; i < len; i++)
	{
	 	var oOption = document.createElement("option")
		oOption.text=fldArray[i].nm
		oOption.value=fldArray[i].nbr
		if (("fld_" + oOption.text)==txtValue.value)
			oOption.selected=true
	 	selassigned.add(oOption)
	}
}

//-----------------------------------------------------------------------------
function nameSort(a,b)
{
	var aText=a.nm.toLowerCase()
	var bText=b.nm.toLowerCase()
	if (aText < bText) return (-1);
	if (aText == bText) return (0);
	if (aText > bText) return (1);
}

//-----------------------------------------------------------------------------
function defBuildKeyList()
{
	var nodes = oFormDef.selectNodes("//fld[@keynbr]")

	for (var i=0; i<nodes.length; i++)
	{
		var strVal = nodes[i].attributes.getNamedItem("keynbr").text
		if(strVal != "")
		{
			var oOption = document.createElement("option")
			oOption.text=strVal
			oOption.value=strVal
			if (oOption.value==txtValue.value.substr(4))	// 'knb_'
				oOption.selected=true
			selassigned.add(oOption)
		}
	}
}

//-----------------------------------------------------------------------------
function defBuildEnvList()
{
	var envArray=new Array()

	var nodes=studioWnd.designStudio.profile.selectNodes("/PROFILE/ATTRIBUTES/ATTR")
	var len=nodes ? nodes.length : 0;
	for (var i=0; i < len; i++)
		envArray[envArray.length]=nodes[i].getAttribute("name")

	len=envArray.length
	if (!len) return;
	envArray.sort()

	for (var i=0; i < len; i++)
	{
	 	var oOption = document.createElement("option")
		oOption.text=envArray[i]
		oOption.value="not used"
		if (("LAW_WEB_USR." + oOption.text)==txtValue.value)
			oOption.selected=true
	 	selassigned.add(oOption)
	}
}

//-----------------------------------------------------------------------------
function defOnSelectChange()
{
	if(rbUserEnv.checked==true)
		txtValue.value="LAW_WEB_USR." + selassigned.options[selassigned.selectedIndex].text
	else if(rbKey.checked==true)
		txtValue.value="knb_"+selassigned.options[selassigned.selectedIndex].value
	else if(rbField.checked==true)
		txtValue.value="fld_"+selassigned.options[selassigned.selectedIndex].text
}
