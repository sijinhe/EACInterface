// Name: createXMLDocument
// Input: String
// Output: XML Document
jQuery.createXml = function(string)
{
  var browserName = navigator.appName;
  var doc;
  if (browserName == 'Microsoft Internet Explorer')
  {
    doc = new ActiveXObject('Microsoft.XMLDOM');
    doc.async = 'false'
    doc.loadXML(string);
  } else {
    doc = (new DOMParser()).parseFromString(string, 'text/xml');
  }
  return doc;
}





