// today.js

var utils = require('../../utils/util.js');

var WARP_SECOND = 1000 * 60;
var CACHED_TIME = WARP_SECOND * 2; // sec

Page({
  data: {
    title: 'Explore',
    editor: [],
    feature: 'editors',
    loading: true,
    hasMore: true,
    rpp: 20,
    actionSheetHidden: true,
    actionSheetItems: ['Editor', 'Today', 'Week', 'Upcoming'],
    sheetMap: {'Editor': 'editors', 'Today': 'fresh_today', 'Week': 'fresh_week', 'Upcoming': 'upcoming'}
    // modalHidden: true
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
    console.log(this.data.sheetMap[e.currentTarget.dataset.name])
    this.setData({
      feature: this.data.sheetMap[e.currentTarget.dataset.name],
      rpp: 20
    });
    this.initData(this.data.feature);
  },
  initData: function(f){
    var photosEditor = wx.getStorageSync(f);

    if (!photosEditor) {
      this.fetchData();
    } else {
      var nowTs = Date.now();
      var oldTs = parseInt(wx.getStorageSync('requestEditorTs') || 0);

      if (nowTs - oldTs > CACHED_TIME || !oldTs) {
        this.fetchData();
      } else {
        this.setData({
          loading: false,
          editor: photosEditor
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

    var CKEY = 'pd67OURWTmXMy6X1E3DL5jmr9aBAZ9VLjZp4jLvz';
    var theRPP = that.data.rpp;
    console.log (theRPP);
    wx.request({
      url: 'https://api.500px.com/v1/photos',
      data: {
        feature: this.data.feature,
        consumer_key: CKEY,
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
          var newData = that.data.editor;
          // var concatData = fetchedData;
          newData.push.apply(newData, fetchedData.slice(theRPP - 20, theRPP));
        } else {
          console.log('b');
          var newData = fetchedData;
        }

        wx.setStorageSync('editor', newData);
        wx.setStorageSync('requestEditorTs', Date.now());

        that.setData({
          editor: newData,
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
