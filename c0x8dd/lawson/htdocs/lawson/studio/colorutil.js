/* $Header: /cvs/cvs_archive/LawsonPlatform/toolkit/studio/colorutil.js,v 1.6.34.2 2012/08/08 12:48:51 jomeli Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
// colorutil.js
//-----------------------------------------------------------------------------
//		***************************************************************
//		*                                                             *
//		*                           NOTICE                            *
//		*                                                             *
//		*   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
//		*   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS              *
//		*   AFFILIATES OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED     *
//		*   WITHOUT PRIOR WRITTEN PERMISSION. LICENSED CUSTOMERS MAY  *
//		*   COPY AND ADAPT THIS SOFTWARE FOR THEIR OWN USE IN         *
//		*   ACCORDANCE WITH THE TERMS OF THEIR SOFTWARE LICENSE       *
//		*   AGREEMENT. ALL OTHER RIGHTS RESERVED.                     *
//		*                                                             *
//		*   (c) COPYRIGHT 2012 INFOR.  ALL RIGHTS RESERVED.           *
//		*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//		*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//		*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//		*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//		*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//		*                                                             *
//		***************************************************************
//-----------------------------------------------------------------------------
//	Color utility functions
//-----------------------------------------------------------------------------

// DecValue converts a hexadecimal number (00 to FF) to a decimal number (0 to 255)
// the argument 'n' is the hexadecimal number to convert
function DecValue(n)
{
	return parseInt(n, 16);
}

//-----------------------------------------------------------------------------
// FontBright returns the forground color (white or black) for a given background 
// color the argument 'c' is a six digit hexadecimal number (000000 to FFFFFF)
function FontBright(c)
{
	return (Luminosity(c) >= 128) ? '000000' : 'FFFFFF';
}

//-----------------------------------------------------------------------------
// GetPCD returns a hash of all of the predefined colors in Netscape and 
// Internet Explorer indexed by their hexadecimal value
function GetPDC()
{
	var PDC = new Array();
	PDC['F0F8FF']	= 'aliceblue';
	PDC['FAEBD7']	= 'antiquewhite';
	PDC['00FFFF']	= 'aqua';
	PDC['7FFFD4']	= 'aquamarine';
	PDC['F0FFFF']	= 'azure';
	PDC['F5F5DC']	= 'beige';
	PDC['000000']	= 'black';
	PDC['FFEBCD']	= 'blanchedalmond';
	PDC['0000FF']	= 'blue';
	PDC['8A2BE2']	= 'blueviolet';
	PDC['A52A2A']	= 'brown';
	PDC['DEB887']	= 'burlywood';
	PDC['5F9EA0']	= 'cadetblue';
	PDC['7FFF00']	= 'chartreuse';
	PDC['D2691E']	= 'chocolate';
	PDC['FF7F50']	= 'coral';
	PDC['6495ED']	= 'cornflowerblue';
	PDC['FFF8DC']	= 'cornsilk';
	PDC['DC143C']	= 'crimson';
	PDC['00FFFF']	= 'cyan';
	PDC['00008B']	= 'darkblue';
	PDC['008B8B']	= 'darkcyan';
	PDC['B8860B']	= 'darkgoldenrod';
	PDC['A9A9A9']	= 'darkgray';
	PDC['006400']	= 'darkgreen';
	PDC['BDB76B']	= 'darkkhaki';
	PDC['8B008B']	= 'darkmagenta';
	PDC['556B2F']	= 'darkolivegreen';
	PDC['FF8C00']	= 'darkorange';
	PDC['9932CC']	= 'darkorchid';
	PDC['8B0000']	= 'darkred';
	PDC['E9967A']	= 'darksalmon';
	PDC['8FBC8F']	= 'darkseagreen';
	PDC['483D8B']	= 'darkslateblue';
	PDC['2F4F4F']	= 'darkslategray';
	PDC['00CED1']	= 'darkturquoise';
	PDC['9400D3']	= 'darkviolet';
	PDC['FF1493']	= 'deeppink';
	PDC['00BFFF']	= 'deepskyblue';
	PDC['696969']	= 'dimgray';
	PDC['1E90FF']	= 'dodgerblue';
	PDC['B22222']	= 'firebrick';
	PDC['FFFAF0']	= 'floralwhite';
	PDC['228B22']	= 'forestgreen';
	PDC['FF00FF']	= 'fuchsia';
	PDC['DCDCDC']	= 'gainsboro';
	PDC['F8F8FF']	= 'ghostwhite';
	PDC['FFD700']	= 'gold';
	PDC['DAA520']	= 'goldenrod';
	PDC['808080']	= 'gray';
	PDC['008000']	= 'green';
	PDC['ADFF2F']	= 'greenyellow';
	PDC['F0FFF0']	= 'honeydew';
	PDC['FF69B4']	= 'hotpink';
	PDC['CD5C5C']	= 'indianred';
	PDC['4B0082']	= 'indigo';
	PDC['FFFFF0']	= 'ivory';
	PDC['F0E68C']	= 'khaki';
	PDC['E6E6FA']	= 'lavender';
	PDC['FFF0F5']	= 'lavenderblush';
	PDC['7CFC00']	= 'lawngreen';
	PDC['FFFACD']	= 'lemonchiffon';
	PDC['ADD8E6']	= 'lightblue';
	PDC['F08080']	= 'lightcoral';
	PDC['E0FFFF']	= 'lightcyan';
	PDC['FAFAD2']	= 'lightgoldenrodyellow';
	PDC['90EE90']	= 'lightgreen';
	PDC['D3D3D3']	= 'lightgrey';
	PDC['FFB6C1']	= 'lightpink';
	PDC['FFA07A']	= 'lightsalmon';
	PDC['20B2AA']	= 'lightseagreen';
	PDC['87CEFA']	= 'lightskyblue';
	PDC['778899']	= 'lightslategray';
	PDC['B0C4DE']	= 'lightsteelblue';
	PDC['FFFFE0']	= 'lightyellow';
	PDC['00FF00']	= 'lime';
	PDC['32CD32']	= 'limegreen';
	PDC['FAF0E6']	= 'linen';
	PDC['FF00FF']	= 'magenta';
	PDC['800000']	= 'maroon';
	PDC['66CDAA']	= 'mediumauqamarine';
	PDC['0000CD']	= 'mediumblue';
	PDC['BA55D3']	= 'mediumorchid';
	PDC['9370DB']	= 'mediumpurple';
	PDC['3CB371']	= 'mediumseagreen';
	PDC['7B68EE']	= 'mediumslateblue';
	PDC['00FA9A']	= 'mediumspringreen';
	PDC['48D1CC']	= 'mediumturquoise';
	PDC['C71585']	= 'mediumvioletred';
	PDC['191970']	= 'midnightblue';
	PDC['F5FFFA']	= 'mintcream';
	PDC['FFE4E1']	= 'mistyrose';
	PDC['FFE4B5']	= 'moccasin';
	PDC['FFDEAD']	= 'navajowhite';
	PDC['000080']	= 'navy';
	PDC['FDF5E6']	= 'oldlace';
	PDC['808000']	= 'olive';
	PDC['6B8E23']	= 'olivedrab';
	PDC['FFA500']	= 'orange';
	PDC['FF4500']	= 'orangered';
	PDC['DA70D6']	= 'orchid';
	PDC['EEE8AA']	= 'palegoldenrod';
	PDC['98FB98']	= 'palegreen';
	PDC['AFEEEE']	= 'paleturquoise';
	PDC['DB7093']	= 'palevioletred';
	PDC['FFEFD5']	= 'papayawhip';
	PDC['FFDAB9']	= 'peachpuff';
	PDC['CD853F']	= 'peru';
	PDC['FFC0CB']	= 'pink';
	PDC['DDA0DD']	= 'plum';
	PDC['B0E0E6']	= 'powderblue';
	PDC['800080']	= 'purple';
	PDC['FF0000']	= 'red';
	PDC['BC8F8F']	= 'rosybrown';
	PDC['4169E1']	= 'royalblue';
	PDC['8B4513']	= 'saddlebrown';
	PDC['FA8072']	= 'salmon';
	PDC['F4A460']	= 'sandybrown';
	PDC['2E8B57']	= 'seagreen';
	PDC['FFF5EE']	= 'seashell';
	PDC['A0522D']	= 'sienna';
	PDC['C0C0C0']	= 'silver';
	PDC['87CEEB']	= 'skyblue';
	PDC['6A5ACD']	= 'slateblue';
	PDC['708090']	= 'slategray';
	PDC['FFFAFA']	= 'snow';
	PDC['00FF7F']	= 'springgreen';
	PDC['4682B4']	= 'steelblue';
	PDC['D2B48C']	= 'tan';
	PDC['008080']	= 'teal';
	PDC['D8BFB8']	= 'thistle';
	PDC['FF6347']	= 'tomato';
	PDC['40E0D0']	= 'turquoise';
	PDC['EE82EE']	= 'violet';
	PDC['F5DEB3']	= 'wheat';
	PDC['FFFFFF']	= 'white';
	PDC['F5F5F5']	= 'whitesmoke';
	PDC['FFFF00']	= 'yellow';
	PDC['9ACD32']	= 'yellowgreen';
	return PDC;
}

//-----------------------------------------------------------------------------
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

//-----------------------------------------------------------------------------
// HexValue converts a decimal number (0 to 255) to a hexadecimal number
// (00 to FF) the argument 'n' is the decimal number to convert
function HexValue(n)
{
	return '0123456789ABCDEF'.charAt((n>>4)&0xf) + '0123456789ABCDEF'.charAt(n&0xf);
}

//-----------------------------------------------------------------------------
// IsDec returns true if the number passed it is a valid RGB color otherwise it
// returns false. The argument 'n' is the decimal number to check
function IsGoodDec(n)
{
	return (n.match(/\b[0-9]+\b/) 
		&& (parseInt(n) < 256 
		&& parseInt(n) > -1)) ? true : false;
}

//-----------------------------------------------------------------------------
// IsDec returns true if the number passed it is a valid RGB color otherwise it
// returns false. The argument 'n' is the decimal number to check
function IsGoodHex(n)
{
	return (n.match(/\b[A-Fa-f0-9]+\b/) 
		&& n.length == 2 
		&& (DecValue(n) < 256 && DecValue(n) > -1)) ? true : false;
}

//-----------------------------------------------------------------------------
function IsValidHex(n)
{
	return (n.match(/\b[A-Fa-f0-9]+\b/) && n.length == 6) ? true : false;
}

//-----------------------------------------------------------------------------
// Luminosity returns the luminosity of a color
// the argument 'c' is a six digit hexadecimal number (000000 to FFFFFF)
function Luminosity(c)
{
	var r = DecValue(c.substr(0,2));
	var g = DecValue(c.substr(2,2));
	var b = DecValue(c.substr(4,2));
	return 0.212671 * r + 0.715160 * g + 0.072169 * b;
}

//-----------------------------------------------------------------------------
function getWebColorHexValue(theWebColorName)
{
	if (typeof(predefinedColorsByName[theWebColorName.toLowerCase()]) != 'undefined')
		return predefinedColorsByName[theWebColorName.toLowerCase()].toLowerCase();
	else
		return null;
}
