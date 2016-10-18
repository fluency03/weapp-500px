function formatTime(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n
}

// function getLinks(txt) {
//   parser = new DOMParser();
//   xmlDoc = parser.parseFromString(txt, "application/xml");
//
//   var content = xmlDoc.getElementsByTagName("a")[0].childNodes[0].nodeValue;
//   var link = xmlDoc.getElementsByTagName("a")[0].getAttribute("href");
//
//   return {"content": content, "link": link}
// }

function getIndicesOf(re, str) {
  var last = [], indices = [];
  var match = ''

  while ((match = re.exec(str)) != null) {
    indices.push(match.index);
    last.push(re.lastIndex);
  }

  return [indices, last];
}

function getLinks(txt) {
  var re = /<a((\s+\w+=\"[^\"]+\")+)>(.+?)<\/a>/g;
  var pos = getIndicesOf(re, txt);
  var left = pos[0];
  var right = pos[1];

  var links = [];
  for (var i in left) {
    links.push(txt.slice(left[i], right[i]))
  }

  return links;
}


function getXML(txt) {
  var links = getLinks(txt);
  var oParser = new DOMParser();

  var pages = [];

  for (var l in links) {
    var oDOM = oParser.parseFromString(links[l], "text/xml");
    var a = oDOM.getElementsByTagName('a');
    pages.push([a[0].childNodes[0].nodeValue, a[0].getAttribute('href')])
  }
  return pages;
}

module.exports = {
  formatTime: formatTime,
  getXML: getXML
};

