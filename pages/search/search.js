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
    loading: false,
    hasMore: true,
    equalOne: false,
    newSearch: false,
    rpp: 20
  },
  lookPhoto: function(e) {
    var id = e.currentTarget.id,
      url = '../detail/detail?id=' + id;
    wx.navigateTo({
      url: url
    })
  },
  search: function(e) {
    this.setData({
      term: e.detail.value,
      newSearch: true,
      rpp: 20
    });
    this.initData(this.data.term)
  },
  initData: function(t){
    var cachedPhotos = wx.getStorageSync('term' + t);

    if (!cachedPhotos) {
      this.fetchData();
    } else {
      var nowTs = Date.now();
      var oldTs = parseInt(wx.getStorageSync('requestSearchTs') || 0);

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

        if (!that.data.newSearch){
          var newData = that.data.photos;
          newData.push.apply(newData, fetchedData.slice(theRPP - 20, theRPP));
        } else {
          var newData = fetchedData;
        }

        wx.setStorageSync('term' + that.data.term, newData);
        wx.setStorageSync('requestSearchTs', Date.now());

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
          newSearch: false,
          rpp: newRPP
        })
      }
    })
  },
  onLoad: function () {
    console.log('load search');
    // this.initData(this.data.term);
  }
})
