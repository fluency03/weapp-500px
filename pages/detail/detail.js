// detail.js

function getLinks(txt) {
  parser = new DOMParser();
  xmlDoc = parser.parseFromString(txt, "application/xml");

  var content = xmlDoc.getElementsByTagName("a")[0].childNodes[0].nodeValue;
  var link = xmlDoc.getElementsByTagName("a")[0].getAttribute("href");

  return {"content": content, "link": link}
}

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




Page({
  data: {
    title: 'Photo',
    photo: {},
    comments: [],
    tags: [],
    id: 0,
    height: 0,
    pages: [],
    hidden: false
  },
  loadUser: function(event) {
    var id = event.currentTarget.id,
      url = '../user/user?id=' + id;
    wx.navigateTo({
      url: url
    })
  },
  fetchDetail: function(id) {
    var that = this;
    console.log(id);
    var idurl = 'https://api.500px.com/v1/photos' + '/' + id;
    var CKEY = 'pd67OURWTmXMy6X1E3DL5jmr9aBAZ9VLjZp4jLvz';
    wx.request({
      url: idurl,
      data: {
        image_size: 4,
        tags: '1',
        // comments: 1,
        consumer_key: CKEY
      },
      success: function(res) {
        // var pages = getXML(res.data.photo.description);
        that.setData({
          photo: res.data.photo,
          height: res.data.photo.height * 750 / res.data.photo.width,
          pages: getXML(res.data.photo.description),
          tags: res.data.photo.tags
        });
      }
    });
    that.fetchReplies(id);
  },
  fetchReplies: function(id) {
    var that = this;
    var commentsurl = 'https://api.500px.com/v1/photos' + '/' + id + '/comments';
    var CKEY = 'pd67OURWTmXMy6X1E3DL5jmr9aBAZ9VLjZp4jLvz';
    wx.request({
      url: commentsurl,
      data: {
        consumer_key: CKEY
      },
      success: function(res) {
        that.setData({
          comments: res.data.comments
        });
        setTimeout(function() {
          that.setData({
            hidden: true
          })
        }, 300)
      }
    })
  },
  onLoad: function(options) {
    this.setData({
      hidden: false
    });
    this.fetchDetail(options.id);
  }
})
