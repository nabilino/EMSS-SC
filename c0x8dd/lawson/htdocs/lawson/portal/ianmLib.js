
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
} 
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
} 
function hideDiv(div, callback)
{
	with ( { i: 128, div: div, h: div.offsetHeight, interval: 50 } )
	var fn = function () {
		if (i > 8)
		{
			if ( h <  ( 4 * interval ) ) // drawing to a close
			{
				i = i * 2
			}
			else
				i = i / 2
		}
		if ( h - interval > 0 )
		{
			h -= interval
			div.style.height = h + "px"
			setTimeout(fn, i)
		}
		else
		{
			div.style.height = 1 + "px"
			callback(div)
		}
	}
		
	fn()	

}
function revealDiv(div)
{
	var divProps = {}
	divProps.position = div.style.position
	divProps.top = div.style.top
	divProps.left = div.style.left
	divProps.overflow = div.style.overflow
	divProps.height = div.style.height
	
	div.style.position = 'absolute'
	div.style.top = 0
	div.style.left = 0
	
	document.body.appendChild(div)
	var h = div.offsetHeight
	
	document.body.removeChild(div)
	div.style.position = divProps.position
	div.style.top = divProps.top
	div.style.left = divProps.left
	div.style.overflow = 'hidden'
	//alert(h)
	
	with ( { i: 128, div: div, max: h, h: 0, interval: 50 } )
	var fn = function () {
		if (i > 8)
		{
			if ( h > ( max - ( 4 * interval ) ) ) // drawing to a close
			{
				i = i * 2 // increase delay
			}
			else
				i = i / 2 // decrease delay
		}
		if ( h + interval < max )
		{
			h += interval
			div.style.height = h + "px"
			setTimeout(fn, i)
		}
		else
			div.style.height = max + "px"
	}	
	fn()	
}
function zTrim(s)
{
	return s.replace(/^ */,'').replace(/^0*/,'');
}
function injectSubTable(tr, data)
{
	var ntr = document.createElement('tr')
	var td = document.createElement('td')
	var td1 = document.createElement('td')
	td1.colSpan = "99"
	ntr.appendChild(td)
	ntr.appendChild(td1)
	tr.parentNode.insertBefore(ntr, tr.nextSibling)
	tr.className = 'opened'
	td1.appendChild(data)
}
function removeSubTable(tr)
{
	tr.parentNode.removeChild(tr.nextSibling)
	tr.className = ''
}
function createField(colNum, rowData, colDefn)
{
	var val = String(rowData[colNum])
	val = val.replace('undefined','-')
	var td = document.createElement('td')
	var container = document.createElement('div')

	if (colDefn.type && colDefn.type == 'float')
			container.style.textAlign = "right"
	if (colDefn.toScreen) // user defined column filter function
		val = colDefn.toScreen(val, rowData)
	if (colDefn.onclick)
	{
		with ({ env: {handler: colDefn.onclick, td:td, x: rowData[colNum], rowData: rowData} })
		{
			var fn = function () { env.handler.call(env, env.x, env.td) }
		}
		container.onclick = fn
		container.className = "drillLink"
	}
	if (colDefn.onhover)
	{
		with ({ env: {handler: colDefn.onhover, td:td, x: rowData[colNum], rowData: rowData} })
		{
			var fn = function () { env.handler.call(env, env.x, env.td) }
		}
		container.onmouseover = fn
		container.className = "hoverable"
	}

	var tn = document.createTextNode(val)
	container.appendChild(tn)
	td.appendChild(container)
		
	td.className = 'rowLevel0'
	return td

}
function tabulateDME(dme, options)
{
	var tb = document.createElement('tbody')
	var rows = dme.RECORDS.RECORD
	var thr = document.createElement('tr')
	var colNames = dme.COLUMNS.COLUMN
	var colNumByName = {}
	var colsList = null;
	
	if (options && options.colDefns)
	{
		for (var i = 0; i < colNames.length; i++) 
		{
			colNumByName[colNames[i]['-dbname']] = i;
			if (options.colDefns[colNames[i]['-dbname']])
			{
				if (! colsList)
					colsList = {}
				colsList[i] = options.colDefns[colNames[i]['-dbname']]
			}
		}
		for (var c in options.colDefns)
		{
			var colNum = colNumByName[c]
			var th = document.createElement('th')
			var title = options.colDefns[c].title ? options.colDefns[c].title : colNames[colNum]['-dspname']
			var tn = document.createTextNode(title)
			th.appendChild(tn)
			thr.appendChild(th)			
		}
	}
	else
	{
		for (var i = 0; i < colNames.length; i++) // add the table column headings
		{
			colNumByName[colNames[i]['-dbname']] = i;
			if (! colsList)
				colsList = {}
			colsList[i] = colNames[i]
			var th = document.createElement('th')
			var tn = document.createTextNode(colNames[i]['-dspname'])
			th.appendChild(tn)
			thr.appendChild(th)
		}
	}

	
	tb.appendChild(thr)
	for (var r in rows) // add all the data rows
	{
		var cols = rows[r].COLS.COL
		var tr = document.createElement('tr')
		
		if (options && options.onclick) // onclick for the row level
		{
			if (options.onclickDataCol >= 0)
				var data = cols[options.onclickDataCol]
			else
				var data = cols
			with ( {x: data, trl: tr, fn: options.onclick, clicked: false, opened: false} )
			{
				var clickStart = function () {
					var clickActual = function() {
						opened = fn(x, trl, clicked, opened);
						clicked = ! clicked;
						document.body.className = '';
						trl.style.cursor = 'hand'
					}
					trl.style.cursor = 'wait';
					document.body.className = 'wait';
					setTimeout(clickActual, 100)
				} 
				tr.style.cursor = 'hand'
				tr.onclick = clickStart
			}
		}
		var colDefns = options.colDefns
		if (colDefns)
		{
			for (var c in colDefns)
			{
				var colNum = colNumByName[c]
				var td = createField(colNum, cols, colDefns[c])
				tr.appendChild(td)
			}
			tb.appendChild(tr)
		}
		else
		{
			for (var c in cols) // add each column data field
			{
				var td = createField(c, cols, colsList[c])
				tr.appendChild(td)
			}
			tb.appendChild(tr)
		}
	}
	return tb
}
function doAjax(query, callBack, data)
{
	if (typeof(query) == "object")
	{
		var q = query.query
		var forcedCols = query.forcedCols
	}
	else
	{
		var q = query
		var forcedCols = null
	}

	with ({callback: callBack})
	var processData = function (data) {
		var resp = data
		
		if (typeof resp == "string")
		{
			if (window.DOMParser)
			{
				var parser=new DOMParser();
				var xmlDoc=parser.parseFromString(resp,"text/xml");
			}
			else // Internet Explorer
			{
				var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async=false;
				xmlDoc.loadXML(resp);
			}
		}
		
		var xotree = new XML.ObjTree();
		xotree.force_array = forcedCols
		var res = xotree.parseDOM(xmlDoc);
		
		if (callBack)
			callBack(res['#document'])
		else
			return res['#document']
	}
	if (callBack)
	{
		return doXHR(q, processData, data)
	}
	else
	{
		var res = doXHR(q, null, data)
		return processData(res)
	}
}
function doXHR(url, callBack, data, noCache)
{
	var timestamp = new Date().getTime()
	var callBackFunc, errorFunc, responseHandler;
	if (window.XMLHttpRequest) {							
		var xhr=new XMLHttpRequest();							
	} else {																	
		var xhr=new ActiveXObject("Microsoft.XMLHTTP");
	}
	if (callBack && callBack.callBack)
	{
		callBackFunc = callBack.callBack
		if (callBack.error)
		{
			errorFunc = callBack.error
		}
		else
		{
			errorFunc = function (xhr) { alert("Communications error. Are you logged in?") }
		}
		if (callBack.response)
			responseHandler = callBack.response
	}
	else
	{
		callBackFunc = callBack
		errorFunc = function (xhr) { alert("Communications error. Are you logged in?") }
	}
	
	if (url.indexOf('?') > 0 || noCache) // only add to requests with params
		url += '&timestamp=' + timestamp

	xhr.open(data ? "POST" : "GET", url, callBack ? true : false)
	xhr.setRequestHeader("Content-Type", "text/xml");
	if (data)
		xhr.setRequestHeader("Content-Length", data.length);
	
	if (callBackFunc)
	{
		with ({xhr: xhr, callBack: callBackFunc, errorFunc: errorFunc})
		{
			if (responseHandler)
				var handleReturn = responseHandler
			else
				var handleReturn = function () {
				if (xhr.readyState==4) {
					if (xhr.status != 200)
						errorFunc(xhr)
					else
						callBack(xhr.responseText);
				}
		}
		xhr.onreadystatechange = handleReturn
		xhr.send(data)
		return xhr
		}
	}
	else
	{
		xhr.send(data)
		return xhr.responseText;
	}
}

with ({ids:{}})
var getRMData = function(id, node)
{
	if (! ids[id])
	{
		var url = "/rmwebapp/RMApiServlet"
		
		var data = '<TRANSACTION user="daServletUser" method="getRMQuery"><OBJECT><![CDATA[People]]></OBJECT>'
		+ '<ATTRIBUTES>'
		+ '<ATTRIBUTE><![CDATA[LastName]]></ATTRIBUTE>'
		+ '<ATTRIBUTE><![CDATA[FirstName]]></ATTRIBUTE>'
		+ '</ATTRIBUTES>'
		+ '<WHERE><![CDATA[({ID}=' + id + ')]]></WHERE>'
		+ '</TRANSACTION>'
	
		var query = {
			query: "/rmwebapp/RMApiServlet",
			forcedCols: ['ROW', 'ROWATTR']
		}
		with ({node:node, ids: ids, id:id})
		var fn = function(data) {
			var objDoc = data
			var trans = objDoc.TRANSACTION
			var row = trans.ROWS.ROW
			var name = (row[0].ROWATTR[0].VALUE + ", " + row[0].ROWATTR[1].VALUE)
			ids[id] = name
			node.title = name 
		}
		var objDoc = doAjax(query, fn, data)
		//fn(objDoc)
		return
	}

	node.title = ids[id] 
}
function getWUData(info, node, clicked, opened)
{
	if (node.nodeName == "TD")
		var tr = node.parentNode
	else
		var tr = node
	
	if (clicked)
	{
		// just remove table
		if (opened)
		{
			if (false ) //portalWnd.oUserProfile.getAttribute("id") == "u0x8im00")
			{
				with ({tr:tr})
				var fn = function () { tr.parentNode.removeChild(tr.nextSibling); tr.className = '' }
				hideDiv(tr.nextSibling.childNodes[1].firstChild, fn)
			}
			else
			{
				removeSubTable(tr)
			}
			opened = false
		}
		return
	}
	
	//var service = "SLEmpExpApp"
	//var serviceVar = "EXPENSE_NBR"
	var varVal = info.value
	var service = info.service
	var serviceVar = info.serviceVar
	//var service = "JobReq Approval"
	//var serviceVar = "PJR_REQUISITION"
	
	var q = "PROD=LOGAN&FILE=WFVARIABLE&INDEX=WFVSET1"
	+ "&FIELD=WORKUNIT;VARIABLE-NAME;VARIABLE-VALUE;WORKUNIT.START-DATE;WORKUNIT.START-TIME;WORKUNIT.SERVICE;"
	+ "WORKUNIT.WORK-TITLE;WORKUNIT.TASK;WORKUNIT.WF-STATUS"
	+ "&SELECT=WORKUNIT.SERVICE=" + service
	+ "%26VARIABLE-NAME=" + serviceVar
	+ "%26VARIABLE-VALUE=" + varVal
	+ "&OUT=XML&DELIM=~&MAX=600"
	
	var query = {
		query: "/servlet/Router/Data/Erp?" + q,
		forcedCols: ['RECORD']
	}
	var objDoc = doAjax(query)
	var WFWURows = objDoc.DME.RECORDS.RECORD
		
	if (! WFWURows)
		return
	var WUNum = WFWURows[WFWURows.length -1].COLS.COL[0]
	//WUNum = 30238

	var q = "PROD=LOGAN&FILE=WFMETRICS&INDEX=WMESET2&KEY=" + WUNum
	+ "&FIELD=WORKUNIT;PROCESS-ID;END-DATE;END-TIME;STATUS;WF-RM-ID;TASK;ACTIVITY-ID;OPERATION;COMMENT;"
	+ "START-DATE;DUE-DATE&OUT=XML&MAX=600"

	var query = {
		query: "/servlet/Router/Data/Erp?" + q,
		forcedCols: ['RECORD']
	}
	var objDoc = doAjax(query)
	var WFMetricsRows = objDoc.DME.RECORDS.RECORD

	// Sort col 10 by Date
	//var fn = function (r0,r1) {var a = r0.COLS.COL[10], b = r1.COLS.COL[10]; return ((a.substr(6,4) + a.substr(0,2) + a.substr(3,2)) > (b.substr(6,4) + b.substr(0,2) + b.substr(3,2))) ? 1 : -1}
	
	// sort col 7 (eg. 'UA147')by removing the first two alpha chars and then sort by number
	var fn = function (r0,r1) {var a = parseInt(r0.COLS.COL[7].substr(2)), b = parseInt(r1.COLS.COL[7].substr(2)); return (a - b) }; 
	
	if (! WFMetricsRows)
		return
	
	WFMetricsRows.sort(fn)
	
	var s = ''
	for (var i = 0; i < WFMetricsRows.length; i++)
	{
		var cols = WFMetricsRows[i].COLS.COL
		s += cols[5] + ":" + cols[2] + ":" + cols[5] + ":" + cols[8] + "\n"
	}
	var tbl = document.createElement('table')
	tbl.className = 'subtable'
	var options = {
		colDefns: {
			'WORKUNIT': true,
			'WF-RM-ID': {
				title: 'Mgr ID',
				toScreen: function (x, cols) {
					if (x == 'bpmsystem')
						return ''
					return '[' + x + ']'
				},
				//onclick: getRMData,
				onhover: getRMData
			},
			'OPERATION': {
				title: 'Action',
				toScreen: function (x, cols) {
					if (x == 'Reject' && cols[5] == 'bpmsystem')
						return 'ESCALATED';
					return x
				}
			},
			'START-DATE': {
				title: 'Date Stamp'
			},
			'DUE-DATE': {
				title: 'Due By'
			},
			'ACTIVITY-ID': {
			}
		}
	}
	tbl.appendChild(tabulateDME(objDoc.DME, options))
	var div = document.createElement('div')
	div.appendChild(tbl)
	
	//revealDiv(div)
	
	injectSubTable(tr, div)
	return true
	//alert(s)
}
function ICField(val) {
	var cell = document.createElement('span')
	var field = document.createElement('span')
	cell.innerHTML += '&nbsp;'
	cell.appendChild(field)
	field.className = "invis"
	field.appendChild(document.createTextNode(val))
	with ({node: field, input: null})
	{
		var fn = function () {
			node.className = "vis"
		}
		var fn1 = function () {
			node.className = "invis"
		}
		var fn2 = function () {
			if (! input)
			{
				input = document.createElement('input')
				with ( { node: input } )
				var fn = function (e) {
					node.parentNode.className = "invis"
					if (!e)
						e = window.event
					var t = (e.target ? e.target : e.srcElement)
					reloadPage({employee: t.value})
				}
				input.onblur = fn
				input.onmouseout = function () {this.blur()}
				var value = node.firstChild.nodeValue
				input.setAttribute('value', value)
				var p = node.parentNode
				node.removeChild(node.firstChild)
				node.appendChild(input)
				input.focus()
				
				if (input.setSelectionRange)
					input.setSelectionRange(value.length, value.length)
				else
				{
					var range = input.createTextRange();
					range.collapse(true);
					range.moveEnd('character', value.length);
					range.moveStart('character', value.length);
					range.select();
				}
			}
			else
			{
				var txtNode = document.createTextNode(input.value)
				node.removeChild(node.firstChild)
				node.appendChild(txtNode)
				input = null
			}
		}
	}
	cell.onmouseover = fn
	cell.onmouseout = fn1
	cell.ondblclick = fn2
	return cell
}
function getPortal()
{
	var portalWnd = (typeof portalWnd == "undefined" || portalWnd == null ?  null : portalWnd), p = parent, c = 0, max = 10;
	while (!portalWnd && c < max && p)
	{
		portalWnd = p.portalWnd
		p = p.parent
		c++
	}
	return portalWnd
}
function getWFVariables(WUNumber)
{
	var q = "PROD=LOGAN&FILE=WFVARIABLE&INDEX=WFVSET1&KEY=" + WUNumber
	+ "&FIELD=VARIABLE-NAME;VARIABLE-VALUE&OUT=XML"
	var query = {
		query: "/servlet/Router/Data/Erp?" + q,
		forcedCols: ['RECORD','RELRECS','RELREC', 'COL']
	}
	var objData = doAjax(query);
	var rows = objData.DME.RECORDS.RECORD
	
	var o = {}
	for (var r = 0; r < rows.length; r++)
	{
		var key = rows[r].COLS.COL[0];
		var value = rows[r].COLS.COL[1];
		o[key] = value;
	}
	return o
}
function parseParams(params)
{	
	var o = new Object(params)
	var portalWnd = getPortal();
	if (portalWnd)
	{
		o.strPDL = portalWnd.oUserProfile.getAttribute("productline")
		o.strEmployee = zTrim(portalWnd.oUserProfile.getAttribute("employee"))
	}
	var ee = getCookie('employee')

	if (ee)
		o.strEmployee = ee
	
	if (window.location.search)
	{
		var s = window.location.search.substr(1).split('|');
		if (s.length == 3) // probably a WU Inbasket display exec
		{
			o.WUPDL = s[2]
			o.WUNumber = s[0]
			o.WUTitle = s[1]
			var WUVar = getWFVariables(o.WUNumber)
			for (var key in WUVar) { o[key] = WUVar[key];}
		}
		else // not a WU Inbasket display exec
		{
			var p = window.location.search.substr(1).split('&');
			for (var i = 0; i < p.length; i++)
			{
				var kvp = p[i].split('=') // key value pair
				o[kvp[0]] = kvp[1]
			}
		}
	}
	return o
}
function getElementsByClassName(className, node) {
  node = node ? node : document
  var found = [];
  var elements = node.getElementsByTagName("*");
  for (var i = 0; i < elements.length; i++) {
    var names = elements[i].className.split(' ');
    for (var j = 0; j < names.length; j++) {
      if (names[j] == className) found.push(elements[i]);
    }
  }
  return found;
}
