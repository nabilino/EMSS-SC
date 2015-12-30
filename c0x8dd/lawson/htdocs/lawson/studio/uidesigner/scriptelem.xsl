<?xml version="1.0"?>
<!-- $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/scriptelem.xsl,v 1.2.8.1.22.2 2012/08/08 12:48:51 jomeli Exp $ -->
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

<xsl:output method="html"/>

<xsl:template match="/">

	<table id="tblField" cellpadding="0" cellspacing="2" style="table-layout:fixed;margin-left:6px;margin-top:6px;width:90%">
		
		<!-- table heading -->
		<colgroup>
			<col width="35%" align="left"/>
			<col width="65%" align="left" style="overflow:none;"/>
		</colgroup>
		<thead>
			<tr>
				<td>
					<label onclick="top.designStudio.activeDesigner.source.myScript.sortList('id')" title="Sort by Id" 
						class="uiLabel" style="position:relative;font-size:7pt;cursor:hand;">ID</label>
				</td>
				<td>
					<label onclick="top.designStudio.activeDesigner.source.myScript.sortList('nm')" title="Sort by Name" 
						class="uiLabel" style="position:relative;font-size:7pt;cursor:hand;">Name</label>
				</td>
			</tr>
		</thead>
		<tbody>

		<xsl:choose>
		<xsl:when test="/*/@displayset[.='data']">
			<!-- data objects only -->
			<xsl:for-each select="//fld[@nbr and (@tp='Text' or @tp='Hidden' or @tp='Select' or @tp='Out')] | //push[@nbr]">
			<!-- sort, ignore case -->
			<xsl:sort select="translate(@id,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')" order="ascending"/>
			<tr>
			<td>
				<label onclick="top.designStudio.activeDesigner.source.myScript.pasteString(this.innerHTML)" 
						class="uiLabel" style="position:relative;font-size:7pt;cursor:hand;font-weight:normal;">
					<xsl:value-of select="@id" /></label>
			</td>
			<td>
				<NOBR><label onclick="top.designStudio.activeDesigner.source.myScript.pasteString(this.innerHTML)" 
						class="uiLabel" style="position:relative;font-size:7pt;cursor:hand;font-weight:normal;">
							<xsl:attribute name="title"><xsl:value-of select="@nm" /></xsl:attribute>
					<xsl:value-of select="@nm" />
				</label></NOBR>
			</td>
			</tr>
			</xsl:for-each>
		</xsl:when>
		<xsl:otherwise>			<!-- /*/@displayset[.='all'] -->
			<!-- all form objects (except detail row nodes) -->
			<xsl:for-each select="//*[not(@rowID)]">
			<!-- sort, ignore case -->
			<xsl:sort select="translate(@id,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')" order="ascending" />
			<tr>
			<td>
				<label onclick="top.designStudio.activeDesigner.source.myScript.pasteString(this.innerHTML)" 
						class="uiLabel" style="position:relative;font-size:7pt;cursor:hand;font-weight:normal;">
					<xsl:value-of select="@id" />
				</label>
			</td>
			<td>
				<NOBR><label onclick="top.designStudio.activeDesigner.source.myScript.pasteString(this.innerHTML)" 
						class="uiLabel" style="position:relative;font-size:7pt;cursor:hand;font-weight:normal;">
							<xsl:attribute name="title"><xsl:value-of select="@nm" /></xsl:attribute>
						<xsl:value-of select="@nm" />
				</label></NOBR>
			</td>
			</tr>
			</xsl:for-each>
		</xsl:otherwise>
		</xsl:choose>

		</tbody>

	</table>

</xsl:template>

</xsl:stylesheet>
