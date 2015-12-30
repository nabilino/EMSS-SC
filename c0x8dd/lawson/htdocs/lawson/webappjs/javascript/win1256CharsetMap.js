/* $Header: /cvs/cvs_archive/applications/webtier/webappjs/javascript/Attic/win1256CharsetMap.js,v 1.1.4.3.2.2 2014/01/10 14:29:59 brentd Exp $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@@PRODNUM@.@BUILDNUM@ */
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
//*   (c) COPYRIGHT 2014 INFOR.  ALL RIGHTS RESERVED.           *
//*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
//*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
//*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL               *
//*   RIGHTS RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE  *
//*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
//*                                                             *
//***************************************************************
//
// NOTE: This file should be used only for windows-1256 encoding and must be saved in
// windows-1256 or utf-8 format!!
// 
var win_1256_encoding = 
{
	"€" : "80", "پ" : "81", "‚" : "82", "ƒ" : "83", "„" : "84", "…" : "85", "†" : "86", "‡" : "87", "ˆ" : "88", "‰" : "89", "ٹ" : "8A", "‹" : "8B", "Œ" : "8C", "چ" : "8D", "ژ" : "8E", "ڈ" : "8F",
	"گ" : "90", "‘" : "91", "’" : "92", "“" : "93", "”" : "94", "•" : "95", "–" : "96", "—" : "97", "ک" : "98", "™" : "99", "ڑ" : "9A", "›" : "9B", "œ" : "9C", "ں" : "9F",
	"،" : "A1", "¢" : "A2", "£" : "A3", "¤" : "A4", "¥" : "A5", "¦" : "A6", "§" : "A7", "¨" : "A8", "©" : "A9", "ھ" : "AA", "«" : "AB", "¬" : "AC", "®" : "AE", "¯" : "AF",
	"°" : "B0", "±" : "B1", "²" : "B2", "³" : "B3", "´" : "B4", "µ" : "B5", "¶" : "B6", "•" : "B7", "¸" : "B8", "¹" : "B9", "؛" : "BA", "»" : "BB", "¼" : "BC", "½" : "BD", "¾" : "BE", "؟" : "BF",
	"ہ" : "C0", "ء" : "C1", "آ" : "C2", "أ" : "C3", "ؤ" : "C4", "إ" : "C5", "ئ" : "C6", "ا" : "C7", "ب" : "C8", "ة" : "C9", "ت" : "CA", "ث" : "CB", "ج" : "CC", "ح" : "CD", "خ" : "CE", "د" : "CF",
	"ذ" : "D0", "ر" : "D1", "ز" : "D2", "س" : "D3", "ش" : "D4", "ص" : "D5", "ض" : "D6", "×" : "D7", "ط" : "D8", "ظ" : "D9", "ع" : "DA", "غ" : "DB", "ـ" : "DC", "ف" : "DD", "ق" : "DE", "ك" : "DF",
	"à" : "E0", "ل" : "E1", "â" : "E2", "م" : "E3", "ن" : "E4", "ه" : "E5", "و" : "E6", "ç" : "E7", "è" : "E8", "é" : "E9", "ê" : "EA", "ë" : "EB", "ى" : "EC", "ي" : "ED", "î" : "EE", "ï" : "EF",
	"ً"  : "F0", "ٌ"  : "F1", "ٍ"  : "F2", "َ"  : "F3", "ô" : "F4", "ُ"  : "F5", "ِ"  : "F6", "÷" : "F7", "ّ"  : "F8", "ù" : "F9", "ْ"  : "FA", "û" : "FB", "ü" : "FC", "ے" : "FF"  
};

function escapeWithCharset(str, charset) 
{
	var result = "";
	for (var i=0, len=str.length; i<len; i++)
	{
		var char = str.charAt(i);
		if (str.charCodeAt(i) < 128) 
		{
			result += escape(char).replace(/\+/g, "%2B");
		} 
		else if (charset[char]) 
		{
			result += "%" + charset[char];
		} 
		else 
		{
			// drop undefined chars
		}
	} 
	return result;
};

window.escapeForCharset = function(str)
{
	return escapeWithCharset(str, win_1256_encoding); 
};
