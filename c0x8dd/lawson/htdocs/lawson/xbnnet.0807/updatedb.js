// Version: 8-)@(#)@10.00.02.00.29
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/updatedb.js,v 1.22.2.55 2012/06/29 17:24:22 brentd Exp $
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
var index=-1
var count=0
var count1=0
var cnt1=0
var cnt5=0
var cnt2=1
var cnt3=1
var cnt4=1
var cnt6=0 // Dependent counter variables:
var cnt7=0 // cnt6 = index of plan, cnt7 = index of dependent
var lastFunc=""
var depbens="yes"
var errorMsg=""
var updatetype="UPD"
var gotError=false
var ChoiceWin
var planstoPend = new Array()
var planstoDelete = new Array()
var planstoStop = new Array()
var bn31Plans = new Array()
var planUpdated = new Array()
var stopdate=parent.setStopDate(parent.BenefitRules[2])
// close the 'Show Elections' window, since we are loading the summary.
try
{
	if (parent.window.electionsFrame && parent.electionsFrame.opener && !parent.electionsFrame.closed)
		parent.electionsFrame.close();
}
catch(e) {}
function start_update_process()
{
	if (parent.rule_type != "A")
	{
		var warning = getSeaPhrase("UPDATEBEN_42","BEN");
		if (!parent.seaConfirm(warning, "", handleConfirmResponse))
		{
			return;
		}
	}
	update_process_confirmed();
}
// Firefox will call this function
function handleConfirmResponse(confirmWin)
{
	if (confirmWin.returnValue == "ok" || confirmWin.returnValue == "continue")
		update_process_confirmed();
}
function update_process_confirmed()
{
	show_choice_win();
}
parent.quitting = false;
function show_choice_win(onQuit)
{
	if (onQuit)
		parent.quitting = true
	// Trigger the ProcessFlow if the employee opts for email. The "process_flows_enabled" config setting must be "true".
	var techVersion = (parent.iosHandler && parent.iosHandler.getIOSVersionNumber() >= "09.00.00") ? ProcessFlowObject.TECHNOLOGY_900 : ProcessFlowObject.TECHNOLOGY_803;
	var httpRequest = (typeof(parent.SSORequest) == "function") ? parent.SSORequest : parent.SEARequest;
	var pfObj = new ProcessFlowObject(window, techVersion, httpRequest, "EMSS");
	pfObj.setEncoding(parent.authUser.encoding);
	pfObj.showErrors = false;		
	if (styler && (styler.showLDS || styler.showInfor) && typeof(window["stylerWnd"]) != "undefined" && typeof(window.stylerWnd["DialogObject"]) == "function")
	{			
		var allowEmail = (!onQuit && emssObjInstance.emssObj.processFlowsEnabled && parent.emailaddress && NonSpace(parent.emailaddress) > 0) ? true : false;
		var msg = '<form name="optionsFrm" style="display:inline">' 
		+ '<div style="padding-top:5px">' + getSeaPhrase("UPDATEBEN_14","BEN") + '</div>'
		+ '<div class="dialogSecondaryTextStyler" style="padding-top:5px;padding-left:25px"><input type="radio" name="radioPrint" value="Y" styler="radio"/>Yes</div>'
		+ '<div class="dialogSecondaryTextStyler" style="padding-top:5px;padding-left:25px"><input type="radio" name="radioPrint" value="N" styler="radio" checked/>No</div>';
		// give option to send email if email address and process flow both exist
		if (allowEmail)
		{
			msg += '<div style="padding-top:5px">' + getSeaPhrase("UPDATEBEN_52","BEN") + '</div>'
			+ '<div class="dialogSecondaryTextStyler" style="padding-top:5px;padding-left:25px"><input type="radio" name="radioEmail" value="Y" styler="radio"/>Yes</div>'
			+ '<div class="dialogSecondaryTextStyler" style="padding-top:5px;padding-left:25px"><input type="radio" name="radioEmail" value="N" styler="radio" checked/>No</div>';
		}		
		msg += '</form>';
		var secondaryMsg = "";
		if (onQuit)
		{
			secondaryMsg = getSeaPhrase("UPDATEBEN_11","BEN")
				+ " " + getSeaPhrase("UPDATEBEN_12","BEN");
		}
		messageDialog = new window.stylerWnd.DialogObject("/lawson/webappjs/", null, styler, true);
		messageDialog.pinned = true;
		messageDialog.doReturn = function(wnd)
		{
			wnd = wnd || window;
			var optionsFrm = wnd.document.forms["optionsFrm"];
			parent.printSummary = optionsFrm.elements["radioPrint"][0].checked;
			parent.emailSummary = false;
			if (optionsFrm.elements["radioEmail"])
				parent.emailSummary = optionsFrm.elements["radioEmail"][0].checked;	
		}
		messageDialog.styleDialog = function(wnd)
		{
			wnd = wnd || window;
			if (this.styler == null)
			{
				this.styler = new wnd.StylerBase();
				this.styler.showLDS = styler.showLDS;
				this.styler.showInfor = styler.showInfor;
				if (this.pinned && typeof(parent["SSORequest"]) != "undefined")
					this.styler.httpRequest = parent.SSORequest;
				else if (typeof(wnd["SSORequest"]) != "undefined")
					this.styler.httpRequest = wnd.SSORequest;	
			}
			
			wnd.styler = this.styler;
			wnd.StylerBase.webappjsURL = "../..";			
			if (wnd.styler.showInfor)
			{
				wnd.styler.loadEnableCssFile(wnd, "../css/base/inforHidden.css");
				wnd.styler.loadEnableCssFile(wnd, "../css/base/inforRadioButton.css");			
			}
			else
			{
				wnd.styler.loadEnableCssFile(wnd, "../css/base/hiddenElement.css");
				wnd.styler.loadEnableCssFile(wnd, "../css/base/inputRadioButtonElement.css");
			}
			if (wnd.styler.showInfor && wnd.styler.textDir == "rtl") 
			{
				var htmlObjs = wnd.styler.getLikeElements(wnd, "html");
				for (var i=0; i<htmlObjs.length; i++) 
				{
				    htmlObjs[i].setAttribute("dir", wnd.styler.textDir);
				}
				wnd.styler.loadEnableCssFile(wnd, wnd.StylerBase.webappjsURL + "/infor/css/base/inforRTL.css");
				if (navigator.userAgent.indexOf("MSIE") >= 0)
				{
					var botLeft = wnd.document.getElementById("bottomLeft");
					var botRight = wnd.document.getElementById("bottomRight");
					botLeft.style.marginLeft = "0px";
					botLeft.style.marginRight = "3px";
					botRight.style.marginLeft = "0px";
					botRight.style.marginRight = "-3px";			
				}	
			}				
			wnd.styler.modifyDOM(wnd);	
		}				
		if (onQuit)
		{
			setMsgDlgBtn("EXIT");         
		}
		else
		{
			setMsgDlgBtn("CONTINUE");
		}
		var msgObj = messageDialog.messageBox(msg, "ok", "question", window, false, secondaryMsg, confirmExitPrint);
		if (msgObj && typeof(msgObj) == "string")
		{
			isSettingChoice = false;
			FinishChoices();
			return;
		}	
	}
	else
	{	
		if (onQuit)
			ChoiceContents(true)
		else	
			ChoiceContents()
	}
}
function setMsgDlgBtn(phraseID)
{
	messageDialog.translationAry = new Array();
	messageDialog.translationAry["btnYes"] = phraseID;
	messageDialog.translateButton = function(btn, phrase, wnd)
	{	
		wnd = wnd || window;
	    if (typeof(btn) == "string")
	    {	
	    	if (typeof(this.translationAry) != "undefined" && this.translationAry)
	    		phrase = this.translationAry[btn];
	        btn = wnd.document.getElementById(btn);		        
	    }
	    else if (typeof(btn) == "object")
	    {
	    	if (typeof(this.translationAry) != "undefined" && this.translationAry)
	    		phrase = this.translationAry[btn.getAttribute("id")];	    	
	    }
	    if (!btn || !phrase)	
	        return;
	    btn.value = getSeaPhrase(phrase, "BEN");
	    if (btn.innerText != null)	
	        btn.innerText = btn.value;
	    else if (btn.textContent != null)
	        btn.textContent = btn.value;
	    else
	    	btn.innerHTML = btn.value;
	}	
}
function confirmExitPrint(confirmWin)
{
	isSettingChoice = false;
	FinishChoices();
}
function ChoiceContents(onQuit)
{
	// give option to send email if email address and process flow both exist
	var allowEmail = (!onQuit && emssObjInstance.emssObj.processFlowsEnabled && parent.emailaddress && NonSpace(parent.emailaddress) > 0) ? true : false;
	var text = ""
	var text2 = ""
	if(onQuit) 
	{
		text = getSeaPhrase("UPDATEBEN_11","BEN")
		text2 = getSeaPhrase("UPDATEBEN_12","BEN")
	}
	var html = '<div class="plaintablecell" style="padding:0px">'
 	html += '<form name="optionsFrm" style="display:inline">'
 	html += '<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0" style="width:100%;margin-left:auto;margin-right:auto">'
	html += '<tr>'
	html += '<td class="plaintableheaderborder">'+getSeaPhrase("ELECTION_PRINT","BEN")+'</td></tr>'
	if (text)
	{
		html += '<tr>'
		html += '<td class="plaintablecellboldborder" style="border-bottom:0px">'
		html += '<p>'+text+'<p>'
		html += '</td></tr>'
	}
	if (text2)
	{
		html += '<tr>'
		html += '<td class="plaintablecellborder" style="border-bottom:0px">'
		html += text2+'<p>'
		html += '</td></tr>'
	}
	html += '</tr>'
	html += '<tr>'
	html += '<td class="plaintablecellborder">'
	html += getSeaPhrase("UPDATEBEN_14","BEN")+'<div class="plaintablecell" style="padding-top:5px;padding-left:25px"><input type="radio" name="radioPrint" value="Y"/>Yes</div>'
	html += '<div class="plaintablecell" style="padding-left:25px"><input type="radio" name="radioPrint" value="N" styler="radio" checked/>No</div>'
	html += '</td></tr>'
	if (allowEmail)
	{
		html += '<tr>'
		html += '<td class="plaintablecellborder">'
		html += getSeaPhrase("UPDATEBEN_52","BEN")+'<div class="plaintablecell" style="padding-top:5px;padding-left:25px"><input type="radio" name="radioEmail" value="Y"/>Yes</div>'
		html += '<div class="plaintablecell" style="padding-left:25px"><input type="radio" name="radioEmail" value="N" checked/>No</div>'
		html += '</td></tr>'	
	}
	html += '</table>'
	html += '<p class="textAlignRight">'
	if(onQuit) 
	{
		html += uiButton(getSeaPhrase("EXIT","BEN"), "parent.SetChoices();return false","margin-right:5px;margin-top:10px")		
	}
	else 
	{
		html += uiButton(getSeaPhrase("CONTINUE","BEN"), "parent.SetChoices();return false","margin-right:5px;margin-top:10px")
	}
	html += '</p>'
	html += '</form>'
	html += '</div>'
	self.summary.document.getElementById("paneBody").innerHTML = html;
	self.summary.document.getElementById("paneHeader").innerHTML = getSeaPhrase("ENROLLMENT_ELECTIONS","BEN")
	self.summary.stylePage();
}
var isSettingChoice = false;
function SetChoices()
{
	if (isSettingChoice)
		return;
	else
		isSettingChoice = true;
	var optionsFrm = self.summary.document.forms["optionsFrm"];
	parent.printSummary = optionsFrm.elements["radioPrint"][0].checked;
	parent.emailSummary = false;
	if (optionsFrm.elements["radioEmail"])
		parent.emailSummary = optionsFrm.elements["radioEmail"][0].checked;
	FinishChoices();	
}
function FinishChoices()
{
	if (!parent.quitting)
		continue_update();
	else
		parent.quitEnroll(self.location);
}
function continue_update()
{
	if (!appObj)
	{
		if (parent.appObj)
			appObj = parent.appObj;
		else
			appObj = new AppVersionObject(parent.prodline, "HR");
	}
	// if you call getAppVersion() right away and the IOS object isn't set up yet,
	// then the code will be trying to load the sso.js file, and your call for
	// the appversion will complete before the ios version is set
	if (iosHandler.getIOS() == null || iosHandler.getIOSVersionNumber() == null)
	{
       		setTimeout("continue_update()", 10);
       		return;
	}
	updatetype="UPD"
	parent.startProcessing(getSeaPhrase("UPDATEBEN_17","BEN"));
	var calltoFunction = "";
	if(parent.BenefitRules[7] != "T")
	{
		if(parent.BenefitRules[7]=="Y" && parent.rule_type!="A")
			parent.CheckFlexPeriods(parent.rule_type)
		if(parent.BenefitRules[7]=="Y")
			bn31Plans = parent.SplitDependencies(parent.ElectedPlans,11)
		else
			parent.sortElectedArray(parent.ElectedPlans,true)
		if(parent.event=="annual" || parent.rule_type=="N")
		{
			if(parent.alreadyElect=="Y")
			{
				if (parent.oldElectionsIn=="PENDING")
					calltoFunction = "deletebensPending()"		
				else if(parent.oldElectionsIn=="SYSTEM")
				{
					parent.sortElectedArray(parent.oldelected)
					calltoFunction = "haltElections()"										
				}
			}
			else
			{
				// We have plans where BEN-STOP-DATE = spaces or > BAE-NEW-DATE
				if(parent.oldelected.length > 1 || (parent.oldelected[0] && parent.oldelected[0][0]))
				{
					parent.sortElectedArray(parent.oldelected)
					planstoStop = new Array()
					for(var i=0;i<parent.oldelected.length;i++)
					{
						planstoStop[i] = parent.oldelected[i]
						planstoStop[i][10] = "S" // line-fc
					}
					calltoFunction = "stopbensImmediate()"
				}
				else
				{
					count=0
					if(parent.BenefitRules[7]=="Y")
						calltoFunction = "addbensImmediate(0)"
					else
					{
						senttoPending=false
						planstoPend = parent.ElectedPlans
						calltoFunction = "addbensPending()"
					}
				}
			}
		}
		else
		{
			count=1
			if(parent.BenefitRules[7]=="Y")
				calltoFunction = "le_updateImmediate()"
			else
				calltoFunction = "le_updatePending()"
		}
	}
	else
		calltoFunction = "finishupdate()"
	eval(calltoFunction)
}
function finishupdate()
{
	if(updatetype=="ERR" && lastFunc=="addbensImmediate" && !senttoPending)
	{
		updatetype="UPD"
		count=0
		planstoPend = BN31ErrPlans(count1)
		senttoPending=false
		errorMsg=getSeaPhrase("UPDATEBEN_18","BEN")
		        +" "+getSeaPhrase("COMPANY","BEN")
		        +" "+parent.company
		        +", "+getSeaPhrase("EMPLOYEE","BEN")
		        +" "+parent.employee
			+" "+parent.firstname+" "+parent.lastname
			+"\n\n"+getSeaPhrase("UPDATEBEN_43","BEN")
		addbensPending()
		return
	}
	else if(updatetype=="ERR" && lastFunc=="le_addbensImmediate" && !senttoPending)
	{
		updatetype="UPD"
		senttoPending=false
		count=0
		planstoPend = BN31ErrPlans(count1)
		errorMsg=getSeaPhrase("UPDATEBEN_18","BEN")
		        +" "+getSeaPhrase("COMPANY","BEN")
		        +" "+parent.company
		        +", "+getSeaPhrase("EMPLOYEE","BEN")
		        +" "+parent.employee
			+" "+parent.firstname+" "+parent.lastname
			+"\n\n"+getSeaPhrase("UPDATEBEN_43","BEN")
		addbensPending()
		return
	}
	else if(updatetype=="ERR" && lastFunc=="processDepsImmediate")
	{
		updatetype="UPD"
		cnt33=1
		cnt6=0
		cnt7=0
		errorMsg=getSeaPhrase("UPDATEBEN_18","BEN")
		        +" "+getSeaPhrase("COMPANY","BEN")
		        +" "+parent.company
		        +", "+getSeaPhrase("EMPLOYEE","BEN")
		        +" "+parent.employee
			+" "+parent.firstname+" "+parent.lastname
			+"\n\n"+getSeaPhrase("UPDATEBEN_44","BEN")
		processDepsPending()
		return
	}
	else if(updatetype=="ERR" && lastFunc=="processDepsPending")
	{
			errorMsg=getSeaPhrase("UPDATEBEN_18","BEN")
		        +" "+getSeaPhrase("COMPANY","BEN")
		        +" "+parent.company
		        +", "+getSeaPhrase("EMPLOYEE","BEN")
		        +" "+parent.employee
			+" "+parent.firstname+" "+parent.lastname
			+"\n\n"+getSeaPhrase("UPDATEBEN_45","BEN")
			FinalScreen(gotError)
			return
	}
	else if(updatetype=="ERR" && senttoPending)
	{
		var numCalls=(count==0)?0:Math.floor((count-1)/5)
		count=(numCalls*5)
		if(errorMsg=="")
		{
			errorMsg=getSeaPhrase("UPDATEBEN_18","BEN")
		        +" "+getSeaPhrase("COMPANY","BEN")
		        +" "+parent.company
		        +", "+getSeaPhrase("EMPLOYEE","BEN")
		        +" "+parent.employee
			+" "+parent.firstname+" "+parent.lastname
			+"\n\n"+getSeaPhrase("UPDATEBEN_46","BEN")
		}
	}
	senttoPending=false
	if(updatetype!="ERR")
	{
		if(parent.BenefitRules[7] != "T")
		{
			if(depbens!="no")
				updateDepBens()
			else
			{
				if(parent.eventname != "annual" && updatetype != "done" && parent.rule_type != "N")
					updateFSH()
				else
					FinalScreen(gotError)
			}
		}
		else
			FinalScreen()
	}
	else
		FinalScreen(gotError)
}
function FinalScreen(error)
{
	parent.stopProcessing();	
	if(error)
		parent.main.document.getElementById("summary").src = parent.baseurl+"besserror.htm"
	else
		parent.main.document.getElementById("summary").src = parent.baseurl+"update.htm"	
}
function BN31ErrPlans(numcalls)
{
	var ElectedErr = new Array()
	for (var i=numcalls;i<bn31Plans.length;i++)
		ElectedErr = ElectedErr.concat(bn31Plans[i])
	return ElectedErr
}
function haltElections()
{
	planstoDelete = new Array()
	planstoStop = new Array()
	if (parent.oldelected.length > 0)
	{
		for (var i=0;i<parent.oldelected.length;i++)
		{
			if(parseFloat(parent.oldelected[i][5])==parseFloat(parent.BenefitRules[2]))
			{
				planstoDelete[planstoDelete.length] = parent.oldelected[i]
				planstoDelete[planstoDelete.length-1][10] = "D" //line-fc
			}
			else
			{
				planstoStop[planstoStop.length] = parent.oldelected[i]
				planstoStop[planstoStop.length-1][10] = "S" //line-fc
			}
		}
		tmpArr = new Array()
		tmpArr = planstoDelete.concat(planstoStop)
		planstoStop = new Array()
		planstoStop = tmpArr
		stopbensImmediate()
	}
	else
	{
		count=0
		if(parent.BenefitRules[7]=="Y")
			addbensImmediate(0)
		else
		{
			senttoPending=false
			planstoPend = parent.ElectedPlans
			addbensPending()
		}
	}
}
function stopbensImmediate()
{
	senttoPending=false
	if(updatetype=="ERR")
	{
		if(lastFunc=="stopbensImmediate")
		{
			updatetype="UPD"
			var numCalls=(cnt5==0)?0:Math.floor((cnt5-1)/20)
			count=(numCalls*20)
			planstoPend = planstoStop
			senttoPending=false
			errorMsg=getSeaPhrase("UPDATEBEN_18","BEN")
				+" "+getSeaPhrase("COMPANY","BEN")
				+" "+parent.company
				+", "+getSeaPhrase("EMPLOYEE","BEN")
				+" "+parent.employee
				+" "+parent.firstname+" "+parent.lastname
				+"\n\n"+getSeaPhrase("UPDATEBEN_47","BEN")
			addbensPending()
		}
		else
		{
			errorMsg=getSeaPhrase("UPDATEBEN_18","BEN")
				+" "+getSeaPhrase("COMPANY","BEN")
				+" "+parent.company
				+", "+getSeaPhrase("EMPLOYEE","BEN")
				+" "+parent.employee
				+" "+parent.firstname+" "+parent.lastname
				+"\n\n"+getSeaPhrase("UPDATEBEN_46","BEN")
			finishupdate()
		}
	}
	else if(gotError)
	{
		updatetype="UPD"
		lastFunc = "stopbensImmediate"
		planstoPend = planstoStop
		senttoPending=false
		addbensPending()
	}
	else
	{
		lastFunc = "stopbensImmediate"
		if(planstoStop[cnt5]!=null && planstoStop[cnt5][0]!=null)
		{
			//alert("stopbensImmediate -- bs32.1")
			var obj = new AGSObject(parent.prodline,"BS32.1")
			obj.event="Add"
			obj.debug=false
			obj.rtn="MESSAGE"
			obj.longNames=true
			obj.tds=false
			obj.field="FC=C"
				+ "&BEN-COMPANY="+escape(parent.company)
				+ "&BEN-EMPLOYEE="+escape(parent.employee)
			if(parent.BenefitRules[7]=="Y")
				obj.func="parent.addbensImmediate(0)"
			else
				obj.func = "parent.addbensPending()"
			for(var k=1;k<21;k++)
			{
				if(cnt5<planstoStop.length)
				{
					obj.field+="&LINE-FC"+k+"="+planstoStop[cnt5][10]//"S" or "D"
					if(parseFloat(planstoStop[cnt5][0])==1)
					{
						obj.field+="&BEN-PLAN-TYPE"+k+"="+escape(planstoStop[cnt5][2][11],1).toString().replace("+","%2B")
						obj.field+="&BEN-PLAN-CODE"+k+"="+escape(planstoStop[cnt5][2][12],1).toString().replace("+","%2B")
					}
					if((parseFloat(planstoStop[cnt5][0])>1 && parseFloat(planstoStop[cnt5][0])<6) || parseFloat(planstoStop[cnt5][0])==13)
					{
						obj.field+="&BEN-PLAN-TYPE"+k+"="+escape(planstoStop[cnt5][2][37],1).toString().replace("+","%2B")
						obj.field+="&BEN-PLAN-CODE"+k+"="+escape(planstoStop[cnt5][2][38],1).toString().replace("+","%2B")
					}
					if(parseFloat(planstoStop[cnt5][0])>5 && parseFloat(planstoStop[cnt5][0])<11)
					{
						obj.field+="&BEN-PLAN-TYPE"+k+"="+escape(planstoStop[cnt5][2][38],1).toString().replace("+","%2B")
						obj.field+="&BEN-PLAN-CODE"+k+"="+escape(planstoStop[cnt5][2][39],1).toString().replace("+","%2B")
					}
					if(parseFloat(planstoStop[cnt5][0])==12)
					{
						obj.field+="&BEN-PLAN-TYPE"+k+"="+escape(planstoStop[cnt5][2][1],1).toString().replace("+","%2B")
						obj.field+="&BEN-PLAN-CODE"+k+"="+escape(planstoStop[cnt5][2][2],1).toString().replace("+","%2B")
					}
					obj.field+="&BEN-START-DATE"+k+"="+escape(planstoStop[cnt5][5])
					+ "&BEN-STOP-DATE"+k+"="+stopdate
					+ "&BEN-USER-ID"+k+"=W"+escape(parent.employee)
					+ "&BNT-CREATE-TRANS"+k+"="+escape(planstoStop[cnt5][7])
					if(planstoStop[cnt5][7]=="Y" || planstoStop[cnt5][7]=="P")
					{
						obj.field+="&BNT-REASON"+k+"="+escape(planstoStop[cnt5][8],1)
						+"&BNT-MEMBER-ID"+k+"="+escape(planstoStop[cnt5][9],1)
					}
					cnt5++
				}
				else
					break
			}
			obj.dtlField = "LINE-FC;BEN-PLAN-TYPE;BEN-PLAN-CODE;BEN-START-DATE;BEN-STOP-DATE;BEN-USER-ID;BNT-CREATE-TRANS;BNT-REASON;BNT-MEMBER-ID";
			if(cnt5<planstoStop.length)
			{
				obj.func="parent.stopbensImmediate()"
			}
			else
			{
				count=0
				if(parent.BenefitRules[7]!="Y")
				{
					senttoPending=false
					planstoPend = parent.ElectedPlans
				}
			}
			AGS(obj,"bnreturn")
		}
		else
		{
			count=0
			if(parent.BenefitRules[7]=="Y")
				addbensImmediate(0)
			else
			{
				senttoPending=false
				planstoPend = parent.ElectedPlans
				addbensPending()
			}
		}
	}
}
function addbensImmediate(callno)
{
	senttoPending=false
	if(updatetype=="ERR")
	{
		if(lastFunc=="stopbensImmediate")
		{
			updatetype="UPD"
			var numCalls=(cnt5==0)?0:Math.floor((cnt5-1)/20)
			count=(numCalls*20)
			planstoPend = planstoStop
			senttoPending=false
			errorMsg=getSeaPhrase("UPDATEBEN_18","BEN")
				+" "+getSeaPhrase("COMPANY","BEN")
				+" "+parent.company
				+", "+getSeaPhrase("EMPLOYEE","BEN")
				+" "+parent.employee
				+" "+parent.firstname+" "+parent.lastname
				+"\n\n"+getSeaPhrase("UPDATEBEN_47","BEN")
			addbensPending()
		}
		else if(lastFunc=="addbensImmediate")
		{
			updatetype="UPD"
			count=0
			planstoPend = BN31ErrPlans(count1)
			senttoPending=false
			errorMsg=getSeaPhrase("UPDATEBEN_18","BEN")
				+" "+getSeaPhrase("COMPANY","BEN")
				+" "+parent.company
				+", "+getSeaPhrase("EMPLOYEE","BEN")
				+" "+parent.employee
				+" "+parent.firstname+" "+parent.lastname
				+"\n\n"+getSeaPhrase("UPDATEBEN_43","BEN")
			addbensPending()
		}
		else if(lastFunc=="deletebensPending")
		{
			var numCalls=(cnt2==0)?0:Math.floor((cnt2-1)/5)
			count=(numCalls*5)
			errorMsg=getSeaPhrase("UPDATEBEN_18","BEN")
				+" "+getSeaPhrase("COMPANY","BEN")
				+" "+parent.company
				+", "+getSeaPhrase("EMPLOYEE","BEN")
				+" "+parent.employee
				+" "+parent.firstname+" "+parent.lastname
				+"\n\n"+getSeaPhrase("UPDATEBEN_48","BEN")
			finishupdate()
		}
		else
		{
			if(errorMsg=="")
			{
				errorMsg=getSeaPhrase("UPDATEBEN_18","BEN")
				+" "+getSeaPhrase("COMPANY","BEN")
				+" "+parent.company
				+", "+getSeaPhrase("EMPLOYEE","BEN")
				+" "+parent.employee
				+" "+parent.firstname+" "+parent.lastname
				+"\n\n"+getSeaPhrase("UPDATEBEN_46","BEN")
			}
			finishupdate()
		}
	}
	else if(gotError)
	{
		updatetype="UPD"
		lastFunc = "addbensImmediate"
		planstoPend = parent.ElectedPlans
		senttoPending=false
		addbensPending()
	}
	else
	{
		lastFunc = "addbensImmediate"
		var callit=0
		if(bn31Plans[callno]!=null)
		{
			//alert("addbensImmediate -- bn31.1")
			var obj = new AGSObject(parent.prodline,"BN31.1")
			obj.event="ADD"
			obj.debug=false
			obj.rtn="MESSAGE"
			obj.longNames=true
			obj.tds=false
			obj.field="FC=A"
				+ "&BEN-COMPANY="+escape(parent.company)
			obj.func="parent.finishupdate()"
			for(var k=0;k<bn31Plans[callno].length;k++)
			{
				if(bn31Plans[callno][k]!=null)
				{
					callit=1
					var arr = new Array()
					arr=FormatPlan(k,bn31Plans[callno])
					obj.field+="&BEN-EMPLOYEE"+(k+1)+"="+arr[3]
						+ "&BEN-PLAN-TYPE"+(k+1)+"="+arr[4]
						+ "&BEN-PLAN-CODE"+(k+1)+"="+arr[5]
						+ "&BEN-COV-OPTION"+(k+1)+"="+arr[6]
						+ "&BEN-MULTIPLE"+(k+1)+"="+arr[7]
						+ "&BEN-COVER-AMT"+(k+1)+"="+arr[8]
						+ "&BEN-PAY-RATE"+(k+1)+"="+arr[9]
						+ "&BEN-PCT-AMT-FLAG"+(k+1)+"="+arr[10]
						+ "&BEN-START-DATE"+(k+1)+"="+arr[11]
						+ "&PRE-CONT-TAX-STS"+(k+1)+"="+arr[12]
						+ "&BEN-SMOKER"+(k+1)+"="+arr[13]
						+ "&BEN-PEND-EVIDENCE"+(k+1)+"="+arr[17]
						+ "&BEN-EMP-PRE-CONT"+(k+1)+"="+arr[14]
						+ "&BEN-EMP-AFT-CONT"+(k+1)+"="+arr[15]
						+ "&BEN-STOP-DATE"+(k+1)+"="+arr[16]
						+ "&BEN-USER-ID"+(k+1)+"=W"+arr[3]
						+ "&BNT-CREATE-TRANS"+(k+1)+"="+arr[33]
					if (arr[33]=="Y" || arr[33]=="P")
					{
						obj.field+="&BNT-REASON"+(k+1)+"="+arr[34]
						+"&BNT-MEMBER-ID"+(k+1)+"="+arr[35]
					}
					count1=callno
					planUpdated[String(arr[4])+String(arr[5])] = true
				}
			}
			// by-pass salary override warning
			obj.field+="&SAL-OVER-XMIT=1"
			obj.dtlField = "BEN-EMPLOYEE;BEN-PLAN-TYPE;BEN-PLAN-CODE;BEN-COV-OPTION;BEN-MULTIPLE;"
			+"BEN-COVER-AMT;BEN-PAY-RATE;BEN-PCT-AMT-FLAG;BEN-START-DATE;PRE-CONT-TAX-STS;BEN-SMOKER;"
			+"BEN-PEND-EVIDENCE;BEN-EMP-PRE-CONT;BEN-EMP-AFT-CONT;BEN-STOP-DATE;BEN-USER-ID;BNT-CREATE-TRANS;"
			+"BNT-REASON;BNT-MEMBER-ID"	
			if((callno+1)<bn31Plans.length)
				obj.func="parent.addbensImmediate("+(callno+1)+")"
			if(callit==1)
			{
				updatetype="UPD"
				AGS(obj,"bnreturn")
			}
			else
			{
				if((callno+1)<bn31Plans.length)
					addbensImmediate(callno+1)
				else
					finishupdate()
			}
		}
	}
}
function deletebensPending()
{
	if(updatetype=="ERR")
	{
		if(lastFunc=="deletebensPending")
		{
			var numCalls=(cnt2==0)?0:Math.floor((cnt2-1)/5)
			count=(numCalls*5)
			errorMsg=getSeaPhrase("UPDATEBEN_18","BEN")
				+" "+getSeaPhrase("COMPANY","BEN")
				+" "+parent.company
				+", "+getSeaPhrase("EMPLOYEE","BEN")
				+" "+parent.employee
				+" "+parent.firstname+" "+parent.lastname
				+"\n\n"+getSeaPhrase("UPDATEBEN_48","BEN")
		}
		else
		{
			errorMsg=getSeaPhrase("UPDATEBEN_18","BEN")
				+" "+getSeaPhrase("COMPANY","BEN")
				+" "+parent.company
				+", "+getSeaPhrase("EMPLOYEE","BEN")
				+" "+parent.employee
				+" "+parent.firstname+" "+parent.lastname
				+"\n\n"+getSeaPhrase("UPDATEBEN_46","BEN")
		}
		finishupdate()
	}
	else
	{	lastFunc = "deletebensPending"
		if(parent.oldelected[cnt2-1]!=null)
		{
			//alert("deletebensPending -- bs31.1")
			var obj = new AGSObject(parent.prodline,"BS31.1")
			obj.event="CHANGE"
			obj.rtn="MESSAGE"
			obj.debug=false
			obj.longNames=true
			obj.tds=false
			obj.field="FC=C"
				+ "&BNB-COMPANY="+escape(parent.company)
				+ "&BNB-EMPLOYEE="+escape(parent.employee)
			if(parent.BenefitRules[7]=="Y")
				obj.func="parent.addbensImmediate(0)"
			else
				obj.func="parent.addbensPending()" 
			var k=1;
			var done=false;
			while(k<6 && !done)
			{
				if(cnt2-1<parent.oldelected.length)
				{
					if(shouldBeDeletedFromPending(parent.oldelected[cnt2-1]) == true)
					{
						obj.field+="&LINE-FC"+k+"=D"
						if(parseFloat(parent.oldelected[cnt2-1][0])==1)
						{
							obj.field+="&BNB-PLAN-TYPE"+k+"="+escape(parent.oldelected[cnt2-1][2][11],1).toString().replace("+","%2B")
							obj.field+="&BNB-PLAN-CODE"+k+"="+escape(parent.oldelected[cnt2-1][2][12],1).toString().replace("+","%2B")
						}
						if((parseFloat(parent.oldelected[cnt2-1][0])>1 && parseFloat(parent.oldelected[cnt2-1][0])<6) || parseFloat(parent.oldelected[cnt2-1][0])==13)
						{
							obj.field+="&BNB-PLAN-TYPE"+k+"="+escape(parent.oldelected[cnt2-1][2][37],1).toString().replace("+","%2B")
							obj.field+="&BNB-PLAN-CODE"+k+"="+escape(parent.oldelected[cnt2-1][2][38],1).toString().replace("+","%2B")
						}
						if(parseFloat(parent.oldelected[cnt2-1][0])>5 && parseFloat(parent.oldelected[cnt2-1][0])<11)
						{
							obj.field+="&BNB-PLAN-TYPE"+k+"="+escape(parent.oldelected[cnt2-1][2][38],1).toString().replace("+","%2B")
							obj.field+="&BNB-PLAN-CODE"+k+"="+escape(parent.oldelected[cnt2-1][2][39],1).toString().replace("+","%2B")
						}
						if(parseFloat(parent.oldelected[cnt2-1][0])==12)
						{
							obj.field+="&BNB-PLAN-TYPE"+k+"="+escape(parent.oldelected[cnt2-1][2][1],1).toString().replace("+","%2B")
							obj.field+="&BNB-PLAN-CODE"+k+"="+escape(parent.oldelected[cnt2-1][2][2],1).toString().replace("+","%2B")
						}
						obj.field+="&BNB-START-DATE"+k+"="+escape(parent.oldelected[cnt2-1][5])
						k++;
					}
					cnt2++
				}
				else
					done=true
			}
			// did we find at least one benefit plan to delete?
			if(k > 1)
			{
				if(cnt2-1<parent.oldelected.length)
					obj.func="parent.deletebensPending()"
				else
				{
					count=0
					if(parent.BenefitRules[7]!="Y")
					{
						senttoPending=false
						planstoPend = parent.ElectedPlans
					}
				}
				AGS(obj,"bnreturn")
			}
			// if we have nothing to delete, proceed to add the new benefits
			else
			{
				count=0
				if(parent.BenefitRules[7]=="Y")
					addbensImmediate(0)
				else
				{
					senttoPending=false
					planstoPend = parent.ElectedPlans
					addbensPending()
				}			
			}
		}
		else
		{
			count=0
			if(parent.BenefitRules[7]=="Y")
				addbensImmediate(0)
			else
			{
				senttoPending=false
				planstoPend = parent.ElectedPlans
				addbensPending()
			}
		}
		
	}
}
// make sure that any plan that is deleted on BS31 is in the ElectedPlans or EligPlans arrays
function shouldBeDeletedFromPending(oldelected)
{
	var planType1 = "";
	var planCode1 = "";
	switch(parseInt(oldelected[0],10))
	{
		case 1:
			planType1 = oldelected[2][11];
			planCode1 = oldelected[2][12];				
			break;
		case 2:			
		case 3:				
		case 4:
		case 5: 
			planType1 = oldelected[2][37];
			planCode1 = oldelected[2][38];		
			break;			
		case 6:		
		case 7:		
		case 8:			
		case 9:
		case 10:
			planType1 = oldelected[2][38];
			planCode1 = oldelected[2][39];	
			break;		
		case 12:
			planType1 = oldelected[2][1];
			planCode1 = oldelected[2][2];	
			break;			
		default:
			break;
	}
	for (var i=0; i<parent.ElectedPlans.length; i++)
	{
		var planType2 = "";
		var planCode2 = "";
		switch(parseInt(parent.ElectedPlans[i][0],10))
		{
			case 1:
				planType2 = parent.ElectedPlans[i][2][11];
				planCode2 = parent.ElectedPlans[i][2][12];				
				break;
			case 2:				
			case 3:						
			case 4:
			case 5: 
				planType2 = parent.ElectedPlans[i][2][37];
				planCode2 = parent.ElectedPlans[i][2][38];
				break;			
			case 6:					
			case 7:			
			case 8:				
			case 9:	
			case 10:
				planType2 = parent.ElectedPlans[i][2][38];
				planCode2 = parent.ElectedPlans[i][2][39];
				break;	
			case 12:
				planType2 = parent.ElectedPlans[i][2][1];
				planCode2 = parent.ElectedPlans[i][2][2];
				break;			
			default:
				break;
		}		
		if (planType1==planType2 && planCode1==planCode2)
			return true;	
	}	
	for (var i=1; i<parent.EligPlans.length; i++)
	{
		var planType2 = parent.EligPlans[i][1];
		var planCode2 = parent.EligPlans[i][2];		
		if (planType1==planType2 && planCode1==planCode2)
			return true;
	}
	return false;
}
var senttoPending=false
function addbensPending()
{
	if(updatetype=="ERR")
	{
		if(senttoPending)
		{
			var numCalls=(count==0)?0:Math.floor((count-1)/5)
			count=(numCalls*5)
			errorMsg=getSeaPhrase("UPDATEBEN_18","BEN")
				+" "+getSeaPhrase("COMPANY","BEN")
				+" "+parent.company
				+", "+getSeaPhrase("EMPLOYEE","BEN")
				+" "+parent.employee
				+" "+parent.firstname+" "+parent.lastname
				+"\n\n"+getSeaPhrase("UPDATEBEN_49","BEN")
			finishupdate()
			return
		}
		if(lastFunc=="stopbensImmediate")
		{
			updatetype="UPD"
			var numCalls=(cnt5==0)?0:Math.floor((cnt5-1)/20)
			count=(numCalls*20)
			planstoPend = planstoStop
			errorMsg=getSeaPhrase("UPDATEBEN_18","BEN")
				+" "+getSeaPhrase("COMPANY","BEN")
				+" "+parent.company
				+", "+getSeaPhrase("EMPLOYEE","BEN")
				+" "+parent.employee
				+" "+parent.firstname+" "+parent.lastname
				+"\n\n"+getSeaPhrase("UPDATEBEN_47","BEN")
			addbensPending()
		}
		else if(lastFunc=="deletebensPending")
		{
			var numCalls=(cnt2==0)?0:Math.floor((cnt2-1)/5)
			count=(numCalls*5)
			errorMsg=getSeaPhrase("UPDATEBEN_18","BEN")
				+" "+getSeaPhrase("COMPANY","BEN")
				+" "+parent.company
				+", "+getSeaPhrase("EMPLOYEE","BEN")
				+" "+parent.employee
				+" "+parent.firstname+" "+parent.lastname
				+"\n\n"+getSeaPhrase("UPDATEBEN_48","BEN")
			finishupdate()
		}
		else
		{
			if(errorMsg=="")
			{
				errorMsg=getSeaPhrase("UPDATEBEN_18","BEN")
				+" "+getSeaPhrase("COMPANY","BEN")
				+" "+parent.company
				+", "+getSeaPhrase("EMPLOYEE","BEN")
				+" "+parent.employee
				+" "+parent.firstname+" "+parent.lastname
				+"\n\n"+getSeaPhrase("UPDATEBEN_46","BEN")
			}
			finishupdate()
		}
	}
	else
	{
		if(planstoPend[count]!=null)
		{
			//alert("addbensPending -- bs31.1")
			var obj = new AGSObject(parent.prodline,"BS31.1")
			obj.event="ADD"
			obj.debug=false
			obj.rtn="MESSAGE"
			obj.longNames=true
			obj.tds=false
			obj.field="FC=A"
				+ "&BNB-COMPANY="+escape(parent.company)
				+ "&BNB-EMPLOYEE="+escape(parent.employee)
			if(lastFunc=="stopbensImmediate" && planstoPend == planstoStop)
			{
				if(parent.BenefitRules[7]=="Y")
					obj.func="parent.addbensImmediate(0)"
				else
					obj.func="parent.addbensPending()"
			}
			else
				obj.func="parent.finishupdate()"
			for(var k=1;k<6;k++)
			{
				if(planstoPend[count]!=null)
				{
					var arr = new Array()
					arr=FormatPlan(count,planstoPend)
					if(lastFunc=="stopbensImmediate" && planstoPend==planstoStop)
					{
						arr[11]=escape(planstoPend[count][5])
						if(planstoPend[count][10]=="D")
						{
							errorMsg=getSeaPhrase("UPDATEBEN_18","BEN")
								+" "+getSeaPhrase("COMPANY","BEN")
								+" "+parent.company
								+", "+getSeaPhrase("EMPLOYEE","BEN")
								+" "+parent.employee
								+" "+parent.firstname+" "+parent.lastname
								+"\n\n"+getSeaPhrase("UPDATEBEN_50","BEN")
							finishupdate()
							return
						}
					}
					if(arr[4]!="")
					{
						if(arr[21].split('+').length)
							arr[21] = arr[21].split('+').join('*')
						arr[24]="0"+arr[24]
						arr[25]="0"+arr[25]
						arr[26]="0"+arr[26]
						obj.field+="&LINE-FC"+k+"=A"
							+"&BNB-FNCTION"+k+"="		+arr[0]
//							+"&BNB-COMPANY"+k+"="		+arr[1]
							+"&BNB-ENROLL-DATE"+k+"="	+arr[2]
//							+"&BNB-EMPLOYEE"+k+"="		+arr[3]
							+"&BNB-PLAN-TYPE"+k+"="	+arr[4]
							+"&BNB-PLAN-CODE"+k+"="	+arr[5]
							+"&BNB-COVER-OPT"+k+"="	+arr[6]
							+"&BNB-MULT-SALARY"+k+"="	+arr[7]
							+"&BNB-COVER-AMT"+k+"="	+arr[8]
							+"&BNB-PAY-RATE"+k+"="		+arr[9]
							+"&BNB-PCT-AMT-FLAG"+k+"="	+arr[10]
							+"&BNB-START-DATE"+k+"="	+arr[11]
							+"&BNB-PRE-AFT-FLAG"+k+"="	+arr[12]
							+"&BNB-SMOKER-FLAG"+k+"="	+arr[13]
							+"&BNB-EMP-PRE-CONT"+k+"="	+arr[14]
							+"&BNB-EMP-AFT-CONT"+k+"="	+arr[15]
							+"&BNB-STOP-DATE"+k+"="	+arr[16]
							+"&BNB-PEND-EVIDENCE"+k+"="	+arr[17]
							+"&BNB-YTD-CONT"+k+"="		+arr[18]
							+"&BNB-RECORD-TYPE"+k+"="	+arr[19]
							+"&BNB-PLAN-GROUP"+k+"="	+arr[20]
							+"&BNB-COP-COV-DESC"+k+"="	+arr[21]
							+"&BNB-DEP-COVER-AMT"+k+"="	+arr[22]
							+"&BNB-COV-PCT"+k+"="		+arr[23]
							+"&BNB-FLEX-COST"+k+"="	+arr[24]
							+"&BNB-EMP-COST"+k+"="		+arr[25]
							+"&BNB-COMP-COST"+k+"="	+arr[26]
							+"&BNB-UPDATE-DATE"+k+"="	+arr[27]
							+"&BNB-ALPHADATA1"+k+"="	+arr[28]
							+"&BNB-NUMERIC1"+k+"="		+arr[29]
							+"&BNB-DATE1"+k+"="		+arr[30]
							+"&BNB-PLAN-DESC"+k+"="	+arr[31]
							+"&BNB-USER-ID"+k+"=W"		+arr[3]
							+"&BNB-CREATE-TRANS"+k+"="	+arr[33]
						if (arr[33]=="Y" || arr[33]=="P")
						{
							obj.field+="&BNB-TRAN-REASON"+k+"="+arr[34]
							+ "&BNB-MEMBER-ID"+k+"="+arr[35]
						}
						if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "08.01.01")
						{
							if (parent.rule_type == "N")
								obj.field+="&BNB-BN-TYPE"+k+"=3"; // New Hire benefit type
							else if (parent.rule_type == "F")
								obj.field+="&BNB-BN-TYPE"+k+"=2"; // Life Event benefit type
							else
								obj.field+="&BNB-BN-TYPE"+k+"=1"; // Annual benefit type
						}
						planUpdated[String(arr[4])+String(arr[5])] = true
					}
					count++
				}
			}
			if(planstoPend[count]!=null)
			{
				obj.func="parent.addbensPending()"
			}
			else
			{
				count=0
				senttoPending=true
				if(parent.BenefitRules[7]!="Y")
					planstoPend = parent.ElectedPlans
			}
			updatetype = "UPD"
			AGS(obj,"bnreturn")
		}
		else
		{
			senttoPending=false
			finishupdate()
		}
	}
}
function PostFixOp(Num)
{
	if (Num == "") return Num
	var Nbr = unescape(Num)
	if(!isNaN(parseFloat(Nbr)) && parseFloat(Nbr) < 0)
		Num = escape(Math.abs(parseFloat(Nbr))+"-")
	return Num
}
function FormatPlan(index,plans)
{
	var paydivisor=1
	var PlanArray = new Array()
	if(plans)
		PlanArray = plans
	else
		PlanArray = parent.ElectedPlans
	var arr = new Array()
	if(PlanArray==planstoStop)
		arr[0]="S"
	else if(PlanArray==planstoDelete)
		arr[0]="D"
	else
		arr[0]="A"							//add, delete, or stop
	arr[1]=parent.company							//company
	arr[2]=""								//today's date
	arr[3]=parent.employee							//emp number
	arr[4]=""
	arr[5]=""
	arr[6]=""
	arr[7]=""
	arr[8]=""
	arr[9]=""
	arr[10]=""
	if(parent.rule_type=="A")
		arr[11]=escape(parent.BenefitRules[2])				//start date
	else
		arr[11]=escape(PlanArray[index][5])				//start date
	arr[12]=""
	arr[13]=""
	arr[14]=""
	arr[15]=""
	arr[16]=""
	arr[17]=""
	arr[18]=""
	arr[19]=escape(PlanArray[index][0])					//rec type
	arr[20]=escape(PlanArray[index][3])					//plan group
	arr[21]=""
	arr[22]=""
	arr[23]=""
	arr[24]=""
	arr[25]=""
	arr[26]=""
	arr[27]=escape(parent.ymdtoday)
	arr[28]=""
	arr[29]=""
	arr[30]=""
	arr[31]=escape(PlanArray[index][1])
	arr[32]=""
	if(PlanArray[index][7])							//hipaa create trans flag
		arr[33]=escape(PlanArray[index][7])
	else
		arr[33]=""
	if(PlanArray[index][8])							//hipaa reason code
		arr[34]=escape(PlanArray[index][8],1)
	else
		arr[34]=""
	if(PlanArray[index][9])							//hipaa member id
		arr[35]=escape(PlanArray[index][9],1)
	else
		arr[35]=""
	if(parseFloat(PlanArray[index][0])==1)
	{
		arr[4]=escape(PlanArray[index][2][11],1).toString().replace("+","%2B")
		arr[5]=escape(PlanArray[index][2][12],1).toString().replace("+","%2B")
		arr[6]=escape(PlanArray[index][2][1])
		// PT 176746. Do not update pct/amt value for record type 1 plan. 
		// The back office should figure this out based on the plan setup.		
		//arr[10]=escape(PlanArray[index][2][24])
		arr[12]=escape(PlanArray[index][2][3])
		arr[21]=escape(PlanArray[index][2][2])
		arr[24]=escape(parent.roundToPennies(PlanArray[index][2][6]))
		arr[25]=escape(parent.roundToPennies(PlanArray[index][2][5]))
		arr[26]=escape(parent.roundToPennies(PlanArray[index][2][8]))
	}
	if(parseFloat(PlanArray[index][0])==2)
	{
		arr[4]=escape(PlanArray[index][2][37],1).toString().replace("+","%2B")	//plan type
		arr[5]=escape(PlanArray[index][2][38],1).toString().replace("+","%2B")	//plan code
		arr[8]=escape(parent.roundToPennies(PlanArray[index][2][14]))	//cover amt
		arr[10]=escape(PlanArray[index][2][51])
		arr[12]=escape(PlanArray[index][2][15])				//pre aft flag
		arr[22]=escape(parent.roundToPennies(PlanArray[index][2][7]))	//dep cover amt
		arr[24]=escape(parent.roundToPennies(PlanArray[index][2][20]))	//flex cost
		arr[25]=escape(parent.roundToPennies(PlanArray[index][2][18]))	//emp cost
		arr[26]=escape(parent.roundToPennies(PlanArray[index][2][24]))	//comp cost
	}
	if(parseFloat(PlanArray[index][0])==3 || parseFloat(PlanArray[index][0])==13)
	{
		arr[4]=escape(PlanArray[index][2][37],1).toString().replace("+","%2B")	//plan type
		arr[5]=escape(PlanArray[index][2][38],1).toString().replace("+","%2B")	//plan code
		if (parseFloat(PlanArray[index][0])==3)
			arr[7]=escape(PlanArray[index][2][17])
		if(parent.BenefitRules[7]!="Y" || (PlanArray == planstoPend &&
			planstoPend == parent.ElectedPlans && lastFunc=="addbensImmediate"))
			arr[8]=escape(parent.roundToPennies(PlanArray[index][2][14]))
		arr[10]=escape(PlanArray[index][2][51])
		arr[12]=escape(PlanArray[index][2][15])
		arr[24]=escape(parent.roundToPennies(PlanArray[index][2][20]))	//flex cost
		arr[25]=escape(parent.roundToPennies(PlanArray[index][2][18]))	//emp cost
		arr[26]=escape(parent.roundToPennies(PlanArray[index][2][24]))	//comp cost
	}
	if(parseFloat(PlanArray[index][0])==4)
	{
		arr[4]=escape(PlanArray[index][2][37],1).toString().replace("+","%2B")	//plan type
		arr[5]=escape(PlanArray[index][2][38],1).toString().replace("+","%2B")	//plan code
		arr[8]=escape(parent.roundToPennies(PlanArray[index][2][17]))
		arr[10]=escape(PlanArray[index][2][51])
		arr[12]=escape(PlanArray[index][2][15])
		arr[24]=escape(parent.roundToPennies(PlanArray[index][2][20]))	//flex cost
		arr[25]=escape(parent.roundToPennies(PlanArray[index][2][18]))	//emp cost
		arr[26]=escape(parent.roundToPennies(PlanArray[index][2][24]))	//comp cost
	}
	if(parseFloat(PlanArray[index][0])==5)
	{
		arr[4]=escape(PlanArray[index][2][37],1).toString().replace("+","%2B")	//plan type
		arr[5]=escape(PlanArray[index][2][38],1).toString().replace("+","%2B")	//plan code
		arr[10]=escape(PlanArray[index][2][51])
		arr[12]=escape(PlanArray[index][2][15])
		arr[23]=escape(parent.roundToPennies(PlanArray[index][2][12]))
		arr[24]=escape(parent.roundToPennies(PlanArray[index][2][20]))	//flex cost
		arr[25]=escape(parent.roundToPennies(PlanArray[index][2][18]))	//emp cost
		arr[26]=escape(parent.roundToPennies(PlanArray[index][2][24]))	//comp cost
	}
	if(parseFloat(PlanArray[index][0])==6)
	{
		arr[4]=escape(PlanArray[index][2][38],1).toString().replace("+","%2B")	//plan type
		arr[5]=escape(PlanArray[index][2][39],1).toString().replace("+","%2B")	//plan code
		arr[10]=escape(PlanArray[index][2][24])
		arr[12]=escape(PlanArray[index][2][26])
		arr[24]=escape(parent.roundToPennies(PlanArray[index][2][18]))	//flex cost
		arr[25]=escape(parent.roundToPennies(PlanArray[index][2][16]))	//emp cost
		arr[26]=escape(parent.roundToPennies(PlanArray[index][2][22]))
		arr[9]=escape(PlanArray[index][2][23])
		arr[10]=escape(PlanArray[index][2][24])
		if(typeof(PlanArray[index][2][40])!="undefined" && PlanArray[index][2][40]!=null
			&& PlanArray[index][2][40]!="")
		{
			arr[6]=escape(PlanArray[index][2][40])			//nbr cycles
		}
		if(typeof(PlanArray[index][2][43])!="undefined" && PlanArray[index][2][43]!=null
			&& PlanArray[index][2][43]!="")
		{
			arr[8]=escape(PlanArray[index][2][43])
		}
	}
	if(parseFloat(PlanArray[index][0])==7)
	{
		arr[4]=escape(PlanArray[index][2][38],1).toString().replace("+","%2B")	//plan type
		arr[5]=escape(PlanArray[index][2][39],1).toString().replace("+","%2B")	//plan code
		arr[10]=escape(PlanArray[index][2][24])
		arr[12]=escape(PlanArray[index][2][26])
		arr[7]=escape(PlanArray[index][2][23])
		arr[24]=escape(parent.roundToPennies(PlanArray[index][2][18]))	//flex cost
		arr[25]=escape(parent.roundToPennies(PlanArray[index][2][16]))	//emp cost
		arr[26]=escape(parent.roundToPennies(PlanArray[index][2][22]))	//comp cost
		arr[6]=escape(PlanArray[index][2][37])				//nbr cycles
	}
	if(parseFloat(PlanArray[index][0])==8 || parseFloat(PlanArray[index][0])==9)
	{
		// Multiply PRE-CONT and AFT-CONT amounts by cost divisor before updating server
		paydivisor=1
		if(parent.BenefitRules[6]=="P")
			paydivisor=PlanArray[index][2][37]
		else if(parent.BenefitRules[6]=="M")
			paydivisor=12
		else if(parent.BenefitRules[6]=="S")
			paydivisor=24
		var empPreTaxCont = PlanArray[index][2][23];
		var empAftTaxCont = PlanArray[index][2][36];
		if(PlanArray[index][2][24]=="A" || PlanArray[index][2][24]=="B")
		{
			if(empPreTaxCont!="") empPreTaxCont*=parseFloat(paydivisor)
			if(empAftTaxCont!="") empAftTaxCont*=parseFloat(paydivisor)
		}
		arr[4]=escape(PlanArray[index][2][38],1).toString().replace("+","%2B")		//plan type
		arr[5]=escape(PlanArray[index][2][39],1).toString().replace("+","%2B")		//plan code
		var v2=0+""
		if(empAftTaxCont!="")
			v2=empAftTaxCont+""
		if(v2.indexOf("%")!=-1)
			v2=v2.substring(0,v2.indexOf("%"))
		var vl=0+""
		if(empPreTaxCont!="")
			vl=empPreTaxCont+""
		if(vl.indexOf("%")!=-1)
			vl=vl.substring(0,vl.indexOf("%"))
		if(empPreTaxCont!="" && empAftTaxCont!="")
		{
			arr[12]="B"
			arr[14]=escape(parent.roundToPennies(parseFloat(vl))) // pre-tax contribution
			arr[15]=escape(parent.roundToPennies(parseFloat(v2))) // after-tax contribution
			if(!isNaN(parseFloat(vl)) && !isNaN(parseFloat(v2)))
				arr[9]=escape(parent.roundToPennies(parseFloat(vl)+parseFloat(v2))) // annual contribution
		}
		else
		{
			if(empPreTaxCont!="")
			{
				// PT 166907. Update the pay period amount rather than the annual amount 
				// if the employee has elected only a pre-tax amount contribution.
				if (PlanArray[index][2][24]=="P")
				{
					arr[14]=escape(parent.roundToPennies(parseFloat(vl))) // pre-tax contribution
					arr[9]=escape(parent.roundToPennies(parseFloat(vl)))  // annual contribution
				}
				else
				{
					arr[14]=escape(parent.roundToPennies(parseFloat(vl))) // pre-tax contribution
					arr[8]=escape(parent.roundToPennies(parseFloat(PlanArray[index][2][23]))) // pay period contribution
				}
				arr[12]="P"
			}
			if(empAftTaxCont!="")
			{
				// PT 166907. Update the pay period amount rather than the annual amount 
				// if the employee has elected only an after-tax amount contribution. 
				if (PlanArray[index][2][24]=="P")
				{
					arr[15]=escape(parent.roundToPennies(parseFloat(v2))) // after-tax contribution
					// PT 166907. Round annual amount to two decimal places.
					if(!isNaN(parseFloat(vl)) && !isNaN(parseFloat(v2)))
						arr[9]=escape(parent.roundToPennies(parseFloat(vl)+parseFloat(v2))) // annual contribution
				}
				else
				{
					arr[15]=escape(parent.roundToPennies(parseFloat(v2))) // after-tax contribution
					arr[8]=escape(parent.roundToPennies(parseFloat(PlanArray[index][2][36]))) // pay period contribution
				}
				arr[12]="A"
			}
		}
		// only update pctamt flag and nbr cycles if a non-zero contribution exists
		// PT 166907.  Look for either an annual or pay period contribution.
		if ((!isNaN(unescape(arr[9])) && unescape(arr[9])!=0) || (!isNaN(unescape(arr[8])) && unescape(arr[8])!=0))
		{
			arr[10]=escape(PlanArray[index][2][24])				//pctamt
			if(PlanArray[index][2][24]!="P" && PlanArray[index][2][37] && Number(PlanArray[index][2][37]) != 1)
				arr[6]=escape(PlanArray[index][2][37])			//nbr cycles
		}
		arr[24]=escape(parent.roundToPennies(PlanArray[index][2][18]))		//flex cost
//		arr[25]=parseFloat(arr[9])/parseFloat(PlanArray[index][2][37])		//emp cost
		arr[26]=escape(parent.roundToPennies(PlanArray[index][2][22]))
		arr[32]=escape(PlanArray[index][2][37])
	}
	if(parseFloat(PlanArray[index][0])==10)
	{
		arr[4]=escape(PlanArray[index][2][38],1).toString().replace("+","%2B")	//plan type
		arr[5]=escape(PlanArray[index][2][39],1).toString().replace("+","%2B")	//plan code
		arr[10]=escape(PlanArray[index][2][24])
		arr[12]=escape(PlanArray[index][2][26])
		arr[24]=escape(parent.roundToPennies(PlanArray[index][2][18]))		//flex cost
		arr[25]=escape(parent.roundToPennies(PlanArray[index][2][16]))		//emp cost
		arr[26]=escape(parent.roundToPennies(PlanArray[index][2][22]))		//comp cost
	}
	if(parseFloat(PlanArray[index][0])==12)
	{
		arr[4]=escape(PlanArray[index][2][1],1).toString().replace("+","%2B")
		arr[5]=escape(PlanArray[index][2][2],1).toString().replace("+","%2B")
	}
	for(var i=0;i<32;i++)
	{
		if(typeof(arr[i])=="undefined" || arr[i]==null || arr[i]=="undefined")
			arr[i]=""
	}
	if(arr[12]=="Pre-Tax")
		arr[12]="P"
	else if(arr[12]=="After-Tax")
		arr[12]="A"
	if(arr[12]!="P" && arr[12]!="B" && arr[12]!="A")
		arr[12]=""
	arr[14] = PostFixOp(arr[14])
	arr[15] = PostFixOp(arr[15])
	arr[25] = PostFixOp(arr[25])
	return (arr)
}
var tempDepBens=new Array()
var startdate=""
function updateDepBens()
{
	var msg = "";
	var newEmpPlanAdded = false;
	if(updatetype=="ERR")
	{
		finishupdate()
	}
	else
	{
		for(var i=0;i<parent.DependentBens.length;i++)
		{
			startdate = '';
			newEmpPlanAdded = false;
			if( parent.DependentBens[i]==null ||
				typeof(parent.DependentBens[i])=="undefined" ||
				parent.DependentBens[i][0]==3)
					continue
			if(parent.ElectedPlans[i]!=null)
			{
				var tmpArr = FormatPlan(i);
				newEmpPlanAdded = (planUpdated[String(tmpArr[4])+String(tmpArr[5])])?true:false;
				
				if(parent.rule_type=="N")
					startdate=parent.ElectedPlans[i][5]
				else if(typeof(parent.ElectedPlans[i][4])!="undefined")
				{
					switch(parent.ElectedPlans[i][4][0])
					{
						case 4:	startdate=parent.ElectedPlans[i][4][2]; break;
						case 1:	startdate=parent.ElectedPlans[i][4][1]; break;
					}
				}
			}
			//if startdate did not get filled then fill it with the date specified in Benefit Rules
			if( startdate=="" || startdate==" " || startdate=="0" || startdate==null || typeof(startdate)=="undefined" || startdate=="undefined")
			{
				startdate=parent.BenefitRules[2]
			}
			if(parent.DependentBens[i][0]!=5)	//if they did not choose to add or change dependents
			{
				for(var x=0;x<parent.DependentBens[i][1].length;x++)
				{
					// PT 101599
					// only re-add a dependent benefit if a new employee benefit is being added
					if(newEmpPlanAdded)
					{
						parent.DependentBens[i][1][x].fc="A"
						parent.DependentBens[i][1][x].plan=i
						parent.DependentBens[i][1][x].empstart=startdate
						parent.DependentBens[i][1][x].startdate=startdate
						parent.DependentBens[i][1][x].stopdate=" "
					}
					else
					{
						parent.DependentBens[i][1][x].fc=""
						parent.DependentBens[i][1][x].plan=i
					}
				}
				tempDepBens[tempDepBens.length]=parent.DependentBens[i]
			}
			else
			{
				//employee chose to add or change dependents; we need to figure if we are stopping, adding or leaving alone
				for(var j=0;j<parent.DependentBens[i][1].length;j++)
				{
					parent.DependentBens[i][1][j].fc="x"
					parent.DependentBens[i][1][j].plan=i
					parent.DependentBens[i][1][j].empstart=parent.CurrentBens[parent.DependentBens[i][2]][3]
					parent.DependentBens[i][1][j].startdate=" "
					parent.DependentBens[i][1][j].stopdate=" "
				}
				// if a new employee benefit is not being added, create new dependent benefit records
				// for those that the user has added, leave the ones that have not been changed,
				// and change the ones that have been dropped
				// otherwise, create new add records for all dependents (loop below this one)
				if (!newEmpPlanAdded && parent.oldDepBens[i])
				{
					for(var x=0;x<parent.oldDepBens[i].length;x++)
					{
						stopdep=0
						stopindex=-1
						for(var j=0;j<parent.DependentBens[i][1].length;j++)
						{
							//current bens dependent does not exist in old dep bens
							if(parseInt(parent.oldDepBens[i][x].dependent,10)==parseInt(parent.DependentBens[i][1][j].dependent,10))
							{
								stopdep=1;
								stopindex=j
								break;
							}
						}
						if(stopdep==0)
						{
							//dependent found in old dep bens that was not elected for new ben
							parent.DependentBens[i][1][parent.DependentBens[i][1].length]=new depBenObj(parent.oldDepBens[i][x].dependent)
							parent.DependentBens[i][1][parent.DependentBens[i][1].length-1].fc="C"
							parent.DependentBens[i][1][parent.DependentBens[i][1].length-1].plan=i
							parent.DependentBens[i][1][parent.DependentBens[i][1].length-1].empstart=parent.CurrentBens[parent.DependentBens[i][2]][3]
							parent.DependentBens[i][1][parent.DependentBens[i][1].length-1].startdate=parent.formjsDate(parent.oldDepBens[i][x].start_date+"")
							if (parent.event == "annual" || parent.rule_type == "N")
							{
								parent.DependentBens[i][1][parent.DependentBens[i][1].length-1].stopdate = stopdate;
							}
							else
							{
								// reset the dependent benefit stop date; it may need to be stopped earlier due to a dependent or student age limit
								var depStopDate = parent.CurrentBens[parent.DependentBens[i][2]][0][3]; // life event stop date
								var oldDepStopDate = parent.formjsDate(parent.formatDME(parent.oldDepBens[i][x].stop_date));
								if (oldDepStopDate && oldDepStopDate  < depStopDate)
								{
									depStopDate = parent.setStopDate(oldDepStopDate);
								}
								parent.DependentBens[i][1][parent.DependentBens[i][1].length-1].stopdate = depStopDate;
							}
							//stop dependent from olddep array
						}
						else // dependent was elected before and still is; do not update
						{
							parent.DependentBens[i][1][stopindex].fc=""
						}
					}
				}

				for(var x=0;x<parent.DependentBens[i][1].length;x++)
				{
					// Always add any elected dependents, unless they have been dropped.
					if(parent.DependentBens[i][1][x].fc=="x")
					{
						//current bens dependent does not exist in old dep bens
						parent.DependentBens[i][1][x].fc="A"
						parent.DependentBens[i][1][x].plan=i
						if(parent.event=="annual")
							parent.DependentBens[i][1][x].empstart=escape(parent.BenefitRules[2])
						else
							parent.DependentBens[i][1][x].empstart=parent.CurrentBens[parent.DependentBens[i][2]][3]
						if(parent.event=="annual" || parent.rule_type=="N")
							parent.DependentBens[i][1][x].startdate=parent.BenefitRules[2]
						else
						{
							//PT 165880.  Use the life event change date set up on BS03.2 for any dependents being added to 
							// an existing employee benefit.
							parent.DependentBens[i][1][x].startdate=parent.CurrentBens[parent.DependentBens[i][2]][0][2] // life event change date
						}
						parent.DependentBens[i][1][x].stopdate=" "
					}
				}
				tempDepBens[tempDepBens.length]=parent.DependentBens[i]
			}
		}
		depbens="no"
		if(parent.BenefitRules[7]=="Y" && !gotError)
			processDepsImmediate()
		else
			processDepsPending()
	}
}
var cnt55=0
var cnt33=1
var cnt44=1
function processDepsImmediate()
{
	if(updatetype=="ERR")
	{
		if(lastFunc=="processDepsImmediate")
		{
			updatetype="UPD"
			cnt33=1
			cnt6=0
			cnt7=0
			errorMsg=getSeaPhrase("UPDATEBEN_18","BEN")
				+" "+getSeaPhrase("COMPANY","BEN")
				+" "+parent.company
				+", "+getSeaPhrase("EMPLOYEE","BEN")
				+" "+parent.employee
				+" "+parent.firstname+" "+parent.lastname
				+"\n\n"+getSeaPhrase("UPDATEBEN_44","BEN")
			processDepsPending()
		}
		else
		{
			if(errorMsg=="")
			{
				errorMsg=getSeaPhrase("UPDATEBEN_18","BEN")
				+" "+getSeaPhrase("COMPANY","BEN")
				+" "+parent.company
				+", "+getSeaPhrase("EMPLOYEE","BEN")
				+" "+parent.employee
				+" "+parent.firstname+" "+parent.lastname
				+"\n\n"+getSeaPhrase("UPDATEBEN_51","BEN")
			}
			FinalScreen(gotError)
		}
	}
	else
	{
		lastFunc = "processDepsImmediate"
		var callit=0
		cnt44=1
		if(typeof(tempDepBens[cnt6])!="undefined" && tempDepBens[cnt6]!=null && tempDepBens[cnt6][1][0]!=null)
		{
			var arr=new Array()
			arr=FormatPlan(tempDepBens[cnt6][1][0].plan)
			var obj = new AGSObject(parent.prodline,"HR13.3")
			obj.event="CHANGE"
			obj.rtn="DATA"
			obj.debug=false
			obj.longNames=true
			obj.tds=false
			obj.field="FC=C"
				+ "&BEN-COMPANY=" + escape(parent.company)
				+ "&BEN-EMPLOYEE=" + escape(parent.employee)
				+ "&BEN-PLAN-TYPE=" + arr[4]
				+ "&BEN-PLAN-CODE=" + arr[5]
				+ "&BEN-START-DATE=" + escape(tempDepBens[cnt6][1][0].empstart)
			if(cnt6<tempDepBens.length)
			{
				cnt44=1
				//Stop dependents we are changing
				for(var x=cnt7;x<tempDepBens[cnt6][1].length;x++)
				{
					if( typeof(tempDepBens[cnt6][1])!="undefined" &&
						typeof(tempDepBens[cnt6][1][x])!="undefined" &&
						tempDepBens[cnt6][1][x].fc!="x" && 
						tempDepBens[cnt6][1][x].fc!="" &&
						cnt44<11)
					{
						 callit=1
						 obj.field+="&LINE-FC"+(cnt44)+"="+tempDepBens[cnt6][1][x].fc
							+"&HDB-DEPENDENT"+(cnt44)+"="+escape(parseInt(tempDepBens[cnt6][1][x].dependent,10))
							+"&HDB-START-DATE"+(cnt44)+"="+escape(tempDepBens[cnt6][1][x].startdate)
							+"&HDB-STOP-DATE"+(cnt44)+"="+escape(tempDepBens[cnt6][1][x].stopdate)
							+"&HDB-USER-ID"+(cnt44)+"=W"+escape(parent.employee)
							+ "&BNT-CREATE-TRANS"+(cnt44)+"="+arr[33]
						if (arr[33]=="Y" || arr[33]=="P")
						{
							obj.field+="&BNT-REASON"+(cnt44)+"="+arr[34]
							+"&BNT-MEMBER-ID"+(cnt44)+"="+arr[35]
						}
						cnt44++
						if(cnt44==11)
						{
							if(x==tempDepBens[cnt6][1].length-1)
								cnt7=0
							else
								cnt7=x+1
							break
						}
					}
				}
				if(x==tempDepBens[cnt6][1].length) cnt7=0
			}
			if(cnt7==0)
				cnt6++
			if(cnt6<tempDepBens.length)
				obj.func="parent.processDepsImmediate()"
			else
				obj.func="parent.finishupdate()"
			obj.dtlField = "LINE-FC;HDB-DEPENDENT;HDB-START-DATE;HDB-STOP-DATE;HDB-USER-ID;BNT-CREATE-TRANS;BNT-REASON;BNT-MEMBER-ID"
			if(callit==1)
			{
				updatetype = "UPD"
				AGS(obj,"bnreturn")
			}
			else
			{
				if(cnt6<tempDepBens.length)
					processDepsImmediate()
				else
					finishupdate()
			}
		}
		else
		{
			cnt6++
			if(cnt6<tempDepBens.length)
				processDepsImmediate()
			else
				finishupdate()
		}
	}
}

function processDepsPending()
{
	if(updatetype=="ERR")
	{
		if(senttoPending)
		{
			errorMsg=getSeaPhrase("UPDATEBEN_18","BEN")
				+" "+getSeaPhrase("COMPANY","BEN")
				+" "+parent.company
				+", "+getSeaPhrase("EMPLOYEE","BEN")
				+" "+parent.employee
				+" "+parent.firstname+" "+parent.lastname
				+"\n\n"+getSeaPhrase("UPDATEBEN_45","BEN")
			FinalScreen(gotError)
			return
		}
		else
		{
			if(errorMsg=="")
			{
				errorMsg=getSeaPhrase("UPDATEBEN_18","BEN")
				+" "+getSeaPhrase("COMPANY","BEN")
				+" "+parent.company
				+", "+getSeaPhrase("EMPLOYEE","BEN")
				+" "+parent.employee
				+" "+parent.firstname+" "+parent.lastname
				+"\n\n"+getSeaPhrase("UPDATEBEN_51","BEN")
			}
			FinalScreen(gotError)
			return
		}
	}
	else
	{
		var callit=0
		cnt33=1
		lastFunc = "processDepsPending"
		if(typeof(tempDepBens[cnt6])!="undefined")
		{
			var obj = new AGSObject(parent.prodline,"BS30.1")
			obj.event="ADD"
			obj.debug=false
			obj.rtn="DATA"
			obj.longNames=true
			obj.tds=false
			obj.field="FC=A"
				+ "&DEP-COMPANY=" + escape(parent.company)
				+ "&DEP-EMPLOYEE=" + escape(parent.employee)
			for(var z=cnt6;z<tempDepBens.length;z++)
			{
				//if(tempDepBens[z]==null || typeof(tempDepBens[z])=="undefined")
				//	continue
				for(var x=cnt7;x<tempDepBens[z][1].length;x++)
				{
					if( typeof(tempDepBens[z][1])!="undefined" &&
						typeof(tempDepBens[z][1][x])!="undefined" &&
						tempDepBens[z][1][x].fc!="x" &&
						tempDepBens[z][1][x].fc!="" &&
						cnt33<19)
					{
						callit=1
						var arr=new Array()
						var temp=tempDepBens[z][1][x].plan
						arr=FormatPlan(temp)
						obj.field+="&LINE-FC"+(cnt33)+"=A"
								   +"&DEP-FNCTION"+(cnt33)+"="+escape(tempDepBens[z][1][x].fc)
								   +"&DEP-DEPENDENT"+(cnt33)+"="+escape(parseInt(tempDepBens[z][1][x].dependent,10))
								   +"&DEP-PLAN-TYPE"+(cnt33)+"="+arr[4]
								   +"&DEP-PLAN-CODE"+(cnt33)+"="+arr[5]
								   +"&DEP-EMP-START"+(cnt33)+"="+escape(tempDepBens[z][1][x].empstart)
								   +"&DEP-START-DATE"+(cnt33)+"="+escape(tempDepBens[z][1][x].startdate)
								   +"&DEP-STOP-DATE"+(cnt33)+"="+escape(tempDepBens[z][1][x].stopdate)
								   +"&DEP-USER-ID"+(cnt33)+"=W"+escape(parent.employee)
								   +"&DEP-CREATE-TRANS"+(cnt33)+"="+arr[33]
						if (arr[33]=="Y" || arr[33]=="P")
						{
							obj.field+="&DEP-TRAN-REASON"+(cnt33)+"="+arr[34]
							+ "&DEP-MEMBER-ID"+(cnt33)+"="+arr[35]
						}	
						if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "08.01.01")
						{
							if (parent.rule_type == "N")
								obj.field+="&DEP-BN-TYPE"+(cnt33)+"=3"; // New Hire benefit type
							else if (parent.rule_type == "F")
								obj.field+="&DEP-BN-TYPE"+(cnt33)+"=2"; // Life Event benefit type
							else
								obj.field+="&DEP-BN-TYPE"+(cnt33)+"=1"; // Annual benefit type
						}						
						cnt33++
						if(cnt33==19)
						{
							if(x==tempDepBens[z][1].length-1)
							{
								cnt6=z+1
								cnt7=0
							}
							else
							{
								cnt6=z
								cnt7=x+1
							}
							break
						}
					}
					if(x==tempDepBens[z][1].length-1) cnt7=0
				}
				if(cnt33==19) break
			}
			if(z==tempDepBens.length)
				cnt6=z
			if(cnt6<tempDepBens.length)
				obj.func="parent.processDepsPending()"
			else
				obj.func="parent.finishupdate()"
			obj.dtlField = "LINE-FC;DEP-FNCTION;DEP-DEPENDENT;DEP-PLAN-TYPE;DEP-PLAN-CODE;DEP-EMP-START;DEP-START-DATE;DEP-STOP-DATE;DEP-USER-ID;"
			+"DEP-CREATE-TRANS;DEP-TRAN-REASON;DEP-MEMBER-ID;DEP-BN-TYPE";
			if(callit==1)
			{
				senttoPending=true
				updatetype = "UPD"
				AGS(obj,"bnreturn")
			}
			else
			{
				senttoPending=false
				finishupdate()
			}
		}
		else
		{
			senttoPending=false
			finishupdate()
		}
	}
}
function depBenObj(dependent)
{
	this.dependent=dependent
}
function updateFSH()
{
	updatetype = "done"
	var obj = new AGSObject(parent.prodline,"ES10.1")
	obj.event="CHANGE"
	obj.rtn="MESSAGE"
	obj.longNames=false
	obj.tds=false
	obj.debug=false
	obj.field="FC=C"
		+ "&FSH-COMPANY=" + escape(parent.company)
		+ "&FSH-EMPLOYEE=" + escape(parent.employee)
		+ "&FSH-FAMILY-STATUS=" + escape(parent.eventname.toUpperCase())
		+ "&FSH-EFFECT-DATE="+parent.eventdte
		+ "&FSH-BENEFIT-UPDATE=Y"
	obj.func="parent.finishupdate()"
	AGS(obj,"bnreturn")
}

