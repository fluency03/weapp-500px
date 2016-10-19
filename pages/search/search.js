// today.js

var util = require('../../utils/util.js');
var Api = require('../../utils/api.js');

var WARP_SECOND = 1000 * 60;
var CACHED_TIME = WARP_SECOND * 2; // sec

Page({
  data: {
    title: 'Search',
    photos: [],
    term: '',
    tag: '',
    loading: true,
    hasMore: true,
    rpp: 20,
    actionSheetHidden: true
  },
  look: function(event) {
    var id = event.currentTarget.id,
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
  // changeTag: function(e) {
  //   this.setData({
  //     tag: e.detail.value,
  //     rpp: 20
  //   });
  // },
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
    var hasMore = false;
    this.fetchData(true);
    hasMore = true;
    this.setData({
      hasMore: hasMore
    })
  },
  fetchData: function(more) {
    var that = this;
    if (!more) {
      more = false;
    }

    var theRPP = that.data.rpp;
    console.log (theRPP);
    wx.request({
      url: Api.getSearch(),
      data: {
        term: this.data.term,
        // tag: this.data.tag,
        consumer_key: Api.getConsumerKey(),
        image_size: '3',
        rpp: theRPP
      },
      success: function(res) {
        console.log(res);
        var fetchedData = res.data.photos;

        if (more) {
          console.log('a');
          var newData = that.data.photos;
          // var concatData = fetchedData;
          newData.push.apply(newData, fetchedData.slice(theRPP - 20, theRPP));
        } else {
          console.log('b');
          var newData = fetchedData;
        }

        wx.setStorageSync(that.data.term, newData);
        wx.setStorageSync('requestTs', Date.now());

        that.setData({
          photos: newData,
          loading: false,
          rpp: that.data.rpp + 20
        })
      }
    })
  },
  onLoad: function () {
    this.initData(this.data.term);
  }
})
