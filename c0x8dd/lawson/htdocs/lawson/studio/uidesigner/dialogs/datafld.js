/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/dialogs/datafld.js,v 1.3.6.5.16.2 2012/08/08 12:48:49 jomeli Exp $ */
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

var studioWnd=null;
var sourceWnd=null;
var oFormDef=null;
var oFldDOM=null;
var trNode=null;
var ctlNode=null;
var keyBuff="";

//-----------------------------------------------------------------------------
function dfInit()
{
	if (wndArguments == null || typeof(wndArguments) == "undefined")
	{
		// can't use messageBox here: it will also fail
		alert(msgDOMAIN);
		window.close();
		return;
	}
	studioWnd = wndArguments[0]
	txtValue.value = wndArguments[1]
	sourceWnd = wndArguments[2]
	oFormDef=sourceWnd.myDoc.xmlDoc

	if (wndArguments[4] && wndArguments[4].nodeName == "tabregion")
	{
		// tab fields
		trNode=wndArguments[4];
		oFormDef=wndArguments[5];
		dfBuildTabList();
	}
	else
	{
		ctlNode=oFormDef.selectSingleNode("//*[@id='"+wndArguments[3].id+"']")
		oFldDOM=wndArguments[4];
		dfBuildDomList();
	}

	document.body.style.visibility="visible"
	btnOK.focus()
}

//-----------------------------------------------------------------------------
function dfBuildDomList()
{
	var bFound=false;
	var fldArray=new Array()
	var fldNodes= (oFldDOM && oFldDOM.documentElement != null) ? oFldDOM.documentElement.childNodes : null;
	var len=(fldNodes ? fldNodes.length : 0);

	var bRtnOnly = false
	var rtntype=oFormDef.selectSingleNode("//form").getAttribute("rtntype")
	if (rtntype)
		bRtnOnly = (rtntype == "SEL") ? true : false

	// build array of fields to sort
	for (var i=0; i < len; i++ )
	{
		if (bRtnOnly)
		{
			if ( fldNodes[i].getAttribute("rtn") == "0" ) continue;

			// must check against current form node as well
			var fNode = oFormDef.selectSingleNode("//*[@nbr='"+fldNodes[i].getAttribute("nbr")+"']")
			if ( fNode && fNode.getAttribute("rtn") == "0" ) continue
		}

		if (fldNodes[i].getAttribute("nm") == "")
			continue;

		var output=(fldNodes[i].getAttribute("isxlt") == null) ? "" : " (OUTPUT)"
		fldArray[fldArray.length]=fldNodes[i].getAttribute("nm") + output + "/" + fldNodes[i].getAttribute("nbr")
		if (txtValue.value == fldNodes[i].getAttribute("nm"))
			bFound=true;		// should happen only for pushes?
	}

	// add the 'none' choide
	var oOption = document.createElement("option")
	oOption.text = "None"
	oOption.value = "none"
	selFieldList.add(oOption)
	if (txtValue.value=="")
		oOption.selected=true

	// add choice for current selection?
	if (!bFound && txtValue.value != "")
	{
		oOption = document.createElement("option")
		oOption.text = txtValue.value
		oOption.value = ctlNode.getAttribute("nbr")
		selFieldList.add(oOption)
		oOption.selected=true
	}

	len=fldArray.length
	if (!len) return;
	fldArray.sort()

	for (var i=0; i < len; i++ )
	{
		var oOption = document.createElement("option")
		var pos=fldArray[i].indexOf("/")
		oOption.text=fldArray[i].substr(0,pos)
		oOption.value=fldArray[i].substr(pos+1)
		
		if (txtValue.value!="" && oOption.text==txtValue.value)
			oOption.selected=true
		selFieldList.add(oOption)
	}
	return;
}

//-----------------------------------------------------------------------------
function dfBuildTabList()
{
	var fldArray=new Array()
	var fldNodes=trNode.selectNodes("child::tab/fld[@tp='TabHidden']");	
	var len=(fldNodes ? fldNodes.length : 0);

	// build array of fields to sort
	for (var i=0; i < len; i++ )
	{
		if (fldNodes[i].getAttribute("nm") == "")
			continue;
		fldArray[fldArray.length]=
				fldNodes[i].getAttribute("nm") + "/" + fldNodes[i].getAttribute("nbr")
	}

	// add the 'none' choide
	var oOption = document.createElement("option")
	oOption.text = "None"
	oOption.value = "none"
	selFieldList.add(oOption)
	if (txtValue.value=="")
		oOption.selected=true
	else
	{
		oOption = document.createElement("option")
		oOption.text = txtValue.value
		oOption.value = wndArguments[3];
		selFieldList.add(oOption)
		oOption.selected=true
	}

	len=fldArray.length
	if (!len) return;
	fldArray.sort()

	for (var i=0; i < len; i++ )
	{
		var oOption = document.createElement("option")
		var pos=fldArray[i].indexOf("/")
		oOption.text=fldArray[i].substr(0,pos)
		oOption.value=fldArray[i].substr(pos+1)
		
		if (txtValue.value!="" && oOption.text==txtValue.value)
			oOption.selected=true
		selFieldList.add(oOption)
	}
	return;
}

//-----------------------------------------------------------------------------
function dfOnBodyKeyPress()
{
	var evtCaught=false;
	if (event.keyCode == 27)
	{
		window.close()
		return;
	}
	else if (event.srcElement.id == "btnFind")
	{
		if ( event.keyCode != 13 && khdlOKCancel(event))
			evtCaught=true;
	}
	else if (event.srcElement.id == "selFieldList")
	{
		if (event.keyCode != 9)
		{
			if ( event.keyCode == 13 || event.keyCode == 32 )
			{
				evtCaught=true;
				var selIndex=selFieldList.selectedIndex
				if (selIndex != -1)
					txtValue.value=selFieldList.options[selIndex].value
				dfOnSelectChange()
				if ( event.keyCode == 13 )
					btnOK.click()
			}
			else
			{
				keyBuff=String.fromCharCode(event.keyCode)
				keyBuff=keyBuff.toUpperCase()
				if ( dfFindDatasrc() )
				{
					txtValue.value=keyBuff
					txtValue.focus()
					evtCaught=true;
				}
			}
		}
	}
 	else if (event.srcElement.id == "txtValue")
 	{
		if (event.keyCode==32)		// space
		{
			event.keyCode=0
 			keyBuff=txtValue.value.toUpperCase()
	 		if ( dfFindDatasrc() )
			{
				evtCaught=true;
			 	selFieldList.focus()
				dfOnSelectChange()
			}
		}
	}
 	else if (event.srcElement.id == "txtFind")
 	{
		if (event.keyCode==13)		// enter
		{
			btnFind.focus()
			btnFind.click()
			evtCaught=true;
		}
	}

	if (evtCaught)
	{
		event.cancelBubble=true
		event.returnValue=false
	}
	return (!evtCaught);
}

//-----------------------------------------------------------------------------
function dfSelect()
{
	var selIndex=selFieldList.selectedIndex
	if (selIndex == -1) return;		// shouldn't happen

	window.returnValue=selFieldList.options[selIndex].value + "/" + selFieldList.options[selIndex].text
	if (txtValue.value=="")
		window.returnValue = ""

	// all done
	window.close()
}

//-----------------------------------------------------------------------------
function dfOnSelectChange()
{
	btnProps.disabled=false;
	txtValue.value = selFieldList.options[selFieldList.selectedIndex].text
	if (txtValue.value=="None")
	{
		txtValue.value=""
		btnProps.disabled=true;
	}
}

//-----------------------------------------------------------------------------
function dfOnTextKeyPress()
{
	// make all lowercase letters uppercase
	if (event.keyCode > 96 && event.keyCode < 123)
		event.keyCode -= 32
}

//-----------------------------------------------------------------------------
function dfFieldProperty()
{
	var selIndex=selFieldList.selectedIndex
	if (selIndex == -1 || selIndex == 0) return;

 	var frmArgs = new Array()
 	frmArgs[0]=studioWnd
 	frmArgs[1]=oFormDef.selectSingleNode("//*[@nbr='"+selFieldList.options[selIndex].value+"']")

	var htmPath=studioWnd.studioPath+"/uidesigner/dialogs/attributes.htm"
	var strFeatures="dialogHeight:380px;dialogWidth:280px;center:yes;help:no;scroll:no;status:no;"

	showModalDialog(htmPath, frmArgs, strFeatures)
}

//-----------------------------------------------------------------------------
function dfFind()
{
	var start = (selFieldList.selectedIndex==-1) ? 0 : selFieldList.selectedIndex+1
	var srch = txtFind.value.toUpperCase()
	var len = selFieldList.options.length
	
	// search from current position to end of list
	for ( var i = start; i < len; i++ )
	{
		var text=selFieldList.options[i].text.toUpperCase()
		if ( text.indexOf(srch) != -1 )
		{
			selFieldList.selectedIndex = i
			selFieldList.focus()
			dfOnSelectChange()
			return true;
		}
	}

	// didn't find: search from beginning of list
	for ( var i = 0; i < start; i++ )
	{
		var text=selFieldList.options[i].text.toUpperCase()
		if ( text.indexOf(srch) != -1 )
		{
			selFieldList.selectedIndex = i
			selFieldList.focus()
			dfOnSelectChange()
			return true;
		}
	}
	return false;
}

//-----------------------------------------------------------------------------
function dfFindDatasrc()
{
	var start = (selFieldList.selectedIndex==-1) ? 0 : selFieldList.selectedIndex+1
	var len = selFieldList.options.length

	for ( var i = start; i < len; i++ )
	{
		if ( selFieldList.options[i].text.substr(0, keyBuff.length).toUpperCase() == keyBuff )
		{
			selFieldList.selectedIndex = i
			return true;
		}
	}

	// didn't find: search from beginning of list
	for ( var i = 0; i < start; i++ )
	{
		if ( selFieldList.options[i].text.substr(0, keyBuff.length).toUpperCase() == keyBuff )
		{
			selFieldList.selectedIndex = i
			return true;
		}
	}

	selFieldList.selectedIndex = -1
	return false
}
