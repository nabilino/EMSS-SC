// Version: 8-)@(#)@10.00.02.00.35
// $Header: /cvs/cvs_archive/applications/webtier/shr/src/xbnnet/le_updatedb.js,v 1.12.2.16.2.1 2013/01/14 17:26:45 brentd Exp $
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
function le_updateImmediate()
{
	if(updatetype=="ERR")
	{
		if(lastFunc=="le_updateImmediate")
		{
			updatetype="UPD"
			var numCalls=(count<=1)?0:Math.floor((count-1)/20)
			count=(numCalls*20)+1
			senttoPending=false
			le_updatePending()
		}
		else
			finishupdate()
	}
	else
	{
		//alert("le_updateImmediate -- bs32.1")
		lastFunc="le_updateImmediate"
		cnt3=1	
		if(count==0) count=1
		if(typeof(parent.CurrentBens[count])!="undefined")
		{
			var obj = new AGSObject(parent.prodline,"BS32.1")
				obj.debug=false
				obj.event="ADD"
				obj.rtn="MESSAGE"
				obj.longNames=true
				obj.tds=false
				obj.field="FC=C"
			  	+ "&BEN-COMPANY="+escape(parent.company)
			  	+ "&BEN-EMPLOYEE="+escape(parent.employee)
				obj.func="parent.le_addbensImmediate(0)"
			if(parent.CurrentBens[count]!=null)
			{
				for(var k=1;k<21;k++)
				{
					if(parent.CurrentBens[count]!=null && parent.CurrentBens[count][0]!=null)
					{
						//do not put a stop date on an ineligible plan that already has a stop date
						//an ineligible plan without a stop date will get stopped as of the life event date
						var eligible = false;
						for (var x=1; x<parent.EligPlans.length; x++) 
						{
							if (parent.CurrentBens[count][1] == parent.EligPlans[x][1] && parent.CurrentBens[count][2] == parent.EligPlans[x][2])
							{
								eligible = true;
								break;
							}
						}
						var ineligibleAndStopped = (!eligible && parent.CurrentBens[count][15] && NonSpace(parent.CurrentBens[count][15]) > 0);
						if(!ineligibleAndStopped && parent.CurrentBens[count][0][0]!=2 && parent.CurrentBens[count][0][0]!=5)  //only stop plans that are changes or stops
						{							
							if(parent.CurrentBens[count][0][0]==3)
								stopdate=parent.setStopDate(parent.CurrentBens[count][0][3])
							if(parent.CurrentBens[count][0][0]==4)
								stopdate=parent.setStopDate(parent.CurrentBens[count][0][2])
							if(parent.CurrentBens[count][0][0]==1)
								stopdate=parent.setStopDate(parent.CurrentBens[count][0][3])
						
							if(parent.CurrentBens[count][15]==null || parent.CurrentBens[count][15]=='' || parseFloat(parent.CurrentBens[count][15])>parseFloat(parent.BenefitRules[2]))
							{
								obj.field+= "&LINE-FC"+cnt3+"=S"
								+ "&BEN-PLAN-TYPE"+cnt3+"="+escape(parent.CurrentBens[count][1],1).toString().replace("+","%2B")
								+ "&BEN-PLAN-CODE"+cnt3+"="+escape(parent.CurrentBens[count][2],1).toString().replace("+","%2B")
								+ "&BEN-START-DATE"+cnt3+"="+escape(parent.CurrentBens[count][3])
								+ "&BEN-STOP-DATE"+cnt3+"="+stopdate
								+ "&BEN-USER-ID"+cnt3+"=W"+escape(parent.employee)
								+ "&BNT-CREATE-TRANS"+cnt3+"="+escape(parent.CurrentBens[count][41])
								if (parent.CurrentBens[count][41]=="Y" || parent.CurrentBens[count][41]=="P")
								{
									obj.field+= "&BNT-REASON"+cnt3+"="+escape(parent.CurrentBens[count][42],1)
									+ "&BNT-MEMBER-ID"+cnt3+"="+escape(parent.CurrentBens[count][43],1)
								}
								cnt3++
							}
						}
					}
					count++
				}
			}
			obj.dtlField = "LINE-FC;BEN-PLAN-TYPE;BEN-PLAN-CODE;BEN-START-DATE;BEN-STOP-DATE;BEN-USER-ID;BNT-CREATE-TRANS;"
			+"BNT-REASON;BNT-MEMBER-ID";
			if(cnt3>1)
			{			
				if(parent.CurrentBens[count]!=null)
		  			obj.func="parent.le_updateImmediate()"
				else
					count=0				
				updatetype = "UPD"
				AGS(obj,"bnreturn")
			}
			else if(parent.CurrentBens[count]!=null)
			{
				le_updateImmediate()
			}			
			else
			{
				count=0 //PT112327
				le_addbensImmediate(0)
			}
		}
		else
		{
			count=0
			le_addbensImmediate(0)
		}
	}
}	
//add bens for all plans in elected plans array
function le_addbensImmediate(callno)
{
	if(updatetype=="ERR")
	{
		if(senttoPending)
		{
			var numCalls=(count==0)?0:Math.floor((count-1)/5)
			count=(numCalls*5)
			finishupdate()
			return
		}	
		if(lastFunc=="le_updateImmediate")
		{
			updatetype="UPD"
			senttoPending=false
			var numCalls=(count<=1)?0:Math.floor((count-1)/20)
			count=(numCalls*20)+1
			le_updatePending()	
		}
		else if(lastFunc=="le_addbensImmediate")
		{
			updatetype="UPD"
			senttoPending=false
			count=0
			planstoPend = BN31ErrPlans(count1)
			addbensPending() // le_addbensPending()
		}
		else
			finishupdate()
	}
	else
	{
		lastFunc = "le_addbensImmediate"
		if(bn31Plans[callno]!=null)
		{	
			//alert("le_addbensImmediate -- bn31.1")
			var obj = new AGSObject(parent.prodline,"BN31.1")
			obj.event="ADD"
			obj.debug=false
			obj.rtn="MESSAGE"
			obj.longNames=true
			obj.tds=false
			obj.field="FC=A"
				+ "&BEN-COMPANY="+escape(parent.company)
			obj.func="parent.finishupdate()"
			var callit=false
			for(var k=0;k<bn31Plans[callno].length;k++)
			{
				if(bn31Plans[callno][k]!=null)
				{
					if(bn31Plans[callno][k][4][0]!=2 && bn31Plans[callno][k][4][0]!=5) //only add plan if they did not choose to keep
					{ 
						callit=true
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
							+ "&BNT-MEMBER-ID"+(k+1)+"="+arr[35]
						}
						planUpdated[String(arr[4])+String(arr[5])] = true	
					}		
					count1=callno
				}
			}
			// by-pass salary override warning
			obj.field+="&SAL-OVER-XMIT=1"
			obj.dtlField = "BEN-EMPLOYEE;BEN-PLAN-TYPE;BEN-PLAN-CODE;BEN-COV-OPTION;BEN-MULTIPLE;"
			+"BEN-COVER-AMT;BEN-PAY-RATE;BEN-PCT-AMT-FLAG;BEN-START-DATE;PRE-CONT-TAX-STS;BEN-SMOKER;"
			+"BEN-PEND-EVIDENCE;BEN-EMP-PRE-CONT;BEN-EMP-AFT-CONT;BEN-STOP-DATE;BEN-USER-ID;BNT-CREATE-TRANS;"
			+"BNT-REASON;BNT-MEMBER-ID"	
			if((callno+1)<bn31Plans.length)
			{
				if(!callit)
				{
					le_addbensImmediate(callno+1)
					return
				}
				obj.func="parent.le_addbensImmediate("+(callno+1)+")"
			}
			else if(!callit)
			{
				finishupdate()
				return
			}
			updatetype="UPD"
			AGS(obj,"bnreturn")
		}
	}
}
//stop all plans in current array -- if action=="add", add the records instead
function le_updatePending(action)
{
	if(updatetype=="ERR")
	{
		if(senttoPending)
		{
			var numCalls=(count==0)?0:Math.floor((count-1)/5)
			count=(numCalls*5)
			senttoPending=false
			finishupdate()
			return
		}	
		else if(lastFunc=="le_updateImmediate")
		{
			updatetype="UPD"
			var numCalls=(count<=1)?0:Math.floor((count-1)/20)
			count=(numCalls*20)+1
			senttoPending=false
			le_updatePending()	
		}
		else
			finishupdate()
	}
	else
	{
		//alert("le_updatePending -- bs31.1")
		cnt3=1
		if (count==0) count=1
		if(parent.CurrentBens[count]!=null)
		{
			var obj = new AGSObject(parent.prodline,"BS31.1")
			obj.debug=false
			obj.event="ADD"
			obj.rtn="MESSAGE"
			obj.longNames=true
			obj.tds=false
			obj.field="FC=A"
				+ "&BNB-COMPANY="+escape(parent.company)
				+ "&BNB-EMPLOYEE="+escape(parent.employee)
			if(lastFunc=="le_updateImmediate")
				obj.func="parent.le_addbensImmediate(0)"
			else
				obj.func="parent.le_addbensPending()"
			if(parent.CurrentBens[count]!=null)
			{
				for(var k=1;k<6;k++)
				{
					if(parent.CurrentBens[count]!=null && parent.CurrentBens[count][0]!=null)
					{
						//do not put a stop date on an ineligible plan that already has a stop date
						//an ineligible plan without a stop date will get stopped as of the life event date
						var ineligibleAndStopped = false;
						if (!action || action != "add")
						{	
							var eligible = false;
							for (var x=1; x<parent.EligPlans.length; x++) 
							{
								if (parent.CurrentBens[count][1] == parent.EligPlans[x][1] && parent.CurrentBens[count][2] == parent.EligPlans[x][2])
								{
									eligible = true;
									break;
								}
							}
							ineligibleAndStopped = (!eligible && parent.CurrentBens[count][15] && NonSpace(parent.CurrentBens[count][15]) > 0);
						}
						if(!ineligibleAndStopped && parent.CurrentBens[count][0][0]!=2 && parent.CurrentBens[count][0][0]!=5)  //only stop plans that are changes or stops
						{
							var payRate = "";
							if ((parseInt(parent.CurrentBens[count][22], 10) == 8 || parseInt(parent.CurrentBens[count][22], 10) == 9)
							&& parent.CurrentBens[count][27])
							{
								payRate = parent.CurrentBens[count][27];
							}						
							if(action && action=="add")
								stopdate=""
							else
							{	
								if(parent.CurrentBens[count][0][0]==3)
									stopdate=parent.setStopDate(parent.CurrentBens[count][0][3])
								if(parent.CurrentBens[count][0][0]==4)
									stopdate=parent.setStopDate(parent.CurrentBens[count][0][2])
								if(parent.CurrentBens[count][0][0]==1)
									stopdate=parent.setStopDate(parent.CurrentBens[count][0][3])
							}		
							obj.field+='&LINE-FC'+cnt3+"=A"
							if (action && action=="add")
								obj.field+='&BNB-FNCTION'+cnt3+'=A'
							else	
								obj.field+='&BNB-FNCTION'+cnt3+'=C'	
							obj.field+='&BNB-ENROLL-DATE'+cnt3+'='
								+'&BNB-PLAN-TYPE'+cnt3+'='+escape(parent.CurrentBens[count][1],1).toString().replace("+","%2B")
								+'&BNB-PLAN-CODE'+cnt3+'='+escape(parent.CurrentBens[count][2],1).toString().replace("+","%2B")
								+'&BNB-START-DATE'+cnt3+'='+escape(parent.CurrentBens[count][3])	
								+'&BNB-STOP-DATE'+cnt3+'='+stopdate
								+'&BNB-COVER-OPT'+cnt3+'='
								+'&BNB-MULT-SALARY'+cnt3+'='
								+'&BNB-COVER-AMT'+cnt3+'='	
								+'&BNB-PAY-RATE'+cnt3+'='+payRate	
								+'&BNB-PCT-AMT-FLAG'+cnt3+'='
								+'&BNB-PRE-AFT-FLAG'+cnt3+'='	
								+'&BNB-SMOKER-FLAG'+cnt3+'='	
								+'&BNB-EMP-PRE-CONT'+cnt3+'='	
								+'&BNB-EMP-AFT-CONT'+cnt3+'='	
								+'&BNB-PEND-EVIDENCE'+cnt3+'='	
								+'&BNB-YTD-CONT'+cnt3+'='		
								+'&BNB-RECORD-TYPE'+cnt3+'='
								+'&BNB-PLAN-GROUP'+cnt3+'='+escape(parent.CurrentBens[count][32])
								+'&BNB-COP-COV-DESC'+cnt3+'='	
								+'&BNB-DEP-COVER-AMT'+cnt3+'='
								+'&BNB-COV-PCT'+cnt3+'='		
								+'&BNB-FLEX-COST'+cnt3+'='	
								+'&BNB-EMP-COST'+cnt3+'='	
								+'&BNB-COMP-COST'+cnt3+'='	
								+'&BNB-UPDATE-DATE'+cnt3+'='+escape(parent.ymdtoday)	
								+'&BNB-ALPHADATA1'+cnt3+'='	
								+'&BNB-NUMERIC1'+cnt3+'='	
								+'&BNB-DATE1'+cnt3+'='
								+"&BNB-PLAN-DESC"+cnt3+"="+escape(parent.CurrentBens[count][5])
								+'&BNB-USER-ID'+cnt3+'=W'+escape(parent.employee)
								+'&BNB-CREATE-TRANS'+cnt3+'='+escape(parent.CurrentBens[count][41])
								if (parent.CurrentBens[count][41]=="Y" || parent.CurrentBens[count][41]=="P")
								{
									obj.field+='&BNB-TRAN-REASON'+cnt3+'='+escape(parent.CurrentBens[count][42],1)
									+ '&BNB-MEMBER-ID'+cnt3+'='+escape(parent.CurrentBens[count][43],1)
								}
								if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "08.01.01")
								{
									obj.field+="&BNB-BN-TYPE"+cnt3+"=2"; // Life Event benefit type
								}								
							cnt3++
							planUpdated[String(parent.CurrentBens[count][1])+String(parent.CurrentBens[count][2])] = true
						}
					}
					count++
				}
			}
			if(cnt3>1)
			{
				if(parent.CurrentBens[count]!=null)
				{
					if(action && action=="add")
						obj.func="parent.le_updatePending('add')"
					else
						obj.func="parent.le_updatePending()"
				}
				else
					count=0
				senttoPending=true
				updatetype = "UPD"
				AGS(obj,"bnreturn")
			}
			else if(parent.CurrentBens[count]!=null)
			{
				if(action && action=="add")
					le_updatePending('add')
				else
					le_updatePending()
			}	
			else
			{
				count=0 //PT112327
				le_addbensPending()
			}
		}
		else
		{
			count=0 //PT112327
			le_addbensPending()
		}
	}
}
//add all bens in elected plans array
function le_addbensPending()
{
	if(updatetype=="ERR")
	{
		if(senttoPending)
		{
			var numCalls=(count==0)?0:Math.floor((count-1)/5)
			count=(numCalls*5)	
			senttoPending=false
			finishupdate()
			return
		}	
		else if(lastFunc=="le_addbensImmediate")
		{
			updatetype="UPD"
			var numCalls=(count==0)?0:Math.floor((count-1)/5)
			count=(numCalls*5)
			le_addbensPending()	
		}
		else
			finishupdate()
	}
	else
	{
		//alert("le_addbensPending -- bs31.1")
		cnt3=1
		if (count==1) count=0
		if(parent.ElectedPlans[count]!=null)
		{
			var obj = new AGSObject(parent.prodline,"BS31.1")
			obj.debug=false
			obj.event="ADD"
			obj.rtn="MESSAGE"
			obj.longNames=true
			obj.tds=false
			obj.field="FC=A"
				+ "&BNB-COMPANY="+escape(parent.company)
				+ "&BNB-EMPLOYEE="+escape(parent.employee)	
			obj.func="parent.finishupdate()"
			for(var k=1;k<6;k++)
			{
				if(parent.ElectedPlans[count]!=null)
				{
					if(parent.ElectedPlans[count][4][0]!=2 && parent.ElectedPlans[count][4][0]!=5) //only add plan if they did not choose to keep
					{
						var arr = new Array()
						arr=FormatPlan(count)
						if(parent.ElectedPlans[count][4][0]==4)
							stopdate=parent.ElectedPlans[count][4][2]
						if(parent.ElectedPlans[count][4][0]==1)
							stopdate=parent.ElectedPlans[count][4][1]
						obj.field+='&LINE-FC'+cnt3+"=A"
							+'&BNB-FNCTION'+cnt3+'=A'
							+'&BNB-COMPANY'+cnt3+'='	+(arr[1])
							+'&BNB-ENROLL-DATE'+cnt3+'='	+(arr[2])
							+'&BNB-EMPLOYEE'+cnt3+'='	+(arr[3])
							+'&BNB-PLAN-TYPE'+cnt3+'='	+(arr[4])
							+'&BNB-PLAN-CODE'+cnt3+'='	+(arr[5])
							+'&BNB-COVER-OPT'+cnt3+'='	+(arr[6])
							+'&BNB-MULT-SALARY'+cnt3+'='	+(arr[7])
							+'&BNB-COVER-AMT'+cnt3+'='	+(arr[8])
							+'&BNB-PAY-RATE'+cnt3+'='	+(arr[9])
							+'&BNB-PCT-AMT-FLAG'+cnt3+'='	+(arr[10])
							+'&BNB-START-DATE'+cnt3+'='	+(stopdate)
							+'&BNB-PRE-AFT-FLAG'+cnt3+'='	+(arr[12])
							+'&BNB-SMOKER-FLAG'+cnt3+'='	+(arr[13])
							+'&BNB-EMP-PRE-CONT'+cnt3+'='	+(arr[14])
							+'&BNB-EMP-AFT-CONT'+cnt3+'='	+(arr[15])
							+'&BNB-STOP-DATE'+cnt3+'='	+(arr[16])
							+'&BNB-PEND-EVIDENCE'+cnt3+'='	+(arr[17])
							+'&BNB-YTD-CONT'+cnt3+'='	+(arr[18])
							+'&BNB-RECORD-TYPE'+cnt3+'='	+(arr[19])
							+'&BNB-PLAN-GROUP'+cnt3+'='	+(arr[20])
							+'&BNB-COP-COV-DESC'+cnt3+'='	+(arr[21])
							+'&BNB-DEP-COVER-AMT'+cnt3+'='	+(arr[22])
							+'&BNB-COV-PCT'+cnt3+'='	+(arr[23])
							+'&BNB-FLEX-COST'+cnt3+'='	+(arr[24])
							+'&BNB-EMP-COST'+cnt3+'='	+(arr[25])
							+'&BNB-COMP-COST'+cnt3+'='	+(arr[26])
							+'&BNB-UPDATE-DATE'+cnt3+'='	+(arr[27])
							+'&BNB-ALPHADATA1'+cnt3+'='	+(arr[28])
							+'&BNB-NUMERIC1'+cnt3+'='	+(arr[29])
							+'&BNB-DATE1'+cnt3+'='		+(arr[30])
							+"&BNB-PLAN-DESC"+cnt3+"="	+(arr[31])
							+'&BNB-USER-ID'+cnt3+'=W'+arr[3]
							+'&BNB-CREATE-TRANS'+cnt3+'='	+(arr[33])
						if (arr[33]=="Y" || arr[33]=="P")
						{
							obj.field+='&BNB-TRAN-REASON'+cnt3+'='+arr[34]
							+ '&BNB-MEMBER-ID'+cnt3+'='+arr[35]
						}
						if (appObj && appObj.getAppVersion() != null && appObj.getAppVersion().toString() >= "08.01.01")
						{
							obj.field+="&BNB-BN-TYPE"+cnt3+"=2"; // Life Event benefit type
						}						
						cnt3++	
						planUpdated[String(arr[4])+String(arr[5])]=true
					}
					count++
				}
			}
		}
		if(cnt3>1)
		{			
			if(parent.ElectedPlans[count]!=null)
				obj.func="parent.le_addbensPending()"
			else 		
				count=0
			senttoPending=true
			updatetype = "UPD"
			AGS(obj,"bnreturn")
		}	
		else if(parent.ElectedPlans[count]!=null)
		{
			le_addbensPending()
		}
		else
			finishupdate()	
	}
}

