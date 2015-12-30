// Version: 8-)@(#)@10.00.05.00.12
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/fica.js,v 1.3.6.9 2014/02/17 16:30:21 brentd Exp $
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
//*   (c) COPYRIGHT 2014 INFOR.  ALL RIGHTS RESERVED.           *
//*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//*                                                             *
//***************************************************************
function GetFicaErrMsg(obj)
{
   if (typeof(obj) == "string")
   		ctry = obj;
   else
   {		
		if (typeof(obj) == "undefined") 
			ctry = "  ";
		else
		{	
   			ctry = obj.country_code;
   			if (NonSpace(ctry) == 0)
			{
   	   			ctry = obj.employee_work_country;
				if (NonSpace(ctry) == 0)
					ctry = obj.employee_country_code;
			}			
		}			      
   }	

   var msg;
   if (ctry == "BL" || ctry == "BE")
	   msg = getSeaPhrase("DEP_12","ESS");
   else
   {
   	  switch (ctry)
	  {
	  	  case "CA":
	  		  msg = getSeaPhrase("DEP_13","ESS"); break;
		  case "DE":
			  msg = getSeaPhrase("DEP_14","ESS"); break;
		  case "FR":
			  msg = getSeaPhrase("DEP_18","ESS"); break;
		  case "GB":
			  msg = getSeaPhrase("DEP_10","ESS"); break;
		  case "IE":
			  msg = getSeaPhrase("DEP_15","ESS"); break;
		  case "NL":
			  msg = getSeaPhrase("DEP_16","ESS"); break;
		  case "SE":
			  msg = getSeaPhrase("DEP_17","ESS"); break;
		  case "UK":
			  msg = getSeaPhrase("DEP_9","ESS"); break;
		  case "US":
			  msg = getSeaPhrase("DEP_11","ESS"); break;
		  default:  	
			  msg = getSeaPhrase("DEP_19","ESS"); break;														 		
	  }
   }	  
   return msg;
}

function CheckSIN(ssn)
{
	ssn = '' + ssn;
	ssn = ssn.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	ssn = ssn.replace(/\-/g, '').replace(/\s/g, '');
	if (ssn.length != 9)
		return false;
    var sum = 0;
    for (var i=0; i<9; i++)
    {
    	if (i%2 == 0)
    		sum += Number(ssn.substring(i,i+1));
    	else
    	{
    	    var nbr = Number(ssn.substring(i,i+1)) * 2;
    	    if (nbr > 9) 
    	    	nbr = nbr - 9;    		
    		sum += nbr;
    	}	
    }
    return ((sum % 10) == 0);
}

function ValidSSN(obj, ctry)
{
	ctry = ctry || "";
	var re = null;
	switch (ctry)
	{
		case "US": re = /^(\d{3})([ \-]?)(\d{2})\2(\d{4})$/; break;
		case "CA": re = /^(\d{3})([ \-]?)(\d{3})\2(\d{3})$/; break;
	}
	//don't validate if we don't have a country code
	if (re == null)
		return true;
	var retVal = true;
	var ssn = obj.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	obj.value = ssn;
	if (ssn == "" || !re.test(ssn))
		retVal = false;
	else
	{
		if (ctry == "US")
		{	
			if (ssn.indexOf(" ") == -1 && ssn.indexOf("-") == -1)
				obj.value = ssn.substring(0,3) + "-" + ssn.substring(3,5) + "-" + ssn.substring(5,9);
		}
		else if (ctry == "CA")
		{
			if (ssn.indexOf(" ") == -1 && ssn.indexOf("-") == -1)
				obj.value = ssn.substring(0,3) + "-" + ssn.substring(3,6) + "-" + ssn.substring(6,9);
			retVal = CheckSIN(ssn);	
		}
	}
	return retVal;
}
