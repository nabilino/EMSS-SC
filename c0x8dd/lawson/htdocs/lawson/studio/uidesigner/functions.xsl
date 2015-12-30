<?xml version="1.0"?>
<!-- $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/functions.xsl,v 1.2.34.2 2012/08/08 12:48:51 jomeli Exp $ -->
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
	<table id="tblField" cellpadding="0" cellspacing="2" style="margin-left:6px;margin-top:6px;font-size:8pt;width:90%">
		
		<!-- table heading -->
		<colgroup>
			<col width="100%" align="left"/>
		</colgroup>
		<thead>
			<tr>
				<td><label class="uiLabel" style="position:relative;font-size:7pt;">
					<xsl:value-of select="/*/@methodslabel" />
					</label>
				</td>
			</tr>
		</thead>
		
		<tbody>
		<xsl:for-each select="//FUNCTION">
			<tr>
			<td>
				<label class="uiLabel" style="position:relative;font-size:7pt;cursor:hand;font-weight:normal;">
					<xsl:attribute name="onclick">top.designStudio.activeDesigner.source.myScript.pastePrototype('<xsl:value-of select="@name"/>')</xsl:attribute>
					<xsl:value-of select="@name" />
				</label>
			</td>
			</tr>
		</xsl:for-each>
		</tbody>

	</table>
</xsl:template>

</xsl:stylesheet>
