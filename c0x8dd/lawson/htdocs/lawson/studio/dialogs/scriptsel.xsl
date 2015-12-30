<?xml version="1.0"?>
<!-- $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/dialogs/scriptsel.xsl,v 1.1.34.2 2012/08/08 12:48:48 jomeli Exp $ -->
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

<xsl:template match="/">
	<select id="selFiles" class="dsListText" size="12" multiple="true" style="width:260px;height:expression(this.size*17);">
		<xsl:for-each select="//FILELIST/FILE">
		<xsl:sort select="text()" />
			<option>
				<xsl:attribute name="value"><xsl:value-of select="text()" /></xsl:attribute>
				<xsl:value-of select="text()" />
			</option>
		</xsl:for-each>
	</select>
</xsl:template>

</xsl:stylesheet>