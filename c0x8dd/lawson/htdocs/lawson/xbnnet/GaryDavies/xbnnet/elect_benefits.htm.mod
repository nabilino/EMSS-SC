<html>
<head>
<link rel="stylesheet" type="text/css" id="default" title="default" href="/lawson/xhrnet/ui/default.css"/>
<link rel="alternate stylesheet" type="text/css" id="ui" title="classic" href="/lawson/xhrnet/ui/ui.css"/>
<link rel="alternate stylesheet" type="text/css" id="uiLDS" title="lds" href="/lawson/webappjs/lds/css/ldsEMSS.css"/>
<script src="/lawson/webappjs/commonHTTP.js"></script>
<script src="/lawson/xhrnet/xml/xmlcommon.js"></script>
<script src="/lawson/webappjs/transaction.js"></script>
<script type="text/javascript" src="/lawson/xhrnet/ui/ui.js"></script>
<script>
var _Processed = true
var flexflag=0
var empflag=0
var compflag=0
var REC_TYPE=parent.EligPlans[parent.CurrentEligPlan][6]
parent.choice=0
parent.SelectedPlan=new Array()
parent.EMP_CONT_TYPE=''
function setdata(fc)
{
	stylePage();
	if (parent.rule_type == "F")
		parent.parent.showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"))
	else
		parent.showWaitAlert(getSeaPhrase("PROCESSING_WAIT","ESS"))
	if(REC_TYPE+"".length<2)
		REC_TYPE="0"+REC_TYPE
	if(REC_TYPE=="01") 
	{
		parent.lawheader.count=0
		updatetype = "CRT"
		parent.updatetype="CRT"
		var object1 = new AGSObject(parent.prodline, "BS13.1")
		object1.event="ADD"
		object1.rtn="DATA"
		object1.debug = false
		object1.longNames=true
		object1.tds=false
		object1.field="FC=I"
			+ "&COP-COMPANY=" + escape(parent.company)
			+ "&EMP-EMPLOYEE=" + escape(parent.employee)
			+ "&COP-PLAN-TYPE=" + escape(parent.EligPlans[parent.CurrentEligPlan][1],1).toString().replace("+","%2B")
			+ "&COP-PLAN-CODE=" + escape(parent.EligPlans[parent.CurrentEligPlan][2],1).toString().replace("+","%2B")
		if(parent.rule_type=="N")
			object1.field+="&BAE-NEW-DATE=" + escape(parent.EligPlans[parent.CurrentEligPlan][5])
		else
		 	object1.field+="&BAE-NEW-DATE=" + escape(parent.BenefitRules[2])
		object1.field += "&BAE-COST-DIVISOR=" + escape(parent.BenefitRules[6])
			+ "&BAE-RULE-TYPE=" + parent.rule_type
			+ "&BFS-FAMILY-STATUS=" + escape(parent.eventname.toUpperCase())
		object1.func="parent.getdep()"
		AGS(object1,"js1")
	}
	if(REC_TYPE=="02" || REC_TYPE=="03" || REC_TYPE=="04" || REC_TYPE=="05" || REC_TYPE=="13") 
	{
		parent.lawheader.count=0
		updatetype = "CRT2"
		parent.updatetype="CRT2"
		var object1 = new AGSObject(parent.prodline, "BS14.1")
		object1.event="ADD"
		object1.rtn="DATA"
		object1.longNames=true
		object1.tds=false
		object1.debug = false
		object1.field="FC=I"
			+ "&CVR-COMPANY=" + escape(parent.company)
			+ "&EMP-EMPLOYEE=" + escape(parent.employee)
			+ "&CVR-PLAN-TYPE=" + escape(parent.EligPlans[parent.CurrentEligPlan][1],1).toString().replace("+","%2B")
			+ "&CVR-PLAN-CODE=" + escape(parent.EligPlans[parent.CurrentEligPlan][2],1).toString().replace("+","%2B")
		if(parent.rule_type=="N")
		  	object1.field+="&BAE-NEW-DATE=" + escape((parent.EligPlans[parent.CurrentEligPlan][5]))
		else
		  	object1.field+= "&BAE-NEW-DATE=" + escape(parent.BenefitRules[2])
		object1.field += "&BAE-COST-DIVISOR=" + escape(parent.BenefitRules[6])
			+ "&BAE-RULE-TYPE=" + parent.rule_type
			+ "&BFS-FAMILY-STATUS=" + escape(parent.eventname.toUpperCase())
		object1.func="parent.getdep()"
		AGS(object1,"js1")
	}
	if(REC_TYPE=="06" || REC_TYPE=="07" || REC_TYPE=="08" || REC_TYPE=="09" || REC_TYPE=="10") 
	{
		parent.lawheader.count=0
		updatetype = "CRT3"
		parent.updatetype="CRT3"
		var object1 = new AGSObject(parent.prodline, "BS15.1")
	 	object1.event="ADD"
		object1.rtn="DATA"
		object1.longNames=true
		object1.debug = false
		object1.tds=false
		object1.field="FC=I"
			+ "&PRE-COMPANY=" + escape(parent.company)
			+ "&EMP-EMPLOYEE=" + escape(parent.employee)
			+ "&PRE-PLAN-TYPE=" + escape(parent.EligPlans[parent.CurrentEligPlan][1],1).toString().replace("+","%2B")
			+ "&PRE-PLAN-CODE=" + escape(parent.EligPlans[parent.CurrentEligPlan][2],1).toString().replace("+","%2B")
		if(parent.rule_type=="N")
		  	object1.field+="&BAE-NEW-DATE=" + escape((parent.EligPlans[parent.CurrentEligPlan][5]))
		else if(parent.rule_type=="F")
		{
			if(parent.actiontaken==1)
				object1.field += "&BAE-NEW-DATE=" + escape(parent.EligPlans[parent.CurrentEligPlan][11])
			else if(parent.actiontaken==2 || parent.actiontaken==4 || parent.actiontaken==5)
				object1.field += "&BAE-NEW-DATE=" + escape(parent.EligPlans[parent.CurrentEligPlan][13])
			else if(parent.actiontaken==3)
				object1.field += "&BAE-NEW-DATE=" + escape(parent.EligPlans[parent.CurrentEligPlan][15])
			else	
				object1.field += "&BAE-NEW-DATE=" + escape(parent.BenefitRules[2])
		}
		else
		  	object1.field+= "&BAE-NEW-DATE=" + escape(parent.BenefitRules[2])
		object1.field += "&BAE-COST-DIVISOR=" + escape(parent.BenefitRules[6])
			+ "&BAE-RULE-TYPE=" + parent.rule_type
			+ "&BFS-FAMILY-STATUS=" + escape(parent.eventname.toUpperCase())
		object1.func="parent.getdep()"
		AGS(object1,"js1")
	}
	if(REC_TYPE=="12") 
	{
		parent.coveredDeps=new Array()
		parent.updatetype="CRT3"
		parent.msgNbr=99
		parent.SelectedPlan=new Array()
		parent.SelectedPlan[0]=12
		parent.SelectedPlan[1]=parent.EligPlans[parent.CurrentEligPlan][1]
		parent.SelectedPlan[2]=parent.EligPlans[parent.CurrentEligPlan][2]
		parent.document.getElementById("main").src = parent.baseurl+"bensconfirm.htm"
	}
}
function getdep()
{
	parent.coveredDeps=new Array()
	goform()
}
function goform()
{
	if(_Processed) 
	{
		_Processed = false;
		if(REC_TYPE=="01")
			self.document.getElementById("elect").src = "/lawson/xbnnet/elect_ben_01.htm"
		if(REC_TYPE=="02")
			self.document.getElementById("elect").src = "/lawson/xbnnet/elect_ben_02.htm"
		if(REC_TYPE=="03" || REC_TYPE=="13")
			self.document.getElementById("elect").src = "/lawson/xbnnet/elect_ben_03.htm"
		if(REC_TYPE=="04")
			self.document.getElementById("elect").src = "/lawson/xbnnet/elect_ben_04.htm"
		if(REC_TYPE=="05")
			self.document.getElementById("elect").src = "/lawson/xbnnet/elect_ben_05.htm"
		if(REC_TYPE=="06")
			self.document.getElementById("elect").src = "/lawson/xbnnet/elect_ben_06.htm"
		if(REC_TYPE=="07")
			self.document.getElementById("elect").src = "/lawson/xbnnet/elect_ben_07.htm"
		if(REC_TYPE=="08")
			self.document.getElementById("elect").src = "/lawson/xbnnet/elect_ben_08.htm"
		if(REC_TYPE=="09")
			self.document.getElementById("elect").src = "/lawson/xbnnet/elect_ben_09.htm"
		if(REC_TYPE=="10")
			self.document.getElementById("elect").src = "/lawson/xbnnet/elect_ben_10.htm"
		if(REC_TYPE=="12")
			self.document.getElementById("elect").src = "/lawson/xbnnet/elect_ben_12.htm"
	}
}
function header(addlStr)
{
	var nme = parent.removespace(parent.EligPlans[parent.CurrentEligPlan][1]+parent.EligPlans[parent.CurrentEligPlan][2])
	var html = '<table class="plaintableborder" border="0" cellpadding="0" cellspacing="0">'
	html += '<tr>'
	html += '<td class="plaintablecellborder" style="padding-top:5px">'
	html += getSeaPhrase("CONBEN_2","BEN")+' '
// MOD BY BILAL 
	html += '<font color=red><b>' + parent.EligPlans[parent.CurrentEligPlan][4] + '</b></font>' + ' '
// END OF MOD	
	html += '<a href="" onclick="javascript:var winRef=(typeof(parent.parent.openWinDesc2)==\'function\')?parent.parent:parent.parent.parent;winRef.openWinDesc2(\''+parent.EligPlans[parent.CurrentEligPlan][1]+'\',\''+parent.EligPlans[parent.CurrentEligPlan][2]+'\');return false">'
// MOD BY BILAL 
//	html += parent.EligPlans[parent.CurrentEligPlan][4]
	html += 'View Description'
// END OF MOD
	html += '</a>.'
	html += ((addlStr)?' '+addlStr:'')
	html += '</td>'
	html += '</tr>'
	html += '</table>'
	html += '<br>'
	return html;
}
function planMessages(precont,defaul)
{
	var msgStr = "";
	if((parent.updatetype=="CRT2" && !isNaN(parseFloat(parent.SelectedPlan[18])) && parseFloat(parent.SelectedPlan[18])>0)
	|| (parent.updatetype=="CRT3" && !isNaN(parseFloat(parent.SelectedPlan[16])) && parseFloat(parent.SelectedPlan[16])>0)
	|| (parent.updatetype=="CRT")) 
	{
		if(precont=="P" || precont=="N" || precont=="A") 
		{
			if((parent.updatetype=="CRT" && (flexflag!=0 || empflag!=0 || compflag!=0)) || parent.updatetype!="CRT") 
			{
				if(precont=="P")
					msgStr += getSeaPhrase("ELECTBEN_3","BEN")+'<br>'
				if(precont=="A")
					msgStr += getSeaPhrase("ELECTBEN_4","BEN")+'<br>'
			}
			if(precont=="N")
				msgStr += getSeaPhrase("ELECTBEN_7","BEN")+'<br>'
		}
	} 
	else
		msgStr += getSeaPhrase("ELECTBEN_7","BEN")+'<br>'
	if(REC_TYPE!="08" && REC_TYPE!="09" && REC_TYPE!="06") 
	{
		if(flexflag!=0 || empflag!=0 || compflag!=0)
			msgStr += parent.costdivisor
	}
	return msgStr;
}
function footer(precont,defaul)
{
	var html = '<div class="plaintablecell">'
	if((parent.updatetype=="CRT2" && !isNaN(parseFloat(parent.SelectedPlan[18])) && parseFloat(parent.SelectedPlan[18])>0)
	|| (parent.updatetype=="CRT3" && !isNaN(parseFloat(parent.SelectedPlan[16])) && parseFloat(parent.SelectedPlan[16])>0)
	|| (parent.updatetype=="CRT")) 
	{
// MOD BY BILAL - Prior Customizations
	html+='<center>'
// JRZ 1/27/09 Adding note that new coverage options for 2009 always cover self
// CLYNCH 2/14/2012 - Modify to not display coverage options text for Child Supp Life
		if (parent.EligPlans[parent.CurrentEligPlan][8]!="CHILD SUPP LIFE") {
			html+='<p style="color:#ff0000;font-weight:bold">Please note: All coverage options provide Self coverage, too</p>'
		}
// ~CLYNCH
//~JRZ
// END OF MOD
		if(precont=="P" || precont=="N" || precont=="A") 
		{
			if((parent.updatetype="CRT" && (flexflag!=0 || empflag!=0 || compflag!=0)) || parent.updatetype!="CRT") 
			{
				if(precont=="P")
					parent.setpreaft_flag("P")
				if(precont=="A")
					parent.setpreaft_flag("A")
			}
			if(precont=="N")
				parent.setpreaft_flag("")
		} 
		else if(precont!=null && precont!='' && typeof(precont)!='undefined') 
		{
			html += '<form name=preaft>'
			if(defaul=="P")	
			{
				parent.setpreaft_flag("P")
				html += getSeaPhrase("ELECTBEN_6","BEN")+' '
				//PT 135291. Changed invalid reference to setpreaft_flag function.
				html += '<INPUT class="inputbox" TYPE=radio name=preaft value=pre onClick=parent.parent.setpreaft_flag("P") CHECKED><span class="plaintablecell">'+getSeaPhrase("PRE_TAX","BEN")+'</span>'
				html += '<INPUT class="inputbox" TYPE=radio name=preaft value=aft onClick=parent.parent.setpreaft_flag("A")><span class="plaintablecell">'+getSeaPhrase("AFTER_TAX","BEN")+'</span>'
			} 
			else if(defaul=="A") 
			{
				parent.setpreaft_flag("A")
				html += getSeaPhrase("ELECTBEN_6","BEN")+' '
				html += '<INPUT class="inputbox" TYPE=radio name=preaft value=pre onClick=parent.parent.setpreaft_flag("P")><span class="plaintablecell">'+getSeaPhrase("PRE_TAX","BEN")+'</span>'
				html += '<INPUT class="inputbox" TYPE=radio name=preaft value=aft onClick=parent.parent.setpreaft_flag("A") CHECKED><span class="plaintablecell">'+getSeaPhrase("AFTER_TAX","BEN")+'</span>'
			} 
			else 
			{
				parent.setpreaft_flag("")
				html += getSeaPhrase("ELECTBEN_6","BEN")+' '
				html += '<INPUT class="inputbox" TYPE=radio name=preaft value=pre onClick=parent.parent.setpreaft_flag("P")><span class="plaintablecell">'+getSeaPhrase("PRE_TAX","BEN")+'</span>'
				html += '<INPUT class="inputbox" TYPE=radio name=preaft value=aft onClick=parent.parent.setpreaft_flag("A")><span class="plaintablecell">'+getSeaPhrase("AFTER_TAX","BEN")+'</span>'
			}
			html += '</form>'
		}
	} 
	else
		parent.setpreaft_flag("")
// MOD BY BILAL  - Prior Customizations
// JRZ Modify Cost for Air St. Lukes to say per year
        var currentCode = escape(parent.EligPlans[parent.CurrentEligPlan][2],1);
        if(REC_TYPE!="08" && REC_TYPE!="09" && REC_TYPE!="06")
        {
            if(flexflag!=0 || empflag!=0 || compflag!=0) 
            {
	                if(parent.parent.SLRMC.isASL(parent.company,currentCode)) 
	                {
			               html+='<BR><BR>Costs are per year, taken as a one time paycheck deduction.';
					}
//					else 
//					{
//					       html+='<BR><BR>'+parent.costdivisor
//			        }
            }
        }
//~JRZ
// END OF MOD
	html += '<br>'
// MOD BY BILAL - Styling the Buttons as per St. Luke's
//	html += uiButton(getSeaPhrase("CONTINUE","BEN"), "parent.setBenefit('"+precont+"');return false","margin-top:10px")
	html += uiButton(getSeaPhrase("CONTINUE","BEN"), "parent.setBenefit('"+precont+"');return false","font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")
	if(parent.LastDoc[parent.currentdoc]!=null)
//		html += uiButton(getSeaPhrase("PREVIOUS","BEN"), "parent.previousTask();return false","margin-top:10px")
		html += "&nbsp;&nbsp;" + uiButton(getSeaPhrase("PREVIOUS","BEN"), "parent.previousTask();return false","font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")
//	html += uiButton(getSeaPhrase("EXIT","BEN"), "parent.parent.quitEnroll(parent.location);return false","margin-top:10px")
	html += "&nbsp;&nbsp;" + uiButton(getSeaPhrase("EXIT","BEN"), "parent.parent.quitEnroll(parent.location);return false","font-size:14px;font-weight:bold;color:#FFFFFF;width:100;background-color:#6699cc;margin-top:10px")
// JRZ Elect Benefits wording, appears after selecting a plan code and clicking continue
    if(REC_TYPE=="01" || REC_TYPE=="03") 
    {
        // elements will be searched for at the beginning of the plan code
    	var matchDependent = parent.parent.SLRMC.isDependentElectPlan(parent.company,currentCode);
        // JRZ Adding EPO requirements reminder for EPO plan
	      if(parent.parent.SLRMC.isEPOPlan(parent.company,currentCode))
	           html+= parent.parent.SLRMC.EPOReminder(parent.parent.rule_type);

        // JRZ Adding dependent reminder
	      if(matchDependent)
			    html+=parent.parent.SLRMC.DependentReminder(parent.parent.rule_type)

        // JRZ Adding in Dual discount information
            if(parent.parent.SLRMC.isDualDiscountPlan(parent.company,currentCode))
		        html+=parent.parent.SLRMC.DualDiscountReminder();

        // JRZ Adding in ASL reminder
             if(parent.parent.SLRMC.isASL(parent.company,currentCode))
		         html+=parent.parent.SLRMC.ASLReminder(parent.parent.rule_type);

    }

       if(parent.parent.SLRMC.isMonthlyDeductionPlan(parent.company,currentCode))
	             html+='<p>Deductions are taken once per month rather than every pay period.  However, the above deduction is a per pay period amount.<br>Your monthly deduction for child supp life coverage will be:<br>&nbsp;&nbsp;&nbsp;$0.30 per month for $5,000 of coverage<br>&nbsp;&nbsp;&nbsp;$0.61 per month for $10,000 of coverage</p>'
        //~JRZ
	html+='</center>'
// END OF MOD
	html += '</div>'
	return html;
}
function setBenefit(precont,continueFlag)
{
	parent.cantEnroll=new Array()
	parent.notAvailable=new Array()
	if(REC_TYPE!="01" && typeof(self.elect.document.forms['preaft'])!='undefined' &&
	self.elect.document.forms["preaft"].preaft[0].checked==false &&
	self.elect.document.forms["preaft"].preaft[1].checked==false)
		parent.seaAlert(getSeaPhrase("ERROR_91","BEN"))
	else if((REC_TYPE=="01" || REC_TYPE=="03" || REC_TYPE=="13") && parent.choice==0 &&
	(continueFlag || (!precont || (precont && precont!="N"))))
		parent.seaAlert(getSeaPhrase("ERROR_92","BEN"))
	else if(REC_TYPE=="01" && parent.SelectedPlan[parent.choice][16]+''=="B" &&
	parent.EligPlans[parent.CurrentEligPlan][18]=="Y" && (parent.spouseExists==false &&
	parent.depsExist==false))
		parent.seaAlert(getSeaPhrase("ERROR_101","BEN"))
	else if(REC_TYPE=="01" && parent.SelectedPlan[parent.choice][16]+''=="S" &&
	parent.EligPlans[parent.CurrentEligPlan][18]=="Y" && parent.spouseExists==false)
		parent.seaAlert(getSeaPhrase("ERROR_102","BEN"))
	else if(REC_TYPE=="01" && parent.SelectedPlan[parent.choice][16]+''=="D" &&
	parent.EligPlans[parent.CurrentEligPlan][18]=="Y" && parent.depsExist==false)
		parent.seaAlert(getSeaPhrase("ERROR_103","BEN"))
	else if((REC_TYPE=="02" || REC_TYPE=="03" || REC_TYPE=="04" || REC_TYPE=="05" || REC_TYPE=="13") &&
	parent.SelectedPlan[4]+''=="S" && parent.EligPlans[parent.CurrentEligPlan][18]=="Y" &&
	parent.spouseExists==false)
		parent.seaAlert(getSeaPhrase("ERROR_104","BEN"))
	else if((REC_TYPE=="02" || REC_TYPE=="03" || REC_TYPE=="04" || REC_TYPE=="05" || REC_TYPE=="13") &&
	parent.SelectedPlan[4]+''=="D" && parent.EligPlans[parent.CurrentEligPlan][18]=="Y" &&
	parent.depsExist==false)
		parent.seaAlert(getSeaPhrase("ERROR_105","BEN"))
	else if((REC_TYPE=="02" || REC_TYPE=="03" || REC_TYPE=="04" || REC_TYPE=="05" || REC_TYPE=="13") &&
	parent.SelectedPlan[4]+''=="B" && parent.EligPlans[parent.CurrentEligPlan][18]=="Y" &&
	(parent.depsExist==false && parent.spouseExists==false))
		parent.seaAlert(getSeaPhrase("ERROR_106","BEN"))
	else 
	{
		if(REC_TYPE=="01" || REC_TYPE=="03" || REC_TYPE=="13") 
		{
			if(REC_TYPE=="01") 
			{
				if(!isNaN(parseFloat(parent.SelectedPlan[parent.choice][5]))) 
				{
					if(typeof(self.elect.document.forms['preaft'])!='undefined' && self.elect.document.forms["preaft"].preaft[0].checked==false && self.elect.document.forms["preaft"].preaft[1].checked==false) 
					{
						parent.seaAlert(getSeaPhrase("ERROR_91","BEN"))
						return
					}
				} 
				else
					parent.setpreaft_flag("")
			}
			parent.msgNbr=1
			parent.currentdoc++
			if(parent.currentdoc<parent.LastDoc.length) 
			{
				var ArrayTemp = parent.LastDoc
				parent.LastDoc = new Array(0);
				for(var i=0; i<=parent.currentdoc+1;i++)
					parent.LastDoc[i] = ArrayTemp[i];
			}
			parent.LastDoc[parent.currentdoc]=parent.baseurl+"elect_benefits.htm"
			if(REC_TYPE=="01" && parent.SelectedPlan[parent.choice][16]+''!="N" && parent.SelectedPlan[parent.choice][16]+''!="E" && parent.EligPlans[parent.CurrentEligPlan][18]=="Y" && parent.dependents.length>0)
				parent.document.getElementById("main").src = parent.baseurl+"depscr.htm"
			else if(REC_TYPE!="01" && parent.SelectedPlan[55]+''=="Y" && parent.dependents.length>0)
				parent.document.getElementById("main").src = parent.baseurl+"depscr.htm"
			else
				parent.document.getElementById("main").src = parent.baseurl+"bensconfirm.htm"
		} 
		else 
		{
			parent.msgNbr=1
			parent.currentdoc++
			if(parent.currentdoc<parent.LastDoc.length) 
			{
				var ArrayTemp = parent.LastDoc
				parent.LastDoc = new Array(0);
				for(var i=0; i<=parent.currentdoc+1;i++)
					parent.LastDoc[i] = ArrayTemp[i];
			}
			parent.LastDoc[parent.currentdoc]=parent.baseurl+"elect_benefits.htm"
			if(parent.SelectedPlan[55]+''=="Y" && (parseFloat(REC_TYPE)<6 || parseFloat(REC_TYPE)==13) && parent.dependents.length>0) //&& parent.SelectedPlan[4]+''!="E" && parseFloat(REC_TYPE)<6 && parent.EligPlans[parent.CurrentEligPlan][18]=="Y" && parent.dependents.length>0)
				parent.document.getElementById("main").src = parent.baseurl+"depscr.htm"
			else
 				parent.document.getElementById("main").src = parent.baseurl+"bensconfirm.htm"
		}
	}
}
function previousTask()
{
	parent.document.getElementById("main").src = parent.LastDoc[parent.currentdoc];
	parent.currentdoc--;
}
function Choice(num,doc,max)
{
 	parent.choice=num
}
function fitToScreen()
{
	if (typeof(window["styler"]) == "undefined" || window.styler == null)
		window.stylerWnd = findStyler(true);
	if (!window.stylerWnd)
		return;
	if (typeof(window.stylerWnd["StylerEMSS"]) == "function")
		window.styler = new window.stylerWnd.StylerEMSS();
	else
		window.styler = window.stylerWnd.styler;
	var electFrame = document.getElementById("elect");
	var winHeight = 464;
	var winWidth = 721;
	// resize the table frame to the screen dimensions
	if (document.body.clientHeight)
	{
		winHeight = document.body.clientHeight;
		winWidth = document.body.clientWidth;
	}
	else if (window.innerHeight)
	{
		winHeight = window.innerHeight;
		winWidth = window.innerWidth;
	}
	// disable the onresize window event if it exists - we don't want the elements in the frame to resize themselves
	if (self.elect.onresize && self.elect.onresize.toString().indexOf("setLayerSizes") >= 0)
		self.elect.onresize = null;
	electFrame.style.width = (winWidth - 10) + "px";
	electFrame.style.height = (winHeight - 25) + "px";
	var fullContentWidth = (window.styler && window.styler.showLDS) ? (winWidth - 17) : ((navigator.appName.indexOf("Microsoft") >= 0) ? (winWidth - 12) : (winWidth - 12));
	var fullPaneContentWidth = (window.styler && window.styler.showLDS) ? fullContentWidth - 15 : fullContentWidth - 5;
	try
	{
		if (fullContentWidth > 0)
			self.elect.document.getElementById("paneBorder").style.width = fullContentWidth + "px";
		if (winHeight >= 35)
			self.elect.document.getElementById("paneBorder").style.height = (winHeight - 35) + "px";
		if (fullPaneContentWidth >= 5)
		{
			self.elect.document.getElementById("paneBodyBorder").style.width = fullPaneContentWidth + "px";
			self.elect.document.getElementById("paneBody").style.width = (fullPaneContentWidth - 5) + "px";
		}
		if (winHeight >= 55)
		{
			self.elect.document.getElementById("paneBodyBorder").style.height = (winHeight - 55) + "px";
			self.elect.document.getElementById("paneBody").style.height = (winHeight - 60) + "px";
		}
		if (fullContentWidth >= 15)
			self.elect.document.getElementById("paneHeader").style.width = (fullContentWidth - 15) + "px";
	}
	catch(e) {}
}
</script>
</head>
<body style="overflow:hidden" onload="setdata('I');fitToScreen()" onresize="fitToScreen()">
	<iframe id="elect" name="elect" src="/lawson/xhrnet/ui/headerpane.htm" style="visibility:visible;position:absolute;top:0px;left:0px;width:721px;height:464px" marginwidth="0" marginheight="0" frameborder="no" scrolling="no"></iframe>
	<iframe name="js1" src="/lawson/xhrnet/dot.htm" style="visibility:hidden;height:0px;width:0px;"></iframe>
	<iframe name="lawheader" src="/lawson/xbnnet/besslawheader.htm" style="visibility:hidden;height:0px;width:0px;"></iframe>
</body>
</html>
<!-- Version: 8-)@(#)@(201111) 09.00.01.06.09 -->
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/elect_benefits.htm,v 1.26.2.25.4.1 2012/03/21 06:38:23 juanms Exp $ -->
