//var ianm_fn = function() {alert("hi 5")}

//setTimeout(ianm_fn, 5000)

function dumpObject(o)
{
	var s = ""
	for ( var k in o )
		s += k + ":" + o[k] + "; "
	return s
}
	