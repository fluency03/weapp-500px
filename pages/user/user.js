Page({
  data: {
    title: 'User',
    user: {},
    contacts: [],
    galleries: [],
    hidden: false
  },
  loadMore: function () {
    
  },
  fetchUser: function(id) {
    var that = this;
    console.log(id);
    var idurl = 'https://api.500px.com/v1/users/show' + '?id=' + id;
    var CKEY = 'pd67OURWTmXMy6X1E3DL5jmr9aBAZ9VLjZp4jLvz';
    wx.request({
      url: idurl,
      data: {
        consumer_key: CKEY
      },
      success: function(res) {
        // var
        var objC = res.data.user.contacts;
        var arrayC = [];
        for (var key in objC){
          arrayC.push([key, objC[key]]);
        }
        that.setData({
          user: res.data.user,
          contacts: arrayC
        });
        setTimeout(function() {
          that.setData({
            hidden: true
          })
        }, 300)
      }
    });
    that.fetchGallery(id)
  },
  fetchGallery: function(id) {
    var that = this;
    console.log(id);
    var idurl = 'https://api.500px.com/v1/users/' + id + '/galleries';
    var CKEY = 'pd67OURWTmXMy6X1E3DL5jmr9aBAZ9VLjZp4jLvz';
    wx.request({
      url: idurl,
      data: {
        consumer_key: CKEY,
        sort: 'updated_at',
        rpp: 30
      },
      success: function(res) {
        that.setData({
          galleries: res.data.galleries
        });
        setTimeout(function() {
          that.setData({
            hidden: true
          })
        }, 300)
      }
    });
  },
  onLoad: function(options) {
    this.setData({
      hidden: false
    });
    this.fetchUser(options.id);
  }
})
