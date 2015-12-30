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

frm_fields = null
fld_count = 0
decor_obj = null
decor_count = 0
rules = null
rules_count = 0
hk_name = ""
hk_val = ""
ags_ary = null
fldnbr_ary = null
mouseX = 0
mouseY = 0
currentLayer = null
currentField = null
currentObject = null
prodline = ""
system = ""
token = ""
form_type = ""
run_fc = ""
run_fc_val = ""
init_done = false
next_error = false
date_error = false
number_error = false
key_fcs = ""
data_fcs = ""
ldata_fcs = ""
ladd_fcs = ""
selarrow = new Image()
selarrow.src = "/lawson/forms/select.gif"
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

function Decor_Object(id,z,top,left,right,bottom)
{
	if (isIE)
	{
		var l = '<div id=' + id
		l += ' style="position:absolute;visibility:hidden;top:' + top + 'px;left:' + left
		  + 'px;width:' + right + 'px;height:' + bottom + 'px;z-index:' + z
		  + ' background:()"></div>'
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
	this.face = ""
	this.size = ""
	this.bold = false
	this.ital = false
	this.bgc = ""
	this.bg_img = ""
	this.img_resize_height = 0
	this.img_resize_width = 0
	this.alt = ""

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

	this.writeContent = writeContent
	this.textDecorBeg = textDecorBeg
	this.textDecorEnd = textDecorEnd
	this.drawBorder = drawBorder
	this.hideBorder = hideBorder
	this.hideShadow = hideShadow
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
	page += this.textDecorEnd()
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
}

function textDecorBeg()
{
	retval = '<table cellspacing=0 cellpadding=4 border='
	if (this.use_frame)
	{
		retval += this.fr_width
		if (this.fr_color != "")
			retval += ' bordercolor=' + this.fr_color
	}
	else
		retval += '0'
	retval += '><td nowrap>'
	if (this.bold)
		retval += '<b>'
	if (this.ital)
		retval += '<i>'
	retval += '<font'
	if (this.color != "")
		retval += ' color=' + this.color
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
	if (this.shadow_s != null)
		this.shadow_s.hidden = true
	if (this.shadow_b != null)
		this.shadow_b.hidden = true
}

// End Decor Object Stuff

// Field Object Stuff

function Field_Object(id,fldnbr,ags_name,z,top,left,right,bottom)
{
	if (Field_Object.arguments.length > 3)
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
	if (ags_name == "")
		this.ags_name = agsFieldName(id)
	else
		this.ags_name = ags_name
	ags_ary[this.ags_name] = this.idx
	this.fldnbr = fldnbr
	fldnbr_ary[this.fldnbr] = this.idx

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
	this.lab_opt = "L"
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
	this.value = ""
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
	this.returned = false
	this.base = 0
	this.exit_fnct = 0
	this.exit_url = ""
	this.dtl_area = false
	this.ln_nbr = 0
	this.h = 0
	this.w = 0
	this.hidden = false
	this.exportList = new Array()
	this.export_count = -1

	this.initField = initField
	this.writeContent = writeFieldContent
	this.fieldDecorBeg = fieldDecorBeg
	this.fieldDecorEnd = fieldDecorEnd
	this.drawBorder = drawBorder
	this.hideBorder = hideBorder
	this.hideShadow = hideShadow

	this.idaValue = idaValue
	this.agsValue = agsValue
	this.batchValue = batchValue
	this.compareValue = compareValue
}

function initField()
{
	if (this.type == "Fc")
		return
	if (this.type == "Hidden")
	{
		this.value = ""
		return
	}
	if (this.type == "Out")
	{
		this.value = ""
		if (this.selected)
			this.writeContent()
	}
	else if (this.selected)
	{
		if (isIE)
		{
			elm = self.CANVAS.document.forms[0].elements[this.ags_name]
			if (elm.type == "text")
				elm.value = ""
			else if (elm.type == "select-one")
				elm.selectedIndex = 0
			else
				for (var i = 0;i < elm.length;i++)
					elm[i].checked = false
		}
		else
		{
			if (this.layer.document.forms[0])
			{
				elm = this.layer.document.forms[0].elements[0]
				if (elm.type == "text")
					elm.value = ""
				if (elm.type == "select-one")
					elm.selectedIndex = 0
				if (elm.type == "radio")
				{
					elm = this.layer.document.forms[0].elements
					for (var i = 0;i < elm.length;i++)
						elm[i].checked = false
				}
			}
		}
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
			page += getLinkDecor(this)
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
			if (this.dtl_area)
				page += '<spacer type=vertical size=4>'
			if (this.value != "")
				page += this.value
			else
				page += ' <spacer type=horizontal size=' + ((this.size * 4) + 6) + '>'
		}
		page += this.fieldDecorEnd()
		this.value = saveval
	}
	else
	{
		page += buildLabel(this)
		if (this.val_count == -1)
		{
			if (this.size > 60)
				var fldsize = 60
			else
				var fldsize = this.size
			page += '<input type=text'
				 + (isIE ? ' tabindex=' + this.tab_order : '')
				 + ' name=' + (isIE ? this.ags_name : this.edit) + ' size='
			   	 + ((fldsize > 1 && this.edit != "upper") ? fldsize : (fldsize + 1))
			   	 + ' maxlength=' + this.size
			if (this.edit == "upper")
				page += ' onBlur="this.value=this.value.toUpperCase()"'
			if (this.edit == "date")
				page += ' onBlur=parent.editDate(this)'
					   + ' onFocus=parent.focusDate(this)'
			if (this.edit == "numeric")
				page += ' onBlur=parent.editNumber(this,' + fldsize + ',' + this.dec + ',false)'
					   + ' onFocus=parent.focusNumber(this)'
			if (this.edit == "signed")
				page += ' onBlur=parent.editNumber(this,' + (fldsize - 1) + ',' + this.dec + ',true)'
					   + ' onFocus=parent.focusNumber(this)'
			if (this.value != "")
				page += ' value="' + this.value + '"'
			page += '>'
		}
		else
		{
			if (this.dsp_opt == "S")
			{
				page += '<select'
					 + (isIE ? ' tabindex=' + this.tab_order : '')
					 + ' name=' + (isIE ? this.ags_name : this.edit) + '>'
				if (this.dft_val == "")
				{
					page += '<option value=""'
					if (this.dft_val == "" && this.constant == "" && this.value == "")
						page += ' selected'
					page += '>'
				}
				for (var i = 0;i <= this.val_count;i++)
				{
					if (this.valueList[i].selected)
					{
						page += '<option value=' + this.valueList[i].val
						if ((this.valueList[i].val == this.constant && this.value == "") ||
							(this.valueList[i].val == this.dft_val && this.constant == "" && this.value == "") ||
							(this.valueList[i].val == this.value))
							page += ' selected'
						page += '>' + this.valueList[i].xlt
					}
				}
				page += '</select>'
			}
			if (this.dsp_opt == "R" || this.dsp_opt == "RS")
			{
				var first_done = false
				for (var i = 0;i <= this.val_count;i++)
				{
					if (this.valueList[i].selected)
					{
						if (this.dsp_opt == "RS" && first_done)
							page += '<br>'
						page += '<input type=radio'
							 + (isIE ? ' tabindex=' + this.tab_order : '')
							 + ' name=' + (isIE ? this.ags_name : this.edit)
							 + ' value=' + this.valueList[i].val
						if ((this.valueList[i].val == this.constant && this.value == "") ||
							(this.valueList[i].val == this.dft_val && this.constant == "" && this.value == "") ||
							(this.valueList[i].val == this.value))
							page += ' checked'
						page += '>' + this.valueList[i].xlt
						first_done = true
					}
				}
			}
		}
		if (this.edit == "date")
		{
			page += '<a href=javascript:parent.doDateSelect(' + this.idx + ')>'
				 + '<img border=0 src=' + selarrow.src
			if (this.h != 0)
				page += ' height=' + this.h + ' width=' + this.w
			page += ' alt=Calendar></a>'
		}
		if (this.do_select)
		{
			page += '<a href=javascript:parent.doSelect(this,'
				 + this.idx + ',"SV")>'
				 + '<img border=0 src=' + selarrow.src
			if (this.h != 0)
				page += ' height=' + this.h + ' width=' + this.w
			page += ' alt=Select></a>'
		}
		page += this.fieldDecorEnd()
		if (isNav)
			page += '<a name=next>'
				 + '<input type=text name=nxtfld size=1'
				 + ' onFocus=parent.nextField(' + this.idx + ')>'
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
}

function buildLabel(fld)
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
	var option = fld.lab_opt

	if (fld.do_drill)
	{
		ref = '<a href=javascript:parent.doSelect('
		if (buildLabel.caller == writeFieldContent)
			ref += 'this,' + fld.idx + ',"DT")>'
		else
			ref += '"' + fld.ags_name + '","DT",true)>'
		img = '<img border=0 src=' + drill.src + ' width=19'
			+ ' height=18 alt=Drill></a>'
		str = fld.label.charAt(0) + '</a>'
			+ fld.label.substring(1,fld.label.length)
		if (fld.dtl_area)
		{
			if (fld.lab_opt == "T")
			{
				if (fld.label != "")
					retval += '<spacer type=horizontal size=19>'
							+ fld.label + '<br>'
							+ ref + img
				else
					retval += ref + img
			}
			else
			{
				retval += ref
				if (NonSpace(fld.label) == 0)
					retval += img
				else
					retval += str
				retval += sp
			}	
		}
		else
		{
			retval += ref
			if (NonSpace(fld.label) == 0)
				retval += img
			else
				retval += str
			if (fld.lab_opt == "T" && fld.label != "")
				retval += '<br>'
			else
				retval += sp
		}
	}
	else
	{
		retval += fld.label
		if (fld.label != "")
		{
			if (fld.lab_opt == "T")
				retval += '<br>'
			else
				retval += sp
		}
	}
	return retval
}

function fieldDecorBeg()
{
	retval = '<table cellspacing=0 cellpadding='
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
	retval += '><td nowrap>'
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
	retval += '</td></table>'
	return retval
}

function idaValue()
{
	var retval = ""
	if (this.kfn == "" || this.edit == "FC")
		return retval

	if (currentObject.dtl_area && this.dtl_area && this.ln_nbr != currentObject.ln_nbr ||
		(!currentObject.dtl_area && this.dtl_area))
		return retval

	if ((this.selected && this.type == "Out" && this.orig_type == "Key" &&
		 this.constant == "") || this.hidden)
	{
		retval = escape(this.value)
	}
	else if ((this.selected || this.constant != "") && this.type != "Out")
	{
		if (this.constant != "" && !this.selected)
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
			else if (this.constant.charAt(0) == "$")
				retval = escape(getWebuserValue(this.constant))
			else
				retval = escape(this.constant)
		}
		else
		{
			if (isIE)
			{
				var elm = self.CANVAS.document.forms[0].elements[this.ags_name]
				if (elm)
				{
					if (this.edit == "date")
						retval = formjsDate(elm.value)
					else if (elm.type == "text")
						retval = elm.value
					else if (elm.type == "select-one")
						retval = elm.options[elm.selectedIndex].value
					else
					{
						for (var i = 0;i < elm.length;i++)
						{
							if (elm[i].checked)
								retval = elm[i].value
						}
					}
				}
			}
			else
			{
				frm = this.layer.document.forms[0]
				if (this.edit == "date")
					retval = formjsDate(frm.elements[0].value)
				else if (frm.elements[0].type == "text")
					retval = escape(frm.elements[0].value)
				else if (frm.elements[0].type == "radio")
					retval = escape(getCheckedValue(frm.elements))
				else
					retval = escape(frm.elements[0].options[frm.elements[0].selectedIndex].value)
			}
		}
	}
	return retval
}

function agsValue(isKey,fc_val)
{
	var retval = ""
	if (this.edit == "FC")
		return retval

	if (start_array != null)
	{
		for (var i = 0;i < start_array.length;i++)
		{
			if (start_array[i].kfn.length > 3)
			{
				if (start_array[i].kfn == this.ags_name)
				{
					retval = start_array[i].value
					break
				}
			}
			else
			{
				if (start_array[i].kfn == this.kfn || start_array[i].kfn == this.skfn)
				{
					retval = start_array[i].value
					break
				}
			}
		}
		if (retval != "")
			return retval
	}
	if ((this.selected && this.type == "Out" &&
		(this.orig_type == "Key" || fc_val == "+" || fc_val == "-") && this.constant == "")
	||  (this.type == "Hidden" && !isKey) || this.hidden)
	{
		if (this.edit == "date")
			retval = formjsDate(this.value)
		else
			retval = escape(this.value)
	}
	else if (this.selected && this.type == "Out" &&
		this.orig_type == "Key" && this.constant != "")
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
		else if (this.constant.charAt(0) == "$")
			retval = escape(getWebuserValue(this.constant))
		else
			retval = escape(this.constant)
	}
	else if ((this.selected || this.constant != "") && this.type != "Out")
	{
		if (this.constant != "" && !this.selected)
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
			else if (this.constant.charAt(0) == "$")
				retval = escape(getWebuserValue(this.constant))
			else
				retval = escape(this.constant)
		}
		else
		{
			if (isIE)
			{
				var elm = self.CANVAS.document.forms[0].elements[this.ags_name]
				if (elm)
				{
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
					else if (elm.type == "text")
						retval = elm.value
					else if (elm.type == "select-one")
						retval = elm.options[elm.selectedIndex].value
					else
					{
						for (var i = 0;i < elm.length;i++)
						{
							if (elm[i].checked)
								retval = elm[i].value
						}
					}
					if (NonSpace(retval) == 0)
						retval = " "
					retval = escape(retval)
				}
			}
			else
			{
				frm = this.layer.document.forms[0]
				if (this.edit == "date")
				{
					if (this.dft_val == "CTD" && frm.elements[0].value == "")
					{
						tmp = {value:"T"}
						if (ValidDate(tmp))
							retval = formjsDate(tmp.value)
					}
					else
						retval = formjsDate(frm.elements[0].value)
				}
				else if (frm.elements[0].type == "text")
					retval = frm.elements[0].value
				else if (frm.elements[0].type == "radio")
					retval = getCheckedValue(frm.elements)
				else
					retval = frm.elements[0].options[frm.elements[0].selectedIndex].value
				if (NonSpace(retval) == 0)
					retval = " "
				retval = escape(retval)
			}
		}
	}
	if (this.dec != 0 && retval.charAt(0) == ".")
		retval = "0" + retval
	return retval
}

function batchValue()
{
	var retval = ""
	if (this.edit == "FC")
		return retval

	if (this.selected && this.type != "Out")
	{
		if (isIE)
		{
			var elm = self.CANVAS.document.forms[0].elements[this.ags_name]
			if (this.edit == "date")
				retval = formjsDate(elm.value)
			else if (elm.type == "text")
				retval = fmtBatchVal(this,elm.value)
			else if (elm.type == "select-one")
				retval = fmtBatchVal(this,elm.options[elm.selectedIndex].value)
			else
			{
				for (var i = 0;i < elm.length;i++)
				{
					if (elm[i].checked)
						retval = fmtBatchVal(this,elm[i].value)
				}
			}
		}
		else
		{
			frm = this.layer.document.forms[0]
			if (this.edit == "date")
				retval = formjsDate(frm.elements[0].value)
			else if (frm.elements[0].type == "text")
				retval = fmtBatchVal(this,frm.elements[0].value)
			else if (frm.elements[0].type == "radio")
				retval = fmtBatchVal(this,getCheckedValue(frm.elements))
			else
				retval = fmtBatchVal(this,frm.elements[0].options[frm.elements[0].selectedIndex].value)
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
		else if (this.constant.charAt(0) == "$")
			retval = fmtBatchVal(this,getWebuserValue(this.constant))
		else
			retval = fmtBatchVal(this,this.constant)
	}
	else
		retval = fmtBatchVal(this,this.dft_val)

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

	return retval
}

// End Field Object Stuff



function showHelp()
{
	if (currentObject == null)
		return

	var ags_name = currentObject.ags_name
	if (currentObject.dtl_area)
	{
		if (currentObject.base != 0)
			ags_name = frm_fields[currentObject.base].ags_name
		ags_name = ags_name.substring(0,ags_name.length - 1)
	}
	var url = "/cgi-lawson/objprop?" + prodline + "&" + token
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
	var url = "/cgi-lawson/objprop?" + prodline + "&" + token
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

function doSelect(lnk,idx,type)
{
	drillType = type
	currentObject = frm_fields[idx]
	if (isIE)
		currentField =  self.CANVAS.document.forms[0].elements[currentObject.ags_name]
	else
		currentLayer = currentObject.layer
	valList_select = false
	ida_string = ""
	for (var i = 0;i < frm_fields.length;i++)
	{
		if (frm_fields[i].dtl_area)
		{
			var val = frm_fields[i].idaValue()
			if (val != "")
				ida_string += "&" + frm_fields[i].kfn + "=" + val
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
	if (form_type == "BATCH")
	{
		runBatch(fc)
		return
	}

	var agscall = "/cgi-lawson/ags?_EVT="
	var isKey = isKeyFc(fc_val)
	if (isKey)
		agscall += "CHG"
	else
		agscall += "ADD"
	if (prodline != "")
		agscall += "&_PDL=" + prodline
	agscall += "&_RTN=DATA&_TDS=Ignore&_VFMT=TRUE&_TKN=" + token + "&_LFN=TRUE&FC=" + fc
//			+ "&_MSGTARGET=top.lawheader"
	var line_fc = new Array()
	var lfc_cnt = 0
	line_fc[0] = ""
	for (var i = 0;i < frm_fields.length;i++)
	{
		frm_fields[i].returned = false
		var val = frm_fields[i].agsValue(isKey,fc_val)
		if (frm_fields[i].name.substring(0,7) == "LINE_FC")
		{
			if ((!isKey && !isDataFc(fc_val,"",false)) || frm_fields[i].ln_nbr > vis_dtl_lines)
				val = ""
			if (val != "")
				line_fc[++lfc_cnt] = val
		}
		if (val == "" && (isLaddFc(line_fc[frm_fields[i].ln_nbr]) && frm_fields[i].dtl_area))
			val = "%20"
		if (val != "")
			agscall += "&" + (frm_fields[i].ags_name == "TC" ? frm_fields[i].fldnbr : frm_fields[i].ags_name)
				    + "=" + val
		if ((NonSpace(val) == 0 || val == "%20") && frm_fields[i].req_fld &&
		    isDataFc(fc_val,line_fc[frm_fields[i].ln_nbr],frm_fields[i].dtl_area))
		{
			if (frm_fields[i].ln_nbr > vis_dtl_lines)
				continue
			reqFieldError(frm_fields[i])
			return
		}
	}
//	if (hk_val != "" && !isKey && detailscreen)
	if (hk_val != "" && (fc_val == "+" || fc_val == "-"))
		agscall += "&" + hk_name + "=" + escape(hk_val)
	agscall += "&_EOT=TRUE"
	frm_running = true
	init_done = false
	next_error = false
	run_fc = fc
	run_fc_val = fc_val
	hk_val = ""
	start_array = null
	self.jsreturn.location.replace(agscall)
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

function reqFieldError(fld)
{
	if (fld.base != 0)
		var label = frm_fields[fld.base].label
	else
		var label = fld.label

	if (fld.selected)
	{
		msg = label + " is required"
		setCursor(fld.fldnbr,true)
	}
	else
		msg = "Must include " + label + " on form or assign a constant value"
//	alert(msg)
	if (msgBlock != null)
	{
		msgBlock.content = msg
		msgBlock.writeContent()
		if (isIE)
			msgBlock.layer.style.visibility = "visible"
		else
			msgBlock.layer.hidden = false
	}
	else
		alert(msg)
}

function setExitValues()
{
	for (var i = 0;i < frm_fields.length;i++)
	{
		if (frm_fields[i].edit != "FC")
			frm_fields[i].value = unescape(frm_fields[i].agsValue(false))
	}
}

function runBatch(fc)
{
	if (fc != "Run")
		return

	var batchcall = "/cgi-lawson/jaynarun?" + authUser.webuser
				  + "&" + prodline + "&" + token + "&%22"
	for (var i = 0;i < frm_fields.length;i++)
	{
		batchcall += frm_fields[i].batchValue()
	}
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
}

function fmtBatchVal(fld,str)
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
	var nbr_zeros = fld.size - nstr.length
	if (fld.edit == "date")
		nbr_zeros = 8
	if (fld.edit == "numeric" || fld.edit == "date")
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
		monWin = window.open("/cgi-lawson/jobschd?","monitor","height=" + height + ",width=" + width + ",left=" + x + ",top=" + y + ",resizable,scrollbars,menubar")
	}
	else
	{
		var width = self.innerWidth - 20
		var height = self.outerHeight - 200
		monWin = window.open("/cgi-lawson/jobschd?","monitor","innerHeight=" + height + ",innerWidth=" + width + ",screenX=" + x + ",screenY=" + y + ",resizable,scrollbars,menubar")
	}
	monWin.focus()
}

function agsFieldName(str)
{
	nstr = ""
	for (var i = 0;i < str.length;i++)
	{
		if (str.charAt(i) == "_")
			nstr += "-"
		else
			nstr += str.charAt(i)
	}
	return nstr
}

function initForm()
{
	for (var i = 0;i < frm_fields.length;i++)
	{
		frm_fields[i].initField()
	}
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

	var n = ags_ary[agsname]
	var fld = frm_fields[n]
	if (typeof fld == "undefined")
		return

	if (isIE)
	{
		var elm = null
		if (fld.selected && fld.type != "Out")
			elm = self.CANVAS.document.forms[0].elements[fld.ags_name]
	}
	else
	{
		var frm = null
		if (fld.layer)
		{
			if (fld.layer.document.forms[0])
				frm = fld.layer.document.forms[0]
		}
	}
	if (!fld.returned)
	{
		fld.returned = true
		fld.value = fmtValue(fld,value)
		if (!fld.selected && fld.constant.charAt(0) == "$" &&
			fld.orig_type == "Key" &&
			!verifyWebuserValue(fld.constant,fld.value))
		{
			fld.value = ""
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
		if (isIE && elm != null)
		{
			if (elm.type == "text")
				elm.value = fld.value
			else if (elm.type == "select-one")
				elm.selectedIndex = getIndex(elm,fld.value)
			else
				setCheckedValue(elm,fld.value)
		}
		else if (isNav && frm != null)
		{
			elm = frm.elements[0]
			if (elm.type == "text")
				elm.value = fld.value
			if (elm.type == "select-one")
				elm.selectedIndex = getIndex(elm,fld.value)
			if (elm.type == "radio")
				setCheckedValue(frm.elements,fld.value)
		}
		else if (fld.layer)
			fld.writeContent()
	}
}

function fmtValue(fld,value)
{
	var retval = value

	if ((this.edit == "signed" || this.edit == "numeric") && Number(value) == 0)
		retval = ""
	if (fld.edit == "date")
		retval = value.substring(4,6) + "/"
			   + value.substring(6,8) + "/"
			   + value.substring(0,4)

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
		if (!doRule(run_fc_val))
			doExit(run_fc)
	}
}

function clearCache()
{
	self.jsreturn.document.write("<html></html>")
	self.jsreturn.document.close()
}

function setCursor(fldnbr,error)
{
	if (fldnbr == "_f0" || fldnbr == "_f1")
		return

	var lyr = null
	var selected = false
	var fld = frm_fields[fldnbr_ary[fldnbr]]
	if (fld.type != "Out" && !fld.hidden)
	{
		selected = fld.selected
		lyr = fld.layer
		if (!lyr)
			return
		if (isIE)
		{
			if (self.CANVAS.document.forms[0].elements[fld.ags_name])
				self.CANVAS.document.forms[0].elements[fld.ags_name].focus()
		}
		else
		{
			if (lyr.document.forms[0])
			{
				if (lyr.document.forms[0].elements[0])
					lyr.document.forms[0].elements[0].focus()
			}
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
	}
}

function getFieldName(fldnbr)
{
	var retval = ""
	if (fldnbr == "_f0" || fldnbr == "_f1")
		return retval

	var fld = frm_fields[fldnbr_ary[fldnbr]]
	retval += ' - '
	if (fld.base != 0)
		retval += frm_fields[fld.base].label
	else
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

function getLinkDecor(O)
{
	var retval = ""
	if (O.l_color != "")
	{
		retval += ' link=' + O.l_color
			   + ' alink=' + O.l_color
			   + ' vlink=' + O.l_color
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

function nextField(idx)
{
	var cur_pos = frm_fields[idx].tab_order
	var beg_fld = null
	var next_fld = null
	for (var i = 0;i < frm_fields.length;i++)
	{
		if (frm_fields[i].selected)
		{
			if (frm_fields[i].tab_order == 1)
				beg_fld = frm_fields[i]
			if (frm_fields[i].tab_order > cur_pos)
			{
				if (next_fld == null)
					next_fld = frm_fields[i]
				else if (frm_fields[i].tab_order < next_fld.tab_order &&
						 frm_fields[i].tab_order != 0)
					next_fld = frm_fields[i]
			}
		}
	}
	if (next_fld != null)
		next_fld.layer.document.forms[0].elements[0].focus()
	else if (beg_fld != null)
		beg_fld.layer.document.forms[0].elements[0].focus()
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
		if (frm_fields[i].selected)
		{
			var lyr = frm_fields[i].layer
			if (lyr.offsetTop <= y && (lyr.offsetTop + lyr.offsetHeight) >= y &&
				lyr.offsetLeft <= x && (lyr.offsetLeft + lyr.offsetWidth) >= x)
			{
				currentObject = frm_fields[i]
				break
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
		if (frm_fields[i].selected)
		{
			var lyr = frm_fields[i].layer
			if (lyr.top <= y && (lyr.top + lyr.clip.bottom) >= y &&
				lyr.left <= x && (lyr.left + lyr.clip.right) >= x)
			{
				currentObject = frm_fields[i]
				break
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
	moved = false
	Decor_Object.current=this;
	this.offX = e.pageX-this.pageX;
	this.offY = e.pageY-this.pageY;
	window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
	this.savemousemove = window.onmousemove;
	this.savemouseup = window.onmouseup;
	window.onmousemove = mdrag;
	window.onmouseup = mup;
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
	window.onmousemove = that.savemousemove;
	window.onmouseup = that.savemouseup;
	var mask = 0;
	if (!window.onmousemove) mask|=Event.MOUSEMOVE;
	if (!window.onmouseup)	 mask|=Event.MOUSEUP;
	window.releaseEvents(mask);
	if (that.ref.ondrop && moved)
	  that.ref.ondrop(that.ref);
	moved = false
	return true;
}

function checkForms(e)
{
	if (e.target.name == "numeric")
	{
		if ((e.which < 48 || e.which > 57) && e.which != 46 && e.which != 8)
		{
			alert("Field is numeric")
			return false
		}
	}
	if (e.target.name == "signed")
	{
		if ((e.which < 48 || e.which > 57) && e.which != 45 && e.which != 46 && e.which != 8)
		{
			alert("Field is numeric")
			return false
		}
	}
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

function fmtNumericOutput(fld)
{
	fld.value = "" + fld.value
	if (fld.value.length == 0)
		return ""
	var neg = false
	if (fld.value.charAt(fld.value.length - 1) == "-")
		neg = true

/*
	var dec_idx = fld.value.indexOf(".")
	var whole = fld.value
	var decimal = ""
	if (dec_idx != -1)
	{
		whole = fld.value.substring(0,dec_idx)
		if (neg)
			decimal = fld.value.substring(dec_idx + 1,fld.value.length - 1)
		else
			decimal = fld.value.substring(dec_idx + 1,fld.value.length)
	}
	var str = ""
	if (whole.length > 3)
	{
		var j = whole.length - 1
		var k = 0
		for (var i = j;i >= 0;i--)
		{
			if (k == 3)
			{
				str = "," + str
				k = 0
			}
			str = whole.charAt(i) + str
			k++
		}
		whole = str
	}
	if (whole.charAt(0) == ",")
		whole = whole.substring(1,whole.length)
*/

	var retval = ""
	if (neg)
	{
		if (neg_red)
			retval += '<font color=red>'
		if (neg_type == "brackets")
			retval += '('
	}

//	retval += whole
//	if (dec_idx != -1)
//		retval += "." + decimal

	if (neg)
		retval += fld.value.substring(0,fld.value.length-1)
	else
		retval += fld.value

	if (neg)
	{
		if (neg_type == "sign")
			retval += "-"
		else if (neg_type == "credit")
			retval += "CR"
		else if (neg_type == "brackets")
			retval += ")"
		if (neg_red)
			retval += '</font>'
	}
	return retval
}

function doDateSelect(n)
{
	if (isIE)
	{
		var fld = frm_fields[n]
		dateField = self.CANVAS.document.forms[0].elements[fld.ags_name]
		calWin = window.open('/lawson/forms/calendar.html','cal','WIDTH=200,HEIGHT=250,left=' + mouseX + ',top=' + mouseY)
	}
	else
	{
		dateField = frm_fields[n].layer.document.forms[0].elements[0]
		calWin = window.open('/lawson/forms/calendar.html','cal','WIDTH=200,HEIGHT=250,screenX=' + mouseX + ',screenY=' + mouseY)
	}
	calWin.focus()
}

function ReturnSelect(value)
{
	if (isIE)
		currentField.value = stripTrailingSpaces(stripLeadingSpaces(unescape(value)))
	else
		currentLayer.document.forms[0].elements[0].value = stripTrailingSpaces(stripLeadingSpaces(unescape(value)))
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
		window.captureEvents(Event.KEYPRESS)
		window.onKeyPress = checkForms
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
		setValue(start_array[i].kfn,start_array[i].value)
}

function setValue(kfn,value)
{
	for (var i = 0;i < frm_fields.length;i++)
	{
		var fld = frm_fields[i]
		if  (fld.layer != null &&
		   ((kfn.length > 3 && kfn == fld.ags_name) ||
		    (kfn.length <= 3 && (kfn == fld.kfn || kfn == fld.skfn))))
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

