// search.js

var util = require('../../utils/util.js');
var Api = require('../../utils/api.js');

var WARP_SECOND = 1000 * 60;
var CACHED_TIME = WARP_SECOND * 2; // sec

Page({
  data: {
    title: 'Search',
    photos: [],
    term: '',
    loading: true,
    hasMore: true,
    equalOne: false,
    rpp: 20
  },
  lookPhoto: function(e) {
    var id = e.currentTarget.id,
      url = '../detail/detail?id=' + id;
    wx.navigateTo({
      url: url
    })
  },
  changeTerm: function(e) {
    this.setData({
      term: e.detail.value,
      rpp: 20
    });
  },
  search: function(e) {
    this.setData({
      rpp: 20
    });
    this.initData(this.data.term)
  },
  initData: function(t){
    var cachedPhotos = wx.getStorageSync(t);

    if (!cachedPhotos) {
      this.fetchData();
    } else {
      var nowTs = Date.now();
      var oldTs = parseInt(wx.getStorageSync('requestTs') || 0);

      if (nowTs - oldTs > CACHED_TIME || !oldTs) {
        this.fetchData();
      } else {
        this.setData({
          loading: false,
          photos: cachedPhotos
        })
      }
    }
  },
  loadMore: function(e) {
    console.log('down');
    if (this.data.hasMore) {
      this.fetchData();
    }
  },
  fetchData: function() {
    var that = this;

    var theRPP = that.data.rpp;
    console.log(theRPP);
    wx.request({
      url: Api.getSearch(),
      data: {
        term: this.data.term,
        consumer_key: Api.getConsumerKey(),
        image_size: '3',
        rpp: theRPP
      },
      success: function(res) {
        console.log(res);
        var fetchedData = res.data.photos;

        var newData = that.data.photos;
        newData.push.apply(newData, fetchedData.slice(theRPP - 20, theRPP));

        wx.setStorageSync(that.data.term, newData);
        wx.setStorageSync('requestTs', Date.now());

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
    })
  },
  onLoad: function () {
    console.log('load search');
    this.initData(this.data.term);
  }
})
