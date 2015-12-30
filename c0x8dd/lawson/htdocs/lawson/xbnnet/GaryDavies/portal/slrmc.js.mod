function Slrmc() {

	// Data structures represent the only plans that will be shown in the specific plan groups

  // *PlanGroups structures are the same:

  //    associative array with key being plan groups that contain arrays of all visible plans

  

  // specific plans for PILB

  this.ElectPILBPlan = "PILB";

  this.DeclinePILBPlan = "PILD";

  

  this.PlanDescriptionFolder = "2011";

  

	this.PILBPlanGroups = new Array();

	this.PILBPlanGroups["MEDICAL"] = new Array(); this.PILBPlanGroups["MEDICAL"][0] = "WHLT";

	this.PILBPlanGroups["DENTAL"] = new Array(); this.PILBPlanGroups["DENTAL"][0] = "WDNT";

	this.PILBPlanGroups["VISION"] = new Array(); this.PILBPlanGroups["VISION"][0] = "WVIS";

	this.PILBPlanGroups["EMPLOYEE SUPP LIFE"] = new Array(); this.PILBPlanGroups["EMPLOYEE SUPP LIFE"][0] = "WLSU";

	this.PILBPlanGroups["CHILD SUPP LIFE"] = new Array(); this.PILBPlanGroups["CHILD SUPP LIFE"][0] = "WLCH";

	this.PILBPlanGroups["SPOUSE SUPP LIFE"] = new Array(); this.PILBPlanGroups["SPOUSE SUPP LIFE"][0] = "WLSP";

  this.PILBPlanGroups["EMPLOYEE SUPP ADD"] = new Array(); this.PILBPlanGroups["EMPLOYEE SUPP ADD"][0] = "WADS";

  this.PILBPlanGroups["FAMILY SUPP ADD"] = new Array(); this.PILBPlanGroups["FAMILY SUPP ADD"][0] = "WADF";

  //this.PILBPlanGroups["PTO SELLBACK OCTOBER"] = new Array(); this.PILBPlanGroups["PTO SELLBACK OCTOBER"][0] = "WF09";

  //this.PILBPlanGroups["PTO SELLBACK APRIL"] = new Array(); this.PILBPlanGroups["PTO SELLBACK APRIL"][0] = "WS10";


// MOD BY LARRY TAYLOR
	this.PILBPlanGroups["HEALTH SAVINGS ACCT"] = new Array(); this.PILBPlanGroups["HEALTH SAVINGS ACCT"][0] = "WHS1";
	this.PILBPlanGroups["FLEX SPEND MEDICAL"] = new Array(); this.PILBPlanGroups["FLEX SPEND MEDICAL"][0] = "WFSM";
	this.PILBPlanGroups["FLEX SPEND LIMITED"] = new Array(); this.PILBPlanGroups["FLEX SPEND LIMITED"][0] = "WFLP";
// END OF MOD



  // specific plans for Tobacco Declaration

  // CGL 1/12/2011 - Removing tobacco specific medical plans

  //this.ElectTobaccoPlan = "TOBA";

  //this.DeclineTobaccoPlan = "TOBN";

  

  //this.TobaccoPlanGroup = new Array();

  //this.TobaccoPlanGroup["MEDICAL"] = new Array();

  //this.TobaccoPlanGroup["MEDICAL"].push("HLTA"); // Catastrophic

  //this.TobaccoPlanGroup["MEDICAL"].push("HLTC"); // Choice

  //this.TobaccoPlanGroup["MEDICAL"].push("HLTE"); // EPO

  //this.TobaccoPlanGroup["MEDICAL"].push("WHLT"); // Waive

  

  //this.NonTobaccoPlanGroup = new Array();

  //this.NonTobaccoPlanGroup["MEDICAL"] = new Array();

  //this.NonTobaccoPlanGroup["MEDICAL"].push("HLCA"); // Catastrophic

  //this.NonTobaccoPlanGroup["MEDICAL"].push("HLCH"); // Choice

  //this.NonTobaccoPlanGroup["MEDICAL"].push("HLPP"); // EPO

  //this.NonTobaccoPlanGroup["MEDICAL"].push("WHLT"); // Waive  

  // ~CGL

}



// **** START LIVE ELECTION LOGIC ****

// This section contains code added to allow enrollment customization

// based on prior elections DURING the election flow



Slrmc.prototype.electedPILB=function(company,electedPlans) {

	// To be compatible with differen plan ordering, search through all entries in ElectedPlans

  // going through in reverse, because new plans are tacked onto the end

  // previous years plans are still in the ElectedPlans array for some reason, so will only use first found

	for(var e=electedPlans.length-1;e>=0;e--) {

		if(typeof(electedPlans[e]) != "undefined" && typeof(electedPlans[e][2]) != "undefined") {

      // only want to look at first (latest) instance of a the plan

      if(electedPlans[e][2][2] == this.ElectPILBPlan) {

        return 1;

      }

      else if(electedPlans[e][2][2] == this.DeclinePILBPlan) {

        return 0;

      }

		}

	}

  return 0; // should never reach here

}



// CGL 1/12/2011 - Removing tobacco plan processing

//Slrmc.prototype.electedTobaccoUse=function(company,electedPlans) {

	// To be compatible with differen plan ordering, search through all entries in ElectedPlans

  // going through in reverse, because new plans are tacked onto the end

  // previous years plans are still in the ElectedPlans array for some reason, so will only use first found

//	for(var e=electedPlans.length-1;e>=0;e--) {

//		if(typeof(electedPlans[e]) != "undefined" && typeof(electedPlans[e][2]) != "undefined") {

      // only want to look at first (latest) instance of a the plan

//      if(electedPlans[e][2][2] == this.ElectTobaccoPlan) {

//        return 1;

//      }

//      else if(electedPlans[e][2][2] == this.DeclineTobaccoPlan) {

//        return 0;

//      }

//		}

//	}

//  return 0; // should never reach here

//}



// if plan is to be shown for specific plan group given the visible structure, return 1, else return 0

Slrmc.prototype.isPlanVisibleForGroup=function(company,plangroup,plancode,visibleStructure) {

  // check if plangroup exists in structure, if not, plan is visible

  if(typeof(visibleStructure[plangroup]) == 'undefined') {

    return 1;

  }

  // see if plan is to be shown

  for(var p in visibleStructure[plangroup]) {

    if(plancode == visibleStructure[plangroup][p]) {

      return 1;

    }

  }

  // plan is not to be shown

  return 0;

}



// determine if a plan should be displayed using various criteria based on prior elections in the flow

Slrmc.prototype.isPlanVisible=function(company,plangroup,planname,electedPlans) {

  // if elected PILB, and in a qualifying plan group, only show specific plan

  if(this.electedPILB(company,electedPlans)) {

    if(this.isPILBPlanGroup(company,plangroup)) {

      if(this.isPlanVisibleForGroup(company,plangroup,planname,this.PILBPlanGroups)) {

        return 1;

      }

      else {

        return 0;

      }

    }

  }

  

  // if elected Tobacco Usage, and in a qualifying plan group, only show specific plan

  // CGL 1/12/2011 - Removing tobacco plans

  //if(this.electedTobaccoUse(company,electedPlans)) {

  //  if(this.isTobaccoPlanGroup(company,plangroup)) {

  //    if(this.isPlanVisibleForGroup(company,plangroup,planname,this.TobaccoPlanGroup)) {

  //      return 1;

  //    }

  //    else {

  //      return 0;

  //    }

  //  }

  //}

  // ~CGL

  

  // if didn't elect Tobacco Usage, and in a qualifying plan group, only show specific plan

  // CGL 1/12/2011 - Removing tobacco plans

  //if(!this.electedTobaccoUse(company,electedPlans)) {

  //  if(this.isNonTobaccoPlanGroup(company,plangroup)) {

  //    if(this.isPlanVisibleForGroup(company,plangroup,planname,this.NonTobaccoPlanGroup)) {

  //      return 1;

  //    }

  //    else {

  //      return 0;

  //    }

  //  }

  //}

  

  return 1;

}



// is the current benefit plan group one affected by electing PILB during enrollment

Slrmc.prototype.isPILBPlanGroup=function(company,plangroup) {

  return (typeof(this.PILBPlanGroups[plangroup]) != 'undefined');

}



// is the current benefit plan group one affected by electing Tobacco Use during enrollment

// CGL 1/12/2011 - Removing tobacco plans

//Slrmc.prototype.isTobaccoPlanGroup=function(company,plangroup) {

//  return (typeof(this.TobaccoPlanGroup[plangroup]) != 'undefined');

//}

// ~CGL



// is the current benefit plan group one affected by electing No Tobacco Use during enrollment

// CGL 1/12/2011 - Removing tobacco plans

//Slrmc.prototype.isNonTobaccoPlanGroup=function(company,plangroup) {

//  return (typeof(this.NonTobaccoPlanGroup[plangroup]) != 'undefined');

//}

// ~CGL



// **** END LIVE ELECTION LOGIC ****



// Is the plan an EPO plan?

// CGL 1/13/2011 - This function used for displaying EPO reminder text. All med plans now have same requirements. Using existing EPO code to display for all med plans.

Slrmc.prototype.isEPOPlan=function(company,plancode) {

  return (plancode == "HLPP" || plancode == "HLCH" || plancode == "HLCA");

}

// ~CGL



// Wording to print out about EPO

Slrmc.prototype.EPOReminder=function(ruletype) {

  var wording = "";

  if(ruletype=="N") {
		wording += '<P><B>Important:  </B> In order to qualify for any of the Heathy U credits, you must complete the Healthy U assessment within 30 days of your date of hire.<br>Please note: You should have completed this during your pre-employment physical.</P>';
		wording += '<P>For more information, please refer to <A HREF="http://inside.slrmc.org/healthyu/" TARGET="_blank">Inside St. Luke’s Healthy U page</A>.</P>';
  }

	else {

		wording += '<P><B>Important:  </B> Enroll in St. Luke\'s HealthyU for an opportunity to earn health plan premium reductions for both you and your covered spouse by completing two annual requirements between February 3rd and February 28, 2014 at 5:00pm MST.</P>';
		wording += '<P><b>Complete First: Know Your Numbers (KYN) Screening</b><br>The KYN Screening consists of biometric measures such as blood pressure, height, weight, body mass index (BMI), waist circumference, nicotine screening and fasting blood glucose. Employees with diabetes will need to provide an A1c lab result after September 1, 2013.</p>';
        wording += '<UL>';

// MOD BY BILAL
                  wording += '<LI><b>KYN Screening Schedule:</b><br/>';
                  wording += '<a href="/lawson/xbnnet/plandescriptions/HealthScreeningScheduleEL.pdf" target="_new">Elmore</a><br/>';
                  wording += '<a href="/lawson/xbnnet/plandescriptions/HealthScreeningScheduleJR.pdf" target="_new">Jerome</a><br/>';
                  wording += '<a href="/lawson/xbnnet/plandescriptions/HealthScreeningScheduleMV.pdf" target="_new">Magic Valley</a><br/>';
                  wording += '<a href="/lawson/xbnnet/plandescriptions/HealthScreeningScheduleMC.pdf" target="_new">McCall</a><br/>';
                  wording += '<a href="/lawson/xbnnet/plandescriptions/HealthScreeningScheduleTV.pdf" target="_new">Treasure Valley</a><br/>';
                  wording += '<a href="/lawson/xbnnet/plandescriptions/HealthScreeningScheduleWR.pdf" target="_new">Wood River</a><br/>';

//                  wording += '<a href="/lawson/xbnnet/plandescriptions/' + this.PlanDescriptionFolder + '/HealthScreeningScheduleTV.pdf" target="_new">Treasure Valley</a><br/>';
//                  wording += '<a href="/lawson/xbnnet/plandescriptions/' + this.PlanDescriptionFolder + '/HealthScreeningScheduleMV.pdf" target="_new">Magic Valley</a><br/>';
//                  wording += '<a href="/lawson/xbnnet/plandescriptions/' + this.PlanDescriptionFolder + '/HealthScreeningScheduleWR.pdf" target="_new">Wood River</a><br/>';
//                  wording += '<a href="/lawson/xbnnet/plandescriptions/' + this.PlanDescriptionFolder + '/HealthScreeningScheduleMC.pdf" target="_new">McCall</a><br/>';
// END OF MOD

            wording += '</LI><br>';
            wording += '<LI>Click <a href="http://www.stlukesonline.org/healthyu/KYNAppointment.php" target="_new">here</a> to schedule a 15-minute appointment or call toll-free 855-685-5409.</LI><br>';
            wording += '<LI>Click <a href="/lawson/xbnnet/plandescriptions/KYNGuide.pdf" target="_new">here</a> to view the KYN Registration Guide.</LI><br>';
			wording += '<LI><b>Healthcare Provider\'s Office</b><br>Biometric measures can also be obtained from a visit to your healthcare provider after September 1, 2013.<br>Click <a href="/lawson/xbnnet/plandescriptions/HUScreeningVerificationForm.pdf" target="_new">here</a> to download the <i>Screening Verification Form</i> and follow the instructions. Drop-in at a St. Luke\'s Know Your Numbers Screening location for your nicotine test.</LI>';
            wording += '</UL>';
		wording += '<P><b>Complete Second: Online Health Assessment (HA):</b></p>';
            wording += '<UL>';
            wording += '<LI><u>Note:</u> You will need the biometric measures (blood pressure, height, weight, body mass index (BMI), waist circumference, nicotine test and fasting blood glucose) obtained from the Know Your Numbers (KYN) Screening to complete the HA.</LI><br>';
            wording += '<LI>Click <a href="http://www.stlukesonline.org/healthyu/ha.php" target="_new">here</a> for instructions and the link to the Online Health Assessment.</LI><br>';
            wording += '<LI>Click <a href="http://www.stlukesonline.org/healthyu/news.php" target="_new">here</a> for more information or call the Healthy U Hotline at (208) 381-8400.</LI>';
            wording += '</UL>';

	}

  return wording;

}



// Is the plan the Air St Luke's plan?

Slrmc.prototype.isASL=function(company,plancode) {

  return (plancode == "AIR");

}



// Wording to print out about ASL

Slrmc.prototype.ASLReminder=function(ruletype) {

  var wording = "";

	if(ruletype=="N") {

		wording += '<P>If you have elected Air St. Luke\'s coverage for any of your family members, a one time deduction of $45 will be deducted from your paycheck.</P>';

	}

	else {			

		wording += '<P>If you have elected Air St. Luke\'s coverage for any of your family members, a one time deduction of $45 will be deducted from your April 25, 2014 paycheck.</P>';

	}

  return wording;

}



// Is the coverage option selected the Dual Discount coverage option?

Slrmc.prototype.isDualDiscount=function(planobj) {

  return (planobj[23] == "Dual Discount");

}



// Find if the plan code is one that supports a Dual Discount dependent coverage option

Slrmc.prototype.isDualDiscountPlan=function(company,plancode) {

  return (plancode == "HLPP" || plancode == "HLTE");

}



// Wording to print if plan has Dual Discount as an election option

Slrmc.prototype.DualDiscountReminder=function() {

	return '<P> <b>Dual Discount:</b> If an employee and his/her spouse:<b>(1)</b> are both employed by St. Luke’s and are benefits eligible (at least part-time level 2); and <b>(2)</b> need to elect \“<b>family</b>\” coverage, they may elect the PPO Plan and receive a discounted rate on their health plan premiums.  If you choose this option, Benefits Services will verify the benefits eligible status of each employee to confirm they qualify for this discount.  To enroll, the employee who will be carrying the coverage will elect the PPO family plan and the other employee will \“<b>Decline coverage</b>\”.';

}



// Find if the plan code is one that allows electing dependent coverage

Slrmc.prototype.isDependentElectPlan=function(company,plancode) {

	var dependentCodes = new Array("HL","VIS","DOR","DND");

	var matchDependent = 0;

	for (c in dependentCodes) {

		var searchLen = dependentCodes[c].length;

		if(plancode.length < searchLen) {

			continue;

		}

		else if(plancode.substr(0,searchLen) == dependentCodes[c]) {

			matchDependent = 1;

			break;

		}

	}

  return matchDependent;

}



// Wording to print out to remind about electing dependents properly

Slrmc.prototype.DependentReminder=function(ruletype) {

  var wording = "";

	if(ruletype=="N") {

		wording += '<P><B>Important:</B> If you are enrolling in a coverage level other than self only you must first add your dependents.  If you have not already done so, please exit, and complete the \“1 - Update Dependents\” section located to the left under the Open Enrollment bookmark.';

	}

	else {

		wording += '<P><B>Important:</B> If you are enrolling in a coverage level other than self only you must first add your dependents.  If you have not already done so, please exit, and complete the \“2 - Update Dependents\” section located to the left under the Open Enrollment bookmark.';

	}

  return wording;

}



// this will return 1 for any plans that are on a monthly deduction plan instead of bi-weekly

Slrmc.prototype.isMonthlyDeductionPlan=function(company,plancode) {

  return (company == 1 && (plancode == "ELSP" || plancode == "DLSS" || plancode == "DLSC"));

}



// this is the custom wording that will show up on the available plans page (availplans.html)

Slrmc.prototype.availplanWording=function(company,plangroup,ruletype,electedPlans) {

  var wording = "";

  

    // Handle special PILB message display if user elected PILB in a previous step

    //if(this.isPILBPlanGroup(company,plangroup)) {

    if(this.electedPILB(company,electedPlans) && this.isPILBPlanGroup(company,plangroup)) {

			wording += '<P>You elected PILB in a previous step.  Since you forfeit '+plangroup+' coverage by electing PILB, you only have one option to select which is to decline coverage.</P>';

			wording += '<P>Reminder:  If you elected PILB, you are forfeiting several other benefits along with the medical coverage, including PTO.  If you do not want to elect PILB, you will need to “quit” and go through your benefit elections again.</P>';

      return wording;

    }

  

		if(plangroup == "MEDICAL") {
// MOD BY BILAL
//      wording += '<P>View the <a href="plandescriptions/' + this.PlanDescriptionFolder + '/MedicalCompare.pdf" target="_new">Medical Plan Comparison Tables</a></P>';
      wording += '<P>View the <a href="plandescriptions/MedicalCompare.pdf" target="_new">Medical Plan Comparison Tables</a></P>';
      wording += '<P>View a summary on how to choose the best medical plan for you: <a href="plandescriptions/yourchoicebrochure.pdf" target="_new">It\'s Your Choice</a></P>';
// END OF MOD


      wording += '<p>Also see the medical plan rates:</p>';

      wording += '<ul>';

// MOD BY BILAL
//      wording += '<li><a href="plandescriptions/' + this.PlanDescriptionFolder + '/EPORates.pdf" target="_new">EPO Rates</a></li>';
      wording += '<li><a href="plandescriptions/PPORates.pdf" target="_new">PPO Rates</a></li>';
// END OF MOD
        
// MOD BY BILAL
//      wording += '<li><a href="plandescriptions/' + this.PlanDescriptionFolder + '/ChoiceRates.pdf" target="_new">Choice Rates</a></li>';
//      wording += '<li><a href="plandescriptions/ChoiceRates.pdf" target="_new">Choice Rates</a></li>';
      wording += '<li><a href="plandescriptions/HealthSaveRates.pdf" target="_new">HealthSave Rates</a></li>';
// END OF MOD
      wording += '</ul>';

      // EPO reminder

      wording += this.EPOReminder(ruletype);



		  wording += '<P><B>Authorization for Release of Information:</B>  I authorize any physician or hospital or other provider to furnish SelectHealth, VSP and/or Delta Dental and the St. Luke\'s Health System Employee Health Care Plan information regarding the history, diagnosis or treatment of any condition or injury of any person named on this application to the extent such information is required for utilization review and/or claims processing.</P>';

		  wording += '<P>I understand that if I waive coverage for myself or any of my eligible dependents, the only other opportunity I have to enroll in St. Luke’s Group Health plan is due to a qualified change in status (if elected within 60 days), or during “open” enrollment.  I agree that my share of the cost of the coverage I have elected will be paid on a pre-tax basis by a deduction from my salary every pay period.</P>';

		}

		else if(plangroup == "OTHER MED COVERAGE") {

			wording += '<p>Other Coverage Declaration:</p>';

      wording += '<p>If you have elected Pay in Lieu of Benefits, you must have non-St. Luke\'s Health Plan coverage. If you do, please indicate by selecting "Yes" on Other Med Coverage election.<p>Do you or any of your dependents enrolling in a St. Luke\'s medical plan have coverage under another medical plan (for example, through your spouse\'s employer)?  If so, please indicate "yes" so that benefits can be coordinated.</p>';

		}	

		else if(plangroup == "DENTAL") {
// MOD BY BILAL
		wording += '<P>View the <a href="plandescriptions/DentalCompare.pdf" target="_new">Dental Plan Comparison Tables</a></P>';
		wording += '<P><B>Authorization for Release of Information:</B>  I authorize any physician or hospital or other provider to furnish SelectHealth, VSP and/or Delta Dental and the St. Luke\'s Health System Employee Health Care Plan information regarding the history, diagnosis or treatment of any condition or injury of any person named on this application to the extent such information is required for utilization review and/or claims processing.</P>';
		wording += '<P>I understand that if I waive coverage for myself or any of my eligible dependents, the only other opportunity I have to enroll in St. Luke’s Group Health plan is due to a qualified change in status (if elected within 60 days), or during “open” enrollment.  I agree that my share of the cost of the coverage I have elected will be paid on a pre-tax basis by a deduction from my salary every pay period.</P>';
//		wording += '<P>View the <a href="plandescriptions/' + this.PlanDescriptionFolder + '/DentalCompare.pdf" target="_new">Dental Plan Comparison Tables</a></P>';
//		wording += '<P><B>Authorization for Release of Information:</B>  I authorize any physician or hospital or other provider to furnish SelectHealth, VSP and/or Delta Dental and the St. Luke\'s Health System Employee Health Care Plan information regarding the history, diagnosis or treatment of any condition or injury of any person named on this application to the extent such information is required for utilization review and/or claims processing.</P>';
//		wording += '<P>I understand that if I waive coverage for myself or any of my eligible dependents, the only other opportunity I have to enroll in St. Luke’s Group Health plan is due to a qualified change in status (if elected within 60 days), or during “open” enrollment.  I agree that my share of the cost of the coverage I have elected will be paid on a pre-tax basis by a deduction from my salary every pay period.</P>';
// END OF MOD 
		}				

		else if(plangroup == "VISION") {

			// CGL 1/14/2011 - Remove Vision Plan Comparison link since there is only one vision plan

			//wording += '<P>View the <a href="plandescriptions/' + this.PlanDescriptionFolder + '/hlvis.pdf" target="_new">Vision Plan Comparison Tables</a></P>';

			// ~CGL

		  wording += '<P><B>Authorization for Release of Information:</B>  I authorize any physician or hospital or other provider to furnish SelectHealth, VSP and/or Delta Dental and the St. Luke\'s Health System Employee Health Care Plan information regarding the history, diagnosis or treatment of any condition or injury of any person named on this application to the extent such information is required for utilization review and/or claims processing.</P>';

		  wording += '<P>I understand that if I waive coverage for myself or any of my eligible dependents, the only other opportunity I have to enroll in St. Luke’s Group Health plan is due to a qualified change in status (if elected within 60 days), or during “open” enrollment.  I agree that my share of the cost of the coverage I have elected will be paid on a pre-tax basis by a deduction from my salary every pay period.</P>';

		}				

		else if(plangroup == "EMPLOYEE SUPP LIFE" || plangroup == "SPOUSE SUPP LIFE") {

      // set up different guarantee Issues per company

      var guaranteeIssueEmp = "";

      var guaranteeIssueSpouse = "";

      guaranteeIssueEmp = "$120,000";

      guaranteeIssueSpouse = "$50,000";

      // set up different EOI link per company

      var eoiLink = "";

      eoiLink = "plandescriptions/EvidenceOfInsurability.pdf";

      wording += '<P>St. Luke’s offers the opportunity to elect additional life insurance for yourself and/or your dependents.  There are guarantee issue amounts for each plan in which you can elect without going through an additional approval process.</P>';

			wording += '<P><B>Important:</B> If you are enrolling in coverage levels greater than the guarantee issue amount of ' + guaranteeIssueEmp + ' for employee or ' + guaranteeIssueSpouse + ' for spouse, you must also complete the <a href="' + eoiLink + '" target="_new">Evidence of Insurability Form</a>. Once completed, return your form to the Human Resources/Benefits Services.</P>';

			wording += '<P>If you elect greater than the guarantee issue, and do not complete the Lincoln Financial Group Evidence of Insurability form or have approval from Lincoln Financial Group prior to the effective date of your insurance, your election will be changed to the guarantee issue amount (' + guaranteeIssueEmp + ' – employee or ' + guaranteeIssueSpouse + ' – spouse). Once approval has been received from Lincoln Financial Group, your election will be adjusted to the original amount of elected coverage. If your application for additional life insurance is denied, your election will remain at the guarantee issue amount.</P>';

		}

		else if(plangroup == "EMPLOYEE SUPP ADD" || plangroup == "FAMILY SUPP ADD") {

      wording += "<p><b>As an active, full-time employee, St. Luke's provides you with a accidental death and dismemberment (AD&amp;D) insurance benefit of 1 times your annual salary for full time employees (protrated for part-time).  This benefit is paid for by the company.</b></p>";

      if(plangroup == "EMPLOYEE SUPP ADD") {

        wording += "<p>In addition, you have the option of purchasing supplemental AD&amp;D insurance up to $300,000. You may elect coverage in $10,000 increments.</p>";

        wording += "<p>If you wish to elect this additional coverage for yourself only, please make your election here.  Otherwise, to elect for your entire family, 'waive' this coverage and elect the Family AD&amp;D coverage on the next benefit election screen.</p>";

      }

      else {

        wording += "<p>In addition, you have the option of purchasing supplemental AD&amp;D insurance, for yourself and your family members, up to $300,000. You may elect coverage in $10,000 increments. </p>"; 

        wording += "<p>If you elected coverage for yourself only, you should not elect the AD&amp;D family coverage.</p>";

      }

		}

		else if(plangroup == "CHILD SUPP LIFE") {

	// CGL 1/13/2011 - Per Dru Sewchok child life age rules are now aligned between companies; update ages in non-co 1 text

     wording += '<P>Children are eligible for coverage up to age 19 or up to age 23 if a full-time student.  Rates are based on the coverage amount and are not on a per child basis.  For example, if you have 3 children and elect $10,000 of child supplemental life for all of them, the premium is $0.28 per pay period.</P>';


	// ~CGL

		}

//		else if(plangroup == "FLEX SPEND CONTINUAL" || plangroup == "FLEX SPEND DEPENDENT" || plangroup == "FLEX SPEND IND INS" || plangroup == "FLEX SPEND MEDICAL" || plangroup == "FLEX SPEND LIMITED") {
		else if(plangroup == "FLEX SPEND CONTINUAL" || plangroup == "FLEX SPEND DEPENDENT" || plangroup == "FLEX SPEND IND INS" || plangroup == "FLEX SPEND MEDICAL") {

			//write('<P>View the <a href="fsa_compare.pdf" target="_new">Flexible Spending Plan Comparison</a></P>';

			if(plangroup == "FLEX SPEND CONTINUAL") {

				wording += '<p>The continual reimbursement option for the flexible spending account is used for qualified expenses in which you have an ongoing treatment contract.  Most people use this FSA election for orthodontics coverage.  For more information on flexible spending accounts, click the plan name above or review the Summary Plan Description.</p>';

				wording += '<p>If you are electing continual reimbursement for an orthodontics contract, you must provide a copy of your contract to either St. Luke’s Benefits Services or Pinnacle Pension Services.  Pinnacle will review the contract and determine if the election you make coordinates with the orthodontics contract.  If they already have a copy of your contract, we will verify the amount you have elected is correct per that contract.  If a contract is not received, we will not be able to proceed with your continual reimbursement election.</p>';

				wording += '<p>Your medical FSA account has an annual maximum of $2500.</p>';

			}

			else if(plangroup == "FLEX SPEND DEPENDENT") {

				wording += '<p>The Dependent Care FSA is used to reimburse you for day care expenses (for example, child day care or elder day care) for your eligible dependents.  The Dependent Care FSA does not reimburse any health care expenses.  For more information on flexible spending accounts click the plan name above or review the Summary Plan Description.</p>';

			}

//			else if(plangroup == "FLEX SPEND LIMITED") {
//
//				wording += '<p>The Limited Purpose FSA is used to reimburse you for <u>dental and vision expenses only</u>.  You may elect the Health Savings Account for reimbursement of qualified medical expenses.  For more information on this flexible spending account, click the plan name above.</p>';
//
//			}

			else if(plangroup == "FLEX SPEND IND INS") {

				wording += '<p>The flexible spending account - individual insurance is used for qualified individual insurance plans.  For example, if you are paying for an individual insurance policy for your spouse, you may qualify to use pre-tax FSA dollars to pay for that policy.</p>';

				wording += '<p>If you choose this election, Pinnacle Pension Services must approve the individual insurance you are claiming.  For more information on flexible spending accounts click the plan name above or review the Summary Plan Description.</p>';

			}

			else if(plangroup == "FLEX SPEND MEDICAL") {

				wording += '<p>The medical flexible spending account is for qualified medical expenses for you and your eligible dependents (including your spouse).  This includes items such as prescription drugs, deductibles, coinsurance and copays. For more information on flexible spending accounts click the plan name above or review the Summary Plan Description.</p>';

				wording += '<p>Your medical FSA account has an annual maximum of $2500.</p>';

			}

		  wording += '<P>If you currently have direct deposit with your FSA, you do not need to resubmit the direct deposit information.  If you would like to have direct deposit for your FSA reimbursements, you must complete a <A HREF="/lawson/xbnnet/plandescriptions/DirectDeposit.pdf" TARGET="_blank">Direct Deposit form</A>, attach a voided check and send it to Benefits Services.  If you do not want direct deposit, you will receive paper checks for your reimbursement.</P>';

      if(ruletype=="N") {

        wording += '<P>You have 90 days from your date of hire to make your election for FSA.  If you choose an amount or decline coverage and want to make a change to your election within your first 90 days, please contact Benefit Services at 381-6180.</P>';

      }

		}

		else if(plangroup == "PTO SELLBACK OCTOBER" || plangroup == "PTO SELLBACK APRIL") {

		  wording += '<P>Your PTO balance will decrease by the same number of hours you have elected to sellback at the appropriate time. You will not be allowed to change this election due to I.R.S. guidelines. </P>';

		  wording += '<P>You must have completed at least 90 days of employment and have at least 120 hours of PTO as of March 14, 2009. If you do not meet this requirement, you will not be notified by Benefit Services and your election will be void. </P>';

		  wording += '<P>If you have less hours available at sellback time than what you have selected here, Benefits Services will inform you of the actual hours that will sellback. </P>';

		  wording += '<P>You understand that if you have elected participation in the 403(b) plan that any eligible contributions will be deducted from your PTO Sellback payout. In addition, you will receive eligible employer matching contributions. </P>';

		  wording += '<P>The amount to be sold back must be from those hours accrued in the year in which sellback occurs. For example, if you elect to sell back 40 hours in October, you must accrue 40 hours between pay periods 8-20 of 2009. Sellback hours will be paid out at your base salary in effect at the time of each sellback period and sellback hours will be subject to tax withholding at the higher supplemental wage rate as required by IRS regulations. Differentials are not included. Similarly, you must maintain a PTO balance below 320 hours in order to accrue PTO to sell back. </P>';

		}

		else if(plangroup == "PAY IN LIEU OF BENEF") {

			wording += '<P>Pay in Lieu of Benefits plan (PILB) is an OPTIONAL benefit election and is designed to allow benefits eligible employees who have health insurance coverage under a non-St. Luke\'s health plan to elect a higher rate of pay in lieu of certain benefits.</P>';

			wording += '<p>To see which benefits you will be forfeiting, click the plan name above.</p>';

			wording += '<p>If you elect PILB in any pay period following your date of hire, your benefit will be effective in the pay period in which you make your election.</p>';

		}

		// CGL 1/12/2011 Removing custom text for Tobacco Declaration page

		//else if(plangroup == "TOBACCO DECLARATION") {

		//	wording += '<p>St. Luke\'s employees (does not include spouse or dependents) who do not use tobacco products will receive preferred premium pricing for St. Luke’s health plans.  This agreement describes the details that are necessary to implement the program fairly.</p>';

		//	wording += '<p>Tobacco products include both smoking and chewing tobacco.</p>';

		//	wording += '<p><b>No Tobacco Products Use:</b>  By checking this box, I honorably verify that I do not currently use tobacco products, and I pledge to not use tobacco products through March 31, 2011.  I understand I will receive preferred premium pricing through March 31, 2011, if I do not use any tobacco products during this time period.</p>';

		//	wording += '<p>In selecting “Not a Tobacco User”, I also agree to the following:</p>';

		//	wording += '<OL>';

		//	wording += '<LI>If I begin to use tobacco products during the time period, I will immediately notify St. Luke’s Benefits Services of such use, at 208-381-6180.</LI>';

		//	wording += '<LI>I agree to be tested for tobacco use upon request by St. Luke’s.  I understand that I may be required to submit to a test if questions regarding my abstention arise.  I understand that failure to submit to the test will be treated in the same manner as a positive test result.</LI>';

		//	wording += '<LI>If I have a positive test for tobacco, or if I fail to report as scheduled for a tobacco test, I agree to an additional deduction from my paychecks equal to the difference between preferred premium pricing and non-preferred premium pricing.  I understand and agree that this additional payroll deduction will be made on an after-tax basis, and will continue for each pay period until the first pay period beginning in April 2010.</LI>';

		//	wording += '</OL>';

		//	wording += '<p><B>Tobacco Products Use:</b>  By checking this box, I acknowledge that I use tobacco products and understand I will receive the non-preferred premium pricing for the St. Luke’s Employee Health Plans for the plan year beginning April 1, 2010.</p>';

		//	wording += '<OL start="4"><LI>I understand that if it is unreasonably difficult due to a medical condition for me to achieve the standards for premium pricing, or if it is medically inadvisable for me to attempt to achieve premium pricing under this program, I may appeal the non-preferred pricing I am going to receive.  To appeal, send a letter of appeal along with medical certification from your physician to St. Luke’s Appeals Committee at the Benefits Office, attention Dru Sewchok.  Once your appeal is received, it will be reviewed and a determination will be made concerning allowing the preferred premium pricing.</LI></OL>';

		//}

		// ~CGL

		else if(plangroup == "AIR ST LUKES") {

			wording += '<P>Air St. Luke\'s membership is free for the employee, but there is the option to cover your family.  This fee will be an automatic payroll deduction.</P>';

			wording += '<P>Please note:  If you choose to elect Air St. Luke’s, your membership will be good through March 31, 2015.  At that time, you will need to reelect for the next plan year.</P>';

			wording += '<P>I understand that:</P>';

			wording += '<UL>';

			wording += '<LI>Air St. Luke\'s Membership is not an insurance or investment program and has no guaranteed benefit.  The purpose of membership is to support Air St. Luke\'s</LI>';

			wording += '<LI>The membership benefits are for myself, my spouse and our dependent children under age 24 (those claimed on my income tax return) and listed on the enrollment form.</LI>';

			wording += '<LI>The Air St. Luke\'s Membership benefit is secondary to all other insurance payments. Air St. Luke\'s will accept payment from insurance carriers as payment in full.</LI>';

			wording += '<LI>I transfer directly to St. Luke\'s Regional Medical Center my rights to air medical insurance payments due me. Such payments shall not exceed Air St. Luke\'s regular charges.</LI>';

			wording += '<LI>The benefits of Air St. Luke\'s Membership cover air ambulance and ground ambulance charges for medically necessary services provided by Air St. Luke\'s or AAMMP affiliates only.</LI>';

			wording += '<LI>A physician or emergency medical personnel only may determine medical necessity.</LI>';

			wording += '<LI>Benefits for St. Luke\'s employee family members take effect three days following the plan effective date and continue until March 31, 2015.</LI>';

			wording += '<LI>Both ground and air emergent medical transports are based on medical need, not Membership status.  Not every illness or injury requires air transport.  Patients will be transported to the closest, medically appropriate facility as determined by a physician or emergency personnel.</LI>';

			wording += '<LI>While every reasonable effort will be made, service cannot always be guaranteed due to weather conditions or commitment to another transport.</LI>';

			wording += '<LI>Memberships are non-refundable and neither transferable nor assignable to other individuals.</LI>';

			wording += '</UL>';

			wording += '<P>I have read and agree to the benefits, terms and conditions of the Membership Plan as described above.</P>';

		}

    return wording;

}
