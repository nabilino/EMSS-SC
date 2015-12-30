//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
isNav = false
isIE = false

function badVersion(parm)
{
	if (document.all)
		isIE = true
	else if (document.layers)
		isNav = true

	var retval = false
	if (parm == "paint")
	{
		if (!isNav)
		{
			alert("This page requires Navigator version 4.04 or higher")
			retval = true
		}
		else
		{
			var j = navigator.appVersion.indexOf(" ")
			var ver = navigator.appVersion.substring(2,j)
			if (ver.length > 1)
			{
				if (ver.charAt(0) == "0" && ver.charAt(1) < "4")
				{
					alert("This page requires Navigator version 4.04 or higher")
					retval = true
				}
			}
			else if (ver.charAt(0) < "5")
			{
				alert("This page requires Navigator version 4.04 or higher")
				retval = true
			}
		}
	}
	else if (!isNav && !isIE)
	{
		alert("This page requires a 4.x (or higher) level browser")
		retval = true
	}
	return retval
}

