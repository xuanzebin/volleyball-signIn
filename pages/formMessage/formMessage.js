// pages/formMessage/formMessage.js
const app=getApp()
const AV = require('../.././libs/av-weapp-min.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formIndex:null,
    userList:[],
    signInList:[],
    leaveList:[],
    signInSum:0,
    leaveSum:0,
    userName:null
  },
  onLoad:function(e){
    this.setData({ formIndex: e.index, userName: app.globalData.userInfo.nickName})
  },
  onShow(e){
    this.setData({
      userList:[],
      signInList:[],
      leaveList:[],
      signInSum:0,
      leaveSum:0
    })
    new AV.Query('_user')
      .descending('createdAt')
      .find()
      .then(todos => {
        let userList = this.data.userList
        todos.forEach((value, index) => {
          let userMessage = {}
          userMessage.nickName = value.attributes.nickName
          userMessage.avatarUrl = value.attributes.avatarUrl
          userList.push(userMessage)
        })
        this.setData({ userList })

        let signInList = []
        let leaveList = []
        for (let key in app.data.formList[this.data.formIndex].signIn) {
          userList.forEach((value, index) => {
            if (value.nickName === key) {
              signInList.push(value)
            }
          })
        }
        for (let key in app.data.formList[this.data.formIndex].leave) {
          userList.forEach((value, index) => {
            if (value.nickName === key) {
              // if (value.nickName.length>4){
              //   value.nickName=value.nickName.slice(0,5)+'...'
              // }
              leaveList.push(value)
            }
          })
        }
        this.setData({
          signInList,
          leaveList,
          signInSum: signInList.length,
          leaveSum:leaveList.length
        })
      })
      .catch(console.error)
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