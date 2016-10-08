// detail.js

function getXML(str) {
  return []
}

Page({
  data: {
    title: 'Photo',
    photo: {},
    comments: [],
    id: 0,
    height: 0,
    hidden: false
  },
  fetchDetail: function(id) {
    var that = this;
    console.log(id)
    idurl = 'https://api.500px.com/v1/photos' + '/' + id;
    var CKEY = 'pd67OURWTmXMy6X1E3DL5jmr9aBAZ9VLjZp4jLvz';
    wx.request({
      url: idurl,
      data: {
        image_size: 4,
        // comments: 1,
        consumer_key: CKEY
      },
      success: function(res) {
        that.setData({
          photo: res.data.photo,
          height: res.data.photo.height * 750 / res.data.photo.width
        })
      }
    })
    that.fetchReplies(id);
  },
  fetchReplies: function(id) {
    var that = this;
    commentsurl = 'https://api.500px.com/v1/photos' + '/' + id + '/comments';
    var CKEY = 'pd67OURWTmXMy6X1E3DL5jmr9aBAZ9VLjZp4jLvz';
    wx.request({
      url: commentsurl,
      data: {
        consumer_key: CKEY
      },
      success: function(res) {
        that.setData({
          comments: res.data.comments
        })
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
    })
    this.fetchDetail(options.id);
  }
})
