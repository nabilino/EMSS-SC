<?xml version="1.0"?>
<!-- $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/dialogs/foldersel.xsl,v 1.3.30.2 2012/08/08 12:37:24 jomeli Exp $ -->
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

<xsl:output method="html"/>

<xsl:template match="/">
	<span id="filediv" style="background-color:white;font-size:8pt;width:100%">
		<xsl:for-each select="//FOLDER">
		<xsl:sort select="text()" />
			<div class="dsListText" onclick="dlgOnFileClick(this)" type="folder">
				<xsl:attribute name="id">fileRow<xsl:value-of select="position()" /></xsl:attribute>
				<xsl:attribute name="value"><xsl:value-of select="text()" /></xsl:attribute>
				<xsl:attribute name="ondblclick">dlgOnSelectFolder('<xsl:value-of select="text()"/>')</xsl:attribute>
				<span style="top:0;left:0;width:10%;text-align:center;">
					<img border="0">
						<xsl:attribute name="src">../images/folder.gif</xsl:attribute>
					</img>
				</span>
				<span style="top:0;width:90%;text-align:left;font-family:verdana;font-size:10px;padding-bottom:4px;">
					<xsl:value-of select="text()" />
				</span>
			</div>
		</xsl:for-each>
	</span>
</xsl:template>

</xsl:stylesheet>