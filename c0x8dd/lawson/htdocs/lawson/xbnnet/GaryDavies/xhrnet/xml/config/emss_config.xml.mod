<?xml version="1.0" encoding="ISO-8859-1"?>
<!-- $Header: /cvs/cvs_archive/applications/webtier/shr/src/xhrnet/xml/config/Attic/emss_config.xml,v 1.1.2.31.4.1 2011/09/07 18:41:22 brentd Exp $ -->
<!--
	Proprietary Program Material
	This material is proprietary to Lawson Software, and is not to be
	reproduced or disclosed except in accordance with software contract
	provisions, or upon written authorization from Lawson Software.

	Copyright (c) 2007 by Lawson Software. All Rights Reserved.
	Saint Paul, Minnesota
-->
<emss fileVersion="(201111) 09.00.01.06.00">
	<!-- **** Default Company Settings - DO NOT REMOVE *** -->
	<!-- To define company-level settings, copy this <company> node, paste it below this one and set the value 
	     attribute to the desired company number. --> 
	<company value="">
		<!-- User Interface Theme -->
		<!-- MOD BY BILAL - Theme changed from 9 to 8 - IE 6 does not support theme 9 -->
		<setting id="theme" value="8"/>
		
		<!-- Enable filter select for large volume data selects?  -->
		<!-- How many records should display on each page of the filter select (recs_per_page)?  -->
		<!-- recs_per_page: valid values are: 25, 50, 100, 300, 500, 600 -->
		<setting id="filter_select" value="true" recs_per_page="25" pinned="true"/>		
		
		<!-- Display future-dated payments in Pay Checks?  -->
		<setting id="future_payments" value="false"/>
		
		<!-- Display pay period start date on pay stub?  -->
		<setting id="period_start_date" value="false"/>
		
		<!-- Calculate pay rate for hourly employees on pay stub? -->
		<setting id="calc_hourly_rate" value="false"/>		
		
		<!-- Mask bank account and routing numbers in Pay Checks?  -->
		<!-- MOD BY BILAL - Change from false to true -->
		<setting id="mask_bank_info" value="true"/>

		<!-- Allow manual bank and routing number entry in Direct Deposit? -->
		<setting id="manual_bank_entry" value="true"/>
		
		<!-- Show employee pay information in Benefit Enrollment printout?  -->
		<setting id="ben_pay_info" value="true"/>				
		
		<!-- Enable Roth deductions in Payment Modeling?  -->
		<setting id="roth_pay_model" value="false"/>						
		
		<!-- Allow employees to change their exempt status on their W-4? -->
		<setting id="w4_exempt" value="false"/>		

		<!-- Require Social Number when updating dependent? -->
		<!-- MOD BY BILAL - Setting value to true	-->
<!--		<setting id="require_dep_ssn" value="false"/>	-->
		<setting id="require_dep_ssn" value="true"/>	

		<!-- How many detail lines in Daily Time Entry? -->
		<setting id="te_daily_lines" value="10"/>
		
		<!-- Prompt for 24 hour edit in Daily Time Entry? -->
		<!--<setting id="te_daily_24_hour_edit" value="true"/>   // MOD BY BILAL 01/28/2011 -->
		<setting id="te_daily_24_hour_edit" value="false"/>
		
		<!-- Prompt for 24 hour edit in Period Time Entry? -->
		<!-- <setting id="te_period_24_hour_edit" value="true"/>	 // MOD BY BILAL 01/28/2011 -->
		<setting id="te_period_24_hour_edit" value="false"/>
		
		<!-- Send email when employee submits timecard? -->
		<setting id="te_employee_submit_email" value="false"/>
		
		<!-- Send email when manager changes timecard? -->
		<setting id="te_manager_change_email" value="true"/>
		
		<!-- Send email when manager rejects timecard? -->
		<setting id="te_manager_reject_email" value="true"/>
		
		<!-- Send email when manager approves timecard? -->
		<!--<setting id="te_manager_approve_email" value="true"/>	// MOD BY BILAL 01/28/2011 -->
		<setting id="te_manager_approve_email" value="true"/>
		
		<!-- Display post or GL only activities in Time Entry? -->
		<setting id="te_post_or_gl_activities" value="true"/>		
				
		<!-- Allow negative hours in Time Entry? -->
		<setting id="te_allow_negative_hours" value="true"/>										
	
		<!-- Alert qualifications that will expire in how many days in Career Management? -->
		<setting id="cm_qual_expire_days" value="90"/>	
	
		<!-- Display upcoming reviews due within how many days in MSS? -->
		<setting id="reviews_within_days" value="30"/>	
	
		<!-- Require internal posting dates on job reqs that display in Job Postings? -->
		<setting id="require_posting_dates" value="false"/>	
	
		<!-- Email format: valid values are: html, text -->
		<!-- Note: HTML format may not be supported by all email notifications -->
		<setting id="email_format" value="html"/>		
	
		<!-- Is Enwisen be enabled for this company? -->
		<setting id="enable_enwisen" value="false"/>
		
		<!-- Enwisen host URL -->
		<setting id="enwisen_host_url" value="http://stage.enwisen.com/ASI/page.aspx"/>
		
		<!-- Debug Enwisen integration -->
		<setting id="debug_enwisen" value="false"/>
		
		<!-- Show the Enwisen header bar on all Enwisen pages? -->
		<setting id="enwisen_header" value="true"/>		
		
		<!-- Send a list of the employee's Lawson employee groups to Enwisen? -->
		<setting id="employee_groups" value="false"/>
		
		<!-- Send a list of eligible benefit plan codes to Enwisen? -->
		<setting id="eligible_benefit_plans" value="true"/>
				
		<!-- Send a list of employee's current benefit plan codes to Enwisen? -->
		<setting id="current_benefit_plans" value="true"/>		
		
		<!-- List of Lawson employee group names for HR Call Center responders -->
		<!-- There should be at least two <group> nodes: one for Call Center Administrators and one for Call Center Reps. -->
		<setting id="hr_call_center_responders">
			<group name="HRCALLREP"/>
			<group name="HRCALLADM"/>
		</setting>		
		
		<!-- List of Lawson employee group names for Onboarding administrators -->
		<setting id="onboarding_admins">
			<group name="HIREADMIN"/>
		</setting>		
		
		<!-- List of Lawson employee group names for Day 1 new hires -->
		<setting id="onboarding_day_1_new_hires">
			<group name="DAY1HIRE"/>
		</setting>
		
		<!-- List of Lawson employee group names for Offboarding administrators -->
		<setting id="offboarding_admins">
			<group name="TERMADMIN"/>
		</setting>	
		
		<!-- List of Lawson employee group names for Day 1 terminations -->
		<setting id="offboarding_day_1_terms">
			<group name="DAY1TERM"/>
		</setting>				
		
        <!-- Send the system timestamp in GMT format when logging in to Enwisen? -->
        <setting id="login_timestamp" value="false"/>		
		
		<!-- Subscription IDs for custom links to Enwisen -->
		<setting id="enwisen_subscription_ids" value="true">
			<page id="HEALTH=MEDICAL_COST_ESTIMATOR" alias="medestimator"/>
			<page id="HEALTH=YOUR_NEEDS_MEDICAL" alias="uynmedical"/>
			<page id="ADOPTION" alias="adoption"/>
			<page id="BIRTH" alias="baby"/>
			<page id="DIVORCE" alias="divorce"/>
			<page id="LEGAL_SEPARATION" alias="divorce"/>
			<page id="MARRIAGE" alias="married"/>
			<page id="MOVE" alias="moving"/>
			<page id="SPOUSE_EMPLOYMENT" alias="married"/>
			<page id="NAVIGATOR_HOME" alias="navigator"/>
		</setting>		
	</company>
</emss>

