<?xml version="1.0" encoding="iso-8859-1"?>
<!-- $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/forms/lawform.xsl,v 1.99.2.35.4.54.6.10.4.10.2.1 2013/04/19 02:25:12 jquito Exp $ -->
<!-- $NoKeywords: $ -->
<!-- LaVersion=8-)@(#)@9.0.1.11.458 2013-04-21 04:00:00 -->
<!--		*************************************************************** -->
<!--		*                                                             * -->
<!--		*                           NOTICE                            * -->
<!--		*                                                             * -->
<!--		*   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             * -->
<!--		*   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              * -->
<!--		*   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     * -->
<!--		*   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  * -->
<!--		*   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         * -->
<!--		*   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       * -->
<!--		*   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     * -->
<!--		*                                                             * -->
<!--		*   (c) COPYRIGHT 2012 INFOR.  ALL RIGHTS RESERVED.           * -->
<!--		*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            * -->
<!--		*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          * -->
<!--		*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               * -->
<!--		*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  * -->
<!--		*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  * -->
<!--		*                                                             * -->
<!--		*************************************************************** -->
<xsl:stylesheet
    version="1.0"   
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:user="javascript:code"
	exclude-result-prefixes="msxsl user">


<xsl:output method="html"/>

<!-- microsoft implementation of xsl:script -->
<msxsl:script language="JScript" implements-prefix="user">
//-----------------------------------------------------------------------------
// global variables
var dateFldSize=6;			// minimum date field size

var nCols=80;				// form variables
var nRows=24;
var nColWidth=10;
var nRowHeight=24;

var dtlCols=1;				// detail area variables
var dtlHdrRows=1;
var dtlBodyRows=0;
var colOffset=1;
var firstRow=1;
var rowWidth=800;
var dtlWidth=800;
var rowCnt=0;

var tabCnt=0;
var tabRow=1;
var tabMaxWide=200;
var tabActive="";
var tabActiveSub="";

var tblRowCnt=0;			// radio button variables

//-----------------------------------------------------------------------------
// initializes form variables
function initForm(nodelist)
{
	try {
		var frmNode=nodelist.item(0);
		var height=frmNode.getAttribute("height");
		var gHeight=frmNode.getAttribute("gHeight");
		var width=frmNode.getAttribute("width");
		var gWidth=frmNode.getAttribute("gWidth");

		nRows=(height &amp;&amp; gHeight ? height : 24);
		nCols=(width &amp;&amp; gWidth ? height : 80);
		nRowHeight=(gHeight ? gHeight : 24);
		nColWidth=(gWidth ? gWidth : 10);
		return "";

	} catch (e) {
		return "";
	}
}
//-----------------------------------------------------------------------------
// initializes tab variables
function initTabArea(nodelist)
{
	tabCnt=0;
	tabRow=1;
	tabActive="";
	tabActiveSub="";
	var trNode=nodelist.item(0);
	var chLength=trNode.childNodes.length;
	if (chLength &lt; 4)
		tabMaxWide=250;
	else if (chLength &lt; 5)
		tabMaxWide=200;
	else if (chLength &lt; 6)
		tabMaxWide=160;
	else if (chLength &lt; 7)
		tabMaxWide=132;
	else if (chLength &lt; 8)
		tabMaxWide=114;
	else if (chLength &lt; 9 || chLength &gt; 10)
		tabMaxWide=100;
	else
		tabMaxWide=88;
	return "";
}
//-----------------------------------------------------------------------------
// initializes detail area variables
function initDetailArea(dtlnode, fldnodes, rownodes)
{
	try {
		var curNode=dtlnode.item(0)
		rowCnt=-1
		dtlCols=1;
		colOffset=1;
		firstRow=1;
		if (curNode.getAttribute("width"))
			dtlWidth=(parseInt(curNode.getAttribute("width"))*nColWidth);

		if (curNode.parentNode.nodeName != "form")
		{
			var width=curNode.parentNode.parentNode.getAttribute("width");
			if (width)
				dtlWidth=((width*nColWidth)-10);
			else if (curNode.parentNode.parentNode.parentNode 
			&amp;&amp; curNode.parentNode.parentNode.parentNode.nodeName == "form")
				dtlWidth=((nCols*nColWidth)-10);
			else if (curNode.parentNode.parentNode.parentNode 
			&amp;&amp; curNode.parentNode.parentNode.parentNode.getAttribute("width"))
			{
				var width=curNode.parentNode.parentNode.parentNode.getAttribute("width");
				var value=(width ? (width*nColWidth) : (width*nColWidth)-10);
				dtlWidth=value;
			}
			else
				dtlWidth=((nCols*nColWidth)-10);
		}
		rowWidth=dtlWidth-2;

		dtlBodyRows = parseInt(curNode.getAttribute("height")) * parseInt(curNode.getAttribute("rowspan"));
		dtlHdrRows = parseInt(rownodes.item(0).getAttribute("row"));
		if (fldnodes.length &lt; 1) return "";
		var firstNode = fldnodes.item(0);

		firstRow=parseInt(firstNode.getAttribute("row"));
		colOffset=parseInt(rownodes.item(0).getAttribute("col"));
		for (var i=1; i &lt; rownodes.length; i++)
		{
			if (parseInt(rownodes.item(i).getAttribute("row"))!=dtlHdrRows)
				break;
		}
		dtlCols=i;
		rowWidth=(dtlCols == 1 ? rowWidth : (nCols*nColWidth)/dtlCols);

	} catch (e) { }
	return "";
}
//-----------------------------------------------------------------------------
function getFormCols()
{
	return nCols;
}
//-----------------------------------------------------------------------------
function getFormColWidth()
{
	return nColWidth;
}
//-----------------------------------------------------------------------------
function getFormRows()
{
	return nRows;
}
//-----------------------------------------------------------------------------
function getFormRowHeight()
{
	return nRowHeight;
}
//-----------------------------------------------------------------------------
function getColPos(nodelist)
{
	var strDefault="0px";
	try {
		var curNode=nodelist.item(0)
		var colVal=curNode.getAttribute("col");
		if (colVal==null) return strDefault;

		var calcColVal=(colVal*nColWidth);
		if(curNode.parentNode.nodeName=="detail")
		{
			if (curNode.nodeName == "push")
				calcColVal=colVal*nColWidth-3;
		}
		return "" + calcColVal +"px";

	} catch (e) {
		return strDefault;
	}
}
//-----------------------------------------------------------------------------
function getRowCol(nodelist)
{
	var strDefault="5px";
	try {
		var col=parseInt(nodelist.item(0).getAttribute("col"))
		return "" + ((col-colOffset)*nColWidth) + "px"

	} catch (e) {
		return strDefault;
	}
}
//-----------------------------------------------------------------------------
function getRowWidth()
{
	return rowWidth;
}
//-----------------------------------------------------------------------------
function getRowPos(nodelist)
{
	try {
		var curNode=nodelist.item(0)
		var rowVal=parseInt(curNode.getAttribute("row"))
		var rows=nRows
		if(curNode.parentNode.nodeName=="form")
			rowVal=rowVal-1
		else if(curNode.parentNode.nodeName=="tab")
			rows=parseInt(curNode.parentNode.parentNode.getAttribute("height"))
		else if(curNode.parentNode.nodeName=="scroll")
		{
			rows=parseInt(curNode.parentNode.getAttribute("height"))-1
			rowVal=rowVal-parseInt(curNode.parentNode.getAttribute("row"))
		}
		else if(curNode.parentNode.nodeName=="detail")
		{
			if(curNode.nodeName=="tabregion")
			{
				if(curNode.parentNode.parentNode.nodeName=="tab")
				{
					rows=parseInt(curNode.parentNode.parentNode.parentNode.getAttribute("height"))
					rowVal=rowVal+0.2
				}
				else
					rowVal=rowVal-0.2
			}
			else if(curNode.getAttribute("header")=="1" || (curNode.getAttribute("dtlhdr")=="1") )
				rows = dtlHdrRows/dtlCols
			else if(curNode.getAttribute("tp")=="rect")
				rows = dtlBodyRows/dtlCols
			else if(curNode.getAttribute("tp")=="label" &amp;&amp; !curNode.getAttribute("repeat"))
			{
				rowVal=rowVal-firstRow
				rows = dtlBodyRows/dtlCols
			}
			else
			{
				rowVal=rowVal-firstRow
				rows=parseInt(curNode.parentNode.getAttribute("rowspan"))
			}
		}

		return (rowVal != 0 ? "" + (rowVal*nRowHeight) + "px" : "3px");

	} catch(e) {
		return "3px";
	}
}
//-----------------------------------------------------------------------------
function getTextWidth(nodelist)
{
	var strDefault="13px";
	try {
		var curNode=nodelist.item(0)
		if (curNode==null) return strDefault;

		var strSize = curNode.getAttribute("sz");
		if (strSize==null) return strDefault;
		var size = parseInt(strSize);
		if(size==1) return strDefault;

		var edit=curNode.getAttribute("ed")
		var type=curNode.getAttribute("tp")
		if (edit)
		{
			if (type!="Out")
				if(size!=4 &amp;&amp; edit=="date")
					size=dateFldSize;
		}

		var retVal="";
		if(curNode.parentNode.nodeName=="detail")
			retVal=""+(size*nColWidth) + "px"
		else if(curNode.parentNode.nodeName=="scroll")
			retVal="100%"
		else
			retVal=""+(size*nColWidth) + "px"
		return retVal

	} catch (e) {
		return strDefault
	}
}
//-----------------------------------------------------------------------------
function getLabelWidth(nodelist)
{
	var strDefault="13px";
	try {
		var curNode=nodelist.item(0)
		var caption=curNode.getAttribute("nm")
		var calcWidth=(parseInt(curNode.getAttribute("sz"))*nColWidth);
		return "" + calcWidth + "px"

	} catch (e) {
		return strDefault
	}
}
//-----------------------------------------------------------------------------
function getButtonWidth(nodelist)
{
	var curNode=nodelist.item(0)
	if(curNode.getAttribute("sz") &amp;&amp; curNode.getAttribute("sz")!="")
	{
		var sz=parseInt(curNode.getAttribute("sz"),10);
		if (sz &lt; 3)
			sz += 0.3;
		return "" + (sz*nColWidth) + "px"
	}

	var caption=curNode.getAttribute("btnnm")
	return "" + ((caption+"").length*nColWidth) + "px"
}
//-----------------------------------------------------------------------------
function getSelectButtonCol(nodelist, bScroll)
{
	var strDefault="5px";
	try {
		var calcColVal;
		var curNode=nodelist.item(0)
		var x = parseInt(curNode.getAttribute("col"))
		var y = parseInt(curNode.getAttribute("sz"))
		var edit=curNode.getAttribute("ed")
		if (edit)
		{
			if(y!=4 &amp;&amp; edit=="date")
				y=dateFldSize;
		}

		if(bScroll)
			calcColVal=(x-1.3)*nColWidth;
		else
			calcColVal=(x+y)*nColWidth;
		return (y == 1 ? "" + (calcColVal+3) + "px" : "" + calcColVal +"px");

	} catch (e) {
		return strDefault
	}
}
//-----------------------------------------------------------------------------
function getRectTop(nodelist)
{
	try {
		var curNode=nodelist.item(0)
		var rowVal=parseInt(curNode.getAttribute("row"))
		if (rowVal &lt; 0)
			rowVal=0.1
		else
			rowVal=rowVal+0.3

		var nbrRows=nRows
		if(curNode.parentNode.nodeName=="form")
			rowVal=rowVal-1
		else if(curNode.parentNode.nodeName=="tab")
			nbrRows=parseInt(curNode.parentNode.parentNode.getAttribute("height"))
		else if(curNode.parentNode.nodeName=="detail")
		{
			if(curNode.getAttribute("header")=="1" || (curNode.getAttribute("dtlhdr")=="1") )
				nbrRows=dtlHdrRows/dtlCols
			else
				nbrRows=parseInt(curNode.parentNode.getAttribute("height"))/dtlCols
		}

		if(rowVal &gt; nbrRows)
			rowVal=nbrRows-0.2 

		return "" + (rowVal*nRowHeight) + "px"

	} catch (e) {
		return "";
	}
}
//-----------------------------------------------------------------------------
function getRectLeft(nodelist)
{
	try {
		var curNode=nodelist.item(0)
		var col=parseInt(curNode.getAttribute("col")) + .35
		if (col == 0.35 &amp;&amp; curNode.parentNode.nodeName == "form")
			col=1;
		return "" + (col*nColWidth) + "px"

	} catch (e) { }
	return ""
}
//-----------------------------------------------------------------------------
function getRectHeight(nodelist)
{
	try {
		var curNode=nodelist.item(0)
		var ht=parseInt(curNode.getAttribute("height"))
		if (ht==1) return "1px"

		ht=ht-1;
		if(curNode.nodeName=="scroll") 
			ht=ht+0.5;

		var nbrRows=nRows
		if(curNode.parentNode.nodeName=="tab")
			nbrRows=parseInt(curNode.parentNode.parentNode.getAttribute("height"))
		else if(curNode.parentNode.nodeName=="detail")
			nbrRows=parseInt(curNode.parentNode.getAttribute("height"))/dtlCols

		var topRow=parseInt(curNode.getAttribute("row"))
		if (topRow &lt; 0) topRow=0;
		else topRow=topRow+0.5;
		  
		if ( (topRow+ht) &gt; nbrRows )
		{
			if ( ((topRow+ht)-nbrRows) &lt; 0.75 )
				ht=(nbrRows-topRow-0.2)
		}

		return "" + (ht*nRowHeight) + "px"

	} catch (e) { }
	return "1px";
}
//-----------------------------------------------------------------------------
function getRectWidth(nodelist)
{
	try {
		var curNode=nodelist.item(0)
		var size=parseInt(curNode.getAttribute("width"))
		if(size==1) return "1px"

		return "" + ((size-0.8)*nColWidth)  + "px"

	} catch (e) { }
	return "1px";
}
//-----------------------------------------------------------------------------
function getRectLabelClass(nodelist)
{
	try {
		var curNode=nodelist.item(0);
		if ( curNode.parentNode.nodeName=="detail" )
			return "rectLabelDtl";
		if ( curNode.parentNode.nodeName=="tab" )
		{
			if ( curNode.parentNode.parentNode.parentNode.nodeName == "form" )
				return "rectLabelTab";
		}
		if ( curNode.parentNode.parentNode )
		{
			if (curNode.parentNode.parentNode.getAttribute("det")=="1")
				return "rectLabelTabSub";
			if (curNode.parentNode.parentNode.parentNode.nodeName.substr(0,3) == "tab")
				return "rectLabelTabSub";
			return "rectLabelTab";
		}

		if (parseInt(curNode.getAttribute("height"))==1)
			return "rectLabelDtl";
		else
			return "rectLabel";

	} catch (e) { }
	return "rectLabel";
}
//-----------------------------------------------------------------------------
function getHeight(nodelist)
{
	try {
		var curNode=nodelist.item(0)
		var height=0
		if (curNode.getAttribute("height"))
			height=parseInt(curNode.getAttribute("height"))
		var parentHeight=nRows
		if(curNode.nodeName=="detail")
		{
			height=dtlHdrRows+(Math.ceil(dtlBodyRows/dtlCols))
			return "" + ((height*nRowHeight)+2) + "px"
		}
		if(curNode.parentNode.nodeName=="scroll")
			parentHeight=curNode.parentNode.getAttribute("height")
		else if(curNode.parentNode.nodeName=="tab")
			parentHeight=curNode.parentNode.parentNode.getAttribute("height")
		else if(curNode.nodeName=="row")
		{
			parentHeight=Math.ceil(dtlBodyRows/dtlCols)
			height=parseInt(curNode.parentNode.getAttribute("rowspan"))
		}
		else if(curNode.nodeName=="tabregion" 
				&amp;&amp; curNode.parentNode.nodeName=="detail" 
				&amp;&amp; curNode.parentNode.parentNode.nodeName=="tab")
			parentHeight=curNode.parentNode.parentNode.parentNode.getAttribute("height")

		if (curNode.nodeName == "tabregion" &amp;&amp; curNode.getElementsByTagName("detail") != null)
			return "" + ((height*nRowHeight) + 8) + "px"
		else
			return "" + (height*nRowHeight) + "px"

	} catch (e) { }
	return "";
}
//-----------------------------------------------------------------------------
function getDtlRowPos(nodelist)
{
	try {
		var rowVal=parseInt(nodelist.item(0).getAttribute("row"))
		return "" + (rowVal-dtlHdrRows)*nRowHeight + "px"

	} catch(e) { }
	return ""
}
//-----------------------------------------------------------------------------
function getDtlColPos(nodelist)
{
	try {
		var curNode=nodelist.item(0);
		var curCol=curNode.getAttribute("col");
		if (curCol &amp;&amp; curCol != "0")
			return ("" + (parseInt(curCol)*nColWidth) + "px");
		else if	(curNode.parentNode.nodeName != "form")
			return "4px";

	} catch (e) { }
	return "" + (nColWidth) + "px";
}
//-----------------------------------------------------------------------------
function getDtlWidth()
{
	return dtlWidth;
}
//-----------------------------------------------------------------------------
function getDtlHdrHeight()
{
	return "" + dtlHdrRows*nRowHeight + "px"
}
//-----------------------------------------------------------------------------
function getDtlBodyHeight()
{
	return "" + Math.ceil(dtlBodyRows/dtlCols)*nRowHeight + "px"
}
//-----------------------------------------------------------------------------
function getDtlRowCnt()
{
	return rowCnt;
}
//-----------------------------------------------------------------------------
function incDtlRowCnt()
{
	rowCnt++;
	return "";
}
//-----------------------------------------------------------------------------
function getTabRegionCol(nodelist)
{
	try {
		var curNode=nodelist.item(0);
		var curCol=curNode.getAttribute("col");
		var parName=curNode.parentNode.nodeName;
		if (curCol &amp;&amp; curCol != "0")
			return "" + (parseInt(curCol)*nColWidth) + "px";
		else if	(parName == "tab")
			return "4px";
		else if	(parName == "detail"
		&amp;&amp; curNode.parentNode.parentNode.nodeName == "tab")
			return "4px";

	} catch (e) { }
	return "" + nColWidth + "px";
}
//-----------------------------------------------------------------------------
function getTabRegionWidth(nodelist)
{
	try {
		var curNode=nodelist.item(0);
		var curWidth=curNode.getAttribute("width");
		var parName=curNode.parentNode.nodeName;
		var rgnWidth=nCols*nColWidth;

		if (curWidth)
			rgnWidth=curWidth*nColWidth;

		if (parName != "form")
		{
			if	(parName == "tab")
			{
				var parWidth=curNode.parentNode.parentNode.getAttribute("width");
				rgnWidth=(parWidth ? (parWidth*nColWidth)-10 : (nCols*nColWidth)-10);
			}
			else if	(parName == "detail"
			&amp;&amp; curNode.parentNode.parentNode.nodeName == "tab")
			{
				var parWidth=curNode.parentNode.parentNode.parentNode.getAttribute("width");
				rgnWidth=(parWidth ? (parWidth*nColWidth)-10 : (nCols*nColWidth)-10);
			}
		}
		return "" + rgnWidth + "px";

	} catch (e) { }
	return "" + (nCols*nColWidth) + "px";
}
//-----------------------------------------------------------------------------
function setTableTR(nodelist, pos, child)
{
	try {
		var node=nodelist.item(0);
		var across = parseInt(node.parentNode.getAttribute("across"));
		var totChild = parseInt(node.parentNode.childNodes.length);
		var bTR = 0;									// Do not create tablerow tags
		switch (pos)
		{
		case 0:
			if (child == 1)
			{ 
				bTR = 1;								// Create a tablerow tag
				tblRowCnt = 0;
			}
			else if (((across * tblRowCnt) + 1) == child) 
				bTR = 1;								// Create a tablerow tag
			break;

		case 1:
			if (child % across == 0) 
			{
				bTR = 1;								// Create a tablerow tag
				tblRowCnt++;
			}
			else if (child == totChild) 
			{
				bTR = 1;								// Create a tablerow tag
				tblRowCnt++;
			}
			break;
		}
		return bTR;

	} catch (e) { }
	return 0;
}
//-----------------------------------------------------------------------------
function dataBind(nodelist)
{
	try {
		var curNode=nodelist.item(0);
		var db=curNode.getAttribute("nbr");
		if(curNode.parentNode.nodeName=="detail" &amp;&amp; db.indexOf("r")!=-1)
		{
			db=db.substring(0,db.indexOf("r"));
			db+="r"+rowCnt;
		}
		return db;

	} catch (e) { }
	return "";
}
//-----------------------------------------------------------------------------
function getParentName(nodelist)
{
	try {
		var curNode=nodelist.item(0);
		if (curNode.parentNode.nodeName=="detail")
			return (curNode.parentNode.getAttribute("nbr"));
		if (curNode.parentNode.nodeName=="tabregion")
			return (curNode.parentNode.getAttribute("nbr"));
		if (curNode.parentNode.nodeName=="tab")
			return (curNode.parentNode.getAttribute("nbr"));
		if (curNode.parentNode.nodeName=="scroll")
			return (curNode.parentNode.parentNode.getAttribute("nbr") ?
				curNode.parentNode.parentNode.getAttribute("nbr") : "form");
		if (curNode.parentNode.nodeName=="form")
			return ("form");

	} catch (e) { }
	return "form";
}
//-----------------------------------------------------------------------------
// is token a flowchart
function tokenIsFlowChart(formId)
{
	try {
		var flowRE=/^\w*FL\.\d+$|^\w*SU\.\d+$|^\w*BB\.\d+$|^\w*BF\.\d+$|^APPI\.\d+$|^APPR\.\d+$|^APIQ\.\d+$|^ARIN\.\d+$|^ARPF\.\d+$/i;
		return (formId.match(flowRE) ? true : false);

	} catch (e) { }
	return false;
}
//-----------------------------------------------------------------------------
function isSubTab(nodelist)
{
	try {
		var curNode=nodelist.item(0);
		if (curNode.parentNode.parentNode.nodeName=="detail")
			return true;
		if (curNode.parentNode.parentNode.nodeName=="tab")
			return true;
 		return false;

	} catch (e) { }
	return false;
}
//-----------------------------------------------------------------------------
function isCurrentTab(nodelist)
{
	var curNode=nodelist.item(0);
	var tabNbr=curNode.getAttribute("nbr");
	
	if (tabNbr == null)
		return false;
		
	if (tabNbr == tabActive || tabNbr == tabActiveSub)
		return true;
	else
		return false;
}
//-----------------------------------------------------------------------------
function isActiveTab(nodelist)
{
	var curNode=nodelist.item(0);
	var tabNbr=curNode.getAttribute("nbr");
	var isSecured = curNode.getAttribute("tabprot");
	if (tabNbr == null || isSecured == "1")
		return false;
	if (tabActive == "")
	{
		tabActive=tabNbr;
		return true;
	}
	return (tabNbr == tabActive ? true : false);
}
//-----------------------------------------------------------------------------
function isActiveSubTab(nodelist)
{
	var curNode=nodelist.item(0);
	var tabNbr=curNode.getAttribute("nbr");
	var isSecured = curNode.getAttribute("tabprot");
	if (tabNbr == null || isSecured == "1")
		return false;
	if (tabActiveSub == "")
	{
		tabActiveSub=tabNbr;
		return true;
	}
	return (tabNbr == tabActiveSub ? true : false);
}
//-----------------------------------------------------------------------------
function isLongTabString(tabString)
{
	return ((tabString.length*nColWidth) > tabMaxWide-4 ? true : false);
}
//-----------------------------------------------------------------------------
function getShortTabString(tabString)
{
	if (tabString.length &lt;= Math.ceil(tabMaxWide/nColWidth)+3)
		return tabString;
	return (tabString.substr(0,(tabMaxWide/nColWidth))+"...");
}
</msxsl:script>

<!-- root template match ===================================================-->
<xsl:template match="/">


<!-- variables -->
<xsl:variable name="rootdir"><xsl:value-of select="/*/@rootdir" /></xsl:variable>
<xsl:variable name="mode"><xsl:value-of select="/*/@mode" /></xsl:variable>
<xsl:variable name="pdl"><xsl:value-of select="/*/@pdl" /></xsl:variable>
<xsl:variable name="hkey"><xsl:value-of select="form/@hkey" /></xsl:variable>
<xsl:variable name="host"><xsl:value-of select="/*/@host" /></xsl:variable>
<xsl:variable name="uselists"><xsl:value-of select="form/@uselists" /></xsl:variable>
<xsl:variable name="iosVersion"><xsl:value-of select="form/@iosVersion" /></xsl:variable>

<!-- list driven fields nodeset variable -->
<xsl:variable name="lstflds" select="//fld[((@req='1' and @key=1) or @key='1') and @hsel='1' and @keynbr and @label and (@tp='Text' or @tp='Select') and not(@det)]" />
<!-- key fields nodeset variable -->
<xsl:variable name="keyflds" select="//fld[@keynbr]" />
<!-- required fields nodeset variable -->
<xsl:variable name="reqflds" select="//fld[@req='1' or @nextreq='1' or @key='1']" />
<!-- id fields nodeset variable -->
<xsl:variable name="idflds" select="//*[@id]" />
<!-- name fields nodeset variable -->
<xsl:variable name="nmflds" select="//*[@nm and not(@isxlt) and @nbr]" />
<!-- default values nodeset variable  -->
<xsl:variable name="defvals" select="//fld[@defval]" />
<!-- push nodeset variable  -->
<xsl:variable name="pushes" select="//push" />
<!-- tabregion nodeset variable -->
<xsl:variable name="tabregion" select="//tabregion" />
<!-- detail nodeset variable  -->
<xsl:variable name="details" select="//detail" />
<!-- Workflow nodeset variable -->
<xsl:variable name="workflows" select="//workflow"/>

<html>
<head>
<!-- force page to expire immediately -->
<META HTTP-EQUIV="Expires" CONTENT="0" />
<!-- force no caching -->
<META HTTP-EQUIV="pragma" CONTENT="no-cache" />

<!-- form initialization script ===============================================
1) declare and initialize variables from form attributes
2) create function to initialize the portal objects
3) create function to clear portal objects
4) create function to highlight the current tab of top-level tabregion (optional)
============================================================================-->
<script language="javascript">
var keyColl=null;			// collections
var reqColl=null;
var listColl=null;
var pushColl=null;
var defColl=null;
var namColl=null;
var idColl=null;
var detailColl=null;
var workflows=null;

var formletToolbar=null;
var aTabRgns=new Array();

var aFormFC=new Array();
var aFormFCText=new Array();
var aFormLink=new Array();
var aFormLinkText=new Array();
var aActionsFC=new Array();
var aActionsText=new Array();

var strInquireFC="<xsl:value-of select="form/@inq"/>";
var strDefaultFC="<xsl:value-of select="form/@defaultFC"/>";

<!-- detemine valid fcs ====================================================-->
<xsl:choose>
<!-- coming from jobdef? (only change is valid) -->
	<xsl:when test="(/form/toolbar/button) and starts-with($hkey,'_JOBPARAM')">
var strValidFCs = "<xsl:value-of select="/form/@chg"/>";
	</xsl:when>

	<xsl:otherwise>
var strValidFCs="";
<!-- hidden fcs -->
<xsl:for-each select="form/fld[@tp='Hidden' and @nm='FC' and not(ancestor::detail)]/vals">
	<xsl:choose>
	<xsl:when test="@Tran">
strValidFCs = strValidFCs + '<xsl:value-of select="@Tran" />';</xsl:when>
	<xsl:otherwise>
strValidFCs = strValidFCs + '<xsl:value-of select="@Disp" />';</xsl:otherwise>
	</xsl:choose>
</xsl:for-each>

<!-- design studio hidden fc toolbar -->
<xsl:if test="(/form/toolbar[@tp='HiddenFC'])">
strValidFCs = strValidFCs + strDefaultFC + strInquireFC;
</xsl:if>

<!-- toolbar -->
<xsl:for-each select="form/toolbar/button">
strValidFCs = strValidFCs + "<xsl:value-of select="substring(@value,1,1)" />";
</xsl:for-each>

	</xsl:otherwise>
</xsl:choose>


var strTitle="<xsl:value-of select="form/@TITLE"/>";
var strPDL="<xsl:value-of select="$pdl" />";
var strTKN="<xsl:value-of select="form/@TOKEN" />";
var strSYS="<xsl:value-of select="form/@SYSTEM" />";
var strFORMID="<xsl:value-of select="form/@formid" />";
var strMode="<xsl:value-of select="$mode" />"
var strHost="<xsl:value-of select="$host" />"
var strAGSPath="";
var strIDAPath="";
var strHKValue="<xsl:value-of select="$hkey" />";
var strHKFldNbr="<xsl:value-of select="//fld[@tp='Sp' and @nm='_HK']/@nbr" />";
var strOKAction="";

<!-- form fc field number -->
<xsl:choose>
<xsl:when test="form/fld[@tp='Hidden' and @nm='FC']">
var strFrmFCFldNbr="<xsl:value-of select="form/fld[@tp='Hidden' and @nm='FC']/@nbr"/>";</xsl:when>
<xsl:when test="form/toolbar[@nm='FC']/@nbr">
var strFrmFCFldNbr="<xsl:value-of select="form/toolbar[@nm='FC']/@nbr"/>";</xsl:when>
<xsl:otherwise>
var strFrmFCFldNbr="_f1";</xsl:otherwise>
</xsl:choose>

<!-- line fc/sc field number (for key/data collection/return) -->
<xsl:variable name="detfcflds" select="//fld[@detFC='1']" />
<xsl:choose>
<xsl:when test="count($detfcflds)=0">
var strRowFCFldNbr="";</xsl:when>
<xsl:when test="count($detfcflds)=1">
var strRowFCFldNbr="<xsl:value-of select="$detfcflds/@nbr"/>";</xsl:when>
<xsl:otherwise>
var strRowFCFldNbr="<xsl:value-of select="$detfcflds[@nm='LINE-FC']/@nbr"/>";</xsl:otherwise>
</xsl:choose>

<!-- batch token job/user name fields -->
<xsl:if test="/form[@TYPE='BATCH' or @TYPE='IMPEXP']">
var strJobNameFld="<xsl:value-of select="form/fld[@nm='JOB-NAME']/@nbr" />";
var strUsrNameFld="<xsl:value-of select="form/fld[@nm='USER-NAME']/@nbr" />";
</xsl:if>

function xslInitFramework()
{
	formState.setValue("formReady",true)
<xsl:choose>
<!-- portal page initialization -->
<xsl:when test="starts-with($host,'page')">
	<!-- some may not have a toolbar -->
	<xsl:if test="/form/toolbar/button or /form/fld[@tp='Hidden' and @nm='FC' and not(ancestor::detail)]">
	formletToolbar=new portalWnd.Toolbar(portalWnd,window,document.getElementById("formtoolbar")); 
	var tb=formletToolbar;
	document.getElementById("formtoolbar").style.visibility="visible";
	<xsl:call-template name="toolbar">
		<xsl:with-param name="host"><xsl:value-of select="$host"/></xsl:with-param>
		<xsl:with-param name="hkey"><xsl:value-of select="$hkey"/></xsl:with-param>
		<xsl:with-param name="mode"><xsl:value-of select="$mode"/></xsl:with-param>
		<xsl:with-param name="listcount"><xsl:value-of select="number(count($lstflds))"/></xsl:with-param>
	</xsl:call-template>
	</xsl:if>
	<!-- magic may have a new OK action -->
	lawForm.magic.setOKAction()
	<!-- see if portal page wants to perform initialization -->
	if (typeof(pageWnd.initializeFramework)=="function")
		pageWnd.initializeFramework()
</xsl:when>

<!-- standard form initialization -->
<xsl:otherwise>
	portalObj.setTitle(strTitle,strTKN,strPDL);
	var tb=portalObj.toolbar
	<xsl:call-template name="toolbar">
		<xsl:with-param name="host"><xsl:value-of select="$host"/></xsl:with-param>
		<xsl:with-param name="hkey"><xsl:value-of select="$hkey"/></xsl:with-param>
		<xsl:with-param name="mode"><xsl:value-of select="$mode"/></xsl:with-param>
		<xsl:with-param name="listcount"><xsl:value-of select="number(count($lstflds))"/></xsl:with-param>
	</xsl:call-template>

	<xsl:if test="not(starts-with($hkey,'_JOBPARAM'))">
		<!-- magic may have a new OK action -->
		lawForm.magic.setOKAction()
	</xsl:if>

	if (lawForm.isBatchForm)
		lawformInitBatchToken();
		
	with (portalObj.helpOptions)
	{
		clearItems()
		var str=portalObj.getPhrase("LBL_FORM_HELP")
		addItem(str, str, "lawformFormHelp()", window)
		str=portalObj.getPhrase("LBL_FIELD_HELP")
		addItem(str, str, "lawformFieldHelp()", window)
		str=portalObj.getPhrase("LBL_FORM_WIZARD")
		addItem(str, str, "lawformWizardHelp()", window)

		if(portalObj.guideMeCache.items[strTKN.toLowerCase()])
		{
			str=portalObj.getPhrase("LBL_GUIDE_ME");
			addItem(str, str, "lawformShowGuideMe()", window);
		}
	}

	if (typeof(FORM_OnAfterFrameworkInit) == "function")
	{
		try	{ FORM_OnAfterFrameworkInit();
		} catch (e) { }
	}
</xsl:otherwise>
</xsl:choose>
}
function xslClearFramework(bTitle)
{
<!-- nothing to do on portal pages -->
<xsl:if test="not(starts-with($host,'page'))">
	var portalObj=portalWnd.lawsonPortal;
	if (bTitle) portalObj.setTitle('');
	portalObj.toolbar.clear();
</xsl:if>
}
function xslBuildCollections()
{
	var str="";
	// keys collection
	keyColl=new portalWnd.LawKeyColl(portalWnd,window)
	<xsl:for-each select="$keyflds">
		<xsl:choose>
		<xsl:when test="@btnnm and not(name(.)='push')">str="<xsl:value-of select="@btnnm" />";</xsl:when>
		<xsl:otherwise>str="";</xsl:otherwise>
		</xsl:choose>
		keyColl.addItem("<xsl:value-of select="@keynbr" />","<xsl:value-of select="@nbr" />",
			"<xsl:value-of select="@det" />","<xsl:value-of select="@oc" />",str,
			"<xsl:value-of select="@nm" />","<xsl:value-of select="@ed" />","<xsl:value-of select="@decsz" />",
			"<xsl:value-of select="@nknimp" />","<xsl:value-of select="@ar" />");
	</xsl:for-each>

	// required fields collection
	reqColl=new portalWnd.LawRequiredColl()
	<xsl:for-each select="$reqflds">
		<xsl:variable name="size">
			<xsl:choose>
				<xsl:when test="@mxsz"><xsl:value-of select="@mxsz"/></xsl:when>
				<xsl:otherwise><xsl:value-of select="@sz"/></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="edit">
			<xsl:choose>
				<xsl:when test="@ed"><xsl:value-of select="@ed"/></xsl:when>
				<xsl:otherwise></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		reqColl.addItem("<xsl:value-of select="@nbr" />","<xsl:value-of select="@keynbr" />","<xsl:value-of select="@req" />","<xsl:value-of select="@nextreq" />","<xsl:value-of select="@key" />","<xsl:value-of select="$size" />","<xsl:value-of select="$edit" />","<xsl:value-of select="@det" />");
	</xsl:for-each>

	// list fields collection
	listColl=new portalWnd.LawListColl()
	<xsl:for-each select="$lstflds">
		<xsl:choose>
			<xsl:when test="@deftkn[.=/form/@TOKEN]">str="";</xsl:when>
			<xsl:otherwise>str="<xsl:value-of select="@deftkn" />";</xsl:otherwise>
		</xsl:choose>
		listColl.addItem("<xsl:value-of select="@nbr" />","<xsl:value-of select="position()" />","<xsl:value-of select="@label" />","<xsl:value-of select="@keynbr" />",str,"<xsl:value-of select="@tp" />");
	</xsl:for-each>

	// default values collection
	defColl=new portalWnd.LawDefaultColl()
	<xsl:for-each select="$defvals">
		defColl.addItem("<xsl:value-of select="@nbr" />","<xsl:value-of select="@defval" />","<xsl:value-of select="@det" />","<xsl:value-of select="@isxlt" />","<xsl:value-of select="@par" />");
	</xsl:for-each>

	// form push buttons
	pushColl=new portalWnd.LawIdColl()
	<xsl:for-each select="$pushes">
		pushColl.addItem("<xsl:value-of select="@nbr" />","<xsl:value-of select="@nm" />");
	</xsl:for-each>

	// id fields nodeset variable
	idColl=new portalWnd.LawIdColl()
	<xsl:for-each select="$idflds">
		idColl.addItem("<xsl:value-of select="@nbr" />","<xsl:value-of select="@id" />");
	</xsl:for-each>

	// named fields nodeset variable
	namColl=new portalWnd.LawNameColl()
	<xsl:for-each select="$nmflds">
		namColl.addItem("<xsl:value-of select="@nbr" />","<xsl:value-of select="@nm" />","<xsl:value-of select="@fldbtn" />","<xsl:value-of select="@par" />","<xsl:value-of select="@det" />","<xsl:value-of select="@tp" />","<xsl:value-of select="@oc" />");
	</xsl:for-each>

	// tabregions
	var tabRgn=null;
	<xsl:for-each select="$tabregion">
		aTabRgns['<xsl:value-of select="@nbr"/>'] = new portalWnd.ValueStorage();
		tabRgn = aTabRgns['<xsl:value-of select="@nbr"/>'];
		<xsl:for-each select="tab[not(@tp) or @tp!='Hidden']">
			var tabProt="<xsl:value-of select="@tabprot"/>";
			tabRgn.add("<xsl:value-of select="@nbr"/>",(tabProt ? tabProt : "0"));
		</xsl:for-each>
	</xsl:for-each>

	// form detail areas
	detailColl=new portalWnd.LawDetailColl()
	<xsl:for-each select="$details">
		detailColl.addItem("<xsl:value-of select="@nbr" />","<xsl:value-of select="@height" />","<xsl:value-of select="@par" />");
	</xsl:for-each>

	// custom form work flows
	workflows=new portalWnd.LawWorkflowColl()
	<xsl:for-each select="$workflows">
		var workflow = workflows.addItem("<xsl:value-of select="@id"/>","ERP","<xsl:value-of select="@pdl"/>","<xsl:value-of select="@workcatval"/>","<xsl:value-of select="@value"/>");
		if(workflow)
		{
			<xsl:for-each select="./variables/variable">
				workflow.addVariable("<xsl:value-of select="@name"/>","<xsl:value-of select="@type"/>","<xsl:value-of select="@value"/>");
			</xsl:for-each>
			<xsl:for-each select="./criteria/criterion">
				workflow.addCriterion("<xsl:value-of select="@name"/>","<xsl:value-of select="@type"/>","<xsl:value-of select="@value"/>","<xsl:value-of select="@pos"/>");
			</xsl:for-each>
		}
	</xsl:for-each>
}
</script>

	<!-- insert any custom script -->
	<xsl:if test="//XSCRIPT">
	<script>
		<xsl:apply-templates select="//XSCRIPT" />
	</script>
	</xsl:if>

	<!-- add any 'included' javascript files -->
	<xsl:for-each select="/form/INCLUDE/FILE">
		<script language="javascript" >
			<xsl:attribute name="src">
			<xsl:choose>
				<!-- 4.0 forward: name includes servlet call -->
				<xsl:when test="starts-with(@name,'/servlet')"><xsl:value-of select="@name"/></xsl:when>
				<!-- pre 4.0 XML: name is relative filename, convert to servlet call (if not 8.0.3 Technology) -->
				<xsl:when test="starts-with($iosVersion,'8.0.3')"><xsl:value-of select="$rootdir"/>/content/scripts/<xsl:value-of select="@name"/></xsl:when>
				<xsl:otherwise>/servlet/FileMgr?action=get&amp;folder=<xsl:value-of select="$rootdir"/>/content/scripts&amp;name=<xsl:value-of select="@name"/></xsl:otherwise>
			</xsl:choose>
			</xsl:attribute><a />
		</script>
	</xsl:for-each>

	<title><xsl:value-of select="form/@TITLE"/></title>
	</head>

	<!-- successful form XML output -->
	<body margin="8" onload="lawformOnLoad(event)" onunload="lawformOnUnload(event)" onkeypress="lawformOnKeyPress(event)" onkeydown="lawformOnKeyDown(event)" onhelp="lawformOnHelp(event)" oncontextmenu="portalWnd.frmShowContextMenu(event,window)" onresize="lawformOnResize(event)" onclick="hideDropDown()" tabIndex="-1" >

	<!-- portal page toolbar -->
	<xsl:if test="starts-with($host,'page')">
	<div id="formtoolbar" class="toolbar" style="position:absolute;overflow:visible;top:0px;width:100%;visibility:hidden;"/>
	</xsl:if>

	<!-- main display -->
	<xsl:apply-templates select="form">
		<xsl:with-param name="rootdir"><xsl:value-of select="$rootdir"/></xsl:with-param>
		<xsl:with-param name="iosVersion"><xsl:value-of select="$iosVersion"/></xsl:with-param>
	</xsl:apply-templates>

	</body>

	</html>
</xsl:template>

<!-- build toolbar template ================================================-->
<xsl:template name="toolbar">
<xsl:param name="host" />
<xsl:param name="hkey" />
<xsl:param name="mode" />
<xsl:param name="listcount" />
	with(tb)
	{
		target=window
		clear()
<xsl:choose>

<!-- hidden FC field or Design Studio created 'hidden' toolbar -->
<xsl:when test="(/form/fld[@tp='Hidden' and @nm='FC' and not(ancestor::detail)]) or (/form/toolbar[@tp='HiddenFC' and @nm='FC'])">
	<xsl:if test="not(user:tokenIsFlowChart(string(/form/@TOKEN)))">
		<xsl:choose>
		<xsl:when test="/form/@defaultFC[.!='']">
		createButton(portalObj.getPhrase('LBL_OK'), lawformDoFunctionClick, 'btnOKForm', '', '<xsl:value-of select="/form/@defaultFC"/>');
		strDefaultFC='<xsl:value-of select="/form/@defaultFC"/>'
		</xsl:when>
		<xsl:otherwise>
		createButton(portalObj.getPhrase('LBL_OK'), lawformDoFunctionClick, 'btnOKForm', '', 'C');
		strDefaultFC="C";
		</xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="starts-with($mode,'modal')">
		createButton(portalObj.getPhrase('LBL_CANCEL'), lawformPopWindow, 'btnCancelForm');
		createButton(portalObj.getPhrase('LBL_DETACH'), lawformOnClickDetach, 'btnDetach');
			</xsl:when>
			<xsl:otherwise>
		createButton(portalObj.getPhrase('LBL_CANCEL'), lawformGoHome, 'btnCancelForm');
			</xsl:otherwise>
		</xsl:choose>
	</xsl:if>
</xsl:when>

<!-- jobdef parameter form -->
<xsl:when test="starts-with($hkey,'_JOBPARAM')">
	<xsl:variable name="caller" select="substring($hkey,11,string-length($hkey))"/>
	<xsl:variable name="fParm">
		<xsl:choose>
		<xsl:when test="starts-with($caller,'jobDef')"><xsl:text>FC= JD </xsl:text></xsl:when>
		<xsl:when test="starts-with($caller,'jobList')"><xsl:text>FC= JL </xsl:text></xsl:when>
		<xsl:otherwise><xsl:text>fc= XX </xsl:text></xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	createButton(portalObj.getPhrase('LBL_BACK'), 'lawformBatchAction(&quot;<xsl:value-of select="$fParm" />&quot;)', 'btnCloseForm','','','back');

	<xsl:variable name="chgFC">
		<xsl:choose>
		<xsl:when test="/form/@chg"><xsl:value-of select="/form/@chg"/></xsl:when>
		<xsl:otherwise></xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	createButton("<xsl:value-of select="form/toolbar/button[@value=$chgFC]/@nm" />", lawformDoFunctionClick, 'tbBtnChg', '', '<xsl:value-of select="$chgFC" />', 'chg');

</xsl:when>

<!-- standard toolbar button creation -->
<xsl:otherwise>

	<!-- modal window? -->
	<xsl:if test="starts-with($mode,'modal')">
		createButton(portalObj.getPhrase('LBL_BACK'), lawformPopWindow, 'btnCloseForm','','','back');
		createButton(portalObj.getPhrase('LBL_DETACH'), lawformOnClickDetach, 'btnDetach');
	</xsl:if>
	<xsl:if test="$listcount!=0 and not(starts-with($mode,'modal')) and not(starts-with($host,'page'))">
	if (lawForm.useLists)
		createButton(portalObj.getPhrase('LBL_START_LIST_MODE'), lawformShowList, 'btnGoList');
	</xsl:if>

	<xsl:choose>
	<xsl:when test="starts-with($host,'page')">
		<!-- paint all the buttons on a portal page -->
		<xsl:for-each select="form/toolbar/button">
			createButton("<xsl:value-of select="@nm" />", lawformDoFunctionClick, 'tbBtn<xsl:value-of select="@value" />', '', '<xsl:value-of select="@value" />');
		</xsl:for-each>
	</xsl:when>

	<xsl:otherwise>
		<!-- only if we have buttons (may be hidden by Studio) -->
		<xsl:if test="form/toolbar/button">
		<!-- paint only standard button when not on a portal page -->
		<xsl:variable name="addFC">
			<xsl:choose>
			<xsl:when test="/form/@add"><xsl:value-of select="substring(form/@add,1,1)"/></xsl:when>
			<xsl:otherwise></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="chgFC">
			<xsl:choose>
			<xsl:when test="/form/@chg"><xsl:value-of select="substring(form/@chg,1,1)"/></xsl:when>
			<xsl:otherwise></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="delFC">
			<xsl:choose>
			<xsl:when test="/form/@del"><xsl:value-of select="substring(form/@del,1,1)"/></xsl:when>
			<xsl:otherwise></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="inqFC">
			<xsl:choose>
			<xsl:when test="/form/@inq"><xsl:value-of select="substring(form/@inq,1,1)"/></xsl:when>
			<xsl:otherwise></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="nxtFC">
			<xsl:choose>
			<xsl:when test="/form/@next"><xsl:value-of select="substring(form/@next,1,1)"/></xsl:when>
			<xsl:otherwise></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="preFC">
			<xsl:choose>
			<xsl:when test="/form/@next"><xsl:value-of select="substring(form/@next,2,1)"/></xsl:when>
			<xsl:otherwise></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>

		<!-- re-initialize the arrarys for form actions, transfers -->
		aFormFC=new Array();
		aFormFCText=new Array();
		aFormLink=new Array();
		aFormLinkText=new Array();
		aActionsFC=new Array();
		aActionsText=new Array();
		
		<!-- add special action icon -->
		createSpActionButton(lawformShowSpecialActions);

		<!-- button order specified in portalconfig.xml -->
		var btnOrder="";
		<xsl:choose>
			<xsl:when test="not(/form[@formid])">btnOrder=portalWnd.oPortalConfig.getSetting("erp_button_order","a|c|d|p|i|n");</xsl:when>
			<xsl:otherwise>				
				<xsl:for-each select="form/toolbar/button">
					btnOrder+="<xsl:value-of select="@value" />"+"|";
				</xsl:for-each>
			</xsl:otherwise>
		</xsl:choose>
		var btns = btnOrder.split("|");
		var btnLen = btns.length;

		for (var btnI = 0; btnI &lt; btnLen; btnI++)
		{
			switch (btns[btnI].toLowerCase())
			{
			case "a":
				<xsl:call-template name="standardtoolbutton">
					<xsl:with-param name="fc"><xsl:value-of select="$addFC"/></xsl:with-param>
					<xsl:with-param name="ico">add</xsl:with-param>
				</xsl:call-template>
				break;
			case "c":
				<xsl:call-template name="standardtoolbutton">
					<xsl:with-param name="fc"><xsl:value-of select="$chgFC"/></xsl:with-param>
					<xsl:with-param name="ico">chg</xsl:with-param>
				</xsl:call-template>
				break;
			case "d":
				<xsl:call-template name="standardtoolbutton">
					<xsl:with-param name="fc"><xsl:value-of select="$delFC"/></xsl:with-param>
					<xsl:with-param name="ico">del</xsl:with-param>
				</xsl:call-template>
				break;
			case "p":
				<xsl:call-template name="standardtoolbutton">
					<xsl:with-param name="fc"><xsl:value-of select="$preFC"/></xsl:with-param>
					<xsl:with-param name="ico">prev</xsl:with-param>
				</xsl:call-template>
				break;
			case "i":
				<xsl:call-template name="standardtoolbutton">
					<xsl:with-param name="fc"><xsl:value-of select="$inqFC"/></xsl:with-param>
					<xsl:with-param name="ico">inq</xsl:with-param>
				</xsl:call-template>
				break;
			case "n":
				<xsl:call-template name="standardtoolbutton">
					<xsl:with-param name="fc"><xsl:value-of select="$nxtFC"/></xsl:with-param>
					<xsl:with-param name="ico">next</xsl:with-param>
				</xsl:call-template>
				break;
			}
		}

		<!-- add dropdown options but don't draw a button for pageup/pagedn -->
		<xsl:if test="form/toolbar/button[@value='-']">
			aFormFC[aFormFC.length]="-";
			aFormFCText[aFormFCText.length]="<xsl:value-of select="form/toolbar/button[@value='-']/@nm"/>";
		</xsl:if>
		<xsl:if test="form/toolbar/button[@value='+']">
			aFormFC[aFormFC.length]="+";
			aFormFCText[aFormFCText.length]="<xsl:value-of select="form/toolbar/button[@value='+']/@nm"/>";
		</xsl:if>

		<!-- any additional buttons specified? -->
		<xsl:for-each select="form/toolbar/button[@visible='1']">
			<xsl:sort select="@nm" />			<!-- sorted by 'nm' attribute (the button text) -->
			<!-- exclude the standard actions and the page up/dn actions. Including page up/dn actions. They may be included if stated in design studio. via PT 177442 -->
			<xsl:if test="@value[.!=$addFC and .!=$chgFC and .!=$delFC and .!=$inqFC and .!=$nxtFC and .!=$preFC]">
				createButton("<xsl:value-of select="@nm" />", lawformDoFunctionClick, 'tbBtn<xsl:value-of select="@value" />', '', '<xsl:value-of select="@value" />', '');
			</xsl:if>
		</xsl:for-each>

		<xsl:for-each select="form/toolbar/button">
			<xsl:sort select="@nm" />			<!-- sorted by 'nm' attribute (the button text) -->
			<xsl:if test="@value[.!='-' and .!='+' and .!=$addFC and .!=$chgFC and .!=$delFC and .!=$inqFC and .!=$nxtFC and .!=$preFC]">
				aFormFC[aFormFC.length]="<xsl:value-of select="@value" />";
				aFormFCText[aFormFCText.length]="<xsl:value-of select="@nm" />";
				aActionsFC[aActionsFC.length]="<xsl:value-of select="@value" />";
				aActionsText[aActionsText.length]="<xsl:value-of select="@nm" />";
			</xsl:if>
		</xsl:for-each>

		<!-- add form actions dropdown button -->
		addSeparator();
		var title=portalWnd.erpPhrases.getPhrase("lblShowFormActions");
		addDropdownButton("actions",strDefaultFC,title,
			lawformDoDefaultFC,title,lawformShowActions);
		setDefaultFC()

		<!-- only enable special actions button if we have 'special' actions -->
		if (aActionsFC.length > 0)
			enableSpActionButton();

		</xsl:if>

		<!-- if we have any form transfers, add form transfers dropdown button -->
		<xsl:if test="/form/transfers/frm_trans or /form[@TYPE='BATCH' or @TYPE='IMPEXP']" >
			<xsl:for-each select="form/transfers/frm_trans">
				aFormLink[aFormLink.length]="<xsl:value-of select="@TOKEN"/>";
				aFormLinkText[aFormLinkText.length]="<xsl:value-of select="@TITLE"/> (<xsl:value-of select="@TOKEN"/>)";
			</xsl:for-each>

			var text=portalObj.getPhrase("LBL_RELATED_FORMS");
			var title=portalWnd.erpPhrases.getPhrase("lblShowFormTransfers");
			addDropdownButtonRight("links",text,title,
				lawformShowLinks,title,lawformShowLinks);
		</xsl:if>

	</xsl:otherwise>
	</xsl:choose>

</xsl:otherwise>
</xsl:choose>
	}
</xsl:template>

<!-- standard toolbutton template ==========================================-->
<xsl:template name="standardtoolbutton">
<xsl:param name="fc" />
<xsl:param name="ico" />

	<xsl:if test="form/toolbar/button[@value=$fc]">
		aFormFC[aFormFC.length]="<xsl:value-of select="$fc" />";
		aFormFCText[aFormFCText.length]="<xsl:value-of select="form/toolbar/button[@value=$fc]/@nm"/>";
		createButton("<xsl:value-of select="form/toolbar/button[@value=$fc]/@nm" />", lawformDoFunctionClick, 'tbBtn<xsl:value-of select="$fc" />', '', '<xsl:value-of select="$fc" />', '<xsl:value-of select="$ico"/>');
	</xsl:if>

</xsl:template>

<!-- script template =======================================================-->
<xsl:template match="XSCRIPT">
	<xsl:comment>
		<!-- Do not remove this it is needed to create \n -->
		<xsl:text>
		</xsl:text>

		<xsl:value-of select="." />

		<!-- Do not remove this it is needed to create \n -->
		<xsl:text>
		</xsl:text>
	</xsl:comment>
</xsl:template>

<!-- form template match ===================================================-->
<xsl:template match="form">
<xsl:param name="rootdir" />
<xsl:param name="iosVersion" />

	<!-- utility div/iframe -->
	<div id="utilContainer" class="xTUtilContainer" style="border:0px;cursor:move;display:none;z-index:100;position:absolute;overflow:hidden;width:100px;height:100px;top:0px;left:0px;" onmousedown="mdragStart(event)">
	<iframe id="utilFrame" frameborder="no">
		<xsl:attribute name="src"><xsl:value-of select="$rootdir"/>/blank.htm</xsl:attribute>
	</iframe>
	</div>
	<div id="utilDiv" style="position:absolute;top:0;left:0;width:100%;height:100%;background-color:transparent;display:none;z-index:99"></div>

	<!-- form properties -->
	<span id="form" style="display:none">
		<xsl:for-each select="./@*"><xsl:copy /></xsl:for-each>
	</span>

	<!-- form content container -->
	<div id="mainDiv" class="mainStyle">
		<xsl:attribute name="style">
			overflow:auto;		
			display:block;
			top:0px;
			width:100%;
			height:100%;
		</xsl:attribute>

		<span style="display:none"><xsl:value-of select="user:initForm(.)"/></span>

		<xsl:apply-templates select="fld[@tp!='Hidden']|push|BROWSER|LINE|TEXTAREA|tabregion|detail|scroll" />
		<!-- need rootdir parm for images -->
		<xsl:apply-templates select="IMAGE">
			<xsl:with-param name="rootdir"><xsl:value-of select="$rootdir"/></xsl:with-param>
			<xsl:with-param name="iosVersion"><xsl:value-of select="$iosVersion"/></xsl:with-param>
		</xsl:apply-templates>

	</div>

</xsl:template>

<!-- rectangle template ====================================================-->
<xsl:template match="fld[@tp='rect']">
	<div>
		<xsl:choose>
			<xsl:when test="@id"><xsl:attribute name="id"><xsl:value-of select="@id" /></xsl:attribute></xsl:when>
			<xsl:otherwise><xsl:attribute name="id">rect<xsl:value-of select="@row" /><xsl:value-of select="@col" /></xsl:attribute></xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="user:tokenIsFlowChart(string(ancestor::form/@TOKEN))">
				<xsl:choose>
					<xsl:when test="@height='1' or @width='1'">
						<xsl:attribute name="class">lineDraw</xsl:attribute>
					</xsl:when>
					<xsl:otherwise>
						<xsl:attribute name="class">rectDraw</xsl:attribute>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise><xsl:attribute name="class">rectLines</xsl:attribute></xsl:otherwise>
		</xsl:choose>
		<xsl:attribute name="style">
			top:<xsl:value-of select="user:getRectTop(.)" />;
			left:<xsl:value-of select="user:getRectLeft(.)" />;
			width:<xsl:value-of select="user:getRectWidth(.)" />;
			height:<xsl:value-of select="user:getRectHeight(.)" />;
			z-index:-1;
		</xsl:attribute>
	</div>
	<xsl:if test="@nm[.!='']">
		<div>
			<xsl:choose>
				<xsl:when test="@id"><xsl:attribute name="id"><xsl:value-of select="@id" />label</xsl:attribute></xsl:when>
				<xsl:otherwise><xsl:attribute name="id">rectlabel<xsl:value-of select="@row" /><xsl:value-of select="@col" /></xsl:attribute></xsl:otherwise>
			</xsl:choose>
			<xsl:attribute name="class"><xsl:value-of select="user:getRectLabelClass(.)" /></xsl:attribute>
			<xsl:attribute name="style">
				position:absolute;
				top:<xsl:value-of select="user:getRowPos(.)" />;
				left:<xsl:value-of select="user:getColPos(.)" />;
			</xsl:attribute>
			<xsl:value-of select="@nm" />
		</div>
	</xsl:if>
</xsl:template>

<!-- image template ======================================================-->
<xsl:template match="IMAGE[not(@tp) or @tp!='Hidden']">
<xsl:param name="rootdir" />
<xsl:param name="iosVersion" />
	<img class="tabArea">
		<xsl:attribute name="id"><xsl:value-of select="@nbr"/></xsl:attribute>
		<xsl:attribute name="name"><xsl:value-of select="user:getParentName(.)" /></xsl:attribute>
		<xsl:attribute name="style">
			top:<xsl:value-of select="user:getRowPos(.)" />;
			left:<xsl:value-of select="user:getColPos(.)" />;
			height:<xsl:value-of select="@height" />px;
			width:<xsl:value-of select="@width" />px;
		</xsl:attribute>
		<xsl:attribute name="src">
		<xsl:choose>
			<!-- 4.0 forward: name includes servlet call -->
			<xsl:when test="starts-with(@src,'/servlet')"><xsl:value-of select="@src"/></xsl:when>
			<!-- pre 4.0: name is relative filename, convert to servlet call (if not 8.0.3 Technology) -->
			<xsl:when test="starts-with($iosVersion,'8.0.3')"><xsl:value-of select="@src"/></xsl:when>
			<xsl:otherwise>/servlet/FileMgr?action=get&amp;folder=<xsl:value-of select="$rootdir"/>/content/images&amp;name=<xsl:value-of select="@src"/></xsl:otherwise>
		</xsl:choose>
		</xsl:attribute>
		<xsl:if test="@nm"><xsl:attribute name="alt"><xsl:value-of select="@nm" /></xsl:attribute></xsl:if>
		<xsl:attribute name="onclick">lawformImageOnClick(this)</xsl:attribute>
	</img>
</xsl:template>

<!-- browser template ======================================================-->
<xsl:template match="BROWSER[not(@tp) or @tp!='Hidden']">
	<iframe class="tabArea" frameborder="NO">
		<xsl:attribute name="id"><xsl:value-of select="@nbr"/></xsl:attribute>
		<xsl:attribute name="name"><xsl:value-of select="user:getParentName(.)" /></xsl:attribute>
		<xsl:attribute name="style">
			top:<xsl:value-of select="user:getRowPos(.)" />;
			left:<xsl:value-of select="user:getColPos(.)" />;
			width:<xsl:number value="(number(@width) * user:getFormColWidth())" />px;
			height:<xsl:number value="(number(@height) * user:getFormRowHeight())" />px;
		</xsl:attribute>
		<xsl:attribute name="src"><xsl:value-of select="@src" /></xsl:attribute>
	</iframe>
</xsl:template>

<!-- line template =========================================================-->
<xsl:template match="LINE[not(@tp) or @tp!='Hidden']">
	<div class="label">
		<xsl:attribute name="id"><xsl:value-of select="@nbr"/></xsl:attribute>
		<xsl:attribute name="name"><xsl:value-of select="user:getParentName(.)" /></xsl:attribute>
	<xsl:choose>
	<xsl:when test="@typ='horiz'">
		<xsl:attribute name="style">
			top:<xsl:value-of select="user:getRowPos(.)" />;
			left:<xsl:value-of select="user:getColPos(.)"/>;
			width:<xsl:value-of select="(number(@width) * user:getFormColWidth())"/>px;
			height:<xsl:value-of select="(number(@height) * user:getFormRowHeight())"/>px;
		</xsl:attribute>
		<span class="lineHoriz"><br/></span>
	</xsl:when>
	<xsl:otherwise>
		<xsl:attribute name="style">
			top:<xsl:value-of select="user:getRowPos(.)"/>;
			left:<xsl:value-of select="user:getColPos(.)"/>;
			width:<xsl:value-of select="(number(@width) * user:getFormColWidth())"/>px;
			height:<xsl:value-of select="(number(@height) * user:getFormRowHeight())"/>px;
		</xsl:attribute>
		<span class="lineVert"><br/></span>
	</xsl:otherwise>
	</xsl:choose>
	<xsl:if test="@nm!=''">
		<NOBR>
		<span>
			<xsl:attribute name="id"><xsl:value-of select="@nbr" />label</xsl:attribute>
			<xsl:attribute name="class"><xsl:value-of select="user:getRectLabelClass(.)" /></xsl:attribute>
			<xsl:attribute name="style">
				position:absolute;
				top:0;
				left:0;
			</xsl:attribute>
			<xsl:value-of select="@nm" />
		</span>
		</NOBR>
	</xsl:if>
	</div>
</xsl:template>

<!-- textarea template =====================================================-->
<xsl:template match="TEXTAREA[not(@tp) or @tp!='Hidden'] | fld[@tp='textArea']">
	<textarea onfocus="lawformTextAreaFocus(this)" onblur="lawformTextAreaBlur(this)">
		<xsl:attribute name="id"><xsl:value-of select="@nbr"/></xsl:attribute>
		<xsl:attribute name="name"><xsl:value-of select="user:getParentName(.)" /></xsl:attribute>
		<xsl:attribute name="nm"><xsl:value-of select="@nm" /></xsl:attribute>
		<xsl:attribute name="style">
			position:absolute;
			top:<xsl:value-of select="user:getRowPos(.)" />;
			left:<xsl:value-of select="user:getColPos(.)"/>;
			width:<xsl:value-of select="(number(@width) * user:getFormColWidth())"/>px;
			height:<xsl:value-of select="(number(@height) * user:getFormRowHeight())"/>px;
			<xsl:if test="@color">color:<xsl:value-of select="@color" />;</xsl:if>
			<xsl:if test="@font"><xsl:value-of select="@font" />;</xsl:if>
			<xsl:if test="@overflow">overflow:<xsl:value-of select="@overflow" />;</xsl:if>
		</xsl:attribute>
		<xsl:attribute name="wrap"><xsl:value-of select="@wrap"/></xsl:attribute>
		<xsl:attribute name="border"><xsl:value-of select="@border"/></xsl:attribute>
		<xsl:if test="@readonly='true'">
			<xsl:attribute name="readonly">true</xsl:attribute>
		</xsl:if>
	</textarea>
</xsl:template>

<!-- tabregion template ====================================================-->
<xsl:template match="tabregion">
<xsl:variable name="isSubRgn" select="boolean(ancestor::detail or ancestor::tabregion)"/>
	<span style="display:none"><xsl:value-of select="user:initTabArea(.)"/></span>
	<input type="hidden">
		<xsl:attribute name="nbr"><xsl:value-of select="@nbr" /></xsl:attribute>
		<xsl:attribute name="tp">tabregion</xsl:attribute>
		<xsl:attribute name="name"><xsl:value-of select="user:getParentName(.)" /></xsl:attribute>
	</input>
	<div class="tabArea">
		<xsl:attribute name="id"><xsl:value-of select="@nbr" /></xsl:attribute>
		<xsl:attribute name="typ"><xsl:value-of select="@typ" /></xsl:attribute>
		<xsl:attribute name="name"><xsl:value-of select="user:getParentName(.)" /></xsl:attribute>
		<xsl:attribute name="curtab"><xsl:value-of select="tab/@nbr" /></xsl:attribute>
		<xsl:attribute name="style">
			top:<xsl:value-of select="user:getRowPos(.)" />;
			height:<xsl:value-of select="user:getHeight(.)" />;
			width:<xsl:value-of select="user:getTabRegionWidth(.)" />;
			left:<xsl:value-of select="user:getTabRegionCol(.)" />;
		</xsl:attribute>

		<div class="tabContainer" lastVisible="">
			<xsl:attribute name="style">
				top:0px;
				left:0px;
				height:<xsl:value-of select="user:getFormRowHeight()" />px;
				width:<xsl:value-of select="user:getTabRegionWidth(.)" />;
			</xsl:attribute>
		<xsl:for-each select="tab[not(@tp) or @tp!='Hidden']">
			<div>
				<xsl:attribute name="id"><xsl:value-of select="@nbr" /></xsl:attribute>
				<xsl:attribute name="name"><xsl:value-of select="user:getParentName(.)" /></xsl:attribute>
				<xsl:attribute name="class">
					<xsl:choose>
						<xsl:when test="user:isActiveTab(.)">activeTab</xsl:when>
						<xsl:otherwise></xsl:otherwise>
					</xsl:choose>
				</xsl:attribute>
				<xsl:if test="not(@tabprot) or @tabprot='0'">
					<xsl:attribute name="onclick">portalWnd.frmSwitchTab(window, this)</xsl:attribute>
				</xsl:if>
				<xsl:variable name="tabString" select="normalize-space(@nm)" />
				<button tabIndex="-1" isTabLabel="1">
					<xsl:attribute name="id"><xsl:value-of select="@nbr" />BTN</xsl:attribute>
				<xsl:if test="not(@tabprot) or @tabprot='0'">
					<xsl:attribute name="onmouseover">this.className='tabButtonOver'</xsl:attribute>
					<xsl:attribute name="onmouseout">this.className=''</xsl:attribute>
				</xsl:if>
				<xsl:if test="@tabprot='1'">
					<xsl:attribute name="disabled">true</xsl:attribute>
				</xsl:if>
				<xsl:choose>
					<xsl:when test="boolean(user:isLongTabString($tabString))">
						<xsl:attribute name="title"><xsl:value-of select="@nm" /></xsl:attribute>
						<xsl:value-of select="user:getShortTabString($tabString)" />
					</xsl:when>
					<xsl:otherwise><xsl:value-of select="$tabString" /></xsl:otherwise>
				</xsl:choose>
				</button>

			</div>
		</xsl:for-each>
		</div>
		<img src="../images/ico_tab_bottom_active.gif">
			<xsl:attribute name="id">
				<xsl:if test="not($isSubRgn)">imgTabBottom</xsl:if>
				<xsl:if test="$isSubRgn">imgTabBottom<xsl:value-of select="@nbr" /></xsl:if>
			</xsl:attribute>
			<xsl:attribute name="style">
				position:absolute;display:inline;
				top:<xsl:value-of select="user:getFormRowHeight()" />px;
				height:1px;left:1px;width:75px;z-index:100;
			</xsl:attribute>
		</img>
		<xsl:apply-templates />
	</div>
</xsl:template>

<!-- tab pane template =====================================================-->
<xsl:template match="tab[not(@tp) or @tp!='Hidden']">
<xsl:variable name="isSubTab" select="boolean(user:isSubTab(.))"/>
	<div pane="true">
		<xsl:attribute name="id"><xsl:value-of select="@nbr" />PANE</xsl:attribute>
		<xsl:attribute name="fld"><xsl:value-of select="fld[@tp='Tab']/@nbr" /></xsl:attribute>
		<xsl:attribute name="name"><xsl:value-of select="user:getParentName(.)" /></xsl:attribute>
		<xsl:attribute name="isSubPane">
			<xsl:if test="not($isSubTab)">0</xsl:if>
			<xsl:if test="$isSubTab">1</xsl:if>
		</xsl:attribute>
		<xsl:choose>
		<xsl:when test="detail/@nbr"><xsl:attribute name="hasdtl"><xsl:value-of select="detail/@nbr" /></xsl:attribute></xsl:when>
		<xsl:otherwise><xsl:attribute name="hasdtl"></xsl:attribute></xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
		<xsl:when test="tabregion/@nbr"><xsl:attribute name="hastab"><xsl:value-of select="tabregion/@nbr" /></xsl:attribute></xsl:when>
		<xsl:otherwise><xsl:attribute name="hastab"></xsl:attribute></xsl:otherwise>
		</xsl:choose>
		<xsl:attribute name="class">
			<xsl:choose>
			<xsl:when test="$isSubTab">
				<xsl:choose>
				<xsl:when test="user:isActiveSubTab(.)">tabPaneActiveSub</xsl:when>
				<xsl:otherwise>tabPaneInactive</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
				<xsl:when test="user:isActiveTab(.)">tabPaneActive</xsl:when>
				<xsl:otherwise>tabPaneInactive</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
			</xsl:choose>
		</xsl:attribute>
		<xsl:attribute name="style">
			position:absolute;
			width:100%;
			height:100%;
			top:<xsl:value-of select="user:getFormRowHeight()" />px;
			<xsl:if test="@tabprot='1'">
				visibility:hidden;
			</xsl:if>
		</xsl:attribute>

		<xsl:choose>
			<xsl:when test="user:isCurrentTab(.)">
				<xsl:attribute name="painted">true</xsl:attribute>
				<xsl:apply-templates />
			</xsl:when>
			<xsl:otherwise>
				<xsl:attribute name="painted">false</xsl:attribute>
			</xsl:otherwise>
		</xsl:choose>

	</div>
</xsl:template>

<!-- detail template =======================================================-->
<xsl:template match="detail[not(@tp) or @tp='Detail']">
	<xsl:if test="fld[@tp!='Hidden']">
		<!-- initialize detail area div -->
		<xsl:variable name="fldnodes" select="child::fld[@tp='Fc' or @tp='Text' or @tp='Select' or (@tp='Out' and not(@dtlhdr))]" />
		<xsl:variable name="rownodes" select="child::row[@row]" />
		<span style="display:none"><xsl:value-of select="user:initDetailArea(., $fldnodes, $rownodes)"/></span>
		<input type="hidden">
			<xsl:attribute name="nbr"><xsl:value-of select="@nbr" /></xsl:attribute>
			<xsl:attribute name="tp">detail</xsl:attribute>
			<xsl:attribute name="name"><xsl:value-of select="user:getParentName(.)" /></xsl:attribute>
		</input>
		<div class="detailArea">
			<xsl:variable name="dtlWidth"><xsl:value-of select="user:getDtlWidth()" /></xsl:variable>
			<xsl:attribute name="id"><xsl:value-of select="@nbr" /></xsl:attribute>
			<xsl:attribute name="name"><xsl:value-of select="user:getParentName(.)" /></xsl:attribute>
			<xsl:attribute name="rows"><xsl:value-of select="count($rownodes)" /></xsl:attribute>
			<xsl:choose>
			<xsl:when test="tabregion/@nbr"><xsl:attribute name="tabregion"><xsl:value-of select="tabregion/@nbr" /></xsl:attribute></xsl:when>
			<xsl:otherwise><xsl:attribute name="tabregion"></xsl:attribute></xsl:otherwise>
			</xsl:choose>
			<xsl:attribute name="style">
				top:<xsl:value-of select="user:getRowPos(.)" />;
				height:<xsl:value-of select="user:getHeight(.)" />;
				width:<xsl:value-of select="$dtlWidth" />px;
				left:<xsl:value-of select="user:getDtlColPos(.)" />;
			</xsl:attribute>

			<!-- detail area header div -->
			<xsl:variable name="dtlHdrHeight" select="user:getDtlHdrHeight()" />
			<xsl:if test="./fld[@header='1' or @dtlhdr='1']">
			<div id="detailHeader" class="detailAreaHeader" >
				<xsl:attribute name="style">
					top:0px;
					height:<xsl:value-of select="$dtlHdrHeight" />;
					width:<xsl:value-of select="number($dtlWidth)-1" />px;
				</xsl:attribute>
		  		<xsl:apply-templates select="fld[@header='1' or @dtlhdr='1']" />
	  		</div>
			</xsl:if>

			<!-- detail area body div -->
			<div id="detailBody" class="detailAreaBody" >
			<xsl:attribute name="style">
				top:<xsl:value-of select="$dtlHdrHeight" />;
				height:<xsl:value-of select="user:getDtlBodyHeight()" />;
				width:<xsl:value-of select="number($dtlWidth)-1" />px;
			</xsl:attribute>

			<!-- output each row -->
	  		<xsl:for-each select="row">
				<span style="display:none"><xsl:value-of select="user:incDtlRowCnt()" /></span>
				<div>
					<xsl:choose>
						<xsl:when test="@rowID='0'">
					<xsl:attribute name="class">detailRowActive</xsl:attribute>
						</xsl:when>
						<xsl:otherwise>
					<xsl:attribute name="class"><xsl:if test="number(@rowID+1) mod 2">detailRowEven</xsl:if><xsl:if test="not(number(@rowID+1) mod 2)">detailRowOdd</xsl:if></xsl:attribute>
						</xsl:otherwise>
					</xsl:choose>
					<xsl:attribute name="rowIndex"><xsl:value-of select="user:getDtlRowCnt()"/></xsl:attribute>
					<xsl:attribute name="style">
						top:<xsl:value-of select="user:getDtlRowPos(.)" />;
						height:<xsl:value-of select="user:getHeight(.)" />;
						left:<xsl:value-of select="user:getRowCol(.)" />;
						width:<xsl:value-of select="user:getRowWidth()" />px;
					</xsl:attribute>
					<xsl:attribute name="id"><xsl:value-of select="parent::detail/@nbr" />ROW<xsl:value-of select="user:getDtlRowCnt()"/></xsl:attribute>

			  		<xsl:apply-templates select="parent::detail/fld[@tp!='label' and @tp!='Hidden' and @tp!='rect' and not(@dtlhdr)]" />
			  		<xsl:apply-templates select="parent::detail/push" />
			  		<xsl:apply-templates select="parent::detail/fld[@tp='label' and @repeat='true']" />
			  		<xsl:apply-templates select="parent::detail/IMAGE" />

				</div>
			</xsl:for-each>

	  		<xsl:apply-templates select="fld[@tp='label' and (not(@header='1')) and (not(@dtlhdr='1')) and not(@repeat)]" />
	  		<xsl:apply-templates select="LINE" />
			</div>
		</div>
		<xsl:apply-templates select="tabregion" />
	</xsl:if>
</xsl:template>

<!-- scroll template =======================================================-->
<xsl:template match="scroll">
	<div class="scrollGroup">
		<xsl:attribute name="style">
			overflow-x:auto;
			overflow-y:hidden;
			position:absolute;
			top:<xsl:value-of select="user:getRectTop(.)" />;
			left:<xsl:value-of select="user:getRectLeft(.)" />;
			width:<xsl:number value="(number(@width) * user:getFormColWidth())" />px;
			height:<xsl:value-of select="user:getRectHeight(.)" />;
		</xsl:attribute>
		<div>
			<xsl:attribute name="style">
				left:0;
				top:0;
				width:<xsl:number value="@scrollWidth * 8.5" />px;
				height:100%;
			</xsl:attribute>
			<xsl:apply-templates />
		</div>
	</div>
</xsl:template>

<!-- fc template ===========================================================-->
<xsl:template match="fld[@tp='Fc']">
<xsl:variable name="dataBind"><xsl:value-of select="user:dataBind(.)" /></xsl:variable>
	<input type="text" class="textBox" onfocus="lawformTextFocus(this)">
		<xsl:attribute name="id"><xsl:value-of select="$dataBind"/></xsl:attribute>
		<xsl:attribute name="name"><xsl:value-of select="user:getParentName(.)" /></xsl:attribute>
		<xsl:attribute name="nm"><xsl:value-of select="@nm" /></xsl:attribute>
		<xsl:attribute name="tp">fc</xsl:attribute>
		<xsl:attribute name="par"><xsl:value-of select="@par" /></xsl:attribute>
		<xsl:attribute name="det"><xsl:value-of select="@det" /></xsl:attribute>
		<xsl:if test="@deftkn"><xsl:attribute name="deftkn"><xsl:value-of select="@deftkn" /></xsl:attribute></xsl:if>
		<xsl:if test="@hdet"><xsl:attribute name="hdet"><xsl:value-of select="@hdet" /></xsl:attribute></xsl:if>
		<xsl:attribute name="tran"></xsl:attribute>
		<xsl:if test="@att_comment"><xsl:attribute name="attcmt"><xsl:value-of select="@att_comment" /></xsl:attribute></xsl:if>
		<xsl:if test="@att_url"><xsl:attribute name="atturl"><xsl:value-of select="@att_url" /></xsl:attribute></xsl:if>
		<xsl:attribute name="onblur">lawformTextBlur(this)</xsl:attribute>
		<xsl:attribute name="onchange">lawformFillLineDefaults(this)</xsl:attribute>
		<xsl:if test="@rtn"><xsl:attribute name="rtn"><xsl:value-of select="@rtn"/></xsl:attribute></xsl:if>
		<xsl:choose>
			<xsl:when test="@mxsz">
				<xsl:attribute name="maxlength"><xsl:value-of select="@mxsz"/></xsl:attribute>
			</xsl:when>
			<xsl:otherwise>
				<xsl:attribute name="maxlength"><xsl:value-of select="@sz"/></xsl:attribute>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:if test="@ed">
			<xsl:attribute name="edit"><xsl:value-of select="@ed"/></xsl:attribute>
		</xsl:if>
		<xsl:if test="@ed[.='numeric' or .='signed']">
			<xsl:attribute name="onkeypress">portalWnd.edCheckNumeric(event,this)</xsl:attribute>
			<xsl:attribute name="onkeyup">portalWnd.edCheckDec(event,this)</xsl:attribute>
		</xsl:if>
		<xsl:if test="@decsz">
			<xsl:attribute name="decsz"><xsl:value-of select="@decsz"/></xsl:attribute>
		</xsl:if>
		<xsl:if test="@keynbr">
			<xsl:attribute name="knb"><xsl:value-of select="@keynbr"/></xsl:attribute>
		</xsl:if>
		<xsl:attribute name="style">
			<xsl:if test="@ed[.='upper']">text-transform:uppercase;</xsl:if>
			left:<xsl:value-of select="user:getColPos(.)" />;
			top:<xsl:value-of select="user:getRowPos(.)" />;
			width:<xsl:value-of select="user:getTextWidth(.)" />;
		</xsl:attribute>
	</input>
	<xsl:if test="./vals">
		<span style="display:none;">
			<xsl:attribute name="id">VALUES<xsl:value-of select="$dataBind"/></xsl:attribute>
			<xsl:for-each select="./vals">
			<span>
				<xsl:attribute name="disp"><xsl:value-of select="@Disp"/></xsl:attribute>
				<xsl:attribute name="text"><xsl:value-of select="."/></xsl:attribute>
				<xsl:choose>
					<xsl:when test="@Tran"><xsl:attribute name="tran"><xsl:value-of select="@Tran"/></xsl:attribute></xsl:when>
					<xsl:otherwise><xsl:attribute name="tran"><xsl:value-of select="@Disp"/></xsl:attribute></xsl:otherwise>
				</xsl:choose>
			</span>
			</xsl:for-each>
		</span>
		<img class="selectButton" src="../images/ico_form_dropmenu.gif">
			<xsl:attribute name="style">
				top:<xsl:value-of select="user:getRowPos(.)" />;
				left:<xsl:value-of select="user:getSelectButtonCol(., boolean(ancestor::scroll))" />;
			</xsl:attribute>
			<xsl:attribute name="onclick">portalWnd.frmShowDropDown(window,'<xsl:value-of select="$dataBind"/>')</xsl:attribute>
			<xsl:attribute name="id">SELBUTTON<xsl:value-of select="$dataBind"/></xsl:attribute>
		</img>
	</xsl:if>
</xsl:template>

<!-- push button template ==================================================-->
<xsl:template match="push[not(@tp) or (@tp and @tp!='Hidden')]">
<xsl:variable name="dataBind"><xsl:value-of select="user:dataBind(.)" /></xsl:variable>
<xsl:variable name="bSetTitle" select="starts-with(@keynbr,'FC=') or contains(@keynbr,'=CM') or contains(@keynbr,'=UR')" />

	<xsl:choose>
	<xsl:when test="user:tokenIsFlowChart(string(ancestor::form/@TOKEN))">
		<!-- flow chart buttons ============================================-->
		<input type="button" class="flowChartButton" onselectstart="lawformOnBtnSelect(event)" hidefocus="true">
			<xsl:attribute name="onfocus">lawformButtonFocus(this)</xsl:attribute>
			<xsl:attribute name="onblur">lawformButtonBlur(this)</xsl:attribute>
			<xsl:attribute name="onmouseover">lawformButtonMouseOver(this)</xsl:attribute>
			<xsl:attribute name="onmouseout">lawformButtonMouseOut(this)</xsl:attribute>
			<xsl:attribute name="style">
				top:<xsl:value-of select="user:getRowPos(.)" />;
				left:<xsl:value-of select="user:getColPos(.)" />;
				width:<xsl:value-of select="user:getButtonWidth(.)" />;
				text-align:center;
				visibility:visible;
			</xsl:attribute>
			<xsl:attribute name="value"><xsl:value-of select="normalize-space(@btnnm)" /></xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="$dataBind" /></xsl:attribute>
			<xsl:attribute name="name"><xsl:value-of select="user:getParentName(.)" /></xsl:attribute>
			<xsl:attribute name="tp">push</xsl:attribute>
			<xsl:attribute name="knb"><xsl:value-of select="@keynbr" /></xsl:attribute>
			<xsl:attribute name="nm"><xsl:value-of select="@nm" /></xsl:attribute>
			<xsl:attribute name="par"><xsl:value-of select="@par" /></xsl:attribute>
			<xsl:attribute name="det"><xsl:value-of select="@det" /></xsl:attribute>
			<xsl:attribute name="onclick">lawformOnPush(event, this,'<xsl:value-of select="@keynbr" />')</xsl:attribute>
			<xsl:choose>
			<xsl:when test="@tooltip"><xsl:attribute name="title"><xsl:value-of select="@tooltip" /></xsl:attribute></xsl:when>
			<xsl:when test="boolean($bSetTitle)">
				<xsl:if test="@btnnm">
					<xsl:attribute name="title">(<xsl:value-of select="normalize-space(@btnnm)" />)</xsl:attribute>
				</xsl:if>
			</xsl:when>
			<xsl:otherwise><xsl:attribute name="title">(<xsl:value-of select="@keynbr" />)</xsl:attribute></xsl:otherwise>
			</xsl:choose>
		</input>
	</xsl:when>
	<xsl:otherwise>
		<!-- standard form buttons =========================================-->
		<div class="buttonBorder">
			<xsl:attribute name="style">
				<xsl:choose>
					<xsl:when test="@btnnm and normalize-space(@btnnm)!=''">visibility:visible;</xsl:when>
					<xsl:otherwise>visibility:hidden;</xsl:otherwise>
				</xsl:choose>
				position:absolute;
				top:<xsl:value-of select="user:getRowPos(.)" />;
				left:<xsl:value-of select="user:getColPos(.)" />;
				width:<xsl:value-of select="user:getButtonWidth(.)" />;
			</xsl:attribute>
		<button onselectstart="lawformOnBtnSelect(event)">
			<xsl:attribute name="onfocus">lawformButtonFocus(this)</xsl:attribute>
			<xsl:attribute name="onblur">lawformButtonBlur(this)</xsl:attribute>
			<xsl:attribute name="onmouseover">this.className='buttonOver'</xsl:attribute>
			<xsl:attribute name="onmouseout">this.className=''</xsl:attribute>
			<xsl:attribute name="onpropertychange">lawformButtonUpdate(this)</xsl:attribute>
			<xsl:attribute name="style">
				<xsl:choose>
					<xsl:when test="not(/form[@formid])">text-align:center;</xsl:when>
					<xsl:when test="@al">text-align:<xsl:value-of select="@al" />;</xsl:when>
					<xsl:otherwise>text-align:center;</xsl:otherwise>
				</xsl:choose>
			</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="$dataBind" /></xsl:attribute>
			<xsl:attribute name="name"><xsl:value-of select="user:getParentName(.)" /></xsl:attribute>
			<xsl:attribute name="tp">push</xsl:attribute>
			<xsl:attribute name="knb"><xsl:value-of select="@keynbr" /></xsl:attribute>
			<xsl:attribute name="nm"><xsl:value-of select="@nm" /></xsl:attribute>
			<xsl:attribute name="par"><xsl:value-of select="@par" /></xsl:attribute>
			<xsl:attribute name="det"><xsl:value-of select="@det" /></xsl:attribute>
			<xsl:attribute name="onclick">lawformOnPush(event, this,'<xsl:value-of select="@keynbr" />')</xsl:attribute>
			<xsl:choose>
			<xsl:when test="@tooltip"><xsl:attribute name="title"><xsl:value-of select="@tooltip" /></xsl:attribute></xsl:when>
			<xsl:when test="boolean($bSetTitle)">
				<xsl:if test="@btnnm">
					<xsl:attribute name="title">(<xsl:value-of select="normalize-space(@btnnm)" />)</xsl:attribute>
				</xsl:if>
			</xsl:when>
			<xsl:otherwise><xsl:attribute name="title">(<xsl:value-of select="@keynbr" />)</xsl:attribute></xsl:otherwise>
			</xsl:choose>
			<xsl:value-of select="normalize-space(@btnnm)" />
		</button>
		</div>
	</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<!-- hidden push button template ===========================================-->
<xsl:template match="push[@tp='Hidden']">
<xsl:variable name="dataBind"><xsl:value-of select="user:dataBind(.)" /></xsl:variable>
	<input type="button">
		<xsl:attribute name="id"><xsl:value-of select="$dataBind" /></xsl:attribute>
		<xsl:attribute name="style">
			visibility:hidden;
			top:<xsl:value-of select="user:getRowPos(.)" />;
			left:<xsl:value-of select="user:getColPos(.)" />;
			width:<xsl:value-of select="user:getButtonWidth(.)" />;
		</xsl:attribute>
		<xsl:attribute name="name"><xsl:value-of select="user:getParentName(.)" /></xsl:attribute>
		<xsl:attribute name="tp">push</xsl:attribute>
		<xsl:attribute name="knb"><xsl:value-of select="@keynbr" /></xsl:attribute>
		<xsl:attribute name="nm"><xsl:value-of select="@nm" /></xsl:attribute>
		<xsl:attribute name="par"><xsl:value-of select="@par" /></xsl:attribute>
		<xsl:attribute name="det"><xsl:value-of select="@det" /></xsl:attribute>
		<xsl:attribute name="hide">1</xsl:attribute>
		<!-- onclick needed for scripting purposes -->
		<xsl:attribute name="onclick">lawformOnPush(event, this,'<xsl:value-of select="@keynbr" />')</xsl:attribute>
	</input>
</xsl:template>

<!-- checkbox template =====================================================-->
<xsl:template match="fld[@tp='Select' and @seltype='check']">
<xsl:variable name="dataBind"><xsl:value-of select="user:dataBind(.)" /></xsl:variable>
	<div class="label">
		<xsl:attribute name="style">
			left:<xsl:value-of select="user:getColPos(.)" />;
			top:<xsl:value-of select="user:getRowPos(.)" />;
			width:<xsl:value-of select="user:getTextWidth(.)" />;
			<xsl:choose>
				<xsl:when test="@al[.='right']">text-align:right;</xsl:when>
				<xsl:otherwise>text-align:left;</xsl:otherwise>
			</xsl:choose>
		</xsl:attribute>
	<xsl:choose>
		<xsl:when test="@al[.='left']">
		<NOBR>
			<input type="checkbox" style="position:absolute;top:3px;left:0px;height:16px;width:16px;">
				<xsl:attribute name="id"><xsl:value-of select="$dataBind" /></xsl:attribute>
				<xsl:attribute name="tp"><xsl:value-of select="@tp"/></xsl:attribute>
				<xsl:attribute name="name"><xsl:value-of select="user:getParentName(.)" /></xsl:attribute>
				<xsl:attribute name="nm"><xsl:value-of select="@nm" /></xsl:attribute>
				<xsl:attribute name="par"><xsl:value-of select="@par" /></xsl:attribute>
				<xsl:attribute name="det"><xsl:value-of select="@det" /></xsl:attribute>
				<xsl:attribute name="xltis"><xsl:value-of select="//fld[@isxlt=$dataBind]/@nbr" /></xsl:attribute>
				<xsl:attribute name="tran"></xsl:attribute>
				<xsl:attribute name="onclick">lawformCheckboxOnClick(this)</xsl:attribute>
				<xsl:if test="@rtn"><xsl:attribute name="rtn"><xsl:value-of select="@rtn"/></xsl:attribute></xsl:if>
			</input>
			<xsl:if test="@label[.!='']">
			<label class="label" style="position:absolute;top:3px;left:24px;">
				<xsl:attribute name="id">CHECKLBL<xsl:value-of select="$dataBind" /></xsl:attribute>
				<xsl:attribute name="for"><xsl:value-of select="$dataBind" /></xsl:attribute>
				<xsl:value-of select="@label" />
			</label>
			</xsl:if>
		</NOBR>
		</xsl:when>
		<xsl:otherwise>
		<NOBR>
			<xsl:if test="@label[.!='']">
			<label class="label" style="position:absolute;top:3px;left:expression(parentElement.parentElement.offsetWidth-this.offsetWidth-24);">
				<xsl:attribute name="id">CHECKLBL<xsl:value-of select="$dataBind" /></xsl:attribute>
				<xsl:attribute name="for"><xsl:value-of select="$dataBind" /></xsl:attribute>
				<xsl:value-of select="@label" />
			</label>
			</xsl:if>
			<input type="checkbox" style="position:absolute;top:3px;height:16px;width:16px;left:expression(parentElement.parentElement.offsetWidth-16);">
				<xsl:attribute name="id"><xsl:value-of select="$dataBind" /></xsl:attribute>
				<xsl:attribute name="tp"><xsl:value-of select="@tp"/></xsl:attribute>
				<xsl:attribute name="name"><xsl:value-of select="user:getParentName(.)" /></xsl:attribute>
				<xsl:attribute name="nm"><xsl:value-of select="@nm" /></xsl:attribute>
				<xsl:attribute name="par"><xsl:value-of select="@par" /></xsl:attribute>
				<xsl:attribute name="det"><xsl:value-of select="@det" /></xsl:attribute>
				<xsl:attribute name="xltis"><xsl:value-of select="//fld[@isxlt=$dataBind]/@nbr" /></xsl:attribute>
				<xsl:attribute name="tran"></xsl:attribute>
				<xsl:attribute name="onclick">lawformCheckboxOnClick(this)</xsl:attribute>
				<xsl:if test="@rtn"><xsl:attribute name="rtn"><xsl:value-of select="@rtn"/></xsl:attribute></xsl:if>
			</input>
		</NOBR>
		</xsl:otherwise>
	</xsl:choose>
	</div>
	<span style="display:none;">
		<xsl:attribute name="id">VALUES<xsl:value-of select="$dataBind"/></xsl:attribute>
		<xsl:for-each select="./vals">
		<span>
			<xsl:attribute name="checked"><xsl:value-of select="@checked"/></xsl:attribute>
			<xsl:attribute name="disp"><xsl:value-of select="@Disp"/></xsl:attribute>
			<xsl:attribute name="text"><xsl:value-of select="."/></xsl:attribute>
			<xsl:choose>
				<xsl:when test="@Tran"><xsl:attribute name="tran"><xsl:value-of select="@Tran"/></xsl:attribute></xsl:when>
				<xsl:otherwise><xsl:attribute name="tran"><xsl:value-of select="@Disp"/></xsl:attribute></xsl:otherwise>
			</xsl:choose>
		</span>
		</xsl:for-each>
	</span>
</xsl:template>

<!-- radio button template =================================================-->
<xsl:template match="fld[@tp='Select' and @seltype='radio']">
<xsl:variable name="dataBind"><xsl:value-of select="user:dataBind(.)" /></xsl:variable>
<xsl:variable name="parentName"><xsl:value-of select="user:getParentName(.)" /></xsl:variable>
	<div class="label">
		<xsl:attribute name="style">
			left:<xsl:value-of select="user:getColPos(.)" />;
			top:<xsl:value-of select="user:getRowPos(.)" />;
			width:<xsl:value-of select="user:getTextWidth(.)" />;
			<xsl:choose>
				<xsl:when test="@al[.='right']">text-align:right;</xsl:when>
				<xsl:otherwise>text-align:left;</xsl:otherwise>
			</xsl:choose>
		</xsl:attribute>

		<table cellpadding="0" cellspacing="0" border="0" style="position:static;">
			<xsl:for-each select="./vals">
				<xsl:variable name="pos"><xsl:value-of select="position()"/></xsl:variable>
				<xsl:if test="user:setTableTR(., 0, $pos)=1"><tr></tr></xsl:if>
				<td valign="top">
				<xsl:attribute name="align"><xsl:value-of select="parent::fld/@al"/></xsl:attribute>
				<nobr>
				<xsl:choose>
					<xsl:when test="parent::fld/@al[.='left']">
						<input type="radio" style="position:static;height:16px;width:16px;">
							<xsl:attribute name="id"><xsl:value-of select="$dataBind" /></xsl:attribute>
							<xsl:attribute name="name"><xsl:value-of select="$dataBind" /></xsl:attribute>
							<xsl:attribute name="nm"><xsl:value-of select="parent::fld/@nm" /></xsl:attribute>
							<xsl:attribute name="xltis"><xsl:value-of select="//fld[@isxlt=$dataBind]/@nbr" /></xsl:attribute>
							<xsl:attribute name="value"><xsl:value-of select="@Disp"/></xsl:attribute>
							<xsl:attribute name="par"><xsl:value-of select="parent::fld/@par" /></xsl:attribute>
							<xsl:attribute name="det"><xsl:value-of select="@det" /></xsl:attribute>
							<xsl:attribute name="onclick">lawformRadioBtnOnClick(this)</xsl:attribute>
							<xsl:if test="@rtn"><xsl:attribute name="rtn"><xsl:value-of select="@rtn"/></xsl:attribute></xsl:if>
							<xsl:choose>
								<xsl:when test="@Tran"><xsl:attribute name="tran"><xsl:value-of select="@Tran"/></xsl:attribute></xsl:when>
								<xsl:otherwise><xsl:attribute name="tran"><xsl:value-of select="@Disp"/></xsl:attribute></xsl:otherwise>
							</xsl:choose>
						</input>
						<label class="label" style="position:static;margin-left:4px;margin-right:6px;">
							<xsl:attribute name="id">RADIOLBL<xsl:value-of select="$dataBind" /></xsl:attribute>
							<xsl:value-of select="." />
						</label>
					</xsl:when>
					<xsl:otherwise>
						<label class="label" style="position:static;margin-right:4px;margin-left:6px;">
							<xsl:attribute name="id">RADIOLBL<xsl:value-of select="$dataBind" /></xsl:attribute>
							<xsl:value-of select="." />
						</label>
						<input type="radio" style="position:static;height:16;width:16;">
							<xsl:attribute name="id"><xsl:value-of select="$dataBind" /></xsl:attribute>
							<xsl:attribute name="name"><xsl:value-of select="$dataBind" /></xsl:attribute>
							<xsl:attribute name="nm"><xsl:value-of select="@nm" /></xsl:attribute>
							<xsl:attribute name="xltis"><xsl:value-of select="//fld[@isxlt=$dataBind]/@nbr" /></xsl:attribute>
							<xsl:attribute name="value"><xsl:value-of select="@Disp"/></xsl:attribute>
							<xsl:attribute name="par"><xsl:value-of select="parent::fld/@par" /></xsl:attribute>
							<xsl:attribute name="det"><xsl:value-of select="@det" /></xsl:attribute>
							<xsl:attribute name="onclick">lawformRadioBtnOnClick(this)</xsl:attribute>
							<xsl:if test="@rtn"><xsl:attribute name="rtn"><xsl:value-of select="@rtn"/></xsl:attribute></xsl:if>
							<xsl:choose>
								<xsl:when test="@Tran"><xsl:attribute name="tran"><xsl:value-of select="@Tran"/></xsl:attribute></xsl:when>
								<xsl:otherwise><xsl:attribute name="tran"><xsl:value-of select="@Disp"/></xsl:attribute></xsl:otherwise>
							</xsl:choose>
						</input>
					</xsl:otherwise>
				</xsl:choose>
				</nobr>
				</td>
				<xsl:if test="user:setTableTR(., 1, position())=1"><tr></tr></xsl:if>
			</xsl:for-each>
		</table>
	</div>
</xsl:template>

<!-- select template =======================================================-->
<xsl:template match="fld[@tp='Select' and (not(@seltype) or @seltype='')]">
<xsl:variable name="dataBind"><xsl:value-of select="user:dataBind(.)" /></xsl:variable>
<xsl:variable name="fldNbr"><xsl:value-of select="@nbr" /></xsl:variable>
	<input type="text" class="textBox" onfocus="lawformTextFocus(this)">
		<xsl:attribute name="id"><xsl:value-of select="$dataBind" /></xsl:attribute>
		<xsl:attribute name="name"><xsl:value-of select="user:getParentName(.)" /></xsl:attribute>
		<xsl:attribute name="nm"><xsl:value-of select="@nm" /></xsl:attribute>
		<xsl:attribute name="tp">select</xsl:attribute>
		<xsl:attribute name="knb"><xsl:value-of select="@keynbr" /></xsl:attribute>
		<xsl:if test="@deftkn"><xsl:attribute name="deftkn"><xsl:value-of select="@deftkn" /></xsl:attribute></xsl:if>
		<xsl:if test="@hdet"><xsl:attribute name="hdet"><xsl:value-of select="@hdet" /></xsl:attribute></xsl:if>
		<xsl:if test="@att_comment"><xsl:attribute name="attcmt"><xsl:value-of select="@att_comment" /></xsl:attribute></xsl:if>
		<xsl:if test="@att_url"><xsl:attribute name="atturl"><xsl:value-of select="@att_url" /></xsl:attribute></xsl:if>
		<xsl:attribute name="xltis"><xsl:value-of select="//fld[@isxlt=$fldNbr]/@nbr" /></xsl:attribute>
		<xsl:attribute name="par"><xsl:value-of select="@par" /></xsl:attribute>
		<xsl:attribute name="det"><xsl:value-of select="@det" /></xsl:attribute>
		<xsl:attribute name="tran"></xsl:attribute>
		<xsl:attribute name="onblur">lawformTextBlur(this)</xsl:attribute>
		<xsl:if test="@rtn"><xsl:attribute name="rtn"><xsl:value-of select="@rtn"/></xsl:attribute></xsl:if>
		<xsl:choose>
			<xsl:when test="@mxsz">
				<xsl:attribute name="maxlength"><xsl:value-of select="@mxsz"/></xsl:attribute>
			</xsl:when>
			<xsl:otherwise>
				<xsl:attribute name="maxlength"><xsl:value-of select="@sz"/></xsl:attribute>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:if test="@ed[.!='date']">
			<xsl:attribute name="size"><xsl:value-of select="@sz"/></xsl:attribute>
			<xsl:attribute name="maxlength"><xsl:value-of select="@sz" /></xsl:attribute>
		</xsl:if>
		<xsl:if test="@ed">
			<xsl:attribute name="edit"><xsl:value-of select="@ed"/></xsl:attribute>
		</xsl:if>
		<xsl:if test="@ed[.='numeric' or .='signed']">
			<xsl:attribute name="onkeypress">portalWnd.edCheckNumeric(event,this)</xsl:attribute>
			<xsl:attribute name="onkeyup">portalWnd.edCheckDec(event,this)</xsl:attribute>
		</xsl:if>
		<xsl:if test="@decsz">
			<xsl:attribute name="decsz"><xsl:value-of select="@decsz"/></xsl:attribute>
		</xsl:if>
		<xsl:attribute name="style">
			<xsl:if test="@al[.='right']">text-align:right;</xsl:if>
			<xsl:if test="@ed[.='upper']">text-transform:uppercase;</xsl:if>
			top:<xsl:value-of select="user:getRowPos(.)" />;
			left:<xsl:value-of select="user:getColPos(.)" />;
			width:<xsl:value-of select="user:getTextWidth(.)" />;
		</xsl:attribute>
	</input>
	<span style="display:none;">
		<xsl:attribute name="id">VALUES<xsl:value-of select="$dataBind"/></xsl:attribute>
		<xsl:for-each select="./vals">
		<span>
			<xsl:attribute name="disp"><xsl:value-of select="@Disp"/></xsl:attribute>
			<xsl:attribute name="text"><xsl:value-of select="."/></xsl:attribute>
			<xsl:choose>
				<xsl:when test="@Tran"><xsl:attribute name="tran"><xsl:value-of select="@Tran"/></xsl:attribute></xsl:when>
				<xsl:otherwise><xsl:attribute name="tran"><xsl:value-of select="@Disp"/></xsl:attribute></xsl:otherwise>
			</xsl:choose>
		</span>
		</xsl:for-each>
	</span>
	<img class="selectButton" src="../images/ico_form_dropmenu.gif">
		<xsl:attribute name="style">
			top:<xsl:value-of select="user:getRowPos(.)" />;
			left:<xsl:value-of select="user:getSelectButtonCol(., boolean(ancestor::scroll))"/>;
		</xsl:attribute>
		<xsl:attribute name="onclick">portalWnd.frmShowDropDown(window,'<xsl:value-of select="$dataBind" />')</xsl:attribute>
		<xsl:attribute name="id">SELBUTTON<xsl:value-of select="$dataBind" /></xsl:attribute>
	</img>
</xsl:template>

<!-- label template ========================================================-->
<xsl:template match="fld[@tp='label']">
	<span>
		<xsl:choose>
			<xsl:when test="@dtlhdr"><xsl:attribute name="class">detailHdrLabel</xsl:attribute></xsl:when>
			<xsl:when test="@header"><xsl:attribute name="class">detailHdrLabel</xsl:attribute></xsl:when>
			<xsl:otherwise><xsl:attribute name="class">label</xsl:attribute></xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="@nbr"><xsl:attribute name="id"><xsl:value-of select="@nbr" /></xsl:attribute></xsl:when>
			<xsl:when test="@id"><xsl:attribute name="id"><xsl:value-of select="@id" /></xsl:attribute></xsl:when>
			<xsl:otherwise><xsl:attribute name="id">label<xsl:value-of select="@row" /><xsl:value-of select="@col" /></xsl:attribute></xsl:otherwise>
		</xsl:choose>
		<xsl:attribute name="style">
			top:<xsl:value-of select="user:getRowPos(.)" />;
			left:<xsl:value-of select="user:getColPos(.)" />;
			width:<xsl:value-of select="user:getLabelWidth(.)" />;
			<xsl:choose>
				<xsl:when test="@al[.='right']">text-align:right;</xsl:when>
				<xsl:when test="@al[.='center']">text-align:center;</xsl:when>
				<xsl:otherwise>text-align:left;</xsl:otherwise>
			</xsl:choose>
			<xsl:if test="@color">color:<xsl:value-of select="@color" />;</xsl:if>
			<xsl:if test="@font"><xsl:value-of select="@font" />;</xsl:if>
		</xsl:attribute>
		<xsl:attribute name="name"><xsl:value-of select="user:getParentName(.)" /></xsl:attribute>
		<xsl:attribute name="tp">label</xsl:attribute>
		<xsl:value-of select="translate(@nm,':','')" />
	</span>
</xsl:template>

<!-- text field template ===================================================-->
<xsl:template match="fld[@tp='Text']">
<xsl:variable name="dataBind"><xsl:value-of select="user:dataBind(.)" /></xsl:variable>
	<input type="text" class="textBox" onblur="lawformTextBlur(this)" onfocus="lawformTextFocus(this)">
		<xsl:attribute name="id"><xsl:value-of select="$dataBind" /></xsl:attribute>
		<xsl:attribute name="name"><xsl:value-of select="user:getParentName(.)" /></xsl:attribute>
		<xsl:attribute name="nm"><xsl:value-of select="@nm" /></xsl:attribute>
		<xsl:attribute name="startval"></xsl:attribute>
		<xsl:attribute name="hasrule"><xsl:value-of select="@hrul" /></xsl:attribute>
		<xsl:attribute name="knb"><xsl:value-of select="@keynbr" /></xsl:attribute>
		<xsl:attribute name="tp">text</xsl:attribute>
		<xsl:if test="@rtn"><xsl:attribute name="rtn"><xsl:value-of select="@rtn"/></xsl:attribute></xsl:if>
		<xsl:if test="@deftkn"><xsl:attribute name="deftkn"><xsl:value-of select="@deftkn" /></xsl:attribute></xsl:if>
		<xsl:if test="@hdet"><xsl:attribute name="hdet"><xsl:value-of select="@hdet" /></xsl:attribute></xsl:if>
		<xsl:if test="@att_comment"><xsl:attribute name="attcmt"><xsl:value-of select="@att_comment" /></xsl:attribute></xsl:if>
		<xsl:if test="@att_url"><xsl:attribute name="atturl"><xsl:value-of select="@att_url" /></xsl:attribute></xsl:if>
		<xsl:if test="@tooltip"><xsl:attribute name="title"><xsl:value-of select="@tooltip" /></xsl:attribute></xsl:if>
		<xsl:attribute name="par"><xsl:value-of select="@par" /></xsl:attribute>
		<xsl:attribute name="det"><xsl:value-of select="@det" /></xsl:attribute>
		<xsl:choose>
			<xsl:when test="@password[.='1']">
				<xsl:attribute name="type">password</xsl:attribute>
			</xsl:when>
			<xsl:otherwise>
				<xsl:attribute name="type">text</xsl:attribute>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="@ed[.='date']">
				<xsl:attribute name="onkeypress">portalWnd.onCalKeyPress(event)</xsl:attribute>
				<xsl:attribute name="size"><xsl:value-of select="@sz"/></xsl:attribute>
				<xsl:if test="@sz[.!='4']">
					<xsl:attribute name="maxlength">10</xsl:attribute>
				</xsl:if>
				<xsl:if test="@sz[.='4']">
					<xsl:attribute name="maxlength">5</xsl:attribute>
				</xsl:if>
			</xsl:when>
			<xsl:when test="@ed[.='time']">
				<xsl:attribute name="size"><xsl:value-of select="@sz"/></xsl:attribute>
				<xsl:if test="@sz[.='4']">
					<xsl:attribute name="maxlength">5</xsl:attribute>
				</xsl:if>
				<xsl:if test="@sz[.!='4']">
					<xsl:attribute name="maxlength">8</xsl:attribute>
				</xsl:if>
			</xsl:when>
			<xsl:when test="@mxsz">
				<xsl:if test="@mxsz &gt; @sz">
					<xsl:attribute name="onmouseover">lawformTextMouseOver(this)</xsl:attribute>
					<xsl:attribute name="size"><xsl:value-of select="@sz"/></xsl:attribute>
					<xsl:if test="@tooltip"><xsl:attribute name="tooltip"><xsl:value-of select="@tooltip"/></xsl:attribute></xsl:if>
				</xsl:if>
				<xsl:attribute name="maxlength"><xsl:value-of select="@mxsz"/></xsl:attribute>					
			</xsl:when>
			<xsl:otherwise>
				<xsl:attribute name="maxlength"><xsl:value-of select="@sz"/></xsl:attribute>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:if test="@ed">
			<xsl:attribute name="edit"><xsl:value-of select="@ed"/></xsl:attribute>
		</xsl:if>
		<xsl:if test="@keynbr[.!='']">
			<xsl:attribute name="vcard_name">lawson.<xsl:value-of select="@keynbr" /></xsl:attribute>
		</xsl:if>
		<xsl:if test="@hsel[.='1']">
				<xsl:attribute name="hsel">1</xsl:attribute>
		</xsl:if>
		<xsl:if test="@ed[.='numeric' or .='signed']">
			<xsl:attribute name="onkeypress">portalWnd.edCheckNumeric(event,this)</xsl:attribute>
			<xsl:attribute name="onkeyup">portalWnd.edCheckDec(event,this)</xsl:attribute>
		</xsl:if>
		<xsl:if test="@decsz">
			<xsl:attribute name="decsz"><xsl:value-of select="@decsz"/></xsl:attribute>
		</xsl:if>
		<xsl:if test="@keynbr[.='@jn']">
			<xsl:attribute name="onkeypress">portalWnd.edCheckJobName(event,this)</xsl:attribute>
		</xsl:if>
		<xsl:if test="@ar[.='1']">
			<xsl:attribute name="altref">1</xsl:attribute>
		</xsl:if>
		<xsl:attribute name="style">
			<xsl:if test="@al[.='right']">text-align:right;</xsl:if>
			<xsl:if test="@al[.='center']">text-align:center;</xsl:if>
			<xsl:if test="@ed[.='upper']">text-transform:uppercase;</xsl:if>
			<xsl:if test="@ed[.='date']">font-size: 7pt;</xsl:if>
			top:<xsl:value-of select="user:getRowPos(.)" />;
			left:<xsl:value-of select="user:getColPos(.)" />;
			<xsl:choose>
			<xsl:when test="not(ancestor::scroll)">
				width:<xsl:value-of select="user:getTextWidth(.)" />;
			</xsl:when>
			<xsl:otherwise>
				width:97%;
				font-family:courier new;
			</xsl:otherwise>
			</xsl:choose>
		</xsl:attribute>
	</input>
	<xsl:choose>
	<xsl:when test="@hsel[.='1']">
		<img class="selectButton" src="../images/ico_form_dropselect.gif">
			<xsl:attribute name="style">
				top:<xsl:value-of select="user:getRowPos(.)" />;
				left:<xsl:value-of select="user:getSelectButtonCol(., boolean(ancestor::scroll))"/>;
			</xsl:attribute>
			<xsl:attribute name="id">SELBUTTON<xsl:value-of select="$dataBind"/></xsl:attribute>
			<xsl:attribute name="onclick">portalWnd.frmDoSelect(window,'<xsl:value-of select="@keynbr" />','<xsl:value-of select="$dataBind" />')</xsl:attribute>
		</img>
	</xsl:when>
	<xsl:when test="@ed[.='date']">
		<img class="selectButton" src="../images/ico_form_calendar.gif">
			<xsl:attribute name="style">
				top:<xsl:value-of select="user:getRowPos(.)" />;
				left:<xsl:value-of select="user:getSelectButtonCol(., boolean(ancestor::scroll))"/>;
			</xsl:attribute>
			<xsl:attribute name="id">SELBUTTON<xsl:value-of select="$dataBind"/></xsl:attribute>
			<xsl:attribute name="onclick">portalWnd.frmShowCalendar(window, '<xsl:value-of select="$dataBind" />')</xsl:attribute>
		</img>
	</xsl:when>
	</xsl:choose>
</xsl:template>

<!-- output field template =================================================-->
<xsl:template match="fld[@tp='Out']">
<xsl:variable name="dataBind"><xsl:value-of select="user:dataBind(.)" /></xsl:variable>
	<nobr>
	<label class="output">
		<xsl:attribute name="id"><xsl:value-of select="$dataBind" /></xsl:attribute>
		<xsl:attribute name="name"><xsl:value-of select="user:getParentName(.)" /></xsl:attribute>
		<xsl:attribute name="nm"><xsl:value-of select="@nm" /></xsl:attribute>
		<xsl:attribute name="tp">out</xsl:attribute>
		<xsl:attribute name="par"><xsl:value-of select="@par" /></xsl:attribute>
		<xsl:attribute name="det"><xsl:value-of select="@det" /></xsl:attribute>
		<xsl:if test="@rtn"><xsl:attribute name="rtn"><xsl:value-of select="@rtn"/></xsl:attribute></xsl:if>
		<xsl:if test="@ed"><xsl:attribute name="edit"><xsl:value-of select="@ed"/></xsl:attribute></xsl:if>
		<xsl:if test="@ar[.='1']"><xsl:attribute name="altref">1</xsl:attribute></xsl:if>
		<xsl:attribute name="style">
			overflow: hidden;
			top:<xsl:value-of select="user:getRowPos(.)"/>;
			left:<xsl:value-of select="user:getColPos(.)" />;
			width:<xsl:value-of select="user:getTextWidth(.)" />;
			<!-- Apply fixed-width font - chose size 52 for output detail fields to impact fewer forms -->
			<xsl:if test="@FIXED_WIDTH='true' or ancestor::scroll or number(@sz)>=70 or (number(@sz)>=52 and ancestor::detail)">
				font-family:courier new;
			</xsl:if>
			<xsl:if test="@ed[.='date']">font-size: 7pt;</xsl:if>
			<xsl:choose>
				<xsl:when test="@al[.='center']">text-align:center;</xsl:when>
				<xsl:when test="@al[.='right']">text-align:right;</xsl:when>
				<xsl:when test="@al[.='left']">text-align:left;</xsl:when>
				<xsl:when test="@ed='numeric' or @ed='signed'">text-align:right;</xsl:when>
				<xsl:otherwise>text-align:left;</xsl:otherwise>
			</xsl:choose>
		</xsl:attribute>
		<xsl:attribute name="title"></xsl:attribute>
	</label>
	</nobr>
</xsl:template>

<!-- hidden field template =================================================-->
<xsl:template match="fld[@tp='Hidden']">
<xsl:variable name="dataBind"><xsl:value-of select="user:dataBind(.)" /></xsl:variable>
	<input type="hidden">
		<xsl:attribute name="id"><xsl:value-of select="$dataBind" /></xsl:attribute>
		<xsl:attribute name="name"><xsl:value-of select="user:getParentName(.)" /></xsl:attribute>
		<xsl:attribute name="nm"><xsl:value-of select="@nm" /></xsl:attribute>
		<xsl:attribute name="tp">hidden</xsl:attribute>
		<xsl:attribute name="fldbtn"><xsl:value-of select="@fldbtn" /></xsl:attribute>
		<xsl:attribute name="det"><xsl:value-of select="@det" /></xsl:attribute>
		<xsl:attribute name="knb"><xsl:value-of select="@keynbr" /></xsl:attribute>
		<xsl:attribute name="xltis"><xsl:value-of select="//fld[@isxlt=$dataBind]/@nbr" /></xsl:attribute>
		<xsl:if test="@rtn"><xsl:attribute name="rtn"><xsl:value-of select="@rtn"/></xsl:attribute></xsl:if>
		<xsl:if test="@ar[.='1']"><xsl:attribute name="altref">1</xsl:attribute></xsl:if>
	</input>
</xsl:template>

</xsl:stylesheet>
