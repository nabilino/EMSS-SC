//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
/* Checkbox:
	new Checkbox(x, y, html_when_unselected, html_when_selected)
	checkbox.checked;
	checkbox.layer;
	checkbox.onchange(checkbox);
	checkbox.onmove(checkbox);
*/

lastClicked = -1
lastChecked = null

Checkbox.setOn=function () {
  var ca=this.document.layers.ca;
  var cb=this.document.layers.cb;
  ca.visibility = "hide"
  cb.visibility = "inherit"
  this.ref.checked=true
}

Checkbox.setOff=function () {
  var ca=this.document.layers.ca;
  var cb=this.document.layers.cb;
  ca.visibility = "inherit"
  cb.visibility = "hide"
  this.ref.checked=false
}

Checkbox.mdown=function (e) {
	var ref=this.ref;
	var ca=this.document.layers.ca;
	var cb=this.document.layers.cb;
	if (e.which == 3)
	{
	  	ref.showOptions(ref.fld)
		return false
	}
	if (ref.fld.dtl_area && !dtl_loaded)
		return false
	var currentClicked = -1
	var currentChecked = null
	for (var i = 0;i < this.parentLayer.layers.length;i++)
	{
		if (this.parentLayer.layers[i] == this)
		{
			currentClicked = i
			currentChecked = this.parentLayer.layers[i].ref.checked
			break
		}
	}
	if (e.modifiers != 4 || lastClicked == -1 || currentChecked == lastChecked || ref.fld.dtl_area)
	{
		ca.hidden=!ca.hidden;
		cb.hidden=!cb.hidden;
		ref.checked=!ref.checked;
		ref.onchange(ref)
	}
	else
	{
		if (lastClicked > currentClicked)
		{
			var beg = currentClicked
			var end = lastClicked
		}
		else
		{
			var beg = lastClicked
			var end = currentClicked
		}
		if (beg >= 0 && end >= 0)
		{
			for (var i = beg;i <= end;i++)
			{
				var ref=this.parentLayer.layers[i].ref
				var ca=this.parentLayer.layers[i].document.layers.ca
				var cb=this.parentLayer.layers[i].document.layers.cb
				if (ref.checked == currentChecked)
				{
					ca.hidden=!ca.hidden
					cb.hidden=!cb.hidden
					ref.checked=!ref.checked
					ref.onchange(ref)
				}
			}
		}
	}
	lastClicked = currentClicked
	lastChecked = !currentChecked
	return false
}

Checkbox.mmove=function () {
  if (this.ref.onmove)
     this.ref.onmove(this.ref);
   return false;
}

function Checkbox(lyr,fld,html1,html2) {
  var s="<layer name=checkbox visibility=inherit>"+
		" <layer name=ca visibility=inherit>"+html1+"</layer>"+
		" <layer name=cb visibility=hide>"+html2+"</layer></layer><br>";
  lyr.document.write(s);
  var c=lyr.document.layers.checkbox
  var ca=c.document.layers.ca;
  var cb=c.document.layers.cb;
  c.clip.width = 180
  ca.clip.width = c.clip.width
  cb.clip.width = c.clip.width
  c.captureEvents(Event.MOUSEDOWN|Event.MOUSEMOVE);
  c.onmousedown=Checkbox.mdown;
  c.onmousemove=Checkbox.mmove;
  c.setOn=Checkbox.setOn;
  c.setOff=Checkbox.setOff;
  c.ref=this;
  this.layer=c;
  this.checked=false;
  this.fld = fld
  this.onchange = paintLayer
  this.showOptions = showOptions
}

