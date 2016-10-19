// explore.js

var Api = require('../../utils/api.js');

var WARP_SECOND = 1000 * 60;
var CACHED_TIME = WARP_SECOND * 2; // sec

var featureMap = {'Editor': 'editors', 'Today': 'fresh_today', 'Week': 'fresh_week', 'Upcoming': 'upcoming'};

Page({
  data: {
    title: 'Explore',
    photos: [],
    feature: 'fresh_today',
    loading: true,
    hasMore: true,
    equalOne: false,
    rpp: 20,
    featureOptionHidden: true,
    featuresOptions: ['Editor', 'Today', 'Week', 'Upcoming']
  },
  lookPhoto: function(event) {
    var id = event.currentTarget.id,
      url = '../detail/detail?id=' + id;
    wx.navigateTo({
      url: url
    })
  },
  showFeatureOptions: function(e) {
    this.setData({
      featureOptionHidden: !this.data.featureOptionHidden
    })
  },
  changeFeatures: function(e) {
    this.setData({
      featureOptionHidden: !this.data.featureOptionHidden
    })
  },
  chooseFeature:function(e){
    console.log(featureMap[e.currentTarget.dataset.name]);
    this.setData({
      feature: featureMap[e.currentTarget.dataset.name],
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
    if (this.data.hasMore) {
      this.fetchData();
    }
  },
  fetchData: function() {
    var that = this;

    var theRPP = that.data.rpp;
    console.log(theRPP);
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

        var newData = that.data.photos;
        newData.push.apply(newData, fetchedData.slice(theRPP - 20, theRPP));

        wx.setStorageSync(that.data.feature, newData);
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
    console.log('load explore');
    this.initData(this.data.feature);
  }
})
