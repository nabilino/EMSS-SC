<?xml version="1.0"?>
<!-- $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/pages/xmlgraph_PIE.xsl,v 1.3.36.2 2012/08/08 12:37:25 jomeli Exp $ -->
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
	xmlns:v="urn:schemas-microsoft-com:vml"
	xmlns:user="javascript:code"
	exclude-result-prefixes="msxsl user">
	
<xsl:output method="html"/>
<!-- =========================================================================== -->
	<msxsl:script  language="JScript" implements-prefix="user">
	///////////////////////////////////

	var graphHeight = 200
	var dsArray
	var dsCount
	var dpCount
	var pieCenterX = 200
	var pieCenterY = 200
	var angle = 0
	var lastAngle = 0
	var pieWidth = 200
	var pieHeight = 200
	var i
	var dpTotal = 0
	var colorIndex = 0
	function init() {
		pieWidth = graphHeight
		pieHeight = graphHeight
		return "";
	}
	
	function getPieWidth()
	{
		return pieWidth;
	}
	function getPieHeight()
	{
		return pieHeight;
	}
	function getAngle()
	{
		return angle;
	}
	function getLastAngle()
	{
		return lastAngle;
	}

	////////////////////////////////////
	// set functions

	function setDataSetColors(dsNodes, dpNodes) {
		dsCount = dsNodes.length;
		dpCount = dpNodes.length;
		dsArray =  new Array(dsNodes.length)
		for(var i=0; i&lt;dpCount; i++) {
			dsArray[i] = getRandomColor();
			for( var j = 0; j &lt; i; j++ ) {
				if( dsArray[i] == dsArray[j] ) {
					i--;
					break;
				}
			}
		}
		return "";
	}
	function setDataPointTotal( XMLDocument ) {
		dpTotal = 0
		datapoints = XMLDocument.length

		for( i = 0; i &lt; datapoints; i++ ) {
			dpTotal = dpTotal + parseInt(XMLDocument.item(i).getAttribute( "value" ))
		}
		if (dpTotal == 0)
			dpTotal = 1
		return "";
	}
	function initAngle() {
		lastAngle = 0
		angle = 0
		return "";
	}
	function initColorIndex() {
		colorIndex = 0
		return "";
	}
	function setAngle(dp) {
		lastAngle = lastAngle + angle
		var val = parseInt(dp.item(0).getAttribute("value"))

		// scale the pie slice * 2^16
		angle = Math.round(val / dpTotal * 360 * 65536)
		return "";
	}


	////////////////////////////////////
	// get functions
	function getRandomColor() {
		// returns a web-safe random hex string
		var ws = new Array('66','99','cc');
		var R = new Array();
		var G = new Array();
		var B = new Array();
		for(var i=0;i&lt;ws.length;i++) {
			R[R.length] = ws[i];
			G[G.length] = ws[i];
			B[B.length] = ws[i];
		}
		var str = R[Math.round(Math.random()*(ws.length-1))] + '' + G[Math.round(Math.random()*(ws.length-1))] + '' + B[Math.round(Math.random()*(ws.length-1))];
		return str;
	}
	function getDataSetColor() {
		return dsArray[colorIndex++];
	}
	</msxsl:script>
<!-- =========================================================================== -->
	<xsl:template match="/">
		<xsl:variable name="pieCenterX">200</xsl:variable>
		<xsl:variable name="pieCenterY">200</xsl:variable>
		
		<xsl:variable name="dsNodes" select="//dataset" />
		<xsl:variable name="dpNodes" select="//label" />
		
		<style>
			v\:* { behavior: url(#default#VML); }
		</style>
		<html xmlns:v="urn:schemas-microsoft-com:vml">
			<xsl:value-of select="user:setDataSetColors($dsNodes, $dpNodes)"/>
			<xsl:value-of select="user:init()"/>
			<body marginwidth="0" marginheight="0" topmargin="0" leftmargin="0">
				<!--// begin chart // -->
				<div id="graphcontainer" graphtype="PIE">
					<table>
						<tr>
							<xsl:for-each select="//dataset">
								<xsl:value-of select="user:setDataPointTotal(./dp)"/>
								<td>
									<table>
										<tr>
											<td class="graphcategory" style="text-align:left">
												<xsl:attribute name="style">
														height:expression(this.clientHeight);
														vertical-align:top;
														font-family:<xsl:value-of select="//GRAPHSTYLE/@font"/>;
														font-size:<xsl:value-of select="//GRAPHSTYLE/@size"/>;
														color:<xsl:value-of select="//GRAPHSTYLE/@color"/>;
												</xsl:attribute>
												<xsl:value-of select="@name"/>
											</td>
										</tr>
										<tr>
											<xsl:element name="td">
												<xsl:attribute name="valign">top</xsl:attribute>
												<xsl:attribute name="width"><xsl:value-of select="user:getPieWidth()"/></xsl:attribute>
												<xsl:attribute name="height"><xsl:value-of select="user:getPieHeight()"/></xsl:attribute>
												<div style="position:relative; top:0px; left:0px; background-color:yellow">
													<xsl:value-of select="user:initAngle()"/>
													<xsl:value-of select="user:initColorIndex()"/>
													<xsl:for-each select="dp">
														<xsl:value-of select="user:setAngle(.)"/>
														<xsl:element name="v:shape">
															<xsl:attribute name="style">position:absolute; top:10px;left: 0px;width:350px; height:350px;</xsl:attribute>
															<xsl:attribute name="fillcolor">#<xsl:value-of select="user:getDataSetColor()"/></xsl:attribute>
															<xsl:attribute name="strokecolor">#000000</xsl:attribute>
															<xsl:attribute name="title">Value: <xsl:value-of select="@value"/></xsl:attribute>
															<xsl:attribute name="onMouseOver">this.fill.type='gradient';</xsl:attribute>
															<xsl:attribute name="onMouseOut">this.fill.type='solid';</xsl:attribute>
															<xsl:attribute name="path">m <xsl:value-of select="$pieCenterX"/>,<xsl:value-of select="$pieCenterY"/> ae <xsl:value-of select="$pieCenterX"/>,<xsl:value-of select="$pieCenterY"/>,<xsl:value-of select="user:getPieWidth()"/>,<xsl:value-of select="user:getPieHeight()"/>,<xsl:value-of select="user:getLastAngle()"/>,<xsl:value-of select="user:getAngle()"/> x e</xsl:attribute>
															<v:fill type="solid" color2="#ffffff"/>
														</xsl:element>
													</xsl:for-each>
												</div>
											</xsl:element>
										</tr>
										<tr>
											<td>
												<!--// one legend per pie // -->
												<div style="position:relative; top:0; left:0; ">
													<table border="0" cellspacing="0" cellpadding="2" style="border-style:solid; border-width:1px; border-color:#000000;">
														<tr>
															<td class="graphcategory" colspan="2">
																<xsl:value-of select="//CATEGORY"/>
															</td>
														</tr>
														<xsl:value-of select="user:initColorIndex()"/>
														<xsl:for-each select="dp">
															<tr onmouseover="this.style.backgroundColor='#CCCCFF'" onmouseout="this.style.backgroundColor=''">
																<td width="10" class="graphlabel">
																	<xsl:element name="v:rect">
																		<xsl:attribute name="style">width:10px; height:10px;</xsl:attribute>
																		<xsl:attribute name="fillcolor">#<xsl:value-of select="user:getDataSetColor()"/></xsl:attribute>
																		<xsl:attribute name="strokecolor">#000000</xsl:attribute>
																	</xsl:element>
																</td>
																<td class="graphlabel">
																	<nobr><xsl:value-of select="@label"/></nobr>
																</td>
																<td class="graphlabel">
																	<nobr><xsl:value-of select="@value"/></nobr>
																</td>
															</tr>
														</xsl:for-each>
													</table>
												</div>
											</td>
										</tr>
									</table>
								</td>
							</xsl:for-each>
						</tr>
					</table>
				</div>
				<!--// end chart // -->
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
