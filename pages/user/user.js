// user.js

var Api = require('../../utils/api.js');

var WARP_SECOND = 1000 * 60;
var CACHED_TIME = WARP_SECOND * 2; // sec

Page({
  data: {
    title: 'User',
    user: {},
    photos: [],
    contacts: [],
    loading: true,
    hasMore: true,
    equalOne: false,
    id: '',
    rpp: 20,
    hideCamera: true,
    hideLens: true,
    hideCity: true
  },
  lookPhoto: function(e) {
    var id = e.currentTarget.id,
      url = '../detail/detail?id=' + id;
    wx.navigateTo({
      url: url
    })
  },
  loadMore: function(e) {
    console.log('down');
    if (this.data.hasMore) {
      this.fetchData(this.data.id);
    }
  },
  fetchUser: function(id) {
    var that = this;
    console.log(id);
    wx.request({
      url: Api.showUser(id),
      data: {
        consumer_key: Api.getConsumerKey()
      },
      success: function(res) {
        var user = res.data.user;
        var objC = user.contacts;
        var arrayC = [];
        for (var key in objC){
          arrayC.push([key, objC[key]]);
        }

        that.setData({
          id: id,
          user: user,
          hideCamera: Api.isNone(user.camera),
          hideLens: Api.isNone(user.lens),
          hideCity: Api.isNone(user.city),
          contacts: arrayC
        });
        that.fetchData(id);
      }
    });
  },
  initData: function(id){
    var cachedPhotos = wx.getStorageSync('userphotos');

    if (!cachedPhotos) {
      this.fetchData(id);
    } else {
      var nowTs = Date.now();
      var oldTs = parseInt(wx.getStorageSync('requestUserTs') || 0);

      if (nowTs - oldTs > CACHED_TIME || !oldTs) {
        this.fetchData(id);
      } else {
        this.setData({
          loading: false,
          photos: cachedPhotos
        })
      }
    }
  },
  fetchData: function(id) {
    var that = this;

    var theRPP = that.data.rpp;
    console.log(id);
    console.log(theRPP);
    wx.request({
      url: Api.getPhotos(),
      data: {
        feature: 'user',
        user_id: id,
        consumer_key: Api.getConsumerKey(),
        sort: 'created_at',
        sort_direction: 'desc',
        image_size: '3',
        include_store: 'store_download',
        include_states: 'voted',
        rpp: theRPP
      },
      success: function(res) {
        var fetchedData = res.data.photos;

        var newData = that.data.photos;
        newData.push.apply(newData, fetchedData.slice(theRPP - 20, theRPP));

        wx.setStorageSync('userphotos', newData);
        wx.setStorageSync('requestUserTs', Date.now());

        var hasMore = true;
        var newRPP = theRPP + 20;
        var equalOne = false;
        if (fetchedData.length < theRPP) {
          hasMore = false;
          newRPP = fetchedData.length;
        } else if (that.equalOne) {
          hasMore = false;
          newRPP = fetchedData.length;
        } else {
          equalOne = true;
        }

        that.setData({
          photos: newData,
          loading: false,
          hasMore: hasMore,
          equalOne: equalOne,
          rpp: newRPP
        })
      }
    });
  },
  onLoad: function(options) {
    console.log('load user');
    this.fetchUser(options.id);
  }
})
