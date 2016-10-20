
var Api = require('../../utils/api.js');

var WARP_SECOND = 1000 * 60;
var CACHED_TIME = WARP_SECOND * 2; // sec

Page({
  data: {
    title: 'User',
    username: '',
    fullname: '',
    users: [],
    term: '',
    id: ''
  },
  loadUser: function(event) {
    console.log(event.currentTarget.id);
    var id = event.currentTarget.id,
      url = '../user/user?id=' + id;
    wx.navigateTo({
      url: url
    })
  },
  search: function(e) {
    this.setData({
      term: e.detail.value
    });
    this.initData()
  },
  initData: function(){
    var that = this;
    wx.request({
      url: Api.getUser(),
      data: {
        term: that.data.term,
        consumer_key: Api.getConsumerKey()
      },
      success: function(res) {
        console.log(res);
        that.setData({
          users: res.data.users
        })
      }
    })
  },
  onLoad: function(options) {
  //
  }
})