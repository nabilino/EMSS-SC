// Version: 8-)@(#)@10.00.05.00.27
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/besscommon.js,v 1.32.2.82.2.3 2014/06/27 05:15:45 kevinct Exp $
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
function MultAndRound(Amount,RoundOnly,BefAftFlag,RoundMeth,RoundTo,SalaryMult,SalaryPct)
{
	var AmtRounded
	if (RoundOnly == "Y")
		AmtRounded = DoRounding(Amount,RoundMeth,RoundTo)
	else if (BefAftFlag == "B")
		AmtRounded = DoCalculation(DoRounding(Amount,RoundMeth,RoundTo),SalaryMult,SalaryPct)
	else
		AmtRounded = DoRounding(DoCalculation(Amount,SalaryMult,SalaryPct),RoundMeth,RoundTo)
	return roundToPennies(AmtRounded)
}
function DoRounding(Amount,RoundMeth,RoundTo)
{
	var RoundResult = Amount
	if (RoundMeth == "H")
		RoundResult = RoundHigh(Amount,RoundTo)
	else if (RoundMeth == "L")
		RoundResult = RoundLow(Amount,RoundTo)
	else if (RoundMeth == "R")
		RoundResult = RoundNormal(Amount,RoundTo)
	return RoundResult
}
function DoCalculation(Amount,SalaryMult,SalaryPct)
{
	var CalcResult
	if (SalaryMult != 0)
		CalcResult = Amount * SalaryMult
	else
		CalcResult = Amount * parseFloat(SalaryPct/100)
	return CalcResult
}
function RoundHigh(Amount,RoundTo)
{
	var Amt1, Amt2, Amt3, Amt4, NoDecimalAmt
	var Result = Amount
	Amt1 = Amount * 100000
	NoDecimalAmt = parseInt(Amount/RoundTo,10)
	Amt4 = NoDecimalAmt * RoundTo
	Amt2 = Amt4 * 100000
	Amt3 = Amt1 - Amt2
	if (Amt3 != 0)
		Result = Amt4 + RoundTo
	return Result
}
function RoundLow(Amount,RoundTo)
{
	var Amt1, Amt4, NoDecimalAmt
	Amt1 = Amount * 100000
	NoDecimalAmt = parseInt(Amount/RoundTo,10)
	Amt4 = NoDecimalAmt * RoundTo
	return Amt4
}
function RoundNormal(Amount,RoundTo)
{
	var Amt1, Amt2, Amt3, Amt4, Amt5, AmtDiff, AmtMid, NoDecimalAmt
	var Result = Amount
	if (RoundTo != 0)
	{
		Amt1 = Amount * 100000
		NoDecimalAmt = parseInt(Amount/RoundTo,10)
		Amt4 = NoDecimalAmt * RoundTo
		Amt2 = Amt4 * 100000
		Amt3 = Amt1 - Amt2
		if (Amt3 != 0)
		{
			Amt5 = parseInt(Amt3/100000,10)
			AmtDiff = RoundTo - Amt5
			AmtMid = parseInt(RoundTo/2,10)
			if (AmtDiff > AmtMid)
				Result = Amt4
			else
				Result = Amt4 + RoundTo
		}
	}
	return Result
}				
function isLeapYear(Year)
{
	Year = Number(Year)

	if ((Year % 4) != 0)
	    	return false
   	else if ((Year % 400) == 0)
	       	return true
   	else if ((Year % 100) == 0)
	       	return false
	else
		return true
}
function setStopDate(dte)
{
	dte=dte.toString()
	var yr=parseInt(dte.substring(0,4),10)
	var mnth=parseInt(dte.substring(4,6),10)
	var dy=parseInt(dte.substring(6,8),10)
	if(dy>1)
		dy--
	else
	{
		if(mnth>1)
		{
			mnth--
			if(mnth==2)
			{
				dy=(isLeapYear(yr))?29:28;
			}
			else dy=daysinmonth[mnth]
		}
		else
		{
			mnth=12
			dy=31
			yr--
		}
	}
	yr=yr.toString()
	mnth=mnth.toString()
	dy=dy.toString()
	if (mnth.length == 1)
		mnth = "0" + mnth
	if (dy.length == 1)
		dy = "0" + dy
	var ymddate = "" + yr + mnth + dy
	return ymddate
}
function isDepAgeEligible(termOpt, birthDate, ageLimit, benStartDate)
{
	termOpt = parseInt(termOpt, 10);
	ageLimit = parseInt(ageLimit, 10);
	
	var birthYear = birthDate.substring(0, 4);
	var birthMonth = birthDate.substring(4, 6);
	var birthDay = birthDate.substring(6, 8);
	var ageYear = parseInt(birthYear, 10) + ageLimit;
	var termDate;	

	if (termOpt == 3)
	{
		termDate = ageYear + "1231";
		if (parseInt(termDate, 10) < parseInt(benStartDate, 10))
		{	
			return false;	
		}			
	}
	else if (termOpt == 2)
	{
		termDate = ageYear + birthMonth + daysinmonth[parseInt(birthMonth, 10)];
		if (parseInt(termDate, 10) < parseInt(benStartDate, 10))
		{	
			return false;	
		}		
	}
	else
	{
		termDate = ageYear + birthMonth + birthDay;
		if (parseInt(termDate, 10) <= parseInt(benStartDate, 10))
		{	
			return false;	
		}			
	}
	
	return true;
} 
function getNextDay(dte)
{
	if (typeof(dte)=="undefined" || dte==null)
		return "";
	dte=dte.toString()
	var yr=parseFloat(dte.substring(0,4))
	var mnth=parseFloat(dte.substring(4,6))
	var dy=parseFloat(dte.substring(6,8))
	var dim
	if(mnth==2)
		dim=(isLeapYear(yr))?29:28;
	else dim=daysinmonth[mnth]

	if (dy<dim)
		dy++
	else if (mnth==12)
	{
		mnth=1
		dy=1
		yr++
	}
	else
	{
		mnth++
		dy=1
	}
	yr=yr.toString()
	mnth=mnth.toString()
	dy=dy.toString()
	if (mnth.length == 1)
		mnth = "0" + mnth
	if (dy.length == 1)
		dy = "0" + dy
	var ymddate = "" + yr + mnth + dy
	return ymddate
}
function getFlexValues(plan)
{
	var FlexObj = new Object()
	FlexObj.fcost = 0
	FlexObj.ycost = 0
	if(parseFloat(plan[0])==1)
	{
		FlexObj.fcost = parseFloat(plan[2][6])
		FlexObj.ycost = parseFloat(plan[2][5])
	}
	else if((parseFloat(plan[0])>1 && parseFloat(plan[0])<6) || parseFloat(plan[0])==13)
	{
		FlexObj.fcost = parseFloat(plan[2][20])
		FlexObj.ycost = parseFloat(plan[2][18])
	}
	else if(parseFloat(plan[0])>5)
	{
		FlexObj.fcost = parseFloat(plan[2][18])
		FlexObj.ycost = parseFloat(plan[2][16])
	}
	else
	{
		FlexObj.fcost=0
		FlexObj.ycost=0
	}
	if(isNaN(parseFloat(FlexObj.fcost)))FlexObj.fcost=0
	if(isNaN(parseFloat(FlexObj.ycost)))FlexObj.ycost=0
	return FlexObj
}
function sortElectedArray(arr, flexfirst)
{
	var sortdeps = false
	if(!arr)
		arr = ElectedPlans
	if (arr == ElectedPlans)
		sortdeps = true
	if(arr.length==0) return
	var i=0, j=0
	var length=arr.length
	var flexPlans = new Array()
	var sortedArr = new Array()
	var FlexObj = new Object()
	var deps1 = new Array()
	var deps2 = new Array()
	var olddeps1 = new Array()
	var olddeps2 = new Array()
	var sortedDeps = new Array()
	var sortedOldDeps = new Array()
	for(var i=0;i<length;i++)
	{
		FlexObj = getFlexValues(arr[i])
		if(FlexObj.ycost<0 || FlexObj.fcost!=0)
		{
			flexPlans[flexPlans.length] = arr[i]
			if (sortdeps)
			{
				deps1[deps1.length] = DependentBens[i]
				olddeps1[olddeps1.length] = oldDepBens[i]
			}
		}
		else
		{
			sortedArr[sortedArr.length] = arr[i]
			if (sortdeps)
			{
				deps2[deps2.length] = DependentBens[i]
				olddeps2[olddeps2.length] = oldDepBens[i]
			}
		}
	}
	if (flexfirst)
	{
		sortedArr = flexPlans.concat(sortedArr)
		if (sortdeps)
		{
			sortedDeps = deps1.concat(deps2)
			sortedOldDeps = olddeps1.concat(olddeps2)
		}
	}
	else
	{
		sortedArr = sortedArr.concat(flexPlans)
		if (sortdeps)
		{
			sortedDeps = deps2.concat(deps1)
			sortedOldDeps = olddeps2.concat(olddeps1)
		}
	}
	for (var j=0;j<sortedArr.length;j++) arr[j] = sortedArr[j]
	if (sortdeps)
	{
		for (var j=0;j<sortedDeps.length;j++) DependentBens[j] = sortedDeps[j]
		for (var j=0;j<sortedOldDeps.length;j++) oldDepBens[j] = sortedOldDeps[j]
	}
}
function determineCoverage(recType)
{
	var newCov = false;
	recType = parseInt(recType,10);
	if (SelectedPlan[6]!='' && SelectedPlan[8]!='' && SelectedPlan[6]!=null && SelectedPlan[8]!=null && typeof(SelectedPlan[6])!='undefined' && typeof(SelectedPlan[8])!='undefined')
	{
		var flg = 0;
		var found = false;
		for (var i=0; i<ElectedPlans.length; i++)
		{
			if (!ElectedPlans[i][2]) continue;
			if (SelectedPlan[6]==ElectedPlans[i][2][37] && SelectedPlan[8]==ElectedPlans[i][2][38])
			{
				if ((rule_type != "A" && ElectedPlans[i][5] <= SelectedPlan[3]) || ElectedPlans[i][5] == BenefitRules[2])
				{
					found = true;
					flg = i;
					break;
				}
			}
		}
		if (!found)
		{
			found = false;
			for (var i=0; i<EligPlans.length; i++)
			{
				if (SelectedPlan[6]==EligPlans[i][1] && SelectedPlan[8]==EligPlans[i][2])
				{
					found = true;
					break;
				}
			} 
			self.document.getElementById("main").src = "/lawson/xbnnet/availplans.htm";
			stopProcessing();		
			if (found)
			{
				var alertmsg = getSeaPhrase("CONBEN_7","BEN")+" '"+EligPlans[i][4]+"'\n"+getSeaPhrase("CONBEN_8","BEN")+" '"+SelectedPlan[2]+"'";
				seaAlert(alertmsg, null, null, "error");
			}
			else
			{
				stopProcessing();				
				for (var i=1; i<EligPlans.length; i++)
				{
					if (i != CurrentEligPlan)
					{
						//if(!(selectedPlanInGrp[i] || cantEnroll))
						if (!enrollError[i])
							selectedPlanInGrp[i] = false;
					}
					else
					{
						selectedPlanInGrp[i]=true
						enrollError[i]=true
						cantEnroll[i]=true
					}
				}
				var alertmsg = getSeaPhrase("CONBEN_9","BEN")+" '"+SelectedPlan[2]+"'\n"+getSeaPhrase("CONBEN_10","BEN");
				seaAlert(alertmsg, null, null, "error");
			}
			clearGroup = true;
		}
		else
		{
			var cov=0
			var thisPlanCov
			var pct = parseFloat(SelectedPlan[28])/100;
			if (parseInt(ElectedPlans[flg][0],10)==2)
				newCov = parseFloat(ElectedPlans[flg][2][5])*pct;
			else if (parseInt(ElectedPlans[flg][0],10)==3 || parseInt(ElectedPlans[flg][0],10)==13)
				newCov = parseFloat(ElectedPlans[flg][2][14])*pct;
			else if (parseInt(ElectedPlans[flg][0],10)==4)
				newCov = parseFloat(ElectedPlans[flg][2][17])*pct;
			else if (parseInt(ElectedPlans[flg][0],10)==5)
				newCov = parseFloat(ElectedPlans[flg][2][14])*pct;
			if (recType==2)
				thisPlanCov = parseFloat(SelectedPlan[5]);
			else if (recType==3 || recType==13)
				thisPlanCov = parseFloat(SelectedPlan[52]);
			else if (recType==4)
				thisPlanCov = parseFloat(SelectedPlan[17]);
			else if (recType==5)
 				thisPlanCov = parseFloat(SelectedPlan[14]);
			if (((recType==2 || recType==5) && (  parseFloat(thisPlanCov) > parseFloat(newCov)))
			|| ((recType==3 || recType==13 || recType==4) && ( (parseFloat(SelectedPlan[53])/100) > parseFloat(newCov))))
			{
				newCov = false;
				clearGroup = true;
				for (var i=1; i<EligPlans.length; i++)
				{
					if (i != CurrentEligPlan)
					{
						//if(!(selectedPlanInGrp[i] || cantEnroll))
						if (!enrollError[i])
							selectedPlanInGrp[i] = false;
					}
					else
					{
						selectedPlanInGrp[i] = true;
						enrollError[i] = true;
						cantEnroll[i] = true;
					}
				}
				self.document.getElementById("main").src = "/lawson/xbnnet/availplans.htm";
				stopProcessing();
				seaAlert(getSeaPhrase("CONBEN_12","BEN")+" "+ElectedPlans[flg][2][2], null, null, "error");			      
			}
		}
	}
	else
		newCov = true;
	return newCov;
}
function coverageLimit(recType)
{
	var covObj = new Object();
	var elect_index = 0;
	covObj.newCov = false;
	covObj.msg = "";
	covObj.err = 0;
	covObj.desc = "";
	recType = parseInt(recType,10);
	if (SelectedPlan[6]!='' && SelectedPlan[8]!='' && SelectedPlan[6]!=null && SelectedPlan[8]!=null && typeof(SelectedPlan[6])!='undefined' && typeof(SelectedPlan[8])!='undefined')
	{
		var found = false;
		for(var i=0;i<ElectedPlans.length;i++)
		{
			if (!ElectedPlans[i][2]) continue;
			if (SelectedPlan[6]==ElectedPlans[i][2][37] && SelectedPlan[8]==ElectedPlans[i][2][38] && ElectedPlans[i][5] == BenefitRules[2])
			{
				found = true;
				elect_index = i;
				break
			}
		}
		if(!found)
		{
			found = false;
			covObj.err = 1;
			for (var i=0; i<EligPlans.length; i++)
			{
				if (SelectedPlan[6]==EligPlans[i][1] && SelectedPlan[8]==EligPlans[i][2])
				{
					found = true;
					break;
				}
			}
			if (found)
				covObj.msg = getSeaPhrase("CONBEN_15","BEN")+" "+EligPlans[i][4]+" "+getSeaPhrase("CONBEN_16","BEN");
			else
				covObj.msg = getSeaPhrase("CONBEN_9","BEN")+" '"+SelectedPlan[2]+"'\n"+getSeaPhrase("CONBEN_10","BEN");
		}
		else
		{
			var new_cov = 0;
			var pct=parseFloat(SelectedPlan[28])/100;
			covObj.desc = ElectedPlans[elect_index][1];
			covObj.err = 2;
			if (parseInt(ElectedPlans[elect_index][0],10)==2)
				new_cov = parseFloat(ElectedPlans[elect_index][2][5])*pct;
			else if (parseInt(ElectedPlans[elect_index][0],10)==3 || parseInt(ElectedPlans[elect_index][0],10)==13)
				new_cov = parseFloat(ElectedPlans[elect_index][2][14])*pct;
			else if (parseInt(ElectedPlans[elect_index][0],10)==4)
				new_cov = parseFloat(ElectedPlans[elect_index][2][17])*pct;
			else if (parseInt(ElectedPlans[elect_index][0],10)==5)
				new_cov = parseFloat(ElectedPlans[elect_index][2][14])*pct;
			covObj.newCov = new_cov;
		}
	}
	return covObj;
}
function capital(str)
{
	var fir = str.charAt(0);
	fir = fir.toUpperCase();
	var retval = fir+str.substring(1,str.length);
	return retval;
}
function openWinDesc(doc)
{
	var temp = baseurl+"plandescriptions/"+doc.toLowerCase();
// MOD BY BILAL
	//var wnd = window.open(temp,"DescWindow","toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=400");

	var wnd = window.open(temp,"DescWindow","toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=600,height=600");
// END OF MOD
	try { wnd.focus(); } catch(e) {}
}
function openWinDesc2(planType, planCode)
{
	if (isEnwisenEnabled())
	{
		var pageAlias = planType.toUpperCase()+planCode.toUpperCase();
		openEnwisenWindow("alias="+pageAlias);		
	}
	else
	{
		var doc = removespace(planType+planCode)+".htm";
		openWinDesc(doc);
	}
}
function removespace(Str)
{
	if (typeof(Str)=="undefined" || Str==null)
		Str = "";
	else 
		Str = Str.toString();
	var Temp = Str.split(" ");
	Str = Temp.join("");
	return Str;
}
function removecomma(Num)
{
	if (typeof(Num)=="undefined" || Num==null)
		Num = "";
	else 
		Num = Num.toString();
	var Temp = Num.split(",");
	Num = Temp.join("");
	return Num;
}
function Truncate(Num)
{
	var Factor = 100
	var Pennies = 0
	Num = parseFloat(removecomma(removespace(Num)))
	if (isNaN(Num)) return ""
	Pennies = parseInt(Num*Factor,10)
	if (isNaN(Pennies))
		Num = 0.00
	else Num = Pennies/Factor
	return roundToPennies(Num)
}
function RoundUp(Num)
{
	var Result
	Num = parseFloat(removecomma(removespace(Num)))
	var Diff = Math.abs(Num) - Math.abs(Truncate(Num));
	if (Diff >= .005)
	{
		Result = Truncate(Math.abs(Num)+.01)
		if (Num < 0)
			Result = Result * -1
	}
	else Result = Num
	return roundToPennies(Result)
}
function ForceRoundUp(Num)
{
	var Result
	Num = parseFloat(removecomma(removespace(Num)))
	var Diff = Math.abs(Num) - Math.abs(Truncate(Num));
	if (Diff != 0)
	{
		Result = Truncate(Math.abs(Num)+.01)
		if (Num < 0)
			Result = Result * -1
	}
	else Result = Num
	return roundToPennies(Result)
}
function NbrDecimals(Num)
{
	var stringNum = "" + parseFloat(removecomma(removespace(Num)));
	var decLoc = stringNum.indexOf(".");
	if (decLoc != -1)
		return (stringNum.length - decLoc - 1);
	else
		return 0;
}
function DividesEvenly(Num1, Num2)
{
	Num1 = parseFloat(removecomma(removespace(Num1)));
	Num2 = parseFloat(removecomma(removespace(Num2)));
	var multiplier = Math.pow(10,Math.max(NbrDecimals(Num1),NbrDecimals(Num2)));
	var remainder = (Num1*multiplier)%(Num2*multiplier);
	if (remainder == 0)
		return true;
	else
		return false;
}
function quitEnroll(doc)
{
	var loc1 = doc + '';
	LastDoc[LastDoc.length] = loc1;
	currentdoc = LastDoc.length - 1;
	if (styler && (styler.showLDS || styler.showInfor || styler.showInfor3) && typeof(window["stylerWnd"]) != "undefined" && typeof(window.stylerWnd["DialogObject"]) == "function")
	{	
	//  SLHS 10/12/2012 Change exit dialog message from QUIT_3 to QUIT_6 
	//	var msg = getSeaPhrase("QUIT_3","BEN");
		var msg = getSeaPhrase("QUIT_6","BEN");
	//  SLHS 10/12/2012 Set secondary message to display no text
		var secondaryMsg = "";
	//	var secondaryMsg = getSeaPhrase("QUIT_6","BEN");
		if (typeof(messageDialog) == "undefined" || messageDialog == null)
			messageDialog = new window.stylerWnd.DialogObject("/lawson/webappjs/", null, styler, true);
		messageDialog.pinned = true;
		messageDialog.getPhrase = function(phrase)
		{
			if (!phrase || (phrase.indexOf("<") != -1 && phrase.indexOf(">") != -1))
				return phrase;	
			if (!userWnd && typeof(window["findAuthWnd"]) == "function")
				userWnd = findAuthWnd(true);
	        if (userWnd && userWnd.getSeaPhrase)
	        {
				var retStr = userWnd.getSeaPhrase(phrase.toUpperCase(),"BEN");
				return (retStr != "") ? retStr : phrase;
			}
			else
			    return phrase;         
		}		
		messageDialog.initDialog = function(wnd)
		{
			wnd = wnd || window;				
			if (this.styler != null && this.styler.showInfor3)
			{
				this.setButtons([
				     {id: "yes", name: "yes", text: this.getPhrase("QUIT_4"), click: null},
				     {id: "no", name: "no", text: this.getPhrase("QUIT_5"), click: null}				
				]);					
			}
		}		
        messageDialog.translateButton = function(btn, phrase, wnd)
        {
        	wnd = wnd || window;
		    if (typeof(btn) == "string")
		    {	
		    	if (btn == "btnYes")
		    		phrase = "QUIT_4";
		    	else if (btn == "btnNo")
		    		phrase = "QUIT_5";
		        btn = wnd.document.getElementById(btn);		        
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
        var msgObj = messageDialog.messageBox(msg, "yesno", "question", window, false, secondaryMsg, confirmQuitEnroll);
        if (msgObj && typeof(msgObj) == "string")
        {
        	// IE returns a string response indicating the user's choice
        	if (msgObj == "yes" || msgObj == "continue")
        		EndEnroll('YES');
        	else
        		EndEnroll('NO', true);
        	return;
        }	
	}
	else
	{
		if (quitting && self.main.summary)
			self.main.document.getElementById("summary").src = baseurl + "quitbess.htm";
		else
			self.document.getElementById("main").src = baseurl + "quitbess.htm";	
	}
}
function confirmQuitEnroll(confirmWin)
{
	if (confirmWin.returnValue == "yes" || confirmWin.returnValue == "continue")
		EndEnroll('YES');	
	else
		EndEnroll('NO', true);
}
function CloseLifeEnrollment()
{
	try 
	{
   		parent.toggleFrame("right", false);   		
   		parent.toggleFrame("relatedtask", false);
   		parent.toggleFrame("fullrelatedtask", false);		
   		parent.toggleFrame("left", true);
	}
	catch(e) {}
	// display the checkmark indicating that this task has been accessed.
	try { parent.left.setImageVisibility("benefits_checkmark", "visible"); } catch(e) {}
}
function EndEnroll(flag, noNavigation)
{
	if (quitting)
	{
		if (emailSummary)
			emailScr(self.main,false);	
		if (printSummary)
			setTimeout(function() { printScr(self.main.printScreen); }, 500);			
		quitting = false;
	}
	if (flag.toUpperCase() == "YES") 
	{
		if (opener) 
		{
			close();
			opener.focus();
		}
		else 
		{
			if (rule_type == "F") 
				CloseLifeEnrollment();
			else 
			{
				startProcessing(getSeaPhrase("EXITING", "ESS"));
				setTimeout(function() { self.location.replace("/lawson/xhrnet/ui/logo.htm") }, 1000);
			}
		}
	} 
	else 
	{
		quitting = false;
		if (!noNavigation) 
		{
			self.document.getElementById("main").src = LastDoc[currentdoc];
			currentdoc--;
		}	
	}
}
var flexcost = 0;
var empcost = 0;
var empprecost = 0;
var empaftcost = 0;
var compcost = 0;
var Ycost = 0;
var Ccost = 0;
var Fcost = 0;
var Pcost = 0;
var empflag = 0;
var flexflag = 0;
var compflag = 0;
var type89flg = -1;
var coveredDeps = new Array();
var divisor = 1;
function navigate1()
{
	if (status != "C")	
	{
		if (choices.length>currentChoice+1) 
		{
			currentChoice++;
			CurrentEligPlan = choices[currentChoice];
			self.document.getElementById("main").src = "/lawson/xbnnet/elect_benefits.htm";
		} 
		else 
		{
			var insamegroup = false;
			if (CurrentPlanGroup < EligPlanGroups.length-1) 
			{
				for (var i=1; i<CurrentBens.length; i++) 
				{
					if (CurrentBens[i] != null) 
					{
						if (CurrentBens[i][32]==EligPlanGroups[CurrentPlanGroup][0] && CurrentBens[i][45]!=true) 
						{
							planname = i;
							insamegroup = true;
							break;
						}
					}
				}
				if (!insamegroup) 
				{
					CurrentPlanGroup++;
					for (var i=1; i<CurrentBens.length; i++) 
					{
						if (CurrentBens[i] != null) 
						{
							if (CurrentBens[i][32]==EligPlanGroups[CurrentPlanGroup][0]) 
							{
								planname = i;
								break;
							}
						}
					}
				}
				if (CurrentBens[planname] != null) 
				{
					if (CurrentBens[planname][32]==EligPlanGroups[CurrentPlanGroup][0])
	                	self.document.getElementById("main").src = "/lawson/xbnnet/disp_benefits.htm";
					else
						self.document.getElementById("main").src = "/lawson/xbnnet/availplans.htm";
				} 
				else
					self.document.getElementById("main").src = "/lawson/xbnnet/availplans.htm";
			} 
			else 
			{
				for (var i=1; i<CurrentBens.length; i++) 
				{
					if (CurrentBens[i] != null) 
					{
						if (CurrentBens[i][32]==EligPlanGroups[CurrentPlanGroup][0] && CurrentBens[i][45]!=true)
						{
							planname = i;
							insamegroup = true;
							break;
						}
					}
				}
				if (!insamegroup)
					self.document.getElementById("main").src = "/lawson/xbnnet/bensummary.htm";
				else
                	self.document.getElementById("main").src = "/lawson/xbnnet/disp_benefits.htm";
			}
		}
	} 
	else 
	{
		if (choices.length > currentChoice+1) 
		{
			currentChoice++;
			CurrentEligPlan = choices[currentChoice];
			self.document.getElementById("main").src = "/lawson/xbnnet/elect_benefits.htm";
		} 
		else 
		{
			var insamegroup = false;
			if (changes.length > currentChange+1) 
			{
				for (var i=1; i<CurrentBens.length; i++) 
				{
					if (CurrentBens[i] != null) 
					{
						if (CurrentBens[i][32]==EligPlanGroups[CurrentPlanGroup][0] && CurrentBens[i][45]!=true)
						{
							planname = i;
							insamegroup = true;
							break;
						}
					}
				}
				if (!insamegroup) 
				{
					currentChange++;
					CurrentPlanGroup = changes[currentChange];
					for (var i=1; i<CurrentBens.length; i++) 
					{
						if (CurrentBens[i] != null) 
						{
							if (CurrentBens[i][32]==EligPlanGroups[CurrentPlanGroup][0])
							{
								planname = i;
								break;
							}
						}
					}
				}
				if (CurrentBens[planname] != null) 
				{
					if (CurrentBens[planname][32]==EligPlanGroups[CurrentPlanGroup][0])
	                	self.document.getElementById("main").src = "/lawson/xbnnet/disp_benefits.htm";
					else
						self.document.getElementById("main").src = "/lawson/xbnnet/availplans.htm";
				} 
				else
					self.document.getElementById("main").src = "/lawson/xbnnet/availplans.htm";
			} 
			else 
			{
				for (var i=1; i<CurrentBens.length; i++) 
				{
					if (CurrentBens[i] != null) 
					{
						if (CurrentBens[i][32]==EligPlanGroups[CurrentPlanGroup][0] && CurrentBens[i][45]!=true)
						{
							planname = i;
							insamegroup = true;
							break
						}
					}
				}
				if (!insamegroup)
					self.document.getElementById("main").src = "/lawson/xbnnet/bensummary.htm";
				else
                	self.document.getElementById("main").src = "/lawson/xbnnet/disp_benefits.htm";
			}
		}
	}
}
function InDocPath(docUrl)
{
	var inPath = false;
	for (var i=0; i<LastDoc.length; i++)
	{
		if (LastDoc[i] == docUrl)
		{
			inPath = true;
			break;
		}	
	}
	return inPath;
}
// PT 161506: Have all other plans other than the current one in this group already been elected?
// Note: it is assumed that CurrentBens[i][45] = true (meaning it has been marked for election) for the current plan prior to calling this function.
function lastPlanInGrp()
{
	var retVal = true;
	if (CurrentPlanGroup < EligPlanGroups.length) 
	{
		for (var i=1; i<CurrentBens.length; i++) 
		{
			if (CurrentBens[i] != null) 
			{
				// Is there a plan in the current plan group which has not yet been elected?
				if ((CurrentBens[i][32] == EligPlanGroups[CurrentPlanGroup][0]) && (CurrentBens[i][45] != true)) 
				{
					retVal = false;
					break;
				}
			}
		}
	}
	return retVal;
}
function writeDepPortion(effectDate, planDesc)
{
	var depDate;
	var depLbl = getSeaPhrase("COVERED_DEPS_AS_OF","BEN")+' ';
	if (typeof(effectDate)!="undefined" && effectDate!=null)
		depDate = effectDate;
	else
		depDate = newdate;
	depLbl += depDate;
	var NbrCoveredDeps = 0;
	var depNames = new Array();
	var strHtml = '<br/><table class="plaintableborder" border="0" cellpadding="0" cellspacing="0" style="width:100%;margin-left:auto;margin-right:auto" styler="list" summary="'+getSeaPhrase("TSUM_7","BEN",[planDesc,depDate])+'">'
	strHtml += '<caption class="offscreen">'+getSeaPhrase("TCAP_6","BEN",[planDesc,depDate])+'</caption>'
	strHtml += '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center" colspan="2">'+depLbl+'</th></tr>'
	strHtml += '<tr><td class="plaintablecellborder">'
	strHtml += '<table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">'
	for (var i=0; i<dependents.length; i++) 
	{
		for (var x=0; x<coveredDeps.length; x++) 
		{
			if (dependents[i].seq_nbr == coveredDeps[x].dependent) 
			{
				if (NbrCoveredDeps % 2 == 0)
					strHtml += '<tr>';
				strHtml += '<td class="plaintablecellborder" style="white-space:nowrap">'+dependents[i].label_name_1+'</td>'
				NbrCoveredDeps++;
				if ((NbrCoveredDeps % 2) == 0)
					strHtml += '</tr>';
			}
		}
	}
	if ((NbrCoveredDeps % 2) != 0)
		strHtml += '<td class="plaintablecellborder" style="white-space:nowrap">&nbsp;</td></tr>'
	strHtml += '</table></td></tr></table>'
	if (NbrCoveredDeps > 0)
		return strHtml;
	else
		return '';
}
function SelectDependent(seqnbr)
{
	for (var i=0;i<dependents.length;i++)
	{
		if (dependents[i].seq_nbr == seqnbr)
			return i;
	}
	return -1;
}
var preTaxVal = 0;
var aftTaxVal = 0;
var taxType = "";
function isEmpCostSplit(arr,recType)
{
	preTaxVal = 0;
	aftTaxVal = 0;
	taxType = "";
	switch (Number(recType))
	{
		case 1:
			preTaxVal = (arr[25] && !isNaN(Number(arr[25])) && Number(arr[25]) != 0) ? Number(arr[25]) : 0;
			aftTaxVal = (arr[26] && !isNaN(Number(arr[26])) && Number(arr[26]) != 0) ? Number(arr[26]) : 0;
			taxType = (arr[3]) ? arr[3] : "";
			break;
		case 2:
		case 3:
		case 4:
		case 5:
			preTaxVal = (arr[63] && !isNaN(Number(arr[63])) && Number(arr[63]) != 0) ? Number(arr[63]) : 0;
			aftTaxVal = (arr[64] && !isNaN(Number(arr[64])) && Number(arr[64]) != 0) ? Number(arr[64]) : 0;
			taxType = (arr[15]) ? arr[15] : "";
			break;	
		case 6: //don't split costs for record types 6, 8, or 9. RT 6s may have a mid-year pay period cost that would need further calculation to split up.
				//RTs 8 and 9s are already getting split.
		case 8:
		case 9:
			break;
		case 7:	
		case 10:
			preTaxVal = (arr[56] && !isNaN(Number(arr[56])) && Number(arr[56]) != 0) ? Number(arr[56]) : 0;
			aftTaxVal = (arr[57] && !isNaN(Number(arr[57])) && Number(arr[57]) != 0) ? Number(arr[57]) : 0;
			taxType = (arr[26]) ? arr[26] : "";
			break;
		default: break;
	}
	if (taxType == "B" && (preTaxVal != 0 || aftTaxVal != 0))
		return true;
	else
		return false;
}
function getSplitCosts(arr,recType,planDesc,isflex,showDate,preTaxVal,aftTaxVal)
{
	var str="";
	if(preTaxVal==0 && aftTaxVal!=0)
		str+=getCosts(arr,recType,planDesc,isflex,true,"A",false)
	else if(preTaxVal!=0 && aftTaxVal==0)
		str+=getCosts(arr,recType,planDesc,isflex,true,"P",false)
	else
	{
		str+=getCosts(arr,recType,planDesc,isflex,true,"P",false)+'</tr>'
		str+='<tr><td class="plaintablecellborder" nowrap>&nbsp;</td><td class="plaintablecellborderright" nowrap>&nbsp;</td>'
		if(showDate)
			str+='<td class="plaintablecellborder">&nbsp;</td>'				
		str+=getCosts(arr,recType,planDesc,isflex,true,"A",true)
	}
	return str;
}
var contType;
var noCosts = false;
function getCosts(arr,recType,planDesc,isflex,issplit,preaft,splitline)
{			
		var bod=""	
		noCosts=false
		empprecost=0
		empaftcost=0
		preaft=preaft || "P"
		splitline=splitline || false
		if(recType=="01" || parseFloat(recType)==1)
		{
			flexcost=arr[6]
			empcost=arr[5]
			empprecost=(arr[25])?arr[25]:0;
			empaftcost=(arr[26])?arr[26]:0;			            
			compcost=arr[8]
			taxable=arr[3]
			contType=arr[24]
		}
		if(recType=="02" || parseFloat(recType)==2 || recType=="03" || parseFloat(recType)==3 || recType=="13" || parseFloat(recType)==13 || recType=="04" || parseFloat(recType)==4 || recType=="05" || parseFloat(recType)==5)
		{
			contType=arr[51]
			flexcost=arr[20]
			empcost=arr[18]
			compcost=arr[24]
			empprecost=(arr[63])?arr[63]:0;
			empaftcost=(arr[64])?arr[64]:0;
			if(issplit || (parseFloat(empcost)>0 && !isNaN(parseFloat(empcost))))
				taxable=arr[15]
			else
				taxable=""
		}
		if(recType=="06" || parseFloat(recType)==6)
		{
			taxable=arr[26]
			flexcost=arr[18]
			empcost=arr[16]
			empprecost=(arr[56])?arr[56]:0;
			empaftcost=(arr[57])?arr[57]:0;			            
			if(arr[24]!="P" && !(arr[19] && arr[19]==-1))
			{
				if(BenefitRules[6]=="P")
				{
					if(arr[37] && Number(arr[37]) != 0)
						empcost=parseFloat(arr[23])/parseFloat(arr[37])
				}
				else if(BenefitRules[6]=="M" || BenefitRules[6]=="S")
				{
					if(arr[17] && Number(arr[17]) != 0)
						empcost=parseFloat(arr[23])/parseFloat(arr[17])
				}
			}
			else if(arr[19] && arr[19]==-1)
				empcost=arr[16]
			else
				empcost=arr[23]				            
			compcost=arr[22]
			contType=arr[24]
		}
		if(recType=="07" || parseFloat(recType)==7)
		{
			taxable=arr[26]
			flexcost=arr[18]
			empcost=arr[16]
			empprecost=(arr[56])?arr[56]:0;
			empaftcost=(arr[57])?arr[57]:0;			            
			compcost=arr[22]
			contType=arr[24]
		}
		if(recType=="08" || parseFloat(recType)==8 || recType=="09" || parseFloat(recType)==9 || recType=="10" || parseFloat(recType)==10)
		{
			taxable=arr[26]
			flexcost=arr[18]
			empcost=arr[16]
			empprecost=(arr[56])?arr[56]:0;
			empaftcost=(arr[57])?arr[57]:0;			            
			compcost=arr[22]
			contType=arr[24]
		}
		if(recType=="12" || parseFloat(recType)==12)
		{
			taxable=""
			flexcost=""
			empcost=""
			compcost=""
			contType=""
		}
		if((flexcost==0 || flexcost=="") && (empcost==0 || empcost=="") && (compcost==0 || compcost==""))
			noCosts=true	
// MOD BY BILAL
//ISH 2007 Flex Display_Window
/*
        if(!splitline && flexcost!=0 && flexcost!="" && flexcost!=null && typeof(flexcost)!='undefined' && !isNaN(flexcost))
		{
			bod+='<td class="plaintablecellborderright" nowrap>&nbsp;'+formatCont(flexcost)
			if(contType=="P")
				bod+=getSeaPhrase("PER","BEN")
			else
				Fcost+=unFormat(formatCont(flexcost))
			bod+='&nbsp;</td>'
			flexflag=1
		}
		else
ISH End */
// END OF MOD
			bod+='<td class="plaintablecellborder">&nbsp;</td>'
		// Add a spacer column for display
		bod+='<td class="plaintablecellborder" width="'+TableSpacer+'" nowrap>&nbsp;</td>'
 		if(recType=="08" || parseFloat(recType)==8 || recType=="09" || parseFloat(recType)==9)
 		{
			//*** BS10 does cost division for us ***
			divisor=1
			var ThisCost = 0
			empflag=1
			if(arr[24]!="P")
			{
				if(arr[23]!="" && arr[36]!="")
				{
					if(parseFloat(type89flg)==0)
					{
						if(arr[23] && arr[23]!="" && parseFloat(arr[23])!=0)
						{
							bod+='<td class="plaintablecellborderright" nowrap>&nbsp;'+formatCont((parseFloat(arr[23])/parseFloat(divisor)))+'&nbsp;</td><td class="plaintablecellborder" nowrap>&nbsp;'+getSeaPhrase("PRE_TAX","BEN")+'&nbsp;</td>'
							ThisCost = unFormat(formatCont(parseFloat(arr[23])/parseFloat(divisor)))
							Ycost+=ThisCost
							if(ThisCost<0)
								EmpNegPreTaxTotal+=Math.abs(ThisCost)
							else 
							{
								if (isflex)
									EmpPreTaxFlexTotal += ThisCost
								EmpPreTaxTotal += ThisCost
							}
						}
						else
							bod+='<td class="plaintablecellborder" nowrap>&nbsp;</td><td class="plaintablecellborder" nowrap>&nbsp;</td>'
					}
					else
					{
						if(arr[36] && arr[36]!="" && parseFloat(arr[36])!=0)
						{
							bod+='<td class="plaintablecellborderright" nowrap>&nbsp;'+formatCont((parseFloat(arr[36])/parseFloat(divisor)))+'&nbsp;</td><td class="plaintablecellborder" nowrap>&nbsp;'+getSeaPhrase("AFTER_TAX","BEN")+'&nbsp;</td>'
							ThisCost = unFormat(formatCont(parseFloat(arr[36])/parseFloat(divisor)))
							Ycost+=ThisCost
							EmpAfterTaxTotal+=ThisCost
						}
						else
							bod+='<td class="plaintablecellborder" nowrap>&nbsp;</td><td class="plaintablecellborder" nowrap>&nbsp;</td>'
					}
				}
				else
				{
					if(arr[23] && arr[23]!="" && parseFloat(arr[23])!=0)
					{
						var cov=parseFloat(arr[23])/parseFloat(divisor)
						bod+='<td class="plaintablecellborderright" nowrap>&nbsp;'+formatCont(cov)+'&nbsp;</td><td class="plaintablecellborder" nowrap>&nbsp;'+getSeaPhrase("PRE_TAX","BEN")+'&nbsp;</td>'
						ThisCost = unFormat(formatCont(parseFloat(arr[23])/parseFloat(divisor)))
						Ycost+=ThisCost
						if(ThisCost<0)
							EmpNegPreTaxTotal+=Math.abs(ThisCost)
						else 
						{
							if (isflex)
								EmpPreTaxFlexTotal += ThisCost
							EmpPreTaxTotal += ThisCost
						}
					}
					if(arr[36] && arr[36]!="" && parseFloat(arr[36])!=0)
					{
						bod+='<td class="plaintablecellborderright" nowrap>&nbsp;'+formatCont((parseFloat(arr[36])/parseFloat(divisor)))+'&nbsp;</td><td class="plaintablecellborder" nowrap>&nbsp;'+getSeaPhrase("AFTER_TAX","BEN")+'&nbsp;</td>'
						ThisCost = unFormat(formatCont(parseFloat(arr[36])/parseFloat(divisor)))
						Ycost+=ThisCost
						EmpAfterTaxTotal+=ThisCost
					}
					if((!arr[36] || arr[36]=="" || parseFloat(arr[36])==0) &&
					(!arr[23] || arr[23]=="" || parseFloat(arr[23])==0))
					{
						bod+='<td class="plaintablecellborder" nowrap>&nbsp;</td><td class="plaintablecellborder" nowrap>&nbsp;</td>'
					}
				}
			}
			else if(arr[24]!="A")
			{
				if(arr[23] && arr[23]!="" && parseFloat(arr[23])!=0)
				{
					bod+='<td class="plaintablecellborderright" nowrap>&nbsp;'+formatCont((parseFloat(arr[23])/parseFloat(divisor)))+getSeaPhrase("PER","BEN")+'&nbsp;</td><td class="plaintablecellborder" nowrap>&nbsp;'+getSeaPhrase("PRE_TAX","BEN")+'&nbsp;</td>'
					ThisCost = unFormat(formatCont(parseFloat(arr[23])/parseFloat(divisor)))
					Pcost+=ThisCost
					EmpPreTaxPercentTotal+=ThisCost
				}
				if(arr[36] && arr[36]!="" && parseFloat(arr[36])!=0)
				{
					bod+='<td class="plaintablecellborderright" nowrap>&nbsp;'+formatCont((parseFloat(arr[36])/parseFloat(divisor)))+getSeaPhrase("PER","BEN")+'&nbsp;</td><td class="plaintablecellborder" nowrap>&nbsp;'+getSeaPhrase("AFTER_TAX","BEN")+'&nbsp;</td>'
					ThisCost = unFormat(formatCont(parseFloat(arr[36])/parseFloat(divisor)))
					Pcost+=ThisCost
					EmpAfterTaxPercentTotal+=ThisCost
				}
				if((!arr[36] || arr[36]=="" || parseFloat(arr[36])==0) &&
				(!arr[23] || arr[23]=="" || parseFloat(arr[23])==0))
				{
					bod+='<td class="plaintablecellborder" nowrap>&nbsp;</td><td class="plaintablecellborder" nowrap>&nbsp;</td>'
				}				
			}
			else
				bod+='<td class="plaintablecellborder" nowrap>&nbsp;</td><td class="plaintablecellborder" nowrap>&nbsp;</td>'
 		}
		else
		{
			//if the emp cost is split between pre- and after-tax, display either pre-tax or after-tax,
			//based on the preaft flag, totaling each amount separately.			
			if(issplit)
			{
				ThisCost = 0
				if (preaft == "P")
				{
					if (empprecost!=0 && empprecost!="" && empprecost != null && typeof(empprecost)!='undefined' && !isNaN(empprecost))
					{
						ThisCost = unFormat(formatCont(empprecost))
						bod+='<td class="plaintablecellborderright" nowrap>&nbsp;'+formatCont(empprecost)+'&nbsp;</td><td class="plaintablecellborder" nowrap>&nbsp;'+getSeaPhrase("PRE_TAX","BEN")+'&nbsp;</td>'
						if(ThisCost<0)
							EmpNegPreTaxTotal += Math.abs(ThisCost)
						else 
						{
							if (isflex)
							 	EmpPreTaxFlexTotal += ThisCost
							EmpPreTaxTotal += ThisCost
						}				
					}
					else
						bod+='<td class="plaintablecellborderright" nowrap>&nbsp;</td><td class="plaintablecellborder" nowrap>&nbsp;</td>'
				}
				else
				{
					if (empaftcost!=0 && empaftcost!="" && empaftcost != null && typeof(empaftcost)!='undefined' && !isNaN(empaftcost))
					{		
						ThisCost = unFormat(formatCont(empaftcost))
						bod+='<td class="plaintablecellborderright" nowrap>&nbsp;'+formatCont(empaftcost)+'&nbsp;</td><td class="plaintablecellborder" nowrap>&nbsp;'+getSeaPhrase("AFTER_TAX","BEN")+'&nbsp;</td>'
						EmpAfterTaxTotal += ThisCost	
					}
					else
						bod+='<td class="plaintablecellborderright" nowrap>&nbsp;</td><td class="plaintablecellborder" nowrap>&nbsp;</td>'
				}	
				empflag=1		
			}
			else if(empcost!=0 && empcost!="" && empcost != null && typeof(empcost)!='undefined' && !isNaN(empcost))
			{
				bod+='<td class="plaintablecellborderright" nowrap>&nbsp;'+formatCont(empcost)
				if(arr[42]) contType=arr[42]
				ThisCost = unFormat(formatCont(empcost))
				if(contType=="P")
				{
					Pcost+=ThisCost
					bod+=getSeaPhrase("PER","BEN")
					if(typeof(taxable)!="undefined")
					{
						if(taxable.charAt(0) == "P")
							EmpPreTaxPercentTotal += ThisCost
						else if(taxable.charAt(0) == "A")
							EmpAfterTaxPercentTotal += ThisCost
					}
				}
				else
				{
					Ycost+=ThisCost
					if(typeof(taxable)!="undefined")
					{
						if(taxable.charAt(0) == "P")
						{
							if(ThisCost<0)
								EmpNegPreTaxTotal += Math.abs(ThisCost)
							else 
							{
								if (isflex)
								 	EmpPreTaxFlexTotal += ThisCost
								EmpPreTaxTotal += ThisCost
							}
						}
						else if(taxable.charAt(0) == "A")
								EmpAfterTaxTotal += ThisCost
					}
				}
				bod+='&nbsp;</td>'
				empflag=1				
			}
			else
				bod+='<td class="plaintablecellborder">&nbsp;</td>'
		}
		//do not display taxable for Both - it is already displayed as separate pre/aft parts
		if (!issplit)
		{
			if(typeof(taxable)!='undefined' && (empcost!=0 && empcost!="" && empcost != null &&
				typeof(empcost)!='undefined' && !isNaN(empcost)))
			{
				bod+='<td class="plaintablecellborder" nowrap>&nbsp;'
				if(taxable!="" && (recType!="08" && parseFloat(recType)!=8 && recType!="09" && parseFloat(recType)!=9))
					bod+=displayTaxable(taxable)
				bod+='</td>'	
			}
			else
				bod+='<td class="plaintablecellborder">&nbsp;</td>'
		}
		if(!splitline && compcost!=0 && compcost!="" && compcost != null && typeof(compcost)!='undefined' && !isNaN(compcost))
		{
			if(recType!="08" && parseFloat(recType)!=8 && recType!="09" && parseFloat(recType)!=9)
			{
				bod+='<td class="plaintablecellborderright" nowrap>&nbsp;'
				bod+=formatCont(compcost)
				if(contType=="P")
					bod+=getSeaPhrase("PER","BEN")
				else
				{
					Ccost+=unFormat(formatCont(compcost))
					CompanyTotal+=parseFloat(compcost)
				}
				bod+='&nbsp;</td>'
				compflag=1
			}
			else
				bod+='<td class="plaintablecellborderright" nowrap>&nbsp;</td>'
		}
		else
		{
			if(recType!="08" && parseFloat(recType)!=8 && recType!="09" && parseFloat(recType)!=9)
				bod+='<td class="plaintablecellborder">&nbsp;</td>'
		}
		return bod
}
function formatCont(Num)
{
	var Negative = false
	if (typeof(Num)=="undefined" || Num==null)
		Num = ""
	else 
		Num = removespace(Num)
	if (Num == "" || parseFloat(Num)==0)
		return ""
	if (Num.indexOf("-") > 0)
		Num = "-" + Num.substring(0,Num.indexOf("-"))
	// PT 170193. If the amount is less than a penny, do not truncate to the hundredths place, 
	// because we want to retain small calculated values that may be used for subsequent calculations.
	// Also, comma formatting only makes sense for larger amounts.
	if (parseFloat(Num) >= .01)
	{		
		var RoundedNum = roundToPennies(Num.toString())
		var FloatingPt = RoundedNum.indexOf(".")
		if (FloatingPt != -1)
			RoundedNum = RoundedNum.substring(0,FloatingPt+3)
		Num = formatComma(RoundedNum)
	}
	if (Num != "") {
		var DecimalLoc = Num.indexOf(".")
		if (DecimalLoc >= 0) {
			var DigitsToRight = Num.substring(DecimalLoc+1,Num.length).length
			for (var i=DigitsToRight;i<2;i++)
				Num += "0"
			if (DigitsToRight > 2)
				Num = roundToPennies(Num)
		}
		else if (DecimalLoc == -1)
			Num += ".00"
	}
	if (isNaN(parseFloat(Num))) 
		Num = ""
	return Num
}
function formatCont2(Num)
{
	var Num2 = formatCont(Num);
	if (Num2 == "")
		Num2 = "0.00";
	return Num2;	
}
function unFormat(num)
{
	num=num+''
	temp1=num.split(",")
	num=temp1.join("")
	return parseFloat(num)
}
function removeStoppedElections()
{
	var isDup = false
	var cleanElections = new Array()
	var cleanDependents = new Array()
	var cleanOldDependents = new Array()
	// first remove any plans duplicated in the array -- due to a stop or change?
	for (var j=0;j<ElectedPlans.length;j++)
	{
		cleanElections = new Array()
		cleanDependents = new Array()
		cleanOldDependents = new Array()
		var plan_type = ""
		var plan_code = ""
		isDup = false
		if(!ElectedPlans[j][2]) continue
		if(parseInt(ElectedPlans[j][0],10)==1)
		{
			plan_type = ElectedPlans[j][2][11]
			plan_code = ElectedPlans[j][2][12]
		}
		else if((parseInt(ElectedPlans[j][0],10)>1 && parseInt(ElectedPlans[j][0],10)<6) || parseInt(ElectedPlans[j][0],10)==13)
		{
			plan_type = ElectedPlans[j][2][37]
			plan_code = ElectedPlans[j][2][38]
		}
		else if(parseInt(ElectedPlans[j][0],10)>5 && parseInt(ElectedPlans[j][0],10)<11)
		{
			plan_type = ElectedPlans[j][2][38]
			plan_code = ElectedPlans[j][2][39]
		}
		else if(parseInt(ElectedPlans[j][0],10)==12)
		{
			plan_type = ElectedPlans[j][2][1]
			plan_code = ElectedPlans[j][2][2]
		}
		else
			continue
		for (var k=0;k<ElectedPlans.length;k++)
		{
			var plan_type2 = ""
			var plan_code2 = ""		
			if(!ElectedPlans[k][2]) continue
			if(parseInt(ElectedPlans[k][0],10)==1)
			{
				plan_type2 = ElectedPlans[k][2][11]
				plan_code2 = ElectedPlans[k][2][12]
			}
			else if((parseInt(ElectedPlans[k][0],10)>1 && parseInt(ElectedPlans[k][0],10)<6) || parseInt(ElectedPlans[k][0],10)==13)
			{
				plan_type2 = ElectedPlans[k][2][37]
				plan_code2 = ElectedPlans[k][2][38]
			}
			else if(parseInt(ElectedPlans[k][0],10)>5 && parseInt(ElectedPlans[k][0],10)<11)
			{
				plan_type2 = ElectedPlans[k][2][38]
				plan_code2 = ElectedPlans[k][2][39]
			}
			else if(parseInt(ElectedPlans[k][0],10)==12)
			{
				plan_type2 = ElectedPlans[k][2][1]
				plan_code2 = ElectedPlans[k][2][2]
			}
			else
				continue
			if(j != k && plan_type==plan_type2 && plan_code==plan_code2
			 && ElectedPlans[j][5] != BenefitRules[2])
			{
				isDup = true
				break
			}
		}
		// logic to remove duplicate plans
		if(isDup)
		{
			for (var n=0;n<ElectedPlans.length;n++)
			{
				if(n != j)
				{
					var c = cleanElections.length
					var d = cleanDependents.length
					var e = cleanOldDependents.length
					cleanElections[c] = new Array()
					cleanElections[c] = ElectedPlans[n]
					cleanDependents[d] = new Array()
					cleanDependents[d] = DependentBens[n]
					cleanOldDependents[e] = new Array()
					cleanOldDependents[e] = oldDepBens[n]
				}
			}
			ElectedPlans = new Array()
			ElectedPlans = cleanElections
			DependentBens = new Array()
			DependentBens = cleanDependents
			oldDepBens = new Array()
			oldDepBens = cleanOldDependents
			removeStoppedElections()
			return
		}
	}
	// after dups are removed, make sure the plans the user has told us to stop get
	// pulled out of the new election array
	removeUserStoppedPlans(1)
}
function removeUserStoppedPlans(cIndex)
{
	cIndex = (typeof(cIndex) == "undefined") ? 1 : cIndex;
	var cleanElections = new Array()
	var cleanDependents = new Array()
	var cleanOldDependents = new Array()
	// logic to remove plans the user has just stopped
	for (var j=0;j<ElectedPlans.length;j++)
	{
		cleanElections = new Array()
		cleanDependents = new Array()
		cleanOldDependents = new Array()
		var plan_type = ""
		var plan_code = ""
		var plan_type2 = ""
		var plan_code2 = ""
		if(!ElectedPlans[j][2]) continue
		if(parseInt(ElectedPlans[j][0],10)==1)
		{
			plan_type = ElectedPlans[j][2][11]
			plan_code = ElectedPlans[j][2][12]
		}
		else if((parseInt(ElectedPlans[j][0],10)>1 && parseInt(ElectedPlans[j][0],10)<6) || parseInt(ElectedPlans[j][0],10)==13)
		{
			plan_type = ElectedPlans[j][2][37]
			plan_code = ElectedPlans[j][2][38]
		}
		else if(parseInt(ElectedPlans[j][0],10)>5 && parseInt(ElectedPlans[j][0],10)<11)
		{
			plan_type = ElectedPlans[j][2][38]
			plan_code = ElectedPlans[j][2][39]
		}
		else if(parseInt(ElectedPlans[j][0],10)==12)
		{
			plan_type = ElectedPlans[j][2][1]
			plan_code = ElectedPlans[j][2][2]
		}
		else
			continue
		for (var c=cIndex;c<CurrentBens.length;c++)
		{
			if(plan_type == CurrentBens[c][1] && plan_code == CurrentBens[c][2] &&
			CurrentBens[c][0] && (parseInt(CurrentBens[c][0][0],10) == 3 || parseInt(CurrentBens[c][0][0],10) == 1))
			{
				var startDate = BenefitRules[2];
				if (rule_type == "N" || rule_type == "F")
				{	
					var actionTaken = parseInt(CurrentBens[c][0][0],10);
					for (var k=1; k<EligPlans.length; k++) 
					{
						if (plan_type == EligPlans[k][1] && plan_code == EligPlans[k][2])
						{
							if (rule_type == "N")
							{
								startDate = EligPlans[k][5];
								break;						
							}
							else if (rule_type == "F")
							{
								if (actionTaken == 1)
									startDate = EligPlans[k][11];
								else if (actionTaken == 3)
									startDate = parent.EligPlans[k][15];
								break;							
							}	
						}
					}	
				}		
				
				if (ElectedPlans[j][5] == startDate)
				{
					continue;
				}
				else
				{
					for (var d=0;d<ElectedPlans.length;d++)
					{
						if (d != j)
						{
							var x = cleanElections.length
							var y = cleanDependents.length
							var z = cleanOldDependents.length
							cleanElections[x] = new Array()
							cleanElections[x] = ElectedPlans[d]
							cleanDependents[y] = new Array()
							cleanDependents[y] = DependentBens[d]
							cleanOldDependents[z] = new Array()
							cleanOldDependents[z] = oldDepBens[d]
						}
					}
					ElectedPlans = new Array()
					ElectedPlans = cleanElections
					DependentBens = new Array()
					DependentBens = cleanDependents
					oldDepBens = new Array()
					oldDepBens = cleanOldDependents
					removeUserStoppedPlans(c+1)
					return
				}
			}
		}
	}
}
function getCoverage(arr,recType,planDesc,planDate,ischanged,isflex)
{		
	var bod=""
	noCosts=false
	var issplit = isEmpCostSplit(arr,recType)
	var showDate = (planDate!=null && typeof(planDate)!='undefined' && rule_type!="A") ? true : false;
	if(recType=="01" || parseFloat(recType)==1)
	{
//GDD  01/15/15  Align coverage to the left instead of center
		bod+='<tr><td class="plaintablecellborder"  style="text-align:left" nowrap>&nbsp;'
		if(ischanged)
			bod+="* "
		bod+=planDesc+'&nbsp;</td><td class="plaintablecellborderright" style="text-align:left" nowrap>&nbsp;'+arr[2]+'&nbsp;</td>'
		if(showDate)
			bod+='<td class="plaintablecellborder">&nbsp;'+planDate+'&nbsp;</td>'
		if (!issplit)
			bod+=getCosts(arr,recType,planDesc,isflex,issplit,"P",false)+'</tr>'
		else
			bod+=getSplitCosts(arr,recType,planDesc,isflex,showDate,preTaxVal,aftTaxVal)+'</tr>'
	}
	if(recType=="02" || parseFloat(recType)==2)
	{
		bod+='<tr><td class="plaintablecellborder" style="text-align:left" nowrap>&nbsp;'
		if(ischanged)
			bod+="* "
		bod+=planDesc+'&nbsp;</td>'
		if(arr[4]=="E")
		{
			bod+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'
			bod+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'			
			bod+='</tr><tr><td class="plaintablecellborderright" nowrap>'+getSeaPhrase("EMPLOYEE","BEN")+'</td><td class="plaintablecellborderright" nowrap>&nbsp;'+formatCont(arr[14])+'&nbsp;</td>'
			if(showDate)
				bod+='<td class="plaintablecellborder">&nbsp;'+planDate+'&nbsp;</td>'
		}
		else if(arr[4]=="S")
		{
			bod+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'
			bod+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'			
			bod+='<tr><td class="plaintablecellborderright" nowrap>'+getSeaPhrase("SPOUSE","BEN")+'</td><td class="plaintablecellborderright" nowrap>&nbsp;'+formatCont(arr[14])+'&nbsp;</td>'
			if(showDate)
				bod+='<td class="plaintablecellborder">&nbsp;'+planDate+'&nbsp;</td>'
		}
		else if(arr[4]=="D")
		{
			bod+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'
			bod+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'			
			bod+='</tr><tr><td class="plaintablecellborderright" nowrap>'+getSeaPhrase("DEPENDENT","BEN")+'</td><td class="plaintablecellborderright" nowrap>&nbsp;'+formatCont(arr[14])+'&nbsp;</td>'
			if(showDate)
				bod+='<td class="plaintablecellborder">&nbsp;'+planDate+'&nbsp;</td>'
		}
		else if(arr[4]=="B" || arr[4]=="C" || arr[4]=="A")
		{
			var covLbl = "&nbsp;";
			if (arr[4]=="B")
				covLbl = getSeaPhrase("SPOUSE","BEN");
			else if (arr[4]=="C")
				covLbl = getSeaPhrase("DOM_PARTNER","BEN");
			else if (arr[4]=="A")
				covLbl = getSeaPhrase("SPOUSE_OR_PARTNER","BEN");			
			bod+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'
			bod+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'			
			bod+='</tr><tr><td class="plaintablecellborderright" nowrap>'+getSeaPhrase("DEPENDENT","BEN")+'</td><td class="plaintablecellborderright" nowrap>&nbsp;'+formatCont(arr[7])+'&nbsp;</td>'
			bod+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'
			bod+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'				
			bod+='</tr><tr><td class="plaintablecellborderright" nowrap>'+covLbl+'</td><td class="plaintablecellborderright" nowrap>&nbsp;'+formatCont(arr[14])+'&nbsp;</td>'
			if(showDate)
				bod+='<td class="plaintablecellborder">&nbsp;'+planDate+'&nbsp;</td>'				
		}
		else if(arr[4]=="P")
		{
			bod+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'
			bod+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'			
			bod+='<tr><td class="plaintablecellborderright" nowrap>'+getSeaPhrase("DOM_PARTNER","BEN")+'</td><td class="plaintablecellborderright" nowrap>&nbsp;'+formatCont(arr[14])+'&nbsp;</td>'
			if(showDate)
				bod+='<td class="plaintablecellborder">&nbsp;'+planDate+'&nbsp;</td>'
		}
		else if(arr[4]=="O")
		{
			bod+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'
			bod+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'			
			bod+='<tr><td class="plaintablecellborderright" nowrap>'+getSeaPhrase("SPOUSE_OR_PARTNER","BEN")+'</td><td class="plaintablecellborderright" nowrap>&nbsp;'+formatCont(arr[14])+'&nbsp;</td>'
			if(showDate)
				bod+='<td class="plaintablecellborder">&nbsp;'+planDate+'&nbsp;</td>'
		}
		else if(arr[4]=="R")
		{
			bod+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'
			bod+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'			
			bod+='<tr><td class="plaintablecellborderright" nowrap>'+getSeaPhrase("PARTNER_DEPS","BEN")+'</td><td class="plaintablecellborderright" nowrap>&nbsp;'+formatCont(arr[14])+'&nbsp;</td>'
			if(showDate)
				bod+='<td class="plaintablecellborder">&nbsp;'+planDate+'&nbsp;</td>'
		}		
		else
		{
			bod+='<td class="plaintablecellborderright" nowrap>&nbsp;'+formatCont(arr[14])+'&nbsp;</td>'
			if(showDate)
				bod+='<td class="plaintablecellborder">&nbsp;'+planDate+'&nbsp;</td>'			
		}	
		if (!issplit)
			bod+=getCosts(arr,recType,planDesc,isflex,issplit,"P",false)+'</tr>'
		else
			bod+=getSplitCosts(arr,recType,planDesc,isflex,showDate,preTaxVal,aftTaxVal)+'</tr>'
	}
	if(recType=="03" || parseFloat(recType)==3 || recType=="13" || parseFloat(recType)==13)
	{
		bod+='<tr><td class="plaintablecellborder" nowrap>&nbsp;'
		if(ischanged)
			bod+="* "
		bod+=planDesc+'&nbsp;</td><td class="plaintablecellborderright" nowrap>&nbsp;'
		if(arr[11] && arr[11]!="")
			bod+=formatCont(arr[11])+'&nbsp;</td>'
		else
			bod+=formatCont(arr[14])+'&nbsp;</td>'
		if (showDate)
		bod+='<td class="plaintablecellborder">&nbsp;'+planDate+'&nbsp;</td>'
		if (!issplit)
			bod+=getCosts(arr,recType,planDesc,isflex,issplit,"P",false)+'</tr>'
		else
			bod+=getSplitCosts(arr,recType,planDesc,isflex,showDate,preTaxVal,aftTaxVal)+'</tr>'
	}
	if(recType=="04" || parseFloat(recType)==4)
	{
//GDD  01/15/15  Add left justifcation for coverage
		bod+='<tr><td class="plaintablecellborder" sytle="text-align:left" nowrap>&nbsp;'
		if(ischanged)
			bod+="* "
		bod+=planDesc+'&nbsp;</td><td class="plaintablecellborderright" style="text-align:left"  nowrap>&nbsp;'+formatCont(arr[17])+'&nbsp;</td>'
		if(showDate)
			bod+='<td class="plaintablecellborder">&nbsp;'+planDate+'&nbsp;</td>'
		if (!issplit)
			bod+=getCosts(arr,recType,planDesc,isflex,issplit,"P",false)+'</tr>'
		else
			bod+=getSplitCosts(arr,recType,planDesc,isflex,showDate,preTaxVal,aftTaxVal)+'</tr>'
	}
	if(recType=="05" || parseFloat(recType)==5)
	{
		bod+='<tr><td class="plaintablecellborder" nowrap>&nbsp;'
		if(ischanged)
			bod+="* "
		bod+=planDesc+'&nbsp;</td><td class="plaintablecellborderright" nowrap>&nbsp;'
		if(arr[12])
		{			
			bod+=getSeaPhrase("%_OF_SAL","BEN",[arr[12]])+'&nbsp;'
			if (arr[14])
				bod+='<br/>'
		}	
		if (arr[14])	
			bod+=formatCont(arr[14])+'&nbsp;'
		bod+='</td>'	
		if(showDate)
			bod+='<td class="plaintablecellborder">&nbsp;'+planDate+'&nbsp;</td>'
		if (!issplit)
			bod+=getCosts(arr,recType,planDesc,isflex,issplit,"P",false)+'</tr>'
		else
			bod+=getSplitCosts(arr,recType,planDesc,isflex,showDate,preTaxVal,aftTaxVal)+'</tr>'
	}
	if(recType=="06" || parseFloat(recType)==6)
	{
		bod+='<tr><td class="plaintablecellborder" nowrap>&nbsp;'
		if(ischanged)
			bod+="* "
//GDD  01/15/15  left justify coverage
		bod+=planDesc+'&nbsp;</td><td class="plaintablecellborderright" style="text-align:left" nowrap>&nbsp;'
		if(arr[23])
		{
			bod+=formatCont(arr[23])
			if(arr[42] && arr[42]=="A")
				bod+=' ' + getSeaPhrase("PER_YEAR","BEN")
			else if(arr[42] && arr[42]=="P")
				bod+=getSeaPhrase("PERCENT_OF_TOTAL","BEN")
		}
		bod+='&nbsp;</td>'
		if(showDate)
			bod+='<td class="plaintablecellborder">&nbsp;'+planDate+'&nbsp;</td>'
		if (!issplit)
			bod+=getCosts(arr,recType,planDesc,isflex,issplit,"P",false)+'</tr>'
		else
			bod+=getSplitCosts(arr,recType,planDesc,isflex,showDate,preTaxVal,aftTaxVal)+'</tr>'
	}
	if(recType=="07" || parseFloat(recType)==7)
	{
		bod+='<tr><td class="plaintablecellborder" nowrap>&nbsp;'
		if(ischanged)
			bod+="* "
		bod+=planDesc+'&nbsp;</td><td class="plaintablecellborderright" nowrap>&nbsp;'+arr[23]+' '+getSeaPhrase("HOURS","BEN")+'&nbsp;</td>'
		if(showDate)
			bod+='<td class="plaintablecellborder">&nbsp;'+planDate+'&nbsp;</td>'
		if (!issplit)
			bod+=getCosts(arr,recType,planDesc,isflex,issplit,"P",false)+'</tr>'
		else
			bod+=getSplitCosts(arr,recType,planDesc,isflex,showDate,preTaxVal,aftTaxVal)+'</tr>'
	}
	if(recType=="08" || parseFloat(recType)==8 || recType=="09" || parseFloat(recType)==9)
	{
		type89flg=-1
		bod+='<tr><td class="plaintablecellborder" nowrap>&nbsp;'
		if(ischanged)
			bod+="* "
		bod+=planDesc+'&nbsp;</td><td class="plaintablecellborderright" nowrap>&nbsp;'
		if(arr[23] && arr[23]!="" && parseFloat(arr[23])!=0)
		{
			var tmp = new Array()
			if(arr[23].toString().indexOf("%")!=-1)
			{
				tmp = arr[23].toString().split('%')
				arr[23]=tmp[0]
			}
			if(!isNaN(parseFloat(arr[23])))
			{
				type89flg=0
				if(arr[41])
				{
					bod+=formatCont(arr[41])
					if(arr[42] && arr[42]=="A")
					   bod+=' ' + getSeaPhrase("PER_YEAR","BEN")
					else if(arr[42] && arr[42]=="P")
					   bod+=getSeaPhrase("PERCENT_OF_TOTAL","BEN")
				}
				bod+='&nbsp;</td>'
				if(showDate)
					bod+='<td class="plaintablecellborder">&nbsp;'+planDate+'&nbsp;</td>'
				if(arr[24]!="P")
					bod+=getCosts(arr,recType,planDesc,isflex,issplit,"P",false)+'</tr>'
				else
				{
					if(arr[23]==0 || arr[23]=="") noCosts=true
					empflag=1
					Pcost+=parseFloat(arr[23])
					EmpPreTaxPercentTotal+=parseFloat(arr[23])
					// Flex, Spacer, and Emp columns
					bod+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborderright" nowrap>&nbsp;'+formatCont(arr[23])
					if(formatCont(arr[23])!="")
						bod+=getSeaPhrase("PER","BEN")+'&nbsp;</td><td class="plaintablecellborder" nowrap>&nbsp;'+getSeaPhrase("PRE_TAX","BEN")+'</td><td class="plaintablecellborder">&nbsp;</td>'
					else
						bod+='&nbsp;</td><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'		
				}
			}
		}
		if(arr[36] && arr[36]!="" && parseFloat(arr[36])!=0)
		{
			var tmp = new Array()
			if(arr[36].toString().indexOf("%")!=-1)
			{
				tmp = arr[36].toString().split('%')
				arr[36] = tmp[0]
			}
			if(!isNaN(arr[36]))
			{
				if(type89flg==0)
				{
					bod+='<tr><td class="plaintablecellborder" nowrap>&nbsp;</td><td class="plaintablecellborderright" nowrap>&nbsp;</td>'
				}
				else
				{
				    if(arr[41])
					{
					    bod+=formatCont(arr[41])
						if(arr[42] && arr[42]=="A")
					        bod+=' '+getSeaPhrase("PER_YEAR","BEN")
					    else if(arr[42] && arr[42]=="P")
					        bod+=getSeaPhrase("PERCENT_OF_TOTAL","BEN")
				    }
					bod+='&nbsp;</td>'
				}
				type89flg=1
				if(showDate)
					bod+='<td class="plaintablecellborder">&nbsp;'+planDate+'&nbsp;</td>'
				if(arr[24]!="P")
					bod+=getCosts(arr,recType,planDesc,isflex,issplit,"P",false)+'</tr>'
				else
				{
					if(arr[36]==0 || arr[36]=="") noCosts=true
					empflag=1
					Pcost+=parseFloat(arr[36])
					EmpAfterTaxPercentTotal+=parseFloat(arr[36])
					// Flex, Spacer, and Emp columns
					bod+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborderright" nowrap>&nbsp;'+formatCont(arr[36])
					if(formatCont(arr[36])!="")
						bod+=getSeaPhrase("PER","BEN")+'&nbsp;</td><td class="plaintablecellborder" nowrap>&nbsp;'+getSeaPhrase("AFTER_TAX","BEN")+'</td><td class="plaintablecellborder">&nbsp;</td>'
					else bod+='&nbsp;</td><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'
				}
			}
		}
		if(type89flg==-1)
		{
			bod+='&nbsp;</td>'
			if(showDate)
				bod+='<td class="plaintablecellborder">&nbsp;'+planDate+'&nbsp;</td>'
			if(arr[24]!="P")
				bod+=getCosts(arr,recType,planDesc,isflex,issplit,"P",false)+'</tr>'
			else
			{
				if(arr[23]==0 || arr[23]=="") noCosts=true
				empflag=1
				Pcost+=parseFloat(arr[23])
				EmpPreTaxPercentTotal+=parseFloat(arr[23])
				// Flex, Spacer, and Emp columns
				bod+='<td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborderright" nowrap>&nbsp;'+formatCont(arr[23])
				if(formatCont(arr[23])!="")
					bod+=getSeaPhrase("PER","BEN")+'&nbsp;</td><td class="plaintablecellborder" nowrap>&nbsp;'+getSeaPhrase("PRE_TAX","BEN")+'</td><td class="plaintablecellborder">&nbsp;</td>'
				else bod+='&nbsp;</td><td class="plaintablecellborder">&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'
			}
		}
		bod+='</tr>'
	}
	if(recType=="10" || parseFloat(recType)==10)
	{
		bod+='<tr><td class="plaintablecellborder" nowrap>&nbsp;'
		if(ischanged)
			bod+="* "
		bod+=planDesc+'&nbsp;</td><td class="plaintablecellborder">&nbsp;</td>'
		if(showDate)
			bod+='<td class="plaintablecellborder">&nbsp;'+planDate+'&nbsp;</td>'
		if (!issplit)
			bod+=getCosts(arr,recType,planDesc,isflex,issplit,"P",false)+'</tr>'
		else
			bod+=getSplitCosts(arr,recType,planDesc,isflex,showDate,preTaxVal,aftTaxVal)+'</tr>'
	}
	if(recType=="12" || parseFloat(recType)==12)
	{
	//GDD   01/15/15  Left justify coverage
		bod+='<tr><td class="plaintablecellborder" style="text-align:left" nowrap>&nbsp;'
		if(ischanged)
			bod+="* "
		bod+=planDesc+'&nbsp;</td>'
		if((arr[1]=="HL" || arr[1]=="DN") && arr[65]=="Y")
			bod+='<td class="plaintablecellborderright" style="text-align:left">&nbsp;'+getSeaPhrase("CURBEN_26","BEN")+'&nbsp;</td>'
		else	
			bod+='<td class="plaintablecellborder">&nbsp;</td>'
		if(showDate)
			bod+='<td class="plaintablecellborder">&nbsp;'+planDate+'&nbsp;</td>'
		if (!issplit)
			bod+=getCosts(arr,recType,planDesc,isflex,issplit,"P",false)+'</tr>'
		else
			bod+=getSplitCosts(arr,recType,planDesc,isflex,showDate,preTaxVal,aftTaxVal)+'</tr>'
	}
	return bod
}
function InitSummaryTotals()
{
	EmpFlexTotal = 0
	EmpNegPreTaxTotal = 0
	BenCreditTotal = 0
	FlexCreditTotal = 0
	EmpPreTaxTotal = 0
	//PT 162690
	EmpPreTaxFlexTotal = 0
	CreditsLessPreTax = 0
	EmpPreTaxTotalLessFlex = 0
	AddToGrossPercent = 0
	AddedToPay = 0
	ForfeitedDifference = 0
	EmpAfterTaxTotal = 0
	EmpPreTaxPercentTotal = 0
	EmpAfterTaxPercentTotal = 0
	TaxPercentTotal = 0
	CompanyTotal = 0
}
function GetSummaryTable()
{
	var cost_div_desc = ""
	if (BenefitRules[6]=="A")
		cost_div_desc = getSeaPhrase("ANNUAL_SUMMARY","BEN")
	else if (BenefitRules[6]=="P")
		cost_div_desc = getSeaPhrase("PAY_PERIOD_SUMMARY","BEN")
	else if (BenefitRules[6]=="M")
		cost_div_desc = getSeaPhrase("MONTHLY_SUMMARY","BEN")
	else if (BenefitRules[6]=="S")
		cost_div_desc = getSeaPhrase("SEMI_MONTHLY_SUMMARY","BEN")
	var table = '<table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" style="width:100%;margin-left:auto;margin-right:auto" styler="list" summary="'+getSeaPhrase("TSUM_8","BEN")+'">'
	table += '<caption class="offscreen">'+getSeaPhrase("TCAP_7","BEN")+'</caption>'
//GDD  01/15/15  change justify from center to right.
	table += '<tr><th scope="col" class="plaintableheaderborder" style="width:50%;text-align:right;white-space:nowrap">'+cost_div_desc+'</th>'
//GDD   01/15/15  change justify from center to right
	table += '<th scope="col" class="plaintableheaderborder" style="width:50%;text-align:right;white-space:nowrap">'+getSeaPhrase("COST","BEN")+'</th></tr>'
	if (typeof(BenefitRules[8])!="undefined" && BenefitRules[8] == "Y")	
	{
		if (FlexPlan[8]!=null && !isNaN(parseFloat(FlexPlan[8])))
			EmpFlexTotal = parseFloat(FlexPlan[8])
		if (FlexPlan[9]!=null && !isNaN(parseFloat(FlexPlan[9])))
			AddToGrossPercent = parseFloat(FlexPlan[9]/100)
	}
	BenCreditTotal = parseFloat(Fcost) + parseFloat(Math.abs(EmpNegPreTaxTotal))
	FlexCreditTotal = EmpFlexTotal + BenCreditTotal
	EmpPreTaxTotalLessFlex = EmpPreTaxTotal - EmpPreTaxFlexTotal;
	CreditsLessPreTax = FlexCreditTotal - EmpPreTaxFlexTotal
	if (CreditsLessPreTax > 0) 
	{
		AddedToPay = CreditsLessPreTax * AddToGrossPercent
		ForfeitedDifference = CreditsLessPreTax - AddedToPay
	}
	TaxPercentTotal = parseFloat(EmpPreTaxPercentTotal)+parseFloat(EmpAfterTaxPercentTotal)
// MOD BY BILAL
	//ISH 2007 Remove Flex Credits Display
	/*
	if (EmpFlexTotal != 0) 
	{
		table += '<tr><td class="plaintablecellborderright">'+getSeaPhrase("CURBEN_4","BEN")+'</td>'
		table += '<td class="plaintablecellborderright">'+(formatCont(EmpFlexTotal)?formatCont(EmpFlexTotal):'&nbsp;')+'</td></tr>'
	}
	if (BenCreditTotal != 0) 
	{
		table += '<tr><td class="plaintablecellborderright">'+getSeaPhrase("CURBEN_5","BEN")+'</td>'
		table += '<td class="plaintablecellborderright">'+(formatCont(BenCreditTotal)?formatCont(BenCreditTotal):'&nbsp;')+'</td></tr>'
	}
	if (FlexCreditTotal != 0 && EmpFlexTotal != 0 && BenCreditTotal != 0) 
	{
		table += '<tr><td class="plaintablecellborderright">'+getSeaPhrase("CURBEN_6","BEN")+'</td>'
		table += '<td class="plaintablecellborderright">'+(formatCont(FlexCreditTotal)?formatCont(FlexCreditTotal):'&nbsp;')+'</td></tr>'
	}
	if (FlexCreditTotal != 0) 
	{
		table += '<tr><td class="plaintablecellborderright">*** '+getSeaPhrase("CURBEN_7","BEN")+'</td>'
		table += '<td class="plaintablecellborderright">&nbsp;</td></tr>'
	}
	if (EmpPreTaxTotal != 0 && FlexCreditTotal != 0) 
	{
		table += '<tr><td class="plaintablecellborderright">'+getSeaPhrase("CURBEN_8","BEN")+'</td>'
		table += '<td class="plaintablecellborderright">'+(formatCont(EmpPreTaxTotal)?formatCont(EmpPreTaxTotal):'&nbsp;')+'</td></tr>'
	}
    ISH 2007 End */
// END OF MOD
	if (CreditsLessPreTax < 0)
	{
		table += '<tr><td class="plaintablecellborderright">'+getSeaPhrase("CURBEN_9","BEN")+'</td>'
		table += '<td class="plaintablecellborderright">'
		table += formatCont(Math.abs(CreditsLessPreTax) + EmpPreTaxTotalLessFlex)
	}
	else
	{
		table += '<tr><td class="plaintablecellborderright">'+getSeaPhrase("CURBEN_9","BEN")+'</td>'
		table += '<td class="plaintablecellborderright">'
		if (EmpPreTaxTotalLessFlex > 0)
			table += formatCont(EmpPreTaxTotalLessFlex)
		else
			table += "0.00"
	}
// MOD BY BILAL
	//ISH 2007 Start Flex Display removed
	/*	
	if (CreditsLessPreTax == 0 && EmpPreTaxFlexTotal != 0) 
	{
		table += '<tr><td class="plaintablecellborderright">'+getSeaPhrase("CURBEN_10","BEN")+'</td>'
		table += '<td class="plaintablecellborderright">&nbsp;</td></tr>'
	}
	if (CreditsLessPreTax > 0) 
	{
		table += '<tr><td class="plaintablecellborderright">'+getSeaPhrase("CURBEN_11","BEN")+'</td>'
		table += '<td class="plaintablecellborderright">'+(formatCont(CreditsLessPreTax)?formatCont(CreditsLessPreTax):'&nbsp;')+'</td></tr>'
	}
	if (CreditsLessPreTax > 0 && AddToGrossPercent == 0) 
	{
		table += '<tr><td class="plaintablecellborderright">'+getSeaPhrase("CURBEN_12","BEN")+'</td>'
		table += '<td class="plaintablecellborderright">&nbsp;</td></tr>'
	}
	if (ForfeitedDifference	!= 0 && AddToGrossPercent != 0)	
	{
		table += '<tr><td class="plaintablecellborderright">'+formatCont(AddToGrossPercent*100)+getSeaPhrase("CURBEN_13","BEN")+'<br/>'
		table += getSeaPhrase("CURBEN_15","BEN")+' '+formatCont(ForfeitedDifference)+'</td>'
		table += '<td class="plaintablecellborderright">&nbsp;</td></tr>'
	} 
	ISH 2007 End */
// END Of MOD
	if (AddedToPay != 0) 
	{
		table += '<tr><td class="plaintablecellborderright">'+getSeaPhrase("CURBEN_16","BEN")+'</td>'
		table += '<td class="plaintablecellborderright">'+(formatCont(AddedToPay)?formatCont(AddedToPay):'&nbsp;')+'</td></tr>'
	}
	table += '<tr><td class="plaintablecellborderright">'+getSeaPhrase("CURBEN_17","BEN")+'</td>'
	table += '<td class="plaintablecellborderright">'
	if (EmpAfterTaxTotal > 0)
		table += formatCont(EmpAfterTaxTotal)
	else 
		table += "0.00"
	table += '</td></tr>'
	if (EmpPreTaxPercentTotal > 0) 
	{
		table += '<tr><td class="plaintablecellborderright">'+getSeaPhrase("CURBEN_18","BEN")+'</td>'
		table += '<td class="plaintablecellborderright">'+(formatCont(EmpPreTaxPercentTotal)?formatCont(EmpPreTaxPercentTotal):'&nbsp;')+'</td></tr>'
	}
	if (EmpAfterTaxPercentTotal > 0) 
	{
		table += '<tr><td class="plaintablecellborderright">'+getSeaPhrase("CURBEN_19","BEN")+'</td>'
		table += '<td class="plaintablecellborderright">'+(formatCont(EmpAfterTaxPercentTotal)?formatCont(EmpAfterTaxPercentTotal):'&nbsp;')+'</td></tr>'
	}
	if (EmpPreTaxPercentTotal > 0 && EmpAfterTaxPercentTotal > 0) 
	{
		table += '<tr><td class="plaintablecellborderright">'+getSeaPhrase("CURBEN_20","BEN")+'</td>'
		table += '<td class="plaintablecellborderright">'+(formatCont(TaxPercentTotal)?formatCont(TaxPercentTotal):'&nbsp;')+'</td></tr>'
	}
	if (CompanyTotal != 0) 
	{
		table += '<tr><td class="plaintablecellborderright">'+getSeaPhrase("CURBEN_21","BEN")+'</td>'
		table += '<td class="plaintablecellborderright">'+(formatCont(CompanyTotal)?formatCont(CompanyTotal):'&nbsp;')+'</td></tr>'
	}
	table += '</table>'
	table += '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;margin-left:auto;margin-right:auto" role="presentation">'
	table += '<tr><td colspan="2" class="plaintablecellsmallright" style="padding-top:3px;font-size:8pt">'+getSeaPhrase("ROUNDING_NOTE","BEN")+'</td></tr>'
	table += '</table>'
	return table
}
function setCostDivisor(fldval)
{
	setContDivisor(fldval)
	if(fldval=="P")
 		costdivisor = getSeaPhrase("COST_PP","BEN")
 	if(fldval=="M")
 		costdivisor = getSeaPhrase("COST_PM","BEN")
 	if(fldval=="A")
 		costdivisor = getSeaPhrase("COST_AN","BEN")
	if(fldval=="S")
		costdivisor = getSeaPhrase("COST_SM","BEN")
}
function setContDivisor(fldval)
{
	if(fldval=="P")
 		contdivisor = getSeaPhrase("CONT_PP","BEN")
 	if(fldval=="M")
 		contdivisor = getSeaPhrase("CONT_PM","BEN")
 	if(fldval=="A")
 		contdivisor = getSeaPhrase("CONT_AN","BEN")
	if(fldval=="S")
		contdivisor = getSeaPhrase("CONT_SM","BEN")
}
function setpreaft_flag(flg)
{
    // PT101823 - do not set flag if plan is a no ee contribution plan	
    if (typeof(flg)=="undefined" || !flg || flg==null || flg=="")
        preaft_flag=""
    else if(flg=="P")
        preaft_flag="Pre-Tax"
    else if(flg=="A")
        preaft_flag="After-Tax"
}
function FormatDecimalField(fldval,decimals)
{
	if (fldval.charAt(fldval.length - 1) == "+" || fldval.charAt(fldval.length - 1) == "-")
		fldval = fldval.substring(0,fldval.length - 1)
	var fmtval = ""
	var nonzero = false
	for (var i=0;i < fldval.length;i++)
	{
		if (fldval.charAt(i) >= 0 && fldval.charAt(i) <= 9)
		{
			if (nonzero)
				fmtval += fldval.charAt(i)
			else if (fldval.charAt(i) != "0")
			{
				nonzero = true
				fmtval += fldval.charAt(i)
			}
		}
	}
	if (fmtval.length > 0)
	{
		if (decimals == 4)
		{
			if (fmtval.length == 1)
				fmtval = "000" + fmtval
			if (fmtval.length == 2)
				fmtval = "00" + fmtval
			if (fmtval.length == 3)
				fmtval = "0" + fmtval
		}
		if (decimals == 3)
		{
			if (fmtval.length == 1)
				fmtval = "000" + fmtval
			if (fmtval.length == 2)
				fmtval = "00" + fmtval
		}
		if (decimals == 2)
		{
			if (fmtval.length == 1)
				fmtval = "000" + fmtval
		}
	}
	if (fmtval.length > 0)
	{
		var x = fmtval.length - decimals
		fmtval = fmtval.substring(0,x) + "." + fmtval.substring(x,fmtval.length)
	}
	if(decimals==0)
		fmtval+="00"
	return fmtval
}
function formatComma(NumString)
{
	if (typeof(NumString)=="undefined" || NumString==null)
		NumString = ""
	var TempStr = ""
	var MainBlock = ""
	var StringOut = ""
	var MinusLoc = 0
	var DecimalLoc = 0
	var StartLength = 0
	var LoopNbr = 0
	var StringLeft = 0
	var EndHere = 0
	TempStr = removespace(removecomma(NumString))
	if (NumString == "" || parseFloat(NumString) == 0 || isNaN(parseFloat(TempStr)))
		return ""
    MinusLoc = TempStr.indexOf("-")
    DecimalLoc = TempStr.indexOf(".")
	StartLength = TempStr.length
    if (DecimalLoc >= 0)
	{
		if (MinusLoc == 0)
		    MainBlock = TempStr.substring(1,DecimalLoc)  	//LEADING MINUS
	 	 else
		 {
		 	if (DecimalLoc > 0)
		    	MainBlock = TempStr.substring(0,DecimalLoc)	//TRAILING OR NO MINUS
		 }
	}
	else    												//NO DECIMAL
	{
		if (MinusLoc == 0)
			MainBlock = TempStr.substring(1,StartLength)  	//LEADING MINUS
		else
		{
		    if (MinusLoc > 0)
			   MainBlock = TempStr.substring(0,MinusLoc) 	//TRAILING MINUS
			else
			   MainBlock = TempStr      			//NO MINUS
		}
	}
	if (MainBlock != "")
		MainBlock = parseFloat(MainBlock).toString()
    LoopNbr = parseInt((MainBlock.length-1)/3,10)
    StringLeft = MainBlock.length % 3
    for (var j=0;j<LoopNbr;j++)
    {
		EndHere = parseInt(MainBlock.length-(3*j),10)
		StringOut = "," + MainBlock.substring(EndHere-3,EndHere) + StringOut
	}
    if (StringLeft == 1)
	   StringOut = MainBlock.substring(0,1) + StringOut
    if (StringLeft == 2)
	   StringOut = MainBlock.substring(0,2) + StringOut
    if (StringLeft == 0)
	   StringOut = MainBlock.substring(0,3) + StringOut
	if (StringOut == "") StringOut = "0"
    if (DecimalLoc >= 0)
	{
	   if (MinusLoc == 0)        	//MINUS
	   		StringOut = "-" + StringOut + TempStr.substring(DecimalLoc,StartLength)
	   else if (MinusLoc > 0)
	   		StringOut = "-" + StringOut + TempStr.substring(DecimalLoc,MinusLoc)
	   else							//TRAILING OR NO MINUS
			StringOut = StringOut + TempStr.substring(DecimalLoc,StartLength)
	}
	else if (MinusLoc >= 0)			//NO DECIMAL
	     	StringOut = "-" + StringOut 	//MINUS
	var TempStr2 = ""
	for(var k=0;k<StringOut.length;k++)
	{																				//on some machines a leading comma is placed
		if(!isNaN(parseInt(StringOut.charAt(k),10)) || StringOut.charAt(k)==".")	//this loop will remove all leading commas and spaces
		{
			if (MinusLoc >= 0)
				TempStr2 = "-" + StringOut.substring(k,StringOut.length)
			else TempStr2 = StringOut.substring(k,StringOut.length)
			break
		}
	}
	return TempStr2
}
function GetShowElectionsHeader(justText)
{
	var hdr = '<center>'
	if (!justText)
		hdr += '<p class="plaintablecell" style="text-align:center">'+getSeaPhrase("PRINT_ELECT","BEN")+' '+fmttoday+'.</p>'
	hdr +='<p><table class="plaintableborder" border="0" style="width:100%;margin-left:auto;margin-right:auto" cellpadding="0" cellspacing="0" summary="'+getSeaPhrase("TSUM_9","BEN")+'">'
	+ '<caption class="offscreen">'+getSeaPhrase("TCAP_8","BEN")+'</caption>' 
	+ '<tr><th scope="col" colspan="4"></th></tr>'
	+ '<tr><th scope="row" class="plaintablerowheaderborder" nowrap>'+getSeaPhrase("EMPNAME","BEN")+'</th>'
    + '<td class="plaintablecellborderdisplayright" nowrap>'+fullname+'</td>'
    + '<th scope="row" class="plaintablerowheaderborder" nowrap>'+getSeaPhrase("SSN","BEN")+'</th>'
    + '<td class="plaintablecellborderdisplayright" nowrap>'+("XXX-XX-"+ficanbr.substring(ficanbr.length-4,ficanbr.length))+'</td>'
    + '</tr><tr><th scope="row" class="plaintablerowheaderborder" nowrap>'+getSeaPhrase("EMPNUM","BEN")+'</th>'
    + '<td class="plaintablecellborderdisplayright" nowrap>'+employee+'</td>'
    + '<th scope="row" class="plaintablerowheaderborder" nowrap>'+getSeaPhrase("DOB","BEN")+'</th>'
    + '<td class="plaintablecellborderdisplayright" nowrap>'+dateofbirth+'</td></tr>'
// MOD BY BILAL - Prior customization
//ISH 2007 Remove Rate and Birth dateofbirth
//	if (emssObjInstance.emssObj.benPayInfo)
//	{
//		hdr += '<tr><th scope="row" class="plaintablerowheaderborder" nowrap>'
//		if (salaryclass=="H")
//			hdr += getSeaPhrase("HR_RATE2","BEN")+'</th>'
//		else 
//			hdr += getSeaPhrase("ANNUAL_SAL","BEN")+'</th>'
//		hdr +='<td class="plaintablecellborderdisplayright" nowrap>'+formatCont(empsalary)+'</td>'		
//		+ '<th scope="row" class="plaintablerowheaderborder" nowrap>&nbsp;</th>'
//		+ '<td class="plaintablecellborderdisplayright" nowrap>&nbsp;</td></tr>'
//	}
// END OF MOD
	hdr += '</table></p></center>'
	if (!justText)
		hdr +='<p class="plaintablecell">'+getSeaPhrase("COMMENT_TEXT","BEN")+'</p>'
	else
		hdr += '<br/>'	
	return hdr
}
function NewFlexDollars(fc,frm,justText)
{
	window.lawheader.count=0
	NbrRecs = 0
	TC_val = ""
	HK_val = ""

	fromupdatetype = updatetype
	updatetype = "FLX2"
	if (rule_type != "N")
		FlexDate = BenefitRules[2]
	var obj = new AGSObject(prodline,"BS11.1")
	obj.event="ADD"
	obj.rtn="DATA"
	obj.longNames=true
	obj.tds=false
	obj.field="FC="+fc
		  + "&EFD-COMPANY=" + escape(company)
		  + "&EFD-EMPLOYEE=" + escape(employee)
		  + "&BAE-DATE=" + escape(FlexDate)
		  + "&BAE-COST-DIVISOR=" + escape(BenefitRules[6])
	if(justText)
	 	obj.func="parent.printScr('"+frm+"',true)"
	else obj.func="parent.printScr('"+frm+"',false)"
	if (fc == escape("+",1))
		obj.field += "&_f2=" + escape(TC_val) + "&_f288=" + escape(HK_val)
	obj.debug=false
	AGS(obj,"jsreturn")
}
function printScr(frm,justText,onFinal)
{
	Ycost = 0;
	Fcost = 0;
	Ccost = 0;
	Pcost = 0;
	flexflag = 0;
	empflag = 0;
	compflag = 0;
	empcost = 0;
	compcost = 0;
	flexcost = 0;
	taxable = "";
	var htmlHead = "";
	var html = "";
	var head = "";
	var bod = "";
	var alltext = "";
	var resttext = "";
	var printIt = true;
	var payperiod = BenefitRules[6];
	var payDesc = "";
	electionsFrame = null;
	electionsContent = "";
	if (!GotNewFlex && BenefitRules[8] == "Y") 
	{
		GotNewFlex = true;
		NewFlexDollars("I", frm, justText);
		return;
	}
	else if (updatetype=="FLX")
		updatetype = fromupdatetype;
	if (typeof(frm) == "string" && frm.toUpperCase() == "NEWWINDOW")
		printIt = false;
	head+='<div class="plaintablecell" style="padding:0px">';
	if (printIt && !justText)
		head += GetShowElectionsHeader(false);
	else
		head += GetShowElectionsHeader(true);
	if (!justText && quitting)
		head += '<div class="plaintablecellbold">'+getSeaPhrase("CONBEN_17","BEN")+'<br/>'+getSeaPhrase("CONBEN_18","BEN")+'<p/></div>';
	removeStoppedElections();
	InitSummaryTotals();	
	var depHash = new Array();
	var depsExist = false;	
	for (var _k=0; _k<ElectedPlans.length; _k++) 
	{
		var plan_type = "";
		var plan_code = "";
		if (parseInt(ElectedPlans[_k][0],10) == 1)
		{
			plan_type = ElectedPlans[_k][2][11];
			plan_code = ElectedPlans[_k][2][12];
		}
		else if (parseInt(ElectedPlans[_k][0],10) > 1 && parseInt(ElectedPlans[_k][0],10) < 6)
		{
			plan_type = ElectedPlans[_k][2][37];
			plan_code = ElectedPlans[_k][2][38];
		}
		else if (parseInt(ElectedPlans[_k][0],10) > 5 && parseInt(ElectedPlans[_k][0],10) < 11)
		{
			plan_type = ElectedPlans[_k][2][38];
			plan_code = ElectedPlans[_k][2][39];
		}
		else if (parseInt(ElectedPlans[_k][0],10) == 12)
		{
			plan_type = ElectedPlans[_k][2][1];
			plan_code = ElectedPlans[_k][2][2];
		}		
		var arr = ElectedPlans[_k];
		if (arr[2])	
		{
			for (var k=1; k<EligPlans.length; k++)
			{
				arr.isflex = false;
				if (EligPlans[k][1] == plan_type && EligPlans[k][2] == plan_code 
				&& EligPlans[k][22] == "Y")
				{
					arr.isflex = true;
					break;
				}
			}	
			bod += getCoverage(arr[2], arr[0], arr[1], FormatDte4(arr[5]), arr[6], arr.isflex)
			if (DependentBens[_k]) 
			{
				for (var x=0; x<DependentBens[_k][1].length; x++) 
				{
					if (DependentBens[_k][1][x].first_name && DependentBens[_k][1][x].last_name)
					{
						depHash[_k] = true;
						depsExist=true;
						break;
					}
				}
			}
		}
	}
	var bod2 = "";
	// dependents table
	if (depsExist) 
	{
		bod2 += '<br/><center><table class="plaintableborder" border="0" cellpadding="0" cellspacing="0" style="width:100%;margin-left:auto;margin-right:auto" styler="list" summary="'+getSeaPhrase("TSUM_4","BEN")+'">';
		bod2 += '<caption class="offscreen">'+getSeaPhrase("TCAP_3","BEN")+'</caption>'
		bod2 += '<tr><th scope="col" class="plaintableheaderborder" style="width:50%;text-align:center">'+getSeaPhrase("PLAN","BEN")+'</th>';
		bod2 += '<th scope="col" class="plaintableheaderborder" style="width:50%;text-align:center">'+getSeaPhrase("COVERED_DEP","BEN")+'</th></tr>';
		for (var _k=0; _k<ElectedPlans.length; _k++) 
		{
			if (ElectedPlans[_k][2]) 
			{
				if (DependentBens[_k] && depHash[_k]) 
				{
					bod2 += '<tr><td class="plaintablecellborder">'+ElectedPlans[_k][1]+'&nbsp;</td>';
					bod2 += '<td class="plaintablecellborder">';
					for (var x=0; x<DependentBens[_k][1].length; x++) 
					{
						if (DependentBens[_k][1][x].first_name && DependentBens[_k][1][x].last_name)
						{
							for (var y=0; y<dependents.length; y++) 
							{							
								if (dependents[y].seq_nbr == DependentBens[_k][1][x].dependent)	
								{
									if (x > 0)
										bod2 += '<br/>';
									bod2 += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+dependents[y].label_name_1;
									break;
								}	
							}
						}	
					}
					bod2 += '&nbsp;</td></tr>';
				}
			}
		}
		bod2 += '</table></center><br/>';
	}
	head += '<center><table class="plaintableborder" border="0" cellspacing="0" cellpadding="0" style="width:100%;margin-left:auto;margin-right:auto" styler="list" summary="'+getSeaPhrase("TSUM_5","BEN")+'">'
	+ '<caption class="offscreen">'+getSeaPhrase("TCAP_4","BEN")+'</caption>'
	+ '<tr><th scope="col" class="plaintableheaderborder" style="text-align:center" nowrap>'+getSeaPhrase("PLAN","BEN")+'</th>'
	+ '<th scope="col" class="plaintableheaderborder" style="text-align:center" nowrap>'+getSeaPhrase("COVERAGE","BEN")+'</th>';
	if (rule_type != "A")
		head += '<th scope="col" class="plaintableheaderborder" style="text-align:center" nowrap>'+getSeaPhrase("START_DATE","BEN")+'</th>';
	if (flexflag == 1)
		head += '<th scope="col" class="plaintablecellbold" style="text-align:center" nowrap>'+getSeaPhrase("FLEX_CR","BEN")+'</th>';
	else
		head += '<th scope="col" class="plaintableheaderborder">&nbsp;</th>';
	// Add spacer column for display
	head += '<th scope="col" class="plaintableheaderborder" width="'+TableSpacer+'" nowrap>&nbsp;';
	if (empflag == 1)
		head += '<th scope="col" class="plaintableheaderborder" colspan="2" nowrap>'+getSeaPhrase("YOUR_COST","BEN")+'</th>';
	else
		head += '<th scope="col" class="plaintableheaderborder" colspan="2" nowrap>&nbsp;</th>';
	if (compflag == 1)
		head += '<th scope="col" class="plaintableheaderborderright" nowrap>'+getSeaPhrase("CO_COST","BEN")+'</th>';
	else
		head += '<th scope="col" class="plaintableheaderborder" width="0" nowrap>&nbsp;</th>';
	head += '</tr>'
	if (!justText) 
	{
		html += head;
		html += bod;
		html += '</table>';
		html += bod2;
	} 
	else 
	{
		alltext += head+'<br/>';
		alltext += bod+'</table>';
		alltext += bod2;
	}	
	resttext += '<br/>'+GetSummaryTable();
// MOD BY BILAL
	if (!printIt)
		//resttext += '<p>'+uiButton(getSeaPhrase("CLOSE","BEN"),"self.close();return false","margin-top:10px")+'</p>';
		resttext += '<p>'+uiButton(getSeaPhrase("CLOSE","BEN"),"self.close();return false","font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")+'</p>';
// END OF MOD
	if (!justText) 
	{
		html += resttext;
		html += '</div>';
		if (typeof(frm) == "string")
		{
			if (frm.toUpperCase() == "NEWWINDOW")	
			{
				electionsContent = html;
				electionsFrame = window.open("/lawson/xhrnet/ui/headerpane.htm?func=opener.writeElectionsContent()", "Display_Window",
					"toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=500");
				frm = electionsFrame;
				printIt = false;
				try { electionsFrame.focus(); } catch(e) {}
			} 
			else 
				frm = eval(frm);
		}	
		if (printIt) 
		{
			frm.document.body.innerHTML = html;
			var headerStr = "";
			if (event=="annual" || rule_type=="A") 
				headerStr = getSeaPhrase("ELECTIONS_AS_OF","BEN")+' '+newdate;
			else
				headerStr = getSeaPhrase("BEN_ELECT","BEN");
			setWinTitle(headerStr, frm);			
			frm.stylePage();
			frm.document.body.style.overflow = "visible";
			frm.focus();
			frm.print();
		}
		else if (electionsFrame == null) 
		{
			electionsFrame = frm;
			electionsContent = html;
			setTimeout('writeElectionsContent()', 1000);
		}
	} 
	else
		return (alltext + resttext);
}
function normalizeField(fldVal, fldLen)
{
	if (typeof(fldVal) != "undefined")
	{
		fldVal = fldVal.toString();
		for (var i=fldVal.length; i<fldLen; i++)
			fldVal += " ";
	}
	return fldVal;
}
function emailScr(wnd, error)
{
	wnd = wnd || window;
	var bError = (error) ? "Y" : "N";
	var bPayInfo = (emssObjInstance.emssObj.benPayInfo) ? "Y" : "N";
	
	if (emssObjInstance.emssObj.processFlowsEnabled && typeof(wnd["ProcessFlowObject"]) == "function")
	{
		setTimeout(function(){try{startProcessing(getSeaPhrase("SENDING_EMAIL","ESS"))}catch(e){}}, 50);
		var techVersion = (iosHandler && iosHandler.getIOSVersionNumber() >= "09.00.00") ? wnd.ProcessFlowObject.TECHNOLOGY_900 : wnd.ProcessFlowObject.TECHNOLOGY_803;	
		var httpRequest = (typeof(SSORequest) == "function") ? SSORequest : SEARequest;
		var pfObj = new wnd.ProcessFlowObject(wnd, techVersion, httpRequest, "EMSS");
		pfObj.showErrors = false;	
		if ((emssObjInstance.emssObj.emailAddressType.toString().toLowerCase() == "personal")
		&& (!appObj || appObj.getAppVersion() == null || appObj.getAppVersion().toString() < "10.00.00"))
		{
			emssObjInstance.emssObj.emailAddressType = "work";
		}
		var flowObj = pfObj.setFlow("EMSSBenSumChg", wnd.Workflow.SERVICE_EVENT_TYPE, wnd.Workflow.ERP_SYSTEM,
			authUser.prodline, authUser.webuser, null, "");
		flowObj.addVariable("company", String(authUser.company));
		flowObj.addVariable("employee", String(authUser.employee));
		flowObj.addVariable("immedUpdate", String(BenefitRules[7]));
		flowObj.addVariable("displayFlex", String(BenefitRules[8]));
		flowObj.addVariable("newDate", String(BenefitRules[2]));
		flowObj.addVariable("dateFmt", normalizeField(String(authUser.datefmt.toUpperCase()),8)+String(authUser.date_separator));
		flowObj.addVariable("costDivisor", String(BenefitRules[6]));
		flowObj.addVariable("ruleType", String(rule_type));
		flowObj.addVariable("famStatus", String(eventname));
		flowObj.addVariable("error", String(bError));
		flowObj.addVariable("payInfo", String(bPayInfo));
		flowObj.addVariable("emailFormat", String(emssObjInstance.emssObj.emailFormat)+","+String(emssObjInstance.emssObj.emailAddressType));
		pfObj.triggerFlow();
		setTimeout(function(){stopProcessing()}, 2000);
	}
}
var electionsFrame = null;
var electionsContent = "";
function writeElectionsContent()
{
	if (!electionsFrame)
		return;	
	electionsFrame.document.body.setAttribute("onresize", "fitToScreen();");
	//webkit browsers may not size the popup window right away, which is important for theme 9
	if (electionsFrame.opener)
	{
		var winObj = getWinSize(electionsFrame);
		var winWidth = winObj[0];	
		var winHeight = winObj[1];		
		if (winWidth > 700 || winHeight > 500)
		{
			setTimeout(function(){electionsFrame.resizeTo(700,500);electionsFrame.fitToScreen();writeElectionsContent();}, 50);
			return;
		}	
	}
	electionsFrame.document.body.style.visibility = "hidden";
	electionsFrame.document.getElementById("paneBody").innerHTML = electionsContent;
	var headerStr = "";
	if (event=="annual" || rule_type=="A") 
		headerStr = getSeaPhrase("ELECTIONS_AS_OF","BEN")+' '+newdate;
	else 
		headerStr = getSeaPhrase("BEN_ELECT","BEN");
	setWinTitle(headerStr, electionsFrame);
	electionsFrame.document.getElementById("paneHeader").innerHTML = headerStr;
	electionsFrame.stylePage();
	electionsFrame.fitToScreen();
	electionsFrame.document.body.style.visibility = "visible";
	electionsFrame = null;
	electionsContent = "";
}
// Employee flex record check for update
function CheckFlexPeriods(RuleType)
{
	var stopdate = ""
	var startdate = ""
	// Check current flex plans to stop for life events
	if (RuleType == "F" && CurrentFlexExist)
	{
		var LastDate = ""
		for (var j=1;j<CurrentBens.length;j++)
		{
			stopdate = ""
			if (CurrentBens[j][39]=="Y" && CurrentBens[j][0][0]!=2 &&
				CurrentBens[j][0][0]!=5)  //only stop plans that are changes or stops
			{
				if (CurrentBens[j][0][0]==3)
					stopdate=CurrentBens[j][0][3]
				if (CurrentBens[j][0][0]==4)
					stopdate=setStopDate(CurrentBens[j][0][2])
				if (CurrentBens[j][0][0]==1)
					stopdate=CurrentBens[j][0][3]
			}
			if (LastDate != "" && stopdate != "" && stopdate != LastDate)
			{
				BenefitRules[7] = "N"
				return
			}
			if (stopdate != "") LastDate = stopdate
		}
	}
	// Check new flex plans to add for life events and new hires
	if ((RuleType == "F" || RuleType == "N") && EligFlexExist)
	{
		// First, mark each newly elected plan that is flex
		for (var i=0;i<ElectedPlans.length;i++)
		{
			ElectedPlans[i].isflex = false
			var plan_type = ""
			var plan_code = ""
			if(parseInt(ElectedPlans[i][0],10)==1)
			{
				plan_type = ElectedPlans[i][2][11]
				plan_code = ElectedPlans[i][2][12]
			}
			else if((parseInt(ElectedPlans[i][0],10)>1 && parseInt(ElectedPlans[i][0],10)<6) || parseInt(ElectedPlans[i][0],10)==13)
			{
				plan_type = ElectedPlans[i][2][37]
				plan_code = ElectedPlans[i][2][38]
			}
			else if(parseInt(ElectedPlans[i][0],10)>5 && parseInt(ElectedPlans[i][0],10)<11)
			{
				plan_type = ElectedPlans[i][2][38]
				plan_code = ElectedPlans[i][2][39]
			}
			else if(parseInt(ElectedPlans[i][0],10)==12)
			{
				plan_type = ElectedPlans[i][2][1]
				plan_code = ElectedPlans[i][2][2]
			}
			else
				continue
			for (var k=1;k<EligPlans.length;k++)
			{
				if (EligPlans[k][1] == plan_type && EligPlans[k][2] == plan_code &&
					EligPlans[k][22] == "Y")
				{
					ElectedPlans[i].isflex = true
					break
				}
			}
		}
		var LastDate = ""
		for (var j=0;j<ElectedPlans.length;j++)
		{
			startdate = ""
			//only add plan if they did not choose to keep
			if (RuleType == "F" && ElectedPlans[j][4][0]!=2 && ElectedPlans[j][4][0]!=5) continue
			if (ElectedPlans[j].isflex)
				startdate=ElectedPlans[j][5]
			if (LastDate != "" && startdate != "" && startdate != LastDate)
			{
				BenefitRules[7] = "N"
				return
			}
			if (startdate != "") LastDate = startdate
		}
	}
	// Check EFR records for the employee
	if ((RuleType == "F" && CurrentFlexExist) ||
		((RuleType == "F" || RuleType == "N") && EligFlexExist))
		CheckEFRRecord(RuleType)
}
function CheckEFRRecord(RuleType)
{
	var obj 			= new DMEObject(prodline,"empflexrem")
		obj.out 		= "JAVASCRIPT"
		obj.index		= "efrset3"
		obj.field 		= "start-date;stop-date;plan-start-dt"
		obj.key 		= escape(company) + "=" + escape(employee)
		obj.func		= "ProcessEFR('"+RuleType+"')"
		obj.max			= "300"
		obj.sortasc		= "start-date"
		obj.debug 		= false
	DME(obj,"jsreturn")
}
function GetEFRRecs(EFRData)
{
	var Hash = new Array()
	for (var i=0;i<EFRData.length;i++)
		Hash[formjsDate(formatDME(EFRData[i].start_date))] = parseInt(formjsDate(formatDME(EFRData[i].stop_date)),10)
	Hash[""] = ""
	return Hash
}
function ProcessEFR(RuleType)
{
	var EFRHash = GetEFRRecs(self.jsreturn.record)
	var EFRList = self.jsreturn.record
	var stopdate = ""
	var startdate = ""
	if (RuleType == "F" && CurrentFlexExist)
	{
		for (var j=1;j<CurrentBens.length;j++)
		{
			stopdate = ""
			startdate = CurrentBens[j][3]
			if (CurrentBens[j][39]=="Y" && CurrentBens[j][0][0]!=2 &&
				CurrentBens[j][0][0]!=5)  //only stop plans that are changes or stops
			{
				if (CurrentBens[j][0][0]==3)
					stopdate=CurrentBens[j][0][3]
				if (CurrentBens[j][0][0]==4)
					stopdate=setStopDate(CurrentBens[j][0][2])
				if (CurrentBens[j][0][0]==1)
					stopdate=CurrentBens[j][0][3]
			}
			if (stopdate != "" && parseInt(stopdate,10) > EFRHash[startdate])
			{
				BenefitRules[7] = "N"
				return
			}
		}
	}
	if ((RuleType == "F" || RuleType == "N") && EligFlexExist)
	{
		for (var j=0;j<ElectedPlans.length;j++)
		{
			startdate = ""
			//only add plan if they did not choose to keep
			if (RuleType == "F" && ElectedPlans[j][4][0]!=2 && ElectedPlans[j][4][0]!=5) continue
			if (ElectedPlans[j].isflex)
				startdate=ElectedPlans[j][5]
			if (startdate != "" && isGtrPeriod(parseInt(startdate,10),EFRList))
			{
				BenefitRules[7] = "N"
				return
			}
		}
	}
}
function isGtrPeriod(date,efrlist)
{
	for (var i=efrlist.length-1;i>=0;i--)
	{
		if (parseInt(formjsDate(formatDME(efrlist[i].start_date)),10) >= date && efrlist[i].start_date != efrlist[i].plan_start_dt)
			return true
		else if (parseInt(formjsDate(formatDME(efrlist[i].start_date)),10) < date)
			return false
	}
	return false
}
// Limit of another benefit dependency functions
function GetDependencyPairs(L1, L2)
{
	var Pairs = new Array()
	var Remaining = new Array()
	var DependedUpon = new Array()
	// Construct the dependency pair list.
	// Input: List L1 of benefit plans, in order by dependency (meaning if plan b is dependent
	// on plan a, it follows a somewhere in the list).  A dependent plan in L1 stores the index
	// of the plan it is dependent upon; all other plans store their values as null.
	// Output: List Pairs of the form {(a1,b1) (a2,b2) ... (an,bn)}, where each bi plan
	// is dependent upon plan ai.  List L2 containing any remaining plans that are not dependent
	// upon another plan nor are depended upon.
	for (var i=0;i<L1.length;i++)
	{
		if (L1[i].dep_plan != null)
		{
			Remaining[i] = false
			DependedUpon[L1[i].dep_plan] = true
			Pairs[Pairs.length] = new Array(parseInt(L1[i].dep_plan,10),i)
		}
		else
			Remaining[i] = true
	}
	for (var i=0;i<L1.length;i++)
	{
		if (Remaining[i] && !DependedUpon[i])
			L2[L2.length] = L1[i]
	}
	// Sort the dependency pairs in list Pairs so that for every set of pairs Pj = (p0j,p1j) and
	// Pk = (p0k,p1k) in Pairs where j<k, we satisfy the property p0j<=p0k.  This is an ascending
	// sort by the first plan index value in each pair found in list Pairs.
	for (var i=0;i<Pairs.length;i++)
	{
		for (var j=Pairs.length-1;j>i;j--)
		{
			if (Pairs[j-1][0] > Pairs[j][0])
			{
				t = Pairs[j-1]
				Pairs[j-1] = Pairs[j]
				Pairs[j] = t
			}
		}
	}
	return Pairs
}
function MapDependencies(ElectedArray)
{
	for (var i=0;i<ElectedArray.length;i++)
	{
		ElectedArray[i].dep_plan = null
		ElectedArray[i].index = i
	}
	for (var i=0;i<ElectedArray.length;i++)
	{
		var plan_type = ""
		var plan_code = ""
		if(parseInt(ElectedArray[i][0],10)==1)
		{
			plan_type = ElectedArray[i][2][11]
			plan_code = ElectedArray[i][2][12]
		}
		else if((parseInt(ElectedArray[i][0],10)>1 && parseInt(ElectedArray[i][0],10)<6) || parseInt(ElectedArray[i][0],10)==13)
		{
			plan_type = ElectedArray[i][2][37]
			plan_code = ElectedArray[i][2][38]
		}
		else if(parseInt(ElectedArray[i][0],10)>5 && parseInt(ElectedArray[i][0],10)<11)
		{
			plan_type = ElectedArray[i][2][38]
			plan_code = ElectedArray[i][2][39]
		}
		else if(parseInt(ElectedArray[i][0],10)==12)
		{
			plan_type = ElectedArray[i][2][1]
			plan_code = ElectedArray[i][2][2]
		}
		else
			continue
		for (var j=ElectedArray.length-1;j>=0;j--)
		{
			if (j == i) break
			if (ElectedArray[j][2][6] == plan_type && ElectedArray[j][2][8] == plan_code)
				ElectedArray[j].dep_plan = i
		}
	}
}
function SplitDependencies(ElectedArray, RecsPerCall)
{
	var ListContainer = new Array() // The container for the list of final groupings for the plans.
	var LeftOver = new Array() // Array for storing any plans that are not dependent upon another plan.
	MapDependencies(ElectedArray) // Add a dep_plan attribute to each plan record that holds the index
				      // of the plan it is dependent upon; dep_plan is null otherwise.
	var ListPairs = GetDependencyPairs(ElectedArray,LeftOver) // Create a list of dependency pairs.
	if (ListPairs.length > 0)
	{
		// Split up the first dependency pair, creating two groups in our grouping container.
		ListContainer[0] = new Array()
		ListContainer[0][0] = ElectedArray[ListPairs[0][0]]
		ListContainer[1] = new Array()
		ListContainer[1][0] = ElectedArray[ListPairs[0][1]]
		// Next, go through every pair in the list and insert each plan into a non-conflicting
		// group in ListContainer.
		for (var k=1;k<ListPairs.length;k++)
			InsertInList(ElectedArray,ListPairs[k],ListContainer)
		// Sort the plans in each group by flex cost.  If there are any
		// remaining "non-dependent" plans, insert them according to flex cost.
		SortByFlex(ListContainer,LeftOver,RecsPerCall)
		// Finally, split up the groups into smaller groups, one per AGS call.
		BreakIntoAGSCalls(ListContainer,RecsPerCall)
	}
	else
	{
		Rest = new Array()
		ListContainer[0] = new Array()
		ListContainer[0] = ElectedArray
		SortByFlex(ListContainer,Rest,RecsPerCall)
		BreakIntoAGSCalls(ListContainer,RecsPerCall)
	}
	return ListContainer
}
function InsertInList(ElectedArray, Pair, GroupList)
{
	var INLIST = false
	var i = 0
	while (i < GroupList.length && !INLIST)
	{
		var j = 0
		while (j < GroupList[i].length && !INLIST)
		{
			if (Pair[0] == GroupList[i][j].index) // The plan which is dependent upon is already in a list.
			{
				INLIST = true
				// Put the dependent plan in the next group if it
				// exists, otherwise create it.
				if ((i+1) != GroupList.length)
					GroupList[i+1][GroupList[i+1].length] = ElectedArray[Pair[1]]
				else
				{
					GroupList[i+1] = new Array()
					GroupList[i+1][0] = ElectedArray[Pair[1]]
				}
			}
			j++
		}
		i++
	}
	// If the plan that is dependent upon is not already in a list, insert it
	// into the first group, and place the dependent plan in the second group.
	if (!INLIST)
	{
		GroupList[0][GroupList[0].length] = ElectedArray[Pair[0]]
		GroupList[1][GroupList[1].length] = ElectedArray[Pair[1]]
	}
}
function BreakIntoAGSCalls(GroupList, RecsPerCall)
{
	var NewGroupList = new Array()
	for (var i=0;i<GroupList.length;i++)
	{
		if (GroupList[i].length > RecsPerCall)
		{
			var k=0
			while (k < GroupList[i].length)
			{
				var limit = (GroupList[i].length<(k+RecsPerCall))?GroupList[i].length:(k+RecsPerCall)
				var len = NewGroupList.length
				NewGroupList[len] = new Array()
				var l=0
				for (var j=k;j<limit;j++)
				{
					NewGroupList[len][l] = GroupList[i][j]
					l++
				}
				k += RecsPerCall
			}
		}
		else
			NewGroupList[NewGroupList.length] = GroupList[i]
	}
	for (var i=0;i<NewGroupList.length;i++)
		GroupList[i] = NewGroupList[i]
}
function SortByFlex(GroupList, Remaining, RecsPerCall)
{
	// First, sort each group list by flex cost.
	for (var i=0;i<GroupList.length;i++)
		sortElectedArray(GroupList[i],true)
	if (Remaining.length > 0)
	{
		// Next, sort the remaining plans by flex cost.
		sortElectedArray(Remaining,true)
		// Finally, insert the remaining plans into the group lists.
		InsertRemaining(GroupList,Remaining,RecsPerCall)
	}
}
function InsertRemaining(GroupList, Remaining, RecsPerCall)
{
	var ALLNEG = true
	var CHECKEDFLEX = false
	for (var i=0;i<Remaining.length;i++)
	{
		var INSERTED = false
		var RFlex = getFlexValues(Remaining[i])
		if (RFlex.ycost < 0 || RFlex.fcost != 0) // if negative flex, insert onto front of an early group
		{
			var j=0
			while (j < GroupList.length && !INSERTED)
			{
				if (GroupList[j].length%RecsPerCall != 0) // add to a group that won't create a new ags call
				{
					for (var k=GroupList[j].length;k>0;k--)
						GroupList[j][k] = GroupList[j][k-1]
					GroupList[j][0] = Remaining[i]
					INSERTED = true
				}
				j++
			}
		}
		else // if positive flex, insert onto back of a later group
		{
			var j=GroupList.length-1
			var INSERTED = false
			while (j >= 0 && !INSERTED)
			{
				if (GroupList[j].length%RecsPerCall != 0) // add to a group that won't create a new ags call
				{
					GroupList[j][GroupList[j].length] = Remaining[i]
					INSERTED = true
				}
				j--
			}
		}
		if (!INSERTED) // if no group has room, create a new ags group
		{
			// if we haven't added any new ags group yet, check to see if we should
			// add that new group at the beginning or end of our existing call list.
			// If any positive flex remains, the group should be added at the end.
			if (ALLNEG && !CHECKEDFLEX)
			{
				CHECKEDFLEX = true
				for (var x=i;x<Remaining.length;x++)
				{
					var rflex = getFlexValues(Remaining[x])
					if (!(rflex.ycost < 0 || rflex.fcost != 0))
					{
						ALLNEG = false
						break
					}
				}
			}
			if (ALLNEG)
			{
				// create it at the beginning
				for (var k=GroupList.length;k>0;k--)
					GroupList[k] = GroupList[k-1]
				GroupList[0][0] = Remaining[i]
			}
			else
			{
				// create it at the end
				GroupList[GroupList.length] = new Array()
				GroupList[GroupList.length-1][0] = Remaining[i]
			}
		}
	}
}
function displayTaxable(taxable)
{
	var result = ""
	if(taxable.charAt(0)=="P")
		result = getSeaPhrase("PRE_TAX","BEN")
	else if(taxable.charAt(0)=="A")
		result = getSeaPhrase("AFTER_TAX","BEN")
	else if(taxable.charAt(0)=="B")
		result = getSeaPhrase("BOTH","BEN")
	return result;
}
// *** for testing/debugging limit of another benefit ags lists
function DspLists(L)
{
	var str = ""
	for (var i=0;i<L.length;i++)
	{
		str += "("
		for (var j=0;j<L[i].length;j++)
		{
			str += L[i][j].index
			if (j<L[i].length-1) str += ","
		}
		str += ")\n"
	}
	alert(str)
}
function dividesEvenly(numerator, denominator)
{
	numerator = numerator.toString(); 		// the top number in the fraction
	denominator = denominator.toString(); 	// the bottom number in the fraction
	var mult1 = 0; // minimum number of places to move the decimal forward for the numerator
	var mult2 = 0; // minimum number of places to move the decimal forward for the denominator
	var mult3 = 0; // maximum of mult1 and mult2 -- this is the common multiplier
	var dec1 = numerator.indexOf(".");		// where is the decimal in the numerator?
	var dec2 = denominator.indexOf(".");	// where is the decimal in the denominator?
	if (dec1 == -1)
		dec1 = numerator.length;
	if (dec2 == -1)
		dec2 = denominator.length;
	// Determine the minimum number of places to move the decimal forward in the numerator
	// in order to remove the fraction part of the number.
	if (dec1 != -1)
		mult1 = numerator.length - dec1 - 1;
	// Determine the minimum number of places to move the decimal forward in the denominator
	// in order to remove the fraction part of the number.
	if (dec2 != -1)
		mult2 = denominator.length - dec2 - 1;
	// Compute the maximum number of decimal places to move for both numbers.
	if (mult1 > mult2)
		mult3 = mult1;
	else
		mult3 = mult2;
	// Rather than performing multiplication by a power of 10, which can introduce more
	// rounding errors, move the decimal forward by doing string manipulation so that
	// both the numerator and denominator are multiplied by the common multiplier,
	// effectively multiplying the fraction by 1, but, importantly, converting both
	// numbers to integers.
	if (mult3 > 0)
	{
		// move the decimal forward in the numerator
		var nbr = numerator.substring(0,dec1);
		var decimal = numerator.substring(dec1+1,numerator.length);
		for (var i=decimal.length; i<mult3; i++)
			decimal += "0";
		decimal = decimal.substring(0,mult3);
		numerator = nbr + decimal;
		// move the decimal forward in the denominator
		nbr = denominator.substring(0,dec2);
		decimal = denominator.substring(dec2+1,denominator.length);
		for (var i=decimal.length; i<mult3; i++)
			decimal += "0";
		decimal = decimal.substring(0,mult3);
		denominator = nbr + decimal;
	}
	// Perform a mod operation to determine whether the numbers divide evenly.
	return ((Number(numerator) % Number(denominator)) == 0);
}
