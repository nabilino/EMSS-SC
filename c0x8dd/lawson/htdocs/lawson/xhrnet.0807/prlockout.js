function isPRLockedOut(ruleType, company, employee)
{
	if (!ruleType || !company || !employee)
		return false;	
	
	var tranObj = null;
	var techVersion = null;
	var httpRequest = null;
	try
	{
		techVersion = (iosHandler && iosHandler.getIOSVersionNumber() >= "09.00.00") ? TransactionObject.TECHNOLOGY_900 : TransactionObject.TECHNOLOGY_803;
		httpRequest = (typeof(SSORequest) == "function") ? SSORequest : SEARequest;
		tranObj = new TransactionObject(window, techVersion, httpRequest, null);	
		if ((typeof(authUser) == "undefined" || authUser == null) && typeof(window["findAuthWnd"]) != "undefined")
		{
			var userWnd = findAuthWnd(true);
			if (userWnd && userWnd.authUser)
				authUser = userWnd.authUser;
			else
				return false;
		}	
	}
	catch(e)
	{
		return false;
	}	
	
	tranObj.setEncoding(authUser.encoding);
	tranObj.setParameter("_PDL", authUser.prodline);
	tranObj.setParameter("_TKN", "HS18.2");
	tranObj.setParameter("FC", "I");
	tranObj.setParameter("_LFN", "TRUE");
	tranObj.setParameter("_EVT", "ADD");
	tranObj.setParameter("_RTN", "DATA");
	tranObj.setParameter("_TDS", "Ignore");
	if (techVersion == TransactionObject.TECHNOLOGY_900)
		tranObj.setParameter("_DTLROWS", "FALSE");
	tranObj.setParameter("COMPANY", Number(company));
	tranObj.setParameter("EMPLOYEE", Number(employee));
	tranObj.setParameter("RULE-TYPE", String(ruleType));
	tranObj.showErrors = false;
		
	// only lock out if we get a valid response from HS18.2
	if (tranObj.callTransaction() == null || tranObj.getMsgNbr() == null)
		return false;
	else
		return (Number(tranObj.getMsgNbr()) == 201);
}
