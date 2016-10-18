// explore.js

var Api = require('../../utils/api.js');

var WARP_SECOND = 1000 * 60;
var CACHED_TIME = WARP_SECOND * 2; // sec

Page({
  data: {
    title: 'Explore',
    photos: [],
    feature: 'fresh_today',
    loading: true,
    hasMore: true,
    rpp: 20,
    actionSheetHidden: true,
    actionSheetItems: ['Editor', 'Today', 'Week', 'Upcoming'],
    sheetMap: {'Editor': 'editors', 'Today': 'fresh_today', 'Week': 'fresh_week', 'Upcoming': 'upcoming'}
  },
  look: function(event) {
    var id = event.currentTarget.id,
      url = '../detail/detail?id=' + id;
    wx.navigateTo({
      url: url
    })
  },
  actionSheetTap: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetChange: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindItemTap:function(e){
    console.log(this.data.sheetMap[e.currentTarget.dataset.name]);
    this.setData({
      feature: this.data.sheetMap[e.currentTarget.dataset.name],
      rpp: 20
    });
    this.initData(this.data.feature);
  },
  initData: function(f){
    var cachedPhotos = wx.getStorageSync(f);

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
      url: Api.getPhotos(),
      data: {
        feature: this.data.feature,
        consumer_key: Api.getConsumerKey(),
        sort: 'votes_count',
        sort_direction: 'desc',
        image_size: '3',
        include_store: 'store_download',
        include_states: 'voted',
        rpp: theRPP
      },
      success: function(res) {
        console.log(res);
        var fetchedData = res.data.photos;

        if (more) {
          console.log('a');
          var newData = that.data.photos;
          newData.push.apply(newData, fetchedData.slice(theRPP - 20, theRPP));
        } else {
          console.log('b');
          var newData = fetchedData;
        }

        wx.setStorageSync(that.data.feature, newData);
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
    this.initData(this.data.feature);
  }
})
