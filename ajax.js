var gvLoadInto = "";
var gvXMLData = "";
var gvXMLdoc;
var xmlHttp;

/***************************************************************************
* Get xml object appropriate for current browser
***************************************************************************/
function GetXmlHttpObject(handler) {
  var objXMLHttp = null;

  if(window.ActiveXObject) {
    objXMLHttp = new ActiveXObject("Msxml2.XMLHTTP");
  }
  else if (window.XMLHttpRequest) {
    objXMLHttp = new XMLHttpRequest();
  }
  else if (window.ActiveXObject) {
    objXMLHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  return objXMLHttp;
}

/***************************************************************************
* Function to run when object state changes
***************************************************************************/
function stateChanged() {
  if (xmlHttp.readyState == 4 || xmlHttp.readyState == "complete") {
    if(gvLoadInto == "VAR") {
	    gvXMLData = xmlHttp.responseText;
      //gvXMLdoc.load(xmlHttp.responseText);
    } else {
      document.getElementById(gvLoadInto).innerHTML = xmlHttp.responseText;
    }
  }
}

/***************************************************************************
* Function to load given URL into given DIV element
***************************************************************************/
function loadFile(ipURL, ipDivId, ipAfterLoadFunction) {
  gvLoadInto = ipDivId;
  if (ipURL.length == 0) {
    document.getElementById(gvLoadInto).innerHTML = "";
    return;
  }
  xmlHttp=GetXmlHttpObject();
  if (xmlHttp == null) {
    alert ("Browser does not support HTTP Request");
    return;
  }
  //ipURL=ipURL+"?sid="+Math.random();

  //alert(ipURL);

  //xmlHttp.onreadystatechange = stateChanged2;
  xmlHttp.onreadystatechange = ipAfterLoadFunction;
  xmlHttp.open("GET", ipURL, true);
  xmlHttp.send(null);
}