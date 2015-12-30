<?xml version="1.0"?>
<!-- $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/pages/pvxmlchart_VBAR.xsl,v 1.2.36.2 2012/08/08 12:37:25 jomeli Exp $ -->
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
<xsl:stylesheet xmlns:xsl="http://www.w3.org/TR/WD-xsl" xmlns:msxml="urn:schemas-microsoft-com:xslt" version="1.0">
	<xsl:template match="/">
		<style>
            .label {  font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 7.5pt }
			v\:* { behavior: url(#default#VML); }
		</style>
		<xsl:script><![CDATA[

		///////////////////////////////////
		// init

		var i = 0
		var x = 0
		var y = 0
		var barWidth
		var graphHeight = 200
		var posHeight
		var negHeight
		var dataMax
		var dataMin
		var dataScale
		var zeroLine
		var dsArray = new Array(getNumberOfDatasets(this))
		var dsCount
		var labels
		var currentLabel
		var val

		function init() {
		
			// set the dataScale
			setDataMax( this )
			setDataMin( this )
			dataRange = ( dataMax - dataMin );
			
			if( dataRange != '0' ) {
				dataScale = graphHeight / dataRange;
			}
			
			if (( dataMax >= 0 && dataMin >= 0 ) || ( dataMax < 0 && dataMin < 0 )) {
				// if both are positive, zeroLine = 0
				if ( dataMax >= 0 && dataMin >= 0 ) {
					zeroLine = 0;
				}
				// if both are negative, zeroLine = graphHeight
				if ( dataMax < 0 && dataMin < 0 ) {
					zeroLine = graphHeight;
				}
			} else {
				if ( dataMax > 0 ) {
					zeroLine = graphHeight - (dataMax * dataScale);
				} else {
					zeroLine = graphHeight - (Math.abs(dataMin) * dataScale);
				}
			}
		}

		////////////////////////////////////
		// set functions

		function setX(inc) {
			if (inc == 0) {
				i = i + 1;
				x = (getBarWidth() * i);
			} else {
				x = x + inc;
			}
		}
		function setY() {
			y = y + inc;
		}
		function setBarWidth(totalwidth,numberofdatapoints) {
			barWidth = (totalwidth / numberofdatapoints)
		}
		function setCurrentLabel( node ) {
			currentLabel = node.getAttribute( "value" )
		}
		function setDataMax( XMLDocument ) {
		
			datapoints = XMLDocument.selectNodes( "//dp" )
			var max = parseFloat( datapoints[ 0 ].getAttribute( "value" ) )
			var temp = max
			
			for( i = 0; i < datapoints.length; i++ ) {
				temp = parseFloat( datapoints[ i ].getAttribute( "value" ) )
				if( temp > max ) {
					max = temp
				}
			}
			dataMax = max
		}
		function setDataMin( XMLDocument ) {
			
			datapoints = XMLDocument.selectNodes( "//dp" )
			var min = parseFloat( datapoints[ datapoints.length - 1 ].getAttribute( "value" ) )
			
			//for( i = 1; i < datapoints.length; i++ ) {
			for( i = datapoints.length - 2; i >= 0; i-- ) {
				temp = parseFloat( datapoints[ i ].getAttribute( "value" ) )
				if( temp < min ) {
					min = temp
				}
			}
			dataMin = min
			return min
		}
		function setNumberOfLabels( XMLDocument ) {
			labelCount = XMLDocument .selectNodes( "//label" ).length
		}
		function setDataSetColors() {
			var numDatasets = getNumberOfDatasets();
			for(var i=0;i<numDatasets;i++) {
				dsArray[i] = getRandomColor();
			}
		}
		function setNumberOfDatasets( XMLDocument ) {
			dsCount = XMLDocument .selectNodes( "//dataset" ).length
		}
		function setNumberOfDataPoints( ) {
			dpCount = labelCount*dsCount
		}
		
		////////////////////////////////////
		// get functions

		function getCurrentLabel() {
			return currentLabel
		}
		function getXMLAttribute(node,attribute) {
			var rowVal=node.getAttribute(attribute);
			return rowVal;
		}
		function getRandomColor() {
			// returns a web-safe random hex string
			var ws = new Array('00','33','66','99');
			var R = new Array();
			var G = new Array();
			var B = new Array();
			for(var i=0;i<ws.length;i++) {
				R[R.length] = ws[i];
				G[G.length] = ws[i];
				B[B.length] = ws[i];
			}
			var str = R[Math.round(Math.random()*(ws.length-1))] + '' + G[Math.round(Math.random()*(ws.length-1))] + '' + B[Math.round(Math.random()*(ws.length-1))];
			return str;
		}
		function getDataMax() {
			return dataMax
		}
		function getDataMin() {
			return dataMin
		}
		function getDatapointCount( XMLDocument ) {

			datapoints = XMLDocument.selectNodes( "//dp" )
			var min = datapoints[ 0 ].getAttribute( "value" )
			
			for( i = 1; i < datapoints.length; i++ ) {
				temp = datapoints[ i ].getAttribute( "value" ) 
				if( temp < min ) {
					min = temp
				}
			}
			return datapoints.length
		}
		function getDataSetColor( node ) {
			var dsID = node.getAttribute("id")
			return dsArray[dsID];
		}
		function getNumberOfLabels() {
			return labelCount
		}
		function getNumberOfDatasets() {
			return dsCount
		}
		function getNumberOfDataPoints() {
			return dpCount
		}
		function getLabelWidth(totalwidth,numberoflabels) {
			var retval = (totalwidth / numberoflabels)
			return (retval)
		}
		function getBarWidth() {
				return (barWidth)
		}
		function getNewX(node) {
			var newx;
			newx = getBarWidth()*parseInt(node.parentNode.getAttribute("id"))
			x = newx;
		}
		function getDataScale() {
			return dataScale
		}
		function getX() {
			return x;
		}
		function getTop(node) {
			val = node.getAttribute("value") * dataScale

			zeroLine = Math.round(zeroLine)
			
			val = Math.round(val)
			if (val >= 0) {
				return graphHeight - (zeroLine + Math.abs(val));
			} else {
				return (graphHeight - (Math.abs(dataMin) * dataScale));
			}
		}
		function getHeight(node) {
			var val = node.getAttribute("value") * dataScale
			return Math.round(Math.abs(val));
		}
		]]></xsl:script>
		<html xmlns:v="urn:schemas-microsoft-com:vml">
			<xsl:eval>setNumberOfLabels(this)</xsl:eval>
			<xsl:eval>setNumberOfDatasets(this)</xsl:eval>
			<xsl:eval>setNumberOfDataPoints()</xsl:eval>
			<xsl:eval>setDataSetColors()</xsl:eval>
			<xsl:eval>init()</xsl:eval>
			<xsl:eval>setBarWidth(300,getNumberOfDataPoints())</xsl:eval>
			<xsl:eval>setX(0)</xsl:eval>
			<body bgcolor="efefef">
				<!--// begin chart // -->
				<div style="position:relative; top:10px; left:50px; width: 300px; height: 200px">
					<xsl:for-each select="//dataset">
						<xsl:for-each select="dp">
							<xsl:element name="v:rect">
								<xsl:attribute name="style">position:absolute; top: <xsl:eval>getTop(this)</xsl:eval>px;left: <xsl:eval>getX()</xsl:eval>px;width:<xsl:eval>getBarWidth()</xsl:eval>px; height:<xsl:eval>getHeight(this)</xsl:eval>px;</xsl:attribute>
								<xsl:attribute name="fillcolor">#<xsl:eval>getDataSetColor(this.parentNode)</xsl:eval></xsl:attribute>
								<!--<xsl:attribute name="strokecolor">#<xsl:eval>getDataSetColor(this.parentNode)</xsl:eval></xsl:attribute>-->
								<xsl:attribute name="strokecolor">#000000</xsl:attribute>
								<xsl:attribute name="title">Value: <xsl:eval>this.getAttribute("value")</xsl:eval></xsl:attribute>
								<xsl:attribute name="onMouseOver">this.fill.type='solid';</xsl:attribute>
								<xsl:attribute name="onMouseOut">this.fill.type='gradient';</xsl:attribute>
								<v:fill type="gradient" color2="#ffffff"/>
								<xsl:eval>setX(getBarWidth()*getNumberOfDatasets())</xsl:eval>
							</xsl:element>
						</xsl:for-each>
						<xsl:eval>setX(0)</xsl:eval>
						
					</xsl:for-each>
				<!--// begin chart bottom labels // -->
				<xsl:element name="div">
					<xsl:attribute name="style">position:relative; top:<xsl:eval>graphHeight+5</xsl:eval>px; left:0px;width:300</xsl:attribute>
					<table width="300" border="0" cellspacing="1" cellpadding="0" bgcolor="#000000">
						<tr valign="top" align="center">
							<xsl:for-each select="//label">
								<xsl:element name="td">
									<xsl:attribute name="bgcolor">#EFEFEF</xsl:attribute>
									<xsl:attribute name="class">label</xsl:attribute>
									<xsl:attribute name="width"><xsl:eval>getLabelWidth()</xsl:eval></xsl:attribute>
									<xsl:eval>getXMLAttribute(this,'value')</xsl:eval>
								</xsl:element>
							</xsl:for-each>
						</tr>
					</table>
				</xsl:element>
				<div style="position:relative; top:215; left:0; width:300; height:35;">
					<table width="300" border="0" cellspacing="0" cellpadding="3">
						<xsl:for-each select="//dataset">
							<tr>
								<td width="10" class="label">
									<xsl:element name="v:rect">
										<xsl:attribute name="style">width:10px; height:10px;</xsl:attribute>
										<xsl:attribute name="fillcolor">#<xsl:eval>getDataSetColor(this)</xsl:eval></xsl:attribute>
										<xsl:attribute name="strokecolor">#000000</xsl:attribute>
									</xsl:element>
								</td>
								<xsl:element name="td">
									<xsl:attribute name="class">label</xsl:attribute>
									Dataset <xsl:eval>getXMLAttribute(this,'id')</xsl:eval>
								</xsl:element>
							</tr>
						</xsl:for-each>
					</table>
				</div>
				</div>
				<!--// end chart // -->
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
