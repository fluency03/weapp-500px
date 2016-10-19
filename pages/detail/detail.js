// detail.js

var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');

Page({
  data: {
    title: 'Photo',
    photo: {},
    comments: [],
    tags: [],
    id: 0,
    height: 0,
    pages: [],
    hidden: false,
    modalHidden2: true,
    hideCamera: true,
    hideLens: true,
    hideAperture: true,
    hideISO: true,
    hideRate: true,
    hideVote: true,
    hideView: true
  },
  modalTap2: function(e) {
    this.setData({
      modalHidden2: false
    })
  },
  modalChange2: function(e) {
    this.setData({
      modalHidden2: true
    })
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
    wx.request({
      url: Api.getPhoto(id),
      data: {
        image_size: 4,
        tags: '1',
        // comments: 1,
        consumer_key: Api.getConsumerKey()
      },
      success: function(res) {
        var photo = res.data.photo;
        // var pages = getXML(res.data.photo.description);
        that.setData({
          photo: photo,
          height: photo.height * 750 / photo.width,
          pages: util.getXML(photo.description),
          hideCamera: Api.isNone(photo.camera),
          hideLens: Api.isNone(photo.lens),
          hideAperture: Api.isNone(photo.aperture),
          hideISO: Api.isNone(photo.iso),
          hideRate: Api.isNone(photo.rating),
          hideVote: Api.isNone(photo.votes_count),
          hideView: Api.isNone(photo.times_viewed),
          tags: photo.tags
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
