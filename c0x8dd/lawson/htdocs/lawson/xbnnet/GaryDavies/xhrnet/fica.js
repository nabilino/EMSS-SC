// Version: 8-)@(#)@(201111) 09.00.01.06.00
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/fica.js,v 1.3.6.1 2008/08/08 20:23:04 brentd Exp $
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
   {
   	msg = getSeaPhrase("DEP_12","ESS");
   }
   else
   {
   	  switch(ctry)
	  {
	  	  case "CA":
		  		msg = getSeaPhrase("DEP_13","ESS");
				break;
		  case "DE":
		    		msg = getSeaPhrase("DEP_14","ESS");
				break;
		  case "FR":
		   		msg = getSeaPhrase("DEP_18","ESS");
				break;
		  case "GB":
		  	    	msg = getSeaPhrase("DEP_10","ESS");
				break;
		  case "IE":
		  	    	msg = getSeaPhrase("DEP_15","ESS");
				break;
		  case "NL":
		  		msg = getSeaPhrase("DEP_16","ESS");
				break;
		  case "SE":
		  		msg = getSeaPhrase("DEP_17","ESS");
				break;
		  case "UK":
		  		msg = getSeaPhrase("DEP_9","ESS");
				break;
		  case "US":
		  		msg = getSeaPhrase("DEP_11","ESS");
				break;
		  default:  	
		  		msg = getSeaPhrase("DEP_19","ESS");
				break;														 		
	  }
   }	  
   return msg;
}

function CheckSSN(ssn)
{
	if(ValidNumber(ssn,ssn.size,ssn.decimal) == false)
   	{
   		if(Applicant)
      			Applicant.seaAlert(getSeaPhrase("INVALID_NO","ESS"));
		else
			seaAlert(getSeaPhrase("INVALID_NO","ESS"));
		ssn.focus();
		ssn.select();
   	}
}

     
