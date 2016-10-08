// today.js

Page({
  data: {
    title: 'Today',
    today: [],
    hidden: false
  },
  onPullDownRefresh: function () {
    this.fetchData();
    console.log('onPullDownRefresh', new Date())
  },
  look: function(event) {
    var id = event.currentTarget.id,
      url = '../detail/detail?id=' + id;
    wx.navigateTo({
      url: url
    })
  },
  fetchData: function() {
    var that = this;
    var CKEY = 'pd67OURWTmXMy6X1E3DL5jmr9aBAZ9VLjZp4jLvz';
    wx.request({
      url: 'https://api.500px.com/v1/photos',
      data: {
        feature: 'fresh_today',
        consumer_key: CKEY,
        sort: 'votes_count',
        sort_direction: 'desc',
        image_size: '3',
        include_store: 'store_download',
        include_states: 'voted'
      },
      success: function(res) {
        console.log(res);
        that.setData({
          today: res.data.photos
        })
        setTimeout(function() {
          that.setData({
            hidden: true
          })
        }, 300)
      }
    })
  },
  onLoad: function () {
    this.setData({
      hidden: false
    })
    this.fetchData();
  }
})
