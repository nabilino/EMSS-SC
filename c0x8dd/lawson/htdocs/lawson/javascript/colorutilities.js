//    Proprietary Program Material
//    This material is proprietary to Lawson Software, and is not to be
//    reproduced or disclosed except in accordance with software contract
//    provisions, or upon written authorization from Lawson Software.
//
//    Copyright (C) 2001-2007 by Lawson Software. All Rights Reserved.
//    Saint Paul, Minnesota
//What String:@(#)$Header: /cvs/cvs_archive/LawsonPlatform/ui/info_office/javascript/colorutilities.js,v 1.1.26.1 2007/02/06 22:08:32 keno Exp $ $Name: REVIEWED_901 $ 

// This function returns one of two colors passed is listNbr is odd/even
function chgColor(listNbr, color1, color2) 
{
	return (listNbr%2==0)?color1:color2;
}

// Description: This function takes a hexcolor or webname color and creates another color that is 
//              "color similar", and can be used on a page.  ex.(in a table you may have alternating
//				background colors for table cells)
// Arguments:	The argument must be sent as a webcolor 'name' or as a hexidecimal number.. ex 'c0c0c0'

function getLikeColor(thecol)
{
	var c=new Array(), z=0
	thecol = (typeof(thecol)=="string")?thecol:""+thecol;
	thecol = (getWebColorHexValue(thecol))?getWebColorHexValue(thecol):thecol;
	thecol = (thecol.length==7)?thecol.substring(1):thecol;
	c[0] = parseInt(thecol.substr(0,2), 16)
	c[1] = parseInt(thecol.substr(2,2), 16)
	c[2] = parseInt(thecol.substr(4,2), 16)

	// Check to see if majority can move up... otherwise go down.
	// (range is 0-255) <100 means go up in value... and >=100 means come down in value.
	if ((c[0]<100 && c[1]<100 && c[2]<100)||(c[0]<100 && c[1]<100 && c[2]>=100)||(c[0]<100 && c[1]>=100 && c[2]<100)||(c[0]>=100 && c[1]<100 && c[2]<100))
		for(z=0; z<c.length; z++)
			c[z]=parseInt(((255-c[z])*.28+c[z]),10)
	else
		for(z=0; z<c.length; z++)
			c[z]=parseInt((c[z]*.85),10)

	// make sure the numbers are still in range
	for (z=0; z<c.length; z++)
	{
		c[z]=(c[z]>255)?255:c[z];
		c[z]=(c[z]<0)?0:c[z];
	}
	return "" + toHex(c[0]) + toHex(c[1]) + toHex(c[2]);
}



// Description: This function determines if a white or black font color 
//              should be used with the corresponding background color.
// Arguments:   The Background color in hex triplets ex. 'c0c0c0'

function fontBright(thecolor)
{
	var drd=0, dgr=0, dbl=0, brightness=0

	if (thecolor.substr(0,1) == "#")
		thecolor = thecolor.substring(1)
	else
		thecolor = (getWebColorHexValue(thecolor))?getWebColorHexValue(thecolor):thecolor;

    drd = parseInt(thecolor.substring(0,2),16)
    dgr = parseInt(thecolor.substring(2,4),16)
    dbl = parseInt(thecolor.substring(4,6),16)
	brightness = eval(0.212671 * drd + 0.715160 * dgr + 0.072169 * dbl)

	if (brightness >= 128)
		return '000000'
	else
		return 'FFFFFF'		
}

// This function takes a string, and tells you if it is a color.
//  It will return "true" or "false"
function stringIsColor(thestring)
{
	if (getWebColorHexValue(thestring))
		return true;
	else if (thestring.indexOf("/") != -1 || thestring.indexOf(".") != -1)
		return false;
	else if (thestring.length == 7 && thestring.substr(0,1) == "#")
		return true;
	else if (thestring.length == 6)
		return true;
	else
		return false;
}

// This function will make an attempt to convert point size fonts (7,8,9,10,11,12,13) to HTML size fonts...
function getHTMLfontsize(thefontsize)
{
	thefontsize = (typeof(thefontsize) != "number")?parseInt(thefontsize,10):thefontsize;
	switch (thefontsize)
	{
		case 7:
			return 2;
		case 8:
			return 2;
		case 9:
			return 3;
		case 10:
			return 3;
		case 11:
			return 4;
		case 12:
			return 4;
		case 13:
			return 5;
		default:
			return 4;
	}
}

// This function will make an attempt to convert point size fonts (2,3,4,5,6) to Point-Size fonts...
function getPOINTfontsize(thefontsize)
{
	thefontsize = (typeof(thefontsize) != "number")?parseInt(thefontsize,10):thefontsize;
	switch (thefontsize)
	{
		case 2:
			return 9;
		case 3:
			return 10;
		case 4:
			return 11;
		case 5:
			return 13;
		case 6:
			return 14;
		default:
			return 12;
	}
}

// The next two functions will get the corresponding color... whether by hex value or by
//  webcolor name...
function getWebColorHexValue(theWebColorName)
{
	if (typeof(predefinedColorsByName[theWebColorName.toLowerCase()]) != 'undefined')
		return predefinedColorsByName[theWebColorName.toLowerCase()].toLowerCase();
	else
		return false;
}

function getWebColorName(theWebHexValue)
{
	if (typeof(predefinedColorsByHex[theWebHexValue.toUpperCase()]) != 'undefined')
		return predefinedColorsByHex[theWebHexValue.toUpperCase()];
	else
		return false;
}

// This converts a number of base 10 (0 - 255) to a two digit hexidecimal number.
function toHex(theDecNum)
{
	var hexCol2 = theDecNum % 16
	var hexCol1 = (theDecNum-hexCol2)/16
	switch (hexCol1)
	{
		case 10:hexCol1="a";break;
		case 11:hexCol1="b";break;
		case 12:hexCol1="c";break;
		case 13:hexCol1="d";break;
		case 14:hexCol1="e";break;
		case 15:hexCol1="f";break;
		default:break;
	}
	switch (hexCol2)
	{
		case 10:hexCol2="a";break;
		case 11:hexCol2="b";break;
		case 12:hexCol2="c";break;
		case 13:hexCol2="d";break;
		case 14:hexCol2="e";break;
		case 15:hexCol2="f";break;
		default:break;
	}
	return ("" + hexCol1 + hexCol2);
}

// Array of webcolor names, indexed by hexidecimal color.  To access a hexcolor or namecolor, use the functions above.

var predefinedColorsByHex = new Array()
predefinedColorsByHex['F0F8FF']	= 'aliceblue'
predefinedColorsByHex['FAEBD7']	= 'antiquewhite'
predefinedColorsByHex['00FFFF']	= 'aqua'
predefinedColorsByHex['7FFFD4']	= 'aquamarine'
predefinedColorsByHex['F0FFFF']	= 'azure'
predefinedColorsByHex['F5F5DC']	= 'beige'
predefinedColorsByHex['000000']	= 'black'
predefinedColorsByHex['FFEBCD']	= 'blanchedalmond'
predefinedColorsByHex['0000FF']	= 'blue'
predefinedColorsByHex['8A2BE2']	= 'blueviolet'
predefinedColorsByHex['A52A2A']	= 'brown'
predefinedColorsByHex['DEB887']	= 'burlywood'
predefinedColorsByHex['5F9EA0']	= 'cadetblue'
predefinedColorsByHex['7FFF00']	= 'chartreuse'
predefinedColorsByHex['D2691E']	= 'chocolate'
predefinedColorsByHex['FF7F50']	= 'coral'
predefinedColorsByHex['6495ED']	= 'cornflowerblue'
predefinedColorsByHex['FFF8DC']	= 'cornsilk'
predefinedColorsByHex['DC143C']	= 'crimson'
predefinedColorsByHex['00FFFF']	= 'cyan'
predefinedColorsByHex['00008B']	= 'darkblue'
predefinedColorsByHex['008B8B']	= 'darkcyan'
predefinedColorsByHex['B8860B']	= 'darkgoldenrod'
predefinedColorsByHex['A9A9A9']	= 'darkgray'
predefinedColorsByHex['006400']	= 'darkgreen'
predefinedColorsByHex['BDB76B']	= 'darkkhaki'
predefinedColorsByHex['8B008B']	= 'darkmagenta'
predefinedColorsByHex['556B2F']	= 'darkolivegreen'
predefinedColorsByHex['FF8C00']	= 'darkorange'
predefinedColorsByHex['9932CC']	= 'darkorchid'
predefinedColorsByHex['8B0000']	= 'darkred'
predefinedColorsByHex['E9967A']	= 'darksalmon'
predefinedColorsByHex['8FBC8F']	= 'darkseagreen'
predefinedColorsByHex['483D8B']	= 'darkslateblue'
predefinedColorsByHex['2F4F4F']	= 'darkslategray'
predefinedColorsByHex['00CED1']	= 'darkturquoise'
predefinedColorsByHex['9400D3']	= 'darkviolet'
predefinedColorsByHex['FF1493']	= 'deeppink'
predefinedColorsByHex['00BFFF']	= 'deepskyblue'
predefinedColorsByHex['696969']	= 'dimgray'
predefinedColorsByHex['1E90FF']	= 'dodgerblue'
predefinedColorsByHex['B22222']	= 'firebrick'
predefinedColorsByHex['FFFAF0']	= 'floralwhite'
predefinedColorsByHex['228B22']	= 'forestgreen'
predefinedColorsByHex['FF00FF']	= 'fuchsia'
predefinedColorsByHex['DCDCDC']	= 'gainsboro'
predefinedColorsByHex['F8F8FF']	= 'ghostwhite'
predefinedColorsByHex['FFD700']	= 'gold'
predefinedColorsByHex['DAA520']	= 'goldenrod'
predefinedColorsByHex['808080']	= 'gray'
predefinedColorsByHex['008000']	= 'green'
predefinedColorsByHex['ADFF2F']	= 'greenyellow'
predefinedColorsByHex['F0FFF0']	= 'honeydew'
predefinedColorsByHex['FF69B4']	= 'hotpink'
predefinedColorsByHex['CD5C5C']	= 'indianred'
predefinedColorsByHex['4B0082']	= 'indigo'
predefinedColorsByHex['FFFFF0']	= 'ivory'
predefinedColorsByHex['F0E68C']	= 'khaki'
predefinedColorsByHex['E6E6FA']	= 'lavender'
predefinedColorsByHex['FFF0F5']	= 'lavenderblush'
predefinedColorsByHex['7CFC00']	= 'lawngreen'
predefinedColorsByHex['FFFACD']	= 'lemonchiffon'
predefinedColorsByHex['ADD8E6']	= 'lightblue'
predefinedColorsByHex['F08080']	= 'lightcoral'
predefinedColorsByHex['E0FFFF']	= 'lightcyan'
predefinedColorsByHex['FAFAD2']	= 'lightgoldenrodyellow'
predefinedColorsByHex['90EE90']	= 'lightgreen'
predefinedColorsByHex['D3D3D3']	= 'lightgrey'
predefinedColorsByHex['FFB6C1']	= 'lightpink'
predefinedColorsByHex['FFA07A']	= 'lightsalmon'
predefinedColorsByHex['20B2AA']	= 'lightseagreen'
predefinedColorsByHex['87CEFA']	= 'lightskyblue'
predefinedColorsByHex['778899']	= 'lightslategray'
predefinedColorsByHex['B0C4DE']	= 'lightsteelblue'
predefinedColorsByHex['FFFFE0']	= 'lightyellow'
predefinedColorsByHex['00FF00']	= 'lime'
predefinedColorsByHex['32CD32']	= 'limegreen'
predefinedColorsByHex['FAF0E6']	= 'linen'
predefinedColorsByHex['FF00FF']	= 'magenta'
predefinedColorsByHex['800000']	= 'maroon'
predefinedColorsByHex['66CDAA']	= 'mediumaquamarine'
predefinedColorsByHex['0000CD']	= 'mediumblue'
predefinedColorsByHex['BA55D3']	= 'mediumorchid'
predefinedColorsByHex['9370DB']	= 'mediumpurple'
predefinedColorsByHex['3CB371']	= 'mediumseagreen'
predefinedColorsByHex['7B68EE']	= 'mediumslateblue'
predefinedColorsByHex['00FA9A']	= 'mediumspringgreen'
predefinedColorsByHex['48D1CC']	= 'mediumturquoise'
predefinedColorsByHex['C71585']	= 'mediumvioletred'
predefinedColorsByHex['191970']	= 'midnightblue'
predefinedColorsByHex['F5FFFA']	= 'mintcream'
predefinedColorsByHex['FFE4E1']	= 'mistyrose'
predefinedColorsByHex['FFE4B5']	= 'moccasin'
predefinedColorsByHex['FFDEAD']	= 'navajowhite'
predefinedColorsByHex['000080']	= 'navy'
predefinedColorsByHex['FDF5E6']	= 'oldlace'
predefinedColorsByHex['808000']	= 'olive'
predefinedColorsByHex['6B8E23']	= 'olivedrab'
predefinedColorsByHex['FFA500']	= 'orange'
predefinedColorsByHex['FF4500']	= 'orangered'
predefinedColorsByHex['DA70D6']	= 'orchid'
predefinedColorsByHex['EEE8AA']	= 'palegoldenrod'
predefinedColorsByHex['98FB98']	= 'palegreen'
predefinedColorsByHex['AFEEEE']	= 'paleturquoise'
predefinedColorsByHex['DB7093']	= 'palevioletred'
predefinedColorsByHex['FFEFD5']	= 'papayawhip'
predefinedColorsByHex['FFDAB9']	= 'peachpuff'
predefinedColorsByHex['CD853F']	= 'peru'
predefinedColorsByHex['FFC0CB']	= 'pink'
predefinedColorsByHex['DDA0DD']	= 'plum'
predefinedColorsByHex['B0E0E6']	= 'powderblue'
predefinedColorsByHex['800080']	= 'purple'
predefinedColorsByHex['FF0000']	= 'red'
predefinedColorsByHex['BC8F8F']	= 'rosybrown'
predefinedColorsByHex['4169E1']	= 'royalblue'
predefinedColorsByHex['8B4513']	= 'saddlebrown'
predefinedColorsByHex['FA8072']	= 'salmon'
predefinedColorsByHex['F4A460']	= 'sandybrown'
predefinedColorsByHex['2E8B57']	= 'seagreen'
predefinedColorsByHex['FFF5EE']	= 'seashell'
predefinedColorsByHex['A0522D']	= 'sienna'
predefinedColorsByHex['C0C0C0']	= 'silver'
predefinedColorsByHex['87CEEB']	= 'skyblue'
predefinedColorsByHex['6A5ACD']	= 'slateblue'
predefinedColorsByHex['708090']	= 'slategray'
predefinedColorsByHex['FFFAFA']	= 'snow'
predefinedColorsByHex['00FF7F']	= 'springgreen'
predefinedColorsByHex['4682B4']	= 'steelblue'
predefinedColorsByHex['D2B48C']	= 'tan'
predefinedColorsByHex['008080']	= 'teal'
predefinedColorsByHex['D8BFB8']	= 'thistle'
predefinedColorsByHex['FF6347']	= 'tomato'
predefinedColorsByHex['40E0D0']	= 'turquoise'
predefinedColorsByHex['EE82EE']	= 'violet'
predefinedColorsByHex['F5DEB3']	= 'wheat'
predefinedColorsByHex['FFFFFF']	= 'white'
predefinedColorsByHex['F5F5F5']	= 'whitesmoke'
predefinedColorsByHex['FFFF00']	= 'yellow'
predefinedColorsByHex['9ACD32']	= 'yellowgreen'


// Array of hexcolors, indexed by web color.  To access a hexcolor or namecolor, use the functions above.

var predefinedColorsByName = new Array()
predefinedColorsByName['aliceblue']				= 'F0F8FF'
predefinedColorsByName['antiquewhite']			= 'FAEBD7'
predefinedColorsByName['aqua']					= '00FFFF'
predefinedColorsByName['aquamarine']			= '7FFFD4'
predefinedColorsByName['azure']					= 'F0FFFF'
predefinedColorsByName['beige']					= 'F5F5DC'
predefinedColorsByName['black']					= '000000'
predefinedColorsByName['blanchedalmond']		= 'FFEBCD'
predefinedColorsByName['blue']					= '0000FF'
predefinedColorsByName['blueviolet']			= '8A2BE2'
predefinedColorsByName['brown']					= 'A52A2A'
predefinedColorsByName['burlywood']				= 'DEB887'
predefinedColorsByName['cadetblue']				= '5F9EA0'
predefinedColorsByName['chartreuse']			= '7FFF00'
predefinedColorsByName['chocolate']				= 'D2691E'
predefinedColorsByName['coral']					= 'FF7F50'
predefinedColorsByName['cornflowerblue']		= '6495ED'
predefinedColorsByName['cornsilk']				= 'FFF8DC'
predefinedColorsByName['crimson']				= 'DC143C'
predefinedColorsByName['cyan']					= '00FFFF'
predefinedColorsByName['darkblue']				= '00008B'
predefinedColorsByName['darkcyan']				= '008B8B'
predefinedColorsByName['darkgoldenrod']			= 'B8860B'
predefinedColorsByName['darkgray']				= 'A9A9A9'
predefinedColorsByName['darkgreen']				= '006400'
predefinedColorsByName['darkkhaki']				= 'BDB76B'
predefinedColorsByName['darkmagenta']			= '8B008B'
predefinedColorsByName['darkolivegreen']		= '556B2F'
predefinedColorsByName['darkorange']			= 'FF8C00'
predefinedColorsByName['darkorchid']			= '9932CC'
predefinedColorsByName['darkred']				= '8B0000'
predefinedColorsByName['darksalmon']			= 'E9967A'
predefinedColorsByName['darkseagreen']			= '8FBC8F'
predefinedColorsByName['darkslateblue']			= '483D8B'
predefinedColorsByName['darkslategray']			= '2F4F4F'
predefinedColorsByName['darkturquoise']			= '00CED1'
predefinedColorsByName['darkviolet']			= '9400D3'
predefinedColorsByName['deeppink']				= 'FF1493'
predefinedColorsByName['deepskyblue']			= '00BFFF'
predefinedColorsByName['dimgray']				= '696969'
predefinedColorsByName['dodgerblue']			= '1E90FF'
predefinedColorsByName['firebrick']				= 'B22222'
predefinedColorsByName['floralwhite']			= 'FFFAF0'
predefinedColorsByName['forestgreen']			= '228B22'
predefinedColorsByName['fuchsia']				= 'FF00FF'
predefinedColorsByName['gainsboro']				= 'DCDCDC'
predefinedColorsByName['ghostwhite']			= 'F8F8FF'
predefinedColorsByName['gold']					= 'FFD700'
predefinedColorsByName['goldenrod']				= 'DAA520'
predefinedColorsByName['gray']					= '808080'
predefinedColorsByName['green']					= '008000'
predefinedColorsByName['greenyellow']			= 'ADFF2F'
predefinedColorsByName['honeydew']				= 'F0FFF0'
predefinedColorsByName['hotpink']				= 'FF69B4'
predefinedColorsByName['indianred']				= 'CD5C5C'
predefinedColorsByName['indigo']				= '4B0082'
predefinedColorsByName['ivory']					= 'FFFFF0'
predefinedColorsByName['khaki']					= 'F0E68C'
predefinedColorsByName['lavender']				= 'E6E6FA'
predefinedColorsByName['lavenderblush']			= 'FFF0F5'
predefinedColorsByName['lawngreen']				= '7CFC00'
predefinedColorsByName['lemonchiffon']			= 'FFFACD'
predefinedColorsByName['lightblue']				= 'ADD8E6'
predefinedColorsByName['lightcoral']			= 'F08080'
predefinedColorsByName['lightcyan']				= 'E0FFFF'
predefinedColorsByName['lightgoldenrodyellow']	= 'FAFAD2'
predefinedColorsByName['lightgreen']			= '90EE90'
predefinedColorsByName['lightgrey']				= 'D3D3D3'
predefinedColorsByName['lightpink']				= 'FFB6C1'
predefinedColorsByName['lightsalmon']			= 'FFA07A'
predefinedColorsByName['lightseagreen']			= '20B2AA'
predefinedColorsByName['lightskyblue']			= '87CEFA'
predefinedColorsByName['lightslategray']		= '778899'
predefinedColorsByName['lightsteelblue']		= 'B0C4DE'
predefinedColorsByName['lightyellow']			= 'FFFFE0'
predefinedColorsByName['lime']					= '00FF00'
predefinedColorsByName['limegreen']				= '32CD32'
predefinedColorsByName['linen']					= 'FAF0E6'
predefinedColorsByName['magenta']				= 'FF00FF'
predefinedColorsByName['maroon']				= '800000'
predefinedColorsByName['mediumaquamarine']		= '66CDAA'
predefinedColorsByName['mediumblue']			= '0000CD'
predefinedColorsByName['mediumorchid']			= 'BA55D3'
predefinedColorsByName['mediumpurple']			= '9370DB'
predefinedColorsByName['mediumseagreen']		= '3CB371'
predefinedColorsByName['mediumslateblue']		= '7B68EE'
predefinedColorsByName['mediumspringgreen']		= '00FA9A'
predefinedColorsByName['mediumturquoise']		= '48D1CC'
predefinedColorsByName['mediumvioletred']		= 'C71585'
predefinedColorsByName['midnightblue']			= '191970'
predefinedColorsByName['mintcream']				= 'F5FFFA'
predefinedColorsByName['mistyrose']				= 'FFE4E1'
predefinedColorsByName['moccasin']				= 'FFE4B5'
predefinedColorsByName['navajowhite']			= 'FFDEAD'
predefinedColorsByName['navy']					= '000080'
predefinedColorsByName['oldlace']				= 'FDF5E6'
predefinedColorsByName['olive']					= '808000'
predefinedColorsByName['olivedrab']				= '6B8E23'
predefinedColorsByName['orange']				= 'FFA500'
predefinedColorsByName['orangered']				= 'FF4500'
predefinedColorsByName['orchid']				= 'DA70D6'
predefinedColorsByName['palegoldenrod']			= 'EEE8AA'
predefinedColorsByName['palegreen']				= '98FB98'
predefinedColorsByName['paleturquoise']			= 'AFEEEE'
predefinedColorsByName['palevioletred']			= 'DB7093'
predefinedColorsByName['papayawhip']			= 'FFEFD5'
predefinedColorsByName['peachpuff']				= 'FFDAB9'
predefinedColorsByName['peru']					= 'CD853F'
predefinedColorsByName['pink']					= 'FFC0CB'
predefinedColorsByName['plum']					= 'DDA0DD'
predefinedColorsByName['powderblue']			= 'B0E0E6'
predefinedColorsByName['purple']				= '800080'
predefinedColorsByName['red']					= 'FF0000'
predefinedColorsByName['rosybrown']				= 'BC8F8F'
predefinedColorsByName['royalblue']				= '4169E1'
predefinedColorsByName['saddlebrown']			= '8B4513'
predefinedColorsByName['salmon']				= 'FA8072'
predefinedColorsByName['sandybrown']			= 'F4A460'
predefinedColorsByName['seagreen']				= '2E8B57'
predefinedColorsByName['seashell']				= 'FFF5EE'
predefinedColorsByName['sienna']				= 'A0522D'
predefinedColorsByName['silver']				= 'C0C0C0'
predefinedColorsByName['skyblue']				= '87CEEB'
predefinedColorsByName['slateblue']				= '6A5ACD'
predefinedColorsByName['slategray']				= '708090'
predefinedColorsByName['snow']					= 'FFFAFA'
predefinedColorsByName['springgreen']			= '00FF7F'
predefinedColorsByName['steelblue']				= '4682B4'
predefinedColorsByName['tan']					= 'D2B48C'
predefinedColorsByName['teal']					= '008080'
predefinedColorsByName['thistle']				= 'D8BFB8'
predefinedColorsByName['tomato']				= 'FF6347'
predefinedColorsByName['turquoise']				= '40E0D0'
predefinedColorsByName['violet']				= 'EE82EE'
predefinedColorsByName['wheat']					= 'F5DEB3'
predefinedColorsByName['white']					= 'FFFFFF'
predefinedColorsByName['whitesmoke']			= 'F5F5F5'
predefinedColorsByName['yellow']				= 'FFFF00'
predefinedColorsByName['yellowgreen']			= '9ACD32'

// Array of webcolor name.  In order of Hue.

var predefinedWebColors = new Array()
predefinedWebColors[0]	= 'black'
predefinedWebColors[1]	= 'navy'
predefinedWebColors[2]	= 'darkblue'
predefinedWebColors[3]	= 'mediumblue'
predefinedWebColors[4]	= 'blue'
predefinedWebColors[5]	= 'darkgreen'
predefinedWebColors[6]	= 'green'
predefinedWebColors[7]	= 'teal'
predefinedWebColors[8]	= 'darkcyan'
predefinedWebColors[9]	= 'deepskyblue'
predefinedWebColors[10]	= 'darkturquoise'
predefinedWebColors[11]	= 'mediumspringgreen'
predefinedWebColors[12]	= 'lime'
predefinedWebColors[13]	= 'springgreen'
predefinedWebColors[14]	= 'cyan'
predefinedWebColors[15]	= 'aqua'
predefinedWebColors[16]	= 'midnightblue'
predefinedWebColors[17]	= 'dodgerblue'
predefinedWebColors[18]	= 'lightseagreen'
predefinedWebColors[19]	= 'forestgreen'
predefinedWebColors[20]	= 'seagreen'
predefinedWebColors[21]	= 'darkslategray'
predefinedWebColors[22]	= 'limegreen'
predefinedWebColors[23]	= 'mediumseagreen'
predefinedWebColors[24]	= 'turquoise'
predefinedWebColors[25]	= 'royalblue'
predefinedWebColors[26]	= 'steelblue'
predefinedWebColors[27]	= 'darkslateblue'
predefinedWebColors[28]	= 'mediumturquoise'
predefinedWebColors[29]	= 'indigo'
predefinedWebColors[30]	= 'darkolivegreen'
predefinedWebColors[31]	= 'cadetblue'
predefinedWebColors[32]	= 'cornflowerblue'
predefinedWebColors[33]	= 'mediumaquamarine'
predefinedWebColors[34]	= 'dimgray'
predefinedWebColors[35]	= 'slateblue'
predefinedWebColors[36]	= 'olivedrab'
predefinedWebColors[37]	= 'slategray'
predefinedWebColors[38]	= 'lightslategray'
predefinedWebColors[39]	= 'mediumslateblue'
predefinedWebColors[40]	= 'lawngreen'
predefinedWebColors[41]	= 'aquamarine'
predefinedWebColors[42]	= 'chartreuse'
predefinedWebColors[43]	= 'maroon'
predefinedWebColors[44]	= 'purple'
predefinedWebColors[45]	= 'olive'
predefinedWebColors[46]	= 'gray'
predefinedWebColors[47]	= 'skyblue'
predefinedWebColors[48]	= 'lightskyblue'
predefinedWebColors[49]	= 'blueviolet'
predefinedWebColors[50]	= 'darkred'
predefinedWebColors[51]	= 'darkmagenta'
predefinedWebColors[52]	= 'saddlebrown'
predefinedWebColors[53]	= 'darkseagreen'
predefinedWebColors[54]	= 'lightgreen'
predefinedWebColors[55]	= 'mediumpurple'
predefinedWebColors[56]	= 'darkviolet'
predefinedWebColors[57]	= 'palegreen'
predefinedWebColors[58]	= 'darkorchid'
predefinedWebColors[59]	= 'yellowgreen'
predefinedWebColors[60]	= 'sienna'
predefinedWebColors[61]	= 'brown'
predefinedWebColors[62]	= 'darkgray'
predefinedWebColors[63]	= 'greenyellow'
predefinedWebColors[64]	= 'lightblue'
predefinedWebColors[65]	= 'paleturquoise'
predefinedWebColors[66]	= 'lightsteelblue'
predefinedWebColors[67]	= 'powderblue'
predefinedWebColors[68]	= 'firebrick'
predefinedWebColors[69]	= 'darkgoldenrod'
predefinedWebColors[70]	= 'mediumorchid'
predefinedWebColors[71]	= 'rosybrown'
predefinedWebColors[72]	= 'darkkhaki'
predefinedWebColors[73]	= 'silver'
predefinedWebColors[74]	= 'mediumvioletred'
predefinedWebColors[75]	= 'indianred'
predefinedWebColors[76]	= 'peru'
predefinedWebColors[77]	= 'chocolate'
predefinedWebColors[78]	= 'tan'
predefinedWebColors[79]	= 'lightgrey'
predefinedWebColors[80]	= 'thistle'
predefinedWebColors[81]	= 'orchid'
predefinedWebColors[82]	= 'goldenrod'
predefinedWebColors[83]	= 'palevioletred'
predefinedWebColors[84]	= 'crimson'
predefinedWebColors[85]	= 'gainsboro'
predefinedWebColors[86]	= 'plum'
predefinedWebColors[87]	= 'burlywood'
predefinedWebColors[88]	= 'lightcyan'
predefinedWebColors[89]	= 'lavender'
predefinedWebColors[90]	= 'darksalmon'
predefinedWebColors[91]	= 'violet'
predefinedWebColors[92]	= 'palegoldenrod'
predefinedWebColors[93]	= 'lightcoral'
predefinedWebColors[94]	= 'khaki'
predefinedWebColors[95]	= 'aliceblue'
predefinedWebColors[96]	= 'honeydew'
predefinedWebColors[97]	= 'azure'
predefinedWebColors[98]	= 'sandybrown'
predefinedWebColors[99]	= 'wheat'
predefinedWebColors[100]	= 'beige'
predefinedWebColors[101]	= 'whitesmoke'
predefinedWebColors[102]	= 'mintcream'
predefinedWebColors[103]	= 'ghostwhite'
predefinedWebColors[104]	= 'salmon'
predefinedWebColors[105]	= 'antiquewhite'
predefinedWebColors[106]	= 'linen'
predefinedWebColors[107]	= 'lightgoldenrodyellow'
predefinedWebColors[108]	= 'oldlace'
predefinedWebColors[109]	= 'red'
predefinedWebColors[110]	= 'magenta'
predefinedWebColors[111]	= 'fuchsia'
predefinedWebColors[112]	= 'deeppink'
predefinedWebColors[113]	= 'orangered'
predefinedWebColors[114]	= 'tomato'
predefinedWebColors[115]	= 'hotpink'
predefinedWebColors[116]	= 'coral'
predefinedWebColors[117]	= 'darkorange'
predefinedWebColors[118]	= 'lightsalmon'
predefinedWebColors[119]	= 'orange'
predefinedWebColors[120]	= 'lightpink'
predefinedWebColors[121]	= 'pink'
predefinedWebColors[122]	= 'gold'
predefinedWebColors[123]	= 'peachpuff'
predefinedWebColors[124]	= 'navajowhite'
predefinedWebColors[125]	= 'moccasin'
predefinedWebColors[126]	= 'mistyrose'
predefinedWebColors[127]	= 'blanchedalmond'
predefinedWebColors[128]	= 'papayawhip'
predefinedWebColors[129]	= 'lavenderblush'
predefinedWebColors[130]	= 'seashell'
predefinedWebColors[131]	= 'cornsilk'
predefinedWebColors[132]	= 'lemonchiffon'
predefinedWebColors[133]	= 'floralwhite'
predefinedWebColors[134]	= 'snow'
predefinedWebColors[135]	= 'yellow'
predefinedWebColors[136]	= 'lightyellow'
predefinedWebColors[137]	= 'ivory'
predefinedWebColors[138]	= 'white'
