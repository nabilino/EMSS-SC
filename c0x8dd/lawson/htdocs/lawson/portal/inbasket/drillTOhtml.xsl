<?xml version="1.0"?>
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
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xt="http://www.jclark.com/xt" version="1.0" extension-element-prefixes="xt">
	<xsl:variable name="drillPath">/servlet/Router/Drill/Erp?</xsl:variable>
	<xsl:variable name="xslName">&amp;amp;_XSL1=/bpm/htmlinbasket/inbasket/drillTOhtml.xsl</xsl:variable>
	<xsl:variable name="xslParam">&amp;amp;_XSLPARAM=back|true</xsl:variable>
	<xsl:param name="back"/>
	<xsl:template match="/">
		<html>
			<META HTTP-EQUIV="Pragma" CONTENT="No-Cache"></META>
			<META HTTP-EQUIV="Expires" CONTENT="Mon, 01 Jan 1990 00:00:01 GMT"></META>
			<head>
				<title>
					<xsl:value-of select="IDARETURN/@title"/>
				</title>
			</head>
			<body style="background-color:#ffffff;text-align:center">
			<xsl:choose>	
			<xsl:when test="//ERROR/MSG">
				<xsl:value-of select="//ERROR/MSG"/>
				<br/>
			</xsl:when>			
			<xsl:when test="IDARETURN/LINES/@count='0'">
				No records meeting criteria.
				<br/>
			</xsl:when>		
			<xsl:otherwise>	
				<table cellpadding="1" border="1">
				<thead>
					<tr>
						<xsl:for-each select="IDARETURN/COLUMNS/COLUMN">
							<th style="text-align:center">
								<xsl:choose>
									<xsl:when test="normalize-space(node())=''">
										<xsl:call-template name="mynbsp"/>				
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="."/>
									</xsl:otherwise>
								</xsl:choose>	
							</th>
						</xsl:for-each>
					</tr>			
				</thead>
				<tbody>
					<xsl:variable name="drillCalls">
						<xsl:for-each select="IDARETURN/LINES/LINE/IDACALL">
							<xsl:if test="not(normalize-space(node())='')">1</xsl:if>
						</xsl:for-each>
					</xsl:variable>
					<xsl:choose>
					<xsl:when test="not(normalize-space($drillCalls)='')">	
						<xsl:for-each select="IDARETURN/LINES/LINE">
						<tr>
							<xsl:variable name="drillURL">
								<xsl:value-of select="$drillPath"/>
								<xsl:value-of select="normalize-space(substring-after(IDACALL,'?'))"/>
								<xsl:value-of select="$xslParam"/>
							</xsl:variable>
							<xsl:choose>
								<xsl:when test="(normalize-space(IDACALL)='')or(IDACALL/@type='CMT')or(IDACALL/@type='URL')">
									<xsl:for-each select="COLS/COL">
										<td>
											<xsl:choose>
											<xsl:when test="not(normalize-space(node())='')">
												<xsl:value-of select="."/>						
											</xsl:when>
											<xsl:otherwise>
												<xsl:call-template name="mynbsp"/>
											</xsl:otherwise>
											</xsl:choose>
										</td>
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<xsl:for-each select="COLS/COL">
										<td>
											<xsl:choose>
											<xsl:when test="not(normalize-space(node())='')">
												<a>
													<xsl:attribute name="href">
														<xsl:value-of select="$drillURL"/>
													</xsl:attribute>
													<xsl:value-of select="."/>
												</a>
											</xsl:when>
											<xsl:otherwise>
												<xsl:call-template name="mynbsp"/>
											</xsl:otherwise>
											</xsl:choose>
										</td>
									</xsl:for-each>							
								</xsl:otherwise>
							</xsl:choose>
						</tr>
						</xsl:for-each>
					</xsl:when>
					<xsl:when test="(count(IDARETURN/COLUMNS/COLUMN)&gt;0)and(normalize-space($drillCalls)='')">
						<xsl:for-each select="IDARETURN/LINES/LINE">
						<tr>
							<xsl:for-each select="COLS/COL">
								<td>
									<xsl:choose>
									<xsl:when test="not(normalize-space(node())='')">
										<xsl:value-of select="."/>						
									</xsl:when>
									<xsl:otherwise>
										<xsl:call-template name="mynbsp"/>
									</xsl:otherwise>
									</xsl:choose>
								</td>
							</xsl:for-each>
						</tr>
						</xsl:for-each>					
					</xsl:when>
					<xsl:otherwise>
						<tr>
							<td>
								<pre>
									<xsl:for-each select="IDARETURN/LINES/LINE/COLS/COL">
										<xsl:value-of select="."/><br/>
								     	</xsl:for-each>
								</pre>
							</td>
						</tr>
					</xsl:otherwise>
					</xsl:choose>
				</tbody>
				</table>
			</xsl:otherwise>
			</xsl:choose>
			<xsl:if test="not($back='')">
				<br/>
				<table border="0" cellspacing="0" cellpadding="0">
				<thead/>
				<tbody>
					<tr>
						<td>
							<a href="javascript:history.back(1);">Back</a>
						</td>
					</tr>
				</tbody>	
				</table>
			</xsl:if>
			</body>
		</html>
	</xsl:template>

	<xsl:template name="mynbsp">
		<xsl:text disable-output-escaping="yes">&amp;nbsp;</xsl:text>
	</xsl:template>
</xsl:stylesheet>	
<!-- $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/inbasket/Attic/drillTOhtml.xsl,v 1.1.2.1.8.2 2012/08/08 12:37:26 jomeli Exp $ -->
