//index.js 
import Api from '/../../utils/config/api.js'; 
import { GLOBAL_API_DOMAIN } from '/../../utils/config/config.js';
var postsData = require('/../../data/posts-data.js')
const app = getApp()

Page({
  data: {
    _build_url: GLOBAL_API_DOMAIN,
    city: "",
    carousel:[],  //轮播图
    business:[], //商家列表，推荐餐厅
    actlist:[],  //热门活动
    hotlive:[],  //热门直播
    food:[],   //美食墙
    logs: []
  },
  onLoad: function (options) {
    let lat= '', lng= '';  //lat纬度   lng经度
    wx.getLocation({  //获取当前的地理位置
      type: 'wgs84',
      success: (res) => {
        var lat = res.latitude
        var lng = res.longitude
        this.requestCityName(lat, lng);
      }
    })
    this.getcarousel();
    this.getdata();
    this.getactlist();
    this.gethotlive();
    this.gettopic();

  },
  onShow() {
    let lat = '', lng = '';  //lat纬度   lng经度
    wx.getStorage({
      key: 'lat',
      success: function (res) {
        lat = res.data;
      }
    })
    wx.getStorage({
      key: 'lng',
      success: function (res) {
        lng = res.data;
      }
    })
    let that = this;
    setTimeout(function(){
      if(lat && lng){
        that.requestCityName(lat, lng)
      }
    },500)
  },
  requestCityName(lat, lng) {//获取当前城市
    wx.request({
      url: 'http://apis.map.qq.com/ws/geocoder/v1/?location=' + lat + "," + lng + "&key=4YFBZ-K7JH6-OYOS4-EIJ27-K473E-EUBV7",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        this.setData({
          city: res.data.result.address_component.city
        })
      }
    })
  },
  getcarousel: function () {  //轮播图
    let that = this;
    Api.hcllist().then((res) => {
      // console.log("carousel:",res.data.data)
      this.setData({
        carousel: res.data.data
      })
    })
  },
  getdata: function () { // 获取推荐餐厅数据
    Api.shoptop().then((res) => { 
      // console.log("businss:",res.data.data)
    this.setData({
        business: res.data.data
      })
    })
  }, 
  gettopic:function(){  // 美食墙
    Api.topiclist().then((res) => {
      // console.log("food:",res.data.data.list)
      this.setData({
        food: res.data.data.list
      })
    })
  },
  getactlist(){  //获取热门活动数据
    Api.actlist().then((res) => {
      // console.log("actlist:",res.data.data.list)
      this.setData({
        actlist: res.data.data.list
      })
    })
  },
  gethotlive(){  //获取热门直播数据 
    let that = this;
    wx.request({
      url: that.data._build_url + 'zb/top/',
      success: function (res) {
        // console.log("hotlive:",res.data.data)
        that.setData({
          hotlive: res.data.data
        })
      }
    })
  },
  // 用户定位
  userLocation: function () {
    wx.navigateTo({
      url: 'user-location/user-location',
    })
  },

  //用户搜索
  seekTap: function () {
    wx.navigateTo({
      url: 'user-seek/user-seek',
    })
  },
  //用户优惠券
  discountCoupon: function () {
    wx.navigateTo({
      url: '../personal-center/my-discount/my-discount',
    })
  },
  shopping: function () {
    wx.navigateTo({
      url: 'consume-qibashare/consume-qibashare',
    })
  },
  // 餐厅
  diningRoom: function () {
    wx.navigateTo({
      url: 'dining-room/dining-room',
    })
  },

//未开放 酒店 景点 休闲娱乐
  hotelUnopen: function () {
    wx.showToast({
      title: '该功能更新中...',
    })
  },

  scenicSpot: function () {
    wx.showToast({
      title: '该功能更新中...',
    })
  },
  entertainment: function () {
    wx.showToast({
      title: '该功能更新中...',
    })
  },
  recommendCt: function (event) {
    wx.navigateTo({
      url: 'dining-room/dining-room',
    })
  },
  diningHhall: function (event) {
    const stopid = event.currentTarget.id
    wx.navigateTo({  // 页面传参
      url: 'merchant-particulars/merchant-particulars?stopid=' + stopid
    })
  },
  cateWall: function (event) {
    wx.switchTab({
      url: '../discover-plate/discover-plate',
    })
  },
  preferential: function (event) {
    wx.switchTab({
      url: '../activityDetails/activity-details',
    })
  },
  detailOfTheActivity: function (event) {
    wx.navigateTo({
      url: '../activityDetails/details-like/details-like',
    })
  }

})
