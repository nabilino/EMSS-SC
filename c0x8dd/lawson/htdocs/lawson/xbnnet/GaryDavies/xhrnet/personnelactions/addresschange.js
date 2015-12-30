//************************** Color Scheme *********************************
// This is a template design for Personal Profile. The color schemes were 
// taken from HYPE. If you like you, can use HYPE's color schemes to develop 
// your own look and feel.

var Background  = "#FFFFFF" 	//White
var Highlight   = "#FFFFE0"		//LightYellow1
var Darklight   = "#EEEED1"		//LightYellow2
var TableHeading = "#CDCDB4"	//LightYellow3
//*************************************************************************

var titlefont = '<font color="black" face="timesnewroman">'
var datafont  = '<font color="black" face="timesnewroman">'

function GetWebuser()
{
	//clearTimeout(timer)
	//authenticate("frameNm='jsreturn'|funcNm='user=authUser;GetEmpPersonal()'|desiredEdit='EM'")
	user=authUser;GetEmpPersonal();
}

function GetEmpPersonal()
{
  // JRZ removing SSN from data retrieved since it is not used
	var fields = "employee.label-name-1;employee.nick-name;"
	+ "former-lst-nm;former-fst-nm;former-mi;maiden-lst-nm;maiden-fst-nm;"
	+ "maiden-mi;sex,xlt;veteran,xlt;birthdate;true-mar-stat,xlt;ethnicity.description;"
	+ "visible-min;aboriginal;handicap-id,xlt;disability.description;"
	+ "employee.addr1;employee.addr2;employee.addr3;employee.city;employee.state;employee.zip"
  // JRZ adding supp address and phone number
  + ";supp-addr1;supp-addr2;supp-city;supp-state;supp-zip;supp-phone-nbr;hm-phone-nbr"
	GetEmpInfo(authUser.prodline,authUser.company,authUser.employee,"paemployee",
				fields,"EmployeePersonal()")
}

function EmployeePersonal()
{ 
	if (typeof(EmpInfo.employee_label_name_1) == "undefined")
	{
		alert("Employee record was not found.")
		return
	}
	
	var nextcolor = Highlight
	var PersonalContent = "<body link=maroon vlink=black bgcolor="+Background+">"
	+ '<center><table border=1 cellspacing=0 cellpadding=2>'
	+ '<tr><th align=center colspan=2 bgcolor='+TableHeading+' nowrap> &nbsp;'
	+ titlefont + ' Personal Address Information &nbsp;</font>'
	
	if (NonSpace(EmpInfo.employee_label_name_1) != 0)
	{
		PersonalContent += '<tr bgcolor='+nextcolor+'><td nowrap>&nbsp; '+titlefont+'Name &nbsp;</font>'
		+ '<td nowrap> &nbsp;' + datafont + EmpInfo.employee_label_name_1 + ' &nbsp;</font>'	
		nextcolor = getNxtClr(nextcolor)
	}
	if (NonSpace(EmpInfo.employee_nick_name) != 0)
	{
		PersonalContent += '<tr bgcolor='+nextcolor+'><td nowrap>&nbsp; '+titlefont +'Preferred Name &nbsp;</font>'
		+ '<td nowrap> &nbsp;' + datafont + EmpInfo.employee_nick_name + ' &nbsp;</font>'
		nextcolor = getNxtClr(nextcolor)			
	}
  
  // JRZ spacer added for address display
  PersonalContent += '<tr bgcolor='+nextcolor+'><td colspan=2 align=center nowrap><b>Mailing Address</b></td></tr>'
  nextcolor = getNxtClr(nextcolor)
	
	if (NonSpace(EmpInfo.employee_addr1) != 0)
	{
		PersonalContent += '<tr bgcolor='+nextcolor+'><td nowrap>&nbsp; '+titlefont+'Address 1 &nbsp;</font>'
		+ '<td nowrap> &nbsp;' + datafont + EmpInfo.employee_addr1 + ' &nbsp;</font>'	
		nextcolor = getNxtClr(nextcolor)
	}
	if (NonSpace(EmpInfo.employee_addr2) != 0)
	{
		PersonalContent += '<tr bgcolor='+nextcolor+'><td nowrap>&nbsp; '+titlefont +'Address 2 &nbsp;</font>'
		+ '<td nowrap> &nbsp;' + datafont + EmpInfo.employee_addr2 + ' &nbsp;</font>'
		nextcolor = getNxtClr(nextcolor)			
	}
	
	if (NonSpace(EmpInfo.employee_addr3) != 0)
	{
		PersonalContent += '<tr bgcolor='+nextcolor+'><td nowrap>&nbsp; '+titlefont+'Address 3 &nbsp;</font>'
		+ '<td nowrap> &nbsp;' + datafont + EmpInfo.employee_addr3 + ' &nbsp;</font>'	
		nextcolor = getNxtClr(nextcolor)
	}
	if (NonSpace(EmpInfo.employee_city) != 0)
	{
		PersonalContent += '<tr bgcolor='+nextcolor+'><td nowrap>&nbsp; '+titlefont +'City &nbsp;</font>'
		+ '<td nowrap> &nbsp;' + datafont + EmpInfo.employee_city + ' &nbsp;</font>'
		nextcolor = getNxtClr(nextcolor)			
	}
	if (NonSpace(EmpInfo.employee_state) != 0)
	{
		PersonalContent += '<tr bgcolor='+nextcolor+'><td nowrap>&nbsp; '+titlefont+'State &nbsp;</font>'
		+ '<td nowrap> &nbsp;' + datafont + EmpInfo.employee_state + ' &nbsp;</font>'	
		nextcolor = getNxtClr(nextcolor)
	}
	if (NonSpace(EmpInfo.employee_zip) != 0)
	{
		PersonalContent += '<tr bgcolor='+nextcolor+'><td nowrap>&nbsp; '+titlefont +'Zip Code &nbsp;</font>'
		+ '<td nowrap> &nbsp;' + datafont + EmpInfo.employee_zip + ' &nbsp;</font>'
		nextcolor = getNxtClr(nextcolor)			
	}
	if (NonSpace(EmpInfo.hm_phone_nbr) != 0)
	{
		PersonalContent += '<tr bgcolor='+nextcolor+'><td nowrap>&nbsp; '+titlefont +'Home Phone &nbsp;</font>'
		+ '<td nowrap> &nbsp;' + datafont + EmpInfo.hm_phone_nbr + ' &nbsp;</font>'
		nextcolor = getNxtClr(nextcolor)			
	}  

  // JRZ spacer added for address display
  PersonalContent += '<tr bgcolor='+nextcolor+'><td colspan=2 align=center nowrap><b>Home/Physical Address</b></td></tr>'
  nextcolor = getNxtClr(nextcolor)    
  
  // JRZ display supplemental address information
	if (NonSpace(EmpInfo.supp_addr1) != 0)
	{
		PersonalContent += '<tr bgcolor='+nextcolor+'><td nowrap>&nbsp; '+titlefont+'Supp Address 1 &nbsp;</font>'
		+ '<td nowrap> &nbsp;' + datafont + EmpInfo.supp_addr1 + ' &nbsp;</font>'	
		nextcolor = getNxtClr(nextcolor)
	}
	if (NonSpace(EmpInfo.supp_addr2) != 0)
	{
		PersonalContent += '<tr bgcolor='+nextcolor+'><td nowrap>&nbsp; '+titlefont +'Supp Address 2 &nbsp;</font>'
		+ '<td nowrap> &nbsp;' + datafont + EmpInfo.supp_addr2 + ' &nbsp;</font>'
		nextcolor = getNxtClr(nextcolor)			
	}
	if (NonSpace(EmpInfo.supp_city) != 0)
	{
		PersonalContent += '<tr bgcolor='+nextcolor+'><td nowrap>&nbsp; '+titlefont +'Supp City &nbsp;</font>'
		+ '<td nowrap> &nbsp;' + datafont + EmpInfo.supp_city + ' &nbsp;</font>'
		nextcolor = getNxtClr(nextcolor)			
	}
	if (NonSpace(EmpInfo.supp_state) != 0)
	{
		PersonalContent += '<tr bgcolor='+nextcolor+'><td nowrap>&nbsp; '+titlefont+'Supp State &nbsp;</font>'
		+ '<td nowrap> &nbsp;' + datafont + EmpInfo.supp_state + ' &nbsp;</font>'	
		nextcolor = getNxtClr(nextcolor)
	}
	if (NonSpace(EmpInfo.supp_zip) != 0)
	{
		PersonalContent += '<tr bgcolor='+nextcolor+'><td nowrap>&nbsp; '+titlefont +'Supp Zip Code &nbsp;</font>'
		+ '<td nowrap> &nbsp;' + datafont + EmpInfo.supp_zip + ' &nbsp;</font>'
		nextcolor = getNxtClr(nextcolor)			
	}
	if (NonSpace(EmpInfo.supp_phone_nbr) != 0)
	{
		PersonalContent += '<tr bgcolor='+nextcolor+'><td nowrap>&nbsp; '+titlefont +'Supp Phone &nbsp;</font>'
		+ '<td nowrap> &nbsp;' + datafont + EmpInfo.supp_phone_nbr + ' &nbsp;</font>'
		nextcolor = getNxtClr(nextcolor)			
	}
	
	PersonalContent += '</table></center>'
  
  PersonalContent += '<p align=center>Change your address information using the <a href="/lawson/hrnet/personnelactions/addresschange.htm"><b>Online Address Change Form</b></a></p>';
	addressData.address_addr1 = EmpInfo.employee_addr1;
	addressData.address_addr2 = EmpInfo.employee_addr2;
	addressData.address_city = EmpInfo.employee_city;
	addressData.address_state = EmpInfo.employee_state;
	addressData.address_zip = EmpInfo.employee_zip;
	addressData.address_phone = EmpInfo.hm_phone_nbr;
	addressData.address_supp_addr1 = EmpInfo.supp_addr1;
	addressData.address_supp_addr2 = EmpInfo.supp_addr2;
	addressData.address_supp_city = EmpInfo.supp_city;
	addressData.address_supp_state = EmpInfo.supp_state;
	addressData.address_supp_zip = EmpInfo.supp_zip;
	addressData.address_supp_phone = EmpInfo.supp_phone_nbr;
	//DrawFrameContent(self.MAIN, PersonalContent)	
}		  

function getNxtClr(color)
{
	if (color == Highlight)
		return Darklight
	else
		return Highlight	
}

function DrawFrameContent(FrameName, Content)
{
	with(FrameName.document)
	{
		open()
		write(Content)
		close()
	}
}