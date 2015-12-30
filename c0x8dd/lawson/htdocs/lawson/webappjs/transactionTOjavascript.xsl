<?xml version="1.0"?>
<!-- $Header: /cvs/cvs_archive/applications/webtier/webappjs/transactionTOjavascript.xsl,v 1.9.2.3.2.4 2014/02/18 16:42:32 brentd Exp $ -->
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
	<xsl:variable name="cr" select="'&#xA;'"/>
	<xsl:variable name="this">this.</xsl:variable>
	<xsl:variable name="parent">parent</xsl:variable>
	<xsl:variable name="function">function </xsl:variable>
	<xsl:variable name="beginfunc">{</xsl:variable>
	<xsl:variable name="endfunc">}</xsl:variable>
	<xsl:variable name="beginparam">(</xsl:variable>
	<xsl:variable name="endparam">)</xsl:variable>
	<xsl:variable name="var">var </xsl:variable>
	<xsl:variable name="equal"> = </xsl:variable>
	<xsl:variable name="comma">, </xsl:variable>
	<xsl:variable name="underscore">_</xsl:variable>
	<xsl:variable name="semi">;</xsl:variable>
	<xsl:variable name="transformServlet">/servlet/Transform?_XML=</xsl:variable>
	<xsl:variable name="xslName">&amp;amp;_XSL1=/lawson/webappjs/transactionTOjavascript.xsl</xsl:variable>
	<xsl:param name="onload"/>
	<xsl:template match="/">
		<xsl:text disable-output-escaping="yes">&lt;!DOCTYPE html></xsl:text>
		<html lang="en">
			<head>
				<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8"></meta>
				<meta charset="utf-8"></meta>			
				<title>
					<xsl:value-of select="normalize-space(//_TKN)"/>
				</title>
				<script>
					<xsl:call-template name="variousFuncs"/>		
	
					with (parent.lawheader)
					{
						if (typeof(V) == "function")
						{
							<xsl:value-of select="$cr"/>
							<xsl:for-each select="//*/*/*">
								<xsl:text>V("</xsl:text>
									<xsl:call-template name="incrementRowNbr">
										<xsl:with-param name="stringVal" select="name()"/>
									</xsl:call-template>
								<xsl:text>","</xsl:text>
								<xsl:choose>
									<xsl:when test="name()='FldNbr'">
										<xsl:call-template name="incrementRowNbr">
											<xsl:with-param name="stringVal" select="."/>
										</xsl:call-template>														
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="."/>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:text>");</xsl:text>
								<xsl:value-of select="$cr"/>
							</xsl:for-each>
						}
							<xsl:variable name="fldNbr">
								<xsl:call-template name="incrementRowNbr">
									<xsl:with-param name="stringVal" select="//FldNbr"/>
								</xsl:call-template>						
							</xsl:variable>
							<xsl:text>DataReturned("</xsl:text><xsl:value-of select="$fldNbr"/><xsl:text>","</xsl:text><xsl:value-of select="//MsgNbr"/><xsl:text>","</xsl:text><xsl:value-of select="//Message"/><xsl:text>","");</xsl:text>
							<xsl:value-of select="$cr"/>
					}
					
					var LoadTimer = setTimeout('OnloadTimeout()',3000);		
				</script>
			</head>
			<body onload="OnloadDone();"/>
		</html>
	</xsl:template>
	<!-- ********************************************************************************* -->	
	<xsl:template name="incrementRowNbr">
		<xsl:param name="stringVal"/>
		<xsl:choose>
			<xsl:when test="contains($stringVal,'r')and(string(number(substring-after($stringVal,'r'))+1)!='NaN')">
				<xsl:value-of select="substring-before($stringVal,'r')"/><xsl:value-of select="number(substring-after($stringVal,'r'))+1"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$stringVal"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- ********************************************************************************* -->
	<xsl:template name="variousFuncs">
		var timerHasExpired = false;				
												
		function CallBack()
		{	
			<xsl:choose>
				<xsl:when test="//ERROR/MSG">
					alert('<xsl:value-of select="//ERROR/MSG"/>');
				</xsl:when>
				<xsl:when test="not($onload='')">
					<xsl:value-of select="$onload"/>;
				</xsl:when>
				<xsl:otherwise>
					try
					{
						parent.doNothing();
					}
					catch (e) {}
				</xsl:otherwise>
			</xsl:choose>
		}
					
		function OnloadTimeout()
		{
			timerHasExpired = true;
		   	if (typeof(top.OnloadTimeoutCount) == 'undefined')
		      		top.OnloadTimeoutCount = 1;
		   	else
		      		top.OnloadTimeoutCount++;
		   	CallBack();
		}
					
		function OnloadDone()
		{
		   	clearTimeout(LoadTimer);
		   	if (timerHasExpired == false)
		      		CallBack();
		}
	</xsl:template>	
</xsl:stylesheet>
