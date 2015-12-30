<?xml version="1.0"?>
<!-- $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/uidesigner/wizards/erp_open.xsl,v 1.1.34.2 2012/08/08 12:48:54 jomeli Exp $ -->
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

<xsl:output method="html" />

<xsl:template match="/">
	<span id="fileDiv" style="background-color:white;font-size:8pt;width:100%">

	<xsl:for-each select="/DME/RECORDS/RECORD/COLS">
	<xsl:sort select="./COL[0]/text()" />
	<xsl:sort select="./COL[1]/text()" />
		<div class="dsListText" onclick="dlgOnFileClick(this)" type="file">
			<xsl:attribute name="id">fileRow<xsl:number value="position()" /></xsl:attribute>
			<xsl:attribute name="value"><xsl:value-of select="./COL[1]/text()" /></xsl:attribute>
			<xsl:attribute name="key"><xsl:value-of select="ancestor::RECORD/RECKEY/text()"/></xsl:attribute>
			<xsl:attribute name="ondblclick">dlgOnListDblClick()</xsl:attribute>
			<span style="top:0;left:0;width:10%;text-align:center;">
				<img border="0" src="../../images/file.gif" />
			</span>
			<!-- following span requires values all on one line to format correctly -->
			<span style="top:0;width:90%;text-align:left;overflow:hidden;position:relative;font-size:10px;padding-bottom:4px;">
			<NOBR><TT><xsl:value-of select="./COL[0]/text()" /><xsl:text>   </xsl:text><xsl:value-of select="./COL[1]/text()" /><xsl:text>   </xsl:text><xsl:value-of select="./COL[2]/text()" /><xsl:text>   </xsl:text><xsl:value-of select="./COL[3]/text()" /></TT></NOBR>
			</span>
		</div>
	</xsl:for-each>

	</span>
</xsl:template>

</xsl:stylesheet>
