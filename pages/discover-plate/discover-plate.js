import Api from '../../utils/config/api.js';
import { GLOBAL_API_DOMAIN } from '/../../utils/config/config.js';
var utils = require('../../utils/util.js')
Page({
  data: {
    _build_url: GLOBAL_API_DOMAIN,
    food: [],
    page: 1,
    hotlive: [],
    flag: true,
    tect: '最新',
    isscelect: 1,
    ishotnew: false
  },
  onLoad: function () {

  },
  onShow: function (options) {
    let that = this;
    this.setData({
      ishotnew: false,
      food: [],
      page: 1,
      flag: true
    })
    this.getfood();
    wx.request({
      url: that.data._build_url + 'zb/list/',
      success: function (res) {
        that.setData({
          hotlive: res.data.data.list
        })
      }
    })
    wx.setStorage({
      key: 'cover',
      data: ''
    })
    wx.setStorage({
      key: 'title',
      data: '',
    })
    wx.setStorage({
      key: 'text',
      data: '',
    })
  },
  close:function(){
    this.setData({
      ishotnew:false
    })
  },
  getfood: function (_type, data) {
    wx.showLoading({
      title:'数据加载中。。。',
      mask:true
    })
    let that = this;
    let _parms = {
      page: this.data.page,
      row: 8
    }
    if (_type == 'sortType') {
      _parms.sortType = data
    }
    if (_type == 'choiceType') {
      _parms.sortType = data
    }
    Api.topiclist(_parms).then((res) => {
      let _data = this.data.food
      if (res.data.code == 0){
        if (res.data.data.list != null && res.data.data.list != "" && res.data.data.list != []) {
          let footList = res.data.data.list;
          for (let i = 0; i < footList.length; i++) {
            footList[i].summary = utils.uncodeUtf16(footList[i].summary);
            footList[i].content = utils.uncodeUtf16(footList[i].content);
            footList[i].timeDiffrence = utils.timeDiffrence(res.data.currentTime, footList[i].updateTime, footList[i].createTime)
            _data.push(footList[i]);
          }
          wx.hideLoading()
          this.setData({
            food: _data
          })
        } else {
          this.setData({
            flag: false
          });
        }
      }else{
        wx.hideLoading()
      }
      
      if (that.data.page == 1) {
        wx.stopPullDownRefresh();
      } else {
        wx.hideLoading();
      }
    })
  },
  clickarticle: function (e) {  //点击某条文章
    const id = e.currentTarget.id
    let _data = this.data.food
    let zan = ''
    for (let i = 0; i < _data.length; i++) {
      if (id == _data[i].id) {
        zan = _data[i].zan
      }
    }
    this.setData({
      ishotnew: false
    })
    wx.navigateTo({
      url: 'dynamic-state/article_details/article_details?id=' + id + '&zan=' + zan
    })
  },
  announceState: function (event) { // 跳转到编辑动态页面
    this.setData({
      ishotnew: false
    })
    wx.redirectTo({
      url: 'dynamic-state/dynamic-state',
    })
  },
  onReachBottom: function () {  //用户上拉触底
    if (this.data.flag) {
      wx.showLoading({
        title: '加载中..'
      })
      let that = this
      this.setData({
        ishotnew: false,
        page: this.data.page + 1
      });
      that.getfood();
    }
  },
  onPullDownRefresh: function () {  //用户下拉刷新
    let that = this;
    this.setData({
      ishotnew: false,
      food: [],
      page: 1,
      flag: true
    });
    this.getfood();
    wx.request({
      url: that.data._build_url + 'zb/list/',
      success: function (res) {
        that.setData({
          hotlive: res.data.data.list
        })
      }
    })
  },
  topall: function () {  //选择全部
    this.setData({
      ishotnew: false,
      isscelect: 1
    })
    let _type = ''
    this.getfood()
  },
  topbus: function () {  //选择商家
    this.setData({
      ishotnew: false,
      isscelect: 2
    })
    let _type = 'sortType'
    let data = '1'
    this.getfood(_type,data)
  },
  topper: function () {  //选择个人
    this.setData({
      ishotnew: false,
      isscelect: 3
    })
    let _type = 'sortType'
    let data = '2'
    this.getfood(_type, data)
  },
  sect: function () {  //点击最新/最热
    this.setData({
      ishotnew: false,
      ishotnew: true
    })
  },
  mostnew: function () { //选择最新
    this.setData({
      ishotnew: false,
      tect: '最新'
    })
    let _type = 'choiceType'
    let data = '0'
    this.getfood(_type, data)
  },
  mosthot: function () {  //选择最热
    this.setData({
      ishotnew: false,
      tect: '最热'
    })
    let _type = 'choiceType'
    let data = '1'
    this.getfood(_type, data)
  }
})