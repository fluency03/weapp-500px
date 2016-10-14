// today.js

var utils = require('../../utils/util.js');

var WARP_SECOND = 1000 * 60;
var CACHED_TIME = WARP_SECOND * 2; // sec

Page({
  data: {
    title: 'Editor',
    editor: [],
    term: 'fish',
    tag: 'street',
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
  inputChange1: function(e) {
    this.setData({
      term: e.detail.value,
      rpp: 20
    });
  },
  inputChange2: function(e) {
    this.setData({
      tag: e.detail.value,
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
    var photosEditor = wx.getStorageSync(t);

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
      url: 'https://api.500px.com/v1/photos/search',
      data: {
        term: this.data.term,
        tag: this.data.tag,
        consumer_key: CKEY,
        image_size: '3',
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
    this.initData(this.data.term);
  }
})
