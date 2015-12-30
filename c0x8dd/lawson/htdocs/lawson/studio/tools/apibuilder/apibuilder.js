/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/tools/apibuilder/apibuilder.js,v 1.10.2.7.4.5.6.3.4.6 2012/08/08 12:48:55 jomeli Exp $ */
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

var cgiIDAPath="/cgi-lawson/ida.exe";
var drillBookPath="/cgi-lawson/drillbook.exe";
var getTokensPath="/cgi-lawson/gettokens.exe";
var xpressPath="/servlet/Xpress";

var arrCritConj=("&,|").split(",");
var arrCritConjDesc=("and,or").split(",");
var arrCritOper=("=,!=,<,<=,>,>=,~,!~").split(",");
var arrCritOperDesc=("equals,not equal to,less than,less than or equal to"
	+",greater than,greater than or equal to,contains within,does not contain"
	).split(",");

var apiLoaded=false;
var apiWindows=null;
var arrFields=null;
var arrUserEnv=null;
var drillbookApi="";
var drillbookXml="";
var critEdit=null;
var formDef=null;
var formXML=null;
var gAlpha=false;
var gJavaScript=false; // display javascript api button?
var gMethod="";
var gMax=0;
var gPDL="";
var gDataArea="";
var gQuery="";
var gSYS="";
var gTABLE="";
var gTKN="";
var gSepHtml="<div class='apLinkLabel'>&nbsp;&gt;&nbsp;</div>";
var gPDLHtml="";
var gSYSHtml="";;
var gTABLEHtml="";
var gTKNHtml="";
var gHidden=true;
var MAX_FIELD_COUNT=150;
var MAX_KEYS=50;
var MAX_SELECT=1024;
var AGS_OUT_XML="&_OUT=XML";
var DME_OUT_XML="&OUT=XML";
var maxCrit=null;
var studioWnd=null;
var xmlRootNode=null;
var strApiType="";
var xmlApiDoc=null;
var xmlTempDoc=null;
var gProjects=null;

//-----------------------------------------------------------------------------
function apiInit()
{
	studioWnd=(window.opener ? window.opener : (wndArguments
		&& wndArguments.length?wndArguments[0]:null))
	if(studioWnd==null)
	{
		window.close()
		return
	}
	servicesPath=studioWnd.servicesPath
	portalPath=studioWnd.portalPath

	xmlTempDoc=studioWnd.xmlFactory.createInstance("DOM")
	xmlTempDoc.async=false

	formXML=studioWnd.xmlFactory.createInstance("DOM")
	formXML.async=false

	var strApiXml="<?xml version=\"1.0\"?><APICALL></APICALL>"
	xmlApiDoc=studioWnd.xmlFactory.createInstance("DOM")
	xmlApiDoc.async=false
	xmlApiDoc.loadXML(strApiXml)
	xmlRootNode=xmlApiDoc.selectSingleNode("//APICALL")

	if(!window.opener
		&& wndArguments
		&& wndArguments.length)
	{
		// dialog
		strApiType=wndArguments[1]
		if(wndArguments[2])
		{
			apiRenderPDLs(strApiType)
			switch (strApiType)
			{
			case "ags":
				idaTitle.style.display = "none"
				idaTitle.style.visibility = "hidden"
				dmeTitle.style.display = "none"
				dmeTitle.style.visibility = "hidden"
				setAgsQuery(wndArguments[2])
				break
			case "dme":
				agsTitle.style.display = "none"
				agsTitle.style.visibility = "hidden"
				idaTitle.style.display = "none"
				idaTitle.style.visibility = "hidden"
				setDmeQuery(wndArguments[2])
				break
			case "ida":
				agsTitle.style.display = "none"
				agsTitle.style.visibility = "hidden"
				dmeTitle.style.display = "none"
				dmeTitle.style.visibility = "hidden"
				setIdaQuery(wndArguments[2])
				break
			}
			apiBuildQuery(false)
			apiDiv.disabled=true
		}
		else
			setDefaultVals(wndArguments[2],wndArguments[3])

		// no xml graph return
		btnXmlGraphApi.style.visibility="hidden"
		btnXmlGraphApi.style.display="none"
		btnJavascriptApi.style.visibility="hidden"
		btnJavascriptApi.style.display="none"
		btnPortalApi.style.visibility="hidden"
		btnPortalApi.style.display="none"
	}
	else
	{
		// normal window
		btnOK.style.visibility="hidden"
		btnOK.style.display="none"
		cancelTitle.firstChild.nodeValue="Close"
		cancelTitle.title="Close"
		btnCancel.value="Close"
		if (!gJavaScript)
		{
			btnJavascriptApi.style.visibility="hidden"
			btnJavascriptApi.style.display="none"
		}
	}
	apiResize()
	document.body.style.visibility="visible"
	document.body.focus()
	apiWindows=new Array()
	apiLoaded=true
}

//-----------------------------------------------------------------------------
function apiUnload()
{
	var len=apiWindows.length
	for (var i=len-1;i>=0;i--)
	{
		try
		{
			if (apiWindows[i] && !apiWindows[i].closed)
				apiWindows[i].close()
		}
		catch (e)
		{
		}
	}
}

//-----------------------------------------------------------------------------
function apiBlockSelect()
{
	return false
}

//-----------------------------------------------------------------------------
function apiBuildAPI(bReturn)
{
	var tp=xmlApiDoc.selectSingleNode("APICALL").getAttribute("type");
	switch (tp)
	{
	case "ags":
		apiBuildAPIAGS(bReturn);
		break;
	case "dme":
		apiBuildAPIDME(bReturn);
		break;
	case "ida":
		apiBuildAPIIDA(bReturn);
		break;
	}
}

//-----------------------------------------------------------------------------
function apiBuildAPIAGS(bReturn)
{
	var script=""

	var xmlPdlNode=xmlApiDoc.selectSingleNode("//PDL")
	var xmlTokenNode=xmlApiDoc.selectSingleNode("//TOKEN")
	var xmlMethod=xmlApiDoc.selectSingleNode("//METHOD")
	if (xmlPdlNode && xmlTokenNode && xmlMethod)
	{
		// to create query string
		apiBuildQueryAGS(false)

		var funcName="AGS" + gTKN.replace(/\./g,"_");
		var strAction=(xmlMethod?xmlMethod.getAttribute("action"):"")
		var eventApi=(xmlMethod?
			((strAction=='A')?"ADD":"CHG")
			:"")

		var agsScript = studioWnd.portalPath + "/content/scripts/ags.js";
		var tmScript = studioWnd.portalPath + "/content/scripts/timemachine.js";
		script="<SCRIPT src=\"" + agsScript + "\" language=\"JavaScript\"></SCR" + "IPT>\n"
			+"<SCRIPT src=\"" + tmScript + "\" language=\"JavaScript\"></SCR" + "IPT>\n"
			+"<SCRIPT language=\"JavaScript\">\n"
			+"function " + funcName + "()\n"
			+"{\n"
			+"    // here is a javascript-built direct api query string\n"
		;

		// build constructed query
		script+="    var agsConstruct=new AGSConstruct(\"" + gDataArea + "\", \"" + gTKN + "\");\n"
			+"    agsConstruct.method=\"GET\";\n"
			+"    agsConstruct.out=\"XML\";\n"
			+"    agsConstruct.lfn=\"ALL\";\n"
			+"    agsConstruct.rtn=\"DATA\";\n"
			+(strAction?"    agsConstruct.setField(\"FC\",\"" + strAction + "\");":"")
		;

		// fields
		var arrElements=xmlApiDoc.selectNodes("//TABLEELEMENT");
		var strElements="";
		var len=(arrElements?arrElements.length:0);
		for(var i=0;i<len;i++)
		{
			var x=arrElements[i];
			var nm=x.getAttribute("nm");
			var oc=x.getAttribute("oc");
			var r=x.getAttribute("r");
			var id=nm+(oc?(parseInt(oc)+1):"")+(r?("r"+r):"");
			var esc=escape(x.text);
			script+="    agsConstruct.setField";
			if (esc!=x.text)
				script+="(\"" + id + "\",unescape(\"" + escape(x.text) + "\"));\n";
			else
				script+="(\"" + id + "\",\"" + x.text + "\");\n";
		}

		// show constructed query
		script+="    var agsConstructQuery=agsConstruct.getQuery();\n"
			+"    var ret=\"<b>Constructed Query:</b>\\n\" + agsConstructQuery + \"\\n\";\n";
			+"\n"
		;

		// show direct query
		script+="    // here is the direct api query string\n"
			+"    var agsQuery=\"" + gQuery + "\";\n"
			+"    ret+=\"<b>Direct Query:</b>\\n\"+agsQuery+\"\\n\";\n"
			+"    var agsRequest=new AGSRequest(\"GET\",agsQuery);\n"
			+"    var agsResponse=agsRequest.getResponse();\n"
			+"\n"
			+"    if (agsResponse.error)\n"
			+"    {\n"
			+"        alert(agsResponse.error);\n"
			+"        return \"\";\n"
			+"    }\n"
			+"\n"

		// number of fields
			+"    var nbrFields=agsResponse.getNbrFields();\n"
			+"    ret+=\"<b>Number of Fields returned:</b> \"+nbrFields+\"\\n\";\n"
			+"\n"
			+"    var fldnbr=agsResponse.fldnbr;\n"
			+"    var msgnbr=agsResponse.msgnbr;\n"
			+"    var message=agsResponse.message;\n"
			+"    ret+=\"<b>FldNbr, MsgNbr, Message:</b> \" + fldnbr + \",\" + msgnbr + \",\" + message + \"\\n\";\n"
			+"    ret+=\"\\n\";\n"
			+"\n"
		;

		var script1="    // here is one method of using the response data\n"
			+"    ret+=\"<b>Data Method 1:</b>\\n\";\n"
			+"    timeMachine=new TimeMachine();\n"
			+"    var ts1=timeMachine.begin(\"data1\");\n"
			+"    ret+=\"<b>Field-Name, Field-Value:</b>\\n\";\n"
			+"    var arrNames=agsResponse.getFieldNames();\n"
			+"    var lenNames=(arrNames?arrNames.length:0);\n"
			+"    for (var i=0;i<lenNames;i++)"
			+"    {\n"
			+"        var n=arrNames[i];\n"
			+"        var v=agsResponse.getFieldValue(n);\n"
			+"        ret+=n + \":\" + v + \"\\n\";\n"
			+"    }\n"
			+"    ret+=\"\\n\\n\";\n"
			+"    ts1.end();\n"
			+"    ret+=\"<b>Time Method 1:</b> \"+ts1.computeTime()+\"ms\\n\\n\";\n"
			+"\n"
		;

		var script2="    // here is a second method of using the response data\n"
			+"    ret+=\"<b>Data Method 2:</b>\\n\";\n"
			+"    var ts2=timeMachine.begin(\"data2\");\n"
			+"    ret+=\"<b>Field-Name, Field-Value:</b>\\n\";\n"
			+"    for (var i=0;i<nbrFields;i++)"
			+"    {\n"
			+"        var n=agsResponse.atName(i);\n"
			+"        var v=agsResponse.atValue(i);\n"
			+"        ret+=n + \":\" + v + \"\\n\";\n"
			+"    }\n"
			+"    ts2.end();\n"
			+"    ret+=\"<b>Time Method 2:</b> \"+ts2.computeTime()+\"ms\\n\\n\";\n"
			+"\n"
		;

		script += script1 + script2
			+"    return ret;\n"
			+"}\n"
			+"document.writeln(\"<PRE>\"+" + funcName + "()+\"</PRE>\");\n"
			+"document.close();\n"
			+"</SCR"+"IPT>\n"
		;
	}
	if(bReturn)
	{
		window.returnValue=script;
		close();
	}
	else
	{
		apiDiv.value=script;
		btnTestApi.disabled=true;
	}
}

//-----------------------------------------------------------------------------
function apiBuildAPIDME(bReturn)
{
	var script=""

	var xmlPdl=xmlApiDoc.selectSingleNode("//PDL")
	var xmlSys=xmlApiDoc.selectSingleNode("//SYSTEMCODE")
	var xmlFile=xmlApiDoc.selectSingleNode("//DATATABLE")
	if (xmlPdl && xmlSys && xmlFile)
	{
		// to create query string
		apiBuildQueryDME(false)

		// fields
		var arrXmlFields=xmlFile.selectNodes("//TABLEELEMENT")
		var strField=""
		var len=(arrXmlFields?arrXmlFields.length:0)
		for (var i=0;i<len;i++)
			strField += arrXmlFields[i].text + ";"

		var funcName="DME" + gTABLE;

		var dmeScript = studioWnd.portalPath + "/content/scripts/dme.js";
		var tmScript = studioWnd.portalPath + "/content/scripts/timemachine.js";
		script="<SCRIPT src=\"" + dmeScript + "\" language=\"JavaScript\"></SCR" + "IPT>\n"
			+"<SCRIPT src=\"" + tmScript + "\" language=\"JavaScript\"></SCR" + "IPT>\n"
			+"<SCRIPT language=\"JavaScript\">\n"
			+"function " + funcName + "()\n"
			+"{\n"
			+"    var dmeQuery=\""+gQuery+"\";\n"
			+"    var ret=\"<b>Query:</b>\\n\"+dmeQuery+\"\\n\";\n"
			+"    var dmeRequest=new DMERequest(dmeQuery);\n"
			+"    var dmeResponse=dmeRequest.getResponse();\n"
			+"\n"
			+"    if (dmeResponse.error)\n"
			+"    {\n"
			+"        alert(dmeResponse.error);\n"
			+"        return \"\";\n"
			+"    }\n"
			+"\n"

		// number of records, columns
			+"    var nbrRecs=dmeResponse.getNbrRecs();\n"
			+"    ret+=\"<b>Number of records returned:</b> \"+nbrRecs+\"\\n\";\n"
			+"\n"
			+"    var nbrCols=dmeResponse.getNbrColumns();\n"
			+"    ret+=\"<b>Number of columns returned:</b> \"+nbrCols+\"\\n\";\n"
			+"\n"

		// display columns
			+"    ret+=\"<b>Columns:</b>\\n\";\n"
			+"    var arrOccs=new Array();\n"
			+"    for (var c=0;c<nbrCols;c++)"
			+"    {\n"
			+"        var n=dmeResponse.getColumnDspName(c);\n"
			+"        var t=dmeResponse.getColumnType(c);\n"
			+"        var s=dmeResponse.getColumnSize(c);\n"
			+"        arrOccs[c]=dmeResponse.getColumnOcc(c);\n"
			+"        ret+=(c>0?\",\":\"\") + n + \"(\"+ t + \":\" + s + \")\";\n"
			+"    }\n"
			+"    ret+=\"\\n\\n\";\n"
			+"\n"
		;

		// data method 1
		var script1=
			 "    ret+=\"<b>Data Method 1:</b>\\n\";\n"
			+"    timeMachine=new TimeMachine();\n"
			+"    var ts1=timeMachine.begin(\"data1\");\n"
			+"    var dmeDoc = dmeResponse.getDoc();\n"
			+"    var arrRows = dmeDoc.getElementsByTagName(\"COLS\");\n"
			+"    var lenRows = arrRows.length;\n"
			+"    var isIE = top.lawsonPortal.browser.isIE;\n"
			+"    var isNS = top.lawsonPortal.browser.isNS;\n"
			+"    for (var r=0;r<lenRows;r++)\n"
			+"    {\n"
			+"        var arrFields = arrRows[r].getElementsByTagName(\"COL\");\n"
			+"        var lenFields = arrFields.length;\n"
			+"        for (var c=0;c<lenFields;c++)\n"
			+"        {\n"
			+"            var val=\"\";\n"
			+"            if (arrOccs[c]>-1)\n"
			+"            {\n"
			+"                ret+=(c>0?\",\":\"\")+\"[\";\n"
			+"                for (var occ=0;occ<arrOccs[c];occ++)\n"
			+"                {\n"
			+"                    var val=dmeResponse.getRecordValue(r,c,occ);\n"
			+"                    ret+=(occ>0?\",\":\"\") + val;\n"
			+"                }\n"
			+"                ret+=\"]\";\n"
			+"            }\n"
			+"            else\n"
			+"            {\n"
			+"                if (isIE)\n"
			+"                {\n"
			+"                    val=arrFields[c].firstChild.nodeValue;\n"
			+"                }\n"
			+"                else if (isNS)\n"
			+"                {\n"
			+"                    for (var k=0;k<arrFields[c].childNodes.length;k++)\n"
			+"                    {\n"
			+"                        if (arrFields[c].childNodes[k].nodeType==4)\n"
			+"                        {\n"
			+"                            val = arrFields[c].childNodes[k].nodeValue;\n"
			+"                            break;\n"
			+"                        }\n"
			+"                    }\n"
			+"                }\n"
			+"            }\n"
			+"            ret+=(c>0?\",\":\"\") + val;\n"
			+"        }\n"
			+"        ret+=\"\\n\";\n"
			+"    }\n"
			+"    ts1.end();\n"
			+"    ret+=\"<b>Time Method 1:</b> \"+ts1.computeTime()+\"ms\\n\\n\";\n"
		;

		// data method 2 - faster
		var script2=
			 "    ret+=\"<b>Data Method 2:</b>\\n\";\n"
			+"    var ts2=timeMachine.begin(\"data2\");\n"
			+"    for (var r=0;r<nbrRecs;r++)\n"
			+"    {\n"
			+"        for (var c=0;c<nbrCols;c++)\n"
			+"        {\n"
			+"            if (arrOccs[c]>-1)\n"
			+"            {\n"
			+"                ret+=(c>0?\",\":\"\")+\"[\";\n"
			+"                for (var occ=0;occ<arrOccs[c];occ++)\n"
			+"                {\n"
			+"                    var val=dmeResponse.getRecordValue(r,c,occ);\n"
			+"                    ret+=(occ>0?\",\":\"\") + val;\n"
			+"                }\n"
			+"                ret+=\"]\";\n"
			+"            }\n"
			+"            else\n"
			+"            {\n"
			+"                var val=dmeResponse.getRecordValue(r,c);\n"
			+"                ret+=(c>0?\",\":\"\") + val;\n"
			+"            }\n"
			+"        }\n"
			+"        ret+=\"\\n\";\n"
			+"    }\n"
			+"    ts2.end();\n"
			+"    ret+=\"<b>Time Method 2:</b> \"+ts2.computeTime()+\"ms\\n\\n\";\n"
			+"\n"
		;

		script+=script1+script2
			+"    return ret;\n"
			+"}\n"
			+"document.writeln(\"<PRE>\"+" + funcName + "()+\"</PRE>\");\n"
			+"document.close();\n"
			+"</SCR"+"IPT>\n"
		;
	}
	if(bReturn)
	{
		window.returnValue=script;
		close();
	}
	else
	{
		apiDiv.value=script;
		btnTestApi.disabled=true;
	}
}

//-----------------------------------------------------------------------------
function apiBuildAPIIDA(bReturn)
{
	var script=""

	var xmlParentNode=xmlApiDoc.selectSingleNode("//DRILL")
	if (!xmlParentNode)
		return
	var xmlKeysNode=xmlParentNode.selectSingleNode("KEYS")
	var strTitle=xmlParentNode.getAttribute("title")
	var strKey=xmlParentNode.getAttribute("key")
	var selStr="//DRILL[@title='"
		+ studioWnd.xmlEncodeString(strTitle) + "' and @key='"
		+ studioWnd.xmlEncodeString(strKey) + "']/DRILLKEY/KEY"
	;
	var drillKeyNodes=xmlTempDoc.selectNodes(selStr)
	if (xmlParentNode)
	{
		// to create query string
		apiBuildQueryIDA(false)

		var funcName="IDA" + gTKN.replace(/\./g,"_");
		var idaScript = studioWnd.portalPath + "/content/scripts/ida.js";
		var tmScript = studioWnd.portalPath + "/content/scripts/timemachine.js";
		script="<SCRIPT src=\"" + idaScript + "\" language=\"JavaScript\"></SCR" + "IPT>\n"
			+"<SCRIPT src=\"" + tmScript + "\" language=\"JavaScript\"></SCR" + "IPT>\n"
			+"<SCRIPT language=\"JavaScript\">\n"
			+"function " + funcName + "()\n"
			+"{\n"
			+"    // here is a javascript-built direct api query string\n"
		;

		// build constructed query
		script+="    var idaConstruct=new IDAConstruct(\"" + gDataArea + "\", \"" + gSYS + "\");\n"
			+"    idaConstruct.out=\"XML\";\n"
		;

		// show direct query
		script+="    // here is the direct api query string\n"
			+"    var idaQuery=\"" + gQuery + "\";\n"
			+"    var ret=\"<b>Direct Query:</b>\\n\"+idaQuery+\"\\n\";\n"
			+"    var idaRequest=new IDARequest(idaQuery);\n"
			+"    var idaResponse=idaRequest.getResponse();\n"
			+"\n"
			+"    if (idaResponse.error)\n"
			+"    {\n"
			+"        alert(idaResponse.error);\n"
			+"        return \"\";\n"
			+"    }\n"
			+"\n"
		;

		// number of records, columns
		script+="    var nbrRecs=dmeResponse.getNbrRecs();\n"
			+"    ret+=\"<b>Number of records returned:</b> \"+nbrRecs+\"\\n\";\n"
			+"\n"
			+"    var nbrCols=dmeResponse.getNbrColumns();\n"
			+"    ret+=\"<b>Number of columns returned:</b> \"+nbrCols+\"\\n\";\n"
			+"\n"
		;

		// response xml
		script+="   var idaXML=idaResponse.resDoc.documentElement.xml;\n"
		//	+"   ret+=\"<b>Response:</b>\\n<textarea style=\\\"width:100%;height:300px;\\\"\"\n"
		//	+"   +\"overflow:auto;\\\" WRAP=\\\"physical\\\">\" + idaXML + \"</textarea>\";\n"
		//	+"\n"
		;

		script+="    return ret;\n"
			+"}\n"
			+"document.writeln(\"<PRE>\"+" + funcName + "()+\"</PRE>\");\n"
			+"document.close();\n"
			+"</SCR"+"IPT>\n"
		;
	}
	if(bReturn)
	{
		window.returnValue=script;
		close();
	}
	else
	{
		apiDiv.value=script;
		btnTestApi.disabled=true;
	}
}

//-----------------------------------------------------------------------------
function apiBuildPortalQuery()
{
	// build normal query
	apiBuildQuery()

	var tp=xmlApiDoc.selectSingleNode("APICALL").getAttribute("type")
	var contentURL=studioWnd.portalPath + "/content.htm?_TYPE="
		+tp.toUpperCase()+"&_URL=" + gQuery
	var portalURL=studioWnd.portalPath + "/index.htm?_URL=" + escape(contentURL)
	apiDiv.value=portalURL
}

//-----------------------------------------------------------------------------
function apiBuildProjects(names)
{
	var len=(names?names.length:0);
	if(!len) return;

	apiInitializeProjects(names);
	apiSetDataAreaProjects();
}

//-----------------------------------------------------------------------------
function apiInitializeProjects(names)
{
	gProjects=new Array();

	var len=(names?names.length:0);
	for(var i=0;i<len;i++)
	{
		project = new Object();
		project.name = names[i];
		project.isDataArea = false;
		project.productLine = names[i];

		gProjects[gProjects.length] = project;
	}
}

//-----------------------------------------------------------------------------
function apiSetDataAreaProjects()
{
	// get the dataareas
	var xmlDoc = studioWnd.SSORequest(studioWnd.DMEPath+"?PROD=GEN&FILE=PROJECT" + DME_OUT_XML);
	if (!xmlDoc || xmlDoc.status)
	{
		var msg="Error calling engine "+studioWnd.DMEPath+"."
		if (xmlDoc)
			msg+=studioWnd.getHttpStatusMsg(xmlDoc.status) + 
				"\nServer response: "+xmlDoc.statusText + " (" + xmlDoc.status + ")\n\n"
		studioWnd.cmnDlg.messageBox(msg,"ok","stop",window)
		return;
	}

	// reflect dataareas in projects
	var nodes=xmlDoc.selectNodes("//COLS");
	var len=(nodes?nodes.length:0);
	for(var i=0;i<len;i++)
	{
		var childLen=(nodes[i].childNodes?nodes[i].childNodes.length:0);
		if (childLen && childLen>2)
		{
			var pdl=studioWnd.trim(nodes[i].childNodes[0].text);
			var dataArea=studioWnd.trim(nodes[i].childNodes[1].text);
			apiSetDataArea(dataArea, pdl);
		}
	}
}

//-----------------------------------------------------------------------------
function apiGetProject(name)
{
	var len=(gProjects?gProjects.length:0);
	for(var i=0;i<len;i++)
	{
		if (gProjects[i].name == name)
			return gProjects[i];
	}
	return null;
}

//-----------------------------------------------------------------------------
function apiIsDataArea(name)
{
	var project=apiGetProject(name);
	return (project?project.isDataArea:false);
}

//-----------------------------------------------------------------------------
function apiSetDataArea(dataArea, pdl)
{
	var project=apiGetProject(dataArea);
	if (project)
	{
		project.isDataArea=true;
		project.productLine=pdl;
	}
}

//-----------------------------------------------------------------------------
function apiBuildQuery(bReturn, graph)
{
	var tp=xmlApiDoc.selectSingleNode("APICALL").getAttribute("type")
	switch (tp)
	{
	case "ags":
		apiBuildQueryAGS(bReturn)
		break
	case "dme":
		apiBuildQueryDME(bReturn,graph)
		break
	case "ida":
		apiBuildQueryIDA(bReturn)
		break
	}
}

//-----------------------------------------------------------------------------
function apiBuildQueryAGS(bReturn)
{
	var api=""
	var xmlPdlNode=xmlApiDoc.selectSingleNode("//PDL")
	var xmlTokenNode=xmlApiDoc.selectSingleNode("//TOKEN")
	var xmlMethod=xmlApiDoc.selectSingleNode("//METHOD")
	if (xmlPdlNode && xmlTokenNode && xmlMethod)
	{
		// fields
		var arrElements=xmlApiDoc.selectNodes("//TABLEELEMENT")
		var strElements=""
		var len=(arrElements?arrElements.length:0)
		for(var i=0;i<len;i++)
		{
			var x=arrElements[i];
			var nm=x.getAttribute("nm");
			var oc=x.getAttribute("oc");
			var r=x.getAttribute("r");
			var id=nm+(oc?(parseInt(oc)+1):"")+(r?("r"+r):"");
			strElements+=(i>0?"&":"") + id + "=" + escape(x.text);
		}
		var strAction=(xmlMethod?xmlMethod.getAttribute("action"):"");
		var eventApi=(xmlMethod?
			((strAction=='A')?"ADD":"CHG")
			:"");

		// full api
		gQuery="_PDL=" + xmlPdlNode.firstChild.text
			+"&_TKN=" + xmlTokenNode.firstChild.text
			+"&_LFN=ALL&_RTN=DATA&_TDS=IGNORE" + AGS_OUT_XML
			+(eventApi ? "&_EVT="+eventApi : "")
			+(strAction ? "&FC=" + strAction : "")
			+(strElements ? "&" + strElements : "")
			+"&_EOT=TRUE"
		api=studioWnd.AGSPath + "?" + gQuery
	}
	if(bReturn)
	{
		var objAgs = new Object()
		objAgs.pdl = xmlPdlNode.firstChild.text
		objAgs.sys = xmlApiDoc.selectSingleNode("//SYSTEMCODE").getAttribute("systemcode")
		objAgs.tkn =  xmlTokenNode.firstChild.text
		objAgs.fc = strAction
		objAgs.fields = strElements
		objAgs.query = api
		window.returnValue=objAgs
		close()
	}
	else
	{
		apiDiv.value=api
		btnTestApi.disabled=false
	}
}

//-----------------------------------------------------------------------------
function apiBuildQueryDME(bReturn, graph)
{
	var api=""
	var xmlPdl=xmlApiDoc.selectSingleNode("//PDL")
	var xmlSys=xmlApiDoc.selectSingleNode("//SYSTEMCODE")
	var xmlFile=xmlApiDoc.selectSingleNode("//DATATABLE")
	if (xmlPdl && xmlSys && xmlFile)
	{
		// fields
		var arrFields=xmlFile.selectNodes("//TABLEELEMENT")
		var strField=""
		var len=(arrFields?arrFields.length:0)
		if (len>MAX_FIELD_COUNT)
		{
			var	msg="Too many fields requested\nCurrent Length: "
				+len+"\nMaximum Length: "+MAX_FIELD_COUNT
			studioWnd.cmnDlg.messageBox(msg,"ok","stop",window)
			return
		}
		for (var i=0;i<len;i++)
			strField += arrFields[i].text + ";"

		// related tables
		var arrXmlRelTables=xmlFile.selectNodes("//RELATEDTABLE")
		var strRelField=""
		len=(arrXmlRelTables?arrXmlRelTables.length:0)
		for (var j=0;j<len;j++)
		{
			var tbl=arrXmlRelTables[j].firstChild.text
			var arrXmlRelFields=arrXmlRelTables[j].selectNodes("FIELD")
			var lenFields=(arrXmlRelFields?arrXmlRelFields.length:0)
			for (var k=0;k<lenFields;k++)
				strRelField += tbl + "." + arrXmlRelFields[k].text + ";"
		}

		// indices/keys
		var strIndex=""
		var strKeys=""
		var xmlIndex=xmlApiDoc.selectSingleNode("//INDEX")
		if(xmlIndex)
		{
			// index
			strIndex="&INDEX=" + xmlIndex.getAttribute("index")
			var arrayIndexInfo=indexInfo.getElementsByTagName("input")

			// xml - delete keys
			var xmlKeysNode=xmlIndex.selectSingleNode("KEYS")
			if(xmlKeysNode)
				xmlIndex.removeChild(xmlKeysNode)

			// xml - add keys
			xmlKeysNode=xmlApiDoc.createNode(1,"KEYS","")
			xmlIndex.appendChild(xmlKeysNode)
			len=(arrayIndexInfo?arrayIndexInfo.length:0)
			var indCount=0
			if (len)
			{
				if (len>MAX_KEYS)
				{
					var	msg="Too many key fields\nCurrent Length: "
						+len+"\nMaximum Length: "+MAX_KEYS
					studioWnd.cmnDlg.messageBox(msg,"ok","stop",window)
					return
				}
				strKeys+="&KEY"
				for(var n=0;n<len;n++)
				{
					var ind=(arrayIndexInfo[n].value?arrayIndexInfo[n].value:"")
					if(ind)
						indCount++
					strKeys += "=" + ind
					// xml - add
					var xmlNode=xmlApiDoc.createNode(1,"KEY","")
					xmlNode.setAttribute("name",arrayIndexInfo[n].id.substr(3))
					var cDataNode=xmlApiDoc.createNode(4, "cdata","")
					cDataNode.text=ind
					xmlNode.appendChild(cDataNode)
					xmlKeysNode.appendChild(xmlNode)
				}
			}
			// only add to string if data filled in
			strKeys=(indCount?strKeys:"")
		}

		// criteria
		var strCrit=""
		var xmlCriterionNodes=xmlApiDoc.selectNodes("//CRITERION")
		len=(xmlCriterionNodes?xmlCriterionNodes.length:0)
		if(len)
		{
			for(var n=0;n<len;n++)
			{
				var cNode=xmlCriterionNodes[n]
				var conj=cNode.getAttribute("conj")
				conj=(conj?conj:"")
				var field=cNode.getAttribute("field")
				field=(field?field:"")
				var oper=cNode.getAttribute("oper")
				oper=(oper?oper:"")
				var type=cNode.getAttribute("type")
				type=(type?type:"")
				var igcase=cNode.getAttribute("igcase")
				igcase=(igcase?igcase:"")
				if (field && oper && type)
				{
					var value=cNode.firstChild.text
					value = value.replace(/ /g,"+")
					strCrit += escape(conj) + field
						+ (igcase=="1"?"^":"") 
						+ escape(oper)
						+ (type=="UserEnv"?"<<":"")
						+ value
						+ (type=="UserEnv"?">>":"")
				}
			}
		}
		if (strCrit)
		{
			var len=strCrit.length
			if (len>MAX_SELECT)
			{
				var	msg="Select Portion is too long\nActual Length: "
					+len+"\nMaximum Length: "+MAX_SELECT
				studioWnd.cmnDlg.messageBox(msg,"ok","stop",window)
				return
			}
			strCrit="&SELECT="+strCrit
		}

		// max
		var strMax=(gMax?"&MAX=" + gMax:"")

		// x params
		var strX=( window.opener
				? ("&XCOLS="+(cbXCols.checked?"TRUE":"FALSE")
					+"&XKEYS="+(cbXKeys.checked?"TRUE":"FALSE")
					+"&XRELS="+(cbXRels.checked?"TRUE":"FALSE")
					+"&XCOUNT="+(cbXCount.checked?"TRUE":"FALSE")
					+"&XIDA="+(cbXIDA.checked?"TRUE":"FALSE"))
				: "" );

		// full api
		gQuery="PROD=" + xmlPdl.firstChild.text
			+"&FILE=" + xmlFile.firstChild.text
			+(strField||strRelField?
				("&FIELD=" + strField + strRelField):"")
			+strMax + strIndex + strKeys + strCrit + strX
			+"&OUT=" + (graph?
				("xmlgraph&_XSL=" + portalPath + "/pages/pvxmlchart_VBAR.xsl"):"XML")
		api=studioWnd.DMEPath + "?" + gQuery
	}
	if(bReturn)
	{
		var objApi = new Object()
		objApi.pdl=xmlPdl.firstChild.text
		objApi.sys=xmlSys.getAttribute("systemcode")
		objApi.file=xmlFile.firstChild.text
		objApi.fields=strField + strRelField
		objApi.index=(xmlIndex?xmlIndex.getAttribute("index"):"")
		objApi.keys=(strKeys?strKeys.substring(strKeys.indexOf("&KEY=")+5):"")
		objApi.max=gMax
		objApi.query=api
		objApi.strCrit=strCrit
		window.returnValue=objApi
		close()
	}
	else
	{
		apiDiv.value=api
		btnTestApi.disabled=false
	}
}

//-----------------------------------------------------------------------------
function apiBuildQueryIDA(bReturn)
{
	gQuery="";

	var xmlParentNode=xmlApiDoc.selectSingleNode("//DRILL")
	if (!xmlParentNode)
		return;
	var xmlKeysNode=xmlParentNode.selectSingleNode("KEYS")
	if(xmlKeysNode)
		xmlParentNode.removeChild(xmlKeysNode)
	var strTitle=xmlParentNode.getAttribute("title")
	var strKey=xmlParentNode.getAttribute("key")
	var selStr="//DRILL[@title='"
		+ studioWnd.xmlEncodeString(strTitle) + "' and @key='"
		+ studioWnd.xmlEncodeString(strKey) + "']/DRILLKEY/KEY"
	var drillKeyNodes=xmlTempDoc.selectNodes(selStr)
	var len=(drillKeyNodes?drillKeyNodes.length:0)
	if(len)
	{
		var xmlNode=xmlApiDoc.createNode(1,"KEYS","")
		for(var n=0;n<len;n++)
		{
			var keyNode=xmlApiDoc.createNode(1,"KEY","")
			var xmlAtt=xmlApiDoc.createAttribute("keynum")
			xmlAtt.text=drillKeyNodes[n].getAttribute("keynum")
			keyNode.attributes.setNamedItem(xmlAtt)
			xmlAtt=xmlApiDoc.createAttribute("name")
			xmlAtt.text=drillKeyNodes[n].text
			keyNode.attributes.setNamedItem(xmlAtt)
			var xid="txt" + drillKeyNodes[n].getAttribute("keynum")
			var xElem=document.getElementById(xid)
			keyNode.text=xElem.value
			xmlNode.appendChild(keyNode)
		}
		xmlParentNode.appendChild(xmlNode)
	}

	// full api
	gQuery=(xmlApiDoc.selectSingleNode("//DRILL").firstChild.text)
	var i=gQuery.indexOf("?")
	if (i>-1)
		gQuery=gQuery.substring(i+1)
	var keysNode=xmlApiDoc.selectSingleNode("//KEYS")
	if(keysNode!=null)
	{
		var keyNodes=keysNode.selectNodes("KEY")
		var len=(keyNodes?keyNodes.length:0)
		for (var n=0;n<len;n++)
		{
			gQuery+=(n>0? "&":"")
				+ keyNodes[n].getAttribute("keynum") + "="
				+ escape(keyNodes[n].firstChild.text)
		}
	}
	api=studioWnd.IDAPath + "?" + gQuery
	if(bReturn)
	{
		var apiReturn = new Object()
		apiReturn.pdl = xmlApiDoc.selectSingleNode("//PDL").firstChild.text
		apiReturn.sys = xmlApiDoc.selectSingleNode("//SYSTEMCODE").getAttribute("systemcode")
		apiReturn.tkn = xmlApiDoc.selectSingleNode("//TOKEN").firstChild.text
		apiReturn.drill = xmlApiDoc.selectSingleNode("//DRILL").getAttribute("title")
		apiReturn.keys = new Array()
		var keys = xmlApiDoc.selectNodes("//KEY")
		var len = (keys?keys.length:0)
		for(var n=0; n<len; n++)
		{
			var key = new Object()
			key.keynum = keys[n].getAttribute("keynum")
			key.name = keys[n].getAttribute("name")
			key.value = keys[n].firstChild.text
			apiReturn.keys[n] = key
		}
		apiReturn.query = api
		window.returnValue=apiReturn
		close()
	}
	else
	{
		apiDiv.value=api
		btnTestApi.disabled=false
	}
}

//-----------------------------------------------------------------------------
function apiCancel()
{
	if(!window.opener)
		window.returnValue=null
	close()
}

//-----------------------------------------------------------------------------
function apiClickBack()
{
	generalInfo.style.display="block"
	generalInfo.style.visibility="visible"
	detailInfo.style.visibility="hidden"
	detailInfo.style.display="none"
}

//-----------------------------------------------------------------------------
function apiClickDrill(x)
{
	// remove old drill
	var xmlParentNode=xmlApiDoc.selectSingleNode("//TOKEN")
	var xmlDrillNode=xmlParentNode.selectSingleNode("DRILL")
	if(xmlDrillNode)
		xmlParentNode.removeChild(xmlDrillNode)

	// add new drill
	var xmlNode=xmlApiDoc.createNode(1,"DRILL","")
	var cDataNode=xmlApiDoc.createNode(4, "cdata", "")
	cDataNode.text=x.idacall
	xmlNode.appendChild(cDataNode)
	var xmlAtt=xmlApiDoc.createAttribute("title")
	xmlAtt.text=x.id
	xmlNode.attributes.setNamedItem(xmlAtt)
	var xmlAtt=xmlApiDoc.createAttribute("key")
	xmlAtt.text=x.key
	xmlNode.attributes.setNamedItem(xmlAtt)
	xmlParentNode.appendChild(xmlNode)

	// disable old drill
	var properties=drill.getElementsByTagName("div")
	var len=(properties?properties.length:0)
	for(n=0;n<len;n++)
		properties[n].style.fontWeight="normal"
	x.style.fontWeight="bold"

	apiRenderSpecialHtml("reqDrillKeys",x)

	reqDrillKeys.style.visibility="visible"
	reqDrillKeys.style.display="block"
	reqDrillKeysLabel.style.visibility="visible"
	reqDrillKeysLabel.style.display="block"

	btnBuildQuery.disabled=false
	btnOK.disabled=false
	apiDiv.value=""

	if(!window.opener)
	{
		btnCancel.style.display="block"
		btnCancel.style.visibility="visible"
	}
}

//-----------------------------------------------------------------------------
function apiClickField(x)
{
	// hide fields
	selElem.innerHTML=""

	var xmlSysCode=xmlApiDoc.selectSingleNode("//SYSTEMCODE")
	var xmlTokenNode=xmlSysCode.selectSingleNode("//TOKEN")
	var xmlParentNode=xmlTokenNode.selectSingleNode("//TABLEELEMENTS")
	if(x.style.fontWeight!="bold")
	{
		// select field
		x.style.fontWeight="bold"

		// xml - add
		if(!xmlParentNode)
		{
			xmlParentNode=xmlApiDoc.createNode(1,"TABLEELEMENTS","")
			xmlTokenNode.appendChild(xmlParentNode)
		}

		xmlTableElem=xmlParentNode.selectSingleNode("*[@id='" + x.formId + "']")
		if(!xmlTableElem)
		{
			var xmlChildNode=xmlApiDoc.createNode(1,"TABLEELEMENT","")
			xmlChildNode.setAttribute("id",x.id)
			xmlChildNode.setAttribute("nm",x.nm)
			if(x.r)
				xmlChildNode.setAttribute("r",x.r)
			if(x.oc)
				xmlChildNode.setAttribute("oc",x.oc)
			var cDataNode=xmlApiDoc.createNode(4, "cdata","")
			xmlChildNode.appendChild(cDataNode)
			xmlParentNode.appendChild(xmlChildNode)
		}
	}
	else
	{
		// deselect field
		x.style.fontWeight="normal"

		// xml - delete
		if(xmlParentNode)
		{
			var xmlTableElem=xmlParentNode.selectSingleNode("*[@id='" + x.id + "']")
			if(xmlTableElem)
				xmlParentNode.removeChild(xmlTableElem)
		}
	}

	// display field
	var htm=""
	var properties=formProps.getElementsByTagName("div")
	var focusElementId=""
	var len=(properties?properties.length:0)
	for(var n=0;n<len;n++)
	{
		if(properties[n].style.fontWeight=="bold")
		{
			var xpath="//fld[@nm='"	+ properties[n].nm
				+ (properties[n].oc?("' and @oc='" + properties[n].oc):"")
				+ "']"
			var fld=formXML.selectSingleNode(xpath)
			if(fld)
			{
				var req=fld.getAttribute("req")
				var tp=fld.getAttribute("tp").toLowerCase()
				var sz=fld.getAttribute("sz")
				var node=xmlApiDoc.selectSingleNode("//*[@id='" + properties[n].id + "']")
				if(node)
				{
					var val=node.firstChild.text
					var nm=node.getAttribute("nm")
					var oc=node.getAttribute("oc")
					var r=node.getAttribute("r")
					var txt=nm+(r?("r"+r):"")+(req?" *":"")
					var id='inp_' + node.getAttribute("id")
					htm+='<label for="' + id + '" class="'
						+ (tp=="hidden"?"apLabelInputHidden":"apLabelInput")
						+ '" onselectstart="apiBlockSelect()">' + txt + '</label><br/>'
						+'<input type="text" class="apTextBox" id="'
						+ id + '"' +' value="' + val + '"'
						+' size="' + sz + '" maxlength="' + sz + '" onkeyup="apiUpdate(this)" style="display:block;" />'
					if(properties[n].id==x.id)
						focusElementId=id
				}
			}
		}
	}
	selElem.innerHTML=htm
	selElem.scrollTop=0


	// focus field
	if(focusElementId)
	{
		var focusElement=document.getElementById(focusElementId)
		if(focusElement)
			focusElement.focus()
	}
}

//-----------------------------------------------------------------------------
function apiClickIndex(x)
{
	// hide divs
	indexInfo.innerHTML=""

	// xml - delete
	var xmlSysCode=xmlApiDoc.selectSingleNode("//SYSTEMCODE")
	var xmlDataTableNode=xmlSysCode.selectSingleNode("//DATATABLE")
	var xmlIndexNode=xmlDataTableNode.selectSingleNode("INDEX")
	if(xmlIndexNode)
		xmlDataTableNode.removeChild(xmlIndexNode)

	if(x.style.fontWeight!="bold")
	{
		// select index
		var arr=indices.getElementsByTagName("div")
		len=(arr?arr.length:0)
		for(var n=0;n<len;n++)
			arr[n].style.fontWeight=(arr[n]==x?"bold":"normal")

		// xml - add
		xmlIndexNode=xmlApiDoc.createNode(1,"INDEX","")
		xmlIndexNode.setAttribute("id",x.id)
		xmlIndexNode.setAttribute("index",x.fldId)
		xmlDataTableNode.appendChild(xmlIndexNode)

		// get index fields
		var parms="PROD=GEN&FILE=FILEINDFLD&INDEX=FIFSET1&KEY=" + gPDL + "="
			+ gTABLE+"=" + x.innerHTML + DME_OUT_XML + "&FIELD=FLDNAME"
		if (!apiLoadDocument(studioWnd.DMEPath,parms,'indexInfo'))
			return

		// display index fields
		indexInfoLabel.style.visibility="visible"
		indexInfoLabel.style.display="block"
		indexInfo.style.visibility="visible"
		indexInfo.style.display="block"

		// focus in first index field
		arr=indexInfo.getElementsByTagName("input")
		if(arr && arr.length)
			arr[0].focus()
	}
	else
	{
		// deselect index
		x.style.fontWeight="normal"
		return false
	}
}

//-----------------------------------------------------------------------------
function apiClickMethod(x)
{
	// update route
	gMethod=((x.fontWeight=="bold")?"":x.id)

	// select method - requires gMethod
	apiSelectMethod()

	// xml - delete
	var xmlParentNode=xmlApiDoc.selectSingleNode("//TOKEN")
	var xmlNode=xmlParentNode.selectSingleNode("//METHOD")
	if(xmlNode)
		xmlParentNode.removeChild(xmlNode)

	// xml - add
	if (gMethod)
	{
		xmlNode=xmlApiDoc.createNode(1,"METHOD","")
		xmlNode.setAttribute("id",gMethod)
		xmlNode.setAttribute("action",x.action)
		xmlParentNode.appendChild(xmlNode)
	}
}

//-----------------------------------------------------------------------------
function apiClickPDL(x)
{
	// hide divs
	generalInfo.style.display="block"
	generalInfo.style.visibility="visible"
		tokensLabel.style.visibility="hidden"
		tokensLabel.style.display="none"
		tokens.style.visibility="hidden"
		tokens.style.display="none"
		tablesLabel.style.visibility="hidden"
		tablesLabel.style.display="none"
		tables.style.visibility="hidden"
		tables.style.display="none"
	detailInfo.style.display="none"
	detailInfo.style.visibility="hidden"

	// update pdls
	var arr=pdls.getElementsByTagName("div")
	var len=(arr?arr.length:0)
	for(var n=0;n<len;n++)
		arr[n].style.fontWeight=(arr[n]==x?"bold":"normal")

	// update route
	gDataArea=x.fldId;
	gPDL=(apiIsDataArea(x.fldId)?apiGetProject(x.fldId).productLine:x.fldId);

	gPDLHtml="<div id='" + gDataArea
		+ "' title='Product Line' class='apLinkLabel'"
		+' onselectstart="apiBlockSelect()"'
		+">" + gDataArea + "</div>"
	divRoute.innerHTML=gPDLHtml

	// xml - delete
	var xmlPdlNode=xmlRootNode.selectSingleNode("//PDL")
	if(xmlPdlNode)
		xmlRootNode.removeChild(xmlPdlNode)

	// xml - add
	var xmlNode=xmlApiDoc.createNode(1,"PDL","")
	xmlNode.setAttribute("id",x.id)
	var cDataNode=xmlApiDoc.createNode(4, "cdata","")
	cDataNode.text=gDataArea;
	xmlNode.appendChild(cDataNode)
	xmlRootNode.appendChild(xmlNode)

	// get sys
	syss.innerHTML=""
	var parms="PROD=GEN&FILE=SYSTEM&FIELD=SYSTEMCODE;SYSNAME&INDEX=STMSET1"
		+"&KEY=" + gPDL + DME_OUT_XML + "&MAX=1000"
	if (!apiLoadDocument(studioWnd.DMEPath,parms,"syss"))
		return

	// display sys
	syssLabel.style.visibility="visible"
	syssLabel.style.display="block"
	syss.style.visibility="visible"
	syss.style.display="block"

	switch (strApiType)
	{
	case "ags":
	case "ida":
		// get tokens
		tokens.innerHTML=""

		// display tokens
		tokensLabel.style.display="block"
		tokensLabel.style.visibility="visible"
		tokens.style.display="block"
		tokens.style.visibility="visible"
		break
	case "dme":
		// get tables
		tables.innerHTML=""

		// display tables
		tablesLabel.style.display="block"
		tablesLabel.style.visibility="visible"
		tables.style.display="block"
		tables.style.visibility="visible"
		break
	}
}

//-----------------------------------------------------------------------------
function apiClickRelElement(relTableId,relField)
{
	if (!relTableId || !relField)
		return

	// deselect rel field
	if(relField.style.fontWeight=="bold")
	{
		apiDelRelElement(relTableId,relField)
		return
	}

	// select rel field
	relField.style.fontWeight="bold"

	// add li info
	var lastChild=document.getElementById(relTableId).lastChild
	var htm="<li id='" + document.uniqueID + "'"
		+ " fieldname='" + relField.fldId + "'"
		+ " onclick='apiDelRelElement(\"" + relTableId + "\","
		+ "document.getElementById(\"" + relField.id + "\"))'>"
		+ relField.fldId + "</li>"
	lastChild.insertAdjacentHTML("beforeEnd",htm)
	lastChild.style.display="block"

	// xml - add
	var xmlParentNode=xmlApiDoc.selectSingleNode("//*[@id='" + relTableId + "']")
	if (!xmlParentNode)
		return
	var xmlNode=xmlParentNode.selectSingleNode("*[@id='" + relField.id + "']")
	if(!xmlNode)
	{
		xmlNode=xmlApiDoc.createNode(1,"FIELD","")
		xmlNode.setAttribute("id",relField.id)
		var cDataNode=xmlApiDoc.createNode(4, "cdata","")
		cDataNode.text=relField.fldId
		xmlNode.appendChild(cDataNode)
		xmlParentNode.appendChild(xmlNode)
	}
}

//-----------------------------------------------------------------------------
function apiClickRelTable(x)
{
	// hide divs
	relElements.innerHTML=""

	// deselect rel field
	if(x.style.fontWeight=="bold")
	{
		x.style.fontWeight="normal"
		return
	}

	// select rel table
	apiSelectRelTable(x.id)

	// display rel elements
	relElements.innerHTML=""
	var parms="PROD=GEN&FILE=FILEFLD&INDEX=FFLSET1&KEY=" + gPDL + "="
		+ x.fldId + DME_OUT_XML + "&FIELD=FLDNAME&MAX=1000&SELECT=ISGROUP^%3D0"
	if (!apiLoadDocument(studioWnd.DMEPath,parms,'relElements',x.id))
		return

	// xml - add
	var xmlDataTableNode=xmlApiDoc.selectSingleNode("//DATATABLE")
	var xmlParentNode=xmlDataTableNode.selectSingleNode("//RELATEDTABLES")
	if(!xmlParentNode)
	{
		var xmlNode=xmlApiDoc.createNode(1,"RELATEDTABLES","")
		xmlParentNode=xmlDataTableNode.appendChild(xmlNode)
	}
	var xmlRelTable=xmlParentNode.selectSingleNode("*[@id='" + x.id + "']")
	if(!xmlRelTable)
	{
		xmlRelTable=xmlApiDoc.createNode(1,"RELATEDTABLE","")
		xmlRelTable.setAttribute("id",x.id)
		var cDataNode=xmlApiDoc.createNode(4, "cdata","")
		cDataNode.text=x.relName
		xmlRelTable.appendChild(cDataNode)
		xmlParentNode.appendChild(xmlRelTable)
	}

	// select relElements
	var arr=relElements.getElementsByTagName("div")
	var len=(arr?arr.length:0)
	for (var i=0;i<len;i++)
	{
		if(xmlRelTable.selectSingleNode("./FIELD[@id='" + arr[i].id + "']"))
			arr[i].style.fontWeight="bold"
	}
}

//-----------------------------------------------------------------------------
function apiClickSys(x)
{
	// hide divs
	generalInfo.style.display="block"
	generalInfo.style.visibility="visible"
		tokensLabel.style.display="none"
		tokensLabel.style.visibility="hidden"
		tokens.style.display="none"
		tokens.style.visibility="hidden"
		tablesLabel.style.display="none"
		tablesLabel.style.visibility="hidden"
		tables.style.display="none"
		tables.style.visibility="hidden"
	detailInfo.style.display="none"
	detailInfo.style.visibility="hidden"

	// select sys
	gSYS=x.fldId.substr(0,2)
	apiSelectSys()

	// update route
	gSYSHtml="<div id='" + gSYS
		+' onselectstart="apiBlockSelect()"'
		+ "' title='System Code' class='apLinkLabel'>" + x.fldId + "</div>"
	divRoute.innerHTML=gPDLHtml + gSepHtml + gSYSHtml

	// xml - delete
	var xmlParentNode=xmlApiDoc.selectSingleNode("//PDL")
	var xmlSystemCodeNode=xmlParentNode.selectSingleNode("//SYSTEMCODE")
	if(xmlSystemCodeNode)
		xmlParentNode.removeChild(xmlSystemCodeNode)

	// xml - add
	var xmlNode=xmlApiDoc.createNode(1,"SYSTEMCODE","")
	xmlNode.setAttribute("id",x.id)
	xmlNode.setAttribute("systemcode",gSYS)
	var cDataNode=xmlApiDoc.createNode(4, "cdata", "")
	cDataNode.text=x.fldId
	xmlNode.appendChild(cDataNode)
	xmlParentNode.appendChild(xmlNode)

	switch (strApiType)
	{
	case "ags":
	case "ida":
		// get tokens
		tokens.innerHTML=""
		var parms=gDataArea + "&" + gSYS + DME_OUT_XML + "&ALL";
		if (!apiLoadDocument(getTokensPath,parms,'tokens'))
			return

		// display tokens
		tokensLabel.style.display="block"
		tokensLabel.style.visibility="visible"
		tokens.style.display="block"
		tokens.style.visibility="visible"
		break
	case "dme":
		// get tables
		tables.innerHTML=""
		var parms="PROD=GEN&FILE=FILEDEF&INDEX=FDFSET3&KEY=" + gPDL + "=" + gSYS
			+ "&FIELD=FILENAME" + DME_OUT_XML + "&MAX=1000";
		if (!apiLoadDocument(studioWnd.DMEPath,parms,'tables'))
			return

		// display tables
		tablesLabel.style.display="block"
		tablesLabel.style.visibility="visible"
		tables.style.display="block"
		tables.style.visibility="visible"
		break
	}
}

//-----------------------------------------------------------------------------
function apiClickTable(x)
{
	// hide divs
	generalInfo.style.display="none"
	generalInfo.style.visibility="hidden"
	detailInfo.style.display="none"
	detailInfo.style.visibility="hidden"
		apiHideDetailAGS()
		apiHideDetailDME()
		apiHideDetailIDA()
		
	// select table
	apiSelectTable(x.fldId)

	// update route
	gTABLE=x.fldId
	gTABLEHtml="<div id='" + gTABLE
		+' onselectstart="apiBlockSelect()"'
		+ "' title='Data Table' class='apLinkLabel'>" + gTABLE + "</div>"
	divRoute.innerHTML=gPDLHtml + gSepHtml + gSYSHtml + gSepHtml + gTABLEHtml

	// xml - delete
	var xmlSysCode=xmlApiDoc.selectSingleNode("//SYSTEMCODE")
	var xmlNode=xmlSysCode.selectSingleNode("//DATATABLE")
	if(xmlNode)
		xmlSysCode.removeChild(xmlNode)

	// xml - add
	xmlNode=xmlApiDoc.createNode(1,"DATATABLE","")
	xmlNode.setAttribute("id",x.id)
	var cDataNode=xmlApiDoc.createNode(4, "cdata", "")
	cDataNode.text=gTABLE
	xmlNode.appendChild(cDataNode)
	xmlSysCode.appendChild(xmlNode)

	// reset fields/indices/rel
	tableFlds.innerHTML=""
	indices.innerHTML=""
	relTables.innerHTML=""
	apiDiv.value=""
	var strCall="apiClickTable2()"
	if (apiLoaded)
		window.setTimeout(strCall,10)
	else
		eval(strCall)
}

//-----------------------------------------------------------------------------
function apiClickTable2()
{
	// get fields
	var parms="PROD=GEN&FILE=FILEFLD&INDEX=FFLSET1&KEY=" + gPDL + "=" + gTABLE
		+ DME_OUT_XML + "&FIELD=FLDNAME&MAX=1000&SELECT=ISGROUP^%3D0";
	if(!apiLoadDocument(studioWnd.DMEPath,parms,'tableFlds'))
		return

	// get indices
	parms="PROD=GEN&FILE=FILEIND&INDEX=INDSET1&KEY=" + gPDL + "=" + gTABLE
		+"&FIELD=INDEXNAME" + DME_OUT_XML + "&MAX=1000";
	if(!apiLoadDocument(studioWnd.DMEPath,parms,'indices'))
		return

	// get rel tables, elements
	parms="PROD=GEN&FILE=FILEREL&INDEX=FRLSET1&KEY=" +gPDL+"="+gTABLE
		+"&FIELD=RELFILE;RELNAME" + DME_OUT_XML + "&MAX=1000";
	if(!apiLoadDocument(studioWnd.DMEPath,parms,'relTables'))
		return

	// display fields/indices/rel
	detailInfo.style.display="block"
	detailInfo.style.visibility="visible"
		tableFldsLabel.style.display="block"
		tableFldsLabel.style.visibility="visible"
		tableFlds.style.display="block"
		tableFlds.style.visibility="visible"
		indicesLabel.style.display="block"
		indicesLabel.style.visibility="visible"
		indices.style.display="block"
		indices.style.visibility="visible"
		indexInfoLabel.style.display="block"
		indexInfoLabel.style.visibility="visible"
		indexInfo.style.display="block"
		indexInfo.style.visibility="visible"
		indexInfo.innerHTML=""
		relTablesLabel.style.display="block"
		relTablesLabel.style.visibility="visible"
		relTables.style.display="block"
		relTables.style.visibility="visible"
		relElementsLabel.style.display="block"
		relElementsLabel.style.visibility="visible"
		relElements.style.display="block"
		relElements.style.visibility="visible"
		relElements.innerHTML=""
		selApiSpanLabel.style.display="block"
		selApiSpanLabel.style.visibility="visible"
		selApiSpan.style.display="block"
		selApiSpan.style.visibility="visible"
		selCritList.selectedIndex=-1
		critFieldClear()
		critSelRefresh()
		critSelType()
		critSel()
		maxRecLabel.style.display="block"
		maxRecLabel.style.visibility="visible"
		maxRec.style.display="block"
		maxRec.style.visibility="visible"
		maxRec.value=""
		gMax=""
		if (window.opener)
		{
			xprmSpan.style.display="block"
			xprmSpan.style.visibility="visible"
			cbXCols.checked=true
			cbXKeys.checked=true
			cbXRels.checked=true
			cbXCount.checked=true
			cbXIDA.checked=true
			btnPortalApi.disabled=false
		}
		btnBuildQuery.disabled=false
		btnXmlGraphApi.disabled=false
		btnJavascriptApi.disabled=(gJavaScript?false:true)
		btnTestApi.disabled=true
		apiDiv.value=""
}

//-----------------------------------------------------------------------------
function apiClickTableField(x)
{
	var xmlSysCode=xmlApiDoc.selectSingleNode("//SYSTEMCODE")
	var xmlDataTableNode=xmlSysCode.selectSingleNode("//DATATABLE")
	var xmlParentNode=xmlDataTableNode.selectSingleNode("//TABLEELEMENTS")
	if(x.style.fontWeight!="bold")
	{
		// select table field
		x.style.fontWeight="bold"

		// xml - add
		if(!xmlParentNode)
		{
			xmlParentNode=xmlApiDoc.createNode(1,"TABLEELEMENTS","")
			xmlDataTableNode.appendChild(xmlParentNode)
		}
		var xmlTableElem=xmlParentNode.selectSingleNode("*[@id='" + x.id + "']")
		if(!xmlTableElem)
		{
			xmlTableElem=xmlApiDoc.createNode(1,"TABLEELEMENT","")
			xmlTableElem.setAttribute("id",x.id)
			var cDataNode=xmlApiDoc.createNode(4, "cdata","")
			cDataNode.text=x.fldId
			xmlTableElem.appendChild(cDataNode)
			xmlParentNode.appendChild(xmlTableElem)
		}
	}
	else
	{
		// deselect table field
		x.style.fontWeight="normal"

		// xml - delete
		if(xmlParentNode)
		{
			var xmlTableElem=xmlParentNode.selectSingleNode("*[@id='" + x.id + "']")
			if(xmlTableElem)
				xmlParentNode.removeChild(xmlTableElem)
		}
	}
}

//-----------------------------------------------------------------------------
function apiClickToken(x)
{
	// hide divs
	generalInfo.style.display="none"
	generalInfo.style.visibility="hidden"
	detailInfo.style.display="none"
	detailInfo.style.visibility="hidden"
		apiHideDetailAGS()
		apiHideDetailDME()
		apiHideDetailIDA()
		btnXmlGraphApi.disabled=true

	// select token
	apiSelectToken(x.token)

	// update route
	gTKN=x.token
	gTKNHtml="<div id='" + gTKN
		+' onselectstart="apiBlockSelect()"'
		+ "' title='Form' class='apLinkLabel'>" + gTKN + " " + x.title + "</div>"
	divRoute.innerHTML=gPDLHtml + gSepHtml + gSYSHtml + gSepHtml + gTKNHtml

	// xml - delete
	var xmlSysCode=xmlApiDoc.selectSingleNode("//SYSTEMCODE")
	var xmlNode=xmlApiDoc.selectSingleNode("//TOKEN")
	if(xmlNode)
		xmlSysCode.removeChild(xmlNode)

	// xml - add
	xmlNode=xmlApiDoc.createNode(1,"TOKEN","")
	xmlNode.setAttribute("id",x.id)
	xmlNode.setAttribute("title",x.innerHTML)
	var cDataNode=xmlApiDoc.createNode(4, "cdata", "")
	cDataNode.text=gTKN
	xmlNode.appendChild(cDataNode)
	xmlSysCode.appendChild(xmlNode)

	// get fields/drills
	var strCall=""
	switch (strApiType)
	{
	case "ags":
		formProps.innerHTML=""
		methods.innerHTML=""
		selElem.innerHTML=""
		btnBuildQuery.disabled=true
		btnOK.disabled=true
		apiDiv.value=""
		strCall="apiFormDef()"
		break
	case "ida":
		drill.innerHTML=""
		reqDrillKeys.innerHTML=""
		apiDiv.value=""
		strCall="apiDrillBook()"
		break
	}
	if (strCall)
	{
		if (apiLoaded)
			window.setTimeout(strCall,10)
		else
			eval(strCall)
	}
}

//-----------------------------------------------------------------------------
function apiDebug()
{
	var frmArgs=new Array()
	frmArgs[0]=xmlApiDoc.xml
	frmArgs[1]=formDef
	frmArgs[2]=drillbookApi
	frmArgs[3]=drillbookXml
	frmArgs[4]=xmlTempDoc.xml
	window.showModalDialog("apiabout.htm", frmArgs,
		"dialogHeight:500px;dialogWidth:700px;"
		+"edge:sunken;help:no;scroll:no;resizable:yes")
}

//-----------------------------------------------------------------------------
function apiDelField(x)
{
	// delete from relTables
	var par=x.parentElement
	par.removeChild(x)
	par.style.display="block"

	// delete from xml
	var xmlDeleteNode=xmlApiDoc.selectSingleNode("//*[@id='" + x.relFieldId + "']")
	if(xmlDeleteNode)
		xmlDeleteNode.parentNode.removeChild(xmlDeleteNode)

	// disable highlight from the relElements div
	var arr=relElements.getElementsByTagName("div")
	var len=(arr?arr.length:0)
	for (var i=0;i<len;i++)
	{
		if(arr[i].fldId==x.fieldname)
		{
			arr[i].style.fontWeight="normal"
			break
		}
	}
}

//-----------------------------------------------------------------------------
function apiDelRelElement(relTableId,relField)
{
	if (!relTableId || !relField)
		return

	// delete from the perspective of the relElements div
	relField.style.fontWeight="normal"

	// xml- delete
	var xmlRelTableNode=xmlApiDoc.selectSingleNode("//*[@id='" + relTableId + "']")
	if (!xmlRelTableNode)
		return
	var xmlDeleteNode=xmlRelTableNode.selectSingleNode("//*[@id='" + relField.id + "']")
	if(xmlDeleteNode)
		xmlDeleteNode.parentNode.removeChild(xmlDeleteNode)

	// delete from relTables
	var thisRelTable=document.getElementById(relTableId)
	var arr=(thisRelTable?thisRelTable.getElementsByTagName("li"):null)
	var len=(arr?arr.length:0)
	for (var i=0;i<len;i++)
	{
		if(arr[i].fieldname==relField.fldId)
		{
			var par=arr[i].parentElement
			par.removeChild(arr[i])
			// if no more children, hide the parent node
			par.style.display=(par.childNodes.length?"block":"none")
			break
		}
	}
}

//-----------------------------------------------------------------------------
function apiDoKeyPress()
{
	var b=false
  	if(event.altKey && event.ctrlKey && !event.shiftKey)
  	{
  		if(String.fromCharCode(event.keyCode)=="A")
		{
			apiDebug()
			b=true
		}
  	}
	else
	{
		switch (event.keyCode)
		{
		case keys.ESCAPE:
			// only close if dialog
			if(!window.opener)
			{
				window.returnValue=null
				close()
				b=true
			}
			break
		}
	}
	if(b)
		event.cancelBubble=true
}

//-----------------------------------------------------------------------------
function apiDrillBook()
{
	// get fields
	drill.innerHTML=""
	reqDrillKeys.innerHTML=""
	var strSys=xmlApiDoc.selectSingleNode("//SYSTEMCODE").getAttribute("systemcode")
	var parms="xml&"+ gDataArea +"&"+ strSys +"&"+ gTKN
	drillbookApi=drillBookPath + "?" + parms
	if (!apiLoadDocument(drillBookPath,parms,'drill'))
		return

	// display fields
	detailInfo.style.display="block"
	detailInfo.style.visibility="visible"
		drillLabel.style.display="block"
		drillLabel.style.visibility="visible"
		drill.style.display="block"
		drill.style.visibility="visible"
		reqDrillKeysLabel.style.display="block"
		reqDrillKeysLabel.style.visibility="visible"
		reqDrillKeys.style.display="block"
		reqDrillKeys.style.visibility="visible"

		btnBuildQuery.disabled=false
		btnPortalApi.disabled=true
		btnJavascriptApi.disabled=(gJavaScript?false:true)
		btnXmlGraphApi.disabled=true
		btnTestApi.disabled=true
}

//-----------------------------------------------------------------------------
function apiFormDef()
{
	// get fields
	formProps.innerHTML=""
	methods.innerHTML=""
	selElem.innerHTML=""

	// render fields
	apiFormFields()

	// display fields
	detailInfo.style.display="block"
	detailInfo.style.visibility="visible"
		formPropsLabel.style.display="block"
		formPropsLabel.style.visibility="visible"
		formPropsOptsSpan.style.display="block"
		formPropsOptsSpan.style.visibility="visible"
			cbAlpha.checked=gAlpha
			cbHidden.checked=gHidden
		formProps.style.display="block"
		formProps.style.visibility="visible"
		methodsLabel.style.display="block"
		methodsLabel.style.visibility="visible"
		methods.style.display="block"
		methods.style.visibility="visible"
		selElemLabel.style.display="block"
		selElemLabel.style.visibility="visible"
		selElem.style.display="block"
		selElem.style.visibility="visible"

		btnPortalApi.disabled=true
		btnJavascriptApi.disabled=true
		btnXmlGraphApi.disabled=true
		btnTestApi.disabled=true
}

//-----------------------------------------------------------------------------
function apiFormFields()
{
	var parms="_PDL=" + gDataArea + "&_TKN=" + gTKN + AGS_OUT_XML + "&_CUST=FALSE"
	if (!apiLoadDocument(xpressPath,parms,'formDef'))
		return

	// select fields
	var xmlSysCode=xmlApiDoc.selectSingleNode("//SYSTEMCODE")
	var xmlTokenNode=xmlSysCode.selectSingleNode("//TOKEN")
	var arr=formProps.getElementsByTagName("div")
	var len=(arr?arr.length:0)
	for (var i=0;i<len;i++)
	{
		var xpath="./TABLEELEMENTS/TABLEELEMENT[@id='" + arr[i].id + "']"
		if(xmlTokenNode.selectSingleNode(xpath))
			arr[i].style.fontWeight="bold"
	}
}

//-----------------------------------------------------------------------------
function apiHideDetailAGS()
{
	formPropsLabel.style.display="none"
	formPropsLabel.style.visibility="hidden"
	formPropsOptsSpan.style.display="none"
	formPropsOptsSpan.style.visibility="hidden"
	formProps.style.display="none"
	formProps.style.visibility="hidden"
	methodsLabel.style.display="none"
	methodsLabel.style.visibility="hidden"
	methods.style.display="none"
	methods.style.visibility="hidden"
	selElemLabel.style.visibility="hidden"
	selElemLabel.style.display="none"
	selElem.style.visibility="hidden"
	selElem.style.display="none"
}

//-----------------------------------------------------------------------------
function apiHideDetailDME()
{
	tableFldsLabel.style.display="none"
	tableFldsLabel.style.visibility="hidden"
	tableFlds.style.display="none"
	tableFlds.style.visibility="hidden"
	indicesLabel.style.visibility="hidden"
	indicesLabel.style.display="none"
	indices.style.visibility="hidden"
	indices.style.display="none"
	indexInfoLabel.style.visibility="hidden"
	indexInfoLabel.style.display="none"
	indexInfo.style.visibility="hidden"
	indexInfo.style.display="none"
	relTablesLabel.style.visibility="hidden"
	relTablesLabel.style.display="none"
	relTables.style.visibility="hidden"
	relTables.style.display="none"
	relElementsLabel.style.visibility="hidden"
	relElementsLabel.style.display="none"
	relElements.style.visibility="hidden"
	relElements.style.display="none"
	relElements.innerHTML=""
	maxRecLabel.style.visibility="hidden"
	maxRecLabel.style.display="none"
	maxRec.style.visibility="hidden"
	maxRec.style.display="none"
	selApiSpanLabel.style.visibility="hidden"
	selApiSpanLabel.style.display="none"
	selApiSpan.style.visibility="hidden"
	selApiSpan.style.display="none"
	xprmSpan.style.visibility="hidden"
	xprmSpan.style.display="none"
	critClickCancel()
}

//-----------------------------------------------------------------------------
function apiHideDetailIDA()
{
	drillLabel.style.display="none"
	drillLabel.style.visibility="hidden"
	drill.style.display="none"
	drill.style.visibility="hidden"
	reqDrillKeysLabel.style.display="none"
	reqDrillKeysLabel.style.visibility="hidden"
	reqDrillKeys.style.display="none"
	reqDrillKeys.style.visibility="hidden"
}

//-----------------------------------------------------------------------------
function apiLoadDocument(engine, parms, strDiv, strInfo)
{
	xmlTempDoc = studioWnd.SSORequest(engine+"?"+parms);
	if (!xmlTempDoc || xmlTempDoc.status)
	{
		var msg="Error calling engine "+engine+"."
		if (xmlTempDoc)
			msg+=studioWnd.getHttpStatusMsg(xmlTempDoc.status) + 
				"\nServer response: "+xmlTempDoc.statusText + " (" + xmlTempDoc.status + ")\n\n"
		studioWnd.cmnDlg.messageBox(msg,"ok","stop",window)
		xmlTempDoc = null
		return false
	}
	if (engine==drillBookPath)
		drillbookXml=xmlTempDoc.xml
	switch (strDiv)
	{
	case "pdls":
	case "syss":
	case "tables":
		return apiRenderSimpleHtml(strDiv)
		break
	default:
		return apiRenderSpecialHtml(strDiv, strInfo)
		break
	}
	return false
}

//-----------------------------------------------------------------------------
function apiGetUserEnv()
{
	arrUserEnv=new Array()
	var nodes=studioWnd.designStudio.profile.selectNodes("/PROFILE/ATTRIBUTES/ATTR")
	var len=(nodes ? nodes.length : 0);
	for (var i=0; i<len; i++)
		arrUserEnv[i]=nodes[i].getAttribute("name");
	if(arrUserEnv.length)
		arrUserEnv.sort()
}

//-----------------------------------------------------------------------------
function apiMenuHighlight()
{
	var curMenu=document.getElementById(strApiType+"title")
	var arr=apiButtons.getElementsByTagName("span")
	var len=(arr?arr.length:0)
	for (var i=0;i<len;i++)
		arr[i].style.fontWeight=(arr[i]==curMenu?"bold":"normal")
}

//-----------------------------------------------------------------------------
function apiRefreshFields()
{
	// refresh as if clicked on token again
	var arr=document.getElementById("tokens").getElementsByTagName("DIV")
	var x=null
	var len=(arr?arr.length:0)
	for (var i=0;i<len && !x;i++)
		if(arr[i].token=gTKN)
			x=arr[i]
	if(x)
	{
		// from apiClickToken
		var strCall="('"+x.id+"','"+x.token+"','"+x.title+"')"
		switch (strApiType)
		{
		case "ags":
			strCall="apiFormDef"+strCall
			break
		case "ida":
			strCall="apiDrillBook"+strCall
			break
		}
		if (strCall)
		{
			if (apiLoaded)
				window.setTimeout(strCall,10)
			else
				eval(strCall)
		}
	}
}

//-----------------------------------------------------------------------------
function apiRelField(table)
{
	// table contains the ids for the related element
	// 0 is the reltable
	// 1 is the relfield
	if(!table) return
	var sysTables=relTables.getElementsByTagName("div")
	var lenTables=(sysTables?sysTables.length:0)

	// select reltable
	for (var i=0;i<lenTables;i++)
	{
		if(sysTables[i].relName==table[0])
		{
			if(sysTables[i].style.fontWeight != "bold")
			{
				sysTables[i].scrollIntoView(false)
				sysTables[i].fireEvent("onclick")
			}
			// select relfield
			var sysFields=relElements.getElementsByTagName("div")
			var sysLen=(sysFields?sysFields.length:0)
			for (j=0;j<sysLen;j++)
			{
				if(sysFields[j].fldId==table[1])
				{
					sysFields[j].scrollIntoView(false)
					sysFields[j].fireEvent("onclick")
				}
			}
			break;
		}
	}
}
//-----------------------------------------------------------------------------
function apiRenderFormDetail(xml,rLen)
{
	var htm=""
	var tp = xml.getAttribute("tp")
	var cName = (tp == "Hidden" ? "apSpecHidden" : "apSpecLabel");

	for (var r=0;r<rLen;r++)
	{
		var nm=xml.getAttribute("nm")
		var req=xml.getAttribute("req")
		var nbr=xml.getAttribute("nbr")
		var formId=nm+("r"+r)
		var txt=formId+(req?" *":"")
		var id=nbr + "_r" + r

		htm+='<div nowrap onclick="apiClickField(this)"'
			+' onselectstart="apiBlockSelect()"'
			+' class="' + cName + '"'
			+' style="color:\'#0000cc\';"'
			+' id="' + id + '"'
			+' formId="' + formId + '"'	+' nm="' + nm + '"'
			+' r="' + r + '"' +'">' + txt + '</div>'
	}
	return htm
}
//-----------------------------------------------------------------------------
function apiRenderFormElem(xml)
{
	var htm="";
	var tp = xml.getAttribute("tp")
	
	if(tp != "Hidden" && tp != "Fc" && tp != "Select" && tp != "Text")
		return htm;	

	if(tp == "Hidden" && !gHidden)
		return htm;
		
	var detailNode = xml.selectSingleNode("ancestor::detail");	

	if(detailNode)
	{
		var rOutLen=parseInt(detailNode.getAttribute("height"),10)
		htm+=apiRenderFormDetail(xml,rOutLen)
	}
	else
		htm+=apiRenderFormField(xml)

	return htm
}
//-----------------------------------------------------------------------------
function apiRenderFormField(xml)
{
	var htm=""
	var tp = xml.getAttribute("tp")
	var cName = (tp == "Hidden" ? "apSpecHidden" : "apSpecLabel");

	var nm=xml.getAttribute("nm")
	var oc=xml.getAttribute("oc")
	var req=xml.getAttribute("req")
	var nbr=xml.getAttribute("nbr")
	var formId=nm
	var txt=formId+(req?" *":"")
	var id=nbr

	htm+='<div nowrap onclick="apiClickField(this)" class="' + cName + '"'
		+(oc?' style="color:\'#009900\';':'')
		+' onselectstart="apiBlockSelect()"'
		+' formId="' + formId + '"'
		+' id="' + id + '"'
		+' nm="' + nm + '"'
		+(oc?' oc="' + oc + '"':"")
		+'">' + txt + '</div>'

	return htm
}
//-----------------------------------------------------------------------------
function apiRenderPDLs(strType)
{
	// hide divs
	generalInfo.style.display="block"
	generalInfo.style.visibility="visible"
		pdlsLabel.style.visibility="hidden"
		pdlsLabel.style.display="none"
		pdls.style.visibility="hidden"
		pdls.style.display="none"
		syssLabel.style.display="none"
		syssLabel.style.visiblity="hidden"
		syss.style.display="none"
		syss.style.visiblity="hidden"
		tokensLabel.style.display="none"
		tokensLabel.style.visiblity="hidden"
		tokens.style.display="none"
		tokens.style.visiblity="hidden"
		tablesLabel.style.display="none"
		tablesLabel.style.visiblity="hidden"
		tables.style.display="none"
		tables.style.visiblity="hidden"
	detailInfo.style.display="none"
	detailInfo.style.visibility="hidden"

	// select menu
	strApiType=strType
	apiMenuHighlight() // requires strApiType

	// update route
	divRoute.innerHTML=""

	// xml - delete
	var xmlPdlNode=xmlRootNode.selectSingleNode("//PDL")
	if(xmlPdlNode)
		xmlRootNode.removeChild(xmlPdlNode)

	// xml - add
	xmlRootNode.setAttribute("type",strApiType)

	// get pdls
	pdls.innerHTML=""
	
	var xmlDoc=studioWnd.SSORequest(studioWnd.IDAPath+"?OUT=XML&_TYP=SL&_KNB=@da&_RECSTOGET=1000");
	if (!xmlDoc || xmlDoc.status)
	{
		msg="Error calling engine "+studioWnd.IDAPath+"."
		if (xmlDoc)
			msg+=studioWnd.getHttpStatusMsg(xmlDoc.status) + 
				"\nServer response: " + xmlDoc.statusText + " (" + xmlDoc.status + ")\n\n"
		studioWnd.cmnDlg.messageBox(msg,"ok","stop",window)
		return
	}
	var xmlDANodes = xmlDoc.selectNodes("//LINES/LINE/COLS/COL");
	var len=(xmlDANodes?xmlDANodes.length:0)
	if(!len) return
	var names=new Array();
	for (var i = 0; i < len; i++)
	{
		names[i] = studioWnd.trim(xmlDANodes[i].text);
	}
	apiBuildProjects(names);
	if (!apiRenderSimpleHtml("pdls",names))
		return

	// display pdls
	pdlsLabel.style.visibility="visible"
	pdlsLabel.style.display="block"
	pdls.style.visibility="visible"
	pdls.style.display="block"

	// display sys
	syss.innerHTML=""
	syssLabel.style.visibility="visible"
	syssLabel.style.display="block"
	syss.style.visibility="visible"
	syss.style.display="block"

	switch (strApiType)
	{
	case "ags":
	case "ida":
		// get tokens
		tokens.innerHTML=""

		// display tokens
		tokensLabel.style.display="block"
		tokensLabel.style.visibility="visible"
		tokens.style.display="block"
		tokens.style.visibility="visible"
		break
	case "dme":
		// get tables
		tables.innerHTML=""

		// display tables
		tablesLabel.style.display="block"
		tablesLabel.style.visibility="visible"
		tables.style.display="block"
		tables.style.visibility="visible"
		break
	}
}

//-----------------------------------------------------------------------------
function apiRenderSimpleHtml(strDiv,flds)
{
	// one string data column
	var strClick=""
	var elem=null
	switch (strDiv)
	{
	case "pdls":
		strClick=' onclick="apiClickPDL(this)"'
		elem=pdls
		break
	case "syss":
		strClick=' onclick="apiClickSys(this)"'
		elem=syss
		break
	case "tables":
		strClick=' onclick="apiClickTable(this)"'
		elem=tables
		break
	default:
		return false
		break
	}
	if(!flds)
		flds=xmlTempDoc.selectNodes("//COLS")
	var len=(flds?flds.length:0)
	var htm=""
	for(var n=0;n<len;n++)
	{
		var val=(flds[n].text?flds[n].text:flds[n])
		htm+='<div nowrap class="apClickDiv"' + strClick + ' fldId="' + val + '"'
			+' onselectstart="apiBlockSelect()"'
			+' id="' + document.uniqueID + '">' + val + '</div>'
	}
	elem.innerHTML=htm
	elem.scrollTop=0
	return true
}

//-----------------------------------------------------------------------------
function apiRenderSpecialHtml(strDiv,strInfo)
{
	// multiple/object data columns
	var htm=""
	var strClick=""
	var n
	var flds
	var len
	var myType=""
	switch (strDiv)
	{
	case "tokens":
		flds=xmlTempDoc.selectNodes("//TOKEN")
		len=(flds?flds.length:0)
		for(n=0;n<len;n++)
		{
			var name=flds[n].getAttribute("name")
			var title=flds[n].getAttribute("title")
			htm+='<div nowrap'
				+' onclick="apiClickToken(this)"'
				+' onselectstart="apiBlockSelect()"'
				+' class="apSpecLabel"'
				+' id="' + document.uniqueID + '"'
				+' token="'+name+'"'
				+' title="'+title+'">'
				+'<span style="width:100px;text-align:left;white-space:nowrap;">'
				+ name + '</span>'
				+'<span style="text-align:left;white-space:nowrap;">'
				+ title + '</span>'
				+'</div>'
		}
		tokens.innerHTML=htm
		tokens.scrollTop=0
		break
	case "tableFlds":
		flds=xmlTempDoc.selectNodes("//COL")
		arrFields=new Array()
		len=(flds?flds.length:0)
		for(n=0;n<len;n++)
		{
			var t=flds[n].text;
			arrFields[n]=t
			htm+='<div nowrap onclick="apiClickTableField(this)"'
				+' onselectstart="apiBlockSelect()"'
				+' class="apSpecLabel"'
				+' id="' + document.uniqueID + '"' +' fldId="' + t + '">'
				+ t + '</div>'
		}
		tableFlds.innerHTML=htm
		tableFlds.scrollTop=0
		break
	case "indices":
		flds=xmlTempDoc.selectNodes("//COL")
		len=(flds?flds.length:0)
		for(n=0;n<len;n++)
		{
			var nm=flds[n].text
			htm+='<div nowrap onclick="apiClickIndex(this)" class="apSpecLabel"'
				+' onselectstart="apiBlockSelect()"'
				+' id="' + document.uniqueID + '"'
				+' fldId="' + nm + '">' + nm + '</div>'
		}
		indices.innerHTML=htm
		indices.scrollTop=0
		break
	case "indexInfo":
		flds=xmlTempDoc.selectNodes("//COL")
		len=(flds?flds.length:0)
		for(n=0;n<len;n++)
		{
			var id=flds[n].text
			var txtid="txt"+id
			htm+='<label class="apSpecLabel" for="' + txtid + '"'
				+ ' onselectstart="apiBlockSelect()">'
				+ id + '</label><br/>'
				+'<input class="apTextBox" type="text" id="' + txtid + '"/><br/>'
		}
		indexInfo.innerHTML=htm
		indexInfo.scrollTop=0
		break
	case "relTables":
		flds=xmlTempDoc.selectNodes("//COL")
		len=(flds?flds.length:0)
		for(n=1;n<len;n+=2)
		{
			var relName=flds[n].text
			htm+='<div nowrap onclick="apiClickRelTable(this)" class="apSpecLabel"'
				+' id="' + document.uniqueID + '"' +' relName="' + relName + '"'
				+' onselectstart="apiBlockSelect()"'
				+' fldId="' + flds[n].previousSibling.text + '">' + relName
				+'<div style="display:none;padding-left:5px;"></div></div>'
		}
		relTables.innerHTML=htm
		relTables.scrollTop=0
		break
	case "relElements":
		flds=xmlTempDoc.selectNodes("//COL")
		len=(flds?flds.length:0)
		for(n=0;n<len;n++)
		{
			var fldId=flds[n].text;
			htm+='<div onclick="apiClickRelElement(\'' + strInfo + '\',this)"'
				+' onselectstart="apiBlockSelect()"'
				+' class="apSpecLabel" id="' + strInfo + "_elem_" + n + '"'
				+' fldId="' + fldId + '">' + fldId + '</div>'
		}
		relElements.innerHTML=htm
		relElements.scrollTop=0
		break
	case "formDef":
		formDef=xmlTempDoc.xml;
		formXML.loadXML(formDef);
		flds = formXML.selectNodes("//fld");
		len = (flds ? flds.length : 0);
		
		for(var n = 0; n < len; n++)
			htm += apiRenderFormElem(flds[n])

		// sort fields alphabetically - assumes div structure
		if(gAlpha)
			htm=htm.split("</div>").sort(divAlphaSort).join("</div>")
		document.all.formProps.innerHTML=htm
		document.all.formProps.scrollTop=0

		// methods
		flds=formXML.selectNodes("//toolbar/button")
		len=(flds?flds.length:0)
		htm=""
		for(n=0;n<len;n++)
		{
			var nm=flds[n].getAttribute("nm")
			var value=flds[n].getAttribute("value")
			htm+='<div nowrap onclick="apiClickMethod(this)" class="apSpecLabel"'
				+' onselectstart="apiBlockSelect()"'
				+' id="meth_' + value + '"'
				+' action="' + value + '">' + nm + '</div>'
		}
		document.all.methods.innerHTML=htm
		document.all.methods.scrollTop=0
		break
	case "drill":
		flds=xmlTempDoc.selectNodes("//DRILL[@type='select']")
		htm=""
		len=(flds?flds.length:0)
		for(n=0;n<len;n++)
		{
			var key=flds[n].getAttribute("key")
			var title=flds[n].getAttribute("title")
			htm+='<div nowrap onclick="apiClickDrill(this)" class="apSpecLabel"'
				+' onselectstart="apiBlockSelect()"'
				+' id="' + title + '" key="' + key + '"'
				+' idacall="' + flds[n].firstChild.text + '">'
				+title +" (" + key + ")" + '</div>'
		}
		document.all.drill.innerHTML=htm
		document.all.drill.scrollTop=0
		break
	case "reqDrillKeys":
		flds=xmlTempDoc.selectNodes("//DRILL[@title='"
			+ studioWnd.xmlEncodeString(strInfo.id) +"' and @key='"
			+ studioWnd.xmlEncodeString(strInfo.key) + "']/DRILLKEY/KEY")
		len=(flds?flds.length:0)
		for (n=0;n<len;n++)
		{
			var keynum=flds[n].getAttribute("keynum")
			var txtid="txt"+keynum
			htm+='<label class="apSpecLabel" onselectstart="apiBlockSelect()"'
				+' for="' + txtid + '"'
				+' id="' + keynum + '">' + flds[n].text + '</label><br/>'
				+'<input class="apTextBox" type="text" id="' + txtid + '"/><br/>'
		}
		reqDrillKeys.innerHTML=htm
		reqDrillKeys.scrollTop=0
		break
	default:
		return false
		break
	}
	return true
}

//-----------------------------------------------------------------------------
function apiResize()
{
	// resize and reposition window/dialog
	var sw=screen.availWidth;
	var sh=screen.availHeight;
	var sl=(parseInt(scrollDiv.offsetLeft,10)
		+ parseInt(mainDiv.offsetLeft,10)
		+ parseInt(detailInfo.offsetLeft,10)
		+ parseInt(apiDiv.style.left,10) + parseInt(apiDiv.style.width,10) + 32);
	var ww=Math.min(sl,sw-32);
	var st=(parseInt(scrollDiv.offsetTop,10)
		+ parseInt(mainDiv.offsetTop,10)
		+ parseInt(detailInfo.offsetTop,10)
		+ parseInt(apiDiv.style.top,10) + parseInt(apiDiv.style.height,10) + 48);
	var wh=Math.min(st,sh-32);
	var wx=Math.max(0,parseInt((sw-ww)/2,10));
	var wy=Math.max(0,parseInt((sh-wh)/2,10));
	if(!window.opener)
	{
		with (window)
		{
			dialogLeft=wx+"px";
			dialogTop=wy+"px";
			dialogHeight=wh+"px";
			dialogWidth=ww+"px";
		}
	}
	else
	{
		window.moveTo(wx,wy);
		window.resizeTo(ww,wh);
	}
}

//-----------------------------------------------------------------------------
function apiSelectMethod()
{
	// assumes gMethod has been set
	var arr=methods.getElementsByTagName("div")
	var len=(arr?arr.length:0)
	var bMethod=false
	for(var n=0;n<len;n++)
	{
		if (arr[n].id==gMethod)
		{
			arr[n].style.fontWeight="bold"
			bMethod|=true
		}
		else
			arr[n].style.fontWeight="normal"
	}
	btnBuildQuery.disabled=(bMethod?false:true)
	btnOK.disabled=(bMethod?false:true)
	btnJavascriptApi.disabled=(bMethod?(gJavaScript?false:true):true)
}

//-----------------------------------------------------------------------------
function apiSelectRelTable(id)
{
	var arr=relTables.getElementsByTagName("div")
	var len=(arr?arr.length:0)
	for (var i=0;i<len;i++)
		arr[i].style.fontWeight=(arr[i].id==id?"bold":"normal")
}

//-----------------------------------------------------------------------------
function apiSelectSys()
{
	// assumes gSYS has been set
	var arr=syss.getElementsByTagName("div")
	var len=(arr?arr.length:0)
	for(var n=0;n<len;n++)
		arr[n].style.fontWeight=(arr[n].fldId.substring(0,2)==gSYS?"bold":"normal")
}

//-----------------------------------------------------------------------------
function apiSelectTable(id)
{
	var arr=tables.getElementsByTagName("div")
	var len=(arr?arr.length:0)
	for(var n=0;n<len;n++)
		arr[n].style.fontWeight=(arr[n].fldId==id?"bold":"normal")
}

//-----------------------------------------------------------------------------
function apiSelectToken(id)
{
	var arr=tokens.getElementsByTagName("div")
	var len=(arr?arr.length:0)
	for(var n=0;n<len;n++)
		arr[n].style.fontWeight=(arr[n].token==id?"bold":"normal")
}

//-----------------------------------------------------------------------------
function apiSingleDME(strQuery)
{
	// requesting a single data item from DME
	// called by setDmeQuery, setIdaQuery
	var xmlSys = studioWnd.SSORequest(studioWnd.DMEPath + "?"+strQuery);
	if (!xmlSys || xmlSys.status)
	{
		msg="Error calling DME service.";
		if (xmlSys)
			msg+=studioWnd.getHttpStatusMsg(xmlSys.status) + 
				"\nServer response: " + xmlSys.statusText + " (" + xmlSys.status + ")\n\n"
		studioWnd.cmnDlg.messageBox(msg,"ok","stop",window)
		return
	}
	var node = xmlSys.selectSingleNode("/DME/RECORDS/RECORD/COLS/COL")
	return (node ? node.text : "");
}

//-----------------------------------------------------------------------------
function processMessageString(str)
{
	// test for attribute names
	re = new RegExp("<<(.*?)>>","")
	while(str.match(re))
	{
		var attName=RegExp.$1;
		attName=attName.toLowerCase();		// attribute name are LC
		var attValue = "";
		debugger;
		var nodes=studioWnd.designStudio.profile.selectNodes("/PROFILE/ATTRIBUTES/ATTR");
		for (var i=0; i<nodes.length; i++)
		{
			if (attName==nodes[i].getAttribute("name"))
			{
				attValue = nodes[i].getAttribute("value");
				break;
			}
		}
		str=str.replace(re,attValue);
	}
	return str
}

//-----------------------------------------------------------------------------
function apiTestQuery()
{
	// user wants to see raw return from current api call
	var apiDiv=document.getElementById("apiDiv")
	apiTestWindow(apiDiv.value)
}

//-----------------------------------------------------------------------------
function apiTestWindow(url)
{
	// det window size
	var sw=screen.availWidth
	var sh=screen.availHeight
	var ww=Math.min(500,sw-16)
	var wh=Math.min(600,sh-16)
	var wx=Math.max(0,sw-ww-16)
	var wy=0
	var prm="left="+wx+",top="+wy+",width="+ww+",height="+wh+",resizable=1,"
		+"scrollbars=1,status=1,toolbar=0,menubar=0,location=0,dependent=1"
		
	var w=null;
	var isHTM=url.indexOf(".htm")>-1;
	var hasXSL=url.indexOf(".xsl")>-1;
	var notXML=(url.indexOf(AGS_OUT_XML)==-1) && (url.indexOf(DME_OUT_XML)==-1);
	if (isHTM || hasXSL || notXML || studioWnd.ENVDOMAIN)
	{
		// method 1 - portal page or xsl graph, or user changed output type
		w=window.open(url,"_apiwin",prm);
	}
	else
	{
		// method 2 - query string
		// this is not as pretty as Explorer would render it,
		// but it allows you to close the window via javascript
		// and looks pretty clean
		
		// setting the location of an iframe or frameset frame,
		// will not render using that red/blue default stylesheet - the xml
		// will be invisible!
					
		// get data
		
		//check first if message contains user variables, and then replace those variables with their values - PT 180930
		url = processMessageString(url);
		xmlTempDoc = studioWnd.SSORequest(url);
		if (!xmlTempDoc || xmlTempDoc.status)
		{
			var msg="Error loading "+url+".";
			if (xmlTempDoc)
				msg+=studioWnd.getHttpStatusMsg(xmlTempDoc.status) + 
					"\nServer response: "+xmlTempDoc.statusText + " (" + xmlTempDoc.status + ")\n\n"
			studioWnd.cmnDlg.messageBox(msg,"ok","stop",window)
			return
		}
		
		// open new window
		var w=window.open(studioWnd.portalPath + "/blank.htm","_apiwin",prm)
		w.document.writeln("<PRE>"+studioWnd.xmlEncodeString(xmlTempDoc.xml)+"</PRE>")
		try	{
			w.document.close()
		} catch(e) {}
	}
	w.focus()
	apiWindows[apiWindows.length]=w
}

//-----------------------------------------------------------------------------
function apiToggleAlpha(cb)
{
	gAlpha=cb.checked
	//apiRefreshFields()
	apiFormFields()
	apiSelectMethod()
}

//-----------------------------------------------------------------------------
function apiToggleHidden(cb)
{
	gHidden=cb.checked
	//apiRefreshFields()
	apiFormFields()
	apiSelectMethod()
}

//-----------------------------------------------------------------------------
function apiUpdate(x)
{
	// x is a form property input field
	xmlApiDoc.selectSingleNode("//*[@id='" + x.id.substring(4) + "']").firstChild.text=x.value
}

//-----------------------------------------------------------------------------
function apiUpdateMax(x)
{
	// x is an input field
	gMax=x.value
}

//-----------------------------------------------------------------------------
function critClickAdd()
{
	// for clarity, deselect criterion select
	critClickCancel()
	btnCritAdd.disabled=true

	// get criterion length
	var xmlSysCode=xmlApiDoc.selectSingleNode("//SYSTEMCODE")
	var xmlDataTableNode=xmlSysCode.selectSingleNode("//DATATABLE")
	var xmlCriteriaNode=xmlDataTableNode.selectSingleNode("//CRITERIA")
	var len=0
	if(xmlCriteriaNode)
	{
		var arr=xmlCriteriaNode.selectNodes("//CRITERION")
		len=(arr?arr.length:0)
	}

	var id=document.uniqueID
	var mode="a"
	var conj=(len?"&":"")
	var name=""
	var oper="="
	var type="Literal"
	var value=""
	var igcase="1"
	critEditSet(id,mode,len,conj,name,oper,type,value,igcase)
}

//-----------------------------------------------------------------------------
function critClickCancel()
{
	selCritList.selectedIndex=-1
	critSel()
	critEditHide()
}

//-----------------------------------------------------------------------------
function critClickDel()
{
	var i=selCritList.selectedIndex
	if(i>-1)
	{
		// xml - delete
		var xmlSysCode=xmlApiDoc.selectSingleNode("//SYSTEMCODE")
		var xmlDataTableNode=xmlSysCode.selectSingleNode("//DATATABLE")
		var xmlCriteriaNode=xmlDataTableNode.selectSingleNode("//CRITERIA")
		if(!xmlCriteriaNode)
			return
		var id=selCritList.options[i].id
		var xpath="CRITERION[@id='" + id + "']"
		var xmlElem=xmlCriteriaNode.selectSingleNode(xpath)
		if(!xmlElem)
			return
		xmlCriteriaNode.removeChild(xmlElem)

		// update sel
		critSelRefresh()
	}
}

//-----------------------------------------------------------------------------
function critClickDelAll()
{
	// xml - delete all
	var xmlSysCode=xmlApiDoc.selectSingleNode("//SYSTEMCODE")
	var xmlDataTableNode=xmlSysCode.selectSingleNode("//DATATABLE")
	var xmlCriteriaNode=xmlDataTableNode.selectSingleNode("//CRITERIA")
	if (xmlCriteriaNode)
		xmlDataTableNode.removeChild(xmlCriteriaNode)

	// update sel
	critSelRefresh()
}

//-----------------------------------------------------------------------------
function critClickEdit()
{
	var i=selCritList.selectedIndex
	if(i>-1)
	{
		// show edit row
		var xmlSysCode=xmlApiDoc.selectSingleNode("//SYSTEMCODE")
		var xmlDataTableNode=xmlSysCode.selectSingleNode("//DATATABLE")
		var xmlCriteriaNode=xmlDataTableNode.selectSingleNode("//CRITERIA")
		var id=selCritList.options[i].id
		var xpath="CRITERION[@id='" + id + "']"
		var xmlElem=xmlCriteriaNode.selectSingleNode(xpath)
		if (!xmlElem)
			return

		var mode="e"
		var conj=xmlElem.getAttribute("conj")
		var name=xmlElem.getAttribute("name")
		var oper=xmlElem.getAttribute("oper")
		var type=xmlElem.getAttribute("type")
		var value=xmlElem.firstChild.text
		var igcase=xmlElem.getAttribute("igcase")
		critEditSet(id,mode,i,conj,name,oper,type,value,igcase)
	}
}

//-----------------------------------------------------------------------------
function critDblClick()
{
	critClickEdit()
}

//-----------------------------------------------------------------------------
function critEditHide()
{
	selCritConj.style.visibility="hidden"
	selCritConj.style.display="none"
	selCritField.style.visibility="hidden"
	selCritField.style.display="none"
	selCritOper.style.visibility="hidden"
	selCritOper.style.display="none"
	selCritType.style.visibility="hidden"
	selCritType.style.display="none"
	txtCritValue.style.visibility="hidden"
	txtCritValue.style.display="none"
	selCritUserEnv.style.visibility="hidden"
	selCritUserEnv.style.display="none"
	cbCritCase.style.visibility="hidden"
	cbCritCase.style.display="none"
	cbCritCaseLabel.style.visibility="hidden"
	cbCritCaseLabel.style.display="none"

	btnCritUpdate.style.visibility="hidden"
	btnCritUpdate.style.display="none"
	btnCritUpdate.disabled=true
	btnCritCancel.style.visibility="hidden"
	btnCritCancel.style.display="none"
	btnCritCancel.disabled=true
}

//-----------------------------------------------------------------------------
function critEditSave()
{
	// ---- update critEdit obj
	if(!critEdit)
		return

	// conj
	if(critEdit.conj)
	{
		var i=selCritConj.selectedIndex
		critEdit.conj=(i>-1?selCritConj.options[i].value:"")
	}

	// field
	var i=selCritField.selectedIndex
	critEdit.field=(i>-1?selCritField.options[i].value:"")

	// operation
	var i=selCritOper.selectedIndex
	critEdit.oper=(i>-1?selCritOper.options[i].value:"")

	// type - Literal or UserEnv
	var i=selCritType.selectedIndex
	critEdit.type=(i>-1?selCritType.options[i].value:"Literal")

	// value
	var i=selCritUserEnv.selectedIndex
	critEdit.value=(critEdit.type=="UserEnv"?
		(i>-1?selCritUserEnv.options[i].value:""):txtCritValue.value)

	// igcase
	critEdit.igcase=(cbCritCase.checked?"1":"0")

	// ---- update xml
	addCriterionNode(critEdit)

    // ----- update display

	// display crit
	critSelRefresh()

	// select crit
	selCritList.selectedIndex=critEdit.pos
}

//-----------------------------------------------------------------------------
function addCriterionNode(critEdit)
{
	var xmlSysCode=xmlApiDoc.selectSingleNode("//SYSTEMCODE")
	var xmlDataTableNode=xmlSysCode.selectSingleNode("//DATATABLE")
	var xmlCriteriaNode=xmlDataTableNode.selectSingleNode("//CRITERIA")
	if(!xmlCriteriaNode)
	{
		xmlCriteriaNode=xmlApiDoc.createNode(1,"CRITERIA","")
		xmlDataTableNode.appendChild(xmlCriteriaNode)
	}
	var xmlElem=xmlCriteriaNode.selectSingleNode("CRITERION[@id='" + critEdit.id + "']")
	if(!xmlElem)
	{
		xmlElem=xmlApiDoc.createNode(1,"CRITERION","")
		var cDataNode=xmlApiDoc.createNode(4, "cdata","")
		cDataNode.text=critEdit.value
		xmlElem.appendChild(cDataNode)
		xmlCriteriaNode.appendChild(xmlElem)
	}
	xmlElem.setAttribute("id",critEdit.id)
	xmlElem.setAttribute("conj",critEdit.conj)
	xmlElem.setAttribute("field",critEdit.field)
	xmlElem.setAttribute("oper",critEdit.oper)
	xmlElem.setAttribute("type",critEdit.type)
	xmlElem.setAttribute("igcase",critEdit.igcase)
	xmlElem.firstChild.text=critEdit.value
}

//-----------------------------------------------------------------------------
function critEditSet(id,mode,pos,conj,name,oper,type,value,igcase)
{
	// save
	critEdit=new Object()
	critEdit.id=id
	critEdit.mode=mode
	critEdit.pos=pos
	critEdit.conj=conj
	critEdit.name=name
	critEdit.oper=oper
	critEdit.type=type
	critEdit.value=value
	critEdit.igcase=igcase

	// conjunctions
	if(conj)
	{
		if(!selCritConj.length)
		{
			var len=(arrCritConj?arrCritConj.length:0)
			for (var i=0;i<len;i++)
			{
		 		var oOption = document.createElement("option")
		 		oOption.text = arrCritConjDesc[i]
		 		oOption.value = arrCritConj[i]
				selCritConj.add(oOption)
			}
		}
		critUpdateSel(selCritConj,conj)
	}
	selCritConj.style.visibility=(conj?"visible":"hidden")
	selCritConj.style.display=(conj?"block":"none")

	// fields
	var len=(selCritField?selCritField.length:0)
	if(!len)
	{
		len=(arrFields?arrFields.length:0)
		for (var i=0;i<len;i++)
		{
	 		var oOption = document.createElement("option")
	 		oOption.text = arrFields[i]
	 		oOption.value = arrFields[i]
			selCritField.add(oOption)
		}
	}
	selCritField.style.visibility="visible"
	selCritField.style.display="inline"

	// operations
	len=(selCritOper?selCritOper.length:0)
	if(!selCritOper.length)
	{
		len=(arrCritOper?arrCritOper.length:0)
		for (var i=0;i<len;i++)
		{
	 		var oOption = document.createElement("option")
	 		oOption.text = padSpaces(arrCritOper[i]+"",2) + " " + arrCritOperDesc[i]
	 		oOption.value = arrCritOper[i]
			selCritOper.add(oOption)
		}
	}
	critUpdateSel(selCritOper,oper)
	selCritOper.style.visibility="visible"
	selCritOper.style.display="inline"

	// user env
	if(!selCritUserEnv.length)
	{
		if(!arrUserEnv)
			apiGetUserEnv()
		var len=(arrUserEnv?arrUserEnv.length:0)
		for (var i=0;i<len;i++)
		{
	 		var oOption = document.createElement("option")
	 		oOption.text = arrUserEnv[i]
	 		oOption.value = arrUserEnv[i]
			selCritUserEnv.add(oOption)
		}
	}

	// type
	selCritType.selectedIndex=(type=="UserEnv")?1:0;
	critSelType(type)
	selCritType.style.visibility="visible"
	selCritType.style.display="inline"

	// case
	cbCritCase.checked=(igcase=="1"?true:false)
	cbCritCase.style.visibility="visible"
	cbCritCase.style.display="inline"
	cbCritCaseLabel.style.visibility="visible"
	cbCritCaseLabel.style.display="inline"

	btnCritAdd.disabled=true
	btnCritEdit.disabled=true
	btnCritDel.disabled=true
	btnCritDelAll.disabled=true

	btnCritUpdate.value=(mode=="a"?"Add":"Update")
	btnCritUpdate.style.visibility="visible"
	btnCritUpdate.style.display="inline"
	btnCritUpdate.disabled=false
	btnCritCancel.style.visibility="visible"
	btnCritCancel.style.display="inline"
	btnCritCancel.disabled=false
}

//-----------------------------------------------------------------------------
function critFieldClear()
{
	// clear the select
	var len=(selCritField?selCritField.length:0)
	for (var i=len-1; i > -1; i--)
		selCritField.removeChild(selCritField.children(i))
}

//-----------------------------------------------------------------------------
function critSel()
{
	var i=selCritList.selectedIndex

	btnCritAdd.disabled=false
	btnCritEdit.disabled=(i>-1?false:true)
	btnCritDel.disabled=(i>-1?false:true)
	btnCritDelAll.disabled=false

	critEditHide()
}

//-----------------------------------------------------------------------------
function critSelRefresh()
{
	// clear the select
	var len=(selCritList?selCritList.length:0)
	for (var i=len-1; i > -1; i--)
		selCritList.removeChild(selCritList.children(i))

	// xml - search
	var xmlSysCode=xmlApiDoc.selectSingleNode("//SYSTEMCODE")
	var xmlDataTableNode=xmlSysCode.selectSingleNode("//DATATABLE")
	var xmlCriteriaNode=xmlDataTableNode?xmlDataTableNode.selectSingleNode("//CRITERIA"):null
	var xmlCriterionNodes=xmlCriteriaNode?xmlCriteriaNode.selectNodes("//CRITERION"):null
	len=(xmlCriterionNodes?xmlCriterionNodes.length:0)
	
	// compute select widths
	maxCrit = new Array()
	maxCrit[0] = 0
	maxCrit[1] = 0
	maxCrit[2] = 0
	maxCrit[3] = 0
	maxCrit[4] = 0
	for (var i=0;i<len;i++)
	{
		var crit=xmlCriterionNodes[i]
		maxCrit[0] = Math.max(crit.getAttribute("conj").length,maxCrit[0])
		maxCrit[1] = Math.max(crit.getAttribute("field").length,maxCrit[1])
		maxCrit[2] = Math.max(crit.getAttribute("oper").length,maxCrit[2])
		maxCrit[3] = Math.max(crit.getAttribute("type").length + 2,maxCrit[3])
		maxCrit[4] = Math.max(crit.firstChild.text.length + 2,maxCrit[4])
	}	
	
	// render select
	for (var i=0;i<len;i++)
	{
		var id=xmlCriterionNodes[i].getAttribute("id")
		var name=xmlCriterionNodes[i].getAttribute("name")
		oOption=document.createElement("option")
		oOption.text=critSelXMLText(xmlCriterionNodes[i])
		oOption.value=name
		oOption.id=xmlCriterionNodes[i].getAttribute("id")
		selCritList.add(oOption)
	}
}

//-----------------------------------------------------------------------------
function critSelXMLText(crit)
{
	var conj=crit.getAttribute("conj")
	var field=crit.getAttribute("field")
	var oper=crit.getAttribute("oper")
	var type=crit.getAttribute("type")
	switch (type)
	{
		case "UserEnv":
			type="User Variable"
			break
		case "Field":
			type="Form Field"
			break
	}
	var value=crit.firstChild.text
	var igcase=(crit.getAttribute("igcase")=="1"?"^":" ")
	return padSpaces(conj,maxCrit[0])
		+"   "+padSpaces(field,maxCrit[1])
		+"   "+igcase + padSpaces(oper,maxCrit[2])
		+"   "+padSpaces("("+type+")",maxCrit[3])
		+"   "+padSpaces("\""+value+"\"",maxCrit[4])
}

//-----------------------------------------------------------------------------
function critSelType(type)
{
	selCritUserEnv.style.display="none"
	selCritUserEnv.style.visibility="hidden"
	txtCritValue.style.display="none"
	txtCritValue.style.visibility="hidden"
	switch (type)
	{
	case "Literal":
		txtCritValue.style.display="inline"
		txtCritValue.style.visibility="visible"
		txtCritValue.value=critEdit.value
		break
	case "UserEnv":
		critUpdateSel(selCritUserEnv,critEdit.value)
		selCritUserEnv.style.display="inline"
		selCritUserEnv.style.visibility="visible"
		break
	}
}

//-----------------------------------------------------------------------------
function critEditUpdate()
{
	// user clicked update button
	critEditSave()
	if(critEdit.mode=="a")
	{
		critUpdateSel(selCritList,critEdit.name)
		critEdit.mode="e"
		btnCritUpdate.value="Update"
	}
}

//-----------------------------------------------------------------------------
function critUpdateSel(sel,val)
{
	// selects the option having value val in select sel
	var len=sel.length
	for (var i=0; i<len; i++)
	{
		if(sel.options[i].value==val)
		{
			sel.selectedIndex=i
			sel.title=val
			return
		}
	}
	// deselect if not found
	sel.selectedIndex=-1
}

//-----------------------------------------------------------------------------
function detCoords(t)
{
	if(!t)
		return;
	// loop upwards, adding coordinates
 	var oTmp=t;
	var iTop=0;
	var iLeft=0;
	if(typeof(oTmp.offsetParent) != "object")
		return;
	while(oTmp.offsetParent)
	{
		iTop+=oTmp.offsetTop;
		iLeft+=oTmp.offsetLeft;
		oTmp=oTmp.offsetParent;
	}
	t.detLeft=iLeft;
	t.detTop=iTop;
	t.detWidth=parseInt(t.offsetWidth,10);
	t.detHeight=parseInt(t.offsetHeight,10);
	t.detRight=t.detLeft+t.detWidth;
	t.detBottom=t.detTop+t.detHeight;
}

//-----------------------------------------------------------------------------
function divAlphaSort(n1,n2)
{
	// sorts divs alphabetically by text
	var aText=n1.substring(n1.indexOf(">")+1).toLowerCase()
	var bText=n2.substring(n2.indexOf(">")+1).toLowerCase()
	if(aText < bText) return (-1);
	if(aText == bText) return (0);
	if(aText > bText) return (1);
}

//-----------------------------------------------------------------------------
function getFormProps(varProp,str)
{
	var val1=""
	var ptr=str.indexOf(varProp + "=")
	if(ptr != -1)
		val1=str.substr(ptr+varProp.length+1)
	return val1
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
function setAgsQuery(strAPI)
{
	if(strApiType != "ags") return
	var strProd = strAPI.da
	var strToken = strAPI.tkn
	if((typeof(strProd) == "undefined")
	|| (strProd == "")
	|| (typeof(strToken) == "undefined")
	|| (strToken == ""))
		return
	var strSys = strAPI.sys
	if((typeof(strSys) == "undefined")
	|| (strSys == ""))
	{
		// get single ags
		var strToken0 = strToken.substr(0, strToken.indexOf("."))
		var strQuery="PROD=GEN&FILE=PROGRAM&FIELD=SystemCode;&INDEX=PGMSET2"
			+ "&KEY=" + strProd + "=" + strToken0 + "&MAX=1" + DME_OUT_XML
		var node=apiSingleDME(strQuery)
		if(node)
			strSys=node
	}
	setDefaultProd(strProd)
	setDefaultSys(strSys)
	setDefaultIdaFile(strToken)
	setDefaultAgsMethod(strAPI.fc)
	var valArray = setDefaultAgsFields(strAPI.fields)
	setDefaultAgsValues(valArray);
}

//-----------------------------------------------------------------------------
function setDefaultAgsFields(val1)
{
	if(!val1) return
	var ptr=val1.split("&")
	var lenPtr=(ptr?ptr.length:0)
	var props=formProps.getElementsByTagName("div")
	var lenProps=(props?props.length:0)
	var fld, fldVal;
	var valArray = new Array();
	for (var i=0; i < lenPtr; i++)
	{
		fldVal = ptr[i].split("=");
		fld = fldVal[0];
		valArray[i] = fldVal[1];
		for (j=0; j < lenProps; j++)
		{
			if(props[j].nm==fld)
			{
				props[j].scrollIntoView(false)
				props[j].fireEvent("onclick")
				break;
			}
		}
	}
	return valArray;
}
//-----------------------------------------------------------------------------
function setDefaultAgsValues(valArray)
{
	if(!valArray || !valArray.length)return;
	var fldElems = selElem.getElementsByTagName("INPUT");
	var i, len = fldElems.length;
	for(i=0; i<len; i++)
	{
		if(valArray[i])
		{
			fldElems[i].value = valArray[i];
			apiUpdate(fldElems[i]);
		}
	}
}
//-----------------------------------------------------------------------------
function setDefaultAgsMethod(method)
{
	if(!method) return
	var arrMethods=methods.getElementsByTagName("div")
	var len=(arrMethods?arrMethods.length:0)
	for (var i=0;i<len;i++)
	{
		if(arrMethods[i].action==method)
		{
			arrMethods[i].scrollIntoView(false)
			arrMethods[i].fireEvent("onclick")
			break;
		}
	}
}

//-----------------------------------------------------------------------------
function setDefaultCriteria(crit)
{
	if(!crit) return
	var idx = crit.indexOf("&SELECT=");
	if( idx > -1)
		crit = crit.substr(idx+8);
		
	var strText = unescape(crit);
	var pattern1 = /(\&)|(\|)/g
	var clauses = strText.split(pattern1);
	var conj = new Array("");
	var oMatch1 = strText.match(pattern1);
	var i = 0;
	
	while(oMatch1 && oMatch1[i])
	{
		conj.push(oMatch1[i++]);
	}
	
	var	userEnvExpr = new RegExp("<<(.*?)>>","")
	var pattern2 = /(\^{0,1})((!=)|(<=)|(<)|(>=)|(>)|(!~)|(~)|(=))/
	var nameValArr, oMatch2, criterion;
	
	for(i=0; i<clauses.length; i++)
	{
		criterion = new Object();
		criterion.id = document.uniqueID;
		criterion.conj=conj[i];
		nameValArr = clauses[i].split(pattern2);
		criterion.field =nameValArr[0];
		oMatch2 = clauses[i].match(pattern2);
		criterion.igcase = (oMatch2[1]== "^")?"1":"0";
		criterion.oper = oMatch2[2];
		criterion.value = nameValArr[1];
		criterion.type = (userEnvExpr.test(clauses[i]) ? "UserEnv" : "Literal");
		addCriterionNode(criterion);
	}
    // ----- update display
	critSelRefresh()
}

//-----------------------------------------------------------------------------
function setDefaultFields(field)
{
	if(!field) return
	var fieldSplit=field.split(";")
	var lenFields=(fieldSplit?fieldSplit.length:0)
	var fieldProps=tableFlds.getElementsByTagName("div")
	var lenProps=(fieldProps?fieldProps.length:0)
	for (var i=0;i<lenFields;i++)
	{
		if(fieldSplit[i].indexOf(".")!=-1)
			apiRelField(fieldSplit[i].split("."))
		else
		{
			// tableFlds could get updates
			for (var p=0;p<lenProps;p++)
			{
				if(fieldProps[p].fldId==fieldSplit[i])
				{
					fieldProps[p].scrollIntoView(false)
					fieldProps[p].fireEvent("onclick")
					break;
				}
			}
		}
	}
}

//-----------------------------------------------------------------------------
function setDefaultFile(file)
{
	if(!file) return
	var fileProps=tables.getElementsByTagName("div")
	var len = (fileProps?fileProps.length:0)
	for (var k=0;k<len;k++)
	{
		if(fileProps[k].fldId==file)
		{
			fileProps[k].scrollIntoView(false)
			fileProps[k].fireEvent("onclick")
			break;
		}
	}
}

//-----------------------------------------------------------------------------
function setDefaultIdaFields(file)
{
	if(!file) return
	var fileProps=drill.getElementsByTagName("div")
	var len = (fileProps?fileProps.length:0)
	for (var k=0;k<len;k++)
	{
		if(fileProps[k].id==file)
		{
			fileProps[k].scrollIntoView(false)
			fileProps[k].fireEvent("onclick")
			break;
		}
	}
}

//-----------------------------------------------------------------------------
function setDefaultIdaFile(file)
{
	if(!file) return
	var fileProps=tokens.getElementsByTagName("div")
	var len = (fileProps?fileProps.length:0)
	for (var k=0;k<len;k++)
	{
		if(fileProps[k].token==file)
		{
			fileProps[k].scrollIntoView(false)
			fileProps[k].fireEvent("onclick")
			break
		}
	}
}

//-----------------------------------------------------------------------------
function setDefaultIdaKeyValues(keys)
{
	if(!keys.length) return;
	var i, fld, len = keys.length;
	for (i=0; i<len; i++)
	{
		fld = document.getElementById("txt" + keys[i].keynum);
		if(fld)
			fld.value = keys[i].value;
	}
}

//-----------------------------------------------------------------------------
function setDefaultIndex(index)
{
	if(!index) return
	var indexProps=indices.getElementsByTagName("div")
	var len = (indexProps?indexProps.length:0)
	for (var k=0;k<len;k++)
	{
		if(indexProps[k].fldId==index)
		{
			indexProps[k].scrollIntoView(false)
			indexProps[k].fireEvent("onclick")
			break;
		}
	}
}

//-----------------------------------------------------------------------------
function setDefaultKeyValues(strKeys)
{
	if(!strKeys)return;
	
	var arrKeys = strKeys.split("=");
	var arrKeyFields = indexInfo.getElementsByTagName("INPUT");
	var len = arrKeyFields.length;
	for (var i=0; i<arrKeys.length && i<len; i++)
	{
		if(arrKeys[i])
			arrKeyFields[i].value = arrKeys[i];
	}
}

//-----------------------------------------------------------------------------
function setDefaultMax(m)
{
	if(!m) return
	maxRec.value=m
	maxRec.scrollIntoView(false)
	maxRec.fireEvent("onchange")
}

//-----------------------------------------------------------------------------
function setDefaultProd(pdl)
{
	if(!pdl) return

	apiMenuHighlight()
	apiRenderPDLs(strApiType)

	var pdlProps=pdls.getElementsByTagName("div")
	var lenPDL = (pdlProps?pdlProps.length:0)
	for (var i=0;i<lenPDL;i++)
	{
		if(pdlProps[i].fldId==pdl)
		{
			pdlProps[i].scrollIntoView(false)
			apiClickPDL(pdlProps[i])
			break;
		}
	}
}

//-----------------------------------------------------------------------------
function setDefaultSys(sys)
{
	if(!sys) return
	var sysProps=syss.getElementsByTagName("div")
	var len = (sysProps?sysProps.length:0)
	for (var i=0;i<len;i++)
	{
		if(sysProps[i].fldId.substr(0,2)==sys)
		{
			sysProps[i].scrollIntoView(false)
			sysProps[i].fireEvent("onclick")
			break;
		}
	}
}

//-----------------------------------------------------------------------------
function setDefaultVals(pdl,sys)
{
	// expanded version of setDefaultProd
	if(!pdl) return

	apiMenuHighlight()
	apiRenderPDLs(strApiType)

	var pdlProps=pdls.getElementsByTagName("div")
	var lenPDL = (pdlProps?pdlProps.length:0)
	for (var i=0;i<lenPDL;i++)
	{
		if(pdlProps[i].fldId==pdl)
		{
			pdlProps[i].scrollIntoView(false)
			apiClickPDL(pdlProps[i])

			// apiClickPDL may update syss
			if(sys)
			{
				var sysProps=syss.getElementsByTagName("div")
				var lenSys=(sysProps?sysProps.length:0)
				for (var j=0;j<lenSys;j++)
				{
					if(sysProps[j].fldId.substr(0,2)==sys)
					{
						sysProps[j].scrollIntoView(false)
						sysProps[j].fireEvent("onclick")
						break;
					}
				}
			}
			break;
		}
	}
}

//-----------------------------------------------------------------------------
function setDmeQuery(strAPI)
{
	if(strApiType!="dme") return
	var strProd = strAPI.da
	var strFile = strAPI.file
	if(typeof(strProd) == "undefined" || strProd == "" || typeof(strFile) == "undefined" || strFile == "")
		return
	var strSys=strAPI.sys
	if(typeof(strSys) == "undefined" || strSys == "")
	{
		// get single dme
		var strQuery="PROD=GEN&FILE=FILEDEF&FIELD=SystemCode;&INDEX=FDFSET1"
			+"&KEY="+strProd+"="+strFile+"&MAX=1" + DME_OUT_XML
		var node=apiSingleDME(strQuery)
		if(node)
			strSys=node
	}
	setDefaultProd(strProd)
	setDefaultSys(strSys)
	setDefaultFile(strFile)
	setDefaultFields(strAPI.fields)
	setDefaultIndex(strAPI.index)
	setDefaultKeyValues(strAPI.keys)
	setDefaultMax(strAPI.max)
	setDefaultCriteria(strAPI.strCrit)
}

//-----------------------------------------------------------------------------
function setIdaQuery(objIda)
{
	if(strApiType!="ida") return
	if(objIda.da == "" || typeof(objIda.da) == "undefined" || objIda.tkn == "" || typeof(objIda.tkn) == "undefined")
		return
	if(typeof(objIda.sys) == "undefined" || objIda.sys == "")
	{
		// get single ida
		var strQuery="PROD=GEN&FILE=PROGRAM&FIELD=SystemCode;&INDEX=PGMSET2"
			+"&KEY="+objIda.da+"="+objIda.tkn+"&MAX=1" + DME_OUT_XML;
		var node=apiSingleDME(strQuery)
		if(node)
			objIda.sys=node
	}
	setDefaultProd(objIda.da)
	setDefaultSys(objIda.sys)
	setDefaultIdaFile(objIda.tkn)
	setDefaultIdaFields(objIda.drill)
	setDefaultIdaKeyValues(objIda.keys)
}
