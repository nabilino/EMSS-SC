/* $Header: /cvs/cvs_archive/LawsonPlatform/ui/portal/forms/collections.js,v 1.45.2.7.4.15.6.12.2.8 2012/08/08 12:37:26 jomeli Exp $NoKeywords: $ */
/* $NoKeywords: $ */
/* LaVersion=8-)@(#)@9.0.1.11.231 2012-09-05 04:00:00 */
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

function LawKeyColl(portalWnd,wnd)
{
	this.portalWnd=portalWnd;
	this.formWnd=wnd;
	this.token=this.formWnd.strTKN;
	this.performKeyCheck=(this.portalWnd.oPortalConfig.getSetting("perform_key_check","1") == "1" 
		? true : false);
	this.state=null;
	this.keyBuffer=null;
	this.useSuperKey=false;
	this.lawKeys=new Array();
	this.tranKeys=new Array();
	this.keyIndex=new Object();
	this.fldIndex=new Object();
	this.superKeyIndex=new Object();	
}
LawKeyColl.prototype.addItem=function(keyNbr,fieldId,detail,occur,superKey,nm,ed,decsz,nokimp,altref)
{
	var index;
	var i=this.lawKeys.length;
	var keyItem;
	
	detail=(typeof(detail)=="undefined" ? "" : detail);
	occur=(typeof(occur)=="undefined" ? "" : occur);
	superKey=(typeof(superKey)=="undefined" ? "" : superKey);
	nm=(typeof(ed)=="undefined" ? "" : nm);
	ed=(typeof(ed)=="undefined" ? "" : ed);
	decsz=(typeof(ed)=="undefined" ? "" : decsz);
	nokimp=(typeof(nokimp)=="undefined" || nokimp=="" ? false : true);
	altref=(typeof(altref)=="undefined" || altref=="" ? false : true);

	if(superKey.indexOf(" ")==2)
		superKey=superKey.substr(0,2);

	if(keyNbr.indexOf(" ")==2)
		keyNbr=keyNbr.substr(0,2);		
		
	keyItem=new Object();
	keyItem.keyNbr=keyNbr;
	keyItem.fldNbr=fieldId;
	keyItem.nm=nm;
	keyItem.ed=ed;
	keyItem.decsz=decsz;
	keyItem.detail=detail;
	keyItem.occur=occur;
	keyItem.superKey=superKey;
	keyItem.noKeyImp=nokimp;
	keyItem.priority=1;
	keyItem.define=false;
	keyItem.bMoving=false;
	keyItem.altref=altref;
	keyItem.value="";
	keyItem.secured="";  //empty string indicates data is not secured
	
	this.lawKeys[i]=keyItem;
	
	//mount item to key index
	if(keyNbr in this.keyIndex)
		index=this.keyIndex[keyNbr];
	else
	{
		index=new Array();
		this.keyIndex[keyNbr]=index;
	}
	index[index.length]=i;
	//mount item to field index
	if(fieldId in this.fldIndex)
		index=this.fldIndex[fieldId];
	else
	{
		index=new Array();
		this.fldIndex[fieldId]=index;
	}
	index[index.length]=i;
	//mount item to superKey index if superkey is not null
	if(superKey!="")
	{
		if(superKey in this.superKeyIndex)
			index=this.superKeyIndex[superKey];
		else
		{
			index=new Array();
			this.superKeyIndex[superKey]=index;
		}
		index[index.length]=i;
	}
}
LawKeyColl.prototype.debug=function()
{
	var keys;
	var keyProp;
	var dbgStr="Key Collection:\n";
	dbgStr+="Total keys: "+this.lawKeys.length+"\n";
	for(var i=0;i<this.lawKeys.length;i++)
	{
		key=this.lawKeys[i];
		for(keyProp in key)
			dbgStr+=keyProp+": '"+key[keyProp]+"' ,";
		dbgStr+="\n";
	}
	prompt("Key Collection:",dbgStr);
}
LawKeyColl.prototype.indexByKey=function(keyId)
{
	var keyReturn=new Array();
	var keyArray;
	var keyIndex;

	keyArray=this.keyIndex[keyId];
	if(typeof(keyArray)=="undefined") return keyReturn;
	for(var i=0;i<keyArray.length;i++)
	{
		keyIndex=keyArray[i];
        key=this.lawKeys[keyIndex];
        key.index=keyIndex;
		keyReturn[keyReturn.length]=key;
	}
	return keyReturn;
}
LawKeyColl.prototype.indexByKeyOccur=function(keyId,occur)
{
	var keyReturn=new Array();
	var keyDetailArray=new Array();
	var keyArray;
	var keyIndex;
	var keyItem;
	
	// sort array so detail keys follow form keys
	keyArray=this.indexByKey(keyId);
	for(var i=keyArray.length-1;i>=0;i--)
	{
		keyItem=keyArray[i];
		if(keyItem.detail!="")
		{
			keyArray.splice(i,1);
			keyDetailArray.splice(0, 0, keyItem);
		}	
	}
	for(var i=0;i<keyDetailArray.length;i++)
	{
		keyItem=keyDetailArray[i];
		keyArray[keyArray.length]=keyItem;
	}
			
	for(var i=0;i<keyArray.length;i++)
	{
		keyItem=keyArray[i];
		if(keyItem.occur==occur || (occur=="" && keyItem.occur=="0"))
			keyReturn[keyReturn.length]=keyItem;
	}
	for(var i=0;i<keyArray.length;i++)
	{
		keyItem=keyArray[i];
		if(keyItem.detail == "")
			continue;
		if(keyItem.detail!=this.state.currentDetailArea)
			keyItem.bMoving = false
	}
	return keyReturn;
}
LawKeyColl.prototype.indexByKeyDetail=function(keyId,detail)
{
	var keyReturn=new Array();
	var keyArray;
	var keyItem;

	keyArray=this.indexByKey(keyId);
	for(var i=0;i<keyArray.length;i++)
	{
		keyItem=keyArray[i];
		if(keyItem.detail==detail)
			keyReturn[keyReturn.length]=keyItem;
	}
	return keyReturn;
}
LawKeyColl.prototype.indexByField=function(fldId)
{
	var keyReturn=this.lawKeys[this.fldIndex[fldId]];
	if(typeof(keyReturn)=="undefined")
		return null;
	return keyReturn;
}
LawKeyColl.prototype.indexBySuper=function(superId)
{
	var keyReturn=new Array();
	var keyArray;
	var keyIndex;
	
	keyArray=this.superKeyIndex[superId];
	if(typeof(keyArray)=="undefined") return keyReturn;
	for(var i=0;i<keyArray.length;i++)
	{
		keyIndex=keyArray[i];
		keyReturn[keyReturn.length]=this.lawKeys[keyIndex];
	}
	return keyReturn;
}
LawKeyColl.prototype.consumeBuffer=function(bPushReturn)
{
	if (!this.portalWnd.lawsonPortal)
		return;

	var keyItem;
	var bufferKey;
	var agsFld;
	var curFld;
	var bDefine;
	var procDetail=false;
	var FCFldNbr=this.formWnd.strRowFCFldNbr;
    var lAdd=this.formWnd.frmElement.getAttribute("ladd");
	var lChg=this.formWnd.frmElement.getAttribute("lchg");
	var fcPairs=this.formWnd.frmElement.getAttribute("pairs");
	var frmFC;
	var FCFld;
    var lineFC="";
    var hkey;
    var detFC, currLineFC; //for forms with multiple LINE-FCs
    
	bPushReturn=(typeof(bPushReturn)=="boolean" ? bPushReturn : false);	
	
	if (this.portalWnd.lawsonPortal.keyBuffer==null)
		return;
	
	
	this.keyBuffer=this.portalWnd.lawsonPortal.keyBuffer;
	if (!this.state)
		this.state=this.keyBuffer.state;
	
	curFld=this.indexByField(this.state.currentField);
	bDefine=this.state.doDefine;
	this.useSuperKey=!bPushReturn;	
	
	if (!FCFldNbr && bPushReturn && this.state.pushFromRow)
	{
		detFC = this.formWnd.lawForm.IEXML.selectNodes("//fld[@detFC = '1']");
		if(detFC && detFC.length > 1)
		{
			currLineFC = this.formWnd.lawForm.IEXML.selectNodes("//fld[@det='" + this.state.currentDetailArea+ "' and @detFC='1']");
			if (currLineFC && currLineFC.length == 1)
			{
				currLineFCFld = currLineFC[0].getAttribute("nbr");
				FCFldNbr = currLineFCFld.replace(/r\d+/, "r" + this.state.currentRow);
			}
		}
	}
	
	if((bPushReturn && this.state.pushFromRow) || (curFld!=null && curFld.detail!=""))
		procDetail=true;

	for (var i=0; i < this.lawKeys.length; i++)
	{
		keyItem=this.lawKeys[i];
		if (!keyItem.noKeyImp || bPushReturn)
		{
			if (!procDetail && keyItem.detail)
				continue;
			bufferKey=this.matchkeyNbr(keyItem);
			if (!bufferKey) continue;

			if (this.performKeyCheck && this.keyMismatch(bufferKey,keyItem))
			{
				var msg=this.formWnd.lawForm.getPhrase("ERR_TRANSFERRING_KEYS","forms") + 
					"\n\nKey: " + keyItem.keyNbr + " Data field: " + keyItem.nm +".\n" + 
					this.formWnd.strTKN + " field (" + keyItem.fldNbr + 
					") defined as edit:'" + keyItem.ed + "' decsz:'" + 
					keyItem.decsz + "'.\n" + (this.keyBuffer.token ? this.keyBuffer.token : "Prior form") + 
					" field (" + bufferKey.fldNbr + ") defined as edit:'" + bufferKey.ed + 
					"' decsz:'"+bufferKey.decsz+"'.\n\n";
				this.portalWnd.cmnDlg.messageBox(msg,"ok","alert",this.formWnd);
				return;
			}
			if (procDetail && keyItem.detail!="")
			{
				if (keyItem.detail==this.state.currentDetailArea)
				{
					this.tranKeys[this.tranKeys.length]=keyItem.fldNbr+"\t'"+keyItem.keyNbr+"'\t'"+bufferKey.value+"'";
					this.formWnd.tranMagic.setElement(keyItem.fldNbr,bufferKey.value,this.state.currentRow);
					this.formWnd.lawForm.setElementValue(keyItem.fldNbr,bufferKey.value,this.state.currentRow);
					
					if (bufferKey.secured.length>0)
					{						
						var oFldNode = this.formWnd.tranMagic.getElementNode(keyItem.fldNbr,this.state.currentRow);
						oFldNode.setAttribute("secured",bufferKey.secured);						
					}
				}
			}
			else
			{
				this.tranKeys[this.tranKeys.length]=keyItem.fldNbr+"\t'"+keyItem.keyNbr+"'\t'"+bufferKey.value+"'";
				this.formWnd.tranMagic.setElement(keyItem.fldNbr,bufferKey.value);
				this.formWnd.lawForm.setElementValue(keyItem.fldNbr,bufferKey.value);

				if (bufferKey.secured.length>0)
				{						
					var oFldNode = this.formWnd.tranMagic.getElementNode(keyItem.fldNbr);
					oFldNode.setAttribute("secured",bufferKey.secured);						
				}				
			}
		}
	}

	if (bPushReturn)
	{	
		FCFld=this.formWnd.lawForm.getElement(FCFldNbr);
		if (FCFld && procDetail)
		{
			keyItem=this.indexByField(FCFldNbr);
			bufferKey=(keyItem ? this.matchkeyNbr(keyItem) : null);
			if (bufferKey==null)
			{
				agsFld=this.formWnd.lawForm.getElementValue(FCFldNbr,this.state.currentRow);
				if (agsFld=="")
				{
                    hkey = this.formWnd.tranMagic.buildHK(false);
                    lineFC = (hkey != this.formWnd.tranMagic.txnHK ? lAdd : lChg);
                    if (lineFC!=null && lineFC!="")
					{
						//Take only the first character of lchg/ladd for lineFC - fix for pT 151961
						if(lineFC.length > 1)
							lineFC = lineFC.substr(0,1);
						if (this.keyBuffer.state.crtio.Request=="MANUALCFKEY"
							|| this.keyBuffer.state.crtio.Request=="EXECCALLER")						
						{
							// get the form fc
							frmFC="I";							
							if(this.state.doPush)
							{
								if (this.keyBuffer.state.crtio.PassXlt!="")
									frmFC=this.keyBuffer.state.crtio.PassXlt;
							}
							if (this.validateFCPairs(lineFC,frmFC,fcPairs))
							{
								this.tranKeys[this.tranKeys.length]=FCFldNbr+"\t'"+
									(keyItem ? keyItem.keyNbr : "")+"'\t'"+lineFC+"'";
								this.formWnd.tranMagic.setElement(FCFldNbr,lineFC,this.state.currentRow);
								this.formWnd.lawForm.setElementValue(FCFldNbr,lineFC,this.state.currentRow);
							}
						}
						else
						{
							this.tranKeys[this.tranKeys.length]=FCFldNbr+"\t'"+
								(keyItem ? keyItem.keyNbr : "")+"'\t'"+lineFC+"'";
							this.formWnd.tranMagic.setElement(FCFldNbr,lineFC,this.state.currentRow);
							this.formWnd.lawForm.setElementValue(FCFldNbr,lineFC,this.state.currentRow);
						}
					}
				}
			}
		}
	}
	this.portalWnd.lawsonPortal.keyBuffer=null;
}
LawKeyColl.prototype.matchkeyNbr=function(key)
{
	var priority;
	var keyMatch;
	var priorityStart = (this.state.doDefine || this.state.selectDetailRow ? 3 : 1);
	
	for (priority=priorityStart; priority >= 0; priority--)
	{
		keyMatch=this.goodKeyField(key,priority,false);
		if (keyMatch!=null)
			return keyMatch;

		if (key.superKey!="" && this.useSuperKey)
		{
			keyMatch=this.goodKeyField(key,priority,true);
			if (keyMatch!=null)
				return keyMatch;
		}
	}
	return null;
}
LawKeyColl.prototype.goodKeyField=function(key,priority,useSuper)
{
	var bufferKeys;
	var bufferKey;
	var keyNum=key.keyNbr;
	var occur;
	var bufferOccur;
	
	if(useSuper)
		keyNum=key.superKey;
	
	occur=(key.occur=="" ? 0 : parseInt(key.occur,10));
	occur=(this.state.doDefine && key.occur == "" ? null : occur);

	if (this.state.pushFromRow && this.state.currentDetailArea.length>0)
		bufferKeys=this.keyBuffer.indexByKeyDetail(keyNum, this.state.currentDetailArea);
	if (!bufferKeys || bufferKeys.length==0)
		bufferKeys=this.keyBuffer.indexByKey(keyNum);

	// Remove keys that are not moving
   	for(var i=bufferKeys.length-1; i>=0; i--)
	{
		bufferKey=bufferKeys[i];
		if(!bufferKey.bMoving)
			bufferKeys.splice(i,1);
	}		

	for(var i=0;i<bufferKeys.length;i++)
	{
		bufferKey=bufferKeys[i];
		bufferOccur=(bufferKey.occur=="" ? 0 : bufferKey.occur);

		if (occur==bufferOccur || occur==null) 
		{
			if(priority==0 || priority==bufferKey.priority)
				return bufferKey;
		}
	}

	if(!this.useSuperKey)
		return null;

	bufferKeys=this.keyBuffer.indexBySuper(keyNum);

    // Remove keys that are not moving
    for(var i=bufferKeys.length-1; i>=0; i--)
    {
	    bufferKey=bufferKeys[i];
	    if(!bufferKey.bMoving)
		    bufferKeys.splice(i,1);
    }		

	for(var i=0;i<bufferKeys.length;i++)
	{
		bufferKey=bufferKeys[i];
		bufferOccur=(bufferKey.occur=="") ? 0 : bufferKey.occur;		
		
		if (occur==bufferOccur || occur==null)
		{
			if(priority==0 || priority==bufferKey.priority)
				return bufferKey;
		}
	}
	return null;
}
LawKeyColl.prototype.validateFCPairs=function(lineFC,formFC,fcPairs)
{
	if(!fcPairs || fcPairs=="")
		return false;

	var fcCom = formFC+lineFC;
	var index = 0;
	var loop = fcPairs.length;
	var fcPair = null;	
		
	do
	{
		fcPair=fcPairs.substr(index,2);
			
		if(fcCom==fcPair)
			return true;
				
		index=index+2;
	}
	while(index<loop)

	return false;
}
LawKeyColl.prototype.buildIdaString=function(fld)
{
	var idaString="";
	var indexKey;	//key number from key index
	var keyObj;
	var closeField;
	var closeValue;
	var ptr;
	var curRow="";
	var re=/\+/g;
	var bNoBlanks = false;
	var fldKey;

	fld=fld.replace(/r\d+/, "r0");
	curRow=this.formWnd.formState.currentRow;
	fldKey = this.indexByField(fld);

	for(indexKey in this.keyIndex)
	{
		keyObj=this.indexByKey(indexKey);
		if (fldKey && this.keyIndex[fldKey.keyNbr][0] == this.keyIndex[keyObj[0].keyNbr][0])
			bNoBlanks = true;
		if(keyObj.length==1)
			closeField=keyObj[0].fldNbr;
		else
			closeField=this.findNearestField(fld,curRow,keyObj);
		if(closeField!="")
		{
			closeValue=this.formWnd.lawForm.getElementValue(closeField,curRow,null,true);
			if(closeValue.length==0 && fld.indexOf("r")!=-1 && closeField.indexOf("r")!=-1)
			{
				closeField=closeField.replace(/r\d+/, ("r"+curRow));
				var defValue = this.formWnd.lawformGetDefaultValue(closeField)
				closeValue=(typeof(defValue)!="undefined")?defValue:closeValue;
			}
			else if (closeValue.length==0) //try to load default value
			{
				var defValue = this.formWnd.lawformGetDefaultValue(closeField);
				closeValue = (typeof(defValue)!="undefined")?defValue:closeValue;
			}
			if ((closeValue && closeValue!="") || !bNoBlanks)
				idaString+="&"+escape(indexKey).replace(re,"%2B")+"="+escape(closeValue).replace(re,"%2B");
		}
	}
	return idaString;
}
LawKeyColl.prototype.findNearestField=function(fld,row,keys)
{
	var proxFld="";
	var fldKey;
	var keyObj;
	var fldNbr;
	var keyNbr;
	var ptr;
	var diff;
	var proximity=2000;

	fldKey=this.indexByField(fld);
	
	if(fldKey || fld.indexOf("r")!=-1)
	{
		ptr=fldKey?fldKey.occur:"0";
		for(var i=0;i<keys.length;i++)
		{
			keyObj=keys[i];
			if(keyObj.occur==ptr)
			{
				if(proxFld=="")
					proxFld=keyObj.fldNbr;
				else
				{
					proxFld="";
					break;
				}
			}
		}
	}

	if(proxFld=="")
	{
		fldNbr=parseInt(fld.substr(2));
		for(var i=0;i<keys.length;i++)
		{
			keyObj=keys[i];
			keyNbr=keyObj.fldNbr;
			ptr=keyNbr.indexOf("r");
			if(ptr==-1)
				ptr=keyNbr.length;
			keyNbr=parseInt(keyNbr.substr(2,ptr));
			diff=Math.abs(fldNbr-keyNbr);
			if(diff<proximity)
			{
				proximity=diff;
				proxFld=keyObj.fldNbr;
			}
			else if(diff==proximity && keyNbr>fldNbr)
				proxFld=keyObj.fldNbr;
		}
	}
	proxFld=proxFld.replace("r0","r"+row);
	return proxFld;
}
LawKeyColl.prototype.buildKeyBuffer=function()
{
	var keyItem;
	var fldId;
	var keyValue;	
	
	this.state=this.formWnd.formState;
	
	if (!this.portalWnd.lawsonPortal) return;
	if (!this.formWnd.tranMagic) return;
	
	var selectedRow=this.SelectDetailRow();
	var currentRow=(!this.state.pushFromRow && this.state.selectDetailRow) ? selectedRow : this.state.currentRow;
	var bIncludeDetail=this.state.pushFromRow || this.state.selectDetailRow;	
	var bApplyDefaultValue=((this.state.doDefine || this.state.pushFromRow)
		&& this.state.currentField.indexOf("r")!=-1 
		&& this.formWnd.strRowFCFldNbr!="" 
		&& this.formWnd.lawForm.getElementValue(this.formWnd.strRowFCFldNbr,currentRow)=="")
		? true : false;
	
	for(var i=0;i<this.lawKeys.length;i++)
	{
		keyItem=this.lawKeys[i];

		var fldNbr=keyItem.fldNbr.replace(/r\d+/, "r"+ currentRow);
		var elem=this.formWnd.tranMagic.getElementNode(fldNbr);
		keyItem.secured=(elem && elem.getAttribute("secured") ? elem.getAttribute("secured") : "");
		keyItem.bMoving=false;
		keyItem.define=false;
		keyItem.priority=1;

		if(keyItem.detail=="")
		{
			keyItem.value=this.formWnd.tranMagic.getElement(keyItem.fldNbr);
			keyItem.bMoving=true;
		}
		else if(bIncludeDetail && keyItem.detail==this.state.currentDetailArea)
		{
			keyItem.value=this.formWnd.tranMagic.getElement(keyItem.fldNbr,currentRow);
			if (keyItem.value == "" && bApplyDefaultValue)
				keyItem.value = this.formWnd.lawformGetDefaultValue(keyItem.fldNbr);
			keyItem.priority=(this.state.doDefine || this.state.selectDetailRow) ? 2 : 1;
			keyItem.bMoving=true;
		}			

        // when more than one instance of the key exists, transfer
        // the value for the last one
        var found = false;
        var bufferKeys = this.indexByKeyOccur(keyItem.keyNbr, keyItem.occur);
        var len = bufferKeys.length;
        for (var j=len-1; len>1 && j>=0; j--)
        {
            if (bufferKeys[j].bMoving)
            {
				if (!found)
                {
                    found = true;
                    continue;
                }
                else
                {
                    var dupKeyItem = this.lawKeys[bufferKeys[j].index];
                    dupKeyItem.bMoving = false;
                }
            }
        }    
	}
	if(this.state.doDefine)
	{
		fldId=this.state.currentField.replace(/r\d+/, "r0");
		keyItem=this.indexByField(fldId);
		if(keyItem)
		{
			keyItem.priority=3;
			keyItem.define=true;
			keyItem.bMoving=true;
		}
	}
	this.portalWnd.lawsonPortal.keyBuffer=this;
}
LawKeyColl.prototype.SelectDetailRow=function()
{
	// if we have a detail row FC field that is selected (value will be 'X') then include keys
	var FCFldNbr=this.formWnd.strRowFCFldNbr;
	
	this.formWnd.formState.setValue("selectDetailRow",false);
	if (FCFldNbr=="") return -1;

	var dtlElm=this.formWnd.document.getElementById(this.formWnd.formState.currentDetailArea);
	if (!dtlElm) return -1;
	var rows=parseInt(dtlElm.getAttribute("rows"));
	for (var i=0; i < rows; i++)
	{
		var fldValue=this.formWnd.lawForm.getElementValue(FCFldNbr,i);
		if (fldValue.toUpperCase()=="X") //JT LSF-343
		{
			this.formWnd.formState.setValue("selectDetailRow",true);
			return i;
		}
	}
	return -1
}
//-----------------------------------------------------------------------------
// check for incompatibilities in key definitions
LawKeyColl.prototype.keyMismatch=function(key1,key2)
{
	// if one is a date, they both should be date
	if ((key1.ed == "date" || key2.ed == "date")
	&& (key1.ed != key2.ed))
		return true;

	// if the 'from' is alpha, the 'to' must also be alpha
	if (this.keyIsAlpha(key1) && !this.keyIsAlpha(key2))
		return true;

	// if both have decimal size, 'from size' must be no greater than 'to size'
	if ((key1.decsz && key2.decsz)
	&& (parseInt(key1.decsz) > parseInt(key2.decsz)))
		return true;

	return false;
}
LawKeyColl.prototype.keyIsAlpha=function(key)
{
	return ( (key.ed == "" || key.ed == "right" || key.ed == "upper")
		? true : false );
}
