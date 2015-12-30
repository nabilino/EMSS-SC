<?xml version="1.0"?>
<!-- $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/dialogs/transaction.xsl,v 1.1.34.2 2012/08/08 12:48:49 jomeli Exp $ -->
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
	exclude-result-prefixes="msxsl">

<xsl:template match="/">
	<table id="tblField" cellpadding="0" cellspacing="0" bgcolor="white" style="font-size:8px;width:100%">
		<colgroup>
			<col width="10%" align="center"/>
			<col width="90%" align="left"/>
		</colgroup>
		<tbody>
		<xsl:for-each select="//fld[@nbr and (@tp='Text' or @tp='Hidden' or @tp='Select' or @tp='Out')] | //push[@nbr]">
		<xsl:sort select="@nm" />
			<xsl:if test="@nm and not(@nm='')">
				<tr>
				<td valign="center">
					<input type="checkbox" style="margin:0px;">
						<xsl:attribute name="id">cbx<xsl:value-of select="@nm" /></xsl:attribute>
						<xsl:attribute name="nbr"><xsl:value-of select="@nbr" /></xsl:attribute>
						<xsl:attribute name="name">fldCheckBox</xsl:attribute>
						<xsl:attribute name="fldname"><xsl:value-of select="@nm" /></xsl:attribute>
						<xsl:if test="@isxlt and not(isxlt='')">
							<xsl:attribute name="isxlt">true</xsl:attribute>
						</xsl:if>
						<xsl:if test="(@req and @req='1') or (@nextreq and @nextreq='1')">
							<xsl:attribute name="checked">true</xsl:attribute>
							<xsl:attribute name="disabled">true</xsl:attribute>
						</xsl:if>
					</input>
				</td>
				<td valign="center" nowrap="false">
					<label class="dsLabel" style="position:relative;text-align:left;font-size:9px;">
						<xsl:attribute name="for">cbx<xsl:value-of select="@nm" /></xsl:attribute>
						<xsl:if test="(@req and @req='1') or (@nextreq and @nextreq='1')">
							<xsl:attribute name="disabled">true</xsl:attribute>
						</xsl:if>
						<xsl:value-of select="@nm" />
					</label>
				</td>
				</tr>
			</xsl:if>
		</xsl:for-each>
		</tbody>
	</table>
</xsl:template>

</xsl:stylesheet>
