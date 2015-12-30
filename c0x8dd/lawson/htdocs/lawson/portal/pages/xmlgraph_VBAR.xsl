<?xml version="1.0"?>
<!-- $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/pages/xmlgraph_VBAR.xsl,v 1.3.36.2 2012/08/08 12:37:25 jomeli Exp $ -->
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
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:v="urn:schemas-microsoft-com:vml" version="1.0">
	<xsl:template match="/">
		<!--// begin graph // -->
		<table id="graphcontainer" graphtype="VBAR" border="0" cellpadding="0" cellspacing="0" style="width:100%; height:100%;" class="graphcontainer">
			<tr>
				<td>&#160;</td>
				<td class="graphtitle" style="height:expression( this.clientHeight ); padding-bottom:5px;">
					<xsl:value-of select="//title"/>
				</td>
			</tr>
			<tr>
				<td style="width:expression( yaxis.clientWidth ); vertical-align:top">
					<!-- // begin y axis // -->
					<div id="ypos" style="position:relative; height:0; background-color:#FFFFFF">&#160;</div>
					<table id="yaxis" border="0" cellpadding="0" cellspacing="0" style="height:100%">
						<tr>
							<td class="graphcategory" style="writing-mode:tb-rl">
								<xsl:value-of select="//value"/>
							</td>
							<td id="ylabelcontainer" style="vertical-align:top">&#160;</td>
							<td id="yscale" style="width:5px">&#160;</td>
						</tr>
					</table>
					<!-- // end y axis // -->
				</td>
				<td id="graphbodycontainer">
					<!-- // begin graphbody // -->
					<div id="graphbody" class="graphbody" style="width:100%; height:100%">&#160;</div>
					<!-- // end graphbody // -->
				</td>
			</tr>
			<tr style="height:expression( xaxis.clientHeight )">
				<td>&#160;</td>
				<td style="vertical-align:top">
					<!-- // begin xaxis // -->
					<table id="xaxis" border="0" cellpadding="0" cellspacing="0" style="width:100%">
						<tr>
							<td id="xscale" style="height:5px; vertical-align:top">&#160;</td>
						</tr>
						<tr>
							<td id="xlabelcontainer" style="vertical-align:top; padding-top:3px;">
								<xsl:for-each select="//label">
									<div class="graphlabel">
										<xsl:attribute name="id">xlbl<xsl:value-of select="@value"/></xsl:attribute>
										<nobr><xsl:value-of select="@value"/></nobr>
									</div>
								</xsl:for-each>&#160;
									</td>
						</tr>
						<tr>
							<td class="graphcategory">
								<xsl:attribute name="style">
										height:expression(this.clientHeight);
										vertical-align:top;
										font-family:<xsl:value-of select="//GRAPHSTYLE/@font"/>;
										font-size:<xsl:value-of select="//GRAPHSTYLE/@size"/>;
										color:<xsl:value-of select="//GRAPHSTYLE/@color"/>;
								</xsl:attribute>
								<xsl:value-of select="//category"/>
							</td>
						</tr>
					</table>
					<!-- // end xaxis  // -->
				</td>
			</tr>
		</table>
		<!-- // begin legend // -->
		<div id="legend">
			<xsl:attribute name="style">position:absolute;top:0px; left:expression( graphcontainer.parentElement.offsetLeft + graphcontainer.offsetWidth - 200 ); filter:alpha( opacity=80 );  background-color:#FFFFFF</xsl:attribute>
			<table id="legendtbl" border="0" cellspacing="0" cellpadding="2" style="width:200px;" class="graphlegend">
				<tr>
					<td class="graphlegendhdr" colspan="2">
						<span style="width:15px;  text-align:center; cursor:hand; border-style:solid; border-width:1px;" onclick="setLegendVisibility()">x</span> Legend </td>
				</tr>
				<xsl:for-each select="//dataset">
					<tr>
						<td width="10" class="graphlabel">
							<xsl:element name="v:rect">
								<xsl:attribute name="id">lgd_<xsl:value-of select="@id"/></xsl:attribute>
								<xsl:attribute name="style">width:10px; height:10px;</xsl:attribute>
								<xsl:attribute name="fillcolor">#CCCCCC</xsl:attribute>
								<xsl:attribute name="strokecolor">#000000</xsl:attribute>
							</xsl:element>
						</td>
						<xsl:element name="td">
							<xsl:attribute name="class">graphlabel</xsl:attribute>
							<xsl:element name="div">
								<xsl:attribute name="id">legend<xsl:value-of select="@id"/></xsl:attribute>
								<xsl:attribute name="style">background-color:#FFFFFF</xsl:attribute>
								<xsl:attribute name="onmouseover">highlightDataset( <xsl:value-of select="@id"/>, true )</xsl:attribute>
								<xsl:attribute name="onmouseout">highlightDataset( <xsl:value-of select="@id"/>, false )</xsl:attribute>
								<xsl:value-of select="@name"/>
							</xsl:element>
						</xsl:element>
					</tr>
				</xsl:for-each>
			</table>
		</div>
		<!-- // end legend // -->
	</xsl:template>
</xsl:stylesheet>
