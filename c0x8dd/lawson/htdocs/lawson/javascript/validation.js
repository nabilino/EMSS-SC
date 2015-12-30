//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/validation.js,v 1.2.24.1 2007/02/06 22:08:33 keno Exp $ $Name: REVIEWED_901 $
function checkEmail(myform, fieldname)
{
	checkText(myform, fieldname, "Email Address")

	var obj = myform.elements[fieldname];
	if (obj) {
		i = obj.value.indexOf("@")
		j = obj.value.indexOf(".",i)
		k = obj.value.indexOf(",")
		kk = obj.value.indexOf(" ")
		jj = obj.value.lastIndexOf(".")+1
		len = obj.value.length
	
		if (!((i>0) && (j>(i+1)) && (k==-1) && (kk==-1) && (len-jj >=2) && (len-jj<=3)))
		{
			mystr += "     Valid E-mail  (ex: gemhunter@topaz.com)\n";
			if(myfocus == null) {
				myfocus = obj;
				myfocustype = "text";
			}
		}
	} else 
		alert("In checkEmail, element not found: form="+myform+", fieldname="+fieldname+", fieldlabel="+fieldlabel)
}

function checkSelectText(myform, fieldname, fieldlabel)
{
	var obj = myform.elements[fieldname];
	if (obj) {
		if((obj.selectedIndex<0) || obj.options[obj.selectedIndex].text == "")
		{
			mystr += "     " + fieldlabel + "\n";
			if(myfocus == null) {
				myfocus = myform.elements[fieldname];
				myfocustype = "select";
			}
		}
	} else 
		alert("In checkSelectText, element not found: form="+myform+", fieldname="+fieldname+", fieldlabel="+fieldlabel)
}

function checkSelectValue(myform, fieldname, fieldlabel)
{
	var obj = myform.elements[fieldname];
	if (obj) {
		if((obj.selectedIndex<0) || obj.options[obj.selectedIndex].value == "")
		{
			mystr += "     " + fieldlabel + "\n";
			if(myfocus == null) {
				myfocus = obj;
				myfocustype = "select";
			}
		}
	} else 
		alert("In checkSelectText, element not found: form="+myform+", fieldname="+fieldname+", fieldlabel="+fieldlabel)
}


function checkRadio(myform, fieldname, fieldlabel)
{
	var obj = myform.elements[fieldname];
	if (obj) {
		var foundChecked = false;
		for(i=0; i<obj.length && !foundChecked; i++)
			if(obj[i].checked)
				foundChecked = true;
		if(!foundChecked)
		{
			mystr += "     " + fieldlabel + "\n";
			if(myfocus == null) {
				myfocus = obj;
				myfocustype = "radio";
			}
		}
	} else 
		alert("In checkRadio, element not found: form="+myform+", fieldname="+fieldname+", fieldlabel="+fieldlabel)
}

function checkText(myform, fieldname, fieldlabel)
{
	var obj = myform.elements[fieldname];
	if (obj) {
		if(obj.value == "")
		{
			mystr += "     " + fieldlabel + "\n";
			if(myfocus == null) {
				myfocus = obj;
				myfocustype = "text";
			}
		}
	} else 
		alert("In checkText, element not found: form="+myform+", fieldname="+fieldname+", fieldlabel="+fieldlabel)
}

function checkURL(myform, fieldname, fieldlabel)
{
	var obj = myform.elements[fieldname];
	if (obj) {
		var v = obj.value
		var i = v.indexOf("://")
		var len = v.length
		
		if ( (i<0) || (len-(i+3)<=0) )
		{
			mystr += "     Valid URL for "+fieldlabel+"\n"
			if(myfocus == null) {
				myfocus = obj;
				myfocustype = "text";
			}
		}
	} else 
		alert("In checkURL, element not found: form="+myform+", fieldname="+fieldname+", fieldlabel="+fieldlabel)
}

function checkName(myform, fieldname, fieldlabel)
{
	checkText(myform, fieldname, fieldlabel)
	
	var obj = myform.elements[fieldname];
	if (obj) {
		var anID = myform.elements[fieldname].value;
		anID = anID.replace(/[\']/g,'');
		anID = anID.replace(/[ ]/g,'');
		anID = anID.replace(/[-]/g,'');
		var newID = anID.replace(/[\W.]/g,'');
		if(anID != newID) {
			mystr += "     " + fieldlabel + " (inacceptable characters/symbols - use letters and numbers)\n";
			if(myfocus == null) {
				myfocus = myform.elements[fieldname];
				myfocustype = "text";
			}
		}
	} else 
		alert("In checkName, element not found: form="+myform+", fieldname="+fieldname+", fieldlabel="+fieldlabel)
}

function checkID(myform, fieldname, fieldlabel, maxlength)
{
	checkText(myform, fieldname, fieldlabel)
	
	var obj = myform.elements[fieldname];
	if (obj) {
		var anID = myform.elements[fieldname].value;
		if (maxlength && anID && anID.length>maxlength) {
			mystr += "     " + fieldlabel + " (id is too long)\n";
			if(myfocus == null) {
				myfocus = myform.elements[fieldname];
				myfocustype = "text";
			}
		}
		
		var newID = anID.replace(/[^\w\d\\._]/g,''); // DPB PT 79672
		if(anID != newID) {
			mystr += "     " + fieldlabel + " (inacceptable characters/symbols - use letters and numbers)\n";
			if(myfocus == null) {
				myfocus = myform.elements[fieldname];
				myfocustype = "text";
			}
		}
	} else 
		alert("In checkID, element not found: form="+myform+", fieldname="+fieldname+", fieldlabel="+fieldlabel)
}

function checkCreditCard4(myform, cardfieldname, cardfieldname1, cardfieldname2, cardfieldname3, cardfieldname4, fieldlabel)
{
	// check credit card text fields for completeness
	checkSelectText(myform, "billing_payment_method","Credit Card Type");
	checkText(myform, "billing_credit_card1","Credit Card Number");
	checkText(myform, "billing_credit_card2","Credit Card Number");
	checkText(myform, "billing_credit_card3","Credit Card Number");
	checkText(myform, "billing_credit_card4","Credit Card Number");
	
	var obj = myform.elements[fieldname];
	if (obj) {
		var cc_typeObj = myform.elements[cardfieldname];
		var cc_type=cc_typeObj.options[cc_typeObj.selectedIndex].value
		var cc1 = myform.elements[cardfieldname1].value;
		var cc2 = myform.elements[cardfieldname2].value;
		var cc3 = myform.elements[cardfieldname3].value;
		var cc4 = myform.elements[cardfieldname4].value;
		
		// check credit card digitset length
		if(cc1.length!=4)
		{
			mystr += "     Credit Card Number\n";
			if(myfocus == null) {
				myfocus = myform.elements[cardfieldname1];
				myfocustype = "text";
			}
			return
		}
		if(cc2.length!=4)
		{
			mystr += "     Credit Card Number\n";
			if(myfocus == null) {
				myfocus = myform.elements[cardfieldname2];
				myfocustype = "text";
			}
			return
		}
		if(cc3.length!=4)
		{
			mystr += "     Credit Card Number\n";
			if(myfocus == null) {
				myfocus = myform.elements[cardfieldname3];
				myfocustype = "text";
			}
			return
		}
		if(cc4.length!=4)
		{
			mystr += "     Credit Card Number\n";
			if(myfocus == null) {
				myfocus = myform.elements[cardfieldname4];
				myfocustype = "text";
			}
			return
		}
		
		// check credit card value vs. type
		var cc_nbr = cc1+""+cc2+""+cc3+""+cc4;
		if (!checkCard(cc_nbr,cc_type))
		{
			mystr += "     Credit Card Number\n";
			if(myfocus == null) {
				myfocus = myform.elements[cardfieldname1];
				myfocustype = "text";
			}
			return
		}
	} else 
		alert("In checkCreditCard4, element not found: form="+myform+", fieldname="+fieldname+", fieldlabel="+fieldlabel)
}

function checkNoHTMLText(myform, fieldname, fieldlabel)
{
	var obj = myform.elements[fieldname];
	if (obj) {
		var v=myform.elements[fieldname].value
		if ( v!="" )
		{
			var i = v.indexOf("<")
			if (i>-1)
			{
				mystr += "     No HTML tags allowed in "+fieldlabel+"\n";
				if(myfocus == null) {
					myfocus = myform.elements[fieldname];
					myfocustype = "text";
				}
			}
		}
	} else 
		alert("In checkNoHTMLText, element not found: form="+myform+", fieldname="+fieldname+", fieldlabel="+fieldlabel)
}
