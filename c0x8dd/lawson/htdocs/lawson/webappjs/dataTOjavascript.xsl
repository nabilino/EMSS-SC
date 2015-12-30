<?xml version="1.0"?>
<!-- $Header: /cvs/cvs_archive/applications/webtier/webappjs/dataTOjavascript.xsl,v 1.10.2.3.2.4 2014/02/18 16:42:32 brentd Exp $ -->
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
	<xsl:variable name="xslName">&amp;amp;_XSL1=/lawson/webappjs/dataTOjavascript.xsl</xsl:variable>
	<xsl:template match="/">
		<xsl:text disable-output-escaping="yes">&lt;!DOCTYPE html></xsl:text>
		<html lang="en">
			<head>
				<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8"></meta>
				<meta charset="utf-8"></meta>			
				<title>
					<xsl:value-of select="normalize-space(substring(substring-before(substring-after(//DME/BASE/DMEBASE,'&amp;FILE='),'&amp;'),1))"/>
				</title>
				<script>
					<xsl:value-of select="$cr"/>
					<xsl:for-each select="//DME/COLUMNS">
						<xsl:call-template name="RecObject"/>
					</xsl:for-each>
					<xsl:value-of select="$cr"/>	
					<xsl:for-each select="//DME/RECORDS/RECORD[1]/RELRECS">
						<xsl:call-template name="RelObject">
							<xsl:with-param name="name" select="translate(@name,'-.,','___')"/>
						</xsl:call-template>
					</xsl:for-each>
					<xsl:value-of select="$cr"/>	
					<xsl:for-each select="//DME/KEYS">
						<xsl:call-template name="primStuff"/>
					</xsl:for-each>
					<xsl:value-of select="$cr"/>	
					<xsl:for-each select="//DME/RECORDS/RECORD[1]/RELRECS">
						<xsl:call-template name="relrechdr">
							<xsl:with-param name="name" select="translate(@name,'-.,','___')"/>
						</xsl:call-template>
					</xsl:for-each>
					<xsl:value-of select="$cr"/>	
					<xsl:for-each select="//DME/COLUMNS">
						<xsl:call-template name="rechdr"/>
					</xsl:for-each>
					<xsl:value-of select="$cr"/>
					<xsl:for-each select="//DME/RECORDS">
						<xsl:call-template name="records"/>
					</xsl:for-each>
					<xsl:value-of select="$cr"/>
					<xsl:call-template name="basicCall"/>
					<xsl:call-template name="variousFuncs"/>
					<xsl:value-of select="$cr"/>
				</script>
			</head>
			<body onload="OnloadDone()"/>
		</html>
	</xsl:template>
	<!-- ********************************************************************************* -->
	<xsl:template name="RecObject">
		<xsl:value-of select="$function"/>
		<xsl:text>RecObject</xsl:text>
		<xsl:value-of select="$beginparam"/>
		<xsl:for-each select="COLUMN">
			<xsl:variable name="name">
				<xsl:choose>
					<xsl:when test="@header">
						<xsl:value-of select="translate(@header,'-.,','___')"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:call-template name="toLower">
							<xsl:with-param name="stringValue">
								<xsl:value-of select="translate(@dspname, '-.,' ,'___')"/>
							</xsl:with-param>
						</xsl:call-template>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>
			<xsl:choose>
				<xsl:when test="@nOccurs">
					<xsl:call-template name="RecObjectOccurs">
						<xsl:with-param name="passname" select="$name"/>
						<xsl:with-param name="type" select="'param'"/>
						<xsl:with-param name="occurs" select="@nOccurs"/>
						<xsl:with-param name="count" select="'1'"/>
						<xsl:with-param name="lastParam" select="position()=last()"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="$name"/>
					<xsl:if test="position()!=last()">
						<xsl:value-of select="$comma"/>
					</xsl:if>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
		<xsl:value-of select="$endparam"/>
		<xsl:value-of select="$cr"/>
		<xsl:value-of select="$beginfunc"/>
		<xsl:value-of select="$cr"/>
		<xsl:for-each select="COLUMN">
			<xsl:variable name="name">
				<xsl:choose>
					<xsl:when test="@header">
						<xsl:value-of select="translate(@header,'-.,','___')"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:call-template name="toLower">
							<xsl:with-param name="stringValue">
								<xsl:value-of select="translate(@dspname, '-.,' ,'___')"/>
							</xsl:with-param>
						</xsl:call-template>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>
			<xsl:choose>
				<xsl:when test="@nOccurs">
					<xsl:call-template name="RecObjectOccurs">
						<xsl:with-param name="passname" select="$name"/>
						<xsl:with-param name="type" select="'func'"/>
						<xsl:with-param name="occurs" select="@nOccurs"/>
						<xsl:with-param name="count" select="'1'"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="$this"/>
					<xsl:value-of select="$name"/>
					<xsl:value-of select="$equal"/>
					<xsl:value-of select="$name"/>
					<xsl:value-of select="$semi"/>
					<xsl:value-of select="$cr"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
		<xsl:value-of select="$endfunc"/>
		<xsl:value-of select="$cr"/>
	</xsl:template>
	<!-- ********************************************************************************* -->	
	<xsl:template name="RelObject">
		<xsl:param name="name"/>
		<xsl:variable name="relNameLower">
			<xsl:call-template name="toLower">
				<xsl:with-param name="stringValue" select="$name"/>
			</xsl:call-template>		
		</xsl:variable>		
		<xsl:value-of select="$function"/>
		<xsl:value-of select="$relNameLower"/>
		<xsl:text>Object</xsl:text>
		<xsl:value-of select="$beginparam"/>
		<xsl:for-each select="//DME/COLUMNS/COLUMN[translate(substring-before(@header,'.'),'-.,','___')=$relNameLower]">
			<xsl:variable name="relFieldLower">
				<xsl:call-template name="toLower">
					<xsl:with-param name="stringValue" select="translate(substring-after(@header,'.'),'-.,','___')"/>
				</xsl:call-template>		
			</xsl:variable>				
			<xsl:value-of select="$relFieldLower"/>
			<xsl:if test="position()!=last()">
				<xsl:value-of select="$comma"/>
			</xsl:if>
		</xsl:for-each>
		<xsl:value-of select="$endparam"/>
		<xsl:value-of select="$cr"/>
		<xsl:value-of select="$beginfunc"/>
		<xsl:value-of select="$cr"/>
		<xsl:for-each select="//DME/COLUMNS/COLUMN[translate(substring-before(@header,'.'),'-.,','___')=$relNameLower]">
			<xsl:variable name="relFieldLower">
				<xsl:call-template name="toLower">
					<xsl:with-param name="stringValue" select="translate(substring-after(@header,'.'),'-.,','___')"/>
				</xsl:call-template>		
			</xsl:variable>		
			<xsl:value-of select="$this"/>
			<xsl:value-of select="$relFieldLower"/>
			<xsl:value-of select="$equal"/>
			<xsl:value-of select="$relFieldLower"/>
			<xsl:value-of select="$semi"/>
			<xsl:value-of select="$cr"/>
		</xsl:for-each>
		<xsl:value-of select="$endfunc"/>
		<xsl:value-of select="$cr"/>
		<xsl:value-of select="$cr"/>
	</xsl:template>	
	<!-- ********************************************************************************* -->
	<xsl:template name="RecObjectOccurs">
		<xsl:param name="passname"/>
		<xsl:param name="type"/>
		<xsl:param name="occurs"/>
		<xsl:param name="count"/>
		<xsl:param name="lastParam"/>
		<xsl:if test="($count = $occurs) or ($count &lt; $occurs)">
			<xsl:choose>
				<xsl:when test="$type='func'">
					<xsl:value-of select="$this"/>
				</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
			<xsl:value-of select="$passname"/>
			<xsl:value-of select="$underscore"/>
			<xsl:value-of select="$count"/>
			<xsl:choose>
				<xsl:when test="$type='param'">
					<xsl:if test="($count!=$occurs) or ($lastParam!='false')">
						<xsl:value-of select="$comma"/>
					</xsl:if>
				</xsl:when>
				<xsl:when test="$type='func'">
					<xsl:value-of select="$equal"/>
					<xsl:value-of select="$passname"/>
					<xsl:value-of select="$underscore"/>
					<xsl:value-of select="$count"/>
					<xsl:value-of select="$semi"/>
					<xsl:value-of select="$cr"/>
				</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
			<xsl:call-template name="RecObjectOccurs">
				<xsl:with-param name="passname" select="$passname"/>
				<xsl:with-param name="type" select="$type"/>
				<xsl:with-param name="occurs" select="$occurs"/>
				<xsl:with-param name="count" select="$count+1"/>
				<xsl:with-param name="lastParam" select="$lastParam"/>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>
	<!-- ********************************************************************************* -->
	<xsl:template name="primStuff">
		<xsl:text>var primkey = new Array("</xsl:text>
		<xsl:for-each select="KEY">
			<xsl:value-of select="@name"/>
			<xsl:choose>
				<xsl:when test="position()=last()">
					<xsl:text>")</xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<xsl:text>", "</xsl:text>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
		<xsl:value-of select="$cr"/>
		<xsl:text>var primtype = new Array("</xsl:text>
		<xsl:for-each select="KEY">
			<xsl:value-of select="@type"/>
			<xsl:choose>
				<xsl:when test="position()=last()">
					<xsl:text>")</xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<xsl:text>", "</xsl:text>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
		<xsl:value-of select="$cr"/>
		<xsl:text>var primsize = new Array(</xsl:text>
		<xsl:for-each select="KEY">
			<xsl:value-of select="@size"/>
			<xsl:choose>
				<xsl:when test="position()=last()">
					<xsl:text>)</xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<xsl:text>, </xsl:text>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
		<xsl:value-of select="$cr"/>
		<xsl:text>var nPrimKeys = </xsl:text>
		<xsl:value-of select="count(//DME/KEYS/KEY)"/>
	</xsl:template>
	<!-- ********************************************************************************* -->	
	<xsl:template name="relrechdr">
		<xsl:param name="name"/>
		<xsl:variable name="relNameLower">
			<xsl:call-template name="toLower">
				<xsl:with-param name="stringValue" select="$name"/>
			</xsl:call-template>		
		</xsl:variable>		
		<xsl:text>var rechdr</xsl:text>
		<xsl:value-of select="$underscore"/>
		<xsl:value-of select="$relNameLower"/>
		<xsl:value-of select="$equal"/>
		<xsl:text>new Array(</xsl:text>
		<xsl:for-each select="//DME/COLUMNS/COLUMN[translate(substring-before(@header,'.'),'-.,','___')=$relNameLower]">
			<xsl:variable name="relFieldLower">
				<xsl:call-template name="toLower">
					<xsl:with-param name="stringValue" select="translate(substring-after(@header,'.'),'-.,','___')"/>
				</xsl:call-template>		
			</xsl:variable>
			<xsl:text>"</xsl:text>
			<xsl:value-of select="$relFieldLower"/>
			<xsl:text>"</xsl:text>
			<xsl:if test="position()!=last()">
				<xsl:value-of select="$comma"/>
			</xsl:if>
		</xsl:for-each>
		<xsl:value-of select="$endparam"/>
		<xsl:value-of select="$cr"/>	
	</xsl:template>
	<!-- ********************************************************************************* -->
	<xsl:template name="rechdr">
		<xsl:text>var rechdr = new Array("</xsl:text>
		<xsl:for-each select="COLUMN">
			<xsl:variable name="name">
				<xsl:choose>
					<xsl:when test="@header">
						<xsl:value-of select="translate(@header,'-.,','___')"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:call-template name="toLower">
							<xsl:with-param name="stringValue">
								<xsl:value-of select="translate(@dspname, '-.,' ,'___')"/>
							</xsl:with-param>
						</xsl:call-template>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>
			<xsl:choose>
				<xsl:when test="@nOccurs">
					<xsl:call-template name="rechdrOccurs">
						<xsl:with-param name="type" select="'hdrfields'"/>
						<xsl:with-param name="passname" select="$name"/>
						<xsl:with-param name="occurs" select="@nOccurs"/>
						<xsl:with-param name="count" select="'1'"/>
						<xsl:with-param name="lastParam" select="position()=last()"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="$name"/>
					<xsl:choose>
						<xsl:when test="position()=last()">
							<xsl:text>")</xsl:text>
						</xsl:when>
						<xsl:otherwise>
							<xsl:text>", "</xsl:text>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
		<xsl:value-of select="$cr"/>
		<xsl:text>var fldtype = new Array("</xsl:text>
		<xsl:for-each select="COLUMN">
			<xsl:choose>
				<xsl:when test="@nOccurs">
					<xsl:call-template name="rechdrOccurs">
						<xsl:with-param name="type" select="'fldtype'"/>
						<xsl:with-param name="passname" select="@type"/>
						<xsl:with-param name="occurs" select="@nOccurs"/>
						<xsl:with-param name="count" select="'1'"/>
						<xsl:with-param name="lastParam" select="position()=last()"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="@type"/>
					<xsl:choose>
						<xsl:when test="position()=last()">
							<xsl:text>")</xsl:text>
						</xsl:when>
						<xsl:otherwise>
							<xsl:text>", "</xsl:text>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
		<xsl:value-of select="$cr"/>
		<xsl:text>var fldsize = new Array(</xsl:text>
		<xsl:for-each select="COLUMN">
			<xsl:choose>
				<xsl:when test="@nOccurs">
					<xsl:call-template name="rechdrOccurs">
						<xsl:with-param name="type" select="'fldsize'"/>
						<xsl:with-param name="passname" select="@size"/>
						<xsl:with-param name="occurs" select="@nOccurs"/>
						<xsl:with-param name="count" select="'1'"/>
						<xsl:with-param name="lastParam" select="position()=last()"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="@size"/>
					<xsl:choose>
						<xsl:when test="position()=last()">
							<xsl:text>)</xsl:text>
						</xsl:when>
						<xsl:otherwise>
							<xsl:text>, </xsl:text>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
		<xsl:value-of select="$cr"/>
	</xsl:template>
	<!-- ********************************************************************************* -->
	<xsl:template name="rechdrOccurs">
		<xsl:param name="type"/>
		<xsl:param name="passname"/>
		<xsl:param name="occurs"/>
		<xsl:param name="count"/>
		<xsl:param name="lastParam"/>
		<xsl:if test="($count = $occurs) or ($count &lt; $occurs)">
			<xsl:choose>
				<xsl:when test="$type='hdrfields'">
					<xsl:value-of select="$passname"/>
					<xsl:value-of select="$underscore"/>
					<xsl:value-of select="$count"/>
					<xsl:choose>
						<!--		<xsl:when test="position()=last()">-->
						<xsl:when test="($count!=$occurs) or ($lastParam!='false')">
							<xsl:text>", "</xsl:text>
						</xsl:when>
						<xsl:otherwise>
							<xsl:text>")</xsl:text>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				<xsl:when test="$type='fldtype'">
					<xsl:value-of select="$passname"/>
					<xsl:choose>
						<!--	<xsl:when test="position()=last()">-->
						<xsl:when test="($count!=$occurs) or ($lastParam!='false')">
							<xsl:text>", "</xsl:text>
						</xsl:when>
						<xsl:otherwise>
							<xsl:text>")</xsl:text>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				<xsl:when test="$type='fldsize'">
					<xsl:value-of select="$passname"/>
					<xsl:choose>
						<!--		<xsl:when test="position()=last()"> -->
						<xsl:when test="($count!=$occurs) or ($lastParam!='false')">
							<xsl:text>, </xsl:text>
						</xsl:when>
						<xsl:otherwise>
							<xsl:text>)</xsl:text>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
			</xsl:choose>
			<xsl:call-template name="rechdrOccurs">
				<xsl:with-param name="type" select="$type"/>
				<xsl:with-param name="passname" select="$passname"/>
				<xsl:with-param name="occurs" select="$occurs"/>
				<xsl:with-param name="count" select="$count+1"/>
				<xsl:with-param name="lastParam" select="$lastParam"/>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>
	<!-- ********************************************************************************* -->
	<xsl:template name="records">
		<xsl:text>var record = new Array()</xsl:text>
		<xsl:value-of select="$cr"/>
		<xsl:for-each select="RECORD">
			<xsl:variable name="recIndex" select="position() - 1"/>
			<xsl:text>record[</xsl:text>
			<xsl:value-of select="$recIndex"/>
			<xsl:text>] = new RecObject("</xsl:text>
			<xsl:for-each select="COLS/COL">
				<xsl:variable name="lastCOL" select="position()=last()"/>
				<xsl:choose>
					<xsl:when test="OCC">
						<xsl:for-each select="OCC">
						<!--	<xsl:choose>
								<xsl:when test="normalize-space(.)=''">
									<xsl:value-of select="normalize-space(.)"/>
								</xsl:when>
								<xsl:otherwise>  -->
									<xsl:value-of select="normalize-space(.)"/>
						<!--		</xsl:otherwise>
							</xsl:choose>  -->
							<xsl:choose>
								<xsl:when test="($lastCOL='true') and (position()=last())">
									<xsl:text>")</xsl:text>
								</xsl:when>
								<xsl:otherwise>
									<xsl:text>", "</xsl:text>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:for-each>
					</xsl:when>
					<xsl:otherwise>
					<!--	<xsl:choose>
							<xsl:when test="normalize-space(./node())=''"> -->
								<xsl:call-template name="changeQuote">
									<xsl:with-param name="string">
										<xsl:value-of select="normalize-space(./node())"/>
									</xsl:with-param>
								</xsl:call-template>
					<!--		</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="normalize-space(./node())"/>
							</xsl:otherwise>
						</xsl:choose> -->
						<xsl:choose>
							<xsl:when test="position()=last()">
								<xsl:text>")</xsl:text>
							</xsl:when>
							<xsl:otherwise>
								<xsl:text>", "</xsl:text>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>
			<xsl:for-each select="RELRECS">
				<xsl:if test="count(RELREC)&gt;1">
					<xsl:variable name="relNameLower">
						<xsl:call-template name="toLower">
							<xsl:with-param name="stringValue" select="translate(@name,'-.,','___')"/>
						</xsl:call-template>		
					</xsl:variable>	
					<xsl:value-of select="$cr"/>
					<xsl:text>record[</xsl:text>
					<xsl:value-of select="$recIndex"/>
					<xsl:text>].Rel_</xsl:text>
					<xsl:value-of select="$relNameLower"/>
					<xsl:text> = new Array()</xsl:text>
					<xsl:value-of select="$cr"/>
					<xsl:for-each select="RELREC">
						<xsl:variable name="relRecIndex" select="position() - 1"/>
						<xsl:text>record[</xsl:text>
						<xsl:value-of select="$recIndex"/>
						<xsl:text>].Rel_</xsl:text>
						<xsl:value-of select="$relNameLower"/>
						<xsl:text>[</xsl:text>
						<xsl:value-of select="$relRecIndex"/>
						<xsl:text>] = new </xsl:text>
						<xsl:value-of select="$relNameLower"/>
						<xsl:text>Object(</xsl:text>
							<xsl:for-each select="COLS/COL">
								<xsl:text>"</xsl:text>
								<xsl:value-of select="normalize-space(./node())"/>
								<xsl:text>"</xsl:text>
								<xsl:if test="position()!=last()">
									<xsl:value-of select="$comma"/>
								</xsl:if>
							</xsl:for-each>
						<xsl:text>)</xsl:text>
						<xsl:value-of select="$cr"/>
					</xsl:for-each>
				</xsl:if>
			</xsl:for-each>
			<xsl:value-of select="$cr"/>
		</xsl:for-each>
		<xsl:text>var NbrRecs = </xsl:text>
		<xsl:value-of select="//DME/RECORDS/@count"/>
		<xsl:value-of select="$cr"/>
		<xsl:value-of select="$cr"/>
		<xsl:text>var reckey = new Array()</xsl:text>
		<xsl:value-of select="$cr"/>
		<xsl:for-each select="//DME/RECORDS/RECORD/RECKEY">
			<xsl:text>reckey[</xsl:text>
			<xsl:value-of select="position() - 1"/>
			<xsl:text>] = '</xsl:text>
			<xsl:value-of select="."/>
			<xsl:text>'</xsl:text>
			<xsl:value-of select="$cr"/>
		</xsl:for-each>
		<xsl:text>var DrillRef = new Array()</xsl:text>
		<xsl:value-of select="$cr"/>
		<xsl:for-each select="//DME/RECORDS/RECORD/IDACALL">
			<xsl:text>DrillRef[</xsl:text>
			<xsl:value-of select="position() - 1"/>
			<xsl:text>] = "</xsl:text>
			<xsl:value-of select="normalize-space(//DME/BASE/IDABASE/@executable)"/>
			<xsl:text>?</xsl:text>
			<xsl:call-template name="changeAmp">
				<xsl:with-param name="string">
					<xsl:value-of select="normalize-space(//DME/BASE/IDABASE/ .)"/>
					<xsl:value-of select="normalize-space(.)"/>
				</xsl:with-param>
			</xsl:call-template>
			<xsl:text>"</xsl:text>
			<xsl:value-of select="$cr"/>
		</xsl:for-each>
	</xsl:template>
	<!-- ********************************************************************************* -->
	<xsl:template name="basicCall">
		<xsl:text>var Basic_Call = unescape("</xsl:text>
		<xsl:value-of select="normalize-space(//DME/BASE/DMEBASE/@executable)"/>
		<xsl:text>?</xsl:text>
		<xsl:call-template name="changeAmp">
			<xsl:with-param name="string">
				<xsl:value-of select="normalize-space(//DME/BASE/DMEBASE)"/>
			</xsl:with-param>
		</xsl:call-template>
		<xsl:text>&amp;").replace(/"/g,'\\"');</xsl:text>
		<xsl:value-of select="$cr"/>
		<xsl:choose>
			<xsl:when test="//DME/NEXTCALL">
				<xsl:text>var Next = Basic_Call + unescape("</xsl:text>
				<xsl:call-template name="changeAmp">
					<xsl:with-param name="string">
						<xsl:value-of select="normalize-space(//DME/NEXTCALL)"/>
					</xsl:with-param>
				</xsl:call-template>
				<xsl:text>").replace(/"/g,'\\"');</xsl:text>
			</xsl:when>
			<xsl:otherwise>var Next = "";</xsl:otherwise>
		</xsl:choose>
		<xsl:value-of select="$cr"/>
		<xsl:choose>
			<xsl:when test="//DME/PREVCALL">
				<xsl:text>var Prev = Basic_Call + unescape("</xsl:text>
				<xsl:call-template name="changeAmp">
					<xsl:with-param name="string">
						<xsl:value-of select="normalize-space(//DME/PREVCALL)"/>
					</xsl:with-param>
				</xsl:call-template>
				<xsl:text>").replace(/"/g,'\\"');</xsl:text>
			</xsl:when>
			<xsl:otherwise>var Prev = "";</xsl:otherwise>
		</xsl:choose>
		<xsl:value-of select="$cr"/>
		<xsl:text>var Reload = Basic_Call + unescape("</xsl:text>
		<xsl:call-template name="changeAmp">
			<xsl:with-param name="string">
				<xsl:value-of select="normalize-space(//DME/RELOAD)"/>
			</xsl:with-param>
		</xsl:call-template>
		<xsl:text>").replace(/"/g,'\\"');</xsl:text>
		<xsl:value-of select="$cr"/>
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
			<xsl:otherwise>
				<xsl:variable name="dmeFunc">
					<xsl:if test="contains(//DME/BASE/DMEBASE,'FUNC=')">
						<xsl:choose>
							<xsl:when test="contains(substring-after(//DME/BASE/DMEBASE,'FUNC='),'&amp;')">
								<xsl:value-of select="normalize-space(substring-before(substring-after(//DME/BASE/DMEBASE,'FUNC='),'&amp;'))"/>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="normalize-space(substring-after(//DME/BASE/DMEBASE,'FUNC='))"/>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:if>
				</xsl:variable>			
				<xsl:choose>
				<xsl:when test="$dmeFunc!=''">
					<xsl:text>eval(unescape('parent.</xsl:text>
					<xsl:value-of select="$dmeFunc"/>
					<xsl:text>'));</xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<xsl:text>parent.Dsp</xsl:text>
					<xsl:call-template name="toUpper">
						<xsl:with-param name="stringValue">
							<xsl:value-of select="normalize-space(substring(substring-before(substring-after(//DME/BASE/DMEBASE,'FILE='),'&amp;'),1,1))"/>
						</xsl:with-param>
					</xsl:call-template>
					<xsl:call-template name="toLower">
						<xsl:with-param name="stringValue">
							<xsl:value-of select="normalize-space(substring(substring-before(substring-after(//DME/BASE/DMEBASE,'FILE='),'&amp;'),2))"/>
						</xsl:with-param>
					</xsl:call-template>
					<xsl:text>();</xsl:text>
				</xsl:otherwise>
				</xsl:choose>
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

		var LoadTimer = setTimeout('OnloadTimeout()',3000);

	</xsl:template>
	<!-- ********************************************************************************* -->
	<xsl:template name="toLower">
		<xsl:param name="stringValue"/>
		<xsl:value-of select="translate($stringValue,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')"/>
	</xsl:template>
	<!-- ********************************************************************************* -->
	<xsl:template name="toUpper">
		<xsl:param name="stringValue"/>
		<xsl:value-of select="translate($stringValue,'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')"/>
	</xsl:template>
	<!-- ********************************************************************************* -->
	<xsl:template name="changeAmp">
		<xsl:param name="string"/>
		<xsl:variable name="test2"/>
		<xsl:if test="contains($string, &quot;&amp;&quot;)">
			<xsl:variable name="test2" select="concat(substring-before($string,&quot;&amp;&quot;),'%26')"/>
			<xsl:call-template name="changeAmp">
				<xsl:with-param name="string">
					<xsl:value-of select="concat($test2,substring-after($string, &quot;&amp;&quot;))"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="not(contains($string, &quot;&amp;&quot;))">
			<!-- *** calls changeEqual ***************************************************** -->
			<xsl:call-template name="changeEqual">
				<xsl:with-param name="equalString">
					<xsl:choose>
						<xsl:when test="$test2 != ''">
							<xsl:value-of select="$test2"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="$string"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>
	<!-- ********************************************************************************* -->
	<xsl:template name="changeEqual">
		<xsl:param name="equalString"/>
		<xsl:variable name="test3"/>
		<xsl:if test="contains($equalString, &quot;=&quot;)">
			<xsl:variable name="test3" select="concat(substring-before($equalString,&quot;=&quot;),'%3D')"/>
			<xsl:call-template name="changeEqual">
				<xsl:with-param name="equalString">
					<xsl:value-of select="concat($test3,substring-after($equalString, &quot;=&quot;))"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="not(contains($equalString, &quot;=&quot;))">
			<xsl:value-of select="$equalString"/>
		</xsl:if>
	</xsl:template>
	<!-- ****** REMOVE " QUOTES  replaces with \"  '**************************** -->
	<xsl:template name="changeQuote">
		<xsl:param name="string"/>
		<xsl:if test="contains($string, '&quot;')">
			<xsl:value-of select="substring-before($string, '&quot;')"/>
			<xsl:text>\"</xsl:text>
			<xsl:call-template name="changeQuote">
				<xsl:with-param name="string">
					<xsl:value-of select="substring-after($string, '&quot;')"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="not(contains($string, '&quot;'))">
			<xsl:value-of select="$string"/>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
