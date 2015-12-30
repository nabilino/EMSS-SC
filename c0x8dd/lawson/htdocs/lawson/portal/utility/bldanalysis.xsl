<?xml version="1.0"?>
<!-- $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/utility/bldanalysis.xsl,v 1.1.30.2 2012/08/08 12:37:21 jomeli Exp $ -->
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
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="xml"/>

<xsl:template match="/">
<xsl:element name="ENTRIES">
	<xsl:for-each select="/DME/RECORDS/RECORD/COLS">
<!--	<xsl:sort select="./COL[2]/text()" /> 		pdl -->
	<xsl:sort select="./COL[1]/text()" />		<!-- tkn -->
	<xsl:sort select="./COL[4]/text()" />		<!-- id  -->
		<xsl:element name="ENTRY">
			<xsl:attribute name="pdl"><xsl:value-of select="./COL[2]/text()" /></xsl:attribute>
			<xsl:attribute name="tkn"><xsl:value-of select="./COL[1]/text()" /></xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="./COL[4]/text()" /></xsl:attribute>
			<xsl:attribute name="file"><xsl:value-of select="./COL[5]/text()" /></xsl:attribute>
			<xsl:attribute name="path"><xsl:value-of select="./COL[6]/text()" /></xsl:attribute>
		</xsl:element>
	</xsl:for-each>
</xsl:element>
</xsl:template>

</xsl:stylesheet>
