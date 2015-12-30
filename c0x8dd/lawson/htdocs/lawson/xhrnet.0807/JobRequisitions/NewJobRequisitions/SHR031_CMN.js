// Version: 8-)@(#)@10.00.02.00.29
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/JobRequisitions/NewJobRequisitions/SHR031_CMN.js,v 1.6.2.3 2012/06/29 17:24:25 brentd Exp $
//***************************************************************
//*                                                             *
//*                           NOTICE                            *
//*                                                             *
//*   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
//*   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
//*   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
//*   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
//*   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
//*   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
//*   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
//*                                                             *
//*   (c) COPYRIGHT 2012 INFOR.  ALL RIGHTS RESERVED.           *
//*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//*                                                             *
//***************************************************************
function IsValidNumber(formObj)
{
	clearRequiredField(formObj);

	if(isNaN(Number(formObj.value)))
	{
		setRequiredField(formObj);
		MsgBox(getSeaPhrase("ENTER_VALID_NUMBER","ESS"))
		formObj.focus();
		formObj.select();
		return false;
	}
	return true;
}

function ReturnDate(date)
{
	switch(date_fld_name)
	{
		case "dateneeded": 
			self.left.document.forms["newjobreqform"].elements[date_fld_name].value = date;
			break;	
		case "tmpdatebeg": 
			PA42.TemporaryDatesBegin = date;
			self.right.document.forms["newjobreqdtlform"].elements[date_fld_name].value = date;
			break;
		case "tmpdateend": 
			PA42.TemporaryDatesEnd = date;
			self.right.document.forms["newjobreqdtlform"].elements[date_fld_name].value = date;			
			break;
		case "intpostdatebeg": 
			PA42.InternalPostDateStart = date;
			self.right.document.forms["newjobreqdtlform"].elements[date_fld_name].value = date;
			break;
		case "intpostdateend": 
			PA42.InternalPostDateStop = date;
			self.right.document.forms["newjobreqdtlform"].elements[date_fld_name].value = date;			
			break;
		case "extpostdatebeg": 
			PA42.ExternalPostDateStart = date;
			self.right.document.forms["newjobreqdtlform"].elements[date_fld_name].value = date;
			break;
		case "extpostdateend": 
			PA42.ExternalPostDateStop = date;
			self.right.document.forms["newjobreqdtlform"].elements[date_fld_name].value = date;			
			break;			
		default: break;	
	}
}




