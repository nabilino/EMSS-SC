
function PA46Object()
{
	this.Requisition 		= '';
	this.ActTotExp 			= '0';
	this.VarTotExp 			= '0';
	this.ActTotHrs 			= '0';
	this.BudTotHrs 			= '0';
	this.VarTotHrs 			= '0';
	this.OTHrs 			= '0';
	this.WorkedHrs 			= '0';
	this.OTHrsPct 			= '0';
	this.ActionOIPct		= '0';

	this.Add = function(CallBack)
	{
		self.lawheader.UpdateType = "PA46";
		var pAGSObj   		= new AGSObject(authUser.prodline, "PA46.1")
		pAGSObj.event		= "ADD"
		pAGSObj.rtn	 		= "DATA"
		pAGSObj.lfn			= "ALL";
		pAGSObj.longNames	= true
		pAGSObj.tds			= false
		pAGSObj.field	 	= "FC=A"
			+ "&PJR-COMPANY="		+ Number(authUser.company)
			+ "&PJR-REQUISITION="	+ ParseAGSValue(this.Requisition)
			+ "&LINE-FCr0=A" 
                	+ "&PAC-SEQ-NBRr0=1" 
                	+ "&PAC-CMT-TEXTr0=Actual Total Expenses     "+PA46.ActTotExp
			+ "&LINE-FCr1=A" 
                	+ "&PAC-SEQ-NBRr1=2" 
                	+ "&PAC-CMT-TEXTr1=Budgeted Total Expenses   "+PA46.BudTotExp
			+ "&LINE-FCr2=A" 
                	+ "&PAC-SEQ-NBRr2=3" 
                	+ "&PAC-CMT-TEXTr2=Variance Total Expenses   "+PA46.VarTotExp
			+ "&LINE-FCr3=A" 
                	+ "&PAC-SEQ-NBRr3=4" 
                	+ "&PAC-CMT-TEXTr3=Actual Total Hours        "+PA46.ActTotHrs
			+ "&LINE-FCr4=A" 
                	+ "&PAC-SEQ-NBRr4=5" 
                	+ "&PAC-CMT-TEXTr4=Budgeted Total Hours      "+PA46.BudTotHrs
			+ "&LINE-FCr5=A"   
                	+ "&PAC-SEQ-NBRr5=6" 
                	+ "&PAC-CMT-TEXTr5=Variance Total Hours      "+PA46.VarTotHrs
			+ "&LINE-FCr6=A" 
                	+ "&PAC-SEQ-NBRr6=7" 
                	+ "&PAC-CMT-TEXTr6=OT Hours                  "+PA46.OTHrs
			+ "&LINE-FCr7=A" 
                	+ "&PAC-SEQ-NBRr7=8" 
                	+ "&PAC-CMT-TEXTr7=Worked Hours              "+PA46.WorkedHrs
			+ "&LINE-FCr8=A" 
                	+ "&PAC-SEQ-NBRr8=9" 
                	+ "&PAC-CMT-TEXTr8=% OT Hours of Worked      "+PA46.OTHrsPct
			+ "&LINE-FCr9=A" 
                	+ "&PAC-SEQ-NBRr9=10" 
                	+ "&PAC-CMT-TEXTr9=Action OI Benchmark Percentile   "+PA46.ActionOIPct;
	
		pAGSObj.func	= "parent."+CallBack+"()";
		pAGSObj.debug	= false;
		AGS(pAGSObj, "jsreturn")
	}
}


