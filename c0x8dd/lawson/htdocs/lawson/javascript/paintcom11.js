//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
waitimg = new Image()
waitimg.src = "/lawson/forms/images/stopwtch.gif"
waitWin = null

active_tab = 0
tabObj = null
detail = null
frm_fields = null
fld_count = 0
fc_idx = -1
parms_idx = -1
frm_columns = null
textArea = null
text_count = 0
folder = null
decor_obj = null
decor_count = 0
rules = null
rules_count = 0
hk_name = ""
hk_val = ""
hk_size = 0
fn_diff = 0
ags_ary = null
fldnbr_ary = null
mouseX = 0
mouseY = 0
currentElm = null
currentObject = null
currentLine = 0
prodline = ""
system = ""
token = ""
form_type = ""
run_fc = ""
run_fc_val = ""
dtl_done = null
init_done = false
next_error = false
date_error = false
time_error = false
number_error = false
key_fcs = ""
data_fcs = ""
ldata_fcs = ""
ladd_fcs = ""
inq_fcs = ""
dblxmt_fcs = ""
selarrow = new Image()
selarrow.src = "/lawson/forms/images/select.gif"
arrow_l_img = new Image()
arrow_l_img.src = "/lawson/forms/images/ylft.gif"
arrow_r_img = new Image()
arrow_r_img.src = "/lawson/forms/images/yrt.gif"
drill = new Image()
drill.src = "/lawson/forms/images/drill.gif"
helpimg = new Image()
helpimg.src = "/lawson/forms/images/help.jpg"
l_color = "maroon"
l_face = ""
l_size = ""
l_bold = false
l_ital = false
msgBlock = null
titleBlock = null
help = null
arrow_l = null
arrow_r = null
idaWin = null
batchWin = null
monWin = null
helpWin = null
calWin = null
run_type = 0
neg_type = "sign"
neg_red = false
frm_running = false
start_array = null
start_rule = ""

drillType = ""
valList_select = false
ida_string = ""

// Decor Object Stuff

function paintFolder()
{
	folder.selected = true
	folder.visited = new Array()
	for (var i = 0;i < 6;i++)
		folder.visited[i] = false

	if (isIE)
		folder.layer.style.visibility = "visible"
	else
		folder.layer.hidden = false

	var lyr = folder.layer
	folder.tab = new Array()
	folder.tabBorder = new Array()

	if (isIE)
	{
		for (var i = 0;i < 6;i++)
		{
			folder.tab[i] = self.CANVAS.document.all["TAB"+i]
			if (i == active_tab)
			{
				folder.tab[i].style.backgroundColor = folder.layer.style.backgroundColor
				folder.tab[i].style.border = "2px outset white"
				folder.tab[i].style.borderBottomWidth = 0
				folder.tab[i].style.zIndex = folder.layer.style.zIndex + 1
			}
			else
			{
				folder.tab[i].style.backgroundColor = folder.tab_color
				folder.tab[i].style.border = 0
				folder.tab[i].style.zIndex = folder.layer.style.zIndex - 1
			}
			folder.tab[i].style.clip = "rect(0 " + folder.tab_width[i] + " " + folder.tab_height + " 0)"
			folder.tab[i].style.visibility = "visible"
			folder.tab[i].ref = folder
			folder.tab[i].idx = i
			folder.tab[i].onmousedown = switchTab
			folder.tab[i].onmousemove = mmove
		}
	}
	else
	{
		for (var i = 0;i < 6;i++)
		{
			folder.tab[i] = new Layer(500,folder.container)
			folder.tab[i].captureEvents(Event.MOUSEDOWN|Event.MOUSEMOVE)
			folder.tab[i].onmousedown = switchTab
			folder.tab[i].onmousemove = mmove
			if (i == active_tab)
				folder.tab[i].bgColor = folder.layer.bgColor
			else
				folder.tab[i].bgColor = folder.tab_color
			folder.tab[i].top = lyr.top - 20
			folder.tab[i].left = lyr.left + (101 * i)
			folder.tab[i].clip.width = 99
			folder.tab[i].clip.height = 20
			folder.tab[i].visibility = lyr.visibility
			folder.tab[i].zIndex = lyr.zIndex
			folder.tab[i].ref = folder
			folder.tab[i].idx = i
			folder.tabBorder[i] = new Layer(103,folder.container)
			folder.tabBorder[i].bgColor = "black"
			folder.tabBorder[i].top = folder.tab[i].top - 2
			folder.tabBorder[i].left = folder.tab[i].left - 2
			folder.tabBorder[i].clip.width = folder.tab[i].clip.width + 4
			folder.tabBorder[i].clip.height = folder.tab[i].clip.height + 2
			folder.tabBorder[i].visibility = lyr.visibility
			var page = '<layer top=0 left=0 bgColor=white clip=0,0,'
					 + (folder.tabBorder[i].clip.width - 1) + ',1></layer>'
					 + '<layer top=1 left=0 bgColor=white clip=0,0,'
					 + (folder.tabBorder[i].clip.width - 2) + ',1></layer>'
					 + '<layer top=0 left=0 bgColor=white clip=0,0,1,'
					 + folder.tabBorder[i].clip.height + '></layer>'
					 + '<layer top=0 left=1 bgColor=white clip=0,0,1,'
					 + folder.tabBorder[i].clip.height + '></layer>'
			folder.tabBorder[i].document.write(page)
			folder.tabBorder[i].document.close()
			if (i != active_tab)
				folder.tabBorder[i].hidden = true
			folder.tabBorder[i].moveBelow(folder.tab[i])
		}
	}
	folder.writeContent()
}

function Decor_Object(id,z,top,left,right,bottom)
{
	if (isIE)
	{
		var l = '<div id=' + id
			  + ' style="position:absolute;visibility:hidden;top:' + top + 'px;left:' + left
		  	  + 'px;width:' + right + 'px;height:' + bottom + 'px;z-index:' + z
		  	  + ' background:()"></div>'
		if (id == "TAB")
		{
			for (var i = 0;i < 6;i++)
			{
				l += '<div id=' + id + i
				  + ' style="position:absolute;visibility:hidden;top:' + (top - 20) + 'px;left:' + (left + (101 * i))
				  + 'px;width:500px;height:20px;z-index:' + z + ';clip:rect(0,99,20,0);'
				  + ' background:()"></div>'
			}
		}
	}
	else
	{
		var l = '<layer id=' + id + ' visibility=hide top=' + top + ' left=' + left
			  + ' clip=0,0,' + right + ',' + bottom + ' z-index=' + z
			  + '></layer>'
	}
	self.CANVAS.document.write(l)
	if (isIE)
	{
		self.CANVAS.document.all[id].ref = this
		this.layer = self.CANVAS.document.all[id]
	}
	else
	{
		var d = self.CANVAS.document.layers[id]
		if (id == "HELP")
		{
			d.captureEvents(Event.MOUSEDOWN|Event.MOUSEUP)
			d.onmousedown = mdown
			d.onmouseup = mup
			this.ondrop = process_help
		}
		if (id == "DETAIL")
			d.onLoad = setDtlInfo
		else if (id.substring(0,5) == "TEXTA" || id == "TITLE" || id == "MESSAGE")
			d.onLoad = setClip
		else
	 		d.onLoad = null
		d.ref = this
		this.layer = d
	}
	this.top = top
	this.left = left
	this.name = id
	this.container = self.CANVAS

	this.img = ""
	this.href = ""
	this.border = false
	this.raised = true
	this.shadow = false
	this.sh_left = true
	this.use_frame = false
	this.fr_width = 1
	this.fr_color = ""
	this.content = ""
	this.color = "maroon"
	this.on_color = "white"
	this.face = ""
	this.size = ""
	this.bold = false
	this.ital = false
	this.bgc = ""
	this.bg_img = ""
	this.img_resize_height = 0
	this.img_resize_width = 0
	this.alt = ""
	this.text_area = false
	this.cols = 0
	this.rows = 0
	this.fields = null
	this.desc = ""
	this.tab_order = 0
	this.idx = 0
	this.hasTab = false
	this.tab = null
	this.tabBorder = null
	this.tab_label = null
	this.tab_color = ""
	this.tab_height = 20
	this.vis_tabs = 6
	this.folder_tab = -1

	this.border_t = null
	this.border_l = null
	this.border_r = null
	this.border_b = null
	this.border_t1 = null
	this.border_l1 = null
	this.border_r1 = null
	this.border_b1 = null
	this.shadow_s = null
	this.shadow_b = null

	if (id == "DETAIL")
		this.writeContent = writeDetailContent
	else
		this.writeContent = writeContent
	this.textDecorBeg = textDecorBeg
	this.textDecorEnd = textDecorEnd
	this.drawBorder = drawBorder
	this.hideBorder = hideBorder
	this.showBorder = showBorder
	this.hideShadow = hideShadow
	this.showShadow = showShadow
}

function writeContent()
{
	var page = ""
	if (isNav)
	{
		if (this.bg_img != "" || this.bgc != "")
		{
			page += '<body'
			if (this.bg_img != "")
				page += ' BACKGROUND=' + this.bg_img
			else if (this.bgc != "")
				page += ' BGCOLOR=' + this.bgc
			page += '>'
		}
	}
	page += this.textDecorBeg()
	if (this.href != "")
		page += '<a href=javascript:parent.openUrl("' + this.href + '")>'
	if (this.img != "")
	{
		if (isNav && this.name == "HELP")
			page +=	'<form onSubmit="return false"></form>'
		page += '<img border=0 src=' + this.img
		if (this.img_resize_height != 0)
			page += ' height=' + this.img_resize_height
				 + ' width=' + this.img_resize_width
		if (this.alt != "")
			page += ' alt="' + this.alt + '"'
		page += '>'
	}
	if (this.href != "")
		page += '</a>'
	if (this.content != "")
	{
		var str = unescape(this.content).split('<br>')
		var nstr = str.join('<br>')
		page += nstr
	}
	if (this.text_area)
	{
		if (isNav)
			page += '<form>'
		if (this.desc != "")
			page += this.desc + '<br>'
		page += '<textarea name=txt_area' + this.idx + ' rows=' + this.rows
			 + ' cols=' + this.cols + ' wrap=hard'
		if (isIE)
			page += ' tabindex=' + this.tab_order
		page += '>'
		var vals = new Array()
		for (var i = 0;i < this.fields.length;i++)
			vals[i] = frm_fields[this.fields[i]].value
		var i = vals.length - 1
		for (i;i >= 0;i--)
		{
			if (vals[i] != "")
				break
		}
		for (var j = 0;j <= i;j++)
		{
			page += vals[j]
			if (j < i)
				page += '\r\n'
		}
		page += '</textarea>'
	}
	page += this.textDecorEnd()
	if (this.text_area && isNav)
		page += '<a name=next>'
			 + '<input type=text name=nxtfld size=1 onFocus=parent.nextField(' + this.idx + ',"textarea")>'
	if (isIE)
	{
		if (this.bg_img != "")
			this.layer.style.backgroundImage = 'url('+this.bg_img+')'
		else if (this.bgc != "")
			this.layer.style.backgroundColor = this.bgc
		this.layer.innerHTML = page
	}
	else
	{
		this.layer.document.write(page)
		this.layer.document.close()
	}
	if (this.text_area)
	{
		for (var i = 0;i < this.fields.length;i++)
		{
			var idx = this.fields[i]
			if (isNav)
				frm_fields[idx].frmElm = this.layer.document.forms[0].elements[0]
			else
				frm_fields[idx].frmElm = self.CANVAS.document.forms[0].elements["txt_area"+this.idx]
			frm_fields[idx].textAreaIdx = this.idx
			frm_fields[idx].textAreaRow = i
		}
	}
	if (this.hasTab && this.selected && this.tab != null)
	{
		var beg = this.textDecorBeg("tab")
		var beg_on = this.textDecorBeg("tab",this.on_color)
		var end = this.textDecorEnd("tab")
		if (isNav)
			this.tab_height = 0
		for (var i = 0;i < this.tab.length;i++)
		{
			if (isIE)
			{
				if (i == active_tab)
					this.tab[i].innerHTML = beg_on+this.tab_label[i]+end
				else
					this.tab[i].innerHTML = beg+this.tab_label[i]+end
			}
			else
			{
				if (i == active_tab)
					this.tab[i].document.write(beg_on+this.tab_label[i]+end)
				else
					this.tab[i].document.write(beg+this.tab_label[i]+end)
				this.tab[i].document.close()
			}
			if (i == active_tab)
			{
				if (isIE)
					this.tab[i].style.backgroundColor = this.bgc
				else
					this.tab[i].bgColor = this.bgc
			}
			else
			{
				if (isIE)
					this.tab[i].style.backgroundColor = this.tab_color
				else
					this.tab[i].bgColor = this.tab_color
			}
			if (this.tab_label[i])
			{
				if (isIE)
					this.tab[i].style.pixelWidth = this.tab_width[i]
				else
					this.tab[i].clip.width = this.tab[i].document.width + 10
			}
			else
			{
				if (isIE)
					this.tab[i].style.pixelWidth = 99
				else
					this.tab[i].clip.width = 99
			}
			if (isNav)
			{
				this.tabBorder[i].clip.width = this.tab[i].clip.width + 4
				this.tabBorder[i].document.layers[0].clip.width = this.tabBorder[i].clip.width - 1
				this.tabBorder[i].document.layers[1].clip.width = this.tabBorder[i].clip.width - 2
				if (this.tab[i].document.height + 3 > this.tab_height)
					this.tab_height = this.tab[i].document.height + 3
			}
		}
		if (this.tab_height < 5)
			this.tab_height = 20
		alignTabs()
	}
}

function alignTabs()
{
	if (isIE)
	{
		var tab_left = folder.layer.style.pixelLeft
		var top = folder.layer.style.pixelTop
	}
	else
	{
		var tab_left = folder.layer.left
		var top = folder.layer.top
	}
	for (var i = 0;i < folder.tab.length;i++)
	{
		if (isNav)
		{
			folder.tab[i].moveTo(tab_left,top - folder.tab_height)
			folder.tabBorder[i].moveTo(tab_left - 2,top - folder.tab_height - 2)
			tab_left += folder.tab[i].clip.width + 2
			folder.tab[i].clip.height = folder.tab_height
			folder.tabBorder[i].clip.height = folder.tab_height + 2
			folder.tabBorder[i].document.layers[2].clip.height = folder.tabBorder[i].clip.height
			folder.tabBorder[i].document.layers[3].clip.height = folder.tabBorder[i].clip.height
			if (i > folder.vis_tabs - 1)
			{
				folder.tab[i].hidden = true
				folder.tabBorder[i].hidden = true
			}
		}
		else
		{
			folder.tab[i].style.pixelTop = top - folder.tab_height + 2
			folder.tab[i].style.pixelLeft = tab_left
			tab_left += folder.tab_width[i] + 2
			folder.tab[i].style.pixelHeight = folder.tab_height
			if (i > folder.vis_tabs - 1)
				folder.tab[i].style.visibility = "hidden"
		}
	}
}

var elmIdx = -1
var tabIdx = 0
var tdIdx = -1
var cols = null
function writeDetailContent()
{
	tabIdx = 0
	for (var i = 0;i < frm_fields.length;i++)
	{
		if (frm_fields[i].tab_order > tabIdx && frm_fields[i].type != "Fc")
			tabIdx = frm_fields[i].tab_order
	}
	elmIdx = -1
	tdIdx = -1
	cols = new Array()
	if (isIE)
		var page = '<body>'
	else
	{
		var page = '<body'
		if (this.bg_img != "")
			page += ' BACKGROUND=' + this.bg_img
		else if (this.bgc != "")
			page += ' BGCOLOR=' + this.bgc
		page += ' link=' + l_color + ' alink=' + l_color + ' vlink=' + l_color + '>'
		page += '<form onSubmit="return false">'
	}
	page += '<table cellspacing=0 cellpadding=3 border='
	if (this.use_frame)
	{
		page += this.fr_width
		if (this.fr_color != "")
			page += ' bordercolor=' + this.fr_color
	}
	else
		page += '0'
	page += '><tr>'
	for (var i = 0;i < frm_columns.length;i++)
	{
		var idx = frm_columns[i]
		var fld = frm_fields[idx]
		if (fld.selected)
		{
			page += '<td nowrap id=col' + fld.idx
				 + ' align='
			if (fld.lab_opt == "L")
				page += 'left'
			else if (fld.lab_opt == "C")
				page += 'center'
			else
				page += 'right'
			if (fld.bgc)
				page += ' bgcolor=' + fld.bgc
			page += ' style="position:relative;visibility:inherit">'
				 + fld.dtlFieldDecor(fld.label,false)
				 + '</td>'
			var j = cols.length
			cols[j] = fld.idx
		}
	}
	page += '</tr>'
	for (var j = 1;j <= dtl_lines;j++)
	{
		page += '<tr>'
		for (var i = 0;i < frm_columns.length;i++)
		{
			var idx = frm_columns[i]
			var fld = frm_fields[idx]
			fld.frmElm[j] = null
			if (fld.selected)
				page += fld.dtlFormElm(j)
		}
		page += '</tr>'
	}
	page += '</table>'
	if (isNav)
	{
		page += '<a name=next>'
			 + '<input type=text name=nxtfld size=1 onFocus=parent.nextField(0,"detail")>'
		for (var i = 0;i <= tdIdx;i++)
			page += '<div id=lyr' + i + ' style="position:absolute;visibility:inherit"></div>'
	}
	if (isIE)
	{
		page += '</body>'
		if (this.bg_img != "")
			this.layer.style.backgroundImage = 'url('+this.bg_img+')'
		else if (this.bgc != "")
			this.layer.style.backgroundColor = this.bgc
		this.layer.innerHTML = page
	}
	else
	{
		this.layer.document.open()
		this.layer.document.write(page)
		this.layer.document.close()
	}
}

function setDtlInfo()
{
	for (var i = 0;i < frm_fields.length;i++)
	{
		var fld = frm_fields[i]
		if (fld.dtl_area && fld.type != "Out" && fld.selected)
		{
			for (var j = 1;j <= dtl_lines;j++)
			{
				if (fld.elmIdx[j] != -1)
				{
					if (isNav)
					{
						fld.frmElm[j] = detail.layer.document.forms[0].elements[fld.elmIdx[j]]
						if (fld.frmElm[j].type == "radio")
							fld.frmElm[j] = fld.frmElm[j].form.elements[fld.frmElm[j].name]
					}
					else
						fld.frmElm[j] = self.CANVAS.document.forms[0].elements[fld.ags_name[j]]
				}
			}
		}
	}
	for (var i = 0;i < cols.length;i++)
	{
		var j = cols[i]
		if (isIE)
			var td = detail.layer.document.all['col'+j]
		else
			var td = detail.layer.document.layers['col'+j]
		td.ref = frm_fields[j]
		frm_fields[j].layer = td
	}
	if (isNav)
	{
		detail.layer.clip.width = detail.layer.document.width
		if (detail.use_frame)
		{
			if (detail.layer.document.anchors.length != 0)
				detail.layer.clip.height = detail.layer.document.anchors[0].y
			else
				detail.layer.clip.height = detail.layer.document.height
		}
		else
		{
			if (detail.layer.document.anchors.length != 0)
				detail.layer.clip.height = detail.layer.document.anchors[0].y + 2
			else
				detail.layer.clip.height = detail.layer.document.height + 4
		}
		detail.layer.captureEvents(Event.MOUSEDOWN)
		detail.layer.onmousedown = setMouseCoords
	}
	detail.drawBorder()
}

function getHeight(fld)
{
	var retval = ""
	var size = "3"
	if (fld.l_color != "" && fld.l_size != "")
		size = fld.l_size
	else if (l_size != "")
		size = l_size

	if (size == "1")
		retval = "11"
	else if (size == "2")
		retval = "16"
	else if (size == "3")
		retval = "18"
	else if (size == "4")
		retval = "21"
	else if (size == "5")
		retval = "28"
	else if (size == "6")
		retval = "36"
	else if (size == "7")
		retval = "55"
	
	return retval
}

function dtlFormElm(j)
{
	this.firstTime[j] = true
	var retval = ""
	if (this.type == "Out")
	{
		++tdIdx
		this.tdIdx[j] = tdIdx
		retval += this.fieldDecorBeg(j)
		var saveval = this.value[j]
		if (this.edit == "numeric" || this.edit == "signed")
			this.value[j] = fmtNumericOutput(this,j)
		if (this.val_count != -1)
		{
			for (var i = 0;i <= this.val_count;i++)
			{
				if (this.valueList[i].selected && this.valueList[i].val == this.value[j])
				{
					this.value[j] = this.valueList[i].xlt
					break
				}
			}
		}
		var s = Number(this.size * 1.25)
		if (this.edit == "numeric" || this.edit == "signed" || this.edit == "time" || this.edit == "date")
			s = Number(this.size + 2)
		this.value[j] = getFiller(s)
		if (this.value[j] != "")
		{
			if (this.do_drill)
				retval += '<a href=javascript:parent.doSelect('
					   + 'this,' + this.idx + ',"DT",' + j + ')>'
			retval += this.value[j]
			if (this.do_drill)
				retval += '</a>'
		}
		this.value[j] = saveval
		retval += this.fieldDecorEnd()
	}
	else
	{
		++elmIdx
		this.elmIdx[j] = elmIdx
		++tabIdx
		retval += this.fieldDecorBeg(j)
		if (this.do_drill)
			retval += '<a href=javascript:parent.doSelect('
				   + 'this,' + this.idx + ',"DT",' + j + ')>'
				   + '<img border=0 src=' + drill.src + ' width=11'
				   + ' height=11 alt=Drill></a>'
		retval += this.buildElement(j)
			   + this.fieldDecorEnd()
	}
	return retval
}

function buildElement(j)
{
	var val = (j ? this.value[j] : this.value)
	var aName = (j ? this.ags_name[j] : this.ags_name)
	var tab = (j ? tabIdx : this.tab_order)
	var retval = ""
	if (this.val_count == -1)
	{
		if (this.size > 60)
			var fldsize = 60
		else
			var fldsize = this.size
		retval += '<input type=text'
			 + (isIE ? ' tabindex=' + tab + ' onkeypress=parent.doKeyPress("' + this.edit + '")' : '')
			 + ' name=' + (isIE ? aName : ("FRM"+this.edit)) + ' size='
			 + ((fldsize > 1 && this.edit != "upper") ? fldsize : (fldsize + 1))
			 + ' maxlength=' + this.size
		if (this.edit == "upper")
			retval += ' onBlur="this.value=this.value.toUpperCase()"'
		if (this.edit == "date")
			retval += ' onBlur=parent.editDate(this)'
				   + ' onFocus=parent.focusDate(this)'
		if (this.edit == "time")
			retval += ' onBlur=parent.editTime(this,' + fldsize + ')'
				   + ' onFocus=parent.focusTime(this)'
		if (this.edit == "numeric")
			retval += ' onBlur=parent.editNumber(this,' + fldsize + ',' + this.dec + ',false)'
				   + ' onFocus=parent.focusNumber(this)'
		if (this.edit == "signed")
			retval += ' onBlur=parent.editNumber(this,' + (fldsize - 1) + ',' + this.dec + ',true)'
				   + ' onFocus=parent.focusNumber(this)'
		if (val != "")
			retval += ' value="' + val + '"'
		else if (this.constant != "")
		{
			if (this.edit == "date")
			{
				if (this.constant.length == 1)
				{
					tmp = {value:this.constant}
					if (ValidDate(tmp))
						retval += ' value="' + tmp.value + '"'
				}
				else
					retval += ' value="' + this.constant + '"'
			}
			else if (this.constant.charAt(0) == "$")
				retval += ' value="' + getWebuserValue(this.constant) + '"'
			else
				retval += ' value="' + this.constant + '"'
		}
		retval += '>'
	}
	else
	{
		if (this.dsp_opt == "S")
		{
			retval += '<select'
				 + (isIE ? ' tabindex=' + tab : '')
				 + ' name=' + (isIE ? aName : this.edit) + '>'
			if (this.dft_val == "")
			{
				retval += '<option value=""'
				if (this.constant == "" && val == "")
					retval += ' selected'
				retval += '>'
			}
			for (var i = 0;i <= this.val_count;i++)
			{
				if (this.valueList[i].selected)
				{
					retval += '<option value="' + this.valueList[i].val + '"'
					if ((this.valueList[i].val == this.constant && val == "") ||
						(this.valueList[i].val == this.dft_val && this.constant == "" && val == "") ||
						(this.valueList[i].val == val))
						retval += ' selected'
					retval += '>' + (this.show_values ? this.valueList[i].val : this.valueList[i].xlt)
				}
			}
			retval += '</select>'
		}
		if (this.dsp_opt == "R" || this.dsp_opt == "RS")
		{
			var first_done = false
			for (var i = 0;i <= this.val_count;i++)
			{
				if (this.valueList[i].selected)
				{
					if (this.dsp_opt == "RS" && first_done)
						retval += '<br>'
					retval += '<input type=radio'
						 + (isIE ? ' tabindex=' + tab : '')
						 + ' name=' + (isIE ? aName : this.edit)
						 + ' value="' + this.valueList[i].val + '"'
					if ((this.valueList[i].val == this.constant && val == "") ||
						(this.valueList[i].val == this.dft_val && this.constant == "" && val == "") ||
						(this.valueList[i].val == val))
						retval += ' checked'
					retval += '>' + (this.show_values ? this.valueList[i].val : this.valueList[i].xlt)
					first_done = true
				}
			}
			if (this.dft_val == "" && this.constant == "" && !this.req_fld)
			{
				if (this.dsp_opt == "RS" && first_done)
					retval += '<br>'
				retval += '<input type=radio'
					 + (isIE ? ' tabindex=' + tab : '')
					 + ' name=' + (isIE ? aName : this.edit)
					 + ' value="">None'
				first_done = true
			}
		}
		if (this.dsp_opt == "C" || this.dsp_opt == "CN")
		{
			for (var i = 0;i < this.valueList.length;i++)
			{
				if (this.valueList[i].selected)
					break
			}
			retval += '<input type=checkbox'
				   + (isIE ? ' tabindex=' + tab : '')
				   + ' name=' + (isIE ? aName : this.edit)
				   + ' value="' + this.valueList[i].val + '"'
			if ((this.valueList[i].val == this.constant && val == "") ||
				(this.valueList[i].val == this.dft_val && this.constant == "" && val == "") ||
				(this.valueList[i].val == val))
				retval += ' checked'
			retval += '>'
			if (this.dsp_opt == "C")
				retval += (this.show_values ? this.valueList[i].val : this.valueList[i].xlt)
		}
	}
	if (this.edit == "date")
	{
		retval += '<a href=javascript:parent.doDateSelect(' + this.idx
		if (j)
			retval += ',' + j
		retval += ')><img border=0 src=' + selarrow.src + ' alt=Calendar></a>'
	}
	if (this.do_select)
	{
		retval += '<a href=javascript:parent.doSelect(this,'
			 + this.idx + ',"SV"'
		if (j)
			retval += ',' + j
		retval += ')><img border=0 src=' + selarrow.src + ' alt=Select></a>'
	}
	return retval
}

function textDecorBeg()
{
	if (textDecorBeg.arguments.length != 0)
	{
		if (isIE)
			var retval = "<table cellspacing=0 cellpadding=4><td nowrap>"
		else
			var retval = "<spacer type=horizontal size=10>"
	}
	else
	{
		var retval = '<table cellspacing=0 cellpadding=4 border='
		if (this.use_frame)
		{
			retval += this.fr_width
			if (this.fr_color != "")
				retval += ' bordercolor=' + this.fr_color
		}
		else
			retval += '0'
		retval += '><td nowrap>'
	}
	if (this.bold)
		retval += '<b>'
	if (this.ital)
		retval += '<i>'
	retval += '<font'
	if (this.color != "")
	{
		retval += ' color='
		if (textDecorBeg.arguments.length == 2)
			retval += textDecorBeg.arguments[1]
		else
			retval += this.color
	}
	if (this.face != "")
		retval += ' face="' + this.face + '"'
	if (this.size != "")
		retval += ' size=' + this.size
	retval += '>'

	return retval
}

function textDecorEnd()
{
	var retval = '</font>'
	if (this.ital)
		retval += '</i>'
	if (this.bold)
		retval += '</b>'
	if (textDecorEnd.arguments.length == 0 || isIE)
		retval += '</td></table>'
	return retval
}

function drawBorder()
{
	var lyr = this.layer
	if (isIE)
	{
		if (this.border)
		{
			if (this.raised)
				lyr.style.border = "2px outset white"
			else
				lyr.style.border = "2px inset white"
		}
		return
	}

	var light = "white"
	var dark = "black"

	var lyr = this.layer
	if (this.border)
	{
		if (this.border_t == null)
			this.border_t = new Layer(1,this.container)
		if (this.shadow)
			this.border_t.bgColor = "black"
		else if (this.raised)
			this.border_t.bgColor = light
		else
			this.border_t.bgColor = dark
		this.border_t.top = lyr.top - 1
		this.border_t.left = lyr.left - 1
		this.border_t.clip.top = 0
		this.border_t.clip.left = 0
		this.border_t.clip.right = lyr.clip.right + 1
		this.border_t.clip.bottom = 1
		this.border_t.visibility = lyr.visibility
		this.border_t.zIndex = lyr.zIndex

		if (this.border_b == null)
			this.border_b = new Layer(1,this.container)
		if (this.shadow)
			this.border_b.bgColor = "black"
		else if (this.raised)
			this.border_b.bgColor = dark
		else
			this.border_b.bgColor = light
		this.border_b.top = lyr.top + lyr.clip.bottom
		this.border_b.clip.top = 0
		this.border_b.clip.left = 0
		this.border_b.left = lyr.left - 1
		this.border_b.clip.right = lyr.clip.right + 1
		this.border_b.clip.bottom = 1
		this.border_b.visibility = lyr.visibility
		this.border_b.zIndex = lyr.zIndex

		if (this.border_r == null)
			this.border_r = new Layer(1,this.container)
		if (this.shadow)
			this.border_r.bgColor = "black"
		else if (this.raised)
			this.border_r.bgColor = dark
		else
			this.border_r.bgColor = light
		this.border_r.top = lyr.top - 1
		this.border_r.clip.bottom = lyr.clip.bottom + 2
		this.border_r.left = lyr.left + lyr.clip.right
		this.border_r.clip.top = 0
		this.border_r.clip.left = 0
		this.border_r.clip.right = 1
		this.border_r.visibility = lyr.visibility
		this.border_r.zIndex = lyr.zIndex

		if (this.border_l == null)
			this.border_l = new Layer(1,this.container)
		if (this.shadow)
			this.border_l.bgColor = "black"
		else if (this.raised)
			this.border_l.bgColor = light
		else
			this.border_l.bgColor = dark
		this.border_l.clip.top = 0
		this.border_l.clip.left = 0
		this.border_l.top = lyr.top
		this.border_l.left = lyr.left - 1
		this.border_l.clip.right = 1
		this.border_l.clip.bottom = lyr.clip.bottom
		this.border_l.visibility = lyr.visibility
		this.border_l.zIndex = lyr.zIndex

		if (!this.shadow)
		{
			if (this.border_t1 == null)
				this.border_t1 = new Layer(1,this.container)
			if (this.raised)
				this.border_t1.bgColor = "white"
			else
				this.border_t1.bgColor = "black"
			this.border_t1.top = lyr.top - 2
			this.border_t1.left = lyr.left - 2
			this.border_t1.clip.top = 0
			this.border_t1.clip.left = 0
			this.border_t1.clip.right = lyr.clip.right + 3
			this.border_t1.clip.bottom = 1
			this.border_t1.visibility = lyr.visibility
			this.border_t1.zIndex = lyr.zIndex

			if (this.border_b1 == null)
				this.border_b1 = new Layer(1,this.container)
			if (this.raised)
				this.border_b1.bgColor = "black"
			else
				this.border_b1.bgColor = "white"
			this.border_b1.top = lyr.top + lyr.clip.bottom + 1
			this.border_b1.clip.top = 0
			this.border_b1.clip.left = 0
			this.border_b1.left = lyr.left - 2
			this.border_b1.clip.right = lyr.clip.right + 4
			this.border_b1.clip.bottom = 1
			this.border_b1.visibility = lyr.visibility
			this.border_b1.zIndex = lyr.zIndex

			if (this.border_r1 == null)
				this.border_r1 = new Layer(1,this.container)
			if (this.raised)
				this.border_r1.bgColor = "black"
			else
				this.border_r1.bgColor = "white"
			this.border_r1.top = lyr.top - 2
			this.border_r1.left = lyr.left + lyr.clip.right + 1
			this.border_r1.clip.top = 0
			this.border_r1.clip.left = 0
			this.border_r1.clip.right = 1
			this.border_r1.clip.bottom = lyr.clip.bottom + 4
			this.border_r1.visibility = lyr.visibility
			this.border_r1.zIndex = lyr.zIndex

			if (this.border_l1 == null)
				this.border_l1 = new Layer(1,this.container)
			if (this.raised)
				this.border_l1.bgColor = "white"
			else
				this.border_l1.bgColor = "black"
			this.border_l1.clip.top = 0
			this.border_l1.clip.left = 0
			this.border_l1.top = lyr.top - 2
			this.border_l1.left = lyr.left - 2
			this.border_l1.clip.right = 1
			this.border_l1.clip.bottom = lyr.clip.bottom + 3
			this.border_l1.visibility = lyr.visibility
			this.border_l1.zIndex = lyr.zIndex
		}
	}
	if (this.shadow)
	{
		if (this.shadow_s == null)
			this.shadow_s = new Layer(1,this.container)
		this.shadow_s.bgColor = "black"
		this.shadow_s.clip.top = 0
		this.shadow_s.clip.left = 0
		this.shadow_s.top = lyr.top + 5
		if (this.sh_left)
			this.shadow_s.left = lyr.left - 5
		else
			this.shadow_s.left = lyr.left + lyr.clip.right
		this.shadow_s.clip.right = 5
		this.shadow_s.clip.bottom = lyr.clip.bottom
		this.shadow_s.visibility = lyr.visibility
		this.shadow_s.zIndex = lyr.zIndex
		if (this.shadow_b == null)
			this.shadow_b = new Layer(1,this.container)
		this.shadow_b.bgColor = "black"
		this.shadow_b.clip.top = 0
		this.shadow_b.clip.left = 0
		this.shadow_b.top = lyr.top + lyr.clip.bottom
		if (this.sh_left)
			this.shadow_b.left = lyr.left - 5
		else
			this.shadow_b.left = lyr.left + 5
		this.shadow_b.clip.right = lyr.clip.right
		this.shadow_b.clip.bottom = 5
		this.shadow_b.visibility = lyr.visibility
		this.shadow_b.zIndex = lyr.zIndex
		if (this.border_t1 != null)
			this.border_t1.hidden = true
		if (this.border_b1 != null)
			this.border_b1.hidden = true
		if (this.border_r1 != null)
			this.border_r1.hidden = true
		if (this.border_l1 != null)
			this.border_l1.hidden = true
	}
	if (this.hasTab && this.tab)
	{
		this.tab[active_tab].moveAbove(this.border_t1)
		this.tabBorder[active_tab].moveBelow(this.tab[active_tab])
	}
}

function mmove(e)
{
	return false
}

function switchTab()
{
	folder.visited[this.idx] = true
	if (this.idx == active_tab)
		return
	var ref = this.ref
	var idx = active_tab
	if (isNav)
	{
		ref.tabBorder[idx].hidden = true
		ref.tab[idx].bgColor = ref.tab_color
		ref.tab[idx].moveBelow(ref.border_t)
	}
	else
	{
		ref.tab[idx].style.border = 0
		ref.tab[idx].style.backgroundColor = ref.tab_color
		ref.tab[idx].style.zIndex = ref.layer.style.zIndex - 1
	}

	var beg = ref.textDecorBeg("tab")
	var end = ref.textDecorEnd("tab")
	if (isNav)
	{
		ref.tab[idx].document.open()
		ref.tab[idx].document.write(beg+ref.tab_label[idx]+end)
		ref.tab[idx].document.close()
		ref.tabBorder[this.idx].hidden = false
		ref.tab[this.idx].bgColor = ref.layer.bgColor
		ref.tab[this.idx].moveAbove(ref.border_t1)
		ref.tabBorder[this.idx].moveBelow(ref.tab[this.idx])
	}
	else
	{
		ref.tab[idx].innerHTML = beg+ref.tab_label[idx]+end
		ref.tab[this.idx].style.backgroundColor = folder.layer.style.backgroundColor
		ref.tab[this.idx].style.border = "2px outset white"
		ref.tab[this.idx].style.borderBottomWidth = 0
		ref.tab[this.idx].style.zIndex = ref.layer.style.zIndex + 1
	}

	var beg = ref.textDecorBeg("tab",ref.on_color)
	var end = ref.textDecorEnd("tab")
	if (isNav)
	{
		ref.tab[this.idx].document.open()
		ref.tab[this.idx].document.write(beg+ref.tab_label[this.idx]+end)
		ref.tab[this.idx].document.close()
	}
	else
		ref.tab[this.idx].innerHTML = beg+ref.tab_label[this.idx]+end

	doSwitch(ref,active_tab,false)
	doSwitch(ref,this.idx,true)
	active_tab = this.idx
}

function doSwitch(ref,act_tab,tab_on)
{
	for (var i = 0;i < frm_fields.length;i++)
	{
		if (frm_fields[i].folder_tab == act_tab)
			doTabContents(frm_fields[i],tab_on)
	}
	for (var i = 0;i < decor_obj.length;i++)
	{
		if (decor_obj[i].folder_tab == act_tab)
			doTabContents(decor_obj[i],tab_on)
	}
	for (var i = 0;i < textArea.length;i++)
	{
		if (textArea[i].folder_tab == act_tab)
			doTabContents(textArea[i],tab_on)
	}
}

function doTabContents(obj,tab_on)
{
	if (obj.layer)
	{
		if (isNav)
			obj.layer.hidden = !tab_on
		else
		{
			if (tab_on)
				obj.layer.style.visibility = "visible"
			else
				obj.layer.style.visibility = "hidden"
		}
	}
	if (tab_on)
	{
		obj.showBorder()
		obj.showShadow()
	}
	else
	{
		obj.hideBorder()
		obj.hideShadow()
	}
}

function showBorder()
{
	if (!this.border || isIE)
		return

	if (this.border_t != null)
		this.border_t.hidden = false
	if (this.border_b != null)
		this.border_b.hidden = false
	if (this.border_r != null)
		this.border_r.hidden = false
	if (this.border_l != null)
		this.border_l.hidden = false
	if (!this.shadow)
	{
		if (this.border_t1 != null)
			this.border_t1.hidden = false
		if (this.border_b1 != null)
			this.border_b1.hidden = false
		if (this.border_r1 != null)
			this.border_r1.hidden = false
		if (this.border_l1 != null)
			this.border_l1.hidden = false
	}
}

function showShadow()
{
	if (!this.shadow || isIE)
		return

	if (this.shadow_s != null)
		this.shadow_s.hidden = false
	if (this.shadow_b != null)
		this.shadow_b.hidden = false
}

function hideBorder()
{
	if (isIE)
		return

	if (this.border_t != null)
		this.border_t.hidden = true
	if (this.border_b != null)
		this.border_b.hidden = true
	if (this.border_r != null)
		this.border_r.hidden = true
	if (this.border_l != null)
		this.border_l.hidden = true
	if (this.border_t1 != null)
		this.border_t1.hidden = true
	if (this.border_b1 != null)
		this.border_b1.hidden = true
	if (this.border_r1 != null)
		this.border_r1.hidden = true
	if (this.border_l1 != null)
		this.border_l1.hidden = true
}

function hideShadow()
{
	if (isIE)
		return

	if (this.shadow_s != null)
		this.shadow_s.hidden = true
	if (this.shadow_b != null)
		this.shadow_b.hidden = true
}

// End Decor Object Stuff

// Field Object Stuff

function Field_Object(id,fldnbr,ags_name,dtl_area,z,top,left,right,bottom)
{
	if (id.charAt(0) >= "0" && id.charAt(0) <= 9)
		id = "x"+id
	if (Field_Object.arguments.length > 4)
	{
		if (isIE)
		{
			var l = '<div id=' + id + ' style="position:absolute;visibility:hidden;top:' + top + 'px;left:' + left
				  + 'px;width:' + right + 'px;height:' + bottom + 'px;z-index:' + z
				  + '"></div>'
			self.CANVAS.document.write(l)
			self.CANVAS.document.all[id].ref = this
			this.layer = self.CANVAS.document.all[id]
		}
		else
		{
			var l = '<layer id=' + id + ' visibility=hide top=' + top + ' left=' + left
				  + ' clip=0,0,' + right + ',' + bottom + ' z-index=' + z
				  + '></layer>'
			self.CANVAS.document.write(l)
			var d = self.CANVAS.document.layers[id]
			d.ref = this
			d.onLoad = setClip
			this.layer = d
		}
	}
	else
		this.layer = null

	this.top = top
	this.left = left

	this.name = id
	this.container = self.CANVAS
	this.idx = fld_count
	this.dtl_area = dtl_area
	if (this.dtl_area)
	{
		this.lab_opt = "C"
		var i = dtl_lines + 1
		this.ags_name = new Array(i)
		this.fldnbr = new Array(i)
		this.fldnbr[1] = fldnbr
		fldnbr_ary[fldnbr] = this.idx+":1"
		this.value = new Array(i)
		this.returned = new Array(i)
		this.elmIdx = new Array(i)
		this.tdIdx = new Array(i)
		this.frmElm = new Array(i)
		this.firstTime = new Array(i)
		var str = ags_name.substring(0,ags_name.length-1)
		for (var j = 1;j <= dtl_lines;j++)
		{
			var nstr = str + j
			this.ags_name[j] = nstr
			ags_ary[nstr] = this.idx+":"+j
			this.value[j] = ""
			this.returned[j] = false
			this.elmIdx[j] = -1
			this.tdIdx[j] = -1
			this.frmElm[j] = null
			if (j > 1)
			{
				var tmp = fldnbr.split("f")
				var fn = parseInt(tmp[1]) + (fn_diff * (j - 1))
				fldnbr = "_f" + fn
				this.fldnbr[j] = fldnbr
				fldnbr_ary[fldnbr] = this.idx+":"+j
			}
		}
	}
	else
	{
		this.lab_opt = "L"
		this.ags_name = ags_name
		ags_ary[this.ags_name] = this.idx
		this.fldnbr = fldnbr
		fldnbr_ary[this.fldnbr] = this.idx
		this.value = ""
		this.returned = false
		this.elmIdx = -1
		this.tdIdx = -1
		this.frmElm = null
	}
	if (this.fldnbr == "_f73")
		parms_idx = this.idx
	this.column = -1
	this.label = ""
	this.edit = ""
	this.size = 0
	this.req = ""
	this.req_fld = false
	this.type = ""
	this.orig_type = ""
	this.valueList = new Array()
	this.val_count = -1
	this.selected = false
	this.constant = ""
	this.dsp_opt = "S"
	this.dec = 0
	this.dft_val = ""
	this.kfn = ""
	this.skfn = ""
	this.l_color = ""
	this.l_face = ""
	this.l_size = ""
	this.l_bold = false
	this.l_ital = false
	this.img = ""
	this.tab_order = 0
	this.border = false
	this.raised = true
	this.shadow = false
	this.sh_left = true
	this.use_frame = false
	this.fr_width = 1
	this.fr_color = ""
	this.bg_img = ""
	this.bgc = ""
	this.border_t = null
	this.border_l = null
	this.border_r = null
	this.border_b = null
	this.border_t1 = null
	this.border_l1 = null
	this.border_r1 = null
	this.border_b1 = null
	this.shadow_s = null
	this.shadow_b = null
	this.do_select = false
	this.inc_drill = true
	this.do_drill = false
	this.exit_fnct = 0
	this.exit_url = ""
	this.h = 0
	this.w = 0
	this.hidden = false
	this.exportList = new Array()
	this.export_count = -1
	this.show_values = false
	this.textAreaIdx = -1
	this.textAreaRow = -1
	this.folder_tab = -1

	this.initField = initField
	this.updateField = updateField
	this.setValue = setValue
	if (this.dtl_area)
	{
		this.writeContent = writeDtlFieldContent
		this.dtlFormElm = dtlFormElm
	}
	else
		this.writeContent = writeFieldContent
	this.fieldDecorBeg = fieldDecorBeg
	this.fieldDecorEnd = fieldDecorEnd
	this.dtlFieldDecor = dtlFieldDecor
	this.getLinkDecor = getLinkDecor
	this.buildLabel = buildLabel
	this.buildElement = buildElement
	this.drawBorder = drawBorder
	this.hideBorder = hideBorder
	this.showBorder = showBorder
	this.hideShadow = hideShadow
	this.showShadow = showShadow

	this.idaValue = idaValue
	this.agsValue = agsValue
	this.batchValue = batchValue
	this.fmtBatchVal = fmtBatchVal
	this.fmtValue = fmtValue
	this.compareValue = compareValue
}

function createTabObject()
{
	tabObj = new Array()
	for (var i = 0;i < frm_fields.length;i++)
	{
		if (frm_fields[i].tab_order > 0 && frm_fields[i].tab_order != 999)
		{
			var j = frm_fields[i].tab_order
			tabObj[j] = {idx:i,type:"field",folder_tab:frm_fields[i].folder_tab}
		}
	}
	for (var i = 0;i < textArea.length;i++)
	{
		if (textArea[i].tab_order > 0)
		{
			var j = textArea[i].tab_order
			tabObj[j] = {idx:i,type:"textarea",folder_tab:textArea[i].folder_tab}
		}
	}
	if (detail && detail.tab_order > 0)
	{
		var j = detail.tab_order
		tabObj[j] = {idx:0,type:"detail",folder_tab:detail.folder_tab}
	}

	if (tabObj.length < 2)
		return

	var focusField = null
	var focusType = ""
	for (var i = 1;i < tabObj.length;i++)
	{
		var idx = tabObj[i].idx
		if (tabObj[i].type == "field")
		{
			if (frm_fields[idx].folder_tab == -1 || frm_fields[idx].folder_tab == active_tab)
			{
				focusField = frm_fields[idx].frmElm
				focusType = frm_fields[idx].dsp_opt.charAt(0)
			}
		}
		else if (tabObj[i].type == "textarea")
		{
			if (frm_fields[textArea[idx].fields[0]].folder_tab == -1 || frm_fields[textArea[idx].fields[0]].folder_tab == active_tab)
				focusField = frm_fields[textArea[idx].fields[0]].frmElm
		}
		else if (tabObj[i].type == "detail")
		{
			if (frm_fields[frm_columns[0]].folder_tab == -1 || frm_fields[frm_columns[0]].folder_tab == active_tab)
			{
				focusField = frm_fields[frm_columns[0]].frmElm[0]
				focusType = frm_fields[frm_columns[0]].dsp_opt.charAt(0)
			}
		}
		if (focusField != null)
			break
	}

	if (focusField != null)
	{
		if (focusType == "R")
			focusField[0].focus()
		else
			focusField.focus()
	}
}

function initField()
{
	if (this.type == "Fc")
		return
	var val = ""
	if ((this.orig_type == "Hidden" || this.orig_type == "HiddenKey") && this.valueList.length > 0)
		var val = this.valueList[0].xlt
	if (this.dtl_area)
	{
		for (var i = 1;i <= dtl_lines;i++)
		{
			this.returned[i] = false
			this.value[i] = val
			if (this.type != "Hidden" && this.type != "HiddenKey" && this.type != "Out")
				this.setValue(i)
		}
	}
	else
	{
		this.returned = false
		this.value = val
		if (this.type != "Hidden" && this.type != "HiddenKey")
			this.setValue()
	}
}

function updateField(value,j)
{
	if (j)
	{
		if (this.returned[j])
			return
		else
		{
			this.returned[j] = true
			this.value[j] = this.fmtValue(value)
			var val = this.value[j]
			if (val != "")
				dtl_done[j] = true
		}
	}
	else
	{
		if (this.returned)
			return
		else
		{
			this.returned = true
			this.value = this.fmtValue(value)
			var val = this.value
		}
	}
	if (!this.selected && this.constant.charAt(0) == "$" &&
		this.orig_type == "Key" &&
		!verifyWebuserValue(this.constant,val))
	{
		if (j)
			this.value[j] = ""
		else
			this.value = ""
		next_error = true
		msg = "Security Violation"
		alert(msg)
		msgBlock.content = msg
		msgBlock.writeContent()
		if (isIE)
			msgBlock.layer.style.visibility = "visible"
		else
			msgBlock.layer.hidden = false
		frm_running = false
		return
	}
	this.setValue(j)
}

function setValue(j)
{
	if (j)
	{
		if (this.frmElm[j])
		{
			if (this.frmElm[j].type == "text")
				this.frmElm[j].value = this.value[j]
			else if (this.frmElm[j].type == "select-one")
				this.frmElm[j].selectedIndex = getIndex(this.frmElm[j],this.value[j])
			else if (this.frmElm[j].type == "checkbox")
			{
				if (this.value[j] == this.frmElm[j].value)
					this.frmElm[j].checked = true
				else
					this.frmElm[j].checked = false
			}
			else
				setCheckedValue(this.frmElm[j],this.value[j])
		}
		else if (this.selected)
			this.writeContent(j)
	}
	else
	{
		if (this.frmElm)
		{
			if (this.frmElm.type == "textarea")
			{
				var str = this.frmElm.value.split('\r\n')
				str[this.textAreaRow] = this.value
				this.frmElm.value = str.join('\r\n')
			}
			else if (this.frmElm.type == "text")
				this.frmElm.value = this.value
			else if (this.frmElm.type == "select-one")
				this.frmElm.selectedIndex = getIndex(this.frmElm,this.value)
			else if (this.frmElm.type == "checkbox")
			{
				if (this.value == this.frmElm.value)
					this.frmElm.checked = true
				else
					this.frmElm.checked = false
			}
			else
				setCheckedValue(this.frmElm,this.value)
		}
		else if (this.selected)
			this.writeContent()
	}
}

function writeFieldContent()
{
	if (isIE)
		var page = '<body>'
	else
	{
		var page = '<body'
		if (this.bg_img != "")
			page += ' BACKGROUND=' + this.bg_img
		else if (this.bgc != "")
			page += ' BGCOLOR=' + this.bgc
		if (this.do_drill)
			page += this.getLinkDecor()
		page += '>'
	}
	page += this.fieldDecorBeg()
	if (this.edit == "FC")
	{
		if (isNav)
			page += '<form onSubmit="return false">'
		if (this.img != "")
			page += '<a href=javascript:parent.runForm(\''
				 + this.name + '\',\'' + this.fc + '\')'
				 + (isIE ? ' tabindex=' + this.tab_order : '') + '>'
				 + '<img border=0 src=' + this.img + ' alt="'
				 + this.label + '"></a>'
		else
			page += '<input type=button'
				 + (isIE ? ' accesskey=' + this.fc + ' tabindex=' + this.tab_order : '')
				 + ' name="' + this.name + '"'
			 	 + ' value="' + this.label + '" onClick=parent.runForm("'
			 	 + this.name + '","' + this.fc + '")>'
		page += this.fieldDecorEnd()
	}
	else if (this.type == "Out")
	{
		var saveval = this.value
		if (this.edit == "numeric" || this.edit == "signed")
			this.value = fmtNumericOutput(this)
		if (this.val_count != -1)
		{
			for (var i = 0;i <= this.val_count;i++)
			{
				if (this.valueList[i].selected && this.valueList[i].val == this.value)
				{
					this.value = this.valueList[i].xlt
					break
				}
			}
		}
		if (this.label == "" && this.value == "")
			page += '<spacer type=block width=' + ((this.size * 4) + 6)
				   + ' height=20>'
		else
		{
			if (this.label != "")
			{
				page += this.label
				if (this.lab_opt == "T")
					page += '<br>'
				else
					page += (isIE ? '<samp> </samp>' : '<spacer type=horizontal size=6>')
			}
			if (this.value != "")
			{
				if (this.do_drill)
					page += '<a href=javascript:parent.doSelect('
						 + 'this,' + this.idx + ',"DT")>'
				page += this.value
				if (this.do_drill)
					page += '</a>'
			}
			else
				page += ' <spacer type=horizontal size=' + ((this.size * 4) + 6) + '>'
		}
		page += this.fieldDecorEnd()
		this.value = saveval
	}
	else
	{
		page += this.buildLabel()
			 + this.buildElement()
		 	 + this.fieldDecorEnd()
			 + this.fieldDecorEnd()
		if (isNav)
			page += '<a name=next>'
				 + '<input type=text name=nxtfld size=1'
				 + ' onFocus=parent.nextField(' + this.idx + ',"field")>'
	}
	if (this.layer == null)
		return
	if (isIE)
	{
		page += '</body>'
		if (this.bg_img != "")
			this.layer.style.backgroundImage = 'url('+this.bg_img+')'
		else if (this.bgc != "")
			this.layer.style.backgroundColor = this.bgc
		if (this.do_drill)
			setLinkDecor(this)
		this.layer.innerHTML = page
	}
	else
	{
		this.layer.document.write(page)
		this.layer.document.close()
		if (this.edit == "date" || this.do_drill || this.do_select)
		{
			var d = this.layer
			d.captureEvents(Event.MOUSEDOWN)
			d.onmousedown = setMouseCoords
		}
	}
	if (this.type != "Fc" && this.type != "Out")
	{
		if (isNav)
		{
			this.frmElm = this.layer.document.forms[0].elements[0]
			if (this.frmElm.type == "radio")
				this.frmElm = this.frmElm.form.elements[this.frmElm.name]
		}
		else
			this.frmElm = self.CANVAS.document.forms[0].elements[this.ags_name]
	}
}

function writeDtlFieldContent(j)
{
	var val = this.value[j]
	if (this.edit == "numeric" || this.edit == "signed")
		val = fmtNumericOutput(this,j)
	if (this.val_count != -1 && writeDtlFieldContent.caller != blankDtlOutput)
	{
		for (var i = 0;i <= this.val_count;i++)
		{
			if (this.valueList[i].selected && this.valueList[i].val == val)
			{
				val = this.valueList[i].xlt
				break
			}
		}
	}
	if (isNav)
	{
		var td = detail.layer.document.layers['td'+this.tdIdx[j]]
		if (this.firstTime[j])
		{
			td.document.open()
			td.document.write("")
			td.document.close()
			this.firstTime[j] = false
		}
		var lyr = detail.layer.document.layers['lyr'+this.tdIdx[j]]
		if (this.bgc)
			lyr.bgColor = this.bgc
		lyr.document.open()
		var page = this.dtlFieldDecor(val,this.do_drill,j)
		lyr.document.write(page)
		lyr.document.close()
		lyr.left = td.pageX - detail.layer.left
		if (this.lab_opt == "R")
			lyr.left = lyr.left + td.clip.width - lyr.clip.width
		if (this.lab_opt == "C")
			lyr.left = lyr.left + ((td.clip.width - lyr.clip.width) / 2)
		lyr.top = td.pageY - detail.layer.top
		lyr.visibility = "inherit"
	}
	else
	{
		var td = detail.layer.document.all['td'+this.tdIdx[j]]
		var page = this.dtlFieldDecor(val,this.do_drill,j)
		td.innerHTML = page
	}
}

function getFiller(size)
{
	var retval = ""
	for (var i = 0;i < size;i++)
		retval += '_'
	return retval
}

function buildLabel()
{
	var retval = ''
	if (isNav)
		retval += '<form onSubmit="return false">'
	var ref = ""
	var img = ""
	var str = ""
	if (isIE)
		var sp = '<samp> </samp>'
	else
		var sp = '<spacer type=horizontal size=4>'
	var option = this.lab_opt

	if (this.do_drill)
	{
		ref = '<a href=javascript:parent.doSelect('
			+ 'this,' + this.idx + ',"DT")>'
		img = '<img border=0 src=' + drill.src + ' width=11'
			+ ' height=11 alt=Drill></a>'
		str = this.label.charAt(0) + '</a>'
			+ this.label.substring(1,this.label.length)
		retval += ref
		if (NonSpace(this.label) == 0)
			retval += img
		else
			retval += str
		if (this.lab_opt == "T" && this.label != "")
			retval += '<br>'
		else
			retval += sp
	}
	else
	{
		retval += this.label
		if (this.label != "")
		{
			if (this.lab_opt == "T")
				retval += '<br>'
			else
				retval += sp
		}
	}
	return retval
}

function fieldDecorBeg(j)
{
	var retval = ""
	if (!this.dtl_area)
	{
		retval += '<table cellspacing=0 cellpadding='
		if (this.edit == "FC")
			retval += '8'
		else
			retval += '4'
		retval += ' border='
		if (this.use_frame)
		{
			retval += this.fr_width
			if (this.fr_color != "")
				retval += ' bordercolor=' + this.fr_color
		}
		else
			retval += '0'
		retval += '>'
	}
	retval += '<td nowrap'
	if (this.type == "Out" && this.dtl_area && this.tdIdx[j] != -1)
		retval += ' id=td' + this.tdIdx[j] + ' style="position:relative;visibility:inherit"'
			   + ' height=' + getHeight(this)
	if (this.dtl_area)
	{
		retval += ' align='
		if (this.lab_opt == "L")
			retval += 'left'
		else if (this.lab_opt == "C")
			retval += 'center'
		else
			retval += 'right'
		if (this.bgc)
			retval += ' bgcolor=' + this.bgc
	}		
	retval += '>'
	if (this.l_color != "")
	{
		if (this.l_bold)
			retval += '<b>'
		if (this.l_ital)
			retval += '<i>'
		retval += '<font'
		if (this.l_color != "")
			retval += ' color=' + this.l_color
		if (this.l_face != "")
			retval += ' face="' + this.l_face + '"'
		if (this.l_size != "")
			retval += ' size=' + this.l_size
		retval += '>'
	}
	else
	{
		if (l_bold)
			retval += '<b>'
		if (l_ital)
			retval += '<i>'
		retval += '<font'
		if (l_color != "")
			retval += ' color=' + l_color
		if (l_face != "")
			retval += ' face="' + l_face + '"'
		if (l_size != "")
			retval += ' size=' + l_size
		retval += '>'
	}
	return retval
}

function fieldDecorEnd()
{
	var retval = '</font>'
	if (this.l_color != "")
	{
		if (this.l_ital)
			retval += '</i>'
		if (this.l_bold)
			retval += '</b>'
	}
	else
	{
		if (l_ital)
			retval += '</i>'
		if (l_bold)
			retval += '</b>'
	}
	retval += '</td>'
	if (!this.dtl_area)
		retval += '</table>'
	return retval
}

function idaValue(j)
{
	var retval = ""
	if (this.kfn == "" || this.edit == "FC")
		return retval

	if (currentObject.dtl_area && this.dtl_area && j != currentLine ||
		(!currentObject.dtl_area && this.dtl_area))
		return retval

	if ((this.selected && this.type == "Out" && this.constant == "") || this.hidden)
	{
		if (j)
			retval = escape(this.value[j])
		else
			retval = escape(this.value)
	}
	else if ((this.selected || this.constant != "") && this.type != "Out")
	{
		var con = ""
		if (this.constant != "")
		{
			if (this.edit == "date")
			{
				if (this.constant.length == 1)
				{
					tmp = {value:this.constant}
					if (ValidDate(tmp))
						con = formjsDate(tmp.value)
				}
				else
					con = formjsDate(this.constant)
			}
			else if (this.constant.charAt(0) == "$")
				con = getWebuserValue(this.constant)
			else
				con = this.constant
		}
		if (this.selected)
		{
			if (j)
				var elm = this.frmElm[j]
			else
				var elm = this.frmElm
			if (this.edit == "date")
			{
				if (this.dft_val == "CTD" && elm.value == "")
				{
					tmp = {value:"T"}
					if (ValidDate(tmp))
						retval = formjsDate(tmp.value)
				}
				else
					retval = formjsDate(elm.value)
			}
			else if (elm.type == "textarea")
			{
				var str = elm.value.split('\r\n')
				if (str.length > this.textAreaRow)
					retval = str[this.textAreaRow]
				if (this.edit == "upper")
					retval = retval.toUpperCase()
			}
			else if (elm.type == "text")
			{
				retval = elm.value
				if (this.edit == "upper")
					retval = retval.toUpperCase()
			}
			else if (elm.type == "select-one")
				retval = elm.options[elm.selectedIndex].value
			else if (elm.type == "checkbox")
			{
				if (elm.checked)
					retval = elm.value
			}
			else
			{
				for (var i = 0;i < elm.length;i++)
				{
					if (elm[i].checked)
						retval = elm[i].value
				}
			}
		}
		if (retval == "")
			retval = con
		retval = escape(retval)
	}
	return retval
}

function agsValue(fc_val,j)
{
	var retval = ""
	if (this.edit == "FC")
		return retval
	if (this.orig_type == "Out" && !this.dtl_area)
		return retval
	if (isInqFc(fc_val) && this.dtl_area)
		return retval
	if ((isAddFc(fc_val) && folder && folder.selected && this.selected)
	&& ((this.folder_tab != -1 && !folder.visited[this.folder_tab])
	|| (this.dtl_area && detail.folder_tab != -1 && !folder.visited[detail.folder_tab])))
		return retval
//	if (isInqFc(fc_val) && this.orig_type != "Key" && this.orig_type != "HiddenKey")
//		return retval
	if (j)
		var val = this.value[j]
	else
		var val = this.value

	var con = ""
	if (this.constant != "")
	{
		if (this.edit == "date")
		{
			if (this.constant.length == 1)
			{
				tmp = {value:this.constant}
				if (ValidDate(tmp))
					con = formjsDate(tmp.value)
			}
			else
				con = formjsDate(this.constant)
		}
		else if (this.edit == "time")
			con = agsTime(this.constant,this.size)
		else if (this.constant.charAt(0) == "$")
			con = getWebuserValue(this.constant)
		else
			con = this.constant
	}
	var sel = ""
	if (this.selected && this.type != "Out")
	{
		if (j)
			var elm = this.frmElm[j]
		else
			var elm = this.frmElm
		if (this.edit == "date")
		{
			if (this.dft_val == "CTD" && elm.value == "")
			{
				tmp = {value:"T"}
				if (ValidDate(tmp))
					sel = formjsDate(tmp.value)
			}
			else
				sel = formjsDate(elm.value)
		}
		else if (elm.type == "textarea")
		{
			var str = elm.value.split('\r\n')
			if (str.length > this.textAreaRow)
				sel = str[this.textAreaRow]
			if (this.edit == "upper")
				sel = sel.toUpperCase()
		}
		else if (elm.type == "text")
		{
			sel = elm.value
			if (this.edit == "upper")
				sel = sel.toUpperCase()
			if (this.edit == "time")
				sel = agsTime(sel,this.size)
		}
		else if (elm.type == "select-one")
			sel = elm.options[elm.selectedIndex].value
		else if (elm.type == "checkbox")
		{
			if (elm.checked)
				sel = elm.value
		}
		else
		{
			for (var i = 0;i < elm.length;i++)
			{
				if (elm[i].checked)
					sel = elm[i].value
			}
		}
		if (sel == "")
			sel = con
	}

	if ((this.selected && this.type == "Out" && this.constant == "") ||
		 this.type == "Hidden" || this.hidden || this.type == "HiddenKey" ||
	   	(!this.selected && this.constant == ""))
	{
		if (this.edit == "date")
			retval = formjsDate(val)
		else if (this.edit == "time")
			retval = agsTime(val,this.size)
		else
			retval = val
	}
	else if (this.selected)
		retval = sel
	else
		retval = con

	if (this.dec != 0 && retval.charAt(0) == ".")
		retval = "0" + retval
	if (this.dec != 0 && retval != "")
		retval = stripDecimals(retval)

	return retval
}

function stripDecimals(val)
{
	var retval = ""
	var j = val.indexOf(".")
	if (j == -1)
	{
		retval = val
		return retval
	}
	var k = j
	for (var i = val.length-1;i > j;i--)
	{
		if (val.charAt(i) != "0")
		{
			k = i
			break
		}
	}
	retval = val.substring(0,k+1)
	return retval
}

function batchValue()
{
	var retval = ""
	if (this.edit == "FC")
		return retval

	if (this.selected && this.type != "Out")
	{
		if (this.edit == "date")
		{
			if (this.dft_val == "CTD" && this.frmElm.value == "")
			{
				tmp = {value:"T"}
				if (ValidDate(tmp))
					retval = formjsDate(tmp.value)
			}
			else
				retval = formjsDate(this.frmElm.value)
			retval = this.fmtBatchVal(retval)
		}
		else if (this.frmElm.type == "textarea")
		{
			var str = this.frmElm.value.split('\r\n')
			if (str.length > this.textAreaRow)
				retval = str[this.textAreaRow]
			if (this.edit == "upper")
				retval = retval.toUpperCase()
		}
		else if (this.frmElm.type == "text")
		{
			if (this.edit == "upper")
				retval = this.frmElm.value.toUpperCase()
			else if (this.edit == "time")
				retval = agsTime(this.frmElm.value,this.size)
			else
				retval = this.frmElm.value
			retval = this.fmtBatchVal(retval)
		}
		else if (this.frmElm.type == "select-one")
			retval = this.fmtBatchVal(this.frmElm.options[this.frmElm.selectedIndex].value)
		else if (this.frmElm.type == "checkbox")
		{
			if (this.frmElm.checked)
				retval = this.fmtBatchVal(this.frmElm.value)
		}
		else
		{
			for (var i = 0;i < this.frmElm.length;i++)
			{
				if (this.frmElm[i].checked)
					retval = this.fmtBatchVal(this.frmElm[i].value)
			}
		}
	}
	else if (this.constant != "")
	{
		if (this.edit == "date")
		{
			if (this.constant.length == 1)
			{
				tmp = {value:this.constant}
				if (ValidDate(tmp))
					retval = formjsDate(tmp.value)
			}
			else
				retval = formjsDate(this.constant)
		}
		else if (this.edit == "time")
			retval = agsTime(this.constant,this.size)
		else if (this.constant.charAt(0) == "$")
			retval = this.fmtBatchVal(getWebuserValue(this.constant))
		else
			retval = this.fmtBatchVal(this.constant)
	}
	else
		retval = this.fmtBatchVal(this.dft_val)

	if (isAddFc(fc_val) && folder && folder.selected && this.selected &&
		this.folder_tab != -1 && !folder.visited[this.folder_tab])
		retval = this.fmtBatchVal("")

	return retval
}

function compareValue(value)
{
	value = "" + value
	var retval = value
	if (this.edit == "numeric" || this.edit == "signed")
	{
		var x = value.length
		if (value.charAt(x-1) == "-")
			value = "-" + value.substring(0,x-1)
		retval = Number(value)
	}
	if (this.edit == "date")
		retval = value.substring(6,10)
			   + value.substring(0,2)
			   + value.substring(3,5)
	if (this.edit == "time")
		retval = value.substring(0,2)
			   + value.substring(3,5)
	return retval
}

// End Field Object Stuff



function showHelp()
{
	if (currentObject == null)
		return

	if (currentObject.dtl_area)
	{
		var ags_name = currentObject.ags_name[1]
		ags_name = ags_name.substring(0,ags_name.length - 1)
	}
	else
		var ags_name = currentObject.ags_name
	var url = "/cgi-lawson/objprop" + ((typeof CGIExt != "undefined") ? CGIExt : "")
			+ "?" + prodline + "&" + token
			+ "&" + (currentObject.type == "Fc" ? "FC" : ags_name)
	var width = 300
	var height = 300
	if (isIE)
	{
		var x = screen.width / 3
		var y = screen.height / 3
		helpWin = window.open(url,"Help","width=" + width + ",height=" + height + ",left="
						 + x + ",top=" + y + ",resizable,scrollbars")
	}
	else
	{
		var x = window.innerWidth / 3
		var y = window.innerHeight / 3
		helpWin = window.open(url,"Help","innerWidth=" + width + ",innerHeight=" + height + ",screenX="
						 + x + ",screenY=" + y + ",resizable,scrollbars")
	}
	if (helpWin != null)
		helpWin.focus()
}

function showFormHelp()
{
	var url = "/cgi-lawson/objprop" + ((typeof CGIExt != "undefined") ? CGIExt : "")
			+ "?" + prodline + "&" + token
	var width = 500
	var height = 400
	if (isIE)
	{
		var x = screen.width / 4
		var y = screen.height / 4
		helpWin = window.open(url,"Help","width=" + width + ",height=" + height + ",top="
							 + x + ",left=" + y + ",resizable,scrollbars")
	}
	else
	{
		var x = window.innerWidth / 3
		var y = window.innerHeight / 3
		helpWin = window.open(url,"Help","innerWidth=" + width + ",innerHeight=" + height + ",screenX="
						 + x + ",screenY=" + y + ",resizable,scrollbars")
	}
	if (helpWin != null)
		helpWin.focus()
}

function ValueObj(val,xlt)
{
	this.val = "" + val
	this.xlt = xlt
	this.selected = true
}

function setMouseCoords(e)
{
	if (isIE)
	{
		mouseX = self.CANVAS.event.screenX
		mouseY = self.CANVAS.event.screenY
		return false
	}
	else
	{
		mouseX = e.screenX
		mouseY = e.screenY
		return true
	}
}

function doSelect(lnk,idx,type,j)
{
	drillType = type
	currentObject = frm_fields[idx]
	currentLine = j
	currentElm = (j ? currentObject.frmElm[j] : currentObject.frmElm)
	valList_select = false
	ida_string = ""
	if (j)
	{
		for (var i = 0;i < frm_fields.length;i++)
		{
			if (frm_fields[i].dtl_area)
			{
				var val = frm_fields[i].idaValue(j)
				if (val != "")
					ida_string += "&" + frm_fields[i].kfn + "=" + val
			}
		}
	}
	for (var i = 0;i < frm_fields.length;i++)
	{
		if (!frm_fields[i].dtl_area)
		{
			var val = frm_fields[i].idaValue()
			if (val != "")
				ida_string += "&" + frm_fields[i].kfn + "=" + val
		}
	}
	var width = 400
	var height = 500
	if (idaWin != null && !idaWin.closed)
		idaWin.closeWindows()

	idaWin = window.open("/lawson/forms/paintselect.htm","select","height=" + height + ",width=" + width + ",left=" + mouseX + ",top=" + mouseY + ",resizable,scrollbars")
	idaWin.focus()
}

function runForm(fc,fc_val)
{
	if (frm_running)
		return

	if (fc.length == 1 && fc == startup_fc)
	{
		for (var i = 0;i < frm_fields.length;i++)
		{
			if (frm_fields[i].fc == fc)
			{
				fc = frm_fields[i].name
				fc_val = frm_fields[i].fc
				break
			}
		}
	}
	if (isDblXmtFc(fc_val))
	{
		var msg = "Are you sure you want to " + fc + " this record?"
		if (!window.confirm(msg))
			return
	}
	if (fc == "Monitor")
	{
		monitor()
		return
	}

	if (fc == "Exit")
	{
		setExitValues()
		if (!doRule(fc_val))
			doExit(fc)
		return
	}
	if (isIE)
	{
		arrow_l.layer.style.visibility = "hidden"
		arrow_r.layer.style.visibility = "hidden"
	}
	else if (isNav)
	{
		arrow_l.layer.hidden = true
		arrow_r.layer.hidden = true
	}
	if (msgBlock != null)
	{
		if (isIE)
			msgBlock.layer.style.visibility = "hidden"
		else
		{
			msgBlock.layer.hidden = true
			msgBlock.hideBorder()
			msgBlock.hideShadow()
		}
	}
	if (form_type == "BATCH" && fc == "Run")
	{
		runBatch(fc)
		return
	}

	var agscall = "/cgi-lawson/ags" + ((typeof CGIExt != "undefined") ? CGIExt : "")
				+ "?_EVT="
	var isKey = isKeyFc(fc_val)
	var isAdd = isAddFc(fc_val)
	var match = keyMatch(isKey,fc_val)
	var lfc = false
	if (isKey && !match)
	{
		if (form_type == "BATCH")
			agscall += "CHG"
		else
		{
			alert("Must inquire before using this method")
			return
		}
	}
	else
		agscall += "ADD"
	if (prodline != "")
		agscall += "&_PDL=" + prodline
	agscall += "&_RTN=DATA&_TDS=Ignore&_VFMT=TRUE&_TKN=" + token + "&_LFN=TRUE&FC=" + fc
	var frm = self.agsform.document.agsform
	var elm = 8
	frm._PDL.value = (prodline != "" ? prodline : "")
	frm._TKN.value = token
	frm._EVT.value = (isKey && !match ? "CHG" : "ADD")
	frm.FC.value = fc
	var line_fc = new Array()
	var lfc_cnt = 0
	line_fc[0] = ""
	for (var i = 0;i < frm_fields.length;i++)
	{
		var fld = frm_fields[i]
		if (fld.dtl_area)
		{
			for (var j = 1;j <= dtl_lines;j++)
			{
				var val = "" + fld.agsValue(fc_val,j)
				if (fld.name.substring(0,7) == "LINE_FC")
				{
					if (!isKey && !isDataFc(fc_val,"",false))
						val = ""
					line_fc[++lfc_cnt] = (val == " " ? "" : val)
					if (line_fc[lfc_cnt] != "")
						lfc = true
				}
				var isLadd = isLaddFc(line_fc[j])
				var isData = isDataFc(fc_val,line_fc[j],fld.dtl_area)
//				if (val == "" && isLadd)
//					val = " "
				if (val != "" && (isLadd || isAdd) && !fld.selected && fld.constant == "")
					val = ""
				if (val != "")
				{
					agscall += "&" + fld.ags_name[j]
							+ "=" + escape(val)
					frm.elements[++elm].name = fld.ags_name[j]
					frm.elements[elm].value = val
				}
//				if (isData && !isLadd && fld.orig_type == "Key" && val != fld.value[j])
//				{
//					alert("Must inquire before using this method")
//					return
//				}
				if ((NonSpace(val) == 0 || val == " ") && fld.req_fld && isData)
				{
					reqFieldError(fld,j)
					return
				}
			}
		}
		else
		{
			var val = "" + fld.agsValue(fc_val)
			var isData = isDataFc(fc_val)
			if (val != "" && isAdd && !fld.selected && fld.constant == "")
				val = ""
			if (val != "")
			{
				agscall += "&" + (fld.ags_name == "TC" ? fld.fldnbr : fld.ags_name)
						+ "=" + escape(val)
				frm.elements[++elm].name = (fld.ags_name == "TC" ? fld.fldnbr : fld.ags_name)
				frm.elements[elm].value = val
	//			if ((fc_val == "+" || fc_val == "-") && fld.orig_type == "Key" && !fld.dtl_area)
	//			{
	//				var str = "PT-"+fld.ags_name
	//				agscall += "&" + str + "=" + (match ? escape(val) : "9999")
	//				frm.elements[++elm].name = str
	//				frm.elements[elm].value = (match ? escape(val) : "9999")
	//			}
			}
			if ((NonSpace(val) == 0 || val == " ") && fld.req_fld && isData)
			{
				reqFieldError(fld)
				return
			}
		}
	}
	if (hk_val != "" && (fc_val == "+" || fc_val == "-" || isKey))
	{
		agscall += "&" + hk_name + "=" + escape(hk_val)
		frm.elements[++elm].name = hk_name
		frm.elements[elm].value = hk_val
	}
	++elm
	var len = frm.elements.length
	for (elm;elm < len;elm++)
	{
		frm.elements[elm].name = ""
		frm.elements[elm].value = ""
	}
	if (isKey && !match && lfc)
	{
		alert("Must inquire before using this method")
		return
	}
	frm_running = true
	init_done = false
	next_error = false
	dtl_done = new Array()
	for (var i = 1;i <= dtl_lines;i++)
		dtl_done[i] = false
	run_fc = fc
	run_fc_val = fc_val
//	hk_val = ""
	start_array = null
//	debugMessage(agscall)
	if ((isIE && agscall.length > 2000) || (isNav && agscall.length > 4000))
		frm.submit()
	else
		self.jsreturn.location.replace(agscall)
}

function keyMatch(isKey,fc_val)
{
	var retval = false
	var keystr = ""
	if (hk_val == "")
		return retval
	for (var i = 0;i < frm_fields.length;i++)
	{
		var fld = frm_fields[i]
		if ((fld.orig_type == "Key" || fld.orig_type == "HiddenKey") && !fld.dtl_area)
		{
			var str = "" + fld.agsValue(fc_val)
			if (str == " ")
				str = ""
			if (str.length < fld.orig_size)
			{
				if (fld.edit == "date" && str == "")
					str = "00000000"
				else if (fld.edit == "time" && str == "")
					str = "0000"
				else if (fld.edit == "numeric")
				{
					var n = fld.orig_size - str.length
					var nstr = ""
					for (var j = 0;j < n;j++)
						nstr += '0'
					nstr += str
					str = nstr
				}
				else if (fld.edit != "date" && fld.edit != "time")
				{
					var n = fld.orig_size - str.length
					for (var j = 0;j < n;j++)
						str += ' '
				}
			}
			keystr += str
		}
	}
	var n = hk_size - hk_val.length
	var str = ""
	for (var i = 0;i < n;i++)
		str += " "
	hk_val += str
	if (keystr == hk_val)
		retval = true
	return retval
}

function isKeyFc(val)
{
	var retval = false
	if (val == "C" || val == "D")
		retval = true
	else if (key_fcs != "")
	{
		for (var i = 0;i < key_fcs.length;i++)
		{
			if (val == key_fcs.charAt(i))
			{
				retval = true
				break
			}
		}
	}
	return retval				
}

function isDataFc(val,line_fc,dtl_area)
{
	var retval = false
	if (dtl_area)
	{
		for (var i = 0;i < ldata_fcs.length;i++)
		{
			if (line_fc == ldata_fcs.charAt(i))
			{
				retval = true
				break
			}
		}
	}
	else
	{
		for (var i = 0;i < data_fcs.length;i++)
		{
			if (val == data_fcs.charAt(i))
			{
				retval = true
				break
			}
		}
	}
	return retval
}

function isLaddFc(val)
{
	var retval = false
	if (ladd_fcs != "")
	{
		for (var i = 0;i < ladd_fcs.length;i++)
		{
			if (val == ladd_fcs.charAt(i))
			{
				retval = true
				break
			}
		}
	}
	return retval
}

function isAddFc(val)
{
	var retval = false
	if (add_fcs != "")
	{
		for (var i = 0;i < add_fcs.length;i++)
		{
			if (val == add_fcs.charAt(i))
			{
				retval = true
				break
			}
		}
	}
	return retval
}

function isInqFc(val)
{
	var retval = false
	if (inq_fcs != "")
	{
		for (var i = 0;i < inq_fcs.length;i++)
		{
			if (val == inq_fcs.charAt(i))
			{
				retval = true
				break
			}
		}
	}
	return retval
}

function isDblXmtFc(val)
{
	var retval = false
	if (dblxmt_fcs != "")
	{
		for (var i = 0;i < dblxmt_fcs.length;i++)
		{
			if (val == dblxmt_fcs.charAt(i))
			{
				retval = true
				break
			}
		}
	}
	return retval
}

function reqFieldError(fld,j)
{
	var label = fld.label
	if (j)
		var fldnbr = fld.fldnbr[j]
	else
		var fldnbr = fld.fldnbr
	if (fld.selected)
	{
		msg = label + " is required"
		setCursor(fldnbr,true)
	}
	else
		msg = "Must include " + label + " on form or assign a constant value"
	msgBlock.content = msg
	msgBlock.writeContent()
	if (isIE)
		msgBlock.layer.style.visibility = "visible"
	else
		msgBlock.layer.hidden = false
}

function setExitValues()
{
	for (var i = 0;i < frm_fields.length;i++)
	{
		if (frm_fields[i].edit != "FC")
		{
			if (frm_fields[i].dtl_area)
			{
				for (var j = 1;j < dtl_lines;j++)
					frm_fields[i].value[j] = unescape(frm_fields[i].agsValue("E",j))
			}
			else
				frm_fields[i].value = unescape(frm_fields[i].agsValue("E"))
		}
	}
}

function runBatch(fc)
{
	if (fc != "Run")
		return

	var batchcall = "/cgi-lawson/jaynarun" + ((typeof CGIExt != "undefined") ? CGIExt : "")
				  + "?" + authUser.webuser
				  + "&" + prodline + "&" + token + "&%22"
	for (var i = parms_idx;i < frm_fields.length;i++)
		batchcall += frm_fields[i].batchValue()
	batchcall += '%22'
	if (run_type == 0)
		batchcall += '&VIEW'

	var x = 5
	var y = 100
	if (isIE)
	{
		var width = screen.width - 20
		var height = screen.height - 200
	}
	else
	{
		var width = self.innerWidth - 20
		var height = self.outerHeight - 200
	}
	if (run_type == 1)
	{
		x = 300
		width = 300
		y = 200
		height = 200
	}
	if (isIE)
		batchWin = window.open(batchcall,"report","height=" + height + ",width=" + width + ",left=" + x + ",top=" + y + ",resizable,scrollbars,menubar")
	else
		batchWin = window.open(batchcall,"report","innerHeight=" + height + ",innerWidth=" + width + ",screenX=" + x + ",screenY=" + y + ",resizable,scrollbars,menubar")
	batchWin.focus()

	if (folder && folder.selected)
	{
		for (var i = 0;i < 6;i++)
			folder.visited[i] = false
		folder.visited[active_tab] = true
	}
}

function fmtBatchVal(str)
{
	str = "" + str
	var nstr = ""
	for (var i = 0;i < str.length;i++)
	{
		if (str.charAt(i) == " ")
			nstr += "+"
		else
			nstr += str.charAt(i)
	}
	var retval = ""
	var nbr_zeros = this.size - nstr.length
	if (this.edit == "date")
		nbr_zeros = 8
	if (this.edit == "time")
		nbr_zeros = 4
	if (this.edit == "numeric" || this.edit == "date" || this.edit == "time")
	{
		for (var i = 0;i < nbr_zeros;i++)
			retval += "0"
		retval += nstr
	}
	else
	{
		retval += nstr
		for (var i = 0;i < nbr_zeros;i++)
			retval += "+"
	}
	return retval
}

function monitor()
{
	var x = 5
	var y = 100
	if (isIE)
	{
		var width = screen.width - 20
		var height = screen.height - 200
		var mon = "/cgi-lawson/monitor" + ((typeof CGIExt != "undefined") ? CGIExt : "") + "?"
		monWin = window.open(mon,"monitor","height=" + height + ",width=" + width + ",left=" + x + ",top=" + y + ",resizable,scrollbars,menubar")
	}
	else
	{
		var width = self.innerWidth - 20
		var height = self.outerHeight - 200
		var mon = "/cgi-lawson/monitor" + ((typeof CGIExt != "undefined") ? CGIExt : "") + "?"
		monWin = window.open(mon,"monitor","innerHeight=" + height + ",innerWidth=" + width + ",screenX=" + x + ",screenY=" + y + ",resizable,scrollbars,menubar")
	}
	monWin.focus()
}

function initForm()
{
	for (var i = 0;i < frm_fields.length;i++)
		frm_fields[i].initField()
	init_done = true
}

function agsReturn(agsname,value)
{
	if (!init_done)
		initForm()

	if (next_error)
		return

	if (agsname == "_HK")
	{
		hk_val = value
		return
	}
	if (typeof ags_ary[agsname] == "undefined")
		return
	var str = "" + ags_ary[agsname]
	var nstr = str.split(":")
	var fld = frm_fields[Number(nstr[0])]
	if (nstr[1])
		fld.updateField(value,Number(nstr[1]))
	else
		fld.updateField(value)
}

function dtlFieldDecor(val,do_drill,j)
{
	var retval = ""
	if (this.l_color != "")
	{
		if (this.l_bold)
			retval += '<b>'
		if (this.l_ital)
			retval += '<i>'
		retval += '<font'
		if (this.l_color != "")
			retval += ' color=' + this.l_color
		if (this.l_face != "")
			retval += ' face="' + this.l_face + '"'
		if (this.l_size != "")
			retval += ' size=' + this.l_size
		retval += '>'
	}
	else
	{
		if (l_bold)
			retval += '<b>'
		if (l_ital)
			retval += '<i>'
		retval += '<font'
		if (l_color != "")
			retval += ' color=' + l_color
		if (l_face != "")
			retval += ' face="' + l_face + '"'
		if (l_size != "")
			retval += ' size=' + l_size
		retval += '>'
	}
	if (val != "" && do_drill)
		retval += '<a href=javascript:parent.doSelect('
			   + 'this,' + this.idx + ',"DT",' + j + ')>'
			   + val + '</a>'
	else
		retval += val
	retval += '</font>'
	if (this.l_color != "")
	{
		if (this.l_ital)
			retval += '</i>'
		if (this.l_bold)
			retval += '</b>'
	}
	else
	{
		if (l_ital)
			retval += '</i>'
		if (l_bold)
			retval += '</b>'
	}
	return retval
}

function fmtValue(value)
{
	var retval = value

	if ((this.edit == "signed" || this.edit == "numeric") && Number(value) == 0)
		retval = ""
	if (this.edit == "date")
		retval = value.substring(4,6) + "/"
			   + value.substring(6,8) + "/"
			   + value.substring(0,4)
	if (this.edit == "time" && value != "" && this.val_count == -1)
	{
		if (this.size == 5)
			retval = value.substring(0,2) + ":" + value.substring(2,4)
		if (this.size == 8)
			retval = value.substring(0,2) + ":"
				   + value.substring(2,4) + ":"
				   + value.substring(4,6)
	}
	return retval
}

function getIndex(elm,value)
{
	value = "" + value
	var retval = 0
	for (var i = 0;i < elm.length;i++)
	{
		if (elm.options[i].value == value)
		{
			retval = i
			break
		}
	}
	return retval
}

function setCheckedValue(elm,value)
{
	value = "" + value
	for (var i = 0;i < elm.length;i++)
	{
		if (elm[i].value == value)
		{
			elm[i].checked = true
			break
		}
	}
}

function agsMessage(msg,fldnbr,error)
{
	if (startup_fc != "")
	{
		if (waitWin != null)
		{
			if (!waitWin.closed)
				waitWin.close()
		}
		self.focus()
	}
	msgBlock.content = msg
	msgBlock.writeContent()
	if (isIE)
		msgBlock.layer.style.visibility = "visible"
	else
		msgBlock.layer.hidden = false
	setCursor(fldnbr,error)
	frm_running = false
	clearCache()
	if (!error)
	{
		if (folder && folder.selected)
		{
			for (var i = 0;i < 6;i++)
				folder.visited[i] = false
			folder.visited[active_tab] = true
		}
		blankDtlOutput()
		if (!doRule(run_fc_val))
			doExit(run_fc)
	}
}

function blankDtlOutput()
{
	for (var j = 1;j <= dtl_lines;j++)
	{
		if (!dtl_done[j])
		{
			for (var i = 0;i < frm_fields.length;i++)
			{
				var fld = frm_fields[i]
				if (fld.dtl_area && fld.selected &&
				   (fld.orig_type == "Hidden" || fld.orig_type == "HiddenKey") &&
				    fld.valueList.length > 0)
				{
					fld.value[j] = ""
					fld.returned[j] = true
					fld.writeContent(j)
				}
			}
		}
	}

	for (var i = 0;i < frm_fields.length;i++)
	{
		var fld = frm_fields[i]
		if (fld.dtl_area && fld.type == "Out" && fld.selected)
		{
			for (var j = 1;j <= dtl_lines;j++)
			{
				if (!fld.returned[j])
					fld.writeContent(j)
			}
		}
	}
	for (var i = 0;i < textArea.length;i++)
	{
		if (textArea[i].selected && textArea[i].text_area)
		{
			if (isNav)
				var elm = textArea[i].layer.document.forms[0].elements[0]
			else
				elm = self.CANVAS.document.forms[0].elements["txt_area"+textArea[i].idx]
			var str = elm.value.split('\r\n')
			var k = str.length - 1
			for (var j = k;j >= 0;j--)
			{
				if (str[j] != "")
					break
			}
			if (j >= textArea[i].rows)
				j = textArea[i].rows - 1
			var nstr = ""
			for (var k = 0;k <= j;k++)
			{
				nstr += str[k]
				if (k < j)
					nstr += '\r\n'
			}
			elm.value = nstr
		}
	}
}

function clearCache()
{
var theblank = (window.location.protocol=='http:')?'about:blank':'/lawson/dot.htm';  //dpb 07-11-01 SSL Issue
	self.jsreturn.location.replace(theblank)
}

function setCursor(fldnbr,error)
{
	if (fldnbr == "_f0" || fldnbr == "_f1")
		return

	var lyr = null
	var selected = false
	var str = "" + fldnbr_ary[fldnbr]
	var nstr = str.split(":")
	var fld = frm_fields[Number(nstr[0])]
	if (nstr[1])
		var elm = fld.frmElm[Number(nstr[1])]
	else
		var elm = fld.frmElm
	if (fld.type != "Out" && !fld.hidden)
	{
		selected = fld.selected
		if (elm)
		{
			if (fld.dsp_opt.charAt(0) == "R")
				elm[0].focus()
			else
				elm.focus()
		}
		if (!fld.dtl_area)
		{
			if (fld.textAreaIdx != -1)
				lyr = textArea[fld.textAreaIdx].layer
			else
				lyr = fld.layer
		}
	}
	if (error && lyr != null && selected)
	{
		if (isIE)
		{
			if (lyr.offsetLeft + lyr.offsetWidth + arrow_l.layer.offsetWidth > WIDTH)
			{
				arrow_r.layer.style.pixelLeft = lyr.style.pixelLeft - arrow_r.layer.style.pixelWidth - 1
				arrow_r.layer.style.pixelTop = lyr.style.pixelTop + 3
				arrow_r.layer.style.visibility = "visible"
			}
			else
			{
				arrow_l.layer.style.pixelLeft = lyr.style.pixelLeft + lyr.style.pixelWidth + 1
				arrow_l.layer.style.pixelTop = lyr.style.pixelTop + 3
				arrow_l.layer.style.visibility = "visible"
			}
		}
		else
		{
			if (lyr.left + lyr.clip.right + arrow_l.layer.document.width > WIDTH)
			{
				arrow_r.layer.left = lyr.left - arrow_r.layer.document.width - 1
				arrow_r.layer.top = lyr.top + 3
				arrow_r.layer.hidden = false
			}
			else
			{
				arrow_l.layer.left = lyr.left + lyr.clip.right + 1
				arrow_l.layer.top = lyr.top + 3
				arrow_l.layer.hidden = false
			}
		}
		if (fld.folder_tab != -1 && folder.selected)
		{
			var idx = fld.folder_tab
			folder.tab[idx].onmousedown()
		}
	}
}

function getFieldName(fldnbr)
{
	var retval = ""
	if (fldnbr == "_f0" || fldnbr == "_f1")
		return retval

	var str = "" + fldnbr_ary[fldnbr]
	var nstr = str.split(":")
	var fld = frm_fields[Number(nstr[0])]
	retval += ' - '
	retval += fld.label
	return retval
}

function doRule(fc_val)
{
	var cnj = new Array()
	cnj[0] = "&&"
	cnj[1] = "||"
	var lp = new Array()
	lp[0] = ""
	lp[1] = "("
	lp[2] = "(("
	var rp = new Array()
	rp[0] = ""
	rp[1] = ")"
	rp[2] = "))"
	for (var i = 0;i < rules.length;i++)
	{
		rules[i].result = false
		if (ruleMethod(rules[i].method,fc_val) && rules[i].name != start_rule)
		{
			var str = ""
			for (var j = 0;j < rules[i].condition.length;j++)
			{
				if (j > 0)
					str += cnj[rules[i].condition[j].conjunction]
				str += lp[rules[i].condition[j].l_paren]
				var idx = rules[i].condition[j].field
				var val = frm_fields[idx].compareValue(frm_fields[idx].value)
				var r_val = frm_fields[idx].compareValue(rules[i].condition[j].value)
				rules[i].condition[j].result = false
				switch(rules[i].condition[j].operator)
				{
					case 0:
						if (val == r_val)
							rules[i].condition[j].result = true
						break
					case 1:
						if (val != r_val)
							rules[i].condition[j].result = true
						break
					case 2:
						val = val.toUpperCase()
						r_val = r_val.toUpperCase()
						if (val.indexOf(r_val) != -1)
							rules[i].condition[j].result = true
						break
					case 3:
						val = val.toUpperCase()
						r_val = r_val.toUpperCase()
						if (val.indexOf(r_val) == -1)
							rules[i].condition[j].result = true
						break
					case 4:
						val = val.toUpperCase()
						r_val = r_val.toUpperCase()
						if (val.substring(0,r_val.length) == r_val)
							rules[i].condition[j].result = true
						break
					case 5:
						val = val.toUpperCase()
						r_val = r_val.toUpperCase()
						if (val.substring(val.length-r_val.length,val.length) == r_val)
							rules[i].condition[j].result = true
						break
					case 6:
						if (val < r_val)
							rules[i].condition[j].result = true
						break
					case 7:
						if (val > r_val)
							rules[i].condition[j].result = true
						break
					case 8:
						if (val >= r_val)
							rules[i].condition[j].result = true
						break
					case 9:
						if (val <= r_val)
							rules[i].condition[j].result = true
						break
				}
				str += rules[i].condition[j].result
					+ rp[rules[i].condition[j].r_paren]
			}
			rules[i].result = eval(str)
		}
	}
	var retval = false
	for (var i = 0;i < rules.length;i++)
	{
		if (rules[i].result == true)
		{
			retval = true
			if (rules[i].url != "")
			{
				var x = rules[i].url
				var z = "Form"
			}
			else
			{
				var x = self.location.href
				if (self.location.hash != "")
				{
					var j = self.location.href.indexOf("#")
					x = x.substring(0,j)
				}
				var z = self.document.title
			}
			var y = "#"
			for (var j = 0;j <= rules[i].export_count;j++)
			{
				var k = rules[i].exportList[j]
				y += (frm_fields[k].kfn != "" ? frm_fields[k].kfn : frm_fields[k].ags_name) + "=" + escape(frm_fields[k].value) + "&"
			}
			if (y.length > 1)
				x += y
			else
				x += "#"
			x += "RULE=" + rules[i].name
			if (rules[i].mail != "")
			{
				self.location = 'mailto:' + rules[i].mail
							  + '?SUBJECT=' + escape(z)
						      + '&BODY=' + escape(x)
			}
			else
			{
				if (isNav)
					self.stop()
				self.document.location = x
			}
		}
	}
	return retval
}

function ruleMethod(ary,val)
{
	var retval = false
	if (ary == null)
		return retval
	for (var i = 0;i < ary.length;i++)
	{
		if (ary[i] == val)
		{
			retval = true
			break
		}
	}
	return retval
}

function doExit(fc)
{
	var obj = null
	for (var i = 0;i < frm_fields.length;i++)
	{
		if (frm_fields[i].type == "Fc" && frm_fields[i].name == fc)
		{
			obj = frm_fields[i]
			break
		}
	}
	if (obj == null)
		return
	if (obj.exit_fnct == 0)
		return

	if (obj.exit_fnct == 1)
		self.back()
	else if (obj.exit_fnct == 2)
		self.close()
	else if (obj.exit_fnct == 3)
	{
		var x = obj.exit_url
		var y = "#"
		for (var i = 0;i <= obj.export_count;i++)
		{
			var j = obj.exportList[i]
			y += (frm_fields[j].kfn != "" ? frm_fields[j].kfn : frm_fields[j].ags_name) + "=" + escape(frm_fields[j].value) + "&"
		}
		if (y.length > 1)
			x += y.substring(0,y.length-1) //+ "FC=I"
		self.stop()
		self.document.location = x
	}
	else
	{
		var x = self.location.href
		if (self.location.hash != "")
		{
			var j = self.location.href.indexOf("#")
			x = x.substring(0,j)
		}
		var y = "#"
		for (var i = 0;i <= obj.export_count;i++)
		{
			var j = obj.exportList[i]
			y += (frm_fields[j].kfn != "" ? frm_fields[j].kfn : frm_fields[j].ags_name) + "=" + escape(frm_fields[j].value) + "&"
		}
		if (y.length > 1)
			x += y.substring(0,y.length-1) //+ "FC=I"
		var url = 'mailto:' + obj.exit_url
				+ '?SUBJECT=' + escape(self.document.title)
				+ '&BODY=' + escape(x)
		self.location = url
	}
}

function setLinkDecor(O)
{
	var doc = O.layer.document
	if (O.l_color != "")
	{
		doc.linkColor = O.l_color
		doc.alinkColor = O.l_color
		doc.vlinkColor = O.l_color
	}
	else if (l_color != "")
	{
		doc.linkColor = l_color
		doc.alinkColor = l_color
		doc.vlinkColor = l_color
	}
}

function getLinkDecor()
{
	var retval = ""
	if (this.l_color != "")
	{
		retval += ' link=' + this.l_color
			   + ' alink=' + this.l_color
			   + ' vlink=' + this.l_color
	}
	else if (l_color != "")
	{
		retval += ' link=' + l_color
			   + ' alink=' + l_color
			   + ' vlink=' + l_color
	}
	return retval
}

function editDate(obj)
{
	date_error = false
	if (ValidDate(obj) == false)
	{
		alert("Invalid Date")
		obj.focus()
		obj.select()
		date_error = true
	}
	else if (NonSpace(obj.value) == 0)
		obj.value = ""
}

function focusDate(obj)
{
	if (date_error)
		obj.value = ""
	date_error = false
}

function editTime(obj,size)
{
	time_error = false
	if (ValidTime(obj,size) == false)
	{
		alert("Invalid Time")
		obj.focus()
		obj.select()
		time_error = true
	}
	else if (NonSpace(obj.value) == 0)
		obj.value = ""
}

function focusTime(obj)
{
	if (time_error)
		obj.value = ""
	time_error = false
}

function editNumber(obj,size,decimal,signed)
{
	var str = ""
	var sign = ""
	if (signed)
	{
		for (var i = 0;i < obj.value.length;i++)
		{
			if (obj.value.charAt(i) == "-")
				sign = "-"
			else
				str += obj.value.charAt(i)
		}
		obj.value = str
	}

	number_error = false
	if (ValidNumber(obj,size,decimal) == false)
	{
		alert("Invalid Number")
		obj.focus()
		obj.select()
		number_error = true
	}
	else
		obj.value += sign
}

function focusNumber(obj)
{
	if (number_error)
		obj.value = ""
	number_error = false
}

function setClip()
{
	var lyr = this
	lyr.clip.top = 0
	lyr.clip.left = 0
	lyr.clip.right = lyr.document.width
	if (lyr.ref.use_frame)
	{
		if (lyr.document.anchors.length != 0)
			lyr.clip.bottom = lyr.document.anchors[0].y
		else
			lyr.clip.bottom = lyr.document.height
	}
	else
	{
		if (lyr.document.anchors.length != 0)
			lyr.clip.bottom = lyr.document.anchors[0].y + 2
		else
			lyr.clip.bottom = lyr.document.height + 4
	}
	lyr.ref.drawBorder()
}

function nextField(idx,type)
{
	var cur_pos = -1
	var cur_folder_tab = -1
	var dtl_elm = null
	var next_fld = null
	var next_pos = 0
	if (type == "field")
	{
		cur_pos = frm_fields[idx].tab_order
		cur_folder_tab = frm_fields[idx].folder_tab
	}
	else if (type == "textarea")
	{
		cur_pos = textArea[idx].tab_order
		cur_folder_tab = textArea[idx].folder_tab
	}
	else
	{
		cur_pos = detail.tab_order
		cur_folder_tab = detail.folder_tab
	}
	if (cur_pos == tabObj.length - 1 && cur_folder_tab == -1)
	{
		for (var i = 1;i < tabObj.length;i++)
		{
			if (tabObj[i].folder_tab == -1 || tabObj[i].folder_tab == active_tab)
			{
				next_pos = i
				break
			}
		}
	}
	else
	{
		for (var i = cur_pos + 1;i < tabObj.length;i++)
		{
			if (tabObj[i].folder_tab == cur_folder_tab
			|| (tabObj[i].folder_tab == active_tab && cur_folder_tab == -1))
			{
				next_pos = i
				break
			}
		}
		if (next_pos == 0 && cur_folder_tab != -1)
		{
			for (var i = cur_pos + 1;i < tabObj.length;i++)
			{
				if (tabObj[i].folder_tab == -1)
				{
					next_pos = i
					break
				}
			}
			if (next_pos == 0)
			{
				for (var i = 1;i < tabObj.length;i++)
				{
					if (tabObj[i].folder_tab == -1)
					{
						next_pos = i
						break
					}
				}
			}
			if (next_pos == 0 && cur_folder_tab != -1)
			{
				for (var i = 1;i < tabObj.length;i++)
				{
					if (tabObj[i].folder_tab == cur_folder_tab)
					{
						next_pos = i
						break
					}
				}
			}
		}
		if (next_pos == 0)
		{
			if (cur_folder_tab != -1)
				next_pos = cur_pos
			else
				next_pos = 1
		}
	}
	var idx = tabObj[next_pos].idx
	var next_type = tabObj[next_pos].type
	if (next_type == "field")
		next_fld = frm_fields[idx]
	else if (next_type == "textarea")
		next_fld = textArea[idx]
	else
		next_fld = detail

	if (next_fld != null && next_fld.layer.document.forms[0].elements[0])
	{
		if (next_fld.folder_tab != -1 && next_fld.folder_tab != active_tab)
			folder.tab[next_fld.folder_tab].onmousedown()
		next_fld.layer.document.forms[0].elements[0].focus()
	}
}

function process_help()
{
	if (isNav)
		processNavHelp()
	else
		processIEHelp()
}

function processIEHelp()
{
	currentObject = null
	var y = help.layer.style.pixelTop
	var x = help.layer.style.pixelLeft
	for (var i = 0;i < frm_fields.length;i++)
	{
		if (frm_fields[i].selected && frm_fields[i].layer)
		{
			var lyr = frm_fields[i].layer
			if (frm_fields[i].dtl_area)
			{
				if (lyr.offsetTop + detail.layer.offsetTop <= y && lyr.offsetTop + lyr.offsetHeight + detail.layer.offsetTop >= y &&
					lyr.offsetLeft + detail.layer.offsetLeft <= x && lyr.offsetLeft + lyr.offsetWidth + detail.layer.offsetLeft >= x)
				{
					currentObject = frm_fields[i]
					break
				}
			}
			else
			{
				if (lyr.offsetTop <= y && (lyr.offsetTop + lyr.offsetHeight) >= y &&
					lyr.offsetLeft <= x && (lyr.offsetLeft + lyr.offsetWidth) >= x)
				{
					currentObject = frm_fields[i]
					break
				}
			}
		}
	}
	if (currentObject != null)
		showHelp()
	else if (titleBlock != null)
	{
		if (titleBlock.layer.offsetTop <= y && (titleBlock.layer.offsetTop + titleBlock.layer.offsetHeight) >= y &&
			titleBlock.layer.offsetLeft <= x && (titleBlock.layer.offsetLeft + titleBlock.layer.offsetWidth) >= x)
			showFormHelp()
	}
	currentObject = null
}

function processNavHelp()
{
	currentObject = null
	var y = help.layer.top
	var x = help.layer.left
	for (var i = 0;i < frm_fields.length;i++)
	{
		if (frm_fields[i].selected && frm_fields[i].layer)
		{
			var lyr = frm_fields[i].layer
			if (frm_fields[i].dtl_area)
			{
				if (lyr.pageY <= y && lyr.pageY + lyr.clip.bottom >= y &&
					lyr.pageX <= x && lyr.pageX + lyr.clip.right >= x)
				{
					currentObject = frm_fields[i]
					break
				}
			}
			else
			{
				if (lyr.top <= y && lyr.top + lyr.clip.bottom >= y &&
					lyr.left <= x && lyr.left + lyr.clip.right >= x)
				{
					currentObject = frm_fields[i]
					break
				}
			}
		}
	}
	if (currentObject != null)
		showHelp()
	else if (titleBlock != null)
	{
		if (titleBlock.selected &&
			titleBlock.layer.top <= y && (titleBlock.layer.top + titleBlock.layer.clip.bottom) >= y &&
			titleBlock.layer.left <= x && (titleBlock.layer.left + titleBlock.layer.clip.right) >= x)
			showFormHelp()
	}
	currentObject = null
	help.layer.top = HELP_TOP
	help.layer.left = HELP_LEFT
}

function mdown(e)
{
	if (e.target.name || e.target.href)
	{
		var retval = routeEvent(e)
		return retval
	}
	moved = false
	Decor_Object.current=this;
	this.offX = e.pageX-this.pageX;
	this.offY = e.pageY-this.pageY;
	self.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
	this.savemousemove = self.onmousemove;
	this.savemouseup = self.onmouseup;
	self.onmousemove = mdrag;
	self.onmouseup = mup;
	return false;
}

function mdrag(e)
{
    var that = Decor_Object.current;
	that.pageX=e.pageX-that.offX;
	that.pageY=e.pageY-that.offY;
	moved = true
	return false;
}

function mup(e)
{
    var that = Decor_Object.current;
	self.onmousemove = that.savemousemove;
	self.onmouseup = that.savemouseup;
	var mask = 0;
	if (!self.onmousemove) mask|=Event.MOUSEMOVE;
	if (!self.onmouseup)	 mask|=Event.MOUSEUP;
	window.releaseEvents(mask);
	if (that.ref.ondrop && moved)
	  that.ref.ondrop(that.ref);
	moved = false
	return true;
}

function doKeyPress(edit)
{
	var key = self.CANVAS.event.keyCode
	if (edit == "numeric")
	{
		if ((key < 48 || key > 57) && key != 46 && key != 8 && key != 13)
		{
			alert("Field is numeric")
			self.CANVAS.event.returnValue = false
			return false
		}
	}
	if (edit == "signed")
	{
		if ((key < 48 || key > 57) && key != 45 && key != 46 && key != 8 && key != 13)
		{
			alert("Field is numeric")
			self.CANVAS.event.returnValue = false
			return false
		}
	}
	if ((key == 13 || key == 0) && dft_fc != "")
		runForm(dft_fc,dft_fc_val)
	return false
}

function checkForms(e)
{
	if (e.target.name && e.target.name.indexOf("numeric") != -1)
	{
		if ((e.which < 48 || e.which > 57) && e.which != 46 && e.which != 8 && e.which != 13)
		{
			alert("Field is numeric")
			return false
		}
	}
	if (e.target.name && e.target.name.indexOf("signed") != -1)
	{
		if ((e.which < 48 || e.which > 57) && e.which != 45 && e.which != 46 && e.which != 8 && e.which != 13)
		{
			alert("Field is numeric")
			return false
		}
	}
	if (e.target.name && e.target.name.indexOf("FRM") != -1 && e.which == 13 && dft_fc != "")
		runForm(dft_fc,dft_fc_val)
	return true
}

function FormatDecimalField(fldval,decimals)
{
	var sign = ""
	if (fldval.charAt(fldval.length - 1) == "+" || fldval.charAt(fldval.length - 1) == "-")
	{
		sign = fldval.charAt(fldval.length - 1)
		fldval = fldval.substring(0,fldval.length - 1)
	}
	var fmtval = ""
	var nonzero = false
	for (var i=0;i < fldval.length;i++)
	{
		if (fldval.charAt(i) >= 0 && fldval.charAt(i) <= 9)
		{
			if (nonzero)
			{
				fmtval += fldval.charAt(i)
			}
			else
			if (fldval.charAt(i) != "0")
			{
				nonzero = true
				fmtval += fldval.charAt(i)
			}
		}
	}
	if (fmtval.length > 0)
	{
		if (decimals == 4)
		{
			if (fmtval.length == 1)
				fmtval = "000" + fmtval
			if (fmtval.length == 2)
				fmtval = "00" + fmtval
			if (fmtval.length == 3)
				fmtval = "0" + fmtval
		}
		if (decimals == 3)
		{
			if (fmtval.length == 1)
				fmtval = "000" + fmtval
			if (fmtval.length == 2)
				fmtval = "00" + fmtval
		}
		if (decimals == 2)
		{
			if (fmtval.length == 1)
				fmtval = "000" + fmtval
		}
	}
	if (fmtval.length > 0)
	{
		var x = fmtval.length - decimals
		fmtval = fmtval.substring(0,x) + "." + fmtval.substring(x,fmtval.length)
	}
	if (sign == "-")
		fmtval += sign
	return fmtval
}

function fmtNumericOutput(fld,j)
{
	if (j)
	{
		fld.value[j] = "" + fld.value[j]
		var val = fld.value[j]
	}
	else
	{
		fld.value = "" + fld.value
		var val = fld.value
	}
	var neg = false
	if (val.charAt(val.length - 1) == "-")
		neg = true
	var retval = ""
	if (neg)
	{
		if (neg_type == "brackets")
			retval += '('
	}
	if (neg)
		retval += val.substring(0,val.length-1)
	else
		retval += val
	if (neg)
	{
		if (neg_type == "sign")
			retval += "-"
		else if (neg_type == "credit")
			retval += "CR"
		else if (neg_type == "brackets")
			retval += ")"
	}
	if (neg && neg_red)
		retval = retval.fontcolor("red")
	return retval
}

function doDateSelect(x,y)
{
	if (y)
		dateField = frm_fields[x].frmElm[y]
	else
		dateField = frm_fields[x].frmElm
	calWin = window.open('/lawson/forms/calendar.html','cal','WIDTH=200,HEIGHT=250,left=' + mouseX + ',top=' + mouseY)
	calWin.focus()
}

function ReturnSelect(value)
{
	currentElm.value = stripTrailingSpaces(stripLeadingSpaces(unescape(value)))
}

function getCheckedValue(elm)
{
	retval = ""
	for (var i = 0;i < elm.length;i++)
	{
		if (elm[i].checked)
		{
			retval = elm[i].value
			break
		}
	}
	return retval
}

function getAuthUser()
{
var theblank = (window.location.protocol=='http:')?'about:blank':'/lawson/dot.htm';  //dpb 07-11-01 SSL Issue
	if (badVersion())
		return

	if (isNav)
	{
		self.captureEvents(Event.KEYPRESS)
		self.onKeyPress = checkForms
	}
	if (self.location.hash != "")
		buildStartupArray()
	if (startup_fc != "")
	{
		if (isIE)
			waitWin = window.open(theblank,"Wait","height=120,width=390,left=100,top=100")
		else
			waitWin = window.open(theblank,"Wait","innerHeight=120,innerWidth=390,screenX=100,screenY=100")
		var page = "<html><head><title>Retrieving - Wait</title></head>"
				 + "<body><center><font size=5>"
				 + "<img align=left src=" + waitimg.src + " border=0>"
				 + "Retrieving requested information - Please Wait"
				 + "</font></center></body></html>"
		waitWin.document.write(page)
		waitWin.document.close()
		waitWin.focus()
	}
	authenticate("frameNm='jsreturn'")
}

function startApp(FATALfl)
{
	if (FATALfl)
    	alert(authUser.ErrorMsg)
    else
    {
    	if (authUser.editError)
    		alert("Warning: " + authUser.ErrorMsg)
		displayForm()
		if (start_array != null)
			setFormValues()
		if ((self.CANVAS.onload == null || self.CANVAS.onload == "undefined") && startup_fc != "")
			runForm(startup_fc,"")
	}
}

function getWebuserValue(str)
{
	var retval = ""
	if (str == "$web_user")
		retval = authUser.webuser
	if (str == "$company")
		retval = parseInt(authUser.company)
	if (str == "$employee")
		retval = parseInt(authUser.employee)
	if (str == "$vendor")
		retval = escape(authUser.vendor)
	if (str == "$customer")
		retval = escape(authUser.customer)
	if (str == "$requester")
		retval = authUser.requester
	if (str == "$vendor_group")
		retval = authUser.vendor_group
	if (str == "$buyer_code")
		retval = authUser.buyer_code
	if (str == "$cust_group")
		retval = escape(authUser.cust_group)
	if (str == "$login")
		retval = escape(authUser.login)
	return retval
}

function verifyWebuserValue(constant,value)
{
	cstr = "" + getWebuserValue(constant)
	vstr = "" + value
	if (cstr == vstr)
		return true
	else
		return false
}

function stripTrailingSpaces(str)
{
	var j = 0
	for (var i = str.length - 1;i > 0;i--)
	{
		if (str.charAt(i) != " ")
		{
			j = i
			break
		}
	}
	return str.substring(0,j + 1)
}

function stripLeadingSpaces(str)
{
	var j = 0
	for (var i = 0;i < str.length;i++)
	{
		if (str.charAt(i) != " ")
		{
			j = i
			break
		}
	}
	return str.substring(j,str.length)
}

function closeWindows()
{
	if (idaWin != null)
	{
		if (!idaWin.closed)
			idaWin.close()
	}
	if (batchWin != null)
	{
		if (!batchWin.closed)
			batchWin.close()
	}
	if (monWin != null)
	{
		if (!monWin.closed)
			monWin.close()
	}
	if (helpWin != null)
	{
		if (!helpWin.closed)
			helpWin.close()
	}
	if (calWin != null)
	{
		if (!calWin.closed)
			calWin.close()
	}
}

function openUrl(url)
{
	if (isIE)
	{
		var x = screen.width / 9
		var y = screen.height / 9
		var width = screen.width * .8
		var height = screen.height * .8
		window.open(url,"urlwin","width=" + width + ",height=" + height + ",left="
					 + x + ",top=" + y + ",resizable,scrollbars,toolbar,menubar")
	}
	else
	{
		var x = window.outerWidth / 7
		var y = window.outerHeight / 7
		var width = window.outerWidth * .8
		var height = window.outerHeight * .8
		window.open(url,"urlwin","outerWidth=" + width + ",outerHeight=" + height + ",screenX="
					 + x + ",screenY=" + y + ",resizable,scrollbars,toolbar,menubar")
	}
}

function buildStartupArray()
{
	start_array = new Array()
	var n = -1
	var str = self.location.hash.substring(1,self.location.hash.length)
	var nstr = str.split("&")
	for (var i = 0;i < nstr.length;i++)
	{
		var x = nstr[i].split("=")
		if (x[0] == "FC")
			startup_fc = x[1]
		else if (x[0] == "RULE")
			start_rule = unescape(x[1])
		else
		{
			start_array[++n] = new Object()
			start_array[n].kfn = x[0]
			start_array[n].value = x[1]
		}
	}			
}

function setFormValues()
{
	for (var i = 0;i < start_array.length;i++)
		setValueX(start_array[i].kfn,start_array[i].value)
}

function setValueX(kfn,value)
{
	for (var i = 0;i < frm_fields.length;i++)
	{
		var fld = frm_fields[i]
//		if  ((fld.selected || fld.hidden) &&
		if  ((kfn.length > 3 && kfn == fld.ags_name) ||
		    (kfn.length <= 3 && (kfn == fld.kfn || kfn == fld.skfn)))
		{
			init_done = true
			agsReturn(fld.ags_name,unescape(value))
			break
		}
	}
}

function Rule(name,url,mail)
{
	this.name = name
	this.url = url
	this.mail = mail
	this.condition = new Array()
	this.condition_count = -1
	this.method = new Array()
	this.method_count = -1
	this.exportList = new Array()
	this.export_count = -1
}

function Condition(field,operator,value,conjunction,l_paren,r_paren)
{
	this.field = field
	this.operator = operator
	this.value = value
	this.conjunction = conjunction
	this.l_paren = l_paren
	this.r_paren = r_paren
}

// Drag and drop code for explorer

currentX = currentY = 0
whichEl = null

function grabEl()
{
	whichEl = self.CANVAS.event.srcElement
	while (whichEl.id != "HELP")
	{
		whichEl = whichEl.parentElement
		if (whichEl == null)
			return
	}
	whichEl.style.pixelLeft = whichEl.offsetLeft
	whichEl.style.pixelTop = whichEl.offsetTop
	currentX = self.CANVAS.event.clientX + self.CANVAS.document.body.scrollLeft
	currentY = self.CANVAS.event.clientY + self.CANVAS.document.body.scrollTop
}

function moveEl()
{
	if (whichEl == null)
		return

	newX = self.CANVAS.event.clientX + self.CANVAS.document.body.scrollLeft
	newY = self.CANVAS.event.clientY + self.CANVAS.document.body.scrollTop
	distanceX = (newX - currentX)
	distanceY = (newY - currentY)
	currentX = newX
	currentY = newY
	whichEl.style.pixelLeft += distanceX
	whichEl.style.pixelTop += distanceY
	self.CANVAS.event.returnValue = false
}

function dropEl()
{
	if (whichEl != null)
	{
		process_help()
		whichEl.style.pixelTop = HELP_TOP
		whichEl.style.pixelLeft = HELP_LEFT
	}
	whichEl = null
}

function buildCgiForm()
{
	var flds = frm_fields
	var max = fc_idx
	var doc = self.agsform.document
	doc.open()
	var page = "<form name=agsform action=/cgi-lawson/ags"
			 + ((typeof CGIExt != "undefined") ? CGIExt : "")
			 + " method=post target=jsreturn>"
	doc.write(page)
	doc.write("<input type=hidden name=_PDL value=PDL>")
	doc.write("<input type=hidden name=_TKN value=TKN>")
	doc.write("<input type=hidden name=_LFN value=TRUE>")
	doc.write("<input type=hidden name=_EVT value=EVT>")
	doc.write("<input type=hidden name=_RTN value=DATA>")
	doc.write("<input type=hidden name=_TDS value=Ignore>")
	doc.write("<input type=hidden name=_VFMT value=TRUE>")
	doc.write("<input type=hidden name=FC value=FC>")
	for (var i = 0;i < max;i++)
	{
		if (flds[i].dtl_area)
		{
			for (var j = 1;j <= dtl_lines;j++)
				doc.write("<input type=hidden name=e"+i+"_"+j+">")
		}
		else
			doc.write("<input type=hidden name=e"+i+">")
	}
	doc.write("</form>")
	doc.close()
}
debug = 'java'
function debugMessage(what)
{
	if (debug == "java")
		java.lang.System.out.println(what)
	else if (debug == "alert")
		alert(what)
}


