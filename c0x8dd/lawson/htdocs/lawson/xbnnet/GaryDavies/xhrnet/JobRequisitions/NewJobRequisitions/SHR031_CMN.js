// Version: 8-)@(#)@(201111) 09.00.01.06.00
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/JobRequisitions/NewJobRequisitions/SHR031_CMN.js,v 1.6 2003/07/23 17:13:43 brentd Exp $
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




