//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
// What String: @(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/statesuscan.js,v 1.1.26.1 2007/02/06 22:08:33 keno Exp $ $Name: REVIEWED_901 $
var states = new Array("  ","AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL",
					   "GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
					   "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM",
					   "NY","NC","ND","OH","OK","OR","PA","PR","RI","SC","SD",
					   "TN","TX","UT","VT","VA","VI","WA","WV","WI","WY",
					   "AB","BC","MB","NB","NF","NT","NS","ON","PE","QC","SK",
					   "YT")

var statenames = new Array(" ","Alabama","Alaska","Arizona","Arkansas",
						   "California","Colorado","Connecticut","Delaware",
						   "Dist of Columbia","Florida","Georgia","Hawaii",
						   "Idaho","Illinois","Indiana","Iowa","Kansas",
						   "Kentucky","Louisiana","Maine","Maryland",
						   "Massachusetts","Michigan","Minnesota","Mississippi",
						   "Missouri","Montana","Nebraska","Nevada",
						   "New Hampshire","New Jersey","New Mexico","New York",
						   "North Carolina","North Dakota","Ohio","Oklahoma",
						   "Oregon","Pennsylvania","Puerto Rico","Rhode Island",
						   "South Carolina","South Dakota","Tennessee","Texas",
						   "Utah","Vermont","Virginia","Virgin Islands",
						   "Washington","West Virginia","Wisconsin","Wyoming",
						   "Alberta","British Columbia","Manitoba","New Brunswick",
						   "Newfoundland","Northwest Territories","Nova Scotia",
						   "Ontario","Prince Edward Island","Quebec","Saskatchewan",
						   "Yukon Territory")

function BuildStateSelect(state,usonly)
{
	var stateselect = ""
	var j = states.length
	if (usonly)
		j = 54
	for (var i = 0;i < j;i++)
	{
        stateselect += '<option value="' + states[i] + '"'
		if (state == states[i])
			stateselect += ' selected>'
		else
			stateselect += '>'
		stateselect += statenames[i]
	}
	return stateselect
}


