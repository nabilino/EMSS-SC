<?xml version="1.0" encoding="ISO-8859-1"?>
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

<msxsl:script language="JScript" implements-prefix="user">
var nCols=80;				// form variables
var nRows=24;
var nColWidth=10;
var nRowHeight=24;
var firstRow = 1;

function getRowPos(nodelist)
{
   try {
   var curNode=nodelist.item(0)
   var rowVal=parseInt(curNode.getAttribute("row"))
   var rows=nRows
   rowVal=rowVal-firstRow
   return (rowVal != 0 ? "" + (rowVal*nRowHeight) + "px" : "3px");
   return curNode.getAttribute("row") + "px";
   }
   catch (e) {
     return "3px";
   }
}
//-----------------------------------------------------------------------------
function getColPos(nodelist)
{
	var strDefault="0px";
	try {
		var curNode=nodelist.item(0)
		var colVal=curNode.getAttribute("column");
		if (colVal==null) return strDefault;
		
	
		if (colVal == 0)
			colVal = 1;
		var calcColVal=(colVal*nColWidth);
		return "" + calcColVal +"px";

	} catch (e) {
		return strDefault;
	}
}
//-----------------------------------------------------------------------------
function getLabelWidth(nodelist)
{
	var strDefault="13px";
	try {
		var curNode=nodelist.item(0)
		var calcWidth=(parseInt(curNode.getAttribute("size"))*nColWidth);
		return "" + calcWidth + "px"

	} catch (e) {
		return strDefault
	}
}
//-----------------------------------------------------------------------------
function getTextWidth(nodelist)
{
	var strDefault="13px";
	try {
		var curNode=nodelist.item(0)
		if (curNode==null) return strDefault;

		var strSize = curNode.getAttribute("size");
		if (strSize==null) return strDefault;
		var size = parseInt(strSize);
		if(size==1) return strDefault;

		
		retVal=""+(size*nColWidth) + "px"
		return retVal

	} catch (e) {
		return strDefault
	}
}
</msxsl:script>
<xsl:template match="/">

<xsl:variable name="jobName"><xsl:value-of select="/*/*/@jobName" /></xsl:variable>
<xsl:variable name="jobOwner"><xsl:value-of select="/*/*/@jobOwner" /></xsl:variable>
<xsl:variable name="jobStepNumber"><xsl:value-of select="/*/*/@jobStepNumber" /></xsl:variable>
<xsl:variable name="token"><xsl:value-of select="/*/*/@token" /></xsl:variable>
<xsl:variable name="title"><xsl:value-of select="/*/*/@title" /></xsl:variable>
<xsl:variable name="type"><xsl:value-of select="/*/*/@type" /></xsl:variable>

  <html>
  <head>
  <script language="javascript">
	var jobName="<xsl:value-of select="$jobName" />";
	var jobOwner="<xsl:value-of select="$jobOwner" />";
	var jobStepNumber="<xsl:value-of select="$jobStepNumber" />";
	var token="<xsl:value-of select="$token" />"
	var title="<xsl:value-of select="$title" />"
	var type="<xsl:value-of select="$type" />"
	function xslInitFramework()
	{
		portalObj.setTitle(title,token,type);
		var tb=portalObj.toolbar
		<xsl:call-template name="toolbar">
		</xsl:call-template>
	}
  </script>
  </head>
	<body onload="actionframeworkOnLoad()">
	<!-- label template -->
	<xsl:apply-templates select="ACTION/FORM">
	</xsl:apply-templates>
	</body>
  </html>
</xsl:template>
<xsl:template match="LABEL">
<span>
<xsl:attribute name="class">label</xsl:attribute>
<xsl:attribute name="style">
top:<xsl:value-of select="user:getRowPos(.)"/>;
left:<xsl:value-of select="user:getColPos(.)" />;
width:<xsl:value-of select="user:getLabelWidth(.)" />;
<xsl:choose>
				<xsl:when test="@align[.='right']">text-align:right;</xsl:when>
				<xsl:when test="@align[.='center']">text-align:center;</xsl:when>
				<xsl:otherwise>text-align:left;</xsl:otherwise>
			</xsl:choose>
</xsl:attribute>
<xsl:value-of select="@text"/>
</span>
</xsl:template>
<!-- text field template ===================================================-->
<xsl:template match="FIELD">

	<input type="text" class="textBox" onblur="" onfocus="">
		<xsl:attribute name="id"><xsl:value-of select="@id" /></xsl:attribute>
		<xsl:attribute name="nm"><xsl:value-of select="@id" /></xsl:attribute>
		<xsl:attribute name="fieldType"><xsl:value-of select="@fieldType" /></xsl:attribute>
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

			

		</xsl:choose>
		<xsl:attribute name="maxlength"><xsl:value-of select="@size"/></xsl:attribute>
		<xsl:if test="@ed">
			<xsl:attribute name="edit"><xsl:value-of select="@ed"/></xsl:attribute>
		</xsl:if>

		<xsl:attribute name="style">
			<xsl:if test="@align[.='right']">text-align:right;</xsl:if>
			<xsl:if test="@align[.='center']">text-align:center;</xsl:if>
			<xsl:if test="@align[.='left']">text-align:left;</xsl:if>
			top:<xsl:value-of select="user:getRowPos(.)" />;
			left:<xsl:value-of select="user:getColPos(.)" />;
			width:<xsl:value-of select="user:getTextWidth(.)" />;
			position: absolute;
		</xsl:attribute>
	</input>
</xsl:template>
<xsl:template name="toolbar">
with(tb)
{
	createButton(portalObj.getPhrase('LBL_BACK'), lawformDoFunctionClick, 'btnCloseForm', '', 'F =JD', 'back');
	createButton(portalObj.getPhrase('LBL_CHANGE'), lawformDoFunctionClick, 'btnOKForm', '', 'C', 'chg');
	
}
</xsl:template>
</xsl:stylesheet>