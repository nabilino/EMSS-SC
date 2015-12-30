// Version: 8-)@(#)@10.00.05.00.27
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/xml/enwisen/Attic/enwisenPost.js,v 1.1.2.32.2.1 2014/06/11 19:52:04 brentd Exp $
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
var loginUrl = "";
var tpUserId = "";
var tpPassword = "";
var subscriberName = "";
var secret = "";
var boxSvcName = "enwisen";
var finalReturnPage = "/lawson/xhrnet/xml/enwisen/close.htm";
var dataObj;
var tranObj;
var userObj;
var userGroups = new Array();
var userEligBenefits = new Array();
var emssObjInstance = findEMSSObj(true);
var debugEnwisen = false;
var enwisenData = new Array();
var blackBoxApi = false;
var ssoJsObjInstance = window;
// user values
var userId = "";
var company = "";
var employee = "";
var firstName = "";
var lastName = "";
var date = "";
var key = "";

//-----------------------------------------------------------------------------
// Initialize the form data that will be posted to Enwisen for authentication.
// This retrieves the userid and password for logging in to Enwisen.
//
function form_init()
{		
	// what version of IOS are we running on?
	if (!iosFileInstance || !iosFileInstance.iosHandler || (iosFileInstance.iosHandler.getIOS() == null && !iosFileInstance.iosHandler.calledWhat))
	{
		if (!iosFileInstance)
			iosFileInstance = window;
		if (!iosFileInstance.iosHandler)	
			iosFileInstance.iosHandler = new IOSHandler();
		iosFileInstance.iosHandler.createIOS();
		setTimeout("form_init()", 5);
		return;			
	}
	if (iosFileInstance.iosHandler.getIOS() == null || iosFileInstance.iosHandler.getIOSVersionNumber() == null)
	{
		setTimeout("form_init()", 5);
		return;
	}
	if (iosFileInstance.iosHandler.getIOSVersionNumber() >= "09.00.00")
	{
		if (!iosFileInstance.iosHandler.isSSOFileLoaded())
		{
			iosFileInstance.iosHandler.loadSSOFile();
			setTimeout("form_init()", 5);
			return;
		}
	}
	else
	{
		alert("Error: You must be running Lawson System Foundation version 9.0.0 or newer to access Enwisen.");
		try 
		{ 
			if (opener) 
				self.close(); 
		} 
		catch(e) {}
		return;		
	}
	if (!emssObjInstance)
		emssObjInstance = window;
	// get user profile data	
	getUserProfileData();
	if (!emssObjInstance.emssObj)
	{
		// load emss_config.xml settings.
		emssObjInstance.emssObj = new EMSSShell();
		emssObjInstance.emssObj.configure(userObj.company);		
	}
	if (typeof(SSORequest) == "undefined" || SSORequest == null)
		ssoJsObjInstance = findSSOObj(true);
	if (typeof(ssoJsObjInstance.submitBlackBoxLoginRequest) != "undefined" && ssoJsObjInstance.submitBlackBoxLoginRequest != null)
	{
		blackBoxApi = true;
		initEnwisenData();
		getLawsonEmployeeData();		
		return;
	}
	// get the Enwisen third-party login credentials
	try
	{		
		// for LSF 9.0, get the values from LDAP (black box information)		
		var authObj = new SSOAuthObject();
		var cntType = (userObj.encoding) ? "text/xml; charset=" + userObj.encoding : null;
		var boxDom = SSORequest(authObj.getPrimaryUrl() + "?_action=BLACKBOX&_ssoBBoxName=" + escape(boxSvcName) + "&_out=XML", null, cntType);
		// get the login url
		var nodes = boxDom.getElementsByTagName("LOGIN_URL");
		if (nodes && nodes.length > 0)
			loginUrl = cmnGetElementText(nodes[0]);
		// get the user id
		nodes = boxDom.getElementsByTagName("TPUserId");
		if (nodes && nodes.length > 0)
			tpUserId = cmnGetElementText(nodes[0]);
		// get the password
		nodes = boxDom.getElementsByTagName("TPPassword");
		if (nodes && nodes.length > 0)
			tpPassword = cmnGetElementText(nodes[0]);
		// get the subscriber name
		nodes = boxDom.getElementsByTagName("SubscriberName");
		if (nodes && nodes.length > 0)
			subscriberName = cmnGetElementText(nodes[0]);
		// get the secret
		nodes = boxDom.getElementsByTagName("Secret");
		if (nodes && nodes.length > 0)
			secret = cmnGetElementText(nodes[0]);						
	}
	catch (e)
	{}
	finally
	{
		if (abortLogin([loginUrl, tpUserId, tpPassword, subscriberName]))
			return;
	}
	finishLogin();
}

//-----------------------------------------------------------------------------
// Initialize the form data that will be posted to Enwisen for authentication.
//
function initEnwisenData()
{
	// master Enwisen account
	enwisenData = new Array();
	enwisenData["tpuserid"] = tpUserId;
	enwisenData["tppassword"] = tpPassword;
	enwisenData["subscribername"] = subscriberName;
	// return page
	enwisenData["returnpage"] = self.location.protocol + "//" + self.location.host + "/sso/logout.htm?" + self.location.protocol + "//" + self.location.host + finalReturnPage;
	// form values used to drive user eligibility to specific Enwisen content pages	
	if (emssObjInstance.emssObj.enwisenUserid == "empnbr")
		enwisenData["userid"] = "" + Number(employee);	// employee number
	else	
		enwisenData["userid"] = userId; 	// webuser ID from user profile (LDAP RM ID)	
	setEnwisenKey();
	// these parameters are currently not used (left blank), but may be customized by setting values here
	enwisenData["password"] = "";
	enwisenData["email"] = "";
	enwisenData["location"] = "";
	// set values for new custom parameters here.
	// enwisenData["myparameter"] = "";
	// these contain data from the Lawson HR system and will get set by the getLawsonEmployeeData() function.
	// default values from the user's profile data (Profile servlet)
	enwisenData["firstname"] = firstName; 		// default first and last name values from user profile - set later to the values in the Lawson EMPLOYEE file
	enwisenData["lastname"] = lastName;
	enwisenData["classification"] = "Employee"; // default classification is "Employee" - set later to "Manager" if employee is a supervisor in the Lawson HRSUPER file	
	enwisenData["division"] = company; 			// default company value from user profile
	enwisenData["employeenumber"] = employee;	// default employee number value from user profile
	// list of eligible benefits; example: (pid=HL01)(pid=ELMULT)
	// can optionally also be used to send employee groups; example: (group=UNION)(group=PART-TIME) 
	if (emssObjInstance.emssObj.employeeGroups || emssObjInstance.emssObj.eligibleBenefitPlans)
		enwisenData["rulestring"] = "";
}

function abortLogin(loginAry)
{
	if (blackBoxApi || !loginAry)
		return false;
	else
	{
		for (var i=0; i<loginAry.length; i++)
		{
			if (!loginAry[i])
			{
				alert("Error: Enwisen account information is needed. Please verify that the enwisen.xml black box settings are defined and loaded in the Lawson environment.");			
				return true; 
			}	
		}
		return false;
	}
}

//-----------------------------------------------------------------------------
// This retrieves the user-specific data from the Lawson system and submits the form.
//
function finishLogin()
{
	if (abortLogin([loginUrl, tpUserId, tpPassword, subscriberName]))
		return;
	// form action
	var loginForm = document.getElementById("loginForm");
	loginForm.action = loginUrl + "?xml=2";
	initEnwisenData();
	// set "FirstName", "LastName", "Classification", "Division", and "rulestring" parameters from user's data in the Lawson HR system	
	// finally, if needed, submit the form to authenticate to the Enwisen system
	getLawsonEmployeeData();
}

//-----------------------------------------------------------------------------
function setTimeStamp()
{
	try { enwisenData["ts"] = serverDate; } catch(e) {}
}

function setEnwisenKey()
{
	if (blackBoxApi)
	{
		key = "";
		enwisenData["key"] = key;
	}
	else
	{	
		key = tpUserId + enwisenData["userid"] + secret;
		if (emssObjInstance.emssObj.loginTimeStamp)
		{
			setTimeStamp();	
			if (typeof(enwisenData["ts"]) != "undefined")
				key += enwisenData["ts"];
		}
		enwisenData["key"] = MD5(key);
	}	
}

//-----------------------------------------------------------------------------
function submitLoginForm()
{
	var loginForm = document.getElementById("loginForm");
	if (abortLogin([loginForm, loginUrl, tpUserId, tpPassword, subscriberName]))
		return;
	var xmlData = getEnwisenDataXml();
	document.getElementById("XMLData").value = xmlData;
	// show form values
	if (debugEnwisen || (emssObjInstance && emssObjInstance.emssObj && emssObjInstance.emssObj.debugEnwisen))
		alertFormValues();
	// form submit
	if (blackBoxApi)
	{
		var formInputData = new Array();
		formInputData["XMLData"] = xmlData;
		ssoJsObjInstance.submitBlackBoxLoginRequest(boxSvcName, window, formInputData, true, null);	
	}
	else
		loginForm.submit();
}

//-----------------------------------------------------------------------------
function cmnGetElementText(node)
{
	var nodes = node.childNodes;
	var len = (nodes && nodes.length ? nodes.length : 0);
	var strRet = "";
	for (var i=0; i<len; i++)
	{
		if (nodes[i].nodeType == 3 || nodes[i].nodeType == 4)
			strRet += nodes[i].nodeValue;
	}
	return strRet;
}

//-----------------------------------------------------------------------------
function alertFormValues()
{
	var alertStr = "ENWISEN AUTHENTICATION DATA\n\n";
	var loginFormDiv = document.getElementById("loginFormDiv");
	alertStr += loginFormDiv.innerHTML		
	+ "\n\nUNENCODED DATA\n\n"
	+ "XMLData = \n"
	+ Base64.decode(document.getElementById("XMLData").value) + "\n\n"
	//for (var fieldName in enwisenData)
	//	alertStr += fieldName + " = " + enwisenData[fieldName] + "\n";
	alert(alertStr);
}

//-----------------------------------------------------------------------------
function getEnwisenDataXml()
{
	var enwisenXml = '<Data>';
	for (var fieldName in enwisenData)
		enwisenXml += '<Field name="'+fieldName+'" value="'+escapeXmlString(enwisenData[fieldName])+'"/>';
	enwisenXml += '</Data>';
	return Base64.encode(enwisenXml);
}

//-----------------------------------------------------------------------------
function getLawsonEmployeeData()
{
	if (!userObj || !userObj.prodline || !userObj.company || !userObj.employee)
	{
		submitLoginForm();
		return;
	}
	dataObj = new DataObject(window, DataObject.TECHNOLOGY_900, SSORequest, setLawsonEmployeeData);
	dataObj.setEncoding(userObj.encoding); 
	dataObj.setParameter("PROD", userObj.prodline);
	dataObj.setParameter("FILE", "EMPLOYEE");
	dataObj.setParameter("INDEX", "EMPSET1");
	var fieldList = "first-name;last-name;super-codes.active-flag";
	if (emssObjInstance.emssObj.employeeGroups)
		fieldList += ";pgemployee.group-name";
	dataObj.setParameter("FIELD", fieldList);
	dataObj.setParameter("KEY", userObj.company + "=" + userObj.employee);
	dataObj.setParameter("MAX", "1");
	dataObj.setParameter("OTMMAX", "600");
	if (dataObj.callData() == null)
		return;
}

//-----------------------------------------------------------------------------
function setLawsonEmployeeData()
{
	if (dataObj.getNbrRecs() > 0)
	{
		var record = dataObj.getRecord(0);		
		var supervisorRecords = record.getRelatedRecords("SUPER-CODES");
		var firstName = record.getFieldValue("first-name");
		var lastName = record.getFieldValue("last-name");
		var empType = "Employee";
		if (supervisorRecords != null)
		{
			var activeFlag = "I";
			var nbrRecs = supervisorRecords.getNbrRecs();
			for (var j=0; j<nbrRecs; j++)
			{
				activeFlag = supervisorRecords.getValue(j, "SUPER-CODES.ACTIVE-FLAG");
			 	if (activeFlag == "A")
			 	{
			 		empType = "Manager";
					break;
			 	}
			}
		}
		enwisenData["firstname"] = (userObj.encoding) ? firstName : firstName.replace(/[^a-z A-Z 0-9]+/g,"");
		enwisenData["lastname"] = (userObj.encoding) ? lastName : lastName.replace(/[^a-z A-Z 0-9]+/g,"");
		if (emssObjInstance.emssObj.employeeGroups)
		{
			userGroupStr = "";
			var groupName = "";		
			var groupRecords = record.getRelatedRecords("PGEMPLOYEE");
			if (groupRecords != null)
			{ 
				var nbrGroups = groupRecords.getNbrRecs();
				for (var i=0; i<nbrGroups; i++)
				{	
					groupName = groupRecords.getValue(i, "PGEMPLOYEE.GROUP-NAME");
					userGroupStr += "(group=" + groupName + ")";
				}	
				enwisenData["rulestring"] += userGroupStr;
			}
		}
		enwisenData["classification"] = empType;
		enwisenData["division"] = userObj.company;		
	}
	if (emssObjInstance.emssObj.currentBenefitPlans)
		getLawsonCurrentBenefitData();
	else if (emssObjInstance.emssObj.eligibleBenefitPlans)
		getLawsonEligibleBenefitData();
	else
		submitLoginForm();
}

// CURRENT BENEFITS DATA
//-----------------------------------------------------------------------------
function getLawsonCurrentBenefitData()
{
	dataObj = new DataObject(window, DataObject.TECHNOLOGY_900, SSORequest, setLawsonCurrentBenefitData);
	dataObj.setEncoding(userObj.encoding);
	dataObj.setParameter("PROD", userObj.prodline);
	dataObj.setParameter("FILE", "BENEFIT");
	dataObj.setParameter("INDEX", "BENSET4");
	dataObj.setParameter("FIELD", "plan-type;plan-code");
	dataObj.setParameter("KEY", userObj.company + "=" + userObj.employee);
	dataObj.setParameter("COND", "current");
	dataObj.setParameter("MAX", "600");
	if (dataObj.callData() == null)
		return;
}

//-----------------------------------------------------------------------------
function setLawsonCurrentBenefitData()
{
	var currBensStr = "";
	if (dataObj.getNbrRecs() > 0)
	{
		for (var i=0; i<dataObj.getNbrRecs(); i++)
		{
			var record = dataObj.getRecord(i);
			var planType = record.getFieldValue("plan-type");
			var planCode = record.getFieldValue("plan-code");
			if (planType && planCode)
			{
				if (currBensStr != "")
					currBensStr += ",";
				currBensStr += planType + planCode
			}
		}	
	}
	enwisenData["election"] = currBensStr;
	if (emssObjInstance.emssObj.eligibleBenefitPlans)
		getLawsonEligibleBenefitData();
	else
		submitLoginForm();
}

// ELIGIBLE BENEFITS DATA
//-----------------------------------------------------------------------------
function getLawsonEligibleBenefitData()
{
	if (!userObj || !userObj.prodline || !userObj.company || !userObj.employee)
	{
		submitLoginForm();
		return;
	}
	var benefitsContext = "default";
	// If we detect the existence of the CurrentBens or EligPlans arrays, then we are inside Benefits Enrollment.
	// If so, get those benefits from BS12 for the new benefit start date set up on BS01.  Otherwise, make a call
	// to BS12 to get eligible benefits from the last Open Enrollment period, using the system date as the effective 
	// date for the eligible benefits.
	try
	{
		if (opener && (opener.CurrentBens || opener.EligPlans))
			benefitsContext = "inside";
	}
	catch(e) {}
	switch (benefitsContext)
	{
		case "inside": getLawsonEnrollmentEligibleBenefitData(); break;
		default: getLawsonDefaultEligibleBenefitData();	break;
	}
}

// Get eligible benefits during the Open Enrollment period from within the Benefits Enrollment tasks.
//-----------------------------------------------------------------------------
function getLawsonEnrollmentEligibleBenefitData()
{
	var eligPlansStr = "";	
	var eligPlans = opener.EligPlans;
	for (var i=1; i<eligPlans.length; i++)
	{
		if (eligPlans[i][1] && eligPlans[i][2])
			eligPlansStr += "(pid=" + eligPlans[i][1] + eligPlans[i][2] + ")";
	}
	enwisenData["rulestring"] += eligPlansStr;
	submitLoginForm();
}

// Get eligible benefits outside the Open Enrollment period from outside the Benefits Enrollment tasks.
//-----------------------------------------------------------------------------
function getLawsonDefaultEligibleBenefitData()
{		
	userEligBenefits = new Array();
	tranObj = new TransactionObject(window, TransactionObject.TECHNOLOGY_900, SSORequest, setLawsonEligibleBenefitDataRules);
	tranObj.setEncoding(userObj.encoding);
	tranObj.setParameter("_PDL", userObj.prodline);
	tranObj.setParameter("_TKN", "BS09.1");
	tranObj.setParameter("FC", "I");
	tranObj.setParameter("_LFN", "TRUE");
	tranObj.setParameter("_EVT", "ADD");
	tranObj.setParameter("_RTN", "DATA");
	tranObj.setParameter("_TDS", "Ignore");
	tranObj.setParameter("BAE-COMPANY", userObj.company);
	tranObj.setParameter("BAE-EMPLOYEE", userObj.employee);
	tranObj.setParameter("BAE-RULE-TYPE", "A");
	if (tranObj.callTransaction() == null)
		return;
}

function setLawsonEligibleBenefitDataRules()
{
	var newDate = userObj.date;
	if (tranObj.getMsgNbr() == TransactionObject.SUCCESS_MSGNBR)
		newDate = tranObj.getValue("BAE-NEW-DATE");
	tranObj = new TransactionObject(window, TransactionObject.TECHNOLOGY_900, SSORequest, setLawsonEligibleBenefitData);
	tranObj.setEncoding(userObj.encoding);
	tranObj.setParameter("_PDL", userObj.prodline);
	tranObj.setParameter("_TKN", "BS12.1");
	tranObj.setParameter("FC", "I");
	tranObj.setParameter("_LFN", "TRUE");
	tranObj.setParameter("_EVT", "ADD");
	tranObj.setParameter("_RTN", "DATA");
	tranObj.setParameter("_TDS", "Ignore");
	tranObj.setParameter("PLN-COMPANY", userObj.company);
	tranObj.setParameter("EMP-EMPLOYEE", userObj.employee);
	tranObj.setParameter("BAE-NEW-DATE", newDate);
	tranObj.setParameter("BAE-RULE-TYPE", "A");
	tranObj.setParameter("BFS-FAMILY-STATUS", "");
	if (tranObj.callTransaction() == null)
		return;	
}

//-----------------------------------------------------------------------------
function getMoreLawsonDefaultEligibleBenefitData(company, employee, newDate, ruleType, familyStatus, processLevel, groupName, processOrder, planType, planCode)
{
	tranObj = new TransactionObject(window, TransactionObject.TECHNOLOGY_900, SSORequest, setLawsonEligibleBenefitData);
	tranObj.setEncoding(userObj.encoding);
	tranObj.setParameter("_PDL", userObj.prodline);
	tranObj.setParameter("_TKN", "BS12.1");
	tranObj.setParameter("FC", "%2B");
	tranObj.setParameter("_LFN", "TRUE");
	tranObj.setParameter("_EVT", "ADD");
	tranObj.setParameter("_RTN", "DATA");
	tranObj.setParameter("_TDS", "Ignore");
	tranObj.setParameter("PLN-COMPANY", userObj.company);
	tranObj.setParameter("EMP-EMPLOYEE", userObj.employee);
	tranObj.setParameter("BAE-NEW-DATE", newDate);
	tranObj.setParameter("BAE-RULE-TYPE", "");
	tranObj.setParameter("BFS-FAMILY-STATUS", "");
	tranObj.setParameter("PT-PLN-COMPANY", company);
	tranObj.setParameter("PT-EMP-EMPLOYEE", employee);
	tranObj.setParameter("PT-BAE-RULE-TYPE", ruleType);
	tranObj.setParameter("PT-BFS-FAMILY-STATUS", familyStatus);	
	tranObj.setParameter("PT-PROCESS-LEVEL", processLevel);
	tranObj.setParameter("PT-GROUP-NAME", groupName);
	tranObj.setParameter("PT-PROCESS-ORDER", processOrder);
	tranObj.setParameter("PT-PLAN-TYPE", planType);
	tranObj.setParameter("PT-PLAN-CODE", planCode);
	if (tranObj.callTransaction() == null)
		return;
}

//-----------------------------------------------------------------------------
function setLawsonEligibleBenefitData()
{	
	if (tranObj.getMsgNbr() == TransactionObject.SUCCESS_MSGNBR)
	{
		for (var i=0; i<36; i++)
		{
			var ruleType = tranObj.getValue("BAE-RULE-TYPE");
			var planType = tranObj.getValue("PLN-PLAN-TYPEr" + i);
			var planCode = tranObj.getValue("PLN-PLAN-CODEr" + i);
			if (planType && planCode)
			{
				// For New Hire or Life Events enrollment types, plans that require evidence of insurability 
				// should not be included in the user's list of eligible benefits.
				if (ruleType && (ruleType == "N" || ruleType == "F"))
				{
					var eoiDate = tranObj.getValue("LAST-CHG-DATEr" + i);
					if (eoiDate && !isNaN(Number(eoiDate)) && userObj.date && !isNaN(Number(userObj.date)))
					{
						// if the EOI date for the plan is less than the system date, 
						// the user is not eligible to enroll in this plan (skip over it)
						if (Number(eoiDate) < Number(userObj.date))
							continue;
					}
				}
				userEligBenefits[userEligBenefits.length] = "(pid=" + planType + planCode + ")";
			}
		}
		if (tranObj.getValue("PT-INQUIRY-COMPLETE") != "Y")
		{
			getMoreLawsonDefaultEligibleBenefitData(tranObj.getValue("PT-PLN-COMPANY"), tranObj.getValue("PT-EMP-EMPLOYEE"),
				tranObj.getValue("BAE-NEW-DATE"), tranObj.getValue("PT-BAE-RULE-TYPE"), tranObj.getValue("PT-BFS-FAMILY-STATUS"),
				tranObj.getValue("PT-PROCESS-LEVEL"), tranObj.getValue("PT-GROUP-NAME"), tranObj.getValue("PT-PROCESS-ORDER"),
				tranObj.getValue("PT-PLAN-TYPE"), tranObj.getValue("PT-PLAN-CODE"));		
			return;
		}
	}
	enwisenData["rulestring"] += userEligBenefits.join("");
	submitLoginForm();
}

// USER PROFILE DATA
//-----------------------------------------------------------------------------
function getUserProfileData()
{
	// get user values from the Profile servlet - use the cached object if we can find and reference it
	try
	{
		if (parent.authUser && parent.authUser.webuser)
		{
			userObj = parent.authUser;
			setAuthUserData(parent.authUser);	
		}
		else if (opener && opener.authUser && opener.authUser.webuser)
		{
			userObj = opener.authUser;
			setAuthUserData(opener.authUser);	
		}		
		else
		{
			// a cached user profile object cannot be found - call the Profile servlet to get the user values
			makeUserProfileCall();
		}
	}
	catch(e)
	{
		// an error occurred trying to get a cached user profile object - call the Profile servlet to get the user values
		makeUserProfileCall();	
	}
}

function setAuthUserData(authObj)
{
	userId = authObj.webuser;
	company = authObj.company;
	employee = authObj.employee;
	var nameParts = authObj.name.split(" ");
	if (nameParts.length > 0)
		firstName = nameParts[0];
	if (nameParts.length > 1)	
		lastName = nameParts[1];
	date = authObj.date;
}

//-----------------------------------------------------------------------------
function makeUserProfileCall()
{	
	var getSysEnv = (iosFileInstance.iosHandler.getIOSVersionNumber() >= "10.00.00") ? true : false;
	userObj = new UserManager(UserManager.TECHNOLOGY_900, SSORequest, false, false, getSysEnv);
	if (userObj.errorMsg)
		return;
	if (!userObj.webuser)	
		userObj.webuser = userObj.id;
	setAuthUserData(userObj);
}

// GLOBAL EMSSOBJ REFERENCE
//-----------------------------------------------------------------------------
function findEMSSObj(searchOpener, ref)
{
	if (!ref)
		ref = self;
	try
	{
		if (ref != ref.parent)
		{
			if ((typeof(ref.parent.emssObj) != "undefined") && (ref.parent.emssObj != null))
				return ref.parent;
			else
				return findEMSSObj(searchOpener, ref.parent);
		}
	}
	catch (e) {}
	try
	{
		if (searchOpener && ref.opener)
		{
			if ((typeof(ref.opener.emssObj) != "undefined") && (ref.opener.emssObj != null))
				return ref.opener;
			else
				return findEMSSObj(searchOpener, ref.opener);
		}
	}
	catch (e) {}
	return null;
}

// GLOBAL SSO REFERENCE
//-----------------------------------------------------------------------------
function findSSOObj(searchOpener, ref)
{
	if (!ref)
		ref = self;
	try
	{
		if (typeof(ref.SSORequest) != "undefined" && ref.SSORequest != null)
			return ref;
		else if (ref != ref.parent)
			return findSSOObj(searchOpener, ref.parent);
	}
	catch (e) {}
	try
	{
		if (searchOpener && ref.opener)
		{
			if (typeof(ref.opener.SSORequest) != "undefined" && ref.opener.SSORequest != null)
				return ref.opener;
			else
				return findSSOObj(searchOpener, ref.opener);
		}
	}
	catch (e) {}
	return null;
}

function escapeXmlString(xmlStr)
{
    xmlStr = xmlStr.replace(/\"/g, "&quot;");
    xmlStr = xmlStr.replace(/\'/g, "\'");
    xmlStr = xmlStr.replace(/\&/g, "&amp;");
    xmlStr = xmlStr.replace(/\>/g, "&gt;");
    xmlStr = xmlStr.replace(/\</g, "&lt;");
    return xmlStr;
}

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*  Licensed under the Creative Commons Attribution License 2.0
*  http://www.webtoolkit.info/license
*  
**/
var Base64 = {
 
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = Base64._utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
 
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = Base64._utf8_decode(output);
 
		return output;
 
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
}

/**
*
*  MD5 (Message-Digest Algorithm)
*  http://www.webtoolkit.info/
*  Licensed under the Creative Commons Attribution License 2.0
*  http://www.webtoolkit.info/license
*  
**/
function MD5(string) {

	function RotateLeft(lValue, iShiftBits) {
		return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
	}

	function AddUnsigned(lX,lY) {
		var lX4,lY4,lX8,lY8,lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
 	}

 	function F(x,y,z) { return (x & y) | ((~x) & z); }
 	function G(x,y,z) { return (x & z) | (y & (~z)); }
 	function H(x,y,z) { return (x ^ y ^ z); }
	function I(x,y,z) { return (y ^ (x | (~z))); }

	function FF(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function GG(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function HH(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function II(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function ConvertToWordArray(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWords_temp1=lMessageLength + 8;
		var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
		var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
		var lWordArray=Array(lNumberOfWords-1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while ( lByteCount < lMessageLength ) {
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount-(lByteCount % 4))/4;
		lBytePosition = (lByteCount % 4)*8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
		lWordArray[lNumberOfWords-2] = lMessageLength<<3;
		lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
		return lWordArray;
	};

	function WordToHex(lValue) {
		var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
		for (lCount = 0;lCount<=3;lCount++) {
			lByte = (lValue>>>(lCount*8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
		}
		return WordToHexValue;
	};

	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	};

	var x=Array();
	var k,AA,BB,CC,DD,a,b,c,d;
	var S11=7, S12=12, S13=17, S14=22;
	var S21=5, S22=9 , S23=14, S24=20;
	var S31=4, S32=11, S33=16, S34=23;
	var S41=6, S42=10, S43=15, S44=21;

	string = Utf8Encode(string);

	x = ConvertToWordArray(string);

	a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

	for (k=0;k<x.length;k+=16) {
		AA=a; BB=b; CC=c; DD=d;
		a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
		d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
		c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
		b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
		a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
		d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
		c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
		b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
		a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
		d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
		c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
		b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
		a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
		d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
		c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
		b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
		a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
		d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
		c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
		b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
		a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
		d=GG(d,a,b,c,x[k+10],S22,0x2441453);
		c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
		b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
		a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
		d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
		c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
		b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
		a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
		d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
		c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
		b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
		a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
		d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
		c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
		b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
		a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
		d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
		c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
		b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
		a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
		d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
		c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
		b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
		a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
		d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
		c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
		b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
		a=II(a,b,c,d,x[k+0], S41,0xF4292244);
		d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
		c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
		b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
		a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
		d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
		c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
		b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
		a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
		d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
		c=II(c,d,a,b,x[k+6], S43,0xA3014314);
		b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
		a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
		d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
		c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
		b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
		a=AddUnsigned(a,AA);
		b=AddUnsigned(b,BB);
		c=AddUnsigned(c,CC);
		d=AddUnsigned(d,DD);
	}

	var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

	return temp.toLowerCase();
}
