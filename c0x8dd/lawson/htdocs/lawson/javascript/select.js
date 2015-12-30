//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/select.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $
function getSelectedText(theSelect,nullValue) {
// geared for only one selction via click
	var ret=false
	if (theSelect && theSelect.length) {
	        for (var i=0; (i<theSelect.length) && (!ret); i++) {
				if (theSelect.options[i].selected) {
					var text=theSelect.options[i].text
				   	if (text!=null && ((!theSelect.separator) || (text != theSelect.separator)))
						ret=text
				}
			}
	} else
		if (window.dMessage)
			dMessage('Error in getSelectedText, theSelect=null.')
	if ((ret==false) && (nullValue!=null))
		ret=nullValue
	return ret
}

function getSelectedValue(theSelect,nullValue) {
// geared for only one selection via click
	var ret=false
	if (!theSelect) {
		alert("getSelectedValue, bad select with value="+theSelect)
		return
	}
	if (theSelect && theSelect.length) {
        for (var i=0; (i<theSelect.length) && (!ret); i++) {
			if (theSelect.options[i].selected) {
			   	var value=theSelect.options[i].value
			   	if (value!=null && ((!theSelect.separator) || (value != theSelect.separator)))
					ret=value
			}
		}
	}
	if ((ret==false) && (nullValue!=null))
		ret=nullValue
	return ret
}

function selectByValue(theSelect,theValue) {
	var ret=false
	if (theSelect && theSelect.length) {
		var optionValue=''
		for (var i=0; ( (i<theSelect.length) && (!ret) ); i++) {
			optionValue=theSelect.options[i].value
			if ((optionValue+"")==(theValue+"")) {
				theSelect.options[i].selected=true
				ret=true
			} else
				theSelect.options[i].selected=false
		}
	} else
		if (window.dMessage)
			dMessage('Error in selectByValue, theSelect=null.')
	return ret
}

function selectByText(theSelect,theText) {
	var ret=false
	if (theSelect && theSelect.length) {
		var optionText=''
		for (var i=0; ( (i<theSelect.length) && (!ret) ); i++) {
			optionText=theSelect.options[i].text
			if ((optionText+"")==(theText+"")) {
				theSelect.options[i].selected=true
				ret=true
			} else
				theSelect.options[i].selected=false
		}
	} else
		if (window.dMessage)
			dMessage('Error in selectByText, theSelect=null.')
	return ret
}
