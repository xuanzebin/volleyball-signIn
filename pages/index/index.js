//index.js
//获取应用实例
const app = getApp()
const AV = require('../.././libs/av-weapp-min.js')
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userName:null
  },
  //事件处理函数
  bindViewTap: function() {
    this.setData({
      userInfo: null,
      hasUserInfo: false
    })
    app.globalData.userInfo=null
  },
  onLoad: function () {
    AV.User.loginWithWeapp().then(user => {
      if (JSON.parse(user._hashedJSON.authData).lc_weapp.unionid){
        console.log('你关注了公众号')
      } else {
        console.log('你还没有关注公众号')
        console.log(JSON.parse(user._hashedJSON.authData))
      }
    }).catch(console.error)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        userName: app.globalData.userInfo.nickName
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          userName: res.userInfo.nickName
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            userName: res.userInfo.nickName
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      userName: e.detail.nickName
    })
  },
  intoIndex(e){
    wx.switchTab({
      url: "../sign/sign"
    })
  },
  onShareAppMessage: function () {
    return {

      title: `少年，约球吗？${this.data.userName}邀请你火速前往球场！与他一同甜蜜双排~`,

      desc: `天气如此晴朗，一起打个球吧~`,

      path: '/pages/index/index',

      imageUrl: 'https://upload-images.jianshu.io/upload_images/11958479-7d537d727ac02e4c.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'

    }
  }
})


