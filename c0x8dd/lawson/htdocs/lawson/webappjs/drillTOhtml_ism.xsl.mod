<?xml version="1.0"?>
<!-- $Header: /cvs/cvs_archive/applications/webtier/webappjs/drillTOhtml.xsl,v 1.8.2.10.2.6 2014/02/18 16:42:32 brentd Exp $ -->
<!-- Version: 8-)@(#)@10.00.05.00.12 Mon Mar 31 10:17:31 Central Daylight Time 2014 -->
<!--************************************************************
 *                                                             *
 *                           NOTICE                            *
 *                                                             *
 *   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
 *   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
 *   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
 *   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
 *   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
 *   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
 *   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
 *                                                             *
 *   (c) COPYRIGHT 2014 INFOR.  ALL RIGHTS RESERVED.           *
 *   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
 *   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
 *   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
 *   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
 *   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
 *                                                             *
 ************************************************************-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xt="http://www.jclark.com/xt" version="1.0" extension-element-prefixes="xt">
	<xsl:output method="html" encoding="utf-8" indent="no"/>
	<xsl:variable name="drillPath">/servlet/Router/Drill/Erp?</xsl:variable>
	<xsl:variable name="xslParam1"><xsl:text disable-output-escaping="yes">&amp;_XSLPARAM=back|true;theme|</xsl:text></xsl:variable>
	<xsl:variable name="xslParam2"><xsl:text disable-output-escaping="yes">;webappjsUrl|</xsl:text></xsl:variable>
	<xsl:variable name="xslParam3"><xsl:text disable-output-escaping="yes">;dir|</xsl:text></xsl:variable>
	<xsl:param name="back"/>
	<xsl:param name="theme"/>
	<xsl:param name="webappjsUrl"/>
	<xsl:param name="dir"/>
	<xsl:template match="/">
		<xsl:text disable-output-escaping="yes">&lt;!DOCTYPE html></xsl:text>
		<html lang="en">
			<xsl:if test="$dir='rtl'">
				<xsl:attribute name="dir"><xsl:text>rtl</xsl:text></xsl:attribute>
			</xsl:if>
			<head>
				<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8"></meta>
				<meta charset="utf-8"></meta>			
				<meta http-equiv="Pragma" CONTENT="No-Cache"></meta>
				<meta http-equiv="Expires" CONTENT="Mon, 01 Jan 1990 00:00:01 GMT"></meta>			
				<title>
					<xsl:value-of select="IDARETURN/@title"/>
				</title>
			<xsl:choose>
			<xsl:when test="not($webappjsUrl='')">
				<script><xsl:attribute name="src"><xsl:value-of select="$webappjsUrl"/><xsl:text>/drill.js</xsl:text></xsl:attribute></script>
				<script><xsl:attribute name="src"><xsl:value-of select="$webappjsUrl"/><xsl:text>/javascript/objects/StylerBase.js</xsl:text></xsl:attribute></script>
				<script><xsl:attribute name="src"><xsl:value-of select="$webappjsUrl"/><xsl:text>/javascript/objects/Sizer.js</xsl:text></xsl:attribute></script>
			</xsl:when>
			<xsl:otherwise>
				<script src="/lawson/webappjs/drill.js"></script>
				<script src="/lawson/webappjs/javascript/objects/StylerBase.js"></script>
				<script src="/lawson/webappjs/javascript/objects/Sizer.js"></script>			
			</xsl:otherwise>
			</xsl:choose>
			    <script src="/sso/sso.js"></script>		    
				<script>
				<![CDATA[
				var styler = null;
				function initDrill(webappjsUrl, theme, dir)
				{
					if (theme)
					{
						styler = new StylerBase();
						webappjsUrl = (webappjsUrl) ? webappjsUrl : "/lawson/webappjs";
						StylerBase.webappjsURL = window.location.protocol + "//" + window.location.host + webappjsUrl;
						styler.showInfor3 = false;
						styler.showInfor = false;
						styler.showLDS = false;
						styler.textDir = "ltr";					
						if (theme.toString().toLowerCase() == "10.3" || theme.toString().toLowerCase() == "infor3")
						{
							styler.showInfor3 = true;
							styler.textDir = (dir) ? dir : "ltr";
							styler.loadCssFile(window, webappjsUrl + "/infor3/css/base/inforControlsCombined.min.css");
	  						styler.loadCssFile(window, webappjsUrl + "/infor3/css/base/inforControlsCustom.css");						
						}						
						else if (theme.toString().toLowerCase() == "10" || theme.toString().toLowerCase() == "infor")
						{
							styler.showInfor = true;
							styler.textDir = (dir) ? dir : "ltr";
							styler.loadCssFile(window, webappjsUrl + "/infor/css/base/inforCommon.css");
	  						styler.loadCssFile(window, webappjsUrl + "/infor/css/base/inforHyperlink.css");
	  						styler.loadCssFile(window, webappjsUrl + "/infor/css/base/inforDataGrid.css");
	  						if (dir && dir == "rtl")
	  							styler.loadCssFile(window, webappjsUrl + "/infor/css/base/inforRTL.css");							
						}						
						else if (theme.toString().toLowerCase() == "9" || theme.toString().toLowerCase() == "lds")
						{
							styler.showLDS = true;
							styler.loadCssFile(window, webappjsUrl + "/lds/css/base/body.css");
	  						styler.loadCssFile(window, webappjsUrl + "/lds/css/base/linkElement.css");
	  						styler.loadCssFile(window, webappjsUrl + "/lds/css/base/tableListElement.css");							
						}
						if (styler.showInfor3 || styler.showInfor || styler.showLDS)	
						{				
	  						styler.loadLibrary(window, SSORequest);
	  						styler.modifyDOM(window);	  						
  						}
					}
					if (typeof(idaFileInstance) != "undefined" && idaFileInstance != null && typeof(idaFileInstance.idaHandler) != "undefined")
					{
						idaFileInstance.idaHandler.translateLabels(window);
					}
					document.body.style.visibility = "visible";
				}
				]]>
				</script>
				<style type="text/css">
				table
				{
					margin-left: auto;
					margin-right: auto;
				}
				</style>
			</head>
			<body style="text-align:center;visibility:hidden;overflow:auto">
			<xsl:attribute name="onload"><xsl:text>initDrill('</xsl:text><xsl:value-of select="$webappjsUrl"/><xsl:text>','</xsl:text><xsl:value-of select="$theme"/><xsl:text>','</xsl:text><xsl:value-of select="$dir"/><xsl:text>');</xsl:text></xsl:attribute>
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
				<table cellpadding="1" border="1" styler="list" style="width:100%">
				<thead>
					<tr>
					<xsl:choose>
						<xsl:when test="count(IDARETURN/COLUMNS/COLUMN)&gt;0">
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
						</xsl:when>
						<xsl:otherwise>
							<th>
							</th>	
						</xsl:otherwise>
					</xsl:choose>
					</tr>			
				</thead>
				<tbody>
					<xsl:variable name="drillCalls">
						<xsl:for-each select="IDARETURN/LINES/LINE/IDACALL">
							<xsl:if test="not(normalize-space(node())='')">1</xsl:if>
						</xsl:for-each>
					</xsl:variable>
           			<xsl:variable name="drillParams">				
           				<xsl:value-of select="$xslParam1"/>
           				<xsl:value-of select="$theme"/>
						<xsl:value-of select="$xslParam2"/>
						<xsl:value-of select="$webappjsUrl"/>
						<xsl:value-of select="$xslParam3"/>
						<xsl:value-of select="$dir"/>
					</xsl:variable>						
					<xsl:choose>
					<xsl:when test="not(normalize-space($drillCalls)='')">	
						<xsl:for-each select="IDARETURN/LINES/LINE">
							<xsl:variable name="drillURL">
								<xsl:value-of select="$drillPath"/>
								<xsl:value-of select="normalize-space(substring-after(IDACALL,'?'))"/>
								<xsl:value-of select="$drillParams"/>																
							</xsl:variable>
							<xsl:choose>
								<xsl:when test="(normalize-space(IDACALL)='')or(IDACALL/@type='CMT')or(IDACALL/@type='URL')">
									<xsl:for-each select="COLS/COL">
										<!--<td style="text-align:center">
											<xsl:choose>
											<xsl:when test="not(normalize-space(node())='')">
												<xsl:value-of select="."/>						
											</xsl:when>
											<xsl:otherwise>
												<xsl:call-template name="mynbsp"/>
											</xsl:otherwise>
											</xsl:choose>
										</td>-->
									</xsl:for-each>
								</xsl:when>
								<xsl:otherwise>
									<xsl:for-each select="COLS/COL">
											<xsl:choose>
											<xsl:when test="not(normalize-space(node())='') and ((normalize-space(node())='Assignment') or
											(normalize-space(node())='Work Information') or
											(normalize-space(node())='Employee Dates') or
											(normalize-space(node())='Positions, Jobs') or
											(normalize-space(node())='Salary History') or
											(normalize-space(node())='Position Job History') or
											(normalize-space(node())='Pay Information'))
											">
						<tr>
										<td style="text-align:center">
												<a styler="hyperlink" style="font-size:inherit !important;">
													<xsl:attribute name="href">
														<xsl:value-of select="$drillURL"/>
													</xsl:attribute>
													<xsl:attribute name="title"><xsl:text>Drill Down to </xsl:text><xsl:value-of select="."/></xsl:attribute>
													<xsl:attribute name="aria-label"><xsl:text>Drill Down to </xsl:text><xsl:value-of select="."/></xsl:attribute>																										
													<xsl:value-of select="."/>
												</a>
										</td>
						</tr>
											</xsl:when>
											<xsl:otherwise>
												<xsl:call-template name="mynbsp"/>
											</xsl:otherwise>
											</xsl:choose>
									</xsl:for-each>							
								</xsl:otherwise>
							</xsl:choose>
						</xsl:for-each>
					</xsl:when>
					<xsl:when test="(count(IDARETURN/COLUMNS/COLUMN)&gt;0)and(normalize-space($drillCalls)='')">
						<xsl:for-each select="IDARETURN/LINES/LINE">
						<tr>
							<xsl:for-each select="COLS/COL">
								<td style="text-align:center">
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
								<table border="0"><tr><td style="text-align:left">
									<xsl:if test="$dir='rtl'">
										<xsl:attribute name="dir"><xsl:text>rtl</xsl:text></xsl:attribute>
									</xsl:if>																
									<xsl:for-each select="IDARETURN/LINES/LINE/COLS/COL">
										<xsl:value-of select="normalize-space(node())"/><br/>
								     </xsl:for-each>
								</td></tr></table>
							</td>
						</tr>
					</xsl:otherwise>
					</xsl:choose>
					<xsl:if test="(not(normalize-space(IDARETURN/PREVPAGE)=''))or(not(normalize-space(IDARETURN/NEXTPAGE)=''))">										
						<tr>
							<td style="vertical-align:bottom;text-align:center" nowrap="">
								<xsl:attribute name="colspan"><xsl:value-of select="count(IDARETURN/LINES/LINE[1]/COLS/COL)"/></xsl:attribute>
								<span style="text-align:left;width:50%">
								<xsl:if test="not(normalize-space(IDARETURN/PREVPAGE)='')">
            						<xsl:variable name="drillURL">
                						<xsl:value-of select="$drillPath"/>
                    					<xsl:value-of select="normalize-space(substring-after(IDARETURN/PREVPAGE,'?'))"/>
           								<xsl:value-of select="$drillParams"/>										           									
           							</xsl:variable>
									<a id="prevLnk" styler="hyperlink" title="Previous" aria-label="Previous">
										<xsl:attribute name="href">
											<xsl:value-of select="$drillURL"/>
										</xsl:attribute>
										Previous
									</a>						
								</xsl:if>
								</span>
								<xsl:call-template name="mynbsp"/>
								<span style="text-align:right;width:50%">
								<xsl:if test="not(normalize-space(IDARETURN/NEXTPAGE)='')">
                					<xsl:variable name="drillURL">
                						<xsl:value-of select="$drillPath"/>
                    					<xsl:value-of select="normalize-space(substring-after(IDARETURN/NEXTPAGE,'?'))"/>
               							<xsl:value-of select="$drillParams"/>										               									
               						</xsl:variable>
									<a id="nextLnk" styler="hyperlink" title="Next" aria-label="Next">
										<xsl:attribute name="href">
											<xsl:value-of select="$drillURL"/>
										</xsl:attribute>
										Next
									</a>
								</xsl:if>
								</span>
							</td>
						</tr>
					</xsl:if>
				</tbody>
				</table>
			</xsl:otherwise>
			</xsl:choose>
            <xsl:if test="not($back='')">
				<br/>
				<table border="0" cellspacing="0" cellpadding="0" style="width:100%">
				<thead/>
				<tbody>
					<tr>
						<td style="text-align:center;padding-bottom:2px">
							<a id="backLnk" href="javascript:history.back(1);" title="Back" aria-label="Back" styler="hyperlink">Back</a>
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

