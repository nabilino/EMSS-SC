<?xml version="1.0" encoding="iso-8859-1"?>
<!-- $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/uidesigner.xsl,v 1.5.2.5.4.6.22.3 2012/08/08 12:48:51 jomeli Exp $ -->
<!-- $NoKeywords: $ -->
<!-- LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 -->
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

var nCols=80;				// form variables
var nRows=24;
var nColWidth=10;
var nRowHeight=24;

var	dtlHdrRows=0;
var	dtlBodyRows=0;
var	dtlCols=1;
var	dtlWidth=100;
var	dtlHeight=0;

//-----------------------------------------------------------------------------
function initDetail(dtllist,rowlist)
{
	var dtlNode=dtllist.item(0)
	dtlHdrRows = parseInt(dtlNode.getAttribute("hdrsize"));

	for( var i=1; i &lt; rowlist.length; i++)
	{
		if(parseInt(rowlist.item(i).getAttribute("row"))!=dtlHdrRows)
			break;
	}
	dtlCols=i
	dtlWidth=99.5/dtlCols

	dtlBodyRows = parseInt(dtlNode.getAttribute("height")) * parseInt(dtlNode.getAttribute("rowspan"))
	dtlHeight=dtlHdrRows+(Math.ceil(dtlBodyRows/dtlCols))

	return true;
}
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
function getDtlHdrHeight()
{
	return "" + ((dtlHdrRows/(dtlHdrRows+(Math.ceil(dtlBodyRows/dtlCols))))*100) + "%"
}
//-----------------------------------------------------------------------------
function getDtlHeight()
{
	return dtlHeight;
}

//-----------------------------------------------------------------------------
function getDtlRowWidth()
{
	return dtlWidth + "%"
}

//-----------------------------------------------------------------------------
function getFormRowHeight()
{
	return nRowHeight;
}

//-----------------------------------------------------------------------------
function isSelectable(nodelist,objMode,objTarg,bDtlAncestor,bTabAncestor)
{
	try {
		var	bSelectable=true;
		var curNode=nodelist.item(0)
		if (objMode == 0)		// design view
		{
			if (bTabAncestor)
				bSelectable=false;
			else if (bDtlAncestor)
			{
				if (curNode.nodeName != "tabregion")
					bSelectable=false;
			}
		}
		else if (objMode > 1)	// 2nd level+ of object view
			bSelectable=true;
		else if (bDtlAncestor &amp;&amp; curNode.nodeName == "tabregion" )
			bSelectable=true;
		else if (bTabAncestor &amp;&amp; curNode.parentNode.nodeName == "tab" )
		{
			var	trNode=curNode.parentNode.parentNode;
			if (trNode.parentNode.parentNode.nodeName == "tab"
			|| trNode.parentNode.parentNode.nodeName == "tabregion")
				bSelectable=false;
			else
				bSelectable=true;
		}
		else if (bDtlAncestor &amp;&amp; objTarg != "detail" )
			bSelectable=false;
		
		return bSelectable;

	} catch(e) { }
	return false;
}

//-----------------------------------------------------------------------------
function setTableTR(nodelist, child, pos)
{
	var curNode=nodelist.item(0)
	var across = parseInt(curNode.parentNode.getAttribute("across"))
	var totChild = parseInt(curNode.parentNode.childNodes.length)
	var bTR = 0											// Do not create table row tags
	
	switch (pos)
	{
	case 0:
		if (child == 1)
		{ 
			bTR = 1									// Create a table row tag
			tableRowCnt = 0
		}
		else if (((across * tableRowCnt) + 1) == child) 
			bTR = 1									// Create a table row tag
		break;
		
	case 1:
		if (child % across == 0) 
		{
			bTR = 1									// Create a table row tag
			tableRowCnt++
		}
		else if (child == totChild) 
		{
			bTR = 1									// Create a table row tag
			tableRowCnt++
		}
		break;			
	}

	return bTR
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
</msxsl:script>

<!-- global variables ======================================================-->

<!-- flowchart variable -->
<xsl:variable name="isFlowChart">
<xsl:choose>
	<xsl:when test="/form[@type='f']"><xsl:value-of select="boolean(true)"/></xsl:when>
	<xsl:otherwise><xsl:value-of select="boolean(false)"/></xsl:otherwise>
</xsl:choose>
</xsl:variable>

<!-- set object mode/target -->
<xsl:variable name="objMode" select="/form/@objmode" />
<xsl:variable name="objTarg" select="/form/@targetid" />

<!-- grid height, width variables -->
<xsl:variable name="gridx"><xsl:value-of select="/form/@gWidth"/></xsl:variable>
<xsl:variable name="gridy"><xsl:value-of select="/form/@gHeight"/></xsl:variable>

<!-- root template match ===================================================-->
<xsl:template match="/">
	<!-- this template is never applied -->
	<xsl:if test="user:initForm(.)"></xsl:if>
</xsl:template>

<!-- browser template match ================================================-->
<xsl:template match="BROWSER">
	<div class="uiTextBox">
		<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
		<xsl:attribute name="style">
			left:<xsl:value-of select="@col" />;
			top:<xsl:value-of select="@row" />;
			<xsl:choose>
				<xsl:when test="@height">height:<xsl:value-of select="@height" />;</xsl:when>
				<xsl:otherwise>height:1;</xsl:otherwise>
			</xsl:choose>
			width:<xsl:value-of select="@width" />;
		</xsl:attribute>
		<xsl:if test="not(user:isSelectable(.,number($objMode),string($objTarg),boolean(ancestor::detail),boolean(ancestor::tabregion)))">
			<xsl:attribute name="isSelectable">0</xsl:attribute>
		</xsl:if>
		<br/>
		<img hspace="4" style="position:relative;" unselectable="on">
			<xsl:attribute name="selectElement"><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:attribute name="src">images/browser.gif</xsl:attribute>
		</img>				
		<xsl:value-of select="@id" />: <xsl:value-of select="@src" />
	</div>
</xsl:template>

<!-- image template match ==================================================-->
<xsl:template match="IMAGE">
	<IMG>
		<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
		<xsl:attribute name="style">
			border: 1px dotted black;
			left:<xsl:value-of select="@col" />;
			top:<xsl:value-of select="@row" />;
			height:<xsl:value-of select="@height" />px;
			width:<xsl:value-of select="@width" />px;
		</xsl:attribute>
		<xsl:attribute name="src"><xsl:value-of select="@src" /></xsl:attribute>
		<xsl:attribute name="alt">
			<xsl:choose>
			<xsl:when test="@nm!=''"><xsl:value-of select="@nm" /></xsl:when>
			<xsl:otherwise><xsl:value-of select="@id"/></xsl:otherwise>
			</xsl:choose>
		</xsl:attribute>
		<xsl:if test="not(user:isSelectable(.,number($objMode),string($objTarg),boolean(ancestor::detail),boolean(ancestor::tabregion)))">
			<xsl:attribute name="isSelectable">0</xsl:attribute>
		</xsl:if>
	</IMG>
</xsl:template>

<!-- line template match ===================================================-->
<xsl:template match="LINE">
	<div class="uiLabel">
		<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
		<xsl:if test="not(user:isSelectable(.,number($objMode),string($objTarg),boolean(ancestor::detail),boolean(ancestor::tabregion)))">
			<xsl:attribute name="isSelectable">0</xsl:attribute>
		</xsl:if>
	<xsl:choose>
	<xsl:when test="@typ='horiz'">
		<xsl:attribute name="style">
			top:<xsl:value-of select="@row" />;
			left:<xsl:value-of select="@col"/>;
			width:<xsl:value-of select="@width"/>;
			height:1;
			border:1px dotted black;
		</xsl:attribute>
		<span unselectable="on" class="uiLineHoriz">
			<xsl:attribute name="selectElement"><xsl:value-of select="@id"/></xsl:attribute>
		</span>
	</xsl:when>
	<xsl:otherwise>
		<xsl:attribute name="style">
			top:<xsl:value-of select="@row"/>;
			left:<xsl:value-of select="@col"/>;
			width:1;
			height:<xsl:value-of select="@height"/>px;
			border:1px dotted black;
		</xsl:attribute>
		<span unselectable="on" class="uiLineVert">
			<xsl:attribute name="selectElement"><xsl:value-of select="@id"/></xsl:attribute>
		</span>
	</xsl:otherwise>
	</xsl:choose>
	<xsl:if test="@nm!=''">
		<NOBR>
		<span unselectable="on" class="uiRectLabel" style="position:absolute;top:0;left:0;padding-top:0;">
			<xsl:value-of select="@nm" />
		</span>
		</NOBR>
	</xsl:if>
	</div>
</xsl:template>

<!-- textarea template match ===============================================-->
<!--xsl:template match="TEXTAREA" -->
<xsl:template match="fld[@tp='textArea']">
	<textarea class="uiTextBox">
		<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
		<xsl:attribute name="wrap"><xsl:value-of select="@wrap"/></xsl:attribute>
		<xsl:if test="@readonly='true'">
			<xsl:attribute name="readonly">true</xsl:attribute>
		</xsl:if>
		<xsl:attribute name="readonly"><xsl:value-of select="@readonly"/></xsl:attribute>
		<xsl:attribute name="style">
			position:absolute;
			top:<xsl:value-of select="@row"/>;
			left:<xsl:value-of select="@col"/>;
			width:<xsl:number value="@width"/>;
			height:<xsl:value-of select="@height"/>;
			<xsl:if test="@border[.='0']">
				border:none;
			</xsl:if>
			<xsl:if test="@font!=''">
				font:<xsl:value-of select="@font"/>;
			</xsl:if>
			<xsl:if test="@color!=''">
				color:<xsl:value-of select="@color"/>;
			</xsl:if>
		</xsl:attribute>
		<xsl:if test="not(user:isSelectable(.,number($objMode),string($objTarg),boolean(ancestor::detail),boolean(ancestor::tabregion)))">
			<xsl:attribute name="isSelectable">0</xsl:attribute>
		</xsl:if>
	</textarea>
</xsl:template>

<!-- checkbox template match ===============================================-->
<xsl:template match="fld[@tp='Select' and @seltype='check']">
	<div>
		<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
		<xsl:attribute name="style">
			position:absolute;
			top:<xsl:value-of select="@row" />;
			left:<xsl:value-of select="@col"/>;
			width:<xsl:value-of select="@sz"/>;
			text-align:<xsl:value-of select="@al"/>;
			border:1px dotted black;
		</xsl:attribute>
		<xsl:if test="not(user:isSelectable(.,number($objMode),string($objTarg),boolean(ancestor::detail),boolean(ancestor::tabregion)))">
			<xsl:attribute name="isSelectable">0</xsl:attribute>
		</xsl:if>
	<xsl:choose>
		<xsl:when test="@al[.='left']">
		<NOBR>
			<input type="checkbox" style="position:static;" disabled="true" unselectable="on">
				<xsl:attribute name="id">CHECK<xsl:value-of select="@id" /></xsl:attribute>
			</input>
			<label class="uiLabel" style="position:static;">
				<xsl:attribute name="id">CHECKLBL<xsl:value-of select="@id" /></xsl:attribute>
				<xsl:attribute name="for"><xsl:value-of select="@id" /></xsl:attribute>
				<xsl:if test="@label=''"><xsl:text>  </xsl:text></xsl:if>
				<xsl:if test="@label!=''"><xsl:value-of select="@label" /></xsl:if>
			</label>
		</NOBR>
		</xsl:when>
		<xsl:otherwise>
		<NOBR>
			<label class="uiLabel" style="position:static;">
				<xsl:attribute name="id">CHECKLBL<xsl:value-of select="@id" /></xsl:attribute>
				<xsl:attribute name="for"><xsl:value-of select="@id" /></xsl:attribute>
				<xsl:if test="@label=''"><xsl:text>  </xsl:text></xsl:if>
				<xsl:if test="@label!=''"><xsl:value-of select="@label" /></xsl:if>
			</label>
			<input type="checkbox" style="position:static;" disabled="true" unselectable="on">
				<xsl:attribute name="id">CHECK<xsl:value-of select="@id" /></xsl:attribute>
			</input>
		</NOBR>
		</xsl:otherwise>
	</xsl:choose>
	</div>
</xsl:template>

<!-- radio template match =================================================-->
<xsl:template match="fld[@tp='Select' and @seltype='radio']">
	<div>
		<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
		<xsl:attribute name="name"><xsl:value-of select="@name"/></xsl:attribute>
		<xsl:attribute name="style">
			position:absolute;
			top:<xsl:value-of select="@row" />;
			left:<xsl:value-of select="@col"/>;
			width:<xsl:value-of select="@sz"/>;
			border:1px dotted black;
		</xsl:attribute>
		<xsl:if test="not(user:isSelectable(.,number($objMode),string($objTarg),boolean(ancestor::detail),boolean(ancestor::tabregion)))">
			<xsl:attribute name="isSelectable">0</xsl:attribute>
		</xsl:if>
		<xsl:if test="not(./vals)">
			<NOBR>
			<xsl:choose>
			<xsl:when test="@al[.='left']">
				<input type="radio" class="uiLabel" style="position:static" unselectable="on"></input>
				<label class="uiLabel" style="position:static">New Radio Button</label>
			</xsl:when>
			<xsl:otherwise>
				<label class="uiLabel" style="position:static">New Radio Button</label>
				<input type="radio" class="uiLabel" style="position:static" unselectable="on"></input>
			</xsl:otherwise>
			</xsl:choose>
			</NOBR>
		</xsl:if>
		<xsl:if test="./vals">
			<table cellpadding="0" cellspacing="0" border="0" style="margin:0;position:static;" unselectable="on">
			<xsl:for-each select="./vals">
				<xsl:if test="user:setTableTR(.,position(),0)=1"><tr/></xsl:if>
					<td valign="top" style="position:static;">
						<xsl:attribute name="align"><xsl:value-of select="parent::fld/@al"/></xsl:attribute>
					<NOBR>
					<xsl:choose>
					<xsl:when test="parent::fld/@al[.='left']">
						<input type="radio" class="uiLabel" style="position:static;height:16;width:16;" unselectable="on"></input>
						<label class="uiLabel" style="position:static;margin-left:4px;margin-right:6px;">
							<xsl:value-of select="./text()"/>
						</label>
					</xsl:when>
					<xsl:otherwise>
						<label class="uiLabel" style="position:static;margin-right:4px;margin-left:6px;">
							<xsl:value-of select="./text()"/>
						</label>
						<input type="radio" class="uiLabel" style="position:static;height:16;width:16;" unselectable="on"></input>
					</xsl:otherwise>
					</xsl:choose>
					</NOBR>
					</td>
					<xsl:if test="user:setTableTR(.,position(),1)=1"><tr/></xsl:if>
			</xsl:for-each>
			</table>
		</xsl:if>
	</div>
</xsl:template>

<!-- select list template match ============================================-->
<xsl:template match="fld[@tp='Select' and (not(@seltype) or @seltype='')]">
	<input type="button" class="uiDropMenu">
		<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
		<xsl:attribute name="style">
			position:absolute;
			top:<xsl:value-of select="@row" />;
			left:<xsl:value-of select="@col"/>;
			<xsl:choose>
				<xsl:when test="@sz='1'">width:<xsl:number value="@sz+2"/>;</xsl:when>
				<xsl:otherwise>width:<xsl:number value="@sz+1"/>;</xsl:otherwise>
			</xsl:choose>
			<xsl:choose>
				<xsl:when test="@height">height:<xsl:value-of select="@height" />;</xsl:when>
				<xsl:otherwise>height:1;</xsl:otherwise>
			</xsl:choose>
		</xsl:attribute>
		<xsl:if test="not(user:isSelectable(.,number($objMode),string($objTarg),boolean(ancestor::detail),boolean(ancestor::tabregion)))">
			<xsl:attribute name="isSelectable">0</xsl:attribute>
		</xsl:if>
	</input>
</xsl:template>

<!-- detail template match =================================================-->
<xsl:template match="detail">
<xsl:variable name="rownodes" select="child::row[@row]" />
<xsl:if test="user:initDetail(., $rownodes)">
</xsl:if>
	<div class="uiDetailArea">
		<xsl:attribute name="id"><xsl:value-of select="@id" /></xsl:attribute>
		<!-- holds the current element height as opposed to detail/@height -->
		<xsl:attribute name="curHeight"><xsl:value-of select="user:getDtlHeight()" /></xsl:attribute>
		<xsl:attribute name="style">
			overflow:auto;
			top:<xsl:value-of select="@row" />;
		<xsl:choose>
			<xsl:when test="@col">left:<xsl:value-of select="@col" />;</xsl:when>
			<xsl:otherwise>left:0;</xsl:otherwise>
		</xsl:choose>
			height:<xsl:value-of select="user:getDtlHeight()" />;
		<xsl:choose>
			<xsl:when test="@width">width:<xsl:value-of select="@width" />;</xsl:when>
			<xsl:otherwise>width:80;</xsl:otherwise>
		</xsl:choose>
		</xsl:attribute>
		<xsl:if test="not(user:isSelectable(.,number($objMode),string($objTarg),boolean(false),boolean(ancestor::tabregion)))">
			<xsl:attribute name="isSelectable">0</xsl:attribute>
		</xsl:if>

		<!-- insert detail area header? -->
		<xsl:if test="./fld[@header='1' or @dtlhdr='1']">
		<div id="detailHeader" class="uiDetailAreaHeader" >
			<xsl:attribute name="isSelectable">0</xsl:attribute>
			<xsl:attribute name="style">
				top:0%;
				height:<xsl:value-of select="user:getDtlHdrHeight()" />;
				width:100%;
			</xsl:attribute>
  		</div>
		</xsl:if>

		<!-- insert 1 row element -->
		<div id="detailRow" unselectable="on" isResizable="0" isMoveable="0" isGrid="0" isObject="1" isSelectable="0">
			<xsl:attribute name="class">uiDetailAreaBody</xsl:attribute>
			<xsl:attribute name="selectElement"><xsl:value-of select="parent::detail/@id"/></xsl:attribute>
			<xsl:attribute name="style">
				left:0;
				top:<xsl:number value="number(@hdrsize)*$gridy"/>; -->
				height:<xsl:number value="number(@rowspan)*$gridy"/>;
				width:<xsl:value-of select="user:getDtlRowWidth()"/>;
			</xsl:attribute>
		</div>
	</div>
</xsl:template>

<!-- label template match ==================================================-->
<xsl:template match="fld[@tp='label']">
	<input type="button" class="uiLabel">
		<xsl:attribute name="class">
		<xsl:choose>
			<xsl:when test="parent::detail">uiDetailLabel</xsl:when>
			<xsl:otherwise>uiLabel</xsl:otherwise>
		</xsl:choose>
		</xsl:attribute>
		<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
		<xsl:attribute name="style">
			padding-bottom:2px;
			overflow:hidden;
			text-align:top;
			top:<xsl:value-of select="@row" />;
			left:<xsl:value-of select="@col" />;
			width:<xsl:value-of select="@sz" />;
		<xsl:choose>
			<xsl:when test="@height">height:<xsl:value-of select="@height" />;</xsl:when>
			<xsl:otherwise>height:1;</xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="@al">text-align:<xsl:value-of select="@al" />;</xsl:when>
			<xsl:otherwise>text-align:left;</xsl:otherwise>
		</xsl:choose>
			border:1px dotted black;
			<xsl:if test="@color!=''">
				color:<xsl:value-of select="@color" />;
			</xsl:if>
			<xsl:if test="@font!=''">
				<xsl:value-of select="@font" />;
			</xsl:if>
		</xsl:attribute>
		<xsl:if test="not(user:isSelectable(.,number($objMode),string($objTarg),boolean(ancestor::detail),boolean(ancestor::tabregion)))">
			<xsl:attribute name="isSelectable">0</xsl:attribute>
		</xsl:if>
		<xsl:choose>
		<xsl:when test="@nm!=''">
			<xsl:attribute name="value"><xsl:value-of select="translate(@nm,':','')" /></xsl:attribute>
		</xsl:when>
		<xsl:otherwise>
			<xsl:attribute name="value">New Label</xsl:attribute>
		</xsl:otherwise>
		</xsl:choose>
	</input>
</xsl:template>

<!-- output template match ==================================================-->
<xsl:template match="fld[@tp='Out']">
	<input type="button" class="uiOutput">
		<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
		<xsl:attribute name="style">
			top:<xsl:value-of select="@row" />;
			left:<xsl:value-of select="@col" />;
			width:<xsl:value-of select="@sz" />;
		<xsl:choose>
			<xsl:when test="@height">height:<xsl:value-of select="@height" />;</xsl:when>
			<xsl:otherwise>height:1;</xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="@al">text-align:<xsl:value-of select="@al" />;</xsl:when>
			<xsl:otherwise>text-align:left;</xsl:otherwise>
		</xsl:choose>
			border:1px dotted black;
			<xsl:if test="@color!=''">
				color:<xsl:value-of select="@color" />;
			</xsl:if>
			<xsl:if test="@font!=''">
				<xsl:value-of select="@font" />;
			</xsl:if>
		</xsl:attribute>
		<xsl:if test="not(user:isSelectable(.,number($objMode),string($objTarg),boolean(ancestor::detail),boolean(ancestor::tabregion)))">
			<xsl:attribute name="isSelectable">0</xsl:attribute>
		</xsl:if>
		<xsl:if test="@nm!=''">
			<xsl:attribute name="value"><xsl:value-of select="@nm" /></xsl:attribute>
		</xsl:if>
	</input>
</xsl:template>

<!-- rectangle template match ==============================================-->
<xsl:template match="fld[@tp='rect']">
	<div class="uiFieldGroup">
		<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
		<xsl:attribute name="style">
			top:<xsl:value-of select="@row" />;
			left:<xsl:value-of select="@col"/>;
			<xsl:choose>
				<xsl:when test="@height">height:<xsl:value-of select="@height" />;</xsl:when>
				<xsl:otherwise>height:1;</xsl:otherwise>
			</xsl:choose>
			width:<xsl:value-of select="@width"/>;
		</xsl:attribute>
		<xsl:if test="not(user:isSelectable(.,number($objMode),string($objTarg),boolean(ancestor::detail),boolean(ancestor::tabregion)))">
			<xsl:attribute name="isSelectable">0</xsl:attribute>
		</xsl:if>
		<span>
		<xsl:choose>
			<xsl:when test="$isFlowChart">
				<xsl:attribute name="class">uiLineDraw</xsl:attribute>
			</xsl:when>
			<xsl:otherwise><xsl:attribute name="class">uiRectLines</xsl:attribute></xsl:otherwise>
		</xsl:choose>
		  	<xsl:attribute name="id"><xsl:value-of select="@id"/>LINES</xsl:attribute>
		  	<xsl:attribute name="selectElement"><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:attribute name="style">
		  		position:absolute;
				top:8;
				left:0;
				height:expression(parentElement.style.pixelHeight-10);
				width:100%;
			</xsl:attribute>
		</span>
		<xsl:if test="@nm!=''">
			<NOBR>
			<span class="uiRectLabel">
				<xsl:attribute name="id"><xsl:value-of select="@id"/>LABEL</xsl:attribute>
				<xsl:attribute name="selectElement"><xsl:value-of select="@id"/></xsl:attribute>
				<xsl:attribute name="style">
					position:absolute;
					left:0px;
					top:0px;
				</xsl:attribute>
				<xsl:value-of select="@nm" />
			</span>
			</NOBR>
		</xsl:if>
	</div>
</xsl:template>

<!-- text template match ===================================================-->
<xsl:template match="fld[@tp='Text']" >
	<input type="button">
		<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
	<xsl:choose>
		<xsl:when test="@hsel[.='1']">
			<xsl:attribute name="class">uiSelect</xsl:attribute>
		</xsl:when>
		<xsl:when test="@ed[.='date']">
			<xsl:attribute name="class">uiDate</xsl:attribute>
		</xsl:when>
		<xsl:otherwise>
			<xsl:attribute name="class">uiTextBox</xsl:attribute>
		</xsl:otherwise>
	</xsl:choose>
		<xsl:attribute name="style">
			position:absolute;
			top:<xsl:value-of select="@row" />;
			left:<xsl:value-of select="@col"/>;
			<xsl:choose>
				<xsl:when test="@height">height:<xsl:value-of select="@height" />;</xsl:when>
				<xsl:otherwise>height:1;</xsl:otherwise>
			</xsl:choose>
		<xsl:choose>
			<xsl:when test="@hsel[.='1']">
			<xsl:choose>
				<xsl:when test="@sz='1'">width:<xsl:number value="@sz+2"/>;</xsl:when>
				<xsl:otherwise>width:<xsl:number value="@sz+1"/>;</xsl:otherwise>
			</xsl:choose>
			</xsl:when>
			<xsl:otherwise>width:<xsl:number value="@sz"/>;</xsl:otherwise>
		</xsl:choose>
		</xsl:attribute>
		<xsl:if test="not(user:isSelectable(.,number($objMode),string($objTarg),boolean(ancestor::detail),boolean(ancestor::tabregion)))">
			<xsl:attribute name="isSelectable">0</xsl:attribute>
		</xsl:if>
	</input>
</xsl:template>

<!-- field group template match ============================================-->
<xsl:template match="tabregion">
<xsl:variable name="isSubRegion" select="boolean(ancestor::detail or ancestor::tabregion)"/>
<xsl:variable name="activegrp" select="child::tab[current()/@grp=@id]"/>
	<div class="uiFieldGroup">
		<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
		<xsl:attribute name="style">
			top:<xsl:value-of select="@row" />;
			<xsl:choose>
				<xsl:when test="@col">left:<xsl:value-of select="@col" />;</xsl:when>
				<xsl:otherwise>left:0;</xsl:otherwise>
			</xsl:choose>
			height:<xsl:value-of select="@height+1"/>;
			<xsl:choose>
				<xsl:when test="@width">width:<xsl:value-of select="@width" />;</xsl:when>
				<xsl:otherwise>width:80;</xsl:otherwise>
			</xsl:choose>
		</xsl:attribute>
		<xsl:if test="not(user:isSelectable(.,number($objMode),string($objTarg),boolean(ancestor::detail),boolean(ancestor::tabregion)))">
			<xsl:attribute name="isSelectable">0</xsl:attribute>
		</xsl:if>
	 	<div class="tabContainer" isSelectable="0">
			<xsl:attribute name="style">
				height:<xsl:value-of select="user:getFormRowHeight()" />px;
			</xsl:attribute>
			<xsl:attribute name="selectElement"><xsl:value-of select="@id"/></xsl:attribute>
		 	<div class="activeTab" isSelectable="0">
				<xsl:attribute name="id"><xsl:value-of select="$activegrp/@id"/>LABEL</xsl:attribute>
				<xsl:attribute name="selectElement"><xsl:value-of select="@id"/></xsl:attribute>
				<button isSelectable="0">
					<xsl:attribute name="selectElement"><xsl:value-of select="@id"/></xsl:attribute>
					<xsl:choose>
						<xsl:when test="$activegrp/@nm"><xsl:value-of select="$activegrp/@nm" /></xsl:when>
						<xsl:otherwise><xsl:value-of select="$activegrp/@id" /></xsl:otherwise>
					</xsl:choose>
				</button>
			</div>
		</div>

		<!-- always paint the current tab -->
		<xsl:apply-templates select="child::tab[current()/@grp=@id]"/>

	</div>
</xsl:template>

<!-- group template match ==================================================-->
<xsl:template match="tab">
<xsl:variable name="isSubTab" select="boolean(user:isSubTab(.))"/>
<xsl:variable name="selectElement" select="parent::tabregion/@id" />
 	<div isMoveable="0" isGrid="0">
		<xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
		<xsl:attribute name="selectElement"><xsl:value-of select="$selectElement"/></xsl:attribute>
		<xsl:attribute name="class">
			<xsl:choose>
				<xsl:when test="not($isSubTab)">uiTabPaneActive</xsl:when>
				<xsl:otherwise>uiTabPaneActiveSub</xsl:otherwise>
			</xsl:choose>
		</xsl:attribute>
		<xsl:attribute name="style">
			position:absolute;
			top:<xsl:value-of select="user:getFormRowHeight()" />px;
			left:0;
			width:100%;
			height:expression(parentElement.style.pixelHeight-(<xsl:value-of select="number(user:getFormRowHeight())+2" />));
		</xsl:attribute>
 	</div>
</xsl:template>

<!-- push template match ===================================================-->
<xsl:template match="push[not(@tp) or (@tp and @tp!='Hidden')]">
	<input type="button" class="uiButtonLink">
		<xsl:attribute name="style">
			top:<xsl:value-of select="@row" />;
			left:<xsl:value-of select="@col" />;
			<xsl:choose>
				<xsl:when test="@height">height:<xsl:value-of select="@height" />;</xsl:when>
				<xsl:otherwise>height:1;</xsl:otherwise>
			</xsl:choose>
			width:<xsl:value-of select="@sz" />;
			<xsl:choose>
				<xsl:when test="@al">text-align:<xsl:value-of select="@al" />;</xsl:when>
				<xsl:otherwise>text-align:center;</xsl:otherwise>
			</xsl:choose>
		</xsl:attribute>
		<xsl:attribute name="id"><xsl:value-of select="@id" /></xsl:attribute>
		<xsl:attribute name="value">
			<xsl:choose>
			<xsl:when test="@btnnm!=''"><xsl:value-of select="normalize-space(@btnnm)" /></xsl:when>
			<xsl:when test="@nm!=''"><xsl:value-of select="@nm" /></xsl:when>
			<xsl:otherwise>New Button</xsl:otherwise>
			</xsl:choose>
		</xsl:attribute>
		<xsl:if test="not(user:isSelectable(.,number($objMode),string($objTarg),boolean(ancestor::detail),boolean(ancestor::tabregion)))">
			<xsl:attribute name="isSelectable">0</xsl:attribute>
		</xsl:if>
	</input>
</xsl:template>

<!-- vals template match ===================================================-->
<xsl:template match="vals">
	<!-- do nothing...required so as not to render text of node -->
</xsl:template>

</xsl:stylesheet>
