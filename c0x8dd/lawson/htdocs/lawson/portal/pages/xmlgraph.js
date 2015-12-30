/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/pages/xmlgraph.js,v 1.4.4.1.18.1.2.2 2012/08/08 12:37:25 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
//-----------------------------------------------------------------------------
//		***************************************************************
//		*                                                             *                          
//		*                           NOTICE                            *
//		*                                                             *
//		*   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
//		*   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
//		*   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
//		*   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
//		*   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
//		*   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
//		*   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
//		*                                                             *
//		*   (c) COPYRIGHT 2012 INFOR.  ALL RIGHTS RESERVED.           *
//		*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//		*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//		*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//		*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//		*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//		*                                                             *
//		*************************************************************** 
//-----------------------------------------------------------------------------
var debugOn = true;
var resizeCount = 0;
var graphUpdatable = false;

var oXmlDoc;
var dataMax;
var dataMin;
var dataScale = 1;
var graphDataMin;
var graphDataMax;
var graphDataRange;
var graphScale;
var ticks = 8;
var barSpacing = 2;
var groupSpacing = 2;
var tickScale;
var yLabels;
var catLabels;
var valLabels;
var xAxisHeight;
var labelCount;
var datasetCount;
var datapointCount;
var datasetColors;
var graphWidth;
var graphHeight;
var positiveHeight;
var zeroLine;
var labelWidth;
var barWidth;

function initGraph( xmlDoc ) {
  	graphType = graphcontainer.graphtype;
	oXmlDoc = xmlDoc;
	if( graphType == "PIE" ) return;
	graphcontainer.style.visibility = 'hidden';
    catLabels = new Array();
	valLabels = new Array();
	yLabels = new Array();
	datasetColors = new Array();
	labelCount = oXmlDoc.selectNodes( "//label" ).length;
	datasetCount = oXmlDoc.selectNodes( "//dataset" ).length;
	datapointCount = oXmlDoc.selectNodes( "//dp" ).length;
	setDataMax( oXmlDoc );
	setDataMin( oXmlDoc );
	setTickScale( ( dataMax - dataMin ), ticks );
	setGraphScale();
	
	if( graphType == "HBAR" ) {
		loadCatLabels();
		loadYAxis( catLabels );
		loadScaleValues();
	}
	else {
		setYAxis();
	}
	setXAxis();
	setGraphBody();
	setDatasetColors();
	resizeGraph();
	//window.status = "initGraph complete";
	graphcontainer.style.visibility = 'visible';
}

function showError( sError ) {
	var sErrorHtml = "<div class='graphError'>" + sError + "</div>";
	graphcontainer.outerHTML += sErrorHtml;
}

document.onmousemove = drag;
document.onmouseup = drop;
document.onkeypress = handleKeyPress;

function handleKeyPress() {
	if( event.keyCode == 99 ) {
		alert( oXmlDoc.xml );
	}
}

function setDataMax( XMLDocument ) {

	datapoints = XMLDocument.selectNodes( "//dp" );
	if( datapoints.length == 0 ) {
		dataMax = 0;
		showError( "No Data Available" )
		return;
	}
	var max = parseFloat( datapoints[ 0 ].getAttribute( "value" ).replace( ',', '' ) )
	var temp = max

	for( i = 0; i < datapoints.length; i++ ) {
		temp = parseFloat( datapoints[ i ].getAttribute( "value" ).replace( ',', '' ) )
		if( temp > max ) {
			max = temp
		}
	}
	dataMax = max > 0 ? max : 0;
	
}
		
function setDataMin( XMLDocument ) {

	datapoints = XMLDocument.selectNodes( "//dp" )
	if( datapoints.length == 0 ) {
		dataMin = 0;
		return;
	}
	var min = parseFloat( datapoints[ datapoints.length - 1 ].getAttribute( "value" ) )

	//for( i = 1; i < datapoints.length; i++ ) {
	for( i = datapoints.length - 1; i >= 0; i-- ) {
		temp = parseFloat( datapoints[ i ].getAttribute( "value" ).replace( ',', '' ) )
		if( temp < min ) {
			min = temp
		}
	}
	dataMin = min < 0 ? min : 0;
	return min
}

function setTickScale( range, ticks ) {
	// sets the tick scale of the chart
	var scales = new Array( 1, 2, 5 );
	var factor = 1;
	var dataScale = ( range / ticks );
	var i = 0;
	var set = false;
	tickScale = scales[ i ];
	while( !set ) {
		if( dataScale < tickScale ) {
			set = true;
		} else {
			i = i + 1;
			if( i == 3 ) {
				factor *= 10;
				i = 0;
			}
			tickScale = scales[ i ] * factor;
		}
	}
	return tickScale
}

function setGraphScale() {
	graphDataMax = tickScale * Math.ceil( dataMax / tickScale );
	graphDataMin = tickScale * Math.floor( dataMin / tickScale );
	graphDataRange = (graphDataMax - graphDataMin>0) ? graphDataMax - graphDataMin : 1;
}

function loadCatLabels() {
	var labels = oXmlDoc.selectNodes( "//label" );
	for( var i = 0; i < labels.length; i++ ) {
		catLabels[i] = labels[i].getAttribute( "value" );
	}
}

function loadYAxis( labels ) {
	var fontSize = 12;
	var htmLabels =  "";
	var htmScale = "<div style=\"position:absolute; top:0px; left:expression( 0 )\">";
	var top;
	var i = 0;
	for( var i = 0; i < labels.length; i++ ) {
		val = labels[i];
		htmLabels += '<div id="ylbl' + i + '" class="graphlabel"'
		+ ' style="position:relative; top:0px; text-align:right; vertical-align:middle;"><nobr>'
		+ labels[i] + '</nobr></div>'; 
		htmScale += '<v:line id="ytic' + i + '" from="0 0" to="5 0" strokecolor="black"/>';
		yLabels[i] = "ylbl" + i;
		//valLabels[i] = "ylbl" + i;
	}
	htmScale += "</div>";
	yscale.innerHTML = htmScale + "&#160;";
	ylabelcontainer.innerHTML = htmLabels + "&#160;";
	maxYWidth = 0;
	for( var i = 0; i < yLabels.length; i++ ) {
		label = eval( yLabels[i] );
		maxYWidth = ( label.offsetWidth > maxYWidth ) ? label.offsetWidth : maxYWidth;
	}
	ylabelcontainer.style.width = maxYWidth;	
	ypos.style.display = 'none';
}

function setYAxis() {
	//ylabelcontainer.innerHTML = 
	getYAxis();
}

function getYAxis() {
	//return "<div class='graphlabel'>ylbl</div>";
	var fontSize = 12;
	var htmLabels =  "";
	var htmScale = "<div style=\"position:absolute; top:0px; left:expression( 0 )\">";
	var val = graphDataMax;
	var top;
	var i = 0;
	while( val > graphDataMin ) {
		val = graphDataMax - i * tickScale;
/*		top = ( ( graphDataMax - val ) * dataScale );
		htmLabels += "<div id='ylbl"+i+"' class='graphlabel' style=\"position:absolute; top:"
			+ ( top - fontSize / 2 )
			+ "px; left:expression( graphbody.offsetLeft - this.clientWidth ); width:expression( this.clientWidth ); text-align:right; vertical-align:middle;\">"+val+"</div>";
*/
		htmLabels += "<div id='ylbl"+i+"' class='graphlabel' style=\"position:relative; top:0px; text-align:right; vertical-align:middle;\"><nobr>"+val+"</nobr></div>"; //left:expression( graphbody.offsetLeft - this.clientWidth ); 
//		htmScale += "<v:line from=\"0 " + top + "\" to=\"5 " + top + "\" strokecolor=\"black\"/>";
		htmScale += '<v:line id="ytic' + i + '" from="0 0" to="5 0" strokecolor="black"/>';
		yLabels[i] = "ylbl" + i;
		valLabels[i] = "ylbl" + i;
		i = i + 1;
	}
	<!--htmScale += "<v:line style=\"position:absolute\" from=\"5 0\" to=\"5 " + graphbody.clientHeight + "\" style=\"left:expression( graphbodycontainer.offsetLeft )\" strokecolor=\"black\"/>";-->
	htmScale += "</div>";
	//alert( htmLabels );\
	yscale.innerHTML = htmScale + "&#160;";
	ylabelcontainer.innerHTML = htmLabels + "&#160;";
	maxYWidth = 0;
	for( var i = 0; i < yLabels.length; i++ ) {
		//window.status="i="+i;
		label = eval( yLabels[i] );
		//window.status="pre label="+label.id;
		maxYWidth = ( label.offsetWidth > maxYWidth ) ? label.offsetWidth : maxYWidth;
	}
	ylabelcontainer.style.width = maxYWidth;	
	ypos.style.display = 'none';
	//window.status="y axis set";
	//return htmLabels + "&#160;";
}

function loadScaleValues() {
	var fontSize = 12;
	var htmLabels =  "";
//	var htmScale = "<div style=\"position:absolute; top:0px; left:expression( 0 )\">";
	var val = graphDataMax;
	var adjVal;
	var top;
	var i = 0;
	while( val > graphDataMin ) {
		val = graphDataMax - i * tickScale;
		/*if( val < 0 ) 
			adjVal = val + tickScale / 2;
		else if( val > 0 ) 
			adjVal = val - tickScale / 2;
		else */
			adjVal = val;
		htmLabels += '<div id="xlbl' + i + '" class="graphlabel"'
		+ ' style="position:relative; top:0px; text-align:right; vertical-align:middle;"><nobr>' 
		+ adjVal + '</nobr></div>'; //left:expression( graphbody.offsetLeft - this.clientWidth ); 
//		htmScale += '<v:line id="ytic' + i + '" from="0 0" to="5 0" strokecolor="black"/>';
//		yLabels[i] = "ylbl" + i;
		valLabels[i] = "xlbl" + i;
		i = i + 1;
	}
	<!--htmScale += "<v:line style=\"position:absolute\" from=\"5 0\" to=\"5 " + graphbody.clientHeight + "\" style=\"left:expression( graphbodycontainer.offsetLeft )\" strokecolor=\"black\"/>";-->
//	htmScale += "</div>";
//	alert( htmLabels );
//	yscale.innerHTML = htmScale + "&#160;";
	xlabelcontainer.innerHTML = htmLabels + "&#160;";
//	maxYWidth = 0;
//	for( var i = 0; i < yLabels.length; i++ ) {
//		window.status="i="+i;
//		label = eval( yLabels[i] );
//		window.status="pre label="+label.id;
//		maxYWidth = ( label.offsetWidth > maxYWidth ) ? label.offsetWidth : maxYWidth;
//	}
//	ylabelcontainer.style.width = maxYWidth;	
//	ypos.style.display = 'none';
//	window.status="y axis set";
	//return htmLabels + "&#160;";
}

function setYAxisPosition() {
 	positionYLabels( yLabels );
	// position the y axis labels
	//window.status = "setYAxisPosition";
	var incY = ( graphbody.clientHeight + 1 )/ ( yLabels.length - 1 ); //offsetHeight
	var y = ypos.offsetTop;
	for( i = 0; i < yLabels.length; i++ ) {
		label = eval( yLabels[i] );
		label.style.width = maxYWidth + 5; //label.offsetWidth;
		//maxYWidth = ( label.offsetWidth > maxYWidth ) ? label.offsetWidth : maxYWidth;
		label.style.position = 'absolute';			
		label.style.left = graphcontainer.parentElement.offsetLeft 
		+ ylabelcontainer.offsetLeft - 5;
		label.style.top = y - ( label.clientHeight / 2 );
		tick = eval( "ytic"+i );
		tick.style.top = y;
		tick.style.left = graphcontainer.parentElement.offsetLeft 
		+ graphbodycontainer.offsetLeft - 5;
		y += incY;
	}
}

function positionYLabels( labels ) {
	// position the y axis labels
	var incY = ( graphbody.clientHeight + 1 ) / labels.length; //offsetHeight
	var y = ypos.offsetTop + incY / 2;
	for( i = 0; i < labels.length; i++ ) {
		label = eval( labels[i] );
		label.style.width = maxYWidth + 5;
		label.style.position = 'absolute';			
		label.style.left = graphcontainer.parentElement.offsetLeft 
		+ ylabelcontainer.offsetLeft - 5;
		label.style.top = y - ( label.clientHeight / 2 );
		tick = eval( "ytic"+i );
		tick.style.top = y;
		tick.style.left = graphcontainer.parentElement.offsetLeft 
		+ graphbodycontainer.offsetLeft - 5;
		y += incY;
	}
}

function setGraphBody() {
	//window.status = "setGraphBody";
	var htm = "";
	var datasets;
	var datapoints;
	var fillcolor;
	
	//draw the zero line
	htm += "<v:line id='zeroline' style='position:absolute' strokecolor='#000000'/>";
	datasets = oXmlDoc.selectNodes( "//dataset" );
	for( var i = 0; i < datasetCount; i++ ) {
		datapoints = datasets[i].selectNodes( "dp" );
		for( var j = 0; j < datapoints.length; j++ ) {
			value = datapoints[j].getAttribute( "value" );
			if( graphType == "LINE" ) {
				htm += "<v:line id='dp_" + i + "_" + j + "' style='position:absolute;' strokeweight='2px'/>"
			}
			else if( graphType == "VBAR" ) {
				htm += "<v:rect id='dp_" + i + "_" + j + "' style='position:absolute; z-index:0' title='"+value+"'"
				+ " onMouseOver=\"setLegendHighlight( " + i + ", true ); setDatapointHighlight( this.id, true )\""
				+ " onMouseOut=\"setLegendHighlight( " + i + ", false ); setDatapointHighlight( this.id, false )\""
				+ "><v:fill type='gradient' color2='#FFFFFF'/></v:rect>"
			}
			else if( graphType == "HBAR" ) {
				htm += "<v:rect id='dp_" + i + "_" + j + "' style='position:absolute; z-index:0' title='"+value+"'"
				+ " onMouseOver=\"setLegendHighlight( " + i + ", true ); setDatapointHighlight( this.id, true )\""
				+ " onMouseOut=\"setLegendHighlight( " + i + ", false ); setDatapointHighlight( this.id, false )\""
				+ "><v:fill type='gradient' color2='#FFFFFF'/></v:rect>"
			}
			htm += "<div id='dpc_" + i + "_" + j + "' par='dp_" + i + "_" + j + "' style='filter:alpha( opacity=0 ); background-color:yellow; font-size:5px; position:absolute; z-index:1;'"
			if( graphUpdatable ) {
				htm += " onmousedown=\"grab( this )\" onmouseup=\"drop( this )\" onmousemove=\"drag()\" onmouseclick=\"drop( this )\" onmouseover=\"this.style.filter='alpha( opacity=75 )'; this.style.cursor='hand'; setDatapointHighlight( this.par, true )\" onmouseout=\"this.style.filter='alpha( opacity=0 )'; this.style.cursor='default'; setDatapointHighlight( this.par, false )\""
			}
			htm += "></div>";
		}
	}
	graphbody.innerHTML = htm;
}

function setLineGraphPosition() {
 	// position the graph body contents for the line graph
	//window.status = "setGraphBodyPosition";
	zeroline.from = "0 " + zeroLine;
	zeroline.to = graphbody.clientWidth + " " + zeroLine;
	var datasets;
	var datapoints;
	var dp;
	var dpc;
	var scaledValue;
	var xOffset;
	graphbodyOffsetTop = 0; //graphbodycontainer.offsetTop + graphbodycontainer.clientTop + graphcontainer.parentElement.offsetTop + graphcontainer.parentElement.clientTop + 2;
	datasets = oXmlDoc.selectNodes( "//dataset" );
	for( var i = 0; i < datasetCount; i++ ) {
		datapoints = datasets[i].selectNodes( "dp" );
		strokecolor = datasetColors[ datasets[i].getAttribute( "id" ) ];
		xOffset = labelWidth / 2;
		for( var j = 0; j < datapoints.length - 1; j++ ) {
			value = datapoints[j].getAttribute( "value" );
			nextValue = datapoints[j+1].getAttribute( "value" );
			dp = eval( "dp_" + i + "_" + j );
			dpc = eval( "dpc_" + i + "_" + j );
			dp.strokecolor = strokecolor;
			dpc.style.width = 10; 
			
			scaledValue = getScaledHeight( value.replace( ',', '' ) );
			scaledNextValue = getScaledHeight( nextValue.replace( ',', '' ) );
			if( scaledValue >= 0 ) {
				dp.from = ( xOffset + j * labelWidth ) + ", " + ( graphbodyOffsetTop + zeroLine - scaledValue );
			}
			else {
				dp.from = ( xOffset + j * labelWidth ) + ", " + ( graphbodyOffsetTop + zeroLine + Math.abs( scaledValue ) );
			}
			if( scaledNextValue >= 0 ) {
				dp.to = ( xOffset + ( j + 1 ) * labelWidth ) + ", " + ( graphbodyOffsetTop + zeroLine - scaledNextValue ); // 
			}
			else {
				dp.to = ( xOffset + ( j + 1 ) * labelWidth ) + ", " + ( graphbodyOffsetTop + zeroLine + Math.abs( scaledNextValue ) );
			}

		}
	}
	//window.status = "graphBodyPosition set";
}

function setHbarGraphBodyPosition() {
	zeroline.from = zeroLine + " 0";
	zeroline.to = zeroLine + " " + graphbody.clientHeight;
	var datasets;
	var datapoints;
	var dp;
	var scaledValue;
	var xOffset;
	graphbodyOffsetTop = graphbodycontainer.offsetTop + graphbodycontainer.clientTop + 2;
	datasets = oXmlDoc.selectNodes( "//dataset" );
	for( var i = 0; i < datasetCount; i++ ) {
		datapoints = datasets[i].selectNodes( "dp" );
		fillcolor = datasetColors[ datasets[i].getAttribute( "id" ) ];
		xOffset = graphcontainer.parentElement.offsetLeft 
			+ graphbodycontainer.offsetLeft + graphbodycontainer.clientLeft 
			+ graphbodycontainer.clientLeft + 1;
		yOffset = graphbodyOffsetTop + i * ( barWidth + barSpacing )
			+ ( groupSpacing + barSpacing ) / 2;
		for( var j = 0; j < datapoints.length; j++ ) {
			value = datapoints[j].getAttribute( "value" );
			dp = eval( "dp_" + i + "_" + j );
			dp.fillcolor = fillcolor;
			dp.style.height = barWidth;
			dp.style.top = yOffset + j * ( graphHeight / labelCount ); //labelWidth;
			scaledValue = getScaledHeight( value.replace( ',', '' ) );
			if( scaledValue >= 0 ) {
				dp.style.left = xOffset + zeroLine;
				dp.style.width = scaledValue;
			}
			else {
				dp.style.left = xOffset + zeroLine + scaledValue + 1;
				dp.style.width = Math.abs( scaledValue );
			}
		}
	}
	//window.status = "graphBodyPosition set";
}

function setGraphBodyPosition() {
	if( isNaN( zeroLine ) ) return;
	if( graphType == "LINE" ) {
		setLineGraphPosition();
		return;
	}
	zeroline.from = "0 " + zeroLine;
	zeroline.to = graphbody.clientWidth + " " + zeroLine;
	var datasets;
	var datapoints;
	var dp;
	var dpc;
	var scaledValue;
	var xOffset;
	graphbodyOffsetTop = graphbodycontainer.offsetTop + graphbodycontainer.clientTop + 2;
	//graphcontainer.parentElement.offsetTop + graphcontainer.parentElement.clientTop; // 	+ 
	datasets = oXmlDoc.selectNodes( "//dataset" );
	for( var i = 0; i < datasetCount; i++ ) {
		datapoints = datasets[i].selectNodes( "dp" );
		fillcolor = datasetColors[ datasets[i].getAttribute( "id" ) ];
		xOffset = graphcontainer.parentElement.offsetLeft 
			+ graphbodycontainer.offsetLeft + graphbodycontainer.clientLeft 
			+ graphbodycontainer.clientLeft + i * ( barWidth + barSpacing )
			+ ( groupSpacing + barSpacing ) / 2;
		for( var j = 0; j < datapoints.length; j++ ) {
			value = datapoints[j].getAttribute( "value" );
			dp = eval( "dp_" + i + "_" + j );
			dpc = eval( "dpc_" + i + "_" + j );
			dp.fillcolor = fillcolor;
			dp.style.width = barWidth;
			dp.style.left = xOffset + j * labelWidth;
			dpc.style.left = dp.style.left;
			dpc.style.width = barWidth + 1;
			scaledValue = getScaledHeight( value.replace( ',', '' ) );
			if( scaledValue >= 0 ) {
				dp.style.top = graphbodyOffsetTop + zeroLine - scaledValue;
				dp.style.height = scaledValue;
				dpc.style.top = dp.style.posTop - 1;
			}
			else {
				dp.style.top = graphbodyOffsetTop + zeroLine;
				dp.style.height = Math.abs( scaledValue );
				dpc.style.top = dp.style.posTop + dp.style.posHeight - 2;
			}
		}
	}
	//window.status = "graphBodyPosition set";
}

function getScaledHeight( value ) {
	return value * graphScale;
}

function setDatasetColors() {
	for( var i = 0; i < datasetCount; i++ ) {
		datasetColors[i] = getRandomColor();
		for( var j = 0; j < i; j++ ) {
			if( datasetColors[i] == datasetColors[j] ) {
				i--;
				break;
			}
		}
		eval( "lgd_" + i ).fillcolor = datasetColors[i];
	}
}

function getDatasetColor( node ) {
	return datasetColors[ node.getAttribute( "id" ) ]
}
	
function getRandomColor() {
	// returns a web-safe random hex string
	var ws = new Array('00','33','66','99');
/*
	var R = new Array();
	var G = new Array();
	var B = new Array();
	for( var i = 0; i < ws.length; i++ ) {
		R[R.length] = ws[i];
		G[G.length] = ws[i];
		B[B.length] = ws[i];
	}
*/
	//var sColor = R[Math.round(Math.random()*(ws.length-1))] + '' + G[Math.round(Math.random()*(ws.length-1))] + '' + B[Math.round(Math.random()*(ws.length-1))];
	var sColor = ws[Math.round(Math.random()*(ws.length-1))] + '' + ws[Math.round(Math.random()*(ws.length-1))] + '' + ws[Math.round(Math.random()*(ws.length-1))];
	return sColor;
}
			
function setBarWidth( totalWidth ) {
	barWidth = ( ( totalWidth - ( ( ( datapointCount + 1 ) * barSpacing ) 
	+ ( ( labelCount ) * groupSpacing )  ) ) / datapointCount )
}

function highlightDataset( dsid, bHighlight ) {
	setLegendHighlight( dsid, bHighlight );
	var i = 0;
	while( i != labelCount ) {
		setDatapointHighlight( ( "dp_" + dsid + "_" + i ), bHighlight );
		i++;
	}
}

function setDatapointHighlight( name, bHighlight ) {

	var obj = eval( name );
	var value = obj.title.replace( ',', '' );
	value = value.substring( 7, value.length );
	if( value < 0 ) {
		if( bHighlight ) {
			obj.topcolor = obj.fill.color2;
			obj.fillcolor = obj.fill.color2;
		}
		else {
			obj.fillcolor = '#FFFFFF';
			obj.fill.color2 = obj.topcolor;
		}
	}
	if( bHighlight ) obj.fill.type='solid';
	else obj.fill.type='gradient';
}

function setLegendHighlight( dsid, bHighlight ) {
	if( bHighlight ) {
		eval( "legend" + dsid ).style.backgroundColor = '#CCCCFF';
		eval( "legend" + dsid ).style.cursor = 'hand';
	} else {
		eval( "legend" + dsid ).style.backgroundColor = '#FFFFFF';
	}
}
			
function setLegendHighlight( dsid, bHighlight ) {
	if( bHighlight ) {
		eval( "legend" + dsid ).style.backgroundColor = '#CCCCFF';
		eval( "legend" + dsid ).style.cursor = 'hand';
	} else {
		eval( "legend" + dsid ).style.backgroundColor = '#FFFFFF';
	}
}

function setLegendVisibility() {
	var trs = legend.all.tags( "tr" );
	for( var i = 1; i < trs.length; i++ ) {
		trs[i].style.display = ( trs[i].style.display == "none" ) ? "block": "none";
	}
}

function setXAxis() {
	// positions the labels along the x axis
	//window.status = "setXAxisPosition";
	var elements = xaxis.all;
	var x = 0;
/*	var cnt = 0;
	// count the x axis labels
	for( i = 0; i < elements.length; i++ ) {
		if( elements[i].id.substring( 0, 4 ) == 'xlbl' ) {
			cnt++;
		}
	}*/
	var maxHeight = 0;
	var incX = graphbody.clientWidth / labelCount;
	labelWidth = incX;
	x += ( incX / 2 ) + 6;
	for( i = 0; i < elements.length; i++ ) {
		if( elements[i].id.substring( 0, 4 ) == 'xlbl' ) {
			elements[i].style.position = 'absolute';
			elements[i].style.setExpression( "left", "graphbodycontainer.offsetLeft + " + x, "javascript" ); 
			//elements[i].style.top = '0px';
			if( elements[i].clientWidth < incX ) {
				elements[i].style.width = elements[i].clientWidth; //xaxis.clientWidth;
				elements[i].style.writingMode = "lr-tb";
			}
			else {	
				maxHeight = ( elements[i].clientWidth > maxHeight ) ? elements[i].clientWidth : maxHeight;
				elements[i].style.height = elements[i].clientWidth; //xaxis.clientWidth;
				elements[i].style.writingMode = "tb-rl";
			}
			x += incX;
		}
	}
	xlabelcontainer.style.height = maxHeight;
	xAxisHeight = maxHeight;
	xscale.innerHTML = getXScale( labelCount );
}

function positionXScale() {
	// positions the labels along the x axis
	var x = 0;
	var incX = graphbody.clientWidth / ( valLabels.length - 1 );
	labelWidth = incX;
	x = 0 //incX / 2;
	var label;
//	for( i = 0; i < valLabels.length; i++ ) {
	for( i = valLabels.length - 1; i >= 0 ; i-- ) {
		label = eval( valLabels[i] );
		//label.style.position = 'relative';
		label.style.top = graphtitle.clientHeight + graphbodycontainer.clientTop 
			+ graphbodycontainer.clientHeight + xscale.clientHeight + 2;
		if( xAxisHeight < incX ) {
			label.style.left = graphbodycontainer.offsetLeft + x - ( label.offsetWidth / 2 );
			label.style.width = label.clientWidth;
			label.style.writingMode = "lr-tb";
		}
		else {
			label.style.setExpression( "left", "graphbodycontainer.offsetLeft + " + ( x - 6 ), "javascript" ); 
			label.style.width = 0;	
			label.style.height = xAxisHeight;
			label.style.textAlign = "left";
			label.style.paddingTop = "2px";
			label.style.writingMode = "tb-rl";
		}
		x += incX;
	}
	xscale.innerHTML = getXScaleH( valLabels.length );
}

function setXAxisPosition() {
	// positions the labels along the x axis
	//window.status = "setXAxisPosition";
	var elements = xaxis.all;
	var x = 0;
	var incX = graphbody.clientWidth / labelCount;
	labelWidth = incX;
	x = ( incX / 2 ); // + 6;
	for( i = 0; i < elements.length; i++ ) {
		if( elements[i].id.substring( 0, 4 ) == 'xlbl' ) {
			//elements[i].style.left = graphbodycontainer.offsetLeft + x + ( incX / 2 ) - ( labelWidth + elements[i].clientWidth / 2 );
			if( xAxisHeight < incX ) {
				elements[i].style.left = graphbodycontainer.offsetLeft + x - ( elements[i].offsetWidth / 2 ); //10 +  - 6
				elements[i].style.width = elements[i].clientWidth; //xaxis.clientWidth;
				elements[i].style.writingMode = "lr-tb";
			}
			else {
				elements[i].style.setExpression( "left", "graphbodycontainer.offsetLeft + " + ( x - 6 ), "javascript" ); 
				elements[i].style.width = 0;	
				elements[i].style.height = xAxisHeight;
				elements[i].style.writingMode = "tb-rl";
			}
			x += incX;
		}
	}
	//xlabelcontainer.style.height = maxHeight;
	//xAxisHeight = maxHeight;
	xscale.innerHTML = getXScale( labelCount );
}

function getXScale( cnt ) {
	var xSpacing = graphbody.clientWidth / cnt;
	var x = xSpacing / 2;
	var htm = ""; //<v:line from='0 0' to='" + graphbody.clientWidth + " 0'/>";
	for( var i = 0; i < cnt; i++ ) {
		htm += "<v:line from='" + x + " 0' to='" + x + " 5'/>";
		x += xSpacing;
	}
	return htm + "<span style='font-size:2px;'>&#160;</span>";
}

function getXScaleH( cnt ) {
	//cnt = (cnt-1) * 2 + 1;
	var xSpacing = ( graphbody.offsetWidth - 1 ) / ( cnt - 1 );
	var x = 0;
	var htm = ""; //<v:line from='0 0' to='" + graphbody.clientWidth + " 0'/>";
	for( var i = 0; i < cnt; i++ ) {
		htm += "<v:line from='" + x + " 0' to='" + x + " 5'/>";
		x += xSpacing;
	}
	return htm + "<span style='font-size:2px;'>&#160;</span>";
}

function resizeGraph() {
	if( graphType == "PIE" ) return;

	//window.status = "resizeGraph";
	setXAxisPosition();
	setYAxisPosition();
	graphWidth = graphbody.clientWidth;
	graphHeight = graphbody.clientHeight; //offsetHeight
	//positiveHeight = 
	//ad( graphScale );
	if( graphType == "HBAR" ) {
		graphScale = ( graphWidth / graphDataRange );
		zeroLine = ( graphDataRange - graphDataMax ) * graphScale; //+ graphDataMin
		setBarWidth( graphHeight );
		positionXScale();
		positionYLabels( yLabels );
		setHbarGraphBodyPosition();
	}
	else {
		graphScale = ( graphHeight / graphDataRange );
		zeroLine = ( graphDataRange + graphDataMin ) * graphScale;
		setBarWidth( graphWidth );
		setGraphBodyPosition();
	}
	resizeCount++;
	//window.status = "resize complete";
}


function trim( str ) {
	// trim leading and trailing spaces
	str = str.replace( /^ */, "" );
	while( str.charAt( str.length - 1 ) == " " ) {
		str = str.substring( 0, str.length - 1 );
	}
	return str;
}


function getResizeCount() { 
	return resizeCount;
}

function ad( msg ) {
	if( debugOn ) alert( msg );
}


// DRAGGING METHODS //
var dragging = false;
var oDrag;
var orgHeight;
var orgTop;
var orgY;

function grab( obj ) {
//window.status="grab " + obj.id;
	dragging = true;
	oDrag = obj;
	par = eval( oDrag.par )
	orgHeight = par.style.posHeight;
	orgTop = par.style.posTop;
	orgY = window.event.y;
	//grabOffset = window.event.offsetY;
	//window.event.cancelBubble = true;
}

function drop( obj ) {
	if( obj != null ) {
		if (typeof(oDrag)!="undefined" && oDrag!=null) {
			var dpData = oDrag.id.split( "_" );
			var newValue = eval( oDrag.par ).title;
			//alert( "update ds"+dpData[1]+" dp"+dpData[2]+" to "+eval( oDrag.par ).title );
			//alert( "old value " + oXmlDoc.selectSingleNode( "//dataset[ @id='"+dpData[1]+"' ]/dp[ "+dpData[2]+" ]" ).getAttribute( "value" ) );
			oXmlDoc.selectSingleNode( "//dataset[ @id='"+dpData[1]+"' ]/dp[ "+dpData[2]+" ]" ).setAttribute( "value", newValue );
		}
	}
	oDrag = null;
}

function drag() {
	if( oDrag != null ) {
		var value = eval( oDrag.par ).title.replace( ',', '' );
		//window.status="dragging " + oDrag.id + " :: " + value;
		if( value >= 0 ) {
			oDrag.style.top = window.event.y - graphcontainer.parentElement.offsetTop - 3;
			eval( oDrag.par ).style.top = oDrag.style.posTop + 3;
			eval( oDrag.par ).style.height = orgHeight + ( orgTop - eval( oDrag.par ).style.posTop );
			eval( oDrag.par ).title = "" + Math.round( ( eval( oDrag.par ).style.posHeight / graphScale ) * 100 ) / 100;
		}
		else {
			oDrag.style.top = window.event.y - graphcontainer.parentElement.offsetTop - 3;
			eval( oDrag.par ).style.height = orgHeight + ( window.event.y - orgY );
			eval( oDrag.par ).title = "-" + Math.round( ( eval( oDrag.par ).style.posHeight / graphScale ) * 100 ) / 100;
		}
		document.selection.empty(); // or clear()
	}
}